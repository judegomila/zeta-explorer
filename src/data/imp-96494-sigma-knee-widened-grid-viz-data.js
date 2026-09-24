/**
 * @module imp-96494-sigma-knee-widened-grid-viz-data
 *
 * imp-96494 (ux, sonnet-4-6): chart-shaping layer for the imp-96464 widened-grid
 * sigma-knee re-measurement. Every factor, eTrunc, knee, crossover, gap,
 * elasticity and exit-factor value below is copied verbatim from
 * imp-96464-sigma-knee-widened-grid-window-exit.js; the only work done here is
 * projecting the rows onto a log10(factor) x-axis and building the analytic
 * reference line for the chart.
 *
 * @see imp-96464-sigma-knee-widened-grid-window-exit.js (source measurement, method, verdict)
 */

import { IMP96464_SIGMA_KNEE_WIDENED_GRID_WINDOW_EXIT } from './imp-96464-sigma-knee-widened-grid-window-exit.js';

const {
  rows,
  kneeElasticity,
  crossoverElasticity,
  imp96451KneeElasticity,
  gapMin,
  gapMax,
  exitFactorLowEdge,
  exitETruncLowEdge,
  originalWindow,
  finding,
  verdict,
} = IMP96464_SIGMA_KNEE_WIDENED_GRID_WINDOW_EXIT;

const BASE_ROW = rows.find((r) => r.factor === 1.0);

export const IMP96494_CROSSOVER_POINTS = Object.freeze(
  rows.map((r) => Object.freeze({
    factor: r.factor,
    log10Factor: Math.log10(r.factor),
    log10Nstar: r.crossoverLog10N,
  })),
);

export const IMP96494_KNEE_POINTS = Object.freeze(
  rows
    .filter((r) => r.kneeLog10Nstar !== null)
    .map((r) => Object.freeze({
      factor: r.factor,
      log10Factor: Math.log10(r.factor),
      log10Nstar: r.kneeLog10Nstar,
    })),
);

// Analytic reference slope through the anchor crossover point (factor = 1),
// using the widened-grid knee elasticity (matches the crossover elasticity
// to three figures per imp-96464 G2).
export const IMP96494_REFERENCE_LINE = Object.freeze([
  Object.freeze({
    log10Factor: Math.log10(0.5),
    log10Nstar: BASE_ROW.crossoverLog10N - kneeElasticity * Math.log10(0.5),
  }),
  Object.freeze({
    log10Factor: Math.log10(2.0),
    log10Nstar: BASE_ROW.crossoverLog10N - kneeElasticity * Math.log10(2.0),
  }),
]);

// The original [1e9,1e12] resolution window low edge, and the exact factor at
// which the widened-grid knee crosses out of it (imp-96464 G3).
export const IMP96494_WINDOW_EXIT = Object.freeze({
  log10Factor: Math.log10(exitFactorLowEdge),
  log10Nstar: 9.0,
  factor: exitFactorLowEdge,
  eTrunc: exitETruncLowEdge,
});

export const IMP96494_AXIS = Object.freeze({
  log10FactorMin: Math.log10(0.5),
  log10FactorMax: Math.log10(2.0),
  log10NstarMin: Math.min(...IMP96494_CROSSOVER_POINTS.map((p) => p.log10Nstar)) - 0.1,
  log10NstarMax: Math.max(...IMP96494_KNEE_POINTS.map((p) => p.log10Nstar)) + 0.1,
});

export const IMP96494_ELASTICITY = Object.freeze({
  knee: kneeElasticity,
  crossover: crossoverElasticity,
  onWindow: imp96451KneeElasticity,
});

export const IMP96494_GAP = Object.freeze({ min: gapMin, max: gapMax });

export const IMP96494_ORIGINAL_WINDOW = originalWindow;

export const IMP96494_FINDING = Object.freeze({ ...finding });

export const IMP96494_HONEST_BANNER = verdict;
