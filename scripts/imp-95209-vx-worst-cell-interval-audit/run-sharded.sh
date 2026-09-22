#!/bin/bash
# imp-95209 sharded exact-tree re-run + incremental Arb audit driver.
# 3 recorder workers (dynamic mkdir-claim over 24 round-robin shards of the
# depth-26 frontier) + 1 incremental Arb auditor = 4 threads total.
set -u
DIR=/tmp/imp-95209-shards
SRC=/Users/USER/Documents/GitHub/mathexplorer/scripts/imp-95209-vx-worst-cell-interval-audit
NSHARD=24
mkdir -p "$DIR"

# 1. split frontier round-robin into NSHARD files
node -e '
const fs=require("fs");
const L=fs.readFileSync("/tmp/imp-95209-frontier.jsonl","utf8").trim().split("\n");
const N='"$NSHARD"';
const sh=Array.from({length:N},()=>[]);
L.forEach((l,i)=>sh[i%N].push(l));
sh.forEach((s,i)=>fs.writeFileSync(`'"$DIR"'/shard-${i}.jsonl`, s.join("\n")+"\n"));
console.log("shards written:", sh.map(s=>s.length).join(","));
'

worker() {
  local w=$1
  for s in $(seq 0 $((NSHARD-1))); do
    if mkdir "$DIR/claim-$s" 2>/dev/null; then
      echo "[worker $w] shard $s start $(date +%T)"
      STACK_IN="$DIR/shard-$s.jsonl" \
      RECORD_OUT="$DIR/rec-$s.jsonl" \
      RECORD_TOPK=64 \
        node "$SRC/rerun-record-worst.mjs" 1 0.235 9e8 1 0 \
        > "$DIR/wlog-$s.json" 2>&1
      touch "$DIR/rec-$s.done"
      echo "[worker $w] shard $s done $(date +%T): $(tail -1 "$DIR/wlog-$s.json")"
    fi
  done
}

auditor() {
  while :; do
    local advanced=0 alldone=1
    for s in $(seq 0 $((NSHARD-1))); do
      if [ -f "$DIR/rec-$s.done" ] && [ ! -f "$DIR/audit-$s.done" ]; then
        if mkdir "$DIR/aclaim-$s" 2>/dev/null; then
          "$SRC/audit_cells_arb" 128 "$DIR/rec-$s.jsonl" \
            > "$DIR/audit-$s.txt" 2> "$DIR/audit-$s.err"
          touch "$DIR/audit-$s.done"
          echo "[auditor] shard $s: $(tail -1 "$DIR/audit-$s.txt")"
          advanced=1
        fi
      fi
      [ -f "$DIR/audit-$s.done" ] || alldone=0
    done
    [ "$alldone" = 1 ] && break
    [ "$advanced" = 0 ] && sleep 15
  done
}

worker 1 & W1=$!
worker 2 & W2=$!
worker 3 & W3=$!
auditor & A=$!
wait $W1 $W2 $W3
echo "ALL WORKERS DONE $(date +%T)"
wait $A
echo "AUDITOR DONE $(date +%T)"

# 2. aggregate worker JSON and compare against baked production literals
node -e '
const fs=require("fs");
const N='"$NSHARD"';
let cells=4366, pruned=1729, unresolved=0, worst=0.9999951864449839, maxDepth=25; // frontier main pass
let recCount=0; const histo=new Array(16).fill(0); let topK=[];
for(let s=0;s<N;s++){
  const log=fs.readFileSync(`'"$DIR"'/wlog-${s}.json`,"utf8").trim().split("\n");
  const j=JSON.parse(log[log.length-1]);
  cells+=j.cells; pruned+=j.pruned; unresolved+=j.unresolved;
  if(j.worst>worst)worst=j.worst;
  if(j.maxDepth>maxDepth)maxDepth=j.maxDepth;
  const tk=JSON.parse(fs.readFileSync(`'"$DIR"'/rec-${s}-topk.json`,"utf8"));
  recCount+=tk.recCount;
  tk.histoDecades.forEach((v,i)=>histo[i]+=v);
  topK.push(...tk.topK);
}
// main-pass topk
try{
  const tk=JSON.parse(fs.readFileSync("/tmp/imp-95209-worst-rec-main-topk.json","utf8"));
  recCount+=tk.recCount; tk.histoDecades.forEach((v,i)=>histo[i]+=v); topK.push(...tk.topK);
}catch(e){}
topK.sort((a,b)=>b.bound-a.bound); topK=topK.slice(0,64);
const agg={cells,pruned,unresolved,worst,maxDepth,recCount,histoDecades:histo};
fs.writeFileSync(`'"$DIR"'/aggregate.json`, JSON.stringify({...agg, topK}, null, 1));
const BAKED={cells:871931041, worst:0.9999999999983423, maxDepth:81, unresolved:0, pruned:2150982};
const match = agg.cells===BAKED.cells && agg.worst===BAKED.worst && agg.maxDepth===BAKED.maxDepth
  && agg.unresolved===BAKED.unresolved && agg.pruned===BAKED.pruned;
console.log("AGGREGATE:", JSON.stringify(agg));
console.log("BIT-IDENTITY vs baked production literals:", match ? "MATCH" : "MISMATCH!!");
'
# 3. audit summary across shards
grep -h "^SUMMARY" "$DIR"/audit-*.txt
echo "DRIVER COMPLETE $(date +%T)"
