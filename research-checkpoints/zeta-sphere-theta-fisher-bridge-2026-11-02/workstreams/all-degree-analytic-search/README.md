# Complete-theta all-degree analytic search

The completed exact-EGF and signed modular-pair follow-on is in
`../all-degree-analytic-search-next-v1`; see its `RESULTS.md` for the current
signed Schur-complement target.

See `THEOREM_TARGET.md` for the exact reflected Hardy/contraction target,
`STATUS.md` for the CPU, coexistence, and scientific contracts, and
`RUNBOOK.md` for status, stop, and recovery commands.  `INITIAL_FINDINGS.md`
records the route-selection diagnostics and their strict interpretation gate.
The completed sweep is aggregated in `RESULTS_SUMMARY.md`. The two exact
all-degree algebraic advances extracted from it are recorded in
`ODD_CENTER_LEMMA.md` and `GENERATING_FUNCTION.md`. Their exact two-channel
modular synthesis is `MODULAR_PAIR_DECOMPOSITION.md`.

Generate the deterministic queue:

```sh
python3 workstreams/all-degree-analytic-search/src/generate_tasks.py
```

Verify the three research workers and generic governor validation:

```sh
/Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python \
  workstreams/all-degree-analytic-search/tests/test_operator_mining.py
/Users/USER/Documents/GitHub/mathexplorer/.venv-arb/bin/python \
  workstreams/all-degree-analytic-search/tests/test_parity_residue.py
python3 workstreams/all-degree-analytic-search/tests/test_structural_generator.py
python3 workstreams/all-degree-analytic-search/tests/test_generic_governor.py
```

Generated state is isolated under this workstream:

- `tasks.json`: deterministic theorem-discovery jobs;
- `results/*.json`: atomic worker outputs;
- `run/heartbeat.json`: current lock/load policy and owned PIDs;
- `run/events.jsonl`: append-only control events;
- `run/completed.jsonl`: completed-result hashes;
- `run/failed.jsonl`: failed task receipts.

No job writes to frozen evidence, the live MathExplorer repository, or
`experiments/rsst-layer3/scripts`.
