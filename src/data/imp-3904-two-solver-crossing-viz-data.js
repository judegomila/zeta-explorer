/**
 * @module imp-3904-two-solver-crossing-viz-data
 * @fileoverview imp-3904 -- lightweight, import-light literal data for a
 *   visualization of the imp-3868 two-solver saddle-crossing cross-check:
 *   composite Simpson (imp-3849) vs 5-point Gauss-Legendre (imp-3868)
 *   residuals r_n = R_n - 1 bracketing the unity crossing n* = 215.2, and the
 *   imp-3731 inner=1200 crossing artifact r_226 = -2.314e-6 next to the two
 *   INNER-CONVERGED r_226 values (~38x larger in magnitude).
 *
 *   Values below are baked reference literals reproduced from
 *   imp-3849-saddle-ratio-well-depth-inner-converged.js and
 *   imp-3868-saddle-crossing-gauss-legendre-cross-solver.js MEASURED fields.
 *   This module does NOT import either solver (and transitively no zeros
 *   bundle), so importing it into a page costs nothing at load time.
 *
 *   @see imp-3849-saddle-ratio-well-depth-inner-converged.js (Simpson solver, source of the crossing)
 *   @see imp-3868-saddle-crossing-gauss-legendre-cross-solver.js (Gauss-Legendre cross-solver confirmation)
 *   @see imp-3731-saddle-ratio-crossing-extended-precision.js (the inner=1200 artifact this refutes as a floor)
 *
 *   Ticket: imp-3904 (ux, low). Presentation only; measurement-only finding,
 *   RH-equivalent, necessary-but-not-sufficient; no new bound; NO QED.
 */

// r_n = R_n - 1 bracketing the crossing n* = 215.2, both solvers.
export const IMP3904_CROSSING_ROWS = Object.freeze([
  { n: 215, simpsonR: 2.030e-6, glR: 2.041e-6 },
  { n: 216, simpsonR: -6.749e-6, glR: -6.738e-6 },
]);

export const IMP3904_SIMPSON_INTERP = 215.231; // imp-3849 linear-interp crossing n*
export const IMP3904_GL_INTERP = 215.2325; // imp-3868 linear-interp crossing n*
export const IMP3904_CROSS_SOLVER_INTERP_DELTA = Math.abs(IMP3904_GL_INTERP - IMP3904_SIMPSON_INTERP);

// r_226 magnitude: the imp-3731 inner=1200 artifact vs the two inner-converged solvers.
export const IMP3904_R226_ROWS = Object.freeze([
  { label: 'imp-3731 artifact (inner=1200)', r226: -2.314e-6 },
  { label: 'imp-3849 Simpson (converged)', r226: -8.738e-5 },
  { label: 'imp-3868 Gauss-Legendre (converged)', r226: -8.737e-5 },
]);

export const IMP3904_CROSS_SOLVER_R226_DELTA = Math.abs(-8.737e-5 - -8.738e-5); // ~1e-8
export const IMP3904_ARTIFACT_TO_CONVERGED_RATIO = Math.abs(-8.7375e-5 / -2.314e-6); // ~38x
