# s6-line-polynomials-local-law-density-detector: screening of four combinations

Lane: screener, 2026-11-20. Verdict: 4 combinations tested, 0 survivors.

Labels: PROVED (elementary, written here), CLASSICAL, MEASURED (float64 on the GPU with 80-bit phase reduction unless a precision is stated), HEURISTIC (Bogomolny-Keating / Conrey-Snaith formula), NOT RUN.

Outcome in one paragraph. (1) The premise is false for zeta at stage (i): the detector polynomial at sigma = 3/4 with X = T^(1/4), Y = T^(1/2) exceeds V = 1/2 in 39 % of the unit cells of [T, 2T] at T = 1e4 and in 1.1 % at T = 1e14; the count R(1/2, T) grows as T^0.88 on 1e4..1e9 and T^0.81 on 1e9..1e14 with no zero in the window. The sign and unimodular twists have the same counts to three digits. Davenport-Heilbronn keeps a constant fraction (exponent 0.96 to 0.97) because its truncated inverse has growing coefficients, which is a property of the coefficient sequence. (2) The number variance of zeta zeros at seven heights from 6.8e5 to 1e12 agrees with the prime-side two-point formula at every L from 0.5 to 50 (largest deviation 2.5 standard errors among 56 values); the fitted rate exponent a(L) of Sigma^2 - GUE in log(T/2 pi) equals the exponent of the formula at every L (a = 1.95 at L = 0.5, 0.78 at L = 5). The statistic is a function of the list of on-line ordinates: T-NR has zeta's on-line zeros exactly, so it has zeta's variance and rate at every height while holding 1.07 to 1.9 off-line zeros per mean spacing; the Liouville twist has all its zeros off the line with zeta's variance. (3) P_100 depends on a(n), n <= 100, only (PROVED), so every sequence that agrees with zeta through p <= 97 has the same prefix; the P13 triangle value depends on abs a(n) and is identical for sign and unimodular twists beyond the prefix (PROVED, measured to 12 digits). T-NR at q = 101 fails the P13 value and exceeds the quarter-tail gate through the size of a(101) = 23.1, keeps a positive real part down to t = 0.06, and is negative at t = 0.04, where zeta and the twists are still positive. (4) The two-channel bound is a theorem about arbitrary real coefficient sequences (Polymath15 Lemma 5.1), so the ratio of the true window minimum to it cannot fall below 1 for any control; measured 36 of 36 cases with ratio between 1.25 and 24. The true minimum is small only for T-NR at q = 3 and for zeta(s+1/4) zeta(s-1/4) in windows N <= 3e3 and N <= 3e4.

## Objects

| code | function | coefficients | off-line zeros |
|---|---|---|---|
| ZETA | zeta | 1 | none below 3e12 |
| CHI4, CHI5 | L(s, chi_-4), L(s, (./5)) | chi(n) | none known |
| CHI, CHIBAR | L(s, chi), chi mod 5 complex (zero lists of the s1 lane; used in combination 2 because no zero list of chi_-4 or (./5) exists on the server) | chi(n) | none known |
| DH | Davenport-Heilbronn | (1, kappa, -kappa, -1, 0) mod 5 | 84 pairs below height 2000, 27 with Re >= 3/4 (table of the control battery) |
| EA | zeta(s+1/4) zeta(s-1/4) | n^(-1/4) sigma_(1/2)(n) | all (Re = 1/4 and 3/4) |
| TNR q | zeta(s)(1 + 2.2 sqrt(q) q^-s + q q^-2s), q = 3, 101, 1000003 | 1 + 2.2 sqrt(q) [q divides n] + q [q^2 divides n] | Re = 1/2 +- log(1.5583)/log q (0.404, 0.096, 0.032), ordinates (2k+1) pi/log q; on-line zeros are those of zeta |
| LIOU, SGN, UNI | completely multiplicative: -1 at every prime; random sign; random phase (seed 20261120). With a suffix P (LIOU97, SGN13, ...) the change is at primes > P only | eps(n) | no functional equation |
| HEAT tau | combination 1: coefficients exp((tau/4) log^2 n), tau = -0.1. Combinations 3 and 4: the time t of the approximant is the heat axis | - | - |

## Table

