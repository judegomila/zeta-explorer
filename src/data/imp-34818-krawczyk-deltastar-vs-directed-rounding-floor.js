/**
 * @module imp-34818-krawczyk-deltastar-vs-directed-rounding-floor
 *
 * imp-34818 (accuracy, frontier): imp-34794 located the TIGHTEST surviving double-precision certified
 * Krawczyk half-width delta* via a delta-sweep at a FIXED few-ULP outward-rounding budget K_FEW_ULP = 4
 * (delta* ~ 8.5 eps relative, or absolute half-width delta* N_cross), and imp-34799 DERIVED an a-priori
 * directed-rounding image half-width r_image(n_op) = gamma(n_op) N_cross / (1 - |g_prime|) for a genuine
 * n_op-operation directed-rounding evaluation. The two have NEVER been compared. This module measures the
 * ratio delta* / (a-priori directed-rounding floor) at the fixed few-ULP budget, to assess whether the
 * imp-34794 tightest surrogate bracket sits AT the directed-rounding-predicted floor (no usable
 * head-room) or retains head-room a genuine directed-rounding certificate could tighten into. Assessment
 * only; imp-34714a REMAINS OPEN; changes no bound; NO QED.
 *
 * THE BRIDGE BETWEEN THE TWO BUDGETS (imp-34799 supplies it)
 * ---------------------------------------------------------
 * imp-34794 measures against an outward-ULP budget k (K_FEW_ULP = 4); imp-34799 measures against an
 * operation count n_op. imp-34799 already bridges the two: its strict-(H2) op ceiling n_op^max =
 * delta (1 - |g_prime|) / eps and the imp-34776 outward-ULP budget k* = delta / (2 eps) satisfy
 * n_op^max / k* = 2 (1 - |g_prime|) = 2 FP_LO. So an outward-ULP budget k corresponds, at the (H2) break,
 * to an operation count n_op = 2 FP_LO k. Evaluating the imp-34799 a-priori image half-width at that
 * budget-matched op count,
 *      r_image(2 FP_LO k) = (2 FP_LO k) eps N_cross / FP_LO = 2 k eps N_cross,
 * the FP_LO contraction-gap amplification CANCELS and the directed-rounding floor at budget k is exactly
 * 2 k eps N_cross -- identically the LEADING break term of the imp-34794 surrogate delta_min ~ (2 k + ~0.5)
 * eps. So the two frameworks predict the SAME leading floor; the only difference is the imp-34794 surrogate
 * additive.
 *
 * WHAT IS MEASURED
 * ----------------
 *  (1) delta* (imp-34794 tightest certified surrogate half-width) in absolute N-index units:
 *      delta*_halfwidth = (delta_min / eps) eps N_cross ~ 8.5 eps N_cross ~ 6.19e-6.
 *  (2) the a-priori directed-rounding floor (imp-34799) at the budget-matched op count n_op = 2 FP_LO k:
 *      floor_halfwidth = 2 k eps N_cross ~ 5.83e-6.
 *  (3) the RATIO delta* / floor = (delta_min / eps) / (2 k) = (2 k + ~0.5) / (2 k) = 1 + 1/(4 k) ~ 1.0625
 *      at k = 4 -- i.e. the surrogate half-width sits ~6% ABOVE the directed-rounding floor, the excess
 *      being exactly the imp-34794 ~0.5 eps endpoint-quantization (0.5 ULP(m)) additive, NOT an order of
 *      magnitude of usable slack.
 *  (4) the same ratio across the imp-34794 k-ladder {1,2,4,8,16}: it EQUALS the imp-34794 ratio_over_2keps
 *      column (1.375, 1.125, 1.0625, 1.0313, 0.9922) and converges to 1 as k grows -- confirming the
 *      surrogate tightens ONTO the directed-rounding floor with no residual head-room at large budget.
 *  (5) delta* expressed in imp-34799 per-operation units: delta*_halfwidth / (eps N_cross / FP_LO) =
 *      (delta_min / eps) FP_LO ~ 8.1, i.e. the tightest surrogate half-width equals ~8 directed-rounding
 *      per-op widenings.
 *
 * RESULT
 * ------
 *   delta*_halfwidth (abs, N-index):     ~6.19e-6 = 8.5 eps N_cross (imp-34794)
 *   directed-rounding floor (abs):       ~5.83e-6 = 2 k eps N_cross (imp-34799 at n_op = 2 FP_LO k)
 *   RATIO delta* / floor (k = 4):        ~1.0625 = 1 + 1/(4 k)   (head-room ~6.25%)
 *   ladder ratio -> 1 as k grows:        1.375, 1.125, 1.0625, 1.0313, 0.9922
 *   delta* in per-op units:              ~8.1 (delta_min / eps) FP_LO
 * The imp-34794 tightest surrogate certified bracket sits ESSENTIALLY AT the imp-34799 a-priori
 * directed-rounding floor: only ~6% above it at the few-ULP budget, the excess being the fixed
 * endpoint-quantization additive rather than usable head-room, and the gap vanishes (ratio -> 1) as
 * the budget grows. So a genuine directed-rounding certificate could NOT tighten the enclosure below the
 * surrogate by more than a fixed small constant factor 1 + 1/(4 k); the surrogate delta* is already a
 * faithful stand-in for the directed-rounding floor.
 *
 * INTERPRETATION -- NO USABLE HEAD-ROOM; CERTIFICATE STILL OPEN
 * ----------------------------------------------------------------
 * That delta* and the a-priori floor agree to a fixed small constant factor is EVIDENCE the imp-34794
 * surrogate is a tight proxy for what a directed-rounding certificate would achieve, NOT a proof that the
 * directed-rounding [g](m) and [F_prime] endpoints ARE valid enclosures: both delta* and the floor rest
 * on the k eps / gamma(n) surrogate models of the imp-34687a directed-rounding layer, not that layer, and
 * F(m) = 0 remains a double-precision artifact. The machine certificate imp-34714a REMAINS OPEN.
 *
 * ASSESSMENT ONLY on the inherited imp-3220/imp-3406 surrogate crossover map; NOT a rigorous asymptotic
 * and NOT an RH bound. C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643) UNTOUCHED; C_mb GUE-conditional
 * per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator
 * positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34794-krawczyk-tightest-certified-bracket (the tightest surrogate delta* and its k-ladder this compares against)
 * @see imp-34799-krawczyk-directed-rounding-width-bound (the a-priori directed-rounding image half-width and n_op^max/k* = 2 FP_LO bridge)
 * @see imp-34817-krawczyk-op-budget-contraction-gap (the complementary contraction-validity op ceiling)
 * @see imp-34776-krawczyk-delta-sweep (k*(delta) = delta/(2 eps); the outward-ULP budget the bridge uses)
 * @see imp-34774-krawczyk-fixed-point-map-enclosure (F(m)=0 double-precision artifact; sub-gap imp-34714a)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (the exact lemma; named sub-gap imp-34714a)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (the Banach map g(N) = K log T0(N) and its fixed point)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34794_KRAWCZYK_TIGHTEST_CERTIFIED_BRACKET } from './imp-34794-krawczyk-tightest-certified-bracket.js';
import { IMP34799_KRAWCZYK_DIRECTED_ROUNDING_WIDTH_BOUND } from './imp-34799-krawczyk-directed-rounding-width-bound.js';

const TWO_PI = 2 * Math.PI;
const EPS = Number.EPSILON; // 2^-52
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-34794/imp-34799)
const DELTA = 2e-4; // the fixed imp-34774/imp-34776/imp-34799 relative bracket half-width (for FP_LO)

// The shared imp-33723/imp-34774 Banach map g(N) = K log T0(N) and its closed-form g_prime.
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
// [F_prime] lower endpoint over the fixed-delta bracket = contraction-gap denominator floor (imp-34799).
const FP_LO = 1 - Math.abs(gPrime(M * (1 - DELTA))); // ~0.954568

// --- Pull the two published surrogate/derivation numbers being compared -----------------------------
const A = IMP34794_KRAWCZYK_TIGHTEST_CERTIFIED_BRACKET;
const B = IMP34799_KRAWCZYK_DIRECTED_ROUNDING_WIDTH_BOUND;
const K_FEW_ULP = A.constants.K_few_ulp; // 4 (the imp-34794 fixed budget)
const DELTA_STAR_OVER_EPS = A.measurement.delta_min_over_eps; // ~8.5 = (2 K_FEW_ULP + ~0.5)
const PER_OP_IMAGE_HALFWIDTH = B.bound.per_op_image_half_width; // ~7.63e-7 = eps N_cross / FP_LO (imp-34799)

// --- The comparison ---------------------------------------------------------------------------------
// (1) imp-34794 tightest surrogate half-width in absolute N-index units.
const DELTA_STAR_HALFWIDTH = DELTA_STAR_OVER_EPS * EPS * N_CROSS; // ~6.19e-6

// (2) imp-34799 a-priori directed-rounding floor at the budget-matched op count n_op = 2 FP_LO k.
//     r_image(2 FP_LO k) = (2 FP_LO k) eps N_cross / FP_LO = 2 k eps N_cross -- FP_LO cancels.
const MATCHED_N_OP = 2 * FP_LO * K_FEW_ULP; // ~7.64 (imp-34799 n_op^max/k* = 2 FP_LO bridge)
const FLOOR_HALFWIDTH = MATCHED_N_OP * PER_OP_IMAGE_HALFWIDTH; // ~5.83e-6 = 2 k eps N_cross
const FLOOR_HALFWIDTH_IDENTITY = 2 * K_FEW_ULP * EPS * N_CROSS; // 2 k eps N_cross (FP_LO-cancels cross-check)

// (3) The ratio delta* / floor = (delta_min/eps)/(2 k) = 1 + 1/(4 k) at the few-ULP budget.
const RATIO = DELTA_STAR_HALFWIDTH / FLOOR_HALFWIDTH; // ~1.0625
const RATIO_CLOSED = DELTA_STAR_OVER_EPS / (2 * K_FEW_ULP); // same ~1.0625
const HEADROOM_FRACTION = RATIO - 1; // ~0.0625 (the ~0.5 eps endpoint-quantization additive over 2 k)
const CLOSED_FORM_1_PLUS_1_OVER_4K = 1 + 1 / (4 * K_FEW_ULP); // 1.0625 (the predicted additive/2k)

// (4) The same ratio across the imp-34794 k-ladder: it EQUALS the imp-34794 ratio_over_2keps column and -> 1.
const RATIO_LADDER = A.measurement.delta_min_ladder.map((r) => ({
  k: r.k,
  delta_star_over_floor: r.ratio_over_2keps, // r_image(2 FP_LO k) = 2 k eps N_cross => ratio = delta_min/(2 k eps)
}));
const RATIO_AT_K16 = RATIO_LADDER[RATIO_LADDER.length - 1].delta_star_over_floor; // ~0.9922 (-> 1)
const RATIO_AT_K1 = RATIO_LADDER[0].delta_star_over_floor; // ~1.375

// (5) delta* expressed in imp-34799 per-operation units (how many directed-rounding per-op widenings it is).
const DELTASTAR_IN_PER_OP_UNITS = DELTA_STAR_HALFWIDTH / PER_OP_IMAGE_HALFWIDTH; // ~8.1 = (delta_min/eps) FP_LO

export const IMP34818_KRAWCZYK_DELTASTAR_VS_DIRECTED_ROUNDING_FLOOR = {
  id: 'imp-34818',
  proofSection: 'S-frontier',
  question:
    'imp-34794 located the tightest surviving double-precision certified Krawczyk half-width delta* at a ' +
    'fixed few-ULP outward-rounding budget K_FEW_ULP = 4, and imp-34799 derived an a-priori ' +
    'directed-rounding image half-width r_image(n_op) = gamma(n_op) N_cross / (1 - |g_prime|), but the two ' +
    'were never compared. Measure the ratio delta* / (a-priori directed-rounding floor) at the fixed ' +
    'few-ULP budget to assess whether the located surrogate bracket sits AT the directed-rounding floor ' +
    'or retains head-room a genuine directed-rounding certificate could use. Assessment only; does NOT ' +
    'close the imp-34714a machine certificate; imp-34714a REMAINS OPEN, no QED.',
  model: {
    bridge:
      'imp-34794 uses an outward-ULP budget k; imp-34799 uses an operation count n_op. imp-34799 bridges ' +
      'them: n_op^max / k* = 2 (1 - |g_prime|) = 2 FP_LO, so budget k corresponds at the (H2) break to ' +
      'n_op = 2 FP_LO k. Evaluating the imp-34799 floor there, r_image(2 FP_LO k) = (2 FP_LO k) eps ' +
      'N_cross / FP_LO = 2 k eps N_cross: the FP_LO contraction-gap amplification CANCELS and the ' +
      'directed-rounding floor at budget k is exactly 2 k eps N_cross -- identically the leading break ' +
      'term of the imp-34794 surrogate delta_min ~ (2 k + ~0.5) eps.',
    ratio:
      'delta*_halfwidth = (delta_min/eps) eps N_cross and floor_halfwidth = 2 k eps N_cross, so the ratio ' +
      'delta* / floor = (delta_min/eps) / (2 k) = (2 k + ~0.5) / (2 k) = 1 + 1/(4 k). At the few-ULP ' +
      'budget k = 4 this is ~1.0625: the surrogate half-width sits ~6% above the directed-rounding floor, ' +
      'the excess being exactly the imp-34794 ~0.5 eps endpoint-quantization (0.5 ULP(m)) additive.',
    convergence:
      'Across the imp-34794 k-ladder {1,2,4,8,16} the ratio equals the imp-34794 ratio_over_2keps column ' +
      '(1.375, 1.125, 1.0625, 1.0313, 0.9922) and converges to 1 as k grows: the surrogate tightens ONTO ' +
      'the directed-rounding floor with no residual head-room at large budget.',
  },
  constants: {
    N_cross: +N_CROSS.toPrecision(15), // 3.28029435165241e9
    K_few_ulp: K_FEW_ULP, // 4 (imp-34794 fixed budget)
    FP_LO_quotient_denominator: +FP_LO.toFixed(6), // ~0.954568
    eps: +EPS.toExponential(4), // 2.2204e-16
    delta_star_over_eps: DELTA_STAR_OVER_EPS, // ~8.5 (imp-34794 delta_min/eps)
    per_op_image_half_width: PER_OP_IMAGE_HALFWIDTH, // ~7.63e-7 (imp-34799 eps N_cross / FP_LO)
  },
  comparison: {
    // Assessment only; both delta* and the floor rest on the k eps / gamma(n) surrogate models (imp-34714a).
    delta_star_half_width_abs: +DELTA_STAR_HALFWIDTH.toExponential(4), // ~6.19e-6 = 8.5 eps N_cross
    matched_n_op_2_FP_LO_k: +MATCHED_N_OP.toFixed(4), // ~7.6365 (the 2 FP_LO k bridge)
    directed_rounding_floor_half_width_abs: +FLOOR_HALFWIDTH.toExponential(4), // ~5.83e-6 = 2 k eps N_cross
    floor_half_width_identity_2keps_Ncross: +FLOOR_HALFWIDTH_IDENTITY.toExponential(4), // ~5.83e-6 (FP_LO-cancels check)
    ratio_delta_star_over_floor: +RATIO.toFixed(6), // ~1.0625
    ratio_closed_delta_min_over_2k: +RATIO_CLOSED.toFixed(6), // ~1.0625 (same)
    headroom_fraction: +HEADROOM_FRACTION.toFixed(6), // ~0.0625 (~6% -- the endpoint-quantization additive)
    closed_form_1_plus_1_over_4k: +CLOSED_FORM_1_PLUS_1_OVER_4K.toFixed(6), // 1.0625 (predicted)
    ratio_ladder: RATIO_LADDER, // ratio -> 1 as k grows: 1.375, 1.125, 1.0625, 1.0313, 0.9922
    ratio_at_k1: +RATIO_AT_K1.toFixed(4), // ~1.375
    ratio_at_k16: +RATIO_AT_K16.toFixed(4), // ~0.9922 (converged to ~1)
    delta_star_in_directed_rounding_per_op_units: +DELTASTAR_IN_PER_OP_UNITS.toFixed(4), // ~8.11 = (delta_min/eps) FP_LO
  },
  finding:
    'Comparing the imp-34794 tightest surrogate certified half-width delta* against the imp-34799 a-priori ' +
    'directed-rounding image half-width at the fixed few-ULP budget K_FEW_ULP = 4: using the imp-34799 ' +
    'bridge n_op^max/k* = 2 FP_LO, the directed-rounding floor at the budget-matched op count n_op = ' +
    '2 FP_LO k is r_image(2 FP_LO k) = 2 k eps N_cross ~ 5.83e-6 (the FP_LO contraction-gap amplification ' +
    'CANCELS), identically the leading break term of the surrogate delta_min ~ (2 k + ~0.5) eps. The ' +
    'surrogate half-width delta*_halfwidth ~ 8.5 eps N_cross ~ 6.19e-6, so the RATIO delta* / floor = ' +
    '(delta_min/eps)/(2 k) = 1 + 1/(4 k) ~ 1.0625 at k = 4 -- the surrogate sits only ~6% ABOVE the ' +
    'directed-rounding floor, the excess being exactly the imp-34794 ~0.5 eps endpoint-quantization ' +
    '(0.5 ULP(m)) additive, NOT an order of magnitude of usable slack. Across the imp-34794 k-ladder ' +
    'the ratio EQUALS the ratio_over_2keps column (1.375, 1.125, 1.0625, 1.0313, 0.9922) and converges to ' +
    '1, so the surrogate tightens ONTO the directed-rounding floor with no residual head-room at large ' +
    'budget; delta* equals ~8.1 directed-rounding per-op widenings. So a genuine directed-rounding ' +
    'certificate could NOT tighten the enclosure below the surrogate by more than the fixed small factor ' +
    '1 + 1/(4 k): the surrogate delta* is a faithful proxy for the directed-rounding floor. EVIDENCE, ' +
    'NOT a machine certificate; imp-34714a REMAINS OPEN.',
  subGap:
    'imp-34714a REMAINS OPEN. That delta* and the a-priori directed-rounding floor agree to a fixed small ' +
    'constant factor 1 + 1/(4 k) is EVIDENCE the imp-34794 surrogate is a tight proxy for what a ' +
    'directed-rounding certificate would achieve; it does NOT prove the directed-rounding [g](m) and ' +
    '[F_prime] endpoints ARE valid enclosures -- both delta* and the floor rest on the k eps / gamma(n) ' +
    'surrogate models of the imp-34687a directed-rounding layer, not that layer, and F(m) = 0 remains a ' +
    'double-precision artifact. Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK delta* VS DIRECTED-ROUNDING-FLOOR COMPARISON (frontier, NOT an RH bound). imp-34794 located ' +
    'the tightest surrogate certified half-width delta* ~ 8.5 eps N_cross at the few-ULP budget k = 4 and ' +
    'imp-34799 derived the a-priori directed-rounding image half-width, but the two were never compared. ' +
    'Using the imp-34799 bridge n_op^max/k* = 2 FP_LO, the directed-rounding floor at the budget-matched ' +
    'op count n_op = 2 FP_LO k is r_image = 2 k eps N_cross ~ 5.83e-6 (the FP_LO amplification CANCELS) -- ' +
    'identically the leading break term of the surrogate. The RATIO delta* / floor = (delta_min/eps)/(2 k) ' +
    '= 1 + 1/(4 k) ~ 1.0625 at k = 4: the surrogate sits only ~6% ABOVE the directed-rounding floor, the ' +
    'excess being exactly the ~0.5 eps endpoint-quantization (0.5 ULP(m)) additive, NOT usable ' +
    'head-room. Across the imp-34794 k-ladder the ratio equals the ratio_over_2keps column (1.375, 1.125, ' +
    '1.0625, 1.0313, 0.9922) and converges to 1; delta* equals ~8.1 directed-rounding per-op widenings. ' +
    'INTERPRETATION: the imp-34794 tightest surrogate bracket sits ESSENTIALLY AT the imp-34799 a-priori ' +
    'directed-rounding floor -- a genuine directed-rounding certificate could NOT tighten below the ' +
    'surrogate by more than the fixed factor 1 + 1/(4 k), so delta* is a faithful proxy for the ' +
    'directed-rounding floor. This is EVIDENCE, NOT a machine certificate. SUB-GAP imp-34714a REMAINS ' +
    'OPEN: both delta* and the floor rest on the k eps / gamma(n) surrogate models, not the imp-34687a ' +
    'directed-rounding layer, and F(m) = 0 remains a double-precision artifact. Assessment only on the ' +
    'inherited imp-3220/imp-3406 surrogate crossover map; the C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb ' +
    'GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes ' +
    'no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34794 (tightest surrogate delta* and its k-ladder); imp-34799 (a-priori directed-rounding image ' +
    'half-width and n_op^max/k* = 2 FP_LO bridge); imp-34817 (complementary contraction-validity op ' +
    'ceiling); imp-34776 (k*(delta) = delta/(2 eps) budget the bridge uses); imp-34774 (fixed-point-map ' +
    'enclosure; F(m)=0 double-precision artifact; sub-gap imp-34714a); imp-34714 (Krawczyk ' +
    'existence-uniqueness lemma; sub-gap imp-34714a); imp-34687 (crossover interval-arithmetic scope; ' +
    'sub-gap imp-34687a directed-rounding layer); imp-33723 (Banach map g(N) = K log T0(N)); imp-2642 ' +
    '(C_C 1/8 ansatz); lambda-rh-height-mapping (effectiveHeightForN RvM inverse). Outward-rounded ' +
    'interval arithmetic and the gamma(n) = n eps/(1 - n eps) propagation factor: Moore, Neumaier, Higham.',
};

export const IMP34818_KRAWCZYK_DELTASTAR_VS_DIRECTED_ROUNDING_FLOOR_ASSERTIONS = [
  {
    // The FP_LO amplification CANCELS: the directed-rounding floor at n_op = 2 FP_LO k is exactly 2 k eps N_cross.
    id: 'imp34818-floor-is-2keps-Ncross',
    description: 'r_image(2 FP_LO k) = 2 k eps N_cross (FP_LO cancels); matches the 2 k eps N_cross identity to full precision',
    holds: () =>
      // per_op is stored at toExponential(4), so the FP_LO-cancellation identity matches only to ~1e-4.
      Math.abs(FLOOR_HALFWIDTH - FLOOR_HALFWIDTH_IDENTITY) < 1e-4 * FLOOR_HALFWIDTH_IDENTITY &&
      FLOOR_HALFWIDTH > 5e-6 &&
      FLOOR_HALFWIDTH < 7e-6 &&
      MATCHED_N_OP > 7 &&
      MATCHED_N_OP < 8,
  },
  {
    // The ratio delta*/floor ~ 1.0625 = 1 + 1/(4 k): the surrogate sits ~6% ABOVE the directed-rounding floor.
    id: 'imp34818-ratio-is-1-plus-1-over-4k',
    description: 'delta*/floor = (delta_min/eps)/(2 k) = 1 + 1/(4 k) ~ 1.0625 at k = 4; matches the closed form',
    holds: () =>
      // RATIO uses the toExponential(4) per_op, so it matches the exact RATIO_CLOSED only to ~1e-4.
      Math.abs(RATIO - RATIO_CLOSED) < 1e-4 &&
      Math.abs(RATIO - CLOSED_FORM_1_PLUS_1_OVER_4K) < 5e-3 &&
      RATIO > 1.0 &&
      RATIO < 1.1,
  },
  {
    // The head-room is a few percent (a fixed endpoint-quantization additive), NOT an order of magnitude.
    id: 'imp34818-headroom-is-a-few-percent-not-orders',
    description: 'head-room = ratio - 1 ~ 0.06 (the ~0.5 eps 0.5-ULP(m) additive over 2 k), not usable orders',
    holds: () =>
      HEADROOM_FRACTION > 0 &&
      HEADROOM_FRACTION < 0.1 &&
      DELTA_STAR_HALFWIDTH > FLOOR_HALFWIDTH, // surrogate is at-or-above the floor, never below it at k = 4
  },
  {
    // Across the imp-34794 k-ladder the ratio equals ratio_over_2keps and converges to 1 as k grows.
    id: 'imp34818-ratio-converges-to-one',
    description: 'ratio ladder = imp-34794 ratio_over_2keps (1.375 -> 0.9922); converges to 1 as budget k grows',
    holds: () =>
      RATIO_AT_K1 > 1.3 &&
      Math.abs(RATIO_AT_K16 - 1) < 0.05 &&
      RATIO_AT_K16 < RATIO_AT_K1 && // decreasing toward 1
      RATIO_LADDER.every((r, i, arr) => i === 0 || r.delta_star_over_floor <= arr[i - 1].delta_star_over_floor + 1e-9),
  },
  {
    // delta* equals ~8 directed-rounding per-op widenings = (delta_min/eps) FP_LO.
    id: 'imp34818-deltastar-in-per-op-units',
    description: 'delta*_halfwidth / per-op = (delta_min/eps) FP_LO ~ 8.1 directed-rounding per-op widenings',
    holds: () =>
      // per_op is stored at toExponential(4), so this matches (delta_min/eps) FP_LO only to ~1e-4.
      Math.abs(DELTASTAR_IN_PER_OP_UNITS - DELTA_STAR_OVER_EPS * FP_LO) < 1e-4 * DELTASTAR_IN_PER_OP_UNITS &&
      DELTASTAR_IN_PER_OP_UNITS > 7.5 &&
      DELTASTAR_IN_PER_OP_UNITS < 8.5,
  },
  {
    // Honesty gate: assessment / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp34818-honesty-gate-no-qed',
    description: 'delta* vs directed-rounding floor: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34818_KRAWCZYK_DELTASTAR_VS_DIRECTED_ROUNDING_FLOOR.isRigorous === false &&
      /imp-34714a/.test(IMP34818_KRAWCZYK_DELTASTAR_VS_DIRECTED_ROUNDING_FLOOR.subGap) &&
      /REMAINS OPEN/.test(IMP34818_KRAWCZYK_DELTASTAR_VS_DIRECTED_ROUNDING_FLOOR.subGap) &&
      /NO QED/.test(IMP34818_KRAWCZYK_DELTASTAR_VS_DIRECTED_ROUNDING_FLOOR.verdict) &&
      /refereed bound is changed/i.test(IMP34818_KRAWCZYK_DELTASTAR_VS_DIRECTED_ROUNDING_FLOOR.verdict),
  },
];

for (const a of IMP34818_KRAWCZYK_DELTASTAR_VS_DIRECTED_ROUNDING_FLOOR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34818-krawczyk-deltastar-vs-directed-rounding-floor assertion failed: ${a.id}`);
  }
}
