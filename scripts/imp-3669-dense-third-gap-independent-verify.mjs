// imp-3669 INDEPENDENT verification of the imp-3643 BAKED deep-rung dense top-8 Gram
// eigenvalues (scripts/imp-3643-dense-third-gap-offline.mjs). Guards against a baked-literal
// transcription or offline-drift error before downstream tickets build on imp-3643.
//
// TWO independence levers vs imp-3643:
//   (1) the imp-3505/imp-3575 Ttilde assembly (NPHI=10, H0=0.025, midpoint quadrature) is
//       RE-TYPED here from scratch and the Gram S = T^T T formed explicitly, so any assembly
//       drift shows up as a mismatch;
//   (2) the eigenvalues are extracted by STURM-SEQUENCE BISECTION on the Householder
//       tridiagonal -- a routine ENTIRELY DIFFERENT from the imp-3643 EISPACK implicit-QL
//       (tql1). Householder tridiagonalization itself is standard (an orthogonal similarity
//       that preserves the spectrum exactly), but the eigenvalue solve is independent, so a
//       QL-convergence bug or a baked-literal transcription error would surface as a deviation.
//
// Prints, per rung N in {1200,1600,2000}, the independently-solved top-8 and the MAX relative
// deviation from imp-3643's baked denseTop8 literals, plus the third-gap sigma_3 = l7/l1.

const NPHI = 10;
const H0 = 0.025;
const A = 1.0;

// imp-3643 BAKED deep-rung dense top-8 (descending) -- the literals UNDER TEST.
const BAKED = {
  1200: [
    4.214343608213908e-9, 4.214343608213907e-9, 4.212534094517934e-9, 4.212534094517927e-9,
    4.209519879600895e-9, 4.209519879600894e-9, 4.205303423177364e-9, 4.205303423177354e-9,
  ],
  1600: [
    4.214606892680916e-9, 4.214606892680914e-9, 4.213586896292689e-9, 4.213586896292687e-9,
    4.211887423748783e-9, 4.211887423748778e-9, 4.209509256818997e-9, 4.209509256818992e-9,
  ],
  2000: [
    4.214729052176358e-9, 4.214729052176355e-9, 4.214075442049284e-9, 4.214075442049272e-9,
    4.212986305937732e-9, 4.212986305937727e-9, 4.21146196489085e-9, 4.211461964890849e-9,
  ],
};
const BAKED_SIGMA3 = { 1200: 0.9978549008156636, 1600: 0.9987904836698018, 2000: 0.9992248404950668 };

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

function buildTtilde(a, U, N) {
  const H = U / N;
  const u = new Float64Array(N);
  const phi = new Float64Array(N);
  for (let i = 0; i < N; i++) {
    u[i] = (i + 0.5) * H;
    phi[i] = phiKernel(u[i]);
  }
  const Rk = new Float64Array(N);
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

function gram(T, N) {
  const S = [];
  for (let i = 0; i < N; i++) S.push(new Float64Array(N));
  for (let k = 0; k < N; k++) {
    const Tk = T[k];
    for (let i = 0; i < N; i++) {
      const t = Tk[i];
      if (t === 0) continue;
      const Si = S[i];
      for (let j = i; j < N; j++) Si[j] += t * Tk[j];
    }
  }
  for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) S[j][i] = S[i][j];
  return S;
}

