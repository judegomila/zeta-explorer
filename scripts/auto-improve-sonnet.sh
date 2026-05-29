#!/usr/bin/env bash
# Auto-Improvement Engine for ZPO Explorer — SONNET TIER
# Usage: ./scripts/auto-improve-sonnet.sh [start|stop|status]
#
# Second engine instance that runs in PARALLEL with scripts/auto-improve.sh.
# This instance uses Claude Sonnet 4.6 and only picks up cheap mechanical
# tickets (bug / ux / visual / performance / accuracy). The main Opus engine
# handles proof / feature / content / meta work. Splitting the queue this
# way frees ~all Opus quota for research-grade tickets while still clearing
# the UI/bug backlog continuously.

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PID_FILE="$SCRIPT_DIR/.auto-improve-sonnet.pid"
LOG_DIR="$SCRIPT_DIR/logs"
IMPROVEMENTS_FILE="$PROJECT_DIR/IMPROVEMENTS.md"
INTERVAL=120  # 2 minutes — slower cadence so the parallel Opus engine
              # does not push us over the Tier 1 RPM ceiling.
MAX_RUNS=500

# The prompt given to Claude Sonnet on each iteration. Restricted to
# mechanical categories; if none are pending we exit cleanly instead of
# stealing proof tickets from the Opus engine.
IMPROVE_PROMPT='You are the SONNET tier of the ZPO Explorer / RH-attack auto-improvement engine. Your task:

0. TOKEN BUDGET DISCIPLINE: the project has three HUGE monolithic files that you MUST NOT read in full unless you are editing them:
   - src/data/improvements.js (~280K tokens)
   - src/data/improvement-queue.js (~87K tokens)
   - IMPROVEMENTS.md (~60K tokens)
   Reading any of these in full blows the per-minute API tier budget.
   INSTEAD, read the pre-generated cache at scripts/queue-index.json (~4 KB) for:
   - nextImprovementId (use this for the improvements.js append id, no scan needed)
   - criticalPending / highPending / mediumPending / lowPending arrays
   - totalPending / totalCompleted counts

1. MANDATORY FIRST STEP: read scripts/queue-index.json and collect every pending ticket assigned to the sonnet-4-6 tier in scripts/queue-index.json byModel["sonnet-4-6"] bucket. Read queue-index.json.byModel["sonnet-4-6"] — if non-empty, pick the highest-priority ticket in that bucket. IGNORE all other buckets — those belong to other engines and picking them here would waste the wrong model on research work.

2. PRIORITY ORDER within the sonnet-tier subset: critical > high > medium > low. Within the same priority, pick the lowest imp-NNN id (oldest first).

3. IF ZERO sonnet-tier tickets exist: state "SONNET: no eligible tickets — exiting cleanly" and STOP. Do NOT fall through to proof or feature or meta tickets. Do NOT rotate through random categories. The Opus engine handles those; your job is done for this tick.

4. At the start of your response, state the path: "SONNET QUEUE: imp-NNN (category X, priority Y)". Explicit commitment so drift is visible.

5. Read the relevant source files to understand the current code before changing anything.

6. Make exactly ONE small, atomic change. Do not refactor or restructure.

7. After your change, run: npm run build
   If the build fails, fix the issue before finishing.

8. Log the improvement in TWO places:

   a) Append a row to IMPROVEMENTS.md with this format:
      | # | TIMESTAMP | one-line summary | files changed |
      Use the next sequential number and current UTC timestamp.

   b) Add an entry to src/data/improvements.js by appending to the array before the closing ];
      Format (NOTE the NEW model + channel fields — your runtime is "haiku-4-5" on "subscription"):
      { id: NEXT_NUMBER, timestamp: "UTC_TIMESTAMP", category: "bug|ux|visual|performance|accuracy", summary: "one-line summary", files: ["file1.jsx", "file2.js"], detail: "2-3 sentence description of what was changed and why", model: "haiku-4-5", channel: "subscription" },

      TOKEN BUDGET: do NOT read src/data/improvements.js to find the next id — it is ~280K tokens. Instead:
        - Use scripts/queue-index.json nextImprovementId as the next id
        - Use the tail-append pattern: read only the LAST ~30 lines of improvements.js via offset, verify the last line is `];`, then use Edit with old_string `];` and new_string `  { id: NEXT, ... },\n];`.

   c) Flip the ticket status in src/data/improvement-queue.js from "pending" to "completed" using a targeted Grep + Edit (do NOT read the file in full). Also add two new fields on the ticket:
      completedByModel: "haiku-4-5",
      completedByChannel: "subscription",
      The ticket may already have predicted "model" and "channel" fields — LEAVE THOSE ALONE. completedBy* records actuals for routing-accuracy analysis.

