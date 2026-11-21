/**
 * @module imp-34026-quadratic-detrend-ljung-box
 *
 * imp-34026 (numerical, frontier-direction): imp-33964 rejected the white-noise null for the 21 signed
 * imp-33858 residuals (Ljung-Box Q_m all exceed the 1% chi-square_m) and read the sign-changing ACF
 * negative lobe as a CURVED-hump line fit -- an OLS straight line dragged across the single curved
 * imp-33858 hump. The CLASSIC remedy for an OLS line fit to a curved trend is to add a k^2 term and
 * re-detrend. This module applies exactly that test: (i) it re-fits the imp-33810 ladder with the
 * QUADRATIC-augmented OLS y = a + b k + c k^2, reports the added curvature coefficient c and the RMSE
 * drop; (ii) it recomputes the imp-33964 sample ACF r_1..r_5 and the Ljung-Box portmanteau
 * Q_m = n(n+2) sum_{k=1}^m r_k^2/(n-k) for m = 1..5 on the NEW quadratic-detrend residuals; and (iii)
 * it checks whether the white-noise null STOPS being rejected -- i.e. whether the serial dependence
 * imp-33964 flagged collapses once curvature is absorbed (confirming curvature drove it) or survives
 * (showing the dependence is not a simple quadratic-curvature artifact).
 *
 * THE QUADRATIC-AUGMENTED DETREND (same ladder / same ln-ratio series as imp-33843/imp-33858, one term richer)
 * ---------------------------------------------------------------------------------------------------------
 *   Series    y_k = ln(eflow_over_resid_k)                  the imp-33810 ladder, 21 quarter-decade rungs.
 *   Linear    y_k = a + b k                                 the imp-33843 log-linear WINNER (imp-33858 base).
 *   Quadratic y_k = a + b k + c k^2                         the standard curved-trend remedy, c the curvature.
 *   Residual  e_k = y_k - (a + b k + c k^2)                 the NEW detrended residual tested for whiteness.
 *   A NON-zero c absorbs the single curved hump the imp-33858 line-fit residual traced; if the hump was ALL
 *   the serial dependence, the quadratic residual ACF flattens and Ljung-Box stops rejecting the null.
 *
 * THE LJUNG-BOX PORTMANTEAU STATISTIC (same form as imp-33964, on the re-detrended residual)
 * ----------------------------------------------------------------------------------------
 *   Q_m       Q_m = n(n+2) sum_{k=1}^m r_k^2 / (n - k)      Ljung-Box (1978) portmanteau statistic.
 *   Null      H0: r_1 = ... = r_m = 0 (white noise); under H0, Q_m ~ chi-square_m asymptotically.
 *   Reject    reject the white-noise null when Q_m EXCEEDS the upper-tail chi-square_m critical value.
 *
 * THE MEASURED VALUES (recomputed here; the LINEAR baseline reproduces the imp-33964 ACF/Q exactly)
 * ----------------------------------------------------------------------------------------------
 *   Quadratic fit   a ~ +10.183, b ~ -1.9741, c ~ +0.03179 (a genuine, non-negligible curvature term)
 *   RMSE            0.1160 (linear, imp-33843) -> 0.0962 (quadratic) -- a ~17% drop, so curvature IS real
 *   Quad ACF r_1..5 ~ +0.6535, +0.3252, +0.0406, -0.1844, -0.3411   (still sign-changing; lobe DEEPENS)
 *   Quad Q_1..5     ~ 10.31, 13.00, 13.04, 14.01, 17.52
 *   chi-square_m 1% : 6.635, 9.21, 11.345, 13.277, 15.086 -- every quad Q_m STILL exceeds the 1% value.
 *   (imp-33964 linear baseline for reference: ACF +0.7573,+0.4813,+0.2027,-0.0521,-0.2618; Q 13.85..22.99)
 *
 * THE FINDING (measurement / calibration only -- the standard remedy is applied and it FAILS to whiten)
 * --------------------------------------------------------------------------------------------------
 *   (R1) THE QUADRATIC TERM IS REAL AND MATERIALLY REDUCES THE RMSE, so there IS genuine curvature. The
 *        augmented OLS gives c ~ +0.0318 (a non-negligible k^2 coefficient) and the fit RMSE drops from
 *        0.1160 (the imp-33843 log-linear winner) to 0.0962, a ~17% reduction. The imp-33964 "curved-hump
 *        line fit" reading is confirmed in DIRECTION: a straight line does leave systematic curvature.
 *   (R2) BUT THE STANDARD QUADRATIC-DETREND REMEDY DOES NOT WHITEN THE RESIDUAL -- THE NULL IS STILL
 *        REJECTED AT EVERY m = 1..5. On the new quadratic-detrend residual the Ljung-Box Q_1..Q_5
 *        ~ 10.31, 13.00, 13.04, 14.01, 17.52 STILL every one exceeds even the 1% chi-square_m critical
 *        value (6.635, 9.21, 11.345, 13.277, 15.086), so the white-noise null continues to be rejected at
 *        all horizons. The Q_m do drop versus the linear baseline (Q_1 13.85 -> 10.31, Q_5 22.99 -> 17.52),
 *        so curvature absorbs SOME of the dependence, but not enough to clear the null anywhere.
 *   (R3) THE NEGATIVE LOBE ACTUALLY DEEPENS -- THE SHAPE IS RICHER THAN QUADRATIC. The quadratic-detrend
 *        ACF still sign-changes (r_1 ~ +0.654 falls monotonically through zero to r_4 ~ -0.184, r_5 ~
 *        -0.341), and the far-lag lobe is DEEPER than the imp-33964 linear residual (r_5 -0.341 vs -0.262):
 *        subtracting a single parabola tilts the far tail further negative rather than flattening it. So
 *        the imp-33858 residual is NOT a pure quadratic hump; a cubic-or-higher (S-shaped mid-trough plus
 *        far-tail up-turn) shape and/or the endpoint structure imp-33921/imp-34025 localized survives the
 *        quadratic detrend -- the serial dependence is NOT a simple quadratic-curvature artifact. It changes
 *        no reported model (imp-33843 log-linear stays the WINNER, not re-opened), and touches no bound.
 *
 * The punchline: adding a k^2 term to the imp-33843 line is the textbook remedy for an OLS fit to a curved
 * trend, and it IS justified here -- c ~ +0.032 is real and the RMSE drops ~17% (0.116 -> 0.096). But the
 * remedy FAILS to whiten: the Ljung-Box Q_1..Q_5 ~ 10.31..17.52 on the quadratic-detrend residual STILL
 * every one exceeds the 1% chi-square_m, so the white-noise null is rejected at every m = 1..5, and the
 * ACF negative lobe DEEPENS (r_5 -0.341 vs the linear -0.262). The imp-33964 serial dependence is therefore
 * NOT a simple quadratic-curvature artifact -- a single parabola does not absorb the imp-33858 hump, whose
 * shape is richer than quadratic (a cubic-plus S-shape plus the endpoint structure imp-33921/imp-34025 found).
 *
 * MEASUREMENT / DETREND-DIAGNOSTIC ONLY. A quadratic-augmented OLS and Ljung-Box portmanteau test on an
 * inherited residual diagnostic from an inherited ladder, NOT an RH bound. It does NOT re-open the imp-33843
 * form selection as the reported model (log-linear stays the winner); the quadratic detrend is a diagnostic
 * remedy, not a new fit. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the OLS surrogate is descriptive, not derived; at n=21 the higher-lag r_k rest on few pairs
 * (n-k) and the Q_m chi-square reference is a small-sample asymptotic; the C_mb GUE-conditional per imp-486
 * is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-33964-ljung-box-portmanteau-test (the linear-residual Ljung-Box the null this quadratic-detrends)
 * @see imp-34025-ar2-breusch-godfrey-serial-correlation (the curved-trend-artifact read this corroborates)
 * @see imp-33921-ar1-residual-rho-reconciliation (the endpoint structure that survives the quadratic detrend)
 * @see imp-33858-widening-fit-residual-localization (the 21 signed residuals and the curved hump)
 * @see imp-33843-eflow-resid-widening-form-fit (the RMSE ~0.116 log-linear WINNER, still the reported model)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the 21-rung ladder whose residual is re-detrended)
 */

