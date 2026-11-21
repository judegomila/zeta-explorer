/**
 * @module imp-35067-recurrence-angle-k-trend-vs-noise
 *
 * imp-35067 (numerical, frontier-direction): imp-34947 cross-checked the imp-34932 sign-cycle conjugate-pair argument
 * theta ~ 40 deg with an INDEPENDENT magnitude-based local 2-step linear-recurrence (Darboux) angle read, reporting the
 * deep-band (k >= 8) span theta in 37.37 .. 39.37 deg (median 39.04, deepest window k=29 -> 39.23). But imp-34947 only
 * SUMMARISED that band as a static spread -- it never tested whether theta_k DRIFTS systematically with the window depth
 * k (a genuine approach to a limiting angle) or merely SCATTERS around a constant (band noise). This module closes that
 * gap: it regresses the imp-34947 per-window theta_k against k on the imp-34863 delta ladder and quantifies any monotone
 * trend and its extrapolated deep-window limit.
 *
 * THE MEASUREMENT (all inside the no-E_flow logistic model; measurement only)
 * ------------------------------------------------------------------------------------
 * It reuses the imp-34947 baked per-window {k, theta_deg} table VERBATIM (IMP34947_RECURRENCE_WINDOWS, deep band k >= 8)
 * and runs three diagnostics on theta_k vs k:
 *   (a) LINEAR TREND. Ordinary least squares of theta_k on k gives slope, intercept, and the coefficient of
 *       determination R^2. A significantly positive slope with a non-trivial R^2 is a systematic upward drift; a slope
 *       ~ 0 with tiny R^2 is scatter around a constant.
 *   (b) MONOTONICITY. The Spearman rank correlation rho_S between k and theta_k measures monotone (rank) association
 *       WITHOUT assuming linearity, and the step-to-step ascent/descent tally separates the smooth trend from the local
 *       jitter riding on it.
 *   (c) EXTRAPOLATED LIMIT. A Domb-Sykes-style regression of theta_k on 1/k has its 1/k -> 0 intercept equal to the
 *       theta_infinity the deep windows are converging TO (the finite-k reads sit below it when the slope in 1/k is
 *       negative), giving the limiting angle directly.
 *
 * THE FINDING (measurement only)
 * -------------------------------------------
 *   (F1) theta_k DRIFTS SYSTEMATICALLY UPWARD WITH k -- IT IS NOT BAND NOISE. The OLS slope is +0.0787 deg per unit k
 *        (R^2 ~ 0.66) and the Spearman rank correlation is rho_S ~ 0.88 (strong positive monotone association), so the
 *        deep-band angle rises with depth rather than scattering about a constant. The step-to-step tally (11 ascents,
 *        10 descents) shows a modest local jitter of size ~ 0.37 deg (the residual std about the linear fit) riding on
 *        top of that smooth upward trend -- a genuine monotone approach with band noise superimposed, not pure noise.
 *   (F2) THE EXTRAPOLATED DEEP-WINDOW LIMIT IS theta_infinity ~ 40.1 deg. The Domb-Sykes 1/k regression (R^2 ~ 0.77)
 *        extrapolates to a 1/k -> 0 intercept of ~40.12 deg. So the finite-window band 37.37 .. 39.37 deg is the RUN-UP
 *        of a sequence converging up toward ~40 deg -- and that limit RECONCILES the imp-34947 magnitude read with the
 *        imp-34932 sign-cycle theta = 40.0 deg (P = 9): the ~1 deg gap imp-34947 attributed to sign-count quantization
 *        is (also, and more sharply) the finite-k transient -- theta_k has simply not yet reached its ~40 deg limit at
 *        the deepest representable window k = 29.
 *   (F3) THE PAIR GEOMETRY IS UNCHANGED. The convergence is UP toward the ~40 deg off-axis regime imp-34932/imp-34947
 *        named, not away from it, so nothing about the complex-conjugate pole-pair diagnosis or the radius R ~ O(1e2)
 *        (eps = 1 deep inside |eps| < R) moves; this only sharpens the angle geometry.
 *
 * MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2
 * (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34947-conjugate-pair-argument-theta-cross-check (the per-window theta_k table this trend-tests)
 * @see imp-34932-sigma-knee-extended-order-domb-sykes (the sign-cycle theta = 40.0 deg the limit reconciles)
 * @see imp-34991-two-pair-darboux-joint-radius-angle (joint two-pair Darboux read)
 * @see imp-34863-sigma-knee-cauchy-hadamard-radius (root sequence, delta recursion)
 */

