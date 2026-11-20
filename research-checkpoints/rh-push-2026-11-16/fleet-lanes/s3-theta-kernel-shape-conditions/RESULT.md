# s3-theta-kernel-shape-conditions: RESULT

Date 2026-11-19 (PST) / 2026-11-20 (UTC). Kind: screening (compute). Four combinations screened. **Survivors: 0.**
Labels: PROVED (short argument here) / CLASSICAL / MEASURED / OPEN. MEASURED with "balls" means python-flint ball
arithmetic on objects whose theta-series truncation and trapezoid quadrature are not enclosed (both are set 40 bits
or more below the working precision and checked by a second step or precision); a sign marked "certified" is the sign
of such a ball. No statement about zeros of zeta is made. No bound moves.

## 0. Verdict

| # | combination (tags) | statistic | sizes reached | zeta | comparison L-functions | controls | classification |
|---|---|---|---|---|---|---|---|
| 1a | Csordas concavity of t -> log K(sqrt t) (theta x bridge x heat-flow) | sign of u l'' - l', l = log K, on a u-grid | 100,000 points on (0, 1.5] per kernel, 24 kernels, 128-bit balls, 0 undetermined | holds | holds for 12 of 13 (chi_{-3}, chi_{-4}, chi_5, chi_8, chi_{-8}, chi_{-11}, chi_12, chi_13, chi_{-15}, chi_17, chi_{-19}, Delta); fails for chi_{-7} on (0, 0.2197) | DH holds; heat tau = -0.2, -0.05, 0.05 hold (PROVED: exactly invariant); E_a (0.2, 0.35) holds; T-NR (three members) fails; Liouville twist (one-sided) fails on (0, 0.2424) | CLOSED. Kernel-shape property that DH, heat and E_a satisfy and one Euler-product comparison does not |
| 1b | Positive-definiteness of the pair kernel Q_t (Laguerre D_t >= 0) (theta x lee-yang x vortex) | first size n* of a Toeplitz Gram matrix [Q_t((i-j) h)] with a negative pivot, against the grid step h (Nyquist abscissa x_N = pi/2h) | n to 16,384 (server) and 12,288 (Mac); x_N = 25 .. 3217 (height 1608); 990 to 8,719 bits; 28 (kernel, t) pairs in the standard set (n = 4000) | positive definite at every size: t = 0 to n = 16,384 at x_N = 3217; t = 0.05, 0.2, 0.5 to n = 4000 at x_N = 804 | positive definite at every size (chi_{-3} to n = 8192 at x_N = 1608; chi_{-4}, chi_5, chi_{-7}, chi_{-19}, Delta to n = 4000 at x_N = 804) | fail only when x_N exceeds the first abscissa with D_t < 0 (and n h resolves the width of that interval): DH 170.9 (first off-line zero at height 85.70), heat tau = -0.2: 667.8, tau = -0.1: 830.5, E_a: 27.6, T-NR: 5.0; below that x_N every control is positive definite to n = 4000. n* = 2.0 to 6.2 times that abscissa. Heat tau = -0.05: first interval with D < 0 is [1501.64, 1501.68]; positive definite at x_N = 1608 (n = 8192), fails at x_N = 3217 with n* = 11,833. DH is positive definite again for t >= 0.25, E_a for t >= 0.25, T-NR for t = 0.5 | CLOSED. Verified height in another form: the matrix sees a control only when its grid resolves the height of the first non-real zero pair, and its size at failure is proportional to that height |
| 1c | Central moment ratio M_2(1/2)/M_0(1/2) < 2/169 (theta x certificate) | r = M_2/M_0 at tau = 0, 1/4, 1/2; x_c = sqrt(2/r) | 21 kernels, 256-bit balls | 0.0116732 < 0.0118343 (holds) | all larger (0.028 to 0.76): the inequality as stated fails for every comparison | heat: 0.0116246, 0.0116610, 0.0116853 (all three hold); DH 0.0508, E_a 0.0236, T-NR 0.17 | CLOSED. A number of the kernel; the consequence H(x) > 0 for abs(x) < x_c is a theorem for every nonnegative kernel (x_c is 12 % to 61 % of the first real zero in every case with one); continuous and monotone in tau |
| 2 | Exponential-family conditions and Fisher bound on Re F'/F (information x shear x theta) | signs of p, p', (p/a)' on (0, 50]; reach y*(x) of the bound; count of grid points with Re Z < bound | 400 points in a; x = 0.02 .. 10^4 (21 values); 4032 (x, y) points per kernel; 18 kernels; 256-bit balls | all hold; y*(x) = 0.09999, 0.4989, 0.9915, 7.50, 35.6, 138.1, 500.5 at x = 0.1, 0.5, 1, 10, 100, 10^3, 10^4; 0 violations | positive kernels: all hold, same y*(x) to 1 % for x <= 1. Signed kernels: chi_{-163} has p' < 0 on [0.25, 2.25] and 93 violations; chi_{-43} has 103 violations | DH, heat (3), E_a (2), T-NR (2): every condition holds, 0 violations, y*(x) within 0.3 % of zeta's for x <= 1/2 | CLOSED. The conditions are those of a probability density (kernel >= 0). Every control passes; two genuine L-functions with signed kernels fail. Reach: abs(y) < x(1 + o(1)) near the axis for every kernel (PROVED to leading order), 28 times below the first zero at x = 1/2 |
| 3a | Source signs of the theta ladder and Wronskian ladders of orders 2..8 (pick x total-positivity x theta) | sign pattern on a u-grid of S1..S5 and of A_m = W_m(K, uK', K'', uK''', ...)/K^m, B_m = same with last column C(u), m = 2..8 | 100,000 points (S1, S3, S4) and 2,000 points (rest; E_a 200) on (0, 1.5]; 24 kernels; 128 / 384-bit balls; 0 undetermined | S1..S5 hold; A_5 (= S_Q) and B_5 (= S_H) negative near 0 with one sign change (at t = 4u = 0.166 and 0.122), as in the source | no comparison reproduces zeta's sign pattern; chi_5 and Delta satisfy S1..S5; 11 of 13 fail at least one of S1..S5 | heat (3): identical pattern to zeta at every order (crossings move by 4 % at most); DH satisfies S1, S2, S4, S5, fails S3 and A_4; E_a satisfies S1..S5, differs at B_4; T-NR fails S1, S2 | CLOSED. Kernel fingerprint: stable under the heat factor over tau in [-50, 5], violated by Euler-product comparisons |
| 3b | Collocation determinants of the same ladders at random node tuples | fraction of tuples with sign + for det[g_j(u_i)], orders 2..8, both ladders | 10^6 random increasing 8-tuples per kernel from a pool of 2048 nodes; 14 kernels (E_0.35: 3 x 10^5); 512-bit balls; 0 undetermined | strict sign at orders 2, 3, 4 (both ladders); mixed from order 5 (99.46 % at A_5 down to 85.3 % at A_8) | strict at orders 2..4 for Delta only; chi_{-3} 78.5 % at A_4, chi_{-7} 61.0 %, chi_8 74.3 %, chi_12 99.945 %; chi_{-4}, chi_5 fail B_4 | heat (3): fractions equal to zeta's within 3e-4; DH 95.48 % at A_4, strict at B_4; T-NR mixed from order 2 | CLOSED. Largest order with a strict sign for zeta: 4. At that order DH fails less often than three Euler-product comparisons; heat does not fail |
| 3c | Real Pick determinants [(L(x_i)+L(x_j))/(x_i+x_j)], orders 1..8 (and to 24, 40) (pick x schwarzian) | sign of every leading minor at random positive node tuples; four-node Schwarzian signs on a grid | 10^6 tuples per kernel, orders 1..8, 16 kernels (Mac; 3 x 10^5 per kernel on the server, same outcome), 1024-bit balls; 10^4 tuples to order 24 (3072 bits); 4000 tuples to order 40 (6144 bits; zeta, DH, heat -0.2); nodes in (0, 100]; 0 undetermined | positive at every order reached (8; 24 on 10^4 tuples; 40 on 4000 tuples) | positive at every order reached (chi_{-3} to 24) | DH: positive at every order reached (40). Heat tau = -0.2: positive to order 40; tau = -0.05, 0.05: positive to order 8. E_a(0.35): first negative order 7 (46.9 % of tuples). T-NR(3, 2.2): first negative order 4 (51.8 %). Planted pair at height g on top of zeta: first negative order 4, 4-5, 6, 12-13, 29 for g = 2, 4, 8, 16, 32; none up to 40 for g = 64, 85.7, 128 | CLOSED. Verified height in another form: the Pick order at which a control fails grows in proportion to the height of its first off-line zero (about 0.9 g); at orders 2..8 DH and both heat controls pass. Silent cell U8: no separating sign found up to order 8 (ladders) and order 40 (Pick) |
| 4a | Sign structure of the truncated kernel Phi_N (theta x heat-flow) | number of sign changes and largest zero x_0(N) of Phi_N, x = e^{4u}; zeros on u > 0 of truncated control kernels | N = 1..100 and 14 values to 10,000 (58,000 bits at N = 10^4); 27 control kernels, N <= 300 | one sign change; N x_0(N) = 0.9998268 at N = 10^4: u_0(N) = -(1/4) ln N + o(1). The source law (1/2) ln(5/(2 pi N^2)) is reproduced only for the kernel as coded in imp-3347, which is not Phi | no zero on u > 0 for 18 of 23 real characters; chi_{-19}, chi_{-43}, chi_{-67}, chi_{-163} have a zero on u > 0 for every N >= 2 (also the full kernel), chi_29 at N = 3 | DH: no zero on u > 0 for any N; Delta, Liouville, T-NR(2, 2.1): none; T-NR(3, 2.2): two at N = 1 only; heat: same zeros as zeta (positive factor) | CLOSED. Reads the size of the first coefficients against the conductor; DH passes and four Euler-product comparisons fail |
| 4b | Closed polynomial ODE system of the theta kernel (theta x metaplectic x torus) | residual of the source system; dimension of polynomial relations P(a, a', a'', a''') = 0 of degree <= D, a = K'/K | D <= 7 for 13 kernels (330 monomials, 4608 bits), D = 8 for 7 kernels (495 monomials, 6144 bits); residual at 256 bits | source system holds for H = e^{u/4} theta_3 (residual 0 to 1e-70); H closes at degree 4; the kernel Phi itself has no relation of degree <= 8 | chi_{-4}, chi_{-8}, chi_12, Delta close at degree 2; chi_8 at degree 4; chi_{-3} at degree 8; chi_5: none of degree <= 8; chi_{-7}: none <= 7 | DH: none of degree <= 8; heat tau = 0.05, T-NR: none <= 7 | CLOSED. Low-degree closure marks the theta series that are eta quotients or theta constants (conductors 4, 8, 12, level 1), not L-functions; at degree <= 7 three Euler-product comparisons fail with DH, at degree 8 two. Every modular form satisfies some third-order algebraic equation (CLASSICAL) |

