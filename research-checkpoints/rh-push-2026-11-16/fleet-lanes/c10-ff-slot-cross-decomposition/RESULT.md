# c10-ff-slot-cross-decomposition: the model excess of the row mean square is the cross term over pairs of marked primes

Internal working note, 2026-11-19. Slug `c10-ff-slot-cross-decomposition`. Kind: combine (slot decomposition of
`c9-mv6-window-statement`, Lemmas S1, S2 + the exact F_q[T] code of `c9-mv6-ff-window-exact`). Not refereed. Nothing
committed, pushed or posted. Written: this directory and `~/rh-push/c10-ff-slot-cross-decomposition/` on the compute
server (through `rhrun`, 4 cores, 4 GB; both units inactive at the end, section 9).

This note makes **no statement about zeta** and none about zeros of any L-function. It is a function-field model
computation (where the Riemann hypothesis for the twist family is Weil's theorem) and one float estimate over
Z[omega]. 7/8 (unrefereed) stands; RH open. NO QED.

Labels: PROVED (argument given here) / PROVED-rel X / CLASSICAL / EXACT (equality of exact integers on the stated
cases) / MEASURED (ratios of exact integers, or floats where stated) / ARGUED / POST-HOC (found after the
pre-registered runs; not an advance prediction) / NOT-RUN / OPEN.

## Requirement answers, stated before the work and after

| flag | before | after | evidence |
|---|---|---|---|
| R1 multiplicativity essential | no | **no** | The split is an identity for any vector with the slot form (Lemma X1 uses the twisted multiplicativity of the Gauss sum, in the formula only). The class U (random multiplicative signs) is not separated from the target vector in 50 of 51 configurations. |
| R2 height-uniform, every window | no | **no** | Fixed q, degrees up to 14; no statement about zeros. |
| R3 every control fails structurally | no | **no** | Controls behave as the bookkeeping says (random phases and slot signs at the diagonal; Liouville-twisted and aligned vectors above); none fails where the target passes. |
| R4 reaches the critical line | no | **no** | A model computation inside the 7/8 architecture; no abscissa changes. |

What each side supplies: the slot decomposition supplies an identity that uses multiplicativity (R1 in the formula
only); the F_q[T] code supplies exact integers and the control classes. Neither supplies R2, R3 or R4. No flag rises.

## 0. Verdict

**Partial result (model statements) that removes the caveat of round-9 lesson 1. The model excess is the cross
term over pairs of distinct marked primes: proved for long marks, exact in every run. The cross term is a sum of
squared signals plus a remainder between -1 and about +1.5 diagonals; the sixth-power squared signal B_coh is the
largest of them for the first target and not for the second (pre-registered rule B fails at the largest size). The
Z[omega] screen and the model do not disagree: at the screen's geometry the model also shows no target excess; the
same term in the screen is predicted at 1.5e-4 to 3.2e-4 of the diagonal, 30 to 70 times below the screen's
resolution, and at the screen's geometry (P = Z^(1/3)) it decreases with the size.**

1. **First lemma (section 2; PROVED, EXACT-checked).** With lam > N and lam > d the row is R = sum_P R^P, the block
   of P being chi_P(m) times the unmarked row of length N for the vector twisted by the cubic character xi_P
   (Lemma X1, the model form of S1, S2). E = D + (SD - D) + CRperp + CRcoh and B = SB + CRcoh (Lemma X2). Verified in
   exact integers against an independent brute force with the cross term as an explicit double sum over pairs of
   primes: q = 7, N = 2, (lam, d) = (3, 1), (3, 2), (4, 1), (4, 2), and N = 3 completed rows (4, 1), (4, 2); eight
   vectors each; every integer equal.
2. **The excess is the cross term (Lemma X3, PROVED with Weil's bound; rule A HOLDS).** SD - D is a sum over pairs
   of cofactors of a prime sum of a non-principal cubic character, so |SD/D - 1| = O(N q^(N - lam/2)). Measured on
   288 vector-configurations with lam >= 7: |SD/D - 1| <= 2.4e-3; for lam >= 11: <= 6.5e-5. Target a at q = 7,
   (2, 12, 1): e = 20.639, Cross/D = 19.639, SD/D = 1 - 1.3e-5. At q = 13, (2, 7, 2): e = 2.335, Cross/D = 1.335.
3. **Cross against B_coh (rules B, C).** B = exact squared signal on the sextic Gauss-sum rows c_0, c_1 (the quantity
   the round-8 law approximates). It is carried by pairs of distinct primes: the per-prime part SB/D is at most
   0.51 of 2 dim/q^d (rule C HOLDS). Cross/D = B/D + n - SD/D with n = (E - B)/D >= 0 (identity). Rule B (the
   non-coherent cross n - (SD - SB)/D between -1.05 and +1.5 for a, b / c4, mu, class U): 593 of 596
   vector-configurations; **FAILS** in 3:
   q = 7 (2, 12, 1) for b (e = 7.47, B/D = 2.16, n = 5.31) and one U seed (n = 8.98), and (2, 11, 2) for mu (n = 2.62).
   For target a at (2, 12, 1): B/D = 19.43, CRcoh/CR = 0.982, n = 1.21. By the pre-registered outcome rule the
   label "EXCESS = COHERENT CROSS" is **not** awarded; the excess is the cross term, and B_coh is one of its parts.
4. **The other part (POST-HOC, section 4).** The three violations are a second squared signal, in the direction
   m -> u(m) (the vector's own multiplicative function at the row variable; for a target, its character at m).
   b at (2, 12, 1): 5.235 of the 5.310; U seed: 8.92 of 8.98; mu at (2, 11, 2): 2.616 of 2.616. With u(m) and
   u(m) v_1 added to the span, the remainder is at most 1.47 for a, b / c4 and class U in all 538
   vector-configurations and at most 1.97 for mu. The vector `one` (trivial target) is not resolved at d = 3
   (remainder 7.2 and 7.8 at (2, 8, 3), (2, 7, 3)): OPEN, as in c9. The pre-registered prediction that this term is
   in B was wrong (B/D = 0.87 against e = 9.28).
5. **Controls (section 6; rule D HOLDS).** Random signs on the marked primes remove the excess and nothing else:
   a at (2, 12, 1) goes from 20.6 to 0.50 and 1.01 (two seeds), mu from 951.9 to 0.56 and 0.92; mean of e within
   three standard errors of SD/D in 97 of 102 class-configurations. Random phases: mean cross within three
   standard errors of 0 in 50 of 51. Class U: target a separated in 1 of 51 configurations. Aligned vector: at
   the operator-norm size, all of it in the cross term, outside every span used.
6. **Completed rows, N = 3 (registered expectation HOLDS).** The cube-term excess is also in the cross term
   (SD/D within 2e-3 of 1 at d = 2; between 0.86 and 1.02 at d = 1, where the cube columns of one block are not
   orthogonal) and is not in span{c_0, c_1} (37 violations of rule B with that span); with the span
   enlarged by V c_0, V c_1 there is no violation in 218 vector-configurations. Target a, q = 7: (3, 8, 1) e = 5.20,
   B/D = 0.084, enlarged 5.08; (3, 9, 2) e = 6.27, enlarged 5.84. Optional run (3, 12, 1): e = 40.28,
   B/D = 0.26, enlarged 40.27, with slot signs 0.55.
7. **Model law for the size (EXACT at N = 2 for target a).** B(a) = B(mu)/q^N as exact rationals in 20 of 20
   configurations with B(mu)/D >= 3 at both q: the squared signal of the target is the squared signal of the
   Liouville-twisted vector times the squared ratio of the Moebius sums. For b and at N = 3 the ratio varies
   (two probes with different sums); it stays of order q^(-N).
8. **Model against the Z[omega] screen (section 5).** (a) EXACT: at short marks (lam = N/3 or N/4, the screen's
   geometry; patched copy of the round-8 kernel), N >= 4: the target vectors have ratio 0.975 to 0.997 and cross
   term -0.025 to +0.003 (control classes: -0.033 to +0.038), and the Liouville-twisted vector has cross term
   +3.4 to +8.7: the same picture as the screen. In the long-mark runs the target a first exceeds twice the
   diagonal at lam = 10 = 5N (q = 7) and lam = 6 = 3N (q = 13).
   (b) MEASURED (float): the dual vector of THETA has class sums at the level of random phases
   (squared ratio to ALIGNED 1.7e-2, 6.5e-3, 1.7e-3, 8.3e-4 at Z = 2000 to 16000); with the frequency density 0.397
   and the screen's largest ALIGNED cross this gives 3.2e-4, 3.1e-4, 1.5e-4, 1.5e-4 of the diagonal for the THETA
   coherent cross, against a resolution of 0.01 to 0.02. (c) ARGUED: visible (0.05) needs the ALIGNED cross at 8 to
   150 diagonals, that is at least about 1e10 columns with P >= Z^2 (largest screen: 3.7e5 live columns, P = 25);
   along P = Z^(1/3) the predicted term falls like Z^(-2/3). No term was found in which model and number field differ.

---

## 1. Plan, and relation to closed rows

Read: BRIEF to the end (rhrun rules, 2026-11-18 update); OBSTRUCTION_MAP rows Z15, Z24, Z26, Z30 (which names this
lane for the reconciliation), Z31 and the controls section; RESULT of `c9-mv6-window-statement` (all), of
`c9-mv6-ff-window-exact` (all), of `c8-ek-ff-reflected-rows-exact` (sections 2, 5); `ffx.c`, `ffw.c`, `decomp.py`,
`check_completed.py`, `analyze.py`; ROUND_LOG round 9 lessons and round 10 allocation.

Known before: c8: energy / diagonal = n + B_coh with a measured law for B_coh; c9 (model): Weil targets exceed the
diagonal above dual length 3N at N = 2 (up to 20.6), cube term at N = 3; c9 (Z[omega]): slot decomposition,
no target excess in the float screen (ratio at most 1.007), aligned and Liouville excess in the cross term.
Unexplained: why model and screen differ.

New here: (i) the per-prime kernel `ffs ens` and the exact split E = D + (SD - D) + CRperp + CRcoh with the exact
projection B (not the law); (ii) Lemma X3; (iii) seeded classes with a rule fixed in advance (PREREG.md), among
them the slot-sign class; (iv) the split at short marks; (v) the Z[omega] size estimate; (vi) post hoc, the second
squared signal. No closed route is re-run; the lane makes no attempt on (E-K) itself, which stays closed (Z30).

Order of work: kernel and brute-force check of the identity (first lemma); one disclosed look at (2, 7, 2); PREREG.md;
production runs; analysis. Copies of the c9 files are unchanged (hashes in `logs/prereg_hashes.txt`); the originals
were not edited.

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

## 3. Decisive test: the pre-registered split

PREREG.md (rules A to D, vectors, sizes, predictions, disclosure) was written after the kernel and the identity
check and before any production run; hashes in `logs/prereg_hashes.txt`. Seen before it: the c9 totals e for every
configuration; the split of q = 7 (2, 7, 2) for six vectors; the check configurations.

Vectors. Probe vectors (Moebius vectors after unfolding): `one` (trivial target), `a`, `b` (q = 7) / `c4` (q = 13)
(quadratic characters of prime conductor of degree 3, 3, 4). `mu`: Liouville-twisted vector. `al`: aligned
vector. Seeded classes: `U` (random completely multiplicative signs on the cofactor; the same vector in every
block), `r` (independent random sixth roots on every column), `a*e`, `mu*e` (a and mu with random signs on the
marked primes). 8 seeds per class in the runs of kind F, 2 in kind L, 1 in kind M.

Sizes run (all with lam > N, lam > d, N - lam < d < N + lam; rmax = N + lam - 1 - d + floor(d/2)):

| q | N | d | lam | below / above 3N |
|---|---|---|---|---|
| 7 | 2 | 1 | 3 .. 11 (F), 12 (L) | rmax = lam: 4 sizes at or below 6, 6 above |
| 7 | 2 | 2 | 3 .. 10 (F), 11 (L) | 4 at or below, 5 above |
| 7 | 2 | 3 | 4 .. 9 (F) | rmax = lam - 1: 4 at or below, 2 above |
| 7 | 3 | 1 | 4 .. 10 (F), 11 (L), 12 (M, optional) | rmax = lam + 1: 5 at or below 9, 3 or 4 above |
| 7 | 3 | 2 | 4 .. 9 (F), 10 (L) | 5 at or below, 2 above |
| 13 | 2 | 1 | 3 .. 7 (F), 8 (L) | 4 at or below, 2 above |
| 13 | 2 | 2 | 3 .. 7 (F) | 4 at or below, 1 above |
| 13 | 3 | 1 | 4 .. 6 (F), 7 (L) | all below 9 |
| 13 | 3 | 2 | 4, 5 (F), 6 (L) | all below 9 |

59 configurations (58 required, all run; of the two optional ones (3, 12, 1) was run and (2, 12, 2) was not: NOT-RUN).
At q = 13 the only configuration above 3N with an active class is (2, 7, 2); q = 13, N = 3 above 3N and q = 13
(2, 10, 1) (the c9 value 18.1) are NOT-RUN (size at 4 cores). Full tables: `tables.md`; exact fractions:
`slot_results.json`; rule output: `rules.txt`.

**Table 1. Squarefree rows at N = 2 (= completed rows), all configurations with lam >= 6.** e = E/D, s = SD/D, c = Cross/D = e - s, beta = exact squared signal / D on span{v_0, v_1}, n = e - beta. U: range over the seeds (8 in F runs, 2 in L runs).

| q | (N, lam, d) | rmax | kind | max abs(s - 1) | a: e | a: c | a: beta | a: n | b/c4: e | b/c4: beta | b/c4: n | mu: e | mu: beta | mu: n | one: e | one: beta | U: e | U: beta | U: n |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 7 | (2, 6, 1) | 6 | F | 1.5e-02 | 1.09 | +0.095 | 0.86 | 0.231 | 0.552 | 0.0956 | 0.457 | 42.14 | 42.14 | 0 | 3.32 | 3.32 | 0.367 .. 3.3 | 0.00752 .. 2.87 | 0.34 .. 0.621 |
| 7 | (2, 7, 1) | 7 | F | 1.8e-03 | 0.256 | -0.744 | 0 | 0.256 | 0.258 | 0 | 0.258 | 0 | 0 | 0 | 0 | 0 | 0.16 .. 0.417 | 0 .. 0 | 0.16 .. 0.417 |
| 7 | (2, 8, 1) | 8 | F | 1.5e-03 | 0.087 | -0.913 | 0 | 0.087 | 0.329 | 0.0114 | 0.317 | 0 | 0 | 0 | 0 | 0 | 0.207 .. 0.633 | 0.00271 .. 0.0396 | 0.186 .. 0.594 |
| 7 | (2, 9, 1) | 9 | F | 2.2e-04 | 0 | -1.000 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 .. 0 | 0 .. 0 | 0 .. 0 |
| 7 | (2, 10, 1) | 10 | F | 3.0e-04 | 3.52 | +2.520 | 3.3 | 0.224 | 1.57 | 0.366 | 1.2 | 161.5 | 161.5 | 0 | 4.99 | 4.99 | 0.907 .. 12.9 | 0.0113 .. 11 | 0.3 .. 1.9 |
| 7 | (2, 11, 1) | 11 | F | 2.6e-05 | 0.135 | -0.865 | 0 | 0.135 | 0.119 | 0 | 0.119 | 0 | 0 | 0 | 0 | 0 | 0.0216 .. 0.179 | 0 .. 0 | 0.0216 .. 0.179 |
| 7 | (2, 12, 1) | 12 | L | 5.3e-05 | 20.6 | +19.639 | 19.4 | 1.21 | 7.47 | 2.16 | 5.31 | 951.9 | 951.9 | 0 | 27.8 | 27.8 | 61.9 .. 74.3 | 61.4 .. 65.3 | 0.493 .. 8.98 |
| 7 | (2, 6, 2) | 6 | F | 2.4e-03 | 1.19 | +0.193 | 0.737 | 0.455 | 0.516 | 0.0894 | 0.426 | 36.73 | 36.12 | 0.608 | 3.45 | 0.608 | 0.459 .. 3.15 | 0.00333 .. 2.59 | 0.37 .. 0.559 |
| 7 | (2, 7, 2) | 7 | F | 1.8e-03 | 1.19 | +0.192 | 0.736 | 0.456 | 0.629 | 0.118 | 0.512 | 36.95 | 36.09 | 0.863 | 2.26 | 1 | 0.479 .. 3.27 | 0.00641 .. 2.48 | 0.363 .. 0.783 |
| 7 | (2, 8, 2) | 8 | F | 4.3e-04 | 0.464 | -0.536 | 0.00164 | 0.462 | 0.552 | 0.0148 | 0.537 | 0.09401 | 0.08055 | 0.0135 | 0.195 | 0.173 | 0.429 .. 0.583 | 0.000336 .. 0.023 | 0.422 .. 0.578 |
| 7 | (2, 9, 2) | 9 | F | 2.4e-04 | 0.0235 | -0.977 | 0 | 0.0235 | 0.0176 | 0.00108 | 0.0165 | 0 | 0 | 0 | 0 | 0 | 0.00923 .. 0.0305 | 3.99e-05 .. 0.000839 | 0.00911 .. 0.0302 |
| 7 | (2, 10, 2) | 10 | F | 4.3e-05 | 4.13 | +3.133 | 3.51 | 0.623 | 1.55 | 0.414 | 1.14 | 173.3 | 172 | 1.38 | 6.32 | 3.6 | 1.14 .. 13.9 | 0.00952 .. 12.1 | 0.434 .. 1.81 |
| 7 | (2, 11, 2) | 11 | L | 3.9e-05 | 2.98 | +1.977 | 2.65 | 0.325 | 1.17 | 0.298 | 0.874 | 132.5 | 129.9 | 2.62 | 6.91 | 2.91 | 8.65 .. 10.6 | 8.28 .. 9.08 | 0.377 .. 1.53 |
| 7 | (2, 6, 3) | 5 | F | 3.0e-04 | 0.713 | -0.288 | 0 | 0.713 | 0.823 | 0.00155 | 0.822 | 0.3922 | 0 | 0.392 | 0.269 | 0 | 0.663 .. 1.09 | 0.000155 .. 0.000934 | 0.663 .. 1.09 |
| 7 | (2, 7, 3) | 6 | F | 2.6e-04 | 1.24 | +0.244 | 0.667 | 0.577 | 0.812 | 0.0741 | 0.738 | 33.63 | 32.68 | 0.957 | 9.65 | 0.597 | 0.735 .. 3.42 | 0.00135 .. 2.32 | 0.606 .. 1.25 |
| 7 | (2, 8, 3) | 7 | F | 3.5e-05 | 1.35 | +0.354 | 0.656 | 0.698 | 0.85 | 0.0729 | 0.777 | 33.37 | 32.15 | 1.21 | 9.28 | 0.875 | 0.702 .. 3.33 | 0.00198 .. 2.21 | 0.62 .. 1.13 |
| 7 | (2, 9, 3) | 8 | F | 3.5e-05 | 0.652 | -0.348 | 0 | 0.652 | 0.562 | 4.5e-06 | 0.562 | 0.1978 | 0 | 0.198 | 0.816 | 0 | 0.475 .. 0.594 | 2.54e-05 .. 0.000297 | 0.475 .. 0.594 |
| 13 | (2, 6, 1) | 6 | F | 1.4e-03 | 2.39 | +1.388 | 1.85 | 0.541 | 1.2 | 0.763 | 0.441 | 312.2 | 312.2 | 0 | 3.84 | 3.84 | 0.129 .. 23.9 | 0.0227 .. 22.9 | 0.106 .. 1.02 |
| 13 | (2, 7, 1) | 7 | F | 2.0e-04 | 0.347 | -0.653 | 0.0276 | 0.319 | 0.179 | 0 | 0.179 | 0 | 0 | 0 | 0 | 0 | 0.258 .. 0.672 | 0.0069 .. 0.05 | 0.223 .. 0.665 |
| 13 | (2, 8, 1) | 8 | L | 1.9e-04 | 0.236 | -0.764 | 0 | 0.236 | 0.365 | 0.24 | 0.124 | 0 | 0 | 0 | 0 | 0 | 0.229 .. 0.382 | 0.000594 .. 0.0312 | 0.228 .. 0.351 |
| 13 | (2, 6, 2) | 6 | F | 2.1e-03 | 2.26 | +1.263 | 1.7 | 0.558 | 1.28 | 0.713 | 0.566 | 289.9 | 288.1 | 1.73 | 5.27 | 1.73 | 0.395 .. 22 | 0.0133 .. 21 | 0.382 .. 0.999 |
| 13 | (2, 7, 2) | 7 | F | 2.0e-04 | 2.34 | +1.335 | 1.58 | 0.753 | 1.16 | 0.648 | 0.51 | 269.6 | 267.4 | 2.19 | 3.91 | 1.86 | 0.539 .. 20.4 | 0.0113 .. 19.4 | 0.522 .. 1.06 |

**Table 2. N = 3: squarefree rows (variant 0) and completed rows (variant 1), lam >= 6.** beta: span{v_0, v_1}; beta4: span{v_0, v_1, V v_0, V v_1}; n4 = e - beta4.

| q | (N, lam, d) | rmax | kind | a sqf: e | a sqf: beta | a sqf: n | a compl: e | a compl: s - 1 | a compl: c | a compl: beta | a compl: beta4 | a compl: n4 | mu compl: e | mu compl: beta4 | mu compl: n4 | U compl: n4 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 7 | (3, 6, 1) | 7 | F | 0.459 | 0.185 | 0.274 | 1.06 | +1.7e-02 | +0.043 | 0.159 | 0.859 | 0.201 | 0 | 0 | 0 | 0.0937 .. 0.353 |
| 7 | (3, 7, 1) | 8 | F | 0.161 | 0 | 0.161 | 0.139 | +1.9e-02 | -0.880 | 0 | 0 | 0.139 | 0 | 0 | 0 | 0.3 .. 0.507 |
| 7 | (3, 8, 1) | 9 | F | 0.507 | 0.0979 | 0.409 | 5.2 | +2.0e-02 | +4.178 | 0.0841 | 5.08 | 0.119 | 0 | 0 | 0 | 0.0543 .. 0.426 |
| 7 | (3, 9, 1) | 10 | F | 0.715 | 0.561 | 0.154 | 0.615 | +2.0e-02 | -0.405 | 0.482 | 0.579 | 0.0355 | 147.5 | 147.5 | 0 | 0.187 .. 0.485 |
| 7 | (3, 10, 1) | 11 | F | 0.344 | 0 | 0.344 | 0.296 | +2.0e-02 | -0.724 | 0 | 0 | 0.296 | 0 | 0 | 0 | 0.134 .. 0.543 |
| 7 | (3, 11, 1) | 12 | L | 3.34 | 1.9 | 1.44 | 2.87 | +2.0e-02 | +1.849 | 1.63 | 1.78 | 1.09 | 997.3 | 997.3 | 0 | 1.01 .. 1.34 |
| 7 | (3, 6, 2) | 7 | F | 0.62 | 0.035 | 0.585 | 2.1 | -1.3e-04 | +1.100 | 0.032 | 1.76 | 0.344 | 31.04 | 30.54 | 0.493 | 0.465 .. 0.661 |
| 7 | (3, 7, 2) | 8 | F | 0.37 | 0.00341 | 0.366 | 1.32 | +3.9e-04 | +0.322 | 0.00702 | 1.03 | 0.289 | 0.6921 | 0.1683 | 0.524 | 0.239 .. 0.408 |
| 7 | (3, 8, 2) | 9 | F | 0.382 | 0.000281 | 0.381 | 5.49 | +3.0e-05 | +4.493 | 0.0209 | 5.19 | 0.307 | 0.9497 | 0.948 | 0.00167 | 0.245 .. 0.38 |
| 7 | (3, 9, 2) | 10 | F | 0.807 | 0.289 | 0.518 | 6.27 | +5.4e-05 | +5.274 | 0.244 | 5.84 | 0.429 | 172.5 | 171.9 | 0.538 | 0.415 .. 0.711 |
| 7 | (3, 10, 2) | 11 | L | 1.08 | 0.592 | 0.486 | 0.923 | -1.0e-05 | -0.077 | 0.509 | 0.529 | 0.395 | 143.7 | 141.7 | 1.99 | 0.437 .. 0.487 |
| 13 | (3, 6, 1) | 7 | F | 0.379 | 0.013 | 0.366 | 2.78 | -5.8e-03 | +1.785 | 0.012 | 2.53 | 0.244 | 0 | 0 | 0 | 0.205 .. 0.651 |
| 13 | (3, 7, 1) | 8 | L | 0.713 | 0 | 0.713 | 0.658 | -5.7e-03 | -0.336 | 0 | 0 | 0.658 | 0 | 0 | 0 | 0.217 .. 0.353 |
| 13 | (3, 6, 2) | 7 | L | 0.694 | 0.013 | 0.681 | 2.36 | -1.0e-04 | +1.364 | 0.0154 | 1.7 | 0.66 | 249.4 | 248.1 | 1.23 | 0.545 .. 0.661 |

**Table 3. Controls, squarefree rows, lam >= 7.** Mean +- standard deviation over the seeds; in brackets min, max. The slot-sign columns give e of the signed vector; compare with e of the unsigned vector.

| q | (N, lam, d) | seeds | r: e | r: c | a: e | a with slot signs: e | mu: e | mu with slot signs: e | al: e | al: s |
|---|---|---|---|---|---|---|---|---|---|---|
| 7 | (2, 7, 1) | 8 | 1.24 +- 0.49 [0.50, 2.02] | 0.24 +- 0.49 [-0.50, 1.02] | 0.256 | 1.05 +- 0.41 [0.56, 1.68] | 0 | 0.91 +- 0.43 [0.45, 1.46] | 6.868e+05 | 5.86 |
| 7 | (2, 8, 1) | 8 | 1.02 +- 0.37 [0.44, 1.61] | 0.02 +- 0.37 [-0.56, 0.61] | 0.087 | 1.14 +- 0.45 [0.47, 1.99] | 0 | 1.33 +- 0.51 [0.71, 2.13] | 4.205e+06 | 5.86 |
| 7 | (2, 9, 1) | 8 | 0.95 +- 0.48 [0.42, 1.77] | -0.05 +- 0.48 [-0.58, 0.77] | 0 | 0.90 +- 0.36 [0.34, 1.48] | 0 | 0.89 +- 0.23 [0.70, 1.42] | 2.618e+07 | 5.86 |
| 7 | (2, 10, 1) | 8 | 1.06 +- 0.53 [0.49, 2.11] | 0.06 +- 0.53 [-0.51, 1.11] | 3.52 | 1.00 +- 0.29 [0.61, 1.51] | 161.5 | 1.04 +- 0.26 [0.55, 1.32] | 1.649e+08 | 5.86 |
| 7 | (2, 11, 1) | 8 | 1.30 +- 0.40 [0.91, 2.13] | 0.30 +- 0.40 [-0.09, 1.13] | 0.135 | 1.07 +- 0.39 [0.51, 1.57] | 0 | 0.78 +- 0.25 [0.42, 1.23] | 1.049e+09 | 5.86 |
| 7 | (2, 12, 1) | 2 | 1.08 +- 0.93 [0.42, 1.74] | 0.08 +- 0.93 [-0.58, 0.74] | 20.6 | 0.76 +- 0.36 [0.50, 1.01] | 951.9 | 0.74 +- 0.25 [0.56, 0.92] | 6.734e+09 | 5.86 |
| 7 | (2, 7, 2) | 8 | 0.97 +- 0.18 [0.64, 1.30] | -0.03 +- 0.18 [-0.36, 0.31] | 1.19 | 1.04 +- 0.08 [0.96, 1.21] | 36.95 | 1.00 +- 0.10 [0.88, 1.15] | 1.152e+05 | 2.17 |
| 7 | (2, 8, 2) | 8 | 1.10 +- 0.12 [0.96, 1.30] | 0.10 +- 0.12 [-0.04, 0.30] | 0.464 | 0.90 +- 0.11 [0.74, 1.11] | 0.09401 | 1.01 +- 0.16 [0.84, 1.31] | 7.056e+05 | 2.17 |
| 7 | (2, 9, 2) | 8 | 1.09 +- 0.15 [0.89, 1.41] | 0.09 +- 0.15 [-0.11, 0.41] | 0.0235 | 0.90 +- 0.16 [0.71, 1.19] | 0 | 1.06 +- 0.20 [0.77, 1.36] | 4.392e+06 | 2.17 |
| 7 | (2, 10, 2) | 8 | 0.96 +- 0.16 [0.63, 1.17] | -0.04 +- 0.16 [-0.37, 0.17] | 4.13 | 1.04 +- 0.22 [0.74, 1.40] | 173.3 | 0.99 +- 0.11 [0.87, 1.18] | 2.767e+07 | 2.17 |
| 7 | (2, 11, 2) | 2 | 0.94 +- 0.09 [0.88, 1.00] | -0.06 +- 0.09 [-0.12, 0.00] | 2.98 | 1.12 +- 0.04 [1.10, 1.15] | 132.5 | 0.99 +- 0.24 [0.82, 1.15] | 1.761e+08 | 2.17 |
| 7 | (2, 7, 3) | 8 | 0.99 +- 0.08 [0.86, 1.11] | -0.01 +- 0.08 [-0.14, 0.11] | 1.24 | 0.98 +- 0.06 [0.90, 1.06] | 33.63 | 0.97 +- 0.05 [0.92, 1.05] | 1.681e+04 | 1.01 |
| 7 | (2, 8, 3) | 8 | 0.98 +- 0.05 [0.92, 1.05] | -0.02 +- 0.05 [-0.08, 0.05] | 1.35 | 0.99 +- 0.06 [0.91, 1.09] | 33.37 | 0.99 +- 0.05 [0.93, 1.06] | 1.029e+05 | 1.01 |
| 7 | (2, 9, 3) | 8 | 1.02 +- 0.05 [0.92, 1.06] | 0.02 +- 0.05 [-0.08, 0.06] | 0.652 | 0.98 +- 0.06 [0.91, 1.06] | 0.1978 | 0.99 +- 0.07 [0.90, 1.08] | 6.405e+05 | 1.01 |
| 7 | (3, 7, 1) | 8 | 0.72 +- 0.18 [0.49, 1.03] | -0.28 +- 0.18 [-0.51, 0.03] | 0.161 | 1.00 +- 0.61 [0.59, 2.44] | 0 | 0.91 +- 0.30 [0.55, 1.37] | 4.834e+06 | 41.1 |
| 7 | (3, 8, 1) | 8 | 0.92 +- 0.37 [0.33, 1.47] | -0.08 +- 0.37 [-0.67, 0.47] | 0.507 | 0.97 +- 0.42 [0.55, 1.89] | 0 | 1.11 +- 0.28 [0.75, 1.57] | 2.96e+07 | 41.1 |
| 7 | (3, 9, 1) | 8 | 0.94 +- 0.28 [0.59, 1.38] | -0.06 +- 0.28 [-0.41, 0.38] | 0.715 | 0.98 +- 0.42 [0.45, 1.76] | 171.5 | 0.99 +- 0.22 [0.69, 1.30] | 1.842e+08 | 41.1 |
| 7 | (3, 10, 1) | 8 | 1.10 +- 0.41 [0.54, 1.76] | 0.10 +- 0.41 [-0.46, 0.76] | 0.344 | 1.00 +- 0.24 [0.78, 1.36] | 0 | 0.92 +- 0.26 [0.46, 1.22] | 1.161e+09 | 41.1 |
| 7 | (3, 11, 1) | 2 | 0.64 +- 0.31 [0.43, 0.86] | -0.36 +- 0.31 [-0.57, -0.14] | 3.34 | 0.78 +- 0.28 [0.58, 0.98] | 1160 | 1.10 +- 0.50 [0.75, 1.45] | 7.386e+09 | 41.1 |
| 7 | (3, 7, 2) | 8 | 1.14 +- 0.14 [0.88, 1.28] | 0.14 +- 0.14 [-0.12, 0.28] | 0.37 | 0.93 +- 0.07 [0.79, 1.02] | 0.6475 | 0.90 +- 0.12 [0.76, 1.07] | 7.87e+05 | 6.88 |
| 7 | (3, 8, 2) | 8 | 1.03 +- 0.13 [0.87, 1.30] | 0.03 +- 0.13 [-0.13, 0.30] | 0.382 | 1.00 +- 0.14 [0.80, 1.15] | 0.01316 | 0.94 +- 0.21 [0.66, 1.26] | 4.819e+06 | 6.88 |
| 7 | (3, 9, 2) | 8 | 0.96 +- 0.11 [0.80, 1.11] | -0.04 +- 0.11 [-0.20, 0.11] | 0.807 | 1.05 +- 0.15 [0.87, 1.27] | 196.6 | 1.02 +- 0.13 [0.83, 1.25] | 2.999e+07 | 6.88 |
| 7 | (3, 10, 2) | 2 | 0.97 +- 0.07 [0.92, 1.02] | -0.03 +- 0.07 [-0.08, 0.02] | 1.08 | 1.03 +- 0.17 [0.92, 1.15] | 167.2 | 1.02 +- 0.03 [1.00, 1.04] | 1.89e+08 | 6.88 |
| 13 | (2, 7, 1) | 8 | 0.91 +- 0.14 [0.73, 1.14] | -0.09 +- 0.14 [-0.27, 0.14] | 0.347 | 1.11 +- 0.16 [0.96, 1.43] | 0 | 0.87 +- 0.28 [0.35, 1.16] | 1.068e+08 | 11.9 |
| 13 | (2, 8, 1) | 2 | 0.71 +- 0.22 [0.55, 0.87] | -0.29 +- 0.22 [-0.45, -0.13] | 0.236 | 1.16 +- 0.50 [0.80, 1.52] | 0 | 1.07 +- 0.01 [1.06, 1.07] | 1.215e+09 | 11.9 |
| 13 | (2, 7, 2) | 8 | 1.00 +- 0.07 [0.90, 1.09] | -0.00 +- 0.07 [-0.10, 0.09] | 2.34 | 1.02 +- 0.07 [0.90, 1.11] | 269.6 | 1.07 +- 0.04 [1.02, 1.12] | 8.911e+06 | 2.08 |
| 13 | (3, 7, 1) | 2 | 1.18 +- 0.25 [1.00, 1.36] | 0.18 +- 0.25 [-0.00, 0.36] | 0.713 | 0.90 +- 0.30 [0.69, 1.12] | 0 | 0.95 +- 0.18 [0.82, 1.08] | 1.39e+09 | 155 |

**Table 4. Optional run q = 7, (3, 12, 1) (kind M: one seed per class; not counted in the rules).** rmax = 13.

| q | (N, lam, d) | rows | vector | e | s - 1 | c | beta | beta4 | n or n4 |
|---|---|---|---|---|---|---|---|---|---|
| 7 | (3, 12, 1) | squarefree | a | 0.5695 | -6.5e-06 | -0.4305 | 0.3051 | - | 0.2644 |
| 7 | (3, 12, 1) | squarefree | a*e1 | 0.8355 | -6.5e-06 | -0.1645 | 0.07951 | - | 0.756 |
| 7 | (3, 12, 1) | squarefree | mu | 0 | -4.4e-05 | -1 | 0 | - | 0 |
| 7 | (3, 12, 1) | squarefree | one | 0 | +4.8e-05 | -1 | 0 | - | 0 |
| 7 | (3, 12, 1) | squarefree | r1 | 0.8198 | -2.7e-06 | -0.1802 | 0.03831 | - | 0.7815 |
| 7 | (3, 12, 1) | completed | a | 40.28 | +2.0e-02 | 39.26 | 0.2623 | 40.27 | 0.008463 |
| 7 | (3, 12, 1) | completed | a*e1 | 0.5477 | +2.0e-02 | -0.4723 | 0.0283 | 0.09454 | 0.4532 |
| 7 | (3, 12, 1) | completed | mu | 0 | -1.4e-01 | -0.86 | 0 | 0 | 0 |
| 7 | (3, 12, 1) | completed | one | 0 | -1.4e-01 | -0.86 | 0 | 0 | 0 |
| 7 | (3, 12, 1) | completed | r1 | 0.6947 | -7.1e-06 | -0.3053 | 0.1268 | 0.1268 | 0.5679 |

Target a, completed row: e = 40.28 (c9: 40.3), Cross/D = 39.26, squared signal on span{v_0, v_1} 0.26, on the enlarged span 40.27 (remainder 0.008); with slot signs e = 0.55. The largest completed-row excess of c9 is the cross term and lies in the span V c_0.

### 3.1 Outcome of the rules (`rules.txt`)

| rule | statement | outcome |
|---|---|---|
| A | abs(s - 1) <= 0.05, real vectors, lam >= 7 | **HOLDS**: 288 vector-configurations, largest 2.4e-3 ((3, 7, 1), `one`). By mark length: lam 7, 8: <= 2.4e-3; 9, 10: <= 6.0e-4; 11, 12: <= 6.5e-5. Not in the rule: lam 5, 6: <= 0.11; lam 3, 4: <= 0.19 |
| B | -1.05 <= c_perp <= 1.5 for a, b / c4, mu, class U; for mu abs(c/beta - 1) <= 0.1 where beta >= 10 | **FAILS**: 593 of 596; violations q = 7 (2, 12, 1) b: 4.45; (2, 12, 1) seed U2: 8.13; (2, 11, 2) mu: 1.66. The second clause holds in 26 of 26 |
| C | sb <= 2 dim/q^d, real vectors, lam >= 7 | **HOLDS**: 288 of 288; largest sb = 0.51 of the bound |
| D (i) | class r: mean cross within max(3 standard errors, 0.02) of 0 in at least 90% of the F configurations | **HOLDS**: 50 of 51 (outside: (3, 7, 1), 7 rows, mean -0.28 +- 0.06) |
| D (ii) | slot-sign classes: mean e within max(3 standard errors, 0.02) of s in at least 90% | **HOLDS**: 97 of 102 |
| D (iii) | target a separated from class U in c_perp | 1 of 51 configurations: not separated |
| completed rows | rule B fails with span{v_0, v_1} where the cube term is active and holds with the enlarged span | **as registered**: 37 violations of 218 with span{v_0, v_1} (a, b at (3, 8, 1), (3, 8, 2), (3, 9, 2): 4.2 to 6.3; a, c4 at q = 13 (3, 6, .): 1.7 to 2.1; 26 of class U); 0 of 218 with the enlarged span |

Outcome by the rule of PREREG section 4: A, C, D hold; B fails for b (and for one U seed and for mu at one size
each). **The label "EXCESS = COHERENT CROSS" is not awarded.** Named as the rule requires: configuration (2, 12, 1),
q = 7, vector b, c_perp = 4.45 (n = 5.31); the term is identified post hoc in section 4.

Non-coherent part n = e - beta over all squarefree configurations: a: 58 values, median 0.41, max 1.44; b: 40,
0.49, 5.31; c4: 18, 0.44, 1.47; mu: 58, 0.00, 2.62; class U: 422, 0.47, 8.98; `one`: 58, 0.00, 9.06. For the real
multiplicative vectors n is below 1 in the median: the cross term is negative when no squared signal is active
(c = n - s + beta). In 49 vector-configurations (one, a, b / c4, mu) the rows vanish identically (e = 0, c = -s):
the lower bound Off >= -D of c9 Lemma 0 is attained. For d = 1 and the vectors `one`, `mu`: n = 0 exactly (Remark X5).

Predictions of PREREG section 5: 1 (s) HIT; 2 (c_perp of the targets in [-1, 0.6]) MISS in 1 of 116 (b at
(2, 12, 1)); 3 (a at (2, 12, 1): beta in [18, 21.5], c_coh/c in [0.9, 1.1]) HIT (19.43; 0.982); 4 (`one` at (2, 8, 3):
the missing term is in beta) MISS (beta = 0.87, e = 9.28); 5 (every slot-signed vector within 3/sqrt(q^d) of s)
MISS in 2 of 844 (one seed each at (2, 4, 3) and (3, 7, 1)); 6 (class U: beta spread by more than a factor 3 in
every active configuration; a not separated) MISS in 1 of 27 for the spread, HIT for the separation.

### 3.2 Reading

- **Is the model excess (up to 20.6) the cross term? Yes.** In the 32 excess vector-configurations (e >= 2;
  one, a, b / c4, mu, class U) with lam >= 10, c/(e - 1) is between 0.99997 and 1.00005; in the 55 with lam >= 7,
  between 0.9992 and 1.0001. The slot-diagonal part is the diagonal (Lemma X3), and with random signs on the
  marked primes the same vector returns to the diagonal (Table 3): a at (2, 12, 1) from 20.6 to 1.01 and 0.50;
  a at q = 13 (2, 7, 2) from 2.34 to 0.90 .. 1.12 (8 seeds); mu there from 269.6 to 1.02 .. 1.12.
- **Is Cross = B_coh + O(diagonal)?** For the first target: yes in all 58 configurations, with the O-term between
  -0.95 and +0.58 (Table 1: a at (2, 12, 1): 19.64 = 19.28 + 0.36). For mu and class U: yes except in one
  configuration each (largest O-term otherwise +1.37 and +1.04). For the second target at the largest size: no;
  the remainder is 4.45 diagonals and is another squared signal (section 4).
- **(CROSS) of c9 in the model.** With s = 1 the named input (CROSS) of `c9-mv6-window-statement` is (E-K)
  itself up to O(N q^(N - lam/2)), and in the data it holds for a vector when every squared signal of the vector is
  O(diagonal) (the remainder n is at most about 1.5 after the signals of section 4; `one` at d = 3 excepted). For Weil targets it fails where c9 found it failing; nothing is added to or taken from that verdict.
- **Class U against the target.** The random multiplicative vectors show the same split as the target: s = 1,
  negative non-coherent cross, a squared signal whose size varies by seed (beta from 0 to 65). The target is
  inside the class range in 50 of 51 configurations. The statistic does not read the target's Euler product.


## 4. POST-HOC: the remainder is a second squared signal, in the direction u(m)

Written after the (2, 12, 1) result was seen; not an advance prediction; totals only (the row values R(m) of every
run are in `results/`; no per-prime split of this part). Scripts `resonance.py`, `explore_dirs.py`; output
`posthoc_dirs.txt`.

For a vector u that is a multiplicative function of the cofactor, let w_u(m) = u(m), the same function at the row
variable (for a target: nu(m) = chi_0(Res(F, m))^3; for mu: mu(m); for a U seed: its sign function; for `one`:
w_u = v_0). Enlarge the span by w_u and w_u v_1 and let n_u = e - (squared signal on the enlarged span).

| q | (N, lam, d) | vector | e | beta (span{v_0, v_1}) | added by u(m), u(m) v_1 | n_u |
|---|---|---|---|---|---|---|
| 7 | (2, 12, 1) | b | 7.468 | 2.158 | 5.235 | 0.075 |
| 7 | (2, 12, 1) | a | 20.64 | 19.43 | 1.147 | 0.066 |
| 7 | (2, 12, 1) | U2 | 74.27 | 65.28 | 8.92 | 0.062 |
| 7 | (2, 10, 1) | b | 1.568 | 0.366 | 0.978 | 0.224 |
| 7 | (2, 10, 1) | a | 3.52 | 3.296 | 0.221 | 0.003 |
| 7 | (2, 10, 1) | U2 | 12.87 | 10.97 | 1.646 | 0.254 |
| 7 | (2, 11, 2) | mu | 132.5 | 129.9 | 2.616 | 0 |
| 7 | (3, 10, 2) | mu | 167.2 | 164.9 | 2.33 | 0 |
| 7 | (3, 11, 1) | a | 3.338 | 1.901 | 1.263 | 0.174 |
| 13 | (2, 7, 2) | mu | 269.6 | 267.4 | 1.94 | 0.248 |

Over all squarefree configurations (`posthoc_dirs.txt`):

| vector class | vector-configurations | max n | with n > 1.5 | max n_u | with n_u > 1.5 |
|---|---|---|---|---|---|
| a | 58 | 1.44 | 0 | 0.97 | 0 |
| b | 40 | 5.31 | 1 | 1.10 | 0 |
| c4 | 18 | 1.47 | 0 | 1.47 | 0 |
| mu | 58 | 2.62 | 7 | 1.97 | 1 ((2, 4, 3)) |
| class U | 422 | 8.98 | 5 | 1.43 | 0 |
| one | 58 | 9.06 | 9 | 9.06 | 9 |

- [MEASURED, POST-HOC] For the targets, mu and class U the row energy is, in the data, a remainder of at most
  about 1.5 diagonals (2 for mu) plus squared signals in the directions v_0, v_1, u(m), u(m) v_1. The ratio of the
  second signal to the first at (2, 10, 1) and (2, 12, 1): 2.67 and 2.43 for b; 0.067 and 0.059 for a; both grow
  from lam = 10 to 12 by the factor 5.2 to 5.9 of the sixth-power staircase. The second signal is therefore of
  the same kind and order as B_coh (a sum with square-root cancellation times the frequency count), not a new
  power of q.
- [ARGUED] Mechanism: for multiplicative u the product u(A') u(m) is u at the product A' m, so the projection of
  the row on u(m) is the k = 0 probe of the same vector with the row variable absorbed into the column; its
  Moebius-type sum is a different sum of the same vector. Not derived line by line.
- [OPEN] The vector `one` (trivial target). w_u = v_0 gives nothing new. For d = 2 the directions
  v^(j)(m) = sum_a chi_0(m(a))^j, j = 2..5, take the whole remainder in 4 of 6 cases ((2, 6, 2): 2.843 of 2.843;
  (2, 11, 2): 4.006 of 4.006; q = 13 (2, 6, 2): 3.541 of 3.541; (3, 5, 2): 2.858 of 2.858) and little in the others
  ((2, 10, 2), q = 13 (2, 7, 2)); for d = 3 they take 1.25 of 9.06 at (2, 7, 3) and 1.25 of 8.40 at (2, 8, 3). The excess of
  `one` is in the cross term in every case (s = 1). Its row directions at d = 3 are not identified. This is the
  open item of c9 (section 3, last observation), now located: it is cross, and it is not in B.
- Consequence for the wording of round 8 ("energy = non-coherent part + squared signal"): there is more than one
  squared signal. The reading of c8 and c9 (the window bound fails for a vector when a squared signal exceeds the
  diagonal) is unchanged.


## 5. Model against the Z[omega] screen

The caveat of round-9 lesson 1: the model has target excess up to 20.6; the Z[omega] float screen of
`c9-mv6-window-statement` (Z = 2000 to 16000, P about Z^(1/3), 5 or 6 slot primes) has none (THETA ratio at most
1.007), aligned +7 to +40 percent, Liouville +2 to +22 percent.

### 5.1 The two computations were at different geometries

The screen has marks P = Z^(1/3): lam = N/3 in model variables, and then every probe has dual length
r <= N + lam - 1 - d/2 < N in the window: h = r/N < 1. The model excess was found with lam >= 7 at N = 2, that is
P >= Z^(3.5), dual length 6 to 12 = 3N to 6N. In the long-mark runs of this lane the target a is below twice the
diagonal for every lam <= 5 at both q (Table 1 and `tables.md`).

### 5.2 The model at the screen's geometry (EXACT; `ffxs.c`, `short.py`, `results_short/`)

`ffxs.c` = copy of the round-8 kernel `ffx en` with per-prime histograms (short marks; a column may contain
several marked primes, so the cross term has a phase average, as in the screen). Its extra output equals `ffs ens`
on a long-mark configuration (SD, |J_0|^2, SB_0 at (2, 7, 2), two vectors) and its EN line equals `ffx en`. Statistics
as in the screen: ratio = E/D; sd = slot-diagonal part / its phase average; cr = (cross term - its phase average)/D.
Class U here: random multiplicative signs on the cofactor; class r: random phases on the columns; 4 seeds each.
Configurations inside the window N - lam < d < N + lam:

| q | (N, lam, d) | marks | vector | ratio | sd | cr | phase average of Cross / D | k = 0 squared signal / D |
|---|---|---|---|---|---|---|---|---|
| 7 | (3, 1, 3) | 7 | one | 1.152 | 0.9619 | +0.1755 | +0.3843 | 0.002294 |
| 7 | (3, 1, 3) | 7 | a | 1.165 | 1.086 | +0.07114 | -0.09838 | 0.01454 |
| 7 | (3, 1, 3) | 7 | b | 1.002 | 1.027 | -0.02391 | +0.02899 | 0.01782 |
| 7 | (3, 1, 3) | 7 | mu | 4.596 | 1.245 | +3.445 | +0.3843 | 4.241 |
| 7 | (3, 1, 3) | 7 | al | 5.337 | 2.161 | +3.623 | +0.3854 | 0.02191 |
| 7 | (3, 1, 3) | 7 | class U (4 seeds) | 0.9425 .. 1.073 | 0.9677 .. 1.026 | -0.05709 .. 0.04808 | -0.09791 .. 0.2111 | 0.001568 .. 0.01536 |
| 7 | (3, 1, 3) | 7 | class r (4 seeds) | 0.9565 .. 1.024 | 0.9905 .. 1.014 | -0.03761 .. 0.02125 | 0.3843 .. 0.3843 | 0.00013 .. 0.004761 |
| 7 | (4, 1, 4) | 7 | one | 2.408 | 1.268 | +1.247 | +0.3988 | 4.606e-05 |
| 7 | (4, 1, 4) | 7 | a | 0.9866 | 1 | -0.01351 | -0.1045 | 0.001559 |
| 7 | (4, 1, 4) | 7 | b | 0.9745 | 0.9998 | -0.02532 | +0.03057 | 0.005353 |
| 7 | (4, 1, 4) | 7 | mu | 4.521 | 1.272 | +3.357 | +0.3988 | 4.145 |
| 7 | (4, 1, 4) | 7 | al | 5.185 | 2.014 | +3.575 | +0.3989 | 0.003073 |
| 7 | (4, 1, 4) | 7 | class U (4 seeds) | 0.9587 .. 1.039 | 0.9901 .. 1.001 | -0.0304 .. 0.03757 | -0.1047 .. 0.2213 | 0.0006255 .. 0.008382 |
| 7 | (4, 1, 4) | 7 | class r (4 seeds) | 0.9589 .. 0.985 | 0.9846 .. 0.9957 | -0.03304 .. -0.005774 | 0.3988 .. 0.3988 | 0.000123 .. 0.0007517 |
| 7 | (6, 2, 5) | 21 | one | 1.725 | 1.008 | +0.7191 | +0.2817 | 0 |
| 7 | (6, 2, 5) | 21 | a | 0.9971 | 0.9942 | +0.002977 | -0.01133 | 0 |
| 7 | (6, 2, 5) | 21 | b | 0.9857 | 0.9951 | -0.009339 | -0.01902 | 5.948e-06 |
| 7 | (6, 2, 5) | 21 | mu | 9.566 | 0.8691 | +8.661 | +0.2817 | 0 |
| 7 | (6, 2, 5) | 21 | al | 104.6 | 7.873 | +98.71 | +0.2817 | 0.006551 |
| 7 | (6, 2, 5) | 21 | class U (4 seeds) | 0.9934 .. 1.005 | 0.9986 .. 1 | -0.00698 .. 0.005871 | -0.01903 .. 0.02548 | 4.917e-06 .. 0.0001708 |
| 7 | (6, 2, 5) | 21 | class r (4 seeds) | 0.9903 .. 1.005 | 0.9972 .. 1.002 | -0.01116 .. 0.003545 | 0.2817 .. 0.2817 | 2.611e-06 .. 3.946e-05 |
| 13 | (3, 1, 3) | 13 | one | 0.9088 | 0.9362 | -0.05541 | +0.4392 | 0.0002942 |
| 13 | (3, 1, 3) | 13 | a | 1.015 | 0.9988 | +0.01628 | +0.05685 | 8.595e-05 |
| 13 | (3, 1, 3) | 13 | c4 | 1.032 | 1.007 | +0.02541 | +0.05682 | 0.003188 |
| 13 | (3, 1, 3) | 13 | mu | 7.463 | 1.14 | +6.384 | +0.4392 | 7.252 |
| 13 | (3, 1, 3) | 13 | al | 8.26 | 2.053 | +6.669 | +0.4393 | 0.00449 |
| 13 | (3, 1, 3) | 13 | class U (4 seeds) | 0.9772 .. 1.026 | 0.9938 .. 1.001 | -0.02037 .. 0.03038 | -0.0641 .. 0.2545 | 4.496e-06 .. 0.03901 |
| 13 | (3, 1, 3) | 13 | class r (4 seeds) | 1 .. 1.036 | 1.001 .. 1.01 | -0.0039 .. 0.03017 | 0.4392 .. 0.4392 | 7.675e-05 .. 0.0009638 |
| 13 | (4, 1, 4) | 13 | one | 2.534 | 1.131 | +1.461 | +0.4437 | 1.729e-06 |
| 13 | (4, 1, 4) | 13 | a | 0.9906 | 0.9994 | -0.008876 | +0.05779 | 0.0005743 |
| 13 | (4, 1, 4) | 13 | c4 | 0.9893 | 1.002 | -0.01225 | +0.0578 | 0.0009107 |
| 13 | (4, 1, 4) | 13 | mu | 7.393 | 1.148 | +6.31 | +0.4437 | 7.196 |
| 13 | (4, 1, 4) | 13 | al | 8.226 | 1.95 | +6.698 | +0.4437 | 0.000343 |
| 13 | (4, 1, 4) | 13 | class U (4 seeds) | 0.9918 .. 1.013 | 0.9975 .. 1.005 | -0.008474 .. 0.00749 | -0.06535 .. 0.258 | 2.134e-05 .. 0.0007694 |
| 13 | (4, 1, 4) | 13 | class r (4 seeds) | 0.9976 .. 1.015 | 0.9979 .. 1.006 | -0.001195 .. 0.01153 | 0.4437 .. 0.4437 | 2.111e-05 .. 0.0001971 |

((4, 1, 3), (4, 1, 5) (window edges) are in `short_tables.md`. (6, 2, 6) was stopped after its first vector
(39 minutes estimated): `one`, ratio 0.925; not used.)

- Targets a, b / c4 at N >= 4: ratio 0.975 to 0.997, cr -0.025 to +0.003; class U cr -0.030 to +0.038, class r
  -0.033 to +0.012. No target excess; the targets are slightly on the negative side (as THETA in the screen:
  cr -0.065 to +0.012). At N = 3 (7 or 13 marks, 343 or 2197 rows) a is at 1.165 (q = 7) and 1.015 (q = 13).
- Liouville-twisted vector: ratio 4.5 to 9.6, cr +3.4 to +8.7, sd 0.87 to 1.27: the excess is in the cross term.
  The screen has the same sign and place (cr +0.09 to +0.44 at Z = 16000). The size differs by the number of marks:
  the coherent term is quadratic and the diagonal linear in the mark weights, the model has 7 to 21 equal marks,
  the screen 5 or 6 with a sin^2 profile.
- Squared-signal law at this geometry: at (6, 2, 5) the Liouville-twisted cross is 8.66; times q^(-N) = 8.5e-6
  this predicts 7e-5 for a target, and the measured cross of a is +0.003 with class ranges of 0.01. Consistent;
  the term is below the resolution of the exact computation as well.

So the model and the screen agree at the same geometry. The model result of c9 is a statement about long marks.

### 5.3 Size of the same term in the screen (float; `zw_predict.py`, `logs/zw_predict_Z*.log`)

In Z[omega] the dual vector of a row vector tau t is m(c) = mu(c) G(c) t(c) w(c) q_c^(-1/2) (c9 Lemma 0), G(c) =
conj(chi_c(4)) Gamma(c) with Gamma unimodular and a function of c modulo 4. Sixth-power frequencies see the vector
through its sums over the residue classes modulo 4, twisted by chi_c(unit):

- ALIGNED (dual vector 1): frequencies k = eps l^6;
- LIOU (dual vector G): the factor conj(chi_c(4)) moves the coherent frequencies to 4k = eps l^6, k = 16 eps l'^6,
  a set of density (1/256)^(1/6) = 0.397 of the former, with the same class sums up to unimodular factors.
  Check against the screen [MEASURED there]: LIOU cross / ALIGNED cross at X = N is 0.565, 0.468, 0.425, 0.438 at
  Z = 2000, 4000, 8000, 16000;
- THETA (dual vector mu G): the same frequencies as LIOU, class sums of mu(c) Gamma(c) conj(chi_c(eps)) w(c) q_c^(-1/2).

Computed with the screen's column weights (same table and weight code): A(vec) = sum over the six units and the
12 residue classes of the squared class sums.

| Z | P | live columns | A(THETA)/A(ALIGNED) | A(U)/A(ALIGNED) | random phases, 8 seeds | square-root level | largest ALIGNED cr in the window (c9) | predicted THETA coherent cross | screen: THETA cr; RAND1 cr; U cr (c9) |
|---|---|---|---|---|---|---|---|---|---|
| 2000 | 12.6 | 36197 | 1.66e-2 | 1.50e-2 | 1.45e-2 .. 2.03e-2 | 1.55e-2 | 0.048 | 3.2e-4 | -0.020 .. -0.001; +0.001 .. +0.009; -0.008 .. +0.006 |
| 4000 | 16 | 72933 | 6.54e-3 | 6.62e-3 | 4.18e-3 .. 6.88e-3 | 6.04e-3 | 0.118 | 3.1e-4 | -0.006 .. +0.012; -0.005 .. +0.001; -0.004 .. +0.009 |
| 8000 | 20 | 145509 | 1.73e-3 | 2.19e-3 | 1.49e-3 .. 2.66e-3 | 2.23e-3 | 0.216 | 1.5e-4 | -0.065 .. -0.004; -0.004 .. +0.015; -0.019 .. -0.001 |
| 16000 | 25 | 371888 | 8.31e-4 | 7.29e-4 | 6.13e-4 .. 8.86e-4 | 7.58e-4 | 0.439 | 1.5e-4 | -0.020 .. -0.003; -0.008 .. +0.005; -0.016 .. +0.002 |

Predicted THETA coherent cross = 0.397 x A(THETA)/A(ALIGNED) x (largest ALIGNED cr). Reading:

- The class sums of the THETA dual vector are at the level of a random-phase vector at every size (the model law:
  squared Moebius-type sum with square-root cancellation).
- **Predicted size of the model's term in the screen: 1.5e-4 to 3.2e-4 of the diagonal.** The screen resolves
  about 0.01 to 0.02 (range of the cross term of its random-phase and U vectors). The term is 30 to 70 times below
  the resolution at the sizes run. The measured THETA ratio (at most 1.007, with a deficit near the lower edge)
  carries no information about it.
- **At what size would it be visible [ARGUED].** Visible = 0.05 (five times the resolution) needs
  ALIGNED cr >= 0.05/(0.397 A(THETA)/A(ALIGNED)): 7.6 at Z = 2000 and 152 at Z = 16000, against 0.048 and 0.439
  measured. If the ALIGNED cross grows like K^(1/6), K = N^2/X (Theorem A of `c8-liou-row-bound-theorem`; the
  screen's slopes are -0.07 to -0.13 against -1/6), K must grow by the factor 158^6 = 1.6e13 at Z = 2000
  (to K about 1.6e18) and 346^6 = 1.7e15 at Z = 16000 (to K about 3.5e23). With at least 400 rows this is
  N = (K X)^(1/2) >= 2.5e10 columns and P >= 1.3e7 = Z^2.2 at Z = 2000, and N >= 1.2e13 at Z = 16000. The largest
  screen had 3.7e5 live columns and P = 25. With the measured slopes the size is larger. More slot primes at
  larger P raise the ALIGNED cross at fixed K (by a factor not measured); K scales with its sixth power.
- **At the screen's geometry it is never visible [ARGUED].** With P = Z^(1/3) the window has K <= Z P^3 = Z^2, so the
  ALIGNED cross is at most of order Z^(1/3), while the squared ratio falls like 1/(number of columns of a block),
  about 1/Z: the predicted term is of order Z^(-2/3). The four computed values (3.2e-4, 3.1e-4, 1.5e-4, 1.5e-4) do
  not rise. In model variables: the squared signal of a Weil target exceeds the diagonal only for dual length
  above 3N (c8, c9), which needs lam > 2N + d/2, P > Z^2 Q^(1/2).
- **Term in which model and number field differ:** none found. Differences of bookkeeping only: (i) with long
  marks every column has one marked prime and the phase average of the cross term is 0; with short marks it is
  0.28 to 0.44 of the diagonal in the model and 0.05 to 0.07 in the screen; (ii) the model's sharp degree classes
  give the staircase in the residue of the dual length modulo 6, the screen's smooth weights average it;
  (iii) all primes of one degree against 5 or 6 weighted slot primes.


## 6. Controls

No statement about zeros is made, so no control has to fail for a conclusion. Each ratio is read against its own
seeded class (round-9 lessons 5, 6); the rules were fixed before the runs (PREREG section 4).

| control | what was run | outcome | named step |
|---|---|---|---|
| random signs on the marked primes (`a*e`, `mu*e`; 8, 2 or 1 seeds) | every configuration | the excess disappears: e within the spread of 1 (Table 3); mean within three standard errors of s in 97 of 102 class-configurations | Lemma X4: the mean of E over the signs is SD exactly; Lemma X3: SD = D(1 + o(1)). This control removes the cross term and nothing else |
| random phases on every column (`r`) | every configuration | e = 1 within 3/sqrt(q^d) scatter; mean cross 0 within three standard errors in 50 of 51; squared signal at the level dim/q^d | Lemma R of round 8 (mean = diagonal). It is the reference for "cross = 0" |
| class U: random multiplicative signs on the cofactor (8 seeds) | every configuration | same split as the target: s = 1; n median 0.47; beta from 0 to 65 by seed; target a inside the class range of c_perp in 50 of 51 | the squared signals read a Moebius-type sum of the vector, whatever the vector; no step reads the target's L-function |
| Liouville-twisted vector (`mu`) | every configuration | largest excess (951.9 at (2, 12, 1); 269.6 at q = 13 (2, 7, 2); 1160 at (3, 11, 1)); c/beta within 3.8 percent of 1 wherever beta >= 10 (26 of 26) | its Moebius sum is the full count; B(a) = B(mu)/q^N exactly at N = 2 |
| aligned vector (`al`) | every configuration | e from 85 to 7.4e9, in the cross term (s = 1.0 to 155, the aligned row; c/e above 0.97); beta/e = 0.011 to 0.14 | Lemma AL of round 8: the operator-norm vector, aligned with one row m_0, not with the Gauss-sum rows |
| trivial target (`one`) | every configuration | excess in the cross term; outside every span tried at d = 3 | OPEN (section 4) |
| U of the Z[omega] screen (random unimodular multiplicative twist, slot primes included) | not run here | corresponds to the slot-sign class of this lane, not to the class U above (its phases on the slot primes remove the cross term); c9 measured 0.96 to 1.02 | - |
| DH, sign-twisted primes, backward heat, zeta(s+a) zeta(s-a), T-NR, Beurling, phase-rotated transfer operator, theta^w | not applicable | - | no positivity or zero statement; DH has no row family (c9) |

## 7. Requirement flags

R1 false, R2 false, R3 false, R4 false (table at the top). aboutZeros: false. The lane does what its assignment
says: it removes the caveat of round-9 lesson 1 and raises no flag.

## 8. Three weakest steps

1. **Rule B failed, and its repair is post hoc.** The registered statement "Cross = B_coh + O(diagonal)" is false
   for the second target at the largest size (remainder 4.45) and for 2 further vector-configurations. The second
   squared signal (direction u(m)) was found after the result, from the row totals only (no per-prime split, no
   seeded rule, mechanism ARGUED). The bound "remainder at most 1.5 after both signals" is a description of 538
   vector-configurations at N = 2, 3, d <= 3, not a law; for the trivial target it is false at d = 3 and the term
   there is not identified.
2. **Sizes.** Rows d <= 3 (7 to 343 rows at q = 7, 13 to 169 at q = 13), so the span of the Gauss-sum rows has
   dimension 1 or 2 and single values scatter by 3/sqrt(q^d). At q = 13 one active configuration lies above 3N
   ((2, 7, 2), excess 1.34); (2, 10, 1) with the c9 value 18.1 is NOT-RUN, as is q = 13, N = 3 above 3N and q = 7
   (2, 12, 2). The largest runs have 2 seeds per class (1 in the optional run). Lemma X3 is proved with a bound
   that is non-trivial only for lam > 2N + 3 or so; below that s = 1 is measured (to 0.19 at lam = 3, 4).
   The reflected dual sums were not built (as in c8, c9): the split is of the direct side.
3. **The Z[omega] size estimate is a float proxy.** A(vec) sums squared class sums over residue classes modulo 4
   and units; the exact rank-6 form mixes the classes with unimodular coefficients and was not written. A first
   version (classes by norm modulo 4, G not reduced to Gamma) gave LIOU/ALIGNED = 1.5e-4 against the screen's
   0.43 to 0.57 and was discarded (`logs/zw_v1`); the corrected version reproduces the screen's LIOU/ALIGNED only
   through the frequency density 0.397, which is one number. The g = 1, d = 1 term of c9 Lemma 0 only; the
   coprimality (c_1, c_1') = 1 is ignored. The visibility size extrapolates K^(1/6) over 13 to 15 orders of
   magnitude in K from data whose measured slope is 0.07 to 0.13. What is robust: the THETA class sums are at the
   random level at all four sizes, so the predicted term is 30 to 70 times below the resolution there.

## 9. Compute record

Server ([compute-server]), computations only through `~/rh-push/bin/rhrun`; `rhstatus` read before each launch; GPU not
used; planned memory printed by the kernel (at most 0.005 GB).

| unit | cores, memory limit | what | outcome |
|---|---|---|---|
| rh-c10slot-srv-1119065340 | 4, 4 GB | build (gcc, OpenMP); validation (two configurations, 40 lines identical with the local build); 8 jobs of `jobs_srv.txt` | completed 08:08 UTC, 75 minutes. Job times: (2, 12, 1) L 1721 s; q = 13 (2, 7, 2) F 612 s; (2, 11, 2) L 1061 s; q = 13 (3, 7, 1) L 104 s; q = 13 (2, 8, 1) L 201 s; q = 13 (3, 6, 2) L 72 s; (3, 11, 1) L 435 s; (3, 10, 2) L 253 s |
| rh-c10slot-srv2-1119080829 | 4, 4 GB | started after the first unit was inactive: two jobs of the local list ((3, 9, 2) F 117 s, (3, 10, 1) F 144 s; the local queue then skipped them), then the optional job (3, 12, 1) M | completed 08:46 UTC; (3, 12, 1) M: 2002 s (1.15e9 primes) |

The two units never ran at the same time; 4 cores at most. No job ran longer than 3 hours. Only my own units were
touched. Not through `rhrun`: file copies with rsync and status reads.

Local (Mac), through `scripts/memcap.sh 8`, one process at a time in a queue (`runjobs.sh`, `queue4.sh`): 48 jobs of
`jobs_mac.txt` (longest: (2, 11, 1) F 882 s, (2, 9, 3) F 833 s, (2, 10, 2) F 766 s), the short-mark runs
((6, 2, 5): 331 s; q = 13 (4, 1, 4): 70 s), the Z[omega] estimates (2 to 124 s; `.venv-arb` interpreter, table
`tmp/sextic/data` read as data), the brute-force checks. Peak memory 2.8 GB ((6, 2, 6), stopped). Deviations, all
mine: (i) the brute-force check at d = 3 was still running when the queue started (about one minute of two
processes); I stopped it; (ii) the queue was restarted twice to move short jobs to the front; one job in progress
was lost each time and rerun; (iii) (6, 2, 6) was stopped after its first vector; (iv) the first Z[omega] runs
failed (interpreter without numpy) and the first working version was discarded (section 8, item 3); (v) processes
were stopped by PID, in one case by `pkill -f` on the full command line of my own check script (local machine
only); (vi) build, timing and analysis calls of seconds were run outside the queue.

**Error to report: one local process that was not mine was terminated.** At the second restart of my queue I
built the PID list from `ps` filtered on the script names `queue2.sh`, `queue3.sh`, `runjobs.sh`, `ffs ens` and sent
SIGTERM to every PID in it. The list contained PID 80786, `/bin/zsh ./queue3.sh` with parent 1, started
2026-11-16 11:17 local: a script of the directory `tmp/research-2026-11-16/euler` (another lane), not of this lane.
It was terminated. Found afterwards (read-only inspection): that script was a waiter (`while pgrep -f
"queue.sh|queue2.sh|nested.py|optnodes.py"; do sleep 10; done`, then two `nested.py zeta` runs writing
`nest_z_wide.txt`, `nest_z_wider.txt`) that had been waiting since 2026-11-16; its condition is held true by a
polling shell of the same lane (PID 94875, started 2026-11-16 11:55, whose command line contains `nested.py`), so
it had not run its payload and could not while that shell exists. Its sibling `euler/queue4.sh` (PID 90095, same
age, same kind of waiter) and PID 94875 are still running and were not touched. No file of that directory was
written or changed by me. Effect: the two queued `nested.py zeta` runs of that lane will not start if the polling
shell ever ends; the owner may want to restart or clear those waiters. Cause: a name-based process list on the
local machine with script names that are not unique to a lane.

## 10. For the next allocation; proposed map row (not applied)

- Round-9 lesson 1, caveat: resolved as "sizes". The Z[omega] screen was run where the model also has no target
  excess; the model result is about long marks (lam >= 3.5 N). The verdict of row Z30 does not change.
- The one open item that is cheap: the row directions of the trivial-target vector at d = 3 ((2, 7, 3), (2, 8, 3),
  q = 7), from the stored row values; and a per-prime, seeded test of the u(m) signal (one kernel change:
  projection vectors per weight).
- Not worth a lane: a larger Z[omega] screen at P = Z^(1/3). The predicted term falls with Z there.

Proposed addition to row Z30 (text after "The model excess and the Z[omega] screen ... are not reconciled"):

| Z30 (addition, round 10) | Slot split of the exact F_q[T] row energy (`c10-ff-slot-cross-decomposition`) | Long marks (lam > N, lam > d), q = 7 (N + lam <= 14, one run at 15) and q = 13 (<= 10), N = 2, 3, d <= 3, 58 configurations, exact integers, rules fixed before the runs. R = sum_P R^P with the block of P = chi_P(m) times the unmarked row twisted by a cubic character (model form of Lemmas S1, S2). The slot-diagonal part equals the diagonal up to O(N q^(N - lam/2)) (prime sum of a non-principal cubic character; measured within 2.4e-3 for lam >= 7): the excess over the diagonal is the cross term over pairs of distinct marked primes (c/(e - 1) within 1e-4 of 1), and random signs on the marked primes return every vector to the diagonal. The exact squared signal B on the Gauss-sum rows c_0, c_1 is carried by pairs of distinct primes; Cross = B + (n - 1) D with n = (E - B)/D; n <= 1.5 in 593 of 596 vector-configurations and 5.3 for the second target at (2, 12, 1) (registered rule fails there). Post hoc: the remainder is a second squared signal in the direction u(m); with it the remainder is at most 1.5 for targets and the random multiplicative class (538 vector-configurations); the trivial target is unresolved at d = 3. Completed rows at N = 3: the cube-term excess is cross and lies in the span enlarged by V c_0, V c_1 (0 violations of 218). B(target a) = B(Liouville-twisted)/q^N exactly at N = 2. Reconciliation with the Z[omega] screen: at short marks (lam = N/3, N/4) the model has no target excess (ratio 0.975 to 0.997, cross -0.025 to +0.003) and the Liouville-twisted vector +3.4 to +8.7 in the cross term; in Z[omega] the class sums of the THETA dual vector are at the random-phase level and the predicted coherent cross is 1.5e-4 to 3.2e-4 of the diagonal at Z = 2000 to 16000 (resolution 0.01 to 0.02); visibility needs about 1e10 columns or more with P >= Z^2; at P = Z^(1/3) the term falls like Z^(-2/3). | PROVED (identity; slot-diagonal lemma, Weil); EXACT (integers; brute-force check of the identity on 6 small configurations); MEASURED (rule outcomes; float proxy for Z[omega]); POST-HOC (second squared signal); ARGUED (visibility size); no referee | slot signs and random phases: diagonal; class U (random multiplicative signs): not separated from the target (50 of 51); Liouville-twisted and aligned: above, in the cross term | `c10-ff-slot-cross-decomposition` |

No statement about zeta. No abscissa below 0.874886647 is proved.

## Files

- `RESULT.md`, `PREREG.md`, `MAP_ROW_PROPOSED.md`, `lanes_line.json`
- kernels: `ffs.c` (slot split, long marks; built from the `ffw.c` loop), `ffxs.c` (patched copy of `ffx.c`, short
  marks); `ffx.c`, `ffw.c`, `ffpy.py`, `plan.py`, `analyze.py`, `fit.py`, `decomp.py`, `check_completed.py`,
  `ek_common.py`, `zomega.py`: copied unchanged from the c9 lanes
- `check_slot_ff.py`, `check_slot_ff.log` (brute force of the identity); `validate_mac.txt`
- `wlist.py`, `jobs_mac.txt`, `jobs_srv.txt`, `jobs_srv2.txt`, `jobs_opt.txt`, `jobs_opt1.txt`, `runjobs.sh`,
  `srv_main.sh`, `srv2.sh`, `queue2.sh` to `queue5.sh`
- `results/` (ENS, PRJ and ROW lines: exact integers, every row value), `results_srv/` (server copies),
  `results_short/` (short marks)
- `analyze_slot.py`, `slot_results.json` (exact fractions), `report.py`, `rules.txt`, `tables.md`, `condensed.py`,
  `condensed.md`, `show.py`, `short.py`, `short_tables.md`
- post hoc: `resonance.py`, `explore_dirs.py`, `posthoc_dirs.txt`
- Z[omega]: `zw_predict.py`, `zw_predict_Z*.json`, `logs/zw_predict_Z*.log`, `logs/zw_v1/` (discarded first version)
- `logs/` (hashes at pre-registration, queue logs, server unit logs)
