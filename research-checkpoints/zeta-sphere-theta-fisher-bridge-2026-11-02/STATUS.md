# Research status

Last integrated: 2026-11-02 UTC.

## Bottom line

The Riemann hypothesis remains unproved. The present program has rigorous
finite-order positivity results and exact signed decompositions, but it does not
have a degree-uniform estimate that transfers the information-theoretic gain to
the full signed coupling cost.

## Established within the frozen evidence

- The complete theta odd block through `H5`, together with the reviewed even
  block, is positive for every positive shift. This is a finite-order result,
  not an all-order theorem.
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

## Central open lemma

The current bridge would require an actual, source-specific lower-metric
innovation gain that uniformly dominates the regression mismatch/action and
every signed coupling cost as the degree grows. The Fisher inequalities above
do not, by themselves, pay that all-degree cost.

Equivalently in the CP62 matrix language, one needs a complete positive-time
coefficient map into the physical boundary form and a reserve-relative
`J8/J9` angular estimate, with all exceptional directions, inverse costs,
switching terms, and limiting/domain gates retained.

