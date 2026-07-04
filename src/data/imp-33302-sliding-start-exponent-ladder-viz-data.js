/**
 * @module imp-33302-sliding-start-exponent-ladder-viz-data
 * @fileoverview imp-33302 -- VIZ DATA ONLY. Bakes the imp-33274 sliding-start OLS effective
 *   exponent p_eff(s) ladder (window START slid s = 0,3,6,12,24,48 decades past the imp-3444
 *   crossover, fixed 12-decade span) for a line-chart viz page. Values are baked as literals
 *   per [[storage_precision_assertion_tolerance]] -- this module does NOT re-import the
 *   imp-33274 live computation chain.
 *
 *   @see imp-33274-sigma-postpeak-later-window-decay-exponent.js (the measurement this bakes)
 *   @see imp-33255-sigma-postpeak-regime-effective-exponent.js (crossover-anchored single window)
 *   @see imp-3463-sigma-fartail-decay.js (far-tail 1/2 asymptote)
 *
 *   Ticket: imp-33302 (ux, low). Presentation of an already-established convergence ladder;
 *   adds no new Lambda bound. imp-3066 K_a>=0 UNTOUCHED. RH-EQUIVALENT. NO QED. Platt-Trudgian
 *   Lambda <= 0.2 remains the rigorous SOTA.
 */

// -- baked from imp-33274 LATER_WINDOW_LADDER (fixed 12-decade span, start offset s decades
//    past the imp-3444 crossover N_cross ~ 3.280294e9) --
export const IMP33302_LADDER = Object.freeze([
  Object.freeze({ startOffsetDecades: 0, p_eff: 0.47322, gapToHalf: 2.678e-2, R2: 0.9989427 }),
  Object.freeze({ startOffsetDecades: 3, p_eff: 0.48726, gapToHalf: 1.274e-2, R2: 0.9999882 }),
  Object.freeze({ startOffsetDecades: 6, p_eff: 0.48953, gapToHalf: 1.047e-2, R2: 0.9999973 }),
  Object.freeze({ startOffsetDecades: 12, p_eff: 0.49188, gapToHalf: 8.122e-3, R2: 0.9999991 }),
  Object.freeze({ startOffsetDecades: 24, p_eff: 0.49438, gapToHalf: 5.619e-3, R2: 0.9999998 }),
  Object.freeze({ startOffsetDecades: 48, p_eff: 0.49653, gapToHalf: 3.475e-3, R2: 1.0 }),
]);

export const IMP33302_HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote
export const IMP33302_P_EFF_RANGE = [0.47322, 0.49653];
export const IMP33302_R2_RANGE = [0.9989427, 1.0];

export default Object.freeze({
  id: 'imp-33302-sliding-start-exponent-ladder-viz-data',
  ticket: 'imp-33302',
  source: 'imp-33274-sigma-postpeak-later-window-decay-exponent.js',
  ladder: IMP33302_LADDER,
  half: IMP33302_HALF,
  pEffRange: IMP33302_P_EFF_RANGE,
  r2Range: IMP33302_R2_RANGE,
});
