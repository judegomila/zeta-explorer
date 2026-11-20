# Primary background sources

The new deductions and certificate error bounds are written out in this
directory. They are not presented as previously unpublished results.

- **George Csordas, Fourier transforms of positive definite kernels and the
  Riemann xi-function**, arXiv:1309.0055v2.
  <https://arxiv.org/abs/1309.0055>
  Theorem 4.2(b) supplies the stronger concavity of log Phi(sqrt(t)); in our
  normalization kappa(u)=Phi(u/4). The associated-kernel and Laguerre hierarchy
  provides relevant context for distinguishing finite inequalities from all
  orders. The localization and separated-tail proofs here are explicitly
  derived rather than attributed to this paper.

- **Masatoshi Suzuki, Chains of reproducing kernel Hilbert spaces generated
  by unimodular functions**, arXiv:2012.11121.
  <https://arxiv.org/abs/2012.11121>
  Background on the xi-plus-derivative construction, Hermite–Biehler classes,
  Hardy/model spaces, and the additional conditions needed for positivity.

- **Chris Guiver, Hartmut Logemann and Mark R. Opmeer, Operator-valued
  multiplier theorems for causal translation-invariant operators with
  applications to control theoretic input-output stability** (2024).
  <https://doi.org/10.1007/s00498-024-00387-4>
  Standard causal-multiplier background. Our plus-Fourier convention reverses
  the usual physical support orientation.

- **NIST Digital Library of Mathematical Functions**:
  <https://dlmf.nist.gov/25.4> (xi normalization and functional equation),
  <https://dlmf.nist.gov/25.10> (zero strip),
  <https://dlmf.nist.gov/5.11> (gamma/digamma asymptotics).
  These support the standard growth facts in the inner-quotient audit.

## Previous repository checkpoint

[PR #43](https://github.com/judegomila/mathexplorer/pull/43), commit
`69d4049f289217812051188378a0a9f3f061a169`, preserves the torus/spinor/minitwistor
construction, exact cutoff-energy identity, positive Gram plus correction,
single-pulse criterion, and earlier fixed-finite tail theorem. This new lane
is self-contained for its new proofs and executable certificates.
