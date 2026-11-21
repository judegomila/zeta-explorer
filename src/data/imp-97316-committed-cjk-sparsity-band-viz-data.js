/**
 * @module imp-97316-committed-cjk-sparsity-band-viz-data
 *
 * imp-97316 (ux): import-light viz-data leaf for the imp-97293 committed c_{jk} Gegenbauer-Legendre
 * overlap sparsity/band pattern. imp-97293 computed the EXACT 100 x 106 committed overlap matrix and
 * proved its support is exactly { j+k even } AND { k <= j+6 } (2850 nonzero of 10600 cells; 5300
 * killed by parity, 2450 killed by the degree band), plus a handful of exact high-degree anchor
 * entries -- but shipped no chart of the band shape or the anchor values.
 *
 * Reuses imp-97293's exported constants verbatim (no re-derivation of any overlap integral, no
 * BigInt-rational arithmetic here):
 *   - IMP97293_PARAMS: N (=100 profiles, rows j=0..99) and Kmax (=105, columns k=0..105).
 *   - IMP97293_SPARSITY: the exact offline-swept census (nonzero / zeroByParity / zeroByDegreeBand /
 *     total) used to cross-check the per-row band reconstruction below.
 *   - IMP97293_ANCHORS: the exact high-degree anchor entries (band-edge and top-degree cells).
 *
 * PER-ROW BAND RECONSTRUCTION. The imp-97293 support rule -- nonzero iff (j+k even) AND (k <= j+6) --
 * is a pure parity/degree-band combinatorial statement (proved by the imp-97293 assertions, not
 * re-derived here). For each row j = 0..N-1, the surviving columns are every k of the same parity as
 * j with 0 <= k <= min(j+6, Kmax); since j+6 <= Kmax for every j <= N-1 = 99 here (Kmax = 105), the
 * band is never clipped by Kmax, so kMax = j+6 exactly and the row count is a simple closed form.
 * This reconstruction is cross-checked at import against the imp-97293 offline-swept total (2850).
 *
 * MEASUREMENT / PRESENTATION ONLY. Changes no bound, establishes no operator positivity, no RH claim;
 * no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97293-krein-committed-cjk-gegenbauer-overlap.js (source: exact overlap matrix, sparsity census, anchors)
 * @see imp-97264-krein-cjk-exact-rational-overlap.js (the monomial-profile predecessor of the sparsity rule)
 *
 * Ticket: imp-97316 (ux, sonnet-4-6, low). Presentation only, RH-free; changes no bound; NO QED.
 *
 * Import-light: imports only the small frozen constants from imp-97293 (params + sparsity census +
 * anchors), no sibling zeros-bundle imports, no re-execution of the BigInt-rational overlap sweep.
 */

import {
  IMP97293_PARAMS,
  IMP97293_SPARSITY,
  IMP97293_ANCHORS,
} from './imp-97293-krein-committed-cjk-gegenbauer-overlap.js';

const N = IMP97293_PARAMS.N; // 100
const KMAX = IMP97293_PARAMS.Kmax; // 105

// Per-row band reconstruction: kMin = 0 or 1 (parity of j), kMax = j+6 (never clipped by Kmax here).
export const IMP97316_ROW_BAND = Array.from({ length: N }, (_, j) => {
  const kMin = j % 2 === 0 ? 0 : 1;
  const kMax = Math.min(j + 6, KMAX);
  const count = kMax >= kMin ? (kMax - kMin) / 2 + 1 : 0;
  return { j, kMin, kMax, count };
});

export const IMP97316_ANCHORS_TABLE = Object.freeze(
  Object.entries(IMP97293_ANCHORS).map(([key, value]) => {
    const [j, k] = key.split(',').map(Number);
    return { j, k, value, atBandEdge: k === j + 6 };
  }),
);

