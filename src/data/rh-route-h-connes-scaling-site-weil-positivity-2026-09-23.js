/**
 * rh-route-h-connes-scaling-site-weil-positivity (2026-09-23) — ROUTE H, the opening
 * triangulated by the seven-route sweep (rh-novel-routes-sweep-synthesis-2026-09-23.js):
 * attack Weil positivity on the Connes–Consani adelic SCALING SITE, the one geometry with
 * a second direction (idele-class / p-adic fibre) supporting transfer / Markov /
 * Osterwalder–Schrader tools. Two tests from the synthesis were run with real math and
 * cheap numerics. RH OPEN; no refereed bound is changed; NO QED.
 *
 * SETUP (semilocal S = {oo, 2}). X_S = (R x Q_2)/{+-2^n}; C_S = R_+^x x Z_2^x. The scaling
 * flow U(lambda), lambda in R_+^x, has (i) the continuous fixed fibre y = 0 -> archimedean
 * Weil distribution W_oo, and (ii) the periodic orbit of period ln 2 on the singular
 * fibre (the joint scaling (2,2) acts trivially) -> the 2-adic Weil distribution
 * W_2(g) = Sum_{k>=1} (ln 2) 2^{-k/2}(g(k ln 2) + g(-k ln 2)). The real shift S_{ln 2} is
 * IDENTIFIED with 2-adic scaling by 2 (the shift on the valuation lattice of Q_2/Z_2^x):
 * that is the "transfer/Markov" structure the second direction supplies. The semilocal
 * trace formula (Connes 1999) Tr(R_Lambda U(h)) = 2h(1) log Lambda + W_oo(h) + W_2(h) + o(1)
 * is Guillemin–Sternberg for this flow; Connes–Consani 2021 (arXiv:2006.13771) made the
 * archimedean part EXACT with the phase-space cutoff at Lambda = 1 (Sonine complement of
 * the prolate projections), which is what proves Weil positivity for g-support inside
 * (-ln 2, ln 2) — the first prime shift — in-repo anchor imp-95520 class II / Route A.
 *
 * WHAT WAS COMPUTED (all from the ARITHMETIC side of the explicit formula, so every number
 * is an unconditional statement about zeta on a finite-dimensional test space):
 *   W(h) = Sum_rho Ghat(rho),  g = h * h~,  h in L^2(-a, a)  (g-support 2a)
 *        = [pole term ghat(i/2) + ghat(-i/2)] + [archimedean (1/2pi) int ghat (Re psi(1/4+i tau/2) - ln pi)]
 *          - Sum_{n: ln n < 2a} Lambda(n) n^{-1/2} (g(ln n) + g(-ln n)),
 * Galerkin in the orthonormal Legendre basis of L^2(-a,a) (degree N = 32, u-space form of
 * the archimedean term verified against the tau-integral to 1e-9; zero side verified
 * against the 10^6 Odlyzko ordinates to 1e-10..1e-8 on smooth test functions, literals
 * baked). For a < (ln 3)/2 = 0.5493 ONLY the prime 2 enters, so W = W_arch - P_2 exactly.
 *
 * TEST 2 (extend positivity across u = ln 2). Results:
 *  (a) ARCHIMEDEAN-ONLY positivity radius a_* (poles + digamma, no primes): the form goes
 *      indefinite at a_* = 0.37160 (odd sector) and 0.41011 (even sector), i.e. g-support
 *      2a_* = 0.743 / 0.820 — only 7% / 18% beyond ln 2 = 0.693. The Connes–Consani
 *      theorem is nearly sharp by its own mechanism: there is essentially no archimedean
 *      slack to spend on a perturbative bound of the p = 2 term.
 *  (b) FULL form W = W_arch - P_2 on (ln 2)/2 < a < (ln 3)/2: lambda_min > 0 at every a
 *      computed, decaying super-exponentially: 1.13e-3 (a = 0.3516), 1.82e-4 (0.40),
 *      1.62e-5 (0.45), 9.40e-7 (0.50), 5.63e-8 (0.5493), 1.66e-9 (0.60, p=3 enters),
 *      8.4e-13 (ln 2), below the 1e-14 double-precision floor for a >= 0.8 (positivity is
 *      then numerically undecidable; primes up to e^{2a} carried, a <= 3).
 *  (c) ANATOMY. The even minimizer h* is the Slepian function of the zero-free gap
 *      |tau| < gamma_1 (99.99% of its energy there); on it pole + arch = +1.2504e-2 and the
 *      p=2 term is 1.2504e-2 at a = 0.5, leaving lambda_min = 9.4e-7: positivity across
 *      ln 2 is a CANCELLATION between the archimedean form and the single p = 2 shift to
 *      relative precision lambda/P_2 = 7.5e-5 (a = 0.5), 3.2e-6 (a = (ln 3)/2). Meanwhile
 *      the archimedean-only even form is already indefinite (lambda_min -0.0324 at a = 0.5).
 *      In the ODD sector the p=2 term has the OPPOSITE sign (g(ln 2) = <h, S_{ln2} h> < 0):
 *      at a = 0.4 pole -0.0154 + arch -0.0313 - prime(-0.0614) = +0.0147 — the prime 2
 *      RESCUES odd-sector positivity beyond a_* = 0.3716. The crude transfer bound
 *      |P_2| <= sqrt2 ln2 ||h_L|| ||h_R|| (slivers (-a, a-ln2), (ln2-a, a); S_{ln2} compressed
 *      to L^2(-a,a) is nilpotent of order 2) overshoots the actual P_2(h*) by 6x at a=0.5
 *      and is useless anyway because the archimedean form it would have to be compared
 *      with is already negative.
 *  VERDICT (Test 2): NO extension of the proven positivity past ln 2 by second-direction
 *      (transfer/Markov) bounds. Any inequality-type control of the p=2 term must be exact
 *      to 5-6 relative digits on the Slepian minimizer; the only object with that precision
 *      is an exact trace identity (a semilocal Sonine/prolate identity for S = {oo, 2}), which
 *      would be Weil positivity on g-support < ln 3 itself — not reached here. The numerics
 *      are a computer-verified positivity of W on the 32-dimensional Legendre spaces (an
 *      unconditional finite fact, not a theorem for all h).
 *
 * TEST 1 (lift the Class-II detector; does the second direction raise the 1/sqrt(t) cap?).
 *  (a) The second direction decomposes: functions on R x Z_2^x split over characters of
 *      Z_2^x = Dirichlet characters of 2-power conductor; the semilocal Weil form is
 *      BLOCK-DIAGONAL, block chi = the Weil form of L(s, chi) (character orthogonality on
 *      Z_2^x kills every cross term). Verified on the chi_4 block: 37 zeros of L(s,chi_4)
 *      below 80 found from the completed Hurwitz representation (6.020949, 10.243770,
 *      12.988098, ...), its heat-explicit formula matches the zero side to 7e-15, its
 *      Class-II Gram is PSD (lambda_min -2.7e-16, M = 40, rank 24). The zeta block is
 *      unchanged; the second direction adds a FAMILY, not sensitivity.
 *  (b) Class-II cap measured (zero k -> beta = 0.6 quadruple): t = 0.02 detects gamma_1..4
 *      (-9.7e-4 .. -3.0e-10), gamma_6 at noise; t = 0.005 detects to gamma_10 = 49.8
 *      (-9.2e-8), not gamma_15. Cap = sqrt(ln(1/eps)/t) with eps the noise floor: 37 / 64.
 *  (c) Compact-support (exact) detector: minimal g-support to see zero k off-line obeys
 *      a_det x (mean local spacing 2pi/ln(gamma/2pi)) = 2.79..2.95 for k = 3..14
 *      (a_det = 0.65, 0.70, 0.75, 0.80, 0.85, 0.90, 0.95, 0.95, 1.00, 1.00, 1.05, 1.05), i.e.
 *      2 a_det = 0.9 ln(gamma_k/2pi): detecting height T needs primes up to ~(T/2pi)^{0.9}.
 *  VERDICT (Test 1): the height cap is an uncertainty principle of the ONE-variable Weil
 *      form (resolve a zero at height T <=> g-support ~ 2pi/spacing ~ ln T <=> primes up
 *      to ~T); block-diagonality makes it independent of the number of directions. Not
 *      extended by the scaling site.
 *
 * HONEST VERDICT (3). The scaling-site geometry gives a real STRUCTURE (the p=2 shift as
 * a periodic orbit / 2-adic transfer; the exact archimedean Sonine trace) but no new
 * LEVER here: the second direction is spectrally inert for zeta (block-diagonal), the
 * archimedean positivity has no slack past ln 2 (a_* - ln2/2 = 0.025), and positivity
 * across ln 2 is an exact archimedean-vs-p=2 cancellation whose residual is
 * Sum_gamma |hhat(gamma)|^2 on the Slepian gap function — i.e. Weil positivity itself.
 * Precise next step (not done): a semilocal S={oo,2} Sonine identity
 * W_oo(g) + W_2(g) = Tr(Q_S vartheta(g) Q_S) exact for g-support < ln 3, with Q_S the
 * complement of a 2-adic x archimedean prolate/Sonine projection; the numbers above say
 * exactly what it must reproduce. RH open; NO QED.
 *
 * Import-light (the 16.7MB zeros bundle is NOT imported; zero-side literals baked from
 * scratch tmp/route-h-scratch1*.mjs, tmp/route-h-scratch2.mjs). Assertions recompute the
 * cheap Galerkin forms at N = 16..48 and compare to baked literals. Changes no bound.
 */

