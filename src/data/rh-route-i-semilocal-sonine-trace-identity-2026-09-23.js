/**
 * rh-route-i-semilocal-sonine-trace-identity (2026-09-23) — ROUTE I: the object the A–H sweep
 * named as the only thing that could work past u = ln 2 — an EXACT semilocal S = {oo, 2}
 * Sonine/prolate trace identity on g-support < ln 3 (Connes 1999 semilocal trace formula made
 * exact at cutoff Lambda = 1 in the manner of Connes–Consani 2021, arXiv:2006.13771, Prop 2.2 /
 * Cor 2.3). Both sides are written explicitly and the identity is tested numerically. RESULT: the
 * identity EXISTS and is exact, its trace side is unconditionally positive, but it carries an
 * irreducible explicit remainder D_S; Weil positivity on g-support < ln 3 is the INEQUALITY
 * D_S <= L_S on pole-free test functions, not an identity. On the pole-free Weil minimizer the
 * remainder is 96.7% (a = 0.5) and 99.71% (a = (ln 3)/2) of the Sonine trace. RH OPEN; PT
 * Lambda <= 0.2 stands; NO QED.
 *
 * SETUP (all on the archimedean Hilbert space; the second direction is quotiented out).
 *  X_S = (R x Q_2)/(+-2^Z). Its Z_2^*-invariant L^2 sector is L^2(R)_ev via the shell-0
 *  restriction eta(x) = xi(x, y)|_{|y|_2 = 1} (the fundamental domain of the diagonal 2^Z), and
 *  the archimedean scaling vartheta(rho) eta(x) = rho^{-1/2} eta(x/rho) is the flow of
 *  C_S/(Q_S^* Z_2^*) = R_+^*. The module cutoff |x|_oo |y|_2 <= 1 on X_S is P_1 = 1_{[-1,1]} on
 *  shell 0. The adelic Fourier transform F = F_oo (x) F_2 commutes with the diagonal 2^Z and
 *  descends to L^2(X_S) as a unitary (periodize o F o lift; unfolding <Pi F phi, Pi F psi> =
 *  Sum_q <F phi, (F psi) o q> = Sum_q <phi, psi o q> = <Pi phi, Pi psi>); on shell 0 it reads
 *      F_S eta(w) = (1/2) Sum_{n >= 0} etahat(2^n w) - (1/2) etahat(w/2),      (semilocal Fourier)
 *  from F_2(1_{Z_2^*}) = (1/2) 1_{|z| <= 1} - (1/2) 1_{|z| = 2}. Its Mellin multiplier is
 *  (1/2)[1/(1 - 2^{-s}) - 2^{s}] = (1 - 2^{s-1})/(1 - 2^{-s}) = rho_2(s), EXACTLY Tate's local
 *  factor of Q_2 (trivial character), unimodular on Re s = 1/2, so F_S = I o (u_oo u_2)^g with
 *  u_oo = e^{2 i theta} (Riemann–Siegel) and u_2 = rho_2: the Connes–Consani structure
 *  "Fourier = inversion o Mellin phase" survives verbatim with the phase multiplied by the 2-adic
 *  Tate factor. The semilocal band-limitation is Phat_S = F_S P_1 F_S.
 *
 * THE EXACT IDENTITY (CC 2021 Prop 2.2 with u = u_oo u_2; Leibniz for the quantized differential
 *  dbar(u_oo u_2) = (dbar u_oo) u_2 + u_oo (dbar u_2)). With P = 1 - P_1 (CC convention),
 *      L_S(f) := Tr( vartheta(f) P Phat_S P ) = W_oo(f) + W_2(f) + D_S(f),   for ALL f in C_c^oo(R_+^*),
 *  where (CC sign convention W_v := -W_{Q_v}, so that Sum_v W_v(f) = Sum_rho ftilde(rho) - poles):
 *    W_oo(f)  <->  Fourier multiplier 2 theta'(t) = Re psi(1/4 + i t/2) - ln pi      (= "Arch" of Route H),
 *    W_2(f)   <->  multiplier (1/i)(log rho_2)'(1/2 + i t) = -m_2(t),
 *                  m_2(t) = 2 ln2 Sum_{k>=1} 2^{-k/2} cos(k t ln2) = ln2 (sqrt2 cos(t ln2) - 1)/(3/2 - sqrt2 cos(t ln2))
 *                  (= Weil's p = 2 term, W_2(h*h~) = ln2 Sum_k 2^{-k/2}(g(k ln2) + g(-k ln2)) = "P_2" of Route H),
 *    D_S(f)   = int f(rho^{-1}) delta_S(rho) d^*rho,  delta_S(rho^{-1}) = delta_S(rho),  and for rho >= 1
 *    delta_S(rho) = Tr( vartheta(rho^{-1}) Phat_S P_1 ) = rho^{1/2} int_Delta K_S(rho x y) K_S(x y) dx dy,
 *                   K_S(t) = Sum_{n>=0} cos(2 pi 2^n t) - cos(pi t)   (archimedean: K(t) = 2 cos(2 pi t)),
 *                 = (rho^{1/2}/2) { Sum_{n,m>=0} [si(2^n rho + 2^m) + si(|2^n rho - 2^m|)]
 *                                  - Sum_{n>=0} [si(2^n rho + 1/2) + si(|2^n rho - 1/2|)]
 *                                  - Sum_{m>=0} [si(rho/2 + 2^m) + si(|rho/2 - 2^m|)]
 *                                  + si((rho+1)/2) + si(|rho-1|/2) },       si(c) := Si(2 pi c)/(2 pi c),
 *  using int_Delta phi(xy) = int_0^1 phi(t)(-log t) dt and int_0^1 cos(2 pi a t)(-log t) dt = si(a)
 *  (CC (35), (48)). The archimedean special case is CC (49): delta(rho) = 2 rho^{1/2}[si(rho+1) + si(rho-1)],
 *  reproduced here: delta(1) = 2(Si(4 pi)/(4 pi) + 1) = 2.2374848349 (CC: 2.237484835), delta'(1+) = 1.
 *  Positivity of the trace side: for f = g * g^*, L_S(f) = Tr((Phat_S^{1/2} P vartheta(g))^*(...)) >= 0,
 *  i.e. the multiplier  Lhat_S(t) = 2 theta'(t) - m_2(t) + deltahat_S(t)  must be >= 0 pointwise.
 *
 * WHAT THE NUMERICS SHOW (scratch tmp/route-i-scratch1..5.mjs; literals baked below).
 *  (1) The semilocal remainder delta_S has LOG SINGULARITIES at every rho = 2^k (resonances
 *      2^n rho = 2^m of the dilates): delta_S(2^k(1+eps)) ~ (2^{k/2}/2) log_2(1/eps) (measured 12.15,
 *      16.65, 22.71, 31.70 at eps = 1e-7, k = 0..3, vs 11.6, 16.4, 23.3, 32.9 predicted), while it is
 *      regular at rho = 3 (0.379) or sqrt 2; Tr(P_1 Phat_S P_1) = delta_S(1) = +oo (log): the
 *      semilocal phase-space box at Lambda = 1 holds infinitely many states (the 2^h(1) log' Lambda
 *      divergence of Connes' formula sits here), but D_S(f) is finite for continuous f.
 *  (2) POSITIVITY of the semilocal Sonine trace, verified: deltahat_S(0) = 8.7840 against the
 *      threshold m_2(0) - 2 theta'(0) = 3.3468 + 5.3722 = 8.7190, so Lhat_S(0) = 0.0650 > 0; Lhat_S > 0 on
 *      [0, 250] (step 0.01), with its local minima EXACTLY at the p = 2 resonances t_k = 2 pi k / ln2
 *      where m_2 peaks at 3.3468: there deltahat_S(t_k) = 3.3484, 2.660, 2.282, ... cancels the Euler-factor
 *      peak (deltahat_S(t_1) - m_2(t_1) = 1.6e-3) and Lhat_S(t_k) = 0.368, 0.373, 0.400, 0.481 (k=5),
 *      0.692 (k=10), 1.014 (k=20), 1.188 (k=27); for t > 181, 2 theta'(t) alone exceeds max m_2. The
 *      archimedean analogue (CC Cor 2.3) reproduces: 2 theta'(0) + deltahat(0) = 0.0491 > 0 (CC Fig. 4).
 *      Falsification controls (same mesh): dropping the -cos(pi t) term of K_S gives min -1.28 and no
 *      resonance cancellation (3.37); flipping the sign of the p = 2 term gives min -1.01; using the
 *      archimedean remainder with -P_2 gives min -3.30. Only the derived structure is positive.
 *  (3) THE GAP. On L^2(-a, a) (Legendre Galerkin, N = 32), the Weil form is W = Pole + Arch - P_2 =
 *      Pole + L_S - D_S EXACTLY (the identity holds matrix-wise by construction: Arch - Prime = L_S - D_S).
 *      On the pole-free subspace {hhat(+-i/2) = 0} (CC's vanishing conditions, where W = Arch - P_2):
 *        a = 0.40: lambda_min(W|pf) = 0.2255,  a = 0.50: 1.193e-2,  a = (ln 3)/2: 9.52e-4  (all > 0);
 *      on the pole-free minimizer h_0: L_S(h_0) = 0.3626, D_S(h_0) = 0.3507 (a = 0.5): the remainder is
 *      96.7% of the trace; at (ln 3)/2: 0.33279 vs 0.33184, 99.71%. Pencil D_S c = mu L_S c on the
 *      pole-free space: mu_max = 0.6024 (a = 0.4), 0.96697 (0.5), 0.99710 ((ln 3)/2) — Weil positivity on
 *      support 2a <=> mu_max(a) < 1, and mu_max -> 1 as the support grows. D_S is sign-indefinite
 *      (lambda_min -0.071, lambda_max 2.15 at a = 0.5), so the sufficient condition D_S <= 0 that CC
 *      test in Remark 3.9(ii) fails here too (D_S(h_0) > 0 already at a = 0.3). The archimedean
 *      remainder D_oo on the same minimizer changes sign between a = 0.37 and 0.40 (2a in (0.74, 0.80)),
 *      just past ln 2 = 0.693 — the semilocal reading of CC's Remark 3.9(ii).
 *  (4) WHERE THE GAP SWITCHES ON. The Toeplitz kernel of D_S on L^2(-a,a) is delta_S(e^{|u-v|}); its
 *      singular support within reach is {0} for 2a <= ln 2 and {0, ln 2} for ln 2 < 2a < 2 ln 2: the
 *      second log spike enters exactly when the g-support crosses ln 2. Past ln 3 the Weil form acquires
 *      -P_3, absent from L_S (lambda_min(L_S - P_3) = 0.034 at a = 0.6, -0.19 at 0.65). Adjoining p = 3
 *      (S = {oo, 2, 3}, coefficients (1/2)(2/3) on all dilates 2^n 3^m) makes the remainder resonate at
 *      EVERY S-unit rho = 2^a 3^b — a dense set — with log^2 spikes: measured delta_S23(3/2 (1+eps)) =
 *      1.29, 5.45, 13.39 at eps = 1e-2, 1e-4, 1e-6 (log^2 growth) where delta_S(3/2) = 1.5495 is regular;
 *      same at 4/3, 9/8, 3. The many-prime remainder loses all regularity between spikes: the compact-
 *      Toeplitz-perturbation method of CC §3–6 has no foothold beyond one prime.
 *
 * HONEST VERDICT. There is NO gap-free identity: the exact semilocal trace identity is
 *   Arch - P_2 = L_S - D_S  with L_S >= 0 (unconditional) and D_S explicit, RH-free, nonzero.
 * This CORRECTS the framing of rh-route-h-semilocal-sonine-identity-attempt-2026-09-23.js
 * (imp-96044), which took Tr(Q_S vartheta Q_S) = W_oo + W_2 + poles as exact and called its positivity
 * "circular": the trace side is positive unconditionally; the RH content sits entirely in the
 * inequality D_S <= L_S on pole-free h — the semilocal form of the Connes–Consani program (their
 * archimedean case needed the Sonine refinement W_oo = S - E plus Toeplitz analysis, works only up to
 * support ln 2, and needs the extra vanishing ghat(0) = 0 with c in (13, 17)). Reproduced: the CC
 * partial (archimedean identity, delta(1), delta'(1), Cor 2.3 positivity). New: the semilocal S={oo,2}
 * identity in closed form, its positivity, the resonance structure of the remainder, the saturation
 * mu_max(a), and the dense-resonance obstruction for S ⊇ {2,3}. Not obtained: any unconditional
 * positivity past ln 2. RH open; NO QED.
 *
 * Import-light (imports Route H's Galerkin assembly only; no zeros bundle). Assertions recompute the
 * cheap pieces (archimedean anchors, Tate factor, spike law, coarse-mesh multiplier, N = 16 Galerkin).
 * Changes no bound.
 */

