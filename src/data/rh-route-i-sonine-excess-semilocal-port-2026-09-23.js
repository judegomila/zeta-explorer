/**
 * rh-route-i-sonine-excess-semilocal-port (2026-09-23) — the Connes–Consani Sonine REFINEMENT
 * (arXiv:2006.13771, Thm 4.7 / Prop 5.5 / Thm 6.11) ported to the semilocal S = {oo, 2} identity of
 * Route I, to attack the single concrete target D_S <= L_S on pole-free h in L^2(-a, a), 2a < ln 3.
 * RESULT: the refinement ports verbatim as algebra (W_oo + W_2 = Tr(vartheta(f) S_S) - E_S(f), S_S the
 * semilocal Sonine projection, E_S the explicit excess), its ingredients are computed EXACTLY (semilocal
 * prolate spectrum by an untruncated FFT–Mellin realisation of F_S; the excess kernel eps_S in closed form
 * plus a uniformly convergent mode correction), and the analysis PINPOINTS the obstruction: eps_S inherits
 * exactly half of the log cusp of delta_S at rho = 2, so for 2a > ln 2 the Connes–Consani operator
 * E_S o Q = -2 eps'(1+)(Id - K), K compact, is replaced by an INDEFINITE UNBOUNDED operator whose positive
 * part grows linearly along the p = 2 resonances t_k = 2 pi k / ln 2. The sufficient condition of the CC
 * method (E o Q <= c |ghat(0)|^2) is therefore false for every a > (ln 2)/2 and no finite-rank correction
 * can restore it: the Sonine-refinement route to Weil positivity terminates exactly at support ln 2 — the
 * range already covered by Yoshida (1992) and CC (2021). No positivity past ln 2 is proved here. RH open;
 * no refereed bound is changed; NO QED.
 *
 * ---------------------------------------------------------------------------------------------------------
 * 0. NOTATION (Route I module, CC conventions). H = L^2(R)_ev ~ L^2(0, oo); P_1 = 1_{[0,1]}, P = 1 - P_1;
 *    F_S eta(w) = (1/2) Sum_{n>=0} etahat(2^n w) - (1/2) etahat(w/2) with Mellin multiplier
 *    (F_S f)^(s) = rho_2(s) m(s) f^(1-s), m(s) = 2 (2pi)^{-s} Gamma(s) cos(pi s/2) (even Fourier), rho_2 the
 *    Tate factor of Q_2. Since rho_2(s) rho_2(1-s) = 1 = m(s) m(1-s), F_S is a self-adjoint unitary INVOLUTION.
 *    Phat_S = F_S P_1 F_S; A := P_1 F_S P_1 (the semilocal "prolate" operator); L_S(f) = Tr(vartheta(f) P Phat_S P);
 *    delta_S(rho) = Tr(vartheta(rho^{-1}) Phat_S P_1) = rho^{1/2} br(rho) (rho >= 1), br the si double sum of Route I.
 *
 * 1. THEOREM (no fully confined state). A is compact (norm-convergent sum of dyadic prolate compressions,
 *    ||(1/2) P_1 F D_{2^n} P_1|| <= 2^{-n/2}/2) with ||A|| <= 1, and NO eigenvalue of modulus 1:
 *    P_1 H ∩ Phat_S H = {0}. Proof: if xi in L^2(0,1) and F_S xi = ±xi vanishes on (1, oo), then with
 *    g = xihat (entire, in L^2) one has Sum_{n>=0} g(2^n w) = g(w/2) for w > 1, i.e. g(v) = Sum_{n>=1} g(2^n v)
 *    for v > 1/2; subtracting the same identity at 2v gives g(v) = 2 g(2v) on (1/2, oo), so g(v) = p(log_2 v)/v
 *    with p 1-periodic; |g(v)| <= C v forces p = 0 near v -> 0+ along the continuation, hence g = 0, xi = 0.
 *    (Consequence: the Sonine decomposition below has no degenerate 2-dimensional block.)
 *
 * 2. EXACT SEMILOCAL PROLATE SPECTRUM (tmp/sonine-fft-mellin.py: F_S realised through its Mellin multiplier on
 *    a log grid v = log x, ftilde = e^{v/2} f(e^v), period 64, anti-aliasing buffer and Nyquist low-pass;
 *    Lanczos with full reorthogonalisation; delta = 2e-5 and 1e-5 agree to 1e-6 on the top modes).
 *    Archimedean control reproduces CC (68)-(71): 0.9999711, -0.9795028, 0.5242385, -0.0590133, 0.0027346
 *    (CC: 0.999971, -0.979485, 0.524086, -0.0589766, 0.00273233) and eps'(1+) -> 22.87 at delta = 1e-4 (CC 22.9965;
 *    the dense-grid method of tmp/sonine-semilocal-prolate.py gives 22.99648 and t(n) = 11.9719, 8.77574, 2.20528,
 *    0.0434 — CC's list exactly).
 *    Semilocal: lam_S(0) = +0.9999731 (1 - lam^2 = 5.383e-5), lam_S(1) = -0.9927022 (1.454e-2), lam_S(2) = +0.6202,
 *    lam_S(3) = -0.5609, 0.4361, -0.4168, 0.4125, -0.3542, 0.3469, 0.3027, -0.2962, then a DYADIC LADDER clustering at
 *    ±2^{-n/2}/2 (0.2506, 0.2500, -0.2500, 0.2449 ...; 0.1768 = 2^{-5/2} ...): the scale-n dilate contributes ~2^{n+1}
 *    even modes of size 2^{-n/2}/2, so lam_k ~ 1/(2 sqrt k), Sum lam^2 = oo (log; = delta_S(1)), Sum |lam|^3 < oo.
 *    The two top states are as confined as in the archimedean box (CC's 0.999971 / -0.979485); the semilocal
 *    eigenfunctions are lacunary sums Sum_m xihat(2^m w) — continuous, Zygmund-class, nowhere differentiable,
 *    with a log singularity -(xihat(0)/(2 lam)) log_2(1/x) at x -> 0 (this is why dense-grid truncations at N dyadic
 *    scales converge only like 2^{-N} and even push |lam_S(0)| above 1: tmp/sonine-semilocal-N5..7.log).
 *
 * 3. THE SONINE REFINEMENT (CC Prop 4.5 / Thm 4.7, verbatim with F_S). With xi_n the eigenvectors of A,
 *    psi_n = P F_S xi_n (||psi_n||^2 = 1 - lam_n^2), zeta_n = psi_n/||psi_n||, tau_n = lam_n/sqrt(1 - lam_n^2):
 *        P Phat_S P = Sum_n lam_n^2 |zeta_n><zeta_n| + S_S,   S_S = projection on the semilocal Sonine space,
 *        W_oo(f) + W_2(f) = Tr(vartheta(f) S_S) - E_S(f),   E_S(f) = int f(rho^{-1}) eps_S(rho) d*rho,
 *        eps_S(rho) = Sum_n tau_n <xi_n | vartheta(rho^{-1}) zeta_n>  =  Tr( vartheta(rho^{-1}) P F_S A (1 - A^2)^{-1} P_1 ).
 *    Splitting A (1-A^2)^{-1} = A + A^3 (1-A^2)^{-1} gives the EXACT decomposition
 *        eps_S = delta^out + corr,   delta^out(rho) := Tr(vartheta(rho^{-1}) P F_S P_1 F_S P_1) = delta_S(rho) - delta^in(rho),
 *        delta^in(rho) := Sum_n lam_n^2 <xi_n | vartheta(rho^{-1}) xi_n> = Tr(vartheta(rho^{-1}) P_1 A^2) = rho^{-1/2} br(1/rho),
 *        corr(rho)     := Sum_n lam_n^3/(1 - lam_n^2) <xi_n | vartheta(rho^{-1}) psi_n>,
 *    (delta^in in closed form: the region x < 1/rho of CC's square Delta, substitution t = xy, s = rho t, the same si
 *    sums as delta_S at the argument 1/rho). corr is a UNIFORMLY convergent series of continuous functions
 *    (|terms| <= |lam_n|^3 / sqrt(1 - lam_n^2), summable), hence continuous. z := delta_S - eps_S = Sum lam^2 <zeta|vartheta zeta>
 *    is the positive-definite part of the remainder.
 *
 * 4. THEOREM (cusp allocation; tmp/sonine-closed-forms.py). At rho = 2^k (1 + eps), per unit log_2(1/eps):
 *        delta_S ~ 2^{k/2}/2,     delta^in ~ 2^{-k/2}/2,     delta^out ~ (2^{k/2} - 2^{-k/2})/2 ;
 *    measured increments per doubling of 1/eps (k = 1): 0.7071 / 0.3536 / 0.3536; (k = 2): 1.0000 / 0.2500 / 0.7500.
 *    corr is continuous through rho = 2 (1.4285, 1.4550, 1.4628 at rho = 1.99, 2, 2.01). Hence the semilocal EXCESS has
 *    the log cusp  eps_S(2(1 ± eps)) = (1/(2 sqrt2)) log_2(1/eps) + O(1) = c_2 log(1/eps) + O(1),  c_2 = 1/(2 sqrt2 ln 2) = 0.51007,
 *    i.e. exactly HALF of the cusp of delta_S sits in the excess and half in the positive part z.
 *    At rho -> 1: delta^out(1+u) = (u/2) log_2(1/u) + O(u) (ratio delta^out/(u log_2(1/u)) = 0.475, 0.484, 0.488 at
 *    u = 2^{-10}, 2^{-16}, 2^{-21}), so eps_S(1+u) = u [ (1/2) log_2(1/u) + 13.62 + o(1) ] — a LOG-KINK: CC's finite
 *    eps'(1+) = 22.9965 becomes +oo (the dense-grid value Sum t(n) over the top 80 exact modes is 18.47 and the tail
 *    Sum_{n>80} lam_n^4 xi_n(1)^2/(1-lam_n^2) diverges logarithmically, exactly the delta^out term).
 *
 * 5. THEOREM (the obstruction). Let Q = -(rho d/drho)^2 + 1/4 (CC Lemma 3.3: pole conditions <=> positivity of the
 *    composite with Q on C_c^oo(-a, a), CC Prop 3.5), E_S o Q(k*k^*) = int (-f'' + f/4)(x) eps_S(e^{|x|}) dx, f = k*k^*.
 *    (i) 2a <= ln 2: the cusp at ln 2 is outside the window; the log-kink gives, for narrow f, the term
 *        -(1/ln 2) f(0) log(1/width): E_S o Q = -(1/ln 2) log|D| + bounded on L^2(-a,a) — unbounded BELOW (stronger than
 *        CC's constant -2 eps'(1+) = -45.99), the CC structure "negative + compact" survives with a log-divergent
 *        negative part. Measured: E_S o Q(k*k^*)/||k||^2 = -33 ... -43 for k = cos(t_0 x) phi(x), t_0 up to 290, a = 0.3,
 *        against -45.5 ... -46.0 for the archimedean excess (CC's -2 eps'(1+)).
 *    (ii) 2a > ln 2: by Hadamard finite parts, int (-f'') c_2 log(1/|x ∓ ln 2|) dx = c_2 int |t| cos(t ln 2) |khat(t)|^2 dt, so
 *        E_S o Q(k*k^*) = c_2 int_R |t| cos(t ln 2) |khat(t)|^2 dt + (log|D| + bounded terms).
 *        For k = cos(t_0 x) phi(x), phi a bump on (-a, a): E_S o Q(k*k^*)/||k||^2 = 2 pi c_2 t_0 cos(t_0 ln 2) R_phi(ln 2)/||phi||^2 + O(log t_0),
 *        R_phi(u) = int phi(y) phi(y-u) dy > 0 iff 2a > ln 2. Along the p = 2 resonances t_k = 2 pi k/ln 2 (cos = +1) the excess
 *        composite tends to +oo LINEARLY; along the anti-resonances to -oo. Measured half-split (res - antires)/2 vs
 *        prediction 2 pi c_2 t R_phi/||phi||^2 (plateau bump, tmp/sonine-excess-toeplitz2.py):
 *          a = 0.40 (R = 0.0240): k = 8: 5.98 vs 5.76; k = 16: 11.19 vs 11.34; k = 32: 23.72 vs 22.51;
 *          a = 0.50 (R = 0.2155): k = 8: 55.27 vs 51.66; k = 16: 105.93 vs 101.75; k = 32: 210.01 vs 201.93;
 *          a = (ln3)/2 (R = 0.2893): k = 8: 74.45 vs 69.33; k = 16: 142.54 vs 136.56; k = 32: 282.13 vs 271.02;
 *        and E_S o Q(k*k^*)/||k||^2 itself is POSITIVE from k = 6 at a = 0.5 (+6.3, ..., +173.9 at k = 32) and from k = 4 at
 *        (ln 3)/2 (+5.2, ..., +245.4 at k = 32); the archimedean control stays at -45.5 ... -46.0 (bounded, as CC prove).
 *    Consequences. CC's Prop 5.5 (E o Q = -2 eps'(1+)(Id - K_I), K_I Hilbert–Schmidt) and Lemma 6.3 (||K_I - T|| <= L^1
 *    norm of Q eps) have no semilocal analogue past ln 2: Q eps_S contains the finite part of 1/(x ∓ ln 2)^2, not an L^1
 *    function; the excess composite is indefinite and unbounded above, so E_S o Q <= c |ghat(0)|^2 (CC (141)) is FALSE
 *    for every a > (ln 2)/2 (the test functions above have khat(0) -> 0), and no finite-rank correction (moments at t = 0,
 *    or any) can repair an operator unbounded above. Since W o Q = Tr(vartheta(Q f) S_S) - E_S o Q >= 0 must hold (Weil
 *    positivity on 2a < ln 3 is true numerically, Route I), the Sonine trace Tr(vartheta(Q f) S_S) of the semilocal box
 *    grows linearly along the same resonances: the positivity dropped by the CC method is exactly the term needed.
 *    The refinement route to Weil positivity terminates at support ln 2 for S = {oo, 2} — and a fortiori for any S
 *    containing a prime, since the cusp is forced by the dilation covariance F_S eta(2w) = F_S eta(w) - etahat(w) + etahat(w/2)/2
 *    of the Euler factor.
 *
 * 6. WHAT THE WEIL FORM ITSELF LOOKS LIKE ON THIS WINDOW (tmp/sonine-qtrick-moments.mjs, tmp/sonine-p2reach.mjs).
 *    Q-trick reformulation: Weil positivity on pole-free L^2(-a,a) <=> T_a[sigma] >= 0 on C_c^2(-a,a), sigma(t) =
 *    (t^2 + 1/4)(2 theta'(t) - m_2(t)); on 2a < 2 ln 2 only the k = 1 Euler term acts: sigma_1 = (t^2+1/4)(2theta'(t) - sqrt2 ln2 cos(t ln2)).
 *    Checked: lambda_min of the Q-form (basis (a^2-x^2)^2 P_n) has the sign of the pole-free lambda_min at a = 0.3, 0.4, 0.5,
 *    (ln3)/2 (6.56/0.277/0.0031/2.3e-4 vs 0.692/0.2255/0.0119/9.5e-4). Symbol landscape: sigma_1 < 0 on |t| < 3.306 (well,
 *    min -5.71 at t = 2.05; w_1(0) = -6.35) and on the RESONANCE DIP (6.945, 10.532) around t_1 = 9.065 (min -50.7 at t = 9.11,
 *    w_1(t_1) = -0.614 = 0.366 - 0.980); positive elsewhere, ~ t^2 log t. Band decomposition of (1/2pi) int w |hhat_0|^2 for the
 *    pole-free minimizer at (ln 3)/2 (total 5.0e-4 = lambda_min): [0, 3.5): -0.009, [3.5, 7.4): +0.189, [7.4, 10.8): -0.263,
 *    [10.8, 40): +0.084 — the binding negativity is the p = 2 resonance dip, not the central well; |hhat_0|^2 peaks at t = 7.55
 *    (0.5: 7.8; 0.4: 8.9). Moment ladder (N = 32, pole-free ∩ {hhat^{(j)}(0) = 0, j <= m}): at (ln 3)/2 lambda_min = 9.5e-4
 *    (m = -1), 0.0334 (m = 0, CC's c|ghat(0)|^2 device), 0.414 (m = 1), 0.799 (m = 2), 0.814 (m = 3, 4: saturated); at a = 0.5:
 *    0.0119, 0.190, 0.746, 0.845, 0.845. One-prime reach: the S = {oo, 2} pole-free form (all powers of 2) stays positive to
 *    a_2 = 0.565920 (bisection, N = 32), 2a_2 = 1.13184 = ln 3 + 0.0332: p = 3 enters with 3% of margin (the sibling module
 *    rh-route-i-pencil-highres-map finds the same crossing, a* = 0.56578, through an odd vector whose negativity is ~100% in
 *    the first resonance window). The uncertainty-principle reading: a window of half-length a resolves the symbol at scale
 *    pi/a = 5.7 at (ln3)/2, barely too coarse to isolate the dip (7.4, 10.8) of width 3.4; positivity of the one-prime form is
 *    the statement that the dip cannot be resolved before ln 3 + 0.033.
 *
 * 7. HONEST VERDICT. Ported: the Sonine refinement (exact algebra), the semilocal prolate spectrum (exact, converged), the
 *    excess kernel (closed form + convergent correction), and the CC operator analysis. Proved (elementary): no eigenvalue of
 *    modulus 1; the cusp allocation of Theorem 4 (closed forms + uniform convergence). Established (numerically, 4% agreement
 *    with the analytic prediction over k = 8..32): the linear resonant unboundedness of E_S o Q for 2a > ln 2. NOT obtained:
 *    any unconditional positivity past ln 2 — and the CC route cannot give it. The honest state of the art stays: Weil
 *    positivity (pole-free) proved for 2a <= ln 2 (Yoshida 1992 by explicit computation; CC 2021 with the extra ghat(0) = 0);
 *    for ln 2 < 2a < ln 3 it is the unproved inequality D_S <= L_S, whose binding direction is the first p = 2 resonance window.
 *    RH open; no refereed bound is changed; NO QED.
 *
 * Import-light (Route H assembly + Route I si/multipliers; no zeros bundle). Assertions ~10 s: closed-form cusp
 * coefficients, symbol landscape, N = 24 Galerkin moment ladder / Q-trick sign / one-prime reach, baked-spectrum
 * consistency, resonance-split prediction. Changes no bound.
 */