import { heatSpectralFunction } from './rh-route-a-reflection-positivity-primon-gas-2026-09-23.js';

const GE = 0.5772156649015329, LNPI = Math.log(Math.PI), LN2 = Math.log(2), LN3 = Math.log(3);
const B2K = [1 / 6, -1 / 30, 1 / 42, -1 / 30, 5 / 66, -691 / 2730, 7 / 6, -3617 / 510, 43867 / 798, -174611 / 330, 854513 / 138, -236364091 / 2730];

// ---- complex helpers, digamma
const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const csub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const cinv = (a) => { const d = a[0] * a[0] + a[1] * a[1]; return [a[0] / d, -a[1] / d]; };
const clog = (a) => [Math.log(Math.hypot(a[0], a[1])), Math.atan2(a[1], a[0])];
function digammaC(z) {
  let x = [z[0], z[1]]; let acc = [0, 0];
  while (Math.hypot(x[0], x[1]) < 12) { acc = csub(acc, cinv(x)); x = [x[0] + 1, x[1]]; }
  let s = clog(x); s = csub(s, cmul([0.5, 0], cinv(x)));
  const x2 = cinv(cmul(x, x)); let p = x2;
  for (let k = 1; k <= 7; k++) { s = csub(s, cmul([B2K[k - 1] / (2 * k), 0], p)); p = cmul(p, x2); }
  return [s[0] + acc[0], s[1] + acc[1]];
}

