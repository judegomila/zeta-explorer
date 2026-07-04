/**
 * @module imp-3880-saddle-ratio-inner-converged-viz-data
 * @fileoverview imp-3880 -- lightweight, import-light literal data for a visualization of
 *   the imp-3849 INNER-CONVERGED exact-saddle ratio r_n = R_n - 1 = |D_n|/|D_n^saddle| - 1
 *   across n=3..624: the approach from a large positive ratio at small n, the converged
 *   unity crossing at n* = 215.231, the broad sub-unity undershoot basin bottoming at
 *   r_min = -5.845e-4 near n~500, and the slow recovery toward zero out to n=624.
 *
 *   Values below are baked reference literals reproduced from a one-off evaluation of the
 *   imp-3849 buildLadder(T_A=2, NM=3200, MMAX=628, innerHi=2, innerN=4800) inner-converged
 *   ladder (sampled every 8th rung plus the crossing/well/recovery landmark rungs); this
 *   module does NOT re-run that self-computing Simpson/Neumaier-compensated moment
 *   quadrature, so importing it into a page costs nothing at load time. The companion
 *   imp-3731 coarse-inner (inner=1200 panel) artifact curve for contrast is the existing
 *   imp-3862 viz-data module (n=150..280), reproduced here as a re-export for convenience.
 *
 *   @see imp-3849-saddle-ratio-well-depth-inner-converged.js (the source measurement)
 *   @see imp-3862-saddle-ratio-crossing-viz-data.js (the imp-3731 coarse-inner artifact curve)
 *   @see imp-3731-saddle-ratio-crossing-extended-precision.js (the corrected coarse-inner measurement)
 *
 *   Ticket: imp-3880 (ux, low). Presentation only, RH-equivalent; imp-3066 untouched; NO QED.
 */

export {
  IMP3862_RUNGS as IMP3880_ARTIFACT_RUNGS,
  IMP3862_CROSSING_N_STAR as IMP3880_ARTIFACT_CROSSING_N_STAR,
  IMP3862_UNDERSHOOT_MIN_N as IMP3880_ARTIFACT_UNDERSHOOT_MIN_N,
  IMP3862_UNDERSHOOT_MIN_R as IMP3880_ARTIFACT_UNDERSHOOT_MIN_R,
} from './imp-3862-saddle-ratio-crossing-viz-data.js';

// r_n = R_n - 1 on the imp-3849 inner-converged (T_A=2, NM=3200, inner=[0,2]/4800 panels)
// Neumaier-compensated grid, n=3..624 sampled every 8th rung plus the crossing bracket
// (n=215,216), the imp-3731 comparison rungs (n=226,276), and the undershoot-well rungs.
export const IMP3880_RUNGS = Object.freeze([
  { n: 3, r: 2.644219 },
  { n: 8, r: 0.3541933 },
  { n: 16, r: 0.1150177 },
  { n: 24, r: 0.05909702 },
  { n: 32, r: 0.03621023 },
  { n: 40, r: 0.02439669 },
  { n: 48, r: 0.01744351 },
  { n: 56, r: 0.0129864 },
  { n: 64, r: 0.009952009 },
  { n: 72, r: 0.007791443 },
  { n: 80, r: 0.006198702 },
  { n: 88, r: 0.004991587 },
  { n: 96, r: 0.004055833 },
  { n: 104, r: 0.003316695 },
  { n: 112, r: 0.00272355 },
  { n: 120, r: 0.002241087 },
  { n: 128, r: 0.001844053 },
  { n: 136, r: 0.001513993 },
  { n: 144, r: 0.00123716 },
  { n: 149, r: 0.001086434 },
  { n: 150, r: 0.001058105 },
  { n: 152, r: 0.001003143 },
  { n: 160, r: 0.0008039422 },
  { n: 168, r: 0.0006333247 },
  { n: 176, r: 0.0004863795 },
  { n: 184, r: 0.0003591939 },
  { n: 192, r: 0.0002486205 },
  { n: 200, r: 0.0001521046 },
  { n: 208, r: 6.755588e-05 },
  { n: 215, r: 2.030131e-06 },
  { n: 216, r: -6.749165e-06 },
  { n: 224, r: -7.224117e-05 },
  { n: 226, r: -8.738169e-05 },
  { n: 232, r: -0.0001301154 },
  { n: 240, r: -0.0001813765 },
  { n: 248, r: -0.0002268732 },
  { n: 256, r: -0.0002673268 },
  { n: 264, r: -0.0003033527 },
  { n: 272, r: -0.0003354786 },
  { n: 276, r: -0.0003502235 },
  { n: 280, r: -0.0003641588 },
  { n: 288, r: -0.000389786 },
  { n: 296, r: -0.000412701 },
  { n: 304, r: -0.0004332004 },
  { n: 312, r: -0.0004515435 },
  { n: 320, r: -0.0004679573 },
  { n: 328, r: -0.0004826414 },
  { n: 336, r: -0.0004957719 },
  { n: 344, r: -0.0005075041 },
  { n: 352, r: -0.0005179759 },
  { n: 360, r: -0.0005273096 },
  { n: 368, r: -0.0005356142 },
  { n: 376, r: -0.0005429867 },
  { n: 384, r: -0.0005495142 },
  { n: 392, r: -0.0005552744 },
  { n: 400, r: -0.0005603371 },
  { n: 408, r: -0.0005647651 },
  { n: 416, r: -0.0005686151 },
  { n: 424, r: -0.0005719379 },
  { n: 432, r: -0.0005747798 },
  { n: 440, r: -0.0005771824 },
  { n: 448, r: -0.0005791836 },
  { n: 456, r: -0.0005808176 },
  { n: 464, r: -0.0005821156 },
  { n: 472, r: -0.000583106 },
  { n: 480, r: -0.0005838147 },
  { n: 488, r: -0.0005842651 },
  { n: 490, r: -0.00058434 },
  { n: 496, r: -0.0005844789 },
  { n: 500, r: -0.0005845033 },
  { n: 504, r: -0.0005844757 },
  { n: 510, r: -0.0005843418 },
  { n: 512, r: -0.0005842735 },
  { n: 520, r: -0.0005838888 },
  { n: 528, r: -0.0005833367 },
  { n: 536, r: -0.000582631 },
  { n: 544, r: -0.0005817845 },
  { n: 552, r: -0.000580809 },
  { n: 560, r: -0.0005797151 },
  { n: 568, r: -0.0005785128 },
  { n: 576, r: -0.0005772112 },
  { n: 584, r: -0.0005758188 },
  { n: 592, r: -0.0005743432 },
  { n: 600, r: -0.0005727918 },
  { n: 608, r: -0.000571171 },
  { n: 616, r: -0.0005694869 },
  { n: 620, r: -0.000568623 },
  { n: 624, r: -0.0005677454 },
]);

export const IMP3880_CROSSING_N_STAR = 215.231; // interpolated converged unity crossing
export const IMP3880_UNDERSHOOT_MIN_N = 500; // deepest converged sub-unity rung (broad plateau n~490-510)
export const IMP3880_UNDERSHOOT_MIN_R = -0.0005845033; // r_min at n=500 (R_n ~ 0.99942)
