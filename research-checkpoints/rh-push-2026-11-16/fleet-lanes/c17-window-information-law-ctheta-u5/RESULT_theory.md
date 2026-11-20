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
