#!/usr/bin/env node
// scripts/imp-3894-endpoint-concavity-slack-compute.mjs
// imp-3894 OFFLINE COMPUTE: directly MEASURE the endpoint-concavity slack per
// imp-3725 plateau that imp-3870 relocated the imp-3854 predictionRatio residual
// to (after imp-3870 REFUTED the smin/Dmin attribution), and test whether the
// concavity slack -- together with the (H/Dmin)^2 proxy-accuracy factor --
// reproduces predictionRatio in [0.79, 1.56] for BOTH signs (> 1 and < 1).
//
// SETTING (imp-3725 gap-domination bootstrap, unchanged; same evalAt as imp-3874):
//   T        = H^2/(8*thetaBar)
//   s_l(T)   = sqrt(max(g_l(0)^2 - 8T, 0))              (frozen shrunk gap l)
//   D_j(T)   = sum of s_l over the gap path from the record pair a to zero j
//   Psi_N(T) = 4 H^2 * sum_{j not in pair} 1/D_j(T)^2
//   theta_N  = 1 - Psi_N/8,   F_mb = (H^2/8)(1/theta_N - 1)
//   K_paper is a thetaBar-INDEPENDENT monotone multiple of F_mb, so the relative
//   K change over a thetaBar window EQUALS the relative F_mb change.
//
// imp-3854 STEP-1 gives the EXACT horizon derivative (H fixed):
//   dPsi_N/dT = 32 H^2 * sum_j P_j / D_j^3,  P_j = sum_{active l in path j} 1/s_l,
// hence the EXACT theta and F_mb (= K_paper) elasticities in thetaBar:
//   d theta_N/d thetaBar = (T/(8 thetaBar)) dPsi_N/dT                       (> 0)
//   E(thetaBar) := |d ln F_mb/d thetaBar| = (1/(1-theta_N)+1/theta_N) d theta_N/d thetaBar.
//
// imp-3854 STEP-4 predicts the relative K change over the feasible window
// [0.99, thetaBar*] as predictedRelKChange = kElasticityPerUnit * excursion,
// where kElasticityPerUnit = (1 + (1-theta)/theta)(H/Dmin)^2/thetaBar^2 is the
// LEFT-ENDPOINT elasticity with the (H/Dmin)^2 PROXY for the exact dPsi/dT, and
// compares it to the imp-3728 measured improveFactor-1, defining
//   predictionRatio = measuredRelKChange / predictedRelKChange  in [0.79, 1.56].
// imp-3870 refuted the smin/Dmin attribution and relocated the residual to
// endpoint concavity but did NOT decompose it. THIS SCRIPT decomposes it:
//   predictionRatio = concavityFactor * proxyAccuracyFactor, where
//     E_exactLeft   = E(0.99)                         (exact left-endpoint elasticity)
//     deltaLnFmb    = ln(F_mb(0.99)/F_mb(thetaBar*))  (exact finite log K change > 0)
//     concavityFactor    = deltaLnFmb / (E_exactLeft * excursion)   (<= 1: curvature slack)
//     proxyAccuracyFactor= E_exactLeft / kElasticityPerUnit         (how tight the (H/Dmin)^2 proxy is)
//   so concavityFactor * proxyAccuracyFactor = deltaLnFmb / predictedRelKChange
//   which should reproduce predictionRatio (= measuredRelKChange/predictedRelKChange)
//   to the tiny gap deltaLnFmb vs improveFactor-1 (log vs ratio-1, second order).
// TEST: (a) concavityFactor <= 1 UNIFORMLY (concavity is a one-sided downward
//   slack); (b) the SIGN of predictionRatio-1 is set by proxyAccuracyFactor
//   (the (H/Dmin)^2 proxy under/over-estimating the true elasticity), NOT by
//   concavity and NOT by smin/Dmin; (c) reconstruction matches predictionRatio.
//
// Run:  node_modules/.bin/esbuild scripts/imp-3894-endpoint-concavity-slack-compute.mjs \
//         --bundle --format=cjs --platform=node --outfile=/tmp/imp3894.cjs \
//       && node /tmp/imp3894.cjs

import { ZEROS_EXTENDED } from '../src/data/zeros-to-1e6.js';
import { IMP_3854_THETABAR_INSENSITIVITY_DERIVATION } from '../src/data/imp-3854-thetabar-insensitivity-derivation.js';

const SRC54 = IMP_3854_THETABAR_INSENSITIVITY_DERIVATION.rows;

const Z = ZEROS_EXTENDED;
const N_MIN = 10000;
const N_MAX = 1000000;
const THETA_BAR = 0.99;

if (Z.length < N_MAX) throw new Error(`zero table too short: ${Z.length}`);

// gaps g[i] = Z[i+1] - Z[i], 0-indexed.
const G = new Float64Array(N_MAX - 1);
for (let i = 0; i < N_MAX - 1; i++) {
  const d = Z[i + 1] - Z[i];
  if (!(d > 0)) throw new Error(`non-positive gap at ${i}: ${d}`);
  G[i] = d;
}

