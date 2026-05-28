#!/usr/bin/env node
// imp-1207: App S adaptive-patch-refinement conditioning stress test.
//
// App S of the v52 paper (research-inputs/twin_ladder_consolidated_v52.pdf)
// reports that the central-band adaptive patch refinement SUCCEEDS at a = 0.025
// but hits a CONDITIONING BARRIER at a = 0.010. This script reproduces that
// behaviour with an explicit, deterministic model of the refinement Gram matrix
// and tabulates, per a in {0.05, 0.025, 0.015, 0.010, 0.005}:
//   - the 2-norm conditioning number cond_2(M_a) = lambda_max / lambda_min
//   - a refinement-pass status (pass iff cond < COND_PASS_THRESHOLD)
//   - a per-row verdict
//
// MODEL OF THE CENTRAL-BAND PATCH
// -------------------------------
// The App S refinement fits the de Bruijn-Newman kernel Phi on the central band
// [0, L] in the basis f_k(t) = (sinh(a t))^k, k = 0..d. The patch Gram matrix is
//
//     M_a[k][l] = integral_0^L Phi(t)^2 (sinh(a t))^{k+l} dt        (k, l = 0..d)
//
// (a symmetric Hankel/moment matrix). As a -> 0, sinh(a t) ~ a t, so the basis
// functions become near-collinear and the diagonal entries span ~a^{2k} across
// k — a scaled Hilbert/moment matrix whose conditioning blows up like a power of
// 1/a. This is a faithful, reproducible surrogate for the "central-band
// conditioning barrier" App S reports: the refinement linear solve loses all
// significant digits once cond_2 exceeds the double-precision usable limit.
//
// HONEST SCOPE
// ------------
//   - This is a NUMERICAL surrogate for App S's refinement conditioning, NOT a
//     transcription of App S's exact patch operator (the PDF gives the qualitative
//     a=0.025-pass / a=0.010-barrier behaviour; the matrix here is our model).
//   - cond_2 is computed from the full symmetric spectrum via the cyclic Jacobi
//     eigenvalue method (exact for small symmetric matrices to machine precision).
//   - The integral is evaluated by composite Simpson on N_QUAD nodes; Phi is the
//     de Bruijn-Newman kernel truncated at n=10.
//
// Output: JSON to stdout with rows {a, cond, refinementPass, verdict}.

import { performance } from 'node:perf_hooks';

// -- de Bruijn-Newman Phi kernel (truncated at n=10) -------------------------
const N_PHI = 10;
function Phi(u) {
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

// -- composite Simpson integral of g on [0, L] -------------------------------
function simpson(g, L, nIntervals) {
  // nIntervals must be even.
  const n = nIntervals % 2 === 0 ? nIntervals : nIntervals + 1;
  const h = L / n;
  let s = g(0) + g(L);
  for (let i = 1; i < n; i++) {
    s += (i % 2 === 1 ? 4 : 2) * g(i * h);
  }
  return (h / 3) * s;
}

// -- central-band patch Gram matrix M_a (size (d+1) x (d+1)) ------------------
const L_BAND = 1.0;      // central-band half-width on which Phi is fit
const DEGREE = 5;        // basis f_k = (sinh(a t))^k, k = 0..DEGREE
const N_QUAD = 2000;     // Simpson intervals
function buildGram(a) {
  const D = DEGREE + 1;
  const M = Array.from({ length: D }, () => new Float64Array(D));
  // M[k][l] = integral Phi(t)^2 (sinh(a t))^{k+l} dt depends only on p = k + l.
  const moments = new Float64Array(2 * DEGREE + 1);
  for (let p = 0; p <= 2 * DEGREE; p++) {
    moments[p] = simpson((t) => {
      const ph = Phi(t);
      return ph * ph * Math.pow(Math.sinh(a * t), p);
    }, L_BAND, N_QUAD);
  }
  for (let k = 0; k < D; k++) {
    for (let l = 0; l < D; l++) {
      M[k][l] = moments[k + l];
    }
  }
  return M;
}

// -- cyclic Jacobi eigenvalues of a symmetric matrix -------------------------
function jacobiEigenvalues(Ain, maxSweeps = 100, tol = 1e-300) {
  const n = Ain.length;
  const A = Ain.map((row) => Float64Array.from(row));
  for (let sweep = 0; sweep < maxSweeps; sweep++) {
    // off-diagonal Frobenius norm
    let off = 0;
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
    }
    if (off <= tol) break;
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        if (A[p][q] === 0) continue;
        const app = A[p][p];
        const aqq = A[q][q];
        const apq = A[p][q];
        const theta = (aqq - app) / (2 * apq);
        const t = Math.sign(theta || 1) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let i = 0; i < n; i++) {
          const aip = A[i][p];
          const aiq = A[i][q];
          A[i][p] = c * aip - s * aiq;
          A[i][q] = s * aip + c * aiq;
        }
        for (let i = 0; i < n; i++) {
          const api = A[p][i];
          const aqi = A[q][i];
          A[p][i] = c * api - s * aqi;
          A[q][i] = s * api + c * aqi;
        }
      }
    }
  }
  const eig = new Float64Array(n);
  for (let i = 0; i < n; i++) eig[i] = A[i][i];
  return Array.from(eig);
}

// -- sweep -------------------------------------------------------------------
const A_GRID = [0.05, 0.025, 0.015, 0.010, 0.005];
const COND_PASS_THRESHOLD = 1e12; // double-precision usable-digit limit

const rows = [];
console.error(`# imp-1207 App S conditioning stress test — degree=${DEGREE}, L=${L_BAND}`);
const startAll = performance.now();
for (const a of A_GRID) {
  const t0 = performance.now();
  const M = buildGram(a);
  const eig = jacobiEigenvalues(M).map((x) => Math.abs(x)).sort((x, y) => x - y);
  const lambdaMin = eig[0];
  const lambdaMax = eig[eig.length - 1];
  const cond = lambdaMin > 0 ? lambdaMax / lambdaMin : Infinity;
  const refinementPass = cond < COND_PASS_THRESHOLD;
  let verdict;
  if (refinementPass) verdict = 'refinement-converges';
  else if (cond < 1e15) verdict = 'conditioning-barrier';
  else verdict = 'singular-patch';
  const dt = performance.now() - t0;
  rows.push({ a, cond, lambdaMin, lambdaMax, refinementPass, verdict });
  console.error(`  a=${a.toFixed(3)}  cond=${cond.toExponential(4)}  pass=${refinementPass}  ${verdict}  (${dt.toFixed(0)} ms)`);
}
const totalMs = performance.now() - startAll;

const nPass = rows.filter((r) => r.refinementPass).length;
const aPassMax = Math.max(...rows.filter((r) => r.refinementPass).map((r) => r.a), -Infinity);
const aFailMax = Math.max(...rows.filter((r) => !r.refinementPass).map((r) => r.a), -Infinity);

const output = {
  generatedAt: new Date().toISOString(),
  meta: {
    degree: DEGREE,
    L_band: L_BAND,
    N_quad: N_QUAD,
    N_phi_truncation: N_PHI,
    condPassThreshold: COND_PASS_THRESHOLD,
    a_grid: A_GRID,
    totalMs,
  },
  rows,
  summary: {
    nRows: rows.length,
    nPass,
    aPassMax,
    aFailMax,
    verdict: nPass > 0 && nPass < rows.length ? 'barrier-between-pass-and-fail' :
             nPass === rows.length ? 'all-pass' : 'all-fail',
  },
};

console.log(JSON.stringify(output, null, 2));
