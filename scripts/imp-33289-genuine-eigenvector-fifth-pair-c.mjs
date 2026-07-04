// imp-33289 OFFLINE prototype -- measure the imp-33272 fifth-pair realized
// backward-error constant c using the ACTUAL Gram eigenvectors of a genuine
// small-N skew-Toeplitz Gram (N in {160..400}), replacing the imp-33272
// deterministic integer-Householder SURROGATE rotation Q. For each N we:
//   (1) build the genuine skew-Toeplitz T and Gram S = T^T T (imp-3668 assembly),
//   (2) full fp64 eigensolve (tred2+tql2) -> actual top-10 eigenvalues + the
//       ACTUAL orthonormal eigenvectors in the coordinate basis,
//   (3) orthonormalize the leading 10x10 eigenvector block -> Q_genuine (the
//       actual eigenvector orientation, NOT a surrogate),
//   (4) form S' = Q_genuine diag(top10 with fifth pair EXACTLY degenerate)
//       Q_genuine^T, solve S' by cyclic Jacobi in fp64 and double-double,
//   (5) measure realized c = spreadFp64 / (n * kappa_pair * u), n=10.
// Tests whether the surrogate order c in [0.088,0.884] carries to true eigenvectors.

const NPHI = 10;
const H0 = 0.025;
const A = 1.0;
const EPS = 2.220446049250313e-16;

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

// tred2 + tql2 (EISPACK) with eigenVECTOR accumulation. z starts as a copy of S.
function tred2(z, n, d, e) {
  for (let i = n - 1; i >= 1; i--) {
    const l = i - 1;
    let h = 0;
    let scale = 0;
    if (l > 0) {
      for (let k = 0; k <= l; k++) scale += Math.abs(z[i][k]);
      if (scale === 0) {
        e[i] = z[i][l];
      } else {
        for (let k = 0; k <= l; k++) {
          z[i][k] /= scale;
          h += z[i][k] * z[i][k];
        }
        let f = z[i][l];
        let g = f >= 0 ? -Math.sqrt(h) : Math.sqrt(h);
        e[i] = scale * g;
        h -= f * g;
        z[i][l] = f - g;
        f = 0;
        for (let j = 0; j <= l; j++) {
          z[j][i] = z[i][j] / h;
          g = 0;
          for (let k = 0; k <= j; k++) g += z[j][k] * z[i][k];
          for (let k = j + 1; k <= l; k++) g += z[k][j] * z[i][k];
          e[j] = g / h;
          f += e[j] * z[i][j];
        }
        const hh = f / (h + h);
        for (let j = 0; j <= l; j++) {
          f = z[i][j];
          g = e[j] - hh * f;
          e[j] = g;
          for (let k = 0; k <= j; k++) z[j][k] -= f * e[k] + g * z[i][k];
        }
        for (let k = 0; k <= l; k++) z[i][k] *= scale;
      }
    } else {
      e[i] = z[i][l];
    }
    d[i] = h;
  }
  d[0] = 0;
  e[0] = 0;
  for (let i = 0; i < n; i++) {
    const l = i - 1;
    if (d[i] !== 0) {
      for (let j = 0; j <= l; j++) {
        let g = 0;
        for (let k = 0; k <= l; k++) g += z[i][k] * z[k][j];
        for (let k = 0; k <= l; k++) z[k][j] -= g * z[k][i];
      }
    }
    d[i] = z[i][i];
    z[i][i] = 1;
    for (let j = 0; j <= l; j++) {
      z[j][i] = 0;
      z[i][j] = 0;
    }
  }
}

function sign(a, b) {
  return b >= 0 ? Math.abs(a) : -Math.abs(a);
}

function tql2(z, n, d, e) {
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
        if (iter++ === 60) throw new Error('tql2: too many iterations');
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
          for (let k = 0; k < n; k++) {
            f = z[k][i + 1];
            z[k][i + 1] = s * z[k][i] + c * f;
            z[k][i] = c * z[k][i] - s * f;
          }
        }
        if (r === 0 && m - 1 >= l) continue;
        d[l] -= p;
        e[l] = g;
        e[m] = 0;
      }
    } while (m !== l);
  }
}