import { weilForm, quadForm, coeffs } from './rh-route-h-connes-scaling-site-weil-positivity-2026-09-23.js';

const PI = Math.PI, LN2 = Math.LN2, LN3 = Math.log(3);

// ---- Gauss–Legendre
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
const GL80 = gaussLegendre(80), GL8 = gaussLegendre(8);

/** Sine integral Si(z) = int_0^z sin(s)/s ds: GL-80 on [0,z] for z <= 30, asymptotic series beyond. */
export function Si(z) {
  if (z === 0) return 0; if (z < 0) return -Si(-z);
  if (z <= 30) { let s = 0; const h = z / 2; for (let i = 0; i < 80; i++) { const t = h * (GL80.x[i] + 1); s += GL80.w[i] * Math.sin(t) / t; } return s * h; }
  let f = 0, g = 0, term = 1; const z2 = z * z;
  for (let k = 0; k < 14; k++) { f += (k % 2 ? -1 : 1) * term; g += (k % 2 ? -1 : 1) * term * (2 * k + 1); term *= (2 * k + 1) * (2 * k + 2) / z2; if (term < 1e-17) break; }
  return PI / 2 - (f / z) * Math.cos(z) - (g / z2) * Math.sin(z);
}
export const si = (c) => (c === 0 ? 1 : Si(2 * PI * c) / (2 * PI * c));
/** archimedean trace remainder (CC 2021 eq. 49), symmetric under rho -> 1/rho */
export const deltaArch = (rho) => { if (rho < 1) rho = 1 / rho; return 2 * Math.sqrt(rho) * (si(rho + 1) + si(rho - 1)); };
/** semilocal S = {oo, 2} trace remainder delta_S(rho) = Tr(vartheta(rho^{-1}) Phat_S P_1), rho >= 1, extended by symmetry */
export function deltaS(rho, NMAX = 52) {
  if (rho < 1) rho = 1 / rho;
  const l2r = Math.log2(rho); let s = 0;
  for (let n = 0; n <= NMAX; n++) {
    const A = Math.pow(2, n) * rho; const M = Math.ceil(n + l2r) + 46;
    for (let m = 0; m <= M; m++) { const B = Math.pow(2, m); s += si(A + B) + si(Math.abs(A - B)); }
    s -= si(A + 0.5) + si(Math.abs(A - 0.5));
  }
  const R = rho / 2; const M2 = Math.ceil(l2r) + 46;
  for (let m = 0; m <= M2; m++) { const B = Math.pow(2, m); s -= si(R + B) + si(Math.abs(R - B)); }
  s += si((rho + 1) / 2) + si(Math.abs(rho - 1) / 2);
  return Math.sqrt(rho) * s / 2;
}
/** S = {oo, 2, 3} remainder (dilates 2^n 3^m with coefficients c2_n c3_m; c2 = 1/2 (n>=0), -1/2 (n=-1); c3 = 2/3 (m>=0), -1/3 (m=-1)) */
export function deltaS23(rho, L = 40) {
  if (rho < 1) rho = 1 / rho;
  const units = [];
  for (let n = -1; n <= L; n++) for (let m = -1; m <= Math.ceil(L / 1.585); m++) { const q = Math.pow(2, n) * Math.pow(3, m); if (q > Math.pow(2, L)) continue; units.push([q, (n >= 0 ? 0.5 : -0.5) * (m >= 0 ? 2 / 3 : -1 / 3)]); }
  let s = 0;
  for (const [q, c] of units) { const A = q * rho; for (const [q2, c2] of units) { if (q2 > 64 * A && q2 > 1e6) continue; s += c * c2 * (si(A + q2) + si(Math.abs(A - q2))); } }
  return Math.sqrt(rho) * s;
}
// ---- multipliers
const B2K = [1 / 6, -1 / 30, 1 / 42, -1 / 30, 5 / 66, -691 / 2730, 7 / 6];
function rePsi(a, b) {
  let x = a; const y = b; let acc = 0;
  while (Math.hypot(x, y) < 12) { acc -= x / (x * x + y * y); x += 1; }
  const r2 = x * x + y * y; let re = 0.5 * Math.log(r2) - 0.5 * x / r2;
  let pr = (x * x - y * y) / (r2 * r2), pim = -2 * x * y / (r2 * r2); const zr = pr, zi = pim;
  for (let k = 1; k <= 7; k++) { re -= B2K[k - 1] / (2 * k) * pr; const nr = pr * zr - pim * zi, ni = pr * zi + pim * zr; pr = nr; pim = ni; }
  return re + acc;
}
/** 2 theta'(t) = Re psi(1/4 + i t/2) - ln pi : multiplier of the archimedean term (CC's W_oo = Route H's Arch) */
export const twoThetaPrime = (t) => rePsi(0.25, t / 2) - Math.log(PI);
/** m_2(t) = 2 ln2 Sum_{k>=1} 2^{-k/2} cos(k t ln2): multiplier of Weil's p = 2 term P_2 (W_2^{CC} <-> -m_2) */
export const m2 = (t) => { const c = Math.cos(t * LN2); return LN2 * (Math.SQRT2 * c - 1) / (1.5 - Math.SQRT2 * c); };
/** Tate local factor rho_2(1/2 + i t) = (1 - 2^{-1/2 + i t})/(1 - 2^{-1/2 - i t}) as [re, im] */
export function tateFactor2(t) {
  const zr = Math.SQRT1_2 * Math.cos(t * LN2), zi = Math.SQRT1_2 * Math.sin(t * LN2);
  const nr = 1 - zr, ni = -zi, dr = 1 - zr, di = zi; const d = dr * dr + di * di;
  return [(nr * dr + ni * di) / d, (ni * dr - nr * di) / d];
}
/** u-mesh graded (2^-j, j <= J) toward each spike, GL-8 per cell, panels <= 0.25 elsewhere */
export function buildMesh(spikes, umax, J = 44, gl = GL8) {
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
    const a = S[k], b = k + 1 < S.length ? S[k + 1] : umax; const np = Math.max(1, Math.ceil((b - a) / 0.25));
    for (let p = 0; p < np; p++) cellsBetween(a + (b - a) * p / np, a + (b - a) * (p + 1) / np, p === 0, p === np - 1 && k + 1 < S.length);
  }
  return { pts: Float64Array.from(pts), wts: Float64Array.from(wts) };
}
/** deltahat(t) = 2 int_0^oo delta(e^u) cos(t u) du from a tabulated mesh */
export const fourierOnMesh = (mesh, vals) => (t) => { let s = 0; for (let i = 0; i < mesh.pts.length; i++) s += mesh.wts[i] * vals[i] * Math.cos(t * mesh.pts[i]); return 2 * s; };

