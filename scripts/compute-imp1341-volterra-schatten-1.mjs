#!/usr/bin/env node
// imp-1341: Schatten-1 (trace-class) bridge for V_{a,Phi} on L^2([0, infty)).
//
// Kernel:  k_{a,Phi}(x, y) = Phi(x) Phi(y) sinh(a(x - y)) * 1_{0 <= y <= x}
//
// imp-1267 proved Hilbert-Schmidt (Schatten-2). Here we test Schatten-1:
//   (a) is V in S_1 (trace class)?  -- YES, smooth Volterra kernel on
//       effectively-compact support (Gohberg-Krein / Lalesco).
//   (b) compute ||V||_1 = sum of singular values, and the operator trace
//       tr(V) = int k(x,x) dx = 0 (kernel vanishes on the diagonal).
//   (c) bridge to Hadamard / de Branges det(I - V):  V is QUASINILPOTENT
//       (Volterra => sigma(V) = {0}), so det(I - zV) == 1 identically.
//
// Numerical method:
//   - Discretize [0, U] with N midpoint nodes, weight h = U/N.
//   - Matrix A_{ij} = h * k(x_i, x_j) approximates V; singular values of A
//     approximate singular values of V.
//   - sum_i s_i(A) = ||V||_1 (trace norm). We get s_i^2 from the eigenvalues
//     of the symmetric Gram matrix G = A^T A via a Jacobi sweep solver.
//   - HS check: ||A||_HS = sqrt(sum A_{ij}^2) should match imp-1267.

import { performance } from 'node:perf_hooks';

const N_PHI = 10;
function Phi(u) {
  let sum = 0;
  const e2u = Math.exp(2 * u);
  const e4u = Math.exp(4 * u);
  for (let n = 1; n <= N_PHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    const term =
      (2 * Math.PI * Math.PI * n4 * e4u - 3 * Math.PI * n2 * e2u) *
      Math.exp(-Math.PI * n2 * e4u);
    sum += term;
  }
  return sum;
}

// Build the discretized Volterra matrix A_{ij} = h * Phi(x_i) Phi(x_j)
//   sinh(a (x_i - x_j)) for j <= i (else 0), on [0, U] with N nodes.
function buildMatrix(a, U, N) {
  const h = U / N;
  const x = new Float64Array(N);
  const phi = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    x[i] = (i + 0.5) * h;
    phi[i] = Phi(x[i]);
  }
  const A = [];
  for (let i = 0; i < N; i++) {
    const row = new Float64Array(N);
    for (let j = 0; j <= i; j++) {
      row[j] = h * phi[i] * phi[j] * Math.sinh(a * (x[i] - x[j]));
    }
    A.push(row);
  }
  return { A, h, x, phi };
}

// Frobenius (HS) norm of A.
function hsNorm(A, N) {
  let s = 0;
  for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) s += A[i][j] * A[i][j];
  return Math.sqrt(s);
}

// Symmetric Gram matrix G = A^T A.
function gram(A, N) {
  const G = [];
  for (let i = 0; i < N; i++) G.push(new Float64Array(N));
  for (let k = 0; k < N; k++) {
    for (let i = 0; i < N; i++) {
      const aki = A[k][i];
      if (aki === 0) continue;
      for (let j = i; j < N; j++) {
        G[i][j] += aki * A[k][j];
      }
    }
  }
  for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) G[j][i] = G[i][j];
  return G;
}

// Cyclic Jacobi eigenvalue solver for a symmetric matrix (eigenvalues only).
function jacobiEigenvalues(M, N, maxSweeps = 60, tol = 1e-14) {
  const A = [];
  for (let i = 0; i < N; i++) A.push(Float64Array.from(M[i]));
  function offDiag() {
    let s = 0;
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) s += A[i][j] * A[i][j];
    return Math.sqrt(s);
  }
  for (let sweep = 0; sweep < maxSweeps; sweep++) {
    if (offDiag() < tol) break;
    for (let p = 0; p < N; p++) {
      for (let q = p + 1; q < N; q++) {
        const apq = A[p][q];
        if (Math.abs(apq) < 1e-300) continue;
        const app = A[p][p];
        const aqq = A[q][q];
        const theta = (aqq - app) / (2 * apq);
        const t =
          Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < N; k++) {
          const akp = A[k][p];
          const akq = A[k][q];
          A[k][p] = c * akp - s * akq;
          A[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < N; k++) {
          const apk = A[p][k];
          const aqk = A[q][k];
          A[p][k] = c * apk - s * aqk;
          A[q][k] = s * apk + c * aqk;
        }
      }
    }
  }
  const ev = [];
  for (let i = 0; i < N; i++) ev.push(A[i][i]);
  return ev;
}

