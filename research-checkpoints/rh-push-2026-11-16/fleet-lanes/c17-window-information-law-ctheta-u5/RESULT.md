# c17-window-information-law-ctheta-u5: what a height-coupled band-limited positivity device can read

Date: 2026-11-19/20. Kind: deepen (R4 lane). Inputs: `push/c16-ctheta-proposition5-power-sum`, `push/c15-u5-window-count-threshold-translate-control`, `push/c15-u7-growing-section-twin-ladder-bridge`, map rows S12b, Q30, P45.
Labels: PROVED (argument in this note; author only, not refereed), CLASSICAL (recalled; source opened only where stated), MEASURED (ball arithmetic where stated; rigorous for the synthetic set as stored, not a statement about zeta), ARGUED, OPEN.

Nothing here proves or refutes RH. No statement about a zero of zeta is established. No bound moves. This lane cannot raise the headline: no named step uses multiplicativity to enlarge the band u.

## 0. Verdict

**Precise obstruction, with the target theorem proved in a model and measured on zeta's ordinates. Every positivity device with tests of band u = log P is the quadratic form of one operator T_Z on L^2 of an interval of length u, tested on some set of vectors (the statement C(theta) of c15/c16 tests it on modulated indicator functions). For the complete device (all vectors) the excluded set of clusters against a regular on-line background is an explicit eigenvalue condition on the matrix sinc(u (z_k - z_l)/2). Its consequences: one pair is invisible exactly up to sinh(ub)/(ub) = 1 + (log(t/2 pi) + 2M)/u when u <= log(t/2 pi); above that band (P > t/2 pi) the reach for one pair is of order sqrt(M) (log t)^(-3/2), and zero at M = 0, in the lattice model; a cluster of n pairs has exactly n negative directions and can hide them only when off-line pairs have local density of order u/2 pi over a length of order b_max, with u b_max between 0.445 n and 5.85 n. No band u = theta log t turns this into a region shrinking faster than a power of log t, and for every theta rows of sufficient density pass with any offset. The step that would enlarge u unconditionally is a one-sided bound for the logarithmic derivative of the truncated Euler product in the truncated-shift algebra; the factorisation holds there exactly for every multiplicative chain, so it is not that step.**

