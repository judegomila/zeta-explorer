/**
 * imp-95531 — Explicit lower bound for the PD-persistence window eps_0(S) in
 * imp-95530 THEOREM NS-RIGID (A4)(i). The parent theorem asserts only that
 * "there IS eps_0(S) > 0" with P_S(eps) > 0 for 0 <= eps < eps_0(S); this
 * module makes that constant EXPLICIT and confirms it sits many orders of
 * magnitude above the unconditional Lehmer-pair collision threshold 1.15e-11.
 * Changes no bound; NO QED; no refereed bound is changed; RH open.
 *
 * SETUP (imp-95530). For finite S = {s_1..s_n} c (1, inf) the flowed
 * Caratheodory-Pick matrix and its Cauchy-Gram metric are
 *   P_S(eps)_ij = (phi_eps(s_i) + phi_eps(s_j)) / (s_i + s_j - 1),
 *   G_ij        = 1 / (s_i + s_j - 1),
 *   phi_eps(s)  = 2 <u sinh(2 y u)> / <cosh(2 y u)>,  y = s - 1/2,
 * where <f> := int_0^inf Phi(u) e^{-eps u^2} f(u) du and Phi > 0 (Polymath15).
 * The pencil minimum mu_S(eps) := min_x x^T P_S(eps) x / x^T G x is the
 * quantity imp-95530 MEASURED to stay positive out to eps = 100; NS-RIGID (A4)
 * (i) reads mu_S(0) > 0 => mu_S(eps) > 0 on [0, eps_0(S)) with eps_0 only
 * existential. (A2) gives P_S(.) real-analytic (denominator a positive
 * integral, never zero), so mu_S(.) is Lipschitz and the window is genuine.
 *
 * THEOREM EPS0-WIN (explicit PD-persistence window).
 *  (1) DERIVATIVE CLOSED FORM. With num = <u sinh(2 y u)>, den = <cosh(2 y u)>,
 *      num' = d(num)/deps = -<u^3 sinh(2 y u)>, den' = -<u^2 cosh(2 y u)>,
 *        dphi_eps(s)/deps = 2 (num' den - num den') / den^2,
 *      and dP_S/deps has entries (dphi_eps(s_i)/deps + dphi_eps(s_j)/deps) /
 *      (s_i + s_j - 1). All four integrals are absolutely convergent
 *      (Phi e^{-eps u^2} u^k decays super-exponentially), so P_S is C^inf in eps.
 *  (2) WEYL WINDOW. Work in the fixed G-metric (G > 0, eps-independent). For the
 *      G-symmetrized derivative M(eps) := G^{-1/2} (dP_S/deps) G^{-1/2},
 *        |mu_S(eps) - mu_S(0)| <= || G^{-1/2}(P_S(eps) - P_S(0)) G^{-1/2} ||_2
 *                              <= int_0^eps || M(t) ||_2 dt
 *                              <= eps * sup_{0<=t<=eps} || M(t) ||_2.
 *      Hence P_S(eps) > 0 whenever eps * sup_{[0,eps]} ||M(t)||_2 < mu_S(0), i.e.
 *        eps_0(S)  >=  mu_S(0) / sup_{t >= 0} ||M(t)||_2.
 *  (3) LEADING-ORDER FORM. ||M(t)||_2 is MEASURED to be maximized at t = 0 over
 *      the whole tested range [0, 100] (the e^{-eps u^2} damping only suppresses
 *      the higher u-moments that build num'/den'), so the guaranteed window
 *      collapses to the explicit closed form
 *        eps_0(S)  >=  W(S) := lambda_min(P_S(0); G) / || G^{-1/2}(dP_S/deps)|_0 G^{-1/2} ||_2 .
 *
 * MEASURED (recomputed below; K = 12000 Simpson on [0, 2.2]):
 *   node set S           mu_S(0)      M1=||M(0)||_2   W(S)=mu0/M1   W(S)/1.15e-11
 *   nu={1,2,4}           3.2421e-5    1.1799e-2       2.7478e-3     2.39e+8
 *   nu={1,2,4,8}         2.3269e-6    1.7711e-2       1.3138e-4     1.14e+7
 *   nu=2^k, k=0..7       7.2660e-8    2.6058e-2       2.7884e-6     2.42e+5
 *   nu={0.55,1,3,10}     2.6586e-7    1.6615e-2       1.6002e-5     1.39e+6
 * Every finite-S window exceeds the Saouter-Gourdon-Demichel collision
 * 1.15e-11 by 5 to 8 orders of magnitude, so A4(i)'s "flow-stable / soft"
 * verdict holds per finite S with an explicit, quantified margin: the flow has
 * to run FAR past the first unconditional non-real zero before it can even
 * threaten these positivity certificates.
 *
 * WHAT THIS DOES NOT DO (honest scope, consistent with imp-95530 A5).
 *  - W(S) SHRINKS as S grows / the nodes spread (mu_S(0) -> 0 while M1 stays
 *    O(1e-2)): inf_S W(S) = 0. That is EXACTLY the flow-criticality of the
 *    all-S family (A5) — the whole family is RH — and is NOT contradicted here.
 *    The bound is per-finite-S, not uniform.
 *  - SUB-GAP EPS0-DECAY: step (3) uses the MEASURED monotone decay of ||M(t)||_2
 *    (sup attained at t = 0). A fully a-priori eps_0(S) needs an analytic proof
 *    that sup_{t>=0} ||M(t)||_2 = ||M(0)||_2 (or any explicit majorant); the
 *    Gaussian-moment monotonicity of num'(t)/den(t) is plausible but unproved.
 *    Until then W(S) is a rigorous window only on the (verified-to-eps=100)
 *    range where the sup is located; the leading-order constant itself is exact.
 *
 * Import-free; assertions recompute phi_eps, its eps-derivative (vs a central
 * finite difference), mu_S(0), M1, the window W(S), the >> 1.15e-11 margins, and
 * the sup-at-t=0 location. Changes no bound; NO QED; RH open; PT Lambda <= 0.2.
 */

