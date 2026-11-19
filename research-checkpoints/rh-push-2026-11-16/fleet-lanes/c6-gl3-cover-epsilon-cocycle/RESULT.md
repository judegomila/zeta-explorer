# c6-gl3-cover-epsilon-cocycle: the epsilon-factor cocycle criterion on the double cover of GL(3) (2026-11-18)

Internal working note. Slug `c6-gl3-cover-epsilon-cocycle`. Kind: deepen (STRATEGY 4.0 item 2). Nothing committed,
pushed or posted. Not refereed. Local runs only, through `scripts/memcap.sh 8`, interpreter `.venv-arb/bin/python`
(sympy, mpmath), each under 6 minutes, memory under 300 MB. No ssh, no server job. No repo data module imported.
No source was opened: every cited theorem is RECALLED (from memory; statement and reference may be off in detail).

Files: `gt.py` (Gelfand-Tsetlin recipe, Tokuyama check), `rows.py` (recurrence search, exact fractions),
`rows_sym.py` + `rows_sym.log` + `rows_sym.json` (row series per Whittaker class), `rows_full.py` +
`rows_full_eps_plus.log` + `rows_full_eps_minus.log` + `rows_full_minus.json` (row series with the symbol-carrying
Gauss sum), `lemmaL.py` + `lemmaL.log` + `lemmaL.json`, `cocycle.py` + `cocycle.log`.

Labels: PROVED (complete argument here, given the recalled statements it names) / CLASSICAL-recalled / MEASURED
(exact computation on a finite set of cases) / ARGUED / OPEN.

**Verdict: precise obstruction, outcome (a).** On the double cover of GL(3) the quadratic symbol enters the local
data only through the quadratic Gauss sum g_1 (modulus sqrt q), and the sign -1 only through the Ramanujan sum
g_0 = -1. In unitary normalisation every occurrence of the symbol carries q^(-1/2) and every minus sign carries
q^(-1) (Lemma L, proved from the recalled Gelfand-Tsetlin recipe for all ranks, checked on 490 monomials). The row
series in the twist direction is (L-factor of the lift) x (numerator), and the numerator is
1 - T Yu q^(-1/2) U + O(q^(-1)) (64 exact cases): the reciprocal sits at shift 1/2. The exponent group of a double
cover is Z/2, which has no pair (a, b) with a, b, a + b all nonzero, so the Gauss-sum cocycle takes no value of
weight 0 of Jacobi type (Lemma 1). For twist families of any fixed GL(n) form the cocycle is the n-th power of the
GL(1) cocycle and does not depend on the form (Lemma 2). No family with reciprocal shift other than 1/2 was found;
no Proposition 2.1 ledger entry with h > 1 is written. Second same-kind obstruction for STRATEGY 3.1 item 12 /
map row Z21. Not covered: the global constants that select the Whittaker functional of a genuine cusp form
(section 6). No statement about any zero is made. RH open.

---

## 1. Plan; relation to closed rows

Read: BRIEF (all notices), STRATEGY sections 1-4.0, OBSTRUCTION_MAP rows Z14, Z15, Z21, section 6 items 1 and 18,
`c5-angular-family-absorption` RESULT + REFEREE, `e1-gl3-theta-order2-rows`, `e2-gl3-cover-cuspidal-rows`,
`n4-gl3-double-cover-absorption` (verdict and scope).

Closed before, not repeated: Borel Eisenstein coefficients of the double cover of GL(3) at untwisted index (n4);
theta and theta-induced rows, square-direction rows on GL(2) (e1); twist rows and product-index rows of the
Eisenstein series induced from a GL(2) cusp form, measured on one form (e2); group families with epsilon factor a
character of the family parameter (c5).

