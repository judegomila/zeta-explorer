# Research status

Last integrated: 2026-11-03 UTC.

## Bottom line

The Riemann hypothesis remains unproved. The present program has rigorous
finite-order positivity results and exact signed decompositions, but it does not
have a degree-uniform estimate that transfers the information-theoretic gain to
the full signed coupling cost.

## Established within the frozen evidence

- The complete theta `H6` test is positive for every positive shift and at the
  normalized endpoint. On `0 <= a <= 1/2`, the newly replayed even `4 x 4`
  polynomial-basis Gram has reserve `I/60`; it combines with the previously
  reviewed odd `H5` block. The outer shifts use the standard zero-strip and
  paired canonical-product argument. This is finite-order, not all-order.
- The full `10 x 10` odd moment block with channels `1,3,...,19` is positive at
  normalized shift `a=0`. The proof uses the actual `H=1/16` core/tail split
  and complete complement coupling. It is not the full `H19` hierarchy.
- Universal cumulative-tail positivity is false. At `H=1`,
  `t=7005081715/1000000`, and `a=1/10000`, the normalized full-theta tail has a
  rigorously negative Fourier value. This does not contradict positivity of
  the complete kernel or RH.
- CP62 extends that negative tail to an explicit tiny positive-heat rectangle,
  proves simultaneous positivity of the complete kernel there, and shows exact
  signed core/tail compensation. A correction through finitely many fixed
  linear functionals cannot make the entire truncated tail nonnegative.
- Common- and matrix-anchor identities preserve all signed pieces and expose
  covariance/innovation gains. At the already certified finite order they
  repair the signed residual. They do not yet give a degree-uniform physical
  estimate.

## Reviewed information-relaxation results in v18

The v18 source freeze contains independently reviewed derivations of:

- a bridge Fisher-information bound `<= 2/17`;
- a regularized endpoint bound `<= 4/867`;
- orbit Fisher dissipation `I' <= -14 I`;
- heat smoothing preserves the relevant zero evolution while adding a
  removable Gaussian reserve;
- Newman forcing retains a signed contribution.

These statements are hash-bound under `evidence/v18-curated/`. They remain
metric-specific ingredients: none alone controls the growing high-jet
covariance, regression mismatch, inverse-block feedback, or signed derivative
forcing in the actual complete bridge metric.

## Finite paid mechanisms added in v19

- At the existing odd-19 endpoint, a 1000-cell interval evaluation gives
  innovation gain `> 0.000252203292259`, coefficient-motion cost
  `< 0.000091900511724`, and surplus `> 0.000160302780535`. It certifies the
  finite odd rungs `3,...,19` at normalized `a=0`; the target moments are
  inherited, and the nonzero-shift action probes remain numerical.
- At degree `2`, `a=1/4`, and `lambda in [0,1]`, the paid Newman certificate
  gives terminal reserve `> 3.6442681947430` and integrated paired cost
  `< 3.1520578244214` before the common `pi/2` factor. The physical Schur lower
  bound is `> 0.773162230542629`.
- Signed lower-block orthogonality gives an exact forcing identity, but its
  opposite-parity energy sign and the uniform higher-degree comparison remain
  unpaid.

These are mechanism validations at fixed finite order. They do not establish a
new all-order positivity theorem or prove RH.

## Consolidated continuation through v26

- At degree `5`, `a=1/4`, and `lambda in [0,1]`, a legal old-feature gauge
  with zero signed integral gives a certified Newman payment. Before the common
  `pi/2` factor, the terminal Schur value is `> 375589.1213813384`, the gauged
  budget is `< 322853.8114762700`, and the retained reserve is
  `> 52735.3099050647`. This is one fixed finite mechanism; the ungauged
  sufficient envelope failed numerically, not the target.
- In the odd same-parity degree-`9` channel at `a=1/4`, the endpoint old Grams
  are positive at `lambda=0,1` and the regional endpoint minimum retains
  `> 0.0031365403907762` after division by `10^16` and omission of `pi/2`.
  This is not mixed-parity `H9`, interior-path positivity, or a new all-shift
  hierarchy theorem.
