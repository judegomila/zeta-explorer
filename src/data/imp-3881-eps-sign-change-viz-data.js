/**
 * @module imp-3881-eps-sign-change-viz-data
 * @fileoverview imp-3881 -- lightweight, import-light literal data for a visualization of
 *   the imp-3849 inner-converged moment-ratio correction eps_n = Q_n/tau*(n)^2 - 1: positive
 *   and shrinking out to n ~ 80 (the imp-3735 regime), crossing zero near n = 149
 *   (eps_148 = +7.60e-6, eps_149 = -3.46e-6), then negative and deepening out to n = 300
 *   (eps_200 = -3.43e-4, eps_300 = -5.05e-4).
 *
 *   Values below are baked reference literals reproduced from a one-off evaluation of the
 *   imp-3849 buildLadder(T_A=2, NM=3200, MMAX=628, innerHi=2, innerN=4800) inner-converged
 *   grid (sampled densely for n=3..16, every 8th rung for n=24..300, plus the n=148/149
 *   crossing bracket); this module does NOT re-run that self-computing Simpson/Neumaier-
 *   compensated moment quadrature, so importing it into a page costs nothing at load time.
 *
 *   @see imp-3849-saddle-ratio-well-depth-inner-converged.js (the source measurement)
 *   @see imp-3735-moment-ratio-correction-tail.js (the small-n eps_n Laplace tail, n<=80)
 *   @see imp-3918-eps-sign-change-three-solver-crossval.js (three-solver n=149 cross-check)
 *
 *   Ticket: imp-3881 (ux, low). Presentation only, RH-equivalent; imp-3066 untouched; NO QED.
 */

// eps_n = Q_n/tau*(n)^2 - 1 on the imp-3849 inner-converged (T_A=2, NM=3200, inner=[0,2]/4800
// panels) Neumaier-compensated grid.
export const IMP3881_EPS_RUNGS = Object.freeze([
  { n: 3, eps: 0.5381918215 },
  { n: 4, eps: 0.3632991864 },
  { n: 5, eps: 0.2670311018 },
  { n: 6, eps: 0.2069945751 },
  { n: 7, eps: 0.1664252964 },
  { n: 8, eps: 0.1374294718 },
  { n: 9, eps: 0.1158275003 },
  { n: 10, eps: 0.099210824 },
  { n: 11, eps: 0.08609950074 },
  { n: 12, eps: 0.07553718909 },
  { n: 13, eps: 0.06688025635 },
  { n: 14, eps: 0.05968075863 },
  { n: 15, eps: 0.05361804701 },
  { n: 16, eps: 0.04845702614 },
  { n: 24, eps: 0.0250137095 },
  { n: 32, eps: 0.01513800054 },
  { n: 40, eps: 0.009994301872 },
  { n: 48, eps: 0.006962575523 },
  { n: 56, eps: 0.005023879737 },
  { n: 64, eps: 0.003710233598 },
  { n: 72, eps: 0.002780766745 },
  { n: 80, eps: 0.002100715769 },
  { n: 88, eps: 0.001589703389 },
  { n: 96, eps: 0.001197297972 },
  { n: 104, eps: 0.0008905261031 },
  { n: 112, eps: 0.0006470795082 },
  { n: 120, eps: 0.0004514241773 },
  { n: 128, eps: 0.000292473457 },
  { n: 136, eps: 0.0001621443896 },
  { n: 144, eps: 5.443324176e-05 },
  { n: 148, eps: 7.597581375e-06 },
  { n: 149, eps: -3.462626555e-06 },
  { n: 152, eps: -3.519304261e-05 },
  { n: 160, eps: -0.000110207251 },
  { n: 168, eps: -0.000173304693 },
  { n: 176, eps: -0.0002266018276 },
  { n: 184, eps: -0.0002717781954 },
  { n: 192, eps: -0.0003101794307 },
  { n: 200, eps: -0.0003428930846 },
  { n: 208, eps: -0.0003708051613 },
  { n: 216, eps: -0.0003946427707 },
  { n: 224, eps: -0.0004150066582 },
  { n: 232, eps: -0.0004323962624 },
  { n: 240, eps: -0.000447229196 },
  { n: 248, eps: -0.0004598565218 },
  { n: 256, eps: -0.0004705748269 },
  { n: 264, eps: -0.0004796358375 },
  { n: 272, eps: -0.000487254128 },
  { n: 280, eps: -0.0004936133434 },
  { n: 288, eps: -0.0004988712518 },
  { n: 296, eps: -0.0005031638709 },
  { n: 300, eps: -0.0005049856015 },
]);

export const IMP3881_SIGN_CHANGE_N = 149; // first n with eps_n < 0 following a positive eps_(n-1)
