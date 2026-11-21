/**
 * rh-route-i-pencil-highres-map (2026-09-23) — HIGH-RESOLUTION NUMERICAL MAP of the Route I pencil
 *     D_S c = mu L_S c   on the pole-free subspace of L^2(-a, a)      (semilocal S = {oo, 2} Sonine/Weil form),
 * Weil positivity on g-support 2a  <=>  mu_max(a) < 1, and 1 - mu_max(a) = min_h W(h)/L_S(h) over the constrained
 * subspace (normalized Weil-positivity margin). Companion to rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js
 * (Route I, N = 32 Galerkin, coarse D_S quadrature); this module supplies the numerics for the analytic attempt on
 * D_S <= L_S and does NOT edit the Route I module. RH open; no refereed bound is changed; NO QED; no bound moved.
 *
 * METHOD. Legendre Galerkin on L^2(-a,a) (Route H assembly) at N = 64, 96, 128; Toeplitz form of the remainder
 *  (D_S)_{mn} = int_0^{2a} delta_S(e^v) fs_{mn}(v) dv on a mesh graded (2^-j, j <= 34) toward the log spikes v = 0 and
 *  v = ln 2, GL-12 per cell, plain panel width min(0.25, 3a/N) so degree-N autocorrelations are resolved; V = 3N
 *  nodes for the archimedean term. Quadrature check: (J, panel) = (34, 3a/N) vs (44, 1.5a/N) agree to < 2e-7 at
 *  N = 128. L_S = Arch - P_2 + D_S (exact identity, matrix-wise); pencil solved as L_S^{-1/2} D_S L_S^{-1/2}.
 *  Constraint sets: pole-free {hhat(+-i/2) = 0} plus k vanishing moments int u^j h(u) du = 0, j < k (hhat vanishing to
 *  order k at t = 0; even j constrains the even sector, odd j the odd sector). N-convergence is algebraic (~N^-2, the
 *  interior log spike of the kernel at |u - v| = ln 2): mu_max(0.5; k=0) = 0.9671131 (N=32), 0.9672121 (48),
 *  0.9672463 (64), 0.9672724 (96), 0.9672823 (128), N^-2-extrapolated 0.96730; N = 96 -> 128 shifts <= 5e-5 for every
 *  (a, k) on the grid. Route I's N = 32 literal 0.966974 was quadrature-limited by 1.4e-4 (GL-8, J = 30, panel 0.25).
 *
 * RESULTS (N = 128, extrapolated in parentheses where it differs in the 5th decimal).
 *  (1) NO CROSSING BELOW (ln 3)/2. mu_max(a; k = 0) rises monotonically 0.21232 (a = 0.30), 0.29933 (ln2/2), 0.60304
 *      (0.40), 0.80802 (0.44), 0.96728 (0.50), 0.99577 (0.54), 0.99716 ((ln 3)/2): margin 1 - mu_max = 2.84e-3 at
 *      (ln 3)/2, positive throughout. sup over a <= (ln 3)/2 of mu_max(a; k) is attained at (ln 3)/2 for every k
 *      (all columns monotone in a).
 *  (2) CROSSING OF THE p = 2-ONLY PENCIL PAST ln 3. mu_max(a; 0) = 0.99761 (0.56), 1.05202 (0.58), 1.11382 (0.60);
 *      bisection: a* = 0.565818 (N = 64), 0.565792 (N = 96), extrapolated a* = 0.56578, 2a* = 1.1316 = ln 3 + 0.033.
 *      The crossing vector is ODD (a*(k=0) = a*(k=1) to 1e-6; even fraction 1e-26): at a*, Arch(h) = 0.36370, P_2(h)
 *      = 0.36366 (Arch - P_2 = 3e-5), |hhat|^2 peaked at t = 8.85 inside the first p = 2 resonance window with 52% of
 *      its energy below t_1 = 2pi/ln2. The TRUE Weil form is still positive there: W(h) = 0.02038 because
 *      P_3(h) = -0.02035 (g_h(ln 3) ~ h(a) h(-a) < 0 for odd h), so the pencil with D_S + P_3 has mu = 0.99866 at a*,
 *      0.99979 at a = 0.60 (< 1). p = 3 rescues the odd sector past ln 3 exactly as p = 2 rescued it past ln 2
 *      (Route H). The even (Slepian) sector of the p = 2-only pencil crosses 1 only near a = 0.59 (0.99801 at 0.58,
 *      1.00245 at 0.60 as the second pencil eigenvalue). So D_S <= L_S on pole-free h holds for 2a < 1.1316, fails
 *      beyond, and is Weil positivity only for 2a < ln 3.
 *  (3) CONSTRAINT LEVER (values at (ln 3)/2 = sup over the range): k = 0: 0.99716; k = 1 (hhat(0) = 0): 0.93162;
 *      k = 2 (+ hhat'(0) = 0): 0.46061; k = 3: 0.22802; k = 4: 0.19039; k = 5: 0.19039; k = 6: 0.17320; k = 7:
 *      0.12253; k = 8: 0.09604. TWO vanishing moments give a uniform margin 1 - mu_max >= 0.539 on all of
 *      a in [0.30, (ln 3)/2]; one moment gives 0.0684 (uniform). Steps that leave mu unchanged (k = 4 -> 5 at
 *      (ln 3)/2, k = 3 -> 4 at 0.5) are where the added moment has the wrong parity for the current extremal. The
 *      second pencil eigenvalue at k = 0 equals mu_max at k = 1 (the runner-up direction is odd, so it satisfies
 *      hhat(0) = 0 automatically): the k = 1 constraint works by removing the even Slepian direction, not by
 *      subtracting the t ~ 0 window from it. Comparison of constraint families at (ln 3)/2, N = 96: moments /
 *      Slepian (band |t| < gamma_1, c = a gamma_1 = 7.76, eigenvalues 0.999997, 0.99982, 0.99563, 0.9462, 0.6918,
 *      0.2615, 0.0437) / optimal (W|pf eigenvectors): k = 2: 0.4605 / 0.3243 / 0.2674; k = 4: 0.1904 / 0.2337 /
 *      0.1188; k = 8: 0.0960 / 0.1019 / 0.0664. Moments are within a factor ~1.7 of the optimal 2-constraint set;
 *      the Slepian count (~5 functions under gamma_1) overestimates the constraints needed.
 *  (4) SYMBOL ANATOMY (Toeplitz symbols on the line; w = 2theta' - m_2 is the symbol of Arch - P_2 = L_S - D_S,
 *      deltahat_S of D_S, Lhat_S = w + deltahat_S of L_S). w < 0 exactly on [0, 3.597) and on the p = 2 RESONANCE
 *      WINDOWS I_k around t_k = 2 pi k/ln 2 where m_2 > 2theta': (8.145, 9.875), (17.542, 18.699), (26.719, 27.662),
 *      (35.850, 36.664), (44.961, 45.684), (54.063, 54.713) — widths 1.730, 1.157, 0.943, 0.814, 0.723, 0.650, depths
 *      min w = -2.981, -2.286, -1.881, -1.594, -1.371, -1.188 (at t_k), int_{I_k} w = -2.432, -1.451, -1.027, -0.775,
 *      -0.603, -0.478; the archimedean window [0, 3.597) has min w = -8.719 at 0, int w = -6.997. The pencil symbol
 *      deltahat_S/Lhat_S = 1 - w/Lhat_S exceeds 1 exactly where w < 0: 134.0 at t = 0, 9.13 / 7.15 / 5.70 / 4.59 / 3.85
 *      / 3.27 at t_1..t_6. Windows close at t ~ 181 where 2theta' > max m_2 = 3.3468 (Route I).
 *  (5) WHERE THE EXTREMAL'S NEGATIVITY SITS. Decomposing W(h) = (1/2pi) int w(t) |hhat(t)|^2 dt over the sign windows
 *      of w for the pencil extremals (N = 96; symbol integral reproduces the quadratic form to <= 1.3e-2 relative,
 *      tail t > 200 omitted): a = (ln 3)/2, k = 0 (even, |hhat|^2 peak t = 7.55, 25% energy below 6, 74% below t_1,
 *      98% below gamma_1): [0, 3.6) -0.0092, [3.6, 8.15) +0.226, I_1 -0.341, [9.9, 17.5) +0.126, I_2 -0.0046;
 *      W = 0.00095, L_S = 0.3329. The dominant negative contribution is the FIRST p = 2 RESONANCE WINDOW (-0.341,
 *      i.e. 102% of L_S(h)), not the archimedean window at t ~ 0 (-0.009, 2.8%). a = 0.5, k = 0: -0.0078 / +0.209 /
 *      -0.350 / +0.156 / -0.010, W = 0.0119. k = 1 extremal (odd, peak t = 9.0-9.5): I_1 -0.408 / -0.343, I_2
 *      -0.031 / -0.057. k = 2 (even, peak 10.35 at (ln3)/2, 19.05 at 0.5): I_1 -0.224 / -0.086, I_2 -0.125 / -0.125.
 *      k = 3: I_2 dominates (-0.173 / -0.170). As moments are added the extremal migrates outward from I_1 to I_2.
 *  (6) D_S AS A FORM. Sign-indefinite with lambda_min -0.07136 (a = 0.5) / -0.08670 ((ln 3)/2), lambda_max 2.14499 /
 *      2.31368 (N = 128, N-stable to 1e-5); the number of negative eigenvalues grows with N (7, 11, 15, 22, 30 at
 *      N = 32..128, a = 0.5): they are Szego samples of the negative lobes of deltahat_S (sign changes at 4.05, 7.83,
 *      10.19, 13.25, 15.05, 17.33, 18.89, 20.79, ...). Negative eigenvectors at a = 0.5: -0.0714 (even, |hhat|^2
 *      peak t = 13.7), -0.0469 (odd, 22.7), -0.0303 (even, 31.9), -0.0232 (odd, 40.9) — each sits in a negative lobe of
 *      deltahat_S between resonances. Top eigenvector +2.145 is the t ~ 0 direction (90% energy below t = 6);
 *      next +0.423 (odd, peak 9.75) and +0.365 (even, 8.35) sit on the first resonance. lambda_min(L_S) = 0.09922
 *      (a = 0.5), 0.09336 ((ln 3)/2); lambda_min(L_S|pf) = 0.35649, 0.30806.
 *
 * WHAT THIS TELLS THE ANALYTIC ATTEMPT. (a) The inequality D_S <= L_S on pole-free h is numerically TRUE with margin
 *  >= 2.8e-3 on 2a <= ln 3 and FALSE for 2a > 1.1316 (odd sector; the true Weil form needs -P_3 there); any proof of
 *  it must therefore use 2a < ln 3 (or < 1.1316) and cannot be a support-independent operator inequality.
 *  (b) The object to control is the p = 2 resonance window I_1 = (8.145, 9.875) (and I_2), not the archimedean t ~ 0
 *  window: the extremal's negativity is ~100% of L_S(h) from I_1 and < 3% from [0, 3.6). Vanishing moments at t = 0
 *  act through the uncertainty principle (support 2a <= 1.1 => bandwidth ~ pi/a ~ 5.7 >= window widths), pushing the
 *  extremal to outer windows whose depth and width decay; two moments already give 1 - mu_max >= 0.54 uniformly on
 *  [0.30, (ln 3)/2]. A finite constraint count suffices NUMERICALLY for a large margin; the unconstrained margin
 *  (2.8e-3 at (ln 3)/2) is the one an unconditional proof would have to reproduce. Nothing here is a proof; RH open.
 *
 * Import-light (Route I / Route H exports only; no zeros bundle). Assertions recompute N = 24 pencils at four a
 * (~6 s) and the analytic symbol windows; high-res literals are baked and checked for internal consistency.
 */

