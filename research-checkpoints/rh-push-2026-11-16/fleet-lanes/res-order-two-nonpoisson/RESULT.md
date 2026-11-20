# res-order-two-nonpoisson: order-2 objects that do not enter through Poisson summation (2026-11-17)

Internal working note. Slug `res-order-two-nonpoisson`. Continues `ap-order-two` and `r3-method-limit`. Nothing
committed, pushed or posted. Not refereed.
Files here: `checks.py`, `checks.log`, `checks.json` (exact finite identities, python stdlib, run through
`scripts/memcap.sh 8`, a few MB, under 2 minutes). No compute-server use.

Labels: PROVED (complete argument here) / PROVED-rel X (complete relative to the named classical input X) /
CLASSICAL (literature statement, recalled, not re-read) / VERIFIED (exact finite identity checked numerically to
1e-10 or in integers) / MODEL (exponent bookkeeping in the estimate-system language of `r3-method-limit`) /
ARGUED / OPEN.

**Verdict: precise obstruction (a narrower no-go).** For the four non-Poisson candidates (Siegel-Weil / Howe duality,
Shimura correspondence, Kuznetsov-Petersson with Salie sums, quadratic-form amplification) the reciprocal of the
target enters by exactly three mechanisms, and each has a fixed model abscissa:

| mechanism | where the reciprocal sits | h/r | model abscissa | low estimate |
|---|---|---|---|---|
| M1 Eisenstein normalisation (coprime pairs in the big cell) | 1/zeta(1 + 4it) on the unitary axis | 0 | 1 | unconditional; nothing below Re s = 1 is seen |
| M2 Hecke relation at squares (Shimura) | 1/L(s + 1/2, chi) in the square direction n_0 t^2 | 1/2 | 1/2 | equivalent to the conclusion; unconditional value 1 |
| M3 reciprocal coefficients mu(c) xi(c) placed on a variable by hand | modulus variable | 1/2 | 1/2 | equivalent to the conclusion (`ap-order-two` Thm A, B); unconditional value 1 |

Effective order 2 is attained formally by M2 and M3 and by nothing else; in both the reciprocal is a common scalar
factor of the two sides of the identity (Theorems 2, 3), so the map "abscissa assumed" -> "abscissa returned" is
again the identity. The step that decides the matter is the absorption step: it needs an order-2 automorphic
coefficient sequence that is reciprocal-free and is not a character on squares. By Serre-Stark / Gelbart-Piatetski-
Shapiro the reciprocal-free weight-1/2 objects are exactly the theta series, whose coefficients are characters on
squares (Theorem 5). Exact evaluation of the Salie sum does not supply a second representation: the evaluated form
(roots of y^2 = mn mod c) carries mu explicitly, in the degenerate roots at p | (t, c) (Theorem 3(b)).
No abscissa is claimed. No statement about any zero is made. 7/8 (unrefereed manuscript) stands; RH open.

---

## 1. Plan; what is different from the lanes continued

Read: BRIEF (all notices), OBSTRUCTION_MAP sections 2, 3.5, 6, SYNTHESIS_AUTOMATIC_POSITIVITY (all),
`ap-order-two` RESULT + REFEREE, `r3-method-limit` RESULT + REFEREE. The route atlas (PR 27,
`historical-routes.md`) was searched for Eisenstein, Shimura, Kuznetsov, metaplectic, trace-formula and sieve
routes: it has no entry on them, so nothing here re-runs an atlas route.

What the continued lanes left open, and what is done here:

* `ap-order-two` Theorem E excludes designs whose second representation is Poisson summation. Not covered: "a
  second representation of an order-2 probe that is not Poisson summation (Kuznetsov on the double cover, Salie
  sums)". Sections 3-5 treat this.
* `ap-order-two` weakest step 2: Lemma R treated second-degree rows sum_d e(d T[x]/c) with coefficients independent
  of d; "other choices of the d-dependence were not enumerated". Theorem 2 enumerates all of them.
* `r3-method-limit` section 6 item 2 asks for "a different identity that converts mu times a quadratic symbol into
  an evaluable automorphic coefficient". Theorem 5 states which coefficients exist at order 2.

