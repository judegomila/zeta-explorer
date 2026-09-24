/**
 * @module imp-96475-etrunc-sensitivity-viz-data
 *
 * imp-96475 (ux, sonnet-4-6): chart-shaping layer for the imp-96451 E_trunc
 * sensitivity sweep. Every factor, eTrunc, knee, crossover, gap and elasticity
 * value below is copied verbatim from imp-96451-sigma-knee-etrunc-sensitivity.js;
 * the only work done here is projecting the rows onto a log10(factor) x-axis and
 * building the analytic reference line for the chart.
 *
 * @see imp-96451-sigma-knee-etrunc-sensitivity.js (source measurement, method, verdict)
 */

import { IMP96451_SIGMA_KNEE_ETRUNC_SENSITIVITY } from './imp-96451-sigma-knee-etrunc-sensitivity.js';

const {
  rows,
  kneeElasticity,
  crossoverElasticity,
  analyticCrossElasticity,
  baseGapLog10,
  gapMin,
  gapMax,
  finding,
  verdict,
} = IMP96451_SIGMA_KNEE_ETRUNC_SENSITIVITY;

const BASE_ROW = rows.find((r) => r.factor === 1.0);

export const IMP96475_CROSSOVER_POINTS = Object.freeze(
  rows.map((r) => Object.freeze({
    factor: r.factor,
    log10Factor: Math.log10(r.factor),
    log10Nstar: r.crossoverLog10N,
  })),
);

export const IMP96475_KNEE_POINTS = Object.freeze(
  rows
    .filter((r) => r.kneeLog10Nstar !== null)
    .map((r) => Object.freeze({
      factor: r.factor,
      log10Factor: Math.log10(r.factor),
      log10Nstar: r.kneeLog10Nstar,
    })),
);

// Analytic reference slope -2/ln10 through the anchor crossover point (factor = 1).
export const IMP96475_REFERENCE_LINE = Object.freeze([
  Object.freeze({
    log10Factor: Math.log10(0.5),
    log10Nstar: BASE_ROW.crossoverLog10N - analyticCrossElasticity * Math.log10(0.5),
  }),
  Object.freeze({
    log10Factor: Math.log10(2.0),
    log10Nstar: BASE_ROW.crossoverLog10N - analyticCrossElasticity * Math.log10(2.0),
  }),
]);

// The knee leaves the [1e9,1e12] resolution window at 2x (imp-96451 F4).
export const IMP96475_WINDOW_EXIT = Object.freeze(
  rows.find((r) => r.factor === 2.0 && r.kneeLog10Nstar === null) || null,
);

export const IMP96475_AXIS = Object.freeze({
  log10FactorMin: Math.log10(0.5),
  log10FactorMax: Math.log10(2.0),
  log10NstarMin: Math.min(...IMP96475_CROSSOVER_POINTS.map((p) => p.log10Nstar)) - 0.1,
  log10NstarMax: Math.max(...IMP96475_KNEE_POINTS.map((p) => p.log10Nstar)) + 0.1,
});

export const IMP96475_ELASTICITY = Object.freeze({
  knee: kneeElasticity,
  crossover: crossoverElasticity,
  analytic: analyticCrossElasticity,
});

export const IMP96475_GAP = Object.freeze({
  base: baseGapLog10,
  min: gapMin,
  max: gapMax,
});

export const IMP96475_FINDING = Object.freeze({ ...finding });

export const IMP96475_HONEST_BANNER = verdict;
