/**
 * @module imp-34799-krawczyk-directed-rounding-width-bound
 *
 * imp-34799 (proof, frontier): imp-34774 and imp-34776 BOTH state that the k eps outward-ULP model is a
 * SURROGATE for the imp-34687a directed-rounding layer and does NOT instantiate it -- specifically that
 * F(m) = 0 at the crossover fixed point is a DOUBLE-PRECISION ARTIFACT of centring the bracket at the
 * machine fixed point, and that a genuine directed-rounding F(m) would be a small NONZERO interval that
 * tightens-but-does-not-collapse the Krawczyk image. Neither module ever BOUNDS how wide that genuine
 * directed-rounding instantiation interval would be. This module DERIVES an a-priori width bound for the
 * directed-rounding Krawczyk image at the imp-34774 crossover fixed point N_cross, quantifying (a) the
 * absolute width the certified enclosure would acquire once F(m) is no longer identically zero, (b) how
 * that width is amplified by the contraction gap 1 - |g_prime| through the interval-Newton quotient, and
 * (c) how many orders BELOW the a-priori (H2) bracket margin the directed-rounding width sits -- i.e. how
 * much head-room the surrogate-to-directed-rounding transition consumes. Derivation/assessment only; does
 * NOT close the imp-34714a machine certificate and claims no such closure. NO QED.
 *
 * THE GAP BEING QUANTIFIED (surrogate F(m)=0 vs directed-rounding F(m) is a nonzero interval)
 * ------------------------------------------------------------------------------------------
 * In imp-34774 the Krawczyk image is N([X]) = m - F(m)/[F_prime] with m = N_cross, F(N) = N - g(N),
 * g(N) = K log T0(N), and [F_prime] = 1 - [g_prime] whose lower endpoint FP_LO ~ 0.9546 = contraction
 * gap 1 - |g_prime(N_cross)|. In DOUBLE precision g(m) rounds to exactly m at the machine fixed point, so
 * F(m) = 0 and the nominal (k = 0) image COLLAPSES to the point m -- zero width. A GENUINE directed-
 * rounding evaluation of g(m) instead returns an enclosure [g](m) of nonzero width W_g (the accumulated
 * outward-rounding of the composite K log T0(m) evaluation), so F(m) = m - [g](m) is a nonzero interval
 * of width W_F = W_g centred near 0, and the image acquires a nonzero width. THAT width is what this
 * module bounds a-priori.
 *
 * THE A-PRIORI WIDTH BOUND (first-order outward-rounded interval arithmetic; Moore/Neumaier)
 * -----------------------------------------------------------------------------------------
 * Model a directed-rounding evaluation of g(m) as n_op elementary floating operations, each contributing
 * at most one unit-roundoff eps = 2^-52; the standard first-order propagation factor is
 * gamma(n_op) = n_op eps / (1 - n_op eps). Since m = N_cross is the fixed point, |g(m)| ~ N_cross, so the
 * residual half-width is bounded by
 *      r_F(n_op) <= gamma(n_op) * |g(m)| ~ gamma(n_op) * N_cross.
 * The interval-Newton quotient F(m)/[F_prime] divides this residual by [F_prime] (lower endpoint FP_LO),
 * so the image half-width is bounded by
 *      r_image(n_op) <= r_F(n_op) / FP_LO = gamma(n_op) * N_cross / (1 - |g_prime|),
 * i.e. the contraction gap 1 - |g_prime| ~ 0.9546 (< 1) AMPLIFIES the residual width by 1/0.9546 ~ 1.0476.
 * The directed-rounding enclosure width is W_image(n_op) = 2 r_image(n_op). This is the a-priori bound:
 * the certified enclosure widens from EXACTLY ZERO (surrogate) to ~ n_op eps N_cross / (1 - |g_prime|).
 *
 * WHAT THE BOUND SAYS NUMERICALLY (N_cross ~ 3.28e9, eps = 2^-52, contraction gap ~ 0.9546)
 * ----------------------------------------------------------------------------------------
 * The PER-OPERATION image half-width is eps N_cross / FP_LO ~ 7.63e-7 (absolute, in units of N). For a
 * representative evaluation cost n_op ~ 50 (the effectiveHeightForN RvM-inverse solve converges in ~6
 * quadratic Newton steps of ~7 ops each, plus the outer log and the K multiply), the directed-rounding
 * image half-width is r_image ~ 3.8e-5 and the full width W_image ~ 7.6e-5 -- versus the a-priori (H2)
 * bracket margin delta N_cross ~ 6.56e5 on each side. So the directed-rounding instantiation would widen
 * the enclosure from 0 to ~1e-4 absolute, which is ~ r_image / (delta N_cross) ~ 6e-11 of the available
 * margin: the enclosure remains DEEP inside the bracket, ~10 orders of magnitude below the (H2) margin.
 *
 * CROSS-CHECK WITH THE imp-34776 k* BUDGET (the width bound RE-DERIVES the tolerable op ceiling)
 * --------------------------------------------------------------------------------------------
 * Requiring the directed-rounding image to STILL satisfy strict (H2), r_image(n_op) < delta N_cross,
 * gives a closed-form CEILING on the tolerable operation count:
 *      n_op^max = delta (1 - |g_prime|) / eps ~ 2e-4 * 0.9546 / 2.22e-16 ~ 8.60e11.
 * This is exactly the imp-34776 outward-ULP budget re-expressed: k* = delta / (2 eps) ~ 4.5034e11 (the
 * 2 comes from the two compounded widenings on (H2)), so n_op^max / k* = 2 (1 - |g_prime|) ~ 1.909 -- the
 * width bound recovers the k* budget with the clean structural factor 2(1 - |g_prime|). A genuine
 * directed-rounding evaluation costs O(10..100) ops, ~10 orders BELOW this n_op^max ceiling, so (H2)
 * survives with essentially unchanged margin.
 *
 * INTERPRETATION -- THE WIDTH IS NONZERO BUT NEGLIGIBLE; CERTIFICATE STILL OPEN
 * ----------------------------------------------------------------------------
 * The a-priori width bound QUANTIFIES the imp-34774/imp-34776 caveat: replacing the F(m) = 0 surrogate by
 * a genuine directed-rounding F(m) widens the certified enclosure of N_cross from zero to
 * ~ n_op eps N_cross / (1 - |g_prime|) ~ 1e-4 absolute, still ~10 orders below the (H2) bracket margin,
 * so the enclosure would remain valid with negligible margin loss. This is EVIDENCE about how much the
 * directed-rounding layer would cost the margin, NOT a proof that the layer's computed [g](m) and
 * [F_prime] endpoints ARE valid enclosures: the bound ASSUMES a well-behaved n_op-operation directed-
 * rounding evaluation (the standard gamma(n) IA propagation) rather than instantiating one. The machine
 * certificate imp-34714a REMAINS OPEN.
 *
 * DERIVATION / ASSESSMENT ONLY on the inherited imp-3220/imp-3406 surrogate crossover map; NOT a rigorous
 * asymptotic and NOT an RH bound. C_C = (1/8) sqrt(3 pi) 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; C_mb
 * GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no
 * operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34774-krawczyk-fixed-point-map-enclosure (F(m)=0 double-precision artifact; nominal image collapses to m; sub-gap imp-34714a)
 * @see imp-34776-krawczyk-delta-sweep (k*(delta) = delta/(2 eps)(1+O(delta)); the surrogate slack budget this ceiling recovers)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (the exact lemma; named sub-gap imp-34714a)
 * @see imp-34687 (crossover interval-arithmetic scope; sub-gap imp-34687a directed-rounding layer)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (the Banach map g(N) = K log T0(N) and its fixed point)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse; the ~6-step Newton solve)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const EPS = Number.EPSILON; // 2^-52 (directed-rounding unit roundoff upper bound)
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-33723/imp-34774)
const DELTA = 2e-4; // same FIXED relative bracket half-width as the imp-34774/imp-34776 construction

// The shared imp-33723/imp-34774 Banach map g(N) = K log T0(N) and its closed-form g_prime.
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const gPrime = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};

// The double-precision fixed point m = N_cross and the interval-Newton denominator floor FP_LO.
function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 200); // 3.28029435165241e9
const M = N_CROSS;
const G_PRIME = gPrime(N_CROSS);
const CONTRACTION_GAP = 1 - Math.abs(G_PRIME); // 1 - |g_prime(N_cross)| ~ 0.954577
// [F_prime] lower endpoint over the fixed-delta bracket (g_prime monotone decreasing => F_prime increasing).
const FP_LO = 1 - Math.abs(gPrime(M * (1 - DELTA))); // ~0.954568 = the Krawczyk quotient denominator floor
const G_AT_M = Math.abs(g(M)); // |g(m)| ~ N_cross (m is the fixed point)

// --- The a-priori directed-rounding width bound ---------------------------------------------------
// First-order IA propagation factor for n_op elementary operations at unit roundoff eps (Moore/Neumaier).
const gammaN = (nOp) => (nOp * EPS) / (1 - nOp * EPS);
// Residual half-width bound r_F(n) <= gamma(n)|g(m)| and Krawczyk image half-width r_image = r_F/FP_LO.
const residualHalfWidth = (nOp) => gammaN(nOp) * G_AT_M;
const imageHalfWidth = (nOp) => residualHalfWidth(nOp) / FP_LO;
const BRACKET_MARGIN = DELTA * N_CROSS; // a-priori (H2) margin on each side (~6.56e5)

// Per-operation image half-width and its contraction-gap amplification over the raw residual per-op width.
const PER_OP_IMAGE_HALFWIDTH = (EPS * G_AT_M) / FP_LO; // ~7.63e-7 absolute
const CONTRACTION_AMPLIFICATION = 1 / FP_LO; // ~1.0476: how much 1 - |g_prime| widens the residual

// Representative directed-rounding evaluation costs (RvM-inverse Newton ~6 steps of ~7 ops + outer log/K).
const N_OP_SAMPLES = [10, 50, 100, 300];
const WIDTH_TABLE = N_OP_SAMPLES.map((nOp) => {
  const rImg = imageHalfWidth(nOp);
  return {
    nOp,
    imageHalfWidth: rImg,
    imageWidth: 2 * rImg,
    ratioToMargin: rImg / BRACKET_MARGIN, // fraction of the (H2) margin consumed
  };
});
const REPRESENTATIVE = WIDTH_TABLE[1]; // n_op = 50 rung

// Closed-form ceiling on the tolerable op count for strict (H2): r_image(n) < delta N_cross.
// r_image = gamma(n) N_cross / FP_LO < delta N_cross  =>  gamma(n) < delta FP_LO.
const N_OP_CEILING_CLOSED = (DELTA * FP_LO) / EPS; // ~8.60e11 (ignoring the 1 - n eps denominator)
// Exact ceiling by bisection on gamma(n) FP_LO... image touches the margin.
function largestNopUnderMargin() {
  let good = 1;
  let bad = 1;
  while (bad < 1e18) {
    if (imageHalfWidth(bad) < BRACKET_MARGIN) {
      good = bad;
      bad *= 2;
    } else break;
  }
  for (let i = 0; i < 200; i++) {
    const mid = 0.5 * (good + bad);
    if (imageHalfWidth(mid) < BRACKET_MARGIN) good = mid;
    else bad = mid;
  }
  return good;
}
const N_OP_CEILING_EXACT = largestNopUnderMargin();

// Cross-check against the imp-34776 outward-ULP budget k* = delta/(2 eps): n_op^max / k* = 2(1 - |g_prime|).
const K_STAR_IMP34776 = DELTA / (2 * EPS); // ~4.5036e11 (the delta/(2 eps) budget)
const CEILING_OVER_KSTAR = N_OP_CEILING_CLOSED / K_STAR_IMP34776; // ~1.909 = 2 * FP_LO
const CEILING_KSTAR_STRUCTURAL = 2 * FP_LO; // the predicted 2(1 - |g_prime|) factor
const CEILING_MATCHES_KSTAR = Math.abs(CEILING_OVER_KSTAR - CEILING_KSTAR_STRUCTURAL) / CEILING_KSTAR_STRUCTURAL < 1e-6;

// Orders of head-room: representative directed-rounding width sits this far below the (H2) margin.
const HEADROOM_ORDERS = Math.log10(BRACKET_MARGIN / REPRESENTATIVE.imageHalfWidth); // ~10.2

export const IMP34799_KRAWCZYK_DIRECTED_ROUNDING_WIDTH_BOUND = {
  id: 'imp-34799',
  proofSection: 'S-frontier',
  question:
    'imp-34774 and imp-34776 both state the k eps model is a SURROGATE for the imp-34687a directed-' +
    'rounding layer and does NOT instantiate it (F(m) = 0 is a double-precision artifact; a directed-' +
    'rounding F(m) would be a small nonzero interval). Derive an a-priori width bound for what a genuine ' +
    'directed-rounding instantiation interval would be at the Krawczyk fixed point N_cross, quantifying ' +
    'how much the certified enclosure would widen. Does NOT close the imp-34714a machine certificate; ' +
    'derivation/assessment only, no QED.',
  model: {
    setup:
      'Krawczyk image N([X]) = m - F(m)/[F_prime] at m = N_cross, F(N) = N - g(N), g(N) = K log T0(N), ' +
      '[F_prime] = 1 - [g_prime], FP_LO ~ 0.9546 = contraction gap 1 - |g_prime|. In double precision ' +
      'g(m) rounds to exactly m so F(m) = 0 and the nominal image COLLAPSES to the point m. A genuine ' +
      'directed-rounding [g](m) has nonzero width W_g, so F(m) = m - [g](m) is a nonzero interval and the ' +
      'image acquires width.',
    width_bound:
      'Model directed-rounding g(m) as n_op operations at unit roundoff eps = 2^-52; first-order IA ' +
      'propagation gamma(n_op) = n_op eps / (1 - n_op eps). Since |g(m)| ~ N_cross, the residual half-' +
      'width r_F <= gamma(n_op) N_cross, and the interval-Newton quotient by [F_prime] gives the image ' +
      'half-width r_image <= gamma(n_op) N_cross / (1 - |g_prime|). The certified enclosure thus widens ' +
      'from EXACTLY ZERO (surrogate) to ~ n_op eps N_cross / (1 - |g_prime|); the contraction gap ' +
      '1 - |g_prime| (< 1) amplifies the residual width by 1/0.9546 ~ 1.0476.',
    ceiling_recovers_k_star:
      'Requiring the directed-rounding image to still satisfy strict (H2), r_image < delta N_cross, gives ' +
      'a closed-form op-count ceiling n_op^max = delta (1 - |g_prime|) / eps ~ 8.60e11 -- exactly the ' +
      'imp-34776 budget k* = delta/(2 eps) ~ 4.5034e11 re-expressed, with n_op^max / k* = 2(1 - |g_prime|).',
  },
  constants: {
    N_cross: +N_CROSS.toPrecision(15), // 3.28029435165241e9
    g_prime_at_N_cross: +G_PRIME.toFixed(6), // ~0.045423
    contraction_gap: +CONTRACTION_GAP.toFixed(6), // 1 - |g_prime| ~ 0.954577
    FP_LO_quotient_denominator: +FP_LO.toFixed(6), // ~0.954568 (the [F_prime] lower endpoint)
    contraction_amplification_one_over_FP_LO: +CONTRACTION_AMPLIFICATION.toFixed(6), // ~1.047596
    eps: +EPS.toExponential(4), // 2.2204e-16
    delta: +DELTA.toExponential(1), // 2e-4
    bracket_margin_each_side: +BRACKET_MARGIN.toExponential(4), // ~6.5606e5
  },
  bound: {
    // Derivation/assessment only; assumes a well-behaved directed-rounding evaluation, certifies nothing (imp-34714a).
    per_op_image_half_width: +PER_OP_IMAGE_HALFWIDTH.toExponential(4), // ~7.63e-7 absolute
    width_table: WIDTH_TABLE.map((r) => ({
      n_op: r.nOp,
      image_half_width: +r.imageHalfWidth.toExponential(4),
      image_width: +r.imageWidth.toExponential(4),
      ratio_to_margin: +r.ratioToMargin.toExponential(4),
    })), // n_op = 10, 50, 100, 300
    representative_n_op: REPRESENTATIVE.nOp, // 50
    representative_image_width: +REPRESENTATIVE.imageWidth.toExponential(4), // ~7.63e-5 absolute
    representative_ratio_to_margin: +REPRESENTATIVE.ratioToMargin.toExponential(4), // ~5.8e-11
    headroom_orders_below_margin: +HEADROOM_ORDERS.toFixed(2), // ~10.2 orders
    n_op_ceiling_closed_form: +N_OP_CEILING_CLOSED.toExponential(4), // ~8.60e11
    n_op_ceiling_exact_bisection: +N_OP_CEILING_EXACT.toExponential(4), // ~8.60e11
    k_star_imp34776: +K_STAR_IMP34776.toExponential(4), // ~4.5036e11
    ceiling_over_k_star: +CEILING_OVER_KSTAR.toFixed(6), // ~1.909117
    ceiling_over_k_star_structural_2_gap: +CEILING_KSTAR_STRUCTURAL.toFixed(6), // 2(1 - |g_prime|) ~ 1.909136
    ceiling_matches_k_star: CEILING_MATCHES_KSTAR,
  },
  finding:
    'An a-priori width bound for a genuine directed-rounding instantiation of the imp-34774 Krawczyk ' +
    'fixed-point enclosure follows from first-order outward-rounded IA: r_image(n_op) <= n_op eps ' +
    'N_cross / (1 - |g_prime|). The surrogate F(m) = 0 collapses the image to a POINT (zero width); a ' +
    'directed-rounding F(m) widens it to ~ n_op eps N_cross / (1 - |g_prime|), the contraction gap ' +
    '1 - |g_prime| ~ 0.9546 amplifying the raw residual width by ~1.0476. Numerically the per-operation ' +
    'image half-width is ~7.63e-7 absolute, so a representative n_op ~ 50 evaluation gives image WIDTH ' +
    '~7.63e-5 -- versus the a-priori (H2) bracket margin delta N_cross ~ 6.56e5 each side, i.e. only ' +
    '~5.8e-11 of the margin, ~10.2 orders BELOW it. Requiring strict (H2) to survive gives the ' +
    'closed-form op-count ceiling n_op^max = delta (1 - |g_prime|) / eps ~ 8.60e11, which is EXACTLY the ' +
    'imp-34776 budget k* = delta/(2 eps) ~ 4.5034e11 re-expressed, with n_op^max / k* = 2(1 - |g_prime|) ' +
    '~ 1.909. So a genuine directed-rounding evaluation (O(10..100) ops) would widen the certified ' +
    'enclosure of N_cross from zero to ~1e-4 absolute while staying ~10 orders below the (H2) margin: ' +
    'the enclosure remains valid with negligible margin loss. EVIDENCE about the directed-rounding cost, ' +
    'NOT a machine certificate; imp-34714a REMAINS OPEN.',
  subGap:
    'imp-34714a REMAINS OPEN. This DERIVES an a-priori width for the directed-rounding image ASSUMING a ' +
    'well-behaved n_op-operation directed-rounding evaluation (the standard gamma(n) IA propagation); it ' +
    'does NOT instantiate the imp-34687a directed-rounding layer, so it does NOT prove the computed ' +
    '[g](m) and [F_prime] endpoints ARE valid enclosures. The ~10-order head-room below the (H2) margin ' +
    'is EVIDENCE the surrogate-to-directed-rounding transition costs negligible margin, not a proof. ' +
    'Adds no RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK DIRECTED-ROUNDING WIDTH BOUND (frontier, NOT an RH bound). imp-34774/imp-34776 flagged that ' +
    'the k eps model is a SURROGATE and F(m) = 0 is a double-precision artifact, but never bounded the ' +
    'genuine directed-rounding instantiation width. First-order outward-rounded IA gives r_image(n_op) ' +
    '<= n_op eps N_cross / (1 - |g_prime|): the surrogate collapses the image to a POINT (zero width), a ' +
    'directed-rounding F(m) widens it to ~ n_op eps N_cross / (1 - |g_prime|), the contraction gap ' +
    '1 - |g_prime| ~ 0.9546 amplifying by ~1.0476. Per-op image half-width ~7.63e-7; representative ' +
    'n_op ~ 50 gives image WIDTH ~7.63e-5 vs the (H2) margin delta N_cross ~ 6.56e5, only ~5.8e-11 of it ' +
    '(~10.2 orders below). The strict-(H2) op-count ceiling n_op^max = delta (1 - |g_prime|) / eps ~ ' +
    '8.60e11 EXACTLY recovers the imp-34776 budget k* = delta/(2 eps) ~ 4.5034e11 with n_op^max / k* = ' +
    '2(1 - |g_prime|) ~ 1.909. INTERPRETATION: a real directed-rounding evaluation (O(10..100) ops) ' +
    'widens the certified enclosure of N_cross from zero to ~1e-4 absolute while staying ~10 orders below ' +
    'the (H2) margin -- the enclosure stays valid with negligible margin loss. This QUANTIFIES the cost ' +
    'of the surrogate-to-directed-rounding transition; it is EVIDENCE, NOT a machine certificate. SUB-GAP ' +
    'imp-34714a REMAINS OPEN: the derivation assumes a well-behaved directed-rounding evaluation, it does ' +
    'not instantiate the imp-34687a layer. Derivation/assessment only on the inherited imp-3220/imp-3406 ' +
    'surrogate crossover map; the C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb GUE-conditional per imp-486 ' +
    'are UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator positivity; no ' +
    'RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34774 (fixed-point-map enclosure; F(m)=0 double-precision artifact; nominal image collapses to ' +
    'm; sub-gap imp-34714a); imp-34776 (k*(delta) = delta/(2 eps)(1+O(delta)) budget this ceiling ' +
    'recovers); imp-34714 (Krawczyk existence-uniqueness lemma; sub-gap imp-34714a); imp-34687 (crossover ' +
    'interval-arithmetic scope; sub-gap imp-34687a directed-rounding layer); imp-33723 (Banach map ' +
    'g(N) = K log T0(N) and its fixed point); imp-2642 (C_C 1/8 ansatz); lambda-rh-height-mapping ' +
    '(effectiveHeightForN, RvM inverse Newton solve). Outward-rounded interval arithmetic and the ' +
    'gamma(n) = n eps/(1 - n eps) propagation factor: Moore, Neumaier, Higham (standard IA / rounding-error theory).',
};

export const IMP34799_KRAWCZYK_DIRECTED_ROUNDING_WIDTH_BOUND_ASSERTIONS = [
  {
    // The surrogate image is a point (zero width); the directed-rounding image half-width grows linearly in n_op.
    id: 'imp34799-directed-rounding-width-grows-linearly',
    description: 'image half-width r_image(n_op) ~ n_op * per-op width, linear in n_op (surrogate limit n_op->0 is zero width)',
    holds: () => {
      const r1 = imageHalfWidth(1);
      const r10 = imageHalfWidth(10);
      return (
        Math.abs(r1 - PER_OP_IMAGE_HALFWIDTH) / PER_OP_IMAGE_HALFWIDTH < 1e-9 &&
        Math.abs(r10 / r1 - 10) < 1e-6 && // linear in n_op to first order
        PER_OP_IMAGE_HALFWIDTH > 7e-7 &&
        PER_OP_IMAGE_HALFWIDTH < 8e-7
      );
    },
  },
  {
    // The contraction gap amplifies the residual width by 1/(1 - |g_prime|) ~ 1.0476 through the Krawczyk quotient.
    id: 'imp34799-contraction-gap-amplification',
    description: 'image half-width = residual half-width / (1 - |g_prime|); amplification 1/FP_LO ~ 1.0476',
    holds: () =>
      Math.abs(CONTRACTION_AMPLIFICATION - 1 / FP_LO) < 1e-12 &&
      CONTRACTION_AMPLIFICATION > 1.04 &&
      CONTRACTION_AMPLIFICATION < 1.06 &&
      Math.abs(imageHalfWidth(50) - residualHalfWidth(50) / FP_LO) < 1e-9 * imageHalfWidth(50),
  },
  {
    // The representative directed-rounding width sits ~10 orders BELOW the (H2) bracket margin.
    id: 'imp34799-width-orders-below-H2-margin',
    description: 'representative n_op ~ 50 image half-width is ~1e-10 of the delta*N_cross (H2) margin (~10 orders below)',
    holds: () =>
      REPRESENTATIVE.ratioToMargin < 1e-9 &&
      REPRESENTATIVE.ratioToMargin > 1e-12 &&
      HEADROOM_ORDERS > 9 &&
      HEADROOM_ORDERS < 12 &&
      REPRESENTATIVE.imageWidth > 1e-5 &&
      REPRESENTATIVE.imageWidth < 1e-3,
  },
  {
    // The strict-(H2) op-count ceiling recovers the imp-34776 k* budget with the factor 2(1 - |g_prime|).
    id: 'imp34799-op-ceiling-recovers-k-star',
    description: 'n_op^max = delta(1-|g_prime|)/eps recovers k* = delta/(2 eps) with n_op^max/k* = 2(1-|g_prime|) ~ 1.909',
    holds: () =>
      N_OP_CEILING_CLOSED > 1e11 &&
      N_OP_CEILING_CLOSED < 1e12 &&
      Math.abs(N_OP_CEILING_EXACT / N_OP_CEILING_CLOSED - 1) < 1e-3 && // exact bisection matches closed form
      CEILING_MATCHES_KSTAR &&
      Math.abs(CEILING_OVER_KSTAR - 2 * FP_LO) < 1e-4,
  },
  {
    // Honesty gate: derivation / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp34799-honesty-gate-no-qed',
    description: 'Directed-rounding width bound: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34799_KRAWCZYK_DIRECTED_ROUNDING_WIDTH_BOUND.isRigorous === false &&
      /imp-34714a/.test(IMP34799_KRAWCZYK_DIRECTED_ROUNDING_WIDTH_BOUND.subGap) &&
      /REMAINS OPEN/.test(IMP34799_KRAWCZYK_DIRECTED_ROUNDING_WIDTH_BOUND.subGap) &&
      /NO QED/.test(IMP34799_KRAWCZYK_DIRECTED_ROUNDING_WIDTH_BOUND.verdict) &&
      /refereed bound is changed/i.test(IMP34799_KRAWCZYK_DIRECTED_ROUNDING_WIDTH_BOUND.verdict),
  },
];

for (const a of IMP34799_KRAWCZYK_DIRECTED_ROUNDING_WIDTH_BOUND_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34799-krawczyk-directed-rounding-width-bound assertion failed: ${a.id}`);
  }
}