// Householder reduction of a real symmetric matrix to tridiagonal (eigenvalues preserved
// exactly by the orthogonal similarity). d = diagonal, e[1..n-1] = subdiagonal (e[0]=0).
// Standard clean re-implementation; destroys a.
function householderTridiag(a, n) {
  const d = new Float64Array(n);
  const e = new Float64Array(n);
  for (let i = n - 1; i >= 1; i--) {
    const l = i - 1;
    let h = 0;
    let scale = 0;
    if (l > 0) {
      for (let k = 0; k <= l; k++) scale += Math.abs(a[i][k]);
      if (scale === 0) {
        e[i] = a[i][l];
      } else {
        for (let k = 0; k <= l; k++) {
          a[i][k] /= scale;
          h += a[i][k] * a[i][k];
        }
        let f = a[i][l];
        let g = f >= 0 ? -Math.sqrt(h) : Math.sqrt(h);
        e[i] = scale * g;
        h -= f * g;
        a[i][l] = f - g;
        f = 0;
        for (let j = 0; j <= l; j++) {
          g = 0;
          for (let k = 0; k <= j; k++) g += a[j][k] * a[i][k];
          for (let k = j + 1; k <= l; k++) g += a[k][j] * a[i][k];
          e[j] = g / h;
          f += e[j] * a[i][j];
        }
        const hh = f / (h + h);
        for (let j = 0; j <= l; j++) {
          f = a[i][j];
          g = e[j] - hh * f;
          e[j] = g;
          for (let k = 0; k <= j; k++) a[j][k] -= f * e[k] + g * a[i][k];
        }
      }
    } else {
      e[i] = a[i][l];
    }
    d[i] = h;
  }
  e[0] = 0;
  for (let i = 0; i < n; i++) d[i] = a[i][i];
  return { d, e };
}

// Sturm sequence: number of eigenvalues of the symmetric tridiagonal (d, subdiag e[1..n-1])
// strictly less than x. Independent of implicit-QL. Guards q=0 by a tiny surrogate.
function countLess(d, e, n, x) {
  let count = 0;
  let q = d[0] - x;
  if (q < 0) count++;
  for (let i = 1; i < n; i++) {
    if (q === 0) q = -1e-300;
    q = d[i] - x - (e[i] * e[i]) / q;
    if (q < 0) count++;
  }
  return count;
}

// Bisection for the j-th eigenvalue (1-based, ASCENDING order) of the tridiagonal on [lo,hi].
function eigByBisection(d, e, n, j, lo, hi) {
  for (let it = 0; it < 200; it++) {
    const mid = 0.5 * (lo + hi);
    if (mid === lo || mid === hi) break; // machine-precision floor reached
    if (countLess(d, e, n, mid) >= j) hi = mid;
    else lo = mid;
  }
  return 0.5 * (lo + hi);
}

function independentTop8(N) {
  const U = N * H0;
  const t0 = Date.now();
  const T = buildTtilde(A, U, N);
  const S = gram(T, N);
  // Gershgorin upper bound for the bracket; matrix is PSD so lower bound is 0.
  let hi = 0;
  for (let i = 0; i < N; i++) {
    let radius = 0;
    for (let j = 0; j < N; j++) radius += Math.abs(S[i][j]);
    if (radius > hi) hi = radius;
  }
  const { d, e } = householderTridiag(S, N);
  // top-8 = ascending indices N-7 .. N, extracted descending.
  const top8 = [];
  for (let k = 0; k < 8; k++) top8.push(eigByBisection(d, e, N, N - k, 0, hi));
  const secs = ((Date.now() - t0) / 1000).toFixed(1);
  return { N, U, top8, secs };
}

let worstOverall = 0;
for (const N of [1200, 1600, 2000]) {
  const r = independentTop8(N);
  const baked = BAKED[N];
  const relDev = r.top8.map((v, i) => Math.abs(v - baked[i]) / baked[i]);
  const worst = Math.max(...relDev);
  if (worst > worstOverall) worstOverall = worst;
  const sigma3 = r.top8[6] / r.top8[0];
  const sigma3RelDiff = Math.abs(sigma3 - BAKED_SIGMA3[N]) / BAKED_SIGMA3[N];
  console.log(`N=${r.N} U=${r.U} (${r.secs}s)`);
  console.log(`  indep top8 = [${r.top8.map((x) => x.toExponential(15)).join(', ')}]`);
  console.log(`  max rel dev vs imp-3643 baked denseTop8 = ${worst.toExponential(6)}`);
  console.log(`  sigma3 indep = ${sigma3.toFixed(16)}  rel diff vs baked sigma3Lan = ${sigma3RelDiff.toExponential(6)}`);
}
console.log(`\nWORST rel dev across all rungs = ${worstOverall.toExponential(6)}`);
console.log(worstOverall < 1e-9 ? 'VERDICT: baked literals REPRODUCED independently' : 'VERDICT: MISMATCH -- investigate');
