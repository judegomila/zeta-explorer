# s1-zero-flow-dynamics: screening of four zero-flow combinations

Lane `s1-zero-flow-dynamics`, 2026-11-19. Screening arm. Labels: PROVED (short argument here), MEASURED (float64 unless a line says
30-digit or long double), STRUCTURAL (follows from the definition of the control). No claim about RH or Lambda. No bound moves.

## 0. Verdict

Four combinations tested. **Survivors: 0.** Each test is a statistic of the list of on-line ordinates, and:

1. T-NR (c > 2) has the same on-line ordinate list as zeta (PROVED, one line, section 2). Every statistic of that list takes zeta's value at
   every size. No test of this form can fail T-NR. This alone closes all four.
2. For DH and for the backward heat family the tests do separate from zeta, and in each case the size at which they separate is the size at
   which the window contains a handful of off-line pairs. For the heat family this is exact: the control's small-gap counts, its
   off-line fraction and its collision times are functions of zeta's own gap distribution shifted by 8|tau| in s^2 (flow composition,
   MEASURED to 4-5 digits, section 5).
3. Tests (2), (3), (4) measure one thing: the law of the smallest gaps of the list. beta(N, f) and t_c(N) equal closed-form functions of the
   closest pair and its neighbour: t_c/(g_min^2/8) - 1 = 9e-4 at N = 1e4 and 2e-5 at N = 1e8; beta g_min span - 1 = 3e-3 and 1e-4.
4. Three premises of the task text are false as stated on the data: c is not constant (already in `b-dyson-defect`, reproduced at L = 15.3);
   zeta does have close pairs with the closing sign (3 among the first 1.0e8 zeros, each confirmed with 30-digit zeros); the fit
   t_c = a + b/N has no stable a (it is 5.7e-3, -4.1e-4, 4.5e-3 for zeta, L(chi), L(chibar) on N <= 1000 and tends to 0 on larger ranges).

## 1. What was computed, where, and what was not

| object | size | where | check |
|---|---|---|---|
| zeta, first zeros | 100,116,297 zeros, height 14.13 to 4.27e7 | server, 8 CPU workers, 75 min | window means of S at the zeros lie in [0.499, 0.501] over every window of 4000 zeros after repair (section 3) |
| zeta, first zeros (second copy) | 10,000,040 zeros to 4.99e6 | Mac | count = theta/pi + 1 - 0.34 |
| L(s, chi), L(s, chibar), chi mod 5, chi(2) = i | 946,483 zeros each, height 0 to 5.0e5 | server, 8 CPU workers, 47 min (second copy to 2.0e5 on the Mac: 349,424 zeros) | count from the phase 946,483.4; max abs(Im Z) 3e-8; flint `hardy_z` agreement 2e-12 at t <= 3000 |
| DH = Z_chi + Z_chibar, on-line zeros | 847,701 (10.4% of the zeros are off the line) | server | the 1861 ordinates below 2000 agree with the battery table of `c12-control-battery-harness` to 1.4e-11 (checked on the Mac copy to height 2.0e5) |
| alt = Z_chi - Z_chibar, on-line zeros (second control without Euler product) | 698,848 (26.1% off the line) | server | same sampler |
| backward heat windows at T0 = 1e7, tau = 0, -1e-4, -5e-4, -2e-3, -1e-2 (unfolded time; heat time of H_t in z = 2 gamma: t = 0.774 tau; flow time on raw ordinates: 0.194 tau) | 4.0e6 zeros each (server); 1.0e6 each (Mac, second copy) | both | amplified Riemann-Siegel sum against the exact Dyson ODE run backward on 3000 zeros at T0 = 1e6: rms position difference 4.4e-8 (tau = -1e-4), 1.4e-7 (tau = -3e-4), unfolded units |