import { weilForm, coeffs } from './rh-route-h-connes-scaling-site-weil-positivity-2026-09-23.js';
import { deltaS, complementBasis, compress, twoThetaPrime, m2 } from './rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js';

const LN2 = Math.LN2, LN3 = Math.log(3), PI = Math.PI;

// ---- linear algebra (Jacobi, sizes <= 128)
function jacobiEig(Ain) {
  const n = Ain.length; const A = Ain.map((r) => Float64Array.from(r)); const V = Array.from({ length: n }, (_, i) => { const r = new Float64Array(n); r[i] = 1; return r; });
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] ** 2;
    if (off < 1e-28) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(A[p][q]) < 1e-300) continue;
      const th = (A[q][q] - A[p][p]) / (2 * A[p][q]); const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
      const c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const akp = A[k][p], akq = A[k][q]; A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq; }
      for (let k = 0; k < n; k++) { const apk = A[p][k], aqk = A[q][k]; A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk; }
      for (let k = 0; k < n; k++) { const vkp = V[k][p], vkq = V[k][q]; V[k][p] = c * vkp - s * vkq; V[k][q] = s * vkp + c * vkq; }
    }
  }
  const idx = Array.from({ length: n }, (_, i) => i).sort((i, j) => A[i][i] - A[j][j]);
  return { vals: idx.map((i) => A[i][i]), vecs: idx.map((i) => Array.from(V, (r) => r[i])) };
}
const addM = (A, B, sB = 1) => A.map((r, m) => Array.from(r, (x, n) => x + sB * B[m][n]));
const matmul = (A, B) => { const m = B[0].length, k = B.length; return A.map((r) => { const o = new Array(m).fill(0); for (let l = 0; l < k; l++) { const x = r[l]; if (x === 0) continue; const Bl = B[l]; for (let j = 0; j < m; j++) o[j] += x * Bl[j]; } return o; }); };
/** generalized pencil D c = mu L c on span(B) (L > 0 there): all eigenvalues ascending */
export function pencilEigs(D, L, B) {
  const Lc = compress(L, B), Dc = compress(D, B); const eL = jacobiEig(Lc); const n = Lc.length;
  const Linvh = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => { let s = 0; for (let k = 0; k < n; k++) s += eL.vecs[k][i] * eL.vecs[k][j] / Math.sqrt(eL.vals[k]); return s; }));
  return { mus: jacobiEig(matmul(matmul(Linvh, Dc), Linvh)).vals, lamLmin: eL.vals[0] };
}

// ---- resolution-scaled graded mesh + Toeplitz form
function gaussLegendre(n) {
  const x = new Float64Array(n), w = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let z = Math.cos(PI * (i + 0.75) / (n + 0.5));
    for (let it = 0; it < 100; it++) {
      let p0 = 1, p1 = z;
      for (let k = 2; k <= n; k++) { const p2 = ((2 * k - 1) * z * p1 - (k - 1) * p0) / k; p0 = p1; p1 = p2; }
      const dp = n * (z * p1 - p0) / (z * z - 1); const dz = p1 / dp; z -= dz;
      if (Math.abs(dz) < 1e-15 || it === 99) { x[i] = z; w[i] = 2 / ((1 - z * z) * dp * dp); break; }
    }
  }
  return { x, w };
}
const GL12 = gaussLegendre(12);
export function gradedMesh(spikes, umax, J, panel, gl = GL12) {
  const pts = [], wts = [];
  const cellsBetween = (a, b, sa, sb) => {
    const mid = (a + b) / 2;
    const side = (lo, hi, towardLo) => {
      const L = hi - lo; let prev = 0;
      for (let j = J; j >= 0; j--) {
        const e = L * Math.pow(2, -j); const d0 = prev, d1 = e; prev = e;
        const c0 = towardLo ? lo + d0 : hi - d1, c1 = towardLo ? lo + d1 : hi - d0; const h = (c1 - c0) / 2, m = (c0 + c1) / 2;
        for (let i = 0; i < gl.x.length; i++) { pts.push(m + h * gl.x[i]); wts.push(h * gl.w[i]); }
      }
    };
    const plain = (lo, hi) => { const h = (hi - lo) / 2; for (let i = 0; i < gl.x.length; i++) { pts.push(lo + h + h * gl.x[i]); wts.push(h * gl.w[i]); } };
    if (sa) side(a, mid, true); else plain(a, mid);
    if (sb) side(mid, b, false); else plain(mid, b);
  };
  const S = spikes.filter((s) => s < umax).sort((a, b) => a - b);
  for (let k = 0; k < S.length; k++) {
    const a = S[k], b = k + 1 < S.length ? S[k + 1] : umax; const np = Math.max(1, Math.ceil((b - a) / panel));
    for (let p = 0; p < np; p++) cellsBetween(a + (b - a) * p / np, a + (b - a) * (p + 1) / np, p === 0, p === np - 1 && k + 1 < S.length);
  }
  return { pts: Float64Array.from(pts), wts: Float64Array.from(wts) };
}
/** (D)_{mn} = int_0^{2a} K(v) fs_{mn}(v) dv with K graded at the spikes and panel width min(0.25, 3a/N) */
export function toeplitzFormHiRes(wf, K, spikes, J = 34, panelFactor = 3) {
  const N = wf.N, a = wf.a; const mesh = gradedMesh(spikes, 2 * a, J, Math.min(0.25, panelFactor * a / N));
  const D = Array.from({ length: N }, () => new Float64Array(N));
  for (let i = 0; i < mesh.pts.length; i++) { const v = mesh.pts[i]; if (v >= 2 * a) continue; const kv = K(v) * mesh.wts[i]; const FS = wf.fsMat(v); for (let m = 0; m < N; m++) { const Dm = D[m], Fm = FS[m]; for (let n = 0; n < N; n++) Dm[n] += kv * Fm[n]; } }
  return D;
}
/**
 * mu_max(a; k) for k = 0..KMAX vanishing moments on the pole-free space, plus lambda_min of the Weil form (Arch - all
 * primes) on the same subspace and, when p = 3 is in range, the pencil with D_S + P_3. Cheap at N <= 32.
 */
export function pencilMap(a, N, KMAX = 3, { J = 30, panelFactor = 3 } = {}) {
  const wf = weilForm(a, N, { V: Math.max(160, 3 * N) });
  const DS = toeplitzFormHiRes(wf, (v) => deltaS(Math.exp(v)), [0, LN2], J, panelFactor);
  const P2 = wf.primeTerms[2] || Array.from({ length: N }, () => new Float64Array(N)); const P3 = wf.primeTerms[3] || null;
  const LS = addM(addM(wf.Arch, P2, -1), DS), Wpf = addM(wf.Arch, wf.Prime, -1);
  const cons = [Array.from(coeffs(wf, (u) => Math.exp(-u / 2))), Array.from(coeffs(wf, (u) => Math.exp(u / 2)))];
  const mus = [], mu3 = [], lamW = []; let mu2 = null, lamLSpf = null;
  for (let k = 0; k <= KMAX; k++) {
    if (k > 0) cons.push(Array.from(coeffs(wf, (u) => Math.pow(u, k - 1))));
    const B = complementBasis(N, cons); const P = pencilEigs(DS, LS, B); mus.push(P.mus[P.mus.length - 1]);
    if (k === 0) { mu2 = P.mus[P.mus.length - 2]; lamLSpf = P.lamLmin; }
    lamW.push(jacobiEig(compress(Wpf, B)).vals[0]);
    if (P3) { const Q = pencilEigs(addM(DS, P3), LS, B); mu3.push(Q.mus[Q.mus.length - 1]); }
  }
  return { a, N, mus, mu2, mu3, lamW, lamLSpf, lamDSmin: jacobiEig(DS).vals[0] };
}
/** Weil symbol w(t) = 2 theta'(t) - m_2(t) (symbol of Arch - P_2 = L_S - D_S on the line) */
export const weilSymbol = (t) => twoThetaPrime(t) - m2(t);
/** sign changes of a function on [lo, hi] by scanning + bisection */
export function signChanges(f, lo, hi, step = 1e-3) {
  const out = []; let prev = f(lo);
  for (let t = lo + step; t <= hi + 1e-12; t += step) { const v = f(t); if (v * prev < 0) { let a = t - step, b = t; for (let i = 0; i < 40; i++) { const m = (a + b) / 2; if (f(m) * f(a) <= 0) b = m; else a = m; } out.push((a + b) / 2); } prev = v; }
  return out;
}

