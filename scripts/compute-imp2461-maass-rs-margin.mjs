#!/usr/bin/env node
// imp-2461: Volterra contraction-margin sweep on the DEGREE-4 MAASS Rankin-Selberg
// convolution L(s, f x g) for the level-1 real-analytic SL(2,Z) Maass cusp form.
//
// PURPOSE
// -------
// imp-2421 swept the V-margin on HOLOMORPHIC x HOLOMORPHIC Rankin-Selberg pairs
// (two complex gamma factors -> scalar K-Bessel kernel y^m K_nu) and found the
// Cauchy-Schwarz slack margin = HS_bound/op_norm edged JUST OVER 2 at the largest
// weight gap (F20 x Delta, margin ~2.00). The Maass-RS / exact-2 boundary was
// named OPEN (imp-2421 sub-gap (i)). This script settles the MAASS direction.
//
// THE KEY STRUCTURAL POINT: MAASS x MAASS RS = PRODUCT OF TWO IMAGINARY-ORDER
// K-BESSELS K_{iR1} * K_{iR2}
// --------------------------------------------------------------------------
// For two even self-dual level-1 Maass forms f, g with spectral parameters
// R1, R2 (Laplace eigenvalue 1/4 + R^2), the completed Rankin-Selberg
// L-function Lambda(s, f x g) (functional equation s -> 1-s, central c = 1/2)
// has archimedean factor a PRODUCT of FOUR real gamma factors at the spectral
// combinations +-i(R1+R2), +-i(R1-R2):
//   gamma(s) = Gamma_R(s+i(R1+R2)) Gamma_R(s+i(R1-R2))
//              Gamma_R(s-i(R1-R2)) Gamma_R(s-i(R1+R2)),
//   Gamma_R(s) = pi^{-s/2} Gamma(s/2).
// The classical Mellin transform of a PRODUCT of two K-Bessels (Gradshteyn-
// Ryzhik 6.576.4) is exactly this four-gamma product:
//   int_0^inf K_mu(x) K_nu(x) x^{s-1} dx
//     = (2^{s-3}/Gamma(s)) Gamma((s+mu+nu)/2) Gamma((s+mu-nu)/2)
//                          Gamma((s-mu+nu)/2) Gamma((s-mu-nu)/2),
// so with mu = iR1, nu = iR2 the inverse-Mellin kernel of the degree-4 Maass-RS
// gamma factor is the SCALAR product G(y) = K_{iR1}(c sqrt y) K_{iR2}(c sqrt y),
// NOT a 2x2 matrix. (The 1/Gamma(s) twist is the zeta(2s) removed by the
// d^2-sum in the Rankin-Selberg coefficients, exactly as imp-2421.) This is the
// imaginary-order analogue of imp-2421s holomorphic y^m K_nu kernel and RESOLVES
// imp-2421 sub-gap (i) for the self-dual Maass case: a Maass-RS L-function still
// has a SCALAR (product-of-two-K-Bessel) kernel.
//
// KERNEL CONSTRUCTION
// -------------------
// Rankin-Selberg coefficients (analytic normalization, |a_f(p)| <= 2 Ramanujan-
// on-average) come from the unfolded inner product
//   sum_n a_f(n) a_g(n) n^{-s} = L(s, f x g) / zeta(2s),
// so b(n) = sum_{d^2|n} a_f(n/d^2) a_g(n/d^2). Centering at s = 1/2 + it
// (w = e^u) gives the even Fourier kernel
//   Phi(u) = e^{u/2} sum_{n>=1} b(n) K_{iR1}(4 pi sqrt(n e^u)) K_{iR2}(4 pi sqrt(n e^u)).
// (overall scale-invariant prefactors dropped; margin = HS/op is unchanged
// under Phi -> c Phi.) Lambda(s)=Lambda(1-s) gives Phi(-u)=Phi(u), so the
// Volterra operator lives on [0, inf) as in imp-2356 / imp-2421.
//
// ARITHMETIC ANCHOR (no fabricated eigenvalues)
// ---------------------------------------------
// Only ONE level-1 Maass form has in-repo tabulated Hecke data: the first even
// SL(2,Z) Maass form, R = 9.533695261353925, with a(1..6) from imp-2356
// (Hejhal/Then/LMFDB; a(1)=1, Hecke-multiplicative fill). The genuine
// ARITHMETIC Maass-RS pair is therefore the self-Rankin-Selberg f x f
// (= zeta(s) L(s, sym^2 f)), b(n) = sum_{d^2|n} a(n/d^2)^2, kernel K_{iR}^2.
// Distinct-form Maass pairs need a second forms eigenvalues -> SUB-GAP.
//
// ARCHIMEDEAN R-SWEEP (locate where the slack crosses 2)
// ------------------------------------------------------
// To map WHERE the Maass-RS slack crosses exactly 2 as a function of the
// spectral parameter we strip the arithmetic (b(n)=delta_{n,1}) and sweep the
// PURE archimedean envelope Phi_R(u) = e^{u/2} K_{iR}(4 pi e^{u/2})^2 over a grid
// of R. This is a kernel-SHAPE study: only R=9.5337 carries real Hecke data; the
// other R values probe the K_{iR}^2 archimedean factor alone.
//
// HS BOUND (same inequality as imp-1267 / imp-2356 / imp-2421)
// ------------------------------------------------------------
//   V_{a,Phi} f(x) = int_0^x Phi(x) Phi(y) sinh(a(x-y)) f(y) dy,
//   ||V||_op <= ||V||_HS <= sqrt(I_0 * J_a),
//   I_0 = int_0^inf Phi(u)^2 du,  J_a = int_0^inf Phi(u)^2 sinh^2(a u) du.

