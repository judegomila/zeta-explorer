# s3-prime-side-zero-statistics: screening of four combinations (2026-11-19/20)

Screening arm, slug `s3-prime-side-zero-statistics`. Four combinations of idea-graph nodes were turned into finite tests and run on zeta, on Dirichlet L-functions of conductor 5, and on the controls. Labels: PROVED (algebra in this file, checked numerically), CLASSICAL, MEASURED (float64 or multiprecision), CERTIFIED (Arb ball arithmetic, every sign decided by a ball that excludes 0), HEURISTIC (formula from the ratios conjecture). Nothing here is a statement about the location of the zeros of zeta.

**Verdict: 4 combinations tested, 0 survivors.**

- Combination 3 (Gabor fingerprint matrix from the prime side) is the only one where a control fails in a window that contains none of its off-line zeros. The failure is certified, but its reach beyond the window is bounded by a length that grows slowly with the prime cutoff X, the same reach is measured for a pair planted in zeta, and the matrix is a boundary Pick (Loewner) matrix. It is the verified-height statement in another form, at a higher cost in primes and precision than locating the zero.
- Combinations 1, 2 and 4 are second-moment statistics of the list of on-line ordinates. They identify the squared moduli of the log-derivative coefficients, are blind to sign and unimodular twists, are identical for zeta and T-NR, and separate DH and the heat lists only through the number of missing zeros at sizes of thousands of zeros.

Two measurements that are new relative to the nodes: (i) the constant of Var S(T) is b = 1 + M + P2 with boundary constant K(T) = 1 + (1.35 +- 0.05)/L^2, L = log(T/2 pi), at seven heights from 6e5 to 1e12 (the node had K about 1.06, unresolved); (ii) the discrete moment J_1 of zeta equals the three-term polynomial l^3/12 + (2 gamma_0/3) l^2 + (gamma_0^2 - 2 gamma_1) l per zero to 4 parts in 10^4 at seven heights.

## 0. Objects, lists, code

Objects. ZETA; CHI = L(s, chi), chi mod 5 with chi(2) = i, and CHIBAR; CHI5R = L(s, (./5)); DH = Davenport-Heilbronn (coefficients 1, kappa, -kappa, -1, 0 mod 5; first off-line zeros 0.8085 + 85.699i, 0.6508 + 114.163i, 0.5744 + 166.479i, 0.7243 + 176.70i, 0.8695 + 240.40i, 0.8195 + 320.88i; 84 pairs below 2000); HEAT = Riemann-Siegel model of the backward heat deformation at T0 = 1e8, tau = -0.005, -0.02, -0.08 (lists of the s1 lane; 1.5%, 10%, 42% of the zeros off the line); T-NR = zeta(s)(1 + 2.2 * 3^(1/2-s) + 3^(1-2s)) (off-line zeros at 1/2 +- 0.40375 + i (2k+1) pi/log 3; its on-line zeros are exactly those of zeta); LIOU = sign twist eps(p) = -1 (prime-side coefficients (-1)^k log p); RSGN = random signs eps(p) = +-1; UNI = random unimodular phases at the primes; WT = zeta(s + i alpha), alpha = 1.

Lists (on the compute server). Zeta: first 2,001,052 zeros (Z0) and Riemann-Siegel blocks at 1e7 (4.0e6 zeros), 1e8, 1e9, 1e10, 1e11, 1e12 (2.0e7 zeros each): 1.06e8 zeros. No list near 1e13 exists on the server; a block of 2e7 zeros at 1e13 costs about 2e14 Riemann-Siegel terms and was not generated. Defects found in the lists by this lane: the blocks at 1e7, 1e11 and 1e12 each contain one place where S(t) steps by -2 (one missed pair of zeros in 4e6 / 2e7 / 2e7); the affected chunk is dropped in the variance. CHI, CHIBAR, DH (on-line zeros): the lists of the s1 lane to T = 1e6 (2.0e6, 2.0e6 and 1.79e6 zeros). DH below 2000 with its off-line pairs: table of the control battery.

Code (this directory; local runs through `scripts/memcap.sh 8` with `.venv-arb/bin/python`; server runs through `rhrun`, units `rh-s3*`):

| file | role | known-answer check |
|---|---|---|
| `w3.py` | float64 prime-side matrix W (box and Hann windows) for every family; coefficient generators (DH log-derivative by the divisor recursion, T-NR, twists) | `w3_validate.py`: prime side against the zero side (400 zeta zeros and their negatives; DH with all 1861 + 2 x 84 zeros below 2000), Hann window: max difference 4e-14 to 2e-12 on entries up to 143; the three negative eigenvalues of DH at X = 1000, window from 300, agree to 12 digits (-2.05451811136, -0.8974094726, -0.1208502175); c_DH(2) = 0.19691, c_DH(4) = -1.44223, c_DH(6) = 1.93636 (s1 lane values) |
| `w3_arb.py`, `w3_scan.py` | the same matrix in Arb; inertia by LDL^T with every pivot sign certified; first negative pivot; planted quadruples | float64 and Arb eigenvalues agree where float64 resolves them (-0.0149872; 4.14318e-10) |
| `pc.py`, `rmt.py` (from s1) | pair-difference histogram, Bogomolny-Keating / Conrey-Snaith model, fits; Var S by exact integration between zeros | L(chi): amplitude at n = 5 is -0.004 +- 0.012 (zeta: 2.5900 +- 0.0007); amplitudes at n = 6, 10 are 0 within errors |
| `varS_robust.py` | Var S per chunk, defect detection | the three list defects are found as steps of -2.00 |
| `j1.py` | Z'(gamma) by a 4-point stencil on a cupy Riemann-Siegel sum (zeta) and on the sampled Z_chi, Z_chibar of the s1 lane | `j1_validate.py`: against mpmath zeta' at zeros near 1e4 and 1e6: 2.8e-5, 9.0e-6 (same on the GPU) |
| `rolle_validate.py` | zeros of zeta' right of the line by mpmath for 80 gaps of the first 1e5 zeros | section 4.3 |
| `c2_dh.py` | Var S of DH from the complete table below 2000 | - |
| `summarize.py`, `w3_sum.py` | tables from `out/` | - |