| # | combination | statistic | sizes reached | ZETA | L(chi) | controls | classification |
|---|---|---|---|---|---|---|---|
| 1 | en-etrunc-guth-maynard + mem-etrunc-kappa + knob-a-vanishing-etrunc + etrunc-pt-anchor-lock | R(V, T) = number of unit cells of [T, 2T] containing a grid point (spacing 1/16) with abs D_F >= V, D_F = sum over X < n <= Y of c_F(n) n^(-3/4 - it); exponent of R in T | T = 1e4 .. 1e8 complete coverage for 10 objects; 1e9 complete for ZETA and CHI4 (1e9 cells each), 64 windows (1.68e7 cells) for the rest; 1e10, 1e12, 1e13 sampled for 10 objects; 1e14 for 5; 1e15 (Y = 3.16e7) for TNR 1000003 only | fraction of cells at V = 1/2: 0.389, 0.335, 0.266, 0.197, 0.139, 0.0978, 0.0675, 0.0293 (1e12), 0.0188 (1e13), 0.0114 (1e14). Exponent of R: 0.878 (1e4..1e9), 0.814 (1e9..1e14). R(1/2, 1e9) = 9.78e7 cells, zeros with Re >= 3/4 in the window: 0. Premise (exponent 0) false | CHI4: 0.322 .. 0.00254 (1e14), exponents 0.826 / 0.753. CHI5: 0.337 .. 0.00925 (1e13), 0.864 / 0.779. Same behaviour as zeta | LIOU, SGN, UNI: equal to zeta within 0.011 at 1e4 and 0.002 from 1e6 on (0.0675 at 1e10 for all four). DH: 0.378, 0.371, 0.340, 0.288, 0.261, 0.245, 0.228, 0.201, 0.191, 0.183; exponent 0.958 / 0.974; mean square 0.19 constant from 1e9; largest inverse coefficient 1.16 (X = 10) to 11.6 (X = 1000). TNR 3: every cell. EA: 0.988 .. 0.999. HEAT -0.1: 0.254 .. 0.00257, exponent 0.814 / 0.726. TNR 1000003: identical to zeta for T < 1e12 (PROVED, Y < q); 0.0217 / 0.0131 / 0.00776 at 1e13 / 1e14 / 1e15 | CLOSED at stage (i). Zeta has large values without zeros at every size reached; twists equal zeta; DH differs through inverse-coefficient growth |
| 2 | e200-wall-leading-rate-artifact + finite-n-remainder-requirements + verified-height-multiple-for-floor + esy-local-law-inputs-for-cmb + attractive-mean-field-gap | Sigma^2(L) = variance of the number of zeros in windows of L mean spacings, L = 0.5 .. 50; rate exponent a(L) of Sigma^2 - GUE = K (log(T/2 pi))^-a; comparison with the prime-side formula | zeros: 1.7e6 near 6.8e5, 4.0e6 at 1e7, 2.0e7 at each of 1e8, 1e9, 1e10, 1e11, 1e12 (1.06e8 zeros). Prime side only at 1e15 and 1e20. L(chi) mod 5: 1.65e6 zeros each to 1e6 | data - formula within 2.5 se at all 56 (L, height) pairs; a = 1.950 +- 0.034 (formula 1.952) at L = 0.5; 1.658 +- 0.011 (1.648) at L = 1; 1.220 (1.223) at 2; 0.951 (0.953) at 3; 0.780 (0.780) at 5; 1.097 (1.098) at 10; 1.089 (1.089) at 20; 0.970 (0.970) at 50 | chi, chibar mod 5: data - formula between -0.2 and +2.5 se at the 8 values of L (conductor-5 form) | TNR, on-line zeros: identical to zeta (PROVED). TNR 1000003, all zeros: variance = zeta + lattice (covariance below 0.001), 1.92 to 1.07 off-line zeros per mean spacing from 1e7 to 1e12. LIOU, UNI = n^-i alpha, EA: all zeros off the line or shifted, variance equal to zeta's after rescaling (PROVED). SGN, UNI prime side: diagonal term depends on abs c(n)^2 (PROVED). DH on-line list: 0.266 / 0.334 / 1.19 / 33.9 at L = 0.5 / 1 / 5 / 50 against 0.276 / 0.323 / 0.407 / 0.395. Heat lists tau = -0.005, -0.02, -0.08: 2.40, 34.4, 461 at L = 50 against 0.377 | CLOSED. The rate is the rate of the prime-side formula and is carried unchanged by functions with all or half of their zeros off the line; DH and heat differ by the number of zeros missing from the on-line list |
| 3 | lambda-014-fail-closed + dbn-lower-time-01782354 + mem-profile-sector-excision + multiband-lemma-b + probe-measure-linearity | (A) P13 triangle value T(N), N = 690988 .. 728999, and the share of its absolute sum from n with a prime factor > 13; (B) on the orbit: Re P_100, the tail T_(100,N) split by 97-smoothness, Re(E F); (C) torus minimum of Re P_100; (D) the same at times t = 0.12 .. 0 | (A) 5 values of N x 12 sequence / mollifier choices; (B) N = 690988, 1e6, 2e6, 5e6, 14999999 x 1000 points per window x 12 choices (4.7e10 terms per choice); (C) 150 starts x 3 parameter sets; (D) 7 times x 8 choices | (A) T(690988) = 0.000670513305 (source 0.000670513304), share 0.9145; (B) max abs T = 0.082, 0.110, 0.064, 0.037, 0.035 (source: 0.0735 sampled), min Re(E F) = 0.948 .. 1.003; (C) 0.80616 at N = 690988, 0.95638 at N = 14999999 (source certified bound 0.26843; source sampled minimum of the full sum 0.80028); (D) positive down to t = 0.04 (0.540), -0.120 at t = 0.02 | (A) CHI4 0.2468, CHI5 0.0960 (own factors); (B) max abs T at most 0.093 and 0.074, min Re(E F) at least 1.056 and 0.970 | LIOU13, SGN13, UNI13, TNR 1000003: T(N) equal to zeta's to 12 digits. TNR 101: T(690988) = -0.1065 (fails); max abs T = 0.216, 0.260, 0.099, 0.086, 0.068 (above 1/4 at N = 1e6); min Re(E F) = 0.912 .. 0.994; negative at t = 0.04 (-0.222). LIOU97, SGN97, UNI97: P_100 identical (PROVED), max abs T at most 0.098, min Re(E F) at least 0.947; first negative at t = 0.02 (SGN97, UNI97) or t = 0 (LIOU97). DH with the 96-term mollifier: max abs T at most 0.065, min Re(E F) at least 1.039; negative at t = 0.04. EA: prefix differs; min Re P_100 = -0.017; negative from t = 0.10 | CLOSED. No sequence that agrees with zeta on the prefix and has the same moduli loses positivity; the one that fails (TNR 101) fails through abs a(101) |
| 4 | dbn-global-014-coverage + ythaw-0p17759432-obligation-ledger + dbn-lambda-01787854 + pt-floor-binds-verified-height + mem-route-p-ledger | true = min over 1e4 points of the window of abs(E f); tri and two = triangle and two-channel lower bounds; ratios true/two, true/tri; second derivative of rho = abs(E f - 1)^2 | N = 1e3, 3e3, 1e4, 3e4, 1e5, 3e5, 690988, 1e6, 3e6, 1e7 x 13 sequence / mollifier choices (1.6e11 terms per choice); derivative: 65 cells of width 1/50 at N = 690988 for 6 sequences | true = 0.459, 0.641, 0.800, 0.857, 0.920, 0.948, 0.969, 0.966, 0.990, 0.990; two > 0 from N = 690988 (0.111), tri > 0 from 1e6 (0.137); true/two = 8.74, 3.79, 1.76, 1.31. max abs rho_xx = 7.5 over 64 cells (source cap 2381) | CHI4: true 0.465 .. 1.016, two > 0 from 3e5, true/two 7.35 .. 1.25. CHI5: 0.475 .. 0.998, two > 0 from 690988, 3.96 .. 1.28 | LIOU, SGN: bounds identical to zeta (PROVED), true 0.499 .. 0.994 and 0.511 .. 0.989. TNR 1000003: equal to zeta for N < q, 0.990 at 3e6 and 1e7. DH, 96 terms: true 0.438 .. 1.027, two > 0 from 3e5, true/two 10.4 .. 1.25; no mollifier: 0.243 .. 0.781. TNR 3: true 0.065, 0.051 at N = 1e3, 3e3, then 0.429 .. 0.916 (own factor); 0.0115, 0.0113 with zeta's mollifier. EA: 0.021, 0.011, 0.011, 0.058 for N <= 3e4, then 0.505 .. 0.852. No case with true < two | CLOSED. The failure criterion cannot occur (lemma); small minima occur for the two controls whose zeros lie to the right of the test line, in the windows nearest to them |

