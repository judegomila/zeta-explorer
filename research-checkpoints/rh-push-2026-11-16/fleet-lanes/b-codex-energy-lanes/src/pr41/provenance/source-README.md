# Vortex / bridge reserve lab

Read **MOBIUS_CENTERING.md** for the latest centered-row identity and quantitative test of separate Möbius estimates. Read **PRIME_ARITHMETIC.md** for the prime-only reduction and sparse weighted countermodel. Read **PRIORITY_AUDIT.md** for the benchmark audit, block recurrence, finite comparison, and synthetic obstruction. Read **WINDOWED_PRIME_AUDIT.md** for a certified finite window margin, signed prime memory, and counterexamples to unsafe smoothing inferences. Read **GLOBAL_TAIL.md** for the infinite-budget reduction, and **REPORT.md** for the original framework.

The continuation proves a negative-area criterion, an exact free-flight criterion, and an equivalence between RH and a bound on mixed prime-power charges after continuous recovery. It bounds the entire infinite diagonal loss sum. The remaining mixed/recovery bound is unproved.

This bundle contains a standard-library interval verifier proving the finite scalar inequality
`Psi(t) > 0` for `0 < t <= log(1_000_000)`, together with an exact sufficient arithmetic barrier for extending that conclusion. The infinite-range barrier remains unproved. This is not an RH proof or a new zero-free bound.

```bash
python check_interval_engine.py
python verify_reserve.py --limit 1000000
python analyze_tail_budget.py
python window_audit.py
python block_audit.py
python prime_only_audit.py
```

The certificate includes all 78,734 event enclosures and the initial-segment enclosures. `certificate.json` records the CSV hash. A run recomputes rather than trusts those leaves.

Optional floating-point diagnostics and plotting:

```bash
python -m pip install numpy scipy matplotlib
python diagnostics.py
```

Files:

- `MOBIUS_CENTERING.md`, `mobius_centering_probe.py`, `mobius_centering_probe.json`: exact centered-tail identity, exponent loss, and floating diagnostics.

- `PRIME_ARITHMETIC.md`, `prime_only_audit.py`, `prime_only_audit.json`: polynomial higher-power bound, prime-only target, and finite checks.

- `PRIORITY_AUDIT.md`, `benchmark_sources.json`: benchmark scope, proof-inspection limits, exact block target and obstruction.
- `block_audit.py`, `block_audit.json`: reproducible finite block comparison and control constructions.

- `WINDOWED_PRIME_AUDIT.md`: fixed-filter criteria, the exact inherited-state identity, the signed-memory target, and two counterexamples.
- `window_audit.py`, `window_audit.json`, `window_values.csv`: finite interval audit proving `W_1(t) > 0.0431381` on `0 <= t <= log(1_000_000)-1`.
- `plot_window_audit.py`, `window_comparison.png`: optional visualization of the finite interval results.
- `GLOBAL_TAIL.md`: proofs of the infinite-budget reductions and the precise unresolved bound.
- `analyze_tail_budget.py`, `tail_budget.json`: outward-rounded audit of the existing leaves, selected exact free-flight minima, and the unconditional diagonal tail bound.
- `REPORT.md`: derivation, proofs of the local obstruction and reserve lemma, exact unresolved inequality.
- `verify_reserve.py`: outward-rounded standard-library certificate computation.
- `check_interval_engine.py`: exact-rational enclosure checks.
- `certificate/`: result summary and full event leaves.
- `diagnostics.py`: separate theta/Fisher and counterexample calculations.
- `fisher_diagnostics.csv`, `counterexample.json`: diagnostic results.
- `reserve_check.png`: plot of the finite certificate.

Logarithmic delay is not zero height. Finite scalar positivity is not full Weil-kernel positivity.
