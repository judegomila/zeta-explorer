/**
 * @module imp-34864-crossover-gppp-shrink-ratio-limit
 *
 * imp-34864 (accuracy, S-frontier): imp-34839 derived that the crossover-map SECOND-derivative
 * envelope per-decade shrink ratio B2(N)/B2(10N) -> EXACTLY 100 with residual
 * 100 - r ~ (100 log 10)/u^2 (fitted constant C_k = (100-r_k) u_k^2 -> 100 log 10 = 230.2585,
 * 0.9775 at 1e9 to 0.9991 at 1e150). The T^2 factor in g_double_prime = -K(u+1)/(M^2 u^3) sets the
 * 100x/decade limit. The THIRD derivative carries a T^3 factor, so imp-34839 flagged an untested
 * "1000x/decade" order-up prediction. This module DERIVES the third-derivative envelope shrink-ratio
 * limit and its residual constant by the SAME factoring, and MEASURES the approach, reusing the
 * imp-34768/imp-34757 closed form VERBATIM.
 *
 * WHAT THIS ADDS (accuracy assessment on the inherited surrogate; no new mathematics, no new bound)
 * -------------------------------------------------------------------------------------------------
 *   (Y1) DERIVES the limit. Writing B3(N) = K (2u^2+4u+3) / (M^3 u^5) with M = T0(N)/2pi and
 *        u = log M (from g_triple_prime = 8 pi^3 K (2u^2+4u+3)/(T^3 u^5), T = 2pi M), the per-decade
 *        left-endpoint shrink ratio factors EXACTLY as
 *            r3(N) = B3(N)/B3(10N) = (M_prime/M)^3 * (u_prime/u)^5 * (2u^2+4u+3)/(2u_prime^2+4u_prime+3).
 *        The Riemann-von Mangoldt leading law N = M(u-1) forces the decade step s = u_prime - u to
 *        solve e^s (u_prime - 1) = 10 (u - 1), so s -> log 10 and M_prime/M -> 10, hence
 *        (M_prime/M)^3 -> 1000 while the u-factors and the quadratic-ratio -> 1. The limit is EXACTLY
 *        1000x/decade (the T^3 factor), one order up from imp-34839.
 *   (Y2) DERIVES the residual constant by the SAME second-order expansion. Expanding
 *        log(r3/1000) = 3(s - log 10) + 5 log(u_prime/u) + [log P(u) - log P(u_prime)] with
 *        P = 2u^2+4u+3 and s = log 10 - (log 10)/u + O(1/u^2): the O(1/u) terms cancel
 *        (coefficients -3 + 5 - 2 = 0, which is WHY r3 -> 1000) AND the L^2/u^2 terms cancel
 *        (3/2 - 5/2 + 1 = 0), leaving the SAME leading term as order 2, log(r3/1000) ~ -(log 10)/u^2.
 *        Hence 1000 - r3 ~ 1000 (log 10)/u^2, i.e. the residual constant is C3 = 1000 log 10 = 2302.5851.
 *        GENERAL PATTERN: for the p-th M-power envelope the leading order-up residual is
 *        (limit) x (log 10) / u^2 with limit = 10^p, so log(r/10^p) ~ -(log 10)/u^2 UNIVERSALLY and the
 *        residual constant scales with the limit: 100 log 10 (order 2), 1000 log 10 (order 3).
 *   (Y3) MEASURES the approach on the extended decade ladder [1e9 .. 1e30] plus deep probes at
 *        {1e40, 1e80, 1e150, 1e300} (computed via the numerically-stable FACTORED ratio, so M^3 never
 *        overflows). It forms the fitted constant C3_k = (1000 - r3_k) u_k^2 and finds it converges to
 *        1000 log 10 -- but from ABOVE (monotonically DECREASING: 1.0284 of the limit at 1e9, 1.0010 at
 *        1e300), the OPPOSITE sign to order 2 which rose from below (0.9775 -> 0.9991). The O(1/u^3)
 *        correction flips sign between the two orders; both confirm the SAME leading constant.
 *   (Y4) CROSS-CHECKS the algebra. The factored ratio equals a direct B3(N)/B3(10N) recomputation to
 *        machine precision on the shallow bands (where M^3 is still finite in double precision), and the
 *        ratios rise strictly and stay strictly below the derived 1000 across the full ladder.
 *
 * THE CLOSED FORM (inherited from imp-34768 / imp-34731 / imp-34757, unchanged)
 * ----------------------------------------------------------------------------
 *     g(N) = K log T0(N),  K = (C_C/E_trunc)^2 ~ 1.5727e8,  T = T0(N),  u = log(T/2pi),
 *     g_triple_prime(N) = 8 pi^3 K (2u^2+4u+3) / (T^3 u^5) = K (2u^2+4u+3)/(M^3 u^5),  M = T/2pi.
 *
 * THE FINDING (accuracy assessment only)
 * --------------------------------------
 *   (Y1) The third-derivative per-decade shrink ratio limit is EXACTLY 1000x/decade (T^3 factor),
 *        one order up from the imp-34839 100x/decade (T^2 factor).
 *   (Y2)/(Y3) The residual obeys 1000 - r3 ~ (1000 log 10)/u^2; the fitted constant
 *        C3_k = (1000-r3_k) u_k^2 converges to 1000 log 10 = 2302.5851 -- but from ABOVE (decreasing),
 *        the sign-flipped mirror of order 2. The general envelope pattern is residual constant = limit x log 10.
 *   (Y4) The factored ratio matches direct B3 recomputation to machine precision; ratios rise strictly
 *        below 1000.
 *
 * ACCURACY ASSESSMENT ONLY. This derives + measures the third-order curvature-envelope shrink LIMIT of
 * the INHERITED imp-3220/imp-3406 surrogate crossover map; it introduces NO new bound and changes none.
 * The C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is
 * UNTOUCHED; establishes no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34839-crossover-gpp-shrink-ratio-limit (SECOND-derivative 100x/decade + (100 log 10)/u^2 residual)
 * @see imp-34768-crossover-gppp-global-envelope (g_triple_prime = 8 pi^3 K (2u^2+4u+3)/(T^3 u^5) closed form)
 * @see imp-34757-crossover-gpp-dense-cross-check (per-band envelope; monotone within each band)
 * @see imp-34731-crossover-map-second-derivative-bound (g_double_prime closed form; 5-probe check)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (imp-33723 amplitude)
const LN10 = Math.log(10);

// (Y1) DERIVED per-decade shrink-ratio limit: exactly 1000x/decade (the T^3 factor).
const SHRINK_RATIO_LIMIT = 1000;
// (Y2) DERIVED residual-law constant: 1000 - r3 ~ (1000 log 10)/u^2, so C3 = 1000 log 10.
const RESIDUAL_LAW_CONSTANT = 1000 * LN10; // 2302.585093...

// CLOSED FORM (inherited imp-34768): |g_triple_prime| = 8 pi^3 K (2u^2+4u+3)/(T^3 u^5) = K P(u)/(M^3 u^5).
function polyP(u) {
  return 2 * u * u + 4 * u + 3;
}
function uOfN(N) {
  return Math.log(effectiveHeightForN(N) / TWO_PI);
}

// (Y3)/(Y4) Per-decade ratio via the FACTORED form (numerically stable to arbitrary depth: M_prime/M
// is computed as T_prime/T so M^3 never overflows double precision, unlike a direct K P(u)/(M^3 u^5)).
//     r3 = (M_prime/M)^3 (u_prime/u)^5 P(u)/P(u_prime).
function shrinkRatioFactored(e) {
  const T = effectiveHeightForN(Math.pow(10, e));
  const Tp = effectiveHeightForN(Math.pow(10, e + 1));
  const u = Math.log(T / TWO_PI);
  const up = Math.log(Tp / TWO_PI);
  const mRatio = Tp / T; // M_prime/M = T_prime/T
  return mRatio ** 3 * (up / u) ** 5 * polyP(u) / polyP(up);
}

// (Y4) Direct third-derivative recomputation (valid only where M^3 stays finite in double precision,
// i.e. the shallow bands) -- an algebra cross-check that the factored ratio is faithful.
function absThirdDeriv(N) {
  const M = effectiveHeightForN(N) / TWO_PI;
  const u = Math.log(M);
  return (K_AMPL * polyP(u)) / (M ** 3 * u ** 5);
}
function shrinkRatioDirect(e) {
  return absThirdDeriv(Math.pow(10, e)) / absThirdDeriv(Math.pow(10, e + 1));
}

// (Y3) Extended decade ladder [1e9..1e30] plus deep probes {1e40,1e80,1e150,1e300}. Each row: exact
// per-decade ratio r3_k = B3(1eE)/B3(1e(E+1)), residual 1000 - r3_k, u_k = log(T0/2pi), and the fitted
// constant C3_k = (1000 - r3_k) u_k^2.
const LADDER_EXPONENTS = [];
for (let e = 9; e <= 30; e++) LADDER_EXPONENTS.push(e);
const DEEP_PROBE_EXPONENTS = [40, 80, 150, 300];

function rowFor(e) {
  const r = shrinkRatioFactored(e);
  const residual = SHRINK_RATIO_LIMIT - r;
  const u = uOfN(Math.pow(10, e));
  return {
    log10N: e,
    shrinkRatio: r,
    residual,
    u,
    fittedConstant_C: residual * u * u, // -> 1000 log 10 as u -> infinity
    ratioToLimit_C: (residual * u * u) / RESIDUAL_LAW_CONSTANT, // -> 1
  };
}

const LADDER_ROWS = LADDER_EXPONENTS.map(rowFor);
const DEEP_ROWS = DEEP_PROBE_EXPONENTS.map(rowFor);

// (Y1) the exact ratios strictly RISE toward the limit and stay strictly below it across the full
// ladder (algebraic, monotone approach to 1000 -- no overshoot, no far-tail breakdown).
let RATIOS_RISE_TO_LIMIT = true;
for (let i = 1; i < LADDER_ROWS.length; i++) {
  if (!(LADDER_ROWS[i].shrinkRatio > LADDER_ROWS[i - 1].shrinkRatio)) RATIOS_RISE_TO_LIMIT = false;
  if (!(LADDER_ROWS[i].shrinkRatio < SHRINK_RATIO_LIMIT)) RATIOS_RISE_TO_LIMIT = false;
}

// (Y3) the fitted constant C3_k = (1000 - r3_k) u_k^2 converges to 1000 log 10 from ABOVE -- it
// DECREASES monotonically across the combined ladder + deep probes and stays strictly above the limit
// (the sign-flipped mirror of the imp-34839 order-2 ladder, which rose from below).
const COMBINED = [...LADDER_ROWS, ...DEEP_ROWS];
let FITTED_C_FALLS_TO_LAW = true;
for (let i = 1; i < COMBINED.length; i++) {
  if (!(COMBINED[i].fittedConstant_C < COMBINED[i - 1].fittedConstant_C)) FITTED_C_FALLS_TO_LAW = false;
  if (!(COMBINED[i].fittedConstant_C > RESIDUAL_LAW_CONSTANT)) FITTED_C_FALLS_TO_LAW = false;
}
const DEEPEST_ROW = DEEP_ROWS[DEEP_ROWS.length - 1]; // 1e300
const DEEPEST_C_RELERR = Math.abs(DEEPEST_ROW.ratioToLimit_C - 1);

// (Y4) the factored ratio equals a direct B3 recomputation on a shallow band (u ~ 18, M^3 finite) to
// machine precision -- confirming the factoring is algebraically faithful, not a rewritten guess.
const ALGEBRA_CROSSCHECK_EXP = 9;
const FACTORED_VS_DIRECT_RELERR = Math.abs(
  shrinkRatioFactored(ALGEBRA_CROSSCHECK_EXP) / shrinkRatioDirect(ALGEBRA_CROSSCHECK_EXP) - 1,
);
// smallest-band fitted C already within a few percent of 1000 log 10 despite u ~ 18 there.
const SMALLEST_BAND_C_RELERR = Math.abs(LADDER_ROWS[0].ratioToLimit_C - 1);

export const IMP34864_CROSSOVER_GPPP_SHRINK_RATIO_LIMIT = {
  id: 'imp-34864',
  proofSection: 'S-frontier',
  question:
    'imp-34839 derived the crossover-map SECOND-derivative envelope per-decade shrink ratio -> EXACTLY ' +
    '100 (T^2 factor) with residual 100 - r ~ (100 log 10)/u^2, and flagged an untested "1000x/decade" ' +
    'order-up prediction for the THIRD derivative (T^3 factor). What is the exact limit of the ' +
    'third-derivative per-decade shrink ratio, what is its residual constant, and how does the ladder ' +
    'approach it? Accuracy assessment; reuses the imp-34768/imp-34757 closed form verbatim; changes no bound; no QED.',
  closedFormThirdDerivative:
    'g_triple_prime(N) = 8 pi^3 K (2u^2+4u+3)/(T^3 u^5) = K (2u^2+4u+3)/(M^3 u^5),  T = T0(N), M = T/2pi, u = log M',
  shrinkRatioFactorisation:
    'r3(N) = B3(N)/B3(10N) = (M_prime/M)^3 (u_prime/u)^5 (2u^2+4u+3)/(2u_prime^2+4u_prime+3); Riemann-von ' +
    'Mangoldt N=M(u-1) gives e^s(u_prime-1)=10(u-1) with s=u_prime-u -> log 10, so M_prime/M -> 10, ' +
    '(M_prime/M)^3 -> 1000 and the u-factors + quadratic-ratio -> 1',
  perDecadeShrinkRatioLimit: SHRINK_RATIO_LIMIT, // (Y1) EXACTLY 1000x/decade
  residualLaw:
    '1000 - r3(N) ~ (1000 log 10)/u^2 as u -> infinity, u = log(T0/2pi); leading log(r3/1000) ~ -(log 10)/u^2, ' +
    'the SAME leading term as order 2 (O(1/u) coeffs -3+5-2=0 cancel; L^2/u^2 coeffs 3/2-5/2+1=0 cancel)',
  residualLawConstant_1000ln10: +RESIDUAL_LAW_CONSTANT.toFixed(6), // 2302.585093
  generalEnvelopePattern:
    'For the p-th M-power envelope the residual constant is (limit) x (log 10) with limit = 10^p: 100 log 10 ' +
    '(order 2, T^2), 1000 log 10 (order 3, T^3); log(r/10^p) ~ -(log 10)/u^2 universally.',
  ladder: LADDER_ROWS.map((r) => ({
    log10N: r.log10N,
    shrink_ratio: +r.shrinkRatio.toFixed(6),
    residual_1000_minus_r: +r.residual.toExponential(6),
    u: +r.u.toFixed(4),
    fitted_C_residual_times_u2: +r.fittedConstant_C.toFixed(4),
    ratio_to_1000ln10: +r.ratioToLimit_C.toFixed(6),
  })),
  deepProbes: DEEP_ROWS.map((r) => ({
    log10N: r.log10N,
    shrink_ratio: +r.shrinkRatio.toFixed(6),
    residual_1000_minus_r: +r.residual.toExponential(6),
    u: +r.u.toFixed(4),
    fitted_C_residual_times_u2: +r.fittedConstant_C.toFixed(4),
    ratio_to_1000ln10: +r.ratioToLimit_C.toFixed(6),
  })),
  ratiosRiseStrictlyBelowLimit: RATIOS_RISE_TO_LIMIT,
  fittedConstantFallsToLawFromAbove: FITTED_C_FALLS_TO_LAW,
  deepestFittedC_relerrVsLaw: +DEEPEST_C_RELERR.toExponential(3),
  smallestBandFittedC_relerrVsLaw: +SMALLEST_BAND_C_RELERR.toExponential(3),
  factoredVsDirectRelerr: +FACTORED_VS_DIRECT_RELERR.toExponential(3),
  finding: {
    Y1_limit_is_exactly_1000:
      'The third-derivative per-decade shrink ratio converges to EXACTLY 1000x/decade: ' +
      'r3 = (M_prime/M)^3 (u_prime/u)^5 P(u)/P(u_prime), and s = u_prime - u -> log 10 forces ' +
      'M_prime/M -> 10 so (M_prime/M)^3 -> 1000 while the u-factors and the quadratic-ratio -> 1. ' +
      'One order up from the imp-34839 100x/decade (T^2 -> T^3).',
    Y2_residual_law:
      'The same second-order expansion cancels BOTH the O(1/u) terms (-3+5-2=0, WHY r3 -> 1000) and the ' +
      'L^2/u^2 terms (3/2-5/2+1=0), leaving log(r3/1000) ~ -(log 10)/u^2 -- identical leading form to ' +
      'order 2. Hence 1000 - r3 ~ (1000 log 10)/u^2 with C3 = 1000 log 10 = ' +
      (+RESIDUAL_LAW_CONSTANT.toFixed(6)).toString() + '. General: residual constant = limit x log 10.',
    Y3_approach_measured:
      'The fitted constant C3_k = (1000 - r3_k) u_k^2 converges to 1000 log 10 from ABOVE: ' +
      (+LADDER_ROWS[0].ratioToLimit_C.toFixed(4)).toString() + ' of the limit at 1e9, ' +
      (+DEEPEST_ROW.ratioToLimit_C.toFixed(4)).toString() + ' at 1e300 (relerr ' +
      (+DEEPEST_C_RELERR.toExponential(2)).toString() + '). It DECREASES monotonically -- the ' +
      'sign-flipped mirror of the imp-34839 order-2 ladder which rose from below (the O(1/u^3) ' +
      'correction changes sign between orders); both confirm the SAME leading constant limit x log 10.',
    Y4_cross_check:
      'The factored ratio equals a direct g_triple_prime recomputation to relerr ' +
      (+FACTORED_VS_DIRECT_RELERR.toExponential(2)).toString() + ' on the shallow band (confirming the ' +
      'factoring is faithful), and the exact ratios rise strictly below 1000; even the smallest band ' +
      '(u ~ 18) has fitted C3 within ' + (+SMALLEST_BAND_C_RELERR.toExponential(2)).toString() +
      ' of 1000 log 10.',
  },
  isRigorous: false,
  verdict:
    'ACCURACY ASSESSMENT (frontier-direction). imp-34839 derived the crossover-map SECOND-derivative ' +
    'envelope per-decade shrink ratio -> EXACTLY 100 (T^2 factor) with residual (100 log 10)/u^2, and ' +
    'flagged an untested 1000x/decade order-up prediction for the THIRD derivative. Reusing the ' +
    'imp-34768 closed form g_triple_prime = 8 pi^3 K (2u^2+4u+3)/(T^3 u^5) = K P(u)/(M^3 u^5) VERBATIM, ' +
    'this factors the per-decade ratio as r3 = (M_prime/M)^3 (u_prime/u)^5 P(u)/P(u_prime) and uses the ' +
    'Riemann-von Mangoldt leading law N = M(u-1) to prove s = u_prime - u -> log 10, hence M_prime/M -> 10 ' +
    'and (M_prime/M)^3 -> 1000: the limit is EXACTLY 1000x/decade, one order up from imp-34839. The SAME ' +
    'second-order expansion cancels both the O(1/u) terms (-3+5-2=0) and the L^2/u^2 terms (3/2-5/2+1=0), ' +
    'leaving log(r3/1000) ~ -(log 10)/u^2 -- so the residual constant is C3 = 1000 log 10 = 2302.5851, ' +
    'giving the general envelope pattern residual constant = limit x log 10 (100 log 10 order 2, 1000 log 10 ' +
    'order 3). On [1e9..1e30] + deep probes {1e40,1e80,1e150,1e300} (factored ratio, no M^3 overflow) the ' +
    'fitted constant C3_k = (1000-r3_k) u_k^2 converges to 1000 log 10 from ABOVE (1.0284 at 1e9, 1.0010 at ' +
    '1e300), the sign-flipped mirror of the imp-34839 order-2 ladder which rose from below -- the O(1/u^3) ' +
    'correction changes sign between orders while both confirm the same leading constant. The factored ratio ' +
    'matches a direct third-derivative recomputation to machine precision. Accuracy assessment only on the ' +
    'INHERITED imp-3220/imp-3406 surrogate map; the C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) are UNTOUCHED; changes no bound; establishes no operator positivity; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-34839 (SECOND-derivative 100x/decade + (100 log 10)/u^2 residual, order-up prediction flagged); ' +
    'imp-34768 (g_triple_prime = 8 pi^3 K (2u^2+4u+3)/(T^3 u^5) closed form); imp-34757 (per-band envelope; ' +
    'monotone within each band); imp-34731 (g_double_prime closed form); lambda-rh-height-mapping ' +
    '(effectiveHeightForN, Riemann-von Mangoldt inverse); imp-2631 (E_trunc fixed-strip route); ' +
    'imp-2642/imp-2643 (C_C 1/8 ansatz).',
};

export const IMP34864_CROSSOVER_GPPP_SHRINK_RATIO_LIMIT_ASSERTIONS = [
  {
    // (Y1): the exact per-decade ratios rise strictly toward, and stay strictly below, the limit 1000.
    id: 'imp34864-ratios-rise-strictly-below-1000',
    description:
      'the exact per-decade third-derivative shrink ratios rise monotonically and stay strictly below the derived limit 1000 across [1e9..1e30]',
    holds: () => RATIOS_RISE_TO_LIMIT,
  },
  {
    // (Y2)/(Y3): the fitted constant C3_k = (1000-r3_k) u_k^2 converges to 1000 log 10 from ABOVE.
    id: 'imp34864-fitted-C-falls-to-1000ln10-from-above',
    description:
      'the fitted residual constant C3_k = (1000 - r3_k) u_k^2 decreases monotonically toward 1000 log 10 = 2302.5851 and stays above it (sign-flipped mirror of order 2)',
    holds: () => FITTED_C_FALLS_TO_LAW,
  },
  {
    // (Y3): the deepest probe (1e300) confirms the residual-law constant to within 0.2%.
    id: 'imp34864-deepest-probe-confirms-law-constant',
    description:
      'the deepest probe (1e300) has (1000 - r3) u^2 within 0.2% of the derived 1000 log 10 -- the order-up residual law limit is confirmed',
    holds: () => DEEPEST_C_RELERR < 2e-3,
  },
  {
    // (Y4): the factored ratio equals a direct g_triple_prime recomputation to machine precision.
    id: 'imp34864-factored-matches-direct',
    description:
      'the factored per-decade ratio equals a direct B3(N)/B3(10N) recomputation to < 1e-10 relative on the shallow band -- the factoring is algebraically faithful',
    holds: () => FACTORED_VS_DIRECT_RELERR < 1e-10,
  },
  {
    // Honesty gate: accuracy assessment only, no QED, no refereed bound is changed.
    id: 'imp34864-honesty-gate-no-qed',
    description: 'Accuracy assessment only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34864_CROSSOVER_GPPP_SHRINK_RATIO_LIMIT.isRigorous === false &&
      /NO QED/.test(IMP34864_CROSSOVER_GPPP_SHRINK_RATIO_LIMIT.verdict) &&
      /refereed bound is changed/i.test(IMP34864_CROSSOVER_GPPP_SHRINK_RATIO_LIMIT.verdict),
  },
];

for (const a of IMP34864_CROSSOVER_GPPP_SHRINK_RATIO_LIMIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34864-crossover-gppp-shrink-ratio-limit assertion failed: ${a.id}`);
  }
}
