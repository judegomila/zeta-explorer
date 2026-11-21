/**
 * @module imp-34152-quadratic-refit-lag4-robustness
 *
 * imp-34152 (numerical, frontier-direction): imp-34082 R3 reported that the imp-33858 residual ACF sign
 * change stays at LAG 4 for both the full imp-33810 ladder and the endpoint-dropped interior, and read
 * that lag-4 zero-crossing as an interior curvature feature of the imp-33843 LOG-LINEAR fit residual.
 * Whether the lag-4 crossing is a signature of the underlying hump or an artifact of the log-linear trend
 * itself was never tested. This module runs that robustness check: it re-fits the imp-33810 ladder with
 * the imp-34026/imp-33948-style QUADRATIC trend y = a + b k + c k^2, recomputes the residual ACF r_1..r_10
 * (extended past the imp-34082 r_1..r_5 window), locates the ACF sign-change lag, and compares it against
 * the log-linear lag-4 crossing to decide whether the lag-4 zero-crossing is trend-robust or trend-carried.
 *
 * THE TWO DETRENDS (same ladder / same ln-ratio series as imp-33843/imp-33858, log-linear vs quadratic)
 * ----------------------------------------------------------------------------------------------------
 *   Series     y_k = ln(eflow_over_resid_k)                 the imp-33810 ladder, 21 quarter-decade rungs.
 *   Log-linear y_k = a + b k                                the imp-33843 WINNER (the imp-34082 lag-4 base).
 *   Quadratic  y_k = a + b k + c k^2                        the imp-34026 curved-trend remedy, c curvature.
 *   Residual   e_k = y_k - fit_k                            re-fit on the full n=21 support for each form.
 *   The imp-34082 reading says lag 4 is an INTERIOR-hump feature; if it were instead an artifact of the
 *   straight-line trend, absorbing curvature with the k^2 term should MOVE (or erase) the crossing lag.
 *
 * THE SAMPLE ACF AND THE SIGN-CHANGE LAG (extended to r_1..r_10, the imp-34082 window was r_1..r_5)
 * --------------------------------------------------------------------------------------------
 *   r_k             r_k = sum_{i>=k}(e_i - mean)(e_{i-k} - mean) / S0     sample autocorrelation at lag k.
 *   firstNegLag     the smallest lag k with r_k < 0                        the ACF sign-change ("zero-crossing").
 *   crossings       every lag where sign(r_k) flips from sign(r_{k-1})     r_0 = 1 counts as the leading sign.
 *   A single crossing at the SAME lag under both detrends means the lag-4 feature is trend-robust.
 *
 * THE MEASURED VALUES (recomputed here; the log-linear baseline reproduces imp-34082 / imp-33964 exactly)
 * ---------------------------------------------------------------------------------------------------
 *   Quadratic fit    a ~ +10.183, b ~ -1.9741, c ~ +0.03179 (reproduces the imp-34026 curvature term)
 *   LOG-LINEAR ACF r_1..r_10 ~ +0.7573, +0.4813, +0.2027, -0.0521, -0.2618, -0.4114, -0.4925, -0.5038, -0.4509, -0.3461
 *   QUADRATIC  ACF r_1..r_10 ~ +0.6535, +0.3252, +0.0406, -0.1844, -0.3411, -0.4268, -0.4437, -0.3992, -0.3055, -0.1788
 *   Log-linear firstNegLag = 4 (single crossing at lag 4)   -- reproduces the imp-34082 lag-4 crossing.
 *   Quadratic  firstNegLag = 4 (single crossing at lag 4)   -- SAME lag; the crossing does NOT move.
 *   The quadratic detrend shrinks the leading positive lobe (r_1 0.757 -> 0.653) and pulls the far tail
 *   back toward zero (r_10 -0.346 -> -0.179), but the zero-crossing stays pinned at lag 4 under both forms.
 *
 * THE FINDING (measurement / robustness only -- the lag-4 crossing survives the quadratic re-fit)
 * -------------------------------------------------------------------------------------------
 *   (R1) THE ACF SIGN-CHANGE LAG IS UNCHANGED BY THE QUADRATIC RE-FIT -- IT STAYS AT LAG 4. Both the
 *        imp-33843 log-linear residual and the imp-34026 quadratic re-fit residual cross from positive to
 *        negative at exactly lag 4 (log-linear r_3 +0.203 -> r_4 -0.052; quadratic r_3 +0.041 -> r_4 -0.184),
 *        each with a SINGLE crossing over r_1..r_10. So the imp-34082 lag-4 crossing is NOT an artifact of the
 *        straight-line trend -- absorbing curvature with the k^2 term does not move it.
 *   (R2) THE QUADRATIC RE-FIT ONLY SHRINKS THE LOBE AMPLITUDES, NOT THE CROSSING LOCATION. Subtracting the
 *        parabola lowers the leading positive lobe (r_1 0.7573 -> 0.6535, r_3 0.2027 -> 0.0406) and pulls the
 *        far tail back toward zero (r_8 -0.5038 -> -0.3992, r_10 -0.3461 -> -0.1788), but the r_3 > 0 > r_4
 *        bracket that defines the crossing is preserved. The lag-4 feature is a property of the hump, not of
 *        the amount of curvature the trend removes.
 *   (R3) THE CROSSING IS PINNED AT THE SAME LAG DESPITE THE dg_{k*}/dt CURVATURE REMOVAL -- IT IS HUMP-CARRIED.
 *        Removing a full parabola (c ~ +0.032, the imp-34026 RMSE-justified curvature) changes the ACF
 *        shape everywhere yet leaves the sole zero-crossing at lag 4. Together with the imp-34082 endpoint-drop
 *        (lag 4 for both full and interior) this makes the lag-4 crossing robust across BOTH the endpoint-drop
 *        and the trend-form perturbations. It re-opens no imp-33843 form selection (log-linear stays the
 *        reported WINNER, the quadratic is a diagnostic re-fit only) and touches no bound.
 *
 * The punchline: the imp-34082 lag-4 ACF sign-change is not a log-linear-trend artifact. Re-fitting the
 * imp-33810 ladder with the imp-34026 quadratic trend and extending the ACF to r_1..r_10 leaves the sole
 * zero-crossing pinned at lag 4 -- the quadratic detrend only shrinks the lobe amplitudes (r_1 0.757 -> 0.653,
 * r_10 -0.346 -> -0.179). So the lag-4 crossing is hump-carried, robust across BOTH the imp-34082 endpoint-drop
 * and this trend-form perturbation, and the log-linear form stays the reported winner (not re-opened).
 *
 * MEASUREMENT / TREND-FORM ROBUSTNESS DIAGNOSTIC ONLY. A quadratic re-fit and ACF recomputation on an inherited
 * residual diagnostic from an inherited ladder, NOT an RH bound. It does NOT re-open the imp-33843 form selection
 * (log-linear stays the winner); the quadratic re-fit is a robustness probe, not a new fit. The component model
 * is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the OLS surrogate is descriptive,
 * not derived; at n=21 the higher-lag r_k rest on few pairs (n-k); the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-34082-endpoint-drop-serial-dependence (the R3 lag-4 crossing this re-tests under a quadratic re-fit)
 * @see imp-34026-quadratic-detrend-ljung-box (the quadratic-augmented OLS and c ~ +0.032 curvature reused here)
 * @see imp-33964-ljung-box-portmanteau-test (the linear-residual ACF r_1..r_5 this extends to r_1..r_10)
 * @see imp-33858-widening-fit-residual-localization (the 21 signed residuals and the curved hump)
 * @see imp-33843-eflow-resid-widening-form-fit (the RMSE ~0.116 log-linear WINNER, still the reported model)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the 21-rung ladder whose residual ACF is re-tested)
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
const RESID_LIN = KS.map((k, i) => Y[i] - (LIN.a + LIN.b * k)); // the imp-33858 / imp-34082 log-linear residual

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
const [QA, QB, QC] = solve3(SM, TV); // a ~ +10.183, b ~ -1.9741, c ~ +0.03179 (reproduces the imp-34026 curvature)

// The NEW quadratic re-fit residual e_k = y_k - (a + b k + c k^2), whose ACF is re-tested for the lag-4 crossing.
const RESID_Q = KS.map((k, i) => Y[i] - (QA + QB * k + QC * k * k));

// Sample autocorrelation r_1..r_MAX for a residual series (extends the imp-34082 r_1..r_5 window to r_1..r_10).
const MAX_LAG = 10;
function acfSeries(resid) {
  const n = resid.length;
  const mean = resid.reduce((a, b) => a + b, 0) / n; // ~1e-16 by OLS construction
  const s0 = resid.reduce((s, e) => s + (e - mean) * (e - mean), 0);
  const out = [];
  for (let k = 1; k <= MAX_LAG; k++) {
    let c = 0;
    for (let i = k; i < n; i++) c += (resid[i] - mean) * (resid[i - k] - mean);
    out.push(c / s0);
  }
  return out;
}
const ACF_LIN = acfSeries(RESID_LIN); // log-linear ACF r_1..r_10
const ACF_Q = acfSeries(RESID_Q); // quadratic re-fit ACF r_1..r_10

// The ACF sign-change lag (first negative r_k) and the full list of sign-flip lags (r_0 = 1 leads the sign).
const firstNegLag = (arr) => arr.findIndex((r) => r < 0) + 1;
function signChangeLags(arr) {
  const full = [1, ...arr]; // r_0 = 1 as the leading sign
  const out = [];
  for (let i = 1; i < full.length; i++) {
    if (full[i - 1] >= 0 !== (full[i] >= 0)) out.push(i);
  }
  return out;
}
const FIRST_NEG_LIN = firstNegLag(ACF_LIN); // 4 (reproduces imp-34082)
const FIRST_NEG_Q = firstNegLag(ACF_Q); // 4 (unchanged under the quadratic re-fit)
const CROSSINGS_LIN = signChangeLags(ACF_LIN); // [4] -- a single crossing
const CROSSINGS_Q = signChangeLags(ACF_Q); // [4] -- a single crossing at the SAME lag

const LAG4_CROSSING_ROBUST = FIRST_NEG_Q === FIRST_NEG_LIN && FIRST_NEG_Q === 4; // true -- crossing does not move
const SINGLE_CROSSING_BOTH = CROSSINGS_LIN.length === 1 && CROSSINGS_Q.length === 1; // true
// The quadratic detrend shrinks the lobe amplitudes without moving the crossing.
const LEADING_LOBE_SHRINKS = ACF_Q[0] < ACF_LIN[0] && ACF_Q[0] > 0; // r_1 0.757 -> 0.653
const FAR_TAIL_PULLED_TO_ZERO = Math.abs(ACF_Q[9]) < Math.abs(ACF_LIN[9]); // |r_10| 0.346 -> 0.179

const round = (x, d) => +x.toFixed(d);

export const IMP34152_QUADRATIC_REFIT_LAG4_ROBUSTNESS = {
  id: 'imp-34152',
  proofSection: 'S-frontier',
  question:
    'imp-34082 R3 reported the imp-33858 residual ACF sign change stays at lag 4 for both the full imp-33810 ' +
    'ladder and the endpoint-dropped interior, reading it as an interior curvature feature of the imp-33843 ' +
    'LOG-LINEAR fit residual -- but never tested whether the lag-4 crossing is a signature of the hump or an ' +
    'artifact of the straight-line trend. Re-fit the imp-33810 ladder with the imp-34026 QUADRATIC trend ' +
    'y = a + b k + c k^2, recompute the residual ACF r_1..r_10, locate the sign-change lag, and compare against ' +
    'the log-linear lag-4 crossing. Measurement only, no bound change; NOT an RH bound; no QED.',
  measuredQuantity:
    'The ACF sign-change lag (first negative r_k) of the QUADRATIC re-fit residual e_k = y_k - (a + b k + c k^2) ' +
    'on the imp-33810 21-rung ladder, with the sample ACF r_1..r_10 extended past the imp-34082 r_1..r_5 window, ' +
    'compared against the imp-33843 log-linear residual ACF sign-change lag (the imp-34082 lag-4 crossing)',
  rungCount: N, // 21
  quadCoeffA: round(QA, 4), // ~ +10.1825
  quadCoeffB: round(QB, 4), // ~ -1.9741
  quadCoeffC: round(QC, 5), // ~ +0.03179 (reproduces the imp-34026 curvature term)
  maxLag: MAX_LAG, // 10
  logLinearAcf: ACF_LIN.map((r) => round(r, 4)),
  // [0.7573, 0.4813, 0.2027, -0.0521, -0.2618, -0.4114, -0.4925, -0.5038, -0.4509, -0.3461]
  quadraticAcf: ACF_Q.map((r) => round(r, 4)),
  // [0.6535, 0.3252, 0.0406, -0.1844, -0.3411, -0.4268, -0.4437, -0.3992, -0.3055, -0.1788]
  logLinearFirstNegativeLag: FIRST_NEG_LIN, // 4 (reproduces imp-34082)
  quadraticFirstNegativeLag: FIRST_NEG_Q, // 4 (unchanged)
  logLinearSignChangeLags: CROSSINGS_LIN, // [4]
  quadraticSignChangeLags: CROSSINGS_Q, // [4]
  lag4CrossingRobustToQuadraticRefit: LAG4_CROSSING_ROBUST, // true -- crossing does NOT move
  singleCrossingUnderBothForms: SINGLE_CROSSING_BOTH, // true
  leadingLobeShrinks: LEADING_LOBE_SHRINKS, // true -- r_1 0.757 -> 0.653
  farTailPulledTowardZero: FAR_TAIL_PULLED_TO_ZERO, // true -- |r_10| 0.346 -> 0.179
  finding: {
    R1_sign_change_lag_unchanged_stays_at_lag_4:
      'Both the imp-33843 log-linear residual and the imp-34026 quadratic re-fit residual cross from positive ' +
      'to negative at exactly lag 4 (log-linear r_3 +0.203 -> r_4 -0.052; quadratic r_3 +0.041 -> r_4 -0.184), ' +
      'each with a SINGLE crossing over r_1..r_10. So the imp-34082 lag-4 crossing is NOT an artifact of the ' +
      'straight-line trend -- absorbing curvature with the k^2 term does not move it.',
    R2_quadratic_refit_only_shrinks_lobe_amplitudes:
      'Subtracting the parabola lowers the leading positive lobe (r_1 0.7573 -> 0.6535, r_3 0.2027 -> 0.0406) ' +
      'and pulls the far tail back toward zero (r_8 -0.5038 -> -0.3992, r_10 -0.3461 -> -0.1788), but the ' +
      'r_3 > 0 > r_4 bracket that defines the crossing is preserved. The lag-4 feature is a property of the ' +
      'hump, not of the amount of curvature the trend removes.',
    R3_crossing_pinned_despite_curvature_removal_hump_carried:
      'Removing a full parabola (c ~ +0.032, the imp-34026 RMSE-justified curvature) changes the ACF shape ' +
      'everywhere yet leaves the sole zero-crossing at lag 4. Together with the imp-34082 endpoint-drop (lag 4 ' +
      'for both full and interior) this makes the lag-4 crossing robust across BOTH the endpoint-drop and the ' +
      'trend-form perturbations. It re-opens no imp-33843 form selection (log-linear stays the reported winner, ' +
      'the quadratic is a diagnostic re-fit only) and touches no bound.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / TREND-FORM ROBUSTNESS DIAGNOSTIC (frontier-direction, NOT rigorous). The imp-34082 lag-4 ' +
    'ACF sign-change is not a log-linear-trend artifact: re-fitting the imp-33810 ladder with the imp-34026 ' +
    'quadratic trend y = a + b k + c k^2 (c ~ +0.032) and extending the ACF to r_1..r_10 leaves the sole ' +
    'zero-crossing pinned at lag 4 (log-linear r_3 +0.203 -> r_4 -0.052; quadratic r_3 +0.041 -> r_4 -0.184), ' +
    'a SINGLE crossing under both forms. The quadratic detrend only shrinks the lobe amplitudes (leading lobe ' +
    'r_1 0.757 -> 0.653, far tail |r_10| 0.346 -> 0.179) without moving the crossing. So the lag-4 crossing is ' +
    'hump-carried, robust across BOTH the imp-34082 endpoint-drop (lag 4 for full and interior) and this ' +
    'trend-form perturbation. This does NOT re-open the imp-33843 log-linear-vs-power-law form selection ' +
    '(log-linear stays the reported winner; the quadratic is a diagnostic re-fit only), does NOT change the ' +
    'reported RMSE (~0.116, ~12% multiplicative), and touches no bound; at n=21 the higher-lag r_k rest on few ' +
    'pairs (n-k); the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; establishes no operator positivity; ' +
    'imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34082 (the R3 lag-4 crossing re-tested here under a quadratic re-fit); imp-34026 (the ' +
    'quadratic-augmented OLS and c ~ +0.032 curvature reused); imp-33964 (the linear-residual ACF r_1..r_5 ' +
    'extended to r_1..r_10); imp-33858 (the 21 signed residuals and the curved hump); imp-33843 (the RMSE ' +
    '~0.116 log-linear WINNER, still the reported model); imp-33810 (the 21-rung ladder); imp-486 (C_mb ' +
    'GUE-conditional).',
};

export const IMP34152_QUADRATIC_REFIT_LAG4_ROBUSTNESS_ASSERTIONS = [
  {
    // Reuse gate: the log-linear baseline reproduces the imp-34082 / imp-33964 residual ACF (lag-4 crossing).
    id: 'imp34152-log-linear-baseline-reproduces-imp34082',
    description: '21 rungs k=6..11; log-linear ACF r_1 ~+0.757, r_5 ~-0.262 and firstNegLag 4 reproduce imp-34082',
    holds: () =>
      N === 21 &&
      KS[0] === 6 &&
      KS[20] === 11 &&
      Math.abs(ACF_LIN[0] - 0.757331) < 1e-4 &&
      Math.abs(ACF_LIN[4] - -0.261794) < 1e-4 &&
      FIRST_NEG_LIN === 4,
  },
  {
    // Reuse gate: the quadratic re-fit reproduces the imp-34026 curvature term c ~ +0.0318.
    id: 'imp34152-quadratic-refit-reproduces-imp34026-curvature',
    description: 'quadratic OLS c ~ +0.03179 reproduces the imp-34026 curvature term',
    holds: () => Math.abs(QC - 0.0317899) < 1e-4 && QC > 0.02,
  },
  {
    // (R1) The ACF sign-change lag is UNCHANGED by the quadratic re-fit -- it stays at lag 4.
    id: 'imp34152-sign-change-lag-stays-at-4',
    description: 'quadratic re-fit firstNegLag 4 == log-linear firstNegLag 4; a single crossing under both forms',
    holds: () =>
      FIRST_NEG_Q === 4 &&
      LAG4_CROSSING_ROBUST === true &&
      SINGLE_CROSSING_BOTH === true &&
      CROSSINGS_Q.length === 1 &&
      CROSSINGS_Q[0] === 4,
  },
  {
    // (R1) The quadratic ACF preserves the r_3 > 0 > r_4 bracket that defines the crossing.
    id: 'imp34152-quadratic-acf-brackets-crossing-at-lag-4',
    description: 'quadratic r_3 ~+0.041 > 0 > r_4 ~-0.184; the crossing bracket is preserved',
    holds: () =>
      ACF_Q.length === 10 &&
      Math.abs(ACF_Q[2] - 0.040572) < 1e-4 &&
      ACF_Q[2] > 0 &&
      Math.abs(ACF_Q[3] - -0.184423) < 1e-4 &&
      ACF_Q[3] < 0,
  },
  {
    // (R2) The quadratic re-fit only shrinks the lobe amplitudes -- leading lobe down, far tail toward zero.
    id: 'imp34152-quadratic-refit-shrinks-lobe-amplitudes',
    description: 'r_1 0.757 -> 0.653 (leading lobe shrinks); |r_10| 0.346 -> 0.179 (far tail pulled to zero)',
    holds: () =>
      LEADING_LOBE_SHRINKS === true &&
      FAR_TAIL_PULLED_TO_ZERO === true &&
      Math.abs(ACF_Q[0] - 0.653452) < 1e-4 &&
      Math.abs(ACF_Q[9] - -0.178833) < 1e-4,
  },
  {
    // Honesty gate: isRigorous false, no QED, no refereed bound is changed, 12% multiplicative, imp-3066 untouched.
    id: 'imp34152-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, 12% multiplicative, imp-3066 untouched',
    holds: () =>
      IMP34152_QUADRATIC_REFIT_LAG4_ROBUSTNESS.isRigorous === false &&
      /NO QED/.test(IMP34152_QUADRATIC_REFIT_LAG4_ROBUSTNESS.verdict) &&
      /refereed bound is changed/i.test(IMP34152_QUADRATIC_REFIT_LAG4_ROBUSTNESS.verdict) &&
      /12% multiplicative/.test(IMP34152_QUADRATIC_REFIT_LAG4_ROBUSTNESS.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34152_QUADRATIC_REFIT_LAG4_ROBUSTNESS.verdict),
  },
];

for (const a of IMP34152_QUADRATIC_REFIT_LAG4_ROBUSTNESS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34152-quadratic-refit-lag4-robustness assertion failed: ${a.id}`);
  }
}