import { weilForm, coeffs } from './rh-route-h-connes-scaling-site-weil-positivity-2026-09-23.js';
import { si, twoThetaPrime, m2, complementBasis, compress } from './rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js';

const PI = Math.PI, LN2 = Math.LN2, LN3 = Math.log(3), SQRT2 = Math.SQRT2;
export const C2_CUSP = 1 / (2 * SQRT2 * LN2); // 0.51007: natural-log coefficient of the rho = 2 cusp of eps_S

/** the si double-sum bracket: delta_S(rho) = rho^{1/2} br(rho) (rho >= 1), delta^in(rho) = rho^{-1/2} br(1/rho) */
export function bracketS(r, NMAX = 40, MEXTRA = 40) {
  let s = 0; const l2 = Math.log2(r);
  for (let n = 0; n <= NMAX; n++) {
    const A = Math.pow(2, n) * r; const M = Math.max(1, Math.ceil(n + l2)) + MEXTRA;
    for (let m = 0; m <= M; m++) { const B = Math.pow(2, m); s += si(A + B) + si(Math.abs(A - B)); }
    s -= si(A + 0.5) + si(Math.abs(A - 0.5));
  }
  const R = r / 2; const M2 = Math.max(1, Math.ceil(l2)) + MEXTRA;
  for (let m = 0; m <= M2; m++) { const B = Math.pow(2, m); s -= si(R + B) + si(Math.abs(R - B)); }
  s += si((r + 1) / 2) + si(Math.abs(r - 1) / 2);
  return s / 2;
}
export const deltaSclosed = (rho) => Math.sqrt(rho) * bracketS(rho);
export const deltaIn = (rho) => bracketS(1 / rho) / Math.sqrt(rho);
export const deltaOut = (rho) => deltaSclosed(rho) - deltaIn(rho);
/** truncated Weil symbol (exact on 2a < 2 ln 2 after Q): sigma_1(t) = (t^2 + 1/4)(2 theta'(t) - sqrt2 ln2 cos(t ln2)) */
export const w1 = (t) => twoThetaPrime(t) - SQRT2 * LN2 * Math.cos(t * LN2);
export const sigma1 = (t) => (t * t + 0.25) * w1(t);
export const sigmaFull = (t) => (t * t + 0.25) * (twoThetaPrime(t) - m2(t));

