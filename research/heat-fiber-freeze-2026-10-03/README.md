# Heat-compatible twistor fibers and scalar freeze research

**Status: partial, explicitly scoped research. No global bound Λ < 0.145 is proved.**

At heat time t = 24727519/200000000 = 0.123637595, a global zero-free strip outside |Im z| ≤ 1/5 would give the conditional endpoint Λ ≤ 28727519/200000000 = 0.143637595. The exact strip-transfer arithmetic is checked. The required global nonvanishing statement remains open.

## What is included

- [Exact heat/fiber completion note](heat_twistor_completion/HEAT_FIBER_COMPLETION.md): normalization, four different kinds of freezing, corrected heat/intertwiner identities, a zero-preserving constant-fiber lift, Feshbach requirements, and the accumulating-width scalar-holomorphy criterion. That criterion is equivalent to the required zero-free strip; its hypotheses have not been established at the proposed target.
- [Scalar freeze report](lambda_fiber_freeze/FIBER_FREEZE_REPORT.md) and [certificate ledger](lambda_fiber_freeze/certificate_ledger.json): the dependency-preserving scalar gate, exact target domains, inherited inputs and remaining obligations. Finite phase screens are diagnostics only.
- [40-digit local cell](lambda_fiber_freeze/local_cell_certificate.json), [60-digit replay](lambda_fiber_freeze/local_cell_certificate_60dps.json), and [comparison](lambda_fiber_freeze/local_replay_comparison.json): one positive-area cell with x = 6000000186827 ± 1/10000 and 1/5 ≤ y ≤ 200001/1000000, at the stated heat time. Both outputs certify local nonvanishing while explicitly marking global coverage and Λ < 0.145 as unproved. The higher-precision replay uses the same implementation and is not an independent implementation.
- [Analytic far-tail proof](lambda_fiber_freeze/ANALYTIC_TAIL.md), [independent review](lambda_fiber_freeze/TAIL_REVIEW.md), and [directed constant checks](lambda_fiber_freeze/coarse_tail_constant_results.json): for every 1/5 ≤ y ≤ 1 and actual floor-defined index N ≥ 10^17, |H_t/B_t| > 43/500. The proof includes index seams and the y endpoints. Its sharper N ≥ 10^20 margin is > 31/125. The portable script checks constants; the universal statement also uses the inequalities and monotonicity proof in the note.
- [Independent heat audit](heat_twistor_completion/INDEPENDENT_AUDIT.md), [original audit receipt](heat_twistor_completion/audit_receipt.json), and [final-source review](heat_twistor_completion/final_source_review.json), with portable symbolic and numerical verifiers.

## What remains open

The tail leaves an enormous finite range, 690988 ≤ N < 10^17. One local cell does not cover that range, a complete index window, or the full required y interval. All remaining boxes, overlaps and seams need rigorous coverage. The inherited intermediate barrier was inspected but has not been independently replayed here. The unavailable historical archive supplies no new replay evidence.

The earlier signed Hankel certificate at **heat time zero**, arithmetic width a = 1/4, and finite truncation L ≤ 3/2 is a distinct result. It supplies no global positive-time strip theorem by itself. The heat lift retains the scalar difficulty; this supplement adds no Lambda controls to the interactive view.

## Reproduce the lightweight checks

From this directory, use Python 3.11 or newer with the packages in [requirements.txt](requirements.txt). The recorded source run used Python 3.12.14, mpmath 1.3.0 and NumPy 2.3.5; the symbolic replay used SymPy 1.14.0.

```sh
python3 verify_manifest.py
python3 heat_twistor_completion/verify_identities.py
(cd lambda_fiber_freeze && python3 verify_exact_gates.py)
(cd lambda_fiber_freeze && python3 verify_coarse_tail_constants.py)
```

The symbolic script checks 25 exact identities. The other two scripts verify rational gate arithmetic and directed tail constants. These checks do not fill any global analytic obligation. The commands above write result JSON in the corresponding source folders; replay in a copy if preserving the frozen bytes is important. The manifest check should be run before replay.

For the complete local interval computation and optional diagnostic screens, see [REPLAY.md](lambda_fiber_freeze/REPLAY.md). A cell replay evaluates all 690988 terms and took about two minutes per precision in the source environment:

```sh
(cd lambda_fiber_freeze && python3 certify_local_cell.py)
(cd lambda_fiber_freeze && python3 certify_local_cell.py --dps 60 --output local_cell_certificate_60dps.json)
```

Both runs must leave `global_coverage_certified` and `lambda_lt_0145_proved` false. Their false values describe missing proof in this package, not a disproof of the mathematical statements.

## Provenance and review scope

[source-manifest.json](source-manifest.json) fixes the exact bytes of all 25 copied source files. The search's [run_manifest.json](lambda_fiber_freeze/run_manifest.json) independently lists its 17 final files and observed software versions. The copied notes and receipts are unchanged, including statements that describe their pre-publication status when written. This repository addition publishes those snapshots; those historical statements are not current publication-status claims.

The original heat audit receipt refers to an earlier source version. The separate final-source review identifies the final note, portable symbolic script and cell script by SHA-256, and explicitly distinguishes source inspection from execution. The far-tail review identifies the exact proof and verifier hashes. Hashes establish byte identity, not mathematical validity or peer-review status.

Inherited repository documents are external audit inputs rather than dependencies of the new portable checks. Their pinned URLs and inspected byte identities remain in the report and [source_file_hashes.json](lambda_fiber_freeze/source_file_hashes.json). This package does not assert a fresh replay of their full certificates.

[Return to the research index](../README.md).
