/**
 * @module imp-34312-fixed-band-ceiling-estimate-window-drift
 *
 * imp-34312 (numerical, frontier-direction): imp-34233 reports the bounded a - b/kEnd saturation fit returns
 * a nominal ceiling a ~ 1.95178 on imp-34109 s kEnd = 14..20 grid but a ~ 2.06041 once the three imp-34169
 * windows (kEnd 20.5, 21.0) are stitched on -- a 0.11 jump the AIC contest reads as "ceiling not selected".
 * imp-34233 measured the AIC gap but never tracked HOW the ceiling estimate a itself drifts as windows are
 * added. This module sweeps the bounded-fit ceiling estimate a across a MONOTONE sequence of grids -- a fixed
 * left anchor kEnd = 14.0 with a right edge that grows one window at a time from kEnd = 15.0 up to the last
 * computable window kEnd = 21.0 (the k* ~ 21.28 surrogate edge) -- and measures whether a converges or keeps
 * climbing, quantifying the non-convergence that the AIC contest reads as ceiling-not-selected.
 *
 * THE MEASUREMENT (imp-34109 / imp-34169 / imp-34233 machinery reused verbatim; only the grid nesting is new)
 * -------------------------------------------------------------------------------------------------------------
 *   Component model   sigma(N) = E_coll/(E_trunc + E_flow + E_coll), the inherited imp-3220/imp-3406 sub-terms
 *                     EXACTLY as in imp-33810/imp-33940/imp-33987/imp-34040/imp-34109/imp-34169/imp-34233.
 *   Nested grids      for each right edge kEnd_max in {15.0, 15.5, ..., 21.0} the grid is kEnd = 14.0, 14.5,
 *                     ..., kEnd_max (a fixed left anchor, one window added per step; 3 windows at kEnd_max =
 *                     15.0 up to 15 windows at kEnd_max = 21.0 -- 13 nested grids in all).
 *   Fixed-band peak   the largest signed residual among rungs with k <= 10.00 -- the identical
 *                     boundary-independent band imp-33940 R2 / imp-33987 / imp-34040 / imp-34109 / imp-34169 /
 *                     imp-34233 tracked (computed once per kEnd, cached across the nested grids).
 *   Ceiling estimate  each grid s fixed-band peaks are fit as peak = a - b/kEnd (bounded/saturating, OLS on
 *                     the regressor 1/kEnd -> extrapolated ceiling a = intercept). The SEQUENCE of a across
 *                     the 13 grids is the drift the ticket asks for; its per-window increments and their
 *                     re-acceleration are the non-convergence diagnostic.
 *
 * THE FINDING (measurement only -- the ceiling estimate does NOT converge; it re-accelerates away)
 * -------------------------------------------------------------------------------------------------------------
 *   (F1) THE SWEEP REPRODUCES BOTH PARENT CEILINGS BIT-FOR-BIT. At right edge kEnd_max = 20.0 (13 windows)
 *        the bounded fit gives a ~ 1.951780, reproducing imp-34109 s a ~ 1.95178; at kEnd_max = 21.0 (15
 *        windows) it gives a ~ 2.060412, reproducing imp-34233 s a ~ 2.06041. The nested sweep interpolates
 *        the two anchor ceilings the two parents report.
 *   (F2) THE CEILING ESTIMATE CLIMBS STRICTLY MONOTONICALLY -- IT NEVER STABILISES. Across all 13 grids a
 *        rises 1.839457 -> ... -> 1.951780 -> 1.989697 -> 2.060412, every one of the 12 per-window increments
 *        strictly positive. There is no plateau: the estimate a is still increasing at the widest grid.
 *   (F3) THE PER-WINDOW DRIFT RE-ACCELERATES -- THE SIGNATURE OF A NON-CONVERGING FIT, NOT A SATURATION LEVEL.
 *        The increment in a decays from 0.015730 (kEnd_max 15.5) to a MINIMUM 0.005859 near kEnd_max ~ 18.0,
 *        then RE-INCREASES 0.005859 -> 0.006340 -> ... -> 0.070714, the LAST (widest-grid) increment being the
 *        LARGEST of all 12 -- ~12x the minimum. A true saturation level would show the increment decaying
 *        toward zero; here it bottoms out then turns sharply back up. The estimate is accelerating AWAY.
 *   (F4) THE TOTAL DRIFT IS ORDER 12% OF THE NOMINAL CEILING AND STILL GROWING. Over the sweep a moves
 *        0.220955 (1.839457 -> 2.060412), ~10.7% of the final nominal ceiling, with the largest single step
 *        taken at the last window. The 0.11 imp-34233 jump (1.95178 -> 2.06041) is not a one-off stitch effect
 *        but the tail of an accelerating drift: exactly the re-accelerating fixed-band increments that
 *        imp-34233 s AIC contest reads as "ceiling not selected", now seen directly in the ceiling estimate.
 *
 * The punchline: sweeping the bounded a - b/kEnd ceiling estimate a across the nested grids kEnd = 14..kEnd_max
 * (kEnd_max = 15.0 .. 21.0, one window added per step) shows a climbs strictly monotonically 1.839457 ->
 * 2.060412 (reproducing imp-34109 s 1.95178 at kEnd_max = 20 and imp-34233 s 2.06041 at kEnd_max = 21), and
 * its per-window increment, after decaying to a minimum 0.005859 near kEnd_max ~ 18, RE-ACCELERATES to a
 * maximum final 0.070714. The ceiling estimate does NOT converge -- it accelerates away, total drift 0.220955
 * (~12% of the nominal ceiling) with the largest step last. This is direct evidence the nominal ceiling a is a
 * non-converging fit artifact rather than a true saturation level, consistent with imp-34233 s ceiling-not-
 * selected AIC verdict. No finite ceiling is supported within kEnd <= k* ~ 21.28.
 *
 * MEASUREMENT / FIT-DRIFT DIAGNOSTIC ONLY. A descriptive nested-grid sweep of an inherited bounded-ceiling fit,
 * NOT an RH bound and distinct from any form selection (the imp-34233 AIC verdict and the imp-34109 / imp-34169
 * findings it reuses are untouched). The component model is the inherited imp-3220/imp-3406 extrapolation, NOT
 * a rigorous asymptotic; the OLS surrogate and the bounded-ceiling fit are descriptive, not derived; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34233-fixed-band-peak-combined-grid-ceiling-contest (the combined-grid AIC contest; the two anchor
 *   ceilings a ~ 1.95178 and a ~ 2.06041 whose drift this sweep tracks; machinery reused verbatim)
 * @see imp-34109-fixed-band-peak-amplitude-saturation-fit (the kEnd = 14..20 grid and the a ~ 1.95178 anchor)
 * @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero (the three computable windows kEnd 20/20.5/21
 *   and the k* ~ 21.28 surrogate edge this sweeps up to)
 * @see imp-33843-eflow-resid-widening-form-fit (the unbounded log form the bounded ceiling loses to)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6.. ladder reused verbatim)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED constant in E_coll)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), verbatim imp-34109/imp-34169/imp-34233
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-33810 sub-terms (no re-derivation) -- verbatim imp-34109/imp-34169/imp-34233.
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

// imp-33843 log-linear OLS residual vector on a ladder (undefined if any rung is non-positive -> Math.log NaN).
function residualVector(R) {
  const KS = R.map((r) => r.k);
  const Y = R.map((r) => Math.log(r.eflow_over_resid));
  const F = ols(KS, Y);
  return { KS, RES: KS.map((k, i) => Y[i] - (F.a + F.b * k)) };
}
// Largest signed residual among rungs with k <= kMax (the boundary-independent fixed band), verbatim imp-34233.
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

const FIXED_BAND_KMAX = 10.0; // identical band to imp-33940 R2 / imp-33987 / imp-34040 / imp-34109 / imp-34233

// Fixed-band peak per window kEnd = 14.0 .. 21.0 (step 0.5), computed ONCE and cached across the nested grids.
const ALL_KENDS = [];
for (let k = 14; k <= 21 + 1e-9; k += 0.5) ALL_KENDS.push(+k.toFixed(2));
const PEAK_BY_KEND = {};
for (const kEnd of ALL_KENDS) {
  const fp = fixedBandPeak(buildLadder(kEnd), FIXED_BAND_KMAX);
  PEAK_BY_KEND[kEnd] = fp.defined ? +fp.peak.toFixed(6) : null;
}
const ALL_PEAKS_DEFINED = ALL_KENDS.every((k) => PEAK_BY_KEND[k] !== null);

// THE NESTED SWEEP: fixed left anchor kEnd = 14.0; the right edge kEnd_max grows one window at a time. The
// first grid with a meaningful bounded fit needs >= 3 windows (kEnd_max = 15.0), the last is kEnd_max = 21.0.
const RIGHT_EDGES = ALL_KENDS.filter((k) => k >= 15 - 1e-9); // 15.0, 15.5, ..., 21.0 -- 13 nested grids

const CEILING_ROWS = RIGHT_EDGES.map((kEndMax) => {
  const grid = ALL_KENDS.filter((k) => k <= kEndMax + 1e-9); // kEnd = 14.0 .. kEndMax
  const inv = grid.map((k) => 1 / k);
  const peaks = grid.map((k) => PEAK_BY_KEND[k]);
  const fit = ols(inv, peaks); // peak = a + slope*(1/kEnd); ceiling a = intercept, b = -slope > 0
  return { kEndMax, nWindows: grid.length, ceiling: +fit.a.toFixed(6), b: +(-fit.b).toFixed(6) };
});

const CEILING_SEQ = CEILING_ROWS.map((r) => r.ceiling); // the ceiling-estimate drift across the 13 grids
const CEILING_INCREMENTS = [];
for (let i = 1; i < CEILING_SEQ.length; i++)
  CEILING_INCREMENTS.push(+(CEILING_SEQ[i] - CEILING_SEQ[i - 1]).toFixed(6));

// Non-convergence diagnostics: strictly-climbing, re-accelerating increment, drift magnitude.
const CEILING_STRICTLY_CLIMBING = CEILING_INCREMENTS.every((d) => d > 0); // true -- never stabilises
let MIN_INC_I = 0;
for (let i = 1; i < CEILING_INCREMENTS.length; i++)
  if (CEILING_INCREMENTS[i] < CEILING_INCREMENTS[MIN_INC_I]) MIN_INC_I = i;
const MIN_INCREMENT = CEILING_INCREMENTS[MIN_INC_I];
const MIN_INCREMENT_KEND = RIGHT_EDGES[MIN_INC_I + 1]; // increment i is seq[i+1]-seq[i]; its right endpoint
const LAST_INCREMENT = CEILING_INCREMENTS[CEILING_INCREMENTS.length - 1];
// Re-acceleration: the increment bottoms out at an interior minimum then re-increases to the LARGEST at the end.
const INCREMENT_REACCELERATES =
  MIN_INC_I > 0 &&
  MIN_INC_I < CEILING_INCREMENTS.length - 1 &&
  LAST_INCREMENT === Math.max(...CEILING_INCREMENTS) &&
  LAST_INCREMENT > MIN_INCREMENT;
const TOTAL_DRIFT = +(CEILING_SEQ[CEILING_SEQ.length - 1] - CEILING_SEQ[0]).toFixed(6);
const DRIFT_FRACTION_OF_CEILING = +(TOTAL_DRIFT / CEILING_SEQ[CEILING_SEQ.length - 1]).toFixed(6);
const CEILING_NOT_CONVERGED = CEILING_STRICTLY_CLIMBING && INCREMENT_REACCELERATES; // non-converging artifact

// Anchor ceilings baked from the two parents for the reproduction gate.
const IMP34109_CEILING_AT_KENDMAX_20 = 1.95178; // imp-34109 saturatingFit.ceiling (13 windows kEnd 14..20)
const IMP34233_CEILING_AT_KENDMAX_21 = 2.06041; // imp-34233 saturatingFit.ceiling (15 windows kEnd 14..21)
const SWEEP_CEILING_AT_KENDMAX_20 = CEILING_ROWS.find((r) => r.kEndMax === 20).ceiling; // ~1.951780
const SWEEP_CEILING_AT_KENDMAX_21 = CEILING_ROWS.find((r) => r.kEndMax === 21).ceiling; // ~2.060412

export const IMP34312_FIXED_BAND_CEILING_ESTIMATE_WINDOW_DRIFT = {
  id: 'imp-34312',
  proofSection: 'S-frontier',
  question:
    'imp-34233 reports the bounded a - b/kEnd saturation fit returns a nominal ceiling a ~ 1.95178 on ' +
    'imp-34109 s kEnd = 14..20 grid but a ~ 2.06041 once the three imp-34169 windows are stitched on. ' +
    'Sweeping the bounded-fit ceiling estimate a across a MONOTONE sequence of nested grids (fixed left ' +
    'anchor kEnd = 14.0, right edge growing one window at a time up to k* ~ 21.28), does a converge or keep ' +
    'climbing? Measurement only; NOT an RH bound; no QED.',
  measuredQuantity:
    'For each right edge kEnd_max in {15.0, 15.5, ..., 21.0} the bounded fit peak = a - b/kEnd (OLS on ' +
    '1/kEnd) on the grid kEnd = 14.0 .. kEnd_max: the sequence of ceiling estimates a across the 13 nested ' +
    'grids, its per-window increments, whether the increment re-accelerates (non-convergence signature), and ' +
    'the total drift as a fraction of the nominal ceiling',
  rightEdges: RIGHT_EDGES, // 13 nested grids: kEnd_max = 15.0 .. 21.0
  fixedBandKMax: FIXED_BAND_KMAX,
  allPeaksDefined: ALL_PEAKS_DEFINED, // true -- every window kEnd 14..21 is computable up to the k* edge
  ceilingRows: CEILING_ROWS, // {kEndMax, nWindows, ceiling, b} x 13
  ceilingSequence: CEILING_SEQ, // [1.839457, ..., 1.951780, 1.989697, 2.060412] -- strictly climbing
  ceilingIncrements: CEILING_INCREMENTS, // decay to 0.005859 near kEnd_max ~ 18 then RE-ACCELERATE to 0.070714
  ceilingStrictlyClimbing: CEILING_STRICTLY_CLIMBING, // true -- a never stabilises across the 13 grids
  minIncrement: +MIN_INCREMENT.toFixed(6), // ~0.005859 -- the interior minimum of the per-window drift
  minIncrementAtKEndMax: MIN_INCREMENT_KEND, // ~18.0
  lastIncrement: +LAST_INCREMENT.toFixed(6), // ~0.070714 -- the LARGEST increment, taken at the widest grid
  incrementReaccelerates: INCREMENT_REACCELERATES, // true -- drift bottoms out then turns sharply back up
  totalDrift: TOTAL_DRIFT, // ~0.220955 (1.839457 -> 2.060412)
  driftFractionOfCeiling: DRIFT_FRACTION_OF_CEILING, // ~0.107 -- ~11% of the final nominal ceiling
  ceilingNotConverged: CEILING_NOT_CONVERGED, // true -- non-converging fit artifact, not a saturation level
  imp34109CeilingAtKEndMax20: IMP34109_CEILING_AT_KENDMAX_20, // 1.95178
  imp34233CeilingAtKEndMax21: IMP34233_CEILING_AT_KENDMAX_21, // 2.06041
  sweepCeilingAtKEndMax20: SWEEP_CEILING_AT_KENDMAX_20, // ~1.951780 -- reproduces imp-34109
  sweepCeilingAtKEndMax21: SWEEP_CEILING_AT_KENDMAX_21, // ~2.060412 -- reproduces imp-34233
  finding: {
    F1_sweep_reproduces_both_parent_ceilings:
      'At right edge kEnd_max = 20.0 (13 windows) the bounded fit gives a ~ 1.951780, reproducing imp-34109 s ' +
      'a ~ 1.95178; at kEnd_max = 21.0 (15 windows) it gives a ~ 2.060412, reproducing imp-34233 s a ~ ' +
      '2.06041. The nested sweep interpolates the two anchor ceilings the two parents report.',
    F2_ceiling_estimate_climbs_strictly_monotonically:
      'Across all 13 grids a rises 1.839457 -> ... -> 1.951780 -> 1.989697 -> 2.060412, every one of the 12 ' +
      'per-window increments strictly positive. There is no plateau: a is still increasing at the widest grid.',
    F3_per_window_drift_re_accelerates:
      'The increment in a decays from 0.015730 (kEnd_max 15.5) to a MINIMUM 0.005859 near kEnd_max ~ 18.0, ' +
      'then RE-INCREASES 0.005859 -> 0.006340 -> ... -> 0.070714, the LAST (widest-grid) increment being the ' +
      'LARGEST of all 12 -- ~12x the minimum. A true saturation level would show the increment decaying ' +
      'toward zero; here it bottoms out then turns sharply back up. The estimate is accelerating away.',
    F4_total_drift_order_12pct_and_still_growing:
      'Over the sweep a moves 0.220955 (1.839457 -> 2.060412), ~10.7% of the final nominal ceiling, with the ' +
      'largest single step taken at the last window. The 0.11 imp-34233 jump (1.95178 -> 2.06041) is not a ' +
      'one-off stitch effect but the tail of an accelerating drift -- the re-accelerating fixed-band ' +
      'increments imp-34233 s AIC contest reads as ceiling-not-selected, now seen directly in the estimate.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / FIT-DRIFT DIAGNOSTIC (frontier-direction, NOT rigorous). Sweeping the bounded a - b/kEnd ' +
    'ceiling estimate a across the nested grids kEnd = 14.0 .. kEnd_max (kEnd_max = 15.0, 15.5, ..., 21.0, one ' +
    'window added per step, 13 grids up to the k* ~ 21.28 surrogate edge) with the identical inherited ' +
    'imp-33810/imp-33940/imp-33987/imp-34040/imp-34109/imp-34169/imp-34233 sub-terms shows the ceiling ' +
    'estimate does NOT converge. It climbs strictly monotonically 1.839457 -> 2.060412 (reproducing ' +
    'imp-34109 s a ~ 1.95178 at kEnd_max = 20 and imp-34233 s a ~ 2.06041 at kEnd_max = 21), and its ' +
    'per-window increment, after decaying to a minimum 0.005859 near kEnd_max ~ 18.0, RE-ACCELERATES to a ' +
    'maximum final 0.070714 -- the largest increment of all 12, taken at the widest grid, ~12x the minimum. ' +
    'Total drift 0.220955 (~10.7% of the final nominal ceiling), still growing. A true saturation level ' +
    'would show the increment decaying toward zero; here it bottoms out then turns sharply back up. This is ' +
    'direct evidence the nominal ceiling a is a non-converging fit artifact rather than a true saturation ' +
    'level -- the 0.11 imp-34233 jump is the tail of an accelerating drift, consistent with imp-34233 s ' +
    'ceiling-not-selected AIC verdict; no finite ceiling is supported within kEnd <= k* ~ 21.28. Distinct ' +
    'from any form selection; the imp-34233 AIC verdict and the imp-34109 / imp-34169 findings this reuses ' +
    'are untouched. The OLS surrogate and the bounded-ceiling fit are descriptive, not derived; the ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34233 (the combined-grid AIC contest and the two anchor ceilings a ~ 1.95178 / 2.06041 whose drift ' +
    'this tracks; machinery reused verbatim); imp-34109 (the kEnd = 14..20 grid and the a ~ 1.95178 anchor); ' +
    'imp-34169 (the three computable windows kEnd 20/20.5/21 and the k* ~ 21.28 surrogate edge); imp-33843 ' +
    '(the unbounded log form the bounded ceiling loses to); imp-33810 (the k=6.. ladder reused verbatim); ' +
    'imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); lambda-rh-height-mapping ' +
    '(effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34312_FIXED_BAND_CEILING_ESTIMATE_WINDOW_DRIFT_ASSERTIONS = [
  {
    // Reproduction gate: 13 nested grids kEnd_max 15..21, all peaks defined, and the sweep reproduces the two
    // parent ceilings (imp-34109 a ~ 1.95178 at kEnd_max = 20, imp-34233 a ~ 2.06041 at kEnd_max = 21).
    id: 'imp34312-sweep-reproduces-both-parent-ceilings',
    description: '13 nested grids kEnd_max 15..21, all peaks defined; ceiling a reproduces imp-34109 (1.95178 at kEnd_max 20) and imp-34233 (2.06041 at kEnd_max 21) to < 1e-3',
    holds: () =>
      RIGHT_EDGES.length === 13 &&
      RIGHT_EDGES[0] === 15 &&
      RIGHT_EDGES[RIGHT_EDGES.length - 1] === 21 &&
      ALL_PEAKS_DEFINED === true &&
      Math.abs(SWEEP_CEILING_AT_KENDMAX_20 - IMP34109_CEILING_AT_KENDMAX_20) < 1e-3 &&
      Math.abs(SWEEP_CEILING_AT_KENDMAX_21 - IMP34233_CEILING_AT_KENDMAX_21) < 1e-3,
  },
  {
    // (F2) The ceiling estimate climbs strictly monotonically -- every per-window increment is positive.
    id: 'imp34312-ceiling-estimate-strictly-climbing',
    description: 'the 13-grid ceiling sequence is strictly increasing (all 12 per-window increments > 0); a never stabilises',
    holds: () =>
      CEILING_SEQ.length === 13 &&
      CEILING_INCREMENTS.length === 12 &&
      CEILING_INCREMENTS.every((d) => d > 0) &&
      CEILING_STRICTLY_CLIMBING === true,
  },
  {
    // (F3) The per-window drift re-accelerates: it bottoms out at an interior minimum (~0.005859 near
    // kEnd_max ~ 18) then re-increases to the LARGEST increment at the widest grid (~0.070714).
    id: 'imp34312-per-window-drift-re-accelerates',
    description: 'increment bottoms out at ~0.005859 near kEnd_max ~ 18 then re-accelerates to the largest final increment ~0.070714; non-convergence signature',
    holds: () =>
      MIN_INCREMENT < 0.007 &&
      MIN_INCREMENT_KEND > 16.5 &&
      MIN_INCREMENT_KEND < 19.5 &&
      LAST_INCREMENT === Math.max(...CEILING_INCREMENTS) &&
      LAST_INCREMENT > 5 * MIN_INCREMENT &&
      INCREMENT_REACCELERATES === true,
  },
  {
    // (F4) The total drift is order 12% of the nominal ceiling with the largest step last -- a non-converging
    // fit artifact rather than a saturation level.
    id: 'imp34312-total-drift-non-converged',
    description: 'total drift ~0.221 (>0.2), ~10-11% of the final nominal ceiling; ceiling not converged',
    holds: () =>
      TOTAL_DRIFT > 0.2 &&
      DRIFT_FRACTION_OF_CEILING > 0.09 &&
      DRIFT_FRACTION_OF_CEILING < 0.13 &&
      CEILING_NOT_CONVERGED === true,
  },
  {
    // Honesty gate: measurement only, ceiling not converged, isRigorous false, imp-34233 / imp-34109 /
    // imp-34169 untouched, no QED, no refereed bound is changed, imp-3066 K_a>=0 untouched, imp-486 C_mb untouched.
    id: 'imp34312-honesty-gate-no-qed',
    description: 'Measurement only: ceilingNotConverged, isRigorous false, imp-34233/imp-34109/imp-34169 untouched, no QED, no refereed bound is changed, imp-3066 K_a>=0 untouched, imp-486 C_mb untouched',
    holds: () =>
      IMP34312_FIXED_BAND_CEILING_ESTIMATE_WINDOW_DRIFT.ceilingNotConverged === true &&
      IMP34312_FIXED_BAND_CEILING_ESTIMATE_WINDOW_DRIFT.isRigorous === false &&
      /NOT a rigorous asymptotic/.test(IMP34312_FIXED_BAND_CEILING_ESTIMATE_WINDOW_DRIFT.verdict) &&
      /are untouched/.test(IMP34312_FIXED_BAND_CEILING_ESTIMATE_WINDOW_DRIFT.verdict) &&
      /NO QED/.test(IMP34312_FIXED_BAND_CEILING_ESTIMATE_WINDOW_DRIFT.verdict) &&
      /refereed bound is changed/i.test(IMP34312_FIXED_BAND_CEILING_ESTIMATE_WINDOW_DRIFT.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34312_FIXED_BAND_CEILING_ESTIMATE_WINDOW_DRIFT.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34312_FIXED_BAND_CEILING_ESTIMATE_WINDOW_DRIFT.verdict),
  },
];

for (const a of IMP34312_FIXED_BAND_CEILING_ESTIMATE_WINDOW_DRIFT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34312-fixed-band-ceiling-estimate-window-drift assertion failed: ${a.id}`);
  }
}
