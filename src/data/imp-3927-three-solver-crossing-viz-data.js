/**
 * @module imp-3927-three-solver-crossing-viz-data
 * @fileoverview imp-3927 -- lightweight, import-light literal data for a
 *   visualization of the imp-3895 three-solver R_n = |D_n|/|D_n^saddle|
 *   crossing cross-check: composite Simpson (imp-3849), 5-point
 *   Gauss-Legendre (imp-3868) and composite Clenshaw-Curtis (imp-3895)
 *   residuals r_n = R_n - 1 bracketing the exact-saddle crossing n* = 215.23,
 *   the eps_n = Q_n/tau*(n)^2 - 1 sign-change at n = 149, and the n = 500
 *   sub-unity well recovering toward 1 out to n = 620.
 *
 *   Values below are baked reference literals reproduced from
 *   imp-3849-saddle-ratio-well-depth-inner-converged.js,
 *   imp-3868-saddle-crossing-gauss-legendre-cross-solver.js and
 *   imp-3895-saddle-crossing-clenshaw-curtis-third-solver.js MEASURED
 *   fields. This module does NOT import any of the three solvers (and
 *   transitively no zeros bundle), so importing it into a page costs
 *   nothing at load time.
 *
 *   @see imp-3849-saddle-ratio-well-depth-inner-converged.js (first (Simpson) solver)
 *   @see imp-3868-saddle-crossing-gauss-legendre-cross-solver.js (second (GL) solver)
 *   @see imp-3895-saddle-crossing-clenshaw-curtis-third-solver.js (third (CC) solver)
 *
 *   Ticket: imp-3927 (ux, low). Presentation only; measurement-only finding,
 *   RH-equivalent, necessary-but-not-sufficient; no new bound; NO QED.
 */

// r_n = R_n - 1 bracketing the crossing n* = 215.23, all three solvers.
export const IMP3927_CROSSING_ROWS = Object.freeze([
  { n: 215, simpsonR: 2.030e-6, glR: 2.041e-6, ccR: 2.041e-6 },
  { n: 216, simpsonR: -6.749e-6, glR: -6.738e-6, ccR: -6.738e-6 },
]);

export const IMP3927_SIMPSON_INTERP = 215.231; // imp-3849 linear-interp crossing n*
export const IMP3927_GL_INTERP = 215.2324603346629; // imp-3868 linear-interp crossing n*
export const IMP3927_CC_INTERP = 215.23246; // imp-3895 linear-interp crossing n*

// eps_n sign-change bracketing n = 149, all three solvers.
export const IMP3927_EPS_ROWS = Object.freeze([
  { n: 100, simpsonEps: 1.035e-3, glEps: 1.035e-3, ccEps: 1.035e-3 },
  { n: 148, simpsonEps: 7.58e-6, glEps: 7.58e-6, ccEps: 7.58e-6 },
  { n: 149, simpsonEps: -3.48e-6, glEps: -3.48e-6, ccEps: -3.48e-6 },
  { n: 200, simpsonEps: -3.43e-4, glEps: -3.43e-4, ccEps: -3.43e-4 },
  { n: 300, simpsonEps: -5.05e-4, glEps: -5.05e-4, ccEps: -5.05e-4 },
]);

export const IMP3927_EPS_SIGN_CHANGE_N = 149;

// Sub-unity well: r_n recovering toward 1 from below, n = 500..620 (CC path).
export const IMP3927_WELL_ROWS = Object.freeze([
  { n: 500, r: -5.844e-4 },
  { n: 560, r: -5.796e-4 },
  { n: 620, r: -5.685e-4 },
]);

export const IMP3927_WELL_MIN_R_SIMPSON = -5.845e-4; // imp-3849 well minimum
export const IMP3927_WELL_MIN_R_GL = -5.844e-4; // imp-3868 well minimum
export const IMP3927_WELL_MIN_R_CC = -5.844e-4; // imp-3895 well minimum

export const IMP3927_CROSS_CC_GL_INTERP_DELTA = Math.abs(IMP3927_CC_INTERP - IMP3927_GL_INTERP); // ~6e-8 rung
export const IMP3927_CROSS_CC_SIMPSON_INTERP_DELTA = Math.abs(IMP3927_CC_INTERP - IMP3927_SIMPSON_INTERP); // ~1.5e-3 rung
