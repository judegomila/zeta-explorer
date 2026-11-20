# s2-mollifier-jensen-tempered: screening of four combinations (mollifier, Jensen, explicit-formula form, heat sum)

Lane: screener, 2026-11-19. Verdict: 4 combinations tested, 0 survivors.

Labels: PROVED (elementary, written here), CLASSICAL, MEASURED (float64 unless a precision is stated; GPU values are a screen), OPEN.

Outcome in one paragraph. (1) The per-window Jensen gap with tempered multiplicative mollifiers separates DH and T-NR from zeta in every one of 1000 windows at each of T = 1e6 .. 1e10, but it also fails the T-NR members whose zeros are all on the critical line, it passes the Liouville quotient, and E_a (every zero off the line) has the smallest excess of the controls: it measures whether the coefficients admit a tempered multiplicative inverse, not where the zeros are. (2) The form sum over zeros of w_T(rho) M(rho) M(1 - rho) acquires a negative eigenvalue only when the Dirichlet polynomial has more coefficients than there are on-line zeros between the window centre and the off-line zero (47 exact cases); the negative eigenvalue has size 1e-7 to 1e-279. (3) Right of the effective 1-line every control with an Euler-type mollifier keeps real part >= 0.67, including DH and T-NR; controls go negative only where the effective abscissa is inside the strip, and the sign and unimodular twists stay positive there. (4) I_F(T) is Littlewood's lemma: it stays within 0.65 log T for zeta and L(chi) up to T = 1e8, grows like the off-line mass for DH, crosses 5 log T at ten times the height of DH's first off-line zero, and the Liouville quotient passes.

## Controls

| code | function | Euler product | functional equation | off-line zeros |
|---|---|---|---|---|
| ZETA | zeta(s) | yes | yes | none below 3e12 |
| LCHI | L(s, chi), chi mod 5 odd, chi(2) = i (positive comparison) | yes | yes | none found |
| DH | (1 - i kappa)/2 L(s, chi) + (1 + i kappa)/2 L(s, chibar), coefficients (1, kappa, -kappa, -1, 0) mod 5 | no | yes | first pair at height 85.699; 84 pairs below 2000 (battery table) |
| TNR | zeta(s) m(s), m = 3^(s-1/2) + c + 3^(1/2-s), c = 2.2 (also c = 0, 1.5 in combination 1) | yes, one modified factor | yes | Re s = 1/2 +- 0.404 at heights (2k+1) pi / log 3 for c = 2.2; none for abs(c) <= 2 |
| EA | zeta(s + 1/4) zeta(s - 1/4) | yes, degree 2, local roots p^(+-1/4) | yes | all |
| LIOU | zeta(2s)/zeta(s) (sign twist eps_p = -1) | yes | no | poles at the zeros of zeta |
| SGN, U | completely multiplicative random signs / unimodular numbers at primes (seed 20261119) | yes | none | not defined left of Re s = 1/2 (used in combination 3 only) |
| HEAT | backward heat deformation of xi (battery zero tables, tau = -0.5 and -0.1) | no Dirichlet series | yes | 294 and 41 pairs below 2000, first at heights 111.7 and 415.3 (used in combination 4 only, from the zero table) |
| PLANT | zero set of zeta plus one planted quadruple at 1/2 +- delta +- i(T + d) (combination 2 only) | - | - | one pair at the stated distance d from the window centre |

## Table

