#!/usr/bin/env node
// imp-2401: DENSE a-grid Volterra-Hankel operator-norm sweep across the
// crossover region where ||V_{a,Phi}|| approaches 1.
//
// CONTEXT
//   imp-1316 (large-a sweep) showed:
//     a=10 -> ||V||_Galerkin = 4.51e-3 (<< 1)
//     a=50 -> ||V||_Galerkin = 53.16   (> 1, Conj 27.2 falsified)
//   so the ||V|| = 1 crossing lies in 10 < a < 50, but the imp-1316 grid is
//   too coarse to localize it. The imp-1267 HS bound proves ||V|| <= 1 for
//   a <= ~37.66, so the empirical crossing should sit at or beyond a ~ 37.66.
//   This script runs a DENSE grid a in {10,15,...,48,50} to map the boundary.
//
// METHOD (kernel + power iteration VERBATIM from compute-imp1316-large-a.mjs;
// only the a-grid is denser):
//   V[i,j] = h*Phi(t_i)*Phi(t_j)*sinh(a*(t_j - t_i)) for j > i; 0 otherwise.
//   U = 4.0 (Phi underflows to 0 for t > ~1.355, so U=4 captures full support).
//   N = min(5000, max(2000, round(a*U*20))).
//   Galerkin matrix 2-norm via power iteration on V^T V (Rayleigh quotient).
//
// HONEST SCOPE
//   - The matrix 2-norm is a LOWER BOUND on the L^2 operator norm (Galerkin
//     converges from below). So the located crossing a* (where the Galerkin
//     norm hits 1) is an UPPER bound on the true crossing: the true ||V|| hits
//     1 at some a <= a*.
//   - Phi truncated at n=10; tail < 1e-30 (Cauchy-Schwarz, same as imp-1316).
//   - Power iteration tol 1e-10; LCG seed 0x12345678 (same as imp-1316).
//   - This is an EMPIRICAL pilot, not a proof.

import { performance } from 'node:perf_hooks';

const N_PHI = 10;
function Phi(u) {
  let sum = 0;
  const e2u = Math.exp(2 * u);
  const e4u = Math.exp(4 * u);
  for (let n = 1; n <= N_PHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    sum += (2 * Math.PI * Math.PI * n4 * e4u - 3 * Math.PI * n2 * e2u) *
           Math.exp(-Math.PI * n2 * e4u);
  }
  return sum;
}

function operator2Norm(V, N, tol = 1e-10, maxIter = 5000) {
  let x = new Float64Array(N);
  for (let i = 0; i < N; i++) x[i] = Math.random() - 0.5;
  let nrm = 0;
  for (let i = 0; i < N; i++) nrm += x[i] * x[i];
  nrm = Math.sqrt(nrm);
  if (nrm === 0) { x[0] = 1; nrm = 1; }
  for (let i = 0; i < N; i++) x[i] /= nrm;

  let lambdaPrev = 0;
  let residual = Infinity;
  let iter;
  for (iter = 0; iter < maxIter; iter++) {
    const y = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      const row = V[i];
      let s = 0;
      for (let j = i + 1; j < N; j++) s += row[j] * x[j];
      y[i] = s;
    }
    const z = new Float64Array(N);
    for (let j = 0; j < N; j++) {
      let s = 0;
      for (let i = 0; i < j; i++) s += V[i][j] * y[i];
      z[j] = s;
    }
    let lambda = 0;
    for (let j = 0; j < N; j++) lambda += z[j] * z[j];
    lambda = Math.sqrt(lambda);
    let rq = 0;
    for (let i = 0; i < N; i++) rq += y[i] * y[i];

    if (lambda === 0) {
      residual = 0;
      return { norm: Math.sqrt(rq), iterCount: iter + 1, converged: true, residual };
    }
    for (let j = 0; j < N; j++) x[j] = z[j] / lambda;
    residual = Math.abs(rq - lambdaPrev) / Math.max(rq, 1e-300);
    if (iter > 5 && residual < tol) {
      return { norm: Math.sqrt(rq), iterCount: iter + 1, converged: true, residual };
    }
    lambdaPrev = rq;
  }
  const y = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    let s = 0;
    for (let j = i + 1; j < N; j++) s += V[i][j] * x[j];
    y[i] = s;
  }
  let rq = 0;
  for (let i = 0; i < N; i++) rq += y[i] * y[i];
  return { norm: Math.sqrt(rq), iterCount: iter, converged: false, residual };
}