// ---- Galerkin helpers (Route H Legendre basis)
function jacobiEig(Ain) {
  const n = Ain.length; const A = Ain.map((r) => Array.from(r)); const V = Array.from({ length: n }, (_, i) => { const r = new Array(n).fill(0); r[i] = 1; return r; });
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] ** 2; if (off < 1e-28) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(A[p][q]) < 1e-300) continue;
      const th = (A[q][q] - A[p][p]) / (2 * A[p][q]); const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)); const c = 1 / Math.sqrt(t * t + 1), s = t * c;
      for (let k = 0; k < n; k++) { const akp = A[k][p], akq = A[k][q]; A[k][p] = c * akp - s * akq; A[k][q] = s * akp + c * akq; }
      for (let k = 0; k < n; k++) { const apk = A[p][k], aqk = A[q][k]; A[p][k] = c * apk - s * aqk; A[q][k] = s * apk + c * aqk; }
      for (let k = 0; k < n; k++) { const vkp = V[k][p], vkq = V[k][q]; V[k][p] = c * vkp - s * vkq; V[k][q] = s * vkp + c * vkq; }
    }
  }
  const idx = A.map((_, i) => i).sort((i, j) => A[i][i] - A[j][j]); return { vals: idx.map((i) => A[i][i]), vecs: idx.map((i) => V.map((r) => r[i])) };
}
function legendreAll(n, x) { const P = new Float64Array(n); P[0] = 1; if (n > 1) P[1] = x; for (let k = 2; k < n; k++) P[k] = ((2 * k - 1) * x * P[k - 1] - (k - 1) * P[k - 2]) / k; return P; }
/** pole-free lambda_min of the Weil form with m extra vanishing moments hhat^{(j)}(0) = 0, j = 0..m (m = -1: pole-free only) */
export function momentLadder(a, N, moments = [-1, 0, 1, 2]) {
  const wf = weilForm(a, N);
  const av = Array.from(coeffs(wf, (u) => Math.exp(-u / 2))), bv = Array.from(coeffs(wf, (u) => Math.exp(u / 2)));
  const mom = [0, 1, 2, 3].map((j) => Array.from(coeffs(wf, (u) => Math.pow(u, j))));
  const out = {};
  for (const m of moments) { const B = complementBasis(N, [av, bv, ...mom.slice(0, m + 1)]); out[`m${m}`] = jacobiEig(compress(wf.W, B)).vals[0]; }
  return out;
}
/** pole-free lambda_min of Arch + Pole - (powers-of-2 prime terms only): the S = {oo, 2} form beyond (ln 3)/2 */
export function lamP2only(a, N) {
  const wf = weilForm(a, N); const M = wf.Arch.map((r, m) => Array.from(r, (x, n) => x + wf.Pole[m][n]));
  for (const q of Object.keys(wf.primeTerms)) { const qq = +q; if ((qq & (qq - 1)) === 0) { const P = wf.primeTerms[q]; for (let m = 0; m < N; m++) for (let n = 0; n < N; n++) M[m][n] -= P[m][n]; } }
  const av = Array.from(coeffs(wf, (u) => Math.exp(-u / 2))), bv = Array.from(coeffs(wf, (u) => Math.exp(u / 2)));
  return jacobiEig(compress(M, complementBasis(N, [av, bv]))).vals[0];
}
/** Q-trick form lambda_min with k_n = (a^2-x^2)^2 P_n(x/a): <coeffs(Q k_m), (Arch - Prime) coeffs(k_n)> vs L^2 Gram */
export function qTrickLamMin(a, N) {
  const wf = weilForm(a, N); const M = wf.Arch.map((r, m) => Array.from(r, (x, n) => x - wf.Prime[m][n]));
  const nb = N - 4; const kc = [], qc = [];
  for (let n = 0; n < nb; n++) {
    const k = (u) => Math.pow(a * a - u * u, 2) * legendreAll(n + 1, u / a)[n];
    const k2 = (u) => { const h = 1e-3 * a; return (-k(u + 2 * h) + 16 * k(u + h) - 30 * k(u) + 16 * k(u - h) - k(u - 2 * h)) / (12 * h * h); };
    kc.push(Array.from(coeffs(wf, k))); qc.push(Array.from(coeffs(wf, (u) => -k2(u) + k(u) / 4)));
  }
  const Mat = kc.map((_, m) => kc.map((__, n) => { let s = 0; for (let i = 0; i < N; i++) { let r = 0; for (let j = 0; j < N; j++) r += M[i][j] * kc[n][j]; s += qc[m][i] * r; } return s; }));
  const Sym = Mat.map((r, m) => r.map((x, n) => (x + Mat[n][m]) / 2));
  const Gr = kc.map((_, m) => kc.map((__, n) => { let s = 0; for (let i = 0; i < N; i++) s += kc[m][i] * kc[n][i]; return s; }));
  const eg = jacobiEig(Gr); const Gih = Gr.map((_, i) => Gr.map((__, j) => { let s = 0; for (let k = 0; k < nb; k++) s += eg.vecs[k][i] * eg.vecs[k][j] / Math.sqrt(Math.max(eg.vals[k], 1e-300)); return s; }));
  const mm = (A, B) => A.map((r) => B[0].map((_, j) => r.reduce((s, x, k) => s + x * B[k][j], 0)));
  return jacobiEig(mm(mm(Gih, Sym), Gih)).vals[0];
}
/** normalised autocorrelation at lag ln 2 of the plateau bump used in the resonance test (roll = 0.25 a) */
export function plateauAutocorr(a, roll = 0.25, n = 4001) {
  const w = roll * a, core = a - w; const h = 2 * a / (n - 1); const phi = (x) => (Math.abs(x) <= core ? 1 : Math.abs(x) < a ? 0.5 * (1 + Math.cos(PI * (Math.abs(x) - core) / w)) : 0);
  let num = 0, den = 0; for (let i = 0; i < n; i++) { const x = -a + i * h; const p = phi(x); den += p * p * h; num += p * phi(x - LN2) * h; }
  return num / den;
}