// ---- Gauss–Legendre, Legendre polynomials, Jacobi eigen-solver, primes
function gaussLegendre(n) {
  const x = new Float64Array(n), w = new Float64Array(n);
  for (let i = 0; i < n; i++) {
    let z = Math.cos(Math.PI * (i + 0.75) / (n + 0.5));
    for (let it = 0; it < 100; it++) {
      let p0 = 1, p1 = z;
      for (let k = 2; k <= n; k++) { const p2 = ((2 * k - 1) * z * p1 - (k - 1) * p0) / k; p0 = p1; p1 = p2; }
      const dp = n * (z * p1 - p0) / (z * z - 1); const dz = p1 / dp; z -= dz;
      if (Math.abs(dz) < 1e-15 || it === 99) { x[i] = z; w[i] = 2 / ((1 - z * z) * dp * dp); break; }
    }
  }
  return { x, w };
}
const GL = gaussLegendre(200);
function legendreAll(N, x) { const P = new Float64Array(N); P[0] = 1; if (N > 1) P[1] = x; for (let k = 2; k < N; k++) P[k] = ((2 * k - 1) * x * P[k - 1] - (k - 1) * P[k - 2]) / k; return P; }
function jacobiEig(Ain) {
  const n = Ain.length; const A = Ain.map((r) => Array.from(r)); const V = Array.from({ length: n }, (_, i) => { const r = new Array(n).fill(0); r[i] = 1; return r; });
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
  const idx = A.map((_, i) => i).sort((i, j) => A[i][i] - A[j][j]);
  return { vals: idx.map((i) => A[i][i]), vecs: idx.map((i) => V.map((r) => r[i])) };
}
const lamMin = (M) => jacobiEig(M).vals[0];
const primesUpTo = (M) => { const s = new Uint8Array(M + 1); const P = []; for (let i = 2; i <= M; i++) { if (!s[i]) { P.push(i); for (let j = i * i; j <= M; j += i) s[j] = 1; } } return P; };
const vonMangoldt = (X) => { const out = []; for (const p of primesUpTo(X)) for (let q = p; q <= X; q *= p) out.push({ n: q, lam: Math.log(p) }); return out; };
export const quadForm = (M, x) => { let s = 0; for (let i = 0; i < x.length; i++) for (let j = 0; j < x.length; j++) s += x[i] * M[i][j] * x[j]; return s; };
export const parityBlock = (M, par) => { const idx = []; for (let i = 0; i < M.length; i++) if (i % 2 === par) idx.push(i); return idx.map((i) => idx.map((j) => M[i][j])); };

/**
 * Weil quadratic form on L^2(-a,a) in the orthonormal Legendre basis (degree N), from the
 * arithmetic side. Returns {W, ArchOnly (poles+digamma), Pole, Arch, Prime, primeTerms, phiAt, fsMat, vNodes, vW, FS}.
 */
const CACHE = new Map();
export function weilForm(a, N, { V = 160, primes = true } = {}) {
  const key = `${a}|${N}|${V}|${primes}`; if (CACHE.has(key)) return CACHE.get(key);
  const phiAt = (u) => { const out = new Float64Array(N); if (Math.abs(u) >= a) return out; const P = legendreAll(N, u / a); for (let n = 0; n < N; n++) out[n] = Math.sqrt((2 * n + 1) / (2 * a)) * P[n]; return out; };
  const fMat = (v) => { // f_{mn}(v) = int phi_m(w) phi_n(w - v) dw
    const F = Array.from({ length: N }, () => new Float64Array(N)); if (v >= 2 * a) return F;
    const lo = v - a, hi = a, mid = (lo + hi) / 2, half = (hi - lo) / 2;
    for (let i = 0; i < GL.x.length; i++) {
      const w = mid + half * GL.x[i], wt = half * GL.w[i]; const A = phiAt(w), B = phiAt(w - v);
      for (let m = 0; m < N; m++) { const am = A[m] * wt; if (am === 0) continue; for (let n = 0; n < N; n++) F[m][n] += am * B[n]; }
    }
    return F;
  };
  const fsMat = (v) => { const F = fMat(v); return F.map((r, m) => Array.from(r, (x, n) => x + F[n][m])); };
  const GV = gaussLegendre(V); const vNodes = Array.from(GV.x, (x) => a * (x + 1)), vW = Array.from(GV.w, (w) => a * w);
  const FS = vNodes.map((v) => fsMat(v));
  const Arch = Array.from({ length: N }, () => new Float64Array(N));
  for (let k = 0; k < V; k++) {
    const v = vNodes[k], den = 1 - Math.exp(-2 * v), e2 = 2 * Math.exp(-2 * v), eh = Math.exp(-v / 2);
    for (let m = 0; m < N; m++) for (let n = 0; n < N; n++) Arch[m][n] += vW[k] * ((m === n ? e2 : 0) - eh * FS[k][m][n]) / den;
  }
  for (let m = 0; m < N; m++) Arch[m][m] += -(GE + LNPI) - Math.log(1 - Math.exp(-4 * a));
  const av = new Float64Array(N), bv = new Float64Array(N);
  for (let i = 0; i < GL.x.length; i++) { const u = a * GL.x[i], wt = a * GL.w[i]; const ph = phiAt(u); for (let n = 0; n < N; n++) { av[n] += wt * ph[n] * Math.exp(-u / 2); bv[n] += wt * ph[n] * Math.exp(u / 2); } }
  const Pole = Array.from({ length: N }, (_, m) => Array.from({ length: N }, (_, n) => av[m] * bv[n] + bv[m] * av[n]));
  const Prime = Array.from({ length: N }, () => new Float64Array(N)); const primeTerms = {};
  if (primes) for (const { n: q, lam } of vonMangoldt(Math.floor(Math.exp(2 * a)) + 1)) {
    if (Math.log(q) >= 2 * a) continue; const FSq = fsMat(Math.log(q)), wq = lam / Math.sqrt(q);
    primeTerms[q] = FSq.map((r) => Array.from(r, (x) => wq * x));
    for (let m = 0; m < N; m++) for (let n = 0; n < N; n++) Prime[m][n] += wq * FSq[m][n];
  }
  const W = Arch.map((r, m) => Array.from(r, (x, n) => x + Pole[m][n] - Prime[m][n]));
  const ArchOnly = Arch.map((r, m) => Array.from(r, (x, n) => x + Pole[m][n]));
  const out = { W, ArchOnly, Arch, Pole, Prime, primeTerms, phiAt, fsMat, vNodes, vW, FS, a, N };
  CACHE.set(key, out); return out;
}
/** Legendre coefficients of a function on (-a,a). */
export const coeffs = (wf, hf) => { const c = new Float64Array(wf.N); for (let i = 0; i < GL.x.length; i++) { const u = wf.a * GL.x[i], wt = wf.a * GL.w[i]; const ph = wf.phiAt(u); for (let n = 0; n < wf.N; n++) c[n] += wt * ph[n] * hf(u); } return c; };
/** Off-line perturbation: zero gamma_k -> quadruple {beta +- i gamma, 1-beta +- i gamma} minus the simple pair. */
export function offLineDelta(wf, gamma, beta) {
  const d = beta - 0.5, N = wf.N; const D = Array.from({ length: N }, () => new Float64Array(N));
  for (let k = 0; k < wf.vNodes.length; k++) { const v = wf.vNodes[k]; const E = wf.vW[k] * (4 * Math.cosh(d * v) - 2) * Math.cos(gamma * v); for (let m = 0; m < N; m++) for (let n = 0; n < N; n++) D[m][n] += E * wf.FS[k][m][n]; }
  return D;
}
const addM = (A, B) => A.map((r, m) => Array.from(r, (x, n) => x + B[m][n]));
/** Archimedean term (1/2pi) int F(tau)[Re psi(1/4 + i tau/2) - ln pi] dtau written in u-space for f = inverse FT of F. */
export function archUSpace(f, vmax = 60, steps = 40000) {
  let acc = -(GE + LNPI) * f(0); const h = vmax / steps;
  for (let k = 1; k <= steps; k++) { const v = k * h, w = k === steps ? 1 : (k % 2 ? 4 : 2); acc += w * h / 3 * (2 * Math.exp(-2 * v) * f(0) - Math.exp(-v / 2) * (f(v) + f(-v))) / (1 - Math.exp(-2 * v)); }
  return acc + h / 3 * (-1.5 * f(0));
}

