# s6-bridge-error-ladder-known-lambda: screening of four bridge / shock-curvature / surrogate / rigidity combinations

Lane `s6-bridge-error-ladder-known-lambda`, 2026-11-20. Screening arm. Labels: PROVED (short argument in this file), CLASSICAL,
MEASURED (float64 unless a line says otherwise), STRUCTURAL (follows from the definition of the control). No claim about RH or about
Lambda of zeta. No bound moves.

## 0. Verdict

Four combinations tested. **Survivors: 0.**

| # | combination | statistic | sizes reached | zeta | L(chi_-4), L(chi_5) (and L mod 5) | zeta(s+a)zeta(s-a) | T-NR q = 1000003 | Davenport-Heilbronn | heat tau < 0 | sign twist / unimodular twist | classification |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | bridge inequality abs(Lambda(F) - T_N(F)) <= E(N) on functions with known Lambda | T_N(F) = last landing time of the heat flow of the polynomial with the first N zeros and their mirrors (= -4 t_c(N) when they are all real); D = abs(Lambda - T_N); least C_C(F, N) | controls: full flows to N = 3e4, frozen-zone flows to N = 1.6e5 (DH) and 1e6 (E_a, T-NR); model with exact Lambda to N = 1e5; zeta ladder to N = 1.0e8; landing times re-checked with 42 digits at N = 100 .. 400 | Lambda unknown: only -4 t_c(N), exponent -1.005 on N = 128 .. 1e8; 4 t_c / E(N) = 2.94, 2.06, 1.40, 1.02 at N = 128, 181, 256, 362 (so the inequality with the source constants is false there in Lambda units, because Lambda >= 0), 7.0e-4 at 1e8 | with Lambda = 0 assumed: C_C at most 0.20, 0.25 (0.43, 0.57 mod 5), reached at N <= 256, then 0 | Lambda_ref = 0.019972977 (a = 0.1; de Bruijn 0.02). D = 1.1e-5 at N = 10 falling to 4.7e-9 at N = 1e6; C_C = 0 | Lambda_ref = 0.001997309. D = 3.0e-5, 3.0e-6, 9.1e-6, 1.9e-5, 2.7e-5 at N = 1e2 .. 1e6 (the pair next to the cut lands last and D does not tend to 0); below E_trunc = 3.06e-5, so C_C = 0 | fails only at N = 40 (no off-line zero among the first 40; D >= 0.2306 > E = 0.158). N = 60 .. 150: D = 0.054 < E. N >= 200: D = 6.1e-4 falling to 1.06e-6 at N = 1.6e5; C_C = 0 | abs(tau) - T_N equals 4 t_c of the zeta zeros below the cut, the same number for tau = -0.1 and -0.5 (0.092612, 0.049326, 0.024874, 0.013193): the statistic of the control is zeta's own | sign twist: no real entire function, not formulable; unimodular twist: translate of zeta | CLOSED. Zeros only. C_C(F, N) = 0 for every control once the list contains the pair that sets Lambda (sizes to 1e6); the inequality fails for a control only while the list stops below that pair, and it cannot be evaluated for zeta |
| 2 | curvature c(N) = abs(u_0''(x_0 + i y_N)), y_N = sqrt(2 pi / N), C_H = sqrt(2 / c) | nu = c y_N^3 / 4 at the closest pair of the first N zeros (11 sizes) and at the closest pair of each of 1e4 blocks (11 values of y_N); prime side with all prime powers to 1e10 at 300 footers | zeta 1.0e8 zeros; prime side X = 1e4 .. 1e10; lists of every control | first-N ladder: nu in [0.29, 0.50] at all 11 sizes, c grows as N^1.501 (pole scale N^1.5): the premise holds on N = 1e3 .. 1e8. Fixed footers: c_min falls as N^(-1/2) | nu in [0.10, 0.50]; same decay at fixed footers | no on-line zero: nu falls as N^(-1.92) from N = 3e3; onset N = 2 pi / a^2 = 628 (strip height below a) | equal to zeta's in three digits for N >= 3e4 (nu = 4.5, 12.6 at N = 1e3, 3e3: an off-line zero within y_N) | on-line list: nu in [0.84, 1.87], larger than zeta's; adding the 8138 off-line pairs changes c by at most 1.8e-5 | nu in [0.32, 2.0], at or above zeta's range | sign twist: no line, prime side only (same size of terms); unimodular twist: translate | CLOSED. Zeros only, and only those within a few y_N of the footer. The prime side to 1e10 gives 92 % of c at N = 100, 29 % at 1e3, 5 % at 1e4, 0.4 % at 1e5. No control decays faster than zeta except E_a, whose zeros are then resolved |
| 3 | surrogate E(N) ~ N^(-0.47) with share peak 0.949 at N = 9.22e5, against measured increments of t_c | 4 t_c(N) from the 40 records of the minimal gap; local exponent per decade; dyadic increments | zeta 1.0e8; L mod 5 9.5e5; L(chi_-4), L(chi_5) 1.25e4; DH 8.5e5; heat windows 4.0e6 | exponent per decade -1.35, -1.46, -0.55, -1.27, -0.41, -1.85 (surrogate -0.43 .. -0.47); 6 of the 10 dyadic steps above 1e6 have increment 0; no feature at 9.22e5. **Premise false; stopped** | -0.92, -0.96 (-0.97, -1.05 mod 5) | not compared (premise false) | not compared | on-line list -1.29 (not used) | -0.87 .. -1.00 (not used) | not compared | CLOSED: premise false for zeta. The surrogate landmarks are properties of the formula, reproduced to 4 digits |
| 4 | rigidity ratio r(T) = (rms or sup of S over a window) / sqrt(log log T / (2 pi^2)); Palm density at close pairs | prime side S_X, X = T^(1/4), T^(1/2), T (X <= 1e10), T = 1e6 .. 1e20, windows of 2048 mean spacings; zero side on every list; Palm density around 7.7e5 close pairs | prime side to T = 1e20 (X = 1e10); zero side to 1e12 | r_rms = 0.80 .. 0.86 (theta 1/4), 0.95 .. 0.97 (1/2), 1.06 .. 1.08 (1); zero side 1.235 at 5.6e3 falling to 1.184 at 1e12 (rms S 0.408 to 0.486). Palm: deficit 1.984 on [-6, 6], rms distance 0.038 to the pair density | prime side 0.65 .. 0.97 and 0.75 .. 1.04; zero side 1.16, 1.24; Palm distance 0.08 (noise 0.04) | prime side grows with X (1.63 to 3.55): size of the coefficients | identical for X < q; +0.54 .. 0.61 for X >= q at every T: one coefficient | on-line count drifts by 0.10 .. 0.12 per zero; detrended rms 3.8 .. 4.4 (zeta 0.41 .. 0.44); Palm deficit 1.62; small-gap exponent 1.97 in windows farther than 10 spacings from every off-line pair | detrended rms 0.468, 0.586, 1.13, 3.34 (tau = -1e-4 .. -1e-2; zeta 0.454); Palm passes (distance 0.044 .. 0.023) | sign twists (Liouville, hashed signs): r_rms within 0.013 of zeta's at every T and X: **pass**. Unimodular twist: translate | CLOSED. Prime side: mean square of the coefficients (blind to signs). Zero side: the count of the on-line list. DH departs through the small-gap law of its on-line list, T-NR and the sign twist do not |

How each object enters. Combination 1: positions of the zeros only (the last landing pair for a control, the closest pair for a real list).
Combination 2: positions of the zeros within a few y_N of the footer; the coefficients enter only through the explicit formula at
resolution 1 / log X. Combination 3: the closest pair of the list. Combination 4, prime side: abs(a(p))^2 / p summed (all primes together,
but only through their sizes); zero side: the counting function of the list.

Results that are new against the earlier rounds:
- the truncation error of the landing time is small and has the shape of the source's E_flow, about log T0 / T0: for the model with exact
  Lambda D = 0.0160 / N (c = 1) and 0.0422 / N (c = 3) without a tail and below 1e-12 with the smooth tail; for DH D N = 0.063 .. 0.17 on
  N = 200 .. 1.6e5. T_N converges to Lambda(F) for the model, DH and E_a; for T-NR the pair next to the cut keeps D between 3e-6 and
  3.4e-5, under the source's E_trunc. The bridge inequality is therefore true for the controls, with least constant 0, as soon as the
  list contains the pair that sets Lambda, and it says nothing about where that pair is;
