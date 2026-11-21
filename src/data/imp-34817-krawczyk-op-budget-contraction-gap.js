/**
 * @module imp-34817-krawczyk-op-budget-contraction-gap
 *
 * imp-34817 (numerical, frontier): imp-34799 models a directed-rounding evaluation of the imp-34774
 * Banach map g(m) = K log T0(m) as n_op elementary operations at unit roundoff eps = 2^-52 with the
 * standard first-order interval-arithmetic propagation factor gamma(n_op) = n_op eps / (1 - n_op eps),
 * amplifies the residual half-width by the contraction-gap factor 1/FP_LO ~ 1.0476, and derives a
 * strict-(H2)-margin op-count ceiling n_op^max = delta (1 - |g_prime|) / eps ~ 8.60e11. This module
 * derives the COMPLEMENTARY ceiling imp-34799 did not compute: the op count n_op* at which the FP-error
 * model gamma(n_op) itself OVERTAKES the Krawczyk contraction gap 1 - |g_prime| ~ 0.9546. That crossing
 * is the point where the accumulated relative rounding error of the n_op-operation evaluation is as large
 * as the very contraction margin the interval-Newton quotient divides by -- beyond it the certified
 * [F_prime] = 1 - [g_prime] enclosure can no longer be guaranteed to stay bounded away from the singular
 * quotient (relative image half-width reaches ~100% of N_cross), so the (H2) binding would fail on
 * contraction grounds rather than on delta-bracket grounds. Derivation/assessment only; does NOT close
 * the imp-34714a machine certificate. NO QED.
 *
 * THE TWO DISTINCT CEILINGS (this module isolates the SECOND one)
 * --------------------------------------------------------------
 * imp-34799 caps arithmetic depth by requiring the directed-rounding image to STILL fit the delta
 * bracket: r_image(n_op) = gamma(n_op) N_cross / FP_LO < delta N_cross, i.e. gamma(n_op) < delta FP_LO,
 * giving n_op^max = delta (1 - |g_prime|) / eps ~ 8.60e11 (the (H2)-MARGIN ceiling). A second, structural
 * ceiling is reached when gamma(n_op) grows to equal the contraction gap itself,
 *      gamma(n_op*) = 1 - |g_prime| ~ 0.9546   (the CONTRACTION-VALIDITY ceiling),
 * at which the residual relative half-width equals the contraction gap and the image relative half-width
 * gamma/FP_LO ~ G/FP_LO ~ 1 reaches ~100% of N_cross -- the enclosure spans the whole scale and the
 * interval-Newton quotient is no longer meaningfully contractive.
 *
 * CLOSED FORM FOR n_op*
 * --------------------
 * Solving gamma(n) = n eps / (1 - n eps) = G for n with G = 1 - |g_prime|:
 *      n eps = G (1 - n eps)  =>  n eps (1 + G) = G  =>  n_op* = G / ((1 + G) eps).
 * Numerically n_op* = 0.954577 / (1.954577 * 2.2204e-16) ~ 2.20e15 (matched to 1e-3 by direct bisection
 * on gamma(n) - G). A bisection cross-check confirms gamma(n_op*) = G to full double precision.
 *
 * WHICH CEILING BINDS (the (H2) margin, by ~2558x)
 * ------------------------------------------------
 * The two ceilings are nested:
 *      n_op* / n_op^max = [G / ((1 + G) eps)] / [delta FP_LO / eps] = 1 / ((1 + G) delta) ~ 2558
 * (using G ~ FP_LO). So the contraction-validity crossing sits ~2558x ABOVE the (H2)-margin ceiling: the
 * directed-rounding image blows past the delta bracket (relative half-width delta = 2e-4) long before
 * gamma reaches the contraction gap (relative half-width ~1). The OPERATIVE directed-rounding op budget
 * is therefore min(n_op^max, n_op*) = n_op^max ~ 8.60e11 -- (H2)-margin exhaustion, NOT loss of
 * certifiable contraction, is what caps arithmetic depth. Relative to the imp-34776 outward-ULP budget
 * k* = delta/(2 eps) ~ 4.50e11, n_op* / k* = 2G / ((1 + G) delta) ~ 4884.
 *
 * INTERPRETATION -- A LOOSER, NON-BINDING STRUCTURAL BOUND; CERTIFICATE STILL OPEN
 * -------------------------------------------------------------------------------
 * n_op* ~ 2.20e15 is the arithmetic depth at which the FP model would corrupt the contraction property
 * itself; it is ~2558x looser than the (H2)-margin ceiling and ~10 orders above any realistic O(10..100)
 * directed-rounding evaluation cost. It confirms the surrogate-to-directed-rounding transition is capped
 * by the delta bracket, not by contraction breakdown, over the entire physically-relevant op range. This
 * is EVIDENCE about where the FP model would fail, NOT a proof that a directed-rounding [g](m)/[F_prime]
 * ARE valid enclosures: the derivation ASSUMES the standard gamma(n) IA propagation rather than
 * instantiating the imp-34687a layer. The machine certificate imp-34714a REMAINS OPEN.
 *
 * DERIVATION / ASSESSMENT ONLY on the inherited imp-3220/imp-3406 surrogate crossover map; NOT a rigorous
 * asymptotic and NOT an RH bound. C_C = 1/8 ansatz (imp-2642/imp-2643) UNTOUCHED; C_mb GUE-conditional
 * per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes no operator
 * positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34799-krawczyk-directed-rounding-width-bound (the gamma(n_op) width model + (H2)-margin ceiling n_op^max ~ 8.60e11 this complements)
 * @see imp-34776-krawczyk-delta-sweep (k*(delta) = delta/(2 eps)(1+O(delta)); the outward-ULP budget)
 * @see imp-34774-krawczyk-fixed-point-map-enclosure (F(m)=0 double-precision artifact; sub-gap imp-34714a)
 * @see imp-34714-krawczyk-existence-uniqueness-lemma (the exact lemma; named sub-gap imp-34714a)
 * @see imp-34687 (crossover interval-arithmetic scope; sub-gap imp-34687a directed-rounding layer)
 * @see imp-33723-sigma-half-vs-crossover-closed-form (the Banach map g(N) = K log T0(N) and its fixed point)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const EPS = Number.EPSILON; // 2^-52 (directed-rounding unit roundoff upper bound)
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (identical K to imp-33723/imp-34774/imp-34799)
const DELTA = 2e-4; // same FIXED relative bracket half-width as imp-34774/imp-34776/imp-34799

// The shared imp-33723/imp-34774/imp-34799 Banach map g(N) = K log T0(N) and its closed-form g_prime.
const g = (N) => K_AMPL * Math.log(effectiveHeightForN(N));
const gPrime = (N) => {
  const T = effectiveHeightForN(N);
  const u = Math.log(T / TWO_PI);
  return (TWO_PI * K_AMPL) / (T * u);
};

// The double-precision fixed point m = N_cross, the contraction gap, and the [F_prime] lower endpoint.
function fixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = g(N);
  return N;
}
const N_CROSS = fixedPoint(1e9, 200); // 3.28029435165241e9
const M = N_CROSS;
const G_PRIME = gPrime(N_CROSS);
const CONTRACTION_GAP = 1 - Math.abs(G_PRIME); // 1 - |g_prime(N_cross)| ~ 0.954577
const FP_LO = 1 - Math.abs(gPrime(M * (1 - DELTA))); // ~0.954568 = the Krawczyk quotient denominator floor

// --- First-order IA propagation and the two op-count ceilings ---------------------------------------
const gammaN = (nOp) => (nOp * EPS) / (1 - nOp * EPS); // Moore/Neumaier propagation factor

// (1) CONTRACTION-VALIDITY ceiling: gamma(n_op*) = 1 - |g_prime|. Closed form n_op* = G/((1+G) eps).
const N_OP_STAR_CLOSED = CONTRACTION_GAP / ((1 + CONTRACTION_GAP) * EPS); // ~2.20e15
// Bisection cross-check: largest n with gamma(n) still below the contraction gap.
function nOpAtGammaEqualsGap() {
  let good = 1;
  let bad = 1;
  while (bad < 1e18) {
    if (gammaN(bad) < CONTRACTION_GAP) {
      good = bad;
      bad *= 2;
    } else break;
  }
  for (let i = 0; i < 200; i++) {
    const mid = 0.5 * (good + bad);
    if (gammaN(mid) < CONTRACTION_GAP) good = mid;
    else bad = mid;
  }
  return good;
}
const N_OP_STAR_BISECTION = nOpAtGammaEqualsGap();

// (2) (H2)-MARGIN ceiling recomputed for the head-to-head (identical to the imp-34799 n_op^max).
const N_OP_H2_MARGIN = (DELTA * FP_LO) / EPS; // ~8.60e11

// Relative image half-width at n_op* (gamma/FP_LO): reaches ~100% of N_cross -- the enclosure spans the scale.
const REL_IMAGE_HALFWIDTH_AT_STAR = gammaN(N_OP_STAR_CLOSED) / FP_LO; // ~1.000

// Nesting: n_op* sits ~2558x ABOVE the (H2)-margin ceiling => the (H2) margin BINDS.
const STAR_OVER_H2 = N_OP_STAR_CLOSED / N_OP_H2_MARGIN; // ~2558
const STAR_OVER_H2_STRUCTURAL = 1 / ((1 + CONTRACTION_GAP) * DELTA); // 1/((1+G) delta), using G ~ FP_LO
const OPERATIVE_BUDGET = Math.min(N_OP_H2_MARGIN, N_OP_STAR_CLOSED); // = N_OP_H2_MARGIN (the (H2) margin wins)

// Cross-reference to the imp-34776 outward-ULP budget k* = delta/(2 eps).
const K_STAR_IMP34776 = DELTA / (2 * EPS); // ~4.5036e11
const STAR_OVER_KSTAR = N_OP_STAR_CLOSED / K_STAR_IMP34776; // ~4884 = 2G/((1+G) delta)

export const IMP34817_KRAWCZYK_OP_BUDGET_CONTRACTION_GAP = {
  id: 'imp-34817',
  proofSection: 'S-frontier',
  question:
    'imp-34799 amplifies the directed-rounding residual half-width by the contraction gap 1 - |g_prime| ~ ' +
    '0.9546 and derives the strict-(H2)-margin op-count ceiling n_op^max ~ 8.60e11, but never computes the ' +
    'op count at which the FP-error model gamma(n_op) = n_op eps/(1 - n_op eps) itself OVERTAKES that ' +
    'contraction gap. Derive that crossing n_op*, the arithmetic-depth ceiling on which the (H2) binding ' +
    'would fail on contraction grounds, and determine which of the two ceilings binds. Does NOT close the ' +
    'imp-34714a machine certificate; derivation/assessment only, no QED.',
  model: {
    setup:
      'Directed-rounding g(m) = K log T0(m) modelled as n_op operations at unit roundoff eps = 2^-52; ' +
      'first-order IA propagation gamma(n_op) = n_op eps / (1 - n_op eps). The interval-Newton quotient ' +
      'divides the residual by [F_prime] = 1 - [g_prime] whose contraction gap is 1 - |g_prime| ~ 0.9546.',
    contraction_ceiling:
      'The FP model overtakes the contraction gap when gamma(n_op*) = 1 - |g_prime|. Solving n eps/(1 - ' +
      'n eps) = G gives the closed form n_op* = G / ((1 + G) eps) ~ 2.20e15; at n_op* the image relative ' +
      'half-width gamma/FP_LO ~ 1 reaches ~100% of N_cross, so the enclosure spans the scale and the ' +
      'interval-Newton quotient is no longer meaningfully contractive.',
    which_binds:
      'The two ceilings nest as n_op* / n_op^max = 1 / ((1 + G) delta) ~ 2558, so the contraction-validity ' +
      'crossing sits ~2558x ABOVE the (H2)-margin ceiling. The operative directed-rounding op budget is ' +
      'min(n_op^max, n_op*) = n_op^max ~ 8.60e11: (H2)-margin exhaustion, NOT loss of certifiable ' +
      'contraction, caps arithmetic depth over the entire physically-relevant op range.',
  },
  constants: {
    N_cross: +N_CROSS.toPrecision(15), // 3.28029435165241e9
    contraction_gap: +CONTRACTION_GAP.toFixed(6), // 1 - |g_prime| ~ 0.954577
    FP_LO_quotient_denominator: +FP_LO.toFixed(6), // ~0.954568
    eps: +EPS.toExponential(4), // 2.2204e-16
    delta: +DELTA.toExponential(1), // 2e-4
  },
  bound: {
    // Derivation/assessment only; assumes a well-behaved directed-rounding evaluation, certifies nothing (imp-34714a).
    n_op_star_gamma_equals_gap_closed: +N_OP_STAR_CLOSED.toExponential(4), // ~2.1995e15
    n_op_star_gamma_equals_gap_bisection: +N_OP_STAR_BISECTION.toExponential(4), // ~2.1995e15
    rel_image_half_width_at_star: +REL_IMAGE_HALFWIDTH_AT_STAR.toFixed(6), // ~1.000009 (~100% of N_cross)
    n_op_H2_margin_ceiling: +N_OP_H2_MARGIN.toExponential(4), // ~8.5980e11 (imp-34799 n_op^max)
    star_over_H2_margin: +STAR_OVER_H2.toFixed(1), // ~2558.1
    star_over_H2_margin_structural_1_over_1plusG_delta: +STAR_OVER_H2_STRUCTURAL.toFixed(1), // ~2558.1
    operative_op_budget: +OPERATIVE_BUDGET.toExponential(4), // ~8.5980e11 (= (H2)-margin ceiling)
    binding_ceiling: 'H2_margin', // the (H2)-margin ceiling binds, NOT the contraction-gap crossing
    k_star_imp34776: +K_STAR_IMP34776.toExponential(4), // ~4.5036e11
    star_over_k_star: +STAR_OVER_KSTAR.toFixed(1), // ~4883.8
  },
  finding:
    'The imp-34799 FP-error model gamma(n_op) = n_op eps/(1 - n_op eps) overtakes the Krawczyk contraction ' +
    'gap 1 - |g_prime| ~ 0.9546 at the closed-form op count n_op* = G/((1 + G) eps) ~ 2.20e15 (bisection ' +
    'cross-check agrees to 1e-3). At n_op* the image relative half-width gamma/FP_LO ~ 1 reaches ~100% of ' +
    'N_cross, so the certified enclosure spans the whole scale and the interval-Newton quotient stops ' +
    'being contractive. This CONTRACTION-VALIDITY ceiling sits ~2558x ABOVE the imp-34799 (H2)-margin ' +
    'ceiling n_op^max = delta(1 - |g_prime|)/eps ~ 8.60e11, the two nesting as n_op*/n_op^max = ' +
    '1/((1 + G) delta) ~ 2558. So the operative directed-rounding op budget is min(n_op^max, n_op*) = ' +
    'n_op^max ~ 8.60e11: the directed-rounding image blows past the delta bracket long before gamma ' +
    'reaches the contraction gap, i.e. (H2)-margin exhaustion (not loss of certifiable contraction) caps ' +
    'arithmetic depth. Since a realistic evaluation is O(10..100) ops, both ceilings are ~10 orders away. ' +
    'EVIDENCE about where the FP model would fail, NOT a machine certificate; imp-34714a REMAINS OPEN.',
  subGap:
    'imp-34714a REMAINS OPEN. This DERIVES the arithmetic depth n_op* at which the standard gamma(n) IA ' +
    'propagation would corrupt the contraction property itself, and shows it is ~2558x looser than the ' +
    '(H2)-margin ceiling; it does NOT instantiate the imp-34687a directed-rounding layer, so it does NOT ' +
    'prove the computed [g](m) and [F_prime] endpoints ARE valid enclosures. The ~2558x head-room of the ' +
    'contraction-validity ceiling over the binding (H2)-margin ceiling is EVIDENCE, not a proof. Adds no ' +
    'RH bound.',
  isRigorous: false,
  verdict:
    'KRAWCZYK OP-BUDGET CONTRACTION-GAP CEILING (frontier, NOT an RH bound). imp-34799 amplified the ' +
    'directed-rounding residual by the contraction gap and gave the (H2)-margin op ceiling n_op^max ~ ' +
    '8.60e11 but never found where gamma(n_op) OVERTAKES the gap. Solving gamma(n_op*) = 1 - |g_prime| ' +
    'gives the closed form n_op* = G/((1 + G) eps) ~ 2.20e15 (bisection cross-check agrees). At n_op* the ' +
    'image relative half-width gamma/FP_LO ~ 1 hits ~100% of N_cross -- the quotient stops contracting. ' +
    'The two ceilings nest as n_op*/n_op^max = 1/((1 + G) delta) ~ 2558, so the contraction-validity ' +
    'crossing sits ~2558x ABOVE the (H2)-margin ceiling; relative to the imp-34776 budget k* = delta/' +
    '(2 eps) ~ 4.50e11, n_op*/k* ~ 4884. INTERPRETATION: the operative directed-rounding op budget is ' +
    'min(n_op^max, n_op*) = n_op^max ~ 8.60e11 -- (H2)-margin exhaustion, NOT loss of certifiable ' +
    'contraction, caps arithmetic depth, and both ceilings are ~10 orders above any realistic O(10..100) ' +
    'op evaluation. This QUANTIFIES a complementary structural ceiling; it is EVIDENCE, NOT a machine ' +
    'certificate. SUB-GAP imp-34714a REMAINS OPEN: the derivation assumes a well-behaved directed-rounding ' +
    'evaluation, it does not instantiate the imp-34687a layer. Derivation/assessment only on the inherited ' +
    'imp-3220/imp-3406 surrogate crossover map; the C_C 1/8 ansatz (imp-2642/imp-2643) and C_mb ' +
    'GUE-conditional per imp-486 are UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; establishes ' +
    'no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34799 (directed-rounding width bound; gamma(n_op) model + (H2)-margin ceiling n_op^max ~ 8.60e11); ' +
    'imp-34776 (k*(delta) = delta/(2 eps)(1+O(delta)) budget); imp-34774 (fixed-point-map enclosure; F(m)=0 ' +
    'double-precision artifact; sub-gap imp-34714a); imp-34714 (Krawczyk existence-uniqueness lemma; sub-gap ' +
    'imp-34714a); imp-34687 (crossover interval-arithmetic scope; sub-gap imp-34687a directed-rounding ' +
    'layer); imp-33723 (Banach map g(N) = K log T0(N)); imp-2642 (C_C 1/8 ansatz); lambda-rh-height-mapping ' +
    '(effectiveHeightForN RvM inverse). Outward-rounded interval arithmetic and the gamma(n) = ' +
    'n eps/(1 - n eps) propagation factor: Moore, Neumaier, Higham (standard IA / rounding-error theory).',
};

