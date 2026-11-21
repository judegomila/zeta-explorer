/**
 * @module imp-96921-inner-g-factor-band-viz-data
 *
 * imp-96921 (ux): import-light viz-data leaf for the imp-96829 F-route inner-g
 * factor R(N) = ||G_N||_F^2 / T(N) band-position ladder. Reshapes the six
 * measured rungs (N = 250..4000) into two chart-ready series -- the band
 * position (R-1)/(zeta(2)-1) climbing from ~0.72 to ~0.82 of [1, zeta(2)],
 * and the decelerating increment ladder dR (Finding 2) -- plus a compact
 * summary of the drifts-up / does-not-stabilize verdict.
 *
 * PRESENTATION ONLY. Every value here is reused verbatim from the imp-96829
 * IMP96829_LADDER / IMP96829_INCREMENTS / IMP96829_STATS / IMP96829_VERDICT
 * records; only the chart reshape is new. Changes no bound, establishes no
 * operator positivity, no RH claim; no refereed bound is changed.
 * RH open. NO QED.
 *
 * @see imp-96829-route-m-frobenius-inner-g-factor-band.js (source measurement)
 *
 * Ticket: imp-96921 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 *
 * Import-light: only re-exports/reshapes imp-96829 (itself import-light,
 * no zeros bundle, no sibling imports).
 */

import {
  IMP96829_ZETA2,
  IMP96829_LADDER,
  IMP96829_INCREMENTS,
  IMP96829_STATS,
  IMP96829_VERDICT,
} from './imp-96829-route-m-frobenius-inner-g-factor-band.js';

// Band-position series over the measured rungs: bandPos in [0,1] locates R
// inside the proved envelope [1, zeta(2)].
export const IMP96921_BAND_POSITION_SERIES = Object.freeze(
  IMP96829_LADDER.map((r) => ({ N: r.N, R: r.R, bandPos: r.bandPos })),
);

// Increment series: dR shrinks monotonically (Finding 2), suggesting a slow
// convergence to a limit strictly inside the upper band.
export const IMP96921_INCREMENT_SERIES = Object.freeze(
  IMP96829_INCREMENTS.map((row) => ({ from: row.from, to: row.to, dR: row.dR })),
);

export const IMP96921_SUMMARY = Object.freeze({
  zeta2: IMP96829_ZETA2,
  bandPosMin: IMP96829_STATS.bandPosMin, // ~0.7230
  bandPosMax: IMP96829_STATS.bandPosMax, // ~0.8159
  driftsUpward: IMP96829_VERDICT.driftsUpward,
  stabilizesToConstant: IMP96829_VERDICT.stabilizesToConstant,
  incrementsDecelerate: IMP96829_VERDICT.incrementsDecelerate,
  conclusion: IMP96829_VERDICT.conclusion,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96921_ASSERTIONS = [
  {
    id: 'imp96921-band-position-series-length-and-order',
    holds: () =>
      IMP96921_BAND_POSITION_SERIES.length === 6 &&
      IMP96921_BAND_POSITION_SERIES.every(
        (row, i) => i === 0 || row.N > IMP96921_BAND_POSITION_SERIES[i - 1].N,
      ),
    why: 'imp-96829 measured exactly six rungs (N=250..4000) in increasing order of N.',
  },
  {
    id: 'imp96921-band-position-monotone-in-upper-band',
    holds: () =>
      IMP96921_BAND_POSITION_SERIES.every(
        (row, i) => i === 0 || row.bandPos > IMP96921_BAND_POSITION_SERIES[i - 1].bandPos,
      ) &&
      IMP96921_BAND_POSITION_SERIES.every((row) => row.bandPos > 0.7 && row.bandPos < 0.83),
    why: 'the band position must rise monotonically and stay inside the measured upper band ~0.72 to ~0.82 of [1, zeta(2)].',
  },
  {
    id: 'imp96921-increments-series-decelerates',
    holds: () =>
      IMP96921_INCREMENT_SERIES.length === 5 &&
      IMP96921_INCREMENT_SERIES.every(
        (row, i) => i === 0 || row.dR < IMP96921_INCREMENT_SERIES[i - 1].dR,
      ),
    why: 'the reshaped increment series must preserve the shrinking dR trend (Finding 2) across the five gaps between the six rungs.',
  },
  {
    id: 'imp96921-summary-matches-source-verdict-no-qed',
    holds: () =>
      IMP96921_SUMMARY.driftsUpward === true &&
      IMP96921_SUMMARY.stabilizesToConstant === false &&
      /NO QED/.test(IMP96921_SUMMARY.conclusion),
    why: 'this is a presentation-only reshape: the drifts-up / does-not-stabilize verdict and the honesty marker must be carried over unchanged from imp-96829.',
  },
];

for (const a of IMP96921_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96921-inner-g-factor-band-viz-data assertion failed: ${a.id}`);
  }
}
