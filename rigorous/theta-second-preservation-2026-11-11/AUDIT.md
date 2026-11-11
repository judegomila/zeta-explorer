# Proof and implementation audit

11 November 2026. This record distinguishes analytic implications,
rigorous finite computations, fixed dependencies, and open claims.

## Logical chain

1. The original pair $(C,\kappa)$ and its first canonical reduction
   belong to the full comparison class by fixed PRs #51–52.
2. Exact four-column Green/call identities express the two desired
   first-reduced source Wronskians as transformed determinants with
   original source columns $(B,J,P,H)$ and $(B,J,P,Q)$.
3. Both original fourth source Wronskians are negative near zero.
   This refutes the proposed pointwise-positive sufficient criterion.
4. Complete spatial certificates show that each source has exactly one
   simple crossing, oriented negative to positive.
5. A generalized Peano representation has a strictly positive kernel.
   Step-kernel composition, augmented source determinants, the
   five-column call identity, and an exact condensation identity prove
   that its ordered two-by-two minors are nonnegative.
6. The ratio inequality for this kernel propagates any positive initial
   transformed sign across the entire spatial interval.
7. Both first-reduced source origin limits are positive for every first
   anchor: a compact moment certificate and an analytic large-anchor
   Taylor bound cover the entire anchor axis.
8. Therefore the first-reduced higher source Wronskians are positive for
   every anchor and every positive spatial point.
9. The independent two-anchor origin theorem proves $J_2''(0)>0$ for all
   positive first and second anchors, including equal anchors.
10. The PR #52 comparison supplies the second pair's two convexities;
    the origin slope and convexity imply global $J_2'>0$. The basic
    signs already follow from the first pair's full class. Thus the
    second pair is in the full class.
11. The exact count is full at levels 0,1,2; basic at level 3; positive
    at level 4. Four Schur pivots and a positive last response give
    strict five-node Pick positivity. This does not give a sixth node.

## New interval coverage

| Gate | Domain | Closed cells | Precision |
| --- | --- | ---: | ---: |
| Explicit negative source obstruction | $0\le t^2\le1/256$ | 128 | 320 bits |
| Strict increase of each normalized source | $0\le t^2\le9/256$ | 256 | 512 bits |
| Positive spatial source core | $3/16\le t\le4$ | 1,980 | 512 bits |
| One-variable matrix criterion for second-origin slope | $0\le(a/200)^2\le1/4$ | 2,048 | 384 bits |
| Both first-source origin limits | $0\le(a/200)^2\le1/4$ | 4,096 | 384 bits |
| Global twelfth theta derivative, compact part | $0\le t\le4$ | 4,096 | 256 bits |

Total: **12,604 new interval cells**. The runner additionally replays
4,096 cells in the fixed PR #52 sixth-derivative certificate. Every
unbounded region is covered by a separate analytic estimate with
explicit constants; no finite grid is extended by inference.

## Error and normalization checks

- Theta jet truncations include a proved Gaussian geometric tail. Even
  Taylor models include Cauchy remainders for every derivative actually
  used, including order nine in the single-crossing certificate.
- The spatial parity factors are $64t^6$ for the three-source tests
  and $1024t^{10}$ for the four-source tests. Their signs and exact
  powers are independently audited.
- The derivative of the five-column Wronskian uses row orders
  $0,1,2,3,5$. Derivatives of artificial interval-error coefficients
  are never substituted for actual derivative bounds.
- Full interval-polynomial products are retained. Shared-coordinate
  cancellations are performed algebraically before interval evaluation.
- Backward integration of $C$ uses absolute remainder bounds on each
  half-cell and full cell. An unknown odd remainder is not canceled.
- All 602 compact-anchor moment integrals are recomputed. Finite
  quadrature, omitted theta terms, spatial tails, and omitted positive
  moment series are separately enclosed. No diagnostic file is read.
- The exact identity $h=o(0)/K$ and a direct series for
  $(o-o(0))/x$ remove the anchor-zero factor in $D_H$ before interval
  evaluation. No interval constant is divided by an interval touching
  zero.
- The large-anchor source-origin proof uses the global bound
  $|\kappa^{(12)}|/\kappa(0)<150000000$, an integrated remainder
  $4096M(d+12)/a^{14}$, and the correct opposite error directions for
  the $N$ coefficients of $D_H$ and $D_P$.
- The permitted tail strip $101\le d\le1+3a^2/200$ follows from
  certified $1<p(100)<1.5$, $p'>0$, and the proved $ap'<1/2$.
  Four shifted polynomials, affine in $d$, have strictly positive
  coefficient balls. The endpoint interpolation covers the entire
  strip, not just its corners.
- Positive definite derivative matrices integrate to a positive
  definite divided-difference matrix. This handles unequal, coincident,
  and compact/tail-crossing anchor pairs consistently.

## Analytic review points

The proof of compensation does not assume a sign for the source at
every point. It proves the Peano kernel's two-by-two property and uses
the source's unique crossing plus a separately proved initial transformed
sign. Each of these premises is necessary to the stated argument.

Higher differentiation of the call kernel creates point-mass terms.
The higher transfer proof instead differentiates the already integrated
identity $(Tq)''=m(q-Eq)$. Its confluent source determinant and row
ordering account for these terms. The sign of the relevant kernel
minor is computed explicitly.

For actual theta, the generalized-coordinate ratios have regular even
jets at zero. Their growth at infinity is at most polynomial in $t$
and $e^t$, while the fixed-anchor tilted theta density decays
double-exponentially. The compensation note checks the endpoint and
Fubini conditions rather than assuming finite support.

Reciprocal canonical swaps use exact identities and diagonal
congruence. Strict positivity is asserted for distinct positive real
nodes; a matrix with duplicated nodes would be singular and is not
covered by that strict statement.

## What executable checks establish

The new exact audits cover derivative and quotient identities, column
orientations, row reduction, a nonconstant-prefix condensation identity,
the explicit Peano kernel and every ordering of two knots, a signed
source example, even-coordinate factors, Laplace coefficients, and
tail polynomial margins. The runner records their counts and complete
gate status in `checks_replay.json`.

Passing scripts does not by itself prove the integral theorems. Those
arguments are in the accompanying notes and were independently
reviewed within this session. The work has not been externally peer
reviewed or translated into a formal proof assistant.

The integrated replay passed all gates, recording 201 new exact checks,
12,604 new interval cells, 602 fresh moments, and 4,096 replayed
dependency cells. Separate internal reviews challenged the Peano
kernel's determinant orientation and regularity, its theta endpoint
integrability, both source-origin certificates, the two-anchor matrix
criterion, and the combined strict five-node count. No blocking issue
was found. A clarification about the first canceled pair's decay and
integrability was added to the global proof.

## Scope of the result

The completed checkpoint claims second canonical preservation, strict
five-node real Pick positivity, and five-rate energy positivity. It
does not claim invariance at every reduction, positivity at arbitrary
matrix order, density of the tested finite-rate class with controlled
energy, a complex-plane zero exclusion theorem, or RH.

The underlying sphere/torus visualization is not used as an analytic
premise. The new implications concern the actual theta transform and
its canceled kernels.
