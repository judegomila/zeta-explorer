/**
 * @module imp-34309-combined-grid-loo-linear-flip-robustness
 *
 * imp-34309 (numerical, frontier-direction): imp-34233 F4 found that STITCHING imp-34169 s three
 * steeply-climbing near-pole windows (kEnd 20.0, 20.5, 21.0) onto imp-34109 s kEnd = 14..20 grid flips
 * the growth-form winner on the combined kEnd = 14..21 grid from log (imp-34109) to unbounded LINEAR
 * (AIC_lin ~ -124.12 < AIC_log ~ -118.03; the log-minus-lin AIC gap ~ +6.09 favours linear). That flip
 * is driven by the two re-accelerating tail windows -- but its robustness to deleting any single one of
 * the three near-pole windows was never tested. This module re-runs the identical linear-vs-log-vs-bounded
 * AIC contest with EACH of the three near-pole windows (kEnd 20.0 / 20.5 / 21.0) deleted in turn
 * (leave-one-out) and measures whether the linear-beats-log verdict HINGES on the single closest-to-pole
 * window kEnd = 21.0 or is STABLE to any single deletion.
 *
 * THE MEASUREMENT (imp-34233 machinery reused verbatim; only the LOO grid subsets and the fit re-run)
 * -------------------------------------------------------------------------------------------------------------
 *   Component model  sigma(N) = E_coll/(E_trunc + E_flow + E_coll), the inherited imp-3220/imp-3406
 *                    sub-terms EXACTLY as in imp-33810/imp-34109/imp-34169/imp-34233.
 *   Full grid        kEnd = 14.0, 14.5, ..., 21.0 (15 windows) -- the imp-34233 combined grid, bit-for-bit.
 *   Fixed-band peak  the largest signed residual among rungs with k <= 10.00 -- the identical
 *                    boundary-independent band imp-33940 R2 / imp-34040 / imp-34109 / imp-34169 / imp-34233 tracked.
 *   LOO subsets      three 14-window grids, each dropping ONE of the near-pole windows kEnd = 20.0, 20.5, 21.0.
 *   Contest          each subset s 14 fixed-band peaks are fit as peak = a - b/kEnd (bounded), peak = a + b ln(kEnd)
 *                    (unbounded log, the imp-33843 form), and peak = a + b kEnd (unbounded linear); R^2, SSR, and
 *                    AIC = n ln(SSR/n) + 2K (K = 3) are reported. The headline is the log-minus-linear AIC gap:
 *                    positive => linear still overtakes log; negative => the flip reverses back to log.
 *
 * THE FINDING (measurement only -- the linear flip is FRAGILE and hinges entirely on the closest-to-pole window)
 * -------------------------------------------------------------------------------------------------------------
 *   (F1) DELETING kEnd = 20.0 DOES NOT UNDO THE FLIP. On the 14-window LOO grid {14..21} minus 20.0 the
 *        linear fit still beats log (R^2 ~ 0.99473 > 0.99131; AIC_lin ~ -116.43 < AIC_log ~ -109.44; the
 *        log-minus-lin AIC gap ~ +6.99, slightly WIDER than the full-grid +6.09). linearOvertakesLog stays true.
 *   (F2) DELETING kEnd = 20.5 DOES NOT UNDO THE FLIP EITHER. On {14..21} minus 20.5 linear still beats log
 *        (R^2 ~ 0.99373 > 0.99043; AIC_lin ~ -114.77 < AIC_log ~ -108.87; the log-minus-lin AIC gap ~ +5.90,
 *        marginally NARROWER than the full-grid +6.09 but still firmly positive). linearOvertakesLog stays true.
 *   (F3) DELETING kEnd = 21.0 REVERSES THE FLIP DECISIVELY. On {14..21} minus 21.0 -- dropping the single
 *        closest-to-pole, steepest-jump window (peak +0.996333) -- the log fit RECLAIMS the win: R^2_log
 *        ~ 0.99849 > R^2_lin ~ 0.99692, AIC_log ~ -136.44 < AIC_lin ~ -126.50, and the log-minus-lin AIC gap
 *        FLIPS SIGN to ~ -9.94 (log strongly favoured). linearOvertakesLog goes FALSE. The imp-34233 F4
 *        linear-overtakes-log verdict HINGES ENTIRELY on the single window kEnd = 21.0; it is NOT stable to
 *        that one deletion, though it survives deletion of either of the other two near-pole windows.
 *   (F4) THE BOUNDED CEILING IS NEVER SELECTED UNDER ANY SINGLE DELETION. Across all three LOO subsets the
 *        unbounded log form beats the bounded a - b/kEnd ceiling (the sat-minus-log AIC gap ~ +10.32, +9.27,
 *        +17.33 for the 20.0 / 20.5 / 21.0 deletions -- all strongly positive). Deleting kEnd = 21.0 lowers
 *        the nominal ceiling to a ~ 1.98970 (from a ~ 2.06041) and sharpens the bounded fit (R^2 ~ 0.99478),
 *        but log still beats it by ~ +17.33 AIC. The imp-34233 ceilingNotSelected reading is ROBUST to every
 *        single near-pole deletion; only the finer log-vs-linear ranking is fragile.
 *
 * The punchline: the imp-34233 F4 linear-overtakes-log flip is FRAGILE in one specific way -- it hinges
 * entirely on the single closest-to-pole window kEnd = 21.0 (the steepest jump, +0.080391 increment).
 * Deleting kEnd = 20.0 or kEnd = 20.5 leaves linear winning (log-minus-lin AIC gap +6.99 / +5.90); deleting
 * kEnd = 21.0 reverses it back to log winning (gap -9.94). So the linear-beats-log verdict is NOT robust to
 * leave-one-out over the three near-pole windows -- but the coarser imp-34233 verdict that the BOUNDED
 * a - b/kEnd ceiling is not selected (log beats the ceiling) IS robust to every single deletion (sat-minus-log
 * AIC gap stays +9.27 .. +17.33). The re-acceleration s single steepest window carries the log-vs-linear flip;
 * the keeps-climbing / no-finite-ceiling reading does not depend on any one window.
 *
 * MEASUREMENT / GROWTH-FORM CONTEST ONLY. A descriptive leave-one-out robustness re-run of the inherited
 * imp-34233 residual-growth contest, NOT an RH bound and distinct from any form selection (the imp-33843
 * log-linear-over-power-law verdict and the imp-34109 / imp-34169 / imp-34233 findings it perturbs are
 * untouched). The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
 * the OLS surrogate, the bounded-ceiling fit, and the growth-form classification are descriptive, not derived;
 * the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34233-fixed-band-peak-combined-grid-ceiling-contest (the F4 linear-overtakes-log flip and the 15-window
 *   combined grid this leaves-one-out; machinery reused verbatim)
 * @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero (the three near-pole windows kEnd 20/20.5/21)
 * @see imp-34109-fixed-band-peak-amplitude-saturation-fit (the kEnd = 14..20 base grid)
 * @see imp-33843-eflow-resid-widening-form-fit (the unbounded log form contested against linear and the ceiling)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6.. ladder reused verbatim)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED constant in E_coll)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), verbatim imp-34233
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-33810 sub-terms (no re-derivation) -- verbatim imp-34233.
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

// imp-33810 quarter-decade ladder eflow_over_resid over k = 6.00 .. kEnd (inclusive), verbatim imp-34233.
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
function residualVector(R) {
  const KS = R.map((r) => r.k);
  const Y = R.map((r) => Math.log(r.eflow_over_resid));
  const F = ols(KS, Y);
  return { KS, RES: KS.map((k, i) => Y[i] - (F.a + F.b * k)) };
}
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

// The imp-34233 combined grid kEnd = 14.0, 14.5, ..., 21.0 (15 windows) up to the k* ~ 21.28 surrogate edge.
const K_ENDS = [];
for (let k = 14; k <= 21 + 1e-9; k += 0.5) K_ENDS.push(+k.toFixed(2));
const FIXED_BAND_KMAX = 10.0;
const FB_PEAKS = K_ENDS.map((kEnd) => +fixedBandPeak(buildLadder(kEnd), FIXED_BAND_KMAX).peak.toFixed(6));

// The linear-vs-log-vs-bounded AIC contest on an arbitrary (kEnds, peaks) subset -- imp-34233 machinery.
function contest(kends, peaks) {
  const n = kends.length;
  const K_PARAMS = 3; // two fit params + the variance
  const aicOf = (ss) => n * Math.log(ss / n) + 2 * K_PARAMS;
  const inv = kends.map((k) => 1 / k);
  const satFit = ols(inv, peaks);
  const satS = fitStats(inv, peaks, satFit.a, satFit.b);
  const logx = kends.map((k) => Math.log(k));
  const logFit = ols(logx, peaks);
  const logS = fitStats(logx, peaks, logFit.a, logFit.b);
  const linFit = ols(kends, peaks);
  const linS = fitStats(kends, peaks, linFit.a, linFit.b);
  const satAic = aicOf(satS.ssRes);
  const logAic = aicOf(logS.ssRes);
  const linAic = aicOf(linS.ssRes);
  return {
    n,
    satCeiling: +satFit.a.toFixed(6),
    satR2: +satS.r2.toFixed(8),
    satAic: +satAic.toFixed(4),
    logR2: +logS.r2.toFixed(8),
    logAic: +logAic.toFixed(4),
    linR2: +linS.r2.toFixed(8),
    linAic: +linAic.toFixed(4),
    aicGapSatMinusLog: +(satAic - logAic).toFixed(4), // positive => log beats the bounded ceiling
    aicGapLogMinusLin: +(logAic - linAic).toFixed(4), // positive => linear overtakes log; negative => log reclaims
    linearOvertakesLog: linS.r2 > logS.r2 && logAic - linAic > 0,
  };
}

const FULL = contest(K_ENDS, FB_PEAKS); // the imp-34233 15-window baseline: linearOvertakesLog === true

// Leave-one-out over the three near-pole windows kEnd = 20.0, 20.5, 21.0 (the imp-34169 stitch tail).
const NEAR_POLE_WINDOWS = [20.0, 20.5, 21.0];
const LOO = NEAR_POLE_WINDOWS.map((del) => {
  const idx = K_ENDS.indexOf(del);
  const kk = K_ENDS.filter((_, i) => i !== idx);
  const pp = FB_PEAKS.filter((_, i) => i !== idx);
  return { deletedWindow: del, ...contest(kk, pp) };
});

const LOO_20_0 = LOO[0]; // delete kEnd = 20.0
const LOO_20_5 = LOO[1]; // delete kEnd = 20.5
const LOO_21_0 = LOO[2]; // delete kEnd = 21.0 -- the closest-to-pole window

// The verdict: is the linear-beats-log flip stable to ANY single near-pole deletion? No -- it hinges on 21.0.
const FLIP_SURVIVES_DELETE_20_0 = LOO_20_0.linearOvertakesLog; // true
const FLIP_SURVIVES_DELETE_20_5 = LOO_20_5.linearOvertakesLog; // true
const FLIP_SURVIVES_DELETE_21_0 = LOO_21_0.linearOvertakesLog; // false -- reversed
const FLIP_STABLE_TO_ALL_SINGLE_DELETIONS = LOO.every((r) => r.linearOvertakesLog); // false
const FLIP_HINGES_ON_CLOSEST_WINDOW =
  FLIP_SURVIVES_DELETE_20_0 && FLIP_SURVIVES_DELETE_20_5 && !FLIP_SURVIVES_DELETE_21_0; // true
// The coarser imp-34233 verdict -- the bounded ceiling is not selected -- is robust to every single deletion.
const CEILING_NOT_SELECTED_ROBUST = LOO.every((r) => r.aicGapSatMinusLog > 0) && FULL.aicGapSatMinusLog > 0; // true

export const IMP34309_COMBINED_GRID_LOO_LINEAR_FLIP_ROBUSTNESS = {
  id: 'imp-34309',
  proofSection: 'S-frontier',
  question:
    'imp-34233 F4 found that stitching imp-34169 s three near-pole windows (kEnd 20.0, 20.5, 21.0) onto ' +
    'imp-34109 s kEnd = 14..20 grid flips the growth-form winner on the combined kEnd = 14..21 grid from log ' +
    'to unbounded LINEAR (AIC_lin ~ -124.12 < AIC_log ~ -118.03). Re-running the linear-vs-log-vs-bounded AIC ' +
    'contest with each of the three near-pole windows deleted in turn (leave-one-out), does the ' +
    'linear-beats-log verdict HINGE on the single closest-to-pole window kEnd = 21.0 or is it STABLE to any ' +
    'single deletion? Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'For the full imp-34233 15-window grid and for each of the three 14-window leave-one-out subsets (dropping ' +
    'kEnd = 20.0, 20.5, or 21.0 in turn): the bounded a - b/kEnd ceiling, the unbounded log fit, and the ' +
    'unbounded linear fit by R^2 and AIC = n ln(SSR/n) + 2K, the log-minus-linear AIC gap (sign flip => the ' +
    'linear verdict reverses), and the sat-minus-log AIC gap (bounded ceiling selection)',
  fullGridPeaks: FB_PEAKS, // [0.383861, ..., 0.865303, 0.915942, 0.996333]
  nearPoleWindows: NEAR_POLE_WINDOWS, // [20.0, 20.5, 21.0]
  fullGrid: FULL, // 15-window imp-34233 baseline: linearOvertakesLog === true, aicGapLogMinusLin ~ +6.09
  leaveOneOut: LOO, // three 14-window subsets, one per deleted near-pole window
  flipSurvivesDelete200: FLIP_SURVIVES_DELETE_20_0, // true -- linear still wins without kEnd 20.0
  flipSurvivesDelete205: FLIP_SURVIVES_DELETE_20_5, // true -- linear still wins without kEnd 20.5
  flipSurvivesDelete210: FLIP_SURVIVES_DELETE_21_0, // false -- log reclaims the win without kEnd 21.0
  flipStableToAllSingleDeletions: FLIP_STABLE_TO_ALL_SINGLE_DELETIONS, // false
  flipHingesOnClosestWindow: FLIP_HINGES_ON_CLOSEST_WINDOW, // true -- the flip depends entirely on kEnd = 21.0
  ceilingNotSelectedRobust: CEILING_NOT_SELECTED_ROBUST, // true -- log beats the bounded ceiling under every deletion
  finding: {
    F1_delete_200_does_not_undo_the_flip:
      'On {14..21} minus 20.0 the linear fit still beats log (R^2 ~ 0.99473 > 0.99131; AIC_lin ~ -116.43 < ' +
      'AIC_log ~ -109.44; log-minus-lin AIC gap ~ +6.99, slightly wider than the full-grid +6.09). ' +
      'linearOvertakesLog stays true.',
    F2_delete_205_does_not_undo_the_flip:
      'On {14..21} minus 20.5 linear still beats log (R^2 ~ 0.99373 > 0.99043; AIC_lin ~ -114.77 < AIC_log ' +
      '~ -108.87; log-minus-lin AIC gap ~ +5.90, marginally narrower than +6.09 but firmly positive). ' +
      'linearOvertakesLog stays true.',
    F3_delete_210_reverses_the_flip:
      'On {14..21} minus 21.0 -- dropping the single closest-to-pole, steepest-jump window (peak +0.996333) -- ' +
      'the log fit reclaims the win: R^2_log ~ 0.99849 > R^2_lin ~ 0.99692, AIC_log ~ -136.44 < AIC_lin ' +
      '~ -126.50, and the log-minus-lin AIC gap FLIPS SIGN to ~ -9.94. linearOvertakesLog goes false. The ' +
      'imp-34233 F4 verdict hinges ENTIRELY on kEnd = 21.0; it survives deleting either of the other two ' +
      'near-pole windows but not this one.',
    F4_bounded_ceiling_never_selected_under_any_deletion:
      'Across all three LOO subsets the unbounded log form beats the bounded a - b/kEnd ceiling (sat-minus-log ' +
      'AIC gap ~ +10.32, +9.27, +17.33 for the 20.0 / 20.5 / 21.0 deletions -- all strongly positive). ' +
      'Deleting kEnd = 21.0 lowers the nominal ceiling to a ~ 1.98970 and sharpens the bounded fit (R^2 ' +
      '~ 0.99478) but log still beats it by ~ +17.33. The imp-34233 ceilingNotSelected reading is robust to ' +
      'every single near-pole deletion; only the finer log-vs-linear ranking is fragile.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / GROWTH-FORM ROBUSTNESS (frontier-direction, NOT rigorous). Leave-one-out over the three ' +
    'imp-34169 near-pole windows (kEnd 20.0, 20.5, 21.0) on the imp-34233 combined kEnd = 14..21 grid shows ' +
    'the imp-34233 F4 linear-overtakes-log flip is FRAGILE: it survives deleting kEnd = 20.0 (log-minus-lin ' +
    'AIC gap ~ +6.99) and kEnd = 20.5 (~ +5.90) but is REVERSED by deleting the single closest-to-pole ' +
    'window kEnd = 21.0 (the steepest jump, peak +0.996333), where the log fit reclaims the win (AIC_log ' +
    '~ -136.44 < AIC_lin ~ -126.50; the log-minus-lin AIC gap flips sign to ~ -9.94). The linear-beats-log ' +
    'verdict is NOT stable to any single deletion -- it hinges entirely on kEnd = 21.0. However the coarser ' +
    'imp-34233 verdict that the bounded a - b/kEnd ceiling is NOT selected (log beats the ceiling) is ROBUST ' +
    'to every single near-pole deletion: the sat-minus-log AIC gap stays strongly positive (+10.32 / +9.27 / ' +
    '+17.33). The re-acceleration s single steepest window carries the log-vs-linear flip; the ' +
    'keeps-climbing / no-finite-ceiling reading does not depend on any one window. Distinct from any form ' +
    'selection; the imp-33843 log-linear-over-power-law verdict and the imp-34109 / imp-34169 / imp-34233 ' +
    'findings this perturbs are untouched. The OLS surrogate, the bounded-ceiling fit, and the growth-form ' +
    'classification are descriptive, not derived; the component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34233 (the F4 linear-overtakes-log flip and the 15-window combined grid this leaves-one-out; ' +
    'machinery reused verbatim); imp-34169 (the three near-pole windows kEnd 20/20.5/21); imp-34109 (the ' +
    'kEnd = 14..20 base grid); imp-33843 (the unbounded log form); imp-33810 (the k=6.. ladder reused ' +
    'verbatim); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping ' +
    '(effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34309_COMBINED_GRID_LOO_LINEAR_FLIP_ROBUSTNESS_ASSERTIONS = [
  {
    // Baseline gate: the full 15-window grid reproduces the imp-34233 F4 flip (linear overtakes log).
    id: 'imp34309-full-grid-reproduces-imp34233-linear-flip',
    description: '15-window grid: linearOvertakesLog true, AIC_lin ~ -124.12 < AIC_log ~ -118.03, log-minus-lin gap ~ +6.09',
    holds: () =>
      FULL.n === 15 &&
      FULL.linearOvertakesLog === true &&
      Math.abs(FULL.linAic - -124.12) < 0.2 &&
      Math.abs(FULL.logAic - -118.03) < 0.2 &&
      FULL.aicGapLogMinusLin > 0,
  },
  {
    // (F1/F2) Deleting kEnd 20.0 or 20.5 does NOT undo the flip -- linear still wins, gap stays positive.
    id: 'imp34309-flip-survives-deleting-20p0-and-20p5',
    description: 'LOO minus kEnd 20.0 and minus kEnd 20.5 both keep linearOvertakesLog true with positive log-minus-lin AIC gap',
    holds: () =>
      LOO_20_0.n === 14 &&
      LOO_20_5.n === 14 &&
      LOO_20_0.linearOvertakesLog === true &&
      LOO_20_5.linearOvertakesLog === true &&
      LOO_20_0.aicGapLogMinusLin > 0 &&
      LOO_20_5.aicGapLogMinusLin > 0,
  },
  {
    // (F3) Deleting the closest-to-pole window kEnd 21.0 REVERSES the flip: log reclaims, gap flips negative.
    id: 'imp34309-flip-reverses-deleting-21p0',
    description: 'LOO minus kEnd 21.0: linearOvertakesLog false, AIC_log ~ -136.44 < AIC_lin ~ -126.50, log-minus-lin gap flips to ~ -9.94',
    holds: () =>
      LOO_21_0.n === 14 &&
      LOO_21_0.linearOvertakesLog === false &&
      LOO_21_0.logAic < LOO_21_0.linAic &&
      LOO_21_0.aicGapLogMinusLin < 0 &&
      Math.abs(LOO_21_0.aicGapLogMinusLin - -9.94) < 0.3,
  },
  {
    // Headline: the flip hinges on the single closest window, is NOT stable to all single deletions.
    id: 'imp34309-flip-hinges-on-closest-window-not-stable',
    description: 'flipHingesOnClosestWindow true, flipStableToAllSingleDeletions false',
    holds: () =>
      FLIP_HINGES_ON_CLOSEST_WINDOW === true &&
      FLIP_STABLE_TO_ALL_SINGLE_DELETIONS === false,
  },
  {
    // (F4) The bounded ceiling is never selected under any single deletion -- log beats it every time.
    id: 'imp34309-bounded-ceiling-not-selected-robust',
    description: 'every LOO subset has sat-minus-log AIC gap > 0 (log beats the bounded ceiling); ceilingNotSelectedRobust true',
    holds: () =>
      CEILING_NOT_SELECTED_ROBUST === true &&
      LOO.every((r) => r.aicGapSatMinusLog > 5),
  },
  {
    // Honesty gate: measurement only, isRigorous false, imp-34233 untouched, no QED, no refereed bound is changed.
    id: 'imp34309-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, imp-34233 untouched, NOT a rigorous asymptotic, no QED, no refereed bound is changed, imp-3066 K_a>=0 untouched, imp-486 C_mb untouched',
    holds: () =>
      IMP34309_COMBINED_GRID_LOO_LINEAR_FLIP_ROBUSTNESS.isRigorous === false &&
      /NOT a rigorous asymptotic/.test(IMP34309_COMBINED_GRID_LOO_LINEAR_FLIP_ROBUSTNESS.verdict) &&
      /are untouched/.test(IMP34309_COMBINED_GRID_LOO_LINEAR_FLIP_ROBUSTNESS.verdict) &&
      /NO QED/.test(IMP34309_COMBINED_GRID_LOO_LINEAR_FLIP_ROBUSTNESS.verdict) &&
      /refereed bound is changed/i.test(IMP34309_COMBINED_GRID_LOO_LINEAR_FLIP_ROBUSTNESS.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34309_COMBINED_GRID_LOO_LINEAR_FLIP_ROBUSTNESS.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34309_COMBINED_GRID_LOO_LINEAR_FLIP_ROBUSTNESS.verdict),
  },
];

for (const a of IMP34309_COMBINED_GRID_LOO_LINEAR_FLIP_ROBUSTNESS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34309-combined-grid-loo-linear-flip-robustness assertion failed: ${a.id}`);
  }
}