1. (PROVED, Theorem 1) Frame: sum over zeros of f = <h, T_Z h> for f = abs(g)^2-type tests of band u; the complete device with tolerance M is T_Z + 2M >= 0; C(theta) of c15/c16 is the same form on the vectors e^(ist) 1_[0,u'].
2. (PROVED, Theorem 2) A cluster of n pairs has exactly n negative eigenvalues; none passes without background or tolerance. First lemma with constant: sup of -[f(x + ib) + f(x - ib)] over tests with int f = 2 pi is u (sinh(ub)/(ub) - 1), with the extremal function; against a tight background alpha the largest invisible offset solves sinh(ub)/(ub) = 1 + (alpha + 2M)/u. Checked by the general ball test to 9 digits.
3. (PROVED, Theorems 3, 4, lattice model) Exact matrix criterion below the Nyquist band u = log(t/2 pi). Above it: with M = 0 every configuration with finitely many off-line pairs is excluded; with tolerance M one pair away from the lattice points has threshold between sqrt(12M) u^(-3/2) and sqrt(12M)/abs(sin) (u - Lg)^(-3/2). Checked in ball arithmetic (section 5.2).
4. (PROVED, Theorems 5, 6; Lemma P; relative to Turan's theorem, Corollary T') A mean-square necessary condition, sharp for one pair; rows of spacing <= 2 pi/u are a uniform on-line density for the complete device; a power-sum bound from Fejer-modulated tests without the two-height device of c16, giving u b_max <= 5.85 n + logarithms.
5. (MEASURED, ball arithmetic, exact criterion) Scale-free: tapered rows pass up to u b_max = 0.445 n + 2.1 (n = 40 to 60), shape-optimised clusters up to 1.7 n (n = 3) and 0.96 n (n = 8); equal offsets do not grow. On zeta's ordinates at 1e6, 1e9, 1e12: the one-pair threshold is 0.90 to 0.99 of the lattice law in the median at theta = 1/2 and 1.05 to 1.08 times sqrt(12M) u^(-3/2) at theta = 2 (0.22 to 0.30 of the c15 region); clusters placed on zeta's ordinates do not grow with n; count-preserving replacement at theta = 1/2 is excluded down to 0.025 to 0.041 with 12 pairs and below 1e-3 with 40 to 60 pairs at M = 0; rows of spacing pi/u pass at theta = 2 with u b_max = 9.1, 12.6, 16.2, 19.7 for n = 16, 24, 32, 40 at the three heights, the scale-free values.
6. (PROVED, Lemma E; section 3) The truncated Euler product holds exactly in the algebra of truncated shifts for every completely multiplicative chain. The input that would extend the unconditional band from a power of log t to a power of t is a one-sided operator bound N(theta); sign chains have the factorisation and fail the bound at theta >= 1 (measured in c15/c16).
7. Turan's second main theorem: the statement used was compared with a secondary source (section 4); primary sources not opened; "relative to" stands.
8. Requirement flags: R1 no, R2 no, R3 no, R4 no. Score unchanged.

The idea is decided, not killed: the first lemma exists with an exact constant, and the test agrees with it. No pivot was made.

## 1. Plan and what is new against the sources

Sources read: `BRIEF.md` to the end; `c16-ctheta-proposition5-power-sum/RESULT.md` in full; `c15-u7-growing-section-twin-ladder-bridge/RESULT.md` (verdict, Lemmas 1, 2, the pre-filter); `OBSTRUCTION_MAP.md` rows P45, Q30, S12, S12b and the Q2 filter; the c15-u5 result through its map row S12b (span law, 24 + 0.36 K conditions).

Recorded there: the Fejer section is a sum over zeros of a kernel that is non-negative on the line (c15); its value on lattice rows (c16 Theorem B); a power-sum bound for one cluster, linear in n, from Turan's theorem with a two-height device (c16 Lemma T); measured clusters that pass the Fejer-translate test (c16 section 4); the translate span law (c15-u5).

Done here, not recorded there:
- the device class is put in one frame: every band-u positivity device is the quadratic form of one operator T_Z on L^2 of an interval of length u, tested on a subset of vectors; the c15/c16 statement C(theta) tests it on modulated indicator functions only (section 2.1);
- the exact excluded set of the complete device (all vectors) for a cluster against a regular on-line background: an eigenvalue condition on the matrix sinc(u (z_k - z_l)/2) (Theorems 2, 3);
- the first lemma with its constant: one pair is invisible exactly when sinh(ub)/(ub) <= 1 + (alpha + 2M)/u, with the extremal test function (Theorem 2 (c));
- the negative index of a cluster is its number of pairs, so no finite cluster is invisible without a background or a tolerance (Theorem 2 (a), (b));
- the Nyquist transition at u = 2 pi x (density of on-line zeros), that is P = t/2 pi: above it an exact device (M = 0) excludes every finite cluster in the lattice model, and with tolerance M the one-pair threshold is of order sqrt(M) u^(-3/2) (Theorem 4);
- a necessary mean-square condition, exact for one pair (Theorem 5);
- a shorter power-sum bound with a better range (Lemma P), from the Fejer-modulated tests, without the two-height device;
- the prime-side form: the truncated Euler product holds exactly in the algebra of truncated shifts, for every completely multiplicative chain (section 3);
- the decisive test in ball arithmetic with the exact criterion (section 5).

Predictions were registered in `PREDICTIONS.md` before the runs.

## 2. Statements and proofs

### 2.1 Frame

Coordinates. A zero rho is written z = (rho - 1/2)/i, so zeros on the critical line are real. A configuration Z is a multiset of complex numbers in the strip abs(Im z) <= 1/2, closed under conjugation, with at most C log(2 + abs(x)) points per unit length. Its on-line part is Gamma = Z cap R; its off-line part is a set of pairs x_j +- i b_j, b_j > 0 (a pair is what the lane assignment calls a quadruple, seen near one height).

Tests. K_u is the cone of entire functions f of exponential type at most u with f >= 0 on R and f(x) = O((1 + abs(x))^(-2)) on the strip. A band-u device with tolerance M is a subset K of K_u and the family of inequalities

    sum over z in Z of f(z - t) >= -(M/pi) int_R f      for f in K (and t in a set of heights).      (D)

The normalisation is that of c15/c16: for the Fejer kernel F_u, int F_u = pi, so (D) with f = F_u(t - .) is G_u(t) >= -M. The complete device is K = K_u. A device with a smaller K excludes fewer configurations.

Lemma 0 (CLASSICAL: Fejer-Riesz factorisation for entire functions of exponential type, Akhiezer, Krein; Boas, Entire Functions, 7.5; recalled, not opened). Every f in K_u is f(z) = g(z) conj(g(conj z)) with g of exponential type u/2 and g in L^2(R). By Paley-Wiener g(z) = int_I h(s) e^(-isz) ds with h in L^2(I), I = [-u/2, u/2].

Only the direction "such products are in K_u" is used for exclusion statements; the factorisation is used for "passes the complete device".

Operator. H = L^2(I), v_z(s) = e^(isz), <a, b> = int conj(a) b. For a configuration Z put T_Z = sum over z in Z of |v_z><v_(conj z)| (a quadratic form on smooth h vanishing near the ends of I; Hermitian because Z is closed under conjugation; the on-line part is a sum of |v><v| >= 0).

**Theorem 1 (frame). PROVED.** For h in H with f = g g^#, g as in Lemma 0: sum over z of f(z) = <h, T_Z h>, and int_R f = 2 pi norm(h)^2. Hence:
(a) Z passes the complete band-u device with tolerance M if and only if T_Z + 2M >= 0 on H. A translation of the tests in t is a modulation of h; the complete device is the same at every height.
(b) The statement C(theta) of c15/c16 at height t is the inequality <h, T_Z h> >= -2M norm(h)^2 for the vectors h = e^(ist) 1_[0,u'] (u' <= u) only: F_u' = abs(g)^2/(2u') with g the transform of 1_[0,u'], norm(h)^2 = 1/2 after the normalisation.
(c) The tests w(x) = B_delta(x - t)(1 + cos(xi (x - t) + phi)), B_delta(z) = (delta/2 pi)(sin(delta z/2)/(delta z/2))^2, delta <= xi <= u - delta, are in K_u (Fejer-modulated tests).
Proof. g(z) = <v_(conj z), h>, so g(z) conj(g(conj z)) = <h, v_z><v_(conj z), h>; sum over z. Plancherel gives the norm. (b): direct computation, abs(int_0^u e^(-isz) ds)^2 = 2(1 - cos uz)/z^2. (c): w >= 0 on R and its transform is supported in [-xi - delta, xi + delta]. QED.
Check: `selftest.py` compares the criterion below with the smallest eigenvalue of T_Z + 2M on a midpoint grid of 2640 points (lattice part exact on the grid): 20 cases (u/Lg = 0.67, 1.22, 2.22), agreement of sign in all 20.

So the excluded set of each sub-device (indicator vectors: C(theta); Fejer-modulated tests) is contained in that of the complete device. Two-sided bounds for "what a band-u device excludes" are: at least what its own vectors detect, at most what T_Z + 2M >= 0 fails to hold for.

Remark K (CLASSICAL, Krein extension, M. Riesz extension; recalled; not used below). T_Z + 2M >= 0 if and only if there is a positive measure sigma on R with sum_Z f(z) + (M/pi) int f = int f d sigma for all f in K_u: the configuration is indistinguishable, in the band u, from one with all its mass on the line.

### 2.2 Clusters: negative index, the exact criterion, the first lemma

A cluster is a finite set of n pairs z_(2j-1) = x_j + i b_j, z_(2j) = x_j - i b_j with 2n distinct points. V: C^(2n) -> H has columns v_(z_k); G = V*V, G_kl = u sinc(u (z_l - conj z_k)/2), sinc w = sin w/w; J is the permutation matrix exchanging z and conj z. T_cl = V J V*.

**Theorem 2. PROVED.**
(a) G is positive definite, and T_cl has exactly n negative and n positive eigenvalues (the rest of its spectrum is 0). The non-zero eigenvalues are those of the matrix J G = [u sinc(u (z_l - z_k)/2)]_(k,l).
(b) A finite cluster with no on-line zeros and M = 0 never passes the complete device, for any u > 0.
(c) (First lemma, one pair.) For one pair x +- ib the eigenvalues are u (1 +- sinh(A)/A), A = ub. With mu(b, u) = u (sinh(ub)/(ub) - 1):

    sup { -[f(x + ib) + f(x - ib)] : f in K_u, int f = 2 pi } = mu(b, u),

attained by f = abs(g)^2/norm(h)^2 with h(s) = e^(isx) sinh(bs), g(y) = -2i Im[ sinh((b + i(y - x)) u/2)/(b + i(y - x)) ], norm(h)^2 = (sinh(ub)/b - u)/2.
(d) Write -mu_1 <= ... <= -mu_n < 0 for the negative eigenvalues of T_cl. If the on-line part satisfies alpha <= T_Gamma <= beta on H (frame bounds of the exponentials e^(is gamma) on I), then the configuration passes the complete device if mu_1 <= alpha + 2M and fails it if mu_1 > beta + 2M. For a tight background (alpha = beta) the criterion is exact: the largest invisible offset of one pair is the root of

    sinh(ub)/(ub) = 1 + (alpha + 2M)/u.

Proof. (a) Exponentials with distinct exponents are linearly independent on an interval, so G > 0. The non-zero spectrum of V J V* is that of J V*V = J G, which is similar to G^(1/2) J G^(1/2); by Sylvester's law its inertia is that of J, which is (n, n). (J G)_kl = G_(k* l) = u sinc(u (z_l - z_k)/2). (b) follows from (a). (c) J G = [[u, N],[N, u]] with N = u sinh(A)/A; eigenvector (1, -1) gives h = v_z - v_(conj z). (d) T_Gamma + T_cl + 2M >= alpha + 2M - mu_1 on one side; on the other, the eigenvector of -mu_1 has quadratic form at most beta + 2M - mu_1 < 0. QED.
Checks: `selftest.py`: thresholds found by the general ball test against the closed form for c = (alpha + 2M)/u in {2, 1, 0.1}: 2.838446380, 2.177318985, 0.763400798 on both sides; inertia (n = 1, 2, 3, 5 random clusters, 60 digits): n negative eigenvalues each time.

Lattice background. For Gamma = x_0 + d Z, by Poisson summation T_Gamma h (s) = (2 pi/d) sum_m e^(2 pi i m x_0/d) h(s - 2 pi m/d) restricted to I. If 2 pi/d >= u, only m = 0 occurs: T_Gamma = (2 pi/d) Id, a tight background with alpha = 2 pi x density. With the density of zeta's zeros at height t, alpha = Lg = log(t/2 pi). Write theta' = u/Lg.

**Theorem 3 (exact criterion below the Nyquist band). PROVED.** Let the on-line part be a lattice of spacing 2 pi/Lg, u <= Lg, and let finitely many on-line points be removed or added and a cluster added. Then the configuration passes the complete device with tolerance M if and only if the Hermitian matrix R K R + R is positive semi-definite, where the columns of V are v_p for the modified on-line points and the cluster points, R = V*V/(Lg + 2M), and K is +1 on added on-line points, -1 on removed ones, and J on the cluster. For a cluster alone: if and only if all eigenvalues of [sinc(u (z_k - z_l)/2)] are >= -(1/theta' + 2M/u).
Proof. T = (Lg + 2M) Id + V K V*. T >= 0 iff Id + (Lg + 2M)^(-1) V K V* >= 0 iff all eigenvalues of K R are >= -1 iff R^(1/2) K R^(1/2) + Id >= 0 iff R K R + R >= 0 (congruence by R^(1/2), R > 0). QED.
The same reduction with the explicit inverse of the lattice operator for u > Lg (fibres of the shift by Lg, of size 1 to 3 in the runs) is the criterion implemented in `wil.py`; it is exact for the synthetic set (zeta's ordinates in a window, lattice outside, tolerance M).

**Theorem 4 (Nyquist transition). PROVED (lattice model).** Let the on-line part be contained in a lattice x_0 + d Z with d > 2 pi/u, that is u > 2 pi/d =: Lg, u_1 = u - Lg.
(a) With M = 0, no configuration with finitely many off-line pairs (and at least one) passes the complete device.
(b) With tolerance M, a pair x +- ib is excluded whenever

    (sin^2(pi (x - x_0)/d) + sinh^2(pi b/d)) mu(b, u_1) > 2M,

and (for any on-line part) it passes whenever mu(b, u) <= 2M. For a pair away from the lattice points the threshold is therefore between sqrt(12 M) u^(-3/2) (1 + o(1)) and sqrt(12 M/sin^2(pi (x - x_0)/d)) u_1^(-3/2).
Proof. g_1 in PW_(u_1/2) and s(z) = sin(pi (z - x_0)/d) give g = s g_1 in PW_(u/2) vanishing on the lattice, with abs(g) <= abs(g_1) on R. For such g the on-line part contributes 0 and the off-line part contributes sum_k s(z_k)^2 g_1(z_k) conj(g_1(conj z_k)) (s is real on R). (a) Evaluation of PW_(u_1/2) at 2n distinct points is onto C^(2n) and s(z_k) != 0 off the line, so the values (g(z_k)) are arbitrary; take a vector on which the form of signature (n, n) is negative. (b) For one pair the form on h_1 is that of c |a><a'| + conj(c) |a'><a|, c = s(z)^2, a = v_z, a' = v_(conj z) in L^2 of an interval of length u_1; its lowest eigenvalue is u_1 Re c - sqrt(abs(c)^2 N^2 - u_1^2 (Im c)^2) <= -abs(c)(N - u_1), N = u_1 sinh(u_1 b)/(u_1 b), and abs(c) = sin^2 + sinh^2. The tolerance is at most 2M norm(h_1)^2. The passing side is Theorem 2 (d) with alpha = 0. QED.

Reading. The band u = Lg is P = t/2 pi. Below it the on-line zeros cover every direction of H with weight Lg and an off-line cluster hides behind them when its negative eigenvalues are smaller than Lg. Above it there are test functions that vanish at every on-line zero; on them only the tolerance protects the cluster. The count is that of sampling theory: H restricted to a window of length L has about uL/2 pi dimensions, the on-line zeros give L Lg/2 pi conditions, the difference L u_1/2 pi is free (ARGUED: Landau-Pollak-Slepian count; the proved statement is Theorem 4 for the lattice).

**Theorem 5 (mean-square necessary condition). PROVED.** tr(J G) = 2 n u and tr((J G)^2) = u^2 sum_(k,l) sinc^2(u (z_k - z_l)/2) = int_(-u)^(u) (u - abs(xi)) abs(phi(xi))^2 d xi with phi(xi) = sum_j 2 cosh(b_j xi) e^(i x_j xi). If the cluster passes against a tight background c u (c = (alpha + 2M)/u) then

    sum_(k,l) sinc^2(u (z_k - z_l)/2) <= n c^2 + (2 + c)^2 n^2.

For n = 1 this is sinh(A)/A <= 1 + c: sharp.
Proof. The n negative eigenvalues are >= -cu, the n positive ones sum to 2nu + (sum of the absolute values of the negative ones) <= (2 + c) n u, and the sum of squares of positive numbers is at most the square of their sum. The integral form is the Hilbert-Schmidt norm of the convolution operator with kernel phi(s - s'). QED.
Consequence: a passing cluster with u b_max = A has a transform whose terms are of size e^A and whose mean square over the band is O(n^2): cancellation to relative size n e^(-A). This is the accuracy requirement measured in c16 (ordinates to 100 P^(-b)).

### 2.3 Upper bound for n pairs (relative to Turan's theorem)

**Lemma P (power-sum form). PROVED.** If Z satisfies (D) for the Fejer-modulated tests of Theorem 1 (c) at height t, then for delta <= xi <= u - delta:

    abs( sum_z B_delta(z - t) e^(i xi (z - t)) ) <= M/pi + sum_z B_delta(z - t).

Proof. sum_z w(z) = sum_z B(z - t) + Re[e^(i phi) sum_z B(z - t) e^(i xi (z - t))] (Z is closed under conjugation and B is real on R); int w = 1; choose phi. QED.
Against c16 (T1) to (T3): no second height, no factor (2 - kappa)/kappa, and the range of xi is up to u - delta instead of (1 - kappa) u - delta.

**Corollary T' (relative to Turan's second main theorem).** Let all off-line pairs of Z be (x_j, b_j), j <= n, within distance r of t = x_1, b_1 the largest (one cluster, as in c16 Lemma T; pairs elsewhere are not covered), delta = 1/(r + 1/2), and let D' bound the sum of abs(B_delta(z - t)) over all points z of Z. For every lambda > 0 with (lambda n + 1)(u - delta) >= delta (1 + lambda) n:

    b_1 <= ((1 + lambda) n/((lambda n + 1)(u - delta))) [ n log(8e(1 + lambda)) + log( (M/pi + 2 D')/(0.29 delta) ) ].

With lambda = 5: u b_1 <= 5.85 n (1 + O(1/u)) + 1.2 log((M + 2 pi D')/delta) + O(1).
Proof. As c16 Lemma T, step 3, with Lemma P in place of (T3): nu h = xi, h = (u - delta)/((1 + lambda) n), nu in [lambda n + 1, (1 + lambda) n]. QED relative to the theorem.

### 2.4 Rows

**Theorem 6 (rows; c16 Theorem B for the complete device). PROVED.** A row of pairs x_0 + jd +- ib, j in Z, with d <= 2 pi/u satisfies sum over the row of f = (2/d) int_R f for every f in K_u: for the complete device it is the same as a uniform on-line density 2/d, for every b.
Proof. f(. + ib) is integrable with transform supported in [-u, u] and vanishing at +-u; Poisson summation leaves the term at frequency 0. QED.
The pair density of such a row is at least u/2 pi per unit length: theta' times the density of zeta's zeros. With the total count of zeta (all zeros in pairs) this needs theta' <= 1/2.

### 2.5 The window information law (assembled statement)

Let a device read the zero measure in a window through tests of band u (u = log P) with tolerance M, and let rho = Lg/2 pi be the density of on-line zeros around the window, theta' = u/Lg.

(W1) (PROVED, Theorem 1.) What the device can exclude is contained in {Z : T_Z + 2M is not >= 0 on L^2 of an interval of length u}. This set depends on Z only through the transform sum_z e^(i xi z) for abs(xi) < u.

(W2) Isolated pair. (PROVED for a tight or lattice background.) Largest invisible offset:
- theta' <= 1: the root of sinh(ub)/(ub) = 1 + (Lg + 2M)/u, that is u b = A_1(theta', M) with sinh(A_1)/A_1 = 1 + 1/theta' + 2M/u; for theta' -> 0, A_1 = log(2/theta') + log log(2/theta') + o(1) (the shape of c15 Proposition 5, with the constant now exact for the complete device);
- theta' > 1: between sqrt(12M) u^(-3/2) and sqrt(12M)/abs(sin(pi (x - x_0)/d)) (u - Lg)^(-3/2); zero when M = 0.
So the reach in b is c/log t below the Nyquist band and sqrt(M) (log t)^(-3/2) above it; no band gives a power of t.

(W3) n pairs. Excluded: every cluster with u b_max > 5.85 n + logarithmic terms (Corollary T', relative to Turan; for the Fejer-modulated sub-device already). Not excluded: suitable clusters with u b_max up to about n/2 for large n and up to 1.2 n to 1.7 n for n <= 6 (MEASURED, ball arithmetic, complete device, section 5.1: 0.445 n + 2 in the cos^2 family at n = 40 to 60), and rows of pair density >= u/2 pi with any offset (PROVED, Theorem 6). Clusters of equal offsets and clusters placed on zeta's ordinates show no growth with n (MEASURED, section 5).

(W4) Dependence on (u, L, local density), in one sentence: a band-u device excludes an off-line configuration unless, around its deepest pair, off-line pairs occur with density at least of order u/2 pi over a length of order b_max (two-sided in order: Theorem 6 and section 5.1 on one side, Corollary T' and Theorem 5 on the other). In a window of length L this bounds the invisible offsets by a multiple of L, and the number of pairs needed is at least u b_max/5.85.

(W4') Count-preserving configurations (2n on-line zeros of a window replaced by n pairs): rows on a lattice pass for theta' <= 1/2 (PROVED, Theorem 6); for theta' > 1/2 the gap left in the on-line set carries about 2 n theta' test dimensions against n positive directions of the cluster, and pairs on zeta's ordinates are excluded at offsets tending to 0 as n grows at M = 0 (ARGUED count; MEASURED, section 5.3 reading 2). The band P = sqrt(t/2 pi) is the threshold for this class.

(W5) Configurations passing for every theta < infinity (tolerance M > 0 fixed, height-coupled band u = theta log t, regular on-line background; PROVED from Theorems 2 (d), 4 (b), 6 unless marked):
- all configurations on the line;
- isolated pairs with b_gamma (log gamma)^(3/2) -> 0 (passing: mu(b, u) <= 2M; necessity in the lattice model, pair away from lattice points: Theorem 4 (b));
- rows with pair density >= theta log gamma/2 pi pass at that theta with any offset; to pass for every theta the density must exceed every multiple of log gamma, which no set with O(log gamma) points per unit length has;
- finite tapered rows (MEASURED): they pass at every theta tested with u b_max about n/2; with n at most C log gamma pairs in a window of bounded length this allows b_max up to about C/(2 theta), a strip of fixed width shrinking like 1/theta and not with the height. Under a local count N(t + h) - N(t) = h Lg/2 pi + o(log t) for fixed h (which RH implies and which is not known unconditionally) such rows exist only for theta' <= 1/2 + o(1) (ARGUED: the count of pairs needed in a length 2 pi b_max; not proved for general clusters).
With M = 0 and theta' > 1 the lattice model excludes every finite cluster (Theorem 4 (a)); the exact inequality is then RH restricted to the window and is not available.

Proposed as one row in place of the reach statements of S12b, Q30 and the P45 addendum: the reach of a band-u device is not a region; it is a density condition (W4), with the one-pair constant of (W2). For S12b the common content is that a window of length L offers about uL/2 pi independent conditions at band u; the constant 0.36 per window measured there was not matched to this count (not done).

## 3. Which input would let multiplicativity enlarge u

Prime side of the frame. For the tests of Theorem 1 (h supported on [0, u] after a shift), the explicit formula gives

    <h, T_Z h> = <h, Arch h> - 2 Re <h, A h> + (pole terms),
    A = sum_(n <= e^u) Lambda(n) n^(-1/2) C_(log n),

where C_a is the compression to L^2[0, u] of the shift by a >= 0, and Arch is multiplication of g(x) (the transform of h, x the height) by log(abs(x)/2 pi) + O(1/abs(x)) (CLASSICAL: the Weil explicit formula on the tests g * g~, row P45; signs and lower-order terms as in c15 Lemma 1; not re-derived here). On tests concentrated at height t (abs(x - t) <= t/2, as in hypothesis (H) of c16) Arch is log(t/2 pi) + O(1) and the pole terms are of size e^(u/2)/t^2; a modulation of h by e^(ist) turns the coefficients into Lambda(n) n^(-1/2 - it). A height-coupled complete device needs such a window: by Theorem 1 (a) the unwindowed complete device at one band tests all heights.

**Lemma E (truncated Euler product). PROVED.** C_a C_b = C_(a+b) for a, b >= 0 and C_a = 0 for a >= u. Hence in the commutative algebra generated by the C_a, for every completely multiplicative eps with abs(eps) <= 1:

    sum_(n <= e^u) eps(n) n^(-s) C_(log n) = prod_(p <= e^u) (1 - eps(p) p^(-s) C_(log p))^(-1) =: Z_u(s; eps),
    sum_n eps(n) Lambda(n) n^(-s) C_(log n) = -(d/ds) log Z_u(s; eps).

Proof. For a, b >= 0 and h in L^2[0, u], both C_a C_b h and C_(a+b) h equal h(s - a - b) on [a + b, u] and 0 elsewhere. Unique factorisation gives the product; all sums are finite because the C_a are nilpotent. QED.

So multiplicativity is present exactly, at every finite band, in the operator whose one-sided bound is the device inequality:

    Input N(theta): for all t >= t_0 and u = theta log t,  2 Re <h, A h> <= <h, (Arch + 2M) h>  for h in L^2[0, u] concentrated at height t.

N(theta) is the complete device at band theta log t with a window (Theorem 1 (a)); the unconditional range (c15 item 4) comes from norm(C_a) <= 1 and the l^1 norm of the coefficients, P <= ((1/4) log t log log t)^2, and holds for every sign pattern.

Check against sign twists and random multiplicative chains.
- Lemma E holds for every completely multiplicative chain. The factorisation therefore cannot imply N(theta) for theta >= 1: 24 of 24 seeded random multiplicative sign chains and the Liouville twist violate the indicator-vector sub-device at theta >= 1 (c15 item 5, c16 section 5; MEASURED there), and a violation on a sub-family of vectors is a violation of N(theta).
- A random chain has an Euler product convergent in Re s > 1/2 (CLASSICAL, almost surely) and no functional equation. It fails because Arch (the reserve log(t/2 pi), which is the functional equation) does not belong to it, not for lack of multiplicativity.
- At theta = 1/4 the chains pass the indicator sub-device like zeta at all heights tested (c16: 0 of 24 in 2e6 units). The complete device was not run on the prime side for chains (not run).
What separates zeta in N(theta) is the pairing of the specific coefficients (eps = 1) with the specific reserve. In the frame: N(theta) holds if and only if the truncated data extend to a function with positive real part (Remark K), that is, the frequencies above u can be completed by a positive measure on the line. For 1/2 < theta' <= 1 the functional equation supplies the completion candidate (the reflected half of the approximate functional equation, n -> t/(2 pi n)); for theta' > 1 the data are over-determined by the density of zeros (Theorem 4). In neither range was a step found in which the factorisation of Lemma E gives the one-sided bound. The additional input is therefore named exactly but not supplied:

    a one-sided bound, at every height, for the real part of the logarithmic derivative of the truncated Euler product Z_u(1/2 + it) in the truncated-shift algebra, of size (1/2) log(t/2 pi) + M, for u = theta log t.

Mean-value forms of it (over t) follow from unique factorisation and are the same for every chain (MV-CAP). This lane cannot raise the headline: no named step uses multiplicativity to enlarge u.

## 4. Source check: Turan's second main theorem

Statement used (c16 Lemma T, and Corollary T' here): if abs(z_1) = 1 >= abs(z_2) >= ... >= abs(z_N), then for every integer M >= 0 there is nu in [M + 1, M + N] with abs(sum_n b_n z_n^nu) >= 2 (N/(8e(M + N)))^N min_(1 <= j <= N) abs(b_1 + ... + b_j).
Opened: the Wikipedia article "Turan's method" (https://en.wikipedia.org/wiki/Tur%C3%A1n%27s_method), which states the second theorem in this form (points ordered by decreasing absolute value, abs(z_1) = 1, range nu = M + 1, ..., M + N, bound 2 (N/(8e(M + N)))^N min_j abs(b_1 + ... + b_j)) and cites Montgomery, Ten Lectures (1994) and Turan, On a New Method of Analysis (1984) without inline citations. The Encyclopedia of Mathematics page did not load (HTTP 502). The primary sources were not opened. Status: the statement agrees with a secondary source; Corollary T' and c16 Lemma T remain "relative to Turan's second main theorem (Montgomery, Ten Lectures, chapter 5)". The constant 5.85 depends on 8e; with a constant C in place of 8e it is 1.2 log(6C).

## 5. Decisive test (server, through rhrun; ball arithmetic)

Method. `wil.py`: the criterion of Theorem 3 and its extension above the Nyquist band, in python-flint balls (512 bits; 1024 to 8192 bits where the smaller precision did not decide). A verdict "pass" means that every pivot of an LDL factorisation of the real symmetric form of R K R + R is a ball certified positive; "fail" means that a pivot is certified negative. Both are rigorous for the synthetic set as defined by the stored floating-point data. Thresholds are found by bisection in the offset (9 to 16 steps); bisection assumes that the passing offsets form an interval, which is not proved. `selftest.py`: the closed form of Theorem 2 (c) to 9 digits; agreement of the criterion with the sign of the smallest eigenvalue of a direct discretisation in 20 cases (u/Lg = 0.67, 1.22, 2.22; with and without tolerance, removed and added on-line points); the fast evaluation of the matrix entries against the direct one (difference below 1e-149).

### 5.1 Test A: scale-free clusters against a tight background (u = 1, A = u b, background c u)

One pair: threshold 2.838446380, 2.177318985, 0.763400798 for c = 2, 1, 0.1; closed form of Theorem 2 (c): the same nine digits. (The value 2.9788 written in `PREDICTIONS.md` for c = 2 was an arithmetic slip; the registered formula gives 2.8384.)

Rows of n pairs, spacing 2 pi/kappa (kappa = 1 is the Nyquist spacing), offsets A cos^(2p) (p = 0: equal offsets). Largest passing A:

| n | 1 | 2 | 4 | 8 | 16 | 24 | 32 | 40 | 48 | 60 |
|---|---|---|---|---|---|---|---|---|---|---|
| c = 2, kappa = 2, cos^2 | 2.84 | 3.56 | 4.57 | 6.03 | 9.38 | 12.86 | 16.38 | 19.93 | 23.47 | 28.83 |
| c = 1, kappa = 2, cos^2 | 2.18 | 3.01 | 4.30 | 5.84 | 9.23 | 12.74 | 16.28 | 19.83 | 23.39 | 28.73 |
| c = 0.01, kappa = 2, cos^2 | 0.24 | 0.42 | 2.07 | 4.31 | 8.37 | 12.16 | 15.86 | 19.51 | 23.16 | 28.58 |
| c = 1, kappa = 1.5, cos^2 | | 2.70 | 3.77 | 4.93 | 7.49 | 9.93 | 12.37 | 14.81 | 17.22 | 20.86 |
| c = 1, kappa = 3, cos^2 | | 2.16 | 3.16 | 4.34 | 6.68 | 9.01 | 11.36 | 13.72 | 16.09 | 19.64 |
| c = 1, kappa = 2, equal offsets | | 3.01 | 3.05 | 3.15 | 3.17 | 3.17 | 3.17 | 3.18 | 3.17 | 3.17 |
| c = 1, kappa = 1 (Nyquist), cos^2 | | 1.90 | 2.14 | 2.21 | 2.20 | 2.19 | 2.17 | 2.18 | 2.16 | 2.16 |

(All 16 values of n, kappa in {1, 1.25, 1.5, 2, 3}, p in {0, 1, 2}: `tables.txt`.) At kappa = 2 the increments between n = 40 and n = 60 are 0.445 per pair for c = 2 and c = 1 and 0.454 for c = 0.01: A*(n) = 0.445 n + 2.1 in this family, independent of the background to the first order. This is the law n = 2.2 A of c16 section 4.5, now for the complete device and with the exact criterion. Rows of equal offsets do not grow with n. Rows at the Nyquist spacing itself (kappa = 1) do not grow either: the taper needs room in the band.

Shape-optimised small clusters (`testA2.py`: symmetric positions and relative offsets, Nelder-Mead from three starts, each shape tested rigorously), c = 1: A = 3.35, 5.11, 6.10, 6.21, 7.33, 7.64 for n = 2, 3, 4, 5, 6, 8 (A/n = 1.67, 1.70, 1.52, 1.24, 1.22, 0.96); c = 0.01: 0.85, 2.26, 3.20, 4.55, 5.53, 5.73. These are lower bounds for the supremum over configurations; the local search does not certify an optimum.

Sharpness of the constant. Corollary T' excludes u b_max > 5.85 n + logarithms. Attained: 1.7 n at n = 3, 0.96 n at n = 8, 0.445 n + 2.1 for n = 40 to 60 in one family. The constant of the linear law lies between 0.445 and 5.85; the factor 13 between them is OPEN. Linear growth in n from both sides is established (upper side relative to Turan's theorem).

### 5.2 Test C: one pair in the pure lattice model (Lg = 18.885, the value at 1e9)

theta' = 0.5 and 0.9, M = 0 and 1: thresholds 0.300603, 0.311548, 0.133645, 0.139072, equal to the exact law of Theorem 2 (d) to the six digits printed, at a lattice midpoint, at a lattice point, and with the lattice point removed. (The three positions agree identically for a reason: an on-line zero at the abscissa of the pair is even about it and the negative direction sinh(bs) is odd.)
theta' > 1 (thresholds: midpoint; lattice point), against the proved interval of Theorem 4 (b):

| theta' | M | passes below (proved) | measured, lattice point | measured, midpoint | excluded above at a midpoint (proved) |
|---|---|---|---|---|---|
| 1.07 | 1 | 0.03759 | 0.05724 | 0.11768 | 0.29067 |
| 1.07 | 1e-2 | 0.003813 | 0.006502 | 0.08511 | 0.12643 |
| 1.07 | 1e-4 | 0.000381 | 0.000651 | 0.01582 | 0.02230 |
| 1.5 | 1 | 0.02274 | 0.02401 | 0.05840 | 0.08670 |
| 1.5 | 1e-2 | 0.002297 | 0.002437 | 0.008386 | 0.01186 |
| 1.5 | 1e-4 | 0.000230 | 0.000244 | 0.000844 | 0.001194 |
| 2.2 | 1 | 0.01284 | 0.01348 | 0.01684 | 0.03046 |
| 2.2 | 1e-2 | 0.001293 | 0.001362 | 0.001745 | 0.003209 |
| 2.2 | 1e-4 | 0.000129 | 0.000136 | 0.000175 | 0.000321 |

All inside the proved interval. For small M the thresholds scale like sqrt(M) (factor 9.9 to 10.0 between M = 1e-2 and 1e-4 at theta' = 1.5 and 2.2) and tend to 0 with M: Theorem 4 (a). A pair at a lattice point is detected almost as if there were no background (within 6 percent of the lower bound at theta' >= 1.5).

### 5.3 Test B: clusters on zeta's ordinates near 1e6, 1e9, 1e12, theta in {1/2, 1, 2}

Synthetic set: zeta's ordinates in [T - H, T + H] (H = 45, 30, 22: 172, 179, 181 ordinates), the lattice of spacing 2 pi/log(T/2 pi) outside, tolerance M. Ordinates at 1e6 and 1e9: the files of c16 (differences from mpmath at most 3.6e-7). Ordinates at 1e12: `zeros12.py` (the method of c16; 246 ordinates in [T - 30, T + 30] against 246.31 expected); they are resolved to the spacing of float64 at 1e12, 1.2e-4 (the spot check against mpmath is 1.2e-4), that is 0.05 percent of the mean spacing. The set under test is the stored one. M = 0 is run only below the Nyquist band; above it every finite cluster fails at M = 0 (Theorem 4 (a) for the lattice exterior).

One pair (15 positions each: at an ordinate with the on-line zero kept, and at a midpoint between consecutive ordinates). Largest passing offset b:

| T | theta | M | theta' | pair at an ordinate: min, median, max | pair at a midpoint: min, median, max | reference (lattice model) | c15 region c_theta/L |
|---|---|---|---|---|---|---|---|
| 1e+06 | 0.5 | 0 | 0.577 | 0.3191, 0.3559, 0.4074 | 0.3117, 0.3852, 0.4301 | exact law: 0.3901 | 0.534 |
| 1e+06 | 0.5 | 1 | 0.577 | 0.3532, 0.3847, 0.4299 | 0.3498, 0.4091, 0.4489 | exact law: 0.4126 | 0.534 |
| 1e+06 | 1 | 1 | 1.153 | 0.0870, 0.0936, 0.1128 | 0.0855, 0.1678, 0.1775 | passes below 0.0661 | 0.217 |
| 1e+06 | 2 | 1 | 2.307 | 0.0243, 0.0250, 0.0455 | 0.0243, 0.0313, 0.0726 | passes below 0.0236 | 0.083 |
| 1e+09 | 0.5 | 0 | 0.549 | 0.2166, 0.2402, 0.2839 | 0.2149, 0.2520, 0.2859 | exact law: 0.2649 | 0.356 |
| 1e+09 | 0.5 | 1 | 0.549 | 0.2329, 0.2532, 0.2932 | 0.2310, 0.2642, 0.2947 | exact law: 0.2747 | 0.356 |
| 1e+09 | 1 | 1 | 1.097 | 0.0448, 0.0709, 0.0936 | 0.0611, 0.1028, 0.1128 | passes below 0.0362 | 0.145 |
| 1e+09 | 2 | 1 | 2.195 | 0.0130, 0.0140, 0.0240 | 0.0133, 0.0216, 0.0465 | passes below 0.0129 | 0.056 |
| 1e+12 | 0.5 | 0 | 0.536 | 0.1646, 0.1809, 0.1983 | 0.1643, 0.1912, 0.2188 | exact law: 0.2004 | 0.267 |
| 1e+12 | 0.5 | 1 | 0.536 | 0.1731, 0.1887, 0.2044 | 0.1729, 0.1978, 0.2236 | exact law: 0.2059 | 0.267 |
| 1e+12 | 1 | 1 | 1.071 | 0.0357, 0.0440, 0.0609 | 0.0465, 0.0770, 0.0862 | passes below 0.0236 | 0.108 |
| 1e+12 | 2 | 1 | 2.143 | 0.0084, 0.0091, 0.0162 | 0.0086, 0.0143, 0.0333 | passes below 0.0084 | 0.042 |

Readings.
- theta = 1/2 (below the Nyquist band). The median threshold at an ordinate is 0.90 to 0.91 of the exact lattice law at the three heights, at a midpoint 0.95 to 0.99; the extremes over the 30 positions are within 0.80 and 1.10 of it (M = 0; with M = 1 the medians are 0.92 to 0.93). In the scale-free variable the median is u b = 2.46, 2.49, 2.50 at 1e6, 1e9, 1e12 (lattice: 2.69, 2.74, 2.77). The one-pair constant of Theorem 2 is attained on zeta's ordinates to about 10 percent at all three heights (MEASURED); the exact law is PROVED for the lattice at every height.
- theta = 2 (above it), M = 1: the median at an ordinate is 1.05, 1.08, 1.08 times sqrt(12 M) u^(-3/2), and no threshold is below the proved passing bound. The thresholds are 0.30, 0.25, 0.22 of the c15 region c_theta/L: the reach scales like (log T)^(-3/2), not (log T)^(-1). At midpoints the largest thresholds (0.073, 0.047, 0.033) are above the lattice-model exclusion bound for a lattice midpoint (0.052, 0.031, 0.021): zeta's ordinates are not the lattice and a pair in a long gap is less visible. Prediction B2 was wrong in this respect, and its sizes (computed with u - Lg) were too large by a factor 2 to 3.
- theta = 1 (theta' = 1.15, 1.10, 1.07): medians 0.094, 0.071, 0.044 at an ordinate, about 0.4 to 0.5 of the c15 region.
- Against the Fejer-translate device of c16 (its section 4.1, M = 0 and 1): one-pair medians there 0.474 and 0.317 at theta = 1/2 (1e6, 1e9) and 0.169 to 0.199 and 0.128 to 0.135 at theta = 1; the complete device gives 0.356 and 0.240, and 0.094 and 0.071. The complete device excludes more, as it must (Theorem 1).

Clusters of n pairs. Modes: on consecutive ordinates with the on-line zeros kept (added); count preserved (pairs on every second ordinate, both ordinates removed); rows with free positions centred at T. Largest passing value of the deepest offset (cap 0.4999; "<1e-4": fails at the smallest offset tested, 1e-4; 0.000 stands for a threshold between 1e-4 and 5e-4):

| T | theta | M | mode | n=1 | n=2 | n=4 | n=8 | n=12 | n=16 | n=24 | n=32 | n=40 | n=60 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1e+06 | 0.5 | 0 | on ordinates, equal offsets, added | 0.346 | 0.421 | 0.304 | 0.292 | 0.275 | 0.283 | 0.288 | 0.293 | 0.292 | 0.291 |
| 1e+06 | 0.5 | 0 | on ordinates, cos^2 offsets, added | 0.346 | 0.421 | 0.445 | 0.389 | 0.358 | 0.344 | 0.325 | 0.316 | 0.310 | 0.303 |
| 1e+06 | 0.5 | 0 | count preserved, equal offsets | 0.284 | 0.189 | 0.152 | 0.043 | 0.025 | 0.010 | 0.001 | 0.000 | <1e-4 | <1e-4 |
| 1e+06 | 0.5 | 0 | count preserved, cos^2 offsets | 0.284 | 0.189 | 0.180 | 0.069 | 0.034 | 0.013 | 0.001 | 0.000 | <1e-4 | <1e-4 |
| 1e+06 | 0.5 | 0 | row, spacing 2 pi/(1.25 u), cos^2 | 0.403 | 0.373 | 0.472 | cap | cap | cap | cap | cap | cap | cap |
| 1e+06 | 0.5 | 0 | row, spacing pi/u, cos^2 | 0.403 | cap | cap | cap | cap | cap | cap | cap | cap | cap |
| 1e+06 | 0.5 | 1 | on ordinates, equal offsets, added | 0.376 | 0.445 | 0.326 | 0.312 | 0.291 | 0.297 | 0.302 | 0.307 | 0.306 | 0.305 |
| 1e+06 | 0.5 | 1 | on ordinates, cos^2 offsets, added | 0.376 | 0.445 | 0.470 | 0.410 | 0.376 | 0.358 | 0.340 | 0.330 | 0.324 | 0.316 |
| 1e+06 | 0.5 | 1 | count preserved, equal offsets | 0.334 | 0.230 | 0.197 | 0.128 | 0.120 | 0.112 | 0.107 | 0.107 | 0.106 | 0.103 |
| 1e+06 | 0.5 | 1 | count preserved, cos^2 offsets | 0.334 | 0.230 | 0.229 | 0.182 | 0.153 | 0.139 | 0.126 | 0.120 | 0.117 | 0.111 |
| 1e+06 | 0.5 | 1 | row, spacing 2 pi/(1.25 u), cos^2 | 0.426 | 0.400 | 0.490 | cap | cap | cap | cap | cap | cap | cap |
| 1e+06 | 0.5 | 1 | row, spacing pi/u, cos^2 | 0.426 | cap | cap | cap | cap | cap | cap | cap | cap | cap |
| 1e+06 | 1 | 1 | on ordinates, equal offsets, added | 0.089 | 0.070 | 0.062 | 0.058 | 0.050 | 0.047 | 0.044 | 0.042 | 0.042 | 0.041 |
| 1e+06 | 1 | 1 | on ordinates, cos^2 offsets, added | 0.089 | 0.070 | 0.069 | 0.067 | 0.065 | 0.062 | 0.057 | 0.053 | 0.051 | 0.047 |
| 1e+06 | 1 | 1 | count preserved, equal offsets | 0.072 | 0.066 | 0.052 | 0.050 | 0.049 | 0.048 | 0.048 | 0.046 | 0.046 | 0.045 |
| 1e+06 | 1 | 1 | count preserved, cos^2 offsets | 0.072 | 0.066 | 0.058 | 0.054 | 0.053 | 0.052 | 0.051 | 0.050 | 0.050 | 0.049 |
| 1e+06 | 1 | 1 | row, spacing 2 pi/(1.25 u), cos^2 | 0.127 | 0.144 | 0.185 | 0.262 | 0.308 | 0.369 | 0.475 | cap | cap | cap |
| 1e+06 | 1 | 1 | row, spacing pi/u, cos^2 | 0.127 | 0.203 | 0.304 | 0.417 | cap | cap | cap | cap | cap | cap |
| 1e+06 | 2 | 1 | on ordinates, equal offsets, added | 0.025 | 0.024 | 0.023 | 0.018 | 0.018 | 0.018 | 0.016 | 0.016 | 0.016 | 0.015 |
| 1e+06 | 2 | 1 | on ordinates, cos^2 offsets, added | 0.025 | 0.024 | 0.024 | 0.024 | 0.022 | 0.021 | 0.019 | 0.019 | 0.018 | 0.018 |
| 1e+06 | 2 | 1 | count preserved, equal offsets | 0.025 | 0.024 | 0.021 | 0.020 | 0.020 | 0.020 | 0.020 | 0.019 | 0.019 | 0.019 |
| 1e+06 | 2 | 1 | count preserved, cos^2 offsets | 0.025 | 0.024 | 0.024 | 0.023 | 0.022 | 0.022 | 0.021 | 0.021 | 0.021 | 0.020 |
| 1e+06 | 2 | 1 | row, spacing 2 pi/(1.25 u), cos^2 | 0.031 | 0.042 | 0.061 | 0.115 | 0.142 | 0.170 | 0.224 | 0.281 | 0.334 | 0.466 |
| 1e+06 | 2 | 1 | row, spacing pi/u, cos^2 | 0.031 | 0.060 | 0.126 | 0.205 | 0.267 | 0.329 | 0.458 | cap | cap | cap |
| 1e+09 | 0.5 | 0 | on ordinates, equal offsets, added | 0.265 | 0.323 | 0.249 | 0.227 | 0.210 | 0.229 | 0.189 | 0.164 | 0.184 | 0.187 |
| 1e+09 | 0.5 | 0 | on ordinates, cos^2 offsets, added | 0.265 | 0.323 | 0.390 | 0.358 | 0.320 | 0.302 | 0.279 | 0.267 | 0.257 | 0.238 |
| 1e+09 | 0.5 | 0 | count preserved, equal offsets | 0.196 | 0.127 | 0.110 | 0.055 | 0.036 | 0.028 | 0.010 | 0.002 | 0.000 | <1e-4 |
| 1e+09 | 0.5 | 0 | count preserved, cos^2 offsets | 0.196 | 0.127 | 0.121 | 0.073 | 0.045 | 0.035 | 0.012 | 0.002 | 0.000 | <1e-4 |
| 1e+09 | 0.5 | 0 | row, spacing 2 pi/(1.25 u), cos^2 | 0.254 | 0.250 | 0.329 | 0.401 | 0.472 | cap | cap | cap | cap | cap |
| 1e+09 | 0.5 | 0 | row, spacing pi/u, cos^2 | 0.254 | 0.317 | 0.433 | cap | cap | cap | cap | cap | cap | cap |
| 1e+09 | 0.5 | 1 | on ordinates, equal offsets, added | 0.276 | 0.339 | 0.259 | 0.237 | 0.219 | 0.236 | 0.197 | 0.171 | 0.189 | 0.192 |
| 1e+09 | 0.5 | 1 | on ordinates, cos^2 offsets, added | 0.276 | 0.339 | 0.399 | 0.368 | 0.328 | 0.310 | 0.286 | 0.273 | 0.265 | 0.245 |
| 1e+09 | 0.5 | 1 | count preserved, equal offsets | 0.214 | 0.151 | 0.138 | 0.087 | 0.076 | 0.071 | 0.065 | 0.062 | 0.059 | 0.059 |
| 1e+09 | 0.5 | 1 | count preserved, cos^2 offsets | 0.214 | 0.151 | 0.148 | 0.115 | 0.095 | 0.086 | 0.075 | 0.071 | 0.069 | 0.066 |
| 1e+09 | 0.5 | 1 | row, spacing 2 pi/(1.25 u), cos^2 | 0.267 | 0.263 | 0.336 | 0.407 | 0.477 | cap | cap | cap | cap | cap |
| 1e+09 | 0.5 | 1 | row, spacing pi/u, cos^2 | 0.267 | 0.330 | 0.438 | cap | cap | cap | cap | cap | cap | cap |
| 1e+09 | 1 | 1 | on ordinates, equal offsets, added | 0.061 | 0.038 | 0.035 | 0.034 | 0.033 | 0.033 | 0.032 | 0.032 | 0.031 | 0.024 |
| 1e+09 | 1 | 1 | on ordinates, cos^2 offsets, added | 0.061 | 0.038 | 0.039 | 0.037 | 0.036 | 0.036 | 0.035 | 0.034 | 0.034 | 0.033 |
| 1e+09 | 1 | 1 | count preserved, equal offsets | 0.041 | 0.040 | 0.028 | 0.026 | 0.025 | 0.025 | 0.024 | 0.024 | 0.024 | 0.024 |
| 1e+09 | 1 | 1 | count preserved, cos^2 offsets | 0.041 | 0.040 | 0.036 | 0.031 | 0.029 | 0.028 | 0.027 | 0.026 | 0.026 | 0.025 |
| 1e+09 | 1 | 1 | row, spacing 2 pi/(1.25 u), cos^2 | 0.086 | 0.088 | 0.122 | 0.175 | 0.204 | 0.242 | 0.314 | 0.386 | 0.458 | cap |
| 1e+09 | 1 | 1 | row, spacing pi/u, cos^2 | 0.086 | 0.134 | 0.200 | 0.281 | 0.361 | 0.444 | cap | cap | cap | cap |
| 1e+09 | 2 | 1 | on ordinates, equal offsets, added | 0.014 | 0.011 | 0.011 | 0.010 | 0.009 | 0.009 | 0.009 | 0.009 | 0.009 | 0.009 |
| 1e+09 | 2 | 1 | on ordinates, cos^2 offsets, added | 0.014 | 0.011 | 0.011 | 0.011 | 0.011 | 0.011 | 0.011 | 0.010 | 0.010 | 0.010 |
| 1e+09 | 2 | 1 | count preserved, equal offsets | 0.013 | 0.013 | 0.011 | 0.011 | 0.011 | 0.010 | 0.010 | 0.010 | 0.010 | 0.010 |
| 1e+09 | 2 | 1 | count preserved, cos^2 offsets | 0.013 | 0.013 | 0.012 | 0.012 | 0.011 | 0.011 | 0.011 | 0.011 | 0.011 | 0.011 |
| 1e+09 | 2 | 1 | row, spacing 2 pi/(1.25 u), cos^2 | 0.021 | 0.024 | 0.045 | 0.073 | 0.092 | 0.109 | 0.148 | 0.186 | 0.221 | 0.310 |
| 1e+09 | 2 | 1 | row, spacing pi/u, cos^2 | 0.021 | 0.034 | 0.086 | 0.131 | 0.176 | 0.219 | 0.306 | 0.391 | 0.476 | cap |
| 1e+12 | 0.5 | 0 | on ordinates, equal offsets, added | 0.189 | 0.226 | 0.216 | 0.160 | 0.174 | 0.143 | 0.146 | 0.146 | 0.128 | 0.137 |
| 1e+12 | 0.5 | 0 | on ordinates, cos^2 offsets, added | 0.189 | 0.226 | 0.270 | 0.260 | 0.242 | 0.226 | 0.203 | 0.189 | 0.178 | 0.164 |
| 1e+12 | 0.5 | 0 | count preserved, equal offsets | 0.125 | 0.155 | 0.097 | 0.055 | 0.041 | 0.030 | 0.015 | 0.005 | 0.002 | 0.000 |
| 1e+12 | 0.5 | 0 | count preserved, cos^2 offsets | 0.125 | 0.155 | 0.134 | 0.080 | 0.058 | 0.041 | 0.020 | 0.007 | 0.003 | 0.000 |
| 1e+12 | 0.5 | 0 | row, spacing 2 pi/(1.25 u), cos^2 | 0.210 | 0.207 | 0.251 | 0.304 | 0.352 | 0.410 | cap | cap | cap | cap |
| 1e+12 | 0.5 | 0 | row, spacing pi/u, cos^2 | 0.210 | 0.275 | 0.338 | 0.440 | cap | cap | cap | cap | cap | cap |
| 1e+12 | 0.5 | 1 | on ordinates, equal offsets, added | 0.195 | 0.231 | 0.222 | 0.165 | 0.178 | 0.147 | 0.148 | 0.148 | 0.132 | 0.140 |
| 1e+12 | 0.5 | 1 | on ordinates, cos^2 offsets, added | 0.195 | 0.231 | 0.273 | 0.265 | 0.246 | 0.230 | 0.208 | 0.192 | 0.182 | 0.167 |
| 1e+12 | 0.5 | 1 | count preserved, equal offsets | 0.140 | 0.166 | 0.107 | 0.067 | 0.055 | 0.047 | 0.039 | 0.036 | 0.036 | 0.035 |
| 1e+12 | 0.5 | 1 | count preserved, cos^2 offsets | 0.140 | 0.166 | 0.147 | 0.097 | 0.075 | 0.063 | 0.050 | 0.045 | 0.042 | 0.039 |
| 1e+12 | 0.5 | 1 | row, spacing 2 pi/(1.25 u), cos^2 | 0.216 | 0.213 | 0.255 | 0.307 | 0.355 | 0.413 | cap | cap | cap | cap |
| 1e+12 | 0.5 | 1 | row, spacing pi/u, cos^2 | 0.216 | 0.279 | 0.340 | 0.442 | cap | cap | cap | cap | cap | cap |
| 1e+12 | 1 | 1 | on ordinates, equal offsets, added | 0.038 | 0.035 | 0.028 | 0.025 | 0.019 | 0.018 | 0.018 | 0.018 | 0.018 | 0.018 |
| 1e+12 | 1 | 1 | on ordinates, cos^2 offsets, added | 0.038 | 0.035 | 0.035 | 0.032 | 0.028 | 0.026 | 0.023 | 0.021 | 0.020 | 0.019 |
| 1e+12 | 1 | 1 | count preserved, equal offsets | 0.043 | 0.020 | 0.019 | 0.019 | 0.017 | 0.017 | 0.017 | 0.016 | 0.016 | 0.016 |
| 1e+12 | 1 | 1 | count preserved, cos^2 offsets | 0.043 | 0.020 | 0.020 | 0.019 | 0.019 | 0.019 | 0.019 | 0.019 | 0.019 | 0.018 |
| 1e+12 | 1 | 1 | row, spacing 2 pi/(1.25 u), cos^2 | 0.074 | 0.069 | 0.093 | 0.131 | 0.155 | 0.183 | 0.235 | 0.292 | 0.344 | 0.475 |
| 1e+12 | 1 | 1 | row, spacing pi/u, cos^2 | 0.074 | 0.112 | 0.156 | 0.207 | 0.272 | 0.335 | 0.461 | cap | cap | cap |
| 1e+12 | 2 | 1 | on ordinates, equal offsets, added | 0.009 | 0.009 | 0.006 | 0.006 | 0.006 | 0.006 | 0.006 | 0.006 | 0.006 | 0.005 |
| 1e+12 | 2 | 1 | on ordinates, cos^2 offsets, added | 0.009 | 0.009 | 0.008 | 0.007 | 0.006 | 0.006 | 0.006 | 0.006 | 0.006 | 0.006 |
| 1e+12 | 2 | 1 | count preserved, equal offsets | 0.009 | 0.008 | 0.008 | 0.007 | 0.006 | 0.006 | 0.006 | 0.006 | 0.006 | 0.006 |
| 1e+12 | 2 | 1 | count preserved, cos^2 offsets | 0.009 | 0.008 | 0.008 | 0.008 | 0.008 | 0.007 | 0.007 | 0.007 | 0.007 | 0.007 |
| 1e+12 | 2 | 1 | row, spacing 2 pi/(1.25 u), cos^2 | 0.009 | 0.010 | 0.039 | 0.057 | 0.068 | 0.080 | 0.109 | 0.137 | 0.164 | 0.230 |
| 1e+12 | 2 | 1 | row, spacing pi/u, cos^2 | 0.009 | 0.016 | 0.069 | 0.095 | 0.133 | 0.164 | 0.228 | 0.292 | 0.356 | cap |

(All n in {1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 40, 60}: `tables.txt`. Undecided cells: 0. The cells with n >= 24 that 512 bits did not decide were decided by a fill pass at 2048 and 4096 bits.)

Readings.
1. Clusters placed on zeta's ordinates do not hide deeper as n grows, at any theta: the threshold stays within a factor 1.5 of the one-pair value for every n up to 60 and shows no growth with n (equal offsets, theta = 2: 0.025 to 0.015 at 1e6, 0.014 to 0.009 at 1e9, 0.009 to 0.005 at 1e12 for n from 1 to 60). Prediction B4 holds.
2. Count-preserving replacement on zeta's ordinates at theta = 1/2 (theta' = 0.58, 0.55, 0.54), M = 0: 0.284, 0.196, 0.125 for one pair; 0.025, 0.036, 0.041 for 12 pairs; 0.001, 0.010, 0.015 for 24 pairs; below 1e-4 at n = 40 (1e6) and n = 60 (1e9), and below 5e-4 at n = 60 (1e12), against the c15 region 0.53, 0.36, 0.27. With M = 1 the thresholds level off (0.103, 0.059, 0.035 at n = 60). This is the configuration type of zeta(s+a) zeta(s-a) restricted to a window. Reading by the count of section 2.2: replacing 2n on-line zeros by n pairs opens a gap of length L = 2n/density in the on-line set; the tests concentrated in the gap span about uL/2 pi = 2 n theta' dimensions and the cluster has n positive directions, so for theta' > 1/2 and n large some test in the gap sees a non-positive form whatever the offsets are (ARGUED; the measured thresholds tend to 0 with n as this predicts). For theta' <= 1/2 exact lattice rows of the full density are invisible (Theorem 6). So theta' = 1/2, that is P = sqrt(t/2 pi), is the threshold for count-preserving configurations: PROVED on the passing side for rows, MEASURED and ARGUED on the excluding side. The Fejer-translate device of c16 (section 4.4, lattice-placed rows) passed 0.30 to 0.35 at this theta.
3. Rows with free positions (spacing pi/u, cos^2 offsets) pass with a deepest offset growing linearly in n at every height and every theta: at theta = 2 the value at n = 16 is 0.329, 0.219, 0.164, that is u b = 9.09, 9.08, 9.06 at 1e6, 1e9, 1e12; at n = 24: u b = 12.65, 12.68, 12.60; at n = 32: 16.2, 16.1 (1e9, 1e12; cap at 1e6); at n = 40: 19.7, 19.7. Test A (c = 0.01 to 1) gives 8.4 to 9.2, 12.2 to 12.7, 15.9 to 16.3, 19.5 to 19.8: the scale-free law of section 5.1 is reproduced on zeta's ordinates at the three heights, with the same increment 0.44 per pair. At theta = 1/2 the cap 0.4999 is reached from n = 2, 6, 12 on. The slope in b is 0.44/u to 0.57/u per pair, not 1/(2 (u - Lg)) as registered in B3.
4. Such a row has 2u/pi zeros per unit length: 4 theta' times the density of zeta's zeros (9 times at theta = 2). The passing rows are exactly the configurations with a local density of off-line pairs above u/2 pi, as in (W4).

Sharpness, all-heights form. PROVED for every height: the frame (Theorem 1), the one-pair law against a tight or lattice background (Theorems 2, 3), the transition and the two-sided one-pair bounds above it (Theorem 4), rows (Theorem 6). MEASURED at the three heights: the same constants on zeta's ordinates (one pair: 0.90 to 0.99 of the lattice law in the median below the Nyquist band; 1.05 to 1.08 of the proved passing bound above it; rows: u b = 9.1, 12.6, 16.2, 19.7 at n = 16, 24, 32, 40, the scale-free values, at the heights where the cap is not reached). OPEN: the constant of the linear law between 0.445 and 5.85; any statement for zeta's ordinates at all heights.

### 5.4 Units and limits

Units (all through rhrun; all finished or stopped; none left running): rh-c17wil-self-1120005051, -self-1120005213, -self-1120012609 (selftests), -zeros12-1120005101, -testA-1120005441, -testA2-1120010110, -testAb-1120010139 (stopped after seconds: it would have exceeded 8 cores), -testAb-1120010444, -testC-1120011553, -testB69-1120005441 and -testB12-1120011847 (stopped after the theta = 2 cells at 1e6 and part of 1e9, 1e12: the matrix entries were then evaluated 5 times faster and the runs restarted), -testB9-1120013100, -testB12-1120013100, -testB6-1120014426, -hp6-1120022346 (stopped at start, replaced by the fill pass), -fill6-1120022412, -fill9-1120024241, -fill12-1120024241 (adaptive precision for the cells undecided at 512 bits; the last two were killed by their own 3 GB memory limit, which had been set low because rhrun had refused a larger request while the machine was short of memory), -fill9b-1120032551, -fill12b-1120032551 (the remaining theta = 1/2 cells only, limit 8 GB, inside the lane allowance of 12 GB). Cores: at most 8 held by the lane, except about one minute at 9 before the first -testAb unit was stopped. Memory: below 1 GB per unit. One launch was refused by rhrun for machine memory (other users' load) and repeated with a smaller limit. The machine load was 130 to 180 during the runs.
Local runs: none (no numerical library in the local Python); `aggregate.py` and `build_result.py` are text processing.

## 6. Controls

By Theorem 1 a band-u device sees a function only through its zero configuration (when the explicit formula holds for it with the same archimedean term) or not at all (when it does not). No control fails at a step of an argument, because the lane contains no argument beyond the frame.

| Control | Outcome for the complete device | Reason |
|---|---|---|
| Davenport-Heilbronn | fails at large height | its off-line pairs are isolated (bounded number per window): excluded by (W2), (W3); zero location only; the identity holds for it with its own gamma factor |
| T-NR (xi times q^z + c + q^(-z), abs(c) > 2) | its row is invisible for P <= q, for every offset (the control passes whenever the xi factor does); visible above | its off-line row has spacing 2 pi/log q: Theorem 6, exact for the complete device |
| zeta(s+a) zeta(s-a) | fails in a window (MEASURED on the window type: count-preserving and added pairs on zeta's ordinates, section 5.3 readings 1, 2) | pairs at zeta's own ordinates; the ordinates are not a lattice; excluded down to 0.03 to 0.04 at theta = 1/2 with 12 pairs and below 1e-3 with 40 to 60 pairs (M = 0) |
| ZQ (zeta times a rational symmetric multiplier) | passes in the window when the multiplier's quadruples form a tapered row of spacing below 2 pi/u (rows of section 5.3: at theta = 2 with u b_max = 0.44 n + 2); fails for quadruples on zeta's ordinates beyond the one-pair scale | density of off-line pairs, (W4); a fixed multiplier is tested at finitely many heights only |
| Sign-twisted primes, random multiplicative chains, unimodular twist | no zero-side identity with zeta's archimedean term; they have the truncated Euler product of Lemma E and violate the indicator-vector sub-device at theta >= 1 (c15, c16; not rerun) | the reserve log(t/2 pi) is the functional equation; multiplicativity is present and does not help |
| Backward heat (tau < 0) | passes or fails through its zero set only; not run | its off-line pairs enter T_Z like any others |
| Beurling systems, phase-rotated transfer operator, theta^w | not formulated in the frame beyond "a zero configuration"; not run | no step to test |

R3 is not met: T-NR and ZQ pass in a window, and the others fail through zero location only.

## 7. Requirement flags

- R1 (multiplicativity essential): no. Theorems 1 to 6 are about point configurations. Lemma E shows where multiplicativity sits (an exact factorisation at every band) and that every multiplicative chain has it; no step uses it to obtain an inequality.
- R2 (height-uniform, every window): no. The laws are uniform in u and in the density (all heights) in the lattice model, as statements about what a device excludes. No device inequality is established at any theta > 0 for zeta; the zeta-background numbers are at three heights.
- R3 (every control fails at a named structural step): no (section 6).
- R4 (reaches the critical line): no. The lane shows the limit of the device class: at band u the reach is a density condition; for one pair c/log t below P = t/2 pi and sqrt(M) (log t)^(-3/2) above; exact reach (M = 0 above the Nyquist band) is the target itself in a window.

## 8. Three weakest steps

1. The window. The proved exact statements are for a tight or lattice on-line background (Theorems 2 (d), 3, 4). For zeta the on-line zeros are not a lattice, the complete device without a window tests all heights at once, and the synthetic sets of section 5.3 model the exterior of the window by a lattice. The transfer to "a device that reads a window of length L" is the Landau-Pollak-Slepian count (ARGUED) plus the measurements; frame bounds of zeta's ordinates in a window were not computed, so prediction B1 was not evaluated in its registered form. The window half-lengths (45, 30, 22) were not varied.
2. The constant of the linear law. Upper bound 5.85 n relative to Turan's second main theorem (secondary source only; Corollary T' is written for one cluster near the height, with the other points entering through D'); lower bounds 0.445 n (one family, n up to 60) and 0.96 n to 1.7 n (local optimisation, n <= 8). The factor between them is open, and (W4) is two-sided in order only. Thresholds come from bisection, which assumes that the passing offsets form an interval; the families are not exhaustive, so every measured threshold for a mode is a statement about that mode only.
3. Lemma 0 (factorisation of non-negative entire functions of exponential type) and the explicit formula in the operator form of section 3 are recalled, not opened; the second is not re-derived in the normalisation used here (signs and the lower-order archimedean terms are taken from c15 Lemma 1). The ordinates at 1e12 are resolved to 1.2e-4 only. The count argument for count-preserving replacement (section 5.3, reading 2) is not a proof.

## 9. Files

`wil.py` (the criterion in ball arithmetic), `selftest.py`, `testA.py`, `testA2.py`, `testB.py`, `testC.py`, `zeros12.py` with `zeros_1e+12.json` (ordinates at 1e6 and 1e9 are read from the c16 directory), `aggregate.py`, `build_result.py`, `tables.txt` (all tables), `logs/` (unit logs, JSON lines: every threshold with its mode and timing), `PREDICTIONS.md`, `header.md`, `RESULT_theory.md`, `tests.md`, `tail.md` (the parts of this file), `lanes.jsonl`.

Proposed map text (one row for the reach of band-limited devices, in place of the reach sentences of S12b, Q30 and the P45 addendum): "A positivity statement with tests of band u = log P is the quadratic form of T_Z = sum_z |v_z><v_conj z| on L^2 of an interval of length u, tested on a set of vectors (C(theta): modulated indicators). Complete device, regular on-line background of density Lg/2 pi, tolerance M: a cluster of n pairs has n negative directions; one pair is invisible up to sinh(ub)/(ub) = 1 + (Lg + 2M)/u for u <= Lg (PROVED, lattice) and up to about sqrt(12M) u^(-3/2) for u > Lg (PROVED two-sided, lattice; zero at M = 0); n pairs hide up to u b_max between 0.445 n (MEASURED) and 5.85 n + logs (relative to Turan), and only with off-line pair density of order u/2 pi; rows of that density pass with any offset (PROVED). The truncated Euler product is exact in the truncated-shift algebra for every multiplicative chain; no step uses it. `c17-window-information-law-ctheta-u5`."