export const IMP34817_KRAWCZYK_OP_BUDGET_CONTRACTION_GAP_ASSERTIONS = [
  {
    // The closed form n_op* = G/((1+G) eps) is the exact solution of gamma(n_op*) = contraction gap.
    id: 'imp34817-n-op-star-solves-gamma-equals-gap',
    description: 'gamma(n_op*) = 1 - |g_prime| at the closed-form n_op* = G/((1+G) eps); bisection agrees to 1e-3',
    holds: () =>
      Math.abs(gammaN(N_OP_STAR_CLOSED) - CONTRACTION_GAP) < 1e-9 * CONTRACTION_GAP &&
      Math.abs(N_OP_STAR_BISECTION / N_OP_STAR_CLOSED - 1) < 1e-3 &&
      N_OP_STAR_CLOSED > 1e15 &&
      N_OP_STAR_CLOSED < 1e16,
  },
  {
    // At n_op* the image relative half-width reaches ~100% of N_cross (enclosure spans the scale).
    id: 'imp34817-image-spans-scale-at-star',
    description: 'image relative half-width gamma/FP_LO at n_op* is ~1 (~100% of N_cross), quotient no longer contractive',
    holds: () =>
      REL_IMAGE_HALFWIDTH_AT_STAR > 0.99 &&
      REL_IMAGE_HALFWIDTH_AT_STAR < 1.01,
  },
  {
    // The contraction-validity ceiling is ~2558x LOOSER than the (H2)-margin ceiling: the (H2) margin binds.
    id: 'imp34817-H2-margin-is-the-binding-ceiling',
    description: 'n_op*/n_op^max = 1/((1+G) delta) ~ 2558 > 1, so the operative budget is the (H2)-margin ceiling ~8.60e11',
    holds: () =>
      STAR_OVER_H2 > 2000 &&
      STAR_OVER_H2 < 3000 &&
      Math.abs(STAR_OVER_H2 / STAR_OVER_H2_STRUCTURAL - 1) < 1e-3 && // closed nesting 1/((1+G) delta) matches
      Math.abs(OPERATIVE_BUDGET - N_OP_H2_MARGIN) < 1e-6 * N_OP_H2_MARGIN &&
      N_OP_H2_MARGIN > 1e11 &&
      N_OP_H2_MARGIN < 1e12,
  },
  {
    // Cross-reference to the imp-34776 outward-ULP budget: n_op*/k* = 2G/((1+G) delta) ~ 4884.
    id: 'imp34817-star-over-k-star-cross-ref',
    description: 'n_op*/k* (k* = delta/(2 eps)) ~ 4884 = 2 FP_LO * star_over_H2 (k* drops the FP_LO factor)',
    holds: () =>
      STAR_OVER_KSTAR > 4000 &&
      STAR_OVER_KSTAR < 5500 &&
      Math.abs(STAR_OVER_KSTAR / (2 * FP_LO * STAR_OVER_H2) - 1) < 1e-2,
  },
  {
    // Honesty gate: derivation / surrogate, not rigorous, sub-gap open, no QED, no refereed bound is changed.
    id: 'imp34817-honesty-gate-no-qed',
    description: 'Op-budget contraction-gap ceiling: isRigorous false, imp-34714a open, no QED, no refereed bound is changed',
    holds: () =>
      IMP34817_KRAWCZYK_OP_BUDGET_CONTRACTION_GAP.isRigorous === false &&
      /imp-34714a/.test(IMP34817_KRAWCZYK_OP_BUDGET_CONTRACTION_GAP.subGap) &&
      /REMAINS OPEN/.test(IMP34817_KRAWCZYK_OP_BUDGET_CONTRACTION_GAP.subGap) &&
      /NO QED/.test(IMP34817_KRAWCZYK_OP_BUDGET_CONTRACTION_GAP.verdict) &&
      /refereed bound is changed/i.test(IMP34817_KRAWCZYK_OP_BUDGET_CONTRACTION_GAP.verdict),
  },
];

for (const a of IMP34817_KRAWCZYK_OP_BUDGET_CONTRACTION_GAP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34817-krawczyk-op-budget-contraction-gap assertion failed: ${a.id}`);
  }
}
