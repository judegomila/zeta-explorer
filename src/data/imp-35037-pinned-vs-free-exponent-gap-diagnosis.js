/**
 * @module imp-35037-pinned-vs-free-exponent-gap-diagnosis
 *
 * imp-35037 (numerical, frontier): imp-34950 F1 reported TWO exponent estimators for the E_flow
 * crossing-strength power law s*(C_mb) = K C_mb^p and they disagree at ~3 combined sigma:
 *   - the PINNED fit (K forced to s*(1), slope via through-origin log-log regression): p_pinned = 1.5493
 *     +/- 8.9e-4;
 *   - the FREE-K log-log OLS regression: p_free = 1.5453 +/- 1.2e-3.
 * The ~0.004 gap is ~3 combined standard errors. This module DIAGNOSES the gap: is it an ESTIMATOR BIAS
 * (the pinned fit forcing the intercept to the single anchor value ln s*(1)), or a GENUINE MODEL MISMATCH
 * (a mild convexity that the single power-law form cannot capture, consistent with the imp-34950 F2
 * [1.528,1.562] local-slope drift)? It reuses the imp-34925 / imp-34950 21-point C_mb grid and the s*
 * bisection VERBATIM, then decides the two hypotheses with a quadratic log-log fit.
 *
 * THE DIAGNOSTIC (measurement only; answers imp-35037)
 * ---------------------------------------------------
 * A single power law is EXACT iff ln s* is EXACTLY linear in ln C_mb. If it were, the pinned through-origin
 * slope and the free OLS slope would coincide (an exact line through the anchor is fit identically by both).
 * A gap can therefore arise two ways: (i) the anchor point ln s*(1) carries fit noise so the pinned slope
 * inherits an anchor-leverage bias -- pure ESTIMATOR BIAS; or (ii) ln s* is genuinely CURVED, so the two
 * linear estimators, weighting the grid differently, read different average slopes -- MODEL MISMATCH.
 *
 * We fit a quadratic ln s* = a + b (ln C_mb) + c (ln C_mb)^2 and (F1) test whether c is statistically
 * significant against the fit noise; (F2) apply BOTH linear estimators to the NOISELESS fitted quadratic
 * curve and measure the gap they produce PURELY from curvature; (F3) compare that curvature-driven gap to
 * the observed pinned-free gap to attribute it. The anchor point sits at ln C_mb = 0 (C_mb = 1), the HIGH
 * end of the mildly convex curve, so the pinned estimator -- forced through that endpoint -- reads a STEEPER
 * slope than the grid-averaging free OLS. That is exactly the observed sign (p_pinned > p_free).
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (F1) THE CURVATURE IS REAL, NOT NOISE. The quadratic log-log coefficient c is POSITIVE (convex) and many
 *        standard errors from zero; adding the quadratic term cuts the linear-fit residual sum-of-squares by
 *        a large factor. So ln s* is NOT exactly linear in ln C_mb -- the single power law is a mild
 *        mis-specification, matching the imp-34950 F2 local-slope drift.
 *   (F2) CURVATURE ALONE REPRODUCES THE GAP SIGN AND MOST OF ITS SIZE. Feeding the noiseless fitted quadratic
 *        through the pinned and free estimators yields p_pinned_q > p_free_q with a gap that recovers the
 *        large majority of the observed 0.004 -- the pinned estimator, anchored at the convex curves high-C_mb
 *        endpoint, systematically reads the steeper local slope there.
 *   (F3) VERDICT: the gap is DOMINANTLY a MODEL MISMATCH (genuine mild convexity), NOT primarily an estimator
 *        artifact. The K-pinning is the LEVER that converts the convexity into a slope gap (on an exactly
 *        linear law it would produce none), but the necessary and sufficient ingredient is the real curvature.
 *        The residual not explained by the smooth curvature is the small anchor-leverage (estimator-bias)
 *        component. Practically: p is a mildly effective exponent, so quoting a single p to 4 digits over-states
 *        the precision of the power-law form; the imp-34950 CI band [1.5476,1.5511] and the F2 slope band
 *        [1.528,1.562] together bracket the honest spread.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic on the inherited surrogate, NOT an RH bound. It reuses the
 * imp-34925/imp-34950 grid + s* bisection verbatim, SWEEPS C_mb as a free knob, and DOES NOT discharge the
 * GUE conditional (C_mb GUE-conditional per imp-486). The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the C_C 1/8 ansatz (imp-2642/2643) is UNTOUCHED; changes no
 * bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2
 * (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34950-eflow-crossing-strength-cmb-exponent-structural (the F1 pinned/free exponents whose ~3-sigma gap this diagnoses; grid + s* bisection reused verbatim)
 * @see imp-34925-eflow-crossing-strength-cmb-functional-form (the power-law form s* = K C_mb^p)
 * @see imp-34994-cmb-exponent-bootstrap-jackknife (resampling SEs for the same exponent)
 * @see imp-35115-exponent-ci-vs-local-slope-band (the CI-vs-slope-band reconciliation this complements)
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
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-34886/imp-34907/imp-34925/imp-34950 exactly
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

// --- the imp-34925/imp-34950 finer 21-point sweep over C_mb in [0.5, 1] (step 0.025), reused verbatim -------
const CMB_GRID = [];
for (let i = 0; i <= 20; i++) {
  CMB_GRID.push(+(1.0 - 0.025 * i).toFixed(4));
}
const S_STAR = CMB_GRID.map((c) => sStarAt(c));
const S_STAR_AT_1 = S_STAR[0]; // ~0.77765 (C_mb=1 anchor, first grid point, ln C_mb = 0)
const X = CMB_GRID.map((c) => Math.log(c)); // ln C_mb; X[0] = 0
const Y = S_STAR.map((s) => Math.log(s)); // ln s*
const NPTS = CMB_GRID.length;

// --- the two imp-34950 linear estimators reproduced (the ~3-sigma gap being diagnosed) ---------------------
// (A) pinned through-origin slope: ln s* - ln s*(1) = p ln C_mb.
let numPin = 0, denPin = 0;
for (let i = 0; i < NPTS; i++) {
  numPin += (Y[i] - Math.log(S_STAR_AT_1)) * X[i];
  denPin += X[i] * X[i];
}
const P_PINNED = numPin / denPin; // ~1.5493
// (B) free-K OLS slope.
let sx = 0, sy = 0, sxx = 0, sxy = 0;
for (let i = 0; i < NPTS; i++) {
  sx += X[i]; sy += Y[i]; sxx += X[i] * X[i]; sxy += X[i] * Y[i];
}
const P_FREE = (NPTS * sxy - sx * sy) / (NPTS * sxx - sx * sx); // ~1.5453
const OBSERVED_GAP = P_PINNED - P_FREE; // ~+0.004 (pinned steeper than free)

// --- (F1) QUADRATIC LOG-LOG FIT: is ln s* genuinely curved in ln C_mb? -------------------------------------
// ln s* = a + b X + c X^2, solved by 3x3 normal equations on the moment sums.
let s2 = 0, s3 = 0, s4 = 0, sx2y = 0;
for (let i = 0; i < NPTS; i++) {
  const x2 = X[i] * X[i];
  s2 += x2; s3 += x2 * X[i]; s4 += x2 * x2; sx2y += x2 * Y[i];
}
// normal-equation matrix M [ [n, s1, s2], [s1, s2, s3], [s2, s3, s4] ] * [a,b,c] = [sy, sxy, sx2y]
function solve3(M, rhs) {
  const m = [M[0].slice(), M[1].slice(), M[2].slice()];
  const v = rhs.slice();
  for (let col = 0; col < 3; col++) {
    let piv = col;
    for (let r = col + 1; r < 3; r++) if (Math.abs(m[r][col]) > Math.abs(m[piv][col])) piv = r;
    [m[col], m[piv]] = [m[piv], m[col]];
    [v[col], v[piv]] = [v[piv], v[col]];
    for (let r = 0; r < 3; r++) {
      if (r === col) continue;
      const f = m[r][col] / m[col][col];
      for (let k = col; k < 3; k++) m[r][k] -= f * m[col][k];
      v[r] -= f * v[col];
    }
  }
  return [v[0] / m[0][0], v[1] / m[1][1], v[2] / m[2][2]];
}
const MAT = [
  [NPTS, sx, s2],
  [sx, s2, s3],
  [s2, s3, s4],
];
const [A_Q, B_Q, C_Q] = solve3(MAT, [sy, sxy, sx2y]);

// residual variance of the quadratic fit and the SE of the curvature coefficient c.
let sseQuad = 0;
for (let i = 0; i < NPTS; i++) {
  const r = Y[i] - (A_Q + B_Q * X[i] + C_Q * X[i] * X[i]);
  sseQuad += r * r;
}
const SIGMA2_QUAD = sseQuad / (NPTS - 3);
// var(c) = sigma^2 * (M^{-1})_{22}; compute the (2,2) cofactor of MAT / det(MAT).
function det3(m) {
  return (
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0])
  );
}
const DET_MAT = det3(MAT);
const COFACTOR_22 = MAT[0][0] * MAT[1][1] - MAT[0][1] * MAT[1][0]; // (M^{-1})_{22} = C_22 / det
const VAR_C = SIGMA2_QUAD * (COFACTOR_22 / DET_MAT);
const SE_C = Math.sqrt(Math.abs(VAR_C));
const T_C = Math.abs(C_Q) / SE_C; // curvature significance in sigma

// linear-fit SSE (for the residual-reduction ratio: how much the quadratic term explains).
let sseLin = 0;
const A_LIN = (sy - P_FREE * sx) / NPTS;
for (let i = 0; i < NPTS; i++) {
  const r = Y[i] - (A_LIN + P_FREE * X[i]);
  sseLin += r * r;
}
const SSE_REDUCTION_RATIO = sseLin / sseQuad; // >> 1 => quadratic term is doing real work

// --- (F2) APPLY BOTH ESTIMATORS TO THE NOISELESS FITTED QUADRATIC: the curvature-only gap -------------------
const Y_Q = X.map((x) => A_Q + B_Q * x + C_Q * x * x); // smooth curve, noise removed
// pinned through-origin on the smooth curve (anchor = Y_Q[0] = A_Q at X=0).
let numPinQ = 0;
for (let i = 0; i < NPTS; i++) numPinQ += (Y_Q[i] - Y_Q[0]) * X[i];
const P_PINNED_Q = numPinQ / denPin;
// free OLS on the smooth curve.
let sxyQ = 0, syQ = 0;
for (let i = 0; i < NPTS; i++) { sxyQ += X[i] * Y_Q[i]; syQ += Y_Q[i]; }
const P_FREE_Q = (NPTS * sxyQ - sx * syQ) / (NPTS * sxx - sx * sx);
const GAP_FROM_CURVATURE = P_PINNED_Q - P_FREE_Q; // curvature-only slope gap

// --- (F3) ATTRIBUTION: what fraction of the observed gap is smooth curvature vs anchor leverage -------------
const FRAC_GAP_EXPLAINED = GAP_FROM_CURVATURE / OBSERVED_GAP; // ~most of it => model mismatch
// anchor-leverage (estimator-bias) residual: the pinned slope pivots on the ACTUAL noisy anchor Y[0], not the
// smooth-curve value A_Q. d p_pinned / d(anchor) = -sum(X)/sum(X^2); the anchor residual is Y[0]-A_Q.
const ANCHOR_LEVERAGE = -sx / denPin; // sensitivity of the pinned slope to the anchor value
const ANCHOR_BIAS_COMPONENT = -(Y[0] - A_Q) * ANCHOR_LEVERAGE; // the estimator-bias piece of the gap
const CURVATURE_IS_DOMINANT = GAP_FROM_CURVATURE > Math.abs(ANCHOR_BIAS_COMPONENT);

// reuse gate: reproduce the imp-34950 pinned/free exponents.
const P_PINNED_VS_IMP34950 = Math.abs(P_PINNED - IMP34950_EFLOW_CROSSING_STRENGTH_CMB_EXPONENT_STRUCTURAL.exponent.pinned.p);
const P_FREE_VS_IMP34950 = Math.abs(P_FREE - IMP34950_EFLOW_CROSSING_STRENGTH_CMB_EXPONENT_STRUCTURAL.exponent.free.p);

export const IMP35037_PINNED_VS_FREE_EXPONENT_GAP_DIAGNOSIS = {
  id: 'imp-35037',
  proofSection: 'S-frontier',
  question:
    'imp-34950 F1 reported two exponent estimators for s*(C_mb) = K C_mb^p that disagree at ~3 combined ' +
    'sigma: pinned p = 1.5493 +/- 8.9e-4 (K forced to s*(1)) and free-K OLS p = 1.5453 +/- 1.2e-3, a ' +
    '~0.004 gap. Is the gap an ESTIMATOR BIAS (the pinned fit constraining K to the single anchor value) ' +
    'or a GENUINE MODEL MISMATCH (a mild convexity the single power-law form cannot capture, consistent ' +
    'with the imp-34950 F2 [1.528,1.562] local-slope drift)? Reuse the imp-34925/imp-34950 21-point C_mb ' +
    'grid + s* bisection verbatim; SWEEPS C_mb, does NOT discharge the GUE conditional (imp-486); changes ' +
    'no bound; NO QED.',
  verdictShort:
    'The gap is DOMINANTLY a MODEL MISMATCH, not an estimator artifact. A quadratic log-log fit finds a ' +
    'significant POSITIVE (convex) curvature coefficient (t ~ ' + T_C.toFixed(1) + ' sigma, quadratic term ' +
    'cutting the linear SSE by ~' + SSE_REDUCTION_RATIO.toFixed(1) + 'x), so ln s* is NOT exactly linear in ' +
    'ln C_mb. Feeding the NOISELESS fitted quadratic through both estimators reproduces the observed gap ' +
    'sign and ~' + (100 * FRAC_GAP_EXPLAINED).toFixed(0) + '% of its size: the pinned estimator, anchored at ' +
    'the convex curves high-C_mb endpoint (ln C_mb = 0), systematically reads the steeper local slope. The ' +
    'K-pinning is the LEVER that turns the convexity into a slope gap (on an exact power law it would ' +
    'produce none); the necessary ingredient is the real curvature. The small anchor-leverage residual ' +
    '(~' + ANCHOR_BIAS_COMPONENT.toExponential(1) + ') is the genuine estimator-bias part.',
  measuredQuantity:
    'the attribution of the imp-34950 F1 pinned-vs-free exponent gap (P_PINNED - P_FREE) between a smooth ' +
    'curvature component and an anchor-leverage estimator-bias component, via a quadratic log-log fit ' +
    'ln s* = a + b ln C_mb + c (ln C_mb)^2 on the reused 21-point C_mb grid: the curvature coefficient c ' +
    'with its residual-based SE / significance, the linear-vs-quadratic SSE reduction, and the gap the ' +
    'noiseless fitted quadratic produces under both estimators',
  estimators: {
    p_pinned: +P_PINNED.toFixed(5), // ~1.5493
    p_free: +P_FREE.toFixed(5), // ~1.5453
    observed_gap: +OBSERVED_GAP.toExponential(4), // ~+4.0e-3 (pinned steeper)
    note: 'The two imp-34950 F1 linear estimators, reproduced on the reused grid; the pinned slope is steeper.',
  },
  curvature: {
    form: 'ln s* = a + b ln C_mb + c (ln C_mb)^2 (quadratic log-log fit)',
    a: +A_Q.toFixed(6),
    b: +B_Q.toFixed(6),
    c: +C_Q.toFixed(6), // POSITIVE => convex ln s*(ln C_mb)
    se_c: +SE_C.toExponential(3),
    t_c_sigma: +T_C.toFixed(2), // curvature significance (>> 3 => real, not noise)
    sse_reduction_ratio: +SSE_REDUCTION_RATIO.toFixed(2), // linear SSE / quadratic SSE
    note:
      'The quadratic log-log coefficient c is POSITIVE (convex) and many SEs from zero, and the quadratic ' +
      'term cuts the linear residual sum-of-squares by a large factor -- ln s* is genuinely curved in ' +
      'ln C_mb, so the single power law is a mild mis-specification (matching imp-34950 F2 slope drift).',
  },
  attribution: {
    p_pinned_on_smooth_quadratic: +P_PINNED_Q.toFixed(5),
    p_free_on_smooth_quadratic: +P_FREE_Q.toFixed(5),
    gap_from_curvature: +GAP_FROM_CURVATURE.toExponential(4), // curvature-only slope gap
    frac_of_observed_gap_explained: +FRAC_GAP_EXPLAINED.toFixed(4), // ~most of it
    anchor_bias_component: +ANCHOR_BIAS_COMPONENT.toExponential(3), // estimator-bias residual
    curvature_is_dominant: CURVATURE_IS_DOMINANT,
    note:
      'Feeding the NOISELESS fitted quadratic through both estimators yields p_pinned_q > p_free_q and a gap ' +
      'that recovers the large majority of the observed 0.004: the pinned estimator, anchored at the convex ' +
      'curves high-C_mb endpoint, reads the steeper local slope there. Curvature dominates the small ' +
      'anchor-leverage (estimator-bias) residual, so the gap is chiefly a MODEL MISMATCH.',
  },
  finding: {
    F1_curvature_is_real:
      'The quadratic log-log coefficient c = ' + C_Q.toFixed(6) + ' is POSITIVE (convex) and ~' +
      T_C.toFixed(1) + ' SEs from zero; the quadratic term cuts the linear SSE by ~' +
      SSE_REDUCTION_RATIO.toFixed(1) + 'x. ln s* is NOT exactly linear in ln C_mb -- the single power law ' +
      'mildly mis-specifies, matching the imp-34950 F2 local-slope drift [1.528,1.562].',
    F2_curvature_reproduces_the_gap:
      'The noiseless fitted quadratic, run through the pinned and free estimators, gives p_pinned_q > ' +
      'p_free_q with a gap of ' + GAP_FROM_CURVATURE.toExponential(3) + ' -- ~' +
      (100 * FRAC_GAP_EXPLAINED).toFixed(0) + '% of the observed 0.004. The pinned estimator, anchored at ' +
      'the convex curves high-C_mb endpoint (ln C_mb = 0), systematically reads the steeper local slope.',
    F3_verdict_model_mismatch:
      'The ~3-sigma gap is DOMINANTLY a MODEL MISMATCH (genuine mild convexity), NOT primarily an estimator ' +
      'artifact. K-pinning is the LEVER converting convexity into a slope gap (an exact power law would ' +
      'produce none), but the necessary ingredient is the real curvature; the small anchor-leverage residual ' +
      '(~' + ANCHOR_BIAS_COMPONENT.toExponential(2) + ') is the estimator-bias part. So p is a mildly ' +
      'effective exponent: a single 4-digit p over-states the power-law precision -- the imp-34950 CI band ' +
      '[1.5476,1.5511] and the F2 slope band [1.528,1.562] bracket the honest spread.',
  },
  baseline: {
    s_star_at_1: +S_STAR_AT_1.toFixed(6),
    p_pinned_vs_imp34950_absdiff: +P_PINNED_VS_IMP34950.toExponential(3),
    p_free_vs_imp34950_absdiff: +P_FREE_VS_IMP34950.toExponential(3),
  },
  farTailExponent: 0.5, // imp-3463 asymptote
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier, NOT rigorous). Diagnosing the imp-34950 F1 ~3-sigma pinned-vs-free exponent gap ' +
    '(p_pinned = 1.5493 +/- 8.9e-4 vs p_free = 1.5453 +/- 1.2e-3, ~0.004) on the reused 21-point C_mb grid: ' +
    '(F1) a quadratic log-log fit finds a significant POSITIVE (convex) curvature coefficient c = ' +
    C_Q.toFixed(6) + ' (~' + T_C.toFixed(1) + ' SEs from zero; quadratic term cuts the linear SSE by ~' +
    SSE_REDUCTION_RATIO.toFixed(1) + 'x), so ln s* is NOT exactly linear in ln C_mb. (F2) Feeding the ' +
    'NOISELESS fitted quadratic through both estimators reproduces the gap sign and ~' +
    (100 * FRAC_GAP_EXPLAINED).toFixed(0) + '% of its size: the pinned estimator, anchored at the convex ' +
    'curves high-C_mb endpoint (ln C_mb = 0), reads the steeper local slope. (F3) The gap is therefore ' +
    'DOMINANTLY a MODEL MISMATCH (genuine mild convexity), NOT primarily an estimator artifact -- K-pinning ' +
    'is the lever that turns the convexity into a slope gap (an exact power law would produce none), while ' +
    'the small anchor-leverage residual (~' + ANCHOR_BIAS_COMPONENT.toExponential(2) + ') is the ' +
    'estimator-bias part. A single 4-digit p over-states the power-law precision; the imp-34950 CI band ' +
    '[1.5476,1.5511] and the F2 slope band [1.528,1.562] bracket the honest spread. This SWEEPS C_mb as a ' +
    'free knob and does NOT discharge the GUE conditional (C_mb GUE-conditional per imp-486). The component ' +
    'model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_C 1/8 ansatz ' +
    '(imp-2642/imp-2643) is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  subGap:
    'ANSWERS imp-35037: the imp-34950 F1 ~3-sigma pinned-vs-free exponent gap (~0.004) is DOMINANTLY a ' +
    'MODEL MISMATCH -- a genuine mild convexity of ln s* in ln C_mb (quadratic coefficient c = ' +
    C_Q.toFixed(6) + ', ~' + T_C.toFixed(1) + ' SEs from zero, cutting the linear SSE by ~' +
    SSE_REDUCTION_RATIO.toFixed(1) + 'x) -- and NOT primarily an estimator artifact: the noiseless fitted ' +
    'quadratic reproduces ~' + (100 * FRAC_GAP_EXPLAINED).toFixed(0) + '% of the gap because the pinned ' +
    'estimator, anchored at the convex curves high-C_mb endpoint, reads a steeper slope than grid-averaging ' +
    'OLS. K-pinning is the lever, curvature the cause. What stays OPEN (deferred, changes no bound): the ' +
    'MECHANISM of the convexity -- s* entering the landmark-defining log-odds derivatives, not just the ' +
    'sigmoid level (the imp-34992 ~88% transmission deficit) -- and whether the curvature is ' +
    'surrogate-independent or drifts with the imp-3220/imp-3406 extrapolation; and a derivation PINNING ' +
    'C_mb below the GUE bound of 1 (imp-486) would then fix the physical s* via C_mb^p.',
  citation:
    'imp-34950 (the F1 pinned/free exponents whose ~3-sigma gap this diagnoses; grid + s* bisection reused ' +
    'verbatim); imp-34925 (the power-law form s* = K C_mb^p); imp-34994 (resampling SEs for the same ' +
    'exponent); imp-35115 (CI-vs-slope-band reconciliation); imp-3463 (far-tail exponent 1/2); imp-486 ' +
    '(C_mb GUE-conditional); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP35037_PINNED_VS_FREE_EXPONENT_GAP_DIAGNOSIS_ASSERTIONS = [
  {
    // Reuse gate: reproduce the imp-34950 pinned and free exponents on the reused grid.
    id: 'imp35037-reproduces-imp34950-estimators',
    description: 'pinned and free exponents reproduce the imp-34950 F1 values',
    holds: () => P_PINNED_VS_IMP34950 < 1e-3 && P_FREE_VS_IMP34950 < 1e-3,
  },
  {
    // The observed gap is the ~0.004 imp-34950 F1 gap, with the pinned slope steeper.
    id: 'imp35037-observed-gap-sign-and-size',
    description: 'observed pinned-free gap is positive and ~0.004 (pinned steeper than free)',
    holds: () => OBSERVED_GAP > 0 && Math.abs(OBSERVED_GAP - 4e-3) < 3e-3,
  },
  {
    // (F1): the log-log curvature is a real convexity (positive c, many SEs from zero, big SSE cut).
    id: 'imp35037-curvature-is-real',
    description: 'quadratic log-log coefficient c is positive and >> 3 SEs from zero with a large SSE reduction',
    holds: () => C_Q > 0 && T_C > 3 && SSE_REDUCTION_RATIO > 2,
  },
  {
    // (F2): the noiseless fitted quadratic reproduces the gap sign and most of its magnitude.
    id: 'imp35037-curvature-reproduces-gap',
    description: 'curvature-only gap has the observed sign and explains >= 60% of the observed gap',
    holds: () =>
      GAP_FROM_CURVATURE > 0 &&
      FRAC_GAP_EXPLAINED > 0.6 &&
      FRAC_GAP_EXPLAINED < 1.4,
  },
  {
    // (F3): curvature dominates the anchor-leverage estimator-bias residual => model mismatch.
    id: 'imp35037-model-mismatch-dominant',
    description: 'smooth curvature dominates the anchor-leverage estimator-bias residual',
    holds: () => CURVATURE_IS_DOMINANT === true,
  },
  {
    // Honesty gate: measurement only, far-tail exponent = 1/2, sub-gap names imp-486, no QED, no refereed bound is changed.
    id: 'imp35037-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2, sub-gap names imp-486, no QED, no refereed bound is changed',
    holds: () =>
      IMP35037_PINNED_VS_FREE_EXPONENT_GAP_DIAGNOSIS.isRigorous === false &&
      IMP35037_PINNED_VS_FREE_EXPONENT_GAP_DIAGNOSIS.farTailExponent === 0.5 &&
      typeof IMP35037_PINNED_VS_FREE_EXPONENT_GAP_DIAGNOSIS.subGap === 'string' &&
      /imp-486/.test(IMP35037_PINNED_VS_FREE_EXPONENT_GAP_DIAGNOSIS.subGap) &&
      /NO QED/.test(IMP35037_PINNED_VS_FREE_EXPONENT_GAP_DIAGNOSIS.verdict) &&
      /refereed bound is changed/i.test(IMP35037_PINNED_VS_FREE_EXPONENT_GAP_DIAGNOSIS.verdict),
  },
];

for (const a of IMP35037_PINNED_VS_FREE_EXPONENT_GAP_DIAGNOSIS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35037-pinned-vs-free-exponent-gap-diagnosis assertion failed: ${a.id}`);
  }
}
