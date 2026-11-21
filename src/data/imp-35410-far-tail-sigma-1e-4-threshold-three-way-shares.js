/**
 * @module imp-35410-far-tail-sigma-1e-4-threshold-three-way-shares
 *
 * imp-35410 (measurement, frontier-direction): imp-35334 located the GUE-conditional share
 * threshold sigma(N) = E_coll / E(N) below 0.1 (N ~ 3.213e11, imp-33582), 0.01 (N ~ 4.624e13,
 * imp-33620/imp-34474), and 1e-3 (N ~ 5.432e15, imp-35334), and tabulated the three-way share
 * decomposition ONLY at the sigma < 1e-3 point. This module MEASURES the NEXT threshold, the
 * height where sigma first drops below 1e-4, by the IDENTICAL imp-34474/imp-33620/imp-35334
 * decreasing-sigma log10-N bisection on the same parts() sub-terms, and records the three-way
 * E-component shares (E_trunc/E(N), E_coll/E(N), E_flow/E(N)) at that N.
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-35334 / imp-34474 / imp-33620 / imp-3406)
 * --------------------------------------------------------------------------------------
 *     E(N)   = E_trunc + E_flow + E_coll,      sigma(N) = E_coll / E(N),
 *     T0     = effectiveHeightForN(N)          (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant early, GUE-conditional C_H = 1/8)
 *     E_flow = C_F (log T0 / T0) * Gronwall,   C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                        (N-independent floor, imp-2631/imp-3220)
 * No re-derivation, no fresh model: the exact imp-35334 parts() and the identical decreasing-
 * sigma bisection, evaluated at the sigma < 1e-4 threshold (one further decade of sigma).
 *
 * THE MEASUREMENT (measurement only)
 * ----------------------------------
 *   N_00001    = 6.164881782e17        (sigma < 1e-4 threshold, log10 N ~ 17.789925)
 *   T0(N_00001)= 1.065055e17
 *   E_trunc    = 3.060000e-5           (constant floor)
 *   E_coll     = 3.060306e-9           (GUE-conditional, decayed to ~0.01% of E_trunc)
 *   E_flow     = 2.248515e-15          (negligible)
 *   E(N_00001) = 3.060306031e-5        headline GUE-conditional slack Lambda <= E(N)
 *   sigma      = 0.000100000           (= 1e-4 by construction at the threshold)
 *   The sigma < 1e-4 landmark sits ~2.05 decades in N past the imp-35334 sigma < 1e-3 point.
 *
 * THE THREE-WAY SHARE DECOMPOSITION AT THE sigma < 1e-4 LANDMARK
 * -------------------------------------------------------------
 *   GUE-conditional (E_coll)/E(N)          = 1.000000e-4   (= sigma; imp-486 C_mb / C_H)
 *   C_T barrier-lemma (E_trunc)/E(N)       = 0.999900      (imp-34791 unported barrier lemma)
 *   fully-unconditional (E_flow)/E(N)      = 7.35e-11      (imp-398, fully rigorous)
 *   The three shares sum to 1. Relative to imp-35334 (sigma < 1e-3) the GUE-conditional share
 *   has fallen by exactly one decade (1e-3 -> 1e-4) while the E_trunc floor share has risen from
 *   0.999000 to 0.999900: the surviving bridge is even more completely PINNED by the sigma-blind
 *   C_T-conditional E_trunc, and E(N)/E_trunc has tightened from 1.001001 to 1.000100.
 *
 * THE FINDINGS
 * ------------
 *   (M1) THE sigma < 1e-4 LANDMARK IS N ~ 6.165e17. The identical imp-35334 bisection first drops
 *        sigma below 1e-4 at N ~ 6.164881782e17 (log10 N ~ 17.7899, T0 ~ 1.065e17), where
 *        E_coll ~ 3.060e-9 has decayed to ~0.01% of the E_trunc floor and E(N)/E_trunc = 1.000100.
 *        This extends the imp-33582 / imp-33620 / imp-35334 ladder one further decade of sigma,
 *        ~2.05 decades in N past the imp-35334 sigma < 1e-3 point.
 *   (M2) THE THREE-WAY SHARES AT THE LANDMARK: (E_coll)/E(N) = 1e-4 = sigma (GUE-conditional),
 *        (E_trunc)/E(N) = 0.999900 (C_T barrier-lemma), (E_flow)/E(N) = 7.35e-11 (fully
 *        unconditional). The GUE-conditional share is exactly sigma, so at this landmark
 *        >= 99.99% of the headline slack is GUE-unconditional and the GUE-conditional share -> 0
 *        monotonically. The floor share E_trunc/E(N) climbs one decade closer to 1 vs imp-35334.
 *   (M3) THE PICTURE IS UNCHANGED FROM imp-35334, ONLY DEEPER. The vanishing GUE-conditional
 *        E_coll is traded for a bridge PINNED ever harder by the sigma-blind C_T-conditional
 *        E_trunc (imp-34791 unported barrier lemma, deterministic, NO GUE/PCC): the far tail
 *        trades GUE-conditionality for C_T-conditionality; it never reaches unconditional.
 *
 * MEASUREMENT ONLY. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 * rigorous asymptotic; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; the imp-34791
 * E_trunc = barrier-lemma reclassification is UNCHANGED; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35334-far-tail-effectively-unconditional-vs-etrunc-conditionality (sigma<1e-3 landmark; parts() + bisection source)
 * @see imp-34474-far-tail-en-headline-slack-vs-lpt (sigma < 0.01 landmark; parts() + bisection source)
 * @see imp-33620-etrunc-ecoll-ladder-1e15-extension (sigma < 0.01 far-tail landmark, ladder source)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (sigma < 0.1 landmark N ~ 3.213e11)
 * @see imp-34791-etrunc-eflow-pt-anchor-honest-discharge (E_trunc = rigorous-modulo-C_T unported barrier lemma)
 * @see imp-2706-ecoll-conditional-modulo-ch (E_trunc/E_flow rigorous sub-terms; E_coll GUE-conditional)
 * @see imp-486 (C_mb GUE-conditional); imp-398 (E_flow C_F prefactor)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-35334/imp-34474/imp-33620 exactly
const L_PT = 0.121; // imp-452/imp-459 unconditional finite-height beat (< PT 0.2)

// EXACT imp-35334/imp-34474 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

function sigmaAt(N) {
  return parts(N).sigma;
}
// Identical decreasing-sigma log10-N bisection to imp-35334/imp-34474.
function thresholdLog10(target, loExp, hiExp) {
  let lo = loExp;
  let hi = hiExp;
  for (let it = 0; it < 200; it++) {
    const mid = (lo + hi) / 2;
    if (sigmaAt(Math.pow(10, mid)) > target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// (M1) The sigma < 1e-4 landmark.
const SIGMA_00001_LOG10 = thresholdLog10(0.0001, 16, 22); // ~17.789925
const N_00001 = Math.pow(10, SIGMA_00001_LOG10); // ~6.165e17
const P = parts(N_00001);

// The imp-35334 sigma < 1e-3 landmark, for the span comparison.
const SIGMA_0001_LOG10 = thresholdLog10(0.001, 14, 20); // ~15.734986
const SPAN_DECADES_PAST_0001 = SIGMA_00001_LOG10 - SIGMA_0001_LOG10; // ~2.055

// (M2) The three-way share decomposition of E(N) at the landmark.
const GUE_CONDITIONAL_SHARE = P.E_coll / P.E_N; // = sigma = 1e-4 (GUE, imp-486)
const CT_BARRIER_SHARE = E_TRUNC_PT / P.E_N; // ~0.9999 (rigorous-modulo-C_T, imp-34791)
const UNCONDITIONAL_SHARE = P.E_flow / P.E_N; // ~7.35e-11 (fully rigorous, imp-398)
const SHARE_SUM = GUE_CONDITIONAL_SHARE + CT_BARRIER_SHARE + UNCONDITIONAL_SHARE; // == 1

const E_N_OVER_E_TRUNC = P.E_N / E_TRUNC_PT; // ~1.000100
const L_PT_OVER_E_N = L_PT / P.E_N; // ~3953.85
const L_PT_OVER_E_TRUNC = L_PT / E_TRUNC_PT; // 3954.2484 (structural ceiling as sigma -> 0)

export const IMP35410_FAR_TAIL_SIGMA_1E_4_THRESHOLD_THREE_WAY_SHARES = {
  id: 'imp-35410',
  proofSection: 'S-frontier',
  question:
    'MEASURE the height where the GUE-conditional share sigma(N) = E_coll / E(N) first drops below ' +
    '1e-4 (extending the imp-33582 sigma<0.1 / imp-33620 sigma<0.01 / imp-35334 sigma<1e-3 ladder), ' +
    'and RECORD the three-way E-component shares E_trunc/E(N), E_coll/E(N), E_flow/E(N) at that N. ' +
    'Measurement only; C_mb stays GUE-conditional per imp-486; changes no bound; NO QED.',
  componentModel:
    'E(N) = E_trunc + E_flow + E_coll; sigma = E_coll/E(N); T0 = effectiveHeightForN(N) (RvM inverse); ' +
    'E_coll = C_C sqrt(log T0 / N) (GUE-conditional C_H = 1/8, imp-486); E_flow = C_F (log T0 / T0) ' +
    'Gronwall (unconditionally rigorous, imp-398); E_trunc = 3.06e-5 (N-independent floor, ' +
    'rigorous-modulo-C_T, imp-34791 unported barrier lemma). Identical parts() and decreasing-sigma ' +
    'log10-N bisection to imp-35334/imp-34474.',
  landmark: {
    N_00001: +N_00001.toExponential(9), // 6.164881782e17
    log10_N: +SIGMA_00001_LOG10.toFixed(6), // 17.789925
    T0: +P.T0.toExponential(6), // 1.065055e17
    E_trunc: +E_TRUNC_PT.toExponential(6), // 3.060000e-5
    E_coll: +P.E_coll.toExponential(6), // 3.060306e-9
    E_flow: +P.E_flow.toExponential(6), // 2.248515e-15
    E_N: +P.E_N.toExponential(9), // 3.060306031e-5
    sigma: +P.sigma.toFixed(9), // 0.000100000
    E_N_over_E_trunc: +E_N_OVER_E_TRUNC.toFixed(9), // 1.000100010
    span_decades_past_sigma_0001: +SPAN_DECADES_PAST_0001.toFixed(4), // ~2.0549
    L_pt_over_E_N: +L_PT_OVER_E_N.toFixed(3), // ~3953.853
    L_pt_over_E_trunc_ceiling: +L_PT_OVER_E_TRUNC.toFixed(4), // 3954.2484
  },
  threeWayShares: {
    note:
      'The three sub-terms carry THREE DISTINCT provenance classes, not one bucket. At the ' +
      'sigma < 1e-4 landmark N ~ 6.165e17 the shares of E(N) are:',
    GUE_conditional_E_coll: +GUE_CONDITIONAL_SHARE.toExponential(6), // 1.000000e-4 (= sigma; imp-486 C_mb)
    C_T_barrier_lemma_E_trunc: +CT_BARRIER_SHARE.toFixed(9), // 0.999900 (imp-34791 unported barrier lemma)
    fully_unconditional_E_flow: +UNCONDITIONAL_SHARE.toExponential(6), // 7.35e-11 (imp-398, fully rigorous)
    share_sum: +SHARE_SUM.toFixed(12), // 1.000000000000
  },
  findings: {
    M1_sigma_below_1e_4_landmark: {
      claim:
        'The identical imp-35334 bisection first drops sigma below 1e-4 at N ~ 6.164881782e17 ' +
        '(log10 N ~ 17.7899, T0 ~ 1.065e17), where E_coll ~ 3.060e-9 has decayed to ~0.01% of the ' +
        'E_trunc floor and E(N)/E_trunc = 1.000100 -- ~2.05 decades in N past the sigma<1e-3 point',
      N_00001: +N_00001.toExponential(9),
      sigma: +P.sigma.toFixed(9),
      E_N_over_E_trunc: +E_N_OVER_E_TRUNC.toFixed(9),
    },
    M2_three_way_shares_at_landmark: {
      claim:
        'The three-way shares of E(N) at the landmark: (E_coll)/E(N) = 1e-4 = sigma (GUE-conditional, ' +
        'imp-486), (E_trunc)/E(N) = 0.999900 (C_T barrier lemma, imp-34791), (E_flow)/E(N) = 7.35e-11 ' +
        '(fully unconditional, imp-398). >= 99.99% of the headline slack is GUE-unconditional and the ' +
        'GUE-conditional share is exactly sigma, vanishing monotonically',
      GUE_conditional_share: +GUE_CONDITIONAL_SHARE.toExponential(6), // = sigma
      C_T_barrier_lemma_share: +CT_BARRIER_SHARE.toFixed(9), // 0.999900
      fully_unconditional_share: +UNCONDITIONAL_SHARE.toExponential(6), // 7.35e-11
    },
    M3_picture_unchanged_only_deeper: {
      claim:
        'The picture is unchanged from imp-35334, only deeper: the vanishing GUE-conditional E_coll is ' +
        'traded for a bridge PINNED ever harder by the sigma-blind C_T-conditional E_trunc (imp-34791 ' +
        'unported barrier lemma, deterministic realness control above T_PT, NO GUE/PCC). The floor share ' +
        'climbs from 0.999000 (imp-35334) to 0.999900 here; E(N)/E_trunc tightens from 1.001001 to ' +
        '1.000100. The far tail trades GUE-conditionality for C_T-conditionality; it never reaches ' +
        'unconditional',
      C_T_barrier_lemma_share: +CT_BARRIER_SHARE.toFixed(9), // 0.999900
      fully_unconditional_share: +UNCONDITIONAL_SHARE.toExponential(6), // 7.35e-11
      etrunc_class: 'rigorous-modulo-C_T (imp-34791 unported barrier lemma; deterministic, NO GUE/PCC)',
    },
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). (M1) The identical imp-35334 decreasing-sigma ' +
    'bisection first drops the GUE-conditional share sigma = E_coll/E(N) below 1e-4 at N ~ ' +
    '6.164881782e17 (log10 N ~ 17.7899, T0 ~ 1.065e17), where E_coll ~ 3.060e-9 is ~0.01% of the ' +
    'E_trunc floor and E(N)/E_trunc = 1.000100 -- ~2.05 decades in N past the imp-35334 sigma<1e-3 ' +
    'landmark. (M2) The three-way E-component shares at this landmark are (E_coll)/E(N) = 1e-4 = sigma ' +
    '(GUE-conditional, imp-486 C_mb / C_H), (E_trunc)/E(N) = 0.999900 (C_T barrier lemma, imp-34791 ' +
    'unported barrier lemma), (E_flow)/E(N) = 7.35e-11 (fully unconditional, imp-398); the three sum ' +
    'to 1, so >= 99.99% of the headline is GUE-unconditional and the GUE-conditional share vanishes ' +
    'monotonically with sigma. (M3) The picture is unchanged from imp-35334, only deeper: the vanishing ' +
    'GUE-conditional E_coll is traded for a bridge PINNED ever harder by the sigma-blind C_T-conditional ' +
    'E_trunc floor (share 0.999000 -> 0.999900), the imp-34791 unported barrier lemma (deterministic ' +
    'realness control above T_PT, NO GUE, NO PCC); the far tail trades GUE-conditionality for ' +
    'C_T-conditionality and never reaches unconditional. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional share per ' +
    'imp-486 is UNTOUCHED; the imp-34791 E_trunc = barrier-lemma reclassification is UNCHANGED; changes ' +
    'no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35334 (sigma<1e-3 landmark, parts() + bisection source); imp-34474 (sigma<0.01 landmark); ' +
    'imp-33620 (sigma<0.01 far-tail ladder); imp-33582 (sigma<0.1 landmark N ~ 3.213e11); imp-3444 ' +
    '(E_coll = E_trunc crossover N ~ 3.28e9, sigma ~ 0.5); imp-34791 (E_trunc = rigorous-modulo-C_T ' +
    'unported barrier lemma; deterministic, NO GUE/PCC); imp-2706 (E_trunc/E_flow rigorous sub-terms, ' +
    'E_coll GUE-conditional); imp-486 (C_mb GUE-conditional); imp-398 (E_flow C_F prefactor); imp-2642 ' +
    '(C_H = 1/8 ansatz); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35410_FAR_TAIL_SIGMA_1E_4_THRESHOLD_THREE_WAY_SHARES_ASSERTIONS = [
  {
    // (M1): the sigma < 1e-4 threshold pins to N ~ 6.165e17 (log10 N ~ 17.7899) with sigma = 1e-4.
    id: 'imp35410-sigma-below-1e-4-landmark',
    description: 'sigma < 1e-4 first at N ~ 6.164881782e17 (log10 N ~ 17.7899), sigma = 1e-4 exactly',
    holds: () =>
      Math.abs(N_00001 - 6.164881782e17) / 6.164881782e17 < 1e-6 &&
      Math.abs(P.sigma - 0.0001) < 1e-10 &&
      Math.abs(SIGMA_00001_LOG10 - 17.789925) < 1e-4,
  },
  {
    // (M1): the landmark sits ~2.05 decades past the imp-35334 sigma < 1e-3 point,
    // and the headline is 1.000100x the E_trunc floor (E_coll ~ 0.01% E_trunc).
    id: 'imp35410-landmark-span-and-floor-ratio',
    description: 'sigma<1e-4 is ~2.05 decades past sigma<1e-3; E(N)/E_trunc = 1.000100',
    holds: () =>
      Math.abs(SPAN_DECADES_PAST_0001 - 2.0549) < 5e-3 &&
      Math.abs(E_N_OVER_E_TRUNC - 1.0001) < 1e-6,
  },
  {
    // (M2): the GUE-conditional share equals sigma, so >= 99.99% of the bridge is GUE-unconditional.
    id: 'imp35410-gue-conditional-share-equals-sigma',
    description: 'GUE-conditional share (E_coll)/E(N) = sigma = 1e-4; >= 99.99% GUE-unconditional',
    holds: () =>
      Math.abs(GUE_CONDITIONAL_SHARE - P.sigma) < 1e-15 &&
      Math.abs(GUE_CONDITIONAL_SHARE - 0.0001) < 1e-10 &&
      1 - GUE_CONDITIONAL_SHARE > 0.99989,
  },
  {
    // (M2)/(M3): the three-way shares -- E_trunc dominates (~0.9999), E_flow negligible (~7.35e-11),
    // the three shares sum to 1, and the floor share climbed one decade closer to 1 vs imp-35334 (0.999).
    id: 'imp35410-three-way-shares-floor-dominates',
    description: 'E_trunc share ~0.9999 dominates; E_flow share ~7.35e-11; shares sum to 1; floor > sigma',
    holds: () =>
      Math.abs(CT_BARRIER_SHARE - 0.9999) < 1e-6 &&
      UNCONDITIONAL_SHARE < 1e-9 &&
      Math.abs(SHARE_SUM - 1) < 1e-12 &&
      CT_BARRIER_SHARE > GUE_CONDITIONAL_SHARE &&
      CT_BARRIER_SHARE > 0.999, // deeper than the imp-35334 sigma<1e-3 floor share
  },
  {
    // Honesty gate: measurement only, GUE-conditional per imp-486, E_trunc barrier-lemma per imp-34791,
    // no QED, no refereed bound is changed.
    id: 'imp35410-honesty-gate-no-qed',
    description: 'Measurement only: C_mb GUE-conditional (imp-486), E_trunc barrier lemma (imp-34791), no QED, no refereed bound is changed',
    holds: () =>
      IMP35410_FAR_TAIL_SIGMA_1E_4_THRESHOLD_THREE_WAY_SHARES.isRigorous === false &&
      /GUE-conditional share per imp-486 is UNTOUCHED/.test(
        IMP35410_FAR_TAIL_SIGMA_1E_4_THRESHOLD_THREE_WAY_SHARES.verdict,
      ) &&
      /unported barrier lemma/i.test(
        IMP35410_FAR_TAIL_SIGMA_1E_4_THRESHOLD_THREE_WAY_SHARES.verdict,
      ) &&
      /NO QED/.test(IMP35410_FAR_TAIL_SIGMA_1E_4_THRESHOLD_THREE_WAY_SHARES.verdict) &&
      /refereed bound is changed/i.test(IMP35410_FAR_TAIL_SIGMA_1E_4_THRESHOLD_THREE_WAY_SHARES.verdict),
  },
];

for (const a of IMP35410_FAR_TAIL_SIGMA_1E_4_THRESHOLD_THREE_WAY_SHARES_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35410-far-tail-sigma-1e-4-threshold-three-way-shares assertion failed: ${a.id}`,
    );
  }
}
