# c19-d10-xd-determinant-pole-term-lemma-q: statement X(d), the pole term, and the inertia of the rank-2 apex kernel (row D10, cell U6 (g))

Internal working note, 2026-11-19/20, round 19, attack lane (kind: deepen; combinable 3 of round 18). Inputs:
`c18-d10-inertia-law-theorem-t-lemma-d` (statement X(d), Theorem Q, Theorem H, Theorem G, Lemmas L1 to L3, with its
REFEREE.md), `c18-exact-relation-rigidity-klein-spinor` (Lemma Q: the pole clause is the only carrier), map row D10 and the
section 2 notes on BLS in rank 2. RH is open. **No statement about zeros of zeta is made.** No independent referee has
read this file.

Labels: PROVED (complete argument in this file) / PROVED-exact (exact integer or rational computation at the listed
configurations) / CLASSICAL / MEASURED / OPEN.

## 0. Verdict

**Partial result with a named failing step. X(d) is not proved for all even d; row D10 is not closed as PROVED. No
counterexample exists among the exact tests: 220 symmetric configurations, d = 6 to 16, all positive
semidefinite of rank d(d-1)/2. All four requirement flags are false; the headline does not move.**

1. **Decisive test (PROVED-exact at each configuration; section 2).** Exact integer arithmetic, a second implementation
   independent of c18's code. Symmetric sets (generic, near the strip boundary, near-degenerate, confluent, near-confluent,
   all-real, all on the line): 220 configurations, d = 6, 8, 10, 12, 14, 16 (60, 50, 40, 32, 22, 16); positive semidefinite of rank d(d-1)/2 in 220 of 220; no counterexample. Controls: 60 non-symmetric sets with the pole: the negative index equals the
   number of left zeros with multiplicity deficit in 60 of 60 (negative squares present in 50, as the law requires); 60 sets with the pole removed (base -1 and
   base +1, symmetric and not): positive semidefinite in 60 of 60.
2. **Lemma 1 (PROVED): the term X of c18's Theorem H is identically zero.** Hence
   2 N = A[ L(x_1,y_1) L(x_2,y_2) b(x_12) b(y_12) ] = A[ L(x_1,y_1) L(x_2,y_2) b(-x_12) b(-y_12) ]:
   N is one half of the form Q = L (x) L (tensor square of the one-variable Bezoutian) restricted to an explicit subspace
   J^- of the n^2-dimensional jet space. This is the Bezoutian factorisation asked for by the assignment.
3. **Theorem 2 (PROVED): orthogonality and duality.** The same 36-term sum without the signs, N^+, is one half of Q on a
   subspace J^+, and J^+ is Q-orthogonal to J^-. With the pole, Q has inertia (d^2 + 1, 2d) (the pole term is a
   rank-one update of L, hence a rank-2d update of Q). Consequence: neg(N) + neg(N^+) + z <= 2d, z the dimension of
   the radical of N on J^-.
4. **Theorem 3 (PROVED): concentration in general position.** For simple zeros with no partner pair
   (a_j + a_k != 1 for all j, k), the negative index of N equals the negative index of the finite Gram matrix of N on
   the 2d + 1 crossing points (1,1), (1,-a_j), (-a_j,1), which lie on the two pole lines z_1 = 1 and z_2 = 1. This is
   the "update plus Sylvester" lemma of the assignment in the form that is true: the update has rank 2d, not 1 or 2.
5. **The failing algebraic step (PROVED that it fails).** At a symmetric set the 2d crossing points (1,-a_j), (-a_j,1)
   are null vectors of N (the normalising factor b(a_j - 1) vanishes exactly when 1 - a_j is a zero), so Theorem 3
   gives no information there: the points that carry the negative squares in general position are exactly the ones that
   degenerate on the symmetric locus.
6. **Theorem 4 (PROVED): reduction of X(d) to a one-variable statement NL(d).** For a symmetric set with simple zeros,
   z >= d. Hence X(d) follows from NL(d): "the sign-free kernel N^+ has at least d negative squares", and it is enough
   to find them on the pole line lam = (1, z), where N^+ is a three-term one-variable kernel. NL(d) is PROVED-exact at
   all 220 symmetric configurations of the plan (inertia of N^+ on the pole line is (1, d) in 220 of 220), which is a
   second, independent certificate of N >= 0 at the 166 of them that have simple zeros. NL(d) for all d is OPEN.