Estimate-system language (from `r3-method-limit` section 1): signal Z^{C(s)}/L(s, target),
C(s) = s - 1 + lx/2 + h/r; low estimate exponent e_low; abscissa B = e_low - (C(s) - s); with e_low at the
square-root level lx/2, B = 1 - h/r; effective order r_eff = r/h. All probes below have lx = 0.

Notation. c odd, e(x) = exp(2 pi i x), (./c) Jacobi symbol, eps_c = 1 or i for c = 1 or 3 mod 4.
Salie sum S(a, b; c) = sum*_{x mod c} (x/c) e((a x + b xbar)/c); Kloosterman sum K(a, b; c) the same without the
symbol; Ramanujan sum c_c(N). Root sums W(D, k; c) = sum_{y mod c, y^2 = D} e(k y/c) and
U(k; c) = sum_{u mod c, u^2 = 1} e(2 u k/c).

---

## 2. Exact finite identities (the Salie case, modulus side)

**Theorem 1 [CLASSICAL; VERIFIED C1, C2, C2b].** For odd c:

(a) if (a, c) = 1 then S(a, b; c) = eps_c sqrt(c) (a/c) W(ab, 2; c)   (checked for all odd c < 100, squarefree or
    not: 28000 cases, 0 failures);
(b) sum_{x mod c} S(x^2, n; c) e(-k x/c) = eps_c sqrt(c) c_c(4n - k^2)   (all odd c < 64);
(c) for squarefree c, sum_{x mod c} K(x^2, n; c) e(-k x/c) = eps_c^2 c (M/c) with M = n - 4bar k^2 mod c
    (4bar the inverse of 4 mod c; (M/c) = ((4n - k^2)/c)).

Proof of (b), (c): sum_x e((d x^2 - k x)/c) = eps_c (d/c) sqrt(c) e(-4bar dbar k^2/c) for (d, c) = 1; insert into
the definition and sum over d: the symbol (d/c) is squared in (b) and survives in (c). (a) is the same Gauss sum
used twice. QED

Reading. The Salie sum is a matrix coefficient of the Weil representation of SL_2(Z/c): one Fourier transform and
one multiplication by a second-degree character. Its exact evaluation is the quadratic Gauss sum evaluation, i.e.
the Weil index eps_c; it is not an input independent of Poisson summation. Poisson summation over a rank-one
quadratic variable maps Salie rows to Ramanujan sums and Kloosterman rows to quadratic characters of the modulus.

**Theorem 2 (all second-degree rows) [PROVED; VERIFIED C6 for the spanning statement].** Let c be odd squarefree,
T an integral quadratic form of rank N with (c, 2 det T) = 1, and let the row be
R_x(c) = sum*_{d mod c} b_c(d) e(d T[x]/c) with an arbitrary function b_c on the units mod c. Then:

(i) for either j in {0, 1}, b_c(d) = sum_{n mod c} beta_c(n) (d/c)^j e(n dbar/c) for suitable beta_c; so every
    such row is a combination over n of Kloosterman (j = 0) or Salie (j = 1) sums in the pair (T[x], n);
(ii) Poisson summation in x mod c maps the j-row at n to gamma_c(T) c^{N/2} G_{j+N}(n - T^*[k]; c), where gamma_c is
    a root of unity times a quadratic character of c, T^* is the dual form, and G_even(M; c) = c_c(M) (Ramanujan),
    G_odd(M; c) = eps_c sqrt(c) (M/c);
(iii) [PROVED-sketch, relative to `ap-order-two` Lemma 0, Lemma R, Theorem A] if j + N is even, the frequency rows
    are Ramanujan sums c_c(n - T^*[k]) = sum_{g | (c, n - T^*[k])} g mu(c/g). The requirement that the principal
    frequency carry mu(c) xi(c) forces beta_c = mu(c) xi(c)/(gamma_c c^{N/2} phi(c)); the coherent set is the quadric
    {T^*[k] = n}; rows off the quadric are O(tau(n - T^*[k])) with no reciprocal; the direct side (by Theorem 1(a) for
    N = 1) carries the same plain sum sum_c mu(c) xi(c) w(c/Z) on its coherent rows. If j + N is odd, the frequency
    rows are quadratic characters ((n - T^*[k])/c) of the modulus and the design is the probe of `ap-order-two`
    Theorem A with row variable M = n - T^*[k] (coherent set: M a square).

