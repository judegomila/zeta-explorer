#!/bin/bash
# scripts/deploy-hook-publisher.sh
#
# Publishes the live site via the Vercel DEPLOY HOOK when origin/main has new
# commits, AT MOST once per hour. This keeps Vercel auto-deploy OFF (so the
# autonomous fleet's per-commit pushes never trigger the deploy-fail storm)
# while keeping the live site reasonably fresh.
#
# COST NOTE: the deploy hook calls Vercel's build API directly — it triggers a
# Vercel build only, and creates NO git push / GitHub event, so it consumes
# ZERO GitHub Actions minutes. At the hourly cap it's at most ~24 lean ~1-min
# Vercel builds/day (only when commits actually landed), vs the hundreds/day the
# old per-commit auto-deploy caused.
#
# The hook URL is a SECRET, kept in scripts/.deploy-hook-url (gitignored).
#
# USAGE: ./scripts/deploy-hook-publisher.sh {start|stop|status}

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PID_FILE="$SCRIPT_DIR/.deploy-hook-publisher.pid"
LOG_FILE="$SCRIPT_DIR/logs/deploy-hook-publisher.log"
HOOK_FILE="$SCRIPT_DIR/.deploy-hook-url"
STATE_FILE="$SCRIPT_DIR/.deploy-hook-state"      # "<lastDeployedSha> <lastDeployEpoch>"
GATE_STATE_FILE="$SCRIPT_DIR/.deploy-hook-gate-state"  # "<lastGatedSha> pass|fail" (gate each SHA once)
POLL_INTERVAL="${DEPLOY_HOOK_POLL:-900}"         # check every 15 min
MIN_GAP="${DEPLOY_HOOK_MIN_GAP:-3600}"           # but publish at most once per hour
GATE_ENABLED="${DEPLOY_HOOK_GATE:-1}"            # 1 = run the browser health gate before publishing; 0 = skip (escape hatch)

mkdir -p "$SCRIPT_DIR/logs"

now_epoch() { date +%s; }
iso() { date -u +%FT%TZ; }

do_loop() {
  echo "[$(iso)] deploy-hook-publisher started (PID $$, poll ${POLL_INTERVAL}s, min-gap ${MIN_GAP}s)" >> "$LOG_FILE"
  while true; do
    if [ -f "$HOOK_FILE" ]; then
      hook="$(cat "$HOOK_FILE" 2>/dev/null)"
      cd "$PROJECT_DIR" 2>/dev/null || true
      git fetch origin main --quiet 2>/dev/null || true
      cur="$(git rev-parse origin/main 2>/dev/null || echo '')"
      last_sha=""; last_epoch=0
      if [ -f "$STATE_FILE" ]; then read -r last_sha last_epoch < "$STATE_FILE" 2>/dev/null || true; fi
      last_epoch="${last_epoch:-0}"
      gap=$(( $(now_epoch) - last_epoch ))
      if [ -n "$hook" ] && [ -n "$cur" ] && [ "$cur" != "$last_sha" ] && [ "$gap" -ge "$MIN_GAP" ]; then
        # Browser-based pre-deploy health gate: build origin/main in an isolated
        # worktree and run check-page-health (real Chromium) before firing the hook.
        # Vercel's own build is node-only and cannot catch browser-only page breakage.
        gated_sha=""; gated_result=""
        if [ -f "$GATE_STATE_FILE" ]; then read -r gated_sha gated_result < "$GATE_STATE_FILE" 2>/dev/null || true; fi
        if [ "$GATE_ENABLED" = "1" ] && [ "$cur" = "$gated_sha" ] && [ "$gated_result" = "fail" ]; then
          echo "[$(iso)] SKIP publish: ${cur:0:8} already FAILED the health gate; waiting for a fix commit" >> "$LOG_FILE"
        elif [ "$GATE_ENABLED" = "1" ] && ! "$SCRIPT_DIR/deploy-health-gate.sh" "$cur" >> "$LOG_FILE" 2>&1; then
          echo "$cur fail" > "$GATE_STATE_FILE"
          echo "[$(iso)] BLOCKED publish of ${cur:0:8}: health gate failed (see logs/health-gate-scan-${cur:0:8}.log)" >> "$LOG_FILE"
        else
          [ "$GATE_ENABLED" = "1" ] && echo "$cur pass" > "$GATE_STATE_FILE"
          code="$(curl -s -o /dev/null -w '%{http_code}' -X POST "$hook" 2>/dev/null || echo '000')"
          echo "$cur $(now_epoch)" > "$STATE_FILE"
          echo "[$(iso)] PUBLISHED origin/main ${cur:0:8} via deploy hook (HTTP $code); ${gap}s since last$([ "$GATE_ENABLED" = "1" ] && echo ' (health-gate PASS)')" >> "$LOG_FILE"
        fi
      fi
    else
      echo "[$(iso)] no hook URL at $HOOK_FILE — skipping this cycle" >> "$LOG_FILE"
    fi
    sleep "$POLL_INTERVAL"
  done
}

case "${1:-status}" in
  start)
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
      echo "deploy-hook-publisher already running (PID $(cat "$PID_FILE"))"; exit 0
    fi
    if [ ! -f "$HOOK_FILE" ]; then
      echo "refuse to start: $HOOK_FILE missing (create the Vercel deploy hook and save its URL there)"; exit 1
    fi
    nohup "$0" --daemon-loop > /dev/null 2>&1 &
    echo $! > "$PID_FILE"; disown
    echo "deploy-hook-publisher started (PID $(cat "$PID_FILE"), log: $LOG_FILE)"
    ;;
  stop)
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
      kill "$(cat "$PID_FILE")" 2>/dev/null || true; rm -f "$PID_FILE"; echo "deploy-hook-publisher stopped"
    else
      echo "deploy-hook-publisher not running"; rm -f "$PID_FILE"
    fi
    ;;
  status)
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
      echo "deploy-hook-publisher is RUNNING (PID $(cat "$PID_FILE"))"
      tail -3 "$LOG_FILE" 2>/dev/null | sed 's/^/  /'
    else
      echo "deploy-hook-publisher is NOT running"
    fi
    ;;
  --daemon-loop) do_loop ;;
  *) echo "usage: $0 {start|stop|status}"; exit 1 ;;
esac