| # | combination | statistic | sizes reached | ZETA | LCHI | DH | other controls | classification |
|---|---|---|---|---|---|---|---|---|
| 1 | mem-mollifier-proportion-loophole + ns-rigid-loophole-dirichlet-coefficients + conrey-kappa-theta-table | per window [T_w, T_w + T^0.6]: kappa_J = 1 - log(mean abs(V psi)^2)/R, kappa_nJ = 1 - (2/R) mean log abs(V psi), gap = kappa_nJ - kappa_J, minimised over tempered multiplicative psi of length T^theta | T = 1e6, 1e7, 1e8, 1e9, 1e10; 1000 windows each; every window sampled on a full uniform grid (3.3e4 to 8.4e6 points per window); theta = 1/2 and 4/7 | theta = 4/7: gap 0.317 / 0.316 / 0.320 / 0.325 / 0.330 (window range at 1e10: 0.325 to 0.334); kappa_J 0.464 to 0.439, minimum over all 5000 windows 0.435 | gap 0.336 / 0.332 / 0.334 / 0.339 / 0.342; kappa_J 0.449 to 0.429 | gap 0.764 / 0.794 / 0.828 / 0.861 / 0.890 with the best tempered option (c(p) = Re chi(p)); above the largest zeta / L(chi) gap in 5000 of 5000 windows; smallest same-window excess 0.41 / 0.45 / 0.49 / 0.52 / 0.55 | TNR c = 2.2: gap 1.15, excess 0.80 to 0.81 in every window. TNR c = 0 and c = 1.5 (all zeros on the line): excess 0.23 and 0.82 (T = 1e6, 20 windows). EA: excess 0.19 / 0.16 / 0.14 / 0.11 / 0.10 (the smallest, decreasing). LIOU: gap 0.342 / 0.324 / 0.317 / 0.316 / 0.316, below the larger of the zeta and L(chi) gaps in every window from T = 1e8; kappa_J = 1.6. SGN, U: not defined at sigma_0 < 1/2 | CLOSED. Detects "no tempered multiplicative inverse" (a property of the coefficients): fails functions with every zero on the line (T-NR, abs(c) <= 2), passes LIOU, and orders the controls unrelated to their off-line mass (EA lowest). A window mean: minimum over 1000 windows = mean - 0.005 at 1e10 |
| 2 | mollifier-holomorphy-constraint + h6-symbol-offline-poisson | Q_T(M) = sum_rho w_T(rho) M(rho) M*(1 - rho), w_T Gaussian of width Delta centred at T; lambda_min of the N x N matrix; N* = smallest N with lambda_min < 0 | zeta, prime side: T = 1e3, 1e6, 1e9, N <= 2000. Controls, zero side, ball arithmetic (decisions at 256 to 4096 bits): 47 cases, d = 0 to 60, N* up to 252; d = 100: positive definite to N = 248, not decided beyond; d = 1000 not run (section 2) | lambda_min / lambda_max between -3e-12 and -3e-16 at N = 1000 and 2000 (rounding); numerical rank 112 to 129 at Delta = 10 | not run (same theorem: all zeros in the window on the line) | N* = 28 (d = 10), 144 (d = 20), 252 (d = 40), 161 (d = 60, Delta = 20); on-line zeros nearer than the off-line one: 12, 34, 67, 56 | PLANT (T = 1e4, Delta = d/3, delta = 0.3): N* = 12, 29, 115 for d = 3, 5, 10 (stable under the cutoff); 9, 14, 39, 135 for Delta = d/6 and d = 3, 5, 10, 20. TNR, EA (zeros inside the window): N* = 8 to 129, growing with Delta. In all 47 cases N* > number of on-line zeros nearer to the centre than the off-line zero | CLOSED. Verified height in another form: the polynomial needs more coefficients than the zeros it has to cancel. abs(lambda_min) at N* is 1e-7 to 1e-279; no failure far from zeros at any N tried |
| 3 | dbn-phase-orbit-screen + mollifier-reshaping-range + dbn-t0-slope-razor | min modulus and min real part of the Euler-mollified Polymath approximant E f_t(x + iy) with each function's coefficients and its own mollifier | t in {0.16, 0.13, 0.10, 0.05, 0}, y in {0.1873, 0.5, 1}, 48 windows N = 690988 .. 4.05e6, 2,097,152 x-values per window: 1.0e8 samples per (t, y, function) | y = 0.1873: min Re 0.859 / 0.822 / 0.748 / 0.507 / -2.19 at t = 0.16 / 0.13 / 0.10 / 0.05 / 0 | 0.866 / 0.827 / 0.758 / 0.323 / -7.7 | truncated inverse (505 terms): 0.854 / 0.800 / 0.671 / -0.798 / -67.6 | LIOU 0.858 / 0.822 / 0.756 / 0.034; SGN 0.861 / 0.824 / 0.756 / 0.110; U 0.862 / 0.825 / 0.748 / 0.029 (direct sum alone at t = 0.05: zeta 0.322, LIOU 0.341, SGN 0.229, U 0.335); TNR 0.825 / 0.784 / 0.686 / -1.76; EA 0.653 / -0.18 / -5.9 / -78 | CLOSED. For t >= 0.10 (effective abscissa >= 0.93) DH and T-NR pass; they fail only at t = 0.05 (effective abscissa 0.76 to 0.97, inside the strip, where both have zeros at these heights). The tempered Euler twists stay positive. EA fails where its series is not absolutely convergent |
| 4 | route-k-littlewood-jensen-loss + littlewood-jensen-moment-loss | I_F(T) = int_0^T log abs F(1/2 + it) dt | ZETA, LCHI, DH to T = 1e8 (5.0e9 grid points per function, every on-line zero located: 248,008,023 for zeta); TNR, EA, LIOU to T = 2000; HEAT from zero tables to 2000 | -0.1340 at T = 500 (node value -0.134); -2.80 / -1.80 / -2.65 at 1e6 / 1e7 / 1e8; abs(I) <= 0.65 log T at all 69 recorded heights | -0.46 / -0.80 / -1.12 at 1e6 / 1e7 / 1e8; abs(I) <= 0.47 log T | 101.75 at 2000 (2 pi sum(beta - 1/2) from the table: 101.96); 9.86e4 / 1.113e6 / 1.224e7 at 1e6 / 1e7 / 1e8; slope 0.124 per unit height in the last decade; first above 5 log T at T = 860 | TNR: slope 0.4439 (exact mean 0.4436), above 5 log T at T = 60. EA: 2379 at 2000, above at T = 70. HEAT(-0.5): Littlewood sum above at T = 420; HEAT(-0.1): 30.1 at 2000, not above. LIOU: abs(I) <= 0.70 log T to 2000: passes | CLOSED. Littlewood's lemma: I_F = 2 pi sum(beta - 1/2) + O(log T), checked for DH to +-0.75 at six heights. DH crosses the envelope at 10 times the height of its first off-line zero; LIOU passes |

All numbers MEASURED unless marked. Full rows are in the files listed at the end.

## 0. Shared evaluator and its validation

Evaluator. Smooth approximate functional equation F(s) = D(sigma, t) + X(s) conj(D(1 - sigma, t)), D = sum a_n n^(-s) V(n), cutoff V(n) = Phi(-a log(n/N)) with N = sqrt(q t / 2 pi), a = 4, first 1/t correction of the Gamma quotient included; F' from the same sums with weights -log n. The sums over a window are computed on a uniform grid by a non-uniform FFT (Gaussian gridding, kernel half-width 11, oversampling 2); the drift of N across the window is handled by a Taylor expansion of the cutoff. Phases t log n at the window centre are reduced mod 2 pi in 80-bit arithmetic on the server; X(s) from log Gamma and polygamma values (mpmath, 40 digits) at the centre plus a Taylor series in t. Code: `core.py`.

Validation (all MEASURED).
- NUFFT against the direct sum: 1e-10.
- zeta and zeta' against mpmath: errors 9e-7 / 4e-6 at T = 2e4, 1.6e-9 / 1.3e-8 at T = 1e6, 1.1e-8 / 1.1e-7 at T = 1e10 (sigma = 1/2; 2.9e-8 / 3.4e-7 at sigma = 0.41). L(s, chi) against mpmath at T = 2e4: 8e-7 / 4e-6; at T = 1e10 the two cut parameters a = 4 and a = 6 agree to 1.7e-9 / 1.9e-8.
- V = F + F'/L for all six functions against the round-1 Euler-Maclaurin evaluator (no functional equation) at T = 1e5, 64 points: differences <= 1.1e-6.
- Halving the grid step changes kappa_J, kappa_nJ and the gap by at most 2.1e-3 (T = 1e6, two windows, all functions).
- GPU against CPU: 14 windows at T = 1e7 and 10 windows at T = 1e9 were computed both on the server GPU and on the local CPU (numpy): the statistics agree to 2.5e-8 and 2.1e-6.
- Combination 3: grid values against the source formula evaluated directly (N = 2000 and 5000, zeta, DH and the unimodular twist): relative difference 6.4e-7.
- Combination 4: I_zeta(500) = -0.1340 (node: -0.134). Zero counts found on the grid: 10142, 138069, 1747146, 21136125 at T = 1e4 .. 1e7, equal to N(T) (Arb, `zeta_nzeros`); 248,008,023 at 1e8 against N(1e8) = 248,008,025 (one close pair not resolved at step 0.02). Step 0.02 on the GPU against step 0.01 on the CPU at T = 1e6: zeta -2.7970 / -2.7980, L(chi) -0.4564 / -0.4566, DH 98598.16 / 98598.23.

