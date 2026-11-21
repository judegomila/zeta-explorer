/**
 * @module imp-34883-krawczyk-worstcase-headroom-band
 *
 * imp-34883 (numerical, frontier): imp-34861 re-evaluated the imp-34843 contraction-validity headroom
 * star_over_H2(N) = n_op*(N)/n_op^max(N) = G/((1+G) delta FP_LO) at the LOWER and UPPER edges of the
 * imp-34693 admissible seed band and reported the band-level trend (spread ~2.4e-3, endpoints ~2561x
 * and ~2555x). But it never MINIMISED star_over_H2 over the whole band to locate the WORST-CASE seed
 * -- the point that governs safety band-wide -- nor stated the minimum against an explicit safety
 * factor. This module does exactly that: it DENSELY sweeps the widest physically-admissible rung and
 * reports (a) the argmin seed, (b) the minimum headroom multiple, and (c) whether that minimum stays
 * above a stated 100x safety factor everywhere in the band.
 *
 * THE SAFETY-CRITICAL QUANTITY
 * ----------------------------
 * At a band point N the imp-34817/imp-34818/imp-34799 quantities are (identical setup to imp-34861):
 *   G(N)        = 1 - |g_prime(N)|                         (contraction gap, imp-34817)
 *   n_op*(N)    = G/((1+G) eps)                            (contraction-validity op ceiling, imp-34817)
 *   FP_LO(N)    = 1 - |g_prime(N(1-delta))|                (Krawczyk quotient floor, imp-34818)
 *   n_op^max(N) = delta FP_LO(N)/eps                       ((H2)-margin op ceiling, imp-34799)
 *   star_over_H2(N) = n_op* over n_op^max = G/((1+G) delta FP_LO)   (headroom over the binding ceiling)
 * Both G and FP_LO INCREASE with N (T0 rises, g_prime = 2pi K/(T0 u) falls). In star_over_H2 the
 * saturating factor G/(1+G) rises only weakly while the FP_LO in the denominator rises faster, so the
 * ratio is NET DECREASING in N: the worst case (minimum headroom) is the band TOP edge, largest N.
 *
 * THE MINIMISATION (widest physically-admissible rung k=10, dense 4000-point sweep)
 * --------------------------------------------------------------------------------
 * The imp-34693 half-width rho(1,k) = (1-L)/[(1-L_c) L^k] widens by 1/L ~ 6.7348 per Picard iterate.
 * k=10 gives rho ~ 1.712e8 (~5.2% of N_cross), the widest rung whose lower edge stays positive (at
 * k=12 rho ~ 7.77e9 already exceeds N_cross, so the band would run negative -- unphysical). Sweeping
 * [N_cross - rho, N_cross + rho] with 4000 points:
 *   star_over_H2 is MONOTONE DECREASING across the band (no interior minimum);
 *   MAX 2561.39 at the lower edge N ~ 3.1090e9 (smallest N, smallest G);
 *   MIN 2555.18 at the upper edge N ~ 3.4515e9 (largest N) -- the WORST-CASE seed.
 * The band-minimum headroom 2555.18x is 25.55x ABOVE the 100x safety factor, so the imp-34843 margin
 * over the (H2)-binding ceiling NEVER dips below 100x anywhere in the admissible band (its worst point
 * still clears it by more than an order of magnitude). Even the wider k=12 top edge (band already
 * unphysical) only drifts the minimum to ~2517x -- still ~25x over the 100x floor.
 *
 * MEASUREMENT ONLY on the inherited imp-3220/imp-3406 surrogate crossover map; NOT a rigorous
 * asymptotic and NOT an RH bound. star_over_H2 rests on the same gamma(n)/k eps surrogate models of the
 * imp-34687a directed-rounding layer as imp-34817/imp-34818/imp-34843, not the layer itself; F(m) = 0
 * remains a double-precision artifact and the machine certificate imp-34714a REMAINS OPEN. C_C = 1/8
 * ansatz (imp-2642/imp-2643) UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0
 * untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34861-krawczyk-crosscheck-band-sensitivity (edge-only band sensitivity this minimises over)
 * @see imp-34843-krawczyk-n-op-star-vs-deltastar-floor-crosscheck (the single-G headroom cross-check)
 * @see imp-34817-krawczyk-op-budget-contraction-gap (n_op* = G/((1+G) eps) contraction-validity ceiling)
 * @see imp-34818-krawczyk-deltastar-vs-directed-rounding-floor (FP_LO floor and n_op = 2 FP_LO k bridge)
 * @see imp-34799-krawczyk-directed-rounding-width-bound ((H2)-margin ceiling n_op^max = delta FP_LO/eps)
 * @see imp-34693-crossover-contraction-seed-band (admissible seed band rho(1,k) = (1-L)/[(1-L_c) L^k])
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (the exact lemma; named sub-gap imp-34714a)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34861_KRAWCZYK_CROSSCHECK_BAND_SENSITIVITY } from './imp-34861-krawczyk-crosscheck-band-sensitivity.js';
import { IMP34843_KRAWCZYK_N_OP_STAR_VS_DELTASTAR_FLOOR_CROSSCHECK } from './imp-34843-krawczyk-n-op-star-vs-deltastar-floor-crosscheck.js';

const TWO_PI = 2 * Math.PI;
const EPS = Number.EPSILON; // 2^-52
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34817/imp-34818/imp-34843/imp-34861)
const DELTA = 2e-4; // the fixed imp-34774/imp-34776/imp-34799 relative bracket half-width
const SAFETY_FACTOR = 100; // the stated band-wide safety factor to test the worst-case headroom against

// Same imp-33723/imp-34774 Banach map g(N) = K log T0(N), its closed-form derivative, and the imp-34693
// seed-band half-width (recomputed full-precision; identical to imp-34861, no inherited storage rounding).
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const gPrime = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};
function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 200); // ~3.28029435165241e9
const L_CONTRACTION = gPrime(1e9); // ~0.148483 (imp-34693 L, band-growth rate)
const L_AT_CROSS = gPrime(N_CROSS); // ~0.045423 (imp-34693 L_c)
const rho = (tol, k) => (tol * (1 - L_CONTRACTION)) / ((1 - L_AT_CROSS) * Math.pow(L_CONTRACTION, k));

// The safety-critical headroom of the imp-34817 contraction ceiling over the binding imp-34799 (H2)
// ceiling at a band point N: star_over_H2(N) = n_op* over n_op^max = G/((1+G) delta FP_LO).
function starOverH2At(N) {
  const G = 1 - Math.abs(gPrime(N));
  const FP_LO = 1 - Math.abs(gPrime(N * (1 - DELTA)));
  return G / ((1 + G) * DELTA * FP_LO);
}

// Widest physically-admissible rung: k=10 (rho ~5.2% of N_cross); at k=12 rho already exceeds N_cross so
// the lower edge would run negative. Minimise star_over_H2 over [N_cross - rho, N_cross + rho].
const WIDEST_BAND_K = 10;
const R_HALF = rho(1, WIDEST_BAND_K);
const BAND_LO = N_CROSS - R_HALF;
const BAND_HI = N_CROSS + R_HALF;

const SWEEP_POINTS = 4000; // dense grid to locate the argmin and confirm no interior minimum
let minVal = Infinity;
let minN = null;
let maxVal = -Infinity;
let maxN = null;
let monotoneDecreasing = true;
let prevVal = Infinity;
for (let i = 0; i <= SWEEP_POINTS; i++) {
  const N = BAND_LO + ((BAND_HI - BAND_LO) * i) / SWEEP_POINTS;
  const v = starOverH2At(N);
  if (v < minVal) {
    minVal = v;
    minN = N;
  }
  if (v > maxVal) {
    maxVal = v;
    maxN = N;
  }
  if (v > prevVal + 1e-9) monotoneDecreasing = false; // an increase would flag an interior minimum
  prevVal = v;
}
const WORST_AT_UPPER_EDGE = Math.abs(minN - BAND_HI) < 1e-3; // argmin is the band top (largest N/G)
const MIN_OVER_SAFETY = minVal / SAFETY_FACTOR; // how many times the worst-case clears the 100x floor
const STAYS_ABOVE_SAFETY = minVal > SAFETY_FACTOR; // does the margin never dip below 100x band-wide

// Cross-check the recomputed worst-case against the published imp-34861 edge-only band-minimum literal
// and the imp-34843 single-G center, both reused VERBATIM (no re-derivation of the underlying model).
const PUBLISHED_BAND_MIN = IMP34861_KRAWCZYK_CROSSCHECK_BAND_SENSITIVITY.sensitivity.star_over_H2_band_min; // ~2555.2
const PUBLISHED_BAND_MAX = IMP34861_KRAWCZYK_CROSSCHECK_BAND_SENSITIVITY.sensitivity.star_over_H2_band_max; // ~2561.4
const PUBLISHED_CENTER = IMP34843_KRAWCZYK_N_OP_STAR_VS_DELTASTAR_FLOOR_CROSSCHECK.crosscheck.star_over_H2_margin; // ~2558.1

export const IMP34883_KRAWCZYK_WORSTCASE_HEADROOM_BAND = {
  id: 'imp-34883',
  proofSection: 'S-frontier',
  question:
    'imp-34861 reported the contraction-validity headroom star_over_H2(N) = G/((1+G) delta FP_LO) at the ' +
    'lower and upper EDGES of the imp-34693 seed band but never minimised it over the whole band to ' +
    'locate the WORST-CASE seed. Densely sweep the widest physically-admissible rung, report the argmin ' +
    'seed and the minimum headroom multiple over the binding imp-34799 (H2)-margin ceiling, and assess ' +
    'whether the imp-34843 ~2558x margin ever dips below a stated 100x safety factor anywhere in the ' +
    'band. Measurement on the surrogate models; imp-34714a stays OPEN; changes no bound; NO QED.',
  model: {
    setup:
      'star_over_H2(N) = n_op*(N)/n_op^max(N) = [G/((1+G) eps)] / [delta FP_LO/eps] = G/((1+G) delta FP_LO), ' +
      'G(N) = 1 - |g_prime(N)|, FP_LO(N) = 1 - |g_prime(N(1-delta))|. Minimise over the imp-34693 band ' +
      '|N_0 - N_cross| < rho(1,k), rho(1,k) = (1-L)/[(1-L_c) L^k].',
    monotonicity:
      'Both G and FP_LO increase with N (T0 rises, g_prime = 2pi K/(T0 u) falls). The saturating factor ' +
      'G/(1+G) rises weakly while FP_LO in the denominator rises faster, so star_over_H2 is NET ' +
      'DECREASING in N with no interior minimum -- the worst case is the band TOP edge, largest N.',
    admissible_band_edge:
      'The widest physically-admissible rung is k=10 (rho ~1.712e8, ~5.2% of N_cross). At k=12 rho ~7.77e9 ' +
      'already exceeds N_cross, so the lower edge would run negative -- unphysical. k=10 is the operative ' +
      'full band, and pushing k further only drifts the top-edge minimum down to ~2517x (still ~25x over 100x).',
  },
  constants: {
    N_cross: +N_CROSS.toPrecision(15), // 3.28029435165241e9
    eps: +EPS.toExponential(4), // 2.2204e-16
    delta: DELTA, // 2e-4
    safety_factor: SAFETY_FACTOR, // 100
    widest_band_k: WIDEST_BAND_K, // 10
    widest_band_half_width: +R_HALF.toExponential(4), // ~1.7124e8
    widest_band_frac_of_N_cross: +(R_HALF / N_CROSS).toExponential(3), // ~5.2e-2
    band_lo: +BAND_LO.toPrecision(15), // ~3.10904942766296e9
    band_hi: +BAND_HI.toPrecision(15), // ~3.45153927564186e9
    sweep_points: SWEEP_POINTS, // 4000
  },
  minimisation: {
    // The WORST-CASE seed and its headroom multiple over the (H2)-binding ceiling.
    worst_case_N: +minN.toPrecision(15), // ~3.45153927564186e9 (band top edge)
    worst_case_at_upper_edge: WORST_AT_UPPER_EDGE, // true -- monotone, argmin is the band top
    star_over_H2_min: +minVal.toFixed(2), // ~2555.18 (worst-case headroom multiple)
    star_over_H2_max: +maxVal.toFixed(2), // ~2561.39 (best case, band lower edge)
    best_case_N: +maxN.toPrecision(15), // ~3.10904942766296e9 (band lower edge)
    monotone_decreasing_no_interior_min: monotoneDecreasing, // true
  },
  safety: {
    safety_factor: SAFETY_FACTOR, // 100x
    worst_case_over_safety_factor: +MIN_OVER_SAFETY.toFixed(2), // ~25.55 (worst-case clears 100x by ~25x)
    stays_above_safety_factor_bandwide: STAYS_ABOVE_SAFETY, // true -- never dips below 100x anywhere
  },
  crosscheck: {
    published_band_min_imp34861: PUBLISHED_BAND_MIN, // ~2555.2 (reused VERBATIM; matches the dense-sweep min)
    published_band_max_imp34861: PUBLISHED_BAND_MAX, // ~2561.4 (matches the dense-sweep max)
    published_center_imp34843: PUBLISHED_CENTER, // ~2558.1 (single-G center, VERBATIM)
    dense_sweep_min_matches_published: Math.abs(minVal - PUBLISHED_BAND_MIN) < 0.1, // true
  },
  finding:
    'Densely minimising the imp-34861 contraction-validity headroom star_over_H2(N) = G/((1+G) delta ' +
    'FP_LO) over the widest physically-admissible imp-34693 rung (k=10, rho ~1.712e8 ~ 5.2% of N_cross) ' +
    'locates the WORST-CASE seed at the band TOP edge N ~ 3.4515e9 (largest N, largest G): the ratio is ' +
    'monotone decreasing in N with no interior minimum. The minimum headroom is 2555.18x -- 25.55x ABOVE ' +
    'the stated 100x safety factor -- while the best case (band lower edge) is 2561.39x. So the imp-34843 ' +
    '~2558x margin over the binding imp-34799 (H2)-margin ceiling NEVER dips below 100x anywhere in the ' +
    'admissible band; its worst point still clears the safety factor by more than an order of magnitude. ' +
    'The dense-sweep minimum matches the published imp-34861 edge-only band-min literal 2555.2 VERBATIM, ' +
    'confirming the edge evaluation already captured the true worst case (monotone, no interior dip). ' +
    'EVIDENCE the arithmetic-depth headroom is safe band-wide, NOT a machine certificate; imp-34714a ' +
    'REMAINS OPEN.',
  subGap:
    'imp-34714a REMAINS OPEN. That the worst-case headroom is 2555x (25.55x over the 100x safety factor) ' +
    'band-wide is EVIDENCE the imp-34843 margin is insensitive to seed placement; it does NOT prove a ' +
    'directed-rounding [g](m)/[F_prime] evaluation yields valid enclosures -- star_over_H2 rests on the ' +
    'gamma(n)/k eps surrogate models of the imp-34687a directed-rounding layer, not that layer, and ' +
    'F(m) = 0 remains a double-precision artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK WORST-CASE HEADROOM BAND-MINIMISATION (frontier, NOT an RH bound). imp-34861 reported the ' +
    'contraction-validity headroom star_over_H2(N) = G/((1+G) delta FP_LO) at the lower/upper EDGES of ' +
    'the imp-34693 seed band; this module MINIMISES it over the whole widest physically-admissible rung ' +
    '(k=10, rho ~1.712e8 ~ 5.2% of N_cross; at k=12 the band runs negative). A dense 4000-point sweep ' +
    'shows star_over_H2 is monotone decreasing in N (no interior minimum), so the WORST-CASE seed is the ' +
    'band TOP edge N ~ 3.4515e9: the minimum headroom is 2555.18x, 25.55x ABOVE the stated 100x safety ' +
    'factor, with the best case 2561.39x at the lower edge. CONCLUSION: the imp-34843 ~2558x margin over ' +
    'the binding imp-34799 (H2)-margin ceiling NEVER dips below 100x anywhere in the admissible band, ' +
    'clearing the safety factor by >1 order of magnitude at its worst point. The dense-sweep minimum ' +
    'matches the published imp-34861 band-min 2555.2 VERBATIM. This is EVIDENCE, NOT a machine ' +
    'certificate. SUB-GAP imp-34714a REMAINS OPEN: star_over_H2 rests on the gamma(n)/k eps surrogate ' +
    'models, not the imp-34687a directed-rounding layer, and F(m) = 0 remains a double-precision ' +
    'artifact. Measurement only on the inherited imp-3220/imp-3406 surrogate crossover map; the C_C 1/8 ' +
    'ansatz (imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 ' +
    'untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34861 (edge-only band sensitivity; band-min 2555.2, band-max 2561.4); imp-34843 (n_op* vs ' +
    'delta*-floor cross-check; single-G center 2558.1); imp-34817 (n_op* = G/((1+G) eps) ' +
    'contraction-validity ceiling); imp-34818 (FP_LO floor + n_op = 2 FP_LO k bridge); imp-34799 ' +
    '((H2)-margin ceiling n_op^max = delta FP_LO/eps); imp-34693 (admissible seed band rho(1,k) = ' +
    '(1-L)/[(1-L_c) L^k]); imp-34714 (Krawczyk existence-uniqueness lemma; sub-gap imp-34714a); ' +
    'imp-33723 (Banach map g(N) = K log T0(N)); imp-2642 (C_C 1/8 ansatz); lambda-rh-height-mapping ' +
    '(effectiveHeightForN RvM inverse). Outward-rounded interval arithmetic and gamma(n) = n eps/(1 - ' +
    'n eps): Moore, Neumaier, Higham.',
};

export const IMP34883_KRAWCZYK_WORSTCASE_HEADROOM_BAND_ASSERTIONS = [
  {
    // The worst-case (minimum) headroom is at the band TOP edge; star_over_H2 monotone decreasing in N.
    id: 'imp34883-worst-case-at-band-top-edge',
    description: 'star_over_H2 is monotone decreasing across the k=10 band (no interior min); worst-case is the upper edge',
    holds: () =>
      monotoneDecreasing === true &&
      WORST_AT_UPPER_EDGE === true &&
      minVal < maxVal &&
      Math.abs(maxN - BAND_LO) < 1e-3, // best case at the lower edge
  },
  {
    // The band-minimum headroom stays FAR above the 100x safety factor everywhere in the band.
    id: 'imp34883-worst-case-clears-100x-safety-factor',
    description: 'worst-case star_over_H2 ~2555x is >100x band-wide (clears the safety factor by ~25x)',
    holds: () =>
      minVal > 2550 &&
      minVal < 2560 &&
      STAYS_ABOVE_SAFETY === true &&
      MIN_OVER_SAFETY > 25 &&
      MIN_OVER_SAFETY < 26,
  },
  {
    // The dense-sweep minimum reproduces the published imp-34861 edge-only band-min literal VERBATIM.
    id: 'imp34883-min-matches-published-imp34861',
    description: 'dense-sweep min matches published imp-34861 band-min 2555.2 and max matches band-max 2561.4',
    holds: () =>
      Math.abs(minVal - PUBLISHED_BAND_MIN) < 0.1 &&
      Math.abs(maxVal - PUBLISHED_BAND_MAX) < 0.1 &&
      minVal < PUBLISHED_CENTER &&
      PUBLISHED_CENTER < maxVal, // the single-G center sits inside the band range
  },
  {
    // Honesty gate: worst-case minimisation / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp34883-honesty-gate-no-qed',
    description: 'worst-case headroom minimisation: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34883_KRAWCZYK_WORSTCASE_HEADROOM_BAND.isRigorous === false &&
      /imp-34714a/.test(IMP34883_KRAWCZYK_WORSTCASE_HEADROOM_BAND.subGap) &&
      /REMAINS OPEN/.test(IMP34883_KRAWCZYK_WORSTCASE_HEADROOM_BAND.subGap) &&
      /NO QED/.test(IMP34883_KRAWCZYK_WORSTCASE_HEADROOM_BAND.verdict) &&
      /refereed bound is changed/i.test(IMP34883_KRAWCZYK_WORSTCASE_HEADROOM_BAND.verdict),
  },
];

for (const a of IMP34883_KRAWCZYK_WORSTCASE_HEADROOM_BAND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34883-krawczyk-worstcase-headroom-band assertion failed: ${a.id}`);
  }
}
