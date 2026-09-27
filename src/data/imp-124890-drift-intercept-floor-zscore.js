/**
 * @module imp-124890-drift-intercept-floor-zscore
 *
 * imp-124890 (accuracy / cross-validation, frontier cross-check): imp-124850 M2 fit the round-off invariant product
 * P = |reldiff| * |E_CF| against |E_CF| under the drift model P = D*|E_CF| + R and read the OLS intercept
 * R = 3.46e-12 +/- 1.30e-12 as "matching the imp-124811 geomean round-off floor R ~ 2.34e-12 in scale" -- a ~1.5x
 * ratio ASSERTED as a scale match but never quantified against the intercept standard error. This leaf REUSES the
 * imp-124850 pair-ratio machinery VERBATIM (same 5-point O(eps^4) stencil, same landmarks L2..L7, same eps = 1e-3),
 * reproduces the OLS intercept R and its standard error se(R), then computes three independent round-off-floor
 * estimators off the SAME product ladder -- the imp-124811 geometric mean, the median, and the L2-rung product
 * (the least-round-off rung) -- and expresses each as a signed offset from the fitted intercept in units of se(R).
 * It DECIDES whether the imp-124811 geomean floor R ~ 2.34e-12 sits inside the fitted intercept confidence interval.
 * Accuracy/cross-validation only; conditional-share diagnostic; the pinned constants are perturbed only symbolically
 * as differentiation axes; the C_mb GUE-conditional per imp-486 is UNTOUCHED; no bound moves; NO QED.
 *
 * THE QUANTIFICATION (why a z-score settles the "scale match")
 * -----------------------------------------------------------
 * imp-124850 fit P = D*|E_CF| + R by OLS; the intercept R is the |E_CF|-independent round-off floor, and OLS attaches
 * a standard error se(R) to it. A separate, model-free estimate of the same floor is any central statistic of the six
 * products P (they are round-off noise about a flat floor when D = 0, per imp-124808/imp-124873). The natural
 * comparison is the standardized offset
 *     z(R_est) = (R_est - R_fit) / se(R_fit),
 * which says how many intercept standard errors a floor estimator lies from the fitted intercept. |z| < 1 means the
 * estimator sits inside the one-sigma band, |z| < 2 inside the ~95% confidence interval. This turns imp-124850's
 * qualitative "matches in scale" into a decision: is the imp-124811 geomean floor statistically consistent with the
 * fitted intercept, or merely the same order of magnitude?
 *
 *   FLOOR ESTIMATOR          value          z = (R_est - R_fit)/se(R_fit)   inside 1sigma?   inside 95% CI?
 *   fitted intercept R_fit   3.4602e-12     0                               --               --
 *   se(R_fit)                1.3016e-12
 *   imp-124811 geomean       2.3434e-12     -0.858                          YES              YES
 *   median of P (L2..L7)     1.7867e-12     -1.286                          no               YES
 *   L2-rung product          1.4604e-12     -1.536                          no               YES
 *
 * THE FINDING (accuracy / cross-validation only)
 * ---------------------------------------------
 *   (M1) THE imp-124811 GEOMEAN FLOOR SITS INSIDE THE ONE-SIGMA BAND OF THE FITTED INTERCEPT. The geomean floor
 *        R ~ 2.3434e-12 lies z = -0.858 standard errors below the OLS intercept R_fit = 3.4602e-12 -- inside the
 *        one-sigma band (|z| < 1). The asserted "~1.5x scale match" is therefore a genuine STATISTICAL agreement,
 *        not merely the same order of magnitude: the fitted intercept and the imp-124811 geomean floor are
 *        indistinguishable at the one-sigma level.
 *   (M2) ALL THREE FLOOR ESTIMATORS FALL INSIDE THE 95% INTERCEPT CONFIDENCE INTERVAL. The geomean (z = -0.86),
 *        the median (z = -1.29) and the L2-rung product (z = -1.54) all lie within two standard errors of the
 *        fitted intercept (|z| < 2). Every model-free floor estimator is consistent with the OLS intercept; the
 *        geomean is the closest of the three.
 *   (M3) THE ESTIMATORS ARE SYSTEMATICALLY BELOW THE FITTED INTERCEPT. All three z-scores are NEGATIVE (the floor
 *        estimators sit below R_fit), a mild upward bias of the OLS intercept expected from the two right-tail rungs
 *        L6/L7 (products 4.8e-12, 7.9e-12) levering the least-squares line up; the geomean, being a log-space
 *        central statistic, is the most robust to those tails and lands closest to R_fit. No estimator exceeds the
 *        intercept by more than its own uncertainty, so no floor estimator contradicts the imp-124850 intercept.
 *
 * ACCURACY / CROSS-VALIDATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the
 * C_C 1/8 ansatz (imp-2642/imp-2643), the pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED and
 * appear only symbolically as differentiation axes; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-124850-pairratio-drift-slope-fit (the OLS intercept R = 3.46e-12 +/- 1.30e-12 quantified here)
 * @see imp-124811-pairratio-reldiff-ecf-roundoff-law (the geomean round-off floor R ~ 2.34e-12)
 * @see imp-124808-extprec-pairratio-two-axis (mpmath dps=100 proof that the identity drift D = 0)
 * @see imp-124873-drift-fit-regime-certification (the ladder is round-off-limited, so P is a flat floor)
 * @see imp-97665-flow-etrunc-elasticity-identity-derivation (EXACT pair-ratio E_CF/E_ET = E_flow/E_trunc)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-97644/imp-97665/imp-124770/imp-124811/imp-124850 exactly

// EXACT imp-3406/imp-97644/imp-97665/imp-124770/imp-124811/imp-124850 sub-terms (baseline c = C_C_PINNED, e = E_TRUNC_PT, f = 1).
function parts(N, cc, et, cf) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = cf * ((Math.log(T0 / TWO_PI) + 1) / TWO_PI); // imp-398 pinned prefactor, scaled by cf
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = cc * Math.sqrt(L / N); // GUE-conditional (C_H ansatz), C_C = cc
  const E_N = et + E_flow + E_coll;
  return { E_N, sigma: E_coll / E_N, E_flow, E_coll };
}

// Downslope crossing sigma = level (identical bisection to imp-124770/imp-124811/imp-124850).
function landmark(level, cc, et, cf) {
  let a = Math.log(1e5);
  let b = Math.log(1e19);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), cc, et, cf).sigma > level) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const lnN = (level, cc, et, cf) => Math.log(landmark(level, cc, et, cf));

// 5-point O(eps^4) central difference (the imp-97665/imp-124770/imp-124811/imp-124850 verification stencil).
const deriv5 = (f, eps) => (-f(2 * eps) + 8 * f(eps) - 8 * f(-eps) + f(-2 * eps)) / (12 * eps);

// Measured pair-ratio E_CF / E_ET via the imp-97665 5-point stencil (E_ET the E_trunc axis, E_CF the C_F axis).
function pairRatio(level, eps) {
  const E_ET = deriv5((d) => lnN(level, C_C_PINNED, E_TRUNC_PT * Math.exp(d), 1.0), eps);
  const E_CF = deriv5((d) => lnN(level, C_C_PINNED, E_TRUNC_PT, 1.0 * Math.exp(d)), eps);
  return { E_ET, E_CF, ratio: E_CF / E_ET };
}

// The imp-97520 landmark ladder L2..L7 (identical sigma levels to imp-97665/imp-124770/imp-124811/imp-124850).
const LADDER_SIGMAS = [
  { key: 'L2', sigma: 0.9 },
  { key: 'L3', sigma: 0.5 },
  { key: 'L4', sigma: 0.1 },
  { key: 'L5', sigma: 0.02 },
  { key: 'L6', sigma: 0.005 },
  { key: 'L7', sigma: 0.001 },
];
const EPS = 1e-3; // the imp-97665/imp-124770/imp-124811/imp-124850 primary step

// At each landmark: measure |E_CF|, the pair-ratio |reldiff|, and form the drift-model product P = |reldiff|*|E_CF|.
const LADDER = LADDER_SIGMAS.map(({ key, sigma }) => {
  const N = landmark(sigma, C_C_PINNED, E_TRUNC_PT, 1.0);
  const P = parts(N, C_C_PINNED, E_TRUNC_PT, 1.0);
  const target = P.E_flow / E_TRUNC_PT; // analytic exact E_CF/E_ET = E_flow/E_trunc
  const m = pairRatio(sigma, EPS);
  const absReldiff = Math.abs(m.ratio / target - 1);
  const absE_CF = Math.abs(m.E_CF);
  return { key, sigma, absE_CF, absReldiff, product: absReldiff * absE_CF };
});

// STEP 1: reproduce the imp-124850 OLS intercept R = round-off floor and its standard error se(R).
const xs = LADDER.map((r) => r.absE_CF);
const ys = LADDER.map((r) => r.product);
const n = xs.length;
const mx = xs.reduce((a, b) => a + b, 0) / n;
const my = ys.reduce((a, b) => a + b, 0) / n;
let Sxy = 0;
let Sxx = 0;
for (let i = 0; i < n; i++) {
  Sxy += (xs[i] - mx) * (ys[i] - my);
  Sxx += (xs[i] - mx) ** 2;
}
const D_SLOPE = Sxy / Sxx;
const R_FIT = my - D_SLOPE * mx; // fitted round-off floor (imp-124850 intercept)
let SSE = 0;
for (let i = 0; i < n; i++) {
  const pred = D_SLOPE * xs[i] + R_FIT;
  SSE += (ys[i] - pred) ** 2;
}
const s2 = SSE / (n - 2); // residual variance (n - 2 dof)
const SE_R = Math.sqrt(s2 * (1 / n + (mx * mx) / Sxx)); // standard error of the intercept

// STEP 2: three model-free round-off-floor estimators off the SAME product ladder.
const prods = ys.slice();
const GEOMEAN_FLOOR = Math.exp(prods.reduce((a, b) => a + Math.log(b), 0) / n); // imp-124811 geomean floor
const sorted = prods.slice().sort((a, b) => a - b);
const MEDIAN_FLOOR = (sorted[2] + sorted[3]) / 2; // even count -> average of the two middle rungs
const L2_FLOOR = LADDER[0].product; // the L2 rung (largest |E_CF|, least round-off contamination)

// STEP 3: standardized offset of each estimator from the fitted intercept, in units of se(R).
const zOf = (est) => (est - R_FIT) / SE_R;
const Z_GEOMEAN = zOf(GEOMEAN_FLOOR);
const Z_MEDIAN = zOf(MEDIAN_FLOOR);
const Z_L2 = zOf(L2_FLOOR);
const GEOMEAN_INSIDE_ONE_SIGMA = Math.abs(Z_GEOMEAN) < 1;
const ALL_INSIDE_95CI = [Z_GEOMEAN, Z_MEDIAN, Z_L2].every((z) => Math.abs(z) < 2);

const round = (x, s = 4) => +x.toExponential(s);

export const IMP124890_DRIFT_INTERCEPT_FLOOR_ZSCORE = {
  id: 'imp-124890',
  proofSection: 'S-frontier',
  question:
    'imp-124850 M2 read the OLS intercept R = 3.46e-12 +/- 1.30e-12 of the drift-model fit P = D*|E_CF| + R as ' +
    '"matching the imp-124811 geomean round-off floor R ~ 2.34e-12 in scale" -- a ~1.5x ratio asserted but never ' +
    'quantified against the intercept standard error. Expressing the imp-124811 geomean floor and the median and ' +
    'L2-rung floor estimators as signed offsets from the fitted intercept in units of se(R), does R ~ 2.34e-12 sit ' +
    'inside the intercept confidence interval? Accuracy/cross-validation only; pinned constants perturbed only ' +
    'symbolically; no bound moves; no QED.',
  method:
    'Reuse the imp-124850 pair-ratio machinery verbatim (same 5-point O(eps^4) stencil, same landmarks L2..L7, ' +
    'same eps = 1e-3). Reproduce the OLS intercept R_fit and its standard error se(R) of the fit P = D*|E_CF| + R, ' +
    'then compute three model-free round-off-floor estimators off the SAME six products P -- the imp-124811 ' +
    'geometric mean, the median, and the L2-rung product -- and report each as z(R_est) = (R_est - R_fit)/se(R). ' +
    'Decide inclusion in the one-sigma band (|z| < 1) and the ~95% confidence interval (|z| < 2).',
  ladderSigmas: LADDER_SIGMAS.map((l) => l.sigma),
  eps_probed: EPS,
  products: LADDER.map((r) => ({ key: r.key, sigma: r.sigma, product_reldiff_times_absECF: round(r.product) })),
  intercept: {
    roundoff_floor_R_fit: round(R_FIT),
    roundoff_floor_se: round(SE_R),
  },
  floorEstimators: {
    imp124811_geomean: { value: round(GEOMEAN_FLOOR), z_vs_fitted_intercept: +Z_GEOMEAN.toFixed(4), inside_one_sigma: GEOMEAN_INSIDE_ONE_SIGMA, inside_95CI: Math.abs(Z_GEOMEAN) < 2 },
    median: { value: round(MEDIAN_FLOOR), z_vs_fitted_intercept: +Z_MEDIAN.toFixed(4), inside_one_sigma: Math.abs(Z_MEDIAN) < 1, inside_95CI: Math.abs(Z_MEDIAN) < 2 },
    L2_rung: { value: round(L2_FLOOR), z_vs_fitted_intercept: +Z_L2.toFixed(4), inside_one_sigma: Math.abs(Z_L2) < 1, inside_95CI: Math.abs(Z_L2) < 2 },
  },
  decision: {
    geomean_inside_intercept_one_sigma: GEOMEAN_INSIDE_ONE_SIGMA,
    all_floor_estimators_inside_95CI: ALL_INSIDE_95CI,
    note:
      'The imp-124811 geomean floor R ~ 2.3434e-12 sits z = -0.858 standard errors below the imp-124850 fitted ' +
      'intercept R_fit = 3.4602e-12 (se = 1.3016e-12) -- INSIDE the one-sigma band, so the "~1.5x scale match" is a ' +
      'genuine one-sigma statistical agreement, not merely the same order of magnitude. The median (z = -1.286) and ' +
      'the L2-rung floor (z = -1.536) also fall inside the 95% intercept confidence interval (|z| < 2); all three ' +
      'estimators are consistent with the OLS intercept, all sit systematically below it (all z negative, the OLS ' +
      'line levered mildly upward by the L6/L7 right-tail rungs), and the geomean is the closest.',
  },
  finding: {
    M1_geomean_inside_one_sigma:
      'The imp-124811 geomean floor R ~ ' + GEOMEAN_FLOOR.toExponential(4) + ' lies z = ' + Z_GEOMEAN.toFixed(3) +
      ' standard errors from the fitted intercept R_fit = ' + R_FIT.toExponential(4) + ' (se = ' +
      SE_R.toExponential(4) + ') -- inside the one-sigma band (|z| < 1). The asserted ~1.5x scale match is a ' +
      'genuine statistical agreement at the one-sigma level, not merely the same order of magnitude.',
    M2_all_estimators_inside_95CI:
      'All three model-free floor estimators fall inside the 95% intercept confidence interval: geomean z = ' +
      Z_GEOMEAN.toFixed(2) + ', median z = ' + Z_MEDIAN.toFixed(2) + ', L2-rung z = ' + Z_L2.toFixed(2) +
      ' (all |z| < 2). Every model-free floor estimate is consistent with the OLS intercept; the geomean is the ' +
      'closest of the three.',
    M3_systematic_below_fitted:
      'All three z-scores are negative -- the floor estimators sit below R_fit -- a mild upward bias of the OLS ' +
      'intercept expected from the two right-tail rungs L6/L7 (products ' + LADDER[4].product.toExponential(2) +
      ', ' + LADDER[5].product.toExponential(2) + ') levering the least-squares line up. The geomean, a log-space ' +
      'central statistic robust to those tails, lands closest; no estimator exceeds the intercept by more than its ' +
      'own uncertainty, so none contradicts the imp-124850 intercept.',
  },
  isRigorous: false,
  verdict:
    'ACCURACY / CROSS-VALIDATION (frontier cross-check, NOT rigorous). Quantifying the imp-124850 OLS intercept ' +
    'R_fit = ' + R_FIT.toExponential(4) + ' +/- ' + SE_R.toExponential(4) + ' against three model-free round-off-' +
    'floor estimators off the same L2..L7 product ladder, the imp-124811 geomean floor R ~ ' +
    GEOMEAN_FLOOR.toExponential(4) + ' sits z = ' + Z_GEOMEAN.toFixed(3) + ' standard errors below the fitted ' +
    'intercept -- INSIDE the one-sigma band -- so the imp-124850 "~1.5x scale match" is a genuine one-sigma ' +
    'statistical agreement. The median (z = ' + Z_MEDIAN.toFixed(2) + ') and the L2-rung floor (z = ' +
    Z_L2.toFixed(2) + ') also fall inside the 95% intercept confidence interval (|z| < 2); all three estimators are ' +
    'consistent with the OLS intercept and all sit systematically below it (the OLS line levered mildly upward by ' +
    'the L6/L7 right-tail rungs). This confirms the fitted intercept and the imp-124811 geomean round-off floor are ' +
    'statistically indistinguishable, both being the |E_CF|-independent double-precision round-off floor of the ' +
    'imp-97665 pair-ratio identity. Conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation, ' +
    'NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the ' +
    'pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED (perturbed only symbolically as ' +
    'differentiation axes); changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no ' +
    'RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-124850 (the OLS intercept R = 3.46e-12 +/- 1.30e-12 quantified here); imp-124811 (the geomean round-off ' +
    'floor R ~ 2.34e-12); imp-124808 (mpmath dps=100 proof that identity drift D = 0); imp-124873 (the ladder is ' +
    'round-off-limited, so P is a flat floor); imp-97665 (EXACT pair-ratio E_CF/E_ET = E_flow/E_trunc); imp-97520 ' +
    '(landmark ladder); imp-398 (C_F flow prefactor); lambda-rh-height-mapping (effectiveHeightForN inverse).',
};

export const IMP124890_DRIFT_INTERCEPT_FLOOR_ZSCORE_ASSERTIONS = [
  {
    // The ladder reproduces the imp-124850 L2..L7 products (import-light re-derivation of the same six rungs).
    id: 'imp124890-ladder-matches-imp124850',
    description: 'ladder has L2..L7 at sigma 0.9/0.5/0.1/0.02/0.005/0.001 with six positive products',
    holds: () =>
      LADDER.length === 6 &&
      LADDER.every((r, i) => Math.abs(r.sigma - LADDER_SIGMAS[i].sigma) < 1e-12) &&
      LADDER.every((r) => r.product > 0),
  },
  {
    // The reproduced intercept matches the imp-124850 published R = 3.46e-12 and se = 1.30e-12.
    id: 'imp124890-intercept-reproduces-imp124850',
    description: 'the reproduced OLS intercept R_fit ~ 3.46e-12 and se(R) ~ 1.30e-12 match imp-124850',
    holds: () => Math.abs(R_FIT - 3.46e-12) < 1e-13 && Math.abs(SE_R - 1.30e-12) < 5e-14,
  },
  {
    // The imp-124811 geomean floor reproduces at ~2.34e-12.
    id: 'imp124890-geomean-reproduces-imp124811',
    description: 'the geomean of the six products reproduces the imp-124811 floor ~2.34e-12',
    holds: () => Math.abs(GEOMEAN_FLOOR - 2.34e-12) < 5e-14,
  },
  {
    // (M1): the imp-124811 geomean floor sits inside the one-sigma band of the fitted intercept (|z| < 1).
    id: 'imp124890-geomean-inside-one-sigma',
    description: 'the imp-124811 geomean floor is within one intercept standard error of R_fit (|z| < 1)',
    holds: () => Math.abs(Z_GEOMEAN) < 1,
  },
  {
    // (M2): all three floor estimators fall inside the ~95% intercept confidence interval (|z| < 2).
    id: 'imp124890-all-estimators-inside-95CI',
    description: 'geomean, median and L2-rung floor estimators all sit within two intercept standard errors (|z| < 2)',
    holds: () => ALL_INSIDE_95CI,
  },
  {
    // (M3): all three estimators sit below the fitted intercept (z negative) -- the OLS line is levered up by L6/L7.
    id: 'imp124890-estimators-below-fitted',
    description: 'all three floor estimators lie below the fitted intercept (z-scores all negative)',
    holds: () => Z_GEOMEAN < 0 && Z_MEDIAN < 0 && Z_L2 < 0,
  },
  {
    // Honesty gate: accuracy/cross-validation only, no QED, PT stays SOTA.
    id: 'imp124890-honesty-gate-no-qed',
    description: 'Accuracy/cross-validation only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP124890_DRIFT_INTERCEPT_FLOOR_ZSCORE.isRigorous === false &&
      /NO QED/.test(IMP124890_DRIFT_INTERCEPT_FLOOR_ZSCORE.verdict) &&
      /remains SOTA/.test(IMP124890_DRIFT_INTERCEPT_FLOOR_ZSCORE.verdict),
  },
];

for (const a of IMP124890_DRIFT_INTERCEPT_FLOOR_ZSCORE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-124890-drift-intercept-floor-zscore assertion failed: ${a.id}`);
  }
}
