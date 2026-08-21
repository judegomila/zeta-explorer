#!/bin/bash
# scripts/deploy-health-gate.sh
#
# Browser-based pre-deploy health gate. Builds a given git ref in a THROWAWAY
# worktree, serves the built dist, and runs check-page-health.mjs (real headless
# Chromium) against every route. Exits 0 only if every route is clean.
#
# WHY THIS EXISTS: the Vercel build runs `npm run build` = audit-nav-links +
# check-bundle-sizes + vite build — all NODE-only. It cannot catch browser-only
# failures: a self-executing data-module assertion that throws only under browser
# V8 (flat-peak / sub-noise-floor float divergence) blanks its lazy page via
# React.lazy "default of undefined", and node's run-assertions.mjs is blind to it.
# Only a real browser catches this class. This gate is that browser check, run
# before the production deploy hook fires (see deploy-hook-publisher.sh).
#
# It builds the ref in an ISOLATED worktree (never touches the live working tree,
# which the autonomous fleet is actively editing) with node_modules symlinked from
# the main checkout so no npm install is needed.
#
# USAGE:
#   scripts/deploy-health-gate.sh [<git-ref>]     # default: origin/main
# EXIT CODES:
#   0 — ref built and every route is browser-clean (safe to deploy)
#   1 — one or more routes failed in the browser (do NOT deploy)
#   2 — the gate itself failed (build error, server never came up, etc.)

set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
REF="${1:-origin/main}"
PORT="${GATE_PORT:-3021}"
LOG_DIR="$SCRIPT_DIR/logs"
mkdir -p "$LOG_DIR"

iso() { date -u +%FT%TZ; }
log() { echo "[$(iso)] [health-gate] $*"; }

cd "$PROJECT_DIR" || { log "cannot cd to project dir"; exit 2; }

# Resolve the ref to a concrete SHA so the worktree is deterministic.
SHA="$(git rev-parse "$REF" 2>/dev/null)"
if [ -z "$SHA" ]; then log "cannot resolve ref '$REF'"; exit 2; fi
SHORT="${SHA:0:8}"
WORKTREE="$(mktemp -d "${TMPDIR:-/tmp}/deploy-gate-${SHORT}.XXXXXX")"
SERVER_PID=""

cleanup() {
  [ -n "$SERVER_PID" ] && kill "$SERVER_PID" 2>/dev/null
  # Remove the worktree registration + directory.
  git worktree remove --force "$WORKTREE" 2>/dev/null || rm -rf "$WORKTREE"
  git worktree prune 2>/dev/null || true
}
trap cleanup EXIT

log "gating ref '$REF' -> $SHORT in isolated worktree $WORKTREE (port $PORT)"

# 1) Isolated worktree at the exact SHA (detached; never disturbs the live tree).
if ! git worktree add --detach "$WORKTREE" "$SHA" >/dev/null 2>&1; then
  log "git worktree add failed"; exit 2
fi

# 2) Share deps + playwright from the main checkout (no npm install).
if [ -d "$PROJECT_DIR/node_modules" ]; then
  ln -s "$PROJECT_DIR/node_modules" "$WORKTREE/node_modules"
else
  log "no node_modules in main checkout to symlink"; exit 2
fi

# 3) Build the ref.
log "building $SHORT ..."
if ! ( cd "$WORKTREE" && npm run build ) > "$LOG_DIR/health-gate-build-$SHORT.log" 2>&1; then
  log "BUILD FAILED for $SHORT (see logs/health-gate-build-$SHORT.log) — blocking deploy"
  exit 2
fi

# 4) Serve the built dist on an isolated port.
( cd "$WORKTREE" && PORT="$PORT" node server.js ) > "$LOG_DIR/health-gate-server-$SHORT.log" 2>&1 &
SERVER_PID=$!

# Wait for the server to answer (up to ~20s).
up=0
for _ in $(seq 1 40); do
  code="$(curl -s -o /dev/null -w '%{http_code}' "http://localhost:$PORT/" 2>/dev/null || echo 000)"
  if [ "$code" = "200" ]; then up=1; break; fi
  sleep 0.5
done
if [ "$up" != "1" ]; then log "server never came up on port $PORT — blocking deploy"; exit 2; fi

# 5) Run the browser health check (the worktree's own copy, so routes match the SHA).
# GATE_HEALTH_ARGS lets an operator scope the scan (e.g. "--route /foo") for a fast
# smoke test; production leaves it empty for the full every-route sweep.
log "running check-page-health against localhost:$PORT ${GATE_HEALTH_ARGS:-}..."
# shellcheck disable=SC2086
( cd "$WORKTREE" && node scripts/check-page-health.mjs --base "http://localhost:$PORT" ${GATE_HEALTH_ARGS:-} ) \
  > "$LOG_DIR/health-gate-scan-$SHORT.log" 2>&1
RESULT=$?

tail -1 "$LOG_DIR/health-gate-scan-$SHORT.log" 2>/dev/null | sed 's/^/[health-gate] scan: /'
if [ "$RESULT" -eq 0 ]; then
  log "PASS — $SHORT is browser-clean, safe to deploy"
  exit 0
else
  log "FAIL — $SHORT has broken routes (see logs/health-gate-scan-$SHORT.log) — blocking deploy"
  exit 1
fi
