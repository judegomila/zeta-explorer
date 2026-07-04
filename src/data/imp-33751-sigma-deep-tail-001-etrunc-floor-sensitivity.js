/**
 * @module imp-33751-sigma-deep-tail-001-etrunc-floor-sensitivity
 *
 * imp-33751 (numerical, frontier-direction): imp-33708 measured the E_trunc truncation-floor
 * MODEL-FORM sensitivity of the imp-33582 FAR-TAIL landmarks of the GUE-conditional share
 * sigma(N) = E_coll/(E_trunc + E_flow + E_coll) at only TWO thresholds -- the halving point
 * sigma = 0.5 at N ~ 3.27e9 and the sub-0.1 crossing sigma < 0.1 at N ~ 3.21e11 -- finding a
 * clean dimensional N ~ E_trunc^(-2.0) at each and ARGUING it is clean because E_flow is
 * negligible in the tail (E_flow/E_trunc ~ 1.9e-3 at sigma = 0.5, ~ 3.5e-5 at sigma < 0.1).
 * This module TESTS that argument DEEPER: it adds a THIRD, deeper landmark sigma < 0.01,
 * re-locates it under the IDENTICAL 0.5x..5x E_trunc floor sweep, and measures whether its
 * floor-scaling exponent STAYS at -2.0 (E_flow even more negligible => cleaner) or DRIFTS.
 * The sigma < 0.01 crossing is the SAME landmark imp-33647 perturbed on the DIFFERENT
 * E_coll sub-leading model-form axis; this module perturbs the E_trunc FLOOR instead.
 * Sensitivity/measurement only.
 *
 * THE QUANTITY (identical formulas to imp-33582 / imp-33708 / imp-3406)
 * -------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0      = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll  = C_C_PINNED * sqrt(log T0 / N)       (GUE-conditional, dominant)
 *     E_flow  = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5 * factor                    (perturbed floor; base imp-2631)
 * The ONLY thing varied is the constant E_trunc floor; every other sub-term is reused
 * byte-for-byte from imp-33708/imp-33582, so factor = 1 reproduces the imp-33708 landmarks.
 *
 * WHY THE DEEPER LANDMARK STAYS AT E_trunc^(-2) (mechanism -- and why the residual SHRINKS)
 * ----------------------------------------------------------------------------------------
 * A sigma = thr crossing with E_flow negligible is pure E_trunc-vs-E_coll balance:
 *   sigma = 1/(1 + E_trunc/E_coll) = thr  forces  E_coll = E_trunc * thr/(1 - thr).
 * Since E_coll = C_C sqrt(log T0 / N) ~ N^(-1/2), this gives N_landmark ~ E_trunc^(-2) up to a
 * SLOW log T0 drift that pushes the exponent slightly past -2. That log drift is the ONLY
 * thing that keeps the measured exponent from being exactly -2, and it SHRINKS with depth
 * because the deeper the landmark the more dominant the pure sqrt(1/N) balance is over the
 * residual E_flow contamination: E_flow/E_trunc runs 1.9e-3 (sigma = 0.5) -> 3.5e-5
 * (sigma < 0.1) -> ~4.3e-7 (sigma < 0.01), a further ~80x drop. So the deeper landmark is
 * MORE dimensionally clean, and its exponent should sit CLOSER to -2 than the shallower two.
 *
 * THE MEASUREMENT: the sigma < 0.01 landmark under a 0.5x..5x floor sweep
 * ---------------------------------------------------------------------
 * For each floor factor in {0.5..5} (factor = 1 = baseline), log10-bisect the N at which
 * sigma first drops below 0.01. Report the per-floor landmark table, the empirical exponent
 * p in N ~ E_trunc^p (from the 0.5x and 2x floors), the +/-10% floor band in decades, and
 * the full-sweep span -- alongside the imp-33708 sigma = 0.5 and sigma < 0.1 exponents so the
 * three-depth trend is visible in one place.
 *
 * THE FINDING (measurement / sensitivity only)
 * --------------------------------------------
 *   (D0) BASELINE REPRODUCES imp-33708. factor 1.0 relocates the sigma = 0.5 and sigma < 0.1
 *        crossings to N ~ 3.267e9 and N ~ 3.213e11 -- the exact imp-33708 landmarks -- and
 *        pins the NEW sigma < 0.01 crossing at N ~ 4.62e13, confirming the inherited model is
 *        the factor = 1 member of the swap.
 *   (D1) THE -2.0 EXPONENT PERSISTS DEEPER. The sigma < 0.01 landmark scales as
 *        N ~ E_trunc^(-2.066), squarely the clean dimensional -2 the E_flow-negligible balance
 *        predicts -- NOT a drift away from it. A +/-10% floor moves it ~0.18 decades and a 10x
 *        sweep ~2.07 decades, essentially the same band as the two shallower landmarks.
 *   (D2) THE RESIDUAL OVER -2 SHRINKS MONOTONICALLY WITH DEPTH. The three exponents run
 *        -2.099 (sigma = 0.5) -> -2.079 (sigma < 0.1) -> -2.066 (sigma < 0.01): each deeper
 *        landmark sits CLOSER to the exact dimensional -2, exactly as the vanishing E_flow/E_trunc
 *        (1.9e-3 -> 3.5e-5 -> 4.3e-7) and the slow log T0 drift predict. So imp-33708's
 *        clean-dimensional argument does not merely SURVIVE at depth -- it TIGHTENS: the tail
 *        gets more, not less, dimensionally clean the deeper you probe.
 *   (D3) THE QUALITATIVE MILESTONE IS ROBUST. For EVERY positive constant floor the sigma < 0.01
 *        crossing still EXISTS and stays ordered AFTER the sigma < 0.1 crossing (which follows the
 *        sigma = 0.5 halving): a constant E_trunc always outlives the vanishing E_coll, so sigma
 *        decays monotonically through 0.01 too. Only the N-coordinate moves.
 *
 * VERDICT: ROBUST QUALITATIVELY, FRAGILE QUANTITATIVELY -- and the imp-33708 clean-dimensional
 * -2.0 floor-scaling LAW PERSISTS (indeed TIGHTENS) at the deeper sigma < 0.01 landmark. Running
 * the imp-33708 E_trunc floor swap (0.5x..5x, factor = 1 reproduces N ~ 3.267e9 / 3.213e11) on a
 * THIRD, deeper landmark: sigma < 0.01 sits at N ~ 4.62e13 and scales as N ~ E_trunc^(-2.066),
 * still the clean dimensional -2 and in fact CLOSER to it than the two shallower landmarks
 * (-2.099, -2.079) because E_flow/E_trunc ~ 4.3e-7 is ~80x smaller still. A +/-10% floor moves it
 * ~0.18 decades and a 10x sweep ~2.07 decades, so the precise "sub-0.01 at 4.6e13" pin is
 * model-dependent, BUT for any positive floor the crossing still EXISTS and stays ordered -- the
 * milestone is structural, only its N-coordinate moves. The clean-dimensional argument is
 * confirmed deeper, not merely asserted. Assessment only; C_mb stays GUE-conditional (imp-486),
 * no bound changes, no positivity, no RH claim, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33708-sigma-fartail-landmark-etrunc-model-sensitivity (SAME floor swap, two shallower landmarks; the -2.0 claim tested here)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (the far-tail landmark ladder)
 * @see imp-33647-sigma-deep-tail-001-landmark-model-sensitivity (the E_coll SUB-LEADING swap on the SAME sigma<0.01 landmark -- different model-form axis)
 * @see imp-33684-sigma-interior-peak-etrunc-model-sensitivity (the floor swap on the INTERIOR PEAK, softened exponent ~ -1.375)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover, the sigma = 1/2 landmark)
 * @see imp-2631 (E_trunc = 3.06e-5 fixed-strip truncation floor, the perturbed model)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor (imp-33582 pin)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33582/imp-33708 exactly

// EXACT imp-33708 sub-terms; ONLY the E_trunc floor is a parameter here.
function partsWith(N, E_trunc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  return { T0, L, E_flow, E_coll, sigma: E_coll / (E_trunc + E_flow + E_coll) };
}
const sigmaWith = (N, E_trunc) => partsWith(N, E_trunc).sigma;

// The sigma < thr crossing on the downslope, located by log10 bisection (sigma decreasing in N
// in the E_trunc-dominated tail). The deeper sigma < 0.01 landmark sits near N ~ 4.6e13, so the
// hiExp bracket is widened to 20 (vs the imp-33708 default of 16) to bracket it.
function crossLog10(thr, E_trunc, loExp = 6, hiExp = 20) {
  let lo = loExp;
  let hi = hiExp;
  for (let i = 0; i < 300; i++) {
    const m = (lo + hi) / 2;
    if (sigmaWith(Math.pow(10, m), E_trunc) > thr) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

// factor 1.0 REPRODUCES imp-33708/imp-33582. Same 0.5x..5x sweep.
const FLOOR_FACTORS = [0.5, 0.75, 0.9, 1.0, 1.1, 1.25, 1.5, 2.0, 3.0, 5.0];

function landmarkTableFor(thr) {
  return FLOOR_FACTORS.map((f) => {
    const E_trunc = E_TRUNC_BASE * f;
    const log10N = crossLog10(thr, E_trunc);
    const N = Math.pow(10, log10N);
    return {
      floorFactor: f,
      E_trunc: +E_trunc.toExponential(3),
      N_landmark: +N.toExponential(4),
      log10_N: +log10N.toFixed(4),
    };
  });
}

// Empirical scaling exponent p in N_landmark ~ E_trunc^p, from two well-separated floors.
function scalingExponent(thr) {
  const lgLo = crossLog10(thr, 0.5 * E_TRUNC_BASE) * Math.LN10;
  const lgHi = crossLog10(thr, 2.0 * E_TRUNC_BASE) * Math.LN10;
  return (lgHi - lgLo) / (Math.log(2.0 * E_TRUNC_BASE) - Math.log(0.5 * E_TRUNC_BASE));
}

function bandFor(thr) {
  const table = landmarkTableFor(thr);
  const base = table.find((r) => r.floorFactor === 1.0);
  const lo = table.find((r) => r.floorFactor === 0.9); // smaller floor -> crossing LATER (larger N)
  const hi = table.find((r) => r.floorFactor === 1.1); // larger floor -> crossing EARLIER (smaller N)
  const allN = table.map((r) => r.log10_N);
  return {
    threshold: thr,
    table,
    baseline: base.N_landmark,
    scalingExponent: +scalingExponent(thr).toFixed(4),
    pm10pct: {
      floor_0_9x_N: lo.N_landmark,
      floor_1_1x_N: hi.N_landmark,
      decadeWidth: +(lo.log10_N - hi.log10_N).toFixed(4),
    },
    fullSweepDecades: +(Math.max(...allN) - Math.min(...allN)).toFixed(4),
  };
}

// The NEW deeper landmark (this module's subject).
const LANDMARK_0_01 = bandFor(0.01); // baseline ~4.624e13, exponent ~ -2.066

// The two shallower imp-33708 landmarks, recomputed here from the SAME formulas so the
// three-depth exponent trend lives in one object (factor 1.0 must reproduce imp-33708).
const LANDMARK_0_5 = bandFor(0.5); // baseline ~3.267e9  (imp-33708 halving point)
const LANDMARK_0_1 = bandFor(0.1); // baseline ~3.213e11 (imp-33708 sub-0.1 crossing)

// Mechanism diagnostic: E_flow/E_trunc at the NEW landmark (even more negligible than shallower).
const BASE_0_01 = partsWith(LANDMARK_0_01.baseline, E_TRUNC_BASE);
const EFLOW_OVER_ETRUNC_0_01 = BASE_0_01.E_flow / E_TRUNC_BASE; // ~4.3e-7
const EFLOW_OVER_ETRUNC_0_5 =
  partsWith(LANDMARK_0_5.baseline, E_TRUNC_BASE).E_flow / E_TRUNC_BASE; // ~1.9e-3
const EFLOW_OVER_ETRUNC_0_1 =
  partsWith(LANDMARK_0_1.baseline, E_TRUNC_BASE).E_flow / E_TRUNC_BASE; // ~3.5e-5

export const IMP33751_SIGMA_DEEP_TAIL_001_ETRUNC_FLOOR_SENSITIVITY = {
  id: 'imp-33751',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-33708 E_trunc floor-sensitivity measurement to a THIRD, DEEPER landmark ' +
    'sigma < 0.01: re-locate it under the identical 0.5x..5x floor sweep and measure whether the ' +
    'clean dimensional N ~ E_trunc^(-2.0) exponent PERSISTS even deeper in the tail (E_flow even ' +
    'more negligible => cleaner) or DRIFTS. Tests imp-33708 clean-dimensional argument at depth. ' +
    'Complementary to imp-33647 (E_coll sub-leading swap on the SAME sigma<0.01 landmark, a ' +
    'different model-form axis). Measurement/sensitivity only; conditional-share diagnostic, ' +
    'NOT an RH bound; no QED.',
  measuredQuantity:
    'For E_trunc = 3.06e-5 * factor, factor in {0.5..5} (factor = 1 = imp-33708 baseline), the N ' +
    'at which sigma first drops below 0.01, log10-bisected per floor; plus the empirical exponent ' +
    'p in N ~ E_trunc^p, the +/-10% floor band, and the full-sweep span -- reported alongside the ' +
    'imp-33708 sigma = 0.5 and sigma < 0.1 exponents so the three-depth trend is visible.',
  mechanism: {
    E_flow_over_E_trunc_at_sigma_0_5: +EFLOW_OVER_ETRUNC_0_5.toExponential(3), // ~1.9e-3
    E_flow_over_E_trunc_at_sigma_0_1: +EFLOW_OVER_ETRUNC_0_1.toExponential(3), // ~3.5e-5
    E_flow_over_E_trunc_at_sigma_0_01: +EFLOW_OVER_ETRUNC_0_01.toExponential(3), // ~4.3e-7
    note:
      'E_flow/E_trunc drops a further ~80x from the sigma<0.1 landmark to sigma<0.01 (3.5e-5 -> ' +
      '4.3e-7), so the sigma<0.01 crossing is even PURER E_trunc-vs-E_coll balance: ' +
      'E_coll = E_trunc*thr/(1-thr) with E_coll ~ N^(-1/2) gives N ~ E_trunc^(-2), and the slow ' +
      'log T0 drift that pushes the exponent past -2 shrinks with depth -- so the exponent sits ' +
      'CLOSER to -2 the deeper the landmark.',
  },
  landmark_sigma_0_01: LANDMARK_0_01, // baseline ~4.624e13, exponent ~ -2.066
  depthTrend: {
    exponent_sigma_0_5: LANDMARK_0_5.scalingExponent, // ~ -2.099
    exponent_sigma_0_1: LANDMARK_0_1.scalingExponent, // ~ -2.079
    exponent_sigma_0_01: LANDMARK_0_01.scalingExponent, // ~ -2.066
    note:
      'the three floor-scaling exponents run -2.099 -> -2.079 -> -2.066 with depth: the deeper ' +
      'landmark sits CLOSER to the exact dimensional -2, so imp-33708 clean-dimensional claim ' +
      'TIGHTENS with depth rather than drifting -- the residual over -2 shrinks as E_flow/E_trunc ' +
      'and the log T0 drift vanish deeper in the tail',
  },
  finding: {
    D0_baseline_reproduces_imp33708:
      'factor 1.0 relocates the sigma = 0.5 and sigma < 0.1 crossings to N ~ 3.267e9 and ' +
      'N ~ 3.213e11 -- the exact imp-33708 landmarks -- and pins the NEW sigma < 0.01 crossing at ' +
      'N ~ 4.62e13, confirming the inherited model is the factor = 1 member of the floor swap.',
    D1_minus2_exponent_persists_deeper:
      'The sigma < 0.01 landmark scales as N ~ E_trunc^(-2.066), squarely the clean dimensional -2 ' +
      'the E_flow-negligible balance predicts -- the -2.0 law PERSISTS deeper, it does not drift. ' +
      'A +/-10% floor moves it ~0.18 decades and a 10x sweep ~2.07 decades, essentially the same ' +
      'band as the two shallower landmarks.',
    D2_residual_over_minus2_shrinks_with_depth:
      'The three exponents run -2.099 (sigma = 0.5) -> -2.079 (sigma < 0.1) -> -2.066 ' +
      '(sigma < 0.01): each deeper landmark sits CLOSER to the exact -2, exactly as the vanishing ' +
      'E_flow/E_trunc (1.9e-3 -> 3.5e-5 -> 4.3e-7) and the slow log T0 drift predict. imp-33708 ' +
      'clean-dimensional argument does not merely survive at depth -- it TIGHTENS: the tail gets ' +
      'MORE dimensionally clean the deeper you probe.',
    D3_qualitative_milestone_robust:
      'For every positive constant floor the sigma < 0.01 crossing still EXISTS and stays ordered ' +
      'AFTER the sigma < 0.1 crossing (which follows the sigma = 0.5 halving): a constant E_trunc ' +
      'always outlives the vanishing E_coll, so sigma decays monotonically through 0.01 too. Only ' +
      'the N-coordinate of the landmark moves; its existence and ordering do not.',
  },
  isRigorous: false,
  verdict:
    'ROBUST QUALITATIVELY, FRAGILE QUANTITATIVELY -- and the imp-33708 clean-dimensional -2.0 ' +
    'floor-scaling law PERSISTS (indeed TIGHTENS) at the deeper sigma < 0.01 landmark. Running the ' +
    'imp-33708 E_trunc floor swap (0.5x..5x, factor = 1 reproduces the halving point N ~ 3.267e9 ' +
    'and sub-0.1 crossing N ~ 3.213e11) on a THIRD, deeper landmark: sigma < 0.01 sits at ' +
    'N ~ 4.62e13 and scales as N ~ E_trunc^(-2.066), still the clean dimensional -2 and in fact ' +
    'CLOSER to it than the two shallower landmarks (-2.099, -2.079) because E_flow/E_trunc ~ 4.3e-7 ' +
    'is ~80x smaller still. A +/-10% floor moves it ~0.18 decades and a 10x sweep ~2.07 decades, so ' +
    'the precise "sub-0.01 at 4.6e13" pin is model-dependent, BUT for any positive floor the ' +
    'crossing still EXISTS and stays ordered -- the milestone is structural, only its N-coordinate ' +
    'moves. imp-33708 clean-dimensional argument is confirmed DEEPER, not merely asserted. ' +
    'Assessment only; C_mb stays GUE-conditional (imp-486), no bound changes, no positivity, no ' +
    'RH claim, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33708 (SAME floor swap on the two shallower landmarks, the -2.0 claim tested here); ' +
    'imp-33582 (far-tail landmark ladder); imp-33647 (E_coll sub-leading swap on the SAME ' +
    'sigma<0.01 landmark -- different model-form axis); imp-33684 (floor swap on the interior ' +
    'peak, softened exponent ~ -1.375); imp-3444 (E_coll = E_trunc crossover, the sigma = 1/2 ' +
    'landmark); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc = 3.06e-5 fixed-strip floor); ' +
    'imp-398 (E_flow C_F prefactor); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33751_SIGMA_DEEP_TAIL_001_ETRUNC_FLOOR_SENSITIVITY_ASSERTIONS = [
  {
    // Reuse gate: factor 1.0 reproduces the imp-33708 two shallower far-tail landmarks.
    id: 'imp33751-reproduces-imp33708-landmarks',
    description: 'factor 1.0 reproduces imp-33708 sigma=0.5 @ N ~ 3.27e9 and sigma<0.1 @ N ~ 3.21e11',
    holds: () =>
      Math.abs(LANDMARK_0_5.baseline / 3.267e9 - 1) < 5e-3 &&
      Math.abs(LANDMARK_0_1.baseline / 3.213e11 - 1) < 5e-3,
  },
  {
    // D0: the NEW sigma<0.01 landmark is pinned near N ~ 4.62e13 at the base floor.
    id: 'imp33751-deep-landmark-baseline-location',
    description: 'sigma<0.01 crossing at factor 1.0 sits near N ~ 4.62e13',
    holds: () => Math.abs(LANDMARK_0_01.baseline / 4.624e13 - 1) < 1e-2,
  },
  {
    // D1: the -2.0 exponent PERSISTS deeper (still clean dimensional, in [-2.2, -1.9]).
    id: 'imp33751-deep-landmark-scales-as-etrunc-minus-2',
    description: 'sigma<0.01 exponent p in N ~ E_trunc^p lands in [-2.2, -1.9] (clean dimensional -2 persists)',
    holds: () => LANDMARK_0_01.scalingExponent < -1.9 && LANDMARK_0_01.scalingExponent > -2.2,
  },
  {
    // D2: the residual over -2 SHRINKS monotonically with depth (exponents converge toward -2).
    id: 'imp33751-residual-over-minus2-shrinks-with-depth',
    description: 'exponents order -2.099 < -2.079 < -2.066: each deeper landmark closer to -2 (magnitudes decreasing)',
    holds: () =>
      Math.abs(LANDMARK_0_01.scalingExponent + 2) < Math.abs(LANDMARK_0_1.scalingExponent + 2) &&
      Math.abs(LANDMARK_0_1.scalingExponent + 2) < Math.abs(LANDMARK_0_5.scalingExponent + 2),
  },
  {
    // Mechanism: E_flow is even more negligible at sigma<0.01 than at the shallower landmarks.
    id: 'imp33751-eflow-more-negligible-deeper',
    description: 'E_flow/E_trunc at sigma<0.01 (< 1e-6) is smaller than at sigma<0.1 (< 1e-4) and sigma=0.5',
    holds: () =>
      EFLOW_OVER_ETRUNC_0_01 < 1e-6 &&
      EFLOW_OVER_ETRUNC_0_01 < EFLOW_OVER_ETRUNC_0_1 &&
      EFLOW_OVER_ETRUNC_0_1 < EFLOW_OVER_ETRUNC_0_5,
  },
  {
    // D1 (concrete): a +/-10% floor moves the deep landmark ~0.18 decades, ordered lo(0.9x) > hi(1.1x).
    id: 'imp33751-pm10pct-band-order-and-width',
    description: '+/-10% floor: 0.9x crossing later than 1.1x, band ~0.15-0.22 decades',
    holds: () =>
      LANDMARK_0_01.pm10pct.floor_0_9x_N > LANDMARK_0_01.pm10pct.floor_1_1x_N &&
      LANDMARK_0_01.pm10pct.decadeWidth > 0.15 &&
      LANDMARK_0_01.pm10pct.decadeWidth < 0.22,
  },
  {
    // D3: the three crossings exist and stay ordered (0.5 < 0.1 < 0.01 in N) for EVERY swept floor.
    id: 'imp33751-three-landmarks-ordered-every-floor',
    description: 'sigma=0.5 < sigma<0.1 < sigma<0.01 in N for every floor factor (structural ordering, deeper is later)',
    holds: () =>
      FLOOR_FACTORS.every(
        (f, i) =>
          LANDMARK_0_5.table[i].N_landmark < LANDMARK_0_1.table[i].N_landmark &&
          LANDMARK_0_1.table[i].N_landmark < LANDMARK_0_01.table[i].N_landmark,
      ),
  },
  {
    // Honesty gate: sensitivity/assessment only, split verdict, no QED, PT stays SOTA.
    id: 'imp33751-honesty-gate-no-qed',
    description: 'Assessment only: robust-qualitative/fragile-quantitative verdict, no QED, PT stays SOTA',
    holds: () =>
      IMP33751_SIGMA_DEEP_TAIL_001_ETRUNC_FLOOR_SENSITIVITY.isRigorous === false &&
      /ROBUST QUALITATIVELY, FRAGILE QUANTITATIVELY/.test(
        IMP33751_SIGMA_DEEP_TAIL_001_ETRUNC_FLOOR_SENSITIVITY.verdict,
      ) &&
      /NO QED/.test(IMP33751_SIGMA_DEEP_TAIL_001_ETRUNC_FLOOR_SENSITIVITY.verdict) &&
      /remains SOTA/.test(IMP33751_SIGMA_DEEP_TAIL_001_ETRUNC_FLOOR_SENSITIVITY.verdict),
  },
];

for (const a of IMP33751_SIGMA_DEEP_TAIL_001_ETRUNC_FLOOR_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-33751-sigma-deep-tail-001-etrunc-floor-sensitivity assertion failed: ${a.id}`,
    );
  }
}