// ---- baked high-resolution literals (tmp/route-i-pencil-highres.mjs; JSON in tmp/route-i-pencil-*.json)
export const PENCIL_HIGHRES_LITERALS = Object.freeze({
  method: { N: [64, 96, 128], quadrature: 'GL-12, J = 34 graded at v = 0 and ln 2, panel min(0.25, 3a/N), V = 3N; cross-check (44, 1.5a/N) agrees < 2e-7', constraints: 'pole-free {hhat(+-i/2)=0} + k moments int u^j h = 0, j < k' },
  convergenceA05: { N: [32, 48, 64, 96, 128], mu0: [0.9671131, 0.9672121, 0.9672463, 0.9672724, 0.9672823], mu1: [0.6818875, 0.6822353, 0.6823638, 0.6824648, 0.6825035], lamDSmin: [-0.0712019, -0.0713096, -0.0713364, -0.0713525, -0.0713564], lamDSmax: [2.1449892, 2.1449897, 2.1449909, 2.1449929, 2.1449907], nNegDS: [7, 11, 15, 22, 30], lamLS: [0.0992371, 0.0992273, 0.0992248, 0.0992236, 0.0992209], lamLSpf: [0.3566419, 0.3565534, 0.3565218, 0.3564978, 0.3564859], extrapolatedMu0: 0.96730, routeIN32Literal: 0.966974, quadratureCrossCheckN128: 0.9672823363 },
  convergenceALn3Half: { N: [32, 48, 64, 96, 128], mu0: [0.9971401, 0.9971521, 0.9971567, 0.9971589, 0.9971599], mu1: [0.9309311, 0.9313321, 0.9314428, 0.9315457, 0.9315813], lamDSmin: [-0.0866084, -0.0866659, -0.0866853, -0.0866971, -0.0867000], lamDSmax: 2.3136833, lamLS: 0.0933639, lamLSpf: 0.3080700 },
  /** [a, mu_max(a; k) for k = 0..8] at N = 128 (N^-2 extrapolation differs by <= 1e-4 everywhere) */
  gridN128: [
    [0.30, 0.212319, 0.114572, 0.081036, 0.061023, 0.047390, 0.038847, 0.033514, 0.029345, 0.025803],
    [0.32, 0.245474, 0.126939, 0.089646, 0.067809, 0.053019, 0.042627, 0.036373, 0.032061, 0.028360],
    [0.34, 0.284559, 0.139318, 0.099115, 0.074312, 0.059080, 0.047059, 0.039382, 0.034592, 0.030907],
    [LN2 / 2, 0.299335, 0.143050, 0.102732, 0.076253, 0.061218, 0.048576, 0.040515, 0.035371, 0.031737],
    [0.36, 0.355919, 0.146863, 0.116126, 0.078761, 0.066716, 0.051777, 0.042941, 0.037464, 0.033054],
    [0.38, 0.476927, 0.150888, 0.129302, 0.091711, 0.069082, 0.063462, 0.045382, 0.040630, 0.036828],
    [0.40, 0.603040, 0.165498, 0.132112, 0.122574, 0.069882, 0.067278, 0.061020, 0.041084, 0.040146],
    [0.42, 0.715313, 0.237287, 0.140892, 0.140892, 0.093247, 0.069587, 0.069587, 0.056969, 0.041271],
    [0.44, 0.808022, 0.339880, 0.146195, 0.146195, 0.129733, 0.072947, 0.072127, 0.072127, 0.052985],
    [0.46, 0.880117, 0.452578, 0.157206, 0.154331, 0.154331, 0.100469, 0.075901, 0.075901, 0.071431],
    [0.48, 0.932531, 0.568544, 0.200025, 0.165850, 0.165850, 0.133171, 0.085605, 0.080961, 0.080961],
    [0.50, 0.967282, 0.682504, 0.260160, 0.168606, 0.168606, 0.161086, 0.107390, 0.082548, 0.082548],
    [0.52, 0.987162, 0.790419, 0.333984, 0.183686, 0.179789, 0.179789, 0.134089, 0.095322, 0.088450],
    [0.54, 0.995769, 0.889292, 0.418426, 0.212398, 0.188802, 0.188802, 0.161530, 0.112966, 0.090928],
    [LN3 / 2 - 1e-6, 0.997160, 0.931577, 0.460545, 0.228000, 0.190395, 0.190395, 0.173182, 0.122518, 0.096032],
    [0.56, 0.997614, 0.976958, 0.510717, 0.247704, 0.190973, 0.190973, 0.184959, 0.134479, 0.102808],
    [0.58, 1.052021, 1.052021, 0.608358, 0.289791, 0.204237, 0.201118, 0.201118, 0.158864, 0.117576],
    [0.60, 1.113817, 1.113817, 0.708801, 0.339182, 0.227315, 0.209316, 0.209316, 0.183436, 0.135111],
  ],
  /** second pencil eigenvalue at k = 0 (N = 128): equals mu_max(k = 1) where the runner-up is odd */
  mu2N128: { a050: 0.68250, aLn3Half: 0.93158, a056: 0.97696, a058: 0.99801, a060: 1.00245 },
  /** pencil with D_S + P_3 (= Weil positivity for (ln3)/2 < a < (ln 5)/2), N = 128, k = 0..3 */
  withP3N128: { a056: [0.998236, 0.956862, 0.584528, 0.229245], a058: [0.999353, 0.981056, 0.771751, 0.308494], a060: [0.999791, 0.992214, 0.879621, 0.467730] },
  lamLSpfN128: { a030: 0.87676, aLn2Half: 0.77531, a040: 0.56552, a050: 0.35649, aLn3Half: 0.30806, a060: 0.26933 },
  crossing: { aStarN64: 0.565818, aStarN96: 0.565792, aStarExtrapolated: 0.56578, twoAStar: 1.1316, ln3: LN3, parity: 'odd', evenSectorCrossing: '~0.59 (mu2 = 0.99801 at 0.58, 1.00245 at 0.60)', atAStar: { Arch: 0.36370, P2: 0.36366, W: 0.02038, P3: -0.02035, muWithP3: 0.99866, hhatPeakT: 8.85, energyBelowT1: 0.524 } },
  /** imp-96064: crossing a*(pole-free) firmed up beyond the original two N values. mu_max(a; k=0) = 1 located by
   *  2-point linear interpolation on a in [0.5654, 0.5660] (mu changes ~2.3e-3 across the bracket, near-linear);
   *  the k=0 and k=1 eigenvalues coincide to <= 1.5e-14 at every N (odd crossing vector). N = 224 is beyond this
   *  Jacobi assembly: the compressed L_S on the pole-free basis loses positivity (lamLSpf = -6.57, lamDSmin drifts
   *  to -0.409 vs the correct ~-0.087) so L_S^-1/2 produces NaN; N = 192 is the finest stable point (lamLSpf = 0.295). */
  crossingHighN: {
    N: [64, 96, 128, 160, 192],
    aStar: [0.565818, 0.565792, 0.565783, 0.565778, 0.565775],
    lamLSpfAt0p566: { N192: 0.29488, N224: -6.573 },
    richardsonPairs: [0.5657712, 0.5657714, 0.5657691, 0.5657682], // N^-2 extrapolation over consecutive pairs
    aStarRichardson: 0.565770, errorBar: 3.3e-6, // finest-3 mean 0.5657696, full-range spread 3.2e-6
    twoAStarRichardson: 1.131539, twoAStarMinusLn3: 0.032927,
    note: 'confirms aStarExtrapolated 0.56578 (the original two-value estimate was high by ~1e-5); N >= 224 unstable',
  },
  /** imp-96106 (measured, tmp/imp-96106-scratch.mjs + tmp/imp-96106-locate.mjs): pin the honestLimits N >= 224
   *  assembly obstruction and TEST the two candidate fixes it names. a = 0.5, default pencil pipeline.
   *  (1) ONSET. lambda_min(L_S) stays SPD and flat at +0.099221 through N = 196 and 200 (cond(L_S) ~ 84), then
   *      collapses ABRUPTLY at N = 204 to -4.893 and worsens monotonically: lamLSmin(N) = +0.099220 (196), +0.099219
   *      (200), -4.8929 (204), -5.5899 (208), -5.9702 (212), -6.2173 (216), -6.3805 (220), -6.4806 (224). It is a
   *      discrete blow-up, not a gradual approach of lambda_min to the machine floor; the finest STABLE point is
   *      N = 200 (the crossingHighN sequence stopped at 192 and can be nudged to include 196, 200). D_S itself corrupts
   *      in lockstep: lamDSmin = -0.071359 (<=200) drifts to -0.077788 (204), -0.37136 (224).
   *  (2) D_S-QUADRATURE REFINEMENT DOES NOT HELP (refutes the honestLimits "extended precision on the D_S Toeplitz
   *      quadrature" route). Sweeping (J, panelFactor) from the default (30, 3) to (44, 1.0) to (60, 0.5) leaves every
   *      eigenvalue UNCHANGED to printed precision at BOTH N = 192 (stable) and N = 224 (broken): lamDSmin -0.0714,
   *      lamLSmin -6.4806, lamLSpfMin -6.4806 identical across all three settings at N = 224.
   *  (3) MORE ARCHIMEDEAN QUADRATURE HURTS. At N = 224, raising V from 3N to 5N to 8N leaves lamDSmin fixed at -0.37136
   *      and drives lamLSmin FURTHER negative (-6.4806 -> -7.4991 -> -8.4369).
   *  VERDICT: the obstruction is a double-precision Legendre-Galerkin BASIS conditioning wall at degree ~200 (the
   *  high-degree orthonormalized Legendre products lose accuracy in both D_S and Arch), not a remainder- or
   *  archimedean-quadrature resolution limit. A differently-conditioned assembly (extended precision across the whole
   *  Galerkin build, or a better-conditioned prolate/shifted-Chebyshev basis) would be required to reach N >= 204;
   *  refining the Toeplitz quadrature alone cannot. No bound, margin, or verified height changes; RH open; NO QED. */
  conditioningObstruction: {
    a: 0.5, finestStableN: 200, onsetN: 204, condLSStable: 84,
    lamLSmin: { N196: 0.099220, N200: 0.099219, N204: -4.8929, N208: -5.5899, N212: -5.9702, N216: -6.2173, N220: -6.3805, N224: -6.4806 },
    lamDSmin: { stableLE200: -0.071359, N204: -0.077788, N224: -0.37136 },
    dsQuadRefinementInvariant: true, // (J, panelFactor) in {(30,3),(44,1.0),(60,0.5)} give identical eigs at N=192 and N=224
    archNodeCountNoHelp: { lamLSminAt224: { V3N: -6.4806, V5N: -7.4991, V8N: -8.4369 }, lamDSminInvariant: -0.37136 },
    verdict: 'double-precision Legendre basis conditioning wall at degree ~200; abrupt (SPD cond~84 at N=200, indefinite at N=204); NOT a remainder- or archimedean-quadrature-resolution limit; D_S-quadrature extended precision alone refuted; map extendable to N=200; RH open; NO QED',
  },
  constraintFamiliesLn3Half: { N: 96, k: [0, 1, 2, 3, 4, 5, 6, 7, 8], moments: [0.9971589, 0.9315457, 0.4605021, 0.2279864, 0.1903956, 0.1903956, 0.1731696, 0.1225070, 0.0960235], slepian: [0.9971589, 0.9315457, 0.3243181, 0.2337244, 0.2337244, 0.2152530, 0.1415009, 0.1095564, 0.1019487], optimalWeilEig: [0.9971589, 0.9315457, 0.2673586, 0.2069117, 0.1187660, 0.1087365, 0.1087365, 0.0793410, 0.0664163], slepianEigs: [0.999997, 0.999816, 0.995634, 0.946191, 0.691777, 0.261525, 0.043677, 0.004016, 0.000255], c: 7.7647 },
  symbol: {
    wZeroCrossings: [3.597, 8.145, 9.875, 17.542, 18.699, 26.719, 27.662, 35.85, 36.664, 44.961, 45.684, 54.063, 54.713],
    resonanceWindows: [ // [k, t_k, lo, hi, width, min w (at t_k), int_window w, ratio deltahat/Lhat at t_k]
      [1, 9.0647, 8.145, 9.875, 1.730, -2.981, -2.432, 9.13], [2, 18.1294, 17.542, 18.699, 1.157, -2.286, -1.451, 7.15], [3, 27.1941, 26.719, 27.662, 0.943, -1.881, -1.027, 5.70],
      [4, 36.2588, 35.85, 36.664, 0.814, -1.594, -0.775, 4.59], [5, 45.3235, 44.961, 45.684, 0.723, -1.371, -0.603, 3.85], [6, 54.3882, 54.063, 54.713, 0.650, -1.188, -0.478, 3.27],
    ],
    archWindow: { hi: 3.597, minW: -8.7190, intW: -6.997, ratioAt0: 134.05, deltaHat0: 8.7845, LHat0: 0.06553 },
    positiveWindows: { w1: [3.597, 8.145, 1.644, 0.5401], w2: [9.875, 17.542, 8.731, 1.4135], w3: [18.699, 26.719, 12.800, 1.8862] }, // [lo, hi, int w, max w]
    deltaHatSignChanges: [4.05, 7.83, 10.19, 13.25, 15.05, 17.33, 18.89, 20.79, 22.09, 23.75, 24.93, 26.53, 27.85, 29.55, 30.85],
    deltaHatMin: { t: 46.28, value: -0.4549 },
  },
  extremalAnatomy: { // N = 96; cum = fraction of |hhat|^2 energy below t; parts = (1/2pi) int_window w |hhat|^2 over w-sign windows [0,3.6),[3.6,8.15),I_1,[9.9,17.5),I_2,...
    aLn3Half: [
      { k: 0, mu: 0.9971589, parity: 'even', peakT: 7.55, cum: { t6: 0.248, t9: 0.737, t14: 0.983 }, LS: 0.33288, DS: 0.33194, W: 0.000946, Arch: 0.14949, P2: 0.14854, parts: [-0.0092, 0.2264, -0.3412, 0.1262, -0.0046, 0.0022], symbolIntegral: 0.000897 },
      { k: 1, mu: 0.9315457, parity: 'odd', peakT: 9.0, cum: { t6: 0.081, t9: 0.486, t14: 0.897 }, LS: 0.48362, DS: 0.45051, W: 0.03311, Arch: 0.40117, P2: 0.36807, parts: [-0.0007, 0.1345, -0.4083, 0.2825, -0.0306, 0.0246], symbolIntegral: 0.02944 },
      { k: 2, mu: 0.4605021, parity: 'even', peakT: 10.35, cum: { t6: 0.012, t9: 0.168, t14: 0.547 }, LS: 0.76915, DS: 0.35419, W: 0.41495, Arch: 0.80686, P2: 0.39191, parts: [-0.00003, 0.0369, -0.2241, 0.3657, -0.1245, 0.2770], symbolIntegral: 0.40267 },
      { k: 3, mu: 0.2279864, parity: 'odd', peakT: 18.75, cum: { t6: 0.0002, t9: 0.006, t14: 0.022 }, LS: 1.04673, DS: 0.23864, W: 0.80809, Arch: 1.25810, P2: 0.45001, parts: [-0.0000002, 0.0011, -0.0101, 0.1907, -0.1730, 0.5703], symbolIntegral: 0.79507 },
    ],
    a05: [
      { k: 0, mu: 0.9672724, parity: 'even', peakT: 7.80, cum: { t6: 0.218, t9: 0.689, t14: 0.965 }, LS: 0.36281, DS: 0.35094, W: 0.011874, Arch: 0.19799, P2: 0.18612, parts: [-0.0078, 0.2088, -0.3504, 0.1558, -0.0104, 0.0087], symbolIntegral: 0.011076 },
      { k: 1, mu: 0.6824648, parity: 'odd', peakT: 9.5, cum: { t6: 0.053, t9: 0.363, t14: 0.794 }, LS: 0.59864, DS: 0.40855, W: 0.19009, Arch: 0.54862, P2: 0.35854, parts: [-0.0004, 0.0958, -0.3427, 0.3264, -0.0571, 0.1156], symbolIntegral: 0.18222 },
      { k: 2, mu: 0.2601320, parity: 'even', peakT: 19.05, cum: { t6: 0.004, t9: 0.062, t14: 0.220 }, LS: 1.01306, DS: 0.26353, W: 0.74953, Arch: 1.16248, P2: 0.41295, parts: [-0.00001, 0.0132, -0.0863, 0.1952, -0.1253, 0.4624], symbolIntegral: 0.72853 },
      { k: 3, mu: 0.1686070, parity: 'even', peakT: 17.30, cum: { t6: 0.00002, t9: 0.002, t14: 0.126 }, LS: 1.02421, DS: 0.17269, W: 0.85152, Arch: 1.07551, P2: 0.22399, parts: [-0.0000000025, 0.0002, -0.0055, 0.5730, -0.1697, 0.3326], symbolIntegral: 0.85128 },
    ],
    DSnegativeA05: [[-0.07135, 'even', 13.7], [-0.04694, 'odd', 22.7], [-0.03029, 'even', 31.9], [-0.02322, 'odd', 40.95]], // [lambda, parity, |hhat|^2 peak t]
    DStopA05: [[2.14499, 'even', 0, 0.897], [0.42259, 'odd', 9.75], [0.36487, 'even', 8.35]], // [lambda, parity, peak t, (energy below 6)]
    WpfLowA05: [0.011869, 0.189886, 0.828031, 0.865524, 1.101060], WpfLowLn3Half: [0.000946, 0.033105, 0.663491, 0.816160, 1.063514],
  },
  /** imp-96086 (SG-96065-tsymbol-tail): the omitted t > 200 tail of W(h) = (1/2pi) int w(t) |hhat(t)|^2 dt for the
   *  k = 0 pole-free extremal, reconstructed in the import-light leaf (tmp/imp-96086-tail.mjs, N = 96, M = 8000-node
   *  u-grid trapezoidal hhat, panel-graded D_S). head = symbolIntegral over t in [0, 200] (reproduces the baked
   *  extremalAnatomy.symbolIntegral); segTail = tail contribution over [200, 500], [500, 1000], [1000, 2000],
   *  [2000, 4000]; full = head + sum(segTail); W = quadratic form. Every tail segment is STRICTLY POSITIVE
   *  (w > 0 once the p = 2 resonance windows close at t ~ 181; no negative part), so the omitted tail is net positive
   *  and monotonically decaying as ~ln(t)/t^2. Integrating it to t = 4000 recovers ~95% of the symbolIntegral-vs-W
   *  gap; the residual gapRemain (0.26-0.34% of W) is the t > 4000 tail plus finite-N / finite-grid quadrature error.
   *  Confirms the truncationAudit claim: the ~5% gap is the omitted positive tail, not a defect of the identity. */
  tSymbolTailN96: {
    grid: 'M = 8000 u-nodes, dt = 0.005 (head) / 0.02 (tail), N = 96 pole-free k = 0 extremal; M = 4000 agrees to < 3% on each segment',
    aLn3Half: { head0to200: 0.0008971, W: 0.0009457, segTail: [2.9700e-5, 9.5187e-6, 4.7386e-6, 2.2651e-6], full: 0.0009433, gap0: 4.864e-5, gap0Pct: 5.14, gapRemain: 2.42e-6, gapRemainPct: 0.26, tailClosedPct: 95.0, tailAllPositive: true },
    a05: { head0to200: 0.0110748, W: 0.0118740, segTail: [4.7916e-4, 1.6024e-4, 7.9927e-5, 3.9228e-5], full: 0.0118333, gap0: 7.992e-4, gap0Pct: 6.73, gapRemain: 4.07e-5, gapRemainPct: 0.34, tailClosedPct: 94.9, tailAllPositive: true },
    tailWindows: 'segments start at t = 200 > 181 (where 2theta\' overtakes max m_2 = 3.3468), so w > 0 on the whole tail; segTail entries are all > 0 and decreasing',
  },
  /** imp-96088: a-dependence of the k = 0 pole-free extremal negativity window split (tmp/imp-96088-scratch.mjs,
   *  N = 96, dt = 0.005 symbol integral to t = 200, parts binned in the a-INDEPENDENT sign windows of w). Each row
   *  [a, mu_max, L_S(h), W(h), arch part [0, 3.597), I_1 part [8.145, 9.875), sum of all negative window parts,
   *  I_1/L_S, arch/L_S, I_1/sumNeg, |hhat|^2 peak t]. VERDICT: the p = 2-window dominance is NOT uniform in a.
   *  (1) The first resonance window I_1 grows from carrying only ~20% of L_S at a = 0.30 (I_1/L_S = -0.199) to
   *  ~100%+ near (ln 3)/2 (crosses -1 at a ~ 0.52, reaches -1.025 at (ln 3)/2): the "~100% from I_1" figure is
   *  specific to the top of the range, not uniform. (2) I_1s share of the TOTAL negativity (I_1/sumNeg) is
   *  non-uniform, dipping to 0.777 at a = 0.30 and 0.90-0.93 near a = 0.40 (the extremal peak sits at t = 12.3 -> 8.8
   *  there, spreading negativity into the outer windows I_2, I_3), peaking ~0.987 at a = 0.36 and settling ~0.96 at
   *  (ln 3)/2. (3) What IS uniform: the archimedean window [0, 3.597) is uniformly negligible, |arch/L_S| growing
   *  monotonically from 0.001 (a = 0.30) to only 0.028 ((ln 3)/2) and never exceeding 3%. The peak t migrates
   *  monotonically inward 12.3 -> 7.5 as a rises (uncertainty principle: bandwidth ~ pi/a shrinks). For a windowed
   *  positivity bound this means a SINGLE-window (I_1) argument only suffices near (ln 3)/2; at small a it must also
   *  control I_2 (and I_3). The a = 0.5 / (ln 3)/2 rows reproduce the baked extremalAnatomy k = 0 parts. NO QED. */
  extremalWindowSplitVsA: {
    N: 96, windowNote: 'parts[0] = arch [0, 3.597), parts[2] = I_1 [8.145, 9.875); sumNeg = sum of all negative window parts on [0, 60]',
    rows: [
      [0.30, 0.212319, 0.88256, 0.68493, -0.00086, -0.17534, -0.22557, -0.1987, -0.0010, 0.7773, 12.30],
      [0.32, 0.245475, 0.83632, 0.62107, -0.00118, -0.21160, -0.23987, -0.2530, -0.0014, 0.8821, 11.51],
      [0.34, 0.284558, 0.79861, 0.56194, -0.00160, -0.24774, -0.25740, -0.3102, -0.0020, 0.9625, 10.80],
      [LN2 / 2, 0.299335, 0.78916, 0.54199, -0.00176, -0.25937, -0.26505, -0.3287, -0.0022, 0.9786, 10.58],
      [0.36, 0.355912, 0.75079, 0.46629, -0.00228, -0.28547, -0.28931, -0.3802, -0.0030, 0.9867, 9.96],
      [0.38, 0.476912, 0.65663, 0.32925, -0.00307, -0.30612, -0.32887, -0.4662, -0.0047, 0.9308, 9.26],
      [0.40, 0.603019, 0.56801, 0.21628, -0.00381, -0.32081, -0.35604, -0.5648, -0.0067, 0.9011, 8.84],
      [0.42, 0.715292, 0.50083, 0.13687, -0.00457, -0.33390, -0.37059, -0.6667, -0.0091, 0.9010, 8.56],
      [0.44, 0.808001, 0.45102, 0.08296, -0.00534, -0.34388, -0.37700, -0.7624, -0.0119, 0.9121, 8.32],
      [0.46, 0.880097, 0.41350, 0.04724, -0.00615, -0.34985, -0.37757, -0.8461, -0.0149, 0.9266, 8.12],
      [0.48, 0.932516, 0.38477, 0.02454, -0.00696, -0.35180, -0.37432, -0.9143, -0.0181, 0.9398, 7.95],
      [0.50, 0.967272, 0.36281, 0.01108, -0.00775, -0.35038, -0.36884, -0.9657, -0.0214, 0.9499, 7.79],
      [0.52, 0.987156, 0.34660, 0.00407, -0.00847, -0.34679, -0.36254, -1.0005, -0.0244, 0.9566, 7.66],
      [0.54, 0.995767, 0.33590, 0.00130, -0.00904, -0.34271, -0.35699, -1.0203, -0.0269, 0.9600, 7.56],
      [LN3 / 2 - 1e-6, 0.997159, 0.33288, 0.00090, -0.00922, -0.34120, -0.35515, -1.0250, -0.0277, 0.9607, 7.53],
    ],
    uniform: 'archimedean window uniformly < 3% of L_S (|arch/L_S| in [0.001, 0.028], monotone in a)',
    nonUniform: 'I_1/L_S rises -0.199 -> -1.025 (crosses -1 at a ~ 0.52); I_1/sumNeg spans [0.777, 0.987] (dips at small a where negativity spreads to I_2, I_3)',
  },
  anchorsN24: { // pencilMap(a, 24, 3) with J = 34 (assertions use J = 30; difference < 1e-6)
    a05: { mus: [0.9669758, 0.6815098, 0.2589735, 0.1685116], lamW: [1.198e-2, 1.907e-1, 7.474e-1, 8.454e-1] },
    aLn3Half: { mus: [0.9970992, 0.9305684, 0.4589464, 0.2270384], lamW: [9.657e-4, 3.361e-2, 4.154e-1, 7.998e-1] },
    a056: { mus: [0.9975734, 0.9757949, 0.5093823, 0.2464063], mu3: [0.998196, 0.955983, 0.579853, 0.228450] },
    a0575: { mus: [1.0332876, 1.0332876, 0.5820234, 0.2772932], mu3: [0.999141, 0.976096, 0.727177, 0.235680], lamW0: 2.785e-4 },
  },
  /** imp-96111: FULL zero-crossing / negativity-window structure of the three Toeplitz line symbols out to t ~ 200
   *  (w = 2theta prime - m_2 = symbol of Arch - P_2 = L_S - D_S; deltahat_S = symbol of D_S; Lhat_S = w + deltahat_S =
   *  symbol of L_S). Derived in the import-light leaf (tmp/imp-96111-scratch.mjs): w and Lhat_S from the closed-form
   *  weilSymbol + a graded delta_S(e^u) cosine transform on all-spikes meshes umax = 24 (J = 30) vs umax = 32 (J = 34),
   *  which agree to <= 2.5e-5 at every t_k. Extends symbol.resonanceWindows (k <= 6) and symbol.deltaHatSignChanges
   *  (t <= 31) to the full range. FINDINGS. (1) w has 39 zero-crossings on [0, 200]; the archimedean window [0, 3.597)
   *  and 19 p = 2 resonance windows I_1..I_19 around t_k = 2 pi k/ln2 (k = 1..19) are ALL of its negativity: widths
   *  fall monotonically 1.730 -> 0.095 and depths |min w| = |w(t_k)| fall monotonically 2.981 -> 0.036. The windows
   *  CLOSE at k = 20 (t_20 = 181.294): w(t_20) = +0.015 > 0 (2theta prime overtakes m_2 = 3.3468). (2) deltahat_S has
   *  201 sign changes on (0.5, 200] (negative lobes between the resonances; global min ~ -0.455 at t = 46.28 = baked
   *  deltaHatMin). (3) Lhat_S = w + deltahat_S is STRICTLY POSITIVE pointwise on [0, 200] (global min 0.06565 at t = 0),
   *  so its only sign structure is the positivity margin; its local minima sit at the t_k (where w dips) and rise
   *  monotonically Lhat_S(t_1) = 0.3675 -> 1.08 (t = 199) as the resonance depths decay. Measurement only; the pencil
   *  eigenvalues / margin are unchanged (D_S never uses this symbol tabulation, cf. truncationAudit); RH open; NO QED. */
  symbolFullToT200: {
    deltahat0: 8.784644, Lhat0: 0.065650, meshCheck: 'umax=24/J=30 vs umax=32/J=34 agree <= 2.5e-5 at every t_k',
    lhatGlobalMin: { t: 0, value: 0.06565, positiveEverywhere: true },
    windowsCloseAt: { k: 20, tk: 181.2944, wAtTk: 0.0154, note: '2theta prime overtakes max m_2 = 3.3468; last negative resonance window is I_19 (t_19 = 172.230)' },
    deltahatSignChangeCountTo200: 201, deltahatFirstSignChanges: [4.04, 7.83, 10.20, 13.24, 15.05],
    /** [k, t_k, lo, hi, width, min w (= w(t_k)), int_window w] for every p = 2 resonance negativity window of w */
    wResonanceWindows: [
      [1, 9.0647, 8.144, 9.874, 1.730, -2.981, -2.432], [2, 18.1294, 17.542, 18.698, 1.157, -2.287, -1.451],
      [3, 27.1942, 26.719, 27.661, 0.943, -1.882, -1.027], [4, 36.2589, 35.849, 36.664, 0.814, -1.594, -0.775],
      [5, 45.3236, 44.961, 45.683, 0.722, -1.371, -0.603], [6, 54.3883, 54.062, 54.712, 0.650, -1.189, -0.478],
      [7, 63.4530, 63.157, 63.747, 0.591, -1.034, -0.382], [8, 72.5178, 72.247, 72.787, 0.539, -0.901, -0.307],
      [9, 81.5825, 81.335, 81.829, 0.493, -0.783, -0.246], [10, 90.6472, 90.421, 90.873, 0.452, -0.678, -0.196],
      [11, 99.7119, 99.505, 99.918, 0.413, -0.582, -0.155], [12, 108.7766, 108.588, 108.964, 0.376, -0.495, -0.121],
      [13, 117.8414, 117.671, 118.011, 0.340, -0.415, -0.092], [14, 126.9061, 126.753, 127.058, 0.305, -0.341, -0.068],
      [15, 135.9708, 135.835, 136.106, 0.270, -0.272, -0.048], [16, 145.0355, 144.918, 145.152, 0.234, -0.208, -0.032],
      [17, 154.1002, 154.002, 154.198, 0.195, -0.147, -0.019], [18, 163.1650, 163.089, 163.241, 0.152, -0.090, -0.009],
      [19, 172.2297, 172.182, 172.277, 0.095, -0.036, -0.002],
    ],
    /** [k, t_k, w(t_k), deltahat_S(t_k), Lhat_S(t_k), ratio deltahat/Lhat] — Lhat_S(t_k) is the local positivity min */
    lhatAtTk: [
      [1, 9.0647, -2.9808, 3.3483, 0.3675, 9.111], [2, 18.1294, -2.2873, 2.6595, 0.3722, 7.145],
      [3, 27.1942, -1.8817, 2.2819, 0.4002, 5.702], [4, 36.2589, -1.5940, 2.0381, 0.4441, 4.589],
      [5, 45.3236, -1.3709, 1.8523, 0.4814, 3.848], [6, 54.3883, -1.1886, 1.7122, 0.5236, 3.270],
      [7, 63.4530, -1.0344, 1.6065, 0.5721, 2.808], [8, 72.5178, -0.9009, 1.5240, 0.6231, 2.446],
      [9, 81.5825, -0.7831, 1.4400, 0.6569, 2.192], [10, 90.6472, -0.6777, 1.3691, 0.6914, 1.980],
      [11, 99.7119, -0.5824, 1.3106, 0.7282, 1.800], [12, 108.7766, -0.4954, 1.2608, 0.7654, 1.647],
      [13, 117.8414, -0.4154, 1.2178, 0.8025, 1.518], [14, 126.9061, -0.3412, 1.1829, 0.8417, 1.405],
      [15, 135.9708, -0.2722, 1.1468, 0.8746, 1.311], [16, 145.0355, -0.2077, 1.1147, 0.9070, 1.229],
      [17, 154.1002, -0.1471, 1.0820, 0.9349, 1.157], [18, 163.1650, -0.0899, 1.0579, 0.9679, 1.093],
      [19, 172.2297, -0.0359, 1.0216, 0.9857, 1.036], [20, 181.2944, 0.0154, 0.9939, 1.0093, 0.985],
      [21, 190.3591, 0.0642, 0.9767, 1.0409, 0.938], [22, 199.4238, 0.1107, 0.9693, 1.0801, 0.897],
    ],
  },
});

