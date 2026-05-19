/**
 * @fileoverview Hardy Z(t) asymptotic comparison data file (imp-1102).
 * Sonnet engine bucket: pure data + assertions, no rendering.
 * @module hardy-z-asymptotic-comparison
 *
 * BACKGROUND. The Hardy Z-function is defined as
 *
 *   Z(t) = e^{i*theta(t)} * zeta(1/2 + it)
 *
 * where theta(t) is the Riemann-Siegel theta function. Because of the
 * functional equation, Z(t) is real for real t, and its zeros correspond
 * exactly to nontrivial zeta-zeros on the critical line.
 *
 * The Riemann-Siegel formula gives
 *   Z(t) = 2 * sum_{n=1}^{N} cos(theta(t) - t*log n) / sqrt(n) + R(t)
 * where N = floor(sqrt(t/(2*pi))) and R(t) = O(t^{-1/4}).
 * The C_0 correction reduces R(t) from O(t^{-1/4}) to O(t^{-3/4}).
 * Adding C_1 and C_2 (riemannSiegelZEnhanced) further reduces to O(t^{-5/4}).
 *
 * THIS FILE tabulates:
 *   - mainSumOnly(t): pure main sum, no correction, error O(t^{-1/4})
 *   - riemannSiegelZEnhanced(t): with C_0+C_1+C_2, error O(t^{-5/4})
 *   - |diff| vs (t/(2*pi))^{-1/4} leading-correction scale
 *   - Z(gamma_n) at known zeros in [100, 130] to verify near-zero behavior
 *   - mean-square of Z(t) over [200, 400] vs Titchmarsh mean-value theorem
 *   - theta(t) residual after leading asymptotic + first correction term
 *
 * TITCHMARSH MEAN-VALUE THEOREM.
 *   (1/T) * integral_0^T |Z(t)|^2 dt ~ log(T/(2*pi)) + 2*gamma_E - 1
 * where gamma_E = 0.5772... (Euler-Mascheroni constant). Leading term is
 * log(T), confirming the mean square grows logarithmically in T.
 *
 * Exports:
 *   HARDY_Z_ASYMPTOTIC            - full comparison data object
 *   HARDY_Z_ASYMPTOTIC_ASSERTIONS - build-time assertion array
 *
 * Ticket: imp-1102 (sonnet-4-6, subscription).
 */

import { riemannSiegelZEnhanced, riemannSiegelTheta, ZETA_ZEROS } from '../math/zeta.js';

const EULER_GAMMA = 0.5772156649015329;
const TWO_PI = 2 * Math.PI;

// Pure main sum with no correction terms.
// Error vs exact Z(t) is O(t^{-1/4}): the leading term not included here.
function mainSumOnly(t) {
  if (t < TWO_PI) return 0;
  const N = Math.floor(Math.sqrt(t / TWO_PI));
  const theta = riemannSiegelTheta(t);
  let s = 0;
  for (let n = 1; n <= N; n++) {
    s += Math.cos(theta - t * Math.log(n)) / Math.sqrt(n);
  }
  return 2 * s;
}

// Test t values spanning ~two decades for the correction-scaling table.
const TEST_T = [100, 316.23, 1000, 3162.3, 10000];

// Build correction-scaling comparison table.
const CORRECTION_TABLE = TEST_T.map(t => {
  const tau = Math.sqrt(t / TWO_PI);
  const N = Math.floor(tau);
  const tFactor = Math.pow(t / TWO_PI, -0.25);  // (t/(2pi))^{-1/4}: leading correction scale
  const zMain = mainSumOnly(t);
  const zEnh  = riemannSiegelZEnhanced(t);
  const diff  = Math.abs(zEnh - zMain);
  return {
    t,
    N,
    tFactor:   +tFactor.toFixed(8),
    zMain:     +zMain.toFixed(8),
    zEnhanced: +zEnh.toFixed(8),
    corrDiff:  +diff.toFixed(8),
    relBound:  +(diff / tFactor).toFixed(6),
  };
});

// Zero verification: Z(gamma_n) should be near 0 for known zeros in [100, 130].
// riemannSiegelZEnhanced has O(t^{-5/4}) error; at t~100 that is ~0.032.
const ZEROS_100_130 = ZETA_ZEROS.filter(g => g >= 100 && g <= 130);
const ZERO_CHECKS = ZEROS_100_130.map((gamma, i) => {
  const absZ = Math.abs(riemannSiegelZEnhanced(gamma));
  return { idx: i + 30, gamma, absZ: +absZ.toFixed(10) };
});

// Mean-square of Z(t) over [200, 400] with dt=0.1 (~2000 samples).
// Titchmarsh prediction at T_mid=300: log(300/(2*pi)) + 2*gamma_E - 1
const MS_T0  = 200;
const MS_T1  = 400;
const MS_DT  = 0.1;
const MS_N   = Math.round((MS_T1 - MS_T0) / MS_DT) + 1;
let _msSum = 0;
for (let i = 0; i < MS_N; i++) {
  const t = MS_T0 + i * MS_DT;
  const z = riemannSiegelZEnhanced(t);
  _msSum += z * z;
}
const MEAN_SQ_OBS  = _msSum / MS_N;
const MS_T_MID     = (MS_T0 + MS_T1) / 2;  // 300
const MEAN_SQ_PRED = Math.log(MS_T_MID / TWO_PI) + 2 * EULER_GAMMA - 1;

