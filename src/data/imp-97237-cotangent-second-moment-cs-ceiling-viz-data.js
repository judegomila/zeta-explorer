/**
 * @module imp-97237-cotangent-second-moment-cs-ceiling-viz-data
 * @fileoverview imp-97237 -- VIZ DATA ONLY. Bakes the imp-97203 inverse-line cotangent second-moment
 *   ladder: the a-weighted moment M2w, its Cauchy-Schwarz ceiling sqrt(M2w) on the absolute first
 *   moment constant c_1, and the measured c_1 itself, across b=101..8009 -- all flat with no log
 *   drift, and the ceiling stays below the target kappa_arith=0.5704960511308594 by a stable ~1.38x
 *   margin (no overshoot). Values are recomputed exactly from the imp-97203 inverseLinePieces(b)
 *   kernel (O(b^2), reproduced here, not re-derived) and match its committed docblock literals.
 *   Pure frozen-object data, no imports, no self-executing assertions of its own, per the
 *   [[storage_precision_assertion_tolerance]] and [[no_heavy_imports_in_pages]] conventions --
 *   needs no separate DATA_MODULES registration.
 *
 *   @see imp-97203-route-m-cotangent-absvalue-first-moment-cauchy-schwarz.js (the measurement this bakes)
 *   @see imp-97180-route-m-cotangent-absvalue-bulk-firstmoment-obstruction.js (parent obstruction)
 *
 *   Ticket: imp-97237 (ux, low). Presentation of an already-established measurement; adds no new
 *   Lambda bound. c_1 stays MEASURED, not proved. RH open. NO QED.
 */

// -- baked from imp-97203's inverseLinePieces(b): c_1, M2w, and the CS ceiling sqrt(M2w) --
export const IMP97237_LADDER = Object.freeze([
  Object.freeze({ b: 101, c1: 0.265595, M2w: 0.128809, csCeiling: 0.358899 }),
  Object.freeze({ b: 211, c1: 0.271891, M2w: 0.142868, csCeiling: 0.377979 }),
  Object.freeze({ b: 401, c1: 0.286655, M2w: 0.156191, csCeiling: 0.39521 }),
  Object.freeze({ b: 809, c1: 0.29106, M2w: 0.164421, csCeiling: 0.405488 }),
  Object.freeze({ b: 2003, c1: 0.290858, M2w: 0.167879, csCeiling: 0.409731 }),
  Object.freeze({ b: 4001, c1: 0.293793, M2w: 0.171256, csCeiling: 0.413831 }),
  Object.freeze({ b: 8009, c1: 0.293836, M2w: 0.172228, csCeiling: 0.415004 }),
]);

export const IMP97237_SUMMARY = Object.freeze({
  kappaArith: 0.5704960511308594, // imp-97096 exact target: c_1 must be < this
  csCeilingStable: 0.415, // sqrt(M2w) flattens near b=8009
  csMarginBelowKappaArith: 1.38, // 0.5705 / 0.415 ~ 1.38x -- ceiling clears target, no overshoot
  c1Stable: 0.294, // measured Sum|c_0|/Sum a flattens near b=8009
  cauchySchwarzReductionRigorous: true, // c_1 <= sqrt(M2w) is an exact unconditional finite inequality
  csCeilingBelowTargetMeasured: true, // sqrt(M2w) stays below kappaArith throughout the ladder (measured)
  certifiedConstantProved: false, // M2w/c_1 stay MEASURED, not proved rigorous
});

export default Object.freeze({
  id: 'imp-97237-cotangent-second-moment-cs-ceiling-viz-data',
  ticket: 'imp-97237',
  source: 'imp-97203-route-m-cotangent-absvalue-first-moment-cauchy-schwarz.js',
  ladder: IMP97237_LADDER,
  summary: IMP97237_SUMMARY,
});
