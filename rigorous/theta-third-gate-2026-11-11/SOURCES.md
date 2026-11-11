# Sources and fixed proof dependencies

## Immutable project inputs

The publication branch is based on main
`942ba1760c4ef54a519750ab91c37a661c31e0ce`. Earlier research PRs are
not presumed merged.

| Input | Immutable commit | Role |
| --- | --- | --- |
| [PR #53](https://github.com/judegomila/mathexplorer/pull/53) | `5d64d45acf37f4957a8f65c036b502e1b49292d0` | Second full theta preservation, strict five-node positivity, all-order call-transform identity, Peano kernel and endpoint bounds, source obstruction, positive moment model, global twelfth-derivative bound |
| [PR #52](https://github.com/judegomila/mathexplorer/pull/52) | `a24e261deae84bf2a06b6c33a7fbdfe95db2b803` | First full preservation, second-order comparison implication, canonical resolvent, original positive source prefix |
| [PR #51](https://github.com/judegomila/mathexplorer/pull/51) | `afdac28948ab084e80214c31ef72c9520d943760` | Original theta comparison class and first comparison implication |
| [PR #50](https://github.com/judegomila/mathexplorer/pull/50) | `146ce77aa8407e912ed54c73e30664d86936c253` | Canonical pair recurrence and strict Schur accounting |
| [PR #48](https://github.com/judegomila/mathexplorer/pull/48) | `499528b487e3249c5a35602f83343aaa53cec848` | Canceled kernels and exact arithmetic/theta energy identity |
| [PR #47](https://github.com/judegomila/mathexplorer/pull/47) | `7e6d01d9dae527a5785ed31d770cd4b8acd38e17` | Conditional closure from every finite Pick order to positive-real continuation and RH; the all-order premise remains open |

The following five helpers are byte-for-byte copies from the fixed
PR #53 directory `rigorous/theta-second-preservation-2026-11-11/`:

- `theta_second_origin_20261111.py`
- `theta_second_source_origin_20261111.py`
- `theta_second_source_origin_compact_20261111.py`
- `theta_preservation_origin_20261110.py`
- `theta_ratio_c_integral_20261110.py`

The two helpers under `diagnostics/` are copied from the same fixed
PR's diagnostic directory. Their original provenance is PR #51 for
`theta_ratio_probe_20261110.py` and PR #53 for
`theta_second_source_20261111.py`. Diagnostic values are not accepted
by any rigorous sign certificate. The manifest records the file hashes.

## Primary mathematical references

1. Carl de Boor, *Divided Differences*, Surveys in Approximation Theory
   **1** (2005), 46–69, especially equation (52), the Genocchi–Hermite
   integral over a simplex. The new matrix criterion applies this scalar
   formula entry by entry, with the simplex's area explicitly retained.
   <https://pages.cs.wisc.edu/~deboor/sat/papers/2/2.pdf>

2. I. J. Schoenberg, *On Pólya frequency functions. II: Variation-diminishing
   integral operators of the convolution type*, Acta Sci. Math. (Szeged)
   **12** (1950), 97–106. Its opening paragraph states the finite-matrix
   variation-diminishing theorem for matrices with all minors nonnegative.
   The new note independently proves that the particular compensation
   kernel satisfies that hypothesis at every finite order.
   <https://acta.bibl.u-szeged.hu/13626/1/math_012_pars_b_097-106.pdf>

3. Michel Bonnefont, Erwan Hillion and Adrien Saumard, *Covariance
   inequalities for convex and log-concave functions*, ALEA **21** (2024),
   627–660, DOI 10.30757/ALEA.v21-25. Context for covariance determinants
   and Chebyshev systems; the specific transfer and smoothing arguments
   here are proved in the project notes.
   <https://alea.impa.br/articles/v21/21-25.pdf>

4. NIST Digital Library of Mathematical Functions, §5.15, equation 5.15.1.
   Differentiating the positive trigamma series and comparing with an
   integral gives the polygamma bounds used for the new estimate on
   the second anchor derivative of `p=L`.
   <https://dlmf.nist.gov/5.15>

5. NIST Digital Library of Mathematical Functions, §25.2, equation 25.2.1.
   The zeta Dirichlet series on the real half-line greater than one
   supplies the explicitly bounded logarithmic-derivative correction.
   <https://dlmf.nist.gov/25.2>

6. Jeffrey C. Lagarias, *On a positivity property of the Riemann
   xi-function*, Acta Arithmetica **89** (1999), 217–234,
   DOI 10.4064/aa-89-3-217-234. Background for the positive-real
   logarithmic-derivative formulation of RH. The 2005 correction to
   Lemma 3.1 is recorded below; neither that lemma nor its vertical-line
   bounds is an input to the present proofs.
   <https://doi.org/10.4064/aa-89-3-217-234>
   Correction: <https://www.impan.pl/shop/en/publication/transaction/download/product/81942>

## Rigorous arithmetic

7. Fredrik Johansson, *Numerical integration in arbitrary-precision
   ball arithmetic*, arXiv:1802.07942 (2018).
   <https://arxiv.org/abs/1802.07942>

8. FLINT `acb_calc` documentation. The finite-interval integral enclosure
   is not an enclosure of an unmentioned improper tail: every theta
   truncation and spatial tail is accounted for explicitly in the copied
   moment helper and the new analytic estimates.
   <https://flintlib.org/doc/acb_calc/index.html>

Pinned packages: SymPy 1.14.0, python-flint 0.9.0, mpmath 1.3.0.
The rigorous computations use exact rational algebra and outward-rounded
balls. mpmath is confined to diagnostics.

No literature-novelty claim, formal proof-assistant verification, or
external peer review is asserted.
