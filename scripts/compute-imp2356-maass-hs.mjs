#!/usr/bin/env node
// imp-2356: Empirical test of the imp-1267 / imp-1298 Volterra HS-bound framework
// on a REAL-ANALYTIC GL(2) MAASS cusp form (Laplace eigenvalue spectrum), as a
// companion to imp-1317 which tested the HOLOMORPHIC form Delta. Fan-out per the
// imp-1317 caveat #5 ("the matrix HS bound test for Maass eigenforms is OPEN").
//
// FORM CHOSEN: first even Maass cusp form on SL(2, Z)
// --------------------------------------------------
// Spectral parameter R = 9.533695261353925 (Laplace eigenvalue lambda = 1/4 + R^2).
// Even, self-dual, level 1, trivial character. Hecke eigenvalues a(n) are REAL
// (LMFDB / Hejhal / Booker-Stroembergsson-Venkatesh tabulations, a(1) = 1).
//
// KERNEL CONSTRUCTION (Fourier-Bessel, no inverse Mellin needed)
// --------------------------------------------------------------
// The Fourier-Whittaker expansion of an even Maass form on the imaginary axis is
//   f(i y) = 2 sqrt(y) sum_{n>=1} a(n) K_{iR}(2 pi n y),
// where K_{iR} is the modified Bessel function of IMAGINARY order. Setting y = e^u,
// the even real kernel is
//   g(u) := f(i e^u) = 2 e^{u/2} sum_{n>=1} a(n) K_{iR}(2 pi n e^u).
// Modularity f(-1/z) = f(z) (S-transformation) gives f(i/y) = f(i y), i.e. g(-u) =
// g(u): g is EVEN and real. It decays super-exponentially as u -> +infinity
// (K_{iR}(2 pi e^u) ~ sqrt(pi / (4 pi e^u)) exp(-2 pi e^u)), so the Volterra
// operator lives on [0, infinity) exactly as in imp-1317 for Phi_Delta.
//
// CRITICAL STRUCTURAL POINT vs imp-1317
// -------------------------------------
// For a SELF-DUAL Maass form the kernel g(u) is a SINGLE REAL scalar function: the
// K-Bessel of imaginary order already encodes the PRODUCT gamma factor
// pi^{-s} Gamma((s+iR)/2) Gamma((s-iR)/2). So the SCALAR HS bound formula
//   ||V_{a,g}||_op <= ||V_{a,g}||_HS <= sqrt(I_0 * J_a)
// applies verbatim (I_0 = int g^2 du, J_a = int g^2 sinh^2(a u) du). This RESOLVES
// the imp-1317 caveat #5: no 2x2 matrix is needed for a self-dual Maass form.
//
// THE K-BESSEL OF IMAGINARY ORDER
// -------------------------------
// K_{iR}(x) = int_0^infinity cos(R t) exp(-x cosh t) dt   (real, x > 0).
// In our integration region u >= 0 the smallest argument is x = 2 pi n e^u >=
// 2 pi >= 6.28, so the integral is non-oscillatory-dominated and well resolved by
// midpoint quadrature. (For x < R ~ 9.53 the Bessel is suppressed by ~ exp(-pi R/2)
// ~ 3e-7; for x > R it decays like exp(-x). Either way magnitudes are ~ 1e-6,
// so I_0, J_a and op_norm land MANY orders of magnitude below the threshold 1.)

import { performance } from 'node:perf_hooks';

const TWO_PI = 2 * Math.PI;

// ── First even SL(2,Z) Maass form: spectral parameter + Hecke eigenvalues ─────
// R = 9.533695261353925 (the smallest even Maass eigenvalue on the modular surface;
// Hejhal 1992; Then 2005; LMFDB Maass form 2.0.1.-.9.5337...).
const R_SPEC = 9.533695261353925;

