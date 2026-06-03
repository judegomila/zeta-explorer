#!/usr/bin/env bash
# Auto-Improvement Engine for ZPO Explorer -- API CHANNEL TIER (imp-1142)
# Usage: ./scripts/auto-improve-api.sh [start|stop|status]
#
# Fifth engine instance that runs in PARALLEL with the four subscription
# engines (auto-improve.sh, auto-improve-haiku.sh, auto-improve-sonnet.sh,
# auto-improve-opus46.sh). This one routes through the Anthropic REST API
# via scripts/engine-api-cycle.mjs (which uses @anthropic-ai/sdk).
#
# Requires ANTHROPIC_API_KEY in env. If absent at startup, the engine
# exits cleanly with a documented message instead of spinning.

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PID_FILE="$SCRIPT_DIR/.auto-improve-api.pid"
LOG_DIR="$SCRIPT_DIR/logs"
IMPROVEMENTS_FILE="$PROJECT_DIR/IMPROVEMENTS.md"
HEARTBEAT_FILE="$SCRIPT_DIR/.heartbeat-api"
INTERVAL=${INTERVAL:-20}   # inter-turn idle. Turns are serialized and minutes-long; a single worker uses <1% of the API rate ceiling (10M in/800K out TPM, 20K RPM), so the old 120s was pure dead time. Override via env.
MAX_RUNS=500
PUSH_EVERY=5
IDLE_THRESHOLD=10

# The prompt given to Claude Code CLI on each iteration. This engine runs the
# FULL read/edit/bash tool loop on the API channel (ANTHROPIC_API_KEY billing),
# so unlike the old planning-only engine-api-cycle.mjs it actually mutates files
# and closes tickets. It owns the byModel["opus-4-8"] bucket so it does not race
# the subscription engine (which owns byModel["opus-4-7"]).
IMPROVE_PROMPT_API='You are improving the ZPO Explorer / RH-attack project on the API channel. Your task:

0. TOKEN BUDGET DISCIPLINE: never read these monolithic files in full unless you are editing them:
   - src/data/improvements.js (~280K tokens)
   - src/data/improvement-queue.js (~87K tokens)
   - IMPROVEMENTS.md (~60K tokens)
   INSTEAD read scripts/queue-index.json (~4 KB) for nextImprovementId, the byModel buckets, criticalPending/highPending/mediumPending arrays, and totalPending/totalCompleted. The harness regenerates it before each run, so it is fresh.

1. MANDATORY FIRST STEP: read scripts/queue-index.json and look at byModel["opus-4-8"] bucket -- these are this engine'\''s tickets. If non-empty, pick the highest-priority ticket from that bucket. If byModel["opus-4-8"] is empty, fall through and pick any opus-eligible pending ticket from categories {proof, feature, content, meta, numerical} by priority. Do NOT pick from byModel["opus-4-7"] (subscription engine), byModel["sonnet-4-6"], or byModel["haiku-4-5"] -- those belong to other engines.

2. PRIORITY ORDER IS ABSOLUTE: critical > high > medium > low. Within the same priority, pick the lowest imp-NNN id (oldest first).

3. IF ANY ELIGIBLE PENDING TICKET EXISTS: you MUST work one. If it is research-grade and you cannot fully close it, deliver an HONEST PARTIAL closure with a clearly-named sub-gap -- that is valuable work. Do not fabricate results.

4. IF ZERO eligible tickets remain: state exactly "API: no eligible tickets" and STOP cleanly. Do NOT invent categories or pick another engine'\''s bucket.

5. At the START of your response state the path: "QUEUE: imp-NNN (priority X)" or "API: no eligible tickets".

6. Read the relevant source files before changing anything.

7. Make exactly ONE small, atomic change. Do not refactor or restructure.

8. After your change run: npm run build. If it fails, fix it before finishing.

9. Log the improvement in TWO places:
   a) Append a row to IMPROVEMENTS.md: | # | TIMESTAMP | one-line summary | files changed |  (next sequential number, current UTC timestamp).
   b) Append an entry to src/data/improvements.js before the closing ];  using the tail-append pattern (read only the LAST ~30 lines via offset, verify the last line is `];`, then Edit `];` -> `  { id: NEXT, ... },\n];`). Use scripts/queue-index.json nextImprovementId as the id. Format:
      { id: NEXT_NUMBER, timestamp: "UTC_TIMESTAMP", category: "bug|accuracy|ux|visual|performance|content|proof|feature|meta|numerical", summary: "one-line summary", files: ["file1.js"], detail: "2-3 sentence description", model: "opus-4-8", channel: "api" },

9b. SYSTEM OF RECORD -- when flipping a ticket from pending to completed in src/data/improvement-queue.js, ALSO add:
    completedByModel: "opus-4-8",
    completedByChannel: "api",
    LEAVE any predicted model/channel fields ALONE.