## 1. Levinson numbers per window with tempered multiplicative mollifiers

Finite consequence tested. With V = F + F'/L_F on Re s = sigma_0 = 1/2 - R/L_F (R = 1.3, L_F = d log(q T_w / 2 pi)), and psi(1/2 + it) = sum_{n <= y} b(n) (log(y/n)/log y) n^(-1/2 - it), y = T^theta, b multiplicative with abs(b(p)) <= 1: the Jensen gap of the window, gap_w = (log mean_w abs(V psi)^2 - 2 mean_w log abs(V psi))/R, minimised over the tempered options available to F. Stated before the run: zeta and L(chi) pass if their gaps stay in a common band at every T; a control fails if its best gap exceeds the largest zeta / L(chi) gap in every window. Survival would need: every control fails in every window for a reason other than zeros or poles in the window, and no function with all zeros on the line fails.

Options. ZETA: none, mu. LCHI: none, mu chi. DH: none, mu chi, mu chibar, mu c with c(p) = Re chi(p) (= 1, 0, 0, -1 on the classes 1, 2, 3, 4 mod 5), and the two numerical optima below. TNR: none, mu, mu without the prime 3. EA: none, mu, the variant b(p) = -1, b(p^2) = 1. LIOU: none, mu^2. The Dirichlet inverse of DH, the inverse local factor of T-NR at 3 (b(3) = -4.8) and the inverse of E_a (abs(b(p)) = p^(1/4) + p^(-1/4)) are not tempered and are excluded.

Best tempered mollifier for DH (MEASURED). b(n) = mu(n) prod c(p), c(p) = c_{p mod 5} for p > 13 and free for p <= 13, all in the unit disc; Powell search from four starts (0, chi, chibar, half of Re chi) on a training window at 0.71e6 that is not in the test set, objectives log mean abs(V psi)^2 and the gap. Both objectives and both theta converge to c = Re chi to within 0.05 in every coordinate (log mean square 1.575 without mollifier, 1.349 at the optimum, 1.67 to 1.70 from the starts chi and chibar). The tempered part of DH that can be inverted is the common Euler factor of L(chi) and L(chibar) at the primes = +-1 mod 5.

Result, theta = 4/7 (theta = 1/2 in `c1_table.json`: same ordering, zeta gap 0.349 to 0.365). Entries: mean [minimum, maximum] over the windows of the block.

| T (windows) | ZETA gap | LCHI gap | DH gap | TNR gap | EA gap | LIOU gap |
|---|---|---|---|---|---|---|
| 1e6 (1000) | 0.3166 [0.2936, 0.3336] | 0.3356 [0.3114, 0.3536] | 0.7636 [0.7250, 0.7951] | 1.1512 [1.1213, 1.1725] | 0.5505 [0.5400, 0.5675] | 0.3419 [0.3120, 0.3689] |
| 1e7 (1000) | 0.3157 [0.3053, 0.3249] | 0.3319 [0.3204, 0.3409] | 0.7939 [0.7764, 0.8086] | 1.1461 [1.1313, 1.1589] | 0.5060 [0.5012, 0.5147] | 0.3236 [0.3094, 0.3359] |
| 1e8 (1000) | 0.3198 [0.3129, 0.3259] | 0.3342 [0.3272, 0.3402] | 0.8280 [0.8165, 0.8372] | 1.1470 [1.1386, 1.1537] | 0.4767 [0.4744, 0.4798] | 0.3170 [0.3081, 0.3247] |
| 1e9 (1000) | 0.3253 [0.3198, 0.3300] | 0.3385 [0.3328, 0.3432] | 0.8610 [0.8525, 0.8679] | 1.1499 [1.1434, 1.1556] | 0.4580 [0.4569, 0.4592] | 0.3159 [0.3080, 0.3222] |
| 1e10 (1000) | 0.3298 [0.3250, 0.3336] | 0.3419 [0.3369, 0.3460] | 0.8902 [0.8828, 0.8961] | 1.1520 [1.1465, 1.1563] | 0.4472 [0.4468, 0.4482] | 0.3158 [0.3088, 0.3215] |

| T | ZETA kappa_J | LCHI kappa_J | DH: windows above all zeta / L(chi) gaps; smallest same-window excess | TNR | EA | LIOU |
|---|---|---|---|---|---|---|
| 1e6 | 0.464 [0.445, 0.489] | 0.449 [0.429, 0.478] | 1000/1000; 0.4077 | 1000/1000; 0.7990 | 1000/1000; 0.1931 | 148/1000; -0.0053 |
| 1e7 | 0.461 [0.451, 0.473] | 0.449 [0.438, 0.462] | 1000/1000; 0.4519 | 1000/1000; 0.8056 | 1000/1000; 0.1634 | 0/1000; -0.0149 |
| 1e8 | 0.453 [0.447, 0.461] | 0.442 [0.436, 0.450] | 1000/1000; 0.4883 | 1000/1000; 0.8098 | 1000/1000; 0.1358 | 0/1000; -0.0209 |
| 1e9 | 0.445 [0.440, 0.451] | 0.435 [0.430, 0.441] | 1000/1000; 0.5190 | 1000/1000; 0.8097 | 1000/1000; 0.1144 | 0/1000; -0.0251 |
| 1e10 | 0.439 [0.435, 0.444] | 0.429 [0.425, 0.435] | 1000/1000; 0.5457 | 1000/1000; 0.8091 | 1000/1000; 0.1011 | 0/1000; -0.0284 |

Where computed: T = 1e10: all 1000 windows on the server GPU; 1e9: windows 0 to 849 on the server, 840 to 999 on the local CPU; 1e8: 0 to 263 server, 264 to 999 local; 1e7: 0 to 263 server, 250 to 999 local; 1e6: 0 to 649 server, 650 to 999 local (on the shared GPU a window cost 4 to 5 s at every size; one local core is faster for grids up to 5e5 points). The 24 windows computed twice agree to 2e-6.

