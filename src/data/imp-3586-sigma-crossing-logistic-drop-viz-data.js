/**
 * @module imp-3586-sigma-crossing-logistic-drop-viz-data
 * @fileoverview imp-3586 -- lightweight, import-light literal data for a
 *   visualization of the imp-3556 post-peak conditional-share sigma(N)
 *   crossings: the six root-solved threshold crossings (sigma < 0.9, 0.75,
 *   0.5, 0.25, 0.1, 0.01) plotted against log10 N, alongside the logistic
 *   sigma-drop profile -d sigma / d log10 N which PEAKS at 0.2738/decade
 *   near the imp-3444 E_coll = E_trunc crossover (sigma ~ 0.4957) and is
 *   capped below the untrimmed logistic maximum ln(10)/8 = 0.28782.
 *
 *   Values below are baked reference literals reproduced from the
 *   imp-3556-sigma-threshold-crossings-rootsolve.js CROSSINGS / SPACING_LAW
 *   fields (root-solved to residual < 1e-9) and a re-sampling of the same
 *   dropPerDecade(N) central-difference formula on a 0.25-decade grid; this
 *   module does NOT re-run the root-solve or import the heavy sub-term
 *   chain, so importing it into a page costs nothing at load time.
 *
 *   @see imp-3556-sigma-threshold-crossings-rootsolve.js (the source measurement)
 *   @see imp-3529-sigma-postpeak-decay-exponent (post-peak decay context)
 *   @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover)
 *   @see imp-3565-sigma-postpeak-decay-exponent-viz-data.js (sibling viz pattern)
 *
 *   Ticket: imp-3586 (ux, medium). Presentation only, RH-equivalent; imp-3066
 *   untouched; NO QED.
 */

// Six root-solved post-peak crossings (residual < 1e-9 on the exact imp-3220
// sub-terms). log10N and sigma_below define the crossing points on the sigma(N) curve.
export const IMP3586_CROSSINGS = Object.freeze([
  { sigma_below: 0.9, N: 2.572361e7, log10N: 7.4103, p_local: 0.03913 },
  { sigma_below: 0.75, N: 3.171731e8, log10N: 8.5013, p_local: 0.11586 },
  { sigma_below: 0.5, N: 3.267235e9, log10N: 9.5142, p_local: 0.23783 },
  { sigma_below: 0.25, N: 3.259387e10, log10N: 10.5131, p_local: 0.35932 },
  { sigma_below: 0.1, N: 3.213181e11, log10N: 11.5069, p_local: 0.4329 },
  { sigma_below: 0.01, N: 4.624381e13, log10N: 13.6651, p_local: 0.47909 },
]);

// Logistic sigma-drop profile -d sigma / d log10 N, sampled every 0.25 decade
// from the imp-3556 dropPerDecade(N) central-difference formula, spanning the
// full crossing band (log10N 7.0 .. 14.5). sigma(N) is included on the same
// grid so the sigma(N) curve chart can reuse this one table.
export const IMP3586_DROP_PROFILE = Object.freeze([
  { log10N: 7.0, sigma: 0.926562, drop: 0.04975 },
  { log10N: 7.25, sigma: 0.911923, drop: 0.06786 },
  { log10N: 7.5, sigma: 0.892373, drop: 0.08908 },
  { log10N: 7.75, sigma: 0.867116, drop: 0.1135 },
  { log10N: 8.0, sigma: 0.835378, drop: 0.14082 },
  { log10N: 8.25, sigma: 0.796534, drop: 0.17016 },
  { log10N: 8.5, sigma: 0.750259, drop: 0.19994 },
  { log10N: 8.75, sigma: 0.696716, drop: 0.22788 },
  { log10N: 9.0, sigma: 0.636702, drop: 0.25123 },
  { log10N: 9.25, sigma: 0.571716, drop: 0.26722 },
  { log10N: 9.5, sigma: 0.503882, drop: 0.27375 },
  { log10N: 9.75, sigma: 0.435709, drop: 0.26992 },
  { log10N: 10.0, sigma: 0.369742, drop: 0.25632 },
  { log10N: 10.25, sigma: 0.308205, drop: 0.23489 },
  { log10N: 10.5, sigma: 0.252727, drop: 0.20832 },
  { log10N: 10.75, sigma: 0.204232, drop: 0.17948 },
  { log10N: 11.0, sigma: 0.162971, drop: 0.1508 },
  { log10N: 11.25, sigma: 0.128668, drop: 0.12406 },
  { log10N: 11.5, sigma: 0.100693, drop: 0.10029 },
  { log10N: 11.75, sigma: 0.078238, drop: 0.07994 },
  { log10N: 12.0, sigma: 0.06044, drop: 0.06299 },
  { log10N: 12.25, sigma: 0.046478, drop: 0.0492 },
  { log10N: 12.5, sigma: 0.035612, drop: 0.03815 },
  { log10N: 12.75, sigma: 0.027208, drop: 0.02942 },
  { log10N: 13.0, sigma: 0.020741, drop: 0.02259 },
  { log10N: 13.25, sigma: 0.015784, drop: 0.01729 },
  { log10N: 13.5, sigma: 0.011994, drop: 0.0132 },
  { log10N: 13.75, sigma: 0.009105, drop: 0.01006 },
  { log10N: 14.0, sigma: 0.006906, drop: 0.00765 },
  { log10N: 14.25, sigma: 0.005234, drop: 0.00581 },
  { log10N: 14.5, sigma: 0.003965, drop: 0.00441 },
]);

// The logistic bump peak: -d sigma/d log10 N maximises at ~0.2738/decade at
// sigma ~ 0.4957 (N ~ 3.39e9, log10N ~ 9.53), just past the E_coll = E_trunc
// crossover (N_x ~ 3.2803e9, log10N ~ 9.516) where the exact sigma=1/2
// crossing sits (N ~ 3.2672e9, log10N ~ 9.5142).
export const IMP3586_PEAK = Object.freeze({
  log10N: 9.5301,
  drop: 0.27384,
  sigma: 0.4957,
});

// Untrimmed logistic cap: (ln10/2) sigma(1-sigma) maximised at sigma=1/2 gives
// ln10/8, an upper bound the measured peak sits just under (drift from the
// slow log T0(N) term).
export const IMP3586_LOGISTIC_CAP = Math.log(10) / 8; // 0.28782

export const IMP3586_CROSSOVER = Object.freeze({
  N_ecoll_eq_etrunc: 3.280294e9,
  log10N_ecoll_eq_etrunc: 9.5159,
  N_sigma_half: 3.267235e9,
  log10N_sigma_half: 9.5142,
});
