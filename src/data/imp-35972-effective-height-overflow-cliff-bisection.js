/**
 * @module imp-35972-effective-height-overflow-cliff-bisection
 *
 * MEASUREMENT / DIAGNOSTIC ONLY (double precision). imp-35892 swept N on a coarse STEP=1 decade grid
 * (log10 N = 13..307) and reported the effectiveHeightForN overflow / R_direct NaN cliff at N ~ 10^307.46,
 * but a one-per-decade grid cannot resolve the exact edge, and its own log10-bisection (loL in (307,308))
 * was defeated by double spacing: near 1e307 adjacent doubles are ~1e291 apart, so 10^loL and 10^hiL
 * collapse to the same double N. This module LOCATES the cliff to sub-decade precision by bisecting on the
 * double N ITSELF (not on log10 N), between the last finite and first non-finite sample, and reports the
 * exact log10(N) of the transition, T and a at the boundary, and whether a is still a normal double.
 *
 * WHAT THE BISECTION FINDS -- TWO DISTINCT, SUB-DECADE-ADJACENT CLIFFS
 * -------------------------------------------------------------------
 * imp-35892 s coarse grid conflated two events that the double-resolved bisection now separates:
 *
 *   CLIFF B -- the R_direct NaN cliff (a -> 0). aOf = 2 pi K / (T . u): the PRODUCT T . u overflows to
 *   +Infinity one double BEFORE the height inverse T does, forcing a -> 0, dG_direct -> 0, R_direct -> NaN.
 *   Last N with a > 0 is N_B ~ 2.857e307 (log10 N ~ 307.4559), where T ~ 2.563e305 and a ~ 5.50e-300 -- a
 *   NORMAL double, ~24 orders above the min normal ~2.225e-308. This is the cliff imp-35892 actually
 *   measured (its reported a ~ 5.5e-300, T ~ 2.563e305), and a underflows by a HARD step to 0 (T . u
 *   overflow), NOT by graceful denormal decay.
 *
 *   CLIFF A -- the effectiveHeightForN -> +Infinity cliff, ~6.2e-4 decade ABOVE cliff B. The Newton seed
 *   T_seed = 2 pi . N / log(N + 2 pi) overflows because its NUMERATOR 2 pi . N exceeds MAX_VALUE once
 *   N > MAX_VALUE / (2 pi) ~ 2.861e307. Last finite N is N_A ~ 2.861e307 (log10 N ~ 307.4565); there T is
 *   still a perfectly NORMAL double ~2.567e305 (T / MAX_VALUE ~ 1.4e-3), far from overflowing itself -- it
 *   is the SEED numerator, not T, that overflows. At N_A the downstream a has ALREADY collapsed to 0
 *   (cliff B sits below), so R_direct is NaN throughout the thin band N_B < N <= N_A even though the height
 *   inverse T(N) is still finite there.
 *
 * SO: the R_direct NaN cliff (a -> 0, N_B) BINDS FIRST, ~6.2e-4 decade below the effectiveHeightForN
 * overflow cliff (T -> +Infinity, N_A). The ticket s framing "a there is still a normal double" holds at
 * the a -> 0 boundary (a ~ 5.5e-300, normal) -- but NOT at the T -> Infinity boundary, where a is already 0.
 * imp-35892 s coarse "N ~ 10^307.46 / 10^307.5" resolves to these two full-precision log10 heights.
 *
 * SCOPE / HONESTY
 * ---------------
 * Measurement/diagnostic only, double precision, on the imp-35855/imp-35892 surrogate (identical K, delta,
 * S_inf, aOf, effectiveHeightForN). Instantiates NO interval, ports nothing, derives no remainder, changes
 * no bound. imp-34714a REMAINS OPEN. C_C = 1/8 (imp-2642/2643) and C_mb GUE-conditional (imp-486)
 * UNTOUCHED. NO QED. No refereed bound is changed.
 *
 * @see imp-35892-rdirect-own-floor-departure-height (coarse STEP=1 decade grid; loL bisection defeated by double spacing)
 * @see imp-35947-log-domain-height-seed-cliff-deferral (log-domain seed defers T-overflow but not the aOf product overflow)
 * @see imp-35855-rclean-interval-de-cancellation-assessment (de-cancelled the dG node; swept only to N~1e21)
 * @see lambda-rh-height-mapping (effectiveHeightForN RvM inverse; the 2 pi . N seed numerator overflow edge)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (identical to imp-35892)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35855/imp-35892)
const MIN_NORMAL_DOUBLE = 2.2250738585072014e-308; // smallest positive NORMAL double (2^-1022)

// aOf exactly as imp-35892 evaluates it: the downstream node whose T . u product overflows first.
const aOf = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};

// Bisect on the double N itself (200 halvings collapse [lo,hi] to adjacent doubles) for the last N at
// which predicate(N) still holds; lo must satisfy the predicate, hi must fail it.
function bisectDoubleBoundary(loStart, hiStart, predicate) {
  let lo = loStart;
  let hi = hiStart;
  for (let i = 0; i < 200; i++) {
    const mid = lo + (hi - lo) / 2;
    if (mid === lo || mid === hi) break; // adjacent doubles -- boundary resolved
    if (predicate(mid)) lo = mid;
    else hi = mid;
  }
  return { lastHolds: lo, firstFails: hi };
}

// CLIFF A -- effectiveHeightForN(N) transitions from a finite normal double to +Infinity.
const CLIFF_A = bisectDoubleBoundary(1e307, Number.MAX_VALUE, (N) => Number.isFinite(effectiveHeightForN(N)));
const N_A = CLIFF_A.lastHolds; // last N with a finite height inverse
const T_A = effectiveHeightForN(N_A);
const A_AT_CLIFF_A = aOf(N_A); // already 0 -- cliff B sits below

// CLIFF B -- aOf(N) transitions from a positive normal double to 0 (T . u product overflows first).
const CLIFF_B = bisectDoubleBoundary(1e307, N_A, (N) => aOf(N) > 0);
const N_B = CLIFF_B.lastHolds; // last N with a > 0 (the R_direct NaN cliff)
const T_B = effectiveHeightForN(N_B);
const U_B = Math.log(T_B / TWO_PI);
const A_B = aOf(N_B);

const LOG10_N_A = Math.log10(N_A);
const LOG10_N_B = Math.log10(N_B);
const DECADE_GAP_A_MINUS_B = LOG10_N_A - LOG10_N_B; // ~6.2e-4: how far the T-overflow sits above the a->0 cliff

// The T-overflow is driven by the seed NUMERATOR 2 pi . N, not by T approaching MAX_VALUE.
const SEED_NUMERATOR_AT_A = TWO_PI * N_A; // just below MAX_VALUE
const N_OVERFLOW_THRESHOLD = Number.MAX_VALUE / TWO_PI; // ~2.861e307, the closed-form seed-overflow edge
const T_A_FAR_BELOW_MAX = T_A / Number.MAX_VALUE; // ~1.4e-3 -- T itself is nowhere near overflowing

export const IMP35972_EFFECTIVE_HEIGHT_OVERFLOW_CLIFF = {
  id: 'imp-35972',
  proofSection: 'S-frontier',
  question:
    'Locate to sub-decade precision (bisection on the double N itself, not on log10 N) the exact height ' +
    'at which effectiveHeightForN first overflows to +Infinity, refining the imp-35892 coarse STEP=1 ' +
    'decade-grid estimate N ~ 10^307.46; report T and a at the boundary and whether a is still a normal ' +
    'double. Measurement/diagnostic only, double precision; instantiates no interval; NO QED.',
  finding:
    'Bisecting on the double N itself resolves what imp-35892 s coarse decade grid conflated into TWO ' +
    'distinct, sub-decade-adjacent cliffs. CLIFF B (the R_direct NaN cliff, a -> 0): the aOf = 2 pi K/' +
    '(T . u) PRODUCT overflows one double before T does, so the last N with a > 0 is N_B ~ ' +
    N_B.toExponential(3) +
    ' (log10 N ~ ' +
    LOG10_N_B.toFixed(6) +
    '), where T ~ ' +
    T_B.toExponential(3) +
    ' and a ~ ' +
    A_B.toExponential(3) +
    ' -- a NORMAL double ~24 orders above the min normal, matching imp-35892 s reported a ~ 5.5e-300. ' +
    'CLIFF A (effectiveHeightForN -> +Infinity), ~' +
    DECADE_GAP_A_MINUS_B.toExponential(2) +
    ' decade ABOVE cliff B: the last finite N is N_A ~ ' +
    N_A.toExponential(3) +
    ' (log10 N ~ ' +
    LOG10_N_A.toFixed(6) +
    '), driven by the Newton seed NUMERATOR 2 pi . N exceeding MAX_VALUE once N > MAX_VALUE/(2 pi) ~ ' +
    N_OVERFLOW_THRESHOLD.toExponential(3) +
    ' -- NOT by T approaching MAX_VALUE (T ~ ' +
    T_A.toExponential(3) +
    ' there is a NORMAL double, T/MAX ~ ' +
    T_A_FAR_BELOW_MAX.toExponential(2) +
    '). At N_A a has ALREADY collapsed to 0 (cliff B is below), so R_direct is NaN across the thin band ' +
    'N_B < N <= N_A even though T(N) is still finite. The a -> 0 cliff BINDS FIRST. MEASUREMENT/' +
    'DIAGNOSTIC, double precision; no interval instantiated.',
  constants: {
    delta_and_K_reused_from: 'imp-35855/imp-35892 (identical K_ampl, aOf, effectiveHeightForN)',
    K_ampl: +K_AMPL.toExponential(6),
    max_double: Number.MAX_VALUE,
    min_normal_double: MIN_NORMAL_DOUBLE,
    seed_overflow_threshold_N: +N_OVERFLOW_THRESHOLD.toExponential(9),
  },
  metric: {
    // Cliff A: effectiveHeightForN -> +Infinity
    height_overflow_last_finite_N: +N_A.toExponential(9),
    height_overflow_last_finite_log10_N: +LOG10_N_A.toFixed(9),
    height_overflow_first_nonfinite_N: +CLIFF_A.firstFails.toExponential(9),
    T_at_height_overflow_cliff: +T_A.toExponential(9),
    T_over_max_double_at_cliff: +T_A_FAR_BELOW_MAX.toExponential(6),
    a_at_height_overflow_cliff: A_AT_CLIFF_A, // 0 -- already collapsed at cliff B below
    // 2 pi . N_A lands EXACTLY on MAX_VALUE; one double higher its numerator overflows (ratio stored to
    // avoid toExponential rounding a near-MAX value back up past MAX_VALUE -> Infinity on reparse).
    seed_numerator_2piN_equals_max_double: SEED_NUMERATOR_AT_A === Number.MAX_VALUE,
    seed_numerator_2piN_over_max: +(SEED_NUMERATOR_AT_A / Number.MAX_VALUE).toFixed(12),
    // Cliff B: a -> 0 (the R_direct NaN cliff)
    a_zero_last_positive_N: +N_B.toExponential(9),
    a_zero_last_positive_log10_N: +LOG10_N_B.toFixed(9),
    T_at_a_zero_cliff: +T_B.toExponential(9),
    // T . u sits just below MAX_VALUE at the last a > 0 point; one double higher it overflows -> a = 0.
    Tu_product_over_max_at_a_zero_cliff: +(T_B * U_B / Number.MAX_VALUE).toFixed(12),
    a_at_a_zero_cliff: +A_B.toExponential(9),
    a_at_a_zero_cliff_is_normal_double: A_B >= MIN_NORMAL_DOUBLE,
    // Separation
    decade_gap_heightOverflow_above_aZero: +DECADE_GAP_A_MINUS_B.toExponential(6),
    a_zero_cliff_binds_first: N_B < N_A,
  },
  subGap:
    'imp-34714a REMAINS OPEN. This is a double-precision LOCATION of two nested representability cliffs of ' +
    'the imp-35892 surrogate; it instantiates NO interval, ports no operator, and does not touch F(m)=0 ' +
    '(which stays a double-precision artifact). Changes no bound. The exact log10 heights (307.4559, ' +
    '307.4565) are properties of the shipped double-precision effectiveHeightForN seed, NOT RH quantities.',
  isRigorous: false,
  verdict:
    'THE effectiveHeightForN OVERFLOW CLIFF IS LOCATED TO SUB-DECADE PRECISION (measurement/diagnostic, ' +
    'NOT an RH bound). Bisecting on the double N itself separates imp-35892 s conflated coarse-grid edge ' +
    'into: the R_direct NaN cliff (a -> 0) at log10 N ~ ' +
    LOG10_N_B.toFixed(6) +
    ' (a ~ ' +
    A_B.toExponential(2) +
    ', still a NORMAL double), which BINDS FIRST, and the effectiveHeightForN -> +Infinity cliff ~' +
    DECADE_GAP_A_MINUS_B.toExponential(2) +
    ' decade above at log10 N ~ ' +
    LOG10_N_A.toFixed(6) +
    ', driven by the 2 pi . N seed numerator exceeding MAX_VALUE (T ~ ' +
    T_A.toExponential(2) +
    ' there is still a normal double, T/MAX ~ ' +
    T_A_FAR_BELOW_MAX.toExponential(2) +
    '). Reuses the imp-35855/imp-35892 machinery (identical K, delta, S_inf, aOf, effectiveHeightForN). ' +
    'imp-34714a REMAINS OPEN; C_C = 1/8 (imp-2642/2643) and C_mb GUE-conditional (imp-486) UNTOUCHED; ' +
    'instantiates no interval; changes no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-35892 (coarse STEP=1 decade grid, loL bisection defeated by ~1e291 double spacing); imp-35947 ' +
    '(log-domain seed defers T-overflow but not the aOf product overflow); imp-35855 (de-cancelled dG ' +
    'node); imp-34714a (OPEN Krawczyk certificate); lambda-rh-height-mapping (effectiveHeightForN RvM ' +
    'inverse, seed T = 2 pi . N / log(N + 2 pi)). IEEE-754 double MAX_VALUE ~ 1.7977e308 and min normal ' +
    '~ 2.2251e-308: standard float model.',
};

export const IMP35972_EFFECTIVE_HEIGHT_OVERFLOW_CLIFF_ASSERTIONS = [
  {
    // The effectiveHeightForN -> +Infinity cliff is located to sub-decade precision inside 10^307.45..10^307.46.
    id: 'imp35972-height-overflow-cliff-located-sub-decade',
    description: 'last finite N ~ 2.861e307 (log10 ~ 307.4565), first non-finite one double up; refines imp-35892 coarse ~307.46',
    holds: () =>
      Number.isFinite(effectiveHeightForN(N_A)) &&
      !Number.isFinite(effectiveHeightForN(CLIFF_A.firstFails)) &&
      LOG10_N_A > 307.455 &&
      LOG10_N_A < 307.46,
  },
  {
    // The overflow is the seed NUMERATOR 2 pi . N, not T approaching MAX_VALUE.
    id: 'imp35972-overflow-is-seed-numerator-not-T',
    description: 'T at the cliff is a normal double ~2.567e305 (T/MAX ~1.4e-3); N_A ~ MAX_VALUE/(2 pi)',
    holds: () =>
      T_A_FAR_BELOW_MAX < 1e-2 &&
      T_A > MIN_NORMAL_DOUBLE &&
      Number.isFinite(T_A) &&
      Math.abs(LOG10_N_A - Math.log10(N_OVERFLOW_THRESHOLD)) < 1e-6,
  },
  {
    // The R_direct NaN (a -> 0) cliff binds FIRST, below the height overflow, with a still a normal double there.
    id: 'imp35972-a-zero-cliff-binds-first-a-normal',
    description: 'a->0 cliff at log10 ~307.4559 sits below the T-overflow cliff; a there ~5.5e-300 is a NORMAL double',
    holds: () =>
      N_B < N_A &&
      LOG10_N_B < LOG10_N_A &&
      A_B >= MIN_NORMAL_DOUBLE &&
      A_AT_CLIFF_A === 0 &&
      DECADE_GAP_A_MINUS_B > 0,
  },
  {
    // Honesty gate: measurement only, not rigorous, sub-gap open, no interval, no QED, no refereed bound is changed.
    id: 'imp35972-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no interval, no QED, no refereed bound is changed',
    holds: () =>
      IMP35972_EFFECTIVE_HEIGHT_OVERFLOW_CLIFF.isRigorous === false &&
      /imp-34714a REMAINS OPEN/.test(IMP35972_EFFECTIVE_HEIGHT_OVERFLOW_CLIFF.subGap) &&
      /NO QED/.test(IMP35972_EFFECTIVE_HEIGHT_OVERFLOW_CLIFF.verdict) &&
      /refereed bound is changed/i.test(IMP35972_EFFECTIVE_HEIGHT_OVERFLOW_CLIFF.verdict),
  },
];

for (const a of IMP35972_EFFECTIVE_HEIGHT_OVERFLOW_CLIFF_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35972-effective-height-overflow-cliff-bisection assertion failed: ${a.id}`);
  }
}
