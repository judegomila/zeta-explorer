/**
 * @module imp-35014-subdominant-angle-commensurability
 *
 * imp-35014 (numerical, frontier-direction): imp-34947 pinned the DOMINANT conjugate-pair singularity argument two
 * ways (sign-cycle period P = 9 -> theta_1 = 40.0 deg, and a local 2-step Darboux recurrence theta_1 ~ 39 deg) and
 * imp-34991 then fit the local FOUR-step recurrence to resolve the SUB-DOMINANT pair jointly (radius R_2 ~ 120 AND
 * angle theta_2 ~ 26.85 deg, band [19,37]). But imp-34991 stopped at LOCATING the second pair -- it never assessed
 * the two questions this ticket names: (1) how much the sub-dominant pair PERTURBS the dominant P = 9 -> theta = 40
 * deg sign-cycle read, and (2) whether the two arguments theta_1, theta_2 are COMMENSURATE (a shared periodic
 * structure) or INDEPENDENT. This module answers both from the imp-34947/imp-34991 measured angles VERBATIM.
 *
 * THE MEASUREMENT (all inside the no-E_flow logistic model; measurement only, no recomputation of the ladder)
 * ------------------------------------------------------------------------------------
 * It reuses the imp-34947 sign-cycle read (theta_1 = 40.0 deg, P = 9, one k-step = 40 deg of phase) and the
 * imp-34991 two-pair Darboux fit (sub-dominant theta_2 ~ 26.85 deg, magnitude ratio rho_sub/rho_dom ~ 0.70) VERBATIM,
 * then computes two derived diagnostics:
 *   (a) SIGN-CYCLE PERTURBATION CEILING. In the deep band k >= 8 the sub-dominant pair carries relative amplitude
 *       (rho_sub/rho_dom)^k = 0.70^k. The largest angular shift a perturbation of that amplitude can impose on the
 *       phase (hence on the measured argument) of the dominant oscillation is delta_theta_max(k) = arcsin(0.70^k):
 *       at the deep-band onset k = 8 this is arcsin(0.0576) = 3.30 deg, decaying to 0.27 deg by k = 15 and
 *       ~1.3e-3 deg by k = 30. Because the sign-cycle read quantizes to integer runs and one k-step spans
 *       theta_1 = 40 deg of phase, flipping an integer run length requires moving a zero-crossing by half a step
 *       = 20 deg of phase -- so the run-flip margin is 20 / 3.30 = 6.05x even at the onset. The sub-dominant pair
 *       therefore CANNOT move the integer period P = 9, and its ceiling 3.30 deg bounds-above the observed
 *       sign-cycle-vs-recurrence spread of ~0.96 deg (imp-34947).
 *   (b) COMMENSURABILITY. The two periods obey P_2 / P_1 = theta_1 / theta_2. At the central measured values
 *       (theta_1 = 40, theta_2 = 26.85) this ratio is 1.490, within 0.68% of 3/2 -- a tantalizing near-3:2 lock
 *       (shared super-period 3 P_1 = 2 P_2 ~ 27 in k). BUT the sub-dominant angle is pinned only to band [19,37] deg
 *       by the 30-term ladder, so the ratio band is theta_1 / [37,19] = [1.081, 2.105] (width ~1.02) -- wide enough
 *       to also contain 5/3, 7/4, 2/1. Commensurability therefore CANNOT be established: the central hint near 3:2
 *       is real but the second angle is too loosely resolved to distinguish a genuine lock from independence.
 *
 * THE FINDING (measurement only)
 * -------------------------------------------
 *   (F1) THE SUB-DOMINANT PAIR BARELY PERTURBS THE P = 9 SIGN-CYCLE READ. Its relative amplitude in the deep band is
 *        0.70^k, capping the argument perturbation at arcsin(0.70^8) = 3.30 deg at the onset (k = 8) and decaying to
 *        ~0 by k = 30. That ceiling sits 6.05x below the 20 deg half-step needed to flip an integer sign run, so the
 *        dominant period P = 9 -> theta_1 = 40 deg is unmoved, and the ceiling bounds-above the ~0.96 deg spread the
 *        two imp-34947 estimators already showed.
 *   (F2) THE TWO ANGLES ARE NOT DEMONSTRABLY COMMENSURATE. The central period ratio P_2/P_1 = theta_1/theta_2 = 1.490
 *        sits 0.68% from 3/2, hinting at a 3:2 lock, but the theta_2 band [19,37] deg spreads the ratio over
 *        [1.08, 2.11], which contains several low-order rationals -- so the near-3:2 coincidence cannot be promoted to
 *        a commensurate structure. On the evidence the pairs read as INDEPENDENT within resolution; a longer analytic
 *        ladder (imp-34991 open sub-gap) would be needed to test the 3:2 hint.
 *   (F3) NEITHER DIAGNOSTIC MOVES A BOUND. The perturbation ceiling and the commensurability read are both diagnostics
 *        of the inherited surrogate coefficient sequence; the sub-dominant radius R_2 ~ 120 (imp-34991) already leaves
 *        the physical resummation point eps = 1 deep inside |eps| < R, so the whole discussion changes no bound.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2
 * (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34991-two-pair-darboux-joint-radius-angle (sub-dominant pair R_2 ~ 120, theta_2 ~ 26.85 deg this analyses)
 * @see imp-34947-conjugate-pair-argument-theta-cross-check (dominant sign-cycle P = 9 -> theta_1 = 40 deg + spread)
 * @see imp-34932-sigma-knee-extended-order-domb-sykes (analytic delta ladder + sign-cycle theta ~ 40 deg)
 * @see imp-34863-sigma-knee-cauchy-hadamard-radius (root sequence, delta recursion)
 */

