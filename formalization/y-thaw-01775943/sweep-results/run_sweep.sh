#!/bin/zsh
# y-thaw-01775943 stage-2 sharp-weight sweep driver
# Producer: lemma_sweep_sharp (plain compile of lemma_sweep_p235711.c, WEIGHT SHARP)
# Row params: TBOX 161250000/1e9..161250001/1e9, y^2 = 12769/390625 (y = 0.1808)
# prec 256, K = 8, hw = 1e-3, mode t (amortized frozen sawtooth), stride 1
# STRICT FAIL-CLOSED: any UNCERT row or L12 = 0.000000000000 or nonzero exit
# or row-count mismatch -> record row, touch ABORT, stop launching shards.
set -u
BASE=/tmp/ythaw-01775943
BIN=$BASE/lemma_sweep_sharp
OUT=$BASE/sweep
mkdir -p $OUT
rm -f $OUT/ABORT

TARGS=(161250000 161250001 1000000000 12769 390625)
PREC=256; K=8; HW=1e-3

# shard table: name Nstart Nend mtype  (family boundaries = sealed shard map)
SHARDS=(
"p235711_690988_690995 690988 690995 6"
"p235711_690996_691500 690996 691500 6"
"p235711_691501_697000 691501 697000 6"
"p235711_697001_728999 697001 728999 6"
"p2357_729000_773999 729000 773999 5"
"p2357_774000_818999 774000 818999 5"
"p235_819000_888999 819000 888999 4"
"p235_889000_958999 889000 958999 4"
"p235_959000_1027999 959000 1027999 4"
"p23_1028000_1189999 1028000 1189999 3"
"p23_1190000_1349999 1190000 1349999 3"
"p23_1350000_1509999 1350000 1509999 3"
"p23_1510000_1669999 1510000 1669999 3"
"p23_1670000_1829999 1670000 1829999 3"
"p23_1830000_1989999 1830000 1989999 3"
"p23_1990000_2149999 1990000 2149999 3"
"p23_2150000_2309999 2150000 2309999 3"
"p23_2310000_2469999 2310000 2469999 3"
"p23_2470000_2629999 2470000 2629999 3"
"p23_2630000_2789999 2630000 2789999 3"
"p23_2790000_2949999 2790000 2949999 3"
"p23_2950000_3109999 2950000 3109999 3"
"p23_3110000_3269999 3110000 3269999 3"
"p23_3270000_3429999 3270000 3429999 3"
"p23_3430000_3589999 3430000 3589999 3"
"p23_3590000_3749999 3590000 3749999 3"
"p23_3750000_3840000 3750000 3840000 3"
)

run_shard() {
  local name=$1 ns=$2 ne=$3 mt=$4
  local log=$OUT/$name.log
  local t0=$(date +%s)
  nice -n 15 $BIN $ns $ne ${TARGS[@]} $mt $PREC $K $HW t > $log 2> $OUT/$name.err
  local rc=$?
  local t1=$(date +%s)
  local expect=$((ne - ns + 1))
  local nrows=$(grep -c '^N ' $log)
  local bad=$(grep -m1 -n 'UNCERT\|L12 0\.000000000000' $log)
  if [[ $rc -ne 0 || -n "$bad" || $nrows -ne $expect ]]; then
    { echo "SHARD $name FAIL rc=$rc rows=$nrows/$expect bad=${bad:-none}"; } >> $OUT/ABORT
    echo "FAIL $name rc=$rc rows=$nrows/$expect bad=${bad:-none} wall=$((t1-t0))s" >> $OUT/status.log
    return 1
  fi
  # per-shard minimum (L12 column, string-sortable fixed-width 0.xxxxxxxxxxxx)
  local minline=$(awk '$1=="N"{if(min==""||$4<min){min=$4;at=$2}}END{print min" at N="at}' $log)
  echo "$name rows=$nrows min_L12=$minline wall=$((t1-t0))s" >> $OUT/minima.txt
  echo "OK $name min=$minline wall=$((t1-t0))s" >> $OUT/status.log
  gzip -f $log
}

# 12-slot pool
typeset -a pids; pids=()
for spec in "${SHARDS[@]}"; do
  [[ -f $OUT/ABORT ]] && break
  while (( ${#pids[@]} >= 12 )); do
    typeset -a alive; alive=()
    for p in "${pids[@]}"; do kill -0 $p 2>/dev/null && alive+=($p); done
    pids=("${alive[@]}")
    (( ${#pids[@]} >= 12 )) && sleep 5
  done
  parts=(${=spec})
  run_shard ${parts[1]} ${parts[2]} ${parts[3]} ${parts[4]} &
  pids+=($!)
done
wait
if [[ -f $OUT/ABORT ]]; then
  echo "SWEEP ABORTED (fail-closed)"; cat $OUT/ABORT; exit 1
fi
echo "SWEEP COMPLETE"
sort -t= -k2 $OUT/minima.txt | head -5
exit 0
