/**
 * @module imp-97782-fartail-diagnostic-hump-peak-pin
 *
 * imp-97782 (numerical, frontier-direction): imp-97759 noted that the FULL sigma-diagnostic rides a
 * large small-N HUMP (peak ~ 14.8 near N ~ 1e8, dominated by the sigma * log T0 term) before crashing
 * to the local MINIMUM (diag ~ 0.97607 near log10 N ~ 18.77, pinned by imp-97777) and rising toward
 * EXACTLY 1. imp-97759 quantified only the far-tail rising branch and the minimum; the hump peak was
 * mentioned but never pinned. This module is the COMPANION to imp-97777: it pins the hump peak by
 * derivative root-finding and measures its imp-33708 0.5x..5x E_trunc-floor sensitivity.
 *
 * THE FULL DIAGNOSTIC (identical sub-terms to imp-3406 / imp-97723 / imp-97759 / imp-97777)
 * ---------------------------------------------------------------------------------------
 *     sigma(N)  = E_coll / (E_trunc + E_flow + E_coll)
 *     E_trunc   = 3.06e-5 * factor          (imp-2631 fixed strip; factor = 1 is the baseline)
 *     E_coll    = C_C_PINNED * sqrt(log T0 / N)                (GUE-conditional C_H)
 *     E_flow    = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi   (imp-398)
 *     T0        = effectiveHeightForN(N)     (Riemann-von Mangoldt inverse)
 *     diag(N)   = (1 - sigma)(1 - 1/log(T0/2pi)) + sigma * log T0     (imp-97723 closed form)
 * The ONLY parameter swept is the constant E_trunc floor (factor in {0.5, 1, 2, 5}); every other
 * sub-term is reused byte-for-byte, so factor = 1 reproduces imp-97723 / imp-97759 / imp-97777.
 *
 * PINNING THE HUMP PEAK (derivative root-finding, not golden-section)
 * ------------------------------------------------------------------
 * imp-97759 read the peak (~14.8 near N ~ 1e8) off its shape sketch. Here the peak is pinned by
 * bisecting the LOG10-N derivative d diag / d(log10 N) (H = 1e-6 central difference) to its root on
 * [2, 16]: on the small-N side the sigma * log T0 term rises (derivative > 0), then sigma decays and
 * the diagnostic falls off the hump (derivative < 0), so the derivative changes sign exactly once at
 * the peak. The root pins the peak location and value directly.
 *
 * THE MEASUREMENT: floor-swap of the peak landmark
 * ------------------------------------------------
 * For each floor factor the peak (location log10 N, value diag) is re-pinned, and the max spread
 * across the 0.5x..5x swap is reported for BOTH the location and the value, together with the local
 * elasticities d log10 N_peak / d log10(factor) and d diag_peak / d log10(factor).
 *
 * THE FINDINGS (measurement / sensitivity only)
 * ---------------------------------------------
 *   (F1) THE HUMP PEAK IS PINNED AT log10 N = 7.76832, diag = 14.89166 (baseline floor), with
 *        sigma = 0.86502 there -- the sigma * log T0 term dominates, confirming the imp-97759 sketch
 *        (peak ~ 14.8 near N ~ 1e8). Derivative root-finding gives a genuine stationary point
 *        (|deriv| < 1e-8 at the pin), not a coarse-grid read.
 *   (F2) THE PEAK LOCATION IS STRONGLY FLOOR-SENSITIVE. Across the 0.5x..5x swap the location moves
 *        1.79 decades (log10 N: 8.317 at 0.5x -> 6.524 at 5x) with elasticity d log10 N_peak /
 *        d log10(factor) ~ -1.79. Lowering the floor lifts sigma, so the sigma * log T0 hump reaches
 *        further into the tail and the peak slides to higher N; raising it pulls the peak in.
 *   (F3) THE PEAK VALUE IS ALSO STRONGLY FLOOR-SENSITIVE. Across the same swap diag_peak moves 4.094
 *        (16.131 at 0.5x -> 12.037 at 5x, a ~27.5% band) with elasticity d diag_peak / d log10(factor)
 *        ~ -4.09. This is the OPPOSITE extreme from BOTH the far-tail crossings (imp-97759 F3,
 *        floor-insensitive location to < 1e-11) AND the local-minimum value (imp-97777 F3, ~0.34%
 *        robust): at the hump sigma ~ 0.865 is near 1, so the E_trunc floor directly modulates sigma
 *        and hence the dominant sigma * log T0 term -- BOTH the peak location and its value move a lot.
 *
 * The punchline: derivative root-finding pins the imp-97759 hump peak at log10 N = 7.76832, diag =
 * 14.89166 (sigma ~ 0.865), and the imp-33708 0.5x..5x floor swap shows the peak is strongly
 * floor-sensitive in BOTH location (~1.79 decades, elasticity ~ -1.79) AND value (~27.5%, elasticity
 * ~ -4.09). Where sigma is near 1 the floor matters most; deep in the tail (sigma -> 0) it does not.
 *
 * MEASUREMENT / SENSITIVITY ONLY. Conditional-share diagnostic, NOT an RH bound. Uses the inherited
 * imp-3406/imp-97723 component model and the imp-33708 floor swap, NOT a rigorous asymptotic; C_mb
 * stays GUE-conditional per imp-486; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-97777-fartail-diagnostic-local-minimum-pin (the companion local-minimum pin)
 * @see imp-97759-fartail-crossing-etrunc-floor-sensitivity-crossover (notes the hump, never pinned)
 * @see imp-97723-sigma-fartail-diagnostic-asymptote-one (the full diagnostic closed form)
 * @see imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity (the 0.5x..5x E_trunc floor swap)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via the RvM inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor (imp-97744 baseline)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-97723/imp-97759/imp-97777 exactly

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

const DERIV_H = 1e-6; // central-difference step in log10 N for the derivative root-find
function dDiag(x, E_trunc) {
  return (diagAt(x + DERIV_H, E_trunc) - diagAt(x - DERIV_H, E_trunc)) / (2 * DERIV_H);
}

// Pin the hump peak by bisecting the derivative root on [2, 16]: the sigma*log T0 term rises
// (derivative > 0) then the diagnostic falls off the hump (derivative < 0), so the derivative
// changes sign exactly once at the peak.
function pinPeak(E_trunc) {
  let lo = 2;
  let hi = 16;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (dDiag(m, E_trunc) > 0) lo = m;
    else hi = m;
  }
  const log10N = (lo + hi) / 2;
  return {
    log10N,
    diag: diagAt(log10N, E_trunc),
    sigma: sigmaAt(log10N, E_trunc),
    deriv: dDiag(log10N, E_trunc),
  };
}

const FLOOR_FACTORS = [0.5, 1.0, 2.0, 5.0];

// --- The pinned peak at each floor (baseline = factor 1.0) ------------------------------------
const PINS = FLOOR_FACTORS.map((f) => {
  const p = pinPeak(E_TRUNC_BASE * f);
  return { factor: f, log10N: p.log10N, diag: p.diag, sigma: p.sigma, deriv: p.deriv };
});
const BASELINE = PINS.find((p) => p.factor === 1.0);

// --- Floor-swap spreads and elasticities -----------------------------------------------------
const locs = PINS.map((p) => p.log10N);
const vals = PINS.map((p) => p.diag);
const LOC_SPREAD = Math.max(...locs) - Math.min(...locs); // ~1.79 decades
const VAL_SPREAD = Math.max(...vals) - Math.min(...vals); // ~4.09

// Local elasticity per decade of floor factor, measured across the widest 0.5x..5x arm.
const loArm = PINS.find((p) => p.factor === 0.5);
const hiArm = PINS.find((p) => p.factor === 5.0);
const dLog10Factor = Math.log10(5.0) - Math.log10(0.5); // = 1 decade
const LOC_ELASTICITY = (hiArm.log10N - loArm.log10N) / dLog10Factor; // ~ -1.79
const VAL_ELASTICITY = (hiArm.diag - loArm.diag) / dLog10Factor; // ~ -4.09
const VAL_REL_BAND = VAL_SPREAD / BASELINE.diag; // ~0.275 (~27.5%)

const LADDER = PINS.map((p) => ({
  factor: p.factor,
  log10N_peak: +p.log10N.toFixed(5),
  diag_peak: +p.diag.toFixed(5),
  sigma_at_peak: +p.sigma.toFixed(5),
  deriv_at_peak: +p.deriv.toExponential(2),
}));

export const IMP97782_FARTAIL_DIAGNOSTIC_HUMP_PEAK_PIN = {
  id: 'imp-97782',
  proofSection: 'S-frontier',
  question:
    'imp-97759 noted the FULL imp-97723 diagnostic rides a large small-N hump (peak ~ 14.8 near ' +
    'N ~ 1e8, dominated by the sigma * log T0 term) before crashing to the local minimum, but only ' +
    'the minimum (imp-97777) and the far-tail rising branch were pinned. PIN the hump peak by ' +
    'derivative root-finding and MEASURE how its location and value respond to the imp-33708 ' +
    '0.5x..5x E_trunc-floor swap, as the companion to the far-tail minimum. Measurement/sensitivity ' +
    'only; conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the hump-peak location (log10 N, derivative root of the imp-97723 diagnostic) and value (diag), ' +
    'plus sigma there, for E_trunc = 3.06e-5 * factor, factor in {0.5, 1, 2, 5}; the max spread in ' +
    'each across the floor swap and the local elasticities d log10 N_peak / d log10(factor), ' +
    'd diag_peak / d log10(factor)',
  peak: {
    log10N: +BASELINE.log10N.toFixed(5), // ~7.76832
    diag: +BASELINE.diag.toFixed(5), // ~14.89166
    sigma: +BASELINE.sigma.toFixed(5), // ~0.86502
    deriv_at_pin: +BASELINE.deriv.toExponential(2),
    note:
      'derivative root-finding pins the imp-97759 small-N hump (peak ~ 14.8 near N ~ 1e8); a genuine ' +
      'stationary point (|deriv| < 1e-8) with sigma ~ 0.865, so the sigma * log T0 term dominates',
  },
  floorSwap: {
    factors: FLOOR_FACTORS,
    location_spread_decades: +LOC_SPREAD.toFixed(4), // ~1.79
    value_spread: +VAL_SPREAD.toFixed(4), // ~4.09
    value_relative_band: +VAL_REL_BAND.toFixed(4), // ~0.275
    location_elasticity_per_decade: +LOC_ELASTICITY.toFixed(4), // ~ -1.79
    value_elasticity_per_decade: +VAL_ELASTICITY.toFixed(4), // ~ -4.09
    note:
      'the floor slides the peak LOCATION by ~1.79 decades (elasticity ~ -1.79) AND its VALUE by ' +
      '~27.5% (elasticity ~ -4.09): both strongly floor-sensitive because sigma ~ 0.865 is near 1 ' +
      'at the hump, the opposite extreme from the far-tail crossings and the robust minimum value',
  },
  ladder: LADDER,
  finding: {
    F1_peak_pinned:
      'The hump peak is pinned at log10 N = 7.76832, diag = 14.89166 (baseline floor) with sigma = ' +
      '0.86502, so the sigma * log T0 term dominates -- reproducing the imp-97759 sketch (peak ~ 14.8 ' +
      'near N ~ 1e8). Derivative root-finding gives a genuine stationary point (|deriv| < 1e-8).',
    F2_location_strongly_floor_sensitive:
      'Across the 0.5x..5x floor swap the peak LOCATION moves 1.79 decades (log10 N: 8.317 at 0.5x ' +
      '-> 6.524 at 5x) with elasticity d log10 N_peak / d log10(factor) ~ -1.79. Lowering the floor ' +
      'lifts sigma so the sigma * log T0 hump reaches further into the tail and the peak slides to ' +
      'higher N; raising it pulls the peak in.',
    F3_value_also_strongly_floor_sensitive:
      'Across the same swap diag_peak moves 4.094 (16.131 at 0.5x -> 12.037 at 5x, a ~27.5% band) ' +
      'with elasticity d diag_peak / d log10(factor) ~ -4.09. This is the OPPOSITE extreme from both ' +
      'the far-tail crossings (imp-97759 F3, floor-insensitive location to < 1e-11) and the local ' +
      'minimum value (imp-97777 F3, ~0.34% robust): at the hump sigma ~ 0.865 is near 1, so the ' +
      'E_trunc floor directly modulates sigma and the dominant sigma * log T0 term -- BOTH the peak ' +
      'location and value move a lot.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / SENSITIVITY (frontier-direction, NOT rigorous). Derivative root-finding pins the ' +
    'imp-97759 small-N hump peak of the FULL imp-97723 diagnostic at log10 N = 7.76832, diag = ' +
    '14.89166 (baseline floor) with sigma = 0.86502, reproducing the sketch (peak ~ 14.8 near ' +
    'N ~ 1e8) as a genuine stationary point (|deriv| < 1e-8). Running the imp-33708 0.5x..5x ' +
    'E_trunc-floor swap, the peak is strongly floor-sensitive in BOTH location -- it moves 1.79 ' +
    'decades (8.317 at 0.5x -> 6.524 at 5x, elasticity ~ -1.79) -- AND value -- it moves 4.094 ' +
    '(16.131 -> 12.037, ~27.5%, elasticity ~ -4.09). Where sigma ~ 0.865 is near 1 the E_trunc floor ' +
    'directly modulates the dominant sigma * log T0 term, so the hump peak is the OPPOSITE extreme ' +
    'from both the far-tail crossings (imp-97759 F3, floor-insensitive location to < 1e-11) and the ' +
    'robust local-minimum value (imp-97777 F3, ~0.34%): deep in the tail (sigma -> 0) the floor does ' +
    'not matter, at the hump (sigma near 1) it matters most. Measurement only; uses the inherited ' +
    'imp-3406/imp-97723 model and the imp-33708 floor swap, NOT a rigorous asymptotic; C_mb stays ' +
    'GUE-conditional (imp-486); changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-97777 (companion local-minimum pin); imp-97759 (notes the hump, never pinned); imp-97723 ' +
    '(full diagnostic closed form); imp-33708 (0.5x..5x E_trunc floor swap); imp-486 (C_mb ' +
    'GUE-conditional); imp-2631 (E_trunc = 3.06e-5 fixed-strip floor); lambda-rh-height-mapping ' +
    '(RvM inverse).',
};

export const IMP97782_FARTAIL_DIAGNOSTIC_HUMP_PEAK_PIN_ASSERTIONS = [
  {
    // (F1) Derivative root-finding reproduces the imp-97759 hump landmark (peak ~ 14.8 near N ~ 1e8).
    id: 'imp97782-reproduces-imp97759-hump',
    description: 'the pinned baseline peak matches the imp-97759 hump sketch (log10 N ~ 7.8, diag ~ 14.8)',
    holds: () =>
      Math.abs(BASELINE.log10N - 7.76832) < 1e-3 &&
      Math.abs(BASELINE.diag - 14.89166) < 1e-2,
  },
  {
    // (F1) The pin is a genuine stationary point: derivative is at the root-find floor.
    id: 'imp97782-pin-is-stationary',
    description: 'the diagnostic derivative at the pinned peak is < 1e-8 in magnitude (genuine stationary point)',
    holds: () => Math.abs(BASELINE.deriv) < 1e-8,
  },
  {
    // (F1) sigma is near 1 at the hump (E_coll dominant), so the sigma*log T0 term dominates diag.
    id: 'imp97782-sigma-near-one-at-peak',
    description: 'sigma at the pinned peak is in [0.8, 0.95] (E_coll dominant, sigma*log T0 term dominates)',
    holds: () => BASELINE.sigma > 0.8 && BASELINE.sigma < 0.95,
  },
  {
    // (F2) The peak LOCATION is strongly floor-sensitive: ~1.79 decades across the 0.5x..5x swap.
    id: 'imp97782-location-strongly-floor-sensitive',
    description: 'the peak location spread across the floor swap exceeds 1 decade in log10 N',
    holds: () => LOC_SPREAD > 1 && LOC_SPREAD < 2.5,
  },
  {
    // (F2) The location elasticity is near -1.79 per decade of floor factor (lower floor -> higher N).
    id: 'imp97782-location-elasticity-near-minus-1p8',
    description: 'd log10 N_peak / d log10(factor) is negative and near -1.8 (lower floor pushes the peak to higher N)',
    holds: () => LOC_ELASTICITY < -1.5 && LOC_ELASTICITY > -2.1,
  },
  {
    // (F3) The peak VALUE is ALSO strongly floor-sensitive: >10% band across the swap.
    id: 'imp97782-value-also-strongly-floor-sensitive',
    description: 'the peak value relative band across the floor swap exceeds 10% (unlike the robust minimum value)',
    holds: () => VAL_REL_BAND > 0.1 && VAL_REL_BAND < 0.5,
  },
  {
    // Monotone landmark: lower floor -> higher-N peak and higher diag value across the ladder.
    id: 'imp97782-ladder-monotone-in-floor',
    description: 'as the floor factor increases the peak location and value both strictly decrease',
    holds: () => {
      for (let i = 1; i < PINS.length; i++) {
        if (!(PINS[i].log10N < PINS[i - 1].log10N)) return false;
        if (!(PINS[i].diag < PINS[i - 1].diag)) return false;
      }
      return true;
    },
  },
  {
    // Honesty gate: measurement/sensitivity only, no QED, no refereed bound is changed.
    id: 'imp97782-honesty-gate-no-qed',
    description: 'Measurement/sensitivity only: not rigorous, no QED, no refereed bound is changed',
    holds: () =>
      IMP97782_FARTAIL_DIAGNOSTIC_HUMP_PEAK_PIN.isRigorous === false &&
      /NO QED/.test(IMP97782_FARTAIL_DIAGNOSTIC_HUMP_PEAK_PIN.verdict) &&
      /refereed bound is changed/i.test(IMP97782_FARTAIL_DIAGNOSTIC_HUMP_PEAK_PIN.verdict),
  },
];

for (const a of IMP97782_FARTAIL_DIAGNOSTIC_HUMP_PEAK_PIN_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97782-fartail-diagnostic-hump-peak-pin assertion failed: ${a.id}`
    );
  }
}