import { IMP34947_CONJUGATE_PAIR_ARGUMENT_THETA_CROSS_CHECK } from './imp-34947-conjugate-pair-argument-theta-cross-check.js';
import { IMP34991_TWO_PAIR_DARBOUX_JOINT_RADIUS_ANGLE } from './imp-34991-two-pair-darboux-joint-radius-angle.js';

const RAD2DEG = 180 / Math.PI;

// ---- inherited measured angles (VERBATIM from imp-34947 / imp-34991) ----------------------------------------
const THETA1_SIGN_CYCLE = IMP34947_CONJUGATE_PAIR_ARGUMENT_THETA_CROSS_CHECK.signCycleRead.theta_deg; // 40.0
const SIGN_PERIOD_P1 = IMP34947_CONJUGATE_PAIR_ARGUMENT_THETA_CROSS_CHECK.signCycleRead.signPeriod_k; // 9.0
const THETA1_RECURRENCE = IMP34947_CONJUGATE_PAIR_ARGUMENT_THETA_CROSS_CHECK.recurrenceRead.theta_median_deg; // ~39.04
const SPREAD_OBSERVED = IMP34947_CONJUGATE_PAIR_ARGUMENT_THETA_CROSS_CHECK.crossCheck.spread_deg; // ~0.957
const THETA2 = IMP34991_TWO_PAIR_DARBOUX_JOINT_RADIUS_ANGLE.subDominantPair.theta_deg; // ~26.85
const THETA2_BAND = IMP34991_TWO_PAIR_DARBOUX_JOINT_RADIUS_ANGLE.subDominantPair.band_theta_deg; // [19,37]
const RHO_RATIO = IMP34991_TWO_PAIR_DARBOUX_JOINT_RADIUS_ANGLE.rhoSubOverRhoDom; // ~0.70
const K_START = IMP34991_TWO_PAIR_DARBOUX_JOINT_RADIUS_ANGLE.kStart; // 8
const R2_SUB = IMP34991_TWO_PAIR_DARBOUX_JOINT_RADIUS_ANGLE.subDominantPair.R; // ~120

