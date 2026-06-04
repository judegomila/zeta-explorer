#!/usr/bin/env node
// imp-2451: Scale-normalized de Bruijn-Newman deformation.
//
// QUESTION (ticket imp-2451, sub-gap B of imp-2435)
// -------------------------------------------------
// imp-2435 swept the dBN deformation Phi_t(u) = exp(t u^2) Phi(u) and found
// ||V_{a,Phi_t}|| MONOTONE INCREASING in t -- the norm tracked the kernel L^2
// scale exp(t u^2), NOT zero location, and the rigorously RH-violating side
// (t<0) was not separated. That confounds two effects: the global L^2 scale of
// Phi_t and the SHAPE change that carries the zero-location content.
//
// Since V[i,j] = h Phi(t_i) Phi(t_j) sinh(a(t_j-t_i)) is exactly quadratic in
// Phi, rescaling Phi -> c*Phi scales the whole operator by c^2 and the norm by
// c^2. So normalizing ||Phi_t||_2 = const BEFORE assembling V divides the L^2
// scale out exactly, leaving only the shape (zero-location) signal. We re-run
// the imp-2435 sweep with that single change and ask: once the scale is gone,
// does ANY residual signal separate the RH-violating (t<0) side from t>=0?
//
// Output: JSON to stdout with rows {t, a, norm, exceedsOne, rhViolating}.

import { performance } from 'node:perf_hooks';

const N_PHI = 10;
function PhiBase(u) {
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

// t-deformed kernel Phi_t(u) = exp(t u^2) Phi(u), BEFORE scale normalization.
function PhiT(u, t) {
  return Math.exp(t * u * u) * PhiBase(u);
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
  for (let iter = 0; iter < maxIter; iter++) {
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
    if (lambda === 0) break;
    for (let j = 0; j < N; j++) x[j] = z[j] / lambda;
    if (iter > 5 && Math.abs(rq - lambdaPrev) / Math.max(rq, 1e-300) < tol) {
      return Math.sqrt(rq);
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
  return Math.sqrt(rq);
}

// Build V from the SCALE-NORMALIZED kernel. We renormalize the discrete L^2
// norm of Phi_t to TARGET_L2 before assembling, so the exp(t u^2) global scale
// is divided out and only the kernel SHAPE survives into the operator.
const TARGET_L2 = 1;
function buildV(a, U, N, t) {
  const h = U / N;
  const tt = new Float64Array(N);
  const phiT = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    tt[i] = (i + 0.5) * h;
    phiT[i] = PhiT(tt[i], t);
  }
  // Discrete L^2 norm on the half-line mesh: ||Phi_t||_2^2 = sum_i h phiT[i]^2.
  let l2sq = 0;
  for (let i = 0; i < N; i++) l2sq += h * phiT[i] * phiT[i];
  const l2 = Math.sqrt(l2sq);
  const scale = l2 > 0 ? TARGET_L2 / l2 : 1;
  for (let i = 0; i < N; i++) phiT[i] *= scale;

  const V = new Array(N);
  for (let i = 0; i < N; i++) {
    const row = new Float64Array(N);
    for (let j = i + 1; j < N; j++) {
      const dt = tt[j] - tt[i];
      row[j] = h * phiT[i] * phiT[j] * Math.sinh(a * dt);
    }
    V[i] = row;
  }
  return V;
}

// Sweep. t<0 = rigorously RH-violating; t>=0 spans the RH-true side.
const T_GRID = [-0.5, -0.3, -0.1, 0, 0.1, 0.3, 0.5];
const A_GRID = [0.5, 0.1];
const U = 10;
const N_DISC = 1100; // N = 100*U + 100, matching imp-1248 adaptive mesh.

let _seed = 0x12345678;
Math.random = function () {
  _seed = (_seed * 1103515245 + 12345) & 0x7fffffff;
  return _seed / 0x7fffffff;
};

const rows = [];
console.error(`# imp-2451 scale-normalized dBN sweep - U=${U}, N=${N_DISC}, |Phi_t|_2=${TARGET_L2}, ${T_GRID.length}x${A_GRID.length}`);
const startAll = performance.now();
for (const t of T_GRID) {
  for (const a of A_GRID) {
    const t0 = performance.now();
    const V = buildV(a, U, N_DISC, t);
    const norm = operator2Norm(V, N_DISC);
    const dt = performance.now() - t0;
    const exceedsOne = norm > 1;
    const rhViolating = t < 0;
    rows.push({ t, a, norm, exceedsOne, rhViolating });
    console.error(`  t=${t.toFixed(2).padStart(5)} a=${a.toFixed(2)}  ||V||=${norm.toExponential(6)}  exceedsOne=${exceedsOne}  rhViolating=${rhViolating}  (${dt.toFixed(0)} ms)`);
  }
}
const totalMs = performance.now() - startAll;

// Verdict logic. After the L^2 scale is divided out, does a residual signal
// separate the RH-violating (t<0) side from the RH-true (t>=0) side?
const byA = {};
for (const r of rows) {
  (byA[r.a] ||= []).push({ t: r.t, norm: r.norm });
}
// Per-a relative spread of the normalized norm across the whole t-sweep.
let maxRelSpread = 0;
const monotoneIncreasingInT = Object.values(byA).every((arr) => {
  const s = [...arr].sort((x, y) => x.t - y.t);
  const lo = Math.min(...s.map((r) => r.norm));
  const hi = Math.max(...s.map((r) => r.norm));
  maxRelSpread = Math.max(maxRelSpread, (hi - lo) / Math.max(hi, 1e-300));
  for (let i = 1; i < s.length; i++) if (s[i].norm < s[i - 1].norm) return false;
  return true;
});
// Does the t<0 mean separate from the t>=0 mean (per a), relative to scale?
let maxSideSeparation = 0;
for (const arr of Object.values(byA)) {
  const viol = arr.filter((r) => r.t < 0).map((r) => r.norm);
  const tru = arr.filter((r) => r.t >= 0).map((r) => r.norm);
  const mv = viol.reduce((s, v) => s + v, 0) / viol.length;
  const mt = tru.reduce((s, v) => s + v, 0) / tru.length;
  maxSideSeparation = Math.max(maxSideSeparation, Math.abs(mv - mt) / Math.max(mt, 1e-300));
}

const anyExceeds = rows.some((r) => r.exceedsOne);
let verdict;
if (maxSideSeparation < 0.01) {
  verdict = 'confirmed-null-no-residual-zero-location-signal';
} else if (rows.filter((r) => r.rhViolating).some((r) => r.exceedsOne) &&
           !rows.filter((r) => !r.rhViolating).some((r) => r.exceedsOne)) {
  verdict = 'residual-signal-flags-rh-violation';
} else {
  verdict = 'residual-signal-present-but-not-a-clean-detector';
}

const allNorms = rows.map((r) => r.norm);
const output = {
  generatedAt: new Date().toISOString(),
  meta: {
    U, N_discretization: N_DISC, N_phi_truncation: N_PHI,
    t_grid: T_GRID, a_grid: A_GRID, targetL2: TARGET_L2, powerIterTol: 1e-10, totalMs,
  },
  rows,
  summary: {
    nRows: rows.length,
    nExceedsOne: rows.filter((r) => r.exceedsOne).length,
    minNorm: Math.min(...allNorms),
    maxNorm: Math.max(...allNorms),
    anyExceeds,
    monotoneIncreasingInT,
    maxRelSpread,
    maxSideSeparation,
    verdict,
  },
};
console.log(JSON.stringify(output, null, 2));
