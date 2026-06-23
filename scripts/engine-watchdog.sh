#!/bin/bash
# scripts/engine-watchdog.sh
# imp-1175 (META, supervisor): polls every WATCHDOG_INTERVAL seconds and
# restarts any of the 4 auto-improve engines (subscription, api, sonnet,
# haiku) that have died. Independent of every engine + push-watcher, so a
# crash storm cannot leave the queue starved.
#
# DETECTION:
#   For each engine script, run its `status` subcommand and parse stdout for
#   "is RUNNING" (alive) vs "is NOT running" or "STOPPED" (dead). If dead,
#   invoke `start` and log the restart.
#
# JITTERED INTERVAL:
#   Default 90s with +-10% jitter to avoid stampeding the API on parallel
#   restart attempts when multiple engines die at once.
#
# CIRCUIT BREAKER:
#   If the same engine has been restarted >=5 times in the last 30 minutes,
#   pause restarts on it for 30 min and emit an alert (so a crash loop
#   doesn't pound the API repeatedly). Restart counters reset on a clean
#   30-min window with no restarts.
#
# USAGE:
#   ./scripts/engine-watchdog.sh start          # detach as background daemon
#   ./scripts/engine-watchdog.sh stop
#   ./scripts/engine-watchdog.sh status
#   ./scripts/engine-watchdog.sh --daemon-loop  # internal; do not call directly

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PID_FILE="$SCRIPT_DIR/.engine-watchdog.pid"
LOG_FILE="$SCRIPT_DIR/logs/engine-watchdog.log"
STATE_DIR="$SCRIPT_DIR/.engine-watchdog-state"
INTERVAL_BASE="${WATCHDOG_INTERVAL:-90}"
JITTER_PCT=10
CIRCUIT_BREAKER_LIMIT=5
CIRCUIT_BREAKER_WINDOW_SEC=1800   # 30 min

mkdir -p "$SCRIPT_DIR/logs" "$STATE_DIR"

# Ordered list of engines this watchdog supervises. The single auto-improve-api.sh
# was replaced by the parallel pool (auto-improve-api-pool.sh): N workers claim
# distinct tickets via claim-next-api-ticket.mjs, so they no longer collide.
# 2026-06-23: backlog drain. Watch the api-pool (ANTHROPIC_API_KEY channel) AND the
# sonnet engine (its own `sonnet` channel) -- both independent of the user's
# interactive subscription session. The subscription/haiku engines stay OUT (they
# share the subscription channel with the interactive session and would rate-limit
# it); add them only when the user is away and accepts that trade-off.
ENGINES=(
  "auto-improve-api-pool.sh"
  "auto-improve-sonnet.sh"
)

# ── helpers ─────────────────────────────────────────────────────────────────

jittered_sleep_seconds() {
  local base=$1
  local span=$(( base * JITTER_PCT / 100 ))
  local offset=$(( (RANDOM % (2 * span + 1)) - span ))
  local result=$(( base + offset ))
  [ $result -lt 1 ] && result=1
  echo $result
}

now_epoch() { date +%s; }
iso_utc()  { date -u +%FT%TZ; }

is_engine_running() {
  local script=$1
  local out
  out=$("$SCRIPT_DIR/$script" status 2>&1 || true)
  # Engines print "is RUNNING (PID …)" when alive.
  echo "$out" | grep -qE "is RUNNING"
}

# An engine can be RUNNING (supervisor alive) yet wedged: its `claude --print`
# child is socket-blocked, so the heartbeat goes stale and no tickets advance
# (this caused a 26h API idle on 2026-06-02). Plain death-detection misses it.
#
# We do NOT use the engine's own "STALL DETECTED" line: it fires at 2 ticks
# (240s for the API), but the heartbeat is written only AFTER each claude turn
# completes, so a healthy multi-minute research turn legitimately looks "stale"
# mid-flight. Restarting on that signal would kill healthy long turns in a loop.
#
# Instead we read the heartbeat file directly against a conservative absolute
# threshold (HANG_THRESHOLD_SEC). No healthy turn runs anywhere near 30 min,
# while the real hang ran 26 HOURS — so this catches genuine hangs without ever
# interrupting a working turn. Only api + subscription emit heartbeats; the
# sonnet/haiku engines have none, so they are skipped (return non-stalled).
HANG_THRESHOLD_SEC="${WATCHDOG_HANG_THRESHOLD_SEC:-1800}"

heartbeat_file_for() {
  case "$1" in
    auto-improve.sh)     echo "$SCRIPT_DIR/.heartbeat" ;;
    auto-improve-api.sh) echo "$SCRIPT_DIR/.heartbeat-api" ;;
    # The pool has one heartbeat per worker (.heartbeat-api-pool-w<N>). Report the
    # FRESHEST one: if even the most-recently-active worker is >30 min stale, the
    # whole pool is wedged. A single slow worker won't trip it (another worker's
    # heartbeat stays fresh), so we only force-restart on a genuine full hang.
    auto-improve-api-pool.sh)
      ls -t "$SCRIPT_DIR"/.heartbeat-api-pool-w* 2>/dev/null | head -1 ;;
    *)                   echo "" ;;
  esac
}

