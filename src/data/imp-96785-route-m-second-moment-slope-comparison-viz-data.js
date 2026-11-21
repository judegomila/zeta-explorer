/**
 * @module imp-96785-route-m-second-moment-slope-comparison-viz-data
 *
 * imp-96785 (ux): import-light viz-data leaf for the imp-96750
 * IMP96750_CONSISTENCY second-moment slope comparison (t-induced ~3.50 vs
 * imp-96708 measured 3.495176 vs the imp-96667 interior 5.6564 vs total
 * 5.80481), reshaping the four slope readouts (all imported directly, no
 * transcription) into chart-ready bars split into the two families the
 * imp-96771 reconciliation already names: the unweighted T-series pair
 * (tInduced, tMeasured708) and the H2-weighted Int-series pair (interior,
 * total).
 *
 * imp-96750 assembled the consistency check but shipped no visualization:
 * this module is presentation only.
 *
 * PRESENTATION ONLY. Changes no bound, establishes no operator positivity;
 * no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96750-route-m-interior-second-moment-upper-bound-reduction.js (source IMP96750_CONSISTENCY + IMP96771_SLOPE_RECONCILIATION)
 * @see imp-96779-route-m-ceiling-ladder-viz-data.js (sibling viz-data leaf convention)
 *
 * Ticket: imp-96785 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP96750_CONSISTENCY,
  IMP96771_SLOPE_RECONCILIATION,
  IMP96750_HONEST_BANNER,
} from './imp-96750-route-m-interior-second-moment-upper-bound-reduction.js';

// Chart-ready bars, one per slope readout, grouped by which series (unweighted T vs H2-weighted Int) they belong to.
export const IMP96785_SLOPE_BARS = Object.freeze([
  Object.freeze({
    key: 'tInduced',
    label: 'T-slope induced (2 s0)',
    family: 'unweighted',
    value: IMP96750_CONSISTENCY.tSlopeInduced,
    color: '#60a5fa',
  }),
  Object.freeze({
    key: 'tMeasured708',
    label: 'T-slope measured (imp-96708)',
    family: 'unweighted',
    value: IMP96750_CONSISTENCY.tSlopeMeasured708,
    color: '#38bdf8',
  }),
  Object.freeze({
    key: 'interiorMeasured667',
    label: 'Interior slope (imp-96667)',
    family: 'weighted',
    value: IMP96750_CONSISTENCY.interiorSlopeMeasured667,
    color: '#fb923c',
  }),
  Object.freeze({
    key: 'totalMeasured667',
    label: 'Total slope (imp-96667)',
    family: 'weighted',
    value: IMP96750_CONSISTENCY.totalSlopeMeasured667,
    color: '#f87171',
  }),
]);

// The two within-family gaps and the cross-family ratio that the imp-96771 reconciliation attributes to the H2 weight.
export const IMP96785_FAMILY_GAPS = Object.freeze({
  unweightedPairAgreementPct:
    (100 * Math.abs(IMP96750_CONSISTENCY.tSlopeInduced - IMP96750_CONSISTENCY.tSlopeMeasured708)) /
    IMP96750_CONSISTENCY.tSlopeMeasured708, // ~0.2%
  weightedPairGap:
    IMP96750_CONSISTENCY.totalSlopeMeasured667 - IMP96750_CONSISTENCY.interiorSlopeMeasured667, // ~0.148, the a=1 border contribution
  interiorOverT708: IMP96771_SLOPE_RECONCILIATION.ratios.interiorOverT708, // ~1.618, <= zeta(2)
  sandwichSlopeCeiling: IMP96771_SLOPE_RECONCILIATION.sandwichSlopeCeiling, // ~5.749
});

export const IMP96785_HONEST_BANNER = IMP96750_HONEST_BANNER;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96785_ASSERTIONS = [
  {
    id: 'imp96785-four-bars-two-families-match-source',
    holds: () =>
      IMP96785_SLOPE_BARS.length === 4 &&
      IMP96785_SLOPE_BARS.filter((b) => b.family === 'unweighted').length === 2 &&
      IMP96785_SLOPE_BARS.filter((b) => b.family === 'weighted').length === 2 &&
      IMP96785_SLOPE_BARS[0].value === IMP96750_CONSISTENCY.tSlopeInduced &&
      IMP96785_SLOPE_BARS[1].value === IMP96750_CONSISTENCY.tSlopeMeasured708 &&
      IMP96785_SLOPE_BARS[2].value === IMP96750_CONSISTENCY.interiorSlopeMeasured667 &&
      IMP96785_SLOPE_BARS[3].value === IMP96750_CONSISTENCY.totalSlopeMeasured667,
    why: 'the four bars must be present, split 2/2 into the unweighted-T and H2-weighted-Int families, and reproduce the source IMP96750_CONSISTENCY values verbatim.',
  },
  {
    id: 'imp96785-weighted-slopes-exceed-unweighted',
    holds: () =>
      IMP96785_SLOPE_BARS[2].value > IMP96785_SLOPE_BARS[0].value &&
      IMP96785_SLOPE_BARS[2].value > IMP96785_SLOPE_BARS[1].value &&
      IMP96785_SLOPE_BARS[3].value > IMP96785_SLOPE_BARS[2].value,
    why: 'the H2-weighted Int slopes must exceed the unweighted T slopes (the weight lifts by up to zeta(2)), and total must exceed interior by the added a=1 border term.',
  },
  {
    id: 'imp96785-family-gaps-consistent-with-reconciliation',
    holds: () =>
      IMP96785_FAMILY_GAPS.unweightedPairAgreementPct < 1 &&
      IMP96785_FAMILY_GAPS.weightedPairGap > 0 &&
      IMP96785_FAMILY_GAPS.weightedPairGap < 1 &&
      Math.abs(
        IMP96785_FAMILY_GAPS.interiorOverT708 - IMP96771_SLOPE_RECONCILIATION.ratios.interiorOverT708,
      ) < 1e-9 &&
      IMP96785_SLOPE_BARS[2].value <= IMP96785_FAMILY_GAPS.sandwichSlopeCeiling,
    why: 'the unweighted pair must agree to well under 1%, the weighted-pair gap must be the small positive a=1 border contribution, and the interior slope must sit at or below the imp-96771 sandwich ceiling.',
  },
  {
    id: 'imp96785-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96785_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96785_HONEST_BANNER) &&
      /NO QED/.test(IMP96785_HONEST_BANNER),
    why: 'every Route M viz surface carries the RH-open / PT-Lambda / NO-QED markers, matching the source verdict.',
  },
];

for (const a of IMP96785_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96785-route-m-second-moment-slope-comparison-viz-data assertion failed: ${a.id}`,
    );
  }
}

export default {
  bars: IMP96785_SLOPE_BARS,
  familyGaps: IMP96785_FAMILY_GAPS,
  banner: IMP96785_HONEST_BANNER,
};
