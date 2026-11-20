# s1-shift-field-spectra: screening of four shift-field combinations (2026-11-19)

Lane type: screener. Four untried tag pairs were turned into finite statistics of the completed function F at s+a, s-a on vertical lines Re s = 1/2 + x and computed for zeta, L(s, chi_5) (real character mod 5), and the controls. **Result: no survivor.** Labels: PROVED (elementary identity, proof given), CLASSICAL (quoted), MEASURED (numerical; "ball" when python-flint balls certify the sign).

## 0. Verdict in one table

| # | combination (tags) | statistic | sizes reached | zeta | L(s, chi_5) | DH | zeta(s+a)zeta(s-a) | heat | sign twist (Liouville) | unimodular twist | T-NR | classification |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | spinor x mollifier | mean of abs(psi F)^2 and abs(psi V)^2 on the 1/2-line, V = Levinson function, psi of length T^(1/2) | zeta to 1e10 (7.6e7 grid points); L, DH to 1e6; others to 2560 (exact) and 1e8 | 2.80 to 2.90 and 1.26 to 1.29 for T = 1e5 to 1e10 (references 3 and 4/3) | 2.53 to 2.77 and 1.20 to 1.25, T = 20 to 1e6 | own inverse mollifier: 2.04 to 2.87 below 85.7 (inside the zeta / L spread); 2.71 (T=80), 3.34 (1e4), 3.69 (1e5), 4.29 (1e6); ratio to L: 1.05, 1.24, 1.35, 1.55 | own inverse: 4.5 to 82 and growing (size) | 1.40 to 2.07 (tau = -0.1), 1.48 to 2.00 (tau = -0.5); ratio to zeta 0.95 at T = 80 falling to 0.49 at 1e8; not separated below the first off-line zero | infinite (poles on the line) | equal to zeta at a translated height (identity) | zeta's mollifier: 17 to 21 at every height from 10 to 1e8 (7 to 10 times zeta's value); own inverse: 107 (1e5) to 864 (1e8) | **closed.** No control leaves a fixed factor below its first off-line zero; DH stays within a factor 1.6 of L and heat within a factor 2.1 of zeta at heights far above their first off-line zeros; T-NR passes with zeta's mollifier |
| 2 | shear x large-sieve | variance over window centres of the integral of Re F'/F minus its smooth part over a window of half-width sqrt(t/2pi) on Re s = 1/2 + x, divided by the prime-power sum | zeta to 1e9 (12 to 451 independent windows per band); L, DH to 1.1e5 | 0.64 to 1.05 below 2560, 0.98 to 1.00 for 1e5 to 1e8 | 0.82 to 1.18 for 10 to 2560, 0.95 to 1.01 above | x <= 0.2: 0.36 to 0.74 in the bands 10..80 (2 to 5 windows), 3 to 119 above; x = 0.5: 0.18 to 0.56 in every band from 10 | fails from the band containing 14.13 | zeta-like until the band of the first off-line zero (415.26 and 111.69), 3 to 4e4 after | 0.82 to 1.03 from 40 upwards: **passes** | equal to zeta at a translated height | x <= 0.2: 0.40 to 1.00 below 2560, 0.93 to 0.98 at 1e7 and 1e8 (**passes**; its zeros give a mean drift only); x = 0.5: 2.7 to 14 | **closed.** Sign twist and T-NR pass; heat separates only where its off-line zeros are; DH below 85.7 is separated on Re s = 1 by the size of a(2), a(3) |
| 3 | shear x visualization | fraction of the grid sigma in {0.55, ..., 1}, t in the band with W = Re(F' conj F) < 0, and with Re F < 0 | zeta to 1e10; L, DH to 1e6; others to 2560 and 1e8 | W: 0 at every band. Re zeta < 0: first at t = 29.86 on sigma = 0.55 (ball), 13.7% of the line at 1e10 | W: 0. Re L < 0: first at 12.03 (ball), 12.0% | W < 0 first at 85.413 (ball), zero at 85.699; Re DH < 0 first at 21.78 | W < 0 first at 13.887 to 14.02 (ball), zero at 14.135 | W < 0 first at 415.24 and 111.46, zeros at 415.256 and 111.694 | W < 0 from the first grid point (poles on the 1/2-line) | equal to zeta | W < 0 first at 2.523 (ball), zero at 2.860; on the lines sigma <= 0.7 the fraction is 0 again at T >= 1e7 | **closed.** W < 0 at a point forces a zero to its right (PROVED): verified height, and weaker than it at large height. Re F < 0 is positive for zeta from t = 29.86 |
| 4 | bridge x proportion | interlacing failures of the zeros of xi(s+a) - e^(i phi) xi(s-a) on the 1/2-line per unit height, a in {0.01, 0.05, 0.2} | as 3; contiguous grids, zeta to 1e10 | 0 failures in every band (2.3e6 units of contiguous grid) | 0 | first 85.413, 85.417, 85.482 (ball); 0.02 to 0.09 per unit height | 0.1 to 0.9 per unit height from 13.9 | from 415.24 / 111.46 | 0.3 to 0.9 per unit height from the first grid point | equal to zeta | 0.06 to 0.2 per unit height below 2560; 0 on all three lines at T = 1e8 | **closed.** Failure = W < 0 on Re s = 1/2 + a (PROVED identity): combination 3 on three lines |

Survivor definition used (from the task): zeta passes at every size; every control fails at a size far below its first off-line zero or for a reason that does not resolve zeros; all primes together. None of the four meets it. The pattern of the earlier lanes is reproduced: separation appears where the off-line zeros are (3, 4, 2 for heat and E_a), or through coefficient size readable in the half-plane of absolute convergence (2 for DH on Re s = 1; 1 for DH through the growth of the inverse coefficients), and two controls with off-line zeros at every height pass outright (T-NR in 1, 2 and, at large height, 3, 4; the sign twist in 2).

## 1. Objects and definitions

Nodes read in `engine/IDEA_GRAPH.json`: zv-bloch-spinor-state, levinson-in-ladder-language, jensen-loss-in-levinson, zv-finite-bridge-balance, meansquare-pointwise-wall, zv-signed-shear-w, zv-hessian-log-modulus, selberg-phase-gate-vs-zeta, zv-shifted-field-interference, bridge-winding-equals-NT, mv-cap-sensitivities. Map rows consulted: P26, P32, Q2, Q9, G13, G21, G24 and the control table.

Completed functions F (code names in brackets):
- [ZETA] s(s-1) pi^(-s/2) Gamma(s/2) zeta(s).
- [LCHI] (5/pi)^(s/2) Gamma(s/2) L(s, chi), chi = (1, -1, -1, 1, 0) mod 5.
- [DH] (5/pi)^(s/2) Gamma((s+1)/2) sum a(n) n^-s, a = (1, kappa, -kappa, -1, 0) mod 5, kappa = 0.2840790. First off-line zero 0.8085172 + 85.6993485 i (battery table, 84 pairs below 2000).
- [EA18], [EA14] zeta(s+a) zeta(s-a) completed, a = 1/8, 1/4. Zeros on Re s = 1/2 +- a from 14.1347.
- [TNR] 3^s xi(s) (1 + 2.2 * 3^(1/2-s) + 3^(1-2s)). Off-line zeros 0.9037532 + i pi (2k+1)/log 3 (first 2.8596, spacing 5.7192).
- [HEAT-0.1], [HEAT-0.5] F_tau(sigma + it) = E xi(sigma + i(t + Y)), Y normal with variance abs(tau)/2 (the form used by the battery, third pass). First off-line zeros 0.5216 + 415.256 i and 0.7430 + 111.694 i (battery tables, MEASURED).
- [LIOU] zeta(2s)/zeta(s) (eps(p) = -1): no functional equation; used uncompleted.
- Unimodular twist n^(-i alpha): zeta(s + i alpha). On a vertical line every statistic below is the zeta statistic at height t + alpha, so it passes whenever zeta does (identity; not computed). A generic unimodular completely multiplicative twist has no values in the strip (battery limit 1) and is not formulable.

Statistics (lines SIG = 0.5, 0.51, 0.55, 0.6, 0.65, 0.7, 0.8, 0.9, 1.0):
- **T1.** L = 2 Re(gamma'/gamma)(1/2 + iT) (log(T/2pi) for zeta, log(5T/2pi) for conductor 5, log(9T/2pi) for T-NR, 2 log(T/2pi) for E_a), alpha = 2/L. D = F + alpha F' (the spinor component of the square-root lane). On the 1/2-line abs(D)/abs(gamma (1 + alpha gamma'/gamma)) = abs(V), V = f + f' alpha/(1 + alpha gamma'/gamma), f the uncompleted function; V = f + f'/L (1 + O(1/L)) is Levinson's function. Mollifier psi(s) = sum_{n <= y} b(n) (1 - log n/log y) n^-s, y = T^(1/2) (for the Riemann-Siegel runs y = (T/2pi)^(1/2)), b the Dirichlet inverse of the coefficients of f ("own"; for zeta b = mu, for L b = mu chi) or mu ("mu"). Reported: mean over the band of abs(psi f)^2 and abs(psi V)^2 on Re s = 1/2. Reference values for an Euler product with length theta = log y/L (CLASSICAL, Conrey's mean value with P(x) = x, R = 0, quoted and not re-derived here): 1 + 1/theta and 1 + 1/(3 theta) - 1/2 + theta/3, i.e. 3 and 4/3 at theta = 1/2. Survival would need: the ratio to the reference inside a fixed band for zeta and L at every T, and outside it for each control at T below its first off-line zero.
- **T2.** J(t0) = integral over abs(t - t0) <= h of [Re F'/F - Re gamma'/gamma](1/2 + x + it) dt, h = sqrt(t0/2pi) (the limit a -> 0 of B_a/(2a); it equals the increment of arg f over the window). Prime-side prediction of its variance (PROVED formally from log f = sum Lambda(n)/(log n) n^-s, valid in mean square for fixed x > 0, CLASSICAL): V(x, h) = sum over prime powers p^k of k^-2 p^(-k(1+2x)) (1 - cos(2hk log p)); the factor 1/log^2 comes from the integration (the task's sum Lambda(n)^2 n^(-1-2x) is the variance of the integrand, not of the window integral). Reported: variance (after linear or cubic detrending in t0) divided by V averaged over the half-widths used; p = 5 removed for LCHI and DH. Also the finite-a form with B_a = tanh(log abs F(s+a) - log abs F(s-a)), pairs (x, a) = (0.05, 0.05), (0.1, 0.05), (0.15, 0.05), (0.2, 0.1). Survival would need: fixed band for zeta at all heights, every control outside it below its first off-line zero.
- **T3.** Fraction of grid points of each line with Re(F'/F) < 0 (sign of W), and with Re f < 0 (f uncompleted, as in the Selberg phase-gate node), first ordinate of each.
- **T4.** With R_a(t) = F(1/2 + a + it)/F(1/2 - a + it): number of maximal runs of Re(F'/F)(1/2 + a + it) < 0 per unit height (see 2.2 for why this is the interlacing-failure count), first ordinate, a = 0.01, 0.05, 0.2.

## 2. What is proved (elementary; all four tests)

**2.1 (PROVED, classical content).** Let F be entire of order 1, real on the real axis, F(1-s) = +-F(s), zeros rho = beta + i gamma. Then F'/F(s) = sum over rho of 1/(s - rho) (symmetric summation; the constant vanishes by the functional equation), so Re F'/F(sigma + it) = sum (sigma - beta)/abs(s - rho)^2. For sigma > 1/2 a pair {beta + i gamma, 1 - beta + i gamma} with beta <= sigma contributes a non-negative amount. Hence W(s) < 0 at a point with Re s = sigma > 1/2 implies a zero with beta > sigma, and the negative term of that zero is at most 1/(beta - sigma) in size. Consequences: (i) for zeta, T3-W and T4 give 0 at every height below the verified height by a theorem, with no computation; (ii) a zero at horizontal distance d to the right of the line is seen on that line only if 1/d exceeds the positive remainder, which is about (1/2) log(t/2pi): at height t the test reads zeros within about 2/log t of the line and no others.

**2.2 (PROVED).** For such F, F(1/2 - a + it) = conj F(1/2 + a + it), so abs(R_a) = 1 and theta_a(t) = arg R_a has theta_a' = 2 Re F'/F(1/2 + a + it). The zeros in t of F(s+a) - e^(i phi) F(s-a) on the 1/2-line are the solutions of theta_a = phi mod 2pi. If theta_a is increasing on a window, the solutions for different phi interlace and their number for each phi equals the winding of R_a within 1; each maximal interval with theta_a' < 0 produces a triple of solutions for the phases it sweeps (an interlacing failure) and conversely. So T4 counts sign changes of W on the line Re s = 1/2 + a: it is T3 on three lines. The winding of R_a counts the zeros in the strip abs(Re s - 1/2) < a (argument principle on the rectangle, the two vertical sides being conjugate), so "bridge winding = N(T)" holds exactly when no zero lies outside that strip.

**2.3 (PROVED).** The unimodular twist n^(-i alpha) passes every test here because its values on a vertical line are zeta's values at height t + alpha. T-NR on Re s = 1/2: abs(1 + c z + z^2) with abs(z) = 1 equals abs(c + 2 cos(t log q)), between c - 2 and c + 2, so with zeta's mollifier its T1 values are zeta's times a bounded positive periodic weight: inside a fixed factor at every height.

## 3. Code, validation, runs

Code (this directory): `sfs.py` (three engines and the statistics), `validate.py`, `post.py` (pooling and tables), `onset.py`, `recheck_re.py`, `recheck_lib.py` (128-bit balls), `driver.py` and the job lists.

Engines:
- `arb`: python-flint, 80-bit balls, values and first derivatives through `acb_series` (Hurwitz zeta for the characters mod 5), midpoints passed to the statistics. Bands 4..10, 10..20, ..., 1280..2560, grid step 0.01 (0.02 from 640). All objects.
- `rs`: zeta and zeta' by the Riemann-Siegel formula with the first correction term on all nine lines, float64; the phases T0 log n and the Taylor coefficients of log chi about sigma + i T0 are computed in 200-bit balls per segment so that the float64 part only carries the offset. Objects derived from it: ZETA, TNR, HEAT (convolution of xi along t by FFT).
- `per`: L(s, chi_5) and DH by a smoothed direct sum of length 2.6 * 5t/(2pi) (erfc cut-off beyond the stationary range), float64.

Validation (`validate_local.json`, `validate_server.json`, `crosscheck_per_vs_arb_1280.json`):
- `rs` against `acb.zeta` at 40 random points per height, all nine lines: max abs error of zeta 9.1e-6 (T = 1e5), 3.8e-6 (1e6), 1.6e-8 (1e8); of zeta' 1.2e-4, 3.3e-5, 1.6e-7.
- `per` against Hurwitz balls at t near 50, 700, 5000: max abs error 4.0e-7 (value), 2.6e-6 (derivative).
- Gamma factors against balls: 2e-13.
- Known answer 1: Re(F'/F) = 0 on the 1/2-line for DH (functional equation); found 0.0 at t = 85.6993485.
- Known answer 2: the first off-line zero of DH (0.80852 + 85.69935 i): Re(F'/F) = -115.5 on sigma = 0.8 and +12.7 on sigma = 0.9 at that ordinate.
- Known answer 3: heat convolution against direct quadrature of xi in 120-bit balls at 0.6 + 60 i, tau = -0.5: relative difference 3.1e-8.
- `per` against `arb` on the whole band 1280..1440 for LCHI and DH: every count identical, variances equal to 5 digits, moments equal to 6 digits.
- Ball rechecks of reported signs (`onset.json`, `recheck_re.json`): the first sign change of Re(F'/F) for DH, E_a, T-NR bracketed to 0.001; Re zeta(0.55 + 29.85 i) > 0 and Re zeta(0.55 + 29.86 i) < 0; Re zeta(1 + 1267065.14 i) < 0; Re L(0.55 + 12.03 i) < 0; three spot values of Re(xi'/xi) > 0 at height 1e9.

Runs. Compute server through `rhrun` only (units `rh-s1sfs-*`, 8 cores, 6 to 12 GB requested, all inactive at the end): zeta at 1e9 (contiguous, 5e5 units of height, step 0.05), zeta at 1e10 (sparse sample over 6.4e5, step 0.5, and a contiguous window of 3.2e5, step 0.05), L and DH at 1e5 (contiguous, 1e4) and 1e6 (sample over 4e3, step 0.25), three of the eight sub-bands of zeta at 1e8. GPU 1 was not usable: at launch the card showed 96.4 of 97.9 GB in use by other jobs and the cupy allocation failed, so every run is numpy on CPU; the machine load average was 95 to 140 on 48 cores and the unit received about 2.6 of its 8 cores for the first hour. The low bands (exact), zeta at 1e5 to 1e8 and L, DH at 2560 to 3e4 and at 3e5 were therefore run on the Mac through `scripts/memcap.sh 8`, one process per job, each job under 5 minutes. Total: 7.6e7 grid points for zeta over 2.9e6 units of height; 1.8e6 points each for L and DH; 6.5e7 for T-NR and heat.

Full tables: `TABLES.md` (110 rows per table), machine-readable `rows.json`; raw band files in `out/`.

## 4. Results by combination

### 4.1 Combination 1 (spinor x mollifier): closed

| band | zeta, mu | L, own | DH, own | DH, mu chi | T-NR, mu | T-NR, own | heat -0.1, mu | heat -0.5, mu |
|---|---|---|---|---|---|---|---|---|
| 10..20 | 1.86 / 1.57 | 2.57 / 1.31 | 2.04 / 1.15 | 2.43 / 1.35 | 18.7 / 5.90 | 18.7 / 5.90 | 1.89 / 1.59 | 2.00 / 1.67 |
| 20..40 | 1.89 / 1.23 | 2.53 / 1.21 | 2.87 / 1.33 | 3.18 / 1.48 | 18.2 / 5.64 | 10.1 / 3.66 | 1.88 / 1.24 | 1.87 / 1.26 |
| 40..80 | 1.95 / 1.21 | 2.62 / 1.25 | 2.54 / 1.17 | 3.46 / 1.58 | 17.1 / 5.91 | 22.8 / 8.24 | 1.91 / 1.18 | 1.81 / 1.12 |
| 80..160 | 2.17 / 1.18 | 2.58 / 1.20 | 2.71 / 1.23 | 4.01 / 1.78 | 18.9 / 6.36 | 26.9 / 9.70 | 2.07 / 1.12 | 1.82 / 0.95 |
| 1280..2560 | 2.34 / 1.17 | 2.64 / 1.21 | 2.96 / 1.30 | 7.01 / 2.83 | 18.2 / 6.87 | 32.2 / 11.8 | 1.89 / 0.90 | 1.48 / 0.56 |
| 1e4..3e4 | - | 2.70 / 1.23 | 3.34 / 1.42 | 9.61 / 3.72 | - | - | - | - |
| 1e5 | 2.80 / 1.26 | 2.73 / 1.23 | 3.69 / 1.53 | 11.7 / 4.46 | 21.3 / 8.10 | 107 / 36 | 1.70 / 0.64 | 1.51 / 0.45 |
| 3e5 | - | 2.76 / 1.24 | 3.95 / 1.61 | 13.1 / 4.94 | - | - | - | - |
| 1e6 | 2.82 / 1.27 | 2.77 / 1.25 | 4.29 / 1.73 | 14.9 / 5.55 | 21.0 / 8.18 | 189 / 64 | 1.54 / 0.54 | 1.58 / 0.45 |
| 1e7 | 2.84 / 1.28 | - | - | - | 20.9 / 8.26 | 355 / 119 | 1.45 / 0.48 | 1.68 / 0.46 |
| 1e8 | 2.86 / 1.28 | - | - | - | 20.8 / 8.34 | 864 / 288 | 1.40 / 0.44 | 1.80 / 0.49 |
| 1e9 | 2.88 / 1.29 | - | - | - | - | - | - | - |
| 1e10 | 2.90 / 1.29 | - | - | - | - | - | - | - |

Entries: mean abs(psi f)^2 / mean abs(psi V)^2 (MEASURED). E_a (own): 4.5 / 3.0 at 10..20 rising to 39 / 13 (a = 1/8) and 82 / 26 (a = 1/4) at 1280..2560. Liouville: 3e2 to 8e4 / 5e7 to 8e13, dominated by single grid points next to the poles (the integral diverges).

Reading:
1. Zeta and L sit in a band and approach the references from below (zeta 2.80 to 2.90 against 3; 1.26 to 1.29 against 4/3). The test statement holds for them.
2. DH below its first off-line zero (bands 10..80): 2.04, 2.87, 2.54 against zeta 1.86 to 1.95 and L 2.53 to 2.62. Not separated. The mollifier there has length 3 to 8.
3. DH above: the excess over L grows slowly, 1.05 at T = 80, 1.12 at 1280, 1.24 at 1e4, 1.35 at 1e5, 1.55 at 1e6 (about T^0.05 between 1e4 and 1e6). At T = 1e6, far above its first off-line zero (84 pairs below 2000; 0.09 interlacing failures per unit height at 1e5), DH is still within a factor 1.6 of an L-function. The source of the growth is the size of the inverse coefficients: sum over n <= Y of b(n)^2/n = 3.56, 8.22, 23.4, 80.0 at Y = 1e2, 1e3, 1e4, 1e5 (`binv.py`; exponent about 0.53), against 3.34 to 6.84 for mu chi. Unbounded inverse coefficients are the zeros of DH in Re s > 1: the "right of 1" pattern.
4. T-NR with zeta's mollifier: 17 to 21 at every height from 10 to 1e8. A fixed factor (7 to 10 times zeta's value; abs(1 + c z + z^2)^2 has mean c^2 + 2 = 6.84 on the line). T-NR has an off-line zero pair every 5.72 units of height and passes the fixed-factor form of the test. With its own inverse mollifier the value grows like T^0.3 (the local roots have modulus 3^(+-0.404)): a statement about one Euler factor.
5. Heat: the ratio to zeta is 0.92 to 1.02 in the bands below the first off-line zero and drifts down slowly afterwards (tau = -0.1: 0.81 at 1280, 0.61 at 1e5, 0.49 at 1e8 for abs(psi f)^2; 0.34 at 1e8 for abs(psi V)^2), at heights where 13.6% of the line sigma = 0.55 has W < 0.
6. The statistic is a mean value: by MV-CAP (map section 1) it cannot certify an every-window statement, and Levinson's use of it gives proportions (rows P26, Q9).

Why not a survivor: zeta passes; no control fails below its first off-line zero; three controls (T-NR with mu, heat, unimodular twist) stay inside a fixed factor at all sizes; DH leaves only as a slow power driven by Re s > 1.

### 4.2 Combination 2 (shear x large-sieve): closed

Variance ratio, a -> 0, x = 0.05 / 0.1 / 0.2 / 0.5 (MEASURED):

| band | windows | zeta | L | DH | T-NR | heat -0.1 | heat -0.5 | Liouville | E_a, a = 1/8 |
|---|---|---|---|---|---|---|---|---|---|
| 10..20 | 2 | .72 .83 .95 1.04 | .86 .97 1.09 1.18 | .45 .43 .36 .18 | .62 .59 .40 10.1 | .73 .84 .95 1.05 | .75 .87 .99 1.10 | 1.12 1.28 1.43 1.49 | .02 .09 3.9 4.2 |
| 20..40 | 4 | .64 .72 .81 .89 | .82 .90 .94 .96 | .44 .42 .36 .21 | .63 .71 .83 4.9 | .64 .73 .83 .92 | .67 .78 .89 1.01 | .64 .72 .80 .88 | .02 .11 3.4 3.6 |
| 40..80 | 5 | .79 .88 .94 .98 | .83 .93 1.00 1.03 | .71 .74 .68 .44 | .80 .89 1.00 2.7 | .81 .90 .97 1.03 | .89 1.01 1.13 1.25 | .87 .95 1.01 1.03 | .04 .22 4.0 4.0 |
| 80..160 | 8 | .81 .91 .99 1.05 | .87 .95 1.01 1.03 | 3.2 4.3 3.3 .49 | .75 .77 .71 14.5 | .85 .96 1.06 1.15 | 3.7 5.1 5.3 1.6 | .82 .91 .98 1.02 | .06 .31 4.3 4.4 |
| 320..640 | 17 | .88 .96 1.01 1.04 | .93 .98 1.01 1.02 | 5.5 8.1 12.0 .56 | .85 .89 .90 9.0 | 3.0 3.0 1.2 1.2 | 8.7 10 18 13 | .88 .96 1.01 1.03 | .08 .39 4.4 4.3 |
| 1280..2560 | 29 | .93 .98 1.00 1.00 | .95 .99 1.01 1.01 | 11.9 14.4 15.6 .42 | .90 .92 .92 6.5 | 8.7 9.3 4.3 1.3 | 20 27 34 75 | .93 .98 1.00 1.01 | .11 .45 4.4 4.1 |
| 1e4..3e4 | 175 | - | .97 1.00 1.00 1.00 | 58 63 83 .40 | - | - | - | - | - |
| 1e5 | 324 (L, DH: 31) | .98 1.00 1.00 1.00 | .98 1.01 1.01 1.01 | 94 105 119 .45 | (4.8 6.4 9.5) 8.5 | 447 666 757 1.7 | 3e2 to 2e3 | - | - |
| 1e7 | 188 | .99 1.00 1.00 1.00 | - | - | .96 .95 .93 6.5 | 4e3 to 1e4, 2.3 | 2e3 to 1e4 | - | - |
| 1e8 | 92 | .99 .98 .99 1.00 | - | - | .98 .95 .96 5.8 | 1e4 to 4e4, 175 | 5e3 to 4e4 | - | - |
| 1e9 | 12 | 1.43 1.04 1.02 1.01 | - | - | - | - | - | - | - |

Reading:
1. Zeta and L: the ratio lies between 0.64 and 1.18 for 10 <= T <= 2560 (x = 0.05: 0.64 rising to 0.93 for zeta) and is 0.98 to 1.00 from 1e5 to 1e8 with 92 to 451 independent windows. This is the classical mean-square statement for log zeta at fixed sigma > 1/2 (Bohr-Jessen, Selberg); the value 1.43 at x = 0.05, T = 1e9 comes from 12 windows (sampling standard deviation about 40%). No run at 1e10 (a window is 7.98e4 long).
2. Sign twist: 0.82 to 1.03 from 40 upwards, indistinguishable from zeta. The variance reads abs(Lambda(n))^2 only. A control passes.
3. T-NR on the lines to the left of its zeros (x <= 0.2): 0.40 to 1.00 below 2560 (zeta: 0.64 to 1.05), zeta-like; at 1e7 and 1e8, where the window length is constant inside a sub-band, 0.93 to 0.98 against zeta's 0.98 to 1.00. Its zeros to the right of the line give J a mean drift of -2pi per 5.72 units (the count of zeros to the right, by the argument principle), which the variance does not see; the bracketed values at 1e5 (and 14 to 28 at 1e6) are that drift multiplied by the quantised window length, an estimator artefact. At x = 0.5 (to the right of its zeros) the ratio is 2.7 to 14: the phase of the single local factor at q = 3.
4. Heat: zeta-like until the band that contains the first off-line zero (tau = -0.1: 0.93 to 1.11 through 160..320, 3.0 in 320..640, zero at 415.26; tau = -0.5: 0.89 to 1.25 through 40..80, 3.7 to 5.3 in 80..160, zero at 111.69).
5. E_a: 0.02 to 0.45 on lines left of 1/2 + a and 3.4 to 4.9 on lines right of it, from the band containing 14.13; no window exists below.
6. DH: on Re s = 1 the ratio is 0.18 to 0.56 in every band, 0.39 to 0.45 with 119 to 175 windows. The cause is the first Dirichlet coefficients: log DH = kappa 2^-s - kappa 3^-s + ..., abs(a(2)) = abs(a(3)) = 0.284 instead of 1; this is a statement on the edge of absolute convergence. Inside the strip (x <= 0.2) the ratio is 0.36 to 0.74 in the three bands below 85.7 against 0.64 to 1.09 for zeta and L, with 2 to 5 windows: suggestive, not significant; from the band 80..160 it is 3 to 119 (jumps of the phase at the zeros to the right of the line).
7. Finite a: the mean of sech^2 over the band falls with height (pair (0.2, 0.1): 0.98 at T = 10, 0.72 at 2560, 0.45 at 1e5, 0.11 at 1e9; pair (0.1, 0.05): 0.99, 0.89, 0.77, 0.49). B_a/(2a) saturates once a log t is of order 1, so at fixed a its variance ratio cannot stay in a band for zeta itself. Measured ratios for zeta below 2560: 0.30 to 0.42, 0.56 to 0.73, 0.69 to 0.90, 0.60 to 0.76 for the four pairs; from 1e4 upward the estimator is not valid for this series (non-zero mean times the quantised window length) and the entries are withheld.

Why not a survivor: two controls pass (sign twist; T-NR inside the strip); heat and E_a fail only where their zeros are; DH below its zeros fails on the 1-line through coefficient size.

### 4.3 Combination 3 (shear x visualization): closed

First ordinate with W < 0 against the first off-line zero to the right of the line:

| object | first W < 0 on sigma = 0.51 / 0.55 / 0.7 | status | zero to the right | lead |
|---|---|---|---|---|
| DH | between 85.412 and 85.413 / 85.416 and 85.417 / 85.481 and 85.482 | ball | 0.80852 + 85.69935 i | 0.29 / 0.28 / 0.22 |
| E_a, a = 1/8 | 14.010..14.011 / 14.020..14.021 / none (line right of the zeros) | ball | 0.625 + 14.13473 i | 0.12 / 0.11 |
| E_a, a = 1/4 | 13.886..13.887 / 13.90 / 13.985..13.986 | ball (0.55: grid) | 0.75 + 14.13473 i | 0.25 / 0.23 / 0.15 |
| T-NR | 8.192..8.193 / 8.20 / 2.522..2.523 (the band 4..10 does not contain the first zero; the line 0.7 was scanned from 1.1) | ball | 0.90375 + 2.85960 i, + 8.57880 i | 0.39 / 0.38 / 0.34 |
| heat -0.5 | 111.46 / 111.47 / 111.56 | grid, float64 | 0.74296 + 111.69423 i | 0.23 / 0.22 / 0.13 |
| heat -0.1 | 415.24 / 540.44 / 1329.10 | grid, float64 | 0.52156 + 415.25628 i (next 0.56092 + 540.470 i) | 0.02 / 0.03 |
| Liouville | first grid point of every band | - | poles of F at the zeta zeros on the 1/2-line | - |
| zeta | none in 7.6e7 points to 1.00013e10 (min over each band of Re xi'/xi on 0.51 / 0.55 / 0.7: 0.0011 / 0.0053 / 0.021 at t near 10; 0.22 / 1.11 / 4.1 at 1e10) | theorem 2.1 with the verified height; float64 screen above 1e5; exact midpoints below 2560 | - | - |
| L(s, chi_5) | none in 1.8e6 points to 1.004e6 | float64 screen above 2560 | - | - |

Fractions of the grid with W < 0 (sigma = 0.55, 0.6, 0.7, 0.8, 0.9, 1): DH 0.7 to 1.9%, 0.6 to 1.4%, 0.4 to 0.8%, 0.07 to 0.23%, 0, 0 in every band from 80 to 1e6. T-NR: 4.4%, 4.6%, 5.1%, 5.2%, 1.2%, 0 at 80..160, falling to 0, 0, 0, 0.3%, 0.7%, 0 at 1e8, where the minimum of Re F'/F on the lines 0.51, 0.55, 0.7 is positive (0.057, 0.27, 0.086). Heat tau = -0.1: 0.75% at 1280..2560 rising to 13.6% at 1e8 on sigma = 0.55.

Re f < 0 (uncompleted): zeta first on sigma = 0.55 at 29.86 (ball: Re zeta(0.55 + 29.85 i) = +0.0034, Re zeta(0.55 + 29.86 i) = -0.0015), on 0.6 at 43.58, 0.7 at 61.11, 0.8 at 110.55, 0.9 at 1379.38, on 1.0 at 1267065.14 inside the sampled bands (the classical first occurrence 682112.9 lies between bands). Fractions for zeta at 1e10: 13.7%, 7.9%, 2.5%, 0.51%, 0.03%, 0. L: first at 12.03 on 0.55; 12.0%, 6.3%, 1.5%, 0.2% at 1e6. DH: first at 21.78; 10.2%, 6.2%, 2.4%, 0.4% at 1e6. The "zeta 0%" of the Selberg comparison holds only for t < 29.86; the fraction is the distribution of arg zeta and does not separate zeta from DH.

Reading. By 2.1 the W-part is verified height in another form and, by 2.1 (ii), weaker than it: a zero at horizontal distance d from the line is invisible once (1/2) log(t/2pi) > 1/d. T-NR, which has an off-line zero pair every 5.72 units at every height, has zero failures on the lines sigma <= 0.7 at T >= 1e8. Every onset recorded for a control lies 0.02 to 0.39 below the ordinate of an off-line zero; none is earlier.

### 4.4 Combination 4 (bridge x proportion): closed

Failures per unit height on Re s = 1/2 + a, a = 0.01 / 0.05 / 0.2:

| band | zeta | L | DH | E_a 1/8 | E_a 1/4 | T-NR | heat -0.1 | heat -0.5 | Liouville |
|---|---|---|---|---|---|---|---|---|---|
| 10..20 | 0 | 0 | 0 | .10 .10 0 | .10 .10 .10 | .10 .10 .20 | 0 | 0 | .50 .40 .40 |
| 40..80 | 0 | 0 | 0 | .38 .38 0 | .38 .38 .38 | .15 .15 .15 | 0 | 0 | .65 .60 .45 |
| 80..160 | 0 | 0 | .025 .025 .013 | .46 .46 0 | .46 .46 .46 | .11 .13 .15 | 0 | .025 .025 .013 | .73 .61 .46 |
| 1280..2560 | 0 | 0 | .055 .051 .025 | .90 .90 0 | .87 .87 .90 | .065 .066 .096 | .037 .030 .005 | .21 .21 .19 | .93 .89 .74 |
| 1e5 | 0 | 0 | .092 .085 .027 | - | - | (1e6: 6e-5 9e-5 .0036) | (1e6: .41 .40 .20) | (1e6: .25 .25 .25) | - |
| 1e8 | 0 | - | - | - | - | 0 0 0 | .59 .58 .46 | .24 .24 .23 | - |
| 1e9, 1e10 (contiguous) | 0 | - | - | - | - | - | - | - | - |

First failures of DH: 85.413, 85.417, 85.482 (ball brackets of section 4.3). The failure rate of E_a (0.9 per unit height at 2560) is the zero density N'(T) = log(T/2pi)/(2pi), one failure per zero pair to the right of the line. Zeta: 0 failures on the contiguous grids over 2.9e6 units of height, the top window being 1.0001e10 to 1.00013e10 (step 0.05, float64 screen).

Reading. By 2.2 the count is the number of intervals with W < 0 on three lines, so the classification is that of combination 3. The proportion statement "the count per window equals the winding of R_a within 1" is equivalent to: no zero with beta > 1/2 + a close enough to the line; for a fixed a and growing height it is passed by T-NR. The direct count of pencil zeros against the winding was not computed separately (it is determined by the sign pattern of theta_a').

## 5. Why none is a survivor (per the task definition)

| # | zeta passes at every size | every control fails early or without resolving zeros | uses all primes | verdict |
|---|---|---|---|---|
| 1 | yes (band, to 1e10) | no: T-NR (zeta's mollifier), heat, unimodular twist stay inside a fixed factor; DH indistinguishable below 85.7 and within 1.6 at 1e6 | yes | closed |
| 2 | yes for a -> 0 (to 1e8 with adequate statistics); no for fixed a | no: sign twist passes; T-NR passes in the strip; heat fails only at its zeros; DH early failure is on Re s = 1 | yes, but only through abs(Lambda)^2 | closed |
| 3 | W: yes (theorem). Re F < 0: no (from t = 29.86) | no: every onset is 0.02 to 0.39 below an off-line zero; T-NR passes on sigma <= 0.7 at 1e8 | no arithmetic in the statistic | closed |
| 4 | yes (theorem) | as 3 | no arithmetic in the statistic | closed |

Lessons for the generator: (a) any statistic that is a sign of Re F'/F on a line to the right of 1/2 is covered by 2.1 and reads only zeros within about 2/log t of the line; (b) second-moment statistics of arg F or of a mollified F at fixed length T^(1/2) are blind to the sign twist and to a change of one local factor when the mollifier is not adapted, and see DH only through coefficient size; (c) the unimodular height translate passes every vertical-line statistic by identity.

## 6. Weakest steps

1. Above height 2560 every number comes from float64 engines (validated pointwise to 1e8, by three ball spot values at 1e9, not at 1e10). The zero counts of W < 0 for zeta there are consistent with theorem 2.1 and do not rest on the screen; the moments and variances do.
2. The T2 estimator: window half-widths are rounded to the coarse grid, sub-bands are detrended separately, and for series with non-zero mean (B_a, and objects with zeros to the right of the line) the rounding inflates the variance. The a -> 0 values for zeta and L are unaffected; the large control values are lower bounds on "outside the band" in meaning only. Bands below T = 80 have 2 to 5 independent windows and the band at 1e9 has 12.
3. T1 uses one mollifier shape (1 - log n/log y) and the truncated Dirichlet inverse; no optimisation over mollifiers was made for DH, and the reference constants 3 and 4/3 are quoted, not re-derived. The conclusion drawn (no separation below the first off-line zero; fixed factor for T-NR with mu) does not depend on the constants.
4. Heat values are a float64 convolution (checked at one point to 3e-8) and the off-line zero list is the battery's (MEASURED, not certified complete); heat onsets are grid values with step 0.01 to 0.02.
5. Negative excursions narrower than the grid step can be missed (T-NR on sigma = 0.9, where the zero is 0.0038 to the right): fractions on that line are lower bounds.
6. GPU 1 could not be used (memory taken by other jobs at launch), so the top contiguous window at 1e10 is 3.2e5 long and T2 was not run there.

## 7. Files

- `RESULT.md` (this file), `TABLES.md`, `rows.json`
- `sfs.py`, `post.py`, `validate.py`, `onset.py`, `recheck_re.py`, `recheck_lib.py`, `recheck.py`, `binv.py`, `driver.py`, `prof.py`, job lists `jobs*.txt`, `run_local*.sh`
- `out/` (108 band files with logs), `validate_local.json`, `validate_server.json`, `crosscheck_per_vs_arb_1280.json`, `onset.json`, `recheck_re.json`
- Server copy of code and outputs: `~/rh-push/s1-shift-field-spectra/`; unit logs `~/rh-push/logs/rh-s1sfs-*.log`. All units stopped.
