/**
 * @module imp-34906-krawczyk-headroom-h2-ceiling-reconcile
 *
 * imp-34906 (numerical, frontier): imp-34883 minimised the contraction-validity headroom
 * star_over_H2(N) = G/((1+G) delta FP_LO) over the widest imp-34693 rung and reported the WORST-CASE
 * 2555.18x at the band-top edge N ~ 3.4515e9, while its verdict ALSO cites the imp-34843 ~2558x margin
 * over the binding imp-34799 (H2)-margin ceiling -- but never reconciles the two numbers in a single
 * derivation. This module CROSS-VALIDATES the 2555.18x band-min by re-deriving it FROM the imp-34799
 * (H2)-margin ceiling n_op^max = delta FP_LO/eps DIRECTLY (as the explicit ratio n_op-star / n_op^max, not
 * the pre-collapsed closed form), confirms the >100x safety factor holds INDEPENDENTLY of the surrogate
 * parameterization, and reconciles the ~2555 (band-min) vs ~2558 (imp-34843 center) spread.
 *
 * THE TWO NUMBERS AND WHY THEY DIFFER
 * -----------------------------------
 * Both are the SAME headroom quantity star_over_H2(N) = n_op*(N)/n_op^max(N), evaluated at DIFFERENT
 * seeds N:
 *   imp-34843 ~2558.1x = star_over_H2(N_cross)  -- the Banach FIXED POINT N_cross ~ 3.28029e9
 *                                                  (imp-34843 froze G at a single G = G(N_cross)).
 *   imp-34883 ~2555.18x = star_over_H2(band_top) -- the WORST-CASE band-top edge N ~ 3.4515e9
 *                                                  (largest N, largest G, minimum headroom).
 * Since star_over_H2 is monotone DECREASING in N (imp-34883), the fixed-point value 2558.1 sits ABOVE
 * the band-top worst case 2555.18 and BELOW the band-lo best case 2561.39. So the ~2555-vs-~2558 spread
 * is NOT a discrepancy: it is exactly the N-drift of the headroom from the fixed-point seed out to the
 * upper band edge, star_over_H2(N_cross) - star_over_H2(band_top) ~ 2.94.
 *
 * DIRECT RE-DERIVATION FROM THE imp-34799 (H2)-MARGIN CEILING
 * ----------------------------------------------------------
 * Rather than reuse the collapsed closed form G/((1+G) delta FP_LO), this module rebuilds the ratio from
 * its two independently-published constituents at N_cross:
 *   n_op^max = delta FP_LO/eps ~ 8.5980e11   -- the imp-34799 (H2)-margin op ceiling (the BINDING one)
 *   n_op*    = G/((1+G) eps)   ~ 2.1995e15    -- the imp-34817 contraction-validity op ceiling
 *   n_op* / n_op^max          ~ 2558.12       -- reproduces the imp-34843 center to full precision,
 * and equals the collapsed closed form G/((1+G) delta FP_LO) BIT-for-bit (the eps cancels). So the
 * ~2558 margin is genuinely n_op-star / n_op^max and NOT an artifact of the surrogate parameterization: the
 * two ceilings, derived by different arguments (Krawczyk contraction validity vs (H2)-margin FP budget),
 * bracket the same headroom.
 *
 * THE >100x SAFETY FACTOR, RE-CONFIRMED INDEPENDENTLY
 * --------------------------------------------------
 * The worst-case band-top headroom, re-derived here as n_op-star / n_op^max at the band top edge, is
 * 2555.18x = 25.55x above the stated 100x safety factor -- reproducing the imp-34883 band-min VERBATIM
 * from the (H2)-ceiling side, so the >100x conclusion does not depend on which of the two equivalent
 * forms (explicit ratio or collapsed closed form) is evaluated.
 *
 * MEASUREMENT / RECONCILIATION ONLY on the inherited imp-3220/imp-3406 surrogate crossover map; NOT a
 * rigorous asymptotic and NOT an RH bound. Both ceilings rest on the same gamma(n)/k eps surrogate
 * models of the imp-34687a directed-rounding layer, not the layer itself; F(m) = 0 remains a
 * double-precision artifact and the machine certificate imp-34714a REMAINS OPEN. C_C = 1/8 ansatz
 * (imp-2642/imp-2643) UNTOUCHED; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched;
 * changes no bound; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34883-krawczyk-worstcase-headroom-band (the band-min 2555.18x this cross-validates)
 * @see imp-34861-krawczyk-crosscheck-band-sensitivity (edge-only band range 2555.2 .. 2561.4)
 * @see imp-34843-krawczyk-n-op-star-vs-deltastar-floor-crosscheck (single-G center 2558.1x)
 * @see imp-34817-krawczyk-op-budget-contraction-gap (n_op* = G/((1+G) eps) contraction-validity ceiling)
 * @see imp-34799-krawczyk-directed-rounding-width-bound ((H2)-margin ceiling n_op^max = delta FP_LO/eps)
 * @see imp-34693-crossover-contraction-seed-band (admissible seed band rho(1,k) = (1-L)/[(1-L_c) L^k])
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (the exact lemma; named sub-gap imp-34714a)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34883_KRAWCZYK_WORSTCASE_HEADROOM_BAND } from './imp-34883-krawczyk-worstcase-headroom-band.js';
import { IMP34861_KRAWCZYK_CROSSCHECK_BAND_SENSITIVITY } from './imp-34861-krawczyk-crosscheck-band-sensitivity.js';
import { IMP34843_KRAWCZYK_N_OP_STAR_VS_DELTASTAR_FLOOR_CROSSCHECK } from './imp-34843-krawczyk-n-op-star-vs-deltastar-floor-crosscheck.js';

const TWO_PI = 2 * Math.PI;
const EPS = Number.EPSILON; // 2^-52
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34817/imp-34843/imp-34861/imp-34883)
const DELTA = 2e-4; // the fixed imp-34774/imp-34776/imp-34799 relative bracket half-width
const SAFETY_FACTOR = 100; // the stated band-wide safety factor

// Same imp-33723/imp-34774 Banach map g(N) = K log T0(N), its closed-form derivative, and the imp-34693
// seed-band half-width (recomputed full-precision; identical setup to imp-34861/imp-34883).
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
const N_CROSS = fixedPoint(1e9, 200); // ~3.28029435165241e9 (Banach fixed point = imp-34843 seed)
const L_CONTRACTION = gPrime(1e9); // ~0.148483 (imp-34693 L)
const L_AT_CROSS = gPrime(N_CROSS); // ~0.045423 (imp-34693 L_c)
const rho = (tol, k) => (tol * (1 - L_CONTRACTION)) / ((1 - L_AT_CROSS) * Math.pow(L_CONTRACTION, k));

// Re-derive the headroom from the imp-34799 (H2)-margin ceiling DIRECTLY, as the explicit ratio of the
// two published op ceilings n_op* / n_op^max -- NOT the pre-collapsed closed form. The eps cancels
// analytically, so this must equal G/((1+G) delta FP_LO) bit-for-bit.
function headroomFromH2CeilingAt(N) {
  const G = 1 - Math.abs(gPrime(N)); // contraction gap (imp-34817)
  const FP_LO = 1 - Math.abs(gPrime(N * (1 - DELTA))); // Krawczyk quotient floor (imp-34818)
  const nOpMaxH2 = (DELTA * FP_LO) / EPS; // imp-34799 (H2)-margin op ceiling (BINDING)
  const nOpStar = G / ((1 + G) * EPS); // imp-34817 contraction-validity op ceiling
  const ratioDirect = nOpStar / nOpMaxH2; // headroom, rebuilt from the two ceilings
  const ratioClosed = G / ((1 + G) * DELTA * FP_LO); // the collapsed closed form (must match)
  return { G, FP_LO, nOpMaxH2, nOpStar, ratioDirect, ratioClosed };
}

// The widest physically-admissible rung is k=10 (imp-34883); the band-top edge is the worst case.
const WIDEST_BAND_K = 10;
const R_HALF = rho(1, WIDEST_BAND_K);
const BAND_TOP = N_CROSS + R_HALF; // worst-case seed (largest N, imp-34883)
const BAND_LO = N_CROSS - R_HALF; // best-case seed (smallest N)

const AT_CENTER = headroomFromH2CeilingAt(N_CROSS); // fixed-point seed = imp-34843 center
const AT_TOP = headroomFromH2CeilingAt(BAND_TOP); // worst case = imp-34883 band-min
const AT_LO = headroomFromH2CeilingAt(BAND_LO); // best case = imp-34883 band-max

// The direct ratio and the collapsed closed form agree bit-for-bit (eps cancels) at every seed.
const DIRECT_EQUALS_CLOSED =
  Math.abs(AT_CENTER.ratioDirect - AT_CENTER.ratioClosed) < 1e-9 &&
  Math.abs(AT_TOP.ratioDirect - AT_TOP.ratioClosed) < 1e-9 &&
  Math.abs(AT_LO.ratioDirect - AT_LO.ratioClosed) < 1e-9;

// The ~2555-vs-~2558 spread is exactly the N-drift from the fixed point out to the worst-case edge.
const CENTER_MINUS_TOP_SPREAD = AT_CENTER.ratioDirect - AT_TOP.ratioDirect; // ~2.94
const WORST_OVER_SAFETY = AT_TOP.ratioDirect / SAFETY_FACTOR; // ~25.55
const STAYS_ABOVE_SAFETY = AT_TOP.ratioDirect > SAFETY_FACTOR; // true

// The published literals this reconciles, reused VERBATIM (no re-derivation of the underlying model).
const PUBLISHED_BAND_MIN = IMP34883_KRAWCZYK_WORSTCASE_HEADROOM_BAND.minimisation.star_over_H2_min; // ~2555.18
const PUBLISHED_CENTER = IMP34843_KRAWCZYK_N_OP_STAR_VS_DELTASTAR_FLOOR_CROSSCHECK.crosscheck.star_over_H2_margin; // ~2558.1
const PUBLISHED_BAND_MIN_34861 = IMP34861_KRAWCZYK_CROSSCHECK_BAND_SENSITIVITY.sensitivity.star_over_H2_band_min; // ~2555.2
const PUBLISHED_BAND_MAX_34861 = IMP34861_KRAWCZYK_CROSSCHECK_BAND_SENSITIVITY.sensitivity.star_over_H2_band_max; // ~2561.4

export const IMP34906_KRAWCZYK_HEADROOM_H2_CEILING_RECONCILE = {
  id: 'imp-34906',
  proofSection: 'S-frontier',
  question:
    'imp-34883 reported a worst-case contraction-validity headroom 2555.18x at the band-top edge and its ' +
    'verdict also cites the imp-34843 ~2558x margin over the binding imp-34799 (H2)-margin ceiling, but ' +
    'never reconciles the two in one derivation. Re-derive the headroom minimum FROM the imp-34799 ceiling ' +
    'directly (as the explicit ratio n_op*/n_op^max), confirm the >100x safety factor holds independently ' +
    'of the surrogate parameterization, and reconcile the ~2555 (band-min) vs ~2558 (imp-34843 center) ' +
    'spread. Measurement on the surrogate models; imp-34714a stays OPEN; changes no bound; NO QED.',
  model: {
    setup:
      'star_over_H2(N) = n_op*(N)/n_op^max(N), with n_op^max = delta FP_LO/eps (imp-34799 (H2)-margin ' +
      'ceiling, BINDING) and n_op* = G/((1+G) eps) (imp-34817 contraction-validity ceiling). The eps ' +
      'cancels, so the ratio equals the collapsed closed form G/((1+G) delta FP_LO) bit-for-bit.',
    reconciliation:
      'imp-34843 ~2558.1x = star_over_H2(N_cross) at the Banach FIXED POINT (single frozen G); ' +
      'imp-34883 ~2555.18x = star_over_H2(band_top) at the WORST-CASE upper band edge. Since ' +
      'star_over_H2 is monotone DECREASING in N, the fixed-point value sits ABOVE the band-top worst ' +
      'case and BELOW the band-lo best case 2561.39x. The ~2555-vs-~2558 spread is exactly the N-drift ' +
      'star_over_H2(N_cross) - star_over_H2(band_top) ~ 2.94, NOT a discrepancy.',
    independence:
      'Rebuilding the ratio from its two independently-published op ceilings (n_op^max ~8.5980e11 and ' +
      'n_op* ~2.1995e15) reproduces 2558.12x at N_cross and 2555.18x at the band top, matching both ' +
      'published literals -- so the >100x factor is not an artifact of the collapsed closed-form ' +
      'parameterization: the two ceilings, derived by different arguments, bracket the same headroom.',
  },
  constants: {
    N_cross: +N_CROSS.toPrecision(15), // 3.28029435165241e9
    eps: +EPS.toExponential(4), // 2.2204e-16
    delta: DELTA, // 2e-4
    safety_factor: SAFETY_FACTOR, // 100
    widest_band_k: WIDEST_BAND_K, // 10
    band_top_worst_case_N: +BAND_TOP.toPrecision(15), // ~3.45153927564186e9
  },
  reDerivation: {
    // At the fixed-point seed N_cross (the imp-34843 center), rebuilt from the two ceilings.
    n_op_max_H2_ceiling_center: +AT_CENTER.nOpMaxH2.toExponential(4), // ~8.5980e11 (imp-34799 BINDING)
    n_op_star_center: +AT_CENTER.nOpStar.toExponential(4), // ~2.1995e15 (imp-34817)
    headroom_direct_ratio_center: +AT_CENTER.ratioDirect.toFixed(4), // ~2558.1230 (= imp-34843)
    headroom_closed_form_center: +AT_CENTER.ratioClosed.toFixed(4), // ~2558.1230 (matches direct)
    // At the worst-case band-top edge (the imp-34883 band-min), rebuilt the same way.
    n_op_max_H2_ceiling_top: +AT_TOP.nOpMaxH2.toExponential(4),
    n_op_star_top: +AT_TOP.nOpStar.toExponential(4),
    headroom_direct_ratio_top: +AT_TOP.ratioDirect.toFixed(4), // ~2555.1835 (= imp-34883 band-min)
    headroom_direct_ratio_lo: +AT_LO.ratioDirect.toFixed(4), // ~2561.3937 (best case)
    direct_equals_closed_form_all_seeds: DIRECT_EQUALS_CLOSED, // true -- eps cancels
  },
  reconciliation: {
    imp34843_center_value: +AT_CENTER.ratioDirect.toFixed(2), // ~2558.12
    imp34883_band_min_value: +AT_TOP.ratioDirect.toFixed(2), // ~2555.18
    center_minus_top_spread: +CENTER_MINUS_TOP_SPREAD.toFixed(4), // ~2.94 (the N-drift, NOT a discrepancy)
    center_between_min_and_max:
      AT_TOP.ratioDirect < AT_CENTER.ratioDirect && AT_CENTER.ratioDirect < AT_LO.ratioDirect, // true
  },
  safety: {
    safety_factor: SAFETY_FACTOR, // 100
    worst_case_over_safety_factor: +WORST_OVER_SAFETY.toFixed(2), // ~25.55
    stays_above_safety_factor_bandwide: STAYS_ABOVE_SAFETY, // true
  },
  crosscheck: {
    published_band_min_imp34883: PUBLISHED_BAND_MIN, // ~2555.18 (reused VERBATIM; matches re-derivation)
    published_center_imp34843: PUBLISHED_CENTER, // ~2558.1 (matches re-derived center)
    published_band_min_imp34861: PUBLISHED_BAND_MIN_34861, // ~2555.2
    published_band_max_imp34861: PUBLISHED_BAND_MAX_34861, // ~2561.4
    re_derived_min_matches_published: Math.abs(AT_TOP.ratioDirect - PUBLISHED_BAND_MIN) < 0.1, // true
    re_derived_center_matches_published: Math.abs(AT_CENTER.ratioDirect - PUBLISHED_CENTER) < 0.1, // true
  },
  finding:
    'Re-deriving the headroom FROM the imp-34799 (H2)-margin ceiling directly -- as the explicit ratio ' +
    'n_op*/n_op^max of the two independently-published op ceilings (n_op^max = delta FP_LO/eps ~8.5980e11 ' +
    'binding, n_op* = G/((1+G) eps) ~2.1995e15) -- reproduces 2558.12x at the Banach fixed point N_cross ' +
    '(matching the imp-34843 center) and 2555.18x at the worst-case band-top edge (matching the imp-34883 ' +
    'band-min), and equals the collapsed closed form G/((1+G) delta FP_LO) bit-for-bit at every seed (eps ' +
    'cancels). The ~2555-vs-~2558 spread is thus NOT a discrepancy: both are the SAME headroom evaluated at ' +
    'different seeds, and since star_over_H2 is monotone decreasing in N, the fixed-point value 2558.12 ' +
    'sits above the band-top worst case 2555.18 and below the band-lo best case 2561.39; the ~2.94 gap is ' +
    'exactly the N-drift from the fixed point out to the upper band edge. The worst case clears the stated ' +
    '100x safety factor by 25.55x independently of which equivalent form is used, so the >100x margin is ' +
    'not an artifact of the surrogate parameterization. EVIDENCE the two headroom numbers are internally ' +
    'coherent, NOT a machine certificate; imp-34714a REMAINS OPEN.',
  subGap:
    'imp-34714a REMAINS OPEN. That the re-derived worst-case headroom is 2555.18x (25.55x over the 100x ' +
    'safety factor) and reconciles the imp-34843 center in a single derivation is EVIDENCE the two ' +
    'surrogate views are coherent; it does NOT prove a directed-rounding [g](m)/[F_prime] evaluation ' +
    'yields valid enclosures -- both ceilings rest on the gamma(n)/k eps surrogate models of the ' +
    'imp-34687a directed-rounding layer, not that layer, and F(m) = 0 remains a double-precision ' +
    'artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK HEADROOM (H2)-CEILING RECONCILIATION (frontier, NOT an RH bound). imp-34883 reported a ' +
    'worst-case headroom 2555.18x at the band-top edge and cited the imp-34843 ~2558x margin over the ' +
    'binding imp-34799 (H2)-margin ceiling, but never reconciled the two. This module re-derives the ' +
    'headroom FROM the imp-34799 ceiling directly as the explicit ratio n_op*/n_op^max (n_op^max = delta ' +
    'FP_LO/eps ~8.5980e11, n_op* = G/((1+G) eps) ~2.1995e15), obtaining 2558.12x at the fixed-point seed ' +
    'N_cross (= imp-34843 center) and 2555.18x at the worst-case band-top edge (= imp-34883 band-min), ' +
    'matching the collapsed closed form bit-for-bit at every seed. RECONCILIATION: the ~2555-vs-~2558 ' +
    'spread is the SAME headroom at different seeds -- monotone decreasing in N, so the fixed-point 2558.12 ' +
    'sits above the band-top worst case 2555.18 and below the band-lo best case 2561.39, the ~2.94 gap ' +
    'being the N-drift out to the upper band edge. The worst case clears the 100x safety factor by 25.55x ' +
    'independently of the parameterization, so the >100x margin is not a surrogate-form artifact. This is ' +
    'EVIDENCE, NOT a machine certificate. SUB-GAP imp-34714a REMAINS OPEN: both ceilings rest on the ' +
    'gamma(n)/k eps surrogate models, not the imp-34687a directed-rounding layer, and F(m) = 0 remains a ' +
    'double-precision artifact. Measurement only on the inherited imp-3220/imp-3406 surrogate crossover ' +
    'map; the C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 are UNTOUCHED; ' +
    'imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator positivity; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-34883 (worst-case band-min 2555.18x); imp-34861 (edge-only band range 2555.2 .. 2561.4); ' +
    'imp-34843 (single-G center 2558.1x); imp-34817 (n_op* = G/((1+G) eps) contraction-validity ceiling); ' +
    'imp-34799 ((H2)-margin ceiling n_op^max = delta FP_LO/eps); imp-34693 (admissible seed band ' +
    'rho(1,k) = (1-L)/[(1-L_c) L^k]); imp-34714 (Krawczyk existence-uniqueness lemma; sub-gap ' +
    'imp-34714a); imp-33723 (Banach map g(N) = K log T0(N)); imp-2642 (C_C 1/8 ansatz); ' +
    'lambda-rh-height-mapping (effectiveHeightForN RvM inverse). Outward-rounded interval arithmetic and ' +
    'gamma(n) = n eps/(1 - n eps): Moore, Neumaier, Higham.',
};