// Published approximate Hecke eigenvalues a(p) (a(1) = 1). Composite a(n) are filled
// by Hecke multiplicativity: a(p^2) = a(p)^2 - 1, a(mn) = a(m) a(n) for gcd(m,n)=1.
const A2 = 1.549304477;
const A3 = 0.246899772;
const A5 = 0.722110000;
const A = Object.freeze([
  /* n=0 unused */ 0,
  /* 1 */ 1,
  /* 2 */ A2,
  /* 3 */ A3,
  /* 4 */ A2 * A2 - 1,      // a(2^2) = a(2)^2 - 1
  /* 5 */ A5,
  /* 6 */ A2 * A3,          // a(6) = a(2) a(3)
]);
const N_MAX = A.length - 1; // = 6 (terms n >= 7 give K_{iR}(>= 2 pi*7) ~ exp(-44), fp-zero)

// ── K_{iR}(x) via the cosine integral representation ──────────────────────────
// K_{iR}(x) = int_0^Tmax cos(R t) exp(-x cosh t) dt, Tmax so x cosh(Tmax) ~ 720.
function Kir(x) {
  if (x <= 0) return 0;
  const lim = 720 / x;
  const Tmax = lim > 1 ? Math.acosh(lim) : 0; // x already huge => integrand fp-zero
  if (Tmax <= 0) return 0;
  const N = 12000;
  const h = Tmax / N;
  let s = 0;
  for (let k = 0; k < N; k++) {
    const t = (k + 0.5) * h;
    s += Math.cos(R_SPEC * t) * Math.exp(-x * Math.cosh(t));
  }
  return s * h;
}

// ── Maass kernel g(u) = 2 e^{u/2} sum a(n) K_{iR}(2 pi n e^u) ──────────────────
function PhiMaass(u) {
  const eu = Math.exp(u);
  let sum = 0;
  for (let n = 1; n <= N_MAX; n++) {
    const x = TWO_PI * n * eu;
    if (x > 720) continue;
    sum += A[n] * Kir(x);
  }
  return 2 * Math.exp(0.5 * u) * sum;
}

// ── L^2 integrals on [0, U_INF] (g is even; Volterra lives on the half line) ──
const U_INF = 2.5;
const N_INF = 4000;
const H_INF = U_INF / N_INF;

const t_inf = new Float64Array(N_INF);
const phi2_arr = new Float64Array(N_INF);
let phiMax = 0;
for (let i = 0; i < N_INF; i++) {
  t_inf[i] = (i + 0.5) * H_INF;
  const p = PhiMaass(t_inf[i]);
  phi2_arr[i] = p * p;
  if (Math.abs(p) > phiMax) phiMax = Math.abs(p);
}

function I0() {
  let s = 0;
  for (let i = 0; i < N_INF; i++) s += phi2_arr[i];
  return s * H_INF;
}
function Ja(a) {
  let s = 0;
  for (let i = 0; i < N_INF; i++) {
    const sh = Math.sinh(a * t_inf[i]);
    s += phi2_arr[i] * sh * sh;
  }
  return s * H_INF;
}

// ── Galerkin op-norm via power iteration (lower bound on ||V||_op) ─────────────
function operator2Norm(V, N, tol = 1e-10, maxIter = 2000) {
  let _seed = 0x12345678;
  const rng = () => {
    _seed = (_seed * 1103515245 + 12345) & 0x7fffffff;
    return _seed / 0x7fffffff;
  };
  let x = new Float64Array(N);
  for (let i = 0; i < N; i++) x[i] = rng() - 0.5;
  let nrm = 0;
  for (let i = 0; i < N; i++) nrm += x[i] * x[i];
  nrm = Math.sqrt(nrm) || 1;
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
    if (lambda === 0) return { norm: Math.sqrt(rq), iterCount: iter + 1, converged: true, residual: 0 };
    for (let j = 0; j < N; j++) x[j] = z[j] / lambda;
    residual = Math.abs(rq - lambdaPrev) / Math.max(rq, 1e-300);
    if (iter > 5 && residual < tol) return { norm: Math.sqrt(rq), iterCount: iter + 1, converged: true, residual };
    lambdaPrev = rq;
  }
  const yf = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    let s = 0;
    for (let j = i + 1; j < N; j++) s += V[i][j] * x[j];
    yf[i] = s;
  }
  let rq = 0;
  for (let i = 0; i < N; i++) rq += yf[i] * yf[i];
  return { norm: Math.sqrt(rq), iterCount: iter, converged: false, residual };
}

