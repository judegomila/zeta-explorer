/**
 * @module imp-97302-inverse-line-diag-offdiag-coleading-viz-data
 *
 * imp-97302 (ux): import-light viz-data leaf for the imp-97267 exact character-detection
 * decomposition of the inverse-line second moment M2w = DIAG + OFFDIAG
 * (imp-97267-route-m-inverse-map-kloosterman-transfer.js), extended by imp-97284 to b=1201
 * (imp-97284-inverse-line-offdiag-diag-ladder-extension.js). Neither leaf shipped a chart-ready
 * surface for the DIAG-vs-OFFDIAG co-leading decomposition per b.
 *
 * Merges the two baked ladders (imp-97267 b=101..401, imp-97284 b=401..1201, sharing the b=401
 * rung) into one ascending series, adding the per-b diagonal/off-diagonal share of M2w
 * (diagShare = diag/M2w, offShare = offdiag/M2w) so a chart can show both components sitting at
 * ~half of M2w across the whole measured range (b=101..1201), confirming the off-diagonal is
 * co-leading rather than a vanishing lower-order remainder.
 *
 * MEASUREMENT / PRESENTATION ONLY. Every (b, M2w, diag, offdiag) value below is copied verbatim
 * from the imp-97267 and imp-97284 baked ladders (no re-derivation of the exact O(b^3)
 * character-detection kernel). Changes no bound, establishes no operator positivity, no RH claim;
 * no refereed bound is changed. RH open. NO QED.
 *
 * @see imp-97267-route-m-inverse-map-kloosterman-transfer.js (IMP97267_LADDER, b=101..401, parent identity)
 * @see imp-97284-inverse-line-offdiag-diag-ladder-extension.js (IMP97284_LADDER, b=401..1201, extension)
 *
 * Ticket: imp-97302 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 */

import { IMP97267_LADDER } from './imp-97267-route-m-inverse-map-kloosterman-transfer.js';
import { IMP97284_LADDER } from './imp-97284-inverse-line-offdiag-diag-ladder-extension.js';

// merge the two ladders on ascending b, dropping the duplicate b=401 rung from the extension.
const mergedRaw = [
  ...IMP97267_LADDER,
  ...IMP97284_LADDER.filter((r) => !IMP97267_LADDER.some((s) => s.b === r.b)),
];

export const IMP97302_ROWS = mergedRaw
  .slice()
  .sort((a, b) => a.b - b.b)
  .map((r) => ({
    b: r.b,
    M2w: r.M2w,
    diag: r.diag,
    offdiag: r.offdiag,
    offOverDiag: r.offOverDiag,
    diagShare: r.diag / r.M2w,
    offShare: r.offdiag / r.M2w,
  }));

export const IMP97302_MEASURED = Object.freeze({
  bRange: [IMP97302_ROWS[0].b, IMP97302_ROWS[IMP97302_ROWS.length - 1].b],
  diagShareBand: [
    Math.min(...IMP97302_ROWS.map((r) => r.diagShare)),
    Math.max(...IMP97302_ROWS.map((r) => r.diagShare)),
  ],
  offShareBand: [
    Math.min(...IMP97302_ROWS.map((r) => r.offShare)),
    Math.max(...IMP97302_ROWS.map((r) => r.offShare)),
  ],
  coLeading: true, // both shares sit near 0.5 at every measured b: neither dominates
});

export const IMP97302_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: every (b, M2w, diag, offdiag) ' +
  'row is copied verbatim from the imp-97267 (b=101..401) and imp-97284 (b=401..1201) baked ladders ' +
  '(no re-derivation of the exact O(b^3) character-detection kernel); no bound is claimed and no ' +
  'operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97302_ASSERTIONS = [
  {
    id: 'imp97302-nine-merged-rows-present',
    holds: () => IMP97302_ROWS.length === 9,
    why: 'imp-97267 contributes 5 rungs (b=101..401) and imp-97284 contributes 5 rungs (b=401..1201) sharing b=401, merging to 9 distinct rows.',
  },
  {
    id: 'imp97302-ascending-b-order',
    holds: () => IMP97302_ROWS.every((r, i) => i === 0 || r.b > IMP97302_ROWS[i - 1].b),
    why: 'the merged rows are sorted ascending by b for chart rendering.',
  },
  {
    id: 'imp97302-shares-sum-to-one',
    // M2w/diag/offdiag are baked to 6 decimals, so diag + offdiag can differ
    // from M2w by 1e-6 absolute (b=101, b=401) = ~8e-6 relative at M2w ~ 0.13;
    // the tolerance is that storage rounding (2e-5), not 1e-6.
    holds: () => IMP97302_ROWS.every((r) => Math.abs(r.diagShare + r.offShare - 1) < 2e-5),
    why: 'diagShare + offShare must reconstruct the exact identity M2w = diag + offdiag at every row.',
  },
  {
    id: 'imp97302-both-shares-coleading-near-half',
    holds: () =>
      IMP97302_ROWS.every((r) => r.diagShare > 0.4 && r.diagShare < 0.6) &&
      IMP97302_ROWS.every((r) => r.offShare > 0.4 && r.offShare < 0.6),
    why: 'the imp-97267/imp-97284 verdict is that OFFDIAG carries ~half of M2w at every measured b -- both shares must stay in a band around 0.5, confirming co-leading (not a vanishing remainder).',
  },
  {
    id: 'imp97302-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP97302_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97302_HONEST_BANNER) &&
      /NO QED/.test(IMP97302_HONEST_BANNER),
    why: 'every Route-M viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP97302_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97302-inverse-line-diag-offdiag-coleading-viz-data assertion failed: ${a.id}`,
    );
  }
}

export default {
  rows: IMP97302_ROWS,
  measured: IMP97302_MEASURED,
  banner: IMP97302_HONEST_BANNER,
};
