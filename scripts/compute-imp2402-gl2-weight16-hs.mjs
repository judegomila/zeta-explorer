#!/usr/bin/env node
// imp-2402: Concrete test of the imp-1267 / imp-1298 HS-bound framework on a
// FOURTH L-function family -- the weight-16 level-1 holomorphic newform
// 1.16.a.a (= Delta * E4, the unique normalized cusp form of weight 16 on
// SL(2, Z)). Extends the imp-1317 (Delta, weight 12) validation to a second
// holomorphic GL(2) cusp form of a DIFFERENT weight, testing whether the
// constant Cauchy-Schwarz slack and the ||V|| << 1 contraction persist as the
// archimedean parameter (gamma-factor center k/2 = 8 here vs 6 for Delta)
// changes.
//
// FORM CHOSEN: weight-16 newform F = Delta * E4 (LMFDB 1.16.a.a)
// -------------------------------------------------------------
// S_16(SL(2,Z)) is 1-dimensional, spanned by the cusp form Delta * E4. Its
// normalized Hecke eigenform F has integer coefficients a(n) with a(1) = 1,
// a(2) = 216, a(3) = -3348, ... (self-dual, trivial character). The completed
// L-function:
//   Lambda(s, F) = (2*pi)^{-s} * Gamma(s) * L(s, F)
//   Functional equation:  Lambda(s, F) = Lambda(16 - s, F)   (root number +1)
//
// We compute the coefficients a(n) EXACTLY here from the q-expansions of
// Delta = q * prod_{m>=1} (1-q^m)^24 and E4 = 1 + 240 * sum sigma_3(n) q^n,
// so nothing is hardcoded / fabricated.
//
// PHI_F CONSTRUCTION VIA MELLIN INVERSE  (center s = k/2 = 8)
// ----------------------------------------------------------
//   f(y) := sum_{n>=1} a(n) exp(-2*pi*n*y),  Lambda(s,F) = int_0^inf f(y) y^{s-1} dy
//   functional equation f(1/y) = y^{16} f(y); substituting y = e^u and centering
//   at s = 8 + it:
//   Phi_F(u) := e^{8u} * f(e^u) = e^{8u} * sum_n a(n) exp(-2*pi*n*e^u).
// Phi_F(u) = Phi_F(-u). Super-exponential decay on R_+.
//
// THE HS BOUND TO TEST (identical to imp-1267 / imp-1317)
// ------------------------------------------------------
//   ||V_{a,Phi_F}||_op <= ||V_{a,Phi_F}||_HS <= sqrt(I_0^L * J_a^L)
//   I_0^L = int_0^inf Phi_F(u)^2 du,  J_a^L = int_0^inf Phi_F(u)^2 sinh^2(a u) du.

import { performance } from 'node:perf_hooks';

// ── Exact q-expansion coefficients of the weight-16 newform F = Delta * E4 ────
const N_COEF = 24;  // compute a(1..24); we only use n=1..20 in Phi_F

// Delta = q * prod_{m>=1} (1 - q^m)^24, expanded to order N_COEF.
function deltaCoeffs(N) {
  // prod (1-q^m)^24, coefficients c[0..N]; then Delta[n] = c[n-1].
  let c = new Array(N + 1).fill(0);
  c[0] = 1;
  for (let m = 1; m <= N; m++) {
    // multiply by (1 - q^m)^24 via 24-fold convolution with (1 - q^m)
    for (let rep = 0; rep < 24; rep++) {
      for (let k = N; k >= m; k--) c[k] -= c[k - m];
    }
  }
  // Delta[n] = c[n-1] (the leading q shifts by one)
  const d = new Array(N + 1).fill(0);
  for (let n = 1; n <= N; n++) d[n] = c[n - 1];
  return d;
}

// E4 = 1 + 240 * sum_{n>=1} sigma_3(n) q^n
function sigma3(n) {
  let s = 0;
  for (let dd = 1; dd <= n; dd++) if (n % dd === 0) s += dd * dd * dd;
  return s;
}
function e4Coeffs(N) {
  const e = new Array(N + 1).fill(0);
  e[0] = 1;
  for (let n = 1; n <= N; n++) e[n] = 240 * sigma3(n);
  return e;
}