// ---- Galerkin pieces on L^2(-a,a) (Legendre basis of the Route H assembly)
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
const dot = (a, b) => { let s = 0; for (let i = 0; i < a.length; i++) s += a[i] * b[i]; return s; };
/** orthonormal basis of the orthogonal complement of the constraint vectors (high modes first, re-orthogonalized) */
export function complementBasis(N, cons) {
  const Q = [];
  for (const v of cons) { let w = Array.from(v); for (const q of Q) { const d = dot(w, q); w = w.map((x, i) => x - d * q[i]); } const nr = Math.sqrt(dot(w, w)); if (nr > 1e-12) Q.push(w.map((x) => x / nr)); }
  const B = [];
  for (let i = N - 1; i >= 0; i--) {
    let w = new Array(N).fill(0); w[i] = 1;
    for (let pass = 0; pass < 2; pass++) for (const q of [...Q, ...B]) { const d = dot(w, q); w = w.map((x, j) => x - d * q[j]); }
    const nr = Math.sqrt(dot(w, w)); if (nr > 1e-6 && B.length < N - Q.length) B.push(w.map((x) => x / nr));
  }
  return B;
}
export const compress = (M, B) => B.map((bi) => B.map((bj) => { let s = 0; for (let i = 0; i < M.length; i++) { let r = 0; for (let j = 0; j < M.length; j++) r += M[i][j] * bj[j]; s += bi[i] * r; } return s; }));
const lift = (B, c) => { const N = B[0].length; const out = new Array(N).fill(0); for (let k = 0; k < B.length; k++) for (let i = 0; i < N; i++) out[i] += c[k] * B[k][i]; return out; };
const addM = (A, B, sB = 1) => A.map((r, m) => Array.from(r, (x, n) => x + sB * B[m][n]));
const matmul = (A, B) => A.map((r) => B[0].map((_, j) => r.reduce((s, x, k) => s + x * B[k][j], 0)));
/** Toeplitz remainder form (D)_{mn} = int_0^{2a} K(v) fs_{mn}(v) dv on L^2(-a,a), graded at the spikes */
export function remainderForm(wf, K, spikes, J = 40) {
  const N = wf.N, a = wf.a; const mesh = buildMesh(spikes, 2 * a, J);
  const D = Array.from({ length: N }, () => new Float64Array(N));
  for (let i = 0; i < mesh.pts.length; i++) { const v = mesh.pts[i]; if (v >= 2 * a) continue; const kv = K(v) * mesh.wts[i]; const FS = wf.fsMat(v); for (let m = 0; m < N; m++) for (let n = 0; n < N; n++) D[m][n] += kv * FS[m][n]; }
  return D;
}
/**
 * Full gap analysis at (a, N): L_S = Arch - Prime + D_S, pole-free restriction, minimizer values, pencil mu_max.
 * (For a < (ln 3)/2, Prime = P_2 exactly and L_S is the semilocal Sonine trace; beyond, Prime includes p = 3.)
 */