Proof. (i) additive characters span the functions on Z/c, hence on the units; d -> dbar and multiplication by
(d/c) are bijections of that function space (rank = phi(c) checked for c = 3, 5, 7, 15, 21, 33, 35).
(ii) is the N-fold Gauss sum followed by the sum over d, as in Theorem 1. (iii) is Lemma R of `ap-order-two` with
N' = n - T^*[k] in place of T^*[k], and Theorem A there. QED

Consequence. Kloosterman and Salie sums in the modulus variable are not a new class: they are the general
d-dependence of second-degree rows, and Theorem E of `ap-order-two` extends to them. With reciprocal coefficients on
the modulus (mechanism M3) no spectral formula applies (Kuznetsov needs the complete smooth sum over c), and the
exact evaluation returns the design to Poisson summation. Model abscissa 1/2, r_eff = 2, low estimate equivalent to
the conclusion, unconditional value 1.

---

## 3. The spectral use of Salie sums (Kuznetsov / Petersson on the double cover)

Here the sum over c is complete and smooth, so no coefficient can sit on c. The reciprocal of the target can only
come from the spectral objects themselves. There are two places.

### 3.1 M1: the Eisenstein normalisation [CLASSICAL, recalled; MODEL for the exponents]

The weight-1/2 Eisenstein series at spectral parameter s has m-th coefficient proportional to
L(2s - 1/2, chi_m)/zeta(4s - 1) times finite Euler factors (Maass; Goldfeld-Hoffstein). On the unitary axis
s = 1/2 + it the reciprocal is 1/zeta(1 + 4it). In the Salie zeta function sum_c S(m, n; c) c^{-2s} the zeros of
zeta give poles at s = (1 + rho)/4, to the left of the unitary axis; the cusp forms give poles on Re s = 1/2; the
theta function gives a pole at s = 3/4 when mn is a square.

Architecture: P(C) = sum_c c^{-1} S(m, n; c) w(c/C). Contributions: theta C^{1/2}, each cusp form C^{2 i t_j}
(size C^0), each zero C^{(rho - 1)/2} (size C^{(beta - 1)/2}).
Model abscissa: the zero is below the tempered spectrum by C^{(1 - beta)/2} for every beta < 1. The signal exponent is (in the variable C^{1/2}) beta - 1 with no coherent count added: h/r = 0,
r_eff = infinity, B = 1. The step that would have to change is temperedness: the cuspidal spectrum lies on the
unitary axis (or, for any exceptional eigenvalue, to its right), so it is never below a resonance at
Re s = (1 + beta)/4 < 1/2 [ARGUED: a test function concentrated at the resonance was not optimised]. What M1 yields
unconditionally is the classical Eisenstein-series proof that zeta(1 + it) is nonzero. The same holds in weight 0
(poles at rho/2, 1/zeta(1 + 2it)).

### 3.2 M2: the Hecke relation at squares

**Theorem 3 (the reciprocal is a common scalar).**

