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
INTERVAL=120          # 2 minutes -- conservative API cadence
MAX_RUNS=500
PUSH_EVERY=5
IDLE_THRESHOLD=10

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

      cd "$PROJECT_DIR"
      node "$SCRIPT_DIR/engine-api-cycle.mjs" >> "$log_file" 2>&1
      exit_code=$?

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
