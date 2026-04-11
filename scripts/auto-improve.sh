#!/usr/bin/env bash
# Auto-Improvement Engine for ZPO Explorer
# Usage: ./scripts/auto-improve.sh [start|stop|status]
#
# Invokes Claude Code CLI every 60 seconds to find and fix one issue.
# Each run makes exactly one atomic improvement, verifies the build, and commits.

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PID_FILE="$SCRIPT_DIR/.auto-improve.pid"
LOG_DIR="$SCRIPT_DIR/logs"
IMPROVEMENTS_FILE="$PROJECT_DIR/IMPROVEMENTS.md"
INTERVAL=60   # 1 minute
MAX_RUNS=1000

# The prompt given to Claude Code on each iteration
IMPROVE_PROMPT='You are improving the ZPO Explorer / RH-attack project. Your task:

1. MANDATORY FIRST STEP: read src/data/improvement-queue.js and extract ALL items with status: "pending". Use a balanced-brace parser, not naive regex (descriptions contain braces).

2. PRIORITY ORDER IS ABSOLUTE. Among pending items, pick in strict priority order: critical > high > medium > low. Within the same priority, pick the lowest imp-NNN id (oldest first).

3. IF ANY PENDING TICKETS EXIST: you MUST work a queue ticket. Falling back to category rotation is FORBIDDEN as long as one pending ticket remains. If the highest-priority ticket is research-grade and you cannot fully close it, deliver an HONEST PARTIAL closure with a clearly-named sub-gap — this is valuable work. NEVER silently switch to random UX/bug tickets when critical proof tickets are pending.

4. ONLY IF NO pending tickets remain AT ALL: you may pick ONE improvement from these categories (rotate through them). Otherwise this clause is DEAD.
   - Bug fix: find and fix a genuine bug (wrong calculation, broken interaction, display error)
   - Accuracy: improve mathematical rigor or correctness (wrong formula, missing disclaimer)
   - UX: improve user experience (better labels, clearer controls, missing tooltips)
   - Visual: improve a visualization (better colors, scaling, axis labels, legends)
   - Performance: optimize a slow computation or rendering path
   - Content: add or improve explanatory text, math explainers, or exploration entries

5. At the start of your response, state the path you are taking: "QUEUE: imp-NNN (priority X)" or "CATEGORY: <category>" — explicit commitment so the bug reappears visibly if you drift.

6. Read the relevant source files to understand the current code before changing anything.

7. Make exactly ONE small, atomic change. Do not refactor or restructure.

8. After your change, run: npm run build
   If the build fails, fix the issue before finishing.

9. Log the improvement in TWO places:

   a) Append a row to IMPROVEMENTS.md with this format:
      | # | TIMESTAMP | one-line summary | files changed |
      Use the next sequential number and current UTC timestamp.

   b) Add an entry to src/data/improvements.js by appending to the array before the closing ];
      Format:
      { id: NEXT_NUMBER, timestamp: "UTC_TIMESTAMP", category: "bug|accuracy|ux|visual|performance|content|proof", summary: "one-line summary", files: ["file1.jsx", "file2.js"], detail: "2-3 sentence description of what was changed and why" },

      IMPORTANT: Read src/data/improvements.js first to see the current entries and determine the next ID number. Insert the new entry just before the final "];" line. Keep the file valid JavaScript.

10. Create a git commit with a descriptive message.

SYNTAX GOTCHAS (mandatory, learned from previous failures):
- DO NOT write "dg_k*/dt" or "dg_k*/dtau" inside JSDoc comments — the "*/" prematurely closes the comment. Use "dg_{k*}/dt" in comments. In JS string literals it is fine.
- DO NOT use apostrophes inside single-quoted JS strings — they close the string. Either use double-quoted strings or rewrite (e.g. "the engine\\u2019s" -> "the engine").
- The "*/" sequence anywhere inside a JSDoc comment ends the comment.

