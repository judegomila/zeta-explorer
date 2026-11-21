/**
 * rh-route-i-direct-sonine-trace-certificate (2026-09-24) — the DIRECT attack on the Route I inequality
 *     D_S(h) <= L_S(h)   on pole-free h in L^2(-a, a),  ln 2 < 2a < ln 3,
 * keeping the semilocal Sonine trace L_S = Tr(vartheta(f) P Phat_S P) WHOLE instead of splitting it into
 * Sonine-space part minus excess and bounding the excess (the Connes–Consani route, which the sibling module
 * rh-route-i-sonine-excess-semilocal-port shows is unbounded above along the p = 2 resonances for 2a > ln 2).
 *
 * RESULT IN ONE LINE. "Retaining the full trace" is EXACTLY the statement that the Weil symbol w = Lhat_S - deltahat_S
 * has a POSITIVE representative on L^2(-a,a): D_S <= L_S on pole-free h  <=>  there is an even kernel modification
 * phi with phi = alpha cosh(u/2) + beta u sinh(u/2) on |u| < 2a (the two-dimensional pole freedom) and free on
 * |u| >= 2a such that w + phihat >= 0 on R (Krein-type extension; the free part is the kernel outside the window).
 * Such certificates are CONSTRUCTED here by linear programming and verified pointwise (fine grid + explicit Lipschitz
 * safety + analytic tail): THEOREM (computer-assisted, IEEE double, not interval-verified). For every a <= 0.48
 * (2a <= 0.96 > ln 2 = 0.6931) and every real h in L^2(-a, a) with hhat(±i/2) = 0:
 *     W(h) = Arch(h) - P_2(h) = L_S(h) - D_S(h) >= m(a) ||h||_2^2,
 * with certified margins m = 0.0467 (a = 0.40), 0.0160 (0.44), 0.0077 (0.46), 0.0016 (0.48). The certificates are
 * finite lists of numbers (alpha, beta, 81 or 241 kernel values) baked below; anyone can re-check the 1-D inequality.
 * Independently and by a different mechanism, rh-route-i-uncertainty-concentration-certificate-2026-09-24 (primal
 * Galerkin lower bound with an explicit truncation tail) certifies the whole range a <= (ln 3)/2 with margin 9.04e-4;
 * the present dual certificates cover the smaller range 2a <= 0.96 with margins 2–50 x larger and cross-validate that
 * claim by a proof of a different shape. Both are floating-point computer-assisted arguments; neither localises a
 * zero; fixed-window Weil positivity implies nothing about RH. RH open; no refereed bound is changed; NO QED.
 *
 * ---------------------------------------------------------------------------------------------------------------
 * 1. THE EXPLICIT FORMS (all on L^2(-a,a), u = log rho, f = h*h~ the autocorrelation, supp f in [-2a, 2a]).
 *    Symbol level (Toeplitz forms on the line; Route I identity module):
 *       W(h) = (1/2pi) int w(t) |hhat(t)|^2 dt,   w = 2theta'(t) - m_2(t)   [= Lhat_S - deltahat_S],
 *       D_S(h) = (1/2pi) int deltahat_S |hhat|^2,  L_S(h) = (1/2pi) int Lhat_S |hhat|^2,  Lhat_S = w + deltahat_S > 0 pointwise.
 *    Spectral form of the trace (CC Prop 4.5 / Thm 4.7 ported, excess module §3): with xi_n, lam_n the semilocal prolate
 *    eigenpairs, zeta_n = P F_S xi_n / ||.||, and S_S the Sonine projection,
 *       Lhat_S(t) = zhat(t) + Shat_S(t),   deltahat_S(t) = zhat(t) + epshat_S(t),   zhat(t) = Sum_n lam_n^2 |zeta~_n(1/2 + it)|^2,
 *    where zeta~_n is the Mellin transform (dilation power spectrum) of zeta_n; z = delta_S - eps_S = delta^in - corr is the
 *    positive part common to BOTH forms and cancels in w = Shat_S - epshat_S. So at the symbol level "L_S's resonant
 *    mass vs D_S's" is just w(t) itself.
 *    For 2a < ln 3 only the prime power 2 enters and the symbol may be taken as
 *       w_1(t) = 2theta'(t) - sqrt2 ln2 cos(t ln2)    (P_2(h) = sqrt2 ln2 f(ln2)),
 *    i.e. the autocorrelation form  W(h) = 2theta'(0) f(0) + 2 int_0^{2a} e^{-v/2}(f(0) - f(v))/(1 - e^{-2v}) dv
 *                                          + 2 f(0) int_{2a}^oo e^{-v/2}/(1 - e^{-2v}) dv - sqrt2 ln2 f(ln2)
 *    (checked against the Route H Legendre assembly: Arch to 0.08% at quadrature resolution, the P_2 piece to 0.4%).
 *    Pole freedom, exactly: with A = <h, e^{u/2}>, B = <h, e^{-u/2}>, A' = <h, u e^{u/2}>, B' = <h, u e^{-u/2}>,
 *       <f, cosh(u/2)> = A B,      <f, u sinh(u/2)> = A' B - A B'          (elementary; assertion D0 checks it numerically),
 *    so for pole-free h (A = B = 0) both pairings vanish — and these two are ALL the even Toeplitz kernels annihilated by
 *    pole-free autocorrelations (Q^2 phi = 0 on (-2a,2a), Q = -d^2/du^2 + 1/4). alpha = 2, beta = 0 is the actual Weil
 *    pole term Phi(0) + Phi(1) = <f, 2cosh(u/2)>.
 *
 * 2. THE DIRECT BOUND AT THE SYMBOL LEVEL FAILS — QUANTIFIED. At the p = 2 resonances t_k = 2 pi k/ln 2:
 *       Lhat_S(t_1) = 0.3675 vs deltahat_S(t_1) = 3.3483  (ratio 1 : 9.11),  w(t_1) = -2.981;
 *       k = 2..6: ratios 7.15, 5.70, 4.59, 3.85, 3.27  (pencil module lhatAtTk).
 *    The resonant mass of the retained trace is one ninth of the remainder's at t_1: no pointwise (support-free)
 *    domination exists; positivity of the FORM on L^2(-a,a) is entirely a support effect (the window of half-length a
 *    cannot resolve the dip). Form level, on the pole-free Weil extremal h_0 (Legendre N = 24, kernel z and eps_S from
 *    delta^in/delta^out closed forms plus the exact corr table; the kernel is only needed on |u| <= 2a < 1.25):
 *       a      L_S(h0)  D_S(h0)  W(h0)    Z(h0)    E_S(h0)  S_S(h0)   E_S/S_S   Z/L_S
 *       0.36   0.7380   0.2599   0.4782   0.3651  -0.1052   0.3730   -0.28     0.49
 *       0.40   0.5673   0.3415   0.2258   0.3376   0.0040   0.2297    0.017    0.60
 *       0.44   0.4513   0.3644   0.0869   0.3253   0.0391   0.1260    0.31     0.72
 *       0.50   0.3627   0.3507   0.0120   0.3076   0.0432   0.0551    0.78     0.85
 *       0.5493 0.3329   0.3319   0.0010   0.2978   0.0341   0.0351    0.972    0.89
 *    (D_S = Z + E_S, L_S = Z + S_S, W = S_S - E_S.) At (ln 3)/2, 89% of the Sonine trace on the extremal is the shared
 *    positive part Z; the Sonine-space part S_S(h_0) = 0.0351 exceeds the excess E_S(h_0) = 0.0341 by 2.8%. Separating
 *    the two sides in operator norm on the pole-free space, lam_min(S_S|pf) >= lam_max(E_S|pf), holds only for
 *    a <= 0.46 (0.215 vs 0.051 at 0.40; 0.090 vs 0.061 at 0.46; 0.054 vs 0.091 at 0.50; 0.030 vs 0.117 at (ln 3)/2):
 *    past a ~ 0.47 the top direction of the excess must be paired with the Sonine trace direction by direction —
 *    the difficulty moves from "bound E_S" to "the eigenfunction pairing", and it is a genuinely tight pairing
 *    (2.8% at the end of the range). The CC device hhat(0) = 0 makes E_S(h) NEGATIVE on the constrained extremal for
 *    a <= 0.46 (so W >= S_S >= 0 trivially there) and positive from a = 0.50 on.
 *
 * 3. THE REFORMULATION THAT WORKS: D_S <= L_S AS A POSITIVE-EXTENSION PROBLEM. Lemma (certificate). Let phi be an even
 *    L^1 function on R with phi(u) = alpha cosh(u/2) + beta u sinh(u/2) on |u| < 2a, and nu = phihat. If
 *    w_1(t) + nu(t) >= m for all real t, then W(h) >= m ||h||^2 for every pole-free h in L^2(-a', a'), every a' <= a.
 *    Proof: (1/2pi) int nu |hhat|^2 = int phi f = alpha <f, cosh> + beta <f, u sinh> = 0 by §1, since supp f in [-2a',2a']
 *    and f(±2a') = 0; hence W(h) = (1/2pi) int (w_1 + nu)|hhat|^2 >= m (1/2pi) int |hhat|^2 = m ||h||^2 (Parseval). The
 *    same certificate serves every smaller support (nesting). Conversely (Krein extension / bipolar theorem for the
 *    cone of pole-free autocorrelations) strict positivity of the form implies existence of such nu with m > 0 — the
 *    Toeplitz-certificate class also covers the two "half-pole-free" sectors {A = A' = 0}, {B = B' = 0}, and indeed
 *    lam_min(Arch - P_2) on those sectors coincides with the pole-free value to 5 digits at every a (N = 32; single
 *    constraints {A = 0} alone give 0.0145 at a = 0.40, 1.5e-5 at (ln 3)/2; unconstrained Arch - P_2 is indefinite,
 *    -1.5 at 0.40). So the direct-bound program "prove D_S <= L_S" is, without loss, "exhibit nu".
 *
 * 4. THE CERTIFICATES (tmp/imp-sonine-direct-lp.py, HiGHS). Ansatz: phi continuous, = alpha cosh(u/2) + beta u sinh(u/2)
 *    on [0, 2a], piecewise linear on J equal cells of [2a, U] with phi(U) = 0; nu in closed form (segment integrals,
 *    stable form  nu_out(t) = -(2/t) c_0 sin(t u_0) - (4 sin(t du/2)/t^2) Sum_j s_j sin(t ubar_j)). LP: maximise m
 *    subject to w_1(t_i) + nu(t_i) >= m on t_i in [0, T] step 0.01, |coefficients| <= 60, continuity at 2a
 *    (optionally an L1 budget on int |u phi_out| to keep the Lipschitz constant small).
 *    Verification protocol (rigorous modulo IEEE arithmetic): (i) w_1 + nu evaluated on [0, T] at step dt and on [T, T2]
 *    at step 5e-4; (ii) Lipschitz safety  |d/dt(w_1 + nu)| <= 8.599 + sqrt2 ln2^2 + 2 int_0^U |u phi(u)| du
 *    (|d/dt 2theta'| = |Im psi'(1/4 + it/2)|/2 <= psi'(1/4)/2), certified minimum = grid minimum - Lip * dt/2;
 *    (iii) tail t > T2: w_1(t) >= 2theta'(T2) - sqrt2 ln2 (2theta' increasing) and, integrating by parts twice
 *    (phi continuous, phi(U) = 0, phi'(0) = 0), |nu(t)| <= (2/t^2)[Sum |jumps of phi'| + |phi'(U-)| + int_0^{2a}|phi''|].
 *       a     (U, J, T)     m_LP      grid min (dt)         Lip     certified min   [T,T2] min   tail: w >= / |nu| <=
 *       0.40  (8, 80, 60)   0.06170   0.06149 (5e-4)        59.3    0.04668         1.334        2.480 / 0.312
 *       0.44  (16, 240, 60) 0.03127   0.03018 (1e-4)        282.9   0.01604         1.042        2.480 / 1.968
 *       0.46  (16, 240,120) 0.01314   0.01225 (5e-5)        182.5   0.00769         1.521        2.886 / 0.434
 *       0.48  (16, 240,120) 0.00274   0.00256 (3e-5), L1 60  63.0    0.00162         1.858        2.886 / 0.189
 *    Control: the same LP at 2a <= ln 2 (where positivity is Yoshida/CC's theorem) is feasible with m = 0.561 (a = 0.30),
 *    0.235 ((ln 2)/2). Margin scan (U, J, T) = (8, 80, 60): m = 0.218 (0.35), 0.177 (0.36), 0.143 (0.37), 0.106 (0.38),
 *    0.0617 (0.40), 0.0287 (0.42), 0.0109 (0.44), 0.0007 (0.46), then infeasible; (16, 240, 60): 0.0313 (0.44),
 *    0.0133 (0.46), 0.0040 (0.48), 0.00016 (0.50), -0.0006 (0.52), -0.0113 (0.54), -0.0257 ((ln 3)/2). The LP margin is
 *    a LOWER bound and the Legendre Rayleigh–Ritz value an UPPER bound on the true pole-free minimum: 0.0617 <= lam_min(0.40)
 *    <= 0.2255, 0.0133 <= lam_min(0.46) <= 0.0497; the captured fraction falls from 0.8 (a = 0.30) to 0.27 (0.46) to
 *    0.013 (0.50) — the extension needs ever finer structure as the margin closes (9.5e-4 at (ln 3)/2).
 *    STRUCTURE of the optimal certificates: alpha = 2.238, 2.076, 2.033, 2.014 and beta = -1.84, -0.84, -0.34, -0.075 at
 *    a = 0.40, 0.44, 0.46, 0.48 — the cosh weight tends to 2 = the true Weil pole weight Phi(0) + Phi(1) and the u sinh
 *    weight to 0 as the margin closes: the dual certificate converges to the actual Weil kernel (which is positive-definite
 *    iff RH) as a -> the crossing. nu fills the archimedean well exactly (nu(0) = 6.41 vs w_1(0) = -6.352) and the p = 2 dip
 *    (nu(t_1) = 0.676 vs w_1(t_1) = -0.614), and the LP optimum is tight on a comb of 1500–2100 grid points between the
 *    windows (near-active t: 0, ~1.2, 11.9–13.5, 15.6–18.2, 20.7–28.5, 33–39 at a = 0.40) — the certificate distributes
 *    the slack uniformly, it is not a local patch of the dip.
 *    Not reached here: a <= (ln 3)/2. With this ansatz the LP is feasible only to a ~ 0.50 (T = 120: m = 0.0040 at 0.48,
 *    0.0002 at 0.50 unverified); reaching 0.549 needs the margin 9.5e-4 resolved by a richer kernel (U >= 24, J >= 480)
 *    with a cutting-plane LP and a fine-grid step ~1e-5 — feasible in principle, not done. The primal certificate of the
 *    sibling module already covers it.
 *
 * 5. WHAT THIS SETTLES AND WHAT IT DOES NOT. Settled (computer-assisted, double precision, explicit Lipschitz and tail
 *    bounds, not interval arithmetic): D_S <= L_S on pole-free h for all 2a <= 0.96, by a certificate whose correctness
 *    reduces to one explicit 1-D inequality; together with the sibling primal certificate (all 2a <= ln 3, 9.04e-4)
 *    the Route I inequality on (ln 2, ln 3] is established by two independent computer-assisted routes. Conceptually:
 *    the positivity "dropped" by the CC method — Tr(vartheta(Qf) S_S) — cannot be recovered pointwise (it is 1/9 of what
 *    is needed at t_1) and is recovered only through the support constraint, whose exact expression is the positive
 *    extension nu; the CC device hhat(0) = 0 and the operator-norm separation both fail past a ~ 0.47, where only the
 *    full pairing (equivalently, the full certificate) works. Literature (external, UNVERIFIED here, recorded by the
 *    sibling module): Yoshida 1992 and Connes–Consani 2021 cover 2a <= ln 2; two September-2026 preprints (Zhu
 *    arXiv:2608.24827, Liu alphaXiv) report interval-certified positivity of the full Weil form on windows up to
 *    2a = 1.6 and beyond — if correct, they imply the pole-free statement on 2a <= 1.6 and this module is an independent
 *    smaller-window certificate. None of this concerns zeros: positivity on a fixed window is consistent with RH and
 *    implies nothing about it. RH open; NO QED.
 *
 * Import-light (Route H assembly, Route I identity/pencil/excess exports; no zeros bundle). Assertions ~5 s: pairing
 * identities, full re-verification of the a = 0.40 certificate (grid 2e-4 + Lipschitz + tail), consistency of the
 * a = 0.48 certificate on a 0.01 grid against the baked fine-grid record, half-pole-free margins at N = 16, split-table
 * and scan consistency, symbol-level obstruction from the pencil literals.
 */

