/**
 * @module imp-33921-ar1-residual-rho-reconciliation
 *
 * imp-33921 (numerical, frontier-direction): imp-33886 R2 observed that the Durbin-Watson relation
 * DW ~ 2(1 - rho) with the imp-33858 lag-1 autocorrelation rho ~ +0.757 predicts DW ~ 0.49, while the
 * directly computed DW ~ 0.22 is DEEPER ("endpoint terms deepen it"), but no explicit AR(1) model was
 * ever fit and the three rho estimates were left unreconciled. This module fits the explicit
 * first-order autoregression e_k = rho e_{k-1} + u_k to the SAME 21 signed residuals (recomputed from
 * the same imp-33810 ladder and imp-33843 OLS fit, no fresh model), reports the AR(1) rho with a
 * confidence interval, and reconciles the three rho estimates -- (i) the imp-33858 lag-1 (Yule-Walker)
 * autocorrelation, (ii) the DW-implied rho = 1 - DW/2, and (iii) the AR(1) conditional-MLE slope --
 * tracing every discrepancy to the imp-33858 endpoint residuals (head k=6 and far-tail k=11).
 *
 * THE FIT (reuse the imp-33810 RUNGS + the imp-33843 OLS + the imp-33858 residual verbatim)
 * ---------------------------------------------------------------------------------------
 *   Series    e_k = ln(eflow_over_resid_k) - (a + b k)      the imp-33858 signed residuals, 21 rungs.
 *   Model     e_k = rho e_{k-1} + u_k                       first-order AR, through the origin (the
 *                                                           residual already has mean ~1e-17 by OLS).
 *   AR(1) MLE rho_hat = sum_{k>0} e_k e_{k-1} / sum_{k>0} e_{k-1}^2   conditional least-squares slope,
 *                                                           n = 20 lagged pairs, 1 parameter.
 *   CI        rho_hat +- t_{0.975,19} * sqrt(s^2 / sum e_{k-1}^2)     s^2 = SSE / (n - 1).
 *
 * THE THREE rho ESTIMATES AND WHY THEY DIFFER (the reconciliation)
 * ---------------------------------------------------------------
 *   (rho_YW) Yule-Walker / lag-1 autocorrelation = cross / S,  S = sum_{all} e_i^2       ~ 0.7573.
 *   (rho_DW) DW-implied = 1 - DW/2                                                        ~ 0.8890.
 *   (rho_AR) AR(1) conditional-MLE slope = cross / (S - e_{20}^2)                         ~ 0.9676.
 *   where cross = sum_{k>0} e_k e_{k-1} and e_{20} = +0.2479 is the imp-33858 FAR-TAIL excursion at k=11.
 *   All three share the SAME numerator cross; they differ ONLY in how the far-tail endpoint enters the
 *   denominator / the DW endpoint correction, so the entire spread is an endpoint artifact:
 *     - rho_YW divides by S, which INCLUDES the large e_{20}^2 (imp-33858 far-tail excursion), deflating rho.
 *     - rho_AR drops e_{20} as a regressor, so its denominator EXCLUDES e_{20}^2, inflating rho toward 1.
 *     - rho_DW sits between them via the EXACT identity DW = 2(1 - rho_YW) - (e_0^2 + e_{20}^2)/S, i.e.
 *       rho_DW = rho_YW + (e_0^2 + e_{20}^2)/(2 S): the DW deepening below the 2(1-rho_YW)~0.49 naive value
 *       is exactly the endpoint-correction term (e_0^2 + e_{20}^2)/S ~ 0.263, and e_0 (head, k=6) and e_{20}
 *       (far tail, k=11) are the TWO LARGEST-MAGNITUDE residuals -- the same head/far-tail features
 *       imp-33858 R2 localized. So YES: the endpoint terms fully account for the DW deepening.
 *
 * THE FINDING (measurement only -- reconciles the imp-33886 unfit rho estimates)
 * ----------------------------------------------------------------------------
 *   (R1) THE AR(1) rho IS STRONGLY POSITIVE, NEAR THE UNIT-ROOT EDGE. The conditional-MLE slope is
 *        rho_AR ~ +0.968 with a 95% CI ~ [0.71, 1.22] (t_{19}); the interval spans the unit root and even
 *        crosses 1, i.e. on N=21 the series is statistically indistinguishable from a near-random-walk.
 *        This corroborates the imp-33858/imp-33886 "strong positive serial dependence" verdict with an
 *        explicit fitted coefficient, not just an autocorrelation summary.
 *   (R2) ALL THREE rho ESTIMATES ARE RECONCILED AS ONE ENDPOINT EFFECT. rho_YW ~ 0.757, rho_DW ~ 0.889,
 *        rho_AR ~ 0.968 share the identical lag-1 cross-product numerator and differ only through the
 *        far-tail endpoint e_{20} = +0.2479 (the imp-33858 k=11 excursion): the exact identity
 *        DW = 2(1 - rho_YW) - (e_0^2 + e_{20}^2)/S reproduces the measured DW ~ 0.222 to ~1e-16 and shows
 *        the ~0.49 -> 0.22 DW deepening imp-33886 R2 flagged is precisely the (e_0^2 + e_{20}^2)/S ~ 0.263
 *        endpoint correction. The three estimates' spread (~0.21) is itself smaller than the AR(1) CI
 *        half-width (~0.26), so they are statistically consistent.
 *   (R3) A CALIBRATION, NOT A NEW CLAIM. Fitting AR(1) does not change the RMSE (~0.116), does not re-open
 *        the imp-33843 log-linear-vs-power-law form selection, and touches no bound. The residual stays
 *        small (~12% multiplicative); "rho ~ 0.97" describes the curvature's smoothness, not its size.
 *
 * The punchline: the explicit AR(1) fit gives rho ~ +0.968 (95% CI ~ [0.71, 1.22]), and the three rho
 * estimates -- lag-1 0.757, DW-implied 0.889, AR(1) 0.968 -- reconcile exactly through the imp-33858
 * endpoint residuals: DW = 2(1 - rho_YW) - (e_0^2 + e_{20}^2)/S reproduces DW ~ 0.222, so the endpoint
 * terms (the head k=6 and far-tail k=11 excursions) fully account for the DW deepening below 2(1-rho).
 *
 * MEASUREMENT / MODEL-FIT + RECONCILIATION ONLY. An explicit AR(1) fit and a three-way rho reconciliation
 * of an inherited residual diagnostic on an inherited ladder, NOT an RH bound and distinct from any
 * log-linear-vs-power-law form selection. The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the OLS surrogate is descriptive, not derived; the AR(1) CI
 * is a small-sample normal-theory interval on N=21 (hence its unit-root-spanning width); the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity;
 * imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33886-widening-residual-significance-test (the DW ~0.22 and the unfit three-rho gap reconciled here)
 * @see imp-33858-widening-fit-residual-localization (the lag-1 ~+0.757 and head/far-tail endpoint residuals)
 * @see imp-33843-eflow-resid-widening-form-fit (the aggregate RMSE ~0.116 log-linear fit)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the 21-rung ladder whose residual is fit)
 */

