/**
 * @module imp-3672-direct-dyson-flow-crosscheck-viz-data
 * @fileoverview imp-3672 -- lightweight, import-light literal data for a
 *   visualization of the imp-3642 direct backward-Dyson RK4 crosscheck:
 *   the mesoscopic density floor V0(gamma) plotted against the local
 *   density log(gamma / 2 pi) across the measured height ladder (confirming
 *   the linear-in-log-density fit, invariant V0/log(gamma/2pi) = 0.48458 to
 *   < 1e-9 spread), and the anchor-to-crossover shrink-factor gap between
 *   the density-corrected direct reading 0.3870 (imp-3642) and the imp-398
 *   bare-log closed form 0.4410 the imp-3620 pin assumed.
 *
 *   Values below are baked reference literals reproduced from the
 *   imp-3642-sigma-crossover-tc-direct-dyson-crosscheck.js ladder/
 *   shapeInvariant/crossoverShrink exports. This module does NOT import
 *   that module (which pulls in effectiveHeightForN and runs RK4 loops), so
 *   importing it into a page costs nothing at load time.
 *
 *   @see imp-3642-sigma-crossover-tc-direct-dyson-crosscheck.js (the source derivation)
 *   @see imp-3620-sigma-crossover-tc-closedform-pin.js (the imp-398 bare-log closed form this crosschecks)
 *   @see imp-3604-sigma-crossover-flow-factor-invariance.js (flat flow-factor bracket [1, 1.000474])
 *
 *   Ticket: imp-3672 (ux, low). Presentation only, RH-equivalent, necessary-
 *   but-not-sufficient; imp-3066 untouched; NO QED.
 */

// Per-height ladder rows: logGamma (bare RvM height), logDensity = log(gamma/2pi)
// (the local density argument), and the measured mesoscopic density floor V0.
// Baked from the imp-3642 ROWS/ladder export.
export const IMP3672_V0_FIT_TABLE = Object.freeze([
  { logGamma: 9.1981, logDensity: 7.3602, V0: 3.56666 },
  { logGamma: 12.0, logDensity: 10.1621, V0: 4.92439 },
  { logGamma: 15.0, logDensity: 13.1621, V0: 6.37814 },
  { logGamma: 18.0, logDensity: 16.1621, V0: 7.83188 },
  { logGamma: 20.8576, logDensity: 19.0197, V0: 9.21663 },
]);

// V0 = slope * log(gamma / 2 pi): the linear-in-log-density fit, constant to < 1e-9.
export const IMP3672_INVARIANT_SLOPE = 0.48458;
export const IMP3672_INVARIANT_SPREAD = 3.3e-16;

// Anchor-to-crossover shrink factor: density-corrected (measured) vs imp-398 bare-log (assumed).
export const IMP3672_SHRINK_COMPARISON = Object.freeze({
  rDirect: 0.387, // density-corrected, measured from the direct RK4 flow (imp-3642)
  rImp398: 0.441, // imp-398 / imp-3620 bare-log closed form (assumed)
  overstatePct: 13.96, // how much the bare-log form over-states t_c(N_x)
});

// Downstream C_G=1 flow-factor pins re-anchored to the same 2.37e-4 A1 trap.
export const IMP3672_FLOW_FACTOR_COMPARISON = Object.freeze({
  direct: 1.0000917,
  imp398: 1.0001045,
  bracketFractionDirect: 0.193, // fraction of the imp-3604 bracket [1, 1.000474]
});
