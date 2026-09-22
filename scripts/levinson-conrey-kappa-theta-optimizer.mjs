#!/usr/bin/env node
// Levinson–Conrey one-piece mollified-second-moment optimizer.
//
// Functional (Conrey 1989, Theorem 2; quoted as Bui–Conrey–Young 2011 eq. (3.2)):
//   c(P,Q,R,θ) = 1 + (1/θ) ∫_0^1 ∫_0^1 e^{2Rv} ( Q(v)P'(u) + θ Q'(v) P(u) + θ R Q(v) P(u) )^2 du dv
//   κ ≥ 1 − (1/R) log c        (Conrey 1989 / Levinson 1974; PRZZ 2020 eq. (1.2))
// with P(0)=0, P(1)=1, Q(0)=1, Q'(v)=Q'(1−v).  Admissible unconditionally for θ < 4/7
// (Conrey 1989 via Deshouillers–Iwaniec).  For θ ≥ 4/7 the formula is CONJECTURAL
// (Farmer's "θ = ∞" program); we evaluate it there only to price what a longer mollifier
// would buy.
//
// Method: c is a quadratic form in the P-coefficients for fixed Q (and vice versa),
// so alternate exact least-squares solves (KKT-free: constraints are built into the
// bases), then 1-D golden search over R.  Gauss–Legendre quadrature (n=40 per axis)
// integrates the polynomial×exp integrand to ~1e-14.
//
// Usage: node scripts/levinson-conrey-kappa-theta-optimizer.mjs

function gaussLegendre(n) {
  // nodes/weights on [-1,1] via Newton on P_n, then map to [0,1]
  const x = new Array(n), w = new Array(n);
  for (let i = 0; i < n; i++) {
    let z = Math.cos(Math.PI * (i + 0.75) / (n + 0.5));
    for (let it = 0; it < 100; it++) {
      let p0 = 1, p1 = z;
      for (let k = 2; k <= n; k++) { const p2 = ((2 * k - 1) * z * p1 - (k - 1) * p0) / k; p0 = p1; p1 = p2; }
      const dp = n * (z * p1 - p0) / (z * z - 1);
      const dz = p1 / dp; z -= dz;
      if (Math.abs(dz) < 1e-15) break;
    }
    let p0 = 1, p1 = z;
    for (let k = 2; k <= n; k++) { const p2 = ((2 * k - 1) * z * p1 - (k - 1) * p0) / k; p0 = p1; p1 = p2; }
    const dp = n * (z * p1 - p0) / (z * z - 1);
    x[i] = 0.5 * (z + 1); w[i] = 1 / ((1 - z * z) * dp * dp);
  }
  return { x, w };
}

// P basis: phi_0 = u (fixed, carries P(1)=1), phi_k = u^{k+1} - u for k=1..dP-1 (vanish at 0,1)
function pBasis(u, dP) {
  const v = [u], d = [1];
  for (let k = 2; k <= dP; k++) { v.push(Math.pow(u, k) - u); d.push(k * Math.pow(u, k - 1) - 1); }
  return { v, d };
}
// Q basis: psi_0 = 1 (fixed, carries Q(0)=1), psi_k = (1-2v)^{2k-1} - 1 for k=1..dQ (vanish at 0, Q' symmetric)
function qBasis(v, dQ) {
  const val = [1], der = [0];
  const t = 1 - 2 * v;
  for (let k = 1; k <= dQ; k++) { const m = 2 * k - 1; val.push(Math.pow(t, m) - 1); der.push(-2 * m * Math.pow(t, m - 1)); }
  return { val, der };
}

function solveSymmetric(A, b) {
  // Gaussian elimination with partial pivoting
  const n = b.length, M = A.map((r, i) => [...r, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c; for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = c + 1; r < n; r++) { const f = M[r][c] / M[c][c]; for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k]; }
  }
  const x = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r--) { let s = M[r][n]; for (let k = r + 1; k < n; k++) s -= M[r][k] * x[k]; x[r] = s / M[r][r]; }
  return x;
}

const GL = gaussLegendre(40);