// Reproduce the imp-3725 running-min plateau structure.
let H = Infinity;
let argmin = -1;
for (let i = 0; i < N_MIN - 1; i++) {
  if (G[i] < H) { H = G[i]; argmin = i; }
}
const plateaus = [{ plateauIndex: 0, startN: N_MIN, endN: null, H, a: argmin }];
for (let N = N_MIN + 1; N <= N_MAX; N++) {
  const i = N - 2;
  if (G[i] < H) {
    plateaus[plateaus.length - 1].endN = N - 1;
    H = G[i];
    plateaus.push({ plateauIndex: plateaus.length, startN: N, endN: null, H, a: i });
  }
}
plateaus[plateaus.length - 1].endN = N_MAX;

// Evaluate Psi_N(T) and the exact analytic dPsi_N/dT (imp-3874 evalAt).
function evalAt(p, T) {
  const { a, H: h, endN } = p;
  const c8T = 8 * T;
  const s = (g) => { const v = g * g - c8T; return v > 0 ? Math.sqrt(v) : 0; };
  let psiSum = 0, dpsiSum = 0;
  let D = 0, P = 0;
  for (let j = a - 1; j >= 0; j--) {
    const sl = s(G[j]);
    if (sl > 0) { D += sl; P += 1 / sl; }
    if (D > 0) { psiSum += 1 / (D * D); dpsiSum += P / (D * D * D); }
  }
  D = 0; P = 0;
  for (let j = a + 2; j <= endN - 1; j++) {
    const sl = s(G[j - 1]);
    if (sl > 0) { D += sl; P += 1 / sl; }
    if (D > 0) { psiSum += 1 / (D * D); dpsiSum += P / (D * D * D); }
  }
  const psi = 4 * h * h * psiSum;
  const dpsi = 32 * h * h * dpsiSum;   // exact analytic dPsi/dT
  return { psi, dpsi };
}

// theta_N, F_mb factor (H^2/8 cancels in ratios so use (1/theta-1)), and the
// EXACT left-endpoint K elasticity E = |d ln F_mb/d thetaBar|.
function stateAt(p, thetaBar) {
  const T = (p.H * p.H) / (8 * thetaBar);
  const { psi, dpsi } = evalAt(p, T);
  const theta = 1 - psi / 8;
  const rrel = 1 / theta - 1;                     // = F_mb / (H^2/8)
  const dThetaDBar = (T / (8 * thetaBar)) * dpsi; // exact, > 0
  const elast = (1 / (1 - theta) + 1 / theta) * dThetaDBar; // exact |d ln F_mb/d thetaBar|
  return { T, psi, theta, rrel, elast };
}

// Feasible-window top thetaBar* as the fixed point theta_N(thetaBar*)=thetaBar*
// (imp-3728/imp-3890 bisection).
function thetaBarStarOf(p) {
  const g = (tb) => (1 - evalAt(p, (p.H * p.H) / (8 * tb)).psi / 8) - tb;
  let lo = 0.5, hi = 0.999999;
  if (g(lo) < 0) return lo;
  if (g(hi) >= 0) return hi;
  for (let it = 0; it < 80; it++) {
    const mid = 0.5 * (lo + hi);
    if (g(mid) >= 0) lo = mid; else hi = mid;
  }
  return lo;
}

// imp-3728 reference (read-only cross-check): thetaBarStar and improveFactor-1.
const REF = [
  { thetaBarStar: 0.99822707, improveFactor: 1.000012 },
  { thetaBarStar: 0.99715949, improveFactor: 1.000014 },
  { thetaBarStar: 0.99852951, improveFactor: 1.000011 },
  { thetaBarStar: 0.99847692, improveFactor: 1.000011 },
  { thetaBarStar: 0.99883762, improveFactor: 1.000007 },
  { thetaBarStar: 0.99904525, improveFactor: 1.000009 },
  { thetaBarStar: 0.99949216, improveFactor: 1.000004 },
  { thetaBarStar: 0.99932382, improveFactor: 1.000004 },
  { thetaBarStar: 0.99975429, improveFactor: 1.000002 },
  { thetaBarStar: 0.9998958,  improveFactor: 1.000001 },
];

const rel = (x, y) => Math.abs(x - y) / Math.max(Math.abs(x), Math.abs(y), 1e-300);

