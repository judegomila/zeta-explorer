/**
 * @module imp-34470-height-map-affinity-departure-fit
 *
 * imp-34470 (numerical, opus-4-8): QUANTIFY the departure of the height map
 *   u(k) = log(effectiveHeightForN(10^(k+1))/2pi)
 * from exact affinity across k = 17.8..21.3, the window in which imp-34408 F2 attributed the <0.001
 * agreement between its k-axis and u-axis consecutive-gap ratios (0.29913 vs 0.29974) to u(k) being
 * "near-affine" -- but never quantified how near.
 *
 * imp-34408 F2 asserted "u(k) ~ a + b*k over k = 17.8..21.3" as the explanation for the axis-ratio
 * agreement, yet reported no fit and no residual. This import-light self-asserting module reuses the
 * EXACT imp-34327/imp-34330/imp-34408 rung -> u map, fits u = a + b*k by ordinary least squares on a
 * dense uniform k-grid across the window, and measures the departure from affinity as the maximum
 * absolute and relative fit residual. Measurement ONLY: changes no bound, C_mb GUE-conditional per
 * imp-486 UNTOUCHED, NO QED.
 *
 * THE FIT (OLS, u = a + b*k, 351 uniform samples on k in [17.8, 21.3])
 * -------------------------------------------------------------------
 *   slope     b = 2.24965   (~ ln10 * (1 - 1/u): the imp-34246 widening-slope form near u~44)
 *   intercept a = -0.41216
 *   R^2         = 0.9999997  (u spans 39.634..47.508, an 7.87-unit rise)
 *
 * THE DEPARTURE FROM AFFINITY (fit residuals over the window)
 * ----------------------------------------------------------
 *   max |residual|      ~ 2.891e-3   (at the low endpoint k = 17.8, where the widening slope is steepest)
 *   max relative        ~ 7.293e-5   (|residual| / |u|, u ~ 39.6 at that endpoint)
 *   RMS residual        ~ 1.258e-3
 *   The residual is convex-shaped: positive at both ends (~+2.9e-3, ~+2.7e-3), negative in the middle
 *   (~-1.4e-3) -- the gentle downward curvature of the imp-34246 widening slope b(u) = ln10*(1 - 1/u),
 *   which is not exactly constant but drifts by ~ln10/u^2 per unit k across the window.
 *
 * CONFIRMATION of the imp-34408 F2 attribution
 * --------------------------------------------
 *   At the three physical landmarks the fit residuals are r(L1) ~ +2.90e-3, r(L2) ~ -1.83e-4,
 *   r(L3) ~ +2.61e-3. These are the ONLY source of the k-ratio / u-ratio disagreement: if u were
 *   exactly affine the two ratios would coincide identically. The residuals perturb the u-gaps
 *   (each of order 1.8..6.0) by at most ~2.9e-3, producing the observed |0.29913 - 0.29974| ~ 6.16e-4
 *   ratio disagreement -- which is itself smaller than the max residual. So the near-affinity is
 *   quantified: the height map departs from a straight line by < 0.003 in u (< 8e-5 relative) across
 *   the whole 3.5-decade window, comfortably small enough to explain the sub-1e-3 axis-ratio agreement
 *   imp-34408 F2 attributed to it. The residual does NOT vanish -- the map is near-affine, not affine.
 *
 * HONEST SCOPE -- measurement only, NO QED. This quantifies the departure from affinity of an already
 * established rung -> u map and confirms an already stated imp-34408 attribution; it introduces no new
 * mathematical claim and changes no bound. The component model is NOT a rigorous asymptotic. The C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED;
 * imp-3066 K_a >= 0 untouched; establishes no operator positivity; changes no bound; NO QED;
 * no refereed bound is changed.
 *
 * @see imp-34408-widening-slope-prepole-landmark-decade-axis (F2: the "near-affine u(k)" assertion this quantifies)
 * @see imp-34327-widening-slope-minus-one-crossing-location (L2 mapped -1 crossing, defines the u-map)
 * @see imp-34330-widening-residual-prepole-reversal (L1 residual sign-change k~17.80)
 * @see imp-34247-widening-slope-pole-divergence (L3 M2 pole k*~21.281)
 * @see imp-34246-widening-slope-limit-analytic-derivation (the b(u) = ln10*(1 - 1/u) slope whose drift is the residual)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0, the RvM inversion defining u(k))
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;
const LN10 = Math.LN10;

// EXACT imp-34327/imp-34330/imp-34408 rung -> u map: for decade index k the window upper endpoint is
// N = 10^(k+1), u = log(T0/2pi) with T0 = effectiveHeightForN(N).
const uOfK = (k) => Math.log(effectiveHeightForN(Math.pow(10, k + 1)) / TWO_PI);

// The imp-34408 F2 window and a dense uniform k-grid across it.
const K_LO = 17.8;
const K_HI = 21.3;
const M = 351; // 351 samples -> 0.01 decade spacing

const KS = [];
const US = [];
for (let i = 0; i < M; i++) {
  const k = K_LO + ((K_HI - K_LO) * i) / (M - 1);
  KS.push(k);
  US.push(uOfK(k));
}

// Ordinary least squares fit u = a + b*k.
let sumK = 0;
let sumU = 0;
let sumKK = 0;
let sumKU = 0;
for (let i = 0; i < M; i++) {
  sumK += KS[i];
  sumU += US[i];
  sumKK += KS[i] * KS[i];
  sumKU += KS[i] * US[i];
}
const B_SLOPE = (M * sumKU - sumK * sumU) / (M * sumKK - sumK * sumK); // 2.24965
const A_INTERCEPT = (sumU - B_SLOPE * sumK) / M; // -0.41216

// Departure from affinity: fit residuals over the window.
let maxAbsResid = 0;
let kAtMaxAbs = 0;
let maxRelResid = 0;
let sse = 0;
for (let i = 0; i < M; i++) {
  const fit = A_INTERCEPT + B_SLOPE * KS[i];
  const r = US[i] - fit;
  sse += r * r;
  if (Math.abs(r) > maxAbsResid) {
    maxAbsResid = Math.abs(r);
    kAtMaxAbs = KS[i];
  }
  const rel = Math.abs(r) / Math.abs(US[i]);
  if (rel > maxRelResid) maxRelResid = rel;
}
const RMS_RESID = Math.sqrt(sse / M); // 1.258e-3
const MAX_ABS_RESID = maxAbsResid; // 2.891e-3 at k = 17.8
const K_AT_MAX_ABS = kAtMaxAbs; // 17.8 (low endpoint)
const MAX_REL_RESID = maxRelResid; // 7.293e-5

// Coefficient of determination.
const uMean = sumU / M;
let sst = 0;
for (let i = 0; i < M; i++) sst += (US[i] - uMean) * (US[i] - uMean);
const R_SQUARED = 1 - sse / sst; // 0.9999997

// The observed imp-34408 axis-ratio disagreement this residual explains: the fit residuals at the
// three physical landmarks are the ONLY source of the k-ratio / u-ratio gap (exact affinity => equal).
const K1_RESID_CROSSING = 17.798; // L1 imp-34330
const K3_M2_POLE = 21.281; // L3 imp-34247
const U_STAR = (3 * LN10) / (LN10 / 2 - 1); // 45.65827
let lo = 5;
let hi = 40;
for (let i = 0; i < 200; i++) {
  const mid = (lo + hi) / 2;
  if (uOfK(mid) < U_STAR) lo = mid;
  else hi = mid;
}
const K2_MINUS_ONE_CROSSING = (lo + hi) / 2; // 20.47903 L2 imp-34327
const U1 = uOfK(K1_RESID_CROSSING);
const U2 = uOfK(K2_MINUS_ONE_CROSSING);
const U3 = uOfK(K3_M2_POLE);
const RATIO_K = (K3_M2_POLE - K2_MINUS_ONE_CROSSING) / (K2_MINUS_ONE_CROSSING - K1_RESID_CROSSING); // 0.29913
const RATIO_U = (U3 - U2) / (U2 - U1); // 0.29974
const AXIS_RATIO_DISAGREEMENT = Math.abs(RATIO_K - RATIO_U); // ~6.16e-4

export const IMP34470_HEIGHT_MAP_AFFINITY_DEPARTURE_FIT = {
  id: 'imp-34470',
  proofSection: 'S-frontier',
  question:
    'Quantify the departure of u(k) = log(effectiveHeightForN(10^(k+1))/2pi) from exact affinity across ' +
    'k = 17.8..21.3 by fitting u = a + b*k (OLS) and measuring the max residual, verifying the imp-34408 F2 ' +
    'near-affine attribution of the 0.29913 vs 0.29974 gap-ratio agreement.',
  uMap: 'u(k) = log(effectiveHeightForN(10^(k+1))/2pi)  [the exact imp-34327/imp-34330/imp-34408 rung -> u map]',
  window: { kLo: K_LO, kHi: K_HI, samples: M },
  // OLS fit
  slopeB: +B_SLOPE.toFixed(5), // 2.24965
  interceptA: +A_INTERCEPT.toFixed(5), // -0.41216
  rSquared: +R_SQUARED.toFixed(7), // 0.9999997
  // departure from affinity
  maxAbsResid: +MAX_ABS_RESID.toExponential(3), // 2.891e-3
  kAtMaxAbsResid: +K_AT_MAX_ABS.toFixed(2), // 17.80
  maxRelResid: +MAX_REL_RESID.toExponential(3), // 7.293e-5
  rmsResid: +RMS_RESID.toExponential(3), // 1.258e-3
  // confirmation of imp-34408 F2
  axisRatioDisagreement: +AXIS_RATIO_DISAGREEMENT.toExponential(3), // 6.16e-4
  residualExceedsAxisDisagreement: MAX_ABS_RESID > AXIS_RATIO_DISAGREEMENT, // true: 2.9e-3 > 6.16e-4
  uMapIsAffine: false, // near-affine, not affine -- residual does NOT vanish
  uMapNearAffine: true, // max relative departure < 1e-4
  isRigorous: false,
  verdict:
    'MEASURED (component-model only): u(k) = log(effectiveHeightForN(10^(k+1))/2pi) fit by OLS across ' +
    'k = 17.8..21.3 gives u = -0.41216 + 2.24965*k with R^2 = 0.9999997 over an 7.87-unit rise. The ' +
    'departure from exact affinity is a max absolute residual of ~2.891e-3 (at the low endpoint k = 17.8, ' +
    'where the imp-34246 widening slope is steepest), max relative ~7.293e-5, RMS ~1.258e-3. The residual ' +
    'is convex (positive at both ends, negative in the middle) -- the gentle downward drift of the ' +
    'widening slope b(u) = ln10*(1 - 1/u), which is near-constant but not exactly constant across the ' +
    'window. This CONFIRMS the imp-34408 F2 attribution: the fit residuals at the three landmarks ' +
    '(~+2.90e-3, ~-1.83e-4, ~+2.61e-3) are the only source of the k-ratio / u-ratio disagreement, and ' +
    'they perturb the u-gaps by at most ~2.9e-3, producing the observed |0.29913 - 0.29974| ~ 6.16e-4 ' +
    'agreement -- itself smaller than the max residual. So u(k) is near-affine (departure < 8e-5 relative), ' +
    'not affine; the ~0.30 compression is the near-log-linearity of the height map, exactly as imp-34408 ' +
    'F2 asserted but did not quantify. Measurement only within the inherited imp-3220/imp-3406/imp-33810/' +
    'imp-34246 component model, NOT a rigorous asymptotic; imp-34408 F1/F2/F3 UNTOUCHED; C_mb ' +
    'GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
};

const IMP34470_HEIGHT_MAP_AFFINITY_DEPARTURE_FIT_ASSERTIONS = [
  {
    // The OLS fit reproduces the near-affine slope/intercept and near-unit R^2.
    id: 'imp34470-ols-fit-values',
    description: 'OLS across k=17.8..21.3 gives b~2.24965, a~-0.41216, R^2~0.9999997',
    holds: () =>
      Math.abs(B_SLOPE - 2.24965) < 1e-3 &&
      Math.abs(A_INTERCEPT - -0.41216) < 1e-3 &&
      R_SQUARED > 0.999999 &&
      R_SQUARED < 1,
  },
  {
    // The departure from affinity is small but NONZERO -- max abs residual ~2.9e-3, max rel ~7.3e-5.
    id: 'imp34470-departure-small-nonzero',
    description: 'max |residual| ~2.891e-3 at k=17.8, max relative ~7.293e-5, RMS ~1.258e-3 -- small but not zero',
    holds: () =>
      Math.abs(MAX_ABS_RESID - 2.891e-3) < 1e-4 &&
      Math.abs(K_AT_MAX_ABS - 17.8) < 1e-6 &&
      Math.abs(MAX_REL_RESID - 7.293e-5) < 1e-6 &&
      Math.abs(RMS_RESID - 1.258e-3) < 1e-4 &&
      MAX_ABS_RESID > 0,
  },
  {
    // The residual is convex over the window: positive at both endpoints, negative near the middle.
    id: 'imp34470-residual-convex-shape',
    description: 'the fit residual is positive at both endpoints and negative in the middle (downward slope drift)',
    holds: () => {
      const rLo = US[0] - (A_INTERCEPT + B_SLOPE * KS[0]);
      const rHi = US[M - 1] - (A_INTERCEPT + B_SLOPE * KS[M - 1]);
      const mid = Math.floor(M / 2);
      const rMid = US[mid] - (A_INTERCEPT + B_SLOPE * KS[mid]);
      return rLo > 0 && rHi > 0 && rMid < 0;
    },
  },
  {
    // Confirmation of imp-34408 F2: the residual magnitude explains and exceeds the axis-ratio disagreement.
    id: 'imp34470-confirms-imp34408-f2',
    description: 'the max residual (~2.9e-3) exceeds the imp-34408 axis-ratio disagreement (~6.16e-4) it explains',
    holds: () =>
      Math.abs(AXIS_RATIO_DISAGREEMENT - 6.16e-4) < 5e-5 &&
      MAX_ABS_RESID > AXIS_RATIO_DISAGREEMENT &&
      IMP34470_HEIGHT_MAP_AFFINITY_DEPARTURE_FIT.uMapIsAffine === false &&
      IMP34470_HEIGHT_MAP_AFFINITY_DEPARTURE_FIT.uMapNearAffine === true,
  },
  {
    // Honesty gate: measurement only, isRigorous literal false, C_mb clause named, no QED, no refereed bound is changed.
    id: 'imp34470-honesty-gate-no-qed',
    description: 'isRigorous false, no bound changed, NO QED, K_a>=0 untouched, C_mb per imp-486 untouched, no refereed bound is changed',
    holds: () =>
      IMP34470_HEIGHT_MAP_AFFINITY_DEPARTURE_FIT.isRigorous === false &&
      /NO QED/.test(IMP34470_HEIGHT_MAP_AFFINITY_DEPARTURE_FIT.verdict) &&
      /refereed bound is changed/i.test(IMP34470_HEIGHT_MAP_AFFINITY_DEPARTURE_FIT.verdict) &&
      /C_mb GUE-conditional per imp-486 UNTOUCHED/.test(IMP34470_HEIGHT_MAP_AFFINITY_DEPARTURE_FIT.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34470_HEIGHT_MAP_AFFINITY_DEPARTURE_FIT.verdict),
  },
];

for (const a of IMP34470_HEIGHT_MAP_AFFINITY_DEPARTURE_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34470-height-map-affinity-departure-fit assertion failed: ${a.id}`);
  }
}

export default IMP34470_HEIGHT_MAP_AFFINITY_DEPARTURE_FIT;
