# s1-zero-statistics-gram: screening of four combinations (2026-11-19)

Lane: screening arm, slug `s1-zero-statistics-gram`. Four combinations from the idea engine were turned into finite tests and run on zeta, on Dirichlet L-functions mod 5, and on the controls. Labels: PROVED (algebra written here), MEASURED (numerics, float64 or multiprecision, not interval-certified unless stated), HEURISTIC (formula taken from the ratios conjecture). Nothing here is a statement about the location of zeros of zeta.

Verdict: **no survivor.** 4 combinations tested, 4 closed. One statistic (the small-gap exponent of on-line zeros) separates DH, the backward heat lists and every non-trivial mixture of L(chi) and L(chibar) from zeta and L(chi) without using a counting function, but it is identical for zeta and T-NR and is blind to a heat step below the resolution of the list, so it does not meet the survivor definition.

## 0. Table

Objects. ZETA; CHI = L(s, chi), chi mod 5, chi(2) = i; CHIBAR; CHI5R = real character mod 5; DH = Davenport-Heilbronn = Z_chi + Z_chibar; DHALT = Z_chi - Z_chibar (the second combination with a functional equation); MIX-x = cos(phi) Z_chi + sin(phi) Z_chibar, phi = x pi/400 (x = 5, 20, 50, 80; DH is x = 100); HEAT-tau = Riemann-Siegel model of the backward heat deformation at T0 = 1e8 (construction of lane b-dyson-defect, tau = -0.005, -0.02, -0.08) and the exact heat tables of the control battery below height 2000; PER = period-5 coefficients (1, 0.3, -1.7, 0.4, 0); T-NR = zeta(s)(1 + 2.2 * 3^(1/2-s) + 3^(1-2s)); EA = zeta(s+a) zeta(s-a); WT = zeta(s + i alpha); SGN = sign-twisted primes (SGN-LIOU = zeta(2s)/zeta(s); random signs have no continuation).

Cells: P = same value as zeta within the stated error; F = differs; N = not formulable; "=" = identical to zeta by construction (section 2).

