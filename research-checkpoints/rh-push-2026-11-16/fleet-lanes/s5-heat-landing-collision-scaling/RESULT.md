# s5-heat-landing-collision-scaling: screening of four heat-flow / collision combinations

Lane `s5-heat-landing-collision-scaling`, 2026-11-19/20. Screening arm. Labels: PROVED (short argument here), CLASSICAL, MEASURED (float64
unless a line says long double or balls), STRUCTURAL (follows from the definition of the control). No claim about RH or Lambda of zeta.
No bound moves.

## 0. Verdict

Four combinations tested. **Survivors: 0.**

| # | combination | statistic | sizes reached | zeta | comparison L-functions | DH | heat tau < 0 | zeta(s+a)zeta(s-a) | T-NR | sign twist / unimodular twist | classification |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | landing of off-line pairs under d_t H = -H_zz (moving-rung lemma, de Bruijn contraction, strip ladder) | landing time of every pair from the zero ODE with all zeros below a height moving together; Lambda(control) = largest landing time; real-zero count of H_t at t = 0.01, 0.05 | controls: up to 76,325 zeros in one flow (DH below 5e4: 68,925 real + 3,700 pairs). zeta: H_t real zeros counted for gamma in [1000, 5e6] (X = 1e7 in z = 2 gamma), 1.0e7 zeros, three values of t | count 10,015,825 at t = 0, 0.01, 0.05 (smooth count 10,015,825.4); nothing to land | no off-line pair in the lists; count test not run (no heat sampler for conductor 4, 5) | Lambda >= 0.230607 (pair 0.8695 + 240.40 i; de Bruijn 0.2731). Speed-up median 1.13. Unlanded pairs at t = 0.01 / 0.05: 3183 / 1671 of 3700; the count deficit sits on those pairs | tau = -0.1: every pair lands before 0.0952 < 0.1 and the flow returns the zeta zeros to 8e-7; tau = -0.5: last landing 0.4868 | a = 0.02, 0.1, 0.3: Lambda = 0.000800, 0.019973, 0.177843 (de Bruijn 2 a^2). a = 0.02 passes the count test at both t; a = 0.1 passes at t = 0.05 | q = 3: Lambda = 0.313491 (first pair, height 2.86). q = 1000003: Lambda = 0.001997, all 6596 pairs below 3000 real before t = 0.002: passes the count test at both t with off-line zeros from height 0.227 | sign twist: not formulable (no functional equation, no real entire function). unimodular twist: translate of zeta, same result | CLOSED. Zeros only. The test is the location of the off-line pairs, and it is blind to any control with Lambda < t |
| 2 | first collision time t_c(N) of the backward Dyson flow (C_C ansatz, sandwich, gap-domination bootstrap) | t_c(N) on the first N ordinates: full N-body flow to N = 1.78e5, pair value and plateau bracket to N = 1e8; mean of the minimal normalised gap over blocks of N zeros; fits against E_coll = C_C sqrt(log T0 / N) | zeta 1.0e8 zeros and windows at 1e7, 1e9, 1e12; L(chi), L(chibar) mod 5: 9.5e5 each; L(chi_-4), L(chi_5): 1.25e4 each; DH 8.5e5 on-line; alt 7.0e5; heat windows 4.0e6 | ansatz does not hold: E[min gap] ~ N^(-0.3331 +- 0.0001) (GUE cubic law -1/3, constant 1.037 x GUE over N = 100 .. 3e5); t_c / E_coll falls from 0.10 to 2.1e-4. t_c = g_min^2/8 (1 + 2.3e-4) at N = 1.78e5 | -0.3300 +- 0.0019, -0.3332 +- 0.0018 (mod 5 complex); -0.31 +- 0.02, -0.345 +- 0.007 (real characters, 12 blocks at N = 1000) | exponent -0.483 +- 0.007: sqrt(N) E[min gap] = 2.05 .. 2.17 for N = 100 .. 1e4, the N^(-1/2) form of the ansatz. Separation from the GUE law starts at N = 300 to 1000 (17 to 58 off-line pairs per block) | exponent -0.35, -0.39, -0.44, -0.49 for tau = -1e-4 .. -1e-2; separation starts at N of about 0.5 / (off-line fraction) | no on-line list | identical to zeta (on-line list is zeta's) | no list / translate | CLOSED. Premise false for zeta; the exponent of the ansatz is the exponent of the lists that have lost zeros; separation at block sizes that contain off-line pairs |
| 3 | adjacent-gap reserve and gates (S >= 0, B G^2 < 2, beta g^2 < 0.909) | environment sum S for every adjacent pair; gates on the running minimal pair and on close pairs; backward local flow of the 1e4 closest pairs against the static bracket; case (b): S with the off-line zeros included | the same lists; 1.0e8 adjacent pairs for zeta; DH and T-NR (q = 3) full zero sets below 1e5 for case (b) | S > 0 at all 100,115,896 pairs; minimal-pair gate at most 0.046 on the ladder; 33 of 773,579 close pairs have S g^2 > 0.909 | same: S > 0, minimal-pair gate at most 0.12; 1 and 0 close pairs above 0.909 of 6656 and 6608 | (a) on-line list: S > 0 at all 847,300 pairs, minimal-pair gate at most 0.005, 4 of 5679 close pairs above 0.909. (b) full set: S < 0 at 2933 of 147,366 pairs, every one within 1.28 mean spacings of an off-line pair; first at index 257 (height 365), after the first off-line pair (index 43) | (a) S > 0 everywhere; close pairs above 0.909: 4, 4, 1, 24 | no on-line list | (a) identical to zeta. (b) q = 3: S < 0 at 9961 of 138,028 pairs, all within 1.09 mean spacings of an off-line pair | no list / translate | CLOSED. S >= 0 and B G^2 < 2 hold for every real point set (PROVED); with the off-line zeros S < 0 only next to them |
| 4 | windowed discriminant rate (graph Laplacian, heat discriminant ODE, Calogero-Moser energy) with its prime-side form | zero side: (1/N) sum_{i<j} 1/(u_i - u_j)^2 per window, unfolded. Prime side: explicit formula for the kernel K_X(r) (the 1/r^2 kernel at resolution 1/log X) with all prime powers to X = 1e9; statistic P - Z at the 1000 zeros of a window. Function side: Hadamard identity at each zero | zero side: N = 1e3 .. 1e6 on all lists. Prime side: 50,851,223 prime powers below 1e9, windows at heights 1.4e3, 7.5e4, 5.0e6, 4.2e7, 1.0e9. Hadamard: all zeros below 2000 in 160-bit balls | rate 3.166 +- 0.008 per zero (GUE pi^2/3 = 3.290; 3.20 at 1e7 .. 1e12). P - Z: rms 1.3e-4 to 4.0e-4 at every height and X (truncation of the zero window: about 2e-4). Hadamard residual rms 1.0e-6 | rate 3.01 (mod 5 at heights below 5e5). P - Z rms 1.5e-4 to 4.3e-4 for L(chi_-4) and L(chi_5). Hadamard residual 1.8e-8 (chi_5) | rate 4.7 +- 0.4, window maximum 239 (L(chi), same number of windows: 11.8). Hadamard: mismatch with the on-line list at every zero (rms 0.52), equal to the off-line pair formula to 2.5e-5; at the 43 zeros below the first off-line height it is 0.0017 to 0.29 = sum of 2/r^2 over the missing pairs | rate 4.7 to 16, window maxima to 1.3e4 | no on-line list | zero side identical to zeta. Prime side: mismatch equal to the prime-power terms at q^j <= X: q = 3, rms 27 at X = 1e3 to 1.1e4 at X = 1e9; q = 1000003: exactly 0 for X <= 1e5 and rms 84, 196 for X = 1e7, 1e9, at every height | sign twist: not run on the line. unimodular twist: translate | CLOSED. The prime side is the explicit formula; P - Z is the K-weighted sum over the off-line zeros (verified to 1e-9 for T-NR). The zero-side rate is the small-gap law of combination 2 |

How each object enters: combinations 1, 2, 3 and the zero side of 4 use only the positions of the zeros; no coefficient of the Dirichlet series
enters. The prime side of 4 uses the coefficients Lambda_F(n) at prime powers, all together, and is an identity (the explicit formula).

The pattern of the brief holds in all four. Two sharpenings came out of the runs:
- the count test at a fixed t > 0 is not a test that controls must fail: T-NR at q = 1000003 and E_a at a = 0.02 have off-line zeros at every
  height, from heights 0.23 and 14.1, and all of them are real by t = 0.0020 and t = 0.0008;
- the N^(-1/2) law of the source ansatz for the collision scale is measured on the on-line lists of DH and of the backward heat family, not on
  zeta or on the L-functions, which follow N^(-1/3).

## 1. What would have counted as survival (written before the runs)

1. Landing / count: the real-zero count of H_t matches the Riemann-von Mangoldt count for zeta at every size, and a control shows a count
   deficit in a window farther than 10 mean spacings from each of its off-line pairs.
2. Collision time: the ansatz holds for zeta at two sizes, and the fitted exponent or constant of a control leaves the interval of zeta and the
   L-functions at N below the size at which the control's window contains off-line pairs.
3. Gates: a gate fails on the on-line list of a control at an index below half the index of its first off-line pair, in more than the fraction
   seen for the CUE reference.
4. Discriminant rate: prime side minus zero side stays within the truncation bound for zeta, and a control shows a mismatch below its first
   off-line height that is larger than the term of its nearest off-line pair, for a reason other than the missing zeros.

## 2. What was run, where, sizes

| object | size | where |
|---|---|---|
| zeta, first zeros (list of `s1-zero-flow-dynamics`, read only) | 100,116,297 ordinates to 4.27e7 | server |
| zeta windows at 1e7 (sampler, 4.0e6 zeros), 1e9 (1.02e6, list of `s2-heat-root-drift-forces`), 1e12 (1.0e6, offsets, list of `s3-dyson-burgers-zero-flow`) | read only | server |
| L(s, chi), L(s, chibar), chi mod 5 with chi(2) = i; DH and alt on-line lists; backward heat windows at 1e7, tau = -1e-4, -5e-4, -2e-3, -1e-2 (lists of `s1-zero-flow-dynamics`) | 9.5e5; 8.5e5; 7.0e5; 3.9e6 to 4.0e6 | server |
| L(s, chi_-4): 12,502 zeros below 10,110 (list of `s3-heat-zero-velocity-channels`, copied) | read only | server, Mac |
| L(s, chi_5), real character mod 5: 12,703 zeros below 10,000 generated here (`gen_lreal.py`, flint Hardy Z; smooth count 12,703.5) | generated | server |
| DH full zero set: 147,407 on-line ordinates and 8138 off-line pairs below 1e5 (list of `s3-heat-zero-velocity-channels`); 30-digit table below 2000 (`c12-control-battery-harness`) | read only | server, Mac |
| heat tables H_{-0.1} (1435 on-line + 41 pairs below 2000) and H_{-0.5} (929 + 294) (`c12-control-battery-harness`) | read only | Mac, server |
| combination 1 flows: DH below 5e4 (76,325 particles, 1.2e10 pair terms per evaluation, 1075 evaluations); T-NR q = 3 below 2e4 (29,485 particles); T-NR q = 1000003 below 3000 (15,661); E_a, a = 0.02, 0.1, 0.3, below 2e4 (44,982 each); DH below 2000 in long double; heat tables | C kernel, 8 cores | server (heat tables: Mac) |
| combination 1 count: Riemann-Siegel sum with the heat factor, gamma in [1000, 5e6], t = 0, 0.01, 0.05, 55 blocks | 1.0e7 zeros, three passes, 15 min on 4 cores | server |
| combinations 2, 3, 4 (zero side): every list above; full N-body backward flow for N <= 1.78e5; pair sums over 200 neighbours each side for 1.0e8 pairs | 4 cores, unit capped at 12 GB | server |
| combination 4 prime side: sieve to 1e9 (50,851,223 prime powers), 9 windows of 1000 zeros, X = 1e3, 1e5, 1e7, 1e9 | 8 cores, 2.5 min | server |
| combination 4 Hadamard identity: zeta (1517 zeros), DH (1861), T-NR q = 3 (1517), L(chi_-4) (1958), L(chi_5) (2028), all zeros below 2000 | python-flint, 160 bits | server |
| CUE reference: 120 Haar unitary matrices of size 1500 | 180,000 gaps | Mac |

Local runs went through `scripts/memcap.sh 8`. Server runs went through `rhrun` only (units `rh-s5-c1a`, `rh-s5-count`, `rh-s5-lists`,
`rh-s5-l45`, `rh-s5-c4`, `rh-s5-c4p`, `rh-s5-c4b`; at most 8 cores in use at any time, each unit capped at 12 GB or less, at most
three units at a time; all ended, the two that were replaced were stopped by unit name). GPU 1 was at 100 % utilisation by other jobs; the O(N^2) fields ran in a C kernel on the CPU (2.5e10 pair
terms per second on 8 cores), which reached N = 1.78e5 for the real flow and 7.6e4 complex particles for the landing flow, so no GPU
stage was needed.

## 3. Method and validation

**Zero ODE with non-real pairs** (`hl.py`, `kern.c`). Variable z = 2 gamma - 2 i (beta - 1/2); d_t H = -H_zz gives
dz_k/dt = 2 sum' 1/(z_k - z_j) (symmetric sum; CLASSICAL, Polymath15 Prop. 3.1 for zeta). Real zeros r, and for each conjugate pair the
centre c and u = (z_1 - z_2)^2: c' = (v_1 + v_2)/2, u' = 8 + 2 sqrt(u)(v_1 - v_2), with v the velocity from all other zeros. u is real
(u = -4 Y^2 before landing, the squared gap after) and its equation is regular through u = 0, so no event handling is needed; the landing
time is the root of the cubic Hermite interpolant of u in the step. Mirror zeros -z are included exactly; zeros above the truncation height H
are replaced by the smooth density (m / 4 pi)(log s + kappa), which contributes -(m / pi) sum_j w^(2j+1) [(log H + kappa)/(2j+1) + 1/(2j+1)^2],
w = z/H. Dormand-Prince 5(4), relative tolerance 1e-9.

Checks with a known answer (`c1_validate.py`, both machines):
- isolated pair +- 0.7 i: landing 0.2450000 (exact Y^2/2 = 0.245);
- witness of node `strip-ladder-kappa`, F = (z^2 + Y^2) cos(cz), Lambda = (sqrt(1 + 4 c^2 Y^2) - 1)/(4 c^2): relative errors -8e-10
  (c = 1, Y = 0.6), -1.0e-8 (c = 3, Y = 0.6), -7e-13 (c = 0.3, Y = 0.9), with 8000 lattice zeros and the constant-density tail;
- the table of H_{-0.1} (1435 real zeros and 41 pairs below 2000) run forward by t = 0.1: all 41 pairs land (0.00054 to 0.0952), 1517 real
  zeros result, and the 649 below height 1000 agree with the zeta zeros to 7.9e-7 (rms 2.1e-7). The same run stopped at t = 0.09 or 0.11
  differs by 0.004 +- 0.004, so the time unit (tau of the battery = t of de Bruijn-Newman in z = 2 gamma) and the tail are confirmed;
- DH below 2000: float64 against long double (tolerance 1e-11) 2.0e-9 in every landing time; truncation at 2000 against 5e4, pairs below
  1500: 1.3e-7 relative.

**Count of real zeros of H_t for zeta** (`c1_count.py`): the Riemann-Siegel sum with the n-th term multiplied by
exp(-(t/4) log n (log(T/2 pi) - log n)) (main terms of the Polymath15 approximation; sampler of `s1-zero-flow-dynamics`, copied to `zgen/`,
validated there against the zero ODE). This is a model of H_t, not its integral.

**Backward flow** (`c23.py`): dx_k/ds = -2 sum 1/(x_k - x_j), classical RK4 with dt = 0.04 g_min^2, stopped at g_min = 1e-3 g_min(0) and
extrapolated with the pair ODE. Full N-body for N <= 1.78e5 (float64); window of 4001 ordinates around the minimal pair in long double
(80-bit) with the zeros outside replaced by a frozen continuum. The two agree to 2e-5 relative (N = 1e3 .. 1.78e5); the float64 full flow
resolves t_c/(g^2/8) - 1 to about 2e-5 and the long-double window to about 1e-6 (the lower bound t_c >= g^2/8 is exact; values of
-1.8e-5 and -9e-7 occur and are integration error). Zeta at N = 1e4: t_c = 1.778009e-4 (source value 1.776e-4; `s1`: 1.7765e-4);
N = 1e8: 3.38337e-8 (`s1`, 30-digit zeros: 3.38367e-8). The location of the closest pairs at 30 digits was done in `s1-zero-flow-dynamics`
and is not repeated.

**Prime side** (`c4_prime.py`): phi(v) = v (1 - v/L), L = log X; K(r) = int phi(|v|) e^{irv} dv = 2[-(1 + cos rL)/r^2 + 2 sin(rL)/(L r^3)],
K(0) = L^2/3. Weil explicit formula (CLASSICAL), zeros with gamma > 0:
Z(x) := sum_gamma K(gamma - x) - int K(r - x) dens(r) dr = P(x) := 2 Re K(i/2 - x) [zeta only] - 2 sum_{n <= X} Lambda_F(n) n^(-1/2) phi(log n) cos(x log n).
The zero sum is taken over the zeros within R = 300 of x and the remainder by the smooth density (exact integral 4/R - 4 sin(RL)/(L R^2));
the error of this cut is the fluctuation of the far zeros, about L |S| / R^2 = 2e-4. The prime sum runs in C with the phase x log n reduced
mod 2 pi exactly (error-free product and a two-term 2 pi) before the vector cosine; without the reduction the vector cosine was 12 times
slower above 1e8 and wrong in the seventh digit; against 40-digit phases the reduced sum is exact to 1e-14 at x = 4.2e7 and 1e9.
Remaining error at 1e9: rounding of log n (2e-6 rad) and of the ordinates (1.2e-7), a few 1e-4 in P - Z.

**Hadamard identity** (`c4_hadamard.py`): at a simple zero rho of the completed function,
sum over the other zeros of 1/(t_i - t_j)^2 = -(Lambda''/(2 Lambda'))^2 + Lambda'''/(3 Lambda') (CLASSICAL). Derivatives from 48 points on a circle
of radius 1/4 in 160-bit balls (sampling error not enclosed).

## 4. Combination 1: landing times, Lambda of the controls, count of real zeros of H_t

Nodes: dbn-moving-real-rung-lemma, dbn-debruijn-contraction-law, de-bruijn-sharp-in-ymax, debruijn-landing-rate-thm13, strip-ladder-kappa.

| object | zeros in the run | pairs | Lambda = max landing time (pairs below 0.8 H) | at height, beta - 1/2 | de Bruijn Y^2/2 of that pair | speed-up Y^2/(2 T), median (5 %, 95 %) | landing / frozen-rung time, median (max) | unlanded pairs at t = 0.01, 0.05 |
|---|---|---|---|---|---|---|---|---|
| DH, below 50000 | 68925 real + 2 x 3700 | 3700 | 0.230607 | 240.405, 0.3695 | 0.273106 | 1.134 (1.009, 1.577) | 1.000 (1.327) | 3183, 1671 |
| DH (long double), below 2000 | 1861 real + 2 x 84 | 84 | 0.230607 | 240.405, 0.3695 | 0.273106 | 1.085 (1.008, 1.260) | 1.000 (1.014) | 76, 49 |
| heat tau = -0.1, below 2000 | 1435 real + 2 x 41 | 41 | 0.086807 (all pairs: 0.0952) | 1329.168, 0.2166 | 0.093837 | 1.023 (1.001, 1.061) | 1.000 (1.000) | 31, 11 |
| heat tau = -0.5, below 2000 | 929 real + 2 x 294 | 294 | 0.486807 | 1329.351, 0.6248 | 0.780754 | 1.162 (1.018, 1.502) | 0.984 (1.280) | 290, 265 |
| E_a, a = 0.02, below 20000 | 0 real + 2 x 22491 | 22491 | 0.000800 | 14.135, 0.0200 | 0.000800 | 1.004 (1.002, 1.012) | 0.996 (1.000) | 0, 0 |
| E_a, a = 0.1 | 0 real + 2 x 22491 | 22491 | 0.019973 | 14.135, 0.1000 | 0.020000 | 1.097 (1.048, 1.208) | 0.912 (0.999) | 22491, 0 |
| E_a, a = 0.3 | 0 real + 2 x 22491 | 22491 | 0.177843 | 14.135, 0.3000 | 0.180000 | 1.621 (1.368, 1.853) | 0.617 (0.988) | 22491, 22491 |
| T-NR q = 3, c = 2.2, below 20000 | 22491 real + 2 x 3497 | 3497 | 0.313491 | 2.860, 0.4038 | 0.326033 | 2.345 (1.736, 3.292) | 1.149 (1.474) | 3497, 3497 |
| T-NR q = 1000003, c = 2.2, below 3000 | 2469 real + 2 x 6596 | 6596 | 0.001997 | 0.227, 0.0321 | 0.002062 | 1.045 (1.035, 1.395) | 0.969 (1.315) | 0, 0 |

Readings (MEASURED unless marked):
- de Bruijn's bound T <= Y^2/2 holds at every pair of every run (0 violations in 81,685 pairs; it is a theorem).
- DH. The largest landing time among the 3700 pairs below 5e4 is 0.230607, at the pair 0.8695 + 240.40 i; the next are 0.2232 (height 2442.5,
  beta - 1/2 = 0.3978) and 0.2025 (857.3). The pair with the largest displacement (0.4371 at height 49,688, de Bruijn 0.382) lands at 0.139
  (it lies in the top 20 % of the run, where the truncation edge acts). So Lambda(DH) >= 0.2306, with equality if no pair above 5e4 lands
  later; that is not decided here. 1.3 % of the pairs are real by t = 0.001, 14 % by 0.01, 55 % by 0.05, 85 % by 0.1.
- Speed-up against de Bruijn. For DH the median is 1.02 to 1.14 in every height band from 50 to 5e4: the off-line pairs sit in holes of the
  real zeros, and Y times the Poisson mass of the real zeros has median 0.14. log(speed-up) correlates with Y P_0 at 0.987. For T-NR q = 3
  the median grows from 1.24 below height 50 to 2.50 at 1.2e4 (the density of zeta zeros grows and the pairs are not in holes).
- Moving-rung lemma. The time from Y' = -1/Y - 2 P_0(X, Y) with the real zeros frozen at t = 0 reproduces the DH landing times: ratio
  median 1.000, 5 % to 95 % range 0.989 to 1.061, extremes 0.863 and 1.327. It is not an upper bound for a pair that is not the boundary
  zero (44 % of the DH pairs land later than it, 99 % of the T-NR pairs, where the neighbouring pairs and the retreat of the real zeros
  slow the descent). For E_a there are no real zeros at t = 0 and the whole speed-up (up to 2.1) comes from the other pairs, which the
  lemma does not count.
- Heat controls: every pair of H_{-0.1} is real before 0.0952 and every pair of H_{-0.5} before 0.4868, as the flow composition requires;
  the largest landing time below height 1600, 0.086807, is 0.1 minus 4 times the first backward collision time of the first 1000 zeta zeros
  in raw ordinates (0.0033).
- zeta(s+a)zeta(s-a): the lowest pair is the last to land and lands at 2 a^2 (1 - 5e-5), (1 - 1.4e-3), (1 - 1.2e-2).
- T-NR: Lambda(T-NR_q) <= 2 arccosh(c/2)^2 / log^2 q (de Bruijn; PROVED), measured 0.3135 at q = 3 and 0.001997 at q = 1000003. The family
  has off-line zeros at heights (2k+1) pi / log q, from 0.227 on at q = 1000003, with Lambda tending to 0 as q grows.

**Count test.** zeta: 10,015,825 real zeros of the deformed sum in [1000, 5e6] at t = 0, at t = 0.01 and at t = 0.05; smooth count
10,015,825.42; the 55 block counts agree at t = 0 and 0.01, and at t = 0.05 eight blocks differ by +-1 in adjacent pairs (a zero crossing a
block edge). The minimal normalised gap grows from 0.0050 to 0.155 and 0.295; the variance of the gaps in the top block falls from 0.169 to
0.135 and 0.064. The pass is the statement that the zeros below 5e6 are real at t = 0: real zeros stay real under the forward flow
(CLASSICAL), so nothing beyond verified height is tested.

Controls: the number of real zeros in a window at time t is the number of zeros in the window minus the non-real ones (PROVED: the zeros
move continuously and are conserved), so a deficit can only sit where a pair has not landed. Measured on DH below 5e4: the 3183 and 1671
pairs still off the line at t = 0.01 and 0.05 are exactly the pairs with landing time above t, and none has moved by more than 0.12 and
0.59 mean spacings. No window farther than 10 mean spacings from every off-line pair has a deficit. The fail condition of the test cannot
occur. In the other direction the test does not see a control with Lambda < t: T-NR at q = 1000003 and E_0.02 pass at both t.

Classification: CLOSED. Enters through the zeros only. Onset of the control failure = the height of its first off-line pair whose landing
time exceeds t (DH: 85.7; T-NR q = 3: 2.86; heat: 415 and 112); no onset at all for small displacement.

## 5. Combination 2: collision time and the C_C ansatz

Nodes: collision-constant-cc-ansatz, en-bridge-three-term-surrogate, min-gap-sandwich, gap-domination-bootstrap, en-sigma-landmarks.

Premise on zeta at two sizes. The source defines E_coll only by its value C_C sqrt(log T0 / N), C_C = (1/8) sqrt(3 pi) = 0.38375
(imp-35718 lists the missing definition as open). Four readings were compared on the first N zeros:

| N | T0 | g_min | t_c (long double window) | E_coll | t_c / E_coll | 4 t_c / E_coll (z units) | g_min / E_coll | s_min / E_coll |
|---|---|---|---|---|---|---|---|---|
| 1e3 | 1419 | 0.161501 | 3.2982e-3 | 0.03269 | 0.101 | 0.404 | 4.94 | 4.21 |
| 1e4 | 9879 | 0.0376985 | 1.77801e-4 | 0.01164 | 0.0153 | 0.0611 | 3.24 | 3.62 |
| 1e5 | 7.50e4 | 0.0147015 | 2.70234e-5 | 0.00406 | 0.0067 | 0.0266 | 3.62 | 5.38 |
| 1e6 | 6.01e5 | 0.00570371 | 4.06674e-6 | 0.00140 | 0.0029 | 0.0116 | 4.08 | 6.93 |
| 1e7 | 5.00e6 | 0.00232340 | 6.74782e-7 | 0.00048 | 0.0014 | 0.0057 | 4.88 | 10.43 |
| 1e8 | 4.27e7 | 0.000520259 | 3.38337e-8 | 0.00016 | 0.00021 | 0.00084 | 3.24 | 7.68 |

- No reading gives a constant near 1. t_c / E_coll falls by a factor 480; s_min / E_coll grows. The raw minimal gap stays within a factor
  2.5 to 6.4 of E_coll over the 21 rungs with no trend: the local exponent of the raw minimal gap is -1/3 - 1/log(T0/2 pi), which is -0.52
  at N = 1e3 and -0.40 at N = 1e8, against -1/2 + 1/(2 log T0) for the ansatz. The agreement of the exponent in raw units over this range
  comes from the growth of the density; the constant is 2.5 to 6.4 times C_C.
- Block statistics (the mean over disjoint blocks of N consecutive zeros of the smallest normalised gap; 1,001,162 blocks at N = 100 down
  to 10 at N = 1e7): E[min] = 0.897 N^(-0.3331 +- 0.0001). The ratio to the value Gamma(4/3) (9 / pi^2 N)^(1/3) of independent gaps with
  the GUE cubic law is 1.037, 1.037, 1.037, 1.039, 1.036, 1.037, 1.038, 1.040 for N = 100 to 3e5. sqrt(N) E[min] grows from 1.93 to 12.7.
  The ansatz exponent -1/2 is excluded for zeta.
- Sandwich and bootstrap: t_c >= g_min^2/8 at every rung (to the integration accuracy above); t_c <= H^2/(8 theta) with the certified theta
  of imp-3725 at the 20 rungs where theta >= 0.99 (theta = 0.975 at N = 1000). t_c / (g_min^2/8) - 1 = 1.2e-2 (N = 1e3), 8.7e-4 (1e4),
  2.5e-4 (1e5), 5.1e-5 (1e6), 1.7e-5 (1e7). These are properties of any real point list (PROVED in the sources).

Lists (blocks of N zeros; table C2 of the appendix):

| list | exponent of E[min of N normalised gaps] | E[min] / GUE-cubic value at N = 100, 1e3, 1e4, 1e5 | small-gap exponent (0.02 to 0.1) |
|---|---|---|---|
| zeta, first 1.0e8 | -0.3331 +- 0.0001 | 1.037, 1.037, 1.036, 1.038 | 3.00 |
| zeta at 1e7 / 1e9 / 1e12 | -0.3342 +- 0.0005 / -0.3302 +- 0.0016 / -0.3276 +- 0.0029 | 1.03 / 1.02 / 1.01 at N = 100 | 3.10 / 3.31 / 2.94 |
| L(chi), L(chibar) mod 5 | -0.3300 +- 0.0019, -0.3332 +- 0.0018 | 1.067, 1.067, 1.087, 1.211 and 1.074, 1.073, 1.066, 1.138 | 3.31, 2.97 |
| L(chi_-4), L(chi_5) (12 blocks at N = 1000) | -0.31 +- 0.02, -0.345 +- 0.007 | 1.13, 1.23 and 1.16, 1.14 at N = 100, 1000 | no gap below 0.02 |
| DH on-line | -0.483 +- 0.007 | 1.100, 0.792, 0.537, 0.304 | 2.10 |
| alt on-line | -0.466 +- 0.004 | 1.182, 0.866, 0.611, - | 2.07 |
| heat tau = -1e-4 (off-line fraction 4.6e-5) | -0.353 +- 0.005 (local: -0.34 at N = 100, -0.59 at 3e5) | 1.022, 0.988, 0.897, 0.693 | 2.45 |
| heat tau = -5e-4 (4.9e-4) | -0.386 +- 0.006 | 0.989, 0.889, 0.726, 0.569 | 2.33 |
| heat tau = -2e-3 (3.9e-3) | -0.444 +- 0.008 | 0.909, 0.720, 0.504, 0.320 | 2.06 |
| heat tau = -1e-2 (3.9e-2) | -0.491 +- 0.005 | 0.751, 0.530, 0.348, 0.203 | 1.99 |

- The controls with zeros off the line have the exponent of the ansatz: sqrt(N) E[min] = 2.05, 2.13, 2.17, 2.18, 2.16 for DH at
  N = 100 .. 1e4, and 1.40, 1.43, 1.45, 1.44, 1.40 for heat tau = -1e-2 (C_C sqrt(log T0) is 1.30 to 1.43 at the DH heights and 1.54 at 1e7).
  This is the quadratic small-gap law of lists in which pairs are about to leave the line (`s1-zero-flow-dynamics`, section 5).
- Onset. For the heat lists the ratio to the GUE value leaves 1 (by 10 %) at N = 1e4, 1e3, 100 for off-line fractions 4.6e-5, 4.9e-4,
  3.9e-3: at N of about 0.5 divided by the off-line fraction, the block size that contains one off-line zero every second block. For DH
  (on average over the list one off-line pair per 17 on-line zeros) the ratio is 1.10 at N = 100, 0.95 at N = 300 and 0.79 at
  N = 1000: the separation needs blocks with 17 to 58 off-line pairs on average. On the first-N ladder the raw ratio g_min / E_coll is 0.39 to 1.90 for DH, 1.8 to 5.3 for L(chi),
  2.5 to 6.4 for zeta; at N = 1000 (height 1152, 34 off-line pairs below) DH has 1.70 against 2.57 for L(chi).
- T-NR: the on-line list is zeta's (PROVED in `s1-zero-flow-dynamics`), every number of this section is zeta's. E_a: no on-line list.
  Unimodular twist: a translate. Sign twist: no line.

Classification: CLOSED. Enters through the gaps of the on-line list. The ansatz fails for zeta in every reading that has a constant, and its
N^(-1/2) form is the law of the controls. No control separates at a size smaller than the one at which its blocks contain off-line zeros.

## 6. Combination 3: environment sum, gates, reserve

Nodes: adjacent-gap-reserve, gap-ode-reserve, background-field-packing-bound, mingap-beta-condition, tangency-coefficient-8.

- S >= 0 for an adjacent pair of a real list: every term 1/((a - r)(b - r)) is positive because no r lies in (a, b) (PROVED, one line; the
  source states it). Measured: 0 negative values in 100,115,896 pairs of zeta and in every other list (1.2e8 pairs in total).
  S times the squared mean gap has mean 2.505 for zeta, 2.56 for CUE, 2.0 on the lattice.
- B_p G^2 < 2 for the minimal pair: the packing bound sum_k 2/(k(k+1)) = 2 holds for every real list (PROVED in the source). Measured on the
  running minimal pair of each ladder: S g^2 is at most 0.046 (zeta), 0.021 and 0.12 (L mod 5), 0.033 and 0.022 (real characters), 0.005
  (DH), 0.009 (alt), 0.007 or less (heat). The gate beta g^2 < 0.909 holds on every list by a factor of at least 7.
- The gate does not apply to arbitrary adjacent pairs: S g^2 > 0.909 for 80.2 % of all pairs of zeta, 80.5 % for L mod 5, 80.0 % for CUE
  (N = 1500), 82.2 % for DH, 78.5 % to 80.2 % for heat. A test "first index where the gate fails" on all pairs gives index 1 for every list.
- Close pairs (normalised gap below 0.2) with S g^2 > 0.909 (and > 2): zeta 33 (3) of 773,579; windows at 1e7, 1e9, 1e12: 4 (0), 1 (0),
  1 (0); L(chi) 1 (0) of 6656; L(chibar) 0 of 6608; CUE 0 of 1486; DH 4 (1) of 5679; alt 0 of 4075; heat 4 (0), 4 (1), 1 (0), 24 (7) of
  3.2e4 to 6.1e4. The three zeta pairs above 2 are the three closing pairs found in `s1-zero-flow-dynamics`. Rates per close pair:
  zeta 4.3e-5, DH 7.0e-4, heat tau = -1e-2 3.9e-4; the counts are 0 to 33 events.
- Reserve of the 1e4 closest pairs (local backward flow, window of 50 ordinates with a continuum outside): for zeta 9979 pairs resolve
  (in 21 a neighbouring gap collapses first), t_c/(g^2/8) - 1 has median 7.4e-4 and maximum 8.9e-3, sup B g^2 is at most 0.036, and the
  two-sided bracket T_-(g, beta) <= t_c <= T_+(g, beta) with the true beta holds in every case, on every list (0 violations in 104,665
  resolved pairs). The static depth T_+(g, S(0)) is exceeded in 15 cases for zeta and in 40 to 2855 cases on the other lists (S grows along the
  flow when a third zero is near): a certificate needs the sup over the flow, as the node mingap-beta-condition says.
- Case (b), off-line zeros included (`c3_full.py`): S_full = S_on + sum over off-line pairs of 2 Re 1/((a - w)(b - w)). DH: S_full < 0 at
  2933 of 147,366 adjacent pairs; the distance to the nearest off-line pair is at most 1.28 mean spacings (median 0.29); none beyond 10;
  the first is at index 257 (height 365.3), the first off-line pair is at index 43. Away from the off-line pairs (more than 10 mean
  spacings) the relative change of S is at most 4 %. T-NR q = 3: 9961 of 138,028, all within 1.09 mean spacings; first at index 21
  (height 82.9; the off-line progression starts at 2.86, below the first zeta zero).

Classification: CLOSED. Enters through the zeros. In case (a) the gates are theorems about real point sets or hold with a wide margin on
every list, so no control fails where zeta passes. In case (b) the failure is the presence of an off-line pair within about one mean spacing.

## 7. Combination 4: discriminant rate, its prime side, Calogero-Moser energy

Nodes: zero-flow-graph-laplacian, heat-discriminant-ode, discriminant-ladder-tc, cm-energy-collision-growth, mem-freeze-flow-interlacing.

**Zero side.** w = (1/N) sum_{i<j in window} 1/(u_i - u_j)^2, unfolded (d/dt log Disc = -8 times the raw sum). For the sine kernel the mean
is int_0^inf (1 - (sin pi r / pi r)^2)/r^2 dr = pi^2/3 = 3.2899 (twice the lattice value zeta(2)); CUE at N = 1500: 3.254 +- 0.036.

| list | N = 1e3: windows, mean +- sem, median, max | N = 1e5: mean, median, max | nearest-neighbour share |
|---|---|---|---|
| zeta, first 1.0e8 | 100114, 3.156 +- 0.008, 3.015, 658.7 | 3.166, 3.142, 9.7 | 0.78 |
| zeta at 1e7 / 1e9 / 1e12 | 3.193 +- 0.062 / 3.167 +- 0.016 / 3.203 +- 0.020 | 3.205 / 3.180 / 3.214 | 0.78 |
| L(chi), L(chibar) mod 5 | 944, 3.007 +- 0.016 and 3.006 +- 0.015; max 11.8, 7.6 | 3.022, 3.018 | 0.77 |
| L(chi_-4), L(chi_5) (heights below 1e4) | 10 windows, 2.79 +- 0.10, 2.69 +- 0.05 | - | 0.76, 0.75 |
| DH on-line | 845, 4.705 +- 0.377, 3.352, 239.3 | 4.763, 4.274, 6.3 | 0.84 |
| alt on-line | 696, 5.004 +- 0.243, 3.807, 110.0 | 4.970, 4.896, 5.9 | 0.84 |
| heat tau = -1e-4 / -5e-4 / -2e-3 / -1e-2 | means 4.73 +- 1.38 / 4.70 +- 1.09 / 4.81 +- 0.17 / 16.4 +- 4.7; medians 3.05 / 3.14 / 3.47 / 4.59; maxima 5556 / 4392 / 314 / 13390 | 4.74 / 4.71 / 4.82 / 15.7 | 0.85 to 0.96 |

- The rate is carried by the nearest neighbours (77 % for zeta) and has a heavy tail: 1/s^2 has finite mean and infinite variance under
  the cubic law, and a logarithmically divergent mean under the quadratic law of the lists with lost zeros. The running mean for zeta rises
  from 2.50 (first 1000 zeros) to 3.17 (1e8): the low-height density correction, also seen in the L lists.
- The controls differ through the small-gap law (the window maxima are single pairs: 1/(N s_min^2)). The medians of the windows of 1000
  zeros are 3.05 (heat, tau = -1e-4), 3.35 (DH) against 3.01 to 3.09 for zeta: the separation is in the tail, at the sizes of section 5.
- Calogero-Moser energy. With v_k = -2 F_k, E_kin = (1/2) sum v_k^2 obeys dE_kin/ds g_min^4 -> 32 at the collision (measured 32.0007 on
  every list for N = 1e3 to 2e4; 31.99 to 32.65 on the windows at 1e7 and 1e9, where float64 ordinates limit g^4); (1/2) sum v^2 -
  4 sum_{i<j} 1/(x_i - x_j)^2 is conserved for any real configuration (CLASSICAL). The coefficient 80 of the node belongs to another
  normalisation of the energy; the content is the pair law (g^2)' = -8, identical for every list.

**Prime side** (table C4b of the appendix; 36 rows).
- zeta: P - Z has rms 1.3e-4 to 4.0e-4 and maximum below 1.0e-3 in all 20 cells (5 windows at heights 1.4e3, 7.5e4, 5.0e6, 4.2e7, 1.0e9;
  X = 1e3, 1e5, 1e7, 1e9), against rms(Z) from 4.1 to 43.5. The size is the cut of the zero window (about 2e-4) and does not grow with X.
  At height 1e9 with X = 1e9 the kernel resolves 0.91 mean spacings.
- L(chi_-4), L(chi_5): rms 1.5e-4 to 4.3e-4 in the 16 cells (heights 1.1e3 and 9e3).
- T-NR on the same lists: the on-line list is zeta's and the coefficients differ at n = q^j:
  Lambda_F(q^j) q^(-j/2) = (-1)^(j+1) log q (alpha^j + alpha^(-j)) + log q q^(-j/2), alpha + 1/alpha = c. The mismatch is the closed form
  -2 sum_j (-1)^(j+1) log q (alpha^j + alpha^(-j)) phi(j log q) cos(x j log q). It equals the sum of K over the off-line progression
  (PROVED by Poisson summation; checked: -0.117939197 against -0.117939198, -13.4762097 against -13.4762097 for q = 3, and
  107.766685386 against 107.766685386 for q = 1000003, X = 1e7). Sizes: q = 3: rms 27 to 29 at X = 1e3, 211 to 235 at 1e5, 1.5e3 to
  1.65e3 at 1e7, 0.99e4 to 1.15e4 at 1e9, at every height. q = 1000003: no extra term for X = 1e3 and 1e5 (the test is identical to zeta's,
  while the window at height 1420 contains about 2400 off-line pairs); rms 84 at X = 1e7 and 196 at X = 1e9, at every height including 1e9.
  The onset is in X (X >= q, the first coefficient that differs), not in height.
- DH: not rerun on the prime side (its -F'/F has coefficients that are not supported on prime powers; `s2-heat-root-drift-forces`
  combination 1 ran all n <= 1e8 and found the sharp cut-off form to be the truncated explicit formula). The function-side form below
  covers DH.

**Hadamard identity at the zeros** (all zeros below 2000):

| object | zeros | rms of the function side | mismatch with the on-line list only: rms, max | residual after adding the off-line pair formula: rms, max |
|---|---|---|---|---|
| zeta | 1517 | 5.69 | 1.0e-6, 2.7e-5 | same |
| L(chi_5) (list of this lane) | 2028 | 7.29 | 1.8e-8, 1.9e-8 | same |
| L(chi_-4) (list of `s3`, float64 ordinates of neighbours) | 1958 | 7.01 | 8.8e-5, 1.9e-3 | same |
| DH | 1861 | 298.8 | 0.515, 6.05 | 6.5e-7, 2.5e-5 |
| T-NR q = 3 | 1517 | 6.34 | 3.15, 12.1 | 1.0e-6, 2.7e-5 |

- The identity holds for every object once all zeros are used. With the on-line list alone the mismatch is the sum over the off-line zeros,
  to the accuracy of the zeta row. This also checks the list of 8138 DH pairs: a pair missing at distance r from a zero below 2000 would
  leave 2/r^2.
- DH below its first off-line height (43 zeros, 5.09 to 83.1): the mismatch is 0.00172 at 5.09, 0.141 at 81.9, 0.289 at 83.1, positive at
  every zero and equal to the pair formula summed over all 8138 pairs to 5e-10. It exceeds the term of the nearest pair at every zero (by
  a factor 5.6 at 5.09, 1.01 at 83.1; more than twice at 26 % of the 1861 zeros). So the letter of the fail condition is met. The reason is
  the kernel: each off-line pair replaces two on-line zeros, and the on-line sum is short by 2/r^2 per missing pair at distance r (1/r^2 per missing zero), all
  with the same sign. The mismatch is a 1/r^2-weighted count of the zeros missing from the on-line list. Evaluating the zero side needs the
  complete on-line list to distance R to resolve a deficit at distance r < R: the counting function of the on-line zeros, verified height
  in the same form as the Turing count.

Classification: CLOSED. The zero side is the gap law of combination 2. The prime side and the function side are identities (explicit
formula, Hadamard product) in which the on-line list is compared with the full object; the difference is the sum over the off-line zeros.
zeta's pass at height T with cutoff X is the absence of off-line zeros within the reach of K around the window. T-NR separates through
its coefficient at q, as soon as X >= q and not before.

## 8. Control onsets against the heights of the off-line zeros

| control | first off-line zero | combination 1 (count at t) | combination 2 (exponent) | combination 3 | combination 4 |
|---|---|---|---|---|---|
| DH | 85.70 (index 43) | deficit from 85.7 on, at the pairs | blocks of 300 to 1000 zeros (17 to 58 pairs) | (a) none; (b) index 257, within 1.3 spacings of a pair | zero side as 2; Hadamard mismatch at every zero = weighted count of missing zeros |
| heat tau (z units) | 415 (tau = -0.1), 112 (-0.5); window lists: one pair per 1/(2 f) zeros | deficit at the pairs, all gone at t = abs(tau) | N about 0.5/f | (a) none | zero side as 2 |
| E_a | 14.13 (every zero) | fails iff 2 a^2 (1 - small) > t | no on-line list | no list | no list |
| T-NR q = 3 | 2.86 | fails at both t | identical to zeta | (a) identical; (b) index 21, within 1.1 spacings | prime side: fails for X >= 3 at every height |
| T-NR q = 1000003 | 0.227 | passes at both t (Lambda = 0.0020) | identical to zeta | (a) identical | prime side: identical to zeta for X < 1000003, fails for X above |
| sign twist | no line | not formulable | no list | no list | not run |
| unimodular twist | none (translate of zeta) | as zeta | as zeta | as zeta | as zeta at x + alpha |

No control fails at a size much smaller than the height of its off-line zeros would explain, and no failure has a cause other than the
off-line zeros themselves (their positions in 1, 3b, 4; their count in 2, 4) or the first coefficient that differs (4, T-NR).

## 9. Three weakest steps

1. The count of real zeros of H_t for zeta uses the Riemann-Siegel model sum with the heat factor (main terms of the Polymath15
   approximation), not the integral defining H_t, and starts at height 1000. It counts sign changes; the classification does not depend on
   it (real zeros stay real under the forward flow).
2. Landing times are float64 with tolerance 1e-9; only the 84 pairs below 2000 were repeated in long double. The pairs in the top 20 % of a
   run feel the truncation edge and are excluded from Lambda; Lambda(DH) is a maximum over the pairs below 4e4, not over all pairs of DH.
   The DH off-line list comes from `s3-heat-zero-velocity-channels` (Newton in balls from float64 seeds); its completeness is supported by
   the counts made there and by the Hadamard residual here, not certified.
3. Block statistics use the smooth density of all zeros of the object for the unfolding; for DH and alt the on-line density is 10 % and
   26 % lower, which moves prefactors (not exponents). The 1e9 and 1e12 lists are float64 (ordinates to 1.2e-7 at 1e9; offsets at 1e12), so
   the prime-side comparison at 1e9 is limited to a few 1e-4 and was not attempted at 1e12.

## 10. Files

Code (this directory): `kern.c`, `kern2.c`, `build.sh` (C kernels: complex and real pair forces in double and long double, pair sums,
window discriminant sums, prime sum with exact phase reduction); `hl.py` (wrappers, flow integrator, frozen-rung time); `c1_validate.py`,
`c1_flow.py`, `c1_count.py` (+ `zgen/`, copy of the `s1` sampler); `c23.py`; `c3_full.py`; `cue_ref.py`; `c4_disc.py`; `c4_prime.py`;
`c4_hadamard.py`; `gen_lreal.py`; `summ.py`, `mk_tables.py`; `run_c1.sh`, `run_lists.sh`, `run_l45.sh`, `run_c4.sh`, `after.sh`.
Outputs: `out_server/` (server runs: `c1_*.json` with every pair, `c1_count.json`, `c23_<list>.json`, `c4_disc_<list>.json`,
`c4_prime.json`, `c4_hadamard_<object>.json`, logs), `out/` (Mac runs: heat tables, `c3_full_*.json`, `cue_ref.json`, validation, and
`tables.md` = all generated tables). `data/`: the two lists of the real characters.
Server copy: `~/rh-push/s5-heat-landing-collision-scaling/`.

## Appendix: generated tables

See `out/tables.md` (tables C1, C2, C3, C4a, C4b, C4c printed by `mk_tables.py` from the json files).
