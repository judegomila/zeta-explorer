/**
 * imp-95520 (deepening of the OBJECTIVE verdict): LEMMA ARCH-NATIVE + THEOREM
 * PICK-WEIL + COROLLARY LAGARIAS-PICK + the finite-truncation Gram/inertia
 * computation the objective asked for, on three test classes. Companion to
 * imp-95520-weil-positivity-pencil-port-verdict.js (which recorded the
 * structural port without matrices); this module does the port with the
 * actual Weil form, computes the truncated matrices, their inertia, the
 * one-sided-bound gap, and the off-line detection power of each class, and
 * re-issues the verdict on that evidence. RH OPEN; no refereed bound is changed;
 * NO QED.
 *
 * OBJECT (Weil/Guinand explicit formula, Iwaniec-Kowalski normalization).
 * For real f with fhat(r) = int f(u) e^{iru} du and g = f * f~ (so
 * h(r) = ghat(r) = fhat(r) conj fhat(conj r), h = |fhat|^2 on the real line):
 *   W(f) := sum_rho h(gamma_rho)      (rho = 1/2 + i gamma_rho, all zeros)
 *         = 2 fhat(i/2) fhat(-i/2)                              [pole]
 *           + (1/2pi) int |fhat(r)|^2 [Re psi(1/4 + ir/2) - ln pi] dr   [arch]
 *           - sum_n Lambda(n) n^{-1/2} [g(ln n) + g(-ln n)]      [prime].
 * Weil: RH <=> W(f) >= 0 for every admissible f. The pole term is the rank-2
 * form alpha_i beta_j + alpha_j beta_i with alpha = fhat(i/2), beta =
 * fhat(-i/2): INDEFINITE for non-even f. The prime side is a signed sum of
 * shifts S_{+-ln n}. Both are what the objective proposed to bound with the
 * seam-pencil machinery (SGN-C / COAL-N / NP-CERT / TILT-DET / LEMMA TOEP).
 *
 * CLASS I -- the machinery's NATIVE span E_V = span{ e^{-nu_i t} 1_{t>0} },
 * rates nu_i > 1/2 (the explicit formula needs h analytic in |Im r| < 1/2 +
 * eps; e^{-nu t} has fhat = 1/(nu - ir), poles at +-i nu, so nu > 1/2 is the
 * admissibility line; the borderline nu = 1/2 makes BOTH the pole term and
 * the prime sum diverge logarithmically). Write s_i = 1/2 + nu_i > 1.
 *  - ||f||^2 = a^T G a, G_ij = 1/(nu_i + nu_j): the chain's Cauchy Gram.
 *  - pole_ij = 1/(s_i (s_j - 1)) + 1/(s_j (s_i - 1)).
 *  - g_ij(v) = e^{-nu_i v} G_ij (v > 0), e^{-nu_j |v|} G_ij (v < 0), so
 *    prime_ij = (Z_i + Z_j) G_ij with Z_i = -zeta'/zeta(s_i) = sum Lambda(n)
 *    n^{-s_i} (absolutely convergent). The prime side on the native span is
 *    the Jordan product Z G + G Z of the Cauchy Gram with the diagonal of
 *    log-derivative values -- the whole prime configuration enters ONLY through
 *    the n scalars -zeta'/zeta(s_i).
 * LEMMA ARCH-NATIVE. arch_ij = (1/2)[psi(s_i/2) + psi(s_j/2)] G_ij - ln(pi) G_ij.
 * Proof: on Re s = 1/2, Re psi(s/2) = [psi(s/2) + psi((1-s)/2)]/2 and
 * fhat_i conj fhat_j = 1/((s_i - s)(s_j - 1 + s)); close the psi(s/2) half to
 * the right (pole at s = s_i) and the psi((1-s)/2) half to the left (pole at
 * s = 1 - s_j); the kernel is O(|s|^-2) and psi is O(log|s|), so the arcs
 * vanish; the ln(pi) part is Plancherel. Verified: direct r-integral vs closed
 * form, rel 1.5e-8 / 1.2e-8 / 7.3e-9 / 9.1e-9 at nu = (0.7,0.7), (0.6,1.3),
 * (1,4), (2.5,0.55) (Simpson-limited).
 * THEOREM PICK-WEIL. On E_V,
 *   W_ij = [ xi'/xi(s_i) + xi'/xi(s_j) ] / (s_i + s_j - 1),
 * xi(s) = (1/2) s (s-1) pi^{-s/2} Gamma(s/2) zeta(s). Proof: pole + arch -
 * prime is termwise the log-derivative 1/s + 1/(s-1) - (ln pi)/2 + psi(s/2)/2
 * + zeta'/zeta(s), symmetrized over (i, j) with the common factor G_ij; the
 * pole identity 1/(s_i(s_j-1)) + 1/(s_j(s_i-1)) = [1/s_i + 1/(s_i-1) + 1/s_j +
 * 1/(s_j-1)]/(s_i+s_j-1) is a two-line check. Numerically |W - Pick| <=
 * 2.4e-15 (algebraic) and |W - zero side| <= 6.8e-7 (869 zeros + density
 * tail; the residual is the tail approximation). READING: the explicit
 * formula on the native span is the log-derivative of the functional-equation
 * factorization of xi at real s > 1 -- an identity between absolutely
 * convergent objects that exchanges NO zero-location information. The right
 * side is the Nevanlinna-Pick kernel of the CARATHEODORY class on the half
 * plane Re s > 1/2 (kernel (phi(z) + conj phi(w))/(z + conj w - 1)) evaluated
 * at the real nodes s_i with data phi = xi'/xi. The chain's own LEMMA PICK-ID
 * (imp-95226) is the SCHUR-class Pick matrix rho^2 G - D G D of the same half
 * plane; the two are Cayley transforms of each other. So the port lands
 * exactly on the interpolation formalism the chain already uses -- with the
 * interpolation DATA xi'/xi(s_i) being the unknown.
 * COROLLARY LAGARIAS-PICK. RH <=> for every n and every real s_1..s_n > 1 the
 * matrix [(xi'/xi(s_i) + xi'/xi(s_j))/(s_i + s_j - 1)] is PSD. (=>: under RH
 * it is the Gram of (1/(s_i - rho))_rho. <=: Pick's theorem gives, for each
 * finite node set, a Caratheodory interpolant on Re s > 1/2; along an
 * exhausting sequence of node sets a normal-families limit F is
 * Caratheodory and equals xi'/xi on (1, inf), hence on Re s > 1/2 minus the
 * poles of xi'/xi by the identity theorem; F is analytic, so xi'/xi has no
 * pole in Re s > 1/2, i.e. no zero of zeta with Re rho > 1/2, i.e. RH.) This
 * is Lagarias (1999, Acta Arith. 89: RH <=> Re xi'/xi(s) > 0 for Re s > 1/2)
 * in Pick-matrix form; NOT claimed new -- it is a corollary of Lagarias plus
 * Pick. Each entry uses only xi'/xi at real points > 1 (primes enter through
 * the absolutely convergent -zeta'/zeta(s_i)); the unconditional real-axis
 * positivity xi'/xi(s) > 0 for s > 1 (values 0.0254 / 0.0323 / 0.0461 /
 * 0.0691 / 0.1144 / 0.2017 / 0.3911 at s = 1.05 / 1.2 / 1.5 / 2 / 3 / 5 / 10)
 * is the n = 1 case and says nothing about RH.
 *
 * MEASURED, CLASS I (generalized eigenvalues in the G-metric = Rayleigh
 * quotient over ||f||^2; geometric rate lattices nu_0 rho^k; double precision
 * -- the imp-95225 float trap applies: for tight lattices (rho <= 1.3, m >= 12)
 * Cholesky on the Cauchy Gram fabricates lam_min ~ -4e-6 on an exactly-PSD
 * Gram, so only well-conditioned sets are read):
 *   nu0=1, rho=2, m=8:  lam_min(W;G) = 7.27e-8, lam_max = 4.02; inertia W 0-/8+,
 *      prime 4-/4+, pole 1-/6 0/1+, arch 3-/5+, pole+arch 2-/6+;
 *      lam_min(pole+arch;G) = -4.84, lam_max(prime;G) = +9.45:
 *      lam_min(A) - lam_max(P) = -14.3 vs true lam_min(W;G) = 7.3e-8
 *      (one-sided gap factor lam_max(P)/lam_min(W) = 1.3e8).
 *   nu0=0.6, rho=2, m=6: lam_min(A)-lam_max(P) = -115.9, factor 5.9e10.
 *   nu0=3, rho=2, m=8:   lam_min(A)-lam_max(P) = -1.17,  factor 1.1e3.
 *   Every piece (pole, arch, prime, pole+arch) is indefinite on every lattice;
 *   only the total is PSD. A bound of the form "arch + pole >= sup prime"
 *   (what SGN-C / COAL-N / NP-CERT / TILT-DET deliver: operator-norm-type
 *   bounds on signed shift combinations, uniform over amplitudes) is false by
 *   3 to 16 orders of magnitude on every configuration tested.
 *   Finite-prime truncation: with the prime sum cut at n <= X the entry error
 *   is ~ X^{1-s}/(s-1); equating it to the single-node Weil margin
 *   W_11/G_11 = 2 xi'/xi(s) gives X ~ 1.9e3 (nu = 1), 1.8e8 (0.75),
 *   3.7e25 (0.6), 8e57 (0.55), overflow (0.51): the finite prime data
 *   resolve the Weil sign only for rates bounded away from the admissibility
 *   line nu = 1/2, and the nodes near the line are exactly where a
 *   Caratheodory-type criterion carries its content.
 *   Off-line detection: replacing the FIRST zero pair (gamma_1 = 14.13) by the
 *   quadruple {beta +- i gamma_1, 1-beta +- i gamma_1} leaves every
 *   well-conditioned real-node Pick matrix PSD for beta = 0.6, 0.75, 0.9,
 *   0.99 (nodes [1,2,4]: 3.16e-5 -> 4.83e-5 at beta = 0.99; [1,2,4,8]:
 *   2.33e-6 -> 2.64e-6; [0.6,1.8,5.4,16.2]: 5.01e-6 -> 6.10e-6; [0.55,1,3,10]:
 *   2.66e-7 -> 3.04e-7) -- lam_min RISES. Rational h = |sum a_i/(nu_i - ir)|^2
 *   with a handful of poles cannot weight one zero against hundreds; the
 *   native class is Weil-blind at finite node count even to a gross
 *   low-height violation.
 *   Dilation invariance: the Weil shifts S_{ln n} act on E_V by nu -> n nu, so
 *   the smallest shift-closed rate set is nu * N -- Muntz-complete (sum 1/n
 *   diverges), hence not a Riesz sequence: normalized Gram 2 sqrt(nm)/(n+m)
 *   has lam_min 4.9e-6 / 2.9e-13 / <1e-15 at N = 5 / 10 / 20, versus the
 *   geometric lattice's m-uniform floor A_lat(2) = 2.37e-5 (imp-95252
 *   RZ-LAT). The trace-class / compression structure of imp-95509 (which
 *   consumes the Riesz floor) is unavailable on any prime-shift-invariant
 *   rate set.
 *
 * CLASS II -- compact support L^2(-T, T), piecewise-linear hats (half-width
 * delta = 0.05; n = 2T/delta - 1 interior nodes). Here the prime side is
 * EXACTLY finite (n <= e^{2T}: 1 / 2 / 4 / 7 / 20 / 54 / 148 / 403 prime
 * powers at T = 0.3 / 0.5 / 0.75 / 1 / 1.5 / 2 / 2.5 / 3), the pole term is
 * the Toeplitz rank-2 form 2 kappa^2 cosh((t_i - t_j)/2), kappa = 16
 * sinh^2(delta/4)/delta, the arch term is a Toeplitz lag table from one psi
 * grid, and g_ij is the cubic B-spline. W_T = pole + arch - prime agrees with
 * the zero side sum_gamma 2 cos(gamma Delta) 16 sin^4(gamma delta/2)/(delta^2
 * gamma^4) (869 zeros) to 6.9e-7 at every T (zero-tail-limited), and the
 * omitted arch quadrature tail (|r| > 4000) is a POSITIVE form, so the
 * computed lam_min(W_T;B) are lower bounds. Rayleigh minima over ||f||^2:
 *   T:            0.3      0.5      0.75     1        1.5      2        2.5      3
 *   lam_min(W_T): 1.01e-2  1.68e-5  2.93e-6  9.47e-7  2.02e-7  6.84e-8  2.75e-8  6.4e-9
 *   lam_max(W_T): 2.29     2.64     3.11     3.53     4.04     5.26     6.10     7.09
 *   prime inertia: 0 (empty) then ~half/half (6-/6+, 15-/14+, 20-/19+, ...,
 *      39-/80+); pole+arch inertia 2- .. 11- ; W_T inertia all +.
 *   lam_min(pole+arch) - lam_max(prime): +0.0101 (T=0.3, no primes), -0.79,
 *      -1.97, -3.12, -6.79, -12.7, -22.4, -38.2; factor lam_max(P)/lam_min(W)
 *      = 2.9e4 (T=0.5) rising to 3.5e9 (T=3).
 *   The minimizing eigenvector has ZERO sign changes at every T: the extremal
 *   test function is a one-signed low-pass bump whose fhat sits below
 *   gamma_1 = 14.13, so W(f_min) ~ 2|fhat(gamma_1)|^2 decays like ~e^{-2.5 T}.
 *   Finite-T Weil positivity is governed by the central gap (-gamma_1,
 *   gamma_1) of the zero measure; this is the LEMMA TOEP / Szegoe ceiling
 *   (lam_min(W_T) -> inf of the symbol = 0) realized concretely. The three
 *   pieces for f_min are each O(1) (pole ~ +, arch ~ -5.37 |fhat(0)|^2/2pi,
 *   prime ~ +) and cancel to e^{-2.5T}: Weil positivity at finite T is a
 *   near-exact cancellation of the ACTUAL configuration, not a margin.
 *   Values below ~1e-6 sit at the arch-quadrature floor (positive, magnitude
 *   not resolved to better than ~1e-6 absolute); the decay from 1e-2 (T=0.3)
 *   to 1e-6 (T=1) is robust.
 *   Off-line detection (zero-side form, first pair -> quadruple): T=0.5:
 *   beta 0.6 -> 1.09e-5 (still PSD), 0.75 -> -3.10e-4, 0.9 -> -1.34e-3;
 *   T=1: 0.6 -> -1.02e-2, 0.75 -> -7.70e-2; T=2: 0.6 -> -1.05e-1; T=3:
 *   0.6 -> -3.64e-1. Compact support has finite-T teeth against LOW-height
 *   violations -- exactly those already excluded by verified zeros (PT height
 *   ~3e12). A zero at height H off the line perturbs W_T by O(e^{T}/H^4) on
 *   this basis: for T fixed, W_T >= 0 is a CONSEQUENCE of the verified height,
 *   and no finite T yields a T-uniform statement.
 *
 * CLASS III -- the Mellin/Hardy class F = x e^{-nu x} (the chain's confluent
 * generators read in the multiplicative variable): fhat(r) = Gamma(3/2 + ir)
 * nu^{-3/2 - ir}, |Gamma(3/2 + i gamma)|^2 = pi (1/4 + gamma^2)/cosh(pi gamma)
 * = 6.52e-17 at gamma_1. The zero side is ~1e-16 while pole, arch, prime are
 * O(1) and the omitted prime tail beyond X is ~ 2 (nu_1^-3 + nu_2^-3)/X:
 * tail/zero-side = 5e13 / 5e10 / 5e7 at X = 1e3 / 1e6 / 1e9. On this class
 * the truncated form is positive by the TAIL's margin, not by Weil
 * positivity. Any test class built from functions analytic in a half plane
 * (the Hardy/Laplace currency) has Mellin transforms decaying like
 * e^{-pi|r|/2}, i.e. is the class on which the Weil form is exponentially
 * close to zero.
 *
 * ANSWERS TO THE OBJECTIVE'S TWO QUESTIONS.
 *  (a) NO-PF (imp-95511: every eigenfunction of the PSD mean-time compression
 *      oscillates, zeros accumulating at 0+) is NOT the indefiniteness of the
 *      truncated Weil form. The truncated Weil form W_T is PSD at every T
 *      computed (its PRIME-ONLY piece is indefinite, trivially: hollow
 *      diagonal when 2 delta < ln 2, trace 0); and the finite Weil extremal
 *      has the OPPOSITE sign structure -- zero sign changes -- to NO-PF's
 *      infinitely oscillating extremals. Different operators, different
 *      statements, opposite sign behaviour.
 *  (b) SGN-C / COAL-N / NP-CERT / TILT-DET give one-sided (sup over
 *      amplitude) bounds on ||S_d|_{E_V}||; ported, they bound the prime side
 *      by 2 sum_n Lambda(n) n^{-1/2} sqrt(Lambda(V, ln n)) <= collar * 2
 *      (-zeta'/zeta)(1/2 + nu) -- i.e. by lam_max(prime;G) times a collar >= 1.
 *      Measured lam_min(pole+arch) - lam_max(prime) is NEGATIVE on every
 *      configuration (-1.2 to -1673 on the native span, -0.8 to -38 on compact
 *      support) while the true lam_min(W) is +7e-8 .. +1e-2: the one-sided
 *      estimate is nontrivial but has the WRONG SIGN by 3-16 orders of
 *      magnitude. Not inert in the sense of "gives nothing" -- it gives a
 *      true bound that is useless for positivity.
 *
 * VERDICT. (iii) on the native span: the port COLLAPSES to a known object --
 * the Weil form on E_V is the Caratheodory-class Pick matrix of xi'/xi at
 * real nodes, its positivity for all node sets is Lagarias' criterion, and
 * the explicit formula there is the log-derivative of the xi factorization
 * (no zero information). (ii) on compact support: a genuine finite-T
 * structure -- W_T is PSD with lam_min governed by the central zero gap and
 * decaying ~e^{-2.5T}; each finite T is a consequence of verified zeros; the
 * finite -> infinite step requires a T-uniform lower bound, and the Szegoe
 * ceiling forces that bound to 0, so it is exactly RH with no slack. (i)
 * there is NO new finite-truncation positivity estimate: the machinery's
 * certificates are sup bounds over the amplitude/configuration cone; Weil
 * positivity is the sign of the difference of two O(1)-O(10^3) forms that
 * cancel to e^{-2.5T} (compact support) or e^{-pi gamma_1} (Hardy class) at
 * the actual prime configuration. This is the flow-blindness pattern in the
 * Weil currency, now quantified. Named obstruction: any certificate usable
 * here must be configuration-EXACT (evaluate the actual signed prime sum
 * against the actual archimedean form on the same test function), which is
 * the explicit formula itself; the pencil chain has no such object and its
 * design (uniformity over coalescence / amplitude) is the opposite
 * requirement. Not PCC-gated, but walled by exactness. Recommendation: do
 * not re-aim the seam-pencil certificates at Weil positivity; the only
 * pencil-adjacent live question is the Lagarias-Pick interpolation problem
 * (exhibit a Caratheodory interpolant of the data xi'/xi(s_i) not equal to
 * xi'/xi), which for finite node sets is settled by the verified height and
 * for all node sets is RH.
 *
 * Import-free; heavy cross-checks (869-zero side, hat-basis grid, detection
 * scans) ran in tmp/imp-95520-native-span.mjs, tmp/imp-95520-hat-basis.mjs,
 * tmp/imp-95520-detect*.mjs and are baked as literals; the assertions below
 * recompute the algebraic identities, LEMMA ARCH-NATIVE, the class-I inertia
 * / one-sided gap on one lattice, the class-II prime-free T = 0.3 rung and
 * the T = 0.5 one-sided gap, the truncation law, the Gamma decay, and the
 * Muntz non-Riesz fact. Changes no Lambda bound; NO QED.
 */