10. Create a git commit with a descriptive message mentioning the imp-NNN id.

SYNTAX GOTCHAS (mandatory):
- DO NOT write "*/" inside a JSDoc comment (it closes the comment). Use "dg_{k*}/dt" form in comments.
- DO NOT use apostrophes inside single-quoted JS strings.

RULES:
- Never install new packages or rename/restructure files.
- Never modify this script or the IMPROVEMENTS.md header.
- One logical change per run. Never delete features or pages. Focus on src/.
- TICKET-ID CLAIM PROTOCOL: before opening a NEW ticket, run `node scripts/claim-ticket-id.mjs <proposed-id>` and use the printed id.'

# Optional .env file (gitignored) sets ANTHROPIC_API_KEY for this subshell.
if [ -f "$SCRIPT_DIR/.env" ]; then
  set -a
  # shellcheck disable=SC1091
  . "$SCRIPT_DIR/.env"
  set +a
fi

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
    echo "Auto-improve API is already running (PID $(cat "$PID_FILE"))"
    exit 1
  fi

  init_improvements

  if [ -z "${ANTHROPIC_API_KEY:-}" ]; then
    echo "Auto-improve API: ANTHROPIC_API_KEY is NOT set in the environment."
    echo "  To enable: export ANTHROPIC_API_KEY=sk-ant-... (or add to scripts/.env)"
    echo "  Engine NOT started. This is the documented honest-scope partial closure for imp-1142."
    api_log="$LOG_DIR/run_api_no-key-$(date -u +%Y-%m-%dT%H-%M-%SZ).log"
    {
      echo "=== auto-improve-api startup at $(date -u +%FT%TZ) ==="
      echo "ANTHROPIC_API_KEY absent -- engine refused to start."
      echo "Set the env var and re-run scripts/auto-improve-api.sh start."
    } > "$api_log"
    exit 0
  fi

  echo "Starting auto-improvement engine (API tier)..."
  echo "  Interval: ${INTERVAL}s ($(( INTERVAL / 60 )) minutes)"
  echo "  Max runs: $MAX_RUNS"
  echo "  Model:    ${API_ENGINE_MODEL:-claude-opus-4-8}"
  echo "  Logs:     $LOG_DIR (run_api_*.log)"
  echo "  PID file: $PID_FILE"

  (
    run_count=0
    idle_count=0
    backoff_s=0
    BACKOFF_MAX_S=1800
    BACKOFF_STATE_FILE="$SCRIPT_DIR/.rate-limit-backoff-state-api"
    rm -f "$BACKOFF_STATE_FILE"

    while [ "$run_count" -lt "$MAX_RUNS" ]; do
      run_count=$((run_count + 1))
      timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
      log_file="$LOG_DIR/run_api_${timestamp//[:T]/_}.log"

      echo "=== API Run #$run_count at $timestamp ===" | tee "$log_file"

      # Always refresh queue-index before a run -- the cycle helper reads it.
      node "$SCRIPT_DIR/build-queue-index.mjs" >> "$log_file" 2>&1 || true
      pre_run_sha=$(git -C "$PROJECT_DIR" rev-parse HEAD 2>/dev/null || echo "")

      # Channel-quota hook still applies: even though this engine IS the
      # api channel, the hook may recommend "wait" if both subscription
      # AND api are flagged exhausted. We skip in that case.
      if [ -f "$SCRIPT_DIR/engine-channel-hook.sh" ]; then
        # shellcheck disable=SC1091
        source "$SCRIPT_DIR/engine-channel-hook.sh"
        engine_channel_preflight "$log_file"
        # We DO NOT honor ENGINE_SKIP here unless the hook says "wait"
        # specifically -- the api engine is the LAST resort, so a hook
        # downgrade to api should still let us proceed.
        if [ "${CHANNEL_RECOMMEND:-subscription}" = "wait" ]; then
          echo "=== API Run skipped (channel-quota wait) at $timestamp ===" >> "$log_file"
          sleep "$INTERVAL"
          continue
        fi
      fi

      # Invoke the full Claude Code CLI on the API channel. ANTHROPIC_API_KEY is
      # already exported (sourced from scripts/.env at script top), so the CLI
      # bills to API rather than the Max subscription. unset CLAUDECODE so the
      # child is not treated as a nested session. This runs the REAL read/edit/
      # bash tool loop -- it actually mutates files and commits, unlike the old
      # planning-only engine-api-cycle.mjs.
      if command -v claude &>/dev/null; then
        cd "$PROJECT_DIR"
        unset CLAUDECODE
        claude --print --model "${API_ENGINE_MODEL:-claude-opus-4-8}" --dangerously-skip-permissions "$IMPROVE_PROMPT_API" \
          >> "$log_file" 2>&1
        exit_code=$?
      else
        echo "ERROR: 'claude' CLI not found in PATH" >> "$log_file"
        exit_code=79
      fi

      echo "=== API Run #$run_count complete (exit=$exit_code) ===" >> "$log_file"
      echo "API Run #$run_count complete (exit=$exit_code). Log: $log_file"

      # Exit codes from engine-api-cycle.mjs:
      #   78 = no ANTHROPIC_API_KEY    (stop the loop -- nothing will change)
      #   79 = SDK not installed       (stop the loop -- requires npm install)
      #   80 = preflight failed        (stop -- bad key or quota wall)
      #   81 = queue-index missing     (retry next tick after build-queue-index)
      #   82 = API call failed         (rate-limit backoff applies)
      case "$exit_code" in
        78|79|80)
          echo "AUTO-IMPROVE-API: exit code $exit_code is terminal. Stopping loop." | tee -a "$log_file"
          rm -f "$PID_FILE"
          break
          ;;
      esac

      if [ -f "$SCRIPT_DIR/engine-channel-hook.sh" ]; then
        engine_channel_log "$log_file"
      fi
      date +%s > "$HEARTBEAT_FILE"

      # Post-commit status-flip verification (mirrors the other engines)
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
            drift_msg="API RUN #$run_count ($timestamp): $commit_imp committed (queue-status=$flip_status) but NOT flipped to completed. Commit: $last_commit_msg"
            echo "STATUS-FLIP WARN: $drift_msg" | tee -a "$log_file"
            echo "$drift_msg" >> "$SCRIPT_DIR/status-flip-drift.log"
          fi
        fi
      fi

      # Rate-limit detection -- the SDK returns 429 as exit 82 OR may print
      # the pattern. Either path triggers exponential backoff.
      rate_hit=0
      if [ "$exit_code" -eq 82 ]; then
        rate_hit=1
      elif grep -qiE "rate.?limit|429|quota.?exceed|too many requests" "$log_file"; then
        rate_hit=1
      fi
      if [ "$rate_hit" -eq 1 ]; then
        if [ "$backoff_s" -eq 0 ]; then
          backoff_s=60
        else
          backoff_s=$((backoff_s * 2))
        fi
        if [ "$backoff_s" -gt "$BACKOFF_MAX_S" ]; then
          backoff_s=$BACKOFF_MAX_S
        fi
        cat > "$BACKOFF_STATE_FILE" << EOF
{
  "detected_at": "$timestamp",
  "engine": "api",
  "run_number": $run_count,
  "log_file": "$log_file",
  "current_backoff_seconds": $backoff_s,
  "note": "API channel rate-limit. Backoff doubles on repeat hits, resets on clean run.",
  "resume_strategy": "Sleep backoff_s extra seconds beyond INTERVAL on the next iteration."
}
EOF
        echo "RATE LIMIT (api) on run #$run_count. Backing off ${backoff_s}s (sentinel: $BACKOFF_STATE_FILE)" | tee -a "$log_file"
        printf '{"event":"rate_limit","engine":"api","run":%d,"ts":"%s","backoff_s":%d}\n' "$run_count" "$timestamp" "$backoff_s" | tee -a "$log_file"
      else
        if [ -f "$BACKOFF_STATE_FILE" ]; then
          rm -f "$BACKOFF_STATE_FILE"
          echo "Clean API run -- rate-limit sentinel cleared, backoff reset." | tee -a "$log_file"
        fi
        backoff_s=0
      fi

      # Idle detection (imp-518 analog for API engine)
      if grep -q "API: no eligible tickets" "$log_file"; then
        idle_count=$((idle_count + 1))
        echo "IDLE TICK $idle_count/$IDLE_THRESHOLD (api): no eligible tickets this run" | tee -a "$log_file"
        if [ "$idle_count" -ge "$IDLE_THRESHOLD" ]; then
          echo "IDLE THRESHOLD REACHED (api): $idle_count consecutive empty-queue runs." | tee -a "$log_file"
          echo "$(date -u +"%Y-%m-%dT%H:%M:%SZ") AUTO-STOPPED (api): $idle_count idle exits" >> "$SCRIPT_DIR/auto-stop.log"
          rm -f "$PID_FILE"
          break
        fi
      else
        if [ "$idle_count" -gt 0 ]; then
          echo "IDLE COUNTER RESET (api): work found after $idle_count idle run(s)" | tee -a "$log_file"
          idle_count=0
        fi
      fi

      # Auto-push every N clean runs (mirrors auto-improve.sh PUSH_EVERY).
      if [ "$((run_count % PUSH_EVERY))" -eq 0 ]; then
        unpushed=$(git -C "$PROJECT_DIR" log --oneline @{u}..HEAD 2>/dev/null | wc -l | tr -d ' ')
        if [ "${unpushed:-0}" -gt 0 ]; then
          echo "AUTO-PUSH (api): $unpushed unpushed commit(s) -- pushing at run #$run_count..." | tee -a "$log_file"
          git -C "$PROJECT_DIR" push >> "$log_file" 2>&1 \
            && echo "AUTO-PUSH (api): success" | tee -a "$log_file" \
            || echo "AUTO-PUSH (api): push failed (non-fatal; will retry)" | tee -a "$log_file"
        else
          echo "AUTO-PUSH (api): nothing new to push at run #$run_count" | tee -a "$log_file"
        fi
      fi

      if [ "$run_count" -lt "$MAX_RUNS" ]; then
        sleep_total=$((INTERVAL + backoff_s))
        sleep "$sleep_total"
      fi
    done

    echo "Auto-improve API completed $run_count runs. Stopping."
    rm -f "$PID_FILE"
  ) &

  bg_pid=$!
  echo "$bg_pid" > "$PID_FILE"
  disown
  echo "Auto-improve API started in background (PID $bg_pid)"
}