| # | combination (nodes) | statistic | sizes reached | zeta | L(chi) | DH | HEAT | SGN | WT | EA | T-NR | classification |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1a | extreme-gap-exponent + cue-neff-small-gap-correction + random-platt-windows | number of normalised gaps below 0.2 over the CUE_Neff value, N_eff = log(qT/2pi)/sqrt(12 Lambda_q) | zeta: 1.04e8 zeros (first 2e6, blocks of 2e7 at 1e8 .. 1e12, 4e6 at 1e7); chi, chibar: 2.0e6 zeros each to T = 1e6; DH 1.79e6 on-line zeros | 0.9965 +- 0.0011 (pairs against the full two-point formula: 1.0004 +- 0.0011) | 1.0011 +- 0.0059 with Lambda_5 = 2.2207; 0.9469 with zeta's Lambda = 1.5732 (9.0 sigma off) | 0.956 +- 0.009 with the counting-function unfolding; 1.215 with the unfolding by the on-line density: F | 1.68, 2.32, 2.03: F | LIOU = ; random N | = | N (no on-line zero) | = | CLOSED. Separates DH and HEAT through the density of missing zeros; identical for T-NR, WT, LIOU |
| 1b | same | small-gap exponent k, P(gap < s) ~ s^k, Hill estimator on gaps below 0.2 of the mean (GUE law gives 2.962); uses no counting function | same | 2.952 +- 0.025, 2.966 +- 0.017, then 2.966 .. 2.979 +- 0.007 in five blocks | 2.972 +- 0.025, 2.973 +- 0.025 | 2.07 +- 0.02 (DHALT 2.13, MIX 2.09 .. 2.44): F from about 3,000 to 10,000 zeros (T about 3e3 to 9e3) | 2.16, 2.05, 1.98 (+- 0.01); battery tables 2.01 +- 0.28, 2.29 +- 0.23: F | LIOU = ; random N | = | N | = | CLOSED (near miss, section 3.3) |
| 1c | same | exponent of the running minimum gap | same | -0.403 (first 2e6), -0.26 .. -0.35 in blocks; null of independent GUE-surmise gaps: -0.335 +- 0.058 | -0.389, -0.403 | -0.546 (3.5 sigma from the null) | -0.48, -0.45, -0.63 | = / N | = | N | = | CLOSED. The repo value -0.3953 is within 1.2 sigma of the null |
| 2 | zeta-zero-lag1-anticorrelation + gap-structure-function + palm-mirror-additive-deficit | r1 = adjacent-box correlation of counts (boxes of 100 .. 1000 mean spacings); gap autocorrelation C(r), r <= 1e4 | same lists | r1 in [-0.61, -0.35] over 7 height ranges and 6 box lengths; C(1) from -0.349 (first 2e6) to -0.327 (1e12) | r1 in [-0.53, -0.47]; C(1) = -0.383 | r1 = -0.05 .. +0.01 (box-count variance 9.4 .. 80 against 0.44): F; C(1) = -0.152: F | r1 = -0.07 .. 0.00; C(1) = -0.30, -0.16, -0.03: F | = / N | = | N | = | CLOSED. A jittered rigid lattice gives r1 = -1/2 exactly: the zeta value is the lattice value. DH and HEAT leave the band through the variance of the number of missing zeros per box (a zero count) |
| 3a | route-l-cmv-detector-reach + euler-detection-decouples-from-offline | first Levinson order N_det with abs(alpha_N) >= 1 for the Herglotz function Xi'/Xi(1/2 + a(1+w)/(1-w)), a = 20 and a = 8, orders to 400 | order 400, 4000 to 12000 bits | none to 400 | xi(chi) xi(chibar): none to 400 | 152 (a = 20), 149 (a = 8); zeta with one quadruple at the same height and distance: 91 .. 96 and 89 .. 94 | not run (no series) | N (no functional equation) | P (translation along the line keeps positive-realness; not run) | 10 .. 12 (a = 20), 7 .. 8 (a = 8) | 15 (a = 20), 7 (a = 8) | CLOSED. DH passes every order below 149: detection order is set by the height of the first off-line zero, and DH needs more orders than an isolated quadruple at that height |
| 3b | same | log-derivative coefficients c(n), n <= 40, recovered from the ordinate list with a cos^4 window; relations c(n) = 0 off prime powers, c(4) log 2 = c(2)^2 | same lists | c(n) = Lambda(n) within 2e-5 in every block; c^(6) below 4e-6 | c(n) = chi(n) Lambda(n) within 1e-6 | all zeros below 2000: c(6) = 1.93635 (exact 1.93636), relation violated; on-line zeros only: every c(n) wrong by O(1) (c(2) = -0.689 against 0.197), c(6) = -0.377: F | c(6) = 0.004, 0.021, 0.051; c(2) = 0.662, 0.480, 0.030: F | P (Euler product) | P | P (prime-power support) | P (prime-power support; on-line list = zeta's) | CLOSED. This is identification of the Dirichlet coefficients (map row 33); every control with an Euler product passes |
| 4a | mem-fifth-pair-degeneracy + vasyunin-lammin-power-law | pairing of the top Gram eigenvalues of the skew-Toeplitz matrix, N = 1200, 2400 | N = 2400 | spreads <= 2.8e-15 | CHI5R kernel: <= 2.2e-15 | <= 8.4e-16 | random kernel <= 1.2e-14 | P | P | P | P | CLOSED, PROVED: the matrix is real antisymmetric for every kernel, so the pairing is algebraic |
| 4b | same | lam_min of the Nyman-Beurling Gram, exponent p in lam_min ~ A N^-p; Nyman-Beurling distance d_N^2 | N = 10000 (zeta, CHI, CHI5R, DH), 3000 (DHALT, PER), 1111 (T-NR) | p = 1.9216 (N >= 1000), lam_min(1e4) = 1.7315e-8, d^2 = 0.004899 | CHI: p = 1.9380, 1.7242e-8, d^2 = 0.01861; CHI5R: 1.9390, 1.7209e-8, 0.01525 | p = 1.9316, lam_min(1e4) = 1.3733e-8, d^2 = 0.01968, still decreasing: P | N | N (LIOU: poles on the line) | not run | not run | p = 1.96 .. 1.98; d^2 stops at 0.185 (its off-line zeros are at height 2.86) | CLOSED. The exponent is the same for every object, including PER (1.920) and DHALT (1.916): it carries no information on zeros. d_N^2 detects only T-NR, PER and DHALT, whose off-line zeros are low; DH is not detected at N = 1e4 (floor from its off-line zeros about 4e-4) |

## 1. Code, data and validation

All code is in `code/` (run locally through `scripts/memcap.sh 8` on small cases, then on the compute server through `rhrun`, 1 to 5 cores and 3 to 12 GB per unit, GPU 1 for the sampler only).

| file | role | known-answer check |
|---|---|---|
| `lsample.py` | Z_chi(t), Z_chibar(t) by the direct Dirichlet sum to n ~ 1.25 t plus an Euler-Maclaurin Hurwitz tail (cupy, float64). 3.97e12 terms for T <= 1e6 at 1.0e9 terms/s | against python-flint `hardy_z` at 80 bits: max difference 2.9e-13; rotated values real to 6.8e-8 at T = 1e6 |
| `lzeros.py` (+ `rsref.py`, copy of the b-dyson-defect zero finder) | sign changes on a 4x oversampled grid, sinc upsampling, hidden pairs, Newton | counts of zeros of L(chi) and L(chibar) against Riemann-von Mangoldt: 163681 / 163680.97, 379820 / 379820.24, 1459792 and 1459791 / 1459791.71; DH on-line zeros in [10, 2000): 1859 = battery table (independent Arb code), max difference 9.1e-12 |
| `rmt.py` | GUE and CUE_N gap laws (Fredholm determinants), GUE number variance, two-point function with arithmetic terms | Lambda = 1.573151 (literature 1.57314); CUE_Neff over GUE at 1e12: 0.97291 (repo measurement 0.9733 +- 0.0088); GUE adjacent-box value at L = 495.78: -0.463978 (repo -0.46398) |
| `zstats.py`, `extras.py` | list statistics and size ladders | 3474 zeta zeros below 4000: recovered c(n) = Lambda(n) to 5 digits, 0 at n = 6, 10, 12; jittered lattice: r1 = -0.48 +- 0.03 (exact -1/2), C(1) = -0.498, C(2) = -0.007 (exact -1/2, 0); samples with P(gap < s) ~ s^3 and s^2: Hill 2.99 and 2.00 |
| `chat_local.py` | coefficient recovery on the battery tables | DH below 2000 with its 84 off-line pairs: all c(n), n <= 30, within 1.6e-4 of the closed form |
| `cmv.py` | Herglotz moments by `acb_series`, Levinson recursion in midpoint multiprecision at two precisions | Route L table rows reproduced: (zero 1, delta 0.4) N_det = 9 with e/e0 = 0.0257; (1, 0.2) 11; (1, 0.025) 14; (3, 0.1) 20 with 6.1e-7; (6, 0.05) 34 with 2.6e-16. Row (20, 0.4) gives 81 here against 96 in the repo; not resolved |
| `gram.py`, `gramcpu.py` | Vasyunin Gram for zeta; closed form for period-5 coefficients (section 6.2) | zeta d_N^2 at N = 3000 .. 6000 equals the seven repo values to 12 digits (0.005613104397 .. 0.005233272382); periodic entries against an independent mpmath summation: 6.7e-16; GPU and CPU builds agree to 13 digits at N = 3000 |
| `fifth_pair.py` | skew-Toeplitz Gram | lambda_9/lambda_1 = 0.99914 at N = 2400 (repo 0.99914) |

Lists. Zeta: the 2,001,052 Odlyzko zeros and the Riemann-Siegel blocks of lane b-dyson-defect on the server (4.0e6 zeros at 1e7; 2.0e7 zeros each at 1e8, 1e9, 1e10, 1e11, 1e12). The blocks stop at 1e12; no block near 1e13 was available. L(chi), L(chibar), DH, DHALT and four mixtures: computed here to T = 1e6. HEAT: three lists at T0 = 1e8 over a range holding 2,000,458 zeros of the undeformed function (8e6 sample points each; 1.97e6, 1.80e6 and 1.16e6 on-line zeros: 1.5%, 10.2% and 42.2% of the zeros have left the line), plus the battery tables below 2000.

Fraction of DH zeros on the line: 0.9443 below T = 418, 0.918 below 3e3, 0.9023 below 7e4, 0.8940 below 1e6. DHALT: 0.743. MIX-5: 0.984.

## 2. Structural fact used in every row (PROVED)

On Re s = 1/2 the T-NR factor is 1 + c w + w^2 with w = 3^(-it), which equals w (c + 2 cos(t log 3)) and has no zero for c = 2.2 > 2. So the on-line zeros of T-NR are exactly those of zeta. WT translates the list. SGN-LIOU has its zeros at rho/2, a rescaled copy of the list. EA has no on-line zero and its ordinate multiset is zeta's, doubled.

Consequence: every functional of the list of on-line ordinates takes the same value on zeta and on T-NR, and a translation-invariant or scale-free one also on WT and SGN-LIOU. No statistic of the ordinate list can make every control fail. This closes the tag pair zero-channel x (anything computed from the ordinate list alone) as a source of survivors, independently of the numbers below.

## 3. Combination 1: small gaps

### 3.1 Test
For a primitive character of prime conductor q the two-point function in the Conrey-Snaith form (HEURISTIC), with zeta replaced by zeta_q(s) = zeta(s)(1 - q^-s) in the diagonal term, the factor (q/phi(q))^2 from the two factors 1/zeta_q in the swap term, and the products A, B over p != q, has the small-distance form 1 - sinc^2(u) - (4 Lambda_q/L^2) sin^2(pi u), L = log(qT/2pi), with

Lambda_q = gamma_0^2 + 2 gamma_1 + sum_p log^2 p/(p-1)^2 + sum_{p | q} log^2 p/(p-1),

that is 1.573151 for zeta and 2.220724 for q = 5. The test: the number of normalised gaps below 0.2 equals the CUE_Neff value with this constant. The constant is fixed by the Euler product; a function without Euler product has no such prediction, and the question was whether its on-line zeros follow the Euler-product value of its conductor anyway.

### 3.2 Result (MEASURED)
- Zeta, 856,513 small gaps in 1.04e8 zeros: 0.9498 of GUE; 0.9965 +- 0.0011 of CUE_Neff (the CUE_N gap law at non-integer N is the leading correction only); pair count against the full two-point formula 1.0004 +- 0.0011.
- L(chi) and L(chibar), 28,535 small gaps: 0.8378 of GUE; 1.0011 +- 0.0059 of CUE_Neff with Lambda_5; 0.9469 with zeta's constant. The conductor term log^2(5)/4 is confirmed at 0.6% and its absence rejected at 9 sigma. This is new relative to the node (which had zeta only).
- DH on-line zeros, 12,178 small gaps: 0.956 +- 0.009 of the conductor-5 value when the list is unfolded with the counting function of all zeros, 1.215 when it is unfolded with its own density. DHALT 0.841 and 1.597. MIX-5 (98.4% of zeros on the line): 0.856 and 0.892.
- HEAT: 1.68, 2.32, 2.03 (counting-function unfolding).

### 3.3 Small-gap exponent (near miss)
The Hill estimator k = n / sum log(0.2/s_i) over gaps s_i < 0.2 (gaps divided by the local mean gap of the same list, window 2001) does not use a counting function, a conductor or an unfolding.

| list | k | list | k |
|---|---|---|---|
| GUE gap law | 2.962 | DH | 2.069 +- 0.017 |
| zeta first 2e6 | 2.952 +- 0.025 | DHALT | 2.129 +- 0.016 |
| zeta 1e7 | 2.966 +- 0.017 | MIX-5 / 20 / 50 / 80 | 2.438 / 2.163 / 2.135 / 2.090 (+- 0.02) |
| zeta 1e8 .. 1e12 | 2.968, 2.973, 2.979, 2.966, 2.966 (+- 0.007) | HEAT -0.005 / -0.02 / -0.08 | 2.160 / 2.048 / 1.978 (+- 0.01) |
| CHI, CHIBAR | 2.972, 2.973 (+- 0.025) | battery HEAT -0.1 / -0.5 (below 2000, s < 0.3) | 2.01 +- 0.28 / 2.29 +- 0.23 |

Counts of gaps below 0.025: zeta at 1e12 310 against 342.5 (GUE); DH 200 against 30.7; HEAT -0.02 597 against 30.8.

Reason (standard): in a real one-parameter family whose zeros can leave the line, a pair of real zeros near a collision has gap proportional to the square root of the distance to the collision parameter, so a positive collision rate gives P(gap < s) ~ s^2. The cubic law of zeta and L(chi) says that this rate vanishes at the parameter value of the function itself.

Why it is not a survivor:
1. T-NR, WT and SGN-LIOU give the same value as zeta (section 2); EA is not formulable.
2. Size: DH separates at 3,000 to 10,000 on-line zeros (k = 1.68 +- 0.37 at 3,000; 1.77 +- 0.20 at 10,000; 2.00 +- 0.13 at 30,000), that is T about 3e3 to 9e3, where DH already has more than 100 off-line pairs; its first off-line zero is at T = 85.7. The separation does not come earlier than the off-line zeros.
3. It is a proportion statement. The quadratic regime of a backward heat step tau occupies gaps below about sqrt(abs(tau)), so a list of n zeros is blind to steps below about n^(-2/3); one off-line quadruple above the list is invisible. It restates, in density form, the count of Lehmer pairs (map row P31).
The running-minimum exponent is the extreme-value form of the same fact (n^(-1/k): -1/3 against -1/2): DH -0.546, HEAT -0.45 .. -0.63, zeta within the null band. The repo's -0.3953 against -1/3 is not a deviation: the null of independent gaps has standard deviation 0.058 at this length.

## 4. Combination 2: adjacent-box correlation and gap structure function

Test: r1 of the box counts for boxes of 100, 200, 300, 495.78, 700, 1000 mean spacings; C(r) = 1 - S_2(r)/(2 var) for r up to 1e4 on gaps normalised by the local mean (window 2001).

Result (MEASURED).
- Zeta: r1 between -0.61 and -0.35 over the seven ranges and six box lengths (standard error 0.005 to 0.03); the repo value -0.5126 at T = 1.5e5 is inside. Box-count variance 0.36 to 0.59 against 0.81 to 1.05 for GUE: the number variance is saturated at these lengths, the box count is a difference of two nearly independent values of S(t), and r1 = -1/2 up to the correlation of S at lag one box, which oscillates with height. A jittered rigid lattice has r1 = -1/2 exactly. So r1 at these lengths does not distinguish zeta from a rigid lattice; the palm-mirror lattice null is not rejected by it.
- L(chi), L(chibar): -0.53 .. -0.47. Inside the band.
- DH: -0.05 .. +0.01 with the counting-function unfolding; box-count variance 9.4 at length 100 and 80 at length 1000. With local unfolding at length 100 and 200: -0.10 and -0.16 (zeta: -0.41 .. -0.61). DHALT, MIX and HEAT the same (-0.12 .. +0.26). MIX-5, with 1.6% of zeros off the line, already has variance 3.0 at length 100.
- C(1): zeta -0.349 .. -0.327, chi -0.383; DH -0.152, DHALT -0.076, HEAT -0.301 / -0.163 / -0.028, MIX-5 -0.336. C(r) for 100 <= r <= 1e4: root mean square 1e-3 for chi and DH (noise 7e-4), 0.01 to 0.03 in the high zeta blocks (the prime oscillations of a stationary block).

Classification: CLOSED. The controls with off-line zeros leave the band because the number of missing zeros per box fluctuates (variance of the order of its mean); this is the difference between the count of sign changes and the Riemann-von Mangoldt count, the quantity a Turing-type verification computes. T-NR, WT and SGN-LIOU are identical to zeta.

## 5. Combination 3: CMV detector and recovered coefficients

### 5.1 Verblunsky sequence (MEASURED, midpoint multiprecision; two precisions agree in all printed digits)
C(w) = Xi'/Xi(1/2 + a(1+w)/(1-w)) = c_0 + 2 sum c_n w^n; Toeplitz matrix [c_|i-j|]; N_det = first order with abs(alpha_N) >= 1. Ball arithmetic loses about n^2 bits in the Levinson recursion and stops near order 50 at 3000 bits; the runs use midpoints at 4000 and 6000 bits (8000 and 12000 for zeta and the character product at a = 8, where the 4000-bit run gave a false detection at order 389).

| object | lowest off-line zero | N_det, a = 20 | N_det, a = 8 |
|---|---|---|---|
| zeta | none known | none to 400 (min 1 - abs(alpha) = 2.8e-3) | none to 400 (4.5e-4) |
| xi(chi) xi(chibar) | none known | none to 400 | none to 400 |
| DH | 0.8085 + 85.70 i | 152 | 149 |
| zeta, zero 23 (84.74) replaced by a quadruple at distance 0.3085 | | 91 | 89 |
| zeta, zero 24 (87.43), same | | 96 | 94 |
| T-NR | 0.9038 + 2.86 i | 15 | 7 |
| EA 1/8, 1/4, 1/2 | 1/2 + a + 14.13 i | 12, 11, 10 | 8, 7, 7 |

DH passes Verblunsky positivity at every order below 149 (a = 8) or 152 (a = 20); 149 is also the order of the first negative Pick pivot of DH (map row 18). No relation among Verblunsky coefficients below the detection order expresses multiplicativity: each moment is the archimedean term minus sum over n of c(n) n^(-1/2-a) times a polynomial in log n, so with a = 20 the coefficient c(6) enters every moment with weight 6^(-20.5), and the only sharp finite statement is abs(alpha_n) < 1.

### 5.2 Coefficients from zeros (MEASURED)
c^(n) = -sqrt(n) sum_gamma w(gamma) e^(i gamma log n) / ((1/2pi) int w), w a cos^4 window over the list. By the explicit formula this is c(n) up to window leakage when the list contains every zero.
- Zeta: c^(n) = Lambda(n) at the sampled n <= 37 within 3e-7 of 6-digit reference values for the first 2e6 zeros and within 2e-5 in every block; c^(6) between 1e-12 and 3e-6 in absolute value.
- L(chi): c^(2) = 0.6931 i, c^(4) = -0.6931, c^(6) = 0, c^(11) = 2.398.
- DH, all zeros below 2000 (1861 on-line and 84 pairs): c(2) = 0.19691, c(4) = -1.44223, c(6) = 1.93635; the Euler relations c(6) = 0 and c(4) log 2 = c(2)^2 fail (the second by -1.0385).
- DH, on-line zeros only: below 2000 c(2) = -0.310, c(6) = 0.852; to 1e6 c(2) = -0.689, c(4) = -0.474, c(6) = -0.377, c(11) = 2.075 (exact 2.398). The off-line pairs carry a part of order 1 of every coefficient. The node statement "both off-line pairs together contribute 7e-7" holds only below height 130; at height 2000 and above the on-line list does not determine c(n).
- HEAT: c^(2) = 0.662, 0.480, 0.030 and c^(6) = 0.004, 0.021, 0.051 for tau = -0.005, -0.02, -0.08.

Classification: CLOSED. The relation separates DH and HEAT from a list shorter than the first off-line zero would require (node statement, not recomputed here: c(2) and c(4) are recovered from the zeros of DH below 130 with the two off-line pairs contributing 7e-7 and 1.7e-4), so it does not depend on resolving zeros; but it is the statement "the Dirichlet coefficients are multiplicative" (map row 33), and T-NR, EA and the sign twists pass it.

## 6. Combination 4: Gram matrices

### 6.1 Pairing (PROVED)
T(u, v) = a (v - u) R(abs(v - u)) H is real and antisymmetric for every real kernel, since R depends on abs(v - u) only. The nonzero eigenvalues of a real antisymmetric matrix are pairs +- i sigma, so S = T^T T = -T^2 has each sigma^2 with even multiplicity. The equality lambda_9 = lambda_10 (and of every pair) is therefore exact for every kernel, and the measured spread is rounding. Measured at N = 1200 and 2400 for the repo kernel, for odd theta kernels with CHI5R and DH coefficients and for a random kernel: all spreads <= 1.2e-14. The node has no arithmetic content.

### 6.2 lam_min of the Nyman-Beurling Gram (MEASURED, float64)
For a Dirichlet series F with bounded summatory function A(x), F(s) h^(-s)/s is the Mellin transform of A(x/h), so
G(h, k) = (1/2pi) int abs(F(1/2+it))^2 (k/h)^(it) (hk)^(-1/2) dt/(1/4 + t^2) = int_0^inf A(x/h) conj(A(x/k)) dx/x^2.
For coefficients of period 5 with sum zero and coprime h, k (PROVED here, checked against direct summation to 6.7e-16):
G(h, k) = -(1/(5hk)) [ U(h, k) + conj U(k, h) - sum_{j=1..4} a(kj) conj(a(hj)) psi(j/5) ],
U(h, k) = sum_{n=1..5k} a(n) psi(n/(5k)) conj(A(floor(hn/k))), and G(dh, dk) = G(h, k)/d.
The target vector is <1_{x>=1}, A(x/n)> = F(1)/n, and d_N^2 = 1 - abs(F(1))^2 v* G^-1 v, v_n = 1/n. For zeta the matrix is Vasyunin's and the target is (log n + 1 - gamma)/n.

| object | lam_min at N = 1000 | 3000 | 6000 | 10000 | p (N >= 1000) | R^2 | d_N^2 at the largest N |
|---|---|---|---|---|---|---|---|
| ZETA | 1.4318e-6 | 1.7561e-7 | 4.6508e-8 | 1.7315e-8 | 1.9216 | 0.99998 | 0.004899 |
| CHI | 1.4916e-6 | 1.7694e-7 | 4.6569e-8 | 1.7242e-8 | 1.9380 | 0.999995 | 0.01861 |
| CHI5R | 1.4990e-6 | 1.7792e-7 | 4.6510e-8 | 1.7209e-8 | 1.9390 | 0.999996 | 0.01525 |
| DH | 1.1753e-6 | 1.4052e-7 | 3.6876e-8 | 1.3733e-8 | 1.9316 | 0.999999 | 0.01968 |
| DHALT | 1.1374e-5 | 1.3924e-6 | | | 1.9158 | 0.99995 | 0.786 (N = 3000) |
| PER | 2.0259e-6 | 2.4615e-7 | | | 1.9203 | 0.999997 | 0.1009 (N = 3000) |
| T-NR (rows m, 3m, 9m of the zeta matrix) | 8.123e-6 | | | | 1.96 (N <= 1111) | 0.9997 | 0.1850 (N = 1111) |

- The exponent is the same within 0.02 for zeta, both characters, DH, DHALT, PER and (to N = 1111) T-NR. It does not change at any N for any control. It is a property of the weight 1/abs(s)^2 and of the mean size of F on the line.
- Correction to the node: the repo values of lam_min are 0.06% to 1.4% above the LAPACK values of the same matrix (the matrix is the same: d_N^2 agrees to 12 digits; five repo values, at N = 4500, 6000, 7000, 9000, 10000, lie above the second eigenvalue found here). With the LAPACK values the exponent on the repo's 12 rungs is 1.9207 (repo 1.9179).
- d_N^2 is the quantity that sees zeros. It stops decreasing for T-NR (0.204 at N = 100, 0.185 at 1111), PER (0.101) and DHALT (0.79), whose zeros to the right of the line are low. For DH it is 0.0197 at N = 1e4 and still decreasing, next to 0.0186 for L(chi). DH is entire, so its limit is 1 - abs(B(1))^2 with B the Blaschke product of its zeros in Re s > 1/2: 3.7e-4 from the 84 pairs below 2000. d_N^2 log N is 0.155 at N = 100 and 0.181 at N = 1e4, so the decay is not faster than a constant over log N and reaching that floor needs log N of several hundred. The Nyman-Beurling distance is Euler-blind at every size that can be computed.

Classification: CLOSED. The pairing is algebraic; the exponent persists for every control; the distance separates only once the off-line zeros are resolved.

## 7. Survivors

None.

Results worth entering as nodes:
1. Small-gap exponent of on-line zeros: 2.97 for zeta (seven height ranges, 1.04e8 zeros) and L(chi) (4.0e6 zeros), 2.0 to 2.4 for DH, DHALT, mixtures and backward heat lists; unfolding-free; blind to T-NR by section 2.
2. Conductor term of the small-gap constant: Lambda_q = Lambda + sum_{p | q} log^2 p/(p-1), measured for q = 5 at 0.6%.
3. Closed form of the Nyman-Beurling Gram for periodic coefficients (section 6.2) and the values to N = 1e4 for chi mod 5 and DH.
4. DH: CMV detection order 149 (a = 8) and 152 (a = 20), against 89 to 96 for an isolated quadruple at the same height.
5. Corrections: the fifth-pair degeneracy is algebraic; the repo lam_min rungs are not converged eigenvalues; the running-minimum exponent -0.3953 is inside the null band; the on-line zeros of DH do not determine its coefficients above height about 130.

## 8. Weakest steps

1. HEAT at scale is the Riemann-Siegel model of lane b-dyson-defect run at negative tau (validated there for positive tau against the Dyson equation); the exact heat tables reach only height 2000 (1435 and 929 on-line zeros), where the exponent is 2.0 +- 0.3 and 2.3 +- 0.2.
2. The two-point formula for conductor 5 is derived from the ratios-conjecture recipe, not proved; the data agree with it at 0.6%. The CUE_N gap law at non-integer N is the leading correction only (zeta sits 3 sigma below it; the full two-point formula fits).
3. Gram eigenvalues and Levinson recursions are float64 and midpoint multiprecision, not interval enclosures. Checks: entries against mpmath, d_N^2 against the repo to 12 digits, two independent builds, two precisions. The CMV row (zero 20, delta 0.4) differs from the repo (81 against 96). The zeta blocks stop at 1e12. WT and EA were not run in the Gram and CMV tests where marked.

## 9. Files

- `code/`: all scripts named in section 1; `run_cmv.sh`, `run_lists.sh`.
- `out/`: `zstats_zeta.json`, `zprofile_zeta.json`, `zstats_LZ.json`, `zstats_heat.json`, `extras_LZ.json`, `extras_zeta_heat.json`, `cmv/*.json`, `gram_zeta_10000_rows.jsonl`, `gram_periodic_10000_rows.jsonl`, `gramcpu_10000_per_CHI5_DH_CHI5R.json`, `gramcpu_3000_ladder_CHI5R_DH_DHALT_PER.json`, `LZ_AB.npz` (zero lists to 3e5).
- `chat_battery.json`, `fifth_pair_local.json`, `local_checks.json`: local runs.
- Server, `~/rh-push/s1-zero-statistics-gram/out/` (6.5 GB): sample files `LS_A/B/C.npz`, zero lists `LZ.npz` (8 objects to T = 1e6), heat lists, Gram matrices `G_*_10000.npy` and `G_*_3000.npy`.
- Units: all units of this lane have exited; none is running. Two units failed and were replaced: the first zeta Gram build (GPU 1 was full; rebuilt on CPU) and the zeta ladder (crash in the fit after all rows were printed; rows taken from the log).
