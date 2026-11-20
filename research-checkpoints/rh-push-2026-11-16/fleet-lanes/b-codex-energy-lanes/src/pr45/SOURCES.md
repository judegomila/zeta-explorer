# Sources and provenance

## Primary mathematical background

1. George Csordas, *Fourier transforms of positive definite kernels and the
   Riemann xi-Function*, arXiv:1309.0055v2, 21 February 2014.
   https://arxiv.org/html/1309.0055v2
   Theorem 4.2(b) gives strict concavity of `log Phi(sqrt(t))`.
   With the paper's normalization, `kappa(u)=Phi(u/4)`. Theorem 4.1
   records the positive, even, decreasing theta kernel. These background
   properties are used in the analytic first-odd-jet factor and the
   two-point majorization needed for the trace obstruction. The present
   all-order jet is not the paper's associated-kernel hierarchy.

2. Chuji Tanaka, *Note on Laplace-Transforms. (X). On the Singularities of
   Laplace-Transforms. (II)*, Japanese Journal of Mathematics 21 (1951),
   pp. 43–51; published 20 March 1952.
   https://www.jstage.jst.go.jp/article/jjm1924/21/0/21_0_43/_pdf/-char/en
   Its introduction recalls the real convergence-abscissa singularity for
   eventually nonnegative Laplace data. The Gaussian note supplies the
   positivity and Cauchy/Tonelli proof needed here, including separate
   treatment of both tails, so this citation is background rather than
   an unproved application to a bilateral transform.

## Prior project checkpoints

- [PR #43](https://github.com/[user]/mathexplorer/pull/43), commit
  `69d4049f289217812051188378a0a9f3f061a169`: actual theta convolution,
  cutoff energy, two-point positivity, weighted criterion, and geometric
  scope. The exact cut-and-glue geometry did not remove the analytic
  boundary terms.
- [PR #44](https://github.com/[user]/mathexplorer/pull/44), commit
  `a89222f2d069f24690b2f62904d5049e9ff676ed`:
  [research index](https://github.com/[user]/mathexplorer/blob/a89222f2d069f24690b2f62904d5049e9ff676ed/rigorous/theta-propagation-2026-11-08/README.md),
  [analytic localization](https://github.com/[user]/mathexplorer/blob/a89222f2d069f24690b2f62904d5049e9ff676ed/rigorous/theta-propagation-2026-11-08/theta_flux_analytic_localization_20261108.md),
  [actual pulse and Hardy defect](https://github.com/[user]/mathexplorer/blob/a89222f2d069f24690b2f62904d5049e9ff676ed/rigorous/theta-propagation-2026-11-08/theta_pulse_hardy_defect_20261108.md), and
  [theta envelope](https://github.com/[user]/mathexplorer/blob/a89222f2d069f24690b2f62904d5049e9ff676ed/rigorous/theta-propagation-2026-11-08/theta_separated_tail.md).
  These establish the feature-span continuation, the prior weighted
  criterion, and full-theta bounds used or reproved in this checkpoint.

## This continuation

The recurrence and closed parity formulas, unbounded-trace theorem,
commutator formula, derivative-pulse energy law, concavity counterexample,
and Gaussian positive-preimage obstruction are derived in the accompanying
notes. All claimed numerical signs have executable interval certificates.
The superexponential counterexample extension is proved by dominated
convergence and has no selected numerical perturbation parameter.

No novelty, peer review, formal verification, new zero-free height, or
proof of RH is claimed. Contemporary finite higher-concavity preprints
were not used as assumptions in any result in this checkpoint.
