# s3-truncated-euler-strip: screening of four truncated-Euler-product combinations against the controls

Date 2026-11-19/20. Screening arm. Four combinations tested, zero survivors. Labels: PROVED (elementary, written here), CLASSICAL, MEASURED (float accumulation; precision per section 7), RECONSTRUCTED (definition rebuilt from a one-line source).

## 1. Verdict

| # | combination (nodes) | statistic | sizes reached | zeta | comparison L-function | controls | classification |
|---|---|---|---|---|---|---|---|
| 1 | h5-euler-products-bounded + harmonic-strip-transport + poisson-prime-tail-energy | (c) D_sigma(Y) = sum_{p<=Y} p^-sigma - int_2^Y u^-sigma du/log u, sigma in {0.51, 0.55, 0.6, 0.75}, one-sided (bounded above); (b) M(Y) = sup over K of v_Y(s) = Re[sum_{p<=Y} p^-s - E_Y(s)], K sampled on sigma in {0.55, 0.7, 0.9}, t in [0, 100] step 0.25 | primes to 1e+13 (346 065 536 839 primes), 59884 checkpoints Y (2048 per unit of log Y) | (c) bounded above at every Y: sup is the Y = 2 value (0.70 at sigma = 0.51); D decreases to its limit, tail exponent theta_eff = 0.51 to 0.53. (b) M(Y) in [1.50, 1.78], sup at Y = 16 | chi_4, chi_3, chi_5: bounded on both sides, theta_eff 0.47 to 0.51; M(Y) of chi_4 in [1.31, 1.73] | Sign twist, Liouville on primes, Cramer model: bounded (pass). THIN, DEL (real zero at 0.8): (c) passes at every Y (D tends to minus infinity, -789 at sigma = 0.51 and Ymax), although the function vanishes at 0.8; (b) fails, M = 4.7 at Y = 1e6 and 56.1 at Ymax, at t between 1 and 1.75 next to the real zero. T-NR q = 3: fails from Y = 3. T-NR q = 1000003: identical to zeta below Y = q, never exceeds the initial sup in the range. E_a: passes (c) in the range with its own poles removed. DH: envelope grows from Y about 1e6 at the rate of its lowest off-line pair | CLOSED: linear functional of the zeros with kernel Y^(rho-sigma)/((rho-sigma) log Y); a control fails exactly when its own zero (or non-tempered local factor) becomes visible in that kernel; the one-sided real form does not see real zeros at all |
| 2 | first-radix-layer-criterion + prime-square-pole-recurrence + prime-square-remainder-c3 | R(N) = sum_{p<=N} [C_p(N) - (N-p)] log p, C_p(N) = floor(N/p)(p - 1 - (N mod p)); r(N) = R(N)/N^(3/2) | N <= 1e11 (1741 values of N, 64 per octave to 1e10, 16 per octave above; 4 118 054 813 primes) | r(N) > 0 for every grid N > 2209; r in [0.1650, 0.2131] for N >= 1e8 (RH band [0.1337, 0.2261]) | chi_4 with the kernel twisted by chi_4: r in [0.79, 0.98] for N >= 1e7, no sign change. chi_4 weights in the integer kernel: 395 sign changes | Random sign: 264 sign changes, rms 0.40 N^(3/2) sqrt(log N). Liouville on primes: -R, negative at every N > 2209. Cramer model: 9 to 15 sign changes in 33 values. THIN, DEL: pass, R = +0.0783 N^1.8 (they are not RH). T-NR q = 3: fails from the first N. T-NR q = 1000003: fails only from N = q, back above zero by N = 1e11. DH: no positive bias, 86 and 252 sign changes below 1e8 | CLOSED: R(N) = [N^2/2 - theta_1(N)] + [zero-free carry term]; the zero part is the functional of s1-prime-tents-controls row 4 (kernel 1/(rho(rho+1))). The carry kernel is sign-indefinite (decided, section 4.2) |
| 3 | zv-divisor-cosine-euler-product + zv-prime-mode-mixer + gauss-plancherel-alias-lemma | E_X(t) = sum_{N<=X} a(N) tau_t(N) N^(-1/2) w(N), tau_t(N) = N^(-it/2) D_N(2t) = sum_{d divides N} d^(-it), t = xi/2; ratio = mean square at on-line zeros / mean square at 1e5 bulk points | X = 1e6, 1e8, 1e10; 1517 zeta zeros, 1861 on-line DH zeros (height <= 2000), 868 zeros of L(s, chi_4) (height <= 1000), 1e5 bulk points in [10, 2000] | ratio 6.7e-12 at X = 1e8, 6.7e-16 at X = 1e10 (rms at zeros 4.4e-9 to 1.2e-7, proportional to t/X) | chi_4 at its own zeros: 3.1e-10, 3.1e-14 | T-NR (q = 3, c = 2.2, zeros off the line at Re s = 0.904): 1.2e-10, 1.2e-14: passes exactly as zeta. E_a: no on-line zeros, test empty. DH at its own on-line zeros: 0.0210 at both X (does not vanish). THIN at zeta's zeros: 0.35, 0.19, 0.10 (X = 1e6, 1e8, 1e10). Random multiplicative sign: 0.6 to 0.8 | CLOSED: the statistic equals F(1/2) F(1/2 + it) for every completely multiplicative a with a functional equation; it detects complete multiplicativity of the coefficients and the value of F on the line; a multiplicative control with off-line zeros (T-NR) passes at every X |
| 4 | euler-product-resolves-window + mv-cap-function-side-gap + window-edge-depth-requirement | d(c) = min over window modifications W of sup_t abs(log zeta_W - log zeta)(sigma + it), against the truncation error abs(log zeta - log P_Y)(sigma + ic), sigma in {3, 2, 1.5, 1.1} | d: c = 1e3 to 1e50 (lattice model of the zeros) and at the zeta zeros near 1e3 and 1e5; up to 24 neighbouring zeros moved; truncation: primes to 1e9 at c = 1e3 to 1e12 | upper bounds for d (eta = 0.1, sigma = 2): 6.4e-2, 4.5e-4, 1.0e-5, 4.5e-7 at c = 1e3, 1e6, 1e9, 1e12: d <= C c^(-0.50); truncation error at sigma = 2: 5e-6 (Y = 1e3), 2e-7 (1e4), 1.4e-10 (1e6), the same at every c | not run (same statement) | DH: pinned in the same way by its own Dirichlet series with its zero off the line (margin 0.149 against truncation 1.6e-4 with 100 terms at sigma = 2). T-NR: same | CLOSED: a separation that exists only to the right of 1, and one that every control with an absolutely convergent series satisfies for itself; it reads the function, not the position of its zeros |

No survivor. In each case every control either passes, or fails at the size at which the explicit formula shows its own zero, its non-tempered local factor, or the absence of the prime-square term. Controls that are not RH and pass a statement that is RH-equivalent for zeta: THIN and DEL (rows 1(c) and 2, at every size), E_a and T-NR with q = 1000003 (row 1(c), at every size reached), T-NR (row 3, at every X).

Novel elements against the map (`OBSTRUCTION_MAP.md`) and `s1-prime-tents-controls`: (i) the one-sided real form H5(c) and the first-radix inequality are both blind to real zeros, with the sign fixed by the kernel (Lemmas 1 and 3); (ii) the identity R(N) + theta_1(N) - N^2/2 = zeta(1/2) N^(3/2)/3 + lower order (zero-free; measured to 1e11); (iii) the T-NR pass of the divisor-cosine test at every X; (iv) measured upper bounds for the window margin d(c), decaying as a power of c.

## 2. Controls and parameters used