do_stop() {
  if [ ! -f "$PID_FILE" ]; then
    echo "Auto-improve API is not running (no PID file)"
    exit 0
  fi
  pid=$(cat "$PID_FILE")
  if kill -0 "$pid" 2>/dev/null; then
    echo "Stopping auto-improve API (PID $pid)..."
    # Kill the child claude turn FIRST, while $pid is still alive so the child
    # is still matchable as its child. Killing the supervisor first lets the
    # in-flight claude reparent to launchd and survive as a token-burning
    # orphan that commits uncoordinated work and collides on tickets (observed
    # 2026-06-03 — five concurrent orphaned opus-4-8 turns after restarts).
    pkill -P "$pid" 2>/dev/null || true
    kill "$pid" 2>/dev/null || true
    rm -f "$PID_FILE"
    echo "Stopped."
  else
    echo "Process $pid not found. Cleaning up PID file."
    rm -f "$PID_FILE"
  fi
}

do_status() {
  stall_detected=0
  if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    pid=$(cat "$PID_FILE")
    echo "Auto-improve API is RUNNING (PID $pid)"
    if [ -f "$HEARTBEAT_FILE" ]; then
      last_beat=$(stat -f %m "$HEARTBEAT_FILE" 2>/dev/null || echo 0)
      beat_age=$(( $(date +%s) - last_beat ))
      stall_threshold=$(( INTERVAL * 2 ))
      if [ "$beat_age" -gt "$stall_threshold" ]; then
        echo "  STALL DETECTED: heartbeat ${beat_age}s stale (threshold ${stall_threshold}s = 2 ticks)"
        stall_detected=1
      else
        echo "  Heartbeat OK: ${beat_age}s ago"
      fi
    else
      echo "  Heartbeat: no heartbeat yet (engine may still be starting up)"
    fi
    run_count=$(ls "$LOG_DIR"/run_api_*.log 2>/dev/null | wc -l | tr -d ' ')
    echo "  Completed API runs: $run_count"
    latest=$(ls -t "$LOG_DIR"/run_api_*.log 2>/dev/null | head -1)
    if [ -n "$latest" ]; then
      echo "  Latest log: $latest"
      echo "  Last 3 lines:"
      tail -3 "$latest" | sed 's/^/    /'
    fi
  else
    echo "Auto-improve API is NOT running"
    if [ -f "$PID_FILE" ]; then
      echo "  (stale PID file found, cleaning up)"
      rm -f "$PID_FILE"
    fi
    run_count=$(ls "$LOG_DIR"/run_api_*.log 2>/dev/null | wc -l | tr -d ' ')
    echo "  Total completed API runs: $run_count"
  fi
  if [ -z "${ANTHROPIC_API_KEY:-}" ]; then
    echo "  ANTHROPIC_API_KEY: ABSENT (engine will refuse to start)"
  else
    echo "  ANTHROPIC_API_KEY: present (len=${#ANTHROPIC_API_KEY})"
  fi
  return "$stall_detected"
}

case "${1:-}" in
  start)  do_start ;;
  stop)   do_stop ;;
  status) do_status ;;
  *)
    echo "Usage: $0 {start|stop|status}"
    echo ""
    echo "  start   - Start the API-channel auto-improvement loop"
    echo "  stop    - Stop the running loop"
    echo "  status  - Check if running and show stats"
    echo ""
    echo "Env vars:"
    echo "  ANTHROPIC_API_KEY    REQUIRED -- the engine will not start without it"
    echo "  API_ENGINE_MODEL     default claude-opus-4-8"
    echo "  API_ENGINE_MAX_TOKENS default 4096"
    exit 1
    ;;
esac