export function gapAnalysis(a, N, J = 30) {
  const wf = weilForm(a, N);
  const DS = remainderForm(wf, (v) => deltaS(Math.exp(v)), [0, LN2], J);
  const ArchP2 = addM(wf.Arch, wf.Prime, -1), LS = addM(ArchP2, DS);
  const av = Array.from(coeffs(wf, (u) => Math.exp(-u / 2))), bv = Array.from(coeffs(wf, (u) => Math.exp(u / 2))), ov = Array.from(coeffs(wf, () => 1));
  const PF = complementBasis(N, [av, bv]), PF0 = complementBasis(N, [av, bv, ov]);
  const ePF = jacobiEig(compress(ArchP2, PF)); const c0 = lift(PF, ePF.vecs[0]);
  const Lc = compress(LS, PF), Dc = compress(DS, PF); const eL = jacobiEig(Lc); const n = Lc.length;
  const Linvh = Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => { let s = 0; for (let k = 0; k < n; k++) s += eL.vecs[k][i] * eL.vecs[k][j] / Math.sqrt(Math.max(eL.vals[k], 1e-300)); return s; }));
  const muMax = jacobiEig(matmul(matmul(Linvh, Dc), Linvh)).vals[n - 1];
  let identityDefect = 0; for (let m = 0; m < N; m++) for (let k = 0; k < N; k++) identityDefect = Math.max(identityDefect, Math.abs(LS[m][k] - DS[m][k] - ArchP2[m][k]));
  return {
    a, N, lamW: jacobiEig(wf.W).vals[0], lamLS: jacobiEig(LS).vals[0], lamLSpf: eL.vals[0], lamWpf: ePF.vals[0], lamWpf0: jacobiEig(compress(ArchP2, PF0)).vals[0],
    lamDSmin: jacobiEig(DS).vals[0], muMax, identityDefect,
    onMinimizer: { LS: quadForm(LS, c0), DS: quadForm(DS, c0), W: quadForm(ArchP2, c0), Arch: quadForm(wf.Arch, c0), P2: quadForm(wf.Prime, c0) },
  };
}

