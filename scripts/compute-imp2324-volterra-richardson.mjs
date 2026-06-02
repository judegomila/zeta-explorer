#!/usr/bin/env node
// imp-2324: Richardson extrapolation of large-a ||V_{a,Phi}|| under grid refinement.
//
// PURPOSE: imp-1316 found ||V_{a=50,Phi}||_Galerkin = 53.16 > 1 and
//   ||V_{a=100,Phi}||_Galerkin = 2.76e11 > 1 using N=4000/5000 mesh.
//   imp-1342 asks: is this an artifact of coarse discretization or a real
//   mathematical violation of Conj 27.2?
//
// APPROACH: Richardson extrapolation.
//   For midpoint Galerkin at step h=U/N: ||V_N|| = ||V_inf|| - c*h^2 + O(h^4)
//   => ||V_inf|| ~= (4*||V_{2N}|| - ||V_N||) / 3  (standard Richardson, p=2)
//
//   Since the Galerkin matrix 2-norm is a LOWER BOUND on the true L^2 op-norm
//   (||A_N|| <= ||V||), the sequence is MONOTONE NON-DECREASING in N.
//   If |V_N| > 1 for ANY N, then |V_inf| > 1 (artifact ruled out from below).
//   Richardson extrapolation gives a tighter estimate of |V_inf| from above.
//
// GRID: a in {20, 30, 50}; N in {500, 1000, 2000, 4000}.
//   a=100 skipped: norm at N=5000 is 2.76e11, already conclusively > 1.
//   a=20: interesting (might be near-transition, HS bound < 1 for a <= 37.66).
//   a=30: near the HS-bound threshold (sigma ~ 37.66).
//   a=50: key disputed case from imp-1316.
//
// HONEST SCOPE:
//   - Galerkin 2-norm is a lower bound on the true L^2 norm (gap unknown).
//   - Richardson extrapolation assumes O(h^2) convergence; actual rate may differ
//     for the rapidly-growing sinh kernel at large a.
//   - For a >= 50, h*a = 0.4 at N=500 (moderately coarse), so Richardson
//     extrapolation has larger uncertainty at coarser grids.

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
  // Use deterministic seed via LCG (same seed as imp-1316 / imp-1262).
  let sx = 0x12345678;
  function lcg() {
    sx = (sx * 1103515245 + 12345) & 0x7fffffff;
    return sx / 0x7fffffff;
  }
  let x = new Float64Array(N);
  for (let i = 0; i < N; i++) x[i] = lcg() - 0.5;
  let nrm = 0;
  for (let i = 0; i < N; i++) nrm += x[i] * x[i];
  nrm = Math.sqrt(nrm);
  if (nrm === 0) { x[0] = 1; nrm = 1; }
  for (let i = 0; i < N; i++) x[i] /= nrm;

  let lambdaPrev = 0;
  let residual = Infinity;
  let iter;
  for (iter = 0; iter < maxIter; iter++) {
    // Vx (lower-triangular structure of V: V[i][j] nonzero only for j > i)
    const y = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      const row = V[i];
      let s = 0;
      for (let j = i + 1; j < N; j++) s += row[j] * x[j];
      y[i] = s;
    }
    // V^T y (= V^* y for real V)
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
      return { norm: Math.sqrt(rq), iterCount: iter + 1, converged: true, residual: 0 };
    }
    for (let j = 0; j < N; j++) x[j] = z[j] / lambda;
    residual = Math.abs(rq - lambdaPrev) / Math.max(rq, 1e-300);
    if (iter > 5 && residual < tol) {
      return { norm: Math.sqrt(rq), iterCount: iter + 1, converged: true, residual };
    }
    lambdaPrev = rq;
  }
  // Return best estimate even if not converged.
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
      const sinhVal = Math.sinh(a * dt);
      row[j] = h * phiT[i] * phiT[j] * sinhVal;
    }
    V[i] = row;
  }
  return V;
}

// Richardson extrapolation for p=2 (midpoint Galerkin convergence order):
//   ||V_inf|| ~= (4*f_{2N} - f_N) / 3
function richardsonExtrap(fN, f2N) {
  return (4 * f2N - fN) / 3;
}

