#!/usr/bin/env bash
# Auto-Improvement Engine for ZPO Explorer
# Usage: ./scripts/auto-improve.sh [start|stop|status]
#
# Invokes Claude Code CLI every 10 minutes to find and fix one issue.
# Each run makes exactly one atomic improvement, verifies the build, and commits.

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PID_FILE="$SCRIPT_DIR/.auto-improve.pid"
LOG_DIR="$SCRIPT_DIR/logs"
IMPROVEMENTS_FILE="$PROJECT_DIR/IMPROVEMENTS.md"
INTERVAL=60   # 1 minute
MAX_RUNS=100

# The prompt given to Claude Code on each iteration
IMPROVE_PROMPT='You are improving the ZPO Explorer math visualization app. Your task:

1. Pick ONE improvement from these categories (rotate through them):
   - Bug fix: find and fix a genuine bug (wrong calculation, broken interaction, display error)
   - Accuracy: improve mathematical rigor or correctness (wrong formula, missing disclaimer)
   - UX: improve user experience (better labels, clearer controls, missing tooltips)
   - Visual: improve a visualization (better colors, scaling, axis labels, legends)
   - Performance: optimize a slow computation or rendering path
   - Content: add or improve explanatory text, math explainers, or exploration entries

2. Read the relevant source files to understand the current code before changing anything.

3. Make exactly ONE small, atomic change. Do not refactor or restructure.

4. After your change, run: npm run build
   If the build fails, fix the issue before finishing.

5. Log the improvement in TWO places:

   a) Append a row to IMPROVEMENTS.md with this format:
      | # | TIMESTAMP | one-line summary | files changed |
      Use the next sequential number and current UTC timestamp.

   b) Add an entry to src/data/improvements.js by appending to the array before the closing ];
      Format:
      { id: NEXT_NUMBER, timestamp: "UTC_TIMESTAMP", category: "bug|accuracy|ux|visual|performance|content", summary: "one-line summary", files: ["file1.jsx", "file2.js"], detail: "2-3 sentence description of what was changed and why" },

      IMPORTANT: Read src/data/improvements.js first to see the current entries and determine the next ID number. Insert the new entry just before the final "];" line. Keep the file valid JavaScript.

6. Create a git commit with a descriptive message.

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

    while [ "$run_count" -lt "$MAX_RUNS" ]; do
      run_count=$((run_count + 1))
      timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
      log_file="$LOG_DIR/run_${timestamp//[:T]/_}.log"

      echo "=== Run #$run_count at $timestamp ===" | tee "$log_file"

      # Invoke Claude Code CLI (unset CLAUDECODE to avoid nested-session detection)
      if command -v claude &>/dev/null; then
        cd "$PROJECT_DIR"
        unset CLAUDECODE
        claude --print --dangerously-skip-permissions "$IMPROVE_PROMPT" \
          >> "$log_file" 2>&1 || true
      else
        echo "ERROR: 'claude' CLI not found in PATH" >> "$log_file"
        echo "Claude CLI not found. Install it or add to PATH."
        break
      fi

      echo "=== Run #$run_count complete ===" >> "$log_file"
      echo "Run #$run_count complete. Log: $log_file"

      # Wait for next interval (unless max reached)
      if [ "$run_count" -lt "$MAX_RUNS" ]; then
        sleep "$INTERVAL"
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
    echo "  start   - Start the auto-improvement loop (runs every 1 min)"
    echo "  stop    - Stop the running loop"
    echo "  status  - Check if running and show stats"
    exit 1
    ;;
esac
