/**
 * @module imp-97453-route-m-sign-magnitude-omega-ladder-viz-data
 * @fileoverview imp-97453 -- VIZ DATA ONLY. Bakes TWO parallel per-omega status ladders for the Route M
 *   b/4 ceiling cohort into chart-ready literals:
 *
 *   1. SIGN ladder: T(b) = Sum_{e|b,e>=2} mu(e) J(e-1) < 0 (squarefree b). Elementary domination PROVES
 *      this through omega = 4 (imp-97333 for omega<=3, imp-97352 D_{p1}-monotonicity injection for
 *      omega=4) and hits a sharp Hall-deficiency wall at omega=5 (imp-97352 CROSSOVER). Separately,
 *      imp-97423 supplies a two-sided Binet bracket that CERTIFIES the omega=5 per-prime inequalities
 *      (A),(B) (the imp-97396 reduction) with strictly positive margin on every sampled family and
 *      reduces the trailing-prime freedom to a minimal config -- but the margin decays to 0+ as the
 *      leading prime grows, so omega=5 is REDUCED to a named uniform tail lemma, not proved outright.
 *
 *   2. MAGNITUDE ladder: the companion ceiling condition |Delta(b)| <= b/2. imp-97422 proves the exact
 *      reformulation Delta(b) = mu(b) b S(b) and shows both SIGN and MAGNITUDE collapse to the single
 *      divisor sum |T(b)| <= 1/4 = |(D_{p1}...D_{pk} h)(1)| (h = g/m). Given ONE hypothesis (MCM: every
 *      iterated multiplicative difference of h is >= 0), a peel-the-smallest-prime induction gives
 *      0 <= T(b) < 1/4 for EVERY omega -- so the ladder here is conditional-uniform, not per-omega
 *      independent, with numerical verification only through omega = 4 (squarefree b <= 2e5).
 *
 *   Values are copied literals from imp-97352 (IMP97352_CROSSOVER / IMP97352_VERDICT), imp-97423
 *   (IMP97423_VERDICT / IMP97423_RESIDUAL / IMP97423_CERTIFICATION), and imp-97422 (IMP97422_VERDICT /
 *   IMP97422_RESULTS) -- this module does NOT recompute J(n), D_{p1}(e), or the multiplicative
 *   differences of h. Pure frozen-object data, no imports, no self-executing assertions of its own,
 *   per the [[storage_precision_assertion_tolerance]] and [[no_heavy_imports_in_pages]] conventions.
 *
 *   @see imp-97352-route-m-sign-law-omega4-proof.js (elementary sign-law proof for omega=4; Hall wall at omega=5)
 *   @see imp-97423-route-m-sign-law-omega5-binet-two-sided-estimate.js (omega=5 certification; uniform tail-lemma residual)
 *   @see imp-97422-route-m-quarter-ceiling-omega4-multiplicative-difference-reduction.js (MAGNITUDE reduced to the MCM hypothesis)
 *   @see imp-97389-route-m-sign-law-omega-ladder-viz-data.js (prior SIGN-only ladder, superseded in scope by the two-ladder view here)
 *
 *   Ticket: imp-97453 (ux, sonnet-4-6, sonnet). Presentation of already-established results; adds no
 *   new Lambda bound. No refereed bound is changed. RH open. NO QED.
 */

