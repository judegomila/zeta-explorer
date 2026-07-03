/**
 * @module imp-3612-fit-bias-depth-sweep-viz-data
 * @fileoverview imp-3612 -- lightweight, import-light literal data for a
 *   visualization of the imp-3581 remainder-tail fit-bias depth sweep: the
 *   odd sinh R_3 |p_fit - 2| shrinking monotonically as the ladder deepens,
 *   with the imp-3553 nine-rung point marked and the closed
 *   p_fit = 2 + D_3 cov(a^2, ln a)/var(ln a) law drawn as the predicted curve.
 *
 *   Values below are baked reference literals reproduced from
 *   imp-3581-remainder-tail-exponent-derivation.js (measured.depthSweep,
 *   measured.oddCase.nextOrderCoeff) and the predicted-curve values computed
 *   from the SAME closed formula the module derives. This module does NOT
 *   import the heavy Phi-kernel/Simpson-quadrature assembly, so importing it
 *   into a page costs nothing at load time.
 *
 *   @see imp-3581-remainder-tail-exponent-derivation.js (the source derivation)
 *   @see imp-3553-remainder-tail-cancellation-free-r3.js (the nine-rung 1.16e-5 fit)
 *
 *   Ticket: imp-3612 (ux, medium). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

// D_3, the next-order coefficient driving the log-log fit bias (imp-3581).
export const IMP3612_D3 = -0.0003938278312105817;

// Actual least-squares |p_fit - 2| across the odd R_3 depth sweep (imp-3581 measured.depthSweep).
export const IMP3612_DEPTH_SWEEP = Object.freeze([
  { depth: 3, aDeep: 0.125, actualDev: 0.00006659069534786788, predictedDev: 0.00006658282723259745 },
  { depth: 6, aDeep: 0.015625, actualDev: 0.000023460899919669487, predictedDev: 0.000023458556808853004 },
  { depth: 9, aDeep: 0.001953125, actualDev: 0.000011575072700775735, predictedDev: 0.000011573968015099467 },
  { depth: 12, aDeep: 0.000244140625, actualDev: 0.0000068434447011433974, predictedDev: 0.0000068428044364132745 },
  { depth: 15, aDeep: 0.000030517578125, actualDev: 0.000004509730439083981, predictedDev: 0.000004509313172418317 },
  { depth: 18, aDeep: 0.000003814697265625, actualDev: 0.0000031926450514419003, predictedDev: 0.0000031923517365139986 },
]);

// The imp-3553 nine-rung cancellation-free fit sits exactly on the depth-9 point.
export const IMP3612_NINE_RUNG_DEPTH = 9;
export const IMP3612_NINE_RUNG_DEV = 0.000011575072700775735;

// Max relative gap between the actual least-squares slope and the closed prediction,
// across all six depths (~1e-4 relative, i.e. ~1e-9 absolute -- the imp-3581 certification).
export const IMP3612_MAX_MODEL_REL_ERR = Math.max(
  ...IMP3612_DEPTH_SWEEP.map((d) => Math.abs(d.actualDev - d.predictedDev) / d.actualDev),
);