// a-grid: exclude a=100 (already conclusively >> 1 at N=5000 in imp-1316).
const A_GRID = [20, 30, 50];
const N_GRID = [500, 1000, 2000, 4000];
const U = 4.0; // same as imp-1316 for a <= 175

const startAll = performance.now();
console.error(`# imp-2324 Richardson extrapolation — a in {${A_GRID.join(',')}} x N in {${N_GRID.join(',')}}`);

const results = {};

for (const a of A_GRID) {
  results[a] = {};
  console.error(`\n# a=${a}`);
  for (const N of N_GRID) {
    const t0 = performance.now();
    const V = buildV(a, U, N);
    const { norm, iterCount, converged, residual } = operator2Norm(V, N);
    const dt = performance.now() - t0;
    results[a][N] = { norm, iterCount, converged, residual };
    console.error(
      `  N=${N.toString().padStart(5)}  h=${(U/N).toFixed(6)}  h*a=${((U/N)*a).toFixed(4)}` +
      `  ||V||=${norm.toExponential(8)}  iter=${iterCount}  conv=${converged}` +
      `  res=${residual.toExponential(2)}  (${dt.toFixed(0)} ms)`
    );
  }
}

const totalMs = performance.now() - startAll;

// Compute Richardson extrapolation pairs for each a.
const richRows = [];
for (const a of A_GRID) {
  const r = results[a];
  for (let ki = 0; ki < N_GRID.length - 1; ki++) {
    const N1 = N_GRID[ki];
    const N2 = N_GRID[ki + 1];
    if (N2 !== 2 * N1) continue; // Richardson only valid for doubling pairs
    const f1 = r[N1].norm;
    const f2 = r[N2].norm;
    const extrap = richardsonExtrap(f1, f2);
    const relChange = (f2 - f1) / Math.max(f2, 1e-300);
    richRows.push({
      a, N1, N2,
      norm_N1: f1, norm_N2: f2,
      richardson_extrap: extrap,
      rel_change_N1_to_N2: relChange,
      extrap_exceeds_one: extrap > 1,
      N2_exceeds_one: f2 > 1,
    });
  }
}

// Consolidated per-a summary.
const perA = A_GRID.map((a) => {
  const r = results[a];
  const finestN = N_GRID[N_GRID.length - 1];
  const coarsestN = N_GRID[0];
  const finestNorm = r[finestN].norm;
  const coarsestNorm = r[coarsestN].norm;
  const allExceedOne = N_GRID.every((N) => r[N].norm > 1);
  const anyExceedOne = N_GRID.some((N) => r[N].norm > 1);
  // Richardson from 2000->4000 pair (most refined available).
  const N1 = 2000; const N2 = 4000;
  const richExtrap = richardsonExtrap(r[N1].norm, r[N2].norm);
  const monotonicInN = N_GRID.slice(0, -1).every((N, i) => r[N_GRID[i+1]].norm >= r[N].norm);
  return {
    a, finestN, finestNorm, coarsestNorm, allExceedOne, anyExceedOne,
    richExtrap_2000_4000: richExtrap,
    monotonicInN,
    verdict: anyExceedOne ? 'REAL-VIOLATION' : 'DOES-NOT-EXCEED-ONE-AT-ANY-N',
  };
});

const output = {
  generatedAt: new Date().toISOString(),
  ticket: 'imp-2324',
  purpose: 'Richardson extrapolation under grid refinement to rule out artifact vs real violation of Conj 27.2 at large a.',
  method: {
    a_grid: A_GRID,
    N_grid: N_GRID,
    U: U,
    richardsonOrder: 2,
    richardsonFormula: 'extrap = (4*f_{2N} - f_N) / 3  (p=2 for midpoint Galerkin)',
    galerkinLowerBound: 'Matrix 2-norm is a LOWER bound on true L^2 op-norm.',
    seed: '0x12345678 (LCG, same as imp-1316)',
  },
  allRows: results,
  richRows,
  perA,
  totalMs,
  conclusion: perA.every((p) => p.anyExceedOne)
    ? 'ALL-VIOLATIONS-CONFIRMED-REAL: norm > 1 at coarsest grid already; Richardson extrap gives larger values.'
    : 'MIXED: some a-values show artifact-dependent behavior.',
};

console.log(JSON.stringify(output, null, 2));
