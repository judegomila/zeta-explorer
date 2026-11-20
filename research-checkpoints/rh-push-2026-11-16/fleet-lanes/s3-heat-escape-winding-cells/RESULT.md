# s3-heat-escape-winding-cells: screening of four heat-flow combinations

Lane `s3-heat-escape-winding-cells`, 2026-11-19. Screening arm. Labels: PROVED (short argument here or in the cited lane), CLASSICAL,
MEASURED (Arb midpoints at the stated precision; quadrature and grid errors are not enclosed unless a line says "isolated"), STRUCTURAL
(follows from the definition of the control), NOT RUN. No claim about RH or Lambda. No bound moves.

## 0. Verdict

Four combinations screened. **Survivors: 0.**

| # | combination | what the statistic reads | class |
|---|---|---|---|
| 1 | backward escape envelope of H_{-tau} | the gamma factor (degree, conductor) and the Bohr lift of the damped coefficient series; at tau >= 4 the first coefficients; at tau = 0.25 for DH its own off-line zeros | coefficient pinning (same reading as `s2-weil-coefficient-rigidity` (1)); verified height in the small-tau limit |
| 2 | vortex slab G = H_t + i H_t' | the position (2 gamma_off, y^2/2) of each off-line pair, to within 0.15 mean spacings in x | local: verified height written in the (t, x) plane |
| 3 | collective attraction / Poisson floor | the local count of real zeros; it is positive for every list of real zeros | T-NR passes with its off-line zeros; DH dips exactly at its off-line pairs; rows F3, F5 |
| 4 | sparse verification, walled window | (RH-win) is RH on the window; (W) holds for the controls at suitable abscissae | local window = verified height in local form; the theorem bounds Lambda and excludes no zero at t = 0 |

Every control either passes (T-NR in 3; every control on windows free of its off-line pairs in 2 and 4) or fails only where the test
resolves its off-line zeros (2, 3, 4; DH at tau = 0.25 in 1) or by its gamma factor and first coefficients (1 at tau >= 1). The positive
comparison L(s, chi_-4) does not behave like zeta in test 1 (its envelope differs from zeta's by more than DH's at tau = 16), which
alone shows that test 1 does not read zero location.

## 1. Conventions, objects, code

Polymath normalisation: H_t(z) = int_0^inf e^{t u^2} Phi(u) cos(zu) du, d_t H = -d_z^2 H, z = x + iy, s = (1 + iz)/2, so a zero
beta + i gamma of the function corresponds to z = 2 gamma + i(1 - 2 beta) ("z units": x = 2 gamma, y = 2 abs(beta - 1/2)). L := log(x/4 pi).
For a general completed function Xi_f (entire, Xi_f(s) = Xi_f(1 - s), real on the line): H_0^f(z) = Xi_f(1/2 + iz/2) and
H_t^f(z) = E H_0^f(z + i sqrt(2t) N), N standard normal, for t of either sign (CLASSICAL; this is the Gaussian-convolution node for t < 0).

Functions (file `hk.py`):

| code | function | off-line zeros |
|---|---|---|
| zeta | xi(s) | none known |
| chi4 | (4/pi)^{s/2} Gamma((s+1)/2) L(s, chi_-4) (positive comparison) | none known |
| dh | (5/pi)^{s/2} Gamma((s+1)/2) f(s), f the Davenport-Heilbronn function | 84 pairs with gamma < 2000 (table of `c12-control-battery-harness`, copied as `zeros_DH.json`) |
| tnr | xi(s)(2 cosh((s - 1/2) log 3) + 2.2) | 1/2 +- 0.40375 + i(2k+1) pi/log 3: z = (k + 1/2) 11.4384 +- 0.80751 i |
| ea | xi(s + a) xi(s - a), a = 0.1 | every zero: z = 2 gamma_n +- 0.2 i |
| heat:0.1 | zeta kernel started at time -0.1: H^heat_t = H_{t - 0.1} | 41 pairs with gamma < 2000 (battery table, `zeros_HEAT--0.1.json`) |
| sign twists, unimodular twist | Dirichlet coefficients lambda(n), mu(n), a random completely multiplicative sign, a random completely multiplicative phase | no functional equation: used in test 1 only (coefficient side); not applicable to 2, 3, 4 (no real entire H_t) |

Validation (`validate.py`, all PASS): functional equation of the five completed functions to 1e-28 and reality on the line to 1e-29;
f_DH(0.808517 + 85.699348 i) = 6e-7; H_t, H_t', H_t'' from the Gauss-Hermite evaluator against the defining integral (mpmath, 30 digits)
at t = 0.2, 0.5, 1e-3, -0.1 and at a complex point: relative differences 1e-16 to 4e-13. The contour and the series evaluators of the
damped Dirichlet series agree to 1e-15 (zeta, tau = 4: rightmost zero -0.267260225007 from both). The first DH pair lands at
t* = 0.176505, the value tau* = 0.1765 of map row G7.

