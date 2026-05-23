#!/bin/bash
# scripts/queue-index-watcher.sh
# imp-1195: poll mtime of src/data/improvement-queue.js every WATCH_INTERVAL
# seconds; when it changes, regenerate scripts/queue-index.json. Independent
# daemon — no fswatch / inotify dependency, works on macOS + linux.
#
# WHY: Engines read scripts/queue-index.json (a small JSON cache) to find
# their next ticket without re-parsing the 17k-line improvement-queue.js.
# That cache is NOT auto-regenerated when the queue file changes — engines
# can spend hours ticking against stale buckets after a queue edit. This
# watcher closes that gap.
#
# PROVEN PROBLEM (observed 2026-05-22 → 2026-05-23): after wave-9 closed
# out the haiku and sonnet model-buckets, both engines went 14 hours
# with zero commits because the index still showed their old (empty)
# buckets. Force-regen on demand fixes it; this daemon makes it automatic.
#
# DETECTION:
#   Poll mtime via `stat -f %m` (macOS) or `stat -c %Y` (linux).
#   If mtime changed since last run, invoke build-queue-index.mjs.
#   Otherwise sleep.
#
# DEBOUNCE:
#   If multiple edits land within DEBOUNCE_SECS, regenerate once after
#   the burst settles (avoids regen-storm during a wave-seed commit).
#
# USAGE:
#   ./scripts/queue-index-watcher.sh start
#   ./scripts/queue-index-watcher.sh stop
#   ./scripts/queue-index-watcher.sh status
#   ./scripts/queue-index-watcher.sh --daemon-loop  # internal; do not call

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
QUEUE_FILE="$PROJECT_DIR/src/data/improvement-queue.js"
INDEX_FILE="$SCRIPT_DIR/queue-index.json"
BUILDER="$SCRIPT_DIR/build-queue-index.mjs"
PID_FILE="$SCRIPT_DIR/.queue-index-watcher.pid"
LOG_FILE="$SCRIPT_DIR/logs/queue-index-watcher.log"
STATE_FILE="$SCRIPT_DIR/.queue-index-watcher.last-mtime"
WATCH_INTERVAL="${QUEUE_WATCH_INTERVAL:-10}"
DEBOUNCE_SECS="${QUEUE_WATCH_DEBOUNCE:-5}"

mkdir -p "$SCRIPT_DIR/logs"

# ── helpers ─────────────────────────────────────────────────────────────────

iso_utc() { date -u +%FT%TZ; }

queue_mtime() {
  if [[ "$OSTYPE" == "darwin"* ]]; then
    stat -f %m "$QUEUE_FILE" 2>/dev/null || echo 0
  else
    stat -c %Y "$QUEUE_FILE" 2>/dev/null || echo 0
  fi
}

regenerate_index() {
  echo "[$(iso_utc)] regenerating queue-index.json" >> "$LOG_FILE"
  if node "$BUILDER" --force >> "$LOG_FILE" 2>&1; then
    echo "[$(iso_utc)] regenerate OK" >> "$LOG_FILE"
    return 0
  else
    echo "[$(iso_utc)] regenerate FAILED" >> "$LOG_FILE"
    return 1
  fi
}

# ── main subcommand dispatch ────────────────────────────────────────────────

case "${1:-status}" in
  --daemon-loop)
    echo "[$(iso_utc)] queue-index-watcher started (PID $$, interval ${WATCH_INTERVAL}s, debounce ${DEBOUNCE_SECS}s)" >> "$LOG_FILE"
    [ -f "$STATE_FILE" ] || echo 0 > "$STATE_FILE"
    last_seen=$(cat "$STATE_FILE")
    pending_regen_at=0
    while true; do
      now=$(date +%s)
      current_mtime=$(queue_mtime)
      if [ "$current_mtime" -gt "$last_seen" ]; then
        # Edit detected — schedule a debounced regen.
        pending_regen_at=$(( now + DEBOUNCE_SECS ))
        last_seen=$current_mtime
        echo "$last_seen" > "$STATE_FILE"
        echo "[$(iso_utc)] queue file changed (mtime=$current_mtime), regen scheduled at +${DEBOUNCE_SECS}s" >> "$LOG_FILE"
      fi
      if [ "$pending_regen_at" -ne 0 ] && [ "$now" -ge "$pending_regen_at" ]; then
        regenerate_index
        pending_regen_at=0
      fi
      sleep "$WATCH_INTERVAL"
    done
    ;;

  start)
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
      echo "Queue-index watcher already running (PID $(cat "$PID_FILE"))"
      exit 0
    fi
    # On first start, force-regen so we're in sync.
    echo "[$(iso_utc)] initial regen on start" >> "$LOG_FILE"
    regenerate_index
    nohup "$0" --daemon-loop > /dev/null 2>&1 &
    echo $! > "$PID_FILE"
    echo "Queue-index watcher started (PID $!, log: $LOG_FILE)"
    ;;

  stop)
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
      pid=$(cat "$PID_FILE")
      kill "$pid" 2>/dev/null || true
      rm -f "$PID_FILE"
      echo "Queue-index watcher stopped (was PID $pid)"
    else
      echo "Queue-index watcher not running"
      rm -f "$PID_FILE"
    fi
    ;;

  status)
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
      pid=$(cat "$PID_FILE")
      echo "Queue-index watcher is RUNNING (PID $pid)"
      echo "Recent log tail:"
      tail -10 "$LOG_FILE" 2>/dev/null | sed 's/^/  /'
    else
      echo "Queue-index watcher is NOT running"
    fi
    ;;

  *)
    echo "Usage: $0 {start|stop|status|--daemon-loop}"
    exit 1
    ;;
esac