// ---- baked literals (tmp/sonine-fft-mellin.py, sonine-closed-forms.py, sonine-excess-toeplitz2.py, sonine-qtrick-moments.mjs, sonine-p2reach.mjs)
export const SONINE_EXCESS_LITERALS = Object.freeze({
  arch: { lam: [0.9999711, -0.9795028, 0.5242385, -0.0590133, 0.0027346, -0.0000764], cc: [0.999971, -0.979485, 0.524086, -0.0589766, 0.00273233, -0.0000762914], epsPrime1: 22.9965, epsPrime1Fft1e4: 22.87, epsPrime1Grid: 22.99648, tCC: [11.9719, 8.77574, 2.20528, 0.0433983], eps: { r125: 3.0081, r17: 0.8888, r2: 1.0866 }, EQlimit: -45.99 },
  semilocal: {
    lam: [0.9999731, -0.9927022, 0.6202012, -0.5609467, 0.436057, -0.416793, 0.4125347, -0.3542198, 0.3469027, 0.3027032, -0.2962492, -0.2526804, 0.250556, 0.2499853, -0.2499786, -0.2485739, 0.2448905, 0.2142883, -0.2090059, -0.1803552, 0.1781371, 0.1767981, -0.1767971, 0.1767767],
    oneMinusLam0sq: 5.383e-5, oneMinusLam1sq: 1.454e-2, sumLam2Top80: 5.1162, tLeading: [0.9635, 11.6751, 2.0941, 0.1003, 1.0812], sumTTop80: 18.467,
    epsOverU: { u1e4: 19.983, u1e3: 18.348, u1e2: 16.619, u3e2: 15.386, corrOverU: 13.62 },
    eps: { r11: 1.18956, r12: 1.56429, r125: 1.54019, r15: 0.74989, r175: 0.74526, r19: 1.60888, r199: 3.14702, r201: 3.20226, r21: 1.9387, r225: 1.01594, r25: -0.11605, r3: -0.66856 },
    corrAt2: [1.4285, 1.4550, 1.4628], zAt: { r12: 0.3811, r15: 0.7997, r2p01: 1.7246, r3: 1.0479 },
    deltaLimits: 'delta = 2e-5 and 1e-5 agree to 1e-6 (top modes), 1e-5 (n <= 23)',
  },
  cusp: { perLog2: { k1: { deltaS: 0.7071, deltaIn: 0.3536, deltaOut: 0.3536 }, k2: { deltaS: 1.0, deltaIn: 0.25, deltaOut: 0.75 } }, c2: 0.51007, logKinkRatio: { j10: 0.47473, j16: 0.48446, j21: 0.48816 } },
  resonanceSplit: { // a -> [R_phi(ln2)/||phi||^2, rows [k, t_k, E_S o Q res, antires, half-split, predicted 2 pi c2 t R]]
    a030: { R: 0.0, rows: [[8, 72.52, -33.04, -31.63, -0.71, 0], [16, 145.04, -33.31, -32.05, -0.63, 0], [32, 290.07, -34.09, -34.47, 0.19, 0]] },
    a040: { R: 0.0240, rows: [[8, 72.52, -26.45, -38.42, 5.98, 5.76], [16, 145.04, -21.45, -43.83, 11.19, 11.34], [32, 290.07, -10.78, -58.23, 23.72, 22.51]] },
    a050: { R: 0.2155, rows: [[8, 72.52, 21.75, -88.80, 55.27, 51.66], [16, 145.04, 71.97, -139.88, 105.93, 101.75], [32, 290.07, 173.91, -246.10, 210.01, 201.93]] },
    aLn3Half: { R: 0.2893, rows: [[8, 72.52, 40.31, -108.59, 74.45, 69.33], [16, 145.04, 108.10, -176.98, 142.54, 136.56], [32, 290.07, 245.36, -318.90, 282.13, 271.02]] },
    archControl: { k8: [-46.31, -46.25], k32: [-45.54, -45.80] }, firstPositiveK: { a050: 6, aLn3Half: 4 },
  },
  symbol: { sigma1Zeros: [3.306, 6.945, 10.532], wellMin: [-5.707, 2.046], w1At0: -6.3524, dipMin: [-50.677, 9.114], t1: 9.0647, w1AtT1: -0.6143, twoThetaPrimeAtT1: 0.366, twoThetaPrimeZero: 6.29, fullDipsNegativeUpToK: 19 },
  minimizerBands: { aLn3Half: { '0-3.5': -0.0092, '3.5-7.4': 0.1891, '7.4-10.8': -0.2635, '10.8-40': 0.0841, total: 5.05e-4, lamWpf: 9.52e-4, specPeak: 7.55 }, a050: { '0-3.5': -0.0078, '3.5-7.4': 0.1731, '7.4-10.8': -0.2692, '10.8-40': 0.1113, specPeak: 7.8 }, a040: { specPeak: 8.9 } },
  momentLadderN32: { a040: [0.2255, 0.7795, 0.8830, 1.0289, 1.2740], a050: [0.01193, 0.19036, 0.74562, 0.84507, 0.84507], aLn3Half: [9.52e-4, 0.03343, 0.41414, 0.79885, 0.81441] },
  qTrickN32: { a030: [6.5584, 0.69199], a040: [0.27723, 0.2255], a050: [0.0030955, 0.011931], aLn3Half: [2.3239e-4, 9.5198e-4] },
  oneprimeReach: { a2: 0.565920, twoA2: 1.131840, minusLn3: 0.0332, siblingAStar: 0.56578, N: 32 },
  positivityOnset: { // imp-96107: E_S o Q resonance-positivity onset MEASURED across (ln2)/2 < a < (ln3)/2 (plateauAutocorr, reproduces baked R exactly)
    note: 'res_k = E_S o Q(res)/||k||^2 = C(k) + half-split_k; C(k) ~ -32..-34 slow log divergence, a-independent (from a030 where R = 0); half-split_k = 2 pi c_2 R_phi(a)(t_k + pi/ln2) grows LINEARLY in k. So the first-positive resonance k decreases as a grows (baked firstPositiveK 6 at a = 0.5 -> 4 at (ln3)/2) and diverges as a -> (ln2)/2+ where R_phi -> 0. Since R_phi(a) > 0 for EVERY a > (ln2)/2, half-split_k -> +oo, E_S o Q is unbounded above, so the CC sufficient condition E o Q <= c|ghat(0)|^2 FAILS for every a > (ln2)/2. Measurement only; RH open; NO QED.',
    thresholdA: 0.346574, // (ln2)/2, R_phi = 0
    grid: [ // [a, 2a - ln2, R_phi(a), half-split slope per k = 2 pi c_2 R_phi (2 pi/ln2)]
      [0.36, 0.0269, 0.00007, 0.002], [0.38, 0.0669, 0.00410, 0.119], [0.40, 0.1069, 0.02402, 0.698],
      [0.43, 0.1669, 0.08229, 2.391], [0.46, 0.2269, 0.14409, 4.186], [0.50, 0.3069, 0.21553, 6.261],
      [0.52, 0.3469, 0.24713, 7.179], [0.549306, 0.4055, 0.28927, 8.404],
    ],
    centerMagFromA030: 33.5, firstPositiveMonotone: 'k = 6 at a = 0.5 -> k = 4 at (ln3)/2 (decreasing in a; -> oo at (ln2)/2)', c2: 0.51007,
  },
});

