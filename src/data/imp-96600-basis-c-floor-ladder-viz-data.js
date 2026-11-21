/**
 * @module imp-96600-basis-c-floor-ladder-viz-data
 *
 * imp-96600 (ux): import-light viz-data leaf for the imp-96568 basis-C
 * intermediate-rung floor(L) ladder. imp-96568 measured the best-achievable
 * direct-integral floor at L = 1e3, 1e5, 1e6, the PT anchor (5.9e6), and
 * 1e7, finding that the optimum panels-per-period (ppp) collapses
 * monotonically (256 -> 48 -> 6 -> 3 -> 3) as the floor mechanism crosses
 * from cancellation-set (small L, needs high ppp) to Simpson-truncation-set
 * (at/above the anchor, ppp pinned at the resolution floor ~3), and that the
 * floor grows super-linearly above the anchor (exponent ~1.81, not the
 * L-linear exponent 1 assumed upstream). That ladder had numbers but no
 * chart; this module reshapes it into log-log-ready arrays for one.
 *
 * PRESENTATION ONLY. Every value here is reused verbatim from the imp-96568
 * floorLadder / floorGrowth records; only the log10 reshaping and the
 * regime split (ppp-collapsed vs ppp-pinned) are new. Changes no bound,
 * establishes no operator positivity, no RH claim; no refereed bound is changed
 * . RH open. NO QED.
 *
 * @see imp-96568-basis-c-intermediate-rung-floor-ladder.js (source measurement)
 *
 * Ticket: imp-96600 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 *
 * Import-light: only re-exports/reshapes imp-96568 (itself import-light,
 * no zeros bundle, no sibling imports).
 */

import {
  IMP96568_BASIS_C_INTERMEDIATE_RUNG_FLOOR_LADDER,
  IMP96568_HONEST_BANNER,
} from './imp-96568-basis-c-intermediate-rung-floor-ladder.js';

const { floorLadder, floorGrowth, ptAnchorL } = IMP96568_BASIS_C_INTERMEDIATE_RUNG_FLOOR_LADDER;

// Reshaped ladder: log10 coordinates + a two-way regime split driven by the
// optimum-ppp collapse (imp-96568 FINDING 1), not by an arbitrary L cutoff.
export const IMP96600_LADDER = Object.freeze(
  floorLadder.map((row) => ({
    L: row.L,
    logL: Math.log10(row.L),
    floor: row.floor,
    logFloor: Math.log10(row.floor),
    optPpp: row.optPpp,
    mechanism: row.mechanism,
    pppPinned: row.optPpp <= 3,
  })),
);

// The two ppp-pinned (truncation-set) rungs anchor the above-anchor power
// law; used to draw the fitted trend line on the chart.
const pinnedRows = IMP96600_LADDER.filter((r) => r.pppPinned);
const anchorRow = pinnedRows[0];
const lastRow = pinnedRows[pinnedRows.length - 1];

export const IMP96600_FIT_LINE = Object.freeze({
  exponent: floorGrowth.aboveAnchorExponent, // ~1.81
  from: { L: anchorRow.L, logL: anchorRow.logL, logFloor: anchorRow.logFloor },
  to: { L: lastRow.L, logL: lastRow.logL, logFloor: lastRow.logFloor },
});

export const IMP96600_REGIME_SPLIT = Object.freeze({
  cancellationSetOptPpp: IMP96600_LADDER[0].optPpp, // 256 at L=1e3
  truncationSetOptPpp: lastRow.optPpp, // 3, pinned at anchor and 1e7
  ptAnchorL,
  note:
    'Optimum ppp collapses monotonically with L (256 -> 48 -> 6 -> 3 -> 3): below the anchor ' +
    'the floor is cancellation-set (needs high ppp to vanish); at/above the anchor it is ' +
    'Simpson-truncation-set (ppp pinned at the resolution floor ~3).',
});

export const IMP96600_HONEST_BANNER = IMP96568_HONEST_BANNER;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96600_ASSERTIONS = [
  {
    id: 'imp96600-ladder-has-five-rungs-monotone-in-L-and-floor',
    holds: () =>
      IMP96600_LADDER.length === 5 &&
      IMP96600_LADDER.every(
        (row, i) => i === 0 || (row.L > IMP96600_LADDER[i - 1].L && row.floor > IMP96600_LADDER[i - 1].floor),
      ),
    why: 'imp-96568 measured exactly five rungs (1e3, 1e5, 1e6, anchor, 1e7), both L and floor strictly increasing.',
  },
  {
    id: 'imp96600-optppp-collapses-256-to-3',
    holds: () =>
      IMP96600_LADDER[0].optPpp === 256 &&
      IMP96600_LADDER[IMP96600_LADDER.length - 1].optPpp === 3 &&
      IMP96600_LADDER.every((row, i) => i === 0 || row.optPpp <= IMP96600_LADDER[i - 1].optPpp),
    why: 'FINDING 1: the optimum ppp collapses monotonically (non-increasing) from 256 at L=1e3 to 3 at/above the anchor.',
  },
  {
    id: 'imp96600-two-pinned-rungs-drive-the-fit-line',
    holds: () =>
      pinnedRows.length === 2 &&
      IMP96600_FIT_LINE.exponent > 1.5 &&
      IMP96600_FIT_LINE.exponent < 2.2,
    why: 'the above-anchor fit line uses exactly the two ppp-pinned (truncation-set) rungs, exponent ~1.81 (super-linear, not L-linear).',
  },
  {
    id: 'imp96600-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96600_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96600_HONEST_BANNER) &&
      /NO QED/.test(IMP96600_HONEST_BANNER),
    why: 'every Route I/basis-C viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP96600_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96600-basis-c-floor-ladder-viz-data assertion failed: ${a.id}`);
  }
}
