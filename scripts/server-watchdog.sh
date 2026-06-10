#!/usr/bin/env bash
# scripts/server-watchdog.sh — keep the dist/ static server on :3003 alive.
#
# Found 2026-06-10 during the end-to-end app check: server.js had silently
# died (curl 000) and nothing restarts it — engine-watchdog.sh only watches
# the improvement engines. This watchdog probes / every 30s and relaunches
# node server.js when the probe fails twice in a row.
#
# Usage:
#   nohup ./scripts/server-watchdog.sh > /tmp/server-watchdog.log 2>&1 &
#
# Writes a pid sentinel so duplicate watchdogs exit early.

set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PIDFILE="/tmp/mathexplorer-server-watchdog.pid"
PROBE_URL="http://localhost:3003/"

if [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
  echo "server-watchdog already running (pid $(cat "$PIDFILE")); exiting"
  exit 0
fi
echo $$ > "$PIDFILE"

fails=0
while true; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "$PROBE_URL" 2>/dev/null || echo 000)
  if [ "$code" = "200" ]; then
    fails=0
  else
    fails=$((fails + 1))
    echo "[$(date -u +%FT%TZ)] probe failed ($code), strike $fails/2"
    if [ "$fails" -ge 2 ]; then
      echo "[$(date -u +%FT%TZ)] restarting server.js"
      pkill -f "node server.js" 2>/dev/null
      sleep 1
      (cd "$ROOT" && nohup node server.js >> /tmp/mathserver.log 2>&1 &)
      fails=0
      sleep 5
    fi
  fi
  sleep 30
done
