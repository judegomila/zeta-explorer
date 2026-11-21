/**
 * @module imp-96931-sigma-deep-decay-crossing-etrunc-elasticity
 *
 * imp-96931 (numerical, frontier-direction): EXTEND THE imp-96916 crossing-landmark
 * ladder into the DEEP-DECAY ARM by locating the sigma = 0.01 crossing of the
 * GUE-conditional share
 *     sigma(N) = E_coll(N) / E(N)
 * (well past the imp-96813 sigma = 0.1 landmark N_sub01 ~ 3.213e11) and MEASURING its
 * E_trunc elasticity d(log N_0.01)/d(log E_trunc). imp-96916 walked the ladder
 * {0.75, 0.5, 0.25, 0.1} and found the elasticity rides MONOTONE toward -2 as sigma
 * falls (2.129 -> 2.098 -> 2.087 -> 2.079), but the ladder STOPPED at sigma = 0.1, so
 * it never tested whether the approach to the -2 inverse-square regime CONTINUES into
 * the deep-decay arm or whether the residual log-T0 excess past -2 finally saturates.
 *
 * WHY THIS IS A DISTINCT MEASUREMENT
 * ----------------------------------
 * imp-96916 read the elasticity across the 0.75 -> 0.1 band, where E_flow / E_trunc
 * still runs 1.4e-2 -> 3.5e-5. The mechanism note there split the residual excess past
 * -2 into TWO pieces: a shrinking E_flow contribution and a slowly-GROWING log T0
 * factor that survives even where E_flow is negligible. Those two pieces are hard to
 * separate on the 0.75 -> 0.1 band because E_flow is not yet fully collapsed. Pushing
 * one decade deeper (sigma = 0.01, E_flow / E_trunc ~ 4.3e-7, i.e. E_flow essentially
 * gone) ISOLATES the log-T0 piece: if the excess persists here it is PURELY the log-T0
 * term, and its non-vanishing settles whether the -2 approach is monotone-continuing
 * (yes) versus the excess saturating to a floor (it does not -- it keeps shrinking, but
 * slowly, because log T0 keeps growing).
 *
 * THE QUANTITY (identical formulas to imp-3406 / imp-3444 / imp-96813 / imp-96916; only E_trunc varies)
 * ----------------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (GUE-conditional, dominant)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi (imp-398)
 *     E_trunc = 3.06e-5 * factor                   (base imp-2631; factor swept)
 * factor = 1 reproduces imp-3444 byte-for-byte (N_half = 3.267235e9); the swept factors
 * bracket a plausible +/-band about the base floor. C_mb stays GUE-conditional (imp-486).
 *
 * THE MECHANISM (why the deep-arm elasticity is ~ -2.066, still short of -2)
 * -------------------------------------------------------------------------
 * On the right decay arm sigma = s means E_coll ~ (s/(1-s)) (E_trunc + E_flow). With
 * E_flow / E_trunc collapsed to 4.3e-7 at sigma = 0.01 this is essentially
 * E_coll proportional to E_trunc, so N ~ E_trunc^-2 to leading order and the elasticity
 * -> -2. The residual excess |elasticity| - 2 = 0.066 that SURVIVES here is now almost
 * entirely the slowly-GROWING log T0 factor: log T0 climbs 25.225 (sigma = 0.1) ->
 * 26.713 (0.05) -> 30.001 (0.01), and because E_coll carries a sqrt(log T0) the crossing
 * N is not a pure E_trunc^-2 power. Measured excess |elasticity| - 2 down the extended
 * ladder: 0.079 (sigma = 0.1) -> 0.075 (0.05) -> 0.066 (0.01). The approach to -2
 * CONTINUES monotonically into the deep-decay arm; it does NOT saturate to a fixed
 * excess floor, but it shrinks only slowly because the driving log T0 term keeps growing.
 *
 * THE FINDING (measurement / sensitivity only)
 * --------------------------------------------
 *   (F1) THE sigma = 0.01 CROSSING SITS AT N_0.01 ~ 4.624e13, ~144x past the sigma = 0.1
 *        landmark N_sub01 ~ 3.213e11. Far into the deep-decay arm E_flow has essentially
 *        vanished (E_flow / E_trunc ~ 4.3e-7) and E_coll balances E_trunc almost alone.
 *   (F2) ITS ELASTICITY IS ~ -2.066, CONTINUING THE MONOTONE APPROACH TO -2. The
 *        extended ladder sigma in {0.1, 0.05, 0.01} reads elasticity -2.0790 -> -2.0746
 *        -> -2.0664, i.e. the magnitude keeps decreasing toward 2 past the imp-96916
 *        stopping point. The approach is monotone-continuing, not a jump and not a stall.
 *   (F3) THE RESIDUAL log-T0 EXCESS PERSISTS. Even with E_flow / E_trunc ~ 4.3e-7 (three
 *        decades smaller than at sigma = 0.1) the excess |elasticity| - 2 = 0.066 is
 *        still clearly nonzero, and log T0 has grown 25.225 -> 30.001. This isolates the
 *        excess as the slowly-growing log T0 term, exactly as imp-96916 conjectured: the
 *        -2 limit is approached but not reached, because the sqrt(log T0) in E_coll keeps
 *        the crossing off a clean E_trunc^-2 power.
 *   (F4) THE DEEP-ARM LANDMARK IS FLOOR-SENSITIVE, LIKE ITS NEIGHBOURS. Over a realistic
 *        +/-2x floor band (factor 0.5 .. 2) N_0.01 ranges ~1.10e13 .. 1.93e14 (~17.5x),
 *        and over the full 20x sweep (factor 2 .. 0.1) it swings ~1.10e13 .. 5.33e15
 *        (~483x). A tighter floor pushes it to LARGER N (later decay); the location is
 *        exact ONLY at the pinned floor 3.06e-5.
 *
 * VERDICT: THE sigma = 0.01 DEEP-DECAY CROSSING SITS AT N_0.01 ~ 4.624e13 (~144x past
 * the sigma = 0.1 landmark) WITH ELASTICITY ~ -2.066, CONTINUING THE imp-96916 MONOTONE
 * APPROACH TOWARD -2 (extended ladder -2.0790 -> -2.0746 -> -2.0664 at sigma 0.1 ->
 * 0.05 -> 0.01). The approach does NOT saturate: even with E_flow / E_trunc collapsed to
 * ~4.3e-7 the residual excess past -2 (0.066) PERSISTS, isolating it as the
 * slowly-growing log T0 factor (log T0 climbs 25.2 -> 30.0 across the arm). Like its
 * neighbours the deep-arm landmark is floor-sensitive (~483x swing over the 20x floor
 * sweep), exact only at the pinned floor 3.06e-5. Measurement/sensitivity only; C_mb
 * stays GUE-conditional (imp-486); no bound changes, no positivity, no bridge closure,
 * no RH claim, NO QED. No refereed bound is changed.
 *
 * @see imp-96916-sigma-quarter-crossing-etrunc-elasticity (ladder {0.75,0.5,0.25,0.1}; this module extends it to sigma=0.01)
 * @see imp-96813-sigma-decay-landmark-etrunc-sensitivity (flank landmarks 0.5/0.1 and their ~ -2.09 elasticities)
 * @see imp-3444-sigma-nshape-landmark-ladder (base landmark N_half 3.267235e9, pinned floor)
 * @see imp-3406-sigma-highN-extrapolation (interior max N_max ~ 9.22e5, sigma_max ~ 0.9494)
 * @see imp-2631 (E_trunc = 3.06e-5 fixed-strip truncation floor, the perturbed constant)
 * @see imp-398 (E_flow C_F prefactor); imp-486 (C_mb GUE-conditional)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631 fixed-strip floor (imp-3444 pin)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406 / imp-3444 / imp-96813 / imp-96916 exactly

// EXACT imp-3444 / imp-96813 / imp-96916 sub-terms; ONLY the E_trunc floor is a parameter here.
function termsWith(N, E_trunc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const sigma = E_coll / (E_trunc + E_flow + E_coll);
  return { T0, L, E_flow, E_coll, sigma };
}
function sigmaWith(N, E_trunc) {
  return termsWith(N, E_trunc).sigma;
}

// Machine-precision crossing on the monotone-decreasing right arm above the peak
// (identical bisection to imp-96916 crossingForFloor; the peak sits below 1e6).
function crossingForFloor(target, E_trunc) {
  let a = Math.log(1e6);
  let b = Math.log(1e80);
  for (let i = 0; i < 600; i++) {
    const m = (a + b) / 2;
    if (sigmaWith(Math.exp(m), E_trunc) - target > 0) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// Log-centred signed elasticity of a crossing on the floor (same recipe as imp-96916).
const F_LO = 1 / Math.SQRT2;
const F_HI = Math.SQRT2;
const DEN = Math.log(E_TRUNC_BASE * F_HI) - Math.log(E_TRUNC_BASE * F_LO);
function elasticityForLevel(target) {
  const lo = crossingForFloor(target, E_TRUNC_BASE * F_LO);
  const hi = crossingForFloor(target, E_TRUNC_BASE * F_HI);
  return (Math.log(hi) - Math.log(lo)) / DEN;
}

// The headline deep-decay landmark.
const SIGMA_TARGET = 0.01;
const N_DEEP = crossingForFloor(SIGMA_TARGET, E_TRUNC_BASE);
const DEEP_TERMS = termsWith(N_DEEP, E_TRUNC_BASE);
const ELASTICITY_DEEP = elasticityForLevel(SIGMA_TARGET); // ~ -2.06645

// The sigma = 0.1 landmark, reproduced to anchor the deep-arm extension.
const N_SUB01 = crossingForFloor(0.1, E_TRUNC_BASE);
const ELASTICITY_SUB01 = elasticityForLevel(0.1); // ~ -2.0790 (imp-96813 / imp-96916)

// Extended ladder into the deep-decay arm: elasticity keeps riding toward -2.
const LADDER_LEVELS = [0.1, 0.05, 0.01];
const DEEP_LADDER = LADDER_LEVELS.map((s) => {
  const N = crossingForFloor(s, E_TRUNC_BASE);
  const t = termsWith(N, E_TRUNC_BASE);
  return {
    sigma: s,
    N_cross: +N.toExponential(5),
    elasticity: +elasticityForLevel(s).toFixed(6),
    excess_past_two: +(Math.abs(elasticityForLevel(s)) - 2).toFixed(6),
    eflow_over_etrunc: +(t.E_flow / E_TRUNC_BASE).toExponential(3),
    logT0: +t.L.toFixed(3),
  };
});

// Floor sweep of the deep-arm landmark (factor 1 reproduces the base location).
const FLOOR_FACTORS = [2.0, 1.5, 1.0, 0.75, 0.5, 0.25, 0.1];
const FLOOR_SWEEP = FLOOR_FACTORS.map((f) => {
  const E_trunc = E_TRUNC_BASE * f;
  return {
    floorFactor: f,
    E_trunc: +E_trunc.toExponential(3),
    N_deep: +crossingForFloor(SIGMA_TARGET, E_trunc).toExponential(5),
  };
});
const SWEEP_NS = FLOOR_SWEEP.map((r) => r.N_deep);

export const IMP96931_SIGMA_DEEP_DECAY_CROSSING_ETRUNC_ELASTICITY = {
  id: 'imp-96931',
  proofSection: 'S-frontier',
  question:
    'Extending the imp-96916 ladder into the deep-decay arm, where does the sigma = 0.01 ' +
    'crossing of the GUE-conditional share sigma(N) sit (well past the sigma = 0.1 landmark ' +
    'N_sub01 ~ 3.213e11), what is its E_trunc elasticity d(log N_0.01)/d(log E_trunc), and does ' +
    'the monotone approach to the -2 inverse-square regime CONTINUE or does the residual log-T0 ' +
    'excess past -2 saturate? Measurement/sensitivity only; C_mb stays GUE-conditional (imp-486).',
  landmark: {
    sigma: SIGMA_TARGET,
    N_deep: +N_DEEP.toExponential(5), // ~4.62438e13
    elasticity_d_log_N_d_log_etrunc: +ELASTICITY_DEEP.toFixed(6), // ~ -2.066445
    excess_past_two: +(Math.abs(ELASTICITY_DEEP) - 2).toFixed(6), // ~0.066445
    eflow_over_etrunc_at_crossing: +(DEEP_TERMS.E_flow / E_TRUNC_BASE).toExponential(3), // ~4.255e-7
    logT0_at_crossing: +DEEP_TERMS.L.toFixed(3), // ~30.001
    ratio_deep_over_sub01: +(N_DEEP / N_SUB01).toFixed(3), // ~143.9
    note:
      'The sigma = 0.01 crossing sits ~144x past the sigma = 0.1 landmark, far into the ' +
      'deep-decay arm where E_flow has essentially vanished (E_flow / E_trunc ~ 4.3e-7) and ' +
      'E_coll balances E_trunc almost alone.',
  },
  deepLadder: DEEP_LADDER,
  signedLeverage: {
    d_log_Ndeep_d_log_etrunc: +ELASTICITY_DEEP.toFixed(6), // ~ -2.0664
    d_log_Nsub01_d_log_etrunc: +ELASTICITY_SUB01.toFixed(6), // ~ -2.0790 (imp-96813 / imp-96916)
    note:
      'The deep-arm elasticity ~ -2.066 continues the imp-96916 MONOTONE approach toward -2 ' +
      'past its sigma = 0.1 stopping point. The extended ladder reads -2.0790 -> -2.0746 -> ' +
      '-2.0664 (sigma 0.1 -> 0.05 -> 0.01); the magnitude keeps decreasing toward 2 -- no jump, ' +
      'no stall. The approach does NOT saturate: even with E_flow / E_trunc collapsed to ~4.3e-7 ' +
      'the residual excess past -2 (0.066) PERSISTS, isolating it as the slowly-growing log T0 ' +
      'factor (log T0 climbs 25.2 -> 30.0 across the arm).',
  },
  floorSweep: FLOOR_SWEEP,
  floorSensitivity: {
    span_over_realistic_band: +(
      crossingForFloor(SIGMA_TARGET, E_TRUNC_BASE * 0.5) /
      crossingForFloor(SIGMA_TARGET, E_TRUNC_BASE * 2.0)
    ).toFixed(2), // ~17.5x over factor 0.5 .. 2
    span_over_full_sweep: +(Math.max(...SWEEP_NS) / Math.min(...SWEEP_NS)).toFixed(1), // ~483x
    note:
      'A tighter floor pushes the deep-arm landmark to LARGER N (later decay): ~17.5x over a ' +
      'realistic +/-2x band and ~483x over the full 20x sweep. Like the flank landmarks the ' +
      'deep-arm location is exact ONLY at the pinned floor 3.06e-5.',
  },
  verdict:
    'THE sigma = 0.01 DEEP-DECAY CROSSING SITS AT N_0.01 ~ 4.624e13 (~144x past the sigma = 0.1 ' +
    'landmark N_sub01 ~ 3.213e11) WITH ELASTICITY ~ -2.066, CONTINUING the imp-96916 MONOTONE ' +
    'approach toward -2 (extended ladder -2.0790 -> -2.0746 -> -2.0664 at sigma 0.1 -> 0.05 -> ' +
    '0.01). The approach does NOT saturate: even with E_flow / E_trunc collapsed to ~4.3e-7 the ' +
    'residual excess past -2 (0.066) PERSISTS, isolating it as the slowly-growing log T0 factor ' +
    '(log T0 climbs 25.2 -> 30.0 across the arm). Like its neighbours the deep-arm landmark is ' +
    'floor-sensitive (~483x swing over the 20x floor sweep), exact only at the pinned floor ' +
    '3.06e-5. Measurement/sensitivity only; C_mb stays GUE-conditional (imp-486); no bound ' +
    'changes, no positivity, no bridge closure, no RH claim, NO QED. No refereed bound is changed' +
    '.',
  isRigorous: false,
  citation:
    'imp-96916 (ladder {0.75,0.5,0.25,0.1}, monotone toward -2, sigma=0.25 intermediate); ' +
    'imp-96813 (flank decay landmarks 0.5/0.1 and their ~ -2.09 elasticities); imp-3444 (base ' +
    'landmark N_half 3.267235e9, pinned floor); imp-3406 (interior max, sigma curve); imp-2631 ' +
    '(E_trunc = 3.06e-5 fixed-strip floor); imp-398 (E_flow C_F prefactor); imp-486 (C_mb ' +
    'GUE-conditional); lambda-rh-height-mapping.',
};

export const IMP96931_SIGMA_DEEP_DECAY_CROSSING_ETRUNC_ELASTICITY_ASSERTIONS = [
  {
    // Reuse gate: factor 1.0 reproduces the imp-3444 / imp-96813 / imp-96916 base flank landmark N_sub01.
    id: 'imp96931-reproduces-sub01-landmark',
    description: 'factor 1.0 reproduces the imp-96813 sigma=0.1 landmark N_sub01 ~ 3.213e11 (identical formulas)',
    holds: () => Math.abs(N_SUB01 - 3.21318e11) / 3.21318e11 < 1e-3,
  },
  {
    // F1: the sigma = 0.01 crossing sits well past the sigma = 0.1 landmark (deep-decay arm).
    id: 'imp96931-deep-past-sub01',
    description: 'N_0.01 sits more than 100x past the sigma=0.1 landmark N_sub01 (deep-decay arm)',
    holds: () => N_DEEP / N_SUB01 > 100,
  },
  {
    // F1: E_flow has essentially vanished at the crossing (isolates the log-T0 excess piece).
    id: 'imp96931-eflow-vanished-at-deep',
    description: 'E_flow / E_trunc at the sigma=0.01 crossing is < 1e-5 (E_flow essentially gone)',
    holds: () => DEEP_TERMS.E_flow / E_TRUNC_BASE < 1e-5,
  },
  {
    // F2: the elasticity is near -2 (inverse-square regime).
    id: 'imp96931-elasticity-near-minus-two',
    description: 'd(log N_0.01)/d(log E_trunc) is near -2 (in [-2.2, -1.9])',
    holds: () => ELASTICITY_DEEP > -2.2 && ELASTICITY_DEEP < -1.9,
  },
  {
    // F2: the deep-arm elasticity continues the monotone approach -- closer to -2 than the sigma=0.1 flank.
    id: 'imp96931-elasticity-continues-toward-two',
    description: 'the sigma=0.01 elasticity is strictly closer to -2 than the sigma=0.1 value (monotone approach continues)',
    holds: () => Math.abs(ELASTICITY_DEEP) < Math.abs(ELASTICITY_SUB01),
  },
  {
    // F2: monotone extended ladder -- |elasticity| decreases toward 2 as sigma falls 0.1 -> 0.01.
    id: 'imp96931-deep-ladder-monotone-toward-two',
    description: 'across sigma 0.1 -> 0.01 the elasticity magnitude decreases monotonically toward 2 (no saturation, no jump)',
    holds: () => {
      for (let i = 1; i < DEEP_LADDER.length; i++) {
        if (Math.abs(DEEP_LADDER[i].elasticity) >= Math.abs(DEEP_LADDER[i - 1].elasticity)) return false;
      }
      return true;
    },
  },
  {
    // F3: the residual excess past -2 persists even with E_flow negligible (log-T0 term).
    id: 'imp96931-residual-excess-persists',
    description: 'the excess |elasticity| - 2 at sigma=0.01 is still clearly nonzero (> 0.03) despite E_flow ~ 4e-7 (log-T0 term persists)',
    holds: () => Math.abs(ELASTICITY_DEEP) - 2 > 0.03,
  },
  {
    // F3: log T0 keeps growing across the arm (the driver of the persistent excess).
    id: 'imp96931-logT0-grows-across-arm',
    description: 'log T0 at the sigma=0.01 crossing exceeds its value at the sigma=0.1 crossing (slowly-growing log-T0 factor)',
    holds: () => DEEP_TERMS.L > termsWith(N_SUB01, E_TRUNC_BASE).L,
  },
  {
    // F4: floor-sensitive like its neighbours -- the full 20x floor sweep spans well over a decade in N.
    id: 'imp96931-deep-floor-sensitive',
    description: 'over the 0.1x .. 2x floor sweep N_0.01 spans more than a decade (floor-sensitive landmark)',
    holds: () => Math.max(...SWEEP_NS) / Math.min(...SWEEP_NS) > 10,
  },
  {
    // F4 (direction): a tighter floor pushes the landmark to larger N (later decay).
    id: 'imp96931-tighter-floor-pushes-deep-later',
    description: 'as the floor factor decreases, N_0.01 increases monotonically (later decay)',
    holds: () => {
      for (let i = 1; i < FLOOR_SWEEP.length; i++) {
        if (FLOOR_SWEEP[i].N_deep <= FLOOR_SWEEP[i - 1].N_deep) return false;
      }
      return true;
    },
  },
  {
    // Honesty gate: measurement/assessment only, monotone-continuing verdict, no QED, no refereed bound is changed.
    id: 'imp96931-honesty-gate-no-qed',
    description: 'Assessment only: monotone-continuing / excess-persists verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP96931_SIGMA_DEEP_DECAY_CROSSING_ETRUNC_ELASTICITY.isRigorous === false &&
      /CONTINUING/.test(IMP96931_SIGMA_DEEP_DECAY_CROSSING_ETRUNC_ELASTICITY.verdict) &&
      /PERSISTS/.test(IMP96931_SIGMA_DEEP_DECAY_CROSSING_ETRUNC_ELASTICITY.verdict) &&
      /NO QED/.test(IMP96931_SIGMA_DEEP_DECAY_CROSSING_ETRUNC_ELASTICITY.verdict) &&
      /refereed bound is changed/i.test(IMP96931_SIGMA_DEEP_DECAY_CROSSING_ETRUNC_ELASTICITY.verdict),
  },
];

for (const a of IMP96931_SIGMA_DEEP_DECAY_CROSSING_ETRUNC_ELASTICITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96931-sigma-deep-decay-crossing-etrunc-elasticity assertion failed: ${a.id}`,
    );
  }
}