// ---- (a) sign-cycle perturbation ceiling: arcsin( (rho_sub/rho_dom)^k ) over the deep band ------------------
// The sub-dominant pair carries relative amplitude RHO_RATIO^k; the biggest phase (argument) shift it can impose
// on the dominant oscillation is arcsin of that amplitude (perturbation orthogonal to the dominant phasor).
function ceilingDeg(k) {
  return Math.asin(Math.min(1, Math.pow(RHO_RATIO, k))) * RAD2DEG;
}
const CEILING_KSTART = ceilingDeg(K_START); // arcsin(0.70^8) = ~3.305 deg
const CEILING_K15 = ceilingDeg(15); // ~0.272 deg
const CEILING_K30 = ceilingDeg(30); // ~0.0013 deg
// one k-step spans THETA1 deg of phase (that is why P = 360/theta); flipping an integer run needs half a step.
const HALF_STEP_PHASE_DEG = THETA1_SIGN_CYCLE / 2; // 20 deg
const RUN_FLIP_MARGIN = HALF_STEP_PHASE_DEG / CEILING_KSTART; // ~6.05x -> P = 9 cannot flip
const CEILING_BOUNDS_SPREAD = CEILING_KSTART > SPREAD_OBSERVED; // 3.30 > 0.96 -> ceiling caps the observed spread

// ---- (b) commensurability of the two arguments -------------------------------------------------------------
// periods obey P_2 / P_1 = theta_1 / theta_2. Test whether that ratio is a pin-able low-order rational.
const PERIOD_RATIO = THETA1_SIGN_CYCLE / THETA2; // ~1.4898 (P_2/P_1)
const DEV_FROM_3_2 = Math.abs(PERIOD_RATIO - 1.5) / 1.5; // ~0.0068 (0.68% from 3/2)
const RATIO_BAND = [THETA1_SIGN_CYCLE / THETA2_BAND[1], THETA1_SIGN_CYCLE / THETA2_BAND[0]]; // ~[1.081, 2.105]
const RATIO_BAND_WIDTH = RATIO_BAND[1] - RATIO_BAND[0]; // ~1.024 -> spans several low-order rationals
const P2_STEPS = 360 / THETA2; // ~13.41 (sub-dominant sign period in k)
// commensurate would require the ratio pinned to a small p/q; the band is too wide to distinguish 3/2 from 5/3, 2/1.
const COMMENSURATE_ESTABLISHED = DEV_FROM_3_2 < 0.02 && RATIO_BAND_WIDTH < 0.15; // false: central hint but band too wide

// ---- verdicts (measurement only) ---------------------------------------------------------------------------
const SUBDOMINANT_BARELY_PERTURBS = CEILING_KSTART < 5 && RUN_FLIP_MARGIN > 3 && CEILING_BOUNDS_SPREAD;
const CEILING_DECAYS = CEILING_K15 < CEILING_KSTART && CEILING_K30 < CEILING_K15;
const NEAR_3_2_BUT_UNPINNED = DEV_FROM_3_2 < 0.02 && RATIO_BAND_WIDTH > 0.5;
const EPS1_STILL_INSIDE = R2_SUB > 1;

