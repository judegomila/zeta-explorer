/**
 * @module imp-35710-winding-mesh-cost-delta-ladder-viz-data
 * @fileoverview imp-35710 -- VIZ DATA ONLY for the imp-35653 Part C finite
 *   winding-barrier (B1) mesh-cost reading at T_PT = 3e12: the local zero
 *   density ~4.28 zeros/unit-height (LOCAL_DENSITY_AT_TPT) and the boundary
 *   evaluations per enclosed zero, tabulated across the imp-35675
 *   transition-width Delta ladder {1, 2, 5, 10, 20, 50, 100}. No page rendered
 *   this Delta-ladder table before this ticket.
 *
 *   Re-exports the imp-35675 baked cost table verbatim (that module is
 *   import-light: pure Math, no heavy dependency, never the 16.7MB zeros
 *   bundle), per [[no_heavy_imports_in_pages]].
 *
 *   @see imp-35675-finite-winding-mesh-cost-vs-delta.js (the measurement this re-exports)
 *   @see imp-35653-sbarrier-finite-check-porting-scope.js (Part C derives MESH_PER_UNIT ~ 12.84)
 *
 *   Ticket: imp-35710 (ux, medium). Presentation only of an already-measured
 *   mesh-cost curve; adds no new Lambda bound. NO QED. No refereed bound is changed.
 */

import { IMP35675_FINITE_WINDING_MESH_COST_VS_DELTA } from './imp-35675-finite-winding-mesh-cost-vs-delta.js';
// imp-35729: independent cross-verification of the anchors below (density, meshPerUnit, 6-asymptote).
// Imported for its self-executing assertions -- any drift beyond storage-precision tolerance throws at build.
import { IMP35729_MESH_COST_ANCHOR_CROSSVERIFY } from './imp-35729-mesh-cost-anchor-crossverify.js';

const M = IMP35675_FINITE_WINDING_MESH_COST_VS_DELTA;

export const IMP35710_DELTA_LADDER_ROWS = M.costTable.map((row) => ({
  delta: row.delta,
  enclosedZeros: row.enclosedZeros,
  totalEvals: row.totalEvals,
  boundaryEvalsPerZero: row.totalEvalsPerEnclosedZero,
}));

export const IMP35710_SUMMARY = Object.freeze({
  tPT: M.anchors.tPT,
  localDensityAtTPT: M.anchors.localDensityAtTPT, // ~4.2799 zeros/unit height
  oversample: M.anchors.oversample,
  meshPerUnit: M.anchors.meshPerUnit,
  slopePerUnitDelta: M.slopePerUnitDelta,
  verticalIntercept: M.verticalIntercept,
  horizontalEvalsPerEnclosedZeroAsymptote: M.horizontalEvalsPerEnclosedZero, // = 6 exactly
  crossVerifiedById: IMP35729_MESH_COST_ANCHOR_CROSSVERIFY.id, // imp-35729: anchors independently confirmed
});

export default Object.freeze({
  id: 'imp-35710-winding-mesh-cost-delta-ladder-viz-data',
  ticket: 'imp-35710',
  sources: ['imp-35675-finite-winding-mesh-cost-vs-delta.js', 'imp-35653-sbarrier-finite-check-porting-scope.js'],
  rows: IMP35710_DELTA_LADDER_ROWS,
  summary: IMP35710_SUMMARY,
});

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP35710_ASSERTIONS = [
  {
    id: 'imp35710-rows-match-source-ladder',
    holds: () => IMP35710_DELTA_LADDER_ROWS.length === M.costTable.length && IMP35710_DELTA_LADDER_ROWS.length === 7,
    why: 'The Delta-ladder rows must mirror the imp-35675 seven-point cost table one-for-one.',
  },
  {
    id: 'imp35710-density-near-428',
    holds: () => IMP35710_SUMMARY.localDensityAtTPT > 4.27 && IMP35710_SUMMARY.localDensityAtTPT < 4.29,
    why: 'imp-35653 Part C states the local zero density at T_PT = 3e12 is ~4.28 zeros per unit height.',
  },
  {
    id: 'imp35710-boundary-evals-per-zero-decay-toward-six',
    holds: () => {
      const perZero = IMP35710_DELTA_LADDER_ROWS.map((r) => r.boundaryEvalsPerZero);
      const monotone = perZero.every((v, i) => i === 0 || v < perZero[i - 1]);
      return monotone && perZero.every((v) => v > 6) && perZero[perZero.length - 1] < perZero[0];
    },
    why: 'Boundary evaluations per enclosed zero decay monotonically toward the asymptote of exactly 6 as Delta grows.',
  },
  {
    id: 'imp35710-anchors-cross-verified',
    holds: () =>
      Math.abs(IMP35729_MESH_COST_ANCHOR_CROSSVERIFY.anchors.densityFiniteDiff - M.anchors.localDensityAtTPT) < 1e-4 &&
      IMP35729_MESH_COST_ANCHOR_CROSSVERIFY.anchors.perZeroAsymptote === M.horizontalEvalsPerEnclosedZero,
    why: 'imp-35729 independently re-derives the density and 6-asymptote anchors; they must equal the baked imp-35675 values within storage precision.',
  },
  {
    id: 'imp35710-presentation-only-no-qed',
    holds: () => M.isRigorous === false && /NO QED/.test(M.verdict) && /refereed bound is changed/i.test(M.verdict),
    why: 'This is a presentation layer over an already-measurement-only module; it must not upgrade the honesty gate.',
  },
];

for (const assertion of IMP35710_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-35710-winding-mesh-cost-delta-ladder-viz-data assertion failed: ${assertion.id}`);
  }
}
