# Primary sources and fixed dependencies

Research continuation, 10 November 2026. The new comparison, remainder,
origin, and counterexample arguments are derived in the local notes.
No finite-height zero theorem is an input to their conclusions.

## Mathematical and arithmetic references

1. George Csordas, *Fourier transforms of positive definite kernels and
   the Riemann xi-Function*, arXiv:1309.0055v2.
   <https://arxiv.org/html/1309.0055v2>
   Role: classical theta properties, especially Theorem 4.2(b)'s
   squared-variable strict log-concavity. The scale is
   kappa(t)=Phi(t/4). This is the inherited input Q>0,Q'>0; no open
   conjecture from that paper is used as a theorem.

2. Michel Bonnefont, Erwan Hillion, and Adrien Saumard,
   *Covariance inequalities for convex and log-concave functions*,
   ALEA 21 (2024), 627--660, DOI 10.30757/ALEA.v21-25.
   <https://alea.impa.br/articles/v21/21-25.pdf>
   <https://arxiv.org/abs/2302.05208>
   Role: related covariance-determinant and Chebyshev-system methods,
   especially Section 4. The particular derivative-kernel minors and
   transfer theorem needed here are proved explicitly, rather than
   assumed from a general total-positivity label.

3. FLINT, `acb_calc` documentation.
   <https://flintlib.org/doc/acb_calc/index.html>
   Role: rigorous complex line-segment integration. Every improper
   integral is accompanied by an explicit caller-supplied tail bound.
   The new theta finite integrands are entire; the auxiliary
   counterexample callback handles its square-root branch explicitly.

4. python-flint 0.9.0, `acb` documentation.
   <https://python-flint.readthedocs.io/en/latest/acb.html>
   Role: `acb.integral` and the analytic-callback contract, including
   forwarding `analytic=analytic` to the counterexample square root.

## Fixed repository proof inputs

- PR #51: <https://github.com/judegomila/mathexplorer/pull/51>
  Commit `afdac28948ab084e80214c31ef72c9520d943760`.
  [Proof directory](https://github.com/judegomila/mathexplorer/tree/afdac28948ab084e80214c31ef72c9520d943760/rigorous/theta-ratio-convexity-2026-11-10).
  Role: actual-theta global ratio signs, the starting comparison class,
  first-order covariance comparison, exact canonical swap, and the
  positive first canceled pair. This checkpoint proves the three
  first-reduced preservation signs left open there.

  Three helper modules are copied byte-for-byte from that fixed
  checkpoint for self-contained execution:
  `theta_ratio_c_integral_20261110.py`,
  `theta_ratio_core_certificate_20261110.py`, and
  `theta_ratio_origin_certificate_20261110.py`.
  They supply rigorous C endpoints, theta derivative jets and tails,
  and even Taylor coefficient/Cauchy bounds. Their earlier full
  proof arguments remain available in the fixed PR #51 global note.

- PR #50: <https://github.com/judegomila/mathexplorer/pull/50>
  Commit `146ce77aa8407e912ed54c73e30664d86936c253`.
  [Proof directory](https://github.com/judegomila/mathexplorer/tree/146ce77aa8407e912ed54c73e30664d86936c253/rigorous/theta-fourth-stage-2026-11-09).
  Role: exact alternating coupled-kernel recurrences and crossing
  conditions in `theta_second_kernel_structure_20261109.md`. Its
  previously established fourth-stage result is context for the
  current independent proof, not a finite-zero premise used here.

- PR #48: <https://github.com/judegomila/mathexplorer/pull/48>
  Commit `499528b487e3249c5a35602f83343aaa53cec848`.
  [Proof directory](https://github.com/judegomila/mathexplorer/tree/499528b487e3249c5a35602f83343aaa53cec848/rigorous/theta-schur-kernels-2026-11-09).
  Role: canceled Green normalization, crossing lemma, exact arithmetic
  energy identity, and its convergence for finite exponential tests.
  The current four-rate positivity proof is through the theta kernels.

- PR #47: <https://github.com/judegomila/mathexplorer/pull/47>
  Commit `7e6d01d9dae527a5785ed31d770cd4b8acd38e17`.
  [Proof directory](https://github.com/judegomila/mathexplorer/tree/7e6d01d9dae527a5785ed31d770cd4b8acd38e17/rigorous/theta-interpolation-2026-11-08).
  Role: exact real Pick/Schur reductions and the conditional all-order
  interpolation route. Its all-order premise is not asserted here.

Earlier research branches are linked at immutable commits; no merge
is presumed. The full new deliverable is based directly on the stated
main commit and does not modify the preceding proofs.