const LNPI = Math.log(Math.PI);
const B2K = [1 / 6, -1 / 30, 1 / 42, -1 / 30, 5 / 66, -691 / 2730, 7 / 6];

// ---- complex helpers + digamma
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
const digammaR = (x) => digammaC([x, 0])[0];

// zeta, zeta' at real s > 1 (Euler-Maclaurin, N = 60, 7 Bernoulli terms)
function zetaAndDeriv(s) {
  const N = 60; let z = 0, dz = 0;
  for (let n = 1; n < N; n++) { const t = Math.pow(n, -s); z += t; dz -= Math.log(n) * t; }
  const lnN = Math.log(N), N1s = Math.pow(N, 1 - s);
  z += N1s / (s - 1) + 0.5 * Math.pow(N, -s);
  dz += -lnN * N1s / (s - 1) - N1s / ((s - 1) * (s - 1)) - 0.5 * lnN * Math.pow(N, -s);
  let fact = 1;
  for (let k = 1; k <= 7; k++) {
    fact *= (2 * k - 1) * (2 * k);
    let P = 1, dlogP = 0;
    for (let j = 0; j <= 2 * k - 2; j++) { P *= (s + j); dlogP += 1 / (s + j); }
    const term = (B2K[k - 1] / fact) * P * Math.pow(N, -s - 2 * k + 1);
    z += term; dz += term * (dlogP - lnN);
  }
  return { z, dz };
}
export const zetaLogDeriv = (s) => { const { z, dz } = zetaAndDeriv(s); return dz / z; };
export const xiLogDeriv = (s) => 1 / s + 1 / (s - 1) - 0.5 * LNPI + 0.5 * digammaR(s / 2) + zetaLogDeriv(s);