Windows: [T_w, T_w + T^0.6], T_w = T + w max(T^0.6, T/1000), w = 0 .. 999 (T = 1e6: T_w up to 4.98e6; T >= 1e7: T_w in [T, 2T)). Each window is sampled on a uniform grid with step 0.12 (below the Nyquist step of abs(V psi)^2), so the window means carry no Monte Carlo error.

Reading.

1. Zeta and L(chi). Gap 0.316 to 0.330 and 0.332 to 0.342, rising by about 0.005 per decade from 1e7. kappa_J per window (Q(x) = 1 - x, P(x) = x, R = 1.3, not the optimised polynomials of the node, so 5/12 at theta = 0.585 is not the reference here): mean 0.439 at 1e10, minimum over all windows 0.435. The spread across windows is the content of "minimum, not mean": standard deviation of the gap over the 1000 windows 0.009 at 1e6 and 0.002 at 1e10 (this includes the drift of the mean across the block); minimum of kappa_J = mean - 0.019 at 1e6 and mean - 0.004 at 1e10. The window statistic is a mean over T^0.6 log T zeros and concentrates.
2. DH. With every tempered option the gap is above every zeta and L(chi) gap in all windows of all five blocks. Best option c = Re chi: 0.76 to 0.89; no mollifier: 0.80 to 1.20; mu chi or mu chibar: 1.5 to 2.4 (worse than no mollifier). The same-window excess grows with T (0.41 to 0.55). kappa_J for DH is negative from 1e6 (-0.09 to -0.28).
3. T-NR. c = 2.2: excess 0.80 to 0.81, the same in every window and at every T. The Jensen gap of the factor m alone on the critical line is (log(2 + c^2) - 2 arccosh(c/2))/R = 0.797 (PROVED, elementary: mean of (2 cos u + c)^2 and of log abs(2 cos u + c)). Run with c = 0 and c = 1.5 (T = 1e6, 20 windows, local CPU): gap 0.552 and 1.142 against zeta 0.298, excess 0.23 and 0.82 in all 20 windows. For abs(c) <= 2 every zero of m is on the critical line (PROVED: m = u + c + 1/u with u = 3^(s - 1/2), and the roots of u + 1/u = -c lie on abs(u) = 1 exactly when abs(c) <= 2), so zeta(s) m(s) has no off-line zero below 3e12 and fails the test by the same amount as c = 2.2.
4. E_a. Every zero is off the line, kappa_nJ = -2.7 to -7.1 (Littlewood count of the zeros right of sigma_0), and the Jensen gap with b = mu is 0.55 / 0.51 / 0.48 / 0.46 / 0.45: excess over the larger of zeta and L(chi) 0.19 / 0.16 / 0.14 / 0.11 / 0.10. It is the smallest excess of the controls, for the control with the largest off-line mass; DH (11 % of zeros off the line) has 0.55 and T-NR with no off-line zero has 0.23 to 0.82. The decrease slows (EA gap changes per decade -0.045, -0.029, -0.019, -0.011), which extrapolates to an EA gap near 0.43 against 0.33 for zeta; whether the excess stays positive is OPEN.
5. Liouville quotient. Tempered inverse mu^2 exists. Gap 0.342 / 0.324 / 0.317 / 0.316 / 0.316 (theta = 4/7): above both means at 1e6 (148 of 1000 windows above every zeta and L(chi) gap of the block), between them at 1e7, below the larger of the two in every window from T = 1e8 (largest same-window excess over the larger of the two: -0.0135, -0.0201, -0.0242 at 1e8, 1e9, 1e10) and below the zeta mean from 1e8; at theta = 1/2 below in every window from T = 1e9. It passes the gap criterion. Its kappa_J is 1.60 to 1.62 and kappa_nJ is 1.93: values above 1 because V has double poles at the zeros of zeta, which Littlewood's lemma counts with negative sign. A criterion "kappa_nJ <= 1" would reject it, and that criterion is a pole count in the window.
6. SGN, U. A completely multiplicative random twist has no known continuation to Re s = sigma_0 < 1/2; the statistic is not defined for it. The functional-equation step of Levinson (the reflection that places the line at sigma_0) is the step these twists lack; the gap itself uses only the line.

Why closed. The gap separates by the class of admissible mollifiers. (a) It fails a function whose zeros are all on the line (T-NR with abs(c) <= 2). (b) It passes a function without functional equation and with poles on the line (LIOU). (c) Its excess for the function with every zero off the line (EA) is the smallest of the controls. (d) What it reads for DH is that the coefficients are not multiplicative: the optimum over tempered multiplicative b is the common Euler factor of the two L-functions. (e) For each window it is a mean value over T^0.6 log T zeros; the minimum over 1000 windows equals the mean to 0.005 at 1e10, so the "every window" form adds nothing to the mean-value statement, and the output for zeta is a proportion (kappa_J about 0.44), not a statement about every zero (MV-CAP). The round-1 excess gap of DH (0.08 to 0.09 with least-squares polynomials of length 300) is confirmed as present in every window and is larger under the tempered restriction (0.41 to 0.55); it does not carry zero information.

## 2. The form sum over zeros of w_T(rho) M(rho) M*(1 - rho)

Definitions. M(s) = sum_{n <= N} b_n n^(-s), M*(s) = conj(M(conj s)), w_T(rho) = exp(-(z - T)^2 / (2 Delta^2)) with z = (rho - 1/2)/i. Q_T(M) = sum_rho w_T(rho) M(rho) M*(1 - rho) = b^* A b with A_{mn} = sum_rho w_T(rho) n^(-rho) m^(-(1 - rho)). A zero on the line contributes w abs(M(rho))^2 >= 0; a pair {rho, 1 - conj(rho)} contributes 2 Re(w_T(rho) M(rho) conj(M(1 - conj(rho)))), which has no sign (mollifier-holomorphy-constraint). Finite consequence: N*(d) = the smallest N for which the leading N x N block has a negative eigenvalue, when the nearest off-line zero is at distance d from T. Survival would need N*(d) bounded, or growing more slowly than the number of zeros between T and the off-line zero, with a negative eigenvalue of a size a finite prime sum can resolve.

