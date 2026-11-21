/**
 * @module imp-97002-krein-vacuity-factorisation-viz-data
 *
 * imp-97002 (ux): import-light viz-data leaf for the imp-96973 three-factor
 * Krein-residual vacuity factorisation (Tr/lammax x lammax/rayleigh x
 * rayleigh/actual), reshaping the three tabulated (N,2a) rungs recorded by
 * imp-96923/imp-96973 into chart-ready rows for a log-scale grouped-bar or
 * multi-series comparison of the three telescoping ratios.
 *
 * imp-96973 shipped IMP96973_RUNGS as a keyed object of per-rung scalars
 * (traceRT, lammaxRT, rayleighV0RT, actualResid, total, step1/2/3, recomposed)
 * with no chart-ready shape. This leaf imports that table verbatim (no
 * transcription) and reshapes it into an array indexed by rung, plus a
 * log10-scaled variant of the three factors (step2 spans ~13-15 orders of
 * magnitude while step1/step3 sit near 1-2x, so a shared linear axis cannot
 * show all three at once).
 *
 * PRESENTATION ONLY. Changes no bound; establishes no operator positivity;
 * the residual/trace/lambda_max/Rayleigh values remain QUADRATURE
 * evaluations, not rigorous interval majorants (sub-gap
 * IMP96888_RAYLEIGH_TAIL_MAJORANT stays open); interval-rigorous certificate
 * reach stays 2a<=0.96; no refereed bound is changed; RH open;
 * NO QED.
 *
 * @see imp-96973-krein-tailtrace-vacuity-factorisation.js (source table, reused verbatim)
 * @see imp-97000-krein-intermediate-rungs-viz-data.js (sibling leaf convention)
 */

import { IMP96973_RUNGS, IMP96973_VERDICT } from './imp-96973-krein-tailtrace-vacuity-factorisation.js';

// chart-ready per-rung row: one row per (N,2a) rung, carrying the three
// telescoping factors and the recomposed total for a grouped-bar comparison.
export const IMP97002_FACTOR_SERIES = Object.freeze(
  Object.entries(IMP96973_RUNGS).map(([key, rung]) =>
    Object.freeze({
      rung: key,
      twoA: rung.twoA,
      N: rung.N,
      step1SumVsSingle: rung.step1SumVsSingle,
      step2SpectralGap: rung.step2SpectralGap,
      step3TrialSlack: rung.step3TrialSlack,
      total: rung.total,
      recomposed: rung.recomposed,
    }),
  ),
);

// log10-scaled variant of the three factors, suitable for a shared linear
// axis: step2 spans ~13-15 orders of magnitude while step1/step3 sit near
// 1-2x, so plotting the raw values together on one axis is unreadable.
export const IMP97002_LOG10_FACTOR_SERIES = Object.freeze(
  IMP97002_FACTOR_SERIES.map((row) =>
    Object.freeze({
      rung: row.rung,
      twoA: row.twoA,
      N: row.N,
      log10Step1: Math.log10(row.step1SumVsSingle),
      log10Step2: Math.log10(row.step2SpectralGap),
      log10Step3: Math.log10(row.step3TrialSlack),
      log10Total: Math.log10(row.total),
    }),
  ),
);

export const IMP97002_HONEST_BANNER =
  'Presentation only: the Tr(B^-1 R_T)/actual vacuity factorises exactly into three telescoping ' +
  'ratios (sum-vs-single x spectral-gap x trial-vector-slack); the spectral-gap factor carries all ' +
  '~14-15 orders at every tabulated rung while the other two stay uniformly benign (<2x). Values ' +
  'are QUADRATURE evaluations, not rigorous interval majorants; sub-gap ' +
  'IMP96888_RAYLEIGH_TAIL_MAJORANT stays open; interval-rigorous certificate reach stays 2a<=0.96; ' +
  'no refereed bound is changed; RH open; NO QED.';

