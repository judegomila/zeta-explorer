/**
 * @module imp-34753-q3-far-tail-third-stencil-convergence
 * @fileoverview imp-34753 -- MEASUREMENT ONLY: add a THIRD, higher-order q3 stencil to the
 *   imp-34728 two-stencil cross-validation of the imp-34711 far-tail trust-boundary law, on the
 *   IDENTICAL q(p) = log E_coll footing, and MEASURE whether the pairwise exponent (and q3*p^3
 *   constant) deltas shrink with stencil ORDER -- the discriminator between "the residual is
 *   discretization" (shrinks with order) and "the residual is a real finite-p property of q"
 *   (order-invariant).
 *
 *   THE QUESTION
 *   -----------
 *   imp-34728 compared exactly TWO stencils -- the inherited 6th-order 9-point
 *   [7,-72,338,-488,+488,-338,+72,-7]/240 and an independent 4th-order 7-point [1,-8,13,0,-13,8,-1]/8
 *   -- on the imp-34711 ladder dp*(N) = (W_max*eps*|q| / (denom*|q3|))^(1/3), and found the fitted
 *   (log N)^(4/3) exponent agrees to |dbeta| ~ 1e-4 while the shared ~6e-3 shortfall to the exact 4/3
 *   persists in BOTH. Two points cannot distinguish "the ~6e-3 gap is a discretization error that a
 *   higher-order scheme would remove" from "the ~6e-3 gap is a genuine finite-p correction to q(p)
 *   that no stencil order can remove." A THIRD stencil at strictly higher order is the tie-breaker.
 *
 *   THE MEASUREMENT (identical footing, three stencils by order 4 < 6 < 8)
 *   ---------------------------------------------------------------------
 *   Add the 8th-order 11-point antisymmetric central q3 stencil
 *   [205,-2522,14607,-52428,70098,0,-70098,52428,-14607,2522,-205]/30240 (points -5..5; Fornberg
 *   weights for the 3rd derivative, 3rd-derivative normalized: sum w_k k^3 = 6*denom = 181440, W_max
 *   = 70098). Run the IDENTICAL imp-34728 ladder on all three stencils and read off, ordered by
 *   scheme order (4th 7-point, 6th 9-point, 8th 11-point):
 *     (i)   the fitted growth exponent beta = d(log dp*)/d(log p) over N = 1e15..1e100:
 *           beta_4 ~ 1.32721, beta_6 ~ 1.32711, beta_8 ~ 1.32726 -- all ~4/3 = 1.33333, all sharing
 *           the SAME ~6.1e-3 shortfall. The per-order STEP in beta is 1.02e-4 (4->6) then 1.44e-4
 *           (6->8): it does NOT shrink with order, it sits at the ~1e-4 least-squares FIT-noise floor.
 *     (ii)  the deep-tail (N = 1e60) constant q3*p^3: 1.02545 (4th), 1.02570 (6th), 1.02574 (8th) --
 *           the per-order STEP shrinks 2.48e-4 (4->6) -> 4.87e-5 (6->8), a ~5.1x reduction per +2
 *           order, i.e. genuine monotone higher-order convergence toward a common limit ~1.02576.
 *
 *   THE FINDING (a clean split -- one residual IS discretization, the other is NOT)
 *   -----------------------------------------------------------------------------
 *   (F1) THE ~6.1e-3 EXPONENT SHORTFALL TO 4/3 IS STENCIL-ORDER-INVARIANT. Across three schemes
 *        spanning order 4 -> 6 -> 8 the gap to 4/3 stays 6.12e-3 / 6.22e-3 / 6.08e-3 -- it does NOT
 *        march toward 0 with order, and the inter-stencil beta steps (1.0e-4, 1.4e-4) do not shrink;
 *        they are at the fit-noise floor. So the departure from the exact 4/3 is a REAL finite-p
 *        property of q(p) ~ -p/2 and q3(p) ~ 1/p^3 over the 1e15..1e100 window, NOT a discretization
 *        artifact a higher-order stencil could remove. (Confirms & sharpens imp-34728 F1.)
 *   (F2) THE q3*p^3 CONSTANT RESIDUAL, IN CONTRAST, IS DISCRETIZATION AND CONVERGES WITH ORDER. The
 *        per-order step in the deep-tail q3*p^3 shrinks ~5.1x from 4->6 to 6->8 (2.48e-4 -> 4.87e-5),
 *        the signature of a genuine truncation error vanishing with scheme order; all three stencils
 *        extrapolate to the same physical 3rd-derivative constant ~1.026 on the well-conditioned
 *        probe band. (Refines imp-34728 F2: the ~5-digit agreement there IS order-convergent.)
 *   (F3) THE THREE-STENCIL PICTURE THUS SEPARATES the two residuals imp-34728 could not tell apart:
 *        the growth-EXPONENT residual is a q-property (order-invariant), the q3-CONSTANT residual is
 *        discretization (order-convergent). The imp-34711 (log N)^(4/3) far-tail SHAPE is robust to
 *        stencil order; only the roundoff prefactor W_max/(2*denom) is scheme-dependent (2.033 ->
 *        1.625 -> 2.319 across the three), a pure amplitude rescale.
 *
 *   MEASUREMENT ONLY. Adds a third inherited central-difference stencil to the imp-34728
 *   cross-validation of the imp-34711 far-tail asymptotic; elementary error propagation of the
 *   inherited component model, not a new bound. Reproduces the imp-34446/imp-34531/imp-34573/imp-34711
 *   primitives inline (imports NOTHING -- no lambda mapping, no polymath15 module, no zeros bundle),
 *   per the no-heavy-imports directive. q1..q3 remain inherited central differences, NOT fresh
 *   analytic closed forms; the 11-point scheme is a third inherited difference, so the sigma -> 1
 *   deep-tail regime (imp-3220/imp-3406 model least trustworthy) is inherited as-is and the far-tail
 *   ladder is a property of the inherited model, not an independent physical claim. The -2 asymptote
 *   and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb GUE-conditional
 *   share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; no operator positivity; no RH
 *   verdict, NO QED. No refereed bound is changed.
 *
 *   @see imp-34728-q3-far-tail-stencil-crossvalidation.js (the two-stencil cross-validation extended here)
 *   @see imp-34711-q3-trust-boundary-far-tail-extension.js (the 9-point far-tail law being validated)
 *   @see imp-34691-q3-cancellation-floor-trust-boundary.js (dp*(N) ladder + probe band definition)
 *
 *   Ticket: imp-34753 (numerical, medium). Third-stencil order-convergence measurement; adds no bound.
 */