9. Create a git commit with a descriptive message.

SYNTAX GOTCHAS (mandatory):
- DO NOT write "dg_k*/dt" or similar inside JSDoc comments — the "*/" prematurely closes the comment. Use "dg_{k*}/dt" in comments.
- DO NOT use apostrophes inside single-quoted JS strings — they close the string. Use double-quoted strings or rewrite.
- The "*/" sequence anywhere inside a JSDoc comment ends the comment.

RULES:
- Never install new packages or dependencies
- Never restructure the project or rename files
- Never modify this auto-improve script or IMPROVEMENTS.md format header
- Never make more than one logical change per run
- Never delete features or pages
- Never pick tickets outside the sonnet-4-6 tier — other engines handle those
- Always verify the build passes before committing
- Focus on the src/ directory only'

mkdir -p "$LOG_DIR"

init_improvements() {
  if [ ! -f "$IMPROVEMENTS_FILE" ]; then
    cat > "$IMPROVEMENTS_FILE" << 'EOF'
# Auto-Improvements Log

Automated improvements made by the Claude Code auto-improvement engine.

| # | Timestamp | Summary | Files Changed |
|---|-----------|---------|---------------|
EOF
  fi
}

do_start() {
  if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    echo "Auto-improve HAIKU is already running (PID $(cat "$PID_FILE"))"
    exit 1
  fi

  init_improvements

  echo "Starting auto-improvement engine (SONNET tier)..."
  echo "  Interval: ${INTERVAL}s ($(( INTERVAL / 60 )) minutes)"
  echo "  Max runs: $MAX_RUNS"
  echo "  Model:    claude-sonnet-4-6"
  echo "  Logs:     $LOG_DIR (run_sonnet_*.log)"
  echo "  PID file: $PID_FILE"

  # Run in background
  (
    run_count=0
    backoff_s=0
    BACKOFF_MAX_S=1800  # 30 minutes
    BACKOFF_STATE_FILE="$SCRIPT_DIR/.rate-limit-backoff-state-sonnet"
    rm -f "$BACKOFF_STATE_FILE"

    while [ "$run_count" -lt "$MAX_RUNS" ]; do
      run_count=$((run_count + 1))
      timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
      log_file="$LOG_DIR/run_sonnet_${timestamp//[:T]/_}.log"

      echo "=== Sonnet Run #$run_count at $timestamp ===" | tee "$log_file"

      # Regenerate queue-index.json BEFORE each run. The Opus engine also
      # does this; running it here is idempotent and keeps this instance
      # self-contained in case the two engines are started independently.
      node "$SCRIPT_DIR/build-queue-index.mjs" >> "$log_file" 2>&1 || true
      # Snapshot commit hash before run to detect if Claude makes a new commit
      pre_run_sha=$(git -C "$PROJECT_DIR" rev-parse HEAD 2>/dev/null || echo "")

      # imp-880 follow-up: consult channel-quota.mjs before invoking claude.
      if [ -f "$SCRIPT_DIR/engine-channel-hook.sh" ]; then
        source "$SCRIPT_DIR/engine-channel-hook.sh"
        engine_channel_preflight "$log_file"
        if [ "${ENGINE_SKIP:-0}" = "1" ]; then
          echo "=== Run skipped (channel-quota wait) at $timestamp ===" >> "$log_file"
          continue
        fi
      fi

      if command -v claude &>/dev/null; then
        cd "$PROJECT_DIR"
        unset CLAUDECODE
        (
          if [ -f "$SCRIPT_DIR/.env" ]; then
            set -a
            . "$SCRIPT_DIR/.env"
            set +a
          fi
          claude --print --dangerously-skip-permissions --model claude-sonnet-4-6 "$IMPROVE_PROMPT" \
            >> "$log_file" 2>&1
        ) || true
      else
        echo "ERROR: 'claude' CLI not found in PATH" >> "$log_file"
        echo "Claude CLI not found. Install it or add to PATH."
        break
      fi

      echo "=== Sonnet Run #$run_count complete ===" >> "$log_file"
      echo "Sonnet Run #$run_count complete. Log: $log_file"

      # imp-880 follow-up: append this run's token usage to the quota window.
      if [ -f "$SCRIPT_DIR/engine-channel-hook.sh" ]; then
        engine_channel_log "$log_file"
      fi

      # ── Post-commit status-flip verification ──────────────────────────────
      # The Haiku prompt (step 8c) instructs the model to flip the ticket
      # status to "completed". Verify it happened here; log drift if not.
      post_run_sha=$(git -C "$PROJECT_DIR" rev-parse HEAD 2>/dev/null || echo "")
      if [ -n "$pre_run_sha" ] && [ "$post_run_sha" != "$pre_run_sha" ]; then
        last_commit_msg=$(git -C "$PROJECT_DIR" log -1 --pretty=%s 2>/dev/null || echo "")
        commit_imp=$(echo "$last_commit_msg" | grep -oE 'imp-[0-9]+' | head -1)
        if [ -n "$commit_imp" ]; then
          flip_status=$(python3 -c "
import re
text = open('$PROJECT_DIR/src/data/improvement-queue.js').read()
m = re.search(r\"id: '\" + '$commit_imp' + r\"'.*?status: '(\\w+)'\", text, re.DOTALL)
print(m.group(1) if m else 'not-found')" 2>/dev/null || echo "error")
          if [ "$flip_status" = "completed" ]; then
            echo "STATUS-FLIP VERIFIED: $commit_imp -> completed" | tee -a "$log_file"
          else
            drift_msg="HAIKU RUN #$run_count ($timestamp): $commit_imp committed (queue-status=$flip_status) but NOT flipped to completed. Commit: $last_commit_msg"
            echo "STATUS-FLIP WARN: $drift_msg" | tee -a "$log_file"
            echo "$drift_msg" >> "$SCRIPT_DIR/status-flip-drift.log"
          fi
        fi
      fi

      # ── Rate-limit detection + exponential backoff ──────────────────────
      if grep -qiE "rate.?limit|429|quota.?exceed|ConnectionRefused|API Error|too many requests" "$log_file"; then
        if [ "$backoff_s" -eq 0 ]; then
          backoff_s=60
        else
          backoff_s=$((backoff_s * 2))
        fi
        if [ "$backoff_s" -gt "$BACKOFF_MAX_S" ]; then
          backoff_s=$BACKOFF_MAX_S
        fi
        error_line=$(grep -iE "rate.?limit|429|quota.?exceed|ConnectionRefused|API Error|too many requests" "$log_file" | head -1)
        cat > "$BACKOFF_STATE_FILE" << EOF
{
  "detected_at": "$timestamp",
  "engine": "sonnet",
  "run_number": $run_count,
  "log_file": "$log_file",
  "error_line": $(echo "$error_line" | python3 -c "import sys, json; print(json.dumps(sys.stdin.read().strip()))"),
  "current_backoff_seconds": $backoff_s,
  "note": "Mid-run failures leave the ticket status:pending for the next clean Haiku run.",
  "resume_strategy": "Sleep backoff_s seconds then retry. Doubles on repeat hits, resets on clean run."
}
EOF
        echo "RATE LIMIT DETECTED on Haiku run #$run_count. Backing off ${backoff_s}s (sentinel: $BACKOFF_STATE_FILE)" | tee -a "$log_file"
      else
        if [ -f "$BACKOFF_STATE_FILE" ]; then
          rm -f "$BACKOFF_STATE_FILE"
          echo "Clean Haiku run — rate-limit sentinel cleared, backoff reset." | tee -a "$log_file"
        fi
        backoff_s=0
      fi

      # Auto-push every 5 clean runs (mirrors auto-improve.sh, added
      # 2026-05-19 — overnight commits piled up unpushed when Opus 4.7 stalled).
      if [ "$((run_count % 5))" -eq 0 ]; then
        unpushed=$(git -C "$PROJECT_DIR" log --oneline @{u}..HEAD 2>/dev/null | wc -l | tr -d ' ')
        if [ "${unpushed:-0}" -gt 0 ]; then
          echo "AUTO-PUSH (sonnet): $unpushed unpushed commit(s) — pushing at run #$run_count..." | tee -a "$log_file"
          git -C "$PROJECT_DIR" push >> "$log_file" 2>&1 \
            && echo "AUTO-PUSH (sonnet): success" | tee -a "$log_file" \
            || echo "AUTO-PUSH (sonnet): push failed (non-fatal; will retry)" | tee -a "$log_file"
        fi
      fi

      if [ "$run_count" -lt "$MAX_RUNS" ]; then
        sleep_total=$((INTERVAL + backoff_s))
        # Chunked sleep: poll every 30s so that if another engine clears the
        # rate-limit sentinel (or an operator deletes it manually), this engine
        # wakes early instead of sleeping through the full backoff window.
        elapsed=0
        while [ "$elapsed" -lt "$sleep_total" ]; do
          remaining=$(( sleep_total - elapsed ))
          if [ "$remaining" -gt 30 ]; then
            sleep 30
            elapsed=$(( elapsed + 30 ))
          else
            sleep "$remaining"
            elapsed=$(( elapsed + remaining ))
          fi
          if [ "$backoff_s" -gt 0 ] && [ ! -f "$BACKOFF_STATE_FILE" ]; then
            echo "RATE-LIMIT SENTINEL CLEARED externally — resuming early after ${elapsed}s of ${sleep_total}s backoff" | tee -a "$log_file"
            backoff_s=0
            break
          fi
        done
      fi
    done

    echo "Auto-improve HAIKU completed $run_count runs. Stopping."
    rm -f "$PID_FILE"
  ) &

  local bg_pid=$!
  echo "$bg_pid" > "$PID_FILE"
  disown
  echo "Auto-improve HAIKU started in background (PID $bg_pid)"
}

do_stop() {
  if [ ! -f "$PID_FILE" ]; then
    echo "Auto-improve HAIKU is not running (no PID file)"
    exit 0
  fi

  pid=$(cat "$PID_FILE")
  if kill -0 "$pid" 2>/dev/null; then
    echo "Stopping auto-improve HAIKU (PID $pid)..."
    kill "$pid" 2>/dev/null || true
    pkill -P "$pid" 2>/dev/null || true
    rm -f "$PID_FILE"
    echo "Stopped."
  else
    echo "Process $pid not found. Cleaning up PID file."
    rm -f "$PID_FILE"
  fi
}

do_status() {
  if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    pid=$(cat "$PID_FILE")
    echo "Auto-improve HAIKU is RUNNING (PID $pid)"
    run_count=$(ls "$LOG_DIR"/run_sonnet_*.log 2>/dev/null | wc -l | tr -d ' ')
    echo "  Completed Haiku runs: $run_count"
    latest=$(ls -t "$LOG_DIR"/run_sonnet_*.log 2>/dev/null | head -1)
    if [ -n "$latest" ]; then
      echo "  Latest log: $latest"
      echo "  Last 3 lines:"
      tail -3 "$latest" | sed 's/^/    /'
    fi
  else
    echo "Auto-improve HAIKU is NOT running"
    if [ -f "$PID_FILE" ]; then
      echo "  (stale PID file found, cleaning up)"
      rm -f "$PID_FILE"
    fi
    run_count=$(ls "$LOG_DIR"/run_sonnet_*.log 2>/dev/null | wc -l | tr -d ' ')
    echo "  Total completed Haiku runs: $run_count"
  fi
}

case "${1:-}" in
  start)  do_start ;;
  stop)   do_stop ;;
  status) do_status ;;
  *)
    echo "Usage: $0 {start|stop|status}"
    echo ""
    echo "  start   - Start the Haiku auto-improvement loop (runs every 120 sec)"
    echo "  stop    - Stop the running loop"
    echo "  status  - Check if running and show stats"
    exit 1
    ;;
esac
