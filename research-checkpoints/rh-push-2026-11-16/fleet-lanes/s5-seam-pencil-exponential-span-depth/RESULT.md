# s5-seam-pencil-exponential-span-depth: RESULT

Date 2026-11-19/20. Kind: screening (compute). Four combinations of seam-pencil / exponential-span / depth-certificate nodes of the idea graph, each turned into a finite statistic and run for zeta, two Dirichlet L-functions and the controls.
No statement about zeros of zeta is made. Labels: PROVED (elementary, argument given here), RECORD (taken from the cited repo file, read as text, and reproduced numerically where stated), MEASURED (numerics; Arb ball arithmetic where "Arb" is written, float64 otherwise).

## 0. Verdict

**No survivor. 4 combinations tested, 4 closed.**

All nineteen nodes are statements about spans of exponentials e^(-nu t) for an arbitrary finite rate set (graph field `usesMultiplicativity: no` on every one). An object can enter only (a) as the rate set, through its zeros or through the support of its coefficients, or (b) through the signs of a coefficient vector tested against the span. The runs show what each route sees:

1. Rates = zeros, test function = the prime-side error term. The pencil value of the first N on-line zeros equals 1 up to depth d about log(gamma_N / 2 pi) + 1.5 and afterwards stays a factor e^3 (N = 100) to e^7 (N = 1517) above the single-rate floor e^(-2cd); the TILT-DET majorant is equal to 1 for d < 347 (N = 100) and d < 1736 (N = 400). The comparison "R(d) below the majorant" is therefore "mean square of psi_F(x) - M_F(x) is O(x)" with a slack that grows with N. Controls exceed it only where x^(beta - 1/2) has outgrown the slack: at x = e^d between 40 and 10^5 times the height of the first off-line zero; zeta(s+1/8) zeta(s-1/8) (off-line zeros from height 14.13) is not detected up to x = 10^13.
2. Rates = zero ordinates per octave. The position of the exact pencil value inside the Laguerre bracket is a function of the number N of rates in the block and of their ratio R; an arithmetic-free node set with the same counting function reproduces zeta's positions to 0.02, and no control leaves the band of the L-functions in any octave, with or without off-line zeros.
3. The EV-OCT onsets do not contain the object. On the dyadic skeleton the object enters through a(2) and a(5) only. With all integers n <= 10^7 the phase-alignment ratio theta is 1 for zeta and for the positive-coefficient controls (zeta(s+a) zeta(s-a), T-NR) and about 1/N for both L-functions, Davenport-Heilbronn and all twists: it reads the sign coherence of the coefficients (the pole at s = 1), and the positive comparisons fall with the controls.
4. Rates = zero ordinates, octave blocks. The every-octave certificate (sum of deflated block constants < 1) for the ordinates below H fires from depth 0.85 x D(H), D(H) = 2 sum_(gamma < H) 1/gamma, for every object (0.77 to 0.91 over D from 1.4 to 8.5); the same number for the arithmetic-free node set. D(H) grows like (1/2 pi) log^2 H, so at fixed depth the certificate stops at a height fixed by the node density; an off-line pair adds one more term 2/gamma and nothing else.

