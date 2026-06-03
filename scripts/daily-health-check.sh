#!/usr/bin/env bash
# daily-health-check.sh — Runs once daily to ensure all engines and services are healthy.
#
# Checks:
# 1. Opus engine running — restart if not
# 2. Haiku engine running — restart if not
# 3. Dev server alive — report if down
# 4. Queue not empty — run autofill if drained
# 5. Queue index fresh — rebuild if stale
# 6. Stale rate-limit sentinel sweep — wipe .rate-limit-backoff-state* older than 24h (imp-1017)
# 7. Git push — push any unpushed commits
#
# Usage: ./scripts/daily-health-check.sh
# Intended to run via cron: 0 8 * * * cd /path/to/mathexplorer && ./scripts/daily-health-check.sh >> scripts/logs/daily-health.log 2>&1

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
cd "$PROJECT_DIR"

LOG_PREFIX="[$(date -u '+%Y-%m-%dT%H:%M:%SZ')]"

echo "=== DAILY HEALTH CHECK $LOG_PREFIX ==="

# ── 1. Opus engine ──────────────────────────────────────────────────────
if [ -f "$SCRIPT_DIR/.auto-improve.pid" ] && kill -0 "$(cat "$SCRIPT_DIR/.auto-improve.pid")" 2>/dev/null; then
  echo "$LOG_PREFIX Opus engine: RUNNING (PID $(cat "$SCRIPT_DIR/.auto-improve.pid"))"
else
  echo "$LOG_PREFIX Opus engine: NOT RUNNING — restarting..."
  rm -f "$SCRIPT_DIR/.rate-limit-backoff-state"
  "$SCRIPT_DIR/auto-improve.sh" start
  echo "$LOG_PREFIX Opus engine: RESTARTED"
fi

# ── 2. Haiku engine ─────────────────────────────────────────────────────
if [ -f "$SCRIPT_DIR/.auto-improve-haiku.pid" ] && kill -0 "$(cat "$SCRIPT_DIR/.auto-improve-haiku.pid")" 2>/dev/null; then
  echo "$LOG_PREFIX Haiku engine: RUNNING (PID $(cat "$SCRIPT_DIR/.auto-improve-haiku.pid"))"
else
  echo "$LOG_PREFIX Haiku engine: NOT RUNNING — restarting..."
  rm -f "$SCRIPT_DIR/.rate-limit-backoff-state-haiku"
  "$SCRIPT_DIR/auto-improve-haiku.sh" start
  echo "$LOG_PREFIX Haiku engine: RESTARTED"
fi

# ── 2b. Sonnet engine (imp-879 tier-aware dispatch) ─────────────────────
if [ -f "$SCRIPT_DIR/auto-improve-sonnet.sh" ]; then
  if [ -f "$SCRIPT_DIR/.auto-improve-sonnet.pid" ] && kill -0 "$(cat "$SCRIPT_DIR/.auto-improve-sonnet.pid")" 2>/dev/null; then
    echo "$LOG_PREFIX Sonnet engine: RUNNING (PID $(cat "$SCRIPT_DIR/.auto-improve-sonnet.pid"))"
  else
    echo "$LOG_PREFIX Sonnet engine: NOT RUNNING — restarting..."
    rm -f "$SCRIPT_DIR/.rate-limit-backoff-state-sonnet"
    "$SCRIPT_DIR/auto-improve-sonnet.sh" start
    echo "$LOG_PREFIX Sonnet engine: RESTARTED"
  fi
fi

# ── 2c. Opus-4.6 engine (imp-879 tier-aware dispatch) ───────────────────
if [ -f "$SCRIPT_DIR/auto-improve-opus46.sh" ]; then
  if [ -f "$SCRIPT_DIR/.auto-improve-opus46.pid" ] && kill -0 "$(cat "$SCRIPT_DIR/.auto-improve-opus46.pid")" 2>/dev/null; then
    echo "$LOG_PREFIX Opus-4.6 engine: RUNNING (PID $(cat "$SCRIPT_DIR/.auto-improve-opus46.pid"))"
  else
    echo "$LOG_PREFIX Opus-4.6 engine: NOT RUNNING — restarting..."
    rm -f "$SCRIPT_DIR/.rate-limit-backoff-state-opus46"
    "$SCRIPT_DIR/auto-improve-opus46.sh" start
    echo "$LOG_PREFIX Opus-4.6 engine: RESTARTED"
  fi
fi

# ── 3. Dev server ───────────────────────────────────────────────────────
if curl -s --connect-timeout 5 http://localhost:3003 > /dev/null 2>&1; then
  echo "$LOG_PREFIX Dev server: OK (http://localhost:3003)"
else
  echo "$LOG_PREFIX Dev server: DOWN — not auto-starting (manual intervention needed)"
fi