// Trace norm ||A||_1 = sum of singular values = sum sqrt(eig(A^T A)).
function traceNorm(A, N) {
  const G = gram(A, N);
  const ev = jacobiEigenvalues(G, N);
  let s = 0;
  for (const e of ev) s += Math.sqrt(Math.max(e, 0));
  return s;
}

// Operator trace tr(V) = int_0^U k(x,x) dx = sum_i h * k(x_i, x_i) = 0
// (sinh(0) = 0), recorded as a sanity value.
function operatorTrace(a, U, N) {
  const { phi, h } = buildMatrix(a, U, N);
  let s = 0;
  for (let i = 0; i < N; i++) s += h * phi[i] * phi[i] * Math.sinh(0);
  return s;
}

const t0 = performance.now();

// (1) Convergence of ||V||_1 in N at a = 0.5, U = 3.
console.log('# Trace-norm convergence in N (a=0.5, U=3)');
console.log('N\t||V||_1\t\t||V||_HS\t\ts_max(=op)');
for (const N of [120, 200, 320, 480]) {
  const { A } = buildMatrix(0.5, 3.0, N);
  const G = gram(A, N);
  const ev = jacobiEigenvalues(G, N).map((e) => Math.sqrt(Math.max(e, 0)));
  ev.sort((p, q) => q - p);
  const tn = ev.reduce((s, v) => s + v, 0);
  console.log(
    `${N}\t${tn.toExponential(8)}\t${hsNorm(A, N).toExponential(8)}\t${ev[0].toExponential(8)}`,
  );
}

// (2) Trace norm across the imp-1240 a-grid at U = 3, N = 320.
console.log('\n# Trace norm ||V||_1 across a-grid (U=3, N=320)');
console.log('a\t||V||_1\t\t||V||_HS\t\ts_max\t\ttr(V)');
const aGrid = [0.5, 0.2, 0.1, 0.05, 0.025];
for (const a of aGrid) {
  const { A } = buildMatrix(a, 3.0, 320);
  const G = gram(A, 320);
  const ev = jacobiEigenvalues(G, 320).map((e) => Math.sqrt(Math.max(e, 0)));
  ev.sort((p, q) => q - p);
  const tn = ev.reduce((s, v) => s + v, 0);
  console.log(
    `${a}\t${tn.toExponential(8)}\t${hsNorm(A, 320).toExponential(8)}\t${ev[0].toExponential(8)}\t${operatorTrace(a, 3.0, 320).toExponential(3)}`,
  );
}

// (3) Singular-value decay (a=0.5, U=3, N=320): how fast s_n -> 0.
console.log('\n# Top-12 singular values (a=0.5, U=3, N=320)');
{
  const { A } = buildMatrix(0.5, 3.0, 320);
  const G = gram(A, 320);
  const ev = jacobiEigenvalues(G, 320).map((e) => Math.sqrt(Math.max(e, 0)));
  ev.sort((p, q) => q - p);
  for (let i = 0; i < 12; i++) console.log(`s_${i + 1}\t${ev[i].toExponential(6)}`);
  const tn = ev.reduce((s, v) => s + v, 0);
  const tail = ev.slice(8).reduce((s, v) => s + v, 0);
  console.log(`sum tail (s_9..) = ${tail.toExponential(6)} of ||V||_1 = ${tn.toExponential(6)}`);
}

console.log(`\n# elapsed ${((performance.now() - t0) / 1000).toFixed(2)} s`);