Survivor criterion: zeta passes at every size reached; every control fails at a size much smaller than its off-line height explains, or for a reason that does not use the resolution of zeros; all primes together. Row 1: zeta fails the premise. Row 2: T-NR, the twists and EA are not separated. Row 3: the twists are not separated. Row 4: no control fails.

## 0. Code and validation

One code base in this directory. Local runs through `scripts/memcap.sh 8` with `.venv-arb/bin/python`; server runs through `rhrun`, units `rh-s6c1a`, `rh-s6c1b`, `rh-s6c1c`, `rh-s6c1d`, `rh-s6c1s`, `rh-s6c1q`, `rh-s6c1f`, `rh-s6c2`, `rh-s6c3A`, `rh-s6c3A2`, `rh-s6c3B`, `rh-s6c3D`, `rh-s6c4a`, `rh-s6c4b`, `rh-s6c4d` (2 cores, 2 to 12 GB each, GPU 1). All are stopped.

| file | role | known-answer check |
|---|---|---|
| `lp.py` | coefficient sequences, Dirichlet inverse, detector coefficients | mu(n) for n <= 30; sigma_(1/2)(n) n^(-1/4) for n <= 6; c(n) = 0 for 2 <= n <= X (`inv_check` = 0 in every row) |
| `core.py` (s2 lane) | window evaluation of a Dirichlet polynomial by Gaussian gridding and one FFT; phases t log n reduced in 80-bit arithmetic | each run compares four grid points with the direct sum: largest difference 3e-9 |
| `c1.py` | combination 1 | measured mean square / sum abs(c)^2 n^(-3/2) = 0.9990 .. 1.0011 at T = 1e4 and 0.9999 .. 1.0002 from 1e5 on (Montgomery-Vaughan) |
| `rmt.py` (s3 lane), `c2.py` | GUE number variance, two-point formula with prime products to 1e6, number variance of a list | closed form of the GUE variance against the numerical double integral; zeta against the formula (row 2) |
| `tri.py` (s3 lane, plus the two-channel term and a partial sum) | triangle and two-channel bounds | T(2000) at t = 0.36: 0.09258638941981111 (s3 ball value 0.09258638941981105); T(690988) at the P13 parameters: 0.000670513304967 (source 0.000670513304) |
| `orbit.py`, `c3.py`, `c4.py`, `c4d.py` | sums on the orbit x = x_N + 4 pi f (2N+1); combinations 3, 4 | three points at N = 300 against mpmath: 8e-11; the inequality chan >= two holds in all 36 cases with two > 0 (smallest difference 0.102) |
| `recheck.py` | 30-digit recomputation of selected values | abs D at the maximiser: zeta T = 1e8: 3.568011158757 (float64) / 3.568011158752; zeta T = 1e12: 2.66188687 / 2.66188681; DH T = 1e12: 8.66882383 / 8.66882381; abs(E f) at the minimiser of zeta, N = 690988: 0.96892808 / 0.96892812 |

Precision. The 80-bit phase reduction gives an error of about 1e-19 x t log n: 2e-7 rad at T = 1e12, 2e-3 rad at T = 1e15; for the orbit sums 1e-3 rad at N = 1.5e7. Counts and minima are screens; the four rechecked values above carry the statements "zeta has a value above 1/2 with no zero in the window" and "true > two at N = 690988". No ball arithmetic was run in this lane; the sign statements in row 3 (A) are sums of 4e7 positive float64 terms with margins 0.1 and above, except zeta's own 6.7e-4, which reproduces the source's Arb value to 12 digits.

## 1. Zero-detector large values at sigma = 3/4

Finite consequence. With mu_F the Dirichlet inverse of a_F, c_F(n) = sum over d dividing n, d <= X, of mu_F(d) a_F(n/d); c_F(1) = 1, c_F(n) = 0 for 2 <= n <= X (checked in every run). D_F(t) = sum over X < n <= Y of c_F(n) n^(-3/4 - it), X = floor(T^(1/4)), Y = floor(T^(1/2)). R(V, T) = number of cells [k, k+1) of [T, 2T] in which abs D_F >= V at one of 16 grid points; it lies between one half of and the full size of the largest 1-separated set, up to the grid. Stated before the run: survival needs R(V, T) bounded for zeta at some fixed V on the verified range and R growing like T for every control, including the twists.