Known pattern to beat: not beaten. 1b and 3c are clean instances of it with a measured law (matrix size or Pick order
proportional to the height of the first off-line zero). 1a, 1c, 2, 3a, 3b, 4a, 4b never see zeros: each is failed by
at least one Euler-product comparison, and each except 4b is passed by DH or by the heat controls (usually both); in 4b
DH and heat fail together with three comparisons.

One finding that conflicts with a record on file (section 3.4): the heat control tau = -0.05 has D < 0 on the real axis
at x = 1501.66, 2109.8, 2658.3, 2691.2, 2831.4 (heights 750.8 to 1415.7), each at a close pair of zeta zeros. The table
of `s1-kernel-shear-norms` lists no deficit of sign changes for tau = -0.05 below height 5000.

## 1. Objects, code, validation

Convention x = e^{4u}; F(w) = int_R K(u) e^{2wu} du is the completed function at centre + w; H(x) = int K(u) cos(xu) du
(so x = 2 * height). `klib3.py`:

| name | kernel K(u) | F(w) |
|---|---|---|
| zeta | Phi(u) = sum (2 pi^2 n^4 e^{9u} - 3 pi n^2 e^{5u}) exp(-pi n^2 e^{4u}) (kappa(t) = Phi(t/4) in the sources) | xi(1/2 + w)/4 |
| chi_D (Kronecker, conductor q, parity d) | 4 e^{(1+2d)u} sum chi(n) n^d exp(-pi n^2 e^{4u}/q) | (q/pi)^{(s+d)/2} Gamma((s+d)/2) L(s, chi), s = 1/2 + w |
| DH | same with b = (1, kappa, -kappa, -1, 0) mod 5, d = 1 | completed Davenport-Heilbronn function |
| Delta | 2 e^{12u} Delta(i e^{2u}) | (2 pi)^{-(6+w)} Gamma(6 + w) L(Delta, 6 + w) |
| heat tau | e^{tau u^2} Phi(u) (= kappa_tau(t) = e^{tau t^2/16} kappa(t)) | |
| E_a | int Phi(u/2 + s) Phi(u/2 - s) e^{4as} ds | (xi/4)(1/2 + w + a) (xi/4)(1/2 + w - a) |
| T-NR (q, c) | Phi(u - (log q)/2) + c Phi(u) + Phi(u + (log q)/2) | (xi(1/2 + w)/4)(2 cosh(w log q) + c) |
| Liouville (one-sided, u >= 0) | 4 e^u sum lambda(n) exp(-pi n^2 e^{4u}) | no functional equation |

Sign-twisted primes enter as the Liouville twist on u >= 0 in 1a, 3a, 4a only; the unimodular twist has a complex,
non-even kernel and no condition of this batch is formulable for it (not run). Positive comparisons: real primitive
characters and the weight-12 form.

Validation (`klib3.py` self-test, `val_gram.py`, `val_expfam.py`, `val_tp.py`, all local):
- Phi(0) = 0.446696900467; evenness of every kernel to working precision; first Taylor coefficient against a
  difference quotient (1e-22). Fourier identity against mpmath at w = 0.4 + 3.7i to 18 digits for zeta, DH,
  chi_{-3}, T-NR, E_a (convolution quadrature) and at w = 14 for Delta; tau(n) against the known values.
- Lemma 1.1: D_t(x) = 4 int Q_t(v) cos(2xv) dv (the 4 is the normalisation H = int K cos) to relative 1e-150 for zeta,
  DH (t = 0.1), T-NR at x = 3 and 11.5. Levinson pivots against numpy eigenvalues: first negative leading minor at
  size 26 and 4 negative eigenvalues at size 50 for T-NR in both.
- Theta-central node: M_2(1/2)/M_0(1/2) = 0.01167315 < 2/169 = 0.01183432 (reproduced).
- Source table of PR 41 at x = 0.1, y = 14.1347251417: mu 0.00462092428, I 0.0462077560, abs(phi) 0.000278175364,
  Re Z 10.0067677, bound -772.744923 (all five reproduced).
- PR 51 and PR 53 for zeta: f' > 0, h' < 0, W' > 0, W''f' - W'f'' > 0, h''f' - h'f'' > 0 at every grid point;
  S_Q and S_H negative on 0 < t <= 1/16 with exactly one sign change (reproduced; crossings at t = 0.166, 0.122).
  PR 50: both Schwarzian signs positive for zeta on x in [0.01, 100] (reproduced).
- L = F'/F against mpmath for zeta and DH (25 digits).
- Source system of PR 46: residual of the third equation and of the closed forms of v and c below 1e-70 at five points.
- imp-3347 replay with the kernel as coded there: margins 2.0923, 2.7640, 3.4456, 4.1328 at N = 10, 20, 40, 80
  (node: 2.09, 2.76, 3.45, 4.13).

Where it ran. Server (`~/rh-push/s3-theta-kernel-shape-conditions/`, units through rhrun only): eight one-core units
(8 cores, 8 GB in total). rh.slice ran at its 40-core limit (39.4 cores in use by 43 units; load average 150 to 175),
so each unit received 0.75 to 1.0 core whatever its quota or worker count, and the same code ran 3 to 5 times slower
than on the Mac. Stages that would not finish in bounded time were also run on the Mac as single-process runs under
`scripts/memcap.sh 8` (each under 25 minutes): the standard Gram set at 1.3 times the server precision (run with six
workers, 4 min 43 s), the 10^6-tuple Pick runs, the second collocation batch, the two n = 12,288 Gram runs, the
order-24 and order-40 Pick runs, and the scans of section 3.4. The table in section 8 lists the source of every file.
Local runs that exceeded the 20-minute rule: two 10^6-tuple Pick runs (22 min 49 s, 20 min 44 s), the order-40 Pick
run (28 min), the n = 12,288 Gram run for tau = -0.05 (20 min 37 s) and two scan windows (20 min 11 s, 30 min 39 s). An order-24
Pick run was stopped at 26 min and repeated in 7 min after the quadrature grid was cached; two scan windows were
stopped at 40 and 47 min and replaced by short windows. The Mac was itself at load average 12 to 99 during the session.