Zeta, prime side (MEASURED, float64, 80-bit phases at 1e9). A_{mn} sqrt(mn) = S(log(n/m)), S(x) = sum_gamma h(gamma) e^(-i gamma x) = archimedean term - sum_k Lambda(k) k^(-1/2) (g(x + log k) + g(x - log k)), g Gaussian of width 1/Delta. Checked against the zero side (zero file, 9 digits):

| T | Delta | N | max abs(S_primes - S_zeros) | lambda_min / lambda_max | eigenvalues above 1e-9 lambda_max / 1e-12 lambda_max | zeros per unit height |
|---|---|---|---|---|---|---|
| 1e3 | 3 | 1000 | 5.8e-9 | -2.6e-14 | 31 / 36 | 0.807 |
| 1e3 | 10 | 1000 | 1.3e-8 | -9.4e-15 | 92 / 106 | 0.807 |
| 1e6 | 3 | 1000 | 1.5e-8 | -2.6e-12 | 39 / 66 | 1.906 |
| 1e6 | 10 | 2000 | 3.7e-8 | -2.7e-16 (server), -7.7e-13 (local) | 112 / 128 | 1.906 |
| 1e9 | 3 | 1000 | no zero list at this height | -1.8e-12 | 39 / 50 | 3.006 |
| 1e9 | 10 | 2000 | no zero list at this height | -6.3e-13 | 113 / 129 | 3.006 |

lambda_min >= 0 for zeta is a theorem at these heights (CLASSICAL: all zeros below 3e12 are on the line and the Gaussian tail beyond is below 1e-300), so the run is a check of the prime-side formula, not a test. The matrix has numerical rank 36 to 129, far below N: a float64 prime-side computation cannot see a negative eigenvalue smaller than 1e-12 lambda_max.

Controls, zero side (ball arithmetic, python-flint, 256 to 4096 bits, 8192 attempted; LDL^H without pivoting; N* certified by N - 1 positive pivots and one negative pivot, all as balls). Zeros with abs(gamma - T) <= c Delta are used, c = 14, 28 or 42. "stable": the same N* at two cutoffs.

| control | T | d (distance to nearest off-line zero) | Delta | on-line zeros nearer than d (K_d) | N* | status | abs(pivot) at N* |
|---|---|---|---|---|---|---|---|
| PLANT, delta = 0.3 | 1e4 | 3 | 1 | 7 | 12 | stable (c = 14, 28, 42) | 1.6e-14 |
| PLANT, delta = 0.3 | 1e4 | 5 | 1.67 | 12 | 29 | stable (14, 28, 42) | 8.1e-34 |
| PLANT, delta = 0.3 | 1e4 | 10 | 3.33 | 23 | 115 | stable (28, 42); 101 at c = 14 | 1.5e-129 |
| PLANT, delta = 0.3 | 1e4 | 20 | 6.67 | 46 | >= 208 | c = 14 only (lower bound) | 1.3e-234 |
| PLANT, delta = 0.3 | 1e4 | 3 / 5 / 10 | d/6 | 7 / 12 / 23 | 9 / 14 / 39 | pivot above the dropped weights | 2e-15 / 5e-21 / 2e-49 |
| PLANT, delta = 0.3 | 1e4 | 20 / 30 | d/6 | 46 / 70 | >= 135 / >= 250 | lower bounds (c = 28) | below 1e-160 / 1e-278 |
| PLANT, delta = 0.3 | 1e4 | 3 / 5 | d | 7 / 12 | 66 / >= 155 | stable / lower bound | 4e-65 / 4e-144 |
| PLANT, delta = 0.05 | 1e4 | 3 / 5 / 10 | d/3 | 7 / 12 / 23 | 19 / 50 / >= 150 | stable / stable / lower bound | 9e-27 / 1e-69 / 8e-186 |
| PLANT, delta = 0.3 | 1e5 | 3 / 5 / 10 | d/3 | 9 / 15 / 31 | 18 / 35 / >= 147 | stable / stable / lower bound | 2e-22 / 1e-40 / 6e-179 |
| DH | 75.7 | 10.0 | 3.33 | 12 | 28 | stable (14, 28) | 9.6e-18 |
| DH | 300.9 | 20.0 | 6.67 | 34 | 144 (131 at c = 14) | c = 28 | 7e-101 |
| DH | 280.6 | 40.2 | 13.3 | 67 | 252 (209 at c = 14) | c = 28 | 7e-116 |
| DH | 25.7 | 60.0 | 20 | 56 | 161 | stable (14, 28) | 6e-35 |
| DH | 25.7 | 60.0 | 60 | 56 | 225 | c = 14 | 1.0e-9 |
| TNR (zeros of m every 5.72) | 1e3 / 1e4 | 2.0 / 0.02 | 1 | 3 / 0 | 8 / 8 | pivot above the dropped weights | 2e-8 / 5e-8 |
| TNR | 1e3 / 1e4 | 2.0 / 0.02 | 3 | 3 / 0 | 35 / 43 | same | 7e-27 / 1e-35 |
| TNR | 1e3 / 1e4 | 2.0 / 0.02 | 10 | 3 / 0 | 74 / >= 128 | same / lower bound | 1e-21 / 8e-58 |
| EA (no zero on the line) | 1e3 / 1e4 | 0.2 / 0.07 | 1 | 0 | 8 / 10 | pivot above the dropped weights | 1e-7 / 2e-10 |
| EA | 1e3 / 1e4 | 0.2 / 0.07 | 3 | 0 | 32 / >= 57 | same / lower bound | 7e-23 / 7e-53 |
| EA | 1e3 / 1e4 | 0.2 / 0.07 | 10 | 0 | 66 / >= 129 | same / lower bound | 9e-19 / 4e-59 |

Stopped without a decision (PLANT, delta = 0.3): T = 1e4 with d = 20 and d = 30 at Delta = d/3 and d = 50 at Delta = d/6, T = 1e5 with d = 20 at Delta = d/3 (cutoff c = 28; K_d = 46, 70, 117, 61), and d = 100 below. In each of the four the leading blocks are positive definite up to N = 261 at least (pivots certified as balls at 4096 bits; by the lower-bound remark this holds for the full zero list), and no negative pivot was found before the runs were stopped at 8192 bits after 29 minutes.

For PLANT the dropped zeros are on the line, their contribution is positive semidefinite, so N* of a truncated list is a lower bound for N* of the full list (PROVED: removing positive semidefinite terms can only create negative directions earlier). For DH, TNR and EA off-line pairs are also dropped and the truncated values are not one-sided. All rows of the 47 cases are in `c2_table.txt`.

