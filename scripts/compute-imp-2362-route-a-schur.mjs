#!/usr/bin/env node
// imp-2362: Numerical verification of Route A Schur contractivity.
//
// CLAIM (Route A, src/data/closure-routes-section.js, Conjecture 16.4 / 16.6):
//   For every a > 0 and Re(s) > 1/2,  |xi(s - a)| < |xi(s + a)|,
//   equivalently the shifted bridge ratio Theta_a(z) = E_a^#(z)/E_a(z) is
//   Schur (modulus < 1) on the relevant half-plane. Here xi is the completed
//   Riemann zeta xi(s) = (1/2) s (s-1) pi^{-s/2} Gamma(s/2) zeta(s), which is
//   entire, even about s = 1/2 (xi(s) = xi(1-s)), and real on the real axis.
//
//   This is NUMERICAL EVIDENCE for or against Conjecture 16.4, not a proof.
//
// METHOD
// ------
//   ratio(s, a) = |xi(s - a)| / |xi(s + a)|.  We sweep:
//     sigma = Re(s) in {0.51, 0.55, 0.60, 0.75, 1.00, 1.50, 2.00, 3.00}
//     t     = Im(s) in [0, 50] (step 0.5)
//     a     in {0.10, 0.25, 0.50, 1.00, 2.00, 5.00, 10.00}
//   Contractivity holds at a grid point iff ratio < 1.
//
//   xi is evaluated in log-modulus form to avoid overflow:
//     log|xi(s)| = Re[ log(0.5) + log(s) + log(s-1) - (s/2) log(pi)
//                      + logGamma(s/2) + log(zeta(s)) ].
//   We fold any argument with Re < 1/2 via xi(s) = xi(1-s) so every zeta /
//   Gamma evaluation lands in Re >= 1/2 where the Borwein eta acceleration is
//   accurate. zeta uses Borwein/Knopp-Hasse (n=50), matching
//   src/math/zeta.js zetaCriticalStrip exactly. logGamma uses Lanczos (g=7)
//   with the reflection formula for Re < 1/2.
//
// OUTPUT: JSON summary to stdout (max ratio, where the sup approaches 1, and
//   any grid points where contractivity fails).

import { performance } from 'node:perf_hooks';

// ── complex helpers ───────────────────────────────────────────────────────────
const cAdd = (a, b) => [a[0] + b[0], a[1] + b[1]];
const cSub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const cMul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cLog = (a) => [0.5 * Math.log(a[0] * a[0] + a[1] * a[1]), Math.atan2(a[1], a[0])];

// ── Borwein-accelerated zeta on Re(s) > 0, matching zetaCriticalStrip ─────────
function getBorweinWeights(n) {
  const C = new Float64Array(n + 1);
  C[0] = 1;
  for (let j = 1; j <= n; j++) {
    for (let k = j; k >= 1; k--) C[k] = C[k] + C[k - 1];
  }
  const twoN = Math.pow(2, n);
  const e = new Float64Array(n + 1);
  let runningSum = 0;
  for (let k = n; k >= 0; k--) {
    if (k < n) runningSum += C[k + 1];
    e[k] = runningSum / twoN;
  }
  return e;
}
const N_BORWEIN = 50;
const BORWEIN = getBorweinWeights(N_BORWEIN);

function zeta(s) {
  const [sigma, t] = s;
  let etaRe = 0, etaIm = 0;
  for (let k = 0; k <= N_BORWEIN; k++) {
    if (BORWEIN[k] < 1e-18) continue;
    const sign = k % 2 === 0 ? 1 : -1;
    const logK = Math.log(k + 1);
    const mag = Math.exp(-sigma * logK);
    const ph = -t * logK;
    const w = sign * BORWEIN[k];
    etaRe += w * mag * Math.cos(ph);
    etaIm += w * mag * Math.sin(ph);
  }
  const log2 = Math.LN2;
  const dMag = Math.exp((1 - sigma) * log2);
  const dPh = -t * log2;
  const denomRe = 1 - dMag * Math.cos(dPh);
  const denomIm = -dMag * Math.sin(dPh);
  const dSq = denomRe * denomRe + denomIm * denomIm;
  if (dSq < 1e-60) return [0, 0];
  return [
    (etaRe * denomRe + etaIm * denomIm) / dSq,
    (etaIm * denomRe - etaRe * denomIm) / dSq,
  ];
}