Stage (i), zeta (MEASURED, complete coverage to 1e9; recheck at 30 digits of the maxima at 1e8 and 1e12).

| T | X | Y | sum abs(c)^2 n^(-3/2) | cells with abs D >= 1/2 | >= 1 | >= 2 | max abs D |
|---|---|---|---|---|---|---|---|
| 1e4 | 10 | 100 | 0.2035 | 0.389 | 0.0162 | 0 | 1.66 |
| 1e5 | 17 | 316 | 0.1886 | 0.335 | 0.0304 | 5.0e-5 | 2.26 |
| 1e6 | 31 | 1000 | 0.1561 | 0.266 | 0.0259 | 2.5e-4 | 2.84 |
| 1e7 | 56 | 3162 | 0.1238 | 0.197 | 0.0189 | 2.0e-4 | 2.95 |
| 1e8 | 100 | 10000 | 0.0952 | 0.139 | 0.0127 | 1.9e-4 | 3.57 |
| 1e9 | 177 | 31622 | 0.0718 | 0.0978 | 0.00699 | 5.1e-5 | 3.83 |
| 1e10 (sampled) | 316 | 1e5 | 0.0545 | 0.0675 | 0.0042 | 2.7e-5 | 2.69 |
| 1e12 (sampled) | 1000 | 1e6 | 0.0312 | 0.0293 | 0.00128 | 5.1e-6 | 2.66 |
| 1e13 (sampled) | 1778 | 3.16e6 | 0.0236 | 0.0188 | 6.9e-4 | 1.7e-6 | - |
| 1e14 (sampled) | 3162 | 1e7 | 0.0178 | 0.0114 | 3.2e-4 | 6.0e-7 | 2.40 |

R(1/2, T) = 3.9e3, 3.4e4, 2.7e5, 2.0e6, 1.4e7, 9.8e7 for T = 1e4 .. 1e9, and 1.1e12 at T = 1e14 by extrapolation from the sample. There is no zero of zeta with real part >= 3/4 in any of these windows up to 1.5e12 (verified height). So for zeta every large value counted is a large value without a zero, and the exponent of R is 0.88 falling to 0.81, not 0. The mean square decreases like X^(-1/2) = T^(-1/8) (0.0545 to 0.0312 over two decades), and the tail is far heavier than Gaussian (at 1e12 the fraction above 1 is 1.3e-3; exp(-1/0.0312) = 1e-14). An exponent below 1 by more than the measured 0.2 is not reached at 1e14; no size at which R(1/2, T) < 1 can be read from these data.

The stage (i) rule stops the test here. The controls were run for the record.

Controls (MEASURED; `c1_table.txt`).
- LIOU, SGN, UNI: c_F(n) = eps(n) c_zeta(n) (PROVED: the inverse of a completely multiplicative unimodular sequence is eps mu). Same mean square to 4 digits, same fractions (0.0675 at 1e10 for all; 0.0293, 0.0293, 0.0294 at 1e12). For eps(n) = n^(-i alpha) the polynomial is the zeta polynomial at t + alpha.
- DH: the fraction at V = 1/2 falls from 0.378 to 0.183 and the fraction at V = 1 stays at 0.065 from 1e7 to 1e14; at V = 2 it grows from 3.2e-4 to 0.015. The mean square stops decreasing (0.2278, 0.2252, 0.1973, 0.1909, 0.1908, 0.1901, 0.1937 at 1e4, 1e6, 1e8, 1e9, 1e10, 1e12, 1e14) because the truncated inverse has coefficients up to 1.16, 1.43, 4.29, 6.27, 11.6 at X = 10, 31, 100, 316, 1000. Zeros of DH with real part >= 3/4: 27 below 2000, 13 in [1000, 2000], density 0.013 per unit height; R(1/2, T) is 0.18 T to 0.25 T, 14 to 19 cells per such zero if that density persists. Under the criterion of the assignment (count above the number of zeros with Re >= 3/4) DH has large values without zeros; so has zeta.
- TNR 3 (zeros at Re = 0.904, one per 5.72 in height): every cell is above 1/2; mean square 45 to 412; largest inverse coefficient 15 to 898. EA (zeros of zeta(s - 1/4) on Re = 3/4, more than one per cell): 0.988 to 0.999.
- TNR 1000003: for T < 1e12 the polynomial is zeta's (Y < q, PROVED), although the function has 2.2 off-line zeros per unit height at Re = 0.532. At 1e13, 1e14, 1e15 the fractions are 0.0217, 0.0131, 0.00776 (zeta 0.0188, 0.0114, not run).
- HEAT -0.1: 0.254 to 0.00257 (1e13), below zeta at every T.

How the object enters. Through its coefficients: mean square sum abs(c_F)^2 n^(-3/2) and the growth of the truncated inverse. The count does not depend on the argument of a completely multiplicative twist. Control onset against off-line height: DH departs from zeta's trend from T = 1e6 on, where X = 31; its first off-line zero is at height 85.7 and the departure tracks X, not the window.

Why closed. Zeta fails the premise on 1e4 .. 1e14. The separation of DH is the one found in the s2 lane (inverse-coefficient growth), and the twists are not separated.

NOT RUN: T = 1e15 for nine of the ten objects (the first attempt ended in an out-of-memory error on the shared GPU; later the launcher refused new jobs above 2 GB because less than 48 GB was available on the machine); T >= 1e16; complete coverage at 1e9 for the objects other than ZETA and CHI4 (the job was stopped after 25 minutes to reduce load; those objects have 64-window samples).

## 2. Number variance with a rate

