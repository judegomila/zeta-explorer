/**
 * @module imp-97150-boundary-cotangent-asymptotic-viz-data
 * @fileoverview imp-97150 -- VIZ DATA ONLY. Bakes the imp-97119 boundary cotangent asymptotic
 *   verification table (b vs V vs closed-form model, O(1/b) residual decay) for a chart: the
 *   exact Dedekind cotangent sum V(1,b) = c_0(1/b) against the closed leading model
 *   -(b/pi)(log(b/(2pi)) + gamma) - 1/pi, with the residual V - model shrinking from -2.8e-3
 *   at b=31 to -8.5e-5 at b=1025 (consistent with the derived O(1/b) tail). Values are copied
 *   literals from imp-97119's frozen exports -- this module does NOT recompute the cotangent
 *   sum or the model. Pure frozen-object data, no imports, no self-executing assertions of its
 *   own, per the [[storage_precision_assertion_tolerance]] and [[no_heavy_imports_in_pages]]
 *   conventions -- needs no separate DATA_MODULES registration.
 *
 *   @see imp-97119-route-m-boundary-cotangent-asymptotic.js (the certified table this bakes)
 *   @see imp-97097 (parent: Route M first-moment reduction that needed the boundary o(phi(b) b) fact)
 *
 *   Ticket: imp-97150 (ux, low). Presentation of an already-established derivation; adds no new
 *   Lambda bound. No refereed bound is changed. RH open. NO QED.
 */

// -- baked from imp-97119 IMP97119_TABLE --
export const IMP97150_TABLE = Object.freeze([
  Object.freeze({ b: 31, V: -21.7666485, model: -21.76383364, resid: -0.002815, absResid: 0.002815 }),
  Object.freeze({ b: 65, V: -60.60505615, model: -60.60371361, resid: -0.001343, absResid: 0.001343 }),
  Object.freeze({ b: 129, V: -148.107236, model: -148.1065595, resid: -0.0006765, absResid: 0.0006765 }),
  Object.freeze({ b: 257, V: -351.1351604, model: -351.1348209, resid: -0.0003396, absResid: 0.0003396 }),
  Object.freeze({ b: 513, V: -813.45452, model: -813.4543499, resid: -0.0001701, absResid: 0.0001701 }),
  Object.freeze({ b: 1025, V: -1850.83875, model: -1850.838665, resid: -8.514e-5, absResid: 8.514e-5 }),
]);

// residual*b: should stay roughly bounded, the numerical signature of an O(1/b) tail
export const IMP97150_RESID_TIMES_B = Object.freeze(
  IMP97150_TABLE.map((r) => Object.freeze({ b: r.b, residTimesB: r.resid * r.b })),
);

export default Object.freeze({
  id: 'imp-97150-boundary-cotangent-asymptotic-viz-data',
  ticket: 'imp-97150',
  source: 'imp-97119-route-m-boundary-cotangent-asymptotic.js',
  table: IMP97150_TABLE,
  residTimesB: IMP97150_RESID_TIMES_B,
  residualDecaysMonotonically: IMP97150_TABLE.every(
    (r, i) => i === 0 || Math.abs(IMP97150_TABLE[i - 1].resid) > Math.abs(r.resid),
  ),
  claimedOrder: 'O(1/b)',
});
