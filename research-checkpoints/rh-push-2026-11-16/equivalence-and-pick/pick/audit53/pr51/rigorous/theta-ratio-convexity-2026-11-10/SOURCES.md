# Primary references and fixed proof dependencies

Sources reviewed for the research continuation of 10 November 2026.
Local derivations are in the linked proof notes. No finite-height zero
verification is an input to this checkpoint's ratio theorem.

## Published mathematical input

1. George Csordas, *Fourier transforms of positive definite kernels and
   the Riemann xi-Function*, arXiv:1309.0055v2.
   <https://arxiv.org/html/1309.0055v2>
   Equation (4.2) defines Phi; Theorems 4.1 and 4.2(b) record the
   classical theta properties and strict concavity of log Phi(sqrt(t)).
   The current scale is kappa(t)=Phi(t/4). In particular
   Q=-kappa'/(t*kappa)>0 and Q'>0. The source itself attributes these
   classical results to earlier primary papers. No open conjecture
   in that source is used as a theorem here.

## Rigorous arithmetic implementation

2. FLINT, `acb_calc` documentation: rigorous enclosures of complex
   line-segment integrals with analytic callbacks.
   <https://flintlib.org/doc/acb_calc/index.html>
   Role: the finite integral enclosure in `C_point`. The caller must
   bound improper-integral tails; those bounds are derived explicitly
   in the global proof and implemented in the endpoint module.

3. python-flint, `acb` documentation.
   <https://python-flint.readthedocs.io/en/latest/acb.html>
   Role: interface and analytic-callback contract for `acb.integral`.
   The tested package is python-flint 0.9.0. Its installed docstring
   was checked alongside the documentation. All finite integrands used
   by the endpoint calculation are entire.

4. Fredrik Johansson, *Numerical integration in arbitrary-precision
   ball arithmetic*, arXiv:1802.07942.
   <https://arxiv.org/abs/1802.07942>
   Background reference identified by the FLINT integration
   documentation. The correctness contract used by the implementation
   is the documented rigorous integral enclosure, not an independently
   reimplementation of the quadrature algorithm.

## Repository proof dependencies

- PR #50: <https://github.com/judegomila/mathexplorer/pull/50>
  Fixed commit: `146ce77aa8407e912ed54c73e30664d86936c253`.
  [Proof directory](https://github.com/judegomila/mathexplorer/tree/146ce77aa8407e912ed54c73e30664d86936c253/rigorous/theta-fourth-stage-2026-11-09).
  `theta_second_kernel_structure_20261109.md` gives the first-pair
  identities, Stein representation, exact second sources, crossing
  criterion, and alternating recurrences. Its two open ratio targets
  are proved in the current checkpoint. Its fourth-order theorem has
  a separate finite-zero input and is not needed to prove these signs.

- PR #48: <https://github.com/judegomila/mathexplorer/pull/48>
  Fixed commit: `499528b487e3249c5a35602f83343aaa53cec848`.
  [Proof directory](https://github.com/judegomila/mathexplorer/tree/499528b487e3249c5a35602f83343aaa53cec848/rigorous/theta-schur-kernels-2026-11-09).
  `theta_schur_positive_kernels_20261109.md` proves the canceled Green
  normalization, crossing lemma, and positive first pair from actual
  theta concavity. The arithmetic energy identity and convergence are
  in `theta_schur_residual_energy_20261109.md`. The generic-kernel
  counterexample rules out a weaker automatic-preservation claim;
  it does not address the stronger class proposed here.

- PR #47: <https://github.com/judegomila/mathexplorer/pull/47>
  Fixed commit: `7e6d01d9dae527a5785ed31d770cd4b8acd38e17`.
  [Proof directory](https://github.com/judegomila/mathexplorer/tree/7e6d01d9dae527a5785ed31d770cd4b8acd38e17/rigorous/theta-interpolation-2026-11-08).
  Role: exact real Pick/Schur reductions, passive inverse reduction,
  actual-theta two-node theorem, and the conditional all-orders route.

These immutable references remain usable when the new branch starts
directly from main. No earlier research PR is presumed merged. The
comparison lemma is proved in full locally; no external comparison
theorem or literature-novelty assertion is needed.
