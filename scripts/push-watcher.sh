#!/bin/bash
# Defensive push-watcher — polls every 60s for unpushed commits and pushes
# them to the ENGINE branch (ENGINE_BRANCH, default engine/work) through
# scripts/engine-push.sh. It never pushes to main: main deploys to production
# and is advanced only by a reviewed pull request (scripts/promote-engine-work.sh). Independent of all engines so a stalled engine (heartbeat dead,
# stuck on a heavy ticket, etc.) cannot strand commits locally.
#
# Pairs with the in-engine PUSH_EVERY=5 auto-push (auto-improve*.sh) as
# belt-and-suspenders: engines push proactively after every 5 runs, this
# watcher catches anything an engine missed (e.g. shipped a commit then
# stalled before reaching the next push tick).
#
# ----------------------------------------------------------------------------
# Backoff state machine (imp-1170):
#
#   level | base interval | typical sleep (with ±10% jitter)
#   ------+---------------+----------------------------------
#     0   |     60s       |  54 .. 66 s   <- normal cadence
#     1   |    120s       | 108 .. 132 s
#     2   |    240s       | 216 .. 264 s
#     3   |    480s       | 432 .. 528 s
#     4   |    480s       | 432 .. 528 s  (cap held; alert emitted)
#     5+  |    480s       | 432 .. 528 s  (continues; further alerts suppressed)
#
# Transitions:
#   - Successful `git push`              ............. level := 0
#   - "Nothing to push" / no-op (no unpushed commits)  level unchanged
#   - Push failure WITH rate-limit signature           level := min(level+1, 3)
#       (matches "403", "429", "rate limit", "API rate limit exceeded")
#   - Push failure WITHOUT rate-limit signature        level unchanged
#       (logged, but doesn't widen the backoff — likely transient network)
#   - Consecutive rate-limited failures >= 5           emit one stderr alert
#       (BACKOFF_ALERT_THRESHOLD); daemon keeps running, level stays at cap
#
# Jitter (±10%) decorrelates this watcher from the 4 parallel auto-improve
# engines that also push, preventing synchronized retry storms.
# ----------------------------------------------------------------------------
#
# Usage:
#   ./scripts/push-watcher.sh start   # detach as background daemon
#   ./scripts/push-watcher.sh stop
#   ./scripts/push-watcher.sh status
#   ./scripts/push-watcher.sh --daemon-loop   # internal; do not call directly

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PID_FILE="$SCRIPT_DIR/.push-watcher.pid"
LOG_FILE="$SCRIPT_DIR/logs/push-watcher.log"

# Backoff configuration (imp-1170)
BASE_INTERVAL=60                # seconds — level 0
BACKOFF_LEVELS=(60 120 240 480) # interval per backoff level (indexed)
BACKOFF_MAX_LEVEL=3             # last index in BACKOFF_LEVELS (caps at 480s)
BACKOFF_ALERT_THRESHOLD=5       # consecutive rate-limited failures before stderr alert
JITTER_PCT=10                   # ±10% jitter on each sleep interval

mkdir -p "$SCRIPT_DIR/logs"

# Public-repository safety: start-up check, engine branch, push helper.
# shellcheck disable=SC1091
. "$SCRIPT_DIR/engine-preflight.sh"

# Compute jittered sleep for a given base interval (in seconds).
# Echoes the jittered integer to stdout.
jittered_sleep_seconds() {
  local base="$1"
  local span=$(( base * JITTER_PCT / 100 ))      # 10% of base
  if [ "$span" -lt 1 ]; then
    echo "$base"
    return
  fi
  # RANDOM is 0..32767; map to [-span, +span]
  local delta=$(( (RANDOM % (2 * span + 1)) - span ))
  local sleep_s=$(( base + delta ))
  if [ "$sleep_s" -lt 1 ]; then sleep_s=1; fi
  echo "$sleep_s"
}

# Detect rate-limit signatures in push output. Returns 0 (true) on match.
is_rate_limited() {
  local output="$1"
  # Case-insensitive grep for any of the known signatures.
  if echo "$output" | grep -qiE '(\b403\b|\b429\b|rate limit|API rate limit exceeded)'; then
    return 0
  fi
  return 1
}

