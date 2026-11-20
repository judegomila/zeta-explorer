# s3-dyson-burgers-zero-flow: screening of four Dyson / Burgers zero-flow combinations

Lane `s3-dyson-burgers-zero-flow`, 2026-11-19/20. Screening arm. Labels: PROVED (short argument here), CLASSICAL, MEASURED (float64 unless a
line says long double or 30 digits), STRUCTURAL (follows from the definition of the control). No claim about RH or Lambda. No bound moves.

## 0. Verdict

Four combinations tested. **Survivors: 0.**

| # | combination | what the finite test turned out to measure | classification |
|---|---|---|---|
| 1 | Theta-trap of the minimal pair on windows of N zeros | the local gap configuration around the closest pair of the window. Theta <= 1/4 fails for zeta itself on windows of up to N = 1341 zeros (among the first 1.0e8 zeros; re-checked with 30-digit zeros), and holds for every list, control or not, once N exceeds a list-dependent N* between 214 and 1341. No control fails where zeta passes | CLOSED: premise false for zeta at small N; at large N every control passes, most of them with smaller Theta than zeta |
| 2 | fold-reading amplitude C_ren in the band [2.2215, 2.2510] | the band is a property of the model density abs(x)^(-1/2) (reproduced). On a zero list m' at the reading strip is one or two atoms: C_ren is a function of g_min / y_N. Zeta is inside the band on 0.3 % of a fine ladder of N (6 of 2001 values to 1e8); it ranges over 0.003 to 26 | CLOSED: premise false for zeta; the value is the closest-pair statistic of `s1-zero-flow-dynamics` |
| 3 | forced flow response spectrum, flux identity kappa = 2 | kappa = 2 is an algebraic identity for every finite point configuration, real or complex (PROVED). The source's reduction factor 185 / 1114 replays (199 / 1154) and is the interval-integrator width read at different step numbers after the true collision time. The collective response of the forced flow is the Landau sum over the zeros (PROVED, one line), so the peak test is the explicit formula | CLOSED: explicit formula; T-NR differs at every N because its off-line zeros start at height 2.86; DH does not differ below its first off-line zero |
| 4 | sup-norm discrepancy of the Stieltjes transform at the reading strip | at y_N (far below the spacing) sup y abs(m_N - m_inf) is abs(i + y_N/(g_min - i y_N)), between 1 and 2 for every list of simple real points. For full zero sets the region Im z >= y_N contains the off-line zeros as poles | CLOSED: the bounded-ratio test passes for every list; the full-set failure is the location of a pole of m, i.e. of an off-line zero |

The pattern of the brief holds: where a control separates from zeta, the statistic is either the count / position of its off-line zeros
(4, and the on-line count deficit), the explicit formula (3), or the small-gap law of the on-line list (1, 2), which `s1-zero-flow-dynamics`
already identified with the pairs about to leave the line.

## 1. What was run, where, sizes

| object | size | where |
|---|---|---|
| zeta, first zeros (list of `s1-zero-flow-dynamics`, read only) | 100,116,297 zeros, heights 14.13 to 4.27e7 | server |
| zeta, window at 1e9 (list of `s2-heat-root-drift-forces`, read only) | 1,020,007 zeros | server |
| zeta, window at 1e12 (generated here, stored as offsets from 1e12) | 1,000,004 zeros in [1e12, 1e12 + 243,600); count against theta: +0.08; 7 hidden pairs settled by the sampler; 13 blocks, each within 1.13 of the expected count | server, GPU 1, 12 min |
| L(s, chi), L(s, chibar) mod 5; DH and alt on-line lists (lists of `s1`) | 946,483 each; 847,701; 698,848; heights to 5.0e5 | server |
| heat windows at 1e7, tau = 0, -1e-4, -5e-4, -2e-3, -1e-2 (on-line lists of `s1`) | 3.86e6 to 4.02e6 zeros each | server |
| full zero sets below height 2000 (tables of `c12-control-battery-harness`: on-line and off-line zeros at 30 digits): DH (1861 + 84 pairs), heat -0.1 (1435 + 41 pairs), heat -0.5 (929 + 294 pairs), T-NR q = 3, c = 2.2 (1517 + 350 pairs), E_a with a = 1/4 (1517 pairs), zeta (1517) | N up to 3034 particles | Mac (`scripts/memcap.sh 8`), second copy on the server |
| combination 1, static | Theta of every adjacent pair (400 neighbours on each side, GPU), window statistics for N = 2 .. 1e6, exact window definition for N >= 100 | server GPU 1: all lists above |
| combination 1, flows | full pairwise RK4 at N = 1e4 and N = 1e5 (GPU, 1e8 and 1e10 pair terms per force); N = 1e6 with a moving block of 20,000 zeros in the frozen, linearised field of the other 980,000 (GPU); long-double (80-bit) re-run of every flow on 2001 ordinates (CPU); full complex-particle flows of the tables (Mac) | server, Mac |
| combination 1, T-NR far field | first 1.0e8 zeta zeros with the local-factor zeros of T-NR added to E in closed form (cotangent series, all k) | server |
| combination 2 | ladder N = 1e3 .. 1.0e8 (first N zeros), 26 rungs and the full list, three readings; fine ladder of 400 values of N per decade (2001 values to 1e8); all control lists; windows at 1e9 and 1e12; tables | server, Mac |
| combination 3 | Landau spectrum at k0 = log n for all n <= 1e4 on 1.0e8 zeros (1.0e12 complex exponentials, GPU); same for chi, chibar, DH, alt; forced flow at N = 500 on 110 values of k0; interval-RK4 replay at N = 500; kappa on 7 configurations | server, Mac |
| combination 4 | atom reading at y_N on the ladder to 1.0e8; mesoscopic strips y = c x spacing, c = 1/4 .. 64, by FFT on the unfolded discrepancy (1.6e9 grid points for the 1e8 list); tables with poles | server, Mac |

