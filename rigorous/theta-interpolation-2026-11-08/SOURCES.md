# Sources and provenance

## Primary mathematical sources

1. George Csordas, *Fourier transforms of positive definite kernels and the
   Riemann xi-Function*, arXiv:1309.0055v2 (2014), Theorem 4.2(b).
   https://arxiv.org/html/1309.0055v2
   The stated strict squared-variable concavity applies to our kernel
   under `kappa(u)=Phi(u/4)`, with Phi as in equation (4.2). The covariance,
   real-axis inequalities, and two-node interpolation theorem are derived
   from that input in this checkpoint.

2. John E. McCarthy, *Pick's Theorem—What's the Big Deal?*, American
   Mathematical Monthly 110 (2003), 36–45, Theorem 1.
   https://www.math.wustl.edu/~mccarthy/public_papers/MonthlyWtbd.pdf
   This is the finite Pick criterion. The present half-plane recurrence
   and its passivity identity are written out explicitly, as is the
   conditional normal-family closure argument.

3. Masatoshi Suzuki, *Aspects of the screw function corresponding to the
   Riemann zeta-function*, Journal of the London Mathematical Society 108
   (2023), 1448–1487.
   https://doi.org/10.1112/jlms.12785
   https://arxiv.org/abs/2206.03682
   Theorems 1.1–1.5 provide the exact arithmetic screw function, its
   transform, and the kernel formulation. Theorem 1.7 gives the separate
   pointwise-nonnegativity criterion. These are established prior work.
   Our notes retain the explicit formulas and derive the prime-arrival
   operators and double-Laplace normalization needed here.

4. Masatoshi Suzuki, *Weil's quadratic form via the screw function*,
   arXiv:2606.09096v3, September 2026.
   https://arxiv.org/html/2606.09096v3
   Localized Weil operators and their form domains; see in particular
   the quadratic-form identities in Sections 2.3–2.5. Unconditional
   lower boundedness is not the desired nonnegativity at every scale.

5. Masatoshi Suzuki, *Spectral convergence associated with Weil's quadratic
   form*, arXiv:2610.32704v1, October 2026.
   https://arxiv.org/html/2610.32704v1
   Its principal convergence theorems assume RH. The limiting product
   counts distinct ordinates; identifying it with normalized xi also
   requires simplicity. It is not used as an unconditional input to the
   construction here.

6. Jonathan Sondow and Cristian Dumitrescu, *A monotonicity property of
   Riemann's xi function and a reformulation of the Riemann Hypothesis*,
   Periodica Mathematica Hungarica 60 (2010), 37–40.
   https://arxiv.org/abs/1005.1104
   Background for the safe-shift half-plane statement. The indefinite
   multiplier between shifted and unshifted Pick kernels is calculated
   explicitly in the continuation note.

7. NIST Digital Library of Mathematical Functions:
   https://dlmf.nist.gov/5.7.E6 (digamma partial fractions),
   https://dlmf.nist.gov/5.11.E2 (digamma asymptotic),
   https://dlmf.nist.gov/25.4 (completed xi), and
   https://dlmf.nist.gov/25.10.i (existence of critical-line zeros).
   The gamma realization and boundary cancellation are derived from these
   standard identities, without assuming RH or simplicity.

## Prior project checkpoints

- [PR #45](https://github.com/judegomila/mathexplorer/pull/45), fixed commit
  `6afedec7fae03174b3c99ace99c2ae1453043cb2`:
  [commutator note](https://github.com/judegomila/mathexplorer/blob/6afedec7fae03174b3c99ace99c2ae1453043cb2/rigorous/theta-all-order-2026-11-08/theta_jet_commutator_20261108.md).
  This establishes the ordinary and squared-variable log concavity of
  the auxiliary kernel used in the new four-node obstruction. The new
  script certifies its Pick-matrix failure, a different finite test.
- [PR #46](https://github.com/judegomila/mathexplorer/pull/46), fixed commit
  `e76cbf526733f1ea219a0c103c34d4d457ad3318`:
  [research index](https://github.com/judegomila/mathexplorer/blob/e76cbf526733f1ea219a0c103c34d4d457ad3318/rigorous/theta-endpoint-2026-11-08/README.md).
  Its natural modular realization has the wrong xi endpoint response.
  This continuation replaces the guessed spectral model with exact
  interpolation data and the published arithmetic kernel.

These are separate research PRs. This checkpoint adds a new directory
and decision record to main without modifying their branches.

## Verification and authorship scope

The covariance proof, passive inverse-map identity, transformed signed
kernels, conditional convergence proof, arithmetic-to-Pick normalization,
and prime-arrival calculations were checked within this research session.
The exact rational auxiliary certificate received independent review.
This is internal mathematical review, not peer review or formal proof
assistant verification. No novelty or proof of RH is claimed.
