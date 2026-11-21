/**
 * @module imp-34843-krawczyk-n-op-star-vs-deltastar-floor-crosscheck
 *
 * imp-34843 (numerical, frontier): imp-34817 derived the CONTRACTION-VALIDITY op-count ceiling
 * n_op* = G/((1+G) eps) ~ 2.20e15 -- the arithmetic depth at which the standard gamma(n) IA
 * propagation factor OVERTAKES the Krawczyk contraction gap G = 1 - |g_prime| ~ 0.9546 -- and found it
 * ~2558x looser than the binding imp-34799 (H2)-margin ceiling. imp-34818 compared the imp-34794 tightest
 * surrogate certified half-width delta* against the imp-34799 a-priori directed-rounding floor and found
 * them to agree to the fixed factor delta* / floor = 1 + 1/(4k), the floor being exactly 2k eps N_cross
 * (the FP_LO contraction-gap amplification CANCELS via the n_op = 2 FP_LO k bridge). These are two
 * surrogate views of the SAME imp-34687a directed-rounding layer but were never cross-tabulated. This
 * module converts the imp-34817 op-count ceiling into the imp-34818 outward-ULP budget units through the
 * shared n_op = 2 FP_LO k bridge, evaluates the imp-34818 LINEAR floor 2k eps N_cross at that budget, and
 * measures the ratio against the imp-34817 FULL image half-width gamma(n_op*) N_cross/FP_LO. It reports
 * whether the two ceilings are mutually consistent and quantifies the single fixed factor by which they
 * disagree. Consistency check on the surrogate models; imp-34714a stays OPEN; changes no bound; NO QED.
 *
 * THE SHARED BRIDGE (identical in both siblings)
 * ---------------------------------------------
 * Both siblings hang off the imp-34799 identity n_op^max/k* = 2(1 - |g_prime|) = 2 FP_LO, so an
 * outward-ULP budget k maps to an operation count n_op = 2 FP_LO k. imp-34818 uses this forward (budget
 * k -> op count) to show its floor is 2k eps N_cross; imp-34817 works in op-count directly. Because they
 * share the bridge they must be cross-tabulable: convert n_op* to a budget k_at_star = n_op* / (2 FP_LO)
 * and ask what each model says the certified image half-width is THERE.
 *
 * THE CROSS-CHECK
 * --------------
 *  (A) imp-34817 FULL image relative half-width at n_op*: gamma(n_op*)/FP_LO = G/FP_LO ~ 1.0000 -- the
 *      enclosure spans ~100% of N_cross (the whole scale), by construction of n_op* (gamma = G there).
 *  (B) imp-34818 LINEAR floor at the budget-matched budget k_at_star = n_op* / (2 FP_LO): the imp-34818 floor
 *      is 2k eps N_cross, i.e. relative half-width 2 k_at_star eps = n_op* eps / FP_LO ~ 0.5116 -- only
 *      ~51% of N_cross.
 *  (C) RATIO (A)/(B) = [gamma(n_op*)/FP_LO] / [n_op* eps/FP_LO] = gamma(n_op*)/(n_op* eps) =
 *      1/(1 - n_op* eps) = 1 + G ~ 1.9546. The two surrogate ceilings disagree on the certified image at
 *      n_op* by EXACTLY the fixed factor 1 + G ~ 1.95.
 *
 * WHY 1 + G, AND WHY IT IS NOT A MODELING INCONSISTENCY
 * ----------------------------------------------------
 * imp-34818 replaces the full propagation factor gamma(n_op) = n_op eps/(1 - n_op eps) by its LINEARIZED
 * form gamma ~ n_op eps (this is what makes its floor the clean 2k eps N_cross with FP_LO cancelling),
 * while imp-34817 keeps the full nonlinear gamma. The two agree to O(n_op eps): at the imp-34818 few-ULP
 * budget (n_op = 2 FP_LO k ~ 7.6 at k = 4) the discrepancy 1/(1 - n_op eps) is 1 + ~1.7e-15, i.e. the
 * two models coincide to full double precision -- which is exactly why imp-34818 validated its floor as
 * EXACT at the few-ULP budget. At the contraction ceiling, by the imp-34817 closed form n_op* eps =
 * G/(1+G) ~ 0.4884, so 1/(1 - n_op* eps) = 1 + G ~ 1.9546 -- the full-vs-linear gamma gap, and NOTHING
 * else. The disagreement is therefore a KNOWN linearization artifact, not a contradiction between the two
 * surrogate models: imp-34818's floor is the small-n_op tangent to imp-34817's full image, exact where
 * imp-34818 was measured and diverging by 1 + G only out at the contraction ceiling where the linear
 * model was never meant to apply.
 *
 * QUALITATIVE CONCLUSION IS ROBUST
 * -------------------------------
 * The two independently-derived contraction-validity ceilings bracket [n_op*, FP_LO/eps] = [2.20e15,
 * 4.30e15] (the linear-floor version FP_LO/eps ~ 4.30e15 is the op count at which the imp-34818 floor
 * itself spans N_cross, and FP_LO/eps / n_op* = 1 + G). BOTH sit ~2558x-5001x ABOVE the binding imp-34799
 * (H2)-margin ceiling n_op^max ~ 8.60e11, and ~10 orders above any realistic O(10..100) directed-rounding
 * evaluation. So the imp-34817 finding -- contraction breakdown is far above the (H2) margin, arithmetic
 * depth is non-binding -- is robust to which surrogate gamma model is used; the two views are mutually
 * consistent to within the fixed factor 1 + G, and that factor is fully explained.
 *
 * INTERPRETATION -- MUTUALLY CONSISTENT SURROGATES; CERTIFICATE STILL OPEN
 * ----------------------------------------------------------------------
 * That the imp-34817 op-count ceiling and the imp-34818 delta* / floor budget imply the same certified image
 * at n_op* up to the fixed, fully-explained factor 1 + G is EVIDENCE the two surrogate views of the
 * imp-34687a layer are internally coherent, NOT a proof that a directed-rounding [g](m)/[F_prime] evaluation
 * yields valid enclosures: both ceilings rest on the gamma(n) / k eps surrogate models of the imp-34687a
 * directed-rounding layer, not the layer itself, and F(m) = 0 remains a double-precision artifact. The
 * machine certificate imp-34714a REMAINS OPEN.
 *
 * CONSISTENCY CHECK ONLY on the inherited imp-3220/imp-3406 surrogate crossover map; NOT a rigorous
 * asymptotic and NOT an RH bound. C_C = 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; C_mb GUE-conditional
 * per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator
 * positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34817-krawczyk-op-budget-contraction-gap (the contraction-validity op ceiling n_op* this converts)
 * @see imp-34818-krawczyk-deltastar-vs-directed-rounding-floor (the delta* / floor = 1 + 1/(4k) budget and n_op = 2 FP_LO k bridge)
 * @see imp-34799-krawczyk-directed-rounding-width-bound (the gamma(n_op) model + n_op^max/k* = 2 FP_LO bridge)
 * @see imp-34776-krawczyk-delta-sweep (k*(delta) = delta/(2 eps); the outward-ULP budget)
 * @see imp-34774-krawczyk-fixed-point-map-enclosure (F(m)=0 double-precision artifact; sub-gap imp-34714a)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (the exact lemma; named sub-gap imp-34714a)
 * @see imp-34687 (crossover interval-arithmetic scope; sub-gap imp-34687a directed-rounding layer)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (the Banach map g(N) = K log T0(N) and its fixed point)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34817_KRAWCZYK_OP_BUDGET_CONTRACTION_GAP } from './imp-34817-krawczyk-op-budget-contraction-gap.js';
import { IMP34818_KRAWCZYK_DELTASTAR_VS_DIRECTED_ROUNDING_FLOOR } from './imp-34818-krawczyk-deltastar-vs-directed-rounding-floor.js';

const TWO_PI = 2 * Math.PI;
const EPS = Number.EPSILON; // 2^-52
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34817/imp-34818)
const DELTA = 2e-4; // the fixed imp-34774/imp-34776/imp-34799 relative bracket half-width (for FP_LO)

// The shared imp-33723/imp-34774 Banach map g(N) = K log T0(N) and its closed-form g_prime (recomputed
// full-precision so the cross-check does not inherit the siblings toExponential storage rounding).
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
const N_CROSS = fixedPoint(1e9, 200); // 3.28029435165241e9
const M = N_CROSS;
const G = 1 - Math.abs(gPrime(N_CROSS)); // contraction gap 1 - |g_prime(N_cross)| ~ 0.954577
const FP_LO = 1 - Math.abs(gPrime(M * (1 - DELTA))); // ~0.954568 = the Krawczyk quotient denominator floor
const gammaN = (nOp) => (nOp * EPS) / (1 - nOp * EPS); // Moore/Neumaier propagation factor

// --- The imp-34817 contraction-validity op ceiling and the imp-34818 bridge (recomputed) ------------
const N_OP_STAR = G / ((1 + G) * EPS); // ~2.20e15 (imp-34817 closed form)
const TWO_FP_LO = 2 * FP_LO; // ~1.9091 (the shared n_op = 2 FP_LO k bridge factor)

// (A) imp-34817 FULL image relative half-width at n_op*: gamma(n_op*)/FP_LO ~ 1.0000 (spans N_cross).
const FULL_IMAGE_REL_AT_STAR = gammaN(N_OP_STAR) / FP_LO;

// (B) Convert n_op* to an imp-34818 outward-ULP budget and evaluate the imp-34818 LINEAR floor there.
//     k_at_star = n_op* / (2 FP_LO); floor_rel = 2 k_at_star eps = n_op* eps / FP_LO (2 k eps N_cross rel).
const K_AT_STAR = N_OP_STAR / TWO_FP_LO; // ~1.15e15 outward-ULP budget matching n_op*
const LINEAR_FLOOR_REL_AT_STAR = 2 * K_AT_STAR * EPS; // = N_OP_STAR * EPS / FP_LO ~ 0.5116

// (C) The ratio of the two surrogate views of the certified image at n_op*.
const RATIO_FULL_OVER_LINEAR = FULL_IMAGE_REL_AT_STAR / LINEAR_FLOOR_REL_AT_STAR; // ~1.9546
const RATIO_CLOSED_ONE_PLUS_G = 1 + G; // closed form 1/(1 - n_op* eps) = 1 + G
const N_OP_STAR_EPS = N_OP_STAR * EPS; // = G/(1+G) ~ 0.4884 (the linearization small parameter at the ceiling)

// Few-ULP consistency: at the imp-34818 few-ULP budget (n_op = 2 FP_LO * 4 ~ 7.6) the two models coincide.
const K_FEW_ULP = IMP34818_KRAWCZYK_DELTASTAR_VS_DIRECTED_ROUNDING_FLOOR.constants.K_few_ulp; // 4
const N_OP_FEW_ULP = TWO_FP_LO * K_FEW_ULP; // ~7.6365 (imp-34818 matched_n_op_2_FP_LO_k)
const RATIO_FULL_OVER_LINEAR_FEW_ULP = 1 / (1 - N_OP_FEW_ULP * EPS); // ~1 + 1.7e-15 (full precision agreement)

// The linear-floor version of the contraction ceiling: op count at which the imp-34818 floor spans N_cross.
const N_OP_LIN_SPAN = FP_LO / EPS; // ~4.30e15; N_OP_LIN_SPAN / N_OP_STAR = 1 + G
const LIN_SPAN_OVER_STAR = N_OP_LIN_SPAN / N_OP_STAR; // ~1.9546 = 1 + G

// Both contraction ceilings sit far above the binding imp-34799 (H2)-margin ceiling (~2558x and ~5001x).
const N_OP_H2_MARGIN = (DELTA * FP_LO) / EPS; // ~8.60e11 (imp-34799 n_op^max)
const STAR_OVER_H2 = N_OP_STAR / N_OP_H2_MARGIN; // ~2558
const LIN_SPAN_OVER_H2 = N_OP_LIN_SPAN / N_OP_H2_MARGIN; // ~5001

// Cross-tabulate against the published imp-34817 literals (the point of the ticket).
const A17 = IMP34817_KRAWCZYK_OP_BUDGET_CONTRACTION_GAP;
const N_OP_STAR_PUBLISHED = A17.bound.n_op_star_gamma_equals_gap_closed; // ~2.1995e15
const STAR_OVER_H2_PUBLISHED = A17.bound.star_over_H2_margin; // ~2558.1
const REL_IMAGE_AT_STAR_PUBLISHED = A17.bound.rel_image_half_width_at_star; // ~1.000009

export const IMP34843_KRAWCZYK_N_OP_STAR_VS_DELTASTAR_FLOOR_CROSSCHECK = {
  id: 'imp-34843',
  proofSection: 'S-frontier',
  question:
    'imp-34817 derived the contraction-validity op-count ceiling n_op* = G/((1+G) eps) ~ 2.20e15 (~2558x ' +
    'looser than the binding (H2)-margin ceiling), and imp-34818 found the tightest surrogate half-width ' +
    'delta* and the a-priori directed-rounding floor agree to the fixed factor 1 + 1/(4k). These are two ' +
    'surrogate views of the same imp-34687a layer but were never cross-tabulated. Convert n_op* into the ' +
    'imp-34818 outward-ULP budget units through the shared n_op = 2 FP_LO k bridge, measure whether the ' +
    'two ceilings imply consistent certified-image bounds on the same bracket, and report the ratio and ' +
    'any inconsistency. Consistency check on the surrogate models; imp-34714a stays OPEN; changes no ' +
    'bound; NO QED.',
  model: {
    bridge:
      'Both siblings hang off the imp-34799 identity n_op^max/k* = 2 FP_LO, so an outward-ULP budget k ' +
      'maps to an operation count n_op = 2 FP_LO k. Converting the imp-34817 ceiling: k_at_star = ' +
      'n_op*/(2 FP_LO) ~ 1.15e15 is the imp-34818 budget that matches the imp-34817 contraction ceiling.',
    two_views_at_star:
      'imp-34817 (FULL gamma): image relative half-width gamma(n_op*)/FP_LO = G/FP_LO ~ 1.0000, spanning ' +
      '~100% of N_cross. imp-34818 (LINEAR floor 2k eps N_cross): relative half-width 2 k_at_star eps = ' +
      'n_op* eps/FP_LO ~ 0.5116, only ~51% of N_cross. The two disagree by the ratio gamma(n_op*)/(n_op* ' +
      'eps) = 1/(1 - n_op* eps) = 1 + G ~ 1.9546.',
    why_1_plus_G:
      'imp-34818 linearizes gamma(n_op) = n_op eps/(1 - n_op eps) to gamma ~ n_op eps (which is what makes ' +
      'its floor the clean 2k eps N_cross with FP_LO cancelling); imp-34817 keeps the full nonlinear ' +
      'gamma. They agree to O(n_op eps): at the imp-34818 few-ULP budget (n_op ~ 7.6) 1/(1 - n_op eps) = ' +
      '1 + ~1.7e-15 (full double precision), but at the contraction ceiling n_op* eps = G/(1+G) ~ 0.4884, ' +
      'so the gap is exactly 1 + G. A known linearization artifact, NOT a modeling inconsistency.',
  },
  constants: {
    N_cross: +N_CROSS.toPrecision(15), // 3.28029435165241e9
    contraction_gap_G: +G.toFixed(6), // ~0.954577
    FP_LO_quotient_denominator: +FP_LO.toFixed(6), // ~0.954568
    eps: +EPS.toExponential(4), // 2.2204e-16
    two_FP_LO_bridge_factor: +TWO_FP_LO.toFixed(6), // ~1.909135
    K_few_ulp: K_FEW_ULP, // 4 (imp-34818 fixed budget)
  },
  crosscheck: {
    // Consistency check only; both ceilings rest on the gamma(n)/k eps surrogate models (imp-34714a).
    n_op_star: +N_OP_STAR.toExponential(4), // ~2.1995e15 (imp-34817)
    k_at_star_matched_budget: +K_AT_STAR.toExponential(4), // ~1.1521e15 = n_op* / (2 FP_LO)
    full_image_rel_at_star: +FULL_IMAGE_REL_AT_STAR.toFixed(6), // ~1.000009 (imp-34817, spans N_cross)
    linear_floor_rel_at_star: +LINEAR_FLOOR_REL_AT_STAR.toFixed(6), // ~0.511625 (imp-34818, 2k eps)
    ratio_full_over_linear: +RATIO_FULL_OVER_LINEAR.toFixed(6), // ~1.954577
    ratio_closed_one_plus_G: +RATIO_CLOSED_ONE_PLUS_G.toFixed(6), // ~1.954577 (= 1/(1 - n_op* eps))
    n_op_star_eps_linearization_param: +N_OP_STAR_EPS.toFixed(6), // ~0.488380 = G/(1+G)
    ratio_full_over_linear_few_ulp: +RATIO_FULL_OVER_LINEAR_FEW_ULP.toExponential(4), // ~1.0000e0 (agree to full precision)
    n_op_lin_span: +N_OP_LIN_SPAN.toExponential(4), // ~4.2990e15 = FP_LO/eps (linear-floor spans N_cross)
    lin_span_over_star: +LIN_SPAN_OVER_STAR.toFixed(6), // ~1.954558 = 1 + G
    star_over_H2_margin: +STAR_OVER_H2.toFixed(1), // ~2558.1
    lin_span_over_H2_margin: +LIN_SPAN_OVER_H2.toFixed(1), // ~5001 (both ceilings far above the (H2) margin)
    // Cross-tabulation against the published imp-34817 literals.
    n_op_star_published_imp34817: N_OP_STAR_PUBLISHED, // ~2.1995e15
    star_over_H2_published_imp34817: STAR_OVER_H2_PUBLISHED, // ~2558.1
    rel_image_at_star_published_imp34817: REL_IMAGE_AT_STAR_PUBLISHED, // ~1.000009
  },
  finding:
    'Converting the imp-34817 contraction-validity op ceiling n_op* = G/((1+G) eps) ~ 2.20e15 into the ' +
    'imp-34818 outward-ULP budget units via the shared n_op = 2 FP_LO k bridge (k_at_star = n_op*/(2 FP_LO) ' +
    '~ 1.15e15), the two surrogate models give consistent-but-not-identical certified images at n_op*: ' +
    'imp-34817 FULL gamma says the image spans ~100% of N_cross (relative half-width gamma(n_op*)/FP_LO ~ ' +
    '1.0000), while the imp-34818 LINEAR floor 2k eps N_cross says ~51% (relative half-width n_op* eps/FP_LO ' +
    '~ 0.5116). The RATIO is exactly gamma(n_op*)/(n_op* eps) = 1/(1 - n_op* eps) = 1 + G ~ 1.9546 -- the ' +
    'full-vs-linearized gamma gap, and NOTHING else: imp-34818 linearizes gamma to n_op eps (giving its ' +
    'clean 2k eps N_cross floor), and since n_op* eps = G/(1+G) ~ 0.4884 the linearization is off by exactly ' +
    '1 + G at the ceiling. The disagreement is a KNOWN linearization artifact, not a modeling ' +
    'inconsistency: at the imp-34818 few-ULP budget (n_op ~ 7.6) the two models coincide to full double ' +
    'precision (ratio 1 + ~1.7e-15). The qualitative conclusion is ROBUST -- the two independently-derived ' +
    'contraction ceilings bracket [2.20e15, 4.30e15] (linear version FP_LO/eps = 1 + G times n_op*), and ' +
    'BOTH sit ~2558x-5001x ABOVE the binding imp-34799 (H2)-margin ceiling ~8.60e11, so arithmetic depth ' +
    'is non-binding on either surrogate. EVIDENCE the two surrogate views are internally coherent, NOT a ' +
    'machine certificate; imp-34714a REMAINS OPEN.',
  subGap:
    'imp-34714a REMAINS OPEN. That the imp-34817 op-count ceiling and the imp-34818 delta*/floor budget ' +
    'imply the same certified image at n_op* up to the fixed, fully-explained factor 1 + G is EVIDENCE the ' +
    'two surrogate views of the imp-34687a layer are internally coherent; it does NOT prove a ' +
    'directed-rounding [g](m)/[F_prime] evaluation yields valid enclosures -- both ceilings rest on the ' +
    'gamma(n) / k eps surrogate models of the imp-34687a directed-rounding layer, not that layer, and ' +
    'F(m) = 0 remains a double-precision artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK n_op* VS delta*-FLOOR CROSS-CHECK (frontier, NOT an RH bound). imp-34817 derived the ' +
    'contraction-validity op ceiling n_op* = G/((1+G) eps) ~ 2.20e15; imp-34818 found delta* and the ' +
    'a-priori directed-rounding floor agree to 1 + 1/(4k), the floor being 2k eps N_cross via the ' +
    'n_op = 2 FP_LO k bridge. Cross-tabulating: convert n_op* to the imp-34818 budget k_at_star = ' +
    'n_op*/(2 FP_LO) ~ 1.15e15. There the imp-34817 FULL image spans ~100% of N_cross while the imp-34818 ' +
    'LINEAR floor gives ~51%, the RATIO being EXACTLY 1/(1 - n_op* eps) = 1 + G ~ 1.9546. This is the ' +
    'full-vs-linearized gamma gap: imp-34818 linearizes gamma(n) to n eps (making its floor clean), and at ' +
    'n_op* eps = G/(1+G) ~ 0.4884 the linearization is off by 1 + G -- a KNOWN artifact, NOT an ' +
    'inconsistency. At the imp-34818 few-ULP budget (n_op ~ 7.6) the two models coincide to full double ' +
    'precision. INTERPRETATION: the two contraction ceilings bracket [2.20e15, 4.30e15] and BOTH sit ' +
    '~2558x-5001x ABOVE the binding imp-34799 (H2)-margin ceiling ~8.60e11, so the imp-34817 conclusion ' +
    '(arithmetic depth non-binding) is robust to which surrogate gamma model is used and the two surrogate ' +
    'views are mutually consistent to within the fixed, fully-explained factor 1 + G. This is EVIDENCE, ' +
    'NOT a machine certificate. SUB-GAP imp-34714a REMAINS OPEN: both ceilings rest on the gamma(n)/k eps ' +
    'surrogate models, not the imp-34687a directed-rounding layer, and F(m) = 0 remains a double-precision ' +
    'artifact. Consistency check only on the inherited imp-3220/imp-3406 surrogate crossover map; the C_C ' +
    '1/8 ansatz (imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 ' +
    'untouched; changes no bound; establishes no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34817 (contraction-validity op ceiling n_op* = G/((1+G) eps) ~ 2.20e15); imp-34818 (delta* vs ' +
    'directed-rounding floor = 1 + 1/(4k) and the n_op = 2 FP_LO k bridge); imp-34799 (gamma(n_op) model + ' +
    'n_op^max/k* = 2 FP_LO bridge); imp-34776 (k*(delta) = delta/(2 eps) budget); imp-34774 ' +
    '(fixed-point-map enclosure; F(m)=0 double-precision artifact; sub-gap imp-34714a); imp-34714 ' +
    '(Krawczyk existence-uniqueness lemma; sub-gap imp-34714a); imp-34687 (crossover interval-arithmetic ' +
    'scope; sub-gap imp-34687a directed-rounding layer); imp-33723 (Banach map g(N) = K log T0(N)); ' +
    'imp-2642 (C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN RvM inverse). Outward-rounded ' +
    'interval arithmetic and the gamma(n) = n eps/(1 - n eps) propagation factor: Moore, Neumaier, Higham.',
};