- for the backward heat family the gap Lambda - T_N is zeta's own collision time (five digits, two values of tau). A bridge of the form
  abs(Lambda - T_N) <= E(N) is invariant under the heat flow: it cannot distinguish zeta from H_tau;
- in Lambda units (z = 2 gamma) the source inequality with the source constants fails for zeta at N = 128 .. 362 without any hypothesis
  (Lambda >= 0 and 4 t_c > E(N)); in the gamma-unit reading of t_c it does not fail (ratio at most 0.74);
- at the closest pair of the first N zeros of zeta, g_min(N) / (2 y_N) stays in [0.75, 1.61] for N = 1e3 .. 1e8, so the curvature is at the
  pole scale there with nu between 0.29 and 0.50 (round 5 read other points and found the premise false; at this reading point it holds
  in the range, and the lists that have lost zeros satisfy it with a larger constant);
- a hashed-sign or Liouville twist of Lambda(n) leaves the prime-side rigidity ratio unchanged within 0.013 (1.4 %) from T = 1e6 to 1e20.

## 1. What would have counted as survival (written before the runs)

1. Bridge: C_C(F, N) bounded in N for L(chi) (with its Lambda taken as 0) and unbounded for a control whose list already contains off-line
   pairs, at N below the index of the pair that sets its Lambda, with zeta's -t_c(N) following the L-functions.
2. Curvature: the lower envelope of c over windows keeps the pole-scale exponent for zeta and L(chi), and the envelope of a control decays
   faster in windows farther than 10 mean spacings from each of its off-line zeros.
3. Surrogate: the measured local exponent of the increments of t_c follows the surrogate for zeta at two decades (else stop), and a
   control's exponent differs at N below the index of its first off-line zero.
4. Rigidity: r grows like sqrt(log log T) for zeta and L(chi) on both sides, and a control departs in a window free of off-line zeros:
   the sign twist and T-NR on the prime side, DH on its on-line list.

## 2. What was run, where, sizes

| object | size | where |
|---|---|---|
| zeta, first zeros (list of `s1-zero-flow-dynamics`, read only) | 100,116,297 ordinates to 4.27e7 | server |
| zeta windows at 1e9 (1.02e6 zeros, list of `s2-heat-root-drift-forces`) and 1e12 (1.0e6, offsets, list of `s3-dyson-burgers-zero-flow`) | read only | server |
| L(s, chi), L(s, chibar) mod 5; DH and alt on-line lists; heat windows at 1e7, tau = 0, -1e-4, -5e-4, -2e-3, -1e-2 (lists of `s1-zero-flow-dynamics`) | 9.5e5; 8.5e5; 7.0e5; 3.9e6 to 4.0e6 | server |
| L(s, chi_-4) (12,502 zeros) and L(s, chi_5) (12,703 zeros) below 1e4 (lists of `s5-heat-landing-collision-scaling`) | read only | server |
| DH full zero set below 1e5: 147,407 on-line ordinates and 8138 off-line pairs (list of `s3-heat-zero-velocity-channels`) | read only | server |
| heat tables H_{-0.1}, H_{-0.5}, DH below 2000, zeta below 4000 (`c12-control-battery-harness`) | read only | Mac, server |
| test 1, full flows: DH N = 40 .. 3e4 (bare and with tail); H_{-0.1}, H_{-0.5} N = 50 .. 1470; E_a (a = 0.1, 0.02), T-NR (q = 1000003 and 3, c = 2.2) N = 10 .. 1e4; model (z^2 + Y^2) cos(cz) N = 100 .. 1e5 | up to 1e5 particles, 1e10 pair terms per evaluation | server, C kernel, 4 to 6 cores |
| test 1, frozen zones (only the lowest or the highest zeros below the cut move): DH N = 1e5, 1.6e5; E_a and T-NR N = 1e4, 1e5, 1e6 | up to 4e9 pair terms per evaluation | server |
| test 1, exact recheck: Newton on the polynomial heat flow, 400 to 1500 digits, five cases | N = 100 .. 400 | Mac |
| tests 1 and 3, real lists: record process of the minimal gap, long-double window flow at each record | 12 lists; 40 records for zeta | server, 2 cores |
| test 2, zero side: 13 lists and variants; 1e4 blocks for zeta; 11 values of N | 2.2e9 pole terms per list and N | server, 2 cores |
| test 2, prime side: 455,052,511 primes and their powers to 1e10; 300 footers (zeta), 25 each (L(chi_-4), L(chi_5)); 5 values of y; sharp and Riesz cut-offs at 1e4, 1e6, 1e8, 1e10 | 1.4e11 phases for zeta | server, 2 cores |
| test 4, prime side: T = 1e6, 1e8, .., 1e20 (9 heights), 8192 points per window (4096 at 1e20), 6 coefficient families and T-NR; phases T log n in binary128 | up to 4.55e8 prime powers per window | server, 2 cores |
| test 4, zero side: S(t) and Palm density on 15 lists | 1.0e8 zeros for zeta | server, 2 cores |

Local runs went through `scripts/memcap.sh 8`. Server runs went through `rhrun` only (units `rh-s6b-t1s`, `rh-s6b-t3`, `rh-s6b-t4p`,
`rh-s6b-chain`, `rh-s6b-t1x`, `rh-s6b-t1r`, `rh-s6b-t4q`, `rh-s6b-chk`; at most 8 cores requested at any time; memory limits 4 to 7 GB per unit. The sum of the
limits was 16 to 17 GB between 11:51 and 12:26 UTC, above the 12 GB of the lane, and 13 GB or less afterwards; the resident sizes seen in
`top` were 5.3 GB and 2.3 GB for the two largest processes, and the resident sum was not recorded continuously). Four units
were stopped by unit name and replaced by cheaper runs (the prime-side unit twice, and the two ladder units whose full flows at
N = 1e5 would have taken hours). GPU 1 was at 100 % utilisation with 89.6 of 97.9 GB in use by other jobs, so no GPU stage was run; every O(N^2)
field ran in the C kernels on the CPU. The machine had a load average of 107 to 117 on 48 cores during the runs.

## 3. Method and validation

**Zero ODE** (`hl.py`, `kern.c`: copies from lane s5; `bl.py`, `kb.c`: this lane). z = 2 gamma - 2 i (beta - 1/2); d_t H = -H_zz gives
dz_k/dt = 2 sum' 1/(z_k - z_j) (CLASSICAL). Pairs are carried as centre c and u = (z_1 - z_2)^2, which is regular through the landing
u = 0. Dormand-Prince 5(4), relative tolerance 1e-9. `bare`: the first N zeros with positive ordinate and their mirrors, nothing else
(the heat flow of the polynomial prod (z^2 - z_j^2)). `tail`: plus the smooth density above the cut; pairs in the top 20 % below the cut
are then not read. Frozen zones: only the M lowest (or the M highest) zeros below the cut move, the others are held at their t = 0
positions and only the pairs in the outer half of the moving zone are read.

Checks with a known answer:
- model F = (z^2 + Y^2) cos(cz), Lambda = (sqrt(1 + 4 c^2 Y^2) - 1) / (4 c^2) (node `strip-ladder-kappa`): with the tail the flow gives
  Lambda to 6.3e-9 at N = 102 and to 8e-13 for N >= 1e4 (c = 1, Y = 0.6);
- exact recheck (`t1_exact.py`): the bare flow is the polynomial heat flow P_t = exp(-t d^2/dz^2) P_0, a finite sum; the landing is the
  point (x, t) with P_t(x) = P_t'(x) = 0. Newton from the float64 values, 400 to 1500 digits (the float64 zero list taken as exact input):
  DH N = 100: 0.176745189775588442901243841614 (flow value differs by 1.3e-14); DH N = 300: 0.230826721553794092749875526643 (2.3e-12);
  H_{-0.1} N = 400: 0.043120766489814828940498801252 (6.2e-13); T-NR N = 100: 0.002027278119467616703146375800 (4.7e-15); E_0.1 N = 100:
  0.019976639977889511963098404063 (4.8e-18). This replaces the 40-digit recheck of the task text and is independent of the integrator;
- frozen zones against the full flow, DH N = 3e4: 0.230611587 (5000 lowest zeros moving) against 0.230611587 (all 3e4 moving); T-NR
  N = 10001, edge zone of 5000 zeros: 0.002006390 against 0.0020063905 (full flow); N = 1000, edge zone of 300: 0.002000342 against
  0.002000342;
