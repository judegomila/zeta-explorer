# n4-gl3-double-cover-absorption: quadratic A_2 double Dirichlet series as an order-2 absorption object (2026-11-17)

Internal working note. Slug `n4-gl3-double-cover-absorption`. Nothing committed, pushed or posted. Not refereed.
Files here: `test1.py`, `test1.log`, `test1.json` (first test, exact, 1 s), `test1b.py`, `test1b.log` (Whittaker
normalisation, exact, 1 s), `test2.py`, `test2.log`, `test2.json` (row-norm measurement, 1 s). All runs local,
single process, through `scripts/memcap.sh 8`, interpreter `.venv-arb/bin/python` (sympy 1.14.0, numpy 2.5.3),
largest allocation 52 MB (printed before allocating). No ssh.

Labels: PROVED (complete argument or exact computation here) / CLASSICAL (cited; where recalled from memory and not
re-derived this is said) / MEASURED / ARGUED (derivation given, not line by line) / OPEN.

**Verdict: precise obstruction; the first test triggers the kill condition.** The p-part of the quadratic A_2 series
is the table of the quadratic symbol divided by one zeta-type factor. A term "Moebius times symbol", -chi_{d_0}(p),
does occur, but only at the index (m, d) = (p, d_0 p^2), that is at primes whose square divides d; in the row
Dirichlet series it is cancelled exactly by the Euler factor of L(s, chi_{d_0}), and in the Whittaker normalisation
it is the Moebius function of the normalising factor 1/zeta(2w), attached to the argument s + 2w. At primes not
dividing d the row coefficient is +chi_d(p). Both generators of the functional-equation group are the functional
equations of quadratic Dirichlet L-functions (Poisson summation with the Weil index). The rank-2 series therefore
extends `ap-order-two` Theorem E; it does not supply the absorbing object of `r3-method-limit`. No statement about
any zero is made. RH open.

---

## 1. Plan; relation to closed rows

Read: BRIEF (all notices), OBSTRUCTION_MAP (rows Z14, Z15, G18, section 6 item 1), `ap-order-two` sections 3, 5, 6,
`res-order-two-nonpoisson` sections 6-8 (item 8.2 "higher rank" not covered), `n1-maass-selberg-norm` sections 2-3.

What was closed: on SL_2 and its double cover, order-2 rows are self-dual under Poisson summation (Lemma 0, Theorem
C, E of `ap-order-two`), and every residual or Hecke-eigen object has either character coefficients on squares or a
reciprocal already present (`res-order-two-nonpoisson` Theorem 5). Not covered there: the double cover of GL(3).

What is tested here: the Whittaker coefficients of the minimal-parabolic Eisenstein series on the double cover of
GL(3) are the quadratic A_2 double Dirichlet series. Its functional-equation group S_3 is non-abelian and every
non-trivial element moves the row variable. Question: does a coefficient of the form mu(m) chi_d(m) appear as a
row, with a functional equation acting on it?

Decision rule fixed in advance: kill if the row-linear coefficients are of L-type (+chi) or if the generators are
Poisson self-dual in a quadratic symbol.

---

## 2. Source and normalisation

* [CLASSICAL, recalled] Chinta-Friedberg-Hoffstein, "Multiple Dirichlet series and automorphic forms" (Proc. Symp.
  Pure Math. 75, 2006), and Goldfeld-Hoffstein 1985 / Siegel for the GL(2) origin:
  Z(s, w) = sum_d L(s, chi_{d_0}) Q_d(s) d^{-w}, d = d_0 d_1^2, d_0 squarefree,
  Q_d(s) = sum_{e_1 e_2 | d_1} mu(e_1) chi_{d_0}(e_1) e_1^{-s} e_2^{1-2s}.
  zeta(2s + 2w - 1) Z(s, w) (with 2-adic and archimedean factors) is invariant under
  sigma_1: (s, w) -> (1 - s, w + s - 1/2) and sigma_2: (s, w) -> (s + w - 1/2, 1 - w).
