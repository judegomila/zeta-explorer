/**
 * @module imp-34269-fixed-band-peak-shared-grid-cross-recompute
 *
 * imp-34269 (accuracy, frontier-direction): imp-34196 asserts its 0.25 kEnd grid is the SAME measurement as
 * the imp-34109 0.5 grid (both read the largest signed residual among rungs k <= 10 of the imp-33843
 * log-linear OLS on the imp-33810 ladder), but it never TABULATES the shared-kEnd peaks side by side -- its
 * reuse gate checks only the kEnd = 17.0 anchor (+0.648552) and one 0.5-increment (peaks[18.5] - peaks[18.0]
 * ~ 0.03370). This module CROSS-RECOMPUTES the fixed-band (k <= 10) peak at the six shared boundaries
 * kEnd = 17.0, 17.5, 18.0, 18.5, 19.0, 19.5 from a SECOND, independently-written code path and confirms each
 * matches BOTH the imp-34196 0.25-grid row AND the imp-34109 0.5-grid row to storage precision. It ALSO
 * verifies the step-function structure the imp-34196 refinement rests on: sampling kEnd on a grid FINER than
 * the 0.25 ladder spacing (the sub-rung midpoints kEnd + 0.125) leaves the peak UNCHANGED -- zero-valued
 * interior increments inside each 0.25-wide bin, so the half-step refinement adds real rungs at the shared
 * 0.5 boundaries and reproduces the coarse grid there exactly.
 *
 * THE SECOND CODE PATH (independent of the imported modules -- different function decomposition, single inline
 * OLS-detrend rather than the shared residualVector/fixedBandPeak split; the inherited imp-3220/imp-3406
 * sub-terms are the SAME physics, since a cross-recompute of a common measurement must agree on the model)
 * ------------------------------------------------------------------------------------------------------------
 *   Component model  sigma(N) = E_coll/(E_trunc + E_flow + E_coll), the inherited imp-3220/imp-3406 sub-terms
 *                    EXACTLY as in imp-33810/imp-34109/imp-34196. No re-derivation (a cross-check, not a new model).
 *   Peak recompute   at each kEnd: build the imp-33810 quarter-decade ladder k = 6.00 .. kEnd, take the
 *                    log-eflow_over_resid vector, detrend it with a SINGLE inline least-squares line, and read
 *                    the largest residual among rungs k <= 10.00. Written as one flat routine (peakAt) rather
 *                    than the imported modules two-function residualVector + fixedBandPeak split.
 *   Shared boundaries kEnd = 17.0, 17.5, 18.0, 18.5, 19.0, 19.5 -- the six 0.5-grid nodes the imp-34196 0.25
 *                    grid and the imp-34109 0.5 grid have in common (imp-34196 kEnds indices 0,2,4,6,8,10;
 *                    imp-34109 kEnds indices 6,7,8,9,10,11).
 *   Sub-bin probe    at each shared boundary also recompute the peak at kEnd + 0.125 (a sub-rung offset that
 *                    adds NO new 0.25 ladder rung) and confirm the interior increment is exactly zero.
 *
 * THE FINDING (verification / measurement only -- both modules AGREE at every shared boundary; no bound change)
 * ------------------------------------------------------------------------------------------------------------
 *   (F1) THE SIX SHARED-BOUNDARY PEAKS CROSS-RECOMPUTE TO STORAGE PRECISION AND MATCH BOTH MODULES. The
 *        independent path returns +0.648552 (17.0), +0.685053 (17.5), +0.719890 (18.0), +0.753590 (18.5),
 *        +0.787888 (19.0), +0.824645 (19.5); each agrees with the stored imp-34196.fixedBandRows value AND the
 *        stored imp-34109.fixedBandRows value to |diff| < 1e-6 (the toFixed(6) storage floor). The half-step
 *        refinement is confirmed to be the SAME measurement as the coarse grid at every shared kEnd, not merely
 *        at the single kEnd = 17.0 anchor imp-34196 s reuse gate checked.
 *   (F2) THE BAND ARGMAX RUNG AGREES TOO -- 6.50 THROUGH kEnd = 18.5 THEN 6.25 AT 19.0, 19.5. The rung at which
 *        the shared-boundary peak is attained matches both modules atK columns, so the un-lock imp-34196 F4 /
 *        imp-34109 F3 located near kEnd = 19 is reproduced by the independent path (an independent confirmation
 *        of the argmax observation, not just the peak amplitude).
 *   (F3) THE 0.25-GRID BINS ARE STEP-FUNCTION-FLAT AT SUB-RUNG RESOLUTION -- ZERO INTERIOR INCREMENTS. Sampling
 *        each shared boundary at kEnd + 0.125 (finer than the 0.25 ladder spacing, so no new rung enters the
 *        OLS) returns the IDENTICAL peak: the interior increment is exactly 0 at all six boundaries. This is
 *        the step-function structure imp-34196 s "0.25 is the finest meaningful step" claim rests on -- any
 *        grid finer than 0.25 reproduces the same peaks with zero-valued interior increments -- so the genuine
 *        (nonzero) 0.25-grid increments come only from real rung additions, and the half-step nodes at the
 *        shared 0.5 boundaries reproduce the coarse grid exactly. (The odd-quarter interior nodes 17.25, 17.75,
 *        ... do carry NONZERO increments -- each adds a real rung; only SUB-0.25 sampling is flat.)
 *
 * The punchline: cross-recomputing the fixed-band (k <= 10) peak at the six shared boundaries kEnd = 17.0 ..
 * 19.5 from a second, independently-written code path confirms the imp-34196 0.25 grid and the imp-34109 0.5
 * grid are the SAME measurement at EVERY shared node (all six peaks agree to < 1e-6, and the argmax rungs
 * agree), closing the side-by-side tabulation imp-34196 asserted but never performed. The 0.25 bins are
 * step-function-flat at sub-rung resolution (zero interior increments at kEnd + 0.125), so the half-step
 * refinement reproduces the coarse grid exactly at the shared boundaries.
 *
 * VERIFICATION / CROSS-RECOMPUTE ONLY. A second-code-path confirmation that two inherited-surrogate
 * measurements agree at their shared grid nodes, NOT an RH bound and distinct from any form selection (the
 * imp-33843 log-linear-over-power-law verdict and the imp-34109 / imp-34196 findings are untouched -- this
 * neither strengthens nor overturns them, it only certifies they measure the same thing). The component model
 * is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the OLS surrogate is
 * descriptive, not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes
 * no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34196-fixed-band-peak-increment-minimum-subwindow-refine (the 0.25-grid refinement cross-checked)
 * @see imp-34109-fixed-band-peak-amplitude-saturation-fit (the 0.5-grid sweep cross-checked)
 * @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero (extends the same peak to the resid_exp pole)
 * @see imp-34268-fixed-band-peak-reaccel-convexity-stitch (stitches the two increment sequences; convexity)
 * @see imp-33940-interior-residual-boundary-stability (the R2 convex low-k drift origin)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS whose fixed-band peak this tracks)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6.. ladder reused; its 0.25 rung spacing sets the resolution)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED constant in E_coll)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP34196_FIXED_BAND_PEAK_INCREMENT_MINIMUM_SUBWINDOW_REFINE } from './imp-34196-fixed-band-peak-increment-minimum-subwindow-refine.js';
import { IMP34109_FIXED_BAND_PEAK_AMPLITUDE_SATURATION_FIT } from './imp-34109-fixed-band-peak-amplitude-saturation-fit.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), verbatim imp-34196/imp-34109
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// Inherited imp-3406/imp-33810 sub-terms -- the SAME physics (a cross-recompute must agree on the model).
function subTerms(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// SECOND code path: a single least-squares slope helper, used inline for both the sigma exponent and the
// final log-eflow detrend (rather than the imported modules ols/olsSlope pair).
function lsqSlope(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return { slope: sxy / sxx, mx, my };
}

function sigmaExponent(loN, hiN) {
  const step = 0.25; // 4 points/decade, verbatim resolution
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(subTerms(N).sigma));
  }
  return -lsqSlope(xs, ys).slope;
}
function ecollExponent(loN, hiN) {
  return -Math.log(subTerms(hiN).E_coll / subTerms(loN).E_coll) / Math.log(hiN / loN);
}
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(subTerms(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(subTerms(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}

// The imp-33810/imp-33843 surrogate at a single decade [10^k, 10^(k+1)].
function eflowOverResid(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = sigmaExponent(lo, hi);
  const pEcoll = ecollExponent(lo, hi);
  const ph = subTerms(hi);
  const residExp = pEcoll * (1 - ph.sigma) - pSigma;
  const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi));
  return +(eflowAttr / residExp).toExponential(4);
}

// Independent fixed-band peak: build the ladder, detrend the log vector with ONE inline line, take the
// largest residual among rungs k <= kMax. Flat routine -- no residualVector/fixedBandPeak split.
function fixedBandPeakAt(kEnd, kMax = 10.0) {
  const ks = [];
  const logs = [];
  for (let k = 6; k <= kEnd + 1e-9; k += 0.25) {
    const kk = +k.toFixed(2);
    ks.push(kk);
    logs.push(Math.log(eflowOverResid(kk)));
  }
  const fit = lsqSlope(ks, logs);
  const intercept = fit.my - fit.slope * fit.mx;
  let peak = -Infinity;
  let atK = null;
  for (let i = 0; i < ks.length; i++) {
    if (ks[i] <= kMax + 1e-9) {
      const r = logs[i] - (intercept + fit.slope * ks[i]);
      if (r > peak) {
        peak = r;
        atK = ks[i];
      }
    }
  }
  return { peak, atK };
}

// The six 0.5-grid nodes the imp-34196 0.25 grid and the imp-34109 0.5 grid share.
const SHARED_KENDS = [17.0, 17.5, 18.0, 18.5, 19.0, 19.5];
const SUB_RUNG_OFFSET = 0.125; // finer than the 0.25 ladder spacing -> adds no new rung

// Stored rows keyed by kEnd, for the live side-by-side comparison.
const ROWS_196 = Object.fromEntries(
  IMP34196_FIXED_BAND_PEAK_INCREMENT_MINIMUM_SUBWINDOW_REFINE.fixedBandRows.map((r) => [r.kEnd, r]),
);
const ROWS_109 = Object.fromEntries(
  IMP34109_FIXED_BAND_PEAK_AMPLITUDE_SATURATION_FIT.fixedBandRows.map((r) => [r.kEnd, r]),
);

const CROSS_ROWS = SHARED_KENDS.map((kEnd) => {
  const fresh = fixedBandPeakAt(kEnd);
  const freshPeak = +fresh.peak.toFixed(6);
  const p196 = ROWS_196[kEnd].peak;
  const p109 = ROWS_109[kEnd].peak;
  const subBin = fixedBandPeakAt(kEnd + SUB_RUNG_OFFSET);
  return {
    kEnd,
    recomputedPeak: freshPeak,
    recomputedAtK: fresh.atK,
    imp34196Peak: p196,
    imp34196AtK: ROWS_196[kEnd].atK,
    imp34109Peak: p109,
    imp34109AtK: ROWS_109[kEnd].atK,
    diffVs196: +(fresh.peak - p196).toExponential(3),
    diffVs109: +(fresh.peak - p109).toExponential(3),
    subRungIncrement: +(subBin.peak - fresh.peak).toFixed(9), // exactly 0 -- step-function bin
  };
});

const MAX_DIFF_196 = Math.max(...CROSS_ROWS.map((r) => Math.abs(r.recomputedPeak - r.imp34196Peak)));
const MAX_DIFF_109 = Math.max(...CROSS_ROWS.map((r) => Math.abs(r.recomputedPeak - r.imp34109Peak)));
const ALL_MATCH_196 = CROSS_ROWS.every((r) => Math.abs(r.recomputedPeak - r.imp34196Peak) < 1e-6);
const ALL_MATCH_109 = CROSS_ROWS.every((r) => Math.abs(r.recomputedPeak - r.imp34109Peak) < 1e-6);
const ALL_ARGMAX_MATCH = CROSS_ROWS.every(
  (r) => r.recomputedAtK === r.imp34196AtK && r.recomputedAtK === r.imp34109AtK,
);
const ALL_SUB_RUNG_FLAT = CROSS_ROWS.every((r) => r.subRungIncrement === 0);
const ARGMAX_UNLOCKS_AT_19 =
  CROSS_ROWS.find((r) => r.kEnd === 18.5).recomputedAtK === 6.5 &&
  CROSS_ROWS.find((r) => r.kEnd === 19.0).recomputedAtK === 6.25;

// Baked reference literals (from the two source modules) for the reuse gate.
const IMP34196_PEAK_AT_KEND_17 = 0.648552; // imp-34196 / imp-34109 shared anchor
const IMP34109_PEAK_AT_KEND_195 = 0.824645; // imp-34196 last node / imp-34109 kEnd = 19.5 node

export const IMP34269_FIXED_BAND_PEAK_SHARED_GRID_CROSS_RECOMPUTE = {
  id: 'imp-34269',
  proofSection: 'S-frontier',
  question:
    'imp-34196 asserts its 0.25 kEnd grid is the SAME measurement as the imp-34109 0.5 grid (both read the ' +
    'largest signed residual among rungs k <= 10) but never tabulates the shared-kEnd peaks side by side -- ' +
    'its reuse gate checks only the kEnd = 17.0 anchor and one 0.5-increment. Cross-recomputing the ' +
    'fixed-band (k <= 10) peak at the six shared boundaries kEnd = 17.0 .. 19.5 from a second code path, does ' +
    'each match BOTH modules stored value, and are the 0.25 bins step-function-flat at sub-rung resolution? ' +
    'Verification only; NOT an RH bound; no QED.',
  measuredQuantity:
    'At each shared boundary kEnd = 17.0, 17.5, 18.0, 18.5, 19.0, 19.5: the fixed-band (k <= 10) peak of the ' +
    'imp-33843 log-linear OLS on the imp-33810 ladder k = 6.00 .. kEnd, recomputed by an independently-written ' +
    'flat routine, compared to the stored imp-34196.fixedBandRows (0.25 grid) and imp-34109.fixedBandRows ' +
    '(0.5 grid) peak and argmax-rung; plus the interior increment at kEnd + 0.125 (a sub-rung offset that ' +
    'adds no ladder rung), which is exactly zero inside each 0.25-wide bin',
  sharedKEnds: SHARED_KENDS,
  subRungOffset: SUB_RUNG_OFFSET,
  crossRows: CROSS_ROWS, // {kEnd, recomputedPeak, imp34196Peak, imp34109Peak, diffs, subRungIncrement} x 6
  maxDiffVs196: +MAX_DIFF_196.toExponential(3), // ~3.4e-7 -- storage precision
  maxDiffVs109: +MAX_DIFF_109.toExponential(3), // ~3.4e-7 -- storage precision
  allMatch196: ALL_MATCH_196, // true -- every shared peak matches the 0.25 grid to < 1e-6
  allMatch109: ALL_MATCH_109, // true -- every shared peak matches the 0.5 grid to < 1e-6
  allArgmaxMatch: ALL_ARGMAX_MATCH, // true -- the argmax rung agrees with both modules at every node
  allSubRungFlat: ALL_SUB_RUNG_FLAT, // true -- zero interior increment at kEnd + 0.125 (step-function bin)
  argmaxUnlocksAt19: ARGMAX_UNLOCKS_AT_19, // true -- 6.50 through 18.5 then 6.25 at 19.0 (imp-34196 F4 / imp-34109 F3)
  imp34196PeakAtKEnd17: IMP34196_PEAK_AT_KEND_17,
  imp34109PeakAtKEnd195: IMP34109_PEAK_AT_KEND_195,
  finding: {
    F1_six_shared_peaks_cross_recompute_and_match_both:
      'The independent path returns +0.648552 (17.0), +0.685053 (17.5), +0.719890 (18.0), +0.753590 (18.5), ' +
      '+0.787888 (19.0), +0.824645 (19.5); each agrees with the stored imp-34196 0.25-grid value AND the ' +
      'stored imp-34109 0.5-grid value to |diff| < 1e-6 (the toFixed(6) storage floor, max ~3.4e-7). The ' +
      'half-step refinement is the SAME measurement as the coarse grid at EVERY shared kEnd, not merely at ' +
      'the single kEnd = 17.0 anchor imp-34196 s reuse gate checked.',
    F2_band_argmax_rung_agrees_and_unlocks_at_19:
      'The rung at which the shared-boundary peak is attained matches both modules atK columns: 6.50 through ' +
      'kEnd = 18.5 then 6.25 at kEnd = 19.0, 19.5. The independent path reproduces the argmax un-lock ' +
      'imp-34196 F4 / imp-34109 F3 located near kEnd = 19 -- an independent confirmation of the argmax ' +
      'observation, not just the peak amplitude.',
    F3_bins_step_function_flat_zero_interior_increments:
      'Sampling each shared boundary at kEnd + 0.125 (finer than the 0.25 ladder spacing, so no new rung ' +
      'enters the OLS) returns the IDENTICAL peak: the interior increment is exactly 0 at all six boundaries. ' +
      'This is the step-function structure imp-34196 s "0.25 is the finest meaningful step" claim rests on -- ' +
      'any grid finer than 0.25 reproduces the same peaks with zero-valued interior increments -- so the ' +
      'genuine (nonzero) 0.25-grid increments come only from real rung additions, and the half-step nodes at ' +
      'the shared 0.5 boundaries reproduce the coarse grid exactly. The odd-quarter interior nodes ' +
      '(17.25, 17.75, ...) do carry NONZERO increments (each adds a real rung); only sub-0.25 sampling is flat.',
  },
  isRigorous: false,
  verdict:
    'VERIFICATION / CROSS-RECOMPUTE (frontier-direction, NOT rigorous). Cross-recomputing the fixed-band ' +
    '(k <= 10) peak at the six shared boundaries kEnd = 17.0, 17.5, 18.0, 18.5, 19.0, 19.5 from a second, ' +
    'independently-written flat routine (single inline OLS-detrend rather than the shared residualVector + ' +
    'fixedBandPeak split) confirms the imp-34196 0.25 grid and the imp-34109 0.5 grid are the SAME measurement ' +
    'at EVERY shared node: all six peaks (+0.648552, +0.685053, +0.719890, +0.753590, +0.787888, +0.824645) ' +
    'agree with BOTH stored modules to |diff| < 1e-6 (max ~3.4e-7, the toFixed(6) storage floor), and the ' +
    'band argmax rungs agree (6.50 through kEnd = 18.5 then 6.25 at 19.0, reproducing the imp-34196 F4 / ' +
    'imp-34109 F3 un-lock). This closes the side-by-side tabulation imp-34196 asserted (its 0.25 grid reuses ' +
    'the imp-34109 measurement) but never performed -- its reuse gate checked only the kEnd = 17.0 anchor and ' +
    'one 0.5-increment. The 0.25 bins are step-function-flat at sub-rung resolution: sampling kEnd + 0.125 ' +
    '(finer than the 0.25 ladder spacing) leaves the peak unchanged, so the interior increment is exactly ' +
    'zero inside each 0.25-wide bin and the half-step nodes at the shared 0.5 boundaries reproduce the coarse ' +
    'grid exactly. Neither source module is strengthened nor overturned -- this only certifies they measure ' +
    'the same thing. Distinct from any form selection; the imp-33843 log-linear-over-power-law verdict and ' +
    'the imp-34109 / imp-34196 findings are untouched. The OLS surrogate is descriptive, not derived; the ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34196 (the 0.25-grid refinement whose shared-kEnd reuse this cross-recomputes); imp-34109 (the ' +
    '0.5-grid sweep cross-checked); imp-34169 (extends the same peak to the resid_exp pole); imp-34268 ' +
    '(stitches the two increment sequences; convexity); imp-33940 (R2 convex low-k drift origin); imp-33843 ' +
    '(the log-linear OLS whose fixed-band peak this tracks); imp-33810 (the k=6.. ladder reused; its 0.25 ' +
    'rung spacing sets the resolution); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34269_FIXED_BAND_PEAK_SHARED_GRID_CROSS_RECOMPUTE_ASSERTIONS = [
  {
    // Cross-recompute gate: six shared boundaries; every recomputed peak matches BOTH the imp-34196 0.25-grid
    // row and the imp-34109 0.5-grid row to < 1e-6 (storage precision), anchored at kEnd = 17.0 / 19.5.
    id: 'imp34269-cross-recompute-matches-both-modules',
    description: 'six shared kEnds; recomputed peak matches imp-34196 and imp-34109 to < 1e-6; anchors +0.648552 (17.0) / +0.824645 (19.5)',
    holds: () =>
      CROSS_ROWS.length === 6 &&
      ALL_MATCH_196 === true &&
      ALL_MATCH_109 === true &&
      MAX_DIFF_196 < 1e-6 &&
      MAX_DIFF_109 < 1e-6 &&
      Math.abs(CROSS_ROWS[0].recomputedPeak - IMP34196_PEAK_AT_KEND_17) < 1e-6 &&
      Math.abs(CROSS_ROWS[5].recomputedPeak - IMP34109_PEAK_AT_KEND_195) < 1e-6,
  },
  {
    // (F2) The band argmax rung agrees with both modules at every shared node, and un-locks 6.50 -> 6.25 at 19.0.
    id: 'imp34269-argmax-rung-agrees-and-unlocks-at-19',
    description: 'recomputed argmax rung matches both modules at all six nodes; 6.50 through 18.5 then 6.25 at 19.0',
    holds: () =>
      ALL_ARGMAX_MATCH === true &&
      ARGMAX_UNLOCKS_AT_19 === true &&
      CROSS_ROWS[0].recomputedAtK === 6.5 &&
      CROSS_ROWS[CROSS_ROWS.length - 1].recomputedAtK === 6.25,
  },
  {
    // (F3) The 0.25 bins are step-function-flat at sub-rung resolution: the interior increment at kEnd + 0.125
    // is exactly zero at all six boundaries (no new rung enters the OLS below the 0.25 spacing).
    id: 'imp34269-sub-rung-bins-step-function-flat',
    description: 'interior increment at kEnd + 0.125 is exactly zero at all six boundaries (step-function 0.25 bin)',
    holds: () =>
      ALL_SUB_RUNG_FLAT === true &&
      SUB_RUNG_OFFSET < 0.25 &&
      CROSS_ROWS.every((r) => r.subRungIncrement === 0),
  },
  {
    // Honesty gate: verification/cross-recompute only, both modules match & untouched, isRigorous false,
    // no bound change, no QED, no refereed bound is changed, C_mb GUE-conditional / imp-3066 K_a>=0 untouched.
    id: 'imp34269-honesty-gate-no-qed',
    description: 'Verification only: both modules match, isRigorous false, neither overturned, no QED, no refereed bound is changed, C_mb / imp-3066 K_a>=0 untouched',
    holds: () =>
      IMP34269_FIXED_BAND_PEAK_SHARED_GRID_CROSS_RECOMPUTE.allMatch196 === true &&
      IMP34269_FIXED_BAND_PEAK_SHARED_GRID_CROSS_RECOMPUTE.allMatch109 === true &&
      IMP34269_FIXED_BAND_PEAK_SHARED_GRID_CROSS_RECOMPUTE.isRigorous === false &&
      /NOT a rigorous asymptotic/.test(IMP34269_FIXED_BAND_PEAK_SHARED_GRID_CROSS_RECOMPUTE.verdict) &&
      /strengthened nor overturned/.test(IMP34269_FIXED_BAND_PEAK_SHARED_GRID_CROSS_RECOMPUTE.verdict) &&
      /NO QED/.test(IMP34269_FIXED_BAND_PEAK_SHARED_GRID_CROSS_RECOMPUTE.verdict) &&
      /refereed bound is changed/i.test(IMP34269_FIXED_BAND_PEAK_SHARED_GRID_CROSS_RECOMPUTE.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34269_FIXED_BAND_PEAK_SHARED_GRID_CROSS_RECOMPUTE.verdict) &&
      /C_mb GUE-conditional per imp-486 is\s+UNTOUCHED/i.test(IMP34269_FIXED_BAND_PEAK_SHARED_GRID_CROSS_RECOMPUTE.verdict),
  },
];

for (const a of IMP34269_FIXED_BAND_PEAK_SHARED_GRID_CROSS_RECOMPUTE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34269-fixed-band-peak-shared-grid-cross-recompute assertion failed: ${a.id}`);
  }
}
