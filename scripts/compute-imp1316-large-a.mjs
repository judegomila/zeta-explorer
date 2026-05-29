#!/usr/bin/env node
// imp-1316: Extend Volterra empirical sweep into the LARGE-a regime.
//
// imp-1262 covered a in {0.001, 0.005, 0.01, 0.05, 0.2}. This script
// pushes to a in {1, 2, 5, 10, 50, 100, 1000} with adaptive U and N.
//
// Adaptive U:
//   U = min(4.0, 700.0 / a)
//   Rationale: Math.sinh(x) overflows to Infinity for x > ~709.78 in IEEE 754.
//   Capping the max sinh argument at 700 ensures finite matrix entries.
//   For a <= 175, U = 4.0 (unchanged from imp-1262 large-U rows).
//   For a = 1000, U = 0.7 (max dt = 0.7, sinh(700) ~ 5e303 < Number.MAX_VALUE).
//
// Phi support: phi(t) underflows to 0.0 in float64 for t > ~1.355, so
//   the U=4.0 truncation introduces no error for a <= 175. For a=1000 with
//   U=0.7 we capture phi's significant support (phi(0.7) ~ 1.3e-20 > 0).
//
// Adaptive N:
//   For accuracy, we want h = U/N small relative to 1/a (the sinh length scale).
//   N = max(5000, round(a * U * 20))
//   This keeps h*a <= U/5000 * a <= 4*a/5000 = a/1250. For a=1000 this gives
//   N=max(5000, 14000)=14000 but that's 14000x14000~196M entries (~1.6 GB). Too large.
//   Hard cap at N=5000 for memory. Coarser mesh is an honest caveat.
//
// HONEST SCOPE:
//   - Matrix 2-norm is a LOWER BOUND on the L^2([0,U]) Galerkin operator norm,
//     which in turn is <= the L^2([0,infty)) operator norm of V_{a,Phi}.
//   - For large a, the coarse mesh (h*a >> 1) means the quadrature misrepresents
//     the rapidly-growing sinh kernel; the computed Galerkin bound is an
//     UNDERESTIMATE of the true L^2 norm in the large-a regime.
//   - For a=1000 specifically the mesh is far too coarse for quantitative
//     accuracy; the result is a qualitative lower-bound indicator only.
//   - Phi truncated at n=10; tail < 1e-30 (same as imp-1262).
//   - Power iteration tol 1e-10, LCG seed 0x12345678.

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
      const sinhVal = Math.sinh(a * dt);
      // sinhVal is finite because a*dt <= a*U <= 700 by construction.
      row[j] = h * phiT[i] * phiT[j] * sinhVal;
    }
    V[i] = row;
  }
  return V;
}

const A_GRID = [1, 2, 5, 10, 50, 100, 1000];
const N_CAP = 5000;

function adaptiveParams(a) {
  const U = Math.min(4.0, 700.0 / a);
  const N = Math.min(N_CAP, Math.max(2000, Math.round(a * U * 20)));
  return { U, N };
}

// Seed LCG for reproducibility (same seed as imp-1262).
let _seed = 0x12345678;
Math.random = function () {
  _seed = (_seed * 1103515245 + 12345) & 0x7fffffff;
  return _seed / 0x7fffffff;
};

const rows = [];
console.error(`# imp-1316 Volterra large-a sweep — ${A_GRID.length} a-values`);
const startAll = performance.now();

for (const a of A_GRID) {
  const { U, N } = adaptiveParams(a);
  const t0 = performance.now();
  const V = buildV(a, U, N);
  const { norm, iterCount, converged, residual } = operator2Norm(V, N);
  const dt = performance.now() - t0;
  const exceedsOne = norm > 1;
  const maxSinhArg = a * U;
  rows.push({ a, U, N, maxSinhArg, norm, iterCount, converged, residual, exceedsOne });
  console.error(
    `  a=${a.toString().padStart(5)}  U=${U.toFixed(4)}  N=${N.toString().padStart(5)}` +
    `  maxSinhArg=${maxSinhArg.toFixed(1)}  ||V||=${norm.toExponential(6)}` +
    `  iter=${iterCount.toString().padStart(4)}  conv=${converged}` +
    `  res=${residual.toExponential(2)}  exc1=${exceedsOne}  (${dt.toFixed(0)} ms)`
  );
}

const totalMs = performance.now() - startAll;

// Cross-check with imp-1262 at shared a-values (none in common — imp-1262 a <= 0.2).
// Instead cross-check WH bound: for each row, WH bound = phi0^2 / a.
const PHI0_SQUARED = 0.44669690046712346 ** 2; // from imp-1266 / imp-1287
const crossCheckWH = rows.map((r) => ({
  a: r.a,
  wh_bound: PHI0_SQUARED / r.a,
  empirical_norm: r.norm,
  norm_over_wh: r.norm / (PHI0_SQUARED / r.a),
  within_wh: r.norm <= PHI0_SQUARED / r.a,
}));

// Cross-check HS linear extrapolation from imp-1262:
// imp-1262 max norm at a=0.2 was 7.45e-5. HS predicts norm ~ a * coeff.
// coeff ~ 7.45e-5 / 0.2 = 3.725e-4. For large a, HS bound sqrt(I0*Ja) grows faster.
const HS_LINEAR_COEF = 3.725e-4; // imp-1262 empirical slope
const crossCheckHS = rows.map((r) => ({
  a: r.a,
  hs_linear_extrap: HS_LINEAR_COEF * r.a,
  empirical_norm: r.norm,
  ratio: r.norm / (HS_LINEAR_COEF * r.a),
}));

const allBelowOne = rows.every((r) => !r.exceedsOne);
const allConverged = rows.every((r) => r.converged);
const allNorms = rows.map((r) => r.norm);
const minNorm = Math.min(...allNorms);
const maxNorm = Math.max(...allNorms);

const output = {
  generatedAt: new Date().toISOString(),
  meta: {
    N_phi_truncation: N_PHI,
    a_grid: A_GRID,
    U_formula: 'min(4.0, 700.0/a)',
    N_formula: 'min(5000, max(2000, round(a*U*20)))',
    maxSinhArgCap: 700,
    powerIterTol: 1e-10,
    powerIterMaxIter: 5000,
    seed: '0x12345678 (LCG, same as imp-1262)',
    totalMs,
    caveats: [
      'For large a, mesh h = U/N >> 1/a, so the quadrature of sinh(a*dt) is coarse.',
      'The Galerkin matrix 2-norm is a lower bound on the L^2 operator norm.',
      'For a=1000, mesh is very coarse (h*a >> 1); result is a qualitative indicator only.',
    ],
  },
  rows,
  crossCheckWH,
  crossCheckHS,
  summary: {
    nRows: rows.length,
    nExceedsOne: rows.filter((r) => r.exceedsOne).length,
    nConverged: rows.filter((r) => r.converged).length,
    nDiverged: rows.filter((r) => !r.converged).length,
    minNorm,
    maxNorm,
    allBelowOne,
    allConverged,
    verdict: allBelowOne && allConverged
      ? 'norms-all-below-one-large-a-grid'
      : allBelowOne
      ? 'norms-all-below-one-but-some-not-converged'
      : 'SOME-NORMS-EXCEED-ONE',
  },
};

console.log(JSON.stringify(output, null, 2));