Where things ran. Server (through `rhrun`, units of 1 to 8 cores, at most 8 cores in total at any time, memory limits 4 to 12 GB per unit): Poisson floors on 1.0e8 zeta
zeros and on the conductor-5 lists, the gap statistics, the zeta, chi4 and DH box windings, the zeta window at X = 1e9 with its walls.
The server ran at load average 110 to 150 on 48 cores during the run; each unit received about one core whatever its quota, and
Arb zeta there was 2.5 to 3 times slower than on the Mac. For that reason the following ran on the Mac (each process under
`scripts/memcap.sh 8`): test 1 complete (samples to height 5e4, analysis, direct checks), the pair tracking, the control boxes for
T-NR / E_a / heat, the zeta windows at X = 1e12 and 1e14 with their walls. The window at 1e12 was started on the server, did not finish in 40
minutes, was stopped and rerun on the Mac. GPU: not used (nothing here is GPU-shaped except the sums already replaced by FFTs).
All server units of this lane are stopped (section 7).

## 2. Combination 1: backward escape envelope

**Nodes.** backward-flow-escape-law + gauss-conv-equals-negative-time-flow + ht-conjugate-closure-all-t.

**Finite consequence tested.** For each function f and tau in {0.25, 1, 4, 16}: the zeros of H^f_{-tau} with x <= 1e5 that lie highest
above the real axis, the offset eta - (tau/2) log(q x/4 pi) of that envelope, and whether the offset is a function of the Dirichlet
coefficients. Survival would mean: zeta and L(chi) share an envelope that the controls miss for a reason other than their gamma
factor, their first coefficients, or their own off-line zeros.

**Reduction used (PROVED in `b-escape-law`, Lemma R, for zeta; the same computation for a general gamma factor; checked here
numerically for each function).** With g = log of the gamma-type factor and s_eff(z) = s + i tau g'(z):

    H^f_{-tau}(z) = T#(z) D^f_tau(s_eff(z)) (1 + O(L^2/x)),   D^f_tau(s) = sum_n a_f(n) exp(-(tau/4) log^2 n) n^{-s}.

Re s_eff = (1 + eta)/2 - (d tau/4) log(q x/4 pi) + O(1/x) for degree d and conductor q in this normalisation (q = 1 zeta, 4 chi4, 5 DH,
9 T-NR after the factor 3^{s-1/2} is put into the gamma side; d = 2 for E_a). So the envelope is

    eta_max(x) = (d tau/2) log(q x/4 pi) + 2 sigma+_f(tau) - 1,   sigma+_f(tau) = sup{Re s : D^f_tau(s) = 0}.

D^f_tau is an absolutely convergent Dirichlet series in the whole plane, so by Bohr's theorem (CLASSICAL) sigma+ is the supremum of
sigma at which the lift F(sigma, theta) = sum a(n) g_n n^{-sigma} prod_p e^{-i v_p(n) theta_p} has a zero on the torus of primes:
a function of the coefficients alone. For a completely multiplicative unimodular twist the lift is a translate on the torus, so
sigma+ is unchanged (PROVED, one line). For non-negative multiplicative coefficients the zero at theta_p = pi gives the
lower bound sigma_L = largest real root of sum lambda(n) a(n) g_n n^{-sigma}.

**Computation.** Samples of the series factor on Re w = 1.25 (1.35 for E_a), step 0.05, Arb 64 bit: zeta and T-NR to height 5e4
(1,000,001 samples), E_a to 2e4, DH and chi4 to 1e4 (Hurwitz cost). D_tau on a (sigma, t) grid by FFT convolution with the complex
Gaussian, zeros by cell winding numbers, Newton refinement of every zero in the top three rows; for tau = 4, 16 also directly from the
series to t = 5e4 for zeta, DH and four twists. Zeros found in the scanned bands: between 1,100 and 51,767 per run (51,767 for zeta at tau = 0.25, T = 5e4).
Coefficient-only suprema: `bohr.py` (bisection with minimum-norm Newton on the torus of primes <= 23) and `bohr_climb.py`
(continuation from a measured zero, primes <= 31 or 61). Direct check on the true H_{-tau}: for 3 top zeros per (function, tau), the
model point z = s_eff^{-1}(zero of D) is refined by Newton on H_{-tau} evaluated by trapezoid sums of Arb values on a horizontal contour
(240 bit); 60 zeros in all.

**Results (MEASURED).** sigma_max(T) = largest real part of a zero of D_tau with 0 <= t <= T (x = 2T); "coeff. sup" = coefficient-only value.