import { weilForm, coeffs } from './rh-route-h-connes-scaling-site-weil-positivity-2026-09-23.js';
import { twoThetaPrime, complementBasis, compress } from './rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js';
import { PENCIL_HIGHRES_LITERALS } from './rh-route-i-pencil-highres-map-2026-09-23.js';

const PI = Math.PI, LN2 = Math.LN2, LN3 = Math.log(3), SQRT2 = Math.SQRT2;
/** the exact pole-free Weil symbol for 2a < ln 3 (only the prime power 2 enters): w_1 = 2theta'(t) - sqrt2 ln2 cos(t ln2) */
export const w1 = (t) => twoThetaPrime(t) - SQRT2 * LN2 * Math.cos(t * LN2);
/** Lipschitz constant of w_1: |d/dt 2theta'| <= psi'(1/4)/2 = (pi^2 + 8G)/2, plus sqrt2 ln2^2 */
export const LIP_W1 = 0.5 * 17.19732915450711 + SQRT2 * LN2 * LN2;

// ---- certificate symbol nu = phihat, phi = alpha cosh(u/2) + beta u sinh(u/2) on [0, 2a], piecewise linear on [2a, U]
/** int_0^L e^{su} cos(tu) du */
function Iexp(s, L, t) { const E = Math.exp(s * L); const x = E * Math.cos(t * L) - 1, y = E * Math.sin(t * L); return (x * s + y * t) / (s * s + t * t); }
/** int_0^L u e^{su} cos(tu) du = Re[L e^{zL}/z - (e^{zL} - 1)/z^2], z = s + it */
function Jexp(s, L, t) {
  const E = Math.exp(s * L); const p = E * Math.cos(t * L), q = E * Math.sin(t * L); const d = s * s + t * t; const r1 = s / d, r2 = -t / d;
  return L * (p * r1 - q * r2) - ((p - 1) * (r1 * r1 - r2 * r2) - 2 * q * r1 * r2);
}
/** nu(t) = 2 int_0^oo phi(u) cos(tu) du for a certificate {a, U, J, alpha, beta, c} (c = phi at the J+1 nodes of [2a, U]) */
export function certNu(cert, t) {
  const L = 2 * cert.a, J = cert.J, du = (cert.U - L) / J, c = cert.c;
  let inside = cert.alpha * (Iexp(0.5, L, t) + Iexp(-0.5, L, t)) + cert.beta * (Jexp(0.5, L, t) - Jexp(-0.5, L, t));
  let out;
  if (Math.abs(t) < 1e-7) { let s = c[0] / 2; for (let j = 1; j < J; j++) s += c[j]; s += c[J] / 2; out = 2 * du * s; }
  else {
    let S = 0; for (let j = 0; j < J; j++) S += (c[j + 1] - c[j]) / du * Math.sin(t * (L + (j + 0.5) * du));
    out = (2 / t) * (c[J] * Math.sin(t * cert.U) - c[0] * Math.sin(t * L)) - (4 * Math.sin(t * du / 2) / (t * t)) * S;
  }
  return inside + out;
}
/** phi(u) of a certificate */
export function certPhi(cert, u) {
  u = Math.abs(u); const L = 2 * cert.a; if (u < L) return cert.alpha * Math.cosh(u / 2) + cert.beta * u * Math.sinh(u / 2);
  if (u >= cert.U) return 0; const du = (cert.U - L) / cert.J; const j = Math.min(cert.J - 1, Math.floor((u - L) / du)); const w = (u - L - j * du) / du; return cert.c[j] * (1 - w) + cert.c[j + 1] * w;
}
/** constants of the verification protocol: Lipschitz bound of nu, continuity jump at 2a, tail constant C with |nu(t)| <= C/t^2 */
export function certConstants(cert) {
  const L = 2 * cert.a, du = (cert.U - L) / cert.J, c = cert.c; const M = 200000; let lip = 0;
  for (let i = 0; i <= M; i++) { const u = cert.U * i / M; const wt = (i === 0 || i === M) ? 0.5 : 1; lip += wt * Math.abs(u * certPhi(cert, u)); }
  lip *= 2 * cert.U / M;
  const jump = Math.abs(c[0] - (cert.alpha * Math.cosh(cert.a) + cert.beta * L * Math.sinh(cert.a)));
  const slopeInside = cert.alpha * 0.5 * Math.sinh(cert.a) + cert.beta * (Math.sinh(cert.a) + cert.a * Math.cosh(cert.a));
  const slopes = []; for (let j = 0; j < cert.J; j++) slopes.push((c[j + 1] - c[j]) / du);
  let slopeJumps = Math.abs(slopes[0] - slopeInside) + Math.abs(slopes[cert.J - 1]); for (let j = 1; j < cert.J; j++) slopeJumps += Math.abs(slopes[j] - slopes[j - 1]);
  const K = 20000; let phi2 = 0; for (let i = 0; i <= K; i++) { const u = L * i / K; const wt = (i === 0 || i === K) ? 0.5 : 1; phi2 += wt * Math.abs(cert.alpha * 0.25 * Math.cosh(u / 2) + cert.beta * (Math.cosh(u / 2) + 0.25 * u * Math.sinh(u / 2))); }
  phi2 *= L / K;
  return { lipNu: lip, lipTotal: lip + LIP_W1, jump, tailC: 2 * (slopeJumps + phi2), tailJumpC: 2 * jump };
}
/**
 * Verification protocol: grid minimum of w_1 + nu on [0, T] (step dt) and [T, T2] (step dt2), Lipschitz-certified minima,
 * and the analytic tail comparison beyond T2. certified = all three positive.
 */
