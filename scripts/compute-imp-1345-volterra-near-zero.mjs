#!/usr/bin/env node
// imp-1345: Volterra-Hankel operator-norm near-zero a sweep.
// Extends imp-1262 down to very small a: a in {1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6}.
//
// METHODOLOGY: VERBATIM from imp-1262 / imp-1248.
//   V_{a,Phi,U,N}[i, j] = h * Phi(t_i) * Phi(t_j) * sinh(a*(t_j - t_i))  for j > i
//                       0                                                  otherwise
//
// Discretization:
//   h = U / N,  N = max(2000, 100*U + 100)  (floor at 2000 for small-U accuracy)
//
// Sweep (18 rows):
//   U in {1, 5, 50}    (three anchor points across the imp-1262 range)
//   a in {1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6}
//
// Goal: map ||V_{a,Phi}|| behaviour as a -> 0 far below the imp-1262 floor of 0.001.
//
// HONEST SCOPE: same caveats as imp-1262.
//   - Phi truncated at n=10; tail magnitude << 1e-30 for u > 0.
//   - Power iteration tol 1e-10; LCG seeded for reproducibility (same seed as imp-1262/imp-1248).
//   - Truncated matrix norms are LOWER bounds on the L^2([0, U]) operator norm.
//   - At small a, sinh(a*dt) ≈ a*dt to extremely high precision; the matrix is
//     essentially (const * a) * (outer-product-like structure). Norms should scale
//     linearly in a as a -> 0, verifiable empirically.

import { performance } from 'node:perf_hooks';

// ── de Bruijn-Newman Phi kernel (VERBATIM from imp-1262/imp-1248) ────────────
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

// ── Power iteration (VERBATIM from imp-1262/imp-1248) ───────────────────────
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
  let residual = Infinity;
  let iter;
  for (iter = 0; iter < maxIter; iter++) {
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
  // Final Rayleigh quotient.
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

// ── Build V_{a,Phi,U,N} (VERBATIM from imp-1262/imp-1248) ───────────────────
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

// ── imp-1345 Sweep grid ──────────────────────────────────────────────────────
const U_GRID = [1, 5, 50];
const A_GRID = [1e-1, 1e-2, 1e-3, 1e-4, 1e-5, 1e-6];
function extendedN(U) {
  return Math.max(2000, 100 * U + 100);
}

// Seed LCG for reproducible power-iteration starts (same seed as imp-1262/imp-1248).
let _seed = 0x12345678;
Math.random = function () {
  _seed = (_seed * 1103515245 + 12345) & 0x7fffffff;
  return _seed / 0x7fffffff;
};

const rows = [];
console.error(`# imp-1345 Volterra near-zero a sweep — N = max(2000, 100*U + 100), ${U_GRID.length}x${A_GRID.length} sweep`);
const startAll = performance.now();
for (const U of U_GRID) {
  const N = extendedN(U);
  for (const a of A_GRID) {
    const t0 = performance.now();
    const V = buildV(a, U, N);
    const { norm, iterCount, converged, residual } = operator2Norm(V, N);
    const dt = performance.now() - t0;
    const exceedsOne = norm > 1;
    rows.push({ U, a, N, norm, iterCount, converged, residual, exceedsOne });
    console.error(`  U=${U.toString().padStart(3)} N=${N.toString().padStart(5)} a=${a.toExponential(0)}  ||V||=${norm.toExponential(6)}  iter=${iterCount.toString().padStart(4)}  conv=${converged}  res=${residual.toExponential(2)}  exceedsOne=${exceedsOne}  (${dt.toFixed(0)} ms)`);
  }
}
const totalMs = performance.now() - startAll;

// ── a-linearity verification ─────────────────────────────────────────────────
// For small a, sinh(a*dt) ~ a*dt. So norm(a) / a should be nearly constant.
const aLinearityByU = {};
for (const U of U_GRID) {
  const slice = rows.filter((r) => r.U === U).sort((x, y) => x.a - y.a);
  const ratios = slice.map((s) => ({ a: s.a, normOverA: s.norm / s.a }));
  const r0 = ratios[0].normOverA; // smallest a
  const maxDeviation = Math.max(...ratios.map((r) => Math.abs(r.normOverA - r0) / r0));
  aLinearityByU[U] = { ratios, maxDeviation };
}

// ── U-monotonicity at fixed a ────────────────────────────────────────────────
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

// ── Cross-check with imp-1262 at shared grid points ──────────────────────────
// imp-1262 had a in {0.001, 0.005, 0.01, 0.05, 0.2} and U in {1, 5, 25, 50, 100}.
// imp-1345 shares a=0.1 and a=0.01 and a=0.001 with U in {1, 5, 50}.
// imp-1262 frozen values at (U=1, a=0.001), (U=5, a=0.001), (U=50, a=0.001):
const IMP1262_FROZEN = {
  '1|0.001': 3.723767817694913e-7,
  '5|0.001': 3.722869198637819e-7,
  '50|0.001': 3.7094807070809314e-7,
  '1|0.01': 0.000003723768474859661,
  '5|0.01': 0.00000372286985555564,
  '50|0.01': 0.000003709481360302834,
};

const crossCheck1262 = [];
for (const [key, oldNorm] of Object.entries(IMP1262_FROZEN)) {
  const [Us, as] = key.split('|');
  const fresh = rows.find((r) => r.U === Number(Us) && Math.abs(r.a - Number(as)) < 1e-15);
  if (fresh) {
    crossCheck1262.push({
      U: Number(Us), a: Number(as),
      imp1262_norm: oldNorm,
      imp1345_N: fresh.N,
      imp1345_norm: fresh.norm,
      ratio_1345_over_1262: fresh.norm / oldNorm,
    });
  }
}

// ── Verdicts ─────────────────────────────────────────────────────────────────
const allBelowOne = rows.every((r) => !r.exceedsOne);
const allBelowOneHundredth = rows.every((r) => r.norm <= 0.01);
const allBelowOneThousandth = rows.every((r) => r.norm <= 0.001);
const allConverged = rows.every((r) => r.converged);
let verdict;
if (allBelowOne && allConverged) verdict = 'norms-all-below-one-near-zero-a';
else if (allBelowOne) verdict = 'norms-all-below-one-but-some-not-converged';
else verdict = 'some-norms-exceed-one';

const allNorms = rows.map((r) => r.norm);
const minNorm = Math.min(...allNorms);
const maxNorm = Math.max(...allNorms);
const meanNorm = allNorms.reduce((s, v) => s + v, 0) / allNorms.length;

const output = {
  generatedAt: new Date().toISOString(),
  meta: {
    N_phi_truncation: N_PHI,
    U_grid: U_GRID,
    a_grid: A_GRID,
    N_formula: 'N = max(2000, 100*U + 100)',
    powerIterTol: 1e-10,
    powerIterMaxIter: 5000,
    seed: '0x12345678 (LCG, same as imp-1262/imp-1248)',
    kernelConstructionSource: 'VERBATIM from scripts/compute-imp1262-volterra-extended-sweep.mjs',
    totalMs,
  },
  rows,
  monotonicityByA,
  aLinearityByU,
  crossCheck1262,
  summary: {
    nRows: rows.length,
    nExceedsOne: rows.filter((r) => r.exceedsOne).length,
    nDiverged: rows.filter((r) => !r.converged).length,
    minNorm,
    maxNorm,
    meanNorm,
    allBelowOne,
    allBelowOneHundredth,
    allBelowOneThousandth,
    allConverged,
    verdict,
  },
};

console.log(JSON.stringify(output, null, 2));
