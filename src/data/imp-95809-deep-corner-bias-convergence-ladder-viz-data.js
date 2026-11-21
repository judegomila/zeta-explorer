/**
 * @module imp-95809-deep-corner-bias-convergence-ladder-viz-data
 * @fileoverview imp-95809 -- lightweight viz-data module reshaping the imp-95788
 *   N=80,120,160,200 finite-size bias ladder at the deepest twin-pair cell
 *   (delta=ln1.2, rho=1) into log-log chart-ready rows: log10(N) and
 *   log10(biasPct) per rung, plus the min/max bounds for axis scaling.
 *
 *   Self-computing from the already-baked imp-95788 ladder -- no re-derivation,
 *   no fresh term, no heavy imports. Viz data only; changes no bound; no QED.
 *
 *   @see imp-95788-twin-pair-deep-corner-finite-n-bias-convergence.js (the ladder this reshapes)
 */

import { IMP95788_TWIN_PAIR_DEEP_CORNER_FINITE_N_BIAS_CONVERGENCE } from './imp-95788-twin-pair-deep-corner-finite-n-bias-convergence.js';

const { ladder, Finf, cell } = IMP95788_TWIN_PAIR_DEEP_CORNER_FINITE_N_BIAS_CONVERGENCE;

export const IMP95809_CELL = Object.freeze({ delta: cell.delta, rho: cell.rho });
export const IMP95809_FINF = Finf;

// Log-log-ready rows: N, biasPct, log10(N), log10(biasPct).
export const IMP95809_LOG_ROWS = Object.freeze(
  ladder.map((r) =>
    Object.freeze({
      nPoints: r.nPoints,
      biasPct: r.biasPct,
      lminDD: r.lminDD,
      logN: Math.log10(r.nPoints),
      logBias: Math.log10(r.biasPct),
    }),
  ),
);

export const IMP95809_LOG_N_MIN = Math.min(...IMP95809_LOG_ROWS.map((r) => r.logN));
export const IMP95809_LOG_N_MAX = Math.max(...IMP95809_LOG_ROWS.map((r) => r.logN));
export const IMP95809_LOG_BIAS_MIN = Math.min(...IMP95809_LOG_ROWS.map((r) => r.logBias));
export const IMP95809_LOG_BIAS_MAX = Math.max(...IMP95809_LOG_ROWS.map((r) => r.logBias));

export const IMP95809_CAVEAT_BANNER =
  'Presentation only: re-plots the frozen imp-95788 N=80..200 bias ladder ' +
  'verbatim (no re-derivation, no fresh DD solve); biasPct is an interior ' +
  'model-seam finite-size diagnostic at the deepest twin-pair cell, not an RH ' +
  'bound. Changes no bound of the Lambda program; NO QED; no refereed bound is changed' +
  '.';
