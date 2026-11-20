# Sources and fixed proof dependencies

## Immutable project inputs

This is an add-only research continuation based on main commit
`942ba1760c4ef54a519750ab91c37a661c31e0ce`. Earlier research PRs are
not presumed merged. The mathematical dependencies are fixed at the
following commits.

| Input | Fixed commit | Role in this checkpoint |
| --- | --- | --- |
| [PR #54](https://github.com/judegomila/mathexplorer/pull/54) | `7556c563be6845444d33b187d1ab8dc984664795` | Both second-source normalized origins for all anchor pairs; third-origin curvature for all anchor triples; all-order total nonnegativity and strictly positive approximants for the Peano kernel; exact mixed-source equivalence including coalescence |
| [PR #53](https://github.com/judegomila/mathexplorer/pull/53) | `5d64d45acf37f4957a8f65c036b502e1b49292d0` | Second full preservation; original H and Q single crossings; first-pair positive sources and origin limits; positive Peano representation and its single-crossing compensation theorem |
| [PR #52](https://github.com/judegomila/mathexplorer/pull/52) | `a24e261deae84bf2a06b6c33a7fbdfe95db2b803` | First full preservation; source comparison implications; original positive source signs and even origin limits |
| [PR #51](https://github.com/judegomila/mathexplorer/pull/51) | `afdac28948ab084e80214c31ef72c9520d943760` | Original full comparison class, theta/C enclosures and their analytic bounds |
| [PR #50](https://github.com/judegomila/mathexplorer/pull/50) | `146ce77aa8407e912ed54c73e30664d86936c253` | Canonical recurrence identities and earlier finite-order comparison consequences |
| [PR #48](https://github.com/judegomila/mathexplorer/pull/48) | `499528b487e3249c5a35602f83343aaa53cec848` | Canceled kernel representations, positive Schur factors, and the exact finite Schur factorization |
| [PR #47](https://github.com/judegomila/mathexplorer/pull/47) | `7e6d01d9dae527a5785ed31d770cd4b8acd38e17` | Conditional implication from positivity at every finite Pick size to zero-free continuation and RH; the every-size premise remains open |

Direct immutable entry points:

- [Third-gate synthesis](https://github.com/judegomila/mathexplorer/blob/7556c563be6845444d33b187d1ab8dc984664795/rigorous/theta-third-gate-2026-11-11/theta_third_gate_synthesis_20261111.md).
- [Mixed-source criterion](https://github.com/judegomila/mathexplorer/blob/7556c563be6845444d33b187d1ab8dc984664795/rigorous/theta-third-gate-2026-11-11/theta_third_source_criterion_20261111.md).
- [All-order compensation theorem](https://github.com/judegomila/mathexplorer/blob/7556c563be6845444d33b187d1ab8dc984664795/rigorous/theta-third-gate-2026-11-11/theta_iterated_compensation_20261111.md).
- [Second-preservation synthesis](https://github.com/judegomila/mathexplorer/blob/5d64d45acf37f4957a8f65c036b502e1b49292d0/rigorous/theta-second-preservation-2026-11-11/theta_second_preservation_global_20261111.md).
- [Positive compensation and endpoint hypotheses](https://github.com/judegomila/mathexplorer/blob/5d64d45acf37f4957a8f65c036b502e1b49292d0/rigorous/theta-second-preservation-2026-11-11/theta_transfer_compensation_20261111.md).

Three numerical helpers are copied byte-for-byte from the fixed PR #53
directory `rigorous/theta-second-preservation-2026-11-11/`:

- `theta_ratio_c_integral_20261110.py`
- `theta_ratio_core_certificate_20261110.py`
- `theta_ratio_origin_certificate_20261110.py`

They retain their original PR #51 provenance. Their analytic estimates
are declared dependencies; their code is run on fresh inputs in the new
certificates. No earlier stored replay is loaded. The full earlier
proof chain is not rerun in this lane. SHA-256 and Git blob hashes in
`MANIFEST.json` record the exact helper contents.

## Primary mathematical background

1. I. J. Schoenberg, *On Pólya frequency functions. II: Variation-diminishing
   integral operators of the convolution type*, Acta Scientiarum
   Mathematicarum 12 (1950), 97–106.
   <https://acta.bibl.u-szeged.hu/13626/1/math_012_pars_b_097-106.pdf>
   The introductory finite-matrix variation theorem supplies the usual
   sign-change background. The particular oriented three-node argument,
   source truncation, and actual Peano-kernel limit are proved explicitly
   in the new compensation note; they are not inferred from a bare
   sign-change count.

2. NIST Digital Library of Mathematical Functions, equation 5.7.6,
   the digamma series; equation 5.9.1, the gamma integral; and equation
   5.11.2, the digamma asymptotic expansion.
   <https://dlmf.nist.gov/5.7.E6>
   <https://dlmf.nist.gov/5.9.E1>
   <https://dlmf.nist.gov/5.11.E2>
   These are the standard gamma identities used in the supporting
   spatial-tail derivation. The positive double integral and differentiated
   remainder estimates needed here are derived in that note.

3. NIST Digital Library of Mathematical Functions, equation 25.2.1,
   the zeta Dirichlet series in its region of absolute convergence.
   <https://dlmf.nist.gov/25.2.E1>
   Used for the high-shape theta normalization and exponentially small
   real-axis correction in the supporting asymptotics.

## Rigorous computation

4. FLINT documentation, `acb_calc`, on rigorous enclosures of finite
   complex integrals.
   <https://flintlib.org/doc/acb_calc/index.html>
   The copied C-integral helper supplies its own transformation and
   improper-integral remainder. A finite integration routine is not
   treated as automatically controlling an infinite tail.

5. Fredrik Johansson, *Numerical integration in arbitrary-precision ball
   arithmetic*, arXiv:1802.07942 (2018).
   <https://arxiv.org/abs/1802.07942>
   Background for the integration method used by the fixed helper.

Implementation versions are pinned to SymPy 1.14.0, python-flint 0.9.0,
and mpmath 1.3.0. Proof signs use exact symbolic arithmetic and Arb
enclosures. Diagnostic routines, including optional probes in the
independent U implementation, are outside the primary verifier.

No claim of literature novelty or external peer review is made. These
references provide background and fixed inputs; the new scalar signs
and their propagation are established in the accompanying project proofs.