Finite consequence. For a list with unfolded ordinates, Sigma^2(L) = mean of (count in [u, u+L) - L)^2 over u on a grid of step 1/4. Prime side: Sigma^2_BK(L; T) = L + 2 int_0^L (L - u)(r2(u) - 1) du with the two-point function of the s3 lane (Conrey-Snaith form: GUE term, diagonal term sum over prime powers of log^2 p cos(r log n)/n, oscillating term with zeta(1 + ir) zeta(1 - ir) A(ir); HEURISTIC). The products are cut at primes <= 1e6; the neglected part of the diagonal term is below log(1e6)/1e6 = 1.4e-5 in r2 and the sums over primes to 1e9 named in the assignment were not needed at the measured precision (standard errors 2e-5 to 4e-3). Rate: weighted fit of Sigma^2 - Sigma^2_GUE = K Lg^(-a), Lg = log(T/2 pi), over the seven heights, for the data and for the formula at the same heights with the same weights. Stated before the run: survival needs a control with an Euler-type prime side and zeros off the line to show a different rate in windows free of its off-line zeros.

Zeta (MEASURED; `c2_table.txt`). Number of (L, height) pairs: 56. Largest deviations (data - formula)/se: +2.5 (list near 6.8e5, L = 5), -2.4 (same list, L = 50), +2.4, +2.3; at the six higher lists all 48 values are within 1.9 se. Examples at 1e12: L = 0.5: 0.27946 +- 0.00003 (formula 0.27943, GUE 0.28016); L = 5: 0.47074 +- 0.00004 (0.47072, 0.50899); L = 50: 0.46475 +- 0.00004 (0.46479, 0.74239).

| L | a from zeros | a from the formula | K from zeros | K from the formula |
|---|---|---|---|---|
| 0.5 | 1.950 +- 0.034 | 1.952 | -0.411 | -0.415 |
| 1 | 1.658 +- 0.011 | 1.648 | -0.953 | -0.926 |
| 2 | 1.220 +- 0.004 | 1.223 | -0.734 | -0.741 |
| 3 | 0.951 +- 0.003 | 0.953 | -0.518 | -0.521 |
| 5 | 0.780 +- 0.002 | 0.780 | -0.482 | -0.483 |
| 10 | 1.097 +- 0.001 | 1.098 | -2.348 | -2.357 |
| 20 | 1.089 +- 0.001 | 1.089 | -5.194 | -5.192 |
| 50 | 0.970 | 0.970 | -5.822 | -5.822 |

The exponent tends to 2 only as L tends to 0 (small-L coefficient -(Lambda_BK/pi^2 rho^2) with Lambda_BK = 1.57314, rho = Lg/2 pi); at L >= 2 the fitted a is an effective exponent of a function of L/Lg and L log p, not a rate. With a = 1.95 the source's requirement log T >= 200^(1/a) gives 15.1. Prime side at heights without zero lists: Sigma^2_BK - GUE = -0.00045, -0.00275, -0.0310, -0.2745 at L = 0.5, 1, 5, 50 for T = 1e15 and -0.00025, -0.00155, -0.0224, -0.2356 for T = 1e20.

Positive comparison. chi and chibar mod 5 (1.65e6 zeros each, heights 2e5 .. 1e6, conductor-5 form): deviations +0.8, +2.4, +1.9, +2.3, +1.7, +2.2, +1.5, +2.5 se (chi) and -0.2 .. +2.5 se (chibar); the two lists share most of their sampling error. One height range only, so no rate fit.

Controls.
- T-NR (PROVED): 1 + 2.2 w + w^2, w = q^(1/2 - s), vanishes only at abs w = 0.642 or 1.558, so the zeros of T-NR on the line are exactly those of zeta. Sigma^2 and a(L) of the on-line zeros are zeta's at every height and every L. Measured for q = 1000003 with all zeros counted, windows of the same length in t (`tnr_union` in `out/c2_zeta.json`): variance = variance of zeta + variance of the lattice, covariance below 0.001 in absolute value; off-line zeros per mean spacing 1.92 (1e7), 1.66 (1e8), 1.46 (1e9), 1.18 (1e11), 1.07 (1e12). No window of one mean spacing or more is free of off-line zeros, and the on-line statistic is unchanged.
- LIOU (PROVED): zeta(2s)/zeta(s) has its zeros at rho/2, real part 1/4; the list of ordinates gamma/2 at height T has the number variance of zeta at height 2T. UNI with eps(n) = n^(-i alpha): zeta's list shifted by alpha. EA: zeta's list twice, at real parts 1/4 and 3/4; variance 4 Sigma^2_zeta(L/2). Each has all zeros off the line and zeta's rate.
- SGN, UNI, prime side (PROVED): the diagonal term is sum abs(c(n))^2 cos(r log n)/n, unchanged by any unimodular twist; the oscillating term uses the functional equation, which these do not have.
- DH, on-line list (1.48e6 zeros, 10.5 % of the zeros missing from the line), unfolded with the full counting function: 0.266, 0.334, 0.512, 0.711, 1.19, 2.72, 7.08, 33.9 at L = 0.5 .. 50 (conductor-5 formula 0.276, 0.323, 0.362, 0.377, 0.407, 0.409, 0.331, 0.395). Heat lists at 1e8, tau = -0.005 / -0.02 / -0.08 (1.5 %, 10 %, 42 % missing): 0.284 / 0.287 / 0.269 at L = 0.5, 0.584 / 1.39 / 6.12 at L = 5, 2.40 / 34.4 / 461 at L = 50 (formula 0.278, 0.455, 0.377). The excess grows like L^2 times the variance of the local fraction of missing zeros: the count of on-line zeros in a window against the main term is Turing's count.

How the object enters. Through the list of on-line ordinates (zeros), with no reading of where the other zeros are. Control onset against off-line height: DH and the heat lists differ at L of the order of the spacing between missing zeros (L = 2 to 5 for 10 % missing), that is, in windows that contain an off-line zero.