export const RH_ROUTE_I_PENCIL_HIGHRES_MAP = Object.freeze({
  id: 'rh-route-i-pencil-highres-map-2026-09-23',
  route: 'I (numerics) — high-resolution map of the pencil D_S c = mu L_S c on pole-free L^2(-a,a), S = {oo, 2}; companion to the Route I identity module',
  parents: ['src/data/rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js', 'src/data/rh-route-h-connes-scaling-site-weil-positivity-2026-09-23.js'],
  status: 'MAPPED — Legendre Galerkin N = 64/96/128 (N^-2 convergence, 5 reliable decimals) on a in [0.30, 0.60]: mu_max(a; pole-free) < 1 on all of 2a <= ln 3 (margin 2.84e-3 at (ln 3)/2), crosses 1 at a* = 0.56578 (2a* = ln 3 + 0.033) through an ODD vector that the true Weil form rescues via -P_3; two vanishing moments hhat(0) = hhat\'(0) = 0 give 1 - mu_max >= 0.539 uniformly on [0.30, (ln 3)/2]; the extremal\'s negativity is ~100% from the first p = 2 resonance window (8.145, 9.875) and < 3% from the archimedean window [0, 3.6). RH open; no refereed bound is changed; NO QED',
  muMaxTable: 'k = 0: 0.21232 (0.30), 0.29933 (ln2/2), 0.60304 (0.40), 0.80802 (0.44), 0.96728 (0.50), 0.98716 (0.52), 0.99577 (0.54), 0.99716 ((ln 3)/2), 0.99761 (0.56), 1.05202 (0.58), 1.11382 (0.60); k = 1: 0.14305 (ln2/2), 0.16550 (0.40), 0.68250 (0.50), 0.93158 ((ln 3)/2); k = 2: 0.10273, 0.13211, 0.26016, 0.46055; k = 3: 0.07625, 0.12257, 0.16861, 0.22800; k = 4: 0.06122, 0.06988, 0.16861, 0.19040 (N = 128; every column monotone in a)',
  convergence: 'mu_max(0.5; 0) = 0.9671131 / 0.9672121 / 0.9672463 / 0.9672724 / 0.9672823 at N = 32/48/64/96/128, ~N^-2 (interior log spike at |u-v| = ln 2), extrapolated 0.96730; N = 96 -> 128 shifts <= 5e-5 for all (a, k); quadrature (J, panel) = (34, 3a/N) vs (44, 1.5a/N) agree < 2e-7; Route I\'s N = 32 literal 0.966974 was quadrature-limited by 1.4e-4',
  crossing: 'a*(pole-free) = 0.565818 (N=64) / 0.565792 (N=96) -> 0.56578, identical for k = 0 and k = 1 (crossing vector odd, |hhat|^2 peak t = 8.85, 52% energy below t_1); Arch(h) = 0.36370 = P_2(h) + 3e-5; the Weil form there is W = 0.02038 > 0 because P_3(h) = -0.02035 (g_h(ln 3) ~ h(a)h(-a) < 0 for odd h): pencil with D_S + P_3 has mu = 0.99866 at a*, 0.99979 at 0.60; even (Slepian) sector crosses near 0.59; below (ln 3)/2 there is NO crossing for any constraint set',
  constraintLever: 'sup_{a <= (ln3)/2} mu_max(a; k) = value at (ln 3)/2: 0.99716 (k=0), 0.93162 (1), 0.46061 (2), 0.22802 (3), 0.19039 (4), 0.19039 (5), 0.17320 (6), 0.12253 (7), 0.09604 (8); two moments buy a uniform margin 0.539, one moment 0.068; unchanged steps = added moment has the wrong parity for the current extremal; second pencil eigenvalue at k = 0 equals mu_max at k = 1 (runner-up is odd); moments vs Slepian(|t| < gamma_1) vs optimal at k = 2: 0.4605 / 0.3243 / 0.2674, k = 4: 0.1904 / 0.2337 / 0.1188, k = 8: 0.0960 / 0.1019 / 0.0664',
  symbolAnatomy: 'w = 2theta\' - m_2 (symbol of L_S - D_S) is negative on [0, 3.597) (min -8.719, int -6.997) and on the p = 2 resonance windows (8.145, 9.875), (17.542, 18.699), (26.719, 27.662), (35.850, 36.664), (44.961, 45.684), (54.063, 54.713): widths 1.730 -> 0.650, depths -2.981 -> -1.188, int w -2.432 -> -0.478; deltahat_S/Lhat_S > 1 exactly there: 134.0 at t = 0, 9.13 / 7.15 / 5.70 / 4.59 / 3.85 / 3.27 at t_1..t_6; windows close at t ~ 181',
  symbolAnatomyFull: 'imp-96111: full zero-crossing structure of the three line symbols to t ~ 200. w = 2theta prime - m_2 (symbol of L_S - D_S) has 39 zero-crossings on [0, 200]; its negativity is the archimedean window [0, 3.597) plus 19 p = 2 resonance windows I_1..I_19 at t_k = 2pi k/ln2 (widths 1.730 -> 0.095 monotone, depths 2.981 -> 0.036 monotone), which CLOSE at k = 20 (t = 181.29, w = +0.015 > 0 once 2theta prime overtakes m_2 = 3.3468). deltahat_S (symbol of D_S) has 201 sign changes on (0.5, 200] with global min ~ -0.455 at t = 46.28. Lhat_S = w + deltahat_S (symbol of L_S) is STRICTLY POSITIVE pointwise on [0, 200] (global min 0.0656 at t = 0); its local minima sit at the t_k and rise monotonically 0.3675 (t_1) -> ~1.08 (t = 199) as the resonance depths decay — the symbol-level positivity margin, explicit rather than only via the Rayleigh-Ritz eigenvalues. Two-mesh cross-check (umax 24 vs 32) agrees to <= 2.5e-5 at every t_k. Measurement only; the pencil margin is untouched (D_S never uses this symbol tabulation); RH open; NO QED',
  extremalAnatomy: '(ln 3)/2, k = 0: even, |hhat|^2 peak t = 7.55, 74% energy below t_1, 98% below gamma_1; W = (1/2pi) int w |hhat|^2 splits as [0,3.6) -0.0092, [3.6,8.15) +0.226, I_1 -0.341, [9.9,17.5) +0.126, I_2 -0.005 (W = 0.00095, L_S = 0.3329): the negativity is the first p = 2 resonance window (102% of L_S), the archimedean window is 2.8%; k = 1 extremal odd on I_1 (-0.408); k = 2 even, I_1 -0.224 and I_2 -0.125; k = 3 odd on I_2 (-0.173): extremals migrate outward as moments are added',
  DSform: 'lambda(D_S) in [-0.07136, 2.14499] (a = 0.5), [-0.08670, 2.31368] ((ln 3)/2), N-stable to 1e-5; negative eigenvalue count 7/11/15/22/30 at N = 32..128 = Szego samples of the negative lobes of deltahat_S (sign changes 4.05, 7.83, 10.19, 13.25, ...); negative eigenvectors peak at t = 13.7 (even), 22.7 (odd), 31.9, 40.9 in those lobes; top eigenvector 2.145 is the t ~ 0 direction, next two (0.423 odd, 0.365 even) sit on the first resonance; lambda_min(L_S) = 0.0992 / 0.0934, lambda_min(L_S|pf) = 0.3565 / 0.3081',
  forTheProof: '(a) D_S <= L_S on pole-free h is true with margin >= 2.8e-3 for 2a <= ln 3 and FALSE for 2a > 1.1316 (odd sector; Weil positivity needs -P_3 there): a proof must use the support bound and cannot be a support-free operator inequality; (b) the object to control is the resonance window I_1 = (8.145, 9.875) (then I_2), not the t ~ 0 archimedean window; (c) vanishing moments act via the uncertainty principle (bandwidth pi/a ~ 5.7 vs window widths <= 1.73), two of them give a uniform margin 0.54 — a finite constraint count suffices numerically for a large margin; the unconstrained margin 2.8e-3 at (ln 3)/2 is what an unconditional statement must reproduce',
  honestLimits: 'Rayleigh–Ritz numbers at finite N (algebraic convergence, 5 decimals); window decompositions use a t <= 200 symbol integral (1-2% short of the quadratic form); symbol tabulation of deltahat_S truncates the u-mesh at 24; a* now extrapolated from a 5-point N^-2 sequence N = 64..192 (a* = 0.565770 +- 3.3e-6, imp-96064; the original 0.56578 two-value estimate was high by ~1e-5), and the Legendre-Galerkin assembly is SPD only through N = 200 (imp-96106, conditioningObstruction): L_S collapses to indefinite abruptly at N = 204 and this is a double-precision basis conditioning wall at degree ~200, NOT a remainder- or archimedean-quadrature-resolution limit (refining the D_S Toeplitz quadrature leaves every eigenvalue unchanged; more archimedean nodes only worsen it), so extended precision on the D_S quadrature alone cannot extend the map -- a differently-conditioned (extended-precision or prolate/Chebyshev) whole-assembly build would be needed; nothing here is a proof, no Lambda bound or verified height changes; RH open',
  truncationAudit: 'imp-96065 (measured, tmp/imp-96065-scratch2.mjs): residual error of the two honestLimits truncations. (1) u-MESH PAST 24: with the all-spikes grid u = k ln 2 (GL-8, J = 26, NMAX = 30), deltahat_S(0) = 8.784576 (umax = 24) vs 8.784599 (umax = 40) = 2.2e-5 absolute / 2.6e-6 relative; at the resonances t_1, t_2, t_3 the shift is ~1e-6; Lhat_S(0) (the positivity minimum) moves 0.065582 -> 0.065605. The delta_S(e^u) integrand between the graded 2^k spikes decays fast enough that u > 24 is negligible. (2) mu_max AND THE 2.84e-3 MARGIN ARE INVARIANT under both truncations: they are direct v-quadratures of delta_S(e^v) over v in [0, 2a] with 2a <= ln 3 = 1.0986 < 24 (toeplitzFormHiRes on gradedMesh(2a)), so the u-mesh = 24 symbol tabulation and the t <= 200 symbol integral never enter D_S; extending either moves every D_S matrix element, hence mu_max and the margin, by 0 to machine precision. (3) The t <= 200 symbol integral feeds ONLY the extremalAnatomy symbolIntegral window cross-check (already within 15% of the quadratic form W); the omitted tail t > 200 is net positive (w > 0 once the p = 2 windows close at t ~ 181) and closes part of the ~5% symbolIntegral-vs-W gap. Sub-gap SG-96065-tsymbol-tail MEASURED (imp-96086, tSymbolTailN96, tmp/imp-96086-tail.mjs): reconstructing the k = 0 pole-free extremal in the import-light leaf and integrating the tail to t = 4000 gives an entirely POSITIVE, monotonically decaying (~ln t / t^2) tail that recovers ~95% of the gap (95.0% at (ln 3)/2, 94.9% at 0.5); the residual is 0.26-0.34% of W (t > 4000 tail + finite-N / finite-grid quadrature) — the ~5% gap is the omitted positive tail, not a defect of the identity. No bound, margin, or verified height changes; RH open; NO QED.',
});