- zeta; chi_4, chi_3 (real), chi_5 with chi_5(2) = i (complex), as positive comparisons.
- Sign twist: eps_p = +-1 from a fixed 64-bit hash of p (SplitMix64 finaliser, top bit). Liouville weights: lambda(p) = -1 on primes.
- THIN, DEL (thin sets, b = 0.8): S1 = {p: u_p < (1/2) p^(b-1)}, S2 = {p: u_p < p^(b-1)}, u_p uniform in [0, 1) from the same hash (S1 inside S2). THIN: eps(p) = -1 on S1; DEL: primes of S2 deleted. These are random sets with the prescribed density, not the greedy floor rule of the map; the density gives F = zeta(s)(s - b) W(s) with W analytic and non-vanishing for Re s > b/2 almost surely (the random part of sum_{p in S} p^-s converges there). Label: MEASURED for the stated density, ARGUED for the zero.
- T-NR: zeta(s)(1 + c sqrt(q) q^-s + q q^-2s) = zeta(s)(1 - alpha q^-s)(1 - beta q^-s), alpha = -q^(1/2+b_q), beta = -q^(1/2-b_q), b_q = arccosh(c/2)/log q; log-coefficients -(alpha^k + beta^k)/k at q^k, Lambda-coefficients -(alpha^k + beta^k) log q. Cases (q, c) = (3, 2.2) (zeros at Re s = 0.9038), (3, 2.02) (Re s = 0.629), (1000003, 2.2) (Re s = 0.532).
- E_a = zeta(s + a) zeta(s - a), a = 0.15.
- DH: a(n) periodic mod 5 = (1, kappa, -kappa, -1, 0), kappa = 0.2840790438; Lambda_DH by Dirichlet inversion to 1e8 (code after `s1-prime-tents-controls/dh.c`; check -f'/f(3) to 15 digits).
- Cramer model: each integer n >= 3 selected independently with probability 1/log n; 4 seeds to 1e9.
- HEAT (backward heat family): not an ordinary Dirichlet series; none of the four statistics is defined for it. Not run.
- U (unimodular twist p^(-i alpha)): combination 1(b) evaluates zeta's own statistic at s + i alpha, so U with alpha <= 100 is contained in the K-scan; combinations 2 and 3 not run for U (2: same class as the sign twist; 3: U has zeta's zeros translated, the statistic at translated ordinates is the zeta row).

## 3. Combination 1: H5, corrected Euler products bounded above

Source: `formalization/rh-attempts/2026-11-01-r2-harmonic-floor.md`, Theorem H5 (equivalent: RH; sup over Y and over compact K in sigma > 1/2 of u_Y(s) < infinity; for every real sigma in (1/2, 1) sup_Y D_sigma(Y) < infinity). u_Y(s) = log abs(zeta_Y(s)) - Re E_Y(s), E_Y(s) = int_2^Y u^-s du/log u = Ei((1-s) log Y) - Ei((1-s) log 2).

### 3.1 Finite consequence and survival rule

Consequence tested: for zeta the running sup of D_sigma(Y) and of M(Y) = sup_K v_Y stays bounded as Y grows; for a control with a zero at beta + i gamma, beta > sigma, the upper envelope should grow as Y^(beta - sigma)/log Y. v_Y(s) = Re[sum_{p<=Y} a_p p^-s] - Re E_Y(s) is used in place of u_Y; u_Y - v_Y = Re sum_{p<=Y} sum_{k>=2} a_p^k p^(-ks)/k converges uniformly on K (sigma >= 0.55), so boundedness is the same statement. The pole term E_Y is removed in the same form from every family with a pole at 1 (zeta, THIN, DEL, T-NR) and from no other.

Survival would be: zeta bounded, and every control unbounded from a size Y much smaller than the explicit formula with its lowest off-line zero gives, or unbounded for a reason that is not a zero.

### 3.2 Reduction (CLASSICAL, with one PROVED remark)

Lemma 1 (explicit formula, CLASSICAL). Let log F(s) = sum b(n) n^-s for Re s > 1, F meromorphic in Re s > sigma_0 with a pole of order m at 1 and zeros rho of multiplicity m_rho. For sigma_0 < sigma < 1,
  sum_{n<=Y} b(n) n^-sigma - m E_Y(sigma) = C_F(sigma) - sum_rho m_rho Ei((rho - sigma) log Y) + (terms from Re s <= sigma_0), Ei(z log Y) = Y^z/(z log Y)(1 + O(1/(abs(z) log Y))).

Remark (PROVED from Lemma 1). The sign of a zero's contribution is negative. A real zero b > sigma contributes -Y^(b-sigma)/((b-sigma) log Y), which tends to minus infinity: the one-sided statistic (c) is not violated by a real zero. A pair beta +- i gamma contributes -2 Re[Y^(rho-sigma)/((rho-sigma) log Y)], of both signs, and exceeds a baseline B only when Y^(beta-sigma) > B abs(rho - sigma) log Y / 2. Hence: (c) is a statement about non-real zeros only (for zeta the real segment is covered by zeta(sigma) != 0 on (0, 1), CLASSICAL), and the size at which (c) or (b) reacts to a zero is Y about (abs(gamma) log Y)^(1/(beta-sigma)), polynomial in gamma. For beta = 1, sigma = 0.51 and Y = 1e13 this is gamma <= 8e4, against the verified height 3e12.

### 3.3 Implementation and validation

`h5sieve.c`: segmented sieve (OpenMP); per prime it adds p^-sigma (five real sigma, ten families) and the centred log-moments p^-sigma (log p - c_j)^k, k = 0..5, for sigma in {0.55, 0.7, 0.9} and five families, into blocks of width 1/2048 in log p. sum a_p p^-(sigma+it) over a block is e^(-i t c_j) sum_k (-it)^k M_k/k!, with relative error below 3e-13 for t <= 100. Disjoint prime ranges add block by block. `h5an.py`: cumulative sums in 80-bit, Ei by mpmath (40 digits) on the real axis and scipy exp1 off it.

Known answers: (i) block sums and the moment reconstruction against a direct numpy sum over all primes to 1e7 and to 3e8 (two ranges added): worst relative difference 1.1e-15 (real columns), 6e-14 (complex); (ii) prime counts 664 579 (1e7), 50 847 534 (1e9), 16 252 325 (3e8, as two ranges, aligned and not aligned to the task size, and as a signed sum of three tables) and the server counts of section 7; (iii) convergence of v_Y(s) to the continued limit Re[P(s) + Ei((1-s) log 2)] (P the prime zeta function, mpmath): table at the end of 3.4.

### 3.4 Results (MEASURED)

Ymax = 9.99988e+12 (X = 10000000000000)

sigma = 0.51

| family | Y = 1e4 | Y = 1e6 | Y = 1e8 | Y = 1e10 | Y = 1e12 | Y = Ymax | sup over 2 <= Y <= Ymax | inf |
|---|---|---|---|---|---|---|---|---|
| zeta: sum p^-s - E | -1.0386 | -1.2834 | -1.3953 | -1.4649 | -1.5511 | -1.5795 | 0.7008 (Y = 2) | -1.5903 (Y = 6.12e+12) |
| Liouville on primes: -(zeta row) | 1.0386 | 1.2834 | 1.3953 | 1.4649 | 1.5511 | 1.5795 | 1.5903 (Y = 6.12e+12) | -0.7008 (Y = 2) |
| chi_4 | -0.9731 | -1.2379 | -1.2913 | -1.4078 | -1.4899 | -1.5014 | 0.0000 (Y = 2) | -1.5229 (Y = 7.45e+12) |
| chi_3 | -1.2865 | -1.4898 | -1.6364 | -1.7593 | -1.8225 | -1.8572 | -0.7022 (Y = 2) | -1.8657 (Y = 8.98e+12) |
| Re chi_5 | 0.2014 | 0.2005 | 0.1886 | 0.1815 | 0.1692 | 0.1792 | 0.3490 (Y = 331) | -0.1079 (Y = 29) |
| Im chi_5 | 0.3138 | 0.2872 | 0.3264 | 0.3117 | 0.3392 | 0.3121 | 0.7022 (Y = 2) | 0.1312 (Y = 3) |
| random sign eps_p | -1.0200 | -0.9499 | -1.0762 | -0.7399 | -1.2424 | -1.6365 | 0.9739 (Y = 11) | -1.6653 (Y = 9.84e+12) |
| THIN b = 0.8 | -9.0770 | -20.8722 | -53.1381 | -148.7823 | -446.7641 | -789.1429 | 0.7008 (Y = 2) | -789.1429 (Y = 1e+13) |
| DEL b = 0.8 | -9.6163 | -21.5725 | -53.7931 | -149.3992 | -447.3372 | -789.7286 | -0.0014 (Y = 2) | -789.7286 (Y = 1e+13) |
| thin set S1, own main term removed | -0.3646 | -0.4731 | -0.4729 | -0.4234 | -0.4175 | -0.4130 | 0.4318 (Y = 5) | -0.5384 (Y = 4.88e+06) |
| T-NR q = 3, c = 2.2 | -1.9083 | -8.6368 | -37.4384 | -170.0377 | 1187.3904 | 2614.8579 | 2614.8681 (Y = 8.03e+12) | -1761.1106 (Y = 6.12e+12) |
| T-NR q = 3, c = 2.02 | 0.1480 | -0.1127 | -0.2774 | -0.4379 | 0.3730 | 0.4550 | 2.5610 (Y = 3) | -0.8059 (Y = 6.12e+12) |
| T-NR q = 1000003, c = 2.2 | -1.0386 | -1.2834 | 0.5208 | 0.4513 | 0.3650 | -0.7406 | 0.7008 (Y = 2) | -1.2871 (Y = 9.97e+05) |

