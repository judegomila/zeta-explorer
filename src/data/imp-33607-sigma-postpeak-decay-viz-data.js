/**
 * @module imp-33607-sigma-postpeak-decay-viz-data
 * @fileoverview imp-33607 -- lightweight, import-light literal data for a
 *   visualization of the imp-33582 sigma(N) = E_coll/E post-peak decay past
 *   the 10^6 PATH-1 ceiling: the interior peak (N ~ 9.22e5, sigma_max ~
 *   0.9494), the three named threshold crossings (sigma < 0.9 at N ~
 *   2.57e7, sigma < 0.5 at N ~ 3.27e9, sigma < 0.1 at N ~ 3.21e11), and the
 *   imp-3444 E_coll = E_trunc crossover (N ~ 3.280e9) marked alongside the
 *   sigma = 1/2 threshold it nearly coincides with.
 *
 *   Values below are baked reference literals reproduced from
 *   imp-33582-sigma-postpeak-nearpeak-threshold-decay.js `peak` /
 *   `perDecadeLadder` / `thresholdCrossings` fields; this module does NOT
 *   re-run that computation, so importing it into a page costs nothing at
 *   load time.
 *
 *   @see imp-33582-sigma-postpeak-nearpeak-threshold-decay.js (the source measurement)
 *   @see imp-3406-sigma-highN-extrapolation (interior maximum N ~ 9.22e5)
 *   @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover)
 *
 *   Ticket: imp-33607 (ux, medium). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

// Post-peak curve: N and the conditional share sigma(N), one point per
// decade boundary from the imp-33582 per-decade ladder (plus the peak).
export const IMP33607_SIGMA_CURVE = Object.freeze([
  { N: 9.218633e5, sigma: 0.949429 },
  { N: 1e6, sigma: 0.949408 },
  { N: 1e7, sigma: 0.9266 },
  { N: 1e8, sigma: 0.8354 },
  { N: 1e9, sigma: 0.6367 },
  { N: 1e10, sigma: 0.3697 },
  { N: 1e11, sigma: 0.163 },
  { N: 1e12, sigma: 0.0604 },
]);

export const IMP33607_PEAK = Object.freeze({ N_peak: 9.218633e5, sigma_max: 0.949429 });

export const IMP33607_THRESHOLDS = Object.freeze([
  { label: 'sigma < 0.9', N: 2.5724e7, sigma: 0.9 },
  { label: 'sigma < 0.5', N: 3.2672e9, sigma: 0.5 },
  { label: 'sigma < 0.1', N: 3.2132e11, sigma: 0.1 },
]);

// imp-3444 E_coll = E_trunc crossover -- lands within ~0.4% of the sigma=0.5 threshold.
export const IMP33607_CROSSOVER = Object.freeze({ N: 3.280294352e9, sigma: 0.5 });
