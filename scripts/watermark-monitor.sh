#!/bin/bash
# Watermark monitor: searches public GitHub code for the zetaexplorer canary
# GUID and for load-bearing unique literals. Any hit outside
# judegomila/mathexplorer indicates reuse of this project's material.
CANARY=$(grep -o "zx-[a-f0-9-]*" src/data/provenance-canary.js | head -1)
echo "== canary: $CANARY =="
gh search code "$CANARY" --json repository -q '.[].repository.nameWithOwner' 2>/dev/null | grep -v "judegomila/mathexplorer"
echo "== unique literals =="
for lit in "0.2141254901198318" "0.2320723" "frozen-rung" "DEAD-END-FORNOW"; do
  hits=$(gh search code "$lit" --json repository -q '.[].repository.nameWithOwner' 2>/dev/null | grep -v "judegomila" | sort -u | head -5)
  [ -n "$hits" ] && echo "$lit -> $hits"
done
echo "(no output above = no external reuse detected)"