sigma = 0.55

| family | Y = 1e4 | Y = 1e6 | Y = 1e8 | Y = 1e10 | Y = 1e12 | Y = Ymax | sup over 2 <= Y <= Ymax | inf |
|---|---|---|---|---|---|---|---|---|
| zeta: sum p^-s - E | -0.8673 | -1.0226 | -1.0802 | -1.1110 | -1.1429 | -1.1519 | 0.6816 (Y = 2) | -1.1553 (Y = 6.12e+12) |
| Liouville on primes: -(zeta row) | 0.8673 | 1.0226 | 1.0802 | 1.1110 | 1.1429 | 1.1519 | 1.1553 (Y = 6.12e+12) | -0.6816 (Y = 2) |
| chi_4 | -0.8634 | -1.0308 | -1.0574 | -1.1089 | -1.1379 | -1.1412 | 0.0000 (Y = 2) | -1.1478 (Y = 7.45e+12) |
| chi_3 | -1.1876 | -1.3235 | -1.4040 | -1.4582 | -1.4807 | -1.4915 | -0.6830 (Y = 2) | -1.4941 (Y = 8.98e+12) |
| Re chi_5 | 0.1775 | 0.1744 | 0.1667 | 0.1631 | 0.1590 | 0.1622 | 0.2967 (Y = 331) | -0.0875 (Y = 29) |
| Im chi_5 | 0.3113 | 0.2972 | 0.3197 | 0.3137 | 0.3237 | 0.3152 | 0.6830 (Y = 2) | 0.1365 (Y = 3) |
| random sign eps_p | -0.7829 | -0.7210 | -0.8040 | -0.6593 | -0.8367 | -0.9594 | 0.8865 (Y = 11) | -1.0306 (Y = 3.24e+07) |
| THIN b = 0.8 | -7.4479 | -14.8048 | -31.4904 | -72.6012 | -179.0751 | -286.8978 | 0.6816 (Y = 2) | -286.8978 (Y = 1e+13) |
| DEL b = 0.8 | -7.9107 | -15.3641 | -32.0253 | -73.1205 | -179.5785 | -287.4053 | -0.0014 (Y = 2) | -287.4053 (Y = 1e+13) |
| thin set S1, own main term removed | -0.2898 | -0.3541 | -0.3558 | -0.3351 | -0.3331 | -0.3318 | 0.4049 (Y = 5) | -0.4020 (Y = 563) |
| T-NR q = 3, c = 2.2 | -1.0703 | -4.7277 | -17.9132 | -69.0579 | 389.0386 | 784.3885 | 784.3916 (Y = 8.03e+12) | -551.5401 (Y = 6.12e+12) |
| T-NR q = 3, c = 2.02 | 0.3365 | 0.1934 | 0.1298 | 0.0825 | 0.3716 | 0.3807 | 2.4561 (Y = 3) | -0.0043 (Y = 6.12e+12) |
| T-NR q = 1000003, c = 2.2 | -0.8673 | -1.0226 | 0.0224 | -0.0084 | -0.0403 | -0.4060 | 0.6816 (Y = 2) | -1.0248 (Y = 9.97e+05) |

sigma = 0.6

| family | Y = 1e4 | Y = 1e6 | Y = 1e8 | Y = 1e10 | Y = 1e12 | Y = Ymax | sup over 2 <= Y <= Ymax | inf |
|---|---|---|---|---|---|---|---|---|
| zeta: sum p^-s - E | -0.6948 | -0.7832 | -0.8083 | -0.8195 | -0.8288 | -0.8309 | 0.6584 (Y = 2) | -0.8317 (Y = 6.12e+12) |
| Liouville on primes: -(zeta row) | 0.6948 | 0.7832 | 0.8083 | 0.8195 | 0.8288 | 0.8309 | 0.8317 (Y = 6.12e+12) | -0.6584 (Y = 2) |
| chi_4 | -0.7516 | -0.8466 | -0.8576 | -0.8762 | -0.8842 | -0.8848 | 0.0000 (Y = 2) | -0.8863 (Y = 7.45e+12) |
| chi_3 | -1.0833 | -1.1655 | -1.2036 | -1.2233 | -1.2295 | -1.2320 | -0.6598 (Y = 2) | -1.2325 (Y = 8.98e+12) |
| Re chi_5 | 0.1530 | 0.1494 | 0.1451 | 0.1436 | 0.1425 | 0.1434 | 0.2446 (Y = 71) | -0.0663 (Y = 29) |
| Im chi_5 | 0.3068 | 0.3007 | 0.3119 | 0.3100 | 0.3128 | 0.3108 | 0.6598 (Y = 2) | 0.1425 (Y = 3) |
| random sign eps_p | -0.5691 | -0.5221 | -0.5684 | -0.5176 | -0.5660 | -0.5946 | 0.7866 (Y = 11) | -0.6618 (Y = 3.24e+07) |
| THIN b = 0.8 | -5.9132 | -10.0073 | -17.3524 | -31.7152 | -61.2417 | -86.7036 | 0.6584 (Y = 2) | -86.7036 (Y = 1e+13) |
| DEL b = 0.8 | -6.3001 | -10.4450 | -17.7789 | -32.1365 | -61.6585 | -87.1215 | -0.0013 (Y = 2) | -87.1215 (Y = 1e+13) |
| thin set S1, own main term removed | -0.2147 | -0.2481 | -0.2499 | -0.2429 | -0.2423 | -0.2421 | 0.3735 (Y = 5) | -0.2956 (Y = 563) |
| T-NR q = 3, c = 2.2 | -0.3629 | -2.0245 | -6.8687 | -22.0704 | 96.7269 | 174.3901 | 174.3908 (Y = 8.03e+12) | -128.7683 (Y = 6.12e+12) |
| T-NR q = 3, c = 2.02 | 0.5062 | 0.4403 | 0.4247 | 0.4184 | 0.4994 | 0.4967 | 2.3312 (Y = 3) | 0.0047 (Y = 3) |
| T-NR q = 1000003, c = 2.2 | -0.6948 | -0.7832 | -0.2557 | -0.2669 | -0.2761 | -0.3679 | 0.6584 (Y = 2) | -0.7843 (Y = 9.97e+05) |

sigma = 0.75

| family | Y = 1e4 | Y = 1e6 | Y = 1e8 | Y = 1e10 | Y = 1e12 | Y = Ymax | sup over 2 <= Y <= Ymax | inf |
|---|---|---|---|---|---|---|---|---|
| zeta: sum p^-s - E | -0.3597 | -0.3766 | -0.3787 | -0.3792 | -0.3795 | -0.3795 | 0.5934 (Y = 2) | -0.3795 (Y = 6.12e+12) |
| Liouville on primes: -(zeta row) | 0.3597 | 0.3766 | 0.3787 | 0.3792 | 0.3795 | 0.3795 | 0.3795 (Y = 6.12e+12) | -0.5934 (Y = 2) |
| chi_4 | -0.5265 | -0.5446 | -0.5453 | -0.5462 | -0.5464 | -0.5464 | 0.0000 (Y = 2) | -0.5464 (Y = 7.45e+12) |
| chi_3 | -0.8589 | -0.8772 | -0.8813 | -0.8823 | -0.8824 | -0.8825 | -0.5946 (Y = 2) | -0.8937 (Y = 5) |
| Re chi_5 | 0.1022 | 0.1004 | 0.0998 | 0.0997 | 0.0997 | 0.0997 | 0.1656 (Y = 11) | -0.0243 (Y = 29) |
| Im chi_5 | 0.2892 | 0.2890 | 0.2904 | 0.2903 | 0.2904 | 0.2904 | 0.5946 (Y = 2) | 0.1559 (Y = 3) |
| random sign eps_p | -0.2368 | -0.2219 | -0.2285 | -0.2262 | -0.2272 | -0.2276 | 0.5411 (Y = 11) | -0.5946 (Y = 2) |
| THIN b = 0.8 | -3.2819 | -4.0065 | -4.6497 | -5.2784 | -5.9247 | -6.2622 | 0.5934 (Y = 2) | -6.2622 (Y = 1e+13) |
| DEL b = 0.8 | -3.5289 | -4.2611 | -4.9032 | -5.5317 | -6.1778 | -6.5154 | -0.0012 (Y = 2) | -6.5154 (Y = 1e+13) |
| thin set S1, own main term removed | -0.0746 | -0.0792 | -0.0796 | -0.0794 | -0.0794 | -0.0794 | 0.2928 (Y = 5) | -0.2404 (Y = 3) |
| T-NR q = 3, c = 2.2 | 0.5718 | 0.4719 | 0.3087 | 0.0226 | 2.2513 | 2.6868 | 2.6868 (Y = 8.03e+12) | -0.8559 (Y = 6.12e+12) |
| T-NR q = 3, c = 2.02 | 0.7552 | 0.7510 | 0.7533 | 0.7545 | 0.7565 | 0.7563 | 1.9939 (Y = 3) | 0.0210 (Y = 3) |
| T-NR q = 1000003, c = 2.2 | -0.3597 | -0.3766 | -0.3091 | -0.3097 | -0.3099 | -0.3113 | 0.5934 (Y = 2) | -0.3767 (Y = 9.97e+05) |

