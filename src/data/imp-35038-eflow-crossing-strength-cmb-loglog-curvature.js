/**
 * @module imp-35038-eflow-crossing-strength-cmb-loglog-curvature
 *
 * imp-35038 (numerical, frontier): imp-34950 F2 found that the LOCAL log-log slope
 * d ln s* /d ln C_mb of the E_flow crossing-strength power law s*(C_mb) = K C_mb^p stays inside a narrow
 * [1.528, 1.562] band across the [0.5,1] C_mb grid (spread ~0.034), and called this a "mild convexity"
 * signalling that ln s* is not EXACTLY linear in ln C_mb -- but it never measured the SECOND derivative
 * d^2 ln s* /d(ln C_mb)^2 directly, nor assessed whether the convexity is statistically significant against
 * the fit noise floor or is consistent with zero. This module reuses the imp-34925 / imp-34950 kernels and
 * 21-point C_mb grid VERBATIM, measures the second derivative directly (both a pointwise non-uniform
 * three-point stencil and a global OLS quadratic curvature coefficient), tests the curvature against the
 * fit residual noise via the OLS t-statistic, and closes the loop on the imp-34950 F1 pinned-vs-free
 * estimator gap by reconstructing that gap from the measured curvature alone.
 *
 * THE FINDING (measurement only; answers imp-35038)
 * -------------------------------------------------
 *   (F1) THE SECOND DERIVATIVE IS POSITIVE AND WELL AWAY FROM ZERO. Directly, d^2 ln s* /d(ln C_mb)^2 =
 *        2 b2 ~ +0.0545 from the global OLS quadratic ln s* = b0 + b1 t + b2 t^2 (t = ln C_mb), and the
 *        pointwise non-uniform three-point stencil gives a curvature in [0.0477, 0.0600] (mean ~0.0539)
 *        that is POSITIVE at every interior grid point. ln s* is genuinely CONVEX in ln C_mb, not linear:
 *        the imp-34950 F2 "mild convexity" is real and has a definite positive sign.
 *   (F2) THE CONVEXITY IS STATISTICALLY SIGNIFICANT, NOT NOISE. The OLS quadratic coefficient
 *        b2 ~ 0.02726 carries a residual-based standard error ~1.0e-4, so its t-statistic is ~271 -- the
 *        curvature sits ~271 sigma from zero, decisively rejecting the null of a pure (zero-curvature)
 *        power law. Adding the quadratic term shrinks the fit residual RMS ~64x (from ~1.07e-3 for the
 *        pure power law to ~1.67e-5), far above any bisection numerical floor. The convexity is NOT
 *        consistent with zero at the fit noise floor.
 *   (F3) THE CURVATURE EXPLAINS THE imp-34950 F1 PINNED-VS-FREE EXPONENT GAP. imp-34950 F1 measured
 *        p_pinned ~ 1.5493 (through-origin, anchored at C_mb=1 where the local slope is steepest) versus
 *        p_free ~ 1.5453 (free-K OLS, a range-averaged slope), a gap ~+4.1e-3. For a convex ln s*(ln C_mb)
 *        the two estimators sample the slope at different weightings, so the gap should equal
 *        b2 [ sum(t^3)/sum(t^2) - Cov(t,t^2)/Var(t) ]. That curvature-predicted gap is ~+4.14e-3, matching
 *        the measured ~+4.08e-3 to ~1.7% -- so the pinned/free discrepancy is a direct consequence of the
 *        (now-quantified) positive convexity, not an artifact of either estimator.
 *
 * RELATION TO imp-35037. imp-35037 diagnosed the same imp-34950 F1 pinned-vs-free gap via a GLOBAL
 * quadratic log-log fit and reported the quadratic coefficient c ~ 0.0273 (t ~ 271), concluding "model
 * mismatch, not estimator bias". This module is COMPLEMENTARY, not duplicative: it reports the DIRECT
 * second derivative 2 b2 ~ +0.0545 (twice that coefficient) and adds a MODEL-FREE pointwise non-uniform
 * three-point stencil that confirms the second derivative is positive at EVERY interior grid point, so the
 * convexity is not an artifact of assuming a quadratic form -- an independent cross-check of the global fit.
 *
 * MEASUREMENT ONLY. Surrogate diagnostic on the inherited imp-3220/imp-3406 model, NOT an RH bound. This
 * SWEEPS C_mb as a free knob and measures the curvature of a fitted exponent; it does NOT discharge the GUE
 * conditional (C_mb GUE-conditional per imp-486). The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no
 * bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2
 * (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35037-pinned-vs-free-exponent-gap-diagnosis (global quadratic convexity c ~ 0.0273 this cross-checks pointwise + reports as a direct second derivative)
 * @see imp-34950-eflow-crossing-strength-cmb-exponent-structural (F1 pinned/free gap + F2 local-slope band this quantifies)
 * @see imp-34925-eflow-crossing-strength-cmb-functional-form (the power-law form + 21-point grid reused verbatim)
 * @see imp-35115-exponent-ci-vs-local-slope-band (reconciles the exponent CI with the local slope band)
 * @see imp-3463 (far-tail E_flow decay exponent 1/2)
 * @see imp-486 (C_mb GUE-conditional, bounded <= 1)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34950_EFLOW_CROSSING_STRENGTH_CMB_EXPONENT_STRUCTURAL } from './imp-34950-eflow-crossing-strength-cmb-exponent-structural.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34925/imp-34950 exactly
const A = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc = A sqrt(L/N)

// --- kernels reused VERBATIM from imp-34950 (C_mb enters u_0 as an additive ln C_mb shift) ------------------
function eflowRatio(x) {
  const N = Math.exp(x);
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  return (C_F * (L / T0) * GRONWALL) / E_TRUNC_PT;
}
function Lof(x) {
  return Math.log(effectiveHeightForN(Math.exp(x)));
}
function u0(x, cmb) {
  return Math.log(cmb) + Math.log(A) + 0.5 * Math.log(Lof(x)) - x / 2;
}
function phi(x, s) {
  return -Math.log(1 + s * eflowRatio(x));
}
function uFull(x, s, cmb) {
  return u0(x, cmb) + phi(x, s);
}
function sigmaOf(x, s, cmb) {
  return 1 / (1 + Math.exp(-uFull(x, s, cmb)));
}
const H_ID = 1e-2;
function d1(f, x, h) {
  return (f(x + h) - f(x - h)) / (2 * h);
}
function d2(f, x, h) {
  return (f(x + h) - 2 * f(x) + f(x - h)) / (h * h);
}
function d3(f, x, h) {
  return (f(x + 2 * h) - 2 * f(x + h) + 2 * f(x - h) - f(x - 2 * h)) / (2 * h * h * h);
}
function d2Cond(x, s, cmb, h) {
  const S = sigmaOf(x, s, cmb);
  const up = d1((z) => uFull(z, s, cmb), x, h);
  const upp = d2((z) => uFull(z, s, cmb), x, h);
  return (1 - 2 * S) * up * up + upp;
}
function fKnee(x, s, cmb, h) {
  const S = sigmaOf(x, s, cmb);
  const v = -d1((z) => uFull(z, s, cmb), x, h);
  const vp = -d2((z) => uFull(z, s, cmb), x, h);
  const vpp = -d3((z) => uFull(z, s, cmb), x, h);
  return S * v * v * v * (2 * S - 1) + 3 * S * v * vp + vpp;
}
function bisect(f, a, b) {
  let fa = f(a);
  for (let i = 0; i < 200; i++) {
    const m = 0.5 * (a + b);
    const fm = f(m);
    if (Math.sign(fm) === Math.sign(fa)) {
      a = m;
      fa = fm;
    } else {
      b = m;
    }
  }
  return 0.5 * (a + b);
}
const LN10 = Math.LN10;
const LO = Math.log(1e6);
const HI = Math.log(1e13);
function kneeAt(s, cmb) {
  return bisect((x) => fKnee(x, s, cmb, H_ID), LO, HI);
}
function inflAt(s, cmb) {
  return bisect((x) => d2Cond(x, s, cmb, H_ID), LO, HI);
}
function gapAt(s, cmb) {
  return (kneeAt(s, cmb) - inflAt(s, cmb)) / LN10;
}
function sStarAt(cmb) {
  return bisect((s) => gapAt(s, cmb), 0, 1);
}

// --- the imp-34925 finer 21-point sweep over C_mb in [0.5, 1] (step 0.025), reused verbatim ------------------
const CMB_GRID = [];
for (let i = 0; i <= 20; i++) {
  CMB_GRID.push(+(1.0 - 0.025 * i).toFixed(4));
}
const S_STAR = CMB_GRID.map((c) => sStarAt(c));
const S_STAR_AT_1 = S_STAR[0]; // ~0.77765
const T = CMB_GRID.map((c) => Math.log(c)); // t = ln C_mb
const Y = S_STAR.map((s) => Math.log(s)); // y = ln s*
const NPTS = CMB_GRID.length;

// --- global OLS quadratic y = b0 + b1 t + b2 t^2 (b2 = HALF the second derivative) ---------------------------
function inv3(m) {
  const [[a, b, c], [d, e, f], [g, h, i]] = m;
  const A11 = e * i - f * h, A12 = -(d * i - f * g), A13 = d * h - e * g;
  const det = a * A11 + b * A12 + c * A13;
  const A21 = -(b * i - c * h), A22 = a * i - c * g, A23 = -(a * h - b * g);
  const A31 = b * f - c * e, A32 = -(a * f - c * d), A33 = a * e - b * d;
  return [
    [A11 / det, A21 / det, A31 / det],
    [A12 / det, A22 / det, A32 / det],
    [A13 / det, A23 / det, A33 / det],
  ];
}
let S1 = 0, S2 = 0, S3 = 0, S4 = 0, U0 = 0, U1 = 0, U2 = 0;
for (let i = 0; i < NPTS; i++) {
  const t = T[i], y = Y[i];
  S1 += t; S2 += t * t; S3 += t * t * t; S4 += t * t * t * t;
  U0 += y; U1 += t * y; U2 += t * t * y;
}
const XtX = [[NPTS, S1, S2], [S1, S2, S3], [S2, S3, S4]];
const XtXinv = inv3(XtX);
const RHS = [U0, U1, U2];
const BETA = [0, 0, 0];
for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) BETA[i] += XtXinv[i][j] * RHS[j];
const B0 = BETA[0], B1 = BETA[1], B2 = BETA[2];
const SECOND_DERIV = 2 * B2; // d^2 ln s* / d(ln C_mb)^2

// residual-based standard error of the curvature coefficient + its t-statistic (curvature vs noise floor).
let SSE_QUAD = 0;
for (let i = 0; i < NPTS; i++) {
  const pred = B0 + B1 * T[i] + B2 * T[i] * T[i];
  SSE_QUAD += (Y[i] - pred) * (Y[i] - pred);
}
const SIGMA2_QUAD = SSE_QUAD / (NPTS - 3);
const SE_B2 = Math.sqrt(SIGMA2_QUAD * XtXinv[2][2]);
const T_STAT_B2 = B2 / SE_B2; // ~271 (curvature many sigma from zero)
const RMS_QUAD = Math.sqrt(SSE_QUAD / NPTS);

// pure power-law (free-K linear) residual, for the residual-shrink comparison.
let st = 0, sy = 0, stt = 0, sty = 0;
for (let i = 0; i < NPTS; i++) { st += T[i]; sy += Y[i]; stt += T[i] * T[i]; sty += T[i] * Y[i]; }
const P_FREE = (NPTS * sty - st * sy) / (NPTS * stt - st * st);
const A_FREE = (sy - P_FREE * st) / NPTS;
let SSE_LIN = 0;
for (let i = 0; i < NPTS; i++) SSE_LIN += (Y[i] - (A_FREE + P_FREE * T[i])) ** 2;
const RMS_LIN = Math.sqrt(SSE_LIN / NPTS);
const RESID_SHRINK = RMS_LIN / RMS_QUAD; // ~64x

// --- pointwise second derivative via non-uniform three-point stencil (ln C_mb is unequally spaced) -----------
const LOCAL_D2 = [];
for (let i = 1; i < NPTS - 1; i++) {
  const tl = T[i - 1], tc = T[i], tr = T[i + 1];
  LOCAL_D2.push(
    2 * (Y[i - 1] / ((tl - tc) * (tl - tr)) + Y[i] / ((tc - tl) * (tc - tr)) + Y[i + 1] / ((tr - tl) * (tr - tc)))
  );
}
const D2_MIN = Math.min(...LOCAL_D2);
const D2_MAX = Math.max(...LOCAL_D2);
const D2_MEAN = LOCAL_D2.reduce((a, c) => a + c, 0) / LOCAL_D2.length;
const D2_ALL_POSITIVE = LOCAL_D2.every((v) => v > 0);

// --- (F3) reconstruct the imp-34950 F1 pinned-vs-free exponent gap from the curvature alone -----------------
// pinned through-origin exponent (intercept forced to ln s*(1)) and free-K OLS exponent.
let num = 0, den = 0;
for (let i = 0; i < NPTS; i++) { num += (Y[i] - Math.log(S_STAR_AT_1)) * T[i]; den += T[i] * T[i]; }
const P_PINNED = num / den;
const GAP_MEASURED = P_PINNED - P_FREE; // ~+4.1e-3
// for y = b0 + b1 t + b2 t^2: p_pinned = b1 + b2 sum(t^3)/sum(t^2); p_free = b1 + b2 Cov(t,t^2)/Var(t).
const TBAR = st / NPTS, T2BAR = stt / NPTS;
let COV_T_T2 = 0, VAR_T = 0;
for (let i = 0; i < NPTS; i++) {
  COV_T_T2 += (T[i] - TBAR) * (T[i] * T[i] - T2BAR);
  VAR_T += (T[i] - TBAR) * (T[i] - TBAR);
}
const GAP_PREDICTED = B2 * (S3 / den - COV_T_T2 / VAR_T); // ~+4.14e-3
const GAP_REL_ERR = Math.abs(GAP_PREDICTED - GAP_MEASURED) / Math.abs(GAP_MEASURED); // ~1.7%

// reuse gate: recomputed baseline reproduces the imp-34950 exponents.
const P_PINNED_VS_IMP34950 = Math.abs(P_PINNED - IMP34950_EFLOW_CROSSING_STRENGTH_CMB_EXPONENT_STRUCTURAL.exponent.pinned.p);

export const IMP35038_EFLOW_CROSSING_STRENGTH_CMB_LOGLOG_CURVATURE = {
  id: 'imp-35038',
  proofSection: 'S-frontier',
  question:
    'imp-34950 F2 found the local log-log slope d ln s*/d ln C_mb stays in [1.528, 1.562] across the [0.5,1] ' +
    'C_mb grid (spread ~0.034), a "mild convexity" signalling ln s* is not exactly linear in ln C_mb, but ' +
    'never measured the second derivative d^2 ln s*/d(ln C_mb)^2 directly nor assessed its significance. ' +
    'Measure it and assess whether the convexity is statistically significant against the fit noise floor or ' +
    'consistent with zero (a significant curvature would explain the imp-34950 F1 pinned-vs-free estimator ' +
    'gap). Measurement only; SWEEPS C_mb, does NOT discharge the GUE conditional (imp-486); no bound; NO QED.',
  verdictShort:
    'The second derivative is POSITIVE and far from zero: d^2 ln s*/d(ln C_mb)^2 ~ +0.0545 (global OLS ' +
    'quadratic), with a pointwise stencil in [0.0477, 0.0600] positive at every interior grid point -- ln s* ' +
    'is genuinely CONVEX in ln C_mb. It is STATISTICALLY SIGNIFICANT, not noise: the quadratic coefficient ' +
    'b2 ~ 0.02726 has residual-based se ~1.0e-4, so t ~ 271 sigma from zero, and adding the quadratic term ' +
    'shrinks the fit residual RMS ~64x (1.07e-3 -> 1.67e-5). The convexity EXPLAINS the imp-34950 F1 ' +
    'pinned-vs-free gap: the curvature-predicted gap ~+4.14e-3 matches the measured ~+4.08e-3 to ~1.7%.',
  measuredQuantity:
    'the second derivative d^2 ln s*/d(ln C_mb)^2 of the imp-34925/imp-34950 E_flow crossing-strength ' +
    'power law on the reused 21-point C_mb grid over [0.5,1], measured both as the global OLS quadratic ' +
    'curvature 2 b2 and as a pointwise non-uniform three-point stencil; its residual-based standard error / ' +
    't-statistic (curvature vs fit noise floor); and the curvature-predicted imp-34950 F1 pinned-vs-free ' +
    'exponent gap b2[sum(t^3)/sum(t^2) - Cov(t,t^2)/Var(t)]',
  secondDerivative: {
    global_ols_quadratic: +SECOND_DERIV.toFixed(6), // ~+0.054528
    quadratic_coef_b2: +B2.toFixed(6), // ~0.027264
    pointwise_stencil_min: +D2_MIN.toFixed(6), // ~0.047665
    pointwise_stencil_max: +D2_MAX.toFixed(6), // ~0.059994
    pointwise_stencil_mean: +D2_MEAN.toFixed(6), // ~0.053897
    all_interior_points_positive: D2_ALL_POSITIVE,
    note:
      'The second derivative of ln s* with respect to ln C_mb is POSITIVE everywhere on the grid: ln s* is ' +
      'convex in ln C_mb, so the imp-34950 F2 mild convexity is real with a definite positive sign. The ' +
      'global OLS quadratic curvature 2 b2 ~ +0.0545 sits inside the pointwise stencil band [0.048, 0.060].',
  },
  significance: {
    quadratic_coef_se: +SE_B2.toExponential(3), // ~1.0e-4
    t_statistic: +T_STAT_B2.toFixed(1), // ~271
    residual_rms_powerlaw: +RMS_LIN.toExponential(3), // ~1.07e-3
    residual_rms_quadratic: +RMS_QUAD.toExponential(3), // ~1.67e-5
    residual_shrink_factor: +RESID_SHRINK.toFixed(1), // ~64
    note:
      'The curvature coefficient b2 sits ~271 residual-based standard errors from zero, and adding the ' +
      'quadratic term shrinks the fit residual RMS ~64x. The convexity is decisively significant against ' +
      'the fit noise floor, NOT consistent with zero.',
  },
  pinnedFreeGap: {
    p_pinned: +P_PINNED.toFixed(6), // ~1.549326
    p_free: +P_FREE.toFixed(6), // ~1.545251
    gap_measured: +GAP_MEASURED.toExponential(4), // ~+4.075e-3
    gap_predicted_from_curvature: +GAP_PREDICTED.toExponential(4), // ~+4.144e-3
    gap_rel_err: +GAP_REL_ERR.toExponential(3), // ~1.7e-2
    note:
      'For a convex ln s*(ln C_mb) the through-origin pinned estimator (anchored at C_mb=1, steepest slope) ' +
      'and the range-averaged free-K OLS estimator sample the slope with different weights, so their gap ' +
      'equals b2[sum(t^3)/sum(t^2) - Cov(t,t^2)/Var(t)]. The curvature-predicted gap ~+4.14e-3 matches the ' +
      'measured imp-34950 F1 gap ~+4.08e-3 to ~1.7% -- the estimator gap is a direct consequence of the ' +
      'positive convexity, not an artifact of either estimator.',
  },
  baseline: {
    s_star_at_1: +S_STAR_AT_1.toFixed(6),
    p_pinned_vs_imp34950_absdiff: +P_PINNED_VS_IMP34950.toExponential(3),
  },
  finding: {
    F1_second_derivative_positive:
      'The second derivative d^2 ln s*/d(ln C_mb)^2 is POSITIVE: 2 b2 ~ +0.0545 (global OLS quadratic), with ' +
      'a pointwise non-uniform stencil in [0.0477, 0.0600] (mean ~0.0539) positive at every interior grid ' +
      'point. ln s* is genuinely convex in ln C_mb; the imp-34950 F2 mild convexity is real and positive.',
    F2_convexity_statistically_significant:
      'The OLS quadratic coefficient b2 ~ 0.02726 has residual-based se ~1.0e-4, so its t-statistic is ~271 ' +
      '-- the curvature is ~271 sigma from zero. Adding the quadratic term shrinks the fit residual RMS ~64x ' +
      '(from ~1.07e-3 for the pure power law to ~1.67e-5). The convexity is NOT consistent with zero at the ' +
      'fit noise floor; it is a decisively significant systematic feature of the surrogate.',
    F3_curvature_explains_pinned_free_gap:
      'imp-34950 F1 measured p_pinned ~ 1.5493 (through-origin, C_mb=1 anchor) vs p_free ~ 1.5453 (free-K ' +
      'OLS), a gap ~+4.08e-3. That gap equals b2[sum(t^3)/sum(t^2) - Cov(t,t^2)/Var(t)] for a convex ln s*, ' +
      'and the curvature-predicted value ~+4.14e-3 matches to ~1.7% -- so the pinned/free discrepancy is a ' +
      'direct consequence of the (now-quantified) positive convexity, not an estimator artifact.',
  },
  farTailExponent: 0.5, // imp-3463 asymptote
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier, NOT rigorous). Measuring the second derivative d^2 ln s*/d(ln C_mb)^2 of the ' +
    'imp-34925/imp-34950 E_flow crossing-strength power law on the reused 21-point C_mb grid over [0.5,1]: ' +
    '(F1) it is POSITIVE -- 2 b2 ~ +0.0545 (global OLS quadratic), pointwise stencil in [0.0477, 0.0600] ' +
    '(mean ~0.0539) positive at every interior grid point, so ln s* is genuinely convex in ln C_mb and the ' +
    'imp-34950 F2 mild convexity is real with a definite positive sign. (F2) it is STATISTICALLY ' +
    'SIGNIFICANT: the quadratic coefficient b2 ~ 0.02726 has residual-based se ~1.0e-4, giving t ~ 271 sigma ' +
    'from zero, and adding the quadratic term shrinks the fit residual RMS ~64x (~1.07e-3 -> ~1.67e-5) -- ' +
    'NOT consistent with zero at the fit noise floor. (F3) the convexity EXPLAINS the imp-34950 F1 ' +
    'pinned-vs-free exponent gap: the curvature-predicted gap b2[sum(t^3)/sum(t^2) - Cov(t,t^2)/Var(t)] ~ ' +
    '+4.14e-3 matches the measured p_pinned - p_free ~ +4.08e-3 to ~1.7%. This SWEEPS C_mb as a free knob ' +
    'and measures the curvature of a fitted exponent; it does NOT discharge the GUE conditional (C_mb ' +
    'GUE-conditional per imp-486). The component model is the inherited imp-3220/imp-3406 extrapolation, NOT ' +
    'a rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 ' +
    '(imp-3463); no RH verdict, NO QED. No refereed bound is changed.',
  subGap:
    'ANSWERS imp-35038: the second derivative d^2 ln s*/d(ln C_mb)^2 of the imp-34925/imp-34950 crossing- ' +
    'strength power law is POSITIVE (2 b2 ~ +0.0545 global, pointwise [0.0477, 0.0600] positive everywhere) ' +
    'and STATISTICALLY SIGNIFICANT (OLS quadratic coefficient ~271 se from zero, residual RMS shrinks ~64x), ' +
    'so ln s* is genuinely convex in ln C_mb -- NOT consistent with zero curvature. The convexity ' +
    'QUANTITATIVELY reconstructs the imp-34950 F1 pinned-vs-free exponent gap (predicted ~+4.14e-3 vs ' +
    'measured ~+4.08e-3, ~1.7%). What stays OPEN (deferred, changes no bound): a structural derivation of ' +
    'the curvature sign/magnitude from the additive ln(C_mb) log-odds shift composed with the imp-3463 ' +
    'near-power E_flow decay (why b2 ~ 0.027 specifically), and whether the curvature is surrogate- ' +
    'independent or drifts with the imp-3220/imp-3406 extrapolation; a derivation PINNING C_mb below the GUE ' +
    'bound of 1 (imp-486) would then fix the physical s* and its convexity via C_mb^p.',
  citation:
    'imp-35037 (global quadratic convexity c ~ 0.0273 this reports as a direct second derivative and ' +
    'cross-checks with a model-free pointwise stencil); ' +
    'imp-34950 (the F1 pinned/free gap and F2 local-slope band this quantifies; kernels reused verbatim); ' +
    'imp-34925 (the power-law form s* = K C_mb^p and 21-point grid); imp-35115 (exponent CI vs local slope ' +
    'band); imp-3463 (far-tail exponent 1/2); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping ' +
    '(effectiveHeightForN).',
};