// ---- linear algebra (Jacobi, Cholesky pencil)
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
    if (i === j) { if (s <= 0) throw new Error('imp-95520 chol: metric not PD'); L[i][i] = Math.sqrt(s); } else L[i][j] = s / L[j][j];
  }
  return L;
}
function fwd(L, b) { const n = L.length, x = b.slice(); for (let i = 0; i < n; i++) { for (let k = 0; k < i; k++) x[i] -= L[i][k] * x[k]; x[i] /= L[i][i]; } return x; }
export function pencilEig(A, B) {
  const L = chol(B); const n = A.length;
  const Y = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let j = 0; j < n; j++) { const y = fwd(L, A.map((r) => r[j])); for (let i = 0; i < n; i++) Y[i][j] = y[i]; }
  const C = Array.from({ length: n }, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++) { const y = fwd(L, Y[i].slice()); for (let j = 0; j < n; j++) C[i][j] = y[j]; }
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) C[i][j] = (C[i][j] + C[j][i]) / 2;
  return jacobiVals(C);
}
const inertia = (vals, tol) => ({ neg: vals.filter((v) => v < -tol).length, zero: vals.filter((v) => Math.abs(v) <= tol).length, pos: vals.filter((v) => v > tol).length });

// ---- CLASS I: Weil form pieces on the native span
export function weilNativeSpan(nus) {
  const s = nus.map((v) => v + 0.5);
  const G = nus.map((a) => nus.map((b) => 1 / (a + b)));
  const pole = s.map((si) => s.map((sj) => 1 / (si * (sj - 1)) + 1 / (sj * (si - 1))));
  const psi = s.map((si) => digammaR(si / 2));
  const arch = G.map((row, i) => row.map((g, j) => (0.5 * (psi[i] + psi[j]) - LNPI) * g));
  const Z = s.map((si) => -zetaLogDeriv(si));
  const prime = G.map((row, i) => row.map((g, j) => (Z[i] + Z[j]) * g));
  const Xi = s.map((si) => xiLogDeriv(si));
  const pick = G.map((row, i) => row.map((g, j) => (Xi[i] + Xi[j]) * g));
  const W = G.map((row, i) => row.map((_, j) => pole[i][j] + arch[i][j] - prime[i][j]));
  return { s, G, pole, arch, prime, pick, W, Z, Xi };
}
// direct r-integral of the archimedean term for two native generators (log-spaced Simpson)
function archNativeDirect(ni, nj, K = 60000) {
  const u0 = Math.log(1e-8), u1 = Math.log(1e9), du = (u1 - u0) / K; let acc = 0;
  for (let k = 0; k <= K; k++) {
    const u = u0 + k * du, r = Math.exp(u), w = (k === 0 || k === K) ? 1 : (k % 2 ? 4 : 2);
    const re = (ni * nj + r * r) / ((ni ** 2 + r * r) * (nj ** 2 + r * r));
    acc += w * re * (digammaC([0.25, r / 2])[0] - LNPI) * r * du / 3;
  }
  return 2 * acc / (2 * Math.PI);
}

