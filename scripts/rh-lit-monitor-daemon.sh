#!/bin/bash
# scripts/rh-lit-monitor-daemon.sh
#
# Durable weekly runner for rh-literature-monitor.mjs — scans arXiv math.NT for
# genuinely new seam-escaping RH inputs and appends HIGH candidates to
# scripts/logs/rh-lit-digest.md. Persists across Claude sessions (watchdog-
# supervised), unlike the session-only CronCreate scan-and-attack. It only
# MONITORS (writes the digest); firing an actual attack round needs the
# interactive harness, so review the digest each session and attack genuine hits.
#
# USAGE: ./scripts/rh-lit-monitor-daemon.sh {start|stop|status}

set -uo pipefail
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PID_FILE="$SCRIPT_DIR/.rh-lit-monitor.pid"
LOG_FILE="$SCRIPT_DIR/logs/rh-lit-monitor.log"
INTERVAL="${RH_LIT_INTERVAL:-604800}"   # weekly
mkdir -p "$SCRIPT_DIR/logs"
iso() { date -u +%FT%TZ; }

do_loop() {
  echo "[$(iso)] rh-lit-monitor started (PID $$, interval ${INTERVAL}s)" >> "$LOG_FILE"
  while true; do
    cd "$PROJECT_DIR" 2>/dev/null || true
    node "$SCRIPT_DIR/rh-literature-monitor.mjs" >> "$LOG_FILE" 2>&1 || echo "[$(iso)] monitor run failed" >> "$LOG_FILE"
    sleep "$INTERVAL"
  done
}

case "${1:-status}" in
  start)
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
      echo "rh-lit-monitor already running (PID $(cat "$PID_FILE"))"; exit 0
    fi
    nohup "$0" --daemon-loop > /dev/null 2>&1 &
    echo $! > "$PID_FILE"; disown
    echo "rh-lit-monitor started (PID $(cat "$PID_FILE"))"
    ;;
  stop)
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
      kill "$(cat "$PID_FILE")" 2>/dev/null || true; rm -f "$PID_FILE"; echo "rh-lit-monitor stopped"
    else echo "rh-lit-monitor not running"; rm -f "$PID_FILE"; fi
    ;;
  status)
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
      echo "rh-lit-monitor is RUNNING (PID $(cat "$PID_FILE"))"; tail -3 "$LOG_FILE" 2>/dev/null | sed 's/^/  /'
    else echo "rh-lit-monitor is NOT running"; fi
    ;;
  --daemon-loop) do_loop ;;
  *) echo "usage: $0 {start|stop|status}"; exit 1 ;;
esac
