#!/bin/zsh
# Build the per-chunk `decide +kernel` modules of one run (F2 or R78) in batches of at most B Lean
# processes (default 3), waiting while the 5-minute load average exceeds 45. Per-module wall times are
# in Lake's output; scripts/mem_sampler.sh records the resident memory of each running chunk process.
# usage: scripts/build_chunks.sh NAME [B]
cd ${0:A:h:h}
export PATH=$HOME/.elan/toolchains/leanprover--lean4---v4.34.1/bin:$PATH
NAME=$1; B=${2:-3}
N=$(ls QrhLambda/Chunks/${NAME}C*.lean | wc -l | tr -d ' ')
LOG=build-logs/${NAME}-chunks.log
mkdir -p build-logs
echo "$(date '+%F %T') start $NAME ($N chunks, batch $B)" >> $LOG
lake build QrhLambda.Data.$NAME >> $LOG 2>&1
i=0
while [ $i -lt $N ]; do
  while (( $(sysctl -n vm.loadavg | awk '{print int($3)}') > 45 )); do sleep 30; done
  T=""
  for j in $(seq $i $((i + B - 1))); do
    [ $j -lt $N ] && T="$T QrhLambda.Chunks.${NAME}C$(printf %02d $j)"
  done
  echo "$(date '+%F %T') batch$T (load $(sysctl -n vm.loadavg))" >> $LOG
  lake build ${=T} >> $LOG 2>&1
  echo "$(date '+%F %T') batch exit $?" >> $LOG
  i=$((i + B))
done
echo "$(date '+%F %T') done $NAME" >> $LOG
