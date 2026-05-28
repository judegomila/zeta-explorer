#!/usr/bin/env bash
# scripts/ssr-pool-supervisor.sh
# imp-1278 (META, supervisor): idempotent supervisor for the imp-1193
# vite-ssr-pool daemon. Ensures a warm Vite SSR server is running so
# every run-assertions.mjs sweep gets cache-hits instead of paying the
# ~60-90s cold-start cost.
#
# DAEMON
#   scripts/vite-ssr-pool.mjs (imp-1193) is the daemon. It already
#   speaks NDJSON over a unix socket with ops {ping, sweep, invalidate,
#   stop} and self-probes on startup so two copies cannot race on the
#   same socket. We do NOT re-invent it -- this supervisor just makes
#   sure exactly one instance is alive.
#
# SOCKET / PID
#   Default socket: scripts/.vite-ssr-pool.sock  (matches the daemon's
#   DEFAULT_SOCKET so run-assertions.mjs's POOL_SOCK probe finds it
#   without callers having to set anything).
#   Default pid  : scripts/.ssr-pool.pid
#
# IDEMPOTENCY
#   1. If the pid file exists AND the pid is alive AND a ping over the
#      socket returns ok=true, we print "ssr-pool: already running" and
#      exit 0 without touching anything.
#   2. Otherwise we clean up stale state (dead pid, orphaned socket) and
#      start a fresh daemon under nohup, writing a new pid file.
#   3. We then wait up to POOL_READY_TIMEOUT_S for the socket to accept
#      a ping. If it does, we print "ssr-pool: started" and exit 0. If
#      it doesn't, we print a clear error and exit 2 leaving the partial
#      process alive so an operator can inspect logs.
#
# CRON / SUPERVISORD SAFETY
#   Exit codes are stable, side-effects are bounded, and the script does
#   not require a TTY. Multiple concurrent invocations will all observe
#   the same "already running" outcome because of the daemon's own
#   socket-probe self-protection (vite-ssr-pool.mjs lines 96-108).
#
# USAGE
#   ./scripts/ssr-pool-supervisor.sh           # ensure running (default)
#   ./scripts/ssr-pool-supervisor.sh start     # alias of default
#   ./scripts/ssr-pool-supervisor.sh status    # print state, no-op
#   ./scripts/ssr-pool-supervisor.sh stop      # ask daemon to exit
#   ./scripts/ssr-pool-supervisor.sh restart   # stop + start
#
# EXIT CODES
#   0  ok (running, started, stopped, or status-printed cleanly)
#   1  usage / state error (e.g. unknown subcommand)
#   2  daemon failed to come up within timeout
#   3  daemon script not found (imp-1193 not shipped at expected path)

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
DAEMON_SCRIPT="$SCRIPT_DIR/vite-ssr-pool.mjs"
# Use the daemon's own DEFAULT_SOCKET so run-assertions.mjs (which honors
# POOL_SOCK env var or the daemon's default) finds the pool without any
# extra wiring at call sites.
SOCKET_PATH="${POOL_SOCK:-$SCRIPT_DIR/.vite-ssr-pool.sock}"
PID_FILE="$SCRIPT_DIR/.ssr-pool.pid"
LOG_DIR="$SCRIPT_DIR/logs"
LOG_FILE="$LOG_DIR/ssr-pool.log"
POOL_SIZE="${SSR_POOL_SIZE:-4}"
POOL_READY_TIMEOUT_S=10

mkdir -p "$LOG_DIR"

iso_utc() { date -u +%FT%TZ; }

# Probe the daemon over its unix socket. Echos one line of JSON on
# success and returns 0. Returns non-zero (with no output) if the
# socket is absent or the probe fails / times out.
probe_pool() {
  if [ ! -S "$SOCKET_PATH" ]; then
    return 1
  fi
  # Use node's net.createConnection via the daemon's own --ping mode -
  # it already handles the NDJSON request/response and exits 0 / 1
  # based on the response.
  local out
  out=$(POOL_SOCK="$SOCKET_PATH" node "$DAEMON_SCRIPT" --ping 2>/dev/null)
  local rc=$?
  if [ "$rc" -eq 0 ] && [ -n "$out" ]; then
    echo "$out"
    return 0
  fi
  return 1
}

# Read the daemon pid out of the running daemon's ping reply, since the
# daemon writes its own pid into the ping response. Falls back to the
# pid file if the socket is up but ping parsing fails.
read_daemon_pid_from_ping() {
  local pong
  pong=$(probe_pool) || return 1
  # Grep pid out of the JSON without pulling in jq.
  echo "$pong" | sed -nE 's/.*"pid":[[:space:]]*([0-9]+).*/\1/p' | head -1
}

is_pid_alive() {
  local pid=$1
  [ -n "$pid" ] && [ "$pid" -gt 0 ] 2>/dev/null && kill -0 "$pid" 2>/dev/null
}

