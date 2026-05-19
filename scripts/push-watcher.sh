#!/bin/bash
# Defensive push-watcher — polls every 60s for unpushed commits and pushes
# them. Independent of all engines so a stalled engine (heartbeat dead,
# stuck on a heavy ticket, etc.) cannot strand commits locally.
#
# Pairs with the in-engine PUSH_EVERY=5 auto-push (auto-improve*.sh) as
# belt-and-suspenders: engines push proactively after every 5 runs, this
# watcher catches anything an engine missed (e.g. shipped a commit then
# stalled before reaching the next push tick).
#
# Usage:
#   ./scripts/push-watcher.sh start   # detach as background daemon
#   ./scripts/push-watcher.sh stop
#   ./scripts/push-watcher.sh status
#   ./scripts/push-watcher.sh --daemon-loop   # internal; do not call directly

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PID_FILE="$SCRIPT_DIR/.push-watcher.pid"
LOG_FILE="$SCRIPT_DIR/logs/push-watcher.log"
INTERVAL=60   # seconds between checks

mkdir -p "$SCRIPT_DIR/logs"

case "${1:-status}" in
  --daemon-loop)
    echo "[$(date -u +%FT%TZ)] push-watcher started (PID $$, interval ${INTERVAL}s)" >> "$LOG_FILE"
    while true; do
      cd "$PROJECT_DIR" || exit 1
      git fetch origin --quiet 2>/dev/null || true
      unpushed=$(git log --oneline @{u}..HEAD 2>/dev/null | wc -l | tr -d ' ')
      if [ "${unpushed:-0}" -gt 0 ]; then
        ts=$(date -u +%FT%TZ)
        echo "[$ts] $unpushed unpushed commit(s) — pushing..." >> "$LOG_FILE"
        if git push origin main >> "$LOG_FILE" 2>&1; then
          echo "[$ts] push OK" >> "$LOG_FILE"
        else
          echo "[$ts] push failed (non-fatal; retry in ${INTERVAL}s)" >> "$LOG_FILE"
        fi
      fi
      sleep "$INTERVAL"
    done
    ;;
  start)
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
      echo "push-watcher already running (PID $(cat "$PID_FILE"))"
      exit 0
    fi
    nohup bash "$0" --daemon-loop >> "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
    echo "push-watcher started (PID $!, log: $LOG_FILE)"
    ;;
  stop)
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
      kill "$(cat "$PID_FILE")"
      rm -f "$PID_FILE"
      echo "push-watcher stopped"
    else
      echo "push-watcher not running"
      rm -f "$PID_FILE"
    fi
    ;;
  status)
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
      echo "push-watcher RUNNING (PID $(cat "$PID_FILE"))"
      echo "Last 5 log lines:"
      tail -5 "$LOG_FILE" 2>/dev/null | sed 's/^/  /'
    else
      echo "push-watcher NOT running"
    fi
    ;;
  *)
    echo "Usage: $0 {start|stop|status}"
    exit 1
    ;;
esac
