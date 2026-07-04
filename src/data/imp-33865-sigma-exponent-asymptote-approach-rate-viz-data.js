/**
 * @module imp-33865-sigma-exponent-asymptote-approach-rate-viz-data
 * @fileoverview imp-33865 -- lightweight, import-light literal data for a
 *   visualization of the imp-33816 sigma(N) post-peak LOCAL decay exponent
 *   p(N) = -d ln sigma / d ln N climbing from near 0 at N ~ 1e6 through the
 *   imp-33620 1e15 tail and on toward the imp-3463 far-tail 1/2 asymptote,
 *   with the logarithmically-slow within-1%-of-1/2 crossing (N ~ 1e44,
 *   log T0 ~ 99) annotated.
 *
 *   Values below are baked reference literals reproduced by re-evaluating
 *   the imp-33816-sigma-exponent-asymptote-approach-rate.js `pLocalAtLog10` /
 *   `crossLog10` formulas (identical inherited imp-3220/imp-3406/imp-33582
 *   sub-terms); this module does NOT re-run that computation or import the
 *   heavy zeros bundle, so importing it into a page costs nothing at load
 *   time.
 *
 *   @see imp-33816-sigma-exponent-asymptote-approach-rate.js (the source measurement)
 *   @see imp-33620-etrunc-ecoll-ladder-1e15-extension.js (the 1e15 tail rung)
 *   @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (per-decade ramp 0.0105 -> 0.4310)
 *   @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 *
 *   Ticket: imp-33865 (content, medium). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

// Pointwise local exponent p(N) = -d ln sigma / d ln N vs log10(N), one point
// per decade from N ~ 1e6 through the imp-33620 1e15 tail, then sparser
// decades out to the within-1% crossing near N ~ 1e44.
export const IMP33865_EXPONENT_CURVE = Object.freeze([
  { log10N: 6, p_local: 0.000557, gapToHalf: 4.994e-1 },
  { log10N: 7, p_local: 0.023317, gapToHalf: 4.767e-1 },
  { log10N: 8, p_local: 0.073211, gapToHalf: 4.268e-1 },
  { log10N: 9, p_local: 0.171363, gapToHalf: 3.286e-1 },
  { log10N: 10, p_local: 0.301070, gapToHalf: 1.989e-1 },
  { log10N: 11, p_local: 0.401862, gapToHalf: 9.814e-2 },
  { log10N: 12, p_local: 0.452645, gapToHalf: 4.736e-2 },
  { log10N: 13, p_local: 0.473106, gapToHalf: 2.689e-2 },
  { log10N: 14, p_local: 0.480955, gapToHalf: 1.904e-2 },
  { log10N: 15, p_local: 0.484220, gapToHalf: 1.578e-2 },
  { log10N: 18, p_local: 0.487693, gapToHalf: 1.231e-2 },
  { log10N: 20, p_local: 0.488943, gapToHalf: 1.106e-2 },
  { log10N: 25, p_local: 0.491149, gapToHalf: 8.851e-3 },
  { log10N: 30, p_local: 0.492626, gapToHalf: 7.374e-3 },
  { log10N: 35, p_local: 0.493682, gapToHalf: 6.318e-3 },
  { log10N: 40, p_local: 0.494476, gapToHalf: 5.524e-3 },
  { log10N: 44, p_local: 0.494981, gapToHalf: 5.019e-3 },
]);

export const IMP33865_FAR_TAIL_ASYMPTOTE = Object.freeze({ p: 0.5, label: 'imp-3463 far-tail asymptote p -> 1/2' });

// imp-33816 within-1% crossing: p first reaches 0.495 at N ~ 1e44.167 (log T0 ~ 99).
export const IMP33865_WITHIN_1PCT_CROSSING = Object.freeze({
  log10N: 44.167,
  p_local: 0.495,
  logT0: 99,
  decadesPast1e12: 32.2,
  label: 'within 1% of 1/2 (p >= 0.495)',
});

// imp-33620 tail rung this curve extends through.
export const IMP33865_1E15_TAIL_MARK = Object.freeze({ log10N: 15, label: 'imp-33620 1e15 tail rung' });
