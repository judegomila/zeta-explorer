/**
 * imp-2692 — C_H RH-hardness wall: one canonical NEGATIVE certification.
 *
 * @module imp-2692-c-h-wall-certification
 * @proofSection S7
 *
 * PURPOSE
 *   C_H (the Holder-1/2 modulus constant C_shock * C_Lip / 4 of the E_coll bridge
 *   term) is RANKED #1 in full-route-map-2026-06-19.js, and its discharge is
 *   REFUTED. But the evidence is scattered across four modules:
 *     - polymath15-lemma52-shock-holder.js   (imp-2640, imp-2642)
 *     - imp-2633-l-cond-constant-discharge.js (L_cond context)
 *     - imp-2662-clip-theta-endpoint-route.js (the surviving non-Gronwall escape)
 *   This module CONSOLIDATES the four load-bearing facts into a single citable
 *   theorem-STATUS record plus one assertion array that any future
 *   "C_H discharged" edit MUST defeat before it may claim a finite-N beat.
 *
 *   This is a certified NEGATIVE / WALL record. It asserts NO beat. It reaffirms
 *   Platt-Trudgian Lambda <= 0.2 as rigorous SOTA. It does NOT prove RH-hardness
 *   in any complexity-theoretic sense; "wall" means the imp-366 Gronwall route to
 *   discharging C_H is closed and only one strictly-smaller sub-gap survives.
 *
 * THE FOUR CONSOLIDATED PILLARS
 *   (a) DIVERGENT GRONWALL INTEGRAL. The only available bound on the gap-Lipschitz
 *       constant C_Lip is the backward-flow Jacobian ||DM|| <= 2/g(s)^2. Under the
 *       quadratic-tangency law g(s)^2 = g0^2 - 8 s (from d(g^2)/ds = -8), the
 *       Gronwall exponent is
 *           int_0^{t_c} 2/g(s)^2 ds = (1/4) log( g0^2 / (g0^2 - 8 t_c) ),
 *       which diverges logarithmically as t_c -> g0^2/8 (the collision, g -> 0).
 *   (b) N-NON-UNIFORM E-FOLD. At the microscopic collision scale g_min ~ sqrt(2pi/N)
 *       the e-fold count 2 S / y_star^2 = S * N / pi GROWS with N (imp-2640 /
 *       imp-2520 Negative Finding 1). So even a fixed-t_c truncation of (a) is not
 *       N-uniform: C_Lip, hence C_H, is not a finite N-independent constant here.
 *   (c) POSITIVE-REMAINDER COUNTEREXAMPLE. 1/8 = 1/C_QUADRATIC_TANGENCY is the EXACT
 *       leading-order gap-to-time coefficient (rigorous for remainder R = 0), NOT a
 *       proven upper bound on C_shock * C_Lip / 4. With a positive O(1) neighbour
 *       remainder R > 0 the collision is delayed and the effective coefficient
 *       |tau_c|/g0^2 EXCEEDS 1/8 (imp-2642). So C_H = 1/8 is an optimistic estimate,
 *       not a supremum over configurations.
 *   (d) SURVIVING SUB-GAP. The ONLY non-Gronwall escape still open is the imp-2662
 *       A1 Theta-trap endpoint route, which reduces C_Lip to a single strictly
 *       smaller sub-gap: an N-uniform W_1-modulus C_Theta on the trapped functional
 *           |Theta_eff(mu_1) - Theta_eff(mu_2)| <= C_Theta * W_1(mu_1, mu_2).
 *       Status OPEN. (imp-2680 found the Theta-trap W_1 modulus GROWS ~N, a NEGATIVE
 *       that retires the endpoint route as written but leaves C_Theta itself open.)
 *
 * No false QED: the all-ones-ansatz E(N) ~ 0.187 < 0.2 at N*=1e4 is an ESTIMATE
 * contingent on the unproven placeholders C_T = C_F = C_H = 1, not a theorem.
 *
 * @see polymath15-lemma52-shock-holder.js (imp-2640, imp-2642)
 * @see imp-2662-clip-theta-endpoint-route.js (surviving sub-gap)
 * @see imp-2701-ch-rigor-lock.js (build-time tripwire on the rigor flag)
 * @see full-route-map-2026-06-19.js (C_H ranked #1)
 */

