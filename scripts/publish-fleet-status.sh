#!/bin/bash
# Regenerate the Engine Room status and publish it to the secret gist the page
# reads (no Vercel build, no commit). Scheduled every 10 minutes by
# ~/Library/LaunchAgents/com.mathexplorer.fleet-status.plist.
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1
export GIT_TRACE2_EVENT=0
ID_FILE=scripts/.fleet-status-gist-id
[ -s "$ID_FILE" ] || { echo "missing $ID_FILE"; exit 2; }
OUT=/tmp/fleet-status-publish/fleet-status.json
mkdir -p "$(dirname "$OUT")"
git fetch -q origin "$(git rev-parse --abbrev-ref HEAD)" 2>/dev/null
FLEET_STATUS_OUT="$OUT" node scripts/fleet-status-writer.mjs > /dev/null 2>&1
[ -s "$OUT" ] || { echo "writer produced nothing"; exit 3; }
gh gist edit "$(cat "$ID_FILE")" -f fleet-status.json "$OUT" && echo "[$(date '+%F %T')] published $(grep -o '"generatedAt":"[^"]*"' "$OUT")"
