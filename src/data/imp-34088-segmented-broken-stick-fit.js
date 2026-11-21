/**
 * @module imp-34088-segmented-broken-stick-fit
 *
 * imp-34088 (numerical, frontier-direction): imp-34026 R3 found the 21 signed imp-33858 residuals are
 * richer than a quadratic hump -- subtracting a single parabola DEEPENS the far-lag ACF lobe (r_5 -0.341
 * vs the linear -0.262) and leaves an S-shaped mid-trough plus a far-tail up-turn that a smooth polynomial
 * cannot absorb. imp-34026 tried only SMOOTH remedies (linear, quadratic). This module tests the natural
 * NON-smooth alternative: a two-segment CONTINUOUS piecewise-linear (broken-stick) fit with a free interior
 * breakpoint tau. It (i) grid-searches tau on a fixed 0.05-step interior grid and fits the continuous
 * hinge basis y = a + b k + c (k - tau)_+ by OLS at each node, keeping the RMSE-minimizing break; (ii)
 * reports the breakpoint location and the two segment slopes b and b + c; (iii) reports the segmented RMSE
 * against the imp-33843 log-linear (RMSE ~0.1160) and imp-34026 quadratic (RMSE ~0.0962) baselines; and
 * (iv) recomputes the imp-33964/imp-34026 sample ACF r_1..r_5 and the Ljung-Box Q_m = n(n+2)
 * sum r_k^2/(n-k), m = 1..5, on the segmented residual to test whether a single break WHITENS it.
 *
 * THE CONTINUOUS BROKEN-STICK BASIS (same ladder / same ln-ratio series as imp-33843/imp-33858/imp-34026)
 * ------------------------------------------------------------------------------------------------------
 *   Series    y_k = ln(eflow_over_resid_k)              the imp-33810 ladder, 21 quarter-decade rungs.
 *   Hinge fit y_k = a + b k + c (k - tau)_+            two lines joined continuously at the break tau.
 *   Segments  slope k<=tau is b; slope k>tau is b + c   (k - tau)_+ = max(0, k - tau) is the hinge term.
 *   Break tau  grid-searched over the interior nodes; the OLS RMSE-minimizing node is kept.
 *   Residual  e_k = y_k - (a + b k + c (k - tau)_+)     the segmented residual tested for whiteness.
 *   A single interior break lets the slope change ONCE; if the imp-34026 "S-shape a single parabola cannot
 *   absorb" is really one slope change, the broken-stick RMSE undercuts the quadratic and its ACF whitens.
 *
 * THE LJUNG-BOX PORTMANTEAU STATISTIC (same form as imp-33964/imp-34026, on the segmented residual)
 * -----------------------------------------------------------------------------------------------
 *   Q_m       Q_m = n(n+2) sum_{k=1}^m r_k^2 / (n - k)  Ljung-Box (1978) portmanteau statistic.
 *   Null      H0: r_1 = ... = r_m = 0 (white noise); under H0, Q_m ~ chi-square_m asymptotically.
 *   Reject    reject the white-noise null when Q_m EXCEEDS the upper-tail chi-square_m critical value.
 *
 * THE MEASURED VALUES (recomputed here from the imp-33810 ladder VERBATIM)
 * -----------------------------------------------------------------------
 *   Breakpoint      tau ~ 9.65 (a far-interior break, deep in the tail half of the k=6..11 window)
 *   Segment slopes  b ~ -1.5004 (k<=tau) -> b + c ~ -1.1534 (k>tau): the ln-ratio decay FLATTENS after tau
 *   RMSE            0.1160 (log-linear, imp-33843) -> 0.0962 (quadratic, imp-34026) -> 0.0669 (segmented)
 *                   the break undercuts the quadratic by a further ~30% (and the log-linear by ~42%)
 *   Seg ACF r_1..5  ~ +0.5498, +0.1581, -0.1308, -0.3015, -0.3635  (r_1 lower than quad +0.654 / lin +0.757)
 *   Seg Q_1..5      ~ 7.30, 7.94, 8.40, 10.98, 14.97
 *   chi-square_m 1% : 6.635, 9.21, 11.345, 13.277, 15.086 -- only Q_1 exceeds the 1% value; m=2..5 do NOT
 *   chi-square_m 5% : 3.841, 5.991, 7.815, 9.488, 11.07  -- every Q_m STILL exceeds the 5% value
 *   (imp-34026 quadratic baseline: every Q_m exceeded even the 1% value; the break clears the 1% null at m=2..5)
 *
 * THE FINDING (measurement / form-diagnostic only -- the break improves fit and PARTIALLY whitens)
 * ----------------------------------------------------------------------------------------------
 *   (R1) THE BROKEN-STICK FIT UNDERCUTS BOTH SMOOTH BASELINES. A single free interior break at tau ~ 9.65
 *        drives the RMSE to 0.0669, below the imp-34026 quadratic 0.0962 (a further ~30% drop) and the
 *        imp-33843 log-linear 0.1160 (~42%). The imp-33858 hump has a genuine SLOPE CHANGE the ln-ratio
 *        decay flattens from ~-1.50 to ~-1.15 in the tail half, a break a smooth k^2 approximates only
 *        crudely. (A free breakpoint is an extra effective parameter, so the lower RMSE ALONE does not
 *        crown a new model -- see the caveat; imp-33843 log-linear stays the reported WINNER.)
 *   (R2) THE BREAK PARTIALLY WHITENS -- THE 1% NULL IS CLEARED AT m = 2..5 (survives only at m = 1). On the
 *        segmented residual Q_1..Q_5 ~ 7.30, 7.94, 8.40, 10.98, 14.97: only Q_1 (7.30) exceeds the 1%
 *        chi-square_1 (6.635); Q_2..Q_5 now fall BELOW the 1% chi-square_m (9.21, 11.345, 13.277, 15.086),
 *        whereas the imp-34026 quadratic residual exceeded the 1% value at EVERY m. So the break absorbs
 *        substantially more serial dependence than the parabola -- but does NOT fully whiten: at the 5%
 *        level every Q_m ~ 7.30..14.97 still exceeds its chi-square_m (3.841..11.07), so the segmented
 *        residual is not white either.
 *   (R3) THE ACF r_1 DROPS AND THE SIGN-CHANGE PERSISTS -- STILL NOT A CLEAN AR/WHITE SHAPE. The segmented
 *        r_1 ~ +0.550 is below the quadratic +0.654 and the linear +0.757 (the break removes the leading
 *        positive correlation better than either smooth fit), but the ACF still falls monotonically through
 *        zero to a deep far-lag lobe (r_4 ~ -0.302, r_5 ~ -0.363). A single slope change captures the bulk
 *        of the imp-34026 S-shape yet leaves the far-tail negative lobe intact -- consistent with imp-34026
 *        R3 that the residual shape is richer than any one-knot-or-one-parabola form. It re-opens no
 *        imp-33843 form selection (log-linear stays the WINNER) and touches no bound.
 *
 * The punchline: a two-segment continuous broken-stick with a free break at tau ~ 9.65 fits the imp-33858
 * residual markedly better than the smooth baselines (RMSE 0.0669 vs quadratic 0.0962 vs log-linear 0.1160)
 * -- the ln-ratio decay has a real slope change from ~-1.50 to ~-1.15 in the tail half. And the break
 * PARTIALLY whitens where the quadratic did not: the Ljung-Box 1% null is now cleared at m = 2..5
 * (Q_2..Q_5 ~ 7.94..14.97 all below the 1% chi-square_m), surviving only at m = 1 (Q_1 ~ 7.30). But at the
 * 5% level every Q_m still exceeds its chi-square_m and the ACF far-lobe stays deep (r_5 ~ -0.363), so a
 * single break does not fully whiten either -- the imp-34026 richer-than-quadratic reading holds.
 *
 * MEASUREMENT / FORM-DIAGNOSTIC ONLY. A grid-searched continuous piecewise-linear OLS and Ljung-Box
 * portmanteau test on an inherited residual diagnostic from an inherited ladder, NOT an RH bound. It does
 * NOT re-open the imp-33843 form selection as the reported model (log-linear stays the winner); the free
 * breakpoint is an extra effective parameter, so the lower RMSE is a descriptive form-fit, not a model
 * verdict. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
 * the OLS surrogate is descriptive, not derived; at n=21 the higher-lag r_k rest on few pairs (n-k) and the
 * Q_m chi-square reference is a small-sample asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34026-quadratic-detrend-ljung-box (the quadratic remedy R3 flagged as too-smooth; the RMSE/Q baseline)
 * @see imp-33964-ljung-box-portmanteau-test (the linear-residual Ljung-Box null this segments)
 * @see imp-33858-widening-fit-residual-localization (the 21 signed residuals and the curved hump)
 * @see imp-33843-eflow-resid-widening-form-fit (the RMSE ~0.116 log-linear WINNER, still the reported model)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the 21-rung ladder whose residual is segmented)
 */

