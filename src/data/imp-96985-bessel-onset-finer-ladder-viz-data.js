/**
 * @module imp-96985-bessel-onset-finer-ladder-viz-data
 *
 * imp-96985 (ux): import-light viz-data leaf for the imp-96957 finer Bessel
 * onset ladder N in {88,100,112,124} at 2a=ln3.
 *
 * imp-96957 extended the imp-96934 three-N onset/tail-residual table to the
 * finer {88,100,112,124} ladder and measured three series: the sigma_2-weighted
 * floor-lift growth (super-cubic, p_global=3.228), the onset-to-cutoff ratio
 * tOnset/T3200 (creeping up but staying far below 1), and the literal-onset
 * over-prediction ratio onsetFracUnweighted/weightedTailFrac (COLLAPSING
 * 9.63->2.74, the opposite of "the gap keeps widening"). imp-96957 shipped the
 * three tables as plain objects with no chart-ready series. This leaf imports
 * IMP96957_NS/IMP96957_ROWS/IMP96957_GROWTH verbatim (no transcription) and
 * reshapes them into an N-indexed series (with log10(N) coordinates) plus the
 * global power-law fit and the projected onset-gap crossover, suitable for a
 * three-line comparison chart.
 *
 * PRESENTATION ONLY. Changes no bound; establishes no operator positivity;
 * the beyond-T=3200 residual is a Rayleigh UPPER-bound measurement, not a
 * certificate; the projected N~153 crossover is an unverified extrapolation
 * past the 2a<=0.96 interval-verified reach; interval-rigorous certificate
 * reach stays 2a<=0.96; no refereed bound is changed; RH open;
 * NO QED.
 *
 * @see imp-96957-bessel-onset-tail-finer-ladder-viz-data.js (source table, reused verbatim)
 * @see imp-96961-bessel-onset-mass-tail-residual-viz-data.js (sibling leaf convention, three-N table)
 */

import {
  IMP96957_NS,
  IMP96957_T3200,
  IMP96957_ROWS,
  IMP96957_GROWTH,
  IMP96957_P_GLOBAL,
  IMP96957_PROJECTED_ONSET_CROSSOVER_N,
  IMP96957_VERDICT,
} from './imp-96957-bessel-onset-tail-finer-ladder-viz-data.js';

// chart-ready per-N series: x = log10(N), three tracked y-views (floor-lift growth,
// onset/cutoff ratio, onset-gap over-prediction ratio).
export const IMP96985_ONSET_LADDER_SERIES = Object.freeze(
  IMP96957_NS.map((N) => {
    const r = IMP96957_ROWS[N];
    return Object.freeze({
      N,
      log10N: +Math.log10(N).toFixed(4),
      residMeasured: r.residMeasured,
      tOnsetOverT3200: r.tOnsetOverT3200,
      onsetGapRatio: r.onsetGapRatio,
      weightedTailFrac: r.weightedTailFrac,
      onsetFracUnweighted: r.onsetFracUnweighted,
    });
  }),
);

// N-step local power-law exponents (super-cubic growth check).
export const IMP96985_GROWTH_SERIES = Object.freeze(
  Object.entries(IMP96957_GROWTH).map(([step, g]) => ({
    step,
    ratioMeasured: g.ratioMeasured,
    ratioOnsetLinear: g.ratioOnsetLinear,
    pLocal: g.pLocal,
  })),
);

export const IMP96985_T3200 = IMP96957_T3200;
export const IMP96985_P_GLOBAL = IMP96957_P_GLOBAL;
export const IMP96985_PROJECTED_ONSET_CROSSOVER_N = IMP96957_PROJECTED_ONSET_CROSSOVER_N;

export const IMP96985_HONEST_BANNER =
  'Presentation only: on the finer {88,100,112,124} ladder the sigma_2-weighted floor-lift keeps ' +
  'growing super-cubically (p_global=3.228, local 3.10-3.39, no roll-off) while the literal ' +
  'uniform-j_k^2 onset-gap over-prediction COLLAPSES 9.63->2.74 (narrows, does not widen), ' +
  'projecting an unverified crossover near N~153 past the 2a<=0.96 interval-verified reach. ' +
  'No operator positivity established; interval-rigorous certificate reach stays 2a<=0.96; no refereed bound is changed' +
  '; RH open; NO QED.';