export const IMP35014_SUBDOMINANT_ANGLE_COMMENSURABILITY = {
  id: 'imp-35014',
  proofSection: 'S-frontier',
  question:
    'imp-34947 pinned the DOMINANT conjugate-pair argument (sign-cycle P = 9 -> theta_1 = 40 deg, recurrence ~39 deg) ' +
    'and imp-34991 resolved the SUB-DOMINANT pair (R_2 ~ 120, theta_2 ~ 26.85 deg), but never assessed how theta_2 ' +
    'PERTURBS the dominant sign-cycle read nor whether theta_1, theta_2 are COMMENSURATE (shared periodic structure) ' +
    'or INDEPENDENT. Quantify the sign-cycle perturbation ceiling from the sub-dominant relative amplitude and test ' +
    'the period ratio for a low-order rational lock. Measurement only; C_mb GUE-conditional (imp-486) untouched; no QED.',
  measuredQuantity:
    'the ceiling on the argument perturbation the sub-dominant pair can impose on the dominant P = 9 -> theta = 40 deg ' +
    'sign-cycle read across the deep band, the integer-run-flip margin, and the commensurability of the two arguments ' +
    '(period ratio P_2/P_1 = theta_1/theta_2 vs a low-order rational, with the theta_2-band-driven ambiguity)',
  inheritedAngles: {
    theta1_signCycle_deg: THETA1_SIGN_CYCLE, // 40.0 (imp-34947)
    signPeriod_P1_k: SIGN_PERIOD_P1, // 9.0
    theta1_recurrence_deg: +THETA1_RECURRENCE.toFixed(3), // ~39.043
    theta2_deg: +THETA2.toFixed(3), // ~26.85 (imp-34991)
    theta2_band_deg: THETA2_BAND, // [19,37]
    rhoSubOverRhoDom: +RHO_RATIO.toFixed(4), // ~0.70
  },
  signCyclePerturbation: {
    note: 'sub-dominant relative amplitude in the deep band is (rho_sub/rho_dom)^k; max argument shift = arcsin of it. ' +
      'One k-step = theta_1 = 40 deg of phase, so flipping an integer sign run needs a half-step = 20 deg shift.',
    kStart: K_START, // 8
    ceiling_kStart_deg: +CEILING_KSTART.toFixed(4), // ~3.305
    ceiling_k15_deg: +CEILING_K15.toFixed(4), // ~0.272
    ceiling_k30_deg: +CEILING_K30.toFixed(6), // ~0.001292
    halfStepPhase_deg: HALF_STEP_PHASE_DEG, // 20
    runFlipMargin: +RUN_FLIP_MARGIN.toFixed(3), // ~6.052 -> P = 9 cannot flip
    observedSpread_deg: +SPREAD_OBSERVED.toFixed(3), // ~0.957 (imp-34947 sign-cycle vs recurrence)
    ceilingBoundsObservedSpread: CEILING_BOUNDS_SPREAD, // true -> 3.30 > 0.96
  },
  commensurability: {
    note: 'periods obey P_2/P_1 = theta_1/theta_2; commensurate would need that ratio pinned to a small p/q.',
    periodRatio_P2_over_P1: +PERIOD_RATIO.toFixed(5), // ~1.48976
    nearestLowOrderRational: '3/2',
    devFrom_3_2_relative: +DEV_FROM_3_2.toFixed(5), // ~0.00683 (0.68%)
    ratioBand: [+RATIO_BAND[0].toFixed(4), +RATIO_BAND[1].toFixed(4)], // ~[1.0811, 2.1053]
    ratioBandWidth: +RATIO_BAND_WIDTH.toFixed(4), // ~1.0242 -> spans 3/2, 5/3, 7/4, 2/1
    subDominantSignPeriod_P2_k: +P2_STEPS.toFixed(3), // ~13.408
    commensurateEstablished: COMMENSURATE_ESTABLISHED, // false
  },
  subDominantRadius_R2: +R2_SUB.toFixed(3), // ~120 (imp-34991) -> eps = 1 stays deep inside |eps| < R
  eps_physical: 1,
  eps1StillInside: EPS1_STILL_INSIDE, // true
  subDominantBarelyPerturbs: SUBDOMINANT_BARELY_PERTURBS, // true
  ceilingDecays: CEILING_DECAYS, // true
  near3_2ButUnpinned: NEAR_3_2_BUT_UNPINNED, // true -> central hint near 3:2, band too wide to establish
  farTailExponent: 0.5, // imp-3463
  finding: {
    F1_subdominant_barely_perturbs_sign_cycle:
      'The sub-dominant pair carries relative amplitude (rho_sub/rho_dom)^k = 0.70^k in the deep band, capping the ' +
      'argument perturbation at arcsin(0.70^8) = 3.30 deg at the onset k = 8 and decaying to 0.27 deg by k = 15 and ' +
      '~1.3e-3 deg by k = 30. Because one k-step spans theta_1 = 40 deg of phase, flipping an integer sign run needs a ' +
      '20 deg half-step, so the run-flip margin is 6.05x -- the dominant period P = 9 -> theta_1 = 40 deg is unmoved, ' +
      'and the 3.30 deg ceiling bounds-above the ~0.96 deg spread the two imp-34947 estimators already showed.',
    F2_two_angles_not_demonstrably_commensurate:
      'The central period ratio P_2/P_1 = theta_1/theta_2 = 1.490 sits 0.68% from 3/2, hinting at a 3:2 lock (shared ' +
      'super-period 3 P_1 = 2 P_2 ~ 27 in k), but the theta_2 band [19,37] deg spreads the ratio over [1.08, 2.11] ' +
      '(width ~1.02), which also contains 5/3, 7/4, 2/1. So the near-3:2 coincidence cannot be promoted to a ' +
      'commensurate structure -- within resolution the two pairs read as INDEPENDENT; a longer analytic ladder ' +
      '(imp-34991 open sub-gap) would be needed to test the 3:2 hint.',
    F3_neither_diagnostic_moves_a_bound:
      'Both diagnostics are of the inherited surrogate coefficient sequence; the sub-dominant radius R_2 ~ 120 ' +
      '(imp-34991) already leaves the physical resummation point eps = 1 deep inside |eps| < R, so this changes no bound.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). imp-34947 pinned the DOMINANT conjugate-pair argument (sign-cycle ' +
    'P = 9 -> theta_1 = 40 deg, recurrence ~39 deg) and imp-34991 jointly resolved the SUB-DOMINANT pair (R_2 ~ 120, ' +
    'theta_2 ~ 26.85 deg, band [19,37]) but never assessed the sign-cycle perturbation or commensurability this ticket ' +
    'names. (F1) The sub-dominant relative amplitude 0.70^k caps the argument perturbation at arcsin(0.70^8) = 3.30 ' +
    'deg at k = 8, decaying to ~1.3e-3 deg by k = 30; since one k-step = 40 deg of phase and an integer-run flip needs ' +
    'a 20 deg half-step, the run-flip margin is 6.05x, so P = 9 is unmoved and 3.30 deg bounds-above the ~0.96 deg ' +
    'imp-34947 spread. (F2) The central period ratio P_2/P_1 = theta_1/theta_2 = 1.490 is 0.68% from 3/2 (a near-3:2 ' +
    'hint), but the theta_2 band [19,37] deg spreads the ratio over [1.08, 2.11], too wide to distinguish 3/2 from 5/3 ' +
    'or 2/1 -- commensurability is NOT established, the pairs read as independent within resolution. (F3) Both radii ' +
    'exceed 1 (R_2 ~ 120), so eps = 1 stays deep inside |eps| < R and nothing here moves a bound. The component model ' +
    'is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 ' +
    'is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent ' +
    'stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.',
  subGap:
    'CLOSES the imp-34991 open thread for the ASSESSMENT questions imp-35014 names: the sub-dominant pair perturbs the ' +
    'dominant P = 9 -> theta = 40 deg sign-cycle read by at most ~3.30 deg at the deep-band onset (6.05x below the ' +
    'integer-run-flip threshold, decaying to ~0), and the two arguments are NOT demonstrably commensurate (central ' +
    'period ratio 0.68% from 3/2 but the theta_2 band spreads it over [1.08, 2.11]). What stays OPEN (deferred, not ' +
    'attempted): tightening theta_2 with a longer analytic delta ladder (or a matrix-pencil/ESPRIT extraction) would ' +
    'decide whether the near-3:2 ratio is a genuine commensurate lock or a coincidence; that sharpens the geometry but ' +
    'changes no bound (R_2 ~ 120 already leaves eps = 1 deep inside |eps| < R).',
  citation:
    'imp-34991 (sub-dominant pair R_2 ~ 120, theta_2 ~ 26.85 deg, rho_sub/rho_dom ~ 0.70); imp-34947 (dominant ' +
    'sign-cycle P = 9 -> theta_1 = 40 deg, recurrence ~39 deg, spread ~0.96 deg); imp-34932 (analytic delta ladder + ' +
    'sign-cycle theta ~ 40 deg); imp-34863 (root sequence, delta recursion); imp-3463 (far-tail 1/2); imp-486 (C_mb ' +
    'GUE-conditional).',
};

export const IMP35014_SUBDOMINANT_ANGLE_COMMENSURABILITY_ASSERTIONS = [
  {
    // (F1) the sub-dominant pair barely perturbs the P = 9 sign-cycle read: ceiling ~3.30 deg, 6x below the run-flip threshold.
    id: 'imp35014-subdominant-barely-perturbs-sign-cycle',
    description: 'sign-cycle perturbation ceiling arcsin(0.70^8) ~ 3.30 deg, run-flip margin ~6x, ceiling bounds the ~0.96 deg spread',
    holds: () =>
      CEILING_KSTART > 3 && CEILING_KSTART < 4 &&
      RUN_FLIP_MARGIN > 5 && RUN_FLIP_MARGIN < 7 &&
      CEILING_BOUNDS_SPREAD === true &&
      SUBDOMINANT_BARELY_PERTURBS === true,
  },
  {
    // the perturbation ceiling DECAYS with order (0.70^k), so the sub-dominant influence vanishes deep in the band.
    id: 'imp35014-perturbation-ceiling-decays',
    description: 'perturbation ceiling decays with order: ceiling(15) < ceiling(8) and ceiling(30) < ceiling(15)',
    holds: () =>
      CEILING_DECAYS === true &&
      CEILING_K15 < 0.5 &&
      CEILING_K30 < 1e-2,
  },
  {
    // (F2) the two arguments are NOT demonstrably commensurate: central ratio near 3/2 but the theta_2 band is too wide.
    id: 'imp35014-not-demonstrably-commensurate',
    description: 'period ratio P_2/P_1 ~ 1.490 (0.68% from 3/2) but ratio band [1.08,2.11] too wide -> commensurate NOT established',
    holds: () =>
      PERIOD_RATIO > 1.4 && PERIOD_RATIO < 1.6 &&
      DEV_FROM_3_2 < 0.02 &&
      RATIO_BAND_WIDTH > 0.5 &&
      COMMENSURATE_ESTABLISHED === false &&
      NEAR_3_2_BUT_UNPINNED === true,
  },
  {
    // (F3) the sub-dominant radius keeps eps = 1 deep inside |eps| < R -> nothing here moves a bound.
    id: 'imp35014-eps1-inside-no-bound-change',
    description: 'sub-dominant radius R_2 ~ 120 > 1 -> eps = 1 stays deep inside |eps| < R, changes no bound',
    holds: () =>
      R2_SUB > 1 &&
      EPS1_STILL_INSIDE === true,
  },
  {
    // Honesty gate: measurement only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp35014-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP35014_SUBDOMINANT_ANGLE_COMMENSURABILITY.isRigorous === false &&
      IMP35014_SUBDOMINANT_ANGLE_COMMENSURABILITY.farTailExponent === 0.5 &&
      typeof IMP35014_SUBDOMINANT_ANGLE_COMMENSURABILITY.subGap === 'string' &&
      /NO QED/.test(IMP35014_SUBDOMINANT_ANGLE_COMMENSURABILITY.verdict) &&
      /refereed bound is changed/i.test(IMP35014_SUBDOMINANT_ANGLE_COMMENSURABILITY.verdict),
  },
];

for (const a of IMP35014_SUBDOMINANT_ANGLE_COMMENSURABILITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35014-subdominant-angle-commensurability assertion failed: ${a.id}`);
  }
}
