/**
 * @module imp-96286-eflow-peak-location-error-order
 *
 * imp-96286 (numerical, frontier-direction): MEASURE why the imp-96266 E_flow peak-recovery
 * reconstruction sigma_recon(N) = sigma_CF(N)(1 - E_flow/(E_trunc+E_coll)) recovers the imp-3220
 * interior maximum to <1e-3 in peak HEIGHT (0.948510 vs 0.949429) but only ~9.1e-2 in peak LOCATION
 * (N_recon ~ 1.006e6 vs N_full ~ 9.219e5). This module quantifies the source of the asymmetric
 * accuracy, tests a slope-drift (second-order) correction, and reports the residual location error.
 *
 * THE SETUP (exact inherited sub-terms, identical to imp-96266; no re-derivation)
 * ------------------------------------------------------------------------------
 * sigma_full(N) = E_coll / (E_trunc + E_flow + E_coll), sigma_CF(N) = E_coll/(E_trunc+E_coll) (the
 * E_flow-dropped closed form, coincident with the imp-96151 crossover form to machine epsilon). Write
 * x(N) = E_flow(N)/(E_trunc + E_coll(N)). Then the full share is the EXACT geometric relation
 *     sigma_full = E_coll/(E_trunc+E_coll+E_flow) = sigma_CF / (1 + x).
 * imp-96266 re-applies the FIRST-ORDER truncation sigma_recon = sigma_CF*(1 - x), the leading Taylor
 * term of sigma_CF/(1+x) = sigma_CF*(1 - x + x^2 - x^3 + ...). Every constant is the exact inherited
 * imp-3406/imp-33582/imp-33723 value; no fresh fit, no new model, no zeros bundle.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (M1) THE PEAK IS ANOMALOUSLY FLAT, AND THAT SPLITS THE ERROR BUDGET. The full-share interior
 *        maximum has a tiny second derivative, sigma_full''(N*) ~ -7.57e-15 (a very broad peak).
 *        For any reconstruction sigma_r = sigma_full + err, the peak HEIGHT error is |err(N*)| while
 *        the peak LOCATION shift is dN/N* ~ -err'(N*) / (N* sigma_full''(N*)). A broad peak (small
 *        sigma_full'') divides the slope by a near-zero curvature, so the SAME error term produces a
 *        large location shift and a small height shift -- the observed asymmetry is a flat-peak
 *        amplification, not a modeling defect.
 *   (M2) THE FIRST-ORDER TRUNCATION x^2 TERM ACCOUNTS FOR BOTH NUMBERS. The imp-96266 reconstruction
 *        drops the +x^2 term of 1/(1+x), so its error is err1(N) = sigma_CF*[(1-x) - 1/(1+x)] =
 *        -sigma_CF*x^2/(1+x). At the peak x ~ 3.155e-2, giving |err1| ~ 9.45e-4 = the peak height
 *        error (matches the imp-96266 measured 9.19e-4 peak-vs-peak). The err1 SLOPE ~ 6.43e-10
 *        against sigma_full'' ~ -7.57e-15 predicts a location shift dN/N* ~ 9.22e-2, matching the
 *        imp-96266 measured ~9.08e-2. Height error ~ term MAGNITUDE (~1e-3); location error ~ term
 *        SLOPE / curvature (~1e-1): the ~100x ratio IS the flat-peak amplification.
 *   (M3) THE SLOPE-DRIFT (SECOND-ORDER) CORRECTION CLOSES THE LOCATION GAP ~21x. Adding the next
 *        Taylor term, sigma_recon2(N) = sigma_CF*(1 - x + x^2), leaves the residual err2 = +sigma_CF*
 *        x^3/(1+x) ~ 2.98e-5 with slope ~ -3.05e-11, predicting dN/N* ~ -4.36e-3. Measured: peak
 *        location error drops from 9.08e-2 to 4.37e-3 (a ~21x reduction) and height error from
 *        9.19e-4 to 2.99e-5. The full geometric sum sigma_CF/(1+x) reproduces sigma_full to machine
 *        epsilon (an identity: location error ~1.7e-7, height error ~2e-16), confirming the ladder.
 *   (M4) RESIDUAL LOCATION ERROR AFTER THE CORRECTION. With the second-order (slope-drift) correction
 *        the residual peak location error is 4.37e-3 (0.44%), an O(x^3) term carrying the same flat-
 *        peak amplification; it is not a new obstruction -- each additional Taylor order (toward the
 *        exact 1/(1+x)) shrinks it by a further factor ~x ~ 3e-2.
 *
 * The punchline: the imp-96266 ~9% location / <1e-3 height asymmetry is the FIRST-ORDER Taylor
 * truncation of the exact relation sigma_full = sigma_CF/(1+x) interacting with an anomalously flat
 * peak (sigma_full'' ~ -7.6e-15). The dropped x^2 term sets the height error (~9.5e-4 in magnitude);
 * its SLOPE divided by the tiny curvature sets the location error (~9e-2). A slope-drift second-order
 * correction (1 - x + x^2) closes the location gap ~21x to 4.4e-3; the full 1/(1+x) is an identity.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. Component model is the inherited
 * imp-3220/imp-3406/imp-33723 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-96266-eflow-peak-recovery-residual (first-order reconstruction; ~9% location, <1e-3 height)
 * @see imp-96151-sigma-closed-form-crossover-fartail-reproduction (closed-form share model)
 * @see imp-3220-en-bridge-fidelity-frontier (interior peak sigma_max ~ 0.9494 at N ~ 9.22e5)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form crossover N_cross fixed point)
 * @see imp-486 (C_mb GUE-conditional, UNTOUCHED)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33582/imp-33723/imp-96151/imp-96266 exactly

// EXACT imp-3406/imp-33582/imp-33723 sub-terms (identical to imp-96266; no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { L, E_flow, E_coll, E_trunc: E_TRUNC_PT, E_N, sigma: E_coll / E_N };
}
const sigmaFull = (N) => parts(N).sigma;

// imp-33723 closed-form crossover fixed point (identical to imp-96266).
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2;
function crossoverFixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = K_AMPL * Math.log(effectiveHeightForN(N));
  return N;
}
const N_CROSS = crossoverFixedPoint(1e9, 60); // ~3.280294e9
const L_CROSS = Math.log(effectiveHeightForN(N_CROSS)); // ~20.8576
function sigmaCF(N) {
  const L = Math.log(effectiveHeightForN(N));
  return 1 / (1 + Math.sqrt(N / N_CROSS) * Math.sqrt(L_CROSS / L));
}
// x(N) = E_flow/(E_trunc+E_coll); sigma_full = sigmaCF/(1+x) is the exact geometric relation.
const xOf = (N) => {
  const p = parts(N);
  return p.E_flow / (p.E_trunc + p.E_coll);
};
const reconOrder1 = (N) => sigmaCF(N) * (1 - xOf(N)); // imp-96266 first-order (drops x^2)
const reconOrder2 = (N) => {
  const x = xOf(N);
  return sigmaCF(N) * (1 - x + x * x); // slope-drift second-order correction
};
const reconExact = (N) => sigmaCF(N) / (1 + xOf(N)); // full geometric sum == sigma_full (identity)

// Peak locator on a shrinking log grid over [1e4,1e8] (6 refinement passes; matches imp-96266).
function findPeak(f) {
  let bestN = 0;
  let bestS = -1;
  let lo = 4;
  let hi = 8;
  for (let iter = 0; iter < 6; iter++) {
    const step = (hi - lo) / 400;
    bestS = -1;
    for (let d = lo; d <= hi + 1e-12; d += step) {
      const N = Math.pow(10, d);
      const s = f(N);
      if (s > bestS) {
        bestS = s;
        bestN = N;
      }
    }
    const db = Math.log10(bestN);
    lo = db - step;
    hi = db + step;
  }
  return { N: bestN, sigma: bestS };
}

const PEAK_FULL = findPeak(sigmaFull);
const PEAK_O1 = findPeak(reconOrder1);
const PEAK_O2 = findPeak(reconOrder2);
const PEAK_EXACT = findPeak(reconExact);

const relLoc = (p) => Math.abs(p.N / PEAK_FULL.N - 1);
const absHt = (p) => Math.abs(p.sigma - PEAK_FULL.sigma);

const LOC_ERR_O1 = relLoc(PEAK_O1); // ~9.08e-2
const HT_ERR_O1 = absHt(PEAK_O1); // ~9.19e-4
const LOC_ERR_O2 = relLoc(PEAK_O2); // ~4.37e-3
const HT_ERR_O2 = absHt(PEAK_O2); // ~2.99e-5
const LOC_ERR_EXACT = relLoc(PEAK_EXACT); // ~1.65e-7 (identity)
const HT_ERR_EXACT = absHt(PEAK_EXACT); // ~2e-16 (identity)
const LOC_GAP_REDUCTION = LOC_ERR_O1 / LOC_ERR_O2; // ~20.8x

// Flat-peak amplification decomposition: curvature and the first-order error term slope at the peak.
const Ns = PEAK_FULL.N;
const dl = Ns * 1e-4;
const CURV_FULL = (sigmaFull(Ns + dl) - 2 * sigmaFull(Ns) + sigmaFull(Ns - dl)) / (dl * dl); // ~-7.57e-15
const err1 = (N) => reconOrder1(N) - sigmaFull(N); // = -sigmaCF*x^2/(1+x)
const err2 = (N) => reconOrder2(N) - sigmaFull(N); // = +sigmaCF*x^3/(1+x)
const ERR1_AT_PEAK = err1(Ns); // ~-9.45e-4 (magnitude sets the height error)
const ERR2_AT_PEAK = err2(Ns); // ~+2.98e-5
const ERR1_SLOPE = (err1(Ns + dl) - err1(Ns - dl)) / (2 * dl); // ~6.43e-10
const ERR2_SLOPE = (err2(Ns + dl) - err2(Ns - dl)) / (2 * dl); // ~-3.05e-11
// Predicted location shift dN/N* = -err'(N*) / (N* sigma_full''(N*)).
const PRED_SHIFT_O1 = -ERR1_SLOPE / (Ns * CURV_FULL); // ~9.22e-2 (matches measured LOC_ERR_O1)
const PRED_SHIFT_O2 = -ERR2_SLOPE / (Ns * CURV_FULL); // ~-4.36e-3 (matches measured LOC_ERR_O2)
const X_AT_PEAK = xOf(Ns); // ~3.155e-2

export const IMP96286_EFLOW_PEAK_LOCATION_ERROR_ORDER = {
  id: 'imp-96286',
  proofSection: 'S-frontier',
  question:
    'Measure why the imp-96266 E_flow peak-recovery reconstruction sigma_recon = sigma_CF*(1 - ' +
    'E_flow/(E_trunc+E_coll)) recovers the imp-3220 interior maximum to <1e-3 in peak HEIGHT but ' +
    'only ~9.1e-2 in peak LOCATION: quantify the first-order-suppression truncation error near the ' +
    'peak, test whether a slope-drift (second-order) correction closes the ~9% location gap, and ' +
    'report the residual location error. Measurement only; conditional-share diagnostic; no QED.',
  exactRelation:
    'sigma_full = E_coll/(E_trunc+E_coll+E_flow) = sigma_CF/(1 + x), x = E_flow/(E_trunc+E_coll). ' +
    'imp-96266 re-applies the FIRST-ORDER Taylor truncation sigma_CF*(1 - x) of sigma_CF/(1+x) = ' +
    'sigma_CF*(1 - x + x^2 - x^3 + ...); the dropped +x^2 term is the entire recovery error.',
  landmarks: {
    peak_N_full: +PEAK_FULL.N.toExponential(6), // ~9.218632e5
    peak_sigma_full: +PEAK_FULL.sigma.toFixed(6), // ~0.949429
    x_at_peak: +X_AT_PEAK.toExponential(4), // ~3.1552e-2
    curvature_sigma_full_at_peak: +CURV_FULL.toExponential(4), // ~-7.5685e-15 (broad/flat peak)
    err1_magnitude_at_peak: +ERR1_AT_PEAK.toExponential(4), // ~-9.4520e-4 (sets height error)
    err1_slope_at_peak: +ERR1_SLOPE.toExponential(4), // ~6.4337e-10 (sets location error)
    predicted_loc_shift_order1: +PRED_SHIFT_O1.toExponential(4), // ~9.2212e-2 (matches measured)
    predicted_loc_shift_order2: +PRED_SHIFT_O2.toExponential(4), // ~-4.3642e-3 (matches measured)
  },
  reconstructionLadder: {
    order1_1_minus_x: {
      peak_N: +PEAK_O1.N.toExponential(6), // ~1.005554e6
      loc_rel_err: +LOC_ERR_O1.toExponential(3), // ~9.08e-2
      height_abs_err: +HT_ERR_O1.toExponential(3), // ~9.19e-4
    },
    order2_1_minus_x_plus_x2: {
      peak_N: +PEAK_O2.N.toExponential(6), // ~9.178312e5
      loc_rel_err: +LOC_ERR_O2.toExponential(3), // ~4.37e-3
      height_abs_err: +HT_ERR_O2.toExponential(3), // ~2.99e-5
    },
    exact_geometric_1_over_1_plus_x: {
      peak_N: +PEAK_EXACT.N.toExponential(6), // ~9.218633e5
      loc_rel_err: +LOC_ERR_EXACT.toExponential(3), // ~1.65e-7 (identity)
      height_abs_err: +HT_ERR_EXACT.toExponential(3), // ~2.2e-16 (identity)
    },
    location_gap_reduction_order1_to_order2: +LOC_GAP_REDUCTION.toFixed(2), // ~20.76x
  },
  finding: {
    M1_flat_peak_splits_error_budget:
      'The full-share peak is anomalously flat: the second derivative sigma_full_pp(N*) ~ -7.57e-15. ' +
      'For sigma_r = sigma_full + err the height error is |err(N*)| but the location shift is ' +
      'dN/N* ~ -err_slope(N*)/(N* sigma_full_pp(N*)); a near-zero curvature divides the error slope by ' +
      'a tiny number, so the ' +
      'same error term gives a large location shift and a small height shift. The asymmetry is a ' +
      'flat-peak amplification, not a modeling defect.',
    M2_x2_term_sets_both_numbers:
      'The imp-96266 first-order reconstruction drops the +x^2 term of 1/(1+x), so its error is ' +
      'err1 = -sigma_CF*x^2/(1+x). At the peak x ~ 3.155e-2 gives |err1| ~ 9.45e-4 = the height ' +
      'error, while err1 slope ~ 6.43e-10 over sigma_full_pp ~ -7.57e-15 predicts a location shift ' +
      '~9.22e-2, matching the imp-96266 measured ~9.08e-2. Height error ~ term magnitude; location ' +
      'error ~ term slope / curvature -- the ~100x ratio is the flat-peak amplification.',
    M3_slope_drift_correction_closes_gap:
      'Adding the next Taylor term, sigma_recon2 = sigma_CF*(1 - x + x^2), leaves err2 = ' +
      '+sigma_CF*x^3/(1+x) ~ 2.98e-5 with slope ~ -3.05e-11 (predicted shift ~-4.36e-3). Measured: ' +
      'peak location error drops from 9.08e-2 to 4.37e-3 (~21x reduction) and height error from ' +
      '9.19e-4 to 2.99e-5. The full sum sigma_CF/(1+x) reproduces sigma_full to machine epsilon ' +
      '(location ~1.7e-7, height ~2e-16): an identity, confirming the ladder.',
    M4_residual_after_correction:
      'After the slope-drift (second-order) correction the residual peak location error is 4.37e-3 ' +
      '(0.44%), an O(x^3) term carrying the same flat-peak amplification; each further Taylor order ' +
      'toward the exact 1/(1+x) shrinks it by a further factor ~x ~ 3e-2. Not a new obstruction.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-96266 ~9% location / <1e-3 height ' +
    'asymmetry is the FIRST-ORDER Taylor truncation of the exact geometric relation sigma_full = ' +
    'sigma_CF/(1 + x), x = E_flow/(E_trunc+E_coll), interacting with an anomalously flat peak ' +
    '(sigma_full_pp ~ -7.6e-15). The dropped +x^2 term (x ~ 3.16e-2 at the peak) sets the height ' +
    'error via its MAGNITUDE (|err1| ~ 9.45e-4) and the location error via its SLOPE divided by the ' +
    'tiny curvature (predicted ~9.22e-2, measured ~9.08e-2). A slope-drift second-order correction ' +
    'sigma_CF*(1 - x + x^2) closes the location gap ~21x to 4.37e-3 (height 2.99e-5); the full ' +
    'geometric sum sigma_CF/(1+x) is an identity (location ~1.7e-7, height ~2e-16). Measurement on ' +
    'the inherited sub-terms only; the C_mb GUE-conditional per imp-486 stays GUE-conditional and ' +
    'UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes ' +
    'no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96266 (first-order reconstruction; ~9% location, <1e-3 height); imp-96151 (closed-form ' +
    'share model); imp-3220 (interior peak sigma_max ~ 0.9494 at N ~ 9.22e5); imp-33723 (closed-form ' +
    'crossover N_cross); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP96286_EFLOW_PEAK_LOCATION_ERROR_ORDER_ASSERTIONS = [
  {
    // (M1) full-share peak reproduces the imp-3220/imp-96266 landmark and is broad (small curvature).
    id: 'imp96286-full-peak-matches-landmark-and-is-flat',
    description: 'full share peaks at N ~ 9.22e5 with sigma_max ~ 0.9494 and a tiny curvature (broad peak)',
    holds: () =>
      Math.abs(PEAK_FULL.N / 9.22e5 - 1) < 5e-3 &&
      Math.abs(PEAK_FULL.sigma - 0.9494) < 1e-3 &&
      CURV_FULL < 0 &&
      Math.abs(CURV_FULL) < 1e-13,
  },
  {
    // (M2) first-order reconstruction reproduces the imp-96266 asymmetric accuracy.
    id: 'imp96286-order1-reproduces-imp96266-asymmetry',
    description: 'sigma_CF*(1-x) recovers the peak to <1e-3 in height but ~9e-2 in location (imp-96266)',
    holds: () => HT_ERR_O1 < 1e-3 && LOC_ERR_O1 > 5e-2 && LOC_ERR_O1 < 1.5e-1,
  },
  {
    // (M2) the flat-peak model predicts the location shift from the error slope / curvature.
    id: 'imp96286-loc-shift-predicted-by-slope-over-curvature',
    description: 'predicted dN/N* = -err1_slope/(N* sigma_full_pp) matches the measured order-1 location error',
    holds: () => Math.abs(PRED_SHIFT_O1 - LOC_ERR_O1) / LOC_ERR_O1 < 0.05,
  },
  {
    // (M3) the slope-drift (second-order) correction closes the location gap by more than 10x.
    id: 'imp96286-slope-drift-correction-closes-location-gap',
    description: 'sigma_CF*(1-x+x^2) reduces the peak location error >10x (to < 1e-2) and height error too',
    holds: () => LOC_ERR_O2 < 1e-2 && LOC_GAP_REDUCTION > 10 && HT_ERR_O2 < HT_ERR_O1,
  },
  {
    // (M3) the full geometric sum 1/(1+x) is an identity (recovers sigma_full to machine epsilon).
    id: 'imp96286-exact-geometric-is-identity',
    description: 'sigma_CF/(1+x) reproduces sigma_full: location error < 1e-5 and height error < 1e-12',
    holds: () => LOC_ERR_EXACT < 1e-5 && HT_ERR_EXACT < 1e-12,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp96286-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP96286_EFLOW_PEAK_LOCATION_ERROR_ORDER.isRigorous === false &&
      /NO QED/.test(IMP96286_EFLOW_PEAK_LOCATION_ERROR_ORDER.verdict) &&
      /refereed bound is changed/i.test(IMP96286_EFLOW_PEAK_LOCATION_ERROR_ORDER.verdict),
  },
];

for (const a of IMP96286_EFLOW_PEAK_LOCATION_ERROR_ORDER_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96286-eflow-peak-location-error-order assertion failed: ${a.id}`);
  }
}
