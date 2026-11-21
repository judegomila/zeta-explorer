/**
 * @module imp-34404-full-jackknife-linear-flip-robustness
 *
 * imp-34404 (numerical, frontier-direction): imp-34309 only leave-one-out tested the THREE near-pole windows
 * (kEnd 20.0, 20.5, 21.0) of the imp-34233 combined kEnd = 14..21 grid, and found the imp-34233 F4
 * linear-overtakes-log flip hinges on the single closest-to-pole window kEnd = 21.0. But the OTHER twelve
 * windows (kEnd 14.0 .. 19.5) were never deleted, so the claim that the flip is reversed by exactly ONE window
 * was untested over the full grid. This module extends the imp-34309 leave-one-out to a COMPLETE jackknife:
 * it deletes EACH of the 15 windows kEnd = 14.0, 14.5, ..., 21.0 in turn, re-runs the identical
 * linear-vs-log-vs-bounded AIC contest on every 14-window subset, and reports the complete set of
 * flip-reversing deletions plus the log-minus-linear AIC gap for every single deletion.
 *
 * THE MEASUREMENT (imp-34309/imp-34233 machinery reused verbatim; only the jackknife loop widened to all 15)
 * -------------------------------------------------------------------------------------------------------------
 *   Component model  sigma(N) = E_coll/(E_trunc + E_flow + E_coll), the inherited imp-3220/imp-3406
 *                    sub-terms EXACTLY as in imp-33810/imp-34109/imp-34169/imp-34233/imp-34309.
 *   Full grid        kEnd = 14.0, 14.5, ..., 21.0 (15 windows) -- the imp-34233 combined grid, bit-for-bit.
 *   Fixed-band peak  the largest signed residual among rungs with k <= 10.00 -- the identical
 *                    boundary-independent band imp-33940 R2 / imp-34040 / imp-34109 / imp-34169 / imp-34233 tracked.
 *   Jackknife        fifteen 14-window grids, each dropping ONE of the kEnd = 14.0 .. 21.0 windows in turn.
 *   Contest          each subset s 14 fixed-band peaks are fit as peak = a - b/kEnd (bounded), peak = a + b ln(kEnd)
 *                    (unbounded log, the imp-33843 form), and peak = a + b kEnd (unbounded linear); R^2, SSR, and
 *                    AIC = n ln(SSR/n) + 2K (K = 3) are reported. The headline is the log-minus-linear AIC gap:
 *                    positive => linear still overtakes log; negative => that single deletion reverses the flip.
 *
 * THE FINDING (measurement only -- exactly ONE of the 15 windows reverses the flip: the closest-to-pole kEnd = 21.0)
 * -------------------------------------------------------------------------------------------------------------
 *   (F1) THE FLIP-REVERSING SET IS THE SINGLETON {kEnd = 21.0}. Across all 15 single-window deletions the
 *        linear-beats-log verdict survives fourteen of them and is reversed by exactly one -- deleting the
 *        single closest-to-pole, steepest-jump window kEnd = 21.0 (peak +0.996333), where the log fit reclaims
 *        the win (AIC_log ~ -136.44 < AIC_lin ~ -126.50; the log-minus-linear AIC gap flips sign to ~ -9.94).
 *        imp-34309 established this for the near-pole subset; the FULL jackknife confirms no OTHER window
 *        deletion (14.0 .. 20.5) reverses it. The reverser set is a singleton.
 *   (F2) THE OTHER FOURTEEN DELETIONS ALL KEEP LINEAR WINNING, with the log-minus-linear AIC gap staying
 *        strictly positive across the whole non-near-pole span kEnd = 14.0 .. 20.5: gaps run from ~ +5.09
 *        (narrowest, deleting kEnd = 18.5) to ~ +6.99 (widest, deleting kEnd = 20.0). The full-grid gap is
 *        ~ +6.09. So the flip is broadly stable to deleting any window OTHER than the closest-to-pole one.
 *   (F3) THE MOST FLIP-FRAGILE NON-REVERSING DELETION IS kEnd = 18.5, NOT A NEAR-POLE WINDOW. Deleting the
 *        mid-grid window kEnd = 18.5 leaves the narrowest surviving linear lead (log-minus-linear AIC gap
 *        ~ +5.09) -- narrower than deleting either near-pole window kEnd = 20.5 (~ +5.90) or kEnd = 20.0
 *        (~ +6.99). The imp-34309 near-pole-only leave-one-out missed this: the single deletion that most
 *        erodes (without reversing) the linear lead sits in the middle of the grid, not near the pole.
 *   (F4) THE BOUNDED CEILING IS NEVER SELECTED UNDER ANY SINGLE DELETION. Across all 15 jackknife subsets the
 *        unbounded log form beats the bounded a - b/kEnd ceiling (the sat-minus-log AIC gap stays strictly
 *        positive, ranging ~ +8.53 .. +17.33, minimum at deleting kEnd = 14.0, maximum at kEnd = 21.0). The
 *        imp-34233 / imp-34309 ceilingNotSelected reading is ROBUST to every single window deletion, not just
 *        the near-pole three; only the finer log-vs-linear ranking is fragile, and only to the one window.
 *
 * The punchline: the complete jackknife pins the flip-reversing set to the EXACT singleton {kEnd = 21.0}. The
 * imp-34233 F4 linear-overtakes-log flip is reversed by deleting exactly one of the 15 windows -- the single
 * closest-to-pole window -- and survives all fourteen other deletions (log-minus-linear AIC gap +5.09 .. +6.99).
 * A detail invisible to the imp-34309 near-pole-only leave-one-out: the deletion that most narrows the surviving
 * linear lead is the mid-grid kEnd = 18.5 (gap +5.09), not a near-pole window. The coarser verdict that the
 * bounded a - b/kEnd ceiling is not selected (log beats the ceiling) is robust to every single deletion
 * (sat-minus-log AIC gap +8.53 .. +17.33). The re-acceleration s single steepest window carries the whole
 * log-vs-linear flip; the keeps-climbing / no-finite-ceiling reading depends on no single window.
 *
 * MEASUREMENT / GROWTH-FORM CONTEST ONLY. A descriptive full-jackknife robustness re-run of the inherited
 * imp-34233 residual-growth contest, NOT an RH bound and distinct from any form selection (the imp-33843
 * log-linear-over-power-law verdict and the imp-34109 / imp-34169 / imp-34233 / imp-34309 findings it extends
 * are untouched). The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the OLS surrogate, the bounded-ceiling fit, and the growth-form classification are descriptive,
 * not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34309-combined-grid-loo-linear-flip-robustness (the near-pole-only leave-one-out this completes to a
 *   full jackknife; machinery reused verbatim)
 * @see imp-34233-fixed-band-peak-combined-grid-ceiling-contest (the F4 linear-overtakes-log flip and the 15-window grid)
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
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), verbatim imp-34309
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-33810 sub-terms (no re-derivation) -- verbatim imp-34309.
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

// imp-33810 quarter-decade ladder eflow_over_resid over k = 6.00 .. kEnd (inclusive), verbatim imp-34309.
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

// The linear-vs-log-vs-bounded AIC contest on an arbitrary (kEnds, peaks) subset -- imp-34309 machinery.
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

// FULL JACKKNIFE: delete EACH of the 15 windows kEnd = 14.0 .. 21.0 in turn (extends the imp-34309 near-pole-only LOO).
const JACKKNIFE = K_ENDS.map((del, idx) => {
  const kk = K_ENDS.filter((_, i) => i !== idx);
  const pp = FB_PEAKS.filter((_, i) => i !== idx);
  return { deletedWindow: del, ...contest(kk, pp) };
});

// The complete set of single-window deletions that REVERSE the linear-beats-log flip.
const FLIP_REVERSING_DELETIONS = JACKKNIFE.filter((r) => !r.linearOvertakesLog).map((r) => r.deletedWindow);
const REVERSER_SET_IS_SINGLETON_21 =
  FLIP_REVERSING_DELETIONS.length === 1 && FLIP_REVERSING_DELETIONS[0] === 21.0; // true
// Among the fourteen NON-reversing deletions, the one leaving the narrowest surviving linear lead.
const SURVIVORS = JACKKNIFE.filter((r) => r.linearOvertakesLog);
const MOST_FRAGILE_SURVIVOR = SURVIVORS.reduce((m, r) => (r.aicGapLogMinusLin < m.aicGapLogMinusLin ? r : m));
const WIDEST_SURVIVOR = SURVIVORS.reduce((m, r) => (r.aicGapLogMinusLin > m.aicGapLogMinusLin ? r : m));
// The coarser imp-34233 verdict -- the bounded ceiling is not selected -- is robust to every single deletion.
const CEILING_NOT_SELECTED_ROBUST = JACKKNIFE.every((r) => r.aicGapSatMinusLog > 0) && FULL.aicGapSatMinusLog > 0; // true

export const IMP34404_FULL_JACKKNIFE_LINEAR_FLIP_ROBUSTNESS = {
  id: 'imp-34404',
  proofSection: 'S-frontier',
  question:
    'imp-34309 leave-one-out tested only the three near-pole windows (kEnd 20.0, 20.5, 21.0) of the imp-34233 ' +
    'combined kEnd = 14..21 grid and found the F4 linear-overtakes-log flip hinges on kEnd = 21.0. Extending ' +
    'the leave-one-out to a COMPLETE jackknife over all 15 windows kEnd = 14.0 .. 21.0, what is the full set of ' +
    'single-window deletions that reverse the flip, and what is the log-minus-linear AIC gap for every single ' +
    'deletion? Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'For the full imp-34233 15-window grid and for each of the fifteen 14-window jackknife subsets (dropping ' +
    'kEnd = 14.0, 14.5, ..., 21.0 in turn): the bounded a - b/kEnd ceiling, the unbounded log fit, and the ' +
    'unbounded linear fit by R^2 and AIC = n ln(SSR/n) + 2K, the log-minus-linear AIC gap (sign flip => the ' +
    'linear verdict reverses for that deletion), and the sat-minus-log AIC gap (bounded ceiling selection)',
  fullGridPeaks: FB_PEAKS, // [0.383861, ..., 0.865303, 0.915942, 0.996333]
  windows: K_ENDS, // [14.0, 14.5, ..., 21.0]
  fullGrid: FULL, // 15-window imp-34233 baseline: linearOvertakesLog === true, aicGapLogMinusLin ~ +6.09
  jackknife: JACKKNIFE, // fifteen 14-window subsets, one per deleted window
  flipReversingDeletions: FLIP_REVERSING_DELETIONS, // [21.0] -- the complete reverser set
  reverserSetIsSingleton21: REVERSER_SET_IS_SINGLETON_21, // true -- exactly one window reverses the flip
  mostFragileSurvivorWindow: MOST_FRAGILE_SURVIVOR.deletedWindow, // 18.5 -- narrowest surviving linear lead
  mostFragileSurvivorGap: MOST_FRAGILE_SURVIVOR.aicGapLogMinusLin, // ~ +5.09
  widestSurvivorWindow: WIDEST_SURVIVOR.deletedWindow, // 20.0 -- widest surviving linear lead
  widestSurvivorGap: WIDEST_SURVIVOR.aicGapLogMinusLin, // ~ +6.99
  ceilingNotSelectedRobust: CEILING_NOT_SELECTED_ROBUST, // true -- log beats the bounded ceiling under every deletion
  finding: {
    F1_reverser_set_is_singleton_21:
      'Across all 15 single-window deletions the linear-beats-log verdict survives fourteen and is reversed ' +
      'by exactly one -- deleting the closest-to-pole window kEnd = 21.0 (peak +0.996333), where log reclaims ' +
      'the win (AIC_log ~ -136.44 < AIC_lin ~ -126.50; log-minus-linear AIC gap ~ -9.94). No other window ' +
      'deletion (14.0 .. 20.5) reverses it; the flip-reversing set is the singleton {21.0}.',
    F2_other_fourteen_keep_linear_winning:
      'The other fourteen deletions all keep linear winning with the log-minus-linear AIC gap strictly ' +
      'positive across kEnd = 14.0 .. 20.5: from ~ +5.09 (narrowest, deleting kEnd = 18.5) to ~ +6.99 ' +
      '(widest, deleting kEnd = 20.0). The full-grid gap is ~ +6.09.',
    F3_most_fragile_survivor_is_mid_grid_18p5:
      'The single non-reversing deletion leaving the narrowest surviving linear lead is the MID-GRID window ' +
      'kEnd = 18.5 (log-minus-linear AIC gap ~ +5.09) -- narrower than deleting either near-pole window ' +
      'kEnd = 20.5 (~ +5.90) or kEnd = 20.0 (~ +6.99). The imp-34309 near-pole-only leave-one-out missed this: ' +
      'the deletion that most erodes (without reversing) the linear lead sits in the middle of the grid.',
    F4_bounded_ceiling_never_selected_under_any_deletion:
      'Across all 15 jackknife subsets the unbounded log form beats the bounded a - b/kEnd ceiling (sat-minus-log ' +
      'AIC gap strictly positive, ~ +8.53 .. +17.33; minimum deleting kEnd = 14.0, maximum deleting kEnd = 21.0). ' +
      'The imp-34233 / imp-34309 ceilingNotSelected reading is robust to every single window deletion; only the ' +
      'finer log-vs-linear ranking is fragile, and only to the one window kEnd = 21.0.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / GROWTH-FORM ROBUSTNESS (frontier-direction, NOT rigorous). A complete jackknife over all 15 ' +
    'windows kEnd = 14.0 .. 21.0 of the imp-34233 combined grid pins the flip-reversing set to the EXACT ' +
    'singleton {kEnd = 21.0}: the imp-34233 F4 linear-overtakes-log flip survives fourteen of the fifteen ' +
    'single-window deletions (log-minus-linear AIC gap staying positive, +5.09 .. +6.99) and is reversed by ' +
    'exactly one -- deleting the single closest-to-pole, steepest-jump window kEnd = 21.0 (peak +0.996333), ' +
    'where log reclaims the win (AIC_log ~ -136.44 < AIC_lin ~ -126.50; the log-minus-linear AIC gap flips ' +
    'sign to ~ -9.94). This confirms and completes the imp-34309 near-pole-only leave-one-out. A detail ' +
    'invisible to that near-pole subset: the deletion leaving the narrowest surviving linear lead is the ' +
    'MID-GRID window kEnd = 18.5 (gap ~ +5.09), not a near-pole window. The coarser imp-34233 verdict that the ' +
    'bounded a - b/kEnd ceiling is NOT selected (log beats the ceiling) is ROBUST to every single deletion ' +
    '(sat-minus-log AIC gap +8.53 .. +17.33). The re-acceleration s single steepest window carries the whole ' +
    'log-vs-linear flip; the keeps-climbing / no-finite-ceiling reading depends on no single window. Distinct ' +
    'from any form selection; the imp-33843 log-linear-over-power-law verdict and the imp-34109 / imp-34169 / ' +
    'imp-34233 / imp-34309 findings this extends are untouched. The OLS surrogate, the bounded-ceiling fit, ' +
    'and the growth-form classification are descriptive, not derived; the component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34309 (the near-pole-only leave-one-out this completes to a full jackknife; machinery reused verbatim); ' +
    'imp-34233 (the F4 linear-overtakes-log flip and the 15-window combined grid); imp-34169 (the three ' +
    'near-pole windows kEnd 20/20.5/21); imp-34109 (the kEnd = 14..20 base grid); imp-33843 (the unbounded log ' +
    'form); imp-33810 (the k=6.. ladder reused verbatim); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc ' +
    'fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34404_FULL_JACKKNIFE_LINEAR_FLIP_ROBUSTNESS_ASSERTIONS = [
  {
    // Baseline gate: the full 15-window grid reproduces the imp-34233 F4 flip (linear overtakes log).
    id: 'imp34404-full-grid-reproduces-imp34233-linear-flip',
    description: '15-window grid: linearOvertakesLog true, AIC_lin ~ -124.12 < AIC_log ~ -118.03, log-minus-lin gap ~ +6.09',
    holds: () =>
      FULL.n === 15 &&
      FULL.linearOvertakesLog === true &&
      Math.abs(FULL.linAic - -124.12) < 0.2 &&
      Math.abs(FULL.logAic - -118.03) < 0.2 &&
      FULL.aicGapLogMinusLin > 0,
  },
  {
    // Headline: the jackknife spans all 15 windows and the flip-reversing set is exactly {kEnd = 21.0}.
    id: 'imp34404-reverser-set-is-singleton-21',
    description: 'Full jackknife over 15 windows: exactly one deletion (kEnd 21.0) reverses the flip; every subset is a 14-window fit',
    holds: () =>
      JACKKNIFE.length === 15 &&
      JACKKNIFE.every((r) => r.n === 14) &&
      FLIP_REVERSING_DELETIONS.length === 1 &&
      FLIP_REVERSING_DELETIONS[0] === 21.0 &&
      REVERSER_SET_IS_SINGLETON_21 === true,
  },
  {
    // The single reverser kEnd 21.0: log reclaims, log-minus-lin gap flips negative to ~ -9.94.
    id: 'imp34404-single-reverser-21-flips-gap-negative',
    description: 'Deleting kEnd 21.0: linearOvertakesLog false, AIC_log ~ -136.44 < AIC_lin ~ -126.50, log-minus-lin gap ~ -9.94',
    holds: () => {
      const r = JACKKNIFE.find((x) => x.deletedWindow === 21.0);
      return (
        r.linearOvertakesLog === false &&
        r.logAic < r.linAic &&
        r.aicGapLogMinusLin < 0 &&
        Math.abs(r.aicGapLogMinusLin - -9.94) < 0.3
      );
    },
  },
  {
    // The other fourteen deletions all keep linear winning with a strictly positive log-minus-lin gap.
    id: 'imp34404-fourteen-survivors-keep-linear-winning',
    description: 'Every deletion other than kEnd 21.0 keeps linearOvertakesLog true with log-minus-lin AIC gap > 0',
    holds: () =>
      SURVIVORS.length === 14 &&
      SURVIVORS.every((r) => r.linearOvertakesLog === true && r.aicGapLogMinusLin > 0),
  },
  {
    // New detail: the narrowest surviving linear lead is the MID-GRID window kEnd 18.5, ~ +5.09, not near-pole.
    id: 'imp34404-most-fragile-survivor-is-mid-grid-18p5',
    description: 'The non-reversing deletion with the narrowest surviving linear lead is kEnd 18.5 (log-minus-lin gap ~ +5.09)',
    holds: () =>
      MOST_FRAGILE_SURVIVOR.deletedWindow === 18.5 &&
      Math.abs(MOST_FRAGILE_SURVIVOR.aicGapLogMinusLin - 5.09) < 0.2 &&
      WIDEST_SURVIVOR.deletedWindow === 20.0,
  },
  {
    // (F4) The bounded ceiling is never selected under any single deletion -- log beats it every time.
    id: 'imp34404-bounded-ceiling-not-selected-robust',
    description: 'every jackknife subset has sat-minus-log AIC gap > 0 (log beats the bounded ceiling); ceilingNotSelectedRobust true',
    holds: () =>
      CEILING_NOT_SELECTED_ROBUST === true &&
      JACKKNIFE.every((r) => r.aicGapSatMinusLog > 5),
  },
  {
    // Honesty gate: measurement only, isRigorous false, imp-34309/imp-34233 untouched, no QED, no refereed bound is changed.
    id: 'imp34404-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, imp-34309/imp-34233 untouched, NOT a rigorous asymptotic, no QED, no refereed bound is changed, imp-3066 K_a>=0 untouched, imp-486 C_mb untouched',
    holds: () =>
      IMP34404_FULL_JACKKNIFE_LINEAR_FLIP_ROBUSTNESS.isRigorous === false &&
      /NOT a rigorous asymptotic/.test(IMP34404_FULL_JACKKNIFE_LINEAR_FLIP_ROBUSTNESS.verdict) &&
      /are untouched/.test(IMP34404_FULL_JACKKNIFE_LINEAR_FLIP_ROBUSTNESS.verdict) &&
      /NO QED/.test(IMP34404_FULL_JACKKNIFE_LINEAR_FLIP_ROBUSTNESS.verdict) &&
      /refereed bound is changed/i.test(IMP34404_FULL_JACKKNIFE_LINEAR_FLIP_ROBUSTNESS.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34404_FULL_JACKKNIFE_LINEAR_FLIP_ROBUSTNESS.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34404_FULL_JACKKNIFE_LINEAR_FLIP_ROBUSTNESS.verdict),
  },
];

for (const a of IMP34404_FULL_JACKKNIFE_LINEAR_FLIP_ROBUSTNESS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34404-full-jackknife-linear-flip-robustness assertion failed: ${a.id}`);
  }
}
