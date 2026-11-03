# Runbook

All paths below are relative to the checkpoint root.

## Status

```sh
python3 workstreams/regional-degree-sweep/src/control.py status \
  --run-dir workstreams/all-degree-analytic-search/run
```

## Graceful stop

```sh
python3 workstreams/regional-degree-sweep/src/control.py stop \
  --run-dir workstreams/all-degree-analytic-search/run
```

## Recovery

Regenerate `tasks.json`, rerun the test suite, and relaunch the same supervisor
command.  Valid atomic outputs are hash-recorded and skipped.  A task whose
status or input parameters do not exactly match the queue is rerun.

The governor's `STOP` file is removed only by a newly started supervisor.  It
never resumes or signals an unrecorded process.  `run/stopped.json` lists any
straggler after a stop; a nonempty list must be investigated rather than
force-killed.

## Interpretation gate

- A stable low displacement rank is an ansatz for a boundary identity, not a
  positivity result.
- Rank/bandwidth growth falsifies that factorization template, not RH.
- Parity-residue growth rules out a raw orbit-Gram payment in that parity, not
  the complete bridge inequality.
- Exact structural records certify only their displayed algebraic identities.
- No finite collection of outputs proves the all-degree contraction or RH.
