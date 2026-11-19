# c8-liou-row-bound-theorem: the Liouville row second moment as a theorem; the THIN conditions reduced

Date 2026-11-18. Slug `c8-liou-row-bound-theorem`. Kind: deepen (completes `c7-liou-high-row-bound`). Scope: this
directory only. Nothing committed or pushed. Local runs only (`scripts/memcap.sh 8`, single process, longest 6 min,
peak about 5 GB); the compute server was not used. One external source was opened (arXiv:1112.1650, generic client,
no project details in the request). No statement about zeros of zeta or of any L-function is made. RH open. The
7/8 manuscript (`~/lean-deps/qrh-verify/paper.txt`, unrefereed, read as text, its numbering used) is neither
confirmed nor contradicted. Score 0. Not independently refereed (section 9 is a same-author check).

Labels: PROVED (complete argument here) / PROVED-rel X (complete argument here given X) / CITED (statement read in
the source named) / CLASSICAL (textbook fact, not re-read) / MEASURED (float64, complete enumeration) / CERTIFIED
(Arb ball arithmetic with tail bounds) / ARGUED (steps named, not written line by line) / OPEN.

## Verdict

Partial result (a theorem for the obstruction record; nothing about zeros).

1. **Decisive test passed.** The decomposition N = D + P + Rem is an identity: CERTIFIED at X = M = 2^11
   (abs(N - D - P - Rem) <= 2.8e-25, P = 21.8727 > 0), MEASURED to 1e-11 at 2^11, 2^12 (four row lengths), 2^13
   (812 pairs with gcd != 1). P agrees with a density prediction written before the comparison:
   P/P_pred = 0.894, 0.937, 0.988, 0.9985, 0.9998 at X = M = 2^12, 2^14, 2^16, 2^18, 2^20 (below 5 percent from 2^16;
   the deficit at small size is class filling: two elements of one class mod 72 differ by norm at least 5184).
2. **Theorem A (PROVED-rel Lemma S and two classical inputs).** For the Liouville rows restricted to one class
   sigma mod f_0 and the Gaussian row weight: N^sigma(M, X) = D + P + Rem with D ≍ M, every term of P non-negative,
   c_3 M^(5/6) X^(1/3) <= P <= c_4 M^(5/6) X^(1/3) for C M <= X^2, and abs(Rem) <= C_eps X^(1+eps) for all M >= 1.
   The remainder bound is now written in full (section 3.4); it is sharper than the one argued in c7
   (M + X + X^2/M). Lemma S is Corollary 1.4 of Blomer-Goldmakher-Louvel (opened, statement and proof read) with
   one fixed finite-order twist; the twist does not change their proof (section 3.3).
3. **Corollary B.** At M = X = Z the family average over the ray characters mod f_0 of the squarefree part of the
   Liouville row moment is >= c Z^(7/6): the Liouville analogue of (5.39) fails by Z^(1/6 - eps) for at least one nu
   of the family, at some sharp cut Y in [Z, 4 Z log Z]. With M = Z^m, X = Z^n the analogue of (5.36), summed over
   the O-dyads, fails for 7m/8 < n < 5m/4, by Z^(4n/3 - 7m/6 - eps) (n <= m) and Z^(n/3 - m/6 - eps) (n >= m).
4. **Coherent term.** For an arbitrary weight the same frequencies give a Hermitian form P_w with non-negative
   kernel (Theorem C); P_w = abs(y)^2 P exactly for constant y = mu w, and MEASURED P_w/P = abs(mean)^2 to 0.03
   percent at 2^20 for two non-multiplicative weights. Periodic weight and random multiplicative weight: abs(P_w)/P
   = 3e-5 at 2^20 and N - D within 0.3 percent of D.
