# RH moment-transfer audit — 2026-10-06

Logged to Zeta Explorer on 2026-10-07.

**Status: no RH proof and no improvement of the imported 7/8 zero-free boundary.** This records the completed attempt to connect the posted OpenAI result with the Vaughan packet, twin-ladder, and bridge-model work.

## Research record

- [Seven-page note (PDF)](../../research-inputs/rh-moment-transfer-2026-10-06/rh_moment_transfer.pdf)
- [Complete mathematical source](../../research-inputs/rh-moment-transfer-2026-10-06/rh_moment_transfer.tex)
- [Exact-arithmetic checker](../../research-inputs/rh-moment-transfer-2026-10-06/verify.py)
- [Verification receipt](../../research-inputs/rh-moment-transfer-2026-10-06/verification.json)
- [Source provenance](../../research-inputs/rh-moment-transfer-2026-10-06/source_index.json)
- [Release hashes](../../research-inputs/rh-moment-transfer-2026-10-06/manifest.json)

The archived release is byte-for-byte unchanged. Its README and source-index statements that no repository was modified describe the original research session, before this import.

## What the attempt establishes

| Component | Outcome and scope |
| --- | --- |
| Fixed-cutoff Vaughan transform | At every nontrivial zeta zero of multiplicity m, the Type-II Dirichlet series retains residue −m. The split does not halve the pole displacement. |
| Moving-window energy | Taking the posted quasi-RH theorem as an external input gives E_II(T) = O(exp(3T/4)) for the existing packet. This is an inherited endpoint, not a stronger zero-free region. |
| Number-field transfer | Ordinary Möbius coefficients require the convolution μ = μ_F^norm * χ_-3. Replacing them with norm coefficients alone loses necessary terms. |
| Sixth-power amplifier | Direct extraction gives exponent 11/12 + ε, weaker than 7/8. The combined-mark worksheet also bottoms out at 11/12; that worksheet is an optimistic model, not a new theorem or universal obstruction. |
| Bridge model | Under the imported theorem, the note derives inner/passive behavior for bridge widths a ≥ 3/8. It does not establish widths tending to zero. |
| Remaining gap | A stronger signed cross-term / principal-sensitive covariance estimate is still needed. No positive exponent contraction is proved. |

## Reproduce the finite checks

From the repository root, using Python 3.10+ with no third-party dependencies:

```bash
python3 research-inputs/rh-moment-transfer-2026-10-06/verify.py
```

This regenerates the adjacent verification.json. The import run passed 40,960 exact formal-log Vaughan coefficients, 8,192 norm-lift coefficients, six residue models, negative controls, and rational exponent checks. These finite checks do not prove the universal analytic estimates.

The seven-page PDF was compiled and visually checked during the research session. The external Lean project was inspected but **not rebuilt**; its theorem is an external input, not independently machine-verified by this audit.

## Dependencies and related work

The external source is pinned to [openai/math commit adc7f124](https://github.com/openai/math/tree/adc7f1241b42e322a6451854ab7e4b4c146bf78a); the original entry point was [lean/docs/003.md](https://github.com/openai/math/blob/adc7f1241b42e322a6451854ab7e4b4c146bf78a/lean/docs/003.md). Exact manuscript and user v9 bundle hashes are recorded in source_index.json. The full third-party manuscript and original v9 bundle are not duplicated here.

Related repository work: [RH positivity audit, PR #9](https://github.com/judegomila/mathexplorer/pull/9). This addition is self-contained and does not require that PR to be merged. It records research only; it changes no application claims or deployed behavior.

## Principal-sector follow-up — 2026-10-08

[The follow-up note](rh-principal-sector-2026-10-08.md) proves explicit diagonal and near-shift bounds, computes the full principal-density subtraction, and records the remaining signed large-shift estimate. Exact and 512-bit checks pass. No positive exponent saving is proved; the archived October 6 release above is unchanged.