export const RH_ROUTE_I_SONINE_EXCESS_PORT = Object.freeze({
  id: 'rh-route-i-sonine-excess-semilocal-port-2026-09-23',
  route: 'I (Sonine refinement) — Connes–Consani W = S - E ported to the semilocal S = {oo, 2} identity; excess computed exactly; obstruction located',
  parents: ['src/data/rh-route-i-semilocal-sonine-trace-identity-2026-09-23.js', 'src/data/rh-route-i-pencil-highres-map-2026-09-23.js (sibling: same one-prime crossing a* = 0.56578)', 'src/data/rh-route-h-connes-scaling-site-weil-positivity-2026-09-23.js', 'Connes–Consani, Weil positivity and trace formula, the archimedean place, arXiv:2006.13771 (Thm 4.7, Prop 5.5, §6, Thm 6.11)'],
  status: 'PORTED AND OBSTRUCTED — the Sonine refinement W_oo + W_2 = Tr(vartheta S_S) - E_S is exact for S = {oo, 2}; the semilocal prolate spectrum is computed exactly (lam_S(0) = 0.9999731, lam_S(1) = -0.9927, dyadic ladder ±2^{-n/2}/2, no eigenvalue of modulus 1 — proved); the excess eps_S = delta^out + corr is explicit and inherits EXACTLY HALF of the log cusp of delta_S at rho = 2 (coefficient 1/(2 sqrt2) per log_2; corr continuous), so for 2a > ln 2 the CC operator E_S o Q is indefinite and unbounded above along the p = 2 resonances t_k = 2 pi k/ln 2 (measured half-split 210 vs predicted 202 at a = 0.5, k = 32; E_S o Q > 0 from k = 6): the sufficient condition E o Q <= c|ghat(0)|^2 of CC Thm 6.11 fails for every a > (ln 2)/2 and no finite-rank fix can repair it. The Sonine route to Weil positivity ends at support ln 2. No positivity past ln 2 proved. RH open; no refereed bound is changed; NO QED',
  decomposition: 'P Phat_S P = Sum lam_n^2 |zeta_n><zeta_n| + S_S; W_oo + W_2 = Tr(vartheta(f) S_S) - E_S(f); eps_S(rho) = Sum_n lam_n/sqrt(1-lam_n^2) <xi_n|vartheta(rho^-1) zeta_n> = Tr(vartheta(rho^-1) P F_S A(1-A^2)^-1 P_1) = delta^out + corr, delta^out = delta_S - delta^in, delta^in(rho) = rho^{-1/2} br(1/rho) (closed form), corr = Sum lam^3/(1-lam^2) <xi_n|vartheta psi_n> uniformly convergent; z = delta_S - eps_S >= 0 as a functional',
  spectrum: 'exact semilocal prolate operator A = P_1 F_S P_1 (FFT–Mellin, multiplier rho_2(s) m(s), no dyadic truncation, delta = 2e-5/1e-5 agree to 1e-6): lam_S = 0.9999731, -0.9927022, 0.6202, -0.5609, 0.4361, -0.4168, 0.4125, -0.3542, 0.3469, 0.3027, -0.2962, ... clustering at ±2^{-n/2}/2 (0.25, 0.1768); lam_k ~ 1/(2 sqrt k), Sum lam^2 = oo (log), Sum |lam|^3 < oo; archimedean control reproduces CC (68): 0.9999711, -0.9795028, 0.5242385, -0.0590133 and eps\'(1+) = 22.9965, t(n) = 11.9719, 8.77574, 2.20528, 0.0434. Theorem: P_1 H ∩ Phat_S H = {0} (g(v) = 2 g(2v) on (1/2, oo) forces xihat = 0); eigenfunctions are lacunary (Zygmund-class, log-singular at 0), which is why dyadic truncations converge like 2^{-N}',
  cuspTheorem: 'per unit log_2(1/eps) at rho = 2^k(1+eps): delta_S ~ 2^{k/2}/2, delta^in ~ 2^{-k/2}/2, delta^out ~ (2^{k/2} - 2^{-k/2})/2 (measured 0.7071/0.3536/0.3536 at k = 1; 1.000/0.250/0.750 at k = 2); corr is continuous through 2 (1.4285, 1.4550, 1.4628 at 1.99/2/2.01); hence eps_S(2(1±eps)) = (1/(2 sqrt2)) log_2(1/eps) + O(1): half the remainder cusp sits in the EXCESS. At rho -> 1: eps_S(1+u) = u[(1/2) log_2(1/u) + 13.62 + o(1)] — CC\'s finite kink eps\'(1+) = 22.9965 becomes a log-kink (E_S o Q = -(1/ln 2) log|D| + bounded on 2a <= ln 2: unbounded below, stronger than CC\'s constant -45.99)',
  obstruction: 'for 2a > ln 2: E_S o Q(k*k^*) = c_2 int |t| cos(t ln2) |khat(t)|^2 dt + (log|D| + bounded), c_2 = 1/(2 sqrt2 ln 2) = 0.51007 (Hadamard finite part of the cusp); for k = cos(t_0 x) phi(x): E_S o Q/||k||^2 = 2 pi c_2 t_0 cos(t_0 ln2) R_phi(ln 2)/||phi||^2 + O(log t_0) -> ±oo linearly along resonances/anti-resonances. Measured half-splits (res - antires)/2 vs prediction: a = 0.5, k = 8/16/32: 55.3/105.9/210.0 vs 51.7/101.8/201.9; (ln3)/2: 74.5/142.5/282.1 vs 69.3/136.6/271.0; a = 0.4 (R = 0.024): 6.0/11.2/23.7 vs 5.8/11.3/22.5; a = 0.3 (2a < ln 2): split 0 ± 1, values -33...-43; archimedean control -45.5...-46.0 = -2 eps\'(1+) throughout. E_S o Q itself > 0 from k = 6 (a = 0.5: +6.3 ... +173.9) and k = 4 ((ln3)/2: +5.2 ... +245.4). Therefore CC Prop 5.5 (E o Q = -2eps\'(1+)(Id - K), K Hilbert–Schmidt) and Lemma 6.3 have no analogue past ln 2 (Q eps_S is the finite part of 1/(x ∓ ln2)^2, not L^1), CC (141) E o Q <= c|ghat(0)|^2 is false for every a > (ln 2)/2 (khat(0) -> 0 on the test functions), no finite-rank correction can repair an operator unbounded above, and the positivity the method drops — Tr(vartheta(Qf) S_S) — is exactly the resonantly growing term. The cusp is forced by the Euler-factor covariance F_S eta(2w) = F_S eta(w) - etahat(w) + etahat(w/2)/2, so the same holds for every S containing a prime',
  weilWindow: 'Q-trick: Weil positivity on pole-free L^2(-a,a) <=> T_a[(t^2+1/4)(2theta\' - m_2)] >= 0; on 2a < 2 ln 2 the symbol is sigma_1 = (t^2+1/4)(2theta\'(t) - sqrt2 ln2 cos(t ln2)): negative on |t| < 3.306 (well, min -5.71 at 2.05) and on the resonance dip (6.945, 10.532) (min -50.7 at 9.11; w_1(t_1) = -0.614), positive and ~t^2 log t beyond; sign of the Q-form lambda_min agrees with the pole-free lambda_min at a = 0.3/0.4/0.5/(ln3)/2. Band decomposition of the pole-free minimizer at (ln3)/2: [0,3.5) -0.009, [3.5,7.4) +0.189, [7.4,10.8) -0.263, [10.8,40) +0.084 (total 5e-4): the binding negativity is the first p = 2 resonance window, not the central well (|hhat_0|^2 peak t = 7.55). Moment ladder at (ln3)/2: 9.5e-4 -> 0.0334 (hhat(0)=0) -> 0.414 (hhat\'(0)=0) -> 0.799 -> 0.814 (saturates). One-prime reach a_2 = 0.565920 (2a_2 = ln 3 + 0.0332; sibling highres map a* = 0.56578): p = 3 arrives with 3% of margin — the window (resolution pi/a = 5.7) can just not resolve the dip of width 3.4 before ln 3',
  verdict: 'the Connes–Consani Sonine refinement extends to S = {oo, 2} exactly and every ingredient is now explicit, but it cannot prove D_S <= L_S past ln 2: the excess inherits half of the p = 2 log cusp and its Q-composite is unbounded above along the Euler-factor resonances for every window longer than ln 2, so the "positive + compact" structure that made the archimedean case a finite computation does not exist semilocally. Weil positivity on 2a <= ln 2 (Yoshida; CC) stays the proved range; ln 2 < 2a < ln 3 remains the open inequality D_S <= L_S with its binding direction in the first resonance window (7.4, 10.8). RH open; NO QED',
  honestLimits: 'the Sonine algebra (CC Prop 4.5, Thm 4.7) is transcribed with F_S self-adjoint unitary and A compact; trace-class subtleties (Sum lam^2 = oo) are handled only through the split eps_S = delta^out + corr whose convergence is proved termwise; the no-modulus-one theorem and the cusp coefficients are elementary and checked to 4 digits; the spectrum is an exact-operator Lanczos computation at two resolutions (not a rigorous enclosure); the resonant unboundedness is an analytic prediction confirmed numerically to 4% over k = 8..32 on smooth test functions (not a formal operator-theoretic proof of the finite-part identity in this normalisation); Galerkin values are N = 32 Rayleigh–Ritz numbers; nothing here moves a Lambda bound or verified height',
});