// Evaluate c(P,Q,R,θ) for coefficient vectors p (length dP, p[0]=1 fixed) and q (length dQ+1, q[0]=1 fixed)
export function cFunctional(p, q, R, theta) {
  const dP = p.length, dQ = q.length - 1;
  let I = 0;
  for (let j = 0; j < GL.x.length; j++) {
    const v = GL.x[j], wv = GL.w[j] * Math.exp(2 * R * v);
    const qb = qBasis(v, dQ);
    let Q = 0, Qp = 0; for (let k = 0; k <= dQ; k++) { Q += q[k] * qb.val[k]; Qp += q[k] * qb.der[k]; }
    for (let i = 0; i < GL.x.length; i++) {
      const u = GL.x[i], pb = pBasis(u, dP);
      let P = 0, Pp = 0; for (let k = 0; k < dP; k++) { P += p[k] * pb.v[k]; Pp += p[k] * pb.d[k]; }
      const F = Q * Pp + theta * Qp * P + theta * R * Q * P;
      I += GL.w[i] * wv * F * F;
    }
  }
  return 1 + I / theta;
}

// Exact minimisation over free P-coefficients for fixed Q (linear least squares)
function bestP(q, R, theta, dP) {
  const dQ = q.length - 1, nf = dP - 1; // free coefficients p[1..dP-1]
  const A = Array.from({ length: nf }, () => new Array(nf).fill(0)), b = new Array(nf).fill(0);
  for (let j = 0; j < GL.x.length; j++) {
    const v = GL.x[j], wv = GL.w[j] * Math.exp(2 * R * v);
    const qb = qBasis(v, dQ);
    let Q = 0, Qp = 0; for (let k = 0; k <= dQ; k++) { Q += q[k] * qb.val[k]; Qp += q[k] * qb.der[k]; }
    for (let i = 0; i < GL.x.length; i++) {
      const u = GL.x[i], pb = pBasis(u, dP), w = GL.w[i] * wv;
      const g = []; for (let k = 0; k < dP; k++) g.push(Q * pb.d[k] + theta * Qp * pb.v[k] + theta * R * Q * pb.v[k]);
      for (let a = 0; a < nf; a++) { b[a] -= w * g[a + 1] * g[0]; for (let c = 0; c < nf; c++) A[a][c] += w * g[a + 1] * g[c + 1]; }
    }
  }
  return nf ? [1, ...solveSymmetric(A, b)] : [1];
}
// Exact minimisation over free Q-coefficients for fixed P
function bestQ(p, R, theta, dQ) {
  const dP = p.length, nf = dQ;
  const A = Array.from({ length: nf }, () => new Array(nf).fill(0)), b = new Array(nf).fill(0);
  for (let j = 0; j < GL.x.length; j++) {
    const v = GL.x[j], wv = GL.w[j] * Math.exp(2 * R * v);
    const qb = qBasis(v, dQ);
    for (let i = 0; i < GL.x.length; i++) {
      const u = GL.x[i], pb = pBasis(u, dP), w = GL.w[i] * wv;
      let P = 0, Pp = 0; for (let k = 0; k < dP; k++) { P += p[k] * pb.v[k]; Pp += p[k] * pb.d[k]; }
      const g = []; for (let k = 0; k <= dQ; k++) g.push(qb.val[k] * Pp + theta * qb.der[k] * P + theta * R * qb.val[k] * P);
      for (let a = 0; a < nf; a++) { b[a] -= w * g[a + 1] * g[0]; for (let c = 0; c < nf; c++) A[a][c] += w * g[a + 1] * g[c + 1]; }
    }
  }
  return nf ? [1, ...solveSymmetric(A, b)] : [1];
}

export function optimizePQ(R, theta, dP, dQ, iters = 40) {
  let p = [1, ...new Array(Math.max(dP - 1, 0)).fill(0)], q = [1, ...new Array(dQ).fill(0)];
  if (dQ >= 1) q[1] = 0.5; // start near Q = 1 - x  ( (1-2v) - 1 = -2v ; 1 + 0.5*(-2v) = 1 - v )
  let c = Infinity;
  for (let it = 0; it < iters; it++) {
    p = bestP(q, R, theta, dP);
    q = bestQ(p, R, theta, dQ);
    const cn = cFunctional(p, q, R, theta);
    if (Math.abs(c - cn) < 1e-13) { c = cn; break; }
    c = cn;
  }
  return { p, q, c, kappa: 1 - Math.log(c) / R };
}