* [CLASSICAL, recalled] Chinta-Gunnells, "Weyl group multiple Dirichlet series constructed from quadratic
  characters" (Invent. Math. 167, 2007): the p-part is the rational function, in x = p^{-s} (row variable m),
  y = p^{-w} (variable d),

      f(x, y) = (1 - x y) / ((1 - x)(1 - y)(1 - p x^2 y^2)),

  invariant under the action (f|sigma_1)(x, y) = -(1 - p x)/(p x (1 - x)) f^+(1/(p x), sqrt(p) x y)
  + (1/(sqrt(p) x)) f^-(1/(p x), sqrt(p) x y), f^+- the even/odd parts in y; sigma_2 the same with x, y exchanged.
  The coefficient of x^l y^k is the coefficient H(p^l, p^k); the global coefficients are built by twisted
  multiplicativity with quadratic residue symbols.
* [CLASSICAL, recalled] Brubaker-Bump-Friedberg-Hoffstein (Weyl group multiple Dirichlet series III, Ann. Math.
  2007): the Whittaker coefficients of the Borel Eisenstein series on the n-fold cover of GL(3) are the A_2 series
  of order n. In the Whittaker normalisation the factors zeta(2s) zeta(2w) zeta(2s + 2w - 1) are removed and the
  p-part is the six-term polynomial N(x, y) (one term per Weyl group element).

The identification of the three normalisations is cited, not re-derived (weakest step 1). What is checked here
exactly is listed in section 3.

---

## 3. First test [PROVED: exact sympy; `test1.log`, `test1b.log`]

(a) f|sigma_1 = f and f|sigma_2 = f (difference simplifies to 0).

(b) Uniqueness. Among all N/((1 - x)(1 - y)(1 - p x^2 y^2)) with N of bidegree <= (3, 3) (16 unknowns), the
invariant ones are the multiples of 1 - x y. So the recalled f is the only candidate of this shape; this protects
the test against a misremembered numerator.

(c) Columns. For k = 0..12 the coefficient of y^k is L_p(x) Q_{p^k}(x): for k = 2j, (1 - x)^{-1} (sum_{b<=j}
(p x^2)^b - x sum_{b<j} (p x^2)^b); for k = 2j + 1, sum_{b<=j} (p x^2)^b. Table of coefficients of x^l y^k:

    k=0: 1 1 1 1 1 ...      k=1: 1 0 0 0 0 ...      k=2: 1 0 p p p ...      k=3: 1 0 p 0 0 ...
    k=4: 1 0 p 0 p^2 p^2 .. k=5: 1 0 p 0 p^2 0 ..   k=6: 1 0 p 0 p^2 0 p^3 ...

(d) Row-linear monomials x y^k, k = 0..12:

| k | from the Euler factor L_p | from Q (the term mu(e_1) chi(e_1) e_1^{-s}) | total | target -chi_{p^k}(p) |
|---|---|---|---|---|
| 0 | +1 | 0 | +1 | -1 |
| odd | 0 | 0 | 0 | 0 |
| even >= 2 | +1 | -1 | 0 | -1 |

No row-linear coefficient is negative.

(e) General chi = chi_{d_0}(p) = +-1 and p^{2j} || d: the row series is 1 + p x^2 (...)/(1 - chi x); for j = 1 the
coefficients at m = p^l are 1, 0, p, chi p, p, chi p, ... The coefficient at m = p is 0 for every j >= 1.

(f) f (1 - p x^2 y^2) = 1/(1 - x) + 1/(1 - y) - 1, the generating function of the imprimitive symbol table
(p^k / p^l) (1 if k = 0 or l = 0, else 0). The only negative monomial of the numerator, -x y, is the
inclusion-exclusion term for chi_p(p) = 0.

(g) The group generated by sigma_1, sigma_2 on (s, w) has order 6; the s-coordinate of the six images is
s, 1 - s, s + w - 1/2, w, 3/2 - s - w, 1 - w. Only the identity fixes the row variable.

(h) Whittaker normalisation: N(x, y) = f (1 - x^2)(1 - y^2)(1 - p x^2 y^2) = (1 - x y)(1 + x)(1 + y)
= 1 + x + y - x^2 y - x y^2 - x^2 y^2. Monomials linear in x: +x and -x y^2. Monomials linear in y: +y and
-x^2 y.

### Reading of the test

