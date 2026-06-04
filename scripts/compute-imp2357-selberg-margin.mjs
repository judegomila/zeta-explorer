#!/usr/bin/env node
// imp-2357: Sweep the Volterra contraction margin across Selberg-class
// L-functions -- specifically the Dedekind zeta functions zeta_K(s) of small
// IMAGINARY QUADRATIC fields K = Q(sqrt(D)), D < 0 fundamental discriminant.
//
// PURPOSE
// -------
// imp-1267 established the scalar HS bound ||V_{a,Phi}||_op <= sqrt(I_0 * J_a)
// for the Riemann xi kernel (GL(1), margin 1.58x-2.57x). imp-1317 confirmed it
// on a GL(2) cusp form (Delta / Ramanujan tau, margin ~1.71x). This script
// extends the EMPIRICAL margin sweep to Dedekind zeta of imaginary quadratic
// fields -- degree-2 Selberg-class L-functions distinct from both zeta and
// Delta. The question: does the Cauchy-Schwarz slack margin = HS_bound/op_norm
// stay sub-2 across this subfamily (generalized-RH-flavored evidence)?
//
// WHY IMAGINARY QUADRATIC FIELDS ARE THE CLEANLY-COMPUTABLE CASE
// -------------------------------------------------------------
// For K imaginary quadratic (r_1 = 0, r_2 = 1) the completed Dedekind zeta has
// a SINGLE complex gamma factor Gamma_C(s) = (2pi)^{-s} Gamma(s):
//
//   Lambda_K(s) = |D|^{s/2} (2pi)^{-s} Gamma(s) zeta_K(s),
//   functional equation  Lambda_K(s) = Lambda_K(1 - s),  central point c = 1/2.
//
// A single Gamma factor means the inverse-Mellin kernel is a SCALAR theta
// series (the matrix-Phi_L of imp-1298 collapses to a scalar), exactly as in
// imp-1317. By contrast REAL quadratic fields (gamma factor Gamma_R(s)^2 =
// pi^{-s} Gamma(s/2)^2) and symmetric-power L(s, sym^m f) for m >= 2 (GL(m+1),
// product of >=3 gamma factors) have genuinely matrix-valued kernels and are
// NOT computed here -- they are the named sub-gap.
//
// KERNEL CONSTRUCTION
// -------------------
// zeta_K(s) = sum_{n>=1} a_K(n) n^{-s},  a_K(n) = #{integral ideals of norm n}
//           = sum_{d | n} chi_D(d),   chi_D = Kronecker symbol (D | .).
// (Imaginary quadratic: zeta_K(s) = zeta(s) L(s, chi_D), so the ideal-counting
//  function a_K = 1 * chi_D as a Dirichlet convolution.)
//
// With (2pi)^{-s} Gamma(s) = int_0^inf e^{-2pi y} y^{s-1} dy and the |D|^{s/2}
// prefactor absorbed by the substitution y -> w / sqrt(|D|):
//
//   Lambda_K(s) = int_0^inf f_K(w) w^{s-1} dw,
//   f_K(w) = sum_{n>=1} a_K(n) exp(-2 pi n w / sqrt(|D|)).
//
// Substituting w = e^u and centering at s = 1/2 + it gives the inverse-Mellin
// Fourier kernel (centered at c = 1/2 by the functional equation):
//
//   Phi_K(u) = e^{u/2} * sum_{n>=1} a_K(n) exp(-2 pi n e^u / sqrt(|D|)).
//
// SCALE INVARIANCE OF THE MARGIN
// ------------------------------
// The margin = HS_bound/op_norm is invariant under Phi -> c*Phi (both I_0, J_a
// and the kernel Phi(x)Phi(y)sinh scale as Phi^2). So the overall gamma/|D|
// NORMALIZATION constant does not affect the margin -- only the SHAPE of Phi
// (decay rate set by sqrt(|D|) and the a_K(n) pattern) matters. This makes the
// margin a robust diagnostic independent of prefactor conventions.
//
// THE HS BOUND (same as imp-1267 / imp-1317)
// ------------------------------------------
//   V_{a,Phi_K} f(x) = int_0^x Phi_K(x) Phi_K(y) sinh(a(x-y)) f(y) dy,
//   ||V||_op <= ||V||_HS <= sqrt(I_0 * J_a),
//   I_0 = int_0^inf Phi_K(u)^2 du,  J_a = int_0^inf Phi_K(u)^2 sinh^2(a u) du.

import { performance } from 'node:perf_hooks';

const TWO_PI = 2 * Math.PI;