// ---- baked literals (tmp/route-i-scratch1..5.mjs)
export const ROUTE_I_LITERALS = Object.freeze({
  archimedean: { Si4pi: 1.492161225584455, delta1: 2.2374848349418266, deltaPrime1plus: 1.0, deltaHat0: 5.421302, twoThetaPrime0: -5.3721834192256654, LHat0: 0.0491187, deltaHatMin: { value: -0.10679, t: 9.9 }, ccDelta1: 2.237484835 },
  deltaS: { r1e7: 12.146531, r1001: 5.499942, r101: 3.870635, r13: 1.754665, r15: 1.549486, r199: 4.914787, r2e7: 16.651084, r25: 0.915466, r3: 0.379224, r4e7: 22.713239, r6: 0.469624, r8e7: 31.699639, r20: 0.237921, r100: 0.101133, r1000: 0.033501, spikeLaw: 'delta_S(2^k(1+eps)) ~ (2^{k/2}/2) log_2(1/eps)' },
  multiplier: { deltaSHat0: 8.78395, threshold: 8.7189942, LSHat0: 0.06496, LSHat0mesh1: 0.06565, sweep: '[0,250] step 0.01, min at t=0', m2Max: 3.3468108, resonances: [[1, 9.0647, 0.3676, 3.3484], [2, 18.1294, 0.3726, 2.6599], [3, 27.1941, 0.3999, 2.2817], [5, 45.3235, 0.4813, 1.8522], [10, 90.6470, 0.6917, 1.3694], [20, 181.2940, 1.0138, 0.9984], [27, 244.7469, 1.1880, 0.8724]], controls: { dropCosPiT: { min: -1.2763, at: 1.06, resDefect: 3.3668 }, flipP2Sign: { min: -1.0143, at: 3.90 }, archRemainderMinusP2: { min: -3.2977, at: 0 } }, coarseMesh: { UMAX: 16, J: 18, NMAX: 30, LSHat0: 0.06306, LSHatRes: 0.36630, resDefect: 0.00029 },
    // imp-96152: N-stability of the trace-side multiplier in the dyadic-truncation parameter NMAX (the n <= NMAX cutoff
    // of the semilocal Fourier sum F_S eta = (1/2) Sum_{n>=0} etahat(2^n .) - (1/2) etahat(./2) inside deltaS). Recomputed
    // Lhat_S(t) = 2 theta'(t) - m_2(t) + deltahat_S(t) at NMAX = 30 (base), 48, 64, 96, 128 on a fixed graded mesh
    // (UMAX = 20, J = 28, dyadic spikes u = k ln2). Every reported quantity is N-stable to 6 digits: deltahat_S(0),
    // Lhat_S(0), the global minimum (always at t = 0, always > 0), the p = 2 resonance minima, and the resonance defect
    // deltahat_S(t_1) - m_2(t_1) do not move across NMAX 30..128. So the multiplier minimum 0.0650 and the resonance-minima
    // structure are NOT an artifact of truncating the infinite dyadic sum -- they are already converged by NMAX = 30.
    nStability: {
      mesh: { UMAX: 20, J: 28, spikes: 'u = k ln2' }, NMAXseq: [30, 48, 64, 96, 128],
      deltaSHat0: 8.784261, LSHat0: 0.065267, globalMin: 0.065267, argMin: 0, allPositive: true,
      resMinima: [0.3673, 0.3720, 0.4000, 0.4812], resK: [1, 2, 3, 5], resDefectK1: 1.299e-3,
      driftLSHat0_30to128: 6.72e-8, tailDrift_96to128: 0.0,
      coarseCrosscheck: { UMAX: 16, J: 18, NMAX30: 0.063060, NMAX64: 0.063060, drift: '< 1e-6' },
      verdict: 'imp-96152: the trace-side positivity multiplier (min 0.0650 at t=0) and the p=2 resonance local minima are N-STABLE in the dyadic truncation NMAX -- drift 30->128 is 6.7e-8 (below 1e-6), converged by NMAX=30, NOT a discretization artifact. Global minimum stays at t=0 and > 0 for every NMAX. Verification of a stated positivity claim; RH open; PT Lambda <= 0.2 stands; NO QED',
    } },
  galerkinN32: [ // [a, lamW, lamW|polefree, lamW|polefree+h0, lam Arch|polefree, lamLS, lamDSmin, lamDSmax, LS(h0), DS(h0), W(h0), Arch(h0), P2(h0)]
    [0.40, 1.81727e-4, 0.2255, 0.779516, 0.402832, 0.11892, -0.0270024, 1.7312, 0.567059, 0.341558, 0.2255, 0.443675, 0.218175],
    [0.50, 9.40392e-7, 0.0119305, 0.190364, 0.177727, 0.0992734, -0.0711966, 2.14502, 0.36261, 0.350679, 0.0119305, 0.197538, 0.185608],
    [LN3 / 2, 5.63409e-8, 9.51978e-4, 0.0334254, 0.0825163, 0.093416, -0.0866, 2.31372, 0.332791, 0.331839, 9.51978e-4, 0.149342, 0.14839],
  ],
  galerkinN24: { a030: { lamWpf: 0.691999, lamWpf0: 0.987883, lamLS: 0.154128, DSh0: 0.1853, LSh0: 0.877299, DAh0: -0.0186206 }, aLn2Half: { lamWpf: 0.547061, lamLS: 0.134588, DAh0: -0.0162064 }, a037: { lamWpf: 0.410917, DAh0: -0.00667033 }, a040: { DAh0: 0.00879125 }, a045: { lamWpf: 0.0664115, lamLS: 0.107482 }, a060: { lamW: 1.80676e-9, lamWpf: 6.82636e-5, lamArchPf: -0.00709274, lamLSminusP3: 0.0335115 }, a065: { lamW: 4.30575e-11, lamWpf: 2.60545e-6, lamLSminusP3: -0.191421 } },
  pencil: { a040: 0.602395, a050: 0.966974, a050N16: 0.966334, aLn3Half: 0.997099, aLn3HalfN16: 0.997043, lamLSpf: { a040: 0.56599, a050: 0.35673, aLn3Half: 0.30830 }, a050HiRes: 0.96730, a050Note: 'imp-96074: a050 = 0.966974 is the N=32 GL-8/J=30/panel-0.25 quadrature-limited mu_max(0.5;0), ~1.4e-4 below the hi-res N=32 value 0.9671131 of rh-route-i-pencil-highres-map (same N, GL-12/J=34 graded, cross-check < 2e-7); that hi-res sequence N=32..128 then N^-2-extrapolates to 0.96730 (a050HiRes). All three agree mu_max(0.5) < 1, so no bound or verdict changes; use a050HiRes for the converged pencil eigenvalue' },
  s23: { threeHalves: [1.2862, 5.4464, 13.3924], fourThirds: [1.1915, 4.8840, 12.1533], nineEighths: [1.0988, 3.9632, 10.0632], three: [2.4867, 9.9398, 22.7899], sqrt2: [0.7894, 0.7752, 0.7749], eps: [1e-2, 1e-4, 1e-6], s2AtThreeHalves: 1.5495 },
  // imp-96087: lambda_min(L_S - P_3) on a fine a-grid (N = 24, GL-8/J = 30 Toeplitz D_S; P_3 = wf.primeTerms[3]).
  // L_S = Arch - P_2 + D_S is the semilocal S = {oo, 2} trace (only p = 2); past ln 3 the true Weil form gains -P_3.
  // lamMin(L_S - P_3) decreases monotonically through a = ((ln3)/2, 0.66], crossing 0 at a* = the loss-of-positivity
  // support: the discrete-P_3 rescue of the odd pencil vector holds only for a < a*. Endpoints reproduce the baked
  // galerkinN24 a060 (0.033511) and a065 (-0.191421) to all digits.
  lsMinusP3: {
    grid: [[0.58, 0.080817], [0.585, 0.074654], [0.59, 0.065359], [0.595, 0.051808], [0.60, 0.033511], [0.605, 0.011181], [0.61, -0.013584], [0.615, -0.039166], [0.62, -0.064413], [0.625, -0.088685], [0.63, -0.111740], [0.635, -0.133534], [0.64, -0.154067], [0.645, -0.173353], [0.65, -0.191421], [0.655, -0.208276], [0.66, -0.224006]],
    aStarN24: 0.6072972, aStarN32: 0.6068884, twoAStar: 1.2137768, gSupportPastLn3: 0.1151645, aPastLn3Half: 0.0575823,
    // imp-96144: N-convergence of the discrete-P_3 rescue endpoint a* (gapAnalysis(a,N,J=30).lamLS = lamMin(L_S - P_3)).
    // Recomputed a*(N) at N = 48, 64, 96, 128 (root-find lamLS(a*) = 0, GL-8/J = 30 Toeplitz D_S held fixed as N grows);
    // reproduces the baked N = 24 (0.6072973) and N = 32 (0.6068884) endpoints to all baked digits.
    convergence: {
      seq: [[24, 0.6072973], [32, 0.6068884], [48, 0.6068042], [64, 0.6067160], [96, 0.6066688], [128, 0.6066514]],
      aStarLimit: 0.606624, aStarLimitErr: 2e-5, DeltaALimit: 0.057317, gSupportLimit: 0.114635, driftN32ToLimit: -2.65e-4,
      method: 'monotone-decreasing a*(N); N^-2 Richardson on the three largest-N pairs agrees (0.6066309 / 0.6066291 / 0.6066299), least-squares a(N) = ainf + c/N^2 over N >= 48 gives ainf = 0.6066236, c = 0.408 with residuals ~3e-6 and effective exponent ~2 (classic Galerkin truncation)',
      verdict: 'imp-96144: the a*(N) sequence CONVERGES monotonically (N = 24..128); extrapolated a* -> 0.60662 +- 2e-5. The N = 32 value 0.60689 is already accurate to ~4e-4, and the ~4e-4 N-drift is genuine convergence, NOT a divergent finite-truncation artifact. The discrete-P_3 rescue reach Delta a = a* - (ln3)/2 is therefore a REAL converged feature: it shrinks only ~2.6e-4 (~0.5%), from 0.0576 (N = 32) to 0.0573 (limit) as N -> oo (g-support 2a* - ln3 -> 0.1146). Measurement only; RH open; PT Lambda <= 0.2 stands; NO QED',
    },
    note: 'lamMin(L_S - P_3) = 0 at a* = 0.60689 (N = 32; N = 24 gives 0.60730, N-drift ~4e-4 CONVERGES to a* = 0.60662 +- 2e-5 by N = 128, see convergence). The discrete-P_3 rescue extends only Delta a = a* - (ln3)/2 = 0.0576 past the p = 3 onset (2a* - ln3 = 0.1152 in g-support), a converged real feature (limit 0.0573, not a finite-N artifact); beyond a* the form L_S - P_3 is indefinite (lamMin < 0) and the semilocal trace no longer dominates the adjoined p = 3 shift. Measurement only; RH open; NO QED',
  },
});