export function verifyCertificate(cert, { T, dt, T2, dt2 }) {
  const K = certConstants(cert);
  let min1 = Infinity, arg1 = 0; for (let t = 0; t <= T + 1e-12; t += dt) { const v = w1(t) + certNu(cert, t); if (v < min1) { min1 = v; arg1 = t; } }
  let min2 = Infinity; for (let t = T; t <= T2 + 1e-12; t += dt2) { const v = w1(t) + certNu(cert, t); if (v < min2) min2 = v; }
  const tailW = twoThetaPrime(T2) - SQRT2 * LN2, tailNu = K.tailJumpC / T2 + K.tailC / (T2 * T2);
  const rig1 = min1 - K.lipTotal * dt / 2, rig2 = min2 - K.lipTotal * dt2 / 2;
  return { min1, arg1, min2, rig1, rig2, tailW, tailNu, ...K, certified: rig1 > 0 && rig2 > 0 && tailW > tailNu };
}
/** the two pole pairings of an autocorrelation: <f, cosh(u/2)> = A B and <f, u sinh(u/2)> = A' B - A B' (f = h*h~ on (-a,a)) */
export function polePairings(h, a, M = 2000) {
  const q = (g) => { let s = 0; for (let i = 0; i <= M; i++) { const u = -a + 2 * a * i / M; const wt = (i === 0 || i === M) ? 1 : (i % 2 ? 4 : 2); s += wt * g(u); } return s * (2 * a / M) / 3; };
  const A = q((u) => h(u) * Math.exp(u / 2)), B = q((u) => h(u) * Math.exp(-u / 2)), Ap = q((u) => h(u) * u * Math.exp(u / 2)), Bp = q((u) => h(u) * u * Math.exp(-u / 2));
  const f = (v) => { const lo = Math.max(-a, v - a), hi = Math.min(a, v + a); if (hi <= lo) return 0; let s = 0; for (let i = 0; i <= M; i++) { const u = lo + (hi - lo) * i / M; const wt = (i === 0 || i === M) ? 1 : (i % 2 ? 4 : 2); s += wt * h(u) * h(u - v); } return s * ((hi - lo) / M) / 3; };
  const M2 = 800; let pc = 0, ps = 0; for (let i = 0; i <= M2; i++) { const v = -2 * a + 4 * a * i / M2; const wt = (i === 0 || i === M2) ? 1 : (i % 2 ? 4 : 2); const fv = f(v); pc += wt * fv * Math.cosh(v / 2); ps += wt * fv * v * Math.sinh(v / 2); }
  pc *= (4 * a / M2) / 3; ps *= (4 * a / M2) / 3;
  return { A, B, Ap, Bp, pairCosh: pc, pairUSinh: ps, predCosh: A * B, predUSinh: Ap * B - A * Bp };
}
function jacobiEig(Ain) {
  const n = Ain.length; const A = Ain.map((r) => Array.from(r));
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] ** 2; if (off < 1e-28) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(A[p][q]) < 1e-300) continue;
      const th = (A[q][q] - A[p][p]) / (2 * A[p][q]); const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)); const c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const akp = A[k][p], akq = A[k][q]; A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq; }
      for (let k = 0; k < n; k++) { const apk = A[p][k], aqk = A[q][k]; A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk; }
    }
  }
  return A.map((r, i) => r[i]).sort((x, y) => x - y);
}
/** lambda_min of Arch - P_2 on L^2(-a,a) under constraint sets: pole-free {A=B=0}, half-pole-free {A=A'=0}, {A=0}, and unconstrained */
export function constrainedMargins(a, N) {
  const wf = weilForm(a, N); const M = wf.Arch.map((r, m) => Array.from(r, (x, n) => x - wf.Prime[m][n]));
  const A = Array.from(coeffs(wf, (u) => Math.exp(u / 2))), B = Array.from(coeffs(wf, (u) => Math.exp(-u / 2))), Ap = Array.from(coeffs(wf, (u) => u * Math.exp(u / 2)));
  const lm = (cons) => jacobiEig(compress(M, complementBasis(N, cons)))[0];
  return { poleFree: lm([A, B]), halfA: lm([A, Ap]), onlyA: lm([A]), free: jacobiEig(M)[0], wFull: jacobiEig(wf.W)[0] };
}

