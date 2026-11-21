/**
 * @module imp-97151-kappa-arith-convergence-ladder-viz-data
 * @fileoverview imp-97151 -- VIZ DATA ONLY. Bakes the imp-97122 kappa_arith convergence-rate
 *   ladder for a chart: the normalized residual r(b) = F_arith(b)/(phi(b) b) - kappa_arith on a
 *   general-b ladder (b = 101..9973, decaying O(log b / b), fit r(b)*b = 0.2481 log b + 0.1003)
 *   against the SAME quantity |r(b)| on a primorial-b ladder (b = 6..30030), which collapses
 *   orders of magnitude faster (Moebius divisor-sum cancellation) -- the general-b vs primorial-b
 *   contrast is the headline reading. Values are copied literals from imp-97122's frozen exports
 *   IMP97122_MEASURED.generalB / .primorialB -- this module does NOT recompute F_arith, L0, or L1.
 *   Pure frozen-object data, no imports, no self-executing assertions of its own, per the
 *   [[storage_precision_assertion_tolerance]] and [[no_heavy_imports_in_pages]] conventions --
 *   needs no separate DATA_MODULES registration.
 *
 *   @see imp-97122-route-m-arith-first-moment-convergence-rate.js (the certified ladder this bakes)
 *   @see imp-97096-route-m-arith-first-moment-evaluation.js (the exact kappa_arith this converges to)
 *
 *   Ticket: imp-97151 (ux, low). Presentation of an already-established measurement; adds no new
 *   Lambda bound. No refereed bound is changed. RH open. NO QED.
 */

// -- baked from imp-97122 IMP97122_MEASURED.generalB --
export const IMP97151_GENERAL_B = Object.freeze([
  Object.freeze({ b: 101, r: 1.2355e-2 }),
  Object.freeze({ b: 211, r: 6.7666e-3 }),
  Object.freeze({ b: 503, r: 3.2648e-3 }),
  Object.freeze({ b: 1009, r: 1.7989e-3 }),
  Object.freeze({ b: 2003, r: 9.9144e-4 }),
  Object.freeze({ b: 5003, r: 4.4259e-4 }),
  Object.freeze({ b: 9973, r: 2.3930e-4 }),
]);

// -- baked from imp-97122 IMP97122_MEASURED.primorialB --
export const IMP97151_PRIMORIAL_B = Object.freeze([
  Object.freeze({ b: 6, absR: 5.88e-3 }),
  Object.freeze({ b: 30, absR: 6.52e-4 }),
  Object.freeze({ b: 210, absR: 3.29e-5 }),
  Object.freeze({ b: 2310, absR: 1.07e-6 }),
  Object.freeze({ b: 30030, absR: 3.60e-7 }),
]);

// r(b)*b at each general-b rung: should track the fitted line c*log(b)+d, c~0.2481, d~0.1003
export const IMP97151_RESID_TIMES_B = Object.freeze(
  IMP97151_GENERAL_B.map((row) => Object.freeze({ b: row.b, residTimesB: row.r * row.b })),
);

export const IMP97151_RATE_FIT = Object.freeze({
  form: 'r(b)*b = c*log b + d',
  c: 0.2481,
  d: 0.1003,
});

export default Object.freeze({
  id: 'imp-97151-kappa-arith-convergence-ladder-viz-data',
  ticket: 'imp-97151',
  source: 'imp-97122-route-m-arith-first-moment-convergence-rate.js',
  kappaArith: 0.5704960511308594,
  generalB: IMP97151_GENERAL_B,
  primorialB: IMP97151_PRIMORIAL_B,
  residTimesB: IMP97151_RESID_TIMES_B,
  rateFit: IMP97151_RATE_FIT,
  generalRateClass: 'O(log b / b)',
  primorialCollapsesFaster: true,
});
