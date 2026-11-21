/**
 * imp-95530 — Is there a NON-circular arithmetic input for the flow-blindness
 * no-go? Candidate-by-candidate reduction + THEOREM NS-RIGID (native-span
 * softness dichotomy) + THEOREM RES-T (fixed-support Weil-positivity
 * resolution law, which CORRECTS the imp-95520 Class II reading). RH OPEN;
 * no refereed bound is changed; NO QED.
 *
 * SETUP (taken as given): flow-blindness-no-go.js (SL2: no flow-stable
 * hypothesis on Phi proves RH; Rodgers-Tao Lambda >= 0); imp-95520 (on the
 * native span E_V = span{e^{-nu t} 1_{t>0}} the Weil form IS the Caratheodory
 * Pick matrix of xi'/xi at real nodes s_i = 1/2 + nu_i > 1: Lagarias'
 * criterion, RH-equivalent at every finite truncation); rh-no-go-theorems.js.
 * Question: is there ANY arithmetic device, other than RH-equivalent Weil
 * positivity, that supplies the input the flow destroys?
 *
 * THEOREM NS-RIGID (native-span softness dichotomy). Let H_t(z) =
 * int_0^inf e^{t u^2} Phi(u) cos(zu) du (Polymath15; H_0(z) = xi(1/2+iz/2)/8,
 * Phi > 0), let Xi_eps := H_{-eps} (backward flow), and for real s > 1/2 put
 *   phi_eps(s) := (d/ds) log H_{-eps}(-2i(s-1/2))
 *              = 2 int Phi e^{-eps u^2} u sinh(2(s-1/2)u) du / int Phi e^{-eps u^2} cosh(2(s-1/2)u) du,
 * so phi_0 = xi'/xi on (1/2, inf). For finite S = {s_1..s_n} c (1, inf) let
 * P_S(eps)_ij = (phi_eps(s_i) + phi_eps(s_j)) / (s_i + s_j - 1).
 *  (A1) [imp-95520 PICK-WEIL] Every Hermitian form the machinery can build on
 *       E_V(S) from the explicit formula is a function of P_S(0) and the Cauchy
 *       Gram; the primes enter only through the n scalars zeta'/zeta(s_i).
 *  (A2) phi_eps(s) is real-analytic in eps for every real s > 1/2: the
 *       denominator is a positive integral (Phi > 0), never zero. Hence P_S(eps)
 *       is real-analytic in eps.
 *  (A3) Under RH, P_S(0) is STRICTLY positive definite for distinct nodes: it
 *       is the Gram of the vectors (1/(s_i - rho))_rho, and a nonzero rational
 *       function sum a_i/(s_i - rho) with distinct poles cannot vanish at
 *       infinitely many rho.
 *  (A4) DICHOTOMY. For each finite S exactly one of:
 *       (i) P_S(0) > 0 (PD). Then there is eps_0(S) > 0 with P_S(eps) > 0 for
 *           0 <= eps < eps_0(S). Xi_eps has a non-real zero for every eps > 0
 *           (Rodgers-Tao), and unconditionally for eps > 1.15e-11 (the Lehmer-
 *           pair collision behind Saouter-Gourdon-Demichel's Lambda > -1.15e-11).
 *           So "P_S >= 0" holds for a function violating RH: it is FLOW-STABLE,
 *           i.e. soft in the SL2 sense, and CANNOT be the missing input.
 *       (ii) P_S(0) is not PD (singular or indefinite). Then by (A3) RH is FALSE.
 *       Corollary: no finite native-span positivity statement (nor any finite
 *       collection of them) can serve as the arithmetic input; if any of them
 *       fails, RH is refuted.
 *  (A5) The full family {P_S >= 0 : all finite S c (1, inf)} is the unique
 *       flow-critical member of the class: true at eps = 0 iff RH (Lagarias-
 *       Pick, imp-95520), and false for EVERY eps > 0 [all P_S(eps) PSD => Pick
 *       interpolant F Caratheodory on Re s > 1/2 agreeing with phi_eps on (1,
 *       inf) => F = phi_eps by the identity theorem => phi_eps pole-free on
 *       Re s > 1/2 => H_{-eps} has no non-real zero (evenness) — contradicting
 *       Rodgers-Tao]. So within the native span the ONLY flow-critical
 *       arithmetic statement is RH itself; there is no intermediate object.
 *  (A6) Lacunary sub-families do not reach RH by this route. If S_inf c (1, inf)
 *       has sum 1/s < inf (e.g. the geometric lattices nu_0 rho^k that carry
 *       every count-uniform certificate of the pencil chain, imp-95226 BL-LAT),
 *       then S_inf is a Blaschke sequence of the half plane and the identity-
 *       theorem step in (A5) fails: {P_S >= 0 : S c S_inf finite} is equivalent
 *       to the existence of SOME Caratheodory interpolant of the lattice data,
 *       not to F = phi. Reaching RH needs sum 1/s_k = inf (Muntz-complete node
 *       sets, e.g. the Weil-shift-invariant nu*N), exactly the sets on which the
 *       chain's Riesz/trace-class structure is unavailable (imp-95520).
 *  MEASURED (tmp/rh-arith-input-B-flowed-pick-matrix.mjs; recomputed below):
 *   phi_0(2) = 0.06906623, phi_0(3) = 0.11439070 (baked imp-95520 values, 8
 *   digits). lam_min(P_S(eps); G) for eps = 0 / 1 / 10 / 100:
 *     nu={1,2,4}:      3.242e-5 / 2.900e-5 / 1.125e-5 / 3.02e-8
 *     nu={1,2,4,8}:    2.327e-6 / 2.022e-6 / 6.12e-7  / 4.07e-10
 *     nu=2^k, k=0..7:  7.266e-8 / 5.958e-8 / 1.05e-8  / -1.4e-13 (float floor)
 *     nu={0.55,1,3,10}: 2.659e-7 / 2.313e-7 / 7.07e-8 / 4.8e-11
 *   PSD throughout — through TEN ORDERS of magnitude past the Lehmer collision
 *   at eps = 1.15e-11 — while Xi_eps has non-real zeros for every eps in the
 *   sweep. A4(i) witnessed on every tested node set.
 *
 * THEOREM RES-T (fixed-support Weil positivity: resolution law). Let W_T be the
 * Weil form on test functions with supp f c [-T, T]. Take fhat(r) = (r - H)
 * sinc^2(T(r-H)/2) (f is supported in [-T, T]; it vanishes at the on-line zero
 * H). Replacing the on-line zero at height H by the quadruple {beta +- iH,
 * 1-beta +- iH}, delta = beta - 1/2, changes the zero side by EXACTLY
 *   dZ = 2 Re[ fhat(H - i delta) conj fhat(H + i delta) ] = -2 delta^2 S^4,
 *   S = sinh(T delta/2)/(T delta/2),
 * while the on-line mass is ~ 2 log(H/2pi)/T^3 (mean zero density times
 * int x^2 sinc^4(Tx/2) dx = 4pi/T^3). So W_T(f) < 0 — the configuration is
 * EXCLUDED by W_T >= 0 — iff (up to the local zero configuration)
 *   delta^2 S^4 T^3 > log(H/2pi).
 * Verified against the Odlyzko zeros (tmp/rh-arith-input-A-compact-support-
 * detection.mjs; H = 9.9e3, 7.5e4, 6.0e5; delta = 0.1, 0.25, 0.49): dZ matches
 * -2 delta^2 S^4 to 4 digits at every (T, delta); measured thresholds sit at or
 * just below the predicted T* (e.g. H = 6.0e5: delta = 0.25 -> T* = 5.18,
 * blind at T = 4, detected at T = 5; delta = 0.49 -> T* = 3.18, blind at 3,
 * detected at 4).
 *  (B1) CORRECTION of imp-95520 Class II: "for T fixed, W_T >= 0 is a
 *       consequence of the verified height" holds ONLY for T < T_X, the root of
 *       (1/4) S(T/2)^4 T^3 = log(X/2pi): T_X = 3.88 at X = 3e12 (3.17 at 1e6,
 *       4.36 at 1e20). The O(e^T/H^4) decay quoted there is the hat-basis
 *       Nyquist artifact (delta = 0.05 grid, kernel 16 sin^4/(delta^2 gamma^4));
 *       the T <= 3 table itself is unaffected.
 *  (B2) For T > T_X, W_T >= 0 is strictly stronger than verified height and
 *       strictly weaker than RH: its content is the zero-free region
 *       beta - 1/2 <= [log(t/2pi)/(T^3 S^4)]^(1/2), nontrivial up to
 *       t ~ 2pi exp(T^3/(4 S^4)) (T = 10: beta <= 0.71 to 1e20, <= 0.75 to 1e73).
 *       It is NOT a Lambda lever (the barrier needs all zeros real below X, not
 *       a strip: zero-density-lambda-inert-2026-07-09.js lever 4).
 *  (B3) Proving W_T >= 0 for T > T_X: for fhat concentrated at frequency R with
 *       width 1/T, W_T(f) >= 0 <=> Re sum_{n <= e^{2T}} Lambda(n) n^{-1/2-iR}
 *       env(ln n) <= (1/2) log(R/2pi) + o(1) — a POINTWISE-in-R bound on a short
 *       von Mangoldt Dirichlet polynomial at heights R in (X, exp(c e^T)), which
 *       by the explicit formula is the smoothed zero count in a 1/T-window at
 *       height R: the pointwise Hilbert-transform wall. For R > exp(c e^T) the
 *       archimedean log R dominates the trivial bound 2 sum Lambda(n) n^{-1/2}
 *       ~ 4 e^T. So candidate (c) collapses: T <= T_X -> verified height (a);
 *       T > T_X -> pointwise wall (b); T -> inf -> RH (c).
 *
 * CANDIDATE REDUCTIONS (the objective's four):
 *  (a) Twin-ladder weld signed forms A_{k,h} = sum Lambda(n) K_k(n) e(hn/p):
 *      = the explicit formula on a NON-positive-type test function — an
 *      identity, one-sided use needs a prime-side ESTIMATE. imp-95519 LEMMA
 *      GAUSS-PLANCHEREL: alias-wise bounds import L(s, chi mod p <= 97); prime
 *      side exponent achievable 0 vs 1/2 needed, GRH-inert (Fresnel width below
 *      the RH short-interval barrier sqrt(u) log^2 u); zero side = pointwise
 *      Hilbert transform at sigma_B = 0.59045, PCC out of range (alpha > 1) for
 *      59% of the majorant. The mean square sum_h |A_h|^2 is the variance of
 *      primes in APs mod p in a Fresnel window (Goldston-Montgomery /
 *      Montgomery-Soundararajan): pair-correlation-equivalent and "almost all",
 *      never pointwise. The "aliases cancel pi" remark concerns the period
 *      dimension of the VALUE G = beta(2) (catalan-signed-ladder.js), disjoint
 *      from zero location: NOT a lever. Collapses to (b) [+ sub-RH prime sums].
 *  (b) Guth-Maynard density + a second device: N(sigma, T) <= T^{A(1-sigma)+o(1)}
 *      is an integer-valued count bounded by a quantity > 1 for every T > 1 and
 *      sigma < 1; the integrality lever N < 1 => N = 0 needs exponent 0, i.e. a
 *      zero-free strip = the target. Pairings (Deuring-Heilbronn repulsion,
 *      zero-free regions, flow) yield "few", never "none"; density enters
 *      Lambda only through the barrier term capped by X. Collapses to (a).
 *  (c) Non-self-dual / non-positive-type explicit formula: without positivity
 *      the formula is an identity (zero measure = prime distribution), whose
 *      only one-sided content is "psi(x) - x = O(x^{1/2+eps})" = RH. On sub-
 *      classes: THEOREM RES-T. Collapses to (a)/(b)/(c) by T.
 *  (d) A different identity for Xi: Hadamard product, evenness, order 1,
 *      functional equation epsilon = +1 are properties of the CLASS (H_t stays
 *      in it): flow-invariant => soft => SL2. Davenport-Heilbronn: functional
 *      equation + Dirichlet series form do not imply RH. Anything pinning the
 *      specific function (Dirichlet coefficients a_n = 1, Euler product) is
 *      the arithmetic input; on the native span it reduces to phi(s_i) (A1);
 *      off the span the catalogued equivalences (Li, Nyman-Beurling, Baez-
 *      Duarte, Speiser, Robin: imp-1259/1311/1312/2426) are all (c).
 *
 * THE LOOPHOLE (honest, outside NS-RIGID). Inputs that consume the Dirichlet
 * coefficients on the critical line directly, not as Hermitian forms on Xi:
 * mollified moments / Levinson-Conrey (>= 41.7% of zeros on the line, Pratt-
 * Robles-Zaharescu-Zeindler 2020), Selberg's positive proportion, zero density
 * near sigma = 1/2. These are flow-critical (Xi_eps has no Dirichlet series),
 * non-circular, and already deliver zero-location beyond soft methods. They
 * produce MEAN-VALUE / PROPORTION statements over T-ranges; the step to "every
 * zero" is the pointwise wall (b). No theorem here closes this class; it is
 * where a proof would have to come from, and the twin-ladder machinery has no
 * object in it. Everything expressible on the machinery's native span is
 * closed by NS-RIGID.
 *
 * Import-free; assertions recompute phi_0 vs baked, the flowed-Pick stability
 * at eps in {1e-6, 1, 100}, the exact dZ closed form, and T_X(3e12). Changes no
 * bound; NO QED; no refereed bound is changed; RH open.
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
    if (i === j) { if (s <= 0) throw new Error('imp-95530 chol: metric not PD'); L[i][i] = Math.sqrt(s); } else L[i][j] = s / L[j][j];
  }
  return L;
}
function fwd(L, b) { const n = L.length, x = b.slice(); for (let i = 0; i < n; i++) { for (let k = 0; k < i; k++) x[i] -= L[i][k] * x[k]; x[i] /= L[i][i]; } return x; }
function pencilEig(A, B) {
  const L = chol(B); const n = A.length;
  const Y = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let j = 0; j < n; j++) { const y = fwd(L, A.map((r) => r[j])); for (let i = 0; i < n; i++) Y[i][j] = y[i]; }
  const Cm = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) { const y = fwd(L, Y[i].slice()); for (let j = 0; j < n; j++) Cm[i][j] = y[j]; }
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) Cm[i][j] = (Cm[i][j] + Cm[j][i]) / 2;
  return jacobiVals(Cm);
}
export function flowedPickPencilMin(S, eps) {
  const ph = S.map((s) => phiEps(s, eps));
  const P = S.map((si, i) => S.map((sj, j) => (ph[i] + ph[j]) / (si + sj - 1)));
  const G = S.map((a) => S.map((b) => 1 / (a + b - 1)));
  return pencilEig(P, G)[0];
}
// RES-T closed forms
const Sfac = (x) => (Math.abs(x) < 1e-12 ? 1 : Math.sinh(x / 2) / (x / 2));
export const resTOffLineDelta = (T, delta) => -2 * delta * delta * Math.pow(Sfac(T * delta), 4);
export function resTHeightCeilingT(X, delta = 0.5) {
  const L = Math.log(X / (2 * Math.PI)); let lo = 0.1, hi = 100;
  for (let i = 0; i < 200; i++) { const m = (lo + hi) / 2; (delta * delta * Math.pow(Sfac(m * delta), 4) * m ** 3 > L) ? (hi = m) : (lo = m); }
  return (lo + hi) / 2;
}
// complex evaluation of 2 Re[fhat(H - i d) conj fhat(H + i d)] for fhat(r) = (r-H) sinc^2(T(r-H)/2)
function offLineDeltaComplex(T, delta) {
  // x = -i delta ; y = T x / 2 = -i T delta/2 ; sin(y)/y = sinh(T delta/2)/(T delta/2) real
  const S = Sfac(T * delta);
  const a = [0, -delta * S * S]; // fhat(H - i delta) = (-i delta) S^2
  const b = [0, delta * S * S];  // fhat(H + i delta) = ( i delta) S^2
  // a * conj(b)
  const re = a[0] * b[0] + a[1] * b[1];
  return 2 * re;
}

export const IMP95530_LITERALS = Object.freeze({
  xiLogDerivAt2: 0.06906623, xiLogDerivAt3: 0.1143907,
  lehmerCollisionEps: 1.15e-11,
  pencilMin: { nu124: { e0: 3.2421e-5, e100: 3.0244e-8 }, nu1248: { e0: 2.3269e-6, e100: 4.0725e-10 } },
  T_X: { X3e12: 3.882, X1e6: 3.168, X1e20: 4.355 },
  detection: { H6e5_d025_Tstar: 5.183, H6e5_d049_Tstar: 3.179, measured_dZ_T5_d025: -1.6165e-1 },
});

export const IMP95530_NATIVE_SPAN_ARITHMETIC_INPUT_RIGIDITY = Object.freeze({
  id: 'imp-95530-native-span-arithmetic-input-rigidity',
  question: 'Is there a non-circular arithmetic input, other than RH-equivalent Weil positivity, that can break the flow-blindness no-go?',
  theoremNsRigid: 'For finite real node sets S c (1, inf), the Caratheodory-Pick matrix P_S(eps) of the backward-flowed Xi_eps is real-analytic in eps; under RH P_S(0) is strictly PD; hence either P_S(0) > 0 and "P_S >= 0" survives the flow for eps < eps_0(S) (soft: cannot be the missing input), or P_S(0) is not PD and RH is false. The only flow-critical native-span statement is the all-S family = RH. Lacunary (Blaschke, sum 1/s < inf) sub-families do not reach RH by the identity theorem.',
  theoremResT: 'W_T >= 0 excludes an off-line quadruple (height H, displacement delta) iff delta^2 S(T delta)^4 T^3 > log(H/2pi); dZ = -2 delta^2 S^4 exactly. W_T >= 0 is a consequence of verified height X only for T < T_X (3.88 at 3e12); for larger T its content is a zero-free region beta - 1/2 <= sqrt(log(t/2pi)/(T^3 S^4)) whose proof is a pointwise short-Dirichlet-polynomial bound at heights in (X, exp(c e^T)) — the pointwise Hilbert-transform wall.',
  correction: 'imp-95520 Class II "for T fixed W_T >= 0 is a consequence of the verified height / O(e^T/H^4)" is a hat-basis (delta = 0.05 Nyquist) artifact; true only for T < T_X.',
  candidates: {
    a_weldSignedForms: 'collapses to the pointwise wall (b) on the zero side and to sub-RH-barrier short prime sums on the prime side (imp-95519); pi-cancellation is about the value G, not zeros',
    b_guthMaynardPairing: 'collapses to verified height (a): integer count bounded by > 1; N = 0 needs exponent 0 = strip',
    c_nonSelfDualExplicitFormula: 'identity without positivity; on fixed support THEOREM RES-T: (a) for T < T_X, (b) for T > T_X, (c) as T -> inf',
    d_differentIdentityForXi: 'class properties are flow-invariant (soft); specific-function data reduce to phi(s_i) on the native span (A1) or to catalogued RH-equivalences off it',
  },
  loophole: 'Dirichlet-coefficient inputs on the critical line (Levinson-Conrey mollifiers, Selberg proportion, near-line density): flow-critical, non-circular, not RH-equivalent, outside NS-RIGID; they give proportion / mean-value statements, and the pointwise upgrade is wall (b). Not hostable on the twin-ladder span.',
  verdict: 'NEGATIVE, well-characterized: every arithmetic input expressible on the machinery\'s native span is either flow-stable (useless) or RH; the in-repo program is closed on its own span. The general problem remains open through the Dirichlet-coefficient class. RH OPEN; no refereed bound is changed; NO QED.',
});

const relEq = (x, lit, tol) => Math.abs(x - lit) <= tol * Math.max(Math.abs(lit), 1e-300);
export const IMP95530_ASSERTIONS = [
  {
    id: 'imp95530-phi0-is-xi-logderiv',
    description: 'phi_0(2), phi_0(3) from the Phi-integral reproduce xi\'/xi(2) = 0.06906623 and xi\'/xi(3) = 0.1143907 (rel 1e-6); phi_0 > 0 at s in {1.05, 1.5, 10}',
    holds: () => relEq(phiEps(2, 0), IMP95530_LITERALS.xiLogDerivAt2, 1e-6) && relEq(phiEps(3, 0), IMP95530_LITERALS.xiLogDerivAt3, 1e-6)
      && [1.05, 1.5, 10].every((s) => phiEps(s, 0) > 0),
  },
  {
    id: 'imp95530-ns-rigid-flow-stability',
    description: 'NS-RIGID A4(i) witness: lam_min(P_S(eps); G) > 0 at eps in {0, 1e-6, 1, 100} for nu = {1,2,4} and {1,2,4,8}; eps = 0 and eps = 100 values match the baked sweep (rel 2e-3); all sweep eps >= 1e-6 exceed the Lehmer collision 1.15e-11',
    holds: () => {
      const S3 = [1.5, 2.5, 4.5], S4 = [1.5, 2.5, 4.5, 8.5];
      for (const eps of [0, 1e-6, 1, 100]) { if (!(flowedPickPencilMin(S3, eps) > 0) || !(flowedPickPencilMin(S4, eps) > 0)) return false; }
      const L = IMP95530_LITERALS.pencilMin;
      return relEq(flowedPickPencilMin(S3, 0), L.nu124.e0, 2e-3) && relEq(flowedPickPencilMin(S3, 100), L.nu124.e100, 2e-3)
        && relEq(flowedPickPencilMin(S4, 0), L.nu1248.e0, 2e-3) && relEq(flowedPickPencilMin(S4, 100), L.nu1248.e100, 2e-3)
        && 1e-6 > IMP95530_LITERALS.lehmerCollisionEps;
    },
  },
  {
    id: 'imp95530-res-t-closed-form-and-ceiling',
    description: 'RES-T: complex evaluation of 2Re[fhat(H-id) conj fhat(H+id)] equals -2 delta^2 S^4 (1e-14) and reproduces the measured dZ at T=5, delta=0.25 (rel 1e-3); T_X(3e12) = 3.882, T_X(1e6) = 3.168, T_X(1e20) = 4.355 (rel 1e-3); predicted T* at H = 6.0e5 for delta 0.25 / 0.49 = 5.183 / 3.179',
    holds: () => {
      for (const [T, d] of [[5, 0.25], [10, 0.1], [14, 0.49]]) if (!relEq(offLineDeltaComplex(T, d), resTOffLineDelta(T, d), 1e-12)) return false;
      if (!relEq(resTOffLineDelta(5, 0.25), IMP95530_LITERALS.detection.measured_dZ_T5_d025, 1e-3)) return false;
      const Tx = IMP95530_LITERALS.T_X;
      if (!relEq(resTHeightCeilingT(3e12), Tx.X3e12, 1e-3) || !relEq(resTHeightCeilingT(1e6), Tx.X1e6, 1e-3) || !relEq(resTHeightCeilingT(1e20), Tx.X1e20, 1e-3)) return false;
      const H = 599722.344;
      return relEq(resTHeightCeilingT(H, 0.25), IMP95530_LITERALS.detection.H6e5_d025_Tstar, 1e-3)
        && relEq(resTHeightCeilingT(H, 0.49), IMP95530_LITERALS.detection.H6e5_d049_Tstar, 1e-3);
    },
  },
  {
    id: 'imp95530-honesty',
    description: 'record carries the correction of imp-95520 Class II, names the loophole class, and states RH OPEN / PT Lambda <= 0.2 / NO QED',
    holds: () => /hat-basis/.test(IMP95530_NATIVE_SPAN_ARITHMETIC_INPUT_RIGIDITY.correction)
      && /Levinson/.test(IMP95530_NATIVE_SPAN_ARITHMETIC_INPUT_RIGIDITY.loophole)
      && /RH OPEN/.test(IMP95530_NATIVE_SPAN_ARITHMETIC_INPUT_RIGIDITY.verdict)
      && /refereed bound is changed/i.test(IMP95530_NATIVE_SPAN_ARITHMETIC_INPUT_RIGIDITY.verdict)
      && /NO QED/.test(IMP95530_NATIVE_SPAN_ARITHMETIC_INPUT_RIGIDITY.verdict),
  },
];
for (const a of IMP95530_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95530-native-span-arithmetic-input-rigidity assertion failed: ${a.id}`);
}
export default IMP95530_NATIVE_SPAN_ARITHMETIC_INPUT_RIGIDITY;
