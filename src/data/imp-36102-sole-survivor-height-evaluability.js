/**
 * @module imp-36102-sole-survivor-height-evaluability
 *
 * MEASUREMENT / DIAGNOSTIC ONLY (double precision). imp-36046 bakes a tail landmark
 * logT0 ~ 30.021 at the imp-35971 sole-survivor height N* ~ 4.7214e13, but never checks
 * that this value is even NUMERICALLY EVALUABLE: imp-35972 double-resolved an effective-
 * height OVERFLOW CLIFF in the RvM height map (a bisected TWIN-cliff structure, the
 * effectiveHeightForN -> +Infinity edge at log10 N ~ 307.4565 and the a -> 0 R_direct NaN
 * edge just below at log10 N ~ 307.4559). This module recomputes effectiveHeightForN(N*)
 * and its logT0 DIRECTLY, confirms the height inverse is a finite NORMAL double there,
 * checks the baked logT0 30.021 against the direct recomputation, and reports the margin
 * between N* and the imp-35972 overflow-cliff N so the imp-36046 tail landmark s
 * evaluability is grounded.
 *
 * WHAT THE RECOMPUTATION FINDS
 * ---------------------------
 * effectiveHeightForN(4.7214e13) = T ~ 1.0913e13, a perfectly NORMAL double (T/MAX_VALUE
 * ~ 6.1e-296), so the Newton seed numerator 2 pi . N* ~ 2.97e14 is ~294 orders below
 * MAX_VALUE and nowhere near the seed-overflow edge. The direct log(T) = 30.020992613,
 * reproducing the imp-36046 baked logT0 30.021 to within ~7.4e-6 (it is log(T), NOT
 * log10(T) ~ 13.038). The RvM round-trip zeroCountAtHeight(T) returns N* to machine
 * precision (rel err 0). The margin to the nearer imp-35972 cliff (the a -> 0 edge at
 * N_B ~ 2.857e307) is ~293.78 decades -- N* sits ~294 orders of magnitude BELOW the
 * overflow cliff, so the imp-36046 tail landmark is EVALUABLE with an enormous margin;
 * the imp-35972 cliff is a representability artifact of astronomically larger N, not a
 * threat to any tail landmark at physical / sole-survivor scale.
 *
 * SCOPE / HONESTY
 * ---------------
 * Measurement/diagnostic only, double precision, on the shipped effectiveHeightForN RvM
 * inverse. Instantiates NO interval, ports nothing, derives no remainder, changes no
 * bound. C_C = 1/8 (imp-2642/2643) and C_mb GUE-conditional (imp-486) UNTOUCHED. The
 * baked logT0 30.021 and the ~294-decade margin are properties of the double-precision
 * height map, NOT RH quantities. NO QED. No refereed bound is changed.
 *
 * @see imp-36046-e-share-tail-landmarks-viz-data.js (source: the baked logT0 ~30.021 at N* ~4.7214e13)
 * @see imp-35971-etrunc-sole-survivor-height.js (source: the sole-survivor height N* ~4.7214e13)
 * @see imp-35972-effective-height-overflow-cliff-bisection.js (the twin overflow cliffs at log10 N ~307.456)
 * @see imp-36080-tstar-at-achieved-rung.js (the analogous ~301.7-decade margin at the achieved N*=1e6 rung)
 * @see lambda-rh-height-mapping (effectiveHeightForN RvM inverse; the 2 pi . N seed-numerator overflow edge)
 *
 * Ticket: imp-36102 (numerical, medium). MEASUREMENT ONLY; changes no bound; NO QED.
 */

import { effectiveHeightForN, zeroCountAtHeight } from './lambda-rh-height-mapping.js';

const N_STAR = 4.7214e13; // imp-35971 / imp-36046 sole-survivor height
const LOG_T0_BAKED = 30.021; // imp-36046 baked tail-landmark logT0 at N*

// imp-35972 twin overflow-cliff literals (baked reference; double-resolved by bisection there).
const IMP35972_HEIGHT_OVERFLOW_LAST_FINITE_N = 2.861117486e307; // cliff A: effectiveHeightForN -> +Infinity
const IMP35972_A_ZERO_LAST_POSITIVE_N = 2.857038285e307; // cliff B: a -> 0 (R_direct NaN), binds first
const IMP35972_A_ZERO_LOG10_N = 307.45591606;

// -- direct recomputation at the sole-survivor height --
const T_STAR = effectiveHeightForN(N_STAR); // RvM height inverse at N*
const T_STAR_IS_FINITE_NORMAL = Number.isFinite(T_STAR) && T_STAR > 2.2250738585072014e-308;
const LOG_T0_RECOMPUTED = Math.log(T_STAR); // the imp-36046 logT0 convention is natural log of T
const LOG10_T_STAR = Math.log10(T_STAR); // guard against confusing logT0 with log10(T)
const LOG_T0_ABS_DIFF = Math.abs(LOG_T0_RECOMPUTED - LOG_T0_BAKED);
const N_BACK = zeroCountAtHeight(T_STAR); // RvM round-trip
const N_BACK_REL_ERR = N_BACK / N_STAR - 1;