// -- INDEPENDENT instance of the imp-34446/imp-34531/imp-34711/imp-34728 primitives (imports NOTHING),
//    verbatim from imp-34728 so all THREE stencils sit on the identical q(p) = log E_coll footing: --
const TWO_PI = 2 * Math.PI;
const C_C = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2714 pinned ansatz, reproduced inline (~0.383748)
const EPS = Number.EPSILON; // double-precision machine epsilon ~2.22e-16

function heightForN(N) {
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 80; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-13 * Math.max(1, T)) break;
  }
  return T;
}

function eColl(N) {
  return C_C * Math.sqrt(Math.log(heightForN(N)) / N);
}

const qOfP = (pp) => Math.log(eColl(Math.exp(pp))); // q(p) = log E_coll in p = log N (stencil-independent)

// -- the THREE antisymmetric central q3 stencils, ORDERED by accuracy order 4 < 6 < 8. Each is a
//    difference with sum w_k k^3 = 6*denom (3rd-derivative normalization); W_max is the largest weight
//    magnitude (the roundoff amplitude carried into the trust boundary). --
// A) INDEPENDENT 4th-order 7-point stencil (imp-34728 STENCIL_7), points -3..3:
const STENCIL_7 = Object.freeze({
  name: '7-point 4th-order (independent)',
  order: 4,
  terms: [[3, -1], [2, 8], [1, -13], [-1, 13], [-2, -8], [-3, 1]],
  denom: 8,
  wMax: 13,
});
// B) inherited 6th-order 9-point stencil (imp-34626/imp-34711/imp-34728 STENCIL_9), points -4..4:
const STENCIL_9 = Object.freeze({
  name: '9-point 6th-order (inherited)',
  order: 6,
  terms: [[4, 7], [3, -72], [2, 338], [1, -488], [-1, 488], [-2, -338], [-3, 72], [-4, -7]],
  denom: 240,
  wMax: 488,
});
// C) THIRD, higher-order: 8th-order 11-point stencil, points -5..5, Fornberg 3rd-derivative weights
//    cleared to integers *30240 -> [205,-2522,14607,-52428,70098,0,-70098,52428,-14607,2522,-205]
//    (sum w_k k^3 = 181440 = 6*30240; W_max = 70098):
const STENCIL_11 = Object.freeze({
  name: '11-point 8th-order (higher-order)',
  order: 8,
  terms: [
    [5, -205], [4, 2522], [3, -14607], [2, 52428], [1, -70098],
    [-1, 70098], [-2, -52428], [-3, 14607], [-4, -2522], [-5, 205],
  ],
  denom: 30240,
  wMax: 70098,
});