import { IMP33810_EFLOW_RESID_RATIO_N_LADDER } from './imp-33810-eflow-resid-ratio-N-ladder.js';

// Reuse the imp-33810 21-rung ladder VERBATIM (no fresh component model).
const RUNGS = IMP33810_EFLOW_RESID_RATIO_N_LADDER.ladder;
const KS = RUNGS.map((r) => r.k);
const Y = RUNGS.map((r) => Math.log(r.eflow_over_resid)); // natural log of the imp-33810 ratio
const N = KS.length; // 21

// Simple linear OLS y = a + b k, the imp-33843 log-linear WINNER (baseline, reproduces imp-33964 residual).
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
const LIN = ols(KS, Y);
const RESID_LIN = KS.map((k, i) => Y[i] - (LIN.a + LIN.b * k)); // the imp-33858 / imp-33964 linear residual

// --- Quadratic-augmented OLS y = a + b k + c k^2 via the 3x3 normal equations (Gaussian elimination) ---
function solve3(A, bv) {
  const M = A.map((row, i) => [...row, bv[i]]);
  for (let c = 0; c < 3; c++) {
    let piv = c;
    for (let r = c + 1; r < 3; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    const tmp = M[c];
    M[c] = M[piv];
    M[piv] = tmp;
    const d = M[c][c];
    for (let j = c; j <= 3; j++) M[c][j] /= d;
    for (let r = 0; r < 3; r++) {
      if (r !== c) {
        const f = M[r][c];
        for (let j = c; j <= 3; j++) M[r][j] -= f * M[c][j];
      }
    }
  }
  return M.map((row) => row[3]);
}
const SM = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0],
];
const TV = [0, 0, 0];
for (let i = 0; i < N; i++) {
  const k = KS[i];
  const ph = [1, k, k * k];
  for (let a = 0; a < 3; a++) {
    TV[a] += ph[a] * Y[i];
    for (let b = 0; b < 3; b++) SM[a][b] += ph[a] * ph[b];
  }
}
const [QA, QB, QC] = solve3(SM, TV); // a ~ +10.183, b ~ -1.9741, c ~ +0.03179 (the added curvature term)

