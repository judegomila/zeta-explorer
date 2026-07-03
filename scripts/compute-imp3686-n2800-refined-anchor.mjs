// compute-imp3686-n2800-refined-anchor.mjs
// imp-3686: close the named sub-gap sg-3663-log-vs-sqrt-fixed-pair.
// imp-3663 obtained the matched-pair anchor triple m*(1600)=360, m*(2000)=480,
// m*(2400)=560 for the FIXED lambda_5=lambda_6 third pair (pair index 3) but could
// NOT separate log from sqrt: the ~2.4-unit least-squares RMS gap sat below the
// +/-20 uncertainty of the 40-step Krylov sub-depth grid. This script measures a
// FOURTH homogeneous matched-pair anchor at N=2800 on a REFINED 20-step sub-depth
// grid (guarding the +/-20 quantisation down to +/-10), using the IDENTICAL
// imp-3505/imp-3575/imp-3596/imp-3602/imp-3625/imp-3663 skew-Toeplitz assembly
// Ttilde(u,v)=a(v-u)R(|v-u|) (NPHI=10, H0=0.025, midpoint quadrature, single
// full-reorthogonalization Lanczos). A single Lanczos to m_max is run and the top-6
// Gram Ritz values are read at the refined sub-depth grid (leading tridiagonal
// sub-blocks); m*(2800) is the minimal swept depth at which the third-pair splitting
// pair56 = |sigma_5-sigma_6|/sigma_5 locks below the machine floor.
// Offline only; results are BAKED into the data module as literals.

const NPHI = 10;
const A_LINEAR = 1.0;
const H0 = 0.025; // fixed grid step; N = U/H0 so U = N*H0
const MACHINE_FLOOR = 2e-14;

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

// --- fourth matched-pair anchor: N=2800, lambda_5=lambda_6 (pair index 3),
//     REFINED 20-step sub-depth grid guarding the imp-3663 +/-20 quantisation ------
const RUN = { N: 2800, mMax: 720, subdepths: [560, 580, 600, 620, 640, 660, 680, 700, 720] };

const { N, mMax, subdepths } = RUN;
const U = N * H0;
console.error(`building Ttilde at N=${N} (U=${U}) ...`);
const t0 = Date.now();
const T = buildTtilde(A_LINEAR, U, N);
console.error(`  built in ${((Date.now() - t0) / 1000).toFixed(1)} s; Lanczos to m=${mMax} ...`);
const { diag, off } = lanczosTridiag(T, N, mMax);
console.error(`  Lanczos done in ${((Date.now() - t0) / 1000).toFixed(1)} s; diag length ${diag.length}`);
const rows = [];
for (const m of subdepths) {
  const mm = Math.min(m, diag.length);
  const dsub = diag.slice(0, mm);
  const osub = off.slice(0, mm - 1);
  const ev = jacobiTridiagSpectrum(dsub, osub, mm);
  const l1 = ev[0];
  const l5 = ev[4];
  const l6 = ev[5];
  const s5 = Math.sqrt(l5);
  const s6 = Math.sqrt(l6);
  const pair56 = Math.abs(s5 - s6) / s5;
  const sigma2 = l5 / l1;
  rows.push({ m: mm, lambda1: l1, lambda5: l5, lambda6: l6, pair56, sigma2 });
  console.error(`    N=${N} m=${mm} pair56=${pair56.toExponential(4)} sigma2=${sigma2.toFixed(12)}`);
}
let mStar = null;
for (let i = 0; i < rows.length; i++) {
  if (rows[i].pair56 < MACHINE_FLOOR && rows.slice(i).every((r) => r.pair56 < MACHINE_FLOOR)) {
    mStar = rows[i].m;
    break;
  }
}
console.log(JSON.stringify({ machineFloor: MACHINE_FLOOR, h0: H0, nphi: NPHI, N, U, pairIndex: 3, pair: 'lambda_5=lambda_6', mMax, mStar, rows }, null, 2));