is_engine_stalled() {
  local script=$1
  local hb
  hb=$(heartbeat_file_for "$script")
  [ -z "$hb" ] && return 1          # no heartbeat (sonnet/haiku) → can't judge
  [ ! -f "$hb" ] && return 1        # not written yet (just starting) → not a hang
  local beat age
  beat=$(stat -f %m "$hb" 2>/dev/null || echo 0)
  age=$(( $(now_epoch) - beat ))
  [ "$age" -gt "$HANG_THRESHOLD_SEC" ]
}

# Force-restart clears a wedged engine: do_stop kills the supervisor AND its
# direct children (the hung claude), then start spawns a fresh turn. A plain
# `start` no-ops while the stale supervisor is still alive, so stop first.
force_restart_engine() {
  local script=$1
  local count
  count=$(restart_count_in_window "$script")
  if [ "$count" -ge "$CIRCUIT_BREAKER_LIMIT" ]; then
    echo "[$(iso_utc)] CIRCUIT_BREAKER: $script stalled but restarted $count times in last ${CIRCUIT_BREAKER_WINDOW_SEC}s, suppressing" >> "$LOG_FILE"
    return
  fi
  echo "[$(iso_utc)] STALLED: $script — force-restart (stop+start, restart #$((count+1)) in window)" >> "$LOG_FILE"
  "$SCRIPT_DIR/$script" stop  >> "$LOG_FILE" 2>&1 || true
  "$SCRIPT_DIR/$script" start >> "$LOG_FILE" 2>&1 || true
  record_restart "$script"
}

# Circuit-breaker bookkeeping: store epoch timestamps of recent restarts,
# one engine per file. Trim entries older than CIRCUIT_BREAKER_WINDOW_SEC.
restart_count_in_window() {
  local script=$1
  local f="$STATE_DIR/$script.restarts"
  [ ! -f "$f" ] && { echo 0; return; }
  local cutoff=$(( $(now_epoch) - CIRCUIT_BREAKER_WINDOW_SEC ))
  # Filter in-place by writing only fresh lines back.
  local fresh
  fresh=$(awk -v c="$cutoff" '$1 > c { print $1 }' "$f")
  echo "$fresh" > "$f"
  echo "$fresh" | grep -c . | tr -d ' '
}

record_restart() {
  local script=$1
  local f="$STATE_DIR/$script.restarts"
  now_epoch >> "$f"
}

restart_engine() {
  local script=$1
  local count
  count=$(restart_count_in_window "$script")
  if [ "$count" -ge "$CIRCUIT_BREAKER_LIMIT" ]; then
    echo "[$(iso_utc)] CIRCUIT_BREAKER: $script restarted $count times in last ${CIRCUIT_BREAKER_WINDOW_SEC}s, suppressing" >> "$LOG_FILE"
    return
  fi
  echo "[$(iso_utc)] RESTARTING $script (restart #$((count+1)) in window)" >> "$LOG_FILE"
  "$SCRIPT_DIR/$script" start >> "$LOG_FILE" 2>&1 || true
  record_restart "$script"
}

# ── main subcommand dispatch ────────────────────────────────────────────────

case "${1:-status}" in
  --daemon-loop)
    echo "[$(iso_utc)] engine-watchdog started (PID $$, interval base ${INTERVAL_BASE}s ± ${JITTER_PCT}%)" >> "$LOG_FILE"
    while true; do
      for script in "${ENGINES[@]}"; do
        if is_engine_running "$script"; then
          if is_engine_stalled "$script"; then
            force_restart_engine "$script"
          fi
        else
          echo "[$(iso_utc)] DEAD: $script" >> "$LOG_FILE"
          restart_engine "$script"
        fi
      done
      sleep_sec=$(jittered_sleep_seconds "$INTERVAL_BASE")
      sleep "$sleep_sec"
    done
    ;;

  start)
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
      echo "Engine watchdog already running (PID $(cat "$PID_FILE"))"
      exit 0
    fi
    nohup "$0" --daemon-loop > /dev/null 2>&1 &
    echo $! > "$PID_FILE"
    echo "Engine watchdog started (PID $!, log: $LOG_FILE)"
    # imp-1278: also kick the ssr-pool supervisor so assertion sweeps run
    # against a warm vite server (idempotent; no-op if already running).
    if [ -x "$SCRIPT_DIR/ssr-pool-supervisor.sh" ]; then
      "$SCRIPT_DIR/ssr-pool-supervisor.sh" start >> "$LOG_FILE" 2>&1 || true
    fi
    ;;

  stop)
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
      pid=$(cat "$PID_FILE")
      kill "$pid" 2>/dev/null || true
      rm -f "$PID_FILE"
      echo "Engine watchdog stopped (was PID $pid)"
    else
      echo "Engine watchdog not running"
      rm -f "$PID_FILE"
    fi
    ;;

  status)
    if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
      pid=$(cat "$PID_FILE")
      echo "Engine watchdog is RUNNING (PID $pid)"
      echo "Recent log tail:"
      tail -10 "$LOG_FILE" 2>/dev/null | sed 's/^/  /'
    else
      echo "Engine watchdog is NOT running"
    fi
    ;;

  *)
    echo "Usage: $0 {start|stop|status|--daemon-loop}"
    exit 1
    ;;
esac