| sigma | limit D(inf) = Re[P(sigma) + Ei((1-sigma) log 2)] | D(Ymax) | theta_eff of the tail | decade maxima of abs(D - limit) log Y at 1e4, 1e8, 1e12 |
|---|---|---|---|---|
| 0.51 | -2.035272 | -1.579508 | 0.528 | 9.46, 12.3, 13.8 |
| 0.55 | -1.202830 | -1.151949 | 0.517 | 3.5, 2.77, 1.99 |
| 0.6 | -0.837627 | -0.830910 | 0.511 | 1.74, 0.805, 0.353 |
| 0.75 | -0.379528 | -0.379493 | 0.505 | 0.371, 0.039, 0.00424 |

sigma = 0.45 (zeta): D at decades 1e4: -1.3699, 1e6: -1.8578, 1e8: -2.1621, 1e10: -2.3985, 1e12: -2.7831; final -2.9421; sup 0.7306 at Y = 2
E_a (a = 0.15, sigma = 0.6, both poles removed): 1e4: -1.7296, 1e6: -2.2343, 1e8: -2.5408, 1e10: -2.7777, 1e12: -3.1626; final -3.3216; sup 1.3240 at Y = 2

| family | Y = 1e2 | Y = 1e4 | Y = 1e6 | Y = 1e8 | Y = 1e10 | Y = 1e12 | Y = Ymax | sup over Y (Y, sigma, t at the sup) |
|---|---|---|---|---|---|---|---|---|
| zeta | 1.550 | 1.522 | 1.505 | 1.538 | 1.510 | 1.523 | 1.522 | 1.776 (16.3, 0.55, 73.75) |
| chi_4 | 1.640 | 1.417 | 1.338 | 1.324 | 1.311 | 1.324 | 1.323 | 1.734 (67, 0.55, 59.25) |
| random sign | 2.769 | 3.500 | 3.642 | 3.743 | 3.754 | 3.601 | 3.572 | 3.817 (8.91e+08, 0.55, 22.75) |
| THIN b = 0.8 | 2.128 | 2.307 | 4.681 | 13.575 | 16.492 | 20.963 | 56.095 | 56.326 (9.15e+12, 0.55, 1.0) |
| DEL b = 0.8 | 1.008 | 1.527 | 4.549 | 13.426 | 16.840 | 20.885 | 55.752 | 55.983 (9.15e+12, 0.55, 1.0) |
| T-NR q = 3, c = 2.2 | 3.332 | 5.083 | 22.084 | 90.405 | 361.652 | 2070.281 | 4265.580 | 4265.581 (8.28e+12, 0.55, 48.5) |

| sigma | t | v_Y(s) at Ymax | limit Re[P(s) + Ei((1-s) log 2)] | difference |
|---|---|---|---|---|
| 0.55 | 0.00 | -1.1519489 | -1.2028297 | 5.1e-02 |
| 0.55 | 10.00 | 0.6313649 | 0.6307810 | 5.8e-04 |
| 0.55 | 14.25 | -2.6230169 | -2.6083996 | -1.5e-02 |
| 0.55 | 50.00 | -1.1631312 | -1.1568998 | -6.2e-03 |
| 0.55 | 100.00 | 0.4087075 | 0.4100943 | -1.4e-03 |
| 0.70 | 0.00 | -0.4846828 | -0.4848723 | 1.9e-04 |
| 0.70 | 10.00 | 0.5598868 | 0.5598807 | 6.0e-06 |
| 0.70 | 14.25 | -2.0018277 | -2.0015916 | -2.4e-04 |
| 0.70 | 50.00 | -1.0328339 | -1.0328895 | 5.6e-05 |
| 0.70 | 100.00 | 0.3611744 | 0.3611990 | -2.5e-05 |
| 0.90 | 0.00 | -0.1825159 | -0.1825161 | 2.6e-07 |
| 0.90 | 10.00 | 0.4760796 | 0.4760796 | 1.3e-08 |
| 0.90 | 14.25 | -1.4301060 | -1.4301056 | -4.1e-07 |
| 0.90 | 50.00 | -0.7866346 | -0.7866348 | 1.8e-07 |
| 0.90 | 100.00 | 0.3001320 | 0.3001321 | -8.5e-08 |

Reading of the tables.

- zeta, (c): D_sigma(Y) is largest at Y = 2 and decreases; D(Y) - D(inf) is positive and decays; theta_eff (slope of the decade maxima of abs(D - limit) log Y, plus sigma) is 0.505 to 0.528 at the four sigma. sigma = 0.45 is included to show the other side of 1/2: D decreases without bound.
- zeta, (b): M(Y) stays between 1.50 and 1.78 from Y = 1e2 to Ymax; the sup is at Y = 16.
- chi_4, chi_3, chi_5, random signs, Liouville on primes, Cramer model (4 seeds to 1e9: D_0.51(1e9) = 2.65, 1.74, 1.06, -0.20; running sup at most 2.85): bounded. The Cramer and random-sign families have no zeros in sigma > 1/2 almost surely; they pass, as zeta does.
- THIN and DEL (zero at 0.8), (c): D_0.51 = -446.76 at Y = 1e12 for THIN. Prediction for a simple zero at 0.8: D_zeta - [Ei(0.29 log Y) - Ei(0.29 log 2)] - 2 (random constant of S1) = -1.55 - 446.0 + 0.84 = -446.7. The statistic follows the real zero with the sign of the Remark and the one-sided bound holds at every Y. These two functions satisfy H5(c) at every size and vanish at 0.8.
- THIN and DEL, (b): M(Y) = 2.3, 4.7, 13.6, 16.5, 21.0 at Y = 1e4, 1e6, 1e8, 1e10, 1e12, attained at sigma = 0.55, t between 1 and 1.75 (the sup over the t-grid oscillates with Y: 2.8 at Y = 1e11). Prediction of the Remark for the zero at 0.8 read at s = 0.55 + 1.75i, Y = 1e12: Y^0.25/(abs(0.25 - 1.75i) log Y) = 20.5. The failure is the zero at height 0 read from a complex point next to it.
- T-NR, q = 3, c = 2.2: abs(alpha) = 3^0.904; the statistic alternates in sign at the powers of 3 with amplitude Y^(0.904-sigma)/log_3 Y (sup 2615 at sigma = 0.51). It fails from Y = 3, by its local factor, which is also where its zeros come from (lowest at height pi/log 3 = 2.86). With c = 2.02 (zeros at Re s = 0.629) the first term alone, 2.02 x 3^(1/2 - sigma) = 2.0 at Y = 3, exceeds zeta's sup; the later terms have amplitude 3^(0.119 k)/k at sigma = 0.51 (1.3 at k = 27).
- T-NR, q = 1000003: equal to zeta's statistic for Y < q; jump of c q^(1/2-sigma) = +1.92 at Y = q (sigma = 0.51), to 0.63, below the Y = 2 value 0.70; -1.08 at Y = q^2. In the range it never exceeds the initial sup: a control with zeros at Re s = 0.532 that passes at every size reached. It is unbounded only along the odd powers q^k, with amplitude q^(0.022 k)/k at sigma = 0.51 (0.8 at k = 3, 2.6 at k = 11).
- E_a (a = 0.15) at sigma = 0.6 with both poles removed: D_0.45 + D_0.75, bounded above by its Y = 2 value in the whole range and decreasing (the prime-square term of the factor at sigma - a < 1/2 dominates). Its zeros are at Re s = 0.65 and it passes (c) in the range; a violation needs a sign change of the type of pi(x) - li(x) (CLASSICAL, Littlewood), far outside the range. With only the pole at 1 removed it grows as Y^(1+a-sigma) and fails by size at once.
- DH (no pole; sum_{n<=Y} Lambda_DH(n) n^-sigma/log n, n <= 1e8, 724 checkpoints): range of the statistic at sigma = 0.51 by decade: [-0.33, -0.07] (1e3), [-0.32, -0.08] (1e4), [-0.40, -0.02] (1e5), [-0.53, 0.17] (1e6), [-0.72, 0.11] (1e7 to 2e7), [-0.87, 0.48] (2e7 to 5e7), [-1.09, 0.55] (5e7 to 1e8). Amplitude of the lowest off-line pair 0.8085 + 85.70i alone at Y = 1e8 from the Remark: 0.31; at sigma = 0.75: 0.004, and the measured range there is [-0.137, -0.117]. The growth is the growth of that pair. For sigma >= 1: constant to three digits (-0.080 at sigma = 1, -0.054 at 1.2).

