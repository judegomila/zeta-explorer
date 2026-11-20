#!/bin/bash
# scripts/engine-push.sh — the one way engine work leaves this machine.
#
#   scripts/engine-push.sh            push local commits to origin engine/work
#   ENGINE_PUSH_DISABLED=1 ...        run every check, push nothing (dry run)
#   touch scripts/.engine-push-disabled   the same, for every pusher in this clone
#                                     (launchd-started daemons included); rm to re-enable
#
# Engines never push to main: main deploys to production. They push to the
# engine branch (ENGINE_BRANCH, default engine/work); a person promotes that
# branch to main through a pull request (scripts/promote-engine-work.sh).
#
# Checks before the push: scripts/engine-preflight.sh; the tracked-imports
# guard (a committed file must not import an uncommitted one); the range
# check of scripts/engine-guard.mjs over every commit to be pushed. The
# pre-push git hook repeats the range check and runs gitleaks.
#
# Exit: 0 pushed / nothing to push / dry run, 3 rejected by a check,
#       4 preflight refused, 5 deferred by the tracked-imports guard, 6 push failed.
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(dirname "$SCRIPT_DIR")"
cd "$ROOT" || exit 3
# shellcheck disable=SC1091
. "$SCRIPT_DIR/engine-preflight.sh"
engine_preflight || exit 4
[ -f "$SCRIPT_DIR/.engine-push-disabled" ] && ENGINE_PUSH_DISABLED=1

if [ "${ENGINE_PUSH_DISABLED:-0}" != "1" ]; then
  git fetch --quiet "$ENGINE_REMOTE" "$ENGINE_BRANCH" 2>/dev/null || true
fi

if git rev-parse --verify --quiet "refs/remotes/$ENGINE_REMOTE/$ENGINE_BRANCH" >/dev/null; then
  base="$(git rev-parse "refs/remotes/$ENGINE_REMOTE/$ENGINE_BRANCH")"
else
  base="$(git merge-base HEAD "refs/remotes/$ENGINE_REMOTE/main" 2>/dev/null || true)"
fi
[ -n "$base" ] || { echo "engine-push: no base found (fetch $ENGINE_REMOTE main first)" >&2; exit 3; }

count="$(git rev-list --count "$base..HEAD" 2>/dev/null || echo 0)"
if [ "${count:-0}" -eq 0 ]; then echo "engine-push: nothing to push"; exit 0; fi

if ! git merge-base --is-ancestor "$base" HEAD; then
  echo "engine-push: local $ENGINE_BRANCH has diverged from $ENGINE_REMOTE/$ENGINE_BRANCH; not pushing (engines never force-push)" >&2
  exit 6
fi

if ! node "$SCRIPT_DIR/prepush-tracked-imports-guard.mjs" >/dev/null; then
  echo "engine-push: DEFERRED, tracked-imports guard failed (a committed file imports an uncommitted one)" >&2
  exit 5
fi

if ! node "$SCRIPT_DIR/engine-guard.mjs" range "$base" HEAD --mode engine; then
  echo "engine-push: REJECTED, $count local commit(s) not pushed. See ENGINE_RUNBOOK (recovering from a rejected range)." >&2
  exit 3
fi

if [ "${ENGINE_PUSH_DISABLED:-0}" = "1" ]; then
  echo "engine-push: PUSH DISABLED (ENGINE_PUSH_DISABLED=1): would push $count commit(s) to $ENGINE_REMOTE $ENGINE_BRANCH"
  exit 0
fi

if git push "$ENGINE_REMOTE" "HEAD:refs/heads/$ENGINE_BRANCH"; then
  echo "engine-push: pushed $count commit(s) to $ENGINE_REMOTE $ENGINE_BRANCH"
else
  echo "engine-push: push failed" >&2; exit 6
fi
