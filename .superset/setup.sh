#!/usr/bin/env bash
# Runs when a Superset workspace is created. Safe to re-run.
source "$(dirname "$0")/lib.sh"
cd "$WORKSPACE_PATH"

# 1. Copy untracked env files (.env, .env.local, apps/web/.env, ...) from the
#    main checkout. Existing files in the workspace are never overwritten.
if [ -n "$ROOT_PATH" ] && [ -d "$ROOT_PATH" ] && [ "$ROOT_PATH" != "$WORKSPACE_PATH" ]; then
  while IFS= read -r -d '' src; do
    rel="${src#"$ROOT_PATH"/}"
    git -C "$ROOT_PATH" ls-files --error-unmatch -- "$rel" >/dev/null 2>&1 && continue
    if [ -e "$rel" ]; then
      log "Keeping existing $rel"
    else
      mkdir -p "$(dirname "$rel")"
      cp -p "$src" "$rel"
      log "Copied $rel"
    fi
  done < <(find "$ROOT_PATH" \( -name .git -o -name node_modules \) -prune -o -type f -name '.env*' -print0)
else
  log "SUPERSET_ROOT_PATH not set; skipping env copy"
fi

# 2. Install dependencies with whichever package manager the lockfile implies.
case "$(detect_pm)" in
  bun) bun install --frozen-lockfile ;;
  pnpm) pnpm install --frozen-lockfile ;;
  yarn) yarn install ;;
  npm) if [ -f package-lock.json ]; then npm ci; else npm install; fi ;;
  "") log "No package.json yet; skipping dependency install" ;;
esac

# 3. Reserve this workspace's port block.
port="$(allocate_port)"
log "Dev server port for this workspace: $port (block $port-$((port + PORT_BLOCK_SIZE - 1)))"