Server use: Arb scans 8 cores then 4 cores (units `s3w3scan`, `s3w3b`, `s3w3c`), pair correlation 3 + 5 cores (`s3pc`, `s3pc2`), J_1 one core and GPU 1 with a 6 GB pool (`s3j1`), `s3vs` one core; at most 9 cores at one time, under 12 GB. GPU 1 was at 99% utilisation from other jobs with about 15 GB free, and the machine had a load average of 130 to 175; this set the sizes. All units are stopped.

## 1. Table

Cells: P = follows the family prediction within the stated error; F = differs; = means identical to zeta by construction; N = not formulable.

| # | combination | statistic | sizes reached | zeta | L-function mod 5 | DH | HEAT | T-NR | sign / unimodular twist | classification |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | bogomolny-keating-amplitude-one + bk-diagonal-prime-identity | a in Data - GUE = a (BK - GUE), pair differences up to 40 (160 mean spacings at 1e12), bins 0.01; diagonal and oscillating amplitudes; amplitudes A_n of cos(r log n)/n, n = 2..13 | zeta 1.06e8 zeros, T = 1e3 .. 1e12; chi, chibar 2.0e6 zeros each to 1e6; DH 1.78e6 on-line zeros; three heat lists | a = 0.99889 +- 0.00071 over seven lists (per list 0.9971 .. 1.0028, errors 0.0012 .. 0.0027); a_diag = 0.99991 +- 0.00074, a_osc = 0.99861 +- 0.00082; A_n = log^2 p at prime powers to 3 or 4 digits, 0 at n = 6, 10: P | a = 1.0017 +- 0.0022 (chi), 1.0007 +- 0.0023 (chibar); A_5 = -0.001 +- 0.002 and 0.001 +- 0.002 (zeta: 2.5900); other A_n as zeta: P | on-line zeros, T = 1e4 .. 1e6: a = 0.843 +- 0.015, a_diag = 0.684 +- 0.013; chi^2 per bin 19.8 (zeta, chi: 0.95); A_2 = 0.12, A_4 = 2.12, A_6 = 0.75, A_10 = 4.06 (errors 0.01 .. 0.09) match neither the Euler values (0.48, 0.48, 0, 0) nor its own abs(c(n))^2 (0.039, 2.08, 3.75, 0): F | a = 0.757, 0.291, -0.294 (+- 0.005) for tau = -0.005, -0.02, -0.08: F | mixed pair (zeta's zeros, T-NR's coefficients): A_3 = 1.2066 +- 0.0005 against abs(c(3))^2 = 27.93, A_9 = 1.205 +- 0.003 against 68.3; every other n agrees: F at the single prime 3 | diagonal term depends on abs(c(n))^2 only: LIOU, RSGN, UNI have zeta's diagonal term (P by construction); a function without functional equation has no oscillating term, zeta's zeros give a_osc = 0.9986 +- 0.0008: F | CLOSED. Identifies abs(c(n))^2 (map row 33) and the zero count; DH fails through missing zeros from about 2e4 zeros, not below its first off-line zero (43 zeros there) |
| 2 | var-s-constant-decomposition + var-s-constant-pair-correlation-integral + number-variance-cap-selberg | K(T) = 2 pi^2 Var S - log log(qT/2 pi) - M_q - P2_q (prediction: I_F = 1) | same lists; S(t) from the count, integrated exactly over 1.06e8 gaps | K = 1.0102, 1.0062, 1.0049, 1.0039, 1.0031, 1.0025, 1.0022 at T = 6e5, 1e7, .., 1e12 (errors 1e-4 to 2e-4); (K - 1) L^2 = 1.26 .. 1.45; extrapolation K = 1.000 | K = 1.0123, 1.0122 +- 0.0003 at L = 12.7 with M_5, P2_5 ((K - 1) L^2 = 1.95); with zeta's constants (p = 5 kept) K would be 0.801: the removal of p = 5 is confirmed | all zeros below 2000 (argument principle): Var S = 0.1432, 0.1447, 0.1509 on [10, 2000], [100, 2000], [1000, 2000] against the Euler value of conductor 5: 0.139 .. 0.159: P. Sum of its own abs(c(n))^2/(n log^2 n): 1.48, 2.26, 3.26, 5.12, 9.82 at X = 1e2 .. 1e6 (Euler: 1.72 .. 2.82), divergent: F against its own coefficients. On-line count: Var = 2325 on [10, 2000] (62 after removing a linear trend), 2.3e6 on [1e4, 1e6]: F | Var S (chunk means removed) 4.8e4, 2.2e6, 3.7e7 for the three lists (on-line count): F | on-line count: = zeta. Argument-principle count: Var S_zeta + 1/3 + 2 x 0.05170 = Var S_zeta + 0.4367 (measured at six heights, constant to 1e-4). Own coefficient sum diverges like X^0.81 | = (diagonal sum of abs(c)^2) | CLOSED. A second moment of abs(c(p))^2 plus the count of zeros; blind to twists; DH with all its zeros follows the Euler value |
| 3 | m23-gabor-fingerprint-matrix + m23-three-prime-side-numbers + m23-rank-trace-lemma | inertia of W computed from the coefficients c(n), n <= X (no zero used), box and Hann windows; first negative pivot; planted quadruples | Arb, 1500 to 5500 bits: n up to 150 nodes, X = 1e2 .. 1e6, windows at 12, 242, 262, 1e3, 1e4, 1e5, 1e6; float64: n = 1500, T = X = 1e2 .. 1e6, nine families | n_-(W) = 0 CERTIFIED in all 11 window / cutoff pairs (smallest pivot 1e-181 at X = 1e6); float64 at T = X = 1e6 shows 6 eigenvalues below the tolerance (-1.4e-7): round-off, the Arb window there is positive definite | CHI5R: n_- = 0 CERTIFIED in 3 windows | n_- >= 1 CERTIFIED in windows with no off-line zero: [12, 80.2], [12, 51.1], [12, 36.6], [12, 25.1] at X = 1e2, 1e3, 1e4, 1e5 (first pair at 85.70); [262, 284.9] at X = 1e5 (pairs at 240.40, 320.88). n_- = 0 CERTIFIED on [20, 84] at X = 1e2 and on [262, 300] at X = 1e3, 1e4 | N (no Dirichlet series) | 14 to 15 negative eigenvalues (every window contains off-line zeros) | LIOU, RSGN, UNI with zeta's archimedean term: 24 to 37 negative eigenvalues of 100 at X = 1e4 (down to -115); WT: positive definite; tr W and the Frobenius norm of LIOU equal zeta's to 3 digits | CLOSED. Boundary Pick matrix; reach beyond the window measured on planted pairs: 2 to 60 (shallow pair), 10 to 300 (pair at distance 0.3 from the line) for X = 1e2 .. 1e6; needs 50 to 180 digits |
| 4 | gonek-hejhal-J1 + m23-zeta-prime-rolle | J_1 per zero against l^3/12 + (2 gamma_0/3) l^2 + (gamma_0^2 - 2 gamma_1) l; spread over windows of 200 and 2000 zeros; number of zeros of F' with 1/2 < Re s < 1/2 + c/l (through gaps below (2/pi) sqrt(c)) | zeta: 9.8e6 zeros at T = 1e4 .. 1e12; chi, chibar 2.0e6 each; DH 1.79e6 | ratio 0.9998, 1.0001, 1.0001, 1.0000, 1.0004, 0.9998, 1.0004 (three terms; errors 3e-4 to 3e-3); leading term alone: 1.45 .. 1.19. Windows of 2000 zeros: 0.4% outside [0.9, 1.1] at 1e11, none elsewhere; windows of 200 zeros: 10% (1e4 .. 1e6) to 51% (1e12) outside. Small gaps over GUE: 0.85 .. 1.00 | leading-term ratio 1.65, 1.45, 1.38, 1.32 at l = 8.3 .. 13.1; chi and chibar agree to 1e-4; lower-order coefficients fitted, not derived (section 4.2). Small gaps over GUE 0.82 .. 0.86 | J_1(DH)/J_1(chi) = 0.844, 0.809, 0.793, 0.782 in four height ranges (no constant factor): F against the conductor-5 value. Gaps for c = 0.01: 3.00 +- 0.08 times GUE (c = 0.05: 1.36; c = 0.25: 0.78): F from about 1e4 zeros | not run for J_1 (no evaluator of the derivative); small gaps: s1 lane | J_1(T-NR)/J_1(zeta) = 10.25, 10.71, 10.96, 11.15, 11.30, 11.42, 11.51 (independent phases would give 6.84): a twisted moment of zeta, its own main term; no window outside +-5% of the block mean: P | N | CLOSED. Mean value over on-line zeros: = zeta for T-NR up to a twisted moment; DH differs by a factor that drifts, visible only in samples of thousands of zeros (MV-CAP); the derivative-zero count is the small-gap exponent of s1 |