- For every finite polynomial degree and raised spatial moment, an
  actual-theta theorem gives explicit superexponential confinement in the
  positive physical parent norm. It is not a signed Schur lower bound and does
  not pay inverse feedback or the modular defect.
- Exact block transport retains the signed local terms until their joint
  inverse feedback is assembled. Modular reflection then reduces one
  normalized endpoint route to exactly one negative direction, but does not
  pay it.
- An auxiliary positive-regression remainder satisfies `E'(a)>0` at every
  finite degree. The canonical actual next source further cancels the separate
  inverse-feedback estimate, leaving one correlated current-prefix inequality.
  That inequality is **unproved**. A conditional obstruction rules out proving
  it with a degree-independent mixed-metric spectral gap.

All floating scans and probes in the continuation remain numerical
diagnostics. The highest all-shift hierarchy theorem remains `H6`.

## Scalar, trace, and arithmetic reductions through v30

- A separate interval certificate proves the even channels `0,2,4,6,8` on
  `0 <= a <= 1/2`, with polynomial-basis Gram reserve `I/100`; the standard
  outer-shift argument extends strict positivity, not that reserve. The odd
  channels `1,3,5,7` are not supplied, so this is **not** full `H8` and `H6`
  remains the highest complete all-shift hierarchy theorem.
- Exact boundary-square and regression-trace identities sign the boundary
  correction and the highest canonical regression coefficient. They do not
  sign `tr R`, the lower source components, or the complete signed quadratic.
  A smooth non-theta counterfamily shows that a positive finite prefix plus
  arbitrarily strong log-curvature cannot, by itself, force `tr R >= 0`.
- The complete-theta scalar resolvent `J(d)` is strictly positive, and the
  rational square completion, adaptive-resolvent inequality, and correlated
  conditional-mean formula are exact reviewed reductions. Scalar positivity
  is not higher rational-Gram positivity; the uniform adaptive payment remains
  unproved.
- Exact divisor grouping reduces the complete-theta correlated contact to
  arithmetic summands. For the even ladder, an explicit degree-only `O(N^2)`
  cutoff leaves a strictly positive infinite remainder. For the adjacent odd
  ladder the high-index remainder has the opposite sign, but its absolute size
  has an explicit exponentially decaying payment bound.
- These tail results leave a finite signed arithmetic core. No new pivot was
  computed in v29 or v30, and no uniform finite-core inequality was proved.
  The v29 low-degree calculations reuse previously certified pivots; the v30
  replays check elementary constants and envelopes rather than ladder signs.

The v27--v30 evidence is an append-only public derivative of the 968-payload
v30 source snapshot. It preserves all 839 v26 payloads. Its public lane has 84
unique authored payloads, four exact publication manifests, one repository
README, and six documented privacy-only text redactions; private or acquired
source captures are not committed.

## Central open lemma

The current bridge would require an actual, source-specific lower-metric
innovation gain that uniformly dominates the regression mismatch/action and
every signed coupling cost as the degree grows. The Fisher inequalities above
do not, by themselves, pay that all-degree cost.

For the narrower normalized-endpoint modular route, assuming a positive
current prefix, the v26 canonical construction sharpens the sufficient target
to

`4 y^T c_W' - 2 gamma^T H gamma >= kappa_0 M_N`.

Every term is determined by the current prefix, but its correlated sign and
size are not proved uniformly. This is the remaining criterion for that route,
not a global equivalence to all-shift closure.

A second normalized-endpoint reduction is now available in arithmetic form.
For the even ladder the infinite tail beyond an explicit `O(N^2)` cutoff is
positive, so a positive exact finite partial sum would certify the contact. For
the odd ladder the finite partial sum must exceed the explicit negative-tail
payment, not merely be positive. Proving these finite signed-core inequalities
uniformly in degree is open; the reduction is not itself a pivot theorem or an
all-shift closure theorem.

Equivalently in the CP62 matrix language, one needs a complete positive-time
coefficient map into the physical boundary form and a reserve-relative
`J8/J9` angular estimate, with all exceptional directions, inverse costs,
switching terms, and limiting/domain gates retained.

