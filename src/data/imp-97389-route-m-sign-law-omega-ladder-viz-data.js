/**
 * @module imp-97389-route-m-sign-law-omega-ladder-viz-data
 * @fileoverview imp-97389 -- VIZ DATA ONLY. Bakes the Route M sign-law omega-class ladder
 *   T(b) = Sum_{e|b,e>=2} mu(e) J(e-1) < 0 (squarefree b) established by imp-97333 (omega <= 3,
 *   elementary domination) and imp-97352 (omega = 4, D_{p1}-monotonicity injection; omega = 5 sharp
 *   method wall) into a single chart-ready per-omega status ladder.
 *
 *   The domination method's covering-injection count (imp-97352 CROSSOVER) is the load-bearing
 *   number: with n = omega - 1 primes past the smallest, there are C(n,2) level-2 positive peel
 *   terms and only n level-1 negative terms available to dominate them, so the method succeeds iff
 *   C(n,2) <= n, i.e. omega <= 4, and fails first at omega = 5 (C(4,2)=6 > 4, Hall deficiency 2).
 *   omega = 0 (b=1) is vacuous: the statement T(b) < 0 is defined only for squarefree b >= 2.
 *
 *   Values are copied literals from imp-97333's IMP97333_SIGN_LAW_OMEGA3 / IMP97333_VERDICT and
 *   imp-97352's IMP97352_OMEGA4_PROOF / IMP97352_CROSSOVER -- this module does NOT recompute J(n) or
 *   D_{p1}(e). Pure frozen-object data, no imports, no self-executing assertions of its own, per the
 *   [[storage_precision_assertion_tolerance]] and [[no_heavy_imports_in_pages]] conventions.
 *
 *   @see imp-97333-route-m-sign-law-proof-attempt.js (elementary proof for omega <= 3; positive-part certificate; obstruction)
 *   @see imp-97352-route-m-sign-law-omega4-proof.js (D_{p1}-monotonicity injection proof for omega = 4; the omega=5 Hall-deficiency wall)
 *
 *   Ticket: imp-97389 (ux, low). Presentation of already-established results; adds no new Lambda
 *   bound. No refereed bound is changed. RH open. NO QED.
 */

// -- baked per-omega ladder: n = omega-1 primes past the smallest; level-2 positives = C(n,2);
//    level-1 negatives = n; covering injection exists iff C(n,2) <= n (imp-97352 CROSSOVER).
export const IMP97389_OMEGA_LADDER = Object.freeze([
  Object.freeze({
    omega: 0,
    status: 'vacuous',
    n: null,
    level2Positives: null,
    level1Negatives: null,
    margin: null,
    method: 'b = 1: no divisor e >= 2 exists; T(b) < 0 is stated only for squarefree b >= 2 (imp-97309/imp-97333), so omega = 0 is out of scope, not a proved case',
  }),
  Object.freeze({
    omega: 1,
    status: 'proved',
    n: 0,
    level2Positives: 0,
    level1Negatives: 0,
    margin: 0,
    method: 'imp-97333 RESULT 2: T(b) = -J(p1-1) < 0 (single negative term, no positives to dominate)',
  }),
  Object.freeze({
    omega: 2,
    status: 'proved',
    n: 1,
    level2Positives: 0,
    level1Negatives: 1,
    margin: 1,
    method: 'imp-97333 RESULT 2: T(b) = -J(p1-1) - D_{p1}(p2) < 0 (both terms negative)',
  }),
  Object.freeze({
    omega: 3,
    status: 'proved',
    n: 2,
    level2Positives: 1,
    level1Negatives: 2,
    margin: 1,
    method: 'imp-97333 RESULT 2: the lone positive D_{p1}(p2 p3) is dominated outright by the leading -J(p1-1)',
  }),
  Object.freeze({
    omega: 4,
    status: 'proved',
    n: 3,
    level2Positives: 3,
    level1Negatives: 3,
    margin: 0,
    method: 'imp-97352 RESULT: D_{p1}-monotonicity gives a TIGHT 3-vs-3 perfect matching (complete bipartite graph); U(m) < 0 without even needing the leading -J(p1-1) term',
  }),
  Object.freeze({
    omega: 5,
    status: 'boundary',
    n: 4,
    level2Positives: 6,
    level1Negatives: 4,
    margin: -2,
    method: 'imp-97352 CROSSOVER: Hall deficiency 2 (6 level-2 positives, only 4 level-1 negatives); pure sign-and-order domination fails; reduces to IMP97333_SIGN_TAIL_SUBGAP (weighted domination, still open)',
  }),
]);

export const IMP97389_LADDER_SUMMARY = Object.freeze({
  provedThrough: 4,
  sharpWallAt: 5,
  countingRule: 'covering injection exists iff C(omega-1, 2) <= omega-1 -- true for omega <= 4, first false at omega = 5',
  residualSubgap: 'IMP97333_SIGN_TAIL_SUBGAP',
  anyBoundMoved: false,
});

export default Object.freeze({
  id: 'imp-97389-route-m-sign-law-omega-ladder-viz-data',
  ticket: 'imp-97389',
  sources: ['imp-97333-route-m-sign-law-proof-attempt.js', 'imp-97352-route-m-sign-law-omega4-proof.js'],
  omegaLadder: IMP97389_OMEGA_LADDER,
  summary: IMP97389_LADDER_SUMMARY,
  suppliesUniformRemainderBound: false,
  anyBoundMoved: false,
});
