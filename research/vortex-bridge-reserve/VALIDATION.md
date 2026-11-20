# Import replay

Initial import completed 2026-11-04 Pacific (2026-11-05 UTC) with CPython 3.12.14 on Linux. Command, from the repository root:

```bash
python3 research/vortex-bridge-reserve/replay.py
```

Result: **PASS — seven core checks, six result snapshots, two regenerated table hashes.** The combined replay took approximately 100 seconds in the import environment.

| Check | Observed result |
| --- | --- |
| `check_interval_engine.py` | 5,100 exact-rational enclosure checks passed. |
| `verify_reserve.py --limit 1000000` | 78,734 events certified; minimum reserve lower bound `0.027520380996089440327443762119700687144692467101172`, at event 3089. Initial-segment certificate also reproduced. |
| `analyze_tail_budget.py` | Finite loss/recovery audit and diagonal-tail result reproduced, including the telescoping residual enclosure. The infinite mixed/recovery bound remains unproved. |
| `window_audit.py` | 1,283 grid points plus continuum correction; certified lower bound `0.043138134288212981357144750467378397465995649018708`. Eventwise integration checks passed. |
| `block_audit.py` | Five window-width scans, inherited-state identities, and synthetic controls reproduced. |
| `prime_only_audit.py` | Prime/higher-power decomposition checks at five integer cutoffs reproduced. |
| `mobius_centering_probe.py` | Fifteen floating centering identities, five quadrature comparisons, and three exact rational exponent comparisons passed. |

The six JSON snapshots matched after excluding only `elapsed_seconds` from the certificate. Decimal strings and other non-floating data were compared exactly. Floating diagnostics used `1e-12` absolute/relative comparison tolerance; the original diagnostic assertions also ran. This tolerance is for cross-platform replay, not a rigorous error bound on the floating calculation.

The regenerated `certificate/reserve_leaves.csv` and `window_values.csv` matched their source-archive SHA-256 hashes exactly. The event table hash is:

```text
fd8c251551fa410aac712d96ccedb9109da3d9f89f7e5f3e6b99b4e62d5c9bb9
```

Before replay, all 29 source-manifest entries were verified, and all 24 retained original non-README files were checked byte for byte against the archive. All ten Python files in the integrated package parsed successfully.

The optional plotting/Fisher scripts, application build, and external Lean projects were not run. The import adds research files and a root README link; it makes no application-code changes. These checks establish reproducibility of the finite computations, not an independent validation of every analytic argument or a proof of RH.

## Centered interval continuation

Completed 2026-11-04 Pacific with the same Python environment. The expanded `replay.py` passed **nine core checks, seven result snapshots, and both table hashes**, in approximately 134 seconds. All previously imported snapshots still matched, and the new `mobius_interval_audit.json` matched exactly, including every Decimal endpoint and both source hashes.

The new default audit covered 23 `(x,U,V)` triples and 69 cutoff evaluations. It certified 22 sign reversals caused by dropping the correction. Maximum `J` interval width: `9.071e-45`; maximum identity-difference interval width: `9.200255e-44`. The exact Möbius convolution was checked through 131,072.

The independent reference checker passed 2,048 trial-factor comparisons, 128 rational prefix checks, four direct divisor-enumeration comparisons, support endpoint checks, and invalid-cutoff checks. All twelve Python files in the expanded package parsed successfully; local Markdown links and the new certificate's source hashes were verified.

A separate run with `--case 65536 64 64 --precision 70` gave `J` width `5.1417e-65` and maximum identity-difference width `6.283617e-64`. All 27 interval-valued fields lay inside the corresponding 50-digit enclosures. The command to reproduce this cross-check is in `MOBIUS_INTERVAL.md`.

The interval engine and all nine original research scripts were unchanged. The new result remains a finite audit; no bound uniform in `x` has been proved.