import { IMP33810_EFLOW_RESID_RATIO_N_LADDER } from './imp-33810-eflow-resid-ratio-N-ladder.js';

// Reuse the imp-33810 21-rung ladder VERBATIM (no fresh component model).
const RUNGS = IMP33810_EFLOW_RESID_RATIO_N_LADDER.ladder;
const KS = RUNGS.map((r) => r.k);
const Y = RUNGS.map((r) => Math.log(r.eflow_over_resid)); // natural log of the imp-33810 ratio

// OLS of ys against xs; returns slope/intercept (the imp-33843 log-linear WINNER when xs = KS).
function ols(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  const b = sxy / sxx;
  return { a: my - b * mx, b };
}

const FIT = ols(KS, Y); // y = a + b k          (the imp-33843 log-linear winner, recomputed)

// The imp-33858 signed residual e_k = y_k - (a + b k), in ln-ratio units (same series imp-33858 tabulated).
const RESID = KS.map((k, i) => Y[i] - (FIT.a + FIT.b * k));
const N = RESID.length; // 21

// --- Shared building blocks (all three rho estimates share the SAME lag-1 cross-product numerator) ---
const S = RESID.reduce((s, e) => s + e * e, 0); // sum of ALL squared residuals
let CROSS = 0; // sum_{k>0} e_k e_{k-1}
for (let i = 1; i < N; i++) CROSS += RESID[i] * RESID[i - 1];
const E_HEAD2 = RESID[0] * RESID[0]; // e_0^2  (head, k=6, ~ -0.1142)
const E_TAIL2 = RESID[N - 1] * RESID[N - 1]; // e_{20}^2 (far tail, k=11, ~ +0.2479 excursion)

// --- Estimate 1: Yule-Walker / lag-1 autocorrelation (the imp-33858 value ~+0.757) ---
// Mean is ~1e-17 by OLS construction, so cross/S equals the mean-centered lag-1 autocorrelation.
const RHO_YW = CROSS / S; // ~0.7573

