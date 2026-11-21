/**
 * @module imp-96961-bessel-onset-mass-tail-residual-viz-data
 *
 * imp-96961 (ux): import-light viz-data leaf for the imp-96934 Bessel
 * onset-mass vs measured tail-residual table at 2a=ln3.
 *
 * imp-96934 tabulated, per N in {76, 100, 124}, the spherical-Bessel onset
 * t_onset = (2m+N-1)/a alongside the measured beyond-T=3200 Krein-floor
 * residual, the first-order (Rayleigh) tail residual, and the literal
 * uniform-j_k^2 onset-mass prediction -- but left the table as prose/object
 * literals with no chart-ready series. This leaf imports the IMP96934_ROWS
 * and IMP96934_GROWTH tables verbatim (no transcription) and reshapes them
 * into an N-indexed series with log10(N) coordinates and a dual view
 * (measured-vs-first-order residual; weighted-vs-unweighted tail fraction)
 * suitable for a two-line comparison chart.
 *
 * PRESENTATION ONLY. Changes no bound; establishes no operator positivity;
 * the beyond-T=3200 residual is a Rayleigh UPPER-bound measurement, not a
 * certificate; interval-rigorous certificate reach stays 2a<=0.96;
 * no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96934-bessel-onset-tail-residual-viz-data.js (source table, reused verbatim)
 * @see imp-96957-bessel-onset-tail-finer-ladder-viz-data.js (finer N-ladder extension, out of scope here)
 * @see imp-96960-etrunc-cc-elasticity-ladder-viz-data.js (sibling viz-data leaf convention)
 * @see imp-97038-bessel-onset-mass-extended-N-viz-data.js (CAVEAT: extending this same
 *   absolute-fraction comparison past N~148 makes the first-order un-readjusted-minimiser tail
 *   decomposition numerically unreliable -- split-check degrades to 6e-4 and the weighted tail
 *   fraction goes unphysical -- so the N=76/100/124 rungs shown here must NOT be extrapolated or
 *   read as approaching a physical crossover)
 *
 * Ticket: imp-96961 (ux, sonnet-4-6, medium). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP96934_NS,
  IMP96934_T3200,
  IMP96934_ROWS,
  IMP96934_GROWTH,
  IMP96934_VERDICT,
} from './imp-96934-bessel-onset-tail-residual-viz-data.js';

// chart-ready per-N series: x = log10(N), dual y-views (residual pair, fraction pair).
export const IMP96961_ONSET_TAIL_SERIES = Object.freeze(
  IMP96934_NS.map((N) => {
    const r = IMP96934_ROWS[N];
    return Object.freeze({
      N,
      log10N: +Math.log10(N).toFixed(4),
      kmax: r.kmax,
      tOnset: r.tOnset,
      tOnsetOverT3200: r.tOnsetOverT3200,
      residMeasured: r.residMeasured,
      residFirstOrder: r.residFirstOrder,
      weightedTailFrac: r.weightedTailFrac,
      onsetFracUnweighted: r.onsetFracUnweighted,
      onsetOverWeightedRatio: +(r.onsetFracUnweighted / r.weightedTailFrac).toFixed(4),
    });
  }),
);

// N-step growth-ratio series: measured vs first-order vs linear-in-k onset prediction.
export const IMP96961_GROWTH_SERIES = Object.freeze(
  Object.entries(IMP96934_GROWTH).map(([step, g]) => ({
    step,
    ratioMeasured: g.ratioMeasured,
    ratioFirstOrder: g.ratioFirstOrder,
    ratioOnsetLinear: g.ratioOnsetLinear,
  })),
);

export const IMP96961_T3200 = IMP96934_T3200;

export const IMP96961_HONEST_BANNER =
  'Presentation only: the beyond-T=3200 Krein-floor residual at 2a=ln3 IS sigma_2-weighted Bessel ' +
  'mass (the first-order tail residual reproduces the measured floor lift in sign and order at every ' +
  'N), but the onsets sit 13-22x below the T=3200 cutoff (it is the far tail, not the onset crossing), ' +
  'and the literal uniform-j_k^2 onset-mass model over-predicts the absolute fraction while ' +
  'under-predicting the super-linear N-growth, leaving an unexplained component. The beyond-T=3200 ' +
  'residual itself is a Rayleigh UPPER-bound measurement, not a certified tail bound. CAVEAT ' +
  '(imp-97038): the {76,100,124} rungs shown are the only ones where this absolute-fraction ' +
  'comparison is numerically reliable -- extended past N~148 the first-order tail decomposition ' +
  'degrades and its apparent over-to-under crossover is an artifact, not physics; do not extrapolate ' +
  'this chart. No operator positivity established; interval-rigorous certificate reach stays ' +
  '2a<=0.96; no refereed bound is changed; RH open; NO QED.';

// plain validation object (no self-executing throw; imp-96294/imp-96819 convention -- a viz-data
// leaf must stay inert in the browser so a stale reading cannot blank a lazy-loaded page). Checked
// by scripts/run-assertions.mjs via the IMP96961_ASSERTIONS array below, not at import time.
export const IMP96961_VALIDATION = Object.freeze({
  threeRungsPresent: IMP96961_ONSET_TAIL_SERIES.length === 3,
  log10NMonotoneIncreasing: IMP96961_ONSET_TAIL_SERIES.every(
    (row, i) => i === 0 || row.log10N > IMP96961_ONSET_TAIL_SERIES[i - 1].log10N,
  ),
  onsetsFarBelowCutoffEveryRung: IMP96961_ONSET_TAIL_SERIES.every(
    (row) => row.tOnsetOverT3200 > 0.03 && row.tOnsetOverT3200 < 0.1,
  ),
  onsetOverpredictsWeightedFractionEveryRung: IMP96961_ONSET_TAIL_SERIES.every(
    (row) => row.onsetOverWeightedRatio > 2,
  ),
  firstOrderResidualMatchesMeasuredSignAndOrder: IMP96961_ONSET_TAIL_SERIES.every(
    (row) => row.residFirstOrder > 0.5 * row.residMeasured && row.residFirstOrder < 2 * row.residMeasured,
  ),
  growthRatiosPresent: IMP96961_GROWTH_SERIES.length === 2,
  measuredGrowthExceedsOnsetLinearGrowth: IMP96961_GROWTH_SERIES.every(
    (g) => g.ratioMeasured > 1.5 * g.ratioOnsetLinear,
  ),
  matchesSourceVerdict:
    IMP96934_VERDICT.operatorPositivityProved === false &&
    IMP96934_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
    IMP96934_VERDICT.qed === false,
  honestBannerPresent:
    /RH open/.test(IMP96961_HONEST_BANNER) &&
    /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96961_HONEST_BANNER) &&
    /NO QED/.test(IMP96961_HONEST_BANNER) &&
    /Rayleigh UPPER-bound measurement, not a certified tail bound/.test(IMP96961_HONEST_BANNER) &&
    /imp-97038/.test(IMP96961_HONEST_BANNER) &&
    /do not extrapolate this chart/.test(IMP96961_HONEST_BANNER),
});

// imp-96397: registers the IMP96961_VALIDATION checks with the build-time assertion sweep
// (scripts/run-assertions.mjs), which discovers any exported *_ASSERTIONS array without
// requiring an import-time throw.
export const IMP96961_ASSERTIONS = [
  {
    id: 'imp96961-three-rungs-present',
    description: 'all three N rungs (76/100/124) are reshaped into a chart-ready series',
    holds: () => IMP96961_VALIDATION.threeRungsPresent,
  },
  {
    id: 'imp96961-log10n-monotone-increasing',
    description: 'log10(N) increases monotonically across the series',
    holds: () => IMP96961_VALIDATION.log10NMonotoneIncreasing,
  },
  {
    id: 'imp96961-onsets-far-below-cutoff',
    description: 'the Bessel onset sits 13-22x below the T=3200 cutoff at every rung',
    holds: () => IMP96961_VALIDATION.onsetsFarBelowCutoffEveryRung,
  },
  {
    id: 'imp96961-onset-overpredicts-weighted-fraction',
    description: 'the literal uniform-j_k^2 onset fraction is more than 2x the measured sigma_2-weighted tail fraction at every rung',
    holds: () => IMP96961_VALIDATION.onsetOverpredictsWeightedFractionEveryRung,
  },
  {
    id: 'imp96961-firstorder-matches-measured',
    description: 'the first-order tail residual reproduces the measured floor lift in sign and order (within 0.5x-2x) at every rung',
    holds: () => IMP96961_VALIDATION.firstOrderResidualMatchesMeasuredSignAndOrder,
  },
  {
    id: 'imp96961-growth-ratios-present',
    description: 'both N-step growth ratios (76->100, 100->124) are present',
    holds: () => IMP96961_VALIDATION.growthRatiosPresent,
  },
  {
    id: 'imp96961-measured-growth-exceeds-onset-linear',
    description: 'the measured residual growth per N step exceeds the linear-in-k onset prediction by more than 1.5x, confirming the unexplained super-linear component',
    holds: () => IMP96961_VALIDATION.measuredGrowthExceedsOnsetLinearGrowth,
  },
  {
    id: 'imp96961-matches-source-verdict',
    description: 'the leaf agrees with the imp-96934 source verdict (no operator positivity, reach unchanged at 2a<=0.96, no QED)',
    holds: () => IMP96961_VALIDATION.matchesSourceVerdict,
  },
  {
    id: 'imp96961-honest-banner-present',
    description: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers',
    holds: () => IMP96961_VALIDATION.honestBannerPresent,
  },
];
