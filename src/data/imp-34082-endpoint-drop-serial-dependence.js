/**
 * @module imp-34082-endpoint-drop-serial-dependence
 *
 * imp-34082 (numerical, frontier-direction): imp-34025 R2 read the near-unit-root AR(2) fit of the
 * imp-33858 residual as an ENDPOINT-INFLATED curved-trend artifact -- i.e. it argued the strong
 * serial dependence (imp-33964 Ljung-Box rejecting white-noise at every lag, imp-33886/imp-33921
 * lag-1 Durbin-Watson / rho ~ +0.968) is carried by the two boundary rungs (the k=6 head residual
 * ~-0.114 and the k=11 far-tail excursion ~+0.248). That reading was never TESTED by actually
 * dropping the endpoints. This module does the leave-endpoints-out check: it drops the k=6 head and
 * k=11 tail rungs, re-fits the imp-33843 log-linear OLS on the 19 INTERIOR rungs (k=6.25..10.75),
 * and recomputes the Durbin-Watson statistic and the Ljung-Box Q_1..Q_5 on the interior residual,
 * comparing each against the full-ladder value to measure how much of the serial-dependence signal
 * is endpoint-carried versus interior-carried.
 *
 * THE LEAVE-ENDPOINTS-OUT RE-FIT (same ladder / same log-linear form as imp-33964, endpoints dropped)
 * --------------------------------------------------------------------------------------------------
 *   Series     y_k = ln(eflow_over_resid_k)                 the imp-33810 ladder, 21 quarter-decade rungs.
 *   Full fit   y_k = a + b k on k = 6.00..11.00 (n=21)      the imp-33843 log-linear WINNER (imp-33964 base).
 *   Interior   y_k = a + b k on k = 6.25..10.75 (n=19)      SAME form, the two boundary rungs dropped.
 *   Residual   e_k = y_k - (a + b k)                        re-fit on the interior support only.
 *   If the imp-34025 R2 "endpoint-inflated" reading were right, dropping the k=6 head and k=11 tail
 *   should COLLAPSE the serial dependence -- r_1 toward 0, DW toward 2, Q_m below the chi-square_m.
 *
 * THE TWO SERIAL-DEPENDENCE DIAGNOSTICS (Durbin-Watson lag-1 + Ljung-Box portmanteau lags 1..5)
 * -------------------------------------------------------------------------------------------
 *   DW         DW = sum_{i=2}^n (e_i - e_{i-1})^2 / sum_i e_i^2   Durbin-Watson (1950), ~2 under the null,
 *              ->0 under strong POSITIVE autocorrelation (DW ~ 2(1 - r_1)).
 *   Q_m        Q_m = n(n+2) sum_{k=1}^m r_k^2 / (n - k)          Ljung-Box (1978) portmanteau statistic.
 *   Null       H0: no serial correlation (white noise); under H0 Q_m ~ chi-square_m asymptotically.
 *   Reject     reject the white-noise null when Q_m EXCEEDS the upper-tail chi-square_m critical value.
 *
 * THE MEASURED VALUES (recomputed here; the full ladder reproduces imp-33964 / imp-33886 exactly)
 * ---------------------------------------------------------------------------------------------
 *   FULL     DW ~ 0.2219  r_1 ~ +0.7573  r_5 ~ -0.2618  Q_1..5 ~ 13.85, 19.74, 20.84, 20.92, 22.99
 *   INTERIOR DW ~ 0.2212  r_1 ~ +0.7524  r_5 ~ -0.3039  Q_1..5 ~ 12.55, 17.61, 18.34, 18.57, 21.20
 *   chi-square_m 1% : 6.635, 9.21, 11.345, 13.277, 15.086 -- EVERY interior Q_m still clears the 1% value.
 *   DW is essentially UNMOVED (0.2219 -> 0.2212, a ~0.3% change); r_1 shrinks only ~0.6%; the negative
 *   lobe r_5 DEEPENS (-0.262 -> -0.304). Dropping the endpoints does NOT collapse the dependence.
 *
 * THE FINDING (measurement / calibration only -- the serial dependence is interior-carried, not endpoint-carried)
 * -------------------------------------------------------------------------------------------------------------
 *   (R1) DROPPING THE ENDPOINTS BARELY MOVES DURBIN-WATSON -- THE LAG-1 SIGNAL IS INTERIOR-CARRIED. DW
 *        goes 0.2219 (full) -> 0.2212 (interior), a ~0.3% change, both far below the DW ~2 white-noise
 *        centre and below the n~19-21 lower critical bound d_L ~ 1.18 -- so the interior still shows
 *        strong positive lag-1 autocorrelation. r_1 shrinks only ~0.6% (0.7573 -> 0.7524). The lag-1
 *        dependence is NOT endpoint-inflated.
 *   (R2) THE LJUNG-BOX NULL IS STILL REJECTED AT EVERY HORIZON m = 1..5 ON THE INTERIOR. Interior Q_1..Q_5
 *        ~ 12.55, 17.61, 18.34, 18.57, 21.20 every one still EXCEEDS the 1% chi-square_m (6.635, 9.21,
 *        11.345, 13.277, 15.086). The Q_m shrink only mildly (~9-11%, the loss of two data pairs), never
 *        approaching the critical values -- so the white-noise rejection is NOT driven by the two boundary
 *        rungs; it persists in the interior essentially undiminished.
 *   (R3) THE NEGATIVE FAR-LAG LOBE DEEPENS RATHER THAN SHRINKING -- THE CURVED HUMP IS AN INTERIOR FEATURE.
 *        The interior ACF far lobe r_5 goes -0.262 -> -0.304 (deeper, not flatter) and the sign change stays
 *        at lag 4, so the trend-curvature structure imp-33964 R2 diagnosed is carried by the interior rungs,
 *        not the endpoints. This directly REFUTES the imp-34025 R2 "endpoint-inflated curved-trend artifact"
 *        reading: the near-unit-root serial dependence survives leaving the endpoints out. It re-opens no
 *        imp-33843 form selection (log-linear stays the reported WINNER) and touches no bound.
 *
 * The punchline: dropping the k=6 head and k=11 tail rungs and re-fitting the imp-33843 log-linear OLS on the
 * 19 interior rungs leaves the serial dependence essentially intact -- DW moves only 0.2219 -> 0.2212, r_1
 * shrinks only ~0.6% (0.757 -> 0.752), the Ljung-Box Q_1..Q_5 all STILL exceed the 1% chi-square_m, and the
 * negative far-lobe DEEPENS (r_5 -0.262 -> -0.304). So the imp-33964 white-noise rejection is interior-carried,
 * NOT endpoint-inflated: the imp-34025 R2 endpoint-artifact reading is refuted by the leave-endpoints-out test.
 *
 * MEASUREMENT / LEAVE-ENDPOINTS-OUT DIAGNOSTIC ONLY. An endpoint-drop robustness check on an inherited residual
 * diagnostic from an inherited ladder, NOT an RH bound. It does NOT re-open the imp-33843 form selection
 * (log-linear stays the winner); dropping endpoints is a robustness probe, not a new fit; at n=19 the higher-lag
 * r_k rest on even fewer pairs (n-k) and the Q_m chi-square reference is a small-sample asymptotic. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the OLS surrogate is
 * descriptive, not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34025-ar2-breusch-godfrey-serial-correlation (the R2 endpoint-inflated-artifact reading tested here)
 * @see imp-34081-cubic-detrend-ljung-box (the cubic-detrend remedy that also failed to whiten the same residual)
 * @see imp-33964-ljung-box-portmanteau-test (the full-ladder Ljung-Box null this leaves the endpoints out of)
 * @see imp-33886-widening-residual-significance-test (the full-ladder Durbin-Watson lag-1 companion)
 * @see imp-33921-ar1-residual-rho-reconciliation (the rho_AR ~ 0.968 near-unit-root read as endpoint-inflated)
 * @see imp-33858-widening-fit-residual-localization (the k=6 head ~-0.114 and k=11 far-tail ~+0.248 endpoints)
 * @see imp-33843-eflow-resid-widening-form-fit (the RMSE ~0.116 log-linear WINNER, still the reported model)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the 21-rung ladder whose interior is re-fit)
 */