function weight16Coeffs(N) {
  const d = deltaCoeffs(N);   // d[0]=0, d[1]=1, ...
  const e = e4Coeffs(N);
  const a = new Array(N + 1).fill(0);
  for (let n = 1; n <= N; n++) {
    let s = 0;
    for (let j = 1; j <= n; j++) s += d[j] * e[n - j];
    a[n] = s;
  }
  return a; // a[1]=1, a[2]=216, ...
}

const A = Object.freeze(weight16Coeffs(N_COEF));
const N_A = 20; // truncation used in Phi_F (a(1..20))

const TWO_PI = 2 * Math.PI;
const K_HALF = 8; // weight 16, center s = k/2 = 8

// Phi_F(u) = e^{8u} * sum_{n=1..N_A} a(n) * exp(-2*pi*n*e^u)
function PhiF(u) {
  const eu = Math.exp(u);
  const kU = K_HALF * u;
  let sum = 0;
  for (let n = 1; n <= N_A; n++) {
    const arg = kU - TWO_PI * n * eu;
    if (arg < -700) continue;
    sum += A[n] * Math.exp(arg);
  }
  return sum;
}

// Tail bound for the coefficient-series truncation at N_A. Deligne (RH for
// GL(2)) gives |a(n)| <= sigma_0(n) n^{15/2} <= n^8 for n >= 2. The n-th term is
// |a(n)| exp(8u - 2 pi n e^u); for u >= 0, e^u >= 1, so terms decay
// super-exponentially in n. At u=0: <= n^8 e^{-2 pi n}, sum for n>20 << 1e-40.
function tailBoundAtU(u) {
  const eu = Math.exp(u);
  const n = N_A + 1; // 21
  return Math.pow(n, 8) * Math.exp(K_HALF * u - TWO_PI * n * eu);
}

// ── Quadrature on [0, U_INF] for the L^2 integrals ─────────────────────────
const U_INF = 2.0;
const N_INF = 20000;
const H_INF = U_INF / N_INF;

const phi2_arr = new Float64Array(N_INF);
const t_inf = new Float64Array(N_INF);
let phiMax = 0;
for (let i = 0; i < N_INF; i++) {
  t_inf[i] = (i + 0.5) * H_INF;
  const p = PhiF(t_inf[i]);
  phi2_arr[i] = p * p;
  if (Math.abs(p) > phiMax) phiMax = Math.abs(p);
}

function I0L_inf() {
  let s = 0;
  for (let i = 0; i < N_INF; i++) s += phi2_arr[i];
  return s * H_INF;
}
function JaL_inf(a) {
  let s = 0;
  for (let i = 0; i < N_INF; i++) {
    const sh = Math.sinh(a * t_inf[i]);
    s += phi2_arr[i] * sh * sh;
  }
  return s * H_INF;
}

// ── Empirical op-norm via Galerkin power iteration (same as imp-1317) ───────
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
  const y_final = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    let s = 0;
    for (let j = i + 1; j < N; j++) s += V[i][j] * x[j];
    y_final[i] = s;
  }
  let rq = 0;
  for (let i = 0; i < N; i++) rq += y_final[i] * y_final[i];
  return { norm: Math.sqrt(rq), iterCount: iter, converged: false, residual };
}

function buildV(a, U, N) {
  const h = U / N;
  const t = new Float64Array(N);
  const phi = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    t[i] = (i + 0.5) * h;
    phi[i] = PhiF(t[i]);
  }
  const V = new Array(N);
  for (let i = 0; i < N; i++) {
    const row = new Float64Array(N);
    for (let j = i + 1; j < N; j++) {
      const dt = t[j] - t[i];
      row[j] = h * phi[i] * phi[j] * Math.sinh(a * dt);
    }
    V[i] = row;
  }
  return V;
}

// ── Main sweep ─────────────────────────────────────────────────────────────
const A_GRID = [0.01, 0.05, 0.2];
const U_OP = 2.0;
const N_OP = 800;

