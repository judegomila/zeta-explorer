# c18-d10-inertia-law-theorem-t-lemma-d: inertia law of the rank-2 apex kernel (row D10, cell U6 (g))

Internal working note, 2026-11-19/20, round 18, attack lane (kind: deepen). Inputs: `c17-rank2-gram-symmetric-blaschke-closure`
(Lemma M, Theorem T, measured inertia law, referee note on the pole-free base), `c16-u6g-scattering-fe-rank2-bridge-stage-a`
(Lemmas R, D, S), map rows D9, D10. RH is open. No statement about zeros of zeta is made. NO QED.

Labels: PROVED (complete argument here) / PROVED-exact (computer-assisted, exact rational arithmetic, degree bounds stated) /
CLASSICAL / MEASURED (ball arithmetic unless stated) / ARGUED / OPEN.

**Verdict: partial result. Row D10 is not proved closed. The first lemma of the assignment is proved (symmetric quartet, all
parameters). The pole-free case is proved for every degree. The transfer to zeta is reduced to one named statement, X(d) for
every degree d, which is open for d > 4. Score 0; all four flags false.**

1. **Theorem Q (PROVED-exact).** In the rational model (base M_0(u) = (u+1)/(u-1)) with a symmetric quartet 1/2 +- eta +- i g
   inserted, the apex kernel K_0 is positive semidefinite of rank exactly 6 for every 0 < eta < 1/2 and every g > 0. This is
   Theorem T of c17 extended from degree 2 to degree 4 as a theorem in the parameters (c17 had 6 parameter values).
2. **Theorem H (PROVED).** Identity: 6 N = antisymmetrisation of L(x_1,y_1) L(x_2,y_2) [b(x_12) b(y_12) + 2 b(-x_12) b(-y_12)],
   L the Bezoutian of b for u -> -u. Consequence: if every root of b lies in the closed left half-plane (pole-free base,
   M_0 = +1 or -1, any Blaschke insertion with zeros in Re >= 0), the apex kernel is positive semidefinite, for every degree,
   with or without reflection symmetry. This proves, in the model, the referee's measured finding that a pole-free base
   (DH) detects neither reflection nor parity.
3. **Theorem G (PROVED).** N is a polynomial; its values on the n^2 crossing points p_ij = (r_i, r_j) are given by a closed
   formula (section 3.3) whose singular set is {r_i + r_j = 0}, {r_i + r_j + r_k = 0}, {2 r_i + r_j = 0}. For three roots the
   inertia is a function of the signs of these forms (MEASURED on 1,500 exact samples, no ambiguity).
4. **Transfer (PROVED as a reduction; section 4).** M(u) = xi(u)/xi(u+1) = M_0(u) Xi(u)/Xi(u+1), Xi the entire xi-function,
   and Xi(u)/Xi(u+1) is the locally uniform limit of P_N(u)/P_N(u+1), P_N the real symmetric polynomial of the zeros with
   |Im rho| < N. So zeta's apex kernel, and that of zeta times any symmetric multiplier, is a pointwise limit of
   rational-model apex kernels of symmetric sets. **If X(d) holds for every d (the model apex kernel of every symmetric set
   in the open strip is positive semidefinite), then (I2) holds for zeta and for zeta times every symmetric multiplier at
   T = 0, and by Lemma M on the closed chamber.** The pole at 1 enters only as the base factor M_0. The source (Miller)
   is not needed for T = 0 on this route and does not cover it.
5. **X(d): proved for d = 2 (c17) and d = 4 (Theorem Q); exact instances for d = 6, 8, 10, 12 (16 random symmetric sets,
   rank d(d-1)/2, 0 negative squares); OPEN in general.** No induction on the degree was found: Lemma D gives a multiplier
   that is not a congruence, and the identity of Theorem H leaves an indefinite cross term when the base has the pole.
   This is the failing transfer step.
