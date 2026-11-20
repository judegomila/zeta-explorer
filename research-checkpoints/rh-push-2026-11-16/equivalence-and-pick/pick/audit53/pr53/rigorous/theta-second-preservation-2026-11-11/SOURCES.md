# Sources and fixed proof dependencies

## Immutable Math Explorer inputs

Prior PRs are not presumed merged. The new branch is based on main
`942ba1760c4ef54a519750ab91c37a661c31e0ce`. Fixed research inputs are:

| Input | Fixed commit | Role |
| --- | --- | --- |
| [PR #52: first preservation](https://github.com/judegomila/mathexplorer/pull/52) | `a24e261deae84bf2a06b6c33a7fbdfe95db2b803` | First canonical pair in the full class; second-order comparison; original positive source prefix; sixth-derivative bound |
| [PR #51: ratio convexity](https://github.com/judegomila/mathexplorer/pull/51) | `afdac28948ab084e80214c31ef72c9520d943760` | Original comparison class; first comparison; rigorous theta/C helpers and their estimates |
| [PR #50: preceding finite stage](https://github.com/judegomila/mathexplorer/pull/50) | `146ce77aa8407e912ed54c73e30664d86936c253` | Exact canonical recurrences and preceding four-node result |
| [PR #48: Schur kernels and energy](https://github.com/judegomila/mathexplorer/pull/48) | `499528b487e3249c5a35602f83343aaa53cec848` | Positive canceled kernels, Schur factorization, exact arithmetic energy identity |
| [PR #47: interpolation closure](https://github.com/judegomila/mathexplorer/pull/47) | `7e6d01d9dae527a5785ed31d770cd4b8acd38e17` | Conditional all-order continuation/RH implication; its premise remains open |

Four helper files are copied byte-for-byte from the fixed PR #52
directory `rigorous/theta-preservation-2026-11-10/`:

- `theta_ratio_c_integral_20261110.py`
- `theta_ratio_core_certificate_20261110.py`
- `theta_ratio_origin_certificate_20261110.py`
- `theta_preservation_origin_20261110.py`

The first three also retain the original PR #51 provenance. The
diagnostic theta-ratio helper is copied from fixed PR #51 and is used
only by scripts in `diagnostics/`. File hashes appear in `MANIFEST.json`.
No diagnostic values are used by the mathematical certificates.

## Primary mathematical references

1. George Csordas, *Fourier transforms of positive definite kernels and
   the Riemann xi-Function*, arXiv:1309.0055v2 (2014), especially the
   theta-kernel properties in Section 4. The normalization here is
   $\kappa(t)=\Phi(t/4)$.
   <https://arxiv.org/html/1309.0055v2>

2. Michel Bonnefont, Erwan Hillion and Adrien Saumard, *Covariance
   inequalities for convex and log-concave functions*, ALEA 21 (2024),
   627–660, DOI 10.30757/ALEA.v21-25. Section 4 provides context for
   covariance determinants and Chebyshev-system methods. The particular
   call-transform and Peano-kernel properties used here are proved
   directly in the checkpoint.
   <https://alea.impa.br/articles/v21/21-25.pdf>

3. NIST Digital Library of Mathematical Functions, equation 5.15.1:
   the positive trigamma series. Its elementary sum/integral comparison
   is used in the large-anchor bound for $p'$.
   <https://dlmf.nist.gov/5.15.E1>

4. NIST Digital Library of Mathematical Functions, equation 25.2.1:
   the zeta Dirichlet series for real argument greater than one.
   Termwise differentiation and an explicit integral bound give the
   small real-axis zeta correction in the same estimate.
   <https://dlmf.nist.gov/25.2.E1>

## Rigorous computation references

5. FLINT documentation, `acb_calc`: rigorous finite integration with
   ball-valued analytic integrands. The caller remains responsible for
   every improper-integral truncation or transformation; this checkpoint
   provides those tails explicitly.
   <https://flintlib.org/doc/acb_calc/index.html>

6. Fredrik Johansson, *Numerical integration in arbitrary-precision
   ball arithmetic*, arXiv:1802.07942 (2018).
   <https://arxiv.org/abs/1802.07942>

Pinned implementation dependencies: SymPy 1.14.0, python-flint 0.9.0,
and mpmath 1.3.0. The last is used for diagnostics; the rigorous sign
certificates use exact symbolic expressions and outward-rounded balls.

## Related recent work, not a proof dependency

Suvrit Sra, *Sharp order-four sign regularity of a Jacobi theta kernel*,
version 1 released 10 October 2026, studies the Hankel kernel
$\Phi(\sqrt{x+y})$ and reports a failure at its fifth order.
<https://suvrit.github.io/papers/csordas/>

That is a different determinant problem from the real Pick kernel and
the particular mixed source Wronskians here. Its reported order-five
failure is not substituted for this checkpoint's independent source
certificate and has no implication here of failed five-node Pick
positivity. No novelty claim is made relative to this or the broader
total-positivity literature.
