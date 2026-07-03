/**
 * @module imp-3565-sigma-postpeak-decay-exponent-viz-data
 * @fileoverview imp-3565 -- lightweight, import-light literal data for a
 *   visualization of the imp-3529 post-peak local decay exponent
 *   p(N) = -d ln sigma / d ln N, climbing from ~0 at the imp-3406 interior
 *   maximum (N_max ~ 9.22e5) toward the imp-3463 far-tail asymptote 1/2,
 *   with the imp-3444 E_coll = E_trunc crossover (sigma = 1/2, N ~ 3.27e9)
 *   marked as the decay's inflection point (p ~ 0.238).
 *
 *   Values below are baked reference literals reproduced from the
 *   imp-3529-sigma-postpeak-decay-exponent.js `decayLadder` / `thresholds` /
 *   `farTailExponent` / `peak` / `N_crossover` fields; this module does NOT
 *   re-run that computation, so importing it into a page costs nothing at
 *   load time.
 *
 *   @see imp-3529-sigma-postpeak-decay-exponent.js (the source measurement)
 *   @see imp-3406-sigma-highN-extrapolation (interior maximum N ~ 9.22e5)
 *   @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2)
 *   @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover)
 *
 *   Ticket: imp-3565 (ux, medium). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

// Post-peak ladder: N, conditional share sigma(N), and the local decay
// exponent p(N) = -d ln sigma / d ln N (central difference in ln N).
export const IMP3565_DECAY_LADDER = Object.freeze([
  { N: 9.22e5, sigma: 0.949429, p_local: 0.0 },
  { N: 1e6, sigma: 0.949408, p_local: 0.00056 },
  { N: 1e7, sigma: 0.926562, p_local: 0.02332 },
  { N: 1e8, sigma: 0.835378, p_local: 0.07321 },
  { N: 1e9, sigma: 0.636702, p_local: 0.17136 },
  { N: 3.280294352e9, sigma: 0.499536, p_local: 0.23805 },
  { N: 1e10, sigma: 0.369742, p_local: 0.30107 },
  { N: 1e11, sigma: 0.162971, p_local: 0.40186 },
  { N: 1e12, sigma: 0.06044, p_local: 0.45264 },
  { N: 1e13, sigma: 0.020741, p_local: 0.47311 },
]);

// Far-tail exponent, approaching 1/2 from below.
export const IMP3565_FAR_TAIL = Object.freeze([
  { N: 1e13, p_local: 0.47311 },
  { N: 1e15, p_local: 0.4842 },
  { N: 1e20, p_local: 0.4889 },
  { N: 1e50, p_local: 0.4956 },
]);

// Threshold crossings above the peak: N at which sigma first falls below level.
export const IMP3565_THRESHOLDS = Object.freeze([
  { sigma_below: 0.9, N: 2.57e7, p_local: 0.0357 },
  { sigma_below: 0.75, N: 3.17e8, p_local: 0.1082 },
  { sigma_below: 0.5, N: 3.27e9, p_local: 0.238 },
  { sigma_below: 0.25, N: 3.26e10, p_local: 0.3521 },
  { sigma_below: 0.1, N: 3.21e11, p_local: 0.4245 },
  { sigma_below: 0.01, N: 4.62e13, p_local: 0.4744 },
]);

export const IMP3565_PEAK = Object.freeze({ N_max: 9.219e5, sigma_max: 0.949429 });
export const IMP3565_N_CROSSOVER = 3.280294352e9;
export const IMP3565_ASYMPTOTIC_EXPONENT = 0.5;
