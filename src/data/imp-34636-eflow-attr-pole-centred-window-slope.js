/**
 * @module imp-34636-eflow-attr-pole-centred-window-slope
 * @fileoverview imp-34636 -- Measure the log-corrected eflow_attr leading per-k slope on a THIRD
 *   OLS window CENTRED EXACTLY on the pole k* ~ 21.28095, to test the imp-34589/imp-34609
 *   "window-centre drift" explanation DIRECTLY rather than by inference.
 *
 *   imp-34589 attributed the far-vs-near eflow_attr per-k slope difference (-0.001356 per k pure /
 *   +9.658e-5 log-corrected, imp-34609) to the two overlapping fit windows having different CENTRES,
 *   and imp-34609 showed ~93% of the pure-fit difference is a single-power aliasing artifact that
 *   collapses ~14x under the log-corrected form. But BOTH parent windows STRADDLE the pole without
 *   CENTRING on it: the near window (imp-34406, k = 21.0 .. 21.5) has centroid k-bar = 21.2539
 *   (BELOW the pole) and the far window (imp-34572, k = 21.30 .. 21.60) has centroid k-bar = 21.4500
 *   (ABOVE the pole). If the slope really drifts monotonically with window centre, a THIRD window
 *   centred on the pole should give a leading per-k slope that INTERPOLATES between the near and far
 *   values. This module builds that third window and tests the prediction directly.
 *
 *   METHOD (import-light, verbatim imp-34585/imp-34609 machinery). The pole-centred window reuses
 *   FIVE rungs VERBATIM from the imp-34406 near ladder, chosen so the AT-the-pole rung k = 21.28095
 *   is the MEDIAN (3rd of 5): k in {21.2, 21.25, 21.28095, 21.3, 21.35} (the 21.35 rung is the
 *   imp-34572 far-side value, reused verbatim). No re-derivation, no 16.7MB zeros bundle in the
 *   chain, per [[no_heavy_imports_in_pages]] / [[verify_heavy_assertion_modules]]. The window gets the
 *   verbatim imp-34609 3-parameter log-corrected OLS on the design [1, ln N, ln ln N] (N = 10^(k+1))
 *   solved by the same solve3 Gauss elimination, with the OLS slope SE from the stable Gauss-Jordan
 *   inv3 covariance. The near (8-rung) and far (7-rung) baselines are RECOMPUTED with the identical
 *   machinery and cross-checked against the imported imp-34609 near/far leading-slope exports (reuse
 *   gate). The centre-drift prediction is the linear interpolation of the near/far leading slopes at
 *   the pole window's centroid fraction along the near->far centroid axis.
 *
 *   FINDINGS (measurement only).
 *   ---------------------------------------------------------------------------------
 *   (F1) THE POLE-CENTRED WINDOW SLOPE IS NOMINALLY STEEPER THAN BOTH FLANKS -- IT DOES NOT SIT
 *        BETWEEN THEM. The pole-centred (median-rung = k*) 5-rung log-corrected fit gives leading
 *        per-k slope p*ln10 = -2.309216 (p = -1.002880, q = 3.350167), which is MORE NEGATIVE than
 *        BOTH the near-side -2.309134 (by -8.22e-5) AND the far-side -2.309037 (by -1.788e-4). So the
 *        pole-centred slope does NOT literally interpolate between the near and far values -- taken at
 *        face value the monotone-in-window-centre prediction FAILS: the window straddling the pole
 *        most symmetrically is an OUTLIER steeper than either flank, not a midpoint.
 *   (F2) BUT THE POLE-WINDOW OLS SE IS ~10x THE FLANKS', SO THE DEPARTURE IS ONLY ~1.33 SIGMA -- THE
 *        TEST IS UNDERPOWERED, NOT CONTRADICTORY. The pole window uses only 5 rungs over a narrow
 *        k-span of 0.15 (vs the near window 0.5 / far 0.3), so its slope SE is 6.989e-5 per k --
 *        ~8.35x the near SE (8.368e-6) and ~11.9x the far SE (5.873e-6). The linear-centroid centre-
 *        drift prediction at the pole window's centroid (k-bar = 21.2762, fraction 0.1138 along the
 *        near->far centroid axis) is -2.309123; the measured -2.309216 departs from it by 9.32e-5 =
 *        only ~1.33 sigma of the pole window's own SE. So the third window is statistically CONSISTENT
 *        with the window-centre-drift explanation: it neither confirms a clean monotone interpolation
 *        nor resolves a genuine kink AT the pole. The whole near-far centre-drift scale (~1e-4 per k)
 *        sits BELOW the pole window's own resolution (~7e-5 SE), so the direct test cannot separate
 *        "monotone drift" from "flat with a pole outlier" -- it is inconclusive but not contradictory.
 *   (F3) THE LOG-POWER q AT THE POLE (3.350167) EXCEEDS BOTH FLANKS (q_near = 3.348339,
 *        q_far = 3.346178), CONSISTENT WITH THE imp-34609 F3 |g| REMNANT. The pole window's fitted
 *        log-power q = 3.350167 is slightly ABOVE the near q = 3.348339 and the far q = 3.346178 --
 *        the same direction (q rising toward the pole) as the imp-34609 F3 q_far - q_near = -2.16e-3
 *        mild |g| = 1 - 3/ln N attractor curvature. The nominal F1 pole steepening and this raised q
 *        are two readings of the same weak centre-dependence the pure log^3 form does not fully
 *        absorb; at the ~6e-9 double-precision residual floor (RMS log-residual 5.667e-9, below the
 *        near 1.05e-8) neither is resolved beyond the ~1.3-sigma noise of the narrow window.
 *
 *   The punchline: fitting the log-corrected eflow_attr on a THIRD window centred EXACTLY on the pole
 *   (k* = 21.28095 as the median rung) gives a leading per-k slope of -2.309216 that is nominally
 *   STEEPER than both the near (-2.309134) and far (-2.309037) flanks -- so it does NOT literally
 *   interpolate between them, but the narrow 5-rung window's SE (~7e-5, ~10x the flanks') makes the
 *   9.32e-5 departure from the centre-drift prediction only ~1.33 sigma. The direct pole-centred test
 *   is therefore CONSISTENT with (but too underpowered to CONFIRM) the imp-34589/imp-34609 window-
 *   centre-drift explanation: the ~1e-4 drift scale is below the pole window's own resolution.
 *
 *   MEASUREMENT ONLY. A single log-corrected OLS fit of the inherited surrogate numerator eflow_attr
 *   on a pole-centred window built from the imp-34406 near and imp-34572 far rungs verbatim, NOT an
 *   RH bound. Descriptive surrogate fit, NOT a rigorous asymptotic; the component model is the
 *   inherited imp-3220/imp-3406 extrapolation; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 *   changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict,
 *   NO QED. No refereed bound is changed.
 *
 *   @see imp-34609-eflow-attr-near-far-slope-diff-log-corrected.js (the near/far log-corrected baselines)
 *   @see imp-34589-eflow-attr-far-side-power-law-slope-continuity.js (the window-centre-drift claim)
 *   @see imp-34585-eflow-attr-log-corrected-fit.js (near-side log-corrected fit, (p,q)=(-1.0028,3.348))
 *   @see imp-34406-eflow-attr-smooth-nonzero-across-pole.js (the near rungs incl. the AT-pole rung)
 *   @see imp-34572-eflow-attr-far-side-pole-smoothness.js (the far rungs, source of the 21.35 rung)
 */