Why closed. Same rate for zeta and for functions with all or about half of their zeros off the line; different values only where the on-line count is short by the off-line zeros.

NOT RUN: zeros near 1e15 and 1e20 (no lists on the server; a block of 1e5 zeros at 1e15 costs about 5e12 Riemann-Siegel terms and was not generated); zero lists for chi_-4 and (./5).

## 3. Prefix certificates with sequences altered beyond the prefix

Definitions (text of `research-inputs/lambda-014-2026-08-27/EARLY_P97_PROGRESS_2026-08-28.md`, pull request 7; `dbn-lambda-orphan-wt/CANDIDATE_PARAMETERS_01782354.md`). b_n = exp((t/4) log^2 n); A_97(s) = prod over p <= 97 of (1 - b_p p^(-s)); chart of the s3 lane: sigma_B = (1+y)/2 + (t/4) log(N^2 - t/16), s_A = conj(s_B) - y, g = exp(0.02 y - (y/2) log(N^2 - t/16)), theta_n = (x/2) log n. P_100 = A_97(s_B)(D_100(s_B) + g D_100(s_A)); T_(100,N) = A_97(s_B)((D_N - D_100)(s_B) + g (D_N - D_100)(s_A)); t = 26399999/2e8, y = sqrt(7/25 - 2t) = 0.126491. The source certifies Re P_100 > 0.26842844879751026 and needs abs T_(100,N) < 1/4. The reading "P_100 = A_97 times the first 100 terms of both sums" is this lane's; under the other reading (first 100 coalesced coefficients) the statement PROVED below is the same.

Finite consequence. For a sequence a with a(n) = 1 for n <= 100: (A) the P13 triangle value at t = 1607/10000, y0^2 = 87677/2500000; (B) max abs T_(100,N) and min Re(E F) on the orbit; (D) the largest time on the grid 0.132, 0.12, 0.10, 0.08, 0.06, 0.04, 0.02, 0 at which min Re(E F) <= 0. Stated before the run: survival needs a sequence with the prefix of zeta and the moduli of zeta to lose positivity.