Reading.

1. In every case N* exceeds K_d, the number of on-line zeros nearer to the centre than the off-line zero (smallest ratio 14/12; typical 1.7 to 5). The form stays positive definite until the polynomial has enough coefficients to vanish, to the required relative accuracy, at every on-line zero whose weight exceeds the weight of the off-line pair.
2. At fixed Delta/d the threshold grows faster than d: 12, 29, 115 for d = 3, 5, 10 (Delta = d/3), between 5 and 9 times (rho Delta)^2 with rho the zero density; at T = 1e5 the same d give 18, 35, >= 147. Narrower windows lower N* (9, 14, 39, >= 135 at Delta = d/6) at the price of a negative eigenvalue of size 1e-15 to below 1e-160.
3. Zeros inside the window do not give early failure either: with every zero off the line (EA) and Delta = 3, the form is positive definite up to N = 31 at T = 1e3, and N* grows with Delta (8, 32, 66). N* is about the number of zeros carrying weight.
4. Size. abs(pivot) at N* ranges from 1e-7 (EA, Delta = 1) to 1e-279, against lambda_max of order 10. A prime-side evaluation would need the prime sums to that relative accuracy. In float64 the negative eigenvalue is visible in none of the cases with d >= 3.
5. d = 100 and d = 1000 (the sizes named in the test). d = 100, Delta = 5, T = 1e4 (K_d = 235): cutoff 60 Delta, 706 zeros: the leading 248 x 248 block is positive definite (certified at 4096 bits), so N* >= 249 > K_d = 235; the run at 8192 bits was stopped after 58 minutes without a negative pivot. Not decided for 249 <= N <= 700. d = 1000: not run; K_d = 2340 at T = 1e4 (6000 at T = 1e9) exceeds N = 2000, and by reading 1 no negative eigenvalue is expected for N <= 2000 (extrapolation of a measured inequality, OPEN as a theorem).

Why closed. The prediction of the test ("Poisson-kernel decay predicts none") holds in a stronger form: a negative direction exists only when N exceeds the count of on-line zeros between the centre and the off-line ordinate, and then with exponentially small size. Detecting the pair through Q_T costs a polynomial long enough to resolve all zeros up to it: the zero count of the window, that is verified height. H6 gives the same reading on the symbol side: off-line zeros add positive Poisson bumps 4 pi P(t; rho), and the sign-indefinite part sits in the outer term.

## 3. Euler-mollified heat sum with control coefficients

Definitions (source: `dbn-lambda-below-015-research/research/twistor_phase_freeze/screen_direct_ft.py`, arXiv:1904.12438 eq. (14)). f = sum_{n <= N} a(n) b_n^t n^(-s*) + gamma sum_{n <= N} conj(a(n)) b_n^t n^(y - conj(s*) - kappa), b_n^t = exp((t/4) log^2 n), N = floor(sqrt(x/4 pi + t/16)). Mollifiers: zeta prod_{p <= 13}(1 - b_p^t p^(-s*)); completely multiplicative a: prod (1 - a(p) b_p^t p^(-s*)); T-NR: the same with the exact inverse local factor at 3; EA: prod (1 - p^(1/4) u_p)(1 - p^(-1/4) u_p); DH: the Dirichlet inverse of its coefficients on the 13-smooth d <= 30030 (505 terms, largest coefficient 117), also the chi-product and the Re chi-product. The effective abscissa of the direct sum runs from (1 + y)/2 + (t/2) log N at n = 1 down to (1 + y)/2 + (t/4) log N at n = N: for y = 0.1873 and N = 6.9e5 .. 4.05e6 the lower end is 1.13 to 1.20 (t = 0.16), 1.03 to 1.09 (0.13), 0.93 to 0.97 (0.10), 0.76 to 0.78 (0.05), 0.594 (t = 0).

Finite consequence tested. Minimum over all samples of Re(E f) per (t, y, function). Survival would need: a t at which zeta keeps real part >= 0.1 and every control, including the tempered twists, has real part <= 0, at an effective abscissa where the control has no zeros.

Sizes. 48 windows (the five of the source and 43 log-spaced), in each a uniform x-grid of 2,097,152 points with step 0.25 (5.2e5 units of x, 0.5 to 3 % of the window), so 1.0e8 samples per (t, y, function); 5 values of t, 3 of y, 8 functions. The source screen has 25 samples per t. Not all 3.4e6 windows were visited.

Point check of the source (MEASURED). At N = 850000, fraction 0.999, t = 0.13: abs(E f) = 0.915230339 with float64 phases (source: 0.915230628) and 0.915083336 with 80-bit phases. The source value carries a phase rounding error of 1.5e-4 (x log n is about 4e14); the conclusion of the node is unaffected. Over 1.0e8 samples the minimum modulus of the P13-mollified zeta sum at t = 0.13 is 0.822 (N = 779530), not 0.915.

Result, y = 0.1873 (the curved-barrier value), minimum real part with the best mollifier of each function; in brackets the fraction of samples with real part <= 0 when not zero:

| t | ZETA | LCHI | DH | LIOU | SGN | U | TNR | EA |
|---|---|---|---|---|---|---|---|---|
| 0.16 | 0.859 | 0.866 | 0.854 | 0.858 | 0.861 | 0.862 | 0.825 | 0.653 |
| 0.13 | 0.822 | 0.827 | 0.800 | 0.822 | 0.824 | 0.825 | 0.784 | -0.177 (2e-7) |
| 0.10 | 0.748 | 0.758 | 0.671 | 0.756 | 0.756 | 0.748 | 0.686 | -5.9 (5e-4) |
| 0.05 | 0.507 | 0.323 | -0.798 (6.5e-6) | 0.034 | 0.110 | 0.029 | -1.76 (0.096) | -78 (0.18) |
| 0 | -2.19 (1.7e-3) | -7.7 (0.023) | -16.1 (0.077) | -14.9 (0.028) | -13.2 (0.028) | -17.4 (0.028) | -37 (0.40) | -1834 (0.46) |

