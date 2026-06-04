#!/usr/bin/env node
// imp-2421: Volterra contraction-margin sweep on RANKIN-SELBERG convolution
// L-functions L(s, f x g) for low-level holomorphic cusp forms f, g on SL(2,Z).
//
// PURPOSE
// -------
// imp-1267 established the scalar HS bound ||V_{a,Phi}||_op <= sqrt(I_0 * J_a)
// for the Riemann xi kernel (GL(1), margin 1.58x-2.57x). imp-1317 / imp-2402
// confirmed it on GL(2) holomorphic cusp forms (Delta wt 12, F16 wt 16), and
// imp-2357 swept the Dedekind zeta of imaginary quadratic fields (degree-2,
// single complex gamma factor). This script extends the EMPIRICAL margin sweep
// to RANKIN-SELBERG convolutions L(s, f x g) -- the first DEGREE-4 testbed,
// whose archimedean factor is a PRODUCT of TWO complex gamma factors. The
// question: does the Cauchy-Schwarz slack margin = HS_bound/op_norm stay sub-2
// in the degree-4 / two-gamma regime?
//
// THE KEY POINT: PRODUCT-GAMMA REDUCES TO A SCALAR K-BESSEL KERNEL
// ---------------------------------------------------------------
// For f, g holomorphic Hecke newforms of weights k1 >= k2 on SL(2,Z) (level 1,
// conductor of f x g is 1), the completed Rankin-Selberg L-function in ANALYTIC
// normalization (functional equation s -> 1-s, central point c = 1/2) is
//
//   Lambda(s, f x g) = gamma(s) L(s, f x g),
//   gamma(s) = Gamma_C(s + (k1+k2)/2 - 1) * Gamma_C(s + (k1-k2)/2),
//   Gamma_C(s) = 2 (2*pi)^{-s} Gamma(s),
//
// i.e. mu1 = (k1+k2)/2 - 1, mu2 = (k1-k2)/2, so the two Bessel parameters are
//   nu = mu1 - mu2 = k2 - 1,    m = (mu1 + mu2)/2 = (k1 - 1)/2.
// The inverse-Mellin transform of a PRODUCT of two gamma factors is, by the
// Mellin-Barnes identity
//   (1/2*pi*i) int Gamma(s+a)Gamma(s+b) x^{-s} ds = 2 x^{(a+b)/2} K_{a-b}(2*sqrt(x)),
// a SINGLE SCALAR function (a modified Bessel K of the second kind), NOT a
// matrix kernel. Dropping the scale-invariant prefactor,
//   G(y) = y^{m} K_{nu}(4*pi*sqrt(y)),   m = (k1-1)/2,  nu = k2-1.
// So the product-gamma case settles (one direction of) the matrix-gamma sub-gap
// named by imp-2357: it is genuinely scalar.
//
// KERNEL CONSTRUCTION
// -------------------
// L(s, f x g) = sum_{n>=1} b(n) n^{-s}. In analytic normalization the
// Rankin-Selberg Dirichlet coefficients come from the unfolded inner product
//   sum_n lambda_f(n) lambda_g(n) n^{-s} = L(s, f x g) / zeta(2s),
// where lambda_f(n) = a_f(n) / n^{(k_f-1)/2} are the analytically-normalized
// Hecke eigenvalues (|lambda_f(p)| <= 2 by Deligne). Hence
//   b(n) = sum_{d^2 | n} lambda_f(n/d^2) lambda_g(n/d^2).
// The theta-like inverse Mellin is Phi_0(w) = sum_n b(n) G(n w), and centering
// at s = 1/2 + it (w = e^u) gives the Fourier kernel
//   Phi(u) = e^{u/2} * sum_{n>=1} b(n) (n e^u)^{m} K_{nu}(4*pi*sqrt(n e^u)).
// The functional equation Lambda(s) = Lambda(1-s) makes Phi(-u) = Phi(u), so we
// work on [0, inf) as in imp-2357.
//
// EXACT q-EXPANSIONS (no external data, no fabricated eigenvalues)
// ---------------------------------------------------------------
// All Hecke eigenvalues are computed EXACTLY in-script from integer q-expansions
// of the unique level-1 normalized newforms (the relevant cusp-form spaces are
// 1-dimensional):
//   Delta (wt 12) = q * prod (1-q^n)^24       [a(1)=1, a(2) = tau(2) = -24]
//   F16   (wt 16) = E4 * Delta                [a(1)=1, a(2) = 216]
//   F18   (wt 18) = E6 * Delta                [a(1)=1, a(2) = -528]
//   F20   (wt 20) = E8 * Delta                [a(1)=1, a(2) = 456]
// with E4 = 1 + 240 sum sigma_3, E6 = 1 - 504 sum sigma_5, E8 = 1 + 480 sum sigma_7.
//
// THE HS BOUND (same inequality as imp-1267 / imp-1317 / imp-2357)
// ----------------------------------------------------------------
//   V_{a,Phi} f(x) = int_0^x Phi(x) Phi(y) sinh(a(x-y)) f(y) dy,
//   ||V||_op <= ||V||_HS <= sqrt(I_0 * J_a),
//   I_0 = int_0^inf Phi(u)^2 du,  J_a = int_0^inf Phi(u)^2 sinh^2(a u) du.

