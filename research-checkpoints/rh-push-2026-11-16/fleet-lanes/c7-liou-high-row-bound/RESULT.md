# c7-liou-high-row-bound: the row bound (5.36) for the Liouville weight; closed form of the row norm; where THIN stops

Date 2026-11-18. Slug `c7-liou-high-row-bound`. Kind: combine (paper lane). Scope: this directory only. Not refereed.
Nothing committed or pushed. Local runs only (`scripts/memcap.sh 8`, single process, longest 5 min 16 s, under 3 GB);
the compute server was not used. No statement about zeros of zeta is made. RH open. The 7/8 manuscript
(`~/lean-deps/qrh-verify/paper.txt`, unrefereed, read as text; its numbering is used) is neither confirmed nor
contradicted. NO QED.

Labels: PROVED (complete argument here) / PROVED-rel X / CLASSICAL / RECALLED (from memory, not re-read) /
ARGUED (standard steps named, not written line by line) / MEASURED (float64, exact enumeration) / HEURISTIC / OPEN.

## Verdict

Partial result. The heuristic law (3) of `c5-thin-propd-dichotomy` (coherent term = Mertens sum squared times a
count of sixth-power dual frequencies) is turned into an identity with a sign, and the Liouville case is closed up
to one cited mean-value bound.

