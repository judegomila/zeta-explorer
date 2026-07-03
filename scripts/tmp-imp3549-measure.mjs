// Offline independent re-measurement of the imp-3545 power-iteration budget-to-1e-9
// at N=1000 and N=1200, using the imp-3505/imp-3530/imp-3545 assembly verbatim.
const NPHI = 10, A_LINEAR = 1.0, H0 = 0.025, REF_KRYLOV = 200, TARGET_GAP = 1e-9;

function phiKernel(uu) {
  let s = 0;
  const e2 = Math.exp(2 * uu), e4 = Math.exp(4 * uu);
  for (let n = 1; n <= NPHI; n++) {
    const n2 = n * n, n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}
function vecNorm(x, n) { let s = 0; for (let i = 0; i < n; i++) s += x[i] * x[i]; return Math.sqrt(s); }
function applyGram(M, v, n) {
  const Mv = new Float64Array(n);
  for (let i = 0; i < n; i++) { let s = 0; const Mi = M[i]; for (let j = 0; j < n; j++) s += Mi[j] * v[j]; Mv[i] = s; }
  const out = new Float64Array(n);
  for (let j = 0; j < n; j++) { let s = 0; for (let i = 0; i < n; i++) s += M[i][j] * Mv[i]; out[j] = s; }
  return out;
}
function jacobiEigs(diag, off, m) {
  const A = [];
  for (let i = 0; i < m; i++) A.push(new Float64Array(m));
  for (let i = 0; i < m; i++) { A[i][i] = diag[i]; if (i + 1 < m) { A[i][i + 1] = off[i]; A[i + 1][i] = off[i]; } }
  for (let sweep = 0; sweep < 100; sweep++) {
    let offSum = 0;
    for (let p = 0; p < m; p++) for (let q = p + 1; q < m; q++) offSum += A[p][q] * A[p][q];
    if (offSum < 1e-30) break;
    for (let p = 0; p < m; p++) for (let q = p + 1; q < m; q++) {
      const apq = A[p][q]; if (Math.abs(apq) < 1e-32) continue;
      const app = A[p][p], aqq = A[q][q];
      const theta = (aqq - app) / (2 * apq);
      const sgn = theta >= 0 ? 1 : -1;
      const t = sgn / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
      const c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < m; k++) { const akp = A[k][p], akq = A[k][q]; A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq; }
      for (let k = 0; k < m; k++) { const apk = A[p][k], aqk = A[q][k]; A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk; }
    }
  }
  const ev = []; for (let i = 0; i < m; i++) ev.push(A[i][i]); ev.sort((x, y) => y - x); return ev;
}
function lanczosEigs(M, n, mReq) {
  const m = Math.min(mReq, n);
  const basis = [];
  let vPrev = new Float64Array(n);
  let v = new Float64Array(n);
  for (let i = 0; i < n; i++) v[i] = Math.cos(0.17 * i + 0.4);
  const b0 = vecNorm(v, n); for (let i = 0; i < n; i++) v[i] /= b0;
  const diag = [], off = []; let beta = 0;
  for (let j = 0; j < m; j++) {
    const w = applyGram(M, v, n);
    let alpha = 0; for (let i = 0; i < n; i++) alpha += w[i] * v[i];
    for (let i = 0; i < n; i++) w[i] -= alpha * v[i] + beta * vPrev[i];
    for (const uVec of basis) { let d = 0; for (let i = 0; i < n; i++) d += w[i] * uVec[i]; for (let i = 0; i < n; i++) w[i] -= d * uVec[i]; }
    let dv = 0; for (let i = 0; i < n; i++) dv += w[i] * v[i]; for (let i = 0; i < n; i++) w[i] -= dv * v[i];
    diag.push(alpha); basis.push(v.slice());
    const bn = vecNorm(w, n); if (bn < 1e-13) break; off.push(bn);
    vPrev = v; v = new Float64Array(n); for (let i = 0; i < n; i++) v[i] = w[i] / bn; beta = bn;
  }
  return jacobiEigs(diag, off, diag.length);
}
function buildTtilde(a, U, N) {
  const H = U / N;
  const u = new Array(N), phi = new Array(N);
  for (let i = 0; i < N; i++) { u[i] = (i + 0.5) * H; phi[i] = phiKernel(u[i]); }
  const Rk = new Array(N).fill(0);
  for (let k = 0; k < N; k++) { let s = 0; for (let i = 0; i + k < N; i++) s += phi[i] * phi[i + k]; Rk[k] = s * H; }
  const T = [];
  for (let i = 0; i < N; i++) { const r = new Float64Array(N); for (let j = 0; j < N; j++) { const k = Math.abs(j - i); r[j] = a * (u[j] - u[i]) * Rk[k] * H; } T.push(r); }
  return T;
}
// power iteration: first iteration whose gap |sigma-sigmaRef|/sigmaRef < 1e-9
function measureBudget(M, n, sigmaRef, maxIters) {
  let v = new Float64Array(n);
  for (let i = 0; i < n; i++) v[i] = Math.sin(0.3 * i + 1);
  const s0 = vecNorm(v, n); for (let i = 0; i < n; i++) v[i] /= s0;
  for (let it = 1; it <= maxIters; it++) {
    const Mv = new Float64Array(n);
    for (let i = 0; i < n; i++) { let s = 0; const Mi = M[i]; for (let j = 0; j < n; j++) s += Mi[j] * v[j]; Mv[i] = s; }
    const MtMv = new Float64Array(n);
    for (let j = 0; j < n; j++) { let s = 0; for (let i = 0; i < n; i++) s += M[i][j] * Mv[i]; MtMv[j] = s; }
    const lam = vecNorm(MtMv, n); if (lam === 0) break;
    for (let j = 0; j < n; j++) v[j] = MtMv[j] / lam;
    const sigma = Math.sqrt(lam);
    const gap = Math.abs(sigma - sigmaRef) / sigmaRef;
    if (gap < TARGET_GAP) return { budget: it, gapAtClose: gap, sigma };
  }
  return { budget: null, gapAtClose: null, sigma: null };
}

const targets = process.argv.slice(2).map(s => s.split(',').map(Number)); // [U,N,maxIters]
for (const [U, N, maxIters] of targets) {
  const t0 = Date.now();
  const T = buildTtilde(A_LINEAR, U, N);
  const ev = lanczosEigs(T, N, REF_KRYLOV);
  const l1 = ev[0], l2 = ev[1], l3 = ev[2];
  const sigmaRef = Math.sqrt(Math.max(0, l1));
  const topPairSplit = l1 > 0 ? Math.abs(l1 - l2) / l1 : NaN;
  const rho = l3 / l1;
  const res = measureBudget(T, N, sigmaRef, maxIters);
  console.log(JSON.stringify({ U, N, sigmaRef, topPairSplit, rho, logInvRho: -Math.log(rho),
    budgetMeasured: res.budget, gapAtClose: res.gapAtClose, secs: (Date.now() - t0) / 1000 }));
}
