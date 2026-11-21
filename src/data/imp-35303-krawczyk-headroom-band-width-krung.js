/**
 * @module imp-35303-krawczyk-headroom-band-width-krung
 *
 * imp-35241 tabulated the Krawczyk contraction-validity headroom S(N) = G/((1+G) delta FP_LO) across the
 * imp-34693 admissible seed band, but ONLY on the widest (k = 10) rung -- half-width rho(1,10) ~ 1.7124e8,
 * band [3.1090e9, 3.4515e9] -- and found its worst case (smallest headroom, closest approach to the closed-form
 * floor S_inf = 1/(2 delta) = 2500) at the BAND-TOP: S ~ 2555.18. Because S is STRICTLY DECREASING in N
 * (imp-34929 dS/dN < 0), a NARROWER admissible rung (k < 10) has a band-top at a SMALLER N and therefore a
 * LARGER band-top headroom. This module supplies the missing band-WIDTH profile: band-top S(k) across the
 * imp-34693 rungs k = 1..10.
 *
 * WHAT THE MEASUREMENT TABULATES (the band-top S(k)-vs-rung profile the ticket names)
 * ----------------------------------------------------------------------------------
 * The imp-34693 rungs are nested bands centered on N_cross ~ 3.2803e9 with half-widths
 * rho(1,k) = (1 - L)/((1 - L_c) L^k), L ~ 0.14848 (imp-34693 contraction factor). Since L < 1, rho GROWS with k,
 * so k = 10 is the WIDEST rung and k = 1 the NARROWEST. For each rung the band-top is N_top(k) = N_cross + rho(1,k)
 * and its worst-case (smallest-in-band) headroom is S_top(k) = S(N_top(k)). Sampling k = 1..10:
 *   (Q1) S_top(k) DESCENDS MONOTONICALLY as the band WIDENS -- from S_top ~ 2558.12 at the narrow k = 1 rung
 *        (band-top essentially at N_cross, rho ~ 6.0) down to S_top ~ 2555.18 at the widest k = 10 rung
 *        (rho ~ 1.7124e8). Every widening step lowers the worst-case headroom (dS/dN < 0 propagated through the
 *        band-top N_top(k) which grows with k). The narrow rungs k = 1..4 are so tight (rho < 2e3, N_top - N_cross
 *        below the S resolution) that S_top(k) sits at the N_cross value ~2558.12 to four decimals; the tightening
 *        only becomes visible once rho exceeds ~1e4 (k >= 5).
 *   (Q2) THE k = 10 RUNG IS THE BINDING WORST CASE. S_top(k) is minimized at the widest rung k = 10
 *        (S_top ~ 2555.18 = 25.55x the 100x safety factor), confirming the imp-35241 band-top figure is the
 *        smallest-headroom point across ALL admissible rungs, not merely within the k = 10 band. The narrowest
 *        rung k = 1 gives the largest band-top headroom (~2558.12 = 25.58x).
 *   (Q3) THE WORST-CASE TIGHTENS BY ONLY ~2.94 ACROSS THE FULL RUNG LADDER. From k = 1 to k = 10 the band-top
 *        headroom drops from ~2558.12 to ~2555.18, a total tightening of ~2.94 (from 25.58x to 25.55x the 100x
 *        factor). Even at the binding widest rung the worst case clears the 100x safety factor by 25.55x and every
 *        rung stays FAR above the S_inf = 2500 floor (min gap ~55.18 at k = 10). Widening the admissible band from
 *        the narrowest to the widest rung costs the contraction-validity worst case under 0.12% of its headroom.
 *
 * CONSEQUENCE: THE k = 10 WIDEST-RUNG BAND-TOP IS THE GLOBAL WORST CASE ACROSS THE ADMISSIBLE RUNG LADDER
 * -----------------------------------------------------------------------------------------------------
 * imp-35241 located the worst case within the k = 10 band; this module confirms the k = 10 rung is itself the
 * binding rung -- band-top S(k) is monotone decreasing in the band width, so the widest admissible band carries
 * the smallest worst-case headroom (~2555.18), and no narrower rung can dip below it. The band could not be made
 * WIDER without leaving the imp-34693 admissible set, so ~2555.18 = 25.55x is the tightest contraction-validity
 * headroom the admissible seed band realizes.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate; reproduces the imp-35241/imp-35176/imp-34996
 * machinery (identical K, delta, N_cross, rungs). The imp-34714a machine certificate REMAINS OPEN; F(m) = 0
 * stays a double-precision artifact; C_C = 1/8 (imp-2642/2643) UNTOUCHED; C_mb GUE-conditional per imp-486
 * UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent 1/2 per imp-3463 untouched; establishes no operator
 * positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35241-krawczyk-headroom-band-profile (profiled S only on the widest k = 10 rung; band-top ~2555.18)
 * @see imp-34996-krawczyk-headroom-safety-factor-asymptote (S_inf = 1/(2 delta) large-N floor)
 * @see imp-34929-krawczyk-headroom-monotonicity-derivative (closed-form dS/dN < 0; strictly decreasing S)
 * @see imp-34693-crossover-contraction-seed-band (admissible seed band + rung half-widths rho(1,k))
 * @see imp-35300-krawczyk-headroom-delta-star-to-100 (delta-axis dual; fixed band, swept bracket half-width)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 RvM inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-35241/imp-35176/imp-34996)
const DELTA = 2e-4; // the fixed imp-34774/34776/34799 relative bracket half-width
const SAFETY_FACTOR = 100; // the imp-34799/34817 contraction-validity safety factor
const S_INF = 1 / (2 * DELTA); // 2500 exactly (imp-34996 large-N floor)

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
const WIDEST_BAND_K = 10; // widest physically-admissible rung (imp-34693/34929/34996)

// star_over_H2(N) = G/((1+G) delta FP_LO), the contraction-validity headroom (imp-34929/34996) with FULL FP_LO.
function headroomAt(N) {
  const G = 1 - aOf(N);
  const FP_LO = 1 - aOf(N * (1 - DELTA));
  return G / ((1 + G) * DELTA * FP_LO);
}

// Tabulate the band-top headroom S_top(k) = S(N_cross + rho(1,k)) across the imp-34693 rungs k = 1..10: confirm
// it is monotone-decreasing in the band width (the imp-34929 dS/dN < 0 propagated through the band-top N which
// grows with k), that the widest k = 10 rung is the binding (smallest) worst case, and that every rung clears the
// S_inf = 2500 floor and the 100x safety factor.
const RUNG_PROFILE = [];
let RUNG_MONOTONE_DECREASING = true;
let RUNG_ALL_ABOVE_FLOOR = true;
{
  let prevS = null;
  for (let k = 1; k <= WIDEST_BAND_K; k++) {
    const halfWidth = rho(1, k);
    const N_top = N_CROSS + halfWidth;
    const S_top = headroomAt(N_top);
    if (S_top <= S_INF) RUNG_ALL_ABOVE_FLOOR = false;
    if (prevS !== null && S_top > prevS + 1e-9) RUNG_MONOTONE_DECREASING = false;
    RUNG_PROFILE.push({
      k,
      half_width_rho: +halfWidth.toExponential(5),
      N_top: +N_top.toPrecision(12),
      S_top: +S_top.toFixed(4),
      safety_multiple: +(S_top / SAFETY_FACTOR).toFixed(4),
      gap_above_floor: +(S_top - S_INF).toFixed(4),
    });
    prevS = S_top;
  }
}
const S_TOP_NARROWEST = RUNG_PROFILE[0].S_top; // ~2558.1230 (k = 1, largest band-top headroom)
const S_TOP_WIDEST = RUNG_PROFILE[WIDEST_BAND_K - 1].S_top; // ~2555.1835 (k = 10, binding worst case)
const WIDEST_IS_BINDING = RUNG_PROFILE.every((r) => r.S_top >= S_TOP_WIDEST); // true (k = 10 minimizes S_top)
const RUNG_LADDER_TIGHTENING = +(S_TOP_NARROWEST - S_TOP_WIDEST).toFixed(4); // ~2.94 (k = 1 -> k = 10 drop)

export const IMP35303_KRAWCZYK_HEADROOM_BAND_WIDTH_KRUNG = {
  id: 'imp-35303',
  proofSection: 'S-frontier',
  question:
    'imp-35241 profiled the Krawczyk contraction-validity headroom S(N) = G/((1+G) delta FP_LO) only on the ' +
    'widest (k = 10) imp-34693 rung (half-width rho(1,10) ~ 1.7124e8, band-top S ~ 2555.18). Because S is ' +
    'strictly decreasing in N (imp-34929 dS/dN < 0), a narrower rung (k < 10) has a band-top at smaller N and ' +
    'thus a larger worst-case headroom. Tabulate band-top S(k) across the imp-34693 rungs k = 1..10 to show how ' +
    'the worst case tightens as the band widens, and confirm the k = 10 rung is the binding (smallest-headroom) ' +
    'worst case. Measurement only; surrogate; imp-34714a stays OPEN; changes no bound; NO QED.',
  finding:
    'Across the imp-34693 rung ladder k = 1..10 (nested bands centered on N_cross ~ 3.2803e9 with half-widths ' +
    'rho(1,k) = (1 - L)/((1 - L_c) L^k) growing from rho ~ 6.0 at k = 1 to rho ~ 1.7124e8 at k = 10) the band-top ' +
    'worst-case headroom S_top(k) = S(N_cross + rho(1,k)) DESCENDS MONOTONICALLY as the band WIDENS -- from ' +
    'S_top ~ 2558.12 at the narrow k = 1 rung down to S_top ~ 2555.18 at the widest k = 10 rung (the imp-34929 ' +
    'dS/dN < 0 propagated through the band-top N which grows with k). The k = 10 rung is the BINDING worst case: ' +
    'its band-top S ~ 2555.18 (= 25.55x the 100x safety factor) is the smallest headroom across ALL admissible ' +
    'rungs, confirming the imp-35241 band-top figure is the GLOBAL worst case over the rung ladder, not merely ' +
    'within the k = 10 band. The total tightening from the narrowest to the widest rung is only ~2.94 (from ' +
    '25.58x to 25.55x the 100x factor), under 0.12% of the headroom; the narrow rungs k = 1..4 sit at the ' +
    'N_cross value ~2558.12 to four decimals (rho below the S resolution) and the tightening only becomes ' +
    'visible for k >= 5. Every rung clears the S_inf = 2500 floor (min gap ~55.18 at k = 10). EVIDENCE / ' +
    'measurement, NOT a machine certificate.',
  constants: {
    N_cross: +N_CROSS.toPrecision(15),
    L_contraction: +L_CONTRACTION.toPrecision(10),
    L_at_cross: +L_AT_CROSS.toPrecision(10),
    delta: DELTA,
    safety_factor: SAFETY_FACTOR,
    S_inf_floor: S_INF,
    K_amplitude: +K_AMPL.toPrecision(10),
    widest_rung_k: WIDEST_BAND_K,
  },
  measurement: {
    rung_profile: RUNG_PROFILE, // band-top S_top(k) for k = 1..10 (half-width, N_top, S_top, multiple, gap)
    S_top_narrowest_k1: S_TOP_NARROWEST, // ~2558.1230 (largest band-top headroom, narrowest band)
    S_top_widest_k10: S_TOP_WIDEST, // ~2555.1835 (binding worst case, widest band)
    widest_rung_is_binding: WIDEST_IS_BINDING, // true (k = 10 minimizes S_top over the ladder)
    rung_ladder_tightening_k1_to_k10: RUNG_LADDER_TIGHTENING, // ~2.94 (total headroom drop across the ladder)
    rung_S_top_monotone_decreasing: RUNG_MONOTONE_DECREASING, // true (widening lowers the worst-case headroom)
    rung_all_above_S_inf_floor: RUNG_ALL_ABOVE_FLOOR, // true (every rung stays above the 2500 floor)
  },
  subGap:
    'imp-34714a REMAINS OPEN. Tabulating band-top S(k) across the imp-34693 rungs (monotone descent from ' +
    '~2558.12 at k = 1 to ~2555.18 at k = 10, widest rung binding, floor never touched) does NOT prove a ' +
    'directed-rounding [g](m)/[F-prime] evaluation yields valid enclosures: it rests on the gamma(n)/k eps ' +
    'surrogate models of the imp-34687a directed-rounding layer, not that layer, and F(m) = 0 remains a ' +
    'double-precision artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK HEADROOM BAND-WIDTH (k-RUNG) PROFILE, TABULATED (frontier, NOT an RH bound). The ticket asked to ' +
    'tabulate band-top S(k) = G/((1+G) delta FP_LO) evaluated at N_cross + rho(1,k) across the imp-34693 rungs ' +
    'k = 1..10 and confirm the k = 10 rung is the binding (smallest-headroom) worst case -- imp-35241 had ' +
    'profiled S only on the widest k = 10 rung. RESULT: band-top S_top(k) descends MONOTONICALLY as the band ' +
    'widens, from ~2558.12 at the narrow k = 1 rung (rho ~ 6.0) to ~2555.18 at the widest k = 10 rung ' +
    '(rho ~ 1.7124e8); the k = 10 rung MINIMIZES S_top over the ladder (~2555.18 = 25.55x the 100x safety ' +
    'factor), so it is the GLOBAL worst case across all admissible rungs, confirming the imp-35241 band-top ' +
    'figure. The total tightening from narrowest to widest rung is only ~2.94 (25.58x -> 25.55x, under 0.12% of ' +
    'the headroom), and every rung stays above the S_inf = 1/(2 delta) = 2500 floor (min gap ~55.18 at k = 10). ' +
    'EVIDENCE, NOT a machine certificate. SUB-GAP imp-34714a REMAINS OPEN: rests on the gamma(n)/k eps surrogate ' +
    'models, not the imp-34687a directed-rounding layer, and F(m) = 0 remains a double-precision artifact. ' +
    'Measurement only on the inherited imp-3220/imp-3406 surrogate; reproduces the imp-35241/imp-35176/imp-34996 ' +
    'machinery (identical K, delta, N_cross, rungs); the C_C 1/8 ansatz (imp-2642/2643) and C_mb GUE-conditional ' +
    'per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; far-tail exponent 1/2 per imp-3463 untouched; ' +
    'changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35241 (profiled S only on the widest k = 10 rung; band-top S ~ 2555.18); imp-34996 (S_inf = 1/(2 delta) ' +
    'large-N floor); imp-34929 (closed-form dS/dN < 0; strictly decreasing S); imp-35176 (physical-branch min ' +
    '~2500.02, floor from above); imp-34693 (admissible seed band + rung half-widths rho(1,k)); imp-35300 ' +
    '(delta-axis dual: fixed band, swept bracket half-width delta); imp-33723 (Banach map g(N) = K log T0(N)); ' +
    'imp-2642 (C_C 1/8 ansatz); imp-3463 (far-tail exponent 1/2); lambda-rh-height-mapping (effectiveHeightForN ' +
    'RvM inverse). Grid tabulation of a rational form at a family of nested band edges: standard.',
};

export const IMP35303_KRAWCZYK_HEADROOM_BAND_WIDTH_KRUNG_ASSERTIONS = [
  {
    // Band-top S(k) is monotone decreasing in the band width (widening the band lowers the worst-case headroom).
    id: 'imp35303-band-top-monotone-decreasing-in-width',
    description: 'band-top S_top(k) is monotone-decreasing across the imp-34693 rungs k = 1..10 (widening lowers S)',
    holds: () =>
      RUNG_MONOTONE_DECREASING === true &&
      RUNG_ALL_ABOVE_FLOOR === true &&
      RUNG_PROFILE.length === 10 &&
      S_TOP_NARROWEST > S_TOP_WIDEST,
  },
  {
    // The widest k = 10 rung is the binding (smallest-headroom) worst case, S ~ 2555.18 (~25.55x the 100x factor).
    id: 'imp35303-widest-rung-is-binding',
    description: 'the widest k = 10 rung minimizes band-top S over the ladder (S ~ 2555.18, binding worst case)',
    holds: () =>
      WIDEST_IS_BINDING === true &&
      Math.abs(S_TOP_WIDEST - 2555.18) < 0.5 &&
      Math.abs(RUNG_PROFILE[WIDEST_BAND_K - 1].safety_multiple - 25.55) < 0.05 &&
      RUNG_PROFILE[WIDEST_BAND_K - 1].gap_above_floor > 0,
  },
  {
    // The narrowest rung reproduces the imp-35241 N_cross headroom ~2558.12 and the ladder tightens by only ~2.94.
    id: 'imp35303-narrow-rung-and-ladder-tightening',
    description: 'narrowest k = 1 rung S ~ 2558.12 (imp-35241 N_cross value) and the k1->k10 tightening is ~2.94',
    holds: () =>
      Math.abs(S_TOP_NARROWEST - 2558.12) < 0.5 &&
      Math.abs(RUNG_LADDER_TIGHTENING - 2.94) < 0.5 &&
      RUNG_LADDER_TIGHTENING > 0 &&
      RUNG_LADDER_TIGHTENING < S_TOP_WIDEST - S_INF,
  },
  {
    // Honesty gate: measurement / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp35303-honesty-gate-no-qed',
    description: 'measurement: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP35303_KRAWCZYK_HEADROOM_BAND_WIDTH_KRUNG.isRigorous === false &&
      /imp-34714a/.test(IMP35303_KRAWCZYK_HEADROOM_BAND_WIDTH_KRUNG.subGap) &&
      /REMAINS OPEN/.test(IMP35303_KRAWCZYK_HEADROOM_BAND_WIDTH_KRUNG.subGap) &&
      /NO QED/.test(IMP35303_KRAWCZYK_HEADROOM_BAND_WIDTH_KRUNG.verdict) &&
      /refereed bound is changed/i.test(IMP35303_KRAWCZYK_HEADROOM_BAND_WIDTH_KRUNG.verdict),
  },
];

for (const a of IMP35303_KRAWCZYK_HEADROOM_BAND_WIDTH_KRUNG_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35303-krawczyk-headroom-band-width-krung assertion failed: ${a.id}`);
  }
}