**Lemma 1 [PROVED from (c)-(e), (h); the passage from the p-part to global coefficients by twisted multiplicativity
is ARGUED].** Let d = d_0 d_1^2 and p an odd prime.
(i) p not dividing d: the coefficient at (m, d) = (p, d) is +chi_d(p) in both normalisations.
(ii) p || d or p^3 | d with odd exponent: 0.
(iii) p^2 | d with even exponent: in the series normalisation the coefficient is chi_{d_0}(p) - chi_{d_0}(p) = 0: the
Moebius term of Q_d cancels the Euler factor exactly, L_p Q_p = 1 + p x^2 (...)/(1 - chi x). In the Whittaker
normalisation the coefficient at (p, d_0 p^2) is -chi_{d_0}(p) and at (p, d_0 p^{2j}), j >= 2, it is 0; the minus
sign is the Moebius inversion over square divisors of d produced by removing zeta(2w):
H_N(p, d_0 p^2) = H(p, d_0 p^2) - H(p, d_0) = 0 - chi_{d_0}(p).

So the answer to the first lemma is: the term -chi_{d_0}(p) exists, and it sits on the slice d = d_0 m^2, not on a
row. For fixed d the indices m with a Moebius-type coefficient are the divisors of d_1, a finite set tied to d.

**Lemma 2 (the slice) [ARGUED].** For m squarefree, coprime to 2 d_0, H_N(m, d_0 m^2) = +-mu(m) chi_{d_0}(m)
H_N(1, d_0) (sign from reciprocity, a function of m, d_0 mod 4), and
sum_m H_N(m, d_0 m^2) m^{-s} (d_0 m^2)^{-w} = d_0^{-w} / L(s + 2w, chi_{d_0}) up to factors at 2. The reciprocal
appears at the argument s + 2w. On the unitary axis Re s = Re w = 1/2 this is Re = 3/2. The slice {d = d_0 m^2} is
an arithmetic relation between the two indices; contour operations in (s, w) apply weights depending on the sizes
of m and d and cannot select it, and it is not mapped to itself by sigma_1 or sigma_2. No functional equation of Z
acts on the slice sum.

**Lemma 3 (sifted row) [PROVED from (e)].** If d_1 is divisible by every prime in a set P (so that Q_d contains the
truncated reciprocal prod_{p in P} (1 - chi_{d_0}(p) p^{-s})), the row series is
L(s, chi_{d_0}) Q_d(s) = prod_{p not | d_1} (1 - chi_{d_0}(p) p^{-s})^{-1} prod_{p | d_1} (1 + p^{1-2s} (...)):
an L-function with the primes of P removed, not a reciprocal. This is the rank-2 form of "mu * 1 = delta"
(`res-order-two-nonpoisson` Theorem 5(iii)).

**Lemma 4 (generators) [CLASSICAL].** sigma_1 is the functional equation of L(s, chi_{d_0}) Q_d(s) for each d
(Poisson summation in m; Gauss factor = Weil index eps_d times a character). sigma_2 is the same statement in d
after quadratic reciprocity. Each generator is of the kind covered by `ap-order-two` Lemma 0 and Theorem C. The
other four elements are compositions; the coefficient array H is the same on all six sides.

**Kill.** The decision rule of section 1 is met on both clauses: row-linear coefficients at p not dividing d are
+chi_d(p), and the generators are quadratic Poisson dualities.

---

## 4. Theorem E2: extension of `ap-order-two` Theorem E to the quadratic A_2 system

Estimate system. (R2) Rows are indexed by d, columns by m, with coefficient array c(m, d). (P2) Second
representations are the elements of the group generated by sigma_1, sigma_2. (T) A detector needs rows whose
principal term carries mu(m) xi(m). (L) Low estimates are norms or identities using no zero information.