// ---- baked certificates (tmp/imp-sonine-direct-lp.py; JSON records tmp/imp-sonine-direct-cert-a*.json)
export const CERT_A040 = Object.freeze({
  a: 0.40, U: 8, J: 80, T: 60, mLP: 0.061696, alpha: 2.2380054199, beta: -1.8384657863,
  c: Object.freeze([1.8153225, 8.6772969, -9.719933, 8.0205487, -5.3682444, 4.8731636, -0.961744, 4.8216488, -5.9919116, 0.703902, 6.7103459, -3.4716901, 0.1812051, 2.5062969, -4.502231, 5.9094165, -1.2811923, 2.0072357, -6.8227764, 8.31965, -2.7628977, 0.1831456, 1.7275189, -2.6024982, 0.8477327, 3.1967531, -1.0962135, -1.6247187, -0.0688813, 4.046072, -4.4100008, 4.7533013, -3.6069434, 0.4710774, 1.4733493, 1.1641372, -2.0357958, 0.0306378, 1.4113413, -0.6327037, 0.285946, 1.3969206, -3.3794645, 2.9502629, -0.6131827, 0.6302774, -1.6861438, 1.6687513, -0.9894797, 0.6181156, 0.540929, -0.9977177, -0.2112477, 1.3847729, -0.9363549, 0.4693741, -0.5994249, 0.7443482, -0.907099, 1.3291881, -1.047454, 0.2071173, 0.0882701, 0.251656, -0.3858112, 0.3291544, -0.2881881, 0.139517, -0.0144061, 0.2193266, -0.4707747, 0.4368212, -0.2836085, 0.2231077, -0.2034276, 0.2000975, -0.2262332, 0.2014292, -0.103923, 0.0226518, 0.0]),
  record: { dt: 5e-4, minFine: 0.0614910, argmin: 34.1545, lipNu: 49.977, lipTotal: 59.255, rigorousMin: 0.046677, T2: 200, minT_T2: 1.33391, tailW: 2.48018, tailNu: 0.31215, certified: true, nu0: 6.4141, nuT1: 0.6760, nNearActive: 1491 },
});
export const CERT_A048 = Object.freeze({
  a: 0.48, U: 16, J: 240, T: 120, mLP: 0.002744, l1budget: 60, alpha: 2.0143839734, beta: -0.0753243701,
  c: Object.freeze([2.2148731, 7.4269004, -19.9724322, 14.9829431, -2.2702515, 0.5470222, -0.2830118, 2.1760265, 4.3804377, -3.1397021, -2.670744, 0.0475376, -1.2853419, 12.2092509, -6.5178643, 0.4974463, 0.0, 0.1547078, -4.0604382, 7.2431594, -1.4111167, -1.2609753, 4.4546834, -0.9028021, -2.6391883, -2.8289236, 2.7519661, 4.5140775, 0.0, 0.7460492, -5.6466668, 2.6393104, 1.8732091, -2.4724565, 0.9218081, 3.5794785, 0.0, -1.2500841, -1.2970007, -1.0690653, 0.0, 4.2074496, 0.342913, 0.0, -2.3407415, 0.0, 0.0, 1.0681398, 0.0, 0.6790727, 1.6032319, 0.5531338, -3.7101998, 0.0, 0.4488177, 2.641922, 0.4264101, -0.0543403, -1.3198052, -0.1690919, -0.1936258, 0.0, 0.7459512, 0.9955407, 0.5789558, 0.0, -1.712367, -0.5139416, 0.0, 1.9507745, 0.4973882, 0.0, -0.5581712, -0.7368072, 0.0, 0.0, 0.3183414, 1.0100315, 0.3729273, 0.0, -1.2828605, -0.3002325, 0.0, 1.0280443, 0.6261639, -0.0836195, -0.2243466, -0.3392677, -0.4342311, 0.0, 0.26794, 0.9498077, 0.018281, 0.0, -0.7583361, -0.1766502, 0.0, 0.367412, 0.5898411, 0.0, 0.0, -0.3918287, -0.2805943, 0.0, 0.1186221, 0.6312083, 0.0635045, 0.0, -0.4667193, -0.1962187, 0.1433919, 0.1295817, 0.2137977, 0.1323724, 0.1235752, -0.3037581, -0.2303934, 0.0, 0.063145, 0.4178132, 0.0, 0.0, -0.2534758, -0.0356712, 0.0, 0.0323676, 0.1569388, 0.0883489, 0.0, -0.0053807, -0.2383308, 0.0, 0.0545468, 0.2007821, 0.0, 0.0, -0.0945471, -0.0342962, 0.0, 0.0338963, 0.0161475, 0.0678589, 0.0141514, 0.0, -0.1008217, 0.0, 0.006994, 0.0867505, 0.0, -0.0073255, -0.0205654, -0.0052758, 0.0, 0.0, 0.0076458, 0.0154337, 0.0067072, 0.0, -0.0098738, 0.0, 0.0, 0.0, 0.0070204, 0.0, 0.0, 0.0089946, 0.0, 0.0, -0.0003825, -0.0133869, 0.0, 0.0005577, 0.0274432, 0.0, 0.0, -0.0246992, 0.0, 0.0, 0.0083225, 0.0139202, 0.0007024, 0.0, -0.0040041, -0.0137912, -0.0081603, 0.0, 0.0310695, 0.0034593, 0.0, -0.021788, -0.0078125, 0.0, 0.0148694, 0.0, 0.009099, 0.0, -0.0032007, -0.0164419, 0.0, 0.0, 0.0134491, 0.0098868, 0.0, -0.0164696, -0.0030058, 0.0, 0.0034655, 0.0053229, 0.0047838, 0.0, -0.0034633, -0.0075229, 0.0, 0.0, 0.0074931, 0.0019192, 0.0, -0.0013583, -0.0066793, 0.0, 0.002296, 0.0038729, 0.0, 0.0, -2.14e-05, -0.0037662, 0.0, 0.0009355, 0.0027374, -0.0008186, 0.0, 0.0, -0.000373, -0.0012865, 0.0, 0.0015601, 0.0007451, 0.0, -0.0023813, 0.0014214, 0.0]),
  record: { dt: 3e-5, minFine: 0.0025628, argmin: 6e-5, lipNu: 53.729, lipTotal: 63.007, rigorousMin: 0.0016177, T2: 300, minT_T2: 1.85847, tailW: 2.88565, tailNu: 0.18878, certified: true, nu0: 6.3552, nuT1: 0.6170, nNearActive: 1635 },
});
export const DIRECT_CERT_LITERALS = Object.freeze({
  /** [a, U, J, T, m_LP, grid min, dt, Lip, certified min on [0,T], min on [T,T2], T2, tail w lower, tail |nu| upper, alpha, beta] */
  certified: [
    [0.40, 8, 80, 60, 0.061696, 0.061491, 5e-4, 59.255, 0.046677, 1.33391, 200, 2.48018, 0.31215, 2.2380, -1.8385],
    [0.44, 16, 240, 60, 0.031273, 0.030183, 1e-4, 282.852, 0.016041, 1.04232, 200, 2.48018, 1.96804, 2.0762, -0.8404],
    [0.46, 16, 240, 120, 0.013136, 0.012249, 5e-5, 182.539, 0.007686, 1.52087, 300, 2.88565, 0.43422, 2.0333, -0.3379],
    [0.48, 16, 240, 120, 0.002744, 0.002563, 3e-5, 63.007, 0.001618, 1.85847, 300, 2.88565, 0.18878, 2.0144, -0.0753],
  ],
  /** LP margin scans [a, m]; negative = infeasible for the ansatz */
  scanU8J80T60: [[0.30, 0.56116], [0.34, 0.27348], [LN2 / 2, 0.23477], [0.35, 0.21775], [0.36, 0.17744], [0.37, 0.14320], [0.38, 0.10599], [0.40, 0.06170], [0.42, 0.02865], [0.44, 0.01092], [0.46, 0.00065], [0.48, -0.00323], [0.50, -0.00370], [0.52, -0.00480], [0.54, -0.03864], [LN3 / 2, -0.04991]],
  scanU16J240T60: [[0.44, 0.03127], [0.46, 0.01329], [0.48, 0.00402], [0.50, 0.00016], [0.52, -0.00058], [0.54, -0.01126], [LN3 / 2, -0.02567]],
  l1BudgetTradeoff: { a046: [[null, 0.01314], [100, 0.01248], [40, 0.00986], [20, 0.00604]], a048: [[null, 0.00396], [100, 0.00357], [40, 0.00177], [20, -0.00093]] },
  /** Legendre N = 32 Rayleigh–Ritz (upper bounds on the true minimum): [a, pole-free, half-pole-free {A=A'=0}, {A=0}, W_full unconstrained, Arch-P_2 unconstrained] */
  marginsN32: [
    [0.30, 0.69199, 0.69199, 0.22089, 7.5722e-3, -1.1201], [LN2 / 2, 0.54705, 0.54705, 0.072332, 1.3294e-3, -1.2857], [0.36, 0.47804, 0.47804, 0.048096, 8.5008e-4, -1.3446],
    [0.38, 0.34202, 0.34202, 0.026796, 4.0743e-4, -1.4411], [0.40, 0.22550, 0.22550, 0.014539, 1.8173e-4, -1.5399], [0.43, 0.11197, 0.11197, 5.2278e-3, 4.5996e-5, -1.6847],
    [0.46, 0.049691, 0.049691, 1.5383e-3, 9.2814e-6, -1.8209], [0.50, 0.011931, 0.011931, 1.9191e-4, 9.4039e-7, -1.9873], [0.52, 4.4778e-3, 4.4778e-3, 6.1556e-5, 3.5009e-7, -2.0643],
    [0.54, 1.4349e-3, 1.4349e-3, 2.4304e-5, 1.0770e-7, -2.1375], [LN3 / 2, 9.5198e-4, 9.5198e-4, 1.4780e-5, 5.6341e-8, -2.1704],
  ],
  /** form-level CC split on the pole-free extremal h_0 (N = 24, GL-8 / J = 30 Toeplitz): [a, lamW|pf, L_S, D_S, W, Z, E_S, S_S, E_S/S_S, Z/L_S, W(h1), S_S(h1), E_S(h1), lamMin(S_S|pf), lamMin(E_S|pf), lamMax(E_S|pf)] (h1 = extremal with hhat(0) = 0) */
  splitN24: [
    [0.36, 0.47816, 0.73803, 0.25988, 0.47816, 0.36505, -0.10517, 0.37298, -0.2820, 0.4946, 0.8230, 0.6281, -0.1949, 0.3626, -0.2034, 0.03026],
    [0.40, 0.22576, 0.56729, 0.34153, 0.22576, 0.33756, 0.00397, 0.22973, 0.0173, 0.5950, 0.7796, 0.5630, -0.2166, 0.2153, -0.2207, 0.05070],
    [0.44, 0.08690, 0.45128, 0.36439, 0.08690, 0.32533, 0.03905, 0.12595, 0.3101, 0.7209, 0.5634, 0.4847, -0.0787, 0.1193, -0.2665, 0.05560],
    [0.46, 0.04982, 0.41361, 0.36379, 0.04982, 0.31934, 0.04445, 0.09427, 0.4715, 0.7721, 0.4119, 0.3936, -0.0184, 0.09023, -0.3052, 0.06105],
    [0.50, 0.01198, 0.36270, 0.35072, 0.01198, 0.30756, 0.04315, 0.05514, 0.7827, 0.8480, 0.1907, 0.2397, 0.0490, 0.05373, -0.3727, 0.09050],
    [0.52, 0.004503, 0.34650, 0.34200, 0.00450, 0.30261, 0.03939, 0.04390, 0.8974, 0.8733, 0.1149, 0.1872, 0.0723, 0.04225, -0.3978, 0.1030],
    [0.54, 0.001451, 0.33587, 0.33442, 0.00145, 0.29893, 0.03549, 0.03695, 0.9607, 0.8900, 0.0560, 0.1469, 0.0909, 0.03359, -0.4160, 0.1132],
    [LN3 / 2, 0.0009657, 0.33285, 0.33188, 0.00097, 0.29779, 0.03409, 0.03505, 0.9724, 0.8947, 0.0336, 0.1316, 0.0980, 0.03026, -0.4222, 0.1170],
  ],
  splitKernelAnchors: { corrLn2: 1.4549, epsS15: 0.7497, z15: 0.7997, z12: 0.3811 }, // reproduce the excess module (1.4550 / 0.74989 / 0.7997 / 0.3811)
  autocorrCheck: { a: 0.45, N: 32, archQuad: 24.231483, archFormula: 24.212849, p2Quad: 0.025639, p2Formula: 0.025594 },
  symbolObstruction: { t1: 2 * PI / LN2, w1AtT1: -0.6143, w1At0: -6.3524, wAtT1: -2.9808, deltahatT1: 3.3483, LhatT1: 0.3675, ratio: 9.111, ratiosK1to6: [9.111, 7.145, 5.702, 4.589, 3.848, 3.270] },
  sibling: { id: 'rh-route-i-uncertainty-concentration-certificate-2026-09-24', margin: 9.04e-4, range: 'all a <= (ln 3)/2', method: 'primal Galerkin lower bound + Bernstein tail (T = 400, N = 320)' },
  // Same-day sibling covering the IDENTICAL range 2a <= 0.96 by a different (Krein sufficiency, sigma_2) mechanism,
  // and INTERVAL-VERIFIED (mpmath.iv) rather than IEEE double: this is the statement consumers should cite as the
  // rigorous status of pole-free Weil positivity for 2a <= 0.96, with the present dual-LP certificate as an
  // independent, different-shaped corroboration at IEEE double precision.
  intervalRigorousSibling: { id: 'rh-route-i-toeplitz-krein-certificate-2026-09-24', range: '2a <= 0.96 (same X0)', method: 'Krein spectral-gap sufficiency on sigma_2 = (t^2+1/4)^2 w_1, interval-verified' },
});