function buildV(a, U, N) {
  const h = U / N;
  const t = new Float64Array(N);
  const phiT = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    t[i] = (i + 0.5) * h;
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

// Dense crossover grid (step 2.5 through the HS threshold a ~ 37.66).
const A_GRID = [10, 12.5, 15, 17.5, 20, 22.5, 25, 27.5, 30, 32.5, 35, 37.5, 40, 42.5, 45, 47.5, 50];
const U = 4.0;
const N_CAP = 5000;
function adaptiveN(a) {
  return Math.min(N_CAP, Math.max(2000, Math.round(a * U * 20)));
}

// Seed LCG for reproducibility (same seed as imp-1316).
let _seed = 0x12345678;
Math.random = function () {
  _seed = (_seed * 1103515245 + 12345) & 0x7fffffff;
  return _seed / 0x7fffffff;
};

const rows = [];
console.error(`# imp-2401 Volterra crossover sweep — ${A_GRID.length} a-values, U=${U}`);
const startAll = performance.now();

for (const a of A_GRID) {
  const N = adaptiveN(a);
  const t0 = performance.now();
  const V = buildV(a, U, N);
  const { norm, iterCount, converged, residual } = operator2Norm(V, N);
  const dt = performance.now() - t0;
  const exceedsOne = norm > 1;
  rows.push({ a, U, N, maxSinhArg: a * U, norm, iterCount, converged, residual, exceedsOne });
  console.error(
    `  a=${a.toString().padStart(5)}  N=${N.toString().padStart(5)}` +
    `  ||V||=${norm.toExponential(6)}  iter=${iterCount.toString().padStart(4)}` +
    `  conv=${converged}  exc1=${exceedsOne}  (${dt.toFixed(0)} ms)`
  );
}

const totalMs = performance.now() - startAll;

// Locate the Galerkin crossing a* by log-linear interpolation between the last
// row with norm <= 1 and the first row with norm > 1.
let crossingA = null;
for (let i = 1; i < rows.length; i++) {
  if (rows[i - 1].norm <= 1 && rows[i].norm > 1) {
    const a0 = rows[i - 1].a;
    const a1 = rows[i].a;
    const l0 = Math.log(rows[i - 1].norm);
    const l1 = Math.log(rows[i].norm);
    crossingA = a0 + (a1 - a0) * (0 - l0) / (l1 - l0); // solve log(norm)=0
    break;
  }
}

const HS_THRESHOLD = 37.66; // imp-1267 HS bound proves ||V|| <= 1 for a <= this
const allConverged = rows.every((r) => r.converged);
const firstExceedRow = rows.find((r) => r.exceedsOne) || null;

const output = {
  generatedAt: new Date().toISOString(),
  meta: {
    N_phi_truncation: N_PHI,
    a_grid: A_GRID,
    U,
    N_formula: 'min(5000, max(2000, round(a*U*20)))',
    powerIterTol: 1e-10,
    powerIterMaxIter: 5000,
    seed: '0x12345678 (LCG, same as imp-1316)',
    totalMs,
  },
  rows,
  crossingAnalysis: {
    crossingA_galerkin: crossingA,
    hsThreshold: HS_THRESHOLD,
    galerkinCrossingAboveHsThreshold: crossingA !== null ? crossingA >= HS_THRESHOLD : null,
    firstExceedanceA: firstExceedRow ? firstExceedRow.a : null,
    note:
      'Galerkin norm is a LOWER bound on the true L^2 norm, so the located ' +
      'crossing a* is an UPPER bound on the true crossing. The true ||V|| hits ' +
      '1 at some a <= a*. Consistency with HS bound requires a* >= 37.66.',
  },
  summary: {
    nRows: rows.length,
    nExceedsOne: rows.filter((r) => r.exceedsOne).length,
    nConverged: rows.filter((r) => r.converged).length,
    allConverged,
  },
};

console.log(JSON.stringify(output, null, 2));
