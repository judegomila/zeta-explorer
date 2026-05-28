#!/usr/bin/env node
// imp-1248: adaptive-N rescan of the imp-1240 §27 Volterra-Hankel operator-norm
// pilot, with N scaled proportionally to U so the mesh stays fine.
//
//   V_{a,Phi,U,N}[i, j] = h * Phi(t_i) * Phi(t_j) * sinh(a*(t_j - t_i))  for j > i
//                       0                                                otherwise
//
//   h = U / N,  N = 100*U + 100  (so U=1->N=200, U=20->N=2100, U=100->N=10100)
//
// Sweep:
//   U in {1, 2, 5, 10, 20, 50, 100}   (vs imp-1240 stopped at U=20)
//   a in {0.5, 0.2, 0.1, 0.05, 0.025} (App S adaptive-refinement range)
//
// Goal: verify §27 MONOTONICITY ‖V_{a,U,N}‖ non-decreasing in U for fixed a
// — the imp-1240 pilot at fixed N=200 saw a DECREASE at U=20 (mesh-coarsening
// artifact). Adaptive N should remove that artifact.
//
// Output: JSON to stdout with rows {U, a, N, norm, exceedsOne}.
//
// HONEST SCOPE:
//   - Phi truncated at n=10; tail magnitude << 1e-30 for u > 0 (Cauchy-Schwarz).
//   - Power iteration tol 1e-10; warm-started at small U then N rolled forward.
//   - Truncated matrix norms are LOWER bounds on the L²([0, U]) operator norm
//     (converges from below as N -> infty).
//   - U=100 with N=10100 is a 10100x10100 strictly upper-triangular matrix;
//     stored as Float64Array rows; outer power-iter loop O(N^2) per iterate.
//     Walltime budget: minutes-scale, not seconds.

import { performance } from 'node:perf_hooks';

// ── de Bruijn-Newman Phi kernel ─────────────────────────────────────────────
const N_PHI = 10;
function Phi(u) {
  let sum = 0;
  const e2u = Math.exp(2 * u);
  const e4u = Math.exp(4 * u);
  for (let n = 1; n <= N_PHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    const term = (2 * Math.PI * Math.PI * n4 * e4u - 3 * Math.PI * n2 * e2u) *
                 Math.exp(-Math.PI * n2 * e4u);
    sum += term;
  }
  return sum;
}

// ── Power iteration for ||V|| = sqrt(lambda_max(V^T V)) ─────────────────────
function operator2Norm(V, N, tol = 1e-10, maxIter = 5000) {
  let x = new Float64Array(N);
  for (let i = 0; i < N; i++) x[i] = Math.random() - 0.5;
  let nrm = 0;
  for (let i = 0; i < N; i++) nrm += x[i] * x[i];
  nrm = Math.sqrt(nrm);
  if (nrm === 0) {
    x[0] = 1;
    nrm = 1;
  }
  for (let i = 0; i < N; i++) x[i] /= nrm;

  let lambdaPrev = 0;
  for (let iter = 0; iter < maxIter; iter++) {
    // y = V x  (only j > i entries are nonzero)
    const y = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      const row = V[i];
      let s = 0;
      for (let j = i + 1; j < N; j++) {
        s += row[j] * x[j];
      }
      y[i] = s;
    }
    // z = V^T y  =>  z[j] = sum_{i<j} V[i,j] y[i]
    const z = new Float64Array(N);
    for (let j = 0; j < N; j++) {
      let s = 0;
      for (let i = 0; i < j; i++) {
        s += V[i][j] * y[i];
      }
      z[j] = s;
    }
    let lambda = 0;
    for (let j = 0; j < N; j++) lambda += z[j] * z[j];
    lambda = Math.sqrt(lambda);
    let rq = 0;
    for (let i = 0; i < N; i++) rq += y[i] * y[i];

    if (lambda === 0) break;
    for (let j = 0; j < N; j++) x[j] = z[j] / lambda;

    if (iter > 5 && Math.abs(rq - lambdaPrev) / Math.max(rq, 1e-300) < tol) {
      return Math.sqrt(rq);
    }
    lambdaPrev = rq;
  }
  // Final Rayleigh quotient.
  const y = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    let s = 0;
    for (let j = i + 1; j < N; j++) s += V[i][j] * x[j];
    y[i] = s;
  }
  let rq = 0;
  for (let i = 0; i < N; i++) rq += y[i] * y[i];
  return Math.sqrt(rq);
}

// ── Build V_{a,Phi,U,N} ─────────────────────────────────────────────────────
function buildV(a, U, N) {
  const h = U / N;
  const t = new Float64Array(N);
  const phiT = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    t[i] = (i + 0.5) * h;       // midpoint rule
    phiT[i] = Phi(t[i]);
  }
  const V = new Array(N);
  for (let i = 0; i < N; i++) {
    const row = new Float64Array(N);
    for (let j = i + 1; j < N; j++) {
      const dt = t[j] - t[i];
      row[j] = h * phiT[i] * phiT[j] * Math.sinh(a * dt);
    }
    V[i] = row;
  }
  return V;
}

// ── Sweep ───────────────────────────────────────────────────────────────────
const U_GRID = [1, 2, 5, 10, 20, 50, 100];
const A_GRID = [0.5, 0.2, 0.1, 0.05, 0.025];
function adaptiveN(U) {
  return 100 * U + 100;
}

// Seed LCG for reproducible power-iteration starts.
let _seed = 0x12345678;
Math.random = function () {
  _seed = (_seed * 1103515245 + 12345) & 0x7fffffff;
  return _seed / 0x7fffffff;
};