Direct sum alone (no reflected term), same y: t = 0.05: ZETA 0.322, LCHI 0.404, LIOU 0.341, SGN 0.229, U 0.335, DH -0.540, TNR -1.59. y = 0.5: at t = 0.05 ZETA 0.707, LCHI 0.707, DH 0.564, LIOU 0.709, SGN 0.707, U 0.685, TNR 0.317, EA -10.3; at t = 0: ZETA 0.204, DH -2.2. y = 1: all functions except EA at t = 0 keep real part >= 0.24 at every t.

Reading.

1. t >= 0.10 (effective abscissa >= 0.93): every function with an Euler-type mollifier keeps real part >= 0.67 over 1.0e8 samples, DH with its truncated inverse (0.854 / 0.800 / 0.671) and T-NR with its own factor (0.825 / 0.784 / 0.686) included. Nothing separates right of the effective 1-line except E_a.
2. E_a fails from t = 0.13 at y = 0.1873 (from 0.05 at y = 0.5). Its Dirichlet series converges absolutely only for Re s > 5/4 (coefficients of size n^(1/4)), and the effective abscissa at t = 0.13 is 1.03 to 1.09. The failure is the size of the coefficients, read off a(p).
3. t = 0.05 (effective abscissa 0.76 to 0.97, inside the strip): zeta 0.507 and L(chi) 0.323 keep a margin; DH (-0.80, real part <= 0 on 6.5e-6 of the samples) and T-NR (-1.76, on 9.6 % of the samples) fail. T-NR has zeros at Re s = 0.904 every 5.72 units of height. DH has a number of zeros proportional to the length in every rectangle sigma_1 < Re s < sigma_2, T < Im s < T + H with 1/2 < sigma_1 < sigma_2 < 1 (CLASSICAL: Voronin), so each sampled range of 2.6e5 units of height contains zeros of the control at the abscissae the sum has entered; the small fraction of negative samples for DH is that of isolated near-zeros. The zeros of the heat-evolved sums themselves were not located. The tempered twists stay positive: LIOU 0.034, SGN 0.110, U 0.029 with the reflected term, 0.341 / 0.229 / 0.335 for the direct sum alone (zeta: 0.322). The reflected term is defined by zeta's functional equation and is foreign to the twists; without it they are indistinguishable from zeta.
4. Zeta reaches real part 0.1 between t = 0.05 and t = 0 at y = 0.1873 (0.507, then -2.19); at t = 0 no function keeps a margin at this y.

Why closed. The pattern to beat is reproduced: right of 1 the controls pass (except by coefficient size), inside the strip the controls with zeros there fail and the controls with a tempered Euler product pass together with zeta. No t in the list has zeta with margin and every control negative.

## 4. I_F(T) = int_0^T log abs F(1/2 + it) dt

Method. Uniform grid (step 0.004 below T = 3000 with the Euler-Maclaurin evaluator; step 0.02 above with the smooth approximate functional equation and NUFFT blocks of up to 4,194,304 points on the GPU). The grid sum h sum log abs(Z_j) is corrected by -h log abs(2 sin(pi u)) for every located real zero (u = its position in the cell); for a function of exponential type below 2 pi/h the corrected sum equals the integral up to h exp(-2 pi eta/h) per zero at distance eta from the line (CLASSICAL: Poisson summation applied to log abs(1 - e^(2 pi i (t - rho)/h))). Zeros are located by sign changes of the real function e^(i theta) F with a degree-5 interpolant and bisection; two zeros in one cell by a degree-6 interpolant at a local minimum. No Gauss-Legendre panels: the correction term replaces them and needs the zero positions only to the accuracy of the interpolant.

Result (MEASURED; step 0.02 against 0.01 agrees to 0.003 for zeta, 0.015 for L(chi), 0.08 for DH at T = 1e5 and 1e6).

| T | I_zeta | I_L(chi) | I_DH | 5 log T | zeros of zeta found | on-line zeros of DH | (zeros of L(chi) - on-line zeros of DH)/2 | I_DH / (2 pi x that number) |
|---|---|---|---|---|---|---|---|---|
| 100 | -1.4358 | -0.8065 | 1.8699 | 23.03 | 29 | 52 | 1 | 0.298 |
| 500 | -0.1340 | -0.5534 | 14.6847 | 31.07 | 269 | 377 | 10 | 0.234 |
| 1000 | -1.4737 | 1.4996 | 39.8659 | 34.54 | 649 | 848 | 28 | 0.227 |
| 2000 | -2.1705 | 1.2830 | 101.7460 | 38.00 | 1517 | 1861 | 84 (table: 84 pairs) | 0.194 |
| 1e4 | 0.0287 | -0.7282 | 656.93 | 46.05 | 10142 | 11570 | 567 | 0.184 |
| 1e5 | -2.8012 | 0.5926 | 8347.01 | 57.56 | 138069 | 147407 | 8138 | 0.163 |
| 1e6 | -2.7970 | -0.4564 | 98598.16 | 69.08 | 1747146 | 1790890 | 106202 | 0.148 |
| 1e7 | -1.7958 | -0.7973 | 1112787.1 | 80.59 | 21136125 | 21085389 | 1306118 | 0.136 |
| 1e8 | -2.6541 | -1.1167 | 12241224.2 | 92.10 | 248008023 | 242588827 | 15517096 | 0.126 |