| tau | function | T | sigma_max(T) | coeff. sup (Bohr / sigma_L / continuation) | sigma_abs (no zero to the right, PROVED) | offset 2 sigma_max - 1 |
|---|---|---|---|---|---|---|
| 16 | zeta | 5e4 | -2.5846 | -2.58453 / -2.58453 | -2.5411 | -6.169 |
| 16 | Liouville, random sign, random phase twists | 5e4 | -2.5846 each | equal to zeta's (Bohr) | -2.5411 | -6.169 |
| 16 | mu(n) (sign twist on prime powers: a(4) = 0) | 5e4 | -2.5627 | -2.56269 | -2.5620 | -6.125 |
| 16 | T-NR | 5e4 | -2.0928 | -2.09276 / -2.09276 | -2.0721 | -5.186 |
| 16 | E_a | 2e4 | -1.6412 | -1.64104 / -1.64104 | -1.6047 | -4.282 |
| 16 | DH | 5e4 | -4.0350 | -4.03502 | -4.0349 | -9.070 |
| 16 | L(chi_-4) | 1e4 | -4.3606 | -4.36056 | -4.3604 | -9.721 |
| 4 | zeta | 5e4 | -0.2316 | -0.22854 / -0.22849 | 0.2103 | -1.463 |
| 4 | Liouville / random sign / random phase | 5e4 | -0.2375 / -0.2378 / -0.2321 | equal to zeta's (Bohr) | 0.2103 | |
| 4 | mu(n) | 5e4 | -0.0382 | >= -0.0312 | 0.0685 | |
| 4 | T-NR | 5e4 | 0.6501 | 0.65133 | 0.8829 | 0.300 |
| 4 | E_a | 2e4 | 0.5416 | 0.54397 | 1.0099 | 0.083 |
| 4 | DH | 5e4 | -0.6528 | -0.65064 | -0.6181 | -2.306 |
| 4 | L(chi_-4) | 1e4 | -0.7462 | -0.73758 | -0.6727 | -2.492 |
| 1 | zeta | 5e4 | 0.4546 | >= 0.5206 | 1.2211 | -0.091 |
| 1 | T-NR | 5e4 | 1.1640 | >= 1.1799 | 1.8190 | 1.328 |
| 1 | E_a | 2e4 | 0.9436 | >= 1.0057 | 1.9254 | 0.887 |
| 1 | DH | 1e4 | 0.4929 | >= 0.5324 | 0.6751 | -0.014 |
| 1 | L(chi_-4) | 1e4 | 0.3171 | >= 0.3981 | 0.6413 | -0.366 |
| 0.25 | zeta | 5e4 | 0.6367 (0.5213 at T = 500, 0.5659 at 5e3) | not computed | 1.5750 | 0.273 |
| 0.25 | T-NR | 5e4 | 1.1072 | not computed | 2.1104 | 1.215 |
| 0.25 | E_a | 2e4 | 0.9591 | not computed | 2.2240 | 0.918 |
| 0.25 | DH | 1e4 | 0.8175 (0.7589 at T = 500) | not computed | 1.1563 | 0.635 |
| 0.25 | L(chi_-4) | 1e4 | 0.5861 | not computed | 1.1319 | 0.172 |

Direct check on the true H_{-tau} (all 60 zeros confirmed): abs(z_true - z_model) between 1.6e-6 and 2.6e-4 at tau = 0.25 and 1,
3.6e-4 to 5.2e-3 at tau = 4, 5.4e-3 to 8.2e-2 at tau = 16, at heights x from 1.2e4 to 1.0e5. Examples: zeta, tau = 1: zero of H_{-1} at
x = 96729.4322, eta = 4.37331; tau = 0.25: x = 78543.5487, eta = 1.32128 (outside the critical strip); tau = 16: x = 99715.4232,
eta = 65.6618; DH, tau = 1: x = 17123.9847, eta = 4.37677; E_a, tau = 1: x = 30776.4668, eta = 8.69071 (degree 2: slope tau log, not
(tau/2) log); T-NR, tau = 1: x = 96729.6153, eta = 6.90090 (conductor 9).

**Reading.**

1. tau >= 4. The measured envelope offset equals the coefficient-only supremum to 5e-4 at tau = 16 and to 3e-3 to 1e-2 at tau = 4, for
   every function, DH included. The terms of the zeta lift at the supremum for tau = 16 are 1 - 0.8767 - 0.1369 + 0.0165 - 0.0020 + 0.0003
   (n = 1..6): a(2) and a(3) fix sigma+ to 0.02, a(4) to 0.002. The three completely multiplicative twists have zeta's value; mu(n) differs
   through a(4) = 0. DH (a(2) = 0.2841) and L(chi_-4) (a(2) = 0) sit 1.45 and 1.78 to the left of zeta: the honest L-function is farther
   from zeta than DH is.