| # | combination (nodes) | statistic | sizes reached | zeta | L(s, chi_-4), L(s, chi_5) | controls | classification |
|---|---|---|---|---|---|---|---|
| 1 | seam-cross-ratio-pencil + pick-id-seam-pencil + tilt-det-majorant + mono-n-rate-monotonicity | R_F(d) = int_d^T abs(g)^2 / int_0^T abs(g)^2, g(t) = (psi_F(e^t) - M_F(e^t)) e^(-(1/2+c)t), against Lambda(nu, d) and the TILT-DET majorant of the on-line rates nu = c - i gamma (first N zeros and conjugates); c = 1/2 and 1/4 | prime side: all primes below 10^13 (pi(10^13) = 346,065,536,839 reproduced), exact step function below 10^7, 1,381,552 bins above; Davenport-Heilbronn coefficients to 10^8. Zero side: Arb 256 bits at N = 5 .. 400 (K = 800 nodes), float64 at N = 1517 (zeta, K = 3034) and all zeros below 2000 (others, K to 6780) | passes: log(R e^(2cd)) between -3.3 and -2.5 for 4 <= d <= 27 (c = 1/2); never above Lambda_N for N = 100, 400, 1517 | pass: 0.5 to 1.1 (chi_-4), -0.6 to 1.2 (chi_5), no growth in d | exceed the N = 100 / N = 400 majorant at d = 4.75 / 6.25 (T-NR q = 3), 10.75 / 12.75 (T-NR q = 1000003, by the coefficient at n = q), 12.5 / not by 10^8 (Davenport-Heilbronn), 14.5 / 16.75 (E_1/4), never up to 10^13 (E_1/8), 9.0 / 15.5 (random sign twist), 5.25 / 14.0 (random unimodular twist); zeta(s + i alpha) and zeta(2s)/zeta(s) pass; heat: no prime side | CLOSED. TILT-DET is equal to 1 for d <= 30 once N >= 25; the exact pencil is an N-dependent slack over e^(-2cd); detection is the explicit formula at x^(beta-1/2) against that slack, later than the height of the off-line zero by a factor 40 to 10^5, or absent |
| 2 | coal-n-laguerre-law + conf-lb-laguerre-floor + mem-coal-n-laguerre + sgn-2x-two-rate-closed-form + rate-mono-two-rate + confluent-laguerre-floor | position of log Lambda(block, x/nu_min) between the Laguerre floor at Rx and min(COAL-N cap, 1), blocks = zero ordinates (off-line pairs doubled) or log prime powers in [2^m, 2^(m+1)), x = N, 2N, 3N | Arb, 207 bracket evaluations; zero ordinates m = 2 .. 9 (N to 390), 11 node sets; log prime powers m = 0, 1, 2 (N to 441) | 0.37, 0.51, 0.62, 0.65, 0.67 at x = 2N for m = 4 .. 8 (N = 3, 10, 28, 69, 167) | chi_-4: 0.50, 0.60, 0.63, 0.66, 0.67 (N = 7 .. 223); chi_5: 0.52, 0.60, 0.63, 0.66, 0.68 | within 0.02 of the L-function of the same N in every octave: Davenport-Heilbronn with and without its off-line pairs (0.637 / 0.640, 0.661 / 0.662, 0.677 / 0.677 at m = 6, 7, 8), heat tau = -0.5 (18 doubled ordinates at m = 8: 0.668 against 0.669), E_a (every ordinate doubled), T-NR q = 1000003; arithmetic-free smooth node set: 0.34, 0.53, 0.62, 0.65, 0.67 | CLOSED. The bracket holds in all 207 cases (it is a theorem for any rates); the position depends on (N, R); no control leaves the range; log prime powers: only the support enters |
| 3 | signed-certificate-chain + phase-cert-phase-am + sgn-c-count-certificate + norm-transfer-closed-form + mem-ballast-live-residuals | (a) EV-OCT onset x*(m), m = 6 .. 40; (b) theta and the PHASE-CERT / PHASE-AM onsets on the dyadic skeleton {2^k, 5 2^(k-2)} with amplitudes a_F(n); (c) theta_F(N) over all n <= N | (a) closed form, 35 values; (b) m = 6, 12, 24, 40 (80 rates, to 2^41); (c) N = 10^2 .. 10^7, FFT autoconvolution of length 2^25 on GPU 1 | (a) 11.31664319 (m = 6) rising to 11.59043 (m >= 24); uniform form 27.035582; (b) theta = 1, fires at every depth; (c) theta = 1 | (b) chi_5: theta = 0.0437, PHASE-CERT fires for x > 1.57; chi_-4: one non-zero amplitude; (c) theta = 7.2e-8 and 6.6e-9 at N = 10^7 (proportional to 1/N) | (a) identical for every object; (b) Liouville twist 2.9e-4 (x > 4.07), Davenport-Heilbronn 0.179 (x > 0.86), zeta(s + i alpha) 0.285, random phases 0.036, E_a and T-NR 1; no onset absent or later than 27.04; (c) Davenport-Heilbronn 1.0e-7, sign twists 0.9e-7 .. 3.2e-7, unimodular twists 0.4e-7 .. 1.1e-7, zeta(s + i alpha) 0.277, E_1/4, E_1/8, T-NR: 1 | CLOSED. (a) object-independent; (b) two local coefficients; (c) theta = 1 iff the coefficients have one sign: the L-functions fall with the twists and E_a, T-NR pass with zeta |
| 4 | defl-orth-n-collar-free-sandwich + split-loo-every-octave-certificate + split-jitter-breach-threshold + mean-time-pencil-conf-dom | S(d) = sum of the deflated block constants LambdaPerp_k over octave blocks of the zero ordinates below H (off-line pairs doubled); onset depth of S < 1 per H; block depth d_k where Lambda(V_k, d) = 1/2 | float64 on GPU 1: ordinates below 2000 for 11 node sets (K to 10,311), below 8192 for zeta (8049 zeros, 4476 in the top octave); 27 to 30 depths 0.02 .. 16.3; Arb 512 bits re-check on ordinates below 520 | onset / D(H) = 0.82, 0.86, 0.84, 0.89, 0.91, 0.86 for H = 2^8 .. 2^13; d_k 2^k / N_k = 1.18 .. 1.37 for N_k >= 28; at d = 0.25 / 0.8 / 1.9 / 4.8 the certificate holds up to octave 4 / 5 / 7 / 10 | chi_-4: 0.83, 0.83, 0.84, 0.85; chi_5: 0.82, 0.85, 0.89, 0.86; block law 1.11 .. 1.30 | Davenport-Heilbronn 0.81 .. 0.90 with off-line pairs, 0.80 .. 0.84 without; heat tau = -0.1, -0.5: equal to zeta to two digits; E_a 0.86, 0.86, 0.85; smooth node set: equal to zeta to two digits; T-NR q = 1000003: D >= 17.6 (ordinates from 0.227), no onset inside the depth grid | CLOSED. The sandwich holds for every matrix; the first octave where the certificate stops is set by D(H) = 2 sum 1/gamma (node density), the same law for every object; an off-line pair contributes 2/gamma |

Object entry: (1) zeros on the pencil side, coefficients on the prime side; (2) zero ordinates as a multiset, or the support of the coefficients; (3) not at all in (a), two local coefficients in (b), signs of all coefficients in (c); (4) zero ordinates through their counting function.

## 1. Shared device (PROVED) and validation

Rates nu_1..nu_K with Re nu_k > 0, span E = span{e^(-conj(nu_k) t)} in L2(0, inf), G_ij = 1/(nu_i + conj nu_j), D = diag(e^(-d nu_i)); Lambda(nu, d) = lambda_max of (D G D*, G) = sup over E of int_d^inf abs(g)^2 / int_0^inf abs(g)^2 (seam-cross-ratio-pencil; for complex rates G is the Pick matrix of pick-id-seam-pencil).

Lemma (generator form). Let e_k(s) = sqrt(2 Re nu_k)/(s + conj nu_k) prod_(j<k) (s - nu_j)/(s + conj nu_j) (Takenaka-Malmquist basis, orthonormal in H2 of the right half-plane, spanning the same space; repeated nodes allowed). The left shift g -> g(. + d) maps E into E and in this basis has the matrix exp(dA), A upper triangular,

    A[k,k] = -conj(nu_k),   A[j,k] = -2 sqrt(Re nu_j Re nu_k)  (j < k).

Hence Lambda(nu, d) = norm(exp(dA))^2, and for a block V of columns preceded in the order by the set U, the deflated constant of defl-orth-n-collar-free-sandwich is LambdaPerp = norm(exp(dA)[:, V])^2; the sandwich max_k LambdaPerp_k <= Lambda <= sum_k LambdaPerp_k is the statement norm(T)^2 <= sum_k norm(T[:, V_k])^2 for a column partition.
Proof. In the Laplace picture the generator of the left shift is F(s) -> s F(s) - f(0), f(0) = lim s F(s). With b_j = (s - nu_j)/(s + conj nu_j) and B_k = prod_(j<k) b_j: s e_k - sqrt(2 Re nu_k) = -conj(nu_k) e_k + sqrt(2 Re nu_k)(B_k - 1), and B_k - 1 = sum_(j<k) (b_j - 1) B_j = -sum_(j<k) sqrt(2 Re nu_j) e_j. The basis is orthonormal, so tail energy = squared norm of the image coefficient vector. For the block statement: with U first in the order, {e_k : k in V} is an orthonormal basis of B_U E_V. QED.