import { IMP33810_EFLOW_RESID_RATIO_N_LADDER } from './imp-33810-eflow-resid-ratio-N-ladder.js';

// Reuse the imp-33810 21-rung ladder VERBATIM (no fresh component model).
const RUNGS = IMP33810_EFLOW_RESID_RATIO_N_LADDER.ladder;
const KS = RUNGS.map((r) => r.k);
const Y = RUNGS.map((r) => Math.log(r.eflow_over_resid)); // natural log of the imp-33810 ratio
const N = KS.length; // 21

// Simple linear OLS y = a + b k, the imp-33843 log-linear WINNER (baseline, reproduces imp-33964 residual).
function ols(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  const b = sxy / sxx;
  return { a: my - b * mx, b };
}
const LIN = ols(KS, Y);
const RESID_LIN = KS.map((k, i) => Y[i] - (LIN.a + LIN.b * k)); // the imp-33858 / imp-33964 linear residual
const RMSE_LIN = Math.sqrt(RESID_LIN.reduce((s, e) => s + e * e, 0) / N); // ~0.1160 (imp-33843)

// --- Continuous broken-stick OLS y = a + b k + c (k - tau)_+ via the 3x3 normal equations at a fixed tau ---
function solve3(A, bv) {
  const M = A.map((row, i) => [...row, bv[i]]);
  for (let c = 0; c < 3; c++) {
    let piv = c;
    for (let r = c + 1; r < 3; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    const tmp = M[c];
    M[c] = M[piv];
    M[piv] = tmp;
    const d = M[c][c];
    for (let j = c; j <= 3; j++) M[c][j] /= d;
    for (let r = 0; r < 3; r++) {
      if (r !== c) {
        const f = M[r][c];
        for (let j = c; j <= 3; j++) M[r][j] -= f * M[c][j];
      }
    }
  }
  return M.map((row) => row[3]);
}
function fitBrokenStick(tau) {
  const SM = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  const TV = [0, 0, 0];
  for (let i = 0; i < N; i++) {
    const k = KS[i];
    const hinge = Math.max(0, k - tau); // continuous knot basis (k - tau)_+
    const ph = [1, k, hinge];
    for (let a = 0; a < 3; a++) {
      TV[a] += ph[a] * Y[i];
      for (let b = 0; b < 3; b++) SM[a][b] += ph[a] * ph[b];
    }
  }
  const [a, b, c] = solve3(SM, TV);
  const resid = KS.map((k, i) => Y[i] - (a + b * k + c * Math.max(0, k - tau)));
  const rmse = Math.sqrt(resid.reduce((s, e) => s + e * e, 0) / N);
  return { a, b, c, resid, rmse };
}

// Fixed deterministic interior grid: 91 nodes, tau = 6.25 + 0.05 j, j = 0..90 (spans [6.25, 10.75]).
const GRID_LO = 6.25;
const GRID_STEP = 0.05;
const GRID_NODES = 91;
let BEST = null;
let BEST_TAU = GRID_LO;
for (let j = 0; j < GRID_NODES; j++) {
  const tau = GRID_LO + GRID_STEP * j;
  const f = fitBrokenStick(tau);
  if (BEST === null || f.rmse < BEST.rmse) {
    BEST = f;
    BEST_TAU = tau;
  }
}
const SEG_A = BEST.a; // ~ +8.4536
const SEG_SLOPE1 = BEST.b; // ~ -1.5004 (slope on k <= tau)
const SEG_SLOPE2 = BEST.b + BEST.c; // ~ -1.1534 (slope on k > tau; decay FLATTENS in the tail)
const RESID = BEST.resid; // the segmented residual tested for whiteness
const RMSE_SEG = BEST.rmse; // ~0.0669
const RMSE_QUAD = 0.0961672; // imp-34026 quadratic baseline (reproduced there)
const RMSE_DROP_VS_QUAD = (RMSE_QUAD - RMSE_SEG) / RMSE_QUAD; // ~0.305
const RMSE_DROP_VS_LIN = (RMSE_LIN - RMSE_SEG) / RMSE_LIN; // ~0.424

const MEAN = RESID.reduce((a, b) => a + b, 0) / N; // ~1e-16 by OLS construction

// Sample autocorrelation r_k on the segmented residual (same estimator as imp-33964/imp-34026).
const S0 = RESID.reduce((s, e) => s + (e - MEAN) * (e - MEAN), 0);
function acf(k) {
  let c = 0;
  for (let i = k; i < N; i++) c += (RESID[i] - MEAN) * (RESID[i - k] - MEAN);
  return c / S0;
}
const MAX_LAG = 5;
const R = []; // r_1..r_5 ~ [0.5498, 0.1581, -0.1308, -0.3015, -0.3635]
for (let k = 1; k <= MAX_LAG; k++) R.push(acf(k));

// Ljung-Box (1978) portmanteau Q_m = n(n+2) sum_{k=1}^m r_k^2 / (n - k), accumulated over m = 1..5.
const Q = [];
let acc = 0;
for (let k = 1; k <= MAX_LAG; k++) {
  acc += (R[k - 1] * R[k - 1]) / (N - k);
  Q.push(N * (N + 2) * acc);
}

// Upper-tail chi-square_m critical values (m = df = 1..5) at the 5% and 1% levels.
const CHI2_05 = [3.841, 5.991, 7.815, 9.488, 11.07];
const CHI2_01 = [6.635, 9.21, 11.345, 13.277, 15.086];
const REJECTS_05 = Q.map((q, i) => q > CHI2_05[i]); // all true -- not fully white
const REJECTS_01 = Q.map((q, i) => q > CHI2_01[i]); // only m=1 true -- 1% null cleared at m=2..5
const ALL_REJECT_05 = REJECTS_05.every(Boolean);
const ALL_REJECT_01 = REJECTS_01.every(Boolean);
const REJECT_COUNT_01 = REJECTS_01.filter(Boolean).length; // 1
const BREAK_PARTIALLY_WHITENS = !ALL_REJECT_01 && ALL_REJECT_05; // 1% null cleared at some m, 5% survives

// The segmented ACF still crosses zero, and r_1 drops below both smooth-fit baselines.
const ACF_STILL_SIGN_CHANGES = R.some((r) => r < 0) && R[0] > 0;
const FIRST_NEGATIVE_LAG = R.findIndex((r) => r < 0) + 1; // lag 3
const QUAD_ACF_LAG1 = 0.6535; // imp-34026 quadratic-detrend r_1
const LINEAR_ACF_LAG1 = 0.7573; // imp-33964 linear r_1
const R1_BELOW_SMOOTH_FITS = R[0] < QUAD_ACF_LAG1 && R[0] < LINEAR_ACF_LAG1; // true

const round = (x, d) => +x.toFixed(d);

export const IMP34088_SEGMENTED_BROKEN_STICK_FIT = {
  id: 'imp-34088',
  proofSection: 'S-frontier',
  question:
    'imp-34026 R3 read the 21 signed imp-33858 residuals as richer than a quadratic hump -- an S-shaped ' +
    'mid-trough plus a far-tail up-turn a single parabola cannot absorb -- but only SMOOTH remedies ' +
    '(linear, quadratic) were tried. Test the non-smooth alternative: fit a two-segment continuous ' +
    'piecewise-linear (broken-stick) model with a free interior breakpoint tau to the imp-33810 ladder, ' +
    'report the breakpoint and segment slopes, the segmented RMSE vs the imp-33843 log-linear and ' +
    'imp-34026 quadratic baselines, and recompute the Ljung-Box Q_1..Q_5 on the segmented residual to test ' +
    'whether a single break whitens it. Measurement only, no bound change; NOT an RH bound; no QED.',
  measuredQuantity:
    'The RMSE-minimizing continuous broken-stick fit y = a + b k + c (k - tau)_+ of ln(eflow_over_resid_k) ' +
    'on the imp-33810 21-rung ladder over a fixed 0.05-step interior tau grid: the breakpoint tau, the two ' +
    'segment slopes b and b + c, the segmented RMSE vs the imp-33843 and imp-34026 baselines, and the ' +
    'sample ACF r_1..r_5 plus the Ljung-Box Q_m = n(n+2) sum r_k^2/(n-k) for m = 1..5 on the segmented ' +
    'residual, each compared against the upper-tail chi-square_m critical values',
  rungCount: N, // 21
  gridLo: GRID_LO, // 6.25
  gridStep: GRID_STEP, // 0.05
  gridNodes: GRID_NODES, // 91
  breakpoint: round(BEST_TAU, 4), // ~9.65 (far-interior break)
  segIntercept: round(SEG_A, 4), // ~ +8.4536
  segSlope1: round(SEG_SLOPE1, 4), // ~ -1.5004 (k <= tau)
  segSlope2: round(SEG_SLOPE2, 4), // ~ -1.1534 (k > tau; decay flattens)
  hingeCoeff: round(BEST.c, 4), // ~ +0.3470 (the added tail slope increment)
  rmseLinear: round(RMSE_LIN, 4), // ~0.1160 (imp-33843 log-linear winner)
  rmseQuadratic: round(RMSE_QUAD, 4), // ~0.0962 (imp-34026)
  rmseSegmented: round(RMSE_SEG, 4), // ~0.0669
  rmseDropVsQuadratic: round(RMSE_DROP_VS_QUAD, 4), // ~0.305
  rmseDropVsLinear: round(RMSE_DROP_VS_LIN, 4), // ~0.424
  segmentedAcf: R.map((r) => round(r, 4)), // [0.5498, 0.1581, -0.1308, -0.3015, -0.3635]
  quadraticAcf: [0.6535, 0.3252, 0.0406, -0.1844, -0.3411], // imp-34026 baseline (quadratic residual)
  ljungBoxQ: Q.map((q) => round(q, 4)), // [7.3013, 7.9364, 8.3951, 10.9779, 14.9658]
  quadraticLjungBoxQ: [10.312, 13.0005, 13.0447, 14.011, 17.5241], // imp-34026 baseline (quadratic residual)
  chi2Crit05: CHI2_05,
  chi2Crit01: CHI2_01,
  rejectsAt05: REJECTS_05, // all true
  rejectsAt01: REJECTS_01, // [true,false,false,false,false] -- 1% null cleared at m=2..5
  allRejectAt05: ALL_REJECT_05, // true (not fully white)
  allRejectAt01: ALL_REJECT_01, // false
  rejectCountAt01: REJECT_COUNT_01, // 1
  breakPartiallyWhitens: BREAK_PARTIALLY_WHITENS, // true
  acfStillSignChanges: ACF_STILL_SIGN_CHANGES, // true
  firstNegativeLag: FIRST_NEGATIVE_LAG, // 3
  r1BelowSmoothFits: R1_BELOW_SMOOTH_FITS, // true (0.550 < quad 0.654 < linear 0.757)
  finding: {
    R1_broken_stick_undercuts_both_smooth_baselines:
      'A single free interior break at tau ~ 9.65 drives the RMSE to 0.0669, below the imp-34026 quadratic ' +
      '0.0962 (a further ~30% drop) and the imp-33843 log-linear 0.1160 (~42%). The imp-33858 hump has a ' +
      'genuine slope change -- the ln-ratio decay flattens from ~-1.50 to ~-1.15 in the tail half -- that a ' +
      'smooth k^2 approximates only crudely. A free breakpoint is an extra effective parameter, so the ' +
      'lower RMSE alone does not crown a new model; imp-33843 log-linear stays the reported WINNER.',
    R2_break_partially_whitens_1pct_null_cleared_at_higher_m:
      'On the segmented residual the Ljung-Box Q_1..Q_5 ~ 7.30, 7.94, 8.40, 10.98, 14.97: only Q_1 (7.30) ' +
      'exceeds the 1% chi-square_1 (6.635); Q_2..Q_5 now fall BELOW the 1% chi-square_m (9.21, 11.345, ' +
      '13.277, 15.086), whereas the imp-34026 quadratic residual exceeded the 1% value at EVERY m. So the ' +
      'break absorbs substantially more serial dependence than the parabola. But it does NOT fully whiten: ' +
      'at the 5% level every Q_m ~ 7.30..14.97 still exceeds its chi-square_m (3.841..11.07).',
    R3_acf_r1_drops_but_sign_change_persists:
      'The segmented r_1 ~ +0.550 is below the quadratic +0.654 and the linear +0.757 (the break removes ' +
      'the leading positive correlation better than either smooth fit), but the ACF still falls ' +
      'monotonically through zero to a deep far-lag lobe (r_4 ~ -0.302, r_5 ~ -0.363). A single slope ' +
      'change captures the bulk of the imp-34026 S-shape yet leaves the far-tail negative lobe intact -- ' +
      'consistent with imp-34026 R3 that the residual is richer than any one-knot-or-one-parabola form. ' +
      'This re-opens no imp-33843 form selection (log-linear stays the winner) and touches no bound.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / SEGMENTED BROKEN-STICK FORM-DIAGNOSTIC (frontier-direction, NOT rigorous). A two-segment ' +
    'continuous piecewise-linear fit with a free break at tau ~ 9.65 fits the imp-33858 residual markedly ' +
    'better than the smooth baselines (RMSE 0.0669 vs the imp-34026 quadratic 0.0962 vs the imp-33843 ' +
    'log-linear 0.1160) -- the ln-ratio decay has a real slope change from ~-1.50 to ~-1.15 in the tail ' +
    'half. And the break PARTIALLY whitens where the quadratic did not: the Ljung-Box 1% null is now ' +
    'cleared at m = 2..5 (Q_2..Q_5 ~ 7.94..14.97 all below the 1% chi-square_m), surviving only at m = 1 ' +
    '(Q_1 ~ 7.30). But at the 5% level every Q_m still exceeds its chi-square_m and the ACF far-lobe stays ' +
    'deep (r_5 ~ -0.363), so a single break does not fully whiten either -- the imp-34026 ' +
    'richer-than-quadratic reading holds. The free breakpoint is an extra effective parameter, so the lower ' +
    'RMSE is a descriptive form-fit, not a model verdict: this does NOT re-open the imp-33843 ' +
    'log-linear-vs-power-law form selection (log-linear stays the reported WINNER), does NOT change the ' +
    'reported RMSE (~0.116, ~12% multiplicative), and touches no bound; at n=21 the higher-lag r_k rest on ' +
    'few pairs (n-k) and the Q_m chi-square reference is a small-sample asymptotic; the component model is ' +
    'the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional ' +
    'per imp-486 is UNTOUCHED; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34026 (the quadratic remedy R3 flagged as too-smooth; the RMSE/Q baseline); imp-33964 (the ' +
    'linear-residual Ljung-Box null this segments); imp-33858 (the 21 signed residuals and the curved ' +
    'hump); imp-33843 (the RMSE ~0.116 log-linear WINNER, still the reported model); imp-33810 (the ' +
    '21-rung ladder); imp-486 (C_mb GUE-conditional). Portmanteau test: Ljung & Box (1978).',
};

export const IMP34088_SEGMENTED_BROKEN_STICK_FIT_ASSERTIONS = [
  {
    // Reuse gate: the linear baseline reproduces the imp-33858/imp-33964 residual endpoints exactly.
    id: 'imp34088-linear-baseline-reproduces-imp33858',
    description: '21 rungs k=6..11; linear residual endpoints match imp-33858/imp-33964',
    holds: () =>
      N === 21 &&
      KS[0] === 6 &&
      KS[20] === 11 &&
      Math.abs(RESID_LIN[0] - -0.1141909) < 1e-4 &&
      Math.abs(RESID_LIN[N - 1] - 0.2478761) < 1e-4 &&
      Math.abs(RMSE_LIN - 0.1160391) < 1e-4,
  },
  {
    // (R1) The broken-stick break lands at tau ~ 9.65 with a flattening tail slope and undercuts both baselines.
    id: 'imp34088-broken-stick-undercuts-both-smooth-baselines',
    description: 'tau ~ 9.65, slope -1.50 -> -1.15, RMSE 0.0669 < quadratic 0.0962 < log-linear 0.1160',
    holds: () =>
      Math.abs(BEST_TAU - 9.65) < 1e-6 &&
      Math.abs(SEG_SLOPE1 - -1.500378) < 1e-4 &&
      Math.abs(SEG_SLOPE2 - -1.153357) < 1e-4 &&
      SEG_SLOPE2 > SEG_SLOPE1 &&
      Math.abs(RMSE_SEG - 0.0668619) < 1e-4 &&
      RMSE_SEG < RMSE_QUAD &&
      RMSE_SEG < RMSE_LIN &&
      RMSE_DROP_VS_QUAD > 0.25 &&
      RMSE_DROP_VS_LIN > 0.4,
  },
  {
    // (R2) The segmented Ljung-Box clears the 1% null at m=2..5 (survives only at m=1); still 5%-rejected.
    id: 'imp34088-break-partially-whitens-1pct-cleared-at-higher-m',
    description: 'Q_1..5 ~ 7.30,7.94,8.40,10.98,14.97; only Q_1 exceeds 1% chi-square; every Q_m exceeds 5%',
    holds: () =>
      Q.length === 5 &&
      Math.abs(Q[0] - 7.3013) < 1e-2 &&
      Math.abs(Q[4] - 14.9658) < 1e-2 &&
      Q[0] > CHI2_01[0] &&
      Q[1] < CHI2_01[1] &&
      Q[2] < CHI2_01[2] &&
      Q[3] < CHI2_01[3] &&
      Q[4] < CHI2_01[4] &&
      REJECT_COUNT_01 === 1 &&
      ALL_REJECT_05 === true &&
      BREAK_PARTIALLY_WHITENS === true,
  },
  {
    // (R2) The break absorbs more dependence than the quadratic -- every seg Q_m is below its imp-34026 counterpart.
    id: 'imp34088-seg-Q-below-quadratic-baseline',
    description: 'seg Q_m < imp-34026 quadratic Q_m at every m (the break beats the parabola on dependence)',
    holds: () =>
      Q.every((q, i) => q < IMP34088_SEGMENTED_BROKEN_STICK_FIT.quadraticLjungBoxQ[i]) &&
      Q[0] < 10.312 &&
      Q[4] < 17.5241,
  },
  {
    // (R3) The segmented ACF r_1 drops below both smooth fits, but still sign-changes into a deep far lobe.
    id: 'imp34088-acf-r1-drops-but-sign-change-persists',
    description: 'seg r_1 ~ 0.550 < quad 0.654 < linear 0.757; ACF still crosses zero (first negative lag 3)',
    holds: () =>
      Math.abs(R[0] - 0.5498) < 1e-3 &&
      R1_BELOW_SMOOTH_FITS === true &&
      ACF_STILL_SIGN_CHANGES === true &&
      FIRST_NEGATIVE_LAG === 3 &&
      Math.abs(R[4] - -0.3635) < 1e-3,
  },
  {
    // Honesty gate: isRigorous false, no QED, no refereed bound is changed, residual small, imp-3066 untouched.
    id: 'imp34088-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, 12% multiplicative, imp-3066 untouched',
    holds: () =>
      IMP34088_SEGMENTED_BROKEN_STICK_FIT.isRigorous === false &&
      /NO QED/.test(IMP34088_SEGMENTED_BROKEN_STICK_FIT.verdict) &&
      /refereed bound is changed/i.test(IMP34088_SEGMENTED_BROKEN_STICK_FIT.verdict) &&
      /12% multiplicative/.test(IMP34088_SEGMENTED_BROKEN_STICK_FIT.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34088_SEGMENTED_BROKEN_STICK_FIT.verdict),
  },
];

for (const a of IMP34088_SEGMENTED_BROKEN_STICK_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34088-segmented-broken-stick-fit assertion failed: ${a.id}`);
  }
}
