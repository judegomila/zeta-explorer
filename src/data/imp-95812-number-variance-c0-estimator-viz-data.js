/**
 * @module imp-95812-number-variance-c0-estimator-viz-data
 * @fileoverview imp-95812 -- lightweight viz-data module reshaping the imp-95787
 *   ESTIMATOR-CHOICE bias table (the six per-height windowing offsets, the
 *   max/mean/min C0 anchors, and the propagated r_cap(3e12) band) into a
 *   chart-ready row list. Self-computing from the already-measured imp-95787
 *   table -- no re-derivation, no fresh quadrature, no heavy imports. Viz
 *   data only; changes no bound; no QED.
 *
 *   @see imp-95787-number-variance-c0-estimator-bias.js (the measured table this reshapes)
 */

import { IMP95787_NUMBER_VARIANCE_C0_ESTIMATOR_BIAS } from './imp-95787-number-variance-c0-estimator-bias.js';

const SRC = IMP95787_NUMBER_VARIANCE_C0_ESTIMATOR_BIAS;

// Six per-height windowing offsets, chart-ready (x = logT, y = offset).
export const IMP95812_OFFSET_ROWS = Object.freeze(
  SRC.rows.map((row) =>
    Object.freeze({
      Tc: row.Tc,
      logT: row.logT,
      offset: row.offset,
      isArgmax: row.Tc === SRC.estimators.argmaxT,
    }),
  ),
);

// Max / mean / min anchors, chart-ready for a bar/marker overlay on the offset panel.
export const IMP95812_ANCHOR_ROWS = Object.freeze([
  Object.freeze({ label: 'max', c0: SRC.estimators.c0Max, rCap: SRC.windowBottom.rCapMax }),
  Object.freeze({ label: 'mean', c0: SRC.estimators.c0Mean, rCap: SRC.windowBottom.rCapMean }),
  Object.freeze({ label: 'min', c0: SRC.estimators.c0Min, rCap: SRC.windowBottom.rCapMin }),
]);

// Propagated r_cap(3e12) band, chart-ready for a min/mean/max envelope strip.
export const IMP95812_RCAP_BAND = Object.freeze({
  T: SRC.windowBottom.T,
  min: SRC.windowBottom.rCapMin,
  mean: SRC.windowBottom.rCapMean,
  max: SRC.windowBottom.rCapMax,
  gueAsymptote: 1,
});

export const IMP95812_OFFSET_SPREAD = SRC.estimators.offsetSpread;
export const IMP95812_VERDICT = SRC.verdict;
export const IMP95812_CAVEAT_BANNER =
  'Presentation only: re-plots the frozen imp-95787 estimator-bias table verbatim (no ' +
  're-derivation, no fresh term); measure/assess only. Changes no bound of the Lambda ' +
  'program; no operator positivity established; no RH claim; no refereed bound is changed' +
  '; NO QED.';

export default IMP95812_OFFSET_ROWS;