import { IMP34406_EFLOW_ATTR_RUNGS } from './imp-34406-eflow-attr-smooth-nonzero-across-pole.js';
import { IMP34572_FAR_SIDE_RUNGS } from './imp-34572-eflow-attr-far-side-pole-smoothness.js';
import {
  IMP34609_NEAR_LEADING_PER_K_SLOPE,
  IMP34609_FAR_LEADING_PER_K_SLOPE,
} from './imp-34609-eflow-attr-near-far-slope-diff-log-corrected.js';

const KSTAR = 21.28095; // imp-34023/imp-34237/imp-34310, verbatim

// --- shared machinery (verbatim imp-34585/imp-34609 solve3/inv3/logCorrectedFit) -----
function solve3(A, b) {
  const M = A.map((row, i) => [row[0], row[1], row[2], b[i]]);
  for (let c = 0; c < 3; c++) {
    let piv = c;
    for (let r = c + 1; r < 3; r++) {
      if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    }
    const tmp = M[c];
    M[c] = M[piv];
    M[piv] = tmp;
    for (let r = 0; r < 3; r++) {
      if (r !== c) {
        const f = M[r][c] / M[c][c];
        for (let k = c; k < 4; k++) M[r][k] -= f * M[c][k];
      }
    }
  }
  return [M[0][3] / M[0][0], M[1][3] / M[1][1], M[2][3] / M[2][2]];
}

