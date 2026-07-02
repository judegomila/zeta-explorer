#!/usr/bin/env bash
# Auto-Improvement Engine for ZPO Explorer — FABLE-5 FRONTIER TIER
# Usage: ./scripts/auto-improve-fable.sh [start|stop|status|oneshot]
#
# Dedicated PREMIUM FRONTIER engine on Claude Fable 5 (model string
# "claude-fable-5[1m]", the 1M-context variant; the bare "claude-fable-5"
# reports "unavailable"). Fable 5 is positioned as "most capable for your
# hardest and longest-running tasks" at $10/$50 per Mtok, so this engine is
# NOT for bulk polish (that stays on haiku/sonnet). It makes DEEP, adversarially
# self-checked progress on ONE named frontier residual per run:
#
#   THE DETERMINISTIC RESIDUAL (both the C_H-wall and metric-rearchitecture
#   frontier assaults converged here): close the CLOSED-FORM multi-body
#   isolation constant c in [0.72, 1) of sg1c R2-T
#   (openSubGap 'sg1c-r2-isolation-persistence' in sg1c-theta-trap-theorems.js).
#   Single-shell is closed (imp-3005: c* = sqrt(2+sqrt3)-1 ~ 0.9319); the
#   MULTI-BODY (asymmetric) case is only numerically scanned to ~0.943, NOT
#   closed in form. This residual is DETERMINISTIC, not RH-hard.
#
# Premium cadence: long interval, low run cap. Not auto-started; fire manually.
# HARD RULE the prompt enforces: no false QED, honest PARTIAL if no rigorous
# step lands, Platt-Trudgian Lambda <= 0.2 stays the SOTA.

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PID_FILE="$SCRIPT_DIR/.auto-improve-fable.pid"
LOG_DIR="$SCRIPT_DIR/logs"
INTERVAL=600   # 10 min — premium model, deliberate cadence (spend control).
MAX_RUNS=20    # low cap — a frontier engine, not a polish loop.
MODEL='claude-fable-5[1m]'  # entitled 1M-context variant; bare id 404s.

# shellcheck disable=SC1091
. "$SCRIPT_DIR/engine-prompt-shared.sh"

_FABLE_STEPS='1. TARGET: the multi-body (asymmetric) closure of the sg1c R2-T isolation
constant c in [0.72, 1). Read src/data/sg1c-theta-trap-theorems.js (Theorem C and
the openSubGap sg1c-r2-isolation-persistence), plus the two frontier verdicts
src/data/ch-wall-frontier-verdict-2026-06-26.js and
src/data/econn-metric-rearchitecture-verdict-2026-06-30.js so you attack the CURRENT
state, not a stale one. imp-3005 already closed the SINGLE-SHELL case in closed form
(c* = sqrt(2+sqrt3)-1 ~ 0.9319). The open piece is the MULTI-BODY asymmetric shell.

2. Make ONE genuine, rigorous step toward a CLOSED-FORM multi-body isolation constant
(or a rigorous sub-lemma / a sharpened bracket). Prefer analysis that reduces the
multi-shell product bound to the single-shell one, or a Schur/majorization argument
across shells. Numerics are allowed ONLY to CROSS-CHECK an analytic claim, never as
the claim itself.

3. ADVERSARIAL SELF-CHECK before writing anything: try hard to REFUTE your own step.
If it survives, record it. If it does not, record the HONEST PARTIAL and what the
wall is. Do NOT dress a numerical scan up as a proof. Do NOT claim RH or claim the
finite-N Lambda beat became rigorous. Platt-Trudgian Lambda <= 0.2 REMAINS the SOTA.

4. OUTPUT: if a rigorous step lands, add or extend a small data module under src/data/
(a plain object + a few assertions that THROW on violation, in the style of the two
verdict modules above), and wire its assertions so npm run build exercises them. If
only a partial lands, append an honest NOTE to the openSubGap sg1c-r2-isolation-
persistence describing the exact remaining obstruction. Keep imports LIGHT — never
import the 16.7MB zeros bundle into anything a page can reach.

5. Run: npm run build. Fix any failure before finishing.

6. Log to src/data/improvements.js via the tail-append pattern (use
scripts/queue-index.json nextImprovementId for the id; do NOT read the full file):
  { id: NEXT, timestamp: "UTC", category: "numerical|accuracy|meta|content",
    summary: "...", files: [...], detail: "2-3 sentences",
    model: "fable-5", channel: "fable" },

7. Create a git commit with a descriptive message that states clearly whether this was
a RIGOROUS step or an honest PARTIAL. Never imply a closure that did not happen.'

IMPROVE_PROMPT="You are the FABLE-5 FRONTIER tier of the ZPO Explorer / RH-attack engine — the
most capable model, pointed at the single hardest deterministic residual. Your task:

$PROMPT_TOKEN_BUDGET

$_FABLE_STEPS

$PROMPT_SYNTAX_GOTCHAS

RULES:
- ONE deep, honest step per run. No false QED. Honest PARTIAL beats a fake closure.
- This residual is DETERMINISTIC, not RH-hard — but do not overstate what one step buys.
$PROMPT_COMMON_RULES_SUFFIX"

mkdir -p "$LOG_DIR"

