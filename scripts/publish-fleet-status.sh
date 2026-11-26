#!/bin/bash
# Regenerate the Engine Room status and publish it to the gist the page reads
# (no Vercel build, no commit). Scheduled every 10 minutes by the launchd job
# com.mathexplorer.fleet-status (plist under ~/Library/LaunchAgents).
#
# The gist is fetched by a public page, so its content is public. The writer
# sanitises free text and refuses to write anything unpublishable; this script
# scans the file once more and publishes nothing if the scan fails.
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1
export GIT_TRACE2_EVENT=0
ID_FILE=scripts/.fleet-status-gist-id
[ -s "$ID_FILE" ] || { echo "missing $ID_FILE"; exit 2; }
OUT=/tmp/fleet-status-publish/fleet-status.json
mkdir -p "$(dirname "$OUT")"
git fetch -q origin "$(git rev-parse --abbrev-ref HEAD)" 2>/dev/null
rm -f "$OUT"
FLEET_STATUS_OUT="$OUT" node scripts/fleet-status-writer.mjs > /dev/null 2>&1
[ -s "$OUT" ] || { echo "writer produced nothing (or refused: unpublishable content)"; exit 3; }
node scripts/engine-guard.mjs scan --scope ledger "$OUT" || { echo "status file failed the public-content scan; not published"; exit 4; }
gh gist edit "$(cat "$ID_FILE")" -f fleet-status.json "$OUT" && echo "[$(date '+%F %T')] published $(grep -o '"generatedAt":"[^"]*"' "$OUT")"