// plain validation object (no self-executing throw; imp-96294/imp-96819 convention -- a viz-data
// leaf must stay inert in the browser so a stale reading cannot blank a lazy-loaded page). Checked
// by scripts/run-assertions.mjs via the IMP97002_ASSERTIONS array below, not at import time.
export const IMP97002_VALIDATION = Object.freeze({
  threeRungsPresent: IMP97002_FACTOR_SERIES.length === 3,
  everyRungRecomposesToTotal: IMP97002_FACTOR_SERIES.every(
    (row) => Math.abs(row.recomposed / row.total - 1) < 1e-6,
  ),
  step1UniformlyBenignAcrossRungs: IMP97002_FACTOR_SERIES.every(
    (row) => row.step1SumVsSingle > 1.5 && row.step1SumVsSingle < 2.5,
  ),
  step3UniformlyBenignAcrossRungs: IMP97002_FACTOR_SERIES.every(
    (row) => row.step3TrialSlack > 1 && row.step3TrialSlack < 1.3,
  ),
  step2CarriesAllOrdersAcrossRungs: IMP97002_FACTOR_SERIES.every((row) => row.step2SpectralGap > 1e13),
  logSeriesMatchesLinearSeries: IMP97002_LOG10_FACTOR_SERIES.every((row, i) => {
    const linear = IMP97002_FACTOR_SERIES[i];
    return (
      Math.abs(Math.pow(10, row.log10Step1) / linear.step1SumVsSingle - 1) < 1e-9 &&
      Math.abs(Math.pow(10, row.log10Step2) / linear.step2SpectralGap - 1) < 1e-9 &&
      Math.abs(Math.pow(10, row.log10Step3) / linear.step3TrialSlack - 1) < 1e-9
    );
  }),
  matchesSourceVerdict:
    IMP96973_VERDICT.factorisationClosesEveryRung === true &&
    IMP96973_VERDICT.vacuityLivesInSpectralGap === true &&
    IMP96973_VERDICT.operatorPositivityProved === false &&
    IMP96973_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
    IMP96973_VERDICT.qed === false,
  honestBannerPresent:
    /RH open/.test(IMP97002_HONEST_BANNER) &&
    /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97002_HONEST_BANNER) &&
    /NO QED/.test(IMP97002_HONEST_BANNER),
});

// imp-96397: registers the IMP97002_VALIDATION checks with the build-time assertion sweep
// (scripts/run-assertions.mjs), which discovers any exported *_ASSERTIONS array without
// requiring an import-time throw.
export const IMP97002_ASSERTIONS = [
  {
    id: 'imp97002-three-rungs-present',
    description: 'all three tabulated (N,2a) rungs reshape into chart-ready rows',
    holds: () => IMP97002_VALIDATION.threeRungsPresent,
  },
  {
    id: 'imp97002-every-rung-recomposes-to-total',
    description: 'step1 x step2 x step3 recomposes to the total vacuity at every rung',
    holds: () => IMP97002_VALIDATION.everyRungRecomposesToTotal,
  },
  {
    id: 'imp97002-step1-uniformly-benign-across-rungs',
    description: 'the sum-vs-single step stays 1.5-2.5x at every rung',
    holds: () => IMP97002_VALIDATION.step1UniformlyBenignAcrossRungs,
  },
  {
    id: 'imp97002-step3-uniformly-benign-across-rungs',
    description: 'the trial-vector-slack step stays 1-1.3x at every rung',
    holds: () => IMP97002_VALIDATION.step3UniformlyBenignAcrossRungs,
  },
  {
    id: 'imp97002-step2-carries-all-orders-across-rungs',
    description: 'the spectral-gap step exceeds 1e13 at every rung',
    holds: () => IMP97002_VALIDATION.step2CarriesAllOrdersAcrossRungs,
  },
  {
    id: 'imp97002-log-series-matches-linear-series',
    description: 'the log10 variant round-trips exactly to the linear factor values',
    holds: () => IMP97002_VALIDATION.logSeriesMatchesLinearSeries,
  },
  {
    id: 'imp97002-matches-source-verdict',
    description: 'the leaf agrees with the imp-96973 source verdict (factorisation closes, spectral gap dominates, no QED)',
    holds: () => IMP97002_VALIDATION.matchesSourceVerdict,
  },
  {
    id: 'imp97002-honest-banner-present',
    description: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers',
    holds: () => IMP97002_VALIDATION.honestBannerPresent,
  },
];