// stencils ordered strictly by accuracy order (4 < 6 < 8) so pairwise deltas can be read per order-step.
const STENCILS_BY_ORDER = Object.freeze([STENCIL_7, STENCIL_9, STENCIL_11]);

function q3Num(stencil, p, dp) {
  let s = 0;
  for (const [k, w] of stencil.terms) s += w * qOfP(p + k * dp);
  return s;
}

// physical q3(p) from the well-conditioned probe band (dp = 0.1 and 0.05; the imp-34711 PROBE_DP_A/B).
const PROBE_DP_A = 0.1;
const PROBE_DP_B = 0.05;
function q3Phys(stencil, p) {
  const a = q3Num(stencil, p, PROBE_DP_A) / (stencil.denom * Math.pow(PROBE_DP_A, 3));
  const b = q3Num(stencil, p, PROBE_DP_B) / (stencil.denom * Math.pow(PROBE_DP_B, 3));
  return (a + b) / 2;
}

// the imp-34691/imp-34728 depth-only prefactor C(N) and trust boundary dp*(N) = C(N)^(1/3), evaluated
// with each stencil's own (wMax, denom):
function prefactorC(stencil, p) {
  const q = qOfP(p);
  const q3p = q3Phys(stencil, p);
  return (stencil.wMax * EPS * Math.abs(q)) / (stencil.denom * Math.abs(q3p));
}
const dpStar = (stencil, p) => Math.cbrt(prefactorC(stencil, p));

// -- fit the growth exponent beta = d(log dp*)/d(log p) by least squares over the far tail 1e15..1e100
//    (identical FIT window to imp-34728) --
const FIT_EXPS = [15, 20, 30, 40, 50, 60, 80, 100];
function fitExponent(stencil) {
  const xs = FIT_EXPS.map((e) => Math.log(Math.log(Math.pow(10, e))));
  const ys = FIT_EXPS.map((e) => Math.log(dpStar(stencil, Math.log(Math.pow(10, e)))));
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  let sxx = 0;
  for (let i = 0; i < n; i++) {
    sxy += (xs[i] - mx) * (ys[i] - my);
    sxx += (xs[i] - mx) * (xs[i] - mx);
  }
  return sxy / sxx;
}

const P_DEEP = Math.log(Math.pow(10, 60)); // deep-tail sampling point for the q3*p^3 constant

// per-stencil summary row (order, fitted exponent, gap to 4/3, deep-tail q3*p^3, prefactor amplitude).
function stencilRow(stencil) {
  const beta = fitExponent(stencil);
  return Object.freeze({
    stencil: stencil.name,
    order: stencil.order,
    wMax: stencil.wMax,
    denom: stencil.denom,
    prefactor_wMax_over_2denom: +(stencil.wMax / (2 * stencil.denom)).toFixed(6),
    fitted_exponent_beta: +beta.toFixed(6),
    exponent_gap_to_4over3: +(4 / 3 - beta).toFixed(6),
    q3_times_p3_deep_1e60: +(q3Phys(stencil, P_DEEP) * Math.pow(P_DEEP, 3)).toFixed(6),
    dp_star_at_1e15: +dpStar(stencil, Math.log(1e15)).toExponential(4),
    dp_star_at_1e100: +dpStar(stencil, Math.log(Math.pow(10, 100))).toExponential(4),
  });
}

