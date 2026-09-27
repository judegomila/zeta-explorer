/**
 * @module imp-97847-sigma-decay-exponent-sigmoid-knee-viz-data
 * @fileoverview imp-97847 -- lightweight, import-light literal data for a
 *   visualization of the imp-33582 six-decade sigma(N) post-peak local
 *   decay-exponent ladder (p_local ramping from ~0.0105 at [1e6,1e7] toward
 *   the imp-3463 far-tail 1/2 asymptote) overlaid with the imp-33701 ramp
 *   curvature: the discrete first difference (ramp velocity) and the single
 *   sign change of the second difference that marks the sigmoid knee in the
 *   [1e10,1e11] decade.
 *
 *   Values below are baked reference literals reproduced from
 *   imp-33582-sigma-postpeak-nearpeak-threshold-decay.js `perDecadeLadder`
 *   and imp-33701-sigma-postpeak-ramp-curvature-inflection.js `rampVelocity`
 *   / `rampAcceleration` / `inflectionDecade` fields; this module does NOT
 *   re-run either computation, so importing it into a page costs nothing at
 *   load time.
 *
 *   @see imp-33582-sigma-postpeak-nearpeak-threshold-decay.js (the six-decade exponent ladder)
 *   @see imp-33701-sigma-postpeak-ramp-curvature-inflection.js (the ramp curvature / knee)
 *   @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 *
 *   Ticket: imp-97847 (ux, low). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

// Per-decade local decay exponent ladder, k = 6..11 (imp-33582 perDecadeLadder).
export const IMP97847_EXPONENT_LADDER = Object.freeze([
  { decade: '1e6->1e7', p_local: 0.0105 },
  { decade: '1e7->1e8', p_local: 0.0447 },
  { decade: '1e8->1e9', p_local: 0.1176 },
  { decade: '1e9->1e10', p_local: 0.236 },
  { decade: '1e10->1e11', p_local: 0.3561 },
  { decade: '1e11->1e12', p_local: 0.431 },
]);

export const IMP97847_FAR_TAIL_ASYMPTOTE = 0.5; // imp-3463 far-tail 1/2

// Ramp velocity D1(k) = p(k+1) - p(k), k = 6..10 (imp-33701 rampVelocity).
export const IMP97847_RAMP_VELOCITY = Object.freeze([
  { step: '1e6->1e7 to 1e7->1e8', d1: 0.0343 },
  { step: '1e7->1e8 to 1e8->1e9', d1: 0.0729 },
  { step: '1e8->1e9 to 1e9->1e10', d1: 0.1184 },
  { step: '1e9->1e10 to 1e10->1e11', d1: 0.1201 },
  { step: '1e10->1e11 to 1e11->1e12', d1: 0.0749 },
]);

// Ramp acceleration D2(k) = D1(k) - D1(k-1), k = 7..10 (imp-33701 rampAcceleration).
// Sign flips exactly once (+ -> -), marking the sigmoid knee.
export const IMP97847_RAMP_ACCELERATION = Object.freeze([
  { decade: '1e7->1e8', d2: 0.0386 },
  { decade: '1e8->1e9', d2: 0.0455 },
  { decade: '1e9->1e10', d2: 0.0017 },
  { decade: '1e10->1e11', d2: -0.0452 },
]);

// The single D2 sign change: the sigmoid knee (imp-33701 inflectionDecade).
export const IMP97847_KNEE_DECADE = '1e10->1e11';
export const IMP97847_STEEPEST_STEP = '1e9->1e10 to 1e10->1e11';
