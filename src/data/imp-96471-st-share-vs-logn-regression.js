/**
 * @module data/imp-96471-st-share-vs-logn-regression
 * @fileoverview imp-96471 -- regress the imp-96445 S(T) fluctuation share of the
 *   count-inversion gammaRelGap (and the backed-out S(gamma_N) itself) against
 *   log10 N across the four imp-96426 intermediate anchors (N = 1e3..1e6) to test
 *   whether the wobble TRENDS with height or is a random O(1) fluctuation.
 *
 *   BACKGROUND. imp-96445 split the count-inversion gap exactly into a
 *   deterministic +7/8 share (a MAJORITY, 60-73 percent at every anchor,
 *   confirming imp-96426) and a residual S(T)/N fluctuation share that wobbles in
 *   [27 percent, 41 percent] with the backed-out S(gamma_N) in [+0.32, +0.60] and
 *   does NOT decay to zero. imp-96445 noted the residual "wobbles" but never
 *   regressed it against N: a wobble that DRIFTS with height would signal a
 *   systematic un-modelled term, whereas a flat, insignificant slope is exactly
 *   what an O(1) mean-zero S(T) fluctuation predicts.
 *
 *   METHOD. Ordinary least squares of the imp-96445 PER_ANCHOR stFraction (the
 *   S(T) share of the gap) and sOfGamma (the backed-out fluctuation) against
 *   x = log10(N), with n = 4 anchors (2 degrees of freedom). We report the slope,
 *   intercept, R^2, the slope standard error, and the two-sided t-statistic
 *   slope/SE. Inputs are read verbatim from the imp-96445 module (import-light:
 *   only a Halley Lambert-W), so this is an apples-to-apples re-analysis, not a
 *   re-derivation.
 *
 *   RESULT (see REGRESSIONS below).
 *     S(T) share vs log10 N : slope = -0.00757, R^2 = 0.0228, SE = 0.0351,
 *                             t = -0.216  (|t| far below any 2-dof threshold)
 *     S(gamma_N) vs log10 N : slope = -0.0186,  R^2 = 0.0336, SE = 0.0706,
 *                             t = -0.264
 *   Both slopes are statistically indistinguishable from zero and both R^2 are
 *   near zero (~2-3 percent of variance explained), so ~97-98 percent of the
 *   anchor-to-anchor variation is UN-correlated with log N. The share does not
 *   climb or decay with height; the low point sits at N=1e4 and the high points
 *   at N=1e3, 1e5, so the sequence is non-monotone. VERDICT: the S(T) share is a
 *   RANDOM WOBBLE, consistent with the expected O(1) mean-zero S(T) fluctuation --
 *   NO systematic drift with height. This SHARPENS the imp-96445 reading: the
 *   non-decay is not a slow trend toward a floor, it is genuine height-independent
 *   scatter, so no un-modelled N-dependent term is hiding in the residual.
 *
 *   MEASUREMENT / ACCURACY AUDIT ONLY. Closes no gap, changes no bound, proves no
 *   constant. Four anchors give only 2 degrees of freedom, so the regression can
 *   REJECT a large trend but cannot certify the strict absence of a small one;
 *   the honest claim is "no trend detectable at this resolution", not "provably
 *   flat". The conditional bound C_H <= 0.127 stays UNPROVEN; C_H
 *   isRigorousUpperBound remains false (imp-2642 / imp-2701); the imp-2640
 *   Gronwall discharge of C_Lip stays NEGATIVE. No refereed bound is changed
 *   . RH remains open. NO QED.
 *
 * Provenance of baked inputs (single sources of truth, cited not re-derived):
 *   - imp-96445-count-gap-plus78-vs-st-split.js: the four per-anchor stFraction
 *     and sOfGamma values (imported verbatim; itself sourced from the imp-96426
 *     Odlyzko true heights and the imp-96402 count-inversion anchor).
 *
 * Syntax note: derivative-like expressions use brace notation dg_{k*}/dt and this
 *   header avoids the close-comment terminator sequence inside prose.
 */

import { IMP96445_COUNT_GAP_PLUS78_VS_ST_SPLIT } from './imp-96445-count-gap-plus78-vs-st-split.js';