RULES:
- Never install new packages or dependencies
- Never restructure the project or rename files
- Never modify this auto-improve script or IMPROVEMENTS.md format header
- Never make more than one logical change per run
- Never delete features or pages
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
    echo "Auto-improve is already running (PID $(cat "$PID_FILE"))"
    exit 1
  fi

  init_improvements

  echo "Starting auto-improvement engine..."
  echo "  Interval: ${INTERVAL}s ($(( INTERVAL / 60 )) minutes)"
  echo "  Max runs: $MAX_RUNS"
  echo "  Logs: $LOG_DIR"
  echo "  PID file: $PID_FILE"

  # Run in background
  (
    run_count=0
    # Exponential backoff state — doubles on each rate-limit hit, resets on
    # a clean run. Bounded by BACKOFF_MAX_S so we don't sleep forever.
    backoff_s=0
    BACKOFF_MAX_S=1800  # 30 minutes
    BACKOFF_STATE_FILE="$SCRIPT_DIR/.rate-limit-backoff-state"
    rm -f "$BACKOFF_STATE_FILE"

    while [ "$run_count" -lt "$MAX_RUNS" ]; do
      run_count=$((run_count + 1))
      timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
      log_file="$LOG_DIR/run_${timestamp//[:T]/_}.log"

      echo "=== Run #$run_count at $timestamp ===" | tee "$log_file"

      # Invoke Claude Code CLI (unset CLAUDECODE to avoid nested-session detection).
      # If scripts/.env exists, source it for this subshell only so
      # ANTHROPIC_API_KEY (or ANTHROPIC_AUTH_TOKEN) can be set without
      # polluting the parent shell. This lets the engine run on API billing
      # while the interactive Claude Code session keeps using the Max OAuth
      # subscription. scripts/.env is gitignored.
      if command -v claude &>/dev/null; then
        cd "$PROJECT_DIR"
        unset CLAUDECODE
        (
          if [ -f "$SCRIPT_DIR/.env" ]; then
            set -a
            . "$SCRIPT_DIR/.env"
            set +a
          fi
          claude --print --dangerously-skip-permissions "$IMPROVE_PROMPT" \
            >> "$log_file" 2>&1
        ) || true
      else
        echo "ERROR: 'claude' CLI not found in PATH" >> "$log_file"
        echo "Claude CLI not found. Install it or add to PATH."
        break
      fi

      echo "=== Run #$run_count complete ===" >> "$log_file"
      echo "Run #$run_count complete. Log: $log_file"

      # ── Rate-limit detection + exponential backoff ──────────────────────
      # Scan this run's log for any of the known rate-limit / API error
      # patterns. On detection: double the backoff sleep, write a sentinel
      # file with the current state (so the monitor cron and a human
      # operator can see the engine is backing off), and record that the
      # current ticket remains pending (the engine's prompt only flips
      # pending → completed after a successful commit, so mid-run failures
      # naturally leave the ticket in the queue — the sentinel just makes
      # that state explicit and visible).
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
  "run_number": $run_count,
  "log_file": "$log_file",
  "error_line": $(echo "$error_line" | python3 -c "import sys, json; print(json.dumps(sys.stdin.read().strip()))"),
  "current_backoff_seconds": $backoff_s,
  "note": "Any ticket started by this run remains status:pending in improvement-queue.js — the prompt only flips status after a successful commit, so mid-run failures naturally queue the in-flight work for the next clean run.",
  "resume_strategy": "Sleep backoff_s seconds then retry. If the next run also hits the pattern, backoff doubles. A clean run resets backoff to 0."
}
EOF
        echo "RATE LIMIT DETECTED on run #$run_count. Backing off ${backoff_s}s (sentinel: $BACKOFF_STATE_FILE)" | tee -a "$log_file"
      else
        # Clean run — reset backoff and clear sentinel.
        if [ -f "$BACKOFF_STATE_FILE" ]; then
          rm -f "$BACKOFF_STATE_FILE"
          echo "Clean run — rate-limit sentinel cleared, backoff reset." | tee -a "$log_file"
        fi
        backoff_s=0
      fi

      # Wait for next interval, plus the exponential backoff if any.
      if [ "$run_count" -lt "$MAX_RUNS" ]; then
        sleep_total=$((INTERVAL + backoff_s))
        sleep "$sleep_total"
      fi
    done

    echo "Auto-improve completed $run_count runs. Stopping."
    rm -f "$PID_FILE"
  ) &

  local bg_pid=$!
  echo "$bg_pid" > "$PID_FILE"
  disown
  echo "Auto-improve started in background (PID $bg_pid)"
}

do_stop() {
  if [ ! -f "$PID_FILE" ]; then
    echo "Auto-improve is not running (no PID file)"
    exit 0
  fi

  pid=$(cat "$PID_FILE")
  if kill -0 "$pid" 2>/dev/null; then
    echo "Stopping auto-improve (PID $pid)..."
    kill "$pid" 2>/dev/null || true
    # Also kill any child claude processes
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
    echo "Auto-improve is RUNNING (PID $pid)"
    # Count completed runs
    run_count=$(ls "$LOG_DIR"/run_*.log 2>/dev/null | wc -l | tr -d ' ')
    echo "  Completed runs: $run_count"
    # Show latest log
    latest=$(ls -t "$LOG_DIR"/run_*.log 2>/dev/null | head -1)
    if [ -n "$latest" ]; then
      echo "  Latest log: $latest"
      echo "  Last 3 lines:"
      tail -3 "$latest" | sed 's/^/    /'
    fi
  else
    echo "Auto-improve is NOT running"
    if [ -f "$PID_FILE" ]; then
      echo "  (stale PID file found, cleaning up)"
      rm -f "$PID_FILE"
    fi
    run_count=$(ls "$LOG_DIR"/run_*.log 2>/dev/null | wc -l | tr -d ' ')
    echo "  Total completed runs: $run_count"
  fi

  # Show improvements count
  if [ -f "$IMPROVEMENTS_FILE" ]; then
    imp_count=$(grep -c '^|[^|]*|[^|]*|[^|]*|[^|]*|$' "$IMPROVEMENTS_FILE" 2>/dev/null || echo 0)
    imp_count=$((imp_count - 1))  # subtract header
    [ "$imp_count" -lt 0 ] && imp_count=0
    echo "  Improvements logged: $imp_count"
  fi
}

case "${1:-}" in
  start)  do_start ;;
  stop)   do_stop ;;
  status) do_status ;;
  *)
    echo "Usage: $0 {start|stop|status}"
    echo ""
    echo "  start   - Start the auto-improvement loop (runs every 60 sec)"
    echo "  stop    - Stop the running loop"
    echo "  status  - Check if running and show stats"
    exit 1
    ;;
esac
