#!/bin/zsh
# Re-elaborate selected chunk files one at a time (no .olean output) and record user CPU time and
# maximum resident memory of the Lean process: build-logs/chunk-timing.txt
cd ${0:A:h:h}
export PATH=$HOME/.elan/toolchains/leanprover--lean4---v4.34.1/bin:$PATH
for c in "$@"; do
  while (( $(sysctl -n vm.loadavg | awk '{print int($3)}') > 45 )); do sleep 30; done
  /usr/bin/time -l lake env lean QrhLambda/Chunks/$c.lean > /tmp/qrh-lambda-time-$c.out 2> /tmp/qrh-lambda-time-$c.err
  ec=$?
  u=$(grep -E " user" /tmp/qrh-lambda-time-$c.err | awk '{print $3}')
  r=$(grep -E "real" /tmp/qrh-lambda-time-$c.err | awk '{print $1}')
  m=$(grep -E "maximum resident" /tmp/qrh-lambda-time-$c.err | awk '{print $1}')
  echo "$(date '+%F %T') $c exit=$ec real_s=$r user_s=$u maxrss_bytes=$m load=$(sysctl -n vm.loadavg)" >> build-logs/chunk-timing.txt
done
