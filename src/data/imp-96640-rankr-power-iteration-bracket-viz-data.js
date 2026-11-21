/**
 * @module imp-96640-rankr-power-iteration-bracket-viz-data
 *
 * imp-96640 (ux): import-light viz-data leaf for the imp-96612 rank-r
 * power-iteration bracket ladder. imp-96612 measured the moment-ratio
 * log-slopes b_r = slope of R_r(N) = (G_N^{r+1})_11 / (G_N^r)_11 for
 * r = 0..11 on the Vasyunin Gram, showing they climb monotonically from
 * 0 (r=0, frozen diagonal) toward the measured lam_max leading log-slope
 * 0.3526 (imp-96443), reaching within 25% at r=4 and within 10% at r=6.
 * That finding had numbers (a JSDoc table) but no chart or page.
 *
 * MEASUREMENT / PRESENTATION ONLY. Every row (r, slope, ratio, r2) is
 * reused verbatim from imp-96612; only the chart-friendly reshape
 * (cumulative-fraction-of-target framing) is new here. Changes no bound,
 * establishes no operator positivity, no RH claim; no refereed bound is changed
 * . RH open. NO QED.
 *
 * @see imp-96612-route-m-lammax-rankr-power-iteration-bracket.js (source finding + all baked numbers)
 * @see imp-96581-route-m-lammax-rigorous-vs-measured-viz-data.js (sibling viz-data leaf, same convention)
 *
 * Ticket: imp-96640 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP96612_MEASURED_SLOPE,
  IMP96612_RANKR_SLOPES,
  IMP96612_MODE_COUNT,
  IMP96612_HONEST_BANNER,
} from './imp-96612-route-m-lammax-rankr-power-iteration-bracket.js';

// chart-ready ladder: r, slope, ratio-to-target (0..1), r2. Reused verbatim.
export const IMP96640_LADDER = Object.freeze(
  IMP96612_RANKR_SLOPES.map((row) =>
    Object.freeze({ r: row.r, slope: row.slope, ratio: row.ratio, r2: row.r2 }),
  ),
);

export const IMP96640_TARGET_SLOPE = IMP96612_MEASURED_SLOPE;

// the two named mode-count thresholds this viz marks on the chart.
export const IMP96640_THRESHOLDS = Object.freeze({
  within25pctR: IMP96612_MODE_COUNT.firstRWithin25pct, // 4
  within10pctR: IMP96612_MODE_COUNT.firstRWithin10pct, // 6
});

export const IMP96640_HONEST_BANNER = IMP96612_HONEST_BANNER;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96640_ASSERTIONS = [
  {
    id: 'imp96640-ladder-has-twelve-rungs-r0-to-r11',
    holds: () =>
      IMP96640_LADDER.length === 12 &&
      IMP96640_LADDER[0].r === 0 &&
      IMP96640_LADDER[IMP96640_LADDER.length - 1].r === 11,
    why: 'the rank-r ladder must reproduce all 12 imp-96612 rungs (r=0..11) unmodified.',
  },
  {
    id: 'imp96640-ratios-monotone-and-bounded',
    holds: () =>
      IMP96640_LADDER.every(
        (row, i) =>
          row.ratio >= 0 &&
          row.ratio <= 1.0001 &&
          (i === 0 || row.ratio >= IMP96640_LADDER[i - 1].ratio - 1e-9),
      ),
    why: 'ratio = slope/0.3526 must climb monotonically from 0 toward ~1 as r grows, per imp-96612 FINDING 1.',
  },
  {
    id: 'imp96640-thresholds-match-source',
    holds: () => IMP96640_THRESHOLDS.within25pctR === 4 && IMP96640_THRESHOLDS.within10pctR === 6,
    why: 'the marked thresholds (r=4 within 25%, r=6 within 10%) must match the imp-96612 mode-count finding exactly.',
  },
  {
    id: 'imp96640-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96640_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96640_HONEST_BANNER) &&
      /NO QED/.test(IMP96640_HONEST_BANNER),
    why: 'every Route M viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96640_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96640-rankr-power-iteration-bracket-viz-data assertion failed: ${a.id}`);
  }
}
