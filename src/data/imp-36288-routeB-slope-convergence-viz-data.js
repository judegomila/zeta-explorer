/**
 * @module imp-36288-routeB-slope-convergence-viz-data
 *
 * imp-36288 (content, low): import-light (baked-literal) viz-data module for a routed page
 * charting the imp-36082 Route-B per-N rate r_B(N) = C_prime sqrt(log gamma_N) N^{-1/4} local
 * log-log slope converging to the -1/4 leading exponent FROM ABOVE as N grows across a wide
 * ladder (N = 1e2 .. 1e300), making the imp-36151 slope-convergence witness a chart.
 *
 * All numbers below are baked copies of r_B(N) evaluated on the imp-36082/imp-36151 machinery
 * (identical RvM inversion + rate formula) -- no re-derivation, no new numerics. The slowly-varying
 * sqrt(log gamma_N) dressing drags the finite-window local slope above -1/4; the ladder witnesses
 * it monotonically tightening toward the limit, never crossing it.
 *
 * NOT A BOUND. Presentation only; carries no RH verdict; changes no bound; the imp-36082
 * CONSUMABLE-MODULO-ANCHOR status and imp-36151 readiness-vs-exponent resolution are untouched.
 * No refereed bound is changed.
 *
 * @see imp-36082-routeB-perN-rate-form-and-bridge-consumability.js (source rate r_B(N))
 * @see imp-36151-routeC-vs-routeB-perN-exponent-comparison.js (slope-convergence witness this charts)
 */

// r_B(N) leading exponent (pinned, imp-36082/imp-36151).
export const ROUTE_B_LEADING_EXPONENT = -0.25;

// r_B(N) evaluated at each rung, baked from the imp-36082/imp-36151 RvM + rate machinery.
export const RATE_LADDER = [
  { log10N: 2, N: 1e2, r_N: 1.4346152999363273 },
  { log10N: 6, N: 1e6, r_N: 0.22366614228904477 },
  { log10N: 10, N: 1e10, r_N: 0.028705398224403614 },
  { log10N: 20, N: 1e20, r_N: 0.0001288677965642717 },
  { log10N: 40, N: 1e40, r_N: 1.8342240013937186e-9 },
  { log10N: 60, N: 1e60, r_N: 2.2538828907196993e-14 },
  { log10N: 100, N: 1e100, r_N: 2.9194590751729965e-24 },
  { log10N: 150, N: 1e150, r_N: 1.1329818351115206e-36 },
  { log10N: 200, N: 1e200, r_N: 4.1417738455919084e-49 },
  { log10N: 250, N: 1e250, r_N: 1.4654211436982405e-61 },
  { log10N: 300, N: 1e300, r_N: 5.079021463728532e-74 },
];

// Local log-log slope between consecutive ladder rungs -- monotonically tightening toward -1/4
// FROM ABOVE, never crossing it (witnessed here on a much wider window than imp-36151's two-point
// SLOPE_MID/SLOPE_FAR check).
export const SLOPE_LADDER = [
  { window: '[1e2, 1e6]', slope: -0.2017838027353519 },
  { window: '[1e6, 1e10]', slope: -0.22290916778342418 },
  { window: '[1e10, 1e20]', slope: -0.23478191732960269 },
  { window: '[1e20, 1e40]', slope: -0.24233460154032194 },
  { window: '[1e40, 1e60]', slope: -0.24552605125969656 },
  { window: '[1e60, 1e100]', slope: -0.24719072387798943 },
  { window: '[1e100, 1e150]', slope: -0.2482215888951257 },
  { window: '[1e150, 1e200]', slope: -0.24874073131302668 },
  { window: '[1e200, 1e250]', slope: -0.24902447855754573 },
  { window: '[1e250, 1e300]', slope: -0.24920364810569828 },
];

export const IMP36288_ROUTEB_SLOPE_CONVERGENCE_VIZ_DATA = {
  id: 'imp-36288',
  leadingExponent: ROUTE_B_LEADING_EXPONENT,
  rateLadder: RATE_LADDER,
  slopeLadder: SLOPE_LADDER,
  convergesFromAbove: true,
  isRigorous: false,
};