New here: (i) the cocycle criterion of c5 Remark 8 written as a weight condition that can be checked on a finite
table (Lemma 1), and its form for twist families of GL(n) (Lemma 2); (ii) the local Whittaker values of an
unramified genuine principal series of the double cover of GL(3) at twisted indices p^(l1), p^(l2), all four
Whittaker classes, with general Satake parameters, and their generating series in the twist directions. This is
the local component of a genuine cusp form at an unramified place, which n4, e1, e2 named as not computed.

Answers required before work (STRATEGY section 1): R1: multiplicativity would enter through the identity
mu(p) x (kernel) = (cocycle) x (kernel of another row); the test is whether that identity exists at shift 0.
R2, R4: none; the lane decides a local algebraic question and can only close the family or name a ledger entry.
R3: listed in section 5.

## 2. First lemma: the criterion as a checkable condition

Setting. p odd, residue field of size q, chi the residue character of order r, g(a) = sum over x != 0 of
chi(x)^a psi(x), a in Z/r. g(0) = -1 (Ramanujan sum, equal to mu(p)); abs(g(a)) = sqrt q for a != 0;
g(a) g(-a) = chi(-1)^a q. The transfer kernel of a row family in the 7/8 architecture is g(chi_c^a, h)/sqrt(Nc),
normalised by sqrt(Nc) for every a. So put ghat(a) = g(a)/sqrt q for all a: ghat(0) = -q^(-1/2), and
chat(a, b) = ghat(a) ghat(b)/ghat(a + b), weight w(a, b) = log_q abs(chat(a, b)).

**Lemma 1 (weight table) [PROVED; CLASSICAL identities; MEASURED, `cocycle.log`].**
(i) a = 0 or b = 0: chat = ghat(0) = -q^(-1/2). Weight -1/2. The sign -1 is mu(p); it comes with q^(-1/2).
(ii) a, b != 0, a + b = 0: chat = -chi(-1)^a q^(1/2). Weight +1/2. Sign -1 with q^(+1/2).
(iii) a, b, a + b all != 0: chat = J(chi^a, chi^b)/sqrt q, modulus 1, and -J is the value at p of a Hecke
character (Weil; recalled). Weight 0: mu(p) times a unimodular Hecke value, at shift 0.
Case (iii) exists iff r >= 3. For r = 2 the table is {(0,0): -1/2, (0,1): -1/2, (1,1): +1/2}.
Proof. (i), (ii) are the two evaluations above; (iii) is g(a) g(b) = J(chi^a, chi^b) g(a + b). QED
Check: r = 2, 3, 4, 6, three primes each, 30 digits: weights -0.5, 0, 0.5 as stated; in every case of type (iii)
abs(chat sqrt p - J) < 3e-29.

**Criterion (checkable form).** A row family absorbs mu at shift sigma only if its normalised kernel, as a function
of the conductor variable c, is (Hecke character of c) x (periodic function of c) x prod over p | c of a monomial in
the ghat_p(a), and some ratio of two such monomials has a factor of sign -1 and weight -sigma. Shift 0 needs a
cocycle value of type (iii). If only types (i), (ii) occur, every mu(p) is accompanied by (Np)^(-1/2) or
(Np)^(+1/2) and the reciprocal sits at shift 1/2 (map row Z21). The exponent group for an n-fold cover is Z/n.