import { IMP33810_EFLOW_RESID_RATIO_N_LADDER } from './imp-33810-eflow-resid-ratio-N-ladder.js';

// Reuse the imp-33810 21-rung ladder VERBATIM (no fresh component model).
const RUNGS = IMP33810_EFLOW_RESID_RATIO_N_LADDER.ladder;
const KS_FULL = RUNGS.map((r) => r.k);
const Y_FULL = RUNGS.map((r) => Math.log(r.eflow_over_resid)); // natural log of the imp-33810 ratio

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

// Given a support (KS, Y), re-fit the log-linear OLS and return the residual + DW + ACF + Ljung-Box.
function diagnostics(KS, Y) {
  const n = KS.length;
  const fit = ols(KS, Y);
  const resid = KS.map((k, i) => Y[i] - (fit.a + fit.b * k));
  const mean = resid.reduce((a, b) => a + b, 0) / n; // ~1e-17 by OLS construction
  const rmse = Math.sqrt(resid.reduce((s, e) => s + e * e, 0) / n);
  // Durbin-Watson: sum of squared successive differences over sum of squares (~2 under the null).
  let dwNum = 0;
  let dwDen = 0;
  for (let i = 1; i < n; i++) dwNum += (resid[i] - resid[i - 1]) ** 2;
  for (let i = 0; i < n; i++) dwDen += resid[i] * resid[i];
  const dw = dwNum / dwDen;
  // Sample autocorrelation r_k = sum_{i>=k}(e_i - mean)(e_{i-k} - mean) / S0.
  const s0 = resid.reduce((s, e) => s + (e - mean) * (e - mean), 0);
  const acf = (k) => {
    let c = 0;
    for (let i = k; i < n; i++) c += (resid[i] - mean) * (resid[i - k] - mean);
    return c / s0;
  };
  const R = [];
  for (let k = 1; k <= 5; k++) R.push(acf(k));
  // Ljung-Box (1978) portmanteau Q_m = n(n+2) sum_{k=1}^m r_k^2 / (n - k), m = 1..5.
  const Q = [];
  let acc = 0;
  for (let k = 1; k <= 5; k++) {
    acc += (R[k - 1] * R[k - 1]) / (n - k);
    Q.push(n * (n + 2) * acc);
  }
  return { n, fit, resid, rmse, dw, R, Q, firstNegativeLag: R.findIndex((r) => r < 0) + 1 };
}

