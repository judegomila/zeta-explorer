/**
 * @module imp-96763-gmin-exponent-finiteN-trend-viz-data
 *
 * imp-96763 (ux): import-light viz-data leaf for the imp-96734 sliding-window
 * local gap exponent b(N_center), the high-N-restricted cumulative fits, and
 * the split-half single-power fits, all plotted against the GUE extreme-gap
 * cube-root exponent -1/3 line.
 *
 * imp-96734 measured the finite-N trend of the running-min gap exponent
 * (does it converge to GUE -1/3 as N grows, or stay persistently steeper?)
 * but shipped no chart-ready shape. This module reshapes
 * GMIN_EXPONENT_FINITEN_TREND (imported directly, no transcription) into
 * log10(N)-vs-b series ready for an SVG/line-chart consumer.
 *
 * PRESENTATION ONLY. Changes no bound, proves nothing new; the -0.3953 vs
 * -1/3 gap remains a measurement (conditional on GUE, not a QED); Platt-
 * Trudgian Lambda <= 0.2 remains SOTA; RH open; NO QED.
 *
 * @see imp-96734-gmin-exponent-finiteN-trend.js (source measurement + verdict)
 * @see imp-96777-krein-lammin-n-trend-viz-data.js (sibling viz-data leaf convention)
 *
 * Ticket: imp-96763 (ux, sonnet-4-6, medium). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import GMIN_EXPONENT_FINITEN_TREND from './imp-96734-gmin-exponent-finiteN-trend.js';

export const IMP96763_GUE_EXPONENT = GMIN_EXPONENT_FINITEN_TREND.gueExtremeGapExponent;

// (a) Sliding-window local exponent b(N_center), W=5, plotted against log10(N_center).
export const IMP96763_SLIDING_SERIES = Object.freeze(
  GMIN_EXPONENT_FINITEN_TREND.slidingWindow.W5.rows.map((row) =>
    Object.freeze({
      Ncenter: row.Ncenter,
      log10Ncenter: Math.log10(row.Ncenter),
      b: row.b,
      rms: row.rms,
    }),
  ),
);

export const IMP96763_SLIDING_TREND = Object.freeze({
  W5: {
    trendSlopePerDecade: GMIN_EXPONENT_FINITEN_TREND.slidingWindow.W5.trendSlopePerDecade,
    firstWindowB: GMIN_EXPONENT_FINITEN_TREND.slidingWindow.W5.firstWindowB,
    lastWindowB: GMIN_EXPONENT_FINITEN_TREND.slidingWindow.W5.lastWindowB,
  },
  W3: {
    trendSlopePerDecade: GMIN_EXPONENT_FINITEN_TREND.slidingWindow.W3.trendSlopePerDecade,
    firstWindowB: GMIN_EXPONENT_FINITEN_TREND.slidingWindow.W3.firstWindowB,
    lastWindowB: GMIN_EXPONENT_FINITEN_TREND.slidingWindow.W3.lastWindowB,
  },
});

// (b) High-N-restricted cumulative single-power fits, plotted against log10(NfromExp).
export const IMP96763_HIGHN_SERIES = Object.freeze(
  GMIN_EXPONENT_FINITEN_TREND.highNRestricted.map((row) =>
    Object.freeze({
      NfromExp: row.NfromExp,
      log10NfromExp: Math.log10(row.NfromExp),
      kFrom: row.kFrom,
      nPts: row.nPts,
      b: row.b,
      rms: row.rms,
    }),
  ),
);

// (c) Split-half single-power fits.
export const IMP96763_SPLIT_HALF = Object.freeze({
  lowHalf: { ...GMIN_EXPONENT_FINITEN_TREND.splitHalf.lowHalf },
  highHalf: { ...GMIN_EXPONENT_FINITEN_TREND.splitHalf.highHalf },
});

export const IMP96763_VERDICT_SUMMARY = GMIN_EXPONENT_FINITEN_TREND.verdict;

export const IMP96763_HONEST_BANNER =
  'Measurement only, conditional on GUE: the sliding-window and high-N-restricted local ' +
  'exponent b(N) does not trend toward the GUE cube-root -1/3 as N grows over the measured ' +
  'range (N up to ~1.48e6) -- it stays flat-to-steeper. This rules out a finite-N/plateau-bias ' +
  'explanation for the imp-96616 -0.3953 reading; it does not by itself settle the asymptotic ' +
  'value. RH open; no refereed bound is changed; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96763_ASSERTIONS = [
  {
    id: 'imp96763-sliding-series-matches-source-length',
    holds: () =>
      IMP96763_SLIDING_SERIES.length === GMIN_EXPONENT_FINITEN_TREND.slidingWindow.W5.rows.length &&
      IMP96763_SLIDING_SERIES.every((r) => Number.isFinite(r.log10Ncenter)),
    why: 'the sliding-window series must carry every W=5 row from the source measurement with a finite log10(N) coordinate.',
  },
  {
    id: 'imp96763-sliding-series-ncenter-increasing',
    holds: () =>
      IMP96763_SLIDING_SERIES.every(
        (r, i) => i === 0 || r.Ncenter > IMP96763_SLIDING_SERIES[i - 1].Ncenter,
      ),
    why: 'N_center must be strictly increasing along the sliding-window ladder for the log-N axis to be monotone.',
  },
  {
    id: 'imp96763-highn-series-matches-source-length',
    holds: () =>
      IMP96763_HIGHN_SERIES.length === GMIN_EXPONENT_FINITEN_TREND.highNRestricted.length &&
      IMP96763_HIGHN_SERIES.every((r) => Number.isFinite(r.log10NfromExp)),
    why: 'the high-N-restricted series must carry every cumulative-fit row with a finite log10(N) coordinate.',
  },
  {
    id: 'imp96763-gue-line-is-neg-one-third',
    holds: () => Math.abs(IMP96763_GUE_EXPONENT - -1 / 3) < 1e-12,
    why: 'the reference line plotted against every fit must be the GUE sine-kernel extreme-gap cube-root exponent -1/3.',
  },
  {
    id: 'imp96763-no-trend-toward-gue-confirmed',
    holds: () =>
      IMP96763_SLIDING_TREND.W5.trendSlopePerDecade < 0 &&
      IMP96763_SLIDING_TREND.W3.trendSlopePerDecade < 0,
    why: 'the persistence verdict rests on both W=3 and W=5 sliding-window trend slopes being negative (not rising toward -1/3 with N).',
  },
  {
    id: 'imp96763-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96763_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96763_HONEST_BANNER) &&
      /NO QED/.test(IMP96763_HONEST_BANNER),
    why: 'every Route I / small-gap-exponent viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96763_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96763-gmin-exponent-finiteN-trend-viz-data assertion failed: ${a.id}`);
  }
}
