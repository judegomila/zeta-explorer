#!/usr/bin/env bash
# imp-882: Commit-message linter.
#
# Enforces:
#   (1) every commit message contains at least one imp-NNN id
#   (2) for each imp-NNN referenced, the queue has that id
#
# Intended to be installed as .git/hooks/commit-msg:
#   ln -s ../../scripts/commit-lint.sh .git/hooks/commit-msg
#
# The hook receives the commit message file path as $1.
#
# Exit 0 = OK; non-zero = block commit.
#
# Skip via: git commit --no-verify (explicit bypass)

set -uo pipefail

# Resolve symlinks so installation at .git/hooks/commit-msg still finds the
# repo root (else dirname $0 would be .git/hooks/).
REAL_SCRIPT="$(cd "$(dirname "$0")" && pwd)/$(basename "$0")"
if [ -L "$REAL_SCRIPT" ]; then
  REAL_SCRIPT="$(readlink "$REAL_SCRIPT")"
  case "$REAL_SCRIPT" in
    /*) ;;  # absolute
    *)  REAL_SCRIPT="$(cd "$(dirname "$0")" && pwd)/$REAL_SCRIPT" ;;
  esac
fi
SCRIPT_DIR="$(cd "$(dirname "$REAL_SCRIPT")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
COMMIT_MSG_FILE="${1:-/dev/stdin}"

msg=$(cat "$COMMIT_MSG_FILE")

# Ignore merge/rebase/fixup commits
if echo "$msg" | head -1 | grep -qE "^(Merge|Revert|fixup!|squash!)"; then
  exit 0
fi

# Check (1): at least one imp-NNN id
imp_ids=$(echo "$msg" | grep -oE 'imp-[0-9]+' | sort -u)
if [ -z "$imp_ids" ]; then
  echo "commit-lint: FAIL — commit message must reference at least one imp-NNN ticket id."
  echo "             Add 'imp-XXX' somewhere in the message, or use --no-verify to bypass."
  exit 1
fi

# Check (2): every referenced id exists in the queue
QUEUE_FILE="$PROJECT_DIR/src/data/improvement-queue.js"
unknown_ids=""
for id in $imp_ids; do
  if ! grep -q "id: '$id'" "$QUEUE_FILE" 2>/dev/null; then
    unknown_ids="$unknown_ids $id"
  fi
done

if [ -n "$unknown_ids" ]; then
  echo "commit-lint: FAIL — the following imp ids are referenced but not in improvement-queue.js:"
  for id in $unknown_ids; do
    echo "  - $id"
  done
  echo "             Either seed the ticket first, fix the id, or use --no-verify to bypass."
  exit 1
fi

# Check (3): empirical-Λ floor sentinel must not exist (imp-877 / imp-833 guard).
# If daily-health-check.sh wrote .empirical-floor-violation, the empirical
# predicates no longer hold on the claimed range — any commit that might
# re-confirm the stale claim should be blocked. Commits that intend to
# ACKNOWLEDGE the violation are allowed through with --no-verify.
SENTINEL="$SCRIPT_DIR/.empirical-floor-violation"
if [ -f "$SENTINEL" ]; then
  echo "commit-lint: FAIL — empirical-Λ floor sentinel present at $SENTINEL"
  echo "             Contents:"
  head -5 "$SENTINEL" 2>/dev/null | sed 's/^/               /'
  echo "             The imp-833/imp-858 unconditional-floor claim may be stale."
  echo "             Fix the underlying drift, or commit with --no-verify to ACK."
  exit 1
fi

# All checks passed.
echo "commit-lint: OK — $(echo "$imp_ids" | tr '\n' ' ')"
exit 0
