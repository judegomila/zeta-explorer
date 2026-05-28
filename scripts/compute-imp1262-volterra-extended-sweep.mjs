#!/usr/bin/env node
// imp-1262: EXTENDED Volterra-Hankel operator-norm sweep, widening the
// imp-1240 / imp-1248 pilot to small-a (down to 0.001) and large-U (up to 100).
//
//   V_{a,Phi,U,N}[i, j] = h * Phi(t_i) * Phi(t_j) * sinh(a*(t_j - t_i))  for j > i
//                       0                                                otherwise
//
// Discretization:
//   h = U / N,  N = max(2000, 100*U + 100)  (>= 2000 floor at small U for accuracy)
//
// Sweep (25 rows):
//   U in {1, 5, 25, 50, 100}
//   a in {0.001, 0.005, 0.01, 0.05, 0.2}
//
// Goal: probe Conj 27.2 (||V_{a,Phi}|| <= 1) much more aggressively than
// the imp-1240 (a >= 0.025) and imp-1248 (a >= 0.025) sweeps. a = 0.001 is
// 25x smaller than the smallest a used in those pilots.
//
// HONEST SCOPE:
//   - Phi truncated at n=10; tail magnitude << 1e-30 for u > 0 (Cauchy-Schwarz).
//   - Power iteration tol 1e-10; LCG seeded for reproducibility.
//   - Truncated matrix norms are LOWER bounds on the L^2([0, U]) operator
//     norm (Galerkin convergence from below as N -> infty).
//   - U=100 with N=10100 is a 10100x10100 strictly upper-triangular matrix;
//     stored as Float64Array rows; outer power-iter loop O(N^2) per iterate.
//   - This is an EMPIRICAL pilot, not a proof. The discretized matrix norm
//     is a LOWER bound on the true L^2 norm; the empirical claim is one of
//     plausibility, not certainty.
//
// REPRODUCIBILITY: LCG seed 0x12345678 (same as imp-1248). Kernel construction
// is VERBATIM from scripts/compute-imp1248-volterra-rescan.mjs (only the
// grid changed).

import { performance } from 'node:perf_hooks';

// ── de Bruijn-Newman Phi kernel (VERBATIM from imp-1248) ────────────────────
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

// ── Power iteration (VERBATIM from imp-1248) ────────────────────────────────
// Returns { norm, iterCount, converged, residual } where:
//   norm     = ||V||_2 = sqrt(lambda_max(V^T V)) via Rayleigh quotient
//   iterCount = number of power-iteration steps performed
//   converged = true iff stopped via tol criterion (not maxIter exhaustion)
//   residual = final |rq - lambdaPrev| / max(rq, 1e-300) (relative residual)
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

// ── Build V_{a,Phi,U,N} (VERBATIM from imp-1248) ────────────────────────────
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

// ── imp-1262 Sweep grid ─────────────────────────────────────────────────────
const U_GRID = [1, 5, 25, 50, 100];
const A_GRID = [0.001, 0.005, 0.01, 0.05, 0.2];
function extendedN(U) {
  return Math.max(2000, 100 * U + 100);
}

// Seed LCG for reproducible power-iteration starts (same seed as imp-1248).
let _seed = 0x12345678;
Math.random = function () {
  _seed = (_seed * 1103515245 + 12345) & 0x7fffffff;
  return _seed / 0x7fffffff;
};

const rows = [];
console.error(`# imp-1262 Volterra-norm extended sweep — N = max(2000, 100*U + 100), ${U_GRID.length}x${A_GRID.length} sweep`);
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
    console.error(`  U=${U.toString().padStart(3)} N=${N.toString().padStart(5)} a=${a.toFixed(3)}  ||V||=${norm.toExponential(6)}  iter=${iterCount.toString().padStart(4)}  conv=${converged}  res=${residual.toExponential(2)}  exceedsOne=${exceedsOne}  (${dt.toFixed(0)} ms)`);
  }
}
const totalMs = performance.now() - startAll;

// ── U-monotonicity at fixed a (Galerkin lower-bound monotone-increasing
//    expectation; with mesh refinement effect, may be near-flat or slightly
//    decreasing depending on (U, a) regime — same caveat as imp-1248).
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