// ---- CLASS II: compact support, hat basis
function hatAuto(w, delta) { const x = Math.abs(w) / delta; if (x >= 2) return 0; if (x <= 1) return delta * (2 / 3 - x * x + x * x * x / 2); return delta * (2 - x) ** 3 / 6; }
function vonMangoldt(N) {
  const L = new Float64Array(N + 1), spf = new Int32Array(N + 1);
  for (let n = 2; n <= N; n++) { if (!spf[n]) { spf[n] = n; for (let k = 2 * n; k <= N; k += n) if (!spf[k]) spf[k] = n; } let m = n; const p = spf[n]; while (m % p === 0) m = Math.floor(m / p); if (m === 1) L[n] = Math.log(p); }
  return L;
}
export function weilHatBasis(T, delta, R = 2000, h = 0.005) {
  const n = Math.round(2 * T / delta) - 1;
  const t = Array.from({ length: n }, (_, i) => -T + (i + 1) * delta);
  const K = Math.round(R / h);
  const psi = new Float64Array(K + 1), kern = new Float64Array(K + 1);
  for (let k = 0; k <= K; k++) {
    const r = k * h; psi[k] = digammaC([0.25, r / 2])[0] - LNPI;
    const sn = Math.sin(r * delta / 2); kern[k] = k === 0 ? delta * delta : 16 * sn ** 4 / (delta * delta * r ** 4);
  }
  const lags = new Array(n).fill(0);
  for (let m = 0; m < n; m++) {
    const D = m * delta; let acc = 0;
    for (let k = 0; k <= K; k++) { const w = (k === 0 || k === K) ? 1 : (k % 2 ? 4 : 2); acc += w * Math.cos(k * h * D) * kern[k] * psi[k]; }
    lags[m] = (acc * h / 3) / Math.PI;
  }
  const kappa = 16 * Math.sinh(delta / 4) ** 2 / delta;
  const Lam = vonMangoldt(Math.ceil(Math.exp(2 * T + 2 * delta)) + 2);
  const B = t.map((a) => t.map((b) => hatAuto(a - b, delta)));
  const pole = t.map((a) => t.map((b) => 2 * kappa * kappa * Math.cosh((a - b) / 2)));
  const arch = t.map((_, i) => t.map((__, j) => lags[Math.abs(i - j)]));
  const prime = t.map((a) => t.map((b) => {
    const D = a - b; let acc = 0;
    for (let m = 2; m < Lam.length; m++) { if (!Lam[m]) continue; const ln = Math.log(m); const c = hatAuto(ln - D, delta) + hatAuto(-ln - D, delta); if (c) acc += Lam[m] * Math.pow(m, -0.5) * c; }
    return acc;
  }));
  const A = pole.map((r, i) => r.map((v, j) => v + arch[i][j]));
  const W = A.map((r, i) => r.map((v, j) => v - prime[i][j]));
  return { n, t, B, pole, arch, prime, A, W };
}

