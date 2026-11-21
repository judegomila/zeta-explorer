/**
 * @module imp-96916-sigma-quarter-crossing-etrunc-elasticity
 *
 * imp-96916 (numerical, frontier-direction): LOCATE THE INTERMEDIATE sigma = 0.25
 * crossing landmark of the imp-3220/imp-3406 GUE-conditional share
 *     sigma(N) = E_coll(N) / E(N)
 * and MEASURE its E_trunc elasticity d(log N_0.25)/d(log E_trunc), filling the gap
 * left by imp-96794 (which varied only the interior PEAK share sigma_max ~ 0.9494 at
 * N_max ~ 9.22e5) and imp-96813 (which measured the ~ -2.09 elasticity of the two
 * far-decay landmarks sigma = 0.5 at N_half ~ 3.267e9 and sigma = 0.1 at N_sub01 ~
 * 3.213e11). The sigma = 0.25 crossing was never located or varied against E_trunc.
 *
 * WHY THIS IS A DISTINCT MEASUREMENT
 * ----------------------------------
 * imp-96813 pinned the OUTER two decay landmarks (0.5 and 0.1) and read off their
 * elasticities as ~ -2.098 and ~ -2.079, but it never located the crossing BETWEEN
 * them, so it could not test whether the elasticity varies SMOOTHLY across the decay
 * arm as E_flow decays to negligibility, or jumps. This module locates the sigma =
 * 0.25 crossing (the midpoint sigma level of the 0.5 -> 0.1 decade band) and reports
 * its elasticity alongside a short interpolation ladder sigma in {0.75, 0.5, 0.25,
 * 0.1}, checking that d(log N)/d(log E_trunc) rides monotonically toward -2 as the
 * ratio E_flow / E_trunc collapses.
 *
 * THE QUANTITY (identical formulas to imp-3406 / imp-3444 / imp-96813; only E_trunc varies)
 * ----------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (GUE-conditional, dominant)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi (imp-398)
 *     E_trunc = 3.06e-5 * factor                   (base imp-2631; factor swept)
 * factor = 1 reproduces imp-3444 byte-for-byte (N_half = 3.267235e9); the swept
 * factors bracket a plausible +/-band about the base floor.
 *
 * THE MECHANISM (why the intermediate elasticity is ~ -2.087, between the flanks)
 * ------------------------------------------------------------------------------
 * On the right decay arm sigma = s means E_coll ~ (s/(1-s)) (E_trunc + E_flow). Once
 * E_flow / E_trunc has collapsed (2.6e-4 at the sigma = 0.25 crossing, dg_flow/dt
 * being super-polynomial), this reduces to C_C sqrt(log T0 / N) proportional to
 * E_trunc, so N ~ E_trunc^-2 to leading order. The small excess past -2 has TWO
 * pieces: a shrinking E_flow contribution (larger nearer the peak) and a slowly
 * GROWING log T0 factor that persists even where E_flow is negligible (imp-96813).
 * Measured excess |elasticity| - 2: 0.129 (sigma = 0.75, E_flow/E_trunc = 1.4e-2)
 * -> 0.098 (0.5, 1.9e-3) -> 0.087 (0.25, 2.6e-4) -> 0.079 (0.1, 3.5e-5). The
 * sigma = 0.25 rung falls exactly between its 0.5 and 0.1 neighbours -- the arm
 * interpolates smoothly toward the -2 inverse-square regime, it does not jump.
 *
 * THE FINDING (measurement / sensitivity only)
 * --------------------------------------------
 *   (F1) THE sigma = 0.25 CROSSING SITS AT N_0.25 ~ 3.259e10, at the GEOMETRIC
 *        CENTER of the 0.5 -> 0.1 decade band: N_0.25 / N_half ~ 9.98 and
 *        N_sub01 / N_0.25 ~ 9.86, i.e. the crossing is within ~0.6% of the geometric
 *        mean sqrt(N_half * N_sub01) ~ 3.24e10. The decade band is very nearly
 *        log-uniform in the sigma level.
 *   (F2) ITS ELASTICITY IS ~ -2.087, STRICTLY BETWEEN THE FLANK LANDMARKS.
 *        d(log N_0.25)/d(log E_trunc) ~ -2.0868 lies between the imp-96813 values
 *        -2.0984 (sigma = 0.5) and -2.0790 (sigma = 0.1). Across the ladder the
 *        elasticity is MONOTONE toward -2 (magnitude 2.129 -> 2.098 -> 2.087 ->
 *        2.079 as sigma falls 0.75 -> 0.1), tracking the collapsing E_flow / E_trunc
 *        ratio. The arm interpolates smoothly; there is no intermediate anomaly.
 *   (F3) THE INTERMEDIATE LANDMARK IS FLOOR-SENSITIVE, LIKE ITS NEIGHBOURS. Over a
 *        realistic +/-2x floor band (factor 0.5 .. 2) N_0.25 ranges ~7.7e9 .. 1.38e11
 *        (~18x), and over the full 20x sweep (factor 2 .. 0.1) it swings ~7.7e9 ..
 *        3.91e12 (~510x). A tighter floor pushes it to LARGER N (later decay); the
 *        oft-quoted intermediate location is exact ONLY at the pinned floor 3.06e-5.
 *
 * VERDICT: THE INTERMEDIATE sigma = 0.25 CROSSING SITS AT N_0.25 ~ 3.259e10 (the
 * geometric center of the 0.5 -> 0.1 decade band) WITH ELASTICITY ~ -2.087, STRICTLY
 * BETWEEN the imp-96813 flank landmarks (-2.098 at 0.5, -2.079 at 0.1). The elasticity
 * rides MONOTONICALLY toward -2 as the sigma level falls and E_flow / E_trunc collapses
 * (0.75: 1.4e-2 -> 0.1: 3.5e-5), so the decay arm interpolates SMOOTHLY toward the -2
 * inverse-square regime -- no intermediate anomaly, and the residual excess past -2 is
 * the slowly-growing log T0 factor that persists where E_flow is negligible. Like its
 * neighbours the intermediate landmark is floor-sensitive (~510x swing over the 20x
 * sweep), exact only at the pinned floor 3.06e-5. Measurement/sensitivity only; C_mb
 * stays GUE-conditional (imp-486); no bound changes, no positivity, no bridge closure,
 * no RH claim, NO QED. No refereed bound is changed.
 *
 * @see imp-96813-sigma-decay-landmark-etrunc-sensitivity (flank landmarks 0.5/0.1; this module adds the intermediate 0.25 crossing)
 * @see imp-96794-etrunc-reduction-peak-share-leverage (interior peak share sigma_max ~ 0.9494 leverage)
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
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406 / imp-3444 / imp-96813 exactly

// EXACT imp-3444 / imp-96813 sub-terms; ONLY the E_trunc floor is a parameter here.
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
// (identical bisection to imp-96813 crossingForFloor; the peak sits below 1e6).
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

// Log-centred signed elasticity of a crossing on the floor (same recipe as imp-96813).
const F_LO = 1 / Math.SQRT2;
const F_HI = Math.SQRT2;
const DEN = Math.log(E_TRUNC_BASE * F_HI) - Math.log(E_TRUNC_BASE * F_LO);
function elasticityForLevel(target) {
  const lo = crossingForFloor(target, E_TRUNC_BASE * F_LO);
  const hi = crossingForFloor(target, E_TRUNC_BASE * F_HI);
  return (Math.log(hi) - Math.log(lo)) / DEN;
}

// The headline intermediate landmark.
const SIGMA_TARGET = 0.25;
const N_QUARTER = crossingForFloor(SIGMA_TARGET, E_TRUNC_BASE);
const QUARTER_TERMS = termsWith(N_QUARTER, E_TRUNC_BASE);
const ELASTICITY_QUARTER = elasticityForLevel(SIGMA_TARGET); // ~ -2.0868

// Flank landmarks (reproduce imp-96813 to place the intermediate strictly between).
const N_HALF = crossingForFloor(0.5, E_TRUNC_BASE);
const N_SUB01 = crossingForFloor(0.1, E_TRUNC_BASE);
const ELASTICITY_HALF = elasticityForLevel(0.5); // ~ -2.0984
const ELASTICITY_SUB01 = elasticityForLevel(0.1); // ~ -2.0790
const GEO_MEAN = Math.sqrt(N_HALF * N_SUB01);

// Interpolation ladder: elasticity rides toward -2 as E_flow / E_trunc collapses.
const LADDER_LEVELS = [0.75, 0.5, 0.25, 0.1];
const INTERP_LADDER = LADDER_LEVELS.map((s) => {
  const N = crossingForFloor(s, E_TRUNC_BASE);
  const t = termsWith(N, E_TRUNC_BASE);
  return {
    sigma: s,
    N_cross: +N.toExponential(5),
    elasticity: +elasticityForLevel(s).toFixed(6),
    eflow_over_etrunc: +(t.E_flow / E_TRUNC_BASE).toExponential(3),
    logT0: +t.L.toFixed(3),
  };
});

// Floor sweep of the intermediate landmark (factor 1 reproduces the base location).
const FLOOR_FACTORS = [2.0, 1.5, 1.0, 0.75, 0.5, 0.25, 0.1];
const FLOOR_SWEEP = FLOOR_FACTORS.map((f) => {
  const E_trunc = E_TRUNC_BASE * f;
  return {
    floorFactor: f,
    E_trunc: +E_trunc.toExponential(3),
    N_quarter: +crossingForFloor(SIGMA_TARGET, E_trunc).toExponential(5),
  };
});
const SWEEP_NS = FLOOR_SWEEP.map((r) => r.N_quarter);

export const IMP96916_SIGMA_QUARTER_CROSSING_ETRUNC_ELASTICITY = {
  id: 'imp-96916',
  proofSection: 'S-frontier',
  question:
    'Where does the INTERMEDIATE sigma = 0.25 crossing of the GUE-conditional share sigma(N) ' +
    'sit, and what is its E_trunc elasticity d(log N_0.25)/d(log E_trunc)? Does it interpolate ' +
    'smoothly toward the -2 inverse-square regime (imp-96813 flanks -2.098 at 0.5, -2.079 at 0.1) ' +
    'as E_flow decays to negligibility? Fills the imp-96794 (peak share) / imp-96813 (0.5, 0.1 ' +
    'decay landmarks) gap. Measurement/sensitivity only; C_mb stays GUE-conditional (imp-486).',
  landmark: {
    sigma: SIGMA_TARGET,
    N_quarter: +N_QUARTER.toExponential(5), // ~3.25939e10
    elasticity_d_log_N_d_log_etrunc: +ELASTICITY_QUARTER.toFixed(6), // ~ -2.086756
    eflow_over_etrunc_at_crossing: +(QUARTER_TERMS.E_flow / E_TRUNC_BASE).toExponential(3), // ~2.625e-4
    logT0_at_crossing: +QUARTER_TERMS.L.toFixed(3), // ~23.040
  },
  geometricCenter: {
    N_half: +N_HALF.toExponential(5), // ~3.26724e9
    N_sub01: +N_SUB01.toExponential(5), // ~3.21318e11
    geometric_mean_half_sub01: +GEO_MEAN.toExponential(5), // ~3.24e10
    ratio_quarter_over_half: +(N_QUARTER / N_HALF).toFixed(3), // ~9.976
    ratio_sub01_over_quarter: +(N_SUB01 / N_QUARTER).toFixed(3), // ~9.858
    ratio_quarter_over_geomean: +(N_QUARTER / GEO_MEAN).toFixed(4), // ~1.006
    note:
      'The sigma = 0.25 crossing sits at the GEOMETRIC CENTER of the 0.5 -> 0.1 decade band ' +
      '(within ~0.6% of sqrt(N_half * N_sub01)); the near-equal split ratios ~9.98 and ~9.86 ' +
      'show the band is very nearly log-uniform in the sigma level.',
  },
  interpolationLadder: INTERP_LADDER,
  signedLeverage: {
    d_log_Nquarter_d_log_etrunc: +ELASTICITY_QUARTER.toFixed(6), // ~ -2.0868
    d_log_Nhalf_d_log_etrunc: +ELASTICITY_HALF.toFixed(6), // ~ -2.0984 (imp-96813)
    d_log_Nsub01_d_log_etrunc: +ELASTICITY_SUB01.toFixed(6), // ~ -2.0790 (imp-96813)
    note:
      'The intermediate elasticity ~ -2.087 lies STRICTLY BETWEEN the imp-96813 flanks ' +
      '(-2.098 at sigma = 0.5, -2.079 at sigma = 0.1). Across the ladder the magnitude rides ' +
      'MONOTONICALLY toward 2 as sigma falls and E_flow / E_trunc collapses (0.75: 1.4e-2 -> ' +
      '0.1: 3.5e-5). The arm interpolates smoothly toward the -2 inverse-square regime; the ' +
      'residual excess past -2 that survives where E_flow is negligible is the slowly-growing ' +
      'log T0 factor (imp-96813).',
  },
  floorSweep: FLOOR_SWEEP,
  floorSensitivity: {
    span_over_realistic_band: +(
      crossingForFloor(SIGMA_TARGET, E_TRUNC_BASE * 0.5) /
      crossingForFloor(SIGMA_TARGET, E_TRUNC_BASE * 2.0)
    ).toFixed(2), // ~18x over factor 0.5 .. 2
    span_over_full_sweep: +(Math.max(...SWEEP_NS) / Math.min(...SWEEP_NS)).toFixed(1), // ~510x
    note:
      'A tighter floor pushes the intermediate landmark to LARGER N (later decay): ~18x over a ' +
      'realistic +/-2x band and ~510x over the full 20x sweep. Like the flank landmarks the ' +
      'intermediate location is exact ONLY at the pinned floor 3.06e-5.',
  },
  verdict:
    'THE INTERMEDIATE sigma = 0.25 CROSSING SITS AT N_0.25 ~ 3.259e10 (the geometric center of ' +
    'the 0.5 -> 0.1 decade band, within ~0.6% of sqrt(N_half * N_sub01)) WITH ELASTICITY ~ ' +
    '-2.087, STRICTLY BETWEEN the imp-96813 flank landmarks (-2.098 at 0.5, -2.079 at 0.1). The ' +
    'elasticity rides MONOTONICALLY toward -2 as the sigma level falls and E_flow / E_trunc ' +
    'collapses (0.75: 1.4e-2 -> 0.1: 3.5e-5), so the decay arm interpolates SMOOTHLY toward the ' +
    '-2 inverse-square regime -- no intermediate anomaly; the residual excess past -2 that ' +
    'survives where E_flow is negligible is the slowly-growing log T0 factor. Like its ' +
    'neighbours the intermediate landmark is floor-sensitive (~510x swing over the 20x floor ' +
    'sweep), exact only at the pinned floor 3.06e-5. Measurement/sensitivity only; C_mb stays ' +
    'GUE-conditional (imp-486); no bound changes, no positivity, no bridge closure, no RH claim, ' +
    'NO QED. No refereed bound is changed.',
  isRigorous: false,
  citation:
    'imp-96813 (flank decay landmarks 0.5/0.1 and their ~ -2.09 elasticities); imp-96794 (peak ' +
    'share sigma_max leverage); imp-3444 (base landmark N_half 3.267235e9, pinned floor); ' +
    'imp-3406 (interior max, sigma curve); imp-2631 (E_trunc = 3.06e-5 fixed-strip floor); ' +
    'imp-398 (E_flow C_F prefactor); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping.',
};

export const IMP96916_SIGMA_QUARTER_CROSSING_ETRUNC_ELASTICITY_ASSERTIONS = [
  {
    // Reuse gate: factor 1.0 reproduces the imp-3444 / imp-96813 base flank landmark N_half.
    id: 'imp96916-reproduces-imp3444-half-landmark',
    description: 'factor 1.0 reproduces imp-3444 N_half ~ 3.267e9 (identical formulas to imp-96813)',
    holds: () => Math.abs(N_HALF - 3.267235e9) / 3.267235e9 < 1e-3,
  },
  {
    // F1: the sigma = 0.25 crossing sits strictly between the 0.5 and 0.1 flank landmarks.
    id: 'imp96916-quarter-between-flanks',
    description: 'N_0.25 lies strictly between N_half (~3.27e9) and N_sub01 (~3.21e11)',
    holds: () => N_QUARTER > N_HALF && N_QUARTER < N_SUB01,
  },
  {
    // F1: the crossing is near the geometric center of the decade band (within ~2%).
    id: 'imp96916-quarter-at-geometric-center',
    description: 'N_0.25 is within ~2% of the geometric mean sqrt(N_half * N_sub01) (nearly log-uniform band)',
    holds: () => Math.abs(N_QUARTER / GEO_MEAN - 1) < 0.02,
  },
  {
    // F2: the elasticity is near -2 (inverse-square regime).
    id: 'imp96916-elasticity-near-minus-two',
    description: 'd(log N_0.25)/d(log E_trunc) is near -2 (in [-2.3, -1.8])',
    holds: () => ELASTICITY_QUARTER > -2.3 && ELASTICITY_QUARTER < -1.8,
  },
  {
    // F2: the intermediate elasticity is STRICTLY between the flank elasticities (smooth interpolation).
    id: 'imp96916-elasticity-strictly-between-flanks',
    description: 'the sigma=0.25 elasticity lies strictly between the sigma=0.5 (-2.098) and sigma=0.1 (-2.079) values',
    holds: () => ELASTICITY_HALF < ELASTICITY_QUARTER && ELASTICITY_QUARTER < ELASTICITY_SUB01,
  },
  {
    // F2: monotone interpolation ladder -- |elasticity| decreases toward 2 as sigma falls.
    id: 'imp96916-elasticity-ladder-monotone-toward-two',
    description: 'across sigma 0.75 -> 0.1 the elasticity magnitude decreases monotonically toward 2 (smooth, no anomaly)',
    holds: () => {
      for (let i = 1; i < INTERP_LADDER.length; i++) {
        // sigma decreases along the ladder, so |elasticity| must decrease (elasticity rises toward -2).
        if (Math.abs(INTERP_LADDER[i].elasticity) >= Math.abs(INTERP_LADDER[i - 1].elasticity)) return false;
      }
      return true;
    },
  },
  {
    // F2: E_flow is negligible at the crossing (confirms the ~E_trunc^-2 mechanism dominates there).
    id: 'imp96916-eflow-negligible-at-quarter',
    description: 'E_flow / E_trunc at the sigma=0.25 crossing is < 1e-3 (E_flow has collapsed)',
    holds: () => QUARTER_TERMS.E_flow / E_TRUNC_BASE < 1e-3,
  },
  {
    // F3: floor-sensitive like its neighbours -- the full 20x floor sweep spans well over a decade in N.
    id: 'imp96916-quarter-floor-sensitive',
    description: 'over the 0.1x .. 2x floor sweep N_0.25 spans more than a decade (floor-sensitive landmark)',
    holds: () => Math.max(...SWEEP_NS) / Math.min(...SWEEP_NS) > 10,
  },
  {
    // F3 (direction): a tighter floor pushes the landmark to larger N (later decay).
    id: 'imp96916-tighter-floor-pushes-quarter-later',
    description: 'as the floor factor decreases, N_0.25 increases monotonically (later decay)',
    holds: () => {
      for (let i = 1; i < FLOOR_SWEEP.length; i++) {
        if (FLOOR_SWEEP[i].N_quarter <= FLOOR_SWEEP[i - 1].N_quarter) return false;
      }
      return true;
    },
  },
  {
    // Honesty gate: measurement/assessment only, smooth-interpolation verdict, no QED, no refereed bound is changed.
    id: 'imp96916-honesty-gate-no-qed',
    description: 'Assessment only: smooth-interpolation verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP96916_SIGMA_QUARTER_CROSSING_ETRUNC_ELASTICITY.isRigorous === false &&
      /interpolates SMOOTHLY/.test(IMP96916_SIGMA_QUARTER_CROSSING_ETRUNC_ELASTICITY.verdict) &&
      /NO QED/.test(IMP96916_SIGMA_QUARTER_CROSSING_ETRUNC_ELASTICITY.verdict) &&
      /refereed bound is changed/i.test(IMP96916_SIGMA_QUARTER_CROSSING_ETRUNC_ELASTICITY.verdict),
  },
];

for (const a of IMP96916_SIGMA_QUARTER_CROSSING_ETRUNC_ELASTICITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96916-sigma-quarter-crossing-etrunc-elasticity assertion failed: ${a.id}`,
    );
  }
}