Controls with no on-line list (STRUCTURAL, not computed): zeta(s+a)zeta(s-a) with real 0 < a < 1/2 has every zero at Re s = 1/2 +- a, so the
on-line list is empty and none of the four statistics is defined. The sign twist Lambda(n) -> eps_n Lambda(n) has no functional equation and no
distinguished line (for the Liouville twist zeta(2s)/zeta(s) the zeros are at Re s = 1/4). The unimodular twist n^{-ib} gives zeta(s + ib): the
list is zeta's list translated by b, and all four statistics are translation invariant up to the change of density (relative b/T).

Compute notes. GPU 1 held 86 to 95 GB of 98 GB (other lanes) during the whole run and the machine ran at load average 75 to 127 on 48 cores,
so no GPU stage was run; all sums ran on CPU (server through `rhrun`, 8 cores, 12 GB; Mac through `scripts/memcap.sh 8`). The N-body flow was
run in full for N <= 20,000 (zeta, conductor 5) and N <= 5000 (heat windows); above that the flow is run in a window of 2001 ordinates around
the candidate pairs (agreement with the full flow at N = 1000 to 20,000: t_c and beta to 4e-5 relative or better).

## 2. The controls on on-line lists (PROVED / STRUCTURAL)

**T-NR.** F(s) = xi(s) (2 cosh((s - 1/2) log q) + c), c > 2. On Re s = 1/2 the second factor is 2 cos(t log q) + c >= c - 2 > 0, so the zeros
of F on the line are exactly the zeros of xi on the line. The off-line zeros are 1/2 +- arccosh(c/2)/log q + i (2k+1) pi/log q, the lowest at
height pi/log q (4.53 for q = 2). Consequence: every function of the on-line ordinate list (Q, R_eff, beta(N), t_c(N), gap laws) is identical for
T-NR and zeta at every N. If the off-line zeros are added to the flow as complex particles the statistic changes, and it changes by using their
positions.

**Pair structure of the flow** (dx_k/ds = -2 sum 1/(x_k - x_j), s = -t). For an adjacent pair with gap g and
B = sum_{j != pair} 1/((a - x_j)(b - x_j)): (g^2)' = -8 + 4 B g^2 = -8 (1 - R), R = g^2 B/2. For the pair next to the closest pair, the term of B
from the far member of the closest pair is 1/(g_min (x_2 - x_0)), and it diverges as g_min -> 0 while the rest stays bounded. So
beta g_min (x_2 - x_0) -> 1 at the front for every real point set (PROVED; this is the "three-factor invariant"), and
beta(N, f) = (1 + o(1)) / (f g_min span). Likewise t_c = g_min^2/8 (1 + O(R)).

## 3. Method and validation

- Zeta: Riemann-Siegel main sum with C0..C2 and 60-digit phases, sampled at 4x Nyquist, windowed-sinc interpolation (`rsz.py`, taken from
  `b-dyson-defect`), 152 blocks. Against `mpmath.zetazero`: 8e-9 at n = 650, 1e-10 at n = 5000 and above.
- A defect of that finder was found and fixed here: pairs with normalised gap below about 0.003 can be missed (no sign change on the fine
  grid, and the three-point parabola does not cross). The first 1e8 run was short by 8 zeros (S implied -8.5). Fix: (i) `zl.near_miss_pairs`
  settles every near-tangent extremum on the exact interpolant; unit test with imposed gaps of 2.5e-2 down to 2.5e-5 mean spacings: all found;
  (ii) `repair.py` locates each missed pair from the step of -2 in the window mean of S at the zeros and recomputes that interval; 4 pairs were
  restored (raw gaps 5.2e-4, 8.8e-4, 1.6e-3, 1.8e-3), after which the window means lie in [0.499, 0.501]; (iii) every zero with a neighbour
  closer than 0.08 mean spacings (100,406 zeros) is re-located by bisection on direct evaluations of the sum; gaps below 0.01 moved by up to
  1.4%. The repair was tested by deleting the three closest pairs of the 1e7 list: all three were restored.