// ---- assertions
const within = (x, lo, hi) => x >= lo && x <= hi;
const L = SONINE_EXCESS_LITERALS;
export const RH_ROUTE_I_SONINE_EXCESS_PORT_ASSERTIONS = Object.freeze([
  {
    id: 'X0-closed-forms-anchor-route-I',
    description: 'bracketS reproduces the Route I remainder (delta_S(1.3) = 1.754665, delta_S(3) = 0.379224, delta_S(20) = 0.237921 to 1e-5) and delta^in(rho) = rho^{-1/2} br(1/rho) is positive with delta^in(1.5) in [1.53, 1.54] and delta^out(1.5) in [0.01, 0.02]',
    holds: () => Math.abs(deltaSclosed(1.3) - 1.754665) < 1e-5 && Math.abs(deltaSclosed(3) - 0.379224) < 1e-5 && Math.abs(deltaSclosed(20) - 0.237921) < 1e-5
      && within(deltaIn(1.5), 1.53, 1.54) && within(deltaOut(1.5), 0.01, 0.02),
  },
  {
    id: 'X1-cusp-allocation-half-half',
    description: 'at rho = 2(1+2^-j) the increments per doubling of 1/eps (j = 9..13) are delta_S in [0.700, 0.712], delta^in in [0.350, 0.362], delta^out in [0.345, 0.358] (predicted sqrt2/2, 1/(2sqrt2), 1/(2sqrt2)); at rho = 4(1+2^-j) (j = 9..12) delta_S in [0.99, 1.01], delta^in in [0.245, 0.256], delta^out in [0.74, 0.76]',
    holds: () => {
      const ok1 = [9, 10, 11, 12, 13].every((j) => { const r0 = 2 * (1 + Math.pow(2, -j)), r1 = 2 * (1 + Math.pow(2, -j - 1)); const dS = deltaSclosed(r1) - deltaSclosed(r0), dI = deltaIn(r1) - deltaIn(r0); return within(dS, 0.700, 0.712) && within(dI, 0.350, 0.362) && within(dS - dI, 0.345, 0.358); });
      const ok2 = [9, 10, 11, 12].every((j) => { const r0 = 4 * (1 + Math.pow(2, -j)), r1 = 4 * (1 + Math.pow(2, -j - 1)); const dS = deltaSclosed(r1) - deltaSclosed(r0), dI = deltaIn(r1) - deltaIn(r0); return within(dS, 0.99, 1.01) && within(dI, 0.245, 0.256) && within(dS - dI, 0.74, 0.76); });
      return ok1 && ok2 && Math.abs(C2_CUSP - 0.51007) < 1e-4;
    },
  },
  {
    id: 'X2-log-kink-at-rho-1',
    description: 'delta^out(1+u)/(u log_2(1/u)) lies in [0.46, 0.50] for u = 2^-10, 2^-13, 2^-16 and increases toward 1/2 (no finite slope: the CC kink coefficient is replaced by a log-kink)',
    holds: () => { const r = [10, 13, 16].map((j) => { const u = Math.pow(2, -j); return deltaOut(1 + u) / (u * j); }); return r.every((x) => within(x, 0.46, 0.50)) && r[0] < r[1] && r[1] < r[2]; },
  },
  {
    id: 'X3-symbol-landscape-resonance-dip',
    description: 'sigma_1 = (t^2+1/4)(2theta\' - sqrt2 ln2 cos(t ln2)) changes sign at 3.306, 6.945, 10.532 (±0.01), its central well minimum is in [-5.8, -5.6] near t = 2.05, the resonance dip minimum is in [-51.5, -49.5] within 0.1 of t_1 = 2pi/ln2, w_1(t_1) in [-0.62, -0.61]; the full symbol w(t_k) = 2theta\'(t_k) - m_2(t_k) is negative for k = 1..19 and positive at k = 20',
    holds: () => {
      const zeros = []; let prev = sigma1(0); for (let t = 0.001; t <= 12; t += 0.001) { const v = sigma1(t); if ((v > 0) !== (prev > 0)) zeros.push(t); prev = v; }
      let mw = Infinity, aw = 0, md = Infinity, ad = 0; for (let t = 0; t <= 6; t += 0.001) { const v = sigma1(t); if (v < mw) { mw = v; aw = t; } } for (let t = 6; t <= 12; t += 0.001) { const v = sigma1(t); if (v < md) { md = v; ad = t; } }
      const t1 = 2 * PI / LN2; const dips = Array.from({ length: 20 }, (_, i) => twoThetaPrime((i + 1) * t1) - m2((i + 1) * t1));
      return zeros.length === 3 && Math.abs(zeros[0] - 3.306) < 0.01 && Math.abs(zeros[1] - 6.945) < 0.01 && Math.abs(zeros[2] - 10.532) < 0.01
        && within(mw, -5.8, -5.6) && Math.abs(aw - 2.05) < 0.05 && within(md, -51.5, -49.5) && Math.abs(ad - t1) < 0.1 && within(w1(t1), -0.62, -0.61)
        && dips.slice(0, 19).every((d) => d < 0) && dips[19] > 0;
    },
  },
  {
    id: 'X4-moment-ladder-and-Q-trick-N24',
    description: 'N = 24, a = (ln3)/2 - 1e-6: pole-free lambda_min in (0, 3e-3); with hhat(0) = 0 in [0.02, 0.06]; with hhat(0) = hhat\'(0) = 0 in [0.3, 0.6]; with two more moments in [0.6, 1.0]; ladder strictly increasing; the Q-trick form lambda_min at a = 0.5 is positive and the one at a = 0.3 exceeds 1',
    holds: () => { const a = LN3 / 2 - 1e-6; const m = momentLadder(a, 24); return m['m-1'] > 0 && m['m-1'] < 3e-3 && within(m.m0, 0.02, 0.06) && within(m.m1, 0.3, 0.6) && within(m.m2, 0.6, 1.0) && m['m-1'] < m.m0 && m.m0 < m.m1 && m.m1 < m.m2 && qTrickLamMin(0.5, 24) > 0 && qTrickLamMin(0.3, 24) > 1; },
  },
  {
    id: 'X5-one-prime-reach-just-past-ln3',
    description: 'N = 24: the S = {oo, 2} pole-free form (powers of 2 only) is positive at a = 0.55 and negative at a = 0.58, while the full form (with p = 3) stays positive at 0.58: p = 3 arrives with < 0.04 of margin in 2a',
    holds: () => lamP2only(0.55, 24) > 0 && lamP2only(0.58, 24) < 0 && momentLadder(0.58, 24, [-1])['m-1'] > 0 && within(L.oneprimeReach.twoA2 - LN3, 0.02, 0.04) && Math.abs(L.oneprimeReach.a2 - L.oneprimeReach.siblingAStar) < 3e-4,
  },
  {
    id: 'X6-baked-spectrum-consistency',
    description: 'baked exact semilocal spectrum: |lam_S(0)| < 1 with 1 - lam^2 = 5.38e-5 (matching the baked oneMinusLam0sq to 1%), the archimedean control matches CC (68) to 3e-4, the dyadic ladder shows >= 3 eigenvalues within 1e-3 of 1/4 and >= 3 within 1e-3 of 2^-5/2, and sum lam^2 (top 24) > delta_S(1) archimedean 2.2375 (the semilocal box holds more)',
    holds: () => {
      const s = L.semilocal.lam; const near = (v, tol) => s.filter((x) => Math.abs(Math.abs(x) - v) < tol).length;
      const arch = L.arch.lam.every((x, i) => Math.abs(x - L.arch.cc[i]) < 3e-4);
      return Math.abs(s[0]) < 1 && Math.abs((1 - s[0] * s[0]) / L.semilocal.oneMinusLam0sq - 1) < 0.01 && arch && near(0.25, 1e-3) >= 3 && near(Math.pow(2, -2.5), 1e-3) >= 3 && s.reduce((t, x) => t + x * x, 0) > 2.2375;
    },
  },
  {
    id: 'X7-resonant-unboundedness-matches-prediction',
    description: 'baked resonance test: the half-split (res - antires)/2 of E_S o Q/||k||^2 equals 2pi c_2 t_k R_phi/||phi||^2 within 10% for k = 8, 16, 32 at a = 0.4, 0.5, (ln3)/2 with R_phi recomputed here (plateauAutocorr within 3% of the baked R), grows monotonically in k, is |split| < 1.5 at a = 0.3, and the archimedean control stays within 0.6 of -2 eps\'(1+) = -45.99',
    holds: () => {
      const rs = L.resonanceSplit; const c2 = C2_CUSP;
      const chk = (key, a) => { const R = plateauAutocorr(a); if (Math.abs(R / rs[key].R - 1) > 0.03) return false; let prevSplit = -Infinity; return rs[key].rows.every(([k, t, res, anti, split, pred]) => { const p = 2 * PI * c2 * (t + PI / LN2) * R; const ok = Math.abs(split / p - 1) < 0.10 && Math.abs(pred / p - 1) < 0.03 && split > prevSplit && Math.abs((res - anti) / 2 - split) < 0.02; prevSplit = split; return ok; }); };
      return chk('a040', 0.4) && chk('a050', 0.5) && chk('aLn3Half', LN3 / 2) && rs.a030.rows.every((r) => Math.abs(r[4]) < 1.5) && [...rs.archControl.k8, ...rs.archControl.k32].every((v) => Math.abs(v + 45.99) < 0.6)
        && rs.a050.rows.every((r) => r[2] > 0) && rs.aLn3Half.rows.every((r) => r[2] > 0);
    },
  },
  {
    id: 'X8-positivity-onset-across-a',
    description: 'across (ln2)/2 < a < (ln3)/2 the resonance autocorrelation R_phi(a) = plateauAutocorr(a) is 0 at the threshold, strictly positive and strictly increasing on the grid, and the half-split slope 2 pi c_2 R_phi (2 pi/ln 2) grows monotonically 0 -> 8.4/k; since R_phi(a) > 0 for every a past (ln2)/2 the half-split is unbounded in k, so E_S o Q is unbounded above (CC condition fails for every a > (ln2)/2) and the first-positive resonance k decreases in a (baked 6 at a = 0.5 to 4 at (ln3)/2)',
    holds: () => {
      const po = L.positivityOnset; const c2 = C2_CUSP;
      if (!(plateauAutocorr(po.thresholdA) < 1e-4)) return false;
      let prevR = -1, prevSlope = -1, ok = true;
      for (const [a, , Rb, slb] of po.grid) {
        const R = plateauAutocorr(a); const sl = 2 * PI * c2 * R * (2 * PI / LN2);
        if (Math.abs(R - Rb) > 1e-4) ok = false;
        if (Math.abs(sl - slb) > 0.02 + 0.02 * Math.abs(slb)) ok = false;
        if (a > 0.37 && !(R > 0)) ok = false;
        if (!(R > prevR) || !(sl >= prevSlope)) ok = false;
        prevR = R; prevSlope = sl;
      }
      return ok && L.resonanceSplit.firstPositiveK.a050 > L.resonanceSplit.firstPositiveK.aLn3Half;
    },
  },
  {
    id: 'verdict-honesty',
    description: 'status says RH open / NO QED / no positivity past ln 2 proved, names the obstruction (unbounded above along the p = 2 resonances) and the sibling module, and honestLimits disclaims rigorous enclosure',
    holds: () => /RH open/.test(RH_ROUTE_I_SONINE_EXCESS_PORT.status) && /NO QED/.test(RH_ROUTE_I_SONINE_EXCESS_PORT.status) && /No positivity past ln 2 proved/.test(RH_ROUTE_I_SONINE_EXCESS_PORT.status)
      && /unbounded above/.test(RH_ROUTE_I_SONINE_EXCESS_PORT.obstruction) && /not a rigorous enclosure/.test(RH_ROUTE_I_SONINE_EXCESS_PORT.honestLimits) && RH_ROUTE_I_SONINE_EXCESS_PORT.parents.some((p) => /pencil-highres/.test(p)),
  },
]);

export default RH_ROUTE_I_SONINE_EXCESS_PORT;