import { IMP34947_RECURRENCE_WINDOWS } from './imp-34947-conjugate-pair-argument-theta-cross-check.js';
import { IMP34932_SIGMA_KNEE_EXTENDED_ORDER_DOMB_SYKES } from './imp-34932-sigma-knee-extended-order-domb-sykes.js';

// ---- deep-band per-window sample (k >= 8), reused VERBATIM from imp-34947 ----------------------------------
const DEEP = IMP34947_RECURRENCE_WINDOWS.filter((w) => w.deep).sort((a, b) => a.k - b.k);
const KS = DEEP.map((w) => w.k);
const THETA = DEEP.map((w) => w.theta_deg);
const N = DEEP.length;
const sum = (arr) => arr.reduce((a, b) => a + b, 0);
const meanK = sum(KS) / N;
const meanTh = sum(THETA) / N;

// ---- (a) OLS linear trend theta_k vs k ---------------------------------------------------------------------
let sKK = 0, sKT = 0, sTT = 0;
for (let i = 0; i < N; i++) {
  sKK += (KS[i] - meanK) * (KS[i] - meanK);
  sKT += (KS[i] - meanK) * (THETA[i] - meanTh);
  sTT += (THETA[i] - meanTh) * (THETA[i] - meanTh);
}
const SLOPE = sKT / sKK; // deg per unit k
const INTERCEPT = meanTh - SLOPE * meanK;
const R2 = (sKT * sKT) / (sKK * sTT);
let rss = 0;
for (let i = 0; i < N; i++) {
  const pred = INTERCEPT + SLOPE * KS[i];
  rss += (THETA[i] - pred) * (THETA[i] - pred);
}
const RESID_STD = Math.sqrt(rss / (N - 2)); // jitter about the linear trend (deg)

// ---- (b) monotonicity: Spearman rank correlation + ascent/descent tally ------------------------------------
function rank(arr) {
  const idx = arr.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0]);
  const r = new Array(arr.length);
  idx.forEach((pair, i) => { r[pair[1]] = i + 1; });
  return r;
}
const rK = rank(KS);
const rT = rank(THETA);
const mRK = sum(rK) / N;
const mRT = sum(rT) / N;
let s1 = 0, s2 = 0, s3 = 0;
for (let i = 0; i < N; i++) {
  s1 += (rK[i] - mRK) * (rT[i] - mRT);
  s2 += (rK[i] - mRK) * (rK[i] - mRK);
  s3 += (rT[i] - mRT) * (rT[i] - mRT);
}
const SPEARMAN = s1 / Math.sqrt(s2 * s3);
let ascents = 0, descents = 0;
for (let i = 1; i < N; i++) {
  if (THETA[i] > THETA[i - 1]) ascents++;
  else if (THETA[i] < THETA[i - 1]) descents++;
}

// ---- (c) Domb-Sykes 1/k extrapolation: theta_infinity = intercept at 1/k -> 0 ------------------------------
const INV = KS.map((k) => 1 / k);
const meanInv = sum(INV) / N;
let iII = 0, iIT = 0, iTT = 0;
for (let i = 0; i < N; i++) {
  iII += (INV[i] - meanInv) * (INV[i] - meanInv);
  iIT += (INV[i] - meanInv) * (THETA[i] - meanTh);
  iTT += (THETA[i] - meanTh) * (THETA[i] - meanTh);
}
const SLOPE_INV = iIT / iII; // deg per unit (1/k); negative => theta rises toward the limit as k grows
const THETA_LIMIT = meanTh - SLOPE_INV * meanInv; // 1/k -> 0 intercept
const R2_INV = (iIT * iIT) / (iII * iTT);

