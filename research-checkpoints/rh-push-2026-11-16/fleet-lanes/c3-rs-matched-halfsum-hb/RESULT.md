# c3-rs-matched-halfsum-hb: is the Riemann-Siegel half-sum in Hermite-Biehler position at matched height?

Verdict: **precise obstruction; the family is closed for zeta.** F_N(s) = sum_{n<=N} n^(-s), N = floor(sqrt(t/2 pi)), has a positive density of zeros in Re s > 1/2 inside every matched-height window tested (t = 1e4 ... 1e12). At t = 1e12: 8835 zeros right of the line in a window of length 1e4, each certified with arb balls. Every control (DH, L(s, chi_5), translate, period-3 non-multiplicative, random signs) behaves the same way; DH is slightly closer to passing than zeta. The property does not see multiplicativity.

Labels: PROVED / CLASSICAL / MEASURED (float64) / CERTIFIED (arb interval Newton) / ARGUED / OPEN. No statement about zeros of zeta is made or implied anywhere below; all zeros counted are zeros of finite Dirichlet polynomials.

Files: `rslib.py` (evaluator, winding counts, Newton), `certify.py` (arb certification), `server_run.py`, `cert_watch.py`, `pilot.py`, `local_extra.py`, `lehmer.py`, `summarize.py`; data `pilot_zeta.json`, `local_extra.json`, `lehmer.json`, `summary.json`, `server/res_*.json`, `server/cert_*.json`, `server/logs/`. Local runs through `scripts/memcap.sh 8` with `.venv-arb/bin/python` (total under 1 minute). Server: three rhrun units (`rh-c3rs-screen-1118094832` 2 cores + GPU 1, `rh-c3rs-cert-1118094832` 13 cores, `rh-c3rs-var-1118095338` 2 cores + GPU 1), total wall time about 20 minutes, all three exited on their own (checked inactive).

## 1. Plan

Object: f(t) = e^{i theta(t)} F_N(1/2+it) = Z_N(t)/2 + i V(t), where Z_N = 2 Re f is the Riemann-Siegel main sum and V = Im f. Hermite-Biehler position (abs F_N(s) > abs chi(s) F_N(1-s) for Re s > 1/2) holds iff F_N is zero-free in Re s > 1/2 and arg f is increasing; it would force the zeros of Z_N and V to be real and interlacing.

New relative to the map: rows S4/Q13/Q17 and `e1-rs-torus-laguerre-orbit` treat the prime chain or the Laguerre set of Z_N; none counts zeros of the half-sum itself right of the line at matched height.

Decisive first test: count zeros of F_N in Re s > 1/2 in matched windows by the argument principle (local, t <= 1e6). Outcome: positive density. The remaining items of the assignment were then run to establish height-uniformity of the failure, to certify it, and to see whether any variant or control differs.

## 2. Exact statements used

(E1) CLASSICAL (argument principle). For a Dirichlet polynomial F with F -> a_1 != 0 as Re s -> inf, the number of zeros in {Re s > 1/2 + d, T < t < T+H} equals (1/2 pi)[E(T) + D_right - E(T+H) - W_d], W_d = change of arg F up the line Re s = 1/2 + d, E = change of arg along the horizontal edge to Re s = 3, D_right = change on Re s = 3 (there abs(F - 1) < 1). The code evaluates exactly this; integer defect of every count <= 1e-12, no unresolved phase step.

