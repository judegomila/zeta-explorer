# s4-gabor-weil-inertia-proportion: screening of four combinations (2026-11-19/20)

Screening arm, slug `s4-gabor-weil-inertia-proportion`. Four combinations of idea-graph nodes were turned into finite tests and run on zeta, on L(s, (./5)) (CHI5R) and the complex characters mod 5 (CHI, CHIBAR lists), and on the controls. Labels: PROVED (algebra in this file, checked numerically), CLASSICAL, MEASURED (float64), CERTIFIED (Arb ball arithmetic, every pivot sign decided by a ball that excludes 0). Nothing here is a statement about the location of the zeros of zeta.

**Verdict: 4 combinations tested, 0 survivors.**

- Combination 1 (inertia of the prime-side Gabor-Weil matrix G at bandwidth lambda <= 1). Zeta and L(chi) have no eigenvalue below 0 in 32 windows (T = 1e4 .. 1e8, dimension 6000 .. 24000 per matrix, 519,200 in total). The controls do not all fail at any bandwidth: zeta(s+a)zeta(s-a) with a = 0.02 has no eigenvalue below 0 at every bandwidth up to the cap although all of its zeros are off the line; DH has none at lambda = 0.5, T = 1e4. Where DH fails, the negative eigenvectors sit on its off-line pairs, the count is governed by beta L (depth times log of the prime cutoff) with the threshold measured on pairs planted in zeta, and DH windows free of off-line zeros pass. The sign and unimodular twists fail from lambda about 0.8 on, by a reflection of zeta's own spectrum (section 2.5); at lambda = 0.5 they pass.
- Combination 2 (pair sum of the Montgomery-Taylor kernel against C* = 1.3274993). Zeta is below C* at every height, with margin 2.3/L^2 .. 2.7/L^2 (0.0172 on the first 2e6 zeros, 0.0041 at 1e12). The statistic depends on abs(c(n))^2 only: the sign and unimodular twists have zeta's value to 4 digits. DH, T-NR, zeta(s+a)zeta(s-a) and the heat lists exceed the bound through the size of their coefficients (or of their pair sum), not through the count of off-line pairs.
- Combination 3 (moments m_2, m_3, m_4 of the bandwidth-1 operator). Zeta: 1.3167 .. 1.3295, 1.946 .. 1.988, 3.108 .. 3.218 from T = 1e5 to 1e12, approaching 4/3, 2, 13/4 from below. The GUE values of m_2, m_3, m_4 are invariant under the reflection that the sign twist performs (PROVED, section 4.3); the first moment that changes is the fifth central moment (+0.019 for zeta, -0.027 for the Liouville twist at T = 1e7).
- Combination 4 (number variance ratio and adjacent-box correlation). The premise holds and is explained: the variance in the node's windows is 2 Var S(T), so r(T) = 2 Var S / Sigma^2_GUE falls from 0.41 at 1e4 to 0.28 at 1e10 (no drift toward 1); the variance and the correlation at every box length follow the diagonal prime sum sum cos(tau log p^k)/(k^2 p^k) to 3 or 4 digits at six heights (section 5.2). A second-moment statistic of abs(c(p))^2 again.

Three results that are new relative to the nodes are listed in section 6.

## 0. Objects, lists, code

Objects. ZETA; CHI5R = L(s, (./5)); CHI, CHIBAR = complex characters mod 5 (lists only); DH = Davenport-Heilbronn (584 off-line pairs among 12448 zeros in [1e4, 1.84e4]); HEAT = Riemann-Siegel model of the backward heat deformation at T0 = 1e8, tau = -0.005, -0.02, -0.08 (on-line lists of the s1 lane; no Dirichlet series, so no prime side); T-NR = zeta(s)(1 + 2.2 * 3^(1/2-s) + 3^(1-2s)) (pairs at depth 0.40375, heights (2k+1) pi/log 3); EA = zeta(s+a) zeta(s-a), a = 0.02, 0.1, 0.3 (every zero off the line at depth a; coefficients Lambda(n)(n^a + n^-a), gamma factors shifted by +-a, poles at 1 +- a); LIOU = sign twist eps(p) = -1; RSGN = random signs at the primes; UNI = random unimodular phases at the primes; WT = zeta(s + i).

Matrix (m23 certificate, Alpoge-Furman). Box window on [-L/2, L/2], L = log X, nodes nu_a = nu_0 + a delta, delta = 2 pi/L, a = 0 .. n-1. G = W/L^2, W[a,b] = sum over all zeros (complex ordinate gamma_rho = (rho - 1/2)/i) of F_a(gamma_rho) F_b(gamma_rho), F_a(t) = 2 sin((t - nu_a) L/2)/(t - nu_a). Zero side: G = sum_rho u_rho u_rho^T with u_rho(a) = sinc(pi(y_rho - a)), y = (gamma_rho - nu_0) L/2 pi; an on-line zero gives a unit vector (on the infinite grid), an off-line pair gives 2 Re(w w^T) = 2(a a^T - b b^T) with abs(a)^2 = (S + 1)/2, abs(b)^2 = (S - 1)/2, S = sinh(beta L)/(beta L). Prime side: G = (POLE + ARCH - PRIME)/L^2 with the prime sum over n <= X only and no truncation error (formulas of the s3 lane, `w3.py`). Bandwidth lambda = L/log(qT/2 pi) for the family's own conductor: n nodes cover n/lambda zeros, so the number of eigenvalues above any theta is at most n = lambda N (node m23-dimension-cap).

Sine-process values (PROVED from the pair density 1 - sinc^2; validated on a CUE sample): (1/n) tr G = 1/lambda, (1/n) tr G^2 = 1/lambda^2 + 1/3 for lambda <= 1, hence tr G^2/tr G = 1/lambda + lambda/3 (the node's R_lambda); for a window w: A(w)/lambda + lambda B(w), A = int w^2/(int w)^2, B = int int abs(s - s') w w'/(int w)^2, A + B = C(w).

Lists (compute server). Zeta: first 2,001,052 zeros and Riemann-Siegel blocks at 1e7 (4.0e6 zeros), 1e8 .. 1e12 (2.0e7 each): 1.06e8 zeros. CHI, CHIBAR, DH (on-line zeros) to T = 1e6; three heat lists at 1e8; DH below 2000 with its 84 off-line pairs (table of the control battery).

Code (this directory; local runs through `scripts/memcap.sh 8`; server runs through `rhrun`).

| file | role | known-answer check |
|---|---|---|
| `gw.py` (uses `w3.py` of the s3 lane) | families incl. EA; G from the prime side by row blocks; zero side; Montgomery-Taylor window as box times a cosine polynomial (G_w = B G B^T); spectrum summary | `validate.py`: C* = 0.5 + cot(2^-1/2)/2^1/2 = 1.32749930 by quadrature; C(w_J) = 1.3276108, 1.3275190, 1.3275022 for J = 2, 4, 8; box 4/3; prime side against zero side (Hann window): zeta 7e-15, EA (a = 0.1, 0.3; zeros gamma -+ ia) 4e-14, DH (all zeros below 2000) 5e-14; CUE sample: moments 0.999, 1.324, 1.97, 3.17 at lambda = 1 (finite sample of 1100 points), m2 = 4.31 against 1/lambda^2 + 1/3 = 4.33 at lambda = 0.5 |
| `c1_run.py`, `run_c1.sh`, `run_c1b.sh` | one window: G, eigenvalues, counts N_theta, moments, second-moment numbers; optional comparison with the matrix built from a list | prime side against the list side at n = 6000 .. 12000, zeta, T = 1e4: max entry difference 2e-5 .. 4e-5 (zeros beyond the margin of 4000 nodes), smallest eigenvalue 0.6418 / 0.6417, 0.0610 / 0.0610, 0.008505 / 0.008504 |
| `arb_check.py`, `arb_check2.py`, `arb_check3.py` (use `w3_arb.py` of the s3 lane) | CERTIFIED counts N_theta by LDL^T of G - theta in Arb (300 .. 600 bits) | section 2.7 |
| `local_dh.py`, `local_gap.py`, `local_plant.py` | DH on [1000, 2000] against its table of zeros; DH windows without off-line zeros; planted pairs | section 2.3, 2.4 |
| `c2_pair.py` | pair sum of r = (Phi_w/Phi_w(0))^2 over all pairs closer than 1000 mean spacings plus the analytic tail | `validate2.py`, CUE (4000 points): 1.3319 +- 0.0054 (w*), 1.3374 +- 0.0055 (box) |
| `c3_zero.py` | moments of K = sinc(x_i - x_j) on windows of listed zeros; complex ordinates for T-NR, EA, DH below 2000 | CUE: 1.3341, 2.0020, 3.2530 (4/3, 2, 13/4) |
| `c4_nv.py`, `c4_prime.py` | number variance and adjacent-box correlation on a sliding grid; prime-sum law | CUE: variance / sine-kernel value = 0.98 .. 1.03 for box lengths 0.5 .. 128 |
| `analyze.py`, `tables.py`, `summarize.py` | tables in `out/analysis.md`, `out/tables.md` | - |