// ---- chi_4 block: completed L(1/2+it, chi_4) via Hurwitz zeta (Euler–Maclaurin) and its heat explicit formula
const C = (re, im = 0) => ({ re, im });
const add = (a, b) => C(a.re + b.re, a.im + b.im), sub = (a, b) => C(a.re - b.re, a.im - b.im), mul = (a, b) => C(a.re * b.re - a.im * b.im, a.re * b.im + a.im * b.re), scale = (a, k) => C(a.re * k, a.im * k);
const div = (a, b) => { const d = b.re * b.re + b.im * b.im; return C((a.re * b.re + a.im * b.im) / d, (a.im * b.re - a.re * b.im) / d); };
const cexp = (a) => { const e = Math.exp(a.re); return C(e * Math.cos(a.im), e * Math.sin(a.im)); };
const clogC = (a) => C(Math.log(Math.hypot(a.re, a.im)), Math.atan2(a.im, a.re));
const powNeg = (x, s) => { const l = Math.log(x); const m = Math.exp(-s.re * l); return C(m * Math.cos(s.im * l), -m * Math.sin(s.im * l)); };
const fact = (n) => { let f = 1; for (let i = 2; i <= n; i++) f *= i; return f; };
const B2K_F = B2K.map((b, i) => b / fact(2 * (i + 1)));
function hurwitz(s, a) {
  const N = Math.max(40, Math.ceil(Math.abs(s.im) / 2) + 10); let S = C(0, 0);
  for (let n = 0; n < N; n++) { const p = powNeg(n + a, s); S.re += p.re; S.im += p.im; }
  const X = N + a; const XS = powNeg(X, s);
  S = add(S, div(scale(XS, X), sub(s, C(1, 0)))); S = add(S, scale(XS, 0.5));
  let P = s; let Xp = 1 / X;
  for (let k = 1; k <= 12; k++) { S = add(S, scale(mul(XS, P), B2K_F[k - 1] * Xp)); P = mul(mul(P, add(s, C(2 * k - 1, 0))), add(s, C(2 * k, 0))); Xp /= X * X; }
  return S;
}
function lnGammaC(z) {
  let acc = C(0, 0); let x = z; while (x.re < 15) { acc = sub(acc, clogC(x)); x = add(x, C(1, 0)); }
  let s = add(sub(mul(sub(x, C(0.5, 0)), clogC(x)), x), C(0.5 * Math.log(2 * Math.PI), 0));
  let p = div(C(1, 0), x); const x2 = div(C(1, 0), mul(x, x));
  for (let k = 1; k <= 7; k++) { s = add(s, scale(p, B2K[k - 1] / (2 * k * (2 * k - 1)))); p = mul(p, x2); }
  return add(s, acc);
}
/** Lambda(1/2 + it, chi_4) = (4/pi)^{(s+1)/2} Gamma((s+1)/2) L(s, chi_4), real on the line. */
export function completedL4(t) {
  const s = C(0.5, t); const L = mul(powNeg(4, s), sub(hurwitz(s, 0.25), hurwitz(s, 0.75)));
  const s1 = C(0.75, t / 2); return mul(cexp(add(scale(s1, Math.log(4 / Math.PI)), lnGammaC(s1))), L);
}
/** D^chi_t(u) = Sum_{gamma: L(1/2+i gamma, chi_4)=0} e^{i gamma u} e^{-t gamma^2} by the explicit formula (odd chi, q=4, no poles). */
export function heatSpectralChi4(u, t) {
  const h = 0.005, K = 16000; let acc = 0;
  for (let k = 0; k <= K; k++) { const tau = k * h, w = (k === 0 || k === K) ? 1 : (k % 2 ? 4 : 2); acc += w * Math.cos(tau * u) * (digammaC([0.75, tau / 2])[0] + Math.log(4 / Math.PI)) * Math.exp(-t * tau * tau); }
  const arch = acc * h / 3 / Math.PI; const norm = 1 / Math.sqrt(4 * Math.PI * t); let pr = 0;
  for (const p of primesUpTo(10000)) for (let q = p; q <= 10000; q *= p) { const chi = q % 4 === 1 ? 1 : q % 4 === 3 ? -1 : 0; if (!chi) continue; const A = Math.log(q) - u, B = Math.log(q) + u; pr += chi * Math.log(p) * Math.pow(q, -0.5) * (Math.exp(-A * A / (4 * t)) + Math.exp(-B * B / (4 * t))) * norm; }
  return arch - pr;
}