- the value with tail for DH, 0.230607364 at N = 3e4, equals the value of lane s5 (0.230607 with 76,325 particles).

**Collision time of a real list** (`t3.py`). t_c(N) of the backward flow dx_k/ds = -2 sum 1/(x_k - x_j) is g_min^2/8 (1 + retardation)
(CLASSICAL lower bound g^2/8); the running minimal gap has 40 records in the first 1.0e8 zeros, and the retardation of each record pair is
taken from a backward flow of 4001 ordinates in long double (routine of lane s5; values 0.10 at N = 128, 1.2e-2 at 1e3, 2.5e-4 at 1e5, 2e-6 at 3e7; the value -2.9e-7 at the last record is
integration error).
Reproduced: t_c = 3.29820e-3 (N = 1000), 1.77801e-4 (N = 1e4), 3.38337e-8 (N = 1e8), the values of s5. In Lambda units (z = 2 gamma) the
time is 4 t_c.

**Source surrogate** (`bl.surrogate`, from imp-33620 and imp-eflow-constant-discharge): T0 = Riemann-von Mangoldt inverse of N,
E_flow = ((log(T0 / 2 pi) + 1) / 2 pi)(log T0 / T0) e^(2.37e-4), E_coll = C_C sqrt(log T0 / N) with C_C = sqrt(3 pi) / 8 = 0.38375,
E_trunc = 3.06e-5. Reproduced: E_flow(1e4) = 1.23927e-3 (source 1.239487e-3), share E_coll / E = 0.94943 at N = 9.22e5, crossover
E_coll = E_trunc at N = 3.28e9.

