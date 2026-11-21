/**
 * @module imp-96817-krein-double-double-ladder-viz-data
 * @fileoverview imp-96817 -- VIZ DATA ONLY. Bakes the imp-96772 double-precision-vs-dps=40
 *   extended-precision Legendre-Galerkin Krein floor comparison for a line/bar viz page: the
 *   per-rung |double - extended| gap across the N=20..76 ladder at 2a in {1.00, 1.05, ln3}, and
 *   the 2a=ln3 descent from 0.577015 (N=52) to 0.533852 (N=100, condB up to 1.1e16). Values are
 *   copied literals from imp-96772's frozen exports -- this module does NOT re-run the mpmath
 *   dps=40 generalized-eigenvalue solve. Pure frozen-object data, no imports, no self-executing
 *   assertions of its own, per the [[storage_precision_assertion_tolerance]] and
 *   [[no_heavy_imports_in_pages]] conventions -- needs no separate DATA_MODULES registration.
 *
 *   @see imp-96772-krein-lammin-double-double-recompute.js (the measurement this bakes)
 *
 *   Ticket: imp-96817 (ux, low). Presentation of an already-established measurement; adds no new
 *   Lambda bound. Route I interval-rigorous certificate reach stays 2a <= 0.96. RH-EQUIVALENT.
 *   NO QED. No refereed bound is changed.
 */

const LN3 = Math.log(3); // 1.0986122886681098

// -- baked from imp-96772 IMP96772_NS / IMP96772_CONDB (a-independent Gram condition number) --
export const IMP96817_NS = Object.freeze([20, 28, 36, 44, 52, 60, 68, 76]);
export const IMP96817_CONDB = Object.freeze([
  1.398e8, 4.543e9, 7.009e10, 6.691e11, 4.565e12, 2.430e13, 1.068e14, 4.039e14,
]);

// -- baked from imp-96772 IMP96772_MAX_ABS_DELTA-style per-rung comparison: |double - extended|
// stays far below 1e-6 at every rung tested (the condB ~ 1e13 wall does not corrupt the floor) --
export const IMP96817_MAX_ABS_DELTA_BY_2A = Object.freeze({
  '2a=1.00': 4.66e-8, // largest gap across N=20..76, at N=76 (condB 4.04e14)
  '2a=1.05': 1.53e-8, // largest gap across N=20..76, at N=76
  '2a=ln3': 6.99e-7, // largest gap across the extended N=20..100 ladder, at N=100 (condB 1.11e16)
});

// -- baked 2a=ln3 descent, N=52..100 (the extended reach past the imp-96749 condB wall) --
export const IMP96817_LN3_NS_EXT = Object.freeze([52, 60, 68, 76, 84, 92, 100]);
export const IMP96817_LN3_LADDER_EXT = Object.freeze([
  0.577015, 0.570500, 0.564589, 0.557246, 0.549348, 0.541949, 0.533852,
]);
export const IMP96817_LN3_CONDB_EXT = Object.freeze([
  4.565e12, 2.430e13, 1.068e14, 4.039e14, 1.347e15, 4.070e15, 1.113e16,
]);

// chart series: floor-vs-N line for the ln3 rung, condB on a shared log axis
export const IMP96817_LN3_SERIES = Object.freeze(
  IMP96817_LN3_NS_EXT.map((N, i) => Object.freeze({
    N,
    lammin: IMP96817_LN3_LADDER_EXT[i],
    condB: IMP96817_LN3_CONDB_EXT[i],
  })),
);

export default Object.freeze({
  id: 'imp-96817-krein-double-double-ladder-viz-data',
  ticket: 'imp-96817',
  source: 'imp-96772-krein-lammin-double-double-recompute.js',
  ns: IMP96817_NS,
  condB: IMP96817_CONDB,
  maxAbsDeltaBy2a: IMP96817_MAX_ABS_DELTA_BY_2A,
  ln3Series: IMP96817_LN3_SERIES,
  ln3StartValue: IMP96817_LN3_LADDER_EXT[0], // 0.577015 at N=52
  ln3EndValue: IMP96817_LN3_LADDER_EXT[IMP96817_LN3_LADDER_EXT.length - 1], // 0.533852 at N=100
  twoAValue: LN3, // 2a = ln 3, kept for axis labeling
});
