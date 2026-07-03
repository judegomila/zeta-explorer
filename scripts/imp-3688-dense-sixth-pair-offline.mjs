// imp-3688 OFFLINE dense certification of the SIXTH skew-Toeplitz pair
// lambda_11 = lambda_12 at the deep rungs N in {1200,1600,2000}, using the SAME
// INDEPENDENT dense full-spectrum route of imp-3623/imp-3643/imp-3668: form the
// Gram S = T^T T EXPLICITLY, Householder tridiagonalization (tred1) + implicit-QL
// (tql1) for ALL eigenvalues (NO Krylov subspace, NO reorthogonalization).
// Prints the TOP-TWELVE Gram eigenvalues so the six-pair adjacent-pairing
// structure (lambda_1=lambda_2, ..., lambda_11=lambda_12) can be measured and
// the lambda_11=lambda_12 sixth-pair spread baked. Identical imp-3505/imp-3668
// assembly: Ttilde(u,v)=a(v-u)R(|v-u|), NPHI=10, H0=0.025, midpoint quadrature.

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

function denseTop12(N) {
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
  const top12 = dd.slice(N - 12).reverse(); // descending
  const secs = ((Date.now() - t0) / 1000).toFixed(1);
  return { N, U, top12, secs };
}

for (const N of [1200, 1600, 2000]) {
  const r = denseTop12(N);
  const d = r.top12;
  const pair12 = Math.abs(d[0] - d[1]) / d[0];
  const pair34 = Math.abs(d[2] - d[3]) / d[2];
  const pair56 = Math.abs(d[4] - d[5]) / d[4];
  const pair78 = Math.abs(d[6] - d[7]) / d[6];
  const pair910 = Math.abs(d[8] - d[9]) / d[8]; // FIFTH pair
  const pair1112 = Math.abs(d[10] - d[11]) / d[10]; // SIXTH pair
  const sigma5 = d[10] / d[0]; // lambda_11/lambda_1 (sixth-pair amplitude)
  console.log(`N=${r.N} U=${r.U} (${r.secs}s)`);
  console.log(`  top12=[${d.map((x) => x.toExponential(15)).join(', ')}]`);
  console.log(`  pair12=${pair12.toExponential(6)} pair34=${pair34.toExponential(6)} pair56=${pair56.toExponential(6)} pair78=${pair78.toExponential(6)} pair910=${pair910.toExponential(6)}`);
  console.log(`  pair1112 (SIXTH) = ${pair1112.toExponential(6)}`);
  console.log(`  sigma5=lambda11/lambda1 = ${sigma5.toFixed(16)}`);
}
