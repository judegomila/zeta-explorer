#!/usr/bin/env bash
# Stage the assembly gate, the audit module and the 16 pinned gate inputs into a standalone tree
# DEST/{scripts,src/data,tmp} with the repo-relative layout the gate expects, then (optionally) run
# the gate from that tree. Uses APFS clones (cp -c) where available, plain copies otherwise.
# Usage: tools/stage_gate_inputs.sh DEST [--run]      (DEST must not exist; ~220 MB, mostly the leg-D lane log)
set -euo pipefail
HERE=$(cd "$(dirname "$0")" && pwd -P)
REPO=${REPO:-$(cd "$HERE/../../.." && pwd -P)}
DEST=${1:?usage: stage_gate_inputs.sh DEST [--run]}
[ -e "$DEST" ] && { echo "refusing: $DEST exists" >&2; exit 2; }
GATE="$REPO/scripts/lambda-01758354-gate.mjs"
FILES=(scripts/lambda-01758354-gate.mjs)
while IFS= read -r f; do FILES+=("$f"); done < <(sed -nE "s/^  [A-Za-z0-9]+: \['([^']+)', '[0-9a-f]{64}'\],$/\1/p" "$GATE")
[ "${#FILES[@]}" -eq 17 ] || { echo "expected 16 pinned inputs, parsed $((${#FILES[@]}-1))" >&2; exit 2; }
for f in "${FILES[@]}"; do
  mkdir -p "$DEST/$(dirname "$f")"
  cp -c "$REPO/$f" "$DEST/$f" 2>/dev/null || cp "$REPO/$f" "$DEST/$f"
done
echo "staged ${#FILES[@]} files into $DEST"
if [ "${2:-}" = "--run" ]; then
  ( cd "$DEST" && node scripts/lambda-01758354-gate.mjs --verbose --rerun-tail )
fi
