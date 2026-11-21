/**
 * @module imp-96498-solver-spread-count-shift-crossover-viz-data
 *
 * imp-96498 (ux): import-light viz-data leaf for the imp-96449 solver-path-spread vs
 * count-model-shift comparison. imp-96449 measured, across N = 1e2 .. 1e22, that the
 * Newton-vs-Lambert-W solver-path gamma_N spread stays at floating-point noise everywhere
 * (a few ULP, no growth trend) while the ~1/N count-model reference shift decays steadily
 * from ~6.3e-3 down to ~8.6e-23, with the two curves crossing at N ~ 1e15 -- beyond that the
 * count-model shift itself underflows below the solver noise floor, so the naive claim
 * "solver spread stays below the count-model shift everywhere" is false past that point for
 * a benign reason (both residuals are sub-ULP there, not a real divergence). This module
 * reshapes the baked imp-96449 rows into two log-log-ready point series (solver spread and
 * count-model shift, one point per decade) plus the crossover landmark, so a page can chart
 * it without re-deriving anything.
 *
 * No re-derivation: every value plotted is copied verbatim from
 * IMP96449_SOLVER_PATH_SPREAD_FULL_RANGE.rows. Presentation only; changes no bound;
 * establishes no operator positivity; RH open; NO QED; no refereed bound is changed.
 *
 * @see imp-96449-solver-path-spread-full-range.js (the source object this reshapes)
 * @see imp-96427-knee-crossover-solver-path-spread (knee-only precursor measurement)
 *
 * Ticket: imp-96498 (ux, sonnet-4-6, low). No self-executing assertion throw (per the
 * imp-96294 convention) -- values are validated below via a plain exported check object.
 */

import { IMP96449_SOLVER_PATH_SPREAD_FULL_RANGE as SRC } from './imp-96449-solver-path-spread-full-range.js';

const log10 = Math.log10;

export const IMP96498_SOLVER_SPREAD_SERIES = SRC.rows.map((r) => ({
  log10N: r.log10N,
  log10Spread: log10(r.relGammaSpread),
}));

export const IMP96498_COUNT_SHIFT_SERIES = SRC.rows.map((r) => ({
  log10N: r.log10N,
  log10Shift: log10(r.countModelRelShift),
}));

export const IMP96498_LANDMARKS = Object.freeze({
  ratioCrossLog10N: SRC.ratioCrossLog10N,
  solverNoiseFloor: SRC.solverNoiseFloor,
  maxRelGammaSpread: SRC.maxRelGammaSpread,
  maxRelGammaSpreadLog10N: SRC.maxRelGammaSpreadLog10N,
  window: SRC.window,
});

export const IMP96498_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every point plotted here '
  + 'is copied verbatim from the imp-96449 baked rows; the only computation in this module is the '
  + 'log10 axis reshaping. Both curves are solver-path / count-model diagnostics on the inherited '
  + 'RvM main-term height inversion, not RH evidence: the crossover at N ~ 1e' + SRC.ratioCrossLog10N
  + ' marks where the ~1/N count-model reference shift itself underflows below the ~'
  + SRC.solverNoiseFloor.toExponential(1) + ' machine-precision solver floor, so past that point '
  + 'BOTH curves are numerically negligible -- the crossing is benign, not a real divergence. '
  + 'Changes no bound, establishes no operator positivity.';

// -- plain validation object (no self-executing throw; the imp-96294 convention) --
export const IMP96498_VALIDATION = Object.freeze({
  seriesFullyCovers21Decades:
    IMP96498_SOLVER_SPREAD_SERIES.length === 21 && IMP96498_COUNT_SHIFT_SERIES.length === 21,
  crossoverInRange:
    IMP96498_LANDMARKS.ratioCrossLog10N >= 2 && IMP96498_LANDMARKS.ratioCrossLog10N <= 22,
  countShiftMonotonicallyShrinks: IMP96498_COUNT_SHIFT_SERIES.every(
    (p, i) => i === 0 || p.log10Shift <= IMP96498_COUNT_SHIFT_SERIES[i - 1].log10Shift,
  ),
  solverSpreadStaysBelowMachineNoiseBound: IMP96498_SOLVER_SPREAD_SERIES.every((p) => p.log10Spread < -12),
});