export const RH_ROUTE_I_DIRECT_SONINE_TRACE_CERTIFICATE = Object.freeze({
  id: 'rh-route-i-direct-sonine-trace-certificate-2026-09-24',
  route: 'I (direct) — D_S <= L_S with the full Sonine trace retained: symbol-level failure quantified, form-level CC split on the extremal, and the dual positive-extension certificate constructed by LP and verified',
  parents: ['src/data/rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js', 'src/data/rh-route-i-sonine-excess-semilocal-port-2026-09-23.js', 'src/data/rh-route-i-pencil-highres-map-2026-09-23.js', 'src/data/rh-route-i-uncertainty-concentration-certificate-2026-09-24.js (independent primal certificate, all a <= (ln 3)/2)', 'src/data/rh-route-h-connes-scaling-site-weil-positivity-2026-09-23.js'],
  status: 'CERTIFIED ON 2a <= 0.96 (computer-assisted, IEEE double, explicit Lipschitz safety and analytic tail, not interval-verified): W(h) = Arch(h) - P_2(h) = L_S(h) - D_S(h) >= m ||h||^2 on pole-free h in L^2(-a,a) for a <= 0.48, m = 0.0467 (0.40), 0.0160 (0.44), 0.0077 (0.46), 0.0016 (0.48), via explicit positive-extension certificates w_1 + nu >= m (nu = phihat, phi = alpha cosh(u/2) + beta u sinh(u/2) on |u| < 2a, piecewise linear outside); the retained Sonine trace CANNOT dominate the remainder pointwise (Lhat_S(t_1)/deltahat_S(t_1) = 1/9.11) — positivity is a support effect whose exact expression is the extension; sibling primal certificate covers all 2a <= ln 3 (9.04e-4). The IDENTICAL range 2a <= 0.96 is now ALSO covered, by a different (Krein/sigma_2) mechanism, with a full INTERVAL-VERIFIED proof: rh-route-i-toeplitz-krein-certificate-2026-09-24 — cite that module for the rigorous status of this range; the present dual-LP certificate remains an independent IEEE-double corroboration. Fixed-window positivity says nothing about zeros. RH open; no refereed bound is changed; NO QED',
  explicitForms: 'W = (1/2pi) int w |hhat|^2, D_S = (1/2pi) int deltahat_S |hhat|^2, L_S = (1/2pi) int Lhat_S |hhat|^2 with Lhat_S = zhat + Shat_S, deltahat_S = zhat + epshat_S, zhat = Sum lam_n^2 |zeta~_n(1/2+it)|^2 (spectral form; z = delta^in - corr cancels in w = Shat_S - epshat_S); for 2a < ln 3 the exact symbol is w_1 = 2theta\' - sqrt2 ln2 cos(t ln2) and W(h) = 2theta\'(0) f(0) + 2 int_0^{2a} e^{-v/2}(f(0)-f(v))/(1-e^{-2v}) dv + 2 f(0) int_{2a}^oo e^{-v/2}/(1-e^{-2v}) dv - sqrt2 ln2 f(ln2); pole pairings <f, cosh(u/2)> = AB and <f, u sinh(u/2)> = A\'B - AB\' (A = <h,e^{u/2}>, B = <h,e^{-u/2}>, A\' = <h,ue^{u/2}>, B\' = <h,ue^{-u/2}>) vanish on pole-free h and span all even Toeplitz kernels that do',
  symbolLevelFailure: 'at t_1 = 2pi/ln2: Lhat_S = 0.3675 vs deltahat_S = 3.3483 (ratio 1:9.11), w = -2.981; ratios 7.15, 5.70, 4.59, 3.85, 3.27 at t_2..t_6 — the resonant mass of the retained trace is one ninth of the remainder\'s, so no support-free (pointwise-symbol) domination exists; on the pole-free extremal at (ln 3)/2: L_S = 0.3329 = Z 0.2978 + S_S 0.0351, D_S = 0.3319 = Z 0.2978 + E_S 0.0341 — 89% of the trace is the shared positive part, S_S exceeds E_S by 2.8%; operator-norm separation lam_min(S_S|pf) >= lam_max(E_S|pf) holds only for a <= 0.46 (0.215/0.051 at 0.40, 0.090/0.061 at 0.46, 0.054/0.091 at 0.50, 0.030/0.117 at (ln3)/2); the CC device hhat(0) = 0 makes E_S negative on the constrained extremal only for a <= 0.46 (E_S(h_1) = +0.049 at 0.50)',
  reformulation: 'D_S <= L_S on pole-free h  <=>  exists even phi, phi = alpha cosh(u/2) + beta u sinh(u/2) on |u| < 2a, free on |u| >= 2a, with w_1 + phihat >= 0 on R (certificate lemma: (1/2pi) int phihat |hhat|^2 = int phi f = alpha AB + beta (A\'B - AB\') = 0; converse by Krein extension/bipolar theorem); the certificate class also certifies the half-pole-free sectors {A = A\' = 0}, {B = B\' = 0}, whose N = 32 minima coincide with the pole-free minimum to 5 digits at every a; nesting: a certificate at a serves every a\' <= a',
  theorem: 'certificates found by LP (HiGHS; phi piecewise linear on J cells of [2a, U], phi(U) = 0, continuity at 2a) and verified: a = 0.40 (U 8, J 80): grid min 0.06149 at step 5e-4, Lipschitz 59.3 -> certified 0.04668 on [0,60], 1.334 on [60,200], tail w_1 >= 2.480 vs |nu| <= 0.312; a = 0.44 (16, 240): 0.03018 at 1e-4, Lip 282.9 -> 0.01604; [60,200] 1.042; tail 2.480 vs 1.968; a = 0.46 (16, 240, T 120): 0.01225 at 5e-5, Lip 182.5 -> 0.00769; [120,300] 1.521; tail 2.886 vs 0.434; a = 0.48 (16, 240, T 120, L1 budget 60): 0.00256 at 3e-5, Lip 63.0 -> 0.00162; [120,300] 1.858; tail 2.886 vs 0.189. Control at 2a <= ln 2 (Yoshida/CC range): m = 0.561 (0.30), 0.235 ((ln2)/2). Structure: alpha -> 2 (the true Weil pole weight) and beta -> 0 as a grows (2.238/-1.84, 2.076/-0.84, 2.033/-0.34, 2.014/-0.075); nu(0) = 6.41 fills the archimedean well (w_1(0) = -6.352), nu(t_1) = 0.68 the p = 2 dip (w_1(t_1) = -0.614); optimum tight on a comb of ~1500-2100 grid points between the windows',
  reach: 'LP feasible with this ansatz to a ~ 0.50 (m = 0.0040 at 0.48, 0.00016 at 0.50 with (16, 240, 60); infeasible from 0.52); LP margin is a lower bound, Legendre Rayleigh–Ritz an upper bound: 0.0617 <= lam_min(0.40) <= 0.2255, 0.0133 <= lam_min(0.46) <= 0.0497, captured fraction 0.8 (0.30) -> 0.27 (0.46) -> 0.013 (0.50); reaching (ln 3)/2 (true margin ~9.5e-4) needs U >= 24, J >= 480, cutting-plane LP and a fine-grid step ~1e-5 — not done here; the sibling primal certificate already covers it',
  verdict: 'the direct program succeeds in its exact form — positivity of the retained trace over the remainder IS the positive extension nu, and nu is constructed and verified for 2a <= 0.96 — while its naive forms fail: pointwise the Sonine trace is 1/9 of the remainder at the first resonance, operator-norm separation of S_S and E_S fails past a ~ 0.47, and the CC hhat(0)=0 device fails at the form level past a ~ 0.48; the extremal pairing is tight to 2.8% at (ln 3)/2. Together with the independent primal certificate (all 2a <= ln 3) the Route I inequality D_S <= L_S on pole-free h is established on (ln 2, ln 3] by two computer-assisted routes. None of it constrains a zero; RH open; NO QED',
  literature: 'external and UNVERIFIED here (recorded by the sibling module): Yoshida 1992 and Connes–Consani 2021 prove 2a <= ln 2; Zhu arXiv:2608.24827 and Liu (alphaXiv), September 2026, report interval-certified positivity of the full Weil form on windows 2a = 1.6 and larger, which would imply the pole-free statement on 2a <= 1.6; the present certificates are independent, non-interval, on the smaller window 2a <= 0.96 with margins 1.6e-3..4.7e-2',
  honestLimits: 'verification is IEEE double arithmetic with explicit Lipschitz safety margins and an analytic tail, not interval arithmetic (scipy digamma, closed-form Fourier integrals; the stable outside formula avoids cancellation); the Arch multiplier 2theta\' = Re psi(1/4 + it/2) - ln pi and the standard explicit-formula normalisation are taken from the Route H/I modules (autocorrelation cross-check to quadrature accuracy 0.08%); the split table and the constrained margins are N = 24/32 Legendre Rayleigh–Ritz numbers (not enclosures) and the kernel corr comes from the exact-spectrum table of the excess module (80 modes, uniformly convergent series); the Krein/bipolar converse is stated, not re-proved; the in-module assertions re-verify the a = 0.40 certificate fully (step 2e-4) and the a = 0.48 one on a 0.01 grid against the baked 3e-5 record; the LP scans are feasibility numbers for one ansatz family; no zero is localised and no Lambda bound moves',
});