// Full ladder (reproduces imp-33964 / imp-33886 exactly) and the endpoint-dropped interior.
const FULL = diagnostics(KS_FULL, Y_FULL); // k = 6.00..11.00, n = 21
const KS_INT = KS_FULL.slice(1, -1); // drop the k=6 head and k=11 tail
const Y_INT = Y_FULL.slice(1, -1);
const INT = diagnostics(KS_INT, Y_INT); // k = 6.25..10.75, n = 19

// Upper-tail chi-square_m critical values (m = df = 1..5) at the 5% and 1% levels.
const CHI2_05 = [3.841, 5.991, 7.815, 9.488, 11.07];
const CHI2_01 = [6.635, 9.21, 11.345, 13.277, 15.086];
const INT_REJECTS_05 = INT.Q.map((q, i) => q > CHI2_05[i]); // all true
const INT_REJECTS_01 = INT.Q.map((q, i) => q > CHI2_01[i]); // all true
const INT_ALL_REJECT_01 = INT_REJECTS_01.every(Boolean); // true -- null still rejected in the interior
const INT_NULL_STILL_REJECTED = INT_REJECTS_01.filter(Boolean).length; // 5 of 5

// How much of the signal is endpoint-carried: the change in DW, r_1, and Q_1 from full to interior.
const DW_CHANGE_FRAC = Math.abs(INT.dw - FULL.dw) / FULL.dw; // ~0.003 -- essentially unmoved
const R1_SHRINK_FRAC = (FULL.R[0] - INT.R[0]) / FULL.R[0]; // ~0.006 -- r_1 barely shrinks
const NEG_LOBE_DEEPENS = INT.R[4] < FULL.R[4]; // true: -0.304 < -0.262 (deeper, not flatter)
const DW_STILL_BELOW_DL = INT.dw < 1.18; // n~19-21 k=1 lower critical bound d_L ~ 1.18