2. Leading order. The slope of the envelope is (d tau/2) log(q x/4 pi): it differs between zeta, DH (q = 5), T-NR (q = 9) and E_a (d = 2)
   by the gamma factor alone. The three examples above satisfy eta = (d tau/2) log(q x/4 pi) + 2 sigma - 1 to the stated distances.
3. tau = 0.25. The offset is still rising with T at T = 5e4 for every function (the lift involves many primes and sigma_abs is far
   to the right). Zeta and L(chi_-4) are at 0.57 and 0.56 at T = 5e3, DH at 0.82. The DH value is produced by its own off-line zeros:
   the 8 highest zeros of D^DH_0.25 with t < 2000 lie within 0.07 in t of the DH off-line zeros with the largest beta
   (240.405 / 0.8695, 85.699 / 0.8085, 1092.454 / 0.8546, 783.653 / 0.8530, 857.296 / 0.8561, 531.280 / 0.8470, 411.797 / 0.8159,
   1264.196 / 0.8305), each moved left by 0.07 to 0.15 by the Gaussian. As tau -> 0 the statistic is sup beta over the zeros to height
   T: the zero set itself.

**Decision asked in the task.** This is the same reading as the coefficient pinning closed in round 2 (`s2-weil-coefficient-rigidity`,
combination 1: "a property of the pair (gamma factor, coefficients), which holds equally for DH around its own coefficients"). The
envelope is determined by the gamma factor and, for tau >= 4, by a(2), a(3), a(4); a control's envelope differs from zeta's exactly
as those data differ. At tau = 0.25 the DH envelope differs through its off-line zeros at their own heights. **Class: CLOSED
(coefficient pinning; verified height as tau -> 0).** Existing rows: F1, F2.

Not done as specified: the zero sets of H_{-tau} were not computed by the argument principle on boxes of the true H_{-tau} over the
whole range x <= 1e5; they were computed for D_tau on the whole range and confirmed on the true function at 60 zeros. The
coefficient-only supremum was not computed at tau = 0.25.

## 3. Combination 2: vortex slab

**Nodes.** window-winding-monotone + rh-szc-vortex-slab + genuine-theta-box.

**Finite consequence tested.** G(t, x) = H_t(x) + i H_t'(x) on boxes [t_i, t_{i+1}] x [x, x + 20] with
t_i in {1e-4, 1e-3, 1e-2, 0.05, 0.1, 0.2, 0.3, 0.5}: the winding number of G on the boundary (number of vortices = real double zeros =
landings of conjugate pairs) and the real-zero count W(t) on every row. For each control, each off-line pair is followed from t = 0
(Newton in z, predictor dz/dt = H''/H') to its landing (t*, x*), found by Newton on H = H' = 0 in (t, x) (residuals below 6e-11).
Survival would mean a vortex of a control in a box far (in x) from every off-line pair, or at a time unrelated to y^2/2.

**Results (MEASURED; Arb 80 bit, 28 to 32 Gauss-Hermite nodes, 16 points per mean spacing on rows, 13 per side segment).**

| function | windows | x range | boxes | boxes with winding != 0 | sum of windings | matches |
|---|---|---|---|---|---|---|
| zeta | 215 | [0, 4000] contiguous; 3 windows each at 1e4, 2e4, 4e4, 7e4, 99940 to 1e5 | 1505 | 0 | 0 | |
| L(chi_-4) | 20 | [0, 400] | 140 | 0 | 0 | |
| DH | 60 | [0, 1200] | 420 | 15 | 15 | 15 off-line pairs with 2 gamma < 1200; 14 of the 15 tracked landings (t*, x*) fall in the box that carries the winding; the 15th (t* = 0.00051) is assigned to the next time box of its window, because at the row t = 1e-3 the two new zeros are 0.06 apart, below the row step |
| T-NR | 20 | [0, 400] | 140 | 28 | 35 | 35 pairs with x < 400 |
| E_a | 10 | [20, 220] | 70 | 10 | 33 | 33 zeta zeros with 2 gamma in the range, all in t in [0.01, 0.05] (y^2/2 = 0.02) |
| heat:0.1 | 20 | [800, 1200] | 140 | 3 | 3 | the 3 pairs of the table in the range |

In boxes with zero winding the row counts change only through the sides (81 such boxes for zeta): W(t) is constant up to boundary
flux, as the monotonicity node states. Largest phase step on any boundary: 2.86 (zeta); 3.12 (controls, on a row next to a landing,
where the assignment of the vortex to one of two adjacent boxes depends on the grid; the sums over t are not affected).

Reach of an off-line pair (tracked landings, all converged):

| control | pairs | x range | y0 range | max abs(x* - x0) | in mean spacings | t* / (y0^2/2) |
|---|---|---|---|---|---|---|
| DH | 40 (gamma <= 1274) | 171 to 2548 | 0.032 to 0.739 | 0.215 | <= 0.10 | 0.778 to 1.000 |
| heat:0.1 | 20 | 831 to 2942 | 0.043 to 0.433 | 0.093 | <= 0.04 | 0.925 to 1.000 |
| T-NR | 29 (k = 0..19, 100..102, 1000..1002, 8740..8742) | 5.7 to 100000.2 | 0.8075 | 0.464 | <= 0.15 | 0.962 at x = 5.7 down to 0.25 to 0.43 at x = 1e5 |
| E_a | 12 (n = 1..10, 100, 1000) | 28 to 2839 | 0.2 | 0.057 | <= 0.03 | 0.932 to 0.999 |

**Reading.** The vortex of an off-line pair sits at x within 0.46 (at most 0.15 mean spacings) of the pair's abscissa and at time
t* <= y0^2/2 (PROVED bound: (y^2)' <= -2), within 22% of it for DH. The reach is O(1) and does not grow with height (T-NR followed to
x = 1e5). A box with zero winding states that no pair with abscissa in the window (up to the reach) lands in the time interval:
it is verified height for that window, written in the (t, x) plane. Zeta, L(chi) and every control pass on every window free of
off-line pairs. **Class: CLOSED (local).** Existing row: G7.

## 4. Combination 3: collective attraction and Poisson floor

**Nodes.** collective-lambda-certificate + dbn-max-gap-collapse-time + dbn-uniform-poisson-floor.

**Finite consequence tested.** For the highest zero z = x + iy: (y^2)' = -2 - 4 y^2 kappa(x, y) - (terms from other off-line zeros, >= 0 for
the highest one), kappa(x, y) = sum over real zeros r of 1/((x - r)^2 + y^2) = P(x, y)/y. For zeros in abs(Im z) <= Delta the certificate
needs kappa(x) := kappa(x, Delta) >= kappa > 0 and gives the collapse time B(kappa, Delta) = log(1 + 2 kappa Delta^2)/(4 kappa) (eta -> 0).
Computed: kappa(x) on a grid of step 1/8 over the whole list (FFT convolution, bin 1/32, kernel cut at 200 with smooth-density
tails; exact sums below x = 4000), its ratio to the smooth value pi rho(x)/Delta, rho = log(q x/4 pi)/(4 pi); and the largest gap.

