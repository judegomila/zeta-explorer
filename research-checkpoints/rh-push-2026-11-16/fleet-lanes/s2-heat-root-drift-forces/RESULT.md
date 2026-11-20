# s2-heat-root-drift-forces: screening of four heat-flow / Weil-form combinations

Lane `s2-heat-root-drift-forces`, 2026-11-19. Screening arm. Labels: PROVED (short argument here), CLASSICAL, MEASURED (float64
unless a line says "balls" = python-flint ball arithmetic at the stated precision), STRUCTURAL (follows from the definition of the
control). No claim about RH or Lambda. No bound moves.

## 0. Verdict

Four combinations tested. **Survivors: 0.**

| # | combination | what the finite test turned out to measure | classification |
|---|---|---|---|
| 1 | heat-flow velocity of a zero against the prime-side force | the explicit formula with kernel k_w(x) = int_0^{log X} w(v) sin(xv) dv. Smooth cut-off: a local kernel, all controls with zeros keep the correlation below their first off-line height. Sharp cut-off: each off-line zero enters with weight X^(beta-1/2)/distance; DH and T-NR lose the correlation at every height, including below the first off-line zero (DH) | closed: the sharp-cut-off form is the truncated explicit formula for psi_F(x); zeta's pass at X is implied by verified height H while sqrt X log^2 X < H (X up to about 1e18) |
| 2 | Gaussian-damped Gram form on primon states | G = sum over zeros of e^(-t zeta^2) a(zeta) a(conj zeta)^*. In balls the sign is decided by the dimension: first negative leading block at N = 2 N_on(gamma_off) + 1 to 5 primes for large t; in float64 the negative part is visible only for t gamma_off^2 below about 22 | closed: matrix dimension counts the on-line zeros below the first off-line pair |
| 3 | Weil positivity at support a replayed for each control | onset support a* of negativity follows a* ~ 0.8 to 1.15 x (1/2) log(q gamma_1 / 2 pi) (gamma_1 = lowest off-line zero or pole on the line), and is never below the entry of the first prime power that differs from zeta | closed: support <-> height exchange (primes to e^(2a) ~ q gamma/2 pi); displacement alone forces nothing |
| 4 | Pick pencil of the heat family at n real nodes | n*(eps) = 3.7 N_below(eps) + 4 within +-4, N_below = number of on-line zeros of Xi_eps below its first non-real pair | closed: flow-blind as the source predicted; n* counts zeros below the first non-real pair |

The pattern of the brief holds in all four: the controls separate from zeta when the test has as many degrees of freedom as there are
zeros below the first off-line pair (2, 3, 4), or through the growth X^(beta-1/2) of the coefficients of -F'/F (1, sharp cut-off).

## 1. What was run, where, sizes

