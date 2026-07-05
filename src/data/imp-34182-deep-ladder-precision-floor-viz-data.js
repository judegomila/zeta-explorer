/**
 * @module imp-34182-deep-ladder-precision-floor-viz-data
 * @fileoverview imp-34182 -- lightweight, import-light literal data for a
 *   visualization of the imp-34106 doubling-map phase-realignment DEEP
 *   ladder (dyadic steps 1/32768 .. 1/2^20): the closed-form Bernoulli
 *   doubling-map schedule keeps predicting the frozen-gap descent/freeze
 *   pattern through 1/262144, then DEPARTS at 1/524288 (e = 19), where the
 *   predicted descent fails to materialize (max relative deviation ~0.535).
 *   imp-34106 (E3) diagnoses the departure as the precision floor of the
 *   stored 6-significant-figure continuum argmax k*, not a property of the
 *   underlying continuum problem.
 *
 *   Values below are baked reference literals reproduced by re-evaluating
 *   the imp-34106-sawtooth-phase-realignment-deep-ladder.js `rungFor` /
 *   `TRANSITIONS` outputs (identical inherited imp-3220/imp-3406/imp-33810/
 *   imp-33878 sub-terms); this module does NOT re-run that computation or
 *   import the heavy zeros bundle, so importing it into a page costs
 *   nothing at load time.
 *
 *   @see imp-34106-sawtooth-phase-realignment-deep-ladder.js (the source measurement)
 *   @see imp-34044-sawtooth-phase-realignment-schedule.js (the shallow 1/128..1/32768 schedule)
 *   @see imp-33983-sawtooth-residue-finer-grid-verification.js (the frozen gap origin)
 *   @see imp-33878-hump-argmax-grid-refinement.js (source of the stored k*)
 *
 *   Ticket: imp-34182 (ux, low). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

// Deep dyadic ladder rungs e = 15 .. 20 (steps 1/32768 .. 1/2^20). gap =
// |argmaxK - k*| against the stored k* ~ 8.821092; frac is the doubling-map
// phase frac(2^e (k* - 6)); inReflectionBand (1/4, 3/4) predicts a descent
// at the NEXT rung.
export const IMP34182_DEEP_LADDER_RUNGS = Object.freeze([
  { exponent: 15, step: 3.0518e-5, argmaxK: 8.821105957, gap: 1.3957e-5, frac: 0.542656, inReflectionBand: true, sawtoothPredicted: 1.3957e-5, relDeviation: 2.239e-6, matches: true },
  { exponent: 16, step: 1.5259e-5, argmaxK: 8.8210906982, gap: 1.3018e-6, frac: 0.085312, inReflectionBand: false, sawtoothPredicted: 1.3018e-6, relDeviation: 3.2406e-5, matches: true },
  { exponent: 17, step: 7.6294e-6, argmaxK: 8.8210906982, gap: 1.3018e-6, frac: 0.170624, inReflectionBand: false, sawtoothPredicted: 1.3018e-6, relDeviation: 3.2406e-5, matches: true },
  { exponent: 18, step: 3.8147e-6, argmaxK: 8.8210906982, gap: 1.3018e-6, frac: 0.341248, inReflectionBand: true, sawtoothPredicted: 1.3018e-6, relDeviation: 3.2406e-5, matches: true },
  { exponent: 19, step: 1.9073e-6, argmaxK: 8.8210906982, gap: 1.3018e-6, frac: 0.682496, inReflectionBand: true, sawtoothPredicted: 6.0559e-7, relDeviation: 0.53481, matches: false },
  { exponent: 20, step: 9.5367e-7, argmaxK: 8.8210916519, gap: 3.481e-7, frac: 0.364992, inReflectionBand: true, sawtoothPredicted: 3.4808e-7, relDeviation: 4.7412e-5, matches: true },
]);

// Per-transition classification: whether the frozen gap REALIGNED (dropped)
// at the next rung, and whether the doubling-map rule (descent IFF the
// previous frac lands in the reflection band) predicted that transition
// correctly. e=19 is the sole miss: predicted descent, observed freeze.
export const IMP34182_TRANSITIONS = Object.freeze([
  { fromExponent: 15, toExponent: 16, realigned: true, predictedByPrevPhase: true, rulePredictionCorrect: true },
  { fromExponent: 16, toExponent: 17, realigned: false, predictedByPrevPhase: false, rulePredictionCorrect: true },
  { fromExponent: 17, toExponent: 18, realigned: false, predictedByPrevPhase: false, rulePredictionCorrect: true },
  { fromExponent: 18, toExponent: 19, realigned: false, predictedByPrevPhase: true, rulePredictionCorrect: false },
  { fromExponent: 19, toExponent: 20, realigned: true, predictedByPrevPhase: true, rulePredictionCorrect: true },
]);

export const IMP34182_PRECISION_FLOOR = Object.freeze({
  storedKStar: 8.821092,
  trueContinuumPeak: 8.8210915879,
  roundingOffset: 4.1214e-7,
  firstGridSplitExponent: 19,
  firstDepartureExponent: 19,
  maxRelDeviation: 0.53481,
  maxRelDeviationExponent: 19,
  validThroughStep: '1/262144',
  departsAtStep: '1/524288',
});