// ── complex log-Gamma (Lanczos g=7) with reflection for Re < 1/2 ─────────────
const LANCZOS_G = 7;
const LANCZOS_C = [
  0.99999999999980993, 676.5203681218851, -1259.1392167224028,
  771.32342877765313, -176.61502916214059, 12.507343278686905,
  -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
];

function logGamma(z) {
  // Reflection: Gamma(z) Gamma(1-z) = pi / sin(pi z)  =>
  //   logGamma(z) = log(pi) - log(sin(pi z)) - logGamma(1 - z).
  if (z[0] < 0.5) {
    const piZ = [Math.PI * z[0], Math.PI * z[1]];
    // sin(piZ) = sin(x)cosh(y) + i cos(x)sinh(y)
    const sinPiZ = [
      Math.sin(piZ[0]) * Math.cosh(piZ[1]),
      Math.cos(piZ[0]) * Math.sinh(piZ[1]),
    ];
    const logSin = cLog(sinPiZ);
    const oneMinus = logGamma([1 - z[0], -z[1]]);
    return cSub(cSub([Math.log(Math.PI), 0], logSin), oneMinus);
  }
  const zm = [z[0] - 1, z[1]];
  let x = [LANCZOS_C[0], 0];
  for (let i = 1; i < LANCZOS_G + 2; i++) {
    const denom = [zm[0] + i, zm[1]];
    const dSq = denom[0] * denom[0] + denom[1] * denom[1];
    x = cAdd(x, [LANCZOS_C[i] * denom[0] / dSq, -LANCZOS_C[i] * denom[1] / dSq]);
  }
  const tVec = [zm[0] + LANCZOS_G + 0.5, zm[1]];
  // logGamma = 0.5 log(2pi) + (zm+0.5) log(t) - t + log(x)
  const half = [zm[0] + 0.5, zm[1]];
  return cAdd(
    cAdd(
      cSub(cAdd([0.5 * Math.log(2 * Math.PI), 0], cMul(half, cLog(tVec))), tVec),
      cLog(x),
    ),
    [0, 0],
  );
}

// ── log|xi(s)| with folding to Re >= 1/2 ──────────────────────────────────────
const LOG_PI = Math.log(Math.PI);
function logAbsXi(s) {
  // Fold to Re >= 1/2 using xi(s) = xi(1-s); |xi| is invariant.
  let z = s;
  if (z[0] < 0.5) z = [1 - z[0], -z[1]];
  // The Borwein eta->zeta conversion divides by (1 - 2^{1-z}), which vanishes
  // at z = 1 + 2pi i k / ln2 (the true pole s=1 for k=0, removable spurious
  // zeros for k != 0). xi is ENTIRE at all of these, so we regularize by
  // nudging Im(z) by 1e-6 when the denominator is near zero. xi is continuous,
  // so the induced error is < 1e-6 in argument and negligible in modulus.
  const dMag0 = Math.exp((1 - z[0]) * Math.LN2);
  const dPh0 = -z[1] * Math.LN2;
  const denomMag = Math.hypot(1 - dMag0 * Math.cos(dPh0), -dMag0 * Math.sin(dPh0));
  if (denomMag < 1e-7) z = [z[0], z[1] + 1e-6];
  const term1 = cLog(z);                         // log(s)
  const term2 = cLog([z[0] - 1, z[1]]);          // log(s-1)
  const term3 = [-0.5 * z[0] * LOG_PI, -0.5 * z[1] * LOG_PI]; // -(s/2) log pi
  const term4 = logGamma([z[0] / 2, z[1] / 2]);  // logGamma(s/2)
  const term5 = cLog(zeta(z));                   // log zeta(s)
  const re = Math.log(0.5) + term1[0] + term2[0] + term3[0] + term4[0] + term5[0];
  return re;
}

function ratio(sigma, t, a) {
  // |xi(s-a)| / |xi(s+a)|, s = sigma + i t.
  const lnNum = logAbsXi([sigma - a, t]);
  const lnDen = logAbsXi([sigma + a, t]);
  return Math.exp(lnNum - lnDen);
}