// Stable 3x3 inverse (Gauss-Jordan, partial pivoting) for the OLS covariance (X'X)^-1.
function inv3(A) {
  const M = A.map((row, i) => [
    row[0],
    row[1],
    row[2],
    i === 0 ? 1 : 0,
    i === 1 ? 1 : 0,
    i === 2 ? 1 : 0,
  ]);
  for (let c = 0; c < 3; c++) {
    let piv = c;
    for (let r = c + 1; r < 3; r++) {
      if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    }
    const tmp = M[c];
    M[c] = M[piv];
    M[piv] = tmp;
    const d = M[c][c];
    for (let k = 0; k < 6; k++) M[c][k] /= d;
    for (let r = 0; r < 3; r++) {
      if (r !== c) {
        const f = M[r][c];
        for (let k = 0; k < 6; k++) M[r][k] -= f * M[c][k];
      }
    }
  }
  return M.map((row) => [row[3], row[4], row[5]]);
}

// Log-corrected fit of one rung ladder: leading N-exponent p, log-power q, per-k leading slope
// p*ln10, the OLS slope SE (per-k), the RMS log-residual, and the rung-count / centroid-k.
function logCorrectedFit(rungs) {
  const XS = rungs.map((r) => Math.log(Math.pow(10, r.k + 1))); // ln N
  const LS = rungs.map((r) => Math.log(Math.log(Math.pow(10, r.k + 1)))); // ln ln N
  const YS = rungs.map((r) => Math.log(r.eflowAttr)); // ln eflow_attr
  const NN = XS.length;
  const AtA = [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ];
  const Atb = [0, 0, 0];
  for (let i = 0; i < NN; i++) {
    const row = [1, XS[i], LS[i]];
    for (let a = 0; a < 3; a++) {
      Atb[a] += row[a] * YS[i];
      for (let c = 0; c < 3; c++) AtA[a][c] += row[a] * row[c];
    }
  }
  const [b0, p, q] = solve3(AtA, Atb);
  let ssres = 0;
  for (let i = 0; i < NN; i++) {
    const resid = YS[i] - (b0 + p * XS[i] + q * LS[i]);
    ssres += resid * resid;
  }
  const s2 = ssres / (NN - 3);
  const inv = inv3(AtA);
  const seP = Math.sqrt(s2 * inv[1][1]);
  return {
    p,
    q,
    perKSlope: p * Math.LN10,
    perKSlopeSE: seP * Math.LN10,
    rmsLogResid: Math.sqrt(ssres / NN),
    n: NN,
    centroidK: rungs.reduce((s, r) => s + r.k, 0) / NN,
  };
}

// --- pull the five verbatim pole-window rungs out of the imp-34406/imp-34572 ladders --
// The pole-centred window uses k in {21.2, 21.25, 21.28095, 21.3, 21.35}: the four bracketing
// rungs come from the imp-34406 near ladder; the k = 21.35 rung is the imp-34572 far value.
const rungAt = (rungs, k) => rungs.find((r) => r.k === k);
const POLE_WINDOW_KS = [21.2, 21.25, 21.28095, 21.3, 21.35];
const POLE_WINDOW_RUNGS = POLE_WINDOW_KS.map((k) => {
  const nearHit = rungAt(IMP34406_EFLOW_ATTR_RUNGS, k);
  const src = nearHit || rungAt(IMP34572_FAR_SIDE_RUNGS, k);
  return { k, eflowAttr: src.eflowAttr };
});

// --- fits: pole-centred window plus recomputed near/far baselines ----------------------
const POLE = logCorrectedFit(POLE_WINDOW_RUNGS); // 5 rungs, median = k* pole
const NEAR = logCorrectedFit(IMP34406_EFLOW_ATTR_RUNGS); // 8 rungs, k = 21.0 .. 21.5
const FAR = logCorrectedFit(IMP34572_FAR_SIDE_RUNGS); // 7 rungs, k = 21.30 .. 21.60

