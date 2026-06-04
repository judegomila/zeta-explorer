#!/usr/bin/env node
// imp-2435: Beurling / RH-violation stress test of the Volterra contraction.
//
// QUESTION (ticket imp-2435)
// --------------------------
// The §27 framework claims ||V_{a,Phi}|| <= 1 is RH-equivalent for the
// completed Riemann kernel Phi. A soundness check: feed the framework a
// system whose zeta-analogue is KNOWN to violate RH. If the contraction
// norm still reports a good bound, the statistic cannot be sufficient; if
// it crosses 1, the statistic sees genuine zero-location content.
//
// WHY NOT A LITERAL BEURLING GENERALIZED-PRIME SYSTEM
// ---------------------------------------------------
// The Volterra operator V_{a,Phi}[i,j] = h Phi(t_i) Phi(t_j) sinh(a(t_j-t_i))
// is built from a SINGLE even, self-dual kernel Phi(u) = Phi(-u): the theta
// transform of the completed xi, whose evenness IS the functional equation
// xi(s) = xi(1-s). A GENERIC Beurling generalized-prime system has an Euler
// product but NO functional equation, hence NO self-dual kernel Phi, so the
// operator V_{a,Phi} cannot even be assembled for it. The framework is thus
// structurally inapplicable to a generic Beurling system. (Named sub-gap:
// constructing a SELF-DUAL Beurling system -- functional equation plus Euler
// product plus a positive generalized-prime measure -- whose zeta has
// off-line zeros remains open; that is the one configuration that would be a
// faithful in-framework counterexample.)
//
// THE COMPUTABLE SURROGATE: de Bruijn-Newman t-deformation
// --------------------------------------------------------
// The de Bruijn-Newman family deforms the SAME self-dual kernel:
//     Phi_t(u) = exp(t u^2) Phi(u),
// whose Fourier transform H_t(z) = int Phi_t(u) cos(z u) du has all-real
// zeros (RH-analogue TRUE) for t >= Lambda, and PROVABLY non-real / off-line
// zeros for t < 0 (de Bruijn 1950; 0 <= Lambda <= 0.2 known). So t < 0 is a
// rigorously RH-VIOLATING regime that still possesses the even self-dual
// kernel the Volterra operator needs. We sweep t through that regime and
// across t = 0 and measure ||V_{a,Phi_t}||.
//
// Output: JSON to stdout with rows {t, a, norm, exceedsOne}.

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

// t-deformed kernel Phi_t(u) = exp(t u^2) Phi(u).
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

function buildV(a, U, N, t) {
  const h = U / N;
  const tt = new Float64Array(N);
  const phiT = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    tt[i] = (i + 0.5) * h;
    phiT[i] = PhiT(tt[i], t);
  }
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
console.error(`# imp-2435 Beurling/dBN stress test - U=${U}, N=${N_DISC}, ${T_GRID.length}x${A_GRID.length} sweep`);
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

// Verdict logic. Does the operator norm FLAG the RH-violating (t<0) regime
// by crossing 1, while staying <= 1 on the RH-true (t>=0) side?
const violRows = rows.filter((r) => r.rhViolating);
const trueRows = rows.filter((r) => !r.rhViolating);
const anyViolExceeds = violRows.some((r) => r.exceedsOne);
const anyTrueExceeds = trueRows.some((r) => r.exceedsOne);
let verdict;
if (anyViolExceeds && !anyTrueExceeds) {
  verdict = 'sound-flags-rh-violation';
} else if (!anyViolExceeds && !anyTrueExceeds) {
  verdict = 'insensitive-norm-stays-below-one-both-sides';
} else {
  verdict = 'mixed-norm-not-a-clean-rh-detector';
}

// Monotonicity diagnostic in t (per a). If the norm tracks kernel L^2 scale
// (exp(t u^2)) rather than zero location, it should INCREASE with t -- i.e.
// be LARGER on the RH-true side, the opposite of a faithful detector.
const byA = {};
for (const r of rows) {
  (byA[r.a] ||= []).push({ t: r.t, norm: r.norm });
}
const monotoneIncreasingInT = Object.values(byA).every((arr) => {
  const s = [...arr].sort((x, y) => x.t - y.t);
  for (let i = 1; i < s.length; i++) if (s[i].norm < s[i - 1].norm) return false;
  return true;
});

const allNorms = rows.map((r) => r.norm);
const output = {
  generatedAt: new Date().toISOString(),
  meta: {
    U, N_discretization: N_DISC, N_phi_truncation: N_PHI,
    t_grid: T_GRID, a_grid: A_GRID, powerIterTol: 1e-10, totalMs,
  },
  rows,
  summary: {
    nRows: rows.length,
    nExceedsOne: rows.filter((r) => r.exceedsOne).length,
    minNorm: Math.min(...allNorms),
    maxNorm: Math.max(...allNorms),
    anyViolExceeds,
    anyTrueExceeds,
    monotoneIncreasingInT,
    verdict,
  },
};
console.log(JSON.stringify(output, null, 2));
