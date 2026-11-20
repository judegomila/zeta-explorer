# Mathematical audit and scope

This audit concerns the claims in this checkpoint. It is not peer review or
proof-assistant verification. The general theta positivity and zero-leakage
claims remain unproved.

## All-order algebra

- Checked the reflection identity for the cutoff-zero kernel and the sign
  of its diagonal derivative. The total derivative in the integration
  variable gives the negative boundary term in the displacement equation.
- Checked the complex polynomial energy, both parity congruences, the odd
  bridge formula, and the finite-sum expression for the even block.
- Checked the balanced entries by integration by parts, including the
  `m=0` endpoint case. No sign of the boundary array `a_p` is assumed.
- Checked the Gaussian derivative integrals, determinant `-4`, indefinite
  correction, and exact positive rank-one sum. The example invalidates an
  inference about the decomposition, not positivity of the Gaussian.
- Clarified that the same-parity boundary determination applies to the
  correction matrix `C`, not to the entire unweighted derivative Gram `B`.

## Unbounded boundary trace

- Checked the augmentation by `kappa(z)` and the factor `1/sqrt(alpha)`.
  The indefinite form is bounded on the ambient Hilbert space. Therefore
  scalar analytic uniqueness legitimately extends the hypothetical
  all-derivative inequality to the actual even features.
- Replaced reliance on an unstated two-point step with the direct Jensen
  inequality `kappa(r-u)kappa(r+u)<=kappa(sqrt(r*r+u*u))^2`.
- Checked the full theta envelope, the geometric bound on its remaining
  terms, and the explicit exponential integral giving a ratio tending to
  zero. This contradicts every fixed trace constant.
- The result does not assert that the even block has a negative vector.
  A positive form can have an unbounded evaluation functional. Domains
  would be essential in any operator reconstruction using that trace.

## Commutator and actual derivative pulse

- Checked the product commutator, integration by parts, and all alpha
  factors. At zero, `b=-u*kappa/kappa'` extends smoothly because the
  certified theta second derivative is strictly negative.
- Checked the actual theta endpoint estimates at every fixed derivative
  degree and the Gaussian specialization with constant `b`.
- Checked `b'<=0` from the known strict concavity of
  `log kappa(sqrt(x))`. For `P=D`, the commutator combines with the bulk
  term to give the positive squared norm with the stated sign.
- Checked the physical-space corollary: the actual input and output are
  derivatives of `h_+` and `h_-`; convolution commutes, and their cutoff
  energy difference is exactly `J11`. Translation changes the cutoff but
  does not promote this result to arbitrary input pulses.

## Concavity obstruction

- Checked the elementary proofs of both strict concavity properties of
  `exp(-u*u)*(3/2+cosh(u))`, including the limiting value at zero.
- Independently reviewed the exact rational derivative polynomials,
  Gaussian moment recurrence, erf alternating remainder, and interval
  arithmetic. The fixed rational negative direction is an asserted sign,
  not an inferred negative eigenvalue from floating-point sampling.
- Checked the positive superexponential deformation. Uniform bounds on
  derivatives through order three provide an integrable common majorant,
  so its negative direction persists by dominated convergence. The same
  deformation preserves both concavity properties and produces an
  order-one transform. No specific positive epsilon is numerically
  certified or needed for this existential statement.
- Checked the independent full-theta origin bound. For the derivative
  polynomial `p2`, every term with `n>=2` is positive and at most
  `2*(pi*n*n)^4`; their geometric sum gives the stated enclosure.

## Gaussian positive-preimage obstruction

- Checked the Gaussian normalization and its zero-free bilateral transform.
  The weighted criterion concerns the actual boundary response, not the
  existence of a preimage under `A`.
- The staged note makes the convolution-to-strip identity explicit by
  weighted absolute integrability and Fubini, and links the prior
  xi-specific pole-free criterion.
- Independently reviewed the L2-to-L1 Gaussian approximate identity,
  finite-difference moment argument, Cauchy bounds, and both real
  convergence endpoints. The endpoint argument proves convergence of
  the positive integrals; it does not substitute continuation of a
  meromorphic quotient for that convergence.
- Checked strict real-axis monotonicity of `F'/F` as a variance. The single
  interval bound at `-1` therefore establishes positivity on the required
  real half-line.
- Reviewed the Rouché certificate: exact theta derivative polynomials,
  positive omitted theta sum, global derivative caps, complex Simpson
  remainder, spatial tails, and the uniform bound on `D''` in the disk.
  The disk is wholly in `-1<Re(z)<0`; its unique zero is a denominator zero,
  not an asserted zero of xi off the critical line.
- Common boundary zeros were kept separate: they can be removable in
  `N/D` while still blocking an L2 preimage through `1/D`.
- The proof excludes nonnegative exact preimages and finite positive
  measures. It does not exclude signed preimages or approximate sequences
  whose mass or norm escapes control.

## Verification record

The two certificate scripts were replayed from this staged directory, and
their exit codes and runtime versions are recorded in `validation.json`.
The denominator JSON is compared with the original successful source
output. Captured text replays are included. `MANIFEST.json` records SHA-256
provenance for original and staged files; final Git blob hashes are checked
against GitHub after upload.

The commutator algebra and the delicate positive-measure domain argument
also received independent analytical reviews during this continuation.
The new deformation and trace formulas were reviewed by the primary agent.
Repository CI is observed separately and reported on the PR; it is not
represented as a check of these mathematical proofs.
