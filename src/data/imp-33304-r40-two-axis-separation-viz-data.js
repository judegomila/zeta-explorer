/**
 * @module imp-33304-r40-two-axis-separation-viz-data
 * @fileoverview imp-33304 -- lightweight, import-light literal data for a
 *   visualization of the imp-33276 R_40 two-axis separation: R_40 climbing
 *   1.02438462 -> 1.02439669 as the inner A(tau) Simpson grid refines
 *   ([0,7]/1200 through [0,2]/7200), plotted against the flat cross-outer
 *   delta |R_40(T_A=2,NM=3200) - R_40(T_A=6,NM=1600)| at each inner rung
 *   (several bit-identical at machine epsilon). Shows inner resolution moves
 *   R_40 while the outer moment grid does not.
 *
 *   Values below are baked reference literals reproduced from
 *   imp-33276-r40-cross-outer-invariance-all-inner-grids.js (its
 *   `CROSS_OUTER` per-rung table); this module does NOT re-run that
 *   self-computing quadrature sweep, so importing it into a page costs
 *   nothing at load time.
 *
 *   @see imp-33276-r40-cross-outer-invariance-all-inner-grids.js (source measurement)
 *
 *   Ticket: imp-33304 (ux, low). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

// Per-rung table: inner grid label, R_40 under outer A, and the cross-outer delta
// |R_40(T_A=2,NM=3200) - R_40(T_A=6,NM=1600)| at that inner rung.
export const IMP33304_TWO_AXIS_RUNGS = Object.freeze([
  { label: '[0,7]/1200', r40: 1.02438462, deltaCrossOuter: 1.75e-14 },
  { label: '[0,2]/400', r40: 1.02438972, deltaCrossOuter: 6.88e-15 },
  { label: '[0,2]/800', r40: 1.02439620, deltaCrossOuter: 3.55e-15 },
  { label: '[0,2]/1600', r40: 1.02439666, deltaCrossOuter: 7.11e-15 },
  { label: '[0,2]/3200', r40: 1.02439669, deltaCrossOuter: 3.55e-15 },
  { label: '[0,2]/4800', r40: 1.02439669, deltaCrossOuter: 0.0 },
  { label: '[0,2]/7200', r40: 1.02439669, deltaCrossOuter: 0.0 },
]);

export const IMP33304_R40_COARSE = 1.02438462;
export const IMP33304_R40_FINEST = 1.02439669;
export const IMP33304_INNER_DRIFT_SPAN = IMP33304_R40_FINEST - IMP33304_R40_COARSE; // ~1.21e-5
export const IMP33304_MAX_CROSS_OUTER_DELTA = 1.75e-14;

export const IMP33304_OUTER_A_LABEL = 'T_A=2, NM=3200 (imp-3849 native)';
export const IMP33304_OUTER_B_LABEL = 'T_A=6, NM=1600 (imp-3685 native)';