import { performance } from 'node:perf_hooks';

const TWO_PI = 2 * Math.PI;
const FOUR_PI = 4 * Math.PI;

// ── First even SL(2,Z) Maass form (imp-2356 data) ───────────────────────────
const R_SPEC = 9.533695261353925;
const A2 = 1.549304477;
const A3 = 0.246899772;
const A5 = 0.722110000;
const A_MAASS = Object.freeze([
  0,          // n=0 unused
  1,          // 1
  A2,         // 2
  A3,         // 3
  A2 * A2 - 1, // 4 = a(2)^2 - 1
  A5,         // 5
  A2 * A3,    // 6 = a(2)a(3)
]);
const N_MAASS = A_MAASS.length - 1; // = 6

// Self-RS coefficients b(n) = sum_{d^2|n} a(n/d^2)^2  (for n <= N_MAASS only).
function selfRSCoeffs(a, N) {
  const b = new Float64Array(N + 1);
  for (let n = 1; n <= N; n++) {
    let s = 0;
    for (let d = 1; d * d <= n; d++) {
      if (n % (d * d) === 0) {
        const m = n / (d * d);
        if (m <= N) s += a[m] * a[m];
      }
    }
    b[n] = s;
  }
  return b;
}

// ── K_{iR}(x): modified Bessel of IMAGINARY order via the cosine integral ────
// K_{iR}(x) = int_0^inf cos(R t) exp(-x cosh t) dt   (real, x > 0).
function Kir(R, x, nNodes = 8000) {
  if (x <= 0) return 0;
  const lim = 720 / x;
  const Tmax = lim > 1 ? Math.acosh(lim) : 0;
  if (Tmax <= 0) return 0;
  const h = Tmax / nNodes;
  let s = 0;
  for (let k = 0; k < nNodes; k++) {
    const t = (k + 0.5) * h;
    s += Math.cos(R * t) * Math.exp(-x * Math.cosh(t));
  }
  return s * h;
}

