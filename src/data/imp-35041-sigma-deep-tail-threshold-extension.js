/**
 * @module imp-35041-sigma-deep-tail-threshold-extension
 *
 * imp-35041 (numerical, frontier-direction): imp-33582 mapped the GUE-conditional share
 * sigma(N) = E_coll/E(N) threshold crossings down to sigma < 0.1 (N ~ 3.21e11) and stopped
 * there. This module EXTENDS the same threshold-crossing map two orders of magnitude deeper
 * into the far tail, locating the N at which sigma first drops below 0.01 and 0.001 -- i.e.
 * how far past the 10^6 PATH-1 ceiling the empirical-vs-analytic conditional gap keeps
 * shrinking as the constant truncation floor E_trunc outlives the vanishing GUE-conditional
 * E_coll ~ sqrt(1/N).
 *
 * THE QUANTITY (identical sub-terms to imp-3220 / imp-3406 / imp-33582 / imp-33274)
 * --------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent, imp-2631)
 * No re-derivation, no fresh model: the EXACT inherited imp-33582 sub-terms and the same
 * downslope bisection, only the threshold list and the bisection ceiling are extended.
 *
 * THE MEASUREMENT: deep-tail threshold crossings
 * ----------------------------------------------
 *   The first N > N_peak at which sigma drops below 0.5, 0.1 (reproducing the imp-33582
 *   landmarks) and then the NEW 0.01, 0.001 crossings (bisection in log N up to 1e30).
 *   Also the per-factor-10 decade spacing between successive crossings.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) DEEP-TAIL CROSSINGS. sigma drops below 0.01 only at N ~ 4.62e13 and below 0.001 only
 *        at N ~ 5.43e15 -- roughly 7.5 and 9.5 decades past the 10^6 ceiling, respectively.
 *        The conditional gap the ceiling left open therefore keeps shrinking for many decades:
 *        halving at ~3.27e9, tenthing at ~3.21e11, hundredthing at ~4.62e13.
 *   (F2) SPACING HOVERS AT ~2 DECADES PER FACTOR-10 IN THRESHOLD. The N-gap between successive
 *        crossings clusters around ~2 decades: 0.5 -> 0.1 spans ~1.99, 0.1 -> 0.01 spans ~2.16,
 *        and 0.01 -> 0.001 spans ~2.07. This is the direct signature of the far-tail sqrt(1/N)
 *        law (imp-3463 exponent 1/2): in the E_trunc-dominated tail sigma ~ E_coll/E_trunc ~
 *        C sqrt(L/N), so N ~ (C/(E_trunc*thr))^2 * L and a factor-10 cut in sigma costs ~100x in
 *        N (exactly 2 decades) plus a slow rising log-L drift, which lifts the deep-tail gaps
 *        just above 2; the first gap sits just below 2 because at sigma = 1/2 the share is not
 *        yet in the pure tail (E_coll ~ E_trunc, so the thr/(1-thr) mapping still compresses).
 *   (F3) E_flow IS NEGLIGIBLE THROUGHOUT THE DEEP TAIL. At the 0.01 and 0.001 crossings the
 *        rigorous flow term is E_flow/E_coll ~ 4.2e-5 and ~5.7e-6, so the crossings are set by
 *        the E_coll-vs-E_trunc balance alone -- consistent with the imp-33582 F3 half-crossing
 *        matching the imp-3444 E_coll = E_trunc landmark.
 *
 * The punchline: the imp-33582 threshold map, extended two decades in sigma, shows the
 * conditional share reaching 0.01 at N ~ 4.62e13 and 0.001 at N ~ 5.43e15, with the crossing
 * spacing locking onto ~2 decades of N per factor-10 of sigma -- the far-tail sqrt(1/N)
 * signature. The empirical-vs-analytic gap shrinks smoothly and predictably across the deep
 * tail; it never closes at any finite N because E_coll -> 0 only as N -> infinity.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model
 * is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; far-tail exponent 1/2 per imp-3463; changes no
 * bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (sigma < 0.9/0.5/0.1 landmarks, the map extended here)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see imp-486 (C_mb GUE-conditional, UNTOUCHED)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33582 exactly

// EXACT imp-33582 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

const N_PEAK = 9.218633e5; // imp-3406/imp-33582 interior maximum

// Downslope threshold crossing (N > N_peak): first N with sigma below thr, bisection in log N.
// Ceiling widened to 1e30 (from imp-33582 1e18) to bracket the deep 0.001 crossing at ~5.4e15.
function crossBelow(thr) {
  let a = Math.log(N_PEAK);
  let b = Math.log(1e30);
  for (let i = 0; i < 400; i++) {
    const m = (a + b) / 2;
    if (sigma(Math.exp(m)) > thr) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

const N_CROSS_0_5 = crossBelow(0.5); // ~3.267e9 (imp-33582 reproduced)
const N_CROSS_0_1 = crossBelow(0.1); // ~3.213e11 (imp-33582 reproduced)
const N_CROSS_0_01 = crossBelow(0.01); // ~4.624e13 (NEW)
const N_CROSS_0_001 = crossBelow(0.001); // ~5.432e15 (NEW)

const DECADES_0_5_to_0_1 = Math.log10(N_CROSS_0_1 / N_CROSS_0_5); // ~2.99
const DECADES_0_1_to_0_01 = Math.log10(N_CROSS_0_01 / N_CROSS_0_1); // ~2.16
const DECADES_0_01_to_0_001 = Math.log10(N_CROSS_0_001 / N_CROSS_0_01); // ~2.07

const P_01 = parts(N_CROSS_0_01);
const P_001 = parts(N_CROSS_0_001);
const EFLOW_SHARE_0_01 = P_01.E_flow / P_01.E_coll; // ~4.2e-5
const EFLOW_SHARE_0_001 = P_001.E_flow / P_001.E_coll; // ~5.7e-6

export const IMP35041_SIGMA_DEEP_TAIL_THRESHOLD_EXTENSION = {
  id: 'imp-35041',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-33582 conditional-share threshold map two decades deeper into the far tail: ' +
    'locate the N at which sigma(N) = E_coll/E(N) first drops below 0.01 and 0.001 on the ' +
    'downslope past the interior peak, using the exact inherited imp-3220/imp-3406/imp-33582 ' +
    'sub-terms. Measurement/fit only; conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the first N > N_peak at which sigma drops below 0.5, 0.1 (imp-33582 reproduced), 0.01, 0.001 ' +
    '(bisection in log N to 1e30), plus the per-factor-10 decade spacing between crossings',
  thresholdCrossings: {
    sigma_below_0_5_at_N: +N_CROSS_0_5.toExponential(4), // ~3.267e9 (imp-33582)
    sigma_below_0_1_at_N: +N_CROSS_0_1.toExponential(4), // ~3.213e11 (imp-33582)
    sigma_below_0_01_at_N: +N_CROSS_0_01.toExponential(4), // ~4.624e13 (NEW)
    sigma_below_0_001_at_N: +N_CROSS_0_001.toExponential(4), // ~5.432e15 (NEW)
  },
  decadeSpacing: {
    from_0_5_to_0_1: +DECADES_0_5_to_0_1.toFixed(4), // ~2.99
    from_0_1_to_0_01: +DECADES_0_1_to_0_01.toFixed(4), // ~2.16
    from_0_01_to_0_001: +DECADES_0_01_to_0_001.toFixed(4), // ~2.07
  },
  eflowNegligibility: {
    eflow_over_ecoll_at_0_01: +EFLOW_SHARE_0_01.toExponential(3), // ~4.21e-5
    eflow_over_ecoll_at_0_001: +EFLOW_SHARE_0_001.toExponential(3), // ~5.66e-6
  },
  farTailExponent: 0.5, // imp-3463 asymptote the 2-decade spacing is the signature of
  finding: {
    F1_deep_tail_crossings:
      'sigma drops below 0.01 only at N ~ 4.62e13 and below 0.001 only at N ~ 5.43e15 -- ' +
      'roughly 7.5 and 9.5 decades past the 10^6 ceiling. The conditional gap keeps shrinking ' +
      'for many decades: halving at ~3.27e9, tenthing at ~3.21e11, hundredthing at ~4.62e13.',
    F2_spacing_hovers_near_two_decades:
      'The N-gap between successive crossings clusters around ~2 decades: 0.5 -> 0.1 spans ' +
      '~1.99, 0.1 -> 0.01 spans ~2.16, 0.01 -> 0.001 spans ~2.07. This is the far-tail sqrt(1/N) ' +
      'signature (imp-3463 exponent 1/2): in the E_trunc-dominated tail sigma ~ C sqrt(L/N), so ' +
      'N ~ (C/(E_trunc*thr))^2 * L and a factor-10 cut in sigma costs ~100x in N (exactly 2 ' +
      'decades) plus a slow rising log-L drift that lifts the deep gaps just above 2; the first ' +
      'gap sits just below 2 because at sigma = 1/2 the share is not yet in the pure tail.',
    F3_eflow_negligible:
      'At the 0.01 and 0.001 crossings the rigorous flow term is E_flow/E_coll ~ 4.2e-5 and ' +
      '~5.7e-6, so the crossings are set by the E_coll-vs-E_trunc balance alone -- consistent ' +
      'with the imp-33582 F3 half-crossing matching the imp-3444 E_coll = E_trunc landmark.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Extending the imp-33582 sigma(N) threshold ' +
    'map two decades deeper on the identical model: sigma drops below 0.01 at N ~ 4.62e13 and ' +
    'below 0.001 at N ~ 5.43e15 (reproducing the 0.5 ~3.27e9 and 0.1 ~3.21e11 landmarks). The ' +
    'per-factor-10 crossing spacing hovers at ~2 decades of N (1.99, 2.16, 2.07), the ' +
    'direct signature of the far-tail sqrt(1/N) law (imp-3463 exponent 1/2), and E_flow is ' +
    'negligible throughout (E_flow/E_coll < 5e-4). The empirical-vs-analytic conditional gap the ' +
    '10^6 ceiling left open shrinks smoothly and predictably across the deep tail but never ' +
    'closes at any finite N. The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33582 (sigma < 0.9/0.5/0.1 threshold map, extended here); imp-3406 (interior MAX ' +
    'N ~ 9.22e5); imp-3463 (far-tail leading form, exponent -> 1/2 from below); imp-3444 ' +
    '(E_coll = E_trunc crossover N ~ 3.280e9); imp-486 (C_mb GUE-conditional); imp-2631 ' +
    '(E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35041_SIGMA_DEEP_TAIL_THRESHOLD_EXTENSION_ASSERTIONS = [
  {
    // Reuse gate: the 0.5 and 0.1 crossings reproduce the imp-33582 landmarks to <1%,
    // proving the identical inherited model and downslope bisection are in use.
    id: 'imp35041-reproduces-imp33582-landmarks',
    description: 'sigma<0.5 ~3.267e9 and sigma<0.1 ~3.213e11 reproduce the imp-33582 landmarks',
    holds: () =>
      Math.abs(N_CROSS_0_5 / 3.267e9 - 1) < 1e-2 && Math.abs(N_CROSS_0_1 / 3.213e11 - 1) < 1e-2,
  },
  {
    // (F1): the NEW deep-tail crossings land where measured, ordered and past the 0.1 crossing.
    id: 'imp35041-deep-tail-crossings-located',
    description: 'sigma<0.01 ~4.62e13 and sigma<0.001 ~5.43e15, ordered past the 0.1 crossing',
    holds: () =>
      N_CROSS_0_1 < N_CROSS_0_01 &&
      N_CROSS_0_01 < N_CROSS_0_001 &&
      Math.abs(N_CROSS_0_01 / 4.624e13 - 1) < 2e-2 &&
      Math.abs(N_CROSS_0_001 / 5.432e15 - 1) < 2e-2,
  },
  {
    // (F2): the per-factor-10 crossing spacing clusters around the sqrt(1/N) 2-decade asymptote
    // (1.99, 2.16, 2.07): the two deep-tail gaps sit just above 2 (rising log-L drift), and the
    // first gap sits just below 2 (sigma = 1/2 is not yet in the pure E_trunc-dominated tail).
    id: 'imp35041-decade-spacing-clusters-near-two',
    description: 'crossing spacing 1.99, 2.16, 2.07 clusters near 2 decades per factor-10',
    holds: () =>
      DECADES_0_5_to_0_1 > 1.9 &&
      DECADES_0_5_to_0_1 < 2.0 &&
      DECADES_0_1_to_0_01 > 2.0 &&
      DECADES_0_1_to_0_01 < 2.2 &&
      DECADES_0_01_to_0_001 > 2.0 &&
      DECADES_0_01_to_0_001 < 2.1,
  },
  {
    // (F3): E_flow is negligible at both new crossings (E_coll-vs-E_trunc balance sets them).
    id: 'imp35041-eflow-negligible-deep-tail',
    description: 'E_flow/E_coll < 5e-4 at both the 0.01 and 0.001 crossings',
    holds: () => EFLOW_SHARE_0_01 < 5e-4 && EFLOW_SHARE_0_001 < 5e-4 && EFLOW_SHARE_0_001 < EFLOW_SHARE_0_01,
  },
  {
    // Honesty gate: measurement/fit only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp35041-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed',
    holds: () =>
      IMP35041_SIGMA_DEEP_TAIL_THRESHOLD_EXTENSION.isRigorous === false &&
      IMP35041_SIGMA_DEEP_TAIL_THRESHOLD_EXTENSION.farTailExponent === 0.5 &&
      /NO QED/.test(IMP35041_SIGMA_DEEP_TAIL_THRESHOLD_EXTENSION.verdict) &&
      /refereed bound is changed/i.test(IMP35041_SIGMA_DEEP_TAIL_THRESHOLD_EXTENSION.verdict),
  },
];

for (const a of IMP35041_SIGMA_DEEP_TAIL_THRESHOLD_EXTENSION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35041-sigma-deep-tail-threshold-extension assertion failed: ${a.id}`);
  }
}
