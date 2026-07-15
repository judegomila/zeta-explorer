/**
 * @module imp-35541-scheme-independence-viz-data
 * @fileoverview imp-35541 -- VIZ DATA ONLY presenting the imp-35477 THREE-order
 *   (BS3/RK4/DP45, orders 3/4/5) scheme-independence of the N=2000 pair-1495
 *   within-step crossing t_c, at both grids (dt, dt/2). Tabulates the three
 *   integrator families' crossing times side by side with their pairwise
 *   relative deviations, making visible that all three agree to within ~1e-4
 *   relative regardless of integrator order.
 *
 *   Baked literals reproduced verbatim from the imp-35477 reference module (no
 *   fresh computation); this module imports that lightweight reference module
 *   directly (it does not import the 16.7MB zeros bundle) rather than re-baking
 *   the numbers a second time, per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-35477-n2000-bs3-dense-crossvalidate-reference.js (source of all literals)
 *   @see imp-35351 (DP45 CONTD5, order-5 family, first to catch the crossing)
 *   @see imp-35416 (RK4 + cubic-Hermite, order-4 family, second corroboration)
 *   @see imp-35506-endpoint-positivity-map-viz-data.js (companion endpoint-sign viz)
 *
 *   Ticket: imp-35541 (ux, medium). Presentation only of an already-established
 *   measurement; adds no new Lambda bound. C_mb GUE-conditional per imp-486
 *   UNTOUCHED. NO QED.
 */

import { IMP_35477_N2000_BS3_DENSE_CROSSVALIDATE_REFERENCE } from './imp-35477-n2000-bs3-dense-crossvalidate-reference.js';

const { dp45: DP45, rk4: RK4, bs3: BS3, crossCheck: CROSS_CHECK } =
  IMP_35477_N2000_BS3_DENSE_CROSSVALIDATE_REFERENCE;

const FAMILIES = ['DP45', 'RK4', 'BS3'];
const ORDER_BY_FAMILY = { DP45: 5, RK4: 4, BS3: 3 };
const TC_BY_FAMILY = {
  DP45: { dt: DP45.dt.t_c, dtHalf: DP45.dtHalf.t_c },
  RK4: { dt: RK4.dt.t_c, dtHalf: RK4.dtHalf.t_c },
  BS3: { dt: BS3.dt.t_c, dtHalf: BS3.dtHalf.t_c },
};

// -- Per-grid rows: t_c for each order-3/4/5 family. -----------------------------
export const IMP35541_SCHEME_ROWS = Object.freeze(
  ['dt', 'dtHalf'].flatMap((grid) =>
    FAMILIES.map((family) =>
      Object.freeze({
        grid: grid === 'dt' ? 'dt' : 'dt/2',
        family,
        order: ORDER_BY_FAMILY[family],
        t_c: TC_BY_FAMILY[family][grid],
      })
    )
  )
);

// -- Pairwise relative deviations at each grid (from imp-35477 crossCheck). ------
export const IMP35541_CROSS_CHECK = Object.freeze({
  dt: Object.freeze({
    bs3VsDp45: CROSS_CHECK.dt.relTcVsDp45,
    bs3VsRk4: CROSS_CHECK.dt.relTcVsRk4,
  }),
  dtHalf: Object.freeze({
    bs3VsDp45: CROSS_CHECK.dtHalf.relTcVsDp45,
    bs3VsRk4: CROSS_CHECK.dtHalf.relTcVsRk4,
  }),
});

const ALL_RELATIVE_DEVIATIONS = [
  IMP35541_CROSS_CHECK.dt.bs3VsDp45,
  IMP35541_CROSS_CHECK.dt.bs3VsRk4,
  IMP35541_CROSS_CHECK.dtHalf.bs3VsDp45,
  IMP35541_CROSS_CHECK.dtHalf.bs3VsRk4,
];

export const IMP35541_MAX_RELATIVE_DEVIATION = Math.max(...ALL_RELATIVE_DEVIATIONS);

export const IMP35541_SUMMARY = Object.freeze({
  ordersCovered: [3, 4, 5],
  familiesCovered: FAMILIES.length,
  gridsCovered: 2,
  sameStepAndPair: true,
  maxRelativeDeviation: IMP35541_MAX_RELATIVE_DEVIATION,
  schemeInvariant: IMP35541_MAX_RELATIVE_DEVIATION < 2e-4,
});

export default Object.freeze({
  id: 'imp-35541-scheme-independence-viz-data',
  ticket: 'imp-35541',
  sources: ['imp-35477-n2000-bs3-dense-crossvalidate-reference.js'],
  rows: IMP35541_SCHEME_ROWS,
  crossCheck: IMP35541_CROSS_CHECK,
  summary: IMP35541_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35541_ASSERTIONS = [
  {
    id: 'imp35541-six-rows-present',
    holds: () =>
      IMP35541_SCHEME_ROWS.length === 6 &&
      IMP35541_SCHEME_ROWS.filter((r) => r.grid === 'dt').length === 3 &&
      IMP35541_SCHEME_ROWS.filter((r) => r.grid === 'dt/2').length === 3,
    why: 'The table must cover exactly the 3 families (DP45/RK4/BS3) at each of the 2 grids (dt, dt/2), six rows total.',
  },
  {
    id: 'imp35541-orders-are-3-4-5',
    holds: () =>
      new Set(IMP35541_SCHEME_ROWS.map((r) => r.order)).size === 3 &&
      IMP35541_SCHEME_ROWS.some((r) => r.order === 3) &&
      IMP35541_SCHEME_ROWS.some((r) => r.order === 4) &&
      IMP35541_SCHEME_ROWS.some((r) => r.order === 5),
    why: 'The three families must span integrator orders 3 (BS3), 4 (RK4), and 5 (DP45).',
  },
  {
    id: 'imp35541-max-relative-deviation-under-2e-4',
    holds: () => IMP35541_MAX_RELATIVE_DEVIATION < 2e-4 && IMP35541_MAX_RELATIVE_DEVIATION > 0,
    why: 'imp-35477: the crossing time must agree across all three orders to within ~1e-4 relative, corroborating scheme-independence.',
  },
  {
    id: 'imp35541-summary-flags-scheme-invariant',
    holds: () =>
      IMP35541_SUMMARY.schemeInvariant === true &&
      IMP35541_SUMMARY.ordersCovered.length === 3 &&
      IMP35541_SUMMARY.sameStepAndPair === true,
    why: 'The summary must record the scheme-invariance verdict established by imp-35477 (same step/pair across orders 3, 4, 5).',
  },
];

for (const assertion of IMP35541_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35541-scheme-independence-viz-data assertion failed: ${assertion.id}`);
  }
}
