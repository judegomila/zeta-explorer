/**
 * @module imp-96120-route-m-burnol-ratio-dense-ladder-viz-data
 *
 * imp-96120 (ux): import-light viz-data leaf for the imp-96094 Route M
 * Burnol-ratio dense ladder, which had ten baked rungs (N=250..2600,
 * ratio(N) = d_N^2 log N / C_burnol) but no viz surface.
 *
 * Every value below is copied verbatim from imp-96094's own exported
 * records (no re-derivation, no re-execution of the underlying Gram /
 * Cholesky numerics).
 *
 * MEASUREMENT / PRESENTATION ONLY. Changes no bound, establishes no
 * operator positivity, no RH claim; no refereed bound is changed
 * . RH open. NO QED.
 *
 * @see imp-96094-route-m-burnol-ratio-dense-ladder.js (source ladder)
 * @see imp-96075-route-m-vasyunin-dn-ladder-viz-data.js (sibling viz leaf
 *   for the same Route M Burnol-ratio quantity, coarser N=5..500 range)
 *
 * Ticket: imp-96120 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import {
  IMP96094_C_BURNOL,
  IMP96094_ROWS,
  IMP96094_VERDICT,
  IMP96094_HONEST_BANNER,
} from './imp-96094-route-m-burnol-ratio-dense-ladder.js';

// [N, ratio(N) = d_N^2 log N / C_burnol] -- the ten dense-ladder rungs.
export const IMP96120_LADDER = IMP96094_ROWS.map((r) => ({
  N: r.N,
  ratio: r.ratio,
  dN2: r.dN2,
}));

export const IMP96120_C_BURNOL = IMP96094_C_BURNOL;

export const IMP96120_BAND = Object.freeze({
  lo: Math.min(...IMP96094_ROWS.map((r) => r.ratio)),
  hi: Math.max(...IMP96094_ROWS.map((r) => r.ratio)),
  loN: IMP96094_ROWS.reduce((a, r) => (r.ratio < a.ratio ? r : a)).N,
  hiN: IMP96094_ROWS.reduce((a, r) => (r.ratio > a.ratio ? r : a)).N,
});

export const IMP96120_VERDICT_SUMMARY = Object.freeze({
  band: IMP96094_VERDICT.band,
  monotone: IMP96094_VERDICT.monotone,
  signChangesInDiffs: IMP96094_VERDICT.signChangesInDiffs,
  conclusion: IMP96094_VERDICT.conclusion,
});

export const IMP96120_HONEST_BANNER = IMP96094_HONEST_BANNER;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96120_ASSERTIONS = [
  {
    id: 'imp96120-ladder-matches-source-verbatim',
    holds: () =>
      IMP96120_LADDER.length === IMP96094_ROWS.length &&
      IMP96120_LADDER.every((row, i) => row.N === IMP96094_ROWS[i].N && row.ratio === IMP96094_ROWS[i].ratio),
    why: 'every ladder row is copied field-for-field from IMP96094_ROWS, no re-derivation.',
  },
  {
    id: 'imp96120-band-matches-ten-rungs',
    holds: () =>
      IMP96120_LADDER.length === 10 &&
      Math.abs(IMP96120_BAND.lo - 0.9640024763631571) < 1e-12 &&
      Math.abs(IMP96120_BAND.hi - 1.0102287163795478) < 1e-12 &&
      IMP96120_BAND.loN === 750 &&
      IMP96120_BAND.hiN === 2600,
    why: 'the ten-rung band [0.964,1.010] matches the imp-96094 ladder, with the low point at N=750 and the high point at N=2600.',
  },
  {
    id: 'imp96120-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96120_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96120_HONEST_BANNER) &&
      /NO QED/.test(IMP96120_HONEST_BANNER) &&
      IMP96120_VERDICT_SUMMARY.monotone === false,
    why: 'the honest banner carries the RH-open / PT-Lambda / NO-QED markers required of every Route A-M viz surface, and the copied verdict correctly records the ladder as non-monotone.',
  },
];

for (const a of IMP96120_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96120-route-m-burnol-ratio-dense-ladder-viz-data assertion failed: ${a.id}`);
  }
}

export default {
  cBurnol: IMP96120_C_BURNOL,
  ladder: IMP96120_LADDER,
  band: IMP96120_BAND,
  verdict: IMP96120_VERDICT_SUMMARY,
  banner: IMP96120_HONEST_BANNER,
};
