#!/usr/bin/env bash
# Check every entry of ../MANIFEST.sha256 (sha256 and byte count). Roots are taken from the
# environment (REPO, PKG, BASE, SWEEP); defaults are the paths on the preparing machine.
# Exit 0 = all present and matching; 1 = at least one mismatch; 2 = at least one file missing.
set -uo pipefail
HERE=$(cd "$(dirname "$0")" && pwd -P)
MAN="$HERE/../MANIFEST.sha256"
REPO=${REPO:-$(cd "$HERE/../../.." && pwd -P)}
PKG=${PKG:-$HOME/dbn-lambda-01758354-candidate}
BASE=${BASE:-$HOME/Documents/GitHub/dbn-lambda-01787854-candidate-audit}
SWEEP=${SWEEP:-$HOME/dbn-lambda-sweep-clean}
ok=0; bad=0; miss=0
while read -r want bytes path; do
  case "$want" in ''|'#'*) continue ;; esac
  root=${path%%/*}; rel=${path#*/}
  case "$root" in REPO) abs="$REPO/$rel" ;; PKG) abs="$PKG/$rel" ;; BASE) abs="$BASE/$rel" ;; SWEEP) abs="$SWEEP/$rel" ;; *) echo "BADROOT $path"; bad=$((bad+1)); continue ;; esac
  if [ ! -f "$abs" ]; then echo "MISSING  $path"; miss=$((miss+1)); continue; fi
  have=$(shasum -a 256 "$abs" | cut -d' ' -f1); size=$(wc -c < "$abs" | tr -d ' ')
  if [ "$have" = "$want" ] && [ "$size" = "$bytes" ]; then ok=$((ok+1)); else echo "MISMATCH $path (have $have $size)"; bad=$((bad+1)); fi
done < <(grep -v '^##' "$MAN")
echo "verify_manifest: $ok OK, $bad mismatch, $miss missing"
[ "$miss" -gt 0 ] && exit 2; [ "$bad" -gt 0 ] && exit 1; exit 0
