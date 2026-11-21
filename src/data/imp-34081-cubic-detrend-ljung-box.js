/**
 * @module imp-34081-cubic-detrend-ljung-box
 *
 * imp-34081 (numerical, frontier-direction): imp-34026 applied the classic QUADRATIC-detrend remedy to the
 * imp-33964 rejected white-noise null and found (R1) the k^2 term is REAL (c ~ +0.032, RMSE 0.116 -> 0.096),
 * but (R2) it FAILS to whiten -- the Ljung-Box Q_1..Q_5 still every one exceeds the 1% chi-square_m -- and
 * (R3) the far lobe DEEPENS, naming a CUBIC / S-shape as the surviving structure. This module takes the next
 * OLS term: it (i) re-fits the imp-33810 ladder with the CUBIC-augmented OLS y = a + b k + c k^2 + d k^3,
 * reports the added cubic coefficient d and the RMSE drop; (ii) recomputes the imp-33964 sample ACF r_1..r_5
 * and the Ljung-Box portmanteau Q_m = n(n+2) sum_{k=1}^m r_k^2/(n-k) for m = 1..5 on the NEW cubic-detrend
 * residual; and (iii) checks whether the white-noise null STOPS being rejected once the cubic S-shape
 * imp-34026 R3 named is absorbed -- i.e. whether the serial dependence collapses or survives even a cubic.
 *
 * THE CUBIC-AUGMENTED DETREND (same ladder / same ln-ratio series as imp-34026, one term richer)
 * ---------------------------------------------------------------------------------------------
 *   Series    y_k = ln(eflow_over_resid_k)                  the imp-33810 ladder, 21 quarter-decade rungs.
 *   Linear    y_k = a + b k                                 the imp-33843 log-linear WINNER (imp-33858 base).
 *   Quadratic y_k = a + b k + c k^2                         the imp-34026 curved-trend remedy (RMSE ~0.096).
 *   Cubic     y_k = a + b k + c k^2 + d k^3                 this module: d absorbs the S-shape imp-34026 named.
 *   Residual  e_k = y_k - (a + b k + c k^2 + d k^3)         the NEW cubic-detrend residual tested for whiteness.
 *   If the imp-34026 R3 cubic/S-shape was ALL the surviving dependence, the cubic residual ACF flattens and
 *   Ljung-Box stops rejecting the null; if the dependence survives, the imp-33858 hump is richer than cubic.
 *
 * THE LJUNG-BOX PORTMANTEAU STATISTIC (same form as imp-33964 / imp-34026, on the cubic-detrend residual)
 * -----------------------------------------------------------------------------------------------------
 *   Q_m       Q_m = n(n+2) sum_{k=1}^m r_k^2 / (n - k)      Ljung-Box (1978) portmanteau statistic.
 *   Null      H0: r_1 = ... = r_m = 0 (white noise); under H0, Q_m ~ chi-square_m asymptotically.
 *   Reject    reject the white-noise null when Q_m EXCEEDS the upper-tail chi-square_m critical value.
 *
 * THE MEASURED VALUES (recomputed here; the quadratic baseline reproduces the imp-34026 fit exactly)
 * ------------------------------------------------------------------------------------------------
 *   Cubic fit       a ~ -9.268, b ~ +5.167, c ~ -0.8246, d ~ +0.03358 (a genuine, non-negligible cubic term)
 *   RMSE            0.1160 (linear) -> 0.0962 (quadratic, imp-34026) -> 0.0329 (cubic) -- a further ~66% drop
 *   Cubic ACF r_1..5 ~ +0.5976, +0.1974, -0.1386, -0.3709, -0.4831   (sign change moves EARLIER to lag 3)
 *   Cubic Q_1..5    ~ 8.62, 9.61, 10.13, 14.04, 21.08
 *   chi-square_m 1% : 6.635, 9.21, 11.345, 13.277, 15.086 -- cubic Q_m clears the 1% value ONLY at m = 3.
 *   (imp-34026 quadratic baseline for reference: ACF +0.6535,+0.3252,+0.0406,-0.1844,-0.3411; Q 10.31..17.52)
 *
 * THE FINDING (measurement / calibration only -- the next OLS term absorbs much more, yet STILL fails to whiten)
 * -----------------------------------------------------------------------------------------------------------
 *   (R1) THE CUBIC TERM IS REAL AND ABSORBS FAR MORE THAN THE QUADRATIC DID. The augmented OLS gives d ~
 *        +0.0336 (a non-negligible k^3 coefficient) and the fit RMSE drops from 0.0962 (the imp-34026
 *        quadratic) to 0.0329, a ~66% further reduction (and ~72% below the imp-33843 log-linear 0.1160). So
 *        the imp-34026 R3 "surviving cubic / S-shape" reading is confirmed: a genuine third-order term exists.
 *   (R2) BUT THE CUBIC DETREND STILL DOES NOT WHITEN -- THE NULL IS STILL REJECTED AT m = 1, 2, 4, 5. On the
 *        new cubic-detrend residual the Ljung-Box Q_1..Q_5 ~ 8.62, 9.61, 10.13, 14.04, 21.08 clear the 1%
 *        chi-square_m (6.635, 9.21, 11.345, 13.277, 15.086) ONLY at the single horizon m = 3 (Q_3 10.13 <
 *        11.345); at every OTHER m the white-noise null is still rejected. So the null does NOT stop being
 *        rejected -- the single m = 3 dip is a non-monotone gap, not a clean whitening.
 *   (R3) THE NEGATIVE LOBE DEEPENS FURTHER AND THE SIGN CHANGE MOVES EARLIER -- THE SHAPE IS RICHER THAN CUBIC.
 *        The cubic-detrend ACF crosses zero one lag EARLIER (first negative lag 3, vs the quadratic residual's
 *        lag 4), and the far-lag lobe is DEEPER still (r_5 -0.483 vs the quadratic -0.341 vs the linear
 *        -0.262): each added even-vs-odd term tilts the far tail further negative rather than flattening it. So
 *        the imp-33858 residual is NOT a pure cubic S-shape either; the endpoint structure imp-33921/imp-34025
 *        localized survives even the cubic detrend, and the imp-33964 serial dependence is NOT a low-order
 *        polynomial-curvature artifact. It re-opens no imp-33843 form selection (log-linear stays the WINNER).
 *
 * The punchline: adding a k^3 term to the imp-34026 quadratic is the natural next detrend, and it IS justified
 * -- d ~ +0.034 is real and the RMSE drops a further ~66% (0.096 -> 0.033). But the remedy STILL fails to
 * whiten: the Ljung-Box Q_1..Q_5 ~ 8.62, 9.61, 10.13, 14.04, 21.08 clear the 1% chi-square_m only at the lone
 * horizon m = 3, and the ACF negative lobe DEEPENS further (r_5 -0.483) while the sign change moves earlier to
 * lag 3. The imp-33964 serial dependence is therefore NOT a low-order polynomial artifact -- a cubic does not
 * absorb the imp-33858 hump, whose shape is richer than cubic (the endpoint structure imp-33921/imp-34025 found).
 *
 * MEASUREMENT / DETREND-DIAGNOSTIC ONLY. A cubic-augmented OLS and Ljung-Box portmanteau test on an inherited
 * residual diagnostic from an inherited ladder, NOT an RH bound. It does NOT re-open the imp-33843 form
 * selection as the reported model (log-linear stays the winner); the cubic detrend is a diagnostic remedy, not
 * a new fit, and at n=21 a four-parameter fit spends more degrees of freedom (the r_k rest on fewer pairs). The
 * component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the OLS surrogate
 * is descriptive, not derived; the Q_m chi-square reference is a small-sample asymptotic; the C_mb GUE-conditional
 * per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34026-quadratic-detrend-ljung-box (the quadratic-detrend remedy this takes one term further)
 * @see imp-33964-ljung-box-portmanteau-test (the linear-residual Ljung-Box null this cubic-detrends)
 * @see imp-34025-ar2-breusch-godfrey-serial-correlation (the endpoint / curved-trend structure that survives)
 * @see imp-33921-ar1-residual-rho-reconciliation (the endpoint structure that survives the cubic detrend)
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
const RMSE_LIN = Math.sqrt(RESID_LIN.reduce((s, e) => s + e * e, 0) / N); // ~0.1160 (imp-33843)

// --- Polynomial OLS via the (deg+1)x(deg+1) normal equations (Gaussian elimination with partial pivot) ---
function solveLin(A, bv) {
  const n = A.length;
  const M = A.map((row, i) => [...row, bv[i]]);
  for (let c = 0; c < n; c++) {
    let piv = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    const tmp = M[c];
    M[c] = M[piv];
    M[piv] = tmp;
    const dpv = M[c][c];
    for (let j = c; j <= n; j++) M[c][j] /= dpv;
    for (let r = 0; r < n; r++) {
      if (r !== c) {
        const f = M[r][c];
        for (let j = c; j <= n; j++) M[r][j] -= f * M[c][j];
      }
    }
  }
  return M.map((row) => row[n]);
}
function polyFit(deg) {
  const dim = deg + 1;
  const SM = Array.from({ length: dim }, () => Array(dim).fill(0));
  const TV = Array(dim).fill(0);
  for (let i = 0; i < N; i++) {
    const ph = [];
    for (let p = 0; p < dim; p++) ph.push(KS[i] ** p);
    for (let a = 0; a < dim; a++) {
      TV[a] += ph[a] * Y[i];
      for (let b = 0; b < dim; b++) SM[a][b] += ph[a] * ph[b];
    }
  }
  const co = solveLin(SM, TV);
  const resid = KS.map((k, i) => Y[i] - co.reduce((s, cf, p) => s + cf * k ** p, 0));
  const rmse = Math.sqrt(resid.reduce((s, e) => s + e * e, 0) / N);
  return { co, resid, rmse };
}

// Quadratic baseline (reproduces the imp-34026 fit exactly) and the CUBIC-augmented fit.
const QUAD = polyFit(2); // co ~ [+10.183, -1.9741, +0.03179]; RMSE ~0.0962 (imp-34026 winner)
const CUB = polyFit(3); // co ~ [-9.268, +5.167, -0.8246, +0.03358]; RMSE ~0.0329
const [CA, CB, CC, CD] = CUB.co; // a, b, c, d -- d is the added cubic coefficient
const RESID = CUB.resid; // the NEW cubic-detrend residual e_k, the series tested for whiteness
const MEAN = RESID.reduce((a, b) => a + b, 0) / N; // ~1e-16 by OLS construction

const RMSE_QUAD = QUAD.rmse; // ~0.0962 (imp-34026)
const RMSE_CUBIC = CUB.rmse; // ~0.0329
const RMSE_DROP_FRAC_QUAD_TO_CUBIC = (RMSE_QUAD - RMSE_CUBIC) / RMSE_QUAD; // ~0.658
const RMSE_DROP_FRAC_LIN_TO_CUBIC = (RMSE_LIN - RMSE_CUBIC) / RMSE_LIN; // ~0.717

// Sample autocorrelation r_k = sum_{i>=k} (e_i - mean)(e_{i-k} - mean) / S0, on the cubic residual.
const S0 = RESID.reduce((s, e) => s + (e - MEAN) * (e - MEAN), 0);
function acf(k) {
  let c = 0;
  for (let i = k; i < N; i++) c += (RESID[i] - MEAN) * (RESID[i - k] - MEAN);
  return c / S0;
}
const MAX_LAG = 5;
const R = []; // r_1..r_5 ~ [0.5976, 0.1974, -0.1386, -0.3709, -0.4831]
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
const REJECTS_01 = Q.map((q, i) => q > CHI2_01[i]); // [true,true,false,true,true] -- clears 1% only at m=3
const ALL_REJECT_05 = REJECTS_05.every(Boolean); // true
const ALL_REJECT_01 = REJECTS_01.every(Boolean); // false -- m=3 dips below the 1% value
// The null does NOT stop being rejected: it is still rejected at 4 of the 5 horizons (only m=3 clears).
const NULL_STOPS_BEING_REJECTED = !REJECTS_01.some(Boolean); // false
const HORIZONS_STILL_REJECTED_AT_01 = REJECTS_01.filter(Boolean).length; // 4 of 5

// The cubic-detrend ACF still crosses zero (earlier, at lag 3), and its far lobe is DEEPER than the quadratic.
const ACF_STILL_SIGN_CHANGES = R.some((r) => r < 0) && R[0] > 0;
const FIRST_NEGATIVE_LAG = R.findIndex((r) => r < 0) + 1; // lag 3 (was 4 for the quadratic residual)
const QUAD_ACF_LAG5 = -0.3411; // imp-34026 quadratic-detrend ACF at lag 5
const NEGATIVE_LOBE_DEEPENS = R[4] < QUAD_ACF_LAG5; // true: -0.483 < -0.341

const round = (x, d) => +x.toFixed(d);

export const IMP34081_CUBIC_DETREND_LJUNG_BOX = {
  id: 'imp-34081',
  proofSection: 'S-frontier',
  question:
    'imp-34026 applied the quadratic-detrend remedy to the imp-33964 rejected white-noise null: the k^2 term ' +
    'is real (c ~ +0.032, RMSE 0.116 -> 0.096) but FAILS to whiten (Q_1..5 still exceed the 1% chi-square_m) ' +
    'and the far lobe DEEPENS, naming a cubic / S-shape as the surviving structure. Fit y = a + b k + c k^2 + ' +
    'd k^3, report the cubic coefficient d and the RMSE drop, recompute the ACF r_1..5 and Ljung-Box Q_1..5 ' +
    'on the cubic-detrend residual, and measure whether the white-noise null STOPS being rejected. ' +
    'Measurement only, no bound change; NOT an RH bound; no QED.',
  measuredQuantity:
    'The cubic-augmented OLS coefficients (a, b, c, d) of ln(eflow_over_resid_k) vs (1, k, k^2, k^3) on the ' +
    'imp-33810 21-rung ladder, the quadratic-vs-cubic fit RMSE, and the sample ACF r_1..r_5 plus the ' +
    'Ljung-Box Q_m = n(n+2) sum r_k^2/(n-k) for m = 1..5 on the NEW cubic-detrend residual, each compared ' +
    'against the upper-tail chi-square_m critical values',
  rungCount: N, // 21
  cubicCoeffA: round(CA, 4), // ~ -9.2682
  cubicCoeffB: round(CB, 4), // ~ +5.1671
  cubicCoeffC: round(CC, 4), // ~ -0.8246
  cubicCoeffD: round(CD, 5), // ~ +0.03358 (the added cubic term, non-negligible)
  rmseLinear: round(RMSE_LIN, 4), // ~0.1160 (imp-33843 log-linear winner)
  rmseQuadratic: round(RMSE_QUAD, 4), // ~0.0962 (imp-34026)
  rmseCubic: round(RMSE_CUBIC, 4), // ~0.0329
  rmseDropFractionQuadToCubic: round(RMSE_DROP_FRAC_QUAD_TO_CUBIC, 4), // ~0.658
  rmseDropFractionLinToCubic: round(RMSE_DROP_FRAC_LIN_TO_CUBIC, 4), // ~0.717
  cubicDetrendAcf: R.map((r) => round(r, 4)), // [0.5976, 0.1974, -0.1386, -0.3709, -0.4831]
  quadraticAcf: [0.6535, 0.3252, 0.0406, -0.1844, -0.3411], // imp-34026 baseline (quadratic residual)
  ljungBoxQ: Q.map((q) => round(q, 4)), // [8.6236, 9.6137, 10.1291, 14.0382, 21.0822]
  quadraticLjungBoxQ: [10.312, 13.0005, 13.0447, 14.011, 17.5241], // imp-34026 baseline (quadratic residual)
  chi2Crit05: CHI2_05,
  chi2Crit01: CHI2_01,
  rejectsAt05: REJECTS_05, // all true
  rejectsAt01: REJECTS_01, // [true,true,false,true,true]
  allRejectAt05: ALL_REJECT_05, // true
  allRejectAt01: ALL_REJECT_01, // false -- m=3 dips below the 1% value
  nullStopsBeingRejected: NULL_STOPS_BEING_REJECTED, // false -- still rejected at 4 of 5 horizons
  horizonsStillRejectedAt01: HORIZONS_STILL_REJECTED_AT_01, // 4
  acfStillSignChanges: ACF_STILL_SIGN_CHANGES, // true
  firstNegativeLag: FIRST_NEGATIVE_LAG, // 3 (earlier than the quadratic residual lag 4)
  negativeLobeDeepens: NEGATIVE_LOBE_DEEPENS, // true -- r_5 -0.483 < quadratic -0.341
  finding: {
    R1_cubic_term_real_rmse_drops_further:
      'The cubic-augmented OLS gives d ~ +0.0336 (a non-negligible k^3 coefficient) and the fit RMSE drops ' +
      'from 0.0962 (the imp-34026 quadratic) to 0.0329, a ~66% further reduction (~72% below the imp-33843 ' +
      'log-linear 0.1160). So the imp-34026 R3 "surviving cubic / S-shape" reading is confirmed -- a genuine ' +
      'third-order term exists and absorbs far more of the hump than the quadratic did.',
    R2_cubic_detrend_still_does_not_whiten_null_not_cleared:
      'On the NEW cubic-detrend residual the Ljung-Box Q_1..Q_5 ~ 8.62, 9.61, 10.13, 14.04, 21.08 clear the ' +
      '1% chi-square_m (6.635, 9.21, 11.345, 13.277, 15.086) ONLY at the single horizon m = 3 (Q_3 10.13 < ' +
      '11.345); at m = 1, 2, 4, 5 the white-noise null is STILL rejected. So the null does NOT stop being ' +
      'rejected -- the lone m = 3 dip is a non-monotone gap, not a clean whitening, and at the 5% level every ' +
      'Q_m still exceeds its chi-square_m.',
    R3_negative_lobe_deepens_further_shape_richer_than_cubic:
      'The cubic-detrend ACF crosses zero one lag EARLIER (first negative lag 3, vs the quadratic residual ' +
      'lag 4) and the far-lag lobe is DEEPER still (r_5 -0.483 vs the quadratic -0.341 vs the linear -0.262): ' +
      'each added term tilts the far tail further negative rather than flattening it. So the imp-33858 ' +
      'residual is NOT a pure cubic S-shape -- the endpoint structure imp-33921/imp-34025 localized survives ' +
      'even the cubic detrend, and the imp-33964 serial dependence is NOT a low-order polynomial-curvature ' +
      'artifact. This re-opens no imp-33843 form selection (log-linear stays the reported winner).',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / CUBIC-DETREND + LJUNG-BOX DIAGNOSTIC (frontier-direction, NOT rigorous). Adding a k^3 term ' +
    'to the imp-34026 quadratic is the natural next detrend, and it IS justified -- d ~ +0.034 is real and the ' +
    'RMSE drops a further ~66% (0.096 -> 0.033). But the remedy STILL fails to whiten: the Ljung-Box Q_1..Q_5 ' +
    '~ 8.62, 9.61, 10.13, 14.04, 21.08 on the cubic-detrend residual clear the 1% chi-square_m (6.635, 9.21, ' +
    '11.345, 13.277, 15.086) ONLY at the lone horizon m = 3, so the white-noise null is still rejected at m = ' +
    '1, 2, 4, 5, and the ACF negative lobe DEEPENS further (r_5 -0.483 vs the quadratic -0.341) while the sign ' +
    'change moves earlier to lag 3. The imp-33964 serial dependence is therefore NOT a low-order polynomial ' +
    'artifact -- a cubic does not absorb the imp-33858 hump, whose shape is richer than cubic (the endpoint ' +
    'structure imp-33921/imp-34025 found). This does NOT re-open the imp-33843 log-linear-vs-power-law form ' +
    'selection (log-linear stays the reported winner), does NOT change the reported RMSE (~0.116, ~12% ' +
    'multiplicative), and touches no bound; at n=21 a four-parameter fit spends more degrees of freedom and ' +
    'the higher-lag r_k rest on few pairs (n-k); the Q_m chi-square reference is a small-sample asymptotic; ' +
    'the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the ' +
    'C_mb GUE-conditional per imp-486 is UNTOUCHED; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34026 (the quadratic-detrend remedy this takes one term further); imp-33964 (the linear-residual ' +
    'Ljung-Box null this cubic-detrends); imp-34025 (the endpoint / curved-trend structure that survives); ' +
    'imp-33921 (the endpoint structure that survives the cubic detrend); imp-33858 (the 21 signed residuals ' +
    'and the curved hump); imp-33843 (the RMSE ~0.116 log-linear WINNER, still the reported model); imp-33810 ' +
    '(the 21-rung ladder); imp-486 (C_mb GUE-conditional). Portmanteau test: Ljung & Box (1978).',
};

export const IMP34081_CUBIC_DETREND_LJUNG_BOX_ASSERTIONS = [
  {
    // Reuse gate: the linear baseline reproduces the imp-33858/imp-33964 residual endpoints exactly.
    id: 'imp34081-linear-baseline-reproduces-imp33964',
    description: '21 rungs k=6..11; linear residual endpoints match imp-33858/imp-33964',
    holds: () =>
      N === 21 &&
      KS[0] === 6 &&
      KS[20] === 11 &&
      Math.abs(RESID_LIN[0] - -0.1141909) < 1e-4 &&
      Math.abs(RESID_LIN[N - 1] - 0.2478761) < 1e-4,
  },
  {
    // Reuse gate: the quadratic baseline reproduces the imp-34026 RMSE ~0.0962 exactly.
    id: 'imp34081-quadratic-baseline-reproduces-imp34026',
    description: 'quadratic-fit RMSE ~0.0962 reproduces the imp-34026 baseline',
    holds: () => Math.abs(RMSE_QUAD - 0.0961672) < 1e-4,
  },
  {
    // (R1) The cubic term is real (d ~ +0.0336) and the RMSE drops ~66% quad->cubic (0.096 -> 0.033).
    id: 'imp34081-cubic-term-real-rmse-drops-further',
    description: 'd ~ +0.0336 (non-negligible), RMSE 0.0962 -> 0.0329, a ~66% further drop -- cubic is real',
    holds: () =>
      Math.abs(CD - 0.0335839) < 1e-4 &&
      CD > 0.02 &&
      Math.abs(RMSE_CUBIC - 0.0328521) < 1e-4 &&
      RMSE_DROP_FRAC_QUAD_TO_CUBIC > 0.5 &&
      RMSE_DROP_FRAC_LIN_TO_CUBIC > 0.65,
  },
  {
    // (R2) The cubic-detrend Ljung-Box Q_m clears the 1% chi-square_m ONLY at m=3; null NOT cleared overall.
    id: 'imp34081-cubic-detrend-ljung-box-not-whitened',
    description: 'Q_1..5 ~ 8.62,9.61,10.13,14.04,21.08; clears 1% only at m=3; null still rejected at 4 of 5',
    holds: () =>
      Q.length === 5 &&
      Math.abs(Q[0] - 8.6236) < 1e-2 &&
      Math.abs(Q[2] - 10.1291) < 1e-2 &&
      Math.abs(Q[4] - 21.0822) < 1e-2 &&
      REJECTS_01[0] === true &&
      REJECTS_01[2] === false &&
      REJECTS_01[4] === true &&
      HORIZONS_STILL_REJECTED_AT_01 === 4 &&
      NULL_STOPS_BEING_REJECTED === false &&
      ALL_REJECT_05 === true,
  },
  {
    // (R3) The ACF crosses zero earlier (lag 3) and the far lobe DEEPENS vs the quadratic residual.
    id: 'imp34081-negative-lobe-deepens-shape-richer-than-cubic',
    description: 'cubic ACF crosses zero at lag 3 (earlier); far lobe deepens r_5 -0.483 < quadratic -0.341',
    holds: () =>
      ACF_STILL_SIGN_CHANGES === true &&
      FIRST_NEGATIVE_LAG === 3 &&
      R[0] > 0 &&
      Math.abs(R[0] - 0.5976) < 1e-3 &&
      Math.abs(R[4] - -0.4831) < 1e-3 &&
      NEGATIVE_LOBE_DEEPENS === true,
  },
  {
    // Honesty gate: isRigorous false, no QED, no refereed bound is changed, residual small, imp-3066 untouched.
    id: 'imp34081-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, 12% multiplicative, imp-3066 untouched',
    holds: () =>
      IMP34081_CUBIC_DETREND_LJUNG_BOX.isRigorous === false &&
      /NO QED/.test(IMP34081_CUBIC_DETREND_LJUNG_BOX.verdict) &&
      /refereed bound is changed/i.test(IMP34081_CUBIC_DETREND_LJUNG_BOX.verdict) &&
      /12% multiplicative/.test(IMP34081_CUBIC_DETREND_LJUNG_BOX.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34081_CUBIC_DETREND_LJUNG_BOX.verdict),
  },
];

for (const a of IMP34081_CUBIC_DETREND_LJUNG_BOX_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34081-cubic-detrend-ljung-box assertion failed: ${a.id}`);
  }
}