// ---- assertions
const within = (x, lo, hi) => x >= lo && x <= hi;
const L = PENCIL_HIGHRES_LITERALS;
export const RH_ROUTE_I_PENCIL_HIGHRES_MAP_ASSERTIONS = Object.freeze([
  {
    id: 'PH0-weil-symbol-sign-windows',
    description: 'w(t) = 2theta\'(t) - m_2(t) changes sign at 3.597, 8.145, 9.875, 17.542, 18.699, 26.719, 27.662 (1e-3), is < 0 at every t_k = 2pi k/ln2 for k <= 6 with the baked depths (2e-3), resonance-window widths decrease, and w(0) = -8.7190',
    holds: () => {
      const zc = signChanges(weilSymbol, 0, 28); const want = L.symbol.wZeroCrossings.slice(0, 7);
      const rw = L.symbol.resonanceWindows;
      return zc.length === 7 && zc.every((z, i) => Math.abs(z - want[i]) < 1e-3) && Math.abs(weilSymbol(0) - L.symbol.archWindow.minW) < 1e-3
        && rw.every((r) => Math.abs(weilSymbol(2 * PI * r[0] / LN2) - r[5]) < 2e-3) && rw.every((r, i) => i === 0 || r[4] < rw[i - 1][4]) && rw.every((r) => Math.abs(r[3] - r[2] - r[4]) < 2e-3);
    },
  },
  {
    id: 'PH1-pencil-a05-N24-anchors',
    description: 'a = 0.5, N = 24, hi-res quadrature: mu_max(k = 0..3) = 0.96698, 0.68151, 0.25897, 0.16851 (3e-4); sign(1 - mu) = sign(lambda_min W|constrained) for every k; second pencil eigenvalue at k = 0 equals mu_max(k = 1) (1e-6); D_S indefinite',
    holds: () => {
      const P = pencilMap(0.5, 24, 3); const A = L.anchorsN24.a05;
      return P.mus.every((m, k) => Math.abs(m - A.mus[k]) < 3e-4) && P.lamW.every((l, k) => (l > 0) === (P.mus[k] < 1) && Math.abs(l - A.lamW[k]) < 2e-3) && Math.abs(P.mu2 - P.mus[1]) < 1e-6 && P.lamDSmin < -0.05 && within(P.lamLSpf, 0.35, 0.36);
    },
  },
  {
    id: 'PH2-pencil-ln3-half-N24-constraint-lever',
    description: 'a = (ln 3)/2 - 1e-6, N = 24: mu_max = 0.99710 (k=0), 0.93057 (1), 0.45895 (2), 0.22704 (3) (3e-4): no crossing, one moment gives margin > 0.06, two moments margin > 0.5; the N = 128 grid column at (ln 3)/2 lies above the N = 24 values (Rayleigh–Ritz from below) by < 3e-3',
    holds: () => {
      const P = pencilMap(LN3 / 2 - 1e-6, 24, 3); const A = L.anchorsN24.aLn3Half; const g = L.gridN128[14];
      return P.mus.every((m, k) => Math.abs(m - A.mus[k]) < 3e-4) && P.mus[0] < 1 && 1 - P.mus[1] > 0.06 && 1 - P.mus[2] > 0.5 && P.lamW.every((l) => l > 0) && [0, 1, 2, 3].every((k) => g[k + 1] - P.mus[k] > -1e-6 && g[k + 1] - P.mus[k] < 3e-3);
    },
  },
  {
    id: 'PH3-crossing-past-ln3-odd-sector-rescued-by-p3',
    description: 'N = 24: mu_max(0.56; k=0) < 1 < mu_max(0.575; k=0) brackets a* = 0.5658; at 0.575 the k = 0 and k = 1 values coincide (odd crossing vector, 1e-9) while the pencil with D_S + P_3 stays < 1 (0.99914) and lambda_min(W|pf) > 0',
    holds: () => {
      const P1 = pencilMap(0.56, 24, 1), P2 = pencilMap(0.575, 24, 1); const A = L.anchorsN24.a0575;
      return P1.mus[0] < 1 && P2.mus[0] > 1 && Math.abs(P2.mus[0] - A.mus[0]) < 3e-4 && Math.abs(P2.mus[0] - P2.mus[1]) < 1e-9 && P2.mu3[0] < 1 && Math.abs(P2.mu3[0] - A.mu3[0]) < 3e-4 && P2.lamW[0] > 0
        && within(L.crossing.aStarExtrapolated, 0.56, 0.575) && Math.abs(2 * L.crossing.aStarExtrapolated - L.crossing.twoAStar) < 1e-3 && L.crossing.twoAStar > LN3;
    },
  },
  {
    id: 'PH4-baked-grid-consistency',
    description: 'N = 128 grid: every k-column is monotone non-decreasing in a on [0.30, (ln 3)/2]; mu_max(a; k) non-increasing in k; k = 0 column < 1 up to 0.56 and > 1 at 0.58, 0.60; N-convergence at a = 0.5 has shrinking increments and N^-2 extrapolation 0.96730 (5e-5); the Slepian/optimal/moment families agree at k = 0, 1 and optimal <= moments at k = 2, 4, 8',
    holds: () => {
      const G = L.gridN128; const upTo = G.slice(0, 15);
      const monoA = [0, 1, 2, 3, 4, 5, 6, 7, 8].every((k) => upTo.every((r, i) => i === 0 || r[k + 1] >= upTo[i - 1][k + 1] - 1e-9));
      const monoK = G.every((r) => r.slice(1).every((m, k, arr) => k === 0 || m <= arr[k - 1] + 1e-9));
      const cross = upTo.every((r) => r[1] < 1) && G[15][1] < 1 && G[16][1] > 1 && G[17][1] > 1;
      const c = L.convergenceA05.mu0; const inc = c.slice(1).map((x, i) => x - c[i]); const ext = c[4] + (c[4] - c[3]) * (1 / 128 ** 2) / (1 / 96 ** 2 - 1 / 128 ** 2);
      const F = L.constraintFamiliesLn3Half;
      return monoA && monoK && cross && inc.every((d, i) => d > 0 && (i === 0 || d < inc[i - 1])) && Math.abs(ext - L.convergenceA05.extrapolatedMu0) < 5e-5
        && [0, 1].every((k) => Math.abs(F.moments[k] - F.slepian[k]) < 1e-6 && Math.abs(F.moments[k] - F.optimalWeilEig[k]) < 1e-6) && [2, 4, 8].every((k) => F.optimalWeilEig[k] <= F.moments[k] && F.optimalWeilEig[k] <= F.slepian[k]);
    },
  },
  {
    id: 'PH5-extremal-negativity-in-resonance-window',
    description: 'baked window decompositions: for the k = 0 extremal at (ln 3)/2 and 0.5, the first p = 2 resonance window carries the dominant negative part (|I_1 part| > 0.3 and > 30x the archimedean [0,3.6) part); the six baked window parts sum to at most the full symbol integral (the omitted outer windows are net positive, and for k = 0 they add < 8e-3: 1.1e-3 at (ln 3)/2, 6.4e-3 at 0.5), and the symbol integral (t <= 200) is within 15% of the quadratic form W; the k = 3 extremals have their negativity in I_2',
    holds: () => {
      const E = L.extremalAnatomy;
      const chk = (r) => { const s6 = r.parts.reduce((s, x) => s + x, 0); return s6 <= r.symbolIntegral + 1e-6 && (r.k !== 0 || r.symbolIntegral - s6 < 8e-3) && Math.abs(r.symbolIntegral - r.W) < 0.15 * Math.max(r.W, 0.01); };
      const k0 = [E.aLn3Half[0], E.a05[0]].every((r) => r.parts[2] < -0.3 && Math.abs(r.parts[2]) > 30 * Math.abs(r.parts[0]) && chk(r));
      const k3 = [E.aLn3Half[3], E.a05[3]].every((r) => r.parts[4] < -0.15 && Math.abs(r.parts[4]) > 10 * Math.abs(r.parts[2]) && chk(r));
      return k0 && k3 && [...E.aLn3Half, ...E.a05].every((r) => Math.abs(r.LS - r.DS - r.W) < 2e-3 && Math.abs(r.Arch - r.P2 - r.W) < 2e-3);
    },
  },
  {
    id: 'PH6-crossing-high-N-richardson',
    description: 'imp-96064: the crossing sequence a*(N) at N = 64..192 is monotone decreasing; each consecutive-pair N^-2 Richardson estimate lands in [0.56576, 0.56578]; the reported aStarRichardson 0.565770 sits inside that range, agrees with the baked aStarExtrapolated 0.56578 to <= 2e-5, has 2a* - ln3 = 0.032927, and N = 224 is flagged unstable (lamLSpf < 0)',
    holds: () => {
      const c = L.crossingHighN;
      const monoDec = c.aStar.every((x, i) => i === 0 || x <= c.aStar[i - 1] + 1e-12);
      const richIn = c.richardsonPairs.every((e) => e > 0.56576 && e < 0.56578);
      const consistent = c.aStarRichardson > Math.min(...c.richardsonPairs) - 1e-6 && c.aStarRichardson < Math.max(...c.richardsonPairs) + 1e-6
        && Math.abs(c.aStarRichardson - L.crossing.aStarExtrapolated) < 2e-5 && Math.abs(2 * c.aStarRichardson - LN3 - c.twoAStarMinusLn3) < 1e-5;
      return monoDec && richIn && consistent && c.lamLSpfAt0p566.N192 > 0 && c.lamLSpfAt0p566.N224 < 0;
    },
  },
  {
    id: 'PH7-tsymbol-tail-closes-gap',
    description: 'imp-96086 (SG-96065-tsymbol-tail): the baked t > 200 tail measurement is internally consistent - head reproduces extremalAnatomy.symbolIntegral, W matches extremalAnatomy.W, every tail segment is positive and decreasing, full = head + sum(segTail), and the tail closes >= 94% of the symbolIntegral-vs-W gap with a residual < 0.4% of W',
    holds: () => {
      const T = L.tSymbolTailN96; const E = L.extremalAnatomy;
      const chk = (r, anat) => {
        const sum = r.segTail.reduce((s, x) => s + x, 0);
        const allPosDec = r.segTail.every((x, i) => x > 0 && (i === 0 || x < r.segTail[i - 1]));
        return Math.abs(r.head0to200 - anat.symbolIntegral) < 5e-6 && Math.abs(r.W - anat.W) < 5e-6
          && allPosDec && r.tailAllPositive && Math.abs(r.full - (r.head0to200 + sum)) < 2e-6
          && Math.abs(r.gap0 - (r.W - r.head0to200)) < 2e-6 && r.tailClosedPct >= 94 && r.gapRemainPct < 0.4
          && Math.abs(sum / r.gap0 * 100 - r.tailClosedPct) < 1;
      };
      return chk(T.aLn3Half, E.aLn3Half[0]) && chk(T.a05, E.a05[0]);
    },
  },
  {
    id: 'PH8-extremal-window-split-vs-a-nonuniform',
    description: 'imp-96088: the baked a-sweep of the k = 0 extremal window split shows the p = 2-window dominance is NOT uniform - I_1/L_S falls monotonically from -0.199 (a = 0.30) past -1 near (ln 3)/2, I_1/sumNeg spans a range > 0.15 (dips at small a), while the archimedean [0, 3.597) window is uniformly negligible (|arch/L_S| < 0.03 all a, monotone) and the |hhat|^2 peak migrates inward; the a = 0.5 and (ln 3)/2 rows reproduce the baked extremalAnatomy k = 0 parts',
    holds: () => {
      const R = L.extremalWindowSplitVsA.rows; const E = L.extremalAnatomy;
      const iA = 0.30, iB = LN3 / 2 - 1e-6;
      // columns: [a, mu, LS, W, arch, I1, sumNeg, I1/LS, arch/LS, I1/sumNeg, peakT]
      const first = R[0], last = R[R.length - 1];
      const monoI1overLS = R.every((r, i) => i === 0 || r[7] <= R[i - 1][7] + 1e-9); // decreasing (more negative)
      const crossesMinusOne = first[7] > -0.5 && last[7] < -1;
      const archUniform = R.every((r) => Math.abs(r[8]) < 0.03) && R.every((r, i) => i === 0 || Math.abs(r[8]) >= Math.abs(R[i - 1][8]) - 1e-9);
      const shareRange = Math.max(...R.map((r) => r[9])) - Math.min(...R.map((r) => r[9]));
      const nonUniformShare = shareRange > 0.15 && first[9] < 0.85; // small-a dip
      const peakInward = R.every((r, i) => i === 0 || r[10] <= R[i - 1][10] + 1e-9) && first[10] > 11 && last[10] < 8;
      const i1Dominant = R.every((r) => r[5] < 0 && Math.abs(r[5]) > 0.5 * Math.abs(r[6]) && Math.abs(r[5]) > 20 * Math.abs(r[4]));
      const rowA05 = R.find((r) => Math.abs(r[0] - 0.5) < 1e-9), rowLn3 = R.find((r) => Math.abs(r[0] - iB) < 1e-9);
      const matchAnat = Math.abs(rowA05[5] - E.a05[0].parts[2]) < 2e-3 && Math.abs(rowA05[4] - E.a05[0].parts[0]) < 2e-3
        && Math.abs(rowLn3[5] - E.aLn3Half[0].parts[2]) < 2e-3 && Math.abs(rowLn3[4] - E.aLn3Half[0].parts[0]) < 2e-3;
      return Math.abs(first[0] - iA) < 1e-9 && monoI1overLS && crossesMinusOne && archUniform && nonUniformShare && peakInward && i1Dominant && matchAnat;
    },
  },
  {
    id: 'PH9-symbol-full-to-t200',
    description: 'imp-96111: w = 2theta prime - m_2 has its full negativity on the archimedean window [0, 3.597) and 19 p = 2 resonance windows I_1..I_19 (t_k = 2pi k/ln2, k <= 19) recomputed live from weilSymbol (widths and depths both monotone decreasing); the windows CLOSE at k = 20 (w(t_20) > 0); the baked Lhat_S = w + deltahat_S table is internally consistent (Lhat = w + deltahat, ratio = deltahat/Lhat), STRICTLY POSITIVE at every t_k with minima rising 0.3675 -> ~1.08, and Lhat_S(0) = w(0) + deltahat0 = 0.0656 > 0',
    holds: () => {
      const S = L.symbolFullToT200; const tk = (k) => 2 * PI * k / LN2;
      const zc = signChanges(weilSymbol, 0, 200);
      const closeOK = weilSymbol(tk(19)) < 0 && weilSymbol(tk(20)) > 0 && Math.abs(tk(20) - S.windowsCloseAt.tk) < 1e-2 && S.windowsCloseAt.wAtTk > 0;
      const winLive = S.wResonanceWindows.every((r) => Math.abs(weilSymbol(tk(r[0])) - r[5]) < 3e-3 && r[5] < 0);
      const winMono = S.wResonanceWindows.every((r, i) => i === 0 || (r[4] <= S.wResonanceWindows[i - 1][4] + 1e-9 && Math.abs(r[5]) <= Math.abs(S.wResonanceWindows[i - 1][5]) + 1e-9));
      const lhatCons = S.lhatAtTk.every((r) => r[4] > 0 && Math.abs(r[2] + r[3] - r[4]) < 1e-3 && Math.abs(r[3] / r[4] - r[5]) < 1e-2 && Math.abs(weilSymbol(tk(r[0])) - r[2]) < 3e-3);
      const lhatRise = S.lhatAtTk[0][4] > 0.36 && S.lhatAtTk[0][4] < 0.38 && S.lhatAtTk.slice(0, 19).every((r, i) => i === 0 || r[4] >= S.lhatAtTk[i - 1][4] - 1e-3);
      const gmin = S.lhatGlobalMin.value > 0 && S.lhatGlobalMin.t === 0 && Math.abs(weilSymbol(0) + S.deltahat0 - S.Lhat0) < 1e-3 && Math.abs(S.Lhat0 - S.lhatGlobalMin.value) < 1e-3;
      return zc.length >= 37 && closeOK && winLive && winMono && lhatCons && lhatRise && gmin && S.deltahatSignChangeCountTo200 > 190;
    },
  },
  {
    id: 'PH10-conditioning-obstruction-onset',
    description: 'imp-96106: the baked conditioning-obstruction measurement is internally consistent - L_S is SPD (lamLSmin ~ +0.099) through the finest stable N = 200 and collapses abruptly to indefinite at the onset N = 204, worsening monotonically to N = 224; D_S itself corrupts (lamDSmin drifts from -0.0714 to -0.371); refining the D_S Toeplitz quadrature leaves the eigenvalues unchanged (dsQuadRefinementInvariant) and raising the archimedean node count only drives lamLSmin further negative - so neither quadrature lever fixes the wall',
    holds: () => {
      const C = L.conditioningObstruction;
      const stable = C.lamLSmin.N196 > 0.09 && C.lamLSmin.N200 > 0.09 && C.finestStableN === 200 && C.onsetN === 204;
      const collapse = C.lamLSmin.N204 < -1 && C.lamLSmin.N208 < C.lamLSmin.N204 && C.lamLSmin.N224 < C.lamLSmin.N220
        && [C.lamLSmin.N208, C.lamLSmin.N212, C.lamLSmin.N216, C.lamLSmin.N220, C.lamLSmin.N224].every((x, i, arr) => i === 0 || x < arr[i - 1]);
      const dsDrift = C.lamDSmin.stableLE200 > -0.075 && C.lamDSmin.N204 < C.lamDSmin.stableLE200 && C.lamDSmin.N224 < -0.3;
      const quadNoFix = C.dsQuadRefinementInvariant === true
        && C.archNodeCountNoHelp.lamLSminAt224.V5N < C.archNodeCountNoHelp.lamLSminAt224.V3N
        && C.archNodeCountNoHelp.lamLSminAt224.V8N < C.archNodeCountNoHelp.lamLSminAt224.V5N
        && C.archNodeCountNoHelp.lamDSminInvariant === C.lamDSmin.N224;
      return stable && collapse && dsDrift && quadNoFix && /NO QED/.test(C.verdict) && /RH open/.test(C.verdict);
    },
  },
  {
    id: 'verdict-honesty',
    description: 'status says RH open / NO QED, records no crossing below (ln 3)/2 and the odd-sector crossing past ln 3 rescued by -P_3, and honestLimits says nothing here is a proof',
    holds: () => /RH open/.test(RH_ROUTE_I_PENCIL_HIGHRES_MAP.status) && /NO QED/.test(RH_ROUTE_I_PENCIL_HIGHRES_MAP.status) && /mu_max\(a; pole-free\) < 1 on all of 2a <= ln 3/.test(RH_ROUTE_I_PENCIL_HIGHRES_MAP.status)
      && /ODD vector/.test(RH_ROUTE_I_PENCIL_HIGHRES_MAP.status) && /-P_3/.test(RH_ROUTE_I_PENCIL_HIGHRES_MAP.status) && /nothing here is a proof/.test(RH_ROUTE_I_PENCIL_HIGHRES_MAP.honestLimits),
  },
]);

export default RH_ROUTE_I_PENCIL_HIGHRES_MAP;