console.error('# imp-2402: HS bound for GL(2) weight-16 newform L(s, F) (Delta * E4)');
console.error(`# a(1..6) = ${A.slice(1, 7).join(', ')}  (a(1)=1, a(2)=216 expected)`);
console.error(`# N_A = ${N_A} (truncation), U_INF = ${U_INF}, N_INF = ${N_INF}`);

const tail_at_0 = tailBoundAtU(0);
const tail_at_U_INF = tailBoundAtU(U_INF);
console.error(`#   coef-tail bound at u=0:     <= ${tail_at_0.toExponential(3)}`);
console.error(`#   coef-tail bound at u=U_INF: <= ${tail_at_U_INF.toExponential(3)}`);

const phi0 = PhiF(0);
const phi_at_1 = PhiF(1);
const phi_at_2 = PhiF(U_INF);
console.error(`#   Phi(0)     = ${phi0.toExponential(6)}`);
console.error(`#   Phi(1)     = ${phi_at_1.toExponential(6)}`);
console.error(`#   Phi(U_INF) = ${phi_at_2.toExponential(6)}`);
console.error(`#   max |Phi(u)| on [0, U_INF] = ${phiMax.toExponential(6)}`);

const t0 = performance.now();
const I0L = I0L_inf();
console.error(`#   I_0^L = ${I0L.toExponential(8)}`);

const rows = [];
for (const a of A_GRID) {
  const tStart = performance.now();
  const JaL = JaL_inf(a);
  const hsBound = Math.sqrt(I0L * JaL);

  const V = buildV(a, U_OP, N_OP);
  const { norm: opNorm, iterCount, converged, residual } = operator2Norm(V, N_OP);

  const hsBoundHolds = opNorm <= hsBound;
  const safetyMargin = hsBound / Math.max(opNorm, 1e-300);

  rows.push({
    a,
    U_INF,
    N_INF,
    U_OP,
    N_OP,
    I0_L: I0L,
    Ja_L: JaL,
    hs_bound: hsBound,
    op_norm_galerkin: opNorm,
    iter_count: iterCount,
    converged,
    residual,
    hs_bound_holds: hsBoundHolds,
    safety_margin: safetyMargin,
    hs_bound_below_one: hsBound < 1,
    op_norm_below_one: opNorm < 1,
  });

  const dt = performance.now() - tStart;
  console.error(
    `  a=${a.toFixed(3)}  I_0^L=${I0L.toExponential(3)}  J_a^L=${JaL.toExponential(3)}` +
    `  HS_bound=${hsBound.toExponential(3)}  op_norm=${opNorm.toExponential(3)}` +
    `  margin=${safetyMargin.toFixed(4)}x  conv=${converged}  (${dt.toFixed(0)} ms)`
  );
}

const allHsBoundsHold = rows.every((r) => r.hs_bound_holds);
const allHsBoundsBelowOne = rows.every((r) => r.hs_bound_below_one);
const allOpNormsBelowOne = rows.every((r) => r.op_norm_below_one);

let verdict;
if (allHsBoundsHold && allHsBoundsBelowOne) {
  verdict = 'gl2-weight16-HS-bound-holds';
} else if (!allHsBoundsHold) {
  verdict = 'gl2-weight16-HS-bound-fails-by-X';
} else {
  verdict = 'phi-L-computation-too-coarse-for-verdict';
}

const summary = {
  generatedAt: new Date().toISOString(),
  formChoice: 'weight-16 level-1 newform F = Delta * E4 (LMFDB 1.16.a.a)',
  weight: 16,
  level: 1,
  N_A,
  coeffs_1_to_20: A.slice(1, 21),
  U_INF,
  N_INF,
  I0_L: I0L,
  phi0,
  phi_max_abs: phiMax,
  rows,
  allHsBoundsHold,
  allHsBoundsBelowOne,
  allOpNormsBelowOne,
  verdict,
  coef_tail_bound_at_u0: tail_at_0,
  coef_tail_bound_at_U_INF: tail_at_U_INF,
};

console.log(JSON.stringify(summary, null, 2));
