# c19-u6c-double-cover-k3-run: the statement (K3) for orthogonal-period arrays of GL(3) forms, Eisenstein and cusp

Date: 2026-11-19/20 (campaign round 19; server runs 2026-11-20 06:42 to 07:20 UTC). Kind: deepen (cell U6 (c), map row
Z37; continues `c18-u6c-gl3-cover-whittaker-constants-method` section 5 and its REFEREE.md correction 4). Counts as
7/8-adjacent. Not refereed. Nothing here proves or refutes RH, no bound moves, and no statement about zeros of zeta
is made.

Labels: PROVED (argument written here) / CLASSICAL / RECALLED (from memory, source not opened) / CERTIFIED (ball
arithmetic, python-flint acb, 256 bits, with the tail radius of Lemma T added) / EXACT (rational arithmetic) /
MEASURED (float64, error bar from a stated validation) / OPEN.

Files: `genus.py` (enumeration of positive ternary forms, canonical form, automorphism count, genus invariants),
`k3_eis.py` (Eisenstein input), `hejhal.py`, `hejhal2.py`, `hejhal_odd1.json`, `hejhal_odd1_ext.json` (Hecke
eigenvalues generated here), `gl3.py` (point values of a GL(3) cusp form), `k3_cusp.py`, `out_eis.json`,
`run_eis.log`, `out_cusp.json`, `run_cusp.log`, `local_17_89.json`, `local_cusp_17_89.json` (local pilots,
`scripts/memcap.sh 8`), `table.md` (all numbers), `MAP_ROW.md`, `lanes.jsonl`.
Server: units `rh-c19u6c-eis-1120064218` (12 GB, 8 cores, 38 min) and `rh-c19u6c-cusp-1120064846` (12 GB, 8 cores,
12 min), both through `rhrun`, both ended on their own with status 0; a first launch `rh-c19u6c-eis-1120063820`
failed at start (files not yet copied) and did no work. Planned allocations printed in the logs (largest array
below 0.2 GB). No external data was downloaded.

## 0. Verdict

**Registered outcome (i). (K3), once made a defined statement, holds for the Eisenstein member and for one cusp
form. The array carries no one-sided inequality. The cell closes as "global period data without a Hecke relation".
Score 0.**

1. **(K3) is now a defined test with eps = 1 (answers referee correction 4 of c18).** For primes p = q = 1 mod 8
   with (p/q) = 1, the four genera G_d of the lattices <1, 1, d>, d in {1, p, q, pq}, form an interchange quadruple:
   at every place the pair of local similarity classes of (G_1, G_pq) equals that of (G_p, G_q) (Lemma Q, PROVED).
   For a scale-invariant function phi on positive ternary forms, a genus-sum array
   K_phi(G) = sum over classes Q in G of phi(Q)/|O(Q)| that is a product of local functions of the similarity class
   has Delta_phi(p, q) = K(G_1) K(G_pq) - K(G_p) K(G_q) = 0. Non-vanishing of Delta refutes the product form;
   vanishing of one Delta would not prove it.
2. **Eisenstein row (degenerate Eisenstein series; class level = Epstein zeta function).** Closed form (Lemma E):
   K_E(G_d; s) = d^(s/3) sum_n W_d(n) n^(-s), W_d(n) = mass(G_d) r_(G_d)(n), with r_(G_d)(n) Siegel's product, a
   class number of Q(sqrt(-dn)) times local factors. Delta_E(p, q; s) != 0: (a) EXACT for all large real s, because
   rho_E(s) = K_1 K_pq/(K_p K_q) - 1 tends to R_1 - 1 with R_1 = W_1(1) W_pq(1)/(W_p(1) W_q(1)) rational and != 1 in
   all 11 quadruples (R_1 = 1/6, 1/2, 3/4, 1/4, 2/3, 2, 5/2, 2/3, 2, 4, 7/2); (b) CERTIFIED at 12 values of s (real
   s from 0.75 to 10 and five complex s with real part 0.75 or 0.9, imaginary part up to 25) for each of the 11
   quadruples with p, q < 200: the ball of Delta excludes 0 in 132 of 132 cells, and every K is non-zero. At
   s = 0.75 + 40i the working precision was lost (not decided). The method reproduces the closed form: relative
   deviation at most 5.2e-16 at s = 6 (bound of the direct series) and 1.9e-29 at s = 10, balls overlapping in all
   88 comparisons.