export function optimizeKappa(theta, dP, dQ) {
  // golden-section on R in [0.3, 6]
  let a = 0.3, b = 6.0;
  const f = (R) => optimizePQ(R, theta, dP, dQ).kappa;
  const gr = (Math.sqrt(5) - 1) / 2;
  let c = b - gr * (b - a), d = a + gr * (b - a), fc = f(c), fd = f(d);
  for (let it = 0; it < 40; it++) {
    if (fc > fd) { b = d; d = c; fd = fc; c = b - gr * (b - a); fc = f(c); }
    else { a = c; c = d; fc = fd; d = a + gr * (b - a); fd = f(d); }
    if (b - a < 1e-7) break;
  }
  const R = (a + b) / 2, res = optimizePQ(R, theta, dP, dQ);
  return { theta, R, ...res };
}

const isMain = process.argv[1] && process.argv[1].endsWith('levinson-conrey-kappa-theta-optimizer.mjs');
if (isMain) {
  const fmt = (x, n = 6) => Number(x).toFixed(n);
  console.log('== Reproductions ==');
  // Levinson 1974: P=x, Q=1-x, θ=1/2, optimise R only
  {
    let best = { kappa: -1 };
    for (let R = 0.5; R <= 3; R += 0.001) { const c = cFunctional([1], [1, 0.5], R, 0.5); const k = 1 - Math.log(c) / R; if (k > best.kappa) best = { kappa: k, R, c }; }
    console.log(`Levinson (P=x,Q=1-x,θ=1/2): κ=${fmt(best.kappa)} at R=${fmt(best.R, 3)} c=${fmt(best.c)}  [Levinson 1974: 0.3474]`);
  }
  for (const [dP, dQ] of [[1, 1], [5, 3], [8, 5]]) {
    const r = optimizeKappa(0.5, dP, dQ);
    console.log(`θ=1/2 dP=${dP} dQ=${dQ}: κ=${fmt(r.kappa)} R=${fmt(r.R, 4)}  [Conrey 1989 θ=1/2 record 0.36581]`);
  }
  for (const [dP, dQ] of [[5, 3], [8, 5], [12, 8]]) {
    const r = optimizeKappa(4 / 7, dP, dQ);
    console.log(`θ=4/7 dP=${dP} dQ=${dQ}: κ=${fmt(r.kappa)} R=${fmt(r.R, 4)}  [Conrey 1989: 0.4088]`);
  }
  console.log('\n== κ(θ) curve, one-piece Conrey functional, dP=8 dQ=5 (θ ≥ 4/7 rows are CONJECTURAL: formula unproved there) ==');
  const thetas = [0.1, 0.25, 1 / 3, 0.5, 17 / 33, 6 / 11, 4 / 7, 0.6, 2 / 3, 0.75, 0.8, 0.9, 1.0, 1.1, 1.2, 1.25, 1.3, 1.4, 1.5, 1.75, 2, 2.5, 3, 4, 5, 8, 12, 20];
  const rows = [];
  for (const th of thetas) { const r = optimizeKappa(th, 8, 5); rows.push(r); console.log(`θ=${fmt(th, 4)}  κ=${fmt(r.kappa)}  R=${fmt(r.R, 4)}  c=${fmt(r.c)}`); }
  // θ needed to reach a target κ (bisection on the monotone curve)
  const kappaAt = (th) => optimizeKappa(th, 8, 5).kappa;
  for (const target of [0.45, 0.5, 0.6, 0.6725, 0.75, 0.9]) {
    let lo = 0.3, hi = 30;
    for (let it = 0; it < 40; it++) { const mid = (lo + hi) / 2; if (kappaAt(mid) < target) lo = mid; else hi = mid; if (hi - lo < 1e-4) break; }
    console.log(`θ needed for κ ≥ ${target}: ${fmt((lo + hi) / 2, 4)}`);
  }
  // local slope at 4/7
  const k1 = kappaAt(4 / 7 - 0.005), k2 = kappaAt(4 / 7 + 0.005);
  console.log(`dκ/dθ at θ=4/7 ≈ ${fmt((k2 - k1) / 0.01, 4)}`);
  console.log(JSON.stringify(rows.map((r) => ({ theta: r.theta, kappa: Number(r.kappa.toFixed(6)), R: Number(r.R.toFixed(4)) }))));
}
