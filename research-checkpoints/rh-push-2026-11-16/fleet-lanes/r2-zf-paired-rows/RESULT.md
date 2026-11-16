# r2-zf-paired-rows: conjugate-paired product rows and the dual exponent (2026-11-16)

Internal working note. Nothing committed or pushed. All files are in this directory:
`pair_counts.py/.log` (trivial-row counts), `gauss_class_check.py/.log` (Theorem D, Lemma F at primes),
`quartic_dual.py`, `quartic_bins.py`, `quartic_analyse2.py` with `q_16e5.log`, `bins_16e5.log`, `analysis_16e5.log`
(dual exponent over Q(i); `.npz/.npy` are data caches), `a_threshold.py/.log` (model abscissa against a).
Follows `../zf-higher-rows/RESULT.md` and its `REFEREE.md`; repairs the refuted Theorem 4(ii) and addresses the three
loopholes the referee left open (paired rows: closed; r = 4 over Q(i): measured; intermediate exponent and r = 5: not resolved).

Labels: PROVED (complete argument here) / CLASSICAL / PROVED-rel X / MEASURED / MODEL (exponent bookkeeping with generic
sizes; exact inside the model) / RECALLED (literature, not re-read) / OPEN.

**Verdict: precise obstruction.** Conjugate-paired product rows give no abscissa below 7/8: the paired abscissa is
7/8 + l2/8 for (4,4) and 7/8 + 3 l2/8 for (4,12) (l2 = log-size of the second variable; conditional on the open quartic
input), and 1 on the square box. The dense diagonal is the
principal-character degeneration: it has one trivial row per fibre, and an amplifier needs many rows per fibre. No
zero-free region is claimed. 7/8 (unrefereed manuscript) stands; RH open.

---

## 1. Plan: what is new

Not repeated: atlas section 10 (PR #14), `beat78-amplifier.md`, `zf-campaign-quartic-gl2.md` (Framework A, Lemma D, the
Z[i] ledger), `cubic-r2-conductor-verdict.md` (a = 4 for cubic rows), `../zf-higher-rows` Theorems 1, 2.

New here:

1. **Theorem A (fibre identity)** and **Lemma B (powerful-product count)**: the correct replacement for the refuted
   Theorem 4(ii). The trivial rows of any product family number at most (H_1 ... H_j)^(1/2 + eps), with exponent given by
   an explicit linear programme; per fibre they number at most H_i^(1/r_i).
2. **Proposition C (Poisson cost)** and the Framework A abscissa of every two-variable product family, including the
   conjugate pair (4,4) and the pair (4,12), derived from the amplifier count, the Gram bound and the dual diagonal.
3. **Theorem D (Gauss class of a product probe)** in the manuscript's bilinear architecture: a conjugate pair cancels
   the Gauss sum, so the reciprocal 1/L appears on the Poisson side only if the reflected side is already a Moebius sum;
   the pair (4,12) lands in the cubic-theta class with dual exponent 2 but with quartic density and two Poisson
   variables. **Proposition E** gives the resulting exponent count: conjugate pair = tautology, (4,12) = 9/8 (trivial).
4. Numerical test of the dual exponent for r = 4 over Q(i), with class-resolved controls (section 6). r = 5 over
   Q(zeta_5) was not computed (reasons in section 6).
5. The classification table with a status per cell (section 7).

Walls: every step that produces 1/L uses the Euler product (section 8). The output is an obstruction, so flow-blindness,
MV-CAP and verified height are not engaged.

---

## 2. Exact structure of product rows

Setting: K contains mu_r; chi_n = (./n)_r; a product family has rows u = (u_1, ..., u_j), N(u_i) <= H_i, exponents
e_i not divisible by r, and

  A_u(D) = sum_n mu(n) nu(n) chi_n(u_1)^(e_1) ... chi_n(u_j)^(e_j) W(N n / D).

r_i = r / gcd(r, e_i) is the order of the i-th component; HH = H_1 ... H_j. A row is trivial if u_1^(e_1) ... u_j^(e_j) is an
r-th power times a unit (then A_u = A_1 up to coprimality conditions).