// ---- baked literals (from the tmp scripts; recomputed where cheap)
export const IMP95520_WEIL_PICK_LITERALS = Object.freeze({
  xiLogDerivAt2: 0.06906623,
  xiLogDerivAt3: 0.1143907,
  archNativeRelErr: 1.5e-8,
  pickAlgebraicMaxErr: 2.4e-15,
  zeroSideMaxErrNative: 6.8e-7,
  zeroSideMaxErrHat: 6.9e-7,
  nativeLattice_nu1_rho2_m8: { lamMinW: 7.266e-8, lamMaxW: 4.020, lamMinA: -4.836, lamMaxP: 9.446, oneSidedGapFactor: 1.3e8 },
  truncationX: { nu1: 1.88e3, nu075: 1.78e8, nu06: 3.75e25, nu055: 8.37e57 },
  gamma1: 14.134725142,
  gammaWeightAtGamma1: 6.519e-17,
  hatTable: {
    T: [0.3, 0.5, 0.75, 1, 1.5, 2, 2.5, 3],
    lamMinW: [1.01113e-2, 1.67935e-5, 2.92826e-6, 9.47402e-7, 2.0235e-7, 6.84425e-8, 2.74524e-8, 6.40597e-9],
    lamMaxW: [2.28659, 2.64419, 3.11057, 3.52835, 4.0431, 5.25774, 6.10085, 7.08559],
    lamMinAminusLamMaxP: [0.0101113, -0.787684, -1.97089, -3.12196, -6.7933, -12.7277, -22.3839, -38.1805],
    signChangesMinVec: [0, 0, 0, 0, 0, 0, 0, 0],
  },
  detectionHat: { T1_beta06: -1.017e-2, T1_beta075: -7.704e-2, T05_beta06: 1.092e-5, T05_beta075: -3.101e-4 },
  detectionNative_nodes1248: { onLine: 2.327e-6, beta06: 2.838e-6, beta099: 2.642e-6 },
  muntzGramLamMin: { N5: 4.939e-6, N10: 2.943e-13 },
  aLat2: 2.374484801079e-5,
});