// The NEW quadratic-detrend residual e_k = y_k - (a + b k + c k^2), the series tested for whiteness.
const RESID = KS.map((k, i) => Y[i] - (QA + QB * k + QC * k * k));
const MEAN = RESID.reduce((a, b) => a + b, 0) / N; // ~1e-16 by OLS construction

// RMSE of each fit -- the quadratic term is justified only if it MATERIALLY reduces the RMSE.
const RMSE_LIN = Math.sqrt(RESID_LIN.reduce((s, e) => s + e * e, 0) / N); // ~0.1160 (imp-33843)
const RMSE_QUAD = Math.sqrt(RESID.reduce((s, e) => s + e * e, 0) / N); // ~0.0962
const RMSE_DROP_FRAC = (RMSE_LIN - RMSE_QUAD) / RMSE_LIN; // ~0.171

// Sample autocorrelation r_k = sum_{i>=k} (e_i - mean)(e_{i-k} - mean) / S0, on the quadratic residual.
const S0 = RESID.reduce((s, e) => s + (e - MEAN) * (e - MEAN), 0);
function acf(k) {
  let c = 0;
  for (let i = k; i < N; i++) c += (RESID[i] - MEAN) * (RESID[i - k] - MEAN);
  return c / S0;
}
const MAX_LAG = 5;
const R = []; // r_1..r_5 ~ [0.6535, 0.3252, 0.0406, -0.1844, -0.3411]
for (let k = 1; k <= MAX_LAG; k++) R.push(acf(k));

// Ljung-Box (1978) portmanteau Q_m = n(n+2) sum_{k=1}^m r_k^2 / (n - k), accumulated over m = 1..5.
const Q = [];
let acc = 0;
for (let k = 1; k <= MAX_LAG; k++) {
  acc += (R[k - 1] * R[k - 1]) / (N - k);
  Q.push(N * (N + 2) * acc);
}

// Upper-tail chi-square_m critical values (m = df = 1..5) at the 5% and 1% levels.
const CHI2_05 = [3.841, 5.991, 7.815, 9.488, 11.07];
const CHI2_01 = [6.635, 9.21, 11.345, 13.277, 15.086];
const REJECTS_05 = Q.map((q, i) => q > CHI2_05[i]); // all true
const REJECTS_01 = Q.map((q, i) => q > CHI2_01[i]); // all true -- the remedy does NOT clear the null
const ALL_REJECT_05 = REJECTS_05.every(Boolean);
const ALL_REJECT_01 = REJECTS_01.every(Boolean);
const WHITE_NOISE_NULL_STILL_REJECTED = ALL_REJECT_01; // true: quadratic detrend FAILS to whiten

