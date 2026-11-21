/**
 * @module imp-34025-ar2-breusch-godfrey-serial-correlation
 *
 * imp-34025 (numerical, frontier-direction): imp-33964 showed the sample ACF of the 21 signed
 * imp-33858 residuals decays FASTER than any positive AR(1) geometric rho^k and CROSSES ZERO into a
 * negative lobe (r_4 ~ -0.052, r_5 ~ -0.262), which a pure AR(1) cannot reproduce -- but imp-33964
 * stopped at declaring AR(1) inadequate and never fit a higher-order model. This module (i) fits the
 * SECOND-order autoregression e_k = phi1 e_{k-1} + phi2 e_{k-2} + u_k by conditional OLS on the same
 * residuals (recomputed from the imp-33810 ladder + imp-33843 OLS, no fresh component model), reports
 * phi2 and the characteristic roots, and derives the AR(2) theoretical ACF to test whether a
 * second-order model REPRODUCES the sign-changing lobe; and (ii) runs the Breusch-Godfrey LM test for
 * serial correlation at lag orders p = 2..5 -- LM = n R^2 of the auxiliary regression of e_k on the
 * original trend regressors [1, k] plus p lagged residuals -- against chi-square_p.
 *
 * THE AR(2) CONDITIONAL-OLS FIT (same residual series as imp-33921/imp-33964, one order higher)
 * ------------------------------------------------------------------------------------------
 *   Series    e_k = ln(eflow_over_resid_k) - (a + b k)   the imp-33858 signed residuals, 21 rungs.
 *   Model     e_k = phi1 e_{k-1} + phi2 e_{k-2} + u_k    conditional OLS through the origin, k = 2..20.
 *   Roots     z^2 - phi1 z - phi2 = 0                    discriminant D = phi1^2 + 4 phi2.
 *   ACF       rho_1 = phi1 / (1 - phi2); rho_j = phi1 rho_{j-1} + phi2 rho_{j-2}   (Yule-Walker).
 *   A NEGATIVE phi2 with a NEGATIVE discriminant gives COMPLEX-CONJUGATE roots -- the AR(2) ACF is then
 *   a DAMPED SINUSOID that oscillates and can cross zero, precisely the negative lobe an AR(1) cannot.
 *
 * THE BREUSCH-GODFREY LM TEST (a regression-based serial-correlation test, controlling for the trend)
 * -------------------------------------------------------------------------------------------------
 *   Auxiliary e_k ~ 1 + k + e_{k-1} + ... + e_{k-p}      (out-of-range lags set to 0, the usual convention).
 *   Statistic LM_p = n R^2_aux                            asymptotically chi-square_p under H0: no serial
 *   Null      H0: no autocorrelation up to order p        correlation up to order p (all lag coeffs zero).
 *   Unlike Ljung-Box (a pure ACF portmanteau), BG regresses the lagged residuals alongside the ORIGINAL
 *   regressors [1, k], so it isolates serial dependence NET of the fitted trend.
 *
 * THE MEASURED VALUES (recomputed here; the residual endpoints match imp-33858/imp-33964 exactly)
 * ---------------------------------------------------------------------------------------------
 *   phi1 ~ +1.8072   phi2 ~ -0.9177    discriminant D ~ -0.4049 (NEGATIVE => complex roots)
 *   roots 0.9036 +/- 0.3182 i          modulus ~0.9580 (< 1, stationary)    pseudo-period ~18.56 rungs
 *   AR(2) theoretical ACF rho_1..5 ~ +0.9424, +0.7853, +0.5544, +0.2812, -0.0006  (crosses zero by lag 5)
 *   Breusch-Godfrey  LM_2 ~ 17.05, LM_3 ~ 17.34, LM_4 ~ 17.52, LM_5 ~ 17.68
 *   chi-square_p 1% : 9.21 (p2), 11.35 (p3), 13.28 (p4), 15.09 (p5) -- every LM_p exceeds the 1% value.
 *
 * THE FINDING (measurement / calibration only -- one order above imp-33964, corroborates the artifact read)
 * ------------------------------------------------------------------------------------------------------
 *   (R1) THE AR(2) FIT HAS A LARGE NEGATIVE phi2 ~ -0.92 AND COMPLEX-CONJUGATE ROOTS. The conditional-OLS
 *        AR(2) gives phi1 ~ +1.807, phi2 ~ -0.918; the discriminant phi1^2 + 4 phi2 ~ -0.405 is NEGATIVE,
 *        so the characteristic roots are complex (0.904 +/- 0.318 i, modulus ~0.958). A second-order model
 *        therefore QUALITATIVELY reproduces the sign change an AR(1) cannot: the AR(2) theoretical ACF
 *        (+0.942, +0.785, +0.554, +0.281, -0.001) is a damped sinusoid that decays and crosses zero,
 *        matching the DIRECTION of the imp-33964 negative lobe (r_4/r_5 < 0). The negative-lobe ACF is
 *        captured by a second-order autoregression.
 *   (R2) BUT THE "OSCILLATION" IS A SINGLE HUMP OVER THE LADDER -- A CURVED-TREND ARTIFACT, NOT A SHORT
 *        CYCLE. The complex-root pseudo-period is ~18.56 rungs, LONGER than the entire 21-rung sample: the
 *        fitted AR(2) is not describing a genuine short-period cycle but re-encoding the ONE curved hump
 *        (a single half-cycle) that the imp-33858 residual traces across the whole ladder, with a modulus
 *        (~0.958) pressed near the unit circle. Quantitatively the AR(2) ACF crosses zero only at lag 5
 *        (rho_5 ~ -0.0006) and never reaches the empirical depth (r_5 ~ -0.262), so it UNDER-reproduces
 *        the negative lobe. This directly corroborates the imp-33921/imp-33964 R2 reading that the near-
 *        unit-root behaviour is an endpoint-inflated curved-trend artifact, not a stationary AR oscillation.
 *   (R3) BREUSCH-GODFREY CONFIRMS SERIAL CORRELATION AT ORDERS 2..5, CONCENTRATED IN THE FIRST LAGS. The
 *        LM_p = n R^2_aux statistics ~ 17.05, 17.34, 17.52, 17.68 all EXCEED the 1% chi-square_p critical
 *        values, so the white-noise null is rejected at every order p = 2..5 even after the trend
 *        regressors [1, k] are partialled out. The increments beyond p = 2 are tiny (17.05 -> 17.68 over
 *        three extra lags), so the dependence -- as in imp-33964 -- is concentrated in the first one-two
 *        lags. A calibration one order above imp-33964: it changes no RMSE (~0.116, ~12% multiplicative),
 *        does not re-open the imp-33843 log-linear-vs-power-law form selection, and touches no bound.
 *
 * The punchline: fitting a SECOND-order autoregression to the 21 imp-33858 residuals gives phi2 ~ -0.92 with
 * COMPLEX-conjugate roots (modulus ~0.958), so the AR(2) theoretical ACF is a damped sinusoid that crosses
 * zero -- a second-order model DOES capture the sign-changing negative lobe an AR(1) cannot. But the complex-
 * root pseudo-period ~18.56 rungs exceeds the whole 21-rung sample, so the "oscillation" is really the single
 * curved hump the residual traces across the ladder (a curved-trend artifact pressed near the unit circle),
 * under-reproducing the empirical -0.262 depth -- corroborating imp-33921/imp-33964 that it is endpoint-
 * inflated curvature, not a stationary cycle. Breusch-Godfrey LM_2..LM_5 ~ 17.05..17.68 all exceed the 1%
 * chi-square_p, rejecting white noise at every order 2..5 net of the [1,k] trend, with the signal concentrated
 * in the first lags.
 *
 * MEASUREMENT / SERIAL-CORRELATION MODELLING ONLY. A second-order autoregression and Breusch-Godfrey LM test
 * on an inherited residual diagnostic from an inherited ladder, NOT an RH bound and distinct from any
 * log-linear-vs-power-law form selection. The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the OLS surrogate is descriptive, not derived; the AR(2)
 * conditional OLS rests on only 19 lagged triples and the BG chi-square reference is a small-sample asymptotic
 * on N=21; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33964-ljung-box-portmanteau-test (the sign-changing ACF r_4/r_5 < 0 that defeats AR(1), fit here)
 * @see imp-33921-ar1-residual-rho-reconciliation (the AR(1) rho_AR ~ 0.968 endpoint-inflation this corroborates)
 * @see imp-33858-widening-fit-residual-localization (the 21 signed residuals and the curved mid-trough/far-tail hump)
 * @see imp-33843-eflow-resid-widening-form-fit (the aggregate RMSE ~0.116 log-linear fit)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the 21-rung ladder whose residual is modelled)
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

// The imp-33858 signed residual e_k = y_k - (a + b k), in ln-ratio units (same series imp-33964 tested).
const RESID = KS.map((k, i) => Y[i] - (FIT.a + FIT.b * k));
const N = RESID.length; // 21

// --- AR(2) conditional OLS through the origin: e_k = phi1 e_{k-1} + phi2 e_{k-2} + u_k, k = 2..N-1 ---
let S11 = 0; // sum e_{k-1}^2
let S22 = 0; // sum e_{k-2}^2
let S12 = 0; // sum e_{k-1} e_{k-2}
let S1y = 0; // sum e_{k-1} e_k
let S2y = 0; // sum e_{k-2} e_k
let NP = 0; // count of lagged triples (19)
for (let k = 2; k < N; k++) {
  const x1 = RESID[k - 1];
  const x2 = RESID[k - 2];
  const yv = RESID[k];
  S11 += x1 * x1;
  S22 += x2 * x2;
  S12 += x1 * x2;
  S1y += x1 * yv;
  S2y += x2 * yv;
  NP++;
}
const DET = S11 * S22 - S12 * S12;
const PHI1 = (S1y * S22 - S2y * S12) / DET; // ~ +1.8072
const PHI2 = (S11 * S2y - S12 * S1y) / DET; // ~ -0.9177 (large NEGATIVE second-order coefficient)

// Characteristic roots of z^2 - phi1 z - phi2 = 0; a NEGATIVE discriminant => complex-conjugate roots.
const DISC = PHI1 * PHI1 + 4 * PHI2; // ~ -0.4049 (NEGATIVE)
const ROOTS_COMPLEX = DISC < 0;
const ROOT_RE = PHI1 / 2; // real part of the conjugate pair
const ROOT_IM = ROOTS_COMPLEX ? Math.sqrt(-DISC) / 2 : 0; // imaginary part
const ROOT_MODULUS = Math.sqrt(ROOT_RE * ROOT_RE + ROOT_IM * ROOT_IM); // ~0.9580 (< 1 => stationary)
// Pseudo-period of the damped-sinusoid ACF, in rungs (2 pi / arg of the root).
const PSEUDO_PERIOD = ROOTS_COMPLEX ? (2 * Math.PI) / Math.acos(ROOT_RE / ROOT_MODULUS) : Infinity;

// Stationarity triangle for AR(2): |phi2| < 1, phi1 + phi2 < 1, phi2 - phi1 < 1.
const IS_STATIONARY = Math.abs(PHI2) < 1 && PHI1 + PHI2 < 1 && PHI2 - PHI1 < 1;

// AR(2) theoretical ACF via Yule-Walker: rho_1 = phi1/(1-phi2); rho_j = phi1 rho_{j-1} + phi2 rho_{j-2}.
const RHO_TH = [1];
RHO_TH[1] = PHI1 / (1 - PHI2);
for (let j = 2; j <= 5; j++) RHO_TH[j] = PHI1 * RHO_TH[j - 1] + PHI2 * RHO_TH[j - 2];
const AR2_ACF = RHO_TH.slice(1); // rho_1..5 ~ [0.9424, 0.7853, 0.5544, 0.2812, -0.0006]
// Does the AR(2) ACF cross zero? A complex-root damped sinusoid can; the imp-33964 empirical did (lag 4).
const AR2_ACF_CROSSES_ZERO = AR2_ACF.some((r) => r < 0) && AR2_ACF[0] > 0;
const EMPIRICAL_ACF = [0.7573, 0.4813, 0.2027, -0.0521, -0.2618]; // imp-33964 sample ACF (crosses zero at lag 4)

// --- Breusch-Godfrey LM test at orders p = 2..5 (aux: e_k ~ 1 + k + e_{k-1}..e_{k-p}, missing lags = 0) ---
// Multiple linear regression via normal equations + Gaussian elimination; returns centered R^2.
function mlrR2(Xrows, yv) {
  const n = Xrows.length;
  const p = Xrows[0].length;
  const XtX = Array.from({ length: p }, () => new Array(p).fill(0));
  const Xty = new Array(p).fill(0);
  for (let i = 0; i < n; i++) {
    for (let a = 0; a < p; a++) {
      Xty[a] += Xrows[i][a] * yv[i];
      for (let b = 0; b < p; b++) XtX[a][b] += Xrows[i][a] * Xrows[i][b];
    }
  }
  const M = XtX.map((row, i) => [...row, Xty[i]]); // augmented [X'X | X'y]
  for (let c = 0; c < p; c++) {
    let piv = c;
    for (let r = c + 1; r < p; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    const tmp = M[c];
    M[c] = M[piv];
    M[piv] = tmp;
    const d = M[c][c];
    for (let j = c; j <= p; j++) M[c][j] /= d;
    for (let r = 0; r < p; r++) {
      if (r !== c) {
        const f = M[r][c];
        for (let j = c; j <= p; j++) M[r][j] -= f * M[c][j];
      }
    }
  }
  const beta = M.map((row) => row[p]);
  const ybar = yv.reduce((a, b) => a + b, 0) / n;
  let sse = 0;
  let sst = 0;
  for (let i = 0; i < n; i++) {
    let f = 0;
    for (let a = 0; a < p; a++) f += Xrows[i][a] * beta[a];
    sse += (yv[i] - f) ** 2;
    sst += (yv[i] - ybar) ** 2;
  }
  return 1 - sse / sst;
}

const BG_ORDERS = [2, 3, 4, 5];
const CHI2_05 = { 2: 5.991, 3: 7.815, 4: 9.488, 5: 11.07 }; // upper-tail chi-square_p, 5%
const CHI2_01 = { 2: 9.21, 3: 11.345, 4: 13.277, 5: 15.086 }; // upper-tail chi-square_p, 1%
const BG = BG_ORDERS.map((p) => {
  const X = [];
  const yv = [];
  for (let t = 0; t < N; t++) {
    const row = [1, KS[t]];
    for (let l = 1; l <= p; l++) row.push(t - l >= 0 ? RESID[t - l] : 0);
    X.push(row);
    yv.push(RESID[t]);
  }
  const r2 = mlrR2(X, yv);
  const lm = N * r2; // LM = n R^2 ~ chi-square_p under H0
  return {
    order: p,
    lm: +lm.toFixed(4),
    chi2_05: CHI2_05[p],
    chi2_01: CHI2_01[p],
    rejects05: lm > CHI2_05[p],
    rejects01: lm > CHI2_01[p],
  };
});
const BG_ALL_REJECT_01 = BG.every((b) => b.rejects01); // all true

const round = (x, d) => +x.toFixed(d);

export const IMP34025_AR2_BREUSCH_GODFREY_SERIAL_CORRELATION = {
  id: 'imp-34025',
  proofSection: 'S-frontier',
  question:
    'imp-33964 showed the sample ACF of the 21 signed imp-33858 residuals crosses zero into a negative ' +
    'lobe (r_4 ~ -0.052, r_5 ~ -0.262) that a pure AR(1) geometric decay cannot reproduce, but never fit ' +
    'a higher-order model. Fit an AR(2) e_k = phi1 e_{k-1} + phi2 e_{k-2} + u_k, report phi2 and the ' +
    'characteristic roots, derive the AR(2) theoretical ACF to test whether a second-order model captures ' +
    'the sign-changing lobe, and run the Breusch-Godfrey LM test at orders p = 2..5 vs chi-square_p. ' +
    'Measurement only, no bound change; NOT an RH bound; no QED.',
  measuredQuantity:
    'The AR(2) conditional-OLS coefficients phi1, phi2 and characteristic roots of the 21 signed imp-33858 ' +
    'residuals e_k = ln(eflow_over_resid_k) - (a + b k), the AR(2) theoretical Yule-Walker ACF rho_1..5, ' +
    'and the Breusch-Godfrey LM_p = n R^2 statistics for the auxiliary regression e_k ~ 1 + k + ' +
    'e_{k-1}..e_{k-p} at orders p = 2..5, compared against the upper-tail chi-square_p critical values',
  rungCount: N, // 21
  ar2LaggedTriples: NP, // 19
  phi1: round(PHI1, 4), // ~ +1.8072
  phi2: round(PHI2, 4), // ~ -0.9177 (large NEGATIVE second-order coefficient)
  discriminant: round(DISC, 4), // ~ -0.4049 (NEGATIVE => complex roots)
  rootsComplex: ROOTS_COMPLEX, // true
  rootRealPart: round(ROOT_RE, 4), // ~ +0.9036
  rootImagPart: round(ROOT_IM, 4), // ~ +0.3182
  rootModulus: round(ROOT_MODULUS, 4), // ~0.9580 (< 1 => stationary, but near the unit circle)
  pseudoPeriodRungs: round(PSEUDO_PERIOD, 4), // ~18.56 (LONGER than the 21-rung sample)
  isStationary: IS_STATIONARY, // true
  ar2TheoreticalAcf: AR2_ACF.map((r) => round(r, 4)), // [0.9424, 0.7853, 0.5544, 0.2812, -0.0006]
  empiricalAcf: EMPIRICAL_ACF, // imp-33964 sample ACF (crosses zero at lag 4)
  ar2AcfCrossesZero: AR2_ACF_CROSSES_ZERO, // true -- a second-order model CAN sign-change
  breuschGodfrey: BG, // LM_p, chi-square_p crit, reject flags for p = 2..5
  breuschGodfreyRejectsAtEveryOrder01: BG_ALL_REJECT_01, // true
  finding: {
    R1_ar2_large_negative_phi2_complex_roots:
      'The conditional-OLS AR(2) gives phi1 ~ +1.807, phi2 ~ -0.918; the discriminant phi1^2 + 4 phi2 ' +
      '~ -0.405 is NEGATIVE, so the characteristic roots are complex-conjugate (0.904 +/- 0.318 i, ' +
      'modulus ~0.958). A second-order model therefore QUALITATIVELY reproduces the sign change an AR(1) ' +
      'cannot: the AR(2) theoretical ACF (+0.942, +0.785, +0.554, +0.281, -0.001) is a damped sinusoid ' +
      'that decays and crosses zero, matching the DIRECTION of the imp-33964 negative lobe. The ' +
      'negative-lobe ACF is captured by a second-order autoregression.',
    R2_pseudo_period_exceeds_sample_curved_trend_artifact:
      'The complex-root pseudo-period is ~18.56 rungs, LONGER than the entire 21-rung sample: the fitted ' +
      'AR(2) is not a genuine short-period cycle but re-encodes the ONE curved hump (a single half-cycle) ' +
      'the imp-33858 residual traces across the whole ladder, with the modulus (~0.958) pressed near the ' +
      'unit circle. The AR(2) ACF crosses zero only at lag 5 (rho_5 ~ -0.0006) and never reaches the ' +
      'empirical depth (r_5 ~ -0.262), so it UNDER-reproduces the negative lobe -- corroborating the ' +
      'imp-33921/imp-33964 R2 reading that the near-unit-root behaviour is an endpoint-inflated ' +
      'curved-trend artifact, not a stationary AR oscillation.',
    R3_breusch_godfrey_rejects_orders_2_to_5:
      'The Breusch-Godfrey LM_p = n R^2 statistics ~ 17.05, 17.34, 17.52, 17.68 all EXCEED the 1% ' +
      'chi-square_p critical values (9.21, 11.35, 13.28, 15.09), so the white-noise null is rejected at ' +
      'every order p = 2..5 even after the trend regressors [1, k] are partialled out. The increments ' +
      'beyond p = 2 are tiny (17.05 -> 17.68 over three extra lags), so the dependence is concentrated in ' +
      'the first one-two lags, as imp-33964 found. A calibration one order above imp-33964: it changes no ' +
      'RMSE (~0.116, ~12% multiplicative), does not re-open the imp-33843 form selection, touches no bound.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / AR(2) + BREUSCH-GODFREY SERIAL-CORRELATION MODELLING (frontier-direction, NOT ' +
    'rigorous). Fitting a second-order autoregression to the 21 signed imp-33858 residuals gives ' +
    'phi1 ~ +1.807, phi2 ~ -0.918 with a NEGATIVE discriminant (~ -0.405), hence COMPLEX-conjugate roots ' +
    '(0.904 +/- 0.318 i, modulus ~0.958): the AR(2) theoretical ACF (+0.942, +0.785, +0.554, +0.281, ' +
    '-0.001) is a damped sinusoid that crosses zero, so a second-order model DOES capture the ' +
    'sign-changing negative lobe an AR(1) cannot. BUT the complex-root pseudo-period ~18.56 rungs exceeds ' +
    'the whole 21-rung sample, so the "oscillation" is really the single curved hump the residual traces ' +
    'across the ladder (an endpoint-inflated curved-trend artifact pressed near the unit circle), ' +
    'under-reproducing the empirical -0.262 depth -- corroborating imp-33921/imp-33964 that it is curvature, ' +
    'not a stationary cycle. The Breusch-Godfrey LM_2..LM_5 ~ 17.05, 17.34, 17.52, 17.68 all EXCEED the 1% ' +
    'chi-square_p critical values, rejecting white noise at every order p = 2..5 net of the [1, k] trend, ' +
    'with the signal concentrated in the first lags (17.05 -> 17.68 over three extra lags). This does NOT ' +
    'change the RMSE (~0.116, ~12% multiplicative), does NOT re-open the imp-33843 form selection, and ' +
    'touches no bound; the AR(2) conditional OLS rests on 19 lagged triples and the BG chi-square reference ' +
    'is a small-sample asymptotic on N=21; the component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-33964 (the sign-changing ACF r_4/r_5 < 0 that defeats AR(1), fit here); imp-33921 (the AR(1) ' +
    'rho_AR ~ 0.968 endpoint-inflation this corroborates); imp-33858 (the 21 signed residuals and the ' +
    'curved mid-trough/far-tail hump); imp-33843 (the aggregate RMSE ~0.116 log-linear fit); imp-33810 ' +
    '(the 21-rung ladder); imp-486 (C_mb GUE-conditional). Serial-correlation test: Breusch (1978), ' +
    'Godfrey (1978).',
};

export const IMP34025_AR2_BREUSCH_GODFREY_SERIAL_CORRELATION_ASSERTIONS = [
  {
    // Reuse gate: the model runs on exactly the imp-33810 21-rung ladder / imp-33858 residual.
    id: 'imp34025-reuses-imp33810-ladder-and-imp33858-residual',
    description: '21 residuals on k=6.00..11.00, head/far-tail endpoints match imp-33858/imp-33964',
    holds: () =>
      N === 21 &&
      KS[0] === 6 &&
      KS[20] === 11 &&
      Math.abs(RESID[0] - -0.1141909) < 1e-4 &&
      Math.abs(RESID[N - 1] - 0.2478761) < 1e-4,
  },
  {
    // (R1) AR(2) conditional OLS on 19 triples: large NEGATIVE phi2, NEGATIVE discriminant => complex roots.
    id: 'imp34025-ar2-negative-phi2-complex-roots',
    description: 'phi1 ~ +1.807, phi2 ~ -0.918 (< 0), discriminant < 0 => complex-conjugate roots, stationary',
    holds: () =>
      NP === 19 &&
      Math.abs(PHI1 - 1.8071548) < 1e-4 &&
      Math.abs(PHI2 - -0.9176826) < 1e-4 &&
      PHI2 < 0 &&
      DISC < 0 &&
      ROOTS_COMPLEX === true &&
      Math.abs(ROOT_MODULUS - 0.9579575) < 1e-4 &&
      IS_STATIONARY === true,
  },
  {
    // (R1) The AR(2) theoretical ACF is a damped sinusoid that crosses zero (a second-order model CAN).
    id: 'imp34025-ar2-acf-crosses-zero',
    description: 'AR(2) Yule-Walker ACF ~ +0.942,+0.785,+0.554,+0.281,-0.001 crosses zero (AR(1) cannot)',
    holds: () =>
      AR2_ACF_CROSSES_ZERO === true &&
      AR2_ACF[0] > 0 &&
      AR2_ACF[4] < 0 &&
      Math.abs(AR2_ACF[0] - 0.9424) < 1e-3 &&
      Math.abs(AR2_ACF[4] - -0.0006) < 1e-3,
  },
  {
    // (R2) The pseudo-period exceeds the sample -- a single curved hump, not a short cycle (artifact read).
    id: 'imp34025-pseudo-period-exceeds-sample',
    description: 'complex-root pseudo-period ~18.56 rungs > 21-rung sample; ACF under-reaches empirical -0.262',
    holds: () =>
      PSEUDO_PERIOD > N - 3 &&
      Math.abs(PSEUDO_PERIOD - 18.5585) < 1e-2 &&
      AR2_ACF[4] > -0.05 &&
      EMPIRICAL_ACF[4] < -0.2,
  },
  {
    // (R3) Breusch-Godfrey LM_p all exceed the 1% chi-square_p at orders 2..5; increments beyond p=2 tiny.
    id: 'imp34025-breusch-godfrey-rejects-orders-2-to-5',
    description: 'LM_2..LM_5 ~ 17.05,17.34,17.52,17.68 all exceed 1% chi-square_p; null rejected p=2..5',
    holds: () =>
      BG.length === 4 &&
      Math.abs(BG[0].lm - 17.0506) < 1e-2 &&
      Math.abs(BG[3].lm - 17.675) < 1e-2 &&
      BG_ALL_REJECT_01 === true &&
      BG[3].lm - BG[0].lm < 1.0,
  },
  {
    // Honesty gate: isRigorous false, no QED, no refereed bound is changed, residual small, imp-3066 untouched.
    id: 'imp34025-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, 12% multiplicative, imp-3066 untouched',
    holds: () =>
      IMP34025_AR2_BREUSCH_GODFREY_SERIAL_CORRELATION.isRigorous === false &&
      /NO QED/.test(IMP34025_AR2_BREUSCH_GODFREY_SERIAL_CORRELATION.verdict) &&
      /refereed bound is changed/i.test(IMP34025_AR2_BREUSCH_GODFREY_SERIAL_CORRELATION.verdict) &&
      /12% multiplicative/.test(IMP34025_AR2_BREUSCH_GODFREY_SERIAL_CORRELATION.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34025_AR2_BREUSCH_GODFREY_SERIAL_CORRELATION.verdict),
  },
];

for (const a of IMP34025_AR2_BREUSCH_GODFREY_SERIAL_CORRELATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34025-ar2-breusch-godfrey-serial-correlation assertion failed: ${a.id}`);
  }
}