- Conductor 5: complex L(1/2 + it) from residue-class sums with n <= 1.25 t plus a 40-term Euler-Maclaurin tail; Z = Re(e^{i vartheta} conj(sqrt W) L).
  The DH combination is decided from (1 - i kappa)/2 sqrt(W) = 0.519784 (real), and the known zero 0.8085171825 + 85.6993484854 i has abs(f) = 6e-11.
- Flow code: beta(N, 0.5) for the first N = 50, 100, 200 zeta ordinates = 1.105, 1.713, 2.685 (source: 1.10, 1.71, 2.69); pair value of t_c at
  N = 1e4 = 1.7765e-4 (source: 1.776e-4). beta at a snapshot depends on the step factor through the overshoot of the crossing (source rule,
  factor 0.02): the long-double run with factor 0.01 gives 1% larger beta(0.5) and 5% smaller beta(0.05).
- Higher-precision re-checks (CPU): closest pair of each list re-located at 30 digits with a sign-change certificate (mpmath `siegelz`; flint
  `hardy_z` at 128 bits); window flow repeated in long double (80-bit on the server). Zeta, N = 1e8: gap 5.20282174e-4 at 18,882,503.9013
  (float64 list: 5.202591e-4), t_c = 3.38367e-8 (float64: 3.38343e-8). DH, N = 8.5e5: gap 1.14270e-3 at 384,374.8768 (float64 list: 1.142719e-3), t_c = 1.63222e-7 (float64: 1.63226e-7).
  L(chi): gap 5.2208211e-3 at 434,322.0639, t_c = 3.407294e-6 (3.407291e-6). alt: gap 2.1535893e-3 at 229,950.2605.
  The heat lists have no independent high-precision evaluator; they rest on the ODE validation above.

## 4. Results table

Sizes: zeta 1.0e8 zeros; L(chi), L(chibar) 9.5e5; DH 8.5e5 on-line; alt 7.0e5 on-line; heat windows 4.0e6 at height 1e7. All lists
were generated on the server. The statistics for zeta and the heat windows were computed on the server; those for conductor 5 on the Mac
(the server run of the same script on the chi list gave bit-identical output).
"T-NR" is zeta's column by section 2. EA (real a) and the sign twist have no on-line list; the unimodular twist equals zeta up to translation.

