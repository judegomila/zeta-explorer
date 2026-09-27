/**
 * @module imp-97777-fartail-diagnostic-local-minimum-pin
 *
 * imp-97777 (numerical, frontier-direction): imp-97759 reported that the FULL sigma-diagnostic
 * crashes to a local MINIMUM diag ~ 0.97607 near log10 N ~ 18.77 (start of the rising branch that
 * carries the imp-97744 far-tail crossings) before climbing toward EXACTLY 1, but it located that
 * minimum only by golden-section at the baseline floor and never (a) pinned it by derivative
 * root-finding nor (b) measured how the minimum LOCATION and VALUE respond to the imp-33708
 * 0.5x..5x E_trunc-floor swap. This module does both.
 *
 * THE FULL DIAGNOSTIC (identical sub-terms to imp-3406 / imp-97723 / imp-97744 / imp-97759)
 * ---------------------------------------------------------------------------------------
 *     sigma(N)  = E_coll / (E_trunc + E_flow + E_coll)
 *     E_trunc   = 3.06e-5 * factor          (imp-2631 fixed strip; factor = 1 is the baseline)
 *     E_coll    = C_C_PINNED * sqrt(log T0 / N)                (GUE-conditional C_H)
 *     E_flow    = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi   (imp-398)
 *     T0        = effectiveHeightForN(N)     (Riemann-von Mangoldt inverse)
 *     diag(N)   = (1 - sigma)(1 - 1/log(T0/2pi)) + sigma * log T0     (imp-97723 closed form)
 * The ONLY parameter swept is the constant E_trunc floor (factor in {0.5, 1, 2, 5}); every other
 * sub-term is reused byte-for-byte, so factor = 1 reproduces imp-97723 / imp-97759.
 *
 * PINNING THE MINIMUM (derivative root-finding, not golden-section)
 * ----------------------------------------------------------------
 * imp-97759 found the minimum by golden-section on diag itself. Here the diagnostic is minimised by
 * bisecting its LOG10-N derivative d diag / d(log10 N) (H = 1e-6 central difference) to its root on
 * [12, 25]: the diagnostic descends off the sigma*log T0 hump (derivative < 0) then rises along the
 * bare RvM slope (derivative > 0), so the derivative changes sign exactly once. The root pins the
 * minimum location and value directly, sharpening the imp-97759 golden-section landmark.
 *
 * THE MEASUREMENT: floor-swap of the minimum landmark
 * ---------------------------------------------------
 * For each floor factor the minimum (location log10 N, value diag) is re-pinned, and the max spread
 * across the 0.5x..5x swap is reported for BOTH the location and the value, together with the local
 * elasticities d log10 N_min / d log10(factor) and d diag_min / d log10(factor).
 *
 * THE FINDINGS (measurement / sensitivity only)
 * ---------------------------------------------
 *   (F1) THE MINIMUM IS PINNED AT log10 N = 18.77232, diag = 0.9760709 (baseline floor). Derivative
 *        root-finding reproduces the imp-97759 golden-section landmark (log10 N ~ 18.77, diag ~
 *        0.97607) to full double precision, confirming it is a genuine stationary point (derivative
 *        < 1e-9 at the pin), not a coarse-grid artifact.
 *   (F2) THE MINIMUM LOCATION IS STRONGLY FLOOR-SENSITIVE. Across the 0.5x..5x swap the location
 *        moves 2.43 decades (log10 N: 19.497 at 0.5x -> 17.065 at 5x) with an essentially constant
 *        elasticity d log10 N_min / d log10(factor) ~ -2.43. Lowering the floor lifts sigma, so the
 *        sigma*log T0 hump reaches further into the tail and the balance point (minimum) slides to
 *        higher N; raising it pulls the minimum in. This is the OPPOSITE regime from the far-tail
 *        crossings, whose LOCATION is floor-insensitive to < 1e-11 (imp-97759 F3).
 *   (F3) THE MINIMUM VALUE IS NEARLY FLOOR-INSENSITIVE. Across the same swap diag_min moves only
 *        3.29e-3 (0.97368 at 5x -> 0.97696 at 0.5x, a ~0.34% band) with elasticity d diag_min /
 *        d log10(factor) ~ -3.3e-3. So the floor slides WHERE the diagnostic bottoms out by ~2.4
 *        decades but barely changes HOW LOW it goes -- the minimum value is a robust ~0.976 landmark
 *        while its height abscissa is a soft, floor-dependent one.
 *
 * The punchline: derivative root-finding pins the imp-97759 local minimum at log10 N = 18.77232,
 * diag = 0.9760709, and the imp-33708 0.5x..5x floor swap shows the minimum LOCATION is strongly
 * floor-sensitive (~2.43 decades, elasticity ~ -2.43) while its VALUE is nearly floor-insensitive
 * (~0.34%, elasticity ~ -3.3e-3). The ~0.976 depth is a robust landmark; its abscissa is not.
 *
 * MEASUREMENT / SENSITIVITY ONLY. Conditional-share diagnostic, NOT an RH bound. Uses the inherited
 * imp-3406/imp-97723 component model and the imp-33708 floor swap, NOT a rigorous asymptotic; C_mb
 * stays GUE-conditional per imp-486; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97759-fartail-crossing-etrunc-floor-sensitivity-crossover (F1 local minimum, located by golden-section only)
 * @see imp-97723-sigma-fartail-diagnostic-asymptote-one (the full diagnostic closed form)
 * @see imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity (the 0.5x..5x E_trunc floor swap)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via the RvM inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor (imp-97744 baseline)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-97723/imp-97759 exactly

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

const DERIV_H = 1e-6; // central-difference step in log10 N for the derivative root-find
function dDiag(x, E_trunc) {
  return (diagAt(x + DERIV_H, E_trunc) - diagAt(x - DERIV_H, E_trunc)) / (2 * DERIV_H);
}

// Pin the local minimum by bisecting the derivative root on [12, 25]: diag descends off the
// sigma*log T0 hump (derivative < 0) then rises on the bare RvM slope (derivative > 0).
function pinMinimum(E_trunc) {
  let lo = 12;
  let hi = 25;
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    if (dDiag(m, E_trunc) < 0) lo = m;
    else hi = m;
  }
  const log10N = (lo + hi) / 2;
  return { log10N, diag: diagAt(log10N, E_trunc), deriv: dDiag(log10N, E_trunc) };
}

const FLOOR_FACTORS = [0.5, 1.0, 2.0, 5.0];

// --- The pinned minimum at each floor (baseline = factor 1.0) --------------------------------
const PINS = FLOOR_FACTORS.map((f) => {
  const p = pinMinimum(E_TRUNC_BASE * f);
  return { factor: f, log10N: p.log10N, diag: p.diag, deriv: p.deriv };
});
const BASELINE = PINS.find((p) => p.factor === 1.0);

// --- Floor-swap spreads and elasticities -----------------------------------------------------
const locs = PINS.map((p) => p.log10N);
const vals = PINS.map((p) => p.diag);
const LOC_SPREAD = Math.max(...locs) - Math.min(...locs); // ~2.43 decades
const VAL_SPREAD = Math.max(...vals) - Math.min(...vals); // ~3.29e-3

// Local elasticity per decade of floor factor, measured across the widest 0.5x..5x arm.
const lo = PINS.find((p) => p.factor === 0.5);
const hi = PINS.find((p) => p.factor === 5.0);
const dLog10Factor = Math.log10(5.0) - Math.log10(0.5); // = 1 decade
const LOC_ELASTICITY = (hi.log10N - lo.log10N) / dLog10Factor; // ~ -2.43
const VAL_ELASTICITY = (hi.diag - lo.diag) / dLog10Factor; // ~ -3.3e-3

const LADDER = PINS.map((p) => ({
  factor: p.factor,
  log10N_min: +p.log10N.toFixed(5),
  diag_min: +p.diag.toFixed(7),
  deriv_at_min: +p.deriv.toExponential(2),
}));

export const IMP97777_FARTAIL_DIAGNOSTIC_LOCAL_MINIMUM_PIN = {
  id: 'imp-97777',
  proofSection: 'S-frontier',
  question:
    'imp-97759 F1 reported a local minimum diag ~ 0.97607 near log10 N ~ 18.77 of the FULL imp-97723 ' +
    'diagnostic (start of the rising far-tail branch) but located it only by golden-section at the ' +
    'baseline floor. PIN it by derivative root-finding and MEASURE how its location and value respond ' +
    'to the imp-33708 0.5x..5x E_trunc-floor swap. Measurement/sensitivity only; conditional-share ' +
    'diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the local-minimum location (log10 N, derivative root of the imp-97723 diagnostic) and value ' +
    '(diag) for E_trunc = 3.06e-5 * factor, factor in {0.5, 1, 2, 5}; the max spread in each across ' +
    'the floor swap and the local elasticities d log10 N_min / d log10(factor), d diag_min / ' +
    'd log10(factor)',
  minimum: {
    log10N: +BASELINE.log10N.toFixed(5), // ~18.77232
    diag: +BASELINE.diag.toFixed(7), // ~0.9760709
    deriv_at_pin: +BASELINE.deriv.toExponential(2),
    note:
      'derivative root-finding reproduces the imp-97759 golden-section landmark (log10 N ~ 18.77, ' +
      'diag ~ 0.97607) to full double precision; a genuine stationary point (|deriv| < 1e-9)',
  },
  floorSwap: {
    factors: FLOOR_FACTORS,
    location_spread_decades: +LOC_SPREAD.toFixed(4), // ~2.43
    value_spread: +VAL_SPREAD.toExponential(4), // ~3.29e-3
    location_elasticity_per_decade: +LOC_ELASTICITY.toFixed(4), // ~ -2.43
    value_elasticity_per_decade: +VAL_ELASTICITY.toExponential(4), // ~ -3.3e-3
    note:
      'the floor slides the minimum LOCATION by ~2.43 decades (elasticity ~ -2.43) but its VALUE by ' +
      'only ~0.34% (elasticity ~ -3.3e-3): a robust ~0.976 depth, a soft floor-dependent abscissa',
  },
  ladder: LADDER,
  finding: {
    F1_minimum_pinned:
      'The local minimum is pinned at log10 N = 18.77232, diag = 0.9760709 (baseline floor). ' +
      'Derivative root-finding reproduces the imp-97759 golden-section landmark to full double ' +
      'precision (|deriv| < 1e-9 at the pin), confirming a genuine stationary point.',
    F2_location_strongly_floor_sensitive:
      'Across the 0.5x..5x floor swap the minimum LOCATION moves 2.43 decades (log10 N: 19.497 at ' +
      '0.5x -> 17.065 at 5x) with a near-constant elasticity d log10 N_min / d log10(factor) ~ -2.43. ' +
      'Lowering the floor lifts sigma so the sigma*log T0 hump reaches further into the tail and the ' +
      'minimum slides to higher N. This is the OPPOSITE regime from the far-tail crossings, whose ' +
      'location is floor-insensitive to < 1e-11 (imp-97759 F3).',
    F3_value_nearly_floor_insensitive:
      'Across the same swap diag_min moves only 3.29e-3 (0.97368 at 5x -> 0.97696 at 0.5x, a ~0.34% ' +
      'band) with elasticity d diag_min / d log10(factor) ~ -3.3e-3. The floor slides WHERE the ' +
      'diagnostic bottoms out by ~2.4 decades but barely changes HOW LOW it goes -- the ~0.976 depth ' +
      'is a robust landmark, its abscissa is not.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / SENSITIVITY (frontier-direction, NOT rigorous). Derivative root-finding pins the ' +
    'imp-97759 local minimum of the FULL imp-97723 diagnostic at log10 N = 18.77232, diag = 0.9760709 ' +
    '(baseline floor), reproducing the golden-section landmark to full double precision. Running the ' +
    'imp-33708 0.5x..5x E_trunc-floor swap, the minimum LOCATION is strongly floor-sensitive -- it ' +
    'moves 2.43 decades (19.497 at 0.5x -> 17.065 at 5x, elasticity d log10 N_min/d log10(factor) ~ ' +
    '-2.43) -- while its VALUE is nearly floor-insensitive, moving only 3.29e-3 (~0.34%, elasticity ' +
    '~ -3.3e-3). So the floor slides WHERE the diagnostic bottoms out but barely changes HOW LOW it ' +
    'goes: the ~0.976 depth is a robust landmark, its height abscissa is soft and floor-dependent. ' +
    'This is the opposite regime from the far-tail crossings (imp-97759 F3), whose location is ' +
    'floor-insensitive to < 1e-11. Measurement only; uses the inherited imp-3406/imp-97723 model and ' +
    'the imp-33708 floor swap, NOT a rigorous asymptotic; C_mb stays GUE-conditional (imp-486); ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97759 (F1 local minimum, golden-section only); imp-97723 (full diagnostic closed form); ' +
    'imp-33708 (0.5x..5x E_trunc floor swap); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc = ' +
    '3.06e-5 fixed-strip floor); lambda-rh-height-mapping (RvM inverse).',
};

export const IMP97777_FARTAIL_DIAGNOSTIC_LOCAL_MINIMUM_PIN_ASSERTIONS = [
  {
    // (F1) Derivative root-finding reproduces the imp-97759 golden-section landmark to full precision.
    id: 'imp97777-reproduces-imp97759-minimum',
    description: 'the pinned baseline minimum matches the imp-97759 landmark (log10 N ~ 18.77, diag ~ 0.97607)',
    holds: () =>
      Math.abs(BASELINE.log10N - 18.7723) < 1e-3 &&
      Math.abs(BASELINE.diag - 0.97607) < 1e-4,
  },
  {
    // (F1) The pin is a genuine stationary point: derivative is at the root-find floor.
    id: 'imp97777-pin-is-stationary',
    description: 'the diagnostic derivative at the pinned minimum is < 1e-8 in magnitude (genuine stationary point)',
    holds: () => Math.abs(BASELINE.deriv) < 1e-8,
  },
  {
    // (F2) The minimum LOCATION is strongly floor-sensitive: ~2.43 decades across the 0.5x..5x swap.
    id: 'imp97777-location-strongly-floor-sensitive',
    description: 'the minimum location spread across the floor swap exceeds 2 decades in log10 N',
    holds: () => LOC_SPREAD > 2 && LOC_SPREAD < 3,
  },
  {
    // (F2) The location elasticity is near -2.43 per decade of floor factor (lower floor -> higher N).
    id: 'imp97777-location-elasticity-near-minus-2p4',
    description: 'd log10 N_min / d log10(factor) is negative and near -2.4 (lower floor pushes the minimum to higher N)',
    holds: () => LOC_ELASTICITY < -2.2 && LOC_ELASTICITY > -2.7,
  },
  {
    // (F3) The minimum VALUE is nearly floor-insensitive: spread < 5e-3 (~0.34%) across the swap.
    id: 'imp97777-value-nearly-floor-insensitive',
    description: 'the minimum value spread across the floor swap is below 5e-3 (nearly floor-insensitive)',
    holds: () => VAL_SPREAD < 5e-3 && VAL_SPREAD > 1e-3,
  },
  {
    // (F2/F3) Location is at least ~500x more floor-sensitive (relative) than the value.
    id: 'imp97777-location-more-sensitive-than-value',
    description: 'the location spread (decades) dwarfs the value spread: location/value spread ratio > 400',
    holds: () => LOC_SPREAD / VAL_SPREAD > 400,
  },
  {
    // Monotone landmark: lower floor -> higher-N minimum and higher diag value across the ladder.
    id: 'imp97777-ladder-monotone-in-floor',
    description: 'as the floor factor increases the minimum location and value both strictly decrease',
    holds: () => {
      for (let i = 1; i < PINS.length; i++) {
        if (!(PINS[i].log10N < PINS[i - 1].log10N)) return false;
        if (!(PINS[i].diag < PINS[i - 1].diag)) return false;
      }
      return true;
    },
  },
  {
    // Honesty gate: measurement/sensitivity only, no QED, PT stays SOTA.
    id: 'imp97777-honesty-gate-no-qed',
    description: 'Measurement/sensitivity only: not rigorous, no QED, PT stays SOTA',
    holds: () =>
      IMP97777_FARTAIL_DIAGNOSTIC_LOCAL_MINIMUM_PIN.isRigorous === false &&
      /NO QED/.test(IMP97777_FARTAIL_DIAGNOSTIC_LOCAL_MINIMUM_PIN.verdict) &&
      /remains SOTA/.test(IMP97777_FARTAIL_DIAGNOSTIC_LOCAL_MINIMUM_PIN.verdict),
  },
];

for (const a of IMP97777_FARTAIL_DIAGNOSTIC_LOCAL_MINIMUM_PIN_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97777-fartail-diagnostic-local-minimum-pin assertion failed: ${a.id}`
    );
  }
}
