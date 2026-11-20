# c16-ctheta-proposition5-power-sum: Proposition 5 of c15 for arbitrary zero configurations

Date: 2026-11-19. Kind: deepen (R4 lane). Source: `push/c15-u7-growing-section-twin-ladder-bridge` (RESULT.md, REFEREE.md), map rows P45, Q25.
Labels: PROVED (argument in this note; author only), CLASSICAL (recalled, source not opened), MEASURED (float64 unless "ball" is stated), ARGUED, OPEN.

Nothing here proves or refutes RH. No statement about a zero of zeta is established. No bound moves.

## 0. Verdict

**Precise obstruction. Proposition 5 of c15 does not hold for arbitrary configurations, in either direction. The statement C(theta) does not confine off-line zeros to a region beta - 1/2 <= c_theta/log gamma with c_theta depending on theta only: the constant grows linearly with the number n of off-line pairs near the height, and with n of order log gamma no bound follows. In the other direction the region does not imply C(theta') with a fixed M; it implies it with M replaced by C log^2 t. No two-sided correspondence exists that would fix the reach of the P = t^theta devices as a zero-free region of width c/log gamma. No step uses multiplicativity.**

Notation. L = log t, u = log P, F_u(z) = (1 - cos(uz))/(u z^2) (entire). A synthetic zero set is a set of on-line ordinates gamma and off-line pairs (gamma_j, b_j), b_j in (0, 1/2], each pair standing for the zeros 1/2 +- b_j + i gamma_j. G_u(t) denotes the sum over the set of the kernel K_u of c15; for zeta it is Re L_F(1/2 + it). C(theta): G_u(t) >= -M for all t >= t_0 and all u <= theta log t. "Region" at height e^L: b <= c_theta/L with c_theta = log(20/theta)/theta (c15, Proposition 5).

1. (PROVED, Lemma A) G_u(t) = sum over on-line ordinates of F_u(t - gamma) + sum over pairs of 2 Re F_u(t - gamma_j + i b_j). The first sum is >= 0 termwise.
2. (PROVED, Theorem B) An infinite row of pairs with equal offset b and ordinates on a lattice of spacing d contributes exactly (2 pi/d)[1 + 2 sum_{k >= 1, k v_1 < u} (1 - k v_1/u) cosh(k v_1 b) cos(k v_1 y)], v_1 = 2 pi/d. For d <= 2 pi/u this is the constant 2 pi/d for every b: the row is invisible to every section with P <= e^(2 pi/d). For 2 pi/u < d < 4 pi/u the row alone is negative somewhere once cosh(v_1 b) > 1/(2(1 - v_1/u)). This is control T-NR read at variable q (the factor q^(s-1/2) + c + q^(1/2-s), abs(c) > 2, has such a row with d = 2 pi/log q).
3. (PROVED from Turan's second main theorem, CLASSICAL; Lemma T) If all off-line pairs of the set lie in one cluster of n pairs of diameter r, then C(theta) forces max b_j <= (2/((1 - kappa) u - delta)) [n log(16e) + log((D' + (2 - kappa)(M + D)/(pi kappa))/(0.29 delta))] with delta = 1/(r + 1/2), D and D' weighted zero counts (of size log t for a set with zeta's density). With kappa = 1/2: b_max <= (15.1 n + 4 log log t + 4 log(M + 1) + 4 log(r + 1) + C)/(theta log t). The dependence on n is linear.
4. (MEASURED; ball arithmetic on grids) Linear dependence on n is attained. Cluster alone (no on-line zeros, scale-free): tapered lattice rows with n pairs pass (inf G >= -1e-3 in units of u) up to u b_max = n/2 for n = 12 to 40, with optimised positions up to u b_max = 1, 3, 4, 7, 8 for n = 2, 3, 4, 6, 8; one pair alone never passes. Added to the on-line ordinates of zeta at heights 1e6 to 1e9 (342 to 541 ordinates per window), clusters of 3 to 40 quadruples pass with their deepest pair at 1.6 to 3.4 times the region for theta = 1 (at T = 1e9: 0.25 with 3 quadruples, 0.45 with 12, 0.49 with 40, against the region 0.145), and at the edge of the strip (b = 0.49) for theta = 1/2 (section 4.2). Rows built in ball arithmetic pass up to u b_max = 160 with n = 2.5 u b_max pairs (section 4.5). At theta = 1/4 the region is wider than the critical strip at all four heights (c_theta/L >= 0.85) and one pair at b = 0.4999 passes: the test has no content there.
5. (MEASURED) With the zero count preserved (2n on-line ordinates replaced by n pairs on the lattice of spacing 4 pi/log(T/2 pi), tapered offsets), the replacement passes at b = 0.49 for theta <= 0.42, at b <= 0.3 to 0.35 for theta = 1/2, b <= 0.08 for theta = 3/4, b <= 0.02 to 0.03 for theta = 1 (height 1e6; section 4.4). This is the threshold theta < (1/2) log(T/2 pi)/log T of Theorem B.
6. (PROVED, Lemma R) If every off-line pair has u b <= A then G_u >= -C_A u N, N the largest number of pairs in an interval of length 1/u near t, C_A = cosh A - 1 + A sinh A up to an absolute factor. With the count O(log t) this is -C log^2 t, and a synthetic set attains the order. So the region gives C(theta') only with M growing like log^2 t (log t under a local-density hypothesis).
7. (MEASURED, ball) The passing configurations are fine-tuned: the cancellation in a row of largest offset b needs the ordinates to accuracy about 100 P^(-b)/u. Rows built with float64 ordinates fail from u b_max = 80 on for that reason alone (section 4.5).
8. Requirement flags: R1 no, R2 no, R3 no, R4 no. Score: unchanged. Map row Q25 (and P45) can record: "C(theta) reads the off-line zeros only through the part of their local Fourier transform at frequencies <= theta log t; its reach is a region b <= (c n + O(log log gamma))/(theta log gamma) with n the local number of off-line pairs, and no region at all for rows of spacing below 2 pi/(theta log gamma)."

The idea is decided, not killed by a control: the first lemma (the Turan bound) exists and is sharp in order, and its loss, linear in n, is the reason the correspondence fails. No pivot was made.

## 1. Plan and what is new against the sources

Sources read: `BRIEF.md`; c15 RESULT.md and REFEREE.md in full (Lemma 1, 2, Theorem 1, Proposition 4, Proposition 5, referee item E4); `OBSTRUCTION_MAP.md` rows P45, Q25, Q26 and the controls notes; `c15-control-with-zeta-fe-classes-u1-u2` for the definition of ZQ (zeta times a rational symmetric multiplier: finitely many on-line zeros replaced by prescribed off-line quadruples).

Recorded there: the identity L_F = sum_rho K_u(s - rho) and the sign of K_u (c15 Lemma 1, 2); the one-pair estimate -P^b u/(4 pi^2) (Proposition 5, ARGUED; referee E4: the constant is order-of-magnitude only); the necessary band bound of Proposition 4.

Done here, not recorded there:
- the exact value of a lattice row (Theorem B) and with it a configuration class on which C(theta) carries no information about b;
- the power-sum lemma asked for (Lemma T), with the two-height device that removes the Fejer weight exactly (identity (T2));
- the reverse direction with its constant (Lemma R);
- the decisive test on synthetic sets at heights 1e6 to 1e9, with ball rechecks.

Plan registered before the runs (in the lane notes, not a separate file): (i) one pair reproduces Proposition 5; (ii) clusters with a tapered lattice structure pass outside the region, with u b_max growing linearly in n; (iii) density-preserving rows pass for theta < 1/2 and fail for theta >= 3/4; (iv) clusters in which every pair is outside the region do not pass much above the one-pair threshold. Outcome: (i), (ii), (iii) as predicted; (iv) partly wrong: with every pair at b >= 0.2 a cluster of 4 passes at T = 1e9, theta = 1, where one pair passes at most at 0.148 (section 4.3).

## 2. Statements and proofs

### Lemma A (form of the section on the line). PROVED.
For a pair (gamma_0, b) and real y = t - gamma_0: Re[K_u(-b + iy) + K_u(b + iy)] = 2 int_0^u (1 - v/u) cosh(bv) cos(yv) dv = 2 Re F_u(y + ib).
Proof. K_u(w) = int_0^u (1 - v/u) e^(-wv) dv (c15), and F_u(z) = int_0^u (1 - v/u) cos(zv) dv, Re cos((y + ib)v) = cos(yv) cosh(bv). QED. Check: `selftest.py` (1e-16), `ref_checks.py` item A (4e-31).

For u b large, 2 Re F_u(y + ib) = -e^(ub) Re[e^(-iuy)/(u (y + ib)^2)] + O(1/(u abs(y + ib)^2)): the sum over a cluster is -(1/u) Re[e^(-iut) g_t(u)] + O(...), g_t(u) = sum_j e^((b_j + i gamma_j) u)/(t - gamma_j + i b_j)^2, a generalised power sum in u = log P. This is the sum named in the assignment.

### Theorem B (lattice row). PROVED.
Let b >= 0, d > 0, v_1 = 2 pi/d. For all real y and u > 0:

    sum over j in Z of 2 Re F_u(y - jd + ib) = (2 pi/d) [1 + 2 sum_{k >= 1, k v_1 < u} (1 - k v_1/u) cosh(k v_1 b) cos(k v_1 y)].      (B)

Proof. f(x) = F_u(x + ib) is integrable, O(x^(-2)), with Fourier transform int f(x) e^(-i xi x) dx = pi (1 - abs(xi)/u)_+ e^(-b xi) (shift of contour; F_u is entire of exponential type u and its transform on the real line is pi (1 - abs(xi)/u)_+). The periodisation sum_j f(y - jd) converges absolutely and uniformly, so it is continuous with Fourier coefficients (1/d) times the transform at k v_1; only finitely many are non-zero, so it equals its Fourier series. Add the conjugate. QED.
Checks: `selftest.py` (rows of 400001 pairs, three (d, b), three u, four y: agreement to the 6 digits printed, in both regimes); `ref_checks.py` item B (mpmath nsum, differences 6e-5 to 6e-4, the accuracy of the extrapolated tail).

Consequences.
(B1) d <= 2 pi/u: the row contributes the constant 2 pi/d, the same as a row of double on-line zeros on the same lattice, for every b (including b near 1/2). The hypothesis "G_u' >= -M for all u' <= u" holds for the row with M = 0.
(B2) 2 pi/u < d: the k = 1 term has size (2 pi/d) 2 (1 - v_1/u) cosh(v_1 b) and both signs. A row with the largest pair density the Riemann-von Mangoldt count allows (all zeros off the line: d = 4 pi/log(t/2 pi), v_1 = (1/2) log(t/2 pi)) is invisible for u < (1/2) log(t/2 pi), that is theta < about 1/2; for theta = 1 (v_1 = u/2 up to O(1)) the minimum of (B) is -(L'/2)(cosh(b L'/2) - 1), L' = log(t/2 pi), so G >= -M forces b <= (4/L') sqrt(M/L'), that is b <= C sqrt(M)/(log t)^(3/2): for dense rows the region of Proposition 5 is too wide by a power of log t, for theta = 1.
(B3) Reading on the prime side. The row is the zero set of q^(s-1/2) + c + q^(1/2-s) with log q = v_1 and cosh(b log q) = abs(c)/2. Its "primes" are the powers of q. A section with P < q contains none of them. The control T-NR (fixed q) therefore passes C(theta) at heights t < q^(1/theta) and fails above; the synthetic row with q tied to the height is the same object with q = t^(1/2).

A row is infinite. Finite versions are the tapered rows of section 4 (MEASURED, ball); the argument for them is: with offsets b(x) varying slowly along the row and vanishing at the ends, the row differs from a row of double on-line zeros by the Fourier content of cosh(xi b(x)) - 1 at frequencies xi <= u and at the aliases k v_1 - xi, and both are exponentially small when the half-length of the row exceeds a multiple of the largest offset (ARGUED: saddle point for the profile cos^2 gives the condition half-length >= about pi b_max at spacing pi/u, which is the measured law u b_max = n/2; not written as a proof).

### Lemma T (power-sum bound for an isolated cluster). PROVED from one classical theorem.

Setting. A synthetic set, symmetric under conjugation of the "ordinates" zeta = gamma (on-line) and zeta = gamma_j +- i b_j. Fix t, u > 0, 0 < kappa < 1, u_1 = (1 - kappa) u, and 0 < delta. B(z) = (delta/2 pi) (sin(delta z/2)/(delta z/2))^2, with transform bhat(eta) = (1 - abs(eta)/delta)_+; B >= 0 on the real line, int B = 1.

Hypothesis (H): G_u(tau) >= -M and G_{u_1}(tau) >= -M for all real tau. (For C(theta) at height t this holds for abs(tau - t) <= t/2 after replacing theta by theta log(t/2)/log t; the rest of the line has weight at most 4/(pi delta t) and G_u >= -4 e^(u/2)/u there by the trivial bound, a contribution below t^(theta/2 - 1)/delta.)

Step 1 (two-sided bound from the one-sided one). For delta < v_0 < u - delta and real phi put w(tau) = B(tau - t)(1 + cos(v_0 (tau - t) + phi)) >= 0, int w = 1. Termwise integration of Lemma A (F_u(x) = (1/2) int (1 - abs(xi)/u)_+ e^(i xi x) d xi) gives

    int G_u w = D_u + Re[e^(-i phi) S_u(v_0)],
    D_u = sum_zeta (1/2) int (1 - abs(xi)/u) bhat(xi) e^(-i xi (zeta - t)) d xi = int G_u(tau) B(tau - t) d tau,
    S_u(v_0) = pi sum_zeta e^(-i v_0 (zeta - t)) [(1 - v_0/u) B(zeta - t) - B_1(zeta - t)/u],      (T1)

where B_1(z) = (1/2 pi) int eta bhat(eta) e^(-i eta z) d eta, and the sum runs over all ordinates (on-line, and both members gamma_j +- i b_j of each pair). Linearity of (1 - xi/u) on (v_0 - delta, v_0 + delta) is what makes (T1) exact. By (H), D_u + Re[e^(-i phi) S_u] >= -M for every phi, hence abs(S_u(v_0)) <= M + D_u; the same for u_1 when v_0 < u_1 - delta.

Step 2 (removing the Fejer weight). From (T1), u S_u - u_1 S_{u_1} = pi (u - u_1) T(v_0) with

    T(v_0) = sum_zeta B(zeta - t) e^(-i v_0 (zeta - t)),      (T2)

an exponential sum in v_0 with constant coefficients. So for delta < v_0 < (1 - kappa) u - delta:

    abs(T(v_0)) <= (2 - kappa)(M + D)/(pi kappa),   D = max(D_u, D_{u_1}).      (T3)

Checks: `ref_checks.py` item C: the integral int G_u w by quadrature against D_u + Re[e^(-i phi) S_u] from (T1) for a set of 6 on-line ordinates and 2 pairs: 1.57811713668 against 1.57811713671 (the difference is the truncated tail of the quadrature); identity (T2): 3e-31.

Step 3 (Turan). CLASSICAL (Turan's second main theorem in the form of Sos and Turan; recalled from Montgomery, Ten Lectures, chapter 5; not opened): if 1 = abs(z_1) >= abs(z_2) >= ... >= abs(z_n) then for every integer m >= 0 there is nu in [m + 1, m + n] with abs(sum_j c_j z_j^nu) >= 2 (n/(8e(m + n)))^n min_k abs(c_1 + ... + c_k). (`ref_checks.py` item E: 3000 random trials, n <= 5: smallest ratio of the two sides 10.9, no counterexample.)

Suppose now that the off-line pairs are (gamma_j, b_j), j = 1..n, b_1 >= ... >= b_n, with abs(gamma_j - gamma_1) <= r, and take t = gamma_1, delta = 1/(r + 1/2). Split T = T_big + T_rest, T_big(v) = sum_{j <= n} B(gamma_j + i b_j - t) e^(-i v (gamma_j - t)) e^(b_j v). Since abs(delta z/2) <= 1/2 for the arguments z = gamma_j - t + i b_j, Re B(z) >= 0.91 delta/(2 pi) (sinc^2 within 0.09 of 1 on that disc), so every partial sum of the coefficients has modulus at least 0.91 delta/(2 pi). T_rest (on-line ordinates and the conjugate members, exponents of modulus <= 1) is bounded by D' = sum over on-line gamma of B(gamma - t) + sum_j abs(B(gamma_j - i b_j - t)). Apply the theorem to z_j = exp((b_j - b_1 - i (gamma_j - t)) h), h = V/(2n), m = n, V = (1 - kappa) u - delta: there is v in (V/2, V] with

    abs(T_big(v)) >= e^(b_1 v) 2 (16e)^(-n) 0.91 delta/(2 pi) >= 0.29 delta e^(b_1 V/2) (16e)^(-n).

With (T3):

    b_1 <= (2/V) [ n log(16e) + log( (D' + (2 - kappa)(M + D)/(pi kappa)) / (0.29 delta) ) ],   V = (1 - kappa) u - delta.      (T)

QED.

Remarks. (i) log(16e) = 3.773. With m = 5n instead of m = n the leading constant (1 + lambda) log(8e(1 + lambda))/lambda at lambda = 5 is 5.85 in place of 7.55, so u b_1 <= 5.85 n/(1 - kappa) + logarithmic terms. (ii) For a set with zeta's density D and D' are (1/2) log(t/2 pi) + O(1) and about (1/2 pi) log t: the logarithmic term is log log t. A hypothesis with M = log^2 t changes it to 3 log log t. (iii) For one pair (n = 1) (T) is Proposition 5 with a proof: b <= (c + log log t + log(M + 1))/(theta log t), c absolute. The log log t term is absent from c_theta in c15; it is the reserve (1/2) log t that c15 treated as a typical value. (iv) The lemma is stated for a set whose off-line part is one cluster. With other off-line pairs at distance R their terms enter T_big with weight B = O(1/(delta R^2)) and exponent up to their own b: the lemma extends when the cluster contains the deepest pair within distance about P^(1/2) and the pairs outside the cluster have small total weight; a version with a rapidly decaying window in place of B is not written (OPEN, routine). For dense configurations (n comparable to log t) no such statement can hold, by Theorem B. (v) No property of an arithmetic function is used.

### Lemma R (the region gives C(theta') only with a growing M). PROVED.
For a pair and real y: E(y, b) = 2 Re F_u(y + ib) - 2 F_u(y) = 2 int_0^u (1 - v/u)(cosh(bv) - 1) cos(yv) dv satisfies

    abs(E) <= min( u (cosh(ub) - 1),  (2/y^2) [3 (cosh(ub) - 1)/u + b sinh(ub)] ).

Proof. First bound: abs(cos) <= 1. Second: phi(v) = (1 - v/u)(cosh(bv) - 1) has phi(0) = phi(u) = 0, phi'(0) = 0, phi'(u) = -(cosh(ub) - 1)/u, int_0^u abs(phi'') <= (2/u)(cosh(ub) - 1) + b sinh(ub); integrate by parts twice. QED. (`ref_checks.py` item D: largest ratio abs(E)/bound on 4788 points 0.256.)

Consequence. If every pair near t has u b_j <= A, then G_u(t) >= (sum over all zeros, each pair counted as a double on-line zero, of F_u >= 0) - C_A sum_j min(u, 8/(u y_j^2)), C_A = cosh A - 1 + A sinh A. With N(h) the largest number of pairs in an interval of length h near t: G_u(t) >= -C C_A u N(1/u) when N(h) <= N(1/u)(1 + hu), and in general >= -C C_A u sup_x N_1(x) with N_1 the count per unit interval. For counts O(log t): G_u >= -C C_A theta log^2 t. The order is attained in the synthetic class: take N pairs with ordinates within 1/(10u) of gamma_0 and offsets A/u, A < 2 pi, and all on-line ordinates at distances in (2 pi/u) Z from the point t* = gamma_0 + 2 pi/u (so the on-line sum vanishes at t*). Then G_u(t*) = N 2u (1 - cosh A)(4 pi^2 - A^2)/(4 pi^2 + A^2)^2 (1 + O(1/10)), about -N u (cosh A - 1)/(2 pi^2) for small A: the one-pair value of Proposition 5 times N.

So: "all zeros have beta - 1/2 <= c/log gamma" implies C(theta') in the form G >= -C(c theta') theta' log^2 t, for every theta', and not with a bounded M, in the class of synthetic sets with O(log t) zeros per unit window. With bounded M one needs b <= eps/(log gamma)^(3/2) for dense rows (B2) or a lower bound for the on-line sum at every point (information about the positions of the on-line zeros, not available).

### Remark E (prime side). ARGUED from the explicit formula; not a new statement.
By the explicit formula T(v_0) of (T2) is, up to gamma terms of size O(1), the smoothed prime sum -(1/2 pi) sum_n Lambda(n) n^(-1/2 - it) bhat(log n - v_0). So C(theta) with M <= C log^2 t implies, at every height, abs(sum_n Lambda(n) n^(-1/2-it) (1 - abs(log(n/x))/delta)_+) <= 2 (2 - kappa)(M + D)/kappa + O(1), D about (1/2) log(t/2 pi), for x <= t^(theta (1 - kappa)): Proposition 4 of c15 without the Fejer weight (the factor (1 - log x/log P) is removed by the two-height identity). Conversely such bounds for the two weights bhat and eta bhat, summed over a partition of [log 2, u] into u/delta bumps, give G_u >= -C u (log t)/delta. Up to powers of log t, C(theta) is the statement "square-root cancellation in every smoothed sum of Lambda(n) n^(-it) over n near x, for all x <= t^theta, at every height". A synthetic zero set whose local transform matches zeta's prime side for frequencies <= theta log t has the same G_u as zeta. The zero-side content of C(theta) is therefore the band-limited part of the zero measure, and Theorem B and section 4 describe which off-line parts are invisible in that band.

## 3. Decision of Proposition 5

Question 1: does C(theta) force beta - 1/2 <= c_theta/log gamma?
- One pair, all other zeros on the line: yes, with c_theta replaced by (c + log log gamma + log(M + 1))/theta (Lemma T, n = 1; PROVED from the classical theorem). Measured thresholds agree with c15's formula at theta = 1 and 1/2 (section 4.1).
- n pairs in one cluster: yes with constant (5.85 to 15.1) n/theta + logarithms (Lemma T). The linear growth is real: measured clusters pass at u b_max between n/2 and n (section 4.2).
- Arbitrary configurations with O(log gamma) zeros per unit window: no. A row of spacing d <= 2 pi/(theta log gamma) passes with any offset (Theorem B, exact for the infinite row; finite tapered rows measured in ball arithmetic up to P^(b_max) = e^160, section 4.5). Such a row has theta log gamma/(2 pi) pairs per unit length, which is inside "O(log gamma) per window" for every theta and inside the Riemann-von Mangoldt count for theta < 1/2.
- A short tapered row needs n = 2 u b_max pairs in a window of length about 2 pi b_max. Against the unconditional bound for the number of zeros in a short interval (abs(S(t)) <= 0.11 log t + ..., CLASSICAL, recalled) such a row is not excluded when (4 theta - 1) b_max <= about 0.22: for theta <= 1/4 no offset is excluded, for theta = 1 offsets up to about 0.07. ARGUED (constants rough). So C(theta), together with the known count of zeros in short intervals, does not give a region shrinking with the height; at best a strip of fixed width of order 1/theta.

Question 2: does the region imply C(theta') for some theta'? Not with fixed M (Lemma R, example attaining -c log^2 t in the synthetic class; for zeta-like on-line sets a single pair at the boundary passes or fails according to the local value of the on-line sum, measured spread of the one-pair threshold: 0.07 to 0.15 at T = 1e9, theta = 1). With M(t) = C log^2 t: yes, for every theta'.

Together: C(theta) with M = C log^2 t is implied by the region for every theta, and implies b <= (c_1 n + 3 log log gamma + c_2)/(theta log gamma) for isolated clusters of n pairs. The two statements do not match (the factor n and the log log gamma term), and for dense rows the first carries no information. The "reach" of a P = t^theta device is not a zero-free region.

## 4. Decisive test (server, through rhrun; float64 MEASURED unless "ball")

Set-up. `zeros.py`: on-line ordinates of zeta in [T - 90, T + 90] for T = 1e6, 1e7, 1e8, 1e9 by the Riemann-Siegel main sum with the first correction term (long double phases), sign changes on a grid of step 0.004, brentq; counts 342, 410, 476, 541 against 343.1, 409.1, 475.1, 541.0 expected from theta(t); six ordinates per height compared with mpmath.findroot(siegelz): differences <= 3.6e-7. The synthetic set is defined by the stored floats. Ordinates outside the window are omitted (their sum is >= 0, so omitting them makes passing harder).
`cluster.py`: G on a grid of step 0.26/u_max in y over [cluster - 60/u_max, cluster + 60/u_max] (halved for the final value) and 17 (33 for the final value) values of u in [theta L/2, theta L]. "Passes" means min G >= 0 on that grid (M = 0). Optimiser: start from the best member of a family of tapered lattice rows (15 members), then L-BFGS-B on a soft minimum with analytic gradient, one pair pinned at the offset b under test, the other offsets free in [1e-5, 0.4999], ordinates free. Offsets tried: 0.01 to 0.49 (16 values); the entry is the largest that passed. The cluster is centred at T (one position; no search over positions).

### 4.1 Control: one pair (reproduces Proposition 5)
Largest b for which one pair passes, over 41 ordinates in [T - 20, T + 20] (13 for the cells run in the second pass: T = 1e8, 1e9 and (1e7, 1)); [min, median, max].

| T | theta | b_1, M = 0 | b_1, M = 1 | Prop. 5 formula log(2 pi^2/theta)/(theta L) | c_theta/L |
|---|---|---|---|---|---|
| 1e6 | 1/4 | 0.4999 (cap) | cap | 1.265 | 1.269 |
| 1e6 | 1/2 | 0.401, 0.474, cap | 0.440, cap, cap | 0.532 | 0.534 |
| 1e6 | 1 | 0.068, 0.169, 0.219 | 0.116, 0.199, 0.228 | 0.216 | 0.217 |
| 1e7 | 1/2 | 0.343, 0.417, 0.462 | 0.377, 0.436, 0.476 | 0.456 | 0.458 |
| 1e7 | 1 | 0.093, 0.154, 0.189 | 0.114, 0.166, 0.195 | 0.185 | 0.186 |
| 1e8 | 1/2 | 0.330, 0.366, 0.392 | 0.348, 0.380, 0.404 | 0.399 | 0.401 |
| 1e8 | 1 | 0.052, 0.131, 0.162 | 0.080, 0.140, 0.167 | 0.162 | 0.163 |
| 1e9 | 1/2 | 0.292, 0.317, 0.349 | 0.307, 0.330, 0.359 | 0.355 | 0.356 |
| 1e9 | 1 | 0.072, 0.128, 0.148 | 0.085, 0.135, 0.152 | 0.144 | 0.145 |

At theta = 1/4 one pair at b = 0.4999 passes at all four heights. The largest one-pair threshold agrees with c15's formula to 0.01 in every cell with theta >= 1/2; the smallest is 0.3 to 0.5 of it (the on-line sum at the worst point is far below its mean, referee E4 of c15). Mechanism at 1.5 times the median threshold: the minimum sits at distance 0.22 to 0.47 from the pair (2 pi/u = 0.30 to 0.68) with value -9.8 to -26 against the formula -P^b u/(4 pi^2) = -11.6 to -36. Proposition 5 for one pair is reproduced.

### 4.2 Clusters added to the on-line ordinates (largest pinned offset that passes; cap 0.49)

| T | theta | region c_theta/L | n=2 | n=3 | n=4 | n=6 | n=8 | n=12 | n=40 |
|---|---|---|---|---|---|---|---|---|---|
| 1e6 | 1 | 0.217 | 0.25 | 0.35 | 0.49 | 0.49 | 0.45 | 0.49 | (0.49, first run) |
| 1e7 | 1 | 0.186 | 0.20 | 0.30 | 0.40 | 0.49 | 0.49 | 0.49 | - |
| 1e8 | 1 | 0.163 | 0.16 | 0.30 | 0.35 | 0.40 | 0.45 | 0.49 | - |
| 1e9 | 1 | 0.145 | 0.16 | 0.25 | 0.30 | 0.35 | 0.40 | 0.45 | 0.49 |
| 1e6 | 1/2 | 0.534 | 0.49 | 0.49 | 0.49 | 0.49 | 0.49 | 0.49 | - |
| 1e7 | 1/2 | 0.458 | 0.49 | 0.49 | 0.49 | 0.49 | 0.49 | 0.49 | - |
| 1e8 | 1/2 | 0.401 | 0.45 | 0.49 | 0.49 | 0.49 | 0.49 | 0.49 | - |
| 1e9 | 1/2 | 0.356 | 0.40 | 0.49 | 0.49 | 0.49 | 0.49 | 0.49 | - |
| all | 1/4 | 0.85 to 1.27 | 0.49 | 0.49 | 0.49 | 0.49 | 0.49 | 0.49 | (0.49 at 1e6, 1e7, first run) |

Minimum of G for the entries: 0.27 to 2.2 at theta = 1, 1.1 to 6.0 at theta = 1/2 (full table with minima: `tables.txt`). The cells n = 16 and all cells n = 40 except (1e9, 1) were not finished when the units were stopped. A first run (stopped; log kept as `log_real_first_n40.log`, configurations not stored) gave n = 40: 0.49 at (1e6, 1), (1e6, 1/4), (1e7, 1/4).

Answer to the test question. theta = 1: yes at every height; a cluster of 3 quadruples passes with its deepest pair at 1.6 to 1.8 times the region; the strip edge b = 0.49 is reached with 4, 6, 12, 40 quadruples at 1e6, 1e7, 1e8, 1e9 (3.4 times the region at 1e9; n = 16 to 32 not run there). theta = 1/2: yes at 1e7, 1e8, 1e9 (3 quadruples at the strip edge; region 0.36 to 0.46); at 1e6 the region contains the strip. theta = 1/4: the region contains the strip at all four heights; no cluster can be outside it, and the test is empty (it would need log gamma > 35).

In every passing cluster the pairs other than the pinned one are free, and the optimiser keeps some of them at small offsets (inside the region). Section 4.3 is the variant with all pairs outside.

### 4.3 Variant: every pair outside (all offsets >= b)

| T | theta | region | one pair, max over ordinates | n = 4 | n = 8 |
|---|---|---|---|---|---|
| 1e6 | 1 | 0.217 | 0.219 | 0.35 | - |
| 1e7 | 1 | 0.186 | 0.189 | 0.30 | - |
| 1e8 | 1 | 0.163 | 0.162 | 0.25 | - |
| 1e9 | 1 | 0.145 | 0.148 | 0.20 | 0.20 |
| 1e9 | 1/2 | 0.356 | 0.349 | 0.45 | 0.45 |

So four quadruples, each 1.4 to 1.6 times outside the region, pass together at theta = 1. The gain over one pair is smaller than in 4.2 (factor 1.4 to 1.6 against up to 3.4), and does not grow from n = 4 to n = 8 in the one cell where both ran: without pairs of small offset at the ends of the cluster the cancellation is limited. The run was stopped after 15 cells (the lane was at its core limit); the rest of n = 8 and n = 16 was not run.

### 4.4 ZQ with the count preserved (2n on-line ordinates replaced by n pairs)
Pairs on the lattice of spacing d_nat = 4 pi/log(T/2 pi) (twice the mean spacing), offsets b cos^(2p)(pi x/2), p in {1, 2, 3, 5}, three lattice phases, no optimisation. kappa = 2 pi/(d_nat u_max) = log(T/2 pi)/(2 theta log T); Theorem B predicts invisibility for kappa > 1.

| T | theta | kappa | region | largest b that passes: n=8, 16, 40 |
|---|---|---|---|---|
| 1e6 | 0.25 | 1.73 | 1.27 | 0.49, 0.49, 0.49 |
| 1e6 | 0.35 | 1.24 | 0.84 | 0.49, 0.49, 0.49 |
| 1e6 | 0.42 | 1.03 | 0.67 | 0.49, 0.49, 0.49 |
| 1e6 | 0.5 | 0.87 | 0.53 | 0.35, 0.35, 0.30 |
| 1e6 | 0.75 | 0.58 | 0.32 | 0.08, 0.08, 0.08 |
| 1e6 | 1 | 0.43 | 0.22 | 0.03, 0.02, 0.02 |

(1e7 at theta = 0.25, 0.35: 0.49. At 1e9, n = 16: 0.49 at theta = 0.25, 0.35, 0.42 (kappa 1.82, 1.30, 1.09); the cells theta >= 1/2 at 1e9 were not finished.) The transition sits at kappa = 1 as predicted. For kappa < 1 the count-preserving row is confined far inside the region (0.02 against 0.22 at theta = 1): consequence (B2). The free clusters of 4.2 have the same total count plus 2n; they pass because the optimiser packs them at spacing below 2 pi/u.

### 4.5 Scale-free clusters (no on-line zeros) and the tolerance of the cancellation
In the variable A = u b_max the cluster-alone problem does not depend on the height. Criterion: inf G >= -1e-3 (G in units of u; the row value 2 pi/d is of order 1 to 5), y within 400/u of the cluster, u' in [u/2, u].

| n | 1 | 2 | 3 | 4 | 6 | 8 | 12 | 16 | 24 | 32 | 40 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| A_max, optimised (`cluster.py univ`) | none | 1 | 3 | 4 | 7 | 8 | 8 | 10 | 12 | - | - |
| A_max, family only (`famscan.py`) | | | | | | | 6 | 8 | 12 | 16 | 20 |

Family member at the maximum for n >= 12: spacing pi/u (kappa = 2), offsets A cos^2(pi x/2); the law is A_max = n/2 exactly on the grid of A used (step 2). For n = 60, 80, 120 the family passes at A = 24, the largest value float64 can test. One pair alone fails for every A (min -0.03 at A = 1). The optimised run was stopped before n = 32, 40.

Lemma T gives A <= 5.85 n/(1 - kappa) + logs; the measurement gives A_max between n/2 and n. Linear growth in n is established from both sides for n <= 40; the constant is between 0.5 and 5.85.

Ball rechecks (python-flint, 256 bits; the zero set is the stored floats, so the values are rigorous at the grid points, which are offset from the float grid; nothing is certified between grid points): 12 clusters of 4.2 and 4.3 (n = 3, 4, 8; T = 1e6, 1e9; theta = 1/2, 1): lower bounds of min G 0.32 to 5.47, equal to the float values to the digits printed. Rows alone, float ordinates: A = 20, n = 100 (kappa 2, p = 3): +0.0094; A = 20, n = 40 (p = 1): +0.0043; A = 40, n = 88 (p = 1): -5.0e-4 (inside the criterion); A = 40, n = 80: -46.8 (n below 2A); A = 40, n = 240 and 300 (kappa 2.5, p = 4): -0.03, -0.025 (at the far end of the row).

Tolerance. Rows at A = 80 and 160 built with float64 ordinates fail by 1e16 to 1e51 at the centre of the row, for every n tried up to 800: the terms have size e^A/(u b^2) = 1e31 at A = 80 and the float rounding of j pi (relative 1e-16) destroys the cancellation. Rows built entirely in ball arithmetic (`ballfam.py`, 600 bits, exact lattice of spacing pi, offsets A cos^2(pi x/2); y within 60 of the row, 7 values of u in [1/2, 1]; lower bound of min G, row value 2 pi/d = 2):

| A = u b_max | 20 | 40 | 40 | 80 | 80 | 80 | 160 | 160 | 160 (kappa 2.5) |
|---|---|---|---|---|---|---|---|---|---|
| n | 40 | 80 | 88 | 160 | 176 | 200 | 352 | 400 | 480 |
| lower bound of min G | +0.0043 | -46.8 | +0.0089 | -2.2e4 | +0.0096 | +0.0099 | -3.46 | +0.0104 | +0.0128 |

So n = 2A fails and n = 2.2 A to 2.5 A passes, up to P^(b_max) = e^160: the linear law continues beyond the float range (on these grids). With each ordinate moved by a seeded amount of size eps (units of 1/u): A = 20, n = 44: min G = +0.0074, +0.0032, -0.076 at eps = 1e-8, 1e-7, 1e-6; A = 40, n = 88: +0.0088, +0.0082, -0.30 at eps = 1e-17, 1e-16, 1e-14. The tolerance is about 100 e^(-A) = 100 P^(-b_max) in units of 1/u. This is a property of the configurations, not of the arithmetic: a passing row with P^(b_max) = e^80 exists only as a configuration specified to about 33 digits.

### 4.6 Units and limits
Units (all through rhrun, stopped or finished): rh-c16ct-zeros-1119212702, -self-1119212702, -univ-1119212828 (stopped: profile bug, see below), -univ-1119213051 (stopped at n = 24), -sign-1119212828, -onepair-1119213051 (stopped after 5 cells; second pass in -light-1119221256), -nat-1119213051 (stopped after 23 cells; second pass in -light), -real-1119213317 (stopped after 3 cells), -real-1119215644, -real40-1119222604, -floor-1119221320 (stopped after 15 cells), -ref-1119215624, -ball-1119222408, -ball2-1119222724, -ball3-1119223632, -fam-1119222655, -ballfam-1119224201, -perturb-1119225040. At the end the units -real-1119215644 (in n = 16), -real40-1119222604 (after its first cell) and -light-1119221256 (in the 1e9 count-preserving cells) were stopped; no unit of this lane is running. Three earlier units failed at start (a path error and a syntax error) and computed nothing. Cores: 8 or fewer except for about 12 minutes at 9 to 10 during the short ball and family runs. Memory: below 2 GB per unit.
Bug found and fixed during the run: the family profile was not normalised to its maximum for even n, so "A" in the first universal run overstated the largest offset; that run was discarded.

## 5. Controls

| Control | Outcome | Reason |
|---|---|---|
| One pair (DH-like isolated off-line pair) | fails C(theta) outside a region of the Proposition 5 shape (4.1; Lemma T, n = 1) | the power sum has one term |
| DH | by c15 (measured there: violates for theta >= 1) and Lemma T: its off-line pairs are isolated (bounded n per window), so C(theta) fails for DH at large height | zero location; the identity holds for DH with its own gamma factor; no step of an argument |
| ZQ (zeta times a rational symmetric multiplier) | PASSES C(theta) at the tested heights for multipliers with 3 or more suitably placed quadruples: theta = 1 with a quadruple at 1.7 to 3.4 times the region, theta = 1/2 at the strip edge (4.2: the multiplier adds quadruples and removes nothing; 4.4: with removal). One quadruple fails (4.1) | ZQ has all of zeta's prime-power atoms; C(theta) does not separate zeta from ZQ at fixed height. A fixed multiplier has fixed zeros, so it is tested at finitely many heights only: ZQ passes "C(theta) in the window" and is not a control for the all-heights statement |
| T-NR (xi times q^z + c + q^(-z), abs(c) > 2) | passes for P < q exactly (Theorem B), fails above | its off-line row has spacing 2 pi/log q |
| zeta(s+a) zeta(s-a) | fails: prime side `shiftctl.py`, min of the section over 2e4 units: theta = 1/2, T = 1e9: +1.0, -5.3, -24, -71 at a = 0.1, 0.2, 0.3, 0.4; theta = 1, T = 1e6: -0.07, -2.1, -17, -62, -202 at a = 0.05 to 0.4; passes at theta = 1/4 (min 4.1 to 9.5: inside or near the absolutely convergent range) | its pairs sit at zeta's own ordinates with density log t/(2 pi) per unit, above the Theorem B threshold for theta < 1, and it still fails: the ordinates are not a lattice, and their deviation from one is the prime side at frequencies log p <= u, amplified by cosh(a log p). An exact lattice of the same density gives the constant log(t/2 pi) |
| 24 seeded random sign chains (prime side, `signchain.py`) | theta = 1: 24/24 violate at 1e6 and 1e7 (min -1.5 to -6.5; zeta +0.20, +0.32); theta = 1/2: 24/24 in 4e5 units at 1e6 (zeta min +0.56), 11/24 in 2e4 units at 1e9 (zeta +0.99); theta = 1/4: 0/24 in 2e6 units at 1e6 and 1e9 (min 3.4 to 4.7, zeta 3.45, 4.47) | no zero-set identity with these gamma factors; at theta = 1/4 the reserve is 9.7 standard deviations and the chains pass like zeta: C(1/4) does not separate them at reachable heights (a Gaussian model puts the first violations at log t of about 48) |
| Unimodular twist, backward heat, Beurling, phase-rotated transfer operator, theta^w | not run | by Lemma A each passes or fails through its zero set only (c15 referee, check C for the unimodular twist) |

No control fails at a step of an argument: there is no argument beyond the identity. R3 is not met.

## 6. Which step could use multiplicativity to extend the unconditional range

The unconditional range P <= ((1/4) log t log log t)^2 comes from bounding the prime side by its l^1 norm against the reserve (1/2) log(t/2 pi). By Remark E, extending it at every height is a bound of square-root quality for sum_n Lambda(n) n^(-1/2-it) bhat(log n - v) with e^v between (log t)^2 and t^theta, at every t. The only place the present chain could take arithmetic input is that bound, step (T3) read backwards. What multiplicativity supplies there is unique factorisation (independence of the log p), which evaluates moments over t of these sums when the product of the lengths stays below the height: statements about the measure of exceptional heights, the same for every sign chain, and not every-window statements (MV-CAP). No step was found in which multiplicativity extends the range of P at every height. The zero-side statements of section 2 (Lemma A, Theorem B, Lemma T, Lemma R) hold for arbitrary point sets and use no arithmetic.

## 7. Requirement flags

- R1 (multiplicativity essential): no. Every proved statement is about point configurations and one kernel. Evidence: Theorem B and section 4 hold for synthetic sets; Remark E's prime-side form holds for arbitrary coefficients.
- R2 (height-uniform, every window): no. Lemma T and Lemma R are uniform in height as implications between hypotheses; neither hypothesis is established at any theta > 0. The tests are at four heights.
- R3 (every control fails at a named structural step): no. ZQ passes in the window; T-NR passes below q^(1/theta); the others fail through zero location only (section 5).
- R4 (reaches the critical line): no. The lane shows the opposite for this device: at P = t^theta the section cannot see off-line rows of spacing below 2 pi/(theta log t), and for isolated clusters its reach is b <= (c n + log log gamma)/(theta log gamma).

## 8. Three weakest steps

1. Finite tapered rows. The statement "a finite row of n = 2 u b_max pairs passes for arbitrarily large u b_max" is MEASURED (float to u b_max = 24, ball to u b_max = 160, on grids, y within 60/u to 400/u of the row) and ARGUED (saddle point), not proved; nothing is certified between grid points or in the far field, where the argument is that the leading term 2n(1 - cos)/(u y^2) of the row is non-negative and the correction is O(y^(-4)). The proved statement is Theorem B for the infinite row. The linear law for n > 40 rests on the nine ball rows of 4.5 (one profile, one spacing).
2. Lemma T rests on Turan's second main theorem with the constant 8e recalled from memory and not opened (random trials do not contradict it), and is written for a set whose off-line part is a single cluster with window parameter delta = 1/(r + 1/2). The extension to several clusters (remark iv) is not written. The reduction of C(theta) to hypothesis (H) (tails of the Fejer window over the heights where u exceeds theta log tau) is a sketch with one line of estimate.
3. The decision of Question 1 for the class "O(log gamma) zeros per unit window" uses rows whose local density exceeds the mean density for theta >= 1/2. Whether C(theta), theta >= 1/2, confines configurations that also satisfy the Riemann-von Mangoldt count in every window of fixed length is decided only for rows (B2, section 4.4: they are confined, to b far inside the region) and for short tapered rows against the bound on S(t) (ARGUED, rough constants); a general statement for theta >= 1/2 under the exact count is OPEN. The optimiser is local and started from one family; "largest b that passes" is a lower bound for the true supremum in every table, and the cluster was placed at one position per height.

## 9. Files

`zeros.py` (ordinates; `zeros_*.json`), `cluster.py` (one-pair control, clusters, all-outside variant, count-preserving rows, scale-free clusters), `famscan.py`, `ballcheck.py`, `ballfam.py` (ball arithmetic), `signchain.py`, `shiftctl.py` (prime-side controls), `selftest.py`, `ref_checks.py` (identity, Poisson, Lemma T algebra, Lemma R bound, Turan trials), `parse_first.py`, `aggregate.py` (text processing), `tables.txt` (all tables), `parts/` (one JSON per finished cell, with the cluster coordinates), `out_*.json`, `logs/` (unit logs), `REFEREE.md`, `lanes.jsonl`.