export const IMP95520_WEIL_PICK_IDENTITY_FINITE_TRUNCATION = Object.freeze({
  id: 'imp-95520-weil-pick-identity-finite-truncation',
  ticket: 'imp-95520 (OBJECTIVE deepening): Weil explicit-formula quadratic form on the pencil machinery test classes -- the actual truncated matrices, their inertia, and the verdict',
  lemmaArchNative: 'On E_V = span{e^{-nu t} 1_{t>0}}, nu > 1/2: (1/2pi) int Re[fhat_i conj fhat_j] Re psi(1/4+ir/2) dr = (1/2)[psi(s_i/2)+psi(s_j/2)]/(nu_i+nu_j), s = 1/2+nu (contour: close psi(s/2) right, psi((1-s)/2) left). Verified rel 1e-8.',
  theoremPickWeil: 'On E_V the Weil form is W_ij = [xi\'/xi(s_i) + xi\'/xi(s_j)]/(s_i+s_j-1) exactly: pole + arch - prime is the log-derivative of xi(s) = (1/2)s(s-1)pi^{-s/2}Gamma(s/2)zeta(s) at real s > 1. It is the Caratheodory-class Nevanlinna-Pick kernel of xi\'/xi on Re s > 1/2 at real nodes (Cayley transform of the chain\'s Schur-class LEMMA PICK-ID). The explicit formula on the native span exchanges no zero information.',
  corollaryLagariasPick: 'RH <=> every finite real-node Pick matrix [(xi\'/xi(s_i)+xi\'/xi(s_j))/(s_i+s_j-1)], s_i > 1, is PSD (Pick + normal families + identity theorem). This is Lagarias (1999) in Pick form; not claimed new.',
  classI: 'native span: every piece indefinite, total PSD; lam_min(pole+arch) - lam_max(prime) negative by 3-16 orders of magnitude relative to the true lam_min(W); finite-prime truncation resolves the sign only for nu bounded away from 1/2 (X ~ 1.9e3 at nu=1, 3.7e25 at nu=0.6); Weil-BLIND to the first zero at beta=0.99 for every well-conditioned node set; prime-shift-invariant rate sets are Muntz-complete (no Riesz floor, no trace-class compression).',
  classII: 'compact support [-T,T]: prime side exactly finite; W_T PSD at all T computed, lam_min 1.0e-2 (T=0.3) -> 9.5e-7 (T=1) -> 6e-9 (T=3) with a one-signed low-pass extremal (0 sign changes) probing the central gap (-gamma_1, gamma_1): the Szegoe ceiling lam_min -> 0 realized; one-sided gap -0.8 .. -38; detects the first zero at beta=0.6 for T >= 1 (already excluded by verified height).',
  classIII: 'Mellin/Hardy class x e^{-nu x}: zero side ~ |Gamma(3/2+i gamma_1)|^2 = 6.5e-17 while pole/arch/prime are O(1) and the prime tail beyond X is ~1/X: truncated positivity comes from the tail, not from Weil.',
  answerA: 'NO: NO-PF is a statement about eigenfunctions of a PSD operator; the truncated Weil form is PSD (its prime-only piece is trivially indefinite: hollow diagonal, trace 0) and its extremal is one-signed -- the opposite sign structure.',
  answerB: 'The one-sided (sup over amplitude) estimate exists and is TRUE but has the wrong sign by 3-16 orders of magnitude: lam_max(prime;G) exceeds lam_min(pole+arch;G) on every configuration; Weil positivity is the sign of a difference of O(1)-O(10^3) forms cancelling to e^{-2.5T} (compact support) or e^{-pi gamma_1} (Hardy class).',
  verdict: '(iii) native span collapses to Lagarias\' criterion in Pick form (known object; finite node sets settled by verified height, all node sets = RH); (ii) compact support gives a real finite-T structure but the finite -> infinite step is exactly RH with zero slack (Szegoe ceiling); (i) NO new finite-truncation positivity estimate: the seam-pencil certificates are worst-case bounds uniform over coalescence/amplitude and Weil positivity needs the configuration-exact evaluation, which is the explicit formula itself. Flow-blindness pattern in the Weil currency, quantified. Not PCC-gated; walled by exactness. Do not re-aim the seam-pencil certificates at Weil positivity. RH OPEN; no refereed bound is changed; NO QED.',
  rigorScope: 'LEMMA ARCH-NATIVE and THEOREM PICK-WEIL are elementary (contour + log-derivative), cross-checked against the zero side to 7e-7 (869 zeros + density tail). COROLLARY LAGARIAS-PICK consumes Pick\'s theorem and Lagarias 1999. All inertia / gap / detection figures are double-precision measurements on the stated finite configurations (float trap: tight Cauchy lattices fabricate lam_min ~ -4e-6; only well-conditioned sets are read). Nothing here changes any Lambda bound or verified height.',
});

