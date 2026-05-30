#!/usr/bin/env node
// imp-1317: Concrete test of the imp-1267 / imp-1298 HS-bound framework on a
// specific GL(2) L-function -- the modular discriminant L(s, Delta) (Ramanujan
// tau), the SIMPLEST GL(2) L-function with integer-valued Dirichlet coefficients.
//
// PURPOSE
// -------
// imp-1267 proved ||V_{a,Phi_xi}||_HS <= sqrt(I_0 * J_a) for the Riemann xi
// kernel Phi_xi (de Bruijn-Newman, scalar GL(1)). imp-1298 argued the bound
// EXTENDS to GL(n) automorphic L via matrix-Hilbert-Schmidt and Cauchy-Schwarz
// on trace-positive matrices (Bhatia 1997 Ch. 4). This script provides the
// FIRST CONCRETE empirical test of the GL(2) version of the HS bound on a
// non-trivial L-function.
//
// GL(2) L-FUNCTION CHOSEN: Delta (Ramanujan tau)
// ----------------------------------------------
// The modular discriminant Delta(z) is the unique normalized cusp form of
// weight 12 on SL(2, Z). Its L-function L(s, Delta) = Sum tau(n)/n^s has
// integer Dirichlet coefficients (tau(n) is Ramanujan's tau).
//
// Completed L-function:
//   Lambda(s, Delta) = (2*pi)^{-s} * Gamma(s) * L(s, Delta)
//   Functional equation:  Lambda(s, Delta) = Lambda(12 - s, Delta)
//
// PHI_L CONSTRUCTION VIA MELLIN INVERSE
// --------------------------------------
// Define f(y) := sum_{n=1}^infty tau(n) * exp(-2*pi*n*y) for y > 0. Then
//
//   Lambda(s, Delta) = integral_0^infty f(y) * y^{s-1} dy.
//
// Functional equation gives f(1/y) = y^{12} * f(y). Substituting y = e^u in
// the Mellin integral:
//
//   Lambda(6 + it, Delta) = integral_{-infty}^infty f(e^u) * e^{6u} * e^{iut} du
//
// So the inverse-Mellin Fourier kernel is
//
//   Phi_Delta(u) := e^{6u} * f(e^u) = e^{6u} * sum_n tau(n) exp(-2*pi*n*e^u).
//
// Phi_Delta(u) = Phi_Delta(-u) (functional equation). On R_+ it has
// super-exponential decay: Phi_Delta(u) ~ tau(1) * e^{6u} * exp(-2*pi*e^u)
// as u -> infinity. Computable to very high precision via series truncation
// since |tau(n)| <= n^{11/2} * d(n) (Deligne 1974) so the n-series converges
// rapidly for any u > -log(2*pi)/1.
//
// THE HS BOUND TO TEST
// --------------------
// Following imp-1267 / imp-1298, define on L^2([0, infty)):
//
//   V_{a, Phi_Delta} f(x) = integral_0^x Phi_Delta(x) Phi_Delta(y)
//                            sinh(a(x-y)) f(y) dy.
//
// HS bound:  ||V_{a, Phi_Delta}||_op <= ||V_{a, Phi_Delta}||_HS
//                                   <= sqrt(I_0^L * J_a^L)
// where
//   I_0^L = integral_0^infty Phi_Delta(u)^2 du,
//   J_a^L = integral_0^infty Phi_Delta(u)^2 * sinh^2(a*u) du.
//
// Note: for the scalar (non-matrix) case of GL(2) with Phi_Delta REAL-valued
// (Delta is self-dual), the matrix HS bound reduces to a scalar HS bound with
// Phi_Delta replacing Phi_xi. This is the simplest possible GL(2) test.
//
// METHOD
// ------
// (1) Compute Phi_Delta on a uniform grid u_i in [0, U] using N midpoint nodes.
// (2) Truncate the tau-series at N_TAU terms (N_TAU = 20 chosen so the tail
//     |sum_{n > 20} tau(n) e^{-2pi n y}| < 1e-12 across the grid).
// (3) Compute I_0^L (midpoint quadrature).
// (4) For each a in A_GRID = {0.01, 0.05, 0.2}: compute J_a^L and HS bound
//     sqrt(I_0^L * J_a^L).
// (5) Build the discretized Volterra matrix V[i][j] and compute its 2-norm
//     via power iteration (Galerkin lower bound on ||V||_op).
// (6) Verify the HS bound: empirical op_norm <= HS bound.