(E2) CLASSICAL (Littlewood's lemma). (1/H) int_T^{T+H} log abs F(1/2+it) dt = log abs a_1 + (2 pi/H) sum_{beta > 1/2} (beta - 1/2) + O(1/H) edge terms. Hence **F_N is zero-free right of the line in a window iff its log-mean on the line equals log abs a_1 = 0 up to O(1/H)**. Checked: the two sides agree to 3 digits in every row (table, last two numeric columns).

(E3) PROVED (two lines). d/dt arg f = theta'(t) - Re[sum log n a_n n^(-s)/F_N] = Re[sum log(N_t/n) a_n n^(-s)/F_N] with log N_t = theta'(t). Change of arg f over a window = change of theta - 2 pi (number of right zeros) + edges. So the number of real zeros of Z_N in the window is at least (change of theta)/pi - 2 n_right - O(1). This is the Siegel/Levinson argument with the unmollified function G = F_N; "Hermite-Biehler position" is the statement "Levinson loss = 0".

(E4) ARGUED (Gaussian model, second moments only). If the phases n^(-it), n <= N, are replaced by independent uniform phases, then with c_k = sum abs(a_n)^2 w_n^2 log^k(N/n)/n: P(d/dt arg f < 0) = (1 - r)/2, r = c_1/sqrt(c_0 c_2), and right-zero density = sum abs(a_n)^2 (log n)/n / (2 pi sum abs(a_n)^2/n). For the sharp cut-off r -> sqrt(3)/2, so the fraction is 0.0670 at every height and the right density is (log N)/(4 pi), one quarter of the density of zeros of Z. r = 1 would need the spectral measure (frequencies log(N/n), masses abs(a_n)^2/n) to be a point mass (Cauchy-Schwarz); no weight or cut-off achieves it. Only abs(a_n) enters.

## 3. Work: counts at matched height

Method: base phases T0 log n mod 2 pi from arb (192 bits), offsets u log n in float64; 16 points per unit height on 12 vertical lines Re s = 1/2 + 0.4k/log N; winding counts by (E1) with adaptive subdivision; zeros located by Newton from the grid and compared with the winding count; right zeros certified with python-flint (interval Newton on a square of half-side min(1e-6, (beta-1/2)/4), 128 bits; exactly one zero in the square, square inside Re s > 1/2). GPU output was used only as a screen.

| family, height | N | H | right zeros (winding) | Newton | arb-certified | right density | Gaussian model | density of Z zeros | ratio | frac d/dt arg f < 0 | model | mean log abs F | 2 pi sum(beta-1/2)/H |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| zeta, 1e4 (local) | 39-43 | 2000 | 401 | 401 | not run | 0.2005 | 0.2546 | 1.1883 | 0.169 | 0.0754 | 0.0650 | 0.1674 | 0.1686 |
| zeta, 1e5 (local) | 126-127 | 2000 | 544 | 544 | not run | 0.2720 | 0.3422 | 1.5414 | 0.177 | 0.0812 | 0.0657 | 0.1921 | 0.1916 |
| zeta, 1e6 (local) | 398-399 | 2000 | 714 | 714 | 103/103 (first 300) | 0.3570 | 0.4330 | 1.9065 | 0.187 | 0.0880 | 0.0661 | 0.2149 | 0.2139 |
| zeta, 1e8 | 3989 | 1e4 | 5372 | 5372 | 5372/5372 | 0.5372 | 0.6156 | 2.6392 | 0.204 | 0.0982 | 0.0665 | 0.2491 | 0.2488 |
| zeta, 1e10 | 39894 | 1e4 | 7260 | 7260 | 7260/7260 | 0.7260 | 0.7984 | 3.3722 | 0.215 | 0.1074 | 0.0667 | 0.2828 | 0.2827 |
| zeta, 1e12 | 398942 | 1e4 | 8835 | 8835 | 8835/8835 | 0.8835 | 0.9815 | 4.1051 | 0.215 | 0.1085 | 0.0668 | 0.2899 | 0.2902 |

(a) MEASURED + CERTIFIED: about one zero of F_N right of the line per five zeros of Z, at every height; the ratio rises from 0.17 to 0.215. 99% of the right zeros have (beta - 1/2) log N < 1.9; none lies right of 1/2 + 4.4/log N in the zeta windows.

(b) MEASURED: the phase derivative is negative on 7.5% to 10.9% of the line, rising with height; the Gaussian value is 6.7%. The excess over the model for zeta is not explained here.

(E3) consequence: the winding of f alone accounts for at least 1 - 2(0.215) = 57% of the zeros of Z_N in the 1e12 window; the other 43% are not seen by arg f.

## 4. Variants (c), (d)

(c) Smooth cut-off w(n) = erfc(c log(n/N_t))/2 (the weight of the smoothed approximate functional equation with test function e^{u^2/4c^2}), MEASURED:

| row | right zeros / H | ratio to Z density | frac < 0 |
|---|---|---|---|
| zeta, 1e8, c = 8 | 5202 / 1e4 | 0.197 | 0.0941 |
| zeta, 1e8, c = 2 | 4579 / 1e4 | 0.174 | 0.0778 |
| zeta, 1e10, c = 8 | 1368 / 2000 | 0.203 | 0.0982 |
| DH, 1e8, c = 8 | 4645 / 1e4 | 0.160 | 0.0639 |

Smoothing lowers the count by 3% to 15% and removes nothing.

(c) Gabcke terms: f_c = f + R/2, R = (-1)^{N-1} (t/2 pi)^{-1/4} [C_0(p) + C_1(p) (t/2 pi)^{-1/2}] (so 2 Re f_c = Z to 8e-7 at t = 7005, 2e-9 at 5e5, checked against mpmath siegelz). MEASURED (local windows of length 2000): fraction of negative phase derivative 0.0747 / 0.0813 / 0.0876 at 1e4 / 1e5 / 1e6 against 0.0755 / 0.0813 / 0.0875 without correction; the count of zeros on the right side changes by -6, -6, +3 out of 401, 544, 714 (from the difference of windings; edge terms neglected). The correction is real and of size t^{-1/4}; it does not move V.

(d) Unequal lengths, F_x with x = m sqrt(t/2 pi) fixed over a window of length 2000 at t = 1e8, MEASURED:

| m | 0.25 | 0.5 | 1 | 1.5 | 2 | 4 | 16 | 128 | 1024 | 3989.4 (x = t/2 pi, H = 300) |
|---|---|---|---|---|---|---|---|---|---|---|
| right zeros / Z zeros | 0.178 | 0.195 | 0.204 | 0.239 | 0.245 | 0.264 | 0.322 | 0.392 | 0.479 | 0.340 |
| frac < 0 | 0.073 | 0.088 | 0.098 | 0.119 | 0.126 | 0.145 | 0.206 | 0.299 | 0.413 | 0.260 |

The count is monotone in x up to x = 1024 N and is positive at every length. Shorter sums have fewer right zeros but never none. ARGUED: for x >> t, F_x(s) = zeta(s) - x^{1-s}/(1-s) + O(x^{-sigma}), so each zero of F_x near a point where zeta vanishes is displaced in a direction set by the phase of x^{-it}, which rotates with x; no side is preferred.

Close pairs (found here by scanning the C_0+C_1-corrected main sum on a 0.01 grid for t <= 1e5; MEASURED): pairs at 7005.06/7005.10 (Lehmer), 17143.79/.82, 71732.903/.914, 66678.077/.095, 63137.212/.232, 57273.663/.688, 85877.870/.895, 36510.167/.195. Seven of the eight have a zero of F_N right of the line within 0.25 in height (beta - 1/2 between 0.099 and 0.21; for 7005: beta - 1/2 = 0.1030 at t = 7004.907), and the phase derivative is negative on about half of the interval spanning the pair (minimum between -3.1 and -7.4). The eighth (36510) has its nearby zero at beta - 1/2 = -0.0094. Structural reason: Hermite-Biehler position needs a zero of V between consecutive zeros of Z, and V has mean spacing equal to that of Z, so close pairs are where interlacing fails first.

## 5. Controls

Riemann-Siegel forms: conductor q has length N_q = floor(sqrt(q t/2 pi)) and theta' = (1/2) log(q t/2 pi). DH: f = sum a_n n^{-s}, a = (1, kappa, -kappa, -1, 0) mod 5, f(s) = X(s) f(1-s) with X(s) = 5^{1/2-s} 2 (2 pi)^{s-1} Gamma(1-s) cos(pi s/2) (checked to 3e-30 at s = 0.7+50.3i). L(s, chi_5): chi(2) = i. Translate: coefficients n^{-3 i T0} with length and theta taken from T0. per3: a_n = (1, 1, -1) for n = 0, 1, 2 mod 3 (not multiplicative, no single functional equation). rand: independent signs.

| control, height | N | H | right zeros | certified | ratio to Z density | frac < 0 | mean log abs F | right of last level |
|---|---|---|---|---|---|---|---|---|
| DH, 1e8 | 8921 | 1e4 | 4743 | 4743/4743 | 0.164 | 0.0663 | 0.2395 | 0 |
| DH, 1e10 | 89206 | 2000 | 1262 | 1262/1262 | 0.174 | 0.0721 | 0.2774 | 1 |
| DH, 1e12 | 892062 | 500 | 383 | 383/383 | 0.176 | 0.0774 | 0.2972 | 2 |
| chi_5, 1e8 | 8921 | 1e4 | 5514 | 5514/5514 | 0.190 | 0.0895 | 0.2209 | 0 |
| chi_5, 1e10 | 89206 | 2000 | 1463 | 1463/1463 | 0.202 | 0.0972 | 0.2509 | 0 |
| translate, 1e8 | 3989 | 1e4 | 5833 | 5833/5833 | 0.221 | 0.1077 | 0.2685 | 0 |
| per3, 1e8 | 3989 | 1e4 | 5769 | 5769/5769 | 0.219 | 0.0809 | 0.5518 | 131 |
| rand, 1e8 | 3989 | 1e4 | 5958 (5607 located) | not run | 0.226 | 0.0646 | 0.8095 | 572 |

- No control separates from zeta in the direction required. Ordered by either statistic, DH (no Euler product) is below zeta, chi_5 (Euler product) is next to zeta, random signs are at the Gaussian value.
- DH below height 1000 (local, mpmath 30 digits): at each of the 28 off-line zeros rho the ratio abs F_N(rho) / abs X(rho) F_N(1-rho) is between 0.59 and 1.35 (it equals 1 up to the remainder, 0.004 to 0.15), and on circles of radius <= 0.1 about rho the ratio drops below 1 in all 28 cases (minimum between 0.04 and 0.91). So the inequality fails near every DH off-line zero, as required; it also fails for zeta at positive density, so this is no separation.
- Backward heat, unimodular twist, zeta(s+a)zeta(s-a), T-NR, Beurling, theta^w: not run. By (E4) the failure depends on abs(a_n) only; these controls would be needed only for a family that passed for zeta.
- One difference that is real: for sequences with an approximate functional equation of this length (zeta, chi_5, translate, DH away from its own off-line zeros) the right zeros stay within about 2/log N of the line, because F_x = L - X F_y there and the second term is O(N^{1/2 - sigma}); for per3 and rand they extend to beta - 1/2 > 0.5. This uses the functional equation, not the Euler product (DH shares it up to 1 to 2 far zeros per window, compatible with its own off-line zeros).

## 6. Where the integers and multiplicativity enter

- Coefficients 1 on all n <= N enter only through abs(a_n) = 1 (the second moments c_0, c_1, c_2) and through the functional equation that fixes the length N and the frame theta. Neither a(mn) = a(m) a(n) nor Lambda >= 0 is used by the object, and the measured statistics do not order the families by multiplicativity.
- A non-multiplicative periodic sequence does not pass; neither does zeta. On the measured statistics the non-multiplicative sequence with a functional equation (DH) is nearer to passing than zeta.

## 7. Pivot (one, analytic; no further compute)

Strongest adjacent idea: by (E3) the family is the Siegel/Levinson method with G = F_N, and the measured right-zero density is its exact loss. Removing the loss means multiplying F_N by a mollifier M with M F_N zero-free right of the line; by (E2) that is "log-mean of M F_N on the line = 0 in every window". This is the Levinson-Conrey programme: its outputs are proportions from mean values (map row P27, MV-CAP), and a loss of exactly zero in every window is a statement of the strength of the target. The pivot lands in a closed row; nothing further was run.

## 8. Requirement flags

- R1 (multiplicativity essential): **not met.** The object uses abs(a_n) and the functional equation only (section 6; controls table).
- R2 (height-uniform, every window): **not met.** The only height-uniform conclusion is the failure itself (positive density in every window tested from 1e4 to 1e12; MEASURED, CERTIFIED zeros at 1e8, 1e10, 1e12).
- R3 (every control fails for a structural reason): **not met.** Zeta and all controls fail alike, for the same second-moment reason (E4).
- R4 (reaches the critical line): **not met.** The statement lives on the critical line but is false there for F_N.

## 9. Three weakest steps

1. Positive density at matched height is MEASURED/CERTIFIED in finite windows, not proved for all heights. (E4) is a model; a proof would need a lower bound for the log-mean of F_N on the line in short windows at t about 2 pi N^2. For fixed N and t -> inf it is classical (Jessen: the mean is the Mahler measure of the associated polynomial, positive once it has a zero in the polydisc, e.g. N >= 4).
2. The zeta-specific excess over the Gaussian value (fraction 0.108 against 0.067 at 1e12, still rising between 1e4 and 1e10) and the direction of the DH/zeta ordering are unexplained; they could change at heights beyond 1e12.
3. Completeness of the counts rests on float64 winding numbers (GPU) agreeing with the Newton lists; only existence, uniqueness in the square and Re s > 1/2 of each listed zero is certified, not the absence of further zeros. The Gabcke comparison neglects edge terms and the analytic continuation of R off the line; the close-pair list comes from a 0.01 grid scan, not from the literature tables.
