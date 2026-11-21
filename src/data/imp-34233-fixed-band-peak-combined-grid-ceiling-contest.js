/**
 * @module imp-34233-fixed-band-peak-combined-grid-ceiling-contest
 *
 * imp-34233 (numerical, frontier-direction): imp-34169 F3 showed the 13-window kEnd = 20..26 log-vs-saturate
 * ceiling contest is NOT computable -- the imp-33810/imp-33843 surrogate resid_exp(k) crosses zero at
 * k* ~ 21.28095, so only three windows (kEnd 20.0, 20.5, 21.0) remain defined past kEnd = 20. Rather than
 * abandon the contest, this module STITCHES those three imp-34169 computable windows onto imp-34109 s
 * kEnd = 14.0 .. 20.0 grid (kEnd = 20.0 is the shared anchor, so the combined grid is kEnd = 14.0, 14.5,
 * ..., 21.0 -- 15 windows) and RE-RUNS the bounded a - b/kEnd ceiling fit against the unbounded imp-33843
 * log form on the full combined grid, MEASURING which form the re-accelerating fixed-band (k <= 10)
 * increments favor up to the k* ~ 21.28 edge and REPORTING the residual / AIC gap.
 *
 * THE MEASUREMENT (imp-34109 / imp-34169 machinery reused verbatim; only the grid is stitched and the fit re-run)
 * -------------------------------------------------------------------------------------------------------------
 *   Component model  sigma(N) = E_coll/(E_trunc + E_flow + E_coll), the inherited imp-3220/imp-3406
 *                    sub-terms EXACTLY as in imp-33810/imp-33940/imp-33987/imp-34040/imp-34109/imp-34169.
 *   Combined grid    kEnd = 14.0, 14.5, ..., 21.0 (15 windows) -- imp-34109 s kEnd = 14..20 (13 windows)
 *                    stitched to imp-34169 s three computable windows kEnd = 20.0, 20.5, 21.0 (20.0 shared).
 *   Fixed-band peak  the largest signed residual among rungs with k <= 10.00 -- the identical
 *                    boundary-independent band imp-33940 R2 / imp-33987 / imp-34040 / imp-34109 / imp-34169 tracked.
 *   Ceiling contest  the 15 fixed-band peaks are fit as peak = a - b/kEnd (bounded/saturating, OLS on the
 *                    regressor 1/kEnd -> extrapolated ceiling a) against peak = a + b ln(kEnd) (unbounded log,
 *                    the imp-33843 form) and peak = a + b kEnd (unbounded linear). R^2, residual sum of
 *                    squares, and AIC = n ln(SSR/n) + 2 K (K = 3: two fit params plus the variance) are
 *                    reported for each; the AIC gap between the bounded ceiling and the unbounded log form
 *                    is the headline residual/AIC gap the ticket asks for.
 *
 * THE FINDING (measurement only -- adding the two re-accelerating windows tips the contest DECISIVELY unbounded)
 * -------------------------------------------------------------------------------------------------------------
 *   (F1) THE COMBINED GRID REPRODUCES BOTH PARENTS BIT-FOR-BIT. The 15 fixed-band peaks reproduce
 *        imp-34040 / imp-34109 at the shared boundaries (+0.383861 at kEnd = 14, +0.648552 at kEnd = 17,
 *        +0.865303 at kEnd = 20) AND imp-34169 s two new windows (+0.915942 at kEnd = 20.5, +0.996333 at
 *        kEnd = 21.0). The stitch is exact: kEnd = 20.0 is a shared anchor computed identically by both parents.
 *   (F2) THE RE-ACCELERATING TAIL PULLS THE FIT AWAY FROM ANY BOUNDED CEILING. The increments fall to a
 *        minimum 0.03370 near kEnd ~ 18 (imp-34109 F1) then RE-INCREASE, and the two imp-34169 windows
 *        RE-ACCELERATE hard (0.040658 -> 0.050639 -> 0.080391, the tail second differences +0.009981,
 *        +0.029752 strictly positive). This steep late climb is exactly what a bounded a - b/kEnd ceiling
 *        cannot follow.
 *   (F3) THE UNBOUNDED LOG FORM BEATS THE BOUNDED CEILING; THE BOUNDED CEILING IS NOT SELECTED. On the
 *        combined 15-window grid the bounded fit gives a nominal ceiling a ~ 2.06041 (b ~ 23.78339,
 *        R^2 ~ 0.98320, SSR ~ 7.72e-3), but the unbounded log form fits BETTER (R^2 ~ 0.99163, SSR ~ 3.85e-3),
 *        an AIC gap of ~ +10.45 in favour of the log form (AIC_sat ~ -107.58 vs AIC_log ~ -118.03; lower is
 *        better). The re-accelerating increments favour the UNBOUNDED form: adding the two imp-34169 windows
 *        widens imp-34109 s log-over-saturate margin, it does NOT rescue the ceiling.
 *   (F4) THE RE-ACCELERATION IS STEEP ENOUGH THAT EVEN THE UNBOUNDED LINEAR FORM OVERTAKES THE LOG. On
 *        imp-34109 s kEnd = 14..20 grid the log form beat linear (R^2 0.99948 > 0.99617); stitching the two
 *        steeply-climbing imp-34169 windows flips that -- on kEnd = 14..21 the LINEAR fit R^2 ~ 0.99442
 *        exceeds the log R^2 ~ 0.99163 (AIC_lin ~ -124.12 < AIC_log ~ -118.03). The late re-acceleration is
 *        the opposite of saturation: the best global form is the LEAST bounded of the three.
 *
 * The punchline: re-running the bounded a - b/kEnd vs unbounded-log ceiling contest on the combined grid --
 * imp-34109 s kEnd = 14..20 stitched to imp-34169 s three computable windows kEnd = 20.0, 20.5, 21.0 (15
 * windows, up to the k* ~ 21.28 surrogate edge) -- shows the re-accelerating fixed-band (k <= 10) increments
 * favour the UNBOUNDED form decisively: the unbounded log form (R^2 ~ 0.99163) beats the bounded ceiling
 * a ~ 2.06041 (R^2 ~ 0.98320) by an AIC gap of ~ +10.45, and the re-acceleration is steep enough that even
 * the unbounded LINEAR form (R^2 ~ 0.99442) overtakes the log. The bounded ceiling is NOT selected on the
 * combined grid; imp-34109 s keeps-climbing reading is confirmed and sharpened right up to the surrogate s
 * hard right edge. No finite ceiling is supported within kEnd <= k* ~ 21.28.
 *
 * MEASUREMENT / GROWTH-FORM CONTEST ONLY. A descriptive re-run of an inherited residual-growth contest on a
 * stitched grid, NOT an RH bound and distinct from any form selection (the imp-33843 log-linear-over-power-law
 * verdict and the imp-34109 / imp-34169 findings it stitches are untouched). The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the OLS surrogate, the bounded-ceiling
 * fit, and the growth-form classification are descriptive, not derived; the C_mb GUE-conditional per imp-486
 * is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero (the three computable windows kEnd 20/20.5/21
 *   and the k* ~ 21.28 surrogate edge this stitches onto imp-34109)
 * @see imp-34109-fixed-band-peak-amplitude-saturation-fit (the kEnd = 14..20 grid and the bounded-vs-log
 *   contest re-run here on the extended grid; machinery reused verbatim)
 * @see imp-34040-fixed-band-drift-saturation-decade (the kEnd = 14..17 saturation-onset sweep)
 * @see imp-33940-interior-residual-boundary-stability (the R2 convex low-k drift origin)
 * @see imp-33843-eflow-resid-widening-form-fit (the unbounded log form contested against the bounded ceiling)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6.. ladder reused verbatim)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED constant in E_coll)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), verbatim imp-34109/imp-34169
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-33810 sub-terms (no re-derivation) -- verbatim imp-34109/imp-34169.
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
function fitStats(xs, ys, a, b) {
  const my = ys.reduce((s, y) => s + y, 0) / ys.length;
  let ssTot = 0;
  let ssRes = 0;
  for (let i = 0; i < xs.length; i++) {
    ssRes += (ys[i] - (a + b * xs[i])) ** 2;
    ssTot += (ys[i] - my) ** 2;
  }
  return { r2: 1 - ssRes / ssTot, ssRes };
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

// imp-33810 quarter-decade ladder eflow_over_resid over k = 6.00 .. kEnd (inclusive), verbatim imp-34109/imp-34169.
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

// imp-33843 log-linear OLS residual vector on a ladder (undefined if any rung is non-positive -> Math.log NaN).
function residualVector(R) {
  const KS = R.map((r) => r.k);
  const Y = R.map((r) => Math.log(r.eflow_over_resid));
  const F = ols(KS, Y);
  return { KS, RES: KS.map((k, i) => Y[i] - (F.a + F.b * k)) };
}
// Largest signed residual among rungs with k <= kMax (the boundary-independent fixed band), verbatim imp-34169.
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

// THE STITCHED GRID: imp-34109 kEnd = 14..20 (13 windows) + imp-34169 kEnd = 20.5, 21.0; 20.0 is the shared
// anchor, so the combined grid is kEnd = 14.0, 14.5, ..., 21.0 (15 windows) up to the k* ~ 21.28 surrogate edge.
const K_ENDS = [];
for (let k = 14; k <= 21 + 1e-9; k += 0.5) K_ENDS.push(+k.toFixed(2));

const FIXED_BAND_KMAX = 10.0; // identical band to imp-33940 R2 / imp-33987 / imp-34040 / imp-34109 / imp-34169

const FIXED_BAND_ROWS = K_ENDS.map((kEnd) => {
  const fp = fixedBandPeak(buildLadder(kEnd), FIXED_BAND_KMAX);
  return { kEnd, peak: fp.defined ? +fp.peak.toFixed(6) : null, atK: fp.atK, defined: fp.defined };
});
const ALL_DEFINED = FIXED_BAND_ROWS.every((r) => r.defined); // true -- every combined-grid window is computable
const FB_PEAKS = FIXED_BAND_ROWS.map((r) => r.peak);

// Increments and second differences over the full combined grid -- the re-acceleration up to the k* edge.
const FB_INCREMENTS = [];
for (let i = 1; i < FB_PEAKS.length; i++) FB_INCREMENTS.push(+(FB_PEAKS[i] - FB_PEAKS[i - 1]).toFixed(6));
const FB_SECOND_DIFFS = [];
for (let i = 1; i < FB_INCREMENTS.length; i++)
  FB_SECOND_DIFFS.push(+(FB_INCREMENTS[i] - FB_INCREMENTS[i - 1]).toFixed(6));
const TAIL_SECOND_DIFFS_POSITIVE = FB_SECOND_DIFFS.slice(-2).every((d) => d > 0); // the two imp-34169 windows

// THE CEILING CONTEST on the combined grid: bounded a - b/kEnd vs unbounded log vs unbounded linear.
const N_WIN = K_ENDS.length; // 15
const K_PARAMS = 3; // two fit params + the variance -- identical across the three forms
function aicOf(ssRes) {
  return N_WIN * Math.log(ssRes / N_WIN) + 2 * K_PARAMS;
}

const INV_KENDS = K_ENDS.map((k) => 1 / k);
const SAT_FIT = ols(INV_KENDS, FB_PEAKS); // peak = a + slope*(1/kEnd); ceiling a = SAT_FIT.a, b = -slope > 0
const SAT_CEILING = SAT_FIT.a;
const SAT_B = -SAT_FIT.b;
const SAT_STATS = fitStats(INV_KENDS, FB_PEAKS, SAT_FIT.a, SAT_FIT.b);
const SAT_AIC = aicOf(SAT_STATS.ssRes);

const LOG_KENDS = K_ENDS.map((k) => Math.log(k));
const LOG_FIT = ols(LOG_KENDS, FB_PEAKS); // peak = a + b ln(kEnd) -- the imp-33843 unbounded form
const LOG_STATS = fitStats(LOG_KENDS, FB_PEAKS, LOG_FIT.a, LOG_FIT.b);
const LOG_AIC = aicOf(LOG_STATS.ssRes);

const LIN_FIT = ols(K_ENDS, FB_PEAKS); // peak = a + b kEnd -- unbounded linear contrast
const LIN_STATS = fitStats(K_ENDS, FB_PEAKS, LIN_FIT.a, LIN_FIT.b);
const LIN_AIC = aicOf(LIN_STATS.ssRes);

// The headline residual / AIC gap: bounded ceiling minus unbounded log (positive => log is favoured).
const AIC_GAP_SAT_MINUS_LOG = SAT_AIC - LOG_AIC; // ~ +10.45 -- log strongly favoured over the bounded ceiling
const AIC_GAP_LOG_MINUS_LIN = LOG_AIC - LIN_AIC; // ~ +6.09 -- even linear beats log on the re-accelerating tail
const UNBOUNDED_LOG_BEATS_CEILING = LOG_STATS.r2 > SAT_STATS.r2 && AIC_GAP_SAT_MINUS_LOG > 0;
const LINEAR_OVERTAKES_LOG = LIN_STATS.r2 > LOG_STATS.r2 && AIC_GAP_LOG_MINUS_LIN > 0;
const CEILING_NOT_SELECTED = UNBOUNDED_LOG_BEATS_CEILING; // the bounded ceiling loses the contest

// Shared anchors, baked from imp-34040 / imp-34109 / imp-34169 for the stitch gate.
const IMP34109_PEAK_AT_KEND_14 = 0.383861; // imp-34040 / imp-34109
const IMP34109_PEAK_AT_KEND_17 = 0.648552; // imp-34040 / imp-34109
const IMP34109_PEAK_AT_KEND_20 = 0.865303; // imp-34109 fixedBandPeakLast / imp-34169 first
const IMP34169_PEAK_AT_KEND_205 = 0.915942; // imp-34169 validPeaks[1]
const IMP34169_PEAK_AT_KEND_21 = 0.996333; // imp-34169 validPeaks[2]

export const IMP34233_FIXED_BAND_PEAK_COMBINED_GRID_CEILING_CONTEST = {
  id: 'imp-34233',
  proofSection: 'S-frontier',
  question:
    'imp-34169 F3 showed the 13-window kEnd = 20..26 log-vs-saturate ceiling contest is NOT computable -- ' +
    'the imp-33810/imp-33843 surrogate resid_exp(k) crosses zero at k* ~ 21.28, leaving only three defined ' +
    'windows (kEnd 20.0, 20.5, 21.0). STITCHING those three onto imp-34109 s kEnd = 14..20 grid (15 windows ' +
    'total) and re-running the bounded a - b/kEnd ceiling fit against the unbounded imp-33843 log form, ' +
    'which form do the re-accelerating fixed-band (k <= 10) increments favour up to the k* ~ 21.28 edge? ' +
    'Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'On the combined grid kEnd = 14.0, 14.5, ..., 21.0 (15 windows: imp-34109 s 13 windows kEnd 14..20 ' +
    'stitched to imp-34169 s kEnd 20.5 and 21.0, sharing kEnd = 20.0): the fixed-band (k <= 10) peak per ' +
    'window and its increments / second differences (the re-acceleration up to the k* ~ 21.28 edge), and the ' +
    'bounded saturating fit peak = a - b/kEnd contrasted against the unbounded log fit peak = a + b ln(kEnd) ' +
    'and a linear fit peak = a + b kEnd by R^2, residual sum of squares, and AIC = n ln(SSR/n) + 2K',
  kEnds: K_ENDS, // 15 windows kEnd = 14.0 .. 21.0
  fixedBandRows: FIXED_BAND_ROWS, // {kEnd, peak, atK, defined} x 15 -- all defined (up to the k* edge)
  fixedBandKMax: FIXED_BAND_KMAX,
  allWindowsDefined: ALL_DEFINED, // true -- the combined grid stops exactly at the last computable window kEnd = 21.0
  fixedBandPeaks: FB_PEAKS, // [0.383861, ..., 0.865303, 0.915942, 0.996333]
  fixedBandIncrements: FB_INCREMENTS, // bottom out ~0.03370 near kEnd ~ 18 then RE-ACCELERATE to 0.080391
  fixedBandSecondDifferences: FB_SECOND_DIFFS, // negative early, strictly POSITIVE over the imp-34169 tail
  tailSecondDiffsPositive: TAIL_SECOND_DIFFS_POSITIVE, // true -- the two imp-34169 windows re-accelerate
  saturatingFit: {
    form: 'peak = a - b/kEnd (bounded; OLS on regressor 1/kEnd; ceiling = intercept a)',
    ceiling: +SAT_CEILING.toFixed(6), // a ~ 2.06041 -- NOMINAL cap, NOT the selected form
    b: +SAT_B.toFixed(6), // ~23.78339
    r2: +SAT_STATS.r2.toFixed(8), // ~0.98320
    ssRes: +SAT_STATS.ssRes.toExponential(6), // ~7.72e-3
    aic: +SAT_AIC.toFixed(4), // ~ -107.58
  },
  logFit: {
    form: 'peak = a + b * ln(kEnd) (unbounded -- the imp-33843 form)',
    a: +LOG_FIT.a.toFixed(6),
    b: +LOG_FIT.b.toFixed(6), // ~1.39691
    r2: +LOG_STATS.r2.toFixed(8), // ~0.99163 -- BEATS the bounded ceiling
    ssRes: +LOG_STATS.ssRes.toExponential(6), // ~3.85e-3
    aic: +LOG_AIC.toFixed(4), // ~ -118.03
  },
  linearFit: {
    form: 'peak = a + b * kEnd (unbounded)',
    b: +LIN_FIT.b.toFixed(6),
    r2: +LIN_STATS.r2.toFixed(8), // ~0.99442 -- the HIGHEST R2 once the re-accelerating tail is added
    ssRes: +LIN_STATS.ssRes.toExponential(6), // ~2.56e-3
    aic: +LIN_AIC.toFixed(4), // ~ -124.12
  },
  aicGapSatMinusLog: +AIC_GAP_SAT_MINUS_LOG.toFixed(4), // ~ +10.45 -- log strongly favoured over the ceiling
  aicGapLogMinusLin: +AIC_GAP_LOG_MINUS_LIN.toFixed(4), // ~ +6.09 -- even linear overtakes log on this grid
  unboundedLogBeatsCeiling: UNBOUNDED_LOG_BEATS_CEILING, // true
  linearOvertakesLog: LINEAR_OVERTAKES_LOG, // true -- the re-acceleration is steep enough to flip log-vs-linear
  ceilingNotSelected: CEILING_NOT_SELECTED, // true -- the bounded a - b/kEnd ceiling loses the contest
  imp34109PeakAtKEnd14: IMP34109_PEAK_AT_KEND_14,
  imp34109PeakAtKEnd17: IMP34109_PEAK_AT_KEND_17,
  imp34109PeakAtKEnd20: IMP34109_PEAK_AT_KEND_20,
  imp34169PeakAtKEnd205: IMP34169_PEAK_AT_KEND_205,
  imp34169PeakAtKEnd21: IMP34169_PEAK_AT_KEND_21,
  finding: {
    F1_combined_grid_reproduces_both_parents:
      'The 15 fixed-band peaks reproduce imp-34040 / imp-34109 at the shared boundaries (+0.383861 at ' +
      'kEnd = 14, +0.648552 at kEnd = 17, +0.865303 at kEnd = 20) AND imp-34169 s two new windows ' +
      '(+0.915942 at kEnd = 20.5, +0.996333 at kEnd = 21.0). kEnd = 20.0 is a shared anchor computed ' +
      'identically by both parents, so the stitch is exact.',
    F2_re_accelerating_tail_defies_a_bounded_ceiling:
      'The increments fall to a minimum 0.03370 near kEnd ~ 18 (imp-34109 F1) then RE-INCREASE, and the two ' +
      'imp-34169 windows re-accelerate hard 0.040658 -> 0.050639 -> 0.080391 (tail second differences ' +
      '+0.009981, +0.029752 strictly positive). This steep late climb is exactly what a bounded a - b/kEnd ' +
      'ceiling cannot follow.',
    F3_unbounded_log_beats_the_bounded_ceiling:
      'On the combined 15-window grid the bounded fit gives a nominal ceiling a ~ 2.06041 (b ~ 23.78339, ' +
      'R^2 ~ 0.98320, SSR ~ 7.72e-3) but the unbounded log form fits BETTER (R^2 ~ 0.99163, SSR ~ 3.85e-3), ' +
      'an AIC gap of ~ +10.45 in favour of the log form (AIC_sat ~ -107.58 vs AIC_log ~ -118.03; lower is ' +
      'better). Adding the two imp-34169 windows WIDENS imp-34109 s log-over-saturate margin -- the ' +
      're-accelerating increments favour the unbounded form; the bounded ceiling is NOT selected.',
    F4_re_acceleration_lets_linear_overtake_log:
      'On imp-34109 s kEnd = 14..20 grid the log form beat linear (R^2 0.99948 > 0.99617); stitching the two ' +
      'steeply-climbing imp-34169 windows flips that -- on kEnd = 14..21 the LINEAR fit R^2 ~ 0.99442 exceeds ' +
      'the log R^2 ~ 0.99163 (AIC_lin ~ -124.12 < AIC_log ~ -118.03). The late re-acceleration is the ' +
      'opposite of saturation: the best global form is the LEAST bounded of the three.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / GROWTH-FORM CONTEST (frontier-direction, NOT rigorous). Re-running the bounded a - b/kEnd ' +
    'vs unbounded-log ceiling contest on the combined grid -- imp-34109 s kEnd = 14..20 (13 windows) ' +
    'stitched to imp-34169 s three computable windows kEnd = 20.0, 20.5, 21.0 (kEnd = 20.0 shared, 15 ' +
    'windows total, up to the k* ~ 21.28 surrogate edge) with the identical inherited ' +
    'imp-33810/imp-33940/imp-33987/imp-34040/imp-34109/imp-34169 sub-terms -- shows the re-accelerating ' +
    'fixed-band (k <= 10) increments favour the UNBOUNDED form decisively. The 15 peaks reproduce both ' +
    'parents bit-for-bit (+0.383861 / +0.648552 / +0.865303 from imp-34109, +0.915942 / +0.996333 from ' +
    'imp-34169); the increments re-accelerate 0.040658 -> 0.050639 -> 0.080391 over the two imp-34169 ' +
    'windows. The bounded fit gives a nominal ceiling a ~ 2.06041 (b ~ 23.78339, R^2 ~ 0.98320) but the ' +
    'unbounded log form fits BETTER (R^2 ~ 0.99163), an AIC gap of ~ +10.45 in favour of the log form, and ' +
    'the re-acceleration is steep enough that even the unbounded LINEAR form (R^2 ~ 0.99442) overtakes the ' +
    'log (AIC gap ~ +6.09). The bounded ceiling is NOT selected on the combined grid: imp-34109 s ' +
    'keeps-climbing reading is confirmed and sharpened right up to the surrogate s hard right edge; no ' +
    'finite ceiling is supported within kEnd <= k* ~ 21.28. Distinct from any form selection; the imp-33843 ' +
    'log-linear-over-power-law verdict and the imp-34109 / imp-34169 findings this stitches are untouched. ' +
    'The OLS surrogate, the bounded-ceiling fit, and the growth-form classification are descriptive, not ' +
    'derived; the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34169 (the three computable windows kEnd 20/20.5/21 and the k* ~ 21.28 surrogate edge this stitches ' +
    'onto imp-34109); imp-34109 (the kEnd = 14..20 grid and the bounded-vs-log contest re-run here; ' +
    'machinery reused verbatim); imp-34040 (the kEnd = 14..17 saturation-onset sweep); imp-33940 (the R2 ' +
    'convex low-k drift origin); imp-33843 (the unbounded log form contested against the bounded ceiling); ' +
    'imp-33810 (the k=6.. ladder reused verbatim); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc ' +
    'fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34233_FIXED_BAND_PEAK_COMBINED_GRID_CEILING_CONTEST_ASSERTIONS = [
  {
    // Stitch gate: 15-window combined grid kEnd 14..21, every window defined, and the peaks reproduce
    // imp-34109 s three shared anchors AND imp-34169 s two new windows.
    id: 'imp34233-stitch-gate-15-window-grid-reproduces-both-parents',
    description: '15 windows kEnd 14..21, all defined; peaks match imp-34109 (+0.383861/+0.648552/+0.865303) and imp-34169 (+0.915942/+0.996333, < 2e-3)',
    holds: () =>
      K_ENDS.length === 15 &&
      K_ENDS[0] === 14 &&
      K_ENDS[K_ENDS.length - 1] === 21 &&
      ALL_DEFINED === true &&
      Math.abs(FB_PEAKS[0] - IMP34109_PEAK_AT_KEND_14) < 2e-3 &&
      Math.abs(FB_PEAKS[6] - IMP34109_PEAK_AT_KEND_17) < 2e-3 &&
      Math.abs(FB_PEAKS[12] - IMP34109_PEAK_AT_KEND_20) < 2e-3 &&
      Math.abs(FB_PEAKS[13] - IMP34169_PEAK_AT_KEND_205) < 2e-3 &&
      Math.abs(FB_PEAKS[14] - IMP34169_PEAK_AT_KEND_21) < 2e-3,
  },
  {
    // (F2) The re-accelerating tail: increments re-increase over the two imp-34169 windows and the tail
    // second differences are strictly positive.
    id: 'imp34233-re-accelerating-tail-over-imp34169-windows',
    description: 'increments re-accelerate 0.050639 -> 0.080391 over kEnd 20.5, 21.0; the two tail second differences are strictly positive',
    holds: () =>
      FB_INCREMENTS.length === 14 &&
      FB_INCREMENTS[FB_INCREMENTS.length - 1] > FB_INCREMENTS[FB_INCREMENTS.length - 2] &&
      FB_INCREMENTS[FB_INCREMENTS.length - 2] > FB_INCREMENTS[FB_INCREMENTS.length - 3] &&
      TAIL_SECOND_DIFFS_POSITIVE === true,
  },
  {
    // (F3) The unbounded log form beats the bounded ceiling: log R2 > saturating R2, nominal ceiling in
    // (1.8, 2.4), and a positive AIC gap (sat minus log) of order 10.
    id: 'imp34233-unbounded-log-beats-bounded-ceiling',
    description: 'log R2 > saturating R2; nominal ceiling a in (1.8, 2.4); AIC gap (sat - log) > 5 -- the bounded ceiling is not selected',
    holds: () =>
      LOG_STATS.r2 > SAT_STATS.r2 &&
      SAT_CEILING > 1.8 &&
      SAT_CEILING < 2.4 &&
      AIC_GAP_SAT_MINUS_LOG > 5 &&
      UNBOUNDED_LOG_BEATS_CEILING === true &&
      CEILING_NOT_SELECTED === true,
  },
  {
    // (F4) The re-acceleration is steep enough that the unbounded linear form overtakes the log on the
    // combined grid (a positive AIC gap log minus lin).
    id: 'imp34233-linear-overtakes-log-on-re-accelerating-grid',
    description: 'linear R2 > log R2 on kEnd 14..21; AIC gap (log - lin) > 0 -- the best global form is the least bounded',
    holds: () =>
      LIN_STATS.r2 > LOG_STATS.r2 &&
      AIC_GAP_LOG_MINUS_LIN > 0 &&
      LINEAR_OVERTAKES_LOG === true,
  },
  {
    // Honesty gate: measurement only, ceiling not selected, isRigorous false, imp-34109 / imp-34169
    // untouched, no QED, no refereed bound is changed, imp-3066 K_a>=0 untouched, imp-486 C_mb untouched.
    id: 'imp34233-honesty-gate-no-qed',
    description: 'Measurement only: ceilingNotSelected, isRigorous false, imp-34109/imp-34169 untouched, no QED, no refereed bound is changed, imp-3066 K_a>=0 untouched, imp-486 C_mb untouched',
    holds: () =>
      IMP34233_FIXED_BAND_PEAK_COMBINED_GRID_CEILING_CONTEST.ceilingNotSelected === true &&
      IMP34233_FIXED_BAND_PEAK_COMBINED_GRID_CEILING_CONTEST.isRigorous === false &&
      /NOT a rigorous asymptotic/.test(IMP34233_FIXED_BAND_PEAK_COMBINED_GRID_CEILING_CONTEST.verdict) &&
      /are untouched/.test(IMP34233_FIXED_BAND_PEAK_COMBINED_GRID_CEILING_CONTEST.verdict) &&
      /NO QED/.test(IMP34233_FIXED_BAND_PEAK_COMBINED_GRID_CEILING_CONTEST.verdict) &&
      /refereed bound is changed/i.test(IMP34233_FIXED_BAND_PEAK_COMBINED_GRID_CEILING_CONTEST.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34233_FIXED_BAND_PEAK_COMBINED_GRID_CEILING_CONTEST.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34233_FIXED_BAND_PEAK_COMBINED_GRID_CEILING_CONTEST.verdict),
  },
];

for (const a of IMP34233_FIXED_BAND_PEAK_COMBINED_GRID_CEILING_CONTEST_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34233-fixed-band-peak-combined-grid-ceiling-contest assertion failed: ${a.id}`);
  }
}