Classification: CLOSED. (c) and (b) are the explicit formula with kernel Ei((rho - sigma) log Y). Every control that fails does so at the size given by its own zero in that kernel (DH, THIN and DEL in (b)) or by its non-tempered local factor from the first power of q (T-NR). Four families that are not RH pass (c) at every size reached: THIN, DEL, E_a, T-NR with q = 1000003.

## 4. Combination 2: first radix layer

Source: `src/pages/OpenFrontierPage.jsx`, entries T59, T62, T65, T82, T84, T99 (statements only; the certificate scripts named there are not in this checkout). RECONSTRUCTED: C_p(N) is the number of k in [0, N] with a carry out of the lowest base-p digit in k + (N - k), that is C_p(N) = sum_{k=0}^N [floor(N/p) - floor(k/p) - floor((N-k)/p)].

### 4.1 Definitions and checks (PROVED, elementary)

- C_p(N) = floor(N/p)(p - 1 - (N mod p)) = sum_{m<=N/p} (2mp - N - 1). Checked against the direct count for all p <= N at N = 10, 37, 100, 257, 600, together with Kummer's theorem (sum over all radix layers = sum_k v_p(C(N,k)), and sum_p log p times it = log prod_k C(N,k) to 25 digits).
- R(N) = sum_{p<=N} log p [sum_{m<=N/p} (2mp - N - 1) - (N - p)]; Mellin kernel ((s-1) zeta(s) - 1)/(s(s+1)) = K(s) against sum_p log p p^-s. This is the kernel of T65: K(1) = 0, K(rho) = -1/(rho(rho+1)).
- Decomposition: R(N) = [N^2/2 - theta_1(N)] + [sum_p C_p(N) log p - N^2/2], theta_1(N) = sum_{p<=N} (N - p) log p. The second bracket has Mellin kernel (s-1) zeta(s)/(s(s+1)), which vanishes at every zero of zeta: it has no zero terms. Its leading term is the residue at s = 1/2 of the prime-square part: zeta(1/2) N^(3/2)/3 = -0.48678 N^(3/2). The first bracket is (2/3) N^(3/2) + sum_rho N^(rho+1)/(rho(rho+1)) + lower order (CLASSICAL). So r(N) = 0.17988 + sum_rho N^(i gamma)/(rho(rho+1)) + o(1) under RH, inside [0.1337, 0.2261] (sum of 1/abs(rho)^2 = 0.0461914), which reproduces the margin 0.1336904 of T62.

### 4.2 The carry kernel is sign-indefinite (PROVED)

On the cell N/(m+1) < p <= N/m the weight is w_N(p) = C_p(N) - (N - p) = (m^2 + m + 1) p - (m + 1) N - m, affine and increasing in p, equal to N/m - m at p = N/m and tending to -mN/(m+1) - m at the lower end. It is negative on the lower part of every cell and positive on a terminal part of relative length 1/(m^2+m+1) (for m = 1: negative for p < (2N+1)/3). C_p(N) alone is non-negative; the criterion kernel is not. The round-1 closure of one-sided inequalities with a non-negative kernel does not apply to it; the closure below is by the explicit formula.

### 4.3 What the inequality reads (PROVED from 4.1, with the explicit formula CLASSICAL)

Lemma 3. For weights a(p) log p in the integer kernel, a singularity of sum a(p) log p p^-s at s_0 with residue c contributes c K(s_0) N^(s_0+1). (i) K(b) < 0 for real b in (0, 1), because (s-1) zeta(s) < 1 there. A real zero at b of the underlying function (residue -1) therefore adds -K(b) N^(1+b) > 0: R >= 0 is not violated by a real zero. (ii) The positive margin is the prime-square term: weights without the term -sum log p p^-2s have no margin. (iii) An off-line pair of zeta's own type changes the sign of R once N^(beta-1/2) 2/abs(rho(rho+1)) exceeds 0.134, that is at N about (0.067 gamma^2)^(1/(beta-1/2)).

So R(N) >= 0 is the statement of `s1-prime-tents-controls` row 4 (R_s1(x) = theta_1(x) - (x^2-1)/2 against x^(3/2)) with a zero-free term added. The unconditional statement of T99 (liminf D_{23,15}(N)/N^(3/2) <= -11081.705) was measured in that lane (row 3: bias coefficient 11082, N <= 1.88e10) and is not repeated.

### 4.4 Results (MEASURED; N <= 1e11, 1741 values; 80-bit per task, 128-bit totals)

Known answers: `radix.c` against exact mpmath sums for every grid N <= 2e5: worst relative difference 9.5e-12 (double arithmetic on the local machine); prime count 4 118 054 813 = pi(1e11) on the server.

| family | r(N) = R/N^(3/2) by decade [min, max]: 1e6, 1e8, 1e10 | sign changes (N >= 1000) | outcome |
|---|---|---|---|
| zeta | [0.165, 0.253], [0.165, 0.213], [0.169, 0.201]; r(1e11) = 0.1777 | 2, last negative value at N = 2209 | passes; inside the RH band from N = 1e7 ([0.1646, 0.2220] in that decade) |
| zero part [N^2/2 - theta_1]/N^(3/2), N >= 1e9 | [0.6658, 0.7072] (limit 2/3 plus zero sum) | | |
| carry part [sum_p C_p log p - N^2/2]/N^(3/2) | -0.6113 (1e5), -0.5169 (1e7), -0.5080 (1e9), -0.4991 (1e10), -0.4937 (1e11); limit zeta(1/2)/3 = -0.48678 | | zero-free term; within 0.012 of the limit in the last decade |
| chi_4, kernel twisted by chi_4 (Mellin kernel ((s-1) L(s) - 1)/(s(s+1))) | [0.771, 0.957], [0.812, 0.957], [0.812, 0.963] | 0 | behaves as zeta (bias (2/3)(1 + L(1/2, chi_4)/2) = 0.889) |
| chi_4 weights, integer kernel | [-1.34, 2.00], [-1.83, 1.77], [-1.19, 1.59] | 395 | fails: K(rho_chi) contains zeta(rho_chi), not 0; the criterion is tied to zeta's own kernel |
| random sign | [-3.2, 3.9], [-4.4, 4.5], [-4.1, 3.4] | 264 | fails at once; rms 0.404 N^(3/2) sqrt(log N), variance prediction sqrt(1/8) = 0.354 |
| Liouville on primes | -(zeta row) | 2 | negative at every N > 2209 |
| Cramer model (4 seeds, N <= 1e7) | within [-6.1, 3.4] | 9 to 15 in 33 values | fails at once |
| THIN b = 0.8 | [4.3, 9.7], [20, 40], [78, 156] | 35, none above N = 1e4 | passes: R/N^1.8 = 0.07840 at 1e11; -K(0.8) = 0.07812 |
| DEL b = 0.8 | [4.5, 9.8], [20, 40], [79, 156] | 8, none above N = 1e4 | passes: R/N^1.8 = 0.07831 |
| T-NR q = 3, c = 2.2 | amplitude up to 2.5e4 | 51 | fails from the first N |
| T-NR q = 3, c = 2.02 | [-6.6, 6.3], [-11.7, 10.6], [-20.9, 23.1] | 149 | fails from the first N |
| T-NR q = 1000003, c = 2.2 | [-11.5, 30.2], [-2.8, 0.18], [-0.12, 0.19]; 0.110 at 1e11 | 188 | equal to zeta for N < q; fails from N = q; the excursion decays as sqrt(q/N) until q^2 |
| DH, integer kernel (N <= 1e8) | [-5.8, 6.1] (1e6), [-21, 17] (1e7) | 252 in 676 | fails at once |
| DH, kernel twisted by a (N <= 1e8) | [-0.12, 0.11] (1e6), [-0.17, 0.18] (1e7) | 86 in 676 | fails at once: symmetric about 0, no prime-square bias; the lowest off-line pair has amplitude 0.08 at 1e8 and is not yet the reason |
| E_a | not computed | | K(1 + a) != 0: main term of order N^(2+a), fails by size (PROVED) |

