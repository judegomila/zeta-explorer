/**
 * @module imp-34861-krawczyk-crosscheck-band-sensitivity
 *
 * imp-34861 (numerical, frontier): imp-34843 cross-tabulated the imp-34817 contraction-validity
 * op-count ceiling n_op* = G/((1+G) eps) ~ 2.20e15 against the imp-34818 directed-rounding floor and
 * found the two surrogate views of the certified image disagree at n_op* by EXACTLY the fixed factor
 * 1 + G ~ 1.9546, with the contraction-validity bracket [n_op*, FP_LO/eps] = [2.20e15, 4.30e15] sitting
 * ~2558x-5001x ABOVE the binding imp-34799 (H2)-margin ceiling n_op^max ~ 8.60e11. BUT the contraction
 * gap G = 1 - |g_prime| was frozen at a SINGLE point N_cross. Because g_prime depends on N through
 * g_prime(N) = 2pi K/(T0(N) u), u = log(T0/2pi), G drifts as the seed moves off N_cross. This module
 * MEASURES the sensitivity of 1 + G and both bracket endpoints to G by re-evaluating them across the
 * imp-34693 admissible seed band |N_0 - N_cross| < rho(1,k), and reports whether the ~2558x headroom
 * over the (H2)-margin ceiling is UNIFORM across the whole band.
 *
 * THE SENSITIVITY SETUP
 * ---------------------
 * At any band point N the three imp-34843 quantities become functions of the local gap G(N):
 *   G(N)        = 1 - |g_prime(N)|                                  (contraction gap at N)
 *   n_op*(N)    = G(N)/((1 + G(N)) eps)                             (imp-34817 op-count ceiling)
 *   FP_LO(N)/eps= (1 - |g_prime(N(1-delta))|)/eps                   (imp-34818 linear-floor span endpoint)
 *   n_op^max(N) = delta FP_LO(N)/eps                                (imp-34799 (H2)-margin ceiling)
 * and the reported headroom is star_over_H2(N) = n_op*(N)/n_op^max(N) = G/((1+G) delta FP_LO). The
 * imp-34693 seed band is centered on N_cross with half-width rho(1,k) = (1-L)/[(1-L_c) L^k] that widens
 * by 1/L ~ 6.7348 per Picard iterate; only the widest rung k=10 (half-width ~1.71e8, ~5.2% of N_cross)
 * moves G enough to see. Since T0 increases with N and g_prime = 2pi K/(T0 u) decreases, G(N) is
 * INCREASING in N, so the band lower edge minimizes G and the upper edge maximizes it.
 *
 * MEASUREMENT (widest rung k=10, band [N_cross - 1.71e8, N_cross + 1.71e8])
 * ------------------------------------------------------------------------
 *   quantity          lower edge      center (N_cross)   upper edge      relative spread
 *   G = 1 - |g_prime| 0.952082        0.954577           0.956824        ~2.4e-3
 *   1 + G             1.952082        1.954577           1.956824        ~2.4e-3
 *   n_op*             2.1965e15       2.1995e15          2.2021e15       ~2.5e-3
 *   FP_LO/eps         4.2878e15       4.2990e15          4.3091e15       ~5.0e-3 span
 *   star_over_H2      2561.4          2558.1             2555.2          ~2.4e-3
 * READING: over the ENTIRE k=10 seed band -- ~5.2% of N_cross, far wider than any Picard iteration
 * actually needs -- 1 + G moves by only ~0.24%, n_op* by ~0.25%, and the (H2)-margin headroom stays
 * pinned between ~2555x and ~2561x. The headroom NEVER approaches the binding threshold of 1: its band
 * minimum ~2555x (at the upper edge, largest G) is still ~2555x non-binding. So the imp-34843 conclusion
 * -- the contraction ceiling is far above the (H2) margin, arithmetic depth is non-binding -- is UNIFORM
 * across the admissible seed band, not an artifact of freezing G at N_cross.
 *
 * THE BAND-INVARIANT RATIO
 * ------------------------
 * The looser bracket endpoint over the tighter is FP_LO/eps over (delta FP_LO/eps) = 1/delta = 5000
 * EXACTLY -- the linear-floor span endpoint is always 1/delta times the (H2)-margin ceiling, INDEPENDENT
 * of G and hence of the seed. FP_LO cancels; the 5001x figure in imp-34843 is exactly 1/delta and does
 * not drift across the band at all. Only the star_over_H2 = 1/(1+G) fraction of it carries the (weak)
 * G-dependence, and FP_LO/eps over n_op* = 1 + G reproduces the imp-34843 factor at every band point.
 *
 * SENSITIVITY / CONSISTENCY CHECK ONLY on the inherited imp-3220/imp-3406 surrogate crossover map; NOT a
 * rigorous asymptotic and NOT an RH bound. Both endpoints rest on the same gamma(n)/k eps surrogate
 * models of the imp-34687a directed-rounding layer, not the layer itself; F(m) = 0 remains a
 * double-precision artifact and the machine certificate imp-34714a REMAINS OPEN. C_C = 1/8 ansatz
 * (imp-2642/imp-2643) UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched;
 * changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34843-krawczyk-n-op-star-vs-deltastar-floor-crosscheck (the single-G cross-check this varies over the band)
 * @see imp-34817-krawczyk-op-budget-contraction-gap (n_op* = G/((1+G) eps) contraction-validity op ceiling)
 * @see imp-34818-krawczyk-deltastar-vs-directed-rounding-floor (the linear floor and the n_op = 2 FP_LO k bridge)
 * @see imp-34799-krawczyk-directed-rounding-width-bound (the (H2)-margin ceiling n_op^max = delta FP_LO/eps)
 * @see imp-34693-crossover-contraction-seed-band (the admissible seed band rho(1,k) = (1-L)/[(1-L_c) L^k])
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (the exact lemma; named sub-gap imp-34714a)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34843_KRAWCZYK_N_OP_STAR_VS_DELTASTAR_FLOOR_CROSSCHECK } from './imp-34843-krawczyk-n-op-star-vs-deltastar-floor-crosscheck.js';

const TWO_PI = 2 * Math.PI;
const EPS = Number.EPSILON; // 2^-52
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34817/imp-34818/imp-34843)
const DELTA = 2e-4; // the fixed imp-34774/imp-34776/imp-34799 relative bracket half-width

// The shared imp-33723/imp-34774 Banach map g(N) = K log T0(N), its closed-form derivative, and the
// imp-34693 seed-band half-width (recomputed full-precision; no inherited storage rounding).
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
const L_AT_CROSS = gPrime(N_CROSS); // ~0.045423 (imp-34693 L_c; G = 1 - L_c at the fixed point)
const rho = (tol, k) => (tol * (1 - L_CONTRACTION)) / ((1 - L_AT_CROSS) * Math.pow(L_CONTRACTION, k));

// The imp-34843 quantities as functions of the band point N (local gap G(N) = 1 - |g_prime(N)|).
function metricsAt(N) {
  const G = 1 - Math.abs(gPrime(N));
  const nOpStar = G / ((1 + G) * EPS); // imp-34817 op-count ceiling
  const FP_LO = 1 - Math.abs(gPrime(N * (1 - DELTA))); // imp-34818 Krawczyk quotient denominator floor
  const linSpan = FP_LO / EPS; // imp-34818 linear-floor span endpoint
  const nOpH2 = (DELTA * FP_LO) / EPS; // imp-34799 (H2)-margin ceiling n_op^max
  return {
    G,
    onePlusG: 1 + G,
    nOpStar,
    FP_LO,
    linSpan,
    nOpH2,
    starOverH2: nOpStar / nOpH2, // headroom of the contraction ceiling over the binding (H2) ceiling
    linSpanOverH2: linSpan / nOpH2, // = 1/delta = 5000 exactly, band-INVARIANT
    linSpanOverStar: linSpan / nOpStar, // = 1 + G at every band point
  };
}

const CENTER = metricsAt(N_CROSS);

// Sweep the imp-34693 seed band at k = 0, 5, 10 (rho widens by 1/L per rung; only k=10 moves G visibly).
const K_GRID = [0, 5, 10];
const bandTable = K_GRID.map((k) => {
  const r = rho(1, k);
  const lo = metricsAt(N_CROSS - r); // lower edge minimizes G (smaller N -> larger |g_prime|)
  const hi = metricsAt(N_CROSS + r); // upper edge maximizes G
  return {
    k,
    rho_half_width: +r.toExponential(4),
    band_frac_of_N_cross: +(r / N_CROSS).toExponential(3),
    G_lo: +lo.G.toFixed(6),
    G_hi: +hi.G.toFixed(6),
    one_plus_G_lo: +lo.onePlusG.toFixed(6),
    one_plus_G_hi: +hi.onePlusG.toFixed(6),
    n_op_star_lo: +lo.nOpStar.toExponential(4),
    n_op_star_hi: +hi.nOpStar.toExponential(4),
    lin_span_lo: +lo.linSpan.toExponential(4),
    lin_span_hi: +hi.linSpan.toExponential(4),
    star_over_H2_lo: +lo.starOverH2.toFixed(2),
    star_over_H2_hi: +hi.starOverH2.toFixed(2),
  };
});

// Relative spreads of each quantity across the WIDEST rung (k=10), the only band that moves G visibly.
const R10 = rho(1, 10);
const LO10 = metricsAt(N_CROSS - R10);
const HI10 = metricsAt(N_CROSS + R10);
const ONE_PLUS_G_SPREAD = Math.abs(HI10.onePlusG - LO10.onePlusG) / CENTER.onePlusG;
const N_OP_STAR_SPREAD = Math.abs(HI10.nOpStar - LO10.nOpStar) / CENTER.nOpStar;
const STAR_OVER_H2_SPREAD = Math.abs(HI10.starOverH2 - LO10.starOverH2) / CENTER.starOverH2;
// The (H2)-margin headroom minimum across the band (upper edge, largest G) -- still hugely non-binding.
const MIN_STAR_OVER_H2 = Math.min(LO10.starOverH2, CENTER.starOverH2, HI10.starOverH2);
const MAX_STAR_OVER_H2 = Math.max(LO10.starOverH2, CENTER.starOverH2, HI10.starOverH2);

// The band-invariant ratio: the linear-floor span endpoint is 1/delta times the (H2) ceiling at every N.
const INV_DELTA = 1 / DELTA; // 5000 (linSpanOverH2 at every band point, G-independent)

// Cross-check the recomputed center against the published imp-34843 literals.
const A43 = IMP34843_KRAWCZYK_N_OP_STAR_VS_DELTASTAR_FLOOR_CROSSCHECK;
const ONE_PLUS_G_PUBLISHED = A43.crosscheck.ratio_closed_one_plus_G; // ~1.954577
const N_OP_STAR_PUBLISHED = A43.crosscheck.n_op_star; // ~2.1995e15
const STAR_OVER_H2_PUBLISHED = A43.crosscheck.star_over_H2_margin; // ~2558.1

export const IMP34861_KRAWCZYK_CROSSCHECK_BAND_SENSITIVITY = {
  id: 'imp-34861',
  proofSection: 'S-frontier',
  question:
    'imp-34843 evaluated the full-vs-linear disagreement factor 1 + G ~ 1.9546 and the ' +
    'contraction-validity bracket [n_op*, FP_LO/eps] = [2.20e15, 4.30e15] at a SINGLE contraction gap ' +
    'G = 1 - |g_prime(N_cross)|. Since g_prime depends on N via g_prime = 2pi K/(T0 u), G drifts as the ' +
    'seed moves off N_cross. Re-evaluate 1 + G and both bracket endpoints across the imp-34693 admissible ' +
    'seed band |N_0 - N_cross| < rho(1,k), and report whether the ~2558x headroom over the binding ' +
    'imp-34799 (H2)-margin ceiling n_op^max ~ 8.60e11 is uniform across the band. Sensitivity/consistency ' +
    'check on the surrogate models; imp-34714a stays OPEN; changes no bound; NO QED.',
  model: {
    setup:
      'At a band point N: G(N) = 1 - |g_prime(N)|, n_op*(N) = G/((1+G) eps), FP_LO(N)/eps = ' +
      '(1 - |g_prime(N(1-delta))|)/eps, n_op^max(N) = delta FP_LO(N)/eps, and star_over_H2(N) = ' +
      'n_op*/n_op^max = G/((1+G) delta FP_LO). The imp-34693 band widens by 1/L ~ 6.7348 per iterate; ' +
      'only the widest rung k=10 (half-width ~1.71e8, ~5.2% of N_cross) moves G enough to matter.',
    monotonicity:
      'T0 increases with N and g_prime = 2pi K/(T0 u) decreases, so G(N) is INCREASING in N: the band ' +
      'lower edge minimizes G and the upper edge maximizes it. n_op* = G/((1+G) eps) is increasing in G ' +
      '(derivative 1/((1+G)^2 eps) > 0), so both bracket endpoints track G upward across the band.',
    invariant:
      'The looser endpoint over the tighter, FP_LO/eps over (delta FP_LO/eps) = 1/delta = 5000, is EXACT ' +
      'and band-INVARIANT (FP_LO cancels). Only star_over_H2 = 1/(1+G) fraction of the 5000x carries the ' +
      'G-dependence, and FP_LO/eps over n_op* = 1 + G reproduces the imp-34843 factor at every band point.',
  },
  constants: {
    N_cross: +N_CROSS.toPrecision(15), // 3.28029435165241e9
    G_center: +CENTER.G.toFixed(6), // ~0.954577
    one_plus_G_center: +CENTER.onePlusG.toFixed(6), // ~1.954577
    eps: +EPS.toExponential(4), // 2.2204e-16
    delta: DELTA, // 2e-4
    inv_delta_band_invariant_lin_span_over_H2: INV_DELTA, // 5000 (G-independent)
    widest_band_k: 10,
    widest_band_half_width: +R10.toExponential(4), // ~1.7124e8
    widest_band_frac_of_N_cross: +(R10 / N_CROSS).toExponential(3), // ~5.2e-2
  },
  bandTable, // 1 + G and both bracket endpoints at the lower/upper edges of the k = 0, 5, 10 seed bands
  sensitivity: {
    // Relative spread of each quantity across the widest (k=10) seed band.
    one_plus_G_rel_spread: +ONE_PLUS_G_SPREAD.toExponential(3), // ~2.4e-3
    n_op_star_rel_spread: +N_OP_STAR_SPREAD.toExponential(3), // ~2.5e-3
    star_over_H2_rel_spread: +STAR_OVER_H2_SPREAD.toExponential(3), // ~2.4e-3
    star_over_H2_band_min: +MIN_STAR_OVER_H2.toFixed(1), // ~2555.2 (upper edge, largest G)
    star_over_H2_band_max: +MAX_STAR_OVER_H2.toFixed(1), // ~2561.4 (lower edge, smallest G)
    headroom_uniform_never_near_binding: MIN_STAR_OVER_H2 > 2000, // stays ~2555x-2561x, never near 1
  },
  crosscheck: {
    one_plus_G_published_imp34843: ONE_PLUS_G_PUBLISHED, // ~1.954577
    n_op_star_published_imp34843: N_OP_STAR_PUBLISHED, // ~2.1995e15
    star_over_H2_published_imp34843: STAR_OVER_H2_PUBLISHED, // ~2558.1
  },
  finding:
    'Re-evaluating the imp-34843 full-vs-linear factor 1 + G and the contraction-validity bracket ' +
    '[n_op*, FP_LO/eps] across the imp-34693 admissible seed band shows the single-G snapshot is ROBUST. ' +
    'Only the widest rung k=10 (half-width ~1.71e8, ~5.2% of N_cross -- far wider than any Picard ' +
    'iteration needs) moves the local gap G = 1 - |g_prime(N)| at all, and there G ranges only ' +
    '[0.952082, 0.956824] (relative spread ~2.4e-3). Correspondingly 1 + G moves by ~0.24%, n_op* by ' +
    '~0.25% (2.1965e15 to 2.2021e15), and the linear-floor span endpoint FP_LO/eps by ~0.5%. The headroom ' +
    'over the binding imp-34799 (H2)-margin ceiling n_op^max ~ 8.60e11 stays pinned between ~2555x (upper ' +
    'band edge, largest G) and ~2561x (lower edge) -- a relative spread of ~2.4e-3 and NEVER approaching ' +
    'the binding threshold of 1. The looser-over-tighter endpoint ratio FP_LO/eps over n_op^max = 1/delta ' +
    '= 5000 is EXACT and band-invariant (FP_LO cancels), while FP_LO/eps over n_op* = 1 + G reproduces the ' +
    'imp-34843 factor at every band point. CONCLUSION: the imp-34843 result -- arithmetic depth is ' +
    'non-binding, the two surrogate ceilings disagree only by the fully-explained factor 1 + G -- is ' +
    'UNIFORM across the entire admissible seed band, not an artifact of freezing G at N_cross. EVIDENCE ' +
    'the two surrogate views are internally coherent, NOT a machine certificate; imp-34714a REMAINS OPEN.',
  subGap:
    'imp-34714a REMAINS OPEN. That 1 + G and both bracket endpoints drift by only ~0.25% and the ' +
    '(H2)-margin headroom stays ~2555x-2561x across the whole imp-34693 seed band is EVIDENCE the ' +
    'imp-34843 cross-check is insensitive to seed placement; it does NOT prove a directed-rounding ' +
    '[g](m)/[F_prime] evaluation yields valid enclosures -- both endpoints rest on the gamma(n)/k eps ' +
    'surrogate models of the imp-34687a directed-rounding layer, not that layer, and F(m) = 0 remains a ' +
    'double-precision artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK CROSS-CHECK BAND-SENSITIVITY (frontier, NOT an RH bound). imp-34843 evaluated the ' +
    'full-vs-linear factor 1 + G ~ 1.9546 and the contraction-validity bracket [n_op*, FP_LO/eps] = ' +
    '[2.20e15, 4.30e15] at a single gap G = 1 - |g_prime(N_cross)|. Since g_prime = 2pi K/(T0 u) depends ' +
    'on N, this module re-evaluates them across the imp-34693 seed band |N_0 - N_cross| < rho(1,k). Only ' +
    'the widest rung k=10 (half-width ~1.71e8, ~5.2% of N_cross) moves G: it ranges [0.952082, 0.956824] ' +
    '(relative spread ~2.4e-3), so 1 + G moves ~0.24%, n_op* ~0.25% (2.1965e15 to 2.2021e15), FP_LO/eps ' +
    '~0.5%. The headroom over the binding imp-34799 (H2)-margin ceiling n_op^max ~ 8.60e11 stays pinned ' +
    'between ~2555x (upper edge, largest G) and ~2561x (lower edge), NEVER approaching the binding ' +
    'threshold of 1. The looser-over-tighter endpoint ratio FP_LO/eps over n_op^max = 1/delta = 5000 is ' +
    'EXACT and band-invariant (FP_LO cancels); FP_LO/eps over n_op* = 1 + G at every band point. ' +
    'INTERPRETATION: the imp-34843 conclusion (arithmetic depth non-binding; surrogate ceilings disagree ' +
    'only by the fully-explained 1 + G) is UNIFORM across the admissible seed band, not an artifact of ' +
    'freezing G at N_cross. This is EVIDENCE, NOT a machine certificate. SUB-GAP imp-34714a REMAINS OPEN: ' +
    'both endpoints rest on the gamma(n)/k eps surrogate models, not the imp-34687a directed-rounding ' +
    'layer, and F(m) = 0 remains a double-precision artifact. Sensitivity/consistency check only on the ' +
    'inherited imp-3220/imp-3406 surrogate crossover map; the C_C 1/8 ansatz (imp-2642/imp-2643) and ' +
    'C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; ' +
    'establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34843 (n_op* vs delta*-floor cross-check; factor 1 + G; bracket [2.20e15, 4.30e15]); imp-34817 ' +
    '(n_op* = G/((1+G) eps) contraction-validity op ceiling); imp-34818 (linear floor + n_op = 2 FP_LO k ' +
    'bridge); imp-34799 ((H2)-margin ceiling n_op^max = delta FP_LO/eps); imp-34693 (admissible seed band ' +
    'rho(1,k) = (1-L)/[(1-L_c) L^k]); imp-34714 (Krawczyk existence-uniqueness lemma; sub-gap imp-34714a); ' +
    'imp-33723 (Banach map g(N) = K log T0(N)); imp-2642 (C_C 1/8 ansatz); lambda-rh-height-mapping ' +
    '(effectiveHeightForN RvM inverse). Outward-rounded interval arithmetic and gamma(n) = n eps/(1 - ' +
    'n eps): Moore, Neumaier, Higham.',
};