Server use. Units `rh-s4c1-*` (6 cores, 9 GB), `rh-s4c1b-*` (4 cores, 7 GB), `rh-s4zero*` (2 cores, 3 to 4 GB), `rh-s4c4b-1120060421`; at most 8 cores at one time; memory limits 9 + 4 GB during the first two hours (peak use 5.7 + 4.0 GB), 12 GB in total afterwards. Eigenvalues on GPU 1 (cupy `eigvalsh`, float64, 24 GB pool limit, matrix sent by row blocks), LAPACK when the GPU had no room. 104 matrices, total dimension 1,532,600; largest single matrix 24000. The dimension 2e5 named in the task was not reached as one matrix: a dense matrix of that size is 320 GB, the lane has 12 GB and the GPU pool 24 GB (the card held 45 to 96 GB of other jobs during the run); the interval [1e5, 1.58e5] was covered by consecutive windows of 24000 instead (72000 nodes at lambda = 0.8, 48000 at lambda = 1). Four units were killed by their memory limit (the first version of `c4_nv.py`, the 12000-point moment matrices, two starts of the 24000 runs); each time the problem or the allocation was reduced (streaming counts, M = 8000, no n x n temporaries), the limit was not raised. One defect found and repaired: a sliding grid with step 1 in the unfolded variable samples the count at a fixed phase and biases the variance (0.5155 instead of 0.4272 at 1e8); the reported numbers use irrational steps. All units of this lane are stopped. Units of other lanes carry similar names (`rh-s4c4b-1120063123` belongs to `s4-suzuki-screw-reserve-credits`) and were not touched.

## 1. Table

Cells: P = behaves as the test predicts for a function with all zeros on the line; F = differs; = means identical to zeta by construction; N = not formulable. "neg" = number of eigenvalues below 0.