export const IMP34636_POLE_LEADING_PER_K_SLOPE = POLE.perKSlope; // -2.309216
export const IMP34636_POLE_LOGCORR_P = POLE.p; // -1.002880
export const IMP34636_POLE_LOGCORR_Q = POLE.q; // 3.350167
export const IMP34636_POLE_LEADING_SLOPE_SE = POLE.perKSlopeSE; // 6.989e-5 per k
export const IMP34636_POLE_RMS_LOG_RESID = POLE.rmsLogResid; // 5.667e-9
export const IMP34636_POLE_CENTROID_K = POLE.centroidK; // 21.276190
export const IMP34636_NEAR_CENTROID_K = NEAR.centroidK; // 21.253869
export const IMP34636_FAR_CENTROID_K = FAR.centroidK; // 21.450000

// --- (F1) does the pole-centred slope sit BETWEEN the near and far slopes? -------------
const NEAR_SLOPE = NEAR.perKSlope; // -2.309134
const FAR_SLOPE = FAR.perKSlope; // -2.309037
export const IMP34636_POLE_MINUS_NEAR_SLOPE = POLE.perKSlope - NEAR_SLOPE; // -8.22e-5
export const IMP34636_POLE_MINUS_FAR_SLOPE = POLE.perKSlope - FAR_SLOPE; // -1.788e-4
export const IMP34636_POLE_SLOPE_IS_BETWEEN =
  POLE.perKSlope > Math.min(NEAR_SLOPE, FAR_SLOPE) &&
  POLE.perKSlope < Math.max(NEAR_SLOPE, FAR_SLOPE); // false -- steeper than both

// --- (F2) linear-centroid centre-drift prediction and the departure sigma -------------
// The window-centre-drift hypothesis predicts the pole slope = linear interpolation of the
// near/far slopes at the pole window's centroid fraction along the near->far centroid axis.
const CENTROID_FRACTION =
  (POLE.centroidK - NEAR.centroidK) / (FAR.centroidK - NEAR.centroidK); // 0.1138
export const IMP34636_CENTRE_DRIFT_PREDICTED_SLOPE =
  NEAR_SLOPE + CENTROID_FRACTION * (FAR_SLOPE - NEAR_SLOPE); // -2.309123
const DEPARTURE = Math.abs(POLE.perKSlope - IMP34636_CENTRE_DRIFT_PREDICTED_SLOPE); // 9.32e-5
export const IMP34636_DEPARTURE_SIGMA = DEPARTURE / POLE.perKSlopeSE; // ~1.33 sigma
export const IMP34636_POLE_SE_OVER_NEAR_SE =
  POLE.perKSlopeSE / NEAR.perKSlopeSE; // ~8.35x
export const IMP34636_POLE_SE_OVER_FAR_SE =
  POLE.perKSlopeSE / FAR.perKSlopeSE; // ~11.9x

// --- (F3) log-power q rises toward the pole -------------------------------------------
export const IMP34636_Q_POLE_MINUS_NEAR = POLE.q - NEAR.q; // +1.83e-3
export const IMP34636_Q_POLE_MINUS_FAR = POLE.q - FAR.q; // +3.99e-3