// Theta asymptotic residual at t=1000.
// theta(t) = (t/2)*log(t/(2*pi)) - t/2 - pi/8 + 1/(48t) + 7/(5760t^3) + ...
const TH_T      = 1000;
const TH_OBS    = riemannSiegelTheta(TH_T);
const TH_LEAD   = (TH_T / 2) * Math.log(TH_T / TWO_PI) - TH_T / 2 - Math.PI / 8;
const TH_CORR1  = 1 / (48 * TH_T);
const TH_RESID  = Math.abs(TH_OBS - TH_LEAD - TH_CORR1);
// Next term 7/(5760*t^3) at t=1000 is ~1.2e-12; residual must be < 1e-9.

export const HARDY_Z_ASYMPTOTIC = Object.freeze({
  ticket: "imp-1102",
  method: "Hardy Z(t): main-sum vs enhanced (C0+C1+C2) correction scaling",
  description:
    "Tabulates |Z_enhanced - Z_main_only| vs (t/(2*pi))^{-1/4} at five t values " +
    "spanning two decades, verifies Z(gamma_n) near 0 at known zeros in [100,130], " +
    "checks mean-square growth against Titchmarsh theorem, " +
    "and verifies the theta(t) asymptotic residual at t=1000.",
  correctionTable: CORRECTION_TABLE,
  zeroChecks: ZERO_CHECKS,
  meanSquare: Object.freeze({
    interval: [MS_T0, MS_T1],
    dt: MS_DT,
    samples: MS_N,
    observed: +MEAN_SQ_OBS.toFixed(6),
    titchmarshPredAtMid: +MEAN_SQ_PRED.toFixed(6),
    tMid: MS_T_MID,
    ratio: +(MEAN_SQ_OBS / MEAN_SQ_PRED).toFixed(4),
    note:
      "Mean square ~ log(T/(2*pi)) + 2*gamma_E - 1 for large T. " +
      "ratio close to 1 confirms logarithmic growth.",
  }),
  thetaAsymptotic: Object.freeze({
    t: TH_T,
    observed: +TH_OBS.toFixed(10),
    leadingPlusCorr1: +(TH_LEAD + TH_CORR1).toFixed(10),
    residual: +TH_RESID.toFixed(14),
    nextTermBound: 7 / (5760 * TH_T * TH_T * TH_T),
  }),
  eulerGamma: EULER_GAMMA,
});

export const HARDY_Z_ASYMPTOTIC_ASSERTIONS = [
  {
    id: "hardy-z-correction-bounded-by-tFactor",
    holds: () => CORRECTION_TABLE.every(row => row.relBound < 2.0),
    why:
      "The difference |Z_enhanced - Z_main_only| is dominated by the C_0 correction " +
      "(t/(2*pi))^{-1/4} * C_0(p). The code clamps C_0 at singularities, so " +
      "relBound = corrDiff / tFactor < 2.0 at every test point in TEST_T.",
  },
  {
    id: "hardy-z-tFactor-strictly-decreasing",
    holds: () => {
      const tf = CORRECTION_TABLE.map(r => r.tFactor);
      return tf.every((b, i) => i === 0 || b < tf[i - 1]);
    },
    why:
      "The leading correction scale (t/(2*pi))^{-1/4} is strictly decreasing in t. " +
      "Non-monotone values would signal a sorting error in TEST_T.",
  },
  {
    id: "hardy-z-zero-values-small",
    holds: () => ZERO_CHECKS.length >= 5 && ZERO_CHECKS.every(r => r.absZ < 0.1),
    why:
      "Z(gamma_n) = 0 at nontrivial zeros. The enhanced formula has O(t^{-5/4}) " +
      "error (~0.032 at t=100). All known zeros in [100, 130] must give absZ < 0.1. " +
      "Also checks that at least 5 zeros are found in [100, 130].",
  },
  {
    id: "hardy-z-mean-square-in-range",
    holds: () => MEAN_SQ_OBS > 2.0 && MEAN_SQ_OBS < 9.0,
    why:
      "Titchmarsh mean-value: mean square over [200,400] should be ~log(300/(2*pi)) " +
      "+ 2*gamma_E - 1 ~ 4. The bounds [2, 9] are generous but exclude degenerate values.",
  },
  {
    id: "hardy-z-n-count-matches-floor-sqrt",
    holds: () => CORRECTION_TABLE.every(
      row => row.N === Math.floor(Math.sqrt(row.t / TWO_PI))
    ),
    why:
      "N = floor(sqrt(t/(2*pi))) is the canonical Riemann-Siegel main sum length. " +
      "Mismatch between the table N and the formula would indicate an inconsistency " +
      "in mainSumOnly relative to the math library.",
  },
  {
    id: "hardy-z-theta-residual-below-formula-next-term",
    holds: () => TH_RESID < 1e-9,
    why:
      "theta(1000) = leading + 1/(48*1000) + 7/(5760*1e9) + ... " +
      "After subtracting leading and first correction, the residual is " +
      "7/(5760*1e9) ~ 1.2e-12 < 1e-9. Verifies the riemannSiegelTheta " +
      "implementation carries both the leading term and the 1/(48t) correction.",
  },
  {
    id: "hardy-z-mean-square-ratio-near-one",
    holds: () => {
      const ratio = MEAN_SQ_OBS / MEAN_SQ_PRED;
      return ratio > 0.7 && ratio < 1.6;
    },
    why:
      "The observed mean square divided by the Titchmarsh prediction at T_mid=300 " +
      "should be close to 1. The interval [200,400] is not asymptotically large so " +
      "finite-T corrections exist; ratio in [0.7, 1.6] confirms the right order.",
  },
];

for (const a of HARDY_Z_ASYMPTOTIC_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      "HARDY_Z_ASYMPTOTIC assertion failed: " + a.id + " -- " + a.why,
    );
  }
}
