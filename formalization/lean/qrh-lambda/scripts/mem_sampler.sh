#!/bin/zsh
# Sample RSS (KB) of running Lean chunk processes every 5 s: "time pid rss_kb module".
cd ${0:A:h:h}
mkdir -p build-logs
while true; do
  ps -Ao pid=,rss=,args= | grep "[b]in/lean .*QrhLambda/Chunks/" | awk -v t="$(date +%T)" '{for(i=1;i<=NF;i++) if ($i ~ /Chunks\/.*\.lean$/) m=$i; print t, $1, $2, m}' >> build-logs/mem-samples.txt
  sleep 5
done
