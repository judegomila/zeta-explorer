# s4-twin-ladder-alias-shell-packets: RESULT

Date 2026-11-19/20. Kind: screening (compute). Four combinations of twin-ladder / alias / shell / packet nodes of the idea graph, each turned into a finite statistic and run for zeta, Dirichlet L-functions and the controls.
No statement about zeros of zeta is made. Labels: PROVED (elementary or taken from a Lean file / a proved record, argument given), MEASURED (numerics; exact integers or re-checked at higher precision where a pass or fail is reported), RECORD (taken from the cited repo file, read as text).

## 0. Verdict

**No survivor. 4 combinations tested, 4 closed.** (1) The five-shell functional reads the coefficient vector through two sums; for zeta it is an exactly periodic function of N determined by the sieving primes; its sign at fixed A is a density (the residue at s = 1), and at the natural A zeta itself changes sign. (2) The alias coefficients are the Fourier coefficients of the sieve indicator and do not depend on the object; random signs of the same modulus give a smaller certificate value than the arithmetic phases. (3) The cluster cap is a theorem for non-negative packets at arbitrary positions and no control exceeds it. (4) The Airy sign condition is a statement about (p, k) only; the sign of the packet sums follows the pole of -F'/F at 1, and the covariance K_T is an identity for arbitrary frequencies. In (1) and (4) the comparison L-functions fall with the failing controls and zeta(s+a) zeta(s-a) passes with zeta.

| # | combination (nodes) | statistic | sizes reached | zeta | L(s, chi) | controls | classification |
|---|---|---|---|---|---|---|---|
| 1 | five-shell-identity + permutation-defect-bound + alpha-kh-pcc-gated-region | sign and size of E_y(N, A, c) = (1-A) L_N(Y_4) - A sum_g L_N(Z_g), c = a_F, A fixed and A natural; alias spectrum of the live shell by FFT; fail = sign change | exact integers: y = 97, 361 values of N in [1e6, 1e15] plus 2000 values in [1e12, 1e12 + 2e9]; y = 997 (168 primes), 58 values to 1e14; y = 9973 (1229 primes), 13 values to 1e12 (largest search 2.9e10 nodes); factor sieve of all n <= 3e10 for twists on all primes and E_a; FFT length 220,200,960 | fixed A: constant sign (set by A against prod(1-1/p)); natural A: 5 sign changes on the grid at y = 97 (172 +, 189 -), 3 at y = 997, 2 at y = 9973, 23 at fine sampling to 3e10; max abs(E)/sqrt(N) = 0.51 (y = 97), 32 (y = 997), 453 (y = 9973) | chi mod 5, chi mod 101: sign changes at 37 to 43 % of the grid steps for every A; alias-spectrum share 0.526 (mod 5), 1.9e-8 (mod 101) | DH: sign changes at 37 % of steps, alias spectrum equal to zeta's; twists on the sieving primes: constant sign at fixed A, 13 to 45 changes at natural A; twists on all primes: 5 to 142 changes in 7152 steps; E_a: constant sign for all A; T-NR: as zeta; HEAT: not formulable | CLOSED. For zeta the statistic is a periodic function of N fixed by the sieving primes (no zero enters); the sign at fixed A is the density (pole at 1), at natural A zeta changes sign; L-functions fail with the controls; E_a passes. The permutation defect of commuting projections is 0 |
| 2 | alias-sign-determinacy + alias-denominator-separation-curvature-floor + alias-width-law-octave-weight | (a) firing of certificate E (octave-Szasz weight W(p,D)); (b) theta = phi^H G phi / 1^T G 1 on G(p,D), arithmetic phases against twisted and random phases; fires = theta < 1/2 | (a) exact, 99 cells, p to 9973, D to 1e6 (pD to 1e10); (b) 123 cells, p in {2, 3, 5, 7, 11, 97, 997, 9973}, N = (p-1)D to 196,608 packets (3.9e10 Gram entries per cell), GPU float64, 40-digit re-check on 8 cells | the statistic does not contain the object: (a) never fires; (b) theta -> 1/(p-1)^2 (fires for p >= 3), theta = 1 for p = 2 (never fires) | same numbers as zeta | same numbers as zeta for DH, HEAT, E_a, T-NR. Twisted patterns: random signs / phases give theta about 1/N and fire in 109 / 114 of 123 cells against 103 for the arithmetic phases; random sign per alias class about 1/(p-1); Legendre twist p/(p-1)^2 (does not fire at p = 3) | CLOSED. Object-independent; the fail criterion for the twists is not met (they fire in more cells, with smaller theta) |
| 3 | parity-amgm-gram-sharp + parity-pure-maj-witness-threshold + evaluation-christoffel-duality | R = correlation of same-parity block clusters / cap (1 + mu D) exp(-mu D), mu = 0.2320723 and 9/20; adjacent correlations; lambda_max of the block Gram; edge clusters of K = 1..64 primes; pass = R <= 1 in every block | 5,586,502,370 prime packets (all primes < 2^37 = 1.37e11), 36 dyadic blocks in linear positions, 5 blocks in logarithmic positions; all integers < 2^32 for integer packets; K = 1, 2, 4, ..., 64 | passes in every block (PROVED for a >= 0); max R 0.49 (linear), 0.71 (logarithmic); perturbed primes 0.46 | chi mod 5: 0.58 (linear), 0.75 (logarithmic); chi mod 101: 0.57, 0.58; no block exceeds | no control exceeds the cap in any block: hash signs 0.38 (0.82 in logarithmic positions), phases 0.55, E_a 0.49, T-NR 0.81, DH coefficients on integers 0.71, chi_5 on integers 0.68; edge clusters 0.73 for all objects; first block exceeding the cap: none | CLOSED. No control fails; the cap is a theorem for non-negative amplitudes at any positions (also for HEAT and E_a), and the measured ratios depend on the nearest primes to powers of 2 |
| 4 | airy-envelope-sign-condition + cauchy-phase-ou-covariance + fresnel-airy-envelope-port-gap | (a) sign of W = sum Lambda_F(p) Ai((p-c)/H) on windows of the controlling alias h = p-1, with and without the alias twist; (b) measured covariance of cos(U log p) against K_T; (c) V_F(T)/D_F | (a) 16,032 windows, 2.95e10 primes, T = 1e6, 1e8, 1e10, 1e12, p = 3 .. 99,991, k = 1 .. 7, centres to 5e13; (b) 4e7 samples, 4656 pairs, 4 frequency sets, T to 1e12; (c) primes < 2^37, 5 heights, 2 widths | (a) untwisted: positive in all 16,032 windows at all 4 cuts; twisted: wrong sign in 0 % of windows for p <= 31 and 37 to 50 % for p >= 997 at T = 1e12; (b) equals K_T (max abs z 4.6); (c) grows with Q at low T (2.2 to 19.8 at T = 14.13) | (a) Re W <= 0 in 45 to 57 % of windows (both characters) at every cut; twisted sum: random sign; (b) equals K_T; (c) 0.57 to 1.7 | SGN, UNI: fail in 43 to 58 %; E_a: 0 failures, as zeta, and V/D = 1.8e5; perturbed primes, composites, random frequencies: covariance equals K_T (max abs z 5.3); T-NR: V/D 0.14 to 14 (taps at powers of 3); DH: not run in (a); HEAT: as zeta (positive smooth reweighting) | CLOSED. Sign of the packet sum = pole at 1 with Lambda >= 0; the Airy condition is object-independent; K_T is an identity for any frequencies; zeta fails the alias-twisted sign test for p above about T^(1/4) |

Three things measured here that are not in the cited records (all MEASURED):
- The whole-grid certificate value with the record's arithmetic phases approaches 1/(p-1)^2 as D grows (for the best residue r: 0.250014, 0.062490, 0.027776, 0.0100005 at D = 256 for p = 3, 5, 7, 11; 1.08509e-4 against 1.08507e-4 at p = 97, D = 2048; 1.024e-6 against 1.008e-6 at p = 997, D = 128; the spread over r closes as D grows), and p/(p-1)^2 after a Legendre twist of the alias index. For p = 2 it is 1 for every D.
- The Airy-envelope packet sum over primes has class means within 4e-4 of H int Ai at T = 1e12 for every cut depth, also when the support contains the negative lobes; the relative standard deviation over windows falls from 1e-2 to 9e-4 between T = 1e6 and T = 1e12 at k = 1.
- E_97(N, A_97, 1) = Phi(N, 97) - N prod_{p <= 97}(1 - 1/p), exact for 361 values of N up to 1e15: 5 sign changes, abs(E) <= 0.51 sqrt(N) (values 3811.06, 17037.65, -23579.52, -4705.19 at N = 1e12, 1e13, 1e14, 1e15); for y = 997 and N <= 1e14 abs(E) reaches 32 sqrt(N), for y = 9973 and N <= 1e12 it reaches 453 sqrt(N).

## 1. Definitions used (what was computed)

Sources read as text: `formalization/lean-aristotle/permutation-calculus/five_shell_identity/` (`FiveShell.lean`, `ARISTOTLE_SUMMARY.md`), `permutation_defect/`, `src/data/imp-95003-five-shell-identity.js`, `imp-95397-alias-sign-determinacy-assessment.js`, `imp-95220-alias-width-law-weight-nogo.js`, `imp-95008-alias-separation-curvature-floor.js`, `imp-95008-evaluation-christoffel-duality.js`, `imp-95018-parity-amgm-gram-sharpness.js`, `imp-95134-sharp-cluster-cap-threshold.js`, `imp-95143`, `imp-95168`, `imp-95942-fresnel-airy-envelope-sign-assessment.js`, `imp-95962-worst-alias-collar-depth-threshold.js`, and PR 13 `research-checkpoints/twin-ladder-physics-2026-10-19/poisson/POISSON_OU_AND_PRIME_BEAT_CORRESPONDENCE_v2.md`. The sibling lane `s2-alias-sieve-sign-image` (same day) already ran E_97 on c = Lambda_F to N = 1e10 and the von Mangoldt weighted sign image with a Gaussian envelope; the tests here use different coefficient vectors, sizes and envelopes and do not repeat those runs.

**Objects.** ZETA; CHI5 (complex character mod 5, chi(2) = i); CHI101 (Legendre symbol mod 101); DH (Davenport-Heilbronn, coefficients 0, 1, kappa, -kappa, -1 on n mod 5, kappa = 0.284079); SGN, UNI (signs and phases from a 64-bit hash of the prime, completely multiplicative; in combination 1 in two versions: on the sieving primes only, a(n) = eps(y-smooth part of n), written SGNy / UNIy, and on all primes, SGNG / UNIG); EA = zeta(s+a) zeta(s-a), a = 1/4 (zeros at 1/2 +- 1/4 + i gamma); TNR = xi(s)(2 cosh((s - 1/2) log 3) + 2.2), Dirichlet coefficients 1 + 2.2 sqrt(3) [3 | n] + 3 [9 | n], Lambda_NR(3^k) = log 3 (1 - alpha^k - beta^k), abs(beta) = 3^0.904; HEAT: the backward heat family has no Dirichlet series (map row 23); it enters only as a positive smooth reweighting of a coefficient vector, which each statistic below either cancels or covers by the same proof as for zeta. This is stated per combination.

**(1) Five-shell functional.** As in the Lean file: Pi_p c = c restricted to n not divisible by p; R_y = product of Pi_p over p <= y; Y_4 = R_y c; Z_g = part of c killed at block g; L_N(c) = sum_{n <= N} c_n; E_y(N, A, c) = L_N(R_y c - A c) = (1 - A) L_N(Y_4) - A sum_g L_N(Z_g). The cut (0,5,10,17,25) of the 25 primes <= 97 only labels the four killed shells; E depends on c through two numbers, L_N(Y_4) (sum over y-rough n) and L_N(c). y = 97, 997 (168 primes), 9973 (1229 primes). c_n = a_F(n), the Dirichlet coefficients. A in {0.1, 0.5, 0.9} and the natural value A_F = lim L_N(Y_4)/L_N(c) = prod_{p <= y} (1 - a_F(p)/p) where it exists. Exact evaluation: L_N(Y_4) = sum over squarefree d | P(y), d <= N, of mu(d) a(d) G(N/d) by depth-first search, G the summatory function of a (integers; residue classes mod 5; character mod 101); for the twists on the sieving primes L_N(c) = sum over y-smooth m of h(m) floor(N/m), h(p^k) = eps_p^(k-1) (eps_p - 1). All integers are 64-bit exact (UNIy in 80-bit floats). Globally twisted coefficients and EA: segmented factor sieve of every n <= 3e10 (complete factorisation, hash sign and phase of every prime factor). Spectral side: f(theta) = sum_{n < M} c_n e(-n theta) on the grid j/M by FFT for the live shell and the full vector; the alias frequencies of the sieve are a/q, q | P(y); the 210 frequencies a/210 lie on the grid.

**(2) Alias coefficients on the punctured lattice.** Record: 1_{p does not divide n} = 1 - 1/p - (1/p) sum_{h=1}^{p-1} e(hn/p); alias h of window k sits at d = k - h/p; G(p,D) = {m/p : 1 <= m <= pD, p does not divide m}; packet at d: two-sided exponential exp(-mu abs(x - u)), mu = d^(1/3)/1.7, u = 2.3/d (the port constants of imp-95397). Two certificates. (a) The coefficient-uniform certificate E of imp-95220: fires iff x_avail > xStarSz(W) >= 2 a* W(p,D), W(p,D) = sum_{m <= pD, p not | m} 2^(-floor(log2(m)/3)), a* = 3.1490 (from qNecE of the record), x_avail = m dbar at the model normalisation Q = 2^(-2/3). It does not see the phases. (b) The phase-sensitive quantity of imp-95397 extended from one window to the whole grid: theta(phi) = phi^H G phi / 1^T G 1, G the exact Gram of the packets, phi_d = e(hr/p) for a residue r = n mod p (arithmetic), against random signs and phases of modulus 1 per packet (SGN, UNI), a random sign or phase per alias class h times the arithmetic phase (SGNH, UNIH: the twist a_h -> eps_h a_h), and the Legendre symbol of h times the arithmetic phase (LEG: a multiplicative character on the alias index). "Fires" = theta < 1/2 (the H-LOC level of the record).