// ---- assertions
const within = (x, lo, hi) => x >= lo && x <= hi;
const L = DIRECT_CERT_LITERALS;
export const RH_ROUTE_I_DIRECT_SONINE_TRACE_CERTIFICATE_ASSERTIONS = Object.freeze([
  {
    id: 'D0-pole-pairing-identities',
    description: 'for a smooth non-pole-free h on (-0.45, 0.45), <f, cosh(u/2)> = A B and <f, u sinh(u/2)> = A\'B - AB\' to 1e-6 relative (f = h*h~); for the pole-free projection both pairings vanish to 1e-6',
    holds: () => {
      const a = 0.45; const h = (u) => 0.7 + 1.3 * u - 2.1 * u * u + 0.9 * u * u * u;
      const P = polePairings(h, a);
      const rel = (x, y) => Math.abs(x - y) / Math.max(1e-12, Math.abs(y));
      // pole-free projection: subtract the e^{±u/2} components in the sense A = B = 0 (solve 2x2 for coefficients of e^{u/2}, e^{-u/2})
      const q = (g) => { const M = 2000; let s = 0; for (let i = 0; i <= M; i++) { const u = -a + 2 * a * i / M; const wt = (i === 0 || i === M) ? 1 : (i % 2 ? 4 : 2); s += wt * g(u); } return s * (2 * a / M) / 3; };
      const e1 = (u) => Math.exp(u / 2), e2 = (u) => Math.exp(-u / 2);
      const m11 = q((u) => e1(u) * e1(u)), m12 = q((u) => e1(u) * e2(u)), m22 = q((u) => e2(u) * e2(u)); const det = m11 * m22 - m12 * m12;
      const x1 = (P.A * m22 - P.B * m12) / det, x2 = (m11 * P.B - m12 * P.A) / det; const hp = (u) => h(u) - x1 * e1(u) - x2 * e2(u);
      const Q = polePairings(hp, a);
      return rel(P.pairCosh, P.predCosh) < 1e-6 && rel(P.pairUSinh, P.predUSinh) < 1e-6 && Math.abs(P.predCosh) > 0.1 && Math.abs(Q.A) < 1e-8 && Math.abs(Q.B) < 1e-8 && Math.abs(Q.pairCosh) < 1e-6 && Math.abs(Q.pairUSinh) < 1e-6;
    },
  },
  {
    id: 'D1-certificate-a040-fully-reverified',
    description: 'the baked a = 0.40 certificate (U = 8, J = 80) re-verified in-module: continuity at 2a (< 1e-6), nu(0) in [6.40, 6.43], grid min of w_1 + nu on [0, 60] at step 2e-4 in [0.0612, 0.0620], Lipschitz constant in [58, 61], certified min > 0.05; [60, 300] at step 2e-3 certified min > 1; tail beyond 300: 2theta\'(300) - sqrt2 ln2 > 2.88 exceeds the |nu| bound (< 0.15); so W(h) >= 0.05 ||h||^2 on pole-free h for every a <= 0.40',
    holds: () => {
      const V = verifyCertificate(CERT_A040, { T: 60, dt: 2e-4, T2: 300, dt2: 2e-3 });
      return V.jump < 1e-6 && within(certNu(CERT_A040, 0), 6.40, 6.43) && within(V.min1, 0.0612, 0.0620) && within(V.lipTotal, 58, 61) && V.rig1 > 0.05 && V.rig2 > 1 && V.tailW > 2.88 && V.tailNu < 0.15 && V.certified
        && Math.abs(V.min1 - CERT_A040.record.minFine) < 2e-4 && Math.abs(V.lipTotal - CERT_A040.record.lipTotal) < 0.1;
    },
  },
  {
    id: 'D2-certificate-a048-consistent-with-fine-record',
    description: 'the baked a = 0.48 certificate (U = 16, J = 240): continuity < 1e-6, Lipschitz constant within 0.2 of the record 63.0, grid min on [0, 120] at step 0.01 within 3e-4 of the record 0.0025628 and > 0.002, nu(0) + w_1(0) > 0, [120, 300] min > 1.8, tail 2theta\'(300) - sqrt2 ln2 > |nu| bound; baked record: certified min 0.0016177 = 0.0025628 - 63.007 x 3e-5 / 2 (1e-6)',
    holds: () => {
      const V = verifyCertificate(CERT_A048, { T: 120, dt: 0.01, T2: 300, dt2: 5e-3 });
      const R = CERT_A048.record;
      return V.jump < 1e-6 && Math.abs(V.lipTotal - R.lipTotal) < 0.2 && Math.abs(V.min1 - R.minFine) < 3e-4 && V.min1 > 0.002 && w1(0) + certNu(CERT_A048, 0) > 0 && V.min2 > 1.8 && V.tailW > V.tailNu && Math.abs(V.tailNu - R.tailNu) < 0.01
        && Math.abs(R.rigorousMin - (R.minFine - R.lipTotal * R.dt / 2)) < 1e-6 && R.rigorousMin > 0 && R.certified;
    },
  },
  {
    id: 'D3-certified-ladder-and-scan-consistency',
    description: 'certified rows: a increasing, margins decreasing and positive, certified min = grid min - Lip dt/2 (1e-5), [T,T2] min > 1, tail w > tail |nu|, alpha decreasing toward 2 and |beta| decreasing toward 0; scans: m decreasing in a, U16 >= U8 at common a, positive through 0.46 (U8) / 0.50 (U16), negative from 0.48 / 0.52; LP margins below the N = 32 pole-free Rayleigh–Ritz values',
    holds: () => {
      const C = L.certified; let ok = true;
      C.forEach((r, i) => { const [a, , , , mLP, gmin, dt, lip, rig, min2, , tw, tn, al, be] = r; ok = ok && gmin <= mLP + 1e-9 && Math.abs(rig - (gmin - lip * dt / 2)) < 1e-5 && rig > 0 && min2 > 1 && tw > tn && al > 2 && be < 0; if (i) { const p = C[i - 1]; ok = ok && a > p[0] && rig < p[8] && al < p[13] && Math.abs(be) < Math.abs(p[14]); } });
      const mono = (S) => S.every((r, i) => i === 0 || r[1] <= S[i - 1][1] + 1e-9);
      const s8 = L.scanU8J80T60, s16 = L.scanU16J240T60;
      ok = ok && mono(s8) && mono(s16) && s8.filter((r) => r[0] <= 0.46 + 1e-9).every((r) => r[1] > 0) && s8.filter((r) => r[0] >= 0.48 - 1e-9).every((r) => r[1] < 0) && s16.filter((r) => r[0] <= 0.50 + 1e-9).every((r) => r[1] > 0) && s16.filter((r) => r[0] >= 0.52 - 1e-9).every((r) => r[1] < 0);
      for (const r of s16) { const q = s8.find((x) => Math.abs(x[0] - r[0]) < 1e-9); if (q) ok = ok && r[1] >= q[1] - 1e-9; }
      const lam = (a) => L.marginsN32.find((x) => Math.abs(x[0] - a) < 1e-9)[1];
      return ok && s8.find((r) => r[0] === 0.40)[1] < lam(0.40) && s16.find((r) => r[0] === 0.46)[1] < lam(0.46) && s8.find((r) => r[0] === 0.30)[1] < lam(0.30);
    },
  },
  {
    id: 'D4-half-pole-free-margins-coincide-N16',
    description: 'a = 0.40, N = 16: lambda_min(Arch - P_2) on {A=B=0} equals the value on {A=A\'=0} to 1e-6 and lies in [0.22, 0.24]; the single constraint {A=0} gives < 0.03; unconstrained Arch - P_2 is negative (< -1) while W_full is positive; baked N = 32 table has pole-free = half-pole-free at every a and both monotone decreasing',
    holds: () => {
      const M = constrainedMargins(0.40, 16);
      const T = L.marginsN32;
      return Math.abs(M.poleFree - M.halfA) < 1e-6 && within(M.poleFree, 0.22, 0.24) && M.onlyA < 0.03 && M.free < -1 && M.wFull > 0
        && T.every((r) => Math.abs(r[1] - r[2]) < 1e-5 && r[3] < r[1] && r[4] > 0 && r[5] < 0) && T.every((r, i) => i === 0 || r[1] < T[i - 1][1]);
    },
  },
  {
    id: 'D5-split-table-consistency',
    description: 'baked form-level split: L_S = Z + S_S and D_S = Z + E_S and W = S_S - E_S (2e-4) in every row, W = lamW|pf on the extremal (1e-3), E_S/S_S rises from -0.28 (a = 0.36) to 0.972 ((ln 3)/2), Z/L_S rises 0.49 -> 0.89, lamMin(S_S|pf) > lamMax(E_S|pf) exactly for a <= 0.46, E_S on the hhat(0)=0 extremal is negative for a <= 0.46 and positive from 0.50, kernel anchors reproduce the excess module',
    holds: () => {
      const S = L.splitN24; let ok = true;
      for (const r of S) { const [a, lw, LS, DS, W, Z, E, SS, rES, rZL, , , E1, lS, , lEmax] = r; ok = ok && Math.abs(LS - Z - SS) < 2e-4 && Math.abs(DS - Z - E) < 2e-4 && Math.abs(W - (SS - E)) < 2e-4 && Math.abs(W - lw) < 1e-3 && Math.abs(rES - E / SS) < 2e-3 && Math.abs(rZL - Z / LS) < 2e-3 && ((lS > lEmax) === (a <= 0.46 + 1e-9)) && ((E1 < 0) === (a <= 0.46 + 1e-9)); }
      const rES = S.map((r) => r[8]), rZL = S.map((r) => r[9]);
      ok = ok && rES.every((x, i) => i === 0 || x > rES[i - 1]) && rZL.every((x, i) => i === 0 || x > rZL[i - 1]) && rES[0] < -0.25 && rES[rES.length - 1] > 0.97 && rES[rES.length - 1] < 1 && rZL[0] < 0.5 && rZL[rZL.length - 1] > 0.89;
      const K = L.splitKernelAnchors; return ok && Math.abs(K.corrLn2 - 1.4550) < 2e-4 && Math.abs(K.epsS15 - 0.74989) < 5e-4 && Math.abs(K.z15 - 0.7997) < 1e-4 && Math.abs(K.z12 - 0.3811) < 1e-4;
    },
  },
  {
    id: 'D6-symbol-level-obstruction-anchors',
    description: 'w_1(0) = -6.3524 and w_1(t_1) = -0.6143 (1e-3, recomputed); the pencil-module symbol table gives Lhat_S(t_1)/deltahat_S(t_1) = 1/9.11 with w(t_1) = -2.981 and ratios decreasing 9.11 -> 3.27 for k = 1..6 — the retained trace is below the remainder at every resonance; the LP certificates fill exactly these deficits (nu(0) in [6.35, 6.42], nu(t_1) in [0.61, 0.68] for both baked certificates)',
    holds: () => {
      const t1 = 2 * PI / LN2; const rows = PENCIL_HIGHRES_LITERALS.symbolFullToT200.lhatAtTk.slice(0, 6);
      const S = L.symbolObstruction;
      return Math.abs(w1(0) - S.w1At0) < 1e-3 && Math.abs(w1(t1) - S.w1AtT1) < 1e-3 && Math.abs(rows[0][3] / rows[0][4] - S.ratio) < 0.01 && Math.abs(rows[0][2] - S.wAtT1) < 1e-3
        && rows.every((r, i) => r[2] < 0 && r[3] > r[4] && Math.abs(r[5] - S.ratiosK1to6[i]) < 0.01 && (i === 0 || r[5] < rows[i - 1][5]))
        && [CERT_A040, CERT_A048].every((c) => within(certNu(c, 0), 6.35, 6.42) && within(certNu(c, t1), 0.61, 0.68) && w1(t1) + certNu(c, t1) > 0);
    },
  },
  {
    id: 'verdict-honesty',
    description: 'status says RH open / NO QED / not interval-verified, records the certified range 2a <= 0.96 and the 1/9.11 symbol-level failure, names the sibling primal certificate, and honestLimits disclaims interval arithmetic and any zero localisation',
    holds: () => /RH open/.test(RH_ROUTE_I_DIRECT_SONINE_TRACE_CERTIFICATE.status) && /NO QED/.test(RH_ROUTE_I_DIRECT_SONINE_TRACE_CERTIFICATE.status) && /not interval-verified/.test(RH_ROUTE_I_DIRECT_SONINE_TRACE_CERTIFICATE.status)
      && /2a <= 0.96/.test(RH_ROUTE_I_DIRECT_SONINE_TRACE_CERTIFICATE.status) && /1\/9\.11/.test(RH_ROUTE_I_DIRECT_SONINE_TRACE_CERTIFICATE.status) && /nothing about zeros/.test(RH_ROUTE_I_DIRECT_SONINE_TRACE_CERTIFICATE.status)
      && RH_ROUTE_I_DIRECT_SONINE_TRACE_CERTIFICATE.parents.some((p) => /uncertainty-concentration-certificate/.test(p)) && /not interval arithmetic/.test(RH_ROUTE_I_DIRECT_SONINE_TRACE_CERTIFICATE.honestLimits) && /no zero is localised/.test(RH_ROUTE_I_DIRECT_SONINE_TRACE_CERTIFICATE.honestLimits),
  },
]);

