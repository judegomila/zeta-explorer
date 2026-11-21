/**
 * @module imp-35418-far-tail-three-way-share-ladder-eflow-1e-9-landmark
 *
 * imp-35418 (measurement, frontier-direction): imp-35334 tabulated the three-way
 * E-component share decomposition (E_coll GUE-conditional / E_flow fully-unconditional /
 * E_trunc C_T-barrier-lemma, each divided by E(N)) ONLY at its sigma < 1e-3 landmark
 * (N ~ 5.432e15; shares 1e-3 / 5.65e-9 / 0.999). This module tabulates the IDENTICAL
 * three shares across the FULL prior sigma threshold ladder -- sigma < 0.1 (N ~ 3.213e11,
 * imp-33582), sigma < 0.01 (N ~ 4.624e13, imp-33620/imp-34474), sigma < 1e-3 (N ~ 5.432e15,
 * imp-35334) -- showing the fully-unconditional E_flow share DECAYING and the C_T
 * barrier-lemma E_trunc share RISING toward dominance, and LOCATES the height at which the
 * E_flow share first drops below 1e-9. Identical imp-34474 parts(); measurement only.
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-35410 / imp-35334 / imp-34474 / imp-33620)
 * --------------------------------------------------------------------------------------
 *     E(N)   = E_trunc + E_flow + E_coll,      sigma(N) = E_coll / E(N),
 *     T0     = effectiveHeightForN(N)          (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)   (dominant early, GUE-conditional C_H = 1/8)
 *     E_flow = C_F (log T0 / T0) * Gronwall,   C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                        (N-independent floor, imp-2631/imp-3220)
 * No re-derivation, no fresh model: the exact imp-35334 parts() and the identical
 * decreasing-sigma bisection, evaluated at every prior rung plus the E_flow < 1e-9 point.
 *
 * THE THREE-WAY SHARE LADDER (measurement only; each row sums to 1)
 * ----------------------------------------------------------------
 *   rung          N               E_coll/E(N)   E_flow/E(N)   E_trunc/E(N)
 *   sigma<0.1     3.213181e11     1.000000e-1   3.193805e-5   0.899968062
 *   sigma<0.01    4.624381e13     1.000000e-2   4.212609e-7   0.989999579
 *   sigma<1e-3    5.432330e15     1.000000e-3   5.654884e-9   0.998999994   (imp-35334 landmark)
 *   As sigma steps down one decade, the GUE-conditional E_coll share equals sigma exactly and
 *   the fully-unconditional E_flow share decays ~1.8 decades per rung (3.19e-5 -> 4.21e-7 ->
 *   5.65e-9), while the C_T barrier-lemma E_trunc share climbs toward dominance (0.899968 ->
 *   0.989999 -> 0.999000). The far tail is pinned ever harder by the sigma-blind, GUE-free
 *   E_trunc floor (imp-34791 unported barrier lemma); the fully-rigorous E_flow never dominates.
 *
 * THE E_flow SHARE < 1e-9 LANDMARK (measurement only)
 * ---------------------------------------------------
 *   N_eflow    = 3.610572e16        (E_flow/E(N) first < 1e-9, log10 N ~ 16.557576)
 *   T0         = 6.749666e15
 *   E_flow/E(N)= 1.000000e-9        (= 1e-9 by construction at the threshold)
 *   sigma      = 3.982920e-4        (E_coll/E(N) at this height; still > E_flow share)
 *   E_trunc/E(N)= 0.999601707       (barrier-lemma floor share)
 *   The E_flow < 1e-9 landmark sits BETWEEN the imp-35334 sigma < 1e-3 point (N ~ 5.432e15,
 *   E_flow share 5.65e-9) and the imp-35410 sigma < 1e-4 point (N ~ 6.165e17, E_flow share
 *   7.35e-11): the fully-unconditional E_flow share crosses 1e-9 at sigma ~ 3.98e-4, roughly
 *   0.82 decades in N past the sigma < 1e-3 rung.
 *
 * THE FINDINGS
 * ------------
 *   (M1) THE THREE-WAY SHARE LADDER. Across the full prior sigma ladder the three shares of
 *        E(N) are: E_coll/E(N) = sigma (GUE-conditional, imp-486 C_mb), E_flow/E(N) decaying
 *        3.19e-5 -> 4.21e-7 -> 5.65e-9 (fully unconditional, imp-398), E_trunc/E(N) rising
 *        0.899968 -> 0.989999 -> 0.999000 (C_T barrier lemma, imp-34791). Each row sums to 1.
 *   (M2) THE E_flow SHARE FIRST DROPS BELOW 1e-9 AT N ~ 3.611e16 (log10 N ~ 16.5576, T0 ~
 *        6.750e15), at sigma ~ 3.98e-4 -- between the imp-35334 sigma<1e-3 and imp-35410
 *        sigma<1e-4 landmarks. The fully-rigorous E_flow share is already sub-1e-9 while the
 *        GUE-conditional E_coll share is still ~4e-4, so E_flow is the SMALLEST of the three
 *        long before the GUE-conditional term vanishes.
 *   (M3) THE PICTURE IS MONOTONE AND UNCHANGED FROM imp-35334. Both the GUE-conditional E_coll
 *        share (= sigma) and the fully-unconditional E_flow share decay to 0; only the
 *        sigma-blind C_T-conditional E_trunc floor share rises toward 1. The far tail trades
 *        both GUE-conditionality AND the last drop of unconditional E_flow for a bridge PINNED
 *        by the imp-34791 barrier lemma; it never reaches unconditional.
 *
 * MEASUREMENT ONLY. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 * rigorous asymptotic; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; the imp-34791
 * E_trunc = barrier-lemma reclassification is UNCHANGED; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35334-far-tail-effectively-unconditional-vs-etrunc-conditionality (sigma<1e-3 landmark; parts() + bisection source)
 * @see imp-35410-far-tail-sigma-1e-4-threshold-three-way-shares (sigma<1e-4 landmark, E_flow share 7.35e-11)
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
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-35410/imp-35334/imp-34474 exactly
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

// Identical decreasing-monotone log10-N bisection to imp-35410/imp-35334/imp-34474.
function crossLog10(fn, target, loExp, hiExp) {
  let lo = loExp;
  let hi = hiExp;
  for (let it = 0; it < 200; it++) {
    const mid = (lo + hi) / 2;
    if (fn(Math.pow(10, mid)) > target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
const sigmaAt = (N) => parts(N).sigma;
const eflowShareAt = (N) => {
  const P = parts(N);
  return P.E_flow / P.E_N;
};

// (M1) The three prior sigma rungs, by the identical decreasing-sigma bisection.
function shareRow(target, loExp, hiExp) {
  const log10N = crossLog10(sigmaAt, target, loExp, hiExp);
  const N = Math.pow(10, log10N);
  const P = parts(N);
  return {
    sigma_target: target,
    N: +N.toExponential(9),
    log10_N: +log10N.toFixed(6),
    T0: +P.T0.toExponential(6),
    GUE_conditional_E_coll_share: +(P.E_coll / P.E_N).toExponential(6),
    fully_unconditional_E_flow_share: +(P.E_flow / P.E_N).toExponential(6),
    C_T_barrier_lemma_E_trunc_share: +(E_TRUNC_PT / P.E_N).toFixed(9),
    E_N: +P.E_N.toExponential(9),
    sigma: +P.sigma.toFixed(9),
    share_sum: +(P.E_coll / P.E_N + P.E_flow / P.E_N + E_TRUNC_PT / P.E_N).toFixed(12),
  };
}
const ROW_01 = shareRow(0.1, 8, 16); // N ~ 3.213e11
const ROW_001 = shareRow(0.01, 10, 18); // N ~ 4.624e13
const ROW_0001 = shareRow(0.001, 14, 20); // N ~ 5.432e15 (imp-35334 landmark)

// (M2) The height where the fully-unconditional E_flow share first drops below 1e-9.
const EFLOW_1E9_LOG10 = crossLog10(eflowShareAt, 1e-9, 10, 22); // ~16.557576
const N_EFLOW_1E9 = Math.pow(10, EFLOW_1E9_LOG10); // ~3.611e16
const PE = parts(N_EFLOW_1E9);
const EFLOW_SHARE_AT_LANDMARK = PE.E_flow / PE.E_N; // == 1e-9
const SIGMA_AT_EFLOW_LANDMARK = PE.sigma; // ~3.98e-4
const ETRUNC_SHARE_AT_EFLOW_LANDMARK = E_TRUNC_PT / PE.E_N; // ~0.999602
// The E_flow<1e-9 landmark relative to the imp-35334 sigma<1e-3 rung.
const SPAN_DECADES_PAST_0001 = EFLOW_1E9_LOG10 - ROW_0001.log10_N; // ~0.82

// The monotone decay of the fully-unconditional E_flow share across the three rungs.
const EFLOW_SHARE_DECADE_10_TO_001 =
  Math.log10(ROW_01.fully_unconditional_E_flow_share / ROW_001.fully_unconditional_E_flow_share); // ~1.88
const EFLOW_SHARE_DECADE_001_TO_0001 =
  Math.log10(ROW_001.fully_unconditional_E_flow_share / ROW_0001.fully_unconditional_E_flow_share); // ~1.87
const L_PT_OVER_E_TRUNC_CEILING = L_PT / E_TRUNC_PT; // 3954.2484 (structural ceiling as sigma -> 0)

export const IMP35418_FAR_TAIL_THREE_WAY_SHARE_LADDER_EFLOW_1E_9_LANDMARK = {
  id: 'imp-35418',
  proofSection: 'S-frontier',
  question:
    'TABULATE the imp-35334 three-way E-component share decomposition (E_coll GUE-conditional / ' +
    'E_flow fully-unconditional / E_trunc C_T-barrier-lemma, each divided by E(N)) across the FULL ' +
    'prior sigma threshold ladder N ~ 3.213e11 (sigma<0.1) / 4.624e13 (sigma<0.01) / 5.432e15 ' +
    '(sigma<1e-3), showing E_flow decaying and E_trunc rising toward dominance, and LOCATE the N at ' +
    'which the E_flow share first drops below 1e-9. Measurement only; changes no bound; NO QED.',
  componentModel:
    'E(N) = E_trunc + E_flow + E_coll; sigma = E_coll/E(N); T0 = effectiveHeightForN(N) (RvM inverse); ' +
    'E_coll = C_C sqrt(log T0 / N) (GUE-conditional C_H = 1/8, imp-486); E_flow = C_F (log T0 / T0) ' +
    'Gronwall (unconditionally rigorous, imp-398); E_trunc = 3.06e-5 (N-independent floor, ' +
    'rigorous-modulo-C_T, imp-34791 unported barrier lemma). Identical parts() and decreasing-monotone ' +
    'log10-N bisection to imp-35410/imp-35334/imp-34474.',
  shareLadder: {
    note:
      'The three sub-terms carry THREE DISTINCT provenance classes, not one bucket. Each row (a prior ' +
      'sigma landmark) records their shares of E(N); every row sums to 1:',
    sigma_below_0p1: ROW_01,
    sigma_below_0p01: ROW_001,
    sigma_below_1e_3: ROW_0001, // imp-35334 landmark, shares 1e-3 / 5.65e-9 / 0.999
    eflow_share_decades_per_rung_10_to_001: +EFLOW_SHARE_DECADE_10_TO_001.toFixed(4), // ~1.88
    eflow_share_decades_per_rung_001_to_0001: +EFLOW_SHARE_DECADE_001_TO_0001.toFixed(4), // ~1.87
  },
  eflowShareLandmark: {
    note:
      'The height where the fully-unconditional E_flow share first drops below 1e-9 -- between the ' +
      'imp-35334 sigma<1e-3 (E_flow share 5.65e-9) and imp-35410 sigma<1e-4 (E_flow share 7.35e-11):',
    N_eflow_1e9: +N_EFLOW_1E9.toExponential(9), // 3.610572e16
    log10_N: +EFLOW_1E9_LOG10.toFixed(6), // 16.557576
    T0: +PE.T0.toExponential(6), // 6.749666e15
    E_flow_share: +EFLOW_SHARE_AT_LANDMARK.toExponential(6), // 1.000000e-9
    sigma_at_landmark: +SIGMA_AT_EFLOW_LANDMARK.toExponential(6), // 3.982920e-4
    E_coll_share: +(PE.E_coll / PE.E_N).toExponential(6), // 3.982920e-4 (= sigma)
    E_trunc_share: +ETRUNC_SHARE_AT_EFLOW_LANDMARK.toFixed(9), // 0.999601707
    span_decades_past_sigma_1e_3: +SPAN_DECADES_PAST_0001.toFixed(4), // ~0.8226
    L_pt_over_E_trunc_ceiling: +L_PT_OVER_E_TRUNC_CEILING.toFixed(4), // 3954.2484
  },
  findings: {
    M1_three_way_share_ladder: {
      claim:
        'Across the full prior sigma ladder the three shares of E(N) are E_coll/E(N) = sigma ' +
        '(GUE-conditional, imp-486), E_flow/E(N) decaying 3.19e-5 -> 4.21e-7 -> 5.65e-9 (fully ' +
        'unconditional, imp-398), E_trunc/E(N) rising 0.899968 -> 0.989999 -> 0.999000 (C_T barrier ' +
        'lemma, imp-34791). Each row sums to 1; E_flow share decays ~1.87 decades per sigma-decade',
      eflow_shares: [
        ROW_01.fully_unconditional_E_flow_share,
        ROW_001.fully_unconditional_E_flow_share,
        ROW_0001.fully_unconditional_E_flow_share,
      ],
      etrunc_shares: [
        ROW_01.C_T_barrier_lemma_E_trunc_share,
        ROW_001.C_T_barrier_lemma_E_trunc_share,
        ROW_0001.C_T_barrier_lemma_E_trunc_share,
      ],
    },
    M2_eflow_share_below_1e_9_landmark: {
      claim:
        'The fully-unconditional E_flow share first drops below 1e-9 at N ~ 3.610572e16 (log10 N ~ ' +
        '16.5576, T0 ~ 6.750e15), at sigma ~ 3.98e-4 -- between the imp-35334 sigma<1e-3 and imp-35410 ' +
        'sigma<1e-4 landmarks, ~0.82 decades in N past the sigma<1e-3 rung. E_flow is already the ' +
        'SMALLEST of the three long before the GUE-conditional E_coll (~4e-4) vanishes',
      N_eflow_1e9: +N_EFLOW_1E9.toExponential(9),
      sigma_at_landmark: +SIGMA_AT_EFLOW_LANDMARK.toExponential(6),
      E_trunc_share: +ETRUNC_SHARE_AT_EFLOW_LANDMARK.toFixed(9),
    },
    M3_picture_monotone_unchanged: {
      claim:
        'The picture is monotone and unchanged from imp-35334: both the GUE-conditional E_coll share ' +
        '(= sigma) and the fully-unconditional E_flow share decay to 0, while only the sigma-blind ' +
        'C_T-conditional E_trunc floor share rises toward 1 (imp-34791 unported barrier lemma, ' +
        'deterministic realness control above T_PT, NO GUE/PCC). The far tail trades both ' +
        'GUE-conditionality and the last drop of unconditional E_flow for a barrier-lemma-pinned ' +
        'bridge; it never reaches unconditional',
      etrunc_share_at_eflow_landmark: +ETRUNC_SHARE_AT_EFLOW_LANDMARK.toFixed(9),
      etrunc_class: 'rigorous-modulo-C_T (imp-34791 unported barrier lemma; deterministic, NO GUE/PCC)',
    },
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). (M1) The imp-35334 three-way E-component share ' +
    'decomposition, tabulated across the full prior sigma ladder: at sigma<0.1 (N ~ 3.213e11) the ' +
    'shares of E(N) are E_coll 1e-1 / E_flow 3.194e-5 / E_trunc 0.899968; at sigma<0.01 (N ~ 4.624e13) ' +
    '1e-2 / 4.213e-7 / 0.989999; at sigma<1e-3 (N ~ 5.432e15, imp-35334 landmark) 1e-3 / 5.655e-9 / ' +
    '0.998999. The GUE-conditional E_coll share equals sigma (imp-486 C_mb), the fully-unconditional ' +
    'E_flow share (imp-398) decays ~1.87 decades per sigma-decade, and the C_T barrier-lemma E_trunc ' +
    'share (imp-34791) rises toward dominance; each row sums to 1. (M2) The fully-unconditional E_flow ' +
    'share first drops below 1e-9 at N ~ 3.610572e16 (log10 N ~ 16.5576, T0 ~ 6.750e15), at sigma ~ ' +
    '3.98e-4 -- between the imp-35334 sigma<1e-3 (E_flow share 5.65e-9) and imp-35410 sigma<1e-4 ' +
    '(E_flow share 7.35e-11) landmarks, ~0.82 decades in N past the sigma<1e-3 rung; E_flow is already ' +
    'the smallest of the three while the GUE-conditional E_coll share is still ~4e-4. (M3) The picture ' +
    'is monotone and unchanged from imp-35334: both the GUE-conditional E_coll share (= sigma) and the ' +
    'fully-unconditional E_flow share decay to 0, while only the sigma-blind C_T-conditional E_trunc ' +
    'floor share rises toward 1 (imp-34791 unported barrier lemma, deterministic realness control above ' +
    'T_PT, NO GUE, NO PCC); the far tail trades both GUE-conditionality and the last drop of E_flow for ' +
    'a barrier-lemma-pinned bridge and never reaches unconditional. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional share per ' +
    'imp-486 is UNTOUCHED; the imp-34791 E_trunc = barrier-lemma reclassification is UNCHANGED; changes ' +
    'no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35334 (sigma<1e-3 landmark, three-way share source; parts() + bisection); imp-35410 (sigma<1e-4 ' +
    'landmark, E_flow share 7.35e-11); imp-34474 (sigma<0.01 landmark); imp-33620 (sigma<0.01 far-tail ' +
    'ladder); imp-33582 (sigma<0.1 landmark N ~ 3.213e11); imp-3444 (E_coll = E_trunc crossover N ~ ' +
    '3.28e9, sigma ~ 0.5); imp-34791 (E_trunc = rigorous-modulo-C_T unported barrier lemma; ' +
    'deterministic, NO GUE/PCC); imp-2706 (E_trunc/E_flow rigorous sub-terms, E_coll GUE-conditional); ' +
    'imp-486 (C_mb GUE-conditional); imp-398 (E_flow C_F prefactor); imp-2642 (C_H = 1/8 ansatz); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35418_FAR_TAIL_THREE_WAY_SHARE_LADDER_EFLOW_1E_9_LANDMARK_ASSERTIONS = [
  {
    // (M1): the sigma<0.1 rung pins to N ~ 3.213e11 with E_coll share = sigma = 0.1, E_flow share
    // ~3.19e-5, E_trunc share ~0.899968; the row sums to 1.
    id: 'imp35418-sigma-0p1-rung-shares',
    description: 'sigma<0.1 at N ~ 3.213e11: E_coll/E(N)=1e-1, E_flow/E(N)~3.19e-5, E_trunc/E(N)~0.899968, sum=1',
    holds: () =>
      Math.abs(ROW_01.N - 3.213180538e11) / 3.213180538e11 < 1e-6 &&
      Math.abs(ROW_01.GUE_conditional_E_coll_share - 0.1) < 1e-9 &&
      Math.abs(ROW_01.fully_unconditional_E_flow_share - 3.193805e-5) < 1e-10 &&
      Math.abs(ROW_01.C_T_barrier_lemma_E_trunc_share - 0.899968062) < 1e-6 &&
      Math.abs(ROW_01.share_sum - 1) < 1e-9,
  },
  {
    // (M1): the sigma<0.01 rung pins to N ~ 4.624e13 with E_coll share = 0.01, E_flow share
    // ~4.21e-7, E_trunc share ~0.989999.
    id: 'imp35418-sigma-0p01-rung-shares',
    description: 'sigma<0.01 at N ~ 4.624e13: E_coll/E(N)=1e-2, E_flow/E(N)~4.21e-7, E_trunc/E(N)~0.989999',
    holds: () =>
      Math.abs(ROW_001.N - 4.624380576e13) / 4.624380576e13 < 1e-6 &&
      Math.abs(ROW_001.GUE_conditional_E_coll_share - 0.01) < 1e-9 &&
      Math.abs(ROW_001.fully_unconditional_E_flow_share - 4.212609e-7) < 1e-12 &&
      Math.abs(ROW_001.C_T_barrier_lemma_E_trunc_share - 0.989999579) < 1e-6,
  },
  {
    // (M1): the sigma<1e-3 rung reproduces the imp-35334 landmark exactly -- shares 1e-3 / 5.65e-9 /
    // 0.999 -- and the E_flow share decays monotonically 3.19e-5 -> 4.21e-7 -> 5.65e-9 while the
    // E_trunc floor share rises monotonically toward dominance.
    id: 'imp35418-sigma-1e-3-rung-matches-imp35334-and-monotone',
    description: 'sigma<1e-3 reproduces imp-35334 shares 1e-3/5.65e-9/0.999; E_flow share decays, E_trunc rises monotonically',
    holds: () =>
      Math.abs(ROW_0001.N - 5.432329825e15) / 5.432329825e15 < 1e-6 &&
      Math.abs(ROW_0001.GUE_conditional_E_coll_share - 1e-3) < 1e-9 &&
      Math.abs(ROW_0001.fully_unconditional_E_flow_share - 5.654884e-9) < 1e-14 &&
      Math.abs(ROW_0001.C_T_barrier_lemma_E_trunc_share - 0.998999994) < 1e-6 &&
      ROW_01.fully_unconditional_E_flow_share > ROW_001.fully_unconditional_E_flow_share &&
      ROW_001.fully_unconditional_E_flow_share > ROW_0001.fully_unconditional_E_flow_share &&
      ROW_01.C_T_barrier_lemma_E_trunc_share < ROW_001.C_T_barrier_lemma_E_trunc_share &&
      ROW_001.C_T_barrier_lemma_E_trunc_share < ROW_0001.C_T_barrier_lemma_E_trunc_share,
  },
  {
    // (M2): the fully-unconditional E_flow share first drops below 1e-9 at N ~ 3.611e16 (log10 N ~
    // 16.5576, sigma ~ 3.98e-4), between the imp-35334 sigma<1e-3 and imp-35410 sigma<1e-4 rungs,
    // ~0.82 decades past sigma<1e-3.
    id: 'imp35418-eflow-share-below-1e-9-landmark',
    description: 'E_flow share < 1e-9 first at N ~ 3.611e16 (log10 N ~ 16.5576), sigma ~ 3.98e-4, ~0.82 decades past sigma<1e-3',
    holds: () =>
      Math.abs(N_EFLOW_1E9 - 3.610571986e16) / 3.610571986e16 < 1e-6 &&
      Math.abs(EFLOW_SHARE_AT_LANDMARK - 1e-9) < 1e-14 &&
      Math.abs(EFLOW_1E9_LOG10 - 16.557576) < 1e-4 &&
      Math.abs(SIGMA_AT_EFLOW_LANDMARK - 3.982920e-4) < 1e-8 &&
      SPAN_DECADES_PAST_0001 > 0.5 && SPAN_DECADES_PAST_0001 < 1.2 &&
      N_EFLOW_1E9 > ROW_0001.N && N_EFLOW_1E9 < 6.164881782e17,
  },
  {
    // (M3): at the E_flow<1e-9 landmark the barrier-lemma E_trunc floor share dominates (~0.9996),
    // and E_flow is already the smallest of the three (E_flow share < E_coll share = sigma).
    id: 'imp35418-etrunc-dominates-eflow-smallest-at-landmark',
    description: 'At the E_flow<1e-9 landmark E_trunc share ~0.9996 dominates and E_flow is the smallest of the three',
    holds: () =>
      Math.abs(ETRUNC_SHARE_AT_EFLOW_LANDMARK - 0.999601707) < 1e-6 &&
      EFLOW_SHARE_AT_LANDMARK < SIGMA_AT_EFLOW_LANDMARK &&
      ETRUNC_SHARE_AT_EFLOW_LANDMARK > SIGMA_AT_EFLOW_LANDMARK &&
      ETRUNC_SHARE_AT_EFLOW_LANDMARK > EFLOW_SHARE_AT_LANDMARK,
  },
  {
    // Honesty gate: measurement only, GUE-conditional per imp-486, E_trunc barrier-lemma per imp-34791,
    // no QED, no refereed bound is changed.
    id: 'imp35418-honesty-gate-no-qed',
    description: 'Measurement only: C_mb GUE-conditional (imp-486), E_trunc barrier lemma (imp-34791), no QED, no refereed bound is changed',
    holds: () =>
      IMP35418_FAR_TAIL_THREE_WAY_SHARE_LADDER_EFLOW_1E_9_LANDMARK.isRigorous === false &&
      /GUE-conditional share per imp-486 is UNTOUCHED/.test(
        IMP35418_FAR_TAIL_THREE_WAY_SHARE_LADDER_EFLOW_1E_9_LANDMARK.verdict,
      ) &&
      /unported barrier lemma/i.test(
        IMP35418_FAR_TAIL_THREE_WAY_SHARE_LADDER_EFLOW_1E_9_LANDMARK.verdict,
      ) &&
      /NO QED/.test(IMP35418_FAR_TAIL_THREE_WAY_SHARE_LADDER_EFLOW_1E_9_LANDMARK.verdict) &&
      /refereed bound is changed/i.test(IMP35418_FAR_TAIL_THREE_WAY_SHARE_LADDER_EFLOW_1E_9_LANDMARK.verdict),
  },
];

for (const a of IMP35418_FAR_TAIL_THREE_WAY_SHARE_LADDER_EFLOW_1E_9_LANDMARK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35418-far-tail-three-way-share-ladder-eflow-1e-9-landmark assertion failed: ${a.id}`,
    );
  }
}