case "${1:-status}" in
  --daemon-loop)
    echo "[$(date -u +%FT%TZ)] push-watcher started (PID $$, base interval ${BASE_INTERVAL}s, backoff levels ${BACKOFF_LEVELS[*]}s, jitter ±${JITTER_PCT}%)" >> "$LOG_FILE"
    backoff_level=0
    consecutive_rate_limited=0
    alert_emitted=0
    guard_defers=0
    GUARD_DEFER_ALERT=10   # loud alert after this many consecutive guard-deferred cycles
    while true; do
      cd "$PROJECT_DIR" || exit 1
      # Refuse to push from a clone that is not set up for it (hooks missing,
      # wrong branch or remote). Re-checked every cycle; nothing is pushed while it fails.
      if ! engine_preflight 2>>"$LOG_FILE"; then
        echo "[$(date -u +%FT%TZ)] push SKIPPED — start-up check refused (see lines above)" >> "$LOG_FILE"
        sleep "$(jittered_sleep_seconds "${BACKOFF_LEVELS[$BACKOFF_MAX_LEVEL]}")"
        continue
      fi
      git fetch "$ENGINE_REMOTE" --quiet 2>/dev/null || true
      unpushed=$(engine_unpushed_count)
      if [ "${unpushed:-0}" -gt 0 ]; then
        ts=$(date -u +%FT%TZ)
        # Pre-push tracked-imports guard (the "guard the push path" deploy fix).
        # The shared worktree occasionally holds a transient state where a
        # COMMITTED page/data file imports a module that is still untracked (a
        # sibling worker created the page but hasn't committed the module yet).
        # Pushing that HEAD reaches Vercel's clean checkout and fails the build
        # (the intermittent "● Error" deployments). Defer the push until the tree
        # is import-consistent — the guard passes once the owning worker commits
        # the module (usually within one cycle), then the batched commits push
        # together and Vercel builds green.
        if ! node "$PROJECT_DIR/scripts/prepush-tracked-imports-guard.mjs" >/dev/null 2>>"$LOG_FILE"; then
          guard_defers=$(( guard_defers + 1 ))
          echo "[$ts] push DEFERRED — tracked-imports guard failed (untracked import; shared-worktree race); defer #$guard_defers" >> "$LOG_FILE"
          if [ "$guard_defers" -ge "$GUARD_DEFER_ALERT" ]; then
            echo "[$ts] ALERT: push-watcher deferred $guard_defers cycles on the tracked-imports guard — likely a genuine orphaned import, not a transient race. Commits are NOT being pushed; investigate." | tee -a "$LOG_FILE" >&2
          fi
          sleep_s=$(jittered_sleep_seconds "${BACKOFF_LEVELS[$backoff_level]}")
          sleep "$sleep_s"
          continue
        fi
        guard_defers=0
        echo "[$ts] $unpushed unpushed commit(s) — pushing... (backoff_level=$backoff_level)" >> "$LOG_FILE"
        # Capture push output so we can scan for rate-limit signatures.
        # engine-push.sh: range check (allow-list, sanitiser rules, commit
        # messages), then `git push origin HEAD:refs/heads/$ENGINE_BRANCH`.
        # Exit 3 = a commit in the range was rejected; it is NOT pushed and
        # needs a person (see the runbook).
        push_output=$("$SCRIPT_DIR/engine-push.sh" 2>&1)
        push_status=$?
        echo "$push_output" >> "$LOG_FILE"
        if [ "$push_status" -eq 0 ]; then
          echo "[$ts] push OK (backoff reset)" >> "$LOG_FILE"
          backoff_level=0
          consecutive_rate_limited=0
          alert_emitted=0
        else
          if is_rate_limited "$push_output"; then
            consecutive_rate_limited=$(( consecutive_rate_limited + 1 ))
            if [ "$backoff_level" -lt "$BACKOFF_MAX_LEVEL" ]; then
              backoff_level=$(( backoff_level + 1 ))
            fi
            echo "[$ts] push failed — rate-limit detected (consecutive=$consecutive_rate_limited, backoff_level=$backoff_level)" >> "$LOG_FILE"
            if [ "$consecutive_rate_limited" -ge "$BACKOFF_ALERT_THRESHOLD" ] && [ "$alert_emitted" -eq 0 ]; then
              echo "[$ts] ALERT: push-watcher rate-limited $consecutive_rate_limited consecutive times; backoff capped at ${BACKOFF_LEVELS[$BACKOFF_MAX_LEVEL]}s. Daemon continues running." >&2
              echo "[$ts] ALERT: push-watcher rate-limited $consecutive_rate_limited consecutive times; backoff capped at ${BACKOFF_LEVELS[$BACKOFF_MAX_LEVEL]}s. Daemon continues running." >> "$LOG_FILE"
              alert_emitted=1
            fi
          elif [ "$push_status" -eq 3 ] || [ "$push_status" -eq 4 ]; then
            echo "[$ts] ALERT: push REFUSED by the public-repository checks (exit $push_status). Commits stay local until a person resolves it." | tee -a "$LOG_FILE" >&2
          else
            # Non-rate-limit failure: don't widen backoff, just log and retry at current cadence.
            echo "[$ts] push failed (non-rate-limit; backoff_level unchanged at $backoff_level)" >> "$LOG_FILE"
          fi
        fi
      fi
      current_interval="${BACKOFF_LEVELS[$backoff_level]}"
      sleep_s=$(jittered_sleep_seconds "$current_interval")
      sleep "$sleep_s"
    done
    ;;
  start)
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
      echo "push-watcher already running (PID $(cat "$PID_FILE"))"
      exit 0
    fi
    engine_preflight || { echo "push-watcher NOT started: start-up check refused (see above)."; exit 1; }
    nohup bash "$0" --daemon-loop >> "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
    echo "push-watcher started (PID $!, log: $LOG_FILE)"
    # imp-1278: also kick the ssr-pool supervisor so assertion sweeps run
    # against a warm vite server instead of paying the ~60-90s cold start.
    # Idempotent: no-op if the pool is already running.
    if [ -x "$SCRIPT_DIR/ssr-pool-supervisor.sh" ]; then
      "$SCRIPT_DIR/ssr-pool-supervisor.sh" start >> "$LOG_FILE" 2>&1 || true
    fi
    ;;
  stop)
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
      kill "$(cat "$PID_FILE")"
      rm -f "$PID_FILE"
      echo "push-watcher stopped"
    else
      echo "push-watcher not running"
      rm -f "$PID_FILE"
    fi
    ;;
  status)
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
      echo "push-watcher RUNNING (PID $(cat "$PID_FILE"))"
      echo "Last 5 log lines:"
      tail -5 "$LOG_FILE" 2>/dev/null | sed 's/^/  /'
    else
      echo "push-watcher NOT running"
    fi
    ;;
  *)
    echo "Usage: $0 {start|stop|status}"
    exit 1
    ;;
esac
