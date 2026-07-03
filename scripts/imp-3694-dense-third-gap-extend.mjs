// imp-3694 EXTEND the imp-3669 independent dense third-gap verify ladder to N in {2400, 2800}.
// imp-3669 certified the imp-3643 baked top-8 at N=1200/1600/2000 by Sturm-sequence bisection
// on the Householder tridiagonal of the re-typed imp-3505 Ttilde assembly (worst 1.77e-15).
// imp-3663 pushed the Lanczos assembly to N=2400 and imp-3686 to N=2800, baking the top Ritz
// lambda_1/lambda_5. This script runs the SAME dense Sturm-bisection solve at N=2400/2800 and
// (a) cross-checks the dense lambda_1 and lambda_5 against those Lanczos baked values -- an
// INDEPENDENT eigensolver (dense Sturm bisection vs Lanczos) -- and (b) reports the third gap
// sigma_3 = lambda_7/lambda_1 to extend the machine-precise exponent-law rungs.
//
// Assembly + solve routines are RE-TYPED identically to scripts/imp-3669-dense-third-gap-independent-verify.mjs.

const NPHI = 10;
const H0 = 0.025;
const A = 1.0;

// Independent Lanczos cross-references (converged top Ritz values):
//   N=2400 from imp-3663 (m=680 deepest row), N=2800 from imp-3686 (m=720 deepest row).
const LANCZOS_REF = {
  2400: { lambda1: 4.214795510364966e-9, lambda5: 4.2135842303783994e-9 },
  2800: { lambda1: 4.214835623720701e-9, lambda5: 4.213945165017194e-9 },
};

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

function eigByBisection(d, e, n, j, lo, hi) {
  for (let it = 0; it < 200; it++) {
    const mid = 0.5 * (lo + hi);
    if (mid === lo || mid === hi) break;
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
  let hi = 0;
  for (let i = 0; i < N; i++) {
    let radius = 0;
    for (let j = 0; j < N; j++) radius += Math.abs(S[i][j]);
    if (radius > hi) hi = radius;
  }
  const { d, e } = householderTridiag(S, N);
  const top8 = [];
  for (let k = 0; k < 8; k++) top8.push(eigByBisection(d, e, N, N - k, 0, hi));
  const secs = ((Date.now() - t0) / 1000).toFixed(1);
  return { N, U, top8, secs };
}

for (const N of [2400, 2800]) {
  const r = independentTop8(N);
  const ref = LANCZOS_REF[N];
  const denseL1 = r.top8[0];
  const denseL5 = r.top8[4]; // fifth descending eigenvalue
  const l1RelDiff = Math.abs(denseL1 - ref.lambda1) / ref.lambda1;
  const l5RelDiff = Math.abs(denseL5 - ref.lambda5) / ref.lambda5;
  const sigma3 = r.top8[6] / r.top8[0];
  console.log(`N=${r.N} U=${r.U} (${r.secs}s)`);
  console.log(`  indep dense top8 = [${r.top8.map((x) => x.toExponential(15)).join(', ')}]`);
  console.log(`  dense lambda_1 = ${denseL1.toExponential(15)}  vs Lanczos ${ref.lambda1.toExponential(15)}  relDiff = ${l1RelDiff.toExponential(6)}`);
  console.log(`  dense lambda_5 = ${denseL5.toExponential(15)}  vs Lanczos ${ref.lambda5.toExponential(15)}  relDiff = ${l5RelDiff.toExponential(6)}`);
  console.log(`  sigma_3 = lambda_7/lambda_1 = ${sigma3.toFixed(16)}`);
  console.log('');
}