| combination | statistic | zeta | L(chi) / L(chibar) | DH (10.4% off-line) | alt (26.1% off-line) | heat tau = -1e-4 / -5e-4 / -2e-3 / -1e-2 (off-line 4.6e-5 / 4.9e-4 / 3.9e-3 / 3.9e-2), reference tau = 0 | T-NR | classification |
|---|---|---|---|---|---|---|---|---|
| (1) loop defect x prime sum | Q + 1 in the top window, and the first-order prime-sum formula (*) of `b-dyson-defect` | 0.0357 +- 0.0002 at L = 15.34; formula 0.0391 (ratio 0.913); ratio 0.91 to 1.15 over 9 windows, L = 7.0 to 15.3 | 0.0786 +- 0.0023 / 0.0795 +- 0.0023 at L = 12.52; formula 0.0820 | -0.015 +- 0.006 at L = 12.55 (formula for L(chi): 0.0816) | -0.216 +- 0.007 | 0.0293 +- 0.0032 / 0.0010 +- 0.0031 / -0.082 +- 0.003 / -0.400 +- 0.005; tau = 0: 0.0413 +- 0.0013 | = zeta | CLOSED: T-NR identical; DH deviation = off-line zero sum; heat deviation continuous in tau |
| (1) same, first-moment form | Landau mean M_n = (2 pi sqrt n / T) sum_{gamma <= T} n^{i gamma} against -Lambda_f(n) | n = 2: -0.6931 (exact -0.6931), all n <= 13 to 4 digits at T = 4.27e7 | n = 2: -0.0002 - 0.6932 i (exact -0.6931 i) at T = 1e5 | n = 2: +0.578 against -0.197; n = 6: -0.048 against -1.936 (T = 1e5) | not computed | not computed | = zeta, while -Lambda_F(q) differs | CLOSED: the difference is the explicit-formula sum over the off-line zeros (checked, section 5) |
| (2) collective R_j x Lehmer pairs | close pairs (s < 0.2) with R_eff > 1, count and rate per 1e6 zeros; largest R_eff | 3 of 773,571 close pairs; 0.030 per 1e6; R_eff = 1.143, 1.719, 1.454 (30-digit zeros) | 0 of 6661 / 0 of 6605 | 1 of 7239; 1.2 per 1e6; R_eff = 2.03 (30-digit zeros) | 1 of 7881; 1.4 per 1e6; R_eff = 1.07 (30-digit zeros) | 0 / 1 / 0 / 9 events in 4.0e6 zeros (largest R_eff 16.6); tau = 0: 0 | = zeta | CLOSED: zeta has closing close pairs; counts are 0 to 9 events per list |
| (2) same lists, gap law | P(s < d)/GUE cubic at d = 0.02, 0.05, 0.1; local exponent between 0.02 and 0.1 | 0.89, 0.89, 0.89; exponent 3.00 | 0.48, 0.86, 0.80 (3.3) / 0.85, 0.73, 0.81 (3.0) | 8.0, 4.0, 1.9; exponent 2.10 | 9.3, 4.6, 2.4; exponent 2.15 | 2.4, 1.2, 0.97 (2.44) / 3.6, 1.8, 1.2 (2.33) / 8.5, 3.5, 1.9 (2.06) / 18.4, 7.1, 3.6 (1.99); tau = 0: 0.77, 0.91, 0.88 (3.09) | = zeta | CLOSED: the excess is the pairs about to merge; for heat it is predicted from zeta's own gap law (section 5) |
| (3) three-factor invariant x beta(N) | beta(N, 0.5) at N = 200 and at N_max; log-log slope; product beta g_min span at f = 0.05 | 2.685; 7188 at 1e8; slope 0.590; product 1.0001 | 4.62; 525; 0.590; 1.0014 / 5.68; 394; 0.566; 1.0013 | 7.03; 1588; 0.715; 1.0003 | 11.4; 1434; 0.705; 1.0003 | window lists (N counted from 1e7): 23510 / 19650 / 5665 / 43540 at N = 4.0e6; tau = 0: 6162 | = zeta | CLOSED: beta(N, f) = 1/(f g_min span) to 3e-3 or better; the slope is the small-gap exponent |
| (4) collision meter x ladder | t_c(N_max); retardation t_c/(g_min^2/8); fit a on N <= 1000; fit a on all N; log-log slope | 3.383e-8; 1.00002; a = 5.66e-3; 5.6e-4; slope -1.005 | 3.407e-6; 1.00005; -4.1e-4; -2.4e-4; -1.04 / 6.480e-6; 1.00009; 4.5e-3; 1.1e-3; -1.00 | 1.632e-7; 1.0000; 2.7e-3; 4.0e-4; -1.34 | 5.797e-7; 1.00001; -3.0e-3; -7.6e-4; -1.18 | t_c[tau](N) = t_c[0](N) - abs(t) while positive (4.2104e-3 against 4.2103e-3; 2.7660e-4 against 2.7660e-4; 2.3101e-4 against 2.3088e-4) | = zeta | CLOSED: a is not a stable quantity; the heat shift is the flow time itself |

## 5. Per combination

### (1) dyson-loop-identity-defect + bk-arithmetic-correction-amplitude

Finite consequence tested: Q + 1 on the on-line zeros equals the prime-sum value (*) built from Lambda_f(n)^2/n; survival would need the
equality to hold for zeta and L(chi) at every window and to fail for every control before its off-line zeros are resolved.

- Zeta and L(chi) follow (*) (MEASURED): ratio measured/formula 0.913 for zeta at L = 15.34 (6.8e7 zeros in that window), 0.96 and 0.97
  for chi and chibar at L = 12.5. The formula is first order: within 15% everywhere, 3 to 9% high for L >= 11. c = (Q+1) L^2/(12 Lambda_B) is
  0.445 at L = 15.34; `b-dyson-defect` already showed that c is not a constant.