// -- SIGN ladder: elementary domination through omega=4 (imp-97352), omega=5 reduced (imp-97423). --
export const IMP97453_SIGN_LADDER = Object.freeze([
  Object.freeze({
    omega: 3,
    status: 'proved',
    label: 'PROVED (elementary)',
    note: 'imp-97333: elementary domination, every level-2 positive dominated outright',
  }),
  Object.freeze({
    omega: 4,
    status: 'proved',
    label: 'PROVED (elementary)',
    note: 'imp-97352: D_{p1}-monotonicity injection gives a tight 3-vs-3 perfect matching, U(m) < 0',
  }),
  Object.freeze({
    omega: 5,
    status: 'reduced',
    label: 'REDUCED to a tail lemma',
    note:
      'imp-97352: domination method hits a Hall-deficiency wall (6 level-2 positives vs 4 level-1 negatives). ' +
      'imp-97423: a two-sided Binet bracket instead certifies the imp-97396 per-prime inequalities (A),(B) with ' +
      'strictly positive margin on every sampled family and reduces the trailing primes to a minimal config, but ' +
      'the margin decays like c/q1 -> 0+ as the smallest-of-the-tail prime grows -- residual is a uniform-(p1,q1) ' +
      'tail threshold Q0, not yet named',
  }),
  Object.freeze({
    omega: 6,
    status: 'open',
    label: 'OPEN',
    note: 'no domination or Binet-bracket reduction attempted beyond omega=5; IMP97333_SIGN_TAIL_SUBGAP',
  }),
]);

// -- MAGNITUDE ladder: |Delta(b)|<=b/2 collapses to |T(b)|<=1/4, conditional on the single MCM hypothesis. --
export const IMP97453_MAGNITUDE_LADDER = Object.freeze([
  Object.freeze({
    omega: 4,
    status: 'conditional-verified',
    label: 'CONDITIONAL (MCM verified to 2e5)',
    note:
      'imp-97422: both SIGN and MAGNITUDE collapse to |T(b)|<=1/4; given MCM the induction T(b)<=T(b/p_min)<=...' +
      '<=max_prime T(p)=0.24350<1/4 re-establishes MAGNITUDE; MCM (all iterated multiplicative differences of ' +
      'h=g/m are >=0) checked numerically on the whole omega=4 squarefree class to 2e5, not proved',
  }),
  Object.freeze({
    omega: 5,
    status: 'conditional-unverified',
    label: 'CONDITIONAL (MCM not checked here)',
    note: 'same induction applies given MCM, but this leaf verifies MCM only through omega=4; omega>=5 unswept',
  }),
]);

export const IMP97453_SUMMARY = Object.freeze({
  signProvedThrough: 4,
  signReducedAt: 5,
  signOpenFrom: 6,
  magnitudeHypothesis: 'MCM: every iterated multiplicative difference D_{p1}...D_{pj} h >= 0 (h = g/m)',
  magnitudeVerifiedThrough: 4,
  singleFunctionResidual: true,
  residualSubgap: 'IMP97333_SIGN_TAIL_SUBGAP (sign, omega>=5) and MCM (magnitude, omega>=4) -- two distinct open hypotheses',
  anyBoundMoved: false,
});

export const IMP97453_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Combined status view of the Route M b/4-ceiling cohort: the ' +
  'SIGN law T(b)<0 is PROVED elementarily through omega=4 (imp-97333/imp-97352) and REDUCED at omega=5 to a ' +
  'uniform tail lemma via a two-sided Binet bracket (imp-97423); the companion MAGNITUDE condition |Delta(b)|<=b/2 ' +
  'collapses to |T(b)|<=1/4 and is CONDITIONAL on a single hypothesis MCM, numerically verified only through ' +
  'omega=4 (imp-97422). No value here is re-derived; every entry is a literal copy from its source module. No ' +
  'bound on Lambda moves.';

export default Object.freeze({
  id: 'imp-97453-route-m-sign-magnitude-omega-ladder-viz-data',
  ticket: 'imp-97453',
  sources: [
    'imp-97352-route-m-sign-law-omega4-proof.js',
    'imp-97423-route-m-sign-law-omega5-binet-two-sided-estimate.js',
    'imp-97422-route-m-quarter-ceiling-omega4-multiplicative-difference-reduction.js',
  ],
  signLadder: IMP97453_SIGN_LADDER,
  magnitudeLadder: IMP97453_MAGNITUDE_LADDER,
  summary: IMP97453_SUMMARY,
  banner: IMP97453_HONEST_BANNER,
  anyBoundMoved: false,
});