// plain validation object (no self-executing throw; imp-96294/imp-96819 convention -- a viz-data
// leaf must stay inert in the browser so a stale reading cannot blank a lazy-loaded page). Checked
// by scripts/run-assertions.mjs via the IMP96985_ASSERTIONS array below, not at import time.
export const IMP96985_VALIDATION = Object.freeze({
  fourRungsPresent: IMP96985_ONSET_LADDER_SERIES.length === 4,
  log10NMonotoneIncreasing: IMP96985_ONSET_LADDER_SERIES.every(
    (row, i) => i === 0 || row.log10N > IMP96985_ONSET_LADDER_SERIES[i - 1].log10N,
  ),
  residualMonotoneIncreasing: IMP96985_ONSET_LADDER_SERIES.every(
    (row, i) => i === 0 || row.residMeasured > IMP96985_ONSET_LADDER_SERIES[i - 1].residMeasured,
  ),
  onsetGapRatioMonotoneDecreasing: IMP96985_ONSET_LADDER_SERIES.every(
    (row, i) => i === 0 || row.onsetGapRatio < IMP96985_ONSET_LADDER_SERIES[i - 1].onsetGapRatio,
  ),
  onsetsFarBelowCutoffEveryRung: IMP96985_ONSET_LADDER_SERIES.every(
    (row) => row.tOnsetOverT3200 > 0.03 && row.tOnsetOverT3200 < 0.1,
  ),
  growthStepsPresent: IMP96985_GROWTH_SERIES.length === 3,
  superCubicLocalExponents: IMP96985_GROWTH_SERIES.every((g) => g.pLocal > 2.9 && g.pLocal < 3.5),
  pGlobalInSuperCubicBand: IMP96985_P_GLOBAL > 3.0 && IMP96985_P_GLOBAL < 3.4,
  crossoverPastVerifiedReach: IMP96985_PROJECTED_ONSET_CROSSOVER_N > 124,
  matchesSourceVerdict:
    IMP96957_VERDICT.operatorPositivityProved === false &&
    IMP96957_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
    IMP96957_VERDICT.qed === false,
  honestBannerPresent:
    /RH open/.test(IMP96985_HONEST_BANNER) &&
    /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96985_HONEST_BANNER) &&
    /NO QED/.test(IMP96985_HONEST_BANNER),
});

// imp-96397: registers the IMP96985_VALIDATION checks with the build-time assertion sweep
// (scripts/run-assertions.mjs), which discovers any exported *_ASSERTIONS array without
// requiring an import-time throw.
export const IMP96985_ASSERTIONS = [
  {
    id: 'imp96985-four-rungs-present',
    description: 'all four N rungs (88/100/112/124) are reshaped into a chart-ready series',
    holds: () => IMP96985_VALIDATION.fourRungsPresent,
  },
  {
    id: 'imp96985-log10n-monotone-increasing',
    description: 'log10(N) increases monotonically across the series',
    holds: () => IMP96985_VALIDATION.log10NMonotoneIncreasing,
  },
  {
    id: 'imp96985-residual-monotone-increasing',
    description: 'the measured floor-lift residual grows monotonically across the finer ladder',
    holds: () => IMP96985_VALIDATION.residualMonotoneIncreasing,
  },
  {
    id: 'imp96985-onset-gap-ratio-monotone-decreasing',
    description: 'the literal-onset over-prediction ratio strictly decreases (narrows) across the finer ladder',
    holds: () => IMP96985_VALIDATION.onsetGapRatioMonotoneDecreasing,
  },
  {
    id: 'imp96985-onsets-far-below-cutoff',
    description: 'the Bessel onset sits 14-19x below the T=3200 cutoff at every rung',
    holds: () => IMP96985_VALIDATION.onsetsFarBelowCutoffEveryRung,
  },
  {
    id: 'imp96985-growth-steps-present',
    description: 'all three N-step growth ratios (88->100, 100->112, 112->124) are present',
    holds: () => IMP96985_VALIDATION.growthStepsPresent,
  },
  {
    id: 'imp96985-super-cubic-local-exponents',
    description: 'every per-step local power-law exponent stays in the super-cubic 2.9-3.5 band',
    holds: () => IMP96985_VALIDATION.superCubicLocalExponents,
  },
  {
    id: 'imp96985-p-global-in-super-cubic-band',
    description: 'the global log-log OLS exponent lands in the 3.0-3.4 super-cubic band',
    holds: () => IMP96985_VALIDATION.pGlobalInSuperCubicBand,
  },
  {
    id: 'imp96985-crossover-past-verified-reach',
    description: 'the projected onset-gap crossover N is past the finest measured rung (unverified extrapolation)',
    holds: () => IMP96985_VALIDATION.crossoverPastVerifiedReach,
  },
  {
    id: 'imp96985-matches-source-verdict',
    description: 'the leaf agrees with the imp-96957 source verdict (no operator positivity, reach unchanged at 2a<=0.96, no QED)',
    holds: () => IMP96985_VALIDATION.matchesSourceVerdict,
  },
  {
    id: 'imp96985-honest-banner-present',
    description: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers',
    holds: () => IMP96985_VALIDATION.honestBannerPresent,
  },
];