5. **THIN: not decided; T1 and T2 reduced to one bound (U), which is not known.** The remainder for THIN has
   1/L where Liouville has L. The contour has to reach Re x = beta' < 12b/7 - 15/14 (at most 9/14; 7/12 at M = X),
   not "b - delta" as c7 wrote. (U) contains a zero-free half-plane Re x > beta' for every quadratic, cubic and
   sextic twist of zeta_F: unknown, and not implied by the 7/8 manuscript. T2 is out of reach for the
   class-regular THIN even at fixed conductor (its Euler factor is continued only to b - 5/24 > beta').

Requirement flags: R1 false, R2 false, R3 false, R4 false (section 8).

---

## 0. Plan

c7 left: (a) the remainder as an argument, (b) the second-moment input recalled, (c) THIN open. Work order here:
decisive numerical test first (section 1), then the source (3.3), the contour argument (3.4), the statement
(3.5, 4), THIN (6), controls (7). New relative to c7: the certified identity; the constant of P and its limit
form; the same-class phase identity for every frequency (Lemma 3'); the remainder written with every interchange
justified and the bound X^(1+eps) uniform in M; the located source; the corrected depth for THIN.

Reading: BRIEF to the end; OBSTRUCTION_MAP control section (THIN row) and row Z25; `c7-liou-high-row-bound`
RESULT and REFEREE; `c5-thin-walk-replay` (Theorem 2, "No conductor uniformity"); manuscript (5.30), (5.31), Lemma
5.8, (5.36), (5.39); arXiv:1112.1650 pages 1-8, 17-21.

---

## 1. Decisive first test

Conventions: `lib7.py` of c7 (copied). F = Q(omega), O = Z[omega], S = {2, lambda}, f_0 = 72, classes = residues of
primary elements mod 72 (432 classes), chi_c the sextic symbol with zero values, gamma_1 the normalised Gauss sum,
V = bump on (1/2, 2), row weight exp(-pi q_m/M). Class row B_m^sigma(X) = sum over squarefree primary c in sigma
prime to 6 of conj(gamma_1(c)) chi_c(m) q_c^(-1/2) V(q_c/X). Family object: sum over the classes.

### 1.1 The identity N = D + P + Rem (`dec1.py`, `cert.py`)

N by complete row enumeration. D, P, Rem from the dual side of Lemma 2: D is h = 0; P is the closed form of Theorem
A (phi(d), norms only, no symbols) over h = l d^5 a^6; Rem is formula (2.1) with its symbols over every other
h != 0. P was also evaluated from (2.1) with symbols; the two agree to all digits, and on every principal
(pair, h) the integer exponent is 0 and r_d = phi(d) (330,396 terms, exact integer check).

| X | M | pairs (c != c') in one class | N | D | P | Rem | N - D - P - Rem | Rem/P |
|---|---|---|---|---|---|---|---|---|
| 2^11 | 2^11 | 1184 | 440.834725 | 427.949973 | 21.872691 | -8.987940 | -1e-14 | -0.411 |
| 2^12 | 2^10 | 5912 | 220.467336 | 214.055887 | 20.612037 | -14.200588 | 2e-13 | -0.689 |
| 2^12 | 2^12 | 5912 | 883.357273 | 856.223546 | 59.470542 | -32.336815 | 6e-13 | -0.544 |
| 2^12 | 2^14 | 5912 | 3523.640186 | 3424.894184 | 161.275169 | -62.529168 | 8e-13 | -0.388 |
| 2^12 | 2^16 | 5912 | 14001.762174 | 13699.576737 | 399.833400 | -97.647962 | -2e-12 | -0.244 |
| 2^13 | 2^13 | 24654 (812 with d != 1) | 1805.989368 | 1711.746251 | 136.812525 | -42.569408 | -1e-11 | -0.311 |

CERTIFIED (`cert.py`, `cert_11.log`; python-flint 0.9.0, 128 bits; symbol exponents and multiplicities are exact
integers, exponentials, V, Gauss sums from the definition and sixth roots of unity are balls; rows q_m <= 48893
and frequencies up to the pair-dependent cut, tails bounded with r(q) <= 6q, abs(r_d) <= q_d): at X = M = 2^11

    N   = 440.83472507520104740049 (22 digits enclosed),   D = 427.94997328884916272867
    P   = 21.872691364628876043964 > 0,                     Rem = -8.9879395782769913721432
    abs(N - (D + P + Rem)) <= 2.76e-25 for the untruncated sums.

Limits of this check: at these sizes no same-class pair exists below X = 2^10 and classes hold about 2 to 8
elements, so the family object is mostly diagonal; Rem/P is between -0.31 and -0.69 with no trend. The data do
not test the size of Rem (section 9, item 2).

### 1.2 P against the predicted constant (`pred.py`)

Prediction (derived before the run; local densities of pairs of squarefree ideals, equidistribution in classes):

    P_fam,pred(M, X) = (M/(A h_0)) K_1 sum_{l in U_S ∩ O} sum_{b primary, (b,S)=1} kappa_b J(4 pi M q_l q_b^6/(3 X^2)),
    J(y) = int int V(u) V(u') exp(-y/(u u')) du du'/(u u'),   A = sqrt(3)/2,  h_0 = 432,
    K_1 = rho_F^2 (2/3)^2 (3/4)^2 prod_{p not in S} (1 - 1/q_p)^2 (1 + 2/q_p) = 0.075316,  rho_F = pi/(3 sqrt 3),
    kappa_b = prod_{p | b} (1 + (q_p - 1)/q_p^2)/(1 + 2/q_p)

(the local factor at p | b counts pairs with p dividing both, weight phi; at p not dividing b pairs with p
dividing at most one). Limit form: P_fam ~ C_inf M^(5/6) X^(1/3),

    C_inf = (6 E_S rho_b Gamma(7/6) (3/(4 pi))^(1/6) K_1 I_V^2)/(A h_0) = 5.0915e-3,
    E_S = 1/((1 - 3^(-1/6))(1 - 4^(-1/6))) = 28.97,  rho_b = 0.283932,  I_V = int V(u) u^(-5/6) du = 0.837443.

The limit is approached like (X^2/M)^(-1/6) log, because sum over S-units of q_l^(-1/6) converges slowly; the
finite-size formula P_pred is the object of the test. P by exact enumeration of all same-class pairs (exact gcd
in Z[omega], all d):

| X = M | same-class pairs (unordered) | with d != 1 | P_fam | P_pred | P/P_pred | P/(C_inf M^(5/6) X^(1/3)) | per class min .. max of P^sigma/(P_pred/432) |
|---|---|---|---|---|---|---|---|
| 2^12 | 2956 | 0 | 59.4705 | 66.5505 | 0.8936 | 0.713 | |
| 2^14 | 53,327 | 1794 | 346.7809 | 370.1287 | 0.9369 | 0.825 | |
| 2^16 | 878,058 | 41,030 | 1942.6086 | 1966.4829 | 0.9879 | 0.917 | 0.733 .. 1.158 |
| 2^18 | 14,202,380 | 738,713 | 10142.9277 | 10158.3152 | 0.9985 | 0.950 | 0.907 .. 1.060 |
| 2^20 | 227,928,985 | 12,287,729 | 52016.9147 | 52029.6103 | 0.9998 | 0.967 | 0.976 .. 1.021 |

Same ratios at M = X/16 (0.9361, 0.9875, 0.9983, 0.9997) and M = 4X (0.9373, 0.9879, 0.9985). The value at 2^12
equals the one of `dec1.py` (59.470542) from independent code. Sign: every term is >= 0. The part with d != 1 is
0.35 percent of P at X = M = 2^20 and 1.3 percent at M = X/16, inside the prediction through kappa_b.

Outcome: no mismatch above 5 percent from 2^16 on; the 10.6 and 6.3 percent at 2^12 and 2^14 are explained (class
filling; they shrink at the rate of the pair count). The lane continues.

---

## 2. Algebra kept from c7 (statements; proofs there, re-derived by its referee)

Notation: q_x = N(x); c, c' squarefree, primary, prime to S; d = gcd(c, c'), c = d c_1, c' = d c_1', k = d c_1 c_1';
U_S = group generated by units and generators of the primes of S; A = sqrt(3)/2.
S may be any finite set of primes containing 2 and lambda; f_0 any modulus with support in S divisible by 72 and by
the primes of S; numerics use the minimal choice.

**Lemma 1 [PROVED from manuscript (4.7)].** mu(c) gamma_2(c) conj(alpha(c)) = G(c) conj(gamma_1(c)); the squarefree
part of the row (5.30) with weight w is sum_c [mu(c) w(c)] G(c) nu(c) conj(gamma_1(c)) chi_c(m) q_c^(-1/2) V(q_c/X).