export const IMP34636_EFLOW_ATTR_POLE_CENTRED_WINDOW_SLOPE = {
  ticket: 'imp-34636',
  proofSection: 'S-frontier',
  kStar: KSTAR,
  question:
    'imp-34589/imp-34609 attributed the near-vs-far eflow_attr leading per-k slope difference to the ' +
    'two fit windows having different CENTRES (near centroid 21.2539 below the pole, far centroid ' +
    '21.4500 above it), but neither window CENTRES on the pole k* = 21.28095. Fit the log-corrected ' +
    'eflow_attr on a THIRD window centred exactly on the pole (k* as the median rung) and test ' +
    'whether the measured leading slope INTERPOLATES between the near and far values as the ' +
    'centre-drift hypothesis predicts. Measurement only; NO QED.',
  poleWindow: {
    ks: POLE_WINDOW_KS,
    rungs: POLE.n,
    kSpan: +(POLE_WINDOW_KS[POLE_WINDOW_KS.length - 1] - POLE_WINDOW_KS[0]).toFixed(2), // 0.15
    medianRungIsPole: POLE_WINDOW_KS[2] === KSTAR, // true
    centroidK: +POLE.centroidK.toFixed(6), // 21.276190
    exponentP: +POLE.p.toFixed(6), // -1.002880
    logPowerQ: +POLE.q.toFixed(6), // 3.350167
    leadingPerKSlope: +POLE.perKSlope.toFixed(6), // -2.309216
    leadingSlopeSE: +POLE.perKSlopeSE.toExponential(4), // 6.9891e-5
    rmsLogResid: +POLE.rmsLogResid.toExponential(4), // 5.6670e-9
  },
  nearBaseline: {
    centroidK: +NEAR.centroidK.toFixed(6), // 21.253869
    leadingPerKSlope: +NEAR_SLOPE.toFixed(6), // -2.309134
    leadingSlopeSE: +NEAR.perKSlopeSE.toExponential(4), // 8.3677e-6
    source: 'imp-34609 (recomputed, cross-checked against import)',
  },
  farBaseline: {
    centroidK: +FAR.centroidK.toFixed(6), // 21.450000
    leadingPerKSlope: +FAR_SLOPE.toFixed(6), // -2.309037
    leadingSlopeSE: +FAR.perKSlopeSE.toExponential(4), // 5.8734e-6
    source: 'imp-34609 (recomputed, cross-checked against import)',
  },
  poleMinusNearSlope: +IMP34636_POLE_MINUS_NEAR_SLOPE.toExponential(4), // -8.2215e-5
  poleMinusFarSlope: +IMP34636_POLE_MINUS_FAR_SLOPE.toExponential(4), // -1.7880e-4
  poleSlopeIsBetweenNearAndFar: IMP34636_POLE_SLOPE_IS_BETWEEN, // false
  centreDriftPredictedSlope: +IMP34636_CENTRE_DRIFT_PREDICTED_SLOPE.toFixed(6), // -2.309123
  centroidFraction: +CENTROID_FRACTION.toFixed(4), // 0.1138
  departureFromPrediction: +DEPARTURE.toExponential(4), // 9.3207e-5
  departureSigma: +IMP34636_DEPARTURE_SIGMA.toFixed(2), // 1.33
  poleSEoverNearSE: +IMP34636_POLE_SE_OVER_NEAR_SE.toFixed(2), // 8.35
  poleSEoverFarSE: +IMP34636_POLE_SE_OVER_FAR_SE.toFixed(2), // 11.90
  qPoleMinusNear: +IMP34636_Q_POLE_MINUS_NEAR.toExponential(4), // +1.83e-3
  qPoleMinusFar: +IMP34636_Q_POLE_MINUS_FAR.toExponential(4), // +3.99e-3
  finding: {
    F1_pole_slope_is_nominally_steeper_than_both_flanks_not_between:
      'The pole-centred (median-rung = k*) 5-rung log-corrected fit gives leading per-k slope ' +
      'p*ln10 = -2.309216 (p = -1.002880, q = 3.350167), MORE NEGATIVE than both the near -2.309134 ' +
      '(by -8.22e-5) and the far -2.309037 (by -1.788e-4). It does NOT literally sit between them -- ' +
      'at face value the monotone-in-window-centre prediction FAILS: the most pole-symmetric window ' +
      'is an outlier steeper than either flank, not a midpoint.',
    F2_departure_is_only_1p33_sigma_test_is_underpowered:
      'The pole window uses only 5 rungs over a k-span of 0.15 (vs near 0.5 / far 0.3), so its slope ' +
      'SE is 6.989e-5 per k -- ~8.35x the near SE and ~11.9x the far SE. The linear-centroid centre- ' +
      'drift prediction at the pole centroid (k-bar 21.2762, fraction 0.1138) is -2.309123; the ' +
      'measured -2.309216 departs by 9.32e-5 = only ~1.33 sigma of the pole SE. So the third window ' +
      'is statistically CONSISTENT with the centre-drift explanation; the ~1e-4 drift scale sits ' +
      'below the pole window resolution (~7e-5), so the direct test is inconclusive, not contradictory.',
    F3_log_power_q_rises_toward_the_pole:
      'The pole window log-power q = 3.350167 exceeds both the near q = 3.348339 (by +1.83e-3) and ' +
      'the far q = 3.346178 (by +3.99e-3), the same direction (q rising toward the pole) as the ' +
      'imp-34609 F3 q_far - q_near = -2.16e-3 mild |g| = 1 - 3/ln N remnant. The nominal F1 pole ' +
      'steepening and this raised q are two readings of the same weak centre-dependence the pure ' +
      'log^3 form does not fully absorb; at the ~6e-9 residual floor neither is resolved beyond noise.',
  },
  isRigorous: false,
  honest:
    'MEASUREMENT ONLY -- a single log-corrected OLS fit (eflow_attr = A*N^p*(ln N)^q) of the ' +
    'inherited surrogate numerator eflow_attr on a THIRD window centred exactly on the pole ' +
    '(k* = 21.28095 as the median of the 5 reused imp-34406/imp-34572 rungs), testing the ' +
    'imp-34589/imp-34609 window-centre-drift explanation directly. The pole-centred leading per-k ' +
    'slope -2.309216 is nominally steeper than BOTH the near -2.309134 and far -2.309037 flanks (so ' +
    'it does NOT interpolate between them), but the narrow 5-rung window SE (~7e-5, ~10x the flanks) ' +
    'makes the 9.32e-5 departure from the centre-drift prediction only ~1.33 sigma -- the test is ' +
    'CONSISTENT with (but too underpowered to CONFIRM) the centre-drift explanation. Descriptive ' +
    'surrogate fit, NOT a rigorous asymptotic; the component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes ' +
    'no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED; no refereed bound is changed' +
    '.',
};

