/**
 * @module imp-33964-ljung-box-portmanteau-test
 *
 * imp-33964 (numerical, frontier-direction): imp-33921 fit the explicit AR(1) e_k = rho e_{k-1} + u_k
 * to the 21 signed imp-33858 residuals (rho_AR ~ +0.968) and imp-33886/imp-33920 ran a runs / Durbin-
 * Watson test, but EVERY one of those diagnostics probed only LAG-1 (or run structure). None asked
 * whether the serial dependence persists BEYOND lag-1: the strong rho_AR could be a pure AR(1) (higher
 * lags implied by geometric decay) or could hide additional higher-order structure. This module
 * computes the sample autocorrelations r_1..r_5 of the SAME 21 signed residuals (recomputed from the
 * same imp-33810 ladder + imp-33843 OLS, no fresh model) and the Ljung-Box portmanteau statistic
 * Q_m = n(n+2) sum_{k=1}^m r_k^2 / (n - k) for m = 1..5, comparing each Q_m against chi-square_m, and
 * checks whether the higher-lag autocorrelations follow the geometric decay rho^k an AR(1) predicts.
 *
 * THE LJUNG-BOX PORTMANTEAU STATISTIC (same residual series as imp-33921, higher-lag ACF)
 * -------------------------------------------------------------------------------------
 *   Series    e_k = ln(eflow_over_resid_k) - (a + b k)      the imp-33858 signed residuals, 21 rungs.
 *   ACF       r_k = sum_{i>k} e_i e_{i-k} / sum_i e_i^2     lag-k autocorrelation (mean ~1e-17 by OLS).
 *   Q_m       Q_m = n(n+2) sum_{k=1}^m r_k^2 / (n - k)      Ljung-Box (1978) portmanteau statistic.
 *   Null      H0: r_1 = ... = r_m = 0 (white noise); under H0, Q_m ~ chi-square_m asymptotically.
 *   Reject    reject the white-noise null when Q_m EXCEEDS the upper-tail chi-square_m critical value.
 *   For a genuine AR(1) the population ACF decays geometrically, rho_k = rho^k, so the r_k should stay
 *   the SAME SIGN and shrink smoothly; a sign change or faster-than-geometric decay signals that AR(1)
 *   is not an adequate model (residual higher-order structure remains).
 *
 * THE FIVE SAMPLE AUTOCORRELATIONS (the same 21 residuals, lags 1..5)
 * ------------------------------------------------------------------
 *   r_1 ~ +0.7573   r_2 ~ +0.4813   r_3 ~ +0.2027   r_4 ~ -0.0521   r_5 ~ -0.2618
 *   r_1 reproduces the imp-33858 lag-1 value ~+0.757 exactly; then the ACF decays and CROSSES ZERO,
 *   turning negative by lag 4. That sign change is the tell-tale of a trend-curvature residual (an OLS
 *   line fit to the curved imp-33858 hump), NOT a smoothly-decaying positive AR(1).
 *
 * THE FIVE LJUNG-BOX STATISTICS vs chi-square_m (upper tail)
 * --------------------------------------------------------
 *   Q_1 ~ 13.85 (chi2_1: 5% 3.84, 1% 6.63)   Q_2 ~ 19.74 (chi2_2: 5% 5.99, 1% 9.21)
 *   Q_3 ~ 20.84 (chi2_3: 5% 7.81, 1% 11.34)  Q_4 ~ 20.92 (chi2_4: 5% 9.49, 1% 13.28)
 *   Q_5 ~ 22.99 (chi2_5: 5% 11.07, 1% 15.09)
 *   Every Q_m exceeds even the 1% critical value, so the white-noise null is REJECTED at all horizons.
 *   The incremental contributions concentrate at lag-1 (Q_1 = 13.85) and lag-2 (+5.89 from r_2 = 0.48),
 *   with lags 3-4 adding almost nothing (+1.10, +0.08) and lag-5 adding +2.07 from the NEGATIVE r_5 lobe.
 *
 * THE FINDING (measurement / calibration only -- higher-lag structure beyond imp-33921 lag-1)
 * -----------------------------------------------------------------------------------------
 *   (R1) THE WHITE-NOISE NULL IS REJECTED AT EVERY LAG HORIZON m = 1..5. Q_1..Q_5 ~ 13.9, 19.7, 20.8,
 *        20.9, 23.0 all exceed the 1% chi-square_m critical values, so the serial dependence the
 *        imp-33886/imp-33920 lag-1 diagnostics found is NOT confined to lag-1: it persists to lag-2
 *        (r_2 ~ +0.48, the largest single increment after lag-1) and re-emerges as a negative lobe at
 *        lag-5. Serial dependence extends beyond lag-1.
 *   (R2) BUT THE HIGHER-LAG ACF IS NOT A PURE AR(1) GEOMETRIC DECAY -- AR(1) IS NOT FULLY ADEQUATE. A
 *        genuine AR(1) predicts r_k = rho^k, staying positive and decaying smoothly: rho_AR ~ 0.968 gives
 *        0.968, 0.936, 0.906, 0.877, 0.848, and even rho_YW ~ 0.757 gives 0.757, 0.574, 0.434, 0.329,
 *        0.249. The EMPIRICAL ACF (0.757, 0.481, 0.203, -0.052, -0.262) decays much FASTER than either
 *        and CROSSES ZERO into negative territory by lag 4 -- a positive AR(1) cannot do that. The sign
 *        change signals residual higher-order structure (the classic signature of an OLS line fit to the
 *        curved imp-33858 hump), and directly corroborates imp-33921 R2 that the near-unit-root
 *        rho_AR ~ 0.968 is an endpoint-inflated artifact, not the true decay rate.
 *   (R3) A CALIBRATION, NOT A NEW CLAIM. The portmanteau test re-reads the same imp-33858 residual ACF at
 *        higher lags; it does not change the RMSE (~0.116), does not re-open the imp-33843
 *        log-linear-vs-power-law form selection, and touches no bound. rho ~ 0.97 still describes the
 *        curvature smoothness, not its size (~12% multiplicative residual). Small-N caveat: at n=21 the
 *        higher-lag r_k rest on few pairs (n - k) and the Q_m chi-square reference is asymptotic.
 *
 * The punchline: the Ljung-Box Q_1..Q_5 ~ 13.9..23.0 all exceed the 1% chi-square critical values, so the
 * white-noise null is rejected at every lag horizon and the serial dependence is NOT confined to lag-1
 * (it persists to lag-2 and re-emerges negative at lag-5). BUT the empirical ACF (0.757, 0.481, 0.203,
 * -0.052, -0.262) decays faster than the geometric rho^k an AR(1) predicts and crosses zero into negative
 * territory, so AR(1) is NOT a fully adequate model -- there is residual higher-order (trend-curvature)
 * structure, consistent with imp-33921 R2 reading rho_AR ~ 0.968 as an endpoint-inflated artifact.
 *
 * MEASUREMENT / PORTMANTEAU TEST ONLY. A Ljung-Box higher-lag serial-dependence test on an inherited
 * residual diagnostic from an inherited ladder, NOT an RH bound and distinct from any log-linear-vs-
 * power-law form selection. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 * rigorous asymptotic; the OLS surrogate is descriptive, not derived; the Q_m chi-square reference is a
 * small-sample asymptotic on N=21; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian
 * Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33921-ar1-residual-rho-reconciliation (the AR(1) rho_AR ~ 0.968 whose geometric decay is checked here)
 * @see imp-33886-widening-residual-significance-test (the lag-1 Durbin-Watson companion)
 * @see imp-33920-runs-test-exact-permutation-pvalue (the exact runs-test lag-1 companion)
 * @see imp-33858-widening-fit-residual-localization (the lag-1 ~+0.757 and head/far-tail endpoint residuals)
 * @see imp-33843-eflow-resid-widening-form-fit (the aggregate RMSE ~0.116 log-linear fit)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the 21-rung ladder whose residual is tested)
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
const MEAN = RESID.reduce((a, b) => a + b, 0) / N; // ~1e-17 by OLS construction
const S0 = RESID.reduce((s, e) => s + (e - MEAN) * (e - MEAN), 0); // sum of squared deviations (lag-0)

// Sample autocorrelation r_k = sum_{i>=k} (e_i - mean)(e_{i-k} - mean) / S0.
function acf(k) {
  let c = 0;
  for (let i = k; i < N; i++) c += (RESID[i] - MEAN) * (RESID[i - k] - MEAN);
  return c / S0;
}

const MAX_LAG = 5;
const R = []; // r_1..r_5
for (let k = 1; k <= MAX_LAG; k++) R.push(acf(k));

// Ljung-Box (1978) portmanteau Q_m = n(n+2) sum_{k=1}^m r_k^2 / (n - k), accumulated over m = 1..5.
const Q = [];
let acc = 0;
for (let k = 1; k <= MAX_LAG; k++) {
  acc += (R[k - 1] * R[k - 1]) / (N - k);
  Q.push(N * (N + 2) * acc);
}

// Upper-tail chi-square_m critical values (m = df = 1..5) at the 5% and 1% levels.
const CHI2_05 = [3.841, 5.991, 7.815, 9.488, 11.07]; // reject white-noise null when Q_m exceeds these
const CHI2_01 = [6.635, 9.21, 11.345, 13.277, 15.086];

const REJECTS_05 = Q.map((q, i) => q > CHI2_05[i]); // all true
const REJECTS_01 = Q.map((q, i) => q > CHI2_01[i]); // all true
const ALL_REJECT_05 = REJECTS_05.every(Boolean);
const ALL_REJECT_01 = REJECTS_01.every(Boolean);

// AR(1) geometric-decay predictions rho^k, for both the imp-33921 estimates, to test adequacy.
const RHO_AR = 0.9676; // imp-33921 conditional-MLE slope (near unit root)
const RHO_YW = 0.7573; // imp-33921 Yule-Walker lag-1 autocorrelation
const AR_PRED_AR = [1, 2, 3, 4, 5].map((k) => Math.pow(RHO_AR, k)); // 0.968, 0.936, 0.906, 0.877, 0.848
const AR_PRED_YW = [1, 2, 3, 4, 5].map((k) => Math.pow(RHO_YW, k)); // 0.757, 0.574, 0.434, 0.329, 0.249

// The empirical ACF crosses zero (turns negative) -- a positive AR(1) geometric decay cannot.
const ACF_SIGN_CHANGES = R.some((r) => r < 0) && R[0] > 0;
const FIRST_NEGATIVE_LAG = R.findIndex((r) => r < 0) + 1; // lag 4

const round = (x, d) => +x.toFixed(d);

export const IMP33964_LJUNG_BOX_PORTMANTEAU_TEST = {
  id: 'imp-33964',
  proofSection: 'S-frontier',
  question:
    'imp-33921 fit an AR(1) (rho_AR ~ +0.968) and imp-33886/imp-33920 ran a Durbin-Watson / runs test, ' +
    'but all three probed only LAG-1. Compute the sample autocorrelations r_1..r_5 of the 21 imp-33858 ' +
    'residuals and the Ljung-Box Q_m = n(n+2) sum r_k^2/(n-k) for m=1..5, compare each against ' +
    'chi-square_m, and check whether the higher-lag autocorrelations follow the geometric decay rho^k an ' +
    'AR(1) predicts (is AR(1) adequate, or is there residual higher-order structure?). Measurement only, ' +
    'no bound change; NOT an RH bound; no QED.',
  measuredQuantity:
    'The sample autocorrelations r_1..r_5 and the Ljung-Box portmanteau statistics Q_1..Q_5 = ' +
    'n(n+2) sum_{k=1}^m r_k^2/(n-k) on the 21 signed imp-33858 residuals e_k = ' +
    'ln(eflow_over_resid_k) - (a + b k), compared against the upper-tail chi-square_m critical values and ' +
    'against the AR(1) geometric-decay predictions rho^k',
  rungCount: N, // 21
  maxLag: MAX_LAG, // 5
  // The five sample autocorrelations (r_1 reproduces the imp-33858 lag-1 ~+0.757):
  autocorrelations: R.map((r) => round(r, 4)), // [0.7573, 0.4813, 0.2027, -0.0521, -0.2618]
  // The five Ljung-Box portmanteau statistics:
  ljungBoxQ: Q.map((q) => round(q, 4)), // [13.8512, 19.7404, 20.8426, 20.9197, 22.9886]
  chiSquare05: CHI2_05, // upper-tail chi-square_m, 5%
  chiSquare01: CHI2_01, // upper-tail chi-square_m, 1%
  rejectsWhiteNoise05: REJECTS_05, // [true, true, true, true, true]
  rejectsWhiteNoise01: REJECTS_01, // [true, true, true, true, true]
  whiteNoiseRejectedAtEveryLag05: ALL_REJECT_05, // true
  whiteNoiseRejectedAtEveryLag01: ALL_REJECT_01, // true
  // AR(1) geometric-decay adequacy check:
  ar1PredictedAcfFromRhoAR: AR_PRED_AR.map((x) => round(x, 4)), // 0.9676^k
  ar1PredictedAcfFromRhoYW: AR_PRED_YW.map((x) => round(x, 4)), // 0.7573^k
  empiricalAcfCrossesZero: ACF_SIGN_CHANGES, // true -- positive AR(1) cannot
  firstNegativeAutocorrLag: FIRST_NEGATIVE_LAG, // 4
  ar1GeometricDecayAdequate: !ACF_SIGN_CHANGES, // false -- sign change => residual higher-order structure
  headResidual: +RESID[0].toExponential(4), // ~ -0.1142 (k=6 endpoint)
  farTailResidual: +RESID[N - 1].toExponential(4), // ~ +0.2479 (k=11 far-tail excursion)
  finding: {
    R1_white_noise_rejected_at_every_lag:
      'The Ljung-Box statistics Q_1..Q_5 ~ 13.9, 19.7, 20.8, 20.9, 23.0 all EXCEED even the 1% ' +
      'chi-square_m critical values (6.6, 9.2, 11.3, 13.3, 15.1), so the white-noise null is rejected at ' +
      'every lag horizon m=1..5. The serial dependence the imp-33886/imp-33920 lag-1 diagnostics found is ' +
      'NOT confined to lag-1: it persists to lag-2 (r_2 ~ +0.48, the largest increment after lag-1) and ' +
      're-emerges as a negative lobe at lag-5.',
    R2_higher_lag_acf_not_pure_ar1_geometric_decay:
      'A genuine AR(1) predicts r_k = rho^k, staying positive and decaying smoothly (rho_AR ~ 0.968 gives ' +
      '0.968, 0.936, 0.906, 0.877, 0.848; rho_YW ~ 0.757 gives 0.757, 0.574, 0.434, 0.329, 0.249). The ' +
      'empirical ACF (0.757, 0.481, 0.203, -0.052, -0.262) decays much FASTER than either and CROSSES ' +
      'ZERO into negative territory by lag 4 -- a positive AR(1) cannot do that. The sign change signals ' +
      'residual higher-order (trend-curvature) structure, the classic signature of an OLS line fit to the ' +
      'curved imp-33858 hump, and corroborates imp-33921 R2 that rho_AR ~ 0.968 is an endpoint-inflated ' +
      'artifact, not the true decay rate.',
    R3_calibration_not_new_claim:
      'The portmanteau test re-reads the same imp-33858 residual ACF at higher lags; it does not change ' +
      'the RMSE (~0.116), does not re-open the imp-33843 log-linear-vs-power-law form selection, and ' +
      'touches no bound. rho ~ 0.97 describes the curvature smoothness, not its size (~12% ' +
      'multiplicative). Small-N caveat: at n=21 the higher-lag r_k rest on few pairs (n-k) and the Q_m ' +
      'chi-square reference is asymptotic.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / LJUNG-BOX PORTMANTEAU TEST (frontier-direction, NOT rigorous). The sample ' +
    'autocorrelations of the 21 signed imp-33858 residuals are r_1..r_5 ~ +0.757, +0.481, +0.203, ' +
    '-0.052, -0.262, and the Ljung-Box Q_1..Q_5 ~ 13.9, 19.7, 20.8, 20.9, 23.0 all EXCEED even the 1% ' +
    'chi-square_m critical values, so the white-noise null is REJECTED at every lag horizon m=1..5: the ' +
    'serial dependence is NOT confined to lag-1 -- it persists to lag-2 (r_2 ~ +0.48) and re-emerges as a ' +
    'negative lobe at lag-5. BUT the empirical ACF decays FASTER than the geometric rho^k an AR(1) ' +
    'predicts (rho_AR ~ 0.968 gives 0.968..0.848; rho_YW ~ 0.757 gives 0.757..0.249) and CROSSES ZERO ' +
    'into negative territory by lag 4, which a positive AR(1) cannot do, so AR(1) is NOT a fully adequate ' +
    'model -- there is residual higher-order (trend-curvature) structure, the classic signature of an OLS ' +
    'line fit to the curved imp-33858 hump, corroborating imp-33921 R2 that rho_AR ~ 0.968 is an ' +
    'endpoint-inflated artifact, not the true decay rate. This does NOT change the RMSE (~0.116, ~12% ' +
    'multiplicative), does NOT re-open the imp-33843 form selection, and touches no bound; the Q_m ' +
    'chi-square reference is a small-sample asymptotic on N=21 (higher-lag r_k rest on few pairs); the ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486 is UNTOUCHED; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33921 (the AR(1) rho_AR ~ 0.968 whose geometric decay is checked here); imp-33886 (the ' +
    'Durbin-Watson lag-1 companion); imp-33920 (the exact runs-test lag-1 companion); imp-33858 (the ' +
    'lag-1 ~+0.757 and head/far-tail endpoint residuals); imp-33843 (the aggregate RMSE ~0.116 ' +
    'log-linear fit); imp-33810 (the 21-rung ladder); imp-486 (C_mb GUE-conditional). Portmanteau ' +
    'statistic: Ljung and Box (1978).',
};

export const IMP33964_LJUNG_BOX_PORTMANTEAU_TEST_ASSERTIONS = [
  {
    // Reuse gate: the test runs on exactly the imp-33810 21-rung ladder / imp-33858 residual.
    id: 'imp33964-reuses-imp33810-ladder-and-imp33858-residual',
    description: '21 residuals on k=6.00..11.00, head/far-tail endpoints match imp-33858',
    holds: () =>
      N === 21 &&
      KS[0] === 6 &&
      KS[20] === 11 &&
      Math.abs(RESID[0] - -0.1141909) < 1e-4 &&
      Math.abs(RESID[N - 1] - 0.2478761) < 1e-4,
  },
  {
    // The lag-1 autocorrelation reproduces the imp-33858 / imp-33921 Yule-Walker value ~+0.757.
    id: 'imp33964-lag1-matches-imp33921-yule-walker',
    description: 'r_1 ~ +0.757 reproduces the imp-33858/imp-33921 lag-1 autocorrelation',
    holds: () => Math.abs(R[0] - 0.757331) < 1e-4 && R.length === 5,
  },
  {
    // The five Ljung-Box Q_m match the computed values and each exceeds even the 1% chi-square_m crit.
    id: 'imp33964-ljung-box-rejects-white-noise-at-every-lag',
    description: 'Q_1..Q_5 ~ 13.85, 19.74, 20.84, 20.92, 22.99 all exceed 1% chi-square_m; null rejected m=1..5',
    holds: () =>
      Math.abs(Q[0] - 13.851244) < 1e-2 &&
      Math.abs(Q[1] - 19.740364) < 1e-2 &&
      Math.abs(Q[2] - 20.842636) < 1e-2 &&
      Math.abs(Q[3] - 20.919709) < 1e-2 &&
      Math.abs(Q[4] - 22.988641) < 1e-2 &&
      ALL_REJECT_05 === true &&
      ALL_REJECT_01 === true,
  },
  {
    // AR(1) adequacy fails: the empirical ACF crosses zero (turns negative at lag 4), which rho^k cannot.
    id: 'imp33964-acf-crosses-zero-ar1-inadequate',
    description: 'empirical ACF turns negative by lag 4 (r_4 -0.052, r_5 -0.262); AR(1) geometric decay inadequate',
    holds: () =>
      ACF_SIGN_CHANGES === true &&
      FIRST_NEGATIVE_LAG === 4 &&
      R[3] < 0 &&
      R[4] < 0 &&
      Math.abs(R[4] - -0.261794) < 1e-4 &&
      IMP33964_LJUNG_BOX_PORTMANTEAU_TEST.ar1GeometricDecayAdequate === false,
  },
  {
    // Honesty gate: isRigorous false, no QED, PT SOTA, and the residual stays small (bound untouched).
    id: 'imp33964-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, PT SOTA, RMSE-scale residual still small',
    holds: () =>
      IMP33964_LJUNG_BOX_PORTMANTEAU_TEST.isRigorous === false &&
      /NO QED/.test(IMP33964_LJUNG_BOX_PORTMANTEAU_TEST.verdict) &&
      /remains SOTA/.test(IMP33964_LJUNG_BOX_PORTMANTEAU_TEST.verdict) &&
      /12% multiplicative/.test(IMP33964_LJUNG_BOX_PORTMANTEAU_TEST.verdict),
  },
];

for (const a of IMP33964_LJUNG_BOX_PORTMANTEAU_TEST_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33964-ljung-box-portmanteau-test assertion failed: ${a.id}`);
  }
}
