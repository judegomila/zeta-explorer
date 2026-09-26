/**
 * @module imp-97149-cutting-plane-stall-trajectory-viz-data
 * @fileoverview imp-97149 -- VIZ DATA ONLY. Bakes the imp-97099 kmax=5, 2a=1.00, FINEH=3e-5 cutting-plane
 *   worst-residual trajectory for a stall-shape chart: an early non-monotone cycling phase (round 5..25,
 *   worst residual swinging -0.01663 .. -0.05205) followed by a frozen fixed point (round 103..107, worst
 *   residual identical at -0.0043937, same location t=37.809, same violated-point count nviol=2240, while
 *   the constraint row count keeps growing 6920 -> 7128). Values are copied literals from imp-97099's
 *   frozen exports -- this module does NOT re-run the cutting-plane solve. Pure frozen-object data, no
 *   imports, no self-executing assertions of its own, per the [[storage_precision_assertion_tolerance]]
 *   and [[no_heavy_imports_in_pages]] conventions -- needs no separate DATA_MODULES registration.
 *
 *   @see imp-97099-krein-fineh-3e5-fullstall-measurement.js (the certified trajectory this bakes)
 *   @see imp-97055-krein-windowed-design-lever.js (parent: names the 3e-5 full-stall sub-gap)
 *
 *   Ticket: imp-97149 (ux, low). Presentation of an already-established measurement; adds no new
 *   Lambda bound. Certified interval-rigorous reach stays 2a <= 0.96. RH open. NO QED.
 */

// -- baked from imp-97099 IMP97099_TRAJECTORY.earlyCycling --
export const IMP97149_EARLY_CYCLING = Object.freeze([
  Object.freeze({ round: 5, worst: -0.01663, at: 30.768 }),
  Object.freeze({ round: 10, worst: -0.005886, at: 36.414 }),
  Object.freeze({ round: 15, worst: -0.006396, at: 30.769 }),
  Object.freeze({ round: 20, worst: -0.004423, at: 36.414 }),
  Object.freeze({ round: 25, worst: -0.05205, at: 36.907 }),
]);

// -- baked from imp-97099 IMP97099_TRAJECTORY.frozen --
export const IMP97149_FROZEN = Object.freeze([
  Object.freeze({ round: 103, worst: -0.0043937, at: 37.809, nviol: 2240, rows: 6920 }),
  Object.freeze({ round: 104, worst: -0.0043937, at: 37.809, nviol: 2240, rows: 6972 }),
  Object.freeze({ round: 105, worst: -0.0043937, at: 37.809, nviol: 2240, rows: 7024 }),
  Object.freeze({ round: 106, worst: -0.0043937, at: 37.809, nviol: 2240, rows: 7076 }),
  Object.freeze({ round: 107, worst: -0.0043937, at: 37.809, nviol: 2240, rows: 7128 }),
]);

// chart series: one row per observed round, phase-tagged, for a single stall-shape line chart
export const IMP97149_SERIES = Object.freeze([
  ...IMP97149_EARLY_CYCLING.map((r) => Object.freeze({ ...r, phase: 'early-cycling' })),
  ...IMP97149_FROZEN.map((r) => Object.freeze({ ...r, phase: 'frozen-fixed-point' })),
]);

export default Object.freeze({
  id: 'imp-97149-cutting-plane-stall-trajectory-viz-data',
  ticket: 'imp-97149',
  source: 'imp-97099-krein-fineh-3e5-fullstall-measurement.js',
  earlyCycling: IMP97149_EARLY_CYCLING,
  frozen: IMP97149_FROZEN,
  series: IMP97149_SERIES,
  frozenWorstResidual: -0.0043937,
  frozenWorstAt: 37.809,
  rowsGrewWithoutImprovingWorst: IMP97149_FROZEN[IMP97149_FROZEN.length - 1].rows > IMP97149_FROZEN[0].rows,
  intervalRigorousReachUnchanged: 0.96,
});
