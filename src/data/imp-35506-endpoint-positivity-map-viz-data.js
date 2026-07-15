/**
 * @module imp-35506-endpoint-positivity-map-viz-data
 * @fileoverview imp-35506 -- VIZ DATA ONLY tabulating the N=2000 pair-1495 ENDPOINT-positivity
 *   map across the three dense-output families crossed with the two base flow grids: DP45 / RK4
 *   / BS3 (order 5, 4, 3) x dt, dt/2. imp-35452 mapped RK4 and DP45 across dt, dt/2, dt/4; imp-35477
 *   added BS3 as a third family at dt, dt/2. Restricting to the shared dt/dt-2 grid gives a clean
 *   3x2 matrix with exactly ONE endpoint-POSITIVE cell (DP45 dt/2) against five endpoint-NEGATIVE
 *   cells -- the imp-35416/imp-35452 knife-edge, now shown corroborated by BS3 as well.
 *
 *   Baked literals reproduced verbatim from the imp-35452 and imp-35477 reference modules (no
 *   fresh computation); this module imports those two lightweight reference modules directly
 *   (neither imports the 16.7MB zeros bundle) rather than re-baking the numbers a third time,
 *   per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-35452-n2000-endpoint-positivity-knife-edge-reference.js (RK4/DP45 source, dt/dt2/dt4)
 *   @see imp-35477-n2000-bs3-dense-crossvalidate-reference.js (BS3 source, dt/dt2)
 *   @see imp-35416 (two-family scheme-independence flag that motivated the knife-edge map)
 *
 *   Ticket: imp-35506 (ux, medium). Presentation only of already-established measurements; adds
 *   no new Lambda bound. C_mb GUE-conditional per imp-486 UNTOUCHED. NO QED.
 *   Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 */

import { IMP_35452_N2000_ENDPOINT_POSITIVITY_KNIFE_EDGE_REFERENCE } from './imp-35452-n2000-endpoint-positivity-knife-edge-reference.js';
import { IMP_35477_N2000_BS3_DENSE_CROSSVALIDATE_REFERENCE } from './imp-35477-n2000-bs3-dense-crossvalidate-reference.js';

const { endpointMap: KNIFE_EDGE_MAP } = IMP_35452_N2000_ENDPOINT_POSITIVITY_KNIFE_EDGE_REFERENCE;
const { bs3: BS3 } = IMP_35477_N2000_BS3_DENSE_CROSSVALIDATE_REFERENCE;

// -- 3x2 family-x-grid endpoint-positivity matrix (DP45/RK4/BS3 x dt, dt/2). ------
export const IMP35506_ENDPOINT_MAP = Object.freeze([
  Object.freeze({
    family: 'DP45', order: 5, grid: 'dt',
    endpointGap: KNIFE_EDGE_MAP.dp45.dt.minEndGap,
    positive: KNIFE_EDGE_MAP.dp45.dt.endpointSign === 'positive',
  }),
  Object.freeze({
    family: 'DP45', order: 5, grid: 'dt/2',
    endpointGap: KNIFE_EDGE_MAP.dp45.dtHalf.minEndGap,
    positive: KNIFE_EDGE_MAP.dp45.dtHalf.endpointSign === 'positive',
  }),
  Object.freeze({
    family: 'RK4', order: 4, grid: 'dt',
    endpointGap: KNIFE_EDGE_MAP.rk4.dt.minEndGap,
    positive: KNIFE_EDGE_MAP.rk4.dt.endpointSign === 'positive',
  }),
  Object.freeze({
    family: 'RK4', order: 4, grid: 'dt/2',
    endpointGap: KNIFE_EDGE_MAP.rk4.dtHalf.minEndGap,
    positive: KNIFE_EDGE_MAP.rk4.dtHalf.endpointSign === 'positive',
  }),
  Object.freeze({
    family: 'BS3', order: 3, grid: 'dt',
    endpointGap: BS3.dt.g_curr,
    positive: BS3.dt.endpointPositive === true,
  }),
  Object.freeze({
    family: 'BS3', order: 3, grid: 'dt/2',
    endpointGap: BS3.dtHalf.g_curr,
    positive: BS3.dtHalf.endpointPositive === true,
  }),
]);

