/**
 * @module imp-95606-sigma-postpeak-fine-exponent-ramp-viz-data
 * @fileoverview imp-95606 -- lightweight, import-light literal data for a visualization of the
 *   imp-95582 half-decade pointwise sigma(N) = E_coll/E(N) decay-exponent ramp p(N) =
 *   -d ln sigma / d ln N across N in [1e6,1e12] (13 points, 2/decade), plus the whole-decade
 *   OLS midpoint-sampling cross-check (imp-33582) and the E_coll = E_trunc transition landmark
 *   (imp-3444, log10 N ~ 9.51591) that sits just below the imp-34694 ramp-acceleration knee.
 *
 *   All values below are a one-off bake of the imp-95582 FINE_GRID / transition outputs
 *   (@see imp-95582-sigma-postpeak-fine-exponent-ramp.js) -- this file does not import that
 *   module or its lambda-rh-height-mapping.js / polymath15-constant-C-C.js dependency chain,
 *   so it costs nothing extra to import at page load.
 *
 *   Ticket: imp-95606 (content, medium). Presentation data only; measurement/fit, NOT an RH
 *   bound; no QED; Platt-Trudgian Lambda <= 0.2 remains SOTA.
 */

// p_local(N) = -d ln sigma / d ln N on the half-decade grid log10(N) = 6..12 step 0.5 (13 pts).
export const IMP95606_FINE_GRID = Object.freeze([
  { log10N: 6, p_local: 0.0006, sigma: 0.9494 },
  { log10N: 6.5, p_local: 0.0099, sigma: 0.944 },
  { log10N: 7, p_local: 0.0233, sigma: 0.9266 },
  { log10N: 7.5, p_local: 0.0434, sigma: 0.8924 },
  { log10N: 8, p_local: 0.0732, sigma: 0.8354 },
  { log10N: 8.5, p_local: 0.1157, sigma: 0.7503 },
  { log10N: 9, p_local: 0.1714, sigma: 0.6367 },
  { log10N: 9.5, p_local: 0.2359, sigma: 0.5039 },
  { log10N: 10, p_local: 0.3011, sigma: 0.3697 },
  { log10N: 10.5, p_local: 0.358, sigma: 0.2527 },
  { log10N: 11, p_local: 0.4019, sigma: 0.163 },
  { log10N: 11.5, p_local: 0.4326, sigma: 0.1007 },
  { log10N: 12, p_local: 0.4526, sigma: 0.0604 },
]);

// Whole-decade OLS exponent (imp-33582) vs the pointwise value at the decade midpoint: the
// coarse six-number ladder is unbiased midpoint sampling of the fine ramp, worst gap ~5.45%.
export const IMP95606_MIDPOINT_BRIDGE = Object.freeze([
  { decade: '1e6->1e7', p_pointwise_at_midpoint: 0.0099, p_ols_whole_decade: 0.0105, relDiff: 0.0545 },
  { decade: '1e7->1e8', p_pointwise_at_midpoint: 0.0434, p_ols_whole_decade: 0.0447, relDiff: 0.0311 },
  { decade: '1e8->1e9', p_pointwise_at_midpoint: 0.1157, p_ols_whole_decade: 0.1176, relDiff: 0.016 },
  { decade: '1e9->1e10', p_pointwise_at_midpoint: 0.2359, p_ols_whole_decade: 0.236, relDiff: 0.0003 },
  { decade: '1e10->1e11', p_pointwise_at_midpoint: 0.358, p_ols_whole_decade: 0.3561, relDiff: 0.0053 },
  { decade: '1e11->1e12', p_pointwise_at_midpoint: 0.4326, p_ols_whole_decade: 0.431, relDiff: 0.0035 },
]);

// E_coll = E_trunc transition (r = 1, sigma ~ 1/2): matches the imp-3444 crossover exactly,
// carries pointwise exponent p ~ 0.238, sits ~0.013 decade below the imp-34694 ramp knee.
export const IMP95606_TRANSITION = Object.freeze({
  N_transition: 3280300000,
  log10N_transition: 9.51591,
  p_at_transition: 0.23806,
  sigma_at_transition: 0.49953,
  ratio_vs_imp3444: 1,
  imp34694_knee_log10: 9.52903,
  decadesBelowKnee: 0.01312,
});

export const IMP95606_FAR_TAIL_EXPONENT = 0.5; // imp-3463 asymptote the ramp climbs toward
