# Independent audit

Date: 2026-11-04 UTC.

Six read-only analytic attacks independently checked the wave-27 transfer,
looked for positivity, derived resolvent and arithmetic forms, stress-tested
localization, and coupled the result to the Ewald scale.

## Passed algebra

- `DU=U(D+2)`, the local `D+1/2` identity, the decaying Green kernel, its
  integration-by-parts constants, the single zero at `log(3/2)`, and the
  factors in `X_n=(2pi/sigma_n){3C_n(5/2)-2C_n(3/2)}` rederive exactly.
- The exponential countermodel reduces exactly to
  `63 beta^2+32 beta-27=0`; the standard-library verifier checks every
  stated recurrence, coefficient, bracket, and Laplace ratio.
- Two independent changes of variables agree on the positive arithmetic
  primitive `mathfrak H`, including continuity at integers, its derivative,
  and the sign in `-integral mathfrak H Z_n'`.
- The multiplicative-scale Ewald formula and the `-2/15` jump of `P` were
  separately rederived.

## Qualifications

- The wave-27 `0.9/1.1` innovation comparison remains conditional on every
  polynomial packet lying in the imported estimate's admissible domain.
  The local verifier does not prove that inclusion.
- Differentiation through `U`, the decaying inverse, Fubini, and the
  multiplicative changes of variables retain complete-theta absolute decay
  assumptions.  They are not machine-proved here.
- The actual-theta sign-changing correlation is a converged floating
  diagnostic.  The close direct/Green agreement is a strong normalization
  check, not an interval proof of the pointwise signs.
- The exact countermodel is not actual theta.  It blocks only a generic
  positivity-to-localization implication.

No next pivot, all-degree Xi--Laguerre inequality, or RH proof is claimed.