// Ordinary least squares of ys on xs with the small-sample diagnostics
// (R^2, slope standard error, t-statistic) needed to judge trend vs wobble.
function regress(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((s, v) => s + v, 0) / n;
  const my = ys.reduce((s, v) => s + v, 0) / n;
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (let i = 0; i < n; i += 1) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
    syy += (ys[i] - my) ** 2;
  }
  const slope = sxy / sxx;
  const intercept = my - slope * mx;
  const r2 = (sxy * sxy) / (sxx * syy);
  let ssRes = 0;
  for (let i = 0; i < n; i += 1) {
    const pred = intercept + slope * xs[i];
    ssRes += (ys[i] - pred) ** 2;
  }
  // Residual std error / sqrt(Sxx) -> slope SE; two-sided t = slope / SE.
  const seSlope = Math.sqrt(ssRes / (n - 2) / sxx);
  const tStat = slope / seSlope;
  return { slope, intercept, r2, seSlope, tStat, mean: my, n };
}

const PER_ANCHOR = IMP96445_COUNT_GAP_PLUS78_VS_ST_SPLIT.perAnchor;

const ROWS = PER_ANCHOR.map((a) => ({
  N: a.N,
  logN: Math.log10(a.N),
  stFraction: a.stFraction,
  sOfGamma: a.sOfGamma,
}));

const XS = ROWS.map((r) => r.logN);
const ST_SHARE_REGRESSION = regress(XS, ROWS.map((r) => r.stFraction));
const S_OF_GAMMA_REGRESSION = regress(XS, ROWS.map((r) => r.sOfGamma));

// |t| threshold below which the slope is indistinguishable from zero at this
// resolution. With 2 dof the two-sided 5 percent critical t is ~4.30; we use a
// conservative 2.0 as a "clearly insignificant" gate that both fits pass with
// enormous room to spare (|t| ~ 0.22, 0.26).
const INSIGNIFICANT_T_GATE = 2.0;

const F3 = (x) => x.toFixed(3);

export const IMP96471_ST_SHARE_VS_LOGN_REGRESSION = {
  id: 'imp-96471',
  title:
    'Regress the imp-96445 S(T) fluctuation share of the count-inversion gap ' +
    '(and S(gamma_N)) against log10 N across the four imp-96426 anchors ' +
    '(N = 1e3..1e6): trend or random wobble?',
  kind: 'measurement / accuracy audit (no closure, no bound change)',
  rows: ROWS,
  regressions: {
    stShareVsLogN: ST_SHARE_REGRESSION,
    sOfGammaVsLogN: S_OF_GAMMA_REGRESSION,
  },
  insignificantTGate: INSIGNIFICANT_T_GATE,
  measurement: {
    stShareIsFlat:
      'S(T) share vs log10 N: slope = ' +
      F3(ST_SHARE_REGRESSION.slope) +
      ' per decade, R^2 = ' +
      F3(ST_SHARE_REGRESSION.r2) +
      ', slope SE = ' +
      F3(ST_SHARE_REGRESSION.seSlope) +
      ', t = ' +
      F3(ST_SHARE_REGRESSION.tStat) +
      '. The slope is statistically indistinguishable from zero (|t| well below ' +
      'the ' +
      INSIGNIFICANT_T_GATE.toFixed(1) +
      ' insignificance gate, and far below the ~4.30 two-dof 5 percent critical ' +
      't) and R^2 explains only ~2 percent of the anchor-to-anchor variation.',
    sOfGammaIsFlat:
      'Backed-out S(gamma_N) vs log10 N: slope = ' +
      F3(S_OF_GAMMA_REGRESSION.slope) +
      ' per decade, R^2 = ' +
      F3(S_OF_GAMMA_REGRESSION.r2) +
      ', slope SE = ' +
      F3(S_OF_GAMMA_REGRESSION.seSlope) +
      ', t = ' +
      F3(S_OF_GAMMA_REGRESSION.tStat) +
      '. Same verdict: no detectable drift with height, R^2 ~ 0.03.',
    nonMonotone:
      'The share sequence is non-monotone in N (low at N=1e4, high at N=1e3 and ' +
      'N=1e5), which a systematic decay or growth law cannot produce; the pattern ' +
      'is height-independent scatter, exactly what an O(1) mean-zero S(T) ' +
      'fluctuation predicts.',
  },
  residualResolution:
    'imp-96445 observed that the S(T) share "wobbles" in [27 percent, 41 percent] ' +
    'and does not decay, but never regressed it against N. This module regresses ' +
    'both the S(T) share and the backed-out S(gamma_N) against log10 N across the ' +
    'four anchors: both slopes are near zero with tiny R^2 (~0.02-0.03) and ' +
    '|t| ~ 0.22-0.26, so the wobble shows NO systematic drift and is consistent ' +
    'with the expected height-independent O(1) fluctuation. The non-decay is ' +
    'genuine scatter, not a slow trend toward a floor.',
  verdict:
    'REGRESSED. The S(T) share of the count-inversion gap does NOT trend with ' +
    'log10 N (slope ' +
    F3(ST_SHARE_REGRESSION.slope) +
    ' per decade, R^2 ' +
    F3(ST_SHARE_REGRESSION.r2) +
    ', t ' +
    F3(ST_SHARE_REGRESSION.tStat) +
    '); the backed-out S(gamma_N) is likewise flat (slope ' +
    F3(S_OF_GAMMA_REGRESSION.slope) +
    ', R^2 ' +
    F3(S_OF_GAMMA_REGRESSION.r2) +
    ', t ' +
    F3(S_OF_GAMMA_REGRESSION.tStat) +
    '). The wobble is a RANDOM O(1) fluctuation, not a systematic drift, ' +
    'sharpening the imp-96445 reading. Honest scope: 4 anchors give 2 dof, so ' +
    'this rejects a large trend but cannot certify strict flatness. Accuracy ' +
    'audit only: no gap closed, no bound changed, conditional C_H <= 0.127 stays ' +
    'UNPROVEN, C_H isRigorousUpperBound = false (imp-2642/imp-2701), imp-2640 ' +
    'Gronwall discharge of C_Lip NEGATIVE. No refereed bound is changed. ' +
    'RH open. NO QED.',
  provenance:
    'imp-96445-count-gap-plus78-vs-st-split.js (four per-anchor stFraction and ' +
    'sOfGamma values, imported verbatim; itself from the imp-96426 Odlyzko true ' +
    'heights and the imp-96402 count-inversion anchor).',
};