// ── Galerkin operator 2-norm via power iteration (mirrors imp-2356/2421) ─────
function operator2Norm(V, N, tol = 1e-10, maxIter = 2000) {
  let seed = 0x12345678;
  const rng = () => { seed = (seed * 1103515245 + 12345) & 0x7fffffff; return seed / 0x7fffffff; };
  let x = new Float64Array(N);
  for (let i = 0; i < N; i++) x[i] = rng() - 0.5;
  let nrm = 0; for (let i = 0; i < N; i++) nrm += x[i] * x[i]; nrm = Math.sqrt(nrm) || 1;
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

// ── Generic margin computation for an arbitrary even kernel Phi(u) ──────────
function marginForKernel(Phi, aGrid, opts = {}) {
  const U_INF = opts.U_INF ?? 2.5, N_INF = opts.N_INF ?? 4000;
  const U_OP = opts.U_OP ?? 2.5, N_OP = opts.N_OP ?? 600;
  const H_INF = U_INF / N_INF;
  const tinf = new Float64Array(N_INF), phi2 = new Float64Array(N_INF);
  let phiMax = 0;
  for (let i = 0; i < N_INF; i++) {
    tinf[i] = (i + 0.5) * H_INF;
    const p = Phi(tinf[i]);
    phi2[i] = p * p;
    if (Math.abs(p) > phiMax) phiMax = Math.abs(p);
  }
  let I0 = 0; for (let i = 0; i < N_INF; i++) I0 += phi2[i]; I0 *= H_INF;

  const hOP = U_OP / N_OP;
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
      for (let j = i + 1; j < N_OP; j++) row[j] = hOP * phiOp[i] * phiOp[j] * Math.sinh(a * (tOp[j] - tOp[i]));
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
  return { I0, phiMax, rows };
}

const A_GRID = [0.01, 0.05, 0.2];

// ── (1) ARITHMETIC ANCHOR: self-RS f x f of the first Maass form ────────────
const bSelf = selfRSCoeffs(A_MAASS, N_MAASS);
const PhiSelf = (u) => {
  const eu = Math.exp(u);
  let sum = 0;
  for (let n = 1; n <= N_MAASS; n++) {
    const arg = FOUR_PI * Math.sqrt(n * eu);
    if (arg > 720) continue;
    const k = Kir(R_SPEC, arg);
    sum += bSelf[n] * k * k;
  }
  return Math.exp(0.5 * u) * sum;
};
const t0 = performance.now();
const anchor = marginForKernel(PhiSelf, A_GRID, { U_INF: 2.5, N_INF: 4000, U_OP: 2.5, N_OP: 600 });
console.error('# imp-2461 ANCHOR: self-RS f x f, R = ' + R_SPEC);
console.error('#   b(1..6) = ' + Array.from(bSelf.slice(1)).map((x) => x.toFixed(4)).join(', '));
for (const r of anchor.rows) {
  console.error(
    '  a=' + r.a.toFixed(3) + '  I0=' + r.I0.toExponential(3) + '  Ja=' + r.Ja.toExponential(3) +
    '  HS=' + r.hs_bound.toExponential(3) + '  op=' + r.op_norm_galerkin.toExponential(3) +
    '  margin=' + r.margin.toFixed(4) + 'x  holds=' + r.hs_bound_holds
  );
}

// ── (2) ARCHIMEDEAN R-SWEEP: pure K_{iR}^2 envelope, locate margin = 2 ──────
// R <= 25 only: for R >~ 28 the K_{iR}(4 pi e^{u/2})^2 envelope is suppressed by
// ~exp(-pi R) and underflows double precision (op_norm < 1e-80), making the margin
// a numerical artifact (non-monotone). The reliable window is R in [4, 25].
const R_GRID = [4, 6, 8, 9.533695261353925, 11, 12, 13, 14, 15, 16, 18, 20, 25];
const archRows = [];
for (const R of R_GRID) {
  const Phi = (u) => {
    const arg = FOUR_PI * Math.exp(0.5 * u);
    if (arg > 720) return 0;
    const k = Kir(R, arg);
    return Math.exp(0.5 * u) * k * k;
  };
  // margin is essentially flat in a (kernel-shape dominated); use a = 0.05.
  const res = marginForKernel(Phi, [0.05], { U_INF: 3.0, N_INF: 4000, U_OP: 3.0, N_OP: 600 });
  const row = res.rows[0];
  archRows.push({ R, margin: row.margin, op_norm: row.op_norm_galerkin, hs_bound: row.hs_bound, hs_bound_holds: row.hs_bound_holds });
  console.error('  R=' + String(R).padEnd(8) + ' margin=' + row.margin.toFixed(4) + 'x  op=' + row.op_norm_galerkin.toExponential(3) + '  holds=' + row.hs_bound_holds);
}

// linear-interpolate the crossing R* where margin = 2 (first up-crossing).
let crossingR = null;
for (let i = 1; i < archRows.length; i++) {
  const a = archRows[i - 1], b = archRows[i];
  if ((a.margin - 2) * (b.margin - 2) < 0) {
    const t = (2 - a.margin) / (b.margin - a.margin);
    crossingR = a.R + t * (b.R - a.R);
    break;
  }
}
console.error('# total ' + (performance.now() - t0).toFixed(0) + ' ms');
console.error('# margin-2 crossing R* = ' + (crossingR === null ? 'none in grid' : crossingR.toFixed(3)));

const anchorMargins = anchor.rows.map((r) => r.margin);
const anchorMaxOp = Math.max(...anchor.rows.map((r) => r.op_norm_galerkin));

console.log(JSON.stringify({
  generatedAt: new Date().toISOString(),
  form: 'first even SL(2,Z) Maass cusp form, self Rankin-Selberg f x f',
  R_SPEC, N_MAASS,
  b_self_1_to_6: Array.from(bSelf.slice(1)),
  anchor: { I0: anchor.I0, phiMax: anchor.phiMax, rows: anchor.rows },
  anchorMarginRange: [Math.min(...anchorMargins), Math.max(...anchorMargins)],
  anchorMaxOpNorm: anchorMaxOp,
  archimedeanRSweep: archRows,
  marginTwoCrossingR: crossingR,
}, null, 2));