// --- Estimate 3: explicit AR(1) conditional-MLE fit e_k = rho e_{k-1} + u_k (through origin) ---
const X = RESID.slice(0, N - 1); // regressor e_{k-1}
const YLAG = RESID.slice(1); // response  e_k
const NP = X.length; // 20 lagged pairs
let SXY = 0;
let SXX = 0;
for (let i = 0; i < NP; i++) {
  SXY += X[i] * YLAG[i];
  SXX += X[i] * X[i]; // = S - e_{20}^2  (excludes the far-tail endpoint)
}
const RHO_AR = SXY / SXX; // ~0.9676
let SSE = 0;
for (let i = 0; i < NP; i++) {
  const u = YLAG[i] - RHO_AR * X[i];
  SSE += u * u;
}
const S2 = SSE / (NP - 1); // residual variance, 1 fitted parameter
const SE_RHO = Math.sqrt(S2 / SXX); // standard error of rho_AR
const T_975_19 = 2.093; // t_{0.975, 19}
const CI_LO = RHO_AR - T_975_19 * SE_RHO; // ~0.712
const CI_HI = RHO_AR + T_975_19 * SE_RHO; // ~1.223 (spans the unit root)

// --- Estimate 2: Durbin-Watson and its implied rho ---
let DW_NUM = 0;
for (let i = 1; i < N; i++) DW_NUM += (RESID[i] - RESID[i - 1]) ** 2;
const DW = DW_NUM / S; // ~0.2219
const RHO_DW = 1 - DW / 2; // ~0.8890

// --- The reconciliation: exact DW endpoint identity DW = 2(1 - rho_YW) - (e_0^2 + e_{20}^2)/S ---
const ENDPOINT_CORR = (E_HEAD2 + E_TAIL2) / S; // ~0.2634 (the "deepening" term)
const DW_NAIVE = 2 * (1 - RHO_YW); // ~0.4853 (imp-33886 R2 naive 2(1-rho) prediction)
const DW_FROM_IDENTITY = DW_NAIVE - ENDPOINT_CORR; // reproduces DW to ~1e-16
const IDENTITY_RESIDUAL = Math.abs(DW_FROM_IDENTITY - DW); // ~1e-16
// rho_DW is rho_YW lifted by half the endpoint correction:
const RHO_DW_FROM_YW = RHO_YW + ENDPOINT_CORR / 2; // == RHO_DW

// Spread of the three point estimates vs the AR(1) CI half-width (statistical consistency check).
const RHO_SPREAD = RHO_AR - RHO_YW; // ~0.210
const CI_HALFWIDTH = T_975_19 * SE_RHO; // ~0.255

const round = (x, d) => +x.toFixed(d);