// ---- assertions (import-free; THROW on failure)
const relEq = (x, lit, tol) => Math.abs(x - lit) <= tol * Math.max(Math.abs(lit), 1e-300);
export const IMP95520_WEIL_PICK_ASSERTIONS = [
  {
    id: 'imp95520b-zeta-logderiv-em-vs-primes',
    description: 'Euler-Maclaurin zeta\'/zeta(3) matches the von Mangoldt prime sum to 2e4 (rel 1e-7); zeta(2) = pi^2/6 (rel 1e-12); xi\'/xi(2), xi\'/xi(3) reproduce the baked 0.06906623 / 0.1143907 (rel 1e-5); xi\'/xi(s) > 0 at real s in {1.05, 1.2, 1.5, 2, 3, 5, 10} (the n = 1 Lagarias-Pick case, unconditional)',
    holds: () => {
      const Lam = vonMangoldt(20000); let ps = 0;
      for (let n = 2; n <= 20000; n++) if (Lam[n]) ps -= Lam[n] * Math.pow(n, -3);
      if (!relEq(zetaLogDeriv(3), ps, 1e-7)) return false;
      if (!relEq(zetaAndDeriv(2).z, Math.PI * Math.PI / 6, 1e-12)) return false;
      if (!relEq(xiLogDeriv(2), IMP95520_WEIL_PICK_LITERALS.xiLogDerivAt2, 1e-5)) return false;
      if (!relEq(xiLogDeriv(3), IMP95520_WEIL_PICK_LITERALS.xiLogDerivAt3, 1e-5)) return false;
      return [1.05, 1.2, 1.5, 2, 3, 5, 10].every((s) => xiLogDeriv(s) > 0);
    },
  },
  {
    id: 'imp95520b-lemma-arch-native',
    description: 'LEMMA ARCH-NATIVE: direct r-integral of the archimedean term against Re psi(1/4+ir/2) - ln pi equals (1/2)[psi(s_i/2)+psi(s_j/2)]G_ij - ln(pi) G_ij to rel 1e-6 at nu = (0.6, 1.3) and (1, 4)',
    holds: () => [[0.6, 1.3], [1, 4]].every(([ni, nj]) => {
      const d = archNativeDirect(ni, nj);
      const c = (0.5 * (digammaR((ni + 0.5) / 2) + digammaR((nj + 0.5) / 2)) - LNPI) / (ni + nj);
      return relEq(d, c, 1e-6);
    }),
  },
  {
    id: 'imp95520b-theorem-pick-weil',
    description: 'THEOREM PICK-WEIL: pole + arch - prime equals [xi\'/xi(s_i)+xi\'/xi(s_j)]/(nu_i+nu_j) entrywise to 1e-12 on nodes nu = {0.6, 0.8, 1, 1.5, 2.2, 4}; the pole identity 1/(s_i(s_j-1)) + 1/(s_j(s_i-1)) = [1/s_i+1/(s_i-1)+1/s_j+1/(s_j-1)]/(s_i+s_j-1) holds at (2,3),(1.1,7.5)',
    holds: () => {
      const { W, pick } = weilNativeSpan([0.6, 0.8, 1, 1.5, 2.2, 4]);
      for (let i = 0; i < 6; i++) for (let j = 0; j < 6; j++) if (Math.abs(W[i][j] - pick[i][j]) > 1e-12) return false;
      return [[2, 3], [1.1, 7.5]].every(([a, b]) => Math.abs(1 / (a * (b - 1)) + 1 / (b * (a - 1)) - (1 / a + 1 / (a - 1) + 1 / b + 1 / (b - 1)) / (a + b - 1)) < 1e-14);
    },
  },
  {
    id: 'imp95520b-classI-inertia-and-one-sided-gap',
    description: 'CLASS I lattice nu0=1, rho=2, m=8 (G-metric): W PSD with lam_min in (5e-8, 1e-7) and lam_max ~ 4.02; prime inertia 4-/4+; pole rank 2 with one negative direction; pole+arch has negative directions with lam_min ~ -4.84 while lam_max(prime) ~ 9.45; lam_max(P)/lam_min(W) > 1e7',
    holds: () => {
      const nus = Array.from({ length: 8 }, (_, k) => 2 ** k);
      const { W, G, pole, arch, prime } = weilNativeSpan(nus);
      const A = pole.map((r, i) => r.map((v, j) => v + arch[i][j]));
      const eW = pencilEig(W, G), eP = pencilEig(prime, G), eA = pencilEig(A, G), ePole = pencilEig(pole, G);
      const L = IMP95520_WEIL_PICK_LITERALS.nativeLattice_nu1_rho2_m8;
      if (!(eW[0] > 5e-8 && eW[0] < 1e-7)) return false;
      if (!relEq(eW[7], L.lamMaxW, 1e-3)) return false;
      const iP = inertia(eP, 1e-12); if (!(iP.neg === 4 && iP.pos === 4)) return false;
      const iPole = inertia(ePole, 1e-10); if (!(iPole.neg === 1 && iPole.pos === 1 && iPole.zero === 6)) return false;
      if (!relEq(eA[0], L.lamMinA, 1e-3) || !relEq(eP[7], L.lamMaxP, 1e-3)) return false;
      return eA[0] - eP[7] < -10 && eP[7] / eW[0] > 1e7;
    },
  },
  {
    id: 'imp95520b-truncation-law',
    description: 'finite-prime truncation X needed to resolve the single-node Weil margin (error X^{1-s}/(s-1) = 2 xi\'/xi(s)): X ~ 1.88e3 at nu = 1 and ~3.75e25 at nu = 0.6 (rel 2e-2), monotone in the approach to nu = 1/2',
    holds: () => {
      const X = (nu) => { const s = nu + 0.5; const margin = 2 * xiLogDeriv(s); return Math.pow(margin * (s - 1) / 2, -1 / (s - 1)); };
      return relEq(X(1), IMP95520_WEIL_PICK_LITERALS.truncationX.nu1, 2e-2)
        && relEq(X(0.6), IMP95520_WEIL_PICK_LITERALS.truncationX.nu06, 2e-2)
        && X(0.75) > X(1) && X(0.6) > X(0.75) && X(0.55) > X(0.6);
    },
  },
  {
    id: 'imp95520b-classII-hat-basis',
    description: 'CLASS II hats (delta = 0.05): T = 0.3 (prime-free) lam_min(W;B) = 1.0111e-2 (rel 2e-3) with pole+arch alone PSD; T = 0.5 (n = 2 enters): lam_min(W;B) in (1e-5, 3e-5), lam_min(pole+arch;B) < -0.25, lam_max(prime;B) in (0.45, 0.53), prime-only hollow diagonal (trace 0) and indefinite, one-sided gap < -0.7',
    holds: () => {
      const a = weilHatBasis(0.3, 0.05);
      const eW3 = pencilEig(a.W, a.B);
      if (!relEq(eW3[0], IMP95520_WEIL_PICK_LITERALS.hatTable.lamMinW[0], 2e-3)) return false;
      if (!(pencilEig(a.A, a.B)[0] > 0)) return false;
      if (a.prime.some((r) => r.some((v) => v !== 0))) return false;
      const b = weilHatBasis(0.5, 0.05);
      const eW = pencilEig(b.W, b.B), eA = pencilEig(b.A, b.B), eP = pencilEig(b.prime, b.B);
      if (!(eW[0] > 1e-5 && eW[0] < 3e-5)) return false;
      if (!(eA[0] < -0.25)) return false;
      if (!(eP[eP.length - 1] > 0.45 && eP[eP.length - 1] < 0.53)) return false;
      if (b.prime.some((r, i) => r[i] !== 0)) return false;
      if (!(eP[0] < -1e-6)) return false;
      return eA[0] - eP[eP.length - 1] < -0.7;
    },
  },
  {
    id: 'imp95520b-hardy-class-gamma-decay-and-muntz',
    description: 'CLASS III: |Gamma(3/2 + i gamma_1)|^2 = pi(1/4+gamma_1^2)/cosh(pi gamma_1) = 6.519e-17 (rel 1e-3); Muntz: normalized Gram 2sqrt(nm)/(n+m) on integer rates has lam_min < 1e-5 at N = 5 and < 1e-9 at N = 10, while the geometric rho = 2 lattice stays above A_lat(2) = 2.3745e-5 at N = 10',
    holds: () => {
      const g = IMP95520_WEIL_PICK_LITERALS.gamma1;
      if (!relEq(Math.PI * (0.25 + g * g) / Math.cosh(Math.PI * g), IMP95520_WEIL_PICK_LITERALS.gammaWeightAtGamma1, 1e-3)) return false;
      const gram = (nus) => nus.map((a) => nus.map((b) => 2 * Math.sqrt(a * b) / (a + b)));
      const e5 = jacobiVals(gram([1, 2, 3, 4, 5]));
      const e10 = jacobiVals(gram(Array.from({ length: 10 }, (_, k) => k + 1)));
      const eg = jacobiVals(gram(Array.from({ length: 10 }, (_, k) => 2 ** k)));
      return e5[0] < 1e-5 && e10[0] < 1e-9 && eg[0] > IMP95520_WEIL_PICK_LITERALS.aLat2;
    },
  },
  {
    id: 'imp95520b-baked-tables-and-honesty',
    description: 'baked class-II table is monotone decreasing in lam_min(W_T), increasing in lam_max, one-sided gap negative for every T with primes, extremal sign changes all 0; hat detection flips negative at beta = 0.6 (T = 1) and 0.75 (T = 0.5) while the native [1,2,4,8] Pick matrix stays PSD at beta = 0.99; verdict carries (iii)/(ii)/(i), NO QED, PT line',
    holds: () => {
      const H = IMP95520_WEIL_PICK_LITERALS.hatTable;
      for (let i = 1; i < H.T.length; i++) if (!(H.lamMinW[i] < H.lamMinW[i - 1] && H.lamMaxW[i] > H.lamMaxW[i - 1])) return false;
      if (!(H.lamMinAminusLamMaxP[0] > 0 && H.lamMinAminusLamMaxP.slice(1).every((v) => v < 0))) return false;
      if (!H.signChangesMinVec.every((v) => v === 0)) return false;
      const D = IMP95520_WEIL_PICK_LITERALS.detectionHat, N = IMP95520_WEIL_PICK_LITERALS.detectionNative_nodes1248;
      if (!(D.T1_beta06 < 0 && D.T05_beta075 < 0 && D.T05_beta06 > 0 && N.onLine > 0 && N.beta099 > 0)) return false;
      const V = IMP95520_WEIL_PICK_IDENTITY_FINITE_TRUNCATION.verdict;
      return /\(iii\)/.test(V) && /\(ii\)/.test(V) && /\(i\)/.test(V) && /NO QED/.test(V) && /refereed bound is changed/i.test(V) && /RH OPEN/.test(V);
    },
  },
];

for (const a of IMP95520_WEIL_PICK_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-95520-weil-pick-identity-finite-truncation assertion failed: ${a.id}`);
}

export default IMP95520_WEIL_PICK_IDENTITY_FINITE_TRUNCATION;
