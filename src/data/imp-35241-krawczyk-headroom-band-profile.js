/**
 * @module imp-35241-krawczyk-headroom-band-profile
 *
 * imp-35176 searched the small-N surrogate for a true S(N) = 100 crossing of the Krawczyk
 * contraction-validity headroom S(N) = star_over_H2(N) = G/((1+G) delta FP_LO) and reported, en passant, that
 * the physical (a < 1) admissible branch is FLOORED at S_inf = 1/(2 delta) = 2500 with a physical-branch
 * minimum ~2500.02 -- descending toward 2500 from above, never approaching the 100x factor. But imp-35176
 * tabulated only that single physical-branch MINIMUM (taken over the whole a < 1 range out to N = 1e13); it
 * never tabulated the S(N) PROFILE across the imp-34693 ADMISSIBLE SEED BAND itself, nor located where within
 * that band S comes CLOSEST to the floor. This module supplies exactly that band profile.
 *
 * WHAT THE MEASUREMENT TABULATES (the admissible-band S(N) profile the ticket names)
 * --------------------------------------------------------------------------------
 * The imp-34693 admissible seed band is the widest (k = 10) rung, centered on the Banach fixed point
 * N_cross ~ 3.2803e9 with half-width rho(1,10) ~ 1.7124e8: the band [N_bot, N_top] ~ [3.1090e9, 3.4515e9]
 * (log10 N in [9.4926, 9.5380]). Sampling S(N) with the full FP_LO = 1 - a(N(1-delta)) dependence across that
 * band on a 200-point grid:
 *   (P1) S(N) DESCENDS MONOTONICALLY across the band -- from S ~ 2561.39 at the band-bottom (N ~ 3.1090e9)
 *        through S ~ 2558.12 at N_cross to S ~ 2555.18 at the band-top (N ~ 3.4515e9). This is the closed-form
 *        dS/dN < 0 of imp-34929 realized on the actual admissible band (S strictly decreasing in N, no
 *        interior turning point).
 *   (P2) THE CLOSEST APPROACH TO THE 2500 FLOOR IS AT THE BAND-TOP. Since S is strictly decreasing, its
 *        infimum over the band is attained at the largest admissible N, the band-top: S_min_band ~ 2555.18
 *        (= 25.55x the 100x safety factor), sitting a residual ~55.18 ABOVE the closed-form floor S_inf = 2500.
 *        This reproduces the imp-34929/34996 "in-band worst case band-top ~2555.18x" figure and pins WHERE in
 *        the band it lives (the top edge, not an interior point).
 *   (P3) THE FLOOR IS ATTAINED FROM ABOVE AND NEVER TOUCHED WITHIN THE BAND. Every sampled S exceeds
 *        S_inf = 2500 (min gap ~55.18 at band-top); S never rises above the band-bottom value and never dips to
 *        the floor. The 2500 floor is only approached asymptotically as N -> infinity (imp-34996), FAR beyond
 *        the admissible band, so the imp-35176 physical-branch minimum ~2500.02 is a FAR-TAIL value, not a
 *        band value -- the band's own closest approach is ~2555.18, ~55 above it.
 *
 * CONSEQUENCE: THE ADMISSIBLE BAND CLEARS THE 100x SAFETY FACTOR BY 25.55x AT ITS WORST (BAND-TOP) POINT
 * -----------------------------------------------------------------------------------------------------
 * imp-35176 confirmed S_inf = 2500 is the true infimum of the physical branch (min ~2500.02, floor from above);
 * this module confirms the same qualitative behaviour holds WITHIN the imp-34693 admissible band and locates
 * the closest approach to that floor at the band-top (S ~ 2555.18, gap ~55.18 above 2500). So across the entire
 * admissible seed band the contraction-validity headroom stays 25.55x-25.61x above the 100x factor, monotone
 * decreasing from band-bottom to band-top, never reaching the floor. The S_inf = 2500 infimum is genuinely
 * approached from above; the band never realizes it.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate; reproduces the imp-35176/imp-35110/imp-34996
 * machinery (identical K, delta, N_cross, band). The imp-34714a machine certificate REMAINS OPEN; F(m) = 0
 * stays a double-precision artifact; C_C = 1/8 (imp-2642/2643) UNTOUCHED; C_mb GUE-conditional per imp-486
 * UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent 1/2 per imp-3463 untouched; establishes no operator
 * positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35176-krawczyk-headroom-s100-crossing (reported the physical-branch min ~2500.02 but not the band profile)
 * @see imp-34996-krawczyk-headroom-safety-factor-asymptote (S_inf = 1/(2 delta) large-N floor)
 * @see imp-34929-krawczyk-headroom-monotonicity-derivative (closed-form dS/dN < 0; strictly decreasing S)
 * @see imp-35110-krawczyk-headroom-small-n-edge (the small-N edge + FP_LO pole)
 * @see imp-34693-crossover-contraction-seed-band (admissible seed band + band-bottom/band-top)
 * @see imp-3463 (far-tail exponent 1/2)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 RvM inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35176/imp-34996/imp-35110)
const DELTA = 2e-4; // the fixed imp-34774/34776/34799 relative bracket half-width
const SAFETY_FACTOR = 100; // the imp-34799/34817 contraction-validity safety factor
const S_INF = 1 / (2 * DELTA); // 2500 exactly (imp-34996 large-N floor)

// Banach map g(N) = K log T0(N), local contraction factor a(N) (identical to imp-35176).
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
const BAND_BOTTOM = N_CROSS - HALF_WIDTH; // smallest admissible N (imp-34693 seed band-bottom)
const BAND_TOP = N_CROSS + HALF_WIDTH; // largest admissible N (imp-34693 seed band-top)

// star_over_H2(N) = G/((1+G) delta FP_LO), the contraction-validity headroom (imp-34929/34996) with FULL FP_LO.
function headroomAt(N) {
  const G = 1 - aOf(N);
  const FP_LO = 1 - aOf(N * (1 - DELTA));
  return G / ((1 + G) * DELTA * FP_LO);
}

// Tabulate the S(N) profile across the imp-34693 admissible seed band on a 200-point grid: confirm it is
// monotone-decreasing (imp-34929 dS/dN < 0), locate the closest approach to the 2500 floor, and confirm every
// sampled value sits ABOVE S_inf (floor attained from above, never touched within the band).
const BAND_PTS = 200;
let MIN_S_BAND = Infinity;
let N_AT_MIN_S = null;
let MAX_S_BAND = -Infinity;
let BAND_MONOTONE_DECREASING = true;
let BAND_ALL_ABOVE_FLOOR = true;
{
  let prevS = null;
  for (let i = 0; i <= BAND_PTS; i++) {
    const N = BAND_BOTTOM + ((BAND_TOP - BAND_BOTTOM) * i) / BAND_PTS;
    const S = headroomAt(N);
    if (S <= S_INF) BAND_ALL_ABOVE_FLOOR = false;
    if (prevS !== null && S > prevS + 1e-9) BAND_MONOTONE_DECREASING = false;
    if (S < MIN_S_BAND) {
      MIN_S_BAND = S;
      N_AT_MIN_S = N;
    }
    if (S > MAX_S_BAND) MAX_S_BAND = S;
    prevS = S;
  }
}
const S_BAND_BOTTOM = headroomAt(BAND_BOTTOM); // ~2561.39
const S_N_CROSS = headroomAt(N_CROSS); // ~2558.12
const S_BAND_TOP = headroomAt(BAND_TOP); // ~2555.18 (closest approach to the floor within the band)
const CLOSEST_APPROACH_AT_BAND_TOP = Math.abs(N_AT_MIN_S - BAND_TOP) < 1e-6 * BAND_TOP; // true (strictly decreasing)
const CLOSEST_APPROACH_GAP = MIN_S_BAND - S_INF; // ~55.18 (residual above the 2500 floor)
const BAND_TOP_SAFETY_MULTIPLE = MIN_S_BAND / SAFETY_FACTOR; // ~25.55x the 100x factor at the worst band point

export const IMP35241_KRAWCZYK_HEADROOM_BAND_PROFILE = {
  id: 'imp-35241',
  proofSection: 'S-frontier',
  question:
    'imp-35176 reported the physical-branch minimum of the Krawczyk contraction-validity headroom ' +
    'S(N) = G/((1+G) delta FP_LO) is only ~2500.02 (descending toward the closed-form floor S_inf = 1/(2 delta) ' +
    '= 2500 from above, never approaching the 100x factor) but tabulated only that single minimum, not the S(N) ' +
    'profile across the imp-34693 admissible seed band. Tabulate S(N) across the admissible band with the full ' +
    'FP_LO = 1 - a(N(1-delta)) dependence, locate the N of closest approach to 2500, and confirm the floor is ' +
    'attained from above. Measurement only; surrogate; imp-34714a stays OPEN; changes no bound; NO QED.',
  finding:
    'Across the imp-34693 admissible seed band [N_bot, N_top] ~ [3.1090e9, 3.4515e9] (widest k = 10 rung, ' +
    'centered on N_cross ~ 3.2803e9, half-width rho(1,10) ~ 1.7124e8) the headroom S(N) DESCENDS MONOTONICALLY ' +
    'from S ~ 2561.39 at the band-bottom through S ~ 2558.12 at N_cross to S ~ 2555.18 at the band-top -- the ' +
    'closed-form dS/dN < 0 of imp-34929 realized on the actual band, no interior turning point. Since S is ' +
    'strictly decreasing, the CLOSEST APPROACH TO THE 2500 FLOOR is at the BAND-TOP: S_min_band ~ 2555.18 ' +
    '(= 25.55x the 100x safety factor), a residual ~55.18 ABOVE the closed-form floor S_inf = 2500. Every ' +
    'sampled S exceeds 2500 (min gap ~55.18 at band-top), so the floor is approached STRICTLY FROM ABOVE and ' +
    'NEVER touched within the band -- confirming S_inf = 2500 is the true infimum (the imp-35176 physical-branch ' +
    'min ~2500.02 is a FAR-TAIL value at N far beyond the band, not a band value). This completes the imp-35176 ' +
    'tabulation the ticket names and pins WHERE in the band the worst case lives (the top edge). EVIDENCE / ' +
    'measurement, NOT a machine certificate.',
  constants: {
    N_cross: +N_CROSS.toPrecision(15),
    band_bottom_N: +BAND_BOTTOM.toPrecision(15),
    band_top_N: +BAND_TOP.toPrecision(15),
    band_half_width_rho: +HALF_WIDTH.toPrecision(10),
    delta: DELTA,
    safety_factor: SAFETY_FACTOR,
    S_inf_floor: S_INF,
    K_amplitude: +K_AMPL.toPrecision(10),
  },
  measurement: {
    S_band_bottom: +S_BAND_BOTTOM.toFixed(4), // ~2561.39
    S_N_cross: +S_N_CROSS.toFixed(4), // ~2558.12
    S_band_top: +S_BAND_TOP.toFixed(4), // ~2555.18 (closest approach to the floor)
    band_min_headroom_S: +MIN_S_BAND.toFixed(4), // ~2555.18 (at band-top)
    band_max_headroom_S: +MAX_S_BAND.toFixed(4), // ~2561.39 (at band-bottom)
    N_at_closest_approach: +N_AT_MIN_S.toPrecision(12), // ~3.4515e9 (band-top)
    log10N_at_closest_approach: +Math.log10(N_AT_MIN_S).toFixed(4), // ~9.5380
    closest_approach_at_band_top: CLOSEST_APPROACH_AT_BAND_TOP, // true (strictly decreasing => min at top edge)
    closest_approach_gap_above_floor: +CLOSEST_APPROACH_GAP.toFixed(4), // ~55.18
    band_top_safety_multiple: +BAND_TOP_SAFETY_MULTIPLE.toFixed(4), // ~25.55x the 100x factor
    band_S_monotone_decreasing: BAND_MONOTONE_DECREASING, // true
    band_all_above_S_inf_floor: BAND_ALL_ABOVE_FLOOR, // true (floor attained from above, never touched in band)
  },
  subGap:
    'imp-34714a REMAINS OPEN. Tabulating the admissible-band S(N) profile (monotone descent from ~2561.39 to ' +
    '~2555.18, closest approach to the 2500 floor at the band-top, floor never touched in-band) does NOT prove ' +
    'a directed-rounding [g](m)/[F-prime] evaluation yields valid enclosures: it rests on the gamma(n)/k eps ' +
    'surrogate models of the imp-34687a directed-rounding layer, not that layer, and F(m) = 0 remains a ' +
    'double-precision artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK HEADROOM ADMISSIBLE-BAND S(N) PROFILE, TABULATED (frontier, NOT an RH bound). The ticket asked to ' +
    'tabulate S(N) = G/((1+G) delta FP_LO) across the imp-34693 admissible seed band with the full FP_LO ' +
    'dependence, locate the N of closest approach to 2500, and confirm the floor is attained from above -- ' +
    'imp-35176 had reported only the single physical-branch minimum ~2500.02. RESULT: across the band ' +
    '[3.1090e9, 3.4515e9] (k = 10 rung, N_cross ~ 3.2803e9, half-width ~1.7124e8) S(N) descends MONOTONICALLY ' +
    'from ~2561.39 (band-bottom) through ~2558.12 (N_cross) to ~2555.18 (band-top); the CLOSEST APPROACH to the ' +
    'closed-form floor S_inf = 1/(2 delta) = 2500 is at the BAND-TOP (S ~ 2555.18 = 25.55x the 100x safety ' +
    'factor, a residual ~55.18 above the floor), and every sampled value exceeds 2500, so the floor is ' +
    'approached STRICTLY FROM ABOVE and NEVER touched within the band. This CONFIRMS S_inf = 2500 is the true ' +
    'infimum (the imp-35176 min ~2500.02 is a far-tail value, not a band value) and COMPLETES the imp-35176 ' +
    'tabulation by locating the worst case at the band top edge. EVIDENCE, NOT a machine certificate. SUB-GAP ' +
    'imp-34714a REMAINS OPEN: rests on the gamma(n)/k eps surrogate models, not the imp-34687a directed-rounding ' +
    'layer, and F(m) = 0 remains a double-precision artifact. Measurement only on the inherited imp-3220/imp-3406 ' +
    'surrogate; reproduces the imp-35176/imp-35110/imp-34996 machinery (identical K, delta, N_cross, band); the ' +
    'C_C 1/8 ansatz (imp-2642/2643) and C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 ' +
    'untouched; far-tail exponent 1/2 per imp-3463 untouched; changes no bound; establishes no operator ' +
    'positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35176 (physical-branch min ~2500.02, floor from above; did not tabulate the band profile); imp-34996 ' +
    '(S_inf = 1/(2 delta) large-N floor); imp-34929 (closed-form dS/dN < 0; band-top worst case ~2555.18x); ' +
    'imp-35110 (small-N edge + FP_LO pole); imp-34817 (n_op* = G/((1+G) eps) contraction-validity ceiling); ' +
    'imp-34693 (admissible seed band + band-bottom/band-top); imp-33723 (Banach map g(N) = K log T0(N)); ' +
    'imp-2642 (C_C 1/8 ansatz); imp-3463 (far-tail exponent 1/2); lambda-rh-height-mapping (effectiveHeightForN ' +
    'RvM inverse). Grid tabulation of a rational form over a bounded band: standard.',
};

export const IMP35241_KRAWCZYK_HEADROOM_BAND_PROFILE_ASSERTIONS = [
  {
    // The admissible-band S(N) profile is monotone decreasing (imp-34929 dS/dN < 0) with every value above 2500.
    id: 'imp35241-band-monotone-above-floor',
    description: 'S(N) is monotone-decreasing across the imp-34693 admissible band and stays above S_inf = 2500',
    holds: () =>
      BAND_MONOTONE_DECREASING === true &&
      BAND_ALL_ABOVE_FLOOR === true &&
      MIN_S_BAND > S_INF &&
      MAX_S_BAND < 2600,
  },
  {
    // Closest approach to the 2500 floor is at the band-top, S ~ 2555.18 (~25.55x the 100x factor, gap ~55.18).
    id: 'imp35241-closest-approach-at-band-top',
    description: 'the closest approach to the 2500 floor is at the band-top (S ~ 2555.18, gap ~55.18 above floor)',
    holds: () =>
      CLOSEST_APPROACH_AT_BAND_TOP === true &&
      Math.abs(MIN_S_BAND - 2555.18) < 0.5 &&
      Math.abs(CLOSEST_APPROACH_GAP - 55.18) < 0.5 &&
      Math.abs(BAND_TOP_SAFETY_MULTIPLE - 25.55) < 0.05,
  },
  {
    // The band endpoints reproduce the imp-34929/34996 band-bottom/band-top figures (~2561.39 / ~2555.18).
    id: 'imp35241-band-endpoints-reproduced',
    description: 'band-bottom S ~ 2561.39 and band-top S ~ 2555.18 reproduce the imp-34929/34996 figures',
    holds: () =>
      Math.abs(S_BAND_BOTTOM - 2561.39) < 0.5 &&
      Math.abs(S_BAND_TOP - 2555.18) < 0.5 &&
      S_BAND_BOTTOM > S_N_CROSS &&
      S_N_CROSS > S_BAND_TOP,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp35241-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP35241_KRAWCZYK_HEADROOM_BAND_PROFILE.isRigorous === false &&
      /imp-34714a/.test(IMP35241_KRAWCZYK_HEADROOM_BAND_PROFILE.subGap) &&
      /REMAINS OPEN/.test(IMP35241_KRAWCZYK_HEADROOM_BAND_PROFILE.subGap) &&
      /NO QED/.test(IMP35241_KRAWCZYK_HEADROOM_BAND_PROFILE.verdict) &&
      /refereed bound is changed/i.test(IMP35241_KRAWCZYK_HEADROOM_BAND_PROFILE.verdict),
  },
];

for (const a of IMP35241_KRAWCZYK_HEADROOM_BAND_PROFILE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35241-krawczyk-headroom-band-profile assertion failed: ${a.id}`);
  }
}