# ── 4. Queue health ─────────────────────────────────────────────────────
if [ -f "$SCRIPT_DIR/queue-index.json" ]; then
  PENDING=$(node -e "const q=require('./scripts/queue-index.json'); const p=q.tickets?.filter(t=>t.status==='pending')?.length || 0; console.log(p)" 2>/dev/null || echo "0")
  echo "$LOG_PREFIX Queue: $PENDING pending tickets"
  if [ "$PENDING" -lt 4 ]; then
    echo "$LOG_PREFIX Queue low — running autofill..."
    if [ -f "$SCRIPT_DIR/autofill-queue-from-gaps.mjs" ]; then
      node "$SCRIPT_DIR/autofill-queue-from-gaps.mjs" 2>&1 | tail -5
    fi
  fi
else
  echo "$LOG_PREFIX Queue index missing — rebuilding..."
  node "$SCRIPT_DIR/build-queue-index.mjs" 2>&1 | tail -3
fi

# ── 5. Queue index freshness ────────────────────────────────────────────
if [ -f "$SCRIPT_DIR/queue-index.json" ]; then
  node "$SCRIPT_DIR/build-queue-index.mjs" 2>&1 | tail -1
  echo "$LOG_PREFIX Queue index: rebuilt"
fi

# ── 6. Empirical-Λ floor guard (imp-877) ───────────────────────────────
# Load empirical-m-sweep-extended.js and check that both predicates still
# hold on the claimed range. If a violation appears, emit a sentinel file
# that downstream code can read.
EMPIRICAL_CHECK=$(node -e "
import('$PROJECT_DIR/src/data/empirical-m-sweep-extended.js').then(m => {
  const r = m.EMPIRICAL_M_SWEEP_EXTENDED;
  const e1 = r.empiricalPredicates.E1_rhoNonDecreasing.holds;
  const e2 = r.empiricalPredicates.E2_tauEstNonIncreasing.holds;
  console.log(JSON.stringify({ N_max: r.verifiedRange.N_max, E1: e1, E2: e2, ok: e1 && e2 }));
  process.exit((e1 && e2) ? 0 : 1);
}).catch(e => { console.log(JSON.stringify({ error: e.message, ok: false })); process.exit(2); });
" 2>/dev/null)
echo "$LOG_PREFIX Empirical-Λ floor: $EMPIRICAL_CHECK"
if echo "$EMPIRICAL_CHECK" | grep -q '"ok":true'; then
  rm -f "$SCRIPT_DIR/.empirical-floor-violation"
else
  echo "{\"at\":\"$LOG_PREFIX\",\"check\":$EMPIRICAL_CHECK}" > "$SCRIPT_DIR/.empirical-floor-violation"
  echo "$LOG_PREFIX WARNING: empirical-Λ floor check FAILED — sentinel written to .empirical-floor-violation"
fi

# ── 6b. Stale rate-limit sentinel sweep (imp-1017) ─────────────────────
# Each auto-improve*.sh writes a .rate-limit-backoff-state{,-haiku,-sonnet,-opus46}
# sentinel on a rate-limit hit and removes it on the next clean run. If the
# engine is killed mid-run while the sentinel exists, or if an external monitor
# treats the sentinel as a "do not start" gate, throughput degrades silently
# long after the originating throttle window has expired. Wipe any sentinel
# whose mtime is older than RATE_LIMIT_SENTINEL_MAX_AGE_HOURS (default 24h)
# so daily cron heals the staleness without operator intervention.
RATE_LIMIT_SENTINEL_MAX_AGE_HOURS="${RATE_LIMIT_SENTINEL_MAX_AGE_HOURS:-24}"
RATE_LIMIT_SENTINEL_MAX_AGE_MIN=$(( RATE_LIMIT_SENTINEL_MAX_AGE_HOURS * 60 ))
for sentinel in \
  "$SCRIPT_DIR/.rate-limit-backoff-state" \
  "$SCRIPT_DIR/.rate-limit-backoff-state-haiku" \
  "$SCRIPT_DIR/.rate-limit-backoff-state-sonnet" \
  "$SCRIPT_DIR/.rate-limit-backoff-state-opus46"; do
  if [ -f "$sentinel" ]; then
    stale=$(find "$sentinel" -mmin "+$RATE_LIMIT_SENTINEL_MAX_AGE_MIN" -print 2>/dev/null)
    if [ -n "$stale" ]; then
      rm -f "$sentinel"
      echo "$LOG_PREFIX Rate-limit sentinel: wiped stale $(basename "$sentinel") (>${RATE_LIMIT_SENTINEL_MAX_AGE_HOURS}h old)"
    else
      echo "$LOG_PREFIX Rate-limit sentinel: $(basename "$sentinel") present but fresh — leaving in place"
    fi
  fi
done

# ── 7. Git push ─────────────────────────────────────────────────────────
UNPUSHED=$(git log --oneline @{u}..HEAD 2>/dev/null | wc -l | tr -d ' ')
if [ "$UNPUSHED" -gt 0 ]; then
  echo "$LOG_PREFIX Git: $UNPUSHED unpushed commits — pushing..."
  git push 2>&1 | tail -3
  echo "$LOG_PREFIX Git: pushed"
else
  echo "$LOG_PREFIX Git: up to date with remote"
fi

echo "$LOG_PREFIX === DAILY HEALTH CHECK COMPLETE ==="