// modified Gram-Schmidt orthonormalization of the columns of a k x k matrix (arrays of rows)
function orthonormalizeColumns(B, k) {
  const Q = [];
  for (let i = 0; i < k; i++) Q.push(new Float64Array(k));
  for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) Q[i][j] = B[i][j];
  for (let c = 0; c < k; c++) {
    for (let p = 0; p < c; p++) {
      let dot = 0;
      for (let i = 0; i < k; i++) dot += Q[i][p] * Q[i][c];
      for (let i = 0; i < k; i++) Q[i][c] -= dot * Q[i][p];
    }
    let nrm = 0;
    for (let i = 0; i < k; i++) nrm += Q[i][c] * Q[i][c];
    nrm = Math.sqrt(nrm);
    for (let i = 0; i < k; i++) Q[i][c] /= nrm;
  }
  return Q;
}

// ---- fp64 cyclic Jacobi on symmetric k x k, returns eigenvalues descending ----
function jacobiFp64(Ain, k) {
  const A = [];
  for (let i = 0; i < k; i++) A.push(Float64Array.from(Ain[i]));
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0;
    for (let p = 0; p < k; p++) for (let q = p + 1; q < k; q++) off += A[p][q] * A[p][q];
    if (off < 1e-300) break;
    for (let p = 0; p < k; p++) {
      for (let q = p + 1; q < k; q++) {
        const apq = A[p][q];
        if (apq === 0) continue;
        const app = A[p][p];
        const aqq = A[q][q];
        const theta = (aqq - app) / (2 * apq);
        const t = sign(1, theta) / (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let i = 0; i < k; i++) {
          const aip = A[i][p];
          const aiq = A[i][q];
          A[i][p] = c * aip - s * aiq;
          A[i][q] = s * aip + c * aiq;
        }
        for (let i = 0; i < k; i++) {
          const api = A[p][i];
          const aqi = A[q][i];
          A[p][i] = c * api - s * aqi;
          A[q][i] = s * api + c * aqi;
        }
      }
    }
  }
  const ev = [];
  for (let i = 0; i < k; i++) ev.push(A[i][i]);
  ev.sort((a, b) => b - a);
  return ev;
}

// ---- double-double Jacobi (Dekker/Knuth primitives) ----
const DD_SPLIT = 134217729;
function twoSum(a, b) { const s = a + b; const bb = s - a; return { hi: s, lo: (a - (s - bb)) + (b - bb) }; }
function quickTwoSum(a, b) { const s = a + b; return { hi: s, lo: b - (s - a) }; }
function twoProd(a, b) {
  const p = a * b;
  const ca = DD_SPLIT * a; const ahi = ca - (ca - a); const alo = a - ahi;
  const cb = DD_SPLIT * b; const bhi = cb - (cb - b); const blo = b - bhi;
  return { hi: p, lo: ((ahi * bhi - p) + ahi * blo + alo * bhi) + alo * blo };
}
function ddAdd(a, b) {
  let s = twoSum(a.hi, b.hi); const t = twoSum(a.lo, b.lo);
  s.lo += t.hi; s = quickTwoSum(s.hi, s.lo); s.lo += t.lo; s = quickTwoSum(s.hi, s.lo); return s;
}
function ddMul(a, b) {
  let p = twoProd(a.hi, b.hi); p.lo += a.hi * b.lo + a.lo * b.hi; return quickTwoSum(p.hi, p.lo);
}
function ddSub(a, b) { return ddAdd(a, { hi: -b.hi, lo: -b.lo }); }
const ddc = (x) => ({ hi: x, lo: 0 });
function ddDiv(a, b) {
  const q1 = a.hi / b.hi;
  const r = ddSub(a, ddMul(b, ddc(q1)));
  const q2 = r.hi / b.hi;
  return quickTwoSum(q1, q2);
}
function ddSqrt(a) {
  if (a.hi === 0) return ddc(0);
  const x = 1 / Math.sqrt(a.hi);
  const ax = a.hi * x;
  const axdd = ddc(ax);
  const diff = ddSub(a, ddMul(axdd, axdd));
  const c = diff.hi * (x * 0.5);
  return ddAdd(axdd, ddc(c));
}
// double-double modified Gram-Schmidt orthonormalization of the columns of a k x k fp64 block
function ddOrthonormalizeColumns(B, k) {
  const Q = [];
  for (let i = 0; i < k; i++) { Q.push([]); for (let j = 0; j < k; j++) Q[i].push(ddc(B[i][j])); }
  for (let c = 0; c < k; c++) {
    for (let p = 0; p < c; p++) {
      let dot = ddc(0);
      for (let i = 0; i < k; i++) dot = ddAdd(dot, ddMul(Q[i][p], Q[i][c]));
      for (let i = 0; i < k; i++) Q[i][c] = ddSub(Q[i][c], ddMul(dot, Q[i][p]));
    }
    let nrm = ddc(0);
    for (let i = 0; i < k; i++) nrm = ddAdd(nrm, ddMul(Q[i][c], Q[i][c]));
    nrm = ddSqrt(nrm);
    for (let i = 0; i < k; i++) Q[i][c] = ddDiv(Q[i][c], nrm);
  }
  return Q;
}

