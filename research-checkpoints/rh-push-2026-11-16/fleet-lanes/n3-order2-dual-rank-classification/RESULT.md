# n3-order2-dual-rank-classification: order-2 symbol rows with polynomial argument (2026-11-17)

Internal working note. Slug `n3-order2-dual-rank-classification`. Nothing committed, pushed or posted. Not refereed.
Files here: `test1.py`, `test1.log`, `test1.json` (first test, 4 s), `test2.py`, `test2.log`, `test2.json` (conic
identity, 2 s), `test3.py`, `test3.log` (adjacent row, 1 s). All runs local, single process, through
`scripts/memcap.sh 8`, largest allocation 4 MB. No ssh.

Labels: PROVED (complete argument here) / CLASSICAL (cited theorem) / MEASURED / ARGUED (derivation given, not
written line by line) / OPEN.

**Verdict: precise obstruction; the first test triggers the kill criterion.** The conic row ((m^2 - d)/c) does
escape Lemma 0 of `ap-order-two` in both of its clauses: its Poisson dual is a Kloosterman sum, not a character, and
its frequency-0 coefficient is mu(c) with no coefficient inserted by hand. The escape has a fixed price: the
frequency-0 coefficient is an integer of absolute value 1 against nonzero-frequency coefficients of size sqrt c, so
the target appears as 1/zeta(1 + s), one full unit to the right of the row's own weight. This is forced for every
order-2 polynomial row (Theorem N): a flat dual excludes a frequency-0 term (exact, at each prime), and a
frequency-0 term with a Dirichlet target sits at an integer shift >= 1. For the conic the resulting identity is
closed: for Z <= Q^{1-eps} the probe equals the frequency-0 term up to O(Q^{-A}), and for fixed Q the zero monomials
Q Z^{rho-1-s} of the frequency-0 term are cancelled identically by the nonzero frequencies (Lemma C). No abscissa is
claimed. No statement about any zero is made. RH open.

---

## 1. Plan; relation to closed rows

Read: BRIEF (all notices), OBSTRUCTION_MAP (rows Z14, Z15, section 2, section 6 item 1), `ap-order-two/RESULT.md`
(Lemma 0, Theorems A-C).

What `ap-order-two` proved: for the row m -> (m/c), the Poisson dual is (h/c) eps_c sqrt c, a Weil index times a
character. Hence (a) the coefficient that produces mu in the dual must already contain mu (Lemma 0), and (b) the
direct and Poisson representations are the same representation (Theorem C).

Question of this lane: replace m by f(m), f in Z[x]. Is there an f for which the dual is not of character type
(so the two representations differ) and mu appears without being inserted? If yes, at what weight does the target
appear, and is the resulting identity open or closed?

New relative to the map: the classification by degree of the squarefree part of f (Lemma 1, Lemma 2, Theorem N), the
exact exclusion "flat dual => zero frequency-0 coefficient", and the conic identity with its closure (Lemma C).
The conic average sum_m L(s, chi_{m^2-d}) is the classical hyperbolic term of the trace formula (Zagier 1977,
Kuznetsov, Linnik-Selberg); nothing about it is new. What is recorded here is its position relative to Lemma 0.

Notation. p odd prime, c odd squarefree. Row chi_f(m; c) = (f(m)/c) (Jacobi symbol).
S_f(h; c) = sum_{m mod c} (f(m)/c) e(hm/c). Poisson: sum_m Om(m/Q) (f(m)/c) = (Q/c) sum_h Om^(hQ/c) S_f(h; c).
f = a g k^2 up to constants, g squarefree of degree n ("squarefree part"). "Flat at p": |S_f(h; p)|^2 = p for all
h != 0 mod p. Flat is the property that makes the dual a unimodular multiple of sqrt p, as for the Gauss sum.

---

## 2. Lemmas

### Lemma 1 (flat dual excludes frequency 0) [PROVED]