## 2. Combination 1a: concavity of t -> log K(sqrt t)

Finite consequence: c(u) = u l''(u) - l'(u) < 0 on u > 0 (equivalent to strict concavity of t -> log K(sqrt t)).
Survival would need the condition to fail for DH, the heat controls and E_a on the kernel and to hold for the
positive comparisons.

PROVED (one line): for K_tau = e^{tau u^2} K, l_tau = l + tau u^2 and u l_tau'' - l_tau' = u l'' - l'. The condition
is exactly invariant under the heat factor for every real tau, so it cannot separate the heat controls.

MEASURED (`out_server/shape_light.json`; 100,000 points u = 1.5 j/10^5; E_a 10,000 points; 128-bit balls; every
sign certified):

| kernel | K > 0 | (log K)'' < 0 | u l'' - l' < 0 |
|---|---|---|---|
| zeta; heat -0.2, -0.05, 0.05; E_0.2, E_0.35; DH; Delta; chi_{-3}, chi_{-4}, chi_5, chi_8, chi_12, chi_{-15}, chi_17 | yes | yes | yes |
| chi_{-8}, chi_{-11}, chi_13 | yes | no on (0, 0.076), (0, 0.128), (0, 0.112) | yes |
| chi_{-19} | no on (0, 0.157) | yes where defined | yes where defined |
| chi_{-7} | yes | yes | no on (0, 0.2197) |
| T-NR (3, 2.2), (3, 2.05) | yes | no on (0.234, 0.346), (0.232, 0.345) | no on (0.2075, 0.3392), (0.206, 0.338) |
| T-NR (2, 2.1) | yes | no on (0.132, 0.274) | no on (0, 0.268) |
| Liouville (u >= 0) | yes | yes | no on (0, 0.2424) |

The DH row repeats the Arb certificate of `c1-missing-controls` Part C on this grid. The failures of T-NR are read on
the kernel (three shifted copies of Phi). Classification: closed.

## 3. Combination 1b: positive-definiteness of the pair kernel

### 3.1 Statement tested

K_t = e^{tu^2} K, H_t(x) = int K_t cos(xu) du, D_t = H_t'^2 - H_t H_t'', Q_t(v) = int u^2 K_t(v+u) K_t(v-u) du.
CLASSICAL (Bochner): D_t >= 0 on R iff every Gram matrix [Q_t(v_i - v_j)] is positive semidefinite. On the grid
v_i = i h the Gram matrix is symmetric Toeplitz with symbol (1/h) sum_k D_t((theta + 2 pi k)/(2h)); it reads D_t up
to the Nyquist abscissa x_N = pi/(2h). Statistic: the first size n* with a negative pivot E_m = det G_{m+1}/det G_m
(Levinson-Durbin), as a function of h, for n up to 4000 (standard set), 8192 and 12,288.

Survival would need: zeta positive definite at every size, and each control failing at a grid too coarse to resolve
its first non-real zero pair, or failing for a reason not tied to that pair.

Arithmetic. Q_t by the trapezoid rule on the kernel grid u = j/512 (j/1024, j/2048 for the larger x_N), precision
700 + 2.2 (2 c x_N)/ln 2 bits with c = pi/8 (pi/4 for Delta and E_a), i.e. 990 to 8,719 bits. Ball arithmetic loses
about 40 bits per Levinson step (measured; wrapping in the predictor update), so the recursion runs on midpoints:
multiprecision floating point, not an enclosure. Every failure is then certified separately: the predictor c at the
first negative pivot is taken as an exact vector and c^T G c is evaluated in balls; "certified" below means that ball
is negative. Passes are MEASURED (all pivots positive in floating point at the stated precision; standard set
repeated at 1.3 times the precision with identical first-failure sizes and pivot values).

### 3.2 Standard set (n = 4000; x_N = 25, 50, 101, 201, 402, 804)

First negative size n* (n* h in brackets); PD = all 4000 pivots positive. Mac run at 1.3 times the precision
(`out/gram_std_p13.json`); server run at the base precision: `out_server/gram_std.json`. The two runs agree in all 168 cases (first-failure size, number of negative pivots, and logarithm of the last pivot to 1e-9).

| object | t | x_N = 25 | 50 | 101 | 201 | 402 | 804 | first x with D_t < 0 (scan to 810) |
|---|---|---|---|---|---|---|---|---|
| zeta | 0, 0.05, 0.2, 0.5 | PD | PD | PD | PD | PD | PD | none |
| chi_{-3} (t = 0, 0.25), chi_{-4}, chi_5, chi_{-7}, chi_{-19}, Delta | 0 | PD | PD | PD | PD | PD | PD | none |
| heat tau = -0.05 (zeta, t = -0.05) | | PD | PD | PD | PD | PD | PD | none below 810 |
| heat tau = -0.1 | | PD | PD | PD | PD | PD | PD | none below 810 (830.5, section 3.3) |
| heat tau = -0.2 | | PD | PD | PD | PD | PD | 2274 (4.44) | 667.8 |
| DH | 0 | PD | PD | PD | 342 (2.67) | 578 (2.26) | 1051 (2.05) | 170.9 |
| DH | 0.1 | PD | PD | PD | 513 (4.01) | 920 (3.59) | 1441 (2.81) | 171.0 |
| DH | 0.25, 0.5, 1.0 | PD | PD | PD | PD | PD | PD | none below 810 |
| E_0.35 | 0 | PD | 65 (2.03) | 103 | 163 | 240 | 320 (0.62) | 27.6 |
| E_0.35 | 0.1 | PD | 87 (2.72) | 148 | 253 | 415 | 655 | 27.7 |
| E_0.35 | 0.25, 0.5 | PD | PD | PD | PD | PD | PD | none below 810 (H has 411 sign changes there; none at t = 0) |
| E_0.2 | 0 | PD | 118 (3.69) | 212 | 375 | 662 | 1148 | 27.9 |
| T-NR (3, 2.2) | 0 | 26 (1.62) | 46 | 82 | 142 | 242 | 396 | 5.0 |
| T-NR (3, 2.2) | 0.25 | 65 (4.06) | 125 | 240 | 459 | 874 | 1661 | 5.4 |
| T-NR (3, 2.2) | 0.5 | PD | PD | PD | PD | PD | PD | none below 810 |
| T-NR (3, 2.05) | 0 | 56 (3.50) | 107 | 204 | 386 | 729 | 1371 | 5.4 |

Every failure in the table is certified (ball value of c^T G c negative; for example DH at x_N = 201:
-1.917e-29 Q_t(0)). D-scan (`t_gram.py scan`, step 0.1, balls, no undetermined point): for DH at t = 0 the negative
intervals of D below 810 are [170.9, 171.9], [228.1, 228.6], [332.9, 333.1], [353.0, 353.8], [480.3, 481.4],
[641.2, 642.3] and two more; the first two are twice the heights 85.70 and 114.16 of the off-line zeros on record.

Reading. (i) No control fails at any size while x_N is below the first abscissa where D_t < 0: DH is positive
definite to n = 4000 at x_N = 101 and fails at x_N = 201; E_a passes at x_N = 25 and fails at 50; heat tau = -0.2
passes at 402 and fails at 804. (ii) At the first resolving grid, n* = 342 (DH, abscissa 171), 65 (E_0.35, 27.6),
26 (T-NR, 5.0), 2274 (heat -0.2, 668), 5125 (heat -0.1, 830.5, at x_N = 1608): n* is 2.0 to 6.2 times the abscissa,
i.e. 4 to 12 times the height of the first non-real pair. (iii) Forward heat removes the failure: DH and E_0.35 are positive definite on the whole range for
t >= 0.25 and T-NR for t = 0.5, although DH has zeros off the line; in the range t in [0.25, 0.5] of the source
statement the test does not separate DH at any size reached.

### 3.3 Largest sizes