// ---- baked literals (scratch tmp/route-h-scratch1.mjs, 1b, 1c, 2; zero side = 10^6 Odlyzko ordinates)
export const ROUTE_H_LITERALS = Object.freeze({
  archUSpaceVsTau: { t: 0.02, u0: -1.968122333, u1: -0.723999286, u2: -0.377549012 },
  zeroSide: { // W(h) for h = (1-(u/a)^2)^3 (bump), (1-(u/a)^2)^3 (u/a)^2 (bump2), from Sum_gamma 2|hhat(gamma)|^2 over Odlyzko zeros gamma < 150/a
    a03bump: 1.649922784e-2, a05bump: 1.327271675e-5, a05bump2: 8.911926522e-4, a08bump: 2.601615879e-5,
  },
  aStar: { odd: 0.37160, even: 0.41011, ln2Half: LN2 / 2 },
  sweepN32: [ // [a, lambda_min W, lambda_min archimedean-only]
    [LN2 / 2 - 1e-6, 1.3294e-3, 1.3294e-3], [LN2 / 2 + 0.005, 1.1336e-3, 1.1955e-3], [0.36, 8.5008e-4, 1.0835e-3], [0.38, 4.0743e-4, -2.3579e-2],
    [0.40, 1.8173e-4, -7.8041e-2], [0.42, 7.4479e-5, -1.3032e-1], [0.45, 1.6232e-5, -2.0520e-1], [0.48, 2.8972e-6, -2.7645e-1],
    [0.50, 9.4039e-7, -3.2223e-1], [0.52, 3.5009e-7, -3.6682e-1], [LN3 / 2 - 1e-6, 5.6341e-8, -4.3030e-1], [LN3 / 2 + 0.005, 4.0846e-8, -4.4093e-1],
    [0.60, 1.6575e-9, -5.3588e-1], [0.65, 4.0875e-11, -6.3615e-1], [LN2, 8.3855e-13, -7.2063e-1], [0.75, 9.96e-15, -8.3037e-1],
    [1.0, 1.05e-15, -1.3241], [2.0, -7.5e-16, -4.9709], [3.0, -9.7e-15, -16.263],
  ],
  anatomyEven: {
    a05: { pole: 1.268278, arch: -1.255773, prime2: 1.2504e-2, lam: 9.4039e-7, ratio: 7.52e-5, energyBelowGamma1: 0.9999, hhatGamma1Sq: 4.8e-11, archOnlyEvenLamMin: -3.2353e-2, sliverBound: 7.39e-2 },
    aLn3Half: { pole: 1.304274, arch: -1.286439, prime2: 1.7835e-2, lam: 5.6341e-8, ratio: 3.16e-6 },
    aJustAboveLn2Half: { prime2: 7.4717e-5, lam: 1.1336e-3, ratio: 15.2 },
  },
  anatomyOdd: { a04: { pole: -0.015376, arch: -0.031338, prime2: -6.1444e-2, lam: 1.4730e-2 }, a05: { pole: -0.020662, arch: -0.139204, prime2: -1.6006e-1, lam: 1.9503e-4 } },
  detectorCompact: { // beta = 0.6; a_det = minimal support (grid 0.05) with lambda_min(W + Delta) < -1e-13; Legendre degree 1.3 a gamma_max + 20
    aDet: [0.5, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 0.95, 1.0, 1.0, 1.05, 1.05],
    gammas: [14.134725, 21.022040, 25.010858, 30.424876, 32.935062, 37.586178, 40.918719, 43.327073, 48.005151, 49.773832, 52.970321, 56.446248, 59.347044, 60.831779],
    a05gamma1: { beta05: 9.4e-7, beta06: -5.3e-6, beta08: -6.7e-4 }, a04gamma1: { beta06: 1.7e-4, beta08: 3.8e-5 },
  },
  classIICap: { t002M20: { g1: -9.7e-4, g2: -5.5e-6, g3: -1.7e-7, g4: -3.0e-10, g6: -6.5e-15, noise: -6.3e-16 }, t0005M40: { g10: -9.2e-8, g15: -6.4e-10, base: -7.1e-10 }, capLaw: 'gamma_cap = sqrt(ln(1/eps)/t): 37 (t=0.02, eps=1e-12), 64 (t=0.005, eps=1e-9)' },
  chi4: { zeros: [6.020949, 10.243770, 12.988098, 16.342607, 18.291993, 21.450611, 23.278377, 25.728756, 28.359634, 29.656384, 32.592187, 34.199958], heat: { t002u0: 1.2946661773, t002uLn2: -0.3864438013, t005u0: 0.3374282629 }, gramM40: { lamMin: -2.7e-16, rank: 24, predictedRank: 26 } },
});