const THETA_SIGN_CYCLE = IMP34932_SIGMA_KNEE_EXTENDED_ORDER_DOMB_SYKES.signPattern.argDegreesOffRealAxis; // 40.0

// ---- verdict flags (measurement only) ----------------------------------------------------------------------
const TREND_IS_UPWARD = SLOPE > 0 && R2 > 0.3; // systematic positive drift, not flat scatter
const MONOTONE_NOT_NOISE = SPEARMAN > 0.7; // strong rank association -> genuine monotone approach
const LIMIT_RECONCILES_SIGN_CYCLE = Math.abs(THETA_LIMIT - THETA_SIGN_CYCLE) < 1.0; // extrapolated limit ~ 40.0
const CONVERGES_UPWARD = SLOPE_INV < 0 && THETA_LIMIT > THETA[N - 1]; // limit sits above the deepest read

export const IMP35067_RECURRENCE_ANGLE_K_TREND_VS_NOISE = {
  id: 'imp-35067',
  proofSection: 'S-frontier',
  question:
    'imp-34947 reported the deep-band (k >= 8) Darboux recurrence-angle span theta in 37.37 .. 39.37 deg (median 39.04, ' +
    'deepest k=29 -> 39.23) but only summarised the band and never tested whether theta_k drifts systematically with ' +
    'window depth k (an approach to a limiting angle) versus scatters around a constant (band noise). Regress theta_k ' +
    'against k on the imp-34863 delta ladder and quantify any monotone trend and its extrapolated limit. Measurement ' +
    'only; C_mb GUE-conditional (imp-486) untouched; no QED.',
  measuredQuantity:
    'the k-dependence of the imp-34947 deep-band recurrence angle theta_k: the OLS slope / R^2 of theta_k vs k, the ' +
    'Spearman rank correlation and ascent/descent tally (monotone trend vs jitter), and the Domb-Sykes 1/k -> 0 ' +
    'extrapolated limiting angle theta_infinity',
  nDeepWindows: N, // 22 deep-band windows k = 8..29
  kRange: [KS[0], KS[N - 1]], // [8, 29]
  thetaRange_deg: [+Math.min(...THETA).toFixed(3), +Math.max(...THETA).toFixed(3)], // [37.37, 39.37] (imp-34947 band)
  linearTrend: {
    note: 'OLS of theta_k on k. Positive slope with non-trivial R^2 => systematic upward drift, not flat scatter.',
    slope_deg_per_k: +SLOPE.toFixed(5), // ~ +0.07869
    intercept_deg: +INTERCEPT.toFixed(3), // ~ 37.335
    r2: +R2.toFixed(4), // ~ 0.6639
    residualStd_deg: +RESID_STD.toFixed(4), // ~ 0.3725 (jitter about the trend)
  },
  monotonicity: {
    note: 'Spearman rank correlation (linearity-free monotone association) plus the step-to-step ascent/descent tally.',
    spearmanRho: +SPEARMAN.toFixed(4), // ~ 0.8826 (strong positive monotone)
    ascents: ascents, // 11
    descents: descents, // 10
  },
  extrapolation: {
    note: 'Domb-Sykes regression of theta_k on 1/k; the 1/k -> 0 intercept is the limiting angle theta_infinity.',
    slope_deg_per_invk: +SLOPE_INV.toFixed(3), // ~ -21.288 (negative => theta rises toward the limit with k)
    thetaLimit_deg: +THETA_LIMIT.toFixed(3), // ~ 40.115
    r2: +R2_INV.toFixed(4), // ~ 0.7725
  },
  reconciliation: {
    theta_signCycle_deg: THETA_SIGN_CYCLE, // 40.0 (imp-34932 P = 9)
    theta_deepestWindow_deg: +THETA[N - 1].toFixed(3), // ~ 39.229 (k = 29)
    theta_extrapolatedLimit_deg: +THETA_LIMIT.toFixed(3), // ~ 40.115
    limitMinusSignCycle_deg: +(THETA_LIMIT - THETA_SIGN_CYCLE).toFixed(3), // ~ +0.115
  },
  trendIsUpward: TREND_IS_UPWARD, // true
  monotoneNotNoise: MONOTONE_NOT_NOISE, // true
  convergesUpward: CONVERGES_UPWARD, // true -> limit above the deepest read
  limitReconcilesSignCycle: LIMIT_RECONCILES_SIGN_CYCLE, // true -> extrapolated limit ~ 40.0
  farTailExponent: 0.5, // imp-3463
  finding: {
    F1_theta_k_drifts_upward_not_noise:
      'The OLS slope of theta_k on k is POSITIVE (+0.0787 deg per unit k, R^2 ~ 0.66) and the Spearman rank correlation ' +
      'is rho_S ~ 0.88 (strong positive monotone association), so the deep-band angle rises SYSTEMATICALLY with window ' +
      'depth rather than scattering about a constant. A modest local jitter of ~0.37 deg (residual std about the linear ' +
      'fit; 11 ascents vs 10 descents step-to-step) rides on top of the smooth trend -- a genuine monotone approach ' +
      'with band noise superimposed, NOT pure noise.',
    F2_extrapolated_limit_reconciles_sign_cycle:
      'The Domb-Sykes 1/k regression (R^2 ~ 0.77) extrapolates to a 1/k -> 0 intercept theta_infinity ~ 40.12 deg, so ' +
      'the finite-window band 37.37 .. 39.37 deg is the run-up of a sequence converging UP toward ~40 deg. That limit ' +
      'reconciles the imp-34947 magnitude read with the imp-34932 sign-cycle theta = 40.0 deg (P = 9): the ~1 deg gap ' +
      'is (also, more sharply) the finite-k transient -- theta_k has simply not reached its ~40 deg limit at the ' +
      'deepest representable window k = 29.',
    F3_pair_geometry_unchanged:
      'The convergence is UP toward the ~40 deg off-axis regime imp-34932/imp-34947 named, not away from it, so the ' +
      'complex-conjugate pole-pair diagnosis and the radius R ~ O(1e2) (eps = 1 deep inside |eps| < R) are unmoved; ' +
      'this only sharpens the angle geometry.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). imp-34947 reported the deep-band recurrence-angle span ' +
    '37.37 .. 39.37 deg (median 39.04, deepest k=29 -> 39.23) but never tested theta_k for a k-trend. Regressing the ' +
    'imp-34947 per-window theta_k against k on the imp-34863 delta ladder: (a) the OLS slope is POSITIVE, +0.0787 deg ' +
    'per unit k (R^2 ~ 0.66, residual jitter ~0.37 deg), (b) the Spearman rank correlation rho_S ~ 0.88 confirms a ' +
    'strong monotone upward association (not scatter around a constant), and (c) the Domb-Sykes 1/k -> 0 extrapolation ' +
    '(R^2 ~ 0.77) puts the limiting angle theta_infinity ~ 40.12 deg. NET: theta_k DRIFTS SYSTEMATICALLY UPWARD with ' +
    'window depth toward a ~40 deg limit -- a genuine approach, not band noise -- and that limit reconciles the ' +
    'imp-34947 magnitude read with the imp-34932 sign-cycle theta = 40.0 deg, recasting the ~1 deg gap as the ' +
    'finite-k transient rather than only sign-count quantization. The pair geometry (off-axis ~40 deg, R ~ O(1e2)) is ' +
    'unchanged. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  subGap:
    'CLOSES the imp-34947 open thread (the deep band was summarised as a static spread, never trend-tested): theta_k ' +
    'is now shown to rise monotonically with k toward an extrapolated ~40.1 deg limit. What stays OPEN (deferred, not ' +
    'attempted): the 22-point deep band ends at the deepest double-precision window k = 29 (the delta ladder ' +
    'ill-conditions beyond K = 30 per imp-34932), so the ~40.1 deg limit is a short-lever 1/k extrapolation, not a ' +
    'converged tail; an extended-precision delta ladder past K = 30 would tighten theta_infinity but changes no bound ' +
    '(the convergent linear read R ~ O(1e2) already leaves eps = 1 deep inside |eps| < R).',
  citation:
    'imp-34947 (the per-window theta_k table this trend-tests); imp-34932 (sign-cycle theta = 40.0 deg the limit ' +
    'reconciles); imp-34991 (two-pair joint Darboux read); imp-34863 (root sequence, delta recursion); imp-3463 ' +
    '(far-tail 1/2); imp-486 (C_mb GUE-conditional).',
};

export const IMP35067_RECURRENCE_ANGLE_K_TREND_VS_NOISE_ASSERTIONS = [
  {
    // (a) the deep band is the imp-34947 sample: 22 windows k = 8..29, spanning the reported 37.37..39.37 band.
    id: 'imp35067-deep-band-matches-imp34947',
    description: 'deep band = 22 windows k = 8..29 spanning the imp-34947 recurrence-angle band ~[37.37, 39.37]',
    holds: () =>
      N === 22 &&
      KS[0] === 8 && KS[N - 1] === 29 &&
      Math.min(...THETA) > 37 && Math.min(...THETA) < 38 &&
      Math.max(...THETA) > 39 && Math.max(...THETA) < 40,
  },
  {
    // (b) theta_k drifts UPWARD, not noise: positive OLS slope with non-trivial R^2.
    id: 'imp35067-slope-positive-upward-trend',
    description: 'OLS slope of theta_k on k is positive (~+0.079 deg/k) with R^2 ~ 0.66 -> systematic upward drift',
    holds: () =>
      SLOPE > 0.05 && SLOPE < 0.12 &&
      R2 > 0.5 && R2 < 0.8 &&
      TREND_IS_UPWARD === true,
  },
  {
    // (c) monotone, not scatter: strong positive Spearman rank correlation.
    id: 'imp35067-monotone-spearman',
    description: 'Spearman rank correlation rho_S ~ 0.88 (> 0.7) -> strong monotone k-association, not band noise',
    holds: () =>
      SPEARMAN > 0.8 && SPEARMAN <= 1 &&
      MONOTONE_NOT_NOISE === true,
  },
  {
    // the Domb-Sykes 1/k extrapolation gives a limit ~ 40.1 deg that reconciles the imp-34932 sign-cycle 40.0.
    id: 'imp35067-extrapolated-limit-reconciles-sign-cycle',
    description: 'Domb-Sykes 1/k -> 0 limit theta_infinity ~ 40.1 deg (above the deepest read) reconciles sign-cycle 40.0',
    holds: () =>
      THETA_LIMIT > 39.5 && THETA_LIMIT < 40.6 &&
      SLOPE_INV < 0 &&
      CONVERGES_UPWARD === true &&
      LIMIT_RECONCILES_SIGN_CYCLE === true,
  },
  {
    // Honesty gate: measurement only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp35067-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP35067_RECURRENCE_ANGLE_K_TREND_VS_NOISE.isRigorous === false &&
      IMP35067_RECURRENCE_ANGLE_K_TREND_VS_NOISE.farTailExponent === 0.5 &&
      typeof IMP35067_RECURRENCE_ANGLE_K_TREND_VS_NOISE.subGap === 'string' &&
      /NO QED/.test(IMP35067_RECURRENCE_ANGLE_K_TREND_VS_NOISE.verdict) &&
      /refereed bound is changed/i.test(IMP35067_RECURRENCE_ANGLE_K_TREND_VS_NOISE.verdict),
  },
];

for (const a of IMP35067_RECURRENCE_ANGLE_K_TREND_VS_NOISE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35067-recurrence-angle-k-trend-vs-noise assertion failed: ${a.id}`);
  }
}
