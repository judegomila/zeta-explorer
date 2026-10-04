#!/bin/sh
# b145-D campaign job driver (prototype; local only, launches nothing remote).
# One job = one height interval [S, E]. Idempotent and restartable:
#   - fresh start: begins OVERLAP units below S with n = auto (smooth N0); the
#     library certifies the true index of the first returned zero;
#   - restart: resumes from the last OK checkpoint line (t_last_hi, n_last + 1).
# Exit codes: 0 done, 2 escalation (4 retries failed at one point), other = crash.
# usage: run_job.sh <job_id> <S> <E> <outdir> [prec]
set -eu
JOB=$1; S=$2; E=$3; OUT=$4; PREC=${5:-128}
OVERLAP=50
BIN=$(dirname "$0")/chain
LOG="$OUT/job_$JOB.jsonl"
mkdir -p "$OUT"
if [ -s "$LOG" ] && grep -q '"OK"' "$LOG"; then
  LAST=$(grep '"OK"' "$LOG" | tail -1)
  TH=$(printf '%s' "$LAST" | sed 's/.*"t_last_hi":"\([0-9]*\)\..*/\1/')
  NL=$(printf '%s' "$LAST" | sed 's/.*"n_last":"\([0-9]*\)".*/\1/')
  if [ "$TH" -ge "$E" ]; then echo "job $JOB already complete"; exit 0; fi
  NEXT=$(python3 -c "print($NL+1)")
  exec "$BIN" "$TH" "$E" "$NEXT" 1 "$PREC" "$LOG"
else
  exec "$BIN" $((S - OVERLAP)) "$E" auto 1 "$PREC" "$LOG"
fi