Consequence for the computation: exp(dA) is a contraction, so scaling and squaring loses only additive rounding (absolute error about 2^s x 10^-16 in float64; a few hundred bits in Arb in place of the 6000 bits the Cauchy pencil needs). Code: `pen.py`.

Validation (`validate.py`, `validate.json`; all run before any object was touched):

| check | computed | reference |
|---|---|---|
| SGN-2X witness (1, 2, ln 2) | 0.7927911524016557 | (13 + 3 sqrt 17)/32 = 0.7927911524016557 |
| exp(dA) against the pencil (D G D*, G) by 60-digit eigenvalues, 6 random sets (3 real, 3 complex conjugate-closed), float64 and Arb | largest relative difference 1.0e-14 | 0 |
| two equal rates, x = 3 | 0.09412730715685542 | coalescence law e^(-2x)(1 + 2x^2 + 2x sqrt(1+x^2)) = 0.09412730715685542 |
| confluent N = 2, 3, 5, 8: floor <= exact <= cap (log) | -2.389 <= -2.363 <= -1.606; -3.772 <= -3.734 <= -2.343; -6.038 <= -5.988 <= -3.248; -21.276 <= -21.254 <= -17.865 | CONF-LB, COAL-N at R = 1 |
| EV-OCT onset m = 6; value at x = 12 | 11.316643192; 0.28610547 | 11.31664319; 0.286105471 |
| EV-OCT-UNIF onset; PhiUnif | 27.035582056; 9.977927682e-21 | 27.035582; 9.977927681809e-21 |
| TILT-DET K = 1, x = 6: bound / exact | 32.61938194 | 2 e x = 32.61938194 |
| DEFL-ORTH-N every-octave onsets, twins r = 1.1, m = 2, 6, 16 (Arb 400 bits, column-block norms) | 1.70399, 3.43942, 3.55861 | 1.7040, 3.4394, 3.5586 |
| deflated sum at m = 12, x = 6 | 0.2121511 | 2.1215e-1 |
| prime sieve | pi(10^9) = 50,847,534; pi(10^11) = 4,118,054,813; pi(10^13) = 346,065,536,839; psi(10^13) = 10,000,000,171,997.12 | pi(x) agrees with the tabulated values at 10^9, 10^11, 10^13; psi(10^9) = 1,000,001,595.99 and psi(10^11) = 100,000,058,456.43 from the same code |
| float64 against Arb 256 bits, same 800 complex nodes (zeta, N = 400, c = 1/2), d = 1 .. 30 | largest difference of log Lambda 0.0011 (tolerance of the norm iteration) | Arb radius below 4e-51 of the norm |
| float64 against Arb 512 bits, combination 4, ordinates below 520 of 4 node sets, 256 values of Lambda and S | largest absolute difference 8.1e-3 (norm iteration; values between 0 and 9) | Arb radius below 2.2e-16 |
| L-function zeros below 2000 (sign changes of Hardy Z, step 0.01) | 1958 (chi_-4), 2028 (chi_5) | main term of the counting function 1957.4, 2028.4 |

One reference not reproduced: the record's TILT-DET every-octave onset 15.4776 (m = 16, r = 1.1) is a block-wise sum; the whole-set bound computed here crosses 1 at 15.2721. Different quantity, not used below.

## 2. Combination 1: tail concentration of the prime-side error against the pencil of the zeros

Finite consequence tested. If psi_F(x) - M_F(x) is a combination of x^rho over zeros on the line (plus trivial terms), then g(t) = (psi_F(e^t) - M_F(e^t)) e^(-(1/2+c)t) lies in the closed span of e^(-(c -+ i gamma) t), and for a finite set of N on-line zeros the comparison is R_F(d) <= Lambda_N(d) (not a theorem for finite N: g is not in the span of the first N zeros). Survival would have been: zeta below the on-line majorant at every d, each control above it at a depth with e^d comparable to or below the height of its first off-line zero.

Definitions. M_F: x for zeta and T-NR; 0 for L(chi), Davenport-Heilbronn and the random twists; x^(1-i alpha)/(1-i alpha) for zeta(s + i alpha); -x + 2 sqrt x for zeta(2s)/zeta(s); x^(1+a)/(1+a) + x^(1-a)/(1-a) for E_a. Prime side: step function exact below 10^7 (5-point Gauss-Legendre per unit interval), above it psi_F at 1,381,552 bin edges (uniform in log x, width 10^-5) from a segmented sieve (`psi.c`), trapezoid in t. Random sign twist: eps(p) = +-1 from a 64-bit hash of p, completely multiplicative; random unimodular twist: 4096-th roots of unity from the same hash. T-NR: zeta(s)(1 + c q^(1/2-s) + q^(1-2s)), c = 2.2, coefficient -(r1^k + r2^k) q^(k/2) log q at n = q^k. Davenport-Heilbronn: Lambda_DH = (f log) * f^(-1) by Dirichlet convolution, n <= 10^8. R is computed with the integrals cut at T = log X; the last unit of d before T is not used.

PROVED (elementary). (i) For rates all on Re nu = c, Lambda >= e^(-2cd) (one exponential), so no majorant built from on-line rates is below the single-rate floor. (ii) The TILT-DET majorant min(1, inf_s e^(-2sd) prod (nu_i + conj nu_j)/(nu_i + conj nu_j - 2s)) is below 1 if and only if d > d_crit = sum_(i,j) Re 1/(nu_i + conj nu_j): the exponent is convex in s, vanishes at s = 0 and has derivative -2d + 2 sum Re 1/(nu_i + conj nu_j) there. For N on-line zeros and their conjugates d_crit is at least K/(2c) with K = 2N.

MEASURED, TILT-DET (`tilt_scan.json`), zeta on-line nodes:

| c | d_crit at N = 1, 2, 5, 10, 25, 100, 400 | log majorant at d = 30 (floor -60c) |
|---|---|---|
| 1/2 | 2.00, 4.09, 11.22, 24.31, 69.25, 346.6, 1736.5 | -22.6, -17.9, -8.5, -0.8, 0, 0, 0 |
| 1/4 | 4.00, 8.05, 20.65, 42.36, 110.9, 490.5, 2223.4 | -9.0, -5.7, -0.9, 0, 0, 0, 0 |
| 2 | 0.51, 1.28, 5.09, 13.46, 47.27, 283.3, 1552.6 | -109.8, -101.8, -78.2, -41.8, 0, 0, 0 |
| 20 | 0.08, 0.31, 1.70, 5.80, 26.91, 218.2, 1392.4 | -1184, -1163, -1063, -824, -15.8, 0, 0 |