const rows = plateaus.map((p) => {
  const tbStar = thetaBarStarOf(p);
  const excursion = tbStar - THETA_BAR;
  const left = stateAt(p, THETA_BAR);
  const top = stateAt(p, tbStar);
  // Exact finite log change of F_mb (= K_paper) over the feasible window (> 0).
  const deltaLnFmb = Math.log(left.rrel / top.rrel);
  const eExactLeft = left.elast;                 // exact left-endpoint elasticity
  // concavity slack: exact finite change vs left-endpoint linear estimate.
  const linearEstimate = eExactLeft * excursion;
  const concavityFactor = deltaLnFmb / linearEstimate;
  // Live decomposition against imp-3854: the (H/Dmin)^2 proxy elasticity and the
  // measured/predicted predictionRatio it feeds.
  const r54 = SRC54[p.plateauIndex];
  const proxyElast = r54.kElasticityPerUnit;                 // (1+(1-th)/th)(H/Dmin)^2/thetaBar^2
  const proxyAccuracyFactor = eExactLeft / proxyElast;       // exact-left / proxy
  const predictedRelKChange = r54.predictedRelKChange;       // proxyElast * excursion
  const reconstructedPredictionRatio = deltaLnFmb / predictedRelKChange; // = concavity * proxyAccuracy
  const predictionRatio = r54.predictionRatio;               // imp-3854 (uses rounded improveFactor-1)
  return {
    plateauIndex: p.plateauIndex,
    startN: p.startN,
    endN: p.endN,
    H: p.H,
    a: p.a,
    thetaBarStar: tbStar,
    thetaBarStarRelRef: rel(tbStar, REF[p.plateauIndex].thetaBarStar),
    excursion,
    thetaLeft: left.theta,
    eExactLeft,
    deltaLnFmb,
    improveFactorMinus1Ref: REF[p.plateauIndex].improveFactor - 1,
    deltaLnFmbVsRef: rel(deltaLnFmb, REF[p.plateauIndex].improveFactor - 1),
    linearEstimate,
    concavityFactor,
    proxyElast,
    proxyAccuracyFactor,
    reconstructedPredictionRatio,
    predictionRatio,
    reconVsPredictionRatioRel: rel(reconstructedPredictionRatio, predictionRatio),
  };
});

console.log('=== imp-3894 endpoint-concavity-slack direct measurement ===\n');
for (const r of rows) {
  console.log(
    `plateau ${r.plateauIndex} [${r.startN},${r.endN}] H=${r.H.toFixed(8)} thetaBar*=${r.thetaBarStar.toFixed(8)} (relRef=${r.thetaBarStarRelRef.toExponential(2)})\n` +
    `  excursion=${r.excursion.toExponential(6)} E_exactLeft=${r.eExactLeft.toExponential(6)}\n` +
    `  deltaLnFmb=${r.deltaLnFmb.toExponential(6)} (improveFactor-1 ref=${r.improveFactorMinus1Ref.toExponential(6)}, rel=${r.deltaLnFmbVsRef.toExponential(2)})\n` +
    `  linearEstimate=${r.linearEstimate.toExponential(6)} concavityFactor=${r.concavityFactor.toFixed(6)}\n` +
    `  proxyAccuracyFactor=${r.proxyAccuracyFactor.toFixed(6)} reconPredRatio=${r.reconstructedPredictionRatio.toFixed(6)} vs imp3854 predRatio=${r.predictionRatio.toFixed(6)} (rel=${r.reconVsPredictionRatioRel.toExponential(2)})`,
  );
}

const cf = rows.map((r) => r.concavityFactor);
const pa = rows.map((r) => r.proxyAccuracyFactor);
console.log(`\nconcavityFactor range [${Math.min(...cf).toFixed(6)}, ${Math.max(...cf).toFixed(6)}] (all <= 1: ${cf.every((x) => x <= 1)}); max concavity slack = ${(1 - Math.min(...cf)).toExponential(3)}`);
console.log(`proxyAccuracyFactor range [${Math.min(...pa).toFixed(6)}, ${Math.max(...pa).toFixed(6)}] (straddles 1: ${Math.min(...pa) < 1 && Math.max(...pa) > 1})`);
console.log(`max reconstructed vs imp3854 predictionRatio rel: ${Math.max(...rows.map((r) => r.reconVsPredictionRatioRel)).toExponential(3)}`);
console.log(`max deltaLnFmb vs improveFactor-1 rel: ${Math.max(...rows.map((r) => r.deltaLnFmbVsRef)).toExponential(3)}`);
console.log(`max thetaBar* vs imp-3728 ref rel: ${Math.max(...rows.map((r) => r.thetaBarStarRelRef)).toExponential(3)}`);

console.log('\n===JSON===');
console.log(JSON.stringify({
  thetaBar: THETA_BAR,
  rows: rows.map((r) => ({
    plateauIndex: r.plateauIndex,
    startN: r.startN,
    endN: r.endN,
    H: +r.H.toFixed(8),
    a: r.a,
    thetaBarStar: +r.thetaBarStar.toFixed(8),
    excursion: +r.excursion.toExponential(8),
    eExactLeft: +r.eExactLeft.toExponential(8),
    deltaLnFmb: +r.deltaLnFmb.toExponential(8),
    concavityFactor: +r.concavityFactor.toFixed(8),
    proxyAccuracyFactor: +r.proxyAccuracyFactor.toFixed(8),
    reconstructedPredictionRatio: +r.reconstructedPredictionRatio.toFixed(8),
    predictionRatio: +r.predictionRatio.toFixed(8),
    thetaBarStarRelRef: +r.thetaBarStarRelRef.toExponential(4),
    deltaLnFmbVsRef: +r.deltaLnFmbVsRef.toExponential(4),
    reconVsPredictionRatioRel: +r.reconVsPredictionRatioRel.toExponential(4),
  })),
}, null, 1));
