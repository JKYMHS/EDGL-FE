# Shared helpers for the Superset lifecycle scripts. Sourced, not executed.
#
# Ports: Superset does not assign per-workspace ports, so each workspace
# reserves a block of PORT_BLOCK_SIZE ports in a registry shared by all
# workspaces on this machine. The dev server uses the first port of the block;
# the rest are free for anything else the workspace needs (HMR, storybook, ...).

set -euo pipefail

WORKSPACE_PATH="${SUPERSET_WORKSPACE_PATH:-$(git rev-parse --show-toplevel)}"
ROOT_PATH="${SUPERSET_ROOT_PATH:-}"

PORT_RANGE_START="${SUPERSET_PORT_RANGE_START:-3100}"
PORT_RANGE_END="${SUPERSET_PORT_RANGE_END:-3990}"
PORT_BLOCK_SIZE=10
PORT_REGISTRY="${SUPERSET_HOME_DIR:-$HOME/.superset}/port-allocations.tsv"
PORT_LOCK="$PORT_REGISTRY.lock"

# Per-worktree state lives in the worktree's private git dir, so nothing
# needs to be gitignored and it disappears with the worktree.
STATE_DIR="$(git -C "$WORKSPACE_PATH" rev-parse --absolute-git-dir)/superset"
RUN_PID_FILE="$STATE_DIR/run.pid"

log() { printf '[superset] %s\n' "$*"; }

port_in_use() {
  (exec 3<>"/dev/tcp/127.0.0.1/$1") 2>/dev/null
}

# mkdir is atomic everywhere (flock is not available on macOS).
with_registry_lock() {
  mkdir -p "$(dirname "$PORT_REGISTRY")"
  local tries=0
  until mkdir "$PORT_LOCK" 2>/dev/null; do
    tries=$((tries + 1))
    if [ "$tries" -ge 100 ]; then
      log "Breaking stale lock $PORT_LOCK"
      rm -rf "$PORT_LOCK"
    fi
    sleep 0.1
  done
  local status=0
  "$@" || status=$?
  rm -rf "$PORT_LOCK"
  return "$status"
}

# Drop entries whose worktree no longer exists (deleted without teardown).
_prune_registry() {
  [ -f "$PORT_REGISTRY" ] || return 0
  local tmp="$PORT_REGISTRY.tmp.$$" port path
  : >"$tmp"
  while IFS=$'\t' read -r port path; do
    [ -n "$port" ] && [ -d "$path" ] && printf '%s\t%s\n' "$port" "$path" >>"$tmp"
  done <"$PORT_REGISTRY"
  mv "$tmp" "$PORT_REGISTRY"
}

_lookup_port() {
  [ -f "$PORT_REGISTRY" ] || return 1
  awk -F'\t' -v p="$WORKSPACE_PATH" '$2 == p { print $1; found = 1; exit } END { exit !found }' "$PORT_REGISTRY"
}

_allocate_port() {
  _prune_registry
  if _lookup_port; then return 0; fi
  local base
  for ((base = PORT_RANGE_START; base <= PORT_RANGE_END; base += PORT_BLOCK_SIZE)); do
    if [ -f "$PORT_REGISTRY" ] && awk -F'\t' -v b="$base" '$1 == b { found = 1 } END { exit !found }' "$PORT_REGISTRY"; then
      continue
    fi
    port_in_use "$base" && continue
    printf '%s\t%s\n' "$base" "$WORKSPACE_PATH" >>"$PORT_REGISTRY"
    echo "$base"
    return 0
  done
  log "No free port block in $PORT_RANGE_START-$PORT_RANGE_END" >&2
  return 1
}

_release_port() {
  [ -f "$PORT_REGISTRY" ] || return 0
  local tmp="$PORT_REGISTRY.tmp.$$"
  awk -F'\t' -v p="$WORKSPACE_PATH" '$2 != p' "$PORT_REGISTRY" >"$tmp"
  mv "$tmp" "$PORT_REGISTRY"
}

allocate_port() { with_registry_lock _allocate_port; }
release_port() { with_registry_lock _release_port; }

# Prints the package manager for the worktree, or nothing if there is no package.json.
detect_pm() {
  [ -f "$WORKSPACE_PATH/package.json" ] || return 0
  if [ -f "$WORKSPACE_PATH/bun.lock" ] || [ -f "$WORKSPACE_PATH/bun.lockb" ]; then echo bun
  elif [ -f "$WORKSPACE_PATH/pnpm-lock.yaml" ]; then echo pnpm
  elif [ -f "$WORKSPACE_PATH/yarn.lock" ]; then echo yarn
  else echo npm
  fi
}

has_dependency() {
  grep -Eq "\"$1\"[[:space:]]*:" "$WORKSPACE_PATH/package.json"
}
