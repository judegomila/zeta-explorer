/**
 * @module imp-35957-rdirect-floor-height-sweep-viz-data
 * @fileoverview imp-35957 -- lightweight, import-light literal data for a
 *   visualization of the imp-35892 R_direct floor-vs-height sweep: the
 *   cancellation-free surplus-split ratio R_direct = -S_inf . a/(2-a) tracks
 *   its independent reference R_clean at a <= 2 ULP (max ~ 4.44e-16) plateau
 *   across N = 1e13 .. 2.857e307, then fails at a HARD NaN representability
 *   cliff (not a conditioning ramp) once the effectiveHeightForN RvM inverse
 *   overflows past Number.MAX_VALUE.
 *
 *   Values below are baked reference literals reproduced from
 *   imp-35892-rdirect-own-floor-departure-height.js MEASURED fields (its
 *   exported metric object, plus a resampled row set at the same K_ampl,
 *   delta, S_inf, aOf, effectiveHeightForN it uses). This module does NOT
 *   import imp-35892 or its lambda-rh-height-mapping / C_C dependency chain
 *   (and transitively no zeros bundle), so importing it into a page costs
 *   nothing at load time.
 *
 *   @see imp-35892-rdirect-own-floor-departure-height.js (source measurement)
 *   @see imp-35855-rclean-interval-de-cancellation-assessment (de-cancelled dG node, stopped at N~1e21)
 *
 *   Ticket: imp-35957 (ux, low). Presentation only; measurement-only finding,
 *   RH-equivalent, necessary-but-not-sufficient; no new bound; NO QED.
 */

// R_direct relative departure from R_clean across the finite double range,
// resampled at representative decades (imp-35892 assess(), same K_ampl/delta/S_inf/aOf).
export const IMP35957_PLATEAU_ROWS = Object.freeze([
  { log10N: 13, N: '1.000e+13', a: '1.514e-5', departUlp: 0.0 },
  { log10N: 50, N: '1.000e+50', a: '1.558e-42', departUlp: 0.0 },
  { log10N: 100, N: '1.000e+100', a: '1.566e-92', departUlp: 0.0 },
  { log10N: 150, N: '1.000e+150', a: '1.568e-142', departUlp: 0.0 },
  { log10N: 200, N: '1.000e+200', a: '1.569e-192', departUlp: 1.0 },
  { log10N: 250, N: '1.000e+250', a: '1.570e-242', departUlp: 1.0 },
  { log10N: 290, N: '1.000e+290', a: '1.570e-282', departUlp: 0.0 },
  { log10N: 300, N: '1.000e+300', a: '1.570e-292', departUlp: 0.0 },
  { log10N: 305, N: '1.000e+305', a: '1.570e-297', departUlp: 1.0 },
  { log10N: 307, N: '1.000e+307', a: '1.570e-299', departUlp: 0.0 },
  { log10N: 307.455916, N: '2.857e+307', a: '5.497e-300', departUlp: 1.0 },
]);

// imp-35892 metric fields: plateau ceiling over the full finite sweep.
export const IMP35957_MAX_DEPART_FINITE = 2.22e-16; // max relative departure, finite range
export const IMP35957_MAX_DEPART_ULP = 0.9998; // <= 2 ULP ceiling (imp-35855/imp-35892 claim)
export const IMP35957_THRESHOLD = 1e-12; // fixed departure threshold the ticket named -- never crossed

// The hard cliff: last finite point (still at the plateau floor) vs the first
// non-finite probe (effectiveHeightForN RvM inverse overflow to +Infinity).
export const IMP35957_LAST_FINITE_LOG10_N = 307.455916;
export const IMP35957_LAST_FINITE_N = 2.857038e307;
export const IMP35957_LAST_FINITE_T = 2.563037e305;
export const IMP35957_LAST_FINITE_A = 5.496834e-300; // still a NORMAL double, ~24 orders above min denormal
export const IMP35957_OVERFLOW_PROBE_LOG10_N = 308; // decade guaranteed to overflow effectiveHeightForN
export const IMP35957_CLIFF_IS_HARD = true; // last-finite at floor, next probe NaN -- not a soft ramp
export const IMP35957_A_STILL_NORMAL_AT_CLIFF = true;
export const IMP35957_OVERFLOW_IS_HEIGHT_INVERSE = true; // cliff driven by T(N) representability, not a->0 underflow

export const IMP35957_MIN_DENORMAL_DOUBLE = 4.9406564584124654e-324;
export const IMP35957_MAX_DOUBLE = 1.7976931348623157e308;
