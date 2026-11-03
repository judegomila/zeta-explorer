# Complete-theta regional degree sweep

This isolated workstream runs a progressive interval atlas of the v31 signed
regional-compensation mechanism. See `STATUS.md` for scope, controls and the
recovery procedure.

## Verification

```sh
python3 workstreams/regional-degree-sweep/tests/test_governor.py
/Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python \
  workstreams/regional-degree-sweep/tests/test_spatial_tail_preflight.py
python3 workstreams/regional-degree-sweep/tests/test_degree7_reference.py \
  --python /Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python
```

## Generated state

- `tasks.json`: deterministic queue.
- `results/*.json`: atomic finite experiment outputs.
- `run/heartbeat.json`: current lock/load policy and owned PIDs.
- `run/events.jsonl`: append-only control events.
- `run/completed.jsonl`: completed-result hashes.
- `run/failed.jsonl`: failed task receipts.

No push, deployment, power-setting change or edit to the live 4CT scripts is
performed by this workstream.