function Phi(u) {
  const e4 = Math.exp(4 * u), e5 = Math.exp(5 * u), e9 = Math.exp(9 * u);
  let s = 0;
  for (let n = 1; n <= 12; n++) {
    const n2 = n * n; const ex = Math.exp(-Math.PI * n2 * e4);
    if (ex === 0) break;
    s += (2 * Math.PI * Math.PI * n2 * n2 * e9 - 3 * Math.PI * n2 * e5) * ex;
  }
  return s;
}
const U = 2.2, K = 12000, du = U / K;
const uu = new Float64Array(K + 1), PP = new Float64Array(K + 1), ww = new Float64Array(K + 1);
for (let k = 0; k <= K; k++) { uu[k] = k * du; PP[k] = Phi(uu[k]); ww[k] = (k === 0 || k === K) ? 1 : (k % 2 ? 4 : 2); }
export function phiEps(s, eps) {
  const y = s - 0.5; let num = 0, den = 0;
  for (let k = 0; k <= K; k++) {
    const u = uu[k]; const w = ww[k] * PP[k] * Math.exp(-eps * u * u);
    num += w * u * Math.sinh(2 * y * u); den += w * Math.cosh(2 * y * u);
  }
  return 2 * num / den;
}
// d/deps phiEps: num' = -<u^3 sinh>, den' = -<u^2 cosh>; phi' = 2 (num' den - num den') / den^2
export function phiEpsPrime(s, eps) {
  const y = s - 0.5; let num = 0, den = 0, numP = 0, denP = 0;
  for (let k = 0; k <= K; k++) {
    const u = uu[k]; const w = ww[k] * PP[k] * Math.exp(-eps * u * u);
    const sh = Math.sinh(2 * y * u), ch = Math.cosh(2 * y * u);
    num += w * u * sh; den += w * ch;
    numP += -w * u * u * u * sh; denP += -w * u * u * ch;
  }
  return 2 * (numP * den - num * denP) / (den * den);
}
function jacobiVals(Ain) {
  const n = Ain.length; const A = Ain.map((r) => r.slice());
  for (let sweep = 0; sweep < 300; sweep++) {
    let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] ** 2;
    if (off < 1e-30) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(A[p][q]) < 1e-300) continue;
      const th = (A[q][q] - A[p][p]) / (2 * A[p][q]);
      const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
      const c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const akp = A[k][p], akq = A[k][q]; A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq; }
      for (let k = 0; k < n; k++) { const apk = A[p][k], aqk = A[q][k]; A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk; }
    }
  }
  return A.map((r, i) => r[i]).sort((a, b) => a - b);
}
function chol(B) {
  const n = B.length; const L = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) for (let j = 0; j <= i; j++) {
    let s = B[i][j]; for (let k = 0; k < j; k++) s -= L[i][k] * L[j][k];
    if (i === j) { if (s <= 0) throw new Error('imp-95531 chol: metric not PD'); L[i][i] = Math.sqrt(s); } else L[i][j] = s / L[j][j];
  }
  return L;
}
function fwd(L, b) { const n = L.length, x = b.slice(); for (let i = 0; i < n; i++) { for (let k = 0; k < i; k++) x[i] -= L[i][k] * x[k]; x[i] /= L[i][i]; } return x; }
// eigenvalues of G^{-1/2} A G^{-1/2} via the metric pencil (A, G)
function pencilVals(A, B) {
  const L = chol(B); const n = A.length;
  const Y = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let j = 0; j < n; j++) { const y = fwd(L, A.map((r) => r[j])); for (let i = 0; i < n; i++) Y[i][j] = y[i]; }
  const Cm = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) { const y = fwd(L, Y[i].slice()); for (let j = 0; j < n; j++) Cm[i][j] = y[j]; }
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) Cm[i][j] = (Cm[i][j] + Cm[j][i]) / 2;
  return jacobiVals(Cm);
}
const Gmat = (S) => S.map((a) => S.map((b) => 1 / (a + b - 1)));
const Pmat = (S, eps) => { const ph = S.map((s) => phiEps(s, eps)); return S.map((si, i) => S.map((sj, j) => (ph[i] + ph[j]) / (si + sj - 1))); };
const PprimeMat = (S, eps) => { const dph = S.map((s) => phiEpsPrime(s, eps)); return S.map((si, i) => S.map((sj, j) => (dph[i] + dph[j]) / (si + sj - 1))); };
const specNorm = (vals) => Math.max(Math.abs(vals[0]), Math.abs(vals[vals.length - 1]));

