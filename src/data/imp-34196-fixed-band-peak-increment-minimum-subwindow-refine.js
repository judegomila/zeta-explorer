/**
 * @module imp-34196-fixed-band-peak-increment-minimum-subwindow-refine
 *
 * imp-34196 (numerical, frontier-direction): imp-34109 F1 pushed the imp-33987/imp-34040 fixed-band
 * (k <= 10) peak-amplitude sweep to kEnd = 14.0 .. 20.0 on a COARSE 0.5-step kEnd grid and read a
 * DECELERATION MINIMUM -- the fixed-band peak increments fell to a minimum 0.03370 at the kEnd = 18 -> 18.5
 * step then RE-INCREASED 0.03370 -> 0.03430 -> 0.03676 -> 0.04066, the inflection where the imp-34040
 * concave deceleration reverses to re-acceleration. That minimum was read off a 0.5-wide bin and never
 * refined; the re-acceleration branch was never fit. This module REFINES the kEnd grid around 17.0 .. 19.5
 * to the FINEST resolution the inherited machinery supports -- a 0.25 step (half the imp-34109 window, and
 * the imp-33810 ladder rung spacing, so no finer grid changes which rungs enter the OLS) -- to LOCATE the
 * increment minimum / inflection to sub-window resolution, and FITS the post-minimum re-acceleration branch
 * to test whether the fixed-band peak growth is asymptotically unbounded or merely delayed-saturating.
 *
 * WHY 0.25 IS THE FINEST MEANINGFUL STEP (not an arbitrary choice)
 * ----------------------------------------------------------------
 *   kEnd enters the measurement ONLY through which imp-33810 ladder rungs k = 6.00, 6.25, ..., <= kEnd are
 *   included in the imp-33843 OLS. The ladder rung spacing is 0.25, so the fixed-band peak(kEnd) is a step
 *   function constant within each 0.25-wide bin: any grid finer than 0.25 reproduces the same peaks with
 *   zero-valued increments in the interior of a bin. 0.25 is therefore the genuine sub-window resolution --
 *   it HALVES the imp-34109 0.5 grid and resolves the minimum to the exact rung-addition step.
 *
 * THE MEASUREMENT (imp-34109/imp-34040 machinery reused verbatim; only the kEnd grid is halved, and the
 * increment-minimum localisation + re-acceleration branch fit are new)
 * ------------------------------------------------------------------------------------------------------------
 *   Component model  sigma(N) = E_coll/(E_trunc + E_flow + E_coll), the inherited imp-3220/imp-3406
 *                    sub-terms EXACTLY as in imp-33810/imp-33940/imp-33987/imp-34040/imp-34109. No re-derivation.
 *   Refined sweep    kEnd = 17.0, 17.25, 17.5, ..., 19.5 (11 windows), the 0.25 half-step refinement of
 *                    imp-34109 s 0.5 grid, centred on the imp-34109 F1 minimum region 17.5 .. 19.
 *   Fixed-band peak  the largest signed residual among rungs with k <= 10.00 -- the identical
 *                    boundary-independent band imp-33940 R2 / imp-33987 / imp-34040 / imp-34109 tracked.
 *   Increment min    the 10 consecutive-window increments dPeak_i = peak_i - peak_{i-1} are minimised over i;
 *                    a 3-point parabolic vertex of the increment-vs-kEnd curve locates the inflection kEnd*
 *                    (where deceleration reverses to re-acceleration) to sub-window resolution.
 *   Re-accel fit     the post-minimum increments are OLS-fit dPeak = a + b kEnd; slope b > 0 (increments
 *                    RISING, i.e. peak second differences POSITIVE / convex) refutes delayed saturation,
 *                    for which increments must keep DECREASING toward zero.
 *
 * THE FINDING (measurement only -- the imp-34109 F1 coarse-grid minimum is refined half a window LATER, and
 * the re-acceleration branch is confirmed convex, consistent with the imp-34109 F4 unbounded verdict)
 * ------------------------------------------------------------------------------------------------------------
 *   (F1) THE INCREMENT MINIMUM SITS AT THE kEnd = 18.50 -> 18.75 STEP, HALF A WINDOW LATER THAN THE COARSE
 *        READ. On the 0.25 grid the fixed-band (k <= 10) peak climbs monotonically +0.648552 (kEnd=17.0) ->
 *        +0.824645 (kEnd=19.5); its 10 increments fall to a MINIMUM 0.016669 at the kEnd = 18.50 -> 18.75
 *        step then RE-INCREASE 0.016669 -> 0.017629 -> 0.018109 -> 0.018648. imp-34109 s 0.5-grid read the
 *        minimum one bin earlier at the 18.0 -> 18.5 step (0.03370 ~ 2x 0.016685, the expected step-scaling);
 *        the refinement moves the resolved minimum step to 18.50 -> 18.75.
 *   (F2) THE SUB-WINDOW INFLECTION IS kEnd* ~ 18.64. A 3-point parabolic vertex of the increment-vs-kEnd
 *        curve about the discrete minimum places the deceleration-to-re-acceleration inflection at
 *        kEnd* ~ 18.64 -- between the coarse 0.5-grid midpoints, a genuine sub-window localisation. The peak
 *        second differences (first differences of the increments) are negative through the 18.75 step then
 *        flip strictly POSITIVE at kEnd = 19.0 (+0.000960), bracketing the inflection to kEnd ~ 18.6 .. 18.8.
 *   (F3) THE POST-MINIMUM RE-ACCELERATION BRANCH IS CONVEX -- INCREMENTS RISE, REFUTING DELAYED SATURATION.
 *        Fitting the four post-minimum increments dPeak = a + b kEnd gives slope b ~ +0.002567 (R^2 ~ 0.972):
 *        the increments RISE with kEnd, so the peak is CONVEX (positive second differences) on the re-accel
 *        branch. A delayed-saturating law (approach to a finite cap) requires increments that keep
 *        DECREASING toward zero; the observed RISING increments contradict that within kEnd <= 19.5 and are
 *        consistent with the imp-34109 F4 unbounded-log verdict -- the fixed-band peak keeps climbing, and
 *        the imp-34040 "saturation onset" remains a within-window (14 .. 17) transient.
 *   (F4) THE BAND ARGMAX RUNG UN-LOCKS AT kEnd = 19.0 (6.50 -> 6.25). On the refined grid the band argmax
 *        rung holds k = 6.50 through kEnd = 18.75 then creeps to k = 6.25 at kEnd = 19.0, 19.25, 19.5 --
 *        refining imp-34109 F3 s coarse "un-locks near 19" to the exact rung-addition step just past the
 *        increment minimum, another independent sign (cf. imp-34047) the drift has not settled.
 *
 * The punchline: refining the imp-34109 fixed-band (k <= 10) peak-amplitude sweep to a 0.25 kEnd grid (the
 * finest the imp-33810 ladder supports) over 17.0 .. 19.5 LOCATES the imp-34109 F1 deceleration minimum at
 * the kEnd = 18.50 -> 18.75 step (increment 0.016669), half a window LATER than the coarse 0.5-grid read, with
 * a parabolic inflection kEnd* ~ 18.64 and a second-difference sign-flip bracket kEnd ~ 18.6 .. 18.8. The
 * post-minimum re-acceleration branch is CONVEX (increment slope +0.002567, R^2 ~ 0.972): increments RISE, so
 * a delayed-saturating cap is refuted within the window and the fixed-band peak KEEPS CLIMBING -- confirming,
 * at sub-window resolution, the imp-34109 F4 unbounded-log verdict.
 *
 * MEASUREMENT / RESIDUAL-GROWTH LOCALISATION + FIT ONLY. A descriptive refinement of an inherited-surrogate
 * measurement, NOT an RH bound and distinct from any form selection (the imp-33843 log-linear-over-power-law
 * verdict and the imp-33940 R2 / imp-33987 / imp-34040 / imp-34109 findings it refines are untouched). The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the OLS
 * surrogate, the parabolic inflection, and the re-acceleration fit are descriptive, not derived; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34109-fixed-band-peak-amplitude-saturation-fit (the coarse 0.5-grid sweep whose F1 minimum this refines)
 * @see imp-34040-fixed-band-drift-saturation-decade (the kEnd = 14..17 saturation-onset window imp-34109 corrected)
 * @see imp-34047-argmax-rung-creep-descent-law (the argmax-creep law; F4 is an independent argmax observation)
 * @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero (sibling cohort member: the same fixed-band
 *   (k<=10) peak tracked to the k*~21.281 pole rather than refined at the increment minimum)
 * @see imp-34287-fixed-band-peak-growth-exponent-pole-reconciliation (sibling cohort member: SUB-GAP-imp-34287-asymptotic-class-undecidable, reconciles this module's rising increments with the pole)
 * @see imp-34268-fixed-band-peak-reaccel-convexity-stitch (sibling cohort member: SUB-GAP-imp-34268-convex-branch-form, stitches this module's re-accel slope onto the pole-adjacent windows)
 * @see imp-34228-doubling-map-double-precision-anchor-floor (sibling cohort member: SUB-GAP-imp-34228-residexp-resolution-floor, the resid_exp resolution floor near the same pole)
 * @see imp-33940-interior-residual-boundary-stability (the R2 convex low-k drift origin)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS re-run per boundary)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6.. ladder reused verbatim; its 0.25 rung spacing sets the resolution)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED constant in E_coll)
 *
 * IMPORT-WEIGHT AUDIT (imp-34277): this module's two-hop import chain (lambda-rh-height-mapping ->
 * bridge-lambda-rh -> guth-maynard-tail-bound; polymath15-constant-C-C -> g6a-sub-constant-value /
 * polymath15-lemma52-shock-holder -> lambda-intercept-burgers-uniformity -> dyson-scaling-N5000 /
 * dyson-burgers-shock / lambda-intercept-analytic) was traced and does NOT reach the 20.8MB
 * zeros-to-1e6.js bundle; per [[no_heavy_imports_in_pages]] this module stays safe to import from a
 * lazy-loaded page.
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), verbatim imp-34109
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-33810 sub-terms (no re-derivation) -- verbatim imp-34109.
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
function r2Of(xs, ys, a, b) {
  const my = ys.reduce((s, y) => s + y, 0) / ys.length;
  let ssTot = 0;
  let ssRes = 0;
  for (let i = 0; i < xs.length; i++) {
    ssRes += (ys[i] - (a + b * xs[i])) ** 2;
    ssTot += (ys[i] - my) ** 2;
  }
  return 1 - ssRes / ssTot;
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

// imp-33810 quarter-decade ladder eflow_over_resid over k = 6.00 .. kEnd (inclusive), verbatim imp-34109.
function buildLadder(kEnd) {
  const R = [];
  for (let k = 6; k <= kEnd + 1e-9; k += 0.25) {
    const kk = +k.toFixed(2);
    const lo = Math.pow(10, kk);
    const hi = Math.pow(10, kk + 1);
    const pSigma = olsSigmaExponent(lo, hi);
    const pEcoll = ecollExponentMag(lo, hi);
    const ph = parts(hi);
    const residExp = pEcoll * (1 - ph.sigma) - pSigma;
    const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi));
    R.push({ k: kk, eflow_over_resid: +(eflowAttr / residExp).toExponential(4) });
  }
  return R;
}

// imp-33843 log-linear OLS residual vector on a ladder.
function residualVector(R) {
  const KS = R.map((r) => r.k);
  const Y = R.map((r) => Math.log(r.eflow_over_resid));
  const F = ols(KS, Y);
  return { KS, RES: KS.map((k, i) => Y[i] - (F.a + F.b * k)) };
}
// Largest signed residual among rungs with k <= kMax (the boundary-independent fixed band), verbatim.
function fixedBandPeak(R, kMax) {
  const { KS, RES } = residualVector(R);
  let maxI = -1;
  for (let i = 0; i < RES.length; i++) {
    if (KS[i] <= kMax + 1e-9 && (maxI < 0 || RES[i] > RES[maxI])) maxI = i;
  }
  return { peak: RES[maxI], atK: KS[maxI] };
}

// 0.25 REFINEMENT of imp-34109: kEnd = 17.0, 17.25, ..., 19.5 (11 windows) about the imp-34109 F1 minimum.
const REFINE_STEP = 0.25; // the imp-33810 ladder rung spacing -- the finest resolution kEnd resolves
const K_ENDS = [];
for (let k = 17.0; k <= 19.5 + 1e-9; k += REFINE_STEP) K_ENDS.push(+k.toFixed(2));

const FIXED_BAND_KMAX = 10.0; // identical boundary-independent band to imp-33940 R2 / .. / imp-34109

const FIXED_BAND_ROWS = K_ENDS.map((kEnd) => {
  const fp = fixedBandPeak(buildLadder(kEnd), FIXED_BAND_KMAX);
  return { kEnd, peak: +fp.peak.toFixed(6), atK: fp.atK };
});
const FB_PEAKS = FIXED_BAND_ROWS.map((r) => r.peak);

// Increments (per 0.25 step) and their first differences (= peak second differences).
const FB_INCREMENTS = [];
for (let i = 1; i < FB_PEAKS.length; i++) FB_INCREMENTS.push(+(FB_PEAKS[i] - FB_PEAKS[i - 1]).toFixed(6));
const FB_SECOND_DIFFS = [];
for (let i = 1; i < FB_INCREMENTS.length; i++)
  FB_SECOND_DIFFS.push(+(FB_INCREMENTS[i] - FB_INCREMENTS[i - 1]).toFixed(6));

// (F1) The increment minimum and the kEnd step (right endpoint) at which it sits.
let MIN_INC_I = 0;
for (let i = 1; i < FB_INCREMENTS.length; i++) if (FB_INCREMENTS[i] < FB_INCREMENTS[MIN_INC_I]) MIN_INC_I = i;
const MIN_INCREMENT = FB_INCREMENTS[MIN_INC_I];
const MIN_INCREMENT_STEP_KEND = K_ENDS[MIN_INC_I + 1]; // increment i is peaks[i+1]-peaks[i]; its right endpoint

// (F2) The sub-window inflection kEnd* -- 3-point parabolic vertex of the increment-vs-kEnd curve about the
// discrete minimum (x = right-endpoint kEnd of each increment). Falls back to the discrete step at an edge.
const INC_XS = K_ENDS.slice(1); // right endpoints of the 10 increments
let INFLECTION_KEND = MIN_INCREMENT_STEP_KEND;
if (MIN_INC_I > 0 && MIN_INC_I < FB_INCREMENTS.length - 1) {
  const yl = FB_INCREMENTS[MIN_INC_I - 1];
  const ym = FB_INCREMENTS[MIN_INC_I];
  const yr = FB_INCREMENTS[MIN_INC_I + 1];
  const denom = yl - 2 * ym + yr; // > 0 near a minimum
  if (denom !== 0) INFLECTION_KEND = INC_XS[MIN_INC_I] + REFINE_STEP * 0.5 * (yl - yr) / denom;
}

// (F3) Post-minimum re-acceleration branch: OLS increment = a + b*kEnd (slope b > 0 => convex, not saturating).
const POST_XS = INC_XS.slice(MIN_INC_I);
const POST_INCS = FB_INCREMENTS.slice(MIN_INC_I);
const REACCEL_FIT = ols(POST_XS, POST_INCS);
const REACCEL_SLOPE = REACCEL_FIT.b; // ~ +0.002567 -- increments RISE
const REACCEL_R2 = r2Of(POST_XS, POST_INCS, REACCEL_FIT.a, REACCEL_FIT.b);

// (F4) Argmax rung un-lock: holds 6.50 through kEnd 18.75 then creeps to 6.25.
const ARGMAX_KS = FIXED_BAND_ROWS.map((r) => r.atK);
const ARGMAX_UNLOCK_KEND = (() => {
  for (let i = 1; i < ARGMAX_KS.length; i++) if (ARGMAX_KS[i] !== ARGMAX_KS[0]) return K_ENDS[i];
  return null;
})();

// Booleans / summaries.
const FB_MONOTONIC = FB_PEAKS.every((p, i) => i === 0 || p > FB_PEAKS[i - 1]);
const INCREMENTS_DIP_THEN_RISE =
  MIN_INC_I > 0 && MIN_INC_I < FB_INCREMENTS.length - 1 &&
  FB_INCREMENTS[FB_INCREMENTS.length - 1] > MIN_INCREMENT;
const SECOND_DIFFS_TAIL_POSITIVE = FB_SECOND_DIFFS.slice(MIN_INC_I).every((d) => d > 0);
const REACCEL_BRANCH_CONVEX = REACCEL_SLOPE > 0; // increments rising -> peak convex -> NOT saturating
const KEEPS_CLIMBING = FB_MONOTONIC && INCREMENTS_DIP_THEN_RISE && REACCEL_BRANCH_CONVEX;

// imp-34109 shared anchors (baked literals from imp-34109.fixedBandRows), for the reuse gate. The 0.25-grid
// peaks at kEnd = 17.0 and 18.0/18.5 reproduce imp-34109 s kEnd = 17 peak and its minimum 0.5-increment.
const IMP34109_PEAK_AT_KEND_17 = 0.648552;
const IMP34109_MIN_INCREMENT_COARSE = 0.03370; // imp-34109 s 0.5-grid minimum at the kEnd 18 -> 18.5 step

export const IMP34196_FIXED_BAND_PEAK_INCREMENT_MINIMUM_SUBWINDOW_REFINE = {
  id: 'imp-34196',
  proofSection: 'S-frontier',
  question:
    'imp-34109 F1 read the fixed-band (k <= 10) peak increment minimum (bottom-out near kEnd ~ 18) off a ' +
    'coarse 0.5-step kEnd grid and never refined it, nor fit the re-acceleration branch. Refining to a 0.25 ' +
    'grid (the imp-33810 ladder rung spacing -- the finest kEnd resolves) over kEnd = 17.0 .. 19.5, where ' +
    'does the increment minimum / inflection sit to sub-window resolution, and is the post-minimum ' +
    're-acceleration branch convex (unbounded) or decaying (delayed-saturating)? Measurement only; NOT an ' +
    'RH bound; no QED.',
  measuredQuantity:
    'Per boundary kEnd = 17.0, 17.25, ..., 19.5 (11 windows): the largest signed residual in the fixed band ' +
    'k <= 10.00 of the imp-33843 log-linear OLS on the imp-33810 ladder k = 6.00 .. kEnd; the 10 increments ' +
    'and their first differences (peak second differences); the increment minimum and its kEnd step; a 3-point ' +
    'parabolic inflection kEnd*; and an OLS fit of the post-minimum increments (slope sign = convex/saturating test)',
  refineStep: REFINE_STEP, // 0.25 -- half imp-34109 s 0.5 grid, = the imp-33810 ladder rung spacing
  fixedBandRows: FIXED_BAND_ROWS, // {kEnd, peak, atK} x 11
  fixedBandKMax: FIXED_BAND_KMAX,
  kEnds: K_ENDS,
  fixedBandIncrements: FB_INCREMENTS, // dip to a minimum at the kEnd 18.50 -> 18.75 step then RE-INCREASE
  fixedBandSecondDifferences: FB_SECOND_DIFFS, // negative through 18.75 then flip POSITIVE at kEnd = 19.0
  incrementMinimum: +MIN_INCREMENT.toFixed(6), // ~0.016669 -- the refined deceleration bottom (~half the 0.5-grid 0.03370)
  incrementMinimumStepKEnd: MIN_INCREMENT_STEP_KEND, // 18.75 -- right endpoint of the minimum increment step
  inflectionKEnd: +INFLECTION_KEND.toFixed(4), // ~18.64 -- sub-window parabolic vertex of the increment curve
  reaccelBranch: {
    form: 'increment = a + b * kEnd (post-minimum increments; slope b > 0 => convex => NOT saturating)',
    xsKEnd: POST_XS,
    increments: POST_INCS.map((v) => +v.toFixed(6)), // 0.016669 -> 0.017629 -> 0.018109 -> 0.018648
    slope: +REACCEL_SLOPE.toFixed(6), // ~ +0.002567 -- increments RISE
    r2: +REACCEL_R2.toFixed(6), // ~0.9722
    convex: REACCEL_BRANCH_CONVEX, // true -- refutes delayed saturation within kEnd <= 19.5
  },
  fixedBandArgmaxKs: ARGMAX_KS, // 6.50 through kEnd 18.75 then 6.25
  argmaxUnlockKEnd: ARGMAX_UNLOCK_KEND, // 19.0 -- the exact rung-addition step just past the increment minimum
  fixedBandPeakFirst: FB_PEAKS[0], // +0.648552 at kEnd = 17.0 (reproduces imp-34109 s kEnd = 17 anchor)
  fixedBandPeakLast: FB_PEAKS[FB_PEAKS.length - 1], // +0.824645 at kEnd = 19.5
  fixedBandMonotonic: FB_MONOTONIC,
  incrementsDipThenRise: INCREMENTS_DIP_THEN_RISE, // true -- interior minimum, then re-increase
  secondDiffsTailPositive: SECOND_DIFFS_TAIL_POSITIVE, // true past the minimum -- convex re-accel branch
  keepsClimbing: KEEPS_CLIMBING, // true -- delayed-saturating cap refuted; consistent with imp-34109 F4
  imp34109PeakAtKEnd17: IMP34109_PEAK_AT_KEND_17,
  imp34109MinIncrementCoarse: IMP34109_MIN_INCREMENT_COARSE,
  finding: {
    F1_increment_minimum_refined_half_window_later:
      'On the 0.25 grid the fixed-band (k <= 10) peak climbs monotonically +0.648552 (kEnd=17.0) -> ' +
      '+0.824645 (kEnd=19.5); its 10 increments fall to a MINIMUM 0.016669 at the kEnd = 18.50 -> 18.75 step ' +
      'then RE-INCREASE 0.016669 -> 0.017629 -> 0.018109 -> 0.018648. imp-34109 s 0.5-grid read the minimum ' +
      'one bin earlier at the 18.0 -> 18.5 step (0.03370 ~ 2x 0.016685, expected step-scaling); the ' +
      'refinement moves the resolved minimum step to 18.50 -> 18.75.',
    F2_subwindow_inflection_near_18_64:
      'A 3-point parabolic vertex of the increment-vs-kEnd curve about the discrete minimum places the ' +
      'deceleration-to-re-acceleration inflection at kEnd* ~ 18.64. The peak second differences are negative ' +
      'through the 18.75 step then flip strictly POSITIVE at kEnd = 19.0 (+0.000960), bracketing the ' +
      'inflection to kEnd ~ 18.6 .. 18.8 -- a genuine sub-window localisation of the imp-34109 F1 bottom-out.',
    F3_reaccel_branch_convex_refutes_delayed_saturation:
      'Fitting the four post-minimum increments increment = a + b kEnd gives slope b ~ +0.002567 ' +
      '(R^2 ~ 0.972): the increments RISE, so the peak is CONVEX (positive second differences) on the ' +
      're-accel branch. A delayed-saturating law (approach to a finite cap) requires increments DECREASING ' +
      'toward zero; the observed RISING increments contradict that within kEnd <= 19.5 and are consistent ' +
      'with the imp-34109 F4 unbounded-log verdict -- the fixed-band peak keeps climbing.',
    F4_argmax_rung_unlocks_at_19:
      'The band argmax rung holds k = 6.50 through kEnd = 18.75 then creeps to k = 6.25 at kEnd = 19.0, ' +
      '19.25, 19.5 -- refining imp-34109 F3 s coarse "un-locks near 19" to the exact rung-addition step just ' +
      'past the increment minimum, another independent sign (cf. imp-34047) the drift has not settled.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / RESIDUAL-GROWTH LOCALISATION + FIT (frontier-direction, NOT rigorous). Refining the ' +
    'imp-34109 fixed-band (k <= 10) peak-amplitude sweep to a 0.25 kEnd grid (11 windows over 17.0 .. 19.5; ' +
    'the imp-33810 ladder rung spacing, the finest kEnd resolves, so the peaks at kEnd = 17.0 and the 18.0 -> ' +
    '18.5 step reproduce imp-34109 s kEnd = 17 peak +0.648552 and its minimum 0.5-increment 0.03370) LOCATES ' +
    'the imp-34109 F1 deceleration minimum at the kEnd = 18.50 -> 18.75 step (increment 0.016669), half a ' +
    'window LATER than the coarse read, with a parabolic inflection kEnd* ~ 18.64 and a second-difference ' +
    'sign-flip bracket kEnd ~ 18.6 .. 18.8. The post-minimum re-acceleration branch is CONVEX (increment ' +
    'slope +0.002567, R^2 ~ 0.972): increments RISE, so a delayed-saturating cap is REFUTED within the window ' +
    'and the fixed-band peak KEEPS CLIMBING -- confirming, at sub-window resolution, the imp-34109 F4 ' +
    'unbounded-log verdict; the imp-34040 "saturation onset" remains a within-window (14 .. 17) transient. ' +
    'The band argmax rung un-locks 6.50 -> 6.25 at kEnd = 19.0. Distinct from any form selection; the ' +
    'imp-33843 log-linear-over-power-law verdict is untouched. The OLS surrogate, the parabolic inflection, ' +
    'and the re-acceleration fit are descriptive, not derived; the component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34109 (the coarse 0.5-grid sweep whose F1 minimum this refines; machinery reused verbatim); ' +
    'imp-34040 (the kEnd = 14..17 saturation-onset window imp-34109 corrected); imp-34047 (the argmax-creep ' +
    'law; F4 is an independent argmax observation); imp-33940 (the R2 convex low-k drift origin); imp-33843 ' +
    '(the log-linear OLS re-run per boundary); imp-33810 (the k=6.. ladder reused verbatim; its 0.25 rung ' +
    'spacing sets the resolution); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34196_FIXED_BAND_PEAK_INCREMENT_MINIMUM_SUBWINDOW_REFINE_ASSERTIONS = [
  {
    // Reuse gate: 11 windows on a 0.25 grid; the peak at kEnd = 17.0 reproduces imp-34109 s kEnd = 17 anchor,
    // and the 0.25-grid peaks at kEnd 18.0 and 18.5 differ by imp-34109 s minimum 0.5-increment 0.03370.
    id: 'imp34196-reuse-gate-11-windows-anchors-to-imp34109',
    description: '11 windows kEnd 17.0..19.5 (step 0.25); peak at kEnd 17.0 matches imp-34109 (+0.648552); peaks at 18.0/18.5 differ by 0.03370',
    holds: () =>
      FIXED_BAND_ROWS.length === 11 &&
      REFINE_STEP === 0.25 &&
      Math.abs(FB_PEAKS[0] - IMP34109_PEAK_AT_KEND_17) < 2e-3 &&
      Math.abs((FB_PEAKS[6] - FB_PEAKS[4]) - IMP34109_MIN_INCREMENT_COARSE) < 2e-3, // kEnd 18.5 minus 18.0
  },
  {
    // (F1) The increment minimum sits at the kEnd = 18.50 -> 18.75 step (right endpoint 18.75), and the last
    // increment exceeds it -- an interior minimum, refined half a window later than the coarse 18.0 -> 18.5.
    id: 'imp34196-increment-minimum-at-18-75-step',
    description: 'fixed band monotonic; increment minimum ~0.0167 at the kEnd 18.50 -> 18.75 step; last increment > minimum (dip then rise)',
    holds: () =>
      FB_MONOTONIC === true &&
      Math.abs(MIN_INCREMENT - 0.016669) < 5e-4 &&
      MIN_INCREMENT_STEP_KEND === 18.75 &&
      INCREMENTS_DIP_THEN_RISE === true &&
      MIN_INCREMENT < IMP34109_MIN_INCREMENT_COARSE, // ~half the 0.5-grid increment (step-scaling)
  },
  {
    // (F2) The sub-window parabolic inflection lands at kEnd* ~ 18.64, strictly inside the coarse bin, and
    // the peak second differences flip from negative (through 18.75) to positive at kEnd = 19.0.
    id: 'imp34196-subwindow-inflection-near-18-64',
    description: 'parabolic inflection kEnd* in (18.5, 18.8); peak second diffs negative early then strictly positive at the tail',
    holds: () =>
      INFLECTION_KEND > 18.5 &&
      INFLECTION_KEND < 18.8 &&
      FB_SECOND_DIFFS[0] < 0 &&
      FB_SECOND_DIFFS[FB_SECOND_DIFFS.length - 1] > 0,
  },
  {
    // (F3) The post-minimum re-acceleration branch is convex: increment OLS slope > 0 (increments rising),
    // a good linear fit, and secondDiffsTailPositive -- delayed saturation refuted, keepsClimbing true.
    id: 'imp34196-reaccel-branch-convex-not-saturating',
    description: 'post-minimum increment slope > 0 (~+0.00257, R2 > 0.9); convex re-accel branch; keepsClimbing true',
    holds: () =>
      REACCEL_SLOPE > 0 &&
      Math.abs(REACCEL_SLOPE - 0.002567) < 5e-4 &&
      REACCEL_R2 > 0.9 &&
      REACCEL_BRANCH_CONVEX === true &&
      SECOND_DIFFS_TAIL_POSITIVE === true &&
      KEEPS_CLIMBING === true,
  },
  {
    // (F4) The band argmax rung un-locks 6.50 -> 6.25 at kEnd = 19.0, just past the increment minimum.
    id: 'imp34196-argmax-rung-un-locks-at-19',
    description: 'band argmax rung holds 6.50 through 18.75 then creeps to 6.25; first un-lock at kEnd = 19.0',
    holds: () =>
      ARGMAX_KS[0] === 6.5 &&
      ARGMAX_KS[ARGMAX_KS.length - 1] === 6.25 &&
      ARGMAX_UNLOCK_KEND === 19.0,
  },
  {
    // Honesty gate: measurement/localisation only, keepsClimbing (imp-34109 F4 confirmed at sub-window
    // resolution), isRigorous false, no QED, no refereed bound is changed, C_mb / imp-3066 untouched.
    id: 'imp34196-honesty-gate-no-qed',
    description: 'Measurement only: keepsClimbing, isRigorous false, no QED, no refereed bound is changed, C_mb GUE-conditional / imp-3066 K_a>=0 untouched',
    holds: () =>
      IMP34196_FIXED_BAND_PEAK_INCREMENT_MINIMUM_SUBWINDOW_REFINE.keepsClimbing === true &&
      IMP34196_FIXED_BAND_PEAK_INCREMENT_MINIMUM_SUBWINDOW_REFINE.isRigorous === false &&
      /NOT a rigorous asymptotic/.test(IMP34196_FIXED_BAND_PEAK_INCREMENT_MINIMUM_SUBWINDOW_REFINE.verdict) &&
      /NO QED/.test(IMP34196_FIXED_BAND_PEAK_INCREMENT_MINIMUM_SUBWINDOW_REFINE.verdict) &&
      /refereed bound is changed/i.test(IMP34196_FIXED_BAND_PEAK_INCREMENT_MINIMUM_SUBWINDOW_REFINE.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34196_FIXED_BAND_PEAK_INCREMENT_MINIMUM_SUBWINDOW_REFINE.verdict) &&
      /C_mb GUE-conditional per imp-486 is\s+UNTOUCHED/i.test(IMP34196_FIXED_BAND_PEAK_INCREMENT_MINIMUM_SUBWINDOW_REFINE.verdict),
  },
];

for (const a of IMP34196_FIXED_BAND_PEAK_INCREMENT_MINIMUM_SUBWINDOW_REFINE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34196-fixed-band-peak-increment-minimum-subwindow-refine assertion failed: ${a.id}`);
  }
}