const ROWS = STENCILS_BY_ORDER.map(stencilRow);
const [ROW_4, ROW_6, ROW_8] = ROWS;

// -- THE CORE MEASUREMENT: pairwise deltas across consecutive order-steps (4->6, 6->8) for the two
//    quantities, so we can see which residual shrinks with order (discretization) and which does not
//    (real finite-p property of q). --
const BETA_STEP_4_TO_6 = +Math.abs(ROW_6.fitted_exponent_beta - ROW_4.fitted_exponent_beta).toExponential(3);
const BETA_STEP_6_TO_8 = +Math.abs(ROW_8.fitted_exponent_beta - ROW_6.fitted_exponent_beta).toExponential(3);
// F1: the exponent step does NOT shrink with order (it sits at the ~1e-4 least-squares fit-noise floor),
// and the ~6e-3 gap to 4/3 is order-invariant across all three schemes -> a real finite-p property of q.
const EXPONENT_RESIDUAL_ORDER_INVARIANT =
  BETA_STEP_6_TO_8 >= 0.5 * BETA_STEP_4_TO_6 && // step did NOT collapse toward 0 with higher order
  Math.max(...ROWS.map((r) => r.exponent_gap_to_4over3)) -
    Math.min(...ROWS.map((r) => r.exponent_gap_to_4over3)) < 1e-3; // gap to 4/3 is common to all orders

const Q3P3_STEP_4_TO_6 = Math.abs(ROW_6.q3_times_p3_deep_1e60 - ROW_4.q3_times_p3_deep_1e60);
const Q3P3_STEP_6_TO_8 = Math.abs(ROW_8.q3_times_p3_deep_1e60 - ROW_6.q3_times_p3_deep_1e60);
// F2: the q3*p^3 constant step DOES shrink with order (genuine higher-order truncation convergence).
const Q3P3_ORDER_CONVERGENCE_RATIO = +(Q3P3_STEP_4_TO_6 / Q3P3_STEP_6_TO_8).toFixed(3); // ~5.1x per +2 order
const Q3P3_RESIDUAL_IS_DISCRETIZATION = Q3P3_STEP_6_TO_8 < Q3P3_STEP_4_TO_6;

