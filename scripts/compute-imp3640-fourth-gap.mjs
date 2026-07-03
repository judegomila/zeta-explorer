// compute-imp3640-fourth-gap.mjs
// imp-3640: MEASURE the FOURTH skew-Toeplitz gap sigma_4 = lambda_9/lambda_1
// (fifth-pair / first-pair Gram-Ritz ratio) across the N=160..2000 ladder and
// test the imp-3619 (j^2-1) amplitude-law prediction a_5/a_2=(25-1)/(4-1)=8.
// Re-runs the IDENTICAL imp-3505/imp-3575/imp-3602/imp-3619/imp-3625 skew-Toeplitz
// assembly Ttilde(u,v)=a(v-u)R(|v-u|) (NPHI=10, H0=0.025, midpoint) with a single
// full-reorthogonalization Lanczos at converged Krylov depth, reading off top-10
// Gram Ritz values. Offline only; results are BAKED into the data module as literals.

const NPHI = 10;
const A_LINEAR = 1.0;
const H0 = 0.025;

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

// per-N converged Krylov depth: deep enough for lambda_9 (fifth pair) at every rung.
// Grows with N (mind imp-3625 depth-vs-N under-resolution) but capped by N.
function depthFor(N) {
  if (N <= 400) return N;       // small rungs: full spectrum
  if (N <= 800) return 300;
  if (N <= 1200) return 420;
  return 560;                    // N in {1600,2000}: deep enough to resolve lambda_9=lambda_10
}

const LADDER = [160, 240, 320, 400, 480, 640, 800, 1000, 1200, 1600, 2000];
const rows = [];
for (const N of LADDER) {
  const U = N * H0;
  const mReq = depthFor(N);
  const t0 = Date.now();
  const T = buildTtilde(A_LINEAR, U, N);
  const { diag, off } = lanczosTridiag(T, N, mReq);
  const mFull = diag.length;
  // top-10 Ritz at full depth
  const ev = jacobiTridiagSpectrum(diag, off, mFull);
  // lock reference: sub-block m-40
  const mSub = Math.max(10, mFull - 40);
  const evSub = jacobiTridiagSpectrum(diag.slice(0, mSub), off.slice(0, mSub - 1), mSub);
  const l1 = ev[0];
  const l3 = ev[2];
  const l5 = ev[4];
  const l7 = ev[6];
  const l9 = ev[8];
  const l10 = ev[9];
  const sigma4 = l9 / l1;
  const sigma4Sub = evSub[8] / evSub[0];
  const rho1 = l3 / l1;
  const sigma2 = l5 / l1;
  const sigma3 = l7 / l1;
  const pair910 = Math.abs(l9 - l10) / l9;
  rows.push({
    N,
    U,
    m: mFull,
    sigma4,
    logInvSigma4: -Math.log(sigma4),
    logInvSigma3: -Math.log(sigma3),
    logInvSigma2: -Math.log(sigma2),
    logInvRho1: -Math.log(rho1),
    pair910,
    lockResidual: Math.abs(sigma4 - sigma4Sub),
  });
  console.error(`N=${N} m=${mFull} sigma4=${sigma4.toFixed(10)} pair910=${pair910.toExponential(3)} lock=${Math.abs(sigma4 - sigma4Sub).toExponential(3)} (${((Date.now() - t0) / 1000).toFixed(1)}s)`);
}

console.log(JSON.stringify({ H0, NPHI, ladderN: LADDER, rows }, null, 2));
