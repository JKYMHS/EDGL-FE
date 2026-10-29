#!/usr/bin/env bash
# Started by the Superset Run button. Launches the dev server on this
# workspace's reserved port.
source "$(dirname "$0")/lib.sh"
cd "$WORKSPACE_PATH"

pm="$(detect_pm)"
if [ -z "$pm" ]; then
  log "No package.json in $WORKSPACE_PATH; nothing to run yet."
  exit 1
fi

port="$(allocate_port)"
if port_in_use "$port"; then
  log "Port $port is already in use. Stop the other process (or the previous run) and try again."
  exit 1
fi

export PORT="$port"
export SUPERSET_PORT_BLOCK_START="$port"
export SUPERSET_PORT_BLOCK_END="$((port + PORT_BLOCK_SIZE - 1))"

# Most frameworks ignore $PORT, so pass the port as a flag where we know it.
args=()
if has_dependency vite; then
  args=(--port "$port" --strictPort)
elif has_dependency next; then
  args=(-p "$port")
fi

mkdir -p "$STATE_DIR"
echo $$ >"$RUN_PID_FILE"

log "Starting dev server on http://localhost:$port"
if [ "${#args[@]}" -gt 0 ]; then
  [ "$pm" = npm ] && exec npm run dev -- "${args[@]}"
  exec "$pm" run dev "${args[@]}"
fi
exec "$pm" run dev
