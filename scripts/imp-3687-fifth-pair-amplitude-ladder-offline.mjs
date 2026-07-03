// imp-3687 OFFLINE measurement of the FIFTH-pair amplitude sigma_4 = lambda_9/lambda_1
// across the FULL imp-3619/imp-3555 ladder N in {160,240,320,400,480,640,800,1000,1200,1600,2000}.
// imp-3668 deferred the sigma_4 AMPLITUDE LAW to a distinct ticket after dense-certifying the
// fifth-pair (lambda_9=lambda_10) degeneracy only at the 3 DEEP rungs. This script measures the
// full sigma_4(N) ladder with the SAME INDEPENDENT dense full-spectrum route imp-3623/imp-3643/
// imp-3668 used (form Gram S=T^T T explicitly, Householder tridiagonalization tred1 + implicit-QL
// tql1: ALL eigenvalues, NO Krylov subspace, NO reorthogonalization -- so it cannot host a Lanczos
// ghost, and imp-3668 certified it reproduces the imp-3619 Lanczos deep-rung spectrum to machine
// precision). Prints, per rung: sigma_4=lambda_9/lambda_1, the lower gaps rho=lambda_3/lambda_1,
// sigma_2=lambda_5/lambda_1, sigma_3=lambda_7/lambda_1 (for cross-checking against the imp-3619
// baked Lanczos ladder and for the amplitude-law ratios), and the fifth-pair spread pair910.
// Identical imp-3505/imp-3668 assembly: Ttilde(u,v)=a(v-u)R(|v-u|), NPHI=10, H0=0.025, midpoint.

const NPHI = 10;
const H0 = 0.025;
const A = 1.0;

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

function tred1(a, n, d, e) {
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
  d[0] = 0;
  e[0] = 0;
  for (let i = 0; i < n; i++) d[i] = a[i][i];
}

function sign(a, b) {
  return b >= 0 ? Math.abs(a) : -Math.abs(a);
}

function tql1(n, d, e) {
  for (let i = 1; i < n; i++) e[i - 1] = e[i];
  e[n - 1] = 0;
  for (let l = 0; l < n; l++) {
    let iter = 0;
    let m;
    do {
      for (m = l; m < n - 1; m++) {
        const dd = Math.abs(d[m]) + Math.abs(d[m + 1]);
        if (Math.abs(e[m]) <= Number.EPSILON * dd) break;
      }
      if (m !== l) {
        if (iter++ === 60) throw new Error('tql1: too many iterations');
        let g = (d[l + 1] - d[l]) / (2 * e[l]);
        let r = Math.hypot(g, 1);
        g = d[m] - d[l] + e[l] / (g + sign(r, g));
        let s = 1;
        let c = 1;
        let p = 0;
        for (let i = m - 1; i >= l; i--) {
          let f = s * e[i];
          const b = c * e[i];
          r = Math.hypot(f, g);
          e[i + 1] = r;
          if (r === 0) {
            d[i + 1] -= p;
            e[m] = 0;
            break;
          }
          s = f / r;
          c = g / r;
          g = d[i + 1] - p;
          r = (d[i] - g) * s + 2 * c * b;
          p = s * r;
          d[i + 1] = g + p;
          g = c * r - b;
        }
        if (r === 0 && m - 1 >= l) continue;
        d[l] -= p;
        e[l] = g;
        e[m] = 0;
      }
    } while (m !== l);
  }
  d.sort((x, y) => x - y);
}

function denseTop10(N) {
  const U = N * H0;
  const t0 = Date.now();
  const T = buildTtilde(A, U, N);
  const S = gram(T, N);
  const d = new Float64Array(N);
  const e = new Float64Array(N);
  tred1(S, N, d, e);
  const dd = Array.from(d);
  const ee = Array.from(e);
  tql1(N, dd, ee);
  const top10 = dd.slice(N - 10).reverse(); // descending
  const secs = ((Date.now() - t0) / 1000).toFixed(1);
  return { N, U, top10, secs };
}

const LADDER_N = [160, 240, 320, 400, 480, 640, 800, 1000, 1200, 1600, 2000];
for (const N of LADDER_N) {
  const r = denseTop10(N);
  const d = r.top10;
  const rho = d[2] / d[0]; // lambda_3/lambda_1 (first gap)
  const sigma2 = d[4] / d[0]; // lambda_5/lambda_1 (second gap)
  const sigma3 = d[6] / d[0]; // lambda_7/lambda_1 (third gap)
  const sigma4 = d[8] / d[0]; // lambda_9/lambda_1 (FIFTH-pair amplitude -- the deliverable)
  const pair910 = Math.abs(d[8] - d[9]) / d[8];
  console.log(
    `N=${r.N} U=${r.U} (${r.secs}s) sigma4=${sigma4.toFixed(16)} ` +
      `logInvSigma4=${(-Math.log(sigma4)).toExponential(15)} ` +
      `logInvSigma3=${(-Math.log(sigma3)).toExponential(15)} ` +
      `logInvSigma2=${(-Math.log(sigma2)).toExponential(15)} ` +
      `logInvRho=${(-Math.log(rho)).toExponential(15)} ` +
      `pair910=${pair910.toExponential(6)}`,
  );
}