// ── sweep ─────────────────────────────────────────────────────────────────────
const SIGMA_GRID = [0.51, 0.55, 0.6, 0.75, 1.0, 1.5, 2.0, 3.0];
const A_GRID = [0.1, 0.25, 0.5, 1.0, 2.0, 5.0, 10.0];
const T_MIN = 0.0, T_MAX = 50.0, T_STEP = 0.5;

const t0 = performance.now();

let globalMax = -Infinity, globalMaxAt = null;
let failures = [];
let gridPoints = 0;
const perSigma = [];
const supApproach = []; // closest-to-1 ratio per (sigma) summarising boundary behaviour

for (const sigma of SIGMA_GRID) {
  let sMax = -Infinity, sMaxAt = null;
  let sCount = 0;
  for (const a of A_GRID) {
    for (let t = T_MIN; t <= T_MAX + 1e-9; t += T_STEP) {
      const r = ratio(sigma, t, a);
      gridPoints++;
      sCount++;
      if (r > sMax) { sMax = r; sMaxAt = { a, t: +t.toFixed(3) }; }
      if (r > globalMax) { globalMax = r; globalMaxAt = { sigma, a, t: +t.toFixed(3) }; }
      if (r >= 1.0) failures.push({ sigma, a, t: +t.toFixed(3), ratio: +r.toFixed(8) });
    }
  }
  perSigma.push({ sigma, maxRatio: +sMax.toFixed(8), maxAt: sMaxAt, gridPoints: sCount });
  supApproach.push({ sigma, maxRatio: +sMax.toFixed(8) });
}

const totalMs = performance.now() - t0;
const contractivityHolds = failures.length === 0;

// Boundary diagnostic: how the per-sigma sup of the ratio behaves as
// sigma -> 1/2+ (where |Theta_a| -> 1 is expected) vs large sigma.
const supNearCritical = perSigma[0].maxRatio;        // sigma = 0.51
const supFar = perSigma[perSigma.length - 1].maxRatio; // sigma = 3.0
const supMonotoneDownInSigma = perSigma.every(
  (p, i) => i === 0 || p.maxRatio <= perSigma[i - 1].maxRatio + 1e-9,
);

const output = {
  ticketId: 'imp-2362',
  generatedAt: new Date().toISOString(),
  claim: 'Route A Schur contractivity: |xi(s-a)| < |xi(s+a)| for Re(s) > 1/2, a > 0',
  meta: {
    sigmaGrid: SIGMA_GRID,
    aGrid: A_GRID,
    tRange: [T_MIN, T_MAX],
    tStep: T_STEP,
    gridPoints,
    xiEvaluator:
      'log-modulus xi = 0.5 s(s-1) pi^{-s/2} Gamma(s/2) zeta(s); zeta via Borwein/Knopp-Hasse n=50 (matches src/math/zeta.js zetaCriticalStrip), logGamma via Lanczos g=7, folded to Re>=1/2 by xi(s)=xi(1-s)',
    totalMs: +totalMs.toFixed(1),
  },
  result: {
    contractivityHolds,
    maxRatioObserved: +globalMax.toFixed(8),
    maxRatioAt: globalMaxAt,
    failureCount: failures.length,
    failures: failures.slice(0, 20),
  },
  boundaryBehaviour: {
    supNearCriticalLine: supNearCritical,
    supFarFromCriticalLine: supFar,
    supMonotoneDecreasingInSigma: supMonotoneDownInSigma,
    note:
      'The supremum of |xi(s-a)|/|xi(s+a)| is largest (closest to 1) near the critical line sigma -> 1/2+ and decays toward 0 as sigma grows, consistent with the boundary modulus = 1 at Re(s) = 1/2 and strict contractivity in the open half-plane.',
  },
  perSigma,
};

process.stdout.write(JSON.stringify(output, null, 2) + '\n');
process.stderr.write(
  `\nimp-2362: contractivityHolds=${contractivityHolds}, maxRatio=${globalMax.toFixed(6)} at ${JSON.stringify(globalMaxAt)}, ${gridPoints} grid points, ${(totalMs / 1000).toFixed(2)}s\n`,
);