Survivor criterion: zeta passes at every size; every control fails at a size much smaller than its off-line height explains, or for a reason that does not use the resolution of zeros; all primes together. Rows 1, 2, 4: T-NR and the twists are not separated (or only at one prime), DH only above its off-line height. Row 3: section 3.5.

## 2. Combinations 1 and 2: pair correlation and Var S

### 2.1 Test
For a list at height t with L = log(qt/2 pi), the expected number of zeros at distance r to the right of a zero, per unit r, is (L/2 pi)[1 + (2/L^2) Re val(r)], val(r) = (zeta_q'/zeta_q)'(1 + ir) - B_q(ir) + e^{-irL} Z_q(r), Z = zeta(1+ir) zeta(1-ir) A(ir) (Conrey-Snaith form of the Bogomolny-Keating formula, HEURISTIC; conductor factors as in the s1 lane). The first two terms are sum over n = p^k, p != q, of log^2 p cos(r log n)/n (node bk-diagonal-prime-identity, PROVED). GUE is the part -(1 - cos rL)/r^2. Fits by weighted least squares on 4000 bins x 40 chunks per list, errors by jackknife over the chunks:
- a: Data - GUE = a (BK - GUE); a_diag and a_osc for the two parts separately;
- A_n: amplitude of cos(r log n)/n for n = 2, .., 11, 13 with the rest of the model fixed. For a function with -F'/F = sum c(n) n^-s the diagonal term is sum abs(c(n))^2 cos(r log n)/n, so the consequence "a = 1 for every prime simultaneously" reads A_n = abs(c(n))^2.

### 2.2 Results (MEASURED)

| list | T | zeros | a | a_diag | a_osc | chi^2 per bin, GUE / BK |
|---|---|---|---|---|---|---|
| Z0 | 1e3 .. 1.13e6 | 2,000,403 | 0.9988 +- 0.0022 | 0.9968 +- 0.0026 | 0.9998 +- 0.0025 | 1.73 / 0.96 |
| 1e7 | 1e7 .. 1.18e7 | 4,023,319 | 1.0001 +- 0.0026 | 1.0004 +- 0.0024 | 1.0000 +- 0.0030 | 1.91 / 0.96 |
| 1e8 | 1e8 .. 1.08e8 | 20,044,587 | 0.9983 +- 0.0012 | 0.9999 +- 0.0013 | 0.9978 +- 0.0013 | 3.99 / 0.95 |
| 1e9 | 1e9 | 20,003,518 | 0.9971 +- 0.0016 | 0.9989 +- 0.0016 | 0.9966 +- 0.0020 | 3.00 / 0.95 |
| 1e10 | 1e10 | 20,000,281 | 1.0018 +- 0.0021 | 1.0021 +- 0.0023 | 1.0017 +- 0.0025 | 2.42 / 0.95 |
| 1e11 | 1e11 | 20,000,022 | 1.0028 +- 0.0027 | 1.0011 +- 0.0024 | 1.0033 +- 0.0032 | 2.02 / 0.94 |
| 1e12 | 1e12 | 20,000,002 | 0.9974 +- 0.0023 | 1.0010 +- 0.0027 | 0.9963 +- 0.0027 | 1.75 / 0.94 |
| zeta, combined | | 1.06e8 | 0.99889 +- 0.00071 | 0.99991 +- 0.00074 | 0.99861 +- 0.00082 | |
| CHI | 1e4 .. 1e6 | 1,990,591 | 1.0017 +- 0.0022 | 1.0025 +- 0.0028 | 1.0015 +- 0.0023 | 2.03 / 0.96 |
| CHIBAR | 1e4 .. 1e6 | 1,990,591 | 1.0007 +- 0.0023 | 0.9998 +- 0.0028 | 1.0008 +- 0.0024 | 2.03 / 0.96 |
| DH, on-line | 1e4 .. 1e6 | 1,779,322 | 0.843 +- 0.015 | 0.684 +- 0.013 | 0.872 +- 0.014 | 20.5 / 19.8 |
| HEAT -0.005 | 1e8 | 1,970,222 | 0.757 +- 0.005 | 0.407 +- 0.012 | 0.864 +- 0.007 | 1.51 / 1.36 |
| HEAT -0.02 | 1e8 | 1,797,068 | 0.291 +- 0.005 | -0.400 +- 0.016 | 0.501 +- 0.008 | 13.3 / 13.5 |
| HEAT -0.08 | 1e8 | 1,155,858 | -0.294 +- 0.005 | -1.297 +- 0.019 | 0.011 +- 0.007 | 136 / 136 |

The node value is a = 1.0000 +- 0.0008 over 8 windows; this run gives 0.9989 +- 0.0007 over 7 lists, 1.6 sigma below 1, with the deficit in the oscillating part (0.9986 +- 0.0008). The model here stops the prime products at 1e6 and integrates each bin on 5 points; no systematic budget was made, so the 1.6 sigma is not claimed as a deviation.

Per-n amplitudes, zeta, seven lists combined (expected log^2 p at prime powers, 0 at 6 and 10): A_2 = 0.4802 +- 0.0004 (0.4805), A_3 = 1.2066 +- 0.0005 (1.2069), A_4 = 0.4800 +- 0.0007, A_5 = 2.5899 +- 0.0006 (2.5903), A_6 = -0.0006 +- 0.0011, A_7 = 3.7856 +- 0.0015 (3.7866), A_8 = 0.4792 +- 0.0018, A_9 = 1.2051 +- 0.0023, A_10 = -0.0015 +- 0.0021, A_11 = 5.7491 +- 0.0018 (5.7499), A_13 = 6.5776 +- 0.0021 (6.5790). All eleven are within 1 sigma of the expected value or below it by at most 0.9 sigma; the common sign follows the amplitude a = 0.9989.

Controls.
- L(chi), L(chibar): pass with the conductor-5 form (p = 5 removed from the diagonal sum, factors at 5 in the oscillating term). The amplitude at n = 5 is 0 within 0.002; with zeta's term it would be 2.590. Per-n amplitudes: 0.479, 1.207, 0.480, -0.001, -0.003, 3.783, 0.477, 1.206, -0.004, 5.745, 6.574 for n = 2, .., 11, 13 (chi).
- DH, on-line zeros: fails. A_n for n = 2, .., 13: 0.12, 1.10, 2.12, -0.74, 0.75, 0.81, 0.82, 3.94, 4.06, 5.83, 1.55 (errors 0.01 to 0.09). These are neither the Euler values nor abs(c_DH(n))^2 = 0.039, 0.097, 2.080, 0, 3.749, 0.306, 0.0003, 5.225, 0, 5.750, 0.531, and they are not stable in height (on [2e4, 3e5]: A_2 = -1.02 +- 0.03, A_6 = 3.90 +- 0.13). From the errors, a per-n amplitude is 5 sigma off from about 2e4 zeros (T about 1.5e4) and a from about 4e5 zeros. Below the first off-line zero there are 43 zeros and no test. The reason is the one found in the s1 lane: the off-line zeros carry a part of order 1 of every coefficient, so the on-line list alone satisfies no explicit formula.
- HEAT: fails at every tau, more strongly the more zeros have left the line.
- T-NR, mixed pair (zeta's zeros against the diagonal term of T-NR's coefficients): c(3) = log 3 (1 + 2.2 sqrt 3), abs(c(3))^2 = 27.93, abs(c(9))^2 = 68.3, and the sum over powers of 3 diverges (abs(c(3^k))^2/3^k grows like 3^(0.81 k)). Measured on zeta's zeros: A_3 = 1.2066 +- 0.0005, A_9 = 1.205 +- 0.003. The mismatch is at the single prime 3 and is the statement that the on-line zeros are those of zeta.
- Sign and unimodular twists, mixed pair: the diagonal term contains abs(c(n))^2 only, so it is zeta's for every twist; the test cannot fail there. The oscillating term (the term with the Hardy-Littlewood factor, which carries the pole that produces level repulsion) exists for zeta's zeros with amplitude 0.9986 +- 0.0008; a prime side without functional equation predicts none. That separation is the existence of a discrete zero set with the right density, not a property of the primes of the twist.

Classification: CLOSED. The statistic measures abs(c(n))^2 for each n (identification of coefficients, map row 33) and the density of the list. The consequence "a = 1 for every prime simultaneously" holds for zeta and the L-functions to 3 or 4 digits per prime, but it is not violated by any control except through (a) missing zeros, at sizes far above the first off-line zero, or (b) one local factor (T-NR).

### 2.3 Var S (MEASURED)
S(t) = N(t) - smooth part, from the lists; between zeros S is linear in the unfolded variable, so the time averages of S and S^2 are exact sums over gaps. K(T) = 2 pi^2 Var S - mean log log(qT/2 pi) - M_q - P2_q with M = 0.2614972128, P2 = sum_{k >= 2} sum_p 1/(k^2 p^k) = 0.1394706, M_5 = M - 1/5, P2_5 = P2 - sum_{k >= 2} 5^-k/k^2. 200 chunks per list; a chunk is dropped when its value is more than 6 MAD from the median (the three list defects).

| list | T | L | Var S | K | error | (K - 1) L^2 |
|---|---|---|---|---|---|---|
| Z0 (T >= 1e4) | 6.0e5 (median) | 11.22 | 0.193799 | 1.01019 | 0.00023 | 1.26 |
| 1e7 | 1.09e7 | 14.36 | 0.206284 | 1.00623 | 0.00023 | 1.29 |
| 1e8 | 1.04e8 | 16.62 | 0.213607 | 1.00488 | 0.00008 | 1.35 |
| 1e9 | 1.003e9 | 18.89 | 0.220040 | 1.00388 | 0.00011 | 1.38 |
| 1e10 | 1.0003e10 | 21.19 | 0.225821 | 1.00311 | 0.00013 | 1.39 |
| 1e11 | 1e11 | 23.49 | 0.231014 | 1.00247 | 0.00016 | 1.36 |
| 1e12 | 1e12 | 25.79 | 0.235737 | 1.00218 | 0.00018 | 1.45 |
| CHI | 5.3e5 | 12.70 | 0.189530 | 1.01230 | 0.00031 | 1.95 |
| CHIBAR | 5.3e5 | 12.70 | 0.189524 | 1.01218 | 0.00031 | 1.93 |

- K(T) = 1 + c/L^2 with c = 1.26 .. 1.45 (mean 1.35); a constant offset from 1 larger than 3e-4 is excluded by the six heights from 1e7 to 1e12 under this form. So b = (1/(2 pi^2))(I_F + M + P2) with I_F = 1.000, Montgomery's value, to about 3 parts in 10^4 after the 1/L^2 extrapolation, and to 0.0022 without any extrapolation at 1e12. The node's tolerance was 0.01.
- The normalisation matters at this level: with log log T in place of log log(T/2 pi) the same data give 0.857, 0.900, 0.911, 0.920 at 6e5, 1e8, 1e9, 1e10, which drifts by 1/L. The coefficient c = 1.35 was not derived here; for conductor 5 it is 1.94.
- Controls: table row 2. Three facts decide the classification. (i) T-NR: on the line its factor is w(2.2 + 2 cos(t log 3)), abs(w) = 1, so the on-line count is zeta's and S by the argument principle is S_zeta plus a sawtooth of variance 1/3; measured Var S_zeta + 0.4367 at every height. Its own coefficient sum diverges (root of the local factor at 3 of modulus 3^0.904). The mismatch is a statement about one local factor. (ii) LIOU, RSGN, UNI have abs(c(n)) = Lambda(n): the constant M + P2 is theirs too. (iii) DH counted with all its zeros (argument principle) has the Euler variance within the sampling error of 2000 zeros (0.1432 against 0.139 .. 0.150 on [10, 2000]); its own coefficient sum diverges. The on-line count fails through the linear growth of the number of missing zeros. Below the first off-line zero (t < 85.7, 43 zeros) the on-line and full counts coincide: Var S = 0.105 against 0.118, inside the sampling error.

Classification of 1 and 2: CLOSED. The statistic is the second moment of the list; it determines abs(c(n))^2 and the number of zeros and nothing else at these sizes.

## 3. Combination 3: the Gabor fingerprint matrix from the prime side

### 3.1 Construction (PROVED; checked to 1e-12 against the zero side)
Window on [-L/2, L/2], L = log X; tests e_a(u) = 1_box(u) e^{i nu_a u}, nu_a = nu_0 + a delta, delta = 2 pi/L (critical spacing); F_a(t) = 2 sin((t - nu_a) L/2)/(t - nu_a); W[a,b] = sum over all zeros rho = 1/2 + i gamma_rho (gamma_rho complex off the line, both signs of the ordinate) of F_a(gamma_rho) F_b(gamma_rho). The convolution e_a * e_b is supported in abs(u) <= L, so the explicit formula gives W = POLE + ARCH - PRIME with a prime sum over n <= X only. There is no truncation error of the prime side: the only error is arithmetic. With E(nu) = sum_{n <= X} c(n) n^{-1/2 + i nu}, D(nu) = sum c(n) log n n^{-1/2 + i nu}:

- PRIME[a,b] = (-1)^(a-b) (L/(pi (a-b))) (Im E(nu_b) - Im E(nu_a)), PRIME[a,a] = 2 (L Re E(nu_a) - Re D(nu_a));
- ARCH[a,b] = (-1)^(a-b) (L/(2 pi (a-b))) (J(nu_a) - J(nu_b)), J(nu) = sum over gamma factors mu of Im psi((1/2+mu)/2 + i nu/2) + 2 Re[e^{-i nu_0 L} sum_k e^{-(1/2+mu+2k)L}/(i(1/2+mu+2k) - nu)]; ARCH[a,a] = L Omega(nu_a) + (1/2) Re psi'(..) + the corresponding residue sum, Omega = log N - d log pi + sum Re psi;
- POLE[a,b] = 2 Re[F_a(i/2) F_b(i/2)] for zeta.

Cost: n values of a Dirichlet polynomial of length pi(X).

Lemma (PROVED). F_a(gamma) F_b(gamma) = (-1)^(a+b) w_gamma/((gamma - nu_a)(gamma - nu_b)) with w_gamma = 4 sin^2((gamma - nu_0) L/2), the same for every node. Hence W = D M D, D = diag((-1)^a), and M[a,b] = (Phi(nu_a) - Phi(nu_b))/(nu_a - nu_b), Phi(nu) = sum_rho w_rho/(gamma_rho - nu): W is the Loewner matrix on the grid of a function that is a Pick function when every w_rho is positive (all zeros on the line) and that gets a pair of complex poles with complex residues w_rho of modulus about X^beta from an off-line pair at distance beta. For a window phi = box times a trigonometric polynomial of period L (Hann: weights 1/4, 1/2, 1/4), W_phi = B W_box B^T, so n_-(W_phi) <= n_-(W_box). The Gabor matrix of the node is therefore a boundary Pick test on a grid, with the prime cutoff X fixing the grid spacing 2 pi/log X.

Trace and Frobenius norm (MEASURED, float64, n = 1500, X = T): tr W/L^2 equals the number of zeros in the window to 1 part in 10^3 (1208.0 against 1207.6 at T = 1000). norm_F^2/(tr W L^2) = 1.181, 1.197, 1.221, 1.235 for zeta at T = 1e3 .. 1e6 against the GUE value 1 + 1/(3 lambda^2), lambda = L/log(T/2 pi): 1.218, 1.217, 1.236, 1.251. LIOU gives the zeta values to 3 digits (1.1792, 1.1973, 1.2216, 1.2348): the first two prime-side numbers of the node do not see the sign twist. DH: 1.43, 1.53, 1.93, 2.47 (weights X^beta of its off-line zeros).

### 3.2 Zeta and the comparison L-function (CERTIFIED)
n_-(W) = 0, all pivots positive, for box and Hann windows:

| family | window | X | n | smallest pivot |
|---|---|---|---|---|
| zeta | [12, 80] | 1e2, 1e3, 1e4, 1e5, 1e6 | 50, 75, 100, 125, 150 | 1e-18, 1e-50, 1e-88, 1e-133, 1e-181 |
| zeta | [1000, 1060] | 1e3, 1e5 | 66, 110 | 3e-5, 1e-41 |
| zeta | [1e4, 1e4 + 60] | 1e4, 1e6 | 88, 132 | 5e-4, 5e-33 |
| zeta | [1e5, 1e5 + 40] | 1e5 | 74 | 0.025 |
| zeta | [1e6, 1e6 + 40] | 1e6 | 88 | 0.02 |
| CHI5R | [12, 84] | 1e3, 1e5 | 80, 132 | 4e-19, 1e-81 |
| CHI5R | [242, 319] | 1e4 | 113 | 3e-21 |

W is positive definite but numerically singular: when the node count exceeds the number of zeros in the window (X > T/2 pi), the surplus directions have eigenvalues that decrease geometrically (2.6e-32, 3.8e-29, 1.3e-26, .. for zeta on [20, 60] at X = 100). float64 cannot decide the sign of anything below about 1e-13 abs(W) n: at T = X = 1e6, n = 1500 the float64 spectrum of zeta has minimum -1.4e-7 and six eigenvalues below the tolerance, while the Arb window at the same height is positive definite. For this reason the planned float64 eigensolve at dimension 4e4 on the GPU was not run: it cannot return a verdict in either direction, and the sizes that decide are the Arb ones.

### 3.3 Controls
DH (CERTIFIED; nu_0 = left end of the window; "edge" = the node of the first negative pivot, so [nu_0, edge] is the smallest leading window with a negative eigenvalue):

| window scanned | X | n | n_- | edge | distance of the edge to the nearest off-line zero | first negative pivot |
|---|---|---|---|---|---|---|
| [12, 84] | 1e2 | 53 | 1 | 80.22 | 5.5 | -18.0 |
| [12, 84] | 1e3 | 80 | 1 | 51.11 | 34.6 | -1.4e-12 |
| [12.3, 84], [12.6, 84] | 1e3 | 79 | 1 | 72.33, 74.45 | 13.4, 11.2 | -2e-16, -6e-16 |
| [12, 84] | 1e4 | 106 | 1 | 36.56 | 49.1 | -6.0e-23 |
| [12, 84] | 1e5 | 132 | >= 2 | 25.10 | 60.6 | certified sign; the elimination stopped at pivot 108 for lack of precision (1500 bits) |
| [20, 84] | 1e2, 1e3, 1e4 | 47, 71, 94 | 0, 1, 3 | none, 75.48, 65.02 | -, 10.2, 20.7 | -, -6e-14, -6e-32 |
| [30, 84] | 1e3, 1e4 | 60, 80 | 1, 1 | 77.30, 68.88 | 8.4, 16.8 | -1e-10, -2e-23 |
| [262, 300] | 1e3, 1e4, 1e5 | 42, 56, 70 | 0, 0, 1 | none, none, 284.92 | -, -, 35.9 (to 320.88; 44.5 to 240.40) | -3.2e-13 |
| [242, 319] | 1e3, 1e4, 1e5 | 85, 113, 142 | 3, 2, 4 | 243.8, 246.8, 242.0 | 3.4, 6.4, 1.6 | -9.8, -0.77, -35 |

So DH does fail in windows that contain none of its off-line zeros, and with X = 1e5 the window [12, 25.1], which holds 6 zeros of DH (8 lie below 25.1), is enough. The reach grows with X: 5.5, 34.6, 49.1, 60.6 for X = 1e2 .. 1e5 from nu_0 = 12, and depends on the phase of the grid (51.1, 72.3, 74.5 for nu_0 = 12, 12.3, 12.6: the residue w_rho rotates with nu_0 L). At fixed X a window further than the reach passes: [262, 300] is certified positive definite at X = 1e3 and 1e4.

Formal twists (float64, X = 1e4, window from 12, n = 100, tolerance 1e-9): LIOU 24 negative eigenvalues (minimum -86), RSGN 34 to 37 in four draws (-85 .. -116), UNI 34 to 37 (-80 .. -109), T-NR 15 (-495). WT (prime side of zeta(s + i), archimedean term of zeta): positive definite, minimum +0.12; also positive at T = X = 1e2 .. 1e6, n = 1500. The twisted prime sides fail at once because their prime side is not the prime side of any function with zeta's gamma factor; no zero of anything is involved. WT passes although it is a control: a translate along the line has the same positivity, and the change of the archimedean term has the sign of a Pick function.

### 3.4 Planted pairs: what a pass of zeta excludes (CERTIFIED)
To the exact prime-side matrix of zeta the exact zero-side term of one extra quadruple gamma_0 -+ i beta, -gamma_0 -+ i beta was added, gamma_0 = (right end of the window) + d. Largest d with a certified negative eigenvalue, and the first d without one:

| window | X | beta = 0.3 | beta = 0.01 |
|---|---|---|---|
| [12, 80] | 1e2 | 10 / 15 | 2 / 5 |
| [12, 80] | 1e3 | 30 / 40 | 20 / 30 |
| [12, 80] | 1e4 | 40 / 60 | 30 / 40 |
| [12, 80] | 1e5 | 100 / 300 | 40 / 60 |
| [12, 80] | 1e6 | 300 / 1000 | 60 / 100 |
| [12, 84], CHI5R | 1e3, 1e5 | 20 / 30 (not detected at 15), 100 / 300 | 2 / 5, 20 / 30 |
| [1000, 1060] | 1e3, 1e5 | 10 / 15 (not detected at 5), 60 / 100 (not detected at 40) | none, 10 / 15 |
| [1e4, 1e4 + 60] | 1e4, 1e6 | 2 / 5, 60 / 100 | none, 5 / 10 |
| [1e5, 1e5 + 40] | 1e5 | 2 / 5 | none |
| [1e6, 1e6 + 40] | 1e6 | 20 / 30 | none |

The negative pivots are 1e-43 and smaller. The reach for the deep pair grows roughly like a power of X (10, 30, 40, 100, 300: about X^0.35, compare the residue X^beta); for the shallow pair it grows by about 15 per decade of X. With X near T the reach is 0 to 20: the window has to sit on the pair. The DH reach in 3.3 (60 at X = 1e5 for beta = 0.31) agrees with the planted law.

### 3.5 Why this is not a survivor
1. It is a boundary Pick test (3.1). Positivity of Pick matrices on finite node sets is the content of map rows 18 and 21 (Pick positivity from verified height; finite Weil tests).
2. A pass of zeta on [nu_0, nu_0 + H] with primes <= X excludes off-line pairs only inside the window extended by the reach of 3.4. To exclude a pair at height T one needs the window near T, n > (number of zeros in the window), i.e. X > T/2 pi, and working precision of 50 to 180 digits for n = 75 to 150. Locating the same zeros by the Riemann-Siegel formula needs sqrt(T/2 pi) terms in float64. The test is a costlier form of verified height.
3. The certified DH failures away from its zeros are real and exact, and they lead its first off-line zero by up to 60 in height. But the lead is the reach of the test, which is the same for a pair planted in zeta, and it is paid for with coefficients up to X = 1e5 for a zero at height 86. No part of it uses the Euler product: the L-function passes because its zeros are on the line, DH fails because its zeros are not, and the formal twists fail because they have no functional equation.
4. The node statement "negative eigenvalues of W count off-line pairs at any depth" holds in exact arithmetic inside the reach: a pair at distance 0.01 from the line is detected as surely as one at 0.3 (table 3.4), but with pivots of size 1e-43.

## 4. Combination 4: J_1 and zeros of F' near the line

### 4.1 Zeta (MEASURED)
abs(zeta'(rho)) = abs(Z'(gamma)) from a Riemann-Siegel sum on GPU 1. Per-zero main term (HEURISTIC; Gonek's leading term is a theorem under RH): l^3/12 + (2 gamma_0/3) l^2 + (gamma_0^2 - 2 gamma_1) l, l = log(t/2 pi).

| list | zeros | l | ratio to leading term | ratio to three terms | error | windows of 2000 zeros: sd, range | windows of 200: sd, share outside [0.9, 1.1] |
|---|---|---|---|---|---|---|---|
| Z0 (1e4 .. 1.1e6) | 1,990,910 | 11.22 | 1.4527 | 0.9998 | 0.0003 | 0.008, [1.007, 1.064] (two-term) | 0.052, 10% |
| 1e7 | 2,000,000 | 14.32 | 1.3505 | 1.0001 | 0.0004 | 0.013, [0.971, 1.060] | 0.073, 19% |
| 1e8 | 2,000,000 | 16.59 | 1.2994 | 1.0001 | 0.0006 | 0.019, [0.958, 1.079] | 0.087, 26% |
| 1e9 | 2,000,000 | 18.89 | 1.2607 | 1.0000 | 0.0007 | 0.024, [0.928, 1.082] | 0.101, 32% |
| 1e10 | 1,000,000 | 21.19 | 1.2312 | 1.0004 | 0.0012 | 0.028, [0.938, 1.082] | 0.119, 40% |
| 1e11 | 500,000 | 23.49 | 1.2067 | 0.9998 | 0.0020 | 0.032, [0.914, 1.104] | 0.137, 45% |
| 1e12 | 300,000 | 25.79 | 1.1882 | 1.0004 | 0.0028 | 0.035, [0.932, 1.095] | 0.158, 51% |

(Window ratios are relative to the two-term value, which is 1.008 to 1.032 too low.) The mean agrees with the three-term polynomial to 4 parts in 10^4 at every height. The per-window spread grows with height (sd of a window of 200 zeros: 5% at 1e5, 16% at 1e12): abs(zeta'(rho))^2 is heavy-tailed, and a window statement of the form "ratio in [0.9, 1.1]" is false for zeta itself in half of the windows of 200 zeros at 1e12. A consequence that must hold in every window cannot be read from this statistic (MV-CAP).

### 4.2 L(chi), DH, T-NR (MEASURED)
- CHI and CHIBAR: (J_1/N)/(l^3/12) = 1.646, 1.453, 1.376, 1.321 at l = 8.28, 10.57, 11.94, 13.11 (l = log(5t/2 pi)), the two characters agreeing to 1e-4. The fitted form is l^3/12 + 0.19 l^2 + 2.2 l; the conductor-dependent second coefficient was not derived here (the guess (2/3)(gamma_0 + log 5/4) = 0.653 is rejected: ratio 0.83). The leading coefficient 1/12 is confirmed in the sense that the ratio decreases toward 1 at the rate of zeta's.
- DH (on-line zeros, abs(f') = (sec theta/2) abs(Z_chi' + Z_chibar')): J_1(DH)/J_1(chi) = 0.844, 0.809, 0.793, 0.782 in [1e3, 1e4), [1e4, 1e5), [1e5, 3e5), [3e5, 1e6). Independent derivatives would give 0.540 and equal derivatives 1.081. The ratio is not constant, so no rescaling brings DH onto the Euler polynomial. In windows of 2000 zeros the sd is 0.6% to 1.7%, so the 16% to 22% deficit is visible from the first window above 1e3 (28 off-line pairs lie below that height); below the first off-line zero there are 43 zeros and the spread of a window of 43 zeros is about 10%: not decidable there.
- T-NR: abs(F'(rho))^2 = abs(zeta'(rho))^2 (2.2 + 2 cos(gamma log 3))^2 at the zeros of zeta. J_1(T-NR)/J_1(zeta) = 10.25, 10.71, 10.96, 11.15, 11.30, 11.42, 11.51 from 1e4 .. 1e6 to 1e12; the weighted means of cos(gamma log 3) and cos(2 gamma log 3) with weight abs(zeta'(rho))^2 are 0.364 .. 0.480 and 0.105 .. 0.224 (unweighted: -0.057 .. -0.025). These are twisted discrete moments of zeta with their own main terms (the limits 1/sqrt 3 and 1/3 would give 12.6). T-NR therefore satisfies the prediction made from its own coefficients; windows of 2000 zeros stay within 5% of the block value. It is not separated from zeta by this statistic.

### 4.3 Zeros of F' next to the line (PROVED model, MEASURED counts)
Near a pair of on-line zeros at distance g, zeta'/zeta(s) = 1/(s - rho_1) + 1/(s - rho_2) + c with Re c = -l/2 on the line (functional equation), so zeta' has a zero at 1/2 + x with x l = (pi^2/4) ghat^2 (ghat = g l/2 pi) to leading order. Check by mpmath on the first 1e5 zeros: for the 40 smallest gaps (ghat < 0.2) x_found/x_model = 1.0013 (1.0002 .. 1.0029); for the gaps with 0.2 < ghat < 0.6 it is 1.06 (0.99 .. 1.18); 76 of the 80 solves converged to a zero between the two ordinates. So the number of zeros of zeta' with 1/2 < Re s < 1/2 + c/l is the number of gaps below (2/pi) sqrt(c), and the Rolle budget is the GUE small-gap law. An off-line pair at +-beta puts the zero of F' on the other side, at 1/2 - beta^2 l/2 (s2 lane, measured there: one zero of F' per pair, at the ordinate of the pair).

Counts over the GUE value N P(gap < (2/pi) sqrt(c)), c = 0.01 / 0.05 / 0.25: zeta 0.85 / 0.84 / 0.87 (Z0), 0.94 / 0.92 / 0.94 (1e8), 0.69 +- 0.09 / 1.00 / 0.98 (1e12); CHI 0.82 / 0.85 / 0.85, CHIBAR 0.84 / 0.83 / 0.85; DH 3.00 +- 0.08 / 1.36 +- 0.02 / 0.78; DH in [1e3, 1e4): 3.6 +- 1.1 (11 gaps against 3.0). Zeta and the L-functions stay inside the budget (below it at finite height, the known finite-height correction); DH exceeds it by a factor 3 at c = 0.01, significant from about 1e4 zeros. This is the small-gap exponent of the s1 lane (2 against 3) in another form: a proportion statement, blind below the resolution of the list and identical for zeta and T-NR.

Classification: CLOSED.

## 5. What goes to the map
- Var S: boundary constant K = 1 + c/L^2, c = 1.35 +- 0.05 (zeta, 6e5 .. 1e12), 1.94 (conductor 5); I_F = 1.000 +- 0.0003 after extrapolation. The open node var-s-constant-decomposition can be marked measured; the coefficient c has no derivation.
- Three list defects (one missed pair each) in the blocks at 1e7, 1e11, 1e12 of lane b-dyson-defect.
- Gabor fingerprint matrix = Loewner matrix on the critical grid; prime side in closed form with no truncation error; reach law of section 3.4. The family "prime-side positivity on a critical grid" x "window away from the zero" is closed by the reach.
- J_1 of zeta: three-term polynomial confirmed to 4e-4 at seven heights; the second coefficient for conductor 5 is open (fitted 0.19).
- Not run: a zero list near 1e13; J_1 of the heat lists; a float64 eigensolve at dimension 4e4 (cannot decide, section 3.2); DH scans at X = 1e6 (stopped: the first attempt at 5000 bits did not finish in the time used).

## 6. Three weakest steps
1. The reach table 3.4 is measured on one grid phase per window and on windows of 40 to 68 units; the dependence on the phase (a factor 2 in the DH reach) was sampled at three phases only. The power-law reading "about X^0.35" rests on five points.
2. The fits of combination 1 use jackknife errors over 40 chunks and a model whose prime products stop at 1e6; the combined zeta amplitude is 1.6 sigma below 1 and the oscillating part 1.7 sigma below 1. No systematic error budget was made for the bin integration (5 sub-points per bin).
3. The J_1 polynomial for zeta was written from memory of the ratios-conjecture literature and then matched to data; the agreement to 4e-4 supports it, but it was not re-derived. For conductor 5 no formula was available.
