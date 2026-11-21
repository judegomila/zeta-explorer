/**
 * @module imp-97238-cotangent-signed-absolute-cancellation-viz-data
 * @fileoverview imp-97238 -- VIZ DATA ONLY. Bakes the imp-97204 signed-vs-absolute Route M
 *   cotangent first-moment ladder (b=101,401,2003): the signed operative half
 *   S(b)/(phi(b) b) ~ -0.073 -> -0.077 -> -0.079 (flat, negative), the absolute companion
 *   A(b)/(phi(b) b) ~ 0.134 -> 0.144 -> 0.146 (flat), and the cancellation ratio
 *   |S(b)|/A(b) ~ 0.543 -> 0.538 -> 0.543 (stable ~0.54, the ~46% cancellation the
 *   absolute-value program discards), alongside the two horizontal threshold lines: the
 *   OPERATIVE threshold (2/pi) kappa_arith = 0.36318906620753183 and the raw kappa_arith =
 *   0.5704960511308594 named for the absolute program. Values are copied literals from
 *   imp-97204's committed measurement -- this module does NOT recompute V(h,k) or Phi(b).
 *   Pure frozen-object data, no imports, no self-executing assertions of its own, per the
 *   [[storage_precision_assertion_tolerance]] and [[no_heavy_imports_in_pages]] conventions --
 *   needs no separate DATA_MODULES registration.
 *
 *   @see imp-97204-route-m-cotangent-signed-firstmoment-lower-bound.js (the measurement this bakes)
 *   @see imp-97180-route-m-cotangent-absvalue-bulk-firstmoment-obstruction.js (absolute c ~ 0.145)
 *
 *   Ticket: imp-97238 (ux, low). Presentation of an already-established measurement; adds no
 *   new Lambda bound. No refereed bound is changed. RH open. NO QED.
 */

// -- baked from imp-97204 Result 3: signed/absolute/cancellation ladder across b=101,401,2003 --
export const IMP97238_LADDER = Object.freeze([
  Object.freeze({ b: 101, signed: -0.073, abs: 0.134, cancellationRatio: 0.543 }),
  Object.freeze({ b: 401, signed: -0.077, abs: 0.144, cancellationRatio: 0.538 }),
  Object.freeze({ b: 2003, signed: -0.079, abs: 0.146, cancellationRatio: 0.543 }),
]);

// -- baked from imp-97204 Result 2: the two competing threshold lines on the absolute constant --
export const IMP97238_THRESHOLDS = Object.freeze([
  Object.freeze({
    label: 'operative (2/pi) kappa_arith',
    value: 0.36318906620753183,
    note: 'tighter target: carries the -(pi/2) weight relating A to the F-coefficient (imp-97204 Result 2)',
  }),
  Object.freeze({
    label: 'raw kappa_arith',
    value: 0.5704960511308594,
    note: 'target named for the absolute program A(b)/(phi(b) b) directly (imp-97180/imp-97168)',
  }),
]);

export const IMP97238_SUMMARY = Object.freeze({
  signedStable: -0.079, // S(b)/(phi b b), b=2003
  absStable: 0.146, // A(b)/(phi b b), b=2003
  cancellationRatioStable: 0.543, // |S|/A, b=2003 (~46% cancellation discarded by the absolute route)
  measuredClearsTighterThreshold: true, // 0.146 < 0.36319 by ~2.5x
  marginBelowTighterThreshold: 2.5,
  signedDominatedByAbsolute: true, // |S(b)| <= A(b) exactly (imp-97204 Result 1)
});

export default Object.freeze({
  id: 'imp-97238-cotangent-signed-absolute-cancellation-viz-data',
  ticket: 'imp-97238',
  source: 'imp-97204-route-m-cotangent-signed-firstmoment-lower-bound.js',
  ladder: IMP97238_LADDER,
  thresholds: IMP97238_THRESHOLDS,
  summary: IMP97238_SUMMARY,
});
