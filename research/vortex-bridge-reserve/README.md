# Vortex / bridge reserve lab

This package preserves the October 2026 research continuation from the vortex and Twin-Ladder Bridge picture to a precise prime-arithmetic target. **It does not prove RH or establish a new zero-free region.** Vortices describe the local geometry of zeros of a fixed function; a relaxation picture alone does not move those zeros or constrain their real parts.

The remaining task is a uniform, one-sided bound on a signed arithmetic quantity. The centered Vaughan formulation must retain its tail correction. Separate estimates of the rows lose the cancellation needed by this approach.

## What is established here

| Item | Evidence and scope |
| --- | --- |
| Scalar response `Psi(t) > 0` for `0 < t <= log(1,000,000)` | Outward-rounded Decimal computation over 78,734 prime-power events, plus the initial segment; minimum reserve lower bound `0.02752038099608944…` at event 3089. |
| Fixed-width mean `W_1(t) > 0.0431381` for `0 <= t <= log(1,000,000)-1` | Interval grid with a continuum correction and independent eventwise integration checks. |
| Loss/recovery and prime-only reductions | Analytic working notes with finite interval audits; the required infinite mixed/recovery or signed prime bound remains unproved. |
| Centered Vaughan/Möbius identity | Derivation retaining the exact finite tail correction; 15 floating-point identity diagnostics and exact rational exponent comparisons. The diagnostics are not interval certificates. |
| Generic-mechanism obstructions | Synthetic countermodels to several proposed sufficient mechanisms; these are not counterexamples to RH or models of the actual primes. |

Logarithmic delay is not zero height. Finite scalar positivity is not full Weil-kernel positivity. The analytic notes have not received an independent proof audit as part of this repository import.

## Reproduce

Python 3.10 or later; the core audit uses only the standard library. From the repository root:

```bash
python3 research/vortex-bridge-reserve/replay.py
```

This runs all seven core checks in a temporary directory, regenerates the omitted event and window tables, and compares their hashes and the six JSON result snapshots. It leaves the tracked research snapshots unchanged. Expect several minutes of computation and approximately 30 MB of temporary table data. See [VALIDATION.md](VALIDATION.md) for the import replay result.

To retain the generated tables, run the original tools directly, in order:

```bash
cd research/vortex-bridge-reserve
python3 check_interval_engine.py
python3 verify_reserve.py --limit 1000000
python3 analyze_tail_budget.py
python3 window_audit.py
python3 block_audit.py
python3 prime_only_audit.py
python3 mobius_centering_probe.py
```

These commands write the tables and refresh their neighboring JSON snapshots. `certificate/certificate.json` includes runtime, so a direct rerun normally changes that field. Run without Python's `-O` option: the audits use assertions.

Optional plots and exploratory Fisher diagnostics require NumPy, SciPy, and Matplotlib. After the direct commands above:

```bash
python3 -m pip install numpy scipy matplotlib
python3 diagnostics.py
python3 plot_window_audit.py
```

The generated PNGs, `certificate/reserve_leaves.csv`, and `window_values.csv` are intentionally excluded from Git. Their source-archive hashes are retained in [provenance/source-manifest.sha256](provenance/source-manifest.sha256). Plots and Fisher diagnostics are not used to establish the finite certificate.

## Reading order

1. [MOBIUS_CENTERING.md](MOBIUS_CENTERING.md): latest centered-row identity, mandatory tail correction, and quantified loss from separate Möbius estimates.
2. [PRIME_ARITHMETIC.md](PRIME_ARITHMETIC.md): prime-only target, higher-power correction, and sparse weighted obstruction.
3. [PRIORITY_AUDIT.md](PRIORITY_AUDIT.md): historical benchmark-source inspection, inherited block state, and generic countermodels.
4. [WINDOWED_PRIME_AUDIT.md](WINDOWED_PRIME_AUDIT.md): finite window certificate, signed memory, and limits of smoothing arguments.
5. [GLOBAL_TAIL.md](GLOBAL_TAIL.md): infinite-budget reductions and the unresolved mixed/recovery estimate.
6. [REPORT.md](REPORT.md): original vortex obstruction, reserve lemma, and interval arithmetic justification.

[PROVENANCE.md](PROVENANCE.md) records the source archive, omissions, relationship to the existing repo, and limits of this import. The dated source-inspection statements inside the notes describe the original research sessions; this import does not revalidate those external manuscripts or benchmark claims.

## Next mathematical step

Study the jointly centered sum in `MOBIUS_CENTERING.md`, keeping its exact correction for every finite cutoff. The next computational task is an outward-rounded implementation of that identity over several admissible `(x, U, V, K)` choices, checking cutoff consistency and measuring cancellation jointly. That would strengthen the current floating diagnostics, but any infinite conclusion would still require an analytic bound uniform in `x`. A proposed Möbius hypothesis must also be compared with the zero-free conclusion it already implies directly.
