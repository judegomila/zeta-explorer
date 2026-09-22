#!/bin/bash
# imp-95209 resume driver: idempotent continuation of run-sharded.sh after an
# external kill. Cleans stale claims, runs 3 recorder workers + auditors
# (auditors scale up to 4 total threads as workers finish), then aggregates
# and checks bit-identity against the baked production literals.
set -u
DIR=/tmp/imp-95209-shards
SRC=/Users/USER/Documents/GitHub/mathexplorer/scripts/imp-95209-vx-worst-cell-interval-audit
NSHARD=24

# clean stale claims (claimed but not completed)
for s in $(seq 0 $((NSHARD-1))); do
  [ -d "$DIR/claim-$s" ]  && [ ! -f "$DIR/rec-$s.done" ]   && rmdir "$DIR/claim-$s"
  [ -d "$DIR/aclaim-$s" ] && [ ! -f "$DIR/audit-$s.done" ] && rmdir "$DIR/aclaim-$s"
done

worker() {
  local w=$1
  for s in $(seq 0 $((NSHARD-1))); do
    if [ ! -f "$DIR/rec-$s.done" ] && mkdir "$DIR/claim-$s" 2>/dev/null; then
      echo "[worker $w] shard $s start $(date +%T)"
      STACK_IN="$DIR/shard-$s.jsonl" RECORD_OUT="$DIR/rec-$s.jsonl" RECORD_TOPK=64 \
        node "$SRC/rerun-record-worst.mjs" 1 0.235 9e8 1 0 > "$DIR/wlog-$s.json" 2>&1
      touch "$DIR/rec-$s.done"
      echo "[worker $w] shard $s done $(date +%T): $(tail -1 "$DIR/wlog-$s.json")"
    fi
  done
}
auditor() {
  local a=$1
  while :; do
    local advanced=0 alldone=1
    for s in $(seq 0 $((NSHARD-1))); do
      if [ -f "$DIR/rec-$s.done" ] && [ ! -f "$DIR/audit-$s.done" ]; then
        if mkdir "$DIR/aclaim-$s" 2>/dev/null; then
          "$SRC/audit_cells_arb" 128 "$DIR/rec-$s.jsonl" > "$DIR/audit-$s.txt" 2> "$DIR/audit-$s.err"
          touch "$DIR/audit-$s.done"
          echo "[auditor $a] shard $s: $(tail -1 "$DIR/audit-$s.txt")"
          advanced=1
        fi
      fi
      [ -f "$DIR/rec-$s.done" ] && [ -f "$DIR/audit-$s.done" ] || alldone=0
    done
    if [ "$alldone" = 1 ]; then
      local recdone=1
      for s in $(seq 0 $((NSHARD-1))); do [ -f "$DIR/rec-$s.done" ] || recdone=0; done
      [ "$recdone" = 1 ] && break
    fi
    [ "$advanced" = 0 ] && sleep 20
  done
}

worker 1 & W1=$!
worker 2 & W2=$!
worker 3 & W3=$!
auditor 1 & A1=$!
wait $W1 $W2 $W3
echo "ALL WORKERS DONE $(date +%T)"
# workers freed: bring auditing to 4 threads
auditor 2 & A2=$!
auditor 3 & A3=$!
auditor 4 & A4=$!
wait $A1 $A2 $A3 $A4
echo "AUDITOR DONE $(date +%T)"

node "$SRC/summarize-results.mjs" > "$DIR/final-summary.json" 2> "$DIR/final-summary.err"
echo "DRIVER COMPLETE $(date +%T)"
