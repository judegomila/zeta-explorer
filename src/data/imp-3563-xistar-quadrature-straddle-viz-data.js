/**
 * @module imp-3563-xistar-quadrature-straddle-viz-data
 * @fileoverview imp-3563 -- lightweight, import-light literal data for a
 *   visualization of the imp-3548 quadrature-scheme-invariance certification
 *   of xi*_inf ~ 12.0666876.
 *
 *   Three independent quadrature rules locate the imp-3483/imp-3523 PSD
 *   peak-slope maximizer xi* from different sides:
 *     - MIDPOINT (imp-3523): O(1/N^2), FALLS to the limit from above
 *       (12.08704 -> 12.06677 as N: 360 -> 5760).
 *     - TRAPEZOID (imp-3548): O(1/N^2) with the OPPOSITE-SIGN Euler-Maclaurin
 *       error constant, so it RISES to the limit from below
 *       (12.02647 -> 12.06653 as N: 360 -> 5760).
 *     - GAUSS-LEGENDRE (imp-3548): order-10 composite rule; needs NO
 *       extrapolation at all -- already lands on xi* = 12.066687610 at
 *       N = 90 and stays bit-stable (spread < 1e-9) through N = 720.
 *
 *   The midpoint and trapezoid ladders straddle xi*_inf from opposite sides
 *   while Gauss-Legendre confirms the same location without any
 *   Richardson/Aitken extrapolation model -- the cleanest rebuttal to the
 *   worry that the imp-3523 limit is a midpoint-extrapolation artifact.
 *
 *   Values below are baked reference literals reproduced from one-off
 *   evaluations of imp-3523-xistar-panel-count-convergence-limit.js and
 *   imp-3548-xistar-quadrature-scheme-invariance.js (their `measured`
 *   fields); this file does NOT re-run those computations, so importing it
 *   into a page costs nothing at load time.
 *
 *   @see imp-3523-xistar-panel-count-convergence-limit.js (midpoint ladder, falls from above)
 *   @see imp-3548-xistar-quadrature-scheme-invariance.js (trapezoid + Gauss-Legendre, source measurement)
 *
 *   Ticket: imp-3563 (ux, medium). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

// Certified headline location (imp-3523 conservative reading; imp-3548 confirms to ~1e-9).
export const IMP3563_XISTAR_INF = 12.06668761;
export const IMP3563_RESIDUAL_BAND = 1e-6;

// Cross-scheme agreement diagnostics (from imp-3548's measured field).
export const IMP3563_GL_TAIL_SPREAD = 6.476206237948645e-10; // GL spread across N >= 90, no extrapolation
export const IMP3563_CROSS_SCHEME_SPREAD = 1.7763568394002505e-15; // GL limit vs trapezoid Richardson limit

// MIDPOINT ladder (imp-3523): falls to the limit from ABOVE. Same N ladder as trapezoid below.
export const IMP3563_MIDPOINT_LADDER = Object.freeze([
  { N: 360, xiStar: 12.08704387272693 },
  { N: 720, xiStar: 12.071799562312478 },
  { N: 1440, xiStar: 12.06796699388535 },
  { N: 2880, xiStar: 12.067007542648543 },
  { N: 5760, xiStar: 12.066767598544022 },
]);

// TRAPEZOID ladder (imp-3548): rises to the limit from BELOW -- opposite-sign Euler-Maclaurin
// error constant to the midpoint rule above.
export const IMP3563_TRAPEZOID_LADDER = Object.freeze([
  { N: 360, xiStar: 12.026472300483373 },
  { N: 720, xiStar: 12.05649575295815 },
  { N: 1440, xiStar: 12.064130860371684 },
  { N: 2880, xiStar: 12.066047870967285 },
  { N: 5760, xiStar: 12.066527640698638 },
]);
export const IMP3563_TRAPEZOID_RICHARDSON_LIMIT = 12.066687609961354;

// GAUSS-LEGENDRE ladder (imp-3548): order-10 composite rule, needs NO extrapolation -- already
// bit-stable at N = 90. Own (finer) N ladder than midpoint/trapezoid.
export const IMP3563_GAUSS_LEGENDRE_LADDER = Object.freeze([
  { N: 45, xiStar: 12.066690823910832 },
  { N: 90, xiStar: 12.066687610608977 },
  { N: 180, xiStar: 12.066687609961786 },
  { N: 360, xiStar: 12.066687609961377 },
  { N: 720, xiStar: 12.066687609961356 },
]);
export const IMP3563_GAUSS_LEGENDRE_LIMIT = 12.066687609961356; // finest rung, no Richardson used

// Absolute error vs the certified headline IMP3563_XISTAR_INF, one entry per rung (rung index
// 0..4), for the log-scale convergence-rate comparison: Gauss-Legendre falls off a cliff by
// rung 1 (N = 90) and then saturates at the headline's own ~1e-8 precision floor; midpoint and
// trapezoid both shrink roughly 4x per rung (O(1/N^2)) approaching from opposite signs.
export const IMP3563_MIDPOINT_ABS_ERROR = Object.freeze([
  0.02035626272693, 0.005111952312478, 0.00127938388535, 0.000319932648543, 0.000079988544022,
]);
export const IMP3563_TRAPEZOID_ABS_ERROR = Object.freeze([
  0.040215309516627, 0.01019185704185, 0.002556749628316, 0.000639739032715, 0.000159969301362,
]);
export const IMP3563_GAUSS_LEGENDRE_ABS_ERROR = Object.freeze([
  0.000003213910832, 0.000000000608977, 0.000000000038214, 0.000000000038623, 0.000000000038644,
]);
