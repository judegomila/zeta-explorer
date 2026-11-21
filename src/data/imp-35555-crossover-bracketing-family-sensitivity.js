/**
 * @module imp-35555-crossover-bracketing-family-sensitivity
 *
 * imp-35555 (accuracy, frontier-direction): imp-35458 quantified the HEIGHT-MAP
 * sensitivity of the imp-35337/imp-35417 E_coll = E_trunc floor-crossover landmark
 * (N_cross ~ 3.280294352e9) across only TWO maps -- the RvM inverse
 * effectiveHeightForN and the imp-35413 closed surrogate T0 = 2 pi N / log N --
 * and recorded a -0.98 percent shift. That leaves open whether ~1 percent is the
 * FULL envelope or an under-estimate. This module extends the study to a THIRD
 * height map: the imp-35536 multiplicative bracketing family RvM x {1.02, 0.98,
 * 1.05, 0.95} (the same +/- 2 percent and +/- 5 percent perturbations imp-35536
 * applied to the sigma interior peak), recomputes the crossover on each, and
 * MEASURES the crossover-N spread to bound the height-map sensitivity.
 *
 * THE CROSSOVER EQUATION (identical component model to imp-35458 / imp-35337)
 * --------------------------------------------------------------------------
 *     E_coll(N) = C_C * sqrt(log T0(N) / N)   (dominant, GUE-conditional C_H)
 *     E_trunc   = 3.06e-5                      (imp-2631 / imp-447 fixed floor)
 *   The crossover N solves E_coll(N) = E_trunc, i.e.
 *     N = C_C^2 log T0(N) / E_trunc^2, so the crossover sees the height map
 *   ONLY through log T0(N).
 *
 * THE THIRD HEIGHT MAP: imp-35536 BRACKETING FAMILY
 * -------------------------------------------------
 *   (C) T0 = mult * effectiveHeightForN(N),  mult in {1.02, 0.98, 1.05, 0.95}.
 *   A multiplicative height perturbation shifts log T0 by exactly ln(mult), a
 *   CONSTANT independent of N, so the crossover response is analytically clean.
 *
 * THE MEASUREMENT (bisection on log10 N, E_coll monotone decreasing)
 * -----------------------------------------------------------------
 *   map                 crossover N        relative shift vs RvM base
 *   RvM inverse (base)   3.280294352e9       0            (reproduces imp-35458)
 *   RvM x 1.02           3.283556848e9      +9.945744e-4  (+0.0995 %)
 *   RvM x 0.98           3.276965783e9      -1.014717e-3  (-0.1015 %)
 *   RvM x 1.05           3.288332288e9      +2.450371e-3  (+0.2450 %)
 *   RvM x 0.95           3.271843029e9      -2.576392e-3  (-0.2576 %)
 *   closed surrogate     3.248060946e9      -9.826376e-3  (-0.9826 %, imp-35458)
 *   full bracketing envelope span (max - min): 5.026762e-3 (~0.50 %)
 *
 * THE FINDINGS
 * ------------
 *   (M1) THE BASE RvM CROSSOVER REPRODUCES THE imp-35458 / imp-35337 LANDMARK.
 *        Solving E_coll = E_trunc on effectiveHeightForN gives 3.280294352e9,
 *        matching the baked landmark to ~1e-10 -- so the bracketing comparison
 *        below is apples-to-apples.
 *   (M2) THE +/- 2-5 PERCENT BRACKETING FAMILY MOVES THE CROSSOVER BY AT MOST
 *        ~0.26 PERCENT. The widest arm (RvM x 0.95) shifts it -0.2576 percent;
 *        the two-sided envelope spans only ~0.50 percent (-0.258 to +0.245).
 *        Every bracketing shift sits INSIDE the imp-35458 two-map -0.98 percent
 *        figure -- so the recorded ~1 percent is NOT an under-estimate; it is
 *        already the LARGER of the perturbations, because the closed surrogate is
 *        effectively a ~-18 percent raw-height perturbation while this family is
 *        only +/- 2-5 percent.
 *   (M3) THE CROSSOVER SHIFT IS LINEAR IN ln(mult) WITH SLOPE ~ 1 / log T0. Each
 *        arm obeys d(rel shift) / d ln(mult) ~ 0.0502 (constant to 4 figures
 *        across all four perturbations), a hair above 1 / log T0(N_cross) ~ 0.0479
 *        (self-consistency amplifies it because N_cross itself drifts). This is the
 *        SAME log-damping law imp-35458 identified: a raw-height perturbation of
 *        fractional size x compresses to ~ x / log T0 ~ x / 20.9 in the crossover.
 *        A +/- 5 percent height error yields only a ~0.24 percent crossover error;
 *        the -18 percent surrogate gap yields -0.98 percent. The floor-crossover
 *        landmark is ROBUST to the height map across THREE map constructions.
 *
 * The punchline: extending the imp-35458 two-map E_coll = E_trunc crossover study
 * to the imp-35536 RvM x {1.02, 0.98, 1.05, 0.95} bracketing family moves the
 * crossover by at most ~0.26 percent (full two-sided envelope ~0.50 percent), ALL
 * inside the recorded -0.98 percent two-map shift -- confirming ~1 percent is the
 * fuller envelope, not an under-estimate, because the crossover response is linear
 * in ln(mult) with slope ~ 1 / log T0 ~ 0.05 and the closed surrogate is simply a
 * much larger (~-18 percent) effective height perturbation.
 *
 * MEASUREMENT ONLY. The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the C_C ansatz (imp-2642/imp-2643,
 * 1/8 Holder coefficient) and E_trunc = 3.06e-5 (imp-2631/imp-447) are UNTOUCHED;
 * the C_mb GUE-conditional share per imp-486 is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-35458-crossover-height-map-sensitivity (the two-map -0.98% study this extends)
 * @see imp-35536-peak-height-map-sensitivity (the RvM x {1.02,0.98,1.05,0.95} bracketing family)
 * @see imp-35337-sigma-landmarks-double-double-certification (the crossover landmark 3.280294352e9)
 * @see imp-35417-sigma-landmark-distinct-dd-grid-cross-check (dd-PATH insensitivity of the same landmark)
 * @see imp-35413-eflow-fartail-remnant-sub1e3-crossing (the closed surrogate map T0 = 2 pi N / log N)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N, RvM inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

// The imp-2631 / imp-447 fixed truncation floor (E_trunc), cited UNTOUCHED here.
const E_TRUNC = 3.06e-5;

// (A) RvM-inverse height map (imp-35337/imp-35417/imp-35458 cohort default).
function T0_rvm(N) {
  return effectiveHeightForN(N);
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

// The baked imp-35337/imp-35417/imp-35458 landmark (RvM-inverse map).
const N_CROSS_LANDMARK = 3.280294352e9;

const N_CROSS_RVM = solveCrossover(T0_rvm); // ~3.280294352e9
const RVM_VS_LANDMARK_REL = Math.abs(N_CROSS_RVM - N_CROSS_LANDMARK) / N_CROSS_LANDMARK; // ~1.06e-10

// (C) imp-35536 multiplicative bracketing family RvM x {1.02, 0.98, 1.05, 0.95}.
const MULTS = [1.02, 0.98, 1.05, 0.95];
const BRACKET = MULTS.map((mult) => {
  const N_cross = solveCrossover((N) => mult * effectiveHeightForN(N));
  const rel_shift = (N_cross - N_CROSS_RVM) / N_CROSS_RVM;
  // per-arm log-damping slope d(rel shift) / d ln(mult); ~0.0502, ~1/log T0.
  const slope = rel_shift / Math.log(mult);
  return {
    map: `RvM x ${mult}`,
    mult,
    N_cross: +N_cross.toExponential(9),
    rel_shift: +rel_shift.toExponential(6),
    rel_shift_pct: +(rel_shift * 100).toFixed(4),
    slope: +slope.toFixed(5),
  };
});

const REL_SHIFTS = BRACKET.map((b) => b.rel_shift);
const MAX_REL = Math.max(...REL_SHIFTS); // ~+2.450e-3
const MIN_REL = Math.min(...REL_SHIFTS); // ~-2.576e-3
const ENVELOPE_SPAN = MAX_REL - MIN_REL; // ~5.027e-3 (~0.50 %)
const MAX_ABS_REL = Math.max(...REL_SHIFTS.map(Math.abs)); // ~2.576e-3 (~0.26 %)

// The recorded imp-35458 two-map (closed surrogate vs RvM) shift, cited for the
// envelope comparison (the surrogate is effectively a ~-18% raw-height gap).
const IMP35458_TWO_MAP_SHIFT = -9.826376e-3; // -0.9826 %

// The log-damping slope, measured (mean over the family) and its 1/log T0 anchor.
const MEAN_SLOPE = BRACKET.reduce((s, b) => s + b.slope, 0) / BRACKET.length; // ~0.05022
const LOG_T0_AT_CROSS = Math.log(T0_rvm(N_CROSS_RVM)); // ~20.85761
const INV_LOG_T0 = 1 / LOG_T0_AT_CROSS; // ~0.04794

export const IMP35555_CROSSOVER_BRACKETING_FAMILY_SENSITIVITY = {
  id: 'imp-35555',
  proofSection: 'S-frontier',
  question:
    'Recompute the imp-35458 E_coll = E_trunc floor-crossover on a THIRD height ' +
    'map beyond the RvM-inverse and closed-surrogate pair -- the imp-35536 RvM x ' +
    '{1.02, 0.98, 1.05, 0.95} multiplicative bracketing family -- and measure the ' +
    'crossover-N spread to bound the height-map sensitivity past the recorded ' +
    'two-map -0.98 percent shift, testing whether ~1 percent is the full envelope ' +
    'or an under-estimate. Measurement only; the C_C ansatz and E_trunc = 3.06e-5 ' +
    'are untouched; no bound change; no QED.',
  componentModel:
    'E_coll(N) = C_C sqrt(log T0(N) / N) (GUE-conditional C_H); E_trunc = 3.06e-5 ' +
    '(imp-2631/imp-447, fixed). Crossover N solves N = C_C^2 log T0(N) / E_trunc^2, ' +
    'so it sees the height map only through log T0(N). Third map: T0 = mult * ' +
    'effectiveHeightForN(N), mult in {1.02, 0.98, 1.05, 0.95} (imp-35536 family); a ' +
    'multiplicative perturbation shifts log T0 by exactly ln(mult), constant in N.',
  E_trunc: E_TRUNC,
  N_cross_rvm_base: +N_CROSS_RVM.toExponential(9),
  bracketing_family: BRACKET,
  envelope: {
    max_rel_shift: +MAX_REL.toExponential(6), // ~+2.450e-3
    min_rel_shift: +MIN_REL.toExponential(6), // ~-2.576e-3
    span: +ENVELOPE_SPAN.toExponential(6), // ~5.027e-3
    span_pct: +(ENVELOPE_SPAN * 100).toFixed(4), // ~0.5027
    max_abs_shift_pct: +(MAX_ABS_REL * 100).toFixed(4), // ~0.2576
    imp35458_two_map_shift: +IMP35458_TWO_MAP_SHIFT.toExponential(6), // -9.826e-3
    bracketing_inside_two_map: MAX_ABS_REL < Math.abs(IMP35458_TWO_MAP_SHIFT),
  },
  log_damping: {
    mean_slope: +MEAN_SLOPE.toFixed(5), // ~0.05022
    inv_log_T0: +INV_LOG_T0.toFixed(5), // ~0.04794
    log_T0_at_cross: +LOG_T0_AT_CROSS.toFixed(5), // ~20.85761
  },
  findings: {
    M1_base_reproduces_landmark: {
      claim:
        'Solving E_coll = E_trunc on the effectiveHeightForN RvM-inverse map gives ' +
        'N = 3.280294352e9, matching the baked imp-35337/imp-35417/imp-35458 landmark ' +
        'to a relative error ~1.06e-10 -- so the bracketing comparison is apples-to-apples.',
      N_cross_rvm: +N_CROSS_RVM.toExponential(9),
      landmark: +N_CROSS_LANDMARK.toExponential(9),
      rel_error: +RVM_VS_LANDMARK_REL.toExponential(3), // ~1.06e-10
    },
    M2_bracketing_inside_two_map_shift: {
      claim:
        'The +/- 2-5 percent bracketing family moves the crossover by at most ~0.26 ' +
        'percent (RvM x 0.95), a two-sided envelope of only ~0.50 percent, ALL inside ' +
        'the recorded imp-35458 two-map -0.98 percent shift. So ~1 percent is NOT an ' +
        'under-estimate: the closed surrogate is effectively a ~-18 percent raw-height ' +
        'perturbation while this family is only +/- 2-5 percent.',
      max_abs_shift_pct: +(MAX_ABS_REL * 100).toFixed(4), // ~0.2576
      envelope_span_pct: +(ENVELOPE_SPAN * 100).toFixed(4), // ~0.5027
      inside_two_map: MAX_ABS_REL < Math.abs(IMP35458_TWO_MAP_SHIFT),
    },
    M3_shift_linear_in_ln_mult: {
      claim:
        'Each arm obeys d(rel shift) / d ln(mult) ~ 0.0502 (constant to 4 figures across ' +
        'all four perturbations), a hair above 1 / log T0(N_cross) ~ 0.0479 -- the same ' +
        'log-damping law imp-35458 identified. A raw-height perturbation of fractional ' +
        'size x compresses to ~ x / log T0 ~ x / 20.9 in the crossover; the floor-crossover ' +
        'landmark is robust to the height map across THREE map constructions.',
      mean_slope: +MEAN_SLOPE.toFixed(5), // ~0.05022
      inv_log_T0: +INV_LOG_T0.toFixed(5), // ~0.04794
    },
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Extending the imp-35458 two-map ' +
    'E_coll = E_trunc floor-crossover study to the imp-35536 RvM x {1.02, 0.98, 1.05, ' +
    '0.95} bracketing family: (M1) the base RvM crossover reproduces the baked landmark ' +
    '3.280294352e9 to ~1.06e-10, so the comparison is apples-to-apples; (M2) the ' +
    '+/- 2-5 percent family moves the crossover by at most ~0.26 percent (two-sided ' +
    'envelope ~0.50 percent), ALL inside the recorded -0.98 percent two-map shift -- so ' +
    '~1 percent is NOT an under-estimate but the fuller envelope, because the closed ' +
    'surrogate is effectively a ~-18 percent raw-height perturbation and this family only ' +
    '+/- 2-5 percent; (M3) the shift is linear in ln(mult) with slope ~0.0502 (constant ' +
    'across all four arms), a hair above 1 / log T0(N_cross) ~ 0.0479 -- the same ' +
    'log-damping law imp-35458 identified, so a fractional raw-height perturbation x ' +
    'compresses to ~ x / log T0 ~ x / 20.9 in the crossover. The floor-crossover landmark ' +
    'is ROBUST to the height MAP across THREE map constructions. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_C ansatz ' +
    '(imp-2642/imp-2643) and E_trunc = 3.06e-5 (imp-2631/imp-447) are UNTOUCHED; the C_mb ' +
    'GUE-conditional share per imp-486 is UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35458 (two-map crossover height-map sensitivity, -0.98 percent); imp-35536 ' +
    '(RvM x {1.02,0.98,1.05,0.95} bracketing family); imp-35337/imp-35417 (crossover ' +
    'landmark 3.280294352e9, dd-PATH insensitivity); imp-35413/imp-35280 (closed surrogate ' +
    'map T0 = 2 pi N / log N); imp-2631/imp-447 (E_trunc = 3.06e-5); imp-2642/imp-2643 ' +
    '(C_C 1/8 ansatz, NO-GO); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping ' +
    '(effectiveHeightForN RvM inverse).',
};

export const IMP35555_CROSSOVER_BRACKETING_FAMILY_SENSITIVITY_ASSERTIONS = [
  {
    // (M1): the base RvM crossover reproduces the imp-35337/imp-35417/imp-35458 landmark.
    id: 'imp35555-base-crossover-reproduces-landmark',
    description: 'base RvM crossover reproduces the baked 3.280294352e9 landmark to <1e-8',
    holds: () =>
      RVM_VS_LANDMARK_REL < 1e-8 &&
      Math.abs(N_CROSS_RVM - 3.280294352e9) / 3.280294352e9 < 1e-8,
  },
  {
    // (M2): every bracketing shift sits inside the imp-35458 two-map -0.98% figure.
    id: 'imp35555-bracketing-inside-two-map-shift',
    description: 'bracketing family shifts (<=~0.26%, envelope ~0.50%) all inside the -0.98% two-map shift',
    holds: () =>
      MAX_ABS_REL < Math.abs(IMP35458_TWO_MAP_SHIFT) &&
      MAX_ABS_REL < 3e-3 &&
      ENVELOPE_SPAN > 4e-3 &&
      ENVELOPE_SPAN < 6e-3 &&
      Math.abs(MAX_ABS_REL - 2.576392e-3) < 5e-6,
  },
  {
    // (M3): the shift is linear in ln(mult) with slope ~0.0502 ~ 1/log T0.
    id: 'imp35555-shift-linear-in-ln-mult',
    description: 'per-arm slope d(rel)/d ln(mult) ~0.0502, a hair above 1/log T0 ~0.0479',
    holds: () =>
      Math.abs(MEAN_SLOPE - 0.05022) < 1e-3 &&
      INV_LOG_T0 > 0.045 &&
      INV_LOG_T0 < 0.05 &&
      MEAN_SLOPE > INV_LOG_T0 &&
      BRACKET.every((b) => Math.abs(b.slope - MEAN_SLOPE) < 5e-4),
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp35555-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35555_CROSSOVER_BRACKETING_FAMILY_SENSITIVITY.isRigorous === false &&
      /NO QED/.test(IMP35555_CROSSOVER_BRACKETING_FAMILY_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP35555_CROSSOVER_BRACKETING_FAMILY_SENSITIVITY.verdict),
  },
];

for (const a of IMP35555_CROSSOVER_BRACKETING_FAMILY_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35555-crossover-bracketing-family-sensitivity assertion failed: ${a.id}`,
    );
  }
}