PROVED.
1. P_100 contains a(n) for n <= 100 only. TNR 101, TNR 1000003, LIOU97, SGN97, UNI97 have zeta's P_100 at every x, N, t. The share of P_100 carried by primes above the prefix is 0.
2. For a completely multiplicative eps with eps(p) = 1 for p <= P and abs eps = 1, and a mollifier supported on P-smooth d: b(n) = sum lambda_d eps(n/d) b_t(n/d) = eps(n') b_zeta(n), n' the P-rough part of n. So abs b(n) and the triangle value are unchanged. Measured: T(N) of LIOU13, SGN13, UNI13 equals zeta's to 12 digits at the five values of N.

(A) P13 triangle value (MEASURED float64; zeta's value reproduces the source).

| sequence, mollifier | T(690988) | T(728999) | share of the absolute sum from n with a prime factor > 13 |
|---|---|---|---|
| ZETA, P13 | +0.000670513305 | +0.015859 | 0.9145 |
| LIOU13, SGN13, UNI13, TNR 1000003 | the same | the same | 0.9145 |
| TNR 101 | -0.106527 | -0.088366 | 0.9294 |
| CHI4 / CHI5, own factors | +0.2468 / +0.0960 | +0.2598 / +0.1095 | 0.941 / 0.924 |
| EA, zeta's factors | -22.35 | -21.91 | 0.937 |
| DH, zeta's factors / none | -0.6136 / -0.2661 | -0.5953 / -0.2424 | 0.398 / 0.521 |
| ZETA, none | -1.5626 | -1.5164 | 0.464 |

91 % of the absolute sum comes from n with a prime factor above 13: the margin reads the large primes, through abs a(n). TNR 101 changes abs a on multiples of 101 (a(101) = 23.1) and loses the margin of 6.7e-4 by 0.107.

(B) P97 orbit, 1000 points per window (MEASURED).

| sequence | min Re P_100 over the five N | max abs T_(100,N) at N = 690988, 1e6, 2e6, 5e6, 14999999 | rms of the 97-smooth / rough part of the tail at 690988 | min Re(E F) |
|---|---|---|---|---|
| ZETA | 0.935 | 0.082, 0.110, 0.064, 0.037, 0.035 | 0.0179 / 0.0113 | 0.948 |
| TNR 1000003 | 0.935 | 0.082, 0.110, 0.064, 0.036, 0.035 | 0.0179 / 0.0113 | 0.948 |
| LIOU97 | 0.935 | 0.096, 0.062, 0.068, 0.042, 0.027 | 0.0179 / 0.0113 | 0.958 |
| SGN97 | 0.935 | 0.091, 0.080, 0.063, 0.040, 0.027 | 0.0179 / 0.0112 | 0.953 |
| UNI97 | 0.935 | 0.098, 0.071, 0.061, 0.047, 0.032 | 0.0179 / 0.0112 | 0.947 |
| TNR 101 | 0.935 | 0.216, 0.260, 0.099, 0.086, 0.068 | 0.0179 / 0.0634 | 0.912 |
| CHI4, own | 1.071 | 0.093, 0.053, 0.045, 0.029, 0.016 | 0.0124 / 0.0109 | 1.056 |
| CHI5, own | 0.964 | 0.074, 0.064, 0.051, 0.052, 0.027 | 0.0155 / 0.0112 | 0.970 |
| DH, 96 terms | 1.029 | 0.065, 0.056, 0.034, 0.025, 0.017 | 0.0128 / 0.0095 | 1.039 |
| DH, none | 0.628 | 0.075, 0.079, 0.044, 0.031, 0.021 | 0.0132 / 0.0099 | 0.645 |
| EA, zeta's factors | -0.017 | 1.42, 3.12, 1.37, 0.86, 0.73 | 0.201 / 0.140 | 0.198 |

The source's sampled values for zeta are max abs T = 0.0735 (519 rows) and min Re(A_97 F) = 0.80028; this sample of 1000 points per window gives 0.110 and 0.948. (C) Torus minimum of Re P_100 over the 25 prime phases (search, 150 starts, all 150 ending within 1e-6 of the same value; an upper bound for the true minimum): 0.8061600 at N = 690988 for lambda = 0 and for lambda = lambda_h, 0.9563836 at N = 14999999; the source's certified bound 0.26843 is below these.

(D) Time scan at N = 690988, y fixed: min Re(E F).

| sequence | t = 0.12 | 0.10 | 0.08 | 0.06 | 0.04 | 0.02 | 0 |
|---|---|---|---|---|---|---|---|
| ZETA | 0.908 | 0.833 | 0.755 | 0.708 | 0.540 | -0.120 | -2.25 |
| LIOU97 | 0.924 | 0.861 | 0.777 | 0.684 | 0.635 | 0.058 | -2.24 |
| SGN97 | 0.915 | 0.844 | 0.775 | 0.686 | 0.403 | -0.581 | -5.08 |
| UNI97 | 0.908 | 0.834 | 0.756 | 0.677 | 0.540 | -0.130 | -3.80 |
| CHI4, own | 1.021 | 0.945 | 0.841 | 0.711 | 0.593 | -0.231 | -3.83 |
| TNR 101 | 0.861 | 0.756 | 0.633 | 0.383 | -0.222 | -1.57 | -5.99 |
| DH, 96 terms | 1.005 | 0.899 | 0.685 | 0.320 | -0.616 | -3.53 | -11.6 |
| EA | 0.162 | -0.652 | -3.37 | -10.5 | -29.7 | -85.5 | -264 |

The altered sequences with zeta's moduli (LIOU97, SGN97, UNI97) first differ from zeta in sign at t = 0.02 or t = 0, within the scatter of 1000 samples; all are positive at t >= 0.04, consistent with the round 3 statement for t >= 0.10. TNR 101 first differs at t = 0.04 (min abs F = 0.053 against 0.256 for zeta); its tail there is 2.63 against 1.85. Its off-line zeros start at y = 0.192, and by de Bruijn's bound y(t)^2 <= y(0)^2 - 2t they are below the test line y = 0.1265 for every t >= 0.0105; the failure at t = 0.04 is not a zero on the test line.

How the object enters. Through its coefficients: a(n), n <= 100, in the prefix; abs a(n) in the triangle value; a(n) on multiples of the altered primes in the tail. Control onset against off-line height: TNR 101 has off-line zeros in every interval of length 2.72 in x at every height and fails the P13 value at every N tested for the same reason at each (size of a(101)); the sign twists, of Euler type with no zeros in question, pass.

Why closed. The outcome asked for (a sequence agreeing with zeta on the prefix loses positivity because the margin reads large primes) occurs only for a change of modulus. Sign and unimodular twists beyond the prefix keep the P13 value exactly and keep the orbit statistics.

## 4. Window minimum against the triangle and two-channel bounds

Definitions. For window N, x = x_N + 4 pi f (2N+1), f in [0, 1), t = 129/800, y = 0.1808: f_t = sum over n <= N of a(n) b_n n^(-sigma_B) e^(-i theta_n) + g sum of conj(a(n)) b_n n^(-sigma_A) e^(+i theta_n); E = mollifier at s_B (Euler product over 2, 3, 5, 7, 11 with the a(p) of the object unless stated); b(n), a0(n) the mollified coefficients of the two ladders.

    true = min over 10^4 values of f of abs(E f)        chan = min of abs(E B) - g abs(E) abs(A)
    tri  = 1 - g - sum_{n>=2} (abs b(n) + g abs a0(n)) n^(-sigma)
    two  = 1 - g - sum_{n>=2} max(abs(b(n) - g a0(n)), ((1-g)/(1+g)) abs(b(n) + g a0(n))) n^(-sigma)

CLASSICAL (Polymath15, Lemma 5.1, real coefficients, b(1) = a0(1) = 1): abs B' - g abs A' >= two whenever two >= 0, for the two Dirichlet polynomials with coefficients b(n), a0(n) at the same point; and two >= tri. Since abs(E(s_B) D(s_A)) = abs(sum a0(n) n^(-s_B)) for real coefficients, true >= chan >= two >= tri. The bounds are evaluated with the constants of the left edge of the window, as are the sums; the slow drift of sigma inside the window is not included (screen).

Consequence for the test (PROVED from the lemma). The failure criterion "ratio of the true minimum to the two-channel bound below 1" cannot occur for any real coefficient sequence, with or without zeros. For LIOU and SGN, b(n) and a0(n) are multiplied by eps(n), so tri and two equal zeta's exactly. The unimodular twist with complex values is outside the lemma as stated and was not run.

Result (MEASURED; `c34_table.txt`). 130 rows (13 choices x 10 windows); two > 0 in 36; the inequality chan >= two holds in all 36 (smallest difference 0.102); smallest ratio true/two = 1.247.

| sequence, mollifier | true at N = 1e3, 1e4, 1e5, 690988, 1e7 | first N with two > 0 / tri > 0 | true/two at 690988, 1e6, 3e6, 1e7 |
|---|---|---|---|
| ZETA | 0.459, 0.800, 0.920, 0.969, 0.990 | 690988 / 1e6 | 8.74, 3.79, 1.76, 1.31 |
| LIOU | 0.499, 0.805, 0.923, 0.974, 0.994 | 690988 / 1e6 | 8.78, 3.82, 1.75, 1.32 |
| SGN | 0.511, 0.792, 0.933, 0.945, 0.989 | 690988 / 1e6 | 8.52, 3.82, 1.74, 1.31 |
| TNR 1000003, zeta's | 0.459, 0.800, 0.920, 0.969, 0.990 | 690988 / 1e6 | 8.74, 3.79, 1.76, 1.31 |
| CHI4 | 0.465, 0.914, 0.982, 1.002, 1.016 | 3e5 / 690988 | 2.53, 2.06, 1.47, 1.25 |
| CHI5 | 0.475, 0.828, 0.938, 0.978, 0.998 | 690988 / 690988 | 3.96, 2.70, 1.59, 1.28 |
| DH, 96 terms (optimised in the s3 lane at y0) | 0.438, 0.860, 1.003, 1.021, 1.027 | 3e5 / 690988 | 2.68, 2.14, 1.49, 1.25 |
| DH, none | 0.243, 0.504, 0.627, 0.701, 0.781 | 1e6 / 3e6 | -, 24.4, 2.44, 1.57 |
| DH, zeta's | 0.247, 0.375, 0.483, 0.534, 0.612 | 1e7 / none | -, -, -, 8.14 |
| TNR 3, own factor | 0.065, 0.429, 0.743, 0.845, 0.916 | 3e6 / 1e7 | -, -, 15.8, 1.71 |
| TNR 3, zeta's | 0.0115, 0.120, 0.365, 0.462, 0.564 | none | - |
| EA, own factors | 0.021, 0.011, 0.505, 0.702, 0.852 | none | - |
| EA, zeta's | 0.018, 0.005, 0.317, 0.562, 0.649 | none | - |

Reading.
1. Zeta: true is between 0.46 and 0.99 in every window from N = 1e3 on, where both bounds are negative up to N = 3e5 (tri = -8.7 at N = 1e3). The bounds are uninformative below N = 6.9e5 for zeta and its twists alike; the distance between true and two closes to a factor 1.3 at N = 1e7. The two-channel bound gains one step of the ladder (positive at 690988 where the triangle bound is -0.042).
2. Small minima (below 0.1 among 1e4 points): TNR 3 at N = 1e3, 3e3 and EA at N = 1e3 .. 3e4, with either mollifier. These are the controls with zeros at real part 0.904 and 0.75; the terms of the window have effective abscissa between (1+y)/2 + (t/4) log N (0.87 at N = 1e3, 1.01 at N = 3e4) and sigma_B, and the minima rise to 0.43 and 0.51 once that range has moved to the right of the zeros. This is the resolution of off-line zeros by the test line.
3. DH, whose zeros below 2000 have real part at most 0.870, has true >= 0.24 without a mollifier and >= 0.44 with one; no window with a small minimum was found.
4. Second derivative (`out/c4d.json`; rho = abs(E f - 1)^2 with the Euler product over p <= 97, t = 24727519/2e8, y = 0.1809, N = 690988): on the source cell x in [6000000185828, +1/50]: rho = 0.0059, rho_x = -0.035, max abs rho_xx = 5.0; over 64 further cells of the window: max rho = 0.019, max abs rho_x = 0.035, max abs rho_xx = 7.5 (median per cell 3.6). Source caps: 0.166, 3.66, 2381. The mollifier of the source cell was not reconstructed, so the values of rho are not the source's; the ratio of the cap to the measured second derivative is about 300. For LIOU, SGN97, TNR 101, CHI4, DH the maxima are 9.1, 8.2, 12.6, 5.7, 16.0.

How the object enters. The bounds: through abs b(n) and the relative sign of the two ladders, that is, through coefficients. The true minimum: through the values on the orbit, which for a completely multiplicative twist are the values of zeta at a translated point of the prime-phase torus. Control onset against off-line height: T-NR at q = 3 and EA show small minima where the window's abscissa range contains their zeros; nothing earlier.

Why closed. The stated failure is excluded by the lemma for every control. The quantity that does differ between functions (the true minimum) is small exactly where zeros are near, and equals zeta's in distribution for the twists.

## Weakest steps

1. Combination 1 counts cells on a grid of spacing 1/16 and, above 1e9, on 64 windows (1.7e7 of T cells); the exponents above 1e9 rest on four heights. The conclusion "premise false for zeta" does not depend on this (complete coverage to 1e9, two maxima rechecked at 30 digits).
2. Combination 3 uses this lane's reading of P_100 and the chart constants of the s3 lane; the certified constant 0.26843 of the source was not reproduced, only bounded from above by a search (0.806) and checked for consistency with the source's sampled value (0.800).
3. Combinations 3 and 4 sample 1e3 and 1e4 points per window with left-edge constants; minima are upper bounds for the true window minima. The statements "no control below the two-channel bound" (lemma) and "P_100 and the triangle value are unchanged by twists beyond the prefix" (algebra) do not depend on sampling.

## Files

`lp.py`, `core.py`, `rmt.py`, `tri.py`, `orbit.py`, `c1.py`, `c2.py`, `c3.py`, `c4.py`, `c4d.py`, `recheck.py`, `validate_c4.py`, `c1_table.py`, `c2_table.py`, `c34_table.py`, run scripts `run_c*.sh`. Results: `out/c1_*.jsonl` (a: 1e4..1e8 complete; b: 1e9 complete, ZETA and CHI4; s: 1e8, 1e9 sampled; c: 1e10, 1e12; d: 1e13; f: 1e14; q: TNR 1000003 at 1e13, 1e15), `out/c2_zeta.json`, `out/c2_ctrl.json`, `out/c3_A.jsonl`, `out/c3_B.jsonl`, `out/c3_D.jsonl`, `out/c4_x.jsonl`, `out/c4d.json`, `local_c3C.jsonl` (torus search), `recheck.jsonl`; tables `c1_table.txt`, `c2_table.txt`, `c34_table.txt`. Server copy: `~/rh-push/s6-line-polynomials-local-law-density-detector/`.