Let R: (Z/p)^k -> {0} u {|z| = 1}, r = number of zeros of R, S(h) = sum_x R(x) e(h.x/p). If |S(h)|^2 = p^k for
every h != 0, then |S(0)|^2 = p^k (1 - r). Hence either r = 1 and S(0) = 0, or r = 0 and |S(0)| = p^{k/2}.
If R is real-valued (order-2 symbol) and k is odd, the second case is impossible (S(0) is an integer, p^{k/2} is
irrational), so r = 1 and S(0) = 0.

Proof. Parseval: sum_h |S(h)|^2 = p^k sum_x |R(x)|^2 = p^k (p^k - r). Subtract (p^k - 1) p^k. QED

Consequence for k = 1, order 2: at any prime where S_f(0; p) != 0, the dual of m -> (f(m)/p) is not flat. The two
properties asked for in the idea ("the dual is root of unity x character x sqrt p" and "frequency 0 carries a
nonzero coefficient") exclude each other at every single prime, with no error term.

### Lemma 2 (which f are flat) [PROVED; one input CLASSICAL]

(a) f is flat at all but finitely many p iff f = c (x - a)^j with a in Q, j odd.
(b) If the squarefree part g is linear, |S_f(h; p)|^2 = p + O_f(sqrt p).
(c) If deg g = 2, the dual is a Kloosterman sum (Lemma 3) and (1/p) sum_h |S_f(h; p)|^4 / p^2 -> 2.
(d) If deg g >= 3 the dual is not flat: MEASURED (section 3); by Katz it is the trace function of a sheaf of rank
deg g (CLASSICAL, not re-derived here).

Proof of (a). By Lemma 1 flatness at p forces exactly one root of f mod p. For p outside a finite set the number of
roots mod p is the number of fixed points of Frobenius on the distinct complex roots of f. By Chebotarev the
identity is a Frobenius for infinitely many p, so f has one distinct root, rational. Then
(f(m)/p) = (c/p) ((m - a)/p)^j; for j odd this is a shifted Gauss sum (flat); for j even S(h) = -(c/p) e(ha/p) for
h != 0, |S|^2 = 1. (b): deleting the O(1) roots of k changes S by O(1). (c): Lemma 3 and Kloosterman's fourth
moment sum_{b != 0} K(1, b; p)^4 = 2p^3 - 3p^2 - 3p - 1 (CLASSICAL), the twist by (bd/p) being of lower order. QED

### Lemma 3 (the conic) [PROVED; checked exactly]

Let f = m^2 - d, c odd squarefree, (c, 2d) = 1. Then S_f(0; c) = mu(c), and for h != 0 mod every p | c,
S_f(h; c) = K(1, h^2 d 4bar; c) (Kloosterman sum, 4bar the inverse of 4 mod c). Also S_f(0; p^2) = p (p - 1 - (d/p))
for the symbol ((m^2 - d)/p^2).

Proof. For p prime: 1 + (f(m)/p) = #{y: y^2 = m^2 - d}. With u = m - y, v = m + y the conic is uv = d, so it has
p - 1 points and m = 2bar (u + d/u). Hence S_f(h; p) = sum_{u != 0} e(h 2bar (u + d ubar)/p) - sum_m e(hm/p)
= K(h 2bar, h d 2bar; p) - p 1_{h = 0}. At h = 0 this is (p - 1) - p = -1. For h != 0, K(a, b) = K(1, ab).
For squarefree c the CRT gives S_f(h; c) = prod_{p | c} S_f(h (c/p)bar; p), which is mu(c) at h = 0 and equals
K(1, h^2 d 4bar; c) by the twisted multiplicativity of Kloosterman sums. The p^2 case counts m mod p^2 with
p not dividing m^2 - d. QED

The mu here is not inserted. It is the point count of a conic: p - 1 affine points against p values of m; in
cohomological terms the weight-0 class of H^1_c of the affine line minus two points with the quadratic sheaf.

### Lemma 4 (frequency 0 for general f) [CLASSICAL (Weil) + PROVED consequences]

Let g be squarefree of degree n >= 1 with leading coefficient a, p not dividing 2a disc(g). Then

  S_g(0; p) = - (a/p) 1_{n even} - sum_{i=1}^{2 gamma} alpha_i,   |alpha_i| = sqrt p,   gamma = floor((n - 1)/2),

where the alpha_i are the Frobenius eigenvalues of the curve y^2 = g(x) of genus gamma. Consequences:

(i) [PROVED] S_g(0; p) is a rational integer, so it is never mu(p) x (unit) x sqrt p. A frequency-0 coefficient of
Moebius type at the square-root level does not exist for a one-variable order-2 row.
(ii) [PROVED from the formula] n = 1: S(0) = 0. n = 2: S(0) = -(a/p): Moebius type, modulus 1. n = 3:
S(0) = -a_p(E_g), no Dirichlet component. n = 4: -(a/p) - a_p(E). In general the Dirichlet (weight-0) component is
present iff n is even, has modulus 1, and the rest is the Jacobian of y^2 = g.
(iii) [PROVED] With row coefficients c^{-s}, the frequency-0 term of the Poisson side is
Q Om^(0) sum_c S_g(0; c) c^{-1-s} w(c/Z), and sum_{c sqfree} S_g(0; c) c^{-w} = prod_p (1 + S_g(0; p) p^{-w})
= H(w) / ( L(w, (a/.))^{1_{n even}} L(Jac(y^2 = g), w) ), H holomorphic and zero-free for Re w > 1 (arithmetic
normalisation of L(Jac), critical line Re w = 1), and H a finite product of local factors when n = 2.
So the Dirichlet target always occurs at w = 1 + s; the weight-one target occurs at analytic argument 1/2 + s.
(iv) [PROVED] The shift 0 (target at weight s) needs |S_f(0; p)| of order p, i.e. g constant:
S_f(0; p) = (a/p)(p - r_p). Its sign is the Dirichlet character (a/p), which is +1 on a set of primes of positive
density, so it is not mu(p). At shift 0 the Moebius function has to be put into the coefficient x_c: this is the
situation of Lemma 0.

### Theorem N (no-go extending Lemma 0) [PROVED from Lemmas 1-4; inputs Weil, Chebotarev, Dirichlet]

Let f in Z[x] be nonconstant, rows (f(m)/c), c odd squarefree, row coefficients x_c with |x_c| <= c^{-sigma}.
Exactly one of the following holds.

(A) Character dual (g linear). The dual is flat up to O(sqrt p); S_f(0; p) = O(1) comes only from deleted points;
the reciprocal of a target can enter only through x_c (Lemma 0), and Theorems A-C of `ap-order-two` apply: the two
representations coincide.

(B) Conic type (deg g even). The dual is not flat at any prime. Frequency 0 carries
mu(c) (a/c) x_c / c plus, for deg g >= 4, the weight-one part. The Dirichlet target is 1/L(1 + s, (a/.) x), at
shift exactly 1.

(C) deg g odd >= 3. Frequency 0 carries no Dirichlet component; its target is 1/L(Jac(y^2 = g), 1 + s).

In no case does a one-variable order-2 polynomial row have a frequency-0 Dirichlet target at shift < 1 with the
Moebius function produced by the row. Shift 1/2 is excluded by integrality (Lemma 4(i)), shift 0 by Lemma 4(iv).

Several variables [ARGUED, not proved here]: for a row (F(x)/c), x in Z^k, Deligne's theorem gives Frobenius
eigenvalues of integer weights; components with a Dirichlet (Artin) target have even weight 2j, 0 <= j <= k, and
enter the normalised frequency-0 coefficient S(0; p)/p^k at size p^{j-k}: integer shifts k - j. Shift 0 is the
top-weight class, present iff F is geometrically a constant times a square, with sign a Dirichlet character as in
Lemma 4(iv). Binary norm forms on a full lattice are the flat case with r = 1, S(0) = 0 (Lemma 1; measured below).

---

## 3. First test (primes 3 <= p <= 500)

`test1.py`. Exact integers: S_f(0; p); autocorrelation a_k = sum_m chi(f(m)) chi(f(m + k)) (flat iff a_k constant
for k != 0 and a_0 - a_1 = p); fourth moment M4 = sum_k a_k^2 / p^2 = (1/p) sum_h |S|^4 / p^2. Double precision:
|S(h)|^2 / p, number of distinct values, multiplicative rank (number of characters psi mod p with
sum_m chi(f(m)) psi(m) != 0; equal to 1 iff h -> S_f(h; p) is a constant times a character).
"Dual rank" in the table is the rank of the sheaf with trace function h -> S_f(h; p) (deg g for h != 0), with the
measured indicators next to it. Means are over 100 < p < 500.

| f | deg g | flat (exact), primes | max abs(S)^2/p | M4 mean | mult. rank/(p-1) | dual rank | S_f(0; p) (exact) | frequency-0 target | weight |
|---|---|---|---|---|---|---|---|---|---|
| m | 1 | 94/94 | 1.000 | 0.996 | 1/(p-1) | 1 (character) | 0 | none; mu only via x_c (Lemma 0) | s (signal in frequencies h = a^2) |
| m^3 | 1 | 94/94 | 1.000 | 0.996 | 1/(p-1) | 1 | 0 | none | s |
| m(m^2+1)^2 | 1 | 50/94 (p = 3 mod 4) | 2.18 (p = 5) | 1.003 | 0.24 | 1 + O(1) points | in {-2, 0, 2} | none (deleted points) | s |
| m(m-1)^2 | 1 | 0/94 | 1.64 (p = 3) | 0.996 | 1.00 | 1 + 1 point | -1 (deleted point m = 1) | none: -(1/p) is not a row class, it is one point | s |
| m^2-2, m^2-3, m^2-5, m^2+1, m^2+m+1 | 2 | 0 | 3.96-3.99 | 1.98-2.00 | 0.50 (1.00 for the shifted form) | 2 (Kloosterman) | -1 at every p | 1/zeta(1+s) | 1 + s |
| m(m^2-1) | 3 | 0 | 8.82 | 2.89 | 0.50 | 3 | -a_p(E), E: y^2 = x^3 - x | 1/L(E, 1+s) | arithmetic 1 + s = analytic 1/2 + s |
| m(m^2-2) | 3 | 1 (p = 3, where f = -m) | 8.86 | 2.93 | 0.50 | 3 | -a_p | 1/L(E, 1+s) | same |
| m^3-2 | 3 | 0 | 7.56 | 1.97 | 0.68 | 3 | -a_p (0 for p = 2 mod 3) | 1/L(E, 1+s) | same |
| m^3-m-1 | 3 | 0 | 6.78 | 1.98 | 1.00 | 3 | -a_p, 49 distinct values | 1/L(E, 1+s) | same |
| m^4-m-1, m^4+1, 3m^4+1 | 4 | 0 | 8.5-10.4 | 1.94-2.95 | 0.38-1.00 | 4 | -(lc/p) - a_p(E) | 1/(L(1+s, (lc/.)) L(E, 1+s)) | Dirichlet part at 1 + s |
| m^5-m-1 | 5 | 0 | 8.92 | 1.96 | 1.00 | 5 | -(alpha_1 + ... + alpha_4) | 1/L(Jac, 1+s), genus 2 | analytic 1/2 + s |
| x^2+y^2, x^2-2y^2, x^2+xy+y^2 on Z^2 | form, k = 2 | abs(S(h))^2 = p^2 for N*(h) != 0 (dev. 6e-15); S = 0 on N*(h) = 0 | 1.000 (of p^2) | - | - | 1 (character of the dual form) | 0 | none | s (as the linear row) |
| x^2+4y^2, x^2-8y^2 (index-2 sublattices) | form, k = 2 | identical to the full lattice for odd p | 1.000 | - | - | 1 | 0 | none | s |

Checks, all passed (`test1.log`):
* S_f(0; p) = -1 for the conics at every p <= 500 not dividing 2d (exact).
* S_f(0; c) = mu(c) for all odd squarefree c < 500 prime to 2d: 203 moduli (d = 2), 169 (d = 5) (exact).
* S_f(h; p) = K(1, h^2 d/4; p) for all h, p <= 211, d in {2, 3, 5, -1}: max difference 3.6e-12.
  S_f(h; c) = K(1, h^2 d 4bar; c) for all h (including h sharing a factor with c) and all squarefree c <= 150:
  max difference 2.1e-12.
* S_f(0; p^2) = p (p - 1 - (d/p)) (exact, p <= 19).
* m^3 - m: S(0; p) = 0 for p = 3 mod 4 and abs(S(0; p)) = 2a with p = a^2 + b^2 otherwise; m^3 - 2: S(0; p) = 0 for
  p = 2 mod 3; Hasse bound for the quartics after removing -(lc/p) (exact).
* "flat => S(0) = 0 and exactly one root" holds at every (f, p) in the run (Lemma 1; exact).

Remarks. (1) An index-2 sublattice of Z^2 surjects onto (Z/p)^2 for odd p, so it cannot differ from the full
lattice in this test; the only non-full restriction of a binary norm form that changes the dual is the affine line
y = 1, which is the conic. (2) M4 near 3 for m(m^2 - d), m^4 + 1, 3m^4 + 1 reflects the extra symmetry m -> -m.
(3) The multiplicative rank is not translation invariant; it is listed only to show that no listed f other than m
and m^3 has a dual of the form constant x character.

**Outcome against the kill criterion.** "Every f with mu-type frequency 0 has a character dual or frequency 0
suppressed by sqrt p": true. The only rows with Moebius-type frequency 0 are those with deg g even; for all of them
abs(Dirichlet part of S_f(0; p)) = 1 while the nonzero frequencies have size sqrt p (root mean square exactly
sqrt(p - r) by Parseval). The kill criterion is met. By Theorem N this is not a feature of the sample.

---

## 4. The conic identity and its closure

Take d = 2 (m^2 - 2 is never a square, so no polar terms), Om in C_c^inf or Schwartz, w in C_c^inf(1, 2),
c over odd squarefree integers prime to 2d, sigma = Re s. Define

  I(Q, Z; s) = sum_m Om(m/Q) sum_c c^{-s} w(c/Z) ((m^2 - d)/c),      M_Z(u) = sum_c mu(c) c^{-u} w(c/Z).

### 4.1 Identity [PROVED: Poisson + Lemma 3; MEASURED to 1e-15]

  I = Q Om^(0) M_Z(1 + s) + NZ,    NZ = Q sum_{h != 0} sum_c c^{-1-s} w(c/Z) Om^(hQ/c) K(1, h^2 d 4bar; c).

`test2.py` (Om = exp(-pi x^2), m over all integers; double precision):

| Q | Z | s | abs(I) | abs(freq 0) | abs(NZ) | abs(residual) | trivial bound Q Z^{1-sigma} |
|---|---|---|---|---|---|---|---|
| 1000 | 100 | 1/2 + 2i | 7.2365e-3 | 7.2365e-3 | 0 (below 1e-18) | 2.3e-18 | 1.0e4 |
| 1000 | 100 | 1/4 + 7i | 4.3870e-2 | 4.3870e-2 | 0 | 4.9e-17 | 3.2e4 |
| 40 | 100 | 1/2 + 2i | 6.50e-3 | 2.89e-4 | 6.30e-3 | 7.7e-17 | 4.0e2 |
| 25 | 150 | 1/2 + 2i | 3.29e-2 | 1.41e-4 | 3.31e-2 | 2.7e-16 | 3.1e2 |
| 25 | 150 | 1/10 + 5i | 2.77e-1 | 1.66e-3 | 2.78e-1 | 1.9e-15 | 2.3e3 |

### 4.2 Regime Z <= Q^{1-eps}: the probe is the frequency-0 term [PROVED]

For Om in C_c^inf, Om^ is Schwartz and hQ/c >= Q/(2Z) >= Q^eps/2, so NZ = O_A(Q^{-A}) and
I = Q Om^(0) M_Z(1 + s) + O_A(Q^{-A}), with M_Z(1 + s) = (1/2 pi i) int W(v) Z^v loc(1+s+v) / zeta(1 + s + v) dv
(W the Mellin transform of w, entire; loc the local factor at p | 2d). The zero monomials are
Q Z^{rho-1-s} W(rho - 1 - s) loc / zeta'(rho), of size Q Z^{beta-1-sigma}.

Consequence (same structure as `ap-order-two` Theorem B). A bound abs(I) << Q Z^{theta-1-sigma+eps} for all large Z
(with Q = Z^M, M > 1) holds iff M_Z(1 + s) << Z^{theta-1-sigma+eps}, iff zeta has no zero with real part > theta.
The direct side is a sum over m of Dirichlet polynomials of length Z < Q in the characters chi_{m^2-d}; the only
structure of the m-sum is periodicity mod c, and using it is the identity itself. Bounds available without the
identity: trivial Q Z^{1-sigma}; Cauchy-Schwarz with the quadratic large sieve over all discriminants up to Q^2
gives no saving in this range. Required saving over the trivial bound to see a zero at real part theta:
Z^{2-theta}, more than square-root cancellation in the c-sum (Z^{1/2}) plus anything not coming from the complete
m-sum. The map (assumed abscissa) -> (returned abscissa) is the identity, f(theta) = theta.

### 4.3 Regime Z >= Q^{1+eps}: Kuznetsov form, exponents [ARGUED; level-4d bookkeeping not written]

K(1, h^2 d 4bar; c) with (c, 2d) = 1 is a Kloosterman sum for the cusp pair (infinity, 0) of Gamma_0(4 abs(d)).
The argument of the Bessel kernel is x = 4 pi abs(h) sqrt(abs(d)) / (2c) <= Z^eps / Q < 1, so the Bessel transforms
are Mellin transforms of the bump up to Gamma factors, and the spectrum is cut at abs(t) <= Z^eps. Frequencies run
to H = Z^{1+eps}/Q. Separating the weight Om^(hQ/c) by a Mellin variable u (pole of the Mellin transform of Om^ at
u = 0 with residue Om^(0); sum_h a(h) h^{-u} evaluated on Re u = 1/2 after removing poles):

| term | Dirichlet series in h | (Q, Z) exponents of the bound | monomials in Z |
|---|---|---|---|
| frequency 0 | - | Q^1 Z^{beta-1-sigma} | Q Z^{rho-1-s} |
| cusp forms u_j, abs(t_j) <= Z^eps | L(u, sym^2 u_j)/zeta(2u): no pole at u = 1; vanishes at u = 0 | Q^{1/2} Z^{1/2-sigma+eps} (Re u = 1/2) | Z^{-s +- 2 i t_j} x (Z/Q)^u |
| Eisenstein, residue at u = 0 | zeta(2it) zeta(-2it) | Q^1 Z^{-sigma} on the t-line | Q Z^{-s+2it} gamma(t) zeta(-2it)/zeta(1+2it): poles at 1 + 2it = rho give Q Z^{rho-1-s} |
| Eisenstein, residues at u = 1, 1 +- 2it | zeta(u) zeta(u+2it) zeta(u-2it)/zeta(2u) | Q^0 Z^{1-sigma} | Z^{1-s}, Z^{1-s} Q^{-+2it} Z^{2it} |
| Weil bound for all of NZ, for comparison | - | Q^0 Z^{3/2-sigma} | - |

The zero monomials of the frequency-0 term, Q Z^{rho-1-s}/zeta'(rho), have the same (Q, Z) exponents as the zero
residues of the Eisenstein term at u = 0. That they are equal with opposite sign is Lemma C. The cusp part carries
no zeta-zero monomial at the level u = 0; at general u the Kloosterman zeta function has its zeta-zero poles at
2s' = rho only (Selberg; CLASSICAL), which is the same location.

### 4.4 Lemma C (closure) [PROVED for fixed Q; continuation of L(w, chi) CLASSICAL]

Fix Q and s, d = 2. The Mellin transform in Z of the direct side is
I~(v) = int_0^inf I(Q, Z; s) Z^{-v-1} dZ = W(v) sum_m Om(m/Q) L_b(s + v, chi_m),
L_b(w, chi_m) = prod_{p not dividing 2d} (1 + chi_m(p) p^{-w}) = L(w, chi_m) / (L(2w, chi_m^2) prod_{p | 2d}(1 + chi_m(p) p^{-w})),
chi_m = ((m^2 - d)/.) a nonprincipal Dirichlet character for every m. Its singularities in w = s + v lie in
{rho'/2} u {Re w = 0} u {negative integers}. The Mellin transform of the frequency-0 term,
Q Om^(0) W(v) loc / zeta(1 + s + v), has poles at w = rho - 1, which is none of these points
(-1 < Re(rho - 1) < 0, Im != 0, and rho - 1 = rho'/2 would force Re rho' < 0). Therefore the Mellin transform of
NZ = I - (frequency 0) has, at each v = rho - 1 - s, exactly the negative of the principal part of the
frequency-0 term. In the expansion of the Poisson side in powers of Z at fixed Q, the monomials Q Z^{rho-1-s}
cancel identically. If the c-sum is taken over all odd c (Jacobi symbol), I~ is entire and the Poisson side has no
zero monomial of any kind. QED

**Decision.** The zero monomials Q Z^{rho-1-s} are matched identically by the nonzero-frequency (Eisenstein)
terms. The conic row gives: an identity (4.1); in the range Z < Q the complete-sum statement mean_m ((m^2-d)/c) =
mu(c)/c; in the range Z > Q a windowed mean over m of partial sums of L(s, chi_{m^2-d}), a mean-value statement
(MV-CAP). It is closed.

---

## 5. Controls

| control | step | outcome |
|---|---|---|
| DH (absorption step) | The row produces mu(c) x_c/c. sum_c mu(c) x_c c^{-w} = 1/L(w, x) requires x completely multiplicative. The Dirichlet inverse b of the DH coefficients is not multiplicative and not supported on squarefree c; no x_c with abs(x_c) <= 1 on squarefree c gives 1/L_DH(1 + s). | The frequency-0 target cannot be DH: the absorption step uses multiplicativity [PROVED, elementary]. The identity itself, with arbitrary x_c, holds. |
| Sign twist x_c = eps_c c^{-s}, eps completely multiplicative | First representation (Poisson, Lemma 3): holds, target 1/L_eps(1 + s). Second representation (Lemma C): needs the continuation of sum_c eps_c chi_m(c) c^{-w} to Re w < 0, i.e. the functional equation. | First representation holds; closure not formulable without FE. Matches the map: "second representation needs FE". |
| E_a | x_c = sum_{c = c1 c2} c1^{-a} c2^{a}: sum_c mu(c) x_c c^{-w} = H(w)/(zeta(w + a) zeta(w - a)), H an absolutely convergent Euler product for Re w > 1/2 + a. | Identity holds for E_a with its zeros at Re = 1/2 +- a appearing as Z^{rho +- a - 1 - s}. No step fails: the identity carries no zero information. |
| T-NR | Changes the local factor at one prime q. For (c, q) = 1 rows the identity is unchanged; with q allowed the reciprocal local factor is inserted through x_c. | Identity holds; no step fails. |
| Backward heat | No ordinary Dirichlet series; rows (f(m)/c) c^{-s} have no heat-deformed analogue with a character in c. | Not formulable; no handle. |

No control is violated by anything in this lane except through multiplicativity of x_c, and that step sits at
weight 1 + s, to the right of Re = 1. Q2 of the map (uniform in height, every window): the only statements
obtained are identities and means over m. Q3 (where multiplicativity enters): in sum mu(c) x_c c^{-w} = 1/L(w, x),
at Re w > 1.

---

## 6. Pivot (one): order-r symbol on the conic

The strongest adjacent idea is the one that reaches shift 1/2. For chi of order r >= 3 mod p,
T(p) = sum_m chi(m^2 - d) = chi chi_2(d) chi(-1) J(chi, chi_2) (Jacobi sum), abs(T(p))^2 = p [PROVED: substitute
u = m^2, T = sum_u chi(u - d)(1 + chi_2(u)), and chi, chi_2, chi chi_2 are nontrivial]. MEASURED (`test3.py`):
abs(abs(T)^2 - p) < 4e-12 for the 45 primes p = 1 mod 3 below 500, d in {2, 5, -1}, r = 3; T is never real.
The frequency-0 term is then at shift 1/2 with the reciprocal produced by the row. Its target is 1/L(1/2 + s, psi)
with psi the Jacobi-sum Groessencharacter of Q(zeta_r) of infinity type weight one. It is not zeta and not a
Dirichlet L-function. With r = 6 the identity J(chi, rho) g(chi rho) = -mu(pi) g(chi) g(rho) used here is the one
of `zf-higher-rows` Theorem 1, i.e. the absorbed class of the existing 7/8 architecture (row Z14). The pivot leads
back to the row family already on file and does not reach an order-2 object. Stopped here.

Why shift 1/2 cannot carry zeta in this construction [PROVED for k = 1 by Lemma 4; ARGUED for k > 1]: complete
sums of symbols over varieties have Frobenius eigenvalues of integer weight; root-of-unity eigenvalues (Dirichlet
and Artin targets) have even weight and enter at integer shifts; odd-weight eigenvalues (shift 1/2) are never
roots of unity times sqrt p with a finite-order character, they are Hecke characters of infinite order or
higher-rank motives.

---

## 7. Verdict

Precise obstruction. The idea is killed by its own criterion at the first test and the kill is a theorem
(Theorem N), not a sample property.

1. Lemma 0 of `ap-order-two` has exactly one escape among one-variable order-2 polynomial rows: deg g even, in
   pure form the conic m^2 - d. There the dual is a Kloosterman sum (not a Weil index), the two representations
   are different, and mu(c) is produced by the row.
2. The escape costs one full unit of weight: frequency 0 is mu(c)/c. The target is 1/zeta(1 + s). Shift 1/2 is
   excluded by integrality of S_f(0; p), shift 0 by Lemma 4(iv). Flat dual and nonzero frequency 0 exclude each
   other at every prime (Lemma 1).
3. For the conic the identity is closed (section 4): complete-sum identity for Z < Q, cancellation of all zero
   monomials for fixed Q, a mean over m otherwise.
4. Map section 6 item 1 ("effective order 2"): the order-2 polynomial rows do not supply the object. An "effective
   order 2" object in the sense of Z15 would need a frequency-0 (or coherent-set) coefficient of size c^{-1/2}
   carrying mu for a Dirichlet target; within symbol rows of polynomial argument this is excluded for order 2 and,
   for higher order, is the Jacobi-sum class already used at 7/8.

Nothing here is a statement about zeros of zeta.

## 8. Three weakest steps

1. **Section 4.3 (Kuznetsov exponents) is ARGUED.** The level-4d cusp-pair bookkeeping, the Bessel transforms and
   the Mellin separation of Om^(hQ/c) are not written out, and the term-by-term match of the Eisenstein residues
   with the frequency-0 residues (including the Eisenstein terms from u = 1, 1 +- 2it, which carry monomials
   Z^{rho-s} and must cancel among themselves) is not derived. The cancellation is proved only indirectly, by
   Lemma C.
2. **Lemma C is for fixed Q.** With Q = Z^M coupled, the Mellin argument does not apply. For M > 1 the statement
   is replaced by 4.2 (proved). For M < 1 the claim "the nonzero frequencies give only a mean value over m" rests
   on the absence of any estimate for I beyond the trivial bound and the large sieve; that no better estimate
   exists is not proved (it is the statement that the family chi_{m^2-d}, m ~ Q, is too thin for known mean
   values). A power saving for sum_m Om(m/Q) P_Z(s, chi_{m^2-d}) below Q Z^{-sigma} in the range Z > Q would not be
   an identity; it was not examined whether such a bound could be turned into zero information, since the
   frequency-0 term is then below the Kuznetsov size of NZ by a factor (Q/Z) Z^{beta-1}.
3. **Theorem N is proved for one variable only, and Lemma 2(d) is measured.** The several-variable statement
   (integer shifts for Artin targets) is argued from Deligne's weights without checking the degenerate cases
   (singular fibres, non-squarefree c, the primes dividing the discriminant), and non-flatness for deg g >= 3 is
   exact only through Lemma 1 at primes where S_f(0; p) != 0 or the root count is not 1; at the remaining primes
   it is measured (p <= 500) and attributed to Katz without re-derivation. Rows that are not of the form
   symbol(polynomial) (for example symbols of values of non-polynomial arithmetic functions, or half-integral
   weight coefficients as rows) are outside the classification.