3. **Cusp row.** F = symmetric square lift of the first odd Maass form of SL_2(Z) (R = 9.533695261354; Hecke
   eigenvalues at the 430 primes below 3000 generated here by Hejhal's method, two-height defect 2.2e-9). Point
   values by the Fourier-Whittaker expansion; invariance under SL_3(Z) holds to 5.9e-9. For 14 quadruples (p, q up
   to 409; determinants up to 29041; 332 classes in the largest genus): every K_F(G) is non-zero (smallest
   |K|/err = 1.2e5) and Delta_F != 0 with |Delta|/err between 2.6e3 and 5.7e6. MEASURED, not ball arithmetic.
4. **No inequality.** Delta_F is positive in 5 and negative in 9 quadruples. rho_E at real s takes both signs across
   quadruples and changes sign in s inside one quadruple ((73, 97): -0.043 at s = 2, +0.170 at s = 3). The
   Eisenstein member and the cusp member behave alike: (K3) does not separate them, so nothing fails "for the
   Eisenstein row". No device type.
5. **Scope.** What is decided is a statement about the array of orthogonal periods K_phi(G). Its reading as "the
   global Whittaker functional on the double cover of GL(3) is not a pure tensor" passes through Jacquet's
   correspondence (RECALLED, not established here, and not a theorem for cusp forms as far as recalled). That
   orthogonal periods are not Eulerian is the expected situation (RECALLED: Chinta-Offen for Eisenstein input).

## 1. Plan

New relative to c18 and its referee: (a) (K3) had no specified eps and no defined notion of "pure tensor" on the
period side; section 2 supplies both. (b) The Eisenstein row was argued from "class numbers are not multiplicative";
that argument is not valid as stated (section 3.3: each fixed-n coefficient array is a Siegel product and still
fails the 2 x 2 identity, for a reason that is not the non-multiplicativity of class numbers); it is replaced by a
closed form and a certified computation. (c) The method of c18 section 5 was a plan; it is implemented here for
both inputs, with the Hecke data generated locally.

Three questions before work. Q1 (controls): section 5. Q2 (uniform, every window): no statement of that kind is
reached; the outputs are values of period arrays. Q3 (multiplicativity): enters only through the Hecke data of the
input form and the product structure of the mass; the result is the absence of a product structure for the array.
No step acts on a zero.

## 2. First lemma

**Setting.** L_d = Z^3 with the form <1, 1, d>; G_d its genus (classes of positive integral forms with integer Gram
matrix, determinant d, locally isometric to L_d). O(Q) the integral automorphism group (|O| = 2 |SO|; the factor 2
is common and drops out of rho). phi a function on positive ternary forms with phi(U^T Q U) = phi(Q) for U in
GL_3(Z) and phi(cQ) = phi(Q). K_phi(G) = sum over classes Q in G of phi(Q)/|O(Q)|.

**Lemma Q (interchange quadruple; PROVED).** Let p != q be primes, p = q = 1 mod 8, (p/q) = 1 (then (q/p) = 1).
(i) At v = 2: p, q, pq are squares in Z_2, so the four lattices L_1, L_p, L_q, L_pq are isometric over Z_2.
(ii) At v = p: q is a square in Z_p, so L_q = L_1 and L_pq = L_p over Z_p. At v = q the same with p and q exchanged.
(iii) At an odd prime l not dividing d: L_d is unimodular over Z_l, and d L_d = <d, d, d^2> = <d, d, 1> = <1, 1, 1>
(a unimodular Z_l-lattice, l odd, is determined by rank and determinant class; <d, d> and <1, 1> have determinant
class 1). So L_d is similar to L_1 over Z_l. (iv) At infinity all four are positive definite, hence similar over R.
Consequently the local similarity classes are: (G_1, G_pq) = (U, U), (R_p, R_q) at (p, q) and (G_p, G_q) =
(R_p, U), (U, R_q), with U unimodular and R_v = <1, 1, v>, and equal classes at all other places. If
K(G) = prod_v k_v(similarity class of G_v), then K(G_1) K(G_pq) = K(G_p) K(G_q). In particular the four forms lie in
one quadratic space up to scaling (locally similar everywhere, hence globally similar by Hasse-Minkowski), so the
four numbers are values of one period functional over one group SO_Q at four lattices.

Remark (why similarity and not isometry). For isometry classes no such quadruple exists: the determinant classes
1, p, q, pq differ at the primes l with (p/l) = (q/l) = -1 (density 1/4), where (1, pq) are both squares and (p, q)
both non-squares. A function that is not scale-invariant (for example the n-th theta coefficient) sees this
difference; see 3.3.

**Lemma T (truncation of the class-level value, with radius; PROVED, elementary).** For Q positive definite of
determinant d, Z_Q(s) = sum over x != 0 of Q(x)^(-s), theta splitting at t = 1 gives, for all s,

    pi^(-s) Gamma(s) Z_Q(s) = sum_{x != 0} Gamma(s, pi Q(x)) (pi Q(x))^(-s)
                              + d^(-1/2) sum_{y != 0} Gamma(3/2 - s, pi Q^(-1)(y)) (pi Q^(-1)(y))^(s - 3/2)
                              + d^(-1/2)/(s - 3/2) - 1/s.

For u >= 2(|Re w| + 2) one has |Gamma(w, u) u^(-w)| <= 2 e^(-u)/u. The number of x with Q(x) <= n is at most
(2 sqrt(n beta) + 1)^3, beta = max_i (Q^(-1))_ii, and the number of y with Q^(-1)(y) <= t is at most
(2 sqrt(t d beta') + 1)^3, beta' = max_i Q_ii/d. Keeping pi Q(x) <= pi T and pi Q^(-1)(y) <= pi T, the omitted part
is at most

    2.2 c_1 (T + 1)^(3/2) e^(-pi (T + 1)) + 2 c_2 d^(1/2) T^(3/2) e^(-pi T)/(pi - 3/(2T)),
    c_1 = (2 sqrt(beta) + 1)^3,  c_2 = (2 sqrt(d beta') + 1)^3.

With T = 24 the radius added to every genus sum was at most 1.1e-19 (largest genus, determinant 26441), against
values of order 1 to 1e10. The genus sum is taken before the analytic step: sum_Q r_Q(n)/|O(Q)| and the same for
the adjoint forms are exact rationals.

**Lemma E (the Eisenstein member's row in closed form; CLASSICAL = Siegel, checked here).** The degenerate
Eisenstein series at the point Q is det(Q)^(s/3) Z_Q(s) up to a factor independent of Q. So

    K_E(G_d; s) = d^(s/3) sum_{n >= 1} W_d(n) n^(-s),      W_d(n) = sum_{Q in G_d} r_Q(n)/|O(Q)| = M(G_d) r_(G_d)(n),

    r_(G_d)(n) = 2 pi sqrt(n/d) prod_p alpha_p(n; L_d)
               = 2 pi sqrt(n/d) (L(1, chi_D0)/zeta(2)) prod_{p | D0} (1 - p^(-2))^(-1)
                 prod_{p | 2dn} alpha_p(n; L_d)/(1 + chi_D0(p)/p),

D0 the fundamental discriminant of Q(sqrt(-dn)), L(1, chi_D0) = 2 pi h(D0)/(w sqrt|D0|), alpha_p the local density
(1 + (-dn/p)/p for p not dividing 2dn). This is the class-number series. M(G_1) = 1/48, M(G_p) = (p + 1)/96,
M(G_pq) = (p + 1)(q + 1)/192 in all cases computed (EXACT; a product of local factors). Check: W_d(n)/M(G_d) from
the enumeration against the formula, with L(1, chi) from the finite class-number sum and alpha_p at bad primes from
solution counts modulo p^k (k = v_p(n) + 1, and v_2(n) + 3 at p = 2), for all n <= 240 at which the needed modulus is
at most 700 (229 to 237 of 240 values of n per genus): largest relative deviation 7.5e-16 over the 44 genus checks.
The same check validates the enumeration, the genus invariants and the automorphism counts.

Consequence (EXACT). As s -> +infinity, K_E(G_d; s) = d^(s/3) W_d(1) (1 + O(2^(-s))), so
rho_E(s) -> R_1 - 1, R_1 = W_1(1) W_pq(1)/(W_p(1) W_q(1)). R_1 != 1 in all 11 quadruples (values in section 0), and
the certified rho_E(10) agrees: -0.8328 against 1/6 - 1; 0.9888 against 2 - 1; 2.9735 against 4 - 1; 2.4854 against
7/2 - 1. As s -> 3/2 the pole of the Epstein functions has residue proportional to 1/sqrt(d) for every class, the
array tends to the mass, and rho_E -> 0: certified rho_E(1.51) and rho_E(1.6) are -0.0179 and -0.1567 for (17, 89)
(ratio 8.8 for a ratio 10 in s - 3/2) and of the same shape in the other ten quadruples.

**Answer to the first lemma.** Truncation with radius: Lemma T. Eisenstein row in closed form: Lemma E. The
Eisenstein member satisfies (K3) for all large real s by exact arithmetic and at every tested s by balls.

## 3. Decisive test: Eisenstein input (server, balls)

3.1 Implementation. Enumeration of all classes of determinant d: every class has a Minkowski-reduced Gram matrix
with a <= b <= c, 2|f12| <= a, 2|f13| <= a, 2|f23| <= b, abc <= 2d, and f12, f13 >= 0 after sign changes; all integer
solutions of these loose conditions are listed and reduced to a canonical Gram matrix (lexicographic minimum over
all bases realising the successive minima), which also gives |O(Q)| as the number of minimising bases. Genus:
at odd p exactly dividing d, the Legendre symbol of the determinant of the rank-2 unimodular Jordan part; at 2 the
oddity, read from the Gauss sum of Q over (Z/8)^3 (RECALLED: for an odd unimodular Z_2-lattice, rank, determinant
and oddity are complete). Classes found, all genera: 150 (d = 1513), 226 (2329), 278 (2993), 438 (4633), 580
(6497), 638 (7081), 763 (8633), 896 (10001), 976 (10961); about d/11. (For referee correction 4 of c18: the total
for all d <= 1e4 extrapolates to about 4.5e6, not 1e5; not computed.)

3.2 Result (CERTIFIED). `table.md`, first table: rho_E for 11 quadruples and 12 values of s. Extract:

| (p, q) | classes 1/p/q/pq | s = 1.51 | s = 2 | s = 3 | s = 10 | s = 0.75 | s = 0.75 + 10i | s = 0.9 + 14.1347i |
|---|---|---|---|---|---|---|---|---|
| (17, 89) | 1/2/5/25 | -0.0179 | -0.4909 | -0.7277 | -0.8328 | 0.1435 | -1.085 + 0.070i | -1.094 - 0.253i |
| (41, 73) | 1/3/5/42 | -0.0118 | -0.2878 | -0.3463 | -0.2513 | 2.8204 | -0.155 - 2.429i | -0.775 - 0.035i |
| (73, 97) | 1/5/6/91 | -0.0026 | -0.0433 | 0.1698 | 0.9888 | -24.3922 | -0.465 - 0.904i | -1.147 + 0.041i |
| (97, 193) | 1/6/8/223 | 0.0042 | 0.2424 | 0.9505 | 2.9735 | -18.6779 | -0.669 - 0.805i | -1.198 - 0.049i |
| (137, 193) | 1/6/8/303 | 0.0093 | 0.3935 | 1.0984 | 2.4854 | -6.9941 | -0.711 - 0.213i | -1.744 - 0.732i |

Radii of rho: below 1e-18 for real s, below 3e-11 at 0.9 + 14.13i, below 2e-4 at 0.75 + 25i. Delta excludes 0 in
132 of 132 cells; each of the four K excludes 0 in every cell. Control "method reproduces the closed form": the
direct series with N = 2000 terms (rigorous tail) at s = 6 and s = 10 overlaps the theta-splitting ball for all
four genera of all 11 quadruples; midpoints differ by at most 5.2e-16 (s = 6) and 1.9e-29 (s = 10) relative.

3.3 A control that does not behave as first written, and why. The arrays G -> W_G(n) at fixed n are Siegel
products over all places, yet W_1(n) W_pq(n) != W_p(n) W_q(n) for 1613 to 1666 of the 1668 values n <= 2000 with
r_3(n) != 0 (EXACT; ratios at n = 1, 2, 3, 5 for (17, 89): 1/6, 3/2, 5/3, 8). Reason: the n-th representation
number is not scale-invariant; its local factor at a good prime l is 1 + (-dn/l)/l, which depends on the isometry
class of L_d (the class of d modulo squares at l), not on its similarity class; the product over the primes with
(p/l) = (q/l) = -1 does not cancel. The ratio is a ratio of four class numbers. So a fixed-n array is not a valid
"pure tensor" control for (K3), and "class numbers are not multiplicative in d" (the argument of c18 section 5.4)
is not the reason the Eisenstein row satisfies (K3): the reason is that the scale-invariant function sums the
fixed-n arrays over n, and R_n depends on n.

## 4. Cusp form (server, float64)

4.1 Hecke data, generated here. f = first odd Maass cusp form of SL_2(Z),
f(z) = sum a_n sqrt(y) K_(iR)(2 pi n y) sin(2 pi n x). Hejhal's method (`hejhal.py`): collocation on a horocycle
with pullback to the fundamental domain, 14 unknowns, R refined by a secant iteration on the difference of a_2
between the heights 0.21 and 0.26: R = 9.533695261353554, a_2 = -1.0683335512, a_3 = -0.4561973545,
a_5 = -0.2906725550, a_7 = -0.7449416121 (these agree with the values recalled from the literature to the digits
recalled); Hecke relations a_4, a_6, a_8, a_9, a_10 hold to 2.5e-14. Extension to the 430 primes p < 3000
(`hejhal2.py`: Fourier coefficient of f on the horocycle of height 1.15 R/(2 pi p), f evaluated by pullback):
difference between two heights at most 2.2e-9, multiplicativity at six composite indices to 5.8e-10,
max |a_p| = 1.987.

4.2 The form on GL(3). F = sym^2 f, Langlands parameters (2iR, 0, -2iR), A(p^a, p^b) = Schur polynomial of weight
(a + b, b, 0) at (alpha^2, 1, alpha^(-2)), alpha + 1/alpha = a_p, jointly multiplicative. Whittaker function
(Vinogradov-Takhtajan form, RECALLED, with a check):

    W(y1, y2) = y1 y2 int_R K(2 pi y1 sqrt(1 + e^(2t))) K(2 pi y2 sqrt(1 + e^(-2t))) dt,   K = e^(pi R) K_(2iR).

Check (PROVED here): the double Mellin transform of W/(y1 y2) is
(1/8) pi^(-s1-s2) Gamma((s1 + nu)/2) Gamma(s1/2) Gamma((s1 - nu)/2) Gamma((s2 + nu)/2) Gamma(s2/2) Gamma((s2 - nu)/2)/Gamma((s1 + s2)/2),
nu = 2iR (one-variable Mellin transforms of K and a Beta integral), which is the Gamma product of the GL(3)
Whittaker function with parameters (nu, 0, -nu) (RECALLED: Bump; Stade). Expansion (RECALLED: Goldfeld, Theorem
6.4.11): with S = z z^T the Gram matrix, coordinates x1 = S23/S33, x3 = S13/S33, y1, z2 = x2 + i y2 from the
remaining block,

    F(S) = 4 sum over (c, d) coprime mod sign, m1, m2 >= 1 of
           A(m1, m2)/(m1 m2) cos(2 pi m1 (c x3 + d x1)) cos(2 pi m2 Re(gamma z2)) W(m1 y1 |c z2 + d|, m2 y2/|c z2 + d|^2).

Truncation: with g(x) = sqrt(x^2 - nu^2) - nu arccos(nu/x) for x > |nu| and 0 otherwise (the exponential rate of
decay of K), a term is kept when min over t of g(first argument) + g(second argument) is below E + 3, E = 30;
omitted terms are below e^(-33) each. Largest m2 used: 167 (Hecke data reach 2999). K from a table (flint, 6e5
nodes in log x, cubic interpolation); t-integral by the trapezoid rule, 360 nodes.

4.3 Validation (MEASURED). The six orderings of the basis (which include Weyl elements outside the parabolic) give
the same value to 9e-9 relative on an integral and on a non-integral Gram matrix; E = 22 against E = 30 changes
values by 1e-11; six random Gram matrices against U S U^T with U a product of four elementary matrices: largest
difference 5.9e-9. Since the expansion is not termwise invariant, this tests the Hecke data, the Whittaker
function, the normalisation A/(m1 m2) and the coordinates together. Error bar of K_F(G): sum over classes of
(spread over the orderings with min(y1, y2) >= 0.6, plus 2e-8 |F| + 1e-10)/|O|, plus 1e-8 sum |F|/|O|.

4.4 Result (MEASURED). K_F(G_1) = F(I)/48 = -0.07363932.

| (p, q) | det pq | classes in G_pq | K(G_p) | K(G_q) | K(G_pq) | Delta | error | rho |
|---|---|---|---|---|---|---|---|---|
| (17, 89) | 1513 | 25 | 0.15535484 | 0.26681470 | -1.64456582 | +7.965376e-2 | 1.8e-8 | 1.9216 |
| (17, 137) | 2329 | 36 | 0.15535484 | -0.11057120 | 0.90007145 | -4.910288e-2 | 2.6e-8 | 2.8585 |
| (41, 73) | 2993 | 42 | -0.27767567 | 0.50239727 | 2.11254075 | -1.606257e-2 | 3.8e-8 | 0.1151 |
| (41, 113) | 4633 | 65 | -0.27767567 | 0.03420909 | 1.35826861 | -9.052295e-2 | 4.6e-8 | 9.5297 |
| (73, 89) | 6497 | 82 | 0.50239727 | 0.26681470 | -3.88634252 | +1.521407e-1 | 8.7e-8 | 1.1350 |
| (73, 97) | 7081 | 91 | 0.50239727 | -0.00371529 | 1.24876232 | -9.009146e-2 | 6.8e-8 | 48.27 |
| (73, 137) | 10001 | 125 | 0.50239727 | -0.11057120 | 0.75814303 | -2.784722e-4 | 1.1e-7 | 0.0050 |
| (89, 97) | 8633 | 106 | 0.26681470 | -0.00371529 | 6.92571437 | -5.090136e-1 | 8.9e-8 | 513.5 |
| (97, 113) | 10961 | 135 | -0.00371529 | 0.03420909 | -3.17771073 | +2.341316e-1 | 1.1e-7 | -1842 |
| (97, 193) | 18721 | 223 | -0.00371529 | -0.87976028 | -0.25510317 | +1.551706e-2 | 1.7e-7 | 4.7474 |
| (137, 193) | 26441 | 303 | -0.11057120 | -0.87976028 | 0.76620290 | -1.536988e-1 | 2.3e-7 | -1.5800 |
| (17, 409) | 6953 | 92 | 0.15535484 | 0.91418228 | 0.29744683 | -1.639264e-1 | 8.3e-8 | -1.1542 |
| (41, 241) | 9881 | 123 | -0.27767567 | 0.78605368 | 1.31573316 | +1.213783e-1 | 9.9e-8 | -0.5561 |
| (113, 257) | 29041 | 332 | 0.03420909 | -0.01170220 | 1.62355139 | -1.191569e-1 | 2.2e-7 | 297.7 |

Delta != 0 in 14 of 14, by 2.6e3 to 5.7e6 error bars; smallest |K|/error 1.2e5. Signs of Delta: 5 positive, 9
negative. The smallest relative defect is rho = 0.0050 at (73, 137), 2596 error bars from 0.

## 5. Controls

| read | control | has | outcome | status |
|---|---|---|---|---|
| (K3) | phi = 1 (the mass; a product of local factors; also the residue of the Eisenstein row at s = 3/2) | product structure | Delta = 0 exactly, 11 of 11 quadruples; rho_E(s) -> 0 as s -> 3/2 (-0.0179 at 1.51) | EXACT / CERTIFIED |
| (K3) | Eisenstein row at s -> infinity | one term n = 1 | rho -> R_1 - 1 != 0: a single fixed-n array already fails the identity (3.3) | EXACT |
| (K3) | fixed-n theta coefficient arrays (Siegel products) | Euler product over all places in the isometry class | fail the 2 x 2 identity at 1613 to 1666 of 1668 n: not scale-invariant, so not a control of the intended kind | EXACT |
| method | closed form of Lemma E at s = 6, 10 | | reproduced within the stated radius, 88 of 88 | CERTIFIED |
| non-vanishing of each K | | | Eisenstein: all balls exclude 0; cusp: abs K/err >= 1.2e5 | CERTIFIED / MEASURED |
| cusp evaluator | invariance under SL_3(Z) | | 5.9e-9 | MEASURED |
| Eisenstein against cusp (the control named in the assignment) | Eisenstein row | functional equation, no Euler product at class level | (K3) holds for both: no separation; an inequality "failing for the Eisenstein row" was not found | CERTIFIED / MEASURED |
| DH, backward heat, sign twist, unimodular twist, zeta(s+a)zeta(s-a), T-NR, Beurling, phase-rotated transfer operator, theta^w | no lift to this array on file | | not formulable; recorded, not counted as a pass | recorded |

One-sided inequality on the array: none. Delta_F and rho_F take both signs; rho_E takes both signs at every tested
real s above 3/2 and changes sign in s; at s = 0.75 rho_E ranges from -24.4 to 2.8. No statement with a
consequence for a zero was found or is claimed.

## 6. The four requirement flags

- R1 (multiplicativity essential): false. Multiplicativity enters through the Hecke data of the input and the mass;
  the result is that the period array has no product structure.
- R2 (height-uniform, every window): false. No statement of that kind.
- R3 (every control fails at a named step): false. The Eisenstein member passes (K3) together with the cusp member;
  the zeta controls are not formulable on the array.
- R4 (reaches the critical line): false. Values of period arrays at finitely many points; the tested points with
  real part 0.75 lie on the critical line of the Epstein functions, not of zeta, and nothing is concluded there.

## 7. Three weakest steps

1. The link to the cell's wording. (K3) is decided for orthogonal-period arrays. "Whittaker functional on the
   double cover of GL(3) is not a pure tensor" follows only through Jacquet's correspondence (recalled; for cusp
   forms on GL(3) not a theorem as far as recalled). Also, the test uses two of the local classes at p (unimodular
   and <1, 1, p>): it refutes the product form on that 2 x 2 sub-array and says nothing finer about the
   4-dimensional local spaces.
2. The cusp computation is float64 and rests on two recalled formulas (the Fourier-Whittaker expansion and the
   Vinogradov-Takhtajan integral; the latter checked against the recalled Gamma product). The protection is the
   measured invariance under SL_3(Z) to 5.9e-9 and the size of Delta against the error bar (at least 2596); there
   are no balls, one cusp form, and only primes p, q = 1 mod 8 with (p/q) = 1. A function invariant to this accuracy
   with these Hecke coefficients is what was summed; that it equals the normalised lift is not separately checked
   and is not needed for Delta != 0.
3. Genus classification uses recalled completeness of the 2-adic invariants (determinant, oddity) and of the
   Jordan invariant at p; the enumeration bound abc <= 2d is the classical Minkowski bound (recalled). Protection:
   Siegel's formula to 7.5e-16 for about 235 values of n in each of 44 genus checks, the masses (p + 1)/96 and
   (p + 1)(q + 1)/192, and the exact vanishing of Delta for phi = 1. A missing or misassigned class would have to
   preserve all of these. Lemma T's counting bound is crude but explicit; s = 0.75 + 40i was not decided
   (precision), and the Siegel check skips the 3 to 11 values of n per genus that need a local count beyond
   modulus 700.
