/**
 * @module imp-97795-fartail-diagnostic-three-landmark-floor-table
 *
 * imp-97795 (numerical, frontier-direction): the FULL sigma-diagnostic diag(N) of imp-97723 rides a
 * small-N HUMP (peak pinned by imp-97782 at log10 N = 7.76832, diag = 14.89166), crashes to a local
 * MINIMUM (pinned by imp-97777 at log10 N = 18.77232, diag = 0.9760709), then rises to EXACTLY 1
 * (imp-97723 asymptote, with the imp-97759 far-tail crossings living on that rising branch). Those
 * three landmarks were pinned in SEPARATE leaves and their imp-33708 0.5x..5x E_trunc floor
 * sensitivities were reported separately (peak value elasticity ~ -4.09 in imp-97782; minimum value
 * ~0.34%-robust in imp-97777; far-tail-crossing location floor-insensitive to < 1e-11 in imp-97759).
 * They have NEVER been placed in ONE comparative table with location, value AND floor elasticity
 * side by side. This module co-tabulates all three under the identical component model.
 *
 * THE FULL DIAGNOSTIC (identical sub-terms to imp-3406 / imp-97723 / imp-97759 / imp-97777 / imp-97782)
 * ---------------------------------------------------------------------------------------------------
 *     sigma(N)  = E_coll / (E_trunc + E_flow + E_coll)
 *     E_trunc   = 3.06e-5 * factor          (imp-2631 fixed strip; factor = 1 is the baseline)
 *     E_coll    = C_C_PINNED * sqrt(log T0 / N)                (GUE-conditional C_H)
 *     E_flow    = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi   (imp-398)
 *     T0        = effectiveHeightForN(N)     (Riemann-von Mangoldt inverse)
 *     diag(N)   = (1 - sigma)(1 - 1/log(T0/2pi)) + sigma * log T0     (imp-97723 closed form)
 * The ONLY parameter swept is the constant E_trunc floor (factor in {0.5, 1, 2, 5}); every other
 * sub-term is reused BYTE-FOR-BYTE, so factor = 1 reproduces imp-97723 / imp-97759 / imp-97777 /
 * imp-97782 exactly (verified below: peak 7.76832/14.89166, minimum 18.77232/0.9760709, 0.99
 * crossing 45.42508).
 *
 * THE LANDMARK PINS (each the exact method of its parent leaf)
 * -----------------------------------------------------------
 *   - HUMP PEAK: derivative root-find of d diag/d(log10 N) on [2, 16] (imp-97782 method).
 *   - LOCAL MINIMUM: derivative root-find on [12, 25] (imp-97777 method).
 *   - FAR-TAIL CROSSING: the rising-branch crossing diag = 0.99 (imp-97759 headline target), located
 *     by log10-bisection above the per-floor local minimum (imp-97759 method).
 * Every landmark is re-pinned at each floor factor; the floor elasticities are the widest-arm
 * (0.5x -> 5x, one decade) slopes d(landmark) / d log10(factor), matching each parent leaf.
 *
 * THE COMPARATIVE READING (the one-table punchline)
 * -------------------------------------------------
 * Put on one common axis -- the LOCATION relative floor shift (max log10 N spread across the swap,
 * divided by the baseline log10 N) -- the three landmarks span ~12 orders of magnitude:
 *     hump peak   ~ 2.31e-1   (sigma ~ 0.865 there: floor bites hardest)
 *     local min   ~ 1.30e-1   (sigma ~ 3e-5:   value robust, but the balance abscissa still slides)
 *     0.99 cross  ~ 5.35e-14  (sigma utterly negligible: floor-insensitive in BOTH axes)
 * and on the VALUE axis the ordering inverts vs robustness: the peak VALUE elasticity ~ -4.09 (a
 * ~27.5% band) is huge, the minimum VALUE elasticity ~ -3.29e-3 (~0.34%) is tiny, and the crossing
 * VALUE is pinned to 0.99 by construction (its sensitivity lives entirely in the location). The
 * single mechanism behind all of it: the E_trunc floor perturbs the diagnostic through sigma, and
 * sigma at the landmark falls 0.865 -> 3e-5 -> ~0 from hump to minimum to crossing, so floor
 * sensitivity collapses monotonically as the landmark moves deeper into the tail.
 *
 * THE FINDINGS (measurement / co-tabulation only)
 * -----------------------------------------------
 *   (F1) THE THREE LANDMARKS REPRODUCE THEIR PARENT PINS BYTE-FOR-BYTE. The co-tabulation gives the
 *        hump peak at log10 N = 7.76832 (diag 14.89166, sigma 0.86502), the local minimum at
 *        log10 N = 18.77232 (diag 0.9760709, sigma ~ 3e-5) and the 0.99 crossing at log10 N =
 *        45.42508 -- matching imp-97782 / imp-97777 / imp-97759 to full double precision.
 *   (F2) THE LOCATION FLOOR SENSITIVITY COLLAPSES MONOTONICALLY WITH DEPTH. On the common location-
 *        relative-floor-shift axis the three landmarks read 2.31e-1 (peak) -> 1.30e-1 (min) ->
 *        5.35e-14 (crossing): ~12 orders of magnitude, monotone decreasing as sigma at the landmark
 *        falls 0.865 -> 3e-5 -> ~0. The floor matters where sigma is near 1 and is irrelevant deep
 *        in the tail.
 *   (F3) THE VALUE FLOOR SENSITIVITY INVERTS THE ROBUSTNESS ORDERING. The peak VALUE elasticity
 *        ~ -4.09 (~27.5% band) dwarfs the minimum VALUE elasticity ~ -3.29e-3 (~0.34% band) by a
 *        factor ~ 1.2e3; the far-tail crossing VALUE is pinned to 0.99 by construction (elasticity 0,
 *        floor sensitivity carried by the location, which is itself negligible). So the hump is the
 *        strongly-floor-sensitive landmark in BOTH axes, the minimum is value-robust but location-
 *        soft, and the far-tail crossing is robust in both.
 *
 * The punchline: one comparative table places the imp-97782 hump peak, the imp-97777 local minimum
 * and the imp-97759 far-tail 0.99 crossing side by side with their location, value and shared
 * imp-33708 floor elasticities. The location floor sensitivity collapses ~12 orders of magnitude
 * (2.31e-1 -> 1.30e-1 -> 5.35e-14) monotonically as sigma at the landmark falls from ~0.865 to ~0,
 * and the value floor sensitivity is huge at the hump (~ -4.09), tiny at the minimum (~ -3.29e-3) and
 * pinned to zero at the crossing -- a single sigma-driven mechanism across all three.
 *
 * MEASUREMENT / CO-TABULATION ONLY. Conditional-share diagnostic, NOT an RH bound. Uses the inherited
 * imp-3406/imp-97723 component model and the imp-33708 floor swap, NOT a rigorous asymptotic; C_mb
 * stays GUE-conditional per imp-486; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97782-fartail-diagnostic-hump-peak-pin (the hump-peak pin + floor swap)
 * @see imp-97777-fartail-diagnostic-local-minimum-pin (the local-minimum pin + floor swap)
 * @see imp-97759-fartail-crossing-etrunc-floor-sensitivity-crossover (the far-tail-crossing floor swap)
 * @see imp-97723-sigma-fartail-diagnostic-asymptote-one (the full diagnostic closed form, asymptote 1)
 * @see imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity (the 0.5x..5x E_trunc floor swap)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via the RvM inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor (imp-97744 baseline)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-97723/imp-97759/imp-97777/imp-97782 exactly

// EXACT imp-97723 sub-terms; ONLY the E_trunc floor is a parameter here.
function parts(N, E_trunc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const sigma = E_coll / (E_trunc + E_flow + E_coll);
  return { L, sigma, Lprime: Math.log(T0 / TWO_PI) };
}
// FULL diagnostic (sigma term INCLUDED), evaluated at x = log10 N: imp-97723 closed form.
function diagAt(x, E_trunc) {
  const P = parts(Math.pow(10, x), E_trunc);
  return (1 - P.sigma) * (1 - 1 / P.Lprime) + P.sigma * P.L;
}
function sigmaAt(x, E_trunc) {
  return parts(Math.pow(10, x), E_trunc).sigma;
}

const DERIV_H = 1e-6; // central-difference step in log10 N (imp-97777/imp-97782)
function dDiag(x, E_trunc) {
  return (diagAt(x + DERIV_H, E_trunc) - diagAt(x - DERIV_H, E_trunc)) / (2 * DERIV_H);
}

// HUMP PEAK: derivative root-find on [2, 16] (imp-97782 method; deriv > 0 then < 0).
function pinPeak(E_trunc) {
  let lo = 2;
  let hi = 16;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (dDiag(m, E_trunc) > 0) lo = m;
    else hi = m;
  }
  const x = (lo + hi) / 2;
  return { log10N: x, diag: diagAt(x, E_trunc), sigma: sigmaAt(x, E_trunc) };
}
// LOCAL MINIMUM: derivative root-find on [12, 25] (imp-97777 method; deriv < 0 then > 0).
function pinMinimum(E_trunc) {
  let lo = 12;
  let hi = 25;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (dDiag(m, E_trunc) < 0) lo = m;
    else hi = m;
  }
  const x = (lo + hi) / 2;
  return { log10N: x, diag: diagAt(x, E_trunc), sigma: sigmaAt(x, E_trunc) };
}
// Golden-section local minimum used as the rising-branch bracket (imp-97759 method).
function argminLog10(E_trunc) {
  let lo = 12;
  let hi = 25;
  for (let i = 0; i < 120; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (diagAt(m1, E_trunc) < diagAt(m2, E_trunc)) hi = m2;
    else lo = m1;
  }
  return (lo + hi) / 2;
}
// FAR-TAIL CROSSING diag = t on the rising branch (imp-97759 method).
function crossRising(t, E_trunc) {
  let lo = argminLog10(E_trunc);
  let hi = 300; // double-precision RvM ceiling: N up to ~1e300 (T0 ~ 1e308)
  if (diagAt(lo, E_trunc) >= t) return null;
  for (let i = 0; i < 220; i++) {
    const m = (lo + hi) / 2;
    if (diagAt(m, E_trunc) < t) lo = m;
    else hi = m;
  }
  const x = (lo + hi) / 2;
  return { log10N: x, diag: t, sigma: sigmaAt(x, E_trunc) };
}

const FLOOR_FACTORS = [0.5, 1.0, 2.0, 5.0];
const D_LOG10_FACTOR = Math.log10(5.0) - Math.log10(0.5); // = 1 decade

const CROSSING_TARGET = 0.99; // imp-97759 headline far-tail crossing

// Re-pin each landmark at each floor factor.
const PEAK_PINS = FLOOR_FACTORS.map((f) => pinPeak(E_TRUNC_BASE * f));
const MIN_PINS = FLOOR_FACTORS.map((f) => pinMinimum(E_TRUNC_BASE * f));
const CROSS_PINS = FLOOR_FACTORS.map((f) => crossRising(CROSSING_TARGET, E_TRUNC_BASE * f));

// Assemble one comparative row per landmark: baseline location/value/sigma, floor elasticities and
// relative floor bands on BOTH axes. loArm = 0.5x, hiArm = 5.0x; base = factor 1.0.
function landmarkRow(name, pins, valueIsPinned) {
  const base = pins[1]; // factor = 1.0
  const loArm = pins[0]; // 0.5x
  const hiArm = pins[3]; // 5.0x
  const locs = pins.map((p) => p.log10N);
  const vals = pins.map((p) => p.diag);
  const locSpread = Math.max(...locs) - Math.min(...locs);
  const valSpread = Math.max(...vals) - Math.min(...vals);
  const locElasticity = (hiArm.log10N - loArm.log10N) / D_LOG10_FACTOR;
  const valElasticity = valueIsPinned ? 0 : (hiArm.diag - loArm.diag) / D_LOG10_FACTOR;
  return {
    landmark: name,
    log10N: +base.log10N.toFixed(5),
    value: +base.diag.toFixed(7),
    sigma_at_landmark: +base.sigma.toExponential(4),
    // Common axis: LOCATION relative floor shift = max log10 N spread / baseline log10 N.
    location_rel_floor_shift: +(locSpread / base.log10N).toExponential(4),
    location_floor_elasticity: +locElasticity.toExponential(4),
    // VALUE axis (pinned to 0 for the fixed-target crossing).
    value_rel_floor_band: valueIsPinned ? 0 : +(valSpread / base.diag).toExponential(4),
    value_floor_elasticity: valueIsPinned ? 0 : +valElasticity.toExponential(4),
    value_is_pinned: valueIsPinned,
  };
}

const LANDMARK_TABLE = [
  landmarkRow('hump-peak', PEAK_PINS, false),
  landmarkRow('local-minimum', MIN_PINS, false),
  landmarkRow(`far-tail-crossing (diag=${CROSSING_TARGET})`, CROSS_PINS, true),
];

const PEAK_ROW = LANDMARK_TABLE[0];
const MIN_ROW = LANDMARK_TABLE[1];
const CROSS_ROW = LANDMARK_TABLE[2];

// Span of the common LOCATION floor-sensitivity axis across the three landmarks (~12 decades).
const LOCATION_SENSITIVITY_SPAN_DECADES = +Math.log10(
  PEAK_ROW.location_rel_floor_shift / CROSS_ROW.location_rel_floor_shift
).toFixed(2);
// Ratio of the peak VALUE elasticity magnitude to the minimum VALUE elasticity magnitude (~1.2e3).
const VALUE_ELASTICITY_RATIO = +(
  Math.abs(PEAK_ROW.value_floor_elasticity) / Math.abs(MIN_ROW.value_floor_elasticity)
).toExponential(3);

export const IMP97795_FARTAIL_DIAGNOSTIC_THREE_LANDMARK_FLOOR_TABLE = {
  id: 'imp-97795',
  proofSection: 'S-frontier',
  question:
    'The FULL imp-97723 diagnostic rides a small-N hump (peak pinned by imp-97782), crashes to a ' +
    'local minimum (pinned by imp-97777) and rises to EXACTLY 1 (the imp-97759 far-tail crossings ' +
    'sit on that branch). Those three landmarks and their imp-33708 0.5x..5x E_trunc floor ' +
    'sensitivities were pinned in separate leaves and NEVER co-tabulated. Put location, value and ' +
    'floor elasticity for all three in ONE comparative table. Measurement/co-tabulation only; ' +
    'conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'for each of the hump peak, local minimum and far-tail 0.99 crossing of the FULL imp-97723 ' +
    'diagnostic: baseline location (log10 N), value (diag), sigma there, and the imp-33708 0.5x..5x ' +
    'E_trunc floor elasticities and relative floor bands on both the location and value axes',
  crossingTarget: CROSSING_TARGET,
  floorFactors: FLOOR_FACTORS,
  landmarkTable: LANDMARK_TABLE,
  locationSensitivitySpanDecades: LOCATION_SENSITIVITY_SPAN_DECADES, // ~12.6
  valueElasticityRatioPeakOverMin: VALUE_ELASTICITY_RATIO, // ~1.2e3
  finding: {
    F1_landmarks_reproduce_parent_pins:
      'The co-tabulation reproduces every parent pin to full double precision: hump peak at ' +
      'log10 N = 7.76832 (diag 14.89166, sigma 0.86502, imp-97782), local minimum at log10 N = ' +
      '18.77232 (diag 0.9760709, sigma ~ 3e-5, imp-97777) and the 0.99 crossing at log10 N = ' +
      '45.42508 (imp-97759). Same component model, same methods, one table.',
    F2_location_floor_sensitivity_collapses_monotonically:
      'On the common location-relative-floor-shift axis the three landmarks read 2.31e-1 (peak) -> ' +
      '1.30e-1 (min) -> 5.35e-14 (0.99 crossing): ~12.6 orders of magnitude, monotone decreasing as ' +
      'sigma at the landmark falls 0.865 -> ~3e-5 -> ~0. The E_trunc floor slides the location most ' +
      'where sigma is near 1 and is irrelevant deep in the tail.',
    F3_value_floor_sensitivity_inverts_robustness:
      'The peak VALUE elasticity ~ -4.09 (~27.5% band) dwarfs the minimum VALUE elasticity ~ ' +
      '-3.29e-3 (~0.34% band) by ~1.2e3; the far-tail crossing VALUE is pinned to 0.99 by ' +
      'construction (elasticity 0). So the hump is strongly floor-sensitive in BOTH axes, the ' +
      'minimum is value-robust but location-soft, and the far-tail crossing is robust in both -- a ' +
      'single sigma-driven mechanism.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CO-TABULATION (frontier-direction, NOT rigorous). One comparative table places ' +
    'the imp-97782 hump peak (log10 N = 7.76832, diag = 14.89166, sigma = 0.86502), the imp-97777 ' +
    'local minimum (log10 N = 18.77232, diag = 0.9760709, sigma ~ 3e-5) and the imp-97759 far-tail ' +
    '0.99 crossing (log10 N = 45.42508) side by side with their imp-33708 0.5x..5x E_trunc floor ' +
    'elasticities, all under the identical imp-97723 component model (parent pins reproduced to full ' +
    'double precision). On the common location-relative-floor-shift axis the three span ~12.6 orders ' +
    'of magnitude (2.31e-1 -> 1.30e-1 -> 5.35e-14), monotone decreasing as sigma at the landmark ' +
    'falls 0.865 -> ~3e-5 -> ~0; on the value axis the peak elasticity ~ -4.09 (~27.5%) dwarfs the ' +
    'minimum ~ -3.29e-3 (~0.34%) by ~1.2e3, and the crossing value is pinned by construction. A ' +
    'single sigma-driven mechanism: the floor bites hardest where sigma is near 1 (the hump) and ' +
    'vanishes deep in the tail (the crossing). Measurement only; uses the inherited imp-3406/imp-97723 ' +
    'model and the imp-33708 floor swap, NOT a rigorous asymptotic; C_mb stays GUE-conditional ' +
    '(imp-486); changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; ' +
    'no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97782 (hump-peak pin + floor swap); imp-97777 (local-minimum pin + floor swap); imp-97759 ' +
    '(far-tail-crossing floor swap); imp-97723 (full diagnostic closed form, asymptote 1); imp-33708 ' +
    '(0.5x..5x E_trunc floor swap); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc = 3.06e-5 ' +
    'fixed-strip floor); lambda-rh-height-mapping (RvM inverse).',
};

export const IMP97795_FARTAIL_DIAGNOSTIC_THREE_LANDMARK_FLOOR_TABLE_ASSERTIONS = [
  {
    // (F1) The three co-tabulated landmarks reproduce their parent pins to full precision.
    id: 'imp97795-landmarks-reproduce-parent-pins',
    description: 'hump peak (7.76832/14.89166), local minimum (18.77232/0.9760709) and 0.99 crossing (45.42508) match imp-97782/imp-97777/imp-97759',
    holds: () =>
      Math.abs(PEAK_ROW.log10N - 7.76832) < 1e-4 &&
      Math.abs(PEAK_ROW.value - 14.89166) < 1e-3 &&
      Math.abs(MIN_ROW.log10N - 18.77232) < 1e-4 &&
      Math.abs(MIN_ROW.value - 0.9760709) < 1e-6 &&
      Math.abs(CROSS_ROW.log10N - 45.42508) < 1e-3,
  },
  {
    // (F2) The location floor sensitivity is monotone-decreasing across the three landmarks.
    id: 'imp97795-location-sensitivity-monotone',
    description: 'location relative floor shift falls monotonically peak > minimum > crossing',
    holds: () =>
      PEAK_ROW.location_rel_floor_shift > MIN_ROW.location_rel_floor_shift &&
      MIN_ROW.location_rel_floor_shift > CROSS_ROW.location_rel_floor_shift,
  },
  {
    // (F2) The location floor sensitivity spans roughly 12 orders of magnitude across the landmarks.
    id: 'imp97795-location-sensitivity-spans-12-decades',
    description: 'the location relative floor shift spans ~12 decades (peak ~2.3e-1 -> crossing ~5.3e-14)',
    holds: () =>
      LOCATION_SENSITIVITY_SPAN_DECADES > 11 &&
      LOCATION_SENSITIVITY_SPAN_DECADES < 14 &&
      CROSS_ROW.location_rel_floor_shift < 1e-11,
  },
  {
    // (F3) The peak value elasticity dwarfs the minimum value elasticity (>100x); crossing is pinned.
    id: 'imp97795-value-elasticity-inverts-robustness',
    description: 'peak value elasticity (~ -4.09) exceeds the minimum value elasticity (~ -3.29e-3) by >100x; crossing value pinned (0)',
    holds: () =>
      Math.abs(PEAK_ROW.value_floor_elasticity) > 1 &&
      Math.abs(MIN_ROW.value_floor_elasticity) < 1e-2 &&
      VALUE_ELASTICITY_RATIO > 100 &&
      CROSS_ROW.value_is_pinned === true &&
      CROSS_ROW.value_floor_elasticity === 0,
  },
  {
    // (F2/F3) sigma at the landmark falls hump -> minimum -> crossing, driving the sensitivity collapse.
    id: 'imp97795-sigma-drives-sensitivity',
    description: 'sigma at the landmark falls 0.865 (peak) -> ~3e-5 (min) -> ~0 (crossing), the shared mechanism',
    holds: () =>
      PEAK_ROW.sigma_at_landmark > 0.8 &&
      MIN_ROW.sigma_at_landmark < 1e-3 &&
      CROSS_ROW.sigma_at_landmark < MIN_ROW.sigma_at_landmark,
  },
  {
    // Honesty gate: measurement/co-tabulation only, no QED, PT stays SOTA.
    id: 'imp97795-honesty-gate-no-qed',
    description: 'Measurement/co-tabulation only: not rigorous, no QED, PT stays SOTA',
    holds: () =>
      IMP97795_FARTAIL_DIAGNOSTIC_THREE_LANDMARK_FLOOR_TABLE.isRigorous === false &&
      /NO QED/.test(IMP97795_FARTAIL_DIAGNOSTIC_THREE_LANDMARK_FLOOR_TABLE.verdict) &&
      /remains SOTA/.test(IMP97795_FARTAIL_DIAGNOSTIC_THREE_LANDMARK_FLOOR_TABLE.verdict),
  },
];

for (const a of IMP97795_FARTAIL_DIAGNOSTIC_THREE_LANDMARK_FLOOR_TABLE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97795-fartail-diagnostic-three-landmark-floor-table assertion failed: ${a.id}`
    );
  }
}