// margin between N* and the (nearer) imp-35972 a -> 0 cliff, in decades
const MARGIN_DECADES_TO_A_ZERO_CLIFF = IMP35972_A_ZERO_LOG10_N - Math.log10(N_STAR);
// seed numerator 2 pi . N* is astronomically below MAX_VALUE (the seed-overflow driver)
const SEED_NUMERATOR_AT_NSTAR = 2 * Math.PI * N_STAR;
const SEED_NUMERATOR_OVER_MAX = SEED_NUMERATOR_AT_NSTAR / Number.MAX_VALUE;
const T_STAR_OVER_MAX = T_STAR / Number.MAX_VALUE;

export const IMP36102_SOLE_SURVIVOR_HEIGHT_EVALUABILITY = {
  id: 'imp-36102',
  proofSection: 'S-frontier',
  question:
    'Is effectiveHeightForN / logT0 even numerically EVALUABLE at the imp-36046 sole-survivor height ' +
    'N* ~ 4.7214e13 without tripping the imp-35972 effective-height overflow cliff? Recompute ' +
    'effectiveHeightForN(N*) and its logT0 directly, check the imp-36046 baked logT0 ~ 30.021 against ' +
    'the recomputation, and report the margin between N* and the imp-35972 overflow-cliff N. ' +
    'Measurement/diagnostic only, double precision; instantiates no interval; NO QED.',
  finding:
    'EVALUABLE WITH AN ENORMOUS MARGIN. effectiveHeightForN(' +
    N_STAR.toExponential(4) +
    ') = T ~ ' +
    T_STAR.toExponential(4) +
    ', a finite NORMAL double (T/MAX ~ ' +
    T_STAR_OVER_MAX.toExponential(2) +
    '); the Newton seed numerator 2 pi . N* ~ ' +
    SEED_NUMERATOR_AT_NSTAR.toExponential(3) +
    ' is ~294 orders below MAX_VALUE (2 pi . N*/MAX ~ ' +
    SEED_NUMERATOR_OVER_MAX.toExponential(2) +
    '), so nothing overflows. Direct log(T) = ' +
    LOG_T0_RECOMPUTED.toFixed(9) +
    ' reproduces the imp-36046 baked logT0 ' +
    LOG_T0_BAKED.toFixed(3) +
    ' to |diff| ~ ' +
    LOG_T0_ABS_DIFF.toExponential(2) +
    ' (it is natural log(T), NOT log10(T) ~ ' +
    LOG10_T_STAR.toFixed(3) +
    '), and the RvM round-trip zeroCountAtHeight(T) returns N* to rel err ~ ' +
    N_BACK_REL_ERR.toExponential(2) +
    '. The nearer imp-35972 cliff (the a -> 0 R_direct NaN edge at log10 N ~ ' +
    IMP35972_A_ZERO_LOG10_N.toFixed(6) +
    ') sits ~' +
    MARGIN_DECADES_TO_A_ZERO_CLIFF.toFixed(2) +
    ' decades ABOVE N*, so the imp-36046 tail landmark is nowhere near the overflow cliff -- that cliff ' +
    'is a representability artifact of astronomically larger N. MEASUREMENT/DIAGNOSTIC, double precision; ' +
    'no interval instantiated.',
  constants: {
    N_star: N_STAR,
    logT0_baked_imp36046: LOG_T0_BAKED,
    imp35972_height_overflow_last_finite_N: IMP35972_HEIGHT_OVERFLOW_LAST_FINITE_N,
    imp35972_a_zero_last_positive_N: IMP35972_A_ZERO_LAST_POSITIVE_N,
    max_double: Number.MAX_VALUE,
  },
  metric: {
    T_star_at_N_star: +T_STAR.toExponential(9),
    T_star_is_finite_normal_double: T_STAR_IS_FINITE_NORMAL,
    T_star_over_max_double: +T_STAR_OVER_MAX.toExponential(6),
    logT0_recomputed_natural: +LOG_T0_RECOMPUTED.toFixed(9),
    log10_T_star: +LOG10_T_STAR.toFixed(9),
    logT0_abs_diff_from_baked: +LOG_T0_ABS_DIFF.toExponential(6),
    zeroCount_roundtrip_N: +N_BACK.toExponential(9),
    zeroCount_roundtrip_rel_err: N_BACK_REL_ERR,
    seed_numerator_2piNstar: +SEED_NUMERATOR_AT_NSTAR.toExponential(9),
    seed_numerator_over_max: +SEED_NUMERATOR_OVER_MAX.toExponential(6),
    margin_decades_to_a_zero_cliff: +MARGIN_DECADES_TO_A_ZERO_CLIFF.toFixed(6),
    evaluable_with_no_overflow: T_STAR_IS_FINITE_NORMAL && MARGIN_DECADES_TO_A_ZERO_CLIFF > 100,
  },
  subGap:
    'imp-34714a REMAINS OPEN. This is a double-precision EVALUABILITY CHECK of the shipped ' +
    'effectiveHeightForN at one tail landmark; it instantiates NO interval, ports no operator, and does ' +
    'not touch F(m)=0. Changes no bound. The baked logT0 30.021 and the ~294-decade margin are properties ' +
    'of the double-precision RvM height map, NOT RH quantities.',
  isRigorous: false,
  verdict:
    'THE imp-36046 SOLE-SURVIVOR TAIL LANDMARK IS NUMERICALLY EVALUABLE (measurement/diagnostic, NOT an ' +
    'RH bound). effectiveHeightForN(N* ~ 4.7214e13) = T ~ ' +
    T_STAR.toExponential(4) +
    ' is a finite NORMAL double; the direct log(T) = ' +
    LOG_T0_RECOMPUTED.toFixed(6) +
    ' reproduces the imp-36046 baked logT0 30.021 to ~' +
    LOG_T0_ABS_DIFF.toExponential(2) +
    ', and N* sits ~' +
    MARGIN_DECADES_TO_A_ZERO_CLIFF.toFixed(1) +
    ' decades BELOW the nearer imp-35972 overflow cliff, so the tail landmark never approaches it. ' +
    'imp-34714a REMAINS OPEN; C_C = 1/8 (imp-2642/2643) and C_mb GUE-conditional (imp-486) UNTOUCHED; ' +
    'instantiates no interval; changes no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-36046 (baked tail landmark logT0 ~30.021 at N* ~4.7214e13); imp-35971 (sole-survivor height); ' +
    'imp-35972 (twin overflow cliffs at log10 N ~307.4559 / ~307.4565); imp-36080 (analogous ~301.7-decade ' +
    'margin at the achieved N*=1e6 rung); lambda-rh-height-mapping (effectiveHeightForN RvM inverse, seed ' +
    'T = 2 pi . N / log(N + 2 pi)). IEEE-754 double MAX_VALUE ~ 1.7977e308: standard float model.',
};