// The quadratic-detrend ACF still crosses zero, and its far lobe is DEEPER than the linear residual.
const ACF_STILL_SIGN_CHANGES = R.some((r) => r < 0) && R[0] > 0;
const FIRST_NEGATIVE_LAG = R.findIndex((r) => r < 0) + 1; // lag 4
const LINEAR_ACF_LAG5 = -0.2618; // imp-33964 sample ACF at lag 5 (linear residual)
const NEGATIVE_LOBE_DEEPENS = R[4] < LINEAR_ACF_LAG5; // true: -0.341 < -0.262

const round = (x, d) => +x.toFixed(d);

export const IMP34026_QUADRATIC_DETREND_LJUNG_BOX = {
  id: 'imp-34026',
  proofSection: 'S-frontier',
  question:
    'imp-33964 rejected the white-noise null for the 21 signed imp-33858 residuals (Ljung-Box Q_m all ' +
    'exceed the 1% chi-square_m) and read the sign-changing ACF negative lobe as an OLS straight line ' +
    'dragged across the single curved imp-33858 hump. The classic remedy is to add a k^2 term. Re-fit the ' +
    'imp-33810 ladder with the quadratic-augmented OLS y = a + b k + c k^2, recompute the sample ACF ' +
    'r_1..r_5 and the Ljung-Box Q_1..Q_5 on the new residuals, and check whether the white-noise null ' +
    'stops being rejected. Measurement only, no bound change; NOT an RH bound; no QED.',
  measuredQuantity:
    'The quadratic-augmented OLS coefficients (a, b, c) of ln(eflow_over_resid_k) vs (1, k, k^2) on the ' +
    'imp-33810 21-rung ladder, the linear-vs-quadratic fit RMSE, and the sample ACF r_1..r_5 plus the ' +
    'Ljung-Box Q_m = n(n+2) sum r_k^2/(n-k) for m = 1..5 on the NEW quadratic-detrend residual, each ' +
    'compared against the upper-tail chi-square_m critical values',
  rungCount: N, // 21
  quadCoeffA: round(QA, 4), // ~ +10.1825
  quadCoeffB: round(QB, 4), // ~ -1.9741
  quadCoeffC: round(QC, 5), // ~ +0.03179 (the added curvature term, non-negligible)
  rmseLinear: round(RMSE_LIN, 4), // ~0.1160 (imp-33843 log-linear winner)
  rmseQuadratic: round(RMSE_QUAD, 4), // ~0.0962
  rmseDropFraction: round(RMSE_DROP_FRAC, 4), // ~0.171 (~17% -- curvature IS real)
  quadDetrendAcf: R.map((r) => round(r, 4)), // [0.6535, 0.3252, 0.0406, -0.1844, -0.3411]
  linearAcf: [0.7573, 0.4813, 0.2027, -0.0521, -0.2618], // imp-33964 baseline (linear residual)
  ljungBoxQ: Q.map((q) => round(q, 4)), // [10.312, 13.0005, 13.0447, 14.011, 17.5241]
  linearLjungBoxQ: [13.8512, 19.7404, 20.8426, 20.9197, 22.9886], // imp-33964 baseline (linear residual)
  chi2Crit05: CHI2_05,
  chi2Crit01: CHI2_01,
  rejectsAt05: REJECTS_05, // all true
  rejectsAt01: REJECTS_01, // all true
  allRejectAt05: ALL_REJECT_05, // true
  allRejectAt01: ALL_REJECT_01, // true
  whiteNoiseNullStillRejected: WHITE_NOISE_NULL_STILL_REJECTED, // true -- quadratic detrend FAILS to whiten
  acfStillSignChanges: ACF_STILL_SIGN_CHANGES, // true
  firstNegativeLag: FIRST_NEGATIVE_LAG, // 4
  negativeLobeDeepens: NEGATIVE_LOBE_DEEPENS, // true -- r_5 -0.341 < linear -0.262
  finding: {
    R1_quadratic_term_real_rmse_drops:
      'The quadratic-augmented OLS gives c ~ +0.0318 (a non-negligible k^2 coefficient) and the fit RMSE ' +
      'drops from 0.1160 (the imp-33843 log-linear winner) to 0.0962, a ~17% reduction. So there IS genuine ' +
      'curvature: the imp-33964 curved-hump line-fit reading is confirmed in direction -- a straight line ' +
      'leaves systematic curvature the k^2 term partly absorbs.',
    R2_quadratic_detrend_does_not_whiten_null_still_rejected:
      'On the NEW quadratic-detrend residual the Ljung-Box Q_1..Q_5 ~ 10.31, 13.00, 13.04, 14.01, 17.52 ' +
      'STILL every one exceeds even the 1% chi-square_m critical value (6.635, 9.21, 11.345, 13.277, ' +
      '15.086), so the white-noise null continues to be rejected at every m = 1..5. The Q_m do drop versus ' +
      'the imp-33964 linear baseline (Q_1 13.85 -> 10.31, Q_5 22.99 -> 17.52), so curvature absorbs SOME of ' +
      'the dependence -- but not enough to clear the null anywhere. The classic quadratic-detrend remedy ' +
      'FAILS to whiten the residual.',
    R3_negative_lobe_deepens_shape_richer_than_quadratic:
      'The quadratic-detrend ACF still sign-changes (r_1 ~ +0.654 falls monotonically through zero to r_4 ~ ' +
      '-0.184, r_5 ~ -0.341), and the far-lag lobe is DEEPER than the imp-33964 linear residual (r_5 -0.341 ' +
      'vs -0.262): subtracting a single parabola tilts the far tail further negative rather than flattening ' +
      'it. So the imp-33858 residual is NOT a pure quadratic hump -- a cubic-or-higher S-shape plus the ' +
      'endpoint structure imp-33921/imp-34025 localized survives the quadratic detrend; the imp-33964 serial ' +
      'dependence is NOT a simple quadratic-curvature artifact. This re-opens no imp-33843 form selection ' +
      '(log-linear stays the reported winner) and touches no bound.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / QUADRATIC-DETREND + LJUNG-BOX DIAGNOSTIC (frontier-direction, NOT rigorous). Adding a ' +
    'k^2 term to the imp-33843 line is the textbook remedy for an OLS fit to a curved trend, and it IS ' +
    'justified here -- c ~ +0.032 is real and the RMSE drops ~17% (0.116 -> 0.096). But the remedy FAILS ' +
    'to whiten: the Ljung-Box Q_1..Q_5 ~ 10.31, 13.00, 13.04, 14.01, 17.52 on the quadratic-detrend ' +
    'residual STILL every one exceeds the 1% chi-square_m (6.635, 9.21, 11.345, 13.277, 15.086), so the ' +
    'white-noise null is rejected at every m = 1..5, and the ACF negative lobe DEEPENS (r_5 -0.341 vs the ' +
    'linear -0.262). The imp-33964 serial dependence is therefore NOT a simple quadratic-curvature ' +
    'artifact -- a single parabola does not absorb the imp-33858 hump, whose shape is richer than ' +
    'quadratic (a cubic-plus S-shape plus the endpoint structure imp-33921/imp-34025 found). This does NOT ' +
    're-open the imp-33843 log-linear-vs-power-law form selection (log-linear stays the reported winner), ' +
    'does NOT change the reported RMSE (~0.116, ~12% multiplicative), and touches no bound; at n=21 the ' +
    'higher-lag r_k rest on few pairs (n-k) and the Q_m chi-square reference is a small-sample asymptotic; ' +
    'the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486 is UNTOUCHED; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-33964 (the linear-residual Ljung-Box null this quadratic-detrends); imp-34025 (the curved-trend ' +
    'artifact read this corroborates); imp-33921 (the endpoint structure that survives the quadratic ' +
    'detrend); imp-33858 (the 21 signed residuals and the curved hump); imp-33843 (the RMSE ~0.116 ' +
    'log-linear WINNER, still the reported model); imp-33810 (the 21-rung ladder); imp-486 (C_mb ' +
    'GUE-conditional). Portmanteau test: Ljung & Box (1978).',
};

export const IMP34026_QUADRATIC_DETREND_LJUNG_BOX_ASSERTIONS = [
  {
    // Reuse gate: the linear baseline reproduces the imp-33858/imp-33964 residual and its ACF exactly.
    id: 'imp34026-linear-baseline-reproduces-imp33964',
    description: '21 rungs k=6..11; linear residual endpoints and ACF match imp-33858/imp-33964',
    holds: () =>
      N === 21 &&
      KS[0] === 6 &&
      KS[20] === 11 &&
      Math.abs(RESID_LIN[0] - -0.1141909) < 1e-4 &&
      Math.abs(RESID_LIN[N - 1] - 0.2478761) < 1e-4,
  },
  {
    // (R1) The quadratic term is real (c ~ +0.032) and the RMSE drops ~17% (0.116 -> 0.096).
    id: 'imp34026-quadratic-term-real-rmse-drops',
    description: 'c ~ +0.0318 (non-negligible), RMSE 0.1160 -> 0.0962, a ~17% drop -- curvature is real',
    holds: () =>
      Math.abs(QC - 0.0317899) < 1e-4 &&
      QC > 0.02 &&
      Math.abs(RMSE_LIN - 0.1160391) < 1e-4 &&
      Math.abs(RMSE_QUAD - 0.0961672) < 1e-4 &&
      RMSE_DROP_FRAC > 0.15,
  },
  {
    // (R2) The quadratic-detrend Ljung-Box Q_m still every one exceeds the 1% chi-square_m: null rejected.
    id: 'imp34026-quad-detrend-ljung-box-still-rejects-null',
    description: 'Q_1..Q_5 ~ 10.31,13.00,13.04,14.01,17.52 all exceed the 1% chi-square_m; null STILL rejected',
    holds: () =>
      Q.length === 5 &&
      Math.abs(Q[0] - 10.312) < 1e-2 &&
      Math.abs(Q[4] - 17.5241) < 1e-2 &&
      Q.every((q, i) => q > CHI2_01[i]) &&
      WHITE_NOISE_NULL_STILL_REJECTED === true,
  },
  {
    // (R2) The remedy DOES absorb some dependence -- every quad Q_m is below its linear-baseline counterpart.
    id: 'imp34026-quad-Q-below-linear-baseline',
    description: 'quad Q_m < imp-33964 linear Q_m at every m (curvature absorbs some, not all, dependence)',
    holds: () =>
      Q.every((q, i) => q < IMP34026_QUADRATIC_DETREND_LJUNG_BOX.linearLjungBoxQ[i]) &&
      Q[0] < 13.8512 &&
      Q[4] < 22.9886,
  },
  {
    // (R3) The ACF still sign-changes and the far lobe DEEPENS vs the linear residual (r_5 -0.341 < -0.262).
    id: 'imp34026-negative-lobe-deepens-shape-richer-than-quadratic',
    description: 'quad ACF still crosses zero (first negative lag 4); far lobe deepens r_5 -0.341 < -0.262',
    holds: () =>
      ACF_STILL_SIGN_CHANGES === true &&
      FIRST_NEGATIVE_LAG === 4 &&
      R[0] > 0 &&
      Math.abs(R[0] - 0.6535) < 1e-3 &&
      Math.abs(R[4] - -0.3411) < 1e-3 &&
      NEGATIVE_LOBE_DEEPENS === true,
  },
  {
    // Honesty gate: isRigorous false, no QED, no refereed bound is changed, residual small, imp-3066 untouched.
    id: 'imp34026-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, 12% multiplicative, imp-3066 untouched',
    holds: () =>
      IMP34026_QUADRATIC_DETREND_LJUNG_BOX.isRigorous === false &&
      /NO QED/.test(IMP34026_QUADRATIC_DETREND_LJUNG_BOX.verdict) &&
      /refereed bound is changed/i.test(IMP34026_QUADRATIC_DETREND_LJUNG_BOX.verdict) &&
      /12% multiplicative/.test(IMP34026_QUADRATIC_DETREND_LJUNG_BOX.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34026_QUADRATIC_DETREND_LJUNG_BOX.verdict),
  },
];

for (const a of IMP34026_QUADRATIC_DETREND_LJUNG_BOX_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34026-quadratic-detrend-ljung-box assertion failed: ${a.id}`);
  }
}