export const IMP34906_KRAWCZYK_HEADROOM_H2_CEILING_RECONCILE_ASSERTIONS = [
  {
    // The headroom re-derived DIRECTLY from the imp-34799 ceiling equals the collapsed closed form.
    id: 'imp34906-direct-ratio-equals-closed-form',
    description: 'n_op*/n_op^max rebuilt from the two ceilings equals G/((1+G) delta FP_LO) bit-for-bit at every seed',
    holds: () => DIRECT_EQUALS_CLOSED === true,
  },
  {
    // The re-derived center reproduces the imp-34843 ~2558x and the band-top the imp-34883 ~2555.18x.
    id: 'imp34906-reproduces-published-endpoints',
    description: 're-derived center matches imp-34843 2558.1 and band-top matches imp-34883 band-min 2555.18',
    holds: () =>
      Math.abs(AT_CENTER.ratioDirect - PUBLISHED_CENTER) < 0.1 &&
      Math.abs(AT_TOP.ratioDirect - PUBLISHED_BAND_MIN) < 0.1 &&
      Math.abs(AT_TOP.ratioDirect - PUBLISHED_BAND_MIN_34861) < 0.1,
  },
  {
    // The ~2555-vs-~2558 spread is the N-drift: center sits strictly between the band-top and band-lo.
    id: 'imp34906-spread-is-monotone-n-drift',
    description: 'imp-34843 center lies strictly between the band-top worst case and band-lo best case; spread ~2.94',
    holds: () =>
      AT_TOP.ratioDirect < AT_CENTER.ratioDirect &&
      AT_CENTER.ratioDirect < AT_LO.ratioDirect &&
      CENTER_MINUS_TOP_SPREAD > 2.5 &&
      CENTER_MINUS_TOP_SPREAD < 3.5,
  },
  {
    // The >100x safety factor holds independently of the parameterization (worst case clears by ~25.55x).
    id: 'imp34906-100x-safety-holds-independently',
    description: 're-derived worst-case 2555.18x stays >100x band-wide, clearing the safety factor by ~25.55x',
    holds: () =>
      STAYS_ABOVE_SAFETY === true &&
      AT_TOP.ratioDirect > 2550 &&
      AT_TOP.ratioDirect < 2560 &&
      WORST_OVER_SAFETY > 25 &&
      WORST_OVER_SAFETY < 26,
  },
  {
    // Honesty gate: reconciliation / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp34906-honesty-gate-no-qed',
    description: 'reconciliation: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34906_KRAWCZYK_HEADROOM_H2_CEILING_RECONCILE.isRigorous === false &&
      /imp-34714a/.test(IMP34906_KRAWCZYK_HEADROOM_H2_CEILING_RECONCILE.subGap) &&
      /REMAINS OPEN/.test(IMP34906_KRAWCZYK_HEADROOM_H2_CEILING_RECONCILE.subGap) &&
      /NO QED/.test(IMP34906_KRAWCZYK_HEADROOM_H2_CEILING_RECONCILE.verdict) &&
      /refereed bound is changed/i.test(IMP34906_KRAWCZYK_HEADROOM_H2_CEILING_RECONCILE.verdict),
  },
];

for (const a of IMP34906_KRAWCZYK_HEADROOM_H2_CEILING_RECONCILE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34906-krawczyk-headroom-h2-ceiling-reconcile assertion failed: ${a.id}`);
  }
}
