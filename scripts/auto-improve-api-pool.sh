#!/usr/bin/env bash
# Auto-Improvement Engine -- PARALLEL API POOL (imp-1285 follow-on)
# Usage: ./scripts/auto-improve-api-pool.sh [start|stop|status]
#
# Replaces the single-worker auto-improve-api.sh with a pool of N parallel
# workers, all billing to ANTHROPIC_API_KEY (the api/opus-4-8 bucket). A
# single serialized worker uses <1% of the API rate ceiling (10M in / 800K
# out TPM, 20K RPM), so the bottleneck is wall-clock per turn, not the API.
# Running N workers gives ~Nx throughput.
#
# The ONE hazard of N workers on the same bucket is two of them grabbing the
# SAME ticket -> duplicate spend + colliding commits. claim-next-api-ticket.mjs
# solves this: each worker atomically flips its ticket pending ->
# in-progress-subagent (mtime+from guarded), so the loser of any race simply
# gets the next candidate. build-queue-index.mjs already excludes
# in-progress-subagent tickets from every engine's bucket, so a claimed ticket
# is invisible to the other 4 subscription engines too. Stale claims (worker
# died mid-turn) self-heal: every claim reaps pool claims older than 30 min.
#
# Workers do NOT push -- push-watcher.sh is the single pusher. On clean stop we
# --reap-all so no ticket is left stranded in in-progress-subagent.
#
# Requires ANTHROPIC_API_KEY in env (or scripts/.env). Absent -> refuse start.

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PID_FILE="$SCRIPT_DIR/.auto-improve-api-pool.pid"
LOG_DIR="$SCRIPT_DIR/logs"
IMPROVEMENTS_FILE="$PROJECT_DIR/IMPROVEMENTS.md"
CLAIM_CLI="$SCRIPT_DIR/claim-next-api-ticket.mjs"

N_WORKERS=${API_POOL_WORKERS:-4}
INTERVAL=${INTERVAL:-20}          # inter-turn idle per worker
IDLE_SLEEP=${IDLE_SLEEP:-90}      # sleep when a worker claims NONE (queue drained)
MAX_RUNS=${MAX_RUNS:-500}         # per-worker run cap
IDLE_THRESHOLD=${IDLE_THRESHOLD:-15}  # per-worker consecutive NONE before that worker exits
# Hard per-turn wall-clock cap. `claude --print` can socket-wedge and produce zero
# output indefinitely (observed 3 turns stuck 3+ HOURS on 2026-06-03, the same
# failure class as the 26h hang). Without this, one wedge permanently removes a
# worker from the pool. On timeout we kill the turn, release the ticket (the
# unconditional --release reverts it to pending), and the worker continues. No
# healthy research turn runs anywhere near 30 min.
TURN_TIMEOUT=${TURN_TIMEOUT:-1800}

# Per-worker prompt. {TICKET} is substituted with the claimed imp-NNN before each
# turn. The worker is told to work ONLY that ticket -- the claim CLI already chose
# it by priority/age, so the worker must not re-pick. This keeps turns token-light
# (no queue-index scan / bucket reasoning) and guarantees distinct work.
read -r -d '' POOL_PROMPT_TEMPLATE <<'PROMPT_EOF'
You are a worker in the parallel API pool improving the ZPO Explorer / RH-attack project. You have been ASSIGNED exactly one ticket: {TICKET}. It is already claimed for you (status in-progress-subagent). Do NOT pick a different ticket.

0. TOKEN BUDGET DISCIPLINE: never read these monolithic files in full:
   - src/data/improvements.js (~280K tokens)
   - src/data/improvement-queue.js (~87K tokens)
   - IMPROVEMENTS.md (~60K tokens)
   To read YOUR ticket's body, run: grep -n "id: '{TICKET}'" src/data/improvement-queue.js to find the line, then read just that span with the Read tool (offset/limit ~40 lines). Do not scan the whole queue.

1. At the START of your response state: "POOL: {TICKET}".

2. Work ONLY {TICKET}. If it is research-grade and you cannot fully close it, deliver an HONEST PARTIAL closure with a clearly-named sub-gap -- that is valuable. NEVER fabricate results, proofs, or false QEDs.

3. Read the relevant source files before changing anything.

4. Make exactly ONE small, atomic change. Do not refactor or restructure.

5. After your change run: npm run build. If it fails, fix it before finishing.

