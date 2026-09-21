#!/bin/bash
# imp-95216 — FULL WINDOW-1 CERTIFICATION driver (user-authorized local run)
#
# Crash-resumable shard scheme over the closed window u in [0, 2N+1] =
# [0, 1381977], both seam charts, both targets (pilot Sigma|D_j| and
# |E97|), 128-bit balls, fail-closed (tier_cert2 tiercert2 mode,
# validated in imp-95213/95214).
#
# 50 contiguous u-shards; shard boundaries are computed by the SAME awk
# expression for shard i's hi and shard i+1's lo, and each tiercert2 run
# certifies CLOSED cells on [lo, hi], so the union covers the closed
# window. One output JSON per shard; a shard is done only when its JSON
# says "certifiedSubRange": true. Registry = marker files; rerunning
# this script resumes after any interruption by construction.
#
# Semantics:
#   shard-NN.done            certified (certifiedSubRange true)
#   shard-NN.FAILED          fail-closed cells recorded -> STOP EVERYTHING
#                            (a discovery, not an error)
#   CRASH-shard-NN           3 consecutive nonzero-exit/malformed runs
#   ALL_DONE                 50/50 certified
#
# NO Lambda promotion; NO QED. G3/G5 semantics per the README.
set -u
DIR="/Users/USER/Documents/GitHub/mathexplorer/native/gate2-interval"
RUN="$DIR/w1cert-95216"
REG="$RUN/registry"
BIN="$DIR/tier_cert2"
SHARDS=50
UMAX=1381977          # 2N+1, N = 690988
THREADS=14            # user-authorized; binary clamps at 14
mkdir -p "$RUN/shards" "$RUN/logs" "$REG"
echo "driver start $(date) pid $$" >> "$RUN/driver.log"

bnd() { awk -v i="$1" -v n="$SHARDS" -v m="$UMAX" 'BEGIN{printf "%.17g", i*m/n}'; }

for i in $(seq 0 $((SHARDS-1))); do
  id=$(printf "%02d" "$i")
  [ -f "$REG/shard-$id.done" ] && continue
  if [ -f "$REG/HALT" ]; then
    echo "HALT marker present, exiting $(date)" >> "$RUN/driver.log"
    exit 3
  fi
  lo=$(bnd "$i"); hi=$(bnd $((i+1)))
  out="$RUN/shards/shard-$id.json"
  log="$RUN/logs/shard-$id.log"
  attempt=0; ok=0
  while [ "$attempt" -lt 3 ]; do
    attempt=$((attempt+1))
    echo "shard $id u=[$lo,$hi] attempt $attempt start $(date)" >> "$RUN/driver.log"
    nice -n 10 "$BIN" tiercert2 --u-lo "$lo" --u-hi "$hi" \
      --side both --metric both --threads "$THREADS" --prec 128 \
      --degree 80 --bins 64 --edeg 33 --out "$out.tmp" >> "$log" 2>&1
    rc=$?
    if [ "$rc" -eq 0 ] && grep -q '"certifiedSubRange": true' "$out.tmp"; then
      mv "$out.tmp" "$out"
      : > "$REG/shard-$id.done"
      echo "shard $id CERTIFIED $(date)" >> "$RUN/driver.log"
      ok=1; break
    fi
    if [ "$rc" -eq 0 ] && grep -q '"certifiedSubRange": false' "$out.tmp"; then
      # fail-closed cells recorded: DISCOVERY, stop everything
      mv "$out.tmp" "$out"
      {
        echo "shard $id u=[$lo,$hi] FAILED TO CERTIFY (fail-closed cells recorded)"
        grep -E '"failPilot"|"failE97"|"unprocessedPanels"|"uncertifiedCells"' "$out"
      } > "$REG/shard-$id.FAILED"
      echo "shard $id FAILED-TO-CERTIFY, driver stopping $(date)" >> "$RUN/driver.log"
      exit 2
    fi
    echo "shard $id crash rc=$rc attempt $attempt $(date)" >> "$RUN/driver.log"
    sleep 30
  done
  if [ "$ok" -ne 1 ]; then
    : > "$REG/CRASH-shard-$id"
    echo "shard $id crashed 3x, driver aborting $(date)" >> "$RUN/driver.log"
    exit 4
  fi
done
: > "$REG/ALL_DONE"
echo "driver complete 50/50 $(date)" >> "$RUN/driver.log"
exit 0