**PROVED (one line).** kappa(x, y) > 0 for every x and every non-empty list of real zeros: each term is positive. The fail criterion
of the task ("kappa <= 0 on an interval") cannot occur for any function. The content of the certificate is a quantitative lower bound,
which is a statement about the local count of real zeros.

**Results (MEASURED; lists of lane `s1-zero-flow-dynamics` read from the server: 100,116,297 zeta zeros to height 4.27e7; 847,701
on-line DH zeros and 946,483 zeros of L(chi mod 5) to height 5e5).** Delta = 1.

| x range | zeta: min kappa | zeta: min ratio | zeta: std of ratio | B(inf kappa above x_lo) | L(chi mod 5): min ratio | DH: min ratio | DH: mean ratio |
|---|---|---|---|---|---|---|---|
| below 100 | 0.0517 (x = 23.3) | 0.220 | 0.876 | 0.4758 | 0.307 | 0.384 | 0.999 |
| 1e2 to 1e3 | 0.1706 | 0.296 | 0.361 | 0.4302 | 0.404 | 0.191 | 0.946 |
| 1e3 to 1e4 | 0.4452 | 0.386 | 0.217 | 0.3576 | 0.478 | 0.185 | 0.911 |
| 1e4 to 1e5 | 0.7830 | 0.465 | 0.155 | 0.3009 | 0.529 | 0.149 | 0.903 |
| 1e5 to 1e6 | 1.1857 | 0.516 | 0.121 | 0.2563 | 0.582 | 0.159 | 0.895 |
| 1e6 to 1e7 | 1.5562 | 0.548 | 0.099 | 0.2272 | | | |
| 1e7 to 8.5e7 | 2.0281 | 0.592 | 0.085 | 0.1998 | | | |

683,198,122 grid points for zeta; mean ratio 1.00000 in every decade above 1e3 (check of the normalisation and of the tails).
Half R of the largest gap between consecutive real zeros (z units) above x_lo and the collapse time S_R of the maximum-gap corollary
(u_0 = 1, against u_0/2 = 0.5): zeta 6.89 / 0.490 (x >= 10), 2.98 / 0.454 (1e3), 1.97 / 0.413 (1e5), 1.57 / 0.385 (1e7); largest
normalised gap 3.63 at x = 5.7e7. DH: the largest on-line gap does not shrink with height (9.08 at x = 171, 9.97 at 4.1e4, 8.51 at 9.5e5; normalised
3.2, 7.7, 8.7).

Controls:

- **DH.** kappa is positive everywhere. Its dips are the off-line pairs: the 60 lowest minima of the ratio below x = 4000 all lie within
  one mean spacing of an off-line pair of the table (a random x does so with probability 0.082); the ratio at the 84 off-line
  abscissae is 0.196 to 0.483 (mean 0.334) against an overall mean of 0.918; the 40 largest normalised on-line gaps below 4000 each
  contain an off-line pair. The statistic separates DH from zeta by counting the two missing real zeros at each pair.
- **T-NR.** Its real zeros are zeta's (PROVED in `s1-zero-flow-dynamics`, one line), so kappa and the gap statistics are zeta's at
  every x. The premise abs(Im z) <= Delta holds with Delta = 0.80751 at every height (it would fail only for c >= 2 cosh((log q)/2)).
  The certificate therefore applies to T-NR and returns a true statement about it: at its lowest pair kappa(5.72, 0.8075) = 0.0119
  (0.0071 from the zeros with r > 0, 0.0049 from the mirror zeros) gives B = 0.3235, and the measured landing time of that pair is 0.31349
  (isolated-pair value 0.32603). With inf over x >= 23.3 (zeta list,
  Delta = 0.8075): kappa = 0.0522, B = 0.3154; above x = 1e7: B = 0.155. T-NR has an off-line pair in every window of length 11.44 and
  passes. A lower bound on kappa bounds the landing time of off-line zeros; it does not exclude them.
- **Static form.** Using kappa from the real zeros at t = 0 near each pair, the bound B holds for 27 of 29 tracked T-NR pairs and is
  exceeded by 0.6% and 1.3% at k = 10 and k = 19 (t* = 0.22799 against 0.22667; 0.18025 against 0.17796): the real zeros move during the
  collapse and the pair pushes its neighbours away. This is the uniformity over the collapse interval that the open-lemma node asks
  for; it is needed, not a formality. Ratio t*/B: 0.59 to 1.013, median 0.93.
- **E_a.** No real zeros: kappa = 0 identically. Every x is adjacent to an off-line zero.
- **heat.** The on-line lists of the backward-heat family were treated in `s1-zero-flow-dynamics`; by test 1 the premise
  abs(Im z) <= Delta fails for every Delta at large height. Not recomputed.

**Reading.** For zeta the floor exists at every x reached and the normalised minimum rises with height (0.22 to 0.59); the same
holds for L(chi mod 5). The certificate is of the floor-only class of row F5 and gives collapse times 0.48 down to 0.20 on the range
reached, with no converse to zeros (row F3). **Class: CLOSED.** T-NR passes; DH fails only adjacent to its off-line pairs.

Not run: 1e9 zeros (the list available is 1.0e8); extreme-gap lists to 1e13 (no local source; the windows of section 5 at 1e9, 1e12,
1e14 give normalised gaps up to 2.68, 2.80, 2.61).

## 5. Combination 4: sparse verification and walled cells

**Nodes.** mem-local-window-substitution + walled-cell-lemmas-b2-b3 + sparse-verification-theorem-n.

**Source read.** `formalization/paper/lemma-B-two-band.md` sections 0 to 6 and the header of route 6. Hypotheses: (W) H_t(x_w + iy) != 0
for 0 <= y <= 1, 0 <= t <= 0.164 at each wall; (S) abs(y) < 1 for every zero (de Bruijn); (RH-head); (RH-win) every zero with
x_L/2 <= gamma <= x_R/2 on the line; window wider than D_K = 921 (or 1639); floors (F), kernel inequalities (K), (H2). Conclusion of
Theorem B: every zero of H_T is real for T = max(U1, U2) about 0.145, i.e. Lambda <= T.

**Finite form tested.** (a) (RH-win): N(x_R/2) - N(x_L/2) by `arb.zeta_nzeros` (Turing) and isolation of the consecutive zeros on the
line by `acb.zeta_zeros`. (b) (W): the wall ratio R(y, t) = abs(H_t(x_w + iy))/abs(B_0), B_0 = exp(lg(s') + (t/4) alpha(s')^2),
s' = (1 + y)/2 + i x_w/2, alpha = lg' (the Polymath normaliser M_t with the exact gamma factor), on a grid of (y, t) in
[0, 1] x [0, 0.164]; the wall abscissa is chosen among the centres of the six largest gaps near the window end as the one whose
real-axis row keeps one sign with the largest minimum. The grid minimum is MEASURED, not a certificate of (W).