Not reached (stated, not estimated): **N = 1e9**. The first 1e8 zeros are on disk; a unit of this lane started generating the next 9.0e8
(heights 4.27e7 to 3.72e8, six workers on GPU 1) and was stopped by this lane after 50 minutes (section 6). The forced flow at N = 5000 was started and
stopped by this lane before completion to free GPU memory (GPU 1 was at 92 of 98 GB with other lanes' jobs). DH off-line zeros are tabulated
only below height 2000, so "DH full set" means heights below 2000.

Compute notes. Server through `rhrun` only; at most 8 cores and 12 GB per unit; cupy pool 4 to 16 GB per unit; load average on the server
was 150 to 190 on 48 cores during the runs.

## 2. Definitions used and validation

Sources read as text: `src/data/sg1c-theta-trap-theorems.js`, `src/math/imp-857-phase-locked-dyson.mjs`,
`src/math/interval-dyson-integrator.mjs`, `src/data/imp-857-*.js`, `src/data/imp-33794-cren-window-measurement.js`,
`src/data/imp-33989-*.js`, `src/data/lambda-intercept-burgers-uniformity.js`, `src/data/imp-3707-*.js`.

- Flow: dx_k/ds = -2 sum_{j != k} 1/(x_k - x_j) (attractive; s > 0 is backward heat time). Pair (a, b), g = b - a,
  T_j = 1/((a - x_j)(b - x_j)), E = sum_j T_j, Theta = g^2 E / 2, and d(g^2)/ds = -8 (1 - Theta) (source Lemma E). Corollary A1:
  t_c <= g_min^2 / 6 when Theta(0) <= 1/4.
- m_N(z) = sum_k 1/(gamma_k - z), reading strip y_N = sqrt(2 pi / N), C_ren = y_N^{3/2} abs(m'(z0*)).
- Forced flow of the source: dg_k/dt = -2 sum 1/(g_k - g_j) + eps cos(k0 g_k - omega t), omega = k0 pi rho_mean. The "collision statistic"
  whose reduction is 185 / 1114 in the source is the maximal interval width of an interval RK4 at each run's last recorded step.

Validation (file `tests.py`, `c4.py validate`; all pass on the Mac and on the server):

| check | got | known value |
|---|---|---|
| uniform lattice, K neighbours per side, central pair | 0.5, 0.857142857143, 0.980392156863 | Theta_K = K/(K+1) (source Lemma R1-T2) |
| four-tie {-1, 0, 1, 1+b}, b = 2.5; symmetric triplet | 0.307142857143; 0.25 | 1/4 + 1/(2b(b+1)); 1/4 |
| window statistics (sliding minimum) against brute force, N = 2, 7, 20, 64 | identical counts and maxima | brute force |
| exact window definition (E restricted to the window), N = 100, 180 | 64, 26 failing windows; max 0.315103645442 | brute force: same |
| two-body flow; symmetric triplet | t_c = 0.0112499999; 0.0149999999 | g^2/8; g^2/6 (A1 is sharp there) |
| frozen linearised far field against the full flow, 1200 particles | t_c ratio 0.999999998 | 1 |
| T-NR factor zeros, closed form against 4.0e5 terms | 1.173751113 | 1.173750502 |
| source rows at N = 1e4 | g_min^2/6 = 2.3686e-4; Theta(0) = 0.001732; t_c = 1.77801e-4 (long double 1.77801e-4, relative difference 6.7e-7) | 2.369e-4; 0.0017; `s1`: 1.7765e-4 x 1.0009 |
| model cusp, Simpson with 8000 panels | 2.250959 at N = 1e3, 2.221471 at N = 1e7 | source: 2.250959, 2.221471 |
| kappa by the exact velocity; by a finite difference of an RK4 step | abs(kappa - 2) <= 1.2e-13; <= 2.4e-5 | 2 |
| Landau spectrum, zeta, 1.0e8 zeros | M_2 = -0.49013, M_3 = -0.63428, M_9973 = -0.09219 | -log 2 / sqrt 2 = -0.49013, -0.63428, -0.09220 |
| FFT discrepancy against the lattice closed form 2 pi c e^{-2 pi c}/(1 - e^{-2 pi c}) | 0.4147, 0.01183 (c = 1/4, 1) | 0.4122, 0.01176 (grid step 1/16 of a spacing: 0.6 % high) |
| interval RK4 replay at N = 500 | final widths 1.355e-6, 6.80e-9, 1.174e-9 | source: 1.33e-6 (implied), 7.17e-9, 1.19e-9 |

Accuracy of the FFT discrepancy: 1 % at c >= 1, up to 7 % pointwise at c = 1/4 (interpolation between grid points). It is used only for
order-of-magnitude statements.

## 3. Results table

Sizes: zeta 1.0e8 first zeros, 1.02e6 at 1e9, 1.0e6 at 1e12; L(chi), L(chibar) 9.5e5; DH on-line 8.5e5; alt on-line 7.0e5; heat on-line
windows 3.9e6 to 4.0e6 at height 1e7; full sets below height 2000. N* = the largest N such that some window of N consecutive zeros has a
minimal pair with Theta > 1/4 (E restricted to the window).

| combination | statistic | zeta | L(chi) / L(chibar) | DH | heat tau < 0 | E_a (a = 1/4) | T-NR (q = 3, c = 2.2) | classification |
|---|---|---|---|---|---|---|---|---|
| (1) Theta-trap | N* at level 1/4; failing windows at N = 100 / 1000 / 2000 (exact definition); max Theta over windows of 1e4 and 1e6 | first 1.0e8: N* = 1341 (Theta = 0.25369590, 30-digit zeros); 238,380 / 342 / 0 of 1.0e8 windows; 0.065, 9.0e-4. Window at 1e9: N* = 325. Window at 1e12: N* = 658 | N* = 355 / 501; 1830 / 0 / 0 and 1794 / 0 / 0 of 9.5e5; 0.012 / 0.014 at 1e4 | on-line list: N* = 308; 3742 / 0 / 0 of 8.5e5; 0.0041 at 1e4. Full set below 2000: 43 failing windows of 1762 at N = 100, 0 at N = 200 (zeta below 2000: 0 at N = 50); no pair is farther than 37.8 spacings from an off-line zero | on-line windows at 1e7, tau = 0 / -1e-4 / -5e-4 / -2e-3 / -1e-2: N* = 827 / 827 / 827 / 1331 / 404; max Theta at N = 1e6: 1.4e-4 / 9.9e-5 / 3.1e-5 / 1.8e-5 / 1.2e-6. Full set below 2000 (tau = -0.1): windows below the first off-line zero fail at the rate of zeta | no real zeros: no real pair and no collision; formal Theta of each conjugate pair in [-1.32, -0.014] | full set (factor zeros as far field, closed form) on the 1.0e8 list: N* = 1341 (same window, Theta = 0.25495); 263,567 / 342 / 0. Below 2000: 129 failing windows at N = 100, 0 at N = 200; every pair is within 2.6 spacings of a factor zero | CLOSED |
| (1) flow | t_c against g_min^2/6 and against the pair law g^2/(8(1 - Theta)) | N = 1e4: 1.77801e-4 <= 2.3686e-4, t_c/(g^2/8) = 1.00087. N = 1e5 (full pairwise): 2.702346e-5 <= 3.6022e-5, ratio 1.000251. N = 1e6: first zeros 4.066741e-6 (ratio 1.0000518), at 1e9 1.814818e-6 (1.0000806), at 1e12 6.009137e-7 (1.0000513). Theta non-increasing along every run; long double agrees to 7e-7 or better | L(chi), N = 9.0e5: 3.407294e-6, ratio 1.0000507 | on-line, N = 8.0e5: 1.632260e-7, ratio 1.0000015. Full set below 2000: t_c = 1.373356e-5 (on-line only: 1.373356e-5), ratio 1.000085 | on-line windows, N = 1e6, tau = 0 / -5e-4 / -1e-2: 2.174152e-6 / 3.313872e-7 / 2.490183e-8, ratios 1.0000371 / 1.0000079 / 1.0000007. Full sets below 2000: tau = -0.1: 3.599510e-5 (on-line only 3.599508e-5); tau = -0.5: 1.003366e-3 (1.003205e-3) | t_c infinite | full set below 2000: 1.195501e-3 against 1.192201e-3 for zeta | CLOSED: A1 holds for every list |
| (2) C_ren | reading (a): z0* = midpoint of the minimal pair + i y_N. Range over the ladder; rungs inside [2.2215, 2.2510] | 0.0198 to 20.7 over 26 rungs to 1.0e8; inside at N = 1e4 (2.2302) and 1e6 (2.2349), outside at 1e8 (2.2537) and at 1.00116e8 (2.2883). Fine ladder to 1e8: 6 of 2001 values of N inside; median abs(d log C / d log N) = 2.2. Windows at 1e9 and 1e12: 5.4 to 19 and 6.3 to 24.6, none inside | 0.11 to 10.9 / 0.39 to 8.5; none inside on the rungs; fine ladder for L(chi): 6 of 1191 inside | on-line: 4.9 at 1e3 rising to 33.6 at 8.5e5 (tends to 2 y_N^(-1/2) because g_min < y_N). Full set below 2000: 0.22 to 8.2 | 5 to 56 (= 2 y_N^(-1/2) at 4e6 for tau <= -1e-4) | reading (a) undefined; sup reading infinite (poles at height 1/4 >= y_N for N >= 101) | reading (a) with factor zeros: 0.24 to 0.74 below 2000; on-line list = zeta's | CLOSED |
| (2) other readings | (b) sup over x of y_N^{3/2} abs(m'); (c) smooth density | (b) = y_N^(-1/2) to 4 digits: 3.55 at 1e3, 63.2 at 1e8; (c) 3.5e-5 falling to 5e-13 | same law | same law; full set: infinite when an off-line zero has b >= y_N | same | infinite | infinite | CLOSED: no reading stays in a band |
| (3) kappa | abs((M_s - M_zz)/(M M_z) - 2), M = sum 1/(z - x_k) | 3e-15 (1517 zeros) | - | 1.8e-14 (full set, 2029 particles) | 6e-15 (tau = -0.5 full set) | - | 1.7e-15 (full set) | CLOSED: identity for every configuration (random real, random complex and the lattice give the same) |
| (3) response spectrum | M_n = (2 pi / T) sum_{gamma <= T} e^{i gamma log n}, n <= 1e4, against -Lambda_F(n)/sqrt n of the object itself | 1.0e8 zeros: rms deviation at prime powers 8.7e-6 (rms of the prediction 0.179), regression slope 0.99998; rms at the other n 1.3e-5. Windows of 1.0e6 zeros at 1e9 and 1e12: 9.4e-4 and 1.3e-3, slopes 0.99999 and 0.99986 | 9.5e5 zeros: 6e-4, slope 1.000; rms elsewhere 1.1e-3 | on-line, 8.5e5 zeros: slope 0.76, M_2 = +0.4585 against -0.1392; below the first off-line zero (43 zeros): rms deviation 0.077 against 0.060 for L(chi) at the same height (no separation); with the 84 off-line pairs below 2000 added: 0.0042 | not run (no coefficient table for the heat family; `s1` showed the on-line statistics move continuously in tau) | no on-line list | on-line list = zeta's: rms deviation from T-NR's own coefficients 1.40 at 1.0e8 zeros and 1.47 at 23 zeros; the difference sits at n = 3^m and equals the Landau sum of the factor zeros | CLOSED |
| (3) collision statistic | shift of t_c under forcing, eps = 0.01, N = 500, 110 values of k0 in (0, log 1e4]; source's reduction factor | rms shift 4.7e-6 (bound eps H0^2/4 = 6.4e-3); correlation with the first-order pair formula 0.996; correlation of abs(shift) with abs(Landau response) -0.14. Width ratio replay: 199 and 1154 (source 185, 1114) | - | - | - | - | - | CLOSED: local to the minimal pair; the source's factor is an integrator artefact |
| (4) discrepancy at y_N | sup_x y_N abs(m_N - m_inf) and the ratio to log gamma_N | 1.07 to 1.39 on 26 rungs to 1.0e8 (= abs(i + y/(g_min - i y)) to 1 %); ratio 0.147 at 1e3 falling to 0.071 at 1e8; window at 1e12: 1.27 to 1.71, ratio 0.058 | 1.10 to 1.60 / 0.94 to 1.49; ratio 0.095 / 0.087 at 9.5e5 | on-line: 1.52 to 1.93; ratio 0.142. Full set below 2000 on the line Im z = y_N: 22.0; 80 poles of m in the region Im z >= y_N: sup infinite | on-line: 1.26 to 1.98. Full set tau = -0.1: 19.1 on the line, 32 poles in the region | 0.43 on the line (poles at 1/4 are far above y_N = 0.046); 1517 poles in the region: sup infinite | 1.04 on the line (zeta: 1.05); 350 poles in the region: sup infinite | CLOSED |
| (4) mesoscopic strips | sup_x y abs(m_N - m_inf) at y = c x spacing, c = 1/4, 1, 4, 16, 64; sup abs(R), R = N(t) - smooth | 1.0e8: 2.03, 1.67, 0.74, 0.042, 0.006; sup abs(R) = 2.09; ratio at c = 1: 0.0985, 0.0956, 0.0952 at 1e6, 1e7, 1e8. Windows of 1.0e6 zeros at 1e9: 1.86, 1.56, 0.88, 0.077, 0.004 (ratio 0.075); at 1e12: 1.85, 1.74, 1.13, 0.18, 0.010, sup abs(R) = 2.34 (ratio 0.063) | 1.77, 1.27, 0.52, 0.021, 0.007; sup abs(R) = 1.72 | on-line against the full counting function: sup abs(R) = 5.0e4 (the count of off-line zeros); against its own smoothed count: 2.19, 2.87, 5.85, 8.20, 13.2, sup abs(R) = 35.7. Full set below 2000 (pairs as double points): sup abs(R) = 1.38 | on-line, own smoothed count, tau = 0 / -1e-4 / -5e-4 / -2e-3 / -1e-2: sup abs(R) = 2.6 / 4.7 / 6.3 / 12.0 / 35.3 | full set: sup abs(R) = 2.27 | full set: sup abs(R) = 1.96 | CLOSED: on-line lists differ by the count of off-line zeros (Turing's count); full sets have bounded R |

## 4. Per combination

### 4.1 Combination 1: collision-ladder-data + cm-flow-theta-trap + theta-trap-theorems

Finite consequence tested: for every window of N consecutive zeros, the minimal pair has Theta <= 1/4 (then Corollary A1 gives
t_c <= g_min^2/6 and Theta stays below 1/4 along the flow). Survival would need: true for zeta and L(chi) on every window at every N reached,
and false for each control on windows farther than 100 mean spacings from its off-line zeros.

Premise check. At N = 1e4 (first zeros): g_min = 0.0376985, g_min^2/6 = 2.3686e-4, Theta(0) = 0.001732, full pairwise flow t_c = 1.77801e-4
(270 RK4 steps, GPU; long double on 2001 ordinates: 1.77801e-4). The source row replays.

What Theta is (PROVED). A single neighbour at distance d >= g contributes g^2/(2 d (d + g)) <= 1/4 with equality at d = g. The remaining
zeros contribute (pi^2/6) s^2 = 1.645 s^2 for a locally uniform list, s the gap in mean spacings; measured median of Theta / s^2 over
pairs with s < 0.05: 1.108 for zeta (1.0e8), 1.07 for L(chi), 0.97 for DH on-line, 1.08 to 1.12 for the heat windows, 1.15 at 1e12
(the neighbours of a close pair are farther away than average).
So Theta > 1/4 for the minimal pair of a window means: either the window has no small gap (small N), or the minimal pair sits in a triple
with two nearly equal gaps. Both are statements about three or four neighbouring zeros.

Zeta fails the criterion on small and medium windows (MEASURED, one case re-checked at 30 digits):
- fraction of windows whose minimal pair has Theta > 1/4 (E restricted to the window): 0.233 at N = 10, 0.053 at N = 30, 0.0021 at N = 100
  (first 2.0e6 zeros, every window); 238,380 of 1.0e8 at N = 100, 35,644 at N = 200, 2933 at N = 500, 342 at N = 1000, 0 at N = 2000.
- largest failing window among the first 1.0e8 zeros: N* = 1341, pair at 9,661,871.7568 and 9,661,871.8135 with the next zero at
  9,661,871.8714 (gaps 0.05664 and 0.05795; s = 0.128, 0.131). Theta = 0.2536959 in float64; with the six surrounding zeros re-located
  by bisection on mpmath `siegelz` at 30 digits (largest shift 5e-10) and the sum in mpmath: Theta = 0.253695896636.
- at level Theta_b = 0.443: N* = 127 (Theta = 0.448652261 at 30 digits, pair at 28,651,825.66).
- N* grows with the number of windows examined: 214 (first 1e6 zeros), 1341 (first 1e8); windows at 1e9 and 1e12 with 1.0e6 zeros: 325 and 658.
  For GUE local statistics an equally spaced triple with gap s has a positive density for every s, so for every fixed N failing windows are
  expected at sufficient height (HEURISTIC; the data to 1e8 are consistent with growth like a power 0.3 to 0.4 of the sample size).
- zeta also has close pairs with Theta > 1 (the closing sign reversed): 3 among 773,581 pairs with s < 0.2, the three found by `s1`.

Every list passes at large N, and the controls pass more easily:
- N* (level 1/4): L(chi) 355, L(chibar) 501, DH on-line 308, alt on-line 528, heat windows 827, 827, 827, 1331, 404 (tau = 0, -1e-4, -5e-4,
  -2e-3, -1e-2; 4.0e6 zeros each). The values follow the sample size, not the object: the heat window with tau = 0 (zeta itself, 4.0e6 zeros)
  gives 827, and tau = -2e-3 gives 1331 at the same triple (10,871,783.35), its gaps squeezed from s = 0.154 to 0.108 by the flow.
- max Theta over windows of 1e6 zeros: 9.0e-4 (zeta, first 1e8), 1.4e-4 (tau = 0 window), 1.2e-6 (tau = -1e-2). A list with smaller gaps has
  smaller Theta. Backward heat flow lowers Theta of the minimal pair (Theorem A of the source: Theta is non-increasing below 1/4), so the
  heat control moves away from the threshold, not towards it.
- flows: A1 (t_c <= g^2/6) holds in every run, Theta(s) <= Theta(0) in every run, no change of the minimal pair. N = 1e6 (20,000 moving,
  980,000 frozen and linearised): t_c / (g^2/8) = 1.0000518, 1.0000806, 1.0000513 at heights 6e5, 1e9, 1e12; long double on 2001 ordinates
  agrees to 5e-8 there, and to 2.3e-7 or better for the control lists. Full pairwise at N = 1e5: t_c = 2.702346e-5, ratio 1.000251
  (`s1`: 2.702e-5).

Controls with their full zero sets (heights below 2000, complex particles in E and in the flow):
- E_a: no real zeros. A conjugate pair gamma +- i a alone obeys d(b^2)/ds = 2: the pairs move apart and no collision occurs (PROVED). Its formal
  Theta = -2 a^2 sum_j 2/(D_j^2 + 4 a^2) is negative. The criterion Theta <= 1/4 is met trivially; the only way to fail E_a is to ask for a
  real pair, i.e. for a zero on the line.
- DH: 84 off-line pairs among 2029 zeros; no on-line pair is farther than 37.8 mean spacings from an off-line zero, so the fail criterion of
  the task (distance above 100 spacings) applies to no window. The off-line pairs change Theta of some pair by up to 5.7 and make it negative
  for 29 pairs; the failing-window counts are 43 of 1762 at N = 100 and 0 at N = 200 with or without them (in the tables E runs over all
  zeros below 2000, an upper bound for the window definition when all particles are real). Below the first off-line zero
  (height 85.7, 43 on-line zeros) the counts are 16 of 34 at N = 10 and 0 at N = 20; zeta: 654 of 1508 at N = 10, 207 of 1498 at N = 20.
- heat tau = -0.1: first off-line pair at height 415; 99 on-line pairs are farther than 100 spacings from every off-line zero (all below 415).
  Failing windows below 415: 87 of 202 at N = 10, 29 of 192 at N = 20, 5 of 182 at N = 30; zeta below 2000: 654 of 1508, 207 of 1498,
  50 of 1488. Same rates (43 %, 15 %, 3 %). No failure attributable to the control.
- T-NR: the factor zeros 1/2 +- 0.4038 + i (2k+1) 2.8596 form a progression of spacing 5.72; every on-line pair is within 2.6 spacings of
  one below height 2000, and within a bounded number of spacings at every height, so the criterion again applies to no window. With the
  factor zeros in E the counts below 2000 rise (129 failing windows at N = 100 against 0 for zeta) because they sit 0.2 to 0.4 spacings
  from the line there. On the 1.0e8 list (factor zeros summed in closed form): N* = 1341 at the same triple, 263,567 failing windows at
  N = 100 against 238,380, 342 against 342 at N = 1000, 0 at N = 2000. The shift of Theta is at most 3.0 g^2 against a background
  1.6 g^2 rho^2 (rho = log(T/2 pi)/2 pi), so it is a bounded relative change that decays like 1/log^2 T (PROVED from the cotangent sum).

Classification: CLOSED. Zeta does not pass "Theta <= 1/4 on every window" for N <= 1341; for N >= 2000 every list passes, and no control
fails in a window away from its off-line zeros. The statistic uses no prime.

### 4.2 Combination 2: complex-burgers-fold + cren-finite-band + privalov-sokhotski-constant

Finite consequence tested: C_ren(N) = y_N^{3/2} abs(m_N'(z0*)) stays in [2.2215, 2.2510] for N = 1e3 .. 1e9 on the zero list.

Premise check. The band of the source is computed for the model density abs(x)^(-1/2) on [-1, 1] at z = i y_N (source file, Simpson
quadrature). It replays: 2.250959 at N = 1e3 falling to 2.221471 at N = 1e7, 2.221444 at 1e9, limit pi/sqrt 2 = 2.221441. The source states
that it is a model-cusp measurement (`imp-33989`). The zero counting density log(t/2 pi)/2 pi has no abs(x)^(-1/2) cusp.

On a zero list (PROVED, elementary). y_N = sqrt(2 pi / N) is far below the mean spacing for N > 100 (y_N times the density is 5e-3 at
N = 1e6), so m_N'(x + i y_N) = sum 1/(gamma - z)^2 is the nearest atoms.
- Reading (a), z0* = midpoint of the minimal pair + i y_N (the fold point of the atomic m_N: 1 + t m' = 0 gives t = g^2/8): with h = g_min/2,
  C_ren = 2 y^{3/2} abs(h^2 - y^2)/(h^2 + y^2)^2 (1 + O(Theta)). It vanishes at g_min = 2 y_N, equals 8 y^{3/2}/g^2 for g >> y and
  2 y^(-1/2) for g << y.
- Reading (b), the sup over x: y_N^(-1/2) = (N / 2 pi)^{1/4}, attained above a zero. Measured: 3.55, 6.32, 11.2, 20.0, 35.5, 63.2 at
  N = 1e3 .. 1e8, equal to the formula to 4 digits.
- Reading (c), the smooth density: 3.5e-5 at N = 1e3 falling to 5e-13 at N = 1e8.

Measured, reading (a), zeta, first N zeros: 0.103, 0.290, 2.230, 1.318, 0.906, 3.646, 2.235, 0.565, 8.229, 1.859, 2.254 at
N = 1e3, 3e3, 1e4, 3e4, 1e5, 3e5, 1e6, 3e6, 1e7, 3e7, 1e8; over all 26 rungs the range is 0.0198 (N = 2e4) to 20.7 (N = 5e7).
Two rungs fall inside the band (N = 1e4 and 1e6) and N = 1e8 is 0.12 % above it. This is a coincidence of the rung values and not a band:
the full list of 100,116,297 zeros gives 2.288 (1.5 % above the value at N = 1e8, for 0.12 % more zeros), and on a fine ladder
(400 values of N per decade, N = 1e3 .. 1e8) 6 of 2001 values lie inside (0.3 %), with quantiles 0.038 (1 %), 2.46 (median), 22.7 (99 %).
With the 30-digit value of the closest gap at N = 1e8 from `s1` (5.20282174e-4 against 5.202591e-4 in the float64 list) the pair value at
N = 1e8 is 2.2563 instead of 2.2537: outside the band in both cases. L(chi) on the same fine ladder: 6 of 1191 values inside.
In the range reached g_min(N) happens to be near 2 y_N (g_min sqrt N = 3.8, 5.7, 5.2 at 1e4, 1e6, 1e8, against 2 sqrt(2 pi) = 5.01), which
keeps the values of order 1; with g_min of order N^(-1/3) and y_N of order N^(-1/2) the reading tends to 0 like 8 y^{3/2}/g_min^2.

Controls. L(chi), L(chibar): 0.11 to 10.9 and 0.39 to 8.5 on 16 rungs, none inside. DH on-line and the heat windows with tau < 0: g_min < y_N (ratio y/g up to 5.7 and
35), so the reading follows 2 y_N^(-1/2): 33.6 at 8.5e5 (DH), 55.6 at 4.0e6 (tau = -1e-2 and -1e-4); on the fine ladder 0 of 1172 (DH) and
0 of 1442 (tau = -5e-4) values are inside, and 3 of 1442 for the tau = 0 window. The separation from zeta is the
closest-pair law (exponent of the smallest gap), which `s1-zero-flow-dynamics` tied to the pairs about to leave the line. Full sets:
m' has a pole at every off-line zero, so the sup reading over Im z >= y_N is infinite as soon as b >= y_N for one off-line zero in the
list (DH: from N = 66; E_a with a = 1/4: N >= 101; T-NR: N >= 39). Controls with the same counting function: T-NR has zeta's on-line list
(identical values), and the unimodular twist is a translate. A list with zeta's counting function and different local statistics
(for example a lattice) gives a different value, because the reading is a closest-pair statistic and not a density statistic: the expected
check "the band is a Riemann-von Mangoldt statement" is not confirmed; the band belongs to the model density only.

Classification: CLOSED. Not reached: N = 1e9 (see section 6).

### 4.3 Combination 3: h2-flux-kappa-two + zv-dyson-trap-model + phased-forcing-degrades

Finite consequence tested: the response R(k0) of the forced flow has peaks exactly at k0 = m log p with heights proportional to
log p / p^{m/2}; a control fails if its peaks differ from its own coefficient prediction at N below its first off-line height.

Premise checks.
- kappa = 2 (PROVED). With M = sum 1/(z - x_k) and the flow above, symmetrising the double sum gives M_s = 2 M M_z + M_zz for every finite
  configuration. Measured abs(kappa - 2) <= 1.2e-13 on random real points, random complex points, the lattice, zeta, and the full sets of DH,
  heat -0.5 and T-NR; an independent finite difference of an RK4 step gives 2 to 2.4e-5 or better. The identity carries no information on
  the configuration.
- The reduction factor replays and is an artefact (MEASURED). The interval RK4 of the source (one-ulp inflation per operation, dt = 3e-4,
  first 500 zeros, k0 = pi) stops at step 45 without forcing (width 1.355e-6), at step 43 with eps = 0.01 (6.80e-9) and at step 42 with
  eps = 0.05 (1.174e-9): ratios 199 and 1154 against 185 and 1114 in the source. At the same step 42 the unforced run has width 1.172e-9:
  ratio 1.00. The collision time of this configuration is t_c = 0.012327 (g_min = 0.31043, RK4 with step control), i.e. step 41.1: all
  three runs have stepped across the collision with a fixed step before they stop, and the factor compares widths at different step
  numbers after that.

The collective response is the Landau sum (PROVED). Pair forces cancel in the centre of mass, so d/dt sum_k g_k = eps sum_k cos(k0 g_k - omega t);
at t = 0 this is eps Re sum_gamma e^{i k0 gamma}. Checked on one RK4 step at N = 500: -0.63475 against -0.63438. By Landau's formula
(CLASSICAL) (2 pi / T) sum_{gamma <= T} e^{i gamma log n} tends to -Lambda(n)/sqrt n. So "peaks at m log p with heights log p / p^{m/2}" is
the explicit formula read on the zeros.

Measured.
- zeta, 1.0e8 zeros, all n <= 1e4 (1.0e12 exponentials, GPU): rms deviation from -Lambda(n)/sqrt n over the 1280 prime powers 8.7e-6, largest
  deviation over all n 5.6e-5, slope 0.99998; rms at the 8719 other n 1.3e-5.
- L(chi), L(chibar): -chi(n) Lambda(n)/sqrt n to 6e-4 (9.5e5 zeros), slope 1.000.
- DH on-line list against the coefficients of -F'/F for DH (computed from a(n) = Re((1 - i kappa_DH) chi(n)) by the divisor recursion):
  slope 0.76, M_2 = +0.4585 against -0.1392 at 8.5e5 zeros. Height by height below 2000 (n = 2, 3, 4, 7, 9, 11, 13): rms deviation 0.077
  below the first off-line zero (43 zeros; L(chi) at the same height: 0.060; zeta with 23 zeros: 0.107), then 0.178, 0.246, 0.297 at
  T = 300, 1000, 2000 while L(chi) falls to 0.024, 0.0055, 0.0034. Adding the off-line pairs with weights n^b + n^(-b) restores 0.022,
  0.0096, 0.0042. The deviation appears with the first off-line pairs and equals their sum.
- T-NR: its on-line list is zeta's, so its measured spectrum is zeta's; its own coefficients differ at n = 3^m
  (-Lambda_F(3)/sqrt 3 = -3.051 against -0.634). Deviation 1.40 to 1.49 at every size from 23 zeros to 1.0e8. T-NR's off-line zeros start at
  height 2.86, below the first zeta zero, so there is no size below its off-line height; the difference is the Landau sum over the
  progression of factor zeros (PROVED in `s1-zero-flow-dynamics`, section 2).
- Mixed pair (zeta zeros with control weights): this is the same comparison; zeta's zeros against DH's coefficients give slope -0.018,
  against T-NR's coefficients 0.016.
- The collision statistic itself: the shift of t_c under forcing at N = 500, eps = 0.01, 110 values of k0 including log p for 15 prime
  powers: rms 4.7e-6, against the bound eps H0^2/4 = 6.4e-3 of the source; correlation 0.996 with the first-order pair formula
  (integral of 2 g eps [cos(k0 b - omega s) - cos(k0 a - omega s)] over the unperturbed approach), correlation -0.14 between abs(shift) and
  the absolute Landau response. The collision time responds to the phase of the forcing at the two zeros of the minimal pair and shows no
  prime peaks.

Classification: CLOSED: the all-primes statistic is the explicit formula (verified height in the form "the zeros below T reproduce
Lambda(n) for log n << T"), and the collision statistic is local. Not run: the forced flow at N = 5000 (stopped, section 1); the heat
family against its own coefficients.

### 4.4 Combination 4: koksma-hlawka-collision-limit + route-b-limsup-stieltjes + mesoscopic-density-floor-cotangent

Finite consequence tested: D_N N y_N / log gamma_N stays bounded, D_N = sup over Im z >= y_N of abs(m_N - m_inf)/N; a control fails if the
ratio is unbounded, or grows at another order, at N below its first off-line height.

Koksma form (CLASSICAL): m_N(z) - m_inf(z) = int R(t)/(t - z)^2 dt with R = N(t) - N_smooth(t), so y abs(m_N - m_inf) <= pi sup abs(R).
For real lists the difference is analytic in the upper half-plane and the sup over the region is the sup on the line Im z = y.

At the reading strip (PROVED, elementary). y_N is far below the spacing, so on the line Im z = y_N the difference is the nearest atom:
y abs(m_N - m_inf) = abs(i + y/(g - i y)) + O(y rho log) above the closest pair, between 1 (isolated zero) and 2 (pair closer than y).
Measured for zeta on 26 rungs to 1.0e8: 1.07 to 1.39, equal to the closest-pair formula to 1 %, ratio to log gamma_N falling from 0.147 to
0.071. For every other list the value is in [0.94, 1.99]. The ratio is bounded, and tends to 0, for every list of real points with gaps
bounded below by a power of N; it is a statement about simple zeros and carries no arithmetic.

Mesoscopic strips, y = c mean spacings (MEASURED, FFT on the unfolded discrepancy): zeta 1.0e8 zeros: sup y abs(m_N - m_inf) = 2.03, 1.67, 0.74,
0.042, 0.006 at c = 1/4, 1, 4, 16, 64, with sup abs(R) = 2.09 (cell averages over 1/16 of a spacing); the ratio to log gamma at c = 1 is
0.0985, 0.0956, 0.0952 at N = 1e6, 1e7, 1e8. L(chi): 1.77, 1.27, 0.52, 0.021, 0.007, sup abs(R) = 1.72. The lattice floor of the third node,
(pi/d) coth(pi y/d) for sup Im M, is reproduced by the validation row (lattice closed form).

Controls.
- On-line lists against the full counting function: R(t) = S-type term minus twice the number of off-line pairs below t. DH: sup abs(R) = 5.0e4
  at 8.5e5 zeros, and the ratio is unbounded. This is the count of zeros on the line against N(T) (Turing's count): a step of 2 at each
  off-line pair, nothing before the first one (below height 85.7 the list is complete). Against the list's own smoothed count (knots every
  4096 zeros) sup abs(R) = 35.7 (DH), 42.3 (alt), and 2.6, 4.7, 6.3, 12.0, 35.3 for the heat windows at tau = 0, -1e-4, -5e-4, -2e-3, -1e-2:
  the fluctuation of the number of off-line pairs.
- Full zero sets with their own counting function (heights below 2000; off-line pairs counted as two points at their ordinate):
  sup abs(R) = 1.14 (zeta), 1.38 (DH), 1.34 (heat -0.1), 1.91 (heat -0.5), 1.96 (T-NR), 2.27 (E_a). Bounded for every control, as expected
  from S_F(T) = O(log T) for every function of the class (CLASSICAL: Backlund's argument uses the Dirichlet series and the order, not the
  Euler product). No control has growth of another order.
- Poles: m_N of a full set has poles at gamma +- i b. On the line Im z = y: sup y abs(m_N - m_inf) = 22.0 (DH, y = y_N = 0.056), 19.1
  (heat -0.1), 32.3 (heat -0.5), against 1.05 for zeta; for T-NR (b = 0.404) it is 1.04 at y_N and 1.03, 1.18, 1.46, 3.26, 10.6 at
  y = 0.05, 0.1, 0.2, 0.3, 0.45; for E_a (b = 1/4): 0.43 at y_N, 4.7 at y = 0.2. Over the region Im z >= y the sup is infinite as soon as one
  off-line zero has b >= y: 80 of the 84 DH pairs, 32 of 41 (heat -0.1), all 350 (T-NR), all 1517 (E_a) at y_N.

So the failure of a control is one of: a pole of m inside the region (the off-line zero itself), or the count deficit of the on-line list
(Turing's count). T-NR and E_a read on the line Im z = y_N are as good as zeta.

Classification: CLOSED. Not reached: N = 1e9 (section 6).

## 5. Why none is a survivor

A survivor needs: zeta passes at every size, every control fails early or for a zero-independent reason, all primes together.
- (1) zeta does not pass at N <= 1341, and no control fails at any N where zeta passes. No primes in the statistic.
- (2) zeta is outside the band on 99.7 % of the ladder. No primes.
- (3) the only all-primes statistic of the batch is the Landau sum. Zeta and L(chi) pass; DH passes below its first off-line zero and fails
  with it; T-NR fails at every size because its off-line zeros are below every size.
- (4) bounded for every list. Full sets fail by a pole at the off-line zero.

## 6. Not reached, and weakest steps

- N = 1e9 was not reached. The generation unit (`rh-s3db-gen9`, heights 4.27e7 to 3.72e8 in six ranges) ran 50 minutes and was at 34 to 37 %
  of each range, every completed block within 1 of the expected count; the workers write their range at the end, so nothing was saved. It was
  stopped by this lane because GPU 1 stood at 94 of 98 GB (17.5 GB of it this unit, the rest other jobs) and the server load was 150 to 190:
  the projected remaining time was two hours plus one hour of analysis. Every statement above ends at N = 1.0e8 for first-N ladders.
- 1. The heat windows at height 1e7 and the DH, alt lists above height 2000 are on-line lists only; "full set" statements for DH and heat
  rest on the tables below height 2000 (off-line lists from Newton searches, marked MEASURED and not certified complete in their source;
  the server copy of the heat -0.5 table has 277 pairs, the Mac copy 294; the numbers above use the Mac copy).
- 2. Theta for N >= 100 is first bounded with 400 neighbours on each side and then recomputed with the exact window definition only for
  pairs whose bound exceeds 1/4. The bound exceeds the exact value (all outside terms are positive for real lists), so no failing window is
  missed; for the T-NR far field, whose terms can be negative, the exact value is the on-line window sum plus the full factor-zero sum.
  Windows with N < 100 were evaluated exactly on the first 2.0e6 zeros only (and on the whole 1e12, chi and DH lists).
- 3. The mesoscopic discrepancy uses a grid of 1/16 spacing (0.6 % to 7 % accuracy) and the unfolded variable; it supports
  order-of-magnitude statements only. The N = 1e6 flows move 20,000 zeros in a frozen linearised field (validated against the full flow at
  1200 particles to 2e-9 and against long double on 2001 ordinates to 7e-7 or better); the full pairwise flow was run at N = 1e4 and N = 1e5 (1.0e10 pair terms per force, 18 minutes on GPU 1).

## 7. Files

Code (this directory): `zf.py` (library: lists, Theta of all pairs, window statistics, pairwise forces, RK4 flow with complex particles,
forcing and frozen far field), `c1.py`, `c2.py`, `c3.py`, `c4.py` (one per combination), `tests.py`, `recheck1.py` (30-digit re-check),
`zgen/gen_win.py` (window generator with offsets; `zgen/zl.py`, `zgen/rsz.py` are copies from `s1-zero-flow-dynamics`), `zgen/gen_seg.py`,
`run_*.sh` (server units), `summ1.py`. Outputs: `out_server/` (server runs: `c1_static_*.json`, `c1_flow_*.json`, `c1_recheck_zeta8.json`,
`c1_winexact_*.json`, `c2_*.json`, `c3_*.json`, `c4_*.json` and logs), `out/` (Mac runs: tables, validation, small cases).
Server directory: `~/rh-push/s3-dyson-burgers-zero-flow/` (data: `data/zeta_1e12_off.npy`).
