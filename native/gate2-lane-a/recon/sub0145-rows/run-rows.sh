#!/bin/zsh
# Sub-0.145 row sweep of the Gate-2 freeze-calculus evaluator (bounded compute).
# Rows: LABEL T_NUM T_DEN Y2_NUM Y2_DEN   (Lambda = t + y^2/2)
set -u
G=/Users/USER/Documents/GitHub/mathexplorer/native/gate2-lane-a/gate2
OUT=/Users/USER/Documents/GitHub/mathexplorer/tmp/gate2-sub0145
mkdir -p "$OUT"
ROWS=(
  "row0140  24727519 200000000 3272481 100000000"
  "row01399 10103 80000 1089 40000"
  "row0130  23 200 3 100"
  "row0120  21 200 3 100"
  "row0100  17 200 3 100"
  "row0130y 1 10 3 50"
)
for R in "${ROWS[@]}"; do
  set -- ${=R}
  L=$1; TN=$2; TD=$3; YN=$4; YD=$5
  export GATE2_T_NUM=$TN GATE2_T_DEN=$TD GATE2_Y2_NUM=$YN GATE2_Y2_DEN=$YD
  echo "=== $L t=$TN/$TD y2=$YN/$YD  $(date +%T)"
  nice -n 5 $G pilotg3 20001 6 "$OUT/$L-pilotg3.json" 2> "$OUT/$L-pilotg3.log"
  tail -2 "$OUT/$L-pilotg3.log"
  nice -n 5 $G sweep 3840000 120 1 > "$OUT/$L-sweep-3840000.txt" 2>&1
  tail -1 "$OUT/$L-sweep-3840000.txt"
  nice -n 5 $G sweep 20000000 48 1 > "$OUT/$L-sweep-20000000.txt" 2>&1
  tail -1 "$OUT/$L-sweep-20000000.txt"
  nice -n 5 $G point 0.971652004 0 54799999 > "$OUT/$L-point-54799999.json" 2>&1
  nice -n 5 $G point 0.634587201 0 9465530 > "$OUT/$L-point-9465530.json" 2>&1
  echo "--- $L done $(date +%T)"
done
echo ALLDONE