// ── Kronecker symbol (D | n) ────────────────────────────────────────────────
// Standard algorithm (Cohen 1993, Alg. 1.4.10). D is a fundamental discriminant.
function kronecker(a, n) {
  if (n === 0) return a === 1 || a === -1 ? 1 : 0;
  if (a === 0) return Math.abs(n) === 1 ? 1 : 0;
  // (a | 2) table via a mod 8
  const tab2 = [0, 1, 0, -1, 0, -1, 0, 1];
  let result = 1;
  let nn = n;
  let aa = a;
  if (nn < 0) {
    nn = -nn;
    if (aa < 0) result = -result;
  }
  // remove factors of 2 from nn
  while (nn % 2 === 0) {
    nn = nn / 2;
    result *= tab2[((aa % 8) + 8) % 8];
  }
  // now nn is odd and positive; ordinary Jacobi symbol (aa | nn)
  aa = ((aa % nn) + nn) % nn;
  while (aa !== 0) {
    while (aa % 2 === 0) {
      aa = aa / 2;
      result *= tab2[((nn % 8) + 8) % 8];
    }
    // swap (quadratic reciprocity)
    const t = aa; aa = nn; nn = t;
    if (aa % 4 === 3 && nn % 4 === 3) result = -result;
    aa = aa % nn;
  }
  return nn === 1 ? result : 0;
}

// a_K(n) = sum_{d | n} chi_D(d),  chi_D(d) = kronecker(D, d)
function idealCounts(D, N) {
  const a = new Float64Array(N + 1);
  for (let n = 1; n <= N; n++) {
    let s = 0;
    for (let d = 1; d <= n; d++) {
      if (n % d === 0) s += kronecker(D, d);
    }
    a[n] = s;
  }
  return a;
}

// ── Volterra HS-bound + Galerkin op-norm machinery (mirrors imp-1317) ───────
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

function runField(D, aGrid) {
  const sqrtAbsD = Math.sqrt(Math.abs(D));
  const N_COEF = 120;                 // a_K(n) truncation (tail < 1e-18 for u>=0)
  const aK = idealCounts(D, N_COEF);

  const PhiK = (u) => {
    const eu = Math.exp(u);
    const halfU = 0.5 * u;
    let sum = 0;
    for (let n = 1; n <= N_COEF; n++) {
      const arg = halfU - TWO_PI * n * eu / sqrtAbsD;
      if (arg < -700) break;          // monotone in n; remaining terms underflow
      sum += aK[n] * Math.exp(arg);
    }
    return sum;
  };

  // L^2 integrals on [0, U_INF]
  const U_INF = 3.0, N_INF = 30000, H_INF = U_INF / N_INF;
  const phi2 = new Float64Array(N_INF), tinf = new Float64Array(N_INF);
  let phiMax = 0;
  for (let i = 0; i < N_INF; i++) {
    tinf[i] = (i + 0.5) * H_INF;
    const p = PhiK(tinf[i]);
    phi2[i] = p * p;
    if (Math.abs(p) > phiMax) phiMax = Math.abs(p);
  }
  let I0 = 0; for (let i = 0; i < N_INF; i++) I0 += phi2[i]; I0 *= H_INF;

  // Galerkin op-norm window
  const U_OP = 3.0, N_OP = 800, hOP = U_OP / N_OP;
  const tOp = new Float64Array(N_OP), phiOp = new Float64Array(N_OP);
  for (let i = 0; i < N_OP; i++) { tOp[i] = (i + 0.5) * hOP; phiOp[i] = PhiK(tOp[i]); }

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
  return { D, sqrtAbsD, N_COEF, U_INF, N_INF, U_OP, N_OP, phiMax, phi_at_0: PhiK(0), I0, rows, aK: Array.from(aK.slice(0, 13)) };
}

// ── Sweep ───────────────────────────────────────────────────────────────────
// Five small imaginary quadratic fields by fundamental discriminant D.
const FIELDS = [
  { D: -3,  label: 'Q(sqrt(-3))' },
  { D: -4,  label: 'Q(i)' },
  { D: -7,  label: 'Q(sqrt(-7))' },
  { D: -8,  label: 'Q(sqrt(-2))' },
  { D: -20, label: 'Q(sqrt(-5))' },
];
const A_GRID = [0.01, 0.05, 0.2];

const t0 = performance.now();
const results = [];
for (const f of FIELDS) {
  const r = runField(f.D, A_GRID);
  r.label = f.label;
  results.push(r);
  for (const row of r.rows) {
    console.error(
      `${f.label.padEnd(12)} D=${String(f.D).padStart(4)}  a=${row.a.toFixed(3)}` +
      `  I0=${row.I0.toExponential(3)}  Ja=${row.Ja.toExponential(3)}` +
      `  HS=${row.hs_bound.toExponential(3)}  op=${row.op_norm_galerkin.toExponential(3)}` +
      `  margin=${row.margin.toFixed(3)}x  holds=${row.hs_bound_holds}`
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
console.error(`# margin range [${marginMin.toFixed(3)}, ${marginMax.toFixed(3)}]  allHold=${allHold}  allSub2=${allSub2}`);

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  fields: FIELDS.map((f) => f.label),
  aGrid: A_GRID,
  results,
  marginMin, marginMax, allHold, allSub2,
}, null, 2));