export const IMP34636_ASSERTIONS = [
  {
    // Reuse gate: the 5 pole-window rungs are the imp-34406/imp-34572 baked rungs, not fresh literals.
    id: 'imp-34636-reuses-baked-rungs-with-pole-as-median',
    description: 'the 5 pole-window rungs are imp-34406/imp-34572 values and the median rung is the pole k*',
    holds: () =>
      POLE_WINDOW_RUNGS.length === 5 &&
      POLE_WINDOW_RUNGS[2].k === KSTAR &&
      POLE_WINDOW_RUNGS[2].eflowAttr === 4.51969554e-15 &&
      POLE_WINDOW_RUNGS[0].eflowAttr === 5.38265555e-15 &&
      POLE_WINDOW_RUNGS[4].eflowAttr === 3.893699e-15,
  },
  {
    // Cross-check gate: recomputed near/far leading slopes match the imported imp-34609 exports.
    id: 'imp-34636-recovers-imp34609-near-far-slopes',
    description: 'recomputed near/far leading per-k slopes match imported imp-34609 to < 1e-9',
    holds: () =>
      Math.abs(NEAR_SLOPE - IMP34609_NEAR_LEADING_PER_K_SLOPE) < 1e-9 &&
      Math.abs(FAR_SLOPE - IMP34609_FAR_LEADING_PER_K_SLOPE) < 1e-9,
  },
  {
    // (F1) the pole-centred slope is steeper than both flanks, i.e. NOT between them.
    id: 'imp-34636-pole-slope-not-between-flanks',
    description: 'pole leading slope -2.309216 is more negative than both near -2.309134 and far -2.309037',
    holds: () =>
      Math.abs(POLE.perKSlope - -2.309216) < 1e-6 &&
      POLE.perKSlope < NEAR_SLOPE &&
      POLE.perKSlope < FAR_SLOPE &&
      IMP34636_POLE_SLOPE_IS_BETWEEN === false,
  },
  {
    // (F2) the departure from the centre-drift prediction is only ~1.33 sigma (underpowered).
    id: 'imp-34636-departure-is-about-1p3-sigma',
    description: 'the 9.32e-5 departure from the linear-centroid prediction is ~1.33 sigma of the ~7e-5 pole SE',
    holds: () =>
      Math.abs(IMP34636_DEPARTURE_SIGMA - 1.33) < 0.15 &&
      IMP34636_DEPARTURE_SIGMA < 2 &&
      IMP34636_POLE_SE_OVER_NEAR_SE > 5 &&
      IMP34636_POLE_SE_OVER_FAR_SE > 5,
  },
  {
    // (F3) the fitted log-power q rises toward the pole (above both flanks).
    id: 'imp-34636-q-rises-toward-pole',
    description: 'pole log-power q exceeds both near and far q',
    holds: () =>
      IMP34636_Q_POLE_MINUS_NEAR > 0 && IMP34636_Q_POLE_MINUS_FAR > 0,
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp-34636-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34636_EFLOW_ATTR_POLE_CENTRED_WINDOW_SLOPE.isRigorous === false &&
      /NO QED/.test(IMP34636_EFLOW_ATTR_POLE_CENTRED_WINDOW_SLOPE.honest) &&
      /refereed bound is changed/i.test(IMP34636_EFLOW_ATTR_POLE_CENTRED_WINDOW_SLOPE.honest),
  },
];

for (const a of IMP34636_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34636-eflow-attr-pole-centred-window-slope assertion failed: ${a.id}`);
  }
}