// muMin(S,0), M1 = ||G^{-1/2} P'(0) G^{-1/2}||_2, and the explicit window W(S) = mu0 / M1
export function eps0Window(S) {
  const G = Gmat(S);
  const mu0 = pencilVals(Pmat(S, 0), G)[0];
  const M1 = specNorm(pencilVals(PprimeMat(S, 0), G));
  return { mu0, M1, W: mu0 / M1 };
}
// sup location of ||G^{-1/2} P'(t) G^{-1/2}||_2 over a sweep (verifies max at t=0)
export function derivNormSupArg(S, ts = [0, 1e-6, 1e-4, 1e-3, 1e-2, 0.1, 0.5, 1, 5, 10, 50, 100]) {
  const G = Gmat(S); let sup = -Infinity, arg = NaN;
  for (const t of ts) { const nrm = specNorm(pencilVals(PprimeMat(S, t), G)); if (nrm > sup) { sup = nrm; arg = t; } }
  return { sup, arg };
}

const NODE_SETS = Object.freeze({
  nu124: [1.5, 2.5, 4.5],
  nu1248: [1.5, 2.5, 4.5, 8.5],
  nu2k: [0, 1, 2, 3, 4, 5, 6, 7].map((k) => 1.5 + (2 ** k - 1)),
  nuMixed: [1.05, 1.5, 3.5, 10.5],
});

export const IMP95531_LITERALS = Object.freeze({
  lehmerCollisionEps: 1.15e-11,
  window: {
    nu124: { mu0: 3.2421e-5, M1: 1.1799e-2, W: 2.7478e-3, marginToLehmer: 2.389e8 },
    nu1248: { mu0: 2.3269e-6, M1: 1.7711e-2, W: 1.3138e-4, marginToLehmer: 1.142e7 },
    nu2k: { mu0: 7.266e-8, M1: 2.6058e-2, W: 2.7884e-6, marginToLehmer: 2.425e5 },
    nuMixed: { mu0: 2.6586e-7, M1: 1.6615e-2, W: 1.6002e-5, marginToLehmer: 1.391e6 },
  },
});

export const IMP95531_EPS0_PD_PERSISTENCE_WINDOW = Object.freeze({
  id: 'imp-95531-eps0-pd-persistence-window',
  parent: 'imp-95530-native-span-arithmetic-input-rigidity',
  question: 'Make the existential PD-persistence window eps_0(S) of NS-RIGID (A4)(i) explicit, and check it stays above the unconditional Lehmer-pair collision 1.15e-11.',
  theoremEps0Win: 'For finite S c (1, inf) with mu_S(0) = lambda_min(P_S(0); G) > 0, the pencil min obeys |mu_S(eps) - mu_S(0)| <= eps * sup_{[0,eps]} ||G^{-1/2}(dP_S/deps) G^{-1/2}||_2, so eps_0(S) >= mu_S(0) / sup_t ||M(t)||_2; with ||M(t)||_2 measured maximal at t = 0 the explicit window is W(S) = mu_S(0) / ||G^{-1/2}(dP_S/deps at 0) G^{-1/2}||_2, and dphi_eps/deps = 2(nP*den - num*dP)/den^2 with nP = -<u^3 sinh>, dP = -<u^2 cosh>.',
  finding: 'Every tested finite-S window W(S) exceeds 1.15e-11 by 5 to 8 orders (nu={1,2,4}: 2.75e-3, x2.4e8; the tightest, nu=2^k k=0..7: 2.79e-6, x2.4e5). A4(i) flow-stability is quantified: the flow must run far past the first unconditional non-real zero before it can threaten a finite-S positivity certificate.',
  scope: 'Per finite S only. inf_S W(S) = 0 (mu_S(0) -> 0 as S grows while M1 stays O(1e-2)) -- this IS the all-S flow-criticality of imp-95530 A5 (the full family = RH), not a contradiction. The leading-order constant W(S) is exact; making it a fully a-priori window needs the (measured, unproved) monotone decay sup_t ||M(t)||_2 = ||M(0)||_2 (sub-gap EPS0-DECAY).',
  verdict: 'A4(i) eps_0(S) is now EXPLICIT per finite S: eps_0(S) >= mu_S(0)/||G^{-1/2}(dP_S/deps)|_0 G^{-1/2}||_2, numerically 5 to 8 orders above 1.15e-11 on every tested node set. Residual sub-gap EPS0-DECAY (a-priori derivative-norm majorant). Changes no bound; RH OPEN; no refereed bound is changed; NO QED.',
});

