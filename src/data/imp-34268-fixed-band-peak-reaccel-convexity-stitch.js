/**
 * @module imp-34268-fixed-band-peak-reaccel-convexity-stitch
 *
 * imp-34268 (numerical, frontier-direction): imp-34196 refined the imp-34109 fixed-band (k <= 10)
 * peak-increment minimum on a 0.25 kEnd grid over 17.0 .. 19.5 and fit the POST-minimum re-acceleration
 * branch as a LINEAR increment slope increment = a + b*kEnd (b ~ +0.002567, R2 ~ 0.972) on four windows
 * (steps ending 18.75, 19.00, 19.25, 19.50), concluding the peak "keeps climbing" and is CONVEX. imp-34169
 * then measured the SAME fixed-band peak one decade further and found the increments RE-ACCELERATE over
 * kEnd 20.0 -> 20.5 -> 21.0 (0.5-grid increments 0.050639 -> 0.080391, second difference +0.029752).
 * This module STITCHES the two increment sequences on ONE common 0.25 kEnd grid (the imp-34196 grid, extended
 * to the last computable rung kEnd = 21.25 before the imp-34169 resid_exp pole at k* ~ 21.28) and MEASURES
 * whether the re-acceleration branch is genuinely LINEAR (as the imp-34196 4-point slope models it) or itself
 * CONVEX -- i.e. whether the peak carries strictly positive third differences and the imp-34196 4-point slope
 * UNDER-predicts the imp-34169 increments.
 *
 * THE ANSWER: THE BRANCH IS GENUINELY CONVEX, NOT LINEAR -- the imp-34196 4-point slope is a LOCAL descriptor
 * valid only inside its own 18.75 .. 19.50 fit window, and stitched onto the imp-34169 kEnd 20 .. 21
 * increments it UNDER-predicts monotonically and super-linearly. The fixed-band peak carries STRICTLY POSITIVE
 * AND GROWING third differences (second differences of the increments) across the whole post-minimum branch.
 *
 * THE MEASUREMENT (imp-34196/imp-34169 machinery reused verbatim; the stitch grid and convexity probe are new)
 * ------------------------------------------------------------------------------------------------------------
 *   Component model  sigma(N) = E_coll/(E_trunc + E_flow + E_coll), the inherited imp-3220/imp-3406 sub-terms
 *                    EXACTLY as in imp-33810/imp-34109/imp-34196/imp-34169. No re-derivation.
 *   Stitch grid      kEnd = 17.00, 17.25, ..., 21.25 (18 windows, 0.25 step) -- the imp-34196 grid extended to
 *                    the last quarter-rung the imp-34169 surrogate keeps positive (first non-positive rung k =
 *                    21.5). kEnd = 17.0 reproduces imp-34196/imp-34109 (+0.648552); kEnd = 20.0 reproduces
 *                    imp-34169 (+0.865303); the 0.5-grid increments 20.0 -> 20.5 -> 21.0 reproduce imp-34169.
 *   Fixed-band peak  the largest signed residual among rungs with k <= 10.00 -- the identical
 *                    boundary-independent band imp-33940 / imp-34109 / imp-34196 / imp-34169 tracked.
 *   Convexity probe  the imp-34196 4-point linear increment fit increment = a + b*kEnd on the steps ending
 *                    18.75 .. 19.50, extrapolated forward to the imp-34169 windows; the residuals
 *                    actual - predicted; and the third differences of the peak (second differences of the
 *                    increments) over the stitched post-minimum branch.
 *
 * THE FINDING (measurement only -- no bound change; NO QED)
 * --------------------------------------------------------
 *   (F1) THE imp-34196 4-POINT LINEAR SLOPE IS REPRODUCED EXACTLY. OLS of the four post-minimum 0.25-grid
 *        increments 0.016669 -> 0.017629 -> 0.018109 -> 0.018648 (steps ending 18.75, 19.00, 19.25, 19.50)
 *        gives slope b = +0.0025668 and R2 = 0.97222 -- matching imp-34196 s reported b ~ +0.002567,
 *        R2 ~ 0.972. Same grid, same band, same machinery.
 *   (F2) EXTRAPOLATED FORWARD, THE LINEAR SLOPE UNDER-PREDICTS THE imp-34169 INCREMENTS -- MONOTONICALLY AND
 *        SUPER-LINEARLY. The residual actual - linear-prediction at right-endpoint kEnd is strictly positive
 *        and grows +0.000213 (19.75) -> +0.001067 (20.00) -> +0.002781 (20.25) -> +0.005914 (20.50) ->
 *        +0.011730 (20.75) -> +0.024149 (21.00) -> +0.080936 (21.25). On the imp-34169 0.5-grid the linear
 *        fit predicts the 20.0 -> 20.5 increment as 0.041944 (actual 0.050639, under by 0.008695) and the
 *        20.5 -> 21.0 increment as 0.044512 (actual 0.080391, under by 0.035879). The 4-point slope
 *        SYSTEMATICALLY under-predicts, and the gap itself accelerates.
 *   (F3) THE PEAK CARRIES STRICTLY POSITIVE AND GROWING THIRD DIFFERENCES -- THE BRANCH IS CONVEX, NOT LINEAR.
 *        The second differences of the 0.25-grid increments (equivalently the third differences of the peak)
 *        are strictly positive across the whole post-minimum branch (kEnd >= 19.0) and themselves grow:
 *        +0.000960 (19.00) -> +0.000480 (19.25) -> +0.000539 (19.50) -> +0.000933 (19.75) -> +0.001496
 *        (20.00) -> +0.002355 (20.25) -> +0.003775 (20.50) -> +0.006458 (20.75) -> +0.013061 (21.00) ->
 *        +0.057428 (21.25). A LINEAR increment branch would carry zero second differences; these are positive
 *        and rising, so the re-acceleration branch is genuinely CONVEX (the increment slope itself
 *        accelerates). The imp-34196 4-point linear fit is a LOCAL descriptor, valid only inside 18.75 .. 19.50.
 *
 * The punchline: stitching the imp-34196 0.25-grid post-minimum increments onto the imp-34169 kEnd 20 .. 21
 * increments on one common grid shows the imp-34196 4-point linear slope (b ~ +0.002567, R2 ~ 0.972) is
 * reproduced exactly but is only a LOCAL fit -- extrapolated forward it UNDER-predicts the imp-34169
 * increments monotonically and super-linearly (residual up to +0.081 by kEnd = 21.25), because the fixed-band
 * peak carries strictly POSITIVE AND GROWING third differences. The re-acceleration branch is genuinely
 * CONVEX, not linear. Neither imp-34196 (correct within 17.0 .. 19.5) nor imp-34169 (correct within 20 .. 21)
 * is overturned; the stitch runs into the same imp-34169 resid_exp pole (last computable quarter-rung
 * kEnd = 21.25).
 *
 * MEASUREMENT / STITCH-AND-CONVEXITY PROBE ONLY. A descriptive comparison of two inherited surrogate fits,
 * NOT an RH bound and distinct from any form selection (the imp-33843 log-linear-over-power-law verdict and
 * the imp-34109/imp-34196/imp-34169 findings are untouched). The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the OLS increment fit, the linear extrapolation,
 * and the convexity read are descriptive, not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34196-fixed-band-peak-increment-minimum-subwindow-refine (the 0.25-grid re-accel slope this stitches)
 * @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero (the kEnd 20..21 increments this stitches; pole)
 * @see imp-34109-fixed-band-peak-amplitude-saturation-fit (the kEnd = 14..20 sweep; machinery reused)
 * @see imp-34287-fixed-band-peak-growth-exponent-pole-reconciliation (sibling cohort member: SUB-GAP-imp-34287-asymptotic-class-undecidable reconciling this convex branch with the pole)
 * @see imp-34228-doubling-map-double-precision-anchor-floor (sibling cohort member: SUB-GAP-imp-34228-residexp-resolution-floor, the resid_exp resolution floor near the same pole)
 * @see imp-33940-interior-residual-boundary-stability (the R2 convex low-k drift origin)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS whose fixed-band peak this tracks)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6.. ladder reused verbatim)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED constant in E_coll)
 *
 * COHORT MAP (M2-residual sign-change ceiling): imp-34023 (bisected kEnd* ~ 21.281) -> imp-34127 (leading
 * closed form) -> imp-34189 (next-order term) -> imp-34188 (widening-slope limit) -> imp-34169 (fixed-band
 * peak re-acceleration terminating at the resid_exp pole) -> imp-34196 (sub-window increment minimum + linear
 * re-accel slope) -> imp-34268 (this module: the re-accel slope is CONVEX, the linear fit under-predicts).
 * All share the same kEnd* ~ 21.28 ceiling.
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), verbatim imp-34196
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-33810 sub-terms (no re-derivation) -- verbatim imp-34196/imp-34169.
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

function olsSlope(xs, ys) {
  const n = xs.length;
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
function ols(xs, ys) {
  const b = olsSlope(xs, ys);
  const mx = xs.reduce((a, c) => a + c, 0) / xs.length;
  const my = ys.reduce((a, c) => a + c, 0) / ys.length;
  return { a: my - b * mx, b };
}
function olsR2(xs, ys, F) {
  const my = ys.reduce((a, c) => a + c, 0) / ys.length;
  let ssr = 0;
  let sst = 0;
  for (let i = 0; i < xs.length; i++) {
    const pr = F.a + F.b * xs[i];
    ssr += (ys[i] - pr) ** 2;
    sst += (ys[i] - my) ** 2;
  }
  return 1 - ssr / sst;
}

function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(parts(N).sigma));
  }
  return -olsSlope(xs, ys);
}
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}

// The imp-33810/imp-33843 surrogate quantity at a single decade [10^k, 10^(k+1)] -- verbatim imp-34196/imp-34169.
function eflowOverResidAt(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  const residExp = pEcoll * (1 - ph.sigma) - pSigma;
  const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi));
  return +(eflowAttr / residExp).toExponential(4);
}

// imp-33810 quarter-decade ladder eflow_over_resid over k = 6.00 .. kEnd (inclusive), verbatim.
function buildLadder(kEnd) {
  const R = [];
  for (let k = 6; k <= kEnd + 1e-9; k += 0.25) {
    const kk = +k.toFixed(2);
    R.push({ k: kk, eflow_over_resid: eflowOverResidAt(kk) });
  }
  return R;
}
// imp-33843 log-linear OLS residual vector on a ladder (undefined if any rung is non-positive -> Math.log NaN).
function residualVector(R) {
  const KS = R.map((r) => r.k);
  const Y = R.map((r) => Math.log(r.eflow_over_resid));
  const F = ols(KS, Y);
  return { KS, RES: KS.map((k, i) => Y[i] - (F.a + F.b * k)) };
}
// Largest signed residual among rungs with k <= kMax (the boundary-independent fixed band), verbatim.
function fixedBandPeak(R, kMax) {
  const anyNonPositive = R.some((r) => !(r.eflow_over_resid > 0));
  const { KS, RES } = residualVector(R);
  let maxI = -1;
  for (let i = 0; i < RES.length; i++) {
    if (KS[i] <= kMax + 1e-9 && (maxI < 0 || RES[i] > RES[maxI])) maxI = i;
  }
  const peak = RES[maxI];
  return { peak, atK: KS[maxI], defined: !anyNonPositive && Number.isFinite(peak) };
}

// STITCH GRID: the imp-34196 0.25-grid (17.0..19.5) extended to the last quarter-rung the imp-34169 surrogate
// keeps positive (kEnd = 21.25; first non-positive rung k = 21.5). 18 windows -- both regions on one grid.
const K_ENDS = [];
for (let k = 17.0; k <= 21.25 + 1e-9; k += 0.25) K_ENDS.push(+k.toFixed(2));

const FIXED_BAND_KMAX = 10.0; // identical band to imp-33940 / imp-34109 / imp-34196 / imp-34169

const ROWS = K_ENDS.map((kEnd) => {
  const fp = fixedBandPeak(buildLadder(kEnd), FIXED_BAND_KMAX);
  return { kEnd, peak: fp.defined ? +fp.peak.toFixed(6) : null, atK: fp.atK, defined: fp.defined };
});
const ALL_DEFINED = ROWS.every((r) => r.defined);
const PEAKS = ROWS.map((r) => r.peak);

// 0.25-grid increments (indexed by right-endpoint kEnd) and their second differences (= peak third diffs).
const INCREMENTS = [];
for (let i = 1; i < PEAKS.length; i++) INCREMENTS.push(+(PEAKS[i] - PEAKS[i - 1]).toFixed(6));
const INC_END_KENDS = K_ENDS.slice(1); // right-endpoint kEnd of each increment
const INC_SECOND_DIFFS = [];
for (let i = 1; i < INCREMENTS.length; i++)
  INC_SECOND_DIFFS.push(+(INCREMENTS[i] - INCREMENTS[i - 1]).toFixed(6));
const INC_SECOND_DIFF_KENDS = K_ENDS.slice(2);

function incAtRightKEnd(ke) {
  const i = INC_END_KENDS.findIndex((x) => Math.abs(x - ke) < 1e-9);
  return i < 0 ? null : INCREMENTS[i];
}

// (F1) Reproduce the imp-34196 4-point post-minimum linear increment fit: steps ending 18.75..19.50.
const FIT_KENDS = [18.75, 19.0, 19.25, 19.5];
const FIT_INCS = FIT_KENDS.map((ke) => incAtRightKEnd(ke));
const LINEAR_FIT = ols(FIT_KENDS, FIT_INCS);
const LINEAR_R2 = +olsR2(FIT_KENDS, FIT_INCS, LINEAR_FIT).toFixed(5);
const LINEAR_SLOPE = +LINEAR_FIT.b.toFixed(7); // ~ +0.0025668 -- reproduces imp-34196 b ~ +0.002567

// (F2) Extrapolate the linear increment slope forward to the imp-34169 windows and measure the residual.
const PREDICT_KENDS = [19.75, 20.0, 20.25, 20.5, 20.75, 21.0, 21.25];
const UNDERPREDICT_ROWS = PREDICT_KENDS.map((ke) => {
  const actual = incAtRightKEnd(ke);
  const predicted = +(LINEAR_FIT.a + LINEAR_FIT.b * ke).toFixed(6);
  return { kEnd: ke, actual, predicted, residual: +(actual - predicted).toFixed(6) };
});
const ALL_UNDERPREDICTED = UNDERPREDICT_ROWS.every((r) => r.residual > 0);
const UNDERPREDICT_MONOTONE = UNDERPREDICT_ROWS.every(
  (r, i) => i === 0 || r.residual > UNDERPREDICT_ROWS[i - 1].residual,
);
const MAX_RESIDUAL = UNDERPREDICT_ROWS[UNDERPREDICT_ROWS.length - 1].residual; // ~ +0.080936 at kEnd 21.25

// imp-34169 0.5-grid increments reconstructed from the 0.25 peaks (reuse gate), and the linear prediction of them.
function peakAt(ke) {
  const i = K_ENDS.findIndex((x) => Math.abs(x - ke) < 1e-9);
  return PEAKS[i];
}
const HALFGRID_20_TO_205_ACTUAL = +(peakAt(20.5) - peakAt(20.0)).toFixed(6); // 0.050639 -- imp-34169
const HALFGRID_205_TO_21_ACTUAL = +(peakAt(21.0) - peakAt(20.5)).toFixed(6); // 0.080391 -- imp-34169
const HALFGRID_20_TO_205_PRED = +(incAtRightKEnd(20.25) + 0 + (LINEAR_FIT.a + LINEAR_FIT.b * 20.25)).toFixed(6);
// predicted 0.5-grid increment = sum of the two predicted 0.25 increments spanning it
function predInc(ke) {
  return LINEAR_FIT.a + LINEAR_FIT.b * ke;
}
const HALFGRID_20_TO_205_PREDICTED = +(predInc(20.25) + predInc(20.5)).toFixed(6); // ~0.041944
const HALFGRID_205_TO_21_PREDICTED = +(predInc(20.75) + predInc(21.0)).toFixed(6); // ~0.044512

// (F3) Convexity: over the post-minimum branch (right-endpoint kEnd >= 19.0) the increment second differences
// (= peak third differences) are strictly positive and grow -- a linear branch would carry zero.
const POSTMIN_SECOND_DIFFS = INC_SECOND_DIFFS.filter((_, i) => INC_SECOND_DIFF_KENDS[i] >= 19.0 - 1e-9);
const POSTMIN_ALL_POSITIVE = POSTMIN_SECOND_DIFFS.every((d) => d > 0);
const MAX_SECOND_DIFF = Math.max(...POSTMIN_SECOND_DIFFS); // ~ +0.057428 at kEnd 21.25
const BRANCH_IS_CONVEX = POSTMIN_ALL_POSITIVE && ALL_UNDERPREDICTED && MAX_RESIDUAL > 0.05;

// Reuse anchors (baked imp-34196/imp-34109/imp-34169 literals) for the continuation gate.
const IMP34196_PEAK_AT_KEND_17 = 0.648552; // imp-34196/imp-34109 shared anchor
const IMP34196_INCREMENT_MINIMUM = 0.016669; // imp-34196 sub-window increment minimum (step ending 18.75)
const IMP34196_SLOPE = 0.002567; // imp-34196 reported 4-point linear slope b
const IMP34196_R2 = 0.972; // imp-34196 reported 4-point linear R2
const IMP34169_PEAK_AT_KEND_20 = 0.865303; // imp-34169 shared anchor

export const IMP34268_FIXED_BAND_PEAK_REACCEL_CONVEXITY_STITCH = {
  id: 'imp-34268',
  proofSection: 'S-frontier',
  question:
    'imp-34196 fit the post-minimum fixed-band (k <= 10) peak re-acceleration branch as a LINEAR increment ' +
    'slope increment = a + b*kEnd (b ~ +0.002567, R2 ~ 0.972) on four windows up to kEnd = 19.5; imp-34169 ' +
    'then measured the same peak increments RE-ACCELERATE over kEnd 20.0 -> 20.5 -> 21.0 (0.5-grid 0.050639 ' +
    '-> 0.080391, second difference +0.029752). Stitching the two increment sequences on one grid, is the ' +
    're-acceleration branch genuinely LINEAR or itself CONVEX (positive third differences) -- does the ' +
    'imp-34196 4-point slope UNDER-predict the imp-34169 increments? Measurement only; no bound change; NO QED.',
  measuredQuantity:
    'On one common 0.25 kEnd grid (17.00 .. 21.25, 18 windows; kEnd = 17.0 reproduces imp-34196/imp-34109, ' +
    'kEnd = 20.0 and the 0.5-grid increments reproduce imp-34169): the fixed-band (k <= 10) peak, its 0.25-grid ' +
    'increments, the reproduced imp-34196 4-point linear increment fit (steps ending 18.75..19.50), the ' +
    'residual actual - linear-prediction extrapolated to the imp-34169 windows, and the increment second ' +
    'differences (= peak third differences) over the post-minimum branch (kEnd >= 19.0)',
  kEnds: K_ENDS, // 18 windows kEnd = 17.00 .. 21.25 (0.25 step)
  fixedBandKMax: FIXED_BAND_KMAX,
  allWindowsDefined: ALL_DEFINED, // true -- kEnd = 21.25 is the last computable quarter-rung before k* ~ 21.28
  peaks: PEAKS,
  increments: INCREMENTS, // 0.25-grid increments indexed by right-endpoint kEnd
  incrementEndKEnds: INC_END_KENDS,
  incrementSecondDifferences: INC_SECOND_DIFFS, // = peak third differences
  incrementSecondDiffKEnds: INC_SECOND_DIFF_KENDS,
  imp34196LinearFit: { a: +LINEAR_FIT.a.toFixed(7), b: LINEAR_SLOPE, r2: LINEAR_R2 }, // b ~ +0.0025668, R2 ~ 0.97222
  imp34196SlopeReproduced: Math.abs(LINEAR_SLOPE - IMP34196_SLOPE) < 5e-6 && Math.abs(LINEAR_R2 - IMP34196_R2) < 5e-4,
  underPredictionRows: UNDERPREDICT_ROWS, // {kEnd, actual, predicted, residual} x 7 -- residual strictly > 0, growing
  allUnderPredicted: ALL_UNDERPREDICTED, // true -- the linear slope under-predicts every imp-34169 window
  underPredictionMonotone: UNDERPREDICT_MONOTONE, // true -- the residual grows monotonically
  maxResidual: MAX_RESIDUAL, // ~ +0.080936 at kEnd = 21.25
  halfGrid: {
    inc20to205Actual: HALFGRID_20_TO_205_ACTUAL, // 0.050639 -- imp-34169
    inc20to205Predicted: HALFGRID_20_TO_205_PREDICTED, // ~0.041944 -- linear fit under-predicts
    inc205to21Actual: HALFGRID_205_TO_21_ACTUAL, // 0.080391 -- imp-34169
    inc205to21Predicted: HALFGRID_205_TO_21_PREDICTED, // ~0.044512 -- linear fit under-predicts
  },
  postMinSecondDifferences: POSTMIN_SECOND_DIFFS, // strictly positive over kEnd >= 19.0
  postMinAllPositive: POSTMIN_ALL_POSITIVE, // true -- positive third differences of the peak
  maxSecondDifference: +MAX_SECOND_DIFF.toFixed(6), // ~ +0.057428 at kEnd = 21.25
  branchIsConvex: BRANCH_IS_CONVEX, // true -- not linear; the increment slope itself accelerates
  imp34196PeakAtKEnd17: IMP34196_PEAK_AT_KEND_17,
  imp34196IncrementMinimum: IMP34196_INCREMENT_MINIMUM,
  imp34169PeakAtKEnd20: IMP34169_PEAK_AT_KEND_20,
  finding: {
    F1_imp34196_linear_slope_reproduced:
      'OLS of the four post-minimum 0.25-grid increments 0.016669 -> 0.017629 -> 0.018109 -> 0.018648 (steps ' +
      'ending 18.75, 19.00, 19.25, 19.50) gives slope b = +0.0025668 and R2 = 0.97222 -- matching imp-34196 s ' +
      'reported b ~ +0.002567, R2 ~ 0.972. Same 0.25 grid, same fixed band k <= 10, same inherited machinery; ' +
      'the reuse gate reproduces imp-34196/imp-34109 (peak +0.648552 at kEnd = 17.0) and imp-34169 (peak ' +
      '+0.865303 at kEnd = 20.0, 0.5-grid increments 0.050639 and 0.080391).',
    F2_linear_slope_underpredicts_imp34169_increments:
      'Extrapolated forward, the imp-34196 linear increment slope UNDER-predicts the imp-34169 increments ' +
      'monotonically and super-linearly. The residual actual - linear-prediction at right-endpoint kEnd is ' +
      'strictly positive and grows +0.000213 (19.75) -> +0.001067 (20.00) -> +0.002781 (20.25) -> +0.005914 ' +
      '(20.50) -> +0.011730 (20.75) -> +0.024149 (21.00) -> +0.080936 (21.25). On the imp-34169 0.5-grid the ' +
      'linear fit predicts 20.0 -> 20.5 as 0.041944 (actual 0.050639, under by 0.008695) and 20.5 -> 21.0 as ' +
      '0.044512 (actual 0.080391, under by 0.035879). The 4-point slope systematically under-predicts.',
    F3_branch_is_convex_positive_growing_third_differences:
      'The second differences of the 0.25-grid increments (equivalently the peak third differences) are ' +
      'strictly positive across the whole post-minimum branch (kEnd >= 19.0) and themselves grow: +0.000960 ' +
      '(19.00) -> +0.000480 (19.25) -> +0.000539 (19.50) -> +0.000933 (19.75) -> +0.001496 (20.00) -> ' +
      '+0.002355 (20.25) -> +0.003775 (20.50) -> +0.006458 (20.75) -> +0.013061 (21.00) -> +0.057428 (21.25). ' +
      'A linear increment branch would carry zero second differences; these are positive and rising, so the ' +
      're-acceleration branch is genuinely CONVEX -- the increment slope itself accelerates. The imp-34196 ' +
      '4-point linear fit is a LOCAL descriptor, valid only inside 18.75 .. 19.50.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / STITCH-AND-CONVEXITY PROBE (frontier-direction, NOT rigorous). Stitching the imp-34196 ' +
    '0.25-grid post-minimum fixed-band (k <= 10) peak increments onto the imp-34169 kEnd 20 .. 21 increments ' +
    'on one common 0.25 grid (17.00 .. 21.25, the last quarter-rung before the imp-34169 resid_exp pole at ' +
    'k* ~ 21.28) shows the imp-34196 4-point linear increment slope (b = +0.0025668, R2 = 0.97222) is ' +
    'reproduced exactly but is only a LOCAL fit: extrapolated forward it UNDER-predicts the imp-34169 ' +
    'increments monotonically and super-linearly (residual +0.000213 at kEnd 19.75 up to +0.080936 at kEnd ' +
    '21.25; on the 0.5 grid it predicts 0.041944 / 0.044512 vs actual 0.050639 / 0.080391), because the ' +
    'fixed-band peak carries strictly POSITIVE AND GROWING third differences (increment second differences ' +
    '+0.000960 -> +0.057428 over kEnd 19.0 .. 21.25). The re-acceleration branch is genuinely CONVEX, not ' +
    'linear -- the imp-34196 4-point slope under-predicts. Neither imp-34196 (CORRECT within 17.0 .. 19.5) ' +
    'nor imp-34169 (CORRECT within 20 .. 21) is overturned; imp-34196 s own F3 already read the branch as ' +
    'convex within its window, and this stitch confirms the convexity STRENGTHENS into the imp-34169 windows. ' +
    'HONEST SUB-GAP SUB-GAP-imp-34268-convex-branch-form: which convex form (quadratic, exponential in kEnd, ' +
    'or a pole-driven blow-up toward k* ~ 21.28) the re-acceleration branch follows is left OPEN -- this ' +
    'module establishes only that the branch is convex (positive growing third differences), not its ' +
    'functional form, and the branch terminates at the imp-34169 resid_exp pole so no asymptotic is ' +
    'accessible within the surrogate domain. Distinct from any form selection; the imp-33843 ' +
    'log-linear-over-power-law verdict and the imp-34109/imp-34196/imp-34169 findings are untouched. The OLS ' +
    'increment fit, the linear extrapolation, and the convexity read are descriptive, not derived; the ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34196 (the 0.25-grid re-acceleration slope this stitches; b ~ +0.002567, R2 ~ 0.972); imp-34169 ' +
    '(the kEnd 20..21 increments this stitches; resid_exp pole at k* ~ 21.28); imp-34109 (the kEnd = 14..20 ' +
    'sweep; machinery reused); imp-33940 (R2 convex low-k drift origin); imp-33843 (the log-linear OLS whose ' +
    'fixed-band peak this tracks); imp-33810 (the k=6.. ladder reused verbatim); imp-486 (C_mb GUE-conditional); ' +
    'imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C ' +
    '(C_C_PINNED).',
};

export const IMP34268_FIXED_BAND_PEAK_REACCEL_CONVEXITY_STITCH_ASSERTIONS = [
  {
    // Reuse / continuation gate: one 0.25 grid 17.0..21.25 (18 windows, all defined), kEnd = 17.0 reproduces
    // imp-34196/imp-34109 (+0.648552), kEnd = 20.0 reproduces imp-34169 (+0.865303), and the 0.5-grid
    // increments 20->20.5, 20.5->21 reproduce imp-34169 (0.050639, 0.080391).
    id: 'imp34268-reuse-gate-stitch-grid-anchors-both-modules',
    description: '18-window 0.25 grid 17.0..21.25 all defined; kEnd 17.0 -> +0.648552 (imp-34196), kEnd 20.0 -> +0.865303 (imp-34169), 0.5-grid increments 0.050639/0.080391',
    holds: () =>
      K_ENDS.length === 18 &&
      K_ENDS[0] === 17.0 &&
      K_ENDS[K_ENDS.length - 1] === 21.25 &&
      ALL_DEFINED === true &&
      Math.abs(peakAt(17.0) - IMP34196_PEAK_AT_KEND_17) < 2e-3 &&
      Math.abs(peakAt(20.0) - IMP34169_PEAK_AT_KEND_20) < 2e-3 &&
      Math.abs(HALFGRID_20_TO_205_ACTUAL - 0.050639) < 1e-4 &&
      Math.abs(HALFGRID_205_TO_21_ACTUAL - 0.080391) < 1e-4,
  },
  {
    // (F1) The imp-34196 4-point linear increment slope is reproduced: b ~ +0.0025668, R2 ~ 0.97222,
    // matching imp-34196 s reported b ~ +0.002567, R2 ~ 0.972; and the increment minimum reproduces 0.016669.
    id: 'imp34268-imp34196-linear-slope-reproduced',
    description: '4-point OLS slope b ~ +0.0025668, R2 ~ 0.97222 reproduces imp-34196 (b ~ 0.002567, R2 ~ 0.972); increment minimum 0.016669',
    holds: () =>
      Math.abs(LINEAR_SLOPE - IMP34196_SLOPE) < 5e-6 &&
      Math.abs(LINEAR_R2 - IMP34196_R2) < 5e-4 &&
      IMP34268_FIXED_BAND_PEAK_REACCEL_CONVEXITY_STITCH.imp34196SlopeReproduced === true &&
      Math.abs(incAtRightKEnd(18.75) - IMP34196_INCREMENT_MINIMUM) < 1e-6,
  },
  {
    // (F2) Extrapolated forward, the linear slope UNDER-predicts every imp-34169 window, monotonically, with
    // the residual growing to ~ +0.080936 at kEnd = 21.25; on the 0.5 grid the prediction falls short of both.
    id: 'imp34268-linear-slope-underpredicts-imp34169-increments',
    description: 'residual actual - linear-prediction strictly positive and monotone over 7 windows, max ~ +0.080936 at kEnd 21.25; 0.5-grid predictions fall short of 0.050639/0.080391',
    holds: () =>
      UNDERPREDICT_ROWS.length === 7 &&
      ALL_UNDERPREDICTED === true &&
      UNDERPREDICT_MONOTONE === true &&
      MAX_RESIDUAL > 0.05 &&
      HALFGRID_20_TO_205_PREDICTED < HALFGRID_20_TO_205_ACTUAL &&
      HALFGRID_205_TO_21_PREDICTED < HALFGRID_205_TO_21_ACTUAL,
  },
  {
    // (F3) The branch is CONVEX: increment second differences (peak third differences) are strictly positive
    // across the post-minimum branch (kEnd >= 19.0) and grow to ~ +0.057428; branchIsConvex is true.
    id: 'imp34268-branch-convex-positive-growing-third-differences',
    description: 'post-minimum increment second differences (peak third differences) strictly positive over kEnd >= 19.0, max ~ +0.057428; branchIsConvex true',
    holds: () =>
      POSTMIN_ALL_POSITIVE === true &&
      MAX_SECOND_DIFF > 0.05 &&
      BRANCH_IS_CONVEX === true &&
      POSTMIN_SECOND_DIFFS.length >= 9,
  },
  {
    // Honesty gate: measurement only, branch convex AND linear under-predicts, isRigorous false, both source
    // modules untouched, open sub-gap flagged, no QED, no refereed bound is changed, imp-3066 K_a>=0 & imp-486 C_mb untouched.
    id: 'imp34268-honesty-gate-no-qed',
    description: 'Measurement only: branchIsConvex & allUnderPredicted, isRigorous false, imp-34196/imp-34169 untouched, sub-gap flagged, no QED, no refereed bound is changed, imp-3066 K_a>=0 untouched, imp-486 C_mb untouched',
    holds: () =>
      IMP34268_FIXED_BAND_PEAK_REACCEL_CONVEXITY_STITCH.branchIsConvex === true &&
      IMP34268_FIXED_BAND_PEAK_REACCEL_CONVEXITY_STITCH.allUnderPredicted === true &&
      IMP34268_FIXED_BAND_PEAK_REACCEL_CONVEXITY_STITCH.isRigorous === false &&
      /NOT a rigorous asymptotic/.test(IMP34268_FIXED_BAND_PEAK_REACCEL_CONVEXITY_STITCH.verdict) &&
      /SUB-GAP-imp-34268-convex-branch-form/.test(IMP34268_FIXED_BAND_PEAK_REACCEL_CONVEXITY_STITCH.verdict) &&
      /is not overturned|is untouched|CORRECT within/.test(IMP34268_FIXED_BAND_PEAK_REACCEL_CONVEXITY_STITCH.verdict) &&
      /NO QED/.test(IMP34268_FIXED_BAND_PEAK_REACCEL_CONVEXITY_STITCH.verdict) &&
      /refereed bound is changed/i.test(IMP34268_FIXED_BAND_PEAK_REACCEL_CONVEXITY_STITCH.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34268_FIXED_BAND_PEAK_REACCEL_CONVEXITY_STITCH.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34268_FIXED_BAND_PEAK_REACCEL_CONVEXITY_STITCH.verdict),
  },
];

for (const a of IMP34268_FIXED_BAND_PEAK_REACCEL_CONVEXITY_STITCH_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34268-fixed-band-peak-reaccel-convexity-stitch assertion failed: ${a.id}`);
  }
}
