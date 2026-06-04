#!/usr/bin/env node
// imp-1346: GRH empirical check -- HS bound on L(s, chi_q) for primitive
// Dirichlet characters chi_q at small q (q = 3, 5, 7, 11).
//
// PURPOSE
// -------
// imp-1267 proved ||V_{a,Phi_xi}||_HS <= sqrt(I_0 * J_a) for the Riemann xi
// kernel (scalar GL(1) / Riemann zeta). imp-1317 confirmed the bound on a
// GL(2) holomorphic L-function (L(s, Delta), Ramanujan tau). This script
// extends the EMPIRICAL test to a DIFFERENT family: primitive Dirichlet
// L-functions L(s, chi_q), which are GL(1) twists of zeta. Verifying the HS
// bound across q = {3, 5, 7, 11} gives a GRH empirical check on multiple
// L-functions in the same operator-norm framework (imp-1258 collapse).
//
// CHARACTERS CHOSEN: quadratic (real, primitive) characters
// ---------------------------------------------------------
// For each prime q we take the QUADRATIC residue character chi_q(n) =
// Legendre symbol (n | q). These are:
//   - primitive (prime modulus),
//   - real-valued (self-dual, chi = chi-bar), so Phi_q is REAL -- the cleanest
//     analog of the self-dual Delta case in imp-1317 (no complex conjugation),
//   - root number eps(chi_q) = +1 (real quadratic char), so Lambda(s) =
//     Lambda(1-s) and Phi_q(u) = Phi_q(-u) is even.
//
// Parity (chi_q(-1) = (-1)^{(q-1)/2}):
//   q=3 : ODD   (chi(-1) = -1)
//   q=5 : EVEN  (chi(-1) = +1)
//   q=7 : ODD
//   q=11: ODD
//
// PHI_q CONSTRUCTION VIA THETA / INVERSE MELLIN
// ---------------------------------------------
// Completed L-function (a = 0 even, a = 1 odd):
//   Lambda(s, chi) = (q/pi)^{(s+a)/2} Gamma((s+a)/2) L(s, chi).
// Theta function:
//   even: theta_chi(y) = sum_{n>=1} chi(n) exp(-pi n^2 y / q)
//   odd : theta_chi(y) = sum_{n>=1} n chi(n) exp(-pi n^2 y / q)
// giving Lambda(s, chi) = int_0^inf theta_chi(y) y^{(s+a)/2 - 1} dy.
// Substituting y = e^{2u} and centering at s = 1/2 + it yields the
// inverse-Mellin Fourier kernel (dual to t):
//   even: Phi_q(u) = 2 e^{u/2}  * sum_{n>=1}   chi(n) exp(-pi n^2 e^{2u} / q)
//   odd : Phi_q(u) = 2 e^{3u/2} * sum_{n>=1} n chi(n) exp(-pi n^2 e^{2u} / q)
// Super-exponential decay in u (exp(-pi e^{2u}/q) factor); the n-series
// converges geometrically for any u >= 0.
//
// THE HS BOUND TO TEST  (same structure as imp-1267 / imp-1317)
// ------------------------------------------------------------
//   V_{a, Phi_q} f(x) = int_0^x Phi_q(x) Phi_q(y) sinh(a(x-y)) f(y) dy
//   ||V_{a, Phi_q}||_op <= ||V_{a, Phi_q}||_HS <= sqrt(I_0^q * J_a^q)
//   I_0^q = int_0^inf Phi_q(u)^2 du
//   J_a^q = int_0^inf Phi_q(u)^2 sinh^2(a u) du
//
// METHOD
// ------
// (1) Phi_q on a uniform midpoint grid u in [0, U_INF], theta truncated at
//     N_CHI terms (tail < 1e-30 across the grid).
// (2) I_0^q (midpoint quadrature).
// (3) For each a in {0.01, 0.05, 0.2}: J_a^q and HS bound sqrt(I_0^q J_a^q).
// (4) Galerkin Volterra matrix V[i][j], 2-norm via power iteration
//     (lower bound on ||V||_op). Verify op_norm <= HS bound.