**Lemma 2 (pair Poisson formula) [PROVED; CERTIFIED in the summed form of 1.1].**

    sum_{m in O} exp(-pi q_m/M) chi_c(m) conj(chi_c'(m)) = (M/(A q_k)) sum_{h in O} exp(-4 pi M q_h/(3 q_k)) psihat(h),

and with a(c) = x_c conj(gamma_1(c)):

    a(c) conj(a(c')) psihat(h) = x_c conj(x_c') (q_c1 q_c1')^(1/2) r_d(h)
        conj(chi_d(c_1)) chi_d(c_1') chi_c1(c_1') conj(chi_c1'(c_1)) conj(chi_c1(h)) chi_c1'(-h),                 (2.1)

r_d(h) = prod_{p | d} (q_p 1_{p | h} - 1). In particular abs(r_d(h)) <= q_{gcd(d, h)} <= q_d, and for h = 0 the
term vanishes unless c = c'.

**Lemma 3' (same-class phase, all frequencies) [PROVED-rel sextic reciprocity in Hilbert-symbol form, CLASSICAL;
MEASURED exhaustively].** If c ≡ c' mod f_0, then for every h in O

    conj(chi_d(c_1)) chi_d(c_1') chi_c1(c_1') conj(chi_c1'(c_1)) conj(chi_c1(h)) chi_c1'(-h) = conj(chi_c1(hd)) chi_c1'(hd).   (2.2)

Proof. For coprime primary a, b prime to S put R(a, b) = chi_b(a) conj(chi_a(b)). By the product formula for the
sextic Hilbert symbol, R(a, b) is the product of the local symbols at the primes above 6; these are continuous and
trivial on 1 + 8 O_2 (squares; cubes since 2 does not divide 3) and on 1 + lambda^4 O_lambda (cubes: exponent above
3e/2 = 3; squares since lambda does not divide 2). Hence R(a, b) depends only on a, b mod 72 [CLASSICAL].
(i) conj(chi_d(c_1)) chi_d(c_1') = conj(R(c_1, d)) R(c_1', d) conj(chi_c1(d)) chi_c1'(d) = conj(chi_c1(d)) chi_c1'(d),
because c_1 ≡ c_1' mod f_0 (d is invertible mod f_0). (ii) With delta = c_1' - c_1, divisible by 72:
chi_c1(c_1') = chi_c1(delta), chi_c1'(c_1) = chi_c1'(-delta), so chi_c1(c_1') conj(chi_c1'(c_1)) chi_c1'(-1) =
chi_c1(delta) conj(chi_c1'(delta)). The function c -> chi_c(delta) on primary c prime to delta is the Kummer
character of F(delta^(1/6)); its conductor divides 8 lambda^4 times the product of the primes dividing delta
[CLASSICAL: tame outside 6, wild exponents at most 3 at 2 and 4 at lambda], hence divides delta. Since
c_1 ≡ c_1' mod delta, the two values agree. (iii) chi_c1'(-h) = chi_c1'(-1) chi_c1'(h). Multiply. QED
Check (`check_star.py`, exact integer exponents): the h-free identity of (i)-(ii) holds on all 106,654 ordered
same-class pairs at X = 2^14 (3588 with d != 1). It also holds with classes mod 36, 24, 12 and fails mod 18, 9,
6, 3 (41,338 of 109,074 at mod 18): the symmetric part needs only the modulus 12; the modulus 72 is needed for
chi_c(l), l in U_S (c7 `check4.py`).

**Lemma 3 (principal frequencies) [PROVED-rel the same classical facts; CERTIFIED exact on 330,396 terms].** If
h d = l b^6 with l in U_S and b prime to S, then d | b, h = l d^5 a^6 with b = d a, the right side of (2.2) is
1_{(c_1 c_1', a) = 1} (chi_c(l) is a function of the class of c mod f_0), and r_d(h) = phi(d).

---

## 3. Theorem A

### 3.1 Statement

Fix S, f_0, a class sigma mod f_0 of primary elements prime to S, and V >= 0 smooth with compact support in
(0, infinity), not identically 0. For M >= 1, X >= 1 put

    B_m(X) = sum_{c squarefree, primary, (c, S) = 1, c in sigma} conj(gamma_1(c)) chi_c(m) q_c^(-1/2) V(q_c/X),
    N(M, X) = sum_{m in O} exp(-pi q_m/M) abs(B_m(X))^2.

**Theorem A.** N(M, X) = D + P + Rem, where
* D = (M/A) sum_{c in sigma} phi(c) q_c^(-2) V(q_c/X)^2, and c_1 M <= D <= c_2 M for X >= X_0;
* P = (M/A) sum over ordered pairs (c, c') in sigma^2 and h = l d^5 a^6 (l in U_S ∩ O, a primary prime to S,
  (a, c_1 c_1') = 1) of phi(d) V(q_c/X) V(q_c'/X) (q_c q_c')^(-1) exp(-4 pi M q_l q_d^6 q_a^6/(3 q_c q_c')):
  every term is >= 0, and c_3 M^(5/6) X^(1/3) <= P <= c_4 M^(5/6) X^(1/3) for X >= X_0 and C M <= X^2;
* abs(Rem) <= C_eps M^(-eps) X^(1+5 eps) for every eps > 0, M >= 1, X >= 1.

Constants depend on S, f_0, V (and eps). Status: PROVED-rel Lemma S (3.3) and the classical inputs of Lemma 3'.

### 3.2 The decomposition and the principal term [PROVED]

Open the square, apply Lemma 2 with x_c = q_c^(-1/2) V(q_c/X) 1_sigma(c) and Lemma 3'. The term of the ordered pair
(c, c') and the frequency h is

    (M/A) V(q_c/X) V(q_c'/X) (q_c q_c')^(-1) r_d(h) conj(chi_c1(g)) chi_c1'(g) exp(-4 pi M q_h/(3 q_k)),  g = h d.     (3.1)

(x_c x_c' (q_c1 q_c1')^(1/2)/q_k = 1/(q_c q_c').) The double sum over pairs and h converges absolutely (finitely
many pairs; Gaussian in h). D is the part h = 0 (only c = c', r_c(0) = phi(c)). P is the part h != 0,
g in U_S (F^x)^6; by Lemma 3 its terms are the ones displayed, all >= 0. Rem is the part h != 0, g not in
U_S (F^x)^6. D ≍ M: phi(c)/q_c >= prod over the primes of c, and the number of c in sigma with V(q_c/X) >= v_0 is
≍ X (lattice count below).

Lattice counts used [PROVED, elementary]. For a residue class of an ideal (t) of O: the number of its elements of
norm <= Y is 2 pi Y/(sqrt(3) q_t) + O((Y/q_t)^(1/2) + 1). With rho_0 = 2 pi/(sqrt(3) q_{f_0}) and
s_2 = sum_{p not in S} q_p^(-2) <= 2/49 + 2/169 + 2/361 + 1/625 + sum_{n >= 31} 2/n^2 < 0.13:

Lower bound for P. Let [u_1, u_2] be an interval on which V >= v_0 > 0, R = (u_2 - u_1) X. Keep d = 1, l = 1 and
a in the set A_Y of primary a prime to S with q_a <= Y := (0.16 u_1^2 X^2/M)^(1/6) and s_a := sum_{p | a} 1/q_p <= 1/2.
For such a and q_c, q_c' >= u_1 X the exponential is >= exp(-pi 0.22) >= 1/2. Let n(a) be the number of squarefree c in
sigma with q_c/X in [u_1, u_2] and (c, a) = 1, and n(a; p) the number of those divisible by p. Then
n(a) >= rho_0 R (1 - s_2 - s_a) - O(X^(1/2) log X) (remove multiples of p^2 and of the primes of a),
n(a; p) <= rho_0 R/q_p + O((X/q_p)^(1/2) + 1), and the number of ordered coprime pairs is at least
n(a)^2 - sum_p n(a; p)^2 >= rho_0^2 R^2 ((1 - 0.13 - 0.5)^2 - 0.13) - O(X^(3/2)) >= 0.006 rho_0^2 R^2 for X >= X_0.
(Pairs with c = c' share a prime and are not counted.) Also sum_{q_a <= Y} s_a <= rho_1 Y s_2 + O(Y^(1/2)), with
rho_1 Y (3/4)(1 + o(1)) the number of primary a of odd norm up to Y, so by Markov's inequality
abs(A_Y) >= (3/4 - 2 s_2 - o(1)) rho_1 Y >= 0.49 rho_1 Y for Y >= Y_0. Therefore

    P >= (M/(2A)) abs(A_Y) v_0^2 (u_2 X)^(-2) 0.006 rho_0^2 R^2 >= c_3 M Y >= c_3' M^(5/6) X^(1/3)       (X >= X_0, X^2 >= C M).

Upper bound for P. With T_0 = 3 (2 X_V X)^2/(4 pi M) (X_V the upper end of the support of V) the exponential is at
most exp(-q_l q_d^6 q_a^6/T_0). sum_a exp(-q_a^6 y) <= C (1 + y^(-1/6)) exp(-y/2) (lattice count), so the sum over a
and l is <= C (T_0^(1/6)/q_d + log^2(2 + T_0) 1_{q_d^6 <= C T_0 log T_0}), since sum_l q_l^(-1/6) converges. The pairs
with gcd d have sum of V V/(q_c q_c') <= C/q_d^2, and phi(d) <= q_d. Hence P <= C M (T_0^(1/6) + log^3(2 + T_0)) <=
c_4 M^(5/6) X^(1/3) for X^2 >= M. QED (principal term)

Remark (constant) [MEASURED, section 1.2; derivation by local densities ARGUED]. P^sigma ~ (C_inf/h_0) M^(5/6) X^(1/3)
as X^2/M -> infinity, the same for every class; the finite-size form P_pred/h_0 holds within 2.4 percent in each
of the 432 classes at X = M = 2^20 and within 0.02 percent in the sum.

### 3.3 The second-moment input: located source

Source opened: V. Blomer, L. Goldmakher, B. Louvel, "L-functions with n-th order twists", arXiv:1112.1650v1
(journal version: Int. Math. Res. Not. 2014; only the arXiv text was read). K a number field containing the n-th
roots of unity, n >= 3, d = [K : Q]; S a finite set of places containing the divisors of n with O_S of class
number 1; I(S) the ideals prime to S; chi_a (a in I(S)) the primitive n-th order Hecke character attached to a.

* **[CITED] BGL Lemma 2.1.** chi_a is a primitive n-th order Hecke character of trivial infinite type;
  chi_{a b^n} = chi_a; if a = a_1 a_2^n with a_1 n-th power free and a_0 the squarefree kernel of a_1, the conductor
  of chi_a lies between a_0 and c a_0 (c a fixed ideal supported on S).
* **[CITED] BGL Appendix II.** For coprime a, b in I(S): chi_a(b) = (x m_E/b)_n, where a = (x) E g^n, x ≡ 1 mod c,
  E in a fixed finite set of ideals with fixed generators m_E as O_S-ideals, and (./b)_n is the n-th power residue
  symbol.
* **[CITED] BGL Theorem 1.3.** For M, N >= 1/2 and complex lambda_b: sum over squarefree a in I(S), N a <= M, of
  abs(sum over squarefree b in I(S), N b <= N, of lambda_b chi_a(b))^2 << (MN)^eps (M + N + (MN)^(2/3)) sum abs(lambda_b)^2.
* **[CITED] BGL Corollary 1.4 and (5.1).** sum_{a in I(S), N a <= N} abs(L(1/2 + it, chi_a))^2 << (N (1 + abs(t))^(d/2))^(1+eps);
  the sum is over all ideals of I(S), squarefree or not.

This is the theorem the manuscript's Lemma 9.1 points to; c7's "(H2)" was a recalled form of it on the line
1/2 + eps with a twist. What is needed here, for K = F = Q(omega), n = 6, d = 2:

**Lemma S (twisted form, line 1/2 + eps).** Let Theta be a finite set of Hecke characters of F of finite order
with conductor supported on S. For theta in Theta and a in I(S) let xi = xi_{theta,a} be the primitive character
inducing theta conj(chi_a), and suppose a is not a sixth power (so xi is not principal, by Lemma 2.1). Then for
eps > 0, eta > 0, tau real:

    sum_{a in I(S), a not a sixth power} (N a)^(-1-eta) abs(L(1/2 + eps + i tau, xi_{theta,a}))^2 <<_{eps,eta} (1 + abs(tau))^(1+eta).

Proof [PROVED-rel BGL Theorem 1.3 and the proof of BGL Corollary 1.4 as printed].
(a) Critical line, twisted. In the proof of BGL Corollary 1.4 (their p. 17-18) the approximate functional equation
of [IK, Thm 5.3] is applied to the primitive character chi_a, the variable b is split as b_0 b_1 b_2 (S-part,
squarefree, squarefull), the sums over b_0 b_2 converge absolutely, and Theorem 1.3 is applied to the sum over
squarefree a_0 with coefficients lambda_{b_1} = chi_{a_1}(b_1) N b_1^(-1/2 - eps -+ it - iy). For xi_{theta,a} the
approximate functional equation holds in the same form (xi is primitive, of conductor between a_0 and c f_theta a_0,
same gamma factor), xi(b) = theta(b) conj(chi_a(b)) for b prime to S a_0, and the factor theta(b_1) is absorbed
into lambda_{b_1}; the conjugate character is covered by abs(L(1/2 + it, theta conj(chi_a))) =
abs(L(1/2 - it, conj(theta) chi_a)). Nothing else in the proof refers to the character. This gives
sum_{N a <= N} abs(L(1/2 + it, xi_{theta,a}))^2 << (N (1 + abs(t)))^(1+eps). For theta = 1 this is BGL Corollary 1.4
verbatim.
(b) From 1/2 to 1/2 + eps. For xi not principal L(s, xi) is entire of finite order. For s = 1/2 + eps + i tau,
(1/2 pi i) int_{Re w = 2} L(s + w, xi) e^{w^2} dw/w = L(s, xi) + (1/2 pi i) int_{Re w = -eps} L(s + w, xi) e^{w^2} dw/w.
The left side is bounded by zeta_F(2)-type constants. Hence, by Cauchy-Schwarz,
abs(L(s, xi))^2 <<_eps 1 + int abs(L(1/2 + i(tau + v), xi))^2 e^{-v^2} dv.
(c) Sum (b) over N a in dyadic ranges with (a) and the weight (N a)^(-1-eta), eps < eta/2. QED

Status of Lemma S: the only step not printed in the source is the insertion of the fixed twist theta in (a).

**From elements to the family.** Let g in O, g != 0, g = l g' with l in U_S ∩ O and g' primary prime to S (unique),
a = (g'). By BGL Appendix II, g' = u x m_E g_0^6 with u an S-unit, so for primary c prime to S g:
chi_c(g) = (g/(c))_6 = theta_{l u}((c)) chi_a((c)), theta_v := (v/.)_6. The characters theta_v, v in U_S/U_S^6, form a
finite set, each a Hecke character with conductor supported on S [CLASSICAL: Kummer character of F(v^(1/6))].
Hence, for theta a ray character mod f_0, the function psi(c) = theta(c) conj(chi_c(g)) on primary c prime to S
satisfies: psi(c) = xi_{theta',a}((c)) 1_{(c, g') = 1} with theta' = theta conj(theta_{l u}) in a finite set Theta, and

    L^S(x, psi) := sum_{c} psi(c) q_c^(-x) = L(x, xi_{theta',a}) prod_{p in S or p | g'} (1 - xi_{theta',a}(p) q_p^(-x)).       (3.2)

psi is principal exactly when a is a sixth power, that is g in U_S (F^x)^6 (class number one). For Re x >= 1/2 the
finite product is at most 2^(omega(g)+abs(S)) in absolute value. Each a in I(S) arises from the elements g = l g',
l in U_S ∩ O, and sum_l q_l^(-1-eta) < infinity. So Lemma S gives, for every theta mod f_0,

    sum_{g in O, g not in U_S (F^x)^6} q_g^(-1-eta) 4^(omega(g)) abs(L^S(1/2 + eps + i tau, theta conj(chi_.(g))))^2 <<_{eps,eta} (1 + abs(tau))^(1+eta).   (3.3)

(4^(omega(g)) << q_g^(eta/4) is absorbed by lowering eta.)

### 3.4 The remainder: contour argument in full [PROVED-rel Lemma S]

Step 1 (shape). By (3.1), with sigma_d the class sigma d^(-1),

    Rem = (M/A) sum_d q_d^(-2) sum_{h != 0, hd not in U_S (F^x)^6} r_d(h) sum_{c_1, c_1'} conj(chi_c1(g)) chi_c1'(g)
          V(q_d q_c1/X) V(q_d q_c1'/X) (q_c1 q_c1')^(-1) exp(-4 pi M q_h/(3 q_d q_c1 q_c1')),

the inner sum over squarefree primary c_1, c_1' in sigma_d, prime to S d, with (c_1, c_1') = 1. The pair
c_1 = c_1' = 1 (that is c = c' = d) is included.

Step 2 (Mellin in the row variable). For y > 0 and kappa = 1 + eps: exp(-pi y) = (1/2 pi i) int_{Re z = kappa}
Gamma(z) (pi y)^(-z) dz, absolutely convergent. With y = 4 M q_h/(3 q_d q_c1 q_c1'):

    Rem = (M/A) (1/2 pi i) int_{(kappa)} Gamma(z) (4 pi M/3)^(-z) sum_d q_d^(-2+z) sum_h r_d(h) q_h^(-z)
          sum_{c_1, c_1'} conj(chi_c1(g)) chi_c1'(g) V V (q_c1 q_c1')^(-1+z) dz.

Interchange: for fixed X the sums over d, c_1, c_1' are finite; sum_h abs(r_d(h)) q_h^(-kappa) <=
sum_{t | d} q_t sum_{t | h} q_h^(-kappa) < infinity; Gamma decays exponentially on the line. Fubini applies.

Step 3 (coprimality). 1_{(c_1, c_1') = 1} = sum_{e | (c_1, c_1')} mu(e). Write c_1 = e c_2, c_1' = e c_2' (squarefree,
so (c_2, e) = (c_2', e) = 1). The symbol is multiplicative in the lower entry:
conj(chi_{e c_2}(g)) chi_{e c_2'}(g) = 1_{(e, g) = 1} conj(chi_c2(g)) chi_c2'(g). The double sum becomes

    sum_{e squarefree, (e, S d g) = 1} mu(e) q_e^(-2+2z) Phi_{d,e,g}(z) Phi^*_{d,e,g}(z),
    Phi_{d,e,g}(z) = sum_{c_2 squarefree primary, (c_2, S d e) = 1, c_2 in sigma_{de}} conj(chi_c2(g)) q_c2^(-1+z) V(q_d q_e q_c2/X),

and Phi^*(z) = conj(Phi(conj z)). The sums are finite (q_e <= X_V X/q_d).

Step 4 (one character sum; this is where Liouville is used). Fix d, e, g = hd not in U_S (F^x)^6, and z = kappa + iy.
Expand the class condition: 1_{sigma_{de}}(c_2) = (1/h_0) sum_theta conj(theta(sigma_{de})) theta(c_2), theta over the
characters of the group of classes mod f_0. Mellin inversion for V (Vt(s) = int V(u) u^(s-1) du, entire, rapidly
decreasing on vertical lines): with X' = X/(q_d q_e),

    Phi_{d,e,g}(z) = (1/h_0) sum_theta conj(theta(sigma_{de})) (1/2 pi i) int_{Re s = 3} Vt(s) X'^s A_theta(s + 1 - z) ds,
    A_theta(x) = sum_{c_2 squarefree primary, (c_2, S d e) = 1} psi(c_2) q_c2^(-x),  psi = theta conj(chi_.(g)).

psi is completely multiplicative on primary elements prime to S, so for Re x > 1

    A_theta(x) = prod_{p not in S, p not dividing de} (1 + psi(p) q_p^(-x)) = (L^S(x, psi)/L^S(2x, psi^2)) prod_{p | de} (1 + psi(p) q_p^(-x))^(-1).   (3.4)

The weight on the squarefree c is identically 1 because mu(c) liou(c) = 1; this is the only use of the Liouville
weight, and it is what puts L in the numerator. By (3.2) the right side of (3.4) continues to Re x > 1/2 as a
holomorphic function (psi not principal; the last product has its poles on Re x = 0; 1/L^S(2x, psi^2) is an
absolutely convergent product for Re x > 1/2), of polynomial growth on vertical lines [CLASSICAL: convexity bound
for Hecke L-functions]. Move the s-line to Re s = eps + 1/2 + eps = 1/2 + 2 eps, so that x = s + 1 - z has real part
1/2 + eps; no pole is crossed, and the horizontal integrals vanish because Vt decays faster than any power. On the
new line abs(1/L^S(2x, psi^2)) <= zeta_F(1 + 2 eps), abs(prod_{p | de}(1 + psi(p) q_p^(-x))^(-1)) <=
prod_{p | de} (1 - q_p^(-1/2))^(-1) <= C_eps (q_d q_e)^eps (norms are >= 7). Therefore, with Cauchy-Schwarz and
int abs(Vt(1/2 + 2 eps + iv)) dv < infinity,

    abs(Phi_{d,e,g}(kappa + iy))^2 <= C_eps X'^(1+4 eps) (q_d q_e)^(2 eps) sum_theta int abs(Vt(1/2 + 2 eps + iv))
                                      abs(L^S(1/2 + eps + i(v - y), theta conj(chi_.(g))))^2 dv.                       (3.5)

The same bound holds for Phi^*(kappa + iy) with y replaced by -y. (If X' < 1/X_V' the sum is empty.)

Step 5 (assembling). abs(Phi Phi^*) <= (abs(Phi)^2 + abs(Phi^*)^2)/2 and abs(Gamma(kappa + iy)) is even in y, so

    abs(Rem) <= C M^(-eps) int abs(Gamma(kappa + iy)) sum_{d, e} q_d^(-1+eps) q_e^(2 eps) sum_h abs(r_d(h)) q_h^(-1-eps)
                abs(Phi_{d,e,hd}(kappa + iy))^2 dy.

Insert (3.5): the powers of q_d are -1 + eps - 1 - 4 eps + 2 eps = -2 - eps, of q_e: 2 eps - 1 - 4 eps + 2 eps = -1, and
X^(1+4 eps) comes out. The sum over e (squarefree, q_e <= X_V X) of 1/q_e is <= C log(2X). For the sum over d and h
put g = hd:

    sum_d q_d^(-2-eps) sum_h abs(r_d(h)) q_h^(-1-eps) F(hd) = sum_g q_g^(-1-eps) F(g) sum_{d | g, d squarefree} q_d^(-1) abs(r_d(g/d))
                                                         <= sum_g q_g^(-1-eps) 2^(omega(g)) F(g),

for F >= 0, because abs(r_d) <= q_d. With F(g) = abs(L^S(1/2 + eps + i(v - y), theta conj(chi_.(g))))^2 restricted to
g not in U_S (F^x)^6, (3.3) bounds the g-sum by C (1 + abs(v - y))^(1+eps). The remaining integral
int int abs(Gamma(kappa + iy)) abs(Vt(1/2 + 2 eps + iv)) (1 + abs(v - y))^(1+eps) dv dy is finite. Result:

    abs(Rem) <= C_eps M^(-eps) X^(1+4 eps) log(2X) <= C_eps' M^(-eps) X^(1+5 eps).     QED

What each bound rests on: Fubini (absolute convergence, shown); (3.4) (Euler product, PROVED); continuation and
polynomial growth of Hecke L-functions (CLASSICAL); identification of chi_.(g) with the BGL family (CITED Appendix
II + CLASSICAL Kummer characters of S-units); Lemma S (PROVED-rel BGL Theorem 1.3); (2.2) (Lemma 3').

Difference from c7: c7 kept the frequency sum truncated and paid M + X + X^2/M. With Re z = 1 + eps the frequency
sum converges absolutely and the divisor structure of r_d costs only 2^(omega(g)); the bound is X^(1+eps) for every
M. For M >= X^(2+delta) the true size is far smaller (take Re z large); not needed.

### 3.5 Sharp cut

Let S(Y) = sum_{0 < q_m <= Y} abs(B_m)^2. Then N(M, X) <= S(M) + sum_{j >= 1} exp(-pi 2^(j-1)) S(2^j M), and
S(Y) <= C Y X trivially (B_0 = 0, since chi_c(0) = 0 for c != 1). If S(2^j M) <= eta (2^j M)^a X^b for all
0 <= j <= J := log_2(4 log X) with 0 <= a <= 2, then N <= 1.4 eta M^a X^b + O(X^(-4) M). So a lower bound
N >= 2 eta M^a X^b gives a Y in [M, 4 M log X] with S(Y) > eta Y^a X^b (constants adjusted). [PROVED]

---

## 4. Corollary B (the Liouville analogue of (5.36)/(5.39) fails by a stated power)

**Corollary B [PROVED-rel Theorem A and manuscript (4.7) with G a function of the class mod f_0].** Let X_0 be the
family of all ray characters nu mod f_0, h_0 their number. By Lemma 1 and Parseval on the class group,

    (1/h_0) sum_{nu in X_0} sum_m exp(-pi q_m/M) abs(C^sf_V(X; m, liou nu))^2 = sum_sigma N^sigma(M, X)
          >= h_0 (c_3 M^(5/6) X^(1/3) - C_eps X^(1+eps))      for X >= X_0, C M <= X^2

(D >= 0 dropped). Consequences, with M = Z^m, X = Z^n:
* m = n = 1: the family average is >= c Z^(7/6). The statement "sum_{0 < q_m <= C_m Z} abs(C^sf_V(Z; m, liou nu))^2 <<
  Z^(1+eps) for each nu of a fixed finite family" (the squarefree part of the Liouville analogue of (5.39)) is false
  for at least one nu in X_0, at some cut in [Z, 4 Z log Z], by the factor Z^(1/6 - eps).
* General exponents: the bound (5.36) summed over the O-dyads is Z^(max(m, 2m - n) + eps). The lower bound
  Z^(5m/6 + n/3) exceeds it and exceeds the remainder Z^(n + eps) exactly for 7m/8 < n < 5m/4 (and n > m/2 holds
  there). The factor of failure is Z^(4n/3 - 7m/6 - eps) for 7m/8 < n <= m and Z^(n/3 - m/6 - eps) for m <= n < 5m/4
  (supremum 1/4 per unit m, at n -> 5m/4).

Not established here: which O-dyad of (5.36) fails (the sum over dyads fails); the statement for each single nu;
the completed row with the cube variable n of (5.30). For the completed row: Minkowski over n with Theorem A at
the scales X/q_n^3 gives norm >= P^(1/2) (1 - C_0 sum_{n != 1} q_n^(-3/2)) - O(M^(1/2) log X + X^(1/2+eps)), C_0^2 = c_4/c_3
[ARGUED]. With the measured asymptotic of P, C_0 = 1 and the sum is about 0.3 for S = {2, lambda}; with the proved
constants it holds only when S contains all primes up to a large P_0.

---

## 5. Theorem C (general weight) and the coherent term

**Theorem C [PROVED: Lemmas 2, 3, 3' do not use the weight].** For any complex weight y on the squarefree c (in the
row: y = mu w) and class rows with coefficients y_c conj(gamma_1(c)): N_y = D_y + P_y + Rem_y, D_y the same sum as D
with abs(y_c)^2, and

    P_y = sum over ordered pairs (c, c') in sigma^2 of y_c conj(y_c') K(c, c'),
    K(c, c') = (M/A) phi(d) V V (q_c q_c')^(-1) sum_{l, a: (a, c_1 c_1') = 1} exp(-4 pi M q_l q_d^6 q_a^6/(3 q_c q_c')) >= 0.

Multiplicativity of w is not used. For y constant, P_y = abs(y)^2 P exactly. So for Liouville (y = 1) the coherent
term is present with kappa = P ≍ M^(5/6) X^(1/3), that is kappa ≍ Z^(7/6) at M = X = Z; this is the term
kappa abs(m_w)^2 of c5/c7 with m_w the normalised mean of mu w.

For y not constant the law P_y = abs(mean of y)^2 P (1 + o(1)) is MEASURED (section 7), not proved. For the periodic
weight (y = mu) the product structure in u u' allows a proof that P_mu = o(P): the kernel depends on q_c q_c' only
through the product, a Mellin transform in that variable factors the pair sum into two class Mertens sums of mu,
each << exp(-c sqrt(log X)) by the prime ideal theorem for the characters mod f_0 [ARGUED; CLASSICAL inputs].
Rem_y for y = mu is not bounded by this method (1/L instead of L); the manuscript bounds the whole moment by
reflection (Lemma 5.8, not replayed).

---

## 6. THIN: T1 and T2

THIN weight: eps completely multiplicative, eps(p) = -1 on a thin set T of prime ideals of exponent b, +1
elsewhere; row weight y = mu eps, that is y_c = mu(part of c outside T). Dirichlet series of one dual frequency:
sum_c y_c psi(c) q_c^(-x) = 1/L^S(x, eps psi) = 1/(L^S(x, psi) G_psi(x)), G_psi(x) = prod_{p in T} (1 - psi(p) q_p^(-x))/(1 + psi(p) q_p^(-x)).

Sections 3.2 and 3.4 go through with A_theta replaced by 1/(L^S(x, psi) G_psi(x)) prod_{p | de}(..)^(-1) [ARGUED: same
steps; y_{d e c_2} = y_d y_e y_c2 on squarefree products]. Two changes:

(a) Principal term. P_eps is the Hermitian form of Theorem C. With the class Mertens asymptotic of mu eps (pole of
1/L(x, eps) at x = b; PROVED-rel `c5-thin-walk-replay` Theorem 2 and a zero-free strip for the characters mod f_0),
P_eps ≍ M^(5/6) X^(1/3) X^(2b-2).

(b) Remainder. If on a line Re x = beta' one has abs(1/L^S(x, eps psi)) << (q_g (1 + abs(Im x)))^eta for all the
characters psi = theta conj(chi_.(g)), the same assembling gives Rem_eps << M^(-eps) X^(2 beta' + eps) (the factor
X'^(1/2+2eps) of (3.5) becomes X'^(beta'+eps); Lemma S is not needed, the g-sum converges by itself). For the
conclusion one needs X^(2 beta') < P_eps and P_eps above the bound max(M, M^2/X). With M = X^mu:

    beta' < b - 5/6 + 5 mu/12,   mu < 12b - 10 (mu <= 1),   mu < (6/7)(2b - 2/3) (mu >= 1).

At M = X: beta' < b - 5/12 (so beta' < 7/12 even at b = 1). Best over mu: **beta' < 12b/7 - 15/14**, which lies in
(1/2, 9/14] for b in (11/12, 1]. c7 wrote "the contour must reach Re x = b - delta''": that is not sufficient;
the depth is at least 5/14 to the left of b.

**Reduction.** T1 and T2 of c7 are the two factors of one statement:

    (U_beta')  abs(1/L^S(x, eps theta conj(chi_.(g)))) <=  C_eta (q_g (1 + abs(Im x)))^eta  on Re x = beta', for all
               g in O not in U_S (F^x)^6 (a mean-square version over g with weight q_g^(-1-eps) suffices),

with beta' < 12b/7 - 15/14. Relative to (U_beta') and the Mertens asymptotic in (a), the low half of Proposition D
fails for THIN [ARGUED].

**Is (U_beta') known? No.**
* T1 part. (U_beta') implies L(x, xi) != 0 for Re x > beta' for every xi = theta' conj(chi_a): all sextic, cubic
  (a a square) and quadratic (a a cube) twists of zeta_F of every conductor (those of norm up to about X^2/M carry the sum). No zero-free
  half-plane is known for any of these; the 7/8 manuscript concerns the target only and, if correct, would give
  nothing below 7/8 > 9/14. A zero-density theorem does not replace it: BGL Corollary 1.6 gives at most
  N^(g(sigma)+eps) exceptional characters of norm <= N (g(0.58) = 0.954), but exceptional g of small norm are not
  excluded, they carry the weight 1/q_g of order 1, and for them the method gives only X^(2 Re rho).
  Whether such terms are real or cancel in the sum over g is not decided by this decomposition (for the periodic
  weight they must cancel if Lemma 5.8 holds).
* T2 part. For the class-regular THIN, G_psi is continued to Re x > b - 5/24 for each fixed psi, with no uniformity
  in the conductor (`c5-thin-walk-replay`). Since 12b/7 - 15/14 < b - 5/24 for every b <= 1 (equality at
  b = 1.208), the needed line lies outside the region of continuation even for one fixed conductor. T2 would need
  a thin set whose class discrepancy has exponent below 12b/7 - 15/14; a random set has b/2 almost surely
  [HEURISTIC, as in c7], which is below the needed line exactly for b > 15/17 (b/2 < 12b/7 - 15/14).

**Decision.** T1: not known, equivalent in strength to a quasi-GRH for the twist family to depth <= 9/14. T2: not
available for the existing THIN construction; open for a random variant. "Which half of Proposition D fails for
THIN" stays OPEN, and this method cannot close it without (U_beta'). The row of the control table should read:
"Liouville: low half fails (Theorem A, PROVED-rel Lemma S). THIN: conditional on (U_beta'), beta' < 12b/7 - 15/14;
(U) unknown".

Why Liouville closes and nothing else of this type does: among completely multiplicative unimodular w, the series
prod (1 - w(p) psi(p) q_p^(-x)) has L only in the numerator exactly when w(p) = -1 for all p.

---

## 7. Controls

All through the same identity (Theorem C); complete enumeration. Weights y = mu w on squarefree c:
`liou` y = 1; `one` (periodic weight, w = 1) y = mu; `rmult` w random completely multiplicative unimodular
(independent uniform phases at the prime ideals); `nm` non-multiplicative, y = +1 with probability 3/4, -1 otherwise
(mean 1/2); `nmph` non-multiplicative, y = exp(iU), U uniform on [-1.5, 1.5] (mean 0.665); `iid` random signs.

Closed form P_y, family sum, M = X (`predc_*.log`):

| X | P_liou | P_one/P_liou | P_rmult/P_liou | P_iid/P_liou | P_nm/P_liou, abs(mean)^2 | P_nmph/P_liou, abs(mean)^2 |
|---|---|---|---|---|---|---|
| 2^12 | 59.47 | 0.0337 | -0.0063 | 0.0656 | 0.3168, 0.2394 | 0.4700, 0.4406 |
| 2^16 | 1942.61 | 0.0010 | -0.00004 | 0.0043 | 0.23468, 0.23453 | 0.44469, 0.44488 |
| 2^18 | 10142.93 | -0.0012 | -0.0002 | 0.0004 | 0.25142, 0.25157 | 0.44377, 0.44408 |
| 2^20 | 52016.91 | -0.00003 | -0.00003 | -0.0001 | 0.24978, 0.24972 | 0.44282, 0.44279 |

Full moment N by rows (`dec1_*.log`), M = X:

| X | D | N - D liou | one | rmult | nm | nmph | Rem/P liou | nm | nmph |
|---|---|---|---|---|---|---|---|---|---|
| 2^11 | 427.95 | +12.88 | +0.005 | -1.71 | +2.01 | +5.64 | -0.411 | -0.429 | -0.429 |
| 2^12 | 856.22 | +27.13 | +0.58 | -0.33 | +7.44 | +12.46 | -0.544 | -0.560 | -0.538 |
| 2^13 | 1711.75 | +94.24 | -5.26 | -1.59 | +29.02 | +40.64 | -0.311 | -0.292 | -0.314 |

| control | expected | outcome |
|---|---|---|
| periodic weight (w = 1) | no coherent term | confirmed: abs(P)/P_liou <= 0.0012 from 2^16, 3e-5 at 2^20; N - D within 0.31 percent of D at 2^11 .. 2^13 |
| random multiplicative unimodular | no coherent term (mean of mu w is 0) | confirmed: abs(P)/P_liou <= 2e-4 from 2^16; N - D within 0.4 percent of D |
| non-multiplicative, same kind of mean (`nm`, `nmph`) | term present, = abs(mean)^2 P (Hermitian form) | confirmed: ratio equals abs(mean)^2 within 0.07 percent at 2^16 .. 2^20 (0.03 percent at 2^20); N - D = +29.0 and +40.6 at 2^13 (1.7 and 2.4 percent of D, Liouville 5.5 percent) |
| unimodular twist q_c^(-i alpha) | pole moves vertically; term unchanged up to the Mellin factor | c7 (0.4 percent); not rerun |
| THIN | section 6 | conditional on (U_beta'); not run |
| DH, backward heat, zeta(s+a) zeta(s-a), T-NR, Beurling, phase-rotated transfer operator, theta^w | not weights on the rows of (5.30) | not applicable: the lane makes no statement about zeros, so no control has to fail |

Observation (MEASURED): Rem_y/P_y is the same for `liou`, `nm`, `nmph` at each size (to 0.03 in the ratio). The
remainder also has a component proportional to abs(mean)^2, negative, between 0.3 and 0.7 of P in the range. The
theorem says it is O(X^(1+eps)) against P ≍ X^(7/6) at M = X; a factor X^(1/6) is 4.5 at 2^13, so the range cannot
show the separation.

---

## 8. Requirement flags

* **R1 (all primes, multiplicativity essential): false.** The coherent term is a Hermitian form in the weight and
  is present for non-multiplicative weights with the predicted constant (0.03 percent). Multiplicativity enters
  only through the remainder (Euler product (3.4)), and only to bound it.
* **R2 (height-uniform, every window): false.** No statement in the height aspect.
* **R3 (every control fails at a named step): false.** One control decided: for the Liouville weight the row
  bound of the low half fails, at the step "the coefficient series of a dual frequency has no pole at x = 1"
  (true for a periodic weight: 1/zeta_F has a zero there; false for Liouville: zeta_F(x)/zeta_F(2x)). THIN is
  conditional on an unknown bound. This locates R3 of the 7/8 mechanism in the low half for one control weight.
* **R4 (passage to the critical line): false.** None supplied. The exponents (7/6, the range 7m/8 < n < 5m/4,
  12b/7 - 15/14) are properties of the 7/8 architecture at its own scales.

---

## 9. Same-author check (not an independent referee)

1. Certified identity: independent of the float code path only in arithmetic, not in the formula; `pred.py` is an
   independent enumeration (lattice sieve, norm-only closed form) and reproduces P at 2^12 to all digits.
2. Exponent bookkeeping of 3.4 redone twice: q_d: -2 + kappa from y^(-z), X'^(1+4eps), (q_d q_e)^(2eps); change of
   variable h -> g contributes q_d^(1+eps), inner sum <= number of squarefree divisors. An earlier draft of this
   step (weight q_{gcd(d,h)} kept outside) looked divergent; the convergence comes from the factor q_d^(-1) left
   after the change of variable. A referee should recheck this line first.
3. The data cannot confirm abs(Rem) << X^(1+eps): Rem/P in [-0.69, -0.31] with no trend, and at fixed X = 2^12 Rem
   grows with M (-14.2, -32.3, -62.5, -97.6 at M = X/4, X, 4X, 16X; growth factors 2.27, 1.93, 1.56) while the
   bound is uniform in M. No contradiction (the
   constant is not computed; classes hold 2 to 8 elements), but the theorem rests on the written argument alone.
4. Lemma S: the twist insertion is one sentence about a proof in the source; the source's own proof is terse
   ("follows the pattern of Lemmas 4.3 and 4.4"). Only the arXiv version was read.
5. Lemma 3' uses the wild conductor exponents (3 at 2, 4 at lambda) from memory; the numerics agree (modulus 12
   suffices for the symmetric part, 72 for the S-units), and the identity was checked exhaustively at 2^14.
6. The lower bound for P uses crude constants (0.006); it was not optimised and was not checked numerically as
   an inequality beyond the fact that the measured P is far above it.
7. Corollary B depends on the manuscript's (4.7) with G a class function mod f_0 and on the bar in (5.30) (c7's
   reading, accepted by its referee).

---

## 10. Three weakest steps

1. **Lemma S is a modified citation.** BGL Corollary 1.4 is printed for chi_a; the fixed twist theta and the
   identification of c -> chi_c(g) with theta_v chi_a (Appendix II plus Kummer characters of S-units) are argued
   here from the printed proof and construction, not quoted. The move from the line 1/2 to 1/2 + eps is standard
   and written. If the twist insertion failed, Theorem A would hold only relative to the twisted second moment.
2. **Scope.** Positivity and the lower bound are for rows in one class mod f_0, hence for the family average over
   nu mod f_0, for the squarefree part of the row, with the Gaussian row weight (sharp cut only through 3.5: some
   cut in [M, 4 M log X]). Single nu, the completed row for small S, the O-dyad, and the probe I_liou of (6.1) are
   not covered. The asymptotic constant of P is measured, not proved.
3. **THIN is not decided.** Section 6 is an argued transfer of the Liouville proof plus exponent arithmetic; its
   content is negative (the needed bound contains a quasi-GRH to depth 9/14). The claim that off-line zeros of the
   twists would produce real terms in Rem_eps is not established in either direction.

## Follow-up

Send Theorem A (sections 2 to 4) to two independent referees, first target the line flagged in 9.2 and the twist
insertion of Lemma S against the journal version of BGL. No further attack value: score stays 0.

## Files

`RESULT.md`; `lanes.jsonl`; `lib7.py` (c7); `dec1.py`, `dec1_11.log/json`, `dec1_12.log/json`, `dec1_12_Mq.*` (M = X/4),
`dec1_12_M4X.*`, `dec1_12_M16X.log`, `dec1_13.*`; `cert.py`, `cert_11.log`; `pred.py`, `pred_12..20.log/json` (three row lengths),
`predc_12..20.log/json` (controls, per-class range); `check_star.py`, `check_star.log`. Source text read from a
temporary copy of arXiv:1112.1650 (not stored here).