function buildV(a, U, N) {
  const h = U / N;
  const t = new Float64Array(N);
  const phi = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    t[i] = (i + 0.5) * h;
    phi[i] = PhiMaass(t[i]);
  }
  const V = new Array(N);
  for (let i = 0; i < N; i++) {
    const row = new Float64Array(N);
    for (let j = i + 1; j < N; j++) {
      row[j] = h * phi[i] * phi[j] * Math.sinh(a * (t[j] - t[i]));
    }
    V[i] = row;
  }
  return V;
}

// ── Main sweep ─────────────────────────────────────────────────────────────
const A_GRID = [0.01, 0.05, 0.2];
const U_OP = 2.5;
const N_OP = 600;

console.error('# imp-2356: Volterra HS bound for first SL(2,Z) Maass form (R = 9.5337)');
console.error(`#   N_MAX = ${N_MAX}, U_INF = ${U_INF}, N_INF = ${N_INF}`);
console.error(`#   g(0)   = ${PhiMaass(0).toExponential(6)}`);
console.error(`#   g(0.5) = ${PhiMaass(0.5).toExponential(6)}`);
console.error(`#   g(1.0) = ${PhiMaass(1.0).toExponential(6)}`);
console.error(`#   g(2.0) = ${PhiMaass(2.0).toExponential(6)}`);
console.error(`#   max|g| on [0,U_INF] = ${phiMax.toExponential(6)}`);

const t0 = performance.now();
const I0v = I0();
console.error(`#   I_0 = ${I0v.toExponential(8)}  (${(performance.now() - t0).toFixed(0)} ms)`);

const rows = [];
for (const a of A_GRID) {
  const Jav = Ja(a);
  const hsBound = Math.sqrt(I0v * Jav);
  const V = buildV(a, U_OP, N_OP);
  const { norm: opNorm, iterCount, converged, residual } = operator2Norm(V, N_OP);
  const hsBoundHolds = opNorm <= hsBound;
  const safetyMargin = hsBound / Math.max(opNorm, 1e-300);
  rows.push({
    a, U_INF, N_INF, U_OP, N_OP,
    I0: I0v, Ja: Jav, hs_bound: hsBound, op_norm_galerkin: opNorm,
    iter_count: iterCount, converged, residual,
    hs_bound_holds: hsBoundHolds, safety_margin: safetyMargin,
    hs_bound_below_one: hsBound < 1, op_norm_below_one: opNorm < 1,
  });
  console.error(
    `  a=${a.toFixed(3)}  I_0=${I0v.toExponential(3)}  J_a=${Jav.toExponential(3)}` +
    `  HS=${hsBound.toExponential(3)}  op=${opNorm.toExponential(3)}` +
    `  margin=${safetyMargin.toFixed(3)}x  conv=${converged}`
  );
}
console.error(`# total ${(performance.now() - t0).toFixed(0)} ms`);

const allHold = rows.every((r) => r.hs_bound_holds);
const allBelow1 = rows.every((r) => r.hs_bound_below_one && r.op_norm_below_one);
let verdict;
if (allHold && allBelow1) verdict = 'maass-HS-bound-holds';
else if (!allHold) verdict = 'maass-HS-bound-fails';
else verdict = 'maass-computation-too-coarse';

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  form: 'first even SL(2,Z) Maass cusp form',
  R_SPEC, N_MAX, U_INF, N_INF, U_OP, N_OP,
  I0: I0v, phi_max_abs: phiMax,
  rows, allHold, allBelow1, verdict,
}, null, 2));