| object | kernel grid | x_N (height) | n | n h | result | where |
|---|---|---|---|---|---|---|
| zeta, t = 0 | 1/2048 | 3217 (1608) | 12,288 | 6 | all pivots positive; last pivot e^{-1227.5} Q(0); 8,719 bits | Mac, 944 s |
| zeta, t = 0 | 1/2048 | 3217 | 16,384 | 8 | all pivots positive; last pivot e^{-1227.4947} Q(0), equal to the Mac value at n = 12,288 to 8 digits | server, 2699 s |
| zeta, t = 0 | 1/1024 | 1608 (804) | 8,192 | 8 | all pivots positive | server, 418 s |
| chi_{-3}, t = 0 | 1/1024 | 1608 | 8,192 | 8 | all pivots positive | server, 486 s |
| DH, t = 0 | 1/1024 | 1608 | 8,192 | 8 | n* = 1919, 72 negative pivots, certified (-6.4e-268) | server, 577 s |
| heat tau = -0.2 | 1/1024 | 1608 | 8,192 | 8 | n* = 2873, 44 negative pivots, certified | server, 487 s |
| heat tau = -0.1 | 1/1024 | 1608 | 8,192 | 8 | n* = 5125 (n h = 5.0), 8 negative pivots, certified (-5.1e-261) | server, 546 s |
| heat tau = -0.05 | 1/1024 | 1608 | 8,192 | 8 | all pivots positive | Mac, 136 s |
| heat tau = -0.05 | 1/2048 | 3217 | 12,288 | 6 | n* = 11,833 (n h = 5.78), 2 negative pivots, certified (-6.7e-534 Q(0)) | Mac, 1237 s |
| heat tau = -0.05 | 1/2048 | 3217 | 16,384 | 8 | n* = 11,833, 6 negative pivots, certified (same value -6.709e-534 Q(0)) | server, 3419 s |

D-scan for tau = -0.1 to x = 1700 (server, 4,937 bits): negative on [830.5, 830.5], [1080.9, 1081.0],
[1128.5, 1129.0], [1261.1, 1261.6], [1457.0, 1457.5], [1501.4, 1502.0]; the first is twice the height 415.5 at which
`s1-kernel-shear-norms` records the first deficit of sign changes for tau = -0.1, and 667.8 is twice its 334.2 for
tau = -0.2.

### 3.4 The heat control tau = -0.05

MEASURED. At x_N = 1608 (n = 8192, n h = 8) the Gram matrix for tau = -0.05 is positive definite; at x_N = 3217 the
first negative pivot is at n* = 11,833 on both machines, with a certified negative quadratic form. Scans of D with step
0.02 (`out/scan_tm005_*.json`, balls at 4,189 to 7,779 bits, no undetermined point):

| window in x | intervals with D < 0 | closest pair of zeta zeros there (heights; gap) |
|---|---|---|
| [800, 1400] | none | |
| [1400, 2000] | [1501.64, 1501.68] | 750.656, 750.966; 0.310 |
| [2100, 2120] | [2109.62, 2110.04] | 1054.781, 1055.002; 0.221 |
| [2640, 2700] | [2658.04, 2658.54], [2691.08, 2691.42] | 1329.044, 1329.205; 0.162 and 1345.477, 1345.731; 0.254 |
| [2820, 2840] | [2831.20, 2831.66] | 1415.586, 1415.782; 0.196 |

Not scanned: [2000, 2100], [2120, 2640], [2700, 2820], [2840, 3217] (two long windows were stopped at the time limit).
`gaps.py` lists the smallest gaps between consecutive zeros below height 1612 (mpmath): the five pairs above are among
the six smallest (the other one, at heights 1610.00 and 1610.25, is above the Nyquist abscissa), and the
isolated-pair estimate t = -g^2/8 (g the gap in x) for the time at which a pair leaves the axis under backward flow gives -0.048, -0.024, -0.013, -0.032, -0.019 for them, all above -0.05. The intervals
found for tau = -0.1 (830.5, 1080.9, 1128.5, 1261.1, 1457.0, 1501.4) sit at close pairs in the same way (heights
415.02/415.46, 540.21/540.63, 564.16/564.51, 630.47/630.81, 728.41/728.76, 750.66/750.97; mpmath), and 667.8 for
tau = -0.2 at 333.65/334.21.

Consequences. (i) D_{-0.05} < 0 at real points, so H_{-0.05} is not in the Laguerre-Polya class (CLASSICAL) and has
non-real zeros; the first interval is at height 750.8. This contradicts the entry "tau = -0.05: none below 5000" in
the heat table of `s1-kernel-shear-norms` (first deficit of sign changes), which should be re-examined; its entries
for tau = -0.2 and -0.1 (334.2, 415.5) agree with the scans here (667.8/2, 830.5/2). (ii) The interval at 1501.66 is
0.04 wide and is not seen by the Gram matrix at x_N = 1608 with n h = 8: the matrix needs n h of the order of the
inverse width as well as x_N above the abscissa. The failure at x_N = 3217 appears at n h = 5.78, where the wider
intervals (0.3 to 0.5) near 2110 to 2831 are resolved. (iii) For the screening question this is the same pattern:
the heat control is separated only by resolving the first pairs that have left the axis.

### 3.5 Persistence under the heat factor

Q_t of kappa_tau is Q_{t+tau} of kappa: the family is covariant, not invariant. The condition "positive definite for
all t in [0, 1/2]" holds for kappa_tau with tau > 0 and fails for tau < 0 only on grids that resolve the first
non-real pair (heights 334, 415 and 751 for tau = -0.2, -0.1, -0.05). At the sizes of the standard set the
controls tau = -0.1 and -0.05 pass.

Classification: closed (verified height in another form).

## 4. Combination 1c: central moment ratio

M_k(tau) = int u^k e^{tau u^2} K du. PROVED (as in the source, for any K >= 0 even): H_tau(x) >= M_0 (1 - x^2 M_2/(2 M_0)),
so H_tau > 0 for abs(x) < x_c = sqrt(2 M_0/M_2); d/dtau (M_2/M_0) = Var_tau(u^2) >= 0. The step uses K >= 0 only.

MEASURED (`out_server/mom.json`, trapezoid step 1/256, 256-bit balls). First real zero from the D-scans.

| kernel | M_2/M_0 at tau = 0 | at tau = 1/2 | < 2/169 | x_c(1/2) | first real zero of H_0 (x) |
|---|---|---|---|---|---|
| zeta | 0.0115525 | 0.0116732 | yes | 13.09 | 28.27 |
| heat -0.2 / -0.05 / 0.05 | 0.0115049 / 0.0115406 / 0.0115645 | 0.0116246 / 0.0116610 / 0.0116853 | yes | 13.12 / 13.10 / 13.08 | 28.4 / 28.3 / 28.3 |
| chi_{-3} | 0.0283505 | 0.0290388 | no | 8.30 | 16.1 |
| Delta | 0.0280879 | 0.0288191 | no | 8.33 | 18.5 |
| chi_{-4}, chi_5 | 0.0390074, 0.0392286 | 0.0402103, 0.0405340 | no | 7.05, 7.02 | 12.1, 13.3 |
| chi_{-7}, chi_8, chi_{-8}, chi_12, chi_13, chi_{-11} | 0.064 .. 0.130 | 0.067 .. 0.137 | no | 5.45 .. 3.82 | 9.0 (chi_{-7}) |
| chi_{-19}, chi_{-43} (signed kernels) | 0.2847, 0.8236 | 0.2946, 0.7562 | no | bound not valid | 3.1 (chi_{-19}) |
| DH | 0.0490348 | 0.0508341 | no | 6.27 | 10.2 |
| E_0.35, E_0.2 | 0.0230913, 0.0231005 | 0.0236075, 0.0236171 | no | 9.20 | none (H > 0 on R) |
| T-NR (3, 2.2), (3, 2.05) | 0.1552, 0.1606 | 0.1705, 0.1759 | no | 3.43, 3.37 | 28.3 |

The inequality with the constant 2/169 is a statement about one kernel; the three heat controls satisfy it, and it
stays true for kappa_tau up to tau about 1.2 by the slope 2.4e-4 per unit tau (extrapolated, not computed). The
general form (H > 0 below x_c) holds for every nonnegative kernel, DH included, and x_c is below the first real zero
in every row. For chi_{-43} the ratio decreases with tau, which is possible only for a signed kernel. Classification:
closed (kernel-blind; flow-monotone).

## 5. Combination 2: exponential family and Fisher bound

### 5.1 Statement tested