// double-double Jacobi taking an already-dd symmetric matrix (arrays of arrays of {hi,lo})
function jacobiDDmat(Ain, k) {
  const A = [];
  for (let i = 0; i < k; i++) { A.push([]); for (let j = 0; j < k; j++) A[i].push({ hi: Ain[i][j].hi, lo: Ain[i][j].lo }); }
  return jacobiDDcore(A, k);
}
function jacobiDD(Ain, k) {
  const A = [];
  for (let i = 0; i < k; i++) { A.push([]); for (let j = 0; j < k; j++) A[i].push(ddc(Ain[i][j])); }
  return jacobiDDcore(A, k);
}
function jacobiDDcore(A, k) {
  for (let sweep = 0; sweep < 200; sweep++) {
    let off = 0;
    for (let p = 0; p < k; p++) for (let q = p + 1; q < k; q++) off += A[p][q].hi * A[p][q].hi;
    if (off < 1e-62) break;
    for (let p = 0; p < k; p++) {
      for (let q = p + 1; q < k; q++) {
        const apq = A[p][q];
        if (apq.hi === 0 && apq.lo === 0) continue;
        const app = A[p][p]; const aqq = A[q][q];
        const theta = ddDiv(ddSub(aqq, app), ddMul(ddc(2), apq));
        const th2p1 = ddAdd(ddMul(theta, theta), ddc(1));
        const denom = ddAdd(ddc(Math.abs(theta.hi)), ddSqrt(th2p1));
        let t = ddDiv(ddc(1), denom);
        if (theta.hi < 0) t = { hi: -t.hi, lo: -t.lo };
        const c = ddDiv(ddc(1), ddSqrt(ddAdd(ddMul(t, t), ddc(1))));
        const s = ddMul(t, c);
        for (let i = 0; i < k; i++) {
          const aip = A[i][p]; const aiq = A[i][q];
          A[i][p] = ddSub(ddMul(c, aip), ddMul(s, aiq));
          A[i][q] = ddAdd(ddMul(s, aip), ddMul(c, aiq));
        }
        for (let i = 0; i < k; i++) {
          const api = A[p][i]; const aqi = A[q][i];
          A[p][i] = ddSub(ddMul(c, api), ddMul(s, aqi));
          A[q][i] = ddAdd(ddMul(s, api), ddMul(c, aqi));
        }
      }
    }
  }
  const ev = [];
  for (let i = 0; i < k; i++) ev.push(A[i][i].hi + A[i][i].lo);
  ev.sort((a, b) => b - a);
  return ev;
}