export const IMP34843_KRAWCZYK_N_OP_STAR_VS_DELTASTAR_FLOOR_CROSSCHECK_ASSERTIONS = [
  {
    // The bridge conversion: k_at_star = n_op* / (2 FP_LO) reproduces the imp-34818 forward map n_op = 2 FP_LO k.
    id: 'imp34843-bridge-round-trips',
    description: 'k_at_star = n_op*/(2 FP_LO) and 2 FP_LO * k_at_star = n_op* (the shared n_op = 2 FP_LO k bridge)',
    holds: () =>
      Math.abs(TWO_FP_LO * K_AT_STAR - N_OP_STAR) < 1e-6 * N_OP_STAR &&
      K_AT_STAR > 1e15 &&
      K_AT_STAR < 1.3e15,
  },
  {
    // The core cross-check: the two surrogate views of the certified image at n_op* differ by exactly 1 + G.
    id: 'imp34843-ratio-is-one-plus-G',
    description: 'full/linear image at n_op* = gamma(n_op*)/(n_op* eps) = 1/(1 - n_op* eps) = 1 + G ~ 1.9546',
    holds: () =>
      Math.abs(RATIO_FULL_OVER_LINEAR - RATIO_CLOSED_ONE_PLUS_G) < 1e-9 * RATIO_CLOSED_ONE_PLUS_G &&
      Math.abs(RATIO_FULL_OVER_LINEAR - 1 / (1 - N_OP_STAR_EPS)) < 1e-9 &&
      Math.abs(N_OP_STAR_EPS - G / (1 + G)) < 1e-12 && // n_op* eps = G/(1+G) exactly (imp-34817 closed form)
      RATIO_FULL_OVER_LINEAR > 1.9 &&
      RATIO_FULL_OVER_LINEAR < 2.0,
  },
  {
    // The FULL image spans ~100% of N_cross (imp-34817) while the LINEAR floor gives ~51% -- both bracketed.
    id: 'imp34843-full-spans-scale-linear-is-half',
    description: 'imp-34817 full image rel ~1.000 (spans N_cross); imp-34818 linear floor rel ~0.5116 (~51%)',
    holds: () =>
      FULL_IMAGE_REL_AT_STAR > 0.99 &&
      FULL_IMAGE_REL_AT_STAR < 1.01 &&
      LINEAR_FLOOR_REL_AT_STAR > 0.50 &&
      LINEAR_FLOOR_REL_AT_STAR < 0.52 &&
      // linear floor rel = n_op* eps / FP_LO (2 k eps identity)
      Math.abs(LINEAR_FLOOR_REL_AT_STAR - (N_OP_STAR * EPS) / FP_LO) < 1e-12,
  },
  {
    // Consistency at the few-ULP budget: the two models coincide to full double precision (ratio -> 1).
    id: 'imp34843-few-ulp-agreement',
    description: 'at the imp-34818 few-ULP budget (n_op ~ 7.6) the full/linear ratio is 1 + O(1e-15): models coincide',
    holds: () =>
      Math.abs(RATIO_FULL_OVER_LINEAR_FEW_ULP - 1) < 1e-12 && // full precision agreement where imp-34818 measured
      N_OP_FEW_ULP > 7 &&
      N_OP_FEW_ULP < 8,
  },
  {
    // Robustness: both contraction ceilings sit far ABOVE the binding (H2)-margin ceiling; ceilings differ by 1 + G.
    id: 'imp34843-both-ceilings-above-H2-margin',
    description: 'contraction ceilings [n_op*, FP_LO/eps] both ~2558x-5001x above n_op^max; ratio between them = 1 + G',
    holds: () =>
      STAR_OVER_H2 > 2000 &&
      STAR_OVER_H2 < 3000 &&
      LIN_SPAN_OVER_H2 > 4500 &&
      LIN_SPAN_OVER_H2 < 5500 &&
      Math.abs(LIN_SPAN_OVER_STAR - (1 + G)) < 1e-3 && // FP_LO/eps / n_op* = 1 + G (up to FP_LO/G)
      N_OP_LIN_SPAN > N_OP_STAR, // the linear-floor ceiling is the looser (larger) one
  },
  {
    // Cross-tabulation: the recomputed n_op* and star_over_H2 match the published imp-34817 literals.
    id: 'imp34843-matches-published-imp34817',
    description: 'recomputed n_op* and star_over_H2 agree with the published imp-34817 constants to storage precision',
    holds: () =>
      Math.abs(N_OP_STAR / N_OP_STAR_PUBLISHED - 1) < 1e-3 &&
      Math.abs(STAR_OVER_H2 / STAR_OVER_H2_PUBLISHED - 1) < 1e-3 &&
      Math.abs(FULL_IMAGE_REL_AT_STAR / REL_IMAGE_AT_STAR_PUBLISHED - 1) < 1e-4,
  },
  {
    // Honesty gate: consistency check / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp34843-honesty-gate-no-qed',
    description: 'n_op* vs delta*-floor cross-check: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34843_KRAWCZYK_N_OP_STAR_VS_DELTASTAR_FLOOR_CROSSCHECK.isRigorous === false &&
      /imp-34714a/.test(IMP34843_KRAWCZYK_N_OP_STAR_VS_DELTASTAR_FLOOR_CROSSCHECK.subGap) &&
      /REMAINS OPEN/.test(IMP34843_KRAWCZYK_N_OP_STAR_VS_DELTASTAR_FLOOR_CROSSCHECK.subGap) &&
      /NO QED/.test(IMP34843_KRAWCZYK_N_OP_STAR_VS_DELTASTAR_FLOOR_CROSSCHECK.verdict) &&
      /refereed bound is changed/i.test(IMP34843_KRAWCZYK_N_OP_STAR_VS_DELTASTAR_FLOOR_CROSSCHECK.verdict),
  },
];

for (const a of IMP34843_KRAWCZYK_N_OP_STAR_VS_DELTASTAR_FLOOR_CROSSCHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34843-krawczyk-n-op-star-vs-deltastar-floor-crosscheck assertion failed: ${a.id}`);
  }
}