- Zeta and L(chi): abs(I) <= 3.28 and 2.08 at the 69 recorded heights up to 1e8; largest abs(I)/log T = 0.65 and 0.47 (both at T = 50). The envelope 5 log T is not approached.
- DH: I_DH minus 2 pi sum(beta - 1/2) over the battery table is +0.56 (T = 50, no pair yet), -0.07, -0.06, -0.20, +0.74, -0.22 at T = 100, 200, 500, 1000, 2000. Slope of I_DH per unit height: 0.069 / 0.085 / 0.100 / 0.113 / 0.124 on the five decades from 1e3 to 1e8 (0.0076 to 0.0068 times log(5T/2 pi)). First recorded T with I_DH > 5 log T: 860 (grid of 10). The first off-line pair is at 85.7; 20 to 25 pairs are needed to reach the envelope.
- By-product (MEASURED, not certified): 242,588,827 on-line zeros of DH below 1e8 against 273,623,019 zeros of L(chi) (same gamma factor), so about 1.55e7 off-line pairs, 11.3 % of the zeros, with mean beta - 1/2 = 0.126 (decreasing from 0.19 at 2000).
- T-NR: I = I_zeta + int log abs(2 cos(t log 3) + 2.2) dt, slope 0.4439 (exact mean arccosh(1.1) = 0.4436, equal to 2 pi (beta - 1/2) log 3 / (2 pi)); above 5 log T at T = 60. "Large immediately" holds: first zero of m at height 2.86.
- E_a: 2378.6 at T = 2000, above 5 log T at T = 70 (first zero at 14.13).
- HEAT (from the zero tables, not integrated): tau = -0.5: 2 pi sum(beta - 1/2) = 676.6 at 2000, above 5 log T at T = 420 (first off-line pair at 111.7); tau = -0.1: 30.1 at 2000, not above 5 log 2000 = 38.0 although 41 pairs lie below 2000 (first at height 415.3).
- Liouville quotient: I = int log abs zeta(1 + 2it) dt - I_zeta. The integrand has logarithmic poles +infinity at every zero of zeta and one at t = 0; they are integrable and carry no Blaschke mass. I = 2.60, 1.64, 1.16, 0.29, 1.20, 2.49 at T = 50 .. 2000; abs(I) <= 0.70 log T. The control passes.
- SGN, U: not defined on the critical line.

Why closed. I_F(T) = 2 pi sum_{beta > 1/2, gamma < T} (beta - 1/2) + O(log T) (CLASSICAL, Littlewood) is confirmed numerically to +-0.75. The statistic is the off-line Blaschke mass. It is weaker than a zero count: DH crosses the envelope at 10 times the height of its first off-line zero, HEAT(-0.1) does not cross by 2000 with 41 pairs present from height 415 on, and the Liouville quotient, which has no functional equation and poles on the line, passes. Evaluating it to height T costs locating every zero to T.

## Survivors

None.

Nearest to the definition: combination 1 for DH and T-NR (failure in every window at every size, for a reason that is not a zero count). It does not qualify: one control passes (LIOU), one control's failure shrinks with T (EA), and a function with all zeros on the critical line fails by the same margin (T-NR with abs(c) <= 2), so the statistic does not respond to the location of zeros.

## Three weakest steps

1. Combination 1 uses Q(x) = 1 - x, P(x) = x and R = 1.3 for every function, not the optimised polynomials behind the node's kappa table; the tempered family for DH is searched only over b = mu c with c a class function mod 5 plus free values at p <= 13 (the optimum sits at the boundary c = Re chi); other multiplicative shapes (b(p^2) != 0) were tried only for EA. A wider tempered family could lower the DH gap; that it stays above zeta's is measured for the family searched, not proved. L_F for T-NR is zeta's (round 1 used conductor 9).
2. Combination 2: the exact results depend on the truncation of the zero list. Rows marked "lower bound" or with a single cutoff are not converged; the law N* = 5 to 9 times (rho Delta)^2 rests on six stable rows; the inequality N* > K_d is measured in 47 cases and not proved; d = 1000 was not run and d = 100 reached only N = 248 (positive definite). The zero ordinates of zeta are taken from a 9-digit file and treated as exact (a synthetic spectrum).
3. Combination 3 samples 48 of the 3.4e6 windows (0.5 to 3 % of each); the statement that DH and T-NR have zeros "in the slab" at t = 0.05 is argued from their zero densities, not by locating zeros of the heat-evolved sums; phases at x about 1e13 to 2e14 are accurate to about 2e-5 radian per term (80-bit), a screen. In combination 4 the count of zeta zeros at 1e8 is 2 short of N(1e8), and the DH off-line count assumes N_DH(T) = N_L(chi)(T) + O(log T).

## Files

- Code: `core.py` (evaluator, NUFFT), `validate.py`, `check_vs_em.py`, `c1lib.py`, `c1_opt.py`, `c1_levinson.py`, `c1_summary.py`, `c1_table.py`, `c2_zero_side.py`, `c2_prime_side.py`, `c2_table.py`, `c3_heat.py`, `c3_point.py`, `c3_summary.py`, `c4_littlewood.py`, `c4_derived.py`, `c4_check.py`.
- Combination 1: `c1_T1e+06*.jsonl` .. `c1_T1e+10*.jsonl` (one line per window, all functions and mollifiers; files with `_local` in the name were computed on the local CPU, the others on the server GPU), `c1_table.json`, `dhopt_T1e+06.json`, `c1_T1e+06_local_cn0.jsonl`, `c1_T1e+06_local_cn1.5.jsonl` (T-NR with c = 0, 1.5), `c1_T1e+06_local_hf*.jsonl` (step halving).
- Combination 2: `c2_zero_side.jsonl`, `c2_zero_side_cut14.jsonl`, `c2_table.txt`, `c2_prime_side.jsonl`, `out_c2_prime_*.txt`, `out_c2_srv.txt`, `out_c2_d100_D5.txt` (logs of the stopped runs), `out_c1_table.txt`.
- Combination 3: `c3_result_W48_M2097152.json`, `out_c3.txt`, `out_c3_summary.txt`, `out_c3_point.txt`.
- Combination 4: `c4_result_T1e+08_h0.02.json`, `out_c4_1e8_h0.02.txt`, `c4_result_T1e+06_h0.01.json`, `c4_result_T50000_h*.json`, `c4_derived_T2000.json`.
- Server units (all stopped or finished): rh-s2-val-1119222702, rh-s2-tim-1119223123, rh-s2-c1-1119223314, rh-s2-c1a-1119223435, rh-s2-c1b-1119223435, rh-s2-c1c-1119223722, rh-s2-c1d-1119230049, rh-s2-c1e-1119230049, rh-s2-c1f-1119232324, rh-s2-c3-1119223435, rh-s2-c3pt-1119231044, rh-s2-c4-1119223046, rh-s2-c4-1119224531, rh-s2-c4-1119230804, rh-s2-c4b-1119230804, rh-s2-c2p-1119225530, rh-s2-c2big-1119230035, rh-s2-c2c-1119232929. GPU 1 only, cupy pool limits 6 to 14 GB per job, at most 23 GB in use by this lane at one time; CPU jobs 1 to 8 cores, at most 10 GB requested.
- Local runs: through `scripts/memcap.sh` with caps 4 to 8 GB, single process each, at most 11 minutes per run, except four exact-arithmetic jobs of combination 2 that were stopped after 27 minutes without a result and moved to the server.