| object | size | where |
|---|---|---|
| zeta zeros, window at height 1e9 | 1,020,007 ordinates in [1e9, 1e9 + 3.4e5] (Riemann-Siegel sampler of `s1-zero-flow-dynamics`, copied to `zgen/`; count 1,020,006.5 expected, 4 near-tangent pairs settled) | server, 4 cores, 6 min |
| zeta zeros, first 1.0e8 | list of `s1-zero-flow-dynamics` (read only) | server |
| combination 1, list mode | 1.0e6 zeros in each of four windows (heights 14 to 6.0e5; 1.0e6 to 1.5e6; 4.23e7 to 4.27e7; 1e9 to 1e9 + 3.3e5), prime powers to X = 1e4, 1e6, 1e8 (5,762,859 at 1e8), three weights; margin 1e4 zeros each side plus a closed-form density tail | server, 4 cores |
| combination 1, exact mode | all on-line zeros below 2000 of zeta (1517), DH (1861) and T-NR (1517), V in 160-bit balls from Lambda''/Lambda', X to 1e8 (DH: all n <= 1e8 with its own coefficients) | server |
| combination 2, float64 | N = 20,000 primes (p <= 224,737), dense eigensolve on GPU 1 (cupy), t from 1e-1 to 1e-6, prime side with all prime powers to 1e8 (DH: all n <= 1e8) and zero side | server GPU 1, 2 cores |
| combination 2, balls | first N <= 200 to 700 primes, 2500 to 30,000 bits, LDL^T pivots | Mac |
| combination 3, float64 | supports a = 0.25 .. 9.2 (paper's z-type T = a/2 up to 4.6), prime powers to e^(2a) <= 1e8, Fourier modes to frequency 250 (dimension up to 1467), nine objects | server, 4 cores |
| combination 3, balls | a <= 4, 700 to 1800 bits, frequency 60 to 120 (dimension up to 205) | Mac |
| combination 4 | n = 120 nested real nodes dense in s in (1/2, 4], 4000 bits, 15 values of eps from 0 to 1000 and 7 closed-form objects | server, 4 cores, 75 min |
| heat-family zeros | eps = 1 .. 1000, heights below 120, sign changes plus Newton from a seed grid (not certified complete) | server |

Compute notes. The server ran at load average 120 to 160 on 48 cores and GPU 1 was shared (45 GB in use, 100 % utilisation by another
job), so wall times were several times the idle figures. Not reached: support T = 6 of the task text (a = 12 needs prime powers to
e^24 = 2.6e10; reached a = 9.2, T = 4.6, primes to 1e8); primes to 1e7 as Gram nodes at N = 20,000 were run only for the two t values
of section 4.2. One float64 row failed on GPU memory (HEAT eps = 0.5, t = 1e-3) and was rerun. One unit of this lane
(`rh-s2hr-c1-1119224431`) was stopped by its own 7 GB memory limit while building the DH coefficients to 1e8; it was rerun at 12 GB
after the builder was changed to allocate less.

## 2. Conventions and validation (shared code `code/ctl.py`)

Zeros are written rho = 1/2 + i zeta (zeta real on the line, complex off it). For a completed function with real coefficients,
conductor N, gamma factors Gamma((s + mu_j)/2) and -F'/F = sum Lambda_F(n) n^-s, the explicit formula used everywhere is

    sum_zeta Ahat(zeta) = sum_{poles c} int A(v) 2cosh(c v) dv + (log N - d log pi) A(0)
                          + sum_j int_0^inf [A(0) e^(-2v)/v - e^(-(1/2+mu_j) v) (A(v)+A(-v))/(1 - e^(-2v))] dv
                          - sum_n Lambda_F(n) n^(-1/2) (A(log n) + A(-log n)).

Objects and their prime sides:

| code | object | Lambda_F | used in |
|---|---|---|---|
| ZETA | zeta | Lambda(n) | 1, 2, 3, 4 |
| LCHI5 | L(s, (./5)), real even character | chi(n) Lambda(n) | 2, 3, 4 (positive comparison) |
| LCHI | L(s, chi), chi mod 5 with chi(2) = i (zero list of `s1-zero-flow-dynamics`) | chi(n) Lambda(n) | 1 (positive comparison) |
| DH | Davenport-Heilbronn | from a(n) log n = sum_{d|n} Lambda_DH(d) a(n/d), all n (not supported on prime powers) | 1, 2, 3, 4 |
| TNR | zeta(s)(1 + c q^(1/2-s) + q^(1-2s)), q = 3, c = 2.2 | Lambda(n), and at n = 3^m: log 3 (1 - (-1)^m 3^(m/2) 2cosh(m theta)), theta = arccosh(1.1) | 1, 2, 3, 4 |
| EA-a | zeta(s+a) zeta(s-a), a = 1/8, 1/4, 1/2 | Lambda(n)(n^a + n^-a) | 2, 3, 4 (no on-line zeros: undefined in 1) |
| SGN-LIOU, SGN-R | Lambda(n) -> eps(n) Lambda(n), eps completely multiplicative, eps(p) = -1 or random +-1 (PCG64 seed 121000) | eps(p)^m log p; zeta's archimedean and pole terms (no functional equation) | 2, 3 |
| HEAT eps | F_{-eps}(z) = int e^(-eps u^2/16) kappa(u) e^(zu/2) du (tau = -eps = de Bruijn-Newman time) | none (no Dirichlet coefficients): zero side only | 2, 4 |
| unimodular twist | zeta(s + i alpha) | Lambda(n) n^(-i alpha) | STRUCTURAL: every statistic here is zeta's with all frequencies translated by alpha; passes wherever zeta passes |

Validation of the code on cases with a known answer:

1. Coefficients: sum_{n <= 2e5} Lambda_F(n) n^-3 against -F'/F(3) from the closed forms (balls): DH -0.00141876726670 against
   -0.00141876726662; T-NR, EA-1/4, zeta agree to the truncation (1e-10 to 1e-9).
2. Explicit formula, compact support (combination 3): c^T Q c from the prime side against the sum over zeros for
   f = cos^4(pi x/2a), a = 0.5, 1.5, 3: agreement to the 10 printed decimals for ZETA, DH (1861 on-line zeros and 84 off-line
   pairs of the battery table), T-NR, EA-1/4, EA-1/2 (e.g. DH a = 1.5: 0.0074719485 both; T-NR a = 3: -0.0180710924 both).
3. Explicit formula, Gaussian (combination 2): prime-side Gram matrix against zero-side Gram matrix, 150 primes: max entry
   difference 3e-14 (DH) to 4e-11 (EA-1/4). At N = 20,000 the DH prime-side and zero-side lambda_min agree to four digits at the common t values
   3e-3, 1e-3, 1e-4, and the T-NR ones at 1e-2, 1e-4 (section 4.2). A first version disagreed by 4.6e-6 (zeta) and 2.2e-3 (EA-1/4): alias images of the archimedean kernel under the
   trapezoid rule in the frequency variable; they are removed in closed form.
4. Heat velocity: d gamma/d tau = V/2 at the first three zeros = -0.2898, -0.3775, -0.2929 (source: -0.290, -0.378, -0.293).
   List-based V against the ball value for zeros 1, 51, ..., 1451: max difference 8.4e-4.
5. Explicit formula at height (combination 1): prime-side force against the zero-side kernel sum over 1e4 neighbours, 20,000 zeros:
   correlation 0.999970 to 0.999999 in the windows at 1e6, 4.2e7, 1e9 (X = 1e4, 1e6, 1e8).
6. Pick pencil: lambda_min of the Cauchy-normalised pencil at nodes {1, 2, 4}: 3.2421e-5 (eps = 0), 2.9001e-5 (eps = 1),
   3.0244e-8 (eps = 100); source: 3.2421e-5, 2.900e-5, 3.02e-8. Heat zeros at eps = 0.5: 14.27991, 21.21174, 25.15686 (battery
   table: the same).
7. A defect found and fixed: the ball re-check of combination 3 first returned lambda_min = -5.19e-169 for zeta at a = 3, identical
   at 700 and 1600 bits. Cause: the Gauss-Legendre rule for the archimedean integrals (48 nodes per panel) has error near 1e-169,
   which no working precision removes. With 160 nodes per panel the value is +7.26e-200 and all 155 pivots are positive.

## 3. Combination 1: heat-flow velocity against the prime-side force

Nodes: `zv-theta-root-drift`, `winding-lyapunov`, `window-boundary-influx`.

**Definitions.** V_n = sum' over all other zeros zeta_m of 1/(gamma_n - zeta_m) (symmetric sum). In the battery's heat normalisation
d gamma_n / d tau = V_n / 2 at tau = 0 (PROVED: F_tau(i gamma) = int e^(tau u^2/16) kappa(u) cos(gamma u/2) du gives
d_tau F = -(1/4) d_gamma^2 F, and F''/F' at a simple zero is 2 sum' 1/(gamma_n - zeta_m)); V_n = Re[i Lambda''(rho_n) / (2 Lambda'(rho_n))].
The arithmetic force with primes to X and weight w is

    E_w(t) = Im int_0^L w(v) e^(itv) (pole + archimedean)(v) dv - sum_{n <= X} w(log n) Lambda_F(n) n^(-1/2) sin(t log n),   L = log X,

and by the explicit formula (CLASSICAL) E_w(t) = sum over all zeros of k_w(t - zeta), k_w(x) = int_0^L w(v) sin(xv) dv. For w = 1,
k(x) = (1 - cos Lx)/x: the kernel 1/x of V with an oscillating correction. So the statistic compares sum 1/(gamma_n - zeta) with
sum k_w(gamma_n - zeta): it is an identity in the zeros, for every object with an explicit formula. Weights: sharp (w = 1),
Fejer (1 - v/L), cos^2(pi v/2L). The archimedean part is replaced by its large-t constant (-pi/4 per gamma factor; error O(1/t)).

**Finite consequence and survival criterion.** If the pairing "velocity = prime force" carried content beyond the identity, zeta's
correlation would stay bounded away from zero at every height while each control would lose it below its first off-line height.
Survival: zeta and L(chi) keep corr(V, E) at all four heights; every control with on-line zeros loses it (sign change or factor 2)
at zeros below its first off-line zero, for smooth and sharp weights alike.

**Window margin.** V_n uses 1e4 list neighbours on each side plus the tail of the smooth density (closed form with dilogarithms);
the influx of zeros through the window edge (source: a zero enters from x > 112 at t = -3.6) is the reason a margin is needed; with
this margin the list value agrees with the ball value to 8e-4 (section 2, item 4).

**Zeta, 1.0e6 zeros per window (MEASURED, server).** corr(V, E) / regression slope of E on V.

| window (height) | std V | X = 1e4 sharp | X = 1e6 sharp | X = 1e8 sharp | X = 1e8 Fejer | X = 1e8 cos^2 | identity check (X = 1e8) |
|---|---|---|---|---|---|---|---|
| 14 .. 6.0e5 | 2.85 | 0.703 / 1.01 | 0.695 / 1.00 | 0.695 / 1.00 | 0.860 / 0.73 | 0.839 / 0.81 | 0.956 (smooth trend of the tail not removed) |
| 1.0e6 .. 1.5e6 | 3.27 | 0.696 / 0.93 | 0.718 / 1.07 | 0.712 / 1.05 | 0.856 / 0.71 | 0.830 / 0.78 | 0.999970 |
| 4.23e7 .. 4.27e7 | 4.47 | 0.608 / 0.61 | 0.689 / 0.96 | 0.689 / 0.97 | 0.771 / 0.56 | 0.740 / 0.58 | 0.999994 |
| 1e9 .. 1e9 + 3.3e5 | 5.27 | 0.574 / 0.49 | 0.678 / 0.86 | 0.716 / 1.05 | 0.749 / 0.50 | 0.713 / 0.50 | 0.999996 |

Over ten sub-blocks of the 1e9 window the sharp correlation at X = 1e8 lies in [0.698, 0.733]. With the sharp weight and log X above
the local resolution the value settles near 0.70 with slope 1 (k = 1/x plus an oscillating term of the same variance; 1/sqrt 2 = 0.707);
with smooth weights it falls with height because the kernel width 1/log X stops resolving the mean spacing
(2 pi / log(T/2 pi) = 0.33 at 1e9 against pi/log X = 0.17).

**Heights below 2000, V in balls (MEASURED, server).** corr(V, E) over all on-line zeros / over the zeros below 85 (the first off-line
zero of DH is 0.8085 + 85.699 i), and the standard deviation of E.

| object (on-line zeros; below 85) | weight | X = 1e2 | X = 1e4 | X = 1e6 | X = 1e8 | std E at X = 1e2, 1e4, 1e6, 1e8 |
|---|---|---|---|---|---|---|
| ZETA (1517; 23) | sharp | 0.763 / 0.415 | 0.680 / 0.703 | 0.650 / 0.358 | 0.669 / 0.610 | 1.89, 1.75, 1.69, 1.70 |
| | Fejer | 0.802 / 0.994 | 0.926 / 0.998 | 0.960 / 0.999 | 0.978 / 0.999 | 0.82, 1.05, 1.08, 1.07 |
| | cos^2 | 0.762 / 0.991 | 0.912 / 1.000 | 0.949 / 1.000 | 0.970 / 1.000 | 0.85, 1.22, 1.23, 1.19 |
| DH (1861; 43), own coefficients, all n <= X | sharp | 0.251 / 0.739 | 0.158 / 0.292 | 0.061 / 0.290 | 0.015 / -0.099 | 2.18, 3.26, 11.1, 52.4 |
| | Fejer | 0.263 / 0.963 | 0.330 / 0.995 | 0.334 / 0.974 | 0.243 / 0.887 | 0.74, 1.13, 1.31, 1.94 |
| | cos^2 | 0.242 / 0.916 | 0.322 / 0.990 | 0.352 / 0.997 | 0.352 / 0.999 | 0.72, 1.32, 1.37, 1.46 |
| T-NR (1517; 23; off-line zeros from height 2.86) | sharp | 0.664 / 0.749 | 0.191 / -0.251 | 0.010 / 0.275 | -0.003 / -0.058 | 7.0, 36.9, 220, 1300 |
| | Fejer | 0.898 / 0.972 | 0.545 / 0.347 | 0.177 / 0.177 | 0.017 / 0.012 | 2.4, 7.2, 29.8, 145 |
| | cos^2 | 0.894 / 0.979 | 0.671 / 0.676 | 0.300 / 0.111 | 0.066 / 0.112 | 2.5, 6.1, 19.1, 74.7 |

T-NR at scale (first 1.0e6 zeta zeros, V and E corrected by the local factor in closed form): corr = 0.007 (sharp), 0.038 (Fejer),
0.078 (cos^2) at X = 1e8 against zeta's 0.695, 0.860, 0.839 on the same zeros. In the window at 1e9: 0.009, 0.035, 0.066 (std E 1240, 136, 71) against zeta's 0.716, 0.749, 0.713.

L(s, chi), chi mod 5 complex: 920,000 zeros of L(s, chi) (heights 6 to 4.9e5; list of `s1-zero-flow-dynamics`), force Im sum w Lambda(n) chi(n) n^(-1/2) e^(-it log n): corr / slope at X = 1e8 = 0.699 / 1.02 (sharp), 0.847 / 0.70 (Fejer), 0.822 / 0.77 (cos^2); at X = 1e4: 0.688, 0.682, 0.637. These are zeta's values in the window of comparable density. With the coefficients of the conjugate character on the same zeros the correlation is -0.02, -0.05, -0.05: the statistic does depend on pairing the right coefficients with the zeros.

**Reading.**
1. Smooth weights. DH keeps the correlation below its first off-line height at every X reached (cos^2: 0.999 at X = 1e8; Fejer: 0.887).
   Its low value over all zeros (0.24 to 0.35) is present already at X = 100 and does not move with X: an off-line pair close to the line
   acts on the neighbouring on-line zeros like a pair closer than the kernel width, the same resolution effect that lowers zeta's
   value at 1e9. With the cos^2 weight the part of k_w that grows with X decays like X^delta pi^2 / (2 L^2 x^3) in the distance x, so the
   test is local (`out/c1_decomp_DH.json`: the off-line part of E has rms 0.77, 0.69, 0.65 at X = 1e2, 1e4, 1e6, and 0.17 below 85).
2. Sharp weight. An off-line zero at distance x enters E with weight X^delta / (2|x|), delta = beta - 1/2. For DH std E grows as
   X^0.27 to X^0.34 (largest delta below height 2000: 0.3695 at 240.4; first: 0.3085), for T-NR as X^0.39 (delta = 0.4038). At X = 1e8 the
   correlation of DH on the 43 zeros below its first off-line zero is -0.10 (zeta: 0.61 on its 23 zeros; this small-sample value moves
   between 0.36 and 0.70 for zeta, so std E is the stable indicator: 52.4 against 1.70).
3. This is the one place in the batch where a control fails at heights below its off-line zeros. The reason is the classical one:
   sum_{n <= X} Lambda_F(n) n^(-1/2 - it) is the truncated explicit formula for psi_F, in which a zero beta + i gamma contributes
   X^(beta - 1/2 + i(gamma - t)) / (rho - s). The test detects an off-line zero at distance x from t when X^delta exceeds about |x| log^2:
   for zeta with zeros on the line below H = 3e12 the sharp statistic at X is fixed by verified height as long as sqrt X log^2 X is
   below H (X up to about 1e18; X = 1e8 is far inside), and beyond that range the computation is that of psi(x) - x at
   x above 1e18, which no finite X turns into a statement at all heights (a zero with delta at height gamma is invisible until
   X^delta > gamma).
4. Controls without the two inputs: EA (no on-line zeros), the sign twist (no functional equation, no zero list), the heat family (no
   Dirichlet coefficients) have no version of the statistic. The unimodular twist is zeta with t translated.

**Classification: closed.** Smooth cut-off: an identity with a local kernel, no control fails below its off-line zeros. Sharp cut-off:
the psi_F(x) error term, a zero-free-region test of height-dependent shape (delta log X > log distance); zeta's pass at the sizes
reached is a corollary of verified height. Not a survivor: zeta's pass is implied by verified height, three of the seven controls
have no statistic, and DH passes with smooth weights.

## 4. Combination 2: Gaussian-damped Gram form on primon states

Nodes: `mem-gaussian-damped-primon-gram`, `connes-adelic-truncated-trace`, `connes-twin-ladder-crosswalk`.

**Definitions (source: `src/data/rh-route-a-reflection-positivity-primon-gas-2026-09-23.js`, read as text).**
G_ij = D_t(log p_i - log p_j)/sqrt(p_i p_j), D_t(u) = sum_zeta e^(i zeta u - t zeta^2). Zero side: an on-line pair +-gamma gives
2 e^(-t gamma^2) Re[a a^*] with a_i = p_i^(-1/2 + i gamma) (rank 2, positive); an off-line quadruple gives a rank <= 4 indefinite term
of size e^(-t(gamma^2 - delta^2)) p^(+-delta). Prime side: the explicit formula with A(v) = Gaussian of variance 2t centred at u,
evaluated as a trapezoid sum over the frequency r with the control's own Dirichlet coefficients to 1e8 (no zero enters).

**Finite consequence and survival criterion.** lambda_min(G) >= 0 for zeta at every (t, N); for a control lambda_min < 0. Survival:
a control is negative at t much larger than 1/gamma_off^2 and at a dimension N that does not grow with the number of zeros below
gamma_off.

### 4.1 Premise check

Zeta, N = 20,000 first primes, t = 1e-2 (MEASURED, float64, GPU):

1. Full prime side (pole term kept; prime powers to 1e8; node span log(p_max/p_min) <= log 1e8 - 7 sqrt(2t)): lambda_min = -2.5e-12,
   lambda_max = 0.4807: positive semidefinite to the noise floor. The zero side gives -4e-17.
2. Pole term subtracted: lambda_min = -97.97, lambda_max = +92.70, exactly one negative eigenvalue. Mechanism (PROVED): the pole term
   is e^(t/4)(1/p_i + 1/p_j), of rank 2 with eigenvalues e^(t/4)(S1 +- sqrt(N S2)), S1 = sum 1/p = 2.7731, S2 = sum 1/p^2 = 0.45225, i.e.
   +98.12 and -92.56; subtracting it from a positive semidefinite matrix of norm 0.48 leaves one eigenvalue in [-98.12, -97.64] (Weyl). So the premise
   "after subtracting the pole term lambda_min >= 0 at fixed t as P grows" is false: lambda_min tends to minus infinity like
   -sqrt(0.452 N).
3. Prime side cut at p_max with no margin (the truncated gas of the source): lambda_min = -2.8e-6, one negative eigenvalue (the boundary
   layer below log p_max; source: -9e-5 to -4e-4 at t = 0.02 with 10 to 250 primes).

So the object to screen is the full form of item 1.

### 4.2 float64 screen, N = 20,000 primes (p <= 224,737), GPU

lambda_min (lambda_max in brackets). Noise floor of the prime side: about 3e-12 absolute (cancellation of the pole term against the
prime sum); of the zero side: 1e-16 lambda_max.

| object | side | t = 1e-1 | 1e-2 | 3e-3 | 1e-3 | 1e-4 | 1e-5 | 1e-6 |
|---|---|---|---|---|---|---|---|---|
| ZETA | prime | -2.6e-12 (7.4e-9) | -2.5e-12 (0.48) | | -1.7e-12 (4.8) | -5.1e-13 (26.8) | -2.9e-13 (132) | -1.5e-13 (578) |
| LCHI5 | prime | -3.6e-15 (0.044) | -7.0e-15 (2.7) | | -1.3e-14 (10.8) | -3.2e-14 (48.4) | | |
| DH (gamma_off = 85.70) | zero | -4.7e-17 | -3.5e-16 | -1.013e-9 | -2.532e-3 | -2.805 | -4.71 (t = 1.2e-5) | |
| DH | prime (own coefficients, all n <= 1e8) | -1.7e-14 | -1.5e-14 | -1.013e-9 | -2.532e-3 | -2.805 | -4.95 | |
| HEAT eps = 0.1 (gamma_off = 415.26) | zero | -1.6e-24 | -4.8e-17 | -1.7e-16 | -3.2e-16 | -1.10e-10 | -1.66e-5 (t = 3e-5) | |
| HEAT eps = 0.5 (gamma_off = 111.69) | zero | -9.3e-25 | -4.6e-17 | -2.2e-16 | -7.2e-6 | -0.63 | -3.9 (t = 3e-5) | |
| T-NR (off-line from 2.86) | prime | -17.3 (20.1) | -37.6 | | -58.4 | -90.3 | -120 | |
| SGN-LIOU | prime | -191 (197) | -187 | | -185 | -177 | -145 | |
| EA-1/4 | prime |  | -1.07 (2.03) | | | -13.7 (67.5) | | | |

Numerical rank of zeta's G (eigenvalues above 1e-11 lambda_max): 20, 110, 491, 1943, 5330 at t = 1e-2 .. 1e-6: twice the number of
zeros with e^(-t gamma^2) above the floor. The float64 detection thresholds are t gamma_off^2 = 22 (DH: first negative value at
t = 3e-3, noise at 5e-3 where t gamma_off^2 = 37) and 17 (HEAT eps = 0.1: first at t = 1e-4, noise at 3e-4): the 1/sqrt t law of the
source (5.6/sqrt t), which is the size e^(-t gamma_off^2) of the negative part against the floor. With the nodes spread to 1e7 (20,000 primes, log-uniform in [2, 1e7]): zeta -4.2e-13 (t = 1e-3) and -1.5e-13 (t = 1e-5); DH -1.45e-3 and -2.41 (first-primes set: -2.53e-3 and -4.95). Larger primes do not move the threshold.

### 4.3 Ball arithmetic: the sign is decided by the dimension

Leading N x N blocks on the first N primes, zero side, LDL^T pivots in balls (the zero list is the input; truncating it removes terms
below the working precision). n* = first N with a negative pivot.

| object | t | precision (bits) | N reached | n* (prime) | first negative pivot | on-line zeros below gamma_off |
|---|---|---|---|---|---|---|
| ZETA | 1e-3 | 2500 | 272 decided | none | | |
| DH | 1e-1 (t gamma_off^2 = 734) | 20,000 | 260 | 87 (p = 449) | -1e-329 | 43 |
| DH | 1e-2 | 4000 | 265 | 107 (587) | -1e-57 | 43 |
| DH | 1e-3 | 2500 | 257 | 135 (761) | -1e-18 | 43 |
| DH | 1e-4 | 2500 | 300 | 164 (971) | -1e-3 | 43 |
| HEAT eps = 0.5 | 1e-1 (t gamma_off^2 = 1247) | 30,000 | 200 | 69 (347) | -1e-543 | 33 |
| HEAT eps = 0.5 | 1e-2 | 5000 | 300 | 69 (347) | -1e-56 | 33 |
| HEAT eps = 0.5 | 1e-3 | 2500 | 272 | 77 (389) | -3e-10 | 33 |
| HEAT eps = 0.1 (gamma_off = 415.26) | 1e-2 (t gamma_off^2 = 1724) | 12,000 | 572 | 427 (2963) | -1e-825 | 211 |
| HEAT eps = 0.1 | 1e-3 | 2500 | 272 decided | none up to 272 | | 211 (2 x 211 = 422 > 272) |
| T-NR | 1e-3 | 2500 | 30 | 16 (53) | -0.75 | 0 |
| EA-1/4 | 1e-3 | 2500 | 40 | 14 (43) | -3.4 | 0 |

**Reading.** In exact arithmetic the controls are negative at t = 1e-1, i.e. at t = 734/gamma_off^2 (DH) and 1247/gamma_off^2 (heat):
"negative at t much larger than 1/gamma_off^2" holds. It holds at n* = 2 N_on + 1 (DH: 87 = 2 x 43 + 1), 2 N_on + 3 (heat eps = 0.5: 69 = 2 x 33 + 3) and 2 N_on + 5 (heat eps = 0.1:
427 = 2 x 211 + 5, at t gamma_off^2 = 1724) primes, and the negative pivot is of size e^(-t gamma_off^2) times a geometric factor. Mechanism (ARGUED): each on-line zero below the
off-line pair has a larger Gaussian weight than the pair and occupies two real directions (cos and sin of gamma log p); the negative
direction of the off-line quadruple is exposed only on the complement of those 2 N_on directions. Smaller t brings zeros above
gamma_off to comparable weight and n* grows (107, 135, 164). So the test resolves the off-line zero in two ways at once: the
dimension counts the zeros below it and the working precision must exceed t gamma_off^2 / log 2 bits.

Controls negative at once: T-NR (off-line zeros from height 2.86, none of zeta's zeros below them) and EA (no on-line zeros at all)
fail at 14 to 16 primes; the sign twist fails at every t with lambda_min of the order of -lambda_max (section 4.2): it has no
functional equation, and its form adds twice the odd prime-power terms to zeta's.

**Classification: closed.** Verified height in another form: N > 2 N_on(gamma_off) and precision > t gamma_off^2 / log 2 bits. The
controls that fail without this (T-NR, EA, sign twist) have off-line zeros (or poles on the line) at the bottom of the spectrum.

## 5. Combination 3: Weil positivity at fixed support, replayed for each control

Nodes: `weil-support-kappa-ladder`, `qtl-weil-delay-form`.

**Definitions.** For f in L^2[-a, a] (ordinate variable) Q_F(f) = sum over zeros of fhat(zeta) conj(fhat(conj zeta)), computed from
the prime side with A = f * f~ (support [-2a, 2a], prime powers n <= e^(2a)). The paper's z-type support is T = a/2 and T_RES = a.
Basis e_k(x) = exp(i pi k x/a), |k| <= K; the matrix is

    Q_kl = (-1)^(k-l) (2a / (pi (k - l))) (sigma(w_l) - sigma(w_k)),  Q_kk = tau(w_k),  w_k = pi k/a,
    sigma(w) = int_{0 < v <= 2a} sin(wv) dmu(v),  tau(w) = 2a mu({0}) + 2 int_{0 < v <= 2a} (2a - v) cos(wv) dmu(v)

(PROVED by direct integration of e_k against the shifted e_l; mu is the Weil distribution of section 2). lambda = eig(Q)/(2a). A
negative value at finite K is a failure of positivity; a positive value at finite K is not a proof of positivity on L^2[-a, a].

**What the source states.** Theorem G4 of `formalization/paper/flow-criticality-grading.md` section 5 is a lower bound for the grade
kappa(W_T >= 0) through the witness (z^2 + Y^2) cos(cz); kappa is a flow time, not a displacement, and the paper states that an upper
bound (positivity at support T forcing a strip) is open and false at large height by RES-T. So "positivity at support T forces
displacement <= f(kappa_low(T))" is not a theorem; the test below asks whether any control violates the height law instead.

**Finite consequence and survival criterion.** For each control record the onset a* (first support with lambda_min < 0) and compare
with the resolution scale (1/2) log(N gamma_1 / 2 pi) of its lowest off-line zero gamma_1 (N = conductor). Survival: a control
negative at a support well below that scale (displacement detected without resolving the height), with zeta positive throughout.

**float64, frequencies to 250, prime powers to e^(2a) <= 1e8 (server).** lambda_min (number of eigenvalues below -1e-9 lambda_max).

| object | a = 0.25 | 0.4 | 0.5 | 0.7 | 1 | 1.5 | 2 | 3 | 4 | 6 | 8 | 9.2 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| ZETA | 3.3e-2 | 1.8e-4 | 9.5e-7 | 4.6e-13 | 1e-14 | -1e-14 | -3e-14 | -3e-13 | -3e-13 | -7e-13 | -3e-12 | -4.9e-12 (0) |
| LCHI5 | 0.70 | 0.22 | 9.0e-2 | 4.8e-3 | 2.0e-6 | -1e-15 | -2e-14 | -2e-13 | -1e-13 | -1e-12 | -3e-12 | -3.0e-12 (0) |
| DH | 0.94 | 0.52 | 0.30 | 3.7e-2 | 3.4e-5 | -2e-15 | -0.76 (2) | -5.2 (10) | -16.5 (10) | -99 (10) | -475 (12) | -1170 (12) |
| T-NR | 2.2 | 2.2 | 2.2 | -0.19 (2) | -0.22 (6) | -0.92 (18) | -2.5 (62) | -10 (88) | -33 (90) | -150 (94) | -910 (92) | -2200 (92) |
| EA-1/8 | 6.7e-2 | 3.4e-4 | -7.9e-6 (1) | -3.6e-3 (4) | -3.5e-2 (8) | -0.16 (27) | -0.44 (80) | -1.4 (187) | -3.1 (216) | -10 (218) | -21 (218) | -33 (220) |
| EA-1/4 | 6.6e-2 | 2.6e-4 | -2.1e-4 (2) | -2.4e-2 (4) | -0.14 (8) | -0.70 (28) | -1.9 (81) | -6.0 (189) | -15 (218) | -61 (218) | -180 (220) | -320 (224) |
| EA-1/2 | 6.5e-2 | -8.1e-5 (1) | -2.3e-3 (2) | -0.11 (4) | -0.63 (9) | -3.3 (45) | -9.3 (93) | -35 (190) | -120 (222) | -1100 (219) | -7600 (222) | -23000 (224) |
| SGN-LIOU | 3.3e-2 | -0.25 (2) | -0.75 (2) | -1.5 (2) | -2.1 (5) | -4.3 (18) | -8.7 (43) | -31 (114) | -96 (190) | -790 (256) | -5900 (273) | -20000 (282) |
| SGN-R | 3.3e-2 | -0.25 (2) | -0.75 (2) | -0.98 (2) | -1.8 (6) | -3.0 (20) | -5.7 (43) | -16 (114) | -54 (192) | -400 (340) | -3000 (497) | -9900 (589) |

At a = 9.2: 5,651,875 prime powers (zeta) and 97,953,162 integers (DH), dimension 1467. For a < (log 2)/2 = 0.347 no prime enters and
every form is the archimedean-plus-pole form of its gamma factor: all positive, whatever the displacement (EA-1/2: every zero is at
distance 1/2 from the line and the form at a = 0.25 has lambda_min = +6.5e-2). The eigenvector of DH's lowest eigenvalue at a = 2 peaks at
frequency 85 (the first off-line ordinate is 85.70).

**Balls (Mac; 700 to 1800 bits; Gauss-Legendre with 48 to 160 nodes per panel; inertia from LDL^T pivots, lambda_min from mpmath
on the midpoints).**

| object | a (frequency cap) | lambda_min | negative pivots / decided |
|---|---|---|---|
| ZETA | 1 (80) | 1.383e-29 | 0 / 53 |
| ZETA | 1.5 | 3.252e-67 | 0 / 79 |
| ZETA | 2 | 2.262e-107 | 0 / 90 of 103 (eigenvalues all positive) |
| ZETA | 2.5 | 3.212e-152 | 0 / 129 |
| ZETA | 3 | 7.257e-200 | 0 / 155 |
| ZETA | 3.5 | 2.489e-250 | 0 / 181 |
| LCHI5 | 1.5; 2.5; 4 | 9.118e-20; 1.856e-88; 4.258e-213 | 0 / 79; 0 / 110 of 129; 0 / 205 |
| DH | 1.5; 1.6; 1.7 (120) | 3.62e-18; 5.95e-23; 1.40e-28 | 0 / all |
| DH | 1.75; 1.8; 1.9; 2 | -4.75e-21; -2.09e-7; -0.242; -0.754 | 2; 2; 3; 4 |
| T-NR | 0.6; 0.62; 0.65 (60) | 0.2266; 0.0378; -0.1138 | 0; 0; 1 |
| EA-1/2 | 0.38; 0.40 | 3.15e-4; -4.79e-5 | 0; 1 |
| EA-1/4 | 0.42; 0.44; 0.5 | 8.49e-5; -1.93e-6; -1.58e-4 | 0; 1; 2 |
| EA-1/8 | 0.45; 0.48 | 2.48e-5; -3.98e-6 | 0; 1 |
| SGN-LIOU | 0.35; 0.37; 0.40 | 1.40e-3; -5.31e-3; -0.213 | 0; 1; 2 |

**Onset against the resolution scale.**

| object | lowest off-line zero (or pole on the line) | displacement | onset a* (balls) | (1/2) log(N gamma_1/2 pi) | ratio | first differing prime power enters at |
|---|---|---|---|---|---|---|
| DH | 85.70 | 0.3085 (max below 2000: 0.3695 at 240.4) | (1.70, 1.75) | 2.111 | 0.81 to 0.83 | a = 0.347 |
| EA-1/2 | 14.13 | 0.5 | (0.38, 0.40) | 0.405 | 0.94 to 0.99 | 0.347 |
| EA-1/4 | 14.13 | 0.25 | (0.42, 0.44) | 0.405 | 1.04 to 1.09 | 0.347 |
| EA-1/8 | 14.13 | 0.125 | (0.45, 0.48) | 0.405 | 1.11 to 1.18 | 0.347 |
| SGN-LIOU | pole of zeta(2s)/zeta(s) at 14.13 | on the line | (0.35, 0.37) | 0.405 | 0.86 to 0.91 | 0.347 |
| T-NR | 2.86 | 0.404 | (0.62, 0.65) | 0.705 (N = 9) | 0.88 to 0.92 | 0.549 (q = 3) |

**Reading.** (a) Zeta and L(chi) are positive wherever the arithmetic can decide, with lambda_min falling as 1e-29, 1e-67, 1e-107,
1e-152, 1e-200, 1e-250 for a = 1 .. 3.5; float64 shows this as zero to its noise (5e-12 at a = 9.2). (b) Every control turns
negative at a support within a factor 0.81 to 1.18 of (1/2) log(N gamma_1/2 pi): the support at which functions of type a can vanish on
the on-line zeros around gamma_1 (density (1/2 pi) log(N gamma/2 pi), against the Beurling density a/pi). This is the detector
uncertainty principle already on file (primes to (gamma/2 pi)^0.9). (c) The dependence on the displacement is weak (EA: 0.39, 0.43, 0.47
for delta = 1/2, 1/4, 1/8) and no control is negative below the scale. (d) Controls positive at a support where their displacement is
maximal for the strip exist (EA-1/2 at a <= 0.38, i.e. T <= 0.19; DH with displacement 0.31 to 0.37 at a <= 1.70, T <= 0.85): a bound
of the form "positivity at support T forces displacement <= f(T)" does not hold uniformly in height at these T; it is the
height-dependent law (b).

**Classification: closed.** Support a exchanges for height gamma ~ (2 pi/N) e^(2a/0.8..1.2), the range of the primes used. For zeta
at a = 9.2 the heights concerned are below 1e9, inside verified height.

Heat family: no prime side; the zero-side form needs all zeros with a slowly decaying weight and was not computed (stated, not run).

## 6. Combination 4: Pick pencil of the heat family at real nodes

Nodes: `eps0-pd-persistence-window`, `ns-rigid-pencil-psd-past-lehmer`, `native-span-no-intermediate-grade`.

**Definitions.** F_{-eps}(z) = int e^(-eps u^2/16) kappa(u) e^(zu/2) du (z = s - 1/2; eps = backward de Bruijn-Newman time), phi =
F'/F, P_ij = (phi(z_i) + phi(z_j))/(z_i + z_j) at real nodes z_k = 3.5 x (van der Corput sequence, base 2): 1.75, 0.875, 2.625,
0.4375, ... nested and dense in (0, 3.5), i.e. s in (1/2, 4]. Signs of the LDL^T pivots in 4000-bit balls (rounding enclosed;
quadrature of the kernel: 68,448 Gauss-Legendre nodes, error model below 1e-1189, not enclosed). n* = first n with a negative pivot.
At least 1500 accurate bits remain at n = 120 in every row.

**Finite consequence and survival criterion.** Survival would need n*(eps) small where the first non-real zero pair of Xi_eps is
high; the source data predicts the reverse.

| eps | n* (n <= 120) | negative pivots among 120 | first non-real pair (Re z, height) | on-line zeros below it (N_below) | 3.7 N_below + 4 |
|---|---|---|---|---|---|
| 0, 1e-6, 1e-4, 1e-2 | none | 0 | none; 1.14e7; 2.34e5; 1977 (gap law g^2/2 < eps on the zero list) | -; 24,360,731; 354,768; 1495 | -; 9.0e7; 1.3e6; 5.5e3 |
| 0.1 | none | 0 | (0.0216, 415.26) | 211 | 785 |
| 0.5 | none | 0 | (0.243, 111.69) | 33 | 126 |
| 1 | 100 | 4 | (0.247, 95.58) | 26 | 100 |
| 2 | 37 | 12 | (0.249, 49.72) | 8 | 34 |
| 5 | 17 | 26 | (0.745, 33.48) | 3 | 15 |
| 10 | 15 | 32 | (2.05, 35.31) | 3 | 15 |
| 20 | 9 | 36 | (2.18, 29.97) | 1 | 8 |
| 30 | 8 | 40 | (3.79, 33.52) | 1 | 8 |
| 50 | 7 | 42 | (6.71, 40.70) | 1 | 8 |
| 100 | 7 | 46 | (13.49, 58.86) | 1 | 8 |
| 1000 | 5 | 53 | none found below height 120 with Re z <= 40 | 0 (none found) | 4 |

First non-real pairs for eps >= 1: sign changes on the line plus Newton from a seed grid (`code/heatzeros.py`, 320 bits; not certified
complete); eps = 0.1, 0.5: battery tables; eps <= 1e-2: first pair of consecutive zeta ordinates with g^2/2 < eps on the list of
1.0e8 zeros (leading-order collision time; it gives 415.02 for eps = 0.1 and 111.03 for eps = 0.5 against the tables' 415.26 and 111.69).

Closed-form objects at the same nodes: ZETA none (120 positive pivots), L(s, (./5)) none, DH none (120 positive pivots, although DH
has 84 off-line pairs below 2000, the first at height 85.7 with 43 on-line zeros below: 3.7 x 43 + 4 = 163 > 120), T-NR n* = 4,
EA-1/8 and EA-1/4 n* = 8, EA-1/2 n* = 7.

**Reading.** n*(eps) = 3.7 N_below + 4 to within 4 over the whole range 1 <= eps <= 1000 (fit on eight values; the number of real
nodes needed is about four per on-line zero lying below the first non-real pair). The height of that pair does not order n*: at
eps = 100 the pair is at height 58.9 and n* = 7, at eps = 10 it is at 35.3 and n* = 15, at eps = 1 at 95.6 and n* = 100. What orders
n* is the count of zeros below it. For eps <= 0.5 the law puts n* above 120 (126 at eps = 0.5), consistent with the 120 positive
pivots, and at 9e7 for eps = 1e-6 (extrapolation of the measured law, not computed). Mechanism (ARGUED): with nodes small against
the zeros, the Pick matrices test the Stieltjes moment conditions of the power sums sum zeta^(-2k); a non-real pair is seen when the
moment order passes the number of real zeros of smaller modulus.

**Classification: closed (flow-blind).** A Pick statement on n real nodes certifies at most that the first non-real pair lies above
the first n/3.7 zeros: verified height in another form, with a worse exchange rate than counting sign changes. This agrees with the
source (`native-span-no-intermediate-grade`: fixed node sets stay positive to eps = 1e5 for lacunary sets; here the nodes are
Muntz-dense and the pencil does turn negative, at the n fixed by the zero count).

## 7. Summary table

| combination | statistic | sizes reached | zeta | L-function | DH | T-NR | zeta(s+a)zeta(s-a) | sign twist | backward heat | unimodular twist | classification |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | corr and slope of prime force (primes to X) against heat velocity at the zeros | 1.0e6 zeros at heights 6e5, 1e6, 4.2e7, 1e9; X = 1e8; controls: all zeros below 2000 | sharp 0.69 to 0.72, slope 1.0, at every height; smooth 0.71 to 0.86 | L(s, chi mod 5), 9.2e5 zeros: sharp 0.70, slope 1.0; smooth 0.82 to 0.85 | smooth: kept below first off-line zero (0.999, 0.887); sharp: lost (-0.10; std E 52 against 1.7) | lost at every height and weight (0.007 to 0.08; std E 75 to 1300) | no on-line zeros: undefined | no zeros: undefined | no coefficients: undefined | equals zeta | closed: identity; sharp cut-off = psi_F(x) error term; zeta's pass implied by verified height while sqrt X log^2 X < H |
| 2 | lambda_min of the Gaussian Gram form on N primes | float64 N = 20,000, t = 1e-1 .. 1e-6, primes to 1e8 on the prime side; balls N <= 300, 2500 to 30,000 bits | zero to noise (3e-12); positive in balls to N = 272 | zero to noise (3e-14) | negative from t gamma^2 <= 22 (float64); in balls at every t from N = 87 = 2 x 43 + 1 | negative at 16 primes | negative at 14 primes | negative, of size lambda_max, at every t | negative from t gamma^2 <= 17 (float64); in balls from N = 69 = 2 x 33 + 3 (eps = 0.5) and 427 = 2 x 211 + 5 (eps = 0.1) | equals zeta | closed: dimension counts on-line zeros below the off-line pair; precision t gamma^2 / log 2 bits |
| 3 | lambda_min of the Weil form at support a (T = a/2), prime side | a <= 9.2 (T <= 4.6), prime powers to 1e8, frequencies to 250; balls a <= 4 | positive (1e-29 .. 1e-250 for a = 1 .. 3.5); zero to noise to a = 9.2 | positive (4e-213 at a = 4) | onset (1.70, 1.75) = 0.82 x (1/2) log(5 x 85.7/2 pi) | onset (0.62, 0.65), after q = 3 enters at 0.549 | onsets 0.39, 0.43, 0.47 for a = 1/2, 1/4, 1/8; positive below | onset (0.35, 0.37), after p = 2 enters at 0.347 | not run (no prime side) | equals zeta | closed: support <-> height; no control negative below its resolution scale; displacement alone forces nothing |
| 4 | n* = first n with a non-PSD Pick matrix at n nested real nodes | n = 120, 4000 bits, eps = 0 .. 1000 | none to 120 | none to 120 | none to 120 | n* = 4 | n* = 7 to 8 | not run (no completed function) | n* = 3.7 N_below + 4: 100, 37, 17, 15, 9, 8, 7, 7, 5 for eps = 1 .. 1000; none to 120 for eps <= 0.5 | not run | closed: flow-blind; n* counts zeros below the first non-real pair |

## 8. Limits and weakest steps

1. All float64 values are a screen. The statements used for the classifications were re-checked in balls or by an independent route:
   combination 2 signs (section 4.3) and combination 3 onsets (section 5) in balls; combination 4 entirely in balls; combination 1
   only by the identity check (prime side against zero side, correlation 0.99997 or better) and by V in balls below 2000. The zero
   lists themselves are MEASURED (battery tables: 30 digits, not interval certificates; DH and heat off-line lists not certified complete).
2. The laws n* = 3.7 N_below + 4 (combination 4), n* = 2 N_on + 1..5 (combination 2) and a* = (0.81 .. 1.18) x (1/2) log(N gamma_1/2 pi)
   (combination 3) are fits on 8, 3 and 6 cases. They are stated as measured regularities; none is proved here.
3. Combination 3 uses a finite Fourier basis: positive values are upper bounds for the infimum, so "zeta positive" means positive on
   the tested subspaces. The first ball run exposed a quadrature error of 1e-169 (section 2, item 7); the reported values are from the
   160-node rule and are unchanged between 48 and 160 nodes where both exist (a = 2.5: 3.212e-152).
4. The server copy of the HEAT eps = 0.5 zero table lacks the 17 off-line pairs between heights 947 and 2000 that the Mac copy has;
   the float64 rows of section 4.2 use the server copy (their Gaussian weights there are below 2e-12 at t = 3e-5), the ball rows the Mac copy.
5. Not run: support T = 6 (needs primes to 2.6e10); heat family in combination 3; sign twist in combination 4; Gram nodes to 1e7 beyond
   the two rows of section 4.2.

## 9. Files

`code/ctl.py` (coefficients, explicit-formula data, exponential sums), `code/combo1.py`, `code/combo2.py`, `code/c2_exact.py`,
`code/combo3.py`, `code/c3_arb.py`, `code/c3_onset.py`, `code/combo4.py`, `code/heatzeros.py`, `code/gaplaw.py`, `code/c1_decomp.py`,
tests `code/t_ctl.py`, `code/t_c1.py`, `code/t_c2.py`, `code/t_c3.py`, `code/c4_validate.py`; `code/core.py`, `code/heatlib.py` and
`zgen/` are copies from `c12-control-battery-harness` and `s1-zero-flow-dynamics`. Server outputs: `out_server/` (json and logs);
Mac outputs: `out/`. Server directory `~/rh-push/s2-heat-root-drift-forces/` (the 1e9 zero list stays there: `data/zeta_1e9.npy`).