export const IMP36102_SOLE_SURVIVOR_HEIGHT_EVALUABILITY_ASSERTIONS = [
  {
    // effectiveHeightForN(N*) is a finite NORMAL double -- no overflow at the sole-survivor height.
    id: 'imp36102-height-finite-normal-at-sole-survivor',
    description: 'effectiveHeightForN(4.7214e13) is a finite normal double, T/MAX ~ 6e-296 (nowhere near overflow)',
    holds: () =>
      T_STAR_IS_FINITE_NORMAL &&
      Number.isFinite(T_STAR) &&
      T_STAR_OVER_MAX < 1e-100 &&
      SEED_NUMERATOR_OVER_MAX < 1e-100,
  },
  {
    // The direct recomputation reproduces the imp-36046 baked logT0 ~30.021 (natural log of T).
    id: 'imp36102-recomputed-logT0-matches-baked',
    description: 'direct log(T) = 30.020992613 reproduces the imp-36046 baked logT0 30.021 to ~7.4e-6',
    holds: () =>
      LOG_T0_ABS_DIFF < 1e-4 &&
      Math.abs(LOG_T0_RECOMPUTED - 30.021) < 1e-4 &&
      Math.abs(LOG10_T_STAR - 13.038) < 1e-2,
  },
  {
    // RvM round-trip zeroCountAtHeight(T) returns N* to machine precision.
    id: 'imp36102-rvm-roundtrip-recovers-Nstar',
    description: 'zeroCountAtHeight(effectiveHeightForN(N*)) returns N* to rel err ~0',
    holds: () => Math.abs(N_BACK_REL_ERR) < 1e-9,
  },
  {
    // N* sits ~294 decades BELOW the nearer imp-35972 overflow cliff -- an enormous evaluability margin.
    id: 'imp36102-huge-margin-below-overflow-cliff',
    description: 'N* ~4.7214e13 is ~293.78 decades below the imp-35972 a->0 cliff at log10 N ~307.4559',
    holds: () =>
      MARGIN_DECADES_TO_A_ZERO_CLIFF > 290 &&
      MARGIN_DECADES_TO_A_ZERO_CLIFF < 296 &&
      N_STAR < IMP35972_A_ZERO_LAST_POSITIVE_N &&
      IMP36102_SOLE_SURVIVOR_HEIGHT_EVALUABILITY.metric.evaluable_with_no_overflow === true,
  },
  {
    // Honesty gate: measurement only, not rigorous, sub-gap open, no interval, no QED, no refereed bound is changed.
    id: 'imp36102-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no interval, no QED, no refereed bound is changed',
    holds: () =>
      IMP36102_SOLE_SURVIVOR_HEIGHT_EVALUABILITY.isRigorous === false &&
      /imp-34714a REMAINS OPEN/.test(IMP36102_SOLE_SURVIVOR_HEIGHT_EVALUABILITY.subGap) &&
      /NO QED/.test(IMP36102_SOLE_SURVIVOR_HEIGHT_EVALUABILITY.verdict) &&
      /refereed bound is changed/i.test(IMP36102_SOLE_SURVIVOR_HEIGHT_EVALUABILITY.verdict),
  },
];

for (const a of IMP36102_SOLE_SURVIVOR_HEIGHT_EVALUABILITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36102-sole-survivor-height-evaluability assertion failed: ${a.id}`);
  }
}