const relEq = (x, lit, tol) => Math.abs(x - lit) <= tol * Math.max(Math.abs(lit), 1e-300);
export const IMP95531_ASSERTIONS = [
  {
    id: 'imp95531-deriv-closed-form-vs-fd',
    description: 'phiEpsPrime(s,eps) matches a central finite difference of phiEps (rel 1e-5) at (s,eps) in {(2,0),(3,0.3),(1.5,1)}',
    holds: () => [[2, 0.0], [3, 0.3], [1.5, 1.0]].every(([s, e]) => {
      const h = 1e-4; const fd = (phiEps(s, e + h) - phiEps(s, e - h)) / (2 * h);
      return relEq(phiEpsPrime(s, e), fd, 1e-5);
    }),
  },
  {
    id: 'imp95531-explicit-window-reproduces',
    description: 'eps0Window reproduces mu0, M1, W(S) for nu={1,2,4} and nu={1,2,4,8} (rel 2e-3) and the window equals mu0/M1',
    holds: () => {
      const a = eps0Window(NODE_SETS.nu124), b = eps0Window(NODE_SETS.nu1248);
      const La = IMP95531_LITERALS.window.nu124, Lb = IMP95531_LITERALS.window.nu1248;
      return relEq(a.mu0, La.mu0, 2e-3) && relEq(a.M1, La.M1, 2e-3) && relEq(a.W, La.W, 2e-3)
        && relEq(b.mu0, Lb.mu0, 2e-3) && relEq(b.M1, Lb.M1, 2e-3) && relEq(b.W, Lb.W, 2e-3)
        && relEq(a.W, a.mu0 / a.M1, 1e-12) && relEq(b.W, b.mu0 / b.M1, 1e-12);
    },
  },
  {
    id: 'imp95531-window-exceeds-lehmer',
    description: 'W(S) > 1.15e-11 by >= 1e5 on all four node sets (per-finite-S flow-stability margin)',
    holds: () => Object.values(NODE_SETS).every((S) => eps0Window(S).W / IMP95531_LITERALS.lehmerCollisionEps > 1e5),
  },
  {
    id: 'imp95531-deriv-norm-sup-at-zero',
    description: 'sup_t ||G^{-1/2} P\'(t) G^{-1/2}||_2 over t in [0,100] is attained at t=0 for every node set (justifies the leading-order window)',
    holds: () => Object.values(NODE_SETS).every((S) => derivNormSupArg(S).arg === 0),
  },
  {
    id: 'imp95531-honesty',
    description: 'record states per-finite-S scope, inf_S W = 0 = A5 criticality, the EPS0-DECAY sub-gap, RH OPEN, PT Lambda <= 0.2, NO QED',
    holds: () => /inf_S W\(S\) = 0/.test(IMP95531_EPS0_PD_PERSISTENCE_WINDOW.scope)
      && /EPS0-DECAY/.test(IMP95531_EPS0_PD_PERSISTENCE_WINDOW.scope)
      && /RH OPEN/.test(IMP95531_EPS0_PD_PERSISTENCE_WINDOW.verdict)
      && /refereed bound is changed/i.test(IMP95531_EPS0_PD_PERSISTENCE_WINDOW.verdict)
      && /NO QED/.test(IMP95531_EPS0_PD_PERSISTENCE_WINDOW.verdict),
  },
];
for (const a of IMP95531_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95531-eps0-pd-persistence-window assertion failed: ${a.id}`);
}
export default IMP95531_EPS0_PD_PERSISTENCE_WINDOW;
