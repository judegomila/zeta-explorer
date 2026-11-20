# c20-u4-second-order-archimedean-mixed-form: RESULT

Date 2026-11-20. Round 20, attack, kind explore, R4 direct. Cell U4, the read left open by
`c19-u4-joint-prime-phase-quadratic-dp-zeros` (section 7, item 3): a second-order form mixing the prime
operator A_P with the archimedean operator, at P = t^theta', theta' < 1. Paper lane. One local float64 check
(`check_collapse.py`) and one second-pass check (`referee_check.py`), both through `scripts/memcap.sh 8`.
No server unit was started. Independent referees: 0 (REFEREE.md is a second pass written in the same session;
its corrections E1 and E2 are entered in this file).

**Verdict: precise obstruction. No statement about zeros of zeta is made.** The first lemma stops the lane:
the candidate is invariant under the twins that differ above P (K3), and it is the first-order band form
times the scalar Lg up to an error O(t^(theta'/2 - 1) log t). Stage A (recorded on paper as assigned): ZQ
passes every step; HQ1 to HQ4 and T-NR pass at each (t, P) for a suitable q; no control fails at a relation
between different primes. One pivot (the norm form, the only pure prime quadratic word not covered by c19) ends
at the same lemma. Flags: R1 = R2 = R3 = R4 = false.

Labels: PROVED (argument in this file, elementary) / PROVED-rel (relative to a result on file) / CLASSICAL
(recalled, not opened) / CHECKED (float64, local; not ball arithmetic) / ARGUED / OPEN.

Sources read: BRIEF to the end; STRATEGY section 1 (explore row, two-stage rule, entry test); RESULT and
REFEREE of `c19-u4-joint-prime-phase-quadratic-dp-zeros` (Lemma Q2, K1 to K3, E1),
`c19-dp-zero-census-truncation-identity-server` (form V0 and the regularised T^-3 form),
`c18-tz-one-sided-bound-fe-reserve-bridge` (Theorem A as corrected, Lemma 1, Lemma R, controls table,
Proposition Z); `c19-hq2-screen-fe-int-mult-pos-devices` section 4.1 (HQ3, HQ4); map section 2 (controls,
three questions).

## 0. What is established

1. **Lemma S (scalar collapse; PROVED, constants crude; CHECKED).** On a vector h = e^(ist) h_0 with
   h_0 in H^1, the archimedean multipliers act as scalars: norm((M_G - G(1/2 + it)) h) <= 8 (log t/t)
   norm(h_0') and norm((M_(2 theta') - Lg) h) <= 16 (log t/t) norm(h_0') + O(t^-2) norm(h_0), t >= 43, with
   G(1/2 + it) = Lg/2 + i pi/4 + O(1/t). In particular the archimedean operator has no off-diagonal (Hankel,
   bridge or antibridge) block against a window at height t beyond that size.
2. **Proposition M (PROVED).** Candidate (M): norm(A_P h)^2 <= norm((Arch - A_P) h)^2. Then
   norm((Arch - A_P) h)^2 - norm(A_P h)^2 = Lg <h, (Lg - 2 Re A_P) h> + E_M with
   abs(E_M) <= eps (2 Lg + 4.2 P^(1/2)) norm(h_0) + eps^2, eps = 16 (log t/t) norm(h_0'). So (M) is Lg times
   the band form N(theta') of the c18 lane, whose zero side is on the critical line already through the
   explicit formula (no truncated zero sum is needed), with an error uniform in t.
3. **Proposition C (PROVED).** Every Hermitian form of degree <= 2 in Gamma_c, Gamma_c*, A_P, A_P* on window
   vectors with bounded norm(h_0')/norm(h_0) equals alpha + beta_1 Re<h, A_P h> + beta_2 Im<h, A_P h> + c_1 norm(A_P h)^2 + c_2 norm(A_P* h)^2 +
   Re(d <h, A_P^2 h>) + error, with alpha, beta polynomials in Lg and pi/4 and c_1, c_2, d constants. The
   archimedean operator multiplies words of degree at most 1 in A_P, which are linear in Lambda. Products
   Lambda(m) Lambda(n) at different primes enter only the three pure prime words, with coefficients that do
   not depend on the height.
4. **First lemma (PROVED).** (a) K3-M: every form in these operators on L^2[0, u] is identical for zeta and
   for HQ1(q, eps), HQ3, HQ4 with q >= P, for HQ2 with q^2 >= P, and for zeta(s)(1 + q^(b-s)) with q > P; for
   T-NR(q, c), q >= P, it is zeta's with Gamma_c replaced by Gamma_c + log q. (b) K1 for forms: at fixed P the
   pure prime words have the same closure of values over all heights for every unimodular chain; (M) is not
   invariant, and the non-invariance is carried by the scalar Lg_t alone.
5. **Stage A.** No step of (M) uses multiplicativity of the coefficients. The step that uses the functional
   equation is the identification of Arch with the object's own gamma side (so that the explicit formula
   applies). ZQ passes. Every failure is by size at one prime, by zero location, or by the absence of the
   functional equation.
6. **Pivot.** Norm form (D_kappa): norm(A_P h) <= kappa Lg norm(h). K3-M applies. Proposition P3 (PROVED-rel
   the explicit formula; conditional on real zeros): (D_kappa) in every window gives at most 2 (1 + 2 kappa)/theta'
   ordinates in every interval of length 2 pi/u. Nothing on file supports (D_kappa) for zeta. Stop.

## 1. Entry test (answered before stage A)

- **Q-P** (does T-NR satisfy every hypothesis?). The inequality is a cone condition on a form linear in the
  log-coefficients and the reserve. T-NR with q >= P satisfies it whenever zeta does (item 4 (a)); for q < P
  it fails by the size of the local parameter at q (c18 table). So T-NR passes at each height for a suitable q.
- **Q-B.** The form is the compression of a Caratheodory-type condition on xi'/xi (Re X_P >= 0 with
  X_P = Gamma_c - A_P); symmetric insertions with small offset keep it (next item).
- **Q-S.** Yes: below the Nyquist band the first-order form has a margin in the lattice model, and ZQ passes
  (c18 Proposition Z, PROVED-model).
- **Q-A.** The step reads neither absence of coefficient mass off log N nor a sign of Lambda with zero margin.
  ZQ passes.

Expectation recorded before work: stop at the first lemma; R1 to R4 false. Confirmed.

## 2. Objects, the candidate, the first lemma

### 2.1 Conventions

u = log P, P an integer, P = floor(t^theta'). L^2[0, u]; g(x) = int h(s) e^(-isx) ds; C_a the compressed
shift by a (transform e^(-iax)); A_P = sum_{n<P} Lambda(n) n^(-1/2) C_(log n), with symbol
a_P(x) = sum_{n<P} Lambda(n) n^(-1/2 - ix). G(s) = psi(s/2)/2 - (log pi)/2, so that Re G(1/2 + ix) = theta'(x)
(theta the Riemann-Siegel phase) and xi'/xi = G + 1/s + 1/(s-1) + zeta'/zeta. M_m is the Fourier multiplier by
m; Gamma_c = compression of M_G to L^2[0, u] (causal: G(1/2 + ix) is analytic in Im x < 0);
Arch = Gamma_c + Gamma_c* = compression of M_(2 theta'). Lg = log(t/2 pi). X_P = Gamma_c - A_P is the band
image of xi'/xi up to the pole part. Window vectors: h = e^(ist) h_0, h_0 in H^1_0[0, u].

All of A_P, Gamma_c are compressions of causal convolutions, so they commute and the compression of a product
of causal factors is the product of the compressions:
<h, Gamma_c A_P h> = (1/2 pi) int G(1/2 + ix) a_P(x) abs(g(x))^2 dx.

Explicit formula (CLASSICAL; normalisation of c18 (EF)):
<h, (Arch - 2 Re A_P) h> = <h, T_Z h> - 2 Re[g(i/2) conj(g(-i/2))], T_Z = sum over zeros of abs(v_z><v_(conj z)).
Theorem A in the corrected form V0 (c19 census, CERTIFIED at fixed T): -2 Re <h, A_P h> = -u norm(h)^2 +
lim_T sum_{abs(Im beta) < T} <h, kappa_beta h>, beta the zeros of D_P.

### 2.2 Lemma S (scalar collapse)

**Statement.** Let t >= 43, k = e^(ist) k_0 with k_0 in H^1(R). Then
norm((M_G - G(1/2 + it)) k) <= 8 (log t/t) norm(k_0'), and the same with G replaced by conj G, and
norm((M_(2 theta') - 2 theta'(t)) k) <= 16 (log t/t) norm(k_0'). Further 2 theta'(t) = Lg + O(t^-2) and
Im G(1/2 + it) = pi/4 + O(1/t).

**Proof.** Plancherel: the square of the left side is (1/2 pi) int abs(G(1/2 + ix) - G(1/2 + it))^2
abs(khat_0(x - t))^2 dx, and (1/2 pi) int (x - t)^2 abs(khat_0(x - t))^2 dx = norm(k_0')^2. So it is enough
that abs(G(1/2 + ix) - G(1/2 + it)) <= 8 (log t) abs(x - t)/t for all real x. For abs(x - t) <= t/2:
G'(s) = psi'(s/2)/4 and abs(psi'(z)) <= 1/abs(z)^2 + pi/(2 abs(Im z)) for Re z > 0 (CLASSICAL: series of
psi'), which is below 8/t on the segment; this gives the bound with constant 2. For abs(x - t) > t/2:
abs(G(1/2 + ix)) <= (1/2) log(2 + abs(x)) + 3 for all real x (CLASSICAL), so the difference is at most
log(2 + abs(x)) + log t + 6 <= 2 log t + 6 + 3r with r = abs(x - t)/t >= 1/2, which is at most 8 (log t) r for
t >= 43. The values at t are Stirling. QED.

**Corollary S' (no Hankel block).** For h a window vector, the parts of M_G h and of M_(conj G) h outside
[0, u] have norm at most 8 (log t/t) norm(h_0'). The causal and anticausal overflow of the gamma side against
a window at height t is of that size.

CHECKED (`check_collapse.json`, 30 cells: t = 1e2 to 1e6, P = floor(t^theta'), theta' in {0.5, 0.75, 0.95},
h_0 = sin^4(pi s/u) e^(i tau s), tau in {0, 3}): D_1 = abs(<Arch h, A_P h> - Lg <h, A_P h>),
D_2 = abs(<h, Gamma_c A_P h> - G(1/2 + it) <h, A_P h>), and the defect of Proposition M. All below the bound
with the constant set to 1; largest ratio defect/bound 0.055. Sample (tau = 0):

| t | theta' | P | u / Lg | norm(A_P h)^2 | (Lg - 2 Re<A_P>)/norm^2 | D_1 | D_2 | defect of Prop. M | bound, constant 1 |
|---|---|---|---|---|---|---|---|---|---|
| 1e3 | 0.75 | 177 | 1.02 | 2.118 | 4.963 | 4.9e-4 | 2.5e-4 | -9.3e-4 | 0.59 |
| 1e4 | 0.75 | 1000 | 0.94 | 26.95 | 8.471 | 2.0e-4 | 9.8e-5 | 3.8e-4 | 0.18 |
| 1e5 | 0.75 | 5623 | 0.89 | 18.43 | 7.016 | 1.8e-5 | 8.9e-6 | -1.5e-6 | 0.050 |
| 1e6 | 0.5 | 1000 | 0.58 | 3.222 | 11.68 | 5.9e-7 | 2.9e-7 | 2.4e-7 | 0.0028 |
| 1e6 | 0.75 | 31622 | 0.86 | 38.03 | 10.83 | 1.2e-6 | 6.0e-7 | -1.7e-7 | 0.014 |
| 1e6 | 0.95 | 501187 | 1.10 | 101.8 | 9.945 | 2.3e-6 | 1.1e-6 | -2.3e-6 | 0.054 |

(The assignment's theta' is the exponent in P = t^theta'; the ratio u/Lg, which is what "below the Nyquist
band" means, is the fourth column and exceeds 1 in some cells at small t. The collapse does not depend on it.)
D_2 = D_1/2 in every cell, as it must (the imaginary part pi/4 of G is constant to O(1/t)).

### 2.3 The candidate and Proposition M

    (M)   norm(A_P h)^2  <=  norm((Arch - A_P) h)^2 + E_0(t) norm(h_0') norm(h_0)
          for every window vector h = e^(ist) h_0, h_0 in H^1_0[0, u], u = log P, P = t^theta', theta' < 1,
          E_0(t) = 16 (log t/t)(3 Lg + 4.2 P^(1/2)) + 4 u P^(1/2) t^-2 Lg norm(h_0')/norm(h_0).

Reading in the geometric program: A_P h is the prime (bridge) vector, Arch h - A_P h its mirror image in the
gamma side; (M) says the prime vector is not longer than its mirror image. Where Arch - A_P is invertible this
is norm(A_P (Arch - A_P)^-1) <= 1 on the image of the window vectors, the band form of a Cayley transform of
the type S = N/D of the square-root lane.

**Proposition M (PROVED).** For every window vector,

    norm((Arch - A_P) h)^2 - norm(A_P h)^2 = Lg <h, (Lg - 2 Re A_P) h> + E_M,
    abs(E_M) <= eps (2 Lg + 2 norm(A_P)) norm(h_0) + eps^2 + O(t^-2 Lg) norm(h_0)^2,   eps = 16 (log t/t) norm(h_0'),

and norm(A_P) <= sum_{n<P} Lambda(n) n^(-1/2) <= 2.1 P^(1/2) (CLASSICAL: psi(x) < 1.04 x and partial
summation). With (EF):

    norm((Arch - A_P) h)^2 - norm(A_P h)^2 = Lg ( <h, T_Z h> - 2 Re[g(i/2) conj(g(-i/2))] - <h, (Arch - Lg) h> ) + E_M,

the pole term at most 2 u P^(1/2) t^-2 norm(h_0')^2 (c18 Lemma 1) and the window term at most eps norm(h_0).
With Theorem A (V0): the bracket is also (Lg - u) norm(h)^2 + lim_T sum_beta <h, kappa_beta h> minus the window
term.

Proof. The left side is norm(Arch h)^2 - 2 Re <Arch h, A_P h>. By Lemma S, Arch h = 2 theta'(t) h + P_u e with
norm(e) <= eps; expand; abs(<P_u e, A_P h>) <= eps norm(A_P) norm(h_0). QED.

Consequences.
- (M) holds for zeta at height t if and only if the first-order form Lg - 2 Re A_P is >= -(error) on window
  vectors: (M) is the statement N(theta') of the c18 lane multiplied by Lg. It contains no information of
  second order. The error is O(K t^(theta'/2 - 1) log t) norm(h_0)^2 on vectors with norm(h_0') <= K norm(h_0),
  uniformly in t.
- The inequality is carried to the critical line by (EF) exactly; Theorem A is not needed for that, and the
  enclosed tail bound owed for Theorem A does not enter. What arrives at the line is positivity of T_Z on
  band-u window vectors, which is not a statement of zero location (c18: open condition, ZQ passes; rows of
  spacing at most 2 pi/u are invisible, c17 Theorem 6).

### 2.4 Proposition C (all forms of degree at most 2)

**Statement (PROVED).** Let W be a word of length at most 2 in Gamma_c, Gamma_c*, A_P, A_P* (compressions to
L^2[0, u]), and W_0 the word obtained by replacing Gamma_c by the scalar G_t = G(1/2 + it) and Gamma_c* by
conj G_t. For every window vector, abs(<h, W h> - <h, W_0 h>) <= eps' (abs(G_t) + norm(A_P) + eps')
norm(h_0)-type bound with eps' = 8 (log t/t) norm(h_0'), that is O(t^(theta'/2 - 1) log t).

Proof. Each word with a letter Gamma is a pairing <a, b> in which one side is P_u M_G h or P_u M_(conj G) h
(examples: <h, Gamma_c A_P h> = <P_u M_(conj G) h, A_P h>; <h, A_P* Gamma_c h> = <A_P h, P_u M_G h>;
<h, Gamma_c* Gamma_c h> = norm(P_u M_G h)^2). Replace that side by Lemma S. QED. The same argument applies to
words of any fixed length with an error eps' times a product of norms; only degree 2 is used here.

So every Hermitian form of degree at most 2 is, on window vectors,

    alpha + beta_1 Re<h, A_P h> + beta_2 Im<h, A_P h> + c_1 norm(A_P h)^2 + c_2 norm(A_P* h)^2 + Re(d <h, A_P^2 h>) + error,

alpha, beta_1, beta_2 polynomials of degree at most 2 in Lg and pi/4; c_1, c_2, d constants.

- The archimedean operator pairs with the primes only through <h, A_P h> = (1/2 pi) int a_P abs(g)^2, which is
  linear in Lambda. No product Lambda(m) Lambda(n) is multiplied by a quantity that depends on the height.
- The pure words: <h, A_P^2 h> is the pair form of c19 Lemma Q2 (image of (D_P'/D_P)^2; zero side
  sum_beta D_P''/D_P'(beta) forms); norm(A_P h)^2 and norm(A_P* h)^2 read
  Lambda(m) Lambda(n) (mn)^(-1/2) (m/n)^(-it) <C_(log m) h_0, C_(log n) h_0> (section 4).
- Zero-side form. With A_P = G_t - X_P + (error), every such form is a form of degree at most 2 in X_P and
  X_P*, with coefficients polynomial in G_t: the mixing with the archimedean operator is a change of origin
  in the zero operator and nothing else. If the zeros are real, X_P = T_Z/2 + iK with T_Z >= 0 and K the
  conjugate (Hilbert transform) form; the sign information is in Re<h, X_P h> alone (ARGUED: a square
  norm(X_P h)^2 with a positive coefficient is trivial, with a negative coefficient it needs an upper frame
  bound for the ordinates, section 4).

### 2.5 The first lemma: invariance under K1 and K3

**(a) K3-M (PROVED).** Let F = zeta times a local factor f(q^(1/2 - s)) with f(0) = 1, f a power series in
y = q^(1/2 - s) whose first non-constant term is y^j0, and with zeta's functional equation (f(y) = f(1/y)).
Then log F - log zeta has frequencies k log q, k >= j0, and C_a = 0 for a >= u. So for j0 log q >= u the
operators A_P^F and A_P coincide, the gamma side is zeta's, and every form in Gamma_c, Gamma_c*, A_P, A_P*
on L^2[0, u] (any degree) has the same value for F and for zeta. Members:
HQ1(q, eps) = zeta(1 + eps y/(1 - y)^2), q >= P; HQ2(q, eps) = zeta(1 + eps y^2/(1 - y)^4), q^2 >= P;
HQ3, HQ4 (q; a, b), q >= P; without the functional equation, zeta(s)(1 + q^(b - s)), q > P (c19 K3).
For T-NR(q, c) = xi(s)(2 cosh((s - 1/2) log q) + c), q >= P: the factor's logarithmic derivative tends to
log q as Re s -> +infinity, so X_P is replaced by X_P + log q and Arch by Arch + 2 log q; (M) holds for it
whenever it holds for zeta.
Zeros of the twins: HQ3 and HQ4 on Re s = 1/2 +- a, HQ2 off the line for every eps > 0 (on abs(y) = 1 the
quantity (1 - y)^4/y^2 = (2 cos phi - 2)^2 is >= 0, so (1 - y)^4 + eps y^2 does not vanish there), HQ1 off the
line for eps > 4; in each case in every interval of heights of length 2 pi/log q <= 2 pi/u.
CHECKED (`referee_check.json`): first n with Lambda_F(n) != Lambda(n) is n = q for HQ3 and HQ4 (q = 7, values
2.9612 and 25.134 as predicted by the c19 formula) and n = q^2 for HQ2 (q = 5); T-NR limit 1.0986 = log 3.

Consequence. At the stage (t, P = t^theta') the value of (M), and of every form of section 2.4, is the same
for zeta and for functions with zeta's functional equation, integer frequencies, multiplicative coefficients
(HQ2: coefficients >= 1; HQ3, HQ4: Lambda_F >= Lambda >= 0) and zeros off the line within pi/log q of the
height t. No inequality between these forms at height t can give a statement on the zeros near height t. A
fixed twin is seen only from heights t' with t'^theta' > q, where it is decided by the size of its local
parameter at q (section 3). By the assignment ("if invariant, stop with a device row") the lane stops here;
the device row is section 6.

**(b) K1 for forms (PROVED).** Fix P and h_0. For a word W in A_P, A_P* alone, <h, W h> at height t is a
continuous function Psi_W(h_0; z) on the torus, evaluated at z_p = p^(-it); for a unimodular completely
multiplicative chain eps it is Psi_W at z_p = eps(p) p^(-it). By Kronecker both lines are dense in the torus:
the closures of the value sets over all heights coincide for all chains (form version of c19 Theorem K1).
For a word containing Gamma, Proposition C gives Psi_(W_0) times powers of Lg_t and pi/4, and Lg_t is not a
function on the torus. So (M) is not K1-invariant, and the only term that breaks the invariance is the scalar
Lg_t. In one direction this is immediate: sup over the torus of 2 Re <h, A_P^z h> =
2 sum_{n<P} Lambda(n) n^(-1/2) abs(<h_0, C_(log n) h_0>), of order P^(1/2)/u for a fixed profile, so for
every (t, P) with P^(1/2) large against u Lg some unimodular chain violates (M) at (t, P); the violation is
the pairing of each coefficient with the reserve (c18: step S-res), not a relation between coefficients. In
the other direction nothing transfers: the height t + tau at which zeta emulates a chain has reserve
Lg_(t + tau), not Lg_t (and by c19 Lemma K2 only a vanishing fraction of patterns is emulated below
P^(1/theta')).

## 3. Stage A: controls (paper)

Steps of (M). (S0) the object is a Dirichlet series with a_1 = 1, so that A_P is defined (uses the additivity
of log n under the map n^(-s) -> n^(-1/2) C_(log n); no multiplicativity of coefficients). (S1) **step using
the functional equation**: Arch is the object's own gamma side, so that (EF) identifies Arch - 2 Re A_P with
its zeros minus its poles. (S2) Lemma S and Proposition M (need norm(A_P) = o(t/log t)). (S3) the inequality:
zero side >= -(error) on band-u window vectors, at every height. **Step using multiplicativity: none.** By
Proposition C the form is linear in Lambda, so the failing step for a twist is a statement about single
atoms against the reserve; a relation between different primes cannot occur in (M).

| control | first failing step, or pass | status |
|---|---|---|
| E_a (own zeros, own gamma side, reserve 2 Lg) | passes S0, S1, S2 (norm(A_P) <= 4.2 P^(1/2 + a), and theta'(1/2 + a) < 1). Fails S3 by size: coefficients Lambda(n)(n^a + n^-a), zero side with pair forms of size P^a | ARGUED (c18 table: mean square P^(2a)/(4 a^3 u) against (2 Lg)^2) |
| DEL | fails S1: no functional equation, no gamma side of its own. With zeta's Arch imposed, S3 reads <h, T_Z h> + 2 Re <h, A_S h> >= -(error), A_S the deleted primes, with bounded mean square sum_{p in S} log^2 p/p; a zero-margin form against a bounded perturbation | S1 PROVED; the imposed form is NOT DECIDED on paper (FOR_NUMERICS_LANE item 2) |
| HQ2 (q, eps) | q^2 >= P: identical to zeta in every step (K3-M); passes. Fixed q, large t: fails S3 by size at the one prime q (atoms eps log q j C(j+1, 3) at leading order in eps, with an exponentially growing envelope from the factor's zeros off abs(y) = 1); in (EF) the order-4 poles on the line enter with the negative sign | pass PROVED; failure ARGUED |
| HQ3, HQ4 (q; a, b) | q >= P: identical to zeta; passes. Fixed q, large t: fails S3 by size at q: atoms nu(q^k) q^(-k/2) = log q (q^(-k/2) + 2(cosh kB - (+-1)^k cosh kA)) >= log q e^(kB)(1 - e^(-k(B - A))), in phase at heights t = 0 mod 2 pi/log q; in (EF) the poles on Re s = 1/2 +- b enter with the negative sign (pole clause) | pass PROVED; failure ARGUED (needs an upper bound for <h, T_Z h>) |
| ZQ | **passes S0 (Laplace sense), S1 (exactly), S2 (the added density gives an operator of norm at most 8 u cosh(eta u)), S3 for theta' < 1** | S3 PROVED-model (c18 Proposition Z; not rerun on zeta's ordinates) |
| multiplicative sign chains | fail S1 (no functional equation). With zeta's Arch imposed, S3 reads <h, T_Z h> + 4 Re <h, A_(S, odd) h> >= -(error): each flipped prime enters alone, linearly. Not a relation between different primes (Proposition C) | PROVED (linearity); frequency of violation MEASURED in c15, c16 |
| Liouville | fails S1. Imposed form: Lg - 2 Re A^lambda = 2 Lg - <T_Z> - 4 Re <A^ev> (A^ev the even prime powers), which needs the upper frame bound <h, T_Z h> <= 2 Lg + O(u); violated where k ordinates lie within 1/u and k theta' > 2 (c18). **The atom p q^2 does not occur in (M)**: Lambda(12) = 0 for every chain and (M) is linear in Lambda. The first atom at which Liouville differs is n = 2. The atom p q^2 (first at 12, P > 12) enters only the pure words: coefficient 2 Lambda(3) Lambda(4) 12^(-1/2) of C_(log 12) in A_P^2, and the term (3/4)^(-it) in norm(A_P h)^2, both with the sign minus for Liouville (c19 referee E1) | PROVED (absence of the atom); violation ARGUED |
| T-NR (q, c) | q >= P: passes (reserve raised by 2 log q). Fixed q < P: fails S3 by size of the local parameter at q (c18: kernel with T_m(c/2) = cosh(m b log q)). One prime; not a relation between different primes | pass PROVED; failure ARGUED |
| NR-q | as T-NR: passes only for u <= log q = 0.88; then fails S3 by size at the added generalised prime | ARGUED (c18) |
| DH | passes S0 (a_1 = 1; P not a multiple of 5), S1 (own gamma side, conductor 5), S2 (Lambda_DH(n) = O(n^0.13), so norm(A_P) = O(P^0.63)). Fails S3 through zero location (zeros right of 1 and off-line pairs); its first off-line pair is invisible below the band (c18) | ARGUED |
| HEAT | fails S0: no fixed Dirichlet series, A_P is not defined. On the zero side each window passes while its pairs have u b below the one-pair threshold (c18) | ARGUED |
| THIN | a sign chain: fails S1; imposed form as DEL with 4 Re A_(S, odd), bounded mean square | S1 PROVED; imposed form NOT DECIDED |

Result. ZQ passes every step. HQ2, HQ3, HQ4, T-NR pass every step at each (t, P) for a member with q beyond
the stage. E_a and DEL do not pass (this is the difference from candidate (J) of c19): E_a fails by size, DEL
by the missing functional equation. No control fails at a relation between different primes, and for the
sign chains and T-NR the failing step is a single-prime statement. The conditions under which the score could
rise are not met. Stage B was not opened.

## 4. Pivot (once): the norm form

The only pure prime quadratic word not treated by c19 is norm(A_P h)^2 (c19 treated A_P^2 through Lemma Q2
and sign reads). It contains the cross-prime phases (m/n)^(-it). Candidate:

    (D_kappa)   norm(A_P h) <= kappa Lg norm(h)   for every window vector at height t, P = t^theta'.

- **P1 (PROVED).** K3-M applies: (D_kappa) is identical for zeta and the twins of section 2.5 (a). Stop
  condition met.
- **P2 (PROVED).** By 2.5 (b), at fixed P the supremum over heights of norm(A_P h)/norm(h) is the same for
  every unimodular chain and is at least sum_{n<P} Lambda(n) n^(-1/2) abs(<h_0, C_(log n) h_0>)/norm(h_0)^2
  (the point z = 1 of the torus). So (D_kappa) cannot hold uniformly in height at fixed P; it is a statement
  of the coupled range only, where K1 gives no transfer in either direction.
- **P3 (PROVED-rel (EF) and Lemma S; conditional).** Assume the zeros of zeta are real in the variable z (RH).
  If (D_kappa) holds for the window vector h_0 = (2/u)^(1/2) sin(pi s/u) at every height in a range, then
  every interval of length 2 pi/u in that range contains at most 2 (1 + 2 kappa)/theta' + o(1) ordinates.
  Proof: <h, T_Z h> = Lg - 2 Re <h, A_P h> + o(1) <= (1 + 2 kappa) Lg + o(1), and
  <h, T_Z h> = sum_gamma abs(g_0(gamma - t))^2 >= (u/2) #{gamma: abs(gamma - t) <= pi/u}, since
  abs(g_0(y))^2 >= u/2 on abs(y) <= pi/u (CHECKED: minimum 0.5000 u, attained at the ends). QED.
  So (D_kappa) is at least as strong as a uniform bound for the number of ordinates in an interval of
  1/theta' mean spacings. No such bound is known under RH (the known bound is O(log t/log log t), CLASSICAL),
  and the conjectured maximal order of S(t) (CLASSICAL, heuristic, not opened) is against it. Nothing on file
  gives (D_kappa) for zeta from the prime side, and its conclusion is not a statement on zeros off the line.
- Combined forms (first-order form times Lg plus a multiple of a pure word) are covered by P1; with a
  positive coefficient on a square the added term is trivial, with a negative coefficient it needs (D_kappa).

The pivot ends here.

## 5. Requirement flags

- **R1 false.** No step uses multiplicativity of coefficients. (M) is linear in Lambda (Proposition C); the
  identities hold for every Dirichlet series with a_1 = 1.
- **R2 false.** (M) is a statement in each window with an error uniform in t, but it is N(theta') times Lg,
  not a statement on zero location, and it is not established for zeta (it follows from real zeros in the
  band; nothing is proved here in that direction). At stage level it is blind to the twins (K3-M).
- **R3 false.** ZQ passes every step; HQ2, HQ3, HQ4, T-NR pass at each (t, P) for a suitable q; no control
  fails at a relation between different primes.
- **R4 false.** The form reaches the critical line by (EF) with a proved uniform error (Proposition M), but
  what arrives is positivity of T_Z on band-u window vectors below the Nyquist band, which the c18 lane showed
  is not the target. The second-order structure adds nothing to that (Lemma S).

## 6. Proposed device row and map row (not applied)

Device row: "Second-order mixed band form (c20). Operators on L^2[0, u], u = log P, P = t^theta':
A_P (primes), Gamma_c, Arch (gamma side). Candidate (M): norm(A_P h) <= norm((Arch - A_P) h) on window vectors.
State: closed at the first lemma as a route to zero location (the inequality itself is the first-order band
form, which real zeros imply). Lemma S: in a window at height t the gamma side is the scalar
Lg/2 + i pi/4 up to 8 (log t/t) norm(h_0'); no Hankel block. Proposition M: (M) = Lg x (first-order band form
N(theta')) + O(t^(theta'/2 - 1) log t). Proposition C: in every form of degree <= 2 the gamma side multiplies
words linear in Lambda only; cross-prime products occur with height-independent coefficients. K3-M: all such
forms coincide for zeta and HQ1, HQ3, HQ4 (q >= P), HQ2 (q^2 >= P); T-NR (q >= P) with reserve + 2 log q.
Controls: ZQ passes; twins pass per stage; E_a, fixed-q twins fail by size at one prime; chains, DEL, THIN by
the missing functional equation; none at a cross-prime relation. Norm form norm(A_P h) <= kappa Lg norm(h):
same lemma; under RH it would bound the number of ordinates per 2 pi/u by 2 (1 + 2 kappa)/theta'. Status:
PROVED (elementary) / CHECKED float64 / control failures ARGUED; unrefereed. Closed: do not pair the gamma
side with A_P in a window at height t at any polynomial order; the pairing is first-order."

Map row (U4, next to the c19 row): "U4 last read, second-order mixed form: closed (c20). With c18 (first
order), c19 (pair form, joint phases) the band-u reads of cell U4 at P = t^theta', theta' < 1, are exhausted
for forms polynomial in the compressed operators."

## 7. Three weakest steps

1. **Stage A failures are ARGUED, and two rows are not decided.** E_a, the fixed-q rows of HQ2, HQ3, HQ4,
   T-NR, DH and HEAT rest on size arguments not written out with an upper bound for <h, T_Z h>; DEL and THIN
   with zeta's Arch imposed are open (bounded perturbation of a zero-margin form). The ZQ pass is c18
   Proposition Z in the lattice model, not rerun on zeta's ordinates. None of this affects the stop, which
   rests on K3-M and on ZQ.
2. **Lemma S and Proposition C are for window vectors with norm(h_0') <= K norm(h_0) and for polynomial
   forms.** Constants 8 and 16 are crude and the digamma bounds are recalled, not opened; the check is float64
   on two windows. Not covered: vectors whose frequency spread is of order t/(P^(1/2) log t) or more;
   non-polynomial functions of the operators (inverses, determinants, logarithms), where an error of size
   log t/t can be amplified by a small eigenvalue of Arch - A_P; the range theta' >= 1, where the reflected
   half of the approximate functional equation has frequencies inside the band (c18 Lemma R) and the gamma
   side enters through the phase theta(t) and not only through theta'(t).
3. **The pivot is closed by the stop lemma, not refuted.** P3 is conditional on real zeros and shows only what
   (D_kappa) would imply; the statement that (D_kappa) fails for zeta at some heights is heuristic. "Only
   Re<h, X_P h> carries sign information" (end of 2.4) is ARGUED, not a classification of quadratic
   inequalities valid for all real zero sets of the given density.

## 8. Files

`RESULT.md`; `REFEREE.md` (second pass, same session); `FOR_NUMERICS_LANE.md` (written before stage A);
`check_collapse.py`, `check_collapse.json` (30 cells; run `scripts/memcap.sh 8 python3.14 check_collapse.py`,
under one minute); `referee_check.py`, `referee_check.json`; `lanes.jsonl`. No server unit, nothing committed,
no file written outside this directory.