- DH (MEASURED): Q + 1 = 0.180 (T < 1150, 6.4% off-line, 1000 zeros, no error bar), 0.014, -0.016 +- 0.025, 0.065 +- 0.009, -0.017 +- 0.018,
  -0.016 +- 0.009, -0.015 +- 0.006 in successive height windows, against 0.289 to 0.079 for L(chi). The first off-line zero is at height 85.7; 43 on-line
  zeros lie below it, too few for the statistic (its error at 1000 zeros is about 0.05).
- What the deviation is (MEASURED, exact identity behind it CLASSICAL): the first-moment version of the test is Landau's formula. On DH's
  on-line zeros M_n is far from -Lambda_f(n) (n = 2: +0.339 against -0.197 at T = 2000). Adding the 84 off-line pairs below 2000 from the
  battery table, with weights n^{beta-1/2} + n^{1/2-beta}, gives -0.2047 (n = 2), +0.3052 against +0.3121 (n = 3), +1.4455 against +1.4422
  (n = 4), -1.9338 against -1.9364 (n = 6), -0.5547 against -0.5528 (n = 7). So the "prime prediction minus zeros" on the on-line list is the
  explicit-formula sum over the off-line zeros: a weighted count of them. A set of off-line zeros of density zero changes M_n by o(1).
- T-NR: Q and M_n are zeta's; -Lambda_F(q) = -log q (1 + c sqrt q) differs from -log q, and the difference -c sqrt q log q is exactly the Landau
  sum of the off-line progression at heights (2k+1) pi/log q (each pair contributes -(q^b + q^-b) = -c; PROVED by direct summation). The test fails T-NR only by detecting that progression through the explicit formula (heights from 4.5).
- Heat: Q + 1 moves continuously with tau (0.041, 0.029, 0.001, -0.082, -0.400). At tau = -1e-4 the shift is 0.012 +- 0.0035 with 93 off-line
  pairs in the window of 4.0e6 zeros (Mac window of 1.0e6 zeros: 0.013 +- 0.004 with 22 pairs). A statistic continuous in tau through 0 has no threshold at tau = 0 (flow-blindness wall).

Classification: CLOSED. Size at which separation stops: none below windows with a positive count of off-line zeros; T-NR never by the
on-line list.

### (2) collective-interaction-rj + lehmer-pair-bounds

Finite consequence tested: among close pairs (normalised gap < 0.2) none has R_eff > 1 for zeta, and controls have such pairs at a rate that
does not come from their off-line zeros.

- A forward collision of real ordinates is impossible for any real list (R -> 0 as g -> 0), so the only countable event is the sign.
  R_eff > 1 with small g needs a third zero within about 0.37 g: a triple cluster.
- Zeta has them: 3 pairs among 1.0e8 zeros, at 15,991,878.31, 20,568,848.91, 22,365,147.89 (R_eff = 1.143, 1.719, 1.454 in long double with the
  cluster re-located at 30 digits). None among the first 1e7. L(chi), L(chibar): 0 in 9.5e5 each. DH: 1 in 8.5e5 (at 82,784.74, R_eff = 2.03).
  alt: 1 in 7.0e5 (at 235,804.83, R_eff = 1.07).
  Heat windows of 4.0e6 zeros: 0, 1, 0, 9 events for tau = -1e-4, -5e-4, -2e-3, -1e-2 and 0 at tau = 0 (float64); Mac windows of 1.0e6 zeros,
  long double: 0, 1, 0, 2.
- The rates follow the density of small gaps. P(s < d) is cubic in d for zeta (0.89 of the leading GUE term at d = 0.02 to 0.1) and close to
  quadratic for the lists with off-line zeros (exponent 2.1 for DH and alt, 2.0 to 2.4 for heat; 3.1 for the tau = 0 window).