import {
  C_H_DISCHARGE_ATTEMPT_IMP2640,
  C_H_QUADRATIC_TANGENCY_UPPER_BOUND_CHECK_IMP2642,
} from './polymath15-lemma52-shock-holder.js';
import { IMP_2662_CLIP_THETA_ENDPOINT } from './imp-2662-clip-theta-endpoint-route.js';

const C_QUADRATIC_TANGENCY = 8; // d(g^2)/ds = -8 (imp366-quadratic-tangency-constant)
const G_MIN_STAR = 0.037698; // N*=1e4 minimal pair (tc-part-vs-mf-linchpin-finding.js)
const N_STAR = 10000;

// (a) Closed-form Gronwall collision integral under the quadratic-tangency law
//     g(s)^2 = g0^2 - C_QUADRATIC_TANGENCY * s. Diverges as tc -> g0^2 / 8.
function gronwallCollisionIntegral(g0, tc) {
  const g0Sq = g0 * g0;
  const denom = g0Sq - C_QUADRATIC_TANGENCY * tc;
  if (!(denom > 0)) return Infinity; // at/after collision the exponent is +Infinity
  return 0.25 * Math.log(g0Sq / denom);
}

const TC_STAR = (G_MIN_STAR * G_MIN_STAR) / C_QUADRATIC_TANGENCY; // collision time

// Divergence ladder: fractions of the collision time approaching tc_star.
const DIVERGENCE_LADDER = [0.9, 0.99, 0.999, 0.9999, 0.99999].map((frac) => ({
  fractionOfCollision: frac,
  tc: frac * TC_STAR,
  gronwallExponent: gronwallCollisionIntegral(G_MIN_STAR, frac * TC_STAR),
}));