7. Row D10: stays "tried, not closed". X(d): PROVED for d = 2, 4 (c17, c18); PROVED-exact at 220 further
   configurations up to d = 16; reduced to NL(d). zeta's inertia law would follow only in the model sense of c18
   (Proposition L3), and only from X(d) for every d.

## 1. Plan, sources, what is new

Read: BRIEF to the end; row D10 and the BLS notes; c18 RESULT.md and REFEREE.md (statement X(d), Theorem Q, Theorem H,
Theorem G, L1 to L3; the referee's correction E-1 on odd degree is respected: only even d and conjugate-closed sets are
used); c18-klein-spinor Lemma Q.

Plan: (1) the decisive exact test first; (2) the first lemma: a factorisation of N in which the pole term is an update
of a kernel with known inertia; (3) inertia by Sylvester; (4) controls.

New relative to c18: X = 0 and the one-term Bezoutian formula (Lemma 1); the realisation of N and N^+ as restrictions of
L (x) L to orthogonal subspaces and the inertia inequality (Theorem 2); the concentration theorem and its Schur form
(Theorem 3); the radical bound and the reduction to NL(d) (Theorem 4); the pole-line identity N + N^+ = 2 G_E with at
most one positive square (Lemma 5); the exact test to d = 16 with degenerate families; the dual certificate.

Requirements as planned: none can be earned (the device has no primes; symmetric off-line quartets pass).

## 2. Decisive test (PROVED-exact; `xd.py`, `campaign.py`, `run_d.py`, `analyse.py`)

Setting as in c18 section 2: b real of degree n = d + 1, psi(x) = b(x_1) b(x_2) b(x_12), N(lam, mu) = sum over w, w' in
S_3 of sgn(w) sgn(w') psi(w lam) psi(w' mu)/(nu_1 nu_2), nu = w lam + w' mu. Base with the pole: b = (u - 1) g,
g(u) = prod (u + a_j). Symmetric set: closed under a -> 1 - a and conjugation, 0 < Re a < 1; then g(-1 - u) = g(u).
X(d): N is positive semidefinite for every symmetric set of d zeros.

