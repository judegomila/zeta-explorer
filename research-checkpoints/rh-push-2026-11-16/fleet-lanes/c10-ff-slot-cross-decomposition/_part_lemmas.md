## 2. First lemma: the slot split of the exact row energy

Conventions of `ffx.c` (rounds 7 to 9; copied unchanged): q = 1 mod 6 prime, chi_0 of order 6 on F_q^*,
chi_c(x) = chi_0(Res(c, x)), g_3(1, c) = G_2^(deg c) zeta_6^(g(c)) for squarefree monic c. Rows m monic of degree d;
marks = all primes P of degree lam; cofactors A' squarefree of degree N; vector u on the cofactors. **Long marks:
lam > N and lam > d**, so P divides neither A' nor m and A = P A' has one representation. Units G_2^(N+lam); every
row value is in Z[zeta_6].

    R(m) = sum_P R^P(m),      R^P(m) = sum_{A'} zeta_6^(g(P A')) u(A') chi_{P A'}(m).

**Lemma X1 (slot form; the model form of Lemmas S1, S2 of `c9-mv6-window-statement`) [PROVED-rel the phase
formula of g_3 in `ffx.c` (round 7) and multiplicativity of the resultant; EXACT-checked].** With l(c) = log of
chi_0 at the discriminant of c,

    zeta_6^(g(P A')) = kappa zeta_6^(g(P)) zeta_6^(g(A')) xi_P(A'),        xi_P(A') = chi_0(Res(P, A'))^4,

kappa a sixth root of unity depending on (q, N, lam) only. Hence

    R^P(m) = kappa zeta_6^(g(P)) chi_P(m) sum_{A'} u(A') zeta_6^(g(A')) xi_P(A') chi_{A'}(m):

the block of the marked prime P is chi_P(m) times the unmarked row of length N for the vector u xi_P, and xi_P is
a cubic Dirichlet character of A' of modulus P.
Proof. disc(P A') = disc(P) disc(A') Res(P, A')^2 up to the sign (-1)^(N lam), and g(c) = 5 l(c) + 3 sg(deg c) mod 6
(`gphase`), so g(P A') - g(P) - g(A') = 10 log chi_0(Res(P, A')) + constant, and chi_0^10 = chi_0^4. QED
Check: the kernel compares the factorised phase with the phase of the product polynomial on every pair when
np q^N <= 300000 (`ffx en`), and the brute force of this lane (below) uses the product polynomial only.

**Lemma X2 (identity) [PROVED; EXACT-checked].** Let V be a subspace of the functions of m with orthogonal
projection Pi. Put

    E  = sum_m |R(m)|^2                          D  = sum_P sum_{A'} |u(A')|^2 #{m : (m, A') = 1}     (diagonal)
    SD = sum_P sum_m |R^P(m)|^2                  CR = sum_{P != P'} sum_m R^P(m) conj(R^P'(m))        (cross term)
    B  = |Pi R|^2                                SB = sum_P |Pi R^P|^2
    CRcoh = B - SB = sum_{P != P'} <Pi R^P, Pi R^P'>,       CRperp = CR - CRcoh.

Then E = SD + CR and E = D + (SD - D) + CRperp + CRcoh, with B = SB + CRcoh. Also CR - B = E_perp - SD, where
E_perp = E - B >= 0: in units of D, c - beta = n - s.
Proof. Expand the square of sum_P R^P; Pi is an orthogonal projection. QED
The span used: V_0 = span{v_0, v_1}, v_0 = 1, v_1(m) = sum_{a in F_q} chi_0(m(a)) (d >= 2; v_1 = 0 for d = 1). These
are the sextic Gauss-sum rows of rounds 7 and 8: c_0 = v_0 and c_1(m) = sum_{deg c = 1} g_6(m, c) = G_1 conj(v_1(m))
(direct evaluation of g_6(m, T - a); EXACT-checked against the definition of g_6, `ffx bfck`). For d <= 3 the probes
k <= d/2 of round 8 are k = 0, 1, so B/D is the exact value of the quantity that the round-8 law B_coh approximates.

**Lemma X3 (the slot-diagonal part is the diagonal for long marks) [PROVED; CLASSICAL input: Weil].**

    SD - D = sum_{A_1 != A_2} u(A_1) conj(u(A_2)) zeta_6^(g(A_1) - g(A_2)) T_d(A_1, A_2) Pi_lam(A_1, A_2),
    T_d = sum_{m monic, deg d} chi_{A_1}(m) conj(chi_{A_2}(m)),       Pi_lam = sum_{P prime, deg lam} xi_P(A_1) conj(xi_P(A_2)).

P -> xi_P(A_1) conj(xi_P(A_2)) is a Dirichlet character modulo lcm(A_1, A_2) of order 3, non-principal for A_1 != A_2
(at a prime dividing exactly one of A_1, A_2 its component is the norm residue character of order 3). Its L-function
is a polynomial of degree at most 2N - 1 with inverse roots of modulus at most q^(1/2), so
|sum_{deg f = lam} Lambda(f) psi(f)| <= (2N - 1) q^(lam/2); the prime powers contribute at most 2 q^(lam/2). Hence

    |Pi_lam| <= (2N + 1) q^(lam/2) / lam,        |SD - D| <= (2N + 1) (q^(lam/2)/lam) sum_{A_1 != A_2} |u(A_1) u(A_2)| |T_d(A_1, A_2)|,

and with |T_d| <= q^d: |s - 1| <= (2N + 1) q^(lam/2) q^d nsupp^2 / (lam pi(lam) sum_{A'} cop_d(A')), of order
(2N + 1) q^(N - lam/2). For the vector `one` at q = 7, N = 2, d = 2 this is 0.27 at lam = 7 and 2.1e-3 at lam = 12.
So for lam - 2N large the excess over the diagonal is the cross term: e - 1 = c + O(N q^(N - lam/2)). QED
The measured values are far below the bound: for the same vector and d, s - 1 = +9.2e-4 at lam = 7 (bound 0.27), -1.8e-4 at lam = 9 (0.039), +3.9e-5 at lam = 11 (0.0055).
For completed rows (N = 3) the cube columns (P, n), (P, n') of one block are not orthogonal for d = 1 and their product does not depend on P, so the lemma does not apply to them: for lam >= 7, s - 1 is between -0.14 and +0.02 at d = 1 (-0.14 for `one` and `mu` at q = 7, whose cube term vanishes, V = 0, while its columns are counted in D) and within 2e-3 at d = 2. For the squarefree rows the lemma applies as stated.

**Lemma X4 (slot signs) [PROVED].** For independent signs eps_P = +-1 on the marked primes, the mean of the
energy of sum_P eps_P R^P is SD. So a vector with random slot signs sits at SD = D(1 + o(1)) on average: the
control that removes the cross term and nothing else.

**Remark X5 (rows of degree 1) [PROVED].** If u is invariant under T -> T + t (the vectors `one` and `mu`), then
R(m(T + t)) = R(m(T)) (substitute in P and A'; discriminants and resultants are invariant). For d = 1 the row
vector is then a multiple of v_0, so E = B exactly (n = 0).

**Exact checks (all before PREREG.md; `check_slot_ff.py`, `check_slot_ff.log`).** Independent brute force in python
from the definitions (phase of the product polynomial P A', resultants of the product, the cross term as an
explicit double sum over pairs P != P') against the kernel `ffs ens`:

| q | (N, lam, d) | rows | primes | weights | integers compared per weight | outcome |
|---|---|---|---|---|---|---|
| 7 | (2, 3, 2) | squarefree = completed | 112 | 8 | E, D, SD, norm(J_0), norm(J_1), SB_0, SB_1; Gram, J, M (20 integers); E = SD + explicit CR | all equal |
| 7 | (2, 3, 1) | same | 112 | 8 | same | all equal |
| 7 | (2, 4, 1) | same | 588 | 8 | same | all equal |
| 7 | (2, 4, 2) | same | 588 | 8 | same | all equal |
| 7 | (3, 4, 1) | completed (cube term) | 588 | 8 | same, with the 4-vector span (72 integers) | all equal |
| 7 | (3, 4, 2) | completed (cube term) | 588 | 8 | same | all equal |

Weights: one, a, b, mu, aligned, random phases, a and mu with slot signs. (2, 4, 3) was started and stopped (the
explicit pair sum in python is too slow at d = 3); not counted. c_1 = G_1 conj(v_1): 49 of 49 rows (d = 2) and 7 of 7
(d = 1) equal as exact histograms. Kernel totals against c9: E of `ffs ens` equals the `ffw enw` sum of norms on
(2, 7, 2) for six weights, and inside every run the total row rebuilt from the per-prime rows is compared with the
histogram row of the c9 code path (the run aborts on a difference). Server build against local build: 40 output
lines identical (`validate_mac.txt`). The completed energy of (3, 6, 1), target a, is 43347955/40905592 = 1.0597
(c9 pivot table: 1.06).
