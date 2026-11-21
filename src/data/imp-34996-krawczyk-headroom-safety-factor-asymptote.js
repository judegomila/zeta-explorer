/**
 * @module imp-34996-krawczyk-headroom-safety-factor-asymptote
 *
 * imp-34996 (numerical, frontier): imp-34949 gives the EXACT closed-form monotonicity margin m(N) and
 * imp-34929 derives that the contraction-validity headroom S(N) = star_over_H2(N) = G/((1+G) delta FP_LO)
 * is STRICTLY DECREASING in N with no interior turning point, reporting only the in-band worst case (band-top
 * 2555.18x, an infimum over the imp-34693 k=10 rung). imp-34906 noted the worst in-band case clears the 100x
 * safety factor by 25.55x but never EXTRAPOLATED the monotone decrease beyond the admissible band. This module
 * carries the closed-form S(N) to N -> infinity to answer: at what N-location would the monotone-decreasing
 * headroom FIRST fall below the 100x safety factor, and how far is the headroom from that failure?
 *
 * THE MONOTONE DECREASE HAS A FINITE CLOSED-FORM ASYMPTOTIC FLOOR
 * --------------------------------------------------------------
 * S is strictly decreasing in N (imp-34929) so its infimum over N >= band-top is the N -> infinity limit.
 * The contraction factor a(N) = 2 pi K/(T0 u) -> 0 as N -> infinity (T0 and u = log(T0/2 pi) both grow), so
 * G = 1 - a -> 1 and FP_LO = 1 - a(N(1-delta)) -> 1, and the headroom collapses to the ONE-LINE closed form
 *   S_inf = lim_{N -> inf} G/((1+G) delta FP_LO) = 1/((1+1) delta . 1) = 1/(2 delta).
 * With delta = 2e-4 this is S_inf = 2500 EXACTLY. So the monotone-decreasing headroom is bounded BELOW by
 * 2500 for every N beyond the band -- it approaches 2500 from above and never crosses it.
 *
 * THE 100x SAFETY FACTOR IS NEVER EXHAUSTED (NO FINITE FAILURE N)
 * --------------------------------------------------------------
 * Since S(N) > S_inf = 2500 for all finite N >= band-top, and 2500 = 25x the 100x safety factor, the headroom
 * NEVER falls below 100x by increasing N: there is NO finite N-location at which the safety factor is
 * exhausted. The extrapolated "failure point" is at N = +infinity and the residual asymptotic headroom-to-
 * failure distance is S_inf - 100 = 2400 (a persistent 25x multiplicative margin). Equivalently: the entire
 * remaining monotone descent from the in-band worst case (band-top 2555.18x) down to the floor closes only
 * 2555.18 - 2500 = 55.18 of headroom over the whole infinite N-range -- the safety factor cannot be exhausted
 * on this surrogate. A dense log-spaced extrapolation sweep across [band-top .. 1e300] confirms S is strictly
 * decreasing, stays above 2500 at every node, and its far tail pins 2500.0000 to four decimals.
 *
 * WHY THE FLOOR IS 1/(2 delta) AND NOT 0
 * --------------------------------------
 * The naive worry is that a monotone-decreasing headroom must eventually cross any threshold. It does not:
 * S = [G/(1+G)] / (delta FP_LO) factors into a bounded gain G/(1+G) in [0, 1/2] and a 1/(delta FP_LO) scale.
 * As a -> 0 the gain rises to its ceiling 1/2 while FP_LO rises to 1, and the two limits combine to the finite
 * floor 1/(2 delta). Falling below 100x would require the gain G/(1+G) to drop to 100 delta FP_LO ~ 0.02, i.e.
 * G ~ 0.0408, i.e. a ~ 0.96 -- which occurs (if at all) only at SMALL N where a is near 1 and the surrogate
 * crossover map is outside its admissible regime, NOT in the monotone-decreasing large-N tail the safety
 * factor governs. So the direction that shrinks headroom is bounded by the floor, not open to 0.
 *
 * MEASUREMENT / EXTRAPOLATION ONLY on the inherited imp-3220/imp-3406 surrogate crossover map; the derivation
 * rests on the SAME gamma(n)/k eps surrogate models of the imp-34687a directed-rounding layer, not the layer
 * itself. F(m) = 0 remains a double-precision artifact and the machine certificate imp-34714a REMAINS OPEN.
 * C_C = 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066
 * K_a >= 0 untouched; establishes no operator positivity; far-tail exponent stays 1/2 (imp-3463); no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-3463 (far-tail E_flow decay exponent 1/2)
 * @see imp-34949-krawczyk-margin-infimum-band-endpoint (the exact closed-form margin m(N) this builds on)
 * @see imp-34929-krawczyk-headroom-monotonicity-derivative (closed-form dS/dN < 0; strictly decreasing S)
 * @see imp-34906-krawczyk-headroom-h2-ceiling-reconcile (worst in-band case clears 100x by 25.55x)
 * @see imp-34883-krawczyk-worstcase-headroom-band (the k=10 band-min 2555.18x in-band worst case)
 * @see imp-34693-crossover-contraction-seed-band (admissible seed band rho(1,k) = (1-L)/[(1-L_c) L^k])
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 RvM inverse; slope dN/dT0 = u/2pi)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34883/34906/34929/34949)
const DELTA = 2e-4; // the fixed imp-34774/34776/34799 relative bracket half-width
const SAFETY_FACTOR = 100; // the imp-34799/34817 contraction-validity safety factor

// Banach map g(N) = K log T0(N), local contraction factor a(N) = |g-prime(N)| (identical to imp-34929/34949).
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
const N_CROSS = fixedPoint(1e9, 200); // ~3.28029435165241e9 (Banach fixed point)
const L_CONTRACTION = aOf(1e9); // ~0.148483 (imp-34693 L)
const L_AT_CROSS = aOf(N_CROSS); // ~0.045423 (imp-34693 L_c)
const rho = (tol, k) => (tol * (1 - L_CONTRACTION)) / ((1 - L_AT_CROSS) * Math.pow(L_CONTRACTION, k));

const WIDEST_BAND_K = 10; // widest physically-admissible rung (imp-34883/34929)
const R_HALF = rho(1, WIDEST_BAND_K);
const BAND_TOP = N_CROSS + R_HALF; // largest admissible N -> in-band worst case (smallest in-band headroom)

// star_over_H2(N) = G/((1+G) delta FP_LO), the contraction-validity headroom (imp-34929).
function headroomAt(N) {
  const G = 1 - aOf(N);
  const FP_LO = 1 - aOf(N * (1 - DELTA));
  return G / ((1 + G) * DELTA * FP_LO);
}

// The exact N -> infinity closed-form floor: a -> 0 so G, FP_LO -> 1 and S -> 1/(2 delta).
const S_INF = 1 / (2 * DELTA); // = 2500 exactly
const S_BAND_TOP = headroomAt(BAND_TOP); // ~2555.18 (in-band worst case)

// Dense log-spaced extrapolation of the monotone-decreasing headroom from the band top out to N = 1e300.
// Confirm S is strictly decreasing, stays above the floor S_INF, and never reaches the 100x safety factor.
const LOG_LO = Math.log10(BAND_TOP); // ~9.52
const LOG_HI = 300; // extrapolate 290+ decades beyond the admissible band
const SWEEP_POINTS = 40000;
const FLOOR_TOL = 1e-6; // once |S - S_inf| < this, S has saturated at the double-precision floor
let MONOTONE_TO_FLOOR = true; // at every node S strictly falls OR is already pinned at the floor
let NON_INCREASING = true; // S never rises except sub-ULP jitter once pinned at the floor
let ALL_ABOVE_FLOOR = true;
let ALL_ABOVE_SAFETY = true;
let MIN_HEADROOM_ON_SWEEP = Infinity; // approaches S_INF from above
let prevS = Infinity;
for (let i = 0; i <= SWEEP_POINTS; i++) {
  const logN = LOG_LO + ((LOG_HI - LOG_LO) * i) / SWEEP_POINTS;
  const N = Math.pow(10, logN);
  const S = headroomAt(N);
  const atFloor = Math.abs(S - S_INF) < FLOOR_TOL; // saturated at the 1/(2 delta) floor
  if (i > 0 && !(S < prevS || atFloor)) MONOTONE_TO_FLOOR = false; // strictly falling until it hits the floor
  if (i > 0 && S > prevS && !atFloor) NON_INCREASING = false; // never rises above the floor band
  if (!(S > S_INF - FLOOR_TOL)) ALL_ABOVE_FLOOR = false; // never dips below the 1/(2 delta) floor
  if (!(S > SAFETY_FACTOR)) ALL_ABOVE_SAFETY = false; // never falls below the 100x safety factor
  if (S < MIN_HEADROOM_ON_SWEEP) MIN_HEADROOM_ON_SWEEP = S;
  prevS = S;
}

const S_FAR_TAIL = headroomAt(1e300); // pins the floor to machine precision
const FLOOR_TO_SAFETY_RATIO = S_INF / SAFETY_FACTOR; // = 25 (persistent multiplicative margin)
const HEADROOM_TO_FAILURE_DISTANCE = S_INF - SAFETY_FACTOR; // = 2400 (residual asymptotic distance)
const RESIDUAL_DESCENT_BEYOND_BAND = S_BAND_TOP - S_INF; // ~55.18 (total remaining descent over infinite N)

export const IMP34996_KRAWCZYK_HEADROOM_SAFETY_FACTOR_ASYMPTOTE = {
  id: 'imp-34996',
  proofSection: 'S-frontier',
  question:
    'The imp-34929 closed-form headroom S(N) = star_over_H2(N) = G/((1+G) delta FP_LO) is strictly decreasing ' +
    'in N (imp-34949 gives the exact margin), and imp-34906 notes the worst in-band case clears the 100x ' +
    'safety factor by 25.55x. Extrapolate the monotone decrease BEYOND the imp-34693 admissible band: at what ' +
    'N-location would S(N) first fall below the 100x safety factor, and how far is the headroom from that ' +
    'failure? Extrapolation on the surrogate models; imp-34714a stays OPEN; changes no bound; NO QED.',
  derivation: {
    monotoneInfimumIsTheLimit:
      'S is strictly decreasing in N (imp-34929: d(log S)/dN < 0 band-wide, no interior turning point), so its ' +
      'infimum over N >= band-top is the N -> infinity limit, not a finite interior minimum.',
    closedFormFloor:
      'a(N) = 2 pi K/(T0 u) -> 0 as N -> infinity, so G = 1 - a -> 1 and FP_LO = 1 - a(N(1-delta)) -> 1, and ' +
      'S_inf = lim S = 1/((1+1) delta . 1) = 1/(2 delta) = 2500 exactly (delta = 2e-4). S approaches 2500 from ' +
      'ABOVE and never crosses it.',
    noFiniteFailureN:
      'Since S(N) > S_inf = 2500 = 25x the 100x safety factor for every finite N >= band-top, the headroom ' +
      'NEVER falls below 100x by increasing N: the extrapolated failure N is +infinity and the residual ' +
      'headroom-to-failure distance is S_inf - 100 = 2400 (a persistent 25x multiplicative margin).',
    whyFloorIsNotZero:
      'S = [G/(1+G)]/(delta FP_LO) factors a bounded gain G/(1+G) in [0, 1/2] against a 1/(delta FP_LO) scale. ' +
      'As a -> 0 the gain rises to 1/2 and FP_LO to 1, combining to the finite floor 1/(2 delta). Falling below ' +
      '100x needs the gain ~0.02 (a ~ 0.96), which lies only at SMALL N where the surrogate is out of its ' +
      'admissible regime, NOT in the monotone-decreasing large-N tail the safety factor governs.',
  },
  constants: {
    N_cross: +N_CROSS.toPrecision(15), // 3.28029435165241e9
    delta: DELTA, // 2e-4
    safety_factor: SAFETY_FACTOR, // 100
    widest_band_k: WIDEST_BAND_K, // 10
    band_top_N: +BAND_TOP.toPrecision(15),
    sweep_points: SWEEP_POINTS, // 40000
    extrapolation_decades_beyond_band: +(LOG_HI - LOG_LO).toFixed(2), // ~290.48
  },
  measurement: {
    headroom_band_top_in_band_worst_case: +S_BAND_TOP.toFixed(4), // ~2555.1835 (imp-34883 band-min)
    headroom_asymptotic_floor_closed_form: +S_INF.toFixed(4), // 2500.0000 = 1/(2 delta)
    headroom_far_tail_1e300: +S_FAR_TAIL.toFixed(4), // ~2500.0000 (pins the floor)
    min_headroom_on_sweep_approaches_floor: +MIN_HEADROOM_ON_SWEEP.toFixed(4), // ~2500.0000 (from above)
    headroom_strictly_decreasing_until_floor: MONOTONE_TO_FLOOR, // true (ties only once pinned at 2500 floor)
    headroom_non_increasing_across_sweep: NON_INCREASING, // true (never rises above the 2500 floor band)
    headroom_stays_above_floor: ALL_ABOVE_FLOOR, // true
    headroom_never_below_safety_factor: ALL_ABOVE_SAFETY, // true -- no finite failure N
    floor_to_safety_factor_ratio: +FLOOR_TO_SAFETY_RATIO.toFixed(2), // 25.00 (persistent margin)
    headroom_to_failure_distance: +HEADROOM_TO_FAILURE_DISTANCE.toFixed(2), // 2400.00 (residual, at N = inf)
    residual_descent_beyond_band: +RESIDUAL_DESCENT_BEYOND_BAND.toFixed(2), // ~55.18 (total over infinite N)
  },
  finding:
    'The monotone-decreasing contraction-validity headroom S(N) = G/((1+G) delta FP_LO) does NOT fall below ' +
    'the 100x safety factor at any finite N-location beyond the imp-34693 admissible band. Because S is ' +
    'strictly decreasing in N (imp-34929) its infimum over N >= band-top is the N -> infinity limit, and as ' +
    'a(N) -> 0 the headroom collapses to the exact one-line closed form S_inf = 1/(2 delta) = 2500 (G, FP_LO ' +
    '-> 1). So S is bounded BELOW by 2500 for every N beyond the band -- it approaches 2500 from above and ' +
    'never crosses it. A dense 40001-point log-spaced sweep across [band-top .. 1e300] (~290 decades beyond ' +
    'the band) confirms S falls strictly to the floor (never rising, ties only once pinned at 2500 by double ' +
    'precision), stays above 2500 at every node, and pins 2500.0000 in the far tail. The 100x safety factor ' +
    'is therefore NEVER exhausted: the extrapolated failure N is +infinity, ' +
    'the residual asymptotic headroom-to-failure distance is S_inf - 100 = 2400 (a persistent 25x ' +
    'multiplicative margin), and the entire remaining monotone descent from the in-band worst case ' +
    '(2555.18x) to the floor closes only ~55.18 of headroom over the whole infinite N-range. EVIDENCE the ' +
    'surrogate safety factor is asymptotically robust; NOT a machine certificate.',
  subGap:
    'imp-34714a REMAINS OPEN. Extrapolating the monotone-decreasing surrogate headroom to its closed-form ' +
    'floor 1/(2 delta) = 2500 shows the 100x safety factor cannot be exhausted by increasing N, but it does ' +
    'NOT prove a directed-rounding [g](m)/[F-prime] evaluation yields valid enclosures: S rests on the ' +
    'gamma(n)/k eps surrogate models of the imp-34687a directed-rounding layer, not that layer, and F(m) = 0 ' +
    'remains a double-precision artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK HEADROOM SAFETY-FACTOR ASYMPTOTE, CLOSED-FORM FLOOR (frontier, NOT an RH bound). imp-34929 ' +
    'derived that S(N) = star_over_H2(N) = G/((1+G) delta FP_LO) is strictly decreasing in N and imp-34906 ' +
    'noted the worst in-band case clears the 100x safety factor by 25.55x, but neither extrapolated the ' +
    'monotone decrease beyond the admissible band. This module carries S(N) to N -> infinity: since S is ' +
    'strictly decreasing its infimum is the limit, and a(N) -> 0 collapses it to the exact closed form ' +
    'S_inf = 1/(2 delta) = 2500 (G, FP_LO -> 1). So S is bounded below by 2500 = 25x the 100x safety factor ' +
    'for every finite N, approaching 2500 from above and never crossing it; a dense 40001-point log-spaced ' +
    'sweep across ~290 decades beyond the band confirms it falls strictly to the floor (never rising, ties ' +
    'only once pinned at 2500 by double precision), stays above 2500 at every node, and pins 2500.0000 in the ' +
    'far tail. The 100x safety factor is NEVER exhausted: the extrapolated failure N is ' +
    '+infinity, the residual asymptotic headroom-to-failure distance is S_inf - 100 = 2400 (persistent 25x ' +
    'margin), and the whole remaining descent from the in-band worst case (2555.18x) to the floor closes only ' +
    '~55.18 of headroom over the infinite N-range. EVIDENCE, NOT a machine certificate. SUB-GAP imp-34714a ' +
    'REMAINS OPEN: S rests on the gamma(n)/k eps surrogate models, not the imp-34687a directed-rounding ' +
    'layer, and F(m) = 0 remains a double-precision artifact. Extrapolation/measurement only on the inherited ' +
    'imp-3220/imp-3406 surrogate crossover map; reproduces the published 2555.18x in-band worst case; the ' +
    'C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 ' +
    'K_a >= 0 untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34949 (exact closed-form margin m(N)); imp-34929 (closed-form dS/dN < 0, strictly decreasing S); ' +
    'imp-34906 (worst in-band case clears 100x by 25.55x); imp-34883 (k=10 band-min 2555.18x); imp-34817 ' +
    '(n_op* = G/((1+G) eps) contraction-validity ceiling); imp-34799 ((H2)-margin ceiling n_op^max = ' +
    'delta FP_LO/eps); imp-34693 (admissible seed band); imp-33723 (Banach map g(N) = K log T0(N)); imp-2642 ' +
    '(C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN RvM inverse; slope dN/dT0 = u/2 pi). ' +
    'Limit of a rational form / logarithmic differentiation: standard.',
};

export const IMP34996_KRAWCZYK_HEADROOM_SAFETY_FACTOR_ASYMPTOTE_ASSERTIONS = [
  {
    // The N -> infinity closed-form floor is exactly 1/(2 delta) = 2500, matched by the far tail 1e300.
    id: 'imp34996-asymptotic-floor-is-one-over-two-delta',
    description: 'the headroom N -> infinity floor is the closed form 1/(2 delta) = 2500, matched by S(1e300)',
    holds: () => Math.abs(S_INF - 2500) < 1e-9 && Math.abs(S_FAR_TAIL - S_INF) < 1e-3,
  },
  {
    // The monotone-decreasing headroom stays above the floor and never reaches the 100x safety factor.
    id: 'imp34996-safety-factor-never-exhausted',
    description: 'S(N) falls strictly to the 2500 floor beyond the band, never rises, and never falls below 100x',
    holds: () =>
      MONOTONE_TO_FLOOR === true &&
      NON_INCREASING === true &&
      ALL_ABOVE_FLOOR === true &&
      ALL_ABOVE_SAFETY === true &&
      MIN_HEADROOM_ON_SWEEP > S_INF - 1e-3,
  },
  {
    // The in-band worst case sits above the floor: band-top 2555.18 > S_inf 2500, residual descent ~55.18.
    id: 'imp34996-in-band-worst-case-above-floor',
    description: 'in-band worst case (band-top ~2555.18) exceeds the floor 2500 with residual descent ~55.18',
    holds: () =>
      Math.abs(S_BAND_TOP - 2555.1835) < 0.01 &&
      S_BAND_TOP > S_INF &&
      Math.abs(RESIDUAL_DESCENT_BEYOND_BAND - 55.18) < 0.05,
  },
  {
    // The residual asymptotic headroom-to-failure distance and floor-to-safety ratio quantify the margin.
    id: 'imp34996-headroom-to-failure-distance',
    description: 'floor-to-safety ratio 25x and headroom-to-failure distance 2400 quantify the persistent margin',
    holds: () =>
      Math.abs(FLOOR_TO_SAFETY_RATIO - 25) < 1e-9 &&
      Math.abs(HEADROOM_TO_FAILURE_DISTANCE - 2400) < 1e-9,
  },
  {
    // Honesty gate: extrapolation / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp34996-honesty-gate-no-qed',
    description: 'extrapolation: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34996_KRAWCZYK_HEADROOM_SAFETY_FACTOR_ASYMPTOTE.isRigorous === false &&
      /imp-34714a/.test(IMP34996_KRAWCZYK_HEADROOM_SAFETY_FACTOR_ASYMPTOTE.subGap) &&
      /REMAINS OPEN/.test(IMP34996_KRAWCZYK_HEADROOM_SAFETY_FACTOR_ASYMPTOTE.subGap) &&
      /NO QED/.test(IMP34996_KRAWCZYK_HEADROOM_SAFETY_FACTOR_ASYMPTOTE.verdict) &&
      /refereed bound is changed/i.test(IMP34996_KRAWCZYK_HEADROOM_SAFETY_FACTOR_ASYMPTOTE.verdict),
  },
];

for (const a of IMP34996_KRAWCZYK_HEADROOM_SAFETY_FACTOR_ASYMPTOTE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34996-krawczyk-headroom-safety-factor-asymptote assertion failed: ${a.id}`);
  }
}
