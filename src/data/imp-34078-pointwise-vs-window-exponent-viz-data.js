/**
 * @module imp-34078-pointwise-vs-window-exponent-viz-data
 * @fileoverview imp-34078 -- lightweight, import-light literal data for a
 *   visualization of the imp-34006 pointwise-vs-window exponent estimator
 *   cross-tabulation: the imp-33816 POINTWISE local exponent p(N) and the
 *   imp-33274 far-tail SLIDING-WINDOW effective exponent p_eff(N) (fixed
 *   12-decade OLS span) both approach the imp-3463 far-tail 1/2 asymptote,
 *   with the window LEADING the pointwise at every rung by an offset
 *   delta(N) = p_eff(N) - p(N) that decays as ~const/(log T0)^2 (imp-34006 F2),
 *   and the window reaching each within-1% / within-0.1% threshold ~half its
 *   12-decade span (~6 decades) before the pointwise estimator (imp-34006 F3).
 *
 *   Values below are baked reference literals reproduced by re-evaluating the
 *   imp-34006-pointwise-vs-window-exponent-cross-tabulation.js `pPointAtLog10`
 *   / `pWindowAtLog10` / `logT0FromLnN` formulas (identical inherited
 *   imp-3220/imp-3406/imp-33274/imp-33816 sub-terms); this module does NOT
 *   re-run that computation or import the heavy zeros bundle, so importing it
 *   into a page costs nothing at load time.
 *
 *   @see imp-34006-pointwise-vs-window-exponent-cross-tabulation.js (the source measurement)
 *   @see imp-33816-sigma-exponent-asymptote-approach-rate (POINTWISE gap law gap ~ 1/(2 log T0))
 *   @see imp-33274-sigma-postpeak-later-window-decay-exponent (WINDOWED far-tail p_eff)
 *   @see imp-34142-window-anchor-centroid-viz-data.js (companion START-vs-CENTRE viz)
 *
 *   Ticket: imp-34078 (ux, medium). Presentation only, measurement/fit only;
 *   imp-3066 untouched; NO QED.
 */