**Theorem A (fibre identity) [PROVED].**
(i) A_u = A_w with w = u_1^(e_1) ... u_j^(e_j): the product family is the pure order-r family on the set of classes
{w mod r-th powers}, with multiplicity m(w) = #{u in the box : u_1^(e_1)...u_j^(e_j) in w K^(xr)}. So
sum_u |A_u|^2 = sum_w m(w) |A_w|^2 and the number of trivial rows is J = m(1).
(ii) Fix all variables but u_i. The fibre is the pure order-r_i family, in the single variable u_i, of the twisted
target nu' = nu * prod_{l != i} chi_.(u_l)^(e_l) (a Hecke character by reciprocity, conductor supported on the u_l).
(iii) In each fibre the trivial rows lie in one class of u_i modulo r_i-th powers, so they number at most
(H_i / N(k))^(1/r_i) <= H_i^(1/r_i), k the r_i-th-power-free kernel of that class.
(iv) Hence the product amplifier inequality |A_1|^2 <= (1/J) sum_u |A_u|^2 is the mediant of the fibre inequalities
|A_1(nu)|^2 <= (1/J_f) sum_{u_i} |A_{u_i}(nu'_f)|^2, each of which is a pure order-r_i amplifier inequality for a twisted
target with the amplifier set translated by k.

*Proof.* chi_n is completely multiplicative in the numerator, which gives (i). For (ii), n -> chi_n(u_l) is a Hecke
character of n (r-th power reciprocity; manuscript Lemma 4.1 for r = 6). (iii): if u_i and u_i' are both trivial in the
same fibre then (u_i/u_i')^(e_i) is an r-th power, so u_i/u_i' is an r_i-th power; the elements k t^(r_i) with norm <= H_i
number <= (H_i/N(k))^(1/r_i). (iv): J = sum_f J_f and sum_u = sum_f sum_{u_i}; (sum_f a_f)/(sum_f J_f) >= min_f a_f/J_f. QED

For the referee's counterexample chi(u_1) chi-bar(u_2), r = 4: each fibre u_2 has trivial rows u_1 = ker(u_2) t^4. That is
about one row per fibre (the diagonal) plus a thin set of fourth-power multiples. The count ~H is the number of fibres.

**Lemma B (count) [PROVED].** For every product family with all e_i not divisible by r:
(i) if u is trivial then u_1 u_2 ... u_j is powerful (every prime divides it at least twice). Hence
J <= C_eps HH^(1/2 + eps).
(ii) J <= C_eps D^(j(lambda) + eps) (upper bound PROVED; matching lower bound MEASURED below), with the linear programme
  j(lambda) = max { sum_v y_v : y_v >= 0, sum_v y_v v_i <= lambda_i for all i },   H_i = D^(lambda_i),
v running over the nonzero vectors in Z_{>=0}^j with sum_i e_i v_i = 0 mod r. In particular
j(lambda) <= (lambda_1 + ... + lambda_j)/d, d = min |v|_1 >= 2.
(iii) d = 2 exactly when some pair is conjugate (e_i + e_l = 0 mod r) or some component is quadratic (2 e_i = 0 mod r).

*Proof.* (i) If a prime p divides exactly one u_i, to the first power, the valuation of prod u_i^(e_i) at p is e_i, not
0 mod r. The powerful ideals of norm <= X number O(X^(1/2)) and each has X^(eps) factorisations into j factors.
(ii) The Dirichlet series sum over trivial u of prod N(u_i)^(-s_i) is an Euler product whose p-factor is
1 + sum_v N(p)^(-<v,s>); it converges when <v,s> > 1 for all v. Rankin's bound J <= prod_i H_i^(s_i) * (the series at s)
for every such s, and LP duality (min <lambda,s> over <v,s> >= 1 equals max sum y_v over sum y_v v <= lambda), give the
upper bound.
(iii) |v|_1 = 1 is excluded because r does not divide e_i; |v|_1 = 2 is v = e_i-th + e_l-th unit vectors or 2 e_i. QED

Values (H_i = D^(lambda_i)):

| family | solution vectors (minimal) | j(lambda) | best density max j/sum(lambda) |
|---|---|---|---|
| conjugate pair, order r | (1,1), (r,0), (0,r) | min(l1,l2) + \|l1 - l2\|/r | 1/2 at l1 = l2 |
| (4,12): chi_12^3(u_1) chi_12^(-1)(u_2) | (4,0), (1,3), (0,12), (2,6), (3,9) | max over y <= min(l1, l2/3) of y + (l1-y)/4 + (l2-3y)/12 | 1/4 |
| same orientation chi(u_1) chi(u_2), r = 4 | (1,3), (2,2), (3,1), (4,0), (0,4) | (l1 + l2)/4 | 1/4 |
| quadratic x order r: rho(u_1) chi(u_2) | (2,0), (0,r) | l1/2 + l2/r | 1/2 as l2 -> 0 |

So the (4,12) pair, although it violates the refuted bound prod H_i^(1/r_i), has density 1/4: that of its order-4
component, not better. Only exact conjugate pairs and quadratic components reach 1/2.

MEASURED (`pair_counts.py`, `pair_counts.log`; valuation model over Z, boxes up to 65536^2): conjugate (4,4), H_1 = H_2 = H:
J/H = 1.215, 1.218 at H = 16384, 65536 (referee: 1.16 to 1.20 at H <= 800), exponent 0.501; maximum fibre count 11 and
16 against H^(1/4) = 11.3 and 16.0. (4,12): exponent 0.262 (LP 1/4), maximum fibre 11 and 16. Conjugate (6,6) and (12,12):
0.500. Skew boxes agree with the LP to within the logarithmic corrections expected at this size (table in the log).

---

## 3. Framework A system for paired rows (amplifier, Gram bound, dual diagonal, abscissa)

Framework A is `zf-campaign-quartic-gl2.md` section 3.1. Its three ingredients for a product family:

**(a) Amplifier count.** |A_1|^2 <= (2/J) sum_u |A_u|^2 + (coprimality error, as in the quartic note section 3.1),
J = D^(j(lambda)) (Lemma B). [PROVED]

**(b) Gram bound.** Expanding the square and applying Poisson summation in the variables u_i, i in S:

  sum_u |A_u|^2 = (diagonal, D * HH) + (HH / D^|S|) sum_{h in dual box} |Q_h|^2 + (other),

where the dual box is prod_{i in S} [N(h_i) << D^2/H_i] and
Q_h = sum_n mu(n) nu(n) q_n(h) W(N n/D), q_n(h) = prod_{i in S} g(chi_n^(e_i); h_i)/sqrt(N n) (unimodular, twisted
multiplicative in n). [PROVED: this is the bookkeeping of the quartic note section 3.1 repeated in |S| variables; the
product of |S| Gauss sums of modulus n n' has modulus D^|S| and factorises in n, n'.]

**(c) Exceptional term = dual diagonal.** The terms n = n' of sum_h |Q_h|^2 contribute D * #(dual box) = D * D^(2|S|) / prod_{S} H_i.

**Proposition C (Poisson cost) [PROVED as bookkeeping].** The dual diagonal is <= the primal diagonal D * HH only if

  prod_{i in S} H_i >= D^|S|.                                                                    (C1)

Consequences for a two-variable family, lambda = (l1, l2), under the optimal (open) mean-square input
sum_u |A_u|^2 <= D^(1+eps) HH in the range (C1):

* S = {1,2}: l1 + l2 >= 2 and j <= (l1 + l2)/2 (Lemma B), so |A_1|^2 <= D^(1 + l1 + l2 - j) with exponent >= 2. **Trivial for
  every product family.**
* S = {i}: l_i >= 1, and j <= l_other + l_i/r_i (Theorem A(iii)), so the exponent is >= 1 + (1 - 1/r_i) l_i >= 2 - 1/r_i:
  **theta >= 1 - 1/(2 r_i)**, the pure order-r_i ceiling.

**Abscissae [PROVED-rel the open optimal input; exact arithmetic].** theta = (1 + l1 + l2 - j(lambda))/2:

* conjugate pair (4,4), Poisson in u_1 (l1 >= 1): theta = 1/2 + 3 l1/8 + l2/8 >= **7/8 + l2/8**. Minimum 7/8 at l2 = 0, i.e.
  with the second variable removed. At l1 = l2 = 1 (the referee's square box): theta = 1, the trivial bound.
* pair (4,12), Poisson in the order-4 variable (l1 >= 1): 1 + l1 + l2 - j = 1 + 3 l1/4 + 11 l2/12 - y/2 with y <= l2/3, so
  theta >= **7/8 + 3 l2/8**. Poisson in the order-12 variable: theta >= 23/24 + 3 l1/8.
* either family with both variables Poissoned: theta >= 1.

With the known inputs (quartic large sieve with the (MN)^(2/3) term) Framework A gives nothing for order 4 already
(quartic note Prop Q1 and section 4.6), so nothing here either.

**Does the dense diagonal help? No.** Three equivalent statements:

1. (Theorem A) the diagonal contributes one trivial row per fibre. The conclusion |A_1|^2 <= D HH^(1/2) = D H of the
   conjugate-pair inequality with H_1 = H_2 = H is the same as the pointwise consequence |A_1(nu)|^2 <= sum_{u_1} |A_{u_1}(nu')|^2
   <= D H of its own fibre hypothesis. The amplifier gain is 1.
2. (Lemma D of the quartic note) a family-blind Gram bound Delta satisfies Delta >= J * D for a family with J repeated
   rows, so it returns |A_1|^2 <= D^2.
3. (Proposition C) a Gram bound that sees the Moebius coefficients needs a Poisson step; each Poissoned row variable
   costs a factor D in family size, and the diagonal count 1/2 does not repay two of them.

The effective amplifier of the conjugate pair is therefore not longer. Per fibre it is the fourth-power set
{ker(u_2) t^4}, which is shorter than the untwisted set {t^4} by the factor N(ker u_2)^(1/4).

---

## 4. The manuscript's architecture (bilinear probe) for paired rows

Built from the manuscript's definitions, not by replacing 6 by r in its exponent formulas.

**Single probe (manuscript (6.1), (6.2), section 7), in schematic form.** Averaging variable s (norm ~ Y), row variable m
(norm ~ Q), completed index a = c n^3 (norm ~ Z):

  I = sum_s c(s) sum_m g(chi_s; -m) w(m) sum_a t(a) eta(a) chi_a(m),      t(a) = cubic theta coefficient,

* reflected side (6.2): I = sum_m A_m B_m, A_m = sum_s c(s) g(chi_s; -m) (additive polynomial), B_m = sum_a t(a) eta(a) chi_a(m)
  (completed theta row); low estimate by Cauchy-Schwarz, Lemma 6.2 (sum_m |A_m|^2, needs Q >= Y^2) and Lemma 5.8
  (sum_m |B_m|^2, cubic reflection plus quadratic large sieve, needs Q >= Z);
* Poisson side: Poisson in m modulo s a gives, at each a, the complete sum sum_x chi_a(x) e(kx/a) = g(chi_a; k), and
  t(a) g(chi_a) = mu(a) * (Hecke) * (periodic) (manuscript (4.5); ledger: x * x^2 = x^3 = [mu]). So
  I = (Q/sqrt Z) sum_k P_k Inv_k, P_k = sum_s c(s) chi_s(k) (plain polynomial), Inv_k = sum_a mu(a) eta'(a) chi-bar_a(k)
  (inverse polynomial), k up to K = Y Z / Q. Signal: the rows k = a^6 (P_k principal of size Y; Inv_k = Inv_1).

Generic-size count [MODEL]: signal (Q/sqrt Z) K^(1/r) Y |Inv_1| <= low = Q Y sqrt Z gives |Inv_1| <= Z / K^(1/r), and
Q >= max(Y^2, Z) forces K <= Z^(1/2): theta = 1 - 1/(2r). This reproduces the manuscript's Part I (11/12 at r = 6) and
Framework A's ceiling, which calibrates the count.

**Product probe.** Two averaging variables s_1, s_2, two row variables m_1, m_2, row character
chi_a(m_1)^(e_1) chi_a(m_2)^(e_2):

  I_2 = sum_{m_1, m_2} A^(1)_{m_1} A^(2)_{m_2} B_{m_1, m_2},      B_{m_1,m_2} = B_w,  w = m_1^(e_1) m_2^(e_2)   (Theorem A).

**Theorem D (Gauss class of a product probe) [PROVED at primes; PROVED-rel the ledgers for the class statement].**
Poisson in both row variables produces at each prime a the factor

  g(chi_a^(e_1); k_1) g(chi_a^(e_2); k_2) = chi_a(k_1)^(-e_1) chi_a(k_2)^(-e_2) * g(chi_a^(e_1)) g(chi_a^(e_2)),

and
(i) conjugate pair (e_2 = -e_1): g(psi) g(psi-bar) = psi(-1) N(a). The Gauss sum cancels. The Poisson-side coefficient
is t(a) eta(a) chi_a(k_2/k_1)^(e_1) N(a): it lies in the class of t. It is of the form mu * Hecke * periodic (so that the
Poisson side contains 1/L) if and only if [t] = [mu], i.e. the reflected side is itself a Moebius sum.
(ii) e_1 + e_2 != 0 mod r: g(psi_1) g(psi_2) = J(psi_1, psi_2) g(psi_1 psi_2), with J a Hecke Groessencharacter value
(Weil 1952). The product probe has the Gauss class of the single row with character chi^(e_1 + e_2).
(iii) for (4,12) over K = Q(zeta_12): chi_12^3 * chi_12^(-1) = chi_12^2 is the sextic symbol. The Poisson side of the
probe with cubic-theta input t is mu(a) * Hecke(a) * chi_a^(12)(k_2 k_1^(-3)): it contains 1/L(s, eta') for the rows with
k_2 k_1^(-3) a twelfth power, and its reflected side is the cubic theta function, dual exponent a = 2.
(iv) a quadratic component contributes g(rho), which is periodic times sqrt N (Hecke): it does not change the class.

So the two structures of density 1/2 (Lemma B(iii)), the conjugate pair and the quadratic component, are exactly the two
with trivial Gauss class. A row structure of density 1/2 leaves the coefficient class unchanged, and the only class
that produces 1/L without a Gauss sum is [mu] itself. This is the product-row form of the ledger statement "j = 2 lands
on [mu] (circular)" (quartic note Lemma L4(ii)).

**Proposition E (exponent count for two-variable probes) [MODEL: generic sizes, optimal large sieves assumed].**
With Y_i = Z^(y_i), Q_i = Z^(q_i), K_i = Y_i Z / Q_i = Z^(kappa_i), kappa_i = y_i + 1 - q_i, constraints q_i >= 2 y_i (Lemma 6.2
in each variable), q = q_1 + q_2:

  low_2 = (Q_1 Y_1^2 Q_2 Y_2^2)^(1/2) (max(Q_1 Q_2, Z) Z)^(1/2),   I_2 = (Q_1 Q_2 / Z) sum_{k_1,k_2} P_{k_1} P_{k_2} Inv_w,
  signal <= (Q_1 Q_2 / Z) J(K_1, K_2) Y_1 Y_2 |Inv_1|   (equality only if every trivial row has both P's principal),

  best possible conclusion |Inv_1| <= Z^E,   E >= 3/2 + (max(q,1) - q)/2 - j(kappa_1, kappa_2),   kappa_1 + kappa_2 <= 2 - q/2.

* (4,12) with cubic-theta input: j <= (kappa_1 + kappa_2)/4, so **E >= 9/8**. Trivial. A pair needs density above 1/3 to give
  E < 1; the (4,12) pair has 1/4.
* general pair with d = min |v|_1: E >= 3/2 - 3/(2d); E < 1 needs d = 2 (density 1/2).
* conjugate pair: the count above does not apply, because the rows m_1 = m_2 are trivial on the reflected side too.
  The m-representation contains sum_m |A_m|^2 B_1 and the k-representation contains (Q_1 Q_2/Z) sum_k |P_k|^2 B_1', where
  B_1 = sum_a t(a) eta(a) and B_1' is the same sum with the dual weight (Theorem D(i): the coefficient class does not
  change). The two weights are equal: sum_m |A_m|^2 = (Q_1 Q_2/Z) sum_k |P_k|^2 (Plancherel for m <-> k; both are Q Y^2 in the
  generic count with Q_i = Q, Y_i = Y). **The diagonal enters both sides of the identity with the same positive weight
  and no 1/L is created.** With Moebius input (t = mu, the only input for which B_1 is the target) the probe is
  self-dual: there is no reflected side, and the only available low estimate is the short-family mean square of the
  Moebius sums themselves, which is circular. In Framework A the same fact reads
  M(H_1, H_2) - diag = (H_1 H_2 / D^2) [M(D^2/H_1, D^2/H_2) - diag]: the dual of the conjugate pair is the conjugate pair.
  [Theorem D(i) PROVED; the size comparison is MODEL.]
* quadratic component rho(m_1) chi_6(m_2): E = 5/6 + y_1/2 + y_2/6 with 2y_1 + 2y_2 >= 1, minimum 11/12 at y_1 = 0. Neutral.

**Answer to task (1).** In both architectures the paired abscissa is

  theta_pair = min over the single Poissoned variable i of [pure order-r_i abscissa] + (positive cost of the other variable)
             >= 7/8 for (4,4) and (4,12), with equality only when the second variable is removed,

conditional on the open quartic input; with known inputs, nothing. The dense diagonal is the principal-character
degeneration. The blocking inequalities are

  J_fibre <= H_i^(1/r_i)   (Theorem A(iii)),    j(lambda) <= sum(lambda)/2   (Lemma B),    prod_S H_i >= D^|S|   (C1),

and, in the bilinear architecture, Theorem D(i): density 1/2 forces trivial Gauss class, hence [t] = [mu].

---

## 5. The twisted form and the rule a = min(e, nu - 1) (task 3)

**Lemma F [PROVED].** For every r >= 3, every h prime to pi: g(chi; h) = [g(chi)/g(chi rho)] * rho(h) * g(chi rho; h).
(Both sides equal chi-bar(h) g(chi).) So the absorbed dual always has the twisted form "order-nu Gauss sums at index h
times the quadratic character rho_n(h)", in addition to the twist-free form at index h^e when it exists (4 | r: e = 1 + r/2;
r odd: e = r + 1; r = 2 mod 4: none, by parity). Verified numerically by the referee on F_{p^2}.

**The two reflections.**
* twist-free form: dual exponent e. [PROVED-rel Kubota's functional equation: the index m enters as N(m)^(1/2 - u) in the
  normalised variable; RECALLED via the verdict note sections 2.3 and 3.3, which fixes the index exponent at the
  complex place where the cover splits. This part does not use mu_2n in K.]
* twisted form: dual exponent nu - 1, the degree of the object whose coefficients are order-nu Gauss sums (theta on the
  nu-fold cover of GL(nu - 1)). [PROVED-rel manuscript Prop 5.1 for nu = 3 only. MODEL for nu >= 4: no theorem identifies
  those theta coefficients with Gauss sums (RECALLED: Kazhdan-Patterson, Eckhardt-Patterson).]

a = min(e, nu - 1): r = 3: min(4, 5) = 4; r = 4: min(3, 3) = 3; r = 5: min(6, 9) = 6; r = 6: min(-, 2) = 2; r = 8: min(5, 7) = 5;
**r = 10: min(-, 4) = 4** (replaces "a = 2 floor" of the previous table); r = 12: min(7, 11) = 7. The r = 10 value is MODEL.
It does not change any conclusion: Framework A gives >= 19/20 at r = 10 for every a.

**Threshold in a [MODEL, `a_threshold.py`, `a_threshold.log`].**
* Framework A (model A-V, c = 1/2): theta_A(3, a) = 11/12 - 1/(6a); it is below B_XS = 0.87488665 iff a < 3.989. The true
  a = 4 gives exactly 7/8. theta_A(r, a) >= 1 - 1/(2r) >= 7/8 for r >= 4 at every a (r = 4: 0.875, 0.8797, 0.8833, 0.8891 at
  a = 2, 9/4, 5/2, 3).
* Framework B model (runB): r = 3 is below B_XS iff a < 2.436 (0.7428, 0.8400, 0.8699, 0.8836 at a = 2, 2.2, 2.4, 2.5). For
  r = 4 and 5 the model is discontinuous at a = 2 (0.8099 at a = 2 against 0.8869 at a = 2.05 for r = 4; 0.8492 against
  0.9295 for r = 5), because the penalty term is switched off only at a = 2 exactly. Inside this model r = 4 and r = 5 need
  a = 2 exactly; an intermediate mean-square exponent 2 < a < e does not help them. The discontinuity is a defect of the
  model, not a theorem.

---

## 6. Dual exponent for r = 4 over Q(i): numerical test (task 2)

**Object.** For a primary prime h of Z[i] and squarefree primary n prime to 2h (gamma_1(n) = g(chi_n)/sqrt(N n),
alpha(n) = n/|n|, V(x) = x exp(-x^2)):

  K_e(h, D) = sum_n alpha(n) conj(gamma_1(n)) chi_n(h)^e V(N n/D),   e = 0, 1, 2, 3     (quartic Kubota sums, index class e),
  TEST(h, D) = sum_n mu(n) gamma_1(n) conj(chi_n(h)) V(N n/D)                            (Poisson dual of the order-4 Moebius rows).

On the data, TEST = K_3 exactly, term by term (this is Lemma Q3 / Theorem 1(d) with the periodic factor
gamma_2(n) chi_n(-1) = 1 on primary n). F = |sum|^2 / sum_n V^2 equals 1 on average for coefficients without structure.
A functional equation of conductor Q_0 N(h)^a makes F fall once D exceeds a fixed multiple of Q_0 N(h)^a. Classes 0, 1, 2
are computed from the same data as controls, so the scale constant is calibrated inside the experiment.

**Data.** `quartic_dual.py`: all 121147 primary primes of norm <= 1.6e6, Gauss sums by direct summation (|gamma_1| = 1 to
1.1e-15; gamma_1(pi)^2 = mu chi(-1) alpha gamma_2 to 3.3e-15; twisted multiplicativity against direct composite Gauss
sums to 3e-13); 556014 squarefree primary n; D up to 3.2e5; rows h = the 301 primary primes with N(h) <= 1997.
Logs: `q_16e5.log`, `bins_16e5.log` (mean square over h in norm bins), `analysis_16e5.log` (per norm, averaged over the
conjugate primes, 9 values of a twist N(n)^(it), |t| <= 1, and three blocks of D). 11 minutes on 8 local cores.

**MEASURED, size.** For 209 rows with 500 <= N(h) < 2001 the mean square over h of the Moebius-twisted sum is
G_3 = 0.90 to 1.13 (standard error 0.06 to 0.08) at every D from 156 to 3.2e5; for 62 rows with 120 <= N(h) < 500 it is
0.86 to 1.17. The actual dual mean square has the optimal size (sum_h |P_h|^2 ~ #h). The obstruction is proof
technology, as the quartic note section 4.7 found at toy scale.

**MEASURED, conductor scale.** Mean of F over D in [2.8e4, 3.2e5]:

| N(h) | class 0 | class 1 | class 2 | class 3 = Moebius-twisted |
|---|---|---|---|---|
| 5 | 0.47 | 0.24 | 0.47 | 0.36 |
| 9 | 0.25 | 0.28 | 0.45 | 1.27 |
| 13 | 0.19 | 0.57 | 0.37 | 0.87 |
| 17 | 0.18 | 0.40 | 0.95 | 1.70 |
| 29 | 0.29 | 0.31 | 0.77 | 0.64 |
| 37 | 0.20 | 0.49 | 0.51 | 1.43 |
| 41 | 0.32 | 0.50 | 0.88 | 1.67 |
| 49 | 0.26 | 0.25 | 0.80 | 0.78 |
| 53 | 0.23 | 0.37 | 0.42 | 1.08 |
| 61 | 0.25 | 0.73 | 1.43 | 1.60 |
| mean, N(h) >= 9 | 0.24 | 0.43 | 0.73 | 1.23 |

Binned mean squares (`bins_16e5.log`), value at D = 1.6e5 and 3.2e5:

| bin of N(h) (rows) | class 0 | class 1 | class 2 | class 3 |
|---|---|---|---|---|
| [5, 30) (9) | 0.12, 0.03 | 0.30, 0.27 | 0.46, 0.36 | 0.93, 1.03 (s.e. 0.31, 0.23) |
| [30, 120) (21) | 0.09, 0.02 | 0.56, 0.42 | 0.89, 0.88 | 1.45, 1.27 |
| [120, 500) (62) | 0.07, 0.01 | 0.32, 0.32 | 0.90, 0.97 | 0.91, 0.86 |
| [500, 2001) (209) | 0.07, 0.00 | 0.93, 0.65 | 1.02, 0.99 | 0.98, 1.01 |

Reading:
* class 0 (no dependence on h beyond coprimality) starts to fall at D ~ 10^3 and reaches 0.00 to 0.03 at D = 3.2e5: the base
  scale is of order 10^3 and the weight needs two further decades to finish.
* class 1 falls at D ~ 5e3 for N(h) < 30, ~4e4 for N(h) in [30, 120), ~1.6e5 for [120, 500), and has begun at 3.2e5 for
  [500, 2001): onset about (300 to 600) N(h). Exponent 1 in N(h), as the rule a = e predicts. It falls to a plateau near
  0.3 and not to 0, consistent with the secondary piece of scale N(p)^(n-1) = N(p)^3 in the local reflection
  (verdict note, Prop C).
* class 2 falls for N(h) <= 13 (N(h)^2 <= 169) and has not fallen for N(h) >= 30.
* class 3, the Moebius-twisted family, has fallen only at N(h) = 5 (N(h)^3 = 125, between the values N(h)^2 = 81 and 169
  at which class 2 has fallen). At N(h) = 9 and 13 it is at full size (1.27, 0.87) where class 2 is at 0.45, 0.37. In the
  bin [5, 30) it is 0.93 and 1.03 at the two largest D, against 0.46 and 0.36 for class 2.

**Conclusion [MEASURED].** With the scale calibrated by classes 0, 1, 2 on the same data, the Moebius-twisted order-4
family over Q(i) behaves as conductor N(h)^3 and not as N(h)^2. Under a = 2 the class-3 sums at N(h) = 9 and 13 would
have the conductor scale 81 and 169 at which class 2 is observed to have decayed; they have not decayed. The data
favour **a = 3 for r = 4 over Q(i)** and disfavour a = 2 at roughly the two to three sigma level (three rows of norm 9
and 13, plus the bin comparison). This agrees with the rule a = e, which is PROVED-rel Kubota's functional equation and
does not need mu_8 in Q(i).
Limits of the measurement: (1) each entry averages roughly 10 to 20 effectively independent samples of an
exponentially distributed quantity, so single entries carry 25 to 40 percent error; the statement rests on the pattern
across N(h) = 5 to 13 and the bins, not on one cell. (2) It rejects a = 2 only with a class-3 scale constant comparable to the
class-1 and class-2 constants; a constant larger by a factor of about 5 would hide an a = 2 decay inside this range.
(3) A mean-square exponent strictly between 2 and 3 is not resolved: it would require decay at N(h) = 9 to begin by
D ~ 81^(a/2) times the constant, and D reaches only 3.2e5. A run to norm 4e6 on the motherbox was started and stopped
unfinished (the machine was at load 57 on 48 cores; the estimate was 70 further minutes); `quartic_dual.py 4000000`
with NPROC = 8 reproduces it and extends D to 8e5, where N(h) = 29 separates a = 2 (841) from a = 3.

**r = 5 over Q(zeta_5): not computed.** Reasons, in order: (i) the rows need generators normalised modulo a power of
(1 - zeta_5) and modulo the infinite unit group, so that n -> g(chi_n) is defined on ideals in a fixed ray class; this
arithmetic was not built. (ii) The smallest rows have N(h) = 11 and 16, so a = 2 and a = 3 separate only at
D ~ 121 c to 1331 c; with a base constant c of the size found over Q(i) (order 10^3, and the level at 5 is larger) this
needs prime Gauss sums up to norm ~10^7 in a quartic field, about 10^13 elementary operations. The rule gives a = 6
(index form; twisted form 9). Status of the r = 5 cell: PROVED-rel Kubota's functional equation, untested.

---

## 7. Classification table with status per cell (task 4)

| r | density 1/r | nu(r) | index form e | twisted form (e = 1, t = rho) | a | home of the dual | Framework A | Framework B |
|---|---|---|---|---|---|---|---|---|
| 3 | T | 6 T | 4 T | T | 4: T-rel (verdict note; Kubota FE) | 6-fold Kubota series: T-rel | 7/8: MODEL (A-V) | 1.046: MODEL |
| 4 | T | 4 T | 3 T | T | 3: T-rel Kubota FE over Q(i); numerics section 6 | 4-fold Kubota series: T-rel | >= 7/8: T (ceiling, bookkeeping) | > 1: MODEL |
| 5 | T | 10 T | 6 T | T | 6: T-rel Kubota FE; not tested numerically | 10-fold Kubota series: T-rel | >= 9/10: T | > 1: MODEL |
| 6 | T | 3 T | none T | T | 2: T-rel manuscript Prop 5.1 | cubic theta on GL(2): T-rel | 11/12: T-rel manuscript Part I | 7/8: T-rel manuscript (unrefereed) |
| 8 | T | 8 T | 5 T | T | 5: T-rel Kubota FE | 8-fold Kubota series: T-rel | >= 15/16: T | > 1: MODEL |
| 10 | T | 5 T | none T | T | 4: MODEL (twisting rule nu - 1) | none known | >= 19/20: T | MODEL |
| 12 | T | 12 T | 7 T | T | 7: T-rel Kubota FE | 12-fold Kubota series: T-rel | >= 23/24: T | > 1: MODEL |
| conj pair (r, r) | 1/2 of HH: T (Lemma B) | - | - | - | Gauss sum cancels: T (Thm D(i)) | [mu] (circular): T-rel ledger | >= 1 - 1/(2r) + l2/(2r): T-rel open input; = 1 on the square box | tautology: T (Prop E, third bullet) |
| (4, 12) | 1/4: T (Lemma B) | 3 (class of chi_12^2 rho): T | - | - | 2: MODEL (cubic theta twisted by an order-12 Hecke character) | cubic theta over Q(zeta_12): MODEL | >= 7/8 + 3 l2/8: T-rel open input | >= 9/8: MODEL |

T = theorem (PROVED here or in `../zf-higher-rows` and confirmed by its referee); T-rel = proved relative to the named
source; MODEL = exponent bookkeeping. "Framework A >= 1 - 1/(2r): T" means: proved as dual-diagonal bookkeeping (quartic note
section 3.1), valid for every reflection degree and every sieve.

Not theorems anywhere in the table: every Framework B entry except r = 6; the non-existence of an a = 2 reflection for
orders 4, 6 (index class 4) and 10 beyond the Gauss-sum families (literature-level); the r = 10 value of a.

---

## 8. DH control

The Euler product is used at: (1) Theorem A(ii): n -> chi_n(u) is a Hecke character and mu(n) nu(n) chi_n(u) are the
coefficients of 1/L(s, nu chi_.(u)), a multiplicative function; (2) Theorem D: mu(a) = -1 at primes is produced from
t(a) g(chi_a) (or from g(psi_1) g(psi_2) t(a)) prime by prime, and the twisted multiplicativity of Gauss sums extends it
to squarefree a. For the Davenport-Heilbronn function f, 1/f has no coefficients of the form mu(n) nu(n); a row of the
Poisson expansion contains 1/L(s, chi) and 1/L(s, chi-bar) separately and never 1/f. No statement here transfers to f. The
note proves an obstruction and no zero-free statement, so there is nothing that could wrongly hold for DH.

## 9. Verdict

* PROVED: Theorem A (fibre identity, one diagonal row per fibre), Lemma B (powerful-product bound J <= HH^(1/2+eps), LP
  exponent, characterisation of density 1/2), Theorem D(i), (ii), (iv) at primes and squarefree moduli, Lemma F.
* PROVED as bookkeeping / relative to the open optimal input: Proposition C and the Framework A abscissae
  7/8 + l2/8 (conjugate (4,4)), 7/8 + 3 l2/8 ((4,12)), >= 1 with two Poissoned variables.
* MEASURED: section 2 counts; Theorem D and Lemma F at nine primes p = 1 mod 12 to 1.3e-12 (`gauss_class_check.log`);
  section 6: the Moebius-twisted quartic dual over Q(i) has optimal mean-square size and conductor exponent 3, not 2
  (two to three sigma); r = 5 not tested.
* MODEL: Proposition E (E >= 9/8 for (4,12)); the a = 2 reflection of the (4,12) dual; a(10) = 4; thresholds in a.
* OPEN: the actual abscissa. A failed sufficient architecture is not a lower bound on the truth (atlas section 9).

Corrected mixture statement replacing Theorem 4(ii) of `../zf-higher-rows`: *a product family is a union of translates of
each of its pure component families (Theorem A); its trivial rows number at most HH^(1/2+eps) and at most H_i^(1/r_i) per
fibre; in Framework A its abscissa is at least the pure abscissa of the Poissoned component, and it is trivial when two
or more row variables are Poissoned.*

Pivot (taken once): the adjacent idea was the (4,12) pair, whose dual is in the cubic-theta class with a = 2 although its
components have orders 4 and 12 (Theorem D(iii)). It fails on Proposition C / E: the second Poisson variable costs a
factor Z in rows and the density 1/4 is below the 1/3 needed. Not pursued further.

## 10. Three weakest steps

1. **Proposition C and the Framework A abscissae are statements about a sufficient architecture.** "Each Poissoned row
   variable needs family size D" is the dual-diagonal count for a mean-square bound taken with absolute values on the
   dual side. An argument that keeps the cancellation between the dual diagonal and the dual off-diagonal is not
   excluded (it would be a short-family Moebius mean square, which is of zero-free-region strength). The abscissae
   7/8 + l2/8 and 7/8 + 3 l2/8 also assume the open optimal quartic input.
2. **Proposition E and the (4,12) dual exponent are MODEL.** The probe of section 4 is the manuscript's probe in
   schematic normalisation with generic sizes; Lemma 5.8 is used uniformly in a twisting conductor that is not fixed
   (the manuscript proves it for a fixed finite family); the cubic theta function over Q(zeta_12) twisted by an order-12
   Hecke character is assumed to reflect with exponent 2. The lower bound E >= 9/8 only needs these as upper limits on
   what could be gained, but none was derived line by line from the 190-page manuscript.
3. **The numerical exponent a = 3 rests on a calibrated scale constant and about ten rows of small norm** (section 6,
   limits 1 to 3). r = 5 is untested. The rule a = e itself is used through Kubota's functional equation as recalled in
   the verdict note, not from a source read here; the non-existence of any a = 2 realisation for the index-h^3 quartic
   family beyond Gauss-sum families remains literature-level.
