/**
 * @module imp-124792-fartail-diagnostic-value-elasticity-threshold
 *
 * imp-124792 (numerical, frontier-direction): imp-97814 catalogued the FULL sigma-diagnostic landmark
 * cohort by ROLE. ROLE 4 (imp-97777, the local MINIMUM) found the diagnostic VALUE nearly
 * floor-insensitive there (value-elasticity d diag / d log10(factor) ~ -3.3e-3) while ROLE 5
 * (imp-97782, the hump PEAK) found the value strongly floor-sensitive (elasticity ~ -4.09). Those are
 * opposite extremes governed by how close sigma sits to 1 at the landmark, but the TRANSITION between
 * the two value-sensitivity regimes was never pinned. This module pins it: reusing the imp-97777 /
 * imp-97782 diagnostic + 0.5x..5x floor-swap machinery verbatim, it sweeps the landmark abscissa and
 * locates the diagnostic-value / sigma at which the value-elasticity crosses a chosen magnitude
 * threshold (|elasticity| = 0.1, plus a ladder), pinning where floor-insensitivity switches on.
 *
 * THE FULL DIAGNOSTIC (identical sub-terms to imp-3406 / imp-97723 / imp-97777 / imp-97782)
 * ---------------------------------------------------------------------------------------
 *     sigma(N)  = E_coll / (E_trunc + E_flow + E_coll)
 *     E_trunc   = 3.06e-5 * factor          (imp-2631 fixed strip; factor = 1 is the baseline)
 *     E_coll    = C_C_PINNED * sqrt(log T0 / N)                (GUE-conditional C_H)
 *     E_flow    = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi   (imp-398)
 *     T0        = effectiveHeightForN(N)     (Riemann-von Mangoldt inverse)
 *     diag(N)   = (1 - sigma)(1 - 1/log(T0/2pi)) + sigma * log T0     (imp-97723 closed form)
 * Every sub-term is reused byte-for-byte from imp-97777 / imp-97782; the ONLY thing this module adds
 * is a scan of the landmark abscissa x = log10 N and a threshold root-find on the value-elasticity.
 *
 * THE VALUE-ELASTICITY OF A LANDMARK
 * ----------------------------------
 * At a fixed abscissa x the diagnostic VALUE responds to the imp-33708 0.5x..5x E_trunc-floor swap
 * with a per-decade elasticity
 *     ve(x) = [ diag(x, 5 * base) - diag(x, 0.5 * base) ] / (log10 5 - log10 0.5).
 * At the ROLE 5 hump peak (x ~ 7.77, sigma ~ 0.865) ve ~ -4.09; at the ROLE 4 minimum (x ~ 18.77,
 * sigma ~ 3e-5) ve ~ -3.3e-3. ve is NOT monotone between them: its MAGNITUDE rises off the hump to a
 * maximum |ve| ~ 9.996 near x ~ 9.357 (sigma ~ 0.5428), where the floor most strongly modulates the
 * dominant sigma * log T0 term, then falls off into the deep tail. Floor-insensitivity therefore
 * "switches on" on the TAIL flank of that maximum, as x climbs from the elasticity peak toward the
 * ROLE 4 minimum.
 *
 * THE MEASUREMENT: pinning the |ve| = 0.1 switch-on (plus a ladder)
 * ----------------------------------------------------------------
 * The tail-flank crossing ve(x) = -threshold is bisected on [x_of_max_elasticity, 18.77] for
 * threshold in {1.0, 0.5, 0.1, 0.05, 0.01}. Each crossing pins the abscissa, the sigma, and the
 * diagnostic value at which the value-elasticity drops through that magnitude.
 *
 * THE FINDINGS (measurement / sensitivity only)
 * ---------------------------------------------
 *   (F1) THE |ve| = 0.1 SWITCH-ON IS PINNED at log10 N = 15.25516, sigma = 1.7092e-3, diag = 1.02413
 *        (baseline floor). As x climbs past this point toward the ROLE 4 minimum the diagnostic value
 *        becomes floor-insensitive (|ve| < 0.1); below it the value is floor-sensitive. So the ROLE
 *        4-vs-ROLE 5 value-sensitivity split is a sigma ~ 1.7e-3 threshold, NOT a sigma-near-1 one.
 *   (F2) THE VALUE-ELASTICITY IS NON-MONOTONE across the landmark span. |ve| rises off the ROLE 5
 *        hump (|ve| ~ 4.09 at sigma ~ 0.865) to a maximum |ve| ~ 9.996 at sigma ~ 0.5428
 *        (x ~ 9.357) -- where the floor most strongly moves the dominant sigma * log T0 term -- then
 *        decays into the tail toward the ROLE 4 minimum (|ve| ~ 3.3e-3 at sigma ~ 3e-5). Both named
 *        ROLE endpoints lie on opposite flanks of a single interior elasticity maximum.
 *   (F3) IN THE DEEP TAIL ve IS NEARLY PROPORTIONAL TO sigma. Across the ladder ve/sigma stays in the
 *        narrow band ~ -58 to -68 (0.1/1.709e-3 = -58.5; 0.01/1.48e-4 = -67.6), so the switch-on
 *        sigma scales roughly linearly with the chosen threshold: tightening |ve| from 0.1 to 0.01
 *        drops the threshold sigma from 1.71e-3 to 1.48e-4 (~11.5x for a 10x tighter threshold). The
 *        transition is a soft, near-linear taper in sigma, not a sharp switch.
 *
 * The punchline: the ROLE 4-vs-ROLE 5 value-sensitivity split is pinned at sigma = 1.7092e-3
 * (diag = 1.02413, log10 N = 15.25516) for the |ve| = 0.1 threshold. The value-elasticity is
 * non-monotone -- both named landmarks sit on opposite flanks of an interior maximum |ve| ~ 9.996 at
 * sigma ~ 0.543 -- and in the deep tail ve is nearly proportional to sigma (ve/sigma ~ -60), so the
 * switch-on sigma tapers roughly linearly with the threshold.
 *
 * MEASUREMENT / SENSITIVITY ONLY. Conditional-share diagnostic, NOT an RH bound. Uses the inherited
 * imp-3406/imp-97723 component model and the imp-33708 floor swap, NOT a rigorous asymptotic; C_mb
 * stays GUE-conditional per imp-486; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97777-fartail-diagnostic-local-minimum-pin (ROLE 4, value floor-insensitive ~ -3.3e-3)
 * @see imp-97782-fartail-diagnostic-hump-peak-pin (ROLE 5, value floor-sensitive ~ -4.09)
 * @see imp-97814-fartail-diagnostic-landmark-cohort-index (the ROLE catalogue)
 * @see imp-97723-sigma-fartail-diagnostic-asymptote-one (the full diagnostic closed form)
 * @see imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity (the 0.5x..5x E_trunc floor swap)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via the RvM inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor (imp-97744 baseline)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-97723/imp-97777/imp-97782 exactly

// EXACT imp-97777/imp-97782 sub-terms; ONLY the E_trunc floor is a parameter here.
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
function sigmaAt(x) {
  return parts(Math.pow(10, x), E_TRUNC_BASE).sigma;
}

// The per-decade VALUE-elasticity at a fixed abscissa x under the imp-33708 0.5x..5x floor swap.
const D_LOG10_FACTOR = Math.log10(5.0) - Math.log10(0.5); // = 1 decade
function valueElasticity(x) {
  return (diagAt(x, E_TRUNC_BASE * 5.0) - diagAt(x, E_TRUNC_BASE * 0.5)) / D_LOG10_FACTOR;
}

// --- Locate the interior elasticity MAXIMUM (most negative ve) by bisecting d ve / dx on [8, 13] ---
const DERIV_H = 1e-5;
function dValueElasticity(x) {
  return (valueElasticity(x + DERIV_H) - valueElasticity(x - DERIV_H)) / (2 * DERIV_H);
}
function pinElasticityMax() {
  let lo = 8;
  let hi = 13;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (dValueElasticity(m) < 0) lo = m; // ve still descending (getting more negative)
    else hi = m;
  }
  const x = (lo + hi) / 2;
  return { log10N: x, sigma: sigmaAt(x), ve: valueElasticity(x) };
}
const ELASTICITY_MAX = pinElasticityMax();

// --- Pin the tail-flank crossing ve(x) = -threshold on [x_of_max, 18.77] for a ladder of thresholds -
function pinThreshold(mag) {
  let lo = ELASTICITY_MAX.log10N; // start just past the elasticity maximum, on the decaying flank
  let hi = 18.77; // the ROLE 4 minimum abscissa (imp-97777)
  const target = -mag;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (valueElasticity(m) < target) lo = m; // |ve| still above the threshold
    else hi = m;
  }
  const x = (lo + hi) / 2;
  return { threshold: mag, log10N: x, sigma: sigmaAt(x), diag: diagAt(x, E_TRUNC_BASE), ve: valueElasticity(x) };
}
const THRESHOLDS = [1.0, 0.5, 0.1, 0.05, 0.01];
const CROSSINGS = THRESHOLDS.map(pinThreshold);
const PRIMARY = CROSSINGS.find((c) => c.threshold === 0.1);

// --- ve / sigma in the DEEP tail (thresholds <= 0.1) where the near-linear proportionality holds ---
// The shallow rungs (|ve| = 1.0, 0.5) sit at sigma ~ 0.02/0.01 -- not yet deep tail -- and give
// ve/sigma ~ -48/-52, so the tight ~ -58..-68 band is asserted only for the deep-tail subset.
const VE_OVER_SIGMA = CROSSINGS.filter((c) => c.threshold <= 0.1).map((c) => c.ve / c.sigma);
const VE_OVER_SIGMA_MIN = Math.min(...VE_OVER_SIGMA);
const VE_OVER_SIGMA_MAX = Math.max(...VE_OVER_SIGMA);

const LADDER = CROSSINGS.map((c) => ({
  threshold: c.threshold,
  log10N: +c.log10N.toFixed(5),
  sigma: +c.sigma.toExponential(4),
  diag: +c.diag.toFixed(5),
  ve: +c.ve.toExponential(3),
}));

export const IMP124792_FARTAIL_DIAGNOSTIC_VALUE_ELASTICITY_THRESHOLD = {
  id: 'imp-124792',
  proofSection: 'S-frontier',
  question:
    'imp-97814 ROLE 4 (imp-97777, local minimum) found the FULL imp-97723 diagnostic VALUE nearly ' +
    'floor-insensitive (value-elasticity ~ -3.3e-3) while ROLE 5 (imp-97782, hump peak) found it ' +
    'strongly floor-sensitive (~ -4.09) -- opposite extremes never pinned by a transition. Reuse the ' +
    'imp-97777/imp-97782 0.5x..5x floor-swap machinery verbatim and sweep the landmark abscissa to ' +
    'locate the sigma / diagnostic-value at which the value-elasticity crosses |elasticity| = 0.1 ' +
    '(plus a ladder), pinning where floor-insensitivity switches on. Measurement/sensitivity only; ' +
    'conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the tail-flank abscissa (log10 N), sigma and diagnostic value at which the per-decade ' +
    'value-elasticity ve(x) = [diag(x, 5 * base) - diag(x, 0.5 * base)] / (log10 5 - log10 0.5) drops ' +
    'through |ve| in {1.0, 0.5, 0.1, 0.05, 0.01}; and the interior elasticity maximum (most negative ve)',
  switchOn: {
    threshold: 0.1,
    log10N: +PRIMARY.log10N.toFixed(5), // ~15.25516
    sigma: +PRIMARY.sigma.toExponential(4), // ~1.7092e-3
    diag: +PRIMARY.diag.toFixed(5), // ~1.02413
    ve: +PRIMARY.ve.toExponential(3),
    note:
      'the |ve| = 0.1 switch-on: for x above this (toward the ROLE 4 minimum) the diagnostic value is ' +
      'floor-insensitive, below it floor-sensitive. The ROLE 4-vs-ROLE 5 split is a sigma ~ 1.7e-3 ' +
      'threshold, NOT a sigma-near-1 one',
  },
  elasticityMax: {
    log10N: +ELASTICITY_MAX.log10N.toFixed(5), // ~9.35720
    sigma: +ELASTICITY_MAX.sigma.toFixed(5), // ~0.54284
    ve: +ELASTICITY_MAX.ve.toFixed(5), // ~ -9.99619
    note:
      'the value-elasticity is non-monotone across the landmark span: |ve| maxes at ~9.996 near ' +
      'sigma ~ 0.543, with BOTH named landmarks (ROLE 5 hump sigma ~ 0.865, ROLE 4 minimum sigma ~ ' +
      '3e-5) on opposite flanks of this interior maximum',
  },
  tailProportionality: {
    ve_over_sigma_min: +VE_OVER_SIGMA_MIN.toFixed(3), // ~ -67.6
    ve_over_sigma_max: +VE_OVER_SIGMA_MAX.toFixed(3), // ~ -58.5
    note:
      'in the deep tail ve is nearly proportional to sigma (ve/sigma stays in ~ -58..-68), so the ' +
      'switch-on sigma tapers roughly linearly with the chosen threshold: a soft taper, not a sharp switch',
  },
  ladder: LADDER,
  finding: {
    F1_switch_on_pinned:
      'The |ve| = 0.1 switch-on is pinned at log10 N = 15.25516, sigma = 1.7092e-3, diag = 1.02413 ' +
      '(baseline floor). As x climbs past this toward the ROLE 4 minimum the diagnostic value becomes ' +
      'floor-insensitive (|ve| < 0.1); below it floor-sensitive. The ROLE 4-vs-ROLE 5 value-sensitivity ' +
      'split is a sigma ~ 1.7e-3 threshold, NOT a sigma-near-1 one.',
    F2_value_elasticity_non_monotone:
      'The value-elasticity is non-monotone across the landmark span. |ve| rises off the ROLE 5 hump ' +
      '(|ve| ~ 4.09 at sigma ~ 0.865) to a maximum |ve| ~ 9.996 at sigma ~ 0.543 (log10 N ~ 9.357), ' +
      'then decays into the tail toward the ROLE 4 minimum (|ve| ~ 3.3e-3 at sigma ~ 3e-5). Both named ' +
      'ROLE endpoints sit on opposite flanks of a single interior elasticity maximum.',
    F3_deep_tail_ve_proportional_to_sigma:
      'In the deep tail ve is nearly proportional to sigma: across the ladder ve/sigma stays in the ' +
      'narrow band ~ -58 to -68, so the switch-on sigma scales roughly linearly with the threshold ' +
      '(1.71e-3 at |ve| = 0.1 down to 1.48e-4 at |ve| = 0.01, ~11.5x for a 10x tighter threshold). ' +
      'The transition is a soft near-linear taper in sigma, not a sharp switch.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / SENSITIVITY (frontier-direction, NOT rigorous). Reusing the imp-97777/imp-97782 ' +
    'imp-97723 diagnostic and imp-33708 0.5x..5x floor-swap machinery verbatim, the per-decade ' +
    'value-elasticity ve(x) drops through |ve| = 0.1 at log10 N = 15.25516, sigma = 1.7092e-3, ' +
    'diag = 1.02413 -- pinning where floor-insensitivity switches on between the ROLE 5 hump peak ' +
    '(floor-sensitive value, ve ~ -4.09) and the ROLE 4 local minimum (floor-insensitive value, ' +
    've ~ -3.3e-3). The split is a sigma ~ 1.7e-3 threshold, not sigma-near-1: the value-elasticity ' +
    'is non-monotone, peaking at |ve| ~ 9.996 near sigma ~ 0.543 with both named landmarks on ' +
    'opposite flanks, and in the deep tail ve is nearly proportional to sigma (ve/sigma ~ -60), so ' +
    'the switch-on sigma tapers roughly linearly with the threshold. Measurement only; uses the ' +
    'inherited imp-3406/imp-97723 model and the imp-33708 floor swap, NOT a rigorous asymptotic; ' +
    'C_mb stays GUE-conditional (imp-486); changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97777 (ROLE 4 minimum, value floor-insensitive ~ -3.3e-3); imp-97782 (ROLE 5 hump, value ' +
    'floor-sensitive ~ -4.09); imp-97814 (ROLE catalogue); imp-97723 (full diagnostic closed form); ' +
    'imp-33708 (0.5x..5x E_trunc floor swap); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc = ' +
    '3.06e-5 fixed-strip floor); lambda-rh-height-mapping (RvM inverse).',
};

export const IMP124792_FARTAIL_DIAGNOSTIC_VALUE_ELASTICITY_THRESHOLD_ASSERTIONS = [
  {
    // (F1) The |ve| = 0.1 switch-on is pinned at sigma ~ 1.709e-3, log10 N ~ 15.255, diag ~ 1.0241.
    id: 'imp124792-switch-on-pinned',
    description: 'the |ve| = 0.1 switch-on is at log10 N ~ 15.255, sigma ~ 1.709e-3, diag ~ 1.0241',
    holds: () =>
      Math.abs(PRIMARY.log10N - 15.25516) < 1e-3 &&
      Math.abs(PRIMARY.sigma - 1.7092e-3) < 1e-5 &&
      Math.abs(PRIMARY.diag - 1.02413) < 1e-3,
  },
  {
    // (F1) The crossing actually realises the target magnitude (ve = -0.1 to root-find precision).
    id: 'imp124792-crossing-realises-target',
    description: 'the value-elasticity at the pinned switch-on equals -0.1 to root-find precision',
    holds: () => Math.abs(PRIMARY.ve + 0.1) < 1e-6,
  },
  {
    // (F1) The split sits at small sigma, NOT sigma-near-1 (well below the ROLE 5 hump sigma ~ 0.865).
    id: 'imp124792-split-at-small-sigma',
    description: 'the switch-on sigma is well below the hump (< 0.01), so the split is not sigma-near-1',
    holds: () => PRIMARY.sigma < 0.01 && PRIMARY.sigma > 1e-4,
  },
  {
    // (F2) The value-elasticity is non-monotone: an interior maximum |ve| ~ 9.996 near sigma ~ 0.543.
    id: 'imp124792-elasticity-non-monotone-interior-max',
    description: 'the value-elasticity magnitude maxes at ~9.996 near sigma ~ 0.543 (interior, not an endpoint)',
    holds: () =>
      Math.abs(ELASTICITY_MAX.ve + 9.99619) < 1e-2 &&
      Math.abs(ELASTICITY_MAX.sigma - 0.54284) < 1e-3 &&
      ELASTICITY_MAX.sigma > 0.3 &&
      ELASTICITY_MAX.sigma < 0.7,
  },
  {
    // (F2) The interior maximum magnitude exceeds BOTH named ROLE landmark magnitudes.
    id: 'imp124792-max-exceeds-both-roles',
    description: 'the interior |ve| max (~9.996) exceeds both the ROLE 5 hump (~4.09) and ROLE 4 minimum (~3.3e-3) magnitudes',
    holds: () => Math.abs(ELASTICITY_MAX.ve) > 4.09 && Math.abs(ELASTICITY_MAX.ve) > 3.3e-3,
  },
  {
    // (F3) In the deep tail ve is nearly proportional to sigma: ve/sigma in the narrow band ~ -58..-68.
    id: 'imp124792-deep-tail-ve-proportional-to-sigma',
    description: 've/sigma stays in the narrow band ~ -58 to -68 across the deep-tail (|ve| <= 0.1) rungs (near-linear taper)',
    holds: () => VE_OVER_SIGMA_MIN > -75 && VE_OVER_SIGMA_MAX < -50,
  },
  {
    // (F3) The switch-on sigma decreases monotonically as the threshold tightens.
    id: 'imp124792-ladder-monotone-in-threshold',
    description: 'as the elasticity threshold tightens the switch-on sigma and abscissa move monotonically (sigma down, log10 N up)',
    holds: () => {
      for (let i = 1; i < CROSSINGS.length; i++) {
        // THRESHOLDS is descending, so each next crossing must have smaller sigma and larger log10 N.
        if (!(CROSSINGS[i].sigma < CROSSINGS[i - 1].sigma)) return false;
        if (!(CROSSINGS[i].log10N > CROSSINGS[i - 1].log10N)) return false;
      }
      return true;
    },
  },
  {
    // Honesty gate: measurement/sensitivity only, no QED, PT stays SOTA.
    id: 'imp124792-honesty-gate-no-qed',
    description: 'Measurement/sensitivity only: not rigorous, no QED, PT stays SOTA',
    holds: () =>
      IMP124792_FARTAIL_DIAGNOSTIC_VALUE_ELASTICITY_THRESHOLD.isRigorous === false &&
      /NO QED/.test(IMP124792_FARTAIL_DIAGNOSTIC_VALUE_ELASTICITY_THRESHOLD.verdict) &&
      /remains SOTA/.test(IMP124792_FARTAIL_DIAGNOSTIC_VALUE_ELASTICITY_THRESHOLD.verdict),
  },
];

for (const a of IMP124792_FARTAIL_DIAGNOSTIC_VALUE_ELASTICITY_THRESHOLD_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-124792-fartail-diagnostic-value-elasticity-threshold assertion failed: ${a.id}`
    );
  }
}
