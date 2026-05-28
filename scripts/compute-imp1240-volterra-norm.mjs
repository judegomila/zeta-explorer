#!/usr/bin/env node
// imp-1240: empirical operator-norm pilot for the §27 Volterra-Hankel operator
//
//   V_{a,Phi,U,N}[i, j] = h * Phi(t_i) * Phi(t_j) * sinh(a*(t_j - t_i))  for j > i
//                       0                                                otherwise
//
// where:
//   - U is the truncation window so the operator acts on L^2([0, U])
//   - N is the discretization size (uniform grid t_i = i*h, h = U/N)
//   - Phi is the de Bruijn-Newman completed-Riemann kernel
//         Phi(u) = sum_{n=1..N_PHI} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) * exp(-pi n^2 e^{4u})
//     truncated at N_PHI = 10 (converges fast)
//   - The operator norm is computed via power iteration on V V^T.
//
// Sweep:
//   U in {1, 2, 5, 10, 20}
//   a in {0.5, 0.2, 0.1, 0.05, 0.025}
//
// Output: JSON to stdout with rows {U, a, norm, exceedsOne}.
//
// HONEST SCOPE:
//   - Phi is truncated at n=10; tail magnitude is O(exp(-pi*100*e^{4u})) which is
//     << 1e-30 for u > 0. For u closer to 0 the tail is heavier but still
//     << numerical precision for our window.
//   - Operator-norm estimate uses power iteration with a tolerance (1e-10 on
//     ratio of consecutive Rayleigh quotients).
//   - N=200 discretization. Norms are LOWER bounds on the true L^2 norm (the
//     truncated matrix norm converges from below as N -> infty).

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
// We compute on the matrix M = V (N x N strictly lower-triangular below the
// diagonal — wait, no: V[i, j] != 0 for j > i so V is strictly UPPER triangular
// in indexed form. Operator-2-norm = sqrt(lambda_max(V^T V)) regardless).
function operator2Norm(V, N, tol = 1e-10, maxIter = 5000) {
  // Random init vector.
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
      // row[j] is nonzero only for j > i
      for (let j = i + 1; j < N; j++) {
        s += row[j] * x[j];
      }
      y[i] = s;
    }
    // z = V^T y  ⇒  z[j] = sum_i V[i, j] y[i]  for j > i, so z[j] = sum_{i<j} V[i,j] y[i]
    const z = new Float64Array(N);
    for (let j = 0; j < N; j++) {
      let s = 0;
      for (let i = 0; i < j; i++) {
        s += V[i][j] * y[i];
      }
      z[j] = s;
    }
    // Rayleigh quotient lambda = ||z|| (since z = V^T V x and x is unit, the
    // power iterate gives ||V^T V x|| = lambda * ||x|| once converged).
    let lambda = 0;
    for (let j = 0; j < N; j++) lambda += z[j] * z[j];
    lambda = Math.sqrt(lambda); // this is ||V^T V x||
    // Use Rayleigh quotient (x . V^T V x) / (x . x) = (Vx . Vx) = ||y||^2
    let rq = 0;
    for (let i = 0; i < N; i++) rq += y[i] * y[i];

    // Normalize z to get next iterate.
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
    t[i] = (i + 0.5) * h;       // midpoint rule for the discretization
    phiT[i] = Phi(t[i]);
  }
  // V[i][j] = h * phi(t_i) * phi(t_j) * sinh(a (t_j - t_i))  for j > i
  // Use plain JS arrays of Float64Array rows (jagged is fine).
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
const U_GRID = [1, 2, 5, 10, 20];
const A_GRID = [0.5, 0.2, 0.1, 0.05, 0.025];
const N_DISC = 200;

// Seed RNG (Math.random is fine; power iteration converges regardless of init)
// but we want reproducibility, so override Math.random with a simple LCG.
let _seed = 0x12345678;
Math.random = function () {
  _seed = (_seed * 1103515245 + 12345) & 0x7fffffff;
  return _seed / 0x7fffffff;
};

const rows = [];
console.error(`# imp-1240 Volterra-norm pilot — N=${N_DISC}, ${U_GRID.length}x${A_GRID.length} sweep`);
const startAll = performance.now();
for (const U of U_GRID) {
  for (const a of A_GRID) {
    const t0 = performance.now();
    const V = buildV(a, U, N_DISC);
    const norm = operator2Norm(V, N_DISC);
    const dt = performance.now() - t0;
    const exceedsOne = norm > 1;
    rows.push({ U, a, norm, exceedsOne });
    console.error(`  U=${U.toString().padStart(3)} a=${a.toFixed(3)}  ||V||=${norm.toExponential(6)}  exceedsOne=${exceedsOne}  (${dt.toFixed(0)} ms)`);
  }
}
const totalMs = performance.now() - startAll;

// Verdict ─────────────────────────────────────────────────────────────────────
const allBelowOne = rows.every((r) => !r.exceedsOne);
const allAboveOne = rows.every((r) => r.exceedsOne);
const someExceed = !allBelowOne;
let verdict;
if (allBelowOne) verdict = 'norms-all-below-one';
else if (allAboveOne) verdict = 'all-exceed-one';
else {
  // Decide spike pattern. Look at which slice exceeds.
  const exceedRows = rows.filter((r) => r.exceedsOne);
  const minA_exc = Math.min(...exceedRows.map((r) => r.a));
  const maxU_exc = Math.max(...exceedRows.map((r) => r.U));
  // If spike correlates with small a (lower-a slice has more exceedances), call it small-a spike.
  const lowA_excCount = rows.filter((r) => r.a <= 0.05 && r.exceedsOne).length;
  const highU_excCount = rows.filter((r) => r.U >= 10 && r.exceedsOne).length;
  if (lowA_excCount >= highU_excCount) verdict = 'spikes-at-small-a';
  else verdict = 'spikes-at-large-U';
}

// Summary stats ──────────────────────────────────────────────────────────────
const allNorms = rows.map((r) => r.norm);
const minNorm = Math.min(...allNorms);
const maxNorm = Math.max(...allNorms);
const meanNorm = allNorms.reduce((s, v) => s + v, 0) / allNorms.length;
const countExceedsOne = rows.filter((r) => r.exceedsOne).length;

const output = {
  generatedAt: new Date().toISOString(),
  meta: {
    N_discretization: N_DISC,
    N_phi_truncation: N_PHI,
    U_grid: U_GRID,
    a_grid: A_GRID,
    powerIterTol: 1e-10,
    totalMs,
  },
  rows,
  summary: {
    nRows: rows.length,
    nExceedsOne: countExceedsOne,
    minNorm,
    maxNorm,
    meanNorm,
    verdict,
  },
};

console.log(JSON.stringify(output, null, 2));