**Curvature** (`t2_zero.py`, `t2_prime.py`). u_0 = 2 m, m(z) = sum 1/(z - x_rho), so c = 4 abs(sum 1/(z - x_rho)^3) = 2 abs((xi'/xi)''(s)),
s = 1/2 + y + i x_0. Check: at the closest pair of the first 1000 zeros, y = 0.079, the sum over the zeros below 4000 (both signs) gives
4051.269075 and 2 abs((xi'/xi)'') from mpmath gives 4051.269075. Prime side: P_X(s) = -sum_{n <= X} Lambda(n) log^2 n w(n) n^(-s) with
w = 1 or the Riesz weight 1 - log n / log X. For the Riesz weight the explicit formula gives the identity
-P_X(s) = sum_rho k_X(s - rho) - k_X(s - 1) + (trivial zeros), k_X(w) = int_0^L v^2 (1 - v/L) e^(-wv) dv, L = log X (CLASSICAL);
measured residual of the identity with the zeros within 3000 indices of the footer: median 1.9e-8 to 6.9e-7 for zeta at 300 footers
and every (y, X), 4e-9 to 1.5e-5 for the two real characters. So the prime side is the zero sum with 2/w^3 replaced by k_X: the two agree
only where abs(w) log X is large for every zero that matters.

**S(t)** (`t4_prime.py`, `t4_zero.py`). Prime side S_X(t) = -(1/pi) sum_{n = p^k <= X} a(n) sin(t log n) / (k sqrt n) on a grid of step
1/4 mean spacing, by rotation of (cos, sin) with re-seeding every 512 steps; the base phases T log n mod 2 pi in binary128. Checks: the
phases against mpmath with 60 digits at 200 values of n up to 1e10 (`t4_phase_check.py`): largest error 2.2e-16 at T = 1e10 and 1e14,
5.4e-15 at 1e18, 3.8e-13 at 1e20; the rotation sums against direct numpy sums: 2.7e-12; against S(t) = N(t) - theta(t)/pi - 1 from the zero table near t = 3000: correlation 0.78, 0.84, 0.90 for
X = 1e2, 1e3, 1e5 (the truncated sum is an approximation of S, not S). Zero side: S is linear between zeros; rms and sup are taken in t.
Palm density: for every adjacent pair with normalised gap below 0.2 (local density from the 201 gaps around it) the positions of the 32
nearest other zeros relative to the midpoint, bins of 0.1. Check on 60 Haar unitary matrices of size 400 (171 close pairs): deficit on
[-6, 6] 1.924 (model 1.933), small-gap exponent 3.2.

## 4. Combination 1: the bridge inequality on functions whose Lambda is known

Nodes: en-bridge-inequality, lambda-chain-direction, bridge-absolute-tc-consumption, bridge-error-component-model, en-eflow-explicit.

Finite statement. For a real entire F of the class with zeros x_rho, let P_N be the polynomial with the first N zeros (positive ordinate)
and their mirrors, and T_N(F) the largest time at which the heat flow of P_N has a non-real zero (the last landing), or minus the first
backward collision time when P_N has only real zeros. The source inequality reads abs(Lambda(F) - T_N(F)) <= E(N) =
E_trunc + E_flow + C_C sqrt(log T0 / N). Statistic: D(F, N) = abs(Lambda(F) - T_N(F)) and the least C_C(F, N) that makes it true.

What "Lambda known" means for each control. Exact: the model (closed form). Exact relative to zeta: Lambda(H_tau) = abs(tau) + Lambda(zeta)
(CLASSICAL, semigroup). Computed: for DH, E_a and T-NR Lambda_ref is the last landing time of the flow with the smooth tail at the
largest N; for DH this is a lower bound of Lambda (a pair above height 1e5 could land later), for E_a and T-NR it equals Lambda if every
zeta zero is on the line.

| object | Lambda_ref | D = abs(Lambda_ref - T_N), bare polynomial | D / E(N) | least C_C(F, N) (source 0.38375) |
|---|---|---|---|---|
| model c = 1, Y = 0.6 | 0.140512484 (exact) | 1.60e-4, 1.60e-5, 1.60e-6, 1.60e-7 at N = 1e2, 1e3, 1e4, 1e5 | 1.5e-3 .. 3.7e-5 | 0 |
| model c = 3, Y = 0.6 | 0.076008565 (exact) | 4.24e-4, 4.22e-5, 4.22e-6, 4.22e-7 | 4.0e-3 .. 9.7e-5 | 0 |
| DH | 0.230607364 (tail; 0.230607245, 0.230607360, 0.230607364, 0.230607364, 0.230607364 at N = 300, 1e3, 1e4, 3e4, 1.6e5) | N = 40: >= 0.2306; 60, 100, 150: 0.0535, 0.0539, 0.0539; 200: 6.14e-4; 300: 2.19e-4; 1e3: 6.3e-5; 3e3: 2.6e-5; 1e4: 1.02e-5; 3e4: 4.2e-6; 1e5: 1.57e-6; 1.6e5: 1.06e-6 | >= 1.46; 0.40, 0.50, 0.60; 7.8e-3 falling to 3.1e-4 | >= 0.59; 0.11, 0.16, 0.20; 0 from N = 200 |
| heat tau = -0.1 | 0.1 + Lambda(zeta) (shown with Lambda(zeta) = 0) | N = 50, 100, 200 (no pair in the list): >= 0.1; 400: 0.0569; 800: 0.0249; 1200: 0.0132; 1470: 0.0132 | >= 0.70, 0.94, 1.27; 0.99, 0.59, 0.38, 0.42 | >= 0.25, 0.35, 0.51; 0.38, 0.20, 0.11, 0.13 |
| heat tau = -0.5 | 0.5 + Lambda(zeta) | N = 50: 0.384; 100: 0.281; 200: 0.129; 400: 0.0553; 801: 0.0237; 1200: 0.0053 | 2.67, 2.63, 1.63, 0.96, 0.57, 0.15 | 1.15, 1.13, 0.67, 0.37, 0.19, 0.007 |
| E_a, a = 0.1 | 0.019972977 (tail; N = 100 .. 1e5 agree in 9 digits) | 1.11e-5, 3.7e-6, 9.2e-7, 1.8e-7, 3.1e-8, 4.7e-9 at N = 10 .. 1e6 | 4.0e-5 falling to 3.2e-6 | 0 |
| E_a, a = 0.02 | 0.000799957 | 5.9e-9 (N = 100), 2.9e-10 (N = 1e4) | below 6e-8 | 0 |
| T-NR q = 1000003 | 0.001997309 (tail; N = 1e3 .. 1e5) | 3.38e-5, 3.00e-5, 3.0e-6, 9.1e-6, 1.94e-5, 2.73e-5 at N = 10 .. 1e6 | 1.2e-4, 2.8e-4, 8.0e-5, 7.0e-4, 4.5e-3, 1.85e-2 | 0 |
| T-NR q = 3 | 0.313490633 (tail) | 3.12e-3, 6.9e-4, 1.29e-4, 2.1e-5 at N = 10 .. 1e4 | 1.1e-2 falling to 1.7e-3 | 0 |

Full rows (every N, the pair that lands last, the values with the tail, the two frozen zones): `out/tables.md`, table T1a.

Readings (MEASURED unless marked).
- Model with exact Lambda: D = 0.01601 / N (c = 1) and 0.04217 / N (c = 3) for the bare polynomial, 40 to 1500 times below E_flow(N);
  with the tail D <= 1e-12 from N = 3000 on. C_C(F, N) = 0 at every N.
- DH. N = 40: the first 40 zeros are real (the first off-line pair is the 43rd and 44th zero, height 85.70), T_40 < 0 and
  D >= 0.2306 > E(40) = 0.158: the inequality fails, C_C >= 0.59. N = 60, 100, 150: the list holds the first pair or pairs but not the
  pair at height 240.4 that sets Lambda_ref; T_N = 0.1771, 0.1767, 0.1767, D = 0.054, and the inequality holds because E(N) is 0.133 to
  0.089 (C_C = 0.11 to 0.20, below the source's 0.38). N >= 200: T_N = 0.231222, 0.230827, 0.230671, 0.230634, 0.230618, 0.230612 for
  N = 200, 300, 1e3, 3e3, 1e4, 3e4, against 0.230607364 with the tail: D = 6.1e-4 falling to 4.2e-6, D N = 0.12, 0.066, 0.063, 0.079,
  0.10, 0.13. At N = 1e5 and 1.6e5 (frozen zones): 0.230608932 and 0.230608424, D = 1.57e-6 and 1.06e-6 (D N = 0.16, 0.17); the pairs
  next to the cut land at 0.144 and 0.151, earlier than the pair at 240.4. D is 20 to 170 times below E_flow(N), and C_C = 0 from
  N = 200 on.
- Backward heat family. With the tail and the top 20 % excluded, abs(tau) - T_N = 0.092612, 0.049326, 0.024874, 0.013193 at N = 400,
  800, 1200, 1470 for tau = -0.1 and the same four numbers (0.092612, 0.049326, 0.024874, 0.013193) for tau = -0.5. They are 4 t_c of the
  zeta zeros below 0.8 times the cut: 4 x 1.233116e-2 = 0.049325 (record pair at index 452), 4 x 6.21835e-3 = 0.024873 (index 692),
  4 x 3.29820e-3 = 0.013193 (index 921); 0.092612 belongs to the pair at index 297 (gap 0.4182, 4 g^2/8 = 0.08746).
  PROVED (one line): the zeros of H_tau flow to the zeros of xi in time abs(tau), so a pair of H_tau lands at abs(tau) minus the backward
  collision time of the two real zeros it becomes; the last landing among the first zeros is abs(tau) - 4 t_c(N'). Hence
  Lambda(H_tau) - T_N(H_tau) = Lambda(zeta) + 4 t_c^zeta(N'): the statistic of the control is the statistic of zeta, for every tau.
  The bare polynomial differs through its top edge: T_N = 0.5053 > abs(tau) at N = 1200 for tau = -0.5 (pair at height 1345.8, with no
  zeros above it), D = 5.3e-3.
- E_a (a = 0.1): the lowest pair (height 14.13) lands last, at 0.019972977 with the tail (de Bruijn bound 2 a^2 = 0.02). The bare
  polynomial gives D = 1.1e-5 at N = 10 and 4.7e-9 at N = 1e6; the pairs next to the cut land earlier (0.01942, 0.01923, 0.01822 at
  N = 1e4, 1e5, 1e6). C_C = 0 at every N. Lambda_ref is below E(N) for N below about 4e3, so there the inequality would also hold with
  T_N replaced by 0. a = 0.02: Lambda_ref = 0.000799957, D below 6e-9.
- T-NR, q = 1000003: the lowest pair (height 0.227) lands at 0.001997309 with the tail. In the bare polynomial the pair next to the cut
  lands last at most sizes: T_N = 0.002031, 0.002027, 0.002000, 0.002006, 0.002017, 0.002025 at N = 10, 1e2, 1e3, 1e4, 1e5, 1e6 (at
  N = 3000, local run, the lowest pair is last: 0.001997343). So D = 3.4e-5, 3.0e-5, 3.0e-6, 9.1e-6, 1.94e-5, 2.73e-5 does not tend to
  0: a pair with no zeros above it lands close to its de Bruijn time 0.002062. D is bounded by 0.002062 - 0.001997 = 6.5e-5, which is
  2.1 times the source's E_trunc = 3.06e-5. In the runs D stays below E_trunc + E_flow and C_C = 0, while D / E(N) rises from 8e-5
  (N = 1e3) to 1.85e-2 (N = 1e6). If D passes E_trunc at larger N the least constant grows like sqrt N; that would be the effect of the
  off-line pair next to the cut, at a height the list then contains. Not reached here (E(N) falls to 8.5e-5 at N = 1e9 and 4.9e-5 at
  N = 1e10, inside the range D can reach). q = 3: the pair at height 2.86 lands last at
  every N, D = 3.1e-3 falling to 2.1e-5 at N = 1e4, C_C = 0.
- zeta. T_N = -4 t_c(N): -0.282, -0.0991, -0.0493, -0.0132, -7.1e-4, -1.08e-4, -1.6e-5, -2.7e-6, -1.35e-7 at N = 128, 256, 512, 1024,
  8192, 1.3e5, 1e6, 1.7e7, 1e8; exponent -1.005 over the ladder (-0.660 for blocks at a fixed height: the GUE value -2/3). Because
  Lambda >= 0 (CLASSICAL, Rodgers-Tao), abs(Lambda - T_N) >= 4 t_c, and 4 t_c / E(N) = 2.94 (N = 128), 2.06 (181), 1.40 (256), 1.02 (362),
  0.96 (512): with the source constants and the time in Lambda units the inequality is false for zeta at N <= 362, with no hypothesis. In the
  gamma-unit reading (t_c against E) the ratio is 0.74 at N = 128 and falls. For N >= 512 the inequality is the statement
  Lambda(zeta) <= E(N) - 4 t_c(N), which is 0.0023 at N = 512 and 1.92e-4 at N = 1e8; nothing computed here bears on it.
- L-functions, with Lambda = 0 assumed: C_C = 0.20 (L(chi_-4), at N = 256), 0.25 (L(chi_5), N = 181), 0.43 and 0.57 (mod 5, N = 256 and
  128), and 0 at the top of each ladder; exponents of 4 t_c: -0.92, -0.96, -0.97, -1.05.

Classification: CLOSED. The object enters through its zeros only. C_C(F, N) is largest at the smallest N and is 0 for every control
once the first N zeros contain the pair that sets Lambda (sizes to 1e6; for T-NR the pair next to the cut keeps D between 3e-6 and
3.4e-5, under the source's E_trunc). The inequality fails for a control exactly while the list does not yet contain that pair (DH:
N = 40; heat tau = -0.5: N <= 200; heat tau = -0.1: N = 200, with no pair in the list), which is the statement that the list has not
reached it. For zeta the left side cannot be evaluated; the heat family shows that the statistic is the same for zeta and for H_tau;
and the truncation part of the error (the only part that can be measured on the controls) is 20 to 1500 times below the source's
E_flow.

## 5. Combination 2: curvature at the shock point

Nodes: ch-holder-half-sharp, ch-single-conditional, finite-height-shock-curvature-lower-bound, g6a-shock-lipschitz-catalogue,
step4-bridge-clip-gate, g6a-shock-lipschitz-two-routes.

Source (imp-36236): C_H = sqrt(2 / abs(u_0''(z_0*))), z_0* = x_0 + i y_N at the footer of the shock; branch B of the source expects
abs(u_0'') about 4 / y_N^3 (pole scale) and needs a lower bound at that scale (H3, uniform curvature). nu = c y_N^3 / 4 is 2 for a
coalesced pair at the footer, 1/2 for a pair of gap 2 y_N, and 6 (2 y_N / g)^4 for a pair of gap g much larger than y_N.

**First-N ladder** (footer = closest pair of the first N zeros).

| list | r = g_min / (2 y_N) and nu at N = 1e3, 1e4, 1e5, 1e6, 1e7, 1e8 | exponent of c (pole scale 1.5) |
|---|---|---|
| zeta | r 1.02, 0.75, 0.93, 1.14, 1.47, 1.04; nu 0.500, 0.363, 0.491, 0.477, 0.349, 0.498 (all 11 sizes: r in [0.75, 1.61], nu in [0.29, 0.50]) | 1.501 |
| L(chi) mod 5 (to 3e5) | r 0.52, 1.21, 0.61; nu 0.185, 0.452, 0.099 (N = 3e5: 0.495) | 1.499 |
| L(chi_-4), L(chi_5) (to 1e4) | nu 0.452, 0.283 and 0.270, 0.500 | 1.29, 1.76 (3 points) |
| T-NR q = 1000003, zeta zeros plus the off-line progression | nu 4.53, 0.366, 0.491, 0.477, 0.349, 0.498 (N = 3e3: 12.6) | 1.31 |
| zeta(s+a)zeta(s-a), a = 0.1 | nu 1.22, 0.0364, 4.6e-4, 4.7e-6, 4.8e-8, 4.8e-10 | -0.42 |
| DH on-line (to 3e5) | r 0.35, 0.21, 0.10; nu 0.913, 1.53, 1.87; with the off-line pairs added: the same three digits | 1.56 |
| alt on-line (to 3e5) | nu 0.51, 0.307, 1.20 | 1.71 |
| heat tau = -1e-4, -2e-3, -1e-2 (windows at 1e7, to 3e6) | nu 1.14, 0.32, 1.66, 1.17; 1.69, 1.60, 1.97, 1.72; 2.00, 1.98, 1.77, 1.91 | 1.59, 1.48, 1.49 |

- zeta: the premise holds at every size reached. C_H(N) = sqrt(2 / c) is 1.41 to 1.84 times the pole value y_N^(3/2) / sqrt 2. The reason is
  the size of the minimal gap: g_min(N) / (2 y_N) has no trend on this range (fitted exponent 0.012). With the GUE law of the minimal gap,
  g_min is about 0.9 N^(-1/3) times the mean spacing, and r would be 0.66, 0.82, 1.54 at N = 1e3, 1e5, 1e8 and grow like
  N^(1/6) / log N beyond (nu then falls as r^(-4)); the measured ladder (10 distinct record pairs) does not resolve this drift.
- The lists that have lost zeros to the complement of the line (DH, alt, heat) have smaller minimal gaps and therefore larger nu: they
  satisfy the hypothesis with a better constant than zeta. This is the same fact as round 5's finding that the N^(-1/2) law of E_coll is
  the law of those lists.
- T-NR: its off-line zeros sit at distance 0.0321 from the line at every height (2.2 per unit height). For y_N above that distance
  (N <= 6000) they add poles of the same size as the pair (nu = 4.5, 12.6); for y_N below it their contribution is bounded while the pole
  scale grows, and nu equals zeta's to three digits from N = 3e4 on (0.366 against 0.363 at N = 1e4).
- E_a: all zeros at distance a = 0.1 from the line, c stays of size 1e2 to 1e4 while the pole scale grows as N^(3/2): the hypothesis fails
  from N = 3e3. The onset is y_N < a, that is N > 2 pi / a^2 = 628: the strip has become narrower than the displacement of the zeros.
- DH with its 8138 off-line pairs added: relative change of c at most 1.8e-5 (blocks) and none in three digits on the ladder; the
  nearest off-line pair is far on the scale y_N.

**Blocks** (footer = closest pair of each block, the same footers for every y_N; `out/tables.md`, table T2b).

| list (blocks x zeros) | nu min, median at N = 1e3 | at 1e5 | at 1e8 | c min at N = 1e6, 1e7, 1e8 | c / (pair only), range at N = 1e6 |
|---|---|---|---|---|---|
| zeta (10000 x 10011) | 1.17, 1.85 | 4.9e-4, 0.413 | 8.4e-8, 4.1e-6 | 2.04e5, 6.69e4, 2.12e4 | 1.000 .. 1.000 |
| T-NR (same footers) | 0.61, 1.64 | 8.3e-4, 0.413 | 9.7e-8, 4.1e-6 | 2.28e5, 7.76e4, 2.46e4 | 0.978 .. 1.34 |
| E_a, a = 0.1 (same footers) | 1.2e-3, 31.8 | 2.7e-4, 4.5e-4 | 2.7e-10, 4.6e-10 | 669, 212, 68.9 | 2.5e-6 .. 3.3e-3 |
| L(chi) mod 5 (1892 x 500) | 7.5e-4, 0.759 | 7.1e-5, 0.023 | 7.1e-11, 2.9e-8 | 181, 57.3, 18.1 | 1.000 .. 1.000 |
| DH on-line (1695 x 500) | 1.5e-3, 1.13 | 3.2e-4, 0.051 | 3.3e-10, 7.4e-8 | 836, 265, 83.9 | 1.000 .. 1.000 |
| heat 0 = zeta at 1e7 (8046 x 500) | 1.3e-3, 1.08 | 2.3e-3, 0.047 | 2.5e-9, 6.5e-8 | 6.17e3, 1.96e3, 622 | 1.000 .. 1.01 |
| heat tau = -1e-2 (7729 x 500) | 0.050, 1.67 | 2.2e-3, 0.226 | 4.8e-9, 7.2e-7 | 1.21e4, 3.85e3, 1.22e3 | 1.000 .. 1.01 |

- With the footers fixed, c_min falls by the factor sqrt 10 per decade of N (exponent -1/2) on every list, and nu_min by 10^2: once
  y_N is below the gap of the pair, c = 24 y_N / (g/2)^4. Uniform curvature at the pole scale holds only at the pair that is closing at the
  scale y_N; it fails at every other footer of every list.
- From N = 1e5 on c equals the value of the two zeros of the pair alone to three digits (zeta: 0.998 to 1.000 over 1e4 blocks): the
  statistic is the gap of one pair divided by y_N.
- DH, blocks farther than 10 mean spacings from every off-line pair (128 of 294): c_min 32.6, 2.58e3, 83.9 at N = 1e3, 1e5, 1e8,
  equal to or above the minimum over all blocks (32.6, 2.29e3, 74.9). No decay faster than zeta's.

**Prime side** (zeta, 300 footers at heights 7.0e3 to 4.27e7; all 455,052,511 primes and their powers to 1e10).

| N | y_N | y_N log X at X = 1e10 | c zero side, median | sharp cut-off / zero side at X = 1e6: 10 %, 50 %, 90 % | at X = 1e10 | Riesz / zero side at X = 1e10 |
|---|---|---|---|---|---|---|
| 1e2 | 0.2507 | 5.77 | 463 | 0.55, 0.65, 0.74 | 0.90, 0.92, 0.94 | 0.44, 0.46, 0.48 |
| 1e3 | 0.0793 | 1.83 | 1.49e4 | 0.075, 0.11, 0.14 | 0.25, 0.29, 0.34 | 0.088, 0.095, 0.10 |
| 1e4 | 0.0251 | 0.58 | 2.26e5 | 0.0059, 0.012, 0.057 | 0.025, 0.048, 0.20 | 0.0068, 0.013, 0.050 |
| 1e5 | 0.00793 | 0.18 | 3.24e6 | 6.1e-4, 1.1e-3, 2.7e-3 | 3.1e-3, 4.4e-3, 0.011 | 9.1e-4, 1.1e-3, 2.7e-3 |
| 1e6 | 0.00251 | 0.06 | 7.71e6 | 7.3e-5, 4.4e-4, 2.3e-3 | 3.2e-4, 2.0e-3, 9.4e-3 | 7.4e-5, 5.0e-4, 2.3e-3 |

- The prime side reaches 92 % of c where y_N log X is 5.8 and 0.2 % where it is 0.06. To resolve y_N it needs log X of order 1 / y_N:
  X = exp(sqrt(N / 2 pi)), which is e^126 at N = 1e5. For N = 1e7, 1e8 the prime side was not run (y_N log X below 0.02).
- L(chi_-4), L(chi_5), 25 footers each below 1e4: 0.99 and 1.00 (median) at N = 100, X = 1e10; 0.16 and 0.18 at N = 1e4: the same law.
- T-NR on the prime side: its coefficient at n = q adds a term of size log^3 q (alpha + 1/alpha) q^(-y) = 5.8e3 q^(-y) to P_X for X >= q;
  relative to the zero-side sum it is 0.79, 0.26, 0.036, 0.003, 0.001 at N = 1e2 .. 1e6. The prime side separates T-NR from zeta through
  one coefficient, at heights and strip widths where it does not see either object's zeros.
- Sign twist: no functional equation and no zero list on the line; on the prime side its truncated sum has the same mean square as
  zeta's (the weights are squared). Not run separately. Unimodular twist: the footers are translated.

Classification: CLOSED. The curvature is a function of the zeros within a few y_N of the footer (for N >= 1e5 of the two zeros of the
pair). zeta passes on the first-N ladder for the whole range; L(chi) passes; DH, alt and the heat lists pass with larger nu; T-NR
coincides with zeta once y_N is below its displacement; E_a fails when y_N falls below a, that is when the strip resolves its zeros.
Nothing fails in windows without off-line zeros.

## 6. Combination 3: surrogate landmarks against measured increments

Nodes: en-floors-at-etrunc, etrunc-floor-height-law, sigma-share-turnover, sigma-interior-peak, crossover-closed-form,
en-monotone-no-minimum, en-fold-amplitude.

Premise on zeta: the surrogate E(N) = E_trunc + E_flow + E_coll describes the decay of the collision time and its increments.

| N range | local exponent of 4 t_c(N) | of E(N) | of E_coll | share sigma at mid-decade | dyadic steps with increment 0 | 4 t_c / E at the ends |
|---|---|---|---|---|---|---|
| 1e2 .. 1e3 | -1.35 | -0.449 | -0.438 | 0.847 | 0 of 4 | 2.94 .. 0.565 |
| 1e3 .. 1e4 | -1.46 | -0.468 | -0.448 | 0.881 | 0 of 5 | 0.351 .. 0.050 |
| 1e4 .. 1e5 | -0.55 | -0.473 | -0.457 | 0.921 | 0 of 5 | 0.059 .. 0.042 |
| 1e5 .. 1e6 | -1.27 | -0.469 | -0.463 | 0.946 | 1 of 4 | 0.028 .. 0.0096 |
| 1e6 .. 1e7 | -0.41 | -0.458 | -0.468 | 0.944 | 4 of 5 | 0.011 .. 0.0079 |
| 1e7 .. 1e8 | -1.85 | -0.426 | -0.472 | 0.892 | 2 of 5 | 0.0057 .. 0.00069 |

- t_c(N) is a step function with 40 steps in 1.0e8 zeros (the records of the minimal gap); its exponent over the ladder is -1.005, and
  -0.660 for the median over blocks at fixed height (N = 100 .. 1e6, heights 2.2e7 to 4.3e7), against -0.43 to -0.47 for the surrogate.
  The exponents per decade scatter between -0.41 and -1.85 because each decade holds 4 to 8 records.
- The dyadic increments abs(t_c(2N) - t_c(N)) are 0 in 8 of the 18 steps from N = 1.3e5 on and their fitted exponent changes sign between
  decades (-1.62, -0.74, +0.82, +1.59, none, -3.19).
- Share peak. sigma = E_coll / E has its maximum 0.94943 at N = 9.22e5 in the formula (reproduced). In the data there is no quantity
  that peaks there: t_c is constant from N = 4.2e5 to 1.1e6 (one record pair, index 420,890) and 4 t_c / E rises from 0.0082 to 0.0113
  on that interval only because E falls.
- The surrogate is an upper envelope with a growing margin from N = 512 on (ratio 0.96 at 512, 7.0e-4 at 1e8); at N <= 362 it is smaller
  than 4 t_c (section 4).

Premise false for zeta at every decade: recorded, and the comparison of the controls is stopped as the task prescribes. For the record,
the same job ran the other lists (not used for the classification): whole-ladder exponents -0.92 (L(chi_-4)), -0.96 (L(chi_5)), -0.97
and -1.05 (mod 5), -1.29 (DH on-line), -1.01 (alt), -0.87 to -1.00 (heat tau < 0); block exponents -0.635, -0.615 (mod 5), -0.914 (DH),
-0.936 (alt), -0.843, -0.833, -0.959, -1.048 (heat, tau = -1e-4 .. -1e-2), -0.660 (zeta at 1e7). The lists with lost zeros have the
exponent -1 of the quadratic small-gap law, as in round 5.

Classification: CLOSED, premise false. The landmarks (floor, peak, crossover, fold) are properties of the three-term formula.

## 7. Combination 4: rigidity ratio and Palm density

Nodes: mem-gronwall-backward-kh, esy-layer-ii-rigidity-scale, cf-flip-reach-gue-regularization, gue-palm-coalesced-pair,
r5-tail-monotonicity-split, esy-layer-i-local-semicircle-deterministic-seed.

The source ratio (imp-36221) is the formula r(T) = sqrt(log log T / (2 pi^2)) (0.3324 to 0.3578 on its window); the test compares it with
the measured rms and sup of S.

**Prime side** (r_rms / r_sup; windows of 2048 mean spacings, 8192 points).

| T | X | theta | zeta | Liouville twist | hashed-sign twist | L(chi_-4) | L(chi_5) | T-NR q = 1000003 | E_a, a = 0.1 |
|---|---|---|---|---|---|---|---|---|---|
| 1e+06 | 31.6228 | 0.25 | 0.802 / 2.57 | 0.800 / 2.65 | 0.803 / 2.74 | 0.651 / 2.12 | 0.750 / 2.43 | 0.802 / 2.57 | 1.629 / 5.23 |
| 1e+06 | 1000 | 0.50 | 0.946 / 3.49 | 0.944 / 3.22 | 0.941 / 3.28 | 0.819 / 2.97 | 0.898 / 3.08 | 0.946 / 3.49 | 1.988 / 7.39 |
| 1e+06 | 1e+06 | 1.00 | 1.075 / 3.60 | 1.074 / 3.62 | 1.078 / 4.34 | 0.964 / 3.61 | 1.038 / 3.50 | 1.075 / 3.60 | 2.575 / 8.55 |
| 1e+08 | 100 | 0.25 | 0.813 / 2.69 | 0.814 / 2.54 | 0.814 / 2.88 | 0.683 / 2.41 | 0.768 / 2.78 | 0.813 / 2.69 | 1.667 / 5.52 |
| 1e+08 | 10000 | 0.50 | 0.949 / 3.38 | 0.948 / 3.58 | 0.946 / 3.47 | 0.839 / 3.43 | 0.905 / 3.01 | 0.949 / 3.38 | 2.063 / 7.31 |
| 1e+08 | 1e+08 | 1.00 | 1.068 / 3.48 | 1.068 / 3.66 | 1.068 / 3.97 | 0.973 / 3.58 | 1.023 / 3.53 | 1.676 / 4.96 | 2.952 / 10.28 |
| 1e+10 | 316.228 | 0.25 | 0.830 / 2.88 | 0.832 / 2.91 | 0.830 / 2.91 | 0.709 / 2.34 | 0.786 / 2.51 | 0.830 / 2.88 | 1.722 / 5.94 |
| 1e+10 | 100000 | 0.50 | 0.955 / 3.74 | 0.958 / 3.43 | 0.955 / 3.36 | 0.848 / 3.10 | 0.918 / 3.36 | 0.955 / 3.74 | 2.169 / 8.93 |
| 1e+10 | 1e+10 | 1.00 | 1.064 / 3.70 | 1.066 / 3.75 | 1.063 / 3.95 | 0.971 / 3.55 | 1.029 / 3.56 | 1.647 / 5.26 | 3.554 / 11.90 |
| 1e+12 | 1000 | 0.25 | 0.842 / 2.82 | 0.840 / 2.87 | 0.844 / 3.02 | 0.729 / 2.58 | 0.802 / 3.21 | 0.842 / 2.82 | 1.770 / 5.99 |
| 1e+12 | 1e+06 | 0.50 | 0.959 / 3.46 | 0.957 / 3.79 | 0.967 / 3.71 | 0.857 / 3.27 | 0.928 / 3.41 | 0.959 / 3.46 | 2.294 / 8.18 |
| 1e+14 | 3162.28 | 0.25 | 0.846 / 2.83 | 0.845 / 3.19 | 0.844 / 3.08 | 0.736 / 2.92 | 0.810 / 2.48 | 0.846 / 2.83 | 1.805 / 6.04 |
| 1e+14 | 1e+07 | 0.50 | 0.969 / 3.87 | 0.968 / 3.53 | 0.956 / 3.76 | 0.862 / 3.55 | 0.925 / 3.19 | 1.528 / 5.37 | 2.511 / 9.44 |
| 1e+16 | 10000 | 0.25 | 0.856 / 3.05 | 0.855 / 3.42 | 0.850 / 2.68 | 0.749 / 2.35 | 0.812 / 2.63 | 0.856 / 3.05 | 1.861 / 6.89 |
| 1e+16 | 1e+08 | 0.50 | 0.954 / 3.52 | 0.953 / 3.40 | 0.950 / 3.16 | 0.870 / 3.19 | 0.923 / 3.47 | 1.514 / 4.78 | 2.618 / 8.88 |
| 1e+18 | 31622.8 | 0.25 | 0.855 / 3.10 | 0.856 / 3.18 | 0.860 / 3.00 | 0.765 / 2.54 | 0.828 / 3.15 | 0.855 / 3.10 | 1.888 / 7.03 |
| 1e+18 | 1e+09 | 0.50 | 0.958 / 3.51 | 0.958 / 3.53 | 0.961 / 3.55 | 0.875 / 2.85 | 0.940 / 3.71 | 1.498 / 4.74 | 2.864 / 10.61 |
| 1e+20 | 100000 | 0.25 | 0.861 / 2.77 | 0.858 / 2.68 | 0.857 / 2.67 | 0.782 / 2.92 | 0.827 / 2.49 | 0.861 / 2.77 | 1.930 / 6.12 |
| 1e+20 | 1e+10 | 0.50 | 0.955 / 3.69 | 0.952 / 3.27 | 0.949 / 3.09 | 0.895 / 3.45 | 0.923 / 2.94 | 1.491 / 4.92 | 3.229 / 11.56 |

The window at T = 1e20 has 4096 points (1024 mean spacings); all others 8192 (2048).

- zeta: r_rms is 0.80 to 0.86 at theta = 1/4 (rising slowly with T), 0.95 to 0.97 at theta = 1/2, 1.06 to 1.08 at theta = 1 (T <= 1e10):
  the growth sqrt(log log T) holds on the prime side from 1e6 to 1e20. r_sup is 2.6 to 3.9 per window.
- Sign twists. Liouville (a(p^k) = (-1)^k) and hashed signs eps_p = +-1 (completely multiplicative): r_rms within 0.013 of zeta's in every
  cell (largest difference at T = 1e14, X = 1e7: 0.956 against 0.969), r_sup within the scatter between windows (2.5 to 4.3 against
  2.6 to 3.9). The sign twist passes. PROVED (one line): the mean square of S_X over a long window is (1 / 2 pi^2) sum abs(a(n))^2 /
  (k^2 n), which depends on abs(a(n)) only.
- L(chi_-4), L(chi_5): 0.65 to 0.97 and 0.75 to 1.04, below zeta by the terms of the missing prime (2, respectively 5).
- T-NR: identical to zeta for X < q in every cell; for X >= q its coefficient at q adds (c / pi) sin(t log q) and r_rms rises by 0.54 to
  0.61 (1.676 against 1.068 at T = 1e8; 1.647 against 1.064 at 1e10; 1.491 against 0.955 at 1e20), at every height. The onset is X >= q, not a height.
- E_a (a = 0.1): the coefficients p^a + p^(-a) violate the Ramanujan bound and r_rms grows with X at fixed T: 1.63, 1.99, 2.58 at
  T = 1e6; 1.72, 2.17, 3.55 at T = 1e10; 1.93, 3.23 at T = 1e20. It fails through the size of its coefficients at every T.
- DH has no Euler-type prime side; heat tau < 0 likewise.

**Zero side** (windows of 2048 zeros).

| list | height | rms of S | r_rms | sup of abs(S): median, max over windows | drift of S per zero | rms after removing a linear trend per window |
|---|---|---|---|---|---|---|
| zeta | 5.6e3 / 5.7e4 / 5.7e5 / 5.7e6 / 2.7e7 | 0.4080 / 0.4275 / 0.4406 / 0.4510 / 0.4572 | 1.235 / 1.228 / 1.218 / 1.210 / 1.206 | 1.36, 1.45 / 1.48, 1.63 / 1.58, 1.83 / 1.64, 2.00 / 1.67, 2.14 | below 2e-7 | equal to the rms |
| zeta | 1e9 / 1e12 | 0.4691 / 0.4855 | 1.197 / 1.184 | 1.74, 2.03 / 1.83, 2.39 | below 5e-7 | equal |
| L(chi_-4), L(chi_5) | 5.3e3 | 0.383, 0.409 | 1.162, 1.240 | 1.28, 1.37 | below 3e-7 | equal |
| L(chi) mod 5 | 5.3e3 / 5.7e4 / 3.1e5 | 0.4088 / 0.4249 / 0.4337 | 1.240 / 1.220 / 1.210 | 1.38 / 1.47 / 1.54 | below 1e-7 | equal |
| DH on-line (count against the density of all zeros of DH) | 5.7e3 / 5.7e4 / 3.1e5 | drift dominates | - | - | -0.096 / -0.113 / -0.118 | 4.43 / 3.81 / 4.09 |
| alt on-line | 5.1e3 / 5.7e4 / 3.1e5 | drift dominates | - | - | -0.43 / -0.37 / -0.35 | 7.35 / 5.66 / 5.74 |
| heat tau = 0 / -1e-4 / -5e-4 / -2e-3 / -1e-2 (windows at 1e7) | 1.09e7 | 0.454 / drift | 1.209 / - | 1.66, 1.99 / - | 1e-7 / 1e-7 / 1e-6 / -3.7e-3 / -4.1e-2 | 0.4542 / 0.4677 / 0.5863 / 1.127 / 3.339 |

- zeta: rms S grows from 0.408 to 0.486 between 5.6e3 and 1e12; (rms S)^2 against log log T has slope 0.0595 between the two ends
  (1 / 2 pi^2 = 0.0507), and r_rms falls from 1.235 to 1.184: the known constant below the leading term. The median over windows of
  sup abs(S) grows from 1.36 to 1.83, the largest value in a window from 1.45 to 2.39. The L-functions give the same numbers at the
  same heights (1.240, 1.220, 1.210 against 1.235, 1.228, 1.218).
- DH, alt, heat: the on-line count falls below the smooth count of all zeros by two per off-line pair; after removing the linear trend
  per window the rms is 3.8 to 4.4 (DH), 5.7 to 7.4 (alt), and 0.468, 0.586, 1.13, 3.34 for the heat lists with off-line fractions
  4.6e-5, 4.9e-4, 3.9e-3, 3.9e-2. The departure is the fluctuation of the number of missing zeros per window; it needs the complete
  on-line list of the window, which is the Turing count. T-NR: the on-line list is zeta's.

**Palm density around close pairs** (normalised gap below 0.2).

| list | pairs | deficit on [-6, 6] (model 1.933) | rms distance to 1 - S^2 - 3 S'^2 / pi^2 on [-3, 3] | to 1 - S^2 | noise per bin | fraction of gaps below 0.2 (GUE 0.00877) | small-gap exponent |
|---|---|---|---|---|---|---|---|
| zeta, first 1.0e8 | 773,551 | 1.984 | 0.0384 | 0.2715 | 0.0036 | 0.00773 | 2.99 |
| zeta at 1e9 / 1e12 | 8240 / 8284 | 1.962 / 1.970 | 0.036 / 0.028 | 0.264 / 0.252 | 0.035 | 0.00808 / 0.00829 | 3.04 / 3.14 |
| L(chi), L(chibar) mod 5 | 6657 / 6614 | 1.939 / 1.938 | 0.088 / 0.077 | 0.306 / 0.300 | 0.039 | 0.00703 / 0.00699 | 2.95 / 3.07 |
| L(chi_-4), L(chi_5) | 71 / 75 | 1.93 / 2.16 | 0.25 / 0.33 | 0.41 / 0.47 | 0.37 | 0.0058 / 0.0060 | 3.1 / 3.1 |
| heat tau = 0 / -1e-4 / -5e-4 / -2e-3 / -1e-2 | 30,789 .. 65,512 | 1.978 / 1.978 / 1.976 / 1.972 / 1.866 | 0.044 / 0.044 / 0.044 / 0.039 / 0.023 | 0.27 .. 0.25 | 0.018 .. 0.012 | 0.00765 / 0.00784 / 0.00852 / 0.0105 / 0.0170 | 2.96 / 2.79 / 2.54 / 2.23 / 2.06 |
| DH on-line (8.5e5) | 7219 | 1.618 | 0.121 | 0.276 | 0.037 | 0.00852 | 1.99 |
| alt on-line | 7854 | 1.564 | 0.111 | 0.239 | 0.036 | 0.0112 | 2.08 |
| DH below 1e5, pairs farther than 5 / 10 / 20 mean spacings from every off-line pair | 818 / 459 / 114 | 1.01 / 0.76 / 0.91 | 0.19 / 0.19 / 0.27 | 0.30 / 0.29 / 0.33 | 0.11 / 0.15 / 0.30 | 0.0099 / 0.0133 / 0.0190 | 1.82 / 1.97 / 2.42 |
| DH below 1e5, pairs within 5 mean spacings of an off-line pair | 383 | 2.83 | 0.15 | 0.34 | 0.16 | - | - |

- zeta follows the pair density, not the one-point density 1 - S^2 (distance 0.038 against 0.27). The residual 0.038 is ten times the
  noise. It is not the finite gap of the pairs: against the exact three-point density of the sine process for a pair of gap s, averaged
  over s < 0.2 (`t4_palm_model.py`), the distance is 0.037. It is not the code: 2500 Haar unitary matrices of size 300 (6413 close
  pairs) give 0.027 with noise 0.040, fraction of gaps below 0.2 equal to 0.00855 and exponent 3.04. It sits at abs(u) < 1.2, where
  zeta's density is below the model: 0.014 against 0.028 at u = 0.35, 0.162 against 0.239 at 0.65, 0.555 against 0.633 at 0.95; and
  zeta has fewer close pairs than the sine process: 0.00773 (heights below 4.3e7), 0.00808 (1e9), 0.00829 (1e12) against 0.00877. At
  1e9 and 1e12 the distance (0.035, 0.027) is at the noise (0.035). This is the size and direction of the known lower-order terms at
  finite height; it was not pursued. The deficit on [-6, 6] is 1.984 against 1.934 for the model. The mirror count 3.021 of the node is
  a quantity of the frozen-neighbour model of the route source and was not recomputed.
- Heat lists: the Palm density stays at the same distance from the model while the small-gap exponent falls from 2.96 to 2.06. The Palm
  statistic does not see the backward heat family.
- DH on-line: deficit 1.62 (alt 1.56), distance 0.12. In windows farther than 10 mean spacings from every off-line pair the small-gap
  exponent is 1.97 +- 0.2 and the fraction of gaps below 0.2 is 0.0133 against 0.0077 for zeta: the departure of the DH on-line list is
  present away from its off-line zeros. The Palm deficits of the conditioned selections (1.01, 0.76 far; 2.83 near) are biased by the
  conditioning (the local density is taken from 201 gaps that include or exclude the holes) and are not used.

Classification: CLOSED. Prime side: r is the mean square of the coefficients; the sign twist passes, T-NR and E_a fail through the size of
one coefficient or of all of them (first coefficient that differs, X >= q; Ramanujan bound), not through a height. Zero side: r is the
counting function of the list, and its departure for DH and the heat lists is the count of missing zeros. The Palm and small-gap
statistics of the on-line list separate DH (and alt) from zeta in windows without off-line zeros, which meets the letter of the fail
condition for DH, for a reason that does not resolve its off-line zeros; they do not separate T-NR (the same list), they do not exist for
the sign twist and E_a, and the Palm density does not separate the heat family. Round 1 and round 5 recorded the same small-gap law
(3.00 for zeta, 2.1 for DH). A local statistic of the ordinates passes for T-NR at every size because it never sees its off-line zeros.

## 8. Control onsets against the heights of the off-line zeros

| control | first off-line zero | combination 1 | combination 2 | combination 3 | combination 4 |
|---|---|---|---|---|---|
| DH | 85.70 (zeros 43, 44) | fails at N = 40 only (list without off-line zero); C_C = 0 from N = 200 (pair at 240.4 in the list) | on-line list passes with larger nu; off-line pairs change c by 1.8e-5 at most | not compared | count: from the first missing pair; small-gap law: everywhere on the list, also 10 spacings away from every off-line pair |
| heat tau < 0 | 415 (tau = -0.1), 112 (-0.5) | D equals zeta's 4 t_c; fails while the list holds no pair that lands late (N = 200 for tau = -0.1, N <= 200 for -0.5) | passes with larger nu | not compared | count: grows with the off-line fraction; Palm: passes |
| zeta(s+a)zeta(s-a) | 14.13 (every zero) | passes at every N to 1e6 (T_N within 1.1e-5 of Lambda) | fails from y_N < a (N > 628) | not compared | prime side: grows with X at every T |
| T-NR q = 1000003 | 0.227 | passes at every N to 1e6; D is set by the pair next to the cut and does not decay | equal to zeta from N = 3e4 (y_N < 0.032 from N = 6100) | not compared | prime side: X >= q, at every T; zero side: identical |
| sign twist | no line | not formulable | no list | no list | passes on the prime side |
| unimodular twist | none | as zeta | as zeta | as zeta | as zeta at t + alpha |

No control fails at a size smaller than its off-line zeros explain except through one of two channels already recorded in rounds 1 to 5:
the first coefficient that differs (T-NR at X >= q, E_a at every prime) and the small-gap law of an on-line list that has lost zeros (DH,
alt). The sign twist passes the one test that uses all primes together.

## 9. Three weakest steps

1. Lambda_ref of DH, E_a and T-NR is a computed last landing time (float64 flow with a model tail), not a proved value: for DH it is a
   lower bound of Lambda that uses the off-line list below 1e5 of lane s3 (not certified complete); for E_a and T-NR it is Lambda only if
   zeta has no off-line zero. The runs at N = 1e5 .. 1e6 freeze all zeros outside a zone of 2000 to 1e4 zeros; the frozen approximation
   was checked against full flows at N = 3e4, 1e4 and 1e3 only.
2. The first-N curvature ladder of zeta has 11 sizes and 10 distinct record pairs, so "no trend of g_min / (2 y_N)" is a statement
   about 11 numbers between 0.75 and 1.61; the GUE prediction of a slow growth is neither confirmed nor excluded. The block statistic uses
   blocks of 10,011 zeros for zeta and 500 for the shorter lists, so its minima are compared in exponent only.
3. The prime-side S_X is the truncated sum, an approximation of S (correlation 0.90 at X = 1e5, T = 3000). One window per (T, X) was
   computed, so r_sup carries the scatter of one sample (about +-0.5 between families); the window at T = 1e20 is half as long as the
   others. The residual 0.038 between zeta's Palm density and the sine-process model is attributed to finite height on the evidence of
   section 7, not derived.

## 10. Files

Code (this directory): `kern.c`, `kern2.c`, `hl.py` (copies from lane s5: pair forces in double and long double, flow integrator);
`kb.c`, `kbq.c` (this lane: frozen external field, rotation sums on a uniform grid, sums at arbitrary points with exact phase
reduction, binary128 phases), `build.sh`, `bl.py` (wrappers, source surrogate, control zero sets, frozen-zone flow, sieve);
`t1.py`, `t1_exact.py`; `t3.py`; `t2_zero.py`, `t2_prime.py`; `t4_prime.py`, `t4_val.py`, `t4_phase_check.py`, `t4_zero.py`, `t4_palm_model.py`, `t4_cue.py`; `mk_tables.py`;
`run_t1.sh`, `run_t1x.sh`, `run_t1r.sh`, `run_t3.sh`, `run_t4p.sh`, `run_t4z.sh`, `run_t2.sh`, `run_chain.sh`.
Outputs: `out_server/` (server runs: `t1_<object>_<mode>[_M..|_top..].json`, `t3_<list>.json`, `t2z_<list>.json`, `t2p_<family>.json`,
`t4p_<T>.json`, `t4z_<list>.json`, logs), `out/` (Mac runs: validation, `t1_exact_*.json`, `local_tail/`, and `tables.md` = all
generated tables). The heat ladders with the tail were re-run on the Mac after the rule "top 20 % not read" was added (`out/local_tail/`)
and replace the server files of the same name in `out_server/`; the server run of those two files had read the pair next to the cut
(0.5049 for tau = -0.5). Server copy: `~/rh-push/s6-bridge-error-ladder-known-lambda/`. All units of the lane have ended; none is running.
