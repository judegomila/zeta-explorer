#!/usr/bin/env bash
# daily-health-check.sh — Runs once daily to ensure all engines and services are healthy.
#
# Checks:
# 1. Opus engine running — restart if not
# 2. Haiku engine running — restart if not
# 3. Dev server alive — report if down
# 4. Queue not empty — run autofill if drained
# 5. Queue index fresh — rebuild if stale
# 6. Git push — push any unpushed commits
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

# ── 3. Dev server ───────────────────────────────────────────────────────
if curl -s --connect-timeout 5 http://localhost:3002 > /dev/null 2>&1; then
  echo "$LOG_PREFIX Dev server: OK (http://localhost:3002)"
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

# ── 6. Git push ─────────────────────────────────────────────────────────
UNPUSHED=$(git log --oneline @{u}..HEAD 2>/dev/null | wc -l | tr -d ' ')
if [ "$UNPUSHED" -gt 0 ]; then
  echo "$LOG_PREFIX Git: $UNPUSHED unpushed commits — pushing..."
  git push 2>&1 | tail -3
  echo "$LOG_PREFIX Git: pushed"
else
  echo "$LOG_PREFIX Git: up to date with remote"
fi

echo "$LOG_PREFIX === DAILY HEALTH CHECK COMPLETE ==="