import { performance } from 'node:perf_hooks';

// ── Ramanujan tau coefficients for n = 1..20 ────────────────────────────────
// Standard, well-known (Lehmer 1959; LMFDB elliptic-modular-form 1.12.a.a).
// |tau(n)| <= sigma_0(n) * n^{11/2}  (Deligne 1974 / RH for GL(2))
const TAU = Object.freeze([
  /* n=0 unused */ 0,
  /* 1  */ 1,
  /* 2  */ -24,
  /* 3  */ 252,
  /* 4  */ -1472,
  /* 5  */ 4830,
  /* 6  */ -6048,
  /* 7  */ -16744,
  /* 8  */ 84480,
  /* 9  */ -113643,
  /* 10 */ -115920,
  /* 11 */ 534612,
  /* 12 */ -370944,
  /* 13 */ -577738,
  /* 14 */ 401856,
  /* 15 */ 1217160,
  /* 16 */ 987136,
  /* 17 */ -6905934,
  /* 18 */ 2727432,
  /* 19 */ 10661420,
  /* 20 */ -7109760,
]);
const N_TAU = TAU.length - 1;  // = 20

const TWO_PI = 2 * Math.PI;

// Phi_Delta(u) = e^{6u} * sum_{n=1..N_TAU} tau(n) * exp(-2*pi*n*e^u)
function PhiDelta(u) {
  const eu = Math.exp(u);
  const sixU = 6 * u;
  let sum = 0;
  for (let n = 1; n <= N_TAU; n++) {
    // e^{6u} * tau(n) * exp(-2 pi n e^u) =
    //   tau(n) * exp(6u - 2 pi n e^u)
    const arg = sixU - TWO_PI * n * eu;
    if (arg < -700) continue; // underflow to 0
    sum += TAU[n] * Math.exp(arg);
  }
  return sum;
}

// Tail estimate for the tau-series truncation at N_TAU.
// Worst case bound: |tau(n)| <= 1.5 * n^{11/2} (Deligne, sharp version
// |tau(n)| <= sigma_0(n) * n^{11/2}). At u, the n-th term is
// |tau(n)| * exp(6u - 2 pi n e^u). For u > 0 we have e^u > 1 so the term
// decays super-exponentially in n. For u = 0: bound by n^{11/2} * e^{-2 pi n}.
// Sum for n > 20: < 21^{11/2} * e^{-2 pi * 21} / (1 - e^{-2 pi}) << 1e-50.
// So the truncation is fp-zero on [0, U_MAX].
function tailBoundN20AtU(u) {
  // crude upper bound for residual
  const eu = Math.exp(u);
  const n = N_TAU + 1; // 21
  // |tau(n)| <= n^{11/2} * sigma_0(n) <= n^{11/2} * n^eps ~ n^{6}
  return Math.pow(n, 6) * Math.exp(6 * u - TWO_PI * n * eu);
}

// ── Quadrature on [0, U_INF] for the L^2 integrals ─────────────────────────
//
// For Delta with weight 12, Phi_Delta(u) is dominated by the n=1 term at large u.
// exp(-2pi e^u) is already 1e-3 at u=0 and 1e-272 at u=2. We use U_INF=2,
// N_INF=20000 (h = 1e-4) for the I_0^L and J_a^L integrals.

const U_INF = 2.0;
const N_INF = 20000;
const H_INF = U_INF / N_INF;

