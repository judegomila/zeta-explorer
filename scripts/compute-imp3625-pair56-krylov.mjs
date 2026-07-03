// compute-imp3625-pair56-krylov.mjs
// imp-3625: does the imp-3602 lambda_5=lambda_6 pair-degeneracy loss at N=2000
// (pair56 2e-14 -> 1.01e-11) contract back toward 2e-14 as the reorthogonalized
// Krylov depth m grows (Krylov-limited), or does it FLOOR (genuine near-degeneracy
// splitting)?  Re-runs the IDENTICAL imp-3505/imp-3575/imp-3596 skew-Toeplitz
// assembly at N=2000, a single full-reorthogonalization Lanczos to m=640, reading
// off top-6 Gram Ritz values at sub-depths (leading tridiagonal sub-blocks).
// Offline only; results are BAKED into the data module as literals.

const NPHI = 10;
const A_LINEAR = 1.0;

function phiKernel(uu) {
  let s = 0;
  const e2 = Math.exp(2 * uu);
  const e4 = Math.exp(4 * uu);
  for (let n = 1; n <= NPHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

function vecNorm(x, n) {
  let s = 0;
  for (let i = 0; i < n; i++) s += x[i] * x[i];
  return Math.sqrt(s);
}

function buildTtilde(a, U, N) {
  const H = U / N;
  const u = new Array(N);
  const phi = new Array(N);
  for (let i = 0; i < N; i++) {
    u[i] = (i + 0.5) * H;
    phi[i] = phiKernel(u[i]);
  }
  const Rk = new Array(N).fill(0);
  for (let k = 0; k < N; k++) {
    let s = 0;
    for (let i = 0; i + k < N; i++) s += phi[i] * phi[i + k];
    Rk[k] = s * H;
  }
  const T = [];
  for (let i = 0; i < N; i++) {
    const r = new Float64Array(N);
    for (let j = 0; j < N; j++) {
      const k = Math.abs(j - i);
      r[j] = a * (u[j] - u[i]) * Rk[k] * H;
    }
    T.push(r);
  }
  return T;
}

function jacobiFullSpectrum(Ain, m) {
  const A = [];
  for (let i = 0; i < m; i++) A.push(Float64Array.from(Ain[i]));
  for (let sweep = 0; sweep < 200; sweep++) {
    let off = 0;
    for (let p = 0; p < m; p++) for (let q = p + 1; q < m; q++) off += A[p][q] * A[p][q];
    if (off < 1e-300) break;
    for (let p = 0; p < m; p++) {
      for (let q = p + 1; q < m; q++) {
        const apq = A[p][q];
        if (Math.abs(apq) < 1e-300) continue;
        const app = A[p][p];
        const aqq = A[q][q];
        const theta = (aqq - app) / (2 * apq);
        const sgn = theta >= 0 ? 1 : -1;
        const t = sgn / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < m; k++) {
          const akp = A[k][p];
          const akq = A[k][q];
          A[k][p] = c * akp - s * akq;
          A[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < m; k++) {
          const apk = A[p][k];
          const aqk = A[q][k];
          A[p][k] = c * apk - s * aqk;
          A[q][k] = s * apk + c * aqk;
        }
      }
    }
  }
  const ev = [];
  for (let i = 0; i < m; i++) ev.push(A[i][i]);
  ev.sort((x, y) => y - x);
  return ev;
}

function jacobiTridiagSpectrum(diag, off, m) {
  const A = [];
  for (let i = 0; i < m; i++) A.push(new Float64Array(m));
  for (let i = 0; i < m; i++) {
    A[i][i] = diag[i];
    if (i + 1 < m) {
      A[i][i + 1] = off[i];
      A[i + 1][i] = off[i];
    }
  }
  return jacobiFullSpectrum(A, m);
}

function applyGram(M, v, n) {
  const Mv = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let s = 0;
    const Mi = M[i];
    for (let j = 0; j < n; j++) s += Mi[j] * v[j];
    Mv[i] = s;
  }
  const out = new Float64Array(n);
  for (let j = 0; j < n; j++) {
    let s = 0;
    for (let i = 0; i < n; i++) s += M[i][j] * Mv[i];
    out[j] = s;
  }
  return out;
}

// Single Lanczos to mReq with FULL reorthogonalization; returns the full
// tridiagonal (diag, off). Shorter Krylov depths are leading sub-blocks.
function lanczosTridiag(M, n, mReq) {
  const m = Math.min(mReq, n);
  const basis = [];
  let vPrev = new Float64Array(n);
  let v = new Float64Array(n);
  for (let i = 0; i < n; i++) v[i] = Math.cos(0.17 * i + 0.4);
  const b0 = vecNorm(v, n);
  for (let i = 0; i < n; i++) v[i] /= b0;
  const diag = [];
  const off = [];
  let beta = 0;
  for (let j = 0; j < m; j++) {
    const w = applyGram(M, v, n);
    let alpha = 0;
    for (let i = 0; i < n; i++) alpha += w[i] * v[i];
    for (let i = 0; i < n; i++) w[i] -= alpha * v[i] + beta * vPrev[i];
    for (const uVec of basis) {
      let d = 0;
      for (let i = 0; i < n; i++) d += w[i] * uVec[i];
      for (let i = 0; i < n; i++) w[i] -= d * uVec[i];
    }
    let dv = 0;
    for (let i = 0; i < n; i++) dv += w[i] * v[i];
    for (let i = 0; i < n; i++) w[i] -= dv * v[i];
    diag.push(alpha);
    basis.push(v.slice());
    const bn = vecNorm(w, n);
    if (bn < 1e-13) break;
    off.push(bn);
    vPrev = v;
    v = new Float64Array(n);
    for (let i = 0; i < n; i++) v[i] = w[i] / bn;
    beta = bn;
  }
  return { diag, off };
}

// --- run at N=2000, single Lanczos to m=640, read top-6 Gram Ritz at sub-depths ---
const U = 50;
const N = 2000;
const M_MAX = 640;
const SUBDEPTHS = [440, 480, 560, 640];

console.error(`building Ttilde at N=${N} (U=${U}) ...`);
const t0 = Date.now();
const T = buildTtilde(A_LINEAR, U, N);
console.error(`  built in ${((Date.now() - t0) / 1000).toFixed(1)} s; running Lanczos to m=${M_MAX} ...`);
const { diag, off } = lanczosTridiag(T, N, M_MAX);
console.error(`  Lanczos done in ${((Date.now() - t0) / 1000).toFixed(1)} s; diag length ${diag.length}`);

const rows = [];
for (const m of SUBDEPTHS) {
  const mm = Math.min(m, diag.length);
  const dsub = diag.slice(0, mm);
  const osub = off.slice(0, mm - 1);
  const ev = jacobiTridiagSpectrum(dsub, osub, mm); // top Gram eigenvalues (lambda), descending
  const l1 = ev[0];
  const l5 = ev[4];
  const l6 = ev[5];
  const pair56 = Math.abs(l5 - l6) / l5; // relative lambda_5=lambda_6 splitting
  const sigma2 = l5 / l1; // second gap lambda_5/lambda_1
  rows.push({ m: mm, lambda1: l1, lambda5: l5, lambda6: l6, pair56, sigma2, logInvSigma2: -Math.log(sigma2) });
}

console.log(JSON.stringify({ N, U, M_MAX, imp3602_m440_pair56: 1.010245749617736e-11, imp3602_m440_sigma2: 0.999586510492813, rows }, null, 2));