**(3) Cluster correlations.** Record (Theorem CC of imp-95134): packets a_i exp(-mu_i abs(x - u_i)), a_i >= 0, rates >= mu, positions in dyadic blocks [2^b, 2^(b+1)); for same-parity blocks with facing gap D: corr(F_b, F_b') <= (1 + mu D) exp(-mu D), attained by two packets at the facing edges. The numbers 9/20, 2/5, 69/250, 1/4, 0.24505, 0.23208 of the node are rate thresholds mu, not correlation caps; the test "correlation below 0.23208" is therefore read as "correlation below the cap at rate mu = 0.2320723" (and at mu = 9/20). Prime packets: one packet per prime p, amplitude Lambda_F(p) = eps_F(p) log p, rate mu, position u = p (linear) or u = log p (logarithmic, the scale in which the OU memory of combination 4 lives); T-NR has extra packets at 3^k. Integer packets: amplitude a_F(n) at every integer (1, chi_5, DH coefficients). Perturbed primes: positions p + 0.9 (U - 1/2), U uniform from a hash. Statistic R = corr / cap for all same-parity pairs; adjacent-block correlations against rho*(K) = 1/(2 cos(pi/(K+1))); lambda_max of the block Gram against 2; edge clusters made of the K = 1, 2, ..., 64 primes nearest the facing edges. All sums are exact closed forms of the Gram (1/mu + Delta) exp(-mu Delta), accumulated in one pass (prefix recurrences), with exp(-mu D) cancelled analytically in R.

**(4) Airy envelope and OU covariance.** Window (p, k) at height T: controlling alias h = p - 1, d = k - 1 + 1/p, v = T/(2 pi), centre c = v/d, width H = c/sqrt(v) (the convention of the sibling lane), x = (n - c)/H. Envelope sum W = sum over primes of Lambda_F(p) Ai(x) on the support -X <= x <= 8, X in {a_1 = 2.338107, a_2 = 4.087949, 7, 12}; untwisted and with the alias twist e(n h/p). Fail = Re W <= 0 (untwisted); for the twisted sum the model for zeta is -H int Ai/(p - 1) and fail = the opposite sign. The record's own condition (support past -a_1 iff d >= a_1/mu) involves only (p, k). Covariance: for U ~ Cauchy(T, x) the record states Cov(cos(U l), cos(U m)) = K_T(l, m) = (1/2) cos(T(l - m)) [exp(-x abs(l - m)) - exp(-x(l + m))]; measured by sampling for l, m = log p (primes in close pairs at 48 scales from 10 to 1e11), log(p + U') (perturbed), log(p + 1) (composites), and random reals. Aggregated form: V_F(T) = a^T K_T a = int_1^Q v^(2x-1) abs(sum_{v <= p <= Q} a_p p^(-x-iT))^2 x dv with a_p = eps_F(p)(1 - p^(-1/8)) p^(-417/500) (the record's first-prime taps), against its diagonal D_F = (1/2) sum abs(a_p)^2 (1 - p^(-2x)).

## 2. Validation and precision (all MEASURED)

`validate.py`, run locally and on the server with the same results (`validate.json`, `validate_server.json`):
- V1: the Legendre depth-first evaluation equals brute force (N = 1e6 with y = 97 and y = 997; counts, residue classes mod 5, character mod 101) exactly; the smooth-part twist sums equal brute force (signs exactly, phases to 9e-13); the five-shell identity holds exactly on integer vectors, the live shell is the same for three random orders of the 25 projections, and the shells have zero cross terms.
- V2: the factor sieve equals brute force (counts of rough n and hash-sign sums exactly; phases to 1e-11; E_a values to 2e-15 relative). On the server the sieve count of 97-rough and 997-rough n <= 3e10 (3,609,515,493 and 2,428,276,597) equals the depth-first value (two independent code paths).
- V3: one-pass packet summaries (norm, edge sums) against the O(n^2) Gram: 1.7e-14 relative; stitching of chunks: 6e-15; inner product across a gap: 5e-15; OU tail energy against the double sum with kernel K_T: 7e-13. `an3_check.py`: the ratio correlation / cap equals 1 for two packets at the facing edges, and agrees with direct quadrature of the packets to 1e-16.
- V4: Airy window sum (Hermite table, step 1/2048) against a direct sum with scipy's Airy function: 5e-13 of M1.
- V5: theta_C reproduces the four recorded values of imp-95397 (0.062951, 0.062506, 0.028019, 0.027812) to 4e-7 (the record's rounding).
- Re-checks of float64 results at higher precision: combination 2, `check2.py`: 40-digit mpmath recomputation of theta on 8 grids, difference 3e-16; CPU against GPU float64 on 248 common values, 9e-16. Combination 3: the largest ratio of every object recomputed at 40 digits, agreement to 15 digits (table in section 5). Combination 1: every count and every sign sum is an exact 64-bit integer; the FFT alias values agree with exact residue-class sums to 6e-7 absolute on values of size 1e7. Combination 4: the covariance test uses T lambda mod 2 pi computed at 50 digits; the packet sums are float64 sums of at most 1.3e9 terms (no cancellation beyond 1e-4 of M1 in any reported fraction).
- One numerical defect was found and repaired during the run: the Gram formula of combination 2 overflowed (NaN) for p >= 97 with large D in its first form (a positive exponent when the first rate is the smaller one); the formula was rewritten with the larger rate first and those cells were rerun (`c2b.json`). No value was reported from the defective run.

## 3. Why each combination is closed

**(1) Five-shell functional.** PROVED (Lean `five_shell_identity`, `projList_perm`; re-checked on integer vectors): E_y(N, A, c) = L_N(R_y c) - A L_N(c), and the projections Pi_p are commuting diagonal 0/1 masks. Hence (a) every commutator in the permutation-defect bound is zero: the bound gives the allowed size 0 for the reordering defect and says nothing about the size of E; (b) E reads c through two linear functionals. For a_F with sum_{n <= N} a_F(n) = rho N + o(N) and rough density delta_y rho the sign of E at fixed A is the sign of rho (delta_y - A (1 + ...)) for large N: a statement about the residue at s = 1. MEASURED, exact integers, 361 values of N from 1e6 to 1e15 at y = 97: zeta has constant sign for each fixed A (+ for A = 0.1 < A_97 = 0.1203, - for A = 0.5, 0.9), and so do T-NR (-, -, -), the twists on the sieving primes (+ / + / + or -, by their density) and E_a (to 3e10); CHI5, CHI101 and DH change sign at 133 to 155 of the 360 steps for every A, and the hash twists on all primes at 74 to 142 of 7152 steps for y = 97 and 5 to 134 for y = 997 (N <= 3e10; abs(Y_4)/sqrt(N) <= 0.76). The comparison L-functions fall with DH and the random twists. At the natural value A = A_F (main terms cancelled) zeta itself changes sign: 5 changes on the grid for y = 97 (172 values positive, 189 negative), 23 at fine sampling up to 3e10, and none inside the dense window [1e12, 1e12 + 2e9]; T-NR has the same counts as zeta, the twists on the sieving primes 13 to 45 changes. PROVED: for fixed y the y-rough integers form a periodic set (period P(y) = prod_{p <= y} p, 2.3e36 for y = 97), so E_y(N, A_y, 1) = Phi(N, y) - N prod(1 - 1/p) = -sum_{d | P(y)} mu(d) ({N/d} - 1/2) is an exactly periodic function of N, with mean A_y/2 = 0.060 and full-period standard deviation sqrt((prod(2 - 2/p) - A_y^2)/12) = 580 at y = 97 (period, mean and variance checked exactly on the sieve by the primes <= 13: variance 1.01991 on one period of 30030 against 1.01991). It is a function of the sieving primes only: no prime above y and no zero of zeta enters, at any N. The same holds for every coefficient vector that is a periodic function times a function of the y-smooth part (CHI5, CHI101, DH, the twists on the sieving primes, T-NR): their E is a periodic or almost periodic function of N fixed by finitely many primes. Only the twists on all primes and E_a are not of this form. MEASURED on N <= 1e15 (far below the period): max abs(E)/sqrt(N) = 0.51 at y = 97 (abs(E) up to 2.4e4, an initial segment where the divisors d > N contribute the drift -N sum_{d > N} mu(d)/d), 32 at y = 997 (N <= 1e14; 3 sign changes in 58 values), 453 at y = 9973 (N <= 1e12; 2 in 13). The fail criterion "sign change" is therefore met by zeta at the only value of A at which the sign is not fixed by a density.
Spectral side (FFT, M = 220,200,960): the live shell of every coefficient vector that is periodic modulo a divisor of 210 times a 97-smooth weight (ONE, CHI5, DH, SGN on the 25 primes, T-NR) carries the share 0.5263 of its energy on the 210 frequencies a/210 (predicted prod_{11 <= p <= 97}(1 - 1/p) = 0.52639; exact residue sums agree to 7 digits), with Y_4(1/2) = -Y_4(0), Y_4(1/3) = -Y_4(0)/2, Y_4(1/5) = -Y_4(0)/4, Y_4(1/7) = -Y_4(0)/6 (the alias amplitudes -1/(p-1) of the record's eq. (14)); the Legendre character mod 101 carries 1.9e-8 and the global hash twist 9.0e-7 there. DH has the same alias spectrum as zeta; the comparison L-function mod 101 has the alias spectrum of a random twist. For every object the share of grid points with Re E(theta) > 0 is 0.499 to 0.502: off theta = 0 the sign of E carries nothing. The separation is by the modulus of periodicity of the coefficients (location of the poles of the additive twists at s = 1), not by zeros.

**(2) Alias coefficients.** PROVED: a_h(n) = -(1/p) e(hn/p) are the Fourier coefficients of the indicator of p not dividing n. They are the same for every object: no F enters until an n-sum with weights Lambda_F(n) K(n) is formed, and that sum was screened by the sibling lane (closed: it separates Lambda_F >= 0 with a pole from signed coefficients; L-functions fail, E_a passes). The seam certificate with the arithmetic phases alone therefore cannot distinguish zeta from DH, the heat family, E_a, T-NR or L(chi): all get the same number. What can be compared is the arithmetic phase pattern against twisted or random patterns of the same modulus, and there the outcome is the reverse of the proposed one. MEASURED (123 cells, N = (p-1)D up to 196,608; exact Gram): (a) certificate E, which does not see the phases, fires in 0 of 99 cells with p up to 9973 and D up to 1e6 (W(p,D)/(pD)^(2/3) between 0.63 and 2.32; needed 2 a* W >= 6.3 against x_avail <= 1.59): same outcome for every sign pattern; (b) theta with the arithmetic phases tends to 1/(p-1)^2 as D grows (0.2500, 0.0625, 0.02778, 0.01000, 1.085e-4, 1.02e-6 at p = 3, 5, 7, 11, 97, 997 for the best r; the Ramanujan-sum value abs(sum_h e(hr/p))^2/(p-1)^2), and equals 1 identically for p = 2 (one alias class, all phases equal: PROVED); independent random signs or phases give theta equal to the diagonal share, about 1/N (8e-6 at N = 131,072 for every p). Random signs fire (theta < 1/2) in 109 of 123 cells and random phases in 114, against 103 for the arithmetic phases; the cells where the random patterns do not fire all have N <= 12 packets; the arithmetic phases never fire at p = 2 (20 cells). In 64 of the 123 cells the largest of 16 random draws is below the smallest arithmetic value. A random sign per alias class gives about 1/(p-1) (0.008 to 0.02 at p = 97) and the Legendre symbol of h gives p/(p-1)^2 (0.75 at p = 3: does not fire; 0.3125, 0.194, 0.110, 0.01053 at p = 5, 7, 11, 97: Gauss sum of modulus sqrt(p)). The arithmetic pattern is not the one that localises best; the certificate value is a function of p, D and the phase pattern only.

**(3) Cluster correlations.** PROVED (Theorem CC of the record): for amplitudes a_i >= 0 and rates >= mu the cap (1 + mu D) exp(-mu D) holds for any positions of the packets. It therefore holds for zeta (Lambda >= 0), for the perturbed primes, for E_a, for the heat reweighting exp((tau/4) log^2 n) > 0 and for integer packets with a(n) = 1, with no arithmetic input: nothing can fail there. MEASURED on 5,586,502,370 prime packets (all primes below 2^37 = 1.37e11) and all integers below 2^32: no object exceeds the cap in any block, in either geometry, at either rate; the largest ratio R = correlation/cap in linear positions is 0.81 (T-NR, blocks 1 and 3), 0.71 (DH coefficients), 0.38 to 0.68 for the other objects, all at blocks b <= 2; for b >= 10 the ratio is below 4e-4 for prime packets and below 0.034 for integer packets. In logarithmic positions the largest ratio is 0.82 (hash signs, blocks 0 and 2: correlation 0.756 against the cap 0.920); zeta has 0.71, 0.19, 0.34, 0.21 on the pairs (0,2), (0,4), (1,3), (2,4) at mu = 0.2320723. Edge clusters of the K = 1..64 primes nearest the facing edges: largest R = 0.7308 (K = 1, primes 7 and 17 against the edges 8 and 16; 40-digit value 0.730821076431), identical for all objects since a single packet has no sign structure; no block exceeds the cap for any K and any object. First block exceeding the cap: none, for every object. The signed controls are not covered by the theorem, and a signed configuration can exceed the cap (synthetic pair with amplitudes -exp(-mu g), 1 at distance 0.1 from both facing edges: R = 1.27, 1.67, 1.86 at D = 8, 32, 128, limit 2 mu D/(1 + mu D); `synth3.py`, confirmed by quadrature), but this needs two packets within about 1/mu = 4.3 of each edge with tuned unequal amplitudes; with the primes as positions and unimodular twists as amplitudes the same construction gives at most 0.918. The statistic depends on the distances of the nearest primes to powers of 2 (linear positions) or on the first few hundred primes (logarithmic positions); the block Gram has adjacent correlations up to 0.45 to 0.86 on the first blocks and below 3.3e-3 (prime packets) or 0.064 (integer packets) for b >= 10; lambda_max of the matrix of absolute block correlations is 1.45 to 2.55, carried by the first blocks, against the parity value 2 and rho*(36) = 0.5018. No control fails; the cap is a statement about non-negative packets.

**(4) Airy envelope and OU covariance.** (a) PROVED: the support condition of the record (first pre-caustic zero outside the support iff d >= a_1/mu(d)) reads d = k - 1 + 1/p >= 2.815: true for k >= 4, false for k <= 3, for every p, every height and every object. (b) MEASURED on 16,032 windows, 2.95e10 primes, heights 1e6 to 1e12, p up to 99,991, packet centres up to 5e13: the untwisted envelope sum of zeta is positive in every window at every cut, including the cuts X = a_2, 7, 12 that contain the negative lobes of Ai and the windows with k <= 3 where the record's condition fails; its value is H int Ai to within 1 % (ratio 0.990 to 1.007 by class; standard deviation 9e-4 at T = 1e12, k = 1). E_a gives the same (0 failures in 16,032 windows). CHI5, CHI101, SGN, UNI have Re W <= 0 in 43 to 58 % of the windows of every class, including the cut X = a_1 where the envelope is non-negative on the whole support. The sign of the packet sum is the sign of the density-one main term (pole at 1 with Lambda >= 0), not the sign of the envelope: the Airy sign condition is neither necessary (zeta passes without it) nor sufficient (the L-functions fail with it). (c) Alias-twisted sum with the controlling alias h = p - 1: for zeta the mean is -H int Ai/(p-1) (ratio to the model between -0.94 and -1.11 while the main term exceeds the fluctuation). With s = (H int Ai/(p-1))/sqrt(M2) the predicted main term over the fluctuation, the share of windows with the wrong sign is 0 for s >= 3, at most 1.6 % for s between 1.3 and 3, and 33 to 56 % for s <= 0.3: at T = 1e12 (k >= 2) it is 0 % for p <= 31, 1.6 % at p = 97, 17 % at p = 307, 37 % at p = 997 and 47 to 50 % for p >= 3163; at T = 1e6 it is 6 %, 33 %, 43 % at p = 11, 31, 97. Zeta fails the sign test at p of order H^(1/2), i.e. T^(1/4): it does not pass at every size reached. The other objects have random sign at every p, except CHI5 at p = 5 (wrong sign in every window: its twist by e(n/5) has a Gauss-sum main term). (d) PROVED (the record states it): Cov(cos(U l), cos(U m)) = K_T(l, m) for every pair of positive frequencies; no property of primes enters. MEASURED with 4e7 Cauchy samples, 4656 pairs per set, T = 1e6, 1e9, 1e12, x = 0.02, 1: largest deviation 3.8e-4 against values up to 0.5; rms z between 0.63 and 1.37 and max abs z between 2.4 and 5.3 for all four sets (primes, perturbed primes, composites, random reals), with the two largest values (5.0, 5.3) on composites and perturbed primes. Nothing departs from K_T and nothing can. (e) Summed form V_F(T)/D_F with primes to 2^37: for the objects without a pole (CHI5, CHI101, SGN, UNI) the ratio is between 0.51 and 3.6 and changes by less than 1 % from Q = 2^28 to Q = 2^37 (CHI5 0.600, CHI101 0.864, SGN 1.42, UNI 1.72 at T = 14.13, x = 0.02); for zeta it grows with Q at low T (2.17, 3.09, 6.64, 19.8 at Q = 2^20, 2^24, 2^28, 2^37 for T = 14.13; 0.64 to 9.86 for T = 17) because the tap exponent 417/500 + x is below 1 (the pole term Q^(1 - s - x)/abs(1 - s - x - iT)), and stays between 0.49 and 1.73 for T >= 100; E_a reaches 1.8e5 (pole at 1 + a); T-NR is carried by the taps at powers of 3 (0.14 to 14). The only objects that leave the range of the twists are those with a pole to the right of the tap abscissa.

**Controls: where each one stopped.**

| control | (1) sign of E, fixed A / natural A | (2) certificate | (3) cap | (4) envelope sum / alias-twisted sum / covariance |
|---|---|---|---|---|
| zeta | constant / changes (5 on the grid, 23 at fine sampling) | fires for p >= 3, never for p = 2 (same number for every object) | passes (theorem) | positive in all windows / correct sign only while p < about T^(1/4) / equals K_T |
| L(s, chi) (should behave like zeta) | changes at 37 to 43 % of steps / same | same number as zeta | passes (measured) | fails in 43 to 58 % of windows / random sign / equals K_T |
| Davenport-Heilbronn | changes at 37 % of steps; alias spectrum equal to zeta's and chi_5's | same number as zeta | passes (measured, R <= 0.71) | not run (Lambda_DH needs all integers; the sibling lane found 54 to 55 % failures with a Gaussian envelope) / - / equals K_T (frequencies only) |
| backward heat | not formulable (no Dirichlet coefficients) | same number as zeta | passes (positive reweighting, theorem) | positive reweighting, smooth on the window scale: as zeta / as zeta / equals K_T |
| sign twist | on the sieving primes: constant / 13 to 45 changes; on all primes: 5 to 142 changes | random signs fire in more cells and with smaller theta than the arithmetic phases | passes (measured, R <= 0.39 full, 0.73 single packets) | fails in 43 to 58 % / random / equals K_T |
| unimodular twist | on all primes: 52 to 134 changes | random phases: as random signs | passes (measured, R <= 0.57) | fails in 45 to 55 % / random / equals K_T |
| zeta(s+a) zeta(s-a), a = 1/4 | constant for every A tried (to 3e10) | same number as zeta | passes (theorem) | positive in all windows, as zeta / as zeta / equals K_T |
| T-NR | constant / same counts as zeta | same number as zeta | passes (measured, R <= 0.81) | as zeta on windows without a power of 3 (primes only were used) / - / - |

No test meets the survivor definition. In (1) and (4) the comparison L-functions fail with the controls, E_a passes with zeta, and zeta itself fails the natural-A sign test and the alias-twisted sign test at moderate p. In (2) the statistic does not depend on the object and the twisted patterns do better than the arithmetic one. In (3) no control fails.

## 4. Sizes and server use

All server work went through `rhrun`; `rhstatus` was read before each launch; the units of this lane had at most 8 cores of CPU quota in total at any time and at most 12 GB (requests of 1 to 8 GB per unit); GPU 1 only, cupy pool limit 20 to 22 GB. The server load average was 110 to 165 during the run and each unit received about one core whatever its request, so the CPU work was split into units of one core (up to 8 at a time). Units: 3 GPU chains (Gram forms 707 s + 320 s, FFT 21 s + 13 s, covariance about 4 min), Airy windows (2504 s wall, 2.95e10 primes), packet pass in 2 units (2411 s and 2316 s, 5.59e9 prime packets and 4.3e9 integer packets), factor sieve in 3 units (about 1650 s each, 3e10 integers), exact depth-first evaluation in 6 one-core units (3 of them replaced, see (iv)); largest single evaluation 2.86e10 nodes (y = 997, N = 1e14, 347 s).
Events: (i) the first GPU chain hit the cupy pool limit in the FFT (19 GB allocated at length 2.2e8) and in the Gram rerun (chunk of 2.5e8 entries with 9 temporaries); both were reduced (freed arrays, chunk 8e7) and rerun inside the same limit; the complex character mod 5 was run at half length (1.1e8). (ii) The Gram formula overflowed for p >= 97 (section 2) and those cells were rerun. (iii) The first CPU chain was stopped twice by this lane and split into one-core units; one duplicate pair of Airy units was stopped when the original run turned out to have finished. (iv) The phase-twist sum over y-smooth integers (80-bit trigonometry per node) was too slow for y = 997: it was run for y = 97 and N <= 1e12 only, and three units were replaced by versions without it. All units of this lane are stopped.

Reduced or not done: the task text asks for N to 1e12 in combination 1 (reached and exceeded for the exact part: 1e15 at y = 97, 1e14 at y = 997; the factor sieve for twists on all primes and for E_a stopped at 3e10); p to 1e4 and D to 1e6 in combination 2 was reached for certificate E (exact) but the phase-sensitive Gram form stopped at N = (p-1)D = 196,608 packets (a dense Gram of 1e10 packets is 1e20 entries; the limit 1/(p-1)^2 is reached to 3 digits well before); DH in combination 4 (a) (Lambda_DH needs every integer of the window); T-NR in combination 4 (a) (primes only; it equals zeta outside windows that hold a power of 3); the height-dependent version of combination 1 (c_n = a_F(n) n^(-1/2-it)) was not run; the record's own convention for the E_97 evaluator and the Section 4.5 packet constants are not recoverable from the records (stated by the records), so c = 1.7, v = 2.3, H = c/sqrt(v) are the port conventions of imp-95397 and of the sibling lane.

## 5. Tables

### T1. Combination 1: sign of E_y(N, A, c); counts are (number of N with Re E > 0) / (number with Re E < 0) / (sign changes along increasing N)

Natural A: prod_{p <= y}(1 - a_F(p)/p) (for T-NR the density ratio). SGNy_s: hash signs on the sieving primes only, seed s. UNIy: hash phases on the sieving primes (y = 97 only, N <= 1e12).

**y = 97, grid: 361 values of N in [1e+06, 1e+15]; A_y = prod(1-1/p) = 0.120317; largest DFS 6.87e+06 nodes.**

| object | A = 0.1 (+/-/changes) | A = 0.5 | A = 0.9 | natural A: +/-/changes | rms E | max abs(E)/sqrt(N) |
|---|---|---|---|---|---|---|
| ZETA | 361/0/0 | 0/361/0 | 0/361/0 | 172/189/5 | 1.103e+04 | 0.509 |
| CHI5 | 169/191/134 | 169/191/134 | 169/191/134 | 167/193/134 | 161.3 | 0.0312 |
| CHI101 | 196/165/155 | 193/167/151 | 193/168/151 | 193/168/149 | 540.6 | 0.13 |
| DH | 170/191/135 | 168/193/133 | 167/194/133 | - | - | - |
| SGNy_0 | 361/0/0 | 361/0/0 | 361/0/0 | 180/181/14 | 1.504e+05 | 2.33 |
| SGNy_1 | 361/0/0 | 361/0/0 | 0/361/0 | 171/190/13 | 1.209e+04 | 0.571 |
| SGNy_2 | 361/0/0 | 361/0/0 | 361/0/0 | 209/152/45 | 7.621e+04 | 0.84 |
| TNR | 0/361/0 | 0/361/0 | 0/361/0 | 172/189/5 | 1.103e+04 | 0.509 |
| UNIy (241 values, N <= 1e+12) | 241/0/0 | 241/0/0 | 0/241/0 | 116/125/4 | 7523 | 0.59 |

**y = 97, dense: 2000 values of N in [1e+12, 1e+12]; A_y = prod(1-1/p) = 0.120317; largest DFS 1.78e+06 nodes.**

| object | A = 0.1 (+/-/changes) | A = 0.5 | A = 0.9 | natural A: +/-/changes | rms E | max abs(E)/sqrt(N) |
|---|---|---|---|---|---|---|
| ZETA | 2000/0/0 | 0/2000/0 | 0/2000/0 | 2000/0/0 | 3878 | 0.00412 |
| CHI5 | 0/2000/0 | 0/2000/0 | 0/2000/0 | 0/2000/0 | 180 | 0.000322 |
| CHI101 | 1073/926/218 | 1074/925/220 | 1075/924/220 | 1082/917/218 | 195.9 | 0.000621 |
| DH | 0/2000/0 | 0/2000/0 | 0/2000/0 | - | - | - |
| SGNy_0 | 2000/0/0 | 2000/0/0 | 2000/0/0 | 1621/379/61 | 1.844e+04 | 0.0391 |
| SGNy_1 | 2000/0/0 | 2000/0/0 | 0/2000/0 | 2000/0/0 | 7629 | 0.0089 |
| SGNy_2 | 2000/0/0 | 2000/0/0 | 2000/0/0 | 0/2000/0 | 2.27e+04 | 0.0375 |
| TNR | 0/2000/0 | 0/2000/0 | 0/2000/0 | 2000/0/0 | 3878 | 0.00413 |

**y = 997, grid: 58 values of N in [1e+06, 1e+14]; A_y = prod(1-1/p) = 0.0809653; largest DFS 2.86e+10 nodes.**

| object | A = 0.1 (+/-/changes) | A = 0.5 | A = 0.9 | natural A: +/-/changes | rms E | max abs(E)/sqrt(N) |
|---|---|---|---|---|---|---|
| ZETA | 0/58/0 | 0/58/0 | 0/58/0 | 22/36/3 | 4.351e+07 | 32.3 |
| CHI5 | 27/31/27 | 27/31/27 | 27/31/27 | 27/31/27 | 1184 | 0.0532 |
| CHI101 | 32/26/14 | 32/26/14 | 32/26/14 | 32/26/14 | 3673 | 0.142 |
| DH | 26/32/31 | 26/32/31 | 26/32/31 | - | - | - |
| SGNy_0 | 58/0/0 | 58/0/0 | 58/0/0 | 23/35/4 | 7.79e+07 | 56.9 |
| TNR | 0/58/0 | 0/58/0 | 0/58/0 | 22/36/3 | 4.351e+07 | 32.3 |
| UNIy (17 values, N <= 1e+08) | 17/0/0 | 17/0/0 | 0/17/0 | 8/9/1 | 3.73e+04 | 10 |

**y = 9973, grid: 13 values of N in [1e+06, 1e+12]; A_y = prod(1-1/p) = 0.0608847; largest DFS 2.31e+10 nodes.**

| object | A = 0.1 (+/-/changes) | A = 0.5 | A = 0.9 | natural A: +/-/changes | rms E | max abs(E)/sqrt(N) |
|---|---|---|---|---|---|---|
| ZETA | 0/13/0 | 0/13/0 | 0/13/0 | 7/6/2 | 1.341e+08 | 453 |
| CHI5 | 9/4/5 | 9/4/5 | 9/4/5 | 9/4/5 | 2379 | 0.0474 |
| CHI101 | 6/7/3 | 6/7/3 | 6/7/3 | 6/7/3 | 4793 | 0.188 |
| DH | 8/5/5 | 8/5/5 | 8/5/5 | - | - | - |
| SGNy_0 | 13/0/0 | 13/0/0 | 13/0/0 | 7/6/2 | 6.596e+07 | 229 |
| SGNy_1 | 13/0/0 | 13/0/0 | 0/13/0 | 8/5/2 | 7.044e+07 | 228 |
| SGNy_2 | 13/0/0 | 13/0/0 | 13/0/0 | 7/6/2 | 2.632e+07 | 157 |
| TNR | 0/13/0 | 0/13/0 | 0/13/0 | 7/6/2 | 1.341e+08 | 453 |

**Factor sieve, coefficients twisted on all primes, N up to 3e+10, 7153 sample points (every 2^22).** Check: count of 97-rough n = 3609515493, 997-rough = 2428276597.

| object | y | A = 0.1 (+/-/changes) | A = 0.5 | A = 0.9 | A = A_y | max abs(Y_4)/sqrt(N) | abs(S)/sqrt(N) at the end |
|---|---|---|---|---|---|---|---|
| SGNG | 97 | 2791/4362/96 | 2866/4287/98 | 3240/3913/142 | 2761/4392/90 | 0.761 | 0.246 |
| SGNG | 997 | 11/7142/5 | 34/7119/11 | 598/6555/72 | 12/7141/7 | 0.549 | 0.246 |
| UNIG | 97 | 3491/3662/74 | 2593/4560/75 | 3089/4064/84 | 3516/3637/78 | 0.541 | 0.802 |
| UNIG | 997 | 4098/3055/52 | 3057/4096/60 | 3534/3619/134 | 4157/2996/60 | 0.511 | 0.802 |
| EA | 97 | 0/7153/0 | 0/7153/0 | 0/7153/0 | 0/7153/0 | 7.16e+06 | 1.51e+08 |
| EA | 997 | 0/7153/0 | 0/7153/0 | 0/7153/0 | 0/7153/0 | 4.7e+06 | 1.51e+08 |
| ZETA | 97 | 7153/0/0 | 0/7153/0 | 0/7153/0 | 4432/2721/23 | 2.08e+04 | 1.73e+05 |
| ZETA | 997 | 0/7153/0 | 0/7153/0 | 0/7153/0 | 5181/1972/2 | 1.4e+04 | 1.73e+05 |

**FFT of the live shell Y_4, M = 220200960 (float64 GPU: True); predicted alias fraction for coefficients periodic mod a divisor of 210: 0.526388.**

| object | energy fraction on the 210 frequencies a/210 | exact residue-sum value | sup off these, / sqrt(M sum c^2) | Re Y_4(1/2)/abs Y_4(0), Re Y_4(1/3)/abs Y_4(0) | share of grid with Re E > 0 (A = 0.5 / A_97) | FFT vs exact |
|---|---|---|---|---|---|---|
| ONE | 0.526353 | 0.526353 | 0.03422 | -1, -0.5 | 0.5000 / 0.5000 | 5.9e-07 |
| DH | 0.526352 | - | 0.02602 | 1, 0.5 | 0.5000 / 0.5000 | - |
| CHI101 | 1.90734e-08 | 1.90734e-08 | 0.03468 | -1, -0.5 | 0.4999 / 0.5000 | 1.1e-10 |
| SGN97 | 0.526353 | 0.526353 | 0.03422 | -1, -0.5 | 0.5002 / 0.5018 | 5.9e-07 |
| TNR | 0.526353 | - | 0.03422 | -1, -0.5 | 0.4995 / 0.4999 | - |
| SGNG | 9.00801e-07 | 9.00801e-07 | 0.0002906 | 1, 0.5 | 0.5000 / 0.5000 | 6.9e-10 |

### T2. Combination 2

**Certificate E (coefficient-uniform, sign-blind), exact census.** W(p,D)/(pD)^(2/3) over the 99 cells p in {2,..,9973}, D in {1,..,1e6}: between 0.6300 and 2.3161 (bounds of the record for pD >= 64: 5/32 and 28/3). Firing needs x_avail > 2 a* W with a* = 3.1490: fires in 0 of 99 cells.

| p | D | W(p,D) | W/(pD)^(2/3) | x_avail | needed 2 a* W |
|---|---|---|---|---|---|
| 2 | 1 | 1 | 0.6300 | 1.587 | 6.298 |
| 2 | 1024 | 170 | 1.0541 | 0.07878 | 1071 |
| 2 | 1000000 | 18355 | 1.1563 | 0.007937 | 1.156e+05 |
| 97 | 1 | 43.25 | 2.0487 | 0.2199 | 272.4 |
| 97 | 1024 | 4421.25 | 2.0614 | 0.02159 | 2.785e+04 |
| 97 | 1000000 | 461478 | 2.1859 | 0.002176 | 2.906e+06 |
| 9973 | 1 | 962.312 | 2.0770 | 0.04646 | 6061 |
| 9973 | 1024 | 101617 | 2.1588 | 0.004609 | 6.4e+05 |
| 9973 | 1000000 | 1.0461e+07 | 2.2578 | 0.0004646 | 6.588e+07 |

**Complex energy ratio theta = phi^H G phi / 1^T G 1 on the full grid G(p,D) (N = (p-1)D packets), float64 GPU.** ARITH: phi = e(hr/p), the record's coefficients, min..max over r in {1, 2, (p-1)/2, p-1}. SGN / UNI: independent random signs / phases per packet (mean of 8 draws, and the largest). SGNH / UNIH: arithmetic phase times a random sign / phase per alias class h (mean of 4). LEG: arithmetic phase times the Legendre symbol of h. Fires = theta < 1/2.

| p | D | N | ARITH min..max | 1/(p-1)^2 | SGN mean (max) | UNI mean (max) | SGNH | UNIH | LEG | p/(p-1)^2 | diagonal share |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 2 | 1 | 1 | 1..1 | 1 | 1 (1) | 1 (1) | 1 | 1 | - | 2 | 1 |
| 2 | 4 | 4 | 1..1 | 1 | 0.361 (1) | 0.314 (0.482) | 1 | 1 | - | 2 | 0.358 |
| 2 | 16 | 16 | 1..1 | 1 | 0.125 (0.36) | 0.0809 (0.134) | 1 | 1 | - | 2 | 0.0804 |
| 2 | 64 | 64 | 1..1 | 1 | 0.0299 (0.086) | 0.0185 (0.0476) | 1 | 1 | - | 2 | 0.0183 |
| 2 | 256 | 256 | 1..1 | 1 | 0.00441 (0.0114) | 0.0065 (0.0204) | 1 | 1 | - | 2 | 0.00435 |
| 2 | 1024 | 1024 | 1..1 | 1 | 0.000594 (0.0028) | 0.000506 (0.00112) | 1 | 1 | - | 2 | 0.00107 |
| 2 | 131072 | 131072 | 1..1 | 1 | 6.36e-06 (2.03e-05) | 8.17e-06 (1.75e-05) | 1 | 1 | - | 2 | 8.23e-06 |
| 3 | 1 | 2 | 0.4827..0.4827 | 0.25 | 0.741 (1) | 0.632 (0.993) | 0.569 | 0.585 | 0.8276 | 0.75 | 0.655 |
| 3 | 4 | 8 | 0.2721..0.2721 | 0.25 | 0.267 (0.605) | 0.172 (0.389) | 0.393 | 0.585 | 0.7574 | 0.75 | 0.189 |
| 3 | 16 | 32 | 0.2517..0.2517 | 0.25 | 0.0612 (0.133) | 0.0298 (0.0626) | 0.626 | 0.634 | 0.7506 | 0.75 | 0.0406 |
| 3 | 64 | 128 | 0.2501..0.2501 | 0.25 | 0.00324 (0.00996) | 0.00674 (0.0185) | 0.5 | 0.569 | 0.75 | 0.75 | 0.00915 |
| 3 | 256 | 512 | 0.25..0.25 | 0.25 | 0.00332 (0.0108) | 0.00217 (0.00571) | 0.5 | 0.707 | 0.75 | 0.75 | 0.00218 |
| 3 | 1024 | 2048 | 0.25..0.25 | 0.25 | 0.000387 (0.000886) | 0.00039 (0.000952) | 0.375 | 0.609 | 0.75 | 0.75 | 0.000533 |
| 3 | 65536 | 131072 | 0.25..0.25 | 0.25 | 5.19e-06 (1.19e-05) | 6.04e-06 (2.09e-05) | 0.375 | 0.34 | 0.75 | 0.75 | 8.23e-06 |
| 5 | 1 | 4 | 0.1509..0.3997 | 0.0625 | 0.322 (0.699) | 0.507 (0.742) | 0.364 | 0.291 | 0.4949 | 0.3125 | 0.42 |
| 5 | 4 | 16 | 0.06784..0.09029 | 0.0625 | 0.13 (0.356) | 0.113 (0.19) | 0.275 | 0.27 | 0.3289 | 0.3125 | 0.098 |
| 5 | 16 | 64 | 0.06275..0.06481 | 0.0625 | 0.032 (0.115) | 0.0205 (0.0661) | 0.351 | 0.248 | 0.3139 | 0.3125 | 0.0204 |
| 5 | 64 | 256 | 0.06249..0.06273 | 0.0625 | 0.00354 (0.0121) | 0.00414 (0.00958) | 0.289 | 0.231 | 0.3127 | 0.3125 | 0.00459 |
| 5 | 256 | 1024 | 0.06249..0.06253 | 0.0625 | 0.000959 (0.00299) | 0.00157 (0.00397) | 0.402 | 0.349 | 0.3125 | 0.3125 | 0.00109 |
| 5 | 1024 | 4096 | 0.0625..0.0625 | 0.0625 | 0.000149 (0.000382) | 0.00016 (0.000281) | 0.269 | 0.213 | 0.3125 | 0.3125 | 0.000267 |
| 5 | 32768 | 131072 | 0.0625..0.0625 | 0.0625 | 8.21e-06 (1.61e-05) | 7.8e-06 (2.04e-05) | 0.144 | 0.342 | 0.3125 | 0.3125 | 8.24e-06 |
| 7 | 1 | 6 | 0.09133..0.3679 | 0.02778 | 0.274 (0.568) | 0.369 (0.657) | 0.298 | 0.315 | 0.2287 | 0.1944 | 0.311 |
| 7 | 4 | 24 | 0.03209..0.05312 | 0.02778 | 0.047 (0.114) | 0.0724 (0.201) | 0.0867 | 0.155 | 0.1931 | 0.1944 | 0.0663 |
| 7 | 16 | 96 | 0.02806..0.02983 | 0.02778 | 0.0121 (0.0409) | 0.0104 (0.0232) | 0.0934 | 0.176 | 0.194 | 0.1944 | 0.0137 |
| 7 | 64 | 384 | 0.02779..0.02798 | 0.02778 | 0.00198 (0.00499) | 0.00393 (0.00697) | 0.147 | 0.164 | 0.1944 | 0.1944 | 0.00306 |
| 7 | 256 | 1536 | 0.02778..0.0278 | 0.02778 | 0.000982 (0.00483) | 0.00102 (0.00394) | 0.108 | 0.0977 | 0.1944 | 0.1944 | 0.000727 |
| 7 | 1024 | 6144 | 0.02778..0.02778 | 0.02778 | 0.000286 (0.00103) | 0.000216 (0.000922) | 0.0928 | 0.202 | 0.1944 | 0.1944 | 0.000178 |
| 7 | 16384 | 98304 | 0.02778..0.02778 | 0.02778 | 2.15e-05 (0.000107) | 1.54e-05 (8.13e-05) | 0.29 | 0.148 | 0.1944 | 0.1944 | 1.1e-05 |
| 7 | 32768 | 196608 | 0.02778..0.02778 | 0.02778 | 9.85e-06 (3.71e-05) | 4.2e-06 (7.67e-06) | 0.118 | 0.0723 | 0.1944 | 0.1944 | 5.49e-06 |
| 11 | 1 | 10 | 0.04918..0.3371 | 0.01 | 0.239 (0.67) | 0.264 (0.447) | 0.174 | 0.201 | 0.219 | 0.11 | 0.205 |
| 11 | 4 | 40 | 0.01273..0.03216 | 0.01 | 0.0295 (0.0785) | 0.0265 (0.0484) | 0.0503 | 0.0628 | 0.1193 | 0.11 | 0.0404 |
| 11 | 16 | 160 | 0.0102..0.01175 | 0.01 | 0.0139 (0.0386) | 0.00777 (0.018) | 0.179 | 0.109 | 0.1108 | 0.11 | 0.00823 |
| 11 | 64 | 640 | 0.01001..0.01017 | 0.01 | 0.00187 (0.0045) | 0.00172 (0.0037) | 0.112 | 0.157 | 0.1101 | 0.11 | 0.00184 |
| 11 | 256 | 2560 | 0.01..0.01002 | 0.01 | 0.000241 (0.000729) | 0.000356 (0.00119) | 0.0766 | 0.0683 | 0.11 | 0.11 | 0.000436 |
| 11 | 1024 | 10240 | 0.01..0.01 | 0.01 | 0.000113 (0.00024) | 9.85e-05 (0.000215) | 0.164 | 0.0706 | 0.11 | 0.11 | 0.000107 |
| 11 | 16384 | 163840 | 0.01..0.01 | 0.01 | 3.06e-06 (9.7e-06) | 3.37e-06 (6.38e-06) | 0.0525 | 0.0988 | 0.11 | 0.11 | 6.59e-06 |
| 97 | 1 | 96 | 0.002639..0.2929 | 0.0001085 | 0.0236 (0.0529) | 0.0277 (0.0369) | 0.0158 | 0.0248 | 0.01264 | 0.01053 | 0.0249 |
| 97 | 4 | 384 | 0.0002787..0.01709 | 0.0001085 | 0.00347 (0.00679) | 0.00459 (0.0103) | 0.012 | 0.00968 | 0.01061 | 0.01053 | 0.00434 |
| 97 | 16 | 1536 | 0.0001218..0.00137 | 0.0001085 | 0.000226 (0.000358) | 0.000585 (0.00147) | 0.00694 | 0.00822 | 0.01053 | 0.01053 | 0.000866 |
| 97 | 64 | 6144 | 0.0001096..0.0002176 | 0.0001085 | 9.54e-05 (0.000404) | 0.000124 (0.000348) | 0.0136 | 0.0148 | 0.01052 | 0.01053 | 0.000192 |
| 97 | 256 | 24576 | 0.0001086..0.000119 | 0.0001085 | 6.2e-05 (0.000195) | 5.33e-05 (9.49e-05) | 0.00683 | 0.016 | 0.01052 | 0.01053 | 4.55e-05 |
| 97 | 1024 | 98304 | 0.0001085..0.0001096 | 0.0001085 | 1.65e-05 (5.68e-05) | 1.49e-05 (3.7e-05) | 0.0143 | 0.00278 | 0.01053 | 0.01053 | 1.11e-05 |
| 97 | 2048 | 196608 | 0.0001085..0.0001089 | 0.0001085 | 5.71e-06 (1.54e-05) | 5.95e-06 (1.6e-05) | 0.0076 | 0.0147 | 0.01053 | 0.01053 | 5.53e-06 |
| 997 | 1 | 996 | 0.0001128..0.2883 | 1.008e-06 | 0.00217 (0.00388) | 0.00364 (0.0117) | 0.00235 | 0.00135 | 0.002395 | 0.001005 | 0.00247 |
| 997 | 4 | 3984 | 8.521e-06..0.01641 | 1.008e-06 | 0.000227 (0.00041) | 0.000311 (0.000637) | 0.000362 | 0.00138 | 0.001111 | 0.001005 | 0.000421 |
| 997 | 16 | 15936 | 1.598e-06..0.00121 | 1.008e-06 | 7.66e-05 (0.000136) | 7.26e-05 (0.000199) | 0.000564 | 0.00048 | 0.001015 | 0.001005 | 8.37e-05 |
| 997 | 64 | 63744 | 1.06e-06..0.0001038 | 1.008e-06 | 1.21e-05 (1.79e-05) | 1.09e-05 (2.44e-05) | 0.00151 | 0.000677 | 0.001006 | 0.001005 | 1.86e-05 |
| 997 | 128 | 127488 | 1.024e-06..3.2e-05 | 1.008e-06 | 7.88e-06 (1.45e-05) | 8.62e-06 (2.32e-05) | 0.00155 | 0.000976 | 0.001005 | 0.001005 | 8.97e-06 |
| 9973 | 1 | 9972 | 4.769e-06..0.2879 | 1.006e-08 | 0.000182 (0.000303) | 0.000224 (0.000528) | 0.000379 | 0.000256 | 0.0002326 | 0.0001003 | 0.000249 |
| 9973 | 4 | 39888 | 3.3e-07..0.01636 | 1.006e-08 | 4.8e-05 (0.0001) | 4.81e-05 (9.26e-05) | 7.53e-05 | 5.62e-05 | 0.0001105 | 0.0001003 | 4.22e-05 |
| 9973 | 16 | 159552 | 3.523e-08..0.001204 | 1.006e-08 | 5.48e-06 (1.18e-05) | 4.9e-06 (9.69e-06) | 7.78e-05 | 5.86e-05 | 0.0001012 | 0.0001003 | 8.36e-06 |

Counts over the 123 cells (largest N = 196608): ARITH fires for every r in 103 cells (fails in [(2, 1), (2, 2), (2, 3), (2, 4), (2, 6), (2, 8)] ...); random signs fire in 109, random phases in 114 (fail in [(2, 1), (2, 2), (2, 3), (2, 4), (2, 6), (3, 1), (3, 2), (3, 4), (3, 6), (5, 1), (5, 2), (5, 3), (7, 1), (11, 1)], [(2, 1), (2, 2), (2, 3), (2, 6), (3, 1), (3, 2), (5, 1), (5, 2), (7, 1)]); LEG fails in [(3, 1), (3, 2), (3, 3), (3, 4), (3, 6), (3, 8), (3, 16), (3, 32), (3, 64), (3, 128), (3, 256), (3, 512), (3, 1024), (3, 2048), (3, 4096), (3, 8192), (3, 16384), (3, 32768), (3, 65536)]. Largest random theta below the smallest arithmetic theta in 64 cells, below the largest arithmetic theta in 86 cells.


### T3. Combination 3 (and the OU tail energy of combination 4)

**Prime packets, amplitude Lambda_F(p) = eps_F(p) log p, all primes of each block (5586502370 packets).** Blocks [2^b, 2^(b+1)), b = 1..36; same-parity pairs (b, b+2), gap D = 2^(b+1); R = corr / cap, cap = (1 + mu D) exp(-mu D). rho*(K) = 1/(2 cos(pi/(K+1))) = 0.501808 for K = 36 blocks.

| geometry, mu | object | max R over b | at b | max R, b >= 10 | first b with R > 1 | number of b with R > 1 | max adjacent corr (gap 0) | same, b >= 10 | lambda_max of abs block Gram |
|---|---|---|---|---|---|---|---|---|---|
| LIN, 0.2320723 | ZETA | 0.487861 | 1 | 0.0001157 | None | 0 | 0.8235 | 0.00143 | 2.332391 |
| LIN, 0.2320723 | CHI5 | 0.575679 | 1 | 0.0003616 | None | 0 | 0.8237 | 0.00272 | 2.436810 |
| LIN, 0.2320723 | CHI101 | 0.565134 | 2 | 0.0002407 | None | 0 | 0.4547 | 0.0029 | 1.682179 |
| LIN, 0.2320723 | SGN | 0.380499 | 2 | 0.0002948 | None | 0 | 0.8235 | 0.000817 | 2.050891 |
| LIN, 0.2320723 | UNI | 0.554506 | 2 | 0.0002453 | None | 0 | 0.7851 | 0.0033 | 2.424745 |
| LIN, 0.2320723 | EA | 0.487351 | 1 | 0.0001127 | None | 0 | 0.8224 | 0.0014 | 2.326492 |
| LIN, 0.2320723 | TNR | 0.810188 | 1 | 3.53e-05 | None | 0 | 0.8515 | 8.68e-05 | 2.550444 |
| LIN, 0.45 | ZETA | 0.190404 | 1 | 2.814e-05 | None | 0 | 0.5935 | 0.000667 | 1.720452 |
| LIN, 0.45 | CHI5 | 0.265171 | 2 | 4.655e-05 | None | 0 | 0.5129 | 0.000989 | 1.707180 |
| LIN, 0.45 | CHI101 | 0.286969 | 2 | 3.944e-05 | None | 0 | 0.2722 | 0.0011 | 1.451046 |
| LIN, 0.45 | SGN | 0.197042 | 2 | 4.314e-05 | None | 0 | 0.5935 | 0.000373 | 1.680778 |
| LIN, 0.45 | UNI | 0.275876 | 2 | 4.079e-05 | None | 0 | 0.541 | 0.00108 | 1.698440 |
| LIN, 0.45 | EA | 0.189949 | 1 | 2.742e-05 | None | 0 | 0.5914 | 0.00065 | 1.717920 |
| LIN, 0.45 | TNR | 0.532671 | 1 | 1.348e-05 | None | 0 | 0.6476 | 7.3e-06 | 2.033939 |
| LIN jittered, 0.2320723 | ZETA | 0.45679 | 1 | 0.0001218 | None | 0 | 0.8229 | 0.00144 | 2.305992 |
| LIN jittered, 0.2320723 | CHI5 | 0.540911 | 1 | 0.0003766 | None | 0 | 0.8418 | 0.00268 | 2.411296 |
| LIN jittered, 0.2320723 | CHI101 | 0.592745 | 2 | 0.0002506 | None | 0 | 0.4785 | 0.00284 | 1.732981 |
| LIN jittered, 0.2320723 | SGN | 0.388672 | 2 | 0.0003101 | None | 0 | 0.8229 | 0.000919 | 2.048488 |
| LIN jittered, 0.2320723 | UNI | 0.572786 | 2 | 0.0002633 | None | 0 | 0.7984 | 0.00331 | 2.423455 |
| LIN jittered, 0.2320723 | EA | 0.456302 | 1 | 0.0001186 | None | 0 | 0.8221 | 0.00141 | 2.299309 |
| LIN jittered, 0.2320723 | TNR | 0.797845 | 1 | 3.984e-05 | None | 0 | 0.8427 | 9.59e-05 | 2.533356 |

**Prime packets, logarithmic positions.** Positions u = log n, blocks 2^b <= u < 2^(b+1), b = 0..4 (block 4 truncated at n = 137438953472, u = 25.646, its upper edge is the truncation point).

| mu | object | corr(0,2) / cap | corr(0,4) / cap | corr(1,3) / cap | corr(2,4) / cap | adjacent corr | lambda_max of block Gram |
|---|---|---|---|---|---|---|---|
| 0.2320723 | ZETA | 0.6503 / 0.9205 | 0.0317 / 0.1649 | 0.2586 / 0.7621 | 0.09159 / 0.4462 | 0.941, 0.799, 0.472, 0.365 | 2.7799 |
| 0.2320723 | CHI5 | 0.6883 / 0.9205 | 0.02932 / 0.1649 | 0.2106 / 0.7621 | 0.08148 / 0.4462 | 0.976, 0.765, 0.433, 0.341 | 2.7671 |
| 0.2320723 | CHI101 | 0.3615 / 0.9205 | 0.0621 / 0.1649 | 0.4435 / 0.7621 | 0.1495 / 0.4462 | 0.955, 0.327, 0.456, 0.39 | 2.5560 |
| 0.2320723 | SGN | 0.7562 / 0.9205 | 0.04409 / 0.1649 | 0.3484 / 0.7621 | 0.09201 / 0.4462 | 0.94, 0.899, 0.486, 0.38 | 2.9648 |
| 0.2320723 | UNI | 0.6097 / 0.9205 | 0.04205 / 0.1649 | 0.268 / 0.7621 | 0.1271 / 0.4462 | 0.873, 0.767, 0.492, 0.471 | 2.7276 |
| 0.2320723 | EA | 0.6375 / 0.9205 | 0.03015 / 0.1649 | 0.2492 / 0.7621 | 0.08903 / 0.4462 | 0.939, 0.788, 0.463, 0.358 | 2.7550 |
| 0.2320723 | TNR | 0.6104 / 0.9205 | 0.02994 / 0.1649 | 0.2661 / 0.7621 | 0.09414 / 0.4462 | 0.913, 0.786, 0.492, 0.359 | 2.7401 |
| 0.45 | ZETA | 0.3221 / 0.7725 | 0.0004318 / 0.01341 | 0.03927 / 0.4628 | 0.004196 / 0.1257 | 0.832, 0.542, 0.156, 0.0873 | 2.1684 |
| 0.45 | CHI5 | 0.351 / 0.7725 | 0.0002832 / 0.01341 | 0.0234 / 0.4628 | 0.002844 / 0.1257 | 0.896, 0.497, 0.12, 0.0642 | 2.2024 |
| 0.45 | CHI101 | 0.3472 / 0.7725 | 0.001677 / 0.01341 | 0.1114 / 0.4628 | 0.01334 / 0.1257 | 0.871, 0.433, 0.292, 0.0882 | 2.1902 |
| 0.45 | SGN | 0.4559 / 0.7725 | 0.001044 / 0.01341 | 0.06897 / 0.4628 | 0.004599 / 0.1257 | 0.83, 0.723, 0.142, 0.116 | 2.3652 |
| 0.45 | UNI | 0.2706 / 0.7725 | 0.0008647 / 0.01341 | 0.04552 / 0.4628 | 0.009189 / 0.1257 | 0.68, 0.481, 0.179, 0.172 | 1.9922 |
| 0.45 | EA | 0.3048 / 0.7725 | 0.0003768 / 0.01341 | 0.03531 / 0.4628 | 0.00381 / 0.1257 | 0.827, 0.521, 0.146, 0.0811 | 2.1405 |
| 0.45 | TNR | 0.2749 / 0.7725 | 0.0003834 / 0.01341 | 0.04133 / 0.4628 | 0.004412 / 0.1257 | 0.758, 0.512, 0.171, 0.0844 | 2.0691 |

**Integer packets, amplitude a_F(n) (INT1: 1; CHI5INT: chi_5(n); DHINT: Davenport-Heilbronn coefficients), every integer.** Blocks [2^b, 2^(b+1)), b = 1..31; same-parity pairs (b, b+2), gap D = 2^(b+1); R = corr / cap, cap = (1 + mu D) exp(-mu D). rho*(K) = 1/(2 cos(pi/(K+1))) = 0.502419 for K = 31 blocks.

| geometry, mu | object | max R over b | at b | max R, b >= 10 | first b with R > 1 | number of b with R > 1 | max adjacent corr (gap 0) | same, b >= 10 | lambda_max of abs block Gram |
|---|---|---|---|---|---|---|---|---|---|
| LIN, 0.2320723 | INT1 | 0.573182 | 1 | 0.0005279 | None | 0 | 0.8646 | 0.00224 | 2.417901 |
| LIN, 0.2320723 | CHI5INT | 0.67693 | 2 | 0.03343 | None | 0 | 0.8215 | 0.0644 | 2.365033 |
| LIN, 0.2320723 | DHINT | 0.710395 | 2 | 0.02647 | None | 0 | 0.6737 | 0.0358 | 2.334303 |
| LIN, 0.45 | INT1 | 0.318719 | 1 | 0.0002679 | None | 0 | 0.6787 | 0.00115 | 1.877394 |
| LIN, 0.45 | CHI5INT | 0.41524 | 2 | 0.005421 | None | 0 | 0.6243 | 0.012 | 1.826758 |
| LIN, 0.45 | DHINT | 0.387488 | 2 | 0.004114 | None | 0 | 0.4496 | 0.00664 | 1.659133 |

**Integer packets, logarithmic positions.** Positions u = log n, blocks 2^b <= u < 2^(b+1), b = 0..4 (block 4 truncated at n = 4294967296, u = 22.181, its upper edge is the truncation point).

| mu | object | corr(0,2) / cap | corr(0,4) / cap | corr(1,3) / cap | corr(2,4) / cap | adjacent corr | lambda_max of block Gram |
|---|---|---|---|---|---|---|---|
| 0.2320723 | INT1 | 0.6461 / 0.9205 | 0.06069 / 0.1649 | 0.2565 / 0.7621 | 0.1705 / 0.4462 | 0.941, 0.796, 0.471, 0.605 | 2.8236 |
| 0.2320723 | CHI5INT | 0.01917 / 0.9205 | 0.08933 / 0.1649 | 0.454 / 0.7621 | 0.205 / 0.4462 | 0.21, 0.429, 0.0345, 0.138 | 1.8402 |
| 0.2320723 | DHINT | 0.02186 / 0.9205 | 0.08863 / 0.1649 | 0.4661 / 0.7621 | 0.205 / 0.4462 | 0.225, 0.415, 0.0345, 0.138 | 1.8488 |
| 0.45 | INT1 | 0.317 / 0.7725 | 0.001679 / 0.01341 | 0.03863 / 0.4628 | 0.01593 / 0.1257 | 0.831, 0.538, 0.156, 0.28 | 2.1639 |
| 0.45 | CHI5INT | 0.2219 / 0.7725 | 0.00802 / 0.01341 | 0.2523 / 0.4628 | 0.06771 / 0.1257 | 0.297, 0.535, 0.321, 0.399 | 1.9691 |
| 0.45 | DHINT | 0.2165 / 0.7725 | 0.007913 / 0.01341 | 0.2713 / 0.4628 | 0.06771 / 0.1257 | 0.311, 0.544, 0.321, 0.399 | 1.9869 |

**Edge clusters: the K primes nearest below U = 2^(b+1) against the K primes nearest above V = 2^(b+2), b = 1..34, linear positions, mu = 0.2320723.** Entry: max over b of R = corr / cap, and the first b with R > 1 (in brackets, with the number of such b). The worst case of each object is recomputed at 40 digits.

| object | K = 1 | K = 2 | K = 4 | K = 8 | K = 16 | K = 32 | K = 64 | 40-digit value of the largest R |
|---|---|---|---|---|---|---|---|---|
| ZETA | 0.73082 (none; 0) | 0.56613 (none; 0) | 0.51436 (none; 0) | 0.51436 (none; 0) | 0.51436 (none; 0) | 0.51436 (none; 0) | 0.51436 (none; 0) | 0.730821076431 (K = 1, b = 2; float64 0.730821076431) |
| CHI5 | 0.73082 (none; 0) | 0.63179 (none; 0) | 0.50752 (none; 0) | 0.50752 (none; 0) | 0.50752 (none; 0) | 0.50752 (none; 0) | 0.50752 (none; 0) | 0.730821076431 (K = 1, b = 2; float64 0.730821076431) |
| CHI101 | 0.73082 (none; 0) | 0.65289 (none; 0) | 0.57668 (none; 0) | 0.56513 (none; 0) | 0.56513 (none; 0) | 0.56513 (none; 0) | 0.56513 (none; 0) | 0.730821076431 (K = 1, b = 2; float64 0.730821076431) |
| SGN | 0.73082 (none; 0) | 0.56613 (none; 0) | 0.52757 (none; 0) | 0.3805 (none; 0) | 0.3805 (none; 0) | 0.3805 (none; 0) | 0.3805 (none; 0) | 0.730821076431 (K = 1, b = 2; float64 0.730821076431) |
| UNI | 0.73082 (none; 0) | 0.57375 (none; 0) | 0.5116 (none; 0) | 0.55451 (none; 0) | 0.55451 (none; 0) | 0.55451 (none; 0) | 0.55451 (none; 0) | 0.730821076431 (K = 1, b = 2; float64 0.730821076431) |
| EA | 0.73082 (none; 0) | 0.56689 (none; 0) | 0.51343 (none; 0) | 0.51343 (none; 0) | 0.51343 (none; 0) | 0.51343 (none; 0) | 0.51343 (none; 0) | 0.730821076431 (K = 1, b = 2; float64 0.730821076431) |
| TNR | 0.73082 (none; 0) | 0.56613 (none; 0) | 0.51436 (none; 0) | 0.51436 (none; 0) | 0.51436 (none; 0) | 0.51436 (none; 0) | 0.51436 (none; 0) | 0.730821076431 (K = 1, b = 2; float64 0.730821076431) |
| ZETA jittered | 0.74384 (none; 0) | 0.58152 (none; 0) | 0.48197 (none; 0) | 0.48197 (none; 0) | 0.48197 (none; 0) | 0.48197 (none; 0) | 0.48197 (none; 0) | 0.743838585023 (K = 1, b = 2; float64 0.743838585023) |

Tuned signed pair (amplitudes -exp(-mu gap), 1 on the two primes nearest each facing edge; not an arithmetic object): R > 1 from b = None on, in 0 of 33 blocks, max R = 0.918367, limit 2 mu D/(1 + mu D) -> 2. R by block: 2: 0.9184, 3: 0.284, 4: 0.5856, 5: 0.351, 6: 0.6847, 7: 0.05139, 8: 0.1326, 9: 0.1985


**OU tail energy (covariance K_T summed with a_p = eps_F(p)(1 - p^(-1/8)) p^(-417/500), first-prime taps), ratio V_F(T)/D_F.**

| Q | x | T | ZETA | CHI5 | CHI101 | SGN | UNI | EA | TNR |
|---|---|---|---|---|---|---|---|---|---|
| 2^20 | 0.02 | 14.1347 | 2.166 | 0.5995 | 0.8786 | 1.403 | 1.712 | 16.1 | 6.219 |
| 2^20 | 0.02 | 17 | 0.6378 | 1.067 | 0.6961 | 0.532 | 0.7195 | 15.76 | 0.1502 |
| 2^20 | 0.02 | 100 | 0.237 | 0.9031 | 1.694 | 1.422 | 0.8016 | 0.3623 | 7.124 |
| 2^20 | 0.02 | 10000 | 1.649 | 0.6068 | 0.8743 | 0.6639 | 1.125 | 1.299 | 8.272 |
| 2^20 | 0.02 | 1e+06 | 0.798 | 0.9264 | 0.6313 | 3.601 | 0.6809 | 1.016 | 1.469 |
| 2^20 | 0.166 | 14.1347 | 2.49 | 0.7442 | 1.068 | 1.617 | 1.352 | 15.82 | 5.213 |
| 2^20 | 0.166 | 17 | 0.5185 | 1.072 | 0.6753 | 0.5838 | 0.7803 | 12.04 | 0.2036 |
| 2^20 | 0.166 | 100 | 0.3451 | 0.9946 | 1.578 | 1.191 | 0.7434 | 0.4339 | 5.226 |
| 2^20 | 0.166 | 10000 | 1.721 | 0.8286 | 0.7995 | 0.5935 | 1.198 | 1.248 | 6.068 |
| 2^20 | 0.166 | 1e+06 | 0.7064 | 1.106 | 0.5674 | 3.353 | 0.8547 | 0.9209 | 1.978 |
| 2^24 | 0.02 | 14.1347 | 3.088 | 0.6031 | 0.867 | 1.42 | 1.698 | 166.4 | 7.121 |
| 2^24 | 0.02 | 17 | 0.7753 | 1.05 | 0.6987 | 0.5285 | 0.7193 | 120.2 | 0.105 |
| 2^24 | 0.02 | 100 | 0.2566 | 0.8903 | 1.663 | 1.363 | 0.7879 | 3.614 | 8.527 |
| 2^24 | 0.02 | 10000 | 1.668 | 0.6062 | 0.8748 | 0.6479 | 1.097 | 1.381 | 9.966 |
| 2^24 | 0.02 | 1e+06 | 0.8148 | 0.9162 | 0.6102 | 3.632 | 0.6941 | 1.073 | 1.112 |
| 2^24 | 0.166 | 14.1347 | 2.992 | 0.7446 | 1.065 | 1.62 | 1.349 | 125.1 | 5.671 |
| 2^24 | 0.166 | 17 | 0.7317 | 1.068 | 0.6761 | 0.5837 | 0.7795 | 87.56 | 0.18 |
| 2^24 | 0.166 | 100 | 0.3554 | 0.9914 | 1.573 | 1.179 | 0.7403 | 2.733 | 5.907 |
| 2^24 | 0.166 | 10000 | 1.725 | 0.8283 | 0.7996 | 0.5904 | 1.192 | 1.257 | 6.788 |
| 2^24 | 0.166 | 1e+06 | 0.709 | 1.105 | 0.5638 | 3.359 | 0.8569 | 0.9265 | 1.831 |
| 2^28 | 0.02 | 14.1347 | 6.64 | 0.5997 | 0.8638 | 1.426 | 1.709 | 1499 | 6.602 |
| 2^28 | 0.02 | 17 | 2.028 | 1.047 | 0.6988 | 0.5105 | 0.7142 | 999.8 | 0.09517 |
| 2^28 | 0.02 | 100 | 0.3056 | 0.897 | 1.662 | 1.367 | 0.7921 | 29.38 | 9.237 |
| 2^28 | 0.02 | 10000 | 1.663 | 0.6048 | 0.8662 | 0.6528 | 1.097 | 1.185 | 11.04 |
| 2^28 | 0.02 | 1e+06 | 0.8081 | 0.9099 | 0.6219 | 3.624 | 0.6992 | 0.8946 | 1.113 |
| 2^28 | 0.166 | 14.1347 | 4.039 | 0.7442 | 1.065 | 1.621 | 1.35 | 991.9 | 5.406 |
| 2^28 | 0.166 | 17 | 1.298 | 1.068 | 0.676 | 0.5815 | 0.7786 | 676.8 | 0.1715 |
| 2^28 | 0.166 | 100 | 0.373 | 0.9922 | 1.572 | 1.18 | 0.7409 | 19.88 | 6.213 |
| 2^28 | 0.166 | 10000 | 1.724 | 0.8283 | 0.7985 | 0.5912 | 1.192 | 1.188 | 7.165 |
| 2^28 | 0.166 | 1e+06 | 0.7079 | 1.104 | 0.5652 | 3.358 | 0.8575 | 0.8829 | 1.805 |
| 2^32 | 0.02 | 14.1347 | 9.345 | 0.6001 | 0.8644 | 1.422 | 1.714 | 1.225e+04 | 5.758 |
| 2^32 | 0.02 | 17 | 3.451 | 1.049 | 0.6976 | 0.5097 | 0.7128 | 8389 | 0.1212 |
| 2^32 | 0.02 | 100 | 0.385 | 0.8961 | 1.661 | 1.369 | 0.797 | 243.5 | 10.13 |
| 2^32 | 0.02 | 10000 | 1.673 | 0.6054 | 0.8655 | 0.6511 | 1.099 | 1.718 | 12.57 |
| 2^32 | 0.02 | 1e+06 | 0.8085 | 0.9106 | 0.6216 | 3.62 | 0.6997 | 0.8406 | 1.138 |
| 2^32 | 0.166 | 14.1347 | 5.52 | 0.7442 | 1.065 | 1.621 | 1.351 | 7790 | 5.276 |
| 2^32 | 0.166 | 17 | 2.325 | 1.068 | 0.6759 | 0.5814 | 0.7786 | 5372 | 0.1957 |
| 2^32 | 0.166 | 100 | 0.4046 | 0.9921 | 1.572 | 1.18 | 0.7414 | 155.6 | 6.568 |
| 2^32 | 0.166 | 10000 | 1.725 | 0.8283 | 0.7984 | 0.591 | 1.192 | 1.294 | 7.609 |
| 2^32 | 0.166 | 1e+06 | 0.7079 | 1.104 | 0.5652 | 3.357 | 0.8575 | 0.861 | 1.778 |
| 2^36 | 0.02 | 14.1347 | 11.23 | 0.6004 | 0.8645 | 1.422 | 1.716 | 1.038e+05 | 6.851 |
| 2^36 | 0.02 | 17 | 8.302 | 1.05 | 0.6968 | 0.5095 | 0.7121 | 7.207e+04 | 0.06225 |
| 2^36 | 0.02 | 100 | 0.5133 | 0.8957 | 1.661 | 1.37 | 0.7977 | 2087 | 10.67 |
| 2^36 | 0.02 | 10000 | 1.672 | 0.6054 | 0.8663 | 0.6507 | 1.1 | 1.833 | 13.52 |
| 2^36 | 0.02 | 1e+06 | 0.8076 | 0.9105 | 0.6225 | 3.623 | 0.6993 | 0.7521 | 1.068 |
| 2^36 | 0.166 | 14.1347 | 8.46 | 0.7442 | 1.065 | 1.621 | 1.351 | 6.315e+04 | 5.935 |
| 2^36 | 0.166 | 17 | 4.564 | 1.068 | 0.6758 | 0.5814 | 0.7785 | 4.372e+04 | 0.1658 |
| 2^36 | 0.166 | 100 | 0.4678 | 0.9921 | 1.572 | 1.18 | 0.7415 | 1265 | 6.786 |
| 2^36 | 0.166 | 10000 | 1.725 | 0.8283 | 0.7985 | 0.591 | 1.192 | 1.399 | 7.836 |
| 2^36 | 0.166 | 1e+06 | 0.7079 | 1.104 | 0.5652 | 3.358 | 0.8574 | 0.8478 | 1.752 |
| 2^37 | 0.02 | 14.1347 | 19.82 | 0.6003 | 0.8644 | 1.422 | 1.716 | 1.794e+05 | 5.214 |
| 2^37 | 0.02 | 17 | 9.864 | 1.05 | 0.6966 | 0.5098 | 0.7122 | 1.236e+05 | 0.1383 |
| 2^37 | 0.02 | 100 | 0.5575 | 0.8957 | 1.661 | 1.37 | 0.7977 | 3576 | 10.92 |
| 2^37 | 0.02 | 10000 | 1.674 | 0.6054 | 0.866 | 0.6505 | 1.1 | 2.58 | 13.97 |
| 2^37 | 0.02 | 1e+06 | 0.8076 | 0.9105 | 0.6225 | 3.623 | 0.6993 | 0.7562 | 1.013 |
| 2^37 | 0.166 | 14.1347 | 9.987 | 0.7442 | 1.065 | 1.621 | 1.351 | 1.072e+05 | 5.125 |
| 2^37 | 0.166 | 17 | 5.412 | 1.068 | 0.6758 | 0.5814 | 0.7785 | 7.405e+04 | 0.2213 |
| 2^37 | 0.166 | 100 | 0.4921 | 0.9921 | 1.572 | 1.18 | 0.7415 | 2142 | 6.882 |
| 2^37 | 0.166 | 10000 | 1.725 | 0.8283 | 0.7984 | 0.591 | 1.192 | 1.543 | 7.933 |
| 2^37 | 0.166 | 1e+06 | 0.7079 | 1.104 | 0.5652 | 3.358 | 0.8574 | 0.8477 | 1.738 |

### T4. Combination 4

Cuts X (support x >= -X): 2.33811, 4.08795, 7, 12; int Ai over the support: 1.27435, 0.80824, 0.88678, 1.08562; int abs(Ai): 1.27435, 1.74046, 2.39587, 3.43889.
Record's support condition d_(p-1) >= a_1/mu (d = k - 1 + 1/p, mu = d^(1/3)/1.7) is equivalent to d >= 2.8150: it holds for k >= 4 and fails for k <= 3, for every p. It does not depend on the object or the height.

**Untwisted envelope sum W = sum_p log p eps_F(p) Ai((p-c)/H) over x >= -X.** Entries: share of windows with Re W <= 0 (fail) / mean of Re W / M1; ZETA also mean of W / (H int Ai).

| T | k | windows | primes | cut X | ZETA fail / nu / ratio to H int Ai | EA | CHI5 | CHI101 | SGN | UNI |
|---|---|---|---|---|---|---|---|---|---|---|
| 1e+06 | 1 | 192 | 9.61e+08 | 2.338 | 0.000 / 1.0000 / 1.00180 (sd 1.3e-02) | 0.000 / 1.0000 | 0.500 / 0.0001 | 0.500 / -0.0003 | 0.458 / 0.0029 | 0.474 / -0.0000 |
| 1e+06 | 1 | 192 | 9.61e+08 | 4.088 | 0.000 / 0.4652 / 1.00297 (sd 2.7e-02) | 0.000 / 0.4657 | 0.516 / 0.0004 | 0.516 / -0.0002 | 0.484 / 0.0017 | 0.495 / 0.0001 |
| 1e+06 | 1 | 192 | 9.61e+08 | 7 | 0.000 / 0.3707 / 1.00194 (sd 2.5e-02) | 0.000 / 0.3713 | 0.542 / -0.0001 | 0.495 / 0.0001 | 0.521 / 0.0018 | 0.469 / 0.0005 |
| 1e+06 | 1 | 192 | 9.61e+08 | 12 | 0.000 / 0.3155 / 1.00020 (sd 2.4e-02) | 0.000 / 0.3161 | 0.552 / -0.0002 | 0.469 / 0.0005 | 0.479 / 0.0024 | 0.516 / 0.0005 |
| 1e+06 | 2 | 768 | 7.42e+05 | 2.338 | 0.000 / 1.0000 / 0.99408 (sd 4.5e-02) | 0.000 / 1.0000 | 0.503 / -0.0009 | 0.520 / 0.0005 | 0.427 / 0.0130 | 0.466 / 0.0020 |
| 1e+06 | 2 | 768 | 7.42e+05 | 4.088 | 0.000 / 0.4616 / 0.99021 (sd 9.0e-02) | 0.000 / 0.4620 | 0.473 / 0.0007 | 0.534 / 0.0006 | 0.432 / 0.0085 | 0.482 / 0.0004 |
| 1e+06 | 2 | 768 | 7.42e+05 | 7 | 0.000 / 0.3687 / 0.99266 (sd 9.3e-02) | 0.000 / 0.3692 | 0.480 / 0.0004 | 0.517 / 0.0001 | 0.452 / 0.0073 | 0.471 / 0.0007 |
| 1e+06 | 2 | 768 | 7.42e+05 | 12 | 0.000 / 0.3142 / 0.99152 (sd 8.8e-02) | 0.000 / 0.3146 | 0.509 / -0.0007 | 0.507 / 0.0002 | 0.432 / 0.0063 | 0.492 / -0.0001 |
| 1e+06 | 3 | 768 | 4.02e+05 | 2.338 | 0.000 / 1.0000 / 0.99954 (sd 6.1e-02) | 0.000 / 1.0000 | 0.508 / -0.0016 | 0.513 / -0.0022 | 0.480 / 0.0041 | 0.552 / -0.0079 |
| 1e+06 | 3 | 768 | 4.02e+05 | 4.088 | 0.000 / 0.4675 / 1.00415 (sd 1.2e-01) | 0.000 / 0.4679 | 0.529 / -0.0019 | 0.517 / -0.0016 | 0.512 / -0.0001 | 0.535 / -0.0059 |
| 1e+06 | 3 | 768 | 4.02e+05 | 7 | 0.000 / 0.3737 / 1.00724 (sd 1.3e-01) | 0.000 / 0.3742 | 0.552 / -0.0027 | 0.508 / -0.0007 | 0.495 / 0.0020 | 0.523 / -0.0039 |
| 1e+06 | 3 | 768 | 4.02e+05 | 12 | 0.000 / 0.3173 / 1.00329 (sd 1.2e-01) | 0.000 / 0.3177 | 0.507 / -0.0010 | 0.513 / -0.0010 | 0.510 / 0.0009 | 0.520 / -0.0015 |
| 1e+06 | >=4 | 2304 | 6.46e+05 | 2.338 | 0.000 / 1.0000 / 0.99830 (sd 8.8e-02) | 0.000 / 1.0000 | 0.469 / 0.0033 | 0.481 / -0.0013 | 0.489 / 0.0027 | 0.483 / 0.0078 |
| 1e+06 | >=4 | 2304 | 6.46e+05 | 4.088 | 0.000 / 0.4625 / 0.99579 (sd 1.7e-01) | 0.000 / 0.4629 | 0.494 / 0.0033 | 0.502 / -0.0010 | 0.479 / 0.0015 | 0.488 / 0.0037 |
| 1e+06 | >=4 | 2304 | 6.46e+05 | 7 | 0.000 / 0.3682 / 0.99572 (sd 1.8e-01) | 0.000 / 0.3687 | 0.501 / 0.0011 | 0.501 / -0.0012 | 0.494 / 0.0004 | 0.474 / 0.0023 |
| 1e+06 | >=4 | 2304 | 6.46e+05 | 12 | 0.000 / 0.3156 / 0.99927 (sd 1.8e-01) | 0.000 / 0.3161 | 0.490 / 0.0014 | 0.504 / -0.0022 | 0.518 / -0.0009 | 0.471 / 0.0021 |
| 1e+08 | 1 | 192 | 6.92e+09 | 2.338 | 0.000 / 1.0000 / 0.99986 (sd 4.7e-03) | 0.000 / 1.0000 | 0.510 / 0.0000 | 0.484 / 0.0004 | 0.500 / -0.0005 | 0.484 / 0.0001 |
| 1e+08 | 1 | 192 | 6.92e+09 | 4.088 | 0.000 / 0.4645 / 0.99998 (sd 8.2e-03) | 0.000 / 0.4645 | 0.495 / -0.0000 | 0.510 / -0.0000 | 0.505 / -0.0005 | 0.453 / 0.0002 |
| 1e+08 | 1 | 192 | 6.92e+09 | 7 | 0.000 / 0.3700 / 0.99949 (sd 1.0e-02) | 0.000 / 0.3701 | 0.531 / -0.0002 | 0.495 / -0.0000 | 0.479 / -0.0003 | 0.453 / 0.0003 |
| 1e+08 | 1 | 192 | 6.92e+09 | 12 | 0.000 / 0.3157 / 0.99978 (sd 9.1e-03) | 0.000 / 0.3158 | 0.526 / -0.0002 | 0.573 / -0.0002 | 0.526 / -0.0002 | 0.479 / 0.0001 |
| 1e+08 | 2 | 768 | 3.77e+06 | 2.338 | 0.000 / 1.0000 / 0.99945 (sd 2.0e-02) | 0.000 / 1.0000 | 0.495 / -0.0002 | 0.503 / -0.0004 | 0.479 / 0.0004 | 0.533 / -0.0010 |
| 1e+08 | 2 | 768 | 3.77e+06 | 4.088 | 0.000 / 0.4635 / 0.99812 (sd 3.9e-02) | 0.000 / 0.4635 | 0.512 / -0.0005 | 0.492 / -0.0010 | 0.504 / -0.0010 | 0.526 / -0.0010 |
| 1e+08 | 2 | 768 | 3.77e+06 | 7 | 0.000 / 0.3700 / 0.99945 (sd 4.1e-02) | 0.000 / 0.3701 | 0.523 / -0.0005 | 0.522 / -0.0017 | 0.509 / -0.0017 | 0.531 / -0.0007 |
| 1e+08 | 2 | 768 | 3.77e+06 | 12 | 0.000 / 0.3156 / 0.99977 (sd 3.9e-02) | 0.000 / 0.3156 | 0.509 / -0.0005 | 0.512 / -0.0014 | 0.518 / -0.0012 | 0.529 / -0.0005 |
| 1e+08 | 3 | 768 | 2.02e+06 | 2.338 | 0.000 / 1.0000 / 0.99969 (sd 2.8e-02) | 0.000 / 1.0000 | 0.466 / 0.0014 | 0.493 / 0.0012 | 0.474 / 0.0041 | 0.535 / -0.0006 |
| 1e+08 | 3 | 768 | 2.02e+06 | 4.088 | 0.000 / 0.4657 / 1.00162 (sd 5.1e-02) | 0.000 / 0.4657 | 0.508 / -0.0001 | 0.454 / 0.0012 | 0.497 / 0.0017 | 0.516 / -0.0001 |
| 1e+08 | 3 | 768 | 2.02e+06 | 7 | 0.000 / 0.3713 / 1.00194 (sd 5.4e-02) | 0.000 / 0.3714 | 0.539 / -0.0007 | 0.499 / 0.0006 | 0.507 / 0.0019 | 0.520 / -0.0002 |
| 1e+08 | 3 | 768 | 2.02e+06 | 12 | 0.000 / 0.3157 / 0.99904 (sd 5.1e-02) | 0.000 / 0.3158 | 0.521 / -0.0004 | 0.507 / -0.0003 | 0.471 / 0.0018 | 0.486 / -0.0000 |
| 1e+08 | >=4 | 2304 | 3.2e+06 | 2.338 | 0.000 / 1.0000 / 1.00154 (sd 4.1e-02) | 0.000 / 1.0000 | 0.504 / -0.0008 | 0.478 / 0.0012 | 0.492 / -0.0003 | 0.498 / 0.0034 |
| 1e+08 | >=4 | 2304 | 3.2e+06 | 4.088 | 0.000 / 0.4662 / 1.00427 (sd 7.6e-02) | 0.000 / 0.4663 | 0.511 / -0.0010 | 0.483 / 0.0012 | 0.483 / -0.0001 | 0.470 / 0.0018 |
| 1e+08 | >=4 | 2304 | 3.2e+06 | 7 | 0.000 / 0.3717 / 1.00407 (sd 8.1e-02) | 0.000 / 0.3717 | 0.519 / -0.0009 | 0.475 / 0.0011 | 0.489 / -0.0014 | 0.478 / 0.0017 |
| 1e+08 | >=4 | 2304 | 3.2e+06 | 12 | 0.000 / 0.3167 / 1.00334 (sd 7.8e-02) | 0.000 / 0.3167 | 0.510 / -0.0008 | 0.499 / 0.0006 | 0.487 / -0.0004 | 0.468 / 0.0011 |
| 1e+10 | 1 | 176 | 1.91e+10 | 2.338 | 0.000 / 1.0000 / 0.99998 (sd 2.2e-03) | 0.000 / 1.0000 | 0.449 / -0.0001 | 0.523 / -0.0000 | 0.432 / 0.0005 | 0.483 / 0.0001 |
| 1e+10 | 1 | 176 | 1.91e+10 | 4.088 | 0.000 / 0.4644 / 1.00004 (sd 3.8e-03) | 0.000 / 0.4644 | 0.460 / -0.0000 | 0.511 / -0.0000 | 0.460 / 0.0002 | 0.500 / 0.0001 |
| 1e+10 | 1 | 176 | 1.91e+10 | 7 | 0.000 / 0.3701 / 0.99992 (sd 4.1e-03) | 0.000 / 0.3701 | 0.449 / -0.0001 | 0.534 / -0.0000 | 0.500 / 0.0001 | 0.460 / -0.0000 |
| 1e+10 | 1 | 176 | 1.91e+10 | 12 | 0.000 / 0.3158 / 1.00023 (sd 4.1e-03) | 0.000 / 0.3158 | 0.477 / -0.0001 | 0.506 / 0.0000 | 0.466 / 0.0001 | 0.500 / -0.0000 |
| 1e+10 | 2 | 768 | 2.76e+07 | 2.338 | 0.000 / 1.0000 / 0.99969 (sd 7.7e-03) | 0.000 / 1.0000 | 0.516 / -0.0004 | 0.523 / -0.0004 | 0.496 / -0.0002 | 0.516 / -0.0002 |
| 1e+10 | 2 | 768 | 2.76e+07 | 4.088 | 0.000 / 0.4641 / 0.99926 (sd 1.5e-02) | 0.000 / 0.4641 | 0.514 / -0.0002 | 0.530 / -0.0005 | 0.510 / -0.0002 | 0.509 / -0.0003 |
| 1e+10 | 2 | 768 | 2.76e+07 | 7 | 0.000 / 0.3698 / 0.99933 (sd 1.5e-02) | 0.000 / 0.3698 | 0.507 / -0.0002 | 0.525 / -0.0003 | 0.512 / -0.0004 | 0.527 / -0.0003 |
| 1e+10 | 2 | 768 | 2.76e+07 | 12 | 0.000 / 0.3154 / 0.99920 (sd 1.5e-02) | 0.000 / 0.3154 | 0.482 / -0.0001 | 0.512 / -0.0003 | 0.530 / -0.0004 | 0.520 / -0.0002 |
| 1e+10 | 3 | 768 | 1.46e+07 | 2.338 | 0.000 / 1.0000 / 0.99966 (sd 1.1e-02) | 0.000 / 1.0000 | 0.465 / 0.0006 | 0.487 / 0.0008 | 0.503 / -0.0001 | 0.509 / -0.0005 |
| 1e+10 | 3 | 768 | 1.46e+07 | 4.088 | 0.000 / 0.4642 / 0.99943 (sd 2.1e-02) | 0.000 / 0.4642 | 0.473 / 0.0004 | 0.491 / 0.0004 | 0.505 / -0.0002 | 0.514 / -0.0003 |
| 1e+10 | 3 | 768 | 1.46e+07 | 7 | 0.000 / 0.3698 / 0.99892 (sd 2.2e-02) | 0.000 / 0.3698 | 0.473 / 0.0001 | 0.488 / 0.0003 | 0.504 / -0.0003 | 0.488 / -0.0002 |
| 1e+10 | 3 | 768 | 1.46e+07 | 12 | 0.000 / 0.3154 / 0.99899 (sd 2.1e-02) | 0.000 / 0.3154 | 0.452 / 0.0001 | 0.493 / 0.0002 | 0.514 / -0.0001 | 0.496 / -0.0001 |
| 1e+10 | >=4 | 2304 | 2.3e+07 | 2.338 | 0.000 / 1.0000 / 1.00002 (sd 1.6e-02) | 0.000 / 1.0000 | 0.515 / -0.0001 | 0.517 / -0.0008 | 0.485 / 0.0011 | 0.507 / -0.0006 |
| 1e+10 | >=4 | 2304 | 2.3e+07 | 4.088 | 0.000 / 0.4649 / 1.00078 (sd 3.1e-02) | 0.000 / 0.4649 | 0.497 / 0.0003 | 0.511 / -0.0007 | 0.496 / 0.0004 | 0.508 / -0.0004 |
| 1e+10 | >=4 | 2304 | 2.3e+07 | 7 | 0.000 / 0.3705 / 1.00077 (sd 3.2e-02) | 0.000 / 0.3705 | 0.489 / 0.0003 | 0.516 / -0.0008 | 0.507 / 0.0003 | 0.523 / -0.0005 |
| 1e+10 | >=4 | 2304 | 2.3e+07 | 12 | 0.000 / 0.3160 / 1.00072 (sd 3.0e-02) | 0.000 / 0.3160 | 0.482 / 0.0003 | 0.527 / -0.0008 | 0.507 / 0.0002 | 0.510 / -0.0004 |
| 1e+12 | 1 | 112 | 1.91e+09 | 2.338 | 0.000 / 1.0000 / 0.99992 (sd 8.6e-04) | 0.000 / 1.0000 | 0.571 / -0.0000 | 0.464 / 0.0001 | 0.527 / -0.0000 | 0.491 / 0.0000 |
| 1e+12 | 1 | 112 | 1.91e+09 | 4.088 | 0.000 / 0.4644 / 0.99994 (sd 1.5e-03) | 0.000 / 0.4644 | 0.554 / -0.0000 | 0.455 / 0.0001 | 0.580 / -0.0001 | 0.491 / 0.0000 |
| 1e+12 | 1 | 112 | 1.91e+09 | 7 | 0.000 / 0.3701 / 0.99989 (sd 1.5e-03) | 0.000 / 0.3701 | 0.527 / -0.0001 | 0.509 / 0.0000 | 0.491 / 0.0000 | 0.527 / -0.0000 |
| 1e+12 | 1 | 112 | 1.91e+09 | 12 | 0.000 / 0.3157 / 1.00005 (sd 1.5e-03) | 0.000 / 0.3157 | 0.455 / -0.0000 | 0.518 / 0.0000 | 0.527 / 0.0000 | 0.473 / 0.0001 |
| 1e+12 | 2 | 768 | 2.25e+08 | 2.338 | 0.000 / 1.0000 / 0.99984 (sd 2.9e-03) | 0.000 / 1.0000 | 0.493 / -0.0000 | 0.507 / 0.0001 | 0.453 / 0.0004 | 0.507 / 0.0000 |
| 1e+12 | 2 | 768 | 2.25e+08 | 4.088 | 0.000 / 0.4642 / 0.99963 (sd 5.4e-03) | 0.000 / 0.4642 | 0.484 / 0.0000 | 0.505 / 0.0001 | 0.464 / 0.0003 | 0.507 / -0.0001 |
| 1e+12 | 2 | 768 | 2.25e+08 | 7 | 0.000 / 0.3700 / 0.99962 (sd 5.6e-03) | 0.000 / 0.3700 | 0.470 / 0.0000 | 0.503 / 0.0001 | 0.487 / 0.0002 | 0.491 / 0.0001 |
| 1e+12 | 2 | 768 | 2.25e+08 | 12 | 0.000 / 0.3156 / 0.99966 (sd 5.4e-03) | 0.000 / 0.3156 | 0.457 / 0.0001 | 0.477 / 0.0001 | 0.471 / 0.0002 | 0.488 / 0.0001 |
| 1e+12 | 3 | 768 | 1.19e+08 | 2.338 | 0.000 / 1.0000 / 1.00010 (sd 4.2e-03) | 0.000 / 1.0000 | 0.493 / 0.0001 | 0.508 / 0.0001 | 0.496 / -0.0001 | 0.503 / -0.0001 |
| 1e+12 | 3 | 768 | 1.19e+08 | 4.088 | 0.000 / 0.4644 / 1.00011 (sd 7.8e-03) | 0.000 / 0.4644 | 0.500 / 0.0000 | 0.493 / 0.0001 | 0.483 / 0.0000 | 0.533 / -0.0002 |
| 1e+12 | 3 | 768 | 1.19e+08 | 7 | 0.000 / 0.3701 / 0.99996 (sd 8.1e-03) | 0.000 / 0.3701 | 0.517 / -0.0000 | 0.484 / 0.0000 | 0.488 / -0.0000 | 0.527 / -0.0001 |
| 1e+12 | 3 | 768 | 1.19e+08 | 12 | 0.000 / 0.3157 / 1.00000 (sd 7.6e-03) | 0.000 / 0.3157 | 0.534 / -0.0001 | 0.499 / -0.0000 | 0.496 / -0.0001 | 0.483 / 0.0000 |
| 1e+12 | >=4 | 2304 | 1.85e+08 | 2.338 | 0.000 / 1.0000 / 1.00029 (sd 5.8e-03) | 0.000 / 1.0000 | 0.504 / 0.0001 | 0.499 / -0.0001 | 0.507 / -0.0002 | 0.502 / 0.0000 |
| 1e+12 | >=4 | 2304 | 1.85e+08 | 4.088 | 0.000 / 0.4644 / 1.00027 (sd 1.1e-02) | 0.000 / 0.4644 | 0.497 / 0.0001 | 0.508 / -0.0001 | 0.507 / -0.0001 | 0.510 / -0.0000 |
| 1e+12 | >=4 | 2304 | 1.85e+08 | 7 | 0.000 / 0.3702 / 1.00040 (sd 1.2e-02) | 0.000 / 0.3702 | 0.499 / 0.0001 | 0.501 / -0.0001 | 0.500 / -0.0000 | 0.511 / -0.0001 |
| 1e+12 | >=4 | 2304 | 1.85e+08 | 12 | 0.000 / 0.3157 / 1.00037 (sd 1.1e-02) | 0.000 / 0.3157 | 0.496 / 0.0000 | 0.502 / -0.0000 | 0.494 / 0.0000 | 0.503 / -0.0000 |

**Alias-twisted sum W_tw = sum_p log p eps_F(p) e(n(p-1)/p) Ai(...), controlling alias h = p-1, cut X = a_1 (envelope >= 0 on the support).** Model for ZETA: -H int Ai/(p-1). Entries: share of windows with Re W_tw >= 0 (sign opposite to the model) / mean of Re W_tw (p-1)/(H int Ai) for ZETA; share with Re W_tw >= 0 for the others; rms of abs(W_tw)/sqrt(M2) for ZETA and SGN.

| class | T | p | windows | mean H | ZETA wrong sign / mean ratio (model -1) | EA | CHI5 | CHI101 | SGN | UNI | rms z ZETA | rms z SGN | predicted main/noise (H int Ai/(p-1))/sqrt(M2) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| k >= 2 | 1e+06 | 3 | 320 | 248 | 0.000 / -0.993 | 0.000 | 0.562 | 0.466 | 0.506 | 0.466 | 4.140 | 1.052 | 3.99 |
| k >= 2 | 1e+06 | 5 | 320 | 266 | 0.003 / -1.013 | 0.003 | 1.000 | 0.519 | 0.519 | 0.481 | 2.218 | 0.983 | 2.04 |
| k >= 2 | 1e+06 | 7 | 320 | 275 | 0.009 / -1.005 | 0.009 | 0.469 | 0.506 | 0.450 | 0.562 | 1.566 | 1.009 | 1.38 |
| k >= 2 | 1e+06 | 11 | 320 | 283 | 0.062 / -0.984 | 0.062 | 0.497 | 0.544 | 0.487 | 0.537 | 1.120 | 0.963 | 0.84 |
| k >= 2 | 1e+06 | 31 | 320 | 293 | 0.328 / -1.037 | 0.328 | 0.516 | 0.497 | 0.459 | 0.456 | 0.853 | 1.019 | 0.284 |
| k >= 2 | 1e+06 | 97 | 320 | 297 | 0.428 / -1.255 | 0.428 | 0.481 | 0.519 | 0.494 | 0.516 | 0.777 | 1.007 | 0.0888 |
| k >= 2 | 1e+06 | 307 | 320 | 299 | 0.494 / -0.370 | 0.494 | 0.503 | 0.509 | 0.506 | 0.459 | 0.898 | 0.944 | 0.028 |
| k >= 2 | 1e+06 | 997 | 320 | 299 | 0.506 / 1.730 | 0.506 | 0.478 | 0.497 | 0.509 | 0.516 | 3.305 | 1.023 | 0.00861 |
| k >= 2 | 1e+06 | 3163 | 320 | 299 | 0.550 / 255.096 | 0.550 | 0.459 | 0.531 | 0.572 | 0.506 | 6.573 | 1.027 | 0.00271 |
| k >= 2 | 1e+06 | 9973 | 320 | 299 | 0.491 / -100.798 | 0.491 | 0.494 | 0.541 | 0.544 | 0.497 | 8.511 | 1.036 | 0.00086 |
| k >= 2 | 1e+06 | 31627 | 320 | 299 | 0.509 / 554.595 | 0.509 | 0.478 | 0.503 | 0.531 | 0.503 | 8.866 | 1.036 | 0.000271 |
| k >= 2 | 1e+06 | 99991 | 320 | 299 | 0.484 / -3245.154 | 0.484 | 0.503 | 0.497 | 0.550 | 0.447 | 8.904 | 1.036 | 8.58e-05 |
| k >= 2 | 1e+08 | 3 | 320 | 1.62e+03 | 0.000 / -0.999 | 0.000 | 0.500 | 0.434 | 0.459 | 0.519 | 9.198 | 0.981 | 8.9 |
| k >= 2 | 1e+08 | 5 | 320 | 1.74e+03 | 0.000 / -1.010 | 0.000 | 1.000 | 0.509 | 0.481 | 0.481 | 4.820 | 1.019 | 4.57 |
| k >= 2 | 1e+08 | 7 | 320 | 1.79e+03 | 0.000 / -0.988 | 0.000 | 0.450 | 0.503 | 0.463 | 0.528 | 3.256 | 1.023 | 3.08 |
| k >= 2 | 1e+08 | 11 | 320 | 1.85e+03 | 0.003 / -0.970 | 0.003 | 0.522 | 0.509 | 0.491 | 0.494 | 2.047 | 1.023 | 1.88 |
| k >= 2 | 1e+08 | 31 | 320 | 1.92e+03 | 0.125 / -0.951 | 0.125 | 0.491 | 0.491 | 0.522 | 0.512 | 1.010 | 1.022 | 0.635 |
| k >= 2 | 1e+08 | 97 | 320 | 1.94e+03 | 0.353 / -0.996 | 0.353 | 0.522 | 0.491 | 0.522 | 0.466 | 0.834 | 0.986 | 0.199 |
| k >= 2 | 1e+08 | 307 | 320 | 1.95e+03 | 0.438 / -1.273 | 0.438 | 0.553 | 0.516 | 0.494 | 0.481 | 0.797 | 1.034 | 0.0626 |
| k >= 2 | 1e+08 | 997 | 320 | 1.95e+03 | 0.497 / 5.433 | 0.497 | 0.522 | 0.481 | 0.519 | 0.478 | 0.802 | 1.055 | 0.0192 |
| k >= 2 | 1e+08 | 3163 | 320 | 1.96e+03 | 0.503 / 3.230 | 0.503 | 0.497 | 0.497 | 0.497 | 0.494 | 2.843 | 1.033 | 0.00605 |
| k >= 2 | 1e+08 | 9973 | 320 | 1.96e+03 | 0.456 / 54.224 | 0.456 | 0.525 | 0.459 | 0.519 | 0.525 | 10.170 | 1.024 | 0.00192 |
| k >= 2 | 1e+08 | 31627 | 320 | 1.96e+03 | 0.559 / 2624.365 | 0.559 | 0.528 | 0.506 | 0.550 | 0.541 | 17.092 | 1.029 | 0.000605 |
| k >= 2 | 1e+08 | 99991 | 320 | 1.96e+03 | 0.506 / 620.682 | 0.506 | 0.500 | 0.541 | 0.481 | 0.562 | 19.664 | 1.032 | 0.000191 |
| k >= 2 | 1e+10 | 3 | 320 | 1.5e+04 | 0.000 / -1.000 | 0.000 | 0.500 | 0.509 | 0.528 | 0.481 | 24.710 | 1.009 | 23.9 |
| k >= 2 | 1e+10 | 5 | 320 | 1.61e+04 | 0.000 / -0.997 | 0.000 | 1.000 | 0.531 | 0.478 | 0.544 | 12.734 | 1.010 | 12.3 |
| k >= 2 | 1e+10 | 7 | 320 | 1.66e+04 | 0.000 / -0.994 | 0.000 | 0.522 | 0.447 | 0.500 | 0.497 | 8.624 | 0.976 | 8.3 |
| k >= 2 | 1e+10 | 11 | 320 | 1.71e+04 | 0.000 / -1.000 | 0.000 | 0.469 | 0.463 | 0.472 | 0.506 | 5.288 | 0.962 | 5.04 |
| k >= 2 | 1e+10 | 31 | 320 | 1.78e+04 | 0.003 / -1.018 | 0.003 | 0.428 | 0.506 | 0.519 | 0.509 | 1.934 | 0.950 | 1.71 |
| k >= 2 | 1e+10 | 97 | 320 | 1.8e+04 | 0.197 / -1.011 | 0.197 | 0.522 | 0.516 | 0.528 | 0.559 | 0.982 | 0.974 | 0.536 |
| k >= 2 | 1e+10 | 307 | 320 | 1.81e+04 | 0.434 / -0.500 | 0.434 | 0.494 | 0.522 | 0.525 | 0.456 | 0.795 | 1.048 | 0.168 |
| k >= 2 | 1e+10 | 997 | 320 | 1.81e+04 | 0.509 / 0.526 | 0.509 | 0.528 | 0.484 | 0.506 | 0.453 | 0.831 | 0.981 | 0.0518 |
| k >= 2 | 1e+10 | 3163 | 320 | 1.81e+04 | 0.472 / -0.575 | 0.472 | 0.550 | 0.469 | 0.478 | 0.444 | 0.792 | 1.007 | 0.0163 |
| k >= 2 | 1e+10 | 9973 | 320 | 1.81e+04 | 0.559 / 31.393 | 0.559 | 0.522 | 0.491 | 0.534 | 0.494 | 0.949 | 1.019 | 0.00517 |
| k >= 2 | 1e+10 | 31627 | 320 | 1.81e+04 | 0.503 / -19.641 | 0.503 | 0.487 | 0.434 | 0.522 | 0.497 | 8.378 | 0.952 | 0.00163 |
| k >= 2 | 1e+10 | 99991 | 320 | 1.81e+04 | 0.497 / -22.279 | 0.497 | 0.481 | 0.478 | 0.459 | 0.494 | 28.627 | 0.985 | 0.000516 |
| k >= 2 | 1e+12 | 3 | 320 | 1.49e+05 | 0.000 / -1.000 | 0.000 | 0.500 | 0.487 | 0.503 | 0.441 | 70.247 | 0.998 | 67.9 |
| k >= 2 | 1e+12 | 5 | 320 | 1.6e+05 | 0.000 / -1.002 | 0.000 | 1.000 | 0.522 | 0.534 | 0.531 | 36.336 | 0.940 | 34.9 |
| k >= 2 | 1e+12 | 7 | 320 | 1.65e+05 | 0.000 / -1.001 | 0.000 | 0.509 | 0.481 | 0.500 | 0.547 | 24.605 | 0.980 | 23.6 |
| k >= 2 | 1e+12 | 11 | 320 | 1.7e+05 | 0.000 / -1.000 | 0.000 | 0.528 | 0.519 | 0.547 | 0.500 | 14.970 | 0.974 | 14.3 |
| k >= 2 | 1e+12 | 31 | 320 | 1.76e+05 | 0.000 / -0.995 | 0.000 | 0.475 | 0.506 | 0.469 | 0.481 | 5.101 | 0.967 | 4.85 |
| k >= 2 | 1e+12 | 97 | 320 | 1.79e+05 | 0.016 / -0.963 | 0.016 | 0.544 | 0.509 | 0.506 | 0.494 | 1.736 | 1.026 | 1.52 |
| k >= 2 | 1e+12 | 307 | 320 | 1.79e+05 | 0.175 / -1.106 | 0.175 | 0.512 | 0.466 | 0.512 | 0.522 | 0.953 | 1.043 | 0.479 |
| k >= 2 | 1e+12 | 997 | 320 | 1.8e+05 | 0.372 / -1.253 | 0.372 | 0.534 | 0.512 | 0.516 | 0.494 | 0.855 | 1.007 | 0.147 |
| k >= 2 | 1e+12 | 3163 | 320 | 1.8e+05 | 0.466 / -1.473 | 0.466 | 0.434 | 0.497 | 0.484 | 0.531 | 0.792 | 0.995 | 0.0464 |
| k >= 2 | 1e+12 | 9973 | 320 | 1.8e+05 | 0.481 / -4.105 | 0.481 | 0.519 | 0.503 | 0.519 | 0.487 | 0.777 | 1.017 | 0.0147 |
| k >= 2 | 1e+12 | 31627 | 320 | 1.8e+05 | 0.503 / -5.693 | 0.503 | 0.531 | 0.537 | 0.484 | 0.522 | 0.817 | 0.956 | 0.00464 |
| k >= 2 | 1e+12 | 99991 | 320 | 1.8e+05 | 0.503 / -45.922 | 0.503 | 0.466 | 0.441 | 0.541 | 0.469 | 1.971 | 0.995 | 0.00147 |
| k = 1 | 1e+06 | 3 | 16 | 1.44e+03 | 0.000 / -1.007 | 0.000 | 0.500 | 0.500 | 0.375 | 0.375 | 9.442 | 1.249 | 9.36 |
| k = 1 | 1e+06 | 5 | 16 | 2.39e+03 | 0.000 / -0.998 | 0.000 | 1.000 | 0.688 | 0.500 | 0.375 | 5.958 | 0.820 | 5.94 |
| k = 1 | 1e+06 | 7 | 16 | 3.35e+03 | 0.000 / -0.974 | 0.000 | 0.562 | 0.562 | 0.500 | 0.375 | 4.562 | 0.844 | 4.61 |
| k = 1 | 1e+06 | 11 | 16 | 5.26e+03 | 0.000 / -0.995 | 0.000 | 0.562 | 0.375 | 0.500 | 0.375 | 3.462 | 0.987 | 3.42 |
| k = 1 | 1e+06 | 31 | 16 | 1.48e+04 | 0.000 / -0.993 | 0.000 | 0.438 | 0.625 | 0.375 | 0.500 | 1.925 | 1.168 | 1.85 |
| k = 1 | 1e+06 | 97 | 16 | 4.64e+04 | 0.000 / -1.072 | 0.000 | 0.312 | 0.375 | 0.500 | 0.562 | 1.295 | 1.053 | 0.99 |
| k = 1 | 1e+06 | 307 | 16 | 1.47e+05 | 0.188 / -0.970 | 0.188 | 0.250 | 0.562 | 0.312 | 0.500 | 0.977 | 0.761 | 0.534 |
| k = 1 | 1e+06 | 997 | 16 | 4.77e+05 | 0.250 / -0.791 | 0.250 | 0.500 | 0.500 | 0.500 | 0.500 | 0.669 | 1.143 | 0.287 |
| k = 1 | 1e+06 | 3163 | 16 | 1.51e+06 | 0.250 / -2.591 | 0.250 | 0.312 | 0.688 | 0.438 | 0.562 | 0.995 | 1.042 | 0.156 |
| k = 1 | 1e+06 | 9973 | 16 | 4.77e+06 | 0.562 / 0.197 | 0.562 | 0.625 | 0.375 | 0.500 | 0.562 | 0.716 | 0.845 | 0.0857 |
| k = 1 | 1e+06 | 31627 | 16 | 1.51e+07 | 0.375 / -1.372 | 0.375 | 0.438 | 0.688 | 0.438 | 0.375 | 0.672 | 1.030 | 0.0469 |
| k = 1 | 1e+06 | 99991 | 16 | 4.78e+07 | 0.750 / 3.570 | 0.750 | 0.500 | 0.688 | 0.438 | 0.312 | 0.773 | 0.904 | 0.0257 |
| k = 1 | 1e+08 | 3 | 16 | 1.22e+04 | 0.000 / -1.002 | 0.000 | 0.750 | 0.500 | 0.562 | 0.562 | 23.907 | 1.152 | 23.9 |
| k = 1 | 1e+08 | 5 | 16 | 2.04e+04 | 0.000 / -0.998 | 0.000 | 1.000 | 0.500 | 0.500 | 0.500 | 15.162 | 1.001 | 15.2 |
| k = 1 | 1e+08 | 7 | 16 | 2.85e+04 | 0.000 / -0.986 | 0.000 | 0.500 | 0.438 | 0.562 | 0.688 | 11.746 | 0.978 | 11.9 |
| k = 1 | 1e+08 | 11 | 16 | 4.49e+04 | 0.000 / -0.994 | 0.000 | 0.438 | 0.688 | 0.625 | 0.312 | 8.789 | 1.083 | 8.83 |
| k = 1 | 1e+08 | 31 | 16 | 1.26e+05 | 0.000 / -1.029 | 0.000 | 0.438 | 0.500 | 0.438 | 0.438 | 4.985 | 1.383 | 4.81 |
| k = 1 | 1e+08 | 97 | 16 | 3.96e+05 | 0.000 / -1.028 | 0.000 | 0.500 | 0.688 | 0.438 | 0.625 | 2.738 | 1.127 | 2.59 |
| k = 1 | 1e+08 | 307 | 16 | 1.25e+06 | 0.000 / -0.937 | 0.000 | 0.688 | 0.375 | 0.438 | 0.562 | 1.433 | 1.023 | 1.41 |
| k = 1 | 1e+08 | 997 | 16 | 4.07e+06 | 0.062 / -0.838 | 0.062 | 0.688 | 0.500 | 0.562 | 0.312 | 0.929 | 1.041 | 0.758 |
| k = 1 | 1e+08 | 3163 | 16 | 1.29e+07 | 0.312 / -0.978 | 0.312 | 0.375 | 0.500 | 0.250 | 0.438 | 0.900 | 0.934 | 0.415 |
| k = 1 | 1e+08 | 9973 | 16 | 4.07e+07 | 0.250 / -1.724 | 0.250 | 0.625 | 0.438 | 0.562 | 0.500 | 0.914 | 0.834 | 0.229 |
| k = 1 | 1e+08 | 31627 | 16 | 1.29e+08 | 0.375 / -0.264 | 0.375 | 0.500 | 0.500 | 0.562 | 0.438 | 0.816 | 1.087 | 0.126 |
| k = 1 | 1e+08 | 99991 | 16 | 4.08e+08 | 0.312 / -2.537 | 0.312 | 0.500 | 0.375 | 0.500 | 0.375 | 0.640 | 1.026 | 0.0692 |
| k = 1 | 1e+10 | 3 | 16 | 1.2e+05 | 0.000 / -1.000 | 0.000 | 0.562 | 0.500 | 0.312 | 0.562 | 66.660 | 0.886 | 66.7 |
| k = 1 | 1e+10 | 5 | 16 | 2e+05 | 0.000 / -1.001 | 0.000 | 1.000 | 0.312 | 0.562 | 0.375 | 42.590 | 0.742 | 42.6 |
| k = 1 | 1e+10 | 7 | 16 | 2.8e+05 | 0.000 / -1.001 | 0.000 | 0.438 | 0.375 | 0.500 | 0.750 | 33.357 | 0.912 | 33.3 |
| k = 1 | 1e+10 | 11 | 16 | 4.4e+05 | 0.000 / -1.001 | 0.000 | 0.562 | 0.562 | 0.250 | 0.562 | 24.844 | 1.063 | 24.8 |
| k = 1 | 1e+10 | 31 | 16 | 1.24e+06 | 0.000 / -0.975 | 0.000 | 0.375 | 0.500 | 0.500 | 0.500 | 13.266 | 0.919 | 13.6 |
| k = 1 | 1e+10 | 97 | 16 | 3.88e+06 | 0.000 / -0.987 | 0.000 | 0.438 | 0.500 | 0.500 | 0.500 | 7.279 | 1.004 | 7.34 |
| k = 1 | 1e+10 | 307 | 16 | 1.23e+07 | 0.000 / -0.996 | 0.000 | 0.375 | 0.562 | 0.438 | 0.375 | 4.034 | 0.802 | 4.01 |
| k = 1 | 1e+10 | 997 | 16 | 3.99e+07 | 0.000 / -1.112 | 0.000 | 0.438 | 0.188 | 0.438 | 0.250 | 2.523 | 0.950 | 2.17 |
| k = 1 | 1e+10 | 3163 | 16 | 1.26e+08 | 0.000 / -1.081 | 0.000 | 0.562 | 0.500 | 0.438 | 0.562 | 1.396 | 1.005 | 1.2 |
| k = 1 | 1e+10 | 9973 | 16 | 3.99e+08 | 0.125 / -1.082 | 0.125 | 0.562 | 0.438 | 0.500 | 0.375 | 1.027 | 0.813 | 0.66 |
| k = 1 | 1e+10 | 31627 | 16 | 1.26e+09 | 0.250 / -1.023 | 0.250 | 0.375 | 0.562 | 0.438 | 0.500 | 0.888 | 0.955 | 0.364 |
| k = 1 | 1e+12 | 3 | 16 | 1.2e+06 | 0.000 / -0.999 | 0.000 | 0.562 | 0.375 | 0.375 | 0.625 | 191.654 | 1.107 | 192 |
| k = 1 | 1e+12 | 5 | 16 | 2e+06 | 0.000 / -1.001 | 0.000 | 1.000 | 0.562 | 0.438 | 0.250 | 122.733 | 1.068 | 123 |
| k = 1 | 1e+12 | 7 | 16 | 2.79e+06 | 0.000 / -0.999 | 0.000 | 0.375 | 0.625 | 0.500 | 0.312 | 96.058 | 0.960 | 96.1 |
| k = 1 | 1e+12 | 11 | 16 | 4.39e+06 | 0.000 / -0.999 | 0.000 | 0.500 | 0.438 | 0.625 | 0.438 | 71.602 | 1.048 | 71.7 |
| k = 1 | 1e+12 | 31 | 16 | 1.24e+07 | 0.000 / -1.000 | 0.000 | 0.375 | 0.562 | 0.688 | 0.625 | 39.408 | 1.012 | 39.4 |
| k = 1 | 1e+12 | 97 | 16 | 3.87e+07 | 0.000 / -1.007 | 0.000 | 0.562 | 0.375 | 0.562 | 0.375 | 21.528 | 0.885 | 21.4 |
| k = 1 | 1e+12 | 307 | 16 | 1.23e+08 | 0.000 / -1.016 | 0.000 | 0.500 | 0.312 | 0.438 | 0.625 | 11.913 | 1.042 | 11.7 |

**Covariance of cos(U lambda_l), cos(U lambda_m), U ~ Cauchy(T, x), 4e+07 samples, against K_T (4656 pairs per set).** z = (measured - K_T)/standard error (64 batches).

| T | x | set | max abs z | rms z | share abs z > 3 | max abs deviation | max abs K_T |
|---|---|---|---|---|---|---|---|
| 1e+06 | 0.02 | primes | 3.02 | 0.870 | 0.0002 | 1.22e-04 | 0.318 |
| 1e+06 | 0.02 | twisted_primes | 3.59 | 0.705 | 0.0009 | 1.16e-04 | 0.318 |
| 1e+06 | 0.02 | composites | 2.76 | 0.811 | 0.0000 | 1.36e-04 | 0.318 |
| 1e+06 | 0.02 | random | 2.76 | 0.886 | 0.0000 | 1.37e-04 | 0.316 |
| 1e+06 | 1 | primes | 3.76 | 1.154 | 0.0056 | 2.55e-04 | 0.500 |
| 1e+06 | 1 | twisted_primes | 3.20 | 1.014 | 0.0021 | 2.48e-04 | 0.500 |
| 1e+06 | 1 | composites | 3.96 | 0.985 | 0.0037 | 3.06e-04 | 0.500 |
| 1e+06 | 1 | random | 3.62 | 1.019 | 0.0026 | 3.05e-04 | 0.500 |
| 1e+09 | 0.02 | primes | 3.26 | 1.026 | 0.0004 | 2.41e-04 | 0.318 |
| 1e+09 | 0.02 | twisted_primes | 3.78 | 1.256 | 0.0039 | 1.96e-04 | 0.318 |
| 1e+09 | 0.02 | composites | 5.02 | 1.369 | 0.0238 | 1.91e-04 | 0.318 |
| 1e+09 | 0.02 | random | 2.90 | 0.807 | 0.0000 | 1.54e-04 | 0.316 |
| 1e+09 | 1 | primes | 3.70 | 0.968 | 0.0030 | 3.11e-04 | 0.500 |
| 1e+09 | 1 | twisted_primes | 3.61 | 0.943 | 0.0013 | 2.35e-04 | 0.500 |
| 1e+09 | 1 | composites | 4.24 | 0.971 | 0.0052 | 3.20e-04 | 0.500 |
| 1e+09 | 1 | random | 4.59 | 1.190 | 0.0146 | 3.30e-04 | 0.500 |
| 1e+12 | 0.02 | primes | 3.09 | 1.056 | 0.0002 | 1.88e-04 | 0.318 |
| 1e+12 | 0.02 | twisted_primes | 2.97 | 0.874 | 0.0000 | 1.76e-04 | 0.318 |
| 1e+12 | 0.02 | composites | 2.44 | 0.695 | 0.0000 | 1.38e-04 | 0.318 |
| 1e+12 | 0.02 | random | 2.47 | 0.630 | 0.0000 | 1.59e-04 | 0.316 |
| 1e+12 | 1 | primes | 4.56 | 1.035 | 0.0028 | 3.20e-04 | 0.500 |
| 1e+12 | 1 | twisted_primes | 5.27 | 1.189 | 0.0114 | 3.83e-04 | 0.500 |
| 1e+12 | 1 | composites | 3.96 | 0.942 | 0.0015 | 3.07e-04 | 0.500 |
| 1e+12 | 1 | random | 3.42 | 0.882 | 0.0002 | 2.32e-04 | 0.500 |

## 6. Files

Code: `s4.c` (engine), `s4lib.py`, `run1.py`, `run2.py`, `run3.py`, `run4.py`, `g_fft.py`, `cov4.py`, `validate.py`, `an3_check.py`, `check2.py`, `synth3.py`, analysis `an1.py` .. `an4.py`, `merge_sieve.py`, `mk_result.py`. Data: `c1A_*.json`, `c1_sieve.npz`, `c1_fft.json`, `c1_fft20.json`, `c2.json`, `c2b.json`, `c2m.json`, `c3_p0.pkl`, `c3_p1.pkl`, `c4.pkl`, `c4_cov.json`; summaries `an1.json` .. `an4.json`, `validate.json`, `validate_server.json`, `validate_cap.json`, `check2.json`, `synth3.json`.