import { performance } from 'node:perf_hooks';

const PI = Math.PI;

// ── Quadratic (Legendre) character mod prime q via Euler criterion ──────────
function legendre(n, q) {
  const r = ((n % q) + q) % q;
  if (r === 0) return 0;
  // r^{(q-1)/2} mod q  -> 1 (QR) or q-1 (non-QR)
  let e = (q - 1) / 2;
  let base = r % q;
  let acc = 1;
  while (e > 0) {
    if (e & 1) acc = (acc * base) % q;
    base = (base * base) % q;
    e >>= 1;
  }
  return acc === 1 ? 1 : -1;
}

// ── Character definitions ───────────────────────────────────────────────────
const Q_LIST = [3, 5, 7, 11];
const N_CHI = 80;  // theta-series truncation

function makeChar(q) {
  const chi = new Int8Array(N_CHI + 1);
  for (let n = 1; n <= N_CHI; n++) chi[n] = legendre(n, q);
  const parityOdd = ((q - 1) / 2) % 2 === 1; // chi(-1) = (-1)^{(q-1)/2}
  return { q, chi, parityOdd };
}

// Phi_q(u): even -> 2 e^{u/2} sum chi(n) exp(-pi n^2 e^{2u}/q)
//           odd  -> 2 e^{3u/2} sum n chi(n) exp(-pi n^2 e^{2u}/q)
function makePhi({ q, chi, parityOdd }) {
  const pref = parityOdd ? 1.5 : 0.5;
  return (u) => {
    const e2u = Math.exp(2 * u);
    let sum = 0;
    for (let n = 1; n <= N_CHI; n++) {
      const c = chi[n];
      if (c === 0) continue;
      const arg = -PI * n * n * e2u / q;
      if (arg < -740) break; // underflow; subsequent n only smaller
      const term = Math.exp(arg);
      sum += parityOdd ? n * c * term : c * term;
    }
    return 2 * Math.exp(pref * u) * sum;
  };
}

// Tail bound for theta truncation at N_CHI (crude): term n=N_CHI+1 at given u.
function tailBound({ q, parityOdd }, u) {
  const e2u = Math.exp(2 * u);
  const n = N_CHI + 1;
  const pref = parityOdd ? 1.5 : 0.5;
  const coeff = parityOdd ? n : 1;
  return 2 * Math.exp(pref * u) * coeff * Math.exp(-PI * n * n * e2u / q);
}

// ── Quadrature on [0, U_INF] ────────────────────────────────────────────────
const U_INF = 3.0;
const N_INF = 30000;
const H_INF = U_INF / N_INF;

function computeI0AndPhi(Phi) {
  const t = new Float64Array(N_INF);
  const phi2 = new Float64Array(N_INF);
  let phiMax = 0;
  for (let i = 0; i < N_INF; i++) {
    t[i] = (i + 0.5) * H_INF;
    const p = Phi(t[i]);
    phi2[i] = p * p;
    if (Math.abs(p) > phiMax) phiMax = Math.abs(p);
  }
  let s = 0;
  for (let i = 0; i < N_INF; i++) s += phi2[i];
  return { I0: s * H_INF, t, phi2, phiMax };
}

function JaL(t, phi2, a) {
  let s = 0;
  for (let i = 0; i < N_INF; i++) {
    const sh = Math.sinh(a * t[i]);
    s += phi2[i] * sh * sh;
  }
  return s * H_INF;
}

// ── Galerkin op-norm via power iteration (same LCG seed as imp-1317) ────────
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

const U_OP = 3.0;
const N_OP = 900;