**Theorem E2.**
(1) [PROVED-rel section 3] With c = H (the Whittaker coefficients), no row carries a reciprocal of an L-function
in the row variable. The reciprocals in the system are 1/zeta(2s), 1/zeta(2w), 1/zeta(2s + 2w - 1) (normalising
factors, arguments of real part 1 on the unitary axis: mechanism M1 of `res-order-two-nonpoisson`, h/r = 0, B = 1)
and 1/L(s + 2w, chi_{d_0}) on the slice of Lemma 2 (real part 3/2).
(2) [PROVED] With an inserted coefficient, Z_x(s, w) = sum_c x_c c^{-s} L(w, chi_c), c odd squarefree, |x_c| <= 1:
sigma_2 holds for every x (it is the functional equation of each L(w, chi_c), conductor factor c^{1/2 - w}).
The region reached from absolute convergence {Re s > 1, Re w > 1} by sigma_2 and convexity is
{Re s > 1 for Re w >= 1; 2 Re s + Re w > 3 for 0 <= Re w <= 1; Re s + Re w > 3/2 for Re w <= 0}; its infimum of
Re s is 1. Proof: the image of {sigma > 1, omega > 1} is {omega < 0, sigma + omega > 3/2}; the hull of the two
convex sets is bounded by the line through (1, 1) and (3/2, 0). QED. This region is the same for x = mu, |mu|,
random signs, or mu times a unimodular multiplicative twist.
(3) [PROVED-rel `ap-order-two` Lemma 0; ARGUED for the "only if"] sigma_1 holds for Z_x as an identity between
Dirichlet series only if each row series sum_m x_m chi_d(m) m^{-s} has a functional equation with both sides
Dirichlet series; for x = mu the row is 1/L(s, chi_d), whose reflected expansion converges in Re s < 0 and is
separated from Re s > 1 by the poles at the zeros. With x = mu the group drops from S_3 to {1, sigma_2}, which is
the single quadratic Poisson summation of `ap-order-two` Theorem C, and Theorem D(i) there (invariance under
x_c -> e_c x_c) applies.
(4) Hence the system has no design with a reciprocal row and a reflected side: either c = H (no reciprocal
row; B = 1) or x = mu inserted (one Poisson side; f(theta) = theta by Theorem E(3)).

Why rank 2 does not change the outcome. The non-abelian group comes from two symbols glued by reciprocity, each of
order 2. The absorption of the 7/8 method needs one Gauss sum that is a new function. The Gauss sums of the
quadratic A_2 series in the Brubaker-Bump-Friedberg normalisation are g(1, p) = eps_p sqrt p (Weil index) and the
degenerate sum g(p, p^2) = -p (Ramanujan sum, the Gauss sum of the principal character). The second one is the
source of every minus sign in N; it is mu(p) with p^2 dividing the other index, the same object as in Lemma 0 of
`ap-order-two` ("the Gauss sum of the principal character is -1 = mu"). Its support condition p^2 | d is what
confines it to the slice.

---

## 5. Measurement run after the kill [MEASURED; `test2.log`; does not bear on the verdict]

The n = 2 row-norm test listed as never run (`n1-maass-selberg-norm` section 3) was run in the inserted-coefficient
form, since it costs 1 s. Rows d odd <= D = Z, columns c odd squarefree <= Z (sharp cutoff),
N(x) = sum_d |sum_c x_c (d/c)|^2, diagonal = #rows * sum |x_c|^2. Ratio N/diagonal on [squarefree d > 1 | d a
square | other d]; random controls are 40 draws (mean, sd).

| Z | mu | abs(mu) | random +-1 (sd) | random multiplicative signs (sd) |
|---|---|---|---|---|
| 1000 | 0.659, 3.53, 0.441 | 0.543, 302, 0.163 | 0.873 (0.037), 1.11 (1.39), 0.716 (0.170) | 0.878 (0.076), 0.88 (1.17), 0.724 (0.259) |
| 2000 | 0.644, 2.86, 0.262 | 0.580, 601, 0.166 | 0.879 (0.031), 0.71 (0.75), 0.710 (0.100) | 0.865 (0.051), 0.81 (1.22), 0.688 (0.145) |
| 4000 | 0.811, 3.14, 0.346 | 0.609, 1181, 0.173 | 0.878 (0.026), 0.76 (0.81), 0.748 (0.105) | 0.874 (0.041), 1.37 (2.69), 0.699 (0.122) |
| 8000 | 0.776, 2.30, 0.367 | 0.634, 2380, 0.186 | 0.873 (0.017), 0.98 (1.14), 0.734 (0.077) | 0.874 (0.029), 0.76 (1.25), 0.734 (0.141) |

Reading. On non-square rows every coefficient choice gives a ratio of order 1 with no trend in Z over this range
(mu: 0.66, 0.64, 0.81, 0.78; random 0.87). mu is below the random mean by a constant factor (at Z = 8000 by 5.7
control standard deviations), not by a power of Z in this range; a range of one decade cannot decide an exponent.
The whole difference between mu and abs(mu) is in the square rows: abs(mu) gives 0.30 Z (302, 601, 1181, 2380),
mu gives O(1). This is `ap-order-two` Theorem D(i) at the measured level: the non-square rows do not separate mu
from a sign pattern, and the square rows are where the sum of x_c itself appears.