The majorant asked for in the task (N up to 400, d <= 30) is identically 1; every object passes it. The remaining rows use the exact pencil value in its place.

MEASURED, exact pencil of on-line nodes, c = 1/2 (Arb 256 bits, largest ball radius relative to the norm below 1e-50; N = 1517 and "all" float64):

| nodes | K | log Lambda at d = 2, 4, 6, 8, 10, 15, 20, 25, 30 | log Lambda + d at d = 10, 20, 30 |
|---|---|---|---|
| zeta, N = 5 | 10 | -1.24, -3.13, -5.17, -7.45, -9.37, -14.32, -19.42, -24.31, -29.58 | 0.63, 0.58, 0.42 |
| zeta, N = 10 | 20 | -0.76, -2.86, -4.89, -7.14, -8.94, -14.00, -18.56, -23.87, -28.74 | 1.06, 1.44, 1.26 |
| zeta, N = 25 | 50 | 0.00, -2.35, -4.29, -6.22, -8.48, -13.10, -18.18, -23.16, -27.98 | 1.52, 1.82, 2.02 |
| zeta, N = 100 | 200 | 0.00, -0.81, -2.84, -5.16, -6.97, -11.72, -17.28, -22.04, -26.78 | 3.03, 2.72, 3.22 |
| zeta, N = 400 | 800 | 0.00, 0.00, -1.55, -3.27, -5.39, -10.72, -15.94, -20.54, -25.26 | 4.61, 4.06, 4.74 |
| zeta, N = 1517 (float64) | 3034 | 0.00, 0.00, -0.61, -2.40, -4.05, -8.59, -13.10, -17.83, -22.71 | 5.95, 6.90, 7.29 |
| smooth node set, N = 100 | 200 | 0.00, -2.28, -3.19, -5.68, -6.94, -12.44, -17.11, -22.44, -27.23 | 3.06, 2.89, 2.77 |
| chi_-4, N = 400 | 800 | 0.00, 0.00, -1.10, -2.64, -4.08, -8.51, -13.13, -18.07, -23.25 | 5.92, 6.87, 6.75 |
| chi_5, N = 400 | 800 | 0.00, 0.00, -0.60, -2.51, -4.24, -8.96, -13.76, -19.24, -24.87 | 5.76, 6.24, 5.13 |
| Davenport-Heilbronn on-line, N = 400 | 800 | 0.00, 0.00, -0.87, -2.29, -4.23, -8.38, -13.05, -18.79, -24.66 | 5.77, 6.95, 5.34 |
| Davenport-Heilbronn all zeros, first 100 ordinates (4 off-line nodes, min Re nu = 0.1915) | 200 | 0.00, 0.00, -1.06, -1.80, -2.54, -4.47, -6.38, -8.30, -10.21 | decay rate 2 x 0.1915 |

Reading: Lambda_N = 1 to the digits shown up to d about log(gamma_N/2 pi) + 1.5 (gamma_100 = 236.5, gamma_400 = 679.7, gamma_1517 = 1999.6), then log Lambda_N = -d + s_N with slack s_N about 0.5, 1.3, 1.8, 3.0, 4.5, 6 to 7 for N = 5, 10, 25, 100, 400, 1517. Including the off-line zeros of a control changes the decay rate to 2 min Re nu: this is the zero list itself, not a test.

MEASURED, prime side, X = 10^13, c = 1/2 (`t1_prime_big.json`, `an1.md`); entries are log(R_F(d) e^d):

