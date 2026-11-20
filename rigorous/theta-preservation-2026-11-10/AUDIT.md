# Proof audit and scope

Research continuation, 10 November 2026.

## Claims and their status

| Claim | Status and proof input |
| --- | --- |
| Second-order comparison for canceled Green ratios | Proved by an explicit derivative-kernel determinant and continuous Cauchy--Binet identity |
| Both additional original-theta source Wronskians are positive for every t>0 | Proved by origin/core interval certificates and an analytic full-tail estimate |
| J_new''(0)>0 at every positive anchor | Proved by two analytic anchor regions with rigorously certified constants |
| The actual first canonical reduced pair satisfies the full comparison class | Proved by combining those results with PR #51 |
| Four-node real Pick and four-rate energy positivity without a finite-zero theorem | Proved by three strict Schur reductions and the fixed exact energy identity |
| The old comparison class is preserved for every positive kernel pair | Disproved by the explicit Gaussian/rational counterexample at anchor 10 |
| Arbitrary-depth actual-theta preservation, fifth stage, or RH | Unproved |

## Fixed inputs

The proof starts from the actual theta kernel and the strict ratio
theorem in PR #51, fixed commit
`afdac28948ab084e80214c31ef72c9520d943760`. That checkpoint uses
classical theta evenness, positivity, decay, and squared-variable
strict log-concavity. Its exact first canceled Green identities and
positive first pair are inherited from fixed preceding checkpoints.

The new proof uses no finite-height zero verification, zero ordinates,
RH assumption, or positive spectral-measure assumption. Its theta
integrals are direct kernel integrals with explicit error bounds.
PR #50's different proof of four-node positivity remains a separate
theorem; the current argument does not depend on its finite-zero input.

## Comparison theorem: points requiring care

The transformed derivative kernel is computed explicitly. Its two-
column minors have nonnegative signs, and the three-column minor is
strictly positive on s1<y<s2<s3. Other ordered regions have zero
three-column determinant. No unsupported all-order total positivity
claim is inserted.

The ordered-simplex Cauchy--Binet formula has no extra factorial.
Strictness follows from a positive-measure region where both
determinants are positive. Source quotients are unchanged under the
hyperbolic coordinate change; the derivative-source Wronskian gains
the positive factor (dt/dy)^6. Actual theta supplies the absolute
integrability required for differentiation and Fubini.

The two source signs prove the new convexities. They do not alone
prove J_new'>0. That additional sign uses the separate all-anchor
origin theorem and increasing dJ_new/dB_new. The proof does not
divide by a possibly zero second derivative at the origin.

## Spatial source certificates

- At the origin, use u=t^2 and exact factor 64t^6. Degree-24
  coefficient enclosures include the full omitted theta series and
  Cauchy bounds for Taylor derivatives through order six. Independent
  interval remainder coefficients are valid pointwise; they are not
  differentiated as if they were constant actual errors.
- The 128 origin cells and 1,984 core cells cover all 0<t<=4. Full
  polynomial products are retained. The core uses order 14 and theta
  jets through order 20, with explicit geometric tails.
- C endpoints are rigorously integrated, and C propagates backwards
  with absolute half-cell errors and their full-cell sum. No unknown
  odd remainder is canceled. The direct/propagated endpoint overlap
  is an extra consistency check, not a replacement for the bounds.
- The tail proof controls every omitted theta term and derivatives
  through six. The first-mode H-Wronskian has a negative coefficient
  of its integrated ratio; the proof correctly uses an upper bound
  H_3+R/r_0 for that ratio. Rational margins exceed one, and the common
  full-series perturbation is below 2^(-116), yielding margins above
  one half for all t>=4.

The reported conservative decimal bounds are exact rationals below
the computed outward lower bounds. Positivity gates test enclosures,
not midpoints, samples, or precision agreement.

## Origin theorem: no anchor sampling

For 0<a<=20, monotonicity of n_a/C bounds its origin curvature, and
monotonicity of p(a) reduces the anchor bound to p(20). For a>=20,
the global sixth-derivative estimate gives a Taylor lower bound valid
on the entire spatial half-line. Its positive Laplace integral is
computed algebraically. A smaller polynomial has all positive exact
coefficients after shifting d by 9/5 and (a/2)^2 by 100.

The global sixth derivative is bounded on [0,4] by 4,096 interval
cells and beyond 4 by an explicit analytic majorant; evenness covers
negative t. The constants p(1), p(20), C(0), c, and k_4 are enclosed
with both theta and spatial errors. The statement is for every a>0;
no finite list of anchors is used to infer it.

## Counterexample: precise scope

The input pair is u=exp(-t^2)/sqrt(t^2+5), v=exp(-t^2). Its ratios
are derived from these compatible kernels; H,B,J are not chosen
independently. Exact positive-coefficient polynomials verify every
input class sign globally. Two branch-aware rigorous integrals with
explicit Gaussian tails give a strictly negative origin coefficient
of the new H convexity. Continuity gives failure for sufficiently
small positive t at the explicit anchor a=10.

This pair has every required exponential transform moment and rapidly
decreasing derivatives. It does not satisfy u=C_v. It refutes the
general proposed class, not the actual theta theorem or RH. Its new
source H-Wronskian is explicitly negative near zero, demonstrating
that the stronger source criterion excludes this obstruction.

## Executable verification and review

The packaged runner recomputes:

| Gate | Recorded checks |
| --- | --- |
| Comparison, tail, reciprocity, and obstruction identities | 47 exact checks |
| Cleared source-Wronskian identities | Four exact checks |
| Compact source signs | 128 origin and 1,984 core interval cells |
| Origin constants and global sixth derivative | Rigorous integrals, exact rational margins, nine positive shifted coefficients, and 4,096 interval cells |
| General-class counterexample | Nine exact checks and two rigorous integral enclosures |
| Auxiliary large-anchor theorem | 12 exact checks plus its analytic remainder proof |

Python 3.12.14, SymPy 1.14.0, and python-flint 0.9.0 were used.
Source Wronskians and the counterexample run at 256-bit precision;
the all-anchor origin constant certificate runs at 224 bits. Pinned
requirements and complete captured outputs are included. The runner
rejects optimized Python execution that disables assertions.

Independent internal review checked the compact determinant models,
the transfer/tail proof, the all-anchor origin proof, and the assembled
four-node implication. Root review independently checked the
counterexample input polynomials, origin recurrence, transform
normalization, branch handling, and integral tails. A missing plus
sign in the displayed Taylor remainder was corrected during review.

These are computer-assisted mathematical arguments with stated
analytic components. They rely on the arithmetic libraries' enclosure
contracts. They are not formal proof-assistant verification, external
peer review, or a literature-novelty claim. Existing repository CI
checks its configured application/research gates; this mathematical
runner is executed separately and is not silently attributed to CI.

## Remaining research boundary

The first actual reduced pair satisfies the old comparison class, but
the counterexample proves that class is insufficient for universal
induction. The new source-Wronskian hypotheses and the needed origin
control have not been proved for all subsequent actual reduced pairs.
The present finite-stage theorem cannot be promoted to order five or
all orders without additional work.

Only the new research lane and one decision record are added, based
on main at `942ba1760c4ef54a519750ab91c37a661c31e0ce`. Prior
research files, application code, and workflows are unchanged.