export const IMP35506_POSITIVE_CELLS = IMP35506_ENDPOINT_MAP.filter((c) => c.positive);
export const IMP35506_NEGATIVE_CELLS = IMP35506_ENDPOINT_MAP.filter((c) => !c.positive);

export const IMP35506_SUMMARY = Object.freeze({
  totalCells: IMP35506_ENDPOINT_MAP.length,
  positiveCount: IMP35506_POSITIVE_CELLS.length,
  negativeCount: IMP35506_NEGATIVE_CELLS.length,
  lonePositiveCell: IMP35506_POSITIVE_CELLS.length === 1
    ? `${IMP35506_POSITIVE_CELLS[0].family} ${IMP35506_POSITIVE_CELLS[0].grid}`
    : null,
});

export default Object.freeze({
  id: 'imp-35506-endpoint-positivity-map-viz-data',
  ticket: 'imp-35506',
  sources: [
    'imp-35452-n2000-endpoint-positivity-knife-edge-reference.js',
    'imp-35477-n2000-bs3-dense-crossvalidate-reference.js',
  ],
  endpointMap: IMP35506_ENDPOINT_MAP,
  summary: IMP35506_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35506_ASSERTIONS = [
  {
    id: 'imp35506-six-cells-present',
    holds: () =>
      IMP35506_ENDPOINT_MAP.length === 6 &&
      IMP35506_ENDPOINT_MAP.filter((c) => c.family === 'DP45').length === 2 &&
      IMP35506_ENDPOINT_MAP.filter((c) => c.family === 'RK4').length === 2 &&
      IMP35506_ENDPOINT_MAP.filter((c) => c.family === 'BS3').length === 2,
    why: 'The map must cover exactly the 3x2 (DP45/RK4/BS3 x dt, dt/2) matrix, six cells total.',
  },
  {
    id: 'imp35506-lone-positive-cell-is-dp45-dthalf',
    holds: () =>
      IMP35506_POSITIVE_CELLS.length === 1 &&
      IMP35506_POSITIVE_CELLS[0].family === 'DP45' &&
      IMP35506_POSITIVE_CELLS[0].grid === 'dt/2' &&
      IMP35506_POSITIVE_CELLS[0].endpointGap > 0,
    why: 'imp-35452: across the shared dt/dt-2 grid the DP45 dt/2 cell must be the UNIQUE endpoint-positive cell.',
  },
  {
    id: 'imp35506-five-negative-cells',
    holds: () =>
      IMP35506_NEGATIVE_CELLS.length === 5 &&
      IMP35506_NEGATIVE_CELLS.every((c) => c.endpointGap < 0),
    why: 'The remaining five cells (DP45 dt, RK4 dt, RK4 dt/2, BS3 dt, BS3 dt/2) must all have a negative endpoint gap.',
  },
  {
    id: 'imp35506-summary-matches-map',
    holds: () =>
      IMP35506_SUMMARY.totalCells === 6 &&
      IMP35506_SUMMARY.positiveCount === 1 &&
      IMP35506_SUMMARY.negativeCount === 5 &&
      IMP35506_SUMMARY.lonePositiveCell === 'DP45 dt/2',
    why: 'The summary counts must agree with the underlying map: 6 cells, 1 positive, 5 negative, lone positive cell DP45 dt/2.',
  },
  {
    id: 'imp35506-bs3-values-reproduce-imp35477',
    holds: () =>
      Math.abs(BS3.dt.g_curr - -2.635e-6) < 1e-9 &&
      Math.abs(BS3.dtHalf.g_curr - -1.044e-5) < 1e-9,
    why: 'The BS3 endpoint gaps must reproduce the imp-35477 baked literals verbatim (g_curr at dt and dt/2).',
  },
];

for (const assertion of IMP35506_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35506-endpoint-positivity-map-viz-data assertion failed: ${assertion.id}`);
  }
}