import { performance } from 'node:perf_hooks';

const TWO_PI = 2 * Math.PI;
const FOUR_PI = 4 * Math.PI;

// ── exact integer q-expansions ──────────────────────────────────────────────
function polymul(A, B, N) {
  const C = new Array(N + 1).fill(0);
  for (let i = 0; i <= N; i++) {
    if (A[i] === 0) continue;
    for (let j = 0; j <= N - i; j++) {
      if (B[j] === 0) continue;
      C[i + j] += A[i] * B[j];
    }
  }
  return C;
}

// Delta = q * prod_{n>=1} (1 - q^n)^24
function deltaCoeffs(N) {
  // euler = prod_{n=1..N} (1 - q^n)
  let euler = new Array(N + 1).fill(0);
  euler[0] = 1;
  for (let n = 1; n <= N; n++) {
    const factor = new Array(N + 1).fill(0);
    factor[0] = 1;
    if (n <= N) factor[n] = -1;
    euler = polymul(euler, factor, N);
  }
  // euler^24
  let pw = new Array(N + 1).fill(0);
  pw[0] = 1;
  for (let k = 0; k < 24; k++) pw = polymul(pw, euler, N);
  // Delta[n] = coefficient of q^n = pw[n-1]
  const d = new Array(N + 1).fill(0);
  for (let n = 1; n <= N; n++) d[n] = pw[n - 1];
  return d; // d[1] = 1
}

function sigma(k, n) {
  let s = 0;
  for (let d = 1; d <= n; d++) if (n % d === 0) s += Math.pow(d, k);
  return s;
}

function eisenstein(weight, N) {
  // E4 = 1 + 240 sum sigma_3 q^n ; E6 = 1 - 504 sum sigma_5 ; E8 = 1 + 480 sum sigma_7
  const e = new Array(N + 1).fill(0);
  e[0] = 1;
  let c, kk;
  if (weight === 4) { c = 240; kk = 3; }
  else if (weight === 6) { c = -504; kk = 5; }
  else if (weight === 8) { c = 480; kk = 7; }
  else throw new Error('unsupported Eisenstein weight ' + weight);
  for (let n = 1; n <= N; n++) e[n] = c * sigma(kk, n);
  return e;
}

// returns analytically-normalized Hecke eigenvalues lambda(n) = a(n)/n^{(k-1)/2}
function newformLambda(weight, N) {
  const D = deltaCoeffs(N);
  let a;
  if (weight === 12) a = D;
  else if (weight === 16) a = polymul(eisenstein(4, N), D, N);
  else if (weight === 18) a = polymul(eisenstein(6, N), D, N);
  else if (weight === 20) a = polymul(eisenstein(8, N), D, N);
  else throw new Error('unsupported newform weight ' + weight);
  const lam = new Float64Array(N + 1);
  const e = (weight - 1) / 2;
  for (let n = 1; n <= N; n++) lam[n] = a[n] / Math.pow(n, e);
  return { lambda: lam, a2: a[2] };
}

// Rankin-Selberg coefficients b(n) = sum_{d^2 | n} lam_f(n/d^2) lam_g(n/d^2)
function rankinSelbergCoeffs(lamF, lamG, N) {
  const b = new Float64Array(N + 1);
  for (let n = 1; n <= N; n++) {
    let s = 0;
    for (let d = 1; d * d <= n; d++) {
      if (n % (d * d) === 0) {
        const m = n / (d * d);
        s += lamF[m] * lamG[m];
      }
    }
    b[n] = s;
  }
  return b;
}