export const IMP97316_SUMMARY = Object.freeze({
  rows: N,
  cols: KMAX + 1,
  total: IMP97293_SPARSITY.total,
  nonzero: IMP97293_SPARSITY.nonzero,
  zeroByParity: IMP97293_SPARSITY.zeroByParity,
  zeroByDegreeBand: IMP97293_SPARSITY.zeroByDegreeBand,
  supportRule: IMP97293_SPARSITY.supportRule,
  reconstructedNonzeroFromRowBand: IMP97316_ROW_BAND.reduce((s, r) => s + r.count, 0),
  minRowCount: Math.min(...IMP97316_ROW_BAND.map((r) => r.count)),
  maxRowCount: Math.max(...IMP97316_ROW_BAND.map((r) => r.count)),
});

export const IMP97316_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Presentation only: the sparsity census and anchor ' +
  'values are copied verbatim from imp-97293 (no re-derivation of the BigInt-rational overlap sweep). ' +
  'The per-row band reconstruction is a direct combinatorial reading of the proved support rule ' +
  '(j+k even AND k <= j+6), cross-checked here against the imp-97293 offline-swept total.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97316_ASSERTIONS = [
  {
    id: 'imp97316-row-band-length-matches-committed-N',
    holds: () => IMP97316_ROW_BAND.length === N && N === 100,
    why: 'the per-row reconstruction must cover every committed profile row j=0..99 (imp-97293 N=100).',
  },
  {
    id: 'imp97316-row-band-ascending-and-in-range',
    holds: () =>
      IMP97316_ROW_BAND.every(
        (r, i) =>
          (i === 0 || r.j === IMP97316_ROW_BAND[i - 1].j + 1) &&
          r.kMin >= 0 &&
          r.kMax <= KMAX &&
          r.kMax === r.j + 6,
      ),
    why: 'rows are in ascending j order and kMax = j+6 exactly for every row (never clipped by Kmax=105 since j<=99), matching the imp-97293 degree-band mechanism.',
  },
  {
    id: 'imp97316-reconstructed-total-matches-imp97293-sweep',
    holds: () => IMP97316_SUMMARY.reconstructedNonzeroFromRowBand === IMP97293_SPARSITY.nonzero,
    why: 'summing the per-row band counts (2850) must reproduce the imp-97293 offline-swept exact nonzero count, since both encode the same proved support rule (j+k even AND k<=j+6).',
  },
  {
    id: 'imp97316-anchors-table-reproduces-imp97293-anchors',
    holds: () =>
      IMP97316_ANCHORS_TABLE.length === Object.keys(IMP97293_ANCHORS).length &&
      IMP97316_ANCHORS_TABLE.every((r) => IMP97293_ANCHORS[`${r.j},${r.k}`] === r.value),
    why: 'every parsed anchor row must exactly match the imp-97293 baked anchor value for the same (j,k) key.',
  },
  {
    id: 'imp97316-band-edge-anchors-flagged-correctly',
    holds: () =>
      IMP97316_ANCHORS_TABLE.filter((r) => r.atBandEdge).length >= 3 &&
      IMP97316_ANCHORS_TABLE.every((r) => r.atBandEdge === (r.k === r.j + 6)),
    why: 'the imp-97293 anchor set explicitly includes several band-edge (k=j+6) cells (e.g. (10,16), (50,56), (63,69), (99,105)); this flag must identify exactly those.',
  },
  {
    id: 'imp97316-honest-banner-present',
    holds: () =>
      /RH open/.test(IMP97316_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97316_HONEST_BANNER) &&
      /NO QED/.test(IMP97316_HONEST_BANNER),
    why: 'every Krein-route viz surface carries the RH-open / PT-Lambda / NO-QED markers.',
  },
];

for (const a of IMP97316_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97316-committed-cjk-sparsity-band-viz-data assertion failed: ${a.id}`);
  }
}

export default {
  rowBand: IMP97316_ROW_BAND,
  anchors: IMP97316_ANCHORS_TABLE,
  summary: IMP97316_SUMMARY,
  banner: IMP97316_HONEST_BANNER,
};
