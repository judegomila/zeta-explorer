/**
 * @module imp-96438-route-m-full-ladder-viz-data
 *
 * imp-96438 (ux): import-light viz-data leaf merging the imp-96094 dense
 * ladder (N=250..2600) and the imp-96105 SPD-Gram extension (N=3000..6000)
 * into a SINGLE combined series, for a chart spanning the full accessible
 * range N=250..6000 against the ratio=1 (RH + simple zeros) target line.
 *
 * The existing imp-96120 page charts only N=250..2600 (its own dense-ladder
 * data) and shows the imp-96105 extension rungs as a separate TABLE only --
 * the extension was never plotted on the same line chart as the dense
 * ladder. This leaf reshapes both sources into one ordered [N, ratio(N)]
 * series (no re-derivation of either source's Gram / Cholesky numerics) so
 * a single chart can show the full oscillation from N=250 to N=6000.
 *
 * MEASUREMENT / PRESENTATION ONLY. Changes no bound, establishes no
 * operator positivity, no RH claim; no refereed bound is changed
 * . RH open. NO QED.
 *
 * @see imp-96094-route-m-burnol-ratio-dense-ladder.js (N=250..2600 source)
 * @see imp-96105-route-m-vasyunin-gram-extend-n6000.js (N=3000..6000 source)
 * @see imp-96120-route-m-burnol-ratio-dense-ladder-viz-data.js (sibling leaf, N=250..2600 chart only)
 *
 * Ticket: imp-96438 (ux, sonnet-4-6, low). Presentation only, RH-free;
 * changes no bound; NO QED.
 */

import { IMP96094_ROWS, IMP96094_C_BURNOL } from './imp-96094-route-m-burnol-ratio-dense-ladder.js';
import { IMP96105_EXT_ROWS, IMP96105_BANDS, IMP96105_HONEST_BANNER } from './imp-96105-route-m-vasyunin-gram-extend-n6000.js';

// The full N=250..6000 series: ten imp-96094 rungs followed by the seven
// imp-96105 extension rungs, sorted by N (both sources are already ordered).
export const IMP96438_FULL_LADDER = Object.freeze([
  ...IMP96094_ROWS.map((r) => ({ N: r.N, ratio: r.ratio, dN2: r.dN2, source: 'imp-96094' })),
  ...IMP96105_EXT_ROWS.map((r) => ({ N: r.N, ratio: r.ratio, dN2: r.dN2, source: 'imp-96105' })),
].map((r) => Object.freeze(r)));

export const IMP96438_C_BURNOL = IMP96094_C_BURNOL;

export const IMP96438_BAND = Object.freeze({
  lo: Math.min(...IMP96438_FULL_LADDER.map((r) => r.ratio)),
  hi: Math.max(...IMP96438_FULL_LADDER.map((r) => r.ratio)),
  loN: IMP96438_FULL_LADDER.reduce((a, r) => (r.ratio < a.ratio ? r : a)).N,
  hiN: IMP96438_FULL_LADDER.reduce((a, r) => (r.ratio > a.ratio ? r : a)).N,
});

export const IMP96438_VERDICT = Object.freeze({
  nMin: IMP96438_FULL_LADDER[0].N,
  nMax: IMP96438_FULL_LADDER[IMP96438_FULL_LADDER.length - 1].N,
  rungCount: IMP96438_FULL_LADDER.length,
  fullSpread: IMP96105_BANDS.full.spread,
  signChanges: IMP96105_BANDS.full.signChanges,
  conclusion:
    'across the full N=250..6000 range the ratio(N) oscillation does not tighten toward the ratio=1 target: '
    + 'a single 17-rung chart shows the same non-monotone band [0.9639,1.0102] with six sign changes seen '
    + 'piecewise in the imp-96094/imp-96105 sources, now visible as one continuous curve.',
});

export const IMP96438_HONEST_BANNER = IMP96105_HONEST_BANNER;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96438_ASSERTIONS = [
  {
    id: 'imp96438-full-ladder-length-and-order',
    holds: () =>
      IMP96438_FULL_LADDER.length === 17 &&
      IMP96438_FULL_LADDER.every((r, i) => i === 0 || r.N > IMP96438_FULL_LADDER[i - 1].N),
    why: 'the combined series must have 10 (imp-96094) + 7 (imp-96105) = 17 rungs, strictly increasing in N.',
  },
  {
    id: 'imp96438-endpoints-match-sources',
    holds: () =>
      IMP96438_FULL_LADDER[0].N === 250 &&
      IMP96438_FULL_LADDER[IMP96438_FULL_LADDER.length - 1].N === 6000 &&
      IMP96438_FULL_LADDER[0].ratio === IMP96094_ROWS[0].ratio &&
      IMP96438_FULL_LADDER[IMP96438_FULL_LADDER.length - 1].ratio === IMP96105_EXT_ROWS[IMP96105_EXT_ROWS.length - 1].ratio,
    why: 'the endpoints (N=250 and N=6000) must reproduce the source ratio values verbatim, no re-derivation.',
  },
  {
    id: 'imp96438-band-matches-imp96105-full-band',
    holds: () =>
      Math.abs(IMP96438_BAND.lo - IMP96105_BANDS.full.lo) < 1e-12 &&
      Math.abs(IMP96438_BAND.hi - IMP96105_BANDS.full.hi) < 1e-12,
    why: 'the merged-series band must match the imp-96105 own full-ladder band [0.9639,1.0102] exactly.',
  },
  {
    id: 'imp96438-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP96438_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96438_HONEST_BANNER) &&
      /NO QED/.test(IMP96438_HONEST_BANNER),
    why: 'honesty gate: presentation only, no RH claim, no refereed bound is changed.',
  },
];

for (const a of IMP96438_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96438-route-m-full-ladder-viz-data assertion failed: ${a.id} (${a.why})`);
  }
}

export default {
  cBurnol: IMP96438_C_BURNOL,
  fullLadder: IMP96438_FULL_LADDER,
  band: IMP96438_BAND,
  verdict: IMP96438_VERDICT,
  banner: IMP96438_HONEST_BANNER,
};
