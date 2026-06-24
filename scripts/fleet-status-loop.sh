#!/usr/bin/env bash
# Keeps public/fleet-status.json fresh for the Engine Room page. Runs the writer
# every ~45s; commits ONLY when it meaningfully changed (a ticket landed / pending
# moved) and at least MIN_GAP since the last status commit -- so commits track real
# progress, not a fixed heartbeat. Commits a single pathspec (never bundles a
# sibling engine's staged changes). The push-watcher pushes.
set -u
cd "$(dirname "$0")/.." || exit 1
MIN_GAP=${STATUS_MIN_GAP:-120}   # min seconds between status commits
SLEEP=${STATUS_SLEEP:-45}
last_commit=0

case "${1:-}" in
  start)
    nohup "$0" --daemon-loop > /tmp/fleet-status-loop.log 2>&1 &
    echo "fleet-status-loop started (pid $!)"; exit 0 ;;
  stop)
    pkill -f "fleet-status-loop.sh --daemon-loop" && echo "stopped" || echo "not running"; exit 0 ;;
esac

[ "${1:-}" = "--daemon-loop" ] || { echo "usage: $0 start|stop"; exit 1; }

while true; do
  node scripts/fleet-status-writer.mjs >/dev/null 2>&1
  rc=$?
  now=$(date +%s)
  if [ "$rc" = "10" ] && [ $((now - last_commit)) -ge "$MIN_GAP" ]; then
    if [ ! -f .git/index.lock ]; then
      pend=$(node -e "try{console.log(JSON.parse(require('fs').readFileSync('public/fleet-status.json')).queue.pending)}catch(e){console.log('?')}" 2>/dev/null)
      ch=$(node -e "try{const s=JSON.parse(require('fs').readFileSync('public/fleet-status.json'));console.log(s.git.commits24h+'done/24h '+s.fleet.totalWorkers+'w')}catch(e){console.log('')}" 2>/dev/null)
      git commit public/fleet-status.json -m "chore(status): ${pend} pending, ${ch}" >/dev/null 2>&1 && last_commit=$now
    fi
  fi
  sleep "$SLEEP"
done