(a) [PROVED-rel Shimura's action formula for T(p^2), Ann. Math. 97 (1973) Thm 1.7] Let f = sum a(n; f) q^n have
weight k + 1/2, level 4N, character psi; n_0 squarefree; chi(p) = psi(p) (-1/p)^k (n_0/p). Let That(m) be the
elements of the Hecke algebra defined by sum_m That(m) m^{-s} = prod_p (1 - T(p^2) p^{-s} + psi(p^2) p^{2k-1-2s})^{-1}.
Then for every f in the space (not only eigenforms) and every t prime to 4N:

  a(n_0 t^2; f) = sum_{d | t} mu(d) chi(d) d^{k-1} a(n_0; That(t/d) f).

Proof at one prime. With x a formal variable, H_f(x) = sum_v a(n_0 p^{2v}; f) x^v. The action formula
a(n; T(p^2) f) = a(p^2 n; f) + psi^*(p) (n/p) p^{k-1} a(n; f) + psi(p^2) p^{2k-1} a(n/p^2; f) at n = n_0 p^{2v} gives
(1 + psi(p^2) p^{2k-1} x^2) H_f(x) - x H_{T f}(x) = a(n_0; f)(1 - chi(p) p^{k-1} x). The series
(1 - chi(p) p^{k-1} x) sum_m x^m a(n_0; R_m f), with sum R_m x^m = (1 - T x + psi(p^2) p^{2k-1} x^2)^{-1}, satisfies the
same relation, and the relation determines the coefficients of H_f by induction on the degree, simultaneously for
all f. Several primes: the operators commute and (n_0 t'^2/p) = (n_0/p) for p not dividing t'. QED

Consequently, for any linear functional l on the space, l-pairings along the square direction satisfy
Delta(n_0 t^2, n) = sum_{d | t} mu(d) chi(d) d^{k-1} Delta^{That(t/d)}(n_0, n), where Delta is the Petersson/Kuznetsov
kernel sum_f a(.; f) conj a(n; f)/||f||^2. Both the geometric side (Salie sums) and the spectral side of the formula
are the same Moebius convolution of the corresponding sides of the formula for the Hecke-twisted kernel
Delta^{That(m)}. In Mellin form, with normalised coefficients:

  (geometric side)(s) = (spectral side)(s) = D_1(s) / L(s + 1/2, chi),   D_1 reciprocal-free

(D_1 is the first moment of |rho_F(n_0)|^2 L(s, F) over the Shimura lifts F on the spectral side, and a
Kloosterman/Ramanujan expression on the geometric side). After division the remaining identity is the trace formula
for the lifted (integral-weight) kernel; it does not contain the target. The Maass-form case is CLASSICAL by the
same coefficient computation (Katok-Sarnak; not re-derived here).

(b) [PROVED; VERIFIED C3, C3b, C5] The same statement on the evaluated geometric side, in elementary form. For odd
squarefree c and every integer k:

  W(k^2, 2; c) = sum_{g | (k, c)} mu(g) U(k/g; c/g),     U(k; c) = sum_{c_1 c_2 = c} e(2k(c_2bar/c_1 - c_1bar/c_2)).

Proof: both sides are twisted-multiplicative in c; at a prime p not dividing k both are 2cos(4 pi k v/p); at p | k
the left side has the single root y = 0 and the right side is 2 - 1. QED
Hence for any weights (checked numerically with a Gaussian in t and an oscillating F, difference 4e-13):

  sum_t Wt(t) sum_c F(c) S(n_0, n_0 t^2; c)/(eps_c sqrt(c) (n_0/c))
      = sum_g mu(g) sum_{t', (c', g) = 1} Wt(g t') F(g c') U(n_0 t'; c').

The exact evaluation of the Salie sum is a count of roots of y^2 = n_0^2 t^2 mod c. The roots are non-degenerate
(two per prime) except at p | (t, c), where there is one. That deficit is the term mu(g). So the set where the exact
evaluation degenerates is the carrier of the reciprocal: the same outcome as in `ap-order-two` ("the exceptional
coset is the signal"), now on the non-Poisson side.

(c) [VERIFIED C4; CLASSICAL] Siegel-Weil instance for (Mp_2, O(3)): r_3(n_0 t^2) = r_3(n_0) sum_{d | t} mu(d)
(-n_0/d) sigma(t/d) for odd t and squarefree n_0 (174 cases in integers, 0 failures). The theta integral equals the
Eisenstein coefficient with no error term, and the reciprocal 1/L(s, chi_{-n_0}) is inside the exact formula
(the local densities at p | t).

**Model abscissa of M2 [MODEL; ARGUED where marked].** Probe: P(Z) = sum_t W(t/Z) rho(n_0 t^2) for one form, a
family, or the full kernel. By Theorem 3, P(Z) = sum_d mu(d) chi(d) d^{-1/2} P_1(Z/d), P_1 reciprocal-free.
[ARGUED] P_1(y) is its polar terms plus O(y^{-A}) for y beyond the conductor (smooth sums of Hecke eigenvalues), so
P(Z) - (polar terms) is a linear functional of the tails of sum mu(d) chi(d) d^{-1/2 - a}, i.e. of the plain
Moebius sums of the target. A zero rho of L(., chi) contributes Z^{rho - 1/2} D_1(rho - 1/2)/L'(rho, chi).
* Signal exponent C(s) = s - 1/2 = s - 1 + h/r with h/r = 1/2: indices n_0 t^2 are the squares among n <= n_0 Z^2.
  r = 2, h = 1, r_eff = 2. Model abscissa 1/2.
* Low estimate at exponent e holds iff L(., chi) has no zero in Re s > e + 1/2 with D_1(rho - 1/2) nonzero
  (the amplitude condition is the analogue of the Mellin-zero caveat of the `ap-order-two` referee). f(theta) = theta.
* Unconditional value: e_low = 1/2 (edge of absolute convergence of 1/L(s + 1/2, chi)), so B = 1.
* For the O(3) instance: the weighted count of integer points on the cone x^2 + y^2 + z^2 = n_0 t^2, t ~ Z, is
  c_2 Z^2 + c_1 Z + sum_rho c_rho Z^rho. A lattice-point remainder O(Z^{sigma_0}) is equivalent to the zero-free
  half-plane Re s > sigma_0 for L(s, chi_{-n_0}); geometry of numbers gives sigma_0 = 1.

So an exact identity does not lose in an exceptional coset, and for the same reason it does not gain: both sides
are divided by the same L(s + 1/2, chi).

### 3.3 The squarefree direction [CLASSICAL]

Along squarefree n the coefficients of a weight-1/2 cusp form satisfy |rho(n)|^2 = c L(1/2, F x chi_n)
(Waldspurger; Kohnen-Zagier; Baruch-Mao). This is the place where "L-values at the centre appear as squares". It
yields L(1/2, F x chi_n) >= 0, a statement at one point of the critical line for each n, with no reciprocal and no
half-plane. For the zeta target (F Eisenstein) it reads L(1/2, chi_n)^2 >= 0. The coefficients are not
multiplicative in n; no Dirichlet series in this direction has an Euler product. Model abscissa: none (no
zero-detecting term).

---

## 4. Candidate table

| candidate | zero-detection architecture | reciprocal mechanism | h, r, r_eff | model abscissa | step that decides effective order 2 | unconditional |
|---|---|---|---|---|---|---|
| (a) Howe (Mp_2, O(1)): theta | Mellin transform of theta is xi(2s) (numerator; Riemann's second proof). Along squares: 1 = sum_{d|t} mu(d) d^{-1/2} sigma_{-1/2}(t/d), the reciprocal cancels identically | none (M2 cancels) | - | none | the lift of theta is the residual Eisenstein class L = zeta(s) zeta(s + 1/2): numerator and denominator cancel | - |
| (a) Siegel-Weil (Mp_2, O(n)), n odd | lattice points on the cone T[x] = n_0 t^2 | M2 | h = 1, r = 2, r_eff = 2 | 1/2 | remainder of the lattice count below Z^1; equivalent to the conclusion | 1 |
| (a) Siegel-Weil, scattering constant term | Maass-Selberg | M1 | h = 0 | 1 | temperedness | 1 (zeta(1 + it) nonzero) |
| (b) Shimura, square direction | sum_t rho(n_0 t^2) W(t/Z) | M2 | 1, 2, 2 | 1/2 | Theorem 3: common scalar | 1 |
| (b) Shimura / Waldspurger, squarefree direction | central values as squares | none | - | none | - | - |
| (c) Kuznetsov, c-sum, fixed m, n | Salie zeta function | M1 | h = 0 | 1 | temperedness | 1 |
| (c) Kuznetsov, square direction | section 3.2 | M2 | 1, 2, 2 | 1/2 | Theorem 3 | 1 |
| (c) Salie rows with mu on the modulus | Theorem 2 | M3 | 1, 2, 2 | 1/2 | Theorem 2: exact evaluation = Gauss sum = Poisson | 1 |
| (d) quadratic-form amplification | section 5 | M3, squared | 1, 2, 2 | 1/2 | top eigenvector of the form is the square-row vector | 1 |

---

## 5. (d) Amplification with a quadratic form [PROVED identity; rest CLASSICAL / ARGUED]

Take the rows of `ap-order-two`, B_m = Z^{-1/2} sum_c x_c (m/c) w(c/Z), and a nonnegative weight a_m (for example
a_m = |A_m|^2). The quadratic form Pq(x) = sum_m Om(m/Q) a_m |B_m|^2 satisfies
Pq(x) >= sum_{m = t^2} a_m |B_{t^2}|^2 = (count of square rows, about Q^{1/2}) |F_x|^2 up to local factors, with
F_x = Z^{-1/2} sum_c x_c h(c) w(c/Z) (`ap-order-two` Theorem B(iii)). This inequality is automatic positivity. To use
it, Pq(mu eta) must be bounded from above. Expanding, Pq(x) = sum_{c_1, c_2} x_{c_1} conj x_{c_2} K(c_1, c_2) with
K(c_1, c_2) = Q^{1/2} kappa h([c_1, c_2])-type main term (from the square rows) plus a remainder bounded by
Heath-Brown's large sieve on squarefree rows. So Pq(x) = Q^{1/2} |F_x|^2 (1 + o(1)) + O(coefficient-blind): the upper
bound and the lower bound are the same term. The large sieve over all m (squares included) has norm of order
Q^{1/2} Z, attained at x = h (positive vector); it is false at the squarefree-row strength (Q + Z) for exactly this
reason. Minimising the form over x with x_1 = 1 (Selberg's Lambda^2 choice) gives x_c ~ mu(c) log(Z/c)/log Z and the
value 1/log Z: information at s = 1 only (M1-type edge), and the zero-detecting uses (mollified second moments,
density theorems) are mean values in t, so they are capped by MV-CAP. Model abscissa 1/2 with the low estimate
equivalent to the conclusion; unconditional 1.

---

## 6. Theorem 5: the deciding step, and why effective order 2 has no absorbing object

In the sextic method the reflected side is unconditional because mu times the sextic Gauss sum is a coefficient of
Patterson's cubic theta function, a residual automorphic form on a cover whose coefficients are reciprocal-free and
are not characters. The order-2 analogue needs a sequence on the double cover with three properties: (P1)
automorphic of weight 1/2 (so that a functional equation gives the square-root level without zeros), (P2)
reciprocal-free in the square direction, (P3) not a character supported on squares (otherwise the Gauss class is
trivial and Lemma 0 of `ap-order-two` applies).

**Theorem 5 [PROVED-rel Theorem 3(a) and CLASSICAL inputs].**
(i) [Serre-Stark 1977, CLASSICAL] every holomorphic form of weight 1/2 is a combination of theta_psi(a z),
coefficients psi(t) on a t^2: (P3) fails. [Gelbart-Piatetski-Shapiro 1980, CLASSICAL] the automorphic
representations of the double cover of SL_2 or GL_2 that are residual / distinguished are exactly the elementary
theta (even Weil) representations.
(ii) For every other Hecke eigenform of half-integral weight (cuspidal, or Eisenstein on the unitary axis), Theorem
3(a) gives sum_t rho(n_0 t^2) t^{-s} = rho(n_0) L(s, F)/L(s + 1/2, chi) with L(s, F) entire or with poles only at
Re s = 1: the reciprocal is present, (P2) fails, unless rho(n_0) = 0.
(iii) For theta itself L(s, F) = zeta(s) zeta(s + 1/2) and the reciprocal cancels: this is mu * 1 = delta, the
identity behind Lemma 0.

So on the double cover the dichotomy is: characters on squares (trivial Gauss class, self-dual, circular) or
coefficients that already contain the reciprocal of a quadratic L-function at shift 1/2 (common scalar). There is no
third kind. On the n-fold cover the residual theta has coefficients that are characters for n = 2, cubic Gauss sums
for n = 3 (Patterson), and undetermined for n >= 4; the coherent count is H^{1/r}. The two requirements "count
exponent 1/2" and "non-character residual coefficients" hold for disjoint sets of n. This is the same fact as the
closing remark of `ap-order-two` section 6, now with the non-Poisson representations included.

**Statement of the no-go.** In the estimate-system language, for every probe built from (a)-(d) as above: either
h/r = 0 and B = 1 (M1), or h/r = 1/2 and the low estimate at exponent e is equivalent (up to the amplitude
condition) to the zero-free half-plane it would return (M2, M3). No design in this class has model abscissa below 1
together with a low estimate that is provable by an identity or a norm bound. The class is: linear or sesquilinear
identities for automorphic forms on SL_2 and its double cover (Poisson, Petersson, Kuznetsov, Siegel-Weil for
(Mp_2, O(n)), Shimura/Waldspurger), with rows indexed by integers or values of a quadratic form, and estimates that
are norms, large sieves, or exact evaluations of Gauss/Salie/Ramanujan sums.

---

## 7. Controls and the user's three requirements

No zero statement is made, so nothing can transfer wrongly. What each control does to the three mechanisms:

| control | M1 (edge) | M2 (Hecke at squares) | M3 (inserted mu) | structural reason |
|---|---|---|---|---|
| DH | not formulable: no automorphic object has DH as its Eisenstein normalisation | Theorem 3 needs a T(p^2)-eigen-structure; DH is a combination of two eigen-objects with characters chi, chibar, so the square-direction series is a combination of 1/L(s + 1/2, chi) and 1/L(s + 1/2, chibar). The poles are zeros of the constituents; the zeros of DH never appear | `ap-order-two`: coefficients of 1/DH are not multiplicative; only the coefficient-blind part holds | the reciprocal in M1, M2 is produced by the Euler product (coprimality; Hecke relation); a function without one produces no reciprocal of itself |
| HEAT | not formulable | not formulable | not formulable | no Dirichlet series in a fixed variable |
| TW+, TW- | not formulable | the convolution of Theorem 3(b) with mu(g) eps(g) in place of mu(g) satisfies every linear identity of the system and returns the abscissa of the twisted product; what fails is the root-count interpretation (the twisted sum is not a Salie sum), which no estimate uses | holds verbatim (Theorem D(i) of `ap-order-two`) | linear identities and norm bounds are blind to a unimodular multiplicative twist |
| U | same as TW- | same as TW-: returns the chosen zero s_0 | same | as above; U has an Euler product and unimodular parameters, and the system reads its abscissa correctly |
| EA | the Eisenstein normalisation at a shifted parameter gives 1/zeta(1 + 4it +- a'), still on an edge | the denominator in Theorem 3 is L(s + 1/2, chi) with chi a character because the T(p^2) coefficient is chi(p) p^{k-1}; a pair p^{+-a} does not occur | returns 1/2 + a | size normalisation is fixed by the Hecke relation |
| NR | not formulable | not formulable (one non-tempered local factor has no half-integral-weight companion here) | returns its own abscissa | - |
| B | not formulable | not formulable | not formulable | no Jacobi symbols over Beurling integers |

All primes together: yes, in every identity (they are exact). Uniform in height, every window: the equivalences are
half-plane statements, uniform in height. Fails for the controls: the system does not prove anything for zeta that
it would wrongly prove for a control; for Euler-type controls it returns the control's own abscissa, which is the
defect: it returns its input. No property was found that holds for zeta and fails for U.

---

## 8. What remains outside this no-go

1. **Non-split root sums.** Theorem 3(b) covers mn a square (split torus; roots of y^2 = k^2). For mn = D a
   non-square the evaluated Salie sums are Weyl sums over Heegner points or closed geodesics of discriminant 4D
   (Katok-Sarnak; Duke-Imamoglu-Toth). With mu on the modulus this is a Moebius sum over ideals of Q(sqrt D) twisted
   by the root angle e(2y/c), which is not a Hecke character. No coherent set of exponent 1/2 was found there, and
   the target would be an L-function of Q(sqrt D), not zeta; not analysed further.
2. **Higher rank.** (Mp_{2n}, O(m)) with n >= 2 (Siegel theta series, Fourier-Jacobi coefficients), and the
   theta lifts between Mp_2 and O(2, 1), O(2, 2) used as period identities with a non-automorphic test vector. Only
   (Mp_2, O(1)) and (Mp_2, O(3)) were written out.
3. **Covers of degree >= 4 paired with quadratic rows.** Theorem 5 uses that the residual theta on the double cover
   has character coefficients. A probe with quadratic rows but a reflected side on the 4-fold or 6-fold cover is a
   mixed design; `ap-order-two` section 5 lists quadratic x sextic as neutral (MODEL), and the 4-fold theta
   coefficients are not known.
4. **A low estimate that is neither a norm nor an identity.** For example a direct bound for the lattice-point
   remainder on the cone of section 3.2 by a method that does not pass through the spectral decomposition. The
   no-go says only that such a bound is equivalent to the conclusion, not that it is unprovable.
5. `r3-method-limit` Theorem 3(b) (h = r/2 by long prime marks at r >= 3) is not touched.

---

## 9. Three weakest steps

1. **The model abscissa of M2 rests on an ARGUED expansion.** Theorem 3 (the convolution identity) is proved, but
   "P_1(y) = polar terms + O(y^{-A})" and the uniformity in the coprimality condition (c', g) = 1 of Theorem 3(b)
   (which makes P_1 depend on g through an Euler factor that was not computed) are not written out. The equivalence
   "low estimate iff zero-free half-plane" also carries the amplitude condition D_1(rho - 1/2) != 0, which can fail
   (D_1 is a first moment and can be made small by the choice of spectral window).
2. **M1 exponents and several inputs are recalled, not re-derived**: the weight-1/2 Eisenstein coefficient
   L(2s - 1/2, chi_m)/zeta(4s - 1), the pole set of the Salie zeta function, Serre-Stark, Gelbart-Piatetski-Shapiro,
   Waldspurger, and the Maass-form version of Theorem 3(a). Theorem 3(a) itself is proved here only relative to
   Shimura's action formula and only for holomorphic forms of level 4N with t prime to 4N.
3. **The class in the no-go is defined by enumeration.** "Reciprocals enter only by M1, M2, M3" is established for
   the designs written in sections 2-5, not for every conceivable use of the Weil representation. Section 8 lists
   the known exclusions. Section 5 (quadratic amplification) is at sketch level; the kernel K(c_1, c_2) was not
   computed with error terms.

## 10. Verdict

Precise obstruction, as a statement about the estimate system. For the non-Poisson order-2 representations
(Siegel-Weil / Howe, Shimura, Kuznetsov-Petersson with Salie sums, quadratic-form amplification):
* effective order 2 (h = 1, r = 2, model abscissa 1/2) is attained formally in the square direction, by the Hecke
  relation at squares or by inserted reciprocal coefficients;
* in every such design the reciprocal of the target is a common scalar of both sides (Theorem 3), the low estimate
  is equivalent to the conclusion, and the unconditional abscissa is 1;
* where the reciprocal is produced by the spectral theory itself without the square direction, it sits on the edge
  Re s = 1 (h = 0, abscissa 1);
* the Salie case carried through: exact evaluation = Weil index times a root count (Theorem 1); Poisson duals are
  Ramanujan sums or quadratic characters (Theorem 2); the degenerate roots at p | (t, c) are the Moebius term
  (Theorem 3(b)); all identities verified exactly (`checks.log`);
* the missing object is a reciprocal-free weight-1/2 coefficient sequence that is not a character on squares, and
  it does not exist (Theorem 5).
No pivot taken. No architecture with model abscissa below 1 and a non-circular input list was found. Nothing is
claimed about any zero. 7/8 (unrefereed) stands; RH open.