// Two exponent estimators sampled every 2 decades over log10(N) in [10, 70]:
// p = pointwise p(N) (imp-33816); w = fixed 12-decade OLS window p_eff(N)
// anchored at its START (imp-33274). delta = w - p (imp-34006 F1: always > 0);
// deltaTimesLsq = delta * (log T0)^2, which imp-34006 F2 shows stays
// O(1)-bounded on the ladder tail (approaching the analytic S/4 ~ 6.9 for
// span S = 12 ln10, from below).
export const IMP34078_ESTIMATOR_CURVE = Object.freeze([
  { log10N: 10, p: 0.301070, w: 0.478086, delta: 1.7702e-1, deltaTimesLsq: 85.017 },
  { log10N: 12, p: 0.452645, w: 0.486484, delta: 3.3839e-2, deltaTimesLsq: 23.429 },
  { log10N: 14, p: 0.480955, w: 0.488633, delta: 7.6775e-3, deltaTimesLsq: 7.257 },
  { log10N: 16, p: 0.485861, w: 0.489778, delta: 3.9170e-3, deltaTimesLsq: 4.854 },
  { log10N: 18, p: 0.487693, w: 0.490659, delta: 2.9658e-3, deltaTimesLsq: 4.669 },
  { log10N: 20, p: 0.488943, w: 0.491394, delta: 2.4511e-3, deltaTimesLsq: 4.782 },
  { log10N: 22, p: 0.489946, w: 0.492021, delta: 2.0757e-3, deltaTimesLsq: 4.917 },
  { log10N: 24, p: 0.490781, w: 0.492563, delta: 1.7821e-3, deltaTimesLsq: 5.040 },
  { log10N: 26, p: 0.491490, w: 0.493036, delta: 1.5469e-3, deltaTimesLsq: 5.150 },
  { log10N: 28, p: 0.492098, w: 0.493453, delta: 1.3552e-3, deltaTimesLsq: 5.248 },
  { log10N: 30, p: 0.492626, w: 0.493823, delta: 1.1971e-3, deltaTimesLsq: 5.335 },
  { log10N: 32, p: 0.493088, w: 0.494153, delta: 1.0651e-3, deltaTimesLsq: 5.414 },
  { log10N: 34, p: 0.493496, w: 0.494450, delta: 9.5375e-4, deltaTimesLsq: 5.485 },
  { log10N: 36, p: 0.493859, w: 0.494718, delta: 8.5898e-4, deltaTimesLsq: 5.550 },
  { log10N: 38, p: 0.494184, w: 0.494961, delta: 7.7764e-4, deltaTimesLsq: 5.609 },
  { log10N: 40, p: 0.494476, w: 0.495183, delta: 7.0732e-4, deltaTimesLsq: 5.663 },
  { log10N: 42, p: 0.494740, w: 0.495387, delta: 6.4612e-4, deltaTimesLsq: 5.713 },
  { log10N: 44, p: 0.494981, w: 0.495573, delta: 5.9252e-4, deltaTimesLsq: 5.759 },
  { log10N: 46, p: 0.495200, w: 0.495746, delta: 5.4531e-4, deltaTimesLsq: 5.802 },
  { log10N: 48, p: 0.495402, w: 0.495905, delta: 5.0352e-4, deltaTimesLsq: 5.842 },
  { log10N: 50, p: 0.495587, w: 0.496053, delta: 4.6636e-4, deltaTimesLsq: 5.878 },
  { log10N: 52, p: 0.495758, w: 0.496191, delta: 4.3315e-4, deltaTimesLsq: 5.913 },
  { log10N: 54, p: 0.495916, w: 0.496319, delta: 4.0337e-4, deltaTimesLsq: 5.945 },
  { log10N: 56, p: 0.496063, w: 0.496439, delta: 3.7655e-4, deltaTimesLsq: 5.975 },
  { log10N: 58, p: 0.496199, w: 0.496552, delta: 3.5232e-4, deltaTimesLsq: 6.004 },
  { log10N: 60, p: 0.496327, w: 0.496657, delta: 3.3035e-4, deltaTimesLsq: 6.030 },
  { log10N: 62, p: 0.496446, w: 0.496757, delta: 3.1037e-4, deltaTimesLsq: 6.055 },
  { log10N: 64, p: 0.496558, w: 0.496850, delta: 2.9215e-4, deltaTimesLsq: 6.079 },
  { log10N: 66, p: 0.496663, w: 0.496939, delta: 2.7549e-4, deltaTimesLsq: 6.102 },
  { log10N: 68, p: 0.496762, w: 0.497022, delta: 2.6021e-4, deltaTimesLsq: 6.123 },
  { log10N: 70, p: 0.496855, w: 0.497101, delta: 2.4616e-4, deltaTimesLsq: 6.143 },
]);

// imp-34006 F3 within-1% (p >= 0.495) and within-0.1% (p >= 0.4995) crossings
// for both estimators, plus the window's lead over the pointwise in decades.
export const IMP34078_CROSSINGS = Object.freeze({
  within1pct: {
    threshold: 0.495,
    point_log10N: 44.17,
    window_start_log10N: 38.34,
    leadDecades: 5.83,
  },
  within0_1pct: {
    threshold: 0.4995,
    point_log10N: 436.06,
    window_start_log10N: 430.08,
    leadDecades: 5.98,
  },
});

// imp-34006 F2 reference: the analytic S/4 bound (S = 12 ln10) that
// delta * (log T0)^2 approaches from below as N grows.
export const IMP34078_SPAN_BOUND = Object.freeze({
  spanDecades: 12,
  analyticSOverFour: (12 * Math.LN10) / 4,
});

export const IMP34078_FAR_TAIL_ASYMPTOTE = Object.freeze({ p: 0.5, label: 'imp-3463 far-tail asymptote p -> 1/2' });