- For heat this is zeta's own law (MEASURED on the Mac windows of 1.0e6 zeros): with P0 the empirical gap distribution of the tau = 0 window, the pair ODE predicts off-line
  fraction 2 P0(sqrt(8 abs(tau))) and P_tau(s < d) = P0(sqrt(d^2 + 8 abs(tau))) - P0(sqrt(8 abs(tau))). Measured against predicted: off-line
  fraction 4e-5 / 4e-5, 5.2e-4 / 5.2e-4, 3.92e-3 / 3.98e-3, 3.95e-2 / 4.23e-2; P(s < 0.02) 2.50e-5 / 2.50e-5, 2.70e-5 / 2.60e-5,
  7.52e-5 / 7.59e-5, 1.50e-4 / 1.57e-4. For a cubic P0 the excess of gaps below d = sqrt(8 abs(tau)) over zeta's own count is (2^{3/2} - 2) = 0.83 times the number of off-line pairs,
  so the excess is visible at the size at which off-line pairs are present, not before.

Classification: CLOSED. The premise fails for zeta at 1e8; the control excess appears with the first few off-line pairs.

### (3) beta-gmin-span-three-factor-invariant + beta-n-uniformity-fails-real-ordinates

Finite consequence tested: the growth law of beta(N, f) differs between zeta/L(chi) and the controls at N where no off-line zero is involved.

- The source values are reproduced (1.105, 1.713, 2.685) and extended: beta(N, 0.5) = 11.1, 52.4, 157.6, 509.6, 2091, 7188 at
  N = 1e3, 1e4, 1e5, 1e6, 1e7, 1e8 for zeta; the product beta g_min span at f = 0.05 is 1.0030, 1.0028, 1.0007, 1.0003, 1.0001 at N = 1e4 to 1e8.
- beta(N, f) is the closest pair: beta(N, 0.5) / (static sup of B at s = 0) = 2.007 at N = 1e8, i.e. beta = 1/(f g_min span) (section 2).
  The growth 1.10, 1.71, 2.69 of the source is the fall of g_min(N) times the growth of the density squared.
- Slopes of log beta against log N: zeta 0.59, chi 0.59, chibar 0.57, DH 0.72, alt 0.71. The difference between the Euler-product lists and
  DH/alt is the small-gap exponent of (2) (s_min of order N^{-1/3} against N^{-1/2}): s_min = 0.00124 at N = 1e8 for zeta, 0.0106 and 0.0145 at
  9.5e5 for chi and chibar, 0.00230 at 8.5e5 for DH, 0.00415 at 7.0e5 for alt. Below N = 500 (heights below 640) the DH and chi values are 1.88, 3.06, 7.03, 13.3 against
  1.75, 3.05, 4.62, 6.96: not separated beyond the scatter between chi and chibar (2.63 at N = 50).

Classification: CLOSED. Same content as the gap law of (2); no separation at sizes without off-line zeros; T-NR identical.

### (4) exact-flow-collision-meter + dyson-ladder-collision-scaling + small-gap-exponent

Finite consequence tested: the constant a of t_c(N) = a + b/N separates zeta from the controls at N where no off-line zero is in the window.

- t_c(N) from the flow agrees with the pair value g_min^2/8 to a factor 1.07 (N = 50), 1.0009 (1e4), 1.00002 (1e8). Zeta: 3.30e-3, 1.778e-4,
  2.702e-5, 4.067e-6, 6.748e-7, 3.383e-8 at N = 1e3 to 1e8.
- The fit: on N <= 1000, a = 5.66e-3, b = 4.89 for zeta (source: 0.011, 5.49 from smaller N); a = -4.1e-4 for chi, 4.5e-3 for chibar,
  2.7e-3 for DH, -3.0e-3 for alt. On all N: 5.6e-4, -2.4e-4, 1.1e-3, 4.0e-4, -7.6e-4. On N >= 1e4, zeta: 8.9e-6. The spread between zeta,
  chi and chibar covers the control values; a tends to 0 with the range because t_c(N) -> 0 for every list with arbitrarily small gaps.
