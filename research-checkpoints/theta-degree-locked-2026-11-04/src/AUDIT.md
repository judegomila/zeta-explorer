# Independent audit

Date: 2026-11-04. Verdict: PASS for both mathematical notes and the exact
algebra checker, subject to the explicitly retained limitations.

## Selected dilation note

The reviewer checked:

- The full-prefix lowering direction tP′−nP and exact monic-dilation
  defect identity.
- The virial identity, both second-curvature coefficient arrays, and the
  leading lower-degree coefficient estimate.
- The first-order commutator and failure of scalar-measure multiplication
  symmetry.
- The sign of L, the Cauchy–Schwarz mismatch lower bound, its zero
  denominator cases, and the one marked use of old Q positivity.
- The opposite nonintegrable simple-zero poles, their exact cancellation,
  and the application to every fixed polynomial through unbounded simple
  Xi zeros.
- The safe gamma-only split, radial identity, and the remaining arithmetic
  commutator. Its pointwise jet indefiniteness is not mislabeled as a sign
  theorem for selected integrals.

The exact-rational companion checker was run and passed at n=0,…,8 for
F=(t²−1)e^(−t²/2). It verifies signs and factors in the displayed finite
identities, not any actual-theta asymptotic.

The final setup explicitly introduces π_(n−1) only for n≥1 and states
B=U=0 at n=0, resolving the reviewer's minor notation correction.

## Degree-locked packet note

The reviewer checked:

- The fixed-parity polynomial definition and complete degree budget.
- Fejér normalization, the nonzero central value, the local sinc profile,
  and its first derivative.
- The complex theta upper bound and ξ(2+iT) lower bound, including the
  power T^(5/2) and the reciprocal Euler-product bound.
- The two-constants argument on a fixed slit disk. It is compatible with
  zeros and gives only a crude polynomial real-axis lower bound after
  removal of the exponential envelope.
- The exact tail-primitive source estimate. It correctly allows
  cancellation in Tp and keeps the natural exp(−cT) normalization.
- Exponential leakage outside a prescribed linear bulk, including exterior
  Chebyshev growth, derivative factors, and all nonnegative energy terms.
- The local kernel and carrier derivative bounds, subpower-width leakage,
  and the order of choices: fixed kernel power before n→∞, with the source
  lower-bound exponent independent of that power.
- The exact finite-n Hardy-Z ratio and necessary observability inequality.
  Its moving coefficient profiles are not replaced by their compact
  limits inside relative arithmetic integrals without domination.

The parent independently checked the kernel normalization, derivative
tails, source lower bound, degree constraints, and the observability
identity. No substantive gap was identified.

## Final carrier-pair sharpening

The added Section 6A was separately audited after the main packet proof.
The reviewer checked even parity and the reserved carrier degree; the
determinant A ell theta′+A′cos sin and uniform singular-value bounds; the
two energy inequalities; and individual carrier source lower bounds on
translated nonvanishing subintervals. Fixing gamma, L, and D before the
kernel power, then restricting beta as stated, keeps the lower-bound
exponents independent of that power. The enlarged exterior degree and
local tail bounds are accounted for.

The absorption from H_sum=o(X_sum) to N_n=o(D_n) is valid. The final
bound on D_n then correctly forces the weighted Hardy-Z derivative/mass
ratio in (6A.5) to diverge under the proposed uniform bulk-coercivity
hypothesis. This is a necessary condition, not a proof that the arithmetic
ratio diverges. No limiting-profile substitution or selected-endpoint
identification is introduced.

## Boundary of the audited conclusions

The dilation method gives exact selected identities and a lower bound,
not a small mismatch upper bound. The logarithmic-derivative split is
invalid as separated Lebesgue integrals. The safe split still needs new
correlated arithmetic control.

The explicit packets rigorously tie degree to height and test a uniform
bulk assertion. They do not establish the needed local arithmetic
inequality, do not falsify it, and are not identified with selected
endpoints. No conclusion about Δ_n positivity, selected U_n/Δ_n, the
sqrt(ρ_n) rate, or an all-degree signed-pivot/RH closure follows.

This is an independent AI-assisted mathematical audit, not a machine
formalization or external peer review.