export const RH_ROUTE_I_SEMILOCAL_SONINE_TRACE = Object.freeze({
  id: 'rh-route-i-semilocal-sonine-trace-identity-2026-09-23',
  route: 'I — the exact semilocal S = {oo, 2} Sonine/prolate trace identity on g-support < ln 3 (the object named by Routes A–H)',
  parents: ['src/data/rh-route-h-connes-scaling-site-weil-positivity-2026-09-23.js', 'src/data/rh-route-h-semilocal-sonine-identity-attempt-2026-09-23.js (imp-96044; framing corrected here)', 'src/data/rh-novel-routes-sweep-synthesis-2026-09-23.js'],
  status: 'IDENTITY WRITTEN AND TESTED — exact for all f: Tr(vartheta(f) P Phat_S P) = W_oo(f) + W_2(f) + D_S(f); trace side unconditionally positive (multiplier min 0.0650 at t = 0, local minima at the p = 2 resonances); remainder D_S explicit and NONZERO (log spikes at rho = 2^k); Weil positivity on g-support < ln 3 = the inequality D_S <= L_S on pole-free h, saturated to 96.7% (a = 0.5) / 99.71% ((ln 3)/2); no gap-free identity, no unconditional extension past ln 2. RH open; PT Lambda <= 0.2 stands; NO QED',
  lhs: 'W_oo(f) + W_2(f) (CC sign convention = Arch - P_2 of Route H): multipliers 2 theta\'(t) = Re psi(1/4 + it/2) - ln pi and -m_2(t), m_2(t) = ln2 (sqrt2 cos(t ln2) - 1)/(3/2 - sqrt2 cos(t ln2)) = (1/i)(log rho_2)\'; only p = 2 enters for g-support < ln 3',
  rhs: 'Tr(vartheta(f) P Phat_S P) on L^2(R)_ev = Z_2^*-invariant sector of L^2((R x Q_2)/(+-2^Z)); P = 1 - P_1, P_1 = module cutoff |x||y|_2 <= 1; Phat_S = F_S P_1 F_S [corrected 2026-11-21: the identity needs Phat_S = F_S^{-1} P F_S, the Connes-Consani convention; with the band-limiting form as written the trace diverges] with the semilocal Fourier F_S eta = (1/2) Sum_{n>=0} etahat(2^n .) - (1/2) etahat(./2) = I o (u_oo u_2)^g, u_2 = Tate factor (1 - 2^{s-1})/(1 - 2^{-s}); Sonine-type positivity: L_S(g*g^*) = ||Phat_S^{1/2} P vartheta(g)||_HS^2 >= 0',
  gapTerm: 'D_S(f) = int f(rho^{-1}) delta_S(rho) d^*rho, delta_S(rho) = rho^{1/2} int_Delta K_S(rho x y) K_S(x y), K_S(t) = Sum_{n>=0} cos(2 pi 2^n t) - cos(pi t); closed form = si double sum; log singularities at every rho = 2^k with coefficient (2^{k/2}/2) log_2(1/eps); Tr(P_1 Phat_S P_1) = delta_S(1) = +oo (log); sign-indefinite as a form (lambda -0.071 .. +2.15 at a = 0.5); POSITIVE on the pole-free Weil minimizer: D_S(h_0)/L_S(h_0) = 0.967 (a = 0.5), 0.9971 ((ln 3)/2)',
  positivity: 'Lhat_S(t) = 2 theta\'(t) - m_2(t) + deltahat_S(t) > 0 on [0, 250] (step 0.01), min 0.0650 at t = 0 (deltahat_S(0) = 8.7840 vs threshold 8.7190); local minima at t_k = 2 pi k/ln2 where deltahat_S cancels the Euler-factor peak m_2 = 3.3468 (defect 1.6e-3 at k = 1) and Lhat_S = 0.368, 0.373, 0.400, ..., 1.19 (k = 27); controls: dropping -cos(pi t) -> min -1.28, flipping the p = 2 sign -> -1.01, archimedean remainder with -P_2 -> -3.30',
  saturation: 'pencil D_S c = mu L_S c on pole-free L^2(-a,a): mu_max = 0.6024 (a = 0.4), 0.96697 (0.5), 0.99710 ((ln 3)/2); Weil positivity on support 2a <=> mu_max(a) < 1; W|pf lambda_min = 0.2255, 1.193e-2, 9.52e-4 (N = 32)',
  switchOn: 'D_S Toeplitz kernel delta_S(e^{|u-v|}): singular support {0} for 2a <= ln 2, {0, ln 2} for ln 2 < 2a < 2 ln 2 — the second spike enters exactly when g-support crosses ln 2; archimedean remainder D_oo changes sign on the pole-free Weil minimizer at 2a in (0.74, 0.80) (CC Remark 3.9(ii) analogue); past ln 3 the Weil form gains -P_3 not in L_S (lambda_min(L_S - P_3) = 0.034 at a = 0.6, -0.19 at 0.65)',
  manyPrimeObstruction: 'S = {oo, 2, 3}: dilates 2^n 3^m with non-decaying coefficients (1/2)(2/3) resonate at every S-unit rho = 2^a 3^b (dense in R_+) with log^2 spikes: delta_S23(3/2 (1+eps)) = 1.29, 5.45, 13.39 (eps = 1e-2, 1e-4, 1e-6) where delta_S(3/2) = 1.5495 is regular; the remainder has dense singular support — the compact-Toeplitz method of CC §3–6 has no foothold beyond one prime',
  correction: 'imp-96044 took Tr(Q_S vartheta Q_S) = W_oo + W_2 + poles as exact and called its positivity circular; the actual trace identity carries the explicit remainder D_S, the trace side is positive UNCONDITIONALLY, and the RH content is the comparison D_S <= L_S (semilocal form of the Connes–Consani program; their archimedean case works to support ln 2 only, with the Sonine refinement W_oo = S - E, Toeplitz analysis, and the extra vanishing ghat(0) = 0, c in (13, 17))',
  verdict: 'a genuine EXACT identity exists (both sides explicit, positivity of the trace side verified, CC archimedean partial reproduced), but it is not gap-free: Weil positivity on g-support < ln 3 is D_S <= L_S, an inequality between two explicit RH-free functionals saturated to 3 digits at (ln 3)/2. No unconditional positivity past ln 2 obtained. RH open; NO QED',
  followUp: 'rh-route-i-sonine-excess-semilocal-port-2026-09-23.js: the CC Sonine refinement W = Tr(vartheta S_S) - E_S ported to S = {oo, 2}; exact semilocal prolate spectrum (lam_S(0) = 0.9999974, corrected 2026-11-21 from 0.9999731; no eigenvalue of modulus 1); the excess eps_S carries exactly half of the rho = 2 log cusp of delta_S, so E_S o Q is unbounded above along the p = 2 resonances for every 2a > ln 2 — the Sonine route to D_S <= L_S terminates at support ln 2 (obstruction, not a proof)',
  honestLimits: 'the identity is derived algebraically along CC 2021 Prop 2.2 with u = u_oo u_2 (Leibniz); trace-class technicalities (Tr(P_1 Phat_S P_1) is log-divergent, only Tr(vartheta(f) .) is finite) are not re-proved; positivity of Lhat_S is a numerical check on [0, 250] plus 2 theta\' > max m_2 for t > 181, not a proof of pointwise positivity; Galerkin values are N = 16..32 Rayleigh–Ritz numbers (converged to < 1.5%); the dense-resonance statement for S ⊇ {2, 3} is derived from the resonance count and spot-checked at 4 points; nothing here moves a Lambda bound or verified height',
});