clean_stale_state() {
  # Remove a pid file whose process is dead.
  if [ -f "$PID_FILE" ]; then
    local pid
    pid=$(cat "$PID_FILE" 2>/dev/null || echo "")
    if ! is_pid_alive "$pid"; then
      rm -f "$PID_FILE"
    fi
  fi
  # Remove an orphaned socket file (no process holding it). vite-ssr-pool.mjs
  # already does this on its own startup, so this is a belt-and-suspenders
  # cleanup for the case where the supervisor was killed mid-start.
  if [ -e "$SOCKET_PATH" ] && ! probe_pool >/dev/null 2>&1; then
    rm -f "$SOCKET_PATH"
  fi
}

print_state() {
  local label=$1
  local pid=$2
  echo "ssr-pool: $label PID=${pid:-?} socket=$SOCKET_PATH"
}

ensure_daemon_present() {
  if [ ! -f "$DAEMON_SCRIPT" ]; then
    echo "ssr-pool: ERROR daemon script not found at $DAEMON_SCRIPT; build it first (see imp-1193)" >&2
    exit 3
  fi
}

do_status() {
  if probe_pool >/dev/null 2>&1; then
    local pid
    pid=$(read_daemon_pid_from_ping || echo "")
    if [ -z "$pid" ] && [ -f "$PID_FILE" ]; then
      pid=$(cat "$PID_FILE" 2>/dev/null || echo "")
    fi
    print_state "running" "$pid"
    return 0
  fi
  echo "ssr-pool: not running socket=$SOCKET_PATH"
  return 0
}

do_start() {
  ensure_daemon_present

  # 1) Already running? (idempotent fast path.)
  if probe_pool >/dev/null 2>&1; then
    local pid
    pid=$(read_daemon_pid_from_ping || echo "")
    if [ -z "$pid" ] && [ -f "$PID_FILE" ]; then
      pid=$(cat "$PID_FILE" 2>/dev/null || echo "")
    fi
    print_state "already running" "$pid"
    return 0
  fi

  # 2) Clean stale pid/socket left over from a previous crash.
  clean_stale_state

  # 3) Spawn the daemon detached. POOL_SOCK env lets the daemon use the
  #    same default socket run-assertions.mjs probes.
  echo "[$(iso_utc)] ssr-pool-supervisor: starting daemon (pool size $POOL_SIZE, socket $SOCKET_PATH)" >> "$LOG_FILE"
  (
    cd "$PROJECT_DIR" || exit 1
    POOL_SOCK="$SOCKET_PATH" \
      nohup node "$DAEMON_SCRIPT" --socket="$SOCKET_PATH" \
      >> "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
    disown $! 2>/dev/null || true
  )

  # 4) Wait for the socket to accept a ping.
  local started_at
  started_at=$(date +%s)
  while true; do
    if probe_pool >/dev/null 2>&1; then
      local pid
      pid=$(cat "$PID_FILE" 2>/dev/null || echo "")
      if ! is_pid_alive "$pid"; then
        # ping succeeded but our pid file is stale - read pid from the
        # daemon's own ping reply and rewrite the pid file so subsequent
        # supervisor calls see the correct pid.
        local live_pid
        live_pid=$(read_daemon_pid_from_ping || echo "")
        if [ -n "$live_pid" ]; then
          echo "$live_pid" > "$PID_FILE"
          pid="$live_pid"
        fi
      fi
      print_state "started" "$pid"
      echo "[$(iso_utc)] ssr-pool-supervisor: ready PID=$pid" >> "$LOG_FILE"
      return 0
    fi
    local now
    now=$(date +%s)
    if [ "$((now - started_at))" -ge "$POOL_READY_TIMEOUT_S" ]; then
      echo "ssr-pool: ERROR daemon did not respond on $SOCKET_PATH within ${POOL_READY_TIMEOUT_S}s; check $LOG_FILE" >&2
      return 2
    fi
    sleep 1
  done
}

do_stop() {
  ensure_daemon_present
  if probe_pool >/dev/null 2>&1; then
    POOL_SOCK="$SOCKET_PATH" node "$DAEMON_SCRIPT" --stop >/dev/null 2>&1 || true
    # Give it a moment to release the socket cleanly.
    local waited=0
    while [ "$waited" -lt 5 ] && [ -e "$SOCKET_PATH" ]; do
      sleep 1
      waited=$((waited + 1))
    done
    rm -f "$PID_FILE"
    echo "ssr-pool: stopped"
    return 0
  fi
  echo "ssr-pool: not running (nothing to stop)"
  clean_stale_state
  return 0
}

do_restart() {
  do_stop
  do_start
}

case "${1:-start}" in
  start|ensure|"")
    do_start
    ;;
  status)
    do_status
    ;;
  stop)
    do_stop
    ;;
  restart)
    do_restart
    ;;
  *)
    echo "Usage: $0 {start|status|stop|restart}" >&2
    exit 1
    ;;
esac
