/**
 * @module imp-3862-saddle-ratio-crossing-viz-data
 * @fileoverview imp-3862 -- lightweight, import-light literal data for a
 *   visualization of the imp-3731 exact-saddle ratio r_n = R_n - 1 = |D_n|/|D_n^saddle| - 1
 *   crossing zero (R_n crossing unity) near n* ~ 225.54 and continuing into the
 *   sub-unity undershoot out to n=280, marking the imp-3713 r_225 / r_226 sign flip.
 *
 *   Values below (n, r_n on the T_A=8/NM=6400 finer compensated grid) are baked
 *   reference literals reproduced from a one-off evaluation of the imp-3731
 *   buildLadder(8, 6400) ladder; this module does NOT re-run that self-computing
 *   Simpson/Neumaier-compensated moment quadrature, so importing it into a page
 *   costs nothing at load time.
 *
 *   @see imp-3731-saddle-ratio-crossing-extended-precision.js (the source measurement)
 *   @see imp-3713-saddle-ratio-approach-to-unity.js (the double-precision crossing bracket)
 *
 *   HONEST STATUS NOTE (imp-3849 supersession)
 *   -------------------------------------------
 *   imp-3849 later showed that converging the INNER A(tau) autocorrelation quadrature
 *   (rather than the fixed inner=1200-panel grid this imp-3731 ladder and its imp-3713
 *   predecessor both use) moves the true crossing to n* = 215.2 and deepens the sub-unity
 *   well ~5x (to r_min ~ -5.845e-4 near n~500). The n* ~ 225.54 crossing and shallow well
 *   plotted here are the CONVERGED-IN-OUTER-GRID-ONLY, inner=1200 result — a real,
 *   reproducible ladder, but one since identified as an inner-quadrature artifact rather
 *   than the fully-converged crossing. See imp-3880/imp-3849 for the inner-converged ladder.
 *
 *   Ticket: imp-3862 (ux, low). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

// r_n = R_n - 1 on the imp-3731 finer (T_A=8, NM=6400) Neumaier-compensated grid,
// n=150..280 step 2, plus the exact crossing-bracket rungs n=225,226.
export const IMP3862_RUNGS = Object.freeze([
  { n: 150, r: 0.0010277243 },
  { n: 152, r: 0.0009740261 },
  { n: 154, r: 0.000922583 },
  { n: 156, r: 0.0008732902 },
  { n: 158, r: 0.0008260492 },
  { n: 160, r: 0.0007807673 },
  { n: 162, r: 0.0007373573 },
  { n: 164, r: 0.0006957367 },
  { n: 166, r: 0.0006558282 },
  { n: 168, r: 0.0006175586 },
  { n: 170, r: 0.0005808586 },
  { n: 172, r: 0.0005456631 },
  { n: 174, r: 0.0005119102 },
  { n: 176, r: 0.0004795416 },
  { n: 178, r: 0.0004485019 },
  { n: 180, r: 0.0004187386 },
  { n: 182, r: 0.0003902022 },
  { n: 184, r: 0.0003628454 },
  { n: 186, r: 0.0003366236 },
  { n: 188, r: 0.0003114941 },
  { n: 190, r: 0.0002874167 },
  { n: 192, r: 0.0002643529 },
  { n: 194, r: 0.0002422661 },
  { n: 196, r: 0.0002211216 },
  { n: 198, r: 0.0002008862 },
  { n: 200, r: 0.0001815283 },
  { n: 202, r: 0.0001630177 },
  { n: 204, r: 0.0001453258 },
  { n: 206, r: 0.0001284251 },
  { n: 208, r: 0.0001122892 },
  { n: 210, r: 0.0000968933 },
  { n: 212, r: 0.0000822132 },
  { n: 214, r: 0.000068226 },
  { n: 216, r: 0.0000549098 },
  { n: 218, r: 0.0000422436 },
  { n: 220, r: 0.000030207 },
  { n: 222, r: 0.0000187809 },
  { n: 224, r: 0.0000079467 },
  { n: 225, r: 0.0000027459 },
  { n: 226, r: -0.0000023135 },
  { n: 228, r: -0.0000120168 },
  { n: 230, r: -0.0000211796 },
  { n: 232, r: -0.0000298177 },
  { n: 234, r: -0.0000379464 },
  { n: 236, r: -0.0000455802 },
  { n: 238, r: -0.0000527333 },
  { n: 240, r: -0.0000594193 },
  { n: 242, r: -0.0000656512 },
  { n: 244, r: -0.0000714416 },
  { n: 246, r: -0.0000768028 },
  { n: 248, r: -0.0000817466 },
  { n: 250, r: -0.0000862841 },
  { n: 252, r: -0.0000904265 },
  { n: 254, r: -0.0000941844 },
  { n: 256, r: -0.000097568 },
  { n: 258, r: -0.0001005872 },
  { n: 260, r: -0.0001032517 },
  { n: 262, r: -0.0001055708 },
  { n: 264, r: -0.0001075534 },
  { n: 266, r: -0.0001092084 },
  { n: 268, r: -0.0001105443 },
  { n: 270, r: -0.0001115692 },
  { n: 272, r: -0.0001122911 },
  { n: 274, r: -0.0001127179 },
  { n: 276, r: -0.0001128571 },
  { n: 278, r: -0.0001127159 },
  { n: 280, r: -0.0001123016 },
]);

export const IMP3862_CROSSING_N_STAR = 225.5427323; // interpolated unity crossing (finer grid)
export const IMP3862_CROSSOVER_R225 = 0.0000027459; // r_225, last rung above unity
export const IMP3862_CROSSOVER_R226 = -0.0000023135; // r_226, first rung below unity
export const IMP3862_UNDERSHOOT_MIN_N = 276; // deepest sub-unity rung
export const IMP3862_UNDERSHOOT_MIN_R = -0.0001128571; // r_min at n=276 (R_n ~ 0.99989)
