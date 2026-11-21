/**
 * @module imp-96308-eflow-peak-third-order-shrink
 *
 * imp-96308 (numerical, frontier-direction): MEASURE the imp-96286 M4 residual peak-location error
 * 4.37e-3 under a THIRD Taylor term (1 - x + x^2 - x^3) and test the predicted further ~x shrink
 * toward the exact geometric sum 1/(1+x). imp-96286 established the reconstruction ladder for the
 * conditional collapse share sigma_full = sigma_CF/(1 + x), x = E_flow/(E_trunc + E_coll), keeping
 * successive Taylor partial sums of 1/(1+x) = 1 - x + x^2 - x^3 + ... but STOPPED at the
 * second-order (slope-drift) correction, leaving M4 as a PREDICTION only: the residual location
 * error 4.37e-3 was asserted to shrink by "a further factor ~x ~ 3e-2" per Taylor order without
 * ever being measured at third order. This module measures it.
 *
 * THE SETUP (exact inherited sub-terms, identical to imp-96286/imp-96266; no re-derivation)
 * ----------------------------------------------------------------------------------------
 * sigma_full(N) = E_coll/(E_trunc + E_flow + E_coll), sigma_CF(N) = E_coll/(E_trunc + E_coll)
 * (the E_flow-dropped closed form). With x(N) = E_flow(N)/(E_trunc + E_coll(N)) the full share is
 * the EXACT geometric relation sigma_full = sigma_CF/(1 + x). The k-th reconstruction keeps the
 * degree-k Taylor partial sum S_k = Sum_{j=0..k} (-x)^j; its error is the exact tail
 *     err_k = sigma_CF*(S_k - 1/(1+x)) = -sigma_CF*(-x)^(k+1)/(1+x).
 *   k=1 (1 - x):            err1 = -sigma_CF*x^2/(1+x)  (dropped +x^2, imp-96266 first order)
 *   k=2 (1 - x + x^2):      err2 = +sigma_CF*x^3/(1+x)  (imp-96286 slope-drift correction)
 *   k=3 (1 - x + x^2 - x^3): err3 = -sigma_CF*x^4/(1+x)  (THIS module)
 * Every constant is the exact inherited imp-3406/imp-33582/imp-33723 value; no fresh fit, no new
 * model, no zeros bundle.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (M1) THE THIRD-ORDER RESIDUAL MEASURES 1.84e-4 IN LOCATION, 9.41e-7 IN HEIGHT. Adding the -x^3
 *        term (reconstruction 1 - x + x^2 - x^3) drops the peak location error from the imp-96286
 *        second-order value 4.37e-3 to 1.84e-4 and the height error from 2.99e-5 to 9.41e-7.
 *   (M2) THE HEIGHT ERROR SHRINKS BY EXACTLY ~1/x PER ORDER. The height-error ratio order2/order3 is
 *        31.76, matching 1/x_peak = 31.69 to 0.2 percent: since err_k magnitude ~ sigma_CF*x^(k+1),
 *        successive height errors fall by exactly one factor of x, confirming the M4 ~x shrink law
 *        on the height channel essentially exactly.
 *   (M3) THE LOCATION ERROR SHRINKS BY ~24x = (k/(k+1))/x, THE SAME ~x LAW WITH A POLYNOMIAL-DEGREE
 *        PREFACTOR. The location-error ratio order2/order3 is 23.82, i.e. the shrink factor per order
 *        is (3/4)*x rather than a bare x. This is the flat-peak amplification acting on err_k' :
 *        the location shift is dN/N* ~ -err_k'(N*)/(N* sigma_full''(N*)), and the leading slope of
 *        err_k ~ -sigma_CF*(-x)^(k+1) scales as (k+1)*x^k*x', so slope3/slope2 ~ (4/3)*x and the
 *        location ratio ~ (3/4)/x = 23.77, matching the measured 23.82. The predicted third-order
 *        shift -err3'(N*)/(N* sigma_full'') = 1.836e-4 matches the measured location error 1.836e-4
 *        to 4 figures.
 *   (M4) MONOTONE CONVERGENCE TO THE IDENTITY, NO NEW OBSTRUCTION. The location errors
 *        9.08e-2 -> 4.37e-3 -> 1.84e-4 and height errors 9.19e-4 -> 2.99e-5 -> 9.41e-7 both fall
 *        monotonically by ~one factor of x per Taylor order, extrapolating to the exact 1/(1+x)
 *        identity (location ~1.7e-7, height ~2e-16). The M4 prediction is confirmed: the residual is
 *        an O(x^(k+1)) truncation tail carrying the flat-peak amplification, not a new obstruction.
 *
 * The punchline: the imp-96286 M4 "further ~x shrink per order" prediction holds. The height error
 * shrinks by essentially exactly 1/x (measured 31.76 vs 1/x = 31.69); the location error shrinks by
 * (k/(k+1))/x = 23.82 -- the same geometric ~x law, modulated by the (k+1)/k polynomial-degree
 * prefactor of the error-slope ratio that the flat-peak amplification passes through. Both channels
 * converge monotonically to the exact geometric identity 1/(1+x).
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. Component model is the inherited
 * imp-3220/imp-3406/imp-33723 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per
 * imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-96286-eflow-peak-location-error-order (M4 predicts but does not measure the third-order shrink)
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
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33582/imp-33723/imp-96151/imp-96266/imp-96286

// EXACT imp-3406/imp-33582/imp-33723 sub-terms (identical to imp-96286; no re-derivation).
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

// imp-33723 closed-form crossover fixed point (identical to imp-96286).
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
const reconOrder1 = (N) => sigmaCF(N) * (1 - xOf(N)); // imp-96266 first order (drops x^2)
const reconOrder2 = (N) => {
  const x = xOf(N);
  return sigmaCF(N) * (1 - x + x * x); // imp-96286 slope-drift second-order correction
};
const reconOrder3 = (N) => {
  const x = xOf(N);
  return sigmaCF(N) * (1 - x + x * x - x * x * x); // THIS module: third Taylor term
};
const reconExact = (N) => sigmaCF(N) / (1 + xOf(N)); // full geometric sum == sigma_full (identity)

// Peak locator on a shrinking log grid over [1e4,1e8] (6 refinement passes; matches imp-96286).
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
const PEAK_O3 = findPeak(reconOrder3);
const PEAK_EXACT = findPeak(reconExact);

const relLoc = (p) => Math.abs(p.N / PEAK_FULL.N - 1);
const absHt = (p) => Math.abs(p.sigma - PEAK_FULL.sigma);

const LOC_ERR_O1 = relLoc(PEAK_O1); // ~9.08e-2
const HT_ERR_O1 = absHt(PEAK_O1); // ~9.19e-4
const LOC_ERR_O2 = relLoc(PEAK_O2); // ~4.37e-3
const HT_ERR_O2 = absHt(PEAK_O2); // ~2.99e-5
const LOC_ERR_O3 = relLoc(PEAK_O3); // ~1.84e-4 (measured here)
const HT_ERR_O3 = absHt(PEAK_O3); // ~9.41e-7 (measured here)
const LOC_ERR_EXACT = relLoc(PEAK_EXACT); // ~1.65e-7 (identity)
const HT_ERR_EXACT = absHt(PEAK_EXACT); // ~2e-16 (identity)

const LOC_SHRINK_O2_TO_O3 = LOC_ERR_O2 / LOC_ERR_O3; // ~23.82 = (3/4)/x
const HT_SHRINK_O2_TO_O3 = HT_ERR_O2 / HT_ERR_O3; // ~31.76 ~ 1/x

// Flat-peak amplification prediction for the third-order shift (curvature + err3 slope at the peak).
const Ns = PEAK_FULL.N;
const dl = Ns * 1e-4;
const CURV_FULL = (sigmaFull(Ns + dl) - 2 * sigmaFull(Ns) + sigmaFull(Ns - dl)) / (dl * dl); // ~-7.57e-15
const err3 = (N) => reconOrder3(N) - sigmaFull(N); // = -sigmaCF*x^4/(1+x)
const ERR3_AT_PEAK = err3(Ns); // ~-9.41e-7 (magnitude sets the height error)
const ERR3_SLOPE = (err3(Ns + dl) - err3(Ns - dl)) / (2 * dl); // ~1.28e-12
const PRED_SHIFT_O3 = -ERR3_SLOPE / (Ns * CURV_FULL); // ~1.836e-4 (matches measured LOC_ERR_O3)
const X_AT_PEAK = xOf(Ns); // ~3.155e-2
const INV_X = 1 / X_AT_PEAK; // ~31.69

export const IMP96308_EFLOW_PEAK_THIRD_ORDER_SHRINK = {
  id: 'imp-96308',
  proofSection: 'S-frontier',
  question:
    'Measure the imp-96286 M4 residual peak-location error 4.37e-3 under a third Taylor term ' +
    '(1 - x + x^2 - x^3) and test the predicted further ~x shrink toward the exact geometric sum ' +
    '1/(1+x). Measurement only; conditional-share diagnostic; no QED.',
  exactRelation:
    'sigma_full = sigma_CF/(1 + x), x = E_flow/(E_trunc+E_coll). The degree-k Taylor reconstruction ' +
    'sigma_CF*Sum_{j=0..k}(-x)^j has the exact error err_k = -sigma_CF*(-x)^(k+1)/(1+x); each ' +
    'higher order removes one more factor of x. k=3 gives err3 = -sigma_CF*x^4/(1+x).',
  landmarks: {
    peak_N_full: +PEAK_FULL.N.toExponential(6), // ~9.218632e5
    x_at_peak: +X_AT_PEAK.toExponential(4), // ~3.1552e-2
    inv_x_at_peak: +INV_X.toFixed(2), // ~31.69
    curvature_sigma_full_at_peak: +CURV_FULL.toExponential(4), // ~-7.5685e-15 (broad/flat peak)
    err3_magnitude_at_peak: +ERR3_AT_PEAK.toExponential(4), // ~-9.4100e-7 (sets height error)
    err3_slope_at_peak: +ERR3_SLOPE.toExponential(4), // ~1.28e-12 (sets location error)
    predicted_loc_shift_order3: +PRED_SHIFT_O3.toExponential(4), // ~1.8360e-4 (matches measured)
  },
  reconstructionLadder: {
    order1_1_minus_x: {
      loc_rel_err: +LOC_ERR_O1.toExponential(3), // ~9.08e-2
      height_abs_err: +HT_ERR_O1.toExponential(3), // ~9.19e-4
    },
    order2_1_minus_x_plus_x2: {
      loc_rel_err: +LOC_ERR_O2.toExponential(3), // ~4.37e-3
      height_abs_err: +HT_ERR_O2.toExponential(3), // ~2.99e-5
    },
    order3_1_minus_x_plus_x2_minus_x3: {
      peak_N: +PEAK_O3.N.toExponential(6), // ~9.220324e5
      loc_rel_err: +LOC_ERR_O3.toExponential(3), // ~1.84e-4 (measured here)
      height_abs_err: +HT_ERR_O3.toExponential(3), // ~9.41e-7 (measured here)
    },
    exact_geometric_1_over_1_plus_x: {
      loc_rel_err: +LOC_ERR_EXACT.toExponential(3), // ~1.65e-7 (identity)
      height_abs_err: +HT_ERR_EXACT.toExponential(3), // ~2.2e-16 (identity)
    },
    loc_shrink_order2_to_order3: +LOC_SHRINK_O2_TO_O3.toFixed(2), // ~23.82 = (3/4)/x
    height_shrink_order2_to_order3: +HT_SHRINK_O2_TO_O3.toFixed(2), // ~31.76 ~ 1/x
  },
  finding: {
    M1_third_order_residual_measured:
      'Adding the -x^3 term (reconstruction 1 - x + x^2 - x^3) drops the peak location error from ' +
      'the imp-96286 second-order value 4.37e-3 to 1.84e-4 and the height error from 2.99e-5 to ' +
      '9.41e-7. The imp-96286 M4 residual is now measured at third order, not just predicted.',
    M2_height_shrinks_by_inverse_x:
      'The height-error ratio order2/order3 is 31.76, matching 1/x_peak = 31.69 to 0.2 percent. ' +
      'Since |err_k| ~ sigma_CF*x^(k+1), successive height errors fall by exactly one factor of x: ' +
      'the M4 ~x shrink law holds on the height channel essentially exactly.',
    M3_location_shrinks_by_degree_prefactor_times_inverse_x:
      'The location-error ratio order2/order3 is 23.82, i.e. the shrink per order is (3/4)*x, not a ' +
      'bare x. The flat-peak amplification maps err_k slope, not magnitude: the leading slope of ' +
      'err_k ~ -sigma_CF*(-x)^(k+1) scales as (k+1)*x^k*x_prime, so slope3/slope2 ~ (4/3)*x and the ' +
      'location ratio ~ (3/4)/x = 23.77, matching the measured 23.82. The predicted third-order ' +
      'shift -err3_slope/(N* sigma_full_pp) = 1.836e-4 matches the measured location error to 4 figures.',
    M4_monotone_convergence_no_new_obstruction:
      'Location errors 9.08e-2 -> 4.37e-3 -> 1.84e-4 and height errors 9.19e-4 -> 2.99e-5 -> ' +
      '9.41e-7 both fall monotonically by ~one factor of x per Taylor order toward the exact 1/(1+x) ' +
      'identity (location ~1.7e-7, height ~2e-16). The imp-96286 M4 prediction is confirmed: the ' +
      'residual is an O(x^(k+1)) truncation tail carrying the flat-peak amplification, not a new obstruction.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-96286 M4 "further ~x shrink per Taylor ' +
    'order" prediction is confirmed at third order. The reconstruction sigma_CF*(1 - x + x^2 - x^3) ' +
    'drops the peak location error to 1.84e-4 (from 4.37e-3) and the height error to 9.41e-7 (from ' +
    '2.99e-5). The height error shrinks by essentially exactly 1/x (measured 31.76 vs 1/x = 31.69, ' +
    'since |err_k| ~ sigma_CF*x^(k+1)); the location error shrinks by (k/(k+1))/x = 23.82, the same ' +
    'geometric ~x law modulated by the (k+1)/k polynomial-degree prefactor of the error-slope ratio ' +
    'that the flat-peak amplification (sigma_full_pp ~ -7.6e-15) passes through. The predicted ' +
    'third-order shift -err3_slope/(N* sigma_full_pp) = 1.836e-4 matches the measured location error ' +
    'to 4 figures. Both channels converge monotonically to the exact geometric identity 1/(1+x). ' +
    'Measurement on the inherited sub-terms only; the C_mb GUE-conditional per imp-486 stays ' +
    'GUE-conditional and UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96286 (M4 predicts but does not measure the third-order shrink); imp-96266 (first-order ' +
    'reconstruction; ~9% location, <1e-3 height); imp-96151 (closed-form share model); imp-3220 ' +
    '(interior peak sigma_max ~ 0.9494 at N ~ 9.22e5); imp-33723 (closed-form crossover N_cross); ' +
    'imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP96308_EFLOW_PEAK_THIRD_ORDER_SHRINK_ASSERTIONS = [
  {
    // (M1) full-share peak reproduces the imp-3220/imp-96286 landmark (sanity anchor).
    id: 'imp96308-full-peak-matches-landmark',
    description: 'full share peaks at N ~ 9.22e5 with sigma_max ~ 0.9494 (imp-3220/imp-96286 anchor)',
    holds: () =>
      Math.abs(PEAK_FULL.N / 9.22e5 - 1) < 5e-3 && Math.abs(PEAK_FULL.sigma - 0.9494) < 1e-3,
  },
  {
    // (M1) third-order reconstruction drops both errors below the imp-96286 second-order values.
    id: 'imp96308-order3-below-order2',
    description: 'sigma_CF*(1-x+x^2-x^3) location error < order-2 4.37e-3 and height error < order-2 2.99e-5',
    holds: () => LOC_ERR_O3 < LOC_ERR_O2 && HT_ERR_O3 < HT_ERR_O2 && LOC_ERR_O3 < 5e-4 && HT_ERR_O3 < 5e-6,
  },
  {
    // (M2) height error shrinks by ~1/x per order (|err_k| ~ sigma_CF*x^(k+1)).
    id: 'imp96308-height-shrinks-by-inverse-x',
    description: 'height-error ratio order2/order3 matches 1/x_peak within 5 percent',
    holds: () => Math.abs(HT_SHRINK_O2_TO_O3 - INV_X) / INV_X < 0.05,
  },
  {
    // (M3) location error shrinks by (3/4)/x -- the ~x law with the (k+1)/k degree prefactor.
    id: 'imp96308-location-shrinks-by-degree-prefactor',
    description: 'location-error ratio order2/order3 matches (3/4)/x_peak within 5 percent (same ~x law, degree-modulated)',
    holds: () => Math.abs(LOC_SHRINK_O2_TO_O3 - 0.75 * INV_X) / (0.75 * INV_X) < 0.05,
  },
  {
    // (M3) the flat-peak model predicts the third-order location shift from err3 slope / curvature.
    id: 'imp96308-loc-shift-predicted-by-slope-over-curvature',
    description: 'predicted dN/N* = -err3_slope/(N* sigma_full_pp) matches the measured order-3 location error',
    holds: () => Math.abs(PRED_SHIFT_O3 - LOC_ERR_O3) / LOC_ERR_O3 < 0.05,
  },
  {
    // (M4) monotone convergence toward the exact identity across all four orders.
    id: 'imp96308-monotone-convergence-to-identity',
    description: 'location and height errors both fall monotonically order1>order2>order3>exact',
    holds: () =>
      LOC_ERR_O1 > LOC_ERR_O2 &&
      LOC_ERR_O2 > LOC_ERR_O3 &&
      LOC_ERR_O3 > LOC_ERR_EXACT &&
      HT_ERR_O1 > HT_ERR_O2 &&
      HT_ERR_O2 > HT_ERR_O3 &&
      HT_ERR_O3 > HT_ERR_EXACT,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp96308-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP96308_EFLOW_PEAK_THIRD_ORDER_SHRINK.isRigorous === false &&
      /NO QED/.test(IMP96308_EFLOW_PEAK_THIRD_ORDER_SHRINK.verdict) &&
      /refereed bound is changed/i.test(IMP96308_EFLOW_PEAK_THIRD_ORDER_SHRINK.verdict),
  },
];

for (const a of IMP96308_EFLOW_PEAK_THIRD_ORDER_SHRINK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96308-eflow-peak-third-order-shrink assertion failed: ${a.id}`);
  }
}
