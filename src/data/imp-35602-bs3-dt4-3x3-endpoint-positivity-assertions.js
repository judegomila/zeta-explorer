/**
 * @module imp-35602-bs3-dt4-3x3-endpoint-positivity-assertions
 * @fileoverview imp-35602 -- REGRESSION-GUARD ONLY. Pins the imp-35573 BS3 dt/4
 *   endpoint-positivity cell literals AND the completed 3x3 (DP45/RK4/BS3 x
 *   dt, dt/2, dt/4) family-x-grid invariant that EXACTLY ONE cell -- DP45 dt/2 --
 *   is endpoint-positive.
 *
 * WHAT WAS OPEN
 * -------------
 * imp-35573 baked the missing BS3 dt/4 cell of the imp-35506 endpoint-positivity
 * matrix (endpointPositive=false, step 4014, cross_index 1495,
 * g_curr=-4.254687e-6, t_c=1.1923274308e-3) and asserted, in its own reference
 * module, that no SECOND positive cell appears. But no run-assertions module
 * pinned the BS3 dt/4 sign/step/gap literals to the storage-precision tolerance
 * [[storage-precision-assertion-tolerance]] nor asserted the full 3x3 one-positive-
 * cell count assembled from the three source reference modules together.
 *
 * WHAT THIS MODULE DOES
 * ---------------------
 * Imports the three lightweight reference modules (none pulls the 16.7MB zeros
 * bundle, per [[no-heavy-imports-in-pages]]):
 *   - imp-35452 (DP45/RK4 endpoint signs at dt, dt/2, dt/4)
 *   - imp-35477 (BS3 endpoint signs at dt, dt/2)
 *   - imp-35573 (BS3 endpoint sign at dt/4)
 * assembles the full 3x3 endpoint-positive boolean map, and asserts (a) the
 * imp-35573 BS3 dt/4 literals reproduce (sign NEGATIVE, step 4014, cross_index
 * 1495, g_curr=-4.254687e-6 to ~1e-6 tol) and (b) the completed 3x3 has exactly
 * ONE endpoint-positive cell, DP45 dt/2.
 *
 * SCOPE: MEASUREMENT PINNING ONLY. Keeps the endpoint DP45 dt/2 worst-case
 * (imp-35412), changes NO bound, adopts NO new slack denominator, does NOT
 * advance the R2 ladder, does NOT extend the C_mb certificate, does NOT remove
 * the imp-486 GUE conditional. No refereed bound is changed. NO QED.
 *
 * SYNTAX NOTE: avoid star-slash in JSDoc; use "dt/4" and "g_curr".
 *
 * @see imp-35573-n2000-bs3-dt4-endpoint-positivity-reference.js (BS3 dt/4 cell)
 * @see imp-35452-n2000-endpoint-positivity-knife-edge-reference.js (DP45/RK4 dt/dt2/dt4)
 * @see imp-35477-n2000-bs3-dense-crossvalidate-reference.js (BS3 dt/dt2)
 * @see imp-35506-endpoint-positivity-map-viz-data.js (the 3x2 matrix this completes to 3x3)
 */

import { IMP_35452_N2000_ENDPOINT_POSITIVITY_KNIFE_EDGE_REFERENCE } from './imp-35452-n2000-endpoint-positivity-knife-edge-reference.js';
import { IMP_35477_N2000_BS3_DENSE_CROSSVALIDATE_REFERENCE } from './imp-35477-n2000-bs3-dense-crossvalidate-reference.js';
import { IMP_35573_N2000_BS3_DT4_ENDPOINT_POSITIVITY_REFERENCE } from './imp-35573-n2000-bs3-dt4-endpoint-positivity-reference.js';

const KNIFE = IMP_35452_N2000_ENDPOINT_POSITIVITY_KNIFE_EDGE_REFERENCE.endpointMap; // dp45/rk4 x dt/dtHalf/dtQuar
const BS3_DT_DT2 = IMP_35477_N2000_BS3_DENSE_CROSSVALIDATE_REFERENCE.bs3;            // dt, dtHalf
const BS3_DT4 = IMP_35573_N2000_BS3_DT4_ENDPOINT_POSITIVITY_REFERENCE.bs3.dtQuarter; // dt/4 (this fills)