6. Decisive numerical test (assignment; MEASURED): 200 symmetric and 200 unpaired insertions on the zeta base, T = 0,
   orders 64, 96, 128, ball-certified inertia: symmetric 600 of 600 positive definite; unpaired: observed negative index
   equals the predicted count in 153, 186, 195 of 200 at orders 64, 96, 128 and is below it otherwise, never above.
   Run locally (the server refused the job: machine memory below the wrapper's floor; section 5.1).

---

## 1. Plan, sources, what is new

Read: BRIEF to the end; map rows D9, D10 and the section 2 notes on BLS and BLS in rank 2; c17 RESULT.md and REFEREE.md;
c16 RESULT.md (Lemmas R, S, D); the code `k2.py`, `search.py`, `toy_exact_lib.py`, `toy_quartet.py` of c17 (as text; `k2.py`
and `search.py` are copied unchanged into `server/` and used for the zeta-base run).

Target (assignment): for Z = zeta times a finite Blaschke-type insertion, the apex kernel K_0 has negative index equal to
the number of inserted left zeros without reflected partner, and is positive for a symmetric insertion.

Plan: (1) quartet by exact computation, as a theorem in (eta, g); (2) general degree; (3) transfer from the rational model
to zeta, naming where the pole at 1 is used and whether the truncation formula at T = 0 is covered by the source;
(4) the 200 + 200 certified run; (5) controls in the model and on the zeta base.

New relative to the record: Theorem Q; Theorem H and its identity; the crossing-point Gram formula (Theorem G); the
identification M = M_0 Xi(u)/Xi(u+1) and the limit statement (the rational model is not only a model: zeta's kernel is a
limit of its symmetric instances); exact model instances to degree 12; the model versions of the controls.

Requirements as planned: none can be earned. The lane tests R3 for the device of row D10.

## 2. Setting and notation

Coordinates as in c16/c17: lambda = (z_1, z_2), z_12 = z_1 + z_2; W = S_3 acts by s_1 (z_1, z_2) = (-z_1, z_12),
s_2 (z_1, z_2) = (z_12, -z_2). Apex kernel K_0(lam, mu) = sum over w, w' of c(w, lam) conj(c(w', mu)) / (nu_1 nu_2),
nu = w lam + conj(w' mu).

Rational model. b a real polynomial of degree n with roots r_1..r_n; psi(x) = b(x_1) b(x_2) b(x_12);
c(w, lam) = sgn(w) psi(w lam)/psi(lam). This is the cocycle of M(u) = -b(-u)/b(u). Cases:
- b = (u - 1) g(u): M = M_0 g(-u)/g(u), M_0 = (u+1)/(u-1) (base with the pole at 1, residue 2; the model of c17);
- b = g(u): M = -g(-u)/g(u) (base -1);  b = u g(u): M = g(-u)/g(u) (base +1);
- g(u) = product of (u + a_j): Theta(u) = g(-u)/g(u) up to sign has zeros at the a_j. Roots of b: 1 and -a_j.

N(lam, mu) = psi(lam) psi(mu) K_0 = sum over w, w' of sgn(w) sgn(w') psi(w lam) psi(w' mu) / (nu_1 nu_2), nu = w lam + w' mu.

Symmetric set: {a_j} closed under a -> 1 - a and conjugation, in 0 < Re a < 1. Then g(u) = P(-u) with P(s) = P(1 - s)
(Lemma S of c16), i.e. g(-1 - u) = g(u).

**Statement X(d).** For every symmetric set of d zeros (with multiplicity) in the open strip, the kernel N of
b = (u - 1) g is positive semidefinite.

## 3. Work on the rational model

### 3.1 Lemma P (structure of N; PROVED)

(a) N is a polynomial in (lam, mu). Proof: the possible poles are the lines (w lam + w' mu)_i = 0. On
(w lam)_1 + (w' mu)_1 = 0 the terms (w, w') and (s_1 w, s_1 w') have the same second denominator (nu_2 -> nu_1 + nu_2 = nu_2
on the line), opposite first denominators, the same sign product, and equal numerators: with x = w lam, y = w' mu,
psi(s_1 x) psi(s_1 y) = b(-x_1) b(x_12) b(x_2) b(-y_1) b(y_12) b(y_2), and b(-x_1) = b(y_1), b(-y_1) = b(x_1) on the line.
The residues cancel; the same with s_2 for the second denominator.

(b) N(v lam, mu) = sgn(v) N(lam, mu) = N(lam, v mu) by reindexing. Hence N = Delta(lam) Delta(mu) Q(lam, mu),
Delta = z_1 z_2 z_12, Q invariant in each variable, of degree at most 3n - 3 in each variable (each term has degree at
most 3n in lam). The invariant ring is C[I_2, I_3], I_2 = z_1^2 + z_1 z_2 + z_2^2, I_3 = (2z_1 + z_2)(z_1 - z_2)(z_1 + 2z_2).
So Q = v(lam)^T H v(mu), v the monomials I_2^a I_3^b of degree at most 3(n-1), H a real symmetric matrix determined by
the values of Q on any unisolvent pair of point sets. The fit used in every exact computation below is therefore exact
(no test of the fit is needed; the tests that were run all pass).

(c) For real b the Hermitian kernel K_0(lam, mu) equals Delta(lam) v(lam)^T H conj(v(mu) Delta(mu)) / (psi(lam) conj psi(mu)),
and the monomials are linearly independent on any open set, so the inertia of K_0 on its domain is the inertia of H.

### 3.2 Theorem Q (symmetric quartet; PROVED-exact; `quartet_lib.py`, `quartet_theorem.py`, `quartet_signs.py`, `quartet_f3.py`)

Parameters E = eta^2, c = 1/4 + eta^2 + g^2. Then b(u) = (u - 1) [ (u^2 + u + c)^2 - E (2u + 1)^2 ], n = 5, and H(E, c) is a
19 x 19 symmetric matrix whose entries are polynomials of degree at most 12 in c and 6 in E (N has degree 6 in the
coefficients of b; these have degree at most 2 in c and 1 in E). Domain D = {0 < E < 1/4, c > 1/4 + E}.

Step 1 (rank at most 6 identically). A 7 x 7 minor of H has degree at most 84 in c and 42 in E. H was computed exactly
on the grid E = 0..42, c = 0..84 (3,655 points); the rank is at most 6 at every grid point (6 at 3,604 points, lower at
51). A polynomial of degree at most d_i in variable i that vanishes on a product grid with more than d_i values in each
variable is zero. So every 7 x 7 minor vanishes identically and rank H <= 6 for all (E, c).

Step 2 (rank exactly 6 on D). e_6(E, c), the sum of the principal 6 x 6 minors (the coefficient of t^13 in the
characteristic polynomial), has degree at most 72 in c and 36 in E. It was interpolated exactly from the grid
E = 0..36, c = 0..72 and agrees with the remaining 954 grid values. Its degree is 22 in E, 28 in c, and it factors
over Q (flint) as (8388608/4782969) times

    F_1 = (9c - 8E)^2 - 9E                 = (1/16) ((2 eta - 3)^2 + 36 g^2) ((2 eta + 3)^2 + 36 g^2)
    F_2 = (c + 8E + 2)^2 - 81E             = (1/16) (9 (2 eta - 1)^2 + 4 g^2) (9 (2 eta + 1)^2 + 4 g^2)
    F_3 = 10783 E^2 + (5154 c^2 - 13360 c + 187) E + 1831 c^4 - 4408 c^3 + 4459 c^2 - 102 c + 51
    F_4   (degree 4 in E, 8 in c; in `quartet_theorem.json`)
    (E - c)^4 = ((4 g^2 + 1)/4)^4,   (E - c^2)^4 = (((2 eta - 1)^2 + 4 g^2)((2 eta + 1)^2 + 4 g^2)/16)^4,   (4E - 1)^4.

Signs on D: F_1, F_2 and F_4 have all coefficients positive after the substitution E = s/(4(1+s)), c = 1/4 + E + t
(s, t > 0, a bijection onto D) and clearing the denominator (1+s)^k (`quartet_signs.log`); F_3 is a quadratic in E with
positive leading coefficient whose discriminant -52410976 c^4 + 52410976 c^3 - 11908392 c^2 - 597176 c - 2164763 has no
real root (Sturm count 0) and is negative at c = 0 (`quartet_f3.log`), so F_3 > 0 everywhere; the last three factors
are nonzero on D and occur to the fourth power. Hence e_6 > 0 on D. Since rank H <= 6, e_6 is the product of the six eigenvalues that
can be nonzero, so rank H = 6 at every point of D.

Step 3. D is connected, H is real symmetric of constant rank 6 on D, so its inertia is constant on D. At
(eta, g) = (1/4, 1) the exact inertia is (6, 0) (`quartet_probe.py`; also 6 values in c17 and 6 more in section 3.5). QED.

Remarks. The zero set of e_6 in the (eta, g) plane is {eta = +-1/2}, {eta = +-3/2, g = 0}, {(2 eta -+ 1)^2 + 4 g^2 = 0}:
the edge of the strip and the points where an inserted zero meets 1 or 2. F_3 and F_4 depend on the monomial basis and
have no real zero in D. At eta = 1/2, g = 2 the rank drops to 3 and the form is still positive (`model_extra.log`). For
eta > 1/2 (zeros outside the strip) the form has 2 negative squares (section 3.5).

### 3.3 Theorem G (Gram matrix on the crossing points; PROVED; `explore2.py`, `explore4.py`, `theorem_g_check.py`)

Let b have simple roots, p_ij = (r_i, r_j), D_ij = b(-r_i) b(-r_j) b(-r_i - r_j), beta_i = b'(r_i)/b(-r_i),
S(u) = b(-u)/b(u). Then

    N(p_ij, p_kl) / (D_ij D_kl) = 1/((r_i + r_k)(r_j + r_l)) + delta_jl beta_j/(r_i + r_j + r_k) + delta_ik beta_i/(r_i + r_j + r_l)
                                  - delta_jk delta_il beta_i beta_j / S(r_i + r_j).

Proof. At lam = p_ij every psi(w lam) vanishes except w = w_0 (w_0 lam = (-r_j, -r_i)), so for generic mu
N(p_ij, mu) = -D_ij sum over w' of sgn(w') q_ij(w' mu), q_ij(x) = psi(x)/((x_1 - r_j)(x_2 - r_i)), a polynomial identity in mu
by Lemma P. Evaluating the six terms at mu = p_kl: s_1 and s_2 give 0 (factors b(r_l), b(r_k)); e gives
delta_jk delta_il b'(r_i) b'(r_j) b(r_i + r_j); the two 3-cycles give delta_jl b'(r_j) b(-r_k) b(-r_j - r_k)/(-(r_i + r_j + r_k)) and the
same with (i, l); w_0 gives -D_kl/((r_j + r_l)(r_i + r_k)). QED.
Check: formula against direct polynomial evaluation, exact, 28 random real root sets with n = 2..5: 0 mismatches; the Gram
matrix has rank n(n-1)/2 and the same inertia as H in all 28 (`theorem_g_check.log`).

Reading. The first term is the Gram matrix of the exponentials e^{-r_j h_1 - r_i h_2} on the quadrant; the corrections are
supported on index coincidences. The singular set of the formula is the union of r_i + r_j = 0, r_i + r_j + r_k = 0 and
2 r_i + r_j = 0. With r_0 = 1 and r_j = -a_j these are: a zero at 1; a_j + a_k = 1 (partners; for a conjugate pair,
Re a = 1/2); a_j = 1/2; a_j = 2. For n = 2 the form has rank 1 and sign sgn((2 r_0 + r_1)(r_0 + 2 r_1)): a single real
zero a in the model with the pole gives sign (1 - 2a)(2 - a), negative for 1/2 < a < 2 (control E1, PROVED in the model).
For n = 3 the inertia is a function of the signs of these forms: 1,500 exact random real triples, 24 sign classes, no
class with two inertias (`explore4.py`; MEASURED). No pair-indexed sign rule fits (256 candidate rules, `explore5.py`).
Generic rank n(n-1)/2 is MEASURED (all instances), not proved for general n.

### 3.4 Theorem H (Bezoutian identity; pole-free bases; PROVED; `theorem_h.py`)

L(x, y) = [b(x) b(y) - b(-x) b(-y)]/(x + y) (a polynomial; the Bezoutian of b(u), b(-u)). For a function F(x, y) write
A[F](lam, mu) = sum over w, w' of sgn(w) sgn(w') F(w lam, w' mu). Put x_12 = x_1 + x_2 and

    LL_+ = L(x_1, y_1) L(x_2, y_2) b(x_12) b(y_12),      LL_- = L(x_1, y_1) L(x_2, y_2) b(-x_12) b(-y_12).

**Identity.** A[LL_+] = 2N + X, A[LL_-] = 2N - X/2, hence 6N = A[LL_+ + 2 LL_-], where
X = A[psi_*(x) psi_*(y)/(nu_1 nu_2)], psi_*(x) = b(-x_1) b(-x_2) b(x_12).

Proof. For signs e = (e_1, e_2, e_12) let psi_e(x) = b(e_1 x_1) b(e_2 x_2) b(e_12 x_12). Expanding the two Bezoutians,
LL_+- = sum over e_1, e_2 of e_1 e_2 psi_e(x) psi_e(y) a(x + y), e = (e_1, e_2, +-), a(nu) = 1/(nu_1 nu_2). Six of the eight
sign patterns are psi composed with an element of W: e (+,+,+), s_1 (-,+,+), s_2 (+,-,+), the 3-cycles (-,+,-) and
(+,-,-), w_0 (-,-,-). For such a pattern, reindexing gives A[psi_e psi_e a] = A[psi psi (a o v^{-1})], and
a o s_1 = -1/(nu_1 nu_12), a o s_2 = -1/(nu_2 nu_12), the two 3-cycles give the same two functions, a o w_0 = a. With
N_b = A[psi psi/(nu_1 nu_12)], N_c = A[psi psi/(nu_2 nu_12)] one has N = N_b + N_c (partial fractions). The two remaining
patterns are (-,-,+) = psi_* and (+,+,-) = psi_* o s_1 = psi_* o s_2. The two expressions of A[psi_(+,+,-) psi_(+,+,-) a]
through s_1 and s_2 give X_b = X_c (X with 1/(nu_1 nu_12), 1/(nu_2 nu_12)), so X = 2 X_b and the (+,+,-) term is -X/2.
Summing: A[LL_+] = N + N_b + N_c + X, A[LL_-] = -X/2 + N_b + N_c + N. QED.
Check: all three identities, exact rational arithmetic, random real b of degree 1 to 7 (Hurwitz and not), 168 random
point pairs: 0 failures (`theorem_h.log`).

**Corollary H1.** If the Bezoutian L of b is semidefinite, then N is a positive semidefinite kernel. In particular this
holds when all roots of b lie in the closed left half-plane (Hermite: L >= 0) or all in the closed right half-plane (L <= 0).
Proof. Hermite's theorem in kernel form, with its two-line proof: for b = b_1 b_2,
L_b(x, y) = b_1(x) b_1(y) L_{b_2}(x, y) + b_2(-x) b_2(-y) L_{b_1}(x, y), and for one factor u - r the Hermitian Bezoutian is the
constant -2 Re r; so L_b >= 0 by induction when all Re r <= 0 (complex roots in conjugate pairs; the same identity holds
for the Hermitian form with b#(x) = conj b(-conj x)), and L_b <= 0 when all Re r >= 0.
L(x_1, y_1) L(x_2, y_2) is a product of two semidefinite kernels of the same sign, so it is positive semidefinite;
multiplying by the rank-one kernels b(+-x_12) b(+-y_12) keeps this; A of a positive kernel sum_k F_k(x) conj F_k(y) is the
Gram kernel of sum_w sgn(w) F_k(w lam). QED.

Consequences.
- Base -1 (b = g) and base +1 (b = u g) with any finite Blaschke insertion with zeros in Re a >= 0: K_0 >= 0, for every
  degree, symmetric or not, left or right, any parity. The rank-2 form with a pole-free base reads nothing about the
  position of the zeros. This is the referee's finding of c17 (DH base: unpaired left pair and single real zeros give
  0 negative squares, MEASURED, 36 matrices), now PROVED in the model for every degree.
- With the pole (b = (u - 1) g, g Hurwitz) L has exactly one negative square: L = (x - 1)(y - 1) L_g - 2 g(-x) g(-y)
  = (x + 1)(y + 1) L_g - 2 g(x) g(y). The identity then writes 6N as a positive kernel minus cross terms carrying g(-x_i).
  All of the reflection law is in these cross terms. For a symmetric g (g(-u) = g(u - 1)) their sum must be dominated;
  no proof of this was found. This is the precise form of the open step X(d).

### 3.5 Exact instances for general degree (PROVED-exact at each listed configuration; `model_inertia.py`, `model_extra.log`)

Exact H (fit on the invariant monomials of degree at most 3(n-1), which is exact by Lemma P) and exact inertia.

| family (base with the pole unless stated) | cases | result |
|---|---|---|
| symmetric sets, d = 2, 4, 6, 8 (random mixes of quartets, real pairs, pairs on the line; eta in [0.02, 0.48], g in [0.1, 9]) | 6 each | rank d(d-1)/2 = 1, 6, 15, 28; 0 negative squares in 24 of 24 |
| symmetric sets, d = 10; d = 12 (three quartets) | 3; 1 | rank 45, 66; 0 negative |
| unpaired sets, degree of b up to 9 (1 to 3 left pairs or left real pairs, optional right pair, right real pair, quartet) | 14 | negative index = number of left zeros with multiplicity deficit, in 14 of 14; rank n(n-1)/2 minus the number of partnered zeros |
| left pair doubled; quartet with left pair doubled; with right pair doubled; quartet doubled | 4 | negative 4, 2, 0, 0 (multiplicity form of the law) |
| real {1/4, 3/4, 1} | 1 | rank 1, positive |
| single real zero 3/4; 1/4 | 2 | (0, 1); (1, 0) |
| single real zero 1/4 or 3/4 with a quartet or with one or two pairs on the line | 6 | 2 and 3 negative (degree 4), 4 and 5 negative (degree 6) |
| symmetric quartet outside the strip: eta = 3/4, 5/4, 9/16 | 3 | rank 6, 2 negative squares |
| pair right of 1 (3/2 +- 2i) | 1 | (3, 0) |
| base -1 and base +1: quartet, left pair, right pair, two left pairs, real left pair, single real zeros, pair right of 1 | 14 | 0 negative in 14 of 14 (Corollary H1) |
| base -1 and base +1: symmetric quartet outside the strip (eta = 5/4) | 2 | 4 negative squares (roots in both half-planes; H1 does not apply) |

One case of the unpaired batch (#28: real zeros 1/4, 1/4, 3/4, 53/64 and a right pair) was registered with prediction 2
and gave 1: the left zero 1/4 has multiplicity 2 and its partner 3/4 multiplicity 1, so the deficit is 1. The
registration script did not account for accidental partners; the law in its multiplicity form holds in this case.

The parity part of the measured law of c17 ("plus 1 for an odd number of real zeros") does not hold in the model in that
form: with an odd number of real zeros the negative index grows with the degree (2, 3 at degree 4; 4, 5 at degree 6).
The model inertia law is stated here for even numbers of real zeros only.

[Correction entered 2026-11-20 by lane c19-repair-owed-record-r18-checkpoint-prep, from REFEREE.md E-1: the preceding paragraph is wrong as stated. For odd degree g(-u)/g(u) is minus the Blaschke product Theta of the round-17 lane, so b = (u - 1) g is the model of M_0 (-Theta); the model of M_0 Theta for an odd number of real zeros is b = u (u - 1) g. With b = u (u - 1) g the exact inertia is (2, 1) for a real zero at a = 3/4, 11/20, 9/10 (1 negative square) and (1, 2) at a = 1/4 (2 negative squares), with or without a quartet ((16, 1) and (15, 2) with the quartet (1/4, 2)): the round-17 measured law, parity clause included, in the cases tested. The growth with degree quoted above is a property of M_0 (-Theta). The rows of table 3.5 for a single real zero (8 of 75 configurations) and the control row E1 are computations for -Theta. Even-degree statements are unaffected. Map row D10, round-18 addendum.]

Rational-model inertia law, status: PROVED for d = 2 (c17, Corollary T1); symmetric part PROVED for d = 4 (Theorem Q);
exact at the 75 configurations of the table; OPEN for general degree.

### 3.6 General degree: what was tried and where it stops

- Induction with Lemma D. For b -> b g_1, D†D acts on the anti-invariant sum by the invariant scalar
  G(mu) = product over all roots of g_1(alpha(mu)), and N_{b g_1}(lam, mu) = G(mu) N_b(lam, mu) + edge and corner terms.
  Multiplication by a function of mu alone is not a congruence of Hermitian forms, the correction is not symmetric by
  itself, and the rank jumps from d(d-1)/2 to (d+k)(d+k-1)/2. No inductive inequality was obtained.
- Wall crossing. By Theorem G the inertia can change only on the three families of hyperplanes. Inside the family
  r_0 = 1, r_j = -a_j, 0 < Re a_j < 1 the walls are a_j + a_k = 1 (j <= k). A proof of the full law by continuation would
  need (i) generic rank n(n-1)/2 with a determinant formula for general n (available for n = 3 only:
  det H = const (sum r)^2 product (r_i + r_j)^4 product (2 r_i + r_j), which is Theorem T of c17 with r_0 = 1 written in the roots), and (ii) the direction of the sign change at each
  wall. Neither was derived for general n.
- Bezoutian identity. Proves the pole-free case (H1). With the pole, the single negative square of L produces cross
  terms; the symmetric case needs an exact cancellation that the identity does not display.
- Structure seen in the exact data, not used: for d = 2 symmetric, N = 36 m^2 Delta(lam)(I_2(lam) - I_2(lam_*)) times the
  same in mu, m = a(1 - a), lam_* = (a, 1 - a) the Lemma R point; the rank d(d-1)/2 equals the dimension of the second
  exterior power of the d-dimensional model space of Theta; in the chamber where all inserted zeros are left zeros the
  inertia equals that of the second exterior power of the Cauchy form of the roots (signature (d, 1)), i.e. (d(d-1)/2, d).

## 4. Transfer from the rational model to the zeta base

**Lemma L1 (PROVED; CLASSICAL inputs).** Let xi(u) = pi^(-u/2) Gamma(u/2) zeta(u) and Xi(u) = (1/2) u (u - 1) xi(u) (entire,
Xi(u) = Xi(1 - u), zeros = nontrivial zeros of zeta). Then

    M(u) = xi(u)/xi(u+1) = M_0(u) Xi(u)/Xi(u+1),     M_0(u) = (u+1)/(u-1).

Proof: xi(u) = 2 Xi(u)/(u(u-1)), so xi(u)/xi(u+1) = [Xi(u)/Xi(u+1)] (u+1) u/(u (u-1)). QED.
So zeta's scattering coefficient is the base of the rational model times the insertion of the full zero set, and the pole
at 1 (with the pole of xi at 0) is exactly the base factor M_0. This is where the pole at 1 is used.

**Lemma L2 (PROVED; CLASSICAL inputs).** Let P_N(u) = product over zeros rho with |Im rho| < N of (1 - u/rho). Then P_N is a
real polynomial of even degree with P_N(1 - u) = P_N(u) and zeros in the open strip (zero set closed under conjugation and
rho -> 1 - rho; no zeros on Re = 0, 1), and P_N(u)/P_N(u+1) -> Xi(u)/Xi(u+1) locally uniformly away from the zeros of Xi(u+1)
(Hadamard product of Xi with the symmetric grouping, in which the exponential factors cancel). Hence
M_0 P_N(u)/P_N(u+1) -> M(u) for every u with Re u > 0, u != 1, and the same after multiplication by a fixed symmetric
Theta_P. Illustration (mpmath, not a proof): relative error 1e-2, 5e-3, 2e-3 at N = 25, 100, 400 zero pairs at
u = 0.7 + 0.3i (`limit_check.log`).

**Proposition L3 (PROVED as an implication).** Assume X(d) for every even d (multiplicities allowed). Then for every real
polynomial P with P(s) = P(1 - s) and zeros in the open strip (P = 1 included), the apex kernel K_0 of M Theta_P is positive
semidefinite on Re z_1, Re z_2 > 0 minus the polar set; by Lemma M of c17 (with rank-one positivity, classical for zeta,
row D9 for conjugate pairs) the same holds for K_T on the closed chamber.
Proof. K_0 of M Theta_P at given points is a finite rational expression in the values of M Theta_P at z_1, z_2, z_12. These are
limits of the values of M_0 Theta_{P_N P} by L2. P_N P is symmetric with zeros in the open strip, so by X(deg) each
approximating Gram matrix is positive semidefinite; the limit is. QED.

Corollaries of the same limit argument, unconditional:
- For d <= 4 nothing new follows for zeta (the limit needs all degrees).
- Upper bound on the negative index: if the model law holds for all degrees, K_0 of zeta times an unpaired insertion has
  at most kappa negative squares (a limit of kernels with at most kappa negative squares has at most kappa). The lower
  bound needs Lemma R or a certified matrix (available: section 5.1).

**The failing transfer step.** X(d) for every d. It is a statement about the rational model only. It does not involve the
arithmetic of zeta, the truncation formula of the source, or any limit beyond L2. Proved for d = 2 and d = 4; exact
instances to d = 12; measured through the zeta base (c17: 1.4 million certified matrices; here 600 more).

**Truncation formula at T = 0 and the source.** Miller (arXiv math/0006058), Theorem 6.1 with (7.6), gives the 36-term
formula as the inner product of truncated Eisenstein series; as c17 found, the source states no range for the truncation
parameter (C "a fixed parameter" in a_0; "c large enough" where it is used), and Arthur's statement needs C sufficiently
regular. So positivity of K_T for zeta at T = 0 is not covered by the cited source; relative to the source it is
MEASURED. On the route of this lane it would be a consequence of X(d) and Lemma L2, with no appeal to the source: the
36-term expression is used only as an algebraic kernel.

**DH and backward heat through the same lens (ARGUED from the model, plus the measurements of c17).** For an entire
symmetric f without the poles at 0, 1 (the completed DH function), M_f = f(u)/f(u+1) is base +1 times the insertion of its
zeros. Zeros in the closed strip give roots of b in the closed left half-plane and by H1 a positive apex kernel for every
finite truncation of the product, symmetric or not; zeros with Re rho > 1 come with partners with Re < 0, the roots of b
then lie in both half-planes, and the model form has negative squares (4 for one quartet, section 3.5). The same for
the base with the pole: a symmetric quartet outside the strip gives 2 negative squares. This matches c17: backward heat
passes at t = -1 and fails at t = -5, -10 where zeros with real part above 1 were located; DH passes at heights below 100.
The limit of the finite truncations for DH (lower bound on the negative index) was not carried out.

## 5. Decisive test on the zeta base and controls

### 5.1 200 symmetric and 200 unpaired insertions, orders 64, 96, 128 (MEASURED; `server/server_inertia.py`, `inertia_64_96_128.jsonl`)

Method: `k2.py` and `search.py` of c17 unchanged (ball arithmetic, diagonally pivoted LDL*, certified inertia; zero sets
built exactly from dyadic eta, g). T = 0 (decisive by Corollary M2 of c17). Symmetric: 200 random sets of order 2 to 12
(quartets with eta in [0.01, 0.49], g log-uniform in [0.1, 60]; real pairs), point families `special`, `low`, `height`.
Unpaired: 200 random sets with 1 to 3 unpaired left pairs (conjugate, Re a in [0.03, 0.47], Im in [0.1, 8], or two real
left zeros), optional right pair and optional symmetric quartet; predicted negative index 2, 4 or 6; families `special`, `low`.

| kind | order | matrices | certified, observed = predicted | observed < predicted | observed > predicted | undecided |
|---|---|---|---|---|---|---|
| symmetric (predicted 0) | 64 | 200 | 200 | 0 | 0 | 0 |
| symmetric | 96 | 200 | 200 | 0 | 0 | 0 |
| symmetric | 128 | 200 | 200 | 0 | 0 | 0 |
| unpaired | 64 | 200 | 153 | 47 | 0 | 0 |
| unpaired | 96 | 200 | 186 | 14 | 0 | 0 |
| unpaired | 128 | 200 | 195 | 5 | 0 | 0 |

All 1,200 matrices were decided at 512 bits. The negative index never exceeds the predicted count and reaches it more
often as the order grows (a finite sample can only undercount). No symmetric insertion fails: the condition of the
assignment for raising the headline is not met.

Execution. The assignment asked for the server (rhrun, 8 cores, 12 GB). The first unit (`rh-c18d10-inertia-1120044307`)
failed at start because the copy had not arrived (a zsh expansion in the rsync target; no computation ran). After the
copy, rhrun refused three launches (requests of 8, 5 and 3 GB): the machine had 47, 44, 42 GB available, below the
wrapper's floor of 40 GB plus the request, with a load average of 154. The wrapper was not bypassed. One matrix of order
128 takes 0.7 s locally, so the whole test (1,200 matrices) was run on the Mac through `scripts/memcap.sh 8` with 6
workers in about 2 minutes. No server unit of this lane is running; the failed unit is inactive.

### 5.2 Controls

| control | result | status |
|---|---|---|
| ZQ, rational form | a symmetric set in the sense of this lane (zeros removed from the line and a quartet inserted keep the zero set symmetric); passes on the zeta base (c17: 3,360 certified matrices); in the model it is a case of X(d): passes for d <= 4 (PROVED), exact instances to d = 12 | MEASURED / PROVED for d <= 4 in the model |
| DH | pole-free base: in the model every insertion in Re a >= 0 passes (Corollary H1, PROVED, every degree); detects neither reflection nor parity; expected to fail only through zeros with real part above 1 (model: 4 negative squares for a quartet outside the strip) | PROVED in the model; zeta-side MEASURED by c17 |
| backward heat t = -1 | c17's family is built on the entire function (its t = 0 member is M (u-1)/(u+1) = Xi(u)/Xi(u+1)): base +1. While the zeros stay in the closed strip every finite truncation passes by Corollary H1, on or off the line; c17: passes (non-rigorous quadrature) | PROVED in the model (finite truncations); MEASURED (c17) |
| backward heat t = -5 | zeros with real part above 1: model quartet outside the strip, 4 negative squares on a pole-free base, 2 with the pole; c17 measured failures | PROVED-exact in the model at 5 configurations; MEASURED (c17) |
| single real zero right of 1/2 | model, degree 1: sign (1 - 2a)(2 - a) < 0 for 1/2 < a < 2 (Theorem G, n = 2, PROVED); zeta base: fails (c17, certified) | PROVED in the model |
| unpaired left zeros (BLS-left) | fails; negative index = deficit count (model: PROVED d = 2, exact at 18 configurations; zeta: section 5.1) | as stated |
| sign-twisted primes, unimodular twist, zeta(s+a)zeta(s-a), T-NR, Beurling, phase-rotated transfer operator, theta^w | not formulable on this carrier without a functional equation and cocycle (c16 section 5); T-NR with c > 2 is the infinite symmetric case and is covered by Proposition L3 under X(d) | unchanged from c16 |

Every control that has the functional equation and zeros in the strip passes or is predicted to pass. The controls that
fail do so through a broken reflection symmetry of left zeros, the parity of real zeros, or zeros outside the strip:
properties zeta has by the functional equation, the pole and the classical zero-free region.

## 6. Verdict

Partial result. Row D10 is **not** proved closed: "the form reads reflection symmetry only; all symmetric controls pass"
is PROVED in the rational model for degree at most 4 and for every degree when the base has no pole, exact at 28
symmetric configurations up to degree 12, and MEASURED on the zeta base (600 further certified matrices up to order 128).
The failing transfer step is named: statement X(d) for every degree d (section 2), a finite-dimensional statement about
the polynomial kernel N of b = (u - 1) g with g(-1 - u) = g(u). Given X(d), Proposition L3 closes the row as a theorem:
(I2) holds for zeta and for zeta times every symmetric multiplier, so the device cannot separate zeta from ZQ or any
symmetric control.

No symmetric insertion failed. The headline does not move. No pivot was made.

## 7. Requirement flags

- R1 false. Multiplicativity is not used: by L1 the kernel depends on zeta only through its zero set and the pole;
  the rational model has no primes and reproduces every observed behaviour.
- R2 false. No conclusion about zeros at any height.
- R3 false. Symmetric controls pass (PROVED in the model for d <= 4; pole-free base PROVED for every degree; MEASURED on
  the zeta base). The device does not separate zeta from ZQ, DH at accessible height or small backward heat.
- R4 false. L2 is a limit from finite zero sets to the full zero set inside one inequality; it carries no information
  toward the critical line.

## 8. Three weakest steps

1. X(d) for d > 4 is open, and with it the closure of the row. The evidence beyond d = 4 is 16 exact symmetric configurations
   (d = 6 to 12) and the certified matrices on the zeta base. Proposition L3 is only an implication. The limit in L2
   is slow (relative error about 1/N), so no finite degree gives a statement about zeta.
2. Theorem Q is computer-assisted. It rests on: the degree bounds (entries of H: 12 in c, 6 in E; derived by hand from
   the degree 6 of N in the coefficients of b), the exact grid computation (flint rational arithmetic, characteristic
   polynomials of 3,655 matrices), the factorisation of e_6 by flint (the product of the factors was not re-expanded
   by a second system), the coefficient-sign certificates (sympy) and one Sturm count. No second implementation
   repeated any of these. Theorem H's identity was derived by hand (orbit bookkeeping of eight sign patterns) and checked
   exactly at 168 random instances; the Hermite inertia theorem for the Bezoutian is used as classical and was not
   re-derived. Theorem G assumes simple roots.
3. Execution and scope. The assigned server run did not take place (wrapper refusal under load); the local run has the
   assigned size (200 + 200 insertions, orders 64 to 128) but only inserted heights up to 60 (symmetric) and 8 (unpaired)
   and point families of c17. The DH and backward-heat rows of section 5.2 are model statements plus c17's measurements;
   the limit for DH was not carried out. The "inertia is a function of the wall signs" statement is measured for n = 3 only.
   The parity part of c17's measured law was found not to hold in the model in the stated form and was not resolved.
   No independent referee has read this file.

## 9. Proposed rows and notes (not entered)

- Row D10, addendum: "M = M_0 Xi(u)/Xi(u+1), M_0 = (u+1)/(u-1): zeta's apex kernel is a limit of rational-model kernels of
  symmetric zero sets (Lemmas L1, L2). Symmetric quartet: positive, rank 6, for all parameters (Theorem Q, exact).
  Pole-free base: positive for every insertion in Re a >= 0 and every degree (Theorem H). Closure of the row is equivalent
  in practice to X(d) for all d (model statement, open for d > 4; exact instances to d = 12)."
- Section 2 note on BLS in rank 2: BLS-sym passes for order 2 and 4 in the rational model as a theorem; a pole-free base
  does not detect BLS-left (theorem in the model).
- c17 inertia law: the parity clause should be restricted to the zeta-base measurement; in the model it fails in that form.
[Correction entered 2026-11-20 by lane c19-repair-owed-record-r18-checkpoint-prep, from REFEREE.md E-1: this note is withdrawn. With the model b = u (u - 1) g for an odd number of real zeros the rational model reproduces the parity clause in the cases tested; see the note in section 3.]

Files: `lib.py`, `quartet_lib.py`, `quartet_probe.py`, `quartet_theorem.py/.log/.json`, `quartet_signs.py/.log/.json`,
`quartet_f3.py/.log/.json`, `theorem_h.py/.log/.json`, `theorem_g_check.py/.log/.json`, `explore1.py` to `explore5.py`,
`model_inertia.py`, `model_inertia_A.log`, `model_inertia_BC.log/.json`, `model_extra.log/.json`, `limit_check.py/.log/.json`,
`server/` (`k2.py`, `search.py` from c17, `server_inertia.py`), `inertia_64_96_128.jsonl/.log`, `lanes.jsonl`.