6. Log the improvement in TWO places:
   a) Append a row to IMPROVEMENTS.md: | # | TIMESTAMP | one-line summary | files changed |  (next sequential number, current UTC timestamp).
   b) Append an entry to src/data/improvements.js before the closing ];  using the tail-append pattern (read only the LAST ~30 lines via offset, verify the last line is `];`, then Edit `];` -> `  { id: NEXT, ... },\n];`). Use the nextImprovementId from scripts/queue-index.json as the id. Format:
      { id: NEXT_NUMBER, timestamp: "UTC_TIMESTAMP", category: "bug|accuracy|ux|visual|performance|content|proof|feature|meta|numerical", summary: "one-line summary", files: ["file1.js"], detail: "2-3 sentence description", model: "opus-4-8", channel: "api-pool" },

7. SYSTEM OF RECORD -- flip {TICKET} from in-progress-subagent to completed in src/data/improvement-queue.js, and ALSO add:
   completedByModel: "opus-4-8",
   completedByChannel: "api-pool",
   Remove the inflightTaskId line if present. LEAVE any predicted model/channel fields ALONE.

8. If after reading you determine {TICKET} cannot be meaningfully advanced at all (already done, or fundamentally blocked), state "POOL: {TICKET} -- no-op" and STOP without editing. Do NOT flip it to completed and do NOT invent work. (The harness will release it back to pending.)

9. Create a git commit mentioning {TICKET}. Do NOT push -- the push-watcher daemon handles pushing.

SYNTAX GOTCHAS (mandatory):
- DO NOT write the comment-close sequence inside a JSDoc comment. Use "dg_{k*}/dt" form in comments.
- DO NOT use apostrophes inside single-quoted JS strings.

RULES:
- Never install new packages or rename/restructure files.
- Never modify the engine scripts or the IMPROVEMENTS.md header.
- One logical change per run. Never delete features or pages. Focus on src/.
PROMPT_EOF

# Optional .env (gitignored) sets ANTHROPIC_API_KEY for this subshell + children.
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

# Run a command with a hard wall-clock timeout (macOS has no `timeout(1)`). Launches
# it in the background, polls liveness, and on deadline kills the whole process
# subtree (children first so a wedged claude can't reparent/escape). Returns the
# command's exit code, or 124 if it was killed for exceeding the timeout.
run_with_timeout() {
  local timeout_s="$1"; shift
  "$@" &
  local cpid=$!
  local waited=0
  while kill -0 "$cpid" 2>/dev/null; do
    if [ "$waited" -ge "$timeout_s" ]; then
      pkill -P "$cpid" 2>/dev/null || true
      kill "$cpid" 2>/dev/null || true
      sleep 2
      pkill -9 -P "$cpid" 2>/dev/null || true
      kill -9 "$cpid" 2>/dev/null || true
      return 124
    fi
    sleep 10
    waited=$((waited + 10))
  done
  wait "$cpid"
  return $?
}