export const RH_ROUTE_H_CONNES_SCALING_SITE = Object.freeze({
  id: 'rh-route-h-connes-scaling-site-weil-positivity-2026-09-23',
  route: 'H — Weil positivity on the Connes–Consani adelic scaling site (semilocal S = {oo, 2}); the opening named by the A–G sweep',
  synthesis: 'src/data/rh-novel-routes-sweep-synthesis-2026-09-23.js (opening.nextTests[0], [1])',
  status: 'BOTH TESTS RUN — no new lever: second direction is block-diagonal (a family, spectrally inert for zeta); archimedean-only positivity radius a_* = 0.3716 (odd) / 0.4101 (even) vs ln2/2 = 0.3466; positivity across ln 2 is an archimedean-vs-p=2 CANCELLATION to 5-6 relative digits on the Slepian gap function = Weil positivity itself; RH open; no refereed bound is changed; NO QED',
  setup: {
    space: 'X_S = (R x Q_2)/{+-2^n}, C_S = R_+^x x Z_2^x; scaling flow U(lambda); fixed fibre y=0 -> W_oo, periodic orbit of period ln 2 -> W_2; S_{ln 2} on R = 2-adic scaling by 2 (valuation shift)',
    form: 'W(h) = Sum_rho Ghat(rho), g = h*h~, h in L^2(-a,a): poles + archimedean - Sum_{ln n<2a} Lambda(n) n^{-1/2}(g(ln n)+g(-ln n)); only p=2 for a < (ln 3)/2',
    numerics: 'Legendre Galerkin N=32 (u-space archimedean term verified vs tau-integral 1e-9; zero side vs 10^6 Odlyzko zeros 1e-10..1e-8); even/odd sectors decouple exactly',
  },
  test2: {
    aStar: 'archimedean-only form indefinite at a_* = 0.37160 (odd), 0.41011 (even): g-support 0.743 / 0.820 vs ln 2 = 0.693 — no slack for a perturbative p=2 bound',
    fullForm: 'lambda_min(W) > 0 at every a computed: 1.13e-3 (0.3516), 1.82e-4 (0.40), 9.40e-7 (0.50), 5.63e-8 ((ln 3)/2), 1.66e-9 (0.60), 8.4e-13 (ln 2); < 1e-14 floor for a >= 0.8 (undecidable in double precision)',
    cancellation: 'even minimizer = Slepian function of |tau| < gamma_1 (99.99% energy); at a=0.5 pole+arch = 1.2504e-2, P_2 = 1.2504e-2, residual 9.4e-7 (ratio 7.5e-5; 3.2e-6 at (ln 3)/2); archimedean-only even form already -0.0324',
    oddSector: 'g(ln 2) = <h, S_{ln2} h> < 0 for odd h: the p=2 term ADDS positivity (a=0.4: pole -0.0154 + arch -0.0313 + 0.0614 = +0.0147) and rescues the odd sector beyond a_* = 0.3716',
    transferBound: '|P_2| <= sqrt2 ln2 ||h_L|| ||h_R|| (compressed S_{ln2} nilpotent of order 2) overshoots P_2(h*) 6x at a=0.5 and compares against an already-negative archimedean form: useless',
    verdict: 'no extension past ln 2 by second-direction inequalities; needed object = exact semilocal Sonine/prolate trace identity for S={oo,2} on g-support < ln 3 (= Weil positivity there), not reached',
  },
  test1: {
    blockDiagonal: 'functions on R x Z_2^x split over Dirichlet characters of 2-power conductor; W_semilocal = (+)_chi W_{L(s,chi)}; cross terms vanish by orthogonality on Z_2^x; zeta block unchanged',
    chi4Block: '37 zeros of L(s,chi_4) below 80 (6.020949, 10.243770, 12.988098, ...); heat explicit formula = zero side to 7e-15; Class-II Gram PSD (lambda_min -2.7e-16, M=40, rank 24 vs 26 predicted)',
    classIICap: 't=0.02 detects gamma_1..4 (gamma_6 at noise), t=0.005 detects to gamma_10 = 49.8 not gamma_15: cap sqrt(ln(1/eps)/t) = 37 / 64',
    compactCap: 'exact form: a_det x (2pi/ln(gamma/2pi)) = 2.79..2.95 for k=3..14, i.e. 2 a_det = 0.9 ln(gamma/2pi): height T needs primes up to ~(T/2pi)^0.9',
    verdict: 'uncertainty principle of the one-variable form (resolve height T <=> g-support ~ ln T <=> primes to ~T); independent of the number of directions; NOT extended',
  },
  verdict: 'The scaling site supplies structure (p=2 shift = periodic orbit / 2-adic transfer; exact archimedean Sonine trace) but no lever: (i) the second direction is spectrally inert (block-diagonal family), (ii) the archimedean positivity has 0.025 of slack past ln2/2, (iii) positivity across ln 2 is an exact archimedean-vs-p=2 cancellation whose residual is Sum_gamma |hhat(gamma)|^2 on the Slepian gap function — Weil positivity itself. Precise next step: semilocal S={oo,2} Sonine identity W_oo + W_2 = Tr(Q_S vartheta(g) Q_S) exact for g-support < ln 3. RH open; NO QED.',
  honestLimits: 'double-precision Galerkin on Legendre spaces of degree <= 170; positivity below 1e-14 is undecidable here; a_* and lambda_min are finite-dimensional Rayleigh–Ritz values (upper bounds on the true infima, converged to <1% at N=32 for a<=0.6); Class-II rows at t<=0.005 inherit Route A\'s tau<=60 archimedean grid truncation (base -7e-10), t=0.00125 not usable; the support interval of the published Connes–Consani theorem was taken from the in-repo anchor, not re-verified from the paper body; nothing here moves a Lambda bound or verified height.',
});