| # | combination | statistic | sizes reached | zeta | L mod 5 | DH | HEAT tau < 0 | sign twist (LIOU, RSGN) | unimodular twist (UNI) | zeta(s+a)zeta(s-a) | T-NR | classification |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | af-inertia-lossless-lemma + alpoge-furman-inertia-mechanism + m23-dimension-cap | spectrum of G built from the coefficients c(n), n <= X = (qT/2 pi)^lambda; neg; N_theta against the count of zeros | T = 1e4 .. 1e8; lambda = 0.5, 0.8, 1, 1.25; n = 6000 .. 24000 per matrix; 104 matrices; Arb: 16 windows, n = 37 .. 270 | neg = 0 in all 19 windows with lambda <= 1 (smallest eigenvalue 0.64 .. 0.32 at lambda = 0.5, 0.061 .. 0.012 at 0.8, 0.0085 .. 0.00016 at 1); at lambda = 1.25: N_0.01 = 12642 against 12640 zeros: P | neg = 0 in 13 windows; N_0.01 = 12449 against 12448: P | lambda = 0.5: neg = 0, 2, 19, 58 at T = 1e4, 1e5, 1e6, 1e7; lambda = 0.8: 167 .. 617 per window (29% .. 40% of the pairs); lambda = 1: 511 .. 1232 per window (88%, 98%, 95% of the pairs where the on-line list gives their number); lambda = 1.25: 584 = number of pairs: F, by resolved pairs only (section 2.3) | N (no prime side) | neg = 0 at lambda = 0.5 (4 heights); 23 .. 103 at 0.8; 291 .. 582 at 1: F from lambda about 0.8, by reflection of zeta's spectrum | as the sign twist: 0; 28 .. 113; 275 | a = 0.02: neg = 0 at every bandwidth up to the cap (smallest eigenvalue 1.28, 0.12, 0.011): P although every zero is off the line. a = 0.1: 0, 0 .. 598, 444. a = 0.3: 0, 885, 2379 | neg = 37 .. 2133 at lambda = 0.5, 1335 .. 1851 at 0.8: F (pairs in every window, beta L = 1.9 .. 5.3) | CLOSED. Not every control fails (EA a = 0.02; DH and twists at lambda = 0.5); DH and T-NR fail only through pairs resolved at depth beta L > about 2; boundary Pick test restricted by the cap |
| 2 | m23-proportion-6725 + m23-cgdl-class-optimum + af-closed-form-constants | S2 = (1/N) sum r(gamma - gamma') for w* = cos(sqrt2 s) from the zeros; tr G_w^2/(w0 tr G_w) from the primes; against C* = 1.3274993 (and A/lambda + lambda B at lambda < 1) | zero side: 2.6e7 zeros of zeta (4.0e6 per block), T = 1e3 .. 1e12, all pairs within 1000 spacings; prime side: T = 1e4 .. 1e8, n = 12000 .. 24000 | S2 = 1.31029, 1.31595, 1.31843, 1.32017, 1.32156, 1.32260, 1.32343 (errors 4e-5 .. 5e-4): below C* by 0.0172 .. 0.0041; prime side margin 0.0278 .. 0.0101: P | CHI: 1.30621 +- 0.0006 (margin 0.0213); CHI5R prime side margin 0.035 .. 0.0095: P | own coefficients: lambda = 0.5: +0.020, -0.005, -0.033, -0.066 at T = 1e4 .. 1e7; -0.07 .. -0.64 at lambda = 0.8, -0.20 .. -2.95 at lambda = 1; excess per off-line pair 0.4 .. 10, growing with X: F. On-line list alone: 1.23292 (pairs missing) | on-line lists: 1.33123, 1.33425 (above C* by 0.0037, 0.0068; zeta at the same height 1.31843), 1.24245 for tau = -0.08: F | margin equal to zeta's to 4 digits at every (T, lambda): = (blind) | = (blind) | exceeded at every bandwidth and every a: -0.19 .. -0.42 (a = 0.02), -0.20 .. -0.62 (a = 0.1), -0.31 .. -2.3 (a = 0.3): F, at X = 40 | exceeded by 0.87 .. 46: F | CLOSED. Depends on abs(c(n))^2 only; the excess is not the count of off-line pairs |
| 3 | m23-gue-moment-match + m23-edge-lemma + m23-conjugation-closed-ordinates | m_k = tr K^k/M, K = sinc(x_i - x_j), k = 2, 3, 4 (GUE: 4/3, 2, 13/4); same from the prime side at lambda = 1 | 12 windows of 8000 zeros (96000) per list, 13 lists, T = 1e5 .. 1e12; prime side n = 12000 .. 24000, T = 1e4 .. 1e8 | (1.3167, 1.9456, 3.1075) at 1e5 .. 1e6; (1.3223, 1.9644, 3.1576) at 1e7; (1.3239, 1.9702, 3.1738) at 1e8; (1.3258, 1.9755, 3.1855) at 1e9; (1.3271, 1.9794, 3.1949) at 1e10; (1.3293, 1.9879, 3.2192) at 1e11; (1.3295, 1.9877, 3.2176) at 1e12; errors 0.0006 .. 0.0011, 0.002 .. 0.004, 0.006 .. 0.011: P (below the GUE values, converging) | CHI: (1.3126, 1.9344, 3.0810); CHIBAR the same to 4 digits: P | on-line list: (1.2385, 1.7182, 2.5880): F through the missing zeros; all zeros below 2000 with complex ordinates: (1.396, 2.305, 4.580): F. Longest stretches without an off-line zero hold tens of zeros: no window test | (1.3388, 2.0218, 3.3130), (1.3411, 2.0371, 3.3714), (1.2448, 1.7470, 2.6974): F | prime side: m_2, m_3, m_4 equal to zeta's within 0.0003, 0.001, 0.005: = (reflection invariance, PROVED) | = | complex ordinates: a = 0.02: (2.220, 5.17, 12.7) .. (2.541, 6.40, 17.3); a = 0.1: (5.5, 17.5, 83) .. (284, 1141, 3.7e5): F | on-line list: = zeta; with its pairs: m_2 = 82 .. 1.0e6: F | CLOSED. Moments of the pair, triple and quadruple correlation of the list; blind to the twists through order 4; controls fail only through missing or deep zeros |
| 4 | pointwise-number-variance-suppression + number-variance-max-anchor-sample + gue-two-interval-rigidity-drift + sine-kernel-vif-bound | r(T) = Var(count in half-width sqrt(T/2 pi))/Sigma^2_GUE; Var N(ell), rho(ell) for box lengths 0.5 .. 4e6 | 1.06e8 zeros, T = 1e3 .. 1e12; 4.0e6 CHI and CHIBAR zeros | r = 0.412, 0.406, 0.391, 0.393, 0.376, 0.371 (T = 1e4 .. 5e5; node: 0.35 .. 0.48), 0.337, 0.315, 0.301, 0.282 (1e7 .. 1e10), 0.35 +- 0.05, 0.47 +- 0.12 (1e11, 1e12: 21 and 6 windows); = 2 Var S/Sigma^2 (0.336, 0.315, 0.296, 0.280, 0.266, 0.253). rho = -0.499 .. -0.503 for ell >= 4096 below 1e9 (GUE formula: -0.47 .. -0.48); Var and rho follow the prime sum: P against the prime-sum law, not against GUE | r = 0.388 .. 0.359; saturation 0.378 (zeta: 0.386): P | Var grows linearly with ell (22.5 at ell = 256, 1.2e5 at 2.6e5), rho -> 0: F through the missing zeros | Var 7.8, 41, 77 at ell = 256: F | N (statistic of a list) | N | N (no on-line zero) | on-line list = zeta | CLOSED (round-3 pattern 18, with the correction that primes enter through abs(c(p))^2) |

Survivor criterion: zeta passes at every size; every control fails at a size much smaller than its off-line height explains, or for a reason that does not use the resolution of zeros; all primes together. No row meets it. Row 1: one control passes at every bandwidth (EA, a = 0.02) and two more pass at lambda = 0.5. Rows 2, 3, 4: the twists are not separated.

## 2. Combination 1: inertia of the prime-side matrix at bandwidth lambda

### 2.1 Finite consequence and what would count
Lemma 1 of the source (PROVED there): if G = (on-line rank-one terms) + (pair blocks) + E, norm(E) <= theta, then N_theta(G) <= (distinct on-line points) + (pairs); so N_theta(G) >= (number of zeros counted with multiplicity) forces all of them simple and on the line. Finite consequence tested: from the coefficients alone, (i) at lambda >= 1, N_theta against the count of zeros from the gamma factor (shortfall = number of pairs); (ii) at lambda < 1, where N_theta <= n = lambda N always, the number of eigenvalues below theta (for functions with all zeros on the line it is 0 for theta below the lower edge of the spectrum, about 1/lambda - 1 minus fluctuations). Survival would need a shortfall for every control at some lambda < 1, in windows without off-line zeros or for a reason not tied to them.

### 2.2 Results (MEASURED, float64; counts with their margin in section 2.7)

| T | lam | n (zeta) | X (zeta) | prime powers (zeta) | ZETA | CHI5R | WT | DH | TNR | EA a=0.02 | EA a=0.1 | EA a=0.3 | LIOU | RSGN | UNI |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 10000 | 0.5 | 6000 | 39.89 | 19 | 0 (0.642) | 0 (0.625) | 0 (0.642) | 0 (0.438) | 37 (-0.247) | 0 (1.28) | 0 (1.23) | 0 (0.742) | 0 (0.554) | 0 (0.57) | 0 (0.59) |
| 10000 | 0.8 | 9600 | 364.3 | 91 | 0 (0.061) | 0 (0.0538) | 0 (0.061) | 167 (-1.24) | 1378 (-2.26) | 0 (0.12) | 0 (0.0333) | 885 (-2.01) | 23 (-0.483) | 29 (-0.562) | 28 (-0.343) |
| 10000 | 1 | 12000 | 1592 | 278 | 0 (0.00851) | 0 (0.00391) | 0 (0.00852) | 511 (-3.24) | 1378 (-5.55) | 0 (0.0109) | 444 (-0.27) | 2379 (-4.25) | 307 (-0.639) | 291 (-0.853) | 275 (-0.701) |
| 10000 | 1.25 | 15000 | 1.005e+04 | 1284 | 1172 (-8.26e-12) | 1243 (-1.03e-11) | - | 1803 (-7.54) | - | - | - | - | - | - | - |
| 100000 | 0.5 | 16000 | 126.2 | 42 | 0 (0.494) | 0 (0.515) | - | 2 (-0.108) | 1059 (-0.912) | - | 0 (0.921) | - | 0 (0.21) | - | 0 (0.306) |
| 100000 | 0.8 | 16000 | 2299 | 376 | 0 (0.0178) | 0 (0.0263) | - | 410 (-5.12) | 1851 (-5.41) | - | 65 (-0.276) | - | 74 (-0.545) | - | 96 (-0.558) |
| 100000 | 1 | 16000 | 1.592e+04 | 1914 | 0 (0.00102) | 0 (0.0016) | - | 835 (-12.4) | - | - | - | - | 535 (-0.781) | - | - |
| 1e+06 | 0.5 | 16000 | 398.9 | 97 | 0 (0.392) | 0 (0.435) | - | 19 (-0.548) | 1407 (-1.61) | - | 0 (0.673) | - | 0 (0.145) | - | 0 (0.17) |
| 1e+06 | 0.8 | 16000 | 1.45e+04 | 1755 | 0 (0.0266) | 0 (0.0237) | - | 480 (-7.21) | 1551 (-12.2) | - | 281 (-0.383) | - | 87 (-0.375) | - | 102 (-0.637) |
| 1e+06 | 1 | 16000 | 1.592e+05 | 14733 | 0 (0.000164) | 0 (0.00053) | - | 841 (-21.5) | - | - | - | - | 569 (-0.656) | - | - |
| 1e+07 | 0.5 | 16000 | 1262 | 231 | 0 (0.319) | 0 (0.441) | - | 58 (-1.26) | 2133 (-3) | - | 0 (0.481) | - | 0 (0.185) | - | 0 (0.0837) |
| 1e+07 | 0.8 | 16000 | 9.151e+04 | 8953 | 0 (0.015) | 0 (0.0258) | - | 548 (-13.4) | 1335 (-17.3) | - | 598 (-0.665) | - | 88 (-0.542) | - | 113 (-0.531) |
| 1e+07 | 1 | 16000 | 1.592e+06 | 120830 | 0 (0.000398) | 0 (0.000605) | - | 908 (-41.3) | - | - | - | - | 582 (-0.835) | - | - |
| 1e+08 | 1 | 16000 | 1.592e+07 | 1026688 | 0 (0.000172) | 0 (0.000363) | - | - | - | - | - | - | - | - | - |

Second line of the header: n, X and the number of prime powers are those of zeta; other families use their own conductor (DH, CHI5R: X = (5T/2 pi)^lambda; T-NR: conductor 9; EA: lambda is 2 lambda_own, the same L as zeta, n the same). At lambda = 1.25 the count below 0 is not meaningful in float64 (2350 to 2550 eigenvalues of the surplus directions lie within 1e-3 of 0); the stable counts there are:

| family (T = 1e4, lambda = 1.25, n = 15000) | zeros in the window | eigenvalues above 0.01 | eigenvalues below -1e-4 (the same count for -1e-9 .. -1e-4) | below -0.01 |
|---|---|---|---|---|
| ZETA | 12640 | 12642 | 0 | 0 |
| CHI5R | 12448 | 12449 | 0 | 0 |
| DH | 12448, of which 584 pairs (11281 listed on-line zeros) | 11856 = 12448 - 592 | 584 | 576 |

So at lambda > 1 the statement of the lemma is visible at dimension 15000: for zeta and CHI5R the count above theta reaches the number of zeros (2 and 1 more, from zeros just outside the window), for DH it falls short by the number of off-line pairs (592 against 584) and the negative index equals the number of pairs exactly (584). The same on [1000, 1200] is CERTIFIED (section 2.7): 8 eigenvalues below -0.01 for 8 pairs.

Consecutive windows at T = 1e5, n = 24000 each:

| family | lam | window start | n | X | zeros in window (smooth) | listed on-line zeros | (smooth - listed)/2 | min eig | eig < 0 | eig < 0.1 | nearest eig to 0 | m2/m1 | bound | bound - value |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| DH | 0.8 | 100000.0 | 24000 | 8330 | 30211 | 27107 | 1552 | -5.123 | 617 | 859 | 1.3e-04 | 1.6913 | 1.5236 | -0.1677 |
| DH | 0.8 | 116704.0 | 24000 | 8330 | 30592 | 27430 | 1581 | -3.049 | 582 | 805 | 4.9e-04 | 1.7012 | 1.5362 | -0.1650 |
| DH | 0.8 | 133407.9 | 24000 | 8330 | 30926 | 27724 | 1601 | -3.279 | 579 | 798 | 3.4e-04 | 1.7104 | 1.5473 | -0.1631 |
| DH | 1 | 100000.0 | 24000 | 7.958e+04 | 24136 | 21611 | 1263 | -12.44 | 1232 | 1989 | 4.4e-05 | 1.8180 | 1.3371 | -0.4809 |
| DH | 1 | 113363.2 | 24000 | 7.958e+04 | 24387 | 21907 | 1240 | -9.643 | 1184 | 1904 | 3.8e-05 | 1.8043 | 1.3442 | -0.4601 |
| LIOU | 0.8 | 100000.0 | 24000 | 2299 | 30284 | - | - | -0.5454 | 103 | 260 | 7.5e-05 | 1.5041 | 1.5260 | +0.0219 |
| ZETA | 0.5 | 100000.0 | 24000 | 126.2 | 48703 | 48703 | 0 | 0.3513 | 0 | 0 | 3.5e-01 | 2.1711 | 2.1936 | +0.0225 |
| ZETA | 0.8 | 100000.0 | 24000 | 2299 | 30284 | 30284 | 0 | 0.01778 | 0 | 124 | 1.8e-02 | 1.5041 | 1.5260 | +0.0219 |
| ZETA | 0.8 | 119482.6 | 24000 | 2299 | 30792 | 30792 | 0 | 0.01225 | 0 | 85 | 1.2e-02 | 1.5211 | 1.5428 | +0.0217 |
| ZETA | 0.8 | 138965.3 | 24000 | 2299 | 31228 | 31228 | 0 | 0.02799 | 0 | 54 | 2.8e-02 | 1.5360 | 1.5574 | +0.0214 |
| ZETA | 1 | 100000.0 | 24000 | 1.592e+04 | 24184 | 24184 | -0 | 0.001015 | 0 | 1771 | 1.0e-03 | 1.3180 | 1.3385 | +0.0204 |
| ZETA | 1 | 115586.1 | 24000 | 1.592e+04 | 24519 | 24520 | -0 | 0.002252 | 0 | 1614 | 2.3e-03 | 1.3279 | 1.3479 | +0.0200 |

total DH lam=0.8: 3 windows, dimension 72000, eigenvalues below 0: 1778, off-line pairs (smooth - listed)/2: 4734

total DH lam=1: 2 windows, dimension 48000, eigenvalues below 0: 2416, off-line pairs (smooth - listed)/2: 2503

total LIOU lam=0.8: 1 windows, dimension 24000, eigenvalues below 0: 103, off-line pairs (smooth - listed)/2: 0

total ZETA lam=0.5: 1 windows, dimension 24000, eigenvalues below 0: 0, off-line pairs (smooth - listed)/2: 0

total ZETA lam=0.8: 3 windows, dimension 72000, eigenvalues below 0: 0, off-line pairs (smooth - listed)/2: 0

total ZETA lam=1: 2 windows, dimension 48000, eigenvalues below 0: 0, off-line pairs (smooth - listed)/2: -0

Comparison of the prime side with the on-line list of DH (T = 1e4): the difference G_prime - G_list has 583, 584, 584 eigenvalues above 1 at lambda = 0.5, 0.8, 1 (number of pairs: 584) and 0, 48, 128 below -1. The pair count is therefore readable at lambda = 0.5 with 63 coefficients, but only after the on-line zeros have been subtracted, that is, with the zeros known; it is N(T) - N_0(T) and adds nothing.

### 2.3 Where the negative eigenvalues of DH are (MEASURED locally against the table of all DH zeros below 2000)
Window [1000, 2000]: 1012 on-line zeros, 56 off-line pairs.

| lambda | n | X | terms | neg | pairs with beta L > 1.5 / > 2 | remark |
|---|---|---|---|---|---|---|
| 0.4 .. 0.7 | 451 .. 789 | 17 .. 143 | 13 .. 100 | 0 | 0 .. 7 / 0 | smallest eigenvalue 1.46, 0.75, 0.37, 0.007 |
| 0.8 | 902 | 289 | 195 | 7 | 9 / 1 | eigenvector centres 1863.2, 1353.1, 1105.9, 1454.0, 1154.7, 1701.6, 1278.7; nearest pairs 1864.1, 1354.8, 1109.6, 1464.4, 1154.7, 1699.6, 1274.2 |
| 0.9 | 1014 | 588 | 391 | 28 | 15 / 6 | n exceeds the number of on-line zeros by 2 |
| 1.0 | 1127 | 1194 | 791 | 55 | 22 / 7 | 56 pairs; centres within 1 to 4 of a pair |

Windows without off-line zeros (the five largest gaps between consecutive pairs below 2000, 62 to 80 long, 50 to 74 on-line zeros each), `local_gap.py`: with a margin of 3 or 8 from the neighbouring pairs the smallest eigenvalue is positive in all 40 cases (lambda = 0.6, 0.8, 0.9, 1.0; values 0.0075 .. 0.91, of the size of CHI5R's on the same nodes); with margin 0 (the window touches the pair) 0 negative eigenvalues at lambda = 0.6 and 0.8, and 1 or 2 in 6 of 10 cases at lambda = 0.9 and 1. At bandwidth <= 1 the reach of a pair beyond the window is below 3.

Planted pair in zeta's matrix (`local_plant.py`, n = 700, 24 positions): smallest beta L at which an eigenvalue becomes negative (minimum / median / maximum):

| lambda | T = 1e4 | T = 1e6 | sinh(beta L)/(beta L) - 1 at the median, against 1/lambda |
|---|---|---|---|
| 0.3 | 3.13 / 3.38 / 3.53 | 3.18 / 3.37 / 3.53 | 3.3 against 3.3 |
| 0.5 | 2.50 / 2.79 / 3.10 | 2.29 / 2.78 / 3.14 | 1.9 against 2 |
| 0.65 | 2.11 / 2.40 / 2.74 | 2.00 / 2.53 / 2.88 | 1.3 .. 1.5 against 1.5 |
| 0.8 | 1.19 / 2.23 / 2.60 | 1.24 / 2.01 / 2.52 | 0.8 .. 1.1 against 1.25 |
| 0.9 | 1.19 / 1.95 / 2.37 | 1.23 / 1.94 / 2.52 | 0.75 against 1.1 |

The threshold is S - 1 = 2 abs(b)^2 about 1/lambda (the negative direction of the pair against the mean level of the on-line part): a property of beta L alone. A pass of zeta at (T, lambda) therefore excludes, in the window, pairs of depth beta > c(lambda)/(lambda log(T/2 pi)), c = 2.0 .. 3.4: for lambda = 0.8, T = 1e6: beta > 0.21. This is weaker than the verified height, at higher cost (n = lambda N nodes times pi(T^lambda) coefficients, plus the eigenvalue problem).

### 2.4 The control that passes: zeta(s+a)zeta(s-a) (MEASURED; mechanism PROVED)
As a -> 0 the pair block tends to 2 v v^T, a double on-line point (the adversary of the m23 source), and G_EA -> 2 G_zeta at twice the bandwidth: positive semidefinite at every bandwidth. Measured from EA's own coefficients at T = 1e4: a = 0.02: smallest eigenvalue 1.28, 0.12, 0.011 at lambda_own = 0.25, 0.4, 0.5 (n = 6000, 9600, 12000; at lambda_own = 0.5 the dimension equals 0.95 times the number of pairs), no negative eigenvalue. a = 0.1: none at lambda_own = 0.25 (T = 1e4 .. 1e7); at 0.4: none at 1e4 (aL = 0.59), 65, 281, 598 at 1e5, 1e6, 1e7 (aL = 0.77, 0.96, 1.14); a = 0.3: 885 at (1e4, 0.4). So a function with no zero on the line passes the inertia test at every bandwidth up to the cap when its pairs are shallow in units of 1/L. The same holds for DH at (1e4, 0.5).

### 2.5 The twists: reflection of zeta's spectrum (identity PROVED, consequence MEASURED)
For LIOU, c(p^k) = (-1)^k log p, so c_LIOU + c_zeta = 2 log p on even powers and 0 on odd powers. With the same archimedean and pole terms: G_LIOU + G_zeta = 2 (ARCH + POLE)/L^2 - 2 P_even/L^2, where P_even is the prime part built from n = p^(2k) only (the coefficients of -zeta'/zeta(2s)); it is the Loewner matrix of a truncation of zeta'/zeta(1 - 2i nu) divided by L (not bounded here; checked on one window, T = 1e4, lambda = 0.8, n = 400: identity residual 1e-15, norm of P_even/L^2 = 0.28, off-diagonal part of (ARCH + POLE)/L^2 below 1e-8). (ARCH + POLE)/L^2 is the diagonal matrix of the local values 1/lambda(nu_a) up to off-diagonal terms of order 1/(nu L)^2. Hence spec(G_LIOU) = 2/lambda - spec(G_zeta) up to that perturbation:

| T, lambda | neg(LIOU) | number of eigenvalues of G_zeta above 2 tr G/n | rms difference of the sorted spectra | neg(UNI) |
|---|---|---|---|---|
| 1e4, 0.5 / 0.8 / 1 | 0 / 23 / 307 | 0 / 5 / 239 | 0.051 / 0.032 / 0.032 | 0 / 28 / 275 |
| 1e5, 0.5 / 0.8 / 1 | 0 / 74 / 535 | 0 / 37 / 525 | 0.038 / 0.022 / 0.026 | 0 / 96 / - |
| 1e6, 0.5 / 0.8 / 1 | 0 / 87 / 569 | 0 / 55 / 564 | 0.029 / 0.016 / 0.021 | 0 / 102 / - |
| 1e7, 0.5 / 0.8 / 1 | 0 / 88 / 582 | 0 / 63 / 603 | 0.022 / 0.013 / 0.017 | 0 / 113 / - |

The sign twist fails exactly as far as zeta's spectrum has mass above twice its mean: none at lambda = 0.5 (largest eigenvalue 3.3 .. 3.5 against 4), 0.05% .. 0.4% at 0.8, 2.0% .. 3.8% at 1. The fact that separates zeta from the twists is the one-sided shape of its spectrum (hard lower edge at 0, upper tail beyond 2/lambda). That edge is the positivity of the Weil form on these test functions; for zeta it follows from the zeros near the window being on the line, which is known there. The lower edge of the twists' spectra moves down with height at lambda = 0.5 (LIOU: 0.55, 0.21, 0.15, 0.19; UNI: 0.59, 0.31, 0.17, 0.08 at 1e4 .. 1e7): the pass of the twists at lambda = 0.5 is a statement about these heights.

### 2.6 T-NR and WT
T-NR has a pair every 5.72 in height at depth 0.40375: beta L = 1.9 .. 3.4 at lambda = 0.5 (T = 1e4 .. 1e7), 37 .. 2133 negative eigenvalues per window; at lambda = 0.8, 1335 .. 1851. Its coefficients differ from zeta's at the powers of 3 only. WT (a translate along the line) has zeta's spectrum to 4 digits (smallest eigenvalue 0.6418, 0.06102, 0.008523 against 0.6418, 0.06101, 0.008505): it is not a control for this test.

### 2.7 Re-check of the counts (CERTIFIED for small windows; margin for the large ones)
Arb LDL^T of G - theta, 300 to 600 bits, all pivot signs certified. In every case the certified count equals the float64 count.

| family | window | lambda | X | n | certified N_theta (theta = 0, 0.05, 0.25, 0.5, 1) | float64 entry error |
|---|---|---|---|---|---|---|
| ZETA | [1e4, 1e4 + 150] | 0.5 | 40 | 89 | 89, 89, 89, 89, 87 | 1.3e-12 |
| ZETA | [1e4, 1e4 + 150] | 0.8 | 366 | 141 | 141, 141, 135, 126, 99 | 2.6e-12 |
| ZETA | [1e4, 1e4 + 110] | 1.0 | 1600 | 130 | 130, 126, 114, 101, 71 | 3.0e-12 |
| CHI5R | [1e4, 1e4 + 150] | 0.8 | 1328 | 172 | 172, 172, 168, 153, 119 | 3.5e-12 |
| DH | [1000, 1200] | 0.6 | 58 | 130 | 130, 130, 130, 129, 117 | 2.7e-13 |
| DH | [1000, 1200] | 0.8 | 225 | 173 | 172, 171, 167, 156, 119 (one negative eigenvalue) | 4.0e-13 |
| DH | [1840, 1900] | 0.8 | 345 | 56 | 55, 55, 53, 49, 38 (one negative eigenvalue; pair at 1864.1, depth 0.336) | 4.6e-13 |
| LIOU | [1e4, 1e4 + 150] | 0.8 | 366 | 141 | 140, 140, 138, 128, 97 | 2.2e-12 |
| LIOU | [1e4, 1e4 + 110] | 1.0 | 1600 | 130 | 127, 125, 115, 108, 64 | 2.7e-12 |
| DH | [1000, 1200] | 1.0 | 875 | 216 | above 0.01: 208; below -0.01: 8 (200 on-line zeros, 8 pairs in the window) | - |
| DH | [1000, 1200] | 1.25 | 4761 | 270 | above 0.01: 210; below -0.01: 8 | - |
| ZETA | [1e4, 1e4 + 100] | 1.25 | 10115 | 147 | above 0.01: 120 (117.6 zeros by the smooth count); below -0.01: 0 | - |
| ZETA | [1e7, 1e7 + 40] | 0.8 | 91507 | 73 | 73 (theta = 0), 73 (0.1), 65 (0.5) | 5.6e-9; operator norm 1.1e-8 |
| LIOU | [1e7, 1e7 + 40] | 0.8 | 91507 | 73 | 73, 73, 68 | 5.1e-9 |
| ZETA | [1e7, 1e7 + 30] | 1.0 | 1591551 | 69 | 69, 65, 54 | 6.9e-9; 1.1e-8 |
| ZETA | [1e8, 1e8 + 14] | 1.0 | 15915495 | 37 | 37, 35, 30 | 5.7e-8; 8.6e-8 |

Large matrices: not certified. The count "0 eigenvalues below 0" for zeta and CHI5R has the nearest eigenvalue at distance 0.32 .. 0.64 (lambda = 0.5), 0.012 .. 0.061 (0.8), 1.6e-4 .. 8.5e-3 (1); the float64 error of G in operator norm is 1e-8 at T = 1e7 and 9e-8 at T = 1e8 on the small windows (the error enters through the node values of a Loewner matrix, so it does not grow with n by more than a logarithm), and the eigensolver error is about n eps norm(G) = 1e-11. The counts at lambda <= 0.8 have a margin of 5 orders of magnitude, those at lambda = 1 of 3. One matrix (zeta, T = 1e5, lambda = 1, n = 16000) was solved by LAPACK instead of the GPU and agrees with the GPU run on the larger window (smallest eigenvalue 0.001016 / 0.001015).

### 2.8 Classification: CLOSED
1. Not every control fails. EA with a = 0.02 passes at every bandwidth up to the cap; DH passes at (1e4, 0.5); the twists pass at lambda = 0.5 at every height reached.
2. Where DH and T-NR fail, the failure is the resolution of their pairs: eigenvectors on the pairs, threshold in beta L equal to the planted-pair threshold, no failure in DH windows that keep a distance of 3 from the pairs. The windows that fail are at heights 1e3 to 1e7, far above the first off-line zero of DH (85.7).
3. For zeta the pass is implied by the zeros near the window being on the line (verified height), costs more than verifying them, and by the cap cannot certify more than lambda N of them; at lambda < 1 it excludes only pairs deeper than about 2/L.
4. The matrix is the boundary Pick matrix of the s3 lane (map rows 18 and 21) restricted to n <= lambda N nodes.

## 3. Combination 2: the pair sum of the Montgomery-Taylor kernel

### 3.1 Test
r = (Phi/Phi(0))^2, Phi = Fourier transform of w* = cos(sqrt2 s) on [-1/2, 1/2] in units of the mean spacing; r-hat = w* * w* is supported in [-1, 1], so the pair sum is fixed by the primes below T/2 pi: S2 = (1/N) sum_{gamma, gamma'} r(gamma - gamma') = C* + o(1) for any function whose diagonal prime sum is that of zeta. Zero side: all pairs closer than 1000 spacings in blocks of 4.0e6 zeros, tail 2 int_R^inf r added (2.3e-4). Prime side: tr G_w^2/(w0 tr G_w) with w = p^2, p the cosine polynomial of degree 4 of sqrt(w*) (C(w) = 1.3275190, 2e-5 above C*), computed from G without storing G_w; compared with A/lambda_eff + lambda_eff B, A = 1.006113, B = 0.321406, lambda_eff = n/(zeros in the window).

### 3.2 Zeta and L-functions (MEASURED)

| list | T | L = log(qT/2 pi) | zeros | S2(w*) | error | C* - S2 | (C* - S2) L^2 | S2(box), 4/3 - S2(box) |
|---|---|---|---|---|---|---|---|---|
| Z0 | 1e3 .. 1.13e6 | 11.47 (median) | 2.0e6 | 1.31029 | 0.00054 | 0.01721 | 2.26 | 1.31649, 0.0168 |
| 1e7 | 1e7 .. 1.18e7 | 14.36 | 4.0e6 | 1.31595 | 0.00004 | 0.01155 | 2.38 | 1.32210, 0.0112 |
| 1e8 | 1e8 | 16.59 | 4.0e6 | 1.31843 | 0.00007 | 0.00907 | 2.50 | 1.32454, 0.0088 |
| 1e9 | 1e9 | 18.89 | 4.0e6 | 1.32017 | 0.00006 | 0.00733 | 2.62 | 1.32621, 0.0071 |
| 1e10 | 1e10 | 21.19 | 4.0e6 | 1.32156 | 0.00010 | 0.00594 | 2.67 | 1.32756, 0.0058 |
| 1e11 | 1e11 | 23.49 | 4.0e6 | 1.32260 | 0.00010 | 0.00490 | 2.70 | 1.32859, 0.0047 |
| 1e12 | 1e12 | 25.79 | 4.0e6 | 1.32343 | 0.00015 | 0.00407 | 2.71 | 1.32939, 0.0039 |
| CHI | 1e4 .. 1e6 | 12.95 | 2.0e6 | 1.30621 | 0.00060 | 0.02129 | 3.57 | 1.31264 |
| CHIBAR | 1e4 .. 1e6 | 12.95 | 2.0e6 | 1.30622 | 0.00060 | 0.02128 | 3.57 | 1.31265 |

The bound holds with a margin that decreases like 2.7/L^2 (zeta), 3.6/L^2 (conductor 5); the values converge to C* from below. The windows of 8000 zeros of section 4 give the same numbers (1.31055, 1.31612, 1.31782, 1.31977, 1.32125, 1.32337, 1.32361; errors 6e-4 .. 1e-3). Prime side, bandwidth 1 (the full table for all bandwidths is T2 below):

| family | T | n | X | terms | lam_eff | C measured | A/lam_eff + lam_eff B | bound - C | m2/m1^2 | m3/m1^3 | m4/m1^4 | mu5 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| CHI5R | 10000 | 12000 | 7958 | 1054 | 0.9640 | 1.31871 | 1.35352 | +0.03481 | 1.2770 | 1.8250 | 2.8134 | +0.0053 |
| CHI5R | 100000 | 16000 | 7.958e+04 | 7896 | 0.9962 | 1.30509 | 1.33015 | +0.02506 | 1.3065 | 1.9159 | 3.0347 | +0.0126 |
| CHI5R | 1e+06 | 16000 | 7.958e+05 | 63860 | 0.9997 | 1.30677 | 1.32770 | +0.02094 | 1.3126 | 1.9349 | 3.0851 | +0.0172 |
| CHI5R | 1e+07 | 16000 | 7.958e+06 | 537637 | 1.0000 | 1.31358 | 1.32753 | +0.01395 | 1.3198 | 1.9583 | 3.1439 | +0.0203 |
| CHI5R | 1e+08 | 16000 | 7.958e+07 | 4647479 | 1.0000 | 1.31800 | 1.32752 | +0.00952 | 1.3245 | 1.9737 | 3.1844 | +0.0243 |
| DH | 10000 | 12000 | 7958 | 5452 | 0.9640 | 1.52353 | 1.35352 | -0.17001 | 1.4988 | 2.7469 | 6.9522 | +3.7574 |
| DH | 100000 | 16000 | 7.958e+04 | 55046 | 0.9962 | 1.75451 | 1.33015 | -0.42436 | 1.8204 | 4.1780 | 26.9428 | +49.4431 |
| DH | 1e+06 | 16000 | 7.958e+05 | 533419 | 0.9997 | 2.27262 | 1.32770 | -0.94491 | 2.4434 | 7.2231 | 139.4121 | +383.7008 |
| DH | 1e+07 | 16000 | 7.958e+06 | 5401787 | 1.0000 | 3.78183 | 1.32753 | -2.45430 | 4.2865 | 16.3750 | 1498.3897 | +4788.1870 |
| LIOU | 10000 | 12000 | 1592 | 278 | 0.9494 | 1.33709 | 1.36490 | +0.02781 | 1.2743 | 1.8136 | 2.7828 | -0.0315 |
| LIOU | 100000 | 16000 | 1.592e+04 | 1914 | 0.9948 | 1.31029 | 1.33108 | +0.02079 | 1.3096 | 1.9225 | 3.0510 | -0.0303 |
| LIOU | 1e+06 | 16000 | 1.592e+05 | 14733 | 0.9997 | 1.31175 | 1.32776 | +0.01601 | 1.3173 | 1.9476 | 3.1146 | -0.0285 |
| LIOU | 1e+07 | 16000 | 1.592e+06 | 120830 | 1.0000 | 1.31374 | 1.32754 | +0.01379 | 1.3197 | 1.9570 | 3.1417 | -0.0265 |
| RSGN | 10000 | 12000 | 1592 | 278 | 0.9494 | 1.33737 | 1.36490 | +0.02753 | 1.2745 | 1.8143 | 2.7894 | -0.0257 |
| UNI | 10000 | 12000 | 1592 | 278 | 0.9494 | 1.33713 | 1.36490 | +0.02778 | 1.2742 | 1.8133 | 2.7867 | -0.0240 |
| WT | 10000 | 12000 | 1592 | 278 | 0.9494 | 1.33715 | 1.36490 | +0.02775 | 1.2744 | 1.8140 | 2.7820 | -0.0015 |
| ZETA | 10000 | 12000 | 1592 | 278 | 0.9494 | 1.33716 | 1.36490 | +0.02775 | 1.2743 | 1.8139 | 2.7817 | -0.0015 |
| ZETA | 100000 | 16000 | 1.592e+04 | 1914 | 0.9948 | 1.31019 | 1.33108 | +0.02089 | 1.3095 | 1.9222 | 3.0478 | +0.0113 |
| ZETA | 1e+06 | 16000 | 1.592e+05 | 14733 | 0.9997 | 1.31185 | 1.32776 | +0.01591 | 1.3175 | 1.9484 | 3.1156 | +0.0164 |
| ZETA | 1e+07 | 16000 | 1.592e+06 | 120830 | 1.0000 | 1.31384 | 1.32754 | +0.01369 | 1.3198 | 1.9560 | 3.1371 | +0.0193 |
| ZETA | 1e+08 | 16000 | 1.592e+07 | 1026688 | 1.0000 | 1.31737 | 1.32752 | +0.01015 | 1.3235 | 1.9689 | 3.1718 | +0.0235 |

(Columns m_k/m1^k and mu5 belong to section 4.) Prime side and zero side agree where both exist: zeta at T = 1e7: bound - C = 0.0137 (prime side, n = 16000, one window) against 0.0115 (zero side, 4.0e6 zeros; the prime-side matrix also counts the partial weight of zeros outside the window); at 1e8: 0.0101 against 0.0091.

### 3.3 Controls (MEASURED)

| T | lam | ZETA | CHI5R | WT | DH | TNR | EA a=0.02 | EA a=0.1 | EA a=0.3 | LIOU | RSGN | UNI |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 10000 | 0.5 | +0.0259 | +0.0403 | +0.0258 | +0.0204 | -0.8706 | -0.1860 | -0.1971 | -0.3090 | +0.0259 | +0.0258 | +0.0259 |
| 10000 | 0.8 | +0.0280 | +0.0368 | +0.0280 | -0.0675 | -2.8290 | -0.3256 | -0.3757 | -1.0540 | +0.0282 | +0.0279 | +0.0281 |
| 10000 | 1 | +0.0275 | +0.0339 | +0.0275 | -0.1962 | -8.6675 | -0.4237 | -0.5272 | -2.3437 | +0.0276 | +0.0272 | +0.0276 |
| 10000 | 1.25 | +0.0253 | +0.0289 | - | -0.5577 | - | - | - | - | - | - | - |
| 100000 | 0.5 | +0.0227 | +0.0327 | - | -0.0050 | -1.1248 | - | -0.2240 | - | +0.0227 | - | +0.0227 |
| 100000 | 0.8 | +0.0220 | +0.0279 | - | -0.1670 | -6.9581 | - | -0.4541 | - | +0.0221 | - | +0.0221 |
| 100000 | 1 | +0.0205 | +0.0243 | - | -0.4915 | - | - | - | - | +0.0204 | - | - |
| 1e+06 | 0.5 | +0.0187 | +0.0262 | - | -0.0333 | -1.6089 | - | -0.2479 | - | +0.0187 | - | +0.0187 |
| 1e+06 | 0.8 | +0.0167 | +0.0218 | - | -0.3282 | -18.1301 | - | -0.5323 | - | +0.0167 | - | +0.0168 |
| 1e+06 | 1 | +0.0156 | +0.0206 | - | -1.1107 | - | - | - | - | +0.0159 | - | - |
| 1e+07 | 0.5 | +0.0155 | +0.0210 | - | -0.0662 | -2.5103 | - | -0.2717 | - | +0.0153 | - | +0.0154 |
| 1e+07 | 0.8 | +0.0139 | +0.0163 | - | -0.6357 | -46.3564 | - | -0.6233 | - | +0.0137 | - | +0.0118 |
| 1e+07 | 1 | +0.0136 | +0.0135 | - | -2.9529 | - | - | - | - | +0.0136 | - | - |
| 1e+08 | 1 | +0.0099 | +0.0089 | - | - | - | - | - | - | - | - | - |

- Sign and unimodular twists, WT: the margin is zeta's to 4 digits in all 23 cells. The statistic is the diagonal prime sum of abs(c(n))^2 (PROVED in the source: Montgomery's form); nothing else enters.
- EA: exceeded at every bandwidth, for every a, with 19 prime powers (T = 1e4, lambda_own = 0.25, X = 40). Reason (PROVED for a -> 0): G_EA -> 2 G_zeta at twice the bandwidth, so tr G^2/tr G -> 1/lambda_own + 4 lambda_own/3 against the bound 1/lambda_own + lambda_own/3: excess lambda_own (0.24, 0.38, 0.47 less the finite-height margin; measured 0.19, 0.33, 0.42). This is the classical content of the pair-correlation bound (double zeros violate it; coefficients of size 2 Lambda(n) with density of degree 2). It does not use the position of any zero, and it is blind to the twists.
- DH: at (1e4, 0.5) the bound holds with margin 0.020 (CHI5R: 0.040) although 4.7% of the zeros are off the line; exceeded from lambda = 0.8 or T = 1e5 on. Excess over the CHI5R value, times the number of zeros, per off-line pair: 0.42 (1e4, 0.5), 2.2 (1e4, 0.8), 4.9 (1e4, 1), 3.8 (1e5, 0.8; 1552 pairs, n = 24000), 9.7 (1e5, 1; 1263 pairs, n = 24000): it is not the count of pairs; it grows with X like the pair weights S(2 beta L)^2. All zeros below 2000 with complex ordinates: S2(w*) = 1.3769 on 1899 zeros with 80 pairs (on-line zeros alone: 1.2102).
- T-NR: exceeded by 0.87 .. 46 (the coefficients at powers of 3).
- HEAT, on-line lists at 1e8 with the unfolding of zeta: 1.33123 +- 0.00012 (tau = -0.005, 1.5% of the zeros missing), 1.33425 +- 0.00022 (tau = -0.02), 1.24245 (tau = -0.08); zeta at the same height: 1.31843. The first two exceed C* by 0.0037 and 0.0068. The excess comes from the whole list (the backward flow moves every pair of neighbours closer), not from windows near the lost pairs, and it is continuous in tau: it tends to 0 with tau, so it gives no window statement.

### 3.4 Classification: CLOSED
The pass of zeta is the unconditional theorem behind the 0.6725 proportion, now measured to 1e12 with its margin. The controls that fail do so through abs(c(n))^2 (or, for the heat lists, a mean value over 2e6 zeros); the sign twist, the unimodular twist and the translate are not separated; the excess is not the number of off-line pairs.

## 4. Combination 3: moments of the bandwidth-1 operator

### 4.1 Test
W of the node has the nonzero spectrum of K = (sinc(x_i - x_j)) on the unfolded ordinates of the window (reproducing identity of the critical grid). m_k = tr K^k/M for windows of M = 8000 consecutive zeros, 12 windows per list (96000 zeros; the task named windows of 1e5: one matrix of that size is 80 GB). For controls with off-line zeros the ordinates are x - i beta rho(t) and its conjugate (K complex symmetric, traces real).

### 4.2 Results (MEASURED; error = standard error over the 12 windows)

| list | T | m_2 | m_3 | m_4 | C*(measured) |
|---|---|---|---|---|---|
| GUE (sine process) | | 1.3333 | 2 | 3.25 | 1.32750 |
| Z0 | 1.1e5 .. 1.05e6 | 1.3167 +- 0.0006 | 1.9456 +- 0.0022 | 3.1075 +- 0.0057 | 1.31055 |
| 1e7 | 1.01e7 .. 1.16e7 | 1.3223 +- 0.0006 | 1.9644 +- 0.0022 | 3.1576 +- 0.0059 | 1.31612 |
| 1e8 | 1e8 | 1.3239 +- 0.0008 | 1.9702 +- 0.0027 | 3.1738 +- 0.0070 | 1.31782 |
| 1e9 | 1e9 | 1.3258 +- 0.0007 | 1.9755 +- 0.0022 | 3.1855 +- 0.0058 | 1.31977 |
| 1e10 | 1e10 | 1.3271 +- 0.0007 | 1.9794 +- 0.0025 | 3.1949 +- 0.0071 | 1.32125 |
| 1e11 | 1e11 | 1.3293 +- 0.0010 | 1.9879 +- 0.0038 | 3.2192 +- 0.0105 | 1.32337 |
| 1e12 | 1e12 | 1.3295 +- 0.0011 | 1.9877 +- 0.0037 | 3.2176 +- 0.0100 | 1.32361 |
| CHI | 1e5 .. 9.3e5 | 1.3126 +- 0.0006 | 1.9344 +- 0.0020 | 3.0810 +- 0.0053 | 1.30621 |
| CHIBAR | 1e5 .. 9.3e5 | 1.3126 +- 0.0007 | 1.9345 +- 0.0026 | 3.0816 +- 0.0070 | 1.30619 |
| DH, on-line | 1e5 .. 9.3e5 | 1.2385 +- 0.0007 | 1.7182 +- 0.0024 | 2.5880 +- 0.0060 | 1.23290 |
| DH, all zeros in [200, 2000] (1899, 80 pairs) | | 1.3961 | 2.3046 | 4.5796 | 1.37689 |
| DH, on-line zeros in [200, 2000] (1739) | | 1.2140 | 1.6495 | 2.4377 | 1.21016 |
| HEAT -0.005 | 1e8 | 1.3388 +- 0.0008 | 2.0218 +- 0.0028 | 3.3130 +- 0.0075 | 1.33256 |
| HEAT -0.02 | 1e8 | 1.3411 +- 0.0014 | 2.0371 +- 0.0047 | 3.3714 +- 0.0120 | 1.33562 |
| HEAT -0.08 | 1e8 | 1.2448 +- 0.0016 | 1.7470 +- 0.0051 | 2.6974 +- 0.0128 | 1.24183 |
| EA a = 0.02 (zeta list, ordinates gamma -+ ia; depth 0.068, 0.106, 0.164 spacings) | 1e6, 1e8, 1e12 | 2.220, 2.300, 2.541 | 5.17, 5.48, 6.40 | 12.7, 13.8, 17.3 | 2.196, 2.270, 2.489 |
| EA a = 0.1 (depth 0.34, 0.53, 0.82 spacings) | 1e6, 1e8, 1e12 | 5.47, 18.0, 284 | 17.5, 66.6, 1141 | 83, 1014, 3.7e5 | 5.09, 15.8, 234 |
| T-NR (zeta list plus its pairs) | 1e6, 1e8, 1e12 | 82, 1986, 1.0e6 | 459, 1.1e4, 6.1e6 | 5.0e4, 3.9e7, 1.6e13 | 67, 1559, 7.8e5 |

Zeta's moments are below the GUE values and converge to them; the deficits at 1e12 are 0.0038, 0.012, 0.032 (3.5, 3.3, 3.2 standard errors); at 1e6: 0.017, 0.054, 0.143. The prime side at lambda = 1 (table T3, one window of 16000 nodes) gives the same: 1.3198, 1.956, 3.137 at 1e7 against 1.3223, 1.9644, 3.1576 from the list (the prime-side matrix includes the zeros outside the window with partial weight). m_3 and m_4 at bandwidth 1 are outside the range where the triple and quadruple correlations are theorems (k lambda < 2), so their agreement with the sine process is a measurement.

### 4.3 What the moments cannot see (PROVED), and where the twist first shows (MEASURED)
With m_1 = 1, m_2 = 4/3, m_3 = 2, m_4 = 13/4 the central moments are 1/3, 0, 1/4. Under the reflection mu -> 2 - mu of section 2.5 the second and fourth central moments are unchanged and the third changes sign; it is 0. So the sign twist has the GUE values of m_2, m_3, m_4 as well, and the node's statement "the adversary matches through the third moment, the fourth separates" has a second half: the sign twist matches through the fourth moment. Measured at lambda = 1 from the prime side (T = 1e7, n = 16000): central moments of zeta 0.3198, -0.0033, 0.2318, of LIOU 0.3197, -0.0021, 0.2320; the fifth central moment is +0.0193 for zeta (+0.0203 CHI5R; +0.0235 for zeta at 1e8) and -0.0265 for LIOU. By height (1e4, 1e5, 1e6, 1e7): zeta -0.0015, +0.0113, +0.0164, +0.0193; LIOU -0.0315, -0.0303, -0.0285, -0.0265; the difference is 0.030, 0.042, 0.045, 0.046, and the sum tends to 0 as the reflection becomes exact (RSGN -0.026, UNI -0.024 at 1e4). A fifth moment at bandwidth 1 needs prime correlations of order 5 far outside k lambda < 2.

### 4.4 Controls and classification: CLOSED
- DH: its on-line list has no window of 8000 zeros without off-line zeros (one pair per 20 zeros); the on-line moments fall short through the missing zeros, the full set below 2000 exceeds through the pair weights.
- HEAT: tau = -0.005 and -0.02 are above zeta at the same height by 0.015, 0.05, 0.14 and 0.017, 0.067, 0.20 (13 standard errors each for tau = -0.005): a deformation of the local statistics of the whole list, continuous in tau.
- T-NR on-line list is zeta's list: identical. With its pairs: 82 and more.
- EA: fails at every a (doubling), as in section 3.3.
- Twists: identical to zeta through order 4.
No control departs in a window free of off-line zeros except the heat lists, whose departure is a mean value over the list. Edge lemma (node m23-edge-lemma): not tested numerically; it restricts the admissible kernels and has no finite consequence that distinguishes functions.

## 5. Combination 4: number variance and adjacent-box correlation

### 5.1 The node's ratio (MEASURED)
Window of half-width sqrt(T/2 pi) (mean count L_w = 94 at 1e4, 3.3e6 at 1e12), sliding grid with irrational step, error from 20 chunks.

| T | L_w | Var | r = Var/Sigma^2_GUE(L_w) | 2 Var S/Sigma^2 (Var S of the s3 lane) | independent windows |
|---|---|---|---|---|---|
| 1e4, 3e4, 7e4 | 94, 186, 313 | 0.332, 0.355, 0.363 | 0.412 +- 0.024, 0.406 +- 0.018, 0.391 +- 0.016 | - | 57, 98, 149 |
| 1.5e5, 3e5, 5e5 | 496, 749, 1013 | 0.383, 0.382, 0.388 | 0.393 +- 0.017, 0.376 +- 0.018, 0.371 +- 0.016 | 0.37 (at 6e5) | 219, 309, 399 |
| 1.09e7 | 6018 | 0.4135 +- 0.019 | 0.337 +- 0.016 | 0.336 | 669 |
| 1.04e8 | 21502 | 0.4277 +- 0.019 | 0.315 +- 0.014 | 0.315 | 932 |
| 1e9 | 75977 | 0.4466 +- 0.015 | 0.301 +- 0.010 | 0.296 | 263 |
| 1e10 | 269104 | 0.4551 +- 0.004 | 0.282 +- 0.003 | 0.280 | 74 |
| 1e11 | 943322 | 0.60 +- 0.09 | 0.35 +- 0.05 | 0.266 | 21 |
| 1e12 | 3275405 | 0.89 +- 0.23 | 0.47 +- 0.12 | 0.253 | 6 |
| CHI (3e4 .. 5e5) | 222 .. 1158 | 0.347 .. 0.381 | 0.388, 0.390, 0.381, 0.372, 0.359 | - | 98 .. 399 |

The node's values (0.35 .. 0.48, mean 0.40 for T <= 5e5) are reproduced (0.37 .. 0.41). The premise "no drift toward 1" holds and the drift has a sign: the count in a window much longer than the correlation length of S is S(t + Delta) - S(t - Delta) with nearly independent ends, so Var = 2 Var S(T) = (1/pi^2)(log log(T/2 pi) + 1.40 + 1.35/L^2), while Sigma^2_GUE(L_w) grows like (1/(2 pi^2)) log T: r(T) = 2 Var S/Sigma^2 tends to 0 like 2 log log T/log T. The lists at 1e11 and 1e12 hold 21 and 6 windows of this length and do not test the node's ratio (their error bars are chunk errors of strongly overlapping windows).

### 5.2 Ladder in the box length and the prime-sum law (law CLASSICAL in form (Berry); comparison MEASURED)
With tau = 2 pi ell/L and C(tau) = (1/(2 pi^2)) sum_{p^k <= 1e7} cos(tau k log p)/(k^2 p^k): Var N(ell) = 2 Var S - 2 C(tau), and rho(ell) = (-Var S + 2 C(tau) - C(2 tau))/(2 Var S - 2 C(tau)). Measured / predicted:

| list | ell = 16 | 32 | 64 | 128 | 256 | 1024 |
|---|---|---|---|---|---|---|
| 1e8, Var | 0.4377 / 0.4375 | 0.4188 / 0.4183 | 0.4432 / 0.4431 | 0.4950 / 0.4951 | 0.4028 / 0.4018 | 0.4407 / 0.4524 |
| 1e8, rho | -0.5216 / -0.5219 | -0.4707 / -0.4704 | -0.4415 / -0.4413 | -0.5935 / -0.5942 | -0.4541 / -0.4555 | -0.4602 / -0.4478 |
| 1e10, Var | 0.4820 / 0.4805 | 0.4266 / 0.4262 | 0.4028 / 0.4035 | 0.4728 / 0.4730 | 0.5220 / 0.5220 | 0.4353 / 0.4349 |
| 1e10, rho | -0.5574 / -0.5565 | -0.5279 / -0.5267 | -0.4132 / -0.4139 | -0.4478 / -0.4481 | -0.5764 / -0.5758 | -0.5720 / -0.5702 |
| 1e12, Var | 0.5146 / 0.5144 | 0.4504 / 0.4506 | 0.4630 / 0.4629 | 0.5229 / 0.5227 | 0.3898 / 0.3906 | 0.5366 / 0.5368 |
| 1e12, rho | -0.5623 / -0.5620 | -0.4859 / -0.4863 | -0.4356 / -0.4355 | -0.6272 / -0.6263 | -0.4126 / -0.4164 | -0.5986 / -0.6018 |

(1e7, 1e9, 1e11 in `out/c4_prime.json`: the same agreement; statistical errors of the measured values 1e-4 .. 3e-4 for ell <= 256.) For ell <= 4 the variance is the sine-kernel value within 0.3% .. 13% (ratio 0.997, 0.987, 0.968, 0.936 at ell = 0.5, 1, 2, 4 at 1e12; 0.987, 0.952, 0.915, 0.872 below 1e6). The GUE formula rho = -1/2 + log 2/(2 log 2 pi ell) does not describe the zeros beyond ell of a few units: rho oscillates between -0.33 and -0.68 with the primes and tends to -0.500 (measured -0.4992 +- 0.0013, -0.5002 +- 0.0005, -0.5010 +- 0.0005 at ell = 4096, 16384, 65536 below 1e6; -0.5000 +- 0.0004 at ell = 1e6 at 1e8), not to the GUE value -0.47 .. -0.48 at these lengths. The node sine-kernel-vif-bound is conditional on the sine-kernel model; the zeros have a stronger anticorrelation at long range than the model (rho = -1/2 exactly in the limit), so its inequality VIF < 1 is satisfied with room, for the reason that the variance saturates (the sum of n adjacent boxes has the variance of one box). By the same law the covariances of boxes at lag 2 and more take both signs with the primes; that was not measured here.

### 5.3 Controls and classification: CLOSED
CHI, CHIBAR: as zeta with p = 5 removed (saturation 0.378 against 0.386). DH on-line list: Var N(ell) = 0.32, 0.75, 2.2, 22.5, 331 at ell = 1, 4, 16, 256, 4096 (with the density of the listed zeros fitted by a cubic: 0.34, 0.84, 2.3, 24.7, 297), rho -> 0: the missing pairs act as a Poisson-like deletion; no window without off-line zeros is long enough to test. HEAT: Var = 0.35, 0.54, 0.88, 7.8 (tau = -0.005) at ell = 1, 4, 16, 256; 0.40, 0.95, 3.0, 41 (tau = -0.02). T-NR on-line list is zeta's. The statistic is fixed by Var S and the diagonal sum of abs(c(p^k))^2 cos(tau log p^k): blind to sign and unimodular twists, as rows 1 and 2 of the s3 lane.

## 6. What is new relative to the nodes
1. Inertia at lambda > 1 from the coefficients alone, at dimension 15000: negative index of DH = 584 = its number of off-line pairs in [1e4, 1.84e4]; N_0.01 = number of zeros (+2, +1) for zeta and L(chi). CERTIFIED analogue: 8 = 8 on [1000, 1200].
2. Reflection law for the sign twist: G_LIOU + G_zeta = 2(ARCH + POLE)/L^2 - 2 P_even/L^2 (PROVED); the number of negative eigenvalues of the twist is the number of eigenvalues of zeta above twice the mean (535 / 525, 569 / 564, 582 / 603 at lambda = 1); the twist has the GUE moments through order 4; the fifth central moment has opposite signs (+0.019 / -0.027).
3. Margins: C* - S2 = 2.7/L^2 for zeta up to 1e12; m_2, m_3, m_4 of the bandwidth-1 operator to 1e12; number variance and adjacent-box correlation from the diagonal prime sum to 3 or 4 digits; r(T) = 2 Var S/Sigma^2_GUE.

## 7. Weakest steps
1. The large-matrix counts are float64 (GPU or LAPACK). They are backed by Arb only on windows of 37 to 270 nodes and by a margin argument; no interval enclosure of a 16000 or 24000 eigenvalue problem was made.
2. The task's dimension 2e5 and windows of 1e5 zeros were replaced by 24000 and 8000 (memory limits of the lane; shared GPU). Nothing in the measured laws depends on the window size from 6000 to 24000, but the largest size was not run.
3. Heat control: only on-line lists exist; its off-line zeros were not computed, so rows 1 to 3 have no complex-ordinate version for it, and combination 1 has no heat entry at all.
4. EA with a = 0.02 is the only control that passes combination 1 at every bandwidth; the claim that shallow pairs pass in general rests on it, on DH at (1e4, 0.5), on the a -> 0 limit (PROVED) and on the planted-pair thresholds.
5. Prime-side numbers of sections 3 and 4 come from one window per (family, T) (two for zeta and DH at 1e5); their sampling error is not estimated separately and is taken from the zero-side windows (6e-4 .. 1e-3 on C).

## 8. Files
`RESULT.md` (this file); code as in section 0; `out/c1.jsonl`, `out/c1b.jsonl` (104 records with spectra summaries; eigenvalues in `out/*_ev.npy`), `out/c2_*.json`, `out/c3b.jsonl`, `out/c4b/` (number variance, irrational steps; `out/c4_*.json` are the first run with the biased grid for the lists above 5e6 zeros and are superseded), `out/c4_prime.json`, `out/arb_check*.json`, `out/local_*.json`, `out/validate.json`, `out/analysis.md`, `out/tables.md`.
