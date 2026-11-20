# c5-thin-walk-replay: THIN regular in every ray class, replay of five manuscript steps with eps, and the abscissa g(kappa, e)

Date 2026-11-18. Slug `c5-thin-walk-replay`. Kind: deepen (pays weakest steps 1 and 2 of `c4-thin-twist-control-78`).
Not refereed. Nothing committed or pushed. Local runs only (`scripts/memcap.sh 8`, each under 5 s, under 50 MB); the
compute server was not used. No statement about zeros of zeta is made. RH open. The 7/8 manuscript
(`~/lean-deps/qrh-verify/paper.txt`, read as text; its numbering is used) is unrefereed. NO QED.

Labels: PROVED / PROVED-rel X / CLASSICAL / RECALLED (from memory, not re-read) / SEARCHED (statement seen in a web
search result) / MEASURED / REPLAYED (re-derived here from the manuscript's definitions with eps in place of eta) /
ARGUED / OPEN.

## Verdict

Partial result about the control and about an implication. Three items.

1. **THIN can be made regular in every ray class (Theorem 2, PROVED-rel H_K(theta)).** A stagewise greedy rule gives
   a set S of prime ideals of O = Z[omega] with pi_S(x; C) = L(x)/h_q + O_q(x^(b-eta) log x) for every modulus q and
   every ray class C mod q. For the completely multiplicative eps_K (-1 on S, +1 elsewhere) and every finite-order
   ray class character psi, L(s, eps_K psi) = L(s, psi) G_psi(s) with G_psi analytic on Re s > max(b - eta, b/3);
   G_psi has no zero there when psi is non-principal, and one simple zero at s = b when psi is principal. The family
   {eps_K psi} is closed under twists and its zeros in that half-plane are the zeros of Hecke L-functions plus the
   one point b. It is not impossible. What the construction does not give is any bound uniform in the conductor.
2. **Replay (REPLAYED).** With eps_K in place of eta: (6.2) HOLDS, (7.5) HOLDS, Lemma 7.1 HOLDS (identity, regions
   and size bounds; continuation clause HOLDS row by row for the variant of item 1), Lemma 9.1 HOLDS (target-free),
   bound (2.2) HOLDS. One discrepancy in the text of Lemma 7.1 was found that does not depend on the target (O1).
3. **g(kappa, e) (Proposition G, PROVED-rel the high comparison; Part I geometry).**
   g(kappa, e) = max(11/12 + kappa, 5/12 + tau_0/2 - e), tau_0 = 4/3 from Lemma 9.1 on squarefree rows.
   Hecke characters: (kappa, e) = (0, infinity), g = 11/12. THIN at level D = Z^delta: e = (1-b) delta/2 (PROVED),
   kappa = (1+b) delta (ARGUED), so g_THIN(b) = 11/12 + (1+b)/(3(3+b)), between 401/372 = 1.0780 (b = 7/8) and
   13/12 (b = 1). **Consistency holds: g_THIN(b) - b >= 1/12 for every b in (7/8, 1)** (exact rational check). Since
   g_THIN > 1 the check is passed in the range where the axiomatised argument proves nothing for THIN; it is not
   sharp. Neither THIN nor the walk is contradicted. The sharp form of the same test is the necessary condition
   (N) of section 3.4: a reflection of the complete eps-row must lose at least Z^(b - 11/12) in row norm.

Record: R3 of the 7/8 architecture for the THIN control is now a quantitative input of the low side, "row energy
exponent E = 1, that is (kappa, e) = (0, infinity) for the target weight"; each unit of kappa moves the abscissa by
one unit (Proposition G).

---

## 0. Plan

Decisive test first (section 3): derive g, evaluate at THIN, check g >= b. It holds, so the lane continues with
(1) the short-interval source and the class-regular variant, (2) the replay.

Read: BRIEF; OBSTRUCTION_MAP section 2 (controls) and rows Z15, Z18; `c4-thin-twist-control-78` RESULT + REFEREE
(errors E1-E5); `r3-tnr-control` (head); `n3-theta-power-departure-law` (head); manuscript Section 2, 5.1 (statement),
5.5, Lemma 5.7 (statement), Lemma 5.8, 6.1, 6.2, 7.1, 7.2, Lemma 9.1 (statement), 10.1.
`c5-thin-propd-dichotomy` had no directory at the time of writing; `EXCHANGE.md` here is for that lane.

New relative to c4: Theorem 2 (answers referee point E5: the control now sits in a twist-closed family); the five
steps are re-derived, not read by hypothesis; Proposition G and the necessary condition (N).

---

## 1. Short-interval input and the class-regular variant

### 1.1 Sources

* Baker-Harman-Pintz, "The difference between consecutive primes, II" (Proc. LMS 2001), Theorem 1: for all
  x > x_0 the interval [x - x^0.525, x] contains prime numbers. [SEARCHED.] The paper's proof gives the counting
  form pi(x) - pi(x - x^0.525) >= (9/100) x^0.525/log x. [RECALLED; the constant was not seen in the search.]
* The existence form alone is not enough for Lemma 1 when b > 0.475: one prime per interval of length x^theta gives
  density x^(-theta), below the required x^(b-1)/(2 log x). A counting form is needed.
* Huxley (1972): pi(x + h) - pi(x) ~ h/log x for x^(7/12+epsilon) <= h <= x; the same for a fixed progression
  a mod q with h/(phi(q) log x). [CLASSICAL, RECALLED.] This covers the progressions 1 and 2 mod 3.
* Ray classes of K = Q(sqrt(-3)). Balog-Ono (2001) give Chebotarev in intervals x^(1 - 1/c(E) + epsilon) <= h <= x
  with c(E) depending on [E : Q]. [SEARCHED.] For ray class fields that exponent tends to 1 with the modulus, which
  is not enough below. The input used is

  **H_K(theta).** There is theta < 1, the same for all moduli, such that for every modulus q of O and every ray
  class C mod q: #{prime ideals p in C, x < Np <= x + h} >= c_q h/log x for x >= x_q and x^theta <= h <= x.

  Expected from zero-density estimates for Hecke L-functions of K with an exponent independent of the character
  (degree 2 over Q; Fogels, Weiss) and the Vinogradov-type zero-free region for a fixed Hecke character.
  [RECALLED; **no stated theorem located**. Weakest step 1.]

### 1.2 Lemma 1 with the exponent

**Lemma 1 [PROVED-rel the counting form].** With the greedy set S of c4 section 1 and D(x) = pi_S(x) - L(x):
-C x^(b - eta) <= D(x) <= 0 for x >= 2, where eta = 1 - theta and theta is the exponent of the counting form:
eta = 5/12 - epsilon (Huxley), eta = 0.475 (Baker-Harman-Pintz counting form). Proof: c4 with referee repair E1.

### 1.3 Stagewise greedy rule

Moduli m_1 | m_2 | ... with every ideal dividing some m_k (m_k = product of p^k over Np <= k). h_k = order of the ray
class group mod m_k. Choose X_1 < X_2 < ... recursively with (a) X_k >= x_{m_k}; (b) X_k^(b-1) <= 2 c_{m_k};
(c) h_k <= log X_k; (d) X_{k+1} >= X_k^2. Stage k is the set of prime ideals p not dividing m_k with
X_k < Np <= X_{k+1}, ordered by norm (ties in any fixed order). For each class C mod m_k keep a counter n_C, zero at
the start of the stage, and the target L_{k,C}(x) = (L(x) - L(X_k))/h_k. A prime p of class C is put in S iff
n_C + 1 <= floor(L_{k,C}(Np)), and then n_C is increased by one. Below X_1 use the rule of c4.
eps_K = -1 on S, +1 on the other primes, completely multiplicative on ideals.

**Lemma 1* [PROVED-rel H_K(theta)].** For x in stage k and C mod m_k, with
D_{k,C}(x) = #{p in S, p in C, X_k < Np <= x} - L_{k,C}(x): -2 - x^(b-eta) <= D_{k,C}(x) <= 0.

Proof. Upper bound: n_C <= floor(L_{k,C}) at each inclusion and L increases. Lower bound: let y <= x be the last
norm at which n_C = floor(L_{k,C}(y)) (it exists: the start of the stage). After y every class-C prime is included,
so D_{k,C}(x) >= -1 - [(L_{k,C}(x) - L_{k,C}(y)) - #{p in C, y < Np <= x}]. The L-increment over (y, y + h] is at
most h y^(b-1)/(2 h_k log y). If h >= y^theta, split at the points 2^j y; on each piece H_K(theta) with (b) gives at
least as many class-C primes as the L-increment: c_{m_k} h/log is at least h y^(b-1)/(2 h_k log y) because
y^(b-1) <= X_k^(b-1) <= 2 c_{m_k} <= 2 c_{m_k} h_k (c_{m_k} is the per-class constant). The last piece shorter than
(its left end)^theta contributes at most x^(theta+b-1). QED

**Corollary.** For every modulus q and class C' mod q: pi_S(x; C') = L(x)/h_q + O_q(x^(b-eta) log x).
Proof. Let k_0 be the first k with q | m_k. In stage j >= k_0, C' is a union of h_j/h_q classes mod m_j, so the
stage-j discrepancy of C' is in [-(h_j/h_q)(2 + x^(b-eta)), 0], at most (2 + x^(b-eta)) log x in size by (c).
Completed stages j < k contribute sum_j (2 + X_{j+1}^(b-eta)) log X_{j+1} <= 2 (2 + x^(b-eta)) log x by (d). Norms
below X_{k_0} contribute O_q(1). QED

**Theorem 2 [PROVED-rel H_K(theta)].** Let sigma_1 = max(b - eta, b/3), psi a finite-order ray class character of K
of modulus q (zero at primes dividing q), G_psi(s) = prod_{p in S} (1 - psi(p) Np^-s)/(1 + psi(p) Np^-s).
(i) L(s, eps_K psi) = L(s, psi) G_psi(s) for Re s > 1.
(ii) psi non-principal: G_psi is analytic and has no zero on Re s > sigma_1.
(iii) psi principal: G_psi(s) = (s - b) W_psi(s), W_psi analytic without zeros on Re s > sigma_1.
(iv) Hence every member of {eps_K psi} is meromorphic on Re s > sigma_1; its zeros there are the zeros of L(s, psi)
and, for principal psi only, a simple zero at b (zeta_K(b) != 0 for 1/2 < b < 1 is CLASSICAL for this field:
zeta_K = zeta L(chi_-3), both non-zero on (1/2, 1); numerically L(b, chi_-3) > 0).

Proof. (i) factor by factor: (1 + psi(p) Np^-s)^-1 = (1 - psi(p) Np^-s)^-1 (1 - psi Np^-s)/(1 + psi Np^-s).
(ii) log G_psi = -2 P_psi(s) + T_psi(s), P_psi = sum_{p in S} psi(p) Np^-s, T_psi with terms O(Np^(-3 Re s)),
analytic on Re s > b/3 (S has counting exponent b). P_psi(s) = s int D_psi(x) x^(-s-1) dx with
D_psi(x) = sum_{C'} psi(C') pi_S(x; C') = (L(x)/h_q) sum_{C'} psi(C') + O_q(x^(b-eta) log x) = O_q(x^(b-eta) log x).
So P_psi is analytic on Re s > b - eta and G_psi = exp(-2 P_psi + T_psi). (iii) as c4 Theorem 1 with the Corollary
at q = 1; removing the primes dividing q changes finitely many non-vanishing factors. QED

**No conductor uniformity [PROVED for this construction; existence of a uniform variant OPEN].** The O_q constant
contains pi_S(X_{k_0(q)}), and X_{k_0(q)} is fixed by thresholds x_{m_k} that are not explicit. On b - eta < Re s < b
the bound for G_psi is exp(O(|s| X_{k_0}^(b - Re s))). Lemma 4.8's conclusion (growth Q^(3/5)(3 + |t|)^2, uniform in
the conductor Q) is not available for the family. A variant with D_psi(x) << q^A x^(b - delta) for all q <= x^c
would need the means sum_{Np <= x} rho_p psi(p) to save a power for a weight rho of density x^(b-1); for constant
rho this is a zero-free strip for L(s, psi). Not decided.

Model remark [HEURISTIC]. Random inclusion with probability Np^(b-1)/2 gives G_psi(s) = L(s + 1 - b, psi)^-1 times
an analytic factor: the zero at b is the pole of zeta_K at 1 shifted by 1 - b. The greedy rule replaces the prime
number theorem error by a deterministic O(x^(b-eta)).

---

## 2. Replay with eps = eps_K in place of eta

Target weight: a completely multiplicative function on ideals, values +-1. S = primes over 6 and all primes of norm
<= P_0 (eps has no conductor, so no further primes enter S). T, xi, b_*, tau, Xi, R, G, alpha, gamma_r as in the
manuscript; none depends on the target.

| step | status | proof with eps |
|---|---|---|
| (6.1) defined | HOLDS | Psi_{m,s,eps}(a) = eps(a) Xi(a)^-1 R(a,s) chi_a(m) on (a,S) = 1. T_{m,s,eps}(t) is dominated on Re t = 4 by sum q_c^(-9/2) q_n^(-13): absolutely convergent because abs(eps) = 1. The s and m sums are finite (annular weights). |
| (6.2) | HOLDS | Three operations. (a) G(A) = sum_theta a_theta theta(A): target-free. (b) nu_sigma = eps Xi^-1 R(., s_sigma) is completely multiplicative, so nu_sigma(c n^3) = nu_sigma(c) nu_sigma(n)^3 and T(t + 1/2, nu_sigma theta chi_.(m)) = L_0 D is the product of two absolutely convergent series on Re t = 4; the Mellin integral of the corrected row equals B_{m,sigma}(Z) for s in sigma. (c) Mellin inversion of W_0 in q_m/(q_{b_*} q_s X) = (q_m/Q)/(q_s/Y): target-free. A_{m,sigma,v} does not contain the target. (5.31) (termwise Mellin inversion) also holds, so B_{m,sigma} = sum a_theta C_{V_G}(Z; m, nu_sigma theta) with C defined by (5.30) for the non-character weight. The next sentence of the manuscript ("that estimate applies directly", Lemma 5.8) is the first one whose hypothesis fails (nu must be a finite-ray character). |
| (7.1)-(7.5) | HOLDS | The summed variable is m. The function m -> xi(m) chi_A(m) q_s^(-1/2) g_{chi_s}(s, -m) is periodic modulo s b_* A for every A; its finite Fourier transform is q_s^(1/2) F(s, A, H) (7.1). eps enters (7.4) as the scalar eps(A). Interchanges on Re x = 3, Re w = 3, Re z = 2: with abs(F) <= q_s q_{b_*A} and abs(eps) = 1 the series is dominated by sum q_c^(-5/2) q_n^(-7) q_s^(-2) q_a^(-12) q_u^(-2), convergent over ideals. |
| Lemma 7.1, (7.11) | HOLDS | eps(A) = prod_p eps(p)^(e_0 + 3l) (complete multiplicativity; c and n may share primes). All phase cancellations before (7.10) are target-free. In (7.10) the target is the factor eta(p)^(e_0) (a_p gamma_3)^l, of eta-degree t = e_0 + 3l. Degree audit of table (7.16) (`replay_local.py`): the ten entries carry eta(p)^t with t = 6, 6, 6, 1, 1, 1, 3, 3, 4, 4 for the four families at r = 0, and R carries eta(p)^6 for the step r -> r + 1. No relation on eta(p) other than abs(eta(p)) = 1 is used; b_p^3 = a_p^2 holds identically (chi_p(4)^3 = chi_p(2)^6 = 1). So (7.11) holds with eta(p) = eps(p) = +-1. |
| Lemma 7.1, (7.13) and regions | HOLDS | (7.17) is an algebraic identity in (V, W, D, E_p) (re-derived by hand; numerically residual 3e-16 at 2000 random points, `replay3.py`). abs(R), abs(V), abs(D) < 1 and the exponents in (7.14), (7.15) depend only on abs(eta(p)) = 1. Sampled with eta(p) = +1, -1 and random unit phases, Q from 7 to 100003, region (7.15): sup abs(H_p - 1) Q^(363/200) <= 3.48 (MEASURED, with D as in O1). F_{eps,u} = zeta_F^S(6z) L^S(w, chi_.(u)) H_{eps,u} / L^S(x, eps chi_.(u)) in absolute convergence. |
| Lemma 7.1, continuation clause | HOLDS row by row for the variant of section 1 (Theorem 2); not uniform in q_u | 1/L^S(x, eps chi_.(u)) = 1/(L^S(x, chi_.(u)) G_{chi_.(u)}(x)): meromorphic on Re x > sigma_1; for u != 1 its poles there are zeros of L(x, chi_.(u)); for u = 1 one more pole at x = b. For the original THIN of c4 the rows u != 1 are continued only to Re x > b. |
| (2.2) | HOLDS | H_eps(s) = H_{eps,1}(s, 1, 1/6): u = 1, so rho = 1 and O1 does not arise. At w = 1, z = 1/6, Re s >= 7/8: abs(H_p - 1) << Q^(-15/8) uniformly in the unit phase eps(p); the product over Np > P_0 is 1 + O(P_0^(-4/5)); P_0 is chosen before the target. With the sampled constant 3.48 and at most two prime ideals per norm, P_0 = 43 already gives sum abs(H_p - 1) < 0.41 (illustration, MEASURED constant). |
| Lemma 9.1 | HOLDS | The statement has no target: arbitrary coefficients c_n fixed independently of the row. c_n may contain eps(n). Its uses (Proposition 9.2) were not replayed. |
| Lemma 6.2 | HOLDS | Target-free (A_{m,sigma,v} and the fractions d/s). Used in section 3. |

**O1 (text of Lemma 7.1; independent of the target).** Row 4 of (7.16) is -eta(p) rho^-1 Q^-x, as (7.9) gives
(chi_p^(k-t)(h_p) with k = 0, t = 1). The lemma then sets D = eta(p) chi_p(u) Q^-x = eta(p) rho Q^-x for p not
dividing u. With that D, E_p = P_p^* + D keeps the term eta(p)(rho - rho^-1) Q^-x and H_p - 1 is of size Q^(-Re x),
not O(Q^(-1-epsilon)), unless rho^2 = 1 (MEASURED: sup abs(H_p - 1) Q^(363/200) grows like Q^0.94). With
D = eta(p) rho^-1 Q^-x everything stated holds. So either the denominator of (7.13) is L^S(x, eta conj(chi_.(u))) or
an overline was lost in the text file. The family is closed under conjugation; the theorem is not affected. Read
from `paper.txt` only; the PDF and the Lean statement were not compared.

Summary: the five steps hold for eps. In the logical chain the first hypothesis that fails is the one in Lemma 5.8
("nu ranges over multiplicative finite-ray characters"), reached through the sentence after (6.2). This agrees with
c4, now by replay for these steps. The steps between (not replayed): Proposition 5.1 itself, Lemma 5.7, Sections 8-11.

---

## 3. The abscissa g(kappa, e)

Part I geometry: X = Y = Z^(1/2), Q = q_{b_*} Z, C(s) = s - 2/3, sigma_0 = 11/12.

### 3.1 Three lemmas

**Lemma G1 (transfer) [PROVED from Proposition 2.1].** Keep the hypotheses of Proposition 2.1 but replace (2.4) by
abs(J(Z)) << Z^(C(sigma_0) + lambda + omega') for every omega' > 0, with a fixed lambda >= 0. Then
beta_* <= sigma_0 + lambda.
Proof. If beta_* > sigma_0' := sigma_0 + lambda, apply Proposition 2.1 at sigma_0' with omega = (beta_* - sigma_0')/2:
C has slope one, so the bound is (2.4) at sigma_0'; H is holomorphic on Re s > sigma_0'; (2.5) is unchanged. QED

**Lemma G2 (energy to low exponent) [REPLAYED from (6.2), Lemma 6.2, Proposition 6.3; target-free].** For any weight
with abs <= 1: if sum_{0 < q_m <= C Q} abs(B_{m,sigma}(Z))^2 << Z^(E + epsilon) for each sigma, then
I(Z^(1/2), Z^(1/2), Z) << Z^(-1/4 + E/2 + epsilon).
Proof. Cauchy-Schwarz in (6.2): Q^(-1/2) (Q/Y)^(1/2) Z^(E/2) = Y^(-1/2) Z^(E/2). QED
So lambda = (E - 1)/2 and the abscissa is 5/12 + E/2.

**Lemma G3 (energy without reflection) [PROVED-rel Lemma 9.1; squarefree rows].** For arbitrary coefficients a(c),
abs(a) <= 1, on squarefree c: sum over squarefree good rows m, q_m <= Z, of
abs(sum_{c,n} gamma_2(c) alpha(c n^3) a(c) a'(n) chi_c(m) chi_n(m)^3 V(q_c q_n^3/Z) q_c^(-1/2) q_n^-1)^2
<< Z^(4/3 + epsilon) (sum_n abs(a'(n))/q_n)^2 max_n sum_c abs(a(c))^2 abs(V)^2/q_c.
Proof. Minkowski over n (chi_n(m)^3 is a scalar of modulus <= 1 for each row), then (9.1) with K = D = Z and
coefficients independent of the row. QED
tau_0 = 4/3 on squarefree rows. For rows with a powerful part the same method gives 3/2 (count of powerful parts
Z^(O/2) against K + D); the trivial value is 2. Every statement below is monotone in tau_0; 4/3 is the most
demanding value for the consistency check.

### 3.2 Axiom and Proposition G

**Axiom PD(kappa, e).** The weight a is completely multiplicative with abs(a(p)) = 1 outside S, and at scale Z the
a-twisted rows split as B = B_1 + B_2 with
(i) sum_m abs(B_1)^2 << Z^(1 + 2 kappa + epsilon): the reflected bound of Lemma 5.7 with frozen active modulus of
    norm Z^kappa (T_0 = 2H + 2 A_0 - N, E_0 <= max(H, T_0), at H = N = 1, A_0 = kappa). "All sextic twists
    a chi_.(m), q_m <= Z, have a Poisson dual of conductor q_m Z^kappa."
(ii) B_2 is the row of a coefficient sequence of normalised square mass sum_c abs(a_2(c))^2/q_c << Z^(-2e + epsilon),
    so sum_m abs(B_2)^2 << Z^(tau_0 - 2e + epsilon) by Lemma G3.

**Proposition G [PROVED-rel: Lemma 5.7 with a frozen modulus (ARGUED from its statement), and the high comparison
(2.5) for the weight].** Under PD(kappa, e) the argument of Part I gives no zero of the family in
Re s > g(kappa, e) = max(11/12 + kappa, 5/12 + tau_0/2 - e); with tau_0 = 4/3: **g = max(11/12 + kappa, 13/12 - e).**
Proof. E <= max(1 + 2 kappa, tau_0 - 2e); Lemma G2; Lemma G1. QED
Hecke characters with conductor in S: (0, infinity), g = 11/12 (Theorem 3.1). No reflection: (., 0), g = 13/12.
Part II: Lemma G1 holds at sigma_0 = 7/8, C = s - 11/16; the map (kappa, e) -> lambda through Proposition 15.3 was
not derived (weakest step 2).

### 3.3 THIN in the axiom

eps(c) = sum_{d | c, d in <S>} (-2)^omega(d) on squarefree c (<S> = squarefree products of primes of S). Level
D = Z^delta: a_1 = terms with q_d <= D, a_2 = eps - a_1.
* e [PROVED]. a_2(c) != 0 only if the S-part of c has norm > D; abs(a_2(c)) <= 1 + 3^omega(c). #{d in <S>,
  q_d <= y} << y^(b + epsilon) (Rankin; pi_S(x) ~ L(x)). So sum_{q_c <= Z} abs(a_2(c))^2/q_c << Z^epsilon D^(b-1):
  **e = (1 - b) delta/2.**
* kappa [ARGUED]. The d-term is the row over c = d c', (c', d) = 1: by twisted multiplicativity of gamma_2 it is
  q_d^(-1/2) times a row of length Z/q_d with frozen primes p | d (Definition 5.6, set F; constants of Lemma 5.7 do
  not depend on F). Energy Z^(-delta_d + max(1, 2 + 2 delta_d - (1 - delta_d))) = Z^(1 + 2 delta_d), delta_d = log_Z q_d.
  Minkowski over d: Z^(1/2) sum_{q_d <= D} 2^omega(d) q_d << Z^(1/2 + (1+b) delta + epsilon):
  **kappa = (1 + b) delta.** The decomposition of eps(n) on the cube variable and the replay of Proposition 5.1 for
  the d-restricted row are not done; they can only increase kappa.
* g_THIN(b) = min over delta of max(11/12 + (1+b) delta, 13/12 - (1-b) delta/2)
  = **11/12 + (1+b)/(3(3+b))** at delta = 1/(3(3+b)).

### 3.4 Decisive test

Exact rational arithmetic (`replay2.py`, Fractions; grid minimum over delta in steps of 1/3000 against the closed
form, b = 7/8 + i/1000, i = 0..125):

| b | g_THIN(b) | g - b | delta |
|---|---|---|---|
| 7/8 | 401/372 = 1.07796 | 0.20296 | 8/93 |
| 9/10 | 505/468 = 1.07906 | 0.17906 | 10/117 |
| 19/20 | 1025/948 = 1.08122 | 0.13122 | 20/237 |
| 1 | 13/12 | 1/12 | 1/12 |

d/db of (1+b)/(9+3b) is 6/(9+3b)^2 < 1, so g - b decreases and **g_THIN(b) - b >= 1/12 on (1/2, 1]. Consistent.**
g_THIN > 1 for every b: the axiomatised argument gives no half-plane for THIN. The test does not separate "THIN
wrong" from "walk wrong" because neither is indicated.

Sharp form. Proposition D (c4; valid in the twist-closed family of Theorem 2) and Lemma G2 give:

**(N) [PROVED-rel the high comparison (2.5) for I_eps relative to C(b), and Theorem 2].** For every delta' > 0 the
bound sum_m abs(B_{m,sigma,eps})^2 << Z^(2b - 5/6 - delta') fails for some sigma. In the axiom: every PD(kappa, e)
decomposition of eps has max(11/12 + kappa, 13/12 - e) >= b. With e(delta) = (1-b) delta/2 the second term exceeds
b for all delta < 1 (it is >= 7/12 + b/2), so (N) binds only at delta = 1: **a reflection of the complete eps-row
loses at least Z^(b - 11/12) in norm against character rows; kappa(1) >= b - 11/12.** The Minkowski bookkeeping has
kappa(1) = 1 + b. The window [b - 11/12, 1/6] for the true lambda of THIN is open; it is the subject of
`c5-thin-propd-dichotomy`. One consequence: the d-terms cannot be both of ideal size (energy Z/q_d) and orthogonal,
since that would give E = max(1, b) < 2b - 5/6 for b > 11/12.

---

## 4. Controls

No statement about zeros of zeta is made, so no control has to fail here. Each control against Axiom PD and the
unimodularity clause (which clause it lacks; * = inference, not replayed):

| control | completely multiplicative | abs(a(p)) = 1 | PD(0, infinity) | consequence in Proposition G |
|---|---|---|---|---|
| Hecke character | yes | yes | yes | g = 11/12 |
| THIN / Theorem 2 variant | yes | yes | no: e = (1-b) delta/2 at kappa = (1+b) delta | g_THIN > 1; (N) |
| T-NR twin (`r3-tnr-control`) | multiplicative, not completely | fails at q | yes (zeta times one local factor; periodic twists)* | fails at Section 2 deletion and the size bound of Lemma 7.1; with q in S the statement returned is about L^S and is true |
| theta^w, w not in {1,2,4,8} (`n3-theta-power-departure-law`) | no (not multiplicative) | n/a | has a functional equation at level 1; rows not replayed* | fails at eps(A) = prod eps(p)^t before (7.10), as DH at (7.13) |
| theta^w, w = 4, 8 | multiplicative | fails (coefficients of size n) | * | size clause, as EA |
| Beurling | n/a | n/a | not formulable: the rows are indexed by ideals of O and (7.1) is Poisson summation on the lattice O | N |

For Theorem 2: S empty gives G_psi = 1. For Lemma G1: lambda = 0 is Proposition 2.1. For Proposition G: a Hecke
character with conductor outside S of norm Z^kappa gives 11/12 + kappa, consistent with constants in Theorem 3.1
depending on the target.

## 5. Requirement flags

All four false in the structured result. This lane is a control construction, a replay and an implication.
* R1: not established for a mechanism. Evidence gathered: Lemma 7.1 uses complete multiplicativity only through
  eps(A) = prod eps(p)^t and holds for a weight with a zero at b; multiplicativity plus unimodularity is not what
  excludes the zero.
* R2: no height-uniform statement. The zero of the control is one real point.
* R3: one control (THIN) walked by replay through five steps, and three controls classified by clause; not every
  control at a verified step.
* R4: not in scope.

## 6. Three weakest steps

1. **H_K(theta) is not located as a stated theorem.** Theorem 2 needs a Hoheisel exponent that does not depend on
   the modulus. Balog-Ono's exponent depends on the degree of the class field; with it the Corollary gives only
   D_psi(x) = O(x^(b - eta_k)) with eta_k -> 0 and the twisted members continue to Re s >= b, not past. The
   Baker-Harman-Pintz constant 9/100 and Huxley's theorem in progressions are recalled, not re-read.
2. **kappa for THIN is ARGUED and the test is passed only in the range g > 1.** The d-restricted row was not put
   through Proposition 5.1; Lemma 5.7 with a frozen modulus of norm Z^kappa is used from its statement; the cube
   variable was not decomposed; tau_0 = 4/3 is proved for squarefree rows only. Part II (the actual 7/8 geometry,
   Proposition 15.3) has no (kappa, e) formula here. Proposition G and (N) assume the high comparison for the weight.
3. **The replay is of a text extraction.** O1 shows the text of Lemma 7.1 is not self-consistent as extracted;
   other dropped marks are possible. Proposition 5.1, Lemma 5.7, Sections 8-11 and the uses of Lemma 9.1 were not
   replayed; the size constants for H_p are sampled, not bounded.

## 7. Follow-up

Compute E_eps(Z) = sum_m abs(B_{m,eps})^2 against the same sum with weight 1 at b = 0.95 for two or three Z
(`tmp/sextic/` tools, lane `c5-thin-propd-dichotomy`): if the high comparison holds, (N) gives a ratio
E_eps/E_1 of at least Z^(2b - 11/6) = Z^(1/15); Lemma G3 caps the ratio at Z^(1/3) on squarefree rows.

## Files

`RESULT.md`, `EXCHANGE.md` (for `c5-thin-propd-dichotomy`), `replay_local.py` + `.log` (degree audit, sampled H_p
bounds), `replay2.py` + `.log` (exact rational check of g_THIN; the sympy residual printed there is an unsimplified
expression, superseded by `replay3.py`), `replay3.py` + `.log` (numeric check of (7.17)).

Sources seen in search: Baker-Harman-Pintz (https://www.cambridge.org/core/services/aop-cambridge-core/content/view/2EF13261B3B25458A25F41ED74AA2FC2/S0024611501013132a.pdf/difference_between_consecutive_primes_ii.pdf);
Balog-Ono (https://uva.theopenscholar.com/ken-ono/publications/chebotarev-density-theorem-short-intervals-and-some-questions-serre);
arXiv 1405.5486; arXiv 2004.09488.
