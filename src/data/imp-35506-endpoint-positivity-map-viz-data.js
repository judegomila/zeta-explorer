/**
 * @module imp-35506-endpoint-positivity-map-viz-data
 * @fileoverview imp-35506 -- VIZ DATA ONLY tabulating the N=2000 pair-1495 ENDPOINT-positivity
 *   map across the three dense-output families crossed with the three base flow grids: DP45 / RK4
 *   / BS3 (order 5, 4, 3) x dt, dt/2, dt/4. imp-35452 mapped RK4 and DP45 across dt, dt/2, dt/4;
 *   imp-35477 added BS3 as a third family at dt, dt/2; imp-35573 filled the last remaining cell,
 *   BS3 at dt/4 (endpoint NEGATIVE, step 4014, pair 1495). The matrix is now the FULL 3x3, with
 *   exactly ONE endpoint-POSITIVE cell (DP45 dt/2) against eight endpoint-NEGATIVE cells -- the
 *   imp-35416/imp-35452 knife-edge, unchanged by completing the grid.
 *
 *   Baked literals reproduced verbatim from the imp-35452, imp-35477, and imp-35573 reference
 *   modules (no fresh computation); this module imports those three lightweight reference modules
 *   directly (none imports the 16.7MB zeros bundle) rather than re-baking the numbers a fourth
 *   time, per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-35452-n2000-endpoint-positivity-knife-edge-reference.js (RK4/DP45 source, dt/dt2/dt4)
 *   @see imp-35477-n2000-bs3-dense-crossvalidate-reference.js (BS3 source, dt/dt2)
 *   @see imp-35573-n2000-bs3-dt4-endpoint-positivity-reference.js (BS3 source, dt/4 -- completes the 3x3)
 *   @see imp-35416 (two-family scheme-independence flag that motivated the knife-edge map)
 *
 *   Ticket: imp-35506 (ux, medium), extended by imp-35601. Presentation only of already-established
 *   measurements; adds no new Lambda bound. C_mb GUE-conditional per imp-486 UNTOUCHED. NO QED.
 *   No refereed bound is changed.
 */

import { IMP_35452_N2000_ENDPOINT_POSITIVITY_KNIFE_EDGE_REFERENCE } from './imp-35452-n2000-endpoint-positivity-knife-edge-reference.js';
import { IMP_35477_N2000_BS3_DENSE_CROSSVALIDATE_REFERENCE } from './imp-35477-n2000-bs3-dense-crossvalidate-reference.js';
import { IMP_35573_N2000_BS3_DT4_ENDPOINT_POSITIVITY_REFERENCE } from './imp-35573-n2000-bs3-dt4-endpoint-positivity-reference.js';

const { endpointMap: KNIFE_EDGE_MAP } = IMP_35452_N2000_ENDPOINT_POSITIVITY_KNIFE_EDGE_REFERENCE;
const { bs3: BS3 } = IMP_35477_N2000_BS3_DENSE_CROSSVALIDATE_REFERENCE;
const { bs3: { dtQuarter: BS3_DTQUARTER } } = IMP_35573_N2000_BS3_DT4_ENDPOINT_POSITIVITY_REFERENCE;

// -- 3x3 family-x-grid endpoint-positivity matrix (DP45/RK4/BS3 x dt, dt/2, dt/4). --
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
    family: 'DP45', order: 5, grid: 'dt/4',
    endpointGap: KNIFE_EDGE_MAP.dp45.dtQuar.minEndGap,
    positive: KNIFE_EDGE_MAP.dp45.dtQuar.endpointSign === 'positive',
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
    family: 'RK4', order: 4, grid: 'dt/4',
    endpointGap: KNIFE_EDGE_MAP.rk4.dtQuar.minEndGap,
    positive: KNIFE_EDGE_MAP.rk4.dtQuar.endpointSign === 'positive',
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
  Object.freeze({
    family: 'BS3', order: 3, grid: 'dt/4',
    endpointGap: BS3_DTQUARTER.g_curr,
    positive: BS3_DTQUARTER.endpointPositive === true,
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
    'imp-35573-n2000-bs3-dt4-endpoint-positivity-reference.js',
  ],
  endpointMap: IMP35506_ENDPOINT_MAP,
  summary: IMP35506_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35506_ASSERTIONS = [
  {
    id: 'imp35506-nine-cells-present',
    holds: () =>
      IMP35506_ENDPOINT_MAP.length === 9 &&
      IMP35506_ENDPOINT_MAP.filter((c) => c.family === 'DP45').length === 3 &&
      IMP35506_ENDPOINT_MAP.filter((c) => c.family === 'RK4').length === 3 &&
      IMP35506_ENDPOINT_MAP.filter((c) => c.family === 'BS3').length === 3,
    why: 'The map must cover the full 3x3 (DP45/RK4/BS3 x dt, dt/2, dt/4) matrix, nine cells total.',
  },
  {
    id: 'imp35506-lone-positive-cell-is-dp45-dthalf',
    holds: () =>
      IMP35506_POSITIVE_CELLS.length === 1 &&
      IMP35506_POSITIVE_CELLS[0].family === 'DP45' &&
      IMP35506_POSITIVE_CELLS[0].grid === 'dt/2' &&
      IMP35506_POSITIVE_CELLS[0].endpointGap > 0,
    why: 'imp-35452/imp-35573: across the full dt/dt-2/dt-4 grid the DP45 dt/2 cell must be the UNIQUE endpoint-positive cell.',
  },
  {
    id: 'imp35506-eight-negative-cells',
    holds: () =>
      IMP35506_NEGATIVE_CELLS.length === 8 &&
      IMP35506_NEGATIVE_CELLS.every((c) => c.endpointGap < 0),
    why: 'The remaining eight cells (all but DP45 dt/2) must all have a negative endpoint gap.',
  },
  {
    id: 'imp35506-summary-matches-map',
    holds: () =>
      IMP35506_SUMMARY.totalCells === 9 &&
      IMP35506_SUMMARY.positiveCount === 1 &&
      IMP35506_SUMMARY.negativeCount === 8 &&
      IMP35506_SUMMARY.lonePositiveCell === 'DP45 dt/2',
    why: 'The summary counts must agree with the underlying map: 9 cells, 1 positive, 8 negative, lone positive cell DP45 dt/2.',
  },
  {
    id: 'imp35506-bs3-values-reproduce-imp35477-and-imp35573',
    holds: () =>
      Math.abs(BS3.dt.g_curr - -2.635e-6) < 1e-9 &&
      Math.abs(BS3.dtHalf.g_curr - -1.044e-5) < 1e-9 &&
      Math.abs(BS3_DTQUARTER.g_curr - -4.254687e-6) < 1e-9,
    why: 'The BS3 endpoint gaps must reproduce the imp-35477 (dt, dt/2) and imp-35573 (dt/4) baked literals verbatim.',
  },
];

for (const assertion of IMP35506_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35506-endpoint-positivity-map-viz-data assertion failed: ${assertion.id}`);
  }
}