# One worker's lifetime loop. Args: worker_id. Runs in its own subshell.
worker_loop() {
  local wid="$1"
  local hb_file="$SCRIPT_DIR/.heartbeat-api-pool-w${wid}"
  local run_count=0
  local idle_count=0

  # cd + unset once for this worker's subshell: claude bills to ANTHROPIC_API_KEY
  # and must not be treated as a nested session.
  cd "$PROJECT_DIR" || return
  unset CLAUDECODE

  while [ "$run_count" -lt "$MAX_RUNS" ]; do
    run_count=$((run_count + 1))
    local timestamp
    timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
    local log_file="$LOG_DIR/run_apipool_w${wid}_${timestamp//[:T]/_}.log"

    # Refresh the index so nextImprovementId / pending counts are fresh for the turn.
    node "$SCRIPT_DIR/build-queue-index.mjs" >> "$log_file" 2>&1 || true

    # Atomically claim a distinct ticket. Prints imp-NNN or NONE.
    local ticket
    ticket=$(node --no-warnings "$CLAIM_CLI" --worker "$wid" 2>>"$log_file")

    if [ "$ticket" = "NONE" ] || [ -z "$ticket" ]; then
      idle_count=$((idle_count + 1))
      echo "=== w${wid} run #$run_count: NONE (idle $idle_count/$IDLE_THRESHOLD) at $timestamp ===" >> "$log_file"
      date +%s > "$hb_file"
      if [ "$idle_count" -ge "$IDLE_THRESHOLD" ]; then
        echo "w${wid}: idle threshold reached -- worker exiting." >> "$log_file"
        break
      fi
      sleep "$IDLE_SLEEP"
      continue
    fi
    idle_count=0

    echo "=== w${wid} run #$run_count CLAIMED $ticket at $timestamp ===" | tee "$log_file"
    local prompt="${POOL_PROMPT_TEMPLATE//\{TICKET\}/$ticket}"

    local exit_code=0
    if command -v claude &>/dev/null; then
      run_with_timeout "$TURN_TIMEOUT" \
        claude --print --model "${API_ENGINE_MODEL:-claude-opus-4-8}" --dangerously-skip-permissions "$prompt" \
        >> "$log_file" 2>&1
      exit_code=$?
      if [ "$exit_code" -eq 124 ]; then
        echo "=== w${wid} run #$run_count TIMED OUT after ${TURN_TIMEOUT}s on $ticket -- killed, releasing ===" >> "$log_file"
      fi
    else
      echo "ERROR: 'claude' CLI not found in PATH" >> "$log_file"
      exit_code=79
    fi

    echo "=== w${wid} run #$run_count complete (exit=$exit_code) for $ticket ===" >> "$log_file"

    # Idempotent release: if the turn flipped the ticket to completed, this is a
    # no-op (from-guard fails on a non-in-progress-subagent status). If the turn
    # left it claimed (no-op / crash), this reverts it to pending so it is picked
    # up again rather than stranded.
    node --no-warnings "$CLAIM_CLI" --release "$ticket" >> "$log_file" 2>&1 || true

    date +%s > "$hb_file"

    if [ "$run_count" -lt "$MAX_RUNS" ]; then
      sleep "$INTERVAL"
    fi
  done

  echo "w${wid}: completed $run_count runs. Exiting."
  rm -f "$hb_file"
}

do_start() {
  if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    echo "Auto-improve API pool is already running (PID $(cat "$PID_FILE"))"
    exit 1
  fi

  init_improvements

  if [ -z "${ANTHROPIC_API_KEY:-}" ]; then
    echo "Auto-improve API pool: ANTHROPIC_API_KEY is NOT set."
    echo "  To enable: export ANTHROPIC_API_KEY=sk-ant-... (or add to scripts/.env)"
    echo "  Pool NOT started."
    exit 0
  fi

  echo "Starting auto-improvement API POOL..."
  echo "  Workers:  $N_WORKERS"
  echo "  Interval: ${INTERVAL}s per worker"
  echo "  Model:    ${API_ENGINE_MODEL:-claude-opus-4-8}"
  echo "  Logs:     $LOG_DIR (run_apipool_w*_*.log)"
  echo "  PID file: $PID_FILE"

  # Supervisor subshell: spawns N worker loops, waits for all to finish, then
  # reaps any leftover pool claims. Backgrounded; its PID is the pool handle.
  (
    # Clear any stale claims left by a previous unclean shutdown before we begin.
    node --no-warnings "$CLAIM_CLI" --reap-all >/dev/null 2>&1 || true

    worker_pids=()
    for ((w = 1; w <= N_WORKERS; w++)); do
      worker_loop "$w" &
      worker_pids+=("$!")
      # Small stagger so the first claims don't all hit the queue file in the
      # exact same millisecond (cheap insurance on top of the mtime guard).
      sleep 1
    done

    wait "${worker_pids[@]}"

    # All workers exited (idle-drained or killed). Release any stranded claims.
    node --no-warnings "$CLAIM_CLI" --reap-all >/dev/null 2>&1 || true
    echo "API pool: all workers exited."
    rm -f "$PID_FILE"
  ) &

  bg_pid=$!
  echo "$bg_pid" > "$PID_FILE"
  disown
  echo "Auto-improve API pool started in background (PID $bg_pid)"
}