Source normalisation (PR 41 section 2): U = 2u, mu_x = p(x) = F'(x)/F(x), I_x = p'(x), phi_x(y) = F(x+iy)/F(x),
Z = F'/F. Conditions: E1 p(a) > 0; E2 p'(a) > 0 (the same statement as K''(a) > 0); E3 (p(a)/a)' < 0; bound
Re Z(x+iy) >= B(x,y) = mu_x - sqrt(I_x) sqrt(1 - abs(phi_x)^2)/abs(phi_x). Reach y*(x): first y with B = 0, i.e.
abs(phi_x(y))^2 = I_x/(mu_x^2 + I_x). "Effective strip": the set abs(y) < y*(x) where the bound proves Re Z > 0.

Survival would need a control for which the bound is false or y*(x) passes the height of a zero with real part x, or
p(a)/a non-monotone, with the positive comparisons passing.

PROVED: (a) for K >= 0 the bound is Cauchy-Schwarz and cannot fail, whatever the zeros; (b) a quadruple of zeros
+-b +- i g contributes 4X/(X^2 + 4 b^2 g^2), X = a^2 + g^2 - b^2, to p(a)/a, which is positive and decreasing in a
whenever g > (1 + sqrt 2) b; so E1 and E3 hold term by term for zeros at height above 1.21 with abs(b) <= 1/2 and
cannot register them; (c) near the axis abs(phi_x(y))^2 = 1 - I_x y^2 + O(y^4) and mu_x = I_0 x + O(x^3), so
y*(x) = x (1 + O(x^2)) for every kernel.

### 5.2 Results

MEASURED (`out_server/expfam.json`; 400 points a = 0.125 .. 50; 21 values of x; 192 grid values of y per x (160 up to y = 40 and 32 up to 4 y*(x)); 256-bit balls, trapezoid step min(1/128, sigma_x/6)).

| kernel | E1 | E2 | E3 | y*(0.1) | y*(0.5) | y*(1) | y*(10) | y*(100) | y*(10^3) | y*(10^4) | Re Z < B at |
|---|---|---|---|---|---|---|---|---|---|---|---|
| zeta | + | + | + | 0.09999 | 0.4989 | 0.9915 | 7.497 | 35.63 | 138.1 | 500.5 | 0 of 4032 |
| heat -0.2 / -0.05 / 0.05 | + | + | + | 0.09999 | 0.4989 | 0.9915 | 7.492 / 7.496 / 7.498 | 35.61 / 35.63 / 35.64 | 138.0 / 138.0 / 138.1 | 500.4 / 500.5 / 500.5 | 0 |
| chi_{-3} | + | + | + | 0.09998 | 0.4978 | 0.9836 | 7.84 | 36.89 | 140.7 | 505.9 | 0 |
| chi_{-4}, chi_5, chi_{-7}, chi_8 | + | + | + | 0.09998 | 0.497 | 0.98 | 8.0 .. 9.0 | 37.3 .. 38.0 | 141 .. 143 | 507 .. 510 | 0 |
| Delta | + | + | + | 0.09998 | 0.4973 | 0.9795 | 6.458 | 26.79 | 101.2 | 363.5 | 0 |
| chi_{-19} (signed kernel) | + | + | + | 0.1003 | 0.5441 | 3.499 | 9.939 | 39.05 | 144.4 | 513.6 | 0 |
| chi_{-43} (signed) | + | + | + | 0.1014 | 3.288 | 5.048 | 10.48 | 39.76 | 145.7 | 516.6 | 103 of 4032 (first at x = 0.02, y = 1.5; minimum of Re Z - B: -0.278) |
| chi_{-163} (signed) | + | p' < 0 on [0.25, 2.25] | + | 5.417 | not defined (I_x < 0 for x = 0.3 .. 2) | | 11.16 | 40.73 | 147.6 | 521.0 | 93 of 2880 (minimum -3.40) |
| DH | + | + | + | 0.09998 | 0.4979 | 0.9853 | 8.61 | 37.59 | 141.8 | 508.2 | 0 |
| E_0.35 | + | + | + | 0.09998 | 0.4975 | 0.9807 | 6.109 | 26.50 | 101.1 | 363.5 | 0 |
| T-NR (3, 2.2) / (3, 2.05) | + | + | + | 0.09998 / 0.1000 | 0.4992 / 0.5007 | 1.014 / 1.028 | 11.67 | 38.98 | 143.2 | 510.8 | 0 |

