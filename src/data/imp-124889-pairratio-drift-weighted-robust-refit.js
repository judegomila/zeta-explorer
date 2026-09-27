/**
 * @module imp-124889-pairratio-drift-weighted-robust-refit
 *
 * imp-124889 (accuracy / cross-validation, frontier cross-check): imp-124850 M1 fit the drift model
 * P = |reldiff| * |E_CF| = D*|E_CF| + R by ORDINARY least squares over the six rungs L2..L7, finding a
 * statistically-zero slope D = -8.05e-12 +/- 1.27e-11 (t = -0.64, R^2 = 0.092). But plain OLS gives every rung
 * equal weight, and the measured products P span an order of magnitude ([9.4e-13, 7.9e-12]) while the |E_CF| axis
 * spans EIGHT decades (2.5e-1 -> 1.2e-8), so a legitimate worry is that the unweighted slope is dominated by the
 * few large-|E_CF| rungs. This leaf REFITS the SAME six-rung ladder (machinery reused verbatim from imp-124850:
 * same 5-point O(eps^4) stencil, same landmarks L2..L7, same eps = 1e-3) by (a) weighted least squares with the
 * imp-124811-propagated per-rung round-off floor as the inverse-variance weight, (b) a relative (constant-relative-
 * error) weighting w = 1/P^2 that equalizes the order-of-magnitude product span, and (c) a rank-based robust
 * Theil-Sen estimator, and ASSESSES whether the refit slope D still brackets zero or shifts materially versus the
 * OLS fit. Accuracy/cross-validation only; conditional-share diagnostic; the pinned constants are perturbed only
 * symbolically as differentiation axes; the C_mb GUE-conditional per imp-486 is UNTOUCHED; no bound moves; NO QED.
 *
 * THE WEIGHTING QUESTION (why OLS was already the inverse-variance fit)
 * -------------------------------------------------------------------
 * imp-124811 established that the pair-ratio reldiff decomposes as reldiff = D + R/|E_CF|, where R is the landmark-
 * bisection round-off floor of the stencil and D is any genuine |E_CF|-independent identity drift. So the per-rung
 * round-off floor of the RELDIFF is R/|E_CF|_i -- it varies by eight decades down the ladder. Propagating that
 * floor to the fitted quantity P = reldiff*|E_CF| gives an absolute uncertainty
 *     sigma(P_i) = |E_CF|_i * sigma(reldiff_i) = |E_CF|_i * (R / |E_CF|_i) = R   (rung-INDEPENDENT).
 * i.e. the round-off floor of the invariant PRODUCT is a rung-independent constant R (this is exactly WHY imp-124811
 * saw P flat down the ladder). The inverse-variance weight w_i = 1/sigma(P_i)^2 is therefore UNIFORM, so the WLS
 * fit the ticket asks for is provably IDENTICAL to OLS -- the "equal weight" that looked like a defect is actually
 * the correct inverse-variance weighting under the imp-124811 floor model. To stress-test BEYOND that identity we
 * also run a relative weighting w = 1/P^2 (which aggressively downweights the large-P deep rungs) and a robust
 * Theil-Sen slope (the median of all pairwise slopes, insensitive to any single rung), and check the slope against
 * zero under each.
 *
 *   LANDMARK   sigma    |E_CF| (5pt)   |reldiff|      P = |reldiff|*|E_CF|
 *   L2         0.9      2.5163e-1      5.8038e-12     1.4604e-12
 *   L3         0.5      3.9989e-3      4.7537e-10     1.9009e-12
 *   L4         0.1      7.3778e-5      2.2670e-8      1.6725e-12
 *   L5         0.02     3.2456e-6      2.8841e-7      9.3608e-13
 *   L6         0.005    2.3935e-7      2.0083e-5      4.8069e-12
 *   L7         0.001    1.1655e-8      6.8013e-4      7.9271e-12
 *
 *   OLS (uniform)                : D = -8.05e-12 +/- 1.27e-11  (t = -0.64,  R^2 = 0.092)
 *   WLS (imp-124811 floor sigma_P=R const) : D = -8.05e-12 +/- 1.27e-11  (t = -0.64,  R^2 = 0.092)  [= OLS by construction]
 *   WLS (relative w = 1/P^2)     : D = +3.57e-13 +/- 4.02e-12  (t = +0.09,  R^2 = 0.002)
 *   Theil-Sen (robust median)    : D = -2.57e-11  (15 pairwise slopes span -1.37e-5 .. +1.04e-8)
 *
 * THE FINDING (accuracy / cross-validation only)
 * ---------------------------------------------
 *   (M1) THE INVERSE-VARIANCE WLS IS PROVABLY OLS. Under the imp-124811 floor model reldiff ~ R/|E_CF|, the
 *        propagated round-off floor of the product P is the rung-INDEPENDENT constant R, so the inverse-variance
 *        weight is uniform and the WLS slope, standard error, t-statistic and R^2 all EQUAL the imp-124850 OLS
 *        values (D = -8.05e-12, t = -0.64, R^2 = 0.092) to floating-point. The imp-124850 "equal weight" was the
 *        correct inverse-variance weighting, not a defect.
 *   (M2) THE SLOPE STILL BRACKETS ZERO UNDER EVERY NON-TRIVIAL REWEIGHTING. The relative weighting w = 1/P^2 (which
 *        strips the large-|E_CF| rungs of their leverage) gives an even smaller slope D = +3.6e-13 +/- 4.0e-12
 *        (t = +0.09, |t| far below 1) -- it FLIPS SIGN to positive but is 20x smaller in magnitude and still
 *        statistically indistinguishable from zero. The robust Theil-Sen median slope D = -2.6e-11 sits at the same
 *        O(1e-11) round-off scale as the OLS standard error, with pairwise slopes scattered across five decades and
 *        no sign consensus. No weighting produces a materially non-zero, sign-consistent drift signature.
 *   (M3) THE M1 ZERO-DRIFT CONCLUSION IS WEIGHT-ROBUST. Across the inverse-variance WLS (= OLS, D = -8.05e-12),
 *        the relative WLS (D = +3.6e-13, opposite sign) and the robust Theil-Sen (D = -2.6e-11), the fitted drift
 *        stays pinned to the O(1e-11) double-precision round-off scale with no stable sign -- exactly the signature
 *        of pure round-off noise about a flat floor, and consistent with the imp-124808 extended-precision D = 0.
 *        The imp-124811 single-rung L2 cap D <= 5.80e-12 remains the tighter numerical bound.
 *
 * SUB-GAP (named, honest): the per-rung weights here are MODEL-propagated from the imp-124811 floor law
 * reldiff ~ R/|E_CF| (and the relative-error surrogate), NOT empirically estimated from replicate scatter -- no
 * per-rung variance was measured from repeated eps-jitter or dps-jitter draws. A replicate-estimated inverse-
 * variance WLS (sub-gap: eps-jitter-replicate per-rung variance refit) would remove the dependence on the floor
 * model; it is left open. This does not affect the weight-robustness conclusion, which already spans two independent
 * non-trivial weightings plus the robust estimator.
 *
 * ACCURACY / CROSS-VALIDATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the
 * C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED and
 * appear only symbolically as differentiation axes; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-124850-pairratio-drift-slope-fit (the OLS P = D*|E_CF| + R fit refined here)
 * @see imp-124811-pairratio-reldiff-ecf-roundoff-law (the L2..L7 ladder + floor law reldiff ~ R/|E_CF|)
 * @see imp-124808-extprec-pairratio-two-axis (mpmath dps=100 proof that the identity drift D = 0)
 * @see imp-97665-flow-etrunc-elasticity-identity-derivation (EXACT pair-ratio E_CF/E_ET = E_flow/E_trunc)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-97644/imp-97665/imp-124770/imp-124811/imp-124850 exactly
const R_GEO_FLOOR = 2.34e-12; // imp-124811 geomean round-off floor of P (the per-rung sigma_P constant)

// EXACT imp-3406/imp-97644/imp-97665/imp-124770/imp-124811/imp-124850 sub-terms (baseline c = C_C_PINNED, e = E_TRUNC_PT, f = 1).
function parts(N, cc, et, cf) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = cf * ((Math.log(T0 / TWO_PI) + 1) / TWO_PI); // imp-398 pinned prefactor, scaled by cf
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = cc * Math.sqrt(L / N); // GUE-conditional (C_H ansatz), C_C = cc
  const E_N = et + E_flow + E_coll;
  return { E_N, sigma: E_coll / E_N, E_flow, E_coll };
}

// Downslope crossing sigma = level (identical bisection to imp-124770/imp-124811/imp-124850).
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

// 5-point O(eps^4) central difference (the imp-97665/imp-124770/imp-124811/imp-124850 verification stencil).
const deriv5 = (f, eps) => (-f(2 * eps) + 8 * f(eps) - 8 * f(-eps) + f(-2 * eps)) / (12 * eps);

// Measured pair-ratio E_CF / E_ET via the imp-97665 5-point stencil (E_ET the E_trunc axis, E_CF the C_F axis).
function pairRatio(level, eps) {
  const E_ET = deriv5((d) => lnN(level, C_C_PINNED, E_TRUNC_PT * Math.exp(d), 1.0), eps);
  const E_CF = deriv5((d) => lnN(level, C_C_PINNED, E_TRUNC_PT, 1.0 * Math.exp(d)), eps);
  return { E_ET, E_CF, ratio: E_CF / E_ET };
}

// The imp-97520 landmark ladder L2..L7 (identical sigma levels to imp-97665/imp-124770/imp-124811/imp-124850).
const LADDER_SIGMAS = [
  { key: 'L2', sigma: 0.9 },
  { key: 'L3', sigma: 0.5 },
  { key: 'L4', sigma: 0.1 },
  { key: 'L5', sigma: 0.02 },
  { key: 'L6', sigma: 0.005 },
  { key: 'L7', sigma: 0.001 },
];
const EPS = 1e-3; // the imp-97665/imp-124770/imp-124811/imp-124850 primary step

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

const xs = LADDER.map((r) => r.absE_CF);
const ys = LADDER.map((r) => r.product);
const n = xs.length;

// Generic weighted linear fit y = D*x + R with per-point weights w (uniform w reproduces OLS exactly).
function weightedFit(x, y, w) {
  const S = w.reduce((a, b) => a + b, 0);
  const mx = x.reduce((a, xi, i) => a + w[i] * xi, 0) / S;
  const my = y.reduce((a, yi, i) => a + w[i] * yi, 0) / S;
  let Sxx = 0;
  let Sxy = 0;
  let Syy = 0;
  for (let i = 0; i < x.length; i++) {
    Sxx += w[i] * (x[i] - mx) ** 2;
    Sxy += w[i] * (x[i] - mx) * (y[i] - my);
    Syy += w[i] * (y[i] - my) ** 2;
  }
  const D = Sxy / Sxx; // best-fit identity-drift slope
  const R = my - D * mx; // best-fit round-off floor (intercept)
  let SSE = 0;
  for (let i = 0; i < x.length; i++) SSE += w[i] * (y[i] - (D * x[i] + R)) ** 2;
  const s2 = SSE / (x.length - 2); // weighted residual variance (n - 2 dof)
  const SE_D = Math.sqrt(s2 / Sxx); // standard error of the slope
  const SE_R = Math.sqrt(s2 * (1 / S + (mx * mx) / Sxx)); // standard error of the intercept
  return { D, R, SE_D, SE_R, t: D / SE_D, R2: 1 - SSE / Syy };
}

// Median helper for the robust estimator.
function median(arr) {
  const a = [...arr].sort((p, q) => p - q);
  const m = a.length >> 1;
  return a.length % 2 ? a[m] : (a[m - 1] + a[m]) / 2;
}

// (0) OLS reference: uniform weights -- must reproduce the imp-124850 fit.
const OLS = weightedFit(xs, ys, xs.map(() => 1));

// (1) WLS with the imp-124811-propagated per-rung round-off floor. reldiff floor = R_GEO/|E_CF| => sigma(P) = R_GEO
//     (rung-independent), so the inverse-variance weight is uniform and this equals OLS by construction.
const sigmaP = xs.map(() => R_GEO_FLOOR);
const WLS_FLOOR = weightedFit(xs, ys, sigmaP.map((s) => 1 / (s * s)));

// (2) WLS with relative (constant-relative-error) weighting w = 1/P^2 -- equalizes the order-of-magnitude P span,
//     stripping the deep large-P rungs of their leverage.
const WLS_REL = weightedFit(xs, ys, ys.map((p) => 1 / (p * p)));

// (3) Robust Theil-Sen: median of all pairwise slopes; intercept = median(y - D*x).
const pairSlopes = [];
for (let i = 0; i < n; i++) {
  for (let j = i + 1; j < n; j++) pairSlopes.push((ys[j] - ys[i]) / (xs[j] - xs[i]));
}
const D_TS = median(pairSlopes);
const R_TS = median(xs.map((xi, i) => ys[i] - D_TS * xi));
const sortedSlopes = [...pairSlopes].sort((a, b) => a - b);

// Weight-robustness verdict: every slope estimate sits at the O(1e-11) round-off scale, |t| < 1 for both LS fits,
// and the sign is not consistent across weightings -- pure round-off noise about a flat floor.
const ALL_BRACKET_ZERO = Math.abs(OLS.t) < 1 && Math.abs(WLS_FLOOR.t) < 1 && Math.abs(WLS_REL.t) < 1;
const SIGN_INCONSISTENT = Math.sign(OLS.D) !== Math.sign(WLS_REL.D); // OLS negative, relative positive
const DRIFT_CAP_L2 = byKey.L2.absReldiff; // imp-124811 single-rung cap (the tighter numerical bound)

const round = (x, s = 4) => +x.toExponential(s);

export const IMP124889_PAIRRATIO_DRIFT_WEIGHTED_ROBUST_REFIT = {
  id: 'imp-124889',
  proofSection: 'S-frontier',
  question:
    'imp-124850 M1 fit the drift model P = |reldiff|*|E_CF| = D*|E_CF| + R by ORDINARY least squares over L2..L7, ' +
    'finding a statistically-zero slope D = -8.05e-12 +/- 1.27e-11 (t = -0.64, R^2 = 0.092) -- but plain OLS weights ' +
    'every rung equally while P spans an order of magnitude and |E_CF| spans eight decades. Refitting the SAME six ' +
    'rungs by weighted least squares (inverse-variance from the imp-124811 round-off floor, and a relative w = 1/P^2) ' +
    'and by a robust Theil-Sen estimator, does the drift slope D still bracket zero or shift materially? ' +
    'Accuracy/cross-validation only; pinned constants perturbed only symbolically; no bound moves; no QED.',
  method:
    'Reuse the imp-124850 pair-ratio machinery verbatim (same 5-point O(eps^4) stencil, same landmarks L2..L7, ' +
    'same eps = 1e-3). Fit P = D*|E_CF| + R four ways: (0) OLS uniform weights (reproduces imp-124850); (1) WLS ' +
    'with the imp-124811-propagated round-off floor sigma(P) = R_geo/|E_CF| * |E_CF| = R_geo (rung-independent), ' +
    'whose inverse-variance weight is uniform and so equals OLS; (2) WLS with relative weighting w = 1/P^2 that ' +
    'equalizes the order-of-magnitude product span; (3) robust Theil-Sen (median of all 15 pairwise slopes). ' +
    'Report each slope with its standard error / spread and t-statistic against zero, and assess weight-robustness.',
  ladderSigmas: LADDER_SIGMAS.map((l) => l.sigma),
  eps_probed: EPS,
  ladder: LADDER.map((r) => ({
    key: r.key,
    sigma: r.sigma,
    absE_CF: round(r.absE_CF),
    absReldiff: round(r.absReldiff),
    product_reldiff_times_absECF: round(r.product),
  })),
  fits: {
    model: 'P = D*|E_CF| + R  (slope D = identity-drift coefficient, intercept R = round-off floor)',
    ols_uniform: {
      drift_slope_D: round(OLS.D),
      drift_slope_se: round(OLS.SE_D),
      drift_slope_t_vs_zero: +OLS.t.toFixed(4),
      roundoff_floor_R: round(OLS.R),
      R2: +OLS.R2.toFixed(6),
    },
    wls_imp124811_floor: {
      weight: 'w = 1/sigma(P)^2 with sigma(P) = R_geo (rung-independent, propagated from reldiff ~ R_geo/|E_CF|)',
      drift_slope_D: round(WLS_FLOOR.D),
      drift_slope_se: round(WLS_FLOOR.SE_D),
      drift_slope_t_vs_zero: +WLS_FLOOR.t.toFixed(4),
      roundoff_floor_R: round(WLS_FLOOR.R),
      R2: +WLS_FLOOR.R2.toFixed(6),
      note: 'IDENTICAL to OLS by construction: the imp-124811 floor of the product P is rung-independent, so the inverse-variance weight is uniform.',
    },
    wls_relative_invP2: {
      weight: 'w = 1/P^2 (constant-relative-error; equalizes the order-of-magnitude P span)',
      drift_slope_D: round(WLS_REL.D),
      drift_slope_se: round(WLS_REL.SE_D),
      drift_slope_t_vs_zero: +WLS_REL.t.toFixed(4),
      roundoff_floor_R: round(WLS_REL.R),
      R2: +WLS_REL.R2.toFixed(6),
    },
    theil_sen_robust: {
      drift_slope_D: round(D_TS),
      roundoff_floor_R: round(R_TS),
      n_pairwise_slopes: pairSlopes.length,
      slope_min: round(sortedSlopes[0], 3),
      slope_max: round(sortedSlopes[sortedSlopes.length - 1], 3),
    },
    single_rung_cap_L2: round(DRIFT_CAP_L2),
    all_bracket_zero: ALL_BRACKET_ZERO,
    sign_inconsistent_across_weightings: SIGN_INCONSISTENT,
  },
  finding: {
    M1_inverse_variance_wls_is_ols:
      'Under the imp-124811 floor model reldiff ~ R/|E_CF|, the propagated round-off floor of the product P is the ' +
      'rung-INDEPENDENT constant R_geo ~ 2.34e-12, so the inverse-variance weight is uniform and the WLS slope ' +
      'D = ' + WLS_FLOOR.D.toExponential(2) + ' (t = ' + WLS_FLOOR.t.toFixed(2) + ', R^2 = ' + WLS_FLOOR.R2.toFixed(3) +
      ') EQUALS the imp-124850 OLS fit to floating point. The imp-124850 equal weighting was the correct inverse-' +
      'variance weighting, not a defect.',
    M2_slope_brackets_zero_every_reweighting:
      'The relative weighting w = 1/P^2 (which strips the large-|E_CF| rungs of leverage) gives an even smaller ' +
      'slope D = ' + WLS_REL.D.toExponential(2) + ' +/- ' + WLS_REL.SE_D.toExponential(2) + ' (t = ' +
      WLS_REL.t.toFixed(2) + '): it flips sign to positive but is ~20x smaller in magnitude and far inside one ' +
      'sigma. The robust Theil-Sen median slope D = ' + D_TS.toExponential(2) + ' sits at the same O(1e-11) round-' +
      'off scale as the OLS standard error, with the ' + pairSlopes.length + ' pairwise slopes scattered across ' +
      'five decades (' + sortedSlopes[0].toExponential(2) + ' .. ' + sortedSlopes[sortedSlopes.length - 1].toExponential(2) +
      ') and no sign consensus. No weighting produces a materially non-zero, sign-consistent drift.',
    M3_zero_drift_is_weight_robust:
      'Across the inverse-variance WLS (= OLS, D = ' + OLS.D.toExponential(2) + '), the relative WLS (D = ' +
      WLS_REL.D.toExponential(2) + ', opposite sign) and the robust Theil-Sen (D = ' + D_TS.toExponential(2) + '), ' +
      'the fitted drift stays pinned to the O(1e-11) double-precision round-off scale with no stable sign -- the ' +
      'signature of pure round-off noise about a flat floor, consistent with the imp-124808 extended-precision ' +
      'D = 0. The imp-124811 single-rung L2 cap D <= ' + DRIFT_CAP_L2.toExponential(2) + ' remains the tighter bound.',
    sub_gap_replicate_variance:
      'SUB-GAP (named): the per-rung weights are MODEL-propagated from the imp-124811 floor law reldiff ~ R/|E_CF| ' +
      '(and the relative-error surrogate), NOT empirically estimated from replicate scatter. A replicate-estimated ' +
      'inverse-variance WLS (eps-jitter / dps-jitter per-rung variance refit) would remove the floor-model ' +
      'dependence; it is left open. It does not affect the weight-robustness conclusion, which already spans two ' +
      'independent non-trivial weightings plus the robust estimator.',
  },
  isRigorous: false,
  verdict:
    'ACCURACY / CROSS-VALIDATION (frontier cross-check, NOT rigorous). Refitting the imp-124850 drift model ' +
    'P = D*|E_CF| + R over the same six rungs L2..L7 by weighted and robust least squares, the drift slope D still ' +
    'brackets zero under every weighting: the imp-124811-floor inverse-variance WLS is PROVABLY OLS (D = ' +
    OLS.D.toExponential(2) + ', t = ' + OLS.t.toFixed(2) + ', because the round-off floor of the product P is rung-' +
    'independent), the relative w = 1/P^2 WLS gives D = ' + WLS_REL.D.toExponential(2) + ' (t = ' + WLS_REL.t.toFixed(2) +
    ', ~20x smaller, opposite sign), and the robust Theil-Sen median is D = ' + D_TS.toExponential(2) + ' at the same ' +
    'O(1e-11) round-off scale with no sign consensus across the ' + pairSlopes.length + ' pairwise slopes. The ' +
    'imp-124850 M1 zero-drift conclusion is WEIGHT-ROBUST -- pure round-off noise about a flat floor, consistent ' +
    'with the imp-124808 extended-precision D = 0; the imp-124811 single-rung cap D <= ' + DRIFT_CAP_L2.toExponential(2) +
    ' stays the tighter numerical bound. SUB-GAP: the weights are model-propagated, not replicate-estimated (an ' +
    'eps-jitter-replicate per-rung variance refit is left open). Conditional-share diagnostic on the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the C_C 1/8 ' +
    'ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED (perturbed ' +
    'only symbolically as differentiation axes); changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-124850 (the OLS P = D*|E_CF| + R fit refined here); imp-124811 (the L2..L7 ladder + floor law ' +
    'reldiff ~ R/|E_CF| and single-rung cap); imp-124808 (mpmath dps=100 proof that identity drift D = 0); ' +
    'imp-124770 (the double-precision |reldiff| ladder machinery); imp-97665 (EXACT pair-ratio ' +
    'E_CF/E_ET = E_flow/E_trunc); imp-97520 (landmark ladder); imp-398 (C_F flow prefactor); imp-2631 (E_trunc ' +
    'fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN inverse).',
};

export const IMP124889_PAIRRATIO_DRIFT_WEIGHTED_ROBUST_REFIT_ASSERTIONS = [
  {
    // The ladder reproduces the imp-124811/imp-124850 L2..L7 rungs with strictly collapsing |E_CF|.
    id: 'imp124889-ladder-matches-imp124850',
    description: 'ladder has L2..L7 at sigma 0.9/0.5/0.1/0.02/0.005/0.001 with strictly decreasing |E_CF| down the ladder',
    holds: () =>
      LADDER.length === 6 &&
      LADDER.every((r, i) => Math.abs(r.sigma - LADDER_SIGMAS[i].sigma) < 1e-12) &&
      LADDER.every((r, i) => i === 0 || r.absE_CF < LADDER[i - 1].absE_CF),
  },
  {
    // (M1): the inverse-variance WLS under the imp-124811 rung-independent floor is IDENTICAL to OLS.
    id: 'imp124889-wls-floor-equals-ols',
    description: 'the imp-124811-floor inverse-variance WLS slope equals the OLS slope to floating point (uniform weights)',
    holds: () =>
      Math.abs(WLS_FLOOR.D - OLS.D) < 1e-24 &&
      Math.abs(WLS_FLOOR.SE_D - OLS.SE_D) < 1e-24 &&
      Math.abs(WLS_FLOOR.t - OLS.t) < 1e-9,
  },
  {
    // (M2): the relative-weighted slope is even more tightly consistent with zero than OLS.
    id: 'imp124889-relative-slope-brackets-zero',
    description: 'the relative w=1/P^2 WLS slope is within one standard error of zero (|t| < 1)',
    holds: () => Math.abs(WLS_REL.t) < 1,
  },
  {
    // (M2): the relative reweighting flips the slope sign relative to OLS -- no stable drift direction.
    id: 'imp124889-sign-inconsistent-across-weightings',
    description: 'the OLS (negative) and relative-WLS (positive) slopes have opposite sign: no stable drift direction',
    holds: () => SIGN_INCONSISTENT === true && OLS.D < 0 && WLS_REL.D > 0,
  },
  {
    // (M3): every least-squares slope estimate stays at the O(1e-10) round-off scale (bracketing zero).
    id: 'imp124889-all-slopes-roundoff-scale',
    description: 'all least-squares slopes and the Theil-Sen median are O(1e-10) or smaller (round-off scale, bracketing zero)',
    holds: () =>
      Math.abs(OLS.D) < 1e-10 && Math.abs(WLS_REL.D) < 1e-10 && Math.abs(D_TS) < 1e-10 && ALL_BRACKET_ZERO === true,
  },
  {
    // (M3): the imp-124811 single-rung L2 cap stays the tighter numerical bound.
    id: 'imp124889-single-rung-cap-tighter',
    description: 'the imp-124811 single-rung L2 cap 5.80e-12 is tighter than the OLS two-sigma-scale slope uncertainty',
    holds: () => DRIFT_CAP_L2 < Math.abs(OLS.D) + 2 * OLS.SE_D,
  },
  {
    // Honesty gate: accuracy/cross-validation only, sub-gap named, no QED, PT stays SOTA.
    id: 'imp124889-honesty-gate-no-qed',
    description: 'Accuracy/cross-validation only: isRigorous false, sub-gap named, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP124889_PAIRRATIO_DRIFT_WEIGHTED_ROBUST_REFIT.isRigorous === false &&
      /SUB-GAP/.test(IMP124889_PAIRRATIO_DRIFT_WEIGHTED_ROBUST_REFIT.verdict) &&
      /NO QED/.test(IMP124889_PAIRRATIO_DRIFT_WEIGHTED_ROBUST_REFIT.verdict) &&
      /remains SOTA/.test(IMP124889_PAIRRATIO_DRIFT_WEIGHTED_ROBUST_REFIT.verdict),
  },
];

for (const a of IMP124889_PAIRRATIO_DRIFT_WEIGHTED_ROBUST_REFIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124889-pairratio-drift-weighted-robust-refit assertion failed: ${a.id}`);
  }
}
