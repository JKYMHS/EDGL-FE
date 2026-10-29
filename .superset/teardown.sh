#!/usr/bin/env bash
# Runs when a Superset workspace is deleted. Stops the dev server and frees
# the port block reserved by setup.sh.
source "$(dirname "$0")/lib.sh"

if [ -f "$RUN_PID_FILE" ]; then
  pid="$(cat "$RUN_PID_FILE")"
  if kill -0 "$pid" 2>/dev/null; then
    log "Stopping dev server (pid $pid)"
    pkill -TERM -P "$pid" 2>/dev/null || true
    kill -TERM "$pid" 2>/dev/null || true
  fi
  rm -f "$RUN_PID_FILE"
fi

release_port
log "Released port reservation for $WORKSPACE_PATH"