export const IMP35038_EFLOW_CROSSING_STRENGTH_CMB_LOGLOG_CURVATURE_ASSERTIONS = [
  {
    // Reuse gate: the recomputed baseline reproduces the imp-34950 pinned exponent and s*(1).
    id: 'imp35038-reproduces-imp34950-baseline',
    description: 'recomputed pinned p and s*(1) reproduce imp-34950 to < 1e-3',
    holds: () => P_PINNED_VS_IMP34950 < 1e-3 && Math.abs(S_STAR_AT_1 - 0.77765) < 5e-4,
  },
  {
    // (F1): the second derivative is positive and O(0.05), both globally and pointwise.
    id: 'imp35038-second-derivative-positive',
    description: 'd^2 ln s*/d(ln C_mb)^2 is positive ~0.05, global OLS 2b2 inside the pointwise stencil band',
    holds: () =>
      SECOND_DERIV > 0.04 &&
      SECOND_DERIV < 0.07 &&
      D2_ALL_POSITIVE &&
      D2_MIN > 0.03 &&
      D2_MAX < 0.08 &&
      SECOND_DERIV > D2_MIN &&
      SECOND_DERIV < D2_MAX,
  },
  {
    // (F2): the curvature is many sigma from zero and the quadratic sharply shrinks the residual.
    id: 'imp35038-convexity-statistically-significant',
    description: 'quadratic coefficient t-statistic > 50 and residual RMS shrinks > 10x vs the pure power law',
    holds: () => T_STAT_B2 > 50 && SE_B2 < 1e-3 && RESID_SHRINK > 10,
  },
  {
    // (F3): the curvature-predicted pinned-free gap matches the measured imp-34950 F1 gap.
    id: 'imp35038-curvature-explains-pinned-free-gap',
    description: 'curvature-predicted p_pinned - p_free matches the measured gap to < 5%',
    holds: () =>
      GAP_MEASURED > 0 &&
      GAP_PREDICTED > 0 &&
      GAP_REL_ERR < 0.05 &&
      Math.abs(GAP_MEASURED - 4.08e-3) < 5e-4,
  },
  {
    // Honesty gate: measurement only, far-tail exponent = 1/2, sub-gap names imp-486, no QED, no refereed bound is changed.
    id: 'imp35038-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2, sub-gap names imp-486, no QED, no refereed bound is changed',
    holds: () =>
      IMP35038_EFLOW_CROSSING_STRENGTH_CMB_LOGLOG_CURVATURE.isRigorous === false &&
      IMP35038_EFLOW_CROSSING_STRENGTH_CMB_LOGLOG_CURVATURE.farTailExponent === 0.5 &&
      typeof IMP35038_EFLOW_CROSSING_STRENGTH_CMB_LOGLOG_CURVATURE.subGap === 'string' &&
      /imp-486/.test(IMP35038_EFLOW_CROSSING_STRENGTH_CMB_LOGLOG_CURVATURE.subGap) &&
      /NO QED/.test(IMP35038_EFLOW_CROSSING_STRENGTH_CMB_LOGLOG_CURVATURE.verdict) &&
      /refereed bound is changed/i.test(IMP35038_EFLOW_CROSSING_STRENGTH_CMB_LOGLOG_CURVATURE.verdict),
  },
];

for (const a of IMP35038_EFLOW_CROSSING_STRENGTH_CMB_LOGLOG_CURVATURE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35038-eflow-crossing-strength-cmb-loglog-curvature assertion failed: ${a.id}`);
  }
}