// -- Full 3x3 endpoint-positivity boolean map: DP45/RK4/BS3 x dt, dt/2, dt/4. -----
// positive === endpoint signed gap stays strictly positive (endpoint never crosses).
const CELLS_3x3 = Object.freeze([
  Object.freeze({ family: 'DP45', grid: 'dt',   positive: KNIFE.dp45.dt.endpointSign === 'positive' }),
  Object.freeze({ family: 'DP45', grid: 'dt/2', positive: KNIFE.dp45.dtHalf.endpointSign === 'positive' }),
  Object.freeze({ family: 'DP45', grid: 'dt/4', positive: KNIFE.dp45.dtQuar.endpointSign === 'positive' }),
  Object.freeze({ family: 'RK4',  grid: 'dt',   positive: KNIFE.rk4.dt.endpointSign === 'positive' }),
  Object.freeze({ family: 'RK4',  grid: 'dt/2', positive: KNIFE.rk4.dtHalf.endpointSign === 'positive' }),
  Object.freeze({ family: 'RK4',  grid: 'dt/4', positive: KNIFE.rk4.dtQuar.endpointSign === 'positive' }),
  Object.freeze({ family: 'BS3',  grid: 'dt',   positive: BS3_DT_DT2.dt.endpointPositive === true }),
  Object.freeze({ family: 'BS3',  grid: 'dt/2', positive: BS3_DT_DT2.dtHalf.endpointPositive === true }),
  Object.freeze({ family: 'BS3',  grid: 'dt/4', positive: BS3_DT4.endpointPositive === true }),
]);

const POSITIVE_3x3 = CELLS_3x3.filter((c) => c.positive);

// -- Regression-guard assertions (run-assertions.mjs auto-runs *_ASSERTIONS). ------
export const IMP_35602_BS3_DT4_3x3_ENDPOINT_POSITIVITY_ASSERTIONS = [
  {
    id: 'imp35602-bs3-dt4-cell-literals-reproduce',
    holds: () =>
      BS3_DT4.endpointPositive === false &&
      BS3_DT4.step === 4014 &&
      BS3_DT4.cross_index === 1495 &&
      BS3_DT4.g_curr < 0 &&
      Math.abs(BS3_DT4.g_curr - -4.254687e-6) < 1e-6 &&
      Math.abs(BS3_DT4.t_c - 1.1923274308e-3) < 1e-9,
    why:
      'The imp-35573 BS3 dt/4 cell must reproduce: endpoint sign NEGATIVE ' +
      '(endpointPositive=false), step 4014, cross_index 1495, g_curr=-4.254687e-6 ' +
      'to the ~1e-6 storage-precision tolerance, t_c=1.1923274308e-3.',
  },
  {
    id: 'imp35602-3x3-has-exactly-one-endpoint-positive-cell-dp45-dt2',
    holds: () =>
      CELLS_3x3.length === 9 &&
      POSITIVE_3x3.length === 1 &&
      POSITIVE_3x3[0].family === 'DP45' &&
      POSITIVE_3x3[0].grid === 'dt/2',
    why:
      'Across the completed 3x3 (DP45/RK4/BS3 x dt, dt/2, dt/4) endpoint-positivity ' +
      'matrix exactly ONE cell -- DP45 dt/2 -- is endpoint-positive; filling the BS3 ' +
      'dt/4 cell adds no second positive cell, so the DP45 dt/2 knife-edge stands.',
  },
  {
    id: 'imp35602-eight-other-cells-endpoint-negative',
    holds: () =>
      CELLS_3x3.filter((c) => !c.positive).length === 8 &&
      CELLS_3x3.filter((c) => c.family === 'BS3' && !c.positive).length === 3 &&
      CELLS_3x3.filter((c) => c.family === 'RK4' && !c.positive).length === 3,
    why:
      'The remaining eight cells (all three RK4 grids, all three BS3 grids, DP45 dt ' +
      'and DP45 dt/4) must all be endpoint-NEGATIVE, confirming the lone positive ' +
      'cell is genuinely isolated.',
  },
];

for (const assertion of IMP_35602_BS3_DT4_3x3_ENDPOINT_POSITIVITY_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35602-bs3-dt4-3x3-endpoint-positivity-assertions failed: ${assertion.id}`);
  }
}

export const IMP_35602_BS3_DT4_3x3_ENDPOINT_POSITIVITY = Object.freeze({
  id: 'imp-35602',
  kind: 'regression-guard',
  changesNoBound: true,
  cMbStaysGueConditional: 'imp-486',
  noQED: true,
  cells: CELLS_3x3,
  positiveCells: POSITIVE_3x3.map((c) => `${c.family} ${c.grid}`),
});

export default IMP_35602_BS3_DT4_3x3_ENDPOINT_POSITIVITY;