do_stop() {
  if [ ! -f "$PID_FILE" ]; then
    echo "Auto-improve API pool is not running (no PID file)"
    # Still reap, in case workers were orphaned by a prior unclean stop.
    node --no-warnings "$CLAIM_CLI" --reap-all >/dev/null 2>&1 || true
    exit 0
  fi
  pid=$(cat "$PID_FILE")
  if kill -0 "$pid" 2>/dev/null; then
    echo "Stopping auto-improve API pool (supervisor PID $pid)..."
    # Kill in-flight claude turns FIRST (deepest descendants), then the worker
    # loops, then the supervisor -- killing the supervisor first would orphan
    # the claude children to launchd where they keep burning tokens and commit
    # uncoordinated work (the orphan-leak we hit on the single engine).
    # pkill -P walks one level; do it depth-first across the whole tree.
    kill_tree() {
      local root="$1" child
      for child in $(pgrep -P "$root" 2>/dev/null); do
        kill_tree "$child"
      done
      kill "$root" 2>/dev/null || true
    }
    kill_tree "$pid"
    sweep_orphan_turns
    rm -f "$PID_FILE"
    # Release every pool claim so nothing is stranded in in-progress-subagent.
    node --no-warnings "$CLAIM_CLI" --reap-all >/dev/null 2>&1 || true
    echo "Stopped. Pool claims released."
  else
    echo "Supervisor $pid not found. Cleaning up PID file and reaping claims."
    sweep_orphan_turns
    rm -f "$PID_FILE"
    node --no-warnings "$CLAIM_CLI" --reap-all >/dev/null 2>&1 || true
  fi
}

# kill_tree walks ppid links, but a claude child can reparent to launchd (ppid=1)
# mid-walk and escape, leaving a token-burning orphan (observed three such orphans
# alive 13-14 HOURS after pool restarts on 2026-06-04). This sweep kills any
# surviving pool turn by its unique prompt signature, regardless of parentage.
# Safe: the signature appears only in pool claude turns' argv, not in the
# supervisor/worker scripts (whose argv is just the script path + subcommand).
sweep_orphan_turns() {
  pkill -9 -f "worker in the parallel API pool" 2>/dev/null || true
}

do_status() {
  stall_detected=0
  if [ -f "$PID_FILE" ] && kill -0 "$(cat "$PID_FILE")" 2>/dev/null; then
    pid=$(cat "$PID_FILE")
    echo "Auto-improve API pool is RUNNING (supervisor PID $pid)"
    live_workers=$(pgrep -P "$pid" 2>/dev/null | wc -l | tr -d ' ')
    echo "  Live worker loops: $live_workers / $N_WORKERS"
    now=$(date +%s)
    for hb in "$SCRIPT_DIR"/.heartbeat-api-pool-w*; do
      [ -f "$hb" ] || continue
      last=$(stat -f %m "$hb" 2>/dev/null || echo 0)
      age=$(( now - last ))
      wname=$(basename "$hb" | sed 's/^\.heartbeat-api-pool-//')
      thr=$(( INTERVAL * 30 ))   # generous: turns are minutes-long
      if [ "$age" -gt "$thr" ]; then
        echo "  $wname: heartbeat ${age}s STALE (>${thr}s)"
        stall_detected=1
      else
        echo "  $wname: heartbeat ${age}s ago"
      fi
    done
    run_count=$(ls "$LOG_DIR"/run_apipool_*.log 2>/dev/null | wc -l | tr -d ' ')
    echo "  Total pool runs logged: $run_count"
    latest=$(ls -t "$LOG_DIR"/run_apipool_*.log 2>/dev/null | head -1)
    if [ -n "$latest" ]; then
      echo "  Latest log: $latest"
      tail -3 "$latest" | sed 's/^/    /'
    fi
  else
    echo "Auto-improve API pool is NOT running"
    if [ -f "$PID_FILE" ]; then
      echo "  (stale PID file found, cleaning up)"
      rm -f "$PID_FILE"
    fi
    run_count=$(ls "$LOG_DIR"/run_apipool_*.log 2>/dev/null | wc -l | tr -d ' ')
    echo "  Total pool runs logged: $run_count"
  fi
  locked=$(node --no-warnings "$CLAIM_CLI" --reap-only 2>/dev/null || echo "?")
  echo "  Stale-claim reap check: $locked"
  if [ -z "${ANTHROPIC_API_KEY:-}" ]; then
    echo "  ANTHROPIC_API_KEY: ABSENT (pool will refuse to start)"
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
    echo "  start   - Start the parallel API worker pool"
    echo "  stop    - Stop all workers and release pool claims"
    echo "  status  - Show running workers, heartbeats, and stats"
    echo ""
    echo "Env vars:"
    echo "  ANTHROPIC_API_KEY   REQUIRED -- pool will not start without it"
    echo "  API_POOL_WORKERS    worker count (default 3)"
    echo "  API_ENGINE_MODEL    default claude-opus-4-8"
    echo "  INTERVAL            inter-turn idle seconds (default 20)"
    exit 1
    ;;
esac
