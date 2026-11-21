/**
 * @module imp-124773-fartail-diag-value-floor-insensitivity
 *
 * imp-124773 (numerical, frontier-direction): imp-97802 completed the imp-97782 hump-peak elasticity
 * TRIPLE under the imp-33708 0.5x..5x E_trunc floor swap -- (location, diag value, sigma value) =
 * (-1.79, -4.09, -0.0534) -- and asserted in its F3 that the FAR-TAIL landmarks (sigma -> 0) are
 * floor-INSENSITIVE while the hump (sigma near 1) is value-sensitive mostly via its slide. It never
 * tabulated the far-tail diag-VALUE elasticity itself as the numeric contrast to the hump -4.09. This
 * leaf supplies that missing number: it measures d diag / d log10(factor) at fixed sigma -> 0 far-tail
 * landmark HEIGHTS under the same floor swap and reports it against the hump -4.09.
 *
 * THE COMPONENT MODEL (sub-terms REUSED BYTE-FOR-BYTE from imp-97723 / imp-97795 / imp-97802)
 * -----------------------------------------------------------------------------------------
 *     sigma(N)  = E_coll / (E_trunc + E_flow + E_coll)
 *     E_trunc   = 3.06e-5 * factor          (imp-2631 fixed strip; factor = 1 is the baseline)
 *     E_coll    = C_C_PINNED * sqrt(log T0 / N)                (GUE-conditional C_H)
 *     E_flow    = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi   (imp-398)
 *     T0        = effectiveHeightForN(N)     (Riemann-von Mangoldt inverse)
 *     diag(N)   = (1 - sigma)(1 - 1/log(T0/2pi)) + sigma * log T0     (imp-97723 closed form)
 * factor = 1 reproduces imp-97723 / imp-97795 / imp-97802 byte-for-byte.
 *
 * THE MEASUREMENT: diag-VALUE floor elasticity at FIXED far-tail landmark heights
 * -----------------------------------------------------------------------------
 * Unlike imp-97802 (which RE-PINS the moving hump peak) and imp-97795 (which re-pins the moving local
 * minimum, giving value elasticity ~ -3.29e-3 there because the abscissa slides too), this leaf holds
 * the landmark HEIGHT fixed and swaps only the E_trunc floor, isolating the PURE value response with no
 * abscissa slide. The far-tail landmark heights are the imp-97795 set held fixed:
 *   - local minimum      log10 N = 18.77232   (imp-97777, sigma ~ 3.3e-5)
 *   - far-tail 0.99 cross log10 N = 45.42508  (imp-97759, sigma ~ 2.5e-18)
 * plus two deeper probes (log10 N = 60, 100) where sigma is so small the diag value response falls below
 * the double-precision resolution and reads EXACTLY zero. At each fixed height the elasticity is the
 * widest-arm (0.5x -> 5x, one decade) slope d diag / d log10(factor).
 *
 * THE FINDINGS (measurement / sensitivity only)
 * ---------------------------------------------
 *   (F1) THE FAR-TAIL DIAG-VALUE ELASTICITY IS NEGLIGIBLE, QUANTIFYING imp-97802 F3. Holding the height
 *        fixed, d diag / d log10(factor) is -2.41e-3 at the local minimum (log10 N = 18.77232,
 *        sigma ~ 3.3e-5), -5.55e-16 at the fixed 0.99-crossing height (log10 N = 45.42508,
 *        sigma ~ 2.5e-18), and EXACTLY 0 (below double precision) at log10 N = 60 and 100. Against the
 *        hump -4.09 that is a ratio of ~1.7e3 at the shallow-tail minimum height and ~7.4e15 at the
 *        45.42508 crossing height -- floor-INsensitivity, now a number.
 *   (F2) THE ELASTICITY COLLAPSES MONOTONICALLY WITH sigma. |d diag / d log10 factor| falls 2.41e-3 ->
 *        5.55e-16 -> 0 as sigma at the fixed height falls 3.3e-5 -> 2.5e-18 -> underflow, tracking the
 *        single sigma-driven mechanism of imp-97795: the E_trunc floor perturbs diag only through sigma
 *        (the (1-sigma)(1-1/Lprime) + sigma*log T0 form is stationary in the floor except via sigma), and
 *        sigma -> 0 kills the response.
 *   (F3) THE FIXED-HEIGHT MINIMUM ELASTICITY (-2.41e-3) IS SMALLER THAN THE RE-PINNED -3.29e-3. Holding
 *        the local-minimum height fixed removes the abscissa-slide contribution that imp-97795 includes
 *        when it re-pins the minimum, so the pure value response (-2.41e-3) is ~27% smaller -- consistent
 *        with imp-97802 F2/F3 that part of the landmark value sensitivity lives in the slide, not the
 *        pointwise floor response. Both are ~3 orders below the hump -4.09.
 *
 * The punchline: the far-tail (sigma -> 0) diag-VALUE floor elasticity that imp-97802 F3 asserted but
 * never tabulated is -2.41e-3 at the local-minimum height (sigma ~ 3.3e-5), -5.55e-16 at the fixed
 * 0.99-crossing height (sigma ~ 2.5e-18) and exactly 0 by log10 N = 60 -- ~1.7e3 to ~7.4e15 times
 * smaller than the hump peak -4.09, quantifying the floor-insensitivity of the deep tail as the numeric
 * contrast to the value-sensitive hump.
 *
 * MEASUREMENT / SENSITIVITY ONLY. Conditional-share diagnostic, NOT an RH bound. Uses the inherited
 * imp-3406/imp-97723 component model and the imp-33708 floor swap, NOT a rigorous asymptotic; C_mb
 * stays GUE-conditional per imp-486; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-97802-fartail-hump-peak-sigma-value-elasticity (the hump peak diag-value elasticity -4.09; F3 asserts far-tail insensitivity)
 * @see imp-97795-fartail-diagnostic-three-landmark-floor-table (re-pinned local-minimum value elasticity -3.29e-3)
 * @see imp-97723-sigma-fartail-diagnostic-asymptote-one (the full diagnostic closed form, asymptote 1)
 * @see imp-97759-fartail-crossing-etrunc-floor-sensitivity-crossover (the 0.99-crossing height 45.42508)
 * @see imp-97777-fartail-diagnostic-local-minimum-pin (the local-minimum height 18.77232)
 * @see imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity (the 0.5x..5x E_trunc floor swap)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via the RvM inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor (imp-97744 baseline)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-97723/imp-97795/imp-97802 exactly

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
function diagAt(x, E_trunc) {
  const P = parts(Math.pow(10, x), E_trunc);
  return (1 - P.sigma) * (1 - 1 / P.Lprime) + P.sigma * P.L;
}
function sigmaAt(x, E_trunc) {
  return parts(Math.pow(10, x), E_trunc).sigma;
}

const FLOOR_FACTORS = [0.5, 1.0, 2.0, 5.0];
const D_LOG10_FACTOR = Math.log10(5.0) - Math.log10(0.5); // = 1 decade

const HUMP_VALUE_ELASTICITY = -4.09; // imp-97782/imp-97802 F3 reference

// The far-tail (sigma -> 0) landmark heights, held FIXED (imp-97795 set + two deeper probes).
const LANDMARK_HEIGHTS = [
  { name: 'local-minimum', log10N: 18.77232 }, // imp-97777
  { name: 'far-tail-0.99-crossing', log10N: 45.42508 }, // imp-97759
  { name: 'deep-probe-1e60', log10N: 60 },
  { name: 'deep-probe-1e100', log10N: 100 },
];

function landmarkRow(name, x) {
  const diags = FLOOR_FACTORS.map((f) => diagAt(x, E_TRUNC_BASE * f));
  const base = diagAt(x, E_TRUNC_BASE);
  const loArm = diagAt(x, E_TRUNC_BASE * 0.5); // 0.5x
  const hiArm = diagAt(x, E_TRUNC_BASE * 5.0); // 5.0x
  const valElasticity = (hiArm - loArm) / D_LOG10_FACTOR;
  const relBand = (Math.max(...diags) - Math.min(...diags)) / base;
  const ratioVsHump =
    valElasticity === 0
      ? Infinity
      : Math.abs(HUMP_VALUE_ELASTICITY) / Math.abs(valElasticity);
  return {
    landmark: name,
    log10N: x,
    sigma_at_height: +sigmaAt(x, E_TRUNC_BASE).toExponential(4),
    diag: +base.toFixed(7),
    value_floor_elasticity: valElasticity === 0 ? 0 : +valElasticity.toExponential(4),
    value_rel_floor_band: relBand === 0 ? 0 : +relBand.toExponential(4),
    ratio_vs_hump_4p09: ratioVsHump === Infinity ? 'Infinity' : +ratioVsHump.toExponential(3),
  };
}

const LANDMARK_TABLE = LANDMARK_HEIGHTS.map((lm) => landmarkRow(lm.name, lm.log10N));

const MIN_ROW = LANDMARK_TABLE[0];
const CROSS_ROW = LANDMARK_TABLE[1];
const DEEP60_ROW = LANDMARK_TABLE[2];

export const IMP124773_FARTAIL_DIAG_VALUE_FLOOR_INSENSITIVITY = {
  id: 'imp-124773',
  proofSection: 'S-frontier',
  question:
    'imp-97802 completed the imp-97782 hump-peak elasticity triple (location -1.79, diag value -4.09, ' +
    'sigma value -0.0534) under the imp-33708 0.5x..5x E_trunc floor swap and asserted in F3 that the ' +
    'far-tail landmarks (sigma -> 0) are floor-INSENSITIVE while the hump (sigma near 1) is value-' +
    'sensitive, but never tabulated the far-tail diag-VALUE elasticity as the numeric contrast to the ' +
    'hump -4.09. MEASURE d diag / d log10(factor) at fixed sigma -> 0 far-tail landmark heights and ' +
    'report it against -4.09. Measurement/sensitivity only; conditional-share diagnostic, NOT an RH ' +
    'bound; no QED.',
  measuredQuantity:
    'the diag-VALUE floor elasticity d diag / d log10(factor) across the imp-33708 0.5x..5x swap at ' +
    'FIXED far-tail landmark heights (local minimum log10 N = 18.77232, 0.99-crossing height 45.42508, ' +
    'deep probes 60 and 100), the relative floor band there, and the ratio to the hump peak value ' +
    'elasticity -4.09',
  humpValueElasticityReference: HUMP_VALUE_ELASTICITY,
  floorFactors: FLOOR_FACTORS,
  landmarkTable: LANDMARK_TABLE,
  finding: {
    F1_fartail_value_elasticity_negligible:
      'Holding the height fixed, d diag / d log10(factor) is -2.41e-3 at the local minimum ' +
      '(log10 N = 18.77232, sigma ~ 3.3e-5), -5.55e-16 at the fixed 0.99-crossing height ' +
      '(log10 N = 45.42508, sigma ~ 2.5e-18) and EXACTLY 0 (below double precision) at log10 N = 60 and ' +
      '100. Against the hump -4.09 that is ~1.7e3 at the minimum height and ~7.4e15 at the crossing ' +
      'height -- floor-INsensitivity, now a number.',
    F2_elasticity_collapses_with_sigma:
      'The magnitude falls 2.41e-3 -> 5.55e-16 -> 0 as sigma at the fixed height falls 3.3e-5 -> ' +
      '2.5e-18 -> underflow, tracking the single sigma-driven mechanism: the E_trunc floor perturbs ' +
      'diag only through sigma, so sigma -> 0 kills the value response.',
    F3_fixed_height_smaller_than_repinned:
      'The fixed-height minimum elasticity (-2.41e-3) is ~27% smaller than the imp-97795 re-pinned ' +
      '-3.29e-3 because holding the height fixed removes the abscissa-slide contribution -- consistent ' +
      'with imp-97802 that part of the landmark value sensitivity lives in the slide. Both are ~3 orders ' +
      'below the hump -4.09.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / SENSITIVITY (frontier-direction, NOT rigorous). The far-tail (sigma -> 0) diag-VALUE ' +
    'floor elasticity that imp-97802 F3 asserted but never tabulated is -2.41e-3 at the fixed local-' +
    'minimum height (log10 N = 18.77232, sigma ~ 3.3e-5), -5.55e-16 at the fixed 0.99-crossing height ' +
    '(log10 N = 45.42508, sigma ~ 2.5e-18) and EXACTLY 0 (below double precision) by log10 N = 60 -- ' +
    '~1.7e3 to ~7.4e15 times smaller than the hump peak value elasticity -4.09, and monotone-collapsing ' +
    'with sigma. Holding the height fixed isolates the pure value response (no abscissa slide), so the ' +
    'minimum elasticity is ~27% below the imp-97795 re-pinned -3.29e-3. This quantifies the deep-tail ' +
    'floor-insensitivity as the numeric contrast to the value-sensitive hump: the E_trunc floor bites ' +
    'the diagnostic only through sigma, which is negligible in the far tail. Measurement only; uses the ' +
    'inherited imp-3406/imp-97723 model and the imp-33708 floor swap, NOT a rigorous asymptotic; C_mb ' +
    'stays GUE-conditional (imp-486); changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-97802 (hump peak diag-value elasticity -4.09; F3 asserts far-tail insensitivity); imp-97795 ' +
    '(re-pinned local-minimum value elasticity -3.29e-3); imp-97777 (local-minimum height 18.77232); ' +
    'imp-97759 (0.99-crossing height 45.42508); imp-97723 (full diagnostic closed form); imp-33708 ' +
    '(0.5x..5x E_trunc floor swap); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc = 3.06e-5 ' +
    'fixed-strip floor); lambda-rh-height-mapping (RvM inverse).',
};

export const IMP124773_FARTAIL_DIAG_VALUE_FLOOR_INSENSITIVITY_ASSERTIONS = [
  {
    // (F1) The local-minimum-height diag-value elasticity is negative and ~1e-3 in magnitude.
    id: 'imp124773-min-height-value-elasticity-small',
    description: 'the fixed local-minimum-height diag-value elasticity is negative and near -2.4e-3',
    holds: () =>
      MIN_ROW.value_floor_elasticity < 0 &&
      Math.abs(MIN_ROW.value_floor_elasticity) > 1e-3 &&
      Math.abs(MIN_ROW.value_floor_elasticity) < 1e-2,
  },
  {
    // (F1) The 0.99-crossing-height elasticity is negligible (below 1e-12), quantifying insensitivity.
    id: 'imp124773-crossing-height-value-elasticity-negligible',
    description: 'the fixed 0.99-crossing-height diag-value elasticity is < 1e-12 in magnitude',
    holds: () =>
      CROSS_ROW.value_floor_elasticity !== 0 &&
      Math.abs(CROSS_ROW.value_floor_elasticity) < 1e-12,
  },
  {
    // (F1) The far-tail ratio to the hump -4.09 is enormous (> 1e3 at the minimum height).
    id: 'imp124773-ratio-vs-hump-large',
    description: 'the ratio of the hump |value elasticity| to the far-tail value elasticity is > 1e3',
    holds: () =>
      typeof MIN_ROW.ratio_vs_hump_4p09 === 'number' && MIN_ROW.ratio_vs_hump_4p09 > 1e3,
  },
  {
    // (F1/F2) The deep probe underflows to exactly 0: floor-insensitive to machine zero.
    id: 'imp124773-deep-probe-underflows-to-zero',
    description: 'the log10 N = 60 deep-probe diag-value elasticity is exactly 0 (below double precision)',
    holds: () => DEEP60_ROW.value_floor_elasticity === 0,
  },
  {
    // (F2) The elasticity magnitude collapses monotonically as sigma at the fixed height falls.
    id: 'imp124773-elasticity-collapses-with-sigma',
    description: 'the value-elasticity magnitude falls monotonically minimum > crossing > deep probe',
    holds: () =>
      Math.abs(MIN_ROW.value_floor_elasticity) > Math.abs(CROSS_ROW.value_floor_elasticity) &&
      Math.abs(CROSS_ROW.value_floor_elasticity) > Math.abs(DEEP60_ROW.value_floor_elasticity),
  },
  {
    // Honesty gate: measurement/sensitivity only, no QED, no refereed bound is changed.
    id: 'imp124773-honesty-gate-no-qed',
    description: 'Measurement/sensitivity only: not rigorous, no QED, no refereed bound is changed',
    holds: () =>
      IMP124773_FARTAIL_DIAG_VALUE_FLOOR_INSENSITIVITY.isRigorous === false &&
      /NO QED/.test(IMP124773_FARTAIL_DIAG_VALUE_FLOOR_INSENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP124773_FARTAIL_DIAG_VALUE_FLOOR_INSENSITIVITY.verdict),
  },
];

for (const a of IMP124773_FARTAIL_DIAG_VALUE_FLOOR_INSENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-124773-fartail-diag-value-floor-insensitivity assertion failed: ${a.id}`
    );
  }
}
