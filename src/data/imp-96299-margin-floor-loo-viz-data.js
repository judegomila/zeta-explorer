/**
 * @module imp-96299-margin-floor-loo-viz-data
 *
 * imp-96299 (ux): import-light viz-data leaf for the imp-96265 leave-one-out
 * (LOO) / leave-two-out (LTO) refit spread of the imp-96173/imp-96148
 * reciprocal-log-with-floor margin fit. imp-96265 measured how much the
 * fitted floor c moves when held-out height cutoffs are dropped from the
 * seven-point rho(32,T) column, and found the sign (positive floor) robust
 * but the magnitude endpoint-driven -- with the low-height cutoff T=60
 * carrying the most leverage (dropping it lifts the floor by +24%). It
 * shipped no chart.
 *
 * Reshapes the imp-96265 baked IMP_96265_LOO / IMP_96265_LTO rows into a
 * chart-ready series sorted by dropped height, plus the LTO min/max band.
 * No re-derivation: every plotted floor value is copied verbatim from the
 * imp-96265 module.
 *
 * PRESENTATION ONLY. Changes no bound, establishes no operator positivity;
 * RH open; NO QED; no refereed bound is changed.
 *
 * @see imp-96265-margin-floor-loo-stability.js (LOO/LTO refits this reshapes)
 *
 * Ticket: imp-96299 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 * No self-executing assertion throw (per the imp-96294 convention) -- values are validated below
 * via a plain exported check object instead of an import-time throw.
 */

import {
  IMP_96265_FULL_FIT,
  IMP_96265_LOO,
  IMP_96265_LTO,
  IMP_96265_MARGIN_FLOOR_LOO_STABILITY,
} from './imp-96265-margin-floor-loo-stability.js';

// The seven LOO refits, reshaped for plotting against the dropped height T,
// sorted ascending so the T=60 leverage point sits at the left edge.
export const IMP96299_LOO_SERIES = [...IMP_96265_LOO]
  .sort((a, b) => a.droppedT - b.droppedT)
  .map((row) => ({
    droppedT: row.droppedT,
    floor: row.floor,
    isHighestLeverage: row.droppedT === IMP_96265_MARGIN_FLOOR_LOO_STABILITY.highestLeveragePoint,
    deltaFromFullFit: row.floor - IMP_96265_FULL_FIT.c,
  }));

export const IMP96299_LTO_BAND = Object.freeze({
  min: IMP_96265_MARGIN_FLOOR_LOO_STABILITY.ltoStats.min,
  max: IMP_96265_MARGIN_FLOOR_LOO_STABILITY.ltoStats.max,
  mean: IMP_96265_MARGIN_FLOOR_LOO_STABILITY.ltoStats.mean,
  count: IMP_96265_LTO.length,
});

export const IMP96299_ANCHORS = Object.freeze({
  fullFitFloor: IMP_96265_FULL_FIT.c,
  bakedFloor: IMP_96265_MARGIN_FLOOR_LOO_STABILITY.bakedFloor,
  highestLeverageT: IMP_96265_MARGIN_FLOOR_LOO_STABILITY.highestLeveragePoint,
  highestLeverageFloor: IMP96299_LOO_SERIES.find((r) => r.isHighestLeverage).floor,
  looMin: IMP_96265_MARGIN_FLOOR_LOO_STABILITY.looStats.min,
  looMax: IMP_96265_MARGIN_FLOOR_LOO_STABILITY.looStats.max,
});

export const IMP96299_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every LOO/LTO floor value '
  + 'is copied verbatim from the imp-96265 baked refit tables; only the by-dropped-height sort and '
  + 'delta-from-full-fit are computed here (no re-derivation, no new refit). The positive-floor sign '
  + 'is robust across every held-out subset; the magnitude is endpoint-driven by the T=60 cutoff.';

// -- plain validation object (no self-executing throw; the imp-96294 convention) --
export const IMP96299_VALIDATION = Object.freeze({
  looSeriesLengthMatches: IMP96299_LOO_SERIES.length === IMP_96265_LOO.length,
  exactlyOneHighestLeveragePoint: IMP96299_LOO_SERIES.filter((r) => r.isHighestLeverage).length === 1,
  highestLeverageHasLargestDelta: IMP96299_LOO_SERIES.every(
    (r) => r.isHighestLeverage || Math.abs(r.deltaFromFullFit)
      <= Math.abs(IMP96299_LOO_SERIES.find((h) => h.isHighestLeverage).deltaFromFullFit) + 1e-12
  ),
  ltoBandClearsZero: IMP96299_LTO_BAND.min > 0.1,
});

export default {
  looSeries: IMP96299_LOO_SERIES,
  ltoBand: IMP96299_LTO_BAND,
  anchors: IMP96299_ANCHORS,
  banner: IMP96299_HONEST_BANNER,
  validation: IMP96299_VALIDATION,
};