Method (independent of c18's `lib.py`; no rational fit). N = Delta(lam) Delta(mu) v(lam)^T H v(mu) on the m invariant
monomials of weighted degree at most 3(n - 1) (c18 Lemma P). The Gram matrix G = [6 N(p_i, p_j)] on m integer points of
the open chamber is computed without poles from the Bezoutian identity (integer matrices only); the evaluation matrix
V has rank m (checked exactly per degree), so G = V H V^T is congruent to H. Inertia of G: fraction-free (Bareiss)
elimination with symmetric diagonal pivoting, exact; the rank is cross-checked against flint's exact rank. Self-test
against seven values of c18 and its referee (quartet (6, 0); quartet outside the strip (4, 2); unpaired left pair
(1, 2), base -1 (1, 0), base +1 (3, 0); d = 6 instance (15, 0); b = u - 1: N = 0): all reproduced.

Configurations (`campaign.py`, seed 20261119): random mixes of quartets 1/2 +- eta +- i g, real pairs 1/2 +- eta and
pairs 1/2 +- i g, in seven categories: generic (eta = p/2q, q <= 12; g in (1/20, 40)); boundary (eta = 1/2 - 2^-k,
k = 4..12); degenerate (eta = 2^-k or g = 2^-k, k = 3..12); confluent (factors repeated 2 or 3 times, double zero at
1/2, real pair doubled, line pair doubled); near-confluent (two factors differing by 2^-k, k = 4..12); all real; all on
the line.

| d | n | order m of the Gram matrix | configurations | positive semidefinite | rank = d(d-1)/2 | negative squares found |
|---|---|---|---|---|---|---|
| 6 | 7 | 37 | 60 | 60 | 60 (15) | 0 |
| 8 | 9 | 61 | 50 | 50 | 50 (28) | 0 |
| 10 | 11 | 91 | 40 | 40 | 40 (45) | 0 |
| 12 | 13 | 127 | 32 | 32 | 32 (66) | 0 |
| 14 | 15 | 169 | 22 | 22 | 22 (91) | 0 |
| 16 | 17 | 217 | 16 | 16 | 16 (120) | 0 |
| total | | | 220 | 220 | 220 | 0 |

By category: generic 45, boundary 45, confluent 43, real 22, near-confluent 22, degenerate 22, line 21; all positive
semidefinite. 166 configurations have simple zeros, 54 have repeated zeros. No rank anomaly: the rank is d(d-1)/2 also at
confluent sets, at double zeros at 1/2, and at distance 2^-12 from the boundary of the strip and from the line.

Controls (same code, same run):

| control | cases | result |
|---|---|---|
| non-symmetric sets, base with the pole (symmetric part of degree 0 to 6 plus 1 to 3 unpaired conjugate pairs or pairs of real zeros; d = 2..12) | 60 | negative index = number of left zeros with multiplicity deficit in 60 of 60; rank = n(n-1)/2 minus the number of partnered zeros in 60 of 60; 50 have negative squares (the law fails as it must); the 10 positive ones have no unpaired left zero |
| pole removed: base -1 (b = g) and base +1 (b = u g), symmetric sets and sets with unpaired zeros, d = 2..10 | 60 | positive semidefinite in 60 of 60 (30 + 30), as Corollary H1 of c18 states for every degree |

Execution. Server unit `rh-c19d10-xd-1120064327` (rhrun, 8 cores, 12 GB; a first unit `rh-c19d10-xd-1120063945`
failed at start because the copy had not arrived, a zsh expansion in the rsync target, no computation ran). The server
ran at roughly one third of the local speed under load (520 to 1,100 s per d = 16 configuration), so the configurations
with d <= 14 were run locally through `scripts/memcap.sh 8` (6 workers; d <= 12: 302 configurations in 101 s; d = 14:
22 configurations in 406 s). The server unit completed the whole plan (340 configurations, 2,423 s, no error; d = 16: 520 to 1,380 s each, Gram order 217, rank 120). The 324 configurations run on both machines agree in rank and inertia in 324 of 324. A local attempt to rerun six d = 16 configurations with 6 workers was killed by the 8 GB cap and was not repeated (the server had already produced them). No unit of this lane is running.

## 3. Algebra

Notation. L(x, y) = [b(x) b(y) - b(-x) b(-y)]/(x + y) (polynomial; Bezoutian of b for u -> -u). a(nu) = 1/(nu_1 nu_2).
For characters chi, chi' of W = S_3 (trivial or sign) and a function F(x, y),
S_{chi,chi'}[F](lam, mu) = sum over w, w' of chi(w) chi'(w') F(w lam, w' mu). So N = S_{sgn,sgn}[psi psi a]. Put
N^+ = S_{1,1}[psi psi a] (the same 36 terms without signs; a polynomial by the argument of c18 Lemma P (a)).
W acts by s_1 (z_1, z_2) = (-z_1, z_12), s_2 (z_1, z_2) = (z_12, -z_2); c_1 (z_1, z_2) = (z_2, -z_12) and
c_2 = c_1^-1 = (-z_12, z_1) are the rotations; w_0 (z_1, z_2) = (-z_2, -z_1).

### 3.1 Lemma 1 (PROVED; checked exactly in `pieces.py`, `conc.py`, `dual.py`)

For every real polynomial b and chi, chi' in {1, sgn}:

    S_{chi,chi'}[ L(x_1,y_1) L(x_2,y_2) b(-x_12) b(-y_12) ] = (1 + chi chi'(w_0)) S_{chi,chi'}[psi psi a],
    S_{chi,chi'}[ L(x_1,y_1) L(x_2,y_2) b( x_12) b( y_12) ] = (1 + chi chi'(s_1)) S_{chi,chi'}[psi psi a].

So both expressions equal 2N for (sgn, sgn), 2N^+ for (1, 1), and 0 for the mixed pairs. In particular the term X of
c18 Theorem H vanishes identically and 6N = A[LL_+ + 2 LL_-] is the sum of two copies of 2N = A[LL_+] = A[LL_-].

Proof. Expanding the two Bezoutians, L(x_1,y_1) L(x_2,y_2) b(-x_12) b(-y_12) = sum over e_1, e_2 = +-1 of
e_1 e_2 psi_e(x) psi_e(y) a(x + y), psi_e(x) = b(e_1 x_1) b(e_2 x_2) b(-x_12). Three of the four patterns are psi composed
with an element of W: (-,+,-) = psi o c_1, (+,-,-) = psi o c_2, (-,-,-) = psi o w_0. For F = (phi o v)(x) (phi o v)(y) a(x+y)
the substitution w -> v^-1 w, w' -> v^-1 w' gives S[F] = chi chi'(v) S[phi phi (a o v^-1)]. Now a o w_0 = a, and
a o c_1 + a o c_2 = -1/(nu_2 nu_12) - 1/(nu_1 nu_12) = -a. The coefficients e_1 e_2 are -1, -1, +1, so the three patterns contribute
-S[psi psi (a o c_2 + a o c_1)] + chi chi'(w_0) S[psi psi a] = (1 + chi chi'(w_0)) S[psi psi a] (the rotations are even, so
chi chi' = 1 on them).
The fourth pattern (+,+,-), psi_dag(x) = b(x_1) b(x_2) b(-x_12), is invariant under the rotations
(psi_dag(c_1 x) = b(x_2) b(-x_12) b(x_1)). Substituting w -> c w, w' -> c w' for the three rotations c and averaging,
S[psi_dag psi_dag a] = (1/3) S[psi_dag psi_dag (a + a o c_1 + a o c_2)] = 0, because a + a o c_1 + a o c_2 = 0. The
second line is the same computation with the patterns (+,+,+) = psi, (-,+,+) = psi o s_1, (+,-,+) = psi o s_2 and the
rotation-invariant (-,-,+) (c18's psi_*), using a o s_1 + a o s_2 = -a. QED.

Checks: X = 0 exactly for random b of degree 1 to 3; 2N = Q(j^-, j^-) at rational points for 13 root sets (`conc.py`);
mixed Gram matrices identically zero for 14 configurations up to n = 9 (`dual.py`, column cross_zero).

### 3.2 Jet space, Theorem 2 (PROVED)

Let P_n be the real polynomials in (x_1, x_2) of degree < n in each variable (dimension n^2), Jt its dual, ev_x in Jt
the evaluation at x. Q is the symmetric bilinear form on Jt with Q(ev_x, ev_y) = L(x_1,y_1) L(x_2,y_2) (its matrix in
the dual monomial basis is the tensor square of the coefficient matrix of L). Put

    j^-_lam = sum over w of sgn(w) b(-(w lam)_12) ev_{w lam},     j^+_lam = sum over w of b(-(w lam)_12) ev_{w lam},

J^- = span of the j^-_lam, J^+ = span of the j^+_lam. Lemma 1 reads

    Q(j^-_lam, j^-_mu) = 2 N(lam, mu),    Q(j^+_lam, j^+_mu) = 2 N^+(lam, mu),    Q(j^+_lam, j^-_mu) = 0.

So the inertia of the kernel N is the inertia of Q on J^-, that of N^+ is the inertia of Q on J^+, and J^+ lies in the
Q-orthogonal complement of J^-.

Inertia of Q with the pole (CLASSICAL plus c18). For b = (u - 1) g with all a_j in Re a > 0, a_j != 1:
L_b = (x - 1)(y - 1) L_g - 2 g(-x) g(-y) (c18 section 3.4), L_g is positive semidefinite of rank d (Hermite), L_b has
rank n = d + 1 (b(x), b(-x) coprime), so L_b has inertia (d, 1) and Q = L (x) L has inertia (d^2 + 1, 2d), nondegenerate.
**This is the exact sense in which the pole term is a low-rank update: rank one on L, rank 2d on Q.** Without the pole
(b = g) Q is positive definite and N, N^+ are positive semidefinite (this reproves Corollary H1).

Linear algebra (CLASSICAL). Let Q be nondegenerate of inertia (p, q) on a real space, J a subspace, R = J cap J^perp,
z = dim R. Then J + J^perp = R^perp, the form induced on R^perp/R has inertia (p - z, q - z), and R^perp/R is the orthogonal
sum of J/R and J^perp/R. Hence neg(J) + neg(J^perp) + z = q and pos(J) + pos(J^perp) + z = p.

**Theorem 2.** For the base with the pole (a_j in Re a > 0, a_j != 1):

    neg(N) + neg(N^+) + z <= 2d,     pos(N) + pos(N^+) + z <= d^2 + 1,     z = dim of the radical of Q on J^-.

Proof: J^+ is contained in (J^-)^perp, so neg(N^+) <= neg((J^-)^perp). QED.

MEASURED (14 configurations, `dual.py`): dim J^- = n(n-1)/2 and dim J^+ = n(n+1)/2 in every case, symmetric or not, so
J^+ = (J^-)^perp and both lines are equalities. Examples: symmetric quartet Q (17, 8), N (6, 0), N^+ (7, 4), z = 4;
two quartets Q (65, 16), N (28, 0), N^+ (29, 8), z = 8; left pair N (1, 2), N^+ (4, 2); right pair N (3, 0), N^+ (2, 4);
quartet outside the strip Q (13, 12), N (4, 2), N^+ (5, 6), z = 4. In the generic all-left chamber this gives c18's
remark that the inertia is that of the second exterior power of (d, 1). Also MEASURED (`bez2.py`): the diagonal kernel
sum over w of psi(wx) psi(wy) a(w(x+y)) has trivial plus sign isotypic parts of total inertia equal to that of Q, and
its two-dimensional isotypic part has twice that; (`tau.py`) for 9 random real root sets with n <= 4 the crossing-point
Gram matrix of c18 Theorem G is (C (x) C)(1 - tau) with tau an involution, rank(1 - tau) = n(n-1)/2.

### 3.3 Crossing identity and Theorem 3 (PROVED)

Crossing points p_ij = (r_i, r_j), r_0 = 1, r_j = -a_j. **Crossing identity:** for every mu,

    N(p_ij, mu) = b(-r_i - r_j) Q(ev_{p_ij}, j^-_mu).

Proof. For a root r, L(x, r) = -b(-x) b(-r)/(x + r). So Q(ev_{p_ij}, j^-_mu) = b(-r_i) b(-r_j) A_mu[psi(w_0 x)/((x_1 + r_i)(x_2 + r_j))]
= -b(-r_i) b(-r_j) A_mu[psi(x)/((x_1 - r_j)(x_2 - r_i))] (substitute x -> w_0 x), and N(p_ij, mu) = -D_ij A_mu[q_ij],
q_ij = psi(x)/((x_1 - r_j)(x_2 - r_i)), D_ij = b(-r_i) b(-r_j) b(-r_i - r_j), by the first step of the proof of c18 Theorem G. QED.
Equivalently v_ij = 2 b(-r_i - r_j) ev_{p_ij} - j^-_{p_ij} = j^+_{p_ij} is Q-orthogonal to J^- (checked exactly for all n^2
pairs at 13 root sets, `conc.py`, column "v in Jperp").

**Theorem 3 (concentration).** Let the zeros be simple, conjugate-closed, Re a_j > 0, a_j not in {1, 2}, and
a_j + a_k != 1 for all j, k (j = k included). Let I = {(0,0)} with (0,j), (j,0), j = 1..d (2d + 1 crossing points, all
on the pole lines z_1 = 1 or z_2 = 1). Then z = 0 and

    neg(N) = negative index of the (2d+1) x (2d+1) Hermitian matrix [ N(p_a, conj p_b) ], a, b in I.

By c18 Theorem G its entries are explicit: Cauchy terms 1/((r_i + r_k)(r_j + r_l)), 1/(r_i + r_j + r_k) and diagonal terms.

Proof. Jt_0 = span of ev_{p_a}, a in I, equals ev_1 (x) V* + V* (x) ev_1 (V* the one-variable jets; the ev_{r_j} are a basis
of V*). With P = the L-orthogonal complement of ev_1 in V* (positive definite, since L has inertia (d, 1) and
L(1, 1) = -b(-1)^2/2 < 0), Jt_0 = ev_1 (x) ev_1 + ev_1 (x) P + P (x) ev_1, an orthogonal sum of signs (+, -^d, -^d): negative
index 2d. By the hypothesis beta_a = b(-r_i - r_j) != 0 for a in I, so ev_{p_a} = u'_a + u''_a with
u'_a = j^-_{p_a}/(2 beta_a) in J^- and u''_a in (J^-)^perp (crossing identity). The Gram matrices satisfy G' + G'' = G
(Gram of the ev_{p_a}), so neg(G') + neg(G'') >= neg(G) = 2d, while neg(G') <= neg(J^-), neg(G'') <= neg((J^-)^perp) and
neg(J^-) + neg((J^-)^perp) = 2d - z. Hence z = 0 and neg(N) = neg(G'), G' = [N(p_a, p_b)/(2 beta_a beta_b)]. QED.

Checks (`conc.py`, `check_t6.py`): 9 random real root sets, d = 1..4: equal in 9 of 9. The 60 non-symmetric control
configurations: the negative index of the Gram matrix of N on integer points of the two pole lines and (1,1) equals
the full exact negative index in 60 of 60 (15 of them satisfy the hypothesis; the other 45 contain partner pairs or
repeated zeros and are MEASURED outside the theorem).

Relation to the assignment's first lemma. The lemma asked for N as a rank-one or rank-two update of a kernel of known
inertia. That form is not available: in the all-left chamber N has d negative squares (c18), and on Jt the pole
produces 2d negative squares. What holds is: N = (1/2) Q on J^-, Q = (pole-free positive form) minus a rank-2d form, and
in general position all negative squares of N are seen on the 2d + 1 points of the pole lines (Sylvester on a finite
explicit matrix).

### 3.4 The failing step at symmetric sets (PROVED)

For a symmetric set, b(-r_0 - r_j) = b(a_j - 1) = (a_j - 2) g(a_j - 1) = (a_j - 2) g(-a_j) = 0. So the hypothesis of
Theorem 3 fails at every j, the crossing identity gives N(p_0j, .) = N(p_j0, .) = 0, and j^-_{p_0j}, j^-_{p_j0} lie in the
radical R. The 2d points that carry the negative squares in general position are null on the symmetric locus, and
the projections of ev_{p_0j} onto J^- (which are j^-_{p_0j}/(2 beta), beta -> 0) diverge as a set approaches it. A
neighbouring non-symmetric set always has negative squares (every left zero is unpaired), so no limit from sets with
neg = 0 is available either. This is the precise algebraic step at which the update-plus-Sylvester route stops.

### 3.5 Theorem 4: radical bound and reduction to NL(d) (PROVED)

**Lemma 4 (z >= d).** For a symmetric set with simple zeros the d vectors
j^-_{p_0k} = -[ b(a_k) ev_{(-1, 1-a_k)} + b(-1) ev_{(1-a_k, a_k)} + b(1-a_k) ev_{(a_k, -1)} ] are linearly independent elements of R.
Proof. They are in R by 3.4. Simple zeros of a symmetric set of even degree exclude a = 1/2. The polynomial
f_k = (x_1 + 1) prod over j != k of (x_1 - a_j) times (x_2 - 1 + a_k) has degree d < n in x_1 and 1 < n in x_2. It vanishes at
(-1, 1 - a_j) for all j; at (1 - a_j, a_j) for all j (the product vanishes unless j is the partner of k, where the last
factor vanishes); at (a_j, -1) for j != k. Its value at (a_k, -1) is (a_k + 1)(a_k - 2) prod over j != k of (a_k - a_j) != 0, and
b(1 - a_k) = -a_k g(1 - a_k) != 0. So j^-_{p_0j}(f_k) is non-zero exactly for j = k. QED.

**Statement NL(d).** For every symmetric set of d simple zeros in the open strip, the kernel N^+ of b = (u - 1) g has at
least d negative squares.

**Theorem 4.** NL(d) implies X(d) (for confluent sets by closure: N depends continuously on the coefficients of g and
simple symmetric sets are dense in symmetric sets). More precisely, at each symmetric set with simple zeros:
neg(N) <= d - neg(N^+).
Proof. Theorem 2 with z >= d. QED.

To verify NL at a configuration it is enough to exhibit d negative squares of any Gram matrix of N^+. On the pole
line lam = (1, z) only three of the six terms of j^+ and of the 36-term sum survive (w = s_1, c_1, w_0, since b(1) = 0):

    N^+((1,z),(1,z')) = b(-1)^2 sum over alpha, beta in {1,2,3} of u_alpha(z) u_beta(z')/D_alpha,beta(z, z'),
    u_1 = b(z) b(1+z) at (-1, 1+z),  u_2 = b(z) b(-1-z) at (z, -1-z),  u_3 = b(-z) b(-1-z) at (-z, -1),

D the product of the two coordinate sums. For a symmetric set every u_alpha is divisible by g(z) and the remaining
factors are z(z-1) g(z+1), -(z-1)(z+2) g(z), (z+1)(z+2) g(z-1): a three-term kernel in the shifts g(z+1), g(z), g(z-1).
(This is the T = 0 form attached to the residue of the model Eisenstein series at the pole, the degenerate series.)

PROVED-exact (`line_all.py`, `line_all.jsonl`): at all 220 symmetric configurations of the plan (d = 6..16), the Gram
matrix of N^+ on n + 8 integer points of the pole line has inertia exactly (1, d); that of N has (d - 1, 0). For the
166 configurations with simple zeros this proves N >= 0 by Theorem 4, a certificate that uses a (d+9) x (d+9) matrix of
a different kernel and none of the code path of section 2 beyond the Bezoutian matrix and the elimination routine. Run
time for all 220: 2 s.

MEASURED (`linepts.py`, real symmetric sets d = 2, 4, 6 and two non-symmetric ones): the Gram matrix of N^+ at the d
points (1, a_j), and at six other d-point sets on the pole line, is negative definite.

### 3.6 Lemma 5: the pole-line identity (PROVED)

Split j^+-_lam = E_lam +- O_lam, E_lam the sum over the three rotations, O_lam over the three reflections. Orthogonality
of J^+ and J^- gives Q(E_lam, E_mu) = Q(O_lam, O_mu) and Q(E_lam, O_mu) symmetric, hence N + N^+ = 2 Q(E_lam, E_mu) everywhere.
On the pole line E_(1,z) = b(-1-z) ev_1 (x) ev_z + b(z) ev_{-1-z} (x) ev_1 lies in Jt_0, whose positive index is 1. So
**(N + N^+) restricted to the pole line has at most one positive square**, for every b with the pole.
Exact check: Gram(j^+) + Gram(j^-) = 4 Gram(E) and pos(Gram(E)) <= 1 in 220 of 220.
Consequence: if N restricted to the pole line is positive semidefinite, then N^+ on the pole line has at most one
positive square, and NL(d) follows from rank(N^+ on the pole line) >= d + 1. So X(d) follows from two one-variable
statements: (a) X(d) on the pole line; (b) that rank bound. Neither is proved for general d.

## 4. Where it stops

NL(d) (or the pair (a), (b) of 3.6) for general even d. It is a statement about a one-variable three-term kernel built
from g(z+1), g(z), g(z-1) with g(-1-u) = g(u) and zeros in the strip; rank-one tools (Hermite-Biehler, Cauchy index of a
ratio) are the natural candidates. Two attempts made here do not close it: (i) the Loewner part of the two-term
restriction at z = a_j is a Bezoutian whose own signature is near zero for non-real zeros, so negativity is an
interplay of the three terms, not termwise; (ii) at the points z = -a_j the Gram matrix is minus two positive Cauchy
matrices plus a rank-two term plus diagonal terms of the residue type (b'(r_j) factors) whose signs alternate, so the
count "at most one positive eigenvalue" is not available there without more input. No induction on d was found; the
obstruction of c18 section 3.6 (a multiplier that is not a congruence) is unchanged.

One pivot was considered and not taken: the dual statement NL(d) is adjacent, was tested exactly, and is recorded
as the next target rather than started as a second lane.

## 5. Controls

| control | result | status |
|---|---|---|
| non-symmetric sets (law must fail) | fails: negative squares in 50 of 60, equal to the deficit count in 60 of 60; the 10 that pass have no unpaired left zero | PROVED-exact at 60 configurations; the mechanism (Theorem 3) PROVED in general position |
| pole removed (pole-free law) | positive semidefinite in 60 of 60, bases -1 and +1, symmetric or not | PROVED for every degree (c18 Corollary H1; reproved by 3.2: Q is positive) |
| symmetric quartets off the line (ZQ in rational form, BLS-sym) | pass in every exact test to d = 16 | PROVED-exact at the listed configurations; PROVED for d <= 4 (c18) |
| DH, backward heat | pole-free base: pass while the zeros stay in the closed strip (c18 H1), fail only through zeros with real part above 1 (model: 4 negative squares, c18) | unchanged from c18 |
| sign-twisted primes, unimodular twist, zeta(s+a)zeta(s-a), T-NR, Beurling, phase-rotated transfer operator, theta^w | not formulable on this carrier without a functional equation and cocycle (c16 section 5) | unchanged from c16/c18 |

The device does not separate zeta from any symmetric control. Its failures are failures of reflection symmetry of
left zeros or of the pole.

## 6. Requirement flags

- R1 false. No primes enter; the kernel depends on the zero set and the pole only (c18 L1).
- R2 false. No conclusion about zeros at any height.
- R3 false. Symmetric controls (off-line quartets included) pass every exact test; the two controls of the assignment
  behave as predicted, and both are structural properties zeta shares or lacks trivially (reflection symmetry, pole).
- R4 false. Statements about finite zero sets in a rational model; the limit of c18 L2 carries no information toward
  the critical line.

## 7. Three weakest steps

1. X(d) for all d is not proved. The reduction to NL(d) trades positivity of a form of rank d(d-1)/2 for d negative
   squares of a one-variable kernel, but NL(d) is open, and it is known only by exact computation at 220 configurations
   (heights up to 40, eta down to 2^-12 from the line and from the boundary). The reduction covers simple zeros; the
   confluent case is by closure and uses density of simple symmetric sets, stated without a written proof.
2. Proofs of Lemma 1, Theorem 2, the crossing identity, Theorem 3 and Lemma 4 are by hand (pattern bookkeeping, one
   linear-algebra lemma, c18's Theorem G first step and Hermite's theorem as classical). Each was checked exactly at
   random instances, but only by code written in this lane; complex zeros enter Theorem 3 through a Hermitian Gram
   matrix and that case was checked only through integer points on the pole lines, not at the crossing points
   themselves. dim J^+ + dim J^- = n^2 (so that Theorem 2 is an equality) is MEASURED at 14 configurations, not proved.
3. Execution. The exact test shares its elimination routine and Bezoutian matrix between the direct run and the
   dual certificate; the direct run was cross-checked against c18 and its referee at 7 values only. The d = 16 results exist from the server run only (one machine, one code path). The
   test set has no zero with imaginary part above 40 and no d above 16.

## 8. Proposed map entry

See `MAP_ROW.md` (row D10 addendum; the map is not edited here).

Files: `xd.py` (exact Gram and inertia), `campaign.py`, `run_d.py`, `analyse.py`, `results_local_d12.jsonl`,
`results_local_d14.jsonl`, `results_server.jsonl` (all 340 configurations), `analyse.log`, `server_unit.log`, `campaign_local.log`, `run_d14.log`, `run_d16.log` (the run killed by the cap), `line_all.py/.jsonl/.log` (dual
certificate), `dual.py` (Theorem 2 checks), `conc.py` (Lemma 1, crossing identity, Theorem 3 checks), `check_t6.py/.log/.json`,
`pieces.py`, `negspace.py`, `negspace_minus.py`, `negsub.py`, `line.py`, `linepts.py`, `bez2.py`, `tau.py` (exploration),
`MAP_ROW.md`, `lanes.jsonl`.