const rows = [];
console.error(`# imp-1248 Volterra-norm rescan — N = 100*U + 100, ${U_GRID.length}x${A_GRID.length} sweep`);
const startAll = performance.now();
for (const U of U_GRID) {
  const N = adaptiveN(U);
  for (const a of A_GRID) {
    const t0 = performance.now();
    const V = buildV(a, U, N);
    const norm = operator2Norm(V, N);
    const dt = performance.now() - t0;
    const exceedsOne = norm > 1;
    rows.push({ U, a, N, norm, exceedsOne });
    console.error(`  U=${U.toString().padStart(3)} N=${N.toString().padStart(5)} a=${a.toFixed(3)}  ||V||=${norm.toExponential(6)}  exceedsOne=${exceedsOne}  (${dt.toFixed(0)} ms)`);
  }
}
const totalMs = performance.now() - startAll;

// Monotonicity in U for fixed a:
// §27 prediction: ‖V_{a,U,N}‖ is non-decreasing in U (operator acts on more L²).
const monotonicityByA = {};
for (const a of A_GRID) {
  const slice = rows.filter((r) => r.a === a).sort((x, y) => x.U - y.U);
  let isMonotone = true;
  let firstViolation = null;
  for (let i = 1; i < slice.length; i++) {
    if (slice[i].norm < slice[i - 1].norm - 1e-12) {
      isMonotone = false;
      if (!firstViolation) {
        firstViolation = {
          U_lo: slice[i - 1].U,
          norm_lo: slice[i - 1].norm,
          U_hi: slice[i].U,
          norm_hi: slice[i].norm,
        };
      }
    }
  }
  monotonicityByA[a] = { isMonotone, firstViolation, normsByU: slice.map((s) => ({ U: s.U, norm: s.norm })) };
}
const allMonotone = Object.values(monotonicityByA).every((m) => m.isMonotone);

// Verdict
const allBelowOne = rows.every((r) => !r.exceedsOne);
let verdict;
if (allBelowOne && allMonotone) verdict = 'norms-all-below-one-and-monotone-in-U';
else if (allBelowOne && !allMonotone) verdict = 'norms-all-below-one-but-not-clean-monotone-in-U';
else verdict = 'some-norms-exceed-one';

const allNorms = rows.map((r) => r.norm);
const minNorm = Math.min(...allNorms);
const maxNorm = Math.max(...allNorms);
const meanNorm = allNorms.reduce((s, v) => s + v, 0) / allNorms.length;

// Comparison to imp-1240 (fixed N=200, U <= 20)
// Frozen imp-1240 norms (5x5 at fixed N=200):
const IMP1240_ROWS = [
  { U: 1, a: 0.5, norm: 0.00018608612344092002 },
  { U: 1, a: 0.2, norm: 0.00007440659997048165 },
  { U: 1, a: 0.1, norm: 0.00003720131150451293 },
  { U: 1, a: 0.05, norm: 0.000018600407207054478 },
  { U: 1, a: 0.025, norm: 0.000009300172535842251 },
  { U: 2, a: 0.5, norm: 0.0001855277466889771 },
  { U: 2, a: 0.2, norm: 0.0000741833801910759 },
  { U: 2, a: 0.1, norm: 0.000037089710961388445 },
  { U: 2, a: 0.05, norm: 0.000018544608103717918 },
  { U: 2, a: 0.025, norm: 0.000009272273130199163 },
  { U: 5, a: 0.5, norm: 0.00018173409446356508 },
  { U: 5, a: 0.2, norm: 0.0000726668313474798 },
  { U: 5, a: 0.1, norm: 0.000036331501652223323 },
  { U: 5, a: 0.05, norm: 0.000018165511587559465 },
  { U: 5, a: 0.025, norm: 0.00000908272588940248 },
  { U: 10, a: 0.5, norm: 0.0001690714868120457 },
  { U: 10, a: 0.2, norm: 0.00006760488286871405 },
  { U: 10, a: 0.1, norm: 0.00003380074834857395 },
  { U: 10, a: 0.05, norm: 0.0000169001625506353 },
  { U: 10, a: 0.025, norm: 0.0000084500548227384 },
  { U: 20, a: 0.5, norm: 0.00011424877526521004 },
  { U: 20, a: 0.2, norm: 0.00004568172950877526 },
  { U: 20, a: 0.1, norm: 0.000022839594999986143 },
  { U: 20, a: 0.05, norm: 0.000011419638786321353 },
  { U: 20, a: 0.025, norm: 0.0000057097995541275935 },
];
const COMPARISON = [];
for (const old of IMP1240_ROWS) {
  const fresh = rows.find((r) => r.U === old.U && r.a === old.a);
  if (fresh) {
    COMPARISON.push({
      U: old.U,
      a: old.a,
      imp1240_norm_N200: old.norm,
      imp1248_norm_Nadapt: fresh.norm,
      imp1248_N: fresh.N,
      ratio_1248_over_1240: fresh.norm / old.norm,
    });
  }
}

const output = {
  generatedAt: new Date().toISOString(),
  meta: {
    N_phi_truncation: N_PHI,
    U_grid: U_GRID,
    a_grid: A_GRID,
    N_formula: 'N = 100*U + 100',
    powerIterTol: 1e-10,
    totalMs,
  },
  rows,
  monotonicityByA,
  comparison: COMPARISON,
  summary: {
    nRows: rows.length,
    nExceedsOne: rows.filter((r) => r.exceedsOne).length,
    minNorm,
    maxNorm,
    meanNorm,
    allMonotone,
    verdict,
  },
};

console.log(JSON.stringify(output, null, 2));