function buildV(Phi, a, U, N) {
  const h = U / N;
  const t = new Float64Array(N);
  const phi = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    t[i] = (i + 0.5) * h;
    phi[i] = Phi(t[i]);
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

// ── Main sweep ──────────────────────────────────────────────────────────────
const A_GRID = [0.01, 0.05, 0.2];

console.error('# imp-1346: HS bound for primitive Dirichlet L(s, chi_q), q in {3,5,7,11}');
console.error(`# N_CHI = ${N_CHI}, U_INF = ${U_INF}, N_INF = ${N_INF}, U_OP = ${U_OP}, N_OP = ${N_OP}`);

const t0 = performance.now();
const perQ = [];
const allRows = [];

for (const q of Q_LIST) {
  const charObj = makeChar(q);
  const Phi = makePhi(charObj);
  const { I0, t, phi2, phiMax } = computeI0AndPhi(Phi);
  const tail0 = tailBound(charObj, 0);
  const tailU = tailBound(charObj, U_INF);
  console.error(
    `# q=${q} (${charObj.parityOdd ? 'odd ' : 'even'})  I_0^q=${I0.toExponential(6)}` +
    `  Phi(0)=${Phi(0).toExponential(4)}  maxPhi=${phiMax.toExponential(4)}` +
    `  tail0<=${tail0.toExponential(2)}`,
  );

  const rows = [];
  for (const a of A_GRID) {
    const Ja = JaL(t, phi2, a);
    const hsBound = Math.sqrt(I0 * Ja);
    const V = buildV(Phi, a, U_OP, N_OP);
    const { norm: opNorm, iterCount, converged, residual } = operator2Norm(V, N_OP);
    const hsBoundHolds = opNorm <= hsBound;
    const safetyMargin = hsBound / Math.max(opNorm, 1e-300);
    const row = {
      q,
      parityOdd: charObj.parityOdd,
      a,
      U_INF, N_INF, U_OP, N_OP,
      I0_q: I0,
      Ja_q: Ja,
      hs_bound: hsBound,
      op_norm_galerkin: opNorm,
      iter_count: iterCount,
      converged,
      residual,
      hs_bound_holds: hsBoundHolds,
      safety_margin: safetyMargin,
      hs_bound_below_one: hsBound < 1,
      op_norm_below_one: opNorm < 1,
    };
    rows.push(row);
    allRows.push(row);
    console.error(
      `  q=${q} a=${a.toFixed(3)}  I_0^q=${I0.toExponential(3)}  J_a^q=${Ja.toExponential(3)}` +
      `  HS=${hsBound.toExponential(3)}  op=${opNorm.toExponential(3)}  margin=${safetyMargin.toFixed(3)}x` +
      `  conv=${converged}`,
    );
  }
  perQ.push({
    q,
    parityOdd: charObj.parityOdd,
    I0_q: I0,
    phi_at_0: Phi(0),
    phi_max_abs: phiMax,
    tail_bound_u0: tail0,
    tail_bound_U_INF: tailU,
    chi_values: Array.from({ length: 12 }, (_, n) => (n === 0 ? 0 : charObj.chi[n])),
    rows,
  });
}

console.error(`# total ${(performance.now() - t0).toFixed(0)} ms`);

const allHold = allRows.every((r) => r.hs_bound_holds);
const allBelowOne = allRows.every((r) => r.hs_bound_below_one && r.op_norm_below_one);
let verdict;
if (allHold && allBelowOne) verdict = 'dirichlet-GRH-HS-bound-holds';
else if (!allHold) verdict = 'dirichlet-GRH-HS-bound-fails-by-X';
else verdict = 'phi-q-computation-too-coarse-for-verdict';

const summary = {
  generatedAt: new Date().toISOString(),
  family: 'primitive quadratic Dirichlet characters chi_q',
  q_list: Q_LIST,
  N_CHI, U_INF, N_INF, U_OP, N_OP,
  a_grid: A_GRID,
  perQ,
  allHold,
  allBelowOne,
  verdict,
};

console.log(JSON.stringify(summary, null, 2));
