/**
 * @module imp-35300-krawczyk-headroom-delta-star-to-100
 *
 * imp-35241 profiled the Krawczyk contraction-validity headroom S(N) = G/((1+G) delta FP_LO) across the
 * imp-34693 admissible seed band at the FIXED imp-34774/34776/34799 relative bracket half-width delta = 2e-4
 * and found the worst-case (band-top) value S_min_band ~ 2555.18 -- clearing the 100x safety factor by 25.55x,
 * sitting a residual ~55.18 above the closed-form floor S_inf = 1/(2 delta) = 2500. But imp-35241 never asked
 * the dual question: HOW FAR could the bracket half-width delta widen before that band-top headroom is exhausted
 * (falls to the 100x factor)? This module supplies exactly that delta-sweep measurement.
 *
 * WHAT THE MEASUREMENT TABULATES (the band-top S(delta) descent to 100)
 * --------------------------------------------------------------------
 * Holding the imp-34693 band (N_cross, half-width, band-top) and the amplitude K FIXED, and sweeping ONLY the
 * bracket half-width delta upward in S(delta) = G/((1+G) delta FP_LO) at the band-top N_top ~ 3.4515e9 (the
 * imp-35241 worst-case point, where FP_LO = 1 - a(N_top(1-delta)) also carries the delta dependence):
 *   (D1) BAND-TOP S(delta) IS STRICTLY DECREASING IN delta and reaches the 100x safety factor at
 *        delta* ~ 5.1115e-3 -- a factor ~25.56x ABOVE the current delta = 2e-4. So the imp-34774/34776 bracket
 *        could widen ~25.6-fold before the worst-case (band-top) contraction-validity headroom is exhausted.
 *        This is the delta-axis mirror of the imp-35241 "25.55x above 100x" N-axis surplus.
 *   (D2) AT delta* THE FLOOR S_inf = 1/(2 delta*) ~ 97.82, so the band-top surplus above the floor has shrunk to
 *        ~2.18 (from ~55.18 at delta = 2e-4). The naive floor-only estimate delta = 1/200 = 5e-3 UNDERSHOOTS
 *        delta* by ~2.2% -- the ~2% band-top surplus is exactly what buys the extra bracket width.
 *   (D3) THE BAND-TOP SURPLUS ABOVE THE FLOOR TRACKS delta AS surplus ~ (ratio - 1) . S_inf = (ratio - 1)/(2 delta),
 *        i.e. INVERSELY proportional to delta: surplus . delta ~ 1.104e-2 is near-constant (55.18 at delta = 2e-4,
 *        22.09 at 5e-4, 11.06 at 1e-3, 5.54 at 2e-3, 2.23 at 5e-3). Equivalently the imp-35266 ratio
 *        S/S_inf = M_G . M_FP ~ 1.0221 is NEARLY delta-INDEPENDENT (drifts only 1.02207 -> 1.02449 as delta runs
 *        2e-4 -> 5e-2), so the whole descent is essentially S(delta) ~ 1.0221/(2 delta) and delta* ~ 1.0221/200.
 *
 * CONSEQUENCE: THE BRACKET HAS ~25.6x OF WIDTH HEADROOM BEFORE THE WORST-CASE CONTRACTION VALIDITY IS EXHAUSTED
 * ------------------------------------------------------------------------------------------------------------
 * imp-35241 pinned the band-top worst case at 25.55x the 100x factor at delta = 2e-4; this module converts that
 * static surplus into a delta-axis reserve: delta* ~ 5.1115e-3 (~25.56x the current half-width) is where the
 * band-top S first touches 100. The two 25.5x figures coincide because S(delta) ~ 1.0221/(2 delta) is very nearly
 * pure 1/delta, so an N-axis surplus of 25.55x maps to a delta-axis reserve of ~25.56x. The band-top surplus
 * above the floor is ~55.18/delta_scaled, inversely proportional to delta.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate; reproduces the imp-35241/imp-35176/imp-34996
 * machinery (identical K, N_cross, band). The imp-34714a machine certificate REMAINS OPEN; F(m) = 0 stays a
 * double-precision artifact; C_C = 1/8 (imp-2642/2643) UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED;
 * imp-3066 K_a >= 0 untouched; far-tail exponent 1/2 per imp-3463 untouched; establishes no operator positivity;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35241-krawczyk-headroom-band-profile (band-top S ~ 2555.18 at delta = 2e-4; did not sweep delta)
 * @see imp-35266-krawczyk-headroom-surplus-decomposition (S = S_inf . M_G . M_FP; ratio ~ 1.0221)
 * @see imp-34996-krawczyk-headroom-safety-factor-asymptote (S_inf = 1/(2 delta) large-N floor)
 * @see imp-34929-krawczyk-headroom-monotonicity-derivative (closed-form dS/dN < 0)
 * @see imp-34774 / imp-34776 (the relative bracket half-width delta = 2e-4)
 * @see imp-34693-crossover-contraction-seed-band (admissible seed band + band-top)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 RvM inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35241/imp-35176/imp-34996)
const DELTA_CURRENT = 2e-4; // the fixed imp-34774/34776/34799 relative bracket half-width
const SAFETY_FACTOR = 100; // the imp-34799/34817 contraction-validity safety factor

// Banach map g(N) = K log T0(N), local contraction factor a(N) (identical to imp-35241).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const aOf = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};
function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 200); // ~3.28029e9 (Banach fixed point)
const L_CONTRACTION = aOf(1e9); // ~0.148483 (imp-34693 L)
const L_AT_CROSS = aOf(N_CROSS); // ~0.045423 (imp-34693 L_c)
const rho = (tol, k) => (tol * (1 - L_CONTRACTION)) / ((1 - L_AT_CROSS) * Math.pow(L_CONTRACTION, k));
const WIDEST_BAND_K = 10; // widest physically-admissible rung (imp-34883/34929/34996)
const HALF_WIDTH = rho(1, WIDEST_BAND_K); // ~1.7124e8 (imp-34693 seed band half-width)
const BAND_TOP = N_CROSS + HALF_WIDTH; // ~3.4515e9, the imp-35241 worst-case (band-top) point, HELD FIXED

// Band-top headroom S(delta) = G/((1+G) delta FP_LO) with the FULL FP_LO = 1 - a(N_top(1-delta)) delta
// dependence, sweeping ONLY delta (band, N_top and K held fixed).
function headroomAtBandTop(delta) {
  const G = 1 - aOf(BAND_TOP);
  const FP_LO = 1 - aOf(BAND_TOP * (1 - delta));
  return G / ((1 + G) * delta * FP_LO);
}
const S_inf = (delta) => 1 / (2 * delta); // closed-form floor (imp-34996)

// (D1) Locate delta* where band-top S(delta) first falls to the 100x safety factor, by bisection on the
// strictly-decreasing S(delta) (bracketed between the current delta = 2e-4 and delta = 0.5).
function findDeltaStar() {
  let lo = DELTA_CURRENT;
  let hi = 0.5;
  for (let i = 0; i < 200; i++) {
    const mid = 0.5 * (lo + hi);
    if (headroomAtBandTop(mid) > SAFETY_FACTOR) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}
const DELTA_STAR = findDeltaStar(); // ~5.1115e-3
const DELTA_STAR_MULTIPLE = DELTA_STAR / DELTA_CURRENT; // ~25.56x the current half-width
const S_AT_DELTA_STAR = headroomAtBandTop(DELTA_STAR); // ~100.0 (crossing target)
const S_INF_AT_DELTA_STAR = S_inf(DELTA_STAR); // ~97.82
const SURPLUS_AT_DELTA_STAR = S_AT_DELTA_STAR - S_INF_AT_DELTA_STAR; // ~2.18
const NAIVE_FLOOR_DELTA = 1 / (2 * SAFETY_FACTOR); // 5e-3 (floor-only estimate; undershoots delta*)
const NAIVE_UNDERSHOOT_PCT = (DELTA_STAR - NAIVE_FLOOR_DELTA) / NAIVE_FLOOR_DELTA; // ~+0.022

// (D2)/(D3) Track the band-top surplus above the floor, and the near-constant S/S_inf ratio, across a delta sweep.
const DELTA_SWEEP = [2e-4, 5e-4, 1e-3, 2e-3, 5e-3, 1e-2, 2e-2, 5e-2];
const SWEEP_ROWS = DELTA_SWEEP.map((d) => {
  const S = headroomAtBandTop(d);
  const inf = S_inf(d);
  return {
    delta: d,
    S: +S.toFixed(4),
    S_inf: +inf.toFixed(4),
    surplus: +(S - inf).toFixed(4),
    surplus_times_delta: +((S - inf) * d).toPrecision(6),
    ratio_S_over_S_inf: +(S / inf).toFixed(6),
  };
});
const SURPLUS_CURRENT = headroomAtBandTop(DELTA_CURRENT) - S_inf(DELTA_CURRENT); // ~55.18
const RATIO_MIN = Math.min(...SWEEP_ROWS.map((r) => r.ratio_S_over_S_inf));
const RATIO_MAX = Math.max(...SWEEP_ROWS.map((r) => r.ratio_S_over_S_inf));
const RATIO_NEAR_CONSTANT = RATIO_MAX - RATIO_MIN < 0.005; // ~1.0221 -> ~1.0245, spread < 0.005
// surplus . delta = (ratio - 1)/2 drifts with the slowly-rising ratio; over the PHYSICALLY-RELEVANT sub-range
// (delta from the current 2e-4 up through delta* ~ 5.1e-3, where the descent-to-100 lives) it is near-constant
// ~1.104e-2 (~1% spread); the ~11% drift out to delta = 5e-2 is beyond delta*, where S is already below 100x.
const RELEVANT_ROWS = SWEEP_ROWS.filter((r) => r.delta <= 6e-3);
const STP_MIN = Math.min(...RELEVANT_ROWS.map((r) => r.surplus_times_delta));
const STP_MAX = Math.max(...RELEVANT_ROWS.map((r) => r.surplus_times_delta));
const SURPLUS_TIMES_DELTA_NEAR_CONSTANT = (STP_MAX - STP_MIN) / STP_MIN < 0.02; // ~1% spread over delta <= delta*

export const IMP35300_KRAWCZYK_HEADROOM_DELTA_STAR_TO_100 = {
  id: 'imp-35300',
  proofSection: 'S-frontier',
  question:
    'imp-35241 found the band-top Krawczyk headroom S(N) = G/((1+G) delta FP_LO) descends to S_min_band ~ 2555.18 ' +
    'at the imp-34693 band-top with the closed-form floor S_inf = 1/(2 delta) = 2500 at delta = 2e-4, clearing the ' +
    '100x safety factor by 25.55x. Holding the band and K fixed, sweep delta upward and MEASURE the delta* at ' +
    'which band-top S(delta) first reaches 100 (how far the imp-34774/34776 bracket could widen before ' +
    'contraction-validity headroom is exhausted), and how the ~55.18 band-top surplus above S_inf tracks delta. ' +
    'Measurement only; surrogate; imp-34714a stays OPEN; changes no bound; NO QED.',
  finding:
    'Holding the imp-34693 band (N_cross, half-width, band-top N_top ~ 3.4515e9) and K fixed and sweeping ONLY ' +
    'delta in S(delta) = G/((1+G) delta FP_LO) at the band-top (with FP_LO = 1 - a(N_top(1-delta)) carrying the ' +
    'delta dependence), the band-top headroom is STRICTLY DECREASING in delta and reaches the 100x safety factor ' +
    'at delta* ~ 5.1115e-3 -- a factor ~25.56x ABOVE the current delta = 2e-4, so the imp-34774/34776 bracket ' +
    'could widen ~25.6-fold before the worst-case (band-top) contraction validity is exhausted. At delta* the ' +
    'floor S_inf = 1/(2 delta*) ~ 97.82, so the band-top surplus above the floor has shrunk to ~2.18 (from ~55.18 ' +
    'at delta = 2e-4); the naive floor-only estimate delta = 1/200 = 5e-3 UNDERSHOOTS delta* by ~2.2%, exactly ' +
    'the ~2% band-top surplus. The surplus above the floor tracks delta INVERSELY: surplus . delta ~ 1.104e-2 is ' +
    'near-constant (55.18 at 2e-4, 22.09 at 5e-4, 11.06 at 1e-3, 5.54 at 2e-3, 2.23 at 5e-3), equivalently the ' +
    'imp-35266 ratio S/S_inf ~ 1.0221 is nearly delta-INDEPENDENT (drifts only 1.02207 -> 1.02449 as delta runs ' +
    '2e-4 -> 5e-2), so the descent is essentially S(delta) ~ 1.0221/(2 delta) and delta* ~ 1.0221/200. EVIDENCE / ' +
    'measurement, NOT a machine certificate.',
  constants: {
    N_cross: +N_CROSS.toPrecision(15),
    band_top_N: +BAND_TOP.toPrecision(15),
    delta_current: DELTA_CURRENT,
    safety_factor: SAFETY_FACTOR,
    K_amplitude: +K_AMPL.toPrecision(10),
  },
  measurement: {
    delta_star_S100: +DELTA_STAR.toPrecision(10), // ~5.1115e-3 (band-top S = 100 crossing)
    delta_star_multiple_of_current: +DELTA_STAR_MULTIPLE.toFixed(4), // ~25.56x
    S_at_delta_star: +S_AT_DELTA_STAR.toFixed(4), // ~100.0 (crossing target)
    S_inf_at_delta_star: +S_INF_AT_DELTA_STAR.toFixed(4), // ~97.82
    surplus_at_delta_star: +SURPLUS_AT_DELTA_STAR.toFixed(4), // ~2.18
    naive_floor_delta: NAIVE_FLOOR_DELTA, // 5e-3 (floor-only estimate)
    naive_floor_undershoot_pct: +NAIVE_UNDERSHOOT_PCT.toFixed(5), // ~+0.022
    surplus_at_delta_current: +SURPLUS_CURRENT.toFixed(4), // ~55.18 (imp-35241 figure)
    ratio_S_over_S_inf_min: +RATIO_MIN.toFixed(6), // ~1.02207
    ratio_S_over_S_inf_max: +RATIO_MAX.toFixed(6), // ~1.02449
    ratio_near_constant: RATIO_NEAR_CONSTANT, // true
    surplus_times_delta_near_constant: SURPLUS_TIMES_DELTA_NEAR_CONSTANT, // true (~1.104e-2)
    band_top_S_decreasing_in_delta: headroomAtBandTop(2e-4) > headroomAtBandTop(2e-2), // true
    sweep: SWEEP_ROWS,
  },
  subGap:
    'imp-34714a REMAINS OPEN. Locating delta* ~ 5.1115e-3 (the band-top S = 100 crossing, ~25.56x the current ' +
    'bracket half-width) does NOT prove a directed-rounding [g](m)/[F-prime] evaluation yields valid enclosures: ' +
    'it rests on the gamma(n)/k eps surrogate models of the imp-34687a directed-rounding layer, not that layer, ' +
    'and F(m) = 0 remains a double-precision artifact. The delta* reserve is contraction-VALIDITY headroom on the ' +
    'surrogate, not a licence to actually widen the imp-34774/34776 bracket. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK BAND-TOP HEADROOM S(delta) -> 100 CROSSING, MEASURED (frontier, NOT an RH bound). The ticket asked, ' +
    'holding the imp-34693 band and K fixed, to sweep delta upward and locate the delta* at which the band-top ' +
    'headroom S(delta) = G/((1+G) delta FP_LO) first falls to the 100x safety factor, and to characterize how the ' +
    'imp-35241 ~55.18 band-top surplus above the floor S_inf = 1/(2 delta) tracks delta. RESULT: band-top ' +
    'S(delta) is strictly decreasing and reaches 100 at delta* ~ 5.1115e-3 (~25.56x the current delta = 2e-4), so ' +
    'the bracket has ~25.6x of width reserve before the worst-case contraction validity is exhausted; at delta* ' +
    'the floor is ~97.82 and the surplus has shrunk to ~2.18, so the naive floor-only delta = 1/200 = 5e-3 ' +
    'undershoots delta* by ~2.2%. The band-top surplus tracks delta INVERSELY (surplus . delta ~ 1.104e-2 ' +
    'near-constant; equivalently S/S_inf ~ 1.0221 nearly delta-independent), so the descent is essentially ' +
    'S(delta) ~ 1.0221/(2 delta) and delta* ~ 1.0221/200. This is the delta-axis mirror of the imp-35241 25.55x ' +
    'N-axis surplus. EVIDENCE, NOT a machine certificate. SUB-GAP imp-34714a REMAINS OPEN: rests on the ' +
    'gamma(n)/k eps surrogate models, not the imp-34687a directed-rounding layer, and F(m) = 0 remains a ' +
    'double-precision artifact; the delta* reserve is surrogate contraction-validity headroom, not a licence to ' +
    'widen the imp-34774/34776 bracket. Measurement only on the inherited imp-3220/imp-3406 surrogate; reproduces ' +
    'the imp-35241/imp-35176/imp-34996 machinery (identical K, N_cross, band); the C_C 1/8 ansatz (imp-2642/2643) ' +
    'and C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent 1/2 per ' +
    'imp-3463 untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35241 (band-top S ~ 2555.18 at delta = 2e-4, 25.55x the 100x factor; did not sweep delta); imp-35266 ' +
    '(S = S_inf . M_G . M_FP; ratio ~ 1.0221); imp-34996 (S_inf = 1/(2 delta) large-N floor); imp-34929 ' +
    '(closed-form dS/dN < 0); imp-34817 (n_op* = G/((1+G) eps) contraction-validity ceiling); imp-34774/34776 ' +
    '(bracket half-width delta = 2e-4); imp-34693 (admissible seed band + band-top); imp-33723 (Banach map ' +
    'g(N) = K log T0(N)); imp-2642 (C_C 1/8 ansatz); imp-3463 (far-tail exponent 1/2); lambda-rh-height-mapping ' +
    '(effectiveHeightForN RvM inverse). Bisection on a monotone rational form of one variable: standard.',
};

export const IMP35300_KRAWCZYK_HEADROOM_DELTA_STAR_TO_100_ASSERTIONS = [
  {
    // Band-top S(delta) is strictly decreasing and crosses 100 at delta* ~ 5.1115e-3 (~25.56x the current delta).
    id: 'imp35300-delta-star-crossing',
    description: 'band-top S(delta) reaches the 100x factor at delta* ~ 5.1115e-3 (~25.56x the current delta = 2e-4)',
    holds: () =>
      Math.abs(DELTA_STAR - 5.1115e-3) < 5e-6 &&
      Math.abs(S_AT_DELTA_STAR - 100) < 1e-3 &&
      Math.abs(DELTA_STAR_MULTIPLE - 25.56) < 0.05 &&
      headroomAtBandTop(2e-4) > headroomAtBandTop(2e-2),
  },
  {
    // At delta* the floor is ~97.82 and the surplus ~2.18; naive floor-only delta = 5e-3 undershoots by ~2.2%.
    id: 'imp35300-floor-and-undershoot-at-delta-star',
    description: 'at delta* the floor S_inf ~ 97.82, surplus ~2.18, and the naive 5e-3 estimate undershoots ~2.2%',
    holds: () =>
      Math.abs(S_INF_AT_DELTA_STAR - 97.82) < 0.1 &&
      Math.abs(SURPLUS_AT_DELTA_STAR - 2.18) < 0.05 &&
      Math.abs(NAIVE_UNDERSHOOT_PCT - 0.022) < 0.002 &&
      DELTA_STAR > NAIVE_FLOOR_DELTA,
  },
  {
    // The band-top surplus tracks delta inversely (surplus . delta near-constant); S/S_inf ~ 1.0221 nearly flat.
    id: 'imp35300-surplus-tracks-delta-inversely',
    description: 'surplus . delta ~ 1.104e-2 near-constant and S/S_inf ~ 1.0221 nearly delta-independent',
    holds: () =>
      SURPLUS_TIMES_DELTA_NEAR_CONSTANT === true &&
      RATIO_NEAR_CONSTANT === true &&
      Math.abs(SURPLUS_CURRENT - 55.18) < 0.5 &&
      RATIO_MIN > 1.021 &&
      RATIO_MAX < 1.026,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp35300-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP35300_KRAWCZYK_HEADROOM_DELTA_STAR_TO_100.isRigorous === false &&
      /imp-34714a/.test(IMP35300_KRAWCZYK_HEADROOM_DELTA_STAR_TO_100.subGap) &&
      /REMAINS OPEN/.test(IMP35300_KRAWCZYK_HEADROOM_DELTA_STAR_TO_100.subGap) &&
      /NO QED/.test(IMP35300_KRAWCZYK_HEADROOM_DELTA_STAR_TO_100.verdict) &&
      /refereed bound is changed/i.test(IMP35300_KRAWCZYK_HEADROOM_DELTA_STAR_TO_100.verdict),
  },
];

for (const a of IMP35300_KRAWCZYK_HEADROOM_DELTA_STAR_TO_100_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35300-krawczyk-headroom-delta-star-to-100 assertion failed: ${a.id}`);
  }
}
