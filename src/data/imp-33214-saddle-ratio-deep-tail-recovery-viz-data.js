/**
 * @module imp-33214-saddle-ratio-deep-tail-recovery-viz-data
 * @fileoverview imp-33214 -- lightweight, import-light literal data for a visualization of
 *   the imp-3869 DEEP-TAIL extension of the exact-saddle ratio r_n = R_n - 1 =
 *   |D_n|/|D_n^saddle| - 1 across the broad n~500 sub-unity basin (imp-3849) and the
 *   further ~800-rung climb out to n=1424 (imp-3869): R_n stays below 1 throughout, the
 *   recovery toward 1 is slow and monotonic with NO second sign change or well, and the
 *   only second feature is a recovery-RATE shoulder (inflection of r_n) near n~790.
 *
 *   Values for n=500..624 are the imp-3880 baked literals (imp-3849 inner-converged
 *   ladder). Values for n=624..1424 (every 40th rung plus the n=700/790/900/1000/1200/1424
 *   landmark rungs) are a fresh one-off bake of the IDENTICAL imp-3869
 *   buildLadder(T_A=2, NM=3200, MMAX=1428, innerHi=2, innerN=4800) deep-tail extension via
 *   scripts/imp-33214-deep-tail-viz-data-gen.mjs (duplicates the imp-3869 kernel/quadrature
 *   exactly; does not import the self-computing module, so this file costs nothing to
 *   import at page load).
 *
 *   @see imp-3869-saddle-ratio-deep-tail-recovery.js (the source measurement)
 *   @see imp-3880-saddle-ratio-inner-converged-viz-data.js (the n=3..624 basin literals reused here)
 *   @see imp-3849-saddle-ratio-well-depth-inner-converged.js (the n~500 well this extends past)
 *
 *   Ticket: imp-33214 (ux, low). Presentation only, RH-equivalent; imp-3066 untouched; NO QED.
 */

// r_n = R_n - 1 across the broad basin and the deep-n tail, n=500..1424.
export const IMP33214_RUNGS = Object.freeze([
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
  { n: 664, r: -0.0005583443 },
  { n: 700, r: -0.0005491888 },
  { n: 704, r: -0.0005481441 },
  { n: 744, r: -0.0005375064 },
  { n: 784, r: -0.00052668 },
  { n: 790, r: -0.0005250511 },
  { n: 824, r: -0.0005158362 },
  { n: 864, r: -0.0005050928 },
  { n: 900, r: -0.0004955764 },
  { n: 904, r: -0.0004945299 },
  { n: 944, r: -0.0004842009 },
  { n: 984, r: -0.0004741402 },
  { n: 1000, r: -0.0004701962 },
  { n: 1024, r: -0.0004643689 },
  { n: 1064, r: -0.0004548982 },
  { n: 1104, r: -0.0004457324 },
  { n: 1144, r: -0.0004368712 },
  { n: 1184, r: -0.0004283103 },
  { n: 1200, r: -0.0004249688 },
  { n: 1224, r: -0.0004200436 },
  { n: 1264, r: -0.000412063 },
  { n: 1304, r: -0.0004043595 },
  { n: 1344, r: -0.0003969233 },
  { n: 1384, r: -0.0003897445 },
  { n: 1424, r: -0.0003828129 },
]);

export const IMP33214_WELL_MIN_N = 500; // imp-3849 broad basin minimum
export const IMP33214_WELL_MIN_R = -0.0005845033; // r_min = -5.845e-4 (R ~ 0.99942)
export const IMP33214_SHOULDER_N = 790; // imp-3869 recovery-rate shoulder (inflection of r_n)
export const IMP33214_TAIL_HI_N = 1424; // imp-3869 last extended rung
export const IMP33214_TAIL_HI_R = -0.0003828129; // r_1424 = R_1424 - 1 (R_1424 = 0.999617)
export const IMP33214_RECOVERY_FRACTION = 1 - IMP33214_TAIL_HI_R / IMP33214_WELL_MIN_R; // ~0.345