const round = (x, d) => +x.toFixed(d);

export const IMP34082_ENDPOINT_DROP_SERIAL_DEPENDENCE = {
  id: 'imp-34082',
  proofSection: 'S-frontier',
  question:
    'imp-34025 R2 read the near-unit-root AR(2) fit of the imp-33858 residual as an endpoint-inflated ' +
    'curved-trend artifact -- arguing the imp-33964 white-noise rejection is carried by the k=6 head and ' +
    'k=11 tail rungs -- but never TESTED it by dropping the endpoints. Drop the k=6 head and k=11 tail ' +
    'rungs, re-fit the imp-33843 log-linear OLS on the 19 interior rungs (k=6.25..10.75), and recompute ' +
    'the Durbin-Watson statistic and the Ljung-Box Q_1..Q_5, comparing against the full-ladder values to ' +
    'measure whether the white-noise rejection is endpoint-carried or persists in the interior. ' +
    'Measurement only, no bound change; NOT an RH bound; no QED.',
  measuredQuantity:
    'The Durbin-Watson statistic DW = sum(e_i - e_{i-1})^2 / sum e_i^2 and the Ljung-Box portmanteau ' +
    'Q_m = n(n+2) sum_{k=1}^m r_k^2/(n-k) for m = 1..5, recomputed on the log-linear residual re-fit on ' +
    'the 19 INTERIOR imp-33810 rungs (k=6.25..10.75, the k=6 head and k=11 tail dropped), each compared ' +
    'against the full-ladder (n=21) value and the upper-tail chi-square_m critical values',
  fullRungCount: FULL.n, // 21
  interiorRungCount: INT.n, // 19
  // Durbin-Watson (~2 under the null; ->0 under strong positive lag-1 autocorrelation):
  durbinWatsonFull: round(FULL.dw, 4), // ~0.2219 (reproduces imp-33886)
  durbinWatsonInterior: round(INT.dw, 4), // ~0.2212 -- essentially unmoved
  durbinWatsonChangeFraction: round(DW_CHANGE_FRAC, 4), // ~0.0033
  durbinWatsonStillBelowLowerCrit: DW_STILL_BELOW_DL, // true -- still below d_L ~1.18
  // Sample ACF r_1..r_5:
  acfFull: FULL.R.map((r) => round(r, 4)), // [0.7573, 0.4813, 0.2027, -0.0521, -0.2618]
  acfInterior: INT.R.map((r) => round(r, 4)), // [0.7524, 0.4642, 0.1718, -0.0928, -0.3039]
  lag1ShrinkFraction: round(R1_SHRINK_FRAC, 4), // ~0.0065 -- r_1 barely shrinks
  firstNegativeLagFull: FULL.firstNegativeLag, // 4
  firstNegativeLagInterior: INT.firstNegativeLag, // 4 (unchanged)
  negativeLobeDeepens: NEG_LOBE_DEEPENS, // true -- r_5 -0.262 -> -0.304 (deeper, not flatter)
  // Ljung-Box Q_1..Q_5:
  ljungBoxQFull: FULL.Q.map((q) => round(q, 4)), // [13.8512, 19.7404, 20.8426, 20.9197, 22.9886]
  ljungBoxQInterior: INT.Q.map((q) => round(q, 4)), // [12.5501, 17.6083, 18.3441, 18.5731, 21.2047]
  chi2Crit05: CHI2_05,
  chi2Crit01: CHI2_01,
  interiorRejectsAt05: INT_REJECTS_05, // all true
  interiorRejectsAt01: INT_REJECTS_01, // all true
  interiorNullStillRejectedAt01: INT_ALL_REJECT_01, // true
  interiorHorizonsRejectedAt01: INT_NULL_STILL_REJECTED, // 5 of 5
  interiorResidHead: round(INT.resid[0], 4), // ~ -0.0364 (k=6.25, new interior head)
  interiorResidTail: round(INT.resid[INT.n - 1], 4), // ~ +0.2217 (k=10.75, new interior tail)
  finding: {
    R1_durbin_watson_barely_moves_lag1_interior_carried:
      'DW goes 0.2219 (full) -> 0.2212 (interior), a ~0.3% change, both far below the DW ~2 white-noise ' +
      'centre and below the n~19-21 lower critical bound d_L ~ 1.18, so the interior still shows strong ' +
      'positive lag-1 autocorrelation. r_1 shrinks only ~0.6% (0.7573 -> 0.7524). The lag-1 serial ' +
      'dependence is NOT endpoint-inflated -- it is interior-carried.',
    R2_ljung_box_still_rejects_at_every_horizon_on_interior:
      'Interior Q_1..Q_5 ~ 12.55, 17.61, 18.34, 18.57, 21.20 EVERY one still exceeds the 1% chi-square_m ' +
      '(6.635, 9.21, 11.345, 13.277, 15.086); the Q_m shrink only ~9-11% (the loss of two data pairs) and ' +
      'never approach the critical values. So the imp-33964 white-noise rejection is NOT driven by the two ' +
      'boundary rungs -- it persists in the interior essentially undiminished.',
    R3_negative_lobe_deepens_curved_hump_is_interior_refutes_imp34025:
      'The interior ACF far lobe r_5 goes -0.262 -> -0.304 (DEEPER, not flatter) and the sign change stays ' +
      'at lag 4, so the trend-curvature structure imp-33964 R2 diagnosed is carried by the interior rungs, ' +
      'not the endpoints. This directly REFUTES the imp-34025 R2 "endpoint-inflated curved-trend artifact" ' +
      'reading: the near-unit-root serial dependence survives leaving the endpoints out. It re-opens no ' +
      'imp-33843 form selection (log-linear stays the reported winner) and touches no bound.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / LEAVE-ENDPOINTS-OUT DIAGNOSTIC (frontier-direction, NOT rigorous). Dropping the k=6 head ' +
    'and k=11 tail rungs and re-fitting the imp-33843 log-linear OLS on the 19 interior rungs (k=6.25..10.75) ' +
    'leaves the serial dependence essentially intact: the Durbin-Watson statistic moves only 0.2219 -> 0.2212 ' +
    '(~0.3%, both far below the DW ~2 white-noise centre and the d_L ~1.18 lower critical bound), the lag-1 ' +
    'autocorrelation shrinks only ~0.6% (r_1 0.757 -> 0.752), the Ljung-Box Q_1..Q_5 ~ 12.55, 17.61, 18.34, ' +
    '18.57, 21.20 EVERY one still exceeds the 1% chi-square_m (6.635, 9.21, 11.345, 13.277, 15.086), and the ' +
    'negative far-lobe DEEPENS (r_5 -0.262 -> -0.304) rather than flattening. So the imp-33964 white-noise ' +
    'rejection is interior-carried, NOT endpoint-inflated -- the imp-34025 R2 "endpoint-inflated curved-trend ' +
    'artifact" reading is refuted by the leave-endpoints-out test. This does NOT re-open the imp-33843 ' +
    'log-linear-vs-power-law form selection (log-linear stays the reported winner), does NOT change the ' +
    'reported RMSE (~0.116, ~12% multiplicative), and touches no bound; at n=19 the higher-lag r_k rest on ' +
    'even fewer pairs (n-k) and the Q_m chi-square reference is a small-sample asymptotic; the component ' +
    'model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34025 (the R2 endpoint-inflated-artifact reading tested here); imp-34081 (the cubic-detrend remedy ' +
    'that also failed to whiten the same residual); imp-33964 (the full-ladder Ljung-Box null); imp-33886 ' +
    '(the full-ladder Durbin-Watson lag-1 companion); imp-33921 (the rho_AR ~ 0.968 near-unit-root); ' +
    'imp-33858 (the k=6 head and k=11 far-tail endpoint residuals); imp-33843 (the RMSE ~0.116 log-linear ' +
    'WINNER, still the reported model); imp-33810 (the 21-rung ladder); imp-486 (C_mb GUE-conditional). ' +
    'Durbin-Watson (1950); Ljung and Box (1978).',
};

export const IMP34082_ENDPOINT_DROP_SERIAL_DEPENDENCE_ASSERTIONS = [
  {
    // Reuse gate: the full ladder reproduces the imp-33964 / imp-33886 residual and its lag-1 diagnostics.
    id: 'imp34082-full-ladder-reproduces-imp33964-imp33886',
    description: '21 rungs k=6..11; full DW ~0.2219 and r_1 ~+0.757 / Q_1 ~13.85 reproduce imp-33886/imp-33964',
    holds: () =>
      FULL.n === 21 &&
      KS_FULL[0] === 6 &&
      KS_FULL[20] === 11 &&
      Math.abs(FULL.dw - 0.2219328) < 1e-4 &&
      Math.abs(FULL.R[0] - 0.757331) < 1e-4 &&
      Math.abs(FULL.Q[0] - 13.851244) < 1e-2,
  },
  {
    // Interior support gate: exactly the 19 interior rungs k=6.25..10.75 (endpoints dropped).
    id: 'imp34082-interior-support-drops-both-endpoints',
    description: '19 interior rungs k=6.25..10.75 (k=6 head and k=11 tail dropped)',
    holds: () =>
      INT.n === 19 &&
      Math.abs(KS_INT[0] - 6.25) < 1e-9 &&
      Math.abs(KS_INT[18] - 10.75) < 1e-9 &&
      Math.abs(INT.resid[0] - -0.0363864) < 1e-4 &&
      Math.abs(INT.resid[18] - 0.2217414) < 1e-4,
  },
  {
    // (R1) Durbin-Watson barely moves (0.2219 -> 0.2212) -- the lag-1 dependence is interior-carried.
    id: 'imp34082-durbin-watson-barely-moves',
    description: 'DW 0.2219 -> 0.2212 (~0.3% change), still below d_L ~1.18; r_1 shrinks only ~0.6%',
    holds: () =>
      Math.abs(INT.dw - 0.2212108) < 1e-4 &&
      DW_CHANGE_FRAC < 0.01 &&
      DW_STILL_BELOW_DL === true &&
      R1_SHRINK_FRAC < 0.02 &&
      R1_SHRINK_FRAC > 0,
  },
  {
    // (R2) The interior Ljung-Box null is still rejected at every horizon m=1..5 (all clear the 1% crit).
    id: 'imp34082-interior-ljung-box-still-rejects-every-horizon',
    description: 'interior Q_1..5 ~ 12.55,17.61,18.34,18.57,21.20 all exceed 1% chi-square_m; null still rejected',
    holds: () =>
      INT.Q.length === 5 &&
      Math.abs(INT.Q[0] - 12.550071) < 1e-2 &&
      Math.abs(INT.Q[4] - 21.204665) < 1e-2 &&
      INT_ALL_REJECT_01 === true &&
      INT_NULL_STILL_REJECTED === 5,
  },
  {
    // (R3) The negative far-lobe DEEPENS (r_5 -0.262 -> -0.304) -- the curved hump is an interior feature.
    id: 'imp34082-negative-lobe-deepens-curved-hump-interior',
    description: 'interior r_5 -0.304 < full -0.262 (deeper); sign change stays at lag 4 -- refutes imp-34025 R2',
    holds: () =>
      NEG_LOBE_DEEPENS === true &&
      Math.abs(INT.R[4] - -0.303868) < 1e-3 &&
      INT.firstNegativeLag === 4 &&
      FULL.firstNegativeLag === 4,
  },
  {
    // Honesty gate: isRigorous false, no QED, no refereed bound is changed, 12% multiplicative, imp-3066 untouched.
    id: 'imp34082-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, 12% multiplicative, imp-3066 untouched',
    holds: () =>
      IMP34082_ENDPOINT_DROP_SERIAL_DEPENDENCE.isRigorous === false &&
      /NO QED/.test(IMP34082_ENDPOINT_DROP_SERIAL_DEPENDENCE.verdict) &&
      /refereed bound is changed/i.test(IMP34082_ENDPOINT_DROP_SERIAL_DEPENDENCE.verdict) &&
      /12% multiplicative/.test(IMP34082_ENDPOINT_DROP_SERIAL_DEPENDENCE.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34082_ENDPOINT_DROP_SERIAL_DEPENDENCE.verdict),
  },
];

for (const a of IMP34082_ENDPOINT_DROP_SERIAL_DEPENDENCE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34082-endpoint-drop-serial-dependence assertion failed: ${a.id}`);
  }
}
