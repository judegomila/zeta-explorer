/**
 * @module imp-97802-fartail-hump-peak-sigma-value-elasticity
 *
 * imp-97802 (numerical, frontier-direction): imp-97782 pinned the FULL imp-97723 sigma-diagnostic hump
 * peak at log10 N = 7.76832, diag = 14.89166 with sigma = 0.86502 there, and under the imp-33708
 * 0.5x..5x E_trunc floor swap reported the peak LOCATION elasticity (d log10 N_peak / d log10 factor
 * ~ -1.79) and the peak diag-VALUE elasticity (d diag_peak / d log10 factor ~ -4.09). It never reported
 * how the peak SIGMA value itself (0.865) moves across the swap. This leaf completes the elasticity
 * TRIPLE (location, diag value, sigma value) by re-pinning the peak at each floor factor and measuring
 * d sigma_peak / d log10 factor.
 *
 * THE FULL DIAGNOSTIC (sub-terms REUSED BYTE-FOR-BYTE from imp-97782 / imp-97723)
 * ------------------------------------------------------------------------------
 *     sigma(N)  = E_coll / (E_trunc + E_flow + E_coll)
 *     E_trunc   = 3.06e-5 * factor          (imp-2631 fixed strip; factor = 1 is the baseline)
 *     E_coll    = C_C_PINNED * sqrt(log T0 / N)                (GUE-conditional C_H)
 *     E_flow    = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi   (imp-398)
 *     T0        = effectiveHeightForN(N)     (Riemann-von Mangoldt inverse)
 *     diag(N)   = (1 - sigma)(1 - 1/log(T0/2pi)) + sigma * log T0     (imp-97723 closed form)
 * The peak is re-pinned at each floor factor by the SAME derivative root-find as imp-97782 (bisect the
 * log10-N derivative of diag on [2, 16]); factor = 1 reproduces the imp-97782 baseline byte-for-byte.
 *
 * THE MEASUREMENT: sigma-value response of the pinned peak to the floor swap
 * ------------------------------------------------------------------------
 * For each factor in {0.5, 1, 2, 5} the peak is re-pinned and sigma AT the peak is recorded; the max
 * spread and the local elasticity d sigma_peak / d log10 factor across the widest 0.5x..5x arm are
 * reported, alongside the parent location and diag-value elasticities for the completed triple.
 *
 * THE FINDINGS (measurement / sensitivity only)
 * ---------------------------------------------
 *   (F1) THE PEAK SIGMA VALUE IS ONLY MILDLY FLOOR-SENSITIVE. Across the 0.5x..5x swap sigma_peak
 *        moves 0.05337 (0.87747 at 0.5x -> 0.82410 at 5x, a ~6.17% relative band) with elasticity
 *        d sigma_peak / d log10 factor ~ -0.05337. Raising the floor lowers the E_coll share so sigma
 *        falls, monotone with the location and diag-value legs, but by far the smallest of the three.
 *   (F2) THE ELASTICITY TRIPLE IS COMPLETED AND SEPARATES BY ~76x. (location, diag value, sigma value)
 *        = (-1.79, -4.09, -0.0534) per decade of floor factor; |diag-value elasticity| exceeds
 *        |sigma-value elasticity| by ~76.7x. The peak diag value is far more floor-sensitive than the
 *        sigma value it is built from because the peak also SLIDES (F2 of imp-97782, ~1.79 decades),
 *        so log T0 at the peak changes too: diag_peak = sigma_peak * log T0(peak) + ... amplifies the
 *        small sigma move through both the sigma factor AND the shifting log T0.
 *   (F3) THE SIGMA-NEAR-1 MECHANISM IS CONFIRMED, BOUNDED. sigma_peak stays in [0.824, 0.878] across
 *        the entire swap -- always near 1 -- so the E_trunc floor never dislodges the sigma * log T0
 *        term from dominance; it only trims the E_coll share a few percent. This bounds WHY the peak
 *        value is floor-sensitive (the dominant term is sigma * log T0 and sigma stays ~ 0.85) without
 *        the sigma value itself being where most of the value sensitivity lives -- that is the location
 *        slide. The far-tail landmarks (sigma -> 0) are floor-insensitive; the hump (sigma near 1) is
 *        value-sensitive mostly via its slide, only mildly via sigma.
 *
 * The punchline: re-pinning the imp-97782 hump peak across the imp-33708 0.5x..5x floor swap, the peak
 * SIGMA value moves only 0.05337 (~6.17%, elasticity ~ -0.0534), completing the elasticity triple
 * (location -1.79, diag value -4.09, sigma value -0.0534): the diag-value leg is ~76.7x the sigma-value
 * leg, so the peak value's strong floor sensitivity comes far more from the peak SLIDING (changing
 * log T0) than from the sigma value itself moving. sigma stays in [0.824, 0.878] -- always near 1 -- so
 * the sigma * log T0 term stays dominant throughout.
 *
 * MEASUREMENT / SENSITIVITY ONLY. Conditional-share diagnostic, NOT an RH bound. Uses the inherited
 * imp-3406/imp-97723 component model and the imp-33708 floor swap, NOT a rigorous asymptotic; C_mb
 * stays GUE-conditional per imp-486; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97782-fartail-diagnostic-hump-peak-pin (parent: pins the peak, reports location + diag-value elasticities)
 * @see imp-97795-fartail-diagnostic-three-landmark-floor-table (co-tabulates the three landmarks)
 * @see imp-97723-sigma-fartail-diagnostic-asymptote-one (the full diagnostic closed form)
 * @see imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity (the 0.5x..5x E_trunc floor swap)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via the RvM inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor (imp-97744 baseline)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-97782/imp-97723 exactly

// EXACT imp-97782 sub-terms; ONLY the E_trunc floor is a parameter here.
function parts(N, E_trunc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const sigma = E_coll / (E_trunc + E_flow + E_coll);
  return { L, sigma, Lprime: Math.log(T0 / TWO_PI) };
}
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

// Pin the hump peak by bisecting the derivative root on [2, 16] (IDENTICAL to imp-97782).
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

// --- The NEW measurement: sigma-value spread and elasticity across the floor swap -------------
const sigs = PINS.map((p) => p.sigma);
const SIGMA_SPREAD = Math.max(...sigs) - Math.min(...sigs); // ~0.05337

const loArm = PINS.find((p) => p.factor === 0.5);
const hiArm = PINS.find((p) => p.factor === 5.0);
const dLog10Factor = Math.log10(5.0) - Math.log10(0.5); // = 1 decade
const SIGMA_ELASTICITY = (hiArm.sigma - loArm.sigma) / dLog10Factor; // ~ -0.05337
const SIGMA_REL_BAND = SIGMA_SPREAD / BASELINE.sigma; // ~0.0617 (~6.17%)

// --- Parent location + diag-value elasticities, recomputed here for the completed triple ------
const LOC_ELASTICITY = (hiArm.log10N - loArm.log10N) / dLog10Factor; // ~ -1.79 (imp-97782 F2)
const VAL_ELASTICITY = (hiArm.diag - loArm.diag) / dLog10Factor; // ~ -4.09 (imp-97782 F3)
// How much the diag-value leg exceeds the sigma-value leg (the amplification of the slide).
const VAL_OVER_SIGMA_ELASTICITY = Math.abs(VAL_ELASTICITY) / Math.abs(SIGMA_ELASTICITY); // ~76.7

const LADDER = PINS.map((p) => ({
  factor: p.factor,
  log10N_peak: +p.log10N.toFixed(5),
  diag_peak: +p.diag.toFixed(5),
  sigma_peak: +p.sigma.toFixed(6),
  deriv_at_peak: +p.deriv.toExponential(2),
}));

export const IMP97802_FARTAIL_HUMP_PEAK_SIGMA_VALUE_ELASTICITY = {
  id: 'imp-97802',
  proofSection: 'S-frontier',
  question:
    'imp-97782 pinned the FULL imp-97723 diagnostic hump peak at log10 N = 7.76832, diag = 14.89166, ' +
    'sigma = 0.86502 and reported the peak LOCATION elasticity (~ -1.79) and diag-VALUE elasticity ' +
    '(~ -4.09) under the imp-33708 0.5x..5x E_trunc floor swap, but never how the peak SIGMA value ' +
    'itself (0.865) moves. MEASURE d sigma_peak / d log10 factor by re-pinning the peak at each floor, ' +
    'completing the elasticity triple (location, diag value, sigma value). Measurement/sensitivity ' +
    'only; conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'sigma AT the re-pinned hump peak for E_trunc = 3.06e-5 * factor, factor in {0.5, 1, 2, 5}; its max ' +
    'spread and the local elasticity d sigma_peak / d log10(factor) across the 0.5x..5x swap, alongside ' +
    'the parent location and diag-value elasticities for the completed triple',
  peakBaseline: {
    log10N: +BASELINE.log10N.toFixed(5), // ~7.76832
    diag: +BASELINE.diag.toFixed(5), // ~14.89166
    sigma: +BASELINE.sigma.toFixed(6), // ~0.865018
    note:
      'reproduces the imp-97782 baseline peak byte-for-byte (same derivative root-find, same sub-terms)',
  },
  floorSwap: {
    factors: FLOOR_FACTORS,
    sigma_spread: +SIGMA_SPREAD.toFixed(6), // ~0.053365
    sigma_relative_band: +SIGMA_REL_BAND.toFixed(6), // ~0.061692 (~6.17%)
    sigma_elasticity_per_decade: +SIGMA_ELASTICITY.toFixed(6), // ~ -0.053365
    location_elasticity_per_decade: +LOC_ELASTICITY.toFixed(4), // ~ -1.79 (imp-97782 F2)
    value_elasticity_per_decade: +VAL_ELASTICITY.toFixed(4), // ~ -4.09 (imp-97782 F3)
    value_over_sigma_elasticity_ratio: +VAL_OVER_SIGMA_ELASTICITY.toFixed(2), // ~76.7
    note:
      'the peak sigma value moves only ~6.17% across the floor swap (elasticity ~ -0.0534), the ' +
      'SMALLEST leg of the triple; the diag-value leg (~ -4.09) is ~76.7x larger because the peak also ' +
      'slides ~1.79 decades so log T0 at the peak changes too -- the value sensitivity lives mostly in ' +
      'the slide, not in the sigma value itself',
  },
  ladder: LADDER,
  finding: {
    F1_sigma_value_mildly_floor_sensitive:
      'Across the 0.5x..5x floor swap the peak SIGMA value moves 0.05337 (0.87747 at 0.5x -> 0.82410 ' +
      'at 5x, a ~6.17% relative band) with elasticity d sigma_peak / d log10(factor) ~ -0.05337. ' +
      'Raising the floor trims the E_coll share so sigma falls, monotone with the location and ' +
      'diag-value legs but by far the smallest of the three.',
    F2_elasticity_triple_completed:
      'The elasticity triple is (location, diag value, sigma value) = (-1.79, -4.09, -0.0534) per ' +
      'decade of floor factor; |diag-value elasticity| exceeds |sigma-value elasticity| by ~76.7x. ' +
      'The peak diag value is far more floor-sensitive than the sigma value it is built from because ' +
      'the peak also slides ~1.79 decades, so log T0 at the peak changes too and amplifies the small ' +
      'sigma move through both the sigma factor and the shifting log T0.',
    F3_sigma_near_one_mechanism_bounded:
      'sigma_peak stays in [0.824, 0.878] across the whole swap -- always near 1 -- so the E_trunc ' +
      'floor never dislodges the sigma * log T0 term from dominance; it only trims the E_coll share a ' +
      'few percent. The dominant term stays sigma * log T0 with sigma ~ 0.85, but the peak VALUE ' +
      'sensitivity lives mostly in the location slide, not in the sigma value moving. Far-tail ' +
      'landmarks (sigma -> 0) are floor-insensitive; the hump (sigma near 1) is value-sensitive mostly ' +
      'via its slide, only mildly via sigma.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / SENSITIVITY (frontier-direction, NOT rigorous). Re-pinning the imp-97782 hump peak ' +
    'of the FULL imp-97723 diagnostic across the imp-33708 0.5x..5x E_trunc floor swap, the peak SIGMA ' +
    'value moves only 0.05337 (0.87747 at 0.5x -> 0.82410 at 5x, ~6.17%, elasticity ~ -0.0534), the ' +
    'SMALLEST leg of the completed elasticity triple (location -1.79, diag value -4.09, sigma value ' +
    '-0.0534). The diag-value leg is ~76.7x the sigma-value leg because the peak also slides ~1.79 ' +
    'decades, so log T0 at the peak changes too: the peak value sensitivity lives mostly in the ' +
    'location slide, not in the sigma value itself. sigma_peak stays in [0.824, 0.878] -- always near ' +
    '1 -- so the sigma * log T0 term stays dominant throughout, confirming the sigma-near-1 mechanism ' +
    'while bounding where the value sensitivity actually comes from. Measurement only; uses the ' +
    'inherited imp-3406/imp-97723 model and the imp-33708 floor swap, NOT a rigorous asymptotic; C_mb ' +
    'stays GUE-conditional (imp-486); changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97782 (parent: pins the peak, reports location + diag-value elasticities); imp-97795 ' +
    '(three-landmark floor table); imp-97723 (full diagnostic closed form); imp-33708 (0.5x..5x ' +
    'E_trunc floor swap); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc = 3.06e-5 fixed-strip ' +
    'floor); lambda-rh-height-mapping (RvM inverse).',
};

export const IMP97802_FARTAIL_HUMP_PEAK_SIGMA_VALUE_ELASTICITY_ASSERTIONS = [
  {
    // The baseline peak reproduces imp-97782 byte-for-byte (same pin, same sigma).
    id: 'imp97802-reproduces-imp97782-baseline',
    description: 'the baseline pinned peak matches imp-97782 (log10 N ~ 7.76832, diag ~ 14.89166, sigma ~ 0.865018)',
    holds: () =>
      Math.abs(BASELINE.log10N - 7.76832) < 1e-3 &&
      Math.abs(BASELINE.diag - 14.89166) < 1e-2 &&
      Math.abs(BASELINE.sigma - 0.865018) < 1e-4,
  },
  {
    // (F1) The peak sigma value is only mildly floor-sensitive: ~6.17% band across the swap.
    id: 'imp97802-sigma-value-mildly-floor-sensitive',
    description: 'the peak sigma relative band across the floor swap is small (< 10%)',
    holds: () => SIGMA_REL_BAND > 0.02 && SIGMA_REL_BAND < 0.1,
  },
  {
    // (F1) The sigma-value elasticity is negative and small in magnitude (~ -0.0534 per decade).
    id: 'imp97802-sigma-elasticity-small-negative',
    description: 'd sigma_peak / d log10(factor) is negative and small in magnitude (near -0.053)',
    holds: () => SIGMA_ELASTICITY < 0 && Math.abs(SIGMA_ELASTICITY) < 0.1,
  },
  {
    // (F2) The diag-value leg dwarfs the sigma-value leg (the location slide amplifies the value).
    id: 'imp97802-value-leg-dwarfs-sigma-leg',
    description: 'the diag-value elasticity exceeds the sigma-value elasticity in magnitude by more than 20x',
    holds: () => VAL_OVER_SIGMA_ELASTICITY > 20,
  },
  {
    // (F3) sigma stays near 1 across the whole swap: the sigma*log T0 term stays dominant.
    id: 'imp97802-sigma-stays-near-one',
    description: 'sigma at the peak stays in [0.8, 0.9] across the entire floor swap',
    holds: () => sigs.every((s) => s > 0.8 && s < 0.9),
  },
  {
    // Monotone landmark: raising the floor lowers sigma at the peak, monotone across the ladder.
    id: 'imp97802-sigma-monotone-in-floor',
    description: 'as the floor factor increases sigma at the peak strictly decreases',
    holds: () => {
      for (let i = 1; i < PINS.length; i++) {
        if (!(PINS[i].sigma < PINS[i - 1].sigma)) return false;
      }
      return true;
    },
  },
  {
    // Honesty gate: measurement/sensitivity only, no QED, PT stays SOTA.
    id: 'imp97802-honesty-gate-no-qed',
    description: 'Measurement/sensitivity only: not rigorous, no QED, PT stays SOTA',
    holds: () =>
      IMP97802_FARTAIL_HUMP_PEAK_SIGMA_VALUE_ELASTICITY.isRigorous === false &&
      /NO QED/.test(IMP97802_FARTAIL_HUMP_PEAK_SIGMA_VALUE_ELASTICITY.verdict) &&
      /remains SOTA/.test(IMP97802_FARTAIL_HUMP_PEAK_SIGMA_VALUE_ELASTICITY.verdict),
  },
];

for (const a of IMP97802_FARTAIL_HUMP_PEAK_SIGMA_VALUE_ELASTICITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97802-fartail-hump-peak-sigma-value-elasticity assertion failed: ${a.id}`
    );
  }
}
