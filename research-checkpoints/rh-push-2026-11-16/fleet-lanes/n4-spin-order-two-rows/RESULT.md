# n4-spin-order-two-rows: spin of ideals as an order-2 row (2026-11-17)

Internal working note. Slug `n4-spin-order-two-rows`. Nothing committed, pushed or posted. Not refereed.
Files here: `test1.py`; `test1.log`, `test1.json` (norms <= 2e4, 20 s); `test1_2e5.log`, `test1_2e5.json`
(norms <= 2e5, 65 s). Runs local, one process, through `scripts/memcap.sh 8` with `.venv-arb/bin/python`
(numpy's BLAS used a second thread inside the SVD). Largest allocations, printed before allocating: 604 MB
(generator box search, 2e5 run) and 616 MB (four 4388 x 4388 float64 matrices). No ssh.

Labels: PROVED (complete argument here) / CLASSICAL (cited, not re-read) / MEASURED / OPEN.

**Verdict: precise obstruction; the first test kills the lane.** Spin has no absorption identity. Its cocycle is,
exactly, the plain quadratic residue symbol of K times a rational Jacobi symbol times a factor depending on
generators mod 4 (Lemma 2), and it equals -1 on half of all coprime pairs. So no product of spin with any
multiplicative function is multiplicative, and in particular no product or power of spins and ray-class characters
equals mu times a Hecke character (Proposition 4). The bilinear matrix (alpha/sigma(beta)) is a row permutation of
the matrix (alpha/beta) (Lemma 3): same singular values, same Poisson dual class. The correlation of spin with mu
on squarefree ideals is 0.012 at norm 2e5, not near 1. The row is orthogonal to mu: it carries no signal term, so
no low estimate was evaluated and no model abscissa is stated. No statement about any zero is made. RH open.

---

## 1. Plan; relation to closed rows

Read: BRIEF (all notices), OBSTRUCTION_MAP (section 2, row Z15, section 5 part 6, section 6 item 1),
SYNTHESIS_AUTOMATIC_POSITIVITY 1.5 (`ap-order-two`), SYNTHESIS_POSITIVITY_RESIDUALS section 4
(`res-order-two-nonpoisson`), `n3-order2-dual-rank-classification` (verdict), `zf-higher-rows` (Theorem 1:
absorption at every order r >= 3), `r3-method-limit` (sigma_0 = 1 - h/r).

State of order 2 before this lane: the row m -> (m/c) has Poisson dual (Weil index) x (character), so mu must be
put into the coefficient by hand and the system returns its input (`ap-order-two`); half-integral weight, cone
counts and Salie rows give 1/L(s + 1/2) identities with unconditional abscissa 1 (`res-order-two-nonpoisson`);
polynomial arguments f(m) put the target at 1/zeta(1 + s) (`n3-order2-dual-rank-classification`).

Question here: spin(a) = (alpha/sigma(a)) (Friedlander-Iwaniec-Mazur-Rubin) is an order-2 symbol whose twisted
multiplicativity has a non-symmetric cocycle. Does it supply what the cubic Gauss sum supplies in the 7/8 method:
(i) a twisted-multiplicative row, (ii) an absorption identity (some monomial equals mu times a Hecke character,
as g^3 = mu(c) c^2 c-bar), (iii) a Poisson dual in a different class?

New relative to the map: Lemmas 1-3 and Proposition 4 below, with exact checks. FIMR's theorems are classical and
are only cited.

## 2. Setting

K = Q(theta), theta^3 + theta^2 - 2 theta - 1 = 0, conductor 7, O_K = Z[theta], sigma(theta) = theta^2 - 2
(checked in code: root of the polynomial, order 3). Class number 1; the units -1, theta, 1 + theta realise all 8
sign patterns (checked: every generator tested has exactly one totally positive associate among the 8 classes),
so every ideal has a totally positive generator alpha, unique up to squares of units. 2 is inert.
For odd b, (x/b) is the quadratic residue symbol, multiplicative in both arguments. For a = (alpha) odd:

    spin(a) = (alpha / sigma(a)) = (sigma^2(alpha) / a),      spin'(a) = (alpha / sigma^2(a)) = (sigma(alpha) / a).

Write R(x, y) = (x/y)(y/x) for coprime odd totally positive x, y.

Computation (exact integers): generators of all 17942 odd prime ideals of norm <= 2e5 (box search in float64,
each generator then verified by exact norm and exact total positivity through the signs of the characteristic
polynomial); 52570 odd ideals of norm <= 2e5 by multiplication; symbols by Legendre symbols at degree-1 primes and
by the Legendre symbol of the norm at inert primes (checked against direct exponentiation in F_p[theta]);
independence of the unit-square choice checked on 500 ideals.

## 3. Results

**Lemma 1 (cocycle). PROVED (bimultiplicativity).** spin(ab) = spin(a) spin(b) (alpha/sigma(b)) (beta/sigma(a)).
Code check: 300000 random pairs, 0 failures (both runs). This tests the implementation, not a theorem.

**Lemma 2 (reduction of the cocycle). PROVED.** For N(a), N(b) coprime, with B(a,b) = (alpha/sigma(b))(beta/sigma(a)):

    B(a, b) = (beta/a) * (N beta / N alpha)_Jacobi * R(sigma^2 alpha, beta).

Proof. sigma(alpha) sigma^2(alpha) = N(alpha)/alpha gives (beta/sigma a)(beta/sigma^2 a)(beta/a) = (beta/(N alpha)),
and (beta/(n)) = (N beta / n) for a rational odd n > 0 (at a split p it is the product of three Legendre symbols of
the three conjugate residues; at an inert p the norm map F_{p^3}* -> F_p* carries non-squares to non-squares). So
(beta/sigma a) = (beta/a)(N beta/N alpha)(beta/sigma^2 a), and (alpha/sigma b)(beta/sigma^2 a) =
(sigma^2 alpha/b)(beta/sigma^2 a) = R(sigma^2 alpha, beta). End.
Check: 272715 (2e4 run) and 271948 (2e5 run) coprime pairs, 0 failures.
R is a 2-adic Hilbert-symbol factor (CLASSICAL: reciprocity; the real places contribute 1 for totally positive
arguments). MEASURED: R(x, y) is constant on each of the 56 x 56 = 3136 pairs of unit classes mod 4, all seen, and
equals -1 on 1372 = (7/16) 3136 of them, the count for a non-degenerate pairing on (1 + 2O)/(1 + 4O) = (Z/2)^3.
Same mechanism: spin(a) spin'(a) = R(alpha, sigma alpha), MEASURED constant on each of the 56 classes of alpha mod 4
(+1 on 21004 ideals, -1 on 20853).

Reading: reciprocity does not send the cocycle "to the symbol at sigma^2 instead of to itself" in any way that
leaves the quadratic class. Up to a rational Jacobi symbol and a mod-4 factor the cocycle IS the ordinary symbol
(beta/alpha) of K, and spin at sigma and at sigma^-1 agree up to a function of alpha mod 4.

**Lemma 3 (bilinear form). PROVED.** (alpha/sigma(b)) = (sigma^2(alpha)/b). The set of odd squarefree ideals of
norm <= X is stable under sigma^2, so the matrix M_sigma = [(alpha/sigma(b))] equals P M_id with P a permutation
matrix and M_id = [(alpha/b)]. Singular values, operator norm and every large-sieve constant are those of the plain
quadratic symbol matrix. Poisson summation in alpha modulo sigma(b) gives the quadratic Gauss sum of sigma(b):
(h/sigma(b)) x (Weil index) x N(b)^{1/2} = (sigma^2(h)/b) x (same), the same class with the same relabelling. The
proposed first lemma (direct and dual probes are different representations) is false at the bilinear level. Spin is
the restriction of M_id to the graph {(sigma^2 a, a)}.
Check: M_sigma = P M_id exactly at n = 649 (norm <= 3000) and n = 4388 (norm <= 2e4); diag(M_sigma) = spin.

| norm <= | n | top singular value, sigma = id | sigma | random signs | 2 sqrt n |
|---|---|---|---|---|---|
| 3000 | 649 | 43.2673 | 43.2673 | 49.90 | 50.95 |
| 20000 | 4388 | 115.4845 | 115.4845 | 130.66 | 132.48 |

Difference id vs sigma over the top four values: 5e-13. (The task's 3000 x 3000 was an overestimate of the ideal
count at norm 3000; the 2e4 matrix is the larger case.)

**Proposition 4 (no absorption). PROVED given Lemma 2 and Chebotarev (CLASSICAL).**
(i) spin^2 is the indicator of (a, sigma a) = 1; spin spin' is a function of alpha mod 4. So every monomial in
spin, spin' and ray-class characters is (function of a ray class) or (function of a ray class) x spin.
(ii) If spin x psi_1 = mu x psi_2 on squarefree ideals prime to a modulus, with psi_i multiplicative and non-zero,
then spin is multiplicative there, i.e. B(p, q) = 1 for all distinct primes p, q in that set.
(iii) For fixed p = (alpha), the map q = (beta) -> B(p, q) = (beta/sigma p)(beta/sigma^2 p) R(sigma^2 alpha, beta)
(from Lemma 1 and (alpha/sigma q) = (sigma^2 alpha/q)) is a character of the ray class group of conductor
dividing 4 sigma(p) sigma^2(p) infinity (it is trivial on totally positive units, which are squares).
It is non-trivial: choose beta totally positive, = 1 mod 4, a non-residue mod sigma(p), = 1 mod sigma^2(p). So
B(p, q) = -1 for half of the primes q. Hence (ii) fails for every modulus.
MEASURED: B = -1 on 134127 of 272715 coprime pairs (2e4) and 134976 of 271948 (2e5); on pairs of distinct split
primes, 99792 of 199727 and 100306 of 199965.

**Absorption test (b). MEASURED.**

| quantity | norm <= 2e4 | norm <= 2e5 |
|---|---|---|
| split primes: number, sum of spin | 2265, +123 | 17931, -75 |
| squarefree, spin != 0: number | 4092 | 40854 |
| mean of spin x mu | -0.0264 | +0.0123 |
| mean of spin | +0.0337 | +0.0056 |
| mean of mu (reference) | -0.1334 | -0.0166 |
| all odd ideals: mean of spin x Liouville | -0.0136 | +0.0168 |

Ray classes: for m in {3, 4, 5, 7, 8, 12, 15, 21} the class of alpha in (O/m)* modulo squares of units was computed
(2 to 16 classes). The quantity sum over classes of |sum of spin x mu in the class| / total bounds the correlation
of spin x mu with every function of the class, hence with every ray-class character of that modulus without
infinity type. Values at 2e5: 0.012 to 0.024 (random-sign control 0.004 to 0.014); for spin on primes 0.007 to
0.031 (control 0.005 to 0.037). No class with >= 8 members is pure in either run. Nothing is near 1.
The 2e4 prime sum (+123, 2.6 standard deviations of a coin model) is not present at 2e5 (-0.56).
Side check: spin takes the same value on the three primes above a split p (5977 rational primes, 0 failures;
PROVED: spin(sigma a) = (sigma alpha/sigma^2 a) = spin(a)).

**Why the cubic case has absorption and order 2 does not. CLASSICAL.** For r >= 3 the normalised Gauss sum
g(c)/N(c)^{1/2} has infinite order; g^r is N(c) times Jacobi sums, and the congruence J = -1 modulo the primary
normalisation gives mu(c) times a Hecke character (`zf-higher-rows` Theorem 1 covers every r >= 3). A {0, +-1}
symbol s has s^2 = indicator: there is no power to take. The only way for an order-2 symbol to carry mu is
s(p) = -psi(p) at every prime with trivial cocycle, which is the hand-inserted coefficient of `ap-order-two`
Lemma 0.

**Narrower no-go (non-theta order-2 symbols). PROVED, elementary.** Let s: squarefree ideals prime to m ->
{+-1} with s(ab) = s(a) s(b) B(a, b), B a bicharacter. Then: (1) the monoid generated by s and multiplicative
functions is {psi, psi s}; (2) s x psi_1 = mu x psi_2 iff B = 1 on coprime pairs; (3) in that case s = mu psi is
multiplicative and the probe is the Dirichlet-coefficient probe that returns its input. So an order-2 symbol either
has trivial cocycle (circular) or non-trivial cocycle (no absorption, no mu main term). Outside this statement:
objects that are not {0, +-1}-valued symbols with a bicharacter cocycle (for example coefficients of
half-integral-weight forms, covered separately by `res-order-two-nonpoisson`).

**Type of the lane: parity / no signal.** FIMR prove (CLASSICAL, recalled from the 2013 paper: unconditional for
cubic K through Burgess, exponent 1/10656) that the sum of spin over primes of norm <= x is O(x^{1 - nu}). A power
saving over primes proved by bilinear forms is available because spin has no Euler product. If an absorption
identity existed, the same theorem would give a zero-free strip for a Hecke L-function of K; Proposition 4 is the
exact statement that it does not exist. The spin row correlates with mu at the noise level, so in the 7/8 ledger it
has no signal exponent (no count of r-th powers enters), and zeta_K = zeta L(chi) L(chi-bar) never appears in a
main term.

## 4. Controls

No zero statement is made, so no control can break one. Where each would stand:

- DH: spin is defined on ideals of O_K, not on Dirichlet coefficients; a DH-type target would enter only through
  the coefficient x_c paired with the row. Since the row has no mu main term for zeta either, zeta and DH are not
  separated (the norm-6 defect 1.0807 of the row-target factorisation is never reached).
- Backward heat: not applicable; no kernel-side statement.
- Sign twist and U: the Type I step of FIMR (Burgess on a segment of the lattice O_K) has no counterpart for
  eps_n Lambda(n) on Q; nothing to run.
- E_a: Euler product and functional equation present; the row is blind to the size normalisation because it has no
  main term against any multiplicative target.
- Internal controls run: sigma = id (identical spectrum, Lemma 3); random signs (top singular value 13% larger
  than the symbol matrix); random-sign class sums in test (b).

Model abscissa: none. The low estimate was not evaluated because the signal term is absent.

## 5. Pivot

One pivot was allowed. Three adjacent ideas were examined on paper; none was run because each lands in a closed row.
1. Quartic rows: g_4(pi)^2 = -chi(-1) pi N(pi)^{1/2}, so mu is absorbed at power 2. This is the r = 4 case of
   `zf-higher-rows` Theorem 1 (abscissae 7/8 or 8/9), already closed.
2. Descent to Q: spin is constant on the primes above p, so it defines a sign on rational primes p = +-1 mod 7.
   By Proposition 4 and FIMR it is not a Frobenius class function of a fixed extension in any usable sense (it has
   no L-function), so it gives no Artin factor of zeta.
3. Using the non-degenerate mod-4 pairing R as a twist: it is a finite-conductor character, inside `ap-order-two`.

## 6. Three weakest steps

1. Proposition 4(iii) uses that the character q -> B(p, q) is non-trivial on the narrow ray class group. The
   argument given (a totally positive beta = 1 mod 4 with prescribed residues at sigma p, sigma^2 p) is short and
   was not written with the Hilbert-symbol conductor made explicit; the mod-4 dependence of R is MEASURED on all
   3136 class pairs, not derived here. The measured 49.6% to 50.2% of -1 values agrees.
2. The FIMR theorem (unconditional power saving for cubic fields, the exponent, and that it holds for this K) is
   quoted from memory and was not re-read. Only the "parity" interpretation depends on it; Lemmas 1-3 and
   Proposition 4 do not.
3. The correlation table is a finite-range measurement (norm <= 2e5, about 4e4 terms; values 0.006 to 0.017, two
   to three coin-model standard deviations for two of the sums). It excludes a correlation near 1; it does not
   measure a rate of decay. The narrower no-go covers {0, +-1} symbols with a bicharacter cocycle only.