1. **Lemma 1 (PROVED from (4.7)).** mu(c) gamma_2(c) conj(alpha(c)) = G(c) conj(gamma_1(c)) on squarefree c. With
   the Liouville weight the squarefree part of the row (5.30) is a sum of conjugate **sextic** Gauss sums
   conj(g(m, c)) q_c^(-1) times a finite-ray function; with weight 1 it is a sum of cubic Gauss sums times the
   angular character alpha. The Dirichlet series behind each dual frequency h is L^S(x, psi_h)/L^S(2x, psi_h^2) for
   Liouville and 1/L^S(x, psi_h) for weight 1 (Lemma 1').
2. **Theorem A (principal term PROVED; remainder PROVED-rel (H2), contour step ARGUED).** For Liouville rows
   restricted to one ray class sigma modulo a fixed f_0 supported on S, with a row weight of non-negative Fourier
   transform, sum_m w(m) abs(B_m^sigma(X))^2 = D + P + Rem with D >= 0, P a sum of **non-negative** terms,
   P >= c M^(5/6) X^(1/3)/log (the logarithm is removable, ARGUED), P << (MX)^eps M^(5/6) X^(1/3), and
   Rem << (MX)^eps (M + X + X^2/M). At M = X = Z: **exponent 7/6 against the bound
   1 + eps of (5.36)/(5.39).** Averaged over the characters nu mod f_0, the Liouville analogue of (5.36) is false by
   Z^(1/6); it is false for at least one nu of that family (Corollary B). In the notation of Lemma 5.8 (O = 0) the
   violation holds for 7M/8 < N < 11M/10.
3. **Decisive test.** 7/6 equals the threshold 2b - 5/6 of condition (N) (`c5-thin-walk-replay`) at b = 1: (N) is
   sharp for the Liouville weight, and the row norm exceeds (5.36) by exactly the amount Proposition D requires.
4. **Numerical check (MEASURED, Z = 2^7 .. 2^14, own conventions, test V = bump).** The pair formula behind
   Theorem A holds to 7e-15 on 58 pairs. N = D + P + R with D = 0.209 Z, P = 0.019 Z^(7/6) (coefficient rising from
   0.0165 at 2^10 to 0.0189 at 2^14), R = -(0.0031 to 0.0039) Z ln Z for Liouville. P is proportional to the
   squared smoothed Mertens sum of mu w across weights to 1 to 4 percent from 2^10.5 on (unimodular twist 0.4 percent) and scales as M^0.83 in the row
   length. For weight 1 abs(P) <= 0.021 P_liou from 2^11 on and N = D (1 +- 0.013).
5. **THIN.** The same identity gives P_eps of order Z^(2b - 5/6) given the asymptotic of the class Mertens sums of
   mu eps (PROVED-rel a zero-free strip Re s > b - delta for the L-functions mod f_0, and `c5-thin-walk-replay`
   Theorem 2). The proof stops at the remainder: it needs a bound for 1/L(s, eps psi_h) on Re s = b - delta that is
   uniform in the conductor of psi_h up to Z (inputs T1, T2 of section 6). T2 is the statement
   `c5-thin-walk-replay` records as not given by the class-regular construction. So for THIN: the low half is the
   one that fails, conditionally on T1 and T2; unconditional status OPEN.

What is not established: the remainder bound as a written proof; the statement for each single nu; the full
completed row with the cube variable for small P_0; the high comparison for the probe I_liou itself; anything
unconditional about THIN. The result locates R3 of the 7/8 mechanism (it does not supply R4, see section 9).

---

## 0. Plan and reading

Read: BRIEF (to the end); OBSTRUCTION_MAP section 2 (control THIN) and rows Z15, Z15b, Z18, items 21, 22;
`c4-thin-twist-control-78` (Proposition D), `c5-thin-walk-replay` (RESULT, EXCHANGE, condition (N), Lemma 5.8 as
first failing hypothesis), `c5-thin-propd-dichotomy` (law (3), measured kappa), `c6-probe61-thin-three-weights`
(RESULT + REFEREE: Lemma 2, deepen item LIOU-HIGH); manuscript Sections 2, 4.2 (Lemma 4.2, 4.4, (4.7)), 5.1
(statement), 5.5 ((5.30), (5.31), Lemma 5.8 with (5.36) to (5.39)), 6.1, Lemma 9.1 (statement).

Naming. In the assignment "(5.36) (the high comparison)" joins two things: (5.36) is the low-side row bound; the
high comparison is (2.5). The object here is the row norm sum_m abs(C_V(Z; m, w nu))^2, whose size on the high side
(what Proposition D forces) is compared with the bound (5.36).

New relative to rounds 5 and 6: law (3) was HEURISTIC and MEASURED. Here: the exact pair formula, the class
argument that makes every principal term non-negative, the reduction of the remainder to a second moment of
Hecke L-functions on the line 1/2 + eps (possible for Liouville because 1/L(x, liou psi) = L(x, psi)/L(2x, psi^2)
has no poles in Re x > 1/2 other than x = 1 for principal psi), the general-weight form, and the exact place
where THIN stops.

Decisive test first: section 4 (exponent 7/6 against 1 + eps and against 2b - 5/6). It does not kill the idea;
no pivot was used.

---

## 1. First lemma

Notation of the manuscript: F = Q(omega), O = Z[omega], q_x = N(x), chi_c the sextic symbol with its zero values,
e(z) = exp(2 pi i Tr(z/lambda)), gamma_j(c) = q_c^(-1/2) sum_{x mod c} chi_c(x)^j e(x/c), indices primary and
prime to S. (4.7): gamma_2(c)^3 = mu(c) alpha(c), gamma_1(c) gamma_2(c) = mu(c) alpha(c) G(c), abs(G(c)) = 1, on
squarefree c; abs(gamma_j(c)) = 1 for j not divisible by 6 (Lemma 4.2 and multiplicativity).

**Lemma 1 [PROVED from (4.7)].** For squarefree c: mu(c) gamma_2(c) conj(alpha(c)) = G(c) conj(gamma_1(c)).
Hence, for any weight w on squarefree indices, the squarefree part (n = 1) of the row (5.30) with nu replaced by
w nu is

    C^sf_V(X; m, w nu) = sum_c [mu(c) w(c)] G(c) nu(c) conj(gamma_1(c)) chi_c(m) q_c^(-1/2) V(q_c/X),

and conj(gamma_1(c)) chi_c(m) = conj(q_c^(-1/2) g_{chi_c}(c, m)) for every m (both sides vanish when (m, c) != 1).
* w = Liouville: mu(c) w(c) = 1. The row is a sum of conjugate sextic Gauss sums with numerator m, twisted by the
  finite-ray function G nu. No Moebius factor and no angular character remain.
* w = 1: the coefficient is gamma_2(c) conj(alpha(c)): a cubic Gauss sum times the character conj(alpha) of
  infinite order.

Proof. gamma_2 = mu alpha G / gamma_1 = mu alpha G conj(gamma_1) since abs(gamma_1) = 1; multiply by
mu conj(alpha) and use mu^2 = abs(alpha)^2 = 1. For the second statement write g(c, m) = sum_x chi_c(x) e(mx/c).
For (m, c) = 1 the substitution x -> m^(-1) x gives g(c, m) = conj(chi_c(m)) g(c, 1), so
conj(q_c^(-1/2) g(c, m)) = chi_c(m) conj(gamma_1(c)). For a prime p dividing (m, c), c squarefree, the local
factor of g(c, m) is sum_{x mod p} chi_p(x) = 0, and chi_c(m) = 0. QED

Reading. Proposition 5.1 prints D(s, Psi) = sum gamma_2(n) conj(alpha(n)) Psi(n) q_n^(-s) with the bar; (5.30)
prints alpha without it. The bar is taken (as in `c6-probe61-thin-three-weights`, where gamma_1 gamma_2 = mu alpha G
was confirmed on 4.04 million moduli). With alpha unbarred Lemma 1 becomes mu gamma_2 alpha = G conj(gamma_1)
alpha^2 and no statement below holds (round 5 measured that the Liouville excess disappears in that variant).

**Lemma 1' (the Dirichlet series behind one dual frequency) [PROVED].** Let psi be a completely multiplicative
function on ideals prime to S with abs(psi) <= 1. For Re x > 1:

    sum_{c sf} mu(c) w(c) psi(c) q_c^(-x) = 1/L^S(x, psi)                      (w = 1),
                                          = L^S(x, psi)/L^S(2x, psi^2)        (w = Liouville).

In section 2 psi = theta conj(chi_.(h)) for a dual frequency h and a ray character theta. For h = l a^6 (l an
S-unit) and theta chosen so that psi is principal on ideals prime to a S, the Liouville series is
zeta_F^S(x)/zeta_F^S(2x) with a simple pole at x = 1 (residue rho_S/zeta_F^S(2) times the local factors at
p | a), and the weight-1 series is 1/zeta_F^S(x) with a zero at x = 1. That pole against that zero is the whole
difference between the two weights in the principal term: the term is kappa abs(m_w)^2 with m_w the smoothed sum
of mu(c) w(c)/q_c (section 6), which is of order 1 for Liouville and << exp(-c sqrt(log X)) for weight 1
(prime ideal theorem for F, CLASSICAL). Lemma 5.8 does not cancel a term for w = 1; it bounds the total by
reflection, and the principal term is absent because 1/zeta_F vanishes at 1.

For the probe (6.1) the same substitution in (7.13) gives row u: zeta_F^S(6z) L^S(w, chi_u) L^S(x, chi_u)
H_{liou,u} / L^S(2x, chi_u^2), holomorphic in Re x > 1/2 except for the pole at x = 1 in row u = 1; on squarefree
indices the coefficient series of `c6-probe61-thin-three-weights` Lemma 2 is
prod_p (1 + (1 - 1/q_p) q_p^(-x)) = zeta_F^S(x)/zeta_F^S(2x) times a product absolutely convergent for Re x > 0.

Spectral reading [CLASSICAL, RECALLED; not used in any proof below]. sum_c g(c, m) q_c^(-s) for the n-th order
symbol is a Fourier coefficient of the Kubota-Patterson metaplectic Eisenstein series, with a pole at
s = 1 + 1/n whose residue is a coefficient of the theta function of the n-fold cover. For n = 6 and the
normalisation above the pole is at 2/3 and the row has a term r(m) Vhat(1/6) X^(1/6). Theorem A is then the mean
square of sextic theta coefficients, and "T entire" in Proposition 5.1 (weight 1) is the absence of a residual
form in the K-type of alpha. The objects of the open 7/8 lever TRO6 (sextic Kubota theta coefficients) are the
residues of the Liouville rows. [HEURISTIC as a link; nothing is proved about TRO6.]

---

## 2. Pair formula and class phases

Lattice O in C has covolume A = sqrt(3)/2. Row weight: w(m) = exp(-pi q_m/M) in the numerics; in Theorem A any
w(m) = W(m/sqrt(M)) with W = f * f~ (planar autocorrelation of a non-negative bump f of L^2-norm 1), so that
0 <= w <= 1, w has compact support in q_m <= C M, and its planar Fourier transform Wt = abs(fhat)^2 is >= 0.

**Lemma 2 (pair Poisson formula) [PROVED; checked to 7e-15].** Let c = d c_1, c' = d c_1' be squarefree, primary,
prime to S, with d = gcd(c, c'), k = d c_1 c_1'. For the Gaussian weight

    sum_{m in O} exp(-pi q_m/M) chi_c(m) conj(chi_c'(m)) = (M/(A q_k)) sum_{h in O} exp(-4 pi M q_h/(3 q_k)) psihat(h),
    psihat(h) = r_d(h) * conj(chi_c1(h)) chi_c1(d c_1') q_c1^(1/2) gamma_1(c_1)
                       * chi_c1'(-h) conj(chi_c1'(d c_1)) q_c1'^(1/2) conj(gamma_1(c_1')),

r_d(h) = prod_{p | d} (q_p 1_{p | h} - 1). With a(c) = x_c conj(gamma_1(c)) (x_c arbitrary complex numbers) and
gamma_1(d c_1) = gamma_1(d) gamma_1(c_1) chi_d(c_1) chi_c1(d):

    a(c) conj(a(c')) psihat(h) = x_c conj(x_c') (q_c1 q_c1')^(1/2) r_d(h)
        * conj(chi_d(c_1)) chi_d(c_1') * chi_c1(c_1') conj(chi_c1'(c_1)) * conj(chi_c1(h)) chi_c1'(-h).           (2.1)

For general W the factor exp(-4 pi M q_h/(3 q_k)) is replaced by Wt(4 M q_h/(3 q_k)) (normalised with Wt(0) =
integral of W).
Proof. Poisson summation on O for a function periodic modulo k: the dual lattice of kO is
{conj(2h/(k lambda)): h in O}, of squared length 4 q_h/(3 q_k), and the character of O/k attached to h is
x -> e(hx/k). The finite Fourier transform factors by the Chinese remainder theorem (x = sum x_i (k/k_i) with
e(hx/k) = prod e(h x_i/k_i)): a Ramanujan sum at each p | d, and Gauss sums at c_1 and c_1' with arguments
h (k/c_1)^(-1) and h (k/c_1')^(-1). QED
Check (`check1.py`, own conventions of `lib7.py`): 58 random coprime pairs with q_c, q_c' <= 400, M in {3, 10, 40},
a shifted Gaussian (for the unshifted one the six unit multiples of m cancel unless the pair character is trivial
on units): worst abs(lhs - rhs) = 7.2e-15.

**Lemma 3 (class phases) [PROVED-rel Lemma 4.1 and Lemma 4.4 of the manuscript as read; MEASURED for S = {2, lambda}].**
Let U_S be the group generated by the units and the generators of the primes in S. There is a modulus f_0 with
prime support in S such that for primary c prime to S the following depend only on the class of c mod f_0:
chi_c(l) for every l in U_S; R(c, .) and R(., c); G(c). Let c, c' be in the same class, d = gcd(c, c'), and let h
satisfy h d in U_S (F^x)^6: h d = l b^6 with l in U_S, b in O prime to S; then d | b, and with b = d a,
h = l d^5 a^6. Then the phase in (2.1) is

    conj(chi_d(c_1)) chi_d(c_1') chi_c1(c_1') conj(chi_c1'(c_1)) conj(chi_c1(h)) chi_c1'(-h) = 1_{(c_1 c_1', a) = 1},

and r_d(h) = phi(d) > 0.
Proof. chi_c1'(c_1) = R(c_1, c_1') chi_c1(c_1') and chi_c1'(-1) = R(c_1', c_1') (Lemma 4.4), so
chi_c1(c_1') conj(chi_c1'(c_1)) chi_c1'(-1) = conj(R(c_1, c_1')) R(c_1', c_1') = 1 because c_1 and c_1' lie in the
same class (both are the class of c divided by that of d) and R is a function of classes with abs(R) = 1.
chi_d(c_1) = R(c_1, d) chi_c1(d) and the same for c_1', so
conj(chi_d(c_1)) chi_d(c_1') conj(chi_c1(h)) chi_c1'(h) = conj(R(c_1, d)) R(c_1', d) conj(chi_c1(h d)) chi_c1'(h d)
= conj(chi_c1(l b^6)) chi_c1'(l b^6). Here chi_.(l) is a class function, and chi_c1(b^6) is the indicator of
(c_1, b) = 1, which is (c_1, a) = 1 because (c_1, d) = 1. Each p | d divides h, so r_d(h) = prod (q_p - 1). QED
Check (`check4.py`): for S = {2, lambda}, 2218 squarefree c of norm <= 6000, h = unit lambda^i 2^j (i, j <= 6):
with classes modulo F = 72 all 1,543,794 pair-frequency phases over 432 classes equal 1; with F = 36 they do not
(1,617,840 of 7,201,530 differ). So f_0 = 72 works in the conventions of `lib7.py`.

---

## 3. Theorem A

Fix f_0 as in Lemma 3, a class sigma mod f_0, and V >= 0 smooth with compact support in (0, infinity), V >= 1 on
[1, 2]. Class row of the Liouville weight:

    B_m(X) = B_m^sigma(X) = sum_{c sf, (c,S)=1, c in sigma} conj(gamma_1(c)) chi_c(m) q_c^(-1/2) V(q_c/X).

By Lemma 1, for every ray character nu mod f_0: C^sf_V(X; m, liou nu) = sum_sigma nu(sigma) G(sigma) B_m^sigma(X).

**(H2) [RECALLED: Blomer-Goldmakher-Louvel 2014, the source the manuscript cites for Lemma 9.1; the reduction for
non-squarefree h ARGUED].** For theta a ray character mod f_0, every eps > 0 and some A:
sum over h in O, 0 < q_h <= H, with theta conj(chi_.(h)) not principal, of abs(L^S(1/2 + eps + iy, theta conj(chi_.(h))))^2
<< H^(1+eps) (1 + abs(y))^A. (Approximate functional equation of length (conductor)^(1/2) and the sextic large
sieve K + D + (KD)^(2/3) of Lemma 9.1 at D <= K^(1/2); for h = h_1 h_2^2 ... h_5^5 a^6 the factor from h_2 .. h_5 is
put into the coefficients, which Lemma 9.1 allows.)

**Theorem A.** N(M, X) := sum_{m in O} w(m) abs(B_m(X))^2 = D + P + Rem, where
* D = (M Wt(0)/A) sum_c phi(c) q_c^(-2) V(q_c/X)^2 >= 0 (h = 0, c = c'); D ≍ M;
* P = (M/A) sum over (d, c_1, c_1', h) with h d in U_S (F^x)^6, h != 0, of
  phi(d) q_d^(-2) (q_c1 q_c1')^(-1) V(q_d q_c1/X) V(q_d q_c1'/X) 1_{(c_1 c_1', a) = 1} Wt(4 M q_h/(3 q_d q_c1 q_c1')):
  **every term is >= 0** [PROVED: Lemma 2 with x_c = q_c^(-1/2) V 1_sigma, Lemma 3, Wt >= 0];
* P >= c_1 M^(5/6) X^(1/3)/log(X^2/M) for X^2 >= C M, and P << (MX)^eps M^(5/6) X^(1/3) [PROVED]: keep d = 1,
  l = 1, a prime or 1 with q_a^6 <= c X^2/M and c, c' in [X, 2X]; there Wt >= Wt(0)/2 and the coprime pairs of the
  class prime to a have sum (q_c q_c')^(-1) >= c_sigma > 0. The number of such a is >> (X^2/M)^(1/6)/log. With all
  a the logarithm is not lost [ARGUED: positive proportion of a with phi(a)/q_a >= 1/2]; the S-units l enter
  only the constant, since sum_l q_l^(-1/6) converges. The upper bound is the same count.
* abs(Rem) << (MX)^eps (M + X + X^2/M) [PROVED-rel (H2); ARGUED]. Rem collects the frequencies with h d not in
  U_S (F^x)^6. For these the function c_1 -> conj(chi_d(c_1) chi_c1(h)) 1_sigma(d c_1) is a finite combination of
  non-principal Hecke characters psi = theta conj(chi_.(hd)) (reciprocity turns chi_d(c_1) into chi_c1(d) times a
  class function). Write V and Wt by Mellin inversion; the sum over coprime squarefree (c_1, c_1') prime to d is
  L^S(1 + t - z, psi) L^S(1 + t' - z, psi') E(t, t', z) with E an Euler product absolutely convergent for real
  parts > 1/2 (Lemma 1'); there is no pole, so the t- and t'-contours move to real part -1/2 + eps, giving
  X^(-1+2eps) abs(L L') for each (d, h), with q_h effectively <= X^(2+eps)/M. Cauchy-Schwarz over h, (H2), and
  sum_d q_d^(-2) abs(r_d(h)) << q_h^eps give M X^(-1) (X^2/M)^(1+eps). The terms M and X cover the pairs c = c'
  with h != 0 and the tails.

Consequence at M = X = Z: N(Z, Z) = D + P + Rem with P ≍ Z^(7/6) up to Z^eps, D ≍ Z, Rem << Z^(1+eps). With
X = Z^N, M = Z^M: P of order Z^(5M/6 + N/3) dominates Rem for M/2 < N < 11M/10.

**Corollary B [PROVED-rel Theorem A].** Let X_0 be the family of all ray characters nu mod f_0 (finite-ray
characters with conductor supported on S, the kind of family Lemma 5.8 is stated for), h_0 their number. By
Parseval on the class group,

    (1/h_0) sum_{nu in X_0} sum_m w(m) abs(C^sf_V(Z; m, liou nu))^2 = sum_sigma N^sigma(Z, Z) >= c Z^(7/6).

So the estimate "sum_{0 < q_m <= C Z} abs(C_V(Z; m, liou nu))^2 << Z^(1+eps), uniformly in nu in a fixed finite
family" is false for the squarefree part of the row; it fails for at least one nu in X_0. In the general form of
(5.36) at O = 0 the bound max(M, 2M - N) is exceeded by 5M/6 + N/3 exactly when N > 7M/8 (and N > M/2); with the
range of Theorem A: for 7M/8 < N < 11M/10.

Full completed row (c, n) [ARGUED]. C_V(Z; m, liou nu) = sum_n l_m(n) q_n^(-1) C^sf_V(Z/q_n^3; m, liou nu) with
abs(l_m(n)) <= 1 (l_m(n) = liou(n) conj(alpha(n))^3 nu(n)^3 chi_n(m)^3). Minkowski in the family-and-row norm with
the upper bound of Theorem A at the scales Z/q_n^3 gives norm >= P(Z)^(1/2) (1 - C_0 sum_{n != 1} q_n^(-3/2)) -
O(Z^(1/2+eps)), with C_0^2 the ratio of the upper to the lower constant of P. Since every prime of norm <= P_0 is
in S, sum_{n != 1} q_n^(-3/2) -> 0 as P_0 grows: the conclusion holds for the full row once P_0 is large. For
S = {2, lambda} the sum is about 0.3; the constant C_0 was not computed.

Single nu [MEASURED only]. For the row with coefficient conj(gamma_1(c)) on all classes (G nu = 1 in the
conventions of `lib7.py`; this is the row of the probe (6.1), where conj(G) is inserted) the principal term over
the frequencies unit lambda^i 2^j a^6 is positive at every scale computed (section 5).

---

## 4. Decisive test: closed-form size against (5.36) at the exponents of Proposition D

| quantity at M = N = 1 (rows q_m <= C Z, scale Z) | exponent | status |
|---|---|---|
| bound (5.36)/(5.39), finite-ray nu | 1 + eps | manuscript Lemma 5.8 (not replayed) |
| Liouville rows, average over nu mod f_0 | 7/6 (upper and lower, up to Z^eps) | Theorem A, Corollary B |
| threshold of condition (N) at abscissa b: 2b - 5/6 | 7/6 at b = 1 | `c5-thin-walk-replay` (N) |
| weight with a simple pole of sum mu w c^(-s) at b (section 6) | 2b - 5/6 (principal term) | Theorem C |
| large-sieve bound without reflection (Lemma G3 there) | 4/3 | Lemma 9.1 |

The row norm of the Liouville weight is larger than (5.36) allows by Z^(1/6), and equals the minimum that
Proposition D and Cauchy-Schwarz require from a weight whose reciprocal L-function has its singularity at 1.
Condition (N) is therefore attained. The idea is not killed.

---

## 5. Numerical check (constant of the principal term, not the verdict)

Code: `lib7.py` (sextic symbols by modular powers, gamma_1 from the definition at primes and by
gamma_1(ab) = gamma_1(a) gamma_1(b) chi_a(b) chi_b(a) on products; max abs(abs(gamma_1) - 1) = 8e-16),
`check1.py`, `check2.py`, `check3.py`, `check4.py`, `fits.py`. Conventions are those of `lib7.py` (S = {2, lambda},
primary = 1 mod 3, no G, no nu); V = bump on (1/2, 2) in q_c/X; row weight exp(-pi q_m/M) over all m in O.
B_{m,w}(X) = sum_c mu(c) w(c) conj(gamma_1(c)) chi_c(m) q_c^(-1/2) V(q_c/X).
N = brute-force row sum; D = diagonal; P = formula (2.1) summed over coprime pairs and the frequencies
h = unit lambda^i 2^j a^6 up to 12 (2X)^2/M; R = N - D - P (everything else, including the pairs with d != 1).

M = X = Z (`check2.log`, `fits.log`; 6949 moduli, 475,495 rows, 474 principal frequencies at Z = 2^14):

| Z | D | N_liou | P_liou | R_liou | P/Z^(7/6) | R/(Z ln Z) | N_one - D | P_one |
|---|---|---|---|---|---|---|---|---|
| 2^8 | 53.07 | 56.16 | 8.60 | -5.50 | 0.0133 | -0.0039 | -2.07 | -0.04 |
| 2^10 | 213.57 | 245.12 | 53.57 | -22.03 | 0.0165 | -0.0031 | +1.21 | -1.76 |
| 2^12 | 856.22 | 1035.48 | 296.55 | -117.29 | 0.0181 | -0.0034 | +3.69 | +6.18 |
| 2^13 | 1711.75 | 2147.68 | 679.83 | -243.90 | 0.0185 | -0.0033 | -14.33 | -3.74 |
| 2^14 | 3420.96 | 4477.12 | 1563.99 | -507.82 | 0.0189 | -0.0032 | +9.31 | -6.38 |

* Fitted exponents in Z on 2^11 .. 2^14 (2^8 .. 2^14): D 0.999 (1.001); P_liou 1.218 (1.233); abs(R_liou) 1.052
  (1.102); N_liou 1.059 (1.048); N_liou - D 1.329 (1.346). P is above 7/6 in the range because the number of
  S-unit frequencies lambda^i 2^j below the cut still grows like a power of the logarithm (first a != 1 enters at
  q_h = 7^6). R_liou/(Z ln Z) lies between -0.0039 and -0.0031 from 2^8 to 2^14 while R/P falls from -0.64 to
  -0.33: consistent with Rem << Z^(1+eps), not a proof of it.
* **Bilinear law.** P_w/P_liou against the ratio of abs(m_w)^2, m_w = sum_c mu(c) w(c) V(q_c/X)/q_c: nm50
  (non-multiplicative) 0.2817 against 0.2786 (2^13), 0.2759 against 0.2780 (2^13.5), 0.2590 against 0.2636 (2^14);
  tw_liou (weight liou(c) q_c^(-i)) 0.9253 against 0.9266 (2^14), within 0.4 percent from 2^8 on. Over 2^10.5 .. 2^14 the nm50 ratios agree within 0.8 to 3.6 percent.
* **Row length.** At X = 2^12, M = 2^14, 2^12, 2^10, 2^8, 2^6: P = 944.0, 296.5, 95.3, 30.0, 9.50, ratios 3.18,
  3.11, 3.18, 3.16 per factor 4, exponent 0.82 to 0.83 against 5/6 (`check2_MX.log`).
* **Outside the theorem's range.** For M << X the remainder is not small relative to P (R/P = -0.56 to -0.58 at
  X = 2^12, M <= 2^10); Theorem A claims nothing there (Rem << X^(2+eps)/M).
* **Per-row law not seen** (`check3.log`): for single rows (120 rows with q_m <= 31, X up to 2^15) B_m(X)/X^(1/6)
  does not stabilise; each row fluctuates at the diagonal size 0.4. Only the mean square shows the term: rms over
  those rows rises from 0.40 to 0.57 for Liouville (fitted exponent +0.07) and stays 0.36 to 0.44 for weight 1
  (-0.04). The asymptotic of a single row needs X beyond the range.

Relation to earlier measurements: `c5-thin-propd-dichotomy` measured kappa = (MS - D)/M_w^2 with exponent 0.18 in Z
for the rows (5.30) with sharp cut q_m <= Z; here the same quantity is split into P (formula) and R (measured),
and the part with the sign and the 7/6 law is P.

---

## 6. General weight; THIN; where the proof stops

**Theorem C (identity for any weight) [PROVED: Lemmas 2 and 3 do not use any property of the weight].** For an
arbitrary complex weight w on squarefree indices and the class rows B_m^sigma with coefficients
mu(c) w(c) conj(gamma_1(c)), the terms with h d in U_S (F^x)^6 sum to

    P_w = (M/A) sum_{(d, c_1, c_1', h)} phi(d) q_d^(-2) y_{d c_1} conj(y_{d c_1'}) (q_c1 q_c1')^(-1) 1_{(c_1 c_1', a)=1} Wt(4 M q_h/(3 q_d q_c1 q_c1')),

y_c = mu(c) w(c) V(q_c/X) 1_sigma(c). It is a Hermitian form in the vector (mu w)(c); multiplicativity of w is
not used. When the smoothed class sums m_w(X; s) = sum_{c in sigma} mu(c) w(c) q_c^(-1-s) V(q_c/X) vary slowly,
P_w = kappa(M, X) abs(m_w(X))^2 (1 + o(1)) with kappa ≍ M^(5/6) X^(1/3) the value for y >= 0 (measured: 1 to 4
percent, section 5).

THIN (eps completely multiplicative, -1 on a set of prime ideals of exponent b, L(s, eps) = zeta_F(s) G(s) with a
simple zero at b, class-regular variant of `c5-thin-walk-replay` Theorem 2):
* **Principal term [PROVED-rel Theorem 2 there and a zero-free strip Re s > b - delta for the finitely many
  L(s, theta), theta mod f_0].** 1/L^S(s, eps theta) has in Re s > b - delta one pole, at s = b, for principal
  theta only. Then m_eps(X) = rho X^(b-1) Vhat-factor + O(X^(b-1-delta')) with rho != 0 in every class, the form
  is asymptotically rho^2 times a positive one, and P_eps ≍ M^(5/6) X^(1/3 + 2b - 2): **Z^(2b - 5/6) at
  M = X = Z**, above Z^(1+eps) exactly when b > 11/12. This is condition (N) with equality. (Without the strip
  only the Omega-statement of `c4-thin-twist-control-78` Theorem 1(v) is available, and a Hermitian form of
  indefinite sign cannot be bounded below from an Omega-statement.)
* **Remainder: the proof stops here.** For h d not in U_S (F^x)^6 the c_1-sum has Dirichlet series
  1/L^S(x, eps psi) = 1/(L^S(x, psi) G_psi(x)), psi = theta conj(chi_.(hd)), with conductor up to Z. To make Rem
  smaller than Z^(2b - 5/6) the contour must reach Re x = b - delta'' and the two inputs are
  - **T1:** abs(1/L^S(x, psi)) << (q_psi (1 + abs(Im x)))^eps on Re x >= b - delta'' for the sextic twists psi, at
    least on average over q_h <= Z. It follows from a zero-free half-plane to the left of b for that family (for
    b > 7/8 this is the conclusion of the manuscript itself, unrefereed) or, on average, from a zero-density
    estimate N(sigma, H) << H^(A(1-sigma)) with (A - 2)(1 - b) < 2b - 11/6 [HEURISTIC count, not written out].
  - **T2:** abs(G_psi(x))^(-1) << (q_psi (1 + abs(Im x)))^eps on the same line, uniformly in the conductor up to
    Z. `c5-thin-walk-replay` ("No conductor uniformity") shows the class-regular greedy construction does not
    give this: its thresholds X_{k_0(q)} are not explicit. For a random set of the same density the fluctuation
    of sum_{p in S} psi(p) q_p^(-x) is bounded by (log Z)^(1/2) times a convergent variance for Re x > b/2,
    uniformly over the Z characters, and the mean is (1/2) log L(x + 1 - b, psi) [HEURISTIC; would give T2 almost
    surely].
  The large sieve alone (Lemma 9.1) gives Rem << Z^(4/3), which is above Z^(2b - 5/6) for every b <= 1; this is
  why Liouville (where the reciprocal is L(x, psi)/L(2x, psi^2) and the line 1/2 + eps is reachable) closes and
  THIN does not.

**Which half of Proposition D fails for THIN.** Conditionally on T1 and T2: the low half, in the form "the
Liouville-type analogue of (5.36) is false for eps by Z^(2b - 11/6) when b > 11/12", by the same identity that
is proved for Liouville. Unconditionally: OPEN, and the exact step is T2 (conductor-uniform size of the thin
Euler product G_psi to the left of b), then T1.

---

## 7. Controls (run through the same algebra; no statement about zeros of zeta is made, so none has to fail)

| control | algebra | numerics (section 5) | outcome |
|---|---|---|---|
| w = 1 (periodic) | Lemma 1': 1/zeta_F^S(x), zero at x = 1; P_one = kappa abs(m_mu)^2, m_mu << exp(-c sqrt(log X)) (CLASSICAL) | abs(P_one) <= 0.021 P_liou from 2^11 on; N_one = D (1 +- 0.013) from 2^11 to 2^14 | satisfies (5.36) in the range; no principal term. A zero of zeta_F at real part beta would give P_one of order Z^(2 beta - 5/6): the bound (5.36) for weight 1 and the absence of the term above Z are the same statement as beta <= 11/12 in this quadratic form (the manuscript's Part I, not new) |
| non-multiplicative sign weights (`iid`, `nm50`) | Theorem C: P_w is a Hermitian form in mu w; multiplicativity not used | iid: abs(P) <= 6, N - D within 1.1 percent of D from 2^11 on; nm50: P = 0.24 to 0.28 P_liou, equal to the ratio of abs(m)^2 within 0.8 to 3.6 percent from 2^10.5 on | a non-multiplicative weight with a large smoothed Mertens sum violates (5.36) in the same way: this half does not carry R1 |
| unimodular twist w(c) q_c^(-i alpha), alpha = 1 | pole of Lemma 1' moves to x = 1 + i alpha; kappa unchanged, abs(m) changes by the Mellin factor of V | tw_liou: P = 0.925 P_liou, ratio of abs(m)^2 0.9266; tw_one: as one | the violation depends on the real part of the singularity of sum mu w c^(-s), not on its height: twist-covariant |
| THIN | section 6 | not run here (rounds 5, 6: coefficient of the coherent part 1.05 and 0.99 to 1.01) | conditional on T1, T2 |
| DH, backward heat, zeta(s+a) zeta(s-a), T-NR, Beurling, phase-rotated transfer operator, theta^w | not weights of the form "completely multiplicative unimodular on ideals of O" or not row objects | not run | not applicable to a statement about a row bound |

---

## 8. Outcome for Proposition D and the R3 location

* For the Liouville weight (zero of L(s, liou) = zeta_F(2s)/zeta_F(s) at s = 1, so Proposition D applies with
  beta = 1): the row bound that produces the low estimate is false (Corollary B, PROVED-rel (H2), family average).
  This removes the proof of the low estimate for a completely multiplicative unimodular non-periodic weight. That
  the low estimate itself fails for the probe, abs(I_liou) not << Z^(1/4+eps), needs the high comparison for
  I_liou; by the bilinear version of section 3 (Cauchy-Schwarz over the non-principal frequencies, (H2) on the
  row side and the non-principal part of Lemma 6.2 on the additive side) the remainder would be << Z^(1/4+eps)
  against a principal term of order Z^(1/3) [ARGUED, not written; measured in round 6: I = P to 0.3 percent].
* Filter change proposed (not written to the map): "R3 of the 7/8 mechanism for the weights liou and THIN sits in
  the low half. The periodicity input is equivalent, in the row second moment, to the absence of the term
  kappa abs(m_w)^2, kappa ≍ Z^(7/6): for a finite-ray weight m_w is a smoothed Mertens sum of mu times a
  character. The term itself is weight-blind (Hermitian form, Theorem C)."
* No headline change. Nothing here bears on zeros of zeta or of Hecke L-functions.

---

## 9. Requirement flags

All four false in the structured result.
* R1 (multiplicativity essential): not established; the opposite holds for the object studied. The principal
  term is a Hermitian form in the weight and is present for a non-multiplicative weight with the predicted
  constant (1 to 4 percent). Multiplicativity enters only in naming the singularity of sum mu w c^(-s).
* R2 (height-uniform, every window): not applicable; no statement in the height aspect. The unimodular twist
  shows the row statement is insensitive to height.
* R3 (every control fails at a named step): one control (Liouville) decided relative to (H2) for the row bound;
  THIN conditional (T1, T2); other controls not applicable. Not "every control".
* R4 (passage to the critical line): none. The lane proves that a bound fails for a control weight. It supplies
  no mechanism from finite stages or from Re s > 1 to the line, and its exponents (7/6, 2b - 5/6, the row range
  N > 7M/8) are properties of the present 7/8 architecture at its own scales.

---

## 10. Three weakest steps

1. **The remainder bound of Theorem A is not a written proof.** (H2) is recalled, not re-read; its use for
   numerators h that are not squarefree, for characters of c twisted by class functions, and the separation of
   the coupled variables (c_1, c_1', d, h) by Mellin transforms are named, not carried out. The measured
   R/(Z ln Z) in [-0.0039, -0.0031] over 2^8 .. 2^14 is compatible with the bound and with nothing sharper; over
   this range a remainder proportional to P with a slowly varying factor is not excluded by the data alone
   (R/P moves from -0.64 to -0.33).
2. **Scope of the positivity.** Non-negativity is proved for rows restricted to one class mod f_0, hence for the
   average over the character family mod f_0, not for each nu and not for the specific combinations
   B_{m,sigma} of the probe. The full completed row (cube variable) is argued only for P_0 large. Lemma 3 rests
   on the manuscript's Lemmas 4.1 and 4.4 as read from a text extraction; the modulus 72 and all numerics are in
   the conventions of `lib7.py` (no G, no xi, no b*), which are not checked against the manuscript's beyond
   (4.7); the bar on alpha in (5.30) is a reading.
3. **THIN and the probe are conditional.** T1 is the conclusion of the manuscript itself (or an unstated
   zero-density estimate); T2 is open for the class-regular construction and only heuristic for a random set;
   the positivity of the THIN form needs the asymptotic of the class Mertens sums. The statement "the low
   estimate for I_liou fails" needs the bilinear version, which is argued in two lines and not written.

## Follow-up (most valuable first)

1. Write the remainder of Theorem A in full (three Mellin variables, Euler product E, (H2) with its reduction)
   and send Theorem A + Corollary B to two referees; in the same text do the bilinear version for I_liou, which
   would make "the low estimate fails for Liouville" a theorem relative to (H2) and Lemma 6.2.
2. T2 for a random thin set (concentration over Z characters), giving an almost-sure THIN control for which
   the low half fails relative to T1.
3. A finite computation in the ray class group mod f_0 deciding for which single nu the principal constant is
   positive.

## Files

`RESULT.md`; `lib7.py`; `check1.py`, `check1.log` (pair formula, 58 pairs, 7e-15); `check2.py`, `check2.log`,
`check2.json` (M = X = 2^7 .. 2^14), `check2_MX.log`, `check2_MX.json` (M != X); `fits.py`, `fits.log`;
`check3.py`, `check3.log`, `check3.json` (single rows); `check4.py`, `check4.log` (class phases, modulus 72);
`diag.py` (split of N by pair type at one scale: coprime pairs 31.38, non-coprime off-diagonal 0.16, diagonal
213.57 at Z = 2^10).
