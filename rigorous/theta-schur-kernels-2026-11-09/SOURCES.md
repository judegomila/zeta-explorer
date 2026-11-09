# Sources and precise dependencies

Accessed 9 November 2026. The proof notes contain the derivations developed
in this checkpoint. This list identifies their external mathematical
inputs and related work; it does not claim novelty.

## Inputs to the theta and third-order proofs

1. George Csordas, *Fourier transforms of positive definite kernels and
   the Riemann xi-Function*, arXiv:1309.0055v2, 21 February 2014.
   [Primary text](https://arxiv.org/html/1309.0055v2).
   Theorem 4.2(b) supplies squared-variable log-concavity for the theta
   kernel. The scale used here is kappa(u)=Phi(u/4).
2. Dave Platt and Tim Trudgian, *The Riemann hypothesis is true up to
   3 times 10^12*, Bulletin of the London Mathematical Society,
   DOI 10.1112/blms.12460.
   [Primary preprint](https://arxiv.org/abs/2004.09765).
   Its rigorous interval-arithmetic verification is used as a theorem to
   make the finite head real. We do not rerun it or extend its zero height.
3. The FLINT team, *Zeros of the Riemann zeta function*, official
   documentation.
   [Isolation, counting, and interval examples](https://flintlib.org/doc/acb_dirichlet/zeta-zeros.html).
   The documented rigorous first-zero enclosures imply the coarse
   intervals (14,15) and (21,22) used in the proof.
4. Andrew Odlyzko, *Tables of zeros of the Riemann zeta function*.
   [Table index and accuracy](https://www-users.cse.umn.edu/~odlyzko/zeta_tables/)
   and [first 100,000 ordinates](https://www-users.cse.umn.edu/~odlyzko/zeta_tables/zeros1).
   Independent primary numerical source for the coarse first-zero data.
5. NIST Digital Library of Mathematical Functions.
   [25.10](https://dlmf.nist.gov/25.10) gives the critical strip and
   symmetry conventions;
   [25.4.4](https://dlmf.nist.gov/25.4.E4) gives xi;
   [25.2.11](https://dlmf.nist.gov/25.2.E11) gives the Euler product;
   [5.7.6](https://dlmf.nist.gov/5.7.E6) and
   [5.15.1](https://dlmf.nist.gov/5.15.E1) give the series from which
   the large-argument estimates are derived by elementary comparison.

## Arithmetic representation and interpolation background

6. Masatoshi Suzuki, *Aspects of the screw function corresponding to the
   Riemann zeta-function*, Journal of the London Mathematical Society
   108 (2023), 1448--1487, Theorem 1.1.
   [Primary journal text](https://doi.org/10.1112/jlms.12785),
   [preprint](https://arxiv.org/abs/2206.03682).
   Supplies the exact arithmetic transform underlying the preceding
   bridge. This checkpoint derives the finite residual energy explicitly.
7. John E. McCarthy, *Pick's Theorem -- What's the Big Deal?*
   [Author-hosted paper](https://www.math.wustl.edu/~mccarthy/public_papers/MonthlyWtbd.pdf).
   Standard finite Pick interpolation background. Our Schur congruence
   and scalar criterion are proved explicitly, not delegated to a
   black-box interpolation routine.

## Prior repository checkpoint, fixed at the reviewed commit

[PR #47](https://github.com/judegomila/mathexplorer/pull/47), commit
`7e6d01d9dae527a5785ed31d770cd4b8acd38e17`:

- [Positive interpolation and the conditional all-order limit](https://github.com/judegomila/mathexplorer/blob/7e6d01d9dae527a5785ed31d770cd4b8acd38e17/rigorous/theta-interpolation-2026-11-08/theta_positive_interpolation_20261108.md).
- [Exact arithmetic-to-Pick bridge](https://github.com/judegomila/mathexplorer/blob/7e6d01d9dae527a5785ed31d770cd4b8acd38e17/rigorous/theta-interpolation-2026-11-08/theta_exact_pick_bridge_20261108.md).
- [Anchored gamma split and passivity](https://github.com/judegomila/mathexplorer/blob/7e6d01d9dae527a5785ed31d770cd4b8acd38e17/rigorous/theta-interpolation-2026-11-08/theta_archimedean_passivity_20261108.md).

## Related recent work, not used as a proof input

8. Suvrit Sra, *Sharp order-four sign regularity of a Jacobi theta kernel*,
   author-site v1, 10 October 2026.
   [Primary PDF](https://suvrit.github.io/papers/csordas/csordas-v1.pdf).
   The source's regularity result concerns a different Hankel kernel and
   includes an explicit software trust assumption. A collaborating
   literature review inspected it; the verifier was not rerun.
9. Suvrit Sra, *On some positivity properties of the Riemann Xi function*,
   author-site v3, 2 November 2026; arXiv:2611.02944v1.
   [Primary text](https://arxiv.org/html/2611.02944v1).
   Its heat-trace and inverse-Laplace positivity results are relevant
   context. Complete monotonicity by itself supplies a weaker curvature
   than the factor-two inequality needed here. No unproved PF-to-Pick
   transfer is assumed.