(E3 "+" means (p/a)' < 0 at all 400 points.)

Reading.
- The bound is never false for a control with a nonnegative kernel (a theorem), and y*(x) at the real part of each
  control's off-line zeros is far below their height: DH (x = 0.3085, zero at height 85.7): y*(0.3) = 0.2995;
  E_0.35 (x = 0.35, height 14.13): y*(0.4) = 0.3987; T-NR (x = 0.4037, height 2.86): y*(0.4) = 0.3994; heat: as zeta.
- Reach in x. Inside the strip (x <= 1/2) the bound is positive only for abs(y) < 0.4989, against the first zero
  at 14.13. Outside it grows like y* = 5.0 sqrt(x) at x = 10^4, a region where Re Z > 0 is classical. The source's
  remark (ineffective where abs(phi_x) is small) is quantitative: the bound needs abs(phi_x)^2 above
  I_x/(mu_x^2 + I_x), which is 0.9995 at x = 0.1 and 0.956 at x = 1.
- The conditions that can fail are those of a probability density. They fail for L(s, chi_{-163}) (first zero at
  height 0.20: p' < 0 just above it) and L(s, chi_{-43}), whose theta kernels change sign, and hold for every control.

Classification: closed (real-axis statement of a positive measure; all controls pass; two Euler-product comparisons
fail). Liouville and unimodular twists: not formulable (no even kernel, no symmetric family).

## 6. Combination 3: total-positivity ladder, Pick determinants, Schwarzian

### 6.1 Definitions

Source variables (PR 51, PR 53): V = -log kappa, f = tV', W = 4 kappa''/kappa, C(t) = (1/4) int_t^inf s kappa(s) ds,
h = C/kappa. Signs S1 f' > 0; S2 h' < 0; S3 W' > 0; S4 W''f' - W'f'' > 0; S5 h''f' - h'f'' > 0. Next source
determinants S_Q = 256 W_5(kappa, t kappa', kappa'', t kappa''', kappa'''')/kappa^5 and S_H = 16 W_5(kappa, t kappa',
kappa'', t kappa''', C)/kappa^5. All signs are invariant under t = 4u, so everything is computed in u.
Ladders: A_m = W_m(g_0, .., g_{m-1})/K^m with g = (K, uK', K'', uK''', K'''', uK^(5), K^(6), uK^(7)); B_m = the same
with the last column replaced by C(u) = int_u^inf sK. Then A_2 = -f' K^2 (S1), B_2 = h' (S2), A_3 and B_3 carry the
signs of S4 and S5 (reversed), A_5 = S_Q/256, B_5 = S_H/16. Collocation form: det[g_j(u_i)]/prod K(u_i) at increasing
nodes. Pick form: P = [(L(x_i) + L(x_j))/(x_i + x_j)], L = F'/F, x_i > 0; four-node criterion (PR 50):
2h'h''' - 3h''^2 > 0 and 2j'j''' - 3j''^2 > 0 for h(U) = L(sqrt U)/sqrt U, j = U h.

Survival would need a sign pattern that holds for zeta and the positive comparisons at some order and is violated by
DH, heat and E_a there.

### 6.2 Wronskian ladders on the grid (3a)

MEASURED (`out_server/shape_light.json`, `out_server/shape_heavy.json`; C(u) by 40-node Gauss-Legendre on cells of
width min(1/64, 1/rate); 384-bit balls; 2,000 points u = 1.5 j/2000, E_a 200; every sign certified). Entry: sign
pattern along u from 0 to 1.5. A_2, B_2, A_3, B_3 are S1, S2, S4, S5 up to sign.

| kernel | S1 | S2 | S3 | S4 | S5 | A_4 | B_4 | A_5 | B_5 | A_6 | B_6 | A_7 | B_7 | A_8 | B_8 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| zeta, heat -0.2, heat -0.05, heat 0.05 | + | - | + | + | + | + | + | -+ | -+ | +- | - | - | - | + | + |
| Delta | + | - | + | + | + | + | + | + | + | - | - | - | - | +-+ | -+ |
| chi_{5} | + | - | + | + | + | + | -+ | +-+ | +-+ | - | - | -+-+- | -+-+- | + | + |
| chi_{-3} | + | - | + | -+ | + | -+ | + | + | + | +- | - | +-+- | -+- | + | -+ |
| chi_{-4} | + | - | -+ | + | + | + | -+ | -+ | -+ | - | - | +-+- | +-+- | + | +-+ |
| chi_{-7} | + | - | +-+ | -+ | -+ | + | + | +-+ | + | -+-+- | +-+- | +- | -+- | +-+ | -+-+ |
| chi_{8} | + | - | + | -+ | -+ | + | + | +-+ | + | - | +-+- | -+-+- | -+- | +-+ | +-+-+ |
| chi_{-8} | -+ | - | -+ | + | + | +-+ | +-+ | + | + | -+- | +-+- | -+- | -+- | +-+-+ | -+-+ |
| chi_{-11} | -+ | - | -+ | + | + | -+-+ | +-+ | -+ | +-+ | -+- | +- | -+-+-+- | -+-+- | + | -+-+ |
| chi_{12} | + | - | -+ | + | + | +-+ | -+ | + | + | +-+- | -+- | +- | - | +-+ | -+-+-+ |
| chi_{13} | -+ | - | -+ | + | + | + | -+ | +-+-+ | +-+-+ | - | - | +-+-+-+- | +-+-+- | + | -+-+ |
| chi_{-15} | + | - | -+-+ | +-+ | + | -+ | +-+ | + | + | -+-+-+- | +-+-+- | +- | - | +-+-+-+-+ | -+-+ |
| chi_{17} | + | - | -+ | +-+ | +-+ | + | +-+ | + | + | -+-+-+- | +-+-+- | -+- | - | +-+-+-+ | -+-+-+ |
| chi_{-19} | + | - | +-+ | -+ | -+ | -+-+-+ | +-+ | -+ | -+-+ | -+-+- | +- | +-+- | +-+- | -+-+-+-+ | +-+-+-+-+ |
| DH | + | - | -+ | + | + | -+ | + | + | + | -+-+- | +- | - | -+- | +-+ | -+ |
| E_0.35, E_0.2 | + | - | + | + | + | + | -+ | -+ | -+ | +- | +- | +- | +- | +-+ | +-+ |
| T-NR (3, 2.2), T-NR (3, 2.05) | +-+ | +- | +-+ | + | + | +-+-+ | -+-+ | +-+ | + | +-+- | -+-+- | -+- | -+- | -+-+-+-+-+ | +-+-+-+-+ |
| T-NR (2, 2.1) | +-+ | +- | +-+ | + | + | +-+ | -+-+ | +-+ | +-+ | +- | -+- | -+-+-+- | -+-+- | + | -+-+-+ |
| Liouville (u >= 0) | + | +- | + | + | -+ | -+ | -+ | -+ | -+ | +- | +- | -+- | -+- | +-+ | -+ |

Crossings for zeta: A_5 at u = 0.0416 (t = 0.166), B_5 at u = 0.0304 (t = 0.122), A_6 at u = 0.1376. For heat
tau = -0.2 the A_5 crossing is at 0.0401, the others unchanged at the grid resolution. A local run with
tau = -50, -5, -1, 0.2, 1, 5 (3,000 and 300 points) gives the zeta pattern for S1..S5 and all ladder orders except a
shift of the A_5 and B_6 crossings at tau = -5; at tau = +50 log-concavity, S1 and S3 fail. Largest order reached: 8.

Reading: (i) the three heat controls have zeta's pattern at every order: no member of the ladder can separate heat;
(ii) no Euler-product comparison has zeta's pattern; the five source signs S1..S5 hold for chi_5 and Delta only
(2 of 13); (iii) DH satisfies S1, S2, S4, S5 and E_a satisfies all five; (iv) no column holds for zeta and all 13
comparisons and fails for DH, heat and E_a: S2 (h' < 0) holds for every even kernel of the list except T-NR.

### 6.3 Collocation determinants at random node tuples (3b)

MEASURED (`out_server/colloc_a_1e6.json`, server, 10^6 tuples per kernel; `out/colloc_b_local_1e6.json` and
`out/colloc_local_1e6.json`, Mac, 10^6 tuples per kernel; pool of 2048 nodes, half uniform on (0, 1.5], half
log-uniform on [0.001, 1.5]; 512-bit balls; 0 undetermined signs in about 2e8 determinants). Fraction of tuples with
sign +:

| kernel | A_2 | A_3 | A_4 | A_5 | A_6 | A_7 | A_8 | B_2 | B_3 | B_4 | B_5 | B_6 | B_7 | B_8 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| zeta (server) | 0 | 0 | 1 | 0.99463 | 0.04105 | 0.09983 | 0.85299 | 0 | 0 | 1 | 0.99666 | 0.00690 | 0.00708 | 0.99545 |
| zeta (Mac, other tuples) | 0 | 0 | 1 | 0.99465 | 0.04102 | 0.09992 | 0.85296 | 0 | 0 | 1 | 0.99671 | 0.00694 | 0.00709 | 0.99532 |
| heat -0.2 | 0 | 0 | 1 | 0.99489 | 0.04052 | 0.09963 | 0.85247 | 0 | 0 | 1 | 0.99664 | 0.00726 | 0.00760 | 0.99496 |
| heat -0.05 | 0 | 0 | 1 | 0.99472 | 0.04090 | 0.09985 | 0.85283 | 0 | 0 | 1 | 0.99671 | 0.00703 | 0.00722 | 0.99522 |
| heat 0.05 | 0 | 0 | 1 | 0.99460 | 0.04115 | 0.09996 | 0.85310 | 0 | 0 | 1 | 0.99672 | 0.00687 | 0.00699 | 0.99541 |
| Delta | 0 | 0 | 1 | 1 | 0 | 0 | 0.99912 | 0 | 0 | 1 | 1 | 0 | 0 | 0.98302 |
| chi_{-4} | 0 | 0 | 1 | 0.87023 | 0.28823 | 0.36599 | 0.63452 | 0 | 0 | 0.94836 | 0.81734 | 0.25671 | 0.23569 | 0.83315 |
| chi_5 | 0 | 0 | 1 | 0.89646 | 0.23869 | 0.30601 | 0.69677 | 0 | 0 | 0.91466 | 0.75413 | 0.34512 | 0.34736 | 0.66688 |
| chi_12 | 0 | 0 | 0.99945 | 0.70058 | 0.39291 | 0.40832 | 0.61361 | 0 | 0 | 0.86961 | 0.70382 | 0.29035 | 0.20916 | 0.71275 |
| chi_{-3} | 0 | 0.06717 | 0.78509 | 0.74147 | 0.22490 | 0.15026 | 0.91916 | 0 | 0 | 1 | 1 | 0 | 0.00003 | 0.98409 |
| chi_8 | 0 | 0.14461 | 0.74296 | 0.80769 | 0.10649 | 0.20511 | 0.64155 | 0 | 0.06493 | 0.97466 | 0.99680 | 0.10554 | 0.29574 | 0.56796 |
| chi_{-7} | 0 | 0.25433 | 0.61048 | 0.65061 | 0.24754 | 0.33326 | 0.51158 | 0 | 0.20160 | 0.79844 | 0.88812 | 0.17961 | 0.34560 | 0.45322 |
| chi_{-19} (signed) | 0.149 | 0.344 | 0.594 | 0.521 | 0.490 | 0.529 | 0.463 | 0.486 | 0.497 | 0.475 | 0.451 | 0.523 | 0.497 | 0.501 |
| DH (server) | 0 | 0 | 0.95481 | 0.99932 | 0.00003 | 0.13995 | 0.70474 | 0 | 0 | 1 | 1 | 0.10431 | 0.26760 | 0.56074 |
| DH (Mac) | 0 | 0 | 0.95492 | 0.99933 | 0.00003 | 0.13999 | 0.70325 | 0 | 0 | 1 | 1 | 0.10373 | 0.26812 | 0.55989 |
| T-NR (3, 2.2) | 0.132 | 0.274 | 0.639 | 0.566 | 0.474 | 0.475 | 0.514 | 0.358 | 0.405 | 0.509 | 0.456 | 0.555 | 0.546 | 0.471 |

| E_0.35 (server, 3 x 10^5 tuples) | 0 | 0 | 1 | 0.86670 | 0.33122 | 0.54052 | 0.29887 | 0 | 0 | 0.96493 | 0.82851 | 0.38463 | 0.60419 | 0.24170 |

The second batch was also run on the server with 3 x 10^5 tuples per kernel (`out_server/colloc_b.json`): the
fractions agree with the Mac values to 2e-3 (for example chi_5 A_5: 0.89672 against 0.89646).

Reading: zeta has a strict sign at orders 2, 3, 4 in both ladders and none from order 5. At order 4 (A_4) the set
that passes is zeta, Delta, chi_{-4}, chi_5, E_0.35 and the three heat controls; DH fails in 4.5 % of tuples, chi_12 in
0.055 %, chi_{-3} in 21.5 %, chi_8 in 25.7 %, chi_{-7} in 39 %. The heat controls differ from zeta by at most 5e-4 in
any column. Classification of 3a and 3b: closed.

### 6.4 Pick determinants and the Schwarzian criterion (3c)

MEASURED. Pool of 2048 nodes (half uniform on (0, 4), half log-uniform on [0.01, 100]); L from the kernel by the
trapezoid rule with step 2.3/(prec ln 2) (so that the quadrature error is below the working precision);
1024-bit balls for orders 1..8, 3072 bits and a pool of 512 for orders 1..24, 6144 bits for orders 1..40; LDL pivots;
0 undetermined signs. The 10^6-tuple column is the Mac run (`out/pick8_local_1e6*.json`); the server run with
3 x 10^5 tuples per kernel (`out_server/pick8a.json`, `pick8b.json`) and the server order-24 run for zeta and DH
(`out_server/pick24.json`) give the same outcome in every row (for example E_0.35: 140,596 of 300,000 negative at
order 7; T-NR (3, 2.2): 155,065 at order 4).

| object | 10^6 tuples, orders 1..8 | 10^4 tuples, orders 1..24 | first order with a negative determinant |
|---|---|---|---|
| zeta | all positive | all positive | none to order 40 (4000 tuples, 6144 bits) |
| chi_{-3} | all positive | all positive | none |
| chi_{-7} | all positive | | none |
| chi_{-4}, chi_5, chi_8, chi_{-19}, Delta | all positive | | none |
| DH | all positive | all positive | none to order 40 (4000 tuples) |
| heat tau = -0.2 | all positive | all positive | none to order 40 (4000 tuples) |
| heat tau = -0.05, 0.05 | all positive | | none |
| E_0.35 | negative at order 7 in 468,553 tuples, at order 8 in 496,092 | negative at orders 7..12 and 15..24 | 7 |
| E_0.2 | negative at order 8 in 608,509 tuples | | 8 |
| T-NR (3, 2.2) | negative at order 4 in 517,765 tuples (5: 483,935; 6: 185,229; 7: 44,018; 8: 7,772) | | 4 |
| T-NR (3, 2.05) | negative at order 4 in 102,997 tuples (5: 603,899; 6: 389,415; 7: 122,081; 8: 26,509) | | 4 |

Schwarzian criterion on 400 points x in [0.01, 100] (`out_server/schw.json`, 256-bit balls; equivalent to order-4
Pick positivity given the three-node hypotheses): both signs positive for zeta, chi_{-3}, chi_{-4}, chi_5, chi_{-7},
chi_8, chi_{-19}, Delta, DH, heat (3), E_0.35, E_0.2. T-NR (3, 2.2): 2h'h''' - 3h''^2 < 0 for x < 2.49;
T-NR (3, 2.05): for x < 1.16.

Planted pair (`planted.py`, Mac, 4096 bits, orders to 40, 60 tuples per case, pool 160): L = L_zeta + the term of one
quadruple +-b +- i g. First order with a negative pivot (range over the tuples):

| g | 0 | 2 | 4 | 8 | 16 | 32 | 64 | 85.7 | 128 |
|---|---|---|---|---|---|---|---|---|---|
| b = 0.3 | 1-6 | 3-7 (mode 4) | 4-8 (4) | 6-9 (6) | 12-15 (12) | 28-31 (29) | none <= 40 | none | none |
| b = 0.05 | 1-7 | 4-9 (5) | 5-9 (6) | 7-11 (8) | 14-17 (15) | 32-35 (33) | none <= 40 | none | none |

T-NR (zeros at height 2.86, b = 0.404) fails at order 4 and E_0.35 (height 14.13) at order 7 to 8, on the same curve.
The order needed grows in proportion to the height (0.9 g at g = 32 for b = 0.3) and depends weakly on b. DH (first
off-line zero at height 85.7) is predicted to pass beyond order 40 on these nodes, consistent with the record
"DH passes Pick positivity to order 100 on nested nodes" and with the measured passes to order 40.

Classification of 3c: closed (verified height in another form; orders 2..8 do not separate DH or heat).

Silent cell U8. This lane adds to the searched range: Wronskian and collocation ladders of orders 5 to 8 (two
ladders), nodes in (0, 1.5] in the u-variable, in the kernel without polar terms; real Pick determinants of orders
5 to 40 with nodes up to 100. No functional found has one strict sign on zeta and the positive
comparisons and the opposite on each of T-NR, E_a, HEAT; HEAT has zeta's sign in every entry. Largest order
reached: 8 for the ladders (10^6 tuples), 24 for Pick on 10^4 tuples, 40 for Pick on 4000 tuples (zeta, DH, heat -0.2).

## 7. Combination 4: truncated kernel and modular ODE system

### 7.1 Truncated kernel (4a)

Phi_N = x^{1/4} G_N(x), G_N(x) = sum_{n <= N} pi n^2 x (2 pi n^2 x - 3) e^{-pi n^2 x}. Each term is >= 0 for
x >= 3/(2 pi n^2); all terms are for x >= 3/(2 pi), i.e. u >= u_1* = (1/4) ln(3/(2 pi)) = -0.184816 (the source value
-0.36963 is the same threshold in its variable 2u).

ARGUED: for x small the full sum is 2 pi^2 x^{-5/2} e^{-pi/x}(1 + o(1)) by the modular relation, and the omitted tail is
pi N^3 x e^{-pi N^2 x}(1 + o(1)); they balance where pi N^2 x = pi/x up to logarithms, so the largest zero is
x_0(N) = (1/N)(1 + o(1)) and u_0(N) = -(1/4) ln N + o(1). This differs from the node's law
u_0 = (1/2) ln(5/(2 pi N^2)), which is derived with all Gaussians equal to 1; that holds for the kernel as coded in
imp-3347 (prefactors e^{4u}, e^{2u} with Gaussian exp(-pi n^2 e^{4u})), not for Phi.

MEASURED (`out_server/trunc.json`, balls, precision 256 + 1.15 pi N/(0.9 ln 2) bits; bisection to 70 steps):

| N | 1 | 2 | 5 | 10 | 100 | 1000 | 4096 | 10,000 |
|---|---|---|---|---|---|---|---|---|
| N x_0(N) | 0.47746 (= 3/(2 pi)) | 0.64111 | 0.81110 | 0.89239 | 0.98648 | 0.99845 | 0.99959 | 0.99983 |
| u_0(N) | -0.18482 | -0.28443 | -0.45470 | -0.60411 | -1.15469 | -1.72733 | -2.07954 | -2.30263 |
| u_0 + (1/4) ln N | | -0.11114 | -0.05234 | -0.02846 | -0.00340 | -0.00039 | -0.00010 | -0.00004 |

Exactly one sign change of G_N on (3/(2 pi N^2), 3/(2 pi)) for every N = 2..100, 128, 181, 256 (600-point log grid,
no undetermined point); for larger N only the bracket was run. 1 - N x_0 is 0.19 to 0.47 times (ln N)/N.
Replay of the node with the coded kernel: u_0 = -2.46192, -3.13368, -3.81527, -4.50241 at N = 10, 20, 40, 80.

Controls (sign changes on u > 0 of the kernel truncated at N in {1, 2, 3, 4, 5, 7, 10, 20, 50, 100, 300}):
none for DH, Delta, Liouville, T-NR (2, 2.1) and 18 real characters (conductors 3 to 24); T-NR (3, 2.2): two at N = 1
only; chi_29: one at N = 3; chi_{-19}, chi_{-43}, chi_{-67}, chi_{-163}: one zero for every N >= 2, converging to
u = 0.158, 0.362, 0.474, 0.696 (zeros of the full kernels). Heat multiplies by a positive factor (same zeros as zeta).
E_a: a truncation by theta terms is not defined for the convolution kernel (not run).

Classification: closed. The sign structure reads the first coefficients against the conductor. DH passes; four
Euler-product comparisons fail.

### 7.2 ODE closure (4b)

Source system (PR 46): H = e^{u/4} theta_3(i e^u), a = H'/H, c = pi t (theta_4^4 - theta_2^4), v = pi^2 t^2 theta_2^4
theta_4^4, t = e^u: a' = 2a^2 + (v-1)/8, c' = 4ac + 2v, v' = v(8a - c). Verified at u = 0, 0.1, 0.37, 0.9, 1.6 with v
and c defined from a by the first two equations: residual of the third and difference to the closed forms below
1e-70 (256-bit balls).

Test for a general kernel: the dimension N(D) of the space of polynomials P of total degree <= D with
P(a, a', a'', a''') = 0, a = K'/K (collocation matrix of all monomials at as many points of (0.03, 1.1), Gaussian
elimination on midpoints at 1024 to 6144 bits; a pivot below 2^{-0.75 prec} counts as zero; the smallest non-zero
pivot is above 2^{-1774} at D = 7 with threshold 2^{-3456}, and above 2^{-2295} at D = 8 with threshold 2^{-4608}; zero
pivots are below 2^{-0.98 prec}). If one
relation of degree d exists, N(D) = binom(D - d + 4, 4) (its multiples).

| kernel | N(2) | N(3) | N(4) | N(5) | N(6) | N(7) | N(8) | lowest degree |
|---|---|---|---|---|---|---|---|---|
| H = e^{u/4} theta_3 (node) | 0 | 0 | 1 | 5 | 15 | 35 | 70 | 4 |
| chi_8 | 0 | 0 | 1 | 5 | 15 | 35 | not run | 4 |
| Delta, chi_{-4} | 1 | 5 | 15 | 35 | 70 | 126 | 210 | 2 |
| chi_{-8}, chi_12 | 1 | 5 | 15 | 35 | 70 | 126 | not run | 2 |
| chi_{-3} | 0 | 0 | 0 | 0 | 0 | 0 | 1 | 8 |
| zeta kernel Phi | 0 | 0 | 0 | 0 | 0 | 0 | 0 | above 8 |
| chi_5 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | above 8 |
| chi_{-7} | 0 | 0 | 0 | 0 | 0 | 0 | not run | above 7 |
| DH | 0 | 0 | 0 | 0 | 0 | 0 | 0 | above 8 |
| heat tau = 0.05, T-NR (3, 2.2) | 0 | 0 | 0 | 0 | 0 | 0 | not run | above 7 |

CLASSICAL (source not opened): the ring of quasimodular forms of a congruence subgroup is closed under d/dtau and has
transcendence degree 3, so the logarithmic derivative of any modular form, of any level, satisfies an algebraic
differential equation of order at most 3. The theta series of DH is a combination of two weight-3/2 theta series of
level dividing 100 and is covered; so are chi_{-3}, chi_5, chi_{-7}. "Closes a finite system of the same order" is
therefore expected for every kernel of this list except heat (the factor e^{tau u^2} adds 2 tau u to a, which is not
modular) and possibly T-NR; what varies is the degree. Degree 2 (a Chazy-type relation for a multiple of E_2) occurs
for the series that are a power of eta at tau or tau + 1/2: Delta = eta^24; sum chi_{-4}(n) n q^{n^2/8} = eta^3
(Jacobi); sum chi_12(n) q^{n^2/24} = eta (Euler); sum chi_{-8}(n) n q^{n^2/8} = e^{-i pi/8} eta(tau + 1/2)^3 (phases
e^{i pi n^2/8} = +-e^{i pi/8} according to n = +-1 or +-3 mod 8). Degree 4 for theta_3 and for chi_8, degree 8 for
chi_{-3}.

Classification: closed. The condition separates DH and heat from H = theta_3, but for a reason unrelated to zeros
and at the degree of H it fails equally for L(s, chi_{-3}), L(s, chi_5), L(s, chi_{-7}); it holds at lower degree
than H's for four other comparisons. For zeta the object that closes is H, not the kernel Phi of xi. It is not a statement on zeros, as the assignment anticipated.

## 8. Sizes, files, units

| stage | file | where | size |
|---|---|---|---|
| shape light | `out_server/shape_light.json` | server U1, 200 s | 24 kernels x 100,000 points |
| shape heavy | `out_server/shape_heavy.json` | server U1, 1621 s | 24 kernels x 2,000 points, orders 2..8 |
| Schwarzian | `out_server/schw.json` | server U1 | 15 kernels x 400 points |
| moments | `out_server/mom.json` | server U2 | 21 kernels |
| truncated kernels | `out_server/trunc.json` | server U2, 703 s | N to 10,000; 27 controls |
| ODE closure | `out_server/ode.json`, `out_server/ode8.json` | server U2 | degree <= 7 (13 kernels), 8 (7 kernels) |
| exponential family | `out_server/expfam.json` | server U2 | 18 kernels |
| collocation | `out_server/colloc_a_1e6.json`, `out_server/colloc_a.json`, `out_server/colloc_b.json`; `out/colloc_local_1e6.json`, `out/colloc_b_local_1e6.json` | server U5 (885 s), W5; Mac | 10^6 tuples x 14 kernels (server 6, Mac 10); 3 x 10^5 x 13 kernels (server) |
| Pick, orders 1..8 | `out/pick8_local_1e6*.json`; `out_server/pick8a.json`, `pick8b.json` | Mac; server W3, W4 (3777 s, 3631 s) | 10^6 tuples x 16 kernels (Mac); 3 x 10^5 x 16 (server) |
| Pick, orders 1..24, 1..40 | `out/pick24_local.json`, `out/pick40_local.json`; `out_server/pick24.json` | Mac; server W4 | 10^4 tuples x 5 kernels (order 24); 4000 x 3 (order 40); 10^4 x 2 (server, order 24) |
| planted pair | `out/planted.json` | Mac | orders to 40 |
| Gram, standard set | `out/gram_std_p13.json`; `out_server/gram_std.json` | Mac; server U8 | 168 runs, n = 4000, on each machine (two precisions) |
| Gram, large | `out_server/gram_mid.json`, `out_server/gram_big.json`; `out/gram_big_local_*.json`, `out/gram_tm005_1024.json` | server W6, W7; Mac | n = 8192 to 16,384 |
| D-scans | `out_server/gram_std.json`, `out_server/gram_big.json`; `out/scan_tm005_*.json` | server; Mac | x to 810 (28 pairs), 1700; windows to 2840 |
| zero gaps | `out/gaps.json` | Mac | zeros 140 to 1167 |

Code: `klib3.py` (kernels), `t_shape.py`, `t_gram.py`, `t_expfam.py`, `t_tp.py`, `t_trunc.py`, `planted.py`,
`gaps.py`, `summarize.py`, `val_*.py`, `mk_tasks.py`, `mk_tasks2.py`, `run_U*.sh` (server launch scripts), `run_local.sh`
(memory cap wrapper). Server units of this lane: rh-s3A/B/C (stopped after 3 minutes and replaced), rh-s3U1..U8,
rh-s3V3, V4, rh-s3W3..W7. All units of this lane are stopped (systemctl reports each inactive; logs copied to `server_logs/`).

Not run or not reached: Gram matrices beyond n = 16,384 and x_N = 3217; an interval-rigorous version of the
positive-definite passes (the failures are certified, the passes are multiprecision floating point); enclosed
truncation and quadrature tails; a continuum certificate for any grid statement; the unimodular twist; E_a in 4a;
Pick orders above 40; degree above 8 in 4b; the windows of section 3.4 listed as not scanned.

## 9. Three weakest points

1. Passes of 1b rest on floating-point Levinson pivots at 990 to 8,719 bits, repeated at a second precision for the
   standard set only; the largest zeta runs (n = 12,288 on the Mac, n = 16,384 on the server, x_N = 3217) used one
   precision (the two machines agree on the last common pivot to 8 digits).
2. Grid statements (1a, 3a) are pointwise at 2,000 to 100,000 points; a sign change between grid points narrower than
   1.5e-5 (light) or 7.5e-4 (heavy) would be missed. For zeta the source proofs cover the continuum for S1..S5 and
   the two order-5 determinants only.
3. Section 3.4 contradicts a number on file for tau = -0.05. It rests on a certified quadratic form at 8,719 bits
   (both machines), on certified signs of D at grid points in four windows, and on the list of close zero pairs; the
   zeros of H_{-0.05} themselves were not located, and four windows were not scanned.