// ---- assertions
const rel = (x, lit, tol) => Math.abs(x - lit) <= tol * Math.max(Math.abs(lit), 1e-300);
export const RH_ROUTE_H_CONNES_SCALING_SITE_ASSERTIONS = Object.freeze([
  {
    id: 'H0-archimedean-u-space-formula',
    description: 'u-space form of the archimedean explicit-formula term matches the tau-integral (baked, t=0.02) at u=0,1,2 to 1e-7',
    holds: () => {
      const L = ROUTE_H_LITERALS.archUSpaceVsTau; const t = L.t;
      const g = (u) => (v) => Math.exp(-((v - u) ** 2) / (4 * t)) / Math.sqrt(4 * Math.PI * t);
      return Math.abs(archUSpace(g(0)) - L.u0) < 1e-7 && Math.abs(archUSpace(g(1)) - L.u1) < 1e-7 && Math.abs(archUSpace(g(2)) - L.u2) < 1e-7;
    },
  },
  {
    id: 'H1-arithmetic-side-equals-zero-side',
    description: 'W(h) from the arithmetic side (Galerkin N=20, exact for these degree-<=8 polynomials) matches the baked 10^6-zero sums for bump test functions at a=0.3, 0.5, 0.8 to 1e-5 relative',
    holds: () => {
      const L = ROUTE_H_LITERALS.zeroSide;
      const val = (a, hf) => { const wf = weilForm(a, 20); return quadForm(wf.W, coeffs(wf, hf)); };
      return rel(val(0.3, (u) => (1 - (u / 0.3) ** 2) ** 3), L.a03bump, 1e-5)
        && rel(val(0.5, (u) => (1 - (u / 0.5) ** 2) ** 3), L.a05bump, 1e-5)
        && rel(val(0.5, (u) => (1 - (u / 0.5) ** 2) ** 3 * (u / 0.5) ** 2), L.a05bump2, 1e-5)
        && rel(val(0.8, (u) => (1 - (u / 0.8) ** 2) ** 3), L.a08bump, 1e-5);
    },
  },
  {
    id: 'H2-weil-form-positive-across-ln2-and-arch-only-fails',
    description: 'lambda_min(W) > 0 at a = ln2/2+0.005, 0.40, 0.45, 0.50, (ln3)/2 (Galerkin N=24, within 4% of baked N=32 values) while the archimedean-only form is negative from a=0.38 on (baked to 2%)',
    holds: () => ROUTE_H_LITERALS.sweepN32.filter(([a]) => a > 0.35 && a < 0.56).every(([a, lamW, lamA]) => {
      const wf = weilForm(a, 24); const lw = lamMin(wf.W), la = lamMin(wf.ArchOnly);
      return lw > 0 && rel(lw, lamW, 4e-2) && rel(la, lamA, 2e-2) && (a < 0.375 ? la > 0 : la < 0);
    }),
  },
  {
    id: 'H2b-archimedean-only-positivity-radius',
    description: 'bisection (N=16) of the archimedean-only form: odd sector goes indefinite at a_* in [0.366, 0.378], even sector in [0.404, 0.417]; both exceed ln2/2 = 0.3466 by < 0.07',
    holds: () => {
      const lam = (a, par) => lamMin(parityBlock(weilForm(a, 16, { primes: false }).ArchOnly, par));
      const bis = (par, lo, hi) => { for (let i = 0; i < 10; i++) { const m = (lo + hi) / 2; if (lam(m, par) > 0) lo = m; else hi = m; } return (lo + hi) / 2; };
      const odd = bis(1, 0.34, 0.42), even = bis(0, 0.38, 0.46);
      return odd > 0.366 && odd < 0.378 && even > 0.404 && even < 0.417 && odd - LN2 / 2 > 0 && even - LN2 / 2 < 0.07;
    },
  },
  {
    id: 'H3-odd-sector-p2-adds-positivity',
    description: 'a=0.4 odd sector: archimedean-only lambda_min < 0, full W lambda_min > 0, and the p=2 piece on the odd minimizer is NEGATIVE (g(ln2) < 0), matching baked pieces to 3%',
    holds: () => {
      const wf = weilForm(0.4, 24); const Wo = parityBlock(wf.W, 1); const e = jacobiEig(Wo); const c = e.vecs[0];
      const pr = quadForm(parityBlock(wf.Prime, 1), c), L = ROUTE_H_LITERALS.anatomyOdd.a04;
      return lamMin(parityBlock(wf.ArchOnly, 1)) < 0 && e.vals[0] > 0 && pr < 0 && rel(pr, L.prime2, 3e-2) && rel(e.vals[0], L.lam, 4e-2);
    },
  },
  {
    id: 'H4-even-sector-archimedean-p2-cancellation',
    description: 'a=0.5: archimedean-only even lambda_min < 0; on the full-form minimizer pole+arch and P_2 both ~1.25e-2 with residual/P_2 < 2e-4; minimizer energy fraction in |tau| < gamma_1 exceeds 0.999',
    holds: () => {
      const wf = weilForm(0.5, 24); const e = jacobiEig(wf.W); const c = e.vecs[0];
      const pa = quadForm(wf.Pole, c) + quadForm(wf.Arch, c), p2 = quadForm(wf.Prime, c);
      const hstar = (u) => { const ph = wf.phiAt(u); let s = 0; for (let n = 0; n < wf.N; n++) s += c[n] * ph[n]; return s; };
      let inside = 0; const dt = 0.05; for (let k = 0; k < 14.134725 / dt; k++) { const tau = (k + 0.5) * dt; let re = 0, im = 0; for (let i = 0; i < GL.x.length; i++) { const u = 0.5 * GL.x[i], wt = 0.5 * GL.w[i], hv = hstar(u); re += wt * hv * Math.cos(tau * u); im += wt * hv * Math.sin(tau * u); } inside += 2 * (re * re + im * im) * dt / (2 * Math.PI); }
      return lamMin(parityBlock(wf.ArchOnly, 0)) < 0 && rel(pa, ROUTE_H_LITERALS.anatomyEven.a05.pole + ROUTE_H_LITERALS.anatomyEven.a05.arch, 3e-2)
        && rel(p2, ROUTE_H_LITERALS.anatomyEven.a05.prime2, 3e-2) && e.vals[0] > 0 && e.vals[0] / p2 < 2e-4 && inside > 0.999;
    },
  },
  {
    id: 'H5-compact-support-detector-threshold',
    description: 'off-line first zero (beta=0.6) is invisible at a=0.4 (lambda_min stays > 0) and detected at a=0.5 (lambda_min < -1e-6); beta=0.5 control stays PSD; gamma_3 needs a=0.65 (N=48) and is missed at a=0.6',
    holds: () => {
      const g1 = ROUTE_H_LITERALS.detectorCompact.gammas[0], g3 = ROUTE_H_LITERALS.detectorCompact.gammas[2];
      const w4 = weilForm(0.4, 24), w5 = weilForm(0.5, 24);
      const l4 = lamMin(addM(w4.W, offLineDelta(w4, g1, 0.6))), l5 = lamMin(addM(w5.W, offLineDelta(w5, g1, 0.6))), l5c = lamMin(addM(w5.W, offLineDelta(w5, g1, 0.5)));
      const w6 = weilForm(0.6, 48), w65 = weilForm(0.65, 48);
      const l6 = lamMin(addM(w6.W, offLineDelta(w6, g3, 0.6))), l65 = lamMin(addM(w65.W, offLineDelta(w65, g3, 0.6)));
      return l4 > 0 && l5 < -1e-6 && l5c > 0 && l6 > -1e-13 && l65 < -1e-13;
    },
  },
  {
    id: 'H5b-detector-law-support-times-spacing',
    description: 'baked a_det table: a_det x 2pi/ln(gamma/2pi) lies in [2.75, 3.0] for k = 3..14 (2 a_det = 0.9 ln(gamma/2pi) => primes up to ~(T/2pi)^0.9)',
    holds: () => { const D = ROUTE_H_LITERALS.detectorCompact; return D.aDet.length === 14 && D.aDet.every((a, k) => k < 2 || (a * 2 * Math.PI / Math.log(D.gammas[k] / (2 * Math.PI)) >= 2.75 && a * 2 * Math.PI / Math.log(D.gammas[k] / (2 * Math.PI)) <= 3.0)); },
  },
  {
    id: 'H6-class-II-height-cap',
    description: 'Gaussian primon class (Route A D_t, t=0.02, M=20): zero 1 -> beta 0.6 gives lambda_min < -1e-4, zero 4 (30.4) gives < -1e-10, zero 10 (49.8) is indistinguishable from the unperturbed Gram (|difference| < 1e-14, both at the 1e-15 noise floor): cap ~ sqrt(ln(1/eps)/t) ~ 37',
    holds: () => {
      const PR = primesUpTo(100).slice(0, 20); const t = 0.02;
      const off = (gamma, beta, u) => { const d = beta - 0.5; let s = -2 * Math.cos(gamma * u) * Math.exp(-t * gamma * gamma); for (const gi of [d, -d]) s += 2 * Math.exp(-gi * u) * Math.exp(-t * (gamma * gamma - gi * gi)) * Math.cos(gamma * u - 2 * t * gamma * gi); return s; };
      const gram = (gamma) => PR.map((p) => PR.map((q) => { const u = Math.abs(Math.log(p) - Math.log(q)); return (heatSpectralFunction(u, t) + (gamma ? off(gamma, 0.6, u) : 0)) / Math.sqrt(p * q); }));
      const G = ROUTE_H_LITERALS.detectorCompact.gammas; const base = lamMin(gram(0));
      return Math.abs(base) < 1e-13 && lamMin(gram(G[0])) < -1e-4 && lamMin(gram(G[3])) < -1e-10 && Math.abs(lamMin(gram(G[9])) - base) < 1e-14;
    },
  },
  {
    id: 'H7-chi4-block-explicit-formula-and-zeros',
    description: 'second-direction block chi_4: completed L(1/2+it,chi_4) vanishes at the baked zeros 6.020949, 10.243770 (|Lambda| < 1e-6 x |Lambda(1/2+8i)|) and the heat explicit formula reproduces the zero-side sums at t=0.02 (u=0, ln2) and t=0.05 (u=0) to 1e-8',
    holds: () => {
      const L = ROUTE_H_LITERALS.chi4; const ref = Math.abs(completedL4(8).re);
      return Math.abs(completedL4(L.zeros[0]).re) < 1e-6 * ref && Math.abs(completedL4(L.zeros[1]).re) < 1e-6 * ref && Math.abs(completedL4(8).im) < 1e-10 * ref
        && Math.abs(heatSpectralChi4(0, 0.02) - L.heat.t002u0) < 1e-8 && Math.abs(heatSpectralChi4(LN2, 0.02) - L.heat.t002uLn2) < 1e-8 && Math.abs(heatSpectralChi4(0, 0.05) - L.heat.t005u0) < 1e-8;
    },
  },
  {
    id: 'verdict-honesty',
    description: 'status says RH open / NO QED / no new lever, both tests recorded, and the next step is named as an exact semilocal Sonine identity (not claimed)',
    holds: () => /RH open/.test(RH_ROUTE_H_CONNES_SCALING_SITE.status) && /NO QED/.test(RH_ROUTE_H_CONNES_SCALING_SITE.status) && /no new lever/.test(RH_ROUTE_H_CONNES_SCALING_SITE.status)
      && /NOT extended/.test(RH_ROUTE_H_CONNES_SCALING_SITE.test1.verdict) && /not reached/.test(RH_ROUTE_H_CONNES_SCALING_SITE.test2.verdict) && /Sonine identity/.test(RH_ROUTE_H_CONNES_SCALING_SITE.verdict),
  },
]);

export default RH_ROUTE_H_CONNES_SCALING_SITE;