Classification: CLOSED. The sign of R is the sign of 0.180 + (zero sum with kernel 1/(rho(rho+1))) + o(1). Controls without the prime-square term fail at the first N by lack of the bias (random sign, Cramer, DH, Liouville); controls with a real zero pass with a larger margin (THIN, DEL); T-NR fails from N = q by its local factor; a control with zeta's prime squares and an off-line pair at height gamma would change sign at N about (0.067 gamma^2)^(1/(beta-1/2)), which at N = 1e11 and beta = 1 means gamma < 2200. Nothing here is below the resolution of the zeros.

## 5. Combination 3: divisor-cosine identity at the zeros

Sources: `zeta-view/docs/BRIDGE-RESEARCH.md` section 5 (D_N(xi) and its product form; spectral coordinate xi with s = 1/2 + i xi/2, zeros at xi = 2 gamma), `zeta-view/docs/NO-ESCAPE.md` section 6 (A_{p,m}), node gauss-plancherel-alias-lemma (statement as in the graph).

### 5.1 The statistic (PROVED, elementary)

With t = xi/2: D_N(xi) = sum_{d1 d2 = N} cos(t log(d1/d2)/2) = N^(it/2) tau_t(N), tau_t(N) = sum_{d divides N} d^(-it). For completely multiplicative a, sum_N a(N) tau_t(N) N^-s = F(s) F(s + it) (a(N) tau_t(N) = sum_{d m = N} a(d) d^(-it) a(m)). The weight that puts a zero at xi = 2 gamma is therefore w(N) = N^(-1/2 - it/2) v(N/X): E_X(t) = sum_{N<=X} a(N) tau_t(N) N^(-1/2) v(N/X) = (1/2 pi i) int F(1/2 + z) F(1/2 + z + it) v~(z) X^z dz. With v(x) = (1-x)^3, v~(z) = 6/(z(z+1)(z+2)(z+3)): E_X(t) = F(1/2) F(1/2 + it) + [pole terms of order X^(1/2) and X^(1/2 - it), for zeta] + [terms of order t/X from z = -1, -2, -3] when F continues with polynomial growth to Re s < 1/2 (functional equation). With a real weight independent of xi the same sum gives abs(zeta(1/2 + i xi/4))^2 plus pole terms, zeros at xi = 4 gamma; the form above is the one matching the source's coordinate.

Pole removal, identical for all families: E is formed from four scales X/lambda, lambda = 1, 2, 3, 5, with coefficients c_j(t) of minimal norm such that sum c_j = 1, sum c_j lambda_j^(-1/2) = 0, sum c_j lambda_j^(-1/2 + it) = 0. This keeps F(1/2) F(1/2 + it) and removes every term proportional to X^(1/2) or X^(1/2 - it), whatever its coefficient (norm of c at most 20 at every sampled t).

The prime-mode mixer A_{p,m}(gamma) = log p p^(-m/2) cos(gamma m log p) is the real part of the term of -zeta'/zeta(1/2 + i gamma) at p^m; the alias lemma is the Plancherel identity over characters mod p. Neither changes the statistic: both are linear in the same coefficients. They were not computed separately.

### 5.2 Finite consequence and survival rule

Consequence: for zeta the ratio (mean square of E_X over the zeros) / (mean square over bulk t) tends to 0 as X grows, at rate (t/X)^2; with a_F(N) inserted for DH the ratio at DH's on-line zeros stays bounded away from 0. Survival would need every control to fail, and the failure not to be a statement about the coefficients alone.

### 5.3 What it reads (PROVED)

- DH: a = c_1 chi + conj(c_1) conj(chi), c_1 = (1 - i kappa)/2, so sum a(N) tau_t(N) N^-s = c_1 L(s, chi) L(s + it, chi) + conj(c_1) L(s, conj chi) L(s + it, conj chi). At an on-line zero of DH, c_1 L(1/2 + i gamma, chi) = -conj(c_1) L(1/2 + i gamma, conj chi), and the value is c_1 L(1/2 + i gamma, chi) [L(1/2, chi) - L(1/2, conj chi)], not 0 because L(1/2, chi) is not real. The failure is the failure of a(mn) = a(m) a(n) (first at n = 6), a property of finitely many coefficients; it does not involve the off-line zeros.
- T-NR: a = 1 * g with g supported on 1, q, q^2; sum a(N) tau_t(N) N^-s = zeta(s) zeta(s + it) Lambda_q(s, t), Lambda_q = sum_j g(q^j) l_j, l_j = x^j [(1 - xy) - y^(j+1)(1 - x)]/(1 - y), x = q^-s, y = q^-it. It vanishes at every zero of zeta. All on-line zeros of T-NR are zeros of zeta; its off-line zeros (Re s = 0.904 at q = 3, c = 2.2) are not sampled by a test on the line. T-NR passes at every X.
- E_a: Euler product, the same factorisation; it has no zeros on the line, so the zero sample is empty.
- THIN and sign twists: F(s) F(s + it) holds as a Dirichlet series identity, but F has no continuation with polynomial growth to the left of Re s = b/2 (THIN) or 1/2 (random signs), so E_X does not converge to F(1/2) F(1/2 + it) at rate 1/X. They fail by lack of the functional equation.

### 5.4 Implementation and validation

`divcos.c`: E_X(t) = sum_{d<=X} G(d) d^(-it) with G(d) = sum_{m<=X/d} a(dm)(dm)^(-1/2) v(dm/X), computed for all d <= X by the double loop (X log X operations; a(dm) = a(d) a(m) for the completely multiplicative families, n mod 9 for T-NR), for 4 scales and 7 coefficient families at once; G is stored as centred log-moments (k = 0..7) over blocks of width 5e-5 in log d, so that E_X(t) for t <= 2000 is a sum over 2.8e5 blocks (relative error of the expansion below 1e-15). The completely multiplicative signs to 1e10 come from a segmented factor sieve (bit tables, 2.5 GB). `divcos_eval.py`: evaluation of the block sums (float64, GPU 1 for X = 1e8 and 1e10; numpy for 1e6).

Higher-precision check of the float64 output: at seven values of t (two zeta zeros, two DH zeros, three generic) the result is compared with mpmath values (25 digits) of zeta(1/2) zeta(1/2 + it), L(1/2, chi_4) L(1/2 + it, chi_4), the chi_5 product, the DH combination and the T-NR product. Differences: 3e-6 to 1e-3 (X = 1e6), 3e-8 to 1e-5 (X = 1e8), 2e-10 to 1e-7 (X = 1e10), proportional to 1/X in every family. At the zeta zeros 14.1347 and 21.0220, abs(E) = 7e-10 and 1.2e-9 at X = 1e10.

### 5.5 Results (MEASURED)

Ratio of mean squares, zero sample over bulk sample (1e5 points in [10, 2000]; at X = 1e6 the samples are restricted to height 300 and 3000 bulk points):

| coefficients | sampled at | X = 1e6 | X = 1e8 | X = 1e10 |
|---|---|---|---|---|
| zeta | zeta zeros (1517) | 2.1e-9 | 6.7e-12 | 6.7e-16 |
| zeta | DH on-line zeros (null sample) | 1.07 | 1.11 | 1.11 |
| chi_4 | chi_4 zeros (868) | | 3.1e-10 | 3.1e-14 |
| chi_4 | zeta zeros (null sample) | 1.16 | 1.10 | 1.10 |
| T-NR q = 3, c = 2.2 | zeta zeros (= its on-line zeros) | 4.1e-8 | 1.2e-10 | 1.2e-14 |
| DH | DH on-line zeros (1861) | 0.026 | 0.0210 | 0.0210 |
| DH | zeta zeros (null sample) | 1.08 | 1.07 | 1.07 |
| chi_5 | DH on-line zeros | 0.20 | 0.153 | 0.153 |
| THIN b = 0.8 | zeta zeros (= its on-line zeros) | 0.35 | 0.19 | 0.10 |
| random completely multiplicative sign | zeta zeros (null sample) | 0.58 | 0.80 | 0.73 |