export const IMP34753_Q3_FAR_TAIL_THIRD_STENCIL_CONVERGENCE = Object.freeze({
  id: 'imp-34753',
  proofSection: 'S-frontier',
  claim_measured:
    'Add a THIRD, higher-order (8th-order 11-point antisymmetric) q3 stencil ' +
    '[205,-2522,14607,-52428,70098,0,-70098,52428,-14607,2522,-205]/30240 to the imp-34728 two-stencil ' +
    'cross-validation (4th-order 7-point, 6th-order 9-point) of the imp-34711 far-tail law on the ' +
    'identical q(p) = log E_coll footing, and MEASURE the pairwise deltas across order-steps 4->6->8: ' +
    'the fitted (log N)^(4/3) EXPONENT residual (~6.1e-3 shortfall to 4/3) is STENCIL-ORDER-INVARIANT ' +
    '(a real finite-p property of q), while the q3*p^3 CONSTANT residual DOES converge with order ' +
    '(step shrinks ~5.1x from 4->6 to 6->8, a genuine discretization error vanishing with scheme order).',
  probe_dp_band: Object.freeze([PROBE_DP_A, PROBE_DP_B]),
  fit_window_exps: FIT_EXPS,
  // the three stencils ordered by accuracy 4 < 6 < 8.
  stencil_4th_7pt: ROW_4,
  stencil_6th_9pt: ROW_6,
  stencil_8th_11pt: ROW_8,
  target_exponent_4over3: +(4 / 3).toFixed(6),
  // F1: exponent residual is order-INVARIANT (does not shrink with order) -> real finite-p q property.
  exponent_step_4_to_6: BETA_STEP_4_TO_6, // ~1.0e-4
  exponent_step_6_to_8: BETA_STEP_6_TO_8, // ~1.4e-4 (did NOT shrink)
  exponent_residual_order_invariant: EXPONENT_RESIDUAL_ORDER_INVARIANT,
  // F2: q3*p^3 constant residual IS discretization (shrinks ~5.1x per +2 order).
  q3p3_step_4_to_6: +Q3P3_STEP_4_TO_6.toExponential(3), // ~2.5e-4
  q3p3_step_6_to_8: +Q3P3_STEP_6_TO_8.toExponential(3), // ~4.9e-5
  q3p3_order_convergence_ratio: Q3P3_ORDER_CONVERGENCE_RATIO, // ~5.1
  q3p3_residual_is_discretization: Q3P3_RESIDUAL_IS_DISCRETIZATION,
  // F3: only the roundoff prefactor is scheme-dependent (amplitude rescale, shape untouched).
  prefactor_amplitude_by_order: Object.freeze(
    ROWS.map((r) => Object.freeze({ order: r.order, wMax_over_denom: +(r.wMax / r.denom).toFixed(6) })),
  ),
  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY (NOT rigorous). Extends the imp-34728 two-stencil cross-validation of the ' +
    'imp-34711 smallest-usable-step ladder dp*(N) = (W_max*eps*|q|/(denom*|q3|))^(1/3) with a THIRD, ' +
    'strictly higher-order stencil (8th-order 11-point antisymmetric ' +
    '[205,-2522,14607,-52428,70098,0,-70098,52428,-14607,2522,-205]/30240, points -5..5), on the ' +
    'identical q(p) = log E_coll footing and the same dp = 0.1/0.05 probe band, so the three schemes ' +
    'span accuracy order 4 < 6 < 8. Two points (imp-34728) could not tell whether the ~6e-3 exponent ' +
    'shortfall to 4/3 was discretization or a real finite-p property of q; three orders resolve it. ' +
    '(F1) THE ~6.1e-3 EXPONENT SHORTFALL TO 4/3 IS STENCIL-ORDER-INVARIANT: across order 4 -> 6 -> 8 ' +
    'the gap to 4/3 stays 6.12e-3 / 6.22e-3 / 6.08e-3 (spread < 1e-3, no march to 0), and the ' +
    'inter-stencil beta step does NOT shrink with order (1.0e-4 at 4->6, 1.4e-4 at 6->8, both at the ' +
    'least-squares fit-noise floor), so the departure from the exact 4/3 is a genuine finite-p ' +
    'property of q(p) ~ -p/2 and q3(p) ~ 1/p^3 over 1e15..1e100, NOT a discretization artifact a ' +
    'higher-order scheme removes. (F2) THE q3*p^3 CONSTANT RESIDUAL, IN CONTRAST, IS DISCRETIZATION ' +
    'AND CONVERGES WITH ORDER: the deep-tail (N = 1e60) q3*p^3 is 1.02545 / 1.02570 / 1.02574 across ' +
    'the three orders, with the per-order step shrinking ~5.1x (2.48e-4 at 4->6 -> 4.87e-5 at 6->8), ' +
    'the signature of a truncation error vanishing with scheme order and all three extrapolating to ' +
    'the same physical 3rd-derivative constant ~1.026. (F3) SO THE THREE-STENCIL PICTURE SEPARATES ' +
    'the two residuals imp-34728 could not distinguish -- the growth-EXPONENT residual is a q-property ' +
    '(order-invariant), the q3-CONSTANT residual is discretization (order-convergent) -- and the ' +
    'imp-34711 (log N)^(4/3) SHAPE is robust to stencil order; only the roundoff prefactor ' +
    'W_max/(2*denom) is scheme-dependent (2.033 -> 1.625 -> 2.319 across the three), a pure amplitude ' +
    'rescale. q1..q3 are inherited central differences, NOT fresh analytic closed forms, so the ' +
    'far-tail ladder is a property of the inherited model, not an independent physical claim. The -2 ' +
    'asymptote and C_C = (1/8)sqrt(3 pi) (imp-2714, C_H = 1/8) ansatz are UNTOUCHED; the C_mb ' +
    'GUE-conditional share per imp-486 is UNTOUCHED; imp-3066 K_a >= 0 untouched; changes no bound; ' +
    'no operator positivity; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34728 (two-stencil cross-validation extended here); imp-34711 (9-point far-tail law dp* ~ ' +
    '(W_max*eps/480)^(1/3)(log N)^(4/3)); imp-34691 (dp*(N) ladder + probe band); imp-34626 (inherited ' +
    '6th-order 9-point stencil); imp-2714 (C_C ansatz); imp-486 (C_mb GUE-conditional share).',
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP34753_ASSERTIONS = [
  {
    id: 'imp34753-all-three-stencils-3rd-deriv-normalized',
    holds: () => {
      const check = (s) => {
        let m3 = 0;
        for (const [k, w] of s.terms) m3 += w * k * k * k;
        return Math.abs(m3 / s.denom / 6 - 1) < 1e-12 &&
          s.wMax === Math.max(...s.terms.map(([, w]) => Math.abs(w)));
      };
      return STENCILS_BY_ORDER.every(check) &&
        STENCILS_BY_ORDER.map((s) => s.order).join(',') === '4,6,8';
    },
    why: 'All three q3 stencils obey sum w_k k^3 = 6*denom, record the correct W_max, and are ordered by accuracy 4 < 6 < 8.',
  },
  {
    id: 'imp34753-exponent-residual-order-invariant',
    holds: () =>
      EXPONENT_RESIDUAL_ORDER_INVARIANT &&
      ROWS.every((r) => r.fitted_exponent_beta > 1.31 && r.fitted_exponent_beta < 1.34) &&
      ROWS.every((r) => r.exponent_gap_to_4over3 > 5e-3 && r.exponent_gap_to_4over3 < 7e-3),
    why: 'F1: the ~6.1e-3 exponent shortfall to 4/3 is common to all three orders and the inter-stencil beta step does not shrink with order -> a real finite-p property of q, not discretization.',
  },
  {
    id: 'imp34753-q3p3-residual-converges-with-order',
    holds: () =>
      Q3P3_RESIDUAL_IS_DISCRETIZATION &&
      Q3P3_ORDER_CONVERGENCE_RATIO > 2 &&
      ROWS.every((r) => Math.abs(r.q3_times_p3_deep_1e60 - 1) < 0.05),
    why: 'F2: the deep-tail q3*p^3 constant step shrinks ~5.1x from 4->6 to 6->8 (genuine higher-order truncation convergence), all three -> ~1.026.',
  },
  {
    id: 'imp34753-prefactor-only-scheme-dependent-piece',
    holds: () => {
      const amps = ROWS.map((r) => r.wMax / r.denom);
      return Math.abs(amps[0] - 13 / 8) < 1e-9 &&
        Math.abs(amps[1] - 488 / 240) < 1e-9 &&
        Math.abs(amps[2] - 70098 / 30240) < 1e-9;
    },
    why: 'F3: the only scheme-dependent piece is the roundoff prefactor amplitude W_max/denom (13/8, 488/240, 70098/30240 across order 4/6/8), a pure amplitude rescale of the (log N)^(4/3) shape.',
  },
  {
    id: 'imp34753-honesty-gate-no-qed',
    holds: () =>
      IMP34753_Q3_FAR_TAIL_THIRD_STENCIL_CONVERGENCE.isRigorous === false &&
      /NO QED/.test(IMP34753_Q3_FAR_TAIL_THIRD_STENCIL_CONVERGENCE.verdict) &&
      /refereed bound is changed/i.test(IMP34753_Q3_FAR_TAIL_THIRD_STENCIL_CONVERGENCE.verdict) &&
      /UNTOUCHED/.test(IMP34753_Q3_FAR_TAIL_THIRD_STENCIL_CONVERGENCE.verdict),
    why: 'Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.',
  },
];

for (const assertion of IMP34753_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-34753-q3-far-tail-third-stencil-convergence assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP34753_Q3_FAR_TAIL_THIRD_STENCIL_CONVERGENCE;