// ── modified Bessel K_nu (integer nu) via DLMF 10.32.9 ──────────────────────
// K_nu(x) = int_0^inf exp(-x cosh t) cosh(nu t) dt,  x > 0.
// Midpoint quadrature; tail cut where x cosh t ~ 720 (exp underflow).
function besselK(nu, x, nNodes = 4000) {
  if (x <= 0) return Infinity;
  // upper limit T: x cosh(T) ~ 720
  const coshMax = 720 / x;
  const T = coshMax > 1 ? Math.acosh(coshMax) : 0.0;
  if (T <= 0) return 0;
  const h = T / nNodes;
  let sum = 0;
  for (let i = 0; i < nNodes; i++) {
    const t = (i + 0.5) * h;
    const arg = -x * Math.cosh(t);
    if (arg < -740) continue;
    sum += Math.exp(arg) * Math.cosh(nu * t);
  }
  return sum * h;
}

// ── Galerkin operator 2-norm via power iteration (mirrors imp-2357) ─────────
function operator2Norm(V, N, tol = 1e-10, maxIter = 2000) {
  let seed = 0x12345678;
  const rng = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  let x = new Float64Array(N);
  for (let i = 0; i < N; i++) x[i] = rng() - 0.5;
  let nrm = 0; for (let i = 0; i < N; i++) nrm += x[i] * x[i]; nrm = Math.sqrt(nrm);
  if (nrm === 0) { x[0] = 1; nrm = 1; }
  for (let i = 0; i < N; i++) x[i] /= nrm;
  let lambdaPrev = 0, residual = Infinity, iter;
  for (iter = 0; iter < maxIter; iter++) {
    const y = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      const row = V[i]; let s = 0;
      for (let j = i + 1; j < N; j++) s += row[j] * x[j];
      y[i] = s;
    }
    const z = new Float64Array(N);
    for (let j = 0; j < N; j++) { let s = 0; for (let i = 0; i < j; i++) s += V[i][j] * y[i]; z[j] = s; }
    let lambda = 0; for (let j = 0; j < N; j++) lambda += z[j] * z[j]; lambda = Math.sqrt(lambda);
    let rq = 0; for (let i = 0; i < N; i++) rq += y[i] * y[i];
    if (lambda === 0) return { norm: Math.sqrt(rq), iterCount: iter + 1, converged: true, residual: 0 };
    for (let j = 0; j < N; j++) x[j] = z[j] / lambda;
    residual = Math.abs(rq - lambdaPrev) / Math.max(rq, 1e-300);
    if (iter > 5 && residual < tol) return { norm: Math.sqrt(rq), iterCount: iter + 1, converged: true, residual };
    lambdaPrev = rq;
  }
  const yf = new Float64Array(N);
  for (let i = 0; i < N; i++) { let s = 0; for (let j = i + 1; j < N; j++) s += V[i][j] * x[j]; yf[i] = s; }
  let rq = 0; for (let i = 0; i < N; i++) rq += yf[i] * yf[i];
  return { norm: Math.sqrt(rq), iterCount: iter, converged: false, residual };
}

