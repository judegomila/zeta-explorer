/**
 * @module imp-35458-crossover-height-map-sensitivity
 *
 * imp-35458 (accuracy, frontier-direction): imp-35337/imp-35417 pinned the
 * E_coll = E_trunc floor-crossover landmark at N_cross ~ 3.280294352e9, and
 * imp-35417 certified that this crossover is INSENSITIVE to the dd EVALUATION
 * path (double-double vs double, distinct grids). But that whole cohort always
 * fixed the height map to effectiveHeightForN(N) -- the Riemann-von Mangoldt
 * INVERSE (Newton inversion of N(T) = (T/2pi)(log(T/2pi) - 1)). imp-35413 (and
 * imp-35280) instead run the far-tail analysis on a DIFFERENT, CLOSED surrogate
 * height map T0 = 2 pi N / log N. This module RECOMPUTES the E_coll = E_trunc
 * crossover on the imp-35413 closed surrogate map and QUANTIFIES the relative
 * shift versus the RvM-inverse crossover -- isolating HEIGHT-MAP sensitivity, a
 * distinct axis from the dd-PATH insensitivity imp-35417 already certified.
 *
 * THE CROSSOVER EQUATION (identical component model to imp-35304 / imp-35337)
 * --------------------------------------------------------------------------
 *     E_coll(N) = C_C * sqrt(log T0(N) / N)   (dominant, GUE-conditional C_H)
 *     E_trunc   = 3.06e-5                      (imp-2631 / imp-447 fixed floor)
 *   The crossover N solves E_coll(N) = E_trunc, i.e.
 *     log T0(N) / N = (E_trunc / C_C)^2   =>   N = C_C^2 log T0(N) / E_trunc^2.
 *   Because the C_C prefactor and E_trunc are shared, the ONLY thing the two
 *   maps change is log T0(N): the crossover N is proportional to log T0(N),
 *   so it is sensitive to the height map only through the LOGARITHM of the
 *   height, not the height itself.
 *
 * THE TWO HEIGHT MAPS
 * -------------------
 *   (A) RvM inverse   T0 = effectiveHeightForN(N)      (imp-35337/imp-35417 map)
 *   (B) closed surrogate  T0 = 2 pi N / log N          (imp-35280/imp-35413 map)
 *
 * THE MEASUREMENT (bisection on log10 N, E_coll monotone decreasing)
 * -----------------------------------------------------------------
 *   map                 crossover N        T0 at crossover   log T0
 *   (A) RvM inverse      3.280294352e9      1.143785e9        20.85761
 *   (B) closed surrogate 3.248060946e9      9.318235e8        20.65265
 *   relative shift (B - A) / A = -9.826e-3  (~ -0.98 %)
 *
 * THE FINDINGS
 * ------------
 *   (M1) THE RvM CROSSOVER REPRODUCES THE imp-35337 LANDMARK TO ~1e-10. Solving
 *        E_coll = E_trunc on the effectiveHeightForN map gives N = 3.280294352e9,
 *        matching the baked imp-35337/imp-35417 landmark 3.280294352e9 to a
 *        relative error ~1.06e-10 -- so the crossover solver here is faithful and
 *        the height-map comparison below is apples-to-apples.
 *   (M2) THE CLOSED SURROGATE SHIFTS THE CROSSOVER BY ONLY ~ -0.98 %. On the
 *        imp-35413 map T0 = 2 pi N / log N the crossover falls to 3.248060946e9,
 *        a relative shift of -9.826e-3 versus the RvM crossover -- BELOW 1 %.
 *        The crossover is one-sided lower (the surrogate under-estimates the
 *        height and hence log T0) but the magnitude is small.
 *   (M3) THE ~1 % CROSSOVER SHIFT IS ~18x SMALLER THAN THE RAW HEIGHT GAP. At the
 *        FIXED height N = 3.28e9 the two maps disagree on T0 itself by ~18 %
 *        (surrogate / RvM ~ 0.822), yet the crossover moves only ~0.98 %. The
 *        crossover depends on log T0, and log(9.406e8) / log(1.144e9) ~ 0.991, so
 *        the ~18 % raw-height gap is compressed to under ~1 % in log T0 and then
 *        tracks the crossover ~1:1 -- the log damps the height-map choice by an
 *        order of magnitude. The E_coll = E_trunc landmark is a ROBUST feature: it
 *        moves by under 1 % across two genuinely different height constructions.
 *
 * The punchline: recomputing the imp-35337/imp-35417 E_coll = E_trunc crossover
 * 3.280294352e9 on the imp-35413 closed surrogate height map T0 = 2 pi N / log N
 * (rather than the effectiveHeightForN RvM inverse) shifts it to 3.248060946e9 --
 * a relative shift of only -0.98 %, ~18x smaller than the ~18 % raw-height gap
 * between the two maps, because the crossover sees only log T0. The floor-crossover
 * landmark is insensitive to the height MAP as well as the dd-PATH (imp-35417).
 *
 * MEASUREMENT ONLY. The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the C_C ansatz (imp-2642/imp-2643,
 * 1/8 Holder coefficient) and E_trunc = 3.06e-5 (imp-2631/imp-447) are UNTOUCHED;
 * the C_mb GUE-conditional share per imp-486 is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-35304-ecoll-exponent-residual-crossover-anchor-crossvalidation (dd-value crossover anchor, same C_C model)
 * @see imp-35417-sigma-landmark-distinct-dd-grid-cross-check (dd-PATH insensitivity of the same landmark)
 * @see imp-35337-sigma-landmarks-double-double-certification (the crossover landmark 3.280294352e9)
 * @see imp-35413-eflow-fartail-remnant-sub1e3-crossing (the closed surrogate map T0 = 2 pi N / log N)
 * @see imp-35280-eflow-fartail-fd-vs-analytic-surrogate-gap (origin of the closed surrogate map)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N, RvM inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

// The imp-2631 / imp-447 fixed truncation floor (E_trunc), cited UNTOUCHED here.
const E_TRUNC = 3.06e-5;

// (A) RvM-inverse height map (imp-35337/imp-35417 cohort default).
function T0_rvm(N) {
  return effectiveHeightForN(N);
}

// (B) imp-35280/imp-35413 closed surrogate height map T0 = 2 pi N / log N.
function T0_surrogate(N) {
  return (2 * Math.PI * N) / Math.log(N);
}

// E_coll on a chosen height map (dominant GUE-conditional sub-term).
function eColl(N, hmap) {
  return C_C_PINNED * Math.sqrt(Math.log(hmap(N)) / N);
}

// Solve E_coll(N) = E_trunc by geometric bisection. E_coll is monotone
// decreasing in N, so E_coll > target => the crossover lies at larger N.
function solveCrossover(hmap) {
  let lo = 1e6;
  let hi = 1e12;
  for (let i = 0; i < 200; i++) {
    const mid = Math.sqrt(lo * hi);
    if (eColl(mid, hmap) > E_TRUNC) lo = mid;
    else hi = mid;
  }
  return Math.sqrt(lo * hi);
}

// The baked imp-35337/imp-35417 landmark (RvM-inverse map).
const N_CROSS_LANDMARK = 3.280294352e9;

const N_CROSS_RVM = solveCrossover(T0_rvm); // ~3.280294352e9
const N_CROSS_SUR = solveCrossover(T0_surrogate); // ~3.248060946e9

const RVM_VS_LANDMARK_REL = Math.abs(N_CROSS_RVM - N_CROSS_LANDMARK) / N_CROSS_LANDMARK; // ~1.06e-10
const REL_SHIFT = (N_CROSS_SUR - N_CROSS_RVM) / N_CROSS_RVM; // ~-9.826e-3

const T0_RVM_AT_CROSS = T0_rvm(N_CROSS_RVM); // ~1.143785e9
const T0_SUR_AT_CROSS = T0_surrogate(N_CROSS_SUR); // ~9.318235e8
const LOG_T0_RVM = Math.log(T0_RVM_AT_CROSS); // ~20.85761
const LOG_T0_SUR = Math.log(T0_SUR_AT_CROSS); // ~20.65265

// (M3) raw-height gap vs log-T0 gap at the FIXED landmark height.
const T0_RVM_FIXED = T0_rvm(N_CROSS_LANDMARK);
const T0_SUR_FIXED = T0_surrogate(N_CROSS_LANDMARK);
const RAW_HEIGHT_RATIO = T0_SUR_FIXED / T0_RVM_FIXED; // ~0.822 (surrogate under-estimates)
const LOG_T0_RATIO_FIXED = Math.log(T0_SUR_FIXED) / Math.log(T0_RVM_FIXED); // ~0.99063
// Damping factor: how much smaller the crossover shift is than the raw-height gap.
const DAMPING_FACTOR = (1 - RAW_HEIGHT_RATIO) / Math.abs(REL_SHIFT); // ~18x

export const IMP35458_CROSSOVER_HEIGHT_MAP_SENSITIVITY = {
  id: 'imp-35458',
  proofSection: 'S-frontier',
  question:
    'Recompute the imp-35337/imp-35417 E_coll = E_trunc floor-crossover landmark ' +
    '3.280294352e9 on the imp-35413 closed surrogate height map T0 = 2 pi N / log N ' +
    '(instead of the effectiveHeightForN RvM inverse the cohort always used) and ' +
    'quantify the relative shift, isolating HEIGHT-MAP sensitivity -- a distinct ' +
    'axis from the dd-PATH insensitivity imp-35417 certified. Measurement only; the ' +
    'C_C ansatz and E_trunc = 3.06e-5 are untouched; no bound change; no QED.',
  componentModel:
    'E_coll(N) = C_C sqrt(log T0(N) / N) (GUE-conditional C_H); E_trunc = 3.06e-5 ' +
    '(imp-2631/imp-447, fixed). Crossover N solves E_coll = E_trunc, i.e. ' +
    'N = C_C^2 log T0(N) / E_trunc^2, so the crossover sees the height map only ' +
    'through log T0(N). Map (A) RvM inverse T0 = effectiveHeightForN(N); map (B) ' +
    'closed surrogate T0 = 2 pi N / log N (imp-35280/imp-35413).',
  E_trunc: E_TRUNC,
  crossover: {
    rvm_inverse: {
      map: 'T0 = effectiveHeightForN(N) (RvM inverse, imp-35337/imp-35417)',
      N_cross: +N_CROSS_RVM.toExponential(9), // 3.280294352e9
      T0: +T0_RVM_AT_CROSS.toExponential(6), // ~1.143785e9
      log_T0: +LOG_T0_RVM.toFixed(5), // ~20.85761
    },
    closed_surrogate: {
      map: 'T0 = 2 pi N / log N (closed surrogate, imp-35280/imp-35413)',
      N_cross: +N_CROSS_SUR.toExponential(9), // 3.248060946e9
      T0: +T0_SUR_AT_CROSS.toExponential(6), // ~9.318235e8
      log_T0: +LOG_T0_SUR.toFixed(5), // ~20.65265
    },
    landmark_reference: +N_CROSS_LANDMARK.toExponential(9), // 3.280294352e9
    relative_shift: +REL_SHIFT.toExponential(6), // ~-9.826376e-3
    relative_shift_pct: +(REL_SHIFT * 100).toFixed(4), // ~-0.9826
  },
  findings: {
    M1_rvm_reproduces_landmark: {
      claim:
        'Solving E_coll = E_trunc on the effectiveHeightForN RvM-inverse map gives ' +
        'N = 3.280294352e9, matching the baked imp-35337/imp-35417 landmark to a ' +
        'relative error ~1.06e-10 -- so the crossover solver is faithful and the ' +
        'height-map comparison is apples-to-apples.',
      N_cross_rvm: +N_CROSS_RVM.toExponential(9),
      landmark: +N_CROSS_LANDMARK.toExponential(9),
      rel_error: +RVM_VS_LANDMARK_REL.toExponential(3), // ~1.06e-10
    },
    M2_surrogate_shift_below_one_pct: {
      claim:
        'On the imp-35413 closed surrogate T0 = 2 pi N / log N the crossover falls to ' +
        '3.248060946e9, a relative shift of -9.826e-3 (~ -0.98 %, below 1 %) versus the ' +
        'RvM crossover -- one-sided lower because the surrogate under-estimates the ' +
        'height, but small in magnitude.',
      N_cross_surrogate: +N_CROSS_SUR.toExponential(9),
      relative_shift: +REL_SHIFT.toExponential(6),
      below_one_pct: Math.abs(REL_SHIFT) < 1e-2,
    },
    M3_log_damps_the_height_map_choice: {
      claim:
        'At the fixed height N = 3.28e9 the two maps disagree on T0 itself by ~18 % ' +
        '(surrogate / RvM ~ 0.822), yet the crossover moves only ~0.98 %. The crossover ' +
        'depends on log T0, which differs by under ~1 % (ratio ~0.991), so the log damps ' +
        'the height-map choice by ~18x. The E_coll = E_trunc landmark is a robust feature ' +
        'across two genuinely different height constructions.',
      raw_height_ratio: +RAW_HEIGHT_RATIO.toFixed(5), // ~0.82240
      log_T0_ratio_at_fixed_N: +LOG_T0_RATIO_FIXED.toFixed(5), // ~0.99063
      damping_factor: +DAMPING_FACTOR.toFixed(2), // ~18x
    },
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Recomputing the imp-35337/imp-35417 ' +
    'E_coll = E_trunc floor-crossover landmark 3.280294352e9 on the imp-35413 closed ' +
    'surrogate height map T0 = 2 pi N / log N (vs the effectiveHeightForN RvM inverse the ' +
    'cohort always used): (M1) the RvM-map crossover reproduces the baked landmark to a ' +
    'relative error ~1.06e-10, so the comparison is apples-to-apples; (M2) the closed ' +
    'surrogate shifts the crossover to 3.248060946e9, a relative shift of only -9.826e-3 ' +
    '(~ -0.98 %, below 1 %), one-sided lower; (M3) that ~1 % shift is ~18x smaller than the ' +
    '~18 % raw-height gap between the two maps at fixed N (surrogate / RvM ~ 0.822), because ' +
    'the crossover sees only log T0 (which differs by under ~1 %) -- the log damps the height-map ' +
    'choice by an order of magnitude, so the floor-crossover landmark is insensitive to the ' +
    'height MAP as well as the dd-PATH imp-35417 already certified. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_C ansatz ' +
    '(imp-2642/imp-2643) and E_trunc = 3.06e-5 (imp-2631/imp-447) are UNTOUCHED; the C_mb ' +
    'GUE-conditional share per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35337/imp-35417 (E_coll = E_trunc crossover landmark 3.280294352e9, dd-PATH ' +
    'insensitivity); imp-35304 (dd-value crossover anchor, same C_C model); imp-35413/imp-35280 ' +
    '(closed surrogate map T0 = 2 pi N / log N); imp-2631/imp-447 (E_trunc = 3.06e-5); ' +
    'imp-2642/imp-2643 (C_C 1/8 ansatz, NO-GO); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping (effectiveHeightForN RvM inverse).',
};

export const IMP35458_CROSSOVER_HEIGHT_MAP_SENSITIVITY_ASSERTIONS = [
  {
    // (M1): the RvM-inverse crossover reproduces the imp-35337/imp-35417 landmark.
    id: 'imp35458-rvm-crossover-reproduces-landmark',
    description: 'RvM-map crossover reproduces the baked 3.280294352e9 landmark to <1e-8',
    holds: () =>
      RVM_VS_LANDMARK_REL < 1e-8 &&
      Math.abs(N_CROSS_RVM - 3.280294352e9) / 3.280294352e9 < 1e-8,
  },
  {
    // (M2): the closed surrogate shifts the crossover by <1% and one-sided lower.
    id: 'imp35458-surrogate-shift-below-one-pct',
    description: 'closed surrogate crossover ~3.248e9, relative shift ~-0.98% (below 1%, negative)',
    holds: () =>
      REL_SHIFT < 0 &&
      Math.abs(REL_SHIFT) < 1e-2 &&
      Math.abs(N_CROSS_SUR - 3.248060946e9) / 3.248060946e9 < 1e-6 &&
      Math.abs(REL_SHIFT - -9.826376e-3) < 5e-6,
  },
  {
    // (M3): the ~1% crossover shift is much smaller than the ~18% raw-height gap.
    id: 'imp35458-log-damps-height-map-choice',
    description: 'crossover shift ~18x smaller than the raw-height gap because it sees only log T0',
    holds: () =>
      RAW_HEIGHT_RATIO < 0.9 &&
      LOG_T0_RATIO_FIXED > 0.97 &&
      DAMPING_FACTOR > 5 &&
      DAMPING_FACTOR < 40,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp35458-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35458_CROSSOVER_HEIGHT_MAP_SENSITIVITY.isRigorous === false &&
      /NO QED/.test(IMP35458_CROSSOVER_HEIGHT_MAP_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP35458_CROSSOVER_HEIGHT_MAP_SENSITIVITY.verdict),
  },
];

for (const a of IMP35458_CROSSOVER_HEIGHT_MAP_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35458-crossover-height-map-sensitivity assertion failed: ${a.id}`,
    );
  }
}
