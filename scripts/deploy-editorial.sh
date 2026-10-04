#!/bin/bash
# scripts/deploy-editorial.sh — publish origin/editorial-redesign to zetaexplorer.vercel.app.
#
# Per-push Vercel builds are OFF for editorial-redesign (vercel.json
# git.deploymentEnabled) to keep build cost bounded while engines push. This
# script is the only publish path:
#   1. fetch origin/editorial-redesign; skip if that SHA is already live
#      (unless --force)
#   2. browser health gate on that SHA (scripts/deploy-health-gate.sh);
#      skip with --no-gate
#   3. trigger ONE Vercel build via the branch deploy hook
#      (secret URL in gitignored scripts/.deploy-hook-url-editorial)
#   4. wait for the preview deployment of that SHA to be Ready
#   5. alias it to zetaexplorer.vercel.app
#   6. smoke-check the live site in headless Chromium
# State: scripts/.deploy-editorial-state (gitignored) holds the last published SHA.
#
# Usage: scripts/deploy-editorial.sh [--force] [--no-gate]
# Scheduled every 3 days by ~/Library/LaunchAgents/com.mathexplorer.deploy-editorial.plist;
# run by hand after major changes. Push first: this publishes what is on GitHub.
set -uo pipefail
cd "$(dirname "$0")/.." || exit 1
export GIT_TRACE2_EVENT=0
ALIAS=zetaexplorer.vercel.app
HOOK_FILE=scripts/.deploy-hook-url-editorial
STATE=scripts/.deploy-editorial-state
LOG=scripts/.deploy-editorial.log
FORCE=0; GATE=1
for a in "$@"; do case "$a" in --force) FORCE=1 ;; --no-gate) GATE=0 ;; esac; done
log() { echo "[$(date '+%F %T')] $*" | tee -a "$LOG"; }
# run a vercel command with a hard time limit (the CLI can hang)
vc() { local t=$1; shift; vercel "$@" > /tmp/deploy-editorial-vc.$$ 2>&1 & local p=$!; local i=0; while kill -0 $p 2>/dev/null && [ $i -lt "$t" ]; do sleep 1; i=$((i+1)); done; kill $p 2>/dev/null; cat /tmp/deploy-editorial-vc.$$; rm -f /tmp/deploy-editorial-vc.$$; }

[ -s "$HOOK_FILE" ] || { log "FAIL: missing $HOOK_FILE"; exit 2; }
git fetch -q origin editorial-redesign || { log "FAIL: git fetch"; exit 2; }
SHA=$(git rev-parse origin/editorial-redesign)
if [ "$FORCE" = 0 ] && [ -f "$STATE" ] && [ "$(cat "$STATE")" = "$SHA" ]; then log "SKIP: $SHA already published"; exit 0; fi
log "target $SHA"

if [ "$GATE" = 1 ]; then
  if ! bash scripts/deploy-health-gate.sh "$SHA" >> "$LOG" 2>&1; then log "FAIL: health gate red for $SHA (see $LOG); not publishing"; exit 3; fi
  log "health gate PASS"
fi

curl -s -X POST "$(cat "$HOOK_FILE")" > /dev/null || { log "FAIL: hook POST"; exit 2; }
log "build triggered"

URL=""
for i in $(seq 1 40); do
  sleep 30
  row=$(vc 60 ls -m "githubCommitSha=$SHA" | grep -E 'https://mathexplorer-' | head -1)
  u=$(echo "$row" | grep -o -E 'https://mathexplorer-[a-z0-9]+-judegomila-gmailcoms-projects\.vercel\.app' | head -1)
  if echo "$row" | grep -q 'Ready'; then URL=$u; break; fi
  if echo "$row" | grep -q -E 'Error|Canceled'; then log "FAIL: build $u errored"; exit 4; fi
done
[ -n "$URL" ] || { log "FAIL: no Ready deployment for $SHA after 20 min"; exit 4; }
log "ready $URL"

vc 90 alias set "$URL" "$ALIAS" | tail -1 | tee -a "$LOG"

if node scripts/deploy-editorial-smoke.mjs "https://$ALIAS" >> "$LOG" 2>&1; then
  echo "$SHA" > "$STATE"; log "PUBLISHED $SHA -> $ALIAS"
else
  log "WARN: smoke check failed after alias; previous state kept"; exit 5
fi