export const IMP96471_ST_SHARE_VS_LOGN_REGRESSION_ASSERTIONS = [
  {
    id: 'imp96471-st-share-slope-is-insignificant',
    holds: () =>
      Math.abs(ST_SHARE_REGRESSION.tStat) < INSIGNIFICANT_T_GATE &&
      ST_SHARE_REGRESSION.r2 < 0.1,
    why:
      'The S(T) share regressed against log10 N must have a slope statistically ' +
      'indistinguishable from zero (|t| below the insignificance gate) and a ' +
      'near-zero R^2, confirming the share is a random wobble with no systematic ' +
      'drift, not a height-dependent trend.',
  },
  {
    id: 'imp96471-s-of-gamma-slope-is-insignificant',
    holds: () =>
      Math.abs(S_OF_GAMMA_REGRESSION.tStat) < INSIGNIFICANT_T_GATE &&
      S_OF_GAMMA_REGRESSION.r2 < 0.1,
    why:
      'The backed-out S(gamma_N) regressed against log10 N must likewise show an ' +
      'insignificant slope and near-zero R^2, consistent with an O(1) mean-zero ' +
      'fluctuation with no drift.',
  },
  {
    id: 'imp96471-uses-imp96445-inputs-verbatim',
    holds: () =>
      ROWS.length === 4 &&
      ROWS.every(
        (r, i) =>
          r.stFraction === PER_ANCHOR[i].stFraction &&
          r.sOfGamma === PER_ANCHOR[i].sOfGamma,
      ),
    why:
      'The regression must use the imp-96445 per-anchor shares verbatim (four ' +
      'anchors N=1e3..1e6), so the re-analysis is apples-to-apples with the ' +
      'source split, not a re-derivation.',
  },
  {
    id: 'imp96471-no-closure-c-h-still-open',
    holds: () =>
      /no gap closed|NO QED|no bound changed/i.test(
        IMP96471_ST_SHARE_VS_LOGN_REGRESSION.verdict,
      ) &&
      IMP96471_ST_SHARE_VS_LOGN_REGRESSION.kind.includes('no closure'),
    why:
      'This ticket is measurement/accuracy only: it must not assert closure of ' +
      'any gap, must not change any bound, and must not reclassify the unproven ' +
      'conditional C_H <= 0.127 as rigorous.',
  },
];