/**
 * imp-96634 CROSS-VALIDATION — the IEEE-double direct-Sonine margin ladder W(h) >= m(a)||h||^2 against the
 * interval-verified Krein sigma_2 certificate (rh-route-i-toeplitz-krein-certificate-2026-09-24), over the shared
 * window a <= 0.48 (2a <= 0.96). RIGOR-BRIDGE VERDICT (NO QED, NO new positivity):
 *
 * The two ladders live in DIFFERENT norms and are NOT inter-convertible in the direction the ticket asks.
 *   - Direct-Sonine: W(h) >= m(a) ||h||^2, m = 0.0467/0.0160/0.0077/0.0016 at a = 0.40/0.44/0.46/0.48, in the
 *     ||h||^2 = (1/2pi) int |hhat|^2 norm; LP LOWER bounds on lam_min(Arch-P_2 | pole-free), IEEE double.
 *   - Krein: T_a[sigma_2] >= 0 via sigma_2 + nu >= eps (eps = 8 main / 20 compact), interval-verified. Writing
 *     h = Q g (hhat = (t^2+1/4) ghat, Q = -d^2/dx^2 + 1/4), W(h) = <T_a[sigma_2] g, g> >= eps ||g||^2 in the
 *     ||g||^2 = ||Q^{-1} h||^2 norm. eps is compared against lam_min(T_a[sigma_2]) (||g||-normalised, 56.1 at a = 0.45).
 *
 * ONE-WAY norm relation: Q >= 1/4 => Q^2 >= 1/16 => ||h||^2 = ||Q g||^2 >= (1/16) ||g||^2, i.e. ||g||^2 <= 16 ||h||^2.
 * This converts an ||h||-margin INTO a ||g||-margin (W >= m ||h||^2 => W >= (m/16) ||g||^2), not the reverse. In the
 * reverse direction sup_{g in PW_a} ||Q g||^2 / ||g||^2 = +oo (the multiplier (t^2+1/4)^2 is unbounded in t; measured
 * ratio 600 -> 1.0e12 for g = (a^2-x^2)^2 cos(freq x) as freq 0 -> 1000, tmp/imp-96634-scratch.mjs), so
 * inf_{h != 0} ||g||^2 / ||h||^2 = 0 and the Krein floor eps ||g||^2 supplies NO positive ||h||^2-normalised margin.
 *
 * CONSEQUENCE. What the interval Krein certificate DOES upgrade to interval-rigorous on all a <= 0.48: the QUALITATIVE
 * statement W(h) > 0 for every nonzero pole-free h (eps > 0, ||g|| > 0), i.e. D_S < L_S strictly. What it DOES NOT
 * upgrade: any single quantitative m(a) in the ||h||^2-normalised ladder — those remain IEEE-double. Interval-upgrading
 * m(a) would need a SEPARATE interval-rigorous lower bound on lam_min(Arch-P_2 | pole-free) in the ||h|| norm (an
 * interval version of the direct-Sonine LP, or interval Rayleigh-Ritz with a rigorous tail), which is not supplied by
 * the sigma_2 certificate. Cross-validation is CONSISTENT (both give W > 0 on the shared window); the rigor bridge is
 * one-directional and does not transfer the sharper local ||h||-margin. RH open; no refereed bound is changed; NO QED.
 */