// ── a-linearity verification ────────────────────────────────────────────────
// sinh(a * dt) ~ a * dt for small a*dt. For fixed U, norm should scale ~linearly
// in a in the small-a regime. Compute ratio norm(a)/a for each a at each U;
// check that the ratios are within a 5x band (loose, because U=100 includes
// a*dt up to 20 where sinh nonlinearity kicks in for the largest a).
const aLinearityByU = {};
for (const U of U_GRID) {
  const slice = rows.filter((r) => r.U === U).sort((x, y) => x.a - y.a);
  const ratios = slice.map((s) => ({ a: s.a, normOverA: s.norm / s.a }));
  const r0 = ratios[0].normOverA; // smallest a, best linear approximation
  const maxDeviation = Math.max(...ratios.map((r) => Math.abs(r.normOverA - r0) / r0));
  aLinearityByU[U] = { ratios, maxDeviation };
}

// ── Cross-checks with imp-1240 (5x5, U <= 20, a >= 0.025, N=200) and
//    imp-1248 (7x5, U <= 100, a >= 0.025, N=100*U+100). Common grid points:
// imp-1262: U in {1,5,25,50,100}, a in {0.001,0.005,0.01,0.05,0.2}
// imp-1240: U in {1,2,5,10,20},   a in {0.5,0.2,0.1,0.05,0.025}
// imp-1248: U in {1,2,5,10,20,50,100}, a in {0.5,0.2,0.1,0.05,0.025}
// Common (U, a) with imp-1240: (1, 0.05), (1, 0.2), (5, 0.05), (5, 0.2)
// Common (U, a) with imp-1248: (1, 0.05), (1, 0.2), (5, 0.05), (5, 0.2),
//                              (50, 0.05), (50, 0.2), (100, 0.05), (100, 0.2)
const IMP1240_FROZEN = {
  '1|0.05': 0.000018600407207054478,
  '1|0.2': 0.00007440659997048165,
  '5|0.05': 0.000018165511587559465,
  '5|0.2': 0.0000726668313474798,
};
const IMP1248_FROZEN = {
  '1|0.05': 0.000018600407207054478,
  '1|0.2': 0.00007440659997048165,
  '5|0.05': 0.000018567286128094315,
  '5|0.2': 0.00007427410180523071,
  '50|0.05': 0.00001854748598024237,
  '50|0.2': 0.0000741948929063658,
  '100|0.05': 0.000018546068261878834,
  '100|0.2': 0.0000741892214372863,
};

const crossCheck1240 = [];
for (const [key, oldNorm] of Object.entries(IMP1240_FROZEN)) {
  const [Us, as] = key.split('|');
  const fresh = rows.find((r) => r.U === Number(Us) && r.a === Number(as));
  if (fresh) {
    crossCheck1240.push({
      U: Number(Us), a: Number(as),
      imp1240_N200_norm: oldNorm,
      imp1262_N: fresh.N,
      imp1262_norm: fresh.norm,
      ratio_1262_over_1240: fresh.norm / oldNorm,
    });
  }
}
const crossCheck1248 = [];
for (const [key, oldNorm] of Object.entries(IMP1248_FROZEN)) {
  const [Us, as] = key.split('|');
  const fresh = rows.find((r) => r.U === Number(Us) && r.a === Number(as));
  if (fresh) {
    crossCheck1248.push({
      U: Number(Us), a: Number(as),
      imp1248_norm: oldNorm,
      imp1262_norm: fresh.norm,
      ratio_1262_over_1248: fresh.norm / oldNorm,
    });
  }
}

// ── Verdicts ────────────────────────────────────────────────────────────────
const allBelowOne = rows.every((r) => !r.exceedsOne);
const allBelowOneHundredth = rows.every((r) => r.norm <= 0.01);
const allBelowOneThousandth = rows.every((r) => r.norm <= 0.001);
const allConverged = rows.every((r) => r.converged);
let verdict;
if (allBelowOne && allConverged) verdict = 'norms-all-below-one-extended-grid';
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
    seed: '0x12345678 (LCG, same as imp-1248)',
    kernelConstructionSource: 'VERBATIM from scripts/compute-imp1248-volterra-rescan.mjs',
    totalMs,
  },
  rows,
  monotonicityByA,
  aLinearityByU,
  crossCheck1240,
  crossCheck1248,
  summary: {
    nRows: rows.length,
    nExceedsOne: rows.filter((r) => r.exceedsOne).length,
    nDiverged: rows.filter((r) => !r.converged).length,
    minNorm,
    maxNorm,
    meanNorm,
    allMonotone,
    allBelowOne,
    allBelowOneHundredth,
    allBelowOneThousandth,
    allConverged,
    verdict,
  },
};

console.log(JSON.stringify(output, null, 2));
