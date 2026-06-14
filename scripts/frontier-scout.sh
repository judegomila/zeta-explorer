#!/usr/bin/env bash
# scripts/frontier-scout.sh — anti-starvation layer 3 (2026-06-12).
#
# A USER-LAUNCHED daemon (same trust model as auto-improve*.sh: a human
# starts it; it then runs model passes on the API channel). It polls for
# scripts/.starvation-flag, which auto-ticket-producer.mjs raises when every
# deterministic ticket source (sub-gap harvesters, closesIf harvester,
# template bank) has been dry for consecutive passes and the opus-4-8 bucket
# is empty. On the flag, it runs ONE claude-opus-4-8 pass that reads the live
# research state and mints 4-6 new grounded tickets via seed-ticket.mjs,
# then clears the flag.
#
# Usage:
#   ./scripts/frontier-scout.sh start    # daemon (poll every 5 min)
#   ./scripts/frontier-scout.sh once     # single pass NOW (ignores flag)
#   ./scripts/frontier-scout.sh status
#   ./scripts/frontier-scout.sh stop
#
# Guard rails: producer arms the flag only after 2 dry passes with a 6h
# cooldown; pid sentinel here; 15-min hard timeout per pass; max 6 tickets
# per pass (enforced in the prompt + the producer daily cap audits the
# resulting queue); every ticket must cite the repo artifact grounding it;
# false-QED framing forbidden in the prompt.

set -u
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LOGDIR="$ROOT/scripts/logs/local-lane"
LOG="$LOGDIR/frontier-scout.log"
PIDFILE="/tmp/mathexplorer-frontier-scout.pid"
FLAG="$ROOT/scripts/.starvation-flag"
mkdir -p "$LOGDIR"

if [ -f "$ROOT/scripts/.env" ]; then
  set -a; . "$ROOT/scripts/.env"; set +a
fi

SCOUT_PROMPT='You are the FRONTIER SCOUT of the mathexplorer Lambda/RH research engine. The deterministic ticket sources are exhausted: every named openSubGap, openResidual, and closesIf in src/data has been worked. Your job: mint the NEXT wave of research tickets so the engine pool never idles.

MANDATORY PROCESS:
1. Read scripts/queue-index.json (small) for queue state.
2. Read src/data/lambda-roadmap.js currentStatus + LAMBDA_CHAIN_STEPS verification grades (use Grep/head — do not read the whole file).
3. Read the WHAT REMAINS / openSubGaps / verdict sections of the 6 most recently committed src/data modules (git log --name-only -15 -- src/data | grep "^src/data" | head -12, then head -100 each).
4. Identify 4-6 NEW work items, each grounded in a NAMED artifact you actually read (a verdict field, a residual the modules discuss but never formalized as a gap object, a cross-validation never tabulated, a constant never discharged, a consumer never re-pointed). Frontier directions are allowed (new attack angles on the E(N) bottleneck, the excursion cap, kappa_T literature) but each must cite the repo artifact that motivates it.
5. For each, run: node scripts/claim-ticket-id.mjs <next-number> to get an id, then node scripts/seed-ticket.mjs --id <id> --title "..." --priority high --category proof --proof-section S-frontier --description "..." --rationale "Frontier scout: <grounding artifact>" --model opus-4-8
   (derive <next-number> by grepping the max imp-NNNN in src/data/improvement-queue.js and adding 1; the claim script is race-safe.)
6. Print a summary line per minted ticket.

HARD RULES: NO false QED framing — descriptions must say assess/derive/measure/close, never claim results. NO duplicate of any pending or completed ticket title (grep improvement-queue.js for keywords first). NO package installs. NO edits to any file except via seed-ticket.mjs. Maximum 6 tickets. If you genuinely find nothing groundable, print "SCOUT: no groundable frontier found" and exit — that itself is signal.'

run_pass() {
  echo "[$(date -u +%FT%TZ)] frontier-scout pass starting (model claude-opus-4-8)" >> "$LOG"
  timeout 900 claude --print --model claude-opus-4-8 --dangerously-skip-permissions "$SCOUT_PROMPT" >> "$LOG" 2>&1
  rc=$?
  echo "[$(date -u +%FT%TZ)] frontier-scout pass done (rc=$rc)" >> "$LOG"
  rm -f "$FLAG"
}

case "${1:-}" in
  once)
    echo $$ > "$PIDFILE"; trap 'rm -f "$PIDFILE"' EXIT
    run_pass
    ;;
  start)
    if [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
      echo "frontier-scout already running (pid $(cat "$PIDFILE"))"; exit 0
    fi
    echo $$ > "$PIDFILE"; trap 'rm -f "$PIDFILE"' EXIT
    echo "[$(date -u +%FT%TZ)] frontier-scout daemon started (poll 300s)" >> "$LOG"
    while true; do
      if [ -f "$FLAG" ]; then run_pass; fi
      sleep 300
    done
    ;;
  status)
    if [ -f "$PIDFILE" ] && kill -0 "$(cat "$PIDFILE")" 2>/dev/null; then
      echo "frontier-scout RUNNING (pid $(cat "$PIDFILE"))"
    else
      echo "frontier-scout NOT running"
    fi
    [ -f "$FLAG" ] && echo "starvation flag: RAISED ($(cat "$FLAG"))" || echo "starvation flag: clear"
    tail -3 "$LOG" 2>/dev/null
    ;;
  stop)
    [ -f "$PIDFILE" ] && kill "$(cat "$PIDFILE")" 2>/dev/null && rm -f "$PIDFILE" && echo "stopped"
    ;;
  *)
    echo "usage: $0 {start|once|status|stop}"; exit 1
    ;;
esac