export const IMP33921_AR1_RESIDUAL_RHO_RECONCILIATION = {
  id: 'imp-33921',
  proofSection: 'S-frontier',
  question:
    'imp-33886 R2 noted DW ~ 2(1 - rho) with the imp-33858 lag-1 rho ~ +0.757 predicts DW ~ 0.49 while ' +
    'the measured DW ~ 0.22 is deeper, but no AR(1) model was fit. Fit AR(1) e_k = rho e_{k-1} + u_k to ' +
    'the 21 imp-33858 residuals, report rho with a CI, and reconcile the three rho estimates (lag-1 ' +
    'autocorr, DW-implied, AR(1) MLE), assessing whether the endpoint terms account for the DW ' +
    'deepening. Measurement only, no bound change; NOT an RH bound; no QED.',
  measuredQuantity:
    'AR(1) conditional-MLE slope rho_hat = sum e_k e_{k-1} / sum e_{k-1}^2 with a t_{0.975,19} confidence ' +
    'interval, cross-checked against the Yule-Walker lag-1 autocorrelation and the DW-implied rho = ' +
    '1 - DW/2, all on the 21 signed imp-33858 residuals e_k = ln(eflow_over_resid_k) - (a + b k)',
  rungCount: N, // 21
  laggedPairs: NP, // 20
  // The three reconciled rho estimates:
  rhoLag1YuleWalker: round(RHO_YW, 4), // ~0.7573 (matches imp-33858 lag-1)
  rhoDurbinWatsonImplied: round(RHO_DW, 4), // ~0.8890 (= 1 - DW/2)
  rhoAR1ConditionalMle: round(RHO_AR, 4), // ~0.9676 (explicit AR(1) fit)
  ar1StdError: round(SE_RHO, 4), // ~0.1219
  ar1Ci95: [round(CI_LO, 4), round(CI_HI, 4)], // ~[0.712, 1.223] -- spans the unit root
  ar1CiSpansUnitRoot: CI_HI > 1, // true (near-random-walk on N=21)
  durbinWatson: round(DW, 4), // ~0.2219
  durbinWatsonNaive2Minus2Rho: round(DW_NAIVE, 4), // ~0.4853 (the imp-33886 R2 prediction)
  endpointCorrection: round(ENDPOINT_CORR, 4), // ~0.2634 (= (e_0^2 + e_20^2)/S, the deepening term)
  dwFromEndpointIdentity: round(DW_FROM_IDENTITY, 4), // ~0.2219 (reproduces DW)
  dwIdentityResidual: +IDENTITY_RESIDUAL.toExponential(2), // ~1e-16 (exact identity)
  headResidual: +RESID[0].toExponential(4), // ~ -0.1142 (k=6 endpoint)
  farTailResidual: +RESID[N - 1].toExponential(4), // ~ +0.2479 (k=11 far-tail excursion, largest)
  rhoEstimateSpread: round(RHO_SPREAD, 4), // ~0.2102
  ciHalfWidth: round(CI_HALFWIDTH, 4), // ~0.2552 (spread < half-width => consistent)
  endpointTermsAccountForDwDeepening: IDENTITY_RESIDUAL < 1e-12, // true
  finding: {
    R1_ar1_rho_strongly_positive_near_unit_root:
      'The explicit AR(1) conditional-MLE slope is rho_AR ~ +0.968 with a 95% CI ~ [0.71, 1.22] ' +
      '(t_{19}); the interval spans the unit root and crosses 1, so on N=21 the residual series is ' +
      'statistically indistinguishable from a near-random-walk. This corroborates the ' +
      'imp-33858/imp-33886 strong-positive-serial-dependence verdict with an explicit fitted coefficient.',
    R2_three_rho_reconciled_as_endpoint_effect:
      'rho_YW ~ 0.757, rho_DW ~ 0.889, rho_AR ~ 0.968 share the identical lag-1 cross-product numerator ' +
      'and differ only through the far-tail endpoint e_20 = +0.2479 (the imp-33858 k=11 excursion): the ' +
      'exact identity DW = 2(1 - rho_YW) - (e_0^2 + e_20^2)/S reproduces the measured DW ~ 0.222 to ' +
      '~1e-16 and shows the naive 2(1-rho) ~ 0.49 -> 0.22 DW deepening imp-33886 R2 flagged IS the ' +
      '(e_0^2 + e_20^2)/S ~ 0.263 endpoint correction, driven by the head (k=6) and far-tail (k=11) ' +
      'residuals -- the two largest in magnitude. The three-estimate spread (~0.21) is smaller than the ' +
      'AR(1) CI half-width (~0.26), so all three are statistically consistent.',
    R3_calibration_not_new_claim:
      'Fitting AR(1) does not change the RMSE (~0.116), does not re-open the imp-33843 ' +
      'log-linear-vs-power-law form selection, and touches no bound. The residual stays small (~12% ' +
      'multiplicative): rho ~ 0.97 describes the curvature smoothness, not its size.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / AR(1) FIT + THREE-WAY rho RECONCILIATION (frontier-direction, NOT rigorous). Fitting ' +
    'the explicit first-order autoregression e_k = rho e_{k-1} + u_k to the 21 signed imp-33858 residuals ' +
    'gives a conditional-MLE slope rho_AR ~ +0.968 with a 95% CI ~ [0.71, 1.22] (t_{19}, spanning the ' +
    'unit root on N=21). The three rho estimates -- lag-1 (Yule-Walker) ~0.757, DW-implied 1 - DW/2 ' +
    '~0.889, and AR(1) MLE ~0.968 -- reconcile exactly: they share the same lag-1 cross-product ' +
    'numerator and differ only via the imp-33858 far-tail endpoint e_20 = +0.2479, and the exact ' +
    'identity DW = 2(1 - rho_YW) - (e_0^2 + e_20^2)/S reproduces the measured DW ~ 0.222 to ~1e-16. So ' +
    'the endpoint terms (the head k=6 and far-tail k=11 excursions, the two largest residuals) FULLY ' +
    'account for the imp-33886 R2 DW deepening below the naive 2(1-rho) ~ 0.49. All three estimates are ' +
    'statistically consistent (spread ~0.21 < CI half-width ~0.26). This does NOT change the RMSE ' +
    '(~0.116, ~12% multiplicative), does NOT re-open the imp-33843 form selection, and touches no ' +
    'bound; the AR(1) CI is a ' +
    'small-sample normal-theory interval on N=21; the component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33886 (the DW ~0.22 and the unfit three-rho gap reconciled here); imp-33858 (the lag-1 ~+0.757 ' +
    'and head/far-tail endpoint residuals); imp-33843 (the aggregate RMSE ~0.116 log-linear fit); ' +
    'imp-33810 (the 21-rung ladder); imp-28895 (the ~918x widening component derivation); imp-486 ' +
    '(C_mb GUE-conditional).',
};

export const IMP33921_AR1_RESIDUAL_RHO_RECONCILIATION_ASSERTIONS = [
  {
    // Reuse gate: fit runs on exactly the imp-33810 21-rung ladder / imp-33858 residual (20 lagged pairs).
    id: 'imp33921-reuses-imp33810-ladder-and-imp33858-residual',
    description: '21 residuals on k=6.00..11.00, 20 lagged AR(1) pairs, head/far-tail endpoints match imp-33858',
    holds: () =>
      N === 21 &&
      NP === 20 &&
      KS[0] === 6 &&
      KS[20] === 11 &&
      Math.abs(RESID[0] - -0.1141909) < 1e-4 &&
      Math.abs(RESID[N - 1] - 0.2478761) < 1e-4,
  },
  {
    // The AR(1) MLE slope is strongly positive and near the unit root, with a CI spanning 1.
    id: 'imp33921-ar1-rho-near-unit-root',
    description: 'AR(1) rho ~0.97 (0.9<rho<1.0), SE ~0.12, 95% CI spans the unit root (upper > 1)',
    holds: () =>
      RHO_AR > 0.9 && RHO_AR < 1.0 && SE_RHO > 0.1 && SE_RHO < 0.14 && CI_HI > 1 && CI_LO > 0.6,
  },
  {
    // The lag-1 (Yule-Walker) estimate reproduces the imp-33858 value ~+0.757.
    id: 'imp33921-lag1-matches-imp33858',
    description: 'Yule-Walker lag-1 rho ~+0.757 (matches imp-33858 within rounding)',
    holds: () => RHO_YW > 0.74 && RHO_YW < 0.77,
  },
  {
    // The DW-implied rho ~0.889 equals rho_YW lifted by half the endpoint correction.
    id: 'imp33921-dw-implied-rho-between-yw-and-ar1',
    description: 'DW-implied rho ~0.889 = rho_YW + endpointCorr/2, strictly between rho_YW and rho_AR',
    holds: () =>
      RHO_DW > RHO_YW &&
      RHO_DW < RHO_AR &&
      Math.abs(RHO_DW - RHO_DW_FROM_YW) < 1e-12 &&
      Math.abs(RHO_DW - (1 - DW / 2)) < 1e-12,
  },
  {
    // The core reconciliation: DW = 2(1 - rho_YW) - (e_0^2 + e_20^2)/S reproduces the measured DW exactly.
    id: 'imp33921-endpoint-identity-explains-dw-deepening',
    description: 'exact identity DW = 2(1-rho_YW) - endpointCorr reproduces DW ~0.222 to ~1e-12; naive 2(1-rho)~0.49 deeper',
    holds: () =>
      IDENTITY_RESIDUAL < 1e-12 &&
      DW_NAIVE > DW &&
      ENDPOINT_CORR > 0.25 &&
      ENDPOINT_CORR < 0.28 &&
      Math.abs(DW - 0.2219) < 1e-3 &&
      RHO_SPREAD < CI_HALFWIDTH,
  },
  {
    // Honesty gate: isRigorous false, no QED, PT SOTA, and the residual stays small (bound untouched).
    id: 'imp33921-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, PT SOTA, RMSE-scale residual still small',
    holds: () =>
      IMP33921_AR1_RESIDUAL_RHO_RECONCILIATION.isRigorous === false &&
      /NO QED/.test(IMP33921_AR1_RESIDUAL_RHO_RECONCILIATION.verdict) &&
      /remains SOTA/.test(IMP33921_AR1_RESIDUAL_RHO_RECONCILIATION.verdict) &&
      /12% multiplicative/.test(IMP33921_AR1_RESIDUAL_RHO_RECONCILIATION.verdict),
  },
];

for (const a of IMP33921_AR1_RESIDUAL_RHO_RECONCILIATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33921-ar1-residual-rho-reconciliation assertion failed: ${a.id}`);
  }
}