| object | d = 2, 4, 6, 8, 10, 12, 16, 20, 24, 27 | first d with R > Lambda_N of its on-line zeros (zeta's for objects without a zero table), N = 100 / 400 / 1517 or all below 2000 |
|---|---|---|
| zeta | -1.40, -2.57, -3.12, -3.19, -3.17, -3.09, -3.21, -3.01, -3.23, -3.23 | none / none / none |
| L(chi_-4) | 1.04, 0.84, 1.01, 0.60, 0.77, 0.67, 0.89, 0.80, 0.64, 0.57 | none / none / none |
| L(chi_5) | 1.14, 0.37, -0.40, -0.31, -0.58, -0.25, -0.36, -0.19, -0.56, -0.45 | not run / none / none |
| zeta(2s)/zeta(s) (eps = -1) | -0.60, -2.13, -2.46, -2.80, -2.70, -2.64, -2.75, -2.54, -2.76, -2.75 | none / none / none |
| zeta(s + i alpha) | -1.10, -2.00, -2.25, -2.30, -2.24, -2.17, -2.28, -2.09, -2.30, -2.29 | none / none / none |
| random sign twist | 1.28, 2.05, 1.55, 2.26, 3.19, 2.49, 4.62, 5.31, 4.13, 5.61 | 9.0 / 15.5 / none |
| random unimodular twist | 1.50, 2.45, 3.13, 3.75, 2.50, 2.87, 4.07, 4.50, 4.80, 3.56 | 5.25 / 14.0 / none |
| E_1/4 | -1.30, -1.61, -0.91, 0.04, 1.05, 2.10, 4.03, 6.13, 7.97, 9.27 | 14.5 / 16.75 / 22.25 |
| E_1/8 | -1.38, -2.34, -2.46, -2.13, -1.67, -1.15, -0.29, 0.84, 1.67, 2.34 | none / none / none |
| T-NR q = 1000003 | -1.39, -2.30, -1.53, 0.27, 2.24, 4.24, 3.87, 0.22, 2.93, 5.93 | 10.75 / 12.75 / none |
| T-NR q = 3 | 1.28, 2.77, 4.37, 5.98, 7.61, 9.22, 12.38, 15.53, 18.56, 20.49 | 4.75 / 6.25 / 7.5 |
| Davenport-Heilbronn (n <= 10^8, d <= 17) | 1.01, 1.02, 1.38, 1.68, 2.49, 3.57, 5.73 (d = 16) | 12.5 / none / none |

Control onsets against the height of the first off-line zero (N = 100 majorant, the most favourable to detection):

| control | first off-line zero (beta, gamma) | onset d | e^d | e^d / gamma |
|---|---|---|---|---|
| Davenport-Heilbronn | (0.8085, 85.70) | 12.5 | 2.7e5 | 3.1e3 |
| E_1/4 | (0.75, 14.13) | 14.5 | 2.0e6 | 1.4e5 |
| E_1/8 | (0.625, 14.13) | none up to d = 25 | > 7e10 | > 5e9 |
| T-NR q = 3 | (0.9038, 2.86) | 4.75 | 116 | 40 |
| T-NR q = 1000003 | (0.5321, 0.227) | 10.75 (tail integral reaching x = q; no trace in psi below q) | needs X >= q = 1,000,003 | 4.4e6 |
| heat tau < 0 | (0.5216, 415.3) for tau = -0.1 | not formulable on the prime side (no Dirichlet series) | | |
| random sign / unimodular twist | no zero table (no continuation on file) | 9.0 / 5.25 | growth of log(R e^d) by about log d: mean square of sum eps(p) log p is x log x | |

The slopes are the explicit formula: 2(beta - 1/2) per unit of d (0.50 for E_1/4, 0.25 for E_1/8, 0.81 for T-NR q = 3 measured 0.50, 0.25, 0.80). A control is above the majorant when x^(2 beta - 1)/abs(rho)^2 has outgrown the slack e^(s_N) and the level of the object's own on-line part; raising N raises the slack and moves every onset later (N = 400: 6.25, 12.75, none, 16.75; N = 1517: 7.5, none, none, 22.25). The zeta row sits 3 below the floor because int_0^T abs(g)^2 is dominated by x < 2, where psi = 0 and g = -1 (the pole term): 0.69 of the total 1.081.

c = 1/4 (`an1.md`): the same picture. log(R e^(d/2)) for zeta between -3.1 and -2.4, E_1/4 rising to 9.3 (its zeros with beta = 3/4 sit on the edge of the weight), T-NR q = 3 to 13.0. Slack of the on-line pencil over e^(-d/2): 1.4 to 1.7 (zeta, N = 100, Arb), 2.2 to 2.7 (N = 400, Arb), 3.5 to 5.0 (N = 1517, float64). Onsets N = 100 / 400 / 1517: T-NR q = 3 at 3.26 / 4.25 / 5.75, T-NR q = 1000003 at 6.0 / 8.0 / 9.5, E_1/4 at 7.25 / 9.75 / 12.5, E_1/8 at 20.0 / none / none, random sign twist 7.5 / 13.0 / none, random unimodular twist 4.5 / 13.0 / none, Davenport-Heilbronn (N = 400 only) 12.75; zeta, zeta(2s)/zeta(s), zeta(s + i alpha): none. Davenport-Heilbronn with all zeros and heat tau = -0.5 with all zeros have a zero with beta >= c + 1/2 and no pencil at the corresponding weight (recorded as skipped).

Classification: CLOSED. Zeta passes at every size and both L-functions pass, but (a) the stated majorant is trivial at d <= 30; (b) the exact majorant is the single-rate floor times an N-dependent slack, so the pass is the mean-square bound psi(x) - x = O(x^(1/2)) on x <= 10^13, which the verified height already gives by the explicit formula; (c) every control with off-line zeros is detected later than its off-line height by a factor 40 to 10^5 or not at all, and T-NR at large q only once the data reach q.

## 3. Combination 2: Laguerre bracket on octave blocks

Finite consequence tested. For a block of N rates in [nu_min, R nu_min], depth d = x/nu_min: e^(-2Rx) sum_(k<N) (L_k(2Rx) - L_(k-1)(2Rx))^2 <= Lambda(block, d) <= Lambda_conf(N, x) <= (e^(-x)[L_(N-1)(-2Rx) + 2 sum_(k<=N-2) L_k(-2Rx)])^2 (CONF-LB at the largest rate, MONO-N twice, COAL-N). The literal floor of the task, at argument 2x, bounds the confluent value and not the block; the floor at Rx is the one that holds for the block. Statistic: pos = (log Lambda - log floor)/(log min(cap, 1) - log floor). Survival would have been: a control's position outside the range of zeta and the L-functions in octaves without off-line zeros.

Sizes: zero ordinates below 2000 (zeta below 4000), octaves m = 2 .. 8 for 11 node sets and m = 9 for zeta and the smooth node set (N = 390; Davenport-Heilbronn and chi_5 have 522 ordinates there and were not run), x = N, 2N, 3N; Arb at 128 + 4N bits (1688 bits at N = 390), radius of the scaled matrix at most 2.1e-16 of its norm. The bracket holds in all evaluations (207 at the time of writing; it must).

pos at x = 2N; each cell is N (number of doubled ordinates) and pos:

| node set | m = 3 | m = 4 | m = 5 | m = 6 | m = 7 | m = 8 |
|---|---|---|---|---|---|---|
| zeta (m = 9: N = 390, 0.677) | | 3 0.365 | 10 0.509 | 28 0.621 | 69 0.652 | 167 0.669 |
| smooth node set, no arithmetic (m = 9: N = 390, 0.678) | | 3 0.342 | 10 0.526 | 28 0.615 | 69 0.649 | 167 0.669 |
| L(chi_-4) | 2 0.360 | 7 0.495 | 18 0.600 | 42 0.632 | 97 0.663 | 223 0.674 |
| L(chi_5) | 2 0.334 | 8 0.522 | 19 0.603 | 44 0.631 | 102 0.662 | 232 0.675 |
| Davenport-Heilbronn | 3 0.379 | 8 0.520 | 18 0.581 | 44 (2) 0.637 | 102 (3) 0.661 | 232 (5) 0.677 |
| Davenport-Heilbronn, on-line only | 3 0.379 | 8 0.520 | 18 0.581 | 40 0.640 | 96 0.662 | 222 0.677 |
| heat tau = -0.1 | | 3 0.365 | 10 0.508 | 28 0.621 | 69 0.652 | 167 (1) 0.669 |
| heat tau = -0.5 | | 3 0.365 | 10 0.504 | 28 (1) 0.622 | 69 (5) 0.653 | 167 (18) 0.668 |
| heat tau = -0.5, on-line only | | 3 0.365 | 10 0.504 | 26 0.634 | 59 0.649 | 131 0.670 |
| E_a (every ordinate doubled) | 2 (1) 0.024 | 6 (3) 0.403 | 20 (10) 0.564 | 56 (28) 0.650 | 138 (69) 0.666 | not run (N = 334) |
| T-NR q = 1000003 | 35 (17) 0.626 | 73 (35) 0.662 | 152 (71) 0.681 | not run (N >= 308) | | |

At x = N the position is 0.998 or more for every node set with N >= 28 (the block value is still 1); at x = 3N it runs 0.42 to 0.55 with the same dependence on N (`an2.md`). The position is a function of N (and R, which is 1.95 to 2.00 for all blocks with N >= 18): 0.60 at N = 18..20, 0.63 at 40..56, 0.66 at 96..138, 0.67 to 0.68 at 152..232, whatever the node set. The first off-line zero of Davenport-Heilbronn is at 85.70 (octave 6); octaves 3, 4, 5 contain none and the position there equals that of L(chi_5) at the same N within 0.02 (0.520 against 0.522 at N = 8; 0.581 against 0.603 at N = 18, 19); in octaves 6 to 8 removing the off-line pairs moves it by at most 0.003. The one outlier, E_a at m = 3, is the pair {14.13, 14.13}: a block with R = 1, where the floor at Rx is the confluent floor itself.

Log prime powers as rates (blocks of log n over the support of Lambda_F in [2^m, 2^(m+1)), m = 0, 1), x = 2N: zeta 4: 0.445, 19: 0.532; chi_-4 3: 0.411, 16: 0.489; chi_5 3: 0.461, 18: 0.533; Davenport-Heilbronn (support: all n prime to 5, checked on the computed Lambda_DH(n), n <= 12 printed in `dh1e8.log`) 4: 0.421, 38: 0.494. Sign twist, unimodular twist, E_a and T-NR at q = 1000003 have the support of zeta on these octaves and give zeta's numbers. Octave m = 2 has 441 rates for zeta (position 0.436 at x = 2N, Arb 1892 bits), m = 3 about 6e5, and m = 30 is out of reach of any exact pencil; the object enters through the support only.

Classification: CLOSED. No control leaves the range in any octave.

## 4. Combination 3: EV-OCT onsets, phase-alignment ratio with the object's signs

(a) RECORD reproduced, extended (`t3.json`): x*(m) = 11.31664, 11.45362, 11.52205, 11.57334, 11.58616, 11.59017, 11.59042, 11.59043 for m = 6, 7, 8, 10, 12, 16, 20, 24; constant to 7 digits for m = 24 .. 40. Uniform closed form: 27.035582. The certificate is a function of the rate lattice; no object enters. For scale, the exact pencil of the coalescent twin skeleton at the same depths (Arb): Lambda = 0.9707 at x = 3.56 and 9.73e-5 at x = 11.3166 (m = 6); 0.9801 and 1.204e-4 (m = 40).

(b) Dyadic skeleton with the object's amplitudes: rates {2^k, 5 2^(k-2)}, k = 2 .. m+1 (twin ratio 5/4 <= 1.3), amplitudes a_F(n). For a completely multiplicative object these are a(2)^i a(5)^j. theta = (a* G a)/(abs(a)^T G abs(a)); PHASE-CERT gives R < 1/2 for y = 2x > ln(1/theta), PHASE-AM for y > ln((1 + theta)/(2 theta)).

| object | non-zero amplitudes (m = 40) | theta at m = 6 / 40 | PHASE-CERT fires for x > | PHASE-AM fires for x > |
|---|---|---|---|---|
| zeta, T-NR (q = 3, 1000003), E_1/4, hash sign twist (eps(2) = eps(5) = +1) | 80 | 1 / 1 | 0 | 0 |
| L(chi_-4) | 1 (a(2^k) = 0) | 1 (one packet) | 0 | 0 |
| L(chi_5) | 40 | 0.0465 / 0.0437 | 1.57 | 1.24 |
| Davenport-Heilbronn | 40 | 0.2116 / 0.1788 | 0.86 | 0.60 |
| zeta(2s)/zeta(s) | 80 | 3.3e-4 / 2.9e-4 | 4.07 | 3.72 |
| zeta(s + i alpha) | 80 | 0.324 / 0.285 | 0.63 | 0.41 |
| hash unimodular twist | 80 | 0.042 / 0.036 | 1.66 | 1.33 |

Every object fires before 4.1, far below 27.04; the fail criterion (onset absent or later than 27.04 while zeta and L(chi) fire) is met by no control. The ordering is set by a(2) and a(5): a twist with eps(2) = eps(5) = +1 is indistinguishable from zeta, and L(chi_5) (a(2) = -1) sits between Davenport-Heilbronn and the Liouville twist.

(c) All integers. theta_F(N) = sum_s (a * conj a)(s)/s divided by the same with abs(a) (the Gram form of e^(-nt), n <= N, is the Hilbert matrix 1/(m+n)); FFT autoconvolution of length 2^25, coefficient arrays of the control battery (`c12-control-battery-harness`, n <= 10^7).

| object | a* G a at N = 10^5, 10^6, 10^7 | theta at N = 10^7 |
|---|---|---|
| zeta | 1.386e5, 1.386e6, 1.386e7 (= N ln 4) | 1 |
| E_1/4, E_1/8, T-NR (q = 3), deletion control DEL-0.9 | positive coefficients | 1 |
| zeta(s + i alpha) | 3.84e4, 3.84e5, 3.84e6 | 0.277 |
| thin sign flip THIN-0.9 | 5.77e3, 5.77e4, 5.77e5 | 0.0416 |
| L(chi_-4) | 0.2500, 0.2500, 0.2500 | 7.2e-8 |
| L(chi_5) | 0.0588, 0.0588, 0.0588 | 6.6e-9 |
| Davenport-Heilbronn | 0.3765, 0.3765, 0.3765 | 1.0e-7 |
| zeta(2s)/zeta(s) | 3.40, 3.83, 4.46 | 3.2e-7 |
| random sign twists SGN-00, 01, 02 | 1.04, 0.95, 1.55; 1.17, 1.26, 1.27; 3.24, 3.24, 3.37 | 1.1e-7, 0.9e-7, 2.4e-7 |
| random unimodular twists U-00, U-01 | 0.46, 0.62, 0.53; 0.85, 1.66, 1.47 | 0.4e-7, 1.1e-7 |

a* G a = int_0^1 abs(sum a(n) u^n)^2 du/u: it grows like N when the power series has a pole at u = 1 (non-negative coefficients, or a displaced pole of positive density) and stays bounded otherwise. theta separates "coefficients of one sign" from "coefficients with cancelling signs": both Dirichlet L-functions are on the side of Davenport-Heilbronn and the twists, and E_a and T-NR (off-line zeros from heights 14.13 and 0.23 or 2.86) are on the side of zeta.

Classification: CLOSED.

## 5. Combination 4: orthogonal block sandwich on octaves of zero ordinates

Finite consequence tested. Node set = the ordinates of the object below H as real rates (an off-line pair at ordinate gamma gives the rate gamma twice), blocks V_k = ordinates in [2^k, 2^(k+1)), ordered highest octave first (low blocks deflated against high ones, the ordering the record finds tightest). T = exp(dA); Lambda = norm(T)^2, LambdaPerp_k = norm(T[:, V_k])^2, S = sum_k LambdaPerp_k. The certificate "fires" when S < 1. Survival would have been: firing in every octave for zeta's ordinates at a depth independent of the number of octaves, and a control stopping at an octave tied to its off-line pairs.

The twin-lattice hypotheses do not apply to zero ordinates beyond the first blocks: in-octave multiplicity is 1, 3, 10, 28, 69, 167, 390, 893, 1913 for zeta in octaves 3 .. 11 (N >= 3 from the second block), and the log-jitter threshold 0.28/m refers to two nodes per octave. The exact deflated quantities are computed instead.

MEASURED (float64, GPU 1; 27 depths from 0.02 to 8.1 in ratio 2^(1/3); `t4_f.jsonl`, `an4.md`).

Law 1, single block: the depth d_k at which Lambda(V_k, d) = 1/2 satisfies d_k 2^k / N_k = 1.2 to 1.3 for N_k >= 28:

| node set | q_k = d_k 2^k / N_k for the octaves with N_k >= 18, lowest to highest |
|---|---|
| zeta (below 8192) | 1.18, 1.21, 1.24, 1.34, 1.17, 1.30, 1.17 (octaves 6 .. 12) |
| smooth node set | 1.18, 1.21, 1.24, 1.34, 1.23 |
| L(chi_-4) | 1.14, 1.23, 1.15, 1.18, 1.30, 1.23 |
| L(chi_5) | 1.11, 1.19, 1.28, 1.15, 1.26, 1.20 |
| Davenport-Heilbronn / on-line only | 1.12, 1.19, 1.28, 1.15, 1.26, 1.20 / 1.12, 1.15, 1.15, 1.18, 1.19, 1.32 |
| heat tau = -0.5 / on-line only | 1.18, 1.20, 1.24, 1.34, 1.23 / 1.13, 1.14, 1.26, 1.34, 1.17 |
| E_a (all doubled) | 1.10, 1.19, 1.20, 1.24, 1.33, 1.22 |
| T-NR q = 1000003 | 1.19, 1.16, 1.18, 1.34, 1.31, 1.28, 1.25, 1.29 (octaves 3 .. 10) |

(the grid step limits the resolution of q to about 10 percent).

Law 2, every-octave certificate: for the node set of all ordinates below 2^(m+1), the onset depth of S < 1 divided by D_m = 2 sum_(gamma < 2^(m+1)) 1/gamma:

| node set | D_m for m = 6, 7, 8, 9, 10 | onset / D_m for m = 6, 7, 8, 9, 10 |
|---|---|---|
| zeta (below 8192) | 1.413, 2.152, 3.048, 4.095, 5.295 (m = 11: 6.648; m = 12: 8.155) | 0.77, 0.82, 0.86, 0.84, 0.89 (m = 11: 0.91; m = 12: 0.86) |
| smooth node set | 1.410, 2.149, 3.045, 4.092, 5.250 | 0.77, 0.82, 0.86, 0.84, 0.87 |
| L(chi_-4) | 2.977, 4.016, 5.214, 6.568, 8.021 | 0.79, 0.83, 0.83, 0.84, 0.85 |
| L(chi_5) | 3.151, 4.245, 5.492, 6.896, 8.394 | 0.82, 0.82, 0.85, 0.89, 0.86 |
| Davenport-Heilbronn | 3.299, 4.395, 5.643, 7.048, 8.547 | 0.79, 0.81, 0.86, 0.90, 0.88 |
| Davenport-Heilbronn, on-line only | 3.217, 4.250, 5.444, 6.737, 8.095 | 0.80, 0.80, 0.83, 0.84, 0.84 |
| heat tau = -0.1 | 1.412, 2.150, 3.046, 4.093, 5.250 | 0.77, 0.82, 0.86, 0.84, 0.87 |
| heat tau = -0.5 | 1.407, 2.145, 3.040, 4.087, 5.244 | 0.77, 0.82, 0.86, 0.84, 0.87 |
| heat tau = -0.5, on-line only | 1.371, 2.002, 2.707, 3.385, 4.008 | 0.77, 0.82, 0.84, 0.85, 0.84 |
| E_a | 2.826, 4.303, 6.095, 8.190, 10.507 | 0.82, 0.86, 0.86, 0.85, beyond the grid |
| T-NR q = 1000003 | 68.3 .. 96.3 (17.6 from the two ordinates at 0.227) | beyond the grid (d <= 8.1) |

(the partial top octave of each table is included as it is: ordinates below 2000.) The ratio is 0.77 to 0.91 for every node set over a range of D from 1.4 to 8.5. D is twice the sum of reciprocal ordinates, the phase speed at 0 of the Blaschke product of the node set (the quantity of mean-time-pencil-conf-dom). For zeta D(H) = (1/2 pi) log^2(H/2 pi)(1 + o(1)): the depth needed to certify all ordinates below H is unbounded in H, and at a fixed depth d the certificate holds up to the height where D(H) = d/0.85:

| depth d (x = gamma_1 d for zeta, to be compared with the twin-lattice onsets 3.56, 11.57, 27.04, 68.33) | 0.25 (3.5) | 0.8 (11.3) | 1.9 (26.9) | 4.8 (67.8) |
|---|---|---|---|---|
| zeta, heat tau = -0.1, -0.5, smooth: highest top octave with S < 1 | 4 | 5 | 7 | 10 |
| L(chi_-4) / L(chi_5) | 3 / 3 | 4 / 3 | 5 / 5 | 8 / 8 |
| Davenport-Heilbronn / on-line only | none / none | 3 / 3 | 5 / 5 | 7 / 8 |
| E_a | none | 4 | 5 | 7 |

At the uniform twin-lattice onset x = 27.04 the certificate for zeta's ordinates holds up to octave 7 (ordinates below 256, 111 zeros) and fails from octave 8 on. In the failing range the sum is carried by the low blocks deflated against the high ones (at d = 2.56, ordinates below 512: Lambda = 0.997, S = 2.04, LambdaPerp of the top block below float64 resolution, largest term 0.941 from octave 4), that is by the accumulated Blaschke delay of the higher nodes. Davenport-Heilbronn with and without its off-line pairs: the same octave except at d = 4.8, where the 84 extra terms 2/gamma raise D_10 from 8.10 to 8.55 and move the onset across the grid point.

Largest run: zeta, 8049 ordinates below 8192 (octave 12 holds 4476), 30 depths 0.02 .. 16.3 (`t4_big.jsonl`): both laws continue (rows above). A run to 16384 (17,900 nodes) was prepared and not executed: GPU 1 was shared with other jobs at 99 percent load. Arb re-check (512 bits, ordinates below 520 of zeta, Davenport-Heilbronn, L(chi_5) and the smooth set, d = 0.08, 0.32, 1.28, 5.12): 256 values of Lambda and S agree with the float64 screen within 8.1e-3; the small values agree to the digits printed (for example Lambda = 3.59e-27 at d = 5.12, ordinates below 512, in both).

Classification: CLOSED. The first octave where the certificate stops is set by the node density through sum 1/gamma, by the same law for zeta, the L-functions, every control and the arithmetic-free node set.

## 6. Why nothing here is a survivor, in terms of the criteria

- Uses all primes together: only the prime side of combination 1 and theta in 3(c).
- Combination 1: zeta passes, but the Dirichlet controls with off-line zeros are detected at x between 40 and 1e5 times their off-line height (later than a zero count at that height), E_1/8 is not detected at 10^13, and T-NR at q = 1000003 is not detected by any data below q. The random twists are separated by the factor log x in the mean square (they have no functional equation; their prime sums behave like sqrt(x log x)), which is a statement about the pole-free mean square and is shared by no control with a functional equation.
- Combination 3(c): separates by coefficient positivity; L(chi) fail, E_a and T-NR pass.
- Combinations 2, 3(a), 3(b), 4: functions of the node count per octave, of the rate lattice, of two local coefficients, of sum 1/gamma.

## 7. What is new relative to the records (for the engine)

- Generator form of the seam pencil (section 1, PROVED): Lambda = norm(exp(dA))^2 in the Takenaka-Malmquist basis; deflated block constants are column-block norms; reproduces five recorded literals; removes the ill-conditioned Cauchy Gram (K = 800 complex nodes at 256 bits; K = 10^4 in float64 where Lambda > 1e-9).
- TILT-DET non-triviality threshold (PROVED): the majorant is below 1 iff d > sum_(i,j) Re 1/(nu_i + conj nu_j).
- MEASURED laws for many-rate blocks: single octave block d_k = (1.2 to 1.3) N_k / 2^k; every-octave deflated certificate onset = (0.77 to 0.91) x 2 sum 1/gamma. These answer the open residual "off-lattice rates / in-octave multiplicity N >= 3" of mem-ballast-live-residuals in the negative for node sets of logarithmically growing density: no m-uniform onset exists.

## 8. Three weakest steps

1. Combination 1 compares the full prime-side function with the pencil of a finite zero set; R <= Lambda_N is not a theorem for finite N, and the onsets quoted depend on N (three values of N are given). The classification does not depend on this: the larger N, the later the onsets.
2. Davenport-Heilbronn on the prime side reaches 10^8 only (Dirichlet inverse in memory), and its curve is cut one unit before log 10^8; the heat controls and the random twists have no zero-side or prime-side counterpart respectively. The heat zero table for tau = -0.5 has zeros with Re z > 1/2 among the first 400 ordinates, so its all-zero pencil at c = 1/2 does not exist (recorded as skipped).
3. Laws 1 and 2 of combination 4 are measured on a depth grid of ratio 1.26 in float64 (re-checked in Arb on the ordinates below 520 only); the constant 0.85 is an observed range 0.77 to 0.91, not a limit, and the equality with D(H) is not proved here.

## 9. Files

Code: `pen.py` (generator form, Arb and float64, closed forms), `validate.py`, `mkdata.py`, `mksmooth.py`, `zbig.py`, `psi.c`, `t1_prime.py`, `t1_zero.py`, `tilt_scan.py`, `t2.py`, `t3.py`, `t4.py`, `an1.py`, `an2.py`, `an4.py`, job scripts `job_*.sh`.
Data: `nodes.json` (ordinates), `validate.json`, `tilt_scan.json`, `t1_prime_1e11.json`, `t1_prime_big.json` (10^13), `t1_prime_dh1e8.json`, `t1_zero_a.jsonl` (Arb), `t1_zero_f.jsonl` (float64), `an1.md`, `an1.json`, `t2_zeros.jsonl`, `t2_logpp.jsonl`, `t3.json`, `an2.md`, `t4_f.jsonl`, `t4_a.jsonl`, `t4_big.jsonl`, `t4_all.jsonl`, `an4.md`, `an4.json`.
Server: `~/rh-push/s5-seam-pencil-exponential-span-depth/` (the binned prime sums `psi_big.bin`, 88 MB, and `psi_1e11.bin` stay there). Units of this lane: `rh-s5-sieve-1120074549` (7 cores, 96 min 47 s for the sieve to 10^13), `rh-s5-gpu-11200*` (five launches, four stopped by this lane to change the job order), `rh-s5-arb-1120090422`, `rh-s5-big-1120094046`; all inactive at the end of the run. Not run: zero-side float64 pencil with all 3474 zeta zeros below 4000 (K = 6948) and the c = 1/4 float64 rows for chi_5, Davenport-Heilbronn, heat, E_1/8, T-NR (stopped for GPU time); combination 4 to height 16384.