**Zeta (isolated zeros: certified by Arb's Hardy-Z isolation and Turing count; walls MEASURED at 192 bit).**

| X (z units) | window in gamma | zeros in window = isolated on the line | normalised gaps min / max | cost |
|---|---|---|---|---|
| 1e9 | [5e8, 5e8 + 1000] (width 2000 in z) | 2895 = 2895 | 0.107 / 2.677 | 96 s, server, 3 workers |
| 1e12 | [5e11, 5e11 + 500] (width 1000 in z, above D_K = 921) | 1999 = 1999 | 0.051 / 2.799 | 4362 core-s, Mac |
| 1e14 | [5e13, 5e13 + 80] (width 160 in z, below D_K) | 378 = 378 | 0.112 / 2.612 | 5606 core-s, Mac |

| X | left wall x_w - X | R_min | right wall x_w - X | R_min | walled width (z) | (y, t) grid | candidates with a sign-constant real row | accurate bits of R |
|---|---|---|---|---|---|---|---|---|
| 1e9 | 33.11706 | 1.5526 | 1992.13350 | 1.4158 | 1959.0 | 11 x 10 | 4 of 6, 6 of 6 | not recorded (zeta values carry 190 bits at this height) |
| 1e12 | 16.46462 | 1.4797 | 977.73758 | 1.4750 | 961.3 (above D_K = 921) | 11 x 10 | 6 of 6, 5 of 6 | 106 |
| 1e14 | 12.80093 | 1.2734 | 153.98225 | 1.1765 | 141.2 | 5 x 5 | 5 of 6, 5 of 6 | 99 |

Every minimum is at (y, t) = (1, 0.164); the real-axis rows keep one sign. (Raymond's certified walls have R > 3/4 with a different
choice of abscissa; the values here are grid minima at 110 or 25 points.)

At 1e14 the width asked (2000) was not reached: isolation costs about 15 core-seconds per zero there and 4860 zeros would have taken
about 20 core-hours.

Wall abscissae are not arbitrary: a zero of H_t on the real axis moves by a sizeable part of a mean spacing during 0 <= t <= 0.164
(the weights n^{-(t/4) log(x/4 pi)} damp the Dirichlet sum, and the zeros relax toward the zeros of the leading term). The centre of
the largest gap at the left end of the 1e9 window fails: H_t(x_w) changes sign between t = 0.10 and 0.12. In all, 5 of the 36 candidate
abscissae fail in this way (2 at 1e9, 1 at 1e12, 2 at 1e14).

**Controls (MEASURED; fine grid 26 x 42 in (y, t)).**

| control | off-line pairs to gamma = 2000 | largest gap between consecutive pairs (z units) | window used (z) | real zeros in it / main-term count | wall R_min (left, right) | wall through a pair's abscissa |
|---|---|---|---|---|---|---|
| DH | 84 | 160.9 (mean 45.9) | [497.98, 629.67] | 57 / 56.7 | 1.075, 1.336 | 0.0044 at (y, t) = (0.72, 0.008) |
| heat:0.1 | 41 | 392.2 (mean 78.6) | [1523.10, 1866.35] | 134 / 133.9 | 2.964, 3.052 | 0.0015; the real-axis row changes sign |
| T-NR | one per 11.438 | 11.438 | [2010.22, 2016.80] | 2 | 1.344, 0.418 | 0.0018 at (0.8, 0.004) |

**Reading.**

1. The wall certificate succeeds for the controls at suitable abscissae, including DH with five off-line pairs
   (2 gamma = 171.4, 228.3, 333.0, 353.4, 480.8) below the window used. Lemmas B.1 and B.3 then hold for that cell and say what they
   say: the real zeros of the cell stay real. They say nothing about the pairs outside it.
2. The hypothesis that fails for DH, heat:0.1 and T-NR is (RH-win) at the admissible width: no window free of off-line pairs is wider
   than 161, 392 and 11.4 z units, against D_K = 921. In a window of admissible width the count on the line falls short of the total
   count by two per pair, and that is the whole test. (RH-win) is RH on the window: verified height in local form.
3. The theorem does not exclude off-line zeros between head and window, and is not meant to: its conclusion is Lambda <= T. For a
   control whose off-line pairs in the band have small y (the heat family with small tau_0: every pair of the table lands by
   t* <= 0.087 <= tau_0) all hypotheses can hold with off-line zeros present at t = 0, and the conclusion is true for the control. For
   DH nine of the 40 tracked pairs land after 0.145 (latest 0.2306, gamma = 240.40), so for a band containing one of them the band
   barrier (BB1) is false and the input that must fail is (F), the floors near that pair. (F) was not evaluated on a control (the floor
   certificates are zeta-specific computations): NOT RUN.

**Class: CLOSED (the local window is verified height in local form).** Zeta passes at 1e9, 1e12, 1e14; each control passes the wall
test and fails the window test exactly when the window contains one of its pairs.

## 6. Table required by the task

| combination | statistic | sizes reached | zeta | L-function | DH | T-NR | E_a | heat | twists | classification |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 escape envelope | offset 2 sigma+ - 1 of eta_max from (d tau/2) log(q x/4 pi); tau = 16 / 4 / 1 / 0.25 | x <= 1e5 (zeta, T-NR, series twists), 4e4 (E_a), 2e4 (DH, chi4); 60 zeros confirmed on H_{-tau} | -6.169 / -1.463 / -0.091 / 0.273 | chi_-4: -9.721 / -2.492 / -0.366 / 0.172 | -9.070 / -2.306 / -0.014 / 0.635 | -5.186 / 0.300 / 1.328 / 1.215 (q = 9) | -4.282 / 0.083 / 0.887 / 0.918 (d = 2) | is the test object | completely multiplicative: zeta's value; mu: -6.125 at tau = 16 | closed: coefficient pinning; verified height as tau -> 0 |
| 2 vortex slab | winding of H_t + i H_t' on boxes; reach abs(x* - 2 gamma_off); t*/(y^2/2) | zeta 1505 boxes, x <= 1e5, t in [1e-4, 0.5]; 101 pairs tracked | 0 vortices | chi_-4: 0 in 140 boxes | 15 = pairs in range; reach <= 0.215; 0.78 to 1.00 | 35 = pairs; reach <= 0.46; 0.25 to 0.96 | 33 = pairs; reach <= 0.057 | 3 = pairs; reach <= 0.093 | n/a | closed: local |
| 3 Poisson floor | min over x of kappa(x)/(pi rho); certificate time B | 1.0e8 zeta zeros (6.8e8 grid points); 8.5e5 / 9.5e5 conductor-5 zeros | 0.22 rising to 0.59; B 0.476 to 0.200 | chi mod 5: 0.31 to 0.58 | 0.15 to 0.19, all 60 lowest minima at off-line pairs | zeta's values; certificate applies, B = 0.3235 >= t* = 0.3135 | kappa = 0 | premise fails at large height (test 1) | n/a | closed: F3, F5 |
| 4 walled window | zeros on the line vs Turing count in the window; wall ratio R_min | X = 1e9 (2895 zeros), 1e12 (1999), 1e14 (378) | pass at each | not run | walls pass; no pair-free window wider than 161 | walls pass; none wider than 11.4 | not run (every zero off-line) | walls pass; none wider than 392 | n/a | closed: verified height in local form |

## 7. Record of the run

- Server units (all inactive at the end; none left running): `rh-s3hw-c2-1120010429`, `rh-s3hw-A-1120011402`, `rh-s3hw-B-1120011402`,
  `rh-s3hw-C-1120011402`, `rh-s3hw-A2-1120011544`, `rh-s3hw-B2-1120012425`, `rh-s3hw-B4-1120012425`, `rh-s3hw-A3-1120015550`,
  `rh-s3hw-C2a-1120015550`. Three were stopped by this lane with `systemctl --user stop` (c2 and B when the plan was split into smaller
  units; C when the 1e12 window was moved to the Mac); A failed at once on a numpy name and was relaunched as A2. At most 8 cores in
  total were requested at any time. Read-only use of `~/rh-push/s1-zero-flow-dynamics/data/` (zero lists).
- One local slip (Mac, not the server): two local driver scripts of this lane were stopped with a name pattern instead of process ids. The only other
  file with a matching name belongs to a lane that finished six hours earlier; no other process was affected as far as the process
  table shows.
- Arb limitation found: `acb.zeta` at height 5e13 with Re s < 0 returns a ball of infinite radius (midpoint correct). The evaluator
  now uses Xi(s) = Xi(1 - s) to keep Re s >= 1/2; the 1e12 and 1e14 walls were rerun with it and carry at least 99 accurate bits (rounding only).
  Runs at heights <= 5e11 were not affected (78 to 190 accurate bits checked).
- Files: `hk.py` (functions, heat evaluator), `validate.py`, `samples.py`, `escape.py`, `bohr.py`, `bohr_climb.py`, `an1.py` (test 1);
  `vortex.py`, `an2.py` (test 2); `poisson.py`, `gaps.py`, `an3.py`, `an3_tnr.py` (test 3); `window.py`, `c4_controls.py`,
  `c4_tnr.py` (test 4); `run_*.sh` (drivers); `out/` (Mac results), `out_server/` (server results).

## 8. Three weakest steps

1. Test 1 uses the reduction to D_tau for the controls with the error term proved only for zeta in `b-escape-law`; here it is
   supported by 60 direct zeros, not by a proof with constants. sigma_max(T) at tau <= 1 has not converged in T, and the
   coefficient-only supremum is a lower bound there (continuation) and absent at tau = 0.25.
2. Wall ratios and box windings are grid computations on Arb midpoints with Gauss-Hermite quadrature whose error is not enclosed.
   They are evidence that the certificates exist, not the certificates. Only the zero isolations and counts of test 4 are rigorous.
3. The statements "the control passes on windows free of its off-line pairs" rest on the battery tables of off-line zeros to
   height 2000 (not interval certificates; the DH table closes its 200 box counts, the heat table balances the zeta count).
