/**
 * @module imp-33628-etrunc-ecoll-crossover-viz-data
 * @fileoverview imp-33628 -- lightweight, import-light literal data for a
 *   two-series crossover chart of the imp-33602 separated E_trunc(N)/E_coll(N)
 *   post-peak component ladder: the flat E_trunc floor (3.06e-5, N-independent
 *   fixed strip) against the decaying E_coll(N) ~ sqrt(log T0 / N), across the
 *   seven decades N in {1e6 .. 1e12}, with the E_coll = E_trunc crossover
 *   marker at N ~ 3.28e9 (imp-3444) and the sigma(N) share annotated per rung.
 *
 *   Values below are baked reference literals reproduced from the imp-33602
 *   `LADDER` table (src/data/imp-33602-etrunc-ecoll-component-ladder.js);
 *   this module does NOT re-run that computation, so importing it into a
 *   page costs nothing at load time.
 *
 *   @see imp-33602-etrunc-ecoll-component-ladder.js (the source measurement)
 *   @see imp-33582-sigma-postpeak-nearpeak-threshold-decay.js (the ratio-only ladder)
 *   @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover, N ~ 3.280e9)
 *
 *   Ticket: imp-33628 (ux, medium). Presentation only, RH-equivalent; imp-3066
 *   untouched; Platt-Trudgian Lambda <= 0.2 stays SOTA; NO QED.
 */

// Two-series ladder: N, the flat E_trunc floor, the decaying E_coll, and the
// resulting sigma(N) = E_coll / (E_trunc + E_flow + E_coll) share, one point
// per decade from the imp-33602 LADDER table.
export const IMP33628_LADDER = Object.freeze([
  { N: 1e6, E_trunc: 3.06e-5, E_coll: 1.4e-3, sigma: 0.9494 },
  { N: 1e7, E_trunc: 3.06e-5, E_coll: 4.766e-4, sigma: 0.9266 },
  { N: 1e8, E_trunc: 3.06e-5, E_coll: 1.609e-4, sigma: 0.8354 },
  { N: 1e9, E_trunc: 3.06e-5, E_coll: 5.391e-5, sigma: 0.6367 },
  { N: 1e10, E_trunc: 3.06e-5, E_coll: 1.797e-5, sigma: 0.3697 },
  { N: 1e11, E_trunc: 3.06e-5, E_coll: 5.959e-6, sigma: 0.163 },
  { N: 1e12, E_trunc: 3.06e-5, E_coll: 1.969e-6, sigma: 0.0604 },
]);

export const IMP33628_E_TRUNC_FLOOR = 3.06e-5;

// imp-3444 E_coll = E_trunc crossover -- lands in the [1e9, 1e10] bracket
// where sigma halves from ~0.637 to ~0.370.
export const IMP33628_CROSSOVER = Object.freeze({
  N: 3.280294352e9,
  E: 3.06e-5,
  bracket: { lastAbove: { N: 1e9, sigma: 0.6367 }, firstBelow: { N: 1e10, sigma: 0.3697 } },
});