export const IMP_2692_C_H_WALL = {
  ticket: 'imp-2692',
  proofSection: 'S7',
  title:
    'Canonical NEGATIVE certification of the C_H Holder-modulus wall: the imp-366 ' +
    'Gronwall discharge route is closed; only the imp-2662 C_Theta sub-gap survives.',
  verdict:
    'CERTIFIED NEGATIVE / WALL. C_H = C_shock * C_Lip / 4 is NOT a finite N-uniform ' +
    'constant by the imp-366 Gronwall flow-Jacobian route: the collision integral ' +
    'diverges (pillar a), the microscopic e-fold grows ~N (pillar b), and 1/8 is a ' +
    'leading-order estimate not an upper bound (pillar c). The ONLY surviving ' +
    'non-Gronwall escape is the imp-2662 C_Theta sub-gap (pillar d), genuinely OPEN. ' +
    'NO rigorous beat claimed. Platt-Trudgian Lambda <= 0.2 stays SOTA.',
  rankedNumberOneObstruction: true,
  // (a) divergent integral with explicit closed form and a divergence ladder.
  pillarA_divergentIntegral: {
    quadraticTangencyLaw: 'g(s)^2 = g0^2 - 8 s  (from d(g^2)/ds = -8)',
    closedForm: 'int_0^{tc} 2/g(s)^2 ds = (1/4) log( g0^2 / (g0^2 - 8 tc) )',
    g0: G_MIN_STAR,
    collisionTime: TC_STAR,
    divergesAtCollision: true,
    divergenceLadder: DIVERGENCE_LADDER,
  },
  // (b) imp-2640 microscopic e-fold S*N/pi (consumed from the source module).
  pillarB_nNonUniformEfold: {
    nStar: N_STAR,
    yMicro: C_H_DISCHARGE_ATTEMPT_IMP2640.yMicro, // sqrt(2 pi / N)
    efoldMicro: C_H_DISCHARGE_ATTEMPT_IMP2640.gronwallEfoldMicro, // = tc * N / pi
    growsWithN: true,
    note: 'e-fold count 2 S / y_star^2 = S * N / pi grows with N (imp-2520 Negative Finding 1).',
  },
  // (c) imp-2642 positive-remainder counterexample (consumed from the source module).
  pillarC_positiveRemainderCounterexample: {
    cHCandidate: C_H_QUADRATIC_TANGENCY_UPPER_BOUND_CHECK_IMP2642.stressTest.C_H_CANDIDATE, // 1/8
    coeffNoRemainder: C_H_QUADRATIC_TANGENCY_UPPER_BOUND_CHECK_IMP2642.stressTest.coeffNoRemainder,
    coeffPositiveRemainder:
      C_H_QUADRATIC_TANGENCY_UPPER_BOUND_CHECK_IMP2642.stressTest.coeffPositiveRemainder,
    upperBoundViolated: C_H_QUADRATIC_TANGENCY_UPPER_BOUND_CHECK_IMP2642.stressTest.upperBoundViolated,
    isRigorousUpperBound: C_H_QUADRATIC_TANGENCY_UPPER_BOUND_CHECK_IMP2642.isRigorousUpperBound, // false
  },
  // (d) imp-2662 surviving non-Gronwall sub-gap (consumed from the source module).
  pillarD_survivingSubGap: {
    name: IMP_2662_CLIP_THETA_ENDPOINT.residualSubGap.name,
    statement: IMP_2662_CLIP_THETA_ENDPOINT.residualSubGap.statement,
    status: IMP_2662_CLIP_THETA_ENDPOINT.residualSubGap.status,
    isOnlySurvivingEscape: true,
  },
  honestCaveat:
    'This is a status record, not a hardness proof. "Wall" means the imp-366 Gronwall ' +
    'route to C_H is closed and only the imp-2662 C_Theta sub-gap survives. A non-Gronwall ' +
    'microscopic gap-stability modulus valid up to the collision time would reopen the route. ' +
    'Until then C_H is unproven and Platt-Trudgian Lambda <= 0.2 remains rigorous SOTA.',
};

// One assertion array any future "C_H discharged" edit must defeat. All pass
// while C_H is unproven; flipping any to fail signals a re-introduced overclaim.
export const IMP_2692_ASSERTIONS = [
  {
    name: 'imp2692-gronwall-integral-diverges-at-collision',
    pass: !Number.isFinite(gronwallCollisionIntegral(G_MIN_STAR, TC_STAR)),
  },
  {
    name: 'imp2692-gronwall-exponent-monotone-increasing-toward-collision',
    pass: DIVERGENCE_LADDER.every(
      (row, i) => i === 0 || row.gronwallExponent > DIVERGENCE_LADDER[i - 1].gronwallExponent,
    ),
  },
  {
    name: 'imp2692-microscopic-efold-positive',
    pass: IMP_2692_C_H_WALL.pillarB_nNonUniformEfold.efoldMicro > 0,
  },
  {
    name: 'imp2692-one-eighth-not-rigorous-upper-bound',
    pass: IMP_2692_C_H_WALL.pillarC_positiveRemainderCounterexample.isRigorousUpperBound === false,
  },
  {
    name: 'imp2692-positive-remainder-exceeds-one-eighth',
    pass: IMP_2692_C_H_WALL.pillarC_positiveRemainderCounterexample.upperBoundViolated === true,
  },
  {
    name: 'imp2692-theta-subgap-still-open',
    pass: IMP_2692_C_H_WALL.pillarD_survivingSubGap.status.startsWith('OPEN'),
  },
  {
    name: 'imp2692-no-false-beat',
    pass:
      IMP_2692_C_H_WALL.verdict.includes('NO rigorous beat claimed') &&
      IMP_2692_C_H_WALL.verdict.includes('stays SOTA'),
  },
];