export const IMP34861_KRAWCZYK_CROSSCHECK_BAND_SENSITIVITY_ASSERTIONS = [
  {
    // Only the widest rung moves G; across the k=10 band G stays in [0.95, 0.96] and is increasing in N.
    id: 'imp34861-band-G-drift-small-and-monotone',
    description: 'across the k=10 seed band G = 1 - |g_prime| stays in [0.95, 0.96] and increases with N (lo < center < hi)',
    holds: () =>
      LO10.G > 0.95 &&
      HI10.G < 0.96 &&
      LO10.G < CENTER.G &&
      CENTER.G < HI10.G &&
      ONE_PLUS_G_SPREAD < 5e-3 &&
      N_OP_STAR_SPREAD < 5e-3,
  },
  {
    // The (H2)-margin headroom is uniform across the whole band: ~2555x-2561x, never near the binding 1.
    id: 'imp34861-headroom-uniform-over-band',
    description: 'star_over_H2 stays ~2555x-2561x across the widest band (spread < 3e-3), band minimum still ~2555x non-binding',
    holds: () =>
      MIN_STAR_OVER_H2 > 2550 &&
      MAX_STAR_OVER_H2 < 2565 &&
      STAR_OVER_H2_SPREAD < 3e-3 &&
      MIN_STAR_OVER_H2 > 2000, // never approaches the binding threshold of 1
  },
  {
    // Band-invariant ratio: the linear-floor span endpoint is exactly 1/delta times the (H2) ceiling at every N.
    id: 'imp34861-lin-span-over-H2-is-inv-delta-band-invariant',
    description: 'linSpan/n_op^max = 1/delta = 5000 exactly at both band edges and center (FP_LO cancels; G-independent)',
    holds: () =>
      Math.abs(LO10.linSpanOverH2 - INV_DELTA) < 1e-6 * INV_DELTA &&
      Math.abs(HI10.linSpanOverH2 - INV_DELTA) < 1e-6 * INV_DELTA &&
      Math.abs(CENTER.linSpanOverH2 - INV_DELTA) < 1e-6 * INV_DELTA &&
      Math.abs(INV_DELTA - 5000) < 1e-9,
  },
  {
    // The looser endpoint over n_op* is 1 + G at every band point (reproduces the imp-34843 factor pointwise).
    id: 'imp34861-lin-span-over-star-is-one-plus-G-pointwise',
    description: 'FP_LO/eps over n_op* = 1 + G (up to the FP_LO/G factor ~2e-5) at both band edges; n_op* increases with G',
    holds: () =>
      Math.abs(LO10.linSpanOverStar - LO10.onePlusG) < 1e-3 && // = (1+G) FP_LO/G, off by ~2e-5 (imp-34843 tol)
      Math.abs(HI10.linSpanOverStar - HI10.onePlusG) < 1e-3 &&
      HI10.nOpStar > LO10.nOpStar && // n_op* increasing in G
      HI10.linSpan > LO10.linSpan,
  },
  {
    // The recomputed band center matches the published imp-34843 single-G literals.
    id: 'imp34861-center-matches-published-imp34843',
    description: 'recomputed center 1 + G, n_op* and star_over_H2 agree with the published imp-34843 constants',
    holds: () =>
      Math.abs(CENTER.onePlusG - ONE_PLUS_G_PUBLISHED) < 1e-3 &&
      Math.abs(CENTER.nOpStar / N_OP_STAR_PUBLISHED - 1) < 1e-3 &&
      Math.abs(CENTER.starOverH2 / STAR_OVER_H2_PUBLISHED - 1) < 1e-3,
  },
  {
    // Honesty gate: sensitivity check / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp34861-honesty-gate-no-qed',
    description: 'band-sensitivity check: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34861_KRAWCZYK_CROSSCHECK_BAND_SENSITIVITY.isRigorous === false &&
      /imp-34714a/.test(IMP34861_KRAWCZYK_CROSSCHECK_BAND_SENSITIVITY.subGap) &&
      /REMAINS OPEN/.test(IMP34861_KRAWCZYK_CROSSCHECK_BAND_SENSITIVITY.subGap) &&
      /NO QED/.test(IMP34861_KRAWCZYK_CROSSCHECK_BAND_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP34861_KRAWCZYK_CROSSCHECK_BAND_SENSITIVITY.verdict),
  },
];

for (const a of IMP34861_KRAWCZYK_CROSSCHECK_BAND_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34861-krawczyk-crosscheck-band-sensitivity assertion failed: ${a.id}`);
  }
}
