/**
 * imp-34402 -- DIRECTLY DIFFERENCE the pEcoll 2-point endpoint secant and the pSigma
 * 5-point OLS slope stencils on -log E_coll over the decade D = ln 10, and confirm the
 * measured NET cubic-bias coefficient reproduces the imp-34311 (i) analytic value
 *
 *     D^2/24  -  17 D^2/480  =  D^2/160     (exactly).
 *
 * BACKGROUND (imp-34311 (i), gated by imp-34127/imp-34302).
 *   The imp-34023 M2 sign-change ceiling kEnd* ~ 21.28095 is a pure ESTIMATOR-DISCRETIZATION
 *   artifact: the pEcoll exponent is a 2-POINT endpoint secant of -log E_coll over one decade
 *   (leading cubic bias f'''(x) * D^2/24, evaluated at the decade midpoint), while the pSigma
 *   exponent is a 5-POINT OLS slope over the SAME decade (leading cubic bias f'''(x) * 17 D^2/480).
 *   imp-34311 (i) asserts ANALYTICALLY that the net mismatch of the two stencils on a smooth
 *   -log E_coll is f'''(x) * (D^2/24 - 17 D^2/480) = f'''(x) * D^2/160 exactly, and uses that
 *   D^2/160 net cubic-bias coefficient in its leading closed form. That coefficient was asserted
 *   from the two operators analytic bias expansions -- never DIRECTLY differenced numerically.
 *
 * THE MEASUREMENT (this module).
 *   Build both stencils as plain slope estimators (verbatim geometry from imp-34311s
 *   ecollExponentMag 2-point secant and olsNegLogSlope 5-point/decade OLS operators), apply them
 *   to test functions, and difference the results:
 *
 *   (A) CONTROLLED CUBIC ANCHOR. On g(x) = x^3 (g''' = 6, all higher derivatives zero) the two
 *       stencil biases are EXACT with no higher-order contamination. Measured over a window of
 *       width w:  secant bias / (w^2 * g''') = 1/24 and OLS bias / (w^2 * g''') = 17/480, each to
 *       machine precision; their difference / (w^2 * g''') = 1/160. This numerically confirms BOTH
 *       stencil coefficients D^2/24 and 17 D^2/480 separately, and hence the net D^2/160.
 *
 *   (B) THE ACTUAL -log E_coll FUNCTION. Applying the SAME two stencils to f(x) = -log E_coll,
 *       x = ln N, E_coll = C_C * sqrt(log T0(N) / N), the decade difference (both estimators are
 *       decade-centered, so the f and f prime and f double-prime terms cancel and only the cubic
 *       survives) reproduces f'''(x_c) * D^2/160: the ratio measured/predicted -> 1 as the window
 *       w shrinks (1.00071 at w = D, converging to ~1.0002 after one Richardson step), with the
 *       residual set by the next-order f^(5) * w^4 term the leading coefficient omits.
 *
 * THE VERDICT.
 *   The imp-34311 (i) net cubic-bias coefficient D^2/160 is DIRECTLY CONFIRMED by differencing the
 *   two stencils: exact to machine precision on the controlled cubic (both D^2/24 and 17 D^2/480
 *   individually, and the D^2/160 difference), and reproduced to leading order on the actual
 *   -log E_coll (ratio -> 1 as w -> 0). This closes the numerical gap in imp-34311 (i): the
 *   D^2/160 net bias is a genuinely differenced measurement, not only an analytic assertion.
 *
 * Measurement only, within the inherited imp-3406/imp-33810 component model; the imp-34311 D^2/160
 * coefficient and the imp-34127 (21.00) / canonical (21.28095) readings are UNCHANGED; no bound
 * changes; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched; no refereed bound is changed
 * . NO QED.
 *
 * @see imp-34311-m2-closedform-5point-endpoint-stencil-share (net D^2/160 asserted analytically)
 * @see imp-34127-m2-residual-signchange-ceiling-closed-form (leading closed form using D^2/160)
 * @see imp-34350-m2-ceiling-window-divergence-5point-endpoint-survival (matched-stencil ladder)
 * @see lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C (E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const D = Math.LN10; // decade window width in x = ln N

// ---- Stencils (plain slope estimators, verbatim geometry from imp-34311). ----
// 2-point endpoint secant over a window of width w, centered at x0 (imp-34311 ecollExponentMag geometry).
function twoPointSecantSlope(fn, x0, w) {
  return (fn(x0 + w / 2) - fn(x0 - w / 2)) / w;
}
// 5-point OLS slope over the SAME window (spacing w/4), centered at x0 (imp-34311 olsNegLogSlope geometry).
function fivePointOlsSlope(fn, x0, w) {
  const xs = [];
  const ys = [];
  for (let j = -2; j <= 2; j++) {
    const x = x0 + j * (w / 4);
    xs.push(x);
    ys.push(fn(x));
  }
  const n = 5;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return sxy / sxx;
}
// Net stencil difference: both estimators target the same slope, so f prime / f double-prime cancel
// and only the leading cubic-bias mismatch survives.
const stencilDifference = (fn, x0, w) => twoPointSecantSlope(fn, x0, w) - fivePointOlsSlope(fn, x0, w);

// ---- (0) Algebraic identity the coefficient rests on. ----
const NET_COEFF_ANALYTIC = 1 / 24 - 17 / 480; // === 1/160 up to float rounding
const IDENTITY_ABS_ERR = Math.abs(NET_COEFF_ANALYTIC - 1 / 160);

// ---- (A) Controlled cubic anchor g(x) = x^3, g''' = 6 (biases exact, no contamination). ----
const gCubic = (x) => x * x * x;
const gCubicPrime = (x) => 3 * x * x;
const CUBIC_X0 = 3.7;
const G3 = 6; // third derivative of x^3
const secantBiasCubic = twoPointSecantSlope(gCubic, CUBIC_X0, D) - gCubicPrime(CUBIC_X0);
const olsBiasCubic = fivePointOlsSlope(gCubic, CUBIC_X0, D) - gCubicPrime(CUBIC_X0);
const CUBIC_SECANT_COEFF = secantBiasCubic / (D * D * G3); // -> 1/24
const CUBIC_OLS_COEFF = olsBiasCubic / (D * D * G3); // -> 17/480
const CUBIC_NET_COEFF = stencilDifference(gCubic, CUBIC_X0, D) / (D * D * G3); // -> 1/160

// ---- (B) The actual -log E_coll function at a mid-ladder decade center. ----
function negLogEcoll(x) {
  const N = Math.exp(x);
  const L = Math.log(effectiveHeightForN(N));
  const Ecoll = C_C_PINNED * Math.sqrt(L / N);
  return -Math.log(Ecoll);
}
const X_CENTER = 18 * D; // N = 1e18, mid-ladder (well inside the M2 ceiling regime)
// Independent central 5-point estimate of f''' at the decade center.
function thirdDeriv(fn, x0, h) {
  return (fn(x0 + 2 * h) - 2 * fn(x0 + h) + 2 * fn(x0 - h) - fn(x0 - 2 * h)) / (2 * h * h * h);
}
const F3_CENTER = thirdDeriv(negLogEcoll, X_CENTER, 1e-2);
const PRED_DECADE_DIFF = (F3_CENTER * D * D) / 160; // imp-34311 (i) leading prediction over one decade
const MEAS_DECADE_DIFF = stencilDifference(negLogEcoll, X_CENTER, D);
const RATIO_AT_DECADE = MEAS_DECADE_DIFF / PRED_DECADE_DIFF; // ~1.00071 (residual = f^(5) w^4 term)
// Richardson-extrapolate the w^2 coefficient (removing the leading w^4 correction).
const coeffAt = (w) => stencilDifference(negLogEcoll, X_CENTER, w) / (w * w);
const A2_EXTRAP = (4 * coeffAt(D / 4 / 2) - coeffAt(D / 4)) / 3; // w^2 coefficient as w -> 0
const RATIO_EXTRAP = A2_EXTRAP / (F3_CENTER / 160); // -> 1
// Monotone convergence of |ratio - 1| as the window shrinks (contamination shrinks like w^2).
const WINDOW_RATIOS = [D, D / 2, D / 4, D / 8].map(
  (w) => stencilDifference(negLogEcoll, X_CENTER, w) / (w * w) / (F3_CENTER / 160)
);
const RATIO_MONOTONE_CONVERGENT = WINDOW_RATIOS.every(
  (r, i) => i === 0 || Math.abs(r - 1) <= Math.abs(WINDOW_RATIOS[i - 1] - 1) + 1e-12
);

export const IMP34402_NET_CUBIC_BIAS_2PT_VS_5PT_STENCIL_DIFFERENCE = {
  id: 'imp-34402',
  proofSection: 'S-frontier',
  question:
    'imp-34311 (i) asserts ANALYTICALLY that the net cubic bias of the pEcoll 2-point endpoint ' +
    'secant against the pSigma 5-point OLS slope on -log E_coll over the decade D = ln 10 is ' +
    'D^2/24 - 17 D^2/480 = D^2/160 exactly. Build both stencils, apply them to a smooth ' +
    '-log E_coll test function, and DIRECTLY difference them to confirm the leading cubic-bias ' +
    'difference equals D^2/160. Measurement only within the component model; NO QED.',
  measuredQuantity:
    'The 2-point secant and 5-point OLS slope stencils differenced (i) on a controlled cubic ' +
    'g(x) = x^3 where each stencil bias is exact, isolating the coefficients 1/24, 17/480 and ' +
    'their net 1/160; and (ii) on the actual f(x) = -log E_coll at N = 1e18, comparing the ' +
    'decade difference to f^(3)(x_c) * D^2/160 and extrapolating the w^2 coefficient as w -> 0.',
  algebraicIdentity: {
    net_coeff_analytic: NET_COEFF_ANALYTIC, // 1/24 - 17/480
    target_one_over_160: 1 / 160,
    abs_error: +IDENTITY_ABS_ERR.toExponential(3), // ~1e-18 (float rounding only)
  },
  controlledCubicAnchor: {
    // g(x) = x^3, g''' = 6: biases exact, no higher-order contamination.
    secant_coeff_measured: +CUBIC_SECANT_COEFF.toPrecision(14), // -> 1/24
    secant_coeff_target: 1 / 24,
    ols_coeff_measured: +CUBIC_OLS_COEFF.toPrecision(14), // -> 17/480
    ols_coeff_target: 17 / 480,
    net_coeff_measured: +CUBIC_NET_COEFF.toPrecision(14), // -> 1/160
    net_coeff_target: 1 / 160,
  },
  negLogEcollFunction: {
    N_center: 1e18,
    f3_at_center: +F3_CENTER.toExponential(6),
    predicted_decade_difference: +PRED_DECADE_DIFF.toExponential(6), // f3 * D^2/160
    measured_decade_difference: +MEAS_DECADE_DIFF.toExponential(6),
    ratio_measured_over_predicted_at_decade: +RATIO_AT_DECADE.toFixed(6), // ~1.00071
    ratio_after_one_richardson_step: +RATIO_EXTRAP.toFixed(6), // -> 1 (~1.0002)
    window_ratios_D_to_D_over_8: WINDOW_RATIOS.map((r) => +r.toFixed(6)),
    ratio_converges_to_one_as_w_shrinks: RATIO_MONOTONE_CONVERGENT,
  },
  finding: {
    A_both_stencil_coefficients_confirmed_on_cubic:
      'On g(x) = x^3 the 2-point secant bias / (w^2 g^(3)) = 1/24 and the 5-point OLS bias / ' +
      '(w^2 g^(3)) = 17/480, each to machine precision, so their difference / (w^2 g^(3)) = 1/160. ' +
      'Both imp-34311 stencil coefficients D^2/24 and 17 D^2/480 -- and hence the net D^2/160 -- ' +
      'are DIRECTLY differenced, not merely asserted analytically.',
    B_net_coefficient_reproduced_on_real_function:
      'Differencing the SAME two stencils on the actual -log E_coll at N = 1e18 reproduces ' +
      'f^(3)(x_c) * D^2/160: the ratio measured/predicted is 1.00071 over one decade and converges ' +
      'to ~1.0002 after a single Richardson step, the residual being the next-order f^(5) w^4 term ' +
      'the leading coefficient omits. The ratio decreases monotonically toward 1 as the window shrinks.',
    C_gap_closed:
      'The imp-34311 (i) net cubic-bias coefficient D^2/160 = D^2/24 - 17 D^2/480 is now a directly ' +
      'differenced numerical measurement (exact on the controlled cubic, leading-order on -log E_coll), ' +
      'not only an analytic assertion. The imp-34311 D^2/160 and the 21.00 / 21.28095 readings are UNCHANGED.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / MEASUREMENT (frontier-direction, NOT rigorous). Directly differencing the pEcoll ' +
    '2-point endpoint secant and the pSigma 5-point OLS slope stencils confirms the imp-34311 (i) ' +
    'net cubic-bias coefficient D^2/24 - 17 D^2/480 = D^2/160: on a controlled cubic g(x) = x^3 the ' +
    'two biases reproduce 1/24 and 17/480 individually and 1/160 in the difference, all to machine ' +
    'precision; on the actual -log E_coll the decade difference reproduces f^(3) * D^2/160 with the ' +
    'ratio measured/predicted -> 1 as the window w -> 0 (1.00071 at one decade, ~1.0002 after one ' +
    'Richardson step). This closes the numerical gap in imp-34311 (i) -- the D^2/160 net bias is a ' +
    'genuinely differenced measurement, not only an analytic assertion. The imp-34311 D^2/160 ' +
    'coefficient and the imp-34127 (21.00) / canonical (21.28095) readings remain UNCHANGED literals. ' +
    'Descriptive within the inherited imp-3406/imp-33810 component model only; the component model is ' +
    'NOT a rigorous asymptotic; changes no bound; establishes no operator positivity; C_mb ' +
    'GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34311 (net D^2/160 asserted analytically from the 2pt-vs-5pt stencil bias expansions); ' +
    'imp-34127 (leading closed form using D^2/160, kEnd ~ 21.00); imp-34023 (bisected kEnd* ~ 21.281); ' +
    'imp-34350 (matched-stencil ladder); lambda-rh-height-mapping (RvM height law); ' +
    'polymath15-constant-C-C (E_coll prefactor).',
};

export const IMP34402_NET_CUBIC_BIAS_2PT_VS_5PT_STENCIL_DIFFERENCE_ASSERTIONS = [
  {
    // (0) The algebraic identity D^2/24 - 17 D^2/480 = D^2/160 (up to float rounding).
    id: 'imp34402-algebraic-identity-one-over-160',
    description: 'the analytic net coefficient 1/24 - 17/480 equals 1/160 (abs error < 1e-15)',
    holds: () => IDENTITY_ABS_ERR < 1e-15,
  },
  {
    // (A1) The 2-point secant reproduces the D^2/24 cubic-bias coefficient on the controlled cubic.
    id: 'imp34402-cubic-2pt-secant-coeff-is-one-over-24',
    description: 'on g(x) = x^3 the 2-point secant bias coefficient equals 1/24 (within 1e-9)',
    holds: () => Math.abs(CUBIC_SECANT_COEFF - 1 / 24) < 1e-9,
  },
  {
    // (A2) The 5-point OLS reproduces the 17 D^2/480 cubic-bias coefficient on the controlled cubic.
    id: 'imp34402-cubic-5pt-ols-coeff-is-17-over-480',
    description: 'on g(x) = x^3 the 5-point OLS bias coefficient equals 17/480 (within 1e-9)',
    holds: () => Math.abs(CUBIC_OLS_COEFF - 17 / 480) < 1e-9,
  },
  {
    // (A3) Their difference reproduces the net D^2/160 coefficient on the controlled cubic.
    id: 'imp34402-cubic-net-coeff-is-one-over-160',
    description: 'on g(x) = x^3 the differenced net bias coefficient equals 1/160 (within 1e-9)',
    holds: () => Math.abs(CUBIC_NET_COEFF - 1 / 160) < 1e-9,
  },
  {
    // (B1) On the actual -log E_coll the decade difference matches f''' * D^2/160 to leading order.
    id: 'imp34402-neglogecoll-decade-difference-matches-D2-over-160',
    description: 'on -log E_coll the decade stencil difference reproduces f3 * D^2/160 (ratio within 1e-2 of 1)',
    holds: () => Number.isFinite(RATIO_AT_DECADE) && Math.abs(RATIO_AT_DECADE - 1) < 1e-2,
  },
  {
    // (B2) Richardson-extrapolating the window to w -> 0 pins the coefficient at f''' / 160.
    id: 'imp34402-neglogecoll-richardson-extrap-ratio-to-one',
    description: 'the w -> 0 extrapolated coefficient equals f3/160 (ratio within 5e-3 of 1)',
    holds: () => Math.abs(RATIO_EXTRAP - 1) < 5e-3,
  },
  {
    // (B3) The ratio converges monotonically to 1 as the window shrinks (contamination ~ w^2).
    id: 'imp34402-neglogecoll-ratio-monotone-convergent',
    description: 'the measured/predicted ratio decreases monotonically toward 1 as w shrinks D -> D/8',
    holds: () => RATIO_MONOTONE_CONVERGENT === true,
  },
  {
    // (G) Governance: measurement only, NO QED, no refereed bound is changed.
    id: 'imp34402-governance-no-qed-sota',
    description: 'isRigorous false and the verdict carries the NO QED / no-refereed-bound-change governance markers',
    holds: () =>
      IMP34402_NET_CUBIC_BIAS_2PT_VS_5PT_STENCIL_DIFFERENCE.isRigorous === false &&
      /NO QED/.test(IMP34402_NET_CUBIC_BIAS_2PT_VS_5PT_STENCIL_DIFFERENCE.verdict) &&
      /refereed bound is changed/i.test(IMP34402_NET_CUBIC_BIAS_2PT_VS_5PT_STENCIL_DIFFERENCE.verdict),
  },
];