function runPair(k1, k2, aGrid) {
  const N_COEF = 40;            // b(n) truncation (n^m K_nu(4 pi sqrt(n e^u)) tail)
  const N_BESSEL = 4000;        // K-Bessel quadrature nodes
  const m = (k1 - 1) / 2;       // = (mu1 + mu2)/2
  const nu = k2 - 1;            // = mu1 - mu2

  const fF = newformLambda(k1, N_COEF);
  const fG = newformLambda(k2, N_COEF);
  const b = rankinSelbergCoeffs(fF.lambda, fG.lambda, N_COEF);

  const G = (y) => Math.pow(y, m) * besselK(nu, FOUR_PI * Math.sqrt(y), N_BESSEL);

  const Phi = (u) => {
    const eu = Math.exp(u);
    let sum = 0;
    for (let n = 1; n <= N_COEF; n++) {
      const y = n * eu;
      const g = G(y);
      if (g === 0 && y > 1) { /* keep scanning: G non-monotone only at tiny y */ }
      sum += b[n] * g;
    }
    return Math.exp(0.5 * u) * sum;
  };

  // L^2 integrals on [0, U_INF]
  const U_INF = 3.0, N_INF = 4000, H_INF = U_INF / N_INF;
  const phi2 = new Float64Array(N_INF), tinf = new Float64Array(N_INF);
  let phiMax = 0;
  for (let i = 0; i < N_INF; i++) {
    tinf[i] = (i + 0.5) * H_INF;
    const p = Phi(tinf[i]);
    phi2[i] = p * p;
    if (Math.abs(p) > phiMax) phiMax = Math.abs(p);
  }
  let I0 = 0; for (let i = 0; i < N_INF; i++) I0 += phi2[i]; I0 *= H_INF;

  // Galerkin op-norm window
  const U_OP = 3.0, N_OP = 600, hOP = U_OP / N_OP;
  const tOp = new Float64Array(N_OP), phiOp = new Float64Array(N_OP);
  for (let i = 0; i < N_OP; i++) { tOp[i] = (i + 0.5) * hOP; phiOp[i] = Phi(tOp[i]); }

  const rows = [];
  for (const a of aGrid) {
    let Ja = 0;
    for (let i = 0; i < N_INF; i++) { const sh = Math.sinh(a * tinf[i]); Ja += phi2[i] * sh * sh; }
    Ja *= H_INF;
    const hsBound = Math.sqrt(I0 * Ja);
    const V = new Array(N_OP);
    for (let i = 0; i < N_OP; i++) {
      const row = new Float64Array(N_OP);
      for (let j = i + 1; j < N_OP; j++) {
        row[j] = hOP * phiOp[i] * phiOp[j] * Math.sinh(a * (tOp[j] - tOp[i]));
      }
      V[i] = row;
    }
    const { norm: opNorm, iterCount, converged, residual } = operator2Norm(V, N_OP);
    rows.push({
      a, I0, Ja, hs_bound: hsBound, op_norm_galerkin: opNorm,
      margin: hsBound / Math.max(opNorm, 1e-300),
      hs_bound_holds: opNorm <= hsBound,
      iter_count: iterCount, converged, residual,
    });
  }
  return {
    k1, k2, m, nu, N_COEF, N_BESSEL, U_INF, N_INF, U_OP, N_OP,
    a2_f: fF.a2, a2_g: fG.a2, b_1_to_8: Array.from(b.slice(0, 9)),
    phiMax, phi_at_0: Phi(0), I0, rows,
  };
}

// ── Sweep: five Rankin-Selberg pairs of low-level holomorphic forms ──────────
const PAIRS = [
  { k1: 16, k2: 12, label: 'F16 x Delta' },
  { k1: 18, k2: 12, label: 'F18 x Delta' },
  { k1: 20, k2: 12, label: 'F20 x Delta' },
  { k1: 18, k2: 16, label: 'F18 x F16' },
  { k1: 20, k2: 16, label: 'F20 x F16' },
];
const A_GRID = [0.01, 0.05, 0.2];

const t0 = performance.now();
const results = [];
for (const p of PAIRS) {
  const r = runPair(p.k1, p.k2, A_GRID);
  r.label = p.label;
  results.push(r);
  for (const row of r.rows) {
    console.error(
      `${p.label.padEnd(13)} (k1=${r.k1},k2=${r.k2}) nu=${r.nu} m=${r.m}  a=${row.a.toFixed(3)}` +
      `  I0=${row.I0.toExponential(3)}  Ja=${row.Ja.toExponential(3)}` +
      `  HS=${row.hs_bound.toExponential(3)}  op=${row.op_norm_galerkin.toExponential(3)}` +
      `  margin=${row.margin.toFixed(4)}x  holds=${row.hs_bound_holds}`
    );
  }
}
console.error(`# total ${(performance.now() - t0).toFixed(0)} ms`);

let marginMin = Infinity, marginMax = -Infinity, allHold = true;
for (const r of results) for (const row of r.rows) {
  marginMin = Math.min(marginMin, row.margin);
  marginMax = Math.max(marginMax, row.margin);
  if (!row.hs_bound_holds) allHold = false;
}
const allSub2 = marginMax < 2;
console.error(`# margin range [${marginMin.toFixed(4)}, ${marginMax.toFixed(4)}]  allHold=${allHold}  allSub2=${allSub2}`);

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  pairs: PAIRS.map((p) => p.label),
  aGrid: A_GRID,
  results,
  marginMin, marginMax, allHold, allSub2,
}, null, 2));