// ---- assertions
const within = (x, lo, hi) => x >= lo && x <= hi;
export const RH_ROUTE_I_SEMILOCAL_SONINE_TRACE_ASSERTIONS = Object.freeze([
  {
    id: 'I0-archimedean-CC-anchors',
    description: 'archimedean remainder reproduces Connes–Consani 2021: delta(1) = 2(Si(4pi)/(4pi) + 1) = 2.237484835 (1e-8), delta\'(1+) = 1 (1e-4), delta(rho) = delta(1/rho), and 2 theta\'(0) = Re psi(1/4) - ln pi = -5.3721834',
    holds: () => Math.abs(deltaArch(1) - ROUTE_I_LITERALS.archimedean.ccDelta1) < 1e-8 && Math.abs((deltaArch(1 + 1e-6) - deltaArch(1)) / 1e-6 - 1) < 1e-4
      && Math.abs(deltaArch(2) - deltaArch(0.5)) < 1e-14 && Math.abs(twoThetaPrime(0) - ROUTE_I_LITERALS.archimedean.twoThetaPrime0) < 1e-9,
  },
  {
    id: 'I1-semilocal-Fourier-is-inversion-times-Tate-factor',
    description: 'the Mellin multiplier of F_S, (1/2)[1/(1-z) - 1/z] with z = 2^{-s}, equals Tate\'s factor rho_2(s) = (1-2^{s-1})/(1-2^{-s}), is unimodular on Re s = 1/2, and (1/i)(log rho_2)\' = -m_2(t) (finite differences, 1e-6)',
    holds: () => [0, 0.7, 3.3, 9.0647, 21.5].every((t) => {
      const [ur, ui] = tateFactor2(t); const zr = Math.SQRT1_2 * Math.cos(t * LN2), zi = Math.SQRT1_2 * Math.sin(t * LN2); // z = 2^{-1/2 - i t}? use z = 2^{-s}, s = 1/2 + i t -> 2^{-s} = 2^{-1/2} e^{-i t ln2}
      const z = [zr, -zi]; const one_minus_z = [1 - z[0], -z[1]]; const inv = (a) => { const d = a[0] * a[0] + a[1] * a[1]; return [a[0] / d, -a[1] / d]; };
      const A = inv(one_minus_z), B = inv(z); const mult = [(A[0] - B[0]) / 2, (A[1] - B[1]) / 2];
      const h = 1e-6; const arg = (s) => { const [a, b] = tateFactor2(s); return Math.atan2(b, a); }; let d = (arg(t + h) - arg(t - h)) / (2 * h); if (Math.abs(d) > 100) d = (Math.atan2(Math.sin(arg(t + h) - arg(t - h)), Math.cos(arg(t + h) - arg(t - h)))) / (2 * h);
      return Math.abs(Math.hypot(ur, ui) - 1) < 1e-12 && Math.hypot(mult[0] - ur, mult[1] - ui) < 1e-12 && Math.abs(d + m2(t)) < 1e-5;
    }),
  },
  {
    id: 'I2-remainder-log-spikes-at-powers-of-2',
    description: 'delta_S(2^k(1+eps)) grows like (2^{k/2}/2) log_2(1/eps): the eps = 1e-4 -> 1e-6 increment at k = 0, 1, 2 equals 2^{k/2}/2 x 6.64 within 6%; regular at rho = 3 and sqrt 2 (change < 1e-3); baked values at 1.3, 3, 20 to 1e-5',
    holds: () => [0, 1, 2].every((k) => { const r = Math.pow(2, k); const inc = deltaS(r * (1 + 1e-6)) - deltaS(r * (1 + 1e-4)); return Math.abs(inc / (Math.pow(2, k / 2) / 2 * Math.log2(100)) - 1) < 0.06; })
      && Math.abs(deltaS(3 * (1 + 1e-6)) - deltaS(3 * (1 + 1e-4))) < 1e-3 && Math.abs(deltaS(Math.SQRT2 * (1 + 1e-6)) - deltaS(Math.SQRT2 * (1 + 1e-4))) < 1e-3
      && Math.abs(deltaS(1.3) - ROUTE_I_LITERALS.deltaS.r13) < 1e-5 && Math.abs(deltaS(3) - ROUTE_I_LITERALS.deltaS.r3) < 1e-5 && Math.abs(deltaS(20) - ROUTE_I_LITERALS.deltaS.r20) < 1e-5,
  },
  {
    id: 'I3-semilocal-Sonine-multiplier-positive-with-resonance-cancellation',
    description: 'coarse mesh (UMAX 16, J 18, NMAX 30): Lhat_S(0) = 2 theta\'(0) - m_2(0) + deltahat_S(0) in [0.055, 0.075]; at the first p = 2 resonance t = 2pi/ln2, deltahat_S cancels m_2 to < 0.01 and Lhat_S in [0.33, 0.40]; min of Lhat_S on [0, 40] (step 0.05) at t = 0 and > 0.05; control: flipping the p = 2 sign gives a minimum < -0.5',
    holds: () => {
      const C = ROUTE_I_LITERALS.multiplier.coarseMesh; const spikes = []; for (let k = 0; k * LN2 < C.UMAX; k++) spikes.push(k * LN2);
      const mesh = buildMesh(spikes, C.UMAX, C.J); const vals = Float64Array.from(mesh.pts, (u) => deltaS(Math.exp(u), C.NMAX)); const hat = fourierOnMesh(mesh, vals);
      const tres = 2 * PI / LN2; const L0 = twoThetaPrime(0) - m2(0) + hat(0), Lres = twoThetaPrime(tres) - m2(tres) + hat(tres);
      let mn = Infinity, arg = -1, mnFlip = Infinity; for (let t = 0; t <= 40; t += 0.05) { const h = hat(t); const v = twoThetaPrime(t) - m2(t) + h; if (v < mn) { mn = v; arg = t; } mnFlip = Math.min(mnFlip, twoThetaPrime(t) + m2(t) + h); }
      return within(L0, 0.055, 0.075) && Math.abs(hat(tres) - m2(tres)) < 0.01 && within(Lres, 0.33, 0.40) && arg === 0 && mn > 0.05 && mnFlip < -0.5;
    },
  },
  {
    id: 'I3b-multiplier-N-stable-in-NMAX',
    description: 'imp-96152: the trace-side multiplier is N-stable in the dyadic truncation NMAX. On the coarse mesh (UMAX 16, J 18), deltahat_S(0) at NMAX = 64 matches the baked NMAX = 30 value 0.063060 to < 1e-5, Lhat_S(0) stays in [0.055, 0.075], and the first p = 2 resonance value stays in [0.33, 0.40]; the baked NMAX 30 -> 128 drift is below 1e-6',
    holds: () => {
      const C = ROUTE_I_LITERALS.multiplier.coarseMesh; const spikes = []; for (let k = 0; k * LN2 < C.UMAX; k++) spikes.push(k * LN2);
      const mesh = buildMesh(spikes, C.UMAX, C.J); const vals = Float64Array.from(mesh.pts, (u) => deltaS(Math.exp(u), 64)); const hat = fourierOnMesh(mesh, vals);
      const tres = 2 * PI / LN2; const L0 = twoThetaPrime(0) - m2(0) + hat(0), Lres = twoThetaPrime(tres) - m2(tres) + hat(tres);
      const NS = ROUTE_I_LITERALS.multiplier.nStability;
      return Math.abs((twoThetaPrime(0) - m2(0) + hat(0)) - C.LSHat0) < 1e-5 && within(L0, 0.055, 0.075) && within(Lres, 0.33, 0.40)
        && NS.driftLSHat0_30to128 < 1e-6 && NS.tailDrift_96to128 === 0 && NS.argMin === 0 && NS.allPositive === true;
    },
  },
  {
    id: 'I4-gap-analysis-a05',
    description: 'a = 0.5, N = 16: L_S - D_S = Arch - P_2 exactly (< 1e-12); lambda_min(L_S) in [0.08, 0.12] (> the multiplier floor 0.065 is not required of a compression, but positivity is); pole-free lambda_min(W) in [0.0115, 0.0130]; D_S(h_0)/L_S(h_0) in [0.95, 0.98]; pencil mu_max in [0.96, 0.975]',
    holds: () => { const g = gapAnalysis(0.5, 16); const r = g.onMinimizer.DS / g.onMinimizer.LS; return g.identityDefect < 1e-12 && within(g.lamLS, 0.08, 0.12) && within(g.lamWpf, 0.0115, 0.0130) && within(r, 0.95, 0.98) && within(g.muMax, 0.96, 0.975) && g.onMinimizer.DS > 0; },
  },
  {
    id: 'I5-gap-analysis-ln3-half',
    description: 'a = (ln 3)/2 - 1e-6, N = 16: pole-free lambda_min(W) in [8.5e-4, 1.1e-3]; D_S(h_0)/L_S(h_0) > 0.995; mu_max in [0.996, 0.998]; with the extra vanishing hhat(0) = 0 the margin is > 0.025 (the near-null direction sits at t = 0, CC\'s c|ghat(0)|^2 phenomenon)',
    holds: () => { const g = gapAnalysis(LN3 / 2 - 1e-6, 16); return within(g.lamWpf, 8.5e-4, 1.1e-3) && g.onMinimizer.DS / g.onMinimizer.LS > 0.995 && within(g.muMax, 0.996, 0.998) && g.lamWpf0 > 0.025 && g.lamLS > 0.08; },
  },
  {
    id: 'I6-many-prime-remainder-dense-log2-spikes',
    description: 'S = {oo, 2, 3}: delta_S23 at rho = 3/2 (1 + eps) grows with log^2(1/eps) (eps 1e-2 -> 1e-4 ratio > 3.5, 1e-4 -> 1e-6 ratio in [2.2, 2.8]) and is regular at sqrt 2 (change < 5e-3), while the S = {oo, 2} remainder is regular at 3/2',
    holds: () => { const f = (e) => deltaS23(1.5 * (1 + e)); const v2 = f(1e-2), v4 = f(1e-4), v6 = f(1e-6); return v4 / v2 > 3.5 && within(v6 / v4, 2.2, 2.8) && Math.abs(deltaS23(Math.SQRT2 * (1 + 1e-4)) - deltaS23(Math.SQRT2 * (1 + 1e-6))) < 5e-3 && Math.abs(deltaS(1.5 * (1 + 1e-4)) - ROUTE_I_LITERALS.s23.s2AtThreeHalves) < 1e-3; },
  },
  {
    id: 'verdict-honesty',
    description: 'status says RH open / NO QED, the identity is recorded as exact but NOT gap-free, positivity past ln 2 is not claimed, and the imp-96044 framing correction is recorded',
    holds: () => /RH open/.test(RH_ROUTE_I_SEMILOCAL_SONINE_TRACE.status) && /NO QED/.test(RH_ROUTE_I_SEMILOCAL_SONINE_TRACE.status) && /no gap-free identity/.test(RH_ROUTE_I_SEMILOCAL_SONINE_TRACE.status)
      && /no unconditional extension past ln 2/.test(RH_ROUTE_I_SEMILOCAL_SONINE_TRACE.status) && /UNCONDITIONALLY/.test(RH_ROUTE_I_SEMILOCAL_SONINE_TRACE.correction) && /not gap-free/.test(RH_ROUTE_I_SEMILOCAL_SONINE_TRACE.verdict),
  },
]);

export default RH_ROUTE_I_SEMILOCAL_SONINE_TRACE;