- Log-log slopes: zeta -1.00, chi -1.04, chibar -1.00, DH -1.34, alt -1.18: the small-gap exponent again.
- Heat (MEASURED): t_c[tau](N) = t_c[0](N) - abs(t), t = tau (2 pi/L)^2, to 4 to 5 digits while the right side is positive (tau = -1e-4:
  4.2104e-3 against 4.2103e-3 at N = 50, 2.7660e-4 against 2.7660e-4 at N = 200 to 1000). When t_c[0](N) falls below abs(t) that pair is off
  the line and t_c[tau](N) jumps to the next surviving pair (7.5e-5 at N = 2000). So before its first off-line pair the heat control differs
  from zeta by exactly its own flow time, a number that cannot be read from the control's list without zeta's list beside it; a lower
  envelope t_c(N) >= phi(N) is violated by the control only where t_c[0](N) - abs(t) < phi(N), i.e. within a bounded factor of the size
  at which the first pair leaves the line.

Classification: CLOSED.

## 6. Why none is a survivor

A survivor needs zeta to pass at every size, every control to fail early or for a zero-independent reason, and all primes together.
- T-NR passes every on-line-list statistic with zeta's values (PROVED). All four tests are of that type.
- DH and alt are separated by the gap law and by Q, with 6 to 33% of the zeros off the line in every window that has enough zeros for the
  statistic; the prime-side form of the separation equals the off-line zero sum to 3 digits.
- Heat is separated by amounts that are continuous in tau and equal to the flow composition applied to zeta's data.
- Only (1) uses the primes; (2), (3), (4) use no arithmetic input.

## 7. Three weakest steps

1. The heat lists come from the amplified Riemann-Siegel sum (asymptotic dictionary), validated against the exact ODE for abs(tau) <= 3e-4
   on 3000 zeros and by the gap-law prediction for larger abs(tau); they are not zeros of H_t computed from its integral.
2. For N above 3e4 the flow is local (window of 2001 ordinates, three smallest gaps as candidates). A pair whose gap is not among the three
   smallest but whose collision comes first through a retardation factor above the ratio of gaps would be missed; the measured retardation
   is below 1.004 for N >= 2000.
3. Completeness of the DH, alt and heat lists cannot be checked by counting (off-line zeros exist). The near-tangent scan found 33
   candidates for DH (4 were pairs and were added) and 20 for alt (none was a pair); the heat lists rely on the same scan.

## 8. Files

Code: `zl.py` (sampler, root finder with `near_miss_pairs` and `refine_close`, pair fields, backward flow), `rsz.py` (copy of the
`b-dyson-defect` finder), `gen_zeta.py`, `gen_dir.py`, `repair.py`, `tests.py`, `recheck.py`, `closing_check.py`, `landau.py`,
`landau_dh_offline.py`, `heat_check.py`, `heat_compare.py`, `heat_gap_law.py`, `predict2.py`, `analyze.py`, `summ.py`, `test_nearmiss.py`,
`run_server.sh`. Outputs: `out/` (server: `t_zeta_first.json`, `log_zeta_first.txt`, `recheck_zeta_first.txt`, `closing_zeta_first.txt`,
`landau_zeta.txt`, `t_heat_*.json`, `heat_compare.txt`, `t_chi.json`, `t_dh.json`, `server_main.log`, `server_gen.log`) and `out_local/`
(Mac: `t_dir5e5_*.json`, `closing_dir5e5_*.txt`, `recheck_dir5e5_*.txt` on the server lists to height 5e5; `t_dir2e5_*`, `t_heatL_*`,
`t_zeta_1e7.json`, `heat_gap_law.txt`, `landau_dh_offline.txt` on the Mac lists). Lists are under `data/` (Mac) and `~/rh-push/s1-zero-flow-dynamics/data/` (server; the 1e8 list is `zeta_fixed.npy`, 801 MB; `dir_*.npy`; `heat_*.npy`).
