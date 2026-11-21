/**
 * @module imp-97171-route-m-farfield-slopeband-vs-original-viz-data
 * @fileoverview imp-97171 -- VIZ DATA ONLY. Bakes a chart-ready comparison of the imp-97142
 *   propagated fPctVsLine INTERVAL (from the imp-96667 interior-slope band s* in 5.66..5.80,
 *   linearly through F(s*) = F_center * (s* / 5.76)) against the ORIGINAL imp-96982 credible
 *   band (+1.369% floor .. +8.356% top). Shows both bands on one axis so the "entire propagated
 *   interval sits below the original floor" verdict is readable at a glance, without importing
 *   either source module. Values are literals recomputed directly from the imp-97142 formulas
 *   (self-contained, no import of the 16.7MB zeros bundle or any heavy module) -- pure frozen-object
 *   data, no imports, no self-executing assertions of its own, per the [[no_heavy_imports_in_pages]]
 *   convention -- needs no separate DATA_MODULES registration.
 *
 *   @see imp-97142-route-m-farfield-ceiling-slope-band-interval.js (the propagated interval this bakes)
 *   @see imp-96982-frobenius-holdout-quadratic-favoured-glossary-headword.js (the original credible band)
 *
 *   Ticket: imp-97171 (ux, low). Presentation of an already-established measurement; adds no new
 *   Lambda bound. No refereed bound is changed. RH open. NO QED.
 */

// -- recomputed directly from imp-97142's linear propagation F(s*) = F_center * (s*/5.76) --
export const IMP97171_SLOPE_BAND_ROWS = Object.freeze([
  Object.freeze({ label: 'slope lo (5.66)', sStar: 5.66, fCeiling: 3.7095e7, fPctVsLine: -2.035 }),
  Object.freeze({ label: 'slope center (5.76)', sStar: 5.76, fCeiling: 3.775e7, fPctVsLine: -0.304 }),
  Object.freeze({ label: 'slope hi (5.80)', sStar: 5.80, fCeiling: 3.8012e7, fPctVsLine: 0.389 }),
]);

// -- the original imp-96982 credible band, for the same axis --
export const IMP97171_ORIGINAL_BAND = Object.freeze({
  floorLabel: '+d/N floor',
  floorPct: 1.369,
  topLabel: 'quadratic top',
  topPct: 8.356,
});

// -- side-by-side comparison rows for a single bar/range chart --
export const IMP97171_COMPARISON_ROWS = Object.freeze([
  Object.freeze({ series: 'imp-97142 propagated interval', loPct: -2.035, hiPct: 0.389, widthPp: 2.424 }),
  Object.freeze({ series: 'imp-96982 original band', loPct: 1.369, hiPct: 8.356, widthPp: 6.987 }),
]);

export const IMP97171_VERDICT = Object.freeze({
  question:
    'plot the imp-97142 propagated fPctVsLine interval against the imp-96982 original credible ' +
    'band on one axis: does the whole propagated interval sit below the original floor?',
  entireIntervalBelowOriginalFloor: true, // hiPct = +0.389 < floorPct = +1.369
  topMarginBelowFloorPp: 0.980, // 1.369 - 0.389
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'The imp-97142 propagated interval [-2.035%, +0.389%] sits entirely below the imp-96982 ' +
    'original credible band [+1.369%, +8.356%], with the closest approach (top of the propagated ' +
    'interval vs the floor of the original band) still ~0.98 percentage points apart. Presentation ' +
    'only; no bound on Lambda moves; no refereed bound is changed; RH open; NO QED.',
});

export default Object.freeze({
  id: 'imp-97171-route-m-farfield-slopeband-vs-original-viz-data',
  ticket: 'imp-97171',
  sources: [
    'imp-97142-route-m-farfield-ceiling-slope-band-interval.js',
    'imp-96982-frobenius-holdout-quadratic-favoured-glossary-headword.js',
  ],
  slopeBandRows: IMP97171_SLOPE_BAND_ROWS,
  originalBand: IMP97171_ORIGINAL_BAND,
  comparisonRows: IMP97171_COMPARISON_ROWS,
  verdict: IMP97171_VERDICT,
  anyBoundMoved: false,
});
