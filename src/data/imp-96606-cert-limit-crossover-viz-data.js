/**
 * @module imp-96606-cert-limit-crossover-viz-data
 *
 * imp-96606 (ux): import-light viz-data leaf for the imp-96563 / imp-96591
 * double-precision verified-Cholesky certification-limit crossover. Reshapes
 * the imp-96591 IMP96591_CROSSOVER_LADDER (delta(N) = g_{n+1} I(1,1) H_N vs
 * the imp-96428 lam_min ~ A N^-p fit) into a log-log chart-ready series, with
 * the measured crossover N ~ 1.08e5 plus the imp-96352 compute ceiling 9916
 * and the imp-96548 rigorous-lam_max conditioning ceiling ~2.59e7 as markers.
 *
 * PRESENTATION ONLY. Every value here is reused verbatim from imp-96591
 * (itself a re-analysis of the imp-96428 fit and the imp-96563 rounding-shift
 * formula); only the log10 reshape and marker packaging are new. Changes no
 * bound, establishes no operator positivity, no RH claim; no refereed bound is changed
 * . RH open. NO QED.
 *
 * @see imp-96591-route-m-lammin-cert-limit-crossover-measurement.js (source ladder + crossover)
 * @see imp-96563-route-m-lammin-rigorous-lower-bound-assessment.js (IMP96563_CERT_LIMIT_N origin)
 *
 * Ticket: imp-96606 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 *
 * Import-light: only re-exports/reshapes imp-96591 (itself import-light, no
 * zeros bundle, no sibling imports).
 */

import {
  IMP96591_CROSSOVER_LADDER,
  IMP96591_MEASURED_CROSSOVER,
  IMP96591_INPUTS,
  IMP96591_HONEST_BANNER,
} from './imp-96591-route-m-lammin-cert-limit-crossover-measurement.js';

// Log-log-ready series: one row per ladder rung, N/delta/lamMinFit plus their
// base-10 logs for the chart axes.
export const IMP96606_LADDER_SERIES = Object.freeze(
  IMP96591_CROSSOVER_LADDER.map((r) => ({
    N: r.N,
    logN: Math.log10(r.N),
    delta: r.delta,
    logDelta: Math.log10(r.delta),
    lamMinFit: r.lamMinFit,
    logLamMinFit: Math.log10(r.lamMinFit),
    certifiable: r.certifiable,
  })),
);

// Vertical reference markers on the log10(N) axis.
export const IMP96606_MARKERS = Object.freeze({
  crossoverN: IMP96591_MEASURED_CROSSOVER.measuredCrossoverN, // ~1.0757e5
  logCrossoverN: Math.log10(IMP96591_MEASURED_CROSSOVER.measuredCrossoverN),
  computeCeilingN: IMP96591_INPUTS.computeCeilingN, // 9916
  logComputeCeilingN: Math.log10(IMP96591_INPUTS.computeCeilingN),
  rigorousLamMaxCeilingN: IMP96591_INPUTS.rigorousLamMaxCeilingN, // ~2.59e7
  logRigorousLamMaxCeilingN: Math.log10(IMP96591_INPUTS.rigorousLamMaxCeilingN),
});

export const IMP96606_SUMMARY = Object.freeze({
  crossoverN: IMP96606_MARKERS.crossoverN,
  factorAboveComputeCeiling: IMP96591_MEASURED_CROSSOVER.factorAboveComputeCeiling, // ~10.85x
  factorBelowRigorousCeiling: IMP96591_MEASURED_CROSSOVER.factorBelowRigorousCeiling, // ~240.8x
  note: IMP96591_MEASURED_CROSSOVER.note,
});

export const IMP96606_HONEST_BANNER = IMP96591_HONEST_BANNER;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96606_ASSERTIONS = [
  {
    id: 'imp96606-thirteen-rungs-present',
    holds: () => IMP96606_LADDER_SERIES.length === 13,
    why: 'imp-96591 tabulated exactly thirteen rungs (N=1e4..2.59e7) for the delta(N) vs lam_min(N) ladder.',
  },
  {
    id: 'imp96606-delta-rising-lammin-falling',
    holds: () =>
      IMP96606_LADDER_SERIES[0].delta < IMP96606_LADDER_SERIES[IMP96606_LADDER_SERIES.length - 1].delta &&
      IMP96606_LADDER_SERIES[0].lamMinFit > IMP96606_LADDER_SERIES[IMP96606_LADDER_SERIES.length - 1].lamMinFit,
    why: 'delta(N) rises (n u log n) while lam_min(N) falls (A N^-p) across the ladder, so the two curves must cross.',
  },
  {
    id: 'imp96606-crossover-marker-brackets-in-ladder',
    holds: () => {
      const okAt1e5 = IMP96606_LADDER_SERIES.find((r) => r.N === 1.0e5);
      const failAt108 = IMP96606_LADDER_SERIES.find((r) => r.N === 1.08e5);
      return (
        okAt1e5.certifiable === true &&
        failAt108.certifiable === false &&
        IMP96606_MARKERS.crossoverN > 1.0e5 &&
        IMP96606_MARKERS.crossoverN < 1.08e5
      );
    },
    why: 'the crossover marker N ~ 1.0757e5 falls strictly between the last cert-ok rung (1.00e5) and the first cert-fail rung (1.08e5).',
  },
  {
    id: 'imp96606-markers-ordered-compute-crossover-ceiling',
    holds: () =>
      IMP96606_MARKERS.computeCeilingN < IMP96606_MARKERS.crossoverN &&
      IMP96606_MARKERS.crossoverN < IMP96606_MARKERS.rigorousLamMaxCeilingN,
    why: 'the three reference scales are strictly ordered: compute ceiling 9916 < cert-limit crossover ~1.08e5 < conditioning ceiling ~2.59e7.',
  },
  {
    id: 'imp96606-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96606_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96606_HONEST_BANNER) &&
      /NO QED/.test(IMP96606_HONEST_BANNER),
    why: 'every Route M lam_min viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96606_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96606-cert-limit-crossover-viz-data assertion failed: ${a.id}`);
  }
}