// Precompute Phi^2 on the fine grid
const phi2_arr = new Float64Array(N_INF);
const t_inf = new Float64Array(N_INF);
let phiMax = 0;
let phiSquaredMax = 0;
for (let i = 0; i < N_INF; i++) {
  t_inf[i] = (i + 0.5) * H_INF;
  const p = PhiDelta(t_inf[i]);
  phi2_arr[i] = p * p;
  if (Math.abs(p) > phiMax) phiMax = Math.abs(p);
  if (phi2_arr[i] > phiSquaredMax) phiSquaredMax = phi2_arr[i];
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

// ── Empirical op-norm via Galerkin power iteration ─────────────────────────
//
// Build V[i][j] on a U_OP-wide window with N_OP midpoint nodes
// (smaller than N_INF to keep memory manageable; the op-norm only needs the
// dominant support of Phi_Delta).

function operator2Norm(V, N, tol = 1e-10, maxIter = 2000) {
  // Seed for reproducibility (same LCG as imp-1262).
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
    // y = V x  (V is upper-triangular: V[i][j] for j > i)
    const y = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      const row = V[i];
      let s = 0;
      for (let j = i + 1; j < N; j++) s += row[j] * x[j];
      y[i] = s;
    }
    // z = V^T y
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
  // Did not converge
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
    phi[i] = PhiDelta(t[i]);
  }
  const V = new Array(N);
  for (let i = 0; i < N; i++) {
    const row = new Float64Array(N);
    for (let j = i + 1; j < N; j++) {
      const dt = t[j] - t[i];
      const sinhVal = Math.sinh(a * dt);
      // For our a-grid (max a=0.2) and U=2, max arg = 0.4, no overflow.
      row[j] = h * phi[i] * phi[j] * sinhVal;
    }
    V[i] = row;
  }
  return V;
}

// ── Main sweep ─────────────────────────────────────────────────────────────

const A_GRID = [0.01, 0.05, 0.2];
const U_OP = 2.0;
const N_OP = 800;   // 800 x 800 = 640k entries, ~5 MB, ~3 s power iter

console.error('# imp-1317: HS bound for GL(2) L(s, Delta) (Ramanujan tau)');
console.error(`# N_TAU = ${N_TAU} (truncation), U_INF = ${U_INF} (Phi support), N_INF = ${N_INF}`);

// Tau-series tail diagnostic
const tail_at_0 = tailBoundN20AtU(0);
const tail_at_U_INF = tailBoundN20AtU(U_INF);
const tail_at_minus = tailBoundN20AtU(-1); // Phi at u<0 -- not in our integration range but diagnostic
console.error(`#   tau-tail bound at u=0:     <= ${tail_at_0.toExponential(3)}`);
console.error(`#   tau-tail bound at u=U_INF: <= ${tail_at_U_INF.toExponential(3)}`);

// Phi diagnostics
const phi0 = PhiDelta(0);
const phi_at_1 = PhiDelta(1);
const phi_at_2 = PhiDelta(U_INF);
console.error(`#   Phi(0)     = ${phi0.toExponential(6)}`);
console.error(`#   Phi(1)     = ${phi_at_1.toExponential(6)}`);
console.error(`#   Phi(U_INF) = ${phi_at_2.toExponential(6)}`);
console.error(`#   max |Phi(u)| on [0, U_INF] = ${phiMax.toExponential(6)}`);

const t0 = performance.now();
const I0L = I0L_inf();
console.error(`#   I_0^L = ${I0L.toExponential(8)}  (computed in ${(performance.now() - t0).toFixed(0)} ms)`);

const rows = [];
for (const a of A_GRID) {
  const tStart = performance.now();
  const JaL = JaL_inf(a);
  const hsBound = Math.sqrt(I0L * JaL);

  // Empirical op-norm
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
    `  margin=${safetyMargin.toFixed(2)}x  conv=${converged}  (${dt.toFixed(0)} ms)`
  );
}

const dtAll = performance.now() - t0;
console.error(`# total ${dtAll.toFixed(0)} ms`);

const allHsBoundsHold = rows.every((r) => r.hs_bound_holds);
const allHsBoundsBelowOne = rows.every((r) => r.hs_bound_below_one);
const allOpNormsBelowOne = rows.every((r) => r.op_norm_below_one);

let verdict;
if (allHsBoundsHold && allHsBoundsBelowOne) {
  verdict = 'gl2-maass-HS-bound-holds';
} else if (!allHsBoundsHold) {
  verdict = 'gl2-maass-HS-bound-fails-by-X';
} else {
  verdict = 'phi-L-computation-too-coarse-for-verdict';
}

const summary = {
  generatedAt: new Date().toISOString(),
  formChoice: 'modular discriminant Delta (Ramanujan tau)',
  weight: 12,
  level: 1,
  N_TAU,
  U_INF,
  N_INF,
  I0_L: I0L,
  phi0: PhiDelta(0),
  phi_max_abs: phiMax,
  rows,
  allHsBoundsHold,
  allHsBoundsBelowOne,
  allOpNormsBelowOne,
  verdict,
  tau_tail_bound_at_u0: tail_at_0,
  tau_tail_bound_at_U_INF: tail_at_U_INF,
};

console.log(JSON.stringify(summary, null, 2));