function measureRung(N) {
  const t0 = Date.now();
  const U = N * H0;
  const T = buildTtilde(A, U, N);
  const S = gram(T, N);
  // copy S into z for tred2/tql2
  const z = [];
  for (let i = 0; i < N; i++) z.push(Float64Array.from(S[i]));
  const d = new Float64Array(N);
  const e = new Float64Array(N);
  tred2(z, N, d, e);
  tql2(z, N, d, e);
  // eigenpairs (d[i], column i of z); sort descending by eigenvalue
  const idx = Array.from({ length: N }, (_, i) => i).sort((a, b) => d[b] - d[a]);
  const top = idx.slice(0, NPHI);
  const top10 = top.map((i) => d[i]);
  // leading 10x10 block of the actual top-10 eigenvectors (rows 0..9, these columns)
  const B = [];
  for (let r = 0; r < NPHI; r++) {
    B.push(new Float64Array(NPHI));
    for (let cc = 0; cc < NPHI; cc++) B[r][cc] = z[r][top[cc]];
  }
  // orthonormalize the genuine eigenvector block in DOUBLE-DOUBLE so Qg^T Qg = I to ~1e-31,
  // making the exactly-degenerate pair truly degenerate in the reconstructed S' (else the
  // fp64-orthogonality residual of Qg would itself break degeneracy and mask the collapse).
  const Qg = ddOrthonormalizeColumns(B, NPHI); // Qg[i][j] is a dd number {hi,lo}
  // fifth pair EXACTLY degenerate
  const lamMod = top10.slice();
  const mean = (lamMod[8] + lamMod[9]) / 2;
  lamMod[8] = mean;
  lamMod[9] = mean;
  // S' = Qg diag(lamMod) Qg^T, formed in FULL double-double (exact degenerate pair carried in)
  const SpDD = [];
  for (let i = 0; i < NPHI; i++) { SpDD.push([]); for (let j = 0; j < NPHI; j++) SpDD[i].push(ddc(0)); }
  for (let i = 0; i < NPHI; i++) {
    for (let j = i; j < NPHI; j++) {
      let acc = ddc(0);
      for (let m = 0; m < NPHI; m++) {
        acc = ddAdd(acc, ddMul(ddMul(Qg[i][m], ddc(lamMod[m])), Qg[j][m]));
      }
      SpDD[i][j] = acc; SpDD[j][i] = acc;
    }
  }
  // fp64 view of the SAME matrix, then solve both ways
  const Sp = [];
  for (let i = 0; i < NPHI; i++) { Sp.push(new Float64Array(NPHI)); for (let j = 0; j < NPHI; j++) Sp[i][j] = SpDD[i][j].hi + SpDD[i][j].lo; }
  const evFp64 = jacobiFp64(Sp, NPHI);
  const evDD = jacobiDDmat(SpDD, NPHI);
  // fifth pair = entries 8,9 (descending)
  const spreadFp64 = Math.abs(evFp64[8] - evFp64[9]) / evFp64[8];
  const spreadDD = Math.abs(evDD[8] - evDD[9]) / Math.abs(evDD[8]);
  const kappaPair = top10[0] / mean; // lambda_1/lambda_9
  const cRealized = spreadFp64 / (NPHI * kappaPair * EPS);
  const spreadUlps = spreadFp64 / EPS;
  const secs = ((Date.now() - t0) / 1000).toFixed(1);
  return { N, U, sigma4: mean / top10[0], kappaPair, spreadFp64, spreadUlps, spreadDD, cRealized, secs, top10 };
}

const rungs = process.argv.slice(2).map(Number);
const list = rungs.length ? rungs : [160, 240, 320, 400];
for (const N of list) {
  const r = measureRung(N);
  console.log(`N=${r.N} U=${r.U} (${r.secs}s)`);
  console.log(`  sigma4=${r.sigma4.toFixed(12)} kappa_pair=${r.kappaPair.toFixed(12)}`);
  console.log(`  spreadFp64=${r.spreadFp64.toExponential(6)} (${r.spreadUlps.toFixed(3)} ULP)`);
  console.log(`  spreadDD  =${r.spreadDD.toExponential(6)}`);
  console.log(`  c_realized=${r.cRealized.toFixed(6)}`);
}
