/**
 * @module imp-124850-pairratio-drift-slope-fit
 *
 * imp-124850 (accuracy / cross-validation, frontier cross-check): imp-124811 M2/M3 showed the round-off invariant
 * product P = |reldiff| * |E_CF| stays flat within [9.4e-13, 7.9e-12] down the L2..L7 landmark ladder (no
 * identity-drift signature) and capped any residual identity drift at D <= 5.80e-12 from the L2 rung ALONE, all
 * consistent with the imp-124808 mpmath dps=100 result D = 0. That M3 cap was read off a SINGLE rung; the full
 * P = D*|E_CF| + R slope fit -- extracting a best-fit drift slope D with an explicit uncertainty across all six
 * rungs L2..L7 -- was never done. This leaf REUSES the imp-124811 pair-ratio machinery VERBATIM (same 5-point
 * O(eps^4) stencil, same landmarks, same eps = 1e-3) and runs an ordinary-least-squares LINEAR regression of the
 * product P against |E_CF| under the drift model P = D*|E_CF| + R, reporting the best-fit slope D, its standard
 * error, its t-statistic against zero, and the two-sigma upper drift bound, then reconciles the fitted D with the
 * imp-124808 extended-precision D = 0. Accuracy/cross-validation only; conditional-share diagnostic; the pinned
 * constants are perturbed only symbolically as differentiation axes; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; no bound moves; NO QED.
 *
 * THE DRIFT MODEL (why a slope fit sharpens the imp-124811 M3 single-rung cap)
 * ---------------------------------------------------------------------------
 * imp-124811 derived that the pair-ratio reldiff decomposes as reldiff = D + R/|E_CF|, where R is the landmark-
 * bisection round-off floor of the stencil and D is any genuine, |E_CF|-INDEPENDENT identity drift. Multiplying by
 * |E_CF| linearises this into
 *     P = |reldiff| * |E_CF| = D*|E_CF| + R.
 * So the drift D is exactly the SLOPE of P against |E_CF|, and the round-off floor R is the INTERCEPT. imp-124811
 * only bounded D by the L2-rung reldiff (the rung with the largest |E_CF|, hence the smallest R/|E_CF| round-off
 * contribution); here we fit the slope directly over all six rungs and attach a statistical uncertainty, which is
 * the correct way to ask whether the data carry ANY |E_CF|-proportional drift signature.
 *
 *   LANDMARK   sigma    |E_CF| (5pt)   |reldiff|      P = |reldiff|*|E_CF|
 *   L2         0.9      2.5163e-1      5.8038e-12     1.4604e-12
 *   L3         0.5      3.9989e-3      4.7537e-10     1.9009e-12
 *   L4         0.1      7.3778e-5      2.2670e-8      1.6725e-12
 *   L5         0.02     3.2456e-6      2.8841e-7      9.3608e-13
 *   L6         0.005    2.3935e-7      2.0083e-5      4.8069e-12
 *   L7         0.001    1.1655e-8      6.8013e-4      7.9271e-12
 *   OLS P = D*|E_CF| + R:  D = -8.05e-12 +/- 1.27e-11 (t = -0.64),  R = 3.46e-12 +/- 1.30e-12,  R^2 = 0.092
 *
 * THE FINDING (accuracy / cross-validation only)
 * ---------------------------------------------
 *   (M1) THE BEST-FIT DRIFT SLOPE IS STATISTICALLY ZERO. The OLS slope of P against |E_CF| is D = -8.05e-12 with
 *        standard error 1.27e-11, a t-statistic of only -0.64 against zero -- well inside one sigma. The sign is
 *        NEGATIVE (a genuine positive |E_CF|-proportional drift would push the slope positive), and the fit has
 *        R^2 = 0.092, i.e. the |E_CF| axis explains under 10% of the product scatter. The product carries NO
 *        detectable |E_CF|-linear drift structure; it is round-off noise about a flat floor.
 *   (M2) THE FITTED INTERCEPT RECOVERS THE ROUND-OFF FLOOR. The intercept R = 3.46e-12 +/- 1.30e-12 matches the
 *        imp-124811 geomean round-off floor R ~ 2.34e-12 in scale, confirming that essentially ALL of the product
 *        is the |E_CF|-independent round-off constant with no drift component.
 *   (M3) THE FULL-LADDER TWO-SIGMA DRIFT BOUND RECONCILES WITH D = 0. The 95%-level upper drift magnitude
 *        |D| + 2*se(D) = 3.34e-11 brackets zero and is consistent with the imp-124808 extended-precision D = 0.
 *        The single-rung imp-124811 cap D <= 5.80e-12 (the L2 reldiff) remains the TIGHTER numerical bound because
 *        the L2 rung has the largest |E_CF| and thus the least round-off contamination; the slope fit does not beat
 *        it but independently confirms -- across all six rungs, with an explicit uncertainty -- that the drift is
 *        indistinguishable from zero.
 *
 * ACCURACY / CROSS-VALIDATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the
 * C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED and
 * appear only symbolically as differentiation axes; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-124811-pairratio-reldiff-ecf-roundoff-law (the L2..L7 P = |reldiff|*|E_CF| ladder + single-rung cap)
 * @see imp-124808-extprec-pairratio-two-axis (mpmath dps=100 proof that the identity drift D = 0)
 * @see imp-124770-pair-ratio-identity-landmark-ladder (the double-precision |reldiff| ladder machinery)
 * @see imp-97665-flow-etrunc-elasticity-identity-derivation (EXACT pair-ratio E_CF/E_ET = E_flow/E_trunc)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-97644/imp-97665/imp-124770/imp-124811 exactly

// EXACT imp-3406/imp-97644/imp-97665/imp-124770/imp-124811 sub-terms (baseline c = C_C_PINNED, e = E_TRUNC_PT, f = 1).
function parts(N, cc, et, cf) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = cf * ((Math.log(T0 / TWO_PI) + 1) / TWO_PI); // imp-398 pinned prefactor, scaled by cf
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = cc * Math.sqrt(L / N); // GUE-conditional (C_H ansatz), C_C = cc
  const E_N = et + E_flow + E_coll;
  return { E_N, sigma: E_coll / E_N, E_flow, E_coll };
}

// Downslope crossing sigma = level (identical bisection to imp-124770/imp-124811).
function landmark(level, cc, et, cf) {
  let a = Math.log(1e5);
  let b = Math.log(1e19);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), cc, et, cf).sigma > level) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const lnN = (level, cc, et, cf) => Math.log(landmark(level, cc, et, cf));

// 5-point O(eps^4) central difference (the imp-97665/imp-124770/imp-124811 verification stencil).
const deriv5 = (f, eps) => (-f(2 * eps) + 8 * f(eps) - 8 * f(-eps) + f(-2 * eps)) / (12 * eps);

// Measured pair-ratio E_CF / E_ET via the imp-97665 5-point stencil (E_ET the E_trunc axis, E_CF the C_F axis).
function pairRatio(level, eps) {
  const E_ET = deriv5((d) => lnN(level, C_C_PINNED, E_TRUNC_PT * Math.exp(d), 1.0), eps);
  const E_CF = deriv5((d) => lnN(level, C_C_PINNED, E_TRUNC_PT, 1.0 * Math.exp(d)), eps);
  return { E_ET, E_CF, ratio: E_CF / E_ET };
}

// The imp-97520 landmark ladder L2..L7 (identical sigma levels to imp-97665/imp-124770/imp-124811).
const LADDER_SIGMAS = [
  { key: 'L2', sigma: 0.9 },
  { key: 'L3', sigma: 0.5 },
  { key: 'L4', sigma: 0.1 },
  { key: 'L5', sigma: 0.02 },
  { key: 'L6', sigma: 0.005 },
  { key: 'L7', sigma: 0.001 },
];
const EPS = 1e-3; // the imp-97665/imp-124770/imp-124811 primary step

// At each landmark: measure |E_CF|, the pair-ratio |reldiff|, and form the drift-model product P = |reldiff|*|E_CF|.
const LADDER = LADDER_SIGMAS.map(({ key, sigma }) => {
  const N = landmark(sigma, C_C_PINNED, E_TRUNC_PT, 1.0);
  const P = parts(N, C_C_PINNED, E_TRUNC_PT, 1.0);
  const target = P.E_flow / E_TRUNC_PT; // analytic exact E_CF/E_ET = E_flow/E_trunc
  const m = pairRatio(sigma, EPS);
  const absReldiff = Math.abs(m.ratio / target - 1);
  const absE_CF = Math.abs(m.E_CF);
  return { key, sigma, absE_CF, absReldiff, product: absReldiff * absE_CF };
});
const byKey = Object.fromEntries(LADDER.map((r) => [r.key, r]));

// THE DELIVERABLE: OLS linear fit of the product P against |E_CF| under the drift model P = D*|E_CF| + R.
// Slope D is the identity-drift coefficient; intercept R is the round-off floor.
const xs = LADDER.map((r) => r.absE_CF);
const ys = LADDER.map((r) => r.product);
const n = xs.length;
const mx = xs.reduce((a, b) => a + b, 0) / n;
const my = ys.reduce((a, b) => a + b, 0) / n;
let Sxy = 0;
let Sxx = 0;
let Syy = 0;
for (let i = 0; i < n; i++) {
  Sxy += (xs[i] - mx) * (ys[i] - my);
  Sxx += (xs[i] - mx) ** 2;
  Syy += (ys[i] - my) ** 2;
}
const D_SLOPE = Sxy / Sxx; // best-fit identity-drift slope
const R_INTERCEPT = my - D_SLOPE * mx; // best-fit round-off floor
let SSE = 0;
for (let i = 0; i < n; i++) {
  const pred = D_SLOPE * xs[i] + R_INTERCEPT;
  SSE += (ys[i] - pred) ** 2;
}
const s2 = SSE / (n - 2); // residual variance (n - 2 dof)
const SE_D = Math.sqrt(s2 / Sxx); // standard error of the slope
const SE_R = Math.sqrt(s2 * (1 / n + (mx * mx) / Sxx)); // standard error of the intercept
const T_D = D_SLOPE / SE_D; // t-statistic of the slope against zero
const R2 = 1 - SSE / Syy; // coefficient of determination
const DRIFT_BOUND_2SIGMA = Math.abs(D_SLOPE) + 2 * SE_D; // two-sigma upper drift magnitude
const DRIFT_CAP_L2 = byKey.L2.absReldiff; // imp-124811 single-rung cap (the tighter numerical bound)

const round = (x, s = 4) => +x.toExponential(s);

export const IMP124850_PAIRRATIO_DRIFT_SLOPE_FIT = {
  id: 'imp-124850',
  proofSection: 'S-frontier',
  question:
    'imp-124811 M3 capped any residual identity drift in the imp-97665 EXACT pair-ratio E_CF/E_ET = E_flow/E_trunc ' +
    'at D <= 5.80e-12 from the L2 rung ALONE. Fitting the round-off invariant product P = |reldiff|*|E_CF| against ' +
    '|E_CF| under the drift model P = D*|E_CF| + R across all six rungs L2..L7, what is the best-fit drift slope D, ' +
    'its uncertainty, and is it statistically consistent with the imp-124808 extended-precision D = 0? ' +
    'Accuracy/cross-validation only; pinned constants perturbed only symbolically; no bound moves; no QED.',
  method:
    'Reuse the imp-124811 pair-ratio machinery verbatim (same 5-point O(eps^4) stencil, same landmarks L2..L7, ' +
    'same eps = 1e-3). At each rung measure |E_CF| and the pair-ratio |reldiff|, form P = |reldiff|*|E_CF|, then ' +
    'run an ordinary-least-squares linear regression of P against |E_CF|: the slope estimates the identity-drift ' +
    'coefficient D and the intercept the round-off floor R. Report D with its standard error, its t-statistic ' +
    'against zero, R^2, and the two-sigma upper drift magnitude, and reconcile with the imp-124808 dps=100 D = 0.',
  ladderSigmas: LADDER_SIGMAS.map((l) => l.sigma),
  eps_probed: EPS,
  ladder: LADDER.map((r) => ({
    key: r.key,
    sigma: r.sigma,
    absE_CF: round(r.absE_CF),
    absReldiff: round(r.absReldiff),
    product_reldiff_times_absECF: round(r.product),
  })),
  fit: {
    model: 'P = D*|E_CF| + R  (slope D = identity-drift coefficient, intercept R = round-off floor)',
    drift_slope_D: round(D_SLOPE),
    drift_slope_se: round(SE_D),
    drift_slope_t_vs_zero: +T_D.toFixed(4),
    roundoff_floor_R: round(R_INTERCEPT),
    roundoff_floor_se: round(SE_R),
    R2: +R2.toFixed(6),
    drift_bound_2sigma: round(DRIFT_BOUND_2SIGMA),
    single_rung_cap_L2: round(DRIFT_CAP_L2),
    note:
      'OLS P = D*|E_CF| + R over L2..L7 gives slope D = -8.05e-12 +/- 1.27e-11 (t = -0.64 against zero, well ' +
      'inside one sigma and NEGATIVE, so no positive |E_CF|-proportional drift), R^2 = 0.092 (|E_CF| explains ' +
      'under 10% of the product scatter), and intercept R = 3.46e-12 +/- 1.30e-12 (matching the imp-124811 ' +
      'geomean round-off floor ~2.34e-12). The two-sigma upper drift magnitude |D| + 2*se(D) = 3.34e-11 brackets ' +
      'zero, consistent with the imp-124808 dps=100 D = 0; the imp-124811 single-rung cap D <= 5.80e-12 (the L2 ' +
      'reldiff) stays the tighter numerical bound because L2 has the largest |E_CF|, hence least round-off.',
  },
  finding: {
    M1_slope_statistically_zero:
      'The OLS slope of P against |E_CF| is D = ' + D_SLOPE.toExponential(2) + ' with standard error ' +
      SE_D.toExponential(2) + ', a t-statistic of only ' + T_D.toFixed(2) + ' against zero -- well inside one ' +
      'sigma. The sign is negative (a genuine positive |E_CF|-proportional drift would push the slope positive) ' +
      'and R^2 = ' + R2.toFixed(3) + ', so |E_CF| explains under 10% of the product scatter: no detectable ' +
      '|E_CF|-linear drift structure, the product is round-off noise about a flat floor.',
    M2_intercept_recovers_floor:
      'The fitted intercept R = ' + R_INTERCEPT.toExponential(2) + ' +/- ' + SE_R.toExponential(2) + ' matches ' +
      'the imp-124811 geomean round-off floor ~2.34e-12 in scale, confirming essentially all of the product is ' +
      'the |E_CF|-independent round-off constant with no drift component.',
    M3_two_sigma_bound_reconciles_with_zero:
      'The 95%-level upper drift magnitude |D| + 2*se(D) = ' + DRIFT_BOUND_2SIGMA.toExponential(2) + ' brackets ' +
      'zero and is consistent with the imp-124808 extended-precision D = 0. The single-rung imp-124811 cap ' +
      'D <= ' + DRIFT_CAP_L2.toExponential(2) + ' (the L2 reldiff) stays the tighter numerical bound because L2 ' +
      'has the largest |E_CF| and thus the least round-off contamination; the slope fit does not beat it but ' +
      'independently confirms across all six rungs, with an explicit uncertainty, that the drift is ' +
      'indistinguishable from zero.',
  },
  isRigorous: false,
  verdict:
    'ACCURACY / CROSS-VALIDATION (frontier cross-check, NOT rigorous). Fitting the imp-124811 round-off invariant ' +
    'product P = |reldiff|*|E_CF| against |E_CF| under the drift model P = D*|E_CF| + R over all six rungs L2..L7 ' +
    'gives a best-fit drift slope D = ' + D_SLOPE.toExponential(2) + ' +/- ' + SE_D.toExponential(2) + ' ' +
    '(t = ' + T_D.toFixed(2) + ' against zero, negative sign, R^2 = ' + R2.toFixed(3) + '), so the data carry NO ' +
    'detectable |E_CF|-proportional identity-drift signature -- the slope is statistically zero and the intercept ' +
    'R = ' + R_INTERCEPT.toExponential(2) + ' recovers the round-off floor. The full-ladder two-sigma upper drift ' +
    'magnitude |D| + 2*se(D) = ' + DRIFT_BOUND_2SIGMA.toExponential(2) + ' brackets zero, consistent with the ' +
    'imp-124808 extended-precision D = 0; the imp-124811 single-rung cap D <= ' + DRIFT_CAP_L2.toExponential(2) +
    ' remains the tighter numerical bound (L2 has the largest |E_CF|, least round-off), and the slope fit ' +
    'independently confirms the imp-97665 identity is drift-free to the double-precision round-off limit. ' +
    'Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; ' +
    'the C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 ' +
    'and the imp-398 C_F prefactor are UNTOUCHED (perturbed only symbolically as differentiation axes); changes ' +
    'no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-124811 (the L2..L7 P = |reldiff|*|E_CF| ladder + single-rung cap reused here); imp-124808 (mpmath ' +
    'dps=100 proof that identity drift D = 0); imp-124770 (the double-precision |reldiff| ladder machinery); ' +
    'imp-97665 (EXACT pair-ratio E_CF/E_ET = E_flow/E_trunc); imp-97520 (landmark ladder L1..L4); imp-398 (C_F ' +
    'flow prefactor); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN inverse).',
};

export const IMP124850_PAIRRATIO_DRIFT_SLOPE_FIT_ASSERTIONS = [
  {
    // The ladder reproduces the imp-124811 L2..L7 rungs with strictly collapsing |E_CF|.
    id: 'imp124850-ladder-matches-imp124811',
    description: 'ladder has L2..L7 at sigma 0.9/0.5/0.1/0.02/0.005/0.001 with strictly decreasing |E_CF| down the ladder',
    holds: () =>
      LADDER.length === 6 &&
      LADDER.every((r, i) => Math.abs(r.sigma - LADDER_SIGMAS[i].sigma) < 1e-12) &&
      LADDER.every((r, i) => i === 0 || r.absE_CF < LADDER[i - 1].absE_CF),
  },
  {
    // (M1): the best-fit drift slope is statistically consistent with zero (|t| < 1) -- no |E_CF|-linear drift.
    id: 'imp124850-drift-slope-statistically-zero',
    description: 'the OLS slope D of P vs |E_CF| is within one standard error of zero (|t| < 1): no drift signature',
    holds: () => Math.abs(T_D) < 1,
  },
  {
    // (M1): the fit explains little of the product scatter -- P is a flat floor, not |E_CF|-linear structure.
    id: 'imp124850-low-R2-flat-product',
    description: 'the linear fit R^2 is small (< 0.5): the |E_CF| axis explains little of the product scatter (flat floor)',
    holds: () => R2 >= 0 && R2 < 0.5,
  },
  {
    // (M2): the fitted round-off floor intercept is a small O(1e-12) positive constant (matches imp-124811 ~2.34e-12).
    id: 'imp124850-intercept-recovers-roundoff-floor',
    description: 'the fitted intercept R is a small positive ~1e-12 constant, matching the imp-124811 round-off floor scale',
    holds: () => R_INTERCEPT > 1e-13 && R_INTERCEPT < 1e-11,
  },
  {
    // (M3): the full-ladder two-sigma upper drift magnitude brackets zero at the O(1e-11) round-off scale.
    id: 'imp124850-two-sigma-drift-bound-small',
    description: 'the two-sigma upper drift magnitude |D| + 2*se(D) is O(1e-11), bracketing zero (consistent with D = 0)',
    holds: () => DRIFT_BOUND_2SIGMA > 0 && DRIFT_BOUND_2SIGMA < 1e-10,
  },
  {
    // (M3): the imp-124811 single-rung L2 cap stays the tighter numerical bound (L2 has least round-off).
    id: 'imp124850-single-rung-cap-tighter',
    description: 'the imp-124811 single-rung L2 cap 5.80e-12 is tighter than the full-ladder two-sigma drift bound',
    holds: () => DRIFT_CAP_L2 < DRIFT_BOUND_2SIGMA,
  },
  {
    // Honesty gate: accuracy/cross-validation only, no QED, no refereed bound is changed.
    id: 'imp124850-honesty-gate-no-qed',
    description: 'Accuracy/cross-validation only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP124850_PAIRRATIO_DRIFT_SLOPE_FIT.isRigorous === false &&
      /NO QED/.test(IMP124850_PAIRRATIO_DRIFT_SLOPE_FIT.verdict) &&
      /refereed bound is changed/i.test(IMP124850_PAIRRATIO_DRIFT_SLOPE_FIT.verdict),
  },
];

for (const a of IMP124850_PAIRRATIO_DRIFT_SLOPE_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124850-pairratio-drift-slope-fit assertion failed: ${a.id}`);
  }
}