**Lemma 2 (twist families) [PROVED from a CLASSICAL-recalled formula].** Let Pi be a cuspidal representation of
GL(n) over F with conductor N and central character omega, and chi_c a Hecke character with conductor c prime to N.
Then eps(1/2, Pi x chi_c) = omega(c) chi_c(N) eps(1/2, chi_c)^n (local: an unramified principal series twisted by
a ramified character is induced from n ramified characters; Tate's formula for each; recalled). Hence the
dependence on c is (Hecke character of c) x (reciprocity symbol, periodic in c) x prod over p | c of ghat_p(a)^n,
and the cocycle between two members a, b of the family is chat(a, b)^n times characters: weight n w(a, b), sign
(-1)^n. It does not depend on Pi. For r = 2: ghat_p(1) is in {1, i} up to the reciprocity sign, the epsilon
factor is of the form e x theta of c5 Theorem 7, and the family is closed by that theorem for every Pi and every
n. In particular the L-function of a genuine cusp form on the double cover of GL(3), defined through its lift to
GL(3) (Flicker-Kazhdan metaplectic correspondence, recalled), twisted by quadratic characters, has epsilon factor
omega(c) chi_c(N) (ghat(1))^3: a character times a periodic fourth root of unity. Type (iii) does not occur.
Remark: for even n the sign (-1)^n is +1 even when r >= 3; not used.

Lemma 2 leaves one place where the double cover could differ from a twist family: the Whittaker coefficients of the
genuine form itself, where the "epsilon factor" is the matrix of local coefficients on a space of Whittaker
functionals of dimension 4 (c5, weakest step 1). That is the decisive test.

## 3. First decisive test: local Whittaker values on the double cover of GL(3)

### 3.1 Object and recipe

[CLASSICAL-recalled: Brubaker-Bump-Friedberg, Gamma description of type A Weyl group multiple Dirichlet series
(Annals of Math. Studies 175; Annals 173 (2011)); McNamara, Duke 156 (2011), and Chinta-Offen, Amer. J. Math. 135
(2013): the same sums are the values of the spherical Whittaker function of the unramified genuine principal
series; Kazhdan-Patterson 1984 for the cover and the local coefficients.] For lambda = (l1, l2) and the n-fold
cover, with strict Gelfand-Tsetlin patterns T of top row (l1 + l2 + 2, l2 + 1, 0):

    N_lambda(x, y) = sum_T G(T) x^(k1(T)) y^(k2(T)),   G(T) = product over the three lower entries of gamma(Gamma_ij),

gamma = q^Gamma if the entry equals its right upper neighbour (circled), g(Gamma) = q^(Gamma - 1) g(Gamma mod n) if
it equals its left upper neighbour (boxed), q^(Gamma - 1)(q - 1) if neither and n divides Gamma, 0 otherwise;
k1 = Gamma_11, k2 = Gamma_12 + Gamma_22. N_lambda(x, y) is the Whittaker value at p^(l1), p^(l2) of the
principal series with parameters (x, y); the unitary axis is abs(x) = abs(y) = 1/q. Write x = Xu/q, y = Yu/q,
r = sqrt q, g(1) = T r with T^2 = eps = chi(-1). Globally T is multiplied by the quadratic symbol of the
prime-to-p part of the index (twisted multiplicativity), so T is the place where a symbol in the row label is
visible at p. The four classes kappa = (k1, k2) mod 2 of monomials are the four Whittaker functionals
(the lattice Z^3 modulo 2 Z^3 + Z(1,1,1) has 4 elements).

Validation of the recalled recipe [MEASURED, exact]:
1. n = 1: z^lambda N_lambda(z2/(q z1), z3/(q z2)) = s_lambda(z) (1 - z2/(q z1))(1 - z3/(q z2))(1 - z3/(q z1)) for
   the 16 shapes l1, l2 <= 3 (Tokuyama's identity; `gt.py` check 1: PASS).
2. n = 2, lambda = 0: N = 1 + g1 x + g1 y - g1 q x^2 y - g1 q x y^2 - g1^2 q x^2 y^2, the known quadratic A_2
   polynomial (recalled; with T = 1 it is (1 + X)(1 + Y)(1 - XY) in X = r x, the array of n4).
3. n = 2, rank one, same recipe: sum_j N_(2j)(Xu) U^j = (1 + T Xu/r)(1 - T Xu U/r)/((1 - U)(1 - Xu^2 U)). After
   U -> U/Xu this is (1 - T q^(-1/2) U)/((1 - Xu U)(1 - U/Xu)): Shimura's relation
   sum a(t n^2) n^(-s) = a(t) L(s, f)/L(s + 1/2, chi_t) in unitary normalisation, with T in the place of chi_t(p)
   (`rows_full_eps_plus.log`, lines A1).
4. n = 2, rank two: in all 64 series of 3.3 the product with (1 - U)(1 - Yu^2 U)(1 - Xu^2 Yu^2 U) is a polynomial of
   degree <= 2 in U (terms j = 3, 4, 5 vanish identically): the values satisfy the recurrence of a GL(3) Satake
   parameter (1, Yu^2, Xu^2 Yu^2), as the Hecke algebra of the cover (supported on squares) requires.

### 3.2 Lemma L (where the symbol and the sign enter)

**Lemma L [PROVED from the recipe, any rank, n = 2; MEASURED on 490 monomials].** In unitary normalisation each
pattern contributes a product over its entries of: 1 (circled); 1 - 1/q (neither, Gamma even); -1/q (boxed, Gamma
even); T q^(-1/2) (boxed, Gamma odd); 0 (neither, Gamma odd). Hence every coefficient of N_lambda(Xu, Yu) is an
integer polynomial in s = T q^(-1/2) and v = 1/q; T occurs only through s; every negative integer coefficient is
at order v or higher; the value at s = v = 0 is a nonnegative integer (a count of patterns).
Proof. Sum over entries of Gamma_ij equals k1 + ... + k_r: for fixed column k, sum over i <= k of
(k - i + 1)(a_(i,k) - a_(i-1,k)) telescopes to sum over i <= k of (a_(i,k) - a_(0,k)). So x^k = Xu^k q^(-k)
distributes one factor q^(-Gamma) to each entry, and gamma(Gamma) q^(-Gamma) is the listed value. QED
Check (`lemmaL.log`): 25 shapes l1, l2 <= 4, 490 monomials, symbolic q and T: PASS; minimal power of q^(-1/2) on a
negative term: 2.

Reading in the terms of Lemma 1: T q^(-1/2) is ghat(1) with its weight relative to the diagonal term, and -1/q is
ghat(0)/sqrt q. The local ring is Z[v][s]. A sign at order q^0 does not exist in it. This holds for each of the
four Whittaker classes separately and for every combination of them with coefficients of size O(1).

### 3.3 Row series in the twist direction [MEASURED, exact, 64 cases; 3 displayed]

G(U) = sum_j N_(l1, 2j+e)(Xu, Yu) U^j (and the twin in l1 with V), l1 or l2 fixed in {0, 1, 2, 3}, e in {0, 1},
T in {1, -1} (eps = 1) and {i, -i} (eps = -1). In every case G = Num/((1 - U)(1 - Yu^2 U)(1 - Xu^2 Yu^2 U)) with
Num of degree <= 2 in U (`rows_full_eps_plus.log`, `rows_full_eps_minus.log`: 64 of 64 "trunc OK").

* l1 = 0, l2 even, T = +-1:
  Num = (1 + T Xu/r)(1 + T Yu/r) [1 - Xu Yu/q - U (T Yu q^(-1/2) (1 - Xu^2 Yu^2/q) - (Xu Yu - Xu^2 Yu^2)/q)].
  The only term of the bracket above order 1/q is -T Yu q^(-1/2) U. The Euler product of the bracket over p is
  1/L(w + 1/2, chi x (one parameter)) times a product that converges absolutely for Re w > 0 (U = p^(-w), centre of
  the lift's L-function at Re w = 1/2). The symbol carries q^(-1/2): reciprocal at shift 1/2.
* l1 = 1 = l2 mod 2 (both odd): Num = (1 - Xu^2/q)(1 - Yu^2/q)(1 - Xu^2 Yu^2/q), no U and no T: the row series is
  the L-factor of the lift times normalising factors at shift 1.
* l1 = 2, l2 even: the part of Num of order q^0 is 1 + Xu^2 + Xu^2 Yu^2 - Xu^2 Yu^2 U. This has a root of modulus
  O(1), but it contains no T and occurs only at primes with l1 >= 2, i.e. finitely many primes for a fixed row
  label; it is the n = 1 phenomenon (generating series of Schur functions s_(l1 + l, l) in l), not a reciprocal.

Per Whittaker class (`rows_sym.log`, 40 cases, all "truncation OK"): the factors of Num that depend on U are
(1 - U) and (1 - Yu^2 U) (cancelling a factor of the L-function of the lift), (1 - Xu^2 Yu^2 U/q) (shift 1),
and polynomials equal to a T-free polynomial plus terms of order 1/q. T appears only as an overall factor
T/r^odd of a class. No class has a factor 1 - (unit) U with a sign that depends on T.

**Result of the test.** Gauss sum at every computed place. In the terms of the assignment: the quadratic symbol
enters as g_1 = T sqrt q (shift 1/2), never as a Jacobi-type cocycle; the sign -1 enters as g_0 (order 1/q).
With h/r = 1/2 for the square-class coherent set (e1, e2), the detection condition of the model of
`r3-method-limit` is beta > 3/2 - h/r - 0 = 1 as in e1 Lemma S: effective h = 0, model abscissa 1. Outcome (a).

## 4. Pivot (considered, not run)

Lemma 1 shows the smallest exponent group that contains both an element of order 2 and a value of type (iii) is
Z/4: chat(1, 1) = J(chi_4, chi_4)/sqrt q gives ghat_4(1)^2 = -(Hecke value) x ghat_2, i.e. mu(p) times the quadratic
kernel equals a square of quartic kernels. This is the row-order identity of map positive item 33 at r = 4, and
the resulting (4, 4) product rows are closed by map row Z14 (abscissa >= 7/8 + l2/8; conjugate pairs cancel the
Gauss sum). No new input relative to Z14 was found, so the pivot was not run.

## 5. Controls

The lane proves a local identity and an obstruction; it makes no estimate. Each control is run against the
statements of sections 2-3.

| control | passes or fails | step |
|---|---|---|
| THIN (completely multiplicative unimodular twist with a zero at b) | passes every step | Lemmas 1, 2, L do not involve the coefficients paired with the rows. No step separates zeta from THIN; the step that could (an absorption identity at shift 0) does not exist in the family. |
| unimodular twist U | passes | Xu -> e^(i theta_p) Xu, Yu -> e^(i phi_p) Yu: Lemma L and all 64 series hold identically in Xu, Yu. |
| Liouville / sign twist | passes | T -> -T at any set of primes: both signs computed; Lemma L is even/odd-graded in T and holds for both. |
| interpolation twin | passes | the lane reads only the sizes (weights) of local parameters; any array with the same local weights gives the same table. This is the closed device class "sizes of local parameters" (STRATEGY 3.1 item 10). |
| DH, backward heat, zeta(s+a)zeta(s-a), T-NR, Beurling, phase-rotated transfer operator, theta^w | not formulable | local algebra at one prime; no global object is formed. |

No control fails at any step: R3 is not established, as expected for an obstruction.

## 6. What is and is not covered

Covered: every unramified odd place; all four Whittaker classes; general Satake parameters; all ranks for
Lemma L; twist families of every GL(n) form (Lemma 2).

Not covered:
1. **Global constants of a cusp form [OPEN].** The psi-Whittaker functional of a genuine cusp form at p is one
   vector in the 4-dimensional space; its coordinates C_kappa(c', m'; p) depend on the form and on the
   prime-to-p part of the index. For Eisenstein series they are products of residue symbols (T -> T x symbol),
   and section 3 applies as computed. For a cusp form they are the analogue of the squarefree coefficients c(D)
   of half-integral weight (e2: signed square roots of central values, random-sign statistics on one form). They
   are not local, not an epsilon factor, and no formula is known to this lane. Lemma L bounds their effect only
   if their ratios are O(1) uniformly in p; a ratio of size sqrt p would change the leading term (rank-one
   calculation: the numerator root moves from modulus sqrt q to modulus 1 only if c_1/c_0 is of size sqrt q, and
   then the series degenerates to one pole and no reciprocal).
2. Places 2 and infinity, ramified places, other covers (n >= 3 is the existing sextic/cubic architecture).
3. The numerators for eps = -1 were checked for truncation only, not factored.

## 7. Requirement flags

* R1 (multiplicativity essential): **false.** The lane shows that the identity through which multiplicativity
  would enter (mu times kernel = cocycle times kernel, at shift 0) does not exist for exponent group Z/2.
* R2 (height-uniform, every window): **false.** No estimate is made.
* R3 (fails for every control at a named step): **false.** All formulable controls pass (section 5).
* R4 (reaches the critical line): **false.** Model abscissa 1 for the family; no ledger entry with h > 1.

Proposition 2.1 ledger: no entry. State of "R4 inside the 7/8 architecture" unchanged: no probe with h > 1.

## 8. Three weakest steps

1. **The recipe and the passage to cusp forms are recalled or argued.** The Gelfand-Tsetlin recipe, its
   identification with spherical Whittaker values, the count of 4 Whittaker functionals and the statement that
   T carries the symbol of the coprime part were not read in a source. The recipe is validated at n = 1
   (Tokuyama, 16 shapes), at n = 2 by one recalled polynomial, by Shimura's relation in rank one, and by the
   Hecke recurrence in 64 rank-two series; these do not test the assignment of symbols to individual entries
   (one T was used for all boxed odd entries; Lemma L does not depend on this, the displayed numerators do).
   For cusp forms the constants C_kappa are open (section 6 item 1); the verdict is for the local data and for
   symbol-type combinations.
2. **The criterion is a formulation.** "Absorption at shift 0 needs a cocycle value of type (iii)" is proved for
   kernels that are monomials in Gauss sums of the exponent group (Lemma 1) and for twist families (Lemma 2,
   which rests on the recalled twist formula for epsilon factors and on the recalled Flicker-Kazhdan lift). A row
   family whose kernel is not of this form (the open case of c5 Theorem 7) is not excluded by it; for the double
   cover of GL(3) the matrix local coefficients were replaced by the Whittaker values of Lemma L and were not
   computed themselves.
3. **Finite computation and model pricing.** Row series: l1 or l2 <= 3, six terms each, T in four values; the
   statement "remaining terms are O(1/q), Euler product absolutely convergent for Re w > 0" is read from the
   displayed case l1 = 0 and not proved for every fixed label. "Shift 1/2, hence abscissa 1" uses the scalar
   model of `r3-method-limit` transplanted to order 2 as in e1 and e2; the single-parameter form of the
   reciprocal (1 - T Yu q^(-1/2) U) was not matched to a named L-function.

## 9. Verdict

Precise obstruction, outcome (a): ORDER-2 is closed for rows built from the local data of the double cover of
GL(3), by the same kind of obstruction as e1 and e2 (symbol through a Gauss sum, reciprocal at shift 1/2), now
with the cause in checkable form: exponent group Z/2 has no Jacobi-type cocycle value (weight table
{-1/2, -1/2, +1/2}), and twist families inherit the GL(1) cocycle whatever the form. STRATEGY 4.0 item 2 has its
second same-kind obstruction and can be removed from the list under rule 2 of section 2. Map section 6 item 18
remains open only for the global Whittaker constants of a genuine cusp form, which are not epsilon-factor data.
Suggested map wording for Z21: add "exponent group Z/2: cocycle weights {-1/2, -1/2, +1/2}; type (iii) needs
r >= 3; local Whittaker ring Z[1/q][T q^(-1/2)] (Lemma L, all ranks)". No statement about zeros; RH open.