run_once() {
  local tag="$1"          # human tag for logs
  local timestamp; timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
  local log_file="$LOG_DIR/run_fable_${timestamp//[:T]/_}.log"
  echo "=== Fable-5 Frontier ${tag} at $timestamp (model $MODEL) ===" | tee "$log_file"

  node "$SCRIPT_DIR/build-queue-index.mjs" >> "$log_file" 2>&1 || true
  local pre_run_sha; pre_run_sha=$(git -C "$PROJECT_DIR" rev-parse HEAD 2>/dev/null || echo "")

  if ! command -v claude &>/dev/null; then
    echo "ERROR: 'claude' CLI not found in PATH" | tee -a "$log_file"
    return 79
  fi

  ( cd "$PROJECT_DIR"
    unset CLAUDECODE
    if [ -f "$SCRIPT_DIR/.env" ]; then set -a; . "$SCRIPT_DIR/.env"; set +a; fi
    claude --print --strict-mcp-config --dangerously-skip-permissions --model "$MODEL" "$IMPROVE_PROMPT" \
      >> "$log_file" 2>&1
  ) || true

  echo "=== Fable-5 ${tag} complete ===" | tee -a "$log_file"
  local post_run_sha; post_run_sha=$(git -C "$PROJECT_DIR" rev-parse HEAD 2>/dev/null || echo "")
  if [ -n "$pre_run_sha" ] && [ "$post_run_sha" != "$pre_run_sha" ]; then
    echo "  committed: $(git -C "$PROJECT_DIR" log -1 --pretty=%s)" | tee -a "$log_file"
  else
    echo "  (no commit this run — likely an honest partial; see log)" | tee -a "$log_file"
  fi
  echo "$log_file"
}

do_oneshot() {
  echo "Fable-5 Frontier — SINGLE run on the multi-body isolation constant c."
  echo "  Model: $MODEL"
  local lf; lf=$(run_once "oneshot" | tail -1)
  echo "Done. Log: $lf"
  echo "Last 12 lines:"; tail -12 "$lf" 2>/dev/null | sed 's/^/  /'
}

do_start() {
  if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    echo "Auto-improve FABLE is already running (PID $(cat "$PID_FILE"))"; exit 1
  fi
  echo "Starting FABLE-5 FRONTIER engine..."
  echo "  Model:    $MODEL  (PREMIUM — \$10/\$50 per Mtok)"
  echo "  Interval: ${INTERVAL}s ($(( INTERVAL / 60 )) min)   Max runs: $MAX_RUNS"
  echo "  Target:   sg1c R2-T multi-body isolation constant c (deterministic residual)"
  echo "  Logs:     $LOG_DIR (run_fable_*.log)"
  ( run_count=0
    while [ "$run_count" -lt "$MAX_RUNS" ]; do
      run_count=$((run_count + 1))
      lf=$(run_once "Run #$run_count" | tail -1)
      # rate-limit backoff (simple): on hit, sleep an extra INTERVAL
      extra=0
      if grep -qiE "rate.?limit|429|quota.?exceed|API Error|too many requests|overloaded" "$lf" 2>/dev/null; then
        extra=$INTERVAL
        echo "RATE LIMIT on Fable run #$run_count — extra ${extra}s backoff" | tee -a "$lf"
      fi
      # auto-push every 3 runs
      if [ "$((run_count % 3))" -eq 0 ]; then
        unpushed=$(git -C "$PROJECT_DIR" log --oneline @{u}..HEAD 2>/dev/null | wc -l | tr -d ' ')
        [ "${unpushed:-0}" -gt 0 ] && git -C "$PROJECT_DIR" push >> "$lf" 2>&1 || true
      fi
      [ "$run_count" -lt "$MAX_RUNS" ] && sleep $((INTERVAL + extra))
    done
    echo "FABLE-5 frontier engine completed $run_count runs. Stopping."
    rm -f "$PID_FILE"
  ) &
  local bg_pid=$!
  echo "$bg_pid" > "$PID_FILE"; disown
  echo "FABLE-5 frontier engine started in background (PID $bg_pid)"
}

do_stop() {
  if [ ! -f "$PID_FILE" ]; then echo "Auto-improve FABLE is not running (no PID file)"; exit 0; fi
  pid=$(cat "$PID_FILE")
  if kill -0 "$pid" 2>/dev/null; then
    echo "Stopping FABLE-5 engine (PID $pid)..."
    pkill -P "$pid" 2>/dev/null || true
    kill "$pid" 2>/dev/null || true
    rm -f "$PID_FILE"; echo "Stopped."
  else
    echo "Process $pid not found. Cleaning up PID file."; rm -f "$PID_FILE"
  fi
}

do_status() {
  if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    echo "FABLE-5 frontier engine is RUNNING (PID $(cat "$PID_FILE"))"
  else
    echo "FABLE-5 frontier engine is NOT running"
    [ -f "$PID_FILE" ] && rm -f "$PID_FILE"
  fi
  local n; n=$(ls "$LOG_DIR"/run_fable_*.log 2>/dev/null | wc -l | tr -d ' ')
  echo "  Total Fable runs logged: $n"
  local latest; latest=$(ls -t "$LOG_DIR"/run_fable_*.log 2>/dev/null | head -1)
  [ -n "$latest" ] && { echo "  Latest: $latest"; tail -3 "$latest" | sed 's/^/    /'; }
}

case "${1:-}" in
  start)   do_start ;;
  stop)    do_stop ;;
  status)  do_status ;;
  oneshot) do_oneshot ;;
  *)
    echo "Usage: $0 {start|stop|status|oneshot}"
    echo "  oneshot - ONE Fable-5 deep run on the multi-body isolation constant (recommended first)"
    echo "  start   - frontier loop: ${INTERVAL}s cadence, max ${MAX_RUNS} runs (premium spend)"
    exit 1 ;;
esac