export const KREIN_INTERVAL_BRIDGE = Object.freeze({
  id: 'imp-96634-direct-sonine-vs-krein-interval-bridge',
  question: 'Does the interval-verified Krein sigma_2 certificate interval-upgrade any m(a) in the IEEE-double direct-Sonine ||h||^2-normalised margin ladder over the shared window a <= 0.48?',
  sharedWindow: '2a <= 0.96 (a = 0.40..0.48); direct-Sonine dual-LP certificates and the Krein main certificate (X0 = 0.96) both cover it; the compact Krein certificate (X0 = 0.9) covers a <= 0.45',
  /** [a, 2a, m_direct(a) LP lower bound ||h||^2 (IEEE dbl), RR upper bound ||h||^2 lam_min|pf (N=32, or null if off-grid),
   *   Krein interval status T_a[sigma_2] >= 0, Krein eps (||g||^2 floor, interval), lam_min(T_a[sigma_2]) ||g||^2 signal (N=36, or null),
   *   m(a) interval-upgraded by the Krein cert?] */
  ladder: [
    [0.40, 0.80, 0.046677, 0.22550, 'interval-verified (main cert)', 8, null, false],
    [0.44, 0.88, 0.016041, null, 'interval-verified (main cert)', 8, null, false],
    [0.46, 0.92, 0.007686, 0.049691, 'interval-verified (main cert)', 8, null, false],
    [0.48, 0.96, 0.001618, null, 'interval-verified (main cert)', 8, null, false],
  ],
  normMismatch: {
    directNorm: '||h||^2 = (1/2pi) int |hhat|^2 (Arch - P_2 on pole-free h)',
    kreinNorm: '||g||^2 = ||Q^{-1} h||^2 (T_a[sigma_2] on g, h = Q g, hhat = (t^2+1/4) ghat)',
    rigorousDirection: 'Q >= 1/4 => ||g||^2 <= 16 ||h||^2, so an ||h||-margin m gives a ||g||-margin >= m/16 (NOT the reverse)',
    reverseUnbounded: 'sup_{g in PW_a} ||Q g||^2/||g||^2 = +oo (measured 600 -> 1.0e12 for freq 0 -> 1000), hence inf ||g||^2/||h||^2 = 0: eps ||g||^2 gives no positive ||h||^2 floor',
    kreinEpsIsGnorm: 'eps (8 / 20) is compared against lam_min(T_a[sigma_2]) = 56.1 at a = 0.45 (||g||^2-normalised), not against the ||h||^2 ladder value ~0.01',
  },
  upgraded: 'QUALITATIVE only: W(h) > 0 for every nonzero pole-free h (D_S < L_S strictly) is interval-rigorous on all a <= 0.48 via the Krein cert. QUANTITATIVE: NONE of m = 0.0467/0.0160/0.0077/0.0016 is interval-upgraded — each remains an IEEE-double LP lower bound in the ||h|| norm the Krein certificate does not control',
  toUpgradeMOfA: 'a separate interval-rigorous lower bound on lam_min(Arch - P_2 | pole-free) in the ||h|| norm (interval direct-Sonine LP, or interval Rayleigh-Ritz with a rigorous truncation tail); the sigma_2 certificate, being ||g||-normalised, does not provide it',
  verdict: 'the two ladders CROSS-VALIDATE (both establish W > 0 on 2a <= 0.96) but the rigor bridge is one-directional: the interval Krein certificate upgrades the qualitative pole-free positivity, not the sharper local ||h||^2-normalised margins m(a), which stay IEEE-double. NO QED; no zero localised; RH open; no refereed bound is changed',
});

export default RH_ROUTE_I_DIRECT_SONINE_TRACE_CERTIFICATE;
