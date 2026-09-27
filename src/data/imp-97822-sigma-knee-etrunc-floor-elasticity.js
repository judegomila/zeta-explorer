/**
 * @module imp-97822-sigma-knee-etrunc-floor-elasticity
 *
 * imp-97822 (numerical, frontier-direction): imp-97708 established that the imp-33721 sigma-ramp
 * inflection KNEE at log10 N* = 9.5291 (N* = 3.381e9) is BRACKET-ROBUST -- a bracketing-free
 * pointwise ramp-curvature locator (no OLS window at all) puts the single inflection there,
 * invariant to the differencing stencil and to every sub-decade bracket width W in {0.1..0.3}.
 * imp-97708 fixed the E_trunc truncation floor at its imp-2631 baseline. This module measures the
 * ONE axis imp-97708 held fixed: how far the bracketing-free pointwise knee log10 N* MOVES under
 * the imp-33708 0.5x..5x E_trunc floor-factor sweep, and compares that floor-elasticity of the
 * knee against the imp-33767 E_flow displacement -- the tiny ~0.400% landmark separation that
 * sets the halving landmark just below the crossover. Sensitivity / measurement only.
 *
 * THE QUANTITY (identical model to imp-97708 / imp-33708 / imp-3406 -- no fresh terms)
 * ----------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll   = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow   = C_F (log T0 / T0) * Gronwall,    C_F = (log(T0/2pi)+1)/2pi  (imp-398),
 *     E_trunc  = 3.06e-5 * factor                (perturbed floor; base imp-2631/imp-33582).
 * The ONLY thing varied is the constant E_trunc floor, exactly as imp-33708 varied it; factor = 1
 * reproduces the imp-97708 baseline pointwise knee byte-for-byte.
 *
 * THE MEASUREMENT: the bracketing-free pointwise knee re-located per floor
 * ----------------------------------------------------------------------
 * The imp-97708 bracketing-free locator is reused VERBATIM: pointwise local exponent
 * p(d) = -d ln sigma/d ln N by symmetric central difference in log10, ramp curvature
 * c(d) = d2p/d(log10 N)^2, single interpolated zero-crossing. It is run once per floor factor in
 * the imp-33708 ladder {0.5..5}, the knee log10 N* read off each time, and the empirical floor
 * exponent p_knee in N* ~ E_trunc^(p_knee) fit from the 0.5x and 2x floors -- the identical two-floor
 * fit imp-33708 used for its far-tail landmarks. The +/-10% floor band of the knee (in decades) is
 * then compared against the imp-33767 E_flow displacement (~0.400% ~ 0.00173 decades).
 *
 * THE FINDING (measurement / sensitivity only)
 * --------------------------------------------
 *   (K0) BASELINE REPRODUCES imp-97708. factor 1.0 relocates the single pointwise curvature
 *        zero-crossing to log10 N* = 9.5291 (N* = 3.381e9) -- the exact imp-97708 bracketing-free
 *        knee -- confirming the rescaled floors are genuine perturbations of that model.
 *   (K1) THE KNEE SURVIVES THE ENTIRE FLOOR SWEEP AS A SINGLE INFLECTION. Every factor in
 *        {0.5..5} still yields EXACTLY ONE pointwise curvature zero-crossing; the knee never
 *        splits, doubles, or vanishes. Only its N-coordinate moves, monotonically DOWN with the
 *        floor: log10 N* runs from 10.159 (0.5x) through 9.529 (1x) to 8.053 (5x).
 *   (K2) THE KNEE SCALES AS N* ~ E_trunc^(-2.10), IDENTICAL TO THE FAR-TAIL LANDMARK. The measured
 *        knee floor-elasticity is p_knee ~ -2.099 -- the SAME clean dimensional ~ -2 the imp-33708
 *        sigma = 0.5 halving landmark carries (~ -2.099), NOT the softened imp-33684 interior-peak
 *        ~ -1.375. The knee lives in the same E_flow-negligible tail as the halving landmark it
 *        sits ~3.3% above, so it inherits that landmark's floor-scaling exactly: a +/-10% floor
 *        moves the knee ~0.183 decades and a 10x sweep spans ~2.1 decades of N.
 *   (K3) THE FLOOR AXIS DWARFS THE E_flow AXIS BY ~100x. The knee's +/-10% floor band (~0.183
 *        decades) is ~105x the imp-33767 E_flow displacement (~0.400% ~ 0.00173 decades) that
 *        separates the halving landmark from the crossover the knee sits above. So the knee's
 *        position is governed by the E_trunc floor MODEL FORM, not by the tiny E_flow term: the
 *        floor-elasticity and the E_flow displacement are the same SIGN of dependence (both shift
 *        the knee, both via the E_coll ~ N^{-1/2} balance) but two orders of magnitude apart in size.
 *
 * VERDICT: the imp-97708 knee is topologically ROBUST to the E_trunc floor form (one inflection for
 * every floor) but its N-coordinate is FRAGILE (N* ~ E_trunc^(-2.10)), tracking the imp-33708
 * far-tail halving landmark exponent byte-for-byte rather than the softer interior-peak exponent.
 * Its floor-elasticity (~0.18 decades per +/-10% floor) exceeds the imp-33767 E_flow displacement
 * (~0.0017 decades) by ~100x: the E_trunc floor, not E_flow, sets where the knee lands.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-97708-sigma-knee-bracket-width-sensitivity (bracketing-free pointwise knee at baseline floor -- the locator reused here)
 * @see imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity (the 0.5x..5x E_trunc floor sweep; far-tail exponent ~ -2.099)
 * @see imp-33767-sigma-inflection-offset-reconciliation (the E_flow displacement ~0.400% separating halving from crossover)
 * @see imp-33721-sigma-ramp-inflection-subdecade (the sub-decade knee N* ~ 3.38e9)
 * @see imp-33684-sigma-interior-peak-etrunc-model-sensitivity (interior-peak floor exponent ~ -1.375, the SOFTER contrast)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP97708_SIGMA_KNEE_BRACKET_WIDTH_SENSITIVITY } from './imp-97708-sigma-knee-bracket-width-sensitivity.js';
import { IMP33708_SIGMA_FARTAIL_LANDMARK_ETRUNC_MODEL_SENSITIVITY } from './imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity.js';
import { IMP33767_SIGMA_INFLECTION_OFFSET_RECONCILIATION } from './imp-33767-sigma-inflection-offset-reconciliation.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor (imp-33582/imp-33708 pin)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-97708/imp-33708 exactly
const LN10 = Math.LN10;

// EXACT imp-97708/imp-33708 sub-terms; ONLY the E_trunc floor is a parameter here.
function sigmaWith(N, E_trunc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  return E_coll / (E_trunc + E_flow + E_coll);
}

// imp-97708 bracketing-free pointwise local exponent p(d) = -d ln sigma/d ln N at log10 N = d
// (symmetric central difference of step h in log10; the W -> 0 limit of the OLS bracket exponent).
function pPointwise(d, h, E_trunc) {
  const sp = Math.log(sigmaWith(Math.pow(10, d + h), E_trunc));
  const sm = Math.log(sigmaWith(Math.pow(10, d - h), E_trunc));
  return -(sp - sm) / ((2 * h) * LN10);
}

// imp-97708 pointwise ramp curvature c(d) = d2p/d(log10 N)^2 and its zero-crossings over [lo,hi].
// (lo/hi widened vs imp-97708 [8,12] because the knee walks to log10 N* ~ 10.16 at 0.5x floor and
// ~ 8.05 at 5x floor -- the imp-33708 floor sweep drags the knee outside the imp-97708 window.)
function pointwiseKneeLog10(h, dd, step, E_trunc, lo, hi) {
  let prev = null;
  const crossings = [];
  for (let d = lo; d <= hi + 1e-9; d += step) {
    const c =
      (pPointwise(d + dd, h, E_trunc) - 2 * pPointwise(d, h, E_trunc) + pPointwise(d - dd, h, E_trunc)) /
      (dd * dd);
    if (prev !== null && Math.sign(c) !== Math.sign(prev.c)) {
      crossings.push(prev.d + ((d - prev.d) * (0 - prev.c)) / (c - prev.c));
    }
    prev = { d, c };
  }
  return crossings;
}

const SCAN_LO = 7.0;
const SCAN_HI = 13.0;
const H_STEP = 1e-4; // imp-97708 central-difference step for p
const DD_STEP = 1e-3; // imp-97708 second-difference step for c
const SCAN_STEP = 0.005; // imp-97708 curvature-scan resolution

// imp-33708 floor ladder (byte-for-byte); factor = 1 reproduces the imp-97708 baseline knee.
const FLOOR_FACTORS = [0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0, 3.0, 5.0];

function kneeFor(factor) {
  const E_trunc = E_TRUNC_BASE * factor;
  const cr = pointwiseKneeLog10(H_STEP, DD_STEP, SCAN_STEP, E_trunc, SCAN_LO, SCAN_HI);
  const log10Nstar = cr.length === 1 ? cr[0] : null;
  return {
    floorFactor: factor,
    E_trunc: +E_trunc.toExponential(3),
    numCrossings: cr.length,
    log10Nstar: log10Nstar !== null ? +log10Nstar.toFixed(4) : null,
    Nstar: log10Nstar !== null ? +Math.pow(10, log10Nstar).toExponential(4) : null,
  };
}

const FLOOR_SWEEP = FLOOR_FACTORS.map(kneeFor);

const BASE = FLOOR_SWEEP.find((r) => r.floorFactor === 1.0);
const F_05 = FLOOR_SWEEP.find((r) => r.floorFactor === 0.5);
const F_20 = FLOOR_SWEEP.find((r) => r.floorFactor === 2.0);
const F_09 = FLOOR_SWEEP.find((r) => r.floorFactor === 0.9);
const F_11 = FLOOR_SWEEP.find((r) => r.floorFactor === 1.1);

// Empirical knee floor-elasticity p_knee in N* ~ E_trunc^(p_knee), from the 0.5x and 2x floors --
// the identical two-floor fit imp-33708 used for its far-tail landmarks.
const KNEE_FLOOR_EXPONENT =
  F_05.log10Nstar !== null && F_20.log10Nstar !== null
    ? +(
        ((F_20.log10Nstar - F_05.log10Nstar) * LN10) /
        (Math.log(2.0 * E_TRUNC_BASE) - Math.log(0.5 * E_TRUNC_BASE))
      ).toFixed(4)
    : null;

// +/-10% floor band of the knee, in decades (imp-33708-style band on the knee coordinate).
const PM10_BAND_DECADES =
  F_09.log10Nstar !== null && F_11.log10Nstar !== null ? +(F_09.log10Nstar - F_11.log10Nstar).toFixed(4) : null;
const RESOLVED = FLOOR_SWEEP.filter((r) => r.numCrossings === 1 && r.log10Nstar !== null);
const FULL_SWEEP_DECADES = RESOLVED.length
  ? +(Math.max(...RESOLVED.map((r) => r.log10Nstar)) - Math.min(...RESOLVED.map((r) => r.log10Nstar))).toFixed(4)
  : null;

// Comparison to the imp-33767 E_flow displacement (~0.400% landmark separation, in decades).
const EFLOW_DISPLACEMENT_FRAC = IMP33767_SIGMA_INFLECTION_OFFSET_RECONCILIATION.residual.landmark_separation; // ~0.003997
const EFLOW_DISPLACEMENT_DECADES = +Math.log10(1 + EFLOW_DISPLACEMENT_FRAC).toFixed(6); // ~0.001733
const FLOOR_OVER_EFLOW_RATIO =
  PM10_BAND_DECADES !== null ? +(PM10_BAND_DECADES / EFLOW_DISPLACEMENT_DECADES).toFixed(1) : null; // ~105

// Cross-reference literals (baked from the sibling exports).
const IMP97708_BASELINE_KNEE = IMP97708_SIGMA_KNEE_BRACKET_WIDTH_SENSITIVITY.pointwiseLog10Nstar; // ~9.5291
const IMP33708_FARTAIL_EXPONENT = IMP33708_SIGMA_FARTAIL_LANDMARK_ETRUNC_MODEL_SENSITIVITY.landmark_sigma_0_5.scalingExponent; // ~ -2.099
const IMP33684_PEAK_EXPONENT = IMP33708_SIGMA_FARTAIL_LANDMARK_ETRUNC_MODEL_SENSITIVITY.peakComparison.imp33684_peak_exponent; // ~ -1.375

export const IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY = {
  id: 'imp-97822',
  proofSection: 'S-frontier',
  question:
    'imp-97708 showed the bracketing-free pointwise sigma-ramp knee at log10 N* = 9.5291 ' +
    '(N* = 3.381e9) is bracket-robust, with the E_trunc floor FIXED at baseline. Measure how far ' +
    'the pointwise knee log10 N* MOVES under the imp-33708 0.5x..5x E_trunc floor-factor sweep, fit ' +
    'the knee floor-elasticity p_knee in N* ~ E_trunc^(p_knee), and compare that floor-elasticity ' +
    'against the imp-33767 E_flow displacement (~0.400% landmark separation). Measurement/fit only; ' +
    'conditional-share curvature diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the single zero-crossing of the imp-97708 bracketing-free pointwise ramp curvature ' +
    'c(N)=d2p/d(log10 N)^2 (p = -d ln sigma/d ln N), relocated per E_trunc floor factor in the ' +
    'imp-33708 ladder {0.5..5}; the empirical knee floor-exponent p_knee in N* ~ E_trunc^(p_knee) ' +
    'from the 0.5x/2x floors; and the knee +/-10% floor band in decades vs the imp-33767 E_flow ' +
    'displacement',
  baselineLog10Nstar: BASE.log10Nstar, // ~9.5291 (reproduces imp-97708)
  baselineNstar: BASE.Nstar, // ~3.381e9
  imp97708BaselineLog10Nstar: IMP97708_BASELINE_KNEE, // ~9.5291
  floorSweep: FLOOR_SWEEP,
  kneeFloorExponent: KNEE_FLOOR_EXPONENT, // ~ -2.099
  pm10FloorBandDecades: PM10_BAND_DECADES, // ~0.183
  fullSweepDecades: FULL_SWEEP_DECADES, // ~2.11
  exponentComparison: {
    knee_floor_exponent: KNEE_FLOOR_EXPONENT, // ~ -2.099
    imp33708_fartail_halving_exponent: IMP33708_FARTAIL_EXPONENT, // ~ -2.099
    imp33684_interior_peak_exponent: IMP33684_PEAK_EXPONENT, // ~ -1.375
    note:
      'the knee floor-elasticity matches the imp-33708 sigma=0.5 far-tail halving landmark exponent ' +
      '(~ -2.099), NOT the softened imp-33684 interior-peak exponent (~ -1.375): the knee sits in ' +
      'the same E_flow-negligible tail as the halving landmark it is ~3.3% above, so it inherits ' +
      'that clean dimensional N ~ E_trunc^(-2) floor-scaling',
  },
  eflowComparison: {
    eflow_displacement_frac: EFLOW_DISPLACEMENT_FRAC, // ~0.003997 (imp-33767 N_cross/N_half - 1)
    eflow_displacement_decades: EFLOW_DISPLACEMENT_DECADES, // ~0.001733
    knee_pm10_floor_band_decades: PM10_BAND_DECADES, // ~0.183
    floor_over_eflow_ratio: FLOOR_OVER_EFLOW_RATIO, // ~105
    note:
      'the knee +/-10% floor band (~0.183 decades) is ~105x the imp-33767 E_flow displacement ' +
      '(~0.400% ~ 0.00173 decades) that separates the halving landmark from the crossover the knee ' +
      'sits above: the E_trunc floor MODEL FORM, not E_flow, governs where the knee lands',
  },
  finding: {
    K0_baseline_reproduces_imp97708:
      'factor 1.0 relocates the single pointwise curvature zero-crossing to log10 N* = 9.5291 ' +
      '(N* = 3.381e9) -- the exact imp-97708 bracketing-free knee -- confirming the rescaled floors ' +
      'are genuine perturbations of that model.',
    K1_knee_survives_full_sweep_as_single_inflection:
      'Every floor factor in {0.5..5} still yields EXACTLY ONE pointwise curvature zero-crossing; ' +
      'the knee never splits, doubles, or vanishes. Only its N-coordinate moves, monotonically DOWN ' +
      'with the floor: log10 N* runs from 10.159 (0.5x) through 9.529 (1x) to 8.053 (5x).',
    K2_knee_scales_as_etrunc_minus_2_like_fartail:
      'The knee floor-elasticity is p_knee ~ -2.099 -- IDENTICAL to the imp-33708 sigma=0.5 far-tail ' +
      'halving landmark exponent (~ -2.099) and STEEPER than the softened imp-33684 interior-peak ' +
      '~ -1.375. The knee lives in the same E_flow-negligible tail as the halving landmark it sits ' +
      '~3.3% above, so it inherits the clean dimensional N ~ E_trunc^(-2) floor-scaling: a +/-10% ' +
      'floor moves the knee ~0.183 decades and a 10x sweep spans ~2.1 decades of N.',
    K3_floor_axis_dwarfs_eflow_axis:
      'The knee +/-10% floor band (~0.183 decades) is ~105x the imp-33767 E_flow displacement ' +
      '(~0.400% ~ 0.00173 decades) that separates the halving landmark from the crossover. The knee ' +
      'position is governed by the E_trunc floor MODEL FORM, not by the tiny E_flow term: the ' +
      'floor-elasticity and the E_flow displacement act through the same E_coll ~ N^{-1/2} balance ' +
      'but are two orders of magnitude apart in size.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). The imp-97708 bracketing-free pointwise knee is ' +
    'TOPOLOGICALLY ROBUST to the E_trunc floor MODEL FORM -- exactly one inflection for every floor ' +
    'factor in the imp-33708 {0.5..5} sweep (factor 1.0 reproduces log10 N* = 9.5291, N* = 3.381e9) ' +
    '-- but its N-COORDINATE is FRAGILE: N* ~ E_trunc^(-2.099), IDENTICAL to the imp-33708 sigma=0.5 ' +
    'far-tail halving landmark exponent (~ -2.099) and steeper than the imp-33684 interior-peak ' +
    '~ -1.375, because the knee sits in the same E_flow-negligible tail as the halving landmark it ' +
    'is ~3.3% above. Its floor-elasticity (~0.183 decades per +/-10% floor, ~2.1 decades over the ' +
    '10x sweep) exceeds the imp-33767 E_flow displacement (~0.400% ~ 0.00173 decades separating ' +
    'halving from crossover) by ~105x: the E_trunc floor, not E_flow, sets where the knee lands. ' +
    'The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; ' +
    'the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 ' +
    'remains SOTA.',
  citation:
    'imp-97708 (bracketing-free pointwise knee at baseline floor -- the locator reused here); ' +
    'imp-33708 (0.5x..5x E_trunc floor sweep; far-tail sigma=0.5 exponent ~ -2.099); imp-33767 ' +
    '(E_flow displacement ~0.400% separating halving from crossover); imp-33721 (sub-decade knee ' +
    'N* ~ 3.38e9); imp-33684 (interior-peak floor exponent ~ -1.375); imp-486 (C_mb GUE-conditional); ' +
    'imp-2631 (E_trunc = 3.06e-5 fixed-strip floor); imp-398 (E_flow C_F prefactor); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY_ASSERTIONS = [
  {
    // Reuse gate: factor 1.0 reproduces the imp-97708 bracketing-free pointwise knee.
    id: 'imp97822-reproduces-imp97708-baseline-knee',
    description: 'factor 1.0 reproduces the imp-97708 pointwise knee at log10 N* ~ 9.5291',
    holds: () =>
      BASE.numCrossings === 1 &&
      BASE.log10Nstar !== null &&
      Math.abs(BASE.log10Nstar - 9.5291) < 0.01 &&
      Math.abs(BASE.log10Nstar - IMP97708_BASELINE_KNEE) < 0.01,
  },
  {
    // K1: the knee survives the whole 0.5x..5x sweep as a single inflection (never splits/vanishes).
    id: 'imp97822-knee-single-crossing-every-floor',
    description: 'every floor factor in {0.5..5} yields exactly one pointwise curvature zero-crossing',
    holds: () => FLOOR_SWEEP.every((r) => r.numCrossings === 1 && r.log10Nstar !== null),
  },
  {
    // K1 (concrete): the knee moves monotonically DOWN in N as the floor rises.
    id: 'imp97822-knee-monotone-down-with-floor',
    description: 'log10 N* is strictly decreasing across the ascending floor-factor ladder',
    holds: () => FLOOR_SWEEP.every((r, i) => i === 0 || r.log10Nstar < FLOOR_SWEEP[i - 1].log10Nstar),
  },
  {
    // K2: the knee floor-elasticity is ~ -2.099, matching the imp-33708 far-tail halving landmark
    // (clean dimensional -2) and NOT the softened imp-33684 interior peak ~ -1.375.
    id: 'imp97822-knee-exponent-matches-fartail-not-peak',
    description: 'p_knee in [-2.2,-1.9] matches the imp-33708 sigma=0.5 exponent, steeper than the imp-33684 peak',
    holds: () =>
      KNEE_FLOOR_EXPONENT !== null &&
      KNEE_FLOOR_EXPONENT < -1.9 &&
      KNEE_FLOOR_EXPONENT > -2.2 &&
      Math.abs(KNEE_FLOOR_EXPONENT - IMP33708_FARTAIL_EXPONENT) < 0.05 &&
      KNEE_FLOOR_EXPONENT < IMP33684_PEAK_EXPONENT,
  },
  {
    // K3: the knee floor band dwarfs the imp-33767 E_flow displacement by ~2 orders of magnitude.
    id: 'imp97822-floor-band-dwarfs-eflow-displacement',
    description: 'knee +/-10% floor band (~0.183 dec) exceeds the imp-33767 E_flow displacement (~0.0017 dec) by >50x',
    holds: () =>
      PM10_BAND_DECADES !== null &&
      PM10_BAND_DECADES > 0.15 &&
      PM10_BAND_DECADES < 0.22 &&
      FLOOR_OVER_EFLOW_RATIO !== null &&
      FLOOR_OVER_EFLOW_RATIO > 50,
  },
  {
    // Honesty gate: measurement/fit only, robust-topology/fragile-coordinate verdict, no QED, PT SOTA.
    id: 'imp97822-honesty-gate-no-qed',
    description: 'Measurement only: knee robust to floor topology but fragile in coordinate, no QED, PT stays SOTA',
    holds: () =>
      IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY.isRigorous === false &&
      /NO QED/.test(IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY.verdict) &&
      /remains SOTA/.test(IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY.verdict),
  },
];

for (const a of IMP97822_SIGMA_KNEE_ETRUNC_FLOOR_ELASTICITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97822-sigma-knee-etrunc-floor-elasticity assertion failed: ${a.id}`);
  }
}