rms of E at the zeta zeros by height band at X = 1e10 (zeta coefficients): 4.4e-9 (10 to 100), 2.4e-8 (100 to 500), 5.7e-8 (500 to 1000), 1.15e-7 (1000 to 2000); bulk rms 2.6 to 3.8. The same bands at X = 1e8 are 100 times larger.

Classification: CLOSED. For zeta, chi_4 and T-NR the ratio falls as X^-2, for DH it is constant (0.021), for THIN it falls slowly. The separation zeta / DH appears at the smallest X and has nothing to do with DH's off-line zeros, but it is the coefficient relation a(mn) = a(m) a(n) read through a long sum; it is passed by T-NR, which has zeros at Re s = 0.904, and it is void for E_a. A test sampled at on-line zeros returns F(1/2 + i gamma) = 0 at those zeros and says nothing about zeros elsewhere. For zeta the vanishing at the 1517 ordinates is itself a restatement of the table of zeros (verified height).

## 6. Combination 4: Euler product against the window counter-model

Sources: `formalization/paper/mv-cap-theorem.md` section 0 and referee correction 2; `formalization/rh-attempts/2026-11-01-window-100.md` (Theorem C with kappa = 1, (C1) to (C4), Corollary C "Excluded: exact pointwise Euler-product evaluation near the window", Proposition 5' and the table of delta_allowed: 0.526, 0.318, 0.259, 0.169, 0.042 at T = 1e6, 1e10, 3e12, 1e20, 1e100).

### 6.1 Statistic

zeta_W = zeta Q_W'/Q_W. Class of modifications used here: two adjacent on-line zeros 1/2 + i(c -+ g_0/2) are replaced by the quartet 1/2 +- eta + i(c + delta); K further on-line zeros nearest to c are moved along the line by x_j, with abs(x_j) <= B (smallest adjacent gap), B = 1/4 (order and simplicity kept) or B = 2 (N(t) changes by at most 2, inside every explicit bound for S(t)); abs(delta) <= g_0/2; R_W(1) = 1 imposed with weight 1000 (residue; reached to 1e-9 or better). All factors (s - rho)(s - conj rho) are kept, so the functional equation and reality hold exactly. d(c; sigma, eta) = min over (x, delta) of sup_t abs(log R_W(sigma + it)). Every feasible point gives an upper bound for d; the numbers below are such upper bounds (Levenberg-Marquardt in mpmath, 70 digits, with x_j = B_j sin v_j, nested starts in K; the reported value is the sup of the exact abs(log R_W) on a grid of 400 points over the fitted segment, and the sup over a segment 20 times longer agrees to 2 percent).

The other side: e(Y; sigma, c) = abs(log zeta(sigma + ic) - log P_Y(sigma + ic)), P_Y the Euler product over p <= Y.

Consequence tested: "the Euler product pins the window" means e(Y) < d for a Y that is small compared with the cost of locating the zeros (about sqrt(c) terms). Survival would need, in addition, that the pinning fails for the controls.

### 6.2 Known answers

- K = 0, delta = 0: sup abs(log R) = 0.03457 at c = 1e6, sigma = 2, eta = 0.1; leading term of (C3'), (eta^2 + g^2/4)/a^2 = 0.03502.
- `eptail.c` against mpmath zeta (30 digits) at c = 1e3 and 1e6, Y <= 1e6 (local run), and on the server to Y = 1e9, c <= 1e12. With 80-bit phases the result at c = 1e12 stalls at 4e-9 (the product c log p loses 2e-6); the run reported uses 128-bit phases and reaches 6e-16 at sigma = 3.

### 6.3 Results (MEASURED)

Upper bounds for d (eta = 0.1; best over K <= 24; lattice model: zeros at spacing 2 pi/log(c/2 pi)):

| sigma | B | c = 1e3 | 1e6 | 1e9 | 1e12 | 1e20 | exponent of c between 1e6 and 1e12 |
|---|---|---|---|---|---|---|---|
| 3 | 1/4 | 6.3e-3 | 7.4e-6 | 6.8e-8 | 4.8e-9 | 3.0e-10 | -0.53 |
| 3 | 2 | 5.2e-3 | 2.1e-6 | 2.5e-8 | 2.4e-9 | 1.7e-10 | -0.49 |
| 2 | 1/4 | 6.4e-2 | 9.9e-4 | 2.8e-5 | 1.6e-6 | 4.6e-8 | -0.46 |
| 2 | 2 | 6.4e-2 | 4.5e-4 | 1.0e-5 | 4.5e-7 | 1.1e-8 | -0.50 |
| 1.5 | 1/4 | 2.3e-1 | 1.1e-2 | 1.0e-3 | 1.4e-4 | 4.7e-6 | -0.32 |
| 1.5 | 2 | 2.3e-1 | 8.4e-3 | 5.7e-4 | 5.7e-5 | 6.1e-7 | -0.36 |
| 1.1 | 1/4 | 6.7e-1 | 9.1e-2 | 2.1e-2 | 6.3e-3 | 7.4e-4 | -0.19 |
| 1.1 | 2 | 6.7e-1 | 9.1e-2 | 1.5e-2 | 4.1e-3 | 7.6e-4 | -0.22 |

At the actual zeta zeros (pair nearest 998.17 and 99998.71, sigma = 2, B = 2): 7.2e-2 and 7.1e-4; sigma = 3: 6.6e-3 and 6.7e-6. Dependence on eta (sigma = 2, B = 2, c = 1e12): 1.1e-7 (eta = 0.02), 4.5e-7 (0.1), 2.2e-5 (0.25); at c = 1e20: 6.3e-10, 1.1e-8, 2.0e-6. The values at c >= 1e9 are still decreasing in K at K = 24 (for example sigma = 2, B = 1/4, c = 1e12: 2.6e-6 at K = 16, 1.6e-6 at K = 24), and the values at 1e20 and 1e50 are limited by K; they are upper bounds, not minima.

Truncation error e(Y; sigma, c), primes to 1e9 (the same within a factor 5 at every c from 1e3 to 1e12; values at c = 1e12):

| sigma | Y = 1e2 | 1e3 | 1e4 | 1e6 | 1e8 |
|---|---|---|---|---|---|
| 3 | 1.2e-6 | 8.4e-9 | 1.5e-11 | below 1e-15 (floor) | below 1e-15 (floor) |
| 2 | 1.3e-4 | 1.1e-5 | 2.0e-7 | 9.8e-11 | 1.2e-13 |
| 1.5 | 1.8e-3 | 4.3e-4 | 2.4e-5 | 1.1e-7 | 1.8e-9 |
| 1.1 | 2.0e-2 | 9.4e-3 | 1.1e-3 | 3.1e-5 | 4.2e-6 |

These follow Y^(1/2 - sigma)/sqrt((2 sigma - 1) log Y) (square-root cancellation in the tail), not the absolute bound Y^(1 - sigma)/log Y.

Reading.

- Against this class of modifications the Euler product does separate: at c = 1e12, sigma = 2, eta = 0.1 the margin 4.5e-7 is reached by primes up to about 1e4; at eta = 0.25 (the size of delta_allowed at 3e12) the margin 2.2e-5 is reached by primes up to about 1e3. This agrees with the source ("resolvable by a few hundred terms").
- The required precision grows as a power of the height: d <= C c^(-kappa), kappa = 0.2 (sigma = 1.1), 0.35 (1.5), 0.5 (2 and 3, the last limited by K). With e(Y) of order Y^(1/2 - sigma) this gives Y >= c^(kappa/(sigma - 1/2)), about c^0.33 to c^0.37 for sigma <= 2. This is a lower bound for the number of primes needed, from a restricted family; a lower bound for d over all admissible modifications (which would be the pinning statement) is not obtained, and the measured minima are still falling in K. On the line at distance a = sigma - 1/2 a feature at the scale of one zero spacing g = 2 pi/log(c/2 pi) is damped by a factor of order exp(-pi (a - eta)/g) = (c/2 pi)^(-(a - eta)/2), a power of c (ARGUED; ill-posed continuation, route 48 of the atlas).
- delta_allowed. The Euler-product margin for depth eta does not vanish as eta tends to 0 (the quartet at depth 0 is a double zero, which is also a modification), and it grows with eta: a depth of delta_allowed(T) = O(log log T/log T) is separated more easily than a small one. The Euler product therefore does discharge the edge condition of Proposition 5' against this family, at the cost above, by evaluating zeta on sigma > 1 over the window. That is a computation at the window height (verification), which is how Corollary C of the source classifies it.
- DH control (mpmath, 30 digits; its lowest off-line quartet 0.80852 + 85.6993i moved to an on-line pair at 85.6993 -+ 1/2): abs(log DH_W/DH) at sigma + 85.6993i is 0.055, 0.149, 0.323, 0.834 for sigma = 3, 2, 1.5, 1.1; truncation of DH's own Dirichlet series at n <= 100: 1.3e-6, 1.6e-4, 2.1e-3, 2.5e-2; at n <= 1e4: 7e-13, 8e-9, 1e-6, 8e-5. DH is pinned by its series exactly as zeta is by its product, with the zero off the line. The same holds for T-NR (its series is zeta's times a finite factor) and for every control with an absolutely convergent series at sigma. No control fails.

Classification: CLOSED, recorded as a separation that exists only to the right of 1. The statement "d > e(Y)" identifies the function among its window modifications; it holds for DH and T-NR with their off-line zeros in place, so it carries no information on which side of the modification the zeros lie. The Euler product enters only as a convergent series; multiplicativity is not used.

## 7. Compute record

Server units (all through `rhrun`, all finished or stopped by this lane; none left running):

| unit | job | cores, memory | result |
|---|---|---|---|
| rh-s3h5-t11-1120010437 | H5 sieve to 1e11 (timing, count check) | 8, 4 GB | 74 s; pi(1e11) = 4 118 054 813 |
| rh-s3h5-e13-1120010558, rh-s3h5-e13-1120011734 | H5 sieve to 1e13 | 8 then 4 | stopped by this lane after 10 and 9 minutes: the slice was oversubscribed (load average 145 to 178 on 48 cores, 34 units), projected 7 to 9 hours; replaced by range runs with snapshots |
| rh-s3h5-a1-1120012731 | H5 sieve, primes in (0, 1 500 041 232 384] | 4, 4 GB | 4481 s; 55 564 681 017 primes |
| rh-s3h5-a2-1120024235 | H5 sieve, intended range (1 500 041 232 384, 4e12] | 7, 4 GB | 1385 s; 87 402 380 012 primes. The start was rounded down to the task boundary 11176 x 2^27 = 1 500 017 328 128, so the interval (1 500 017 328 128, 1 500 041 232 384] was covered by both runs (found by the count check below) |
| rh-s3h5-ov-1120030825 | H5 sieve of that interval alone; its table is subtracted | 1, 4 GB | 852 903 primes |
| rh-s3h5-a3-1120030637 | first launch of the third range with a start that would have repeated the same error | 7 | stopped by this lane after 40 s, output deleted; the code was changed to accept any start |
| rh-s3h5-a3-1120030730 | H5 sieve, primes in (4e12, 1e13] | 7, 4 GB | 2187 s; 203 099 328 713 primes |
| rh-s3rad-e11-1120011734 | first radix layer, N <= 1e11, 1741 values | 2, 2 GB | 3177 s |
| rh-s3dc-1120011734 | divisor-cosine moments, X = 1e8 and 1e10 | 2, 6 GB | 42 s and 4983 s |
| rh-s3dcev8-1120021141, rh-s3dcev10-1120024235 | evaluation at 1e5 + 4246 values of t, GPU 1 (float64) | 1, 8 to 10 GB | about 4 minutes each |
| rh-s3ep-1120021141, rh-s3ep2-1120022956 | Euler product at sigma + ic, primes to 1e9, nine heights | 1, 2 GB | first run discarded (80-bit phases), second used |
| rh-s3h5an-*, rh-s3h5an1-*, rh-s3h5an2-*, rh-s3h5an3-* | analysis of the sieve tables (snapshot, range 1, ranges 1 + 2, all) | 1, 10 GB | 3 to 5 minutes each |

At most 8 cores were requested at any time. One compilation of `h5sieve.c` (under a second) was run directly over ssh instead of inside a unit.

Count checks of the combined table (range 1 + range 2 - overlap + range 3): pi(1e11) = 4 118 054 813 (separate run); 55 564 681 017 + 87 402 380 012 - 852 903 = 142 966 208 126 = pi(4e12) (tabulated value, quoted from memory; Riemann's R(4e12) = 142 966 194 812 by mpmath, difference 1.3e4, of the expected size; before the subtraction the difference was 8.7e5, which is how the double coverage was found); 142 966 208 126 + 203 099 328 713 = 346 065 536 839 = pi(1e13) (tabulated value, quoted from memory).

Local runs (all through `scripts/memcap.sh 8`): validations to 1e7, 3e8, 1e9; DH coefficients to 1e8 (1.6 GB, 94 s); zeros of L(s, chi_4) to height 1000 (868 sign changes of Z, step 0.04; close pairs can be missed, which does not affect a sample); Cramer model to 1e9 (4 seeds); window optimisation (mpmath, one process, about 75 minutes, which exceeds the 20-minute local limit of the brief); divisor-cosine at X = 1e6.

Precision. Combination 1: terms in double, sums per sieve segment in double, per block and globally in 80-bit; the pole integral by mpmath; D values are of order 1 with absolute error below 1e-9 (the limit check at sigma = 0.9 agrees to 1e-7 with the continued value, which is the size of the true tail). Combination 2: integer weights exact, log p in 80-bit, sums per 2^27 range in 80-bit, totals in 128-bit; relative error of r(N) below 1e-10. Combination 3: float64 with long-double inner sums; checked against 25-digit values as in 5.4. Combination 4: 70 digits (optimisation), 80/128-bit (Euler product). No interval arithmetic anywhere: all numbers are MEASURED.

## 8. Three weakest steps

1. THIN and DEL are random sets with the prescribed density (hash rule), not the greedy floor rule of the map, and the zero at 0.8 of the resulting function is argued from the density, not proved. The measured statistics follow the prediction for a simple zero at 0.8 to within 0.4 percent (D_0.51 against the Ei prediction; R/N^1.8 against -K(0.8)), which supports the reading but is not a proof.
2. Combination 4 reports upper bounds for d from a restricted family (one quartet, at most 24 neighbours, bounded shifts along the line) and a lattice model above 1e5. The exponents kappa are properties of that family. The classification does not depend on them (it rests on the DH pinning and on sigma > 1), but the cost statement "Y >= c^0.33" is a lower bound only relative to the family.
3. Combination 2 is reconstructed from one-line statements; the definition of C_p(N) was fixed by Kummer's theorem and confirmed by three independent numerical agreements with the source (limit 0.17988 = 2/3 + zeta(1/2)/3, margin 0.1336904, kernel K(s)), but the source's certificate scripts were not available. The statement D_{23,15} of T99 was not recomputed here.

## 9. Files

`h5sieve.c`, `h5lib.py`, `h5an.py`, `h5validate.py`, `h5tables.py`, `h5show.py`, `h5combcheck.py`, `assemble.py` and `RESULT_head.md` (template of this file), `h5an_a1.json` (range 1 only), `h5an_a12.json` (to 4e12), `h5an_final.json`, `h5an_final.npz` (series at every eighth checkpoint); `radix.c`, `radix_validate.py`, `radix_an.py`, `radix_1e11.txt`, `radix_1e11.json`, `dhradix.c`, `dh_1e8.txt`; `divcos.c`, `divcos_eval.py`, `dc_1e6.json`, `dc_1e8.json`, `dc_1e10.json`, `chi4zeros.py`, `zeros_chi4.json`; `window.py`, `window.log`, `window.json`, `eptail.c`, `eptail_an.py`, `ep_1e9.json`; `cramer.py`, `cramer.json`; `run_*.sh`, grids `grid_*.txt`. Large tables (`h5_a1.bin`, `h5_a2.bin`, `h5_ov.bin`, `h5_a3.bin`, `dc_1e8.bin`, `dc_1e10.bin`) stay on the server under `~/rh-push/s3-truncated-euler-strip/`.