Pricing in the scalar law B >= 1 - h/r [MODEL]. Rows of order r = 2, coherent set = squares, exponent 1/2. For
c = H the coherent rows carry the polar term (zeta(2s)-type residue at w = 1), not a reciprocal: no detector, and
the reciprocals present give h/r = 0, B = 1. For inserted mu: h/r = 1/2 and model B = 1/2 with a low estimate that
is the conclusion (f(theta) = theta). No entry below 1 with a non-circular input list.

---

## 6. Controls

No zero statement is made, so nothing can transfer wrongly. What each control does to the construction:

| control | outcome | reason |
|---|---|---|
| DH | not a cover coefficient | H is twisted multiplicative. The chi_d-twisted DH is alpha L(s, chi chi_d) + conj(alpha) L(s, conj(chi) chi_d): a combination of two series of this type with a character mod 5 inserted; each has its own group. No reciprocal occurs, so the zeros of DH enter nowhere (same as row G18) |
| backward heat | not formulable | no Dirichlet series in a fixed variable; there is no zero-detection step here at which it would need to be excluded |
| sign twist, U | sigma_2 holds, sigma_1 lost | Theorem E2(2): Z_x keeps sigma_2 and the same region for every bounded x. No completed row, no reflected side. The system returns the input abscissa |
| E_a | own abscissa | rows L(s + a, chi_d) L(s - a, chi_d) are a slice of a quadratic series in three variables; poles shifted by +-a; nothing ties a to 0 |
| theta^4 (level 4 Eisenstein, no single Euler product at 2) | same class as c = H | L-type coefficients, reciprocals only in normalising factors at its own edge |
| NR, Beurling | not formulable | no residue symbols over Beurling integers; one non-tempered factor has no cover object here |

All primes together: yes (the identities are exact). Uniform in height: yes (half-plane statements). Fails for the
controls: the construction proves nothing for zeta, so there is nothing that fails for them.

---

## 7. What is not covered

1. The non-generic theta representation on the double cover of GL(3) (Kazhdan-Patterson exceptional
   representation with n = 2 < r = 3): it has no Whittaker coefficients, and its coefficients along other unipotent
   orbits were not examined.
2. Cusp forms and maximal-parabolic Eisenstein series on the double cover of GL(3) (rows L(s, pi x chi_d)).
3. The slice sum of Lemma 2 as an object in its own right (a diagonal of a double Dirichlet series). It carries
   1/L(s + 2w, chi_{d_0}) at real part >= 3/2 in the region where anything is known.
4. Quadratic series of higher rank or other type (A_3, D_4): their p-parts are Weyl-group averages for the same
   quadratic action; expected to behave the same way; not computed.
5. Covers of degree n >= 3 of GL(3): these are the cubic and higher Gauss classes of the existing 7/8 family
   (rows Z14, Z15), not order 2.

---

## 8. Three weakest steps

1. **Normalisations are recalled, not re-derived.** The Chinta-Gunnells p-part, the Chinta-Friedberg-Hoffstein
   correction polynomial and the Brubaker-Bump-Friedberg statement that the Whittaker coefficients are this series
   are quoted from memory. Checked here: invariance of f, uniqueness of the numerator over the stated denominator
   within bidegree (3, 3), and agreement of every column with L_p Q for k <= 12. Not checked: 2-adic and archimedean
   factors, and the exact form of the Whittaker normalisation beyond N = f times the three zeta-type factors.
2. **Global statements from the p-part.** Lemma 1 for composite indices and Lemma 2 use twisted multiplicativity
   with reciprocity signs that were not written out or tested numerically. The statement that no contour operation
   or group element reaches the slice is an argument, not a theorem.
3. **Scope of Theorem E2.** Part (3) ("only if") is argued. The theorem covers the Borel Eisenstein series only;
   items 1-2 of section 7 are outside it. The measurement covers Z <= 8000 with sharp cutoffs and supports no
   exponent.

---

## 9. Verdict

Precise obstruction. The quadratic A_2 double Dirichlet series does not turn mu(m) chi_d(m) into an evaluable
row coefficient: the Moebius-times-symbol term is confined to the slice d = d_0 m^2 (argument s + 2w), is cancelled
by the Euler factor in every row, and the functional-equation group is generated by two quadratic Poisson
dualities. Effective order 2 is not supplied by the double cover of GL(3) through its Borel Eisenstein series.
OBSTRUCTION_MAP section 6 item 1 stays open only for the objects in section 7 items 1-2. No pivot beyond the
measurement of section 5 was taken.
