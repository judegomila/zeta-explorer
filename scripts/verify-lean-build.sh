#!/usr/bin/env bash
# imp-1019: Manual verify gate for the Lean 4 proof tree.
#
# Runs `lake build` inside lean/ and fails (exit non-zero) on ANY Lean
# elaboration / type-check error in the LambdaAttack package. Captures
# stdout+stderr to lean/.lake-build.log so a CI consumer (or a human)
# can post-mortem the first failing module.
#
# Usage:
#   bash scripts/verify-lean-build.sh           # full lake build
#   bash scripts/verify-lean-build.sh --update  # lake update first (refresh manifest)
#   bash scripts/verify-lean-build.sh --quiet   # suppress per-module progress
#
# Exit codes:
#   0  = all LambdaAttack modules type-checked
#   1  = lake build failed (see lean/.lake-build.log for the first error)
#   2  = environment error (lake or lean missing, lean/ missing, etc.)
#
# NOTE: The first invocation downloads Mathlib (~1+ GB) via `lake update`
# and elaborates it; allow 10+ minutes. Subsequent invocations re-use the
# .lake/ cache and finish in seconds when nothing has changed.

set -uo pipefail

REAL_SCRIPT="$(cd "$(dirname "$0")" && pwd)/$(basename "$0")"
if [ -L "$REAL_SCRIPT" ]; then
  REAL_SCRIPT="$(readlink "$REAL_SCRIPT")"
  case "$REAL_SCRIPT" in
    /*) ;;
    *)  REAL_SCRIPT="$(cd "$(dirname "$0")" && pwd)/$REAL_SCRIPT" ;;
  esac
fi
SCRIPT_DIR="$(cd "$(dirname "$REAL_SCRIPT")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
LEAN_DIR="$PROJECT_DIR/lean"
LOG_FILE="$LEAN_DIR/.lake-build.log"

DO_UPDATE=0
QUIET=0
for arg in "$@"; do
  case "$arg" in
    --update) DO_UPDATE=1 ;;
    --quiet)  QUIET=1 ;;
    -h|--help)
      sed -n '1,25p' "$REAL_SCRIPT"
      exit 0
      ;;
    *) echo "verify-lean-build: unknown flag: $arg" >&2; exit 2 ;;
  esac
done

if [ ! -d "$LEAN_DIR" ]; then
  echo "verify-lean-build: lean/ directory not found at $LEAN_DIR" >&2
  exit 2
fi

if ! command -v lake >/dev/null 2>&1; then
  echo "verify-lean-build: \`lake\` not on PATH (install elan: https://leanprover-community.github.io/install)" >&2
  exit 2
fi
if ! command -v lean >/dev/null 2>&1; then
  echo "verify-lean-build: \`lean\` not on PATH (install elan: https://leanprover-community.github.io/install)" >&2
  exit 2
fi

cd "$LEAN_DIR"

# Sanity-check the manifest.
if [ ! -f "lakefile.lean" ]; then
  echo "verify-lean-build: lean/lakefile.lean missing" >&2
  exit 2
fi

if [ "$QUIET" -ne 1 ]; then
  echo "verify-lean-build: working directory: $LEAN_DIR"
  echo "verify-lean-build: lake version: $(lake --version 2>&1 | head -1)"
  echo "verify-lean-build: lean version: $(lean --version 2>&1 | head -1)"
fi

if [ "$DO_UPDATE" -eq 1 ]; then
  [ "$QUIET" -ne 1 ] && echo "verify-lean-build: running \`lake update\` ..."
  if ! lake update 2>&1 | tee "$LOG_FILE.update"; then
    echo "verify-lean-build: lake update FAILED (see $LOG_FILE.update)" >&2
    exit 1
  fi
fi

[ "$QUIET" -ne 1 ] && echo "verify-lean-build: running \`lake build\` (output to $LOG_FILE) ..."

# Capture combined stdout+stderr while also tee-ing live output. PIPESTATUS
# preserves the exit code of `lake build` rather than the trailing `tee`.
set +e
if [ "$QUIET" -eq 1 ]; then
  lake build > "$LOG_FILE" 2>&1
  RC=$?
else
  lake build 2>&1 | tee "$LOG_FILE"
  RC=${PIPESTATUS[0]}
fi
set -e

# Lake build returns non-zero on any elaboration / type-check error; surface
# that as the script's exit code so CI can gate on it directly.
if [ "$RC" -ne 0 ]; then
  echo "" >&2
  echo "verify-lean-build: lake build FAILED (exit $RC)" >&2
  echo "verify-lean-build: full log at $LOG_FILE" >&2
  echo "verify-lean-build: first error excerpt:" >&2
  # Lean elaboration errors are formatted as "<file>:<line>:<col>: error:".
  grep -n -m 5 -E "(error:|sorry|unknown identifier)" "$LOG_FILE" >&2 || true
  exit 1
fi

# Extra defense-in-depth: even on RC=0, scan the log for "error:" because some
# Lake versions surface elaboration errors as warnings during partial builds.
if grep -q -E "^.+:[0-9]+:[0-9]+: error:" "$LOG_FILE" 2>/dev/null; then
  echo "" >&2
  echo "verify-lean-build: lake build returned 0 but log contains \`error:\` lines:" >&2
  grep -n -m 5 -E "^.+:[0-9]+:[0-9]+: error:" "$LOG_FILE" >&2
  exit 1
fi

[ "$QUIET" -ne 1 ] && echo "verify-lean-build: OK -- LambdaAttack tree type-checks cleanly."
exit 0
