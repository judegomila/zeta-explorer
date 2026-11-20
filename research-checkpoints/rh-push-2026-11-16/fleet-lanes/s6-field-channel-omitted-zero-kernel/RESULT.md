# s6-field-channel-omitted-zero-kernel: screening of four field-channel / omitted-zero combinations

Lane `s6-field-channel-omitted-zero-kernel`, 2026-11-20. Screening arm. Labels: PROVED (short argument given here), CLASSICAL, MEASURED
(float64 unless a line says 60 digits), STRUCTURAL (follows from the definition of the control). No claim about RH or about Lambda. No bound
moves.

## 0. Verdict

Four combinations tested. **Survivors: 0.**

| # | combination | statistic | sizes reached | zeta | comparison L-functions | Davenport-Heilbronn (DH) | heat tau < 0 | zeta(s+a)zeta(s-a) | T-NR | sign twist / unimodular twist | classification |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | omitted-zero kernel K_l (gap cancellation, displacement leg, quarantine bound, spectator realness) | K_l = 2 sum over omitted zeros of 1/((x_l - y)(x_{l+1} - y)) for the table of the first N zeros: (a) from a longer list and from the prime side (all prime powers to 1e10, kernel cut at resolution 1/log X), (b) from the counting density; r_l = K(a)/K(b) | zeta: N = 1e4 .. 1e8 (15 table sizes, 2000 top gaps each; top gap at 20,000 further table sizes); prime side X = 1e4, 1e6, 1e8, 1e10 (455,052,511 primes and their powers) at 571 points; L-functions N = 1e4 .. 9e5; DH table to 1e5 (147,407 on-line zeros, 8138 off-line pairs) | the 10 source values of K_max(0) reproduced to 4 digits (1.4751 .. 2.8276). Prime side = zero-side reference to 7e-10 .. 8e-6 at every N, X and depth (section 4). r_l in [0.989, 1.002] at depth 100-300 and [0.9989, 1.0002] at depth >= 1000 (density from the last zero); with the count N used, |r_l - 1| < 2.9e-4 at depth >= 100. Top gap: r_l from 0.28 to 37 over table sizes, K_top/dens^2 median 2.14, largest 74 | same ranges: r_l in [0.996, 1.005] at depth 100-300; top gap r_l from 0.26 to 31. Prime side = reference to 2e-11 .. 3e-7 (chi mod 5 complex, chi_5) and to the list accuracy 5e-5 .. 8e-4 (chi_-4) | table below the first off-line zero (N = 43): r_l in [0.986, 1.005]. Table reaching past it: r_l leaves zeta's range at once (N = 45: up to 1.16; table to 1e4: median 36, to 9e4: median 274, at pairs more than 10 mean spacings from every off-line zero). The excess equals 2 sum Re 1/((x_l - y)(x_{l+1} - y)) over the off-line zeros | H_{-0.1}: table below the first pair (N = 211): r_l in [0.994, 0.9995]; table to 1000 (8 pairs below): up to 4.4; H_{-0.5}: the same pattern | no on-line list. Prime side on zeta's table: differs at every X (coefficients Lambda(n)(n^a + n^-a)) | on-line list = zeta's. q = 1000003: prime side identical to zeta's for X = 1e4 and 1e6 (blind); for X >= q, r_l = 4 .. 27 at the top gap and of order 1e2 .. 1e4 in the interior; function side: off-line zeros within 0.23 of every point. q = 3: differs at every X | Liouville and random sign: no zero table; on zeta's table the prime side differs from X = 1e4 on. Unimodular twist: translate of zeta | CLOSED. A weighted count of the zeros missing from the table |
| 2 | field-channel bracket for the first collision time (transfer modulus, bootstrap, two-sided Lipschitz, C_Lip reroute) | t_c of the flow of the full zero set against [ln(1 + eps' H^2/4)/(2 eps'), H^2/(8 theta(eps'))], eps' = 2 K(0); K_paper on [1e4, 1e6] | plateau table on 1e6 zeros; 84 windows of 200 zeros for zeta at heights 1.4e3 .. 1e12 (62 of them also by direct evaluation of H_t); 76 windows for four L-functions; 60 for DH; 9 for heat tables; 16 for T-NR | K_paper <= 2.4237067e-6 reproduced (source 2.42370832e-6), 10 plateaus. 84 of 84 windows inside the bracket; t_c/(H^2/8) in [1.0011, 1.0565]. Direct H_t against the zero flow: ratio in [0.99998, 1.0001] at 62 windows up to 1e12 | 76 of 76 inside | 60 of 60 inside, also with eps' computed from the on-line list only; 20 of these windows have an off-line zero inside the quarantine distance (nearest: 1.23 mean spacings, t_c at 0.968 of the bracket width) | 9 of 9 inside | no real zeros: no window | q = 1000003: 8 of 8 outside the declared bracket (t_c/(H^2/8) from 0.66 to 2.00); q = 3: 2 of 8 outside. Every window has off-line zeros at distance 0.06 .. 3.8 mean spacings from the record pair | not formulable (no real zeros known); translate | CLOSED. A theorem for every real configuration; an off-line zero enters only as its own term of eps' |
| 3 | per-site depth c g_k^2 (displacement residual, self-similar depth, strip propagation constant, field-Lipschitz surrogate) | minimal complex distance between the two zeros of a close pair and every other zero over t in [0, c g_k^2], c = 1/16, 1/8, 1/4, in mean spacings; transport coefficient on Im z = y* against 2/y*^2 | zeta 1.0e8 zeros (98,032 close pairs with unfolded gap < 0.1), 1.02e6 zeros at 1e9; L-functions 9.5e5; DH 8.5e5; alt 7.0e5; heat windows 3.9e6 .. 4.0e6; 60-digit recheck of the smallest values | floor (1e4, 1e5, 1e6, 1e7, 1e8 zeros): 1.035, 0.689, 0.254, 0.193, 0.115 at t = 0; with the flow 0.109 / 0.106 / 0.086 at 1e8. Up to 1e6 zeros the minimum over the depth is the value at t = 0 for every pair; no pair meets a spectator | 0.906 / 0.419 / 0.320 (chi: 1e4, 1e5, 9.5e5) | 0.600 at 1e4; 0.062 at 1e5 with one member-spectator collision inside c = 1/8 (floor 0). The triple sits 30 and 46 mean spacings from the nearest off-line zeros | tau = -1e-2: 0.520 / 0.164 / 0.104 (1e4, 1e5, 3.9e6); tau = -1e-4: equal to tau = 0 | no on-line list | identical to zeta (same list); with its off-line zeros the floor is the distance to the progression (at most 0.23 in ordinate units for q = 1000003) | no list; translate | CLOSED. The statistic is the nearest-neighbour distance of close pairs at t = 0 (triple-gap law of the on-line list) |
| 4 | isolation ratio of the minimal pair (gap ODE, fold law, rate identity, c_half, R1 transfer, c_glob) | rho = g/d_1 for the minimal pair of every window of N zeros, against 0.72 and c_half = 0.8980208880762339 | zeta: all windows of the first 1.0e8 zeros, N = 100 .. 1e5 (1,001,162 .. 1001 windows); windows at 1e9 and 1e12; L-functions; DH; alt; heat | rho > 0.72 in 4469 of 1,001,162 windows (N = 100), 219 of 333,720 (N = 300), 8 of 100,116 (N = 1000), 0 of 33,372 (N = 3000) and 0 for larger N; largest rho 1.77 / 0.998 / 0.939 / 0.688 / 0.337 / 0.182 / 0.077. Slope -1.75 (prediction N^(-5/3)); counts against the prime-side prediction (CUE kernel at N_eff): 4918 / 263 / 10.6 / 0.57 | 27 and 36 of 9464 (N = 100), 1 and 1 of 3154 (N = 300), 0 above | 63 of 8476 (N = 100; zeta's rate gives 38), 3 of 2825, 1 of 847 (N = 1000), 0 above. Events sit 5 to 31 mean spacings from the nearest off-line zero | 171 (tau = 0), 183, 161, 141, 121 of about 40,000 (N = 100): decreasing with the flow time | no on-line list | identical to zeta | no list; translate | CLOSED. Premise false for zeta at N <= 1000 and true above at the sizes reached; a statistic of the on-line list |

How each object enters. Combination 1: through its zeros (the table and the omitted set); the prime side uses the coefficients Lambda_F(n) at all
prime powers below X together and is the explicit formula, an identity for zeta and for the L-functions. Combinations 2, 3, 4 and the zero side
of 1: through the positions of the zeros only; no coefficient enters.

The pattern of the brief holds in all four. Control onsets against the heights of their off-line zeros:

| control | first off-line zero | combination 1 | combination 2 | combination 3 | combination 4 |
|---|---|---|---|---|---|
| DH | height 85.70 (after 43 on-line zeros) | table of 43 zeros passes; table of 45 zeros (one off-line pair below its top) fails. Lead 0 | no failure in 60 windows that contain 10 % off-line zeros | floor below zeta's from N = 8.2e4 on-line zeros (height 5.8e4): 1900 times the index of the first off-line zero | excess 1.7 at N = 100 (63 against 38 expected); needs about 8500 windows |
| heat tau = -0.1 | height 415.26 (after 211 real zeros) | table below 414.76 passes; table to 1000 fails. Lead 0 | no failure | on-line lists: floor follows the off-line fraction | rate falls with the flow time |
| T-NR q = 1000003 | height 0.227 | prime side blind for X < q (X = 1e4, 1e6 give zeta's numbers to all digits); fails for X >= q | fails in 8 of 8 windows; off-line zeros adjacent to every pair | on-line list identical to zeta | identical to zeta |
| T-NR q = 3 | height 2.86 | fails at X = 1e4 | fails in 2 of 8 windows | identical | identical |
| zeta(s+a)zeta(s-a) | height 14.13 (all zeros) | no table | no window | no list | no list |
| sign twist | no functional equation | no table; on zeta's table the mismatch starts at the first prime | not formulable | no list | no list |
| unimodular twist | none | translate of zeta | translate | translate | translate |

No test separated a control at a size below the height of its off-line zeros, and no statistic that separated used the primes: the prime side of
combination 1 separates T-NR only when the cut-off reaches q, DH only through a table that already contains the heights of its off-line zeros.

## 1. What would have counted as survival (written before the runs)

1. Kernel: r_l of zeta stays in a fixed range at every table size at a given depth below the table top, the prime side reproduces the zero
   side, and a control's r_l leaves that range at pairs farther than 10 mean spacings from each of its off-line zeros with a table that stops
   below its first off-line zero, or with a prime cut-off below the size at which its local factor differs.
2. Bracket: the collision time of zeta lies in the bracket at every window, and the collision time of a control leaves the bracket (computed
   from the on-line list) in a window with no off-line zero within the quarantine distance 2/sqrt(K_on) of the record pair.
3. Depth: the distance floor of zeta is stable over heights at a fixed number of close pairs, and a control's floor is lower by more than
   that spread among pairs with no off-line zero among the moving particles, at a number of zeros below the index of its first off-line zero.
4. Isolation: rho <= 0.72 for the minimal pair of every window of zeta at two sizes, and a control exceeds 0.72 at a rate that its own
   small-gap law does not give.

Outcome: none met. In 3 and 4 the first half fails for DH in the literal sense of the batch text (its on-line list has closer triples than
zeta's far from its off-line zeros), but only at sizes 2000 times past its first off-line zero, with no prime in the statistic and with T-NR
passing identically; this is the small-gap law of the on-line list recorded in round 1 (exponent 3.0 for zeta, 2.1 for DH).

## 2. What was run, where, sizes

| object | size | where |
|---|---|---|
| zeta, first zeros (list of `s1-zero-flow-dynamics`, read only) | 100,116,297 ordinates to 4.27e7 | server |
| zeta windows at 1e9 (1,020,007 zeros, list of `s2-heat-root-drift-forces`) and 1e12 (1,000,004 zeros, offsets, list of `s3-dyson-burgers-zero-flow`) | read only | server |
| zeta, first 10,000,040 zeros (copy of `s1`) | read only | Mac |
| L(s, chi), L(s, chibar), chi mod 5 complex: 946,483 zeros each; L(s, chi_-4): 12,502; L(s, chi_5): 12,703; DH and alt on-line lists (847,701 and 698,848); heat windows at 1e7, tau = 0, -1e-4, -5e-4, -2e-3, -1e-2 (3.86e6 .. 4.02e6 zeros) | read only (lists of `s1`, `s3-heat-zero-velocity-channels`, `s5`) | server; shorter copies on the Mac |
| DH full zero set below 1e5: 147,407 on-line ordinates and 8138 off-line pairs; H_{-0.1} below 2000 (1435 real zeros, 41 pairs); H_{-0.5} below 2000 (929 + 294); T-NR q = 3 below 1e4 | read only (`s3-heat-zero-velocity-channels`, `c12-control-battery-harness`) | Mac, server |
| combination 1 zero side: 15 table sizes for zeta, 2000 top gaps and probes each, sum over the whole list (4e11 terms per table size); 20,000 random table sizes for the top gap | unit `rh-s6f-t1z`, 8 cores, 10 GB cap, 45 min | server |
| combination 1 prime side: sieve to 1e10 in 597 segments, 36 coefficient rows (9 objects x 4 cut-offs) at 571 points, 2.6e11 sine and cosine evaluations | unit `rh-s6f-t1p`, 8 cores, 6 GB cap, 16 min | server |
| combination 1 on DH, heat tables, T-NR q = 3 with their off-line zeros | 2 to 30 s each | Mac |
| combination 2: plateau scan on 1e6 zeros; 84 + 76 + 60 + 9 + 16 windows of 200 zeros with the flow of the full zero set; 62 direct evaluations of the collision time through H_t | units `rh-s6f-t2`, `rh-s6f-t2tnr`, 3 and 2 cores, 4 GB cap | server (repeat on the Mac for the lists held there) |
| combination 3: every pair with unfolded gap < 0.1 on every list (98,032 pairs for zeta), 18 moving particles, 600 frozen, 360 RK4 steps; mpmath recheck at 60 digits | unit `rh-s6f-t3`, 3 cores, 4 GB cap, 25 min | server (repeat on the Mac to 1e7 zeros) |
| combination 4: every window of N = 100 .. 1e5 on every list | unit `rh-s6f-t4`, 4 cores, 12 GB cap, 2 min | server |

Local runs went through `scripts/memcap.sh 8` (one transport run was killed by the cap at N = 1e6 and repeated with smaller blocks). Server
runs went through `rhrun` only. The machine had 34 to 55 GB available during the lane, so every unit after the first two was requested with
4 to 6 GB. One duplicate launch of the prime-side unit happened (a waiting loop and a manual launch); both units were stopped by name and one
was started again. All units of this lane have ended or were stopped by unit name. GPU 1 was at 100 % utilisation by other jobs and was
not used: the batched flows of combination 3 take 25 minutes on 3 CPU cores, so no float64 GPU stage was needed; the minima were rechecked at
60 digits on the CPU.

## 3. Method and validation

Conventions. A zero is rho = 1/2 + i y. Flow of the source modules (imp-3725, imp-3933): dx_k/dt = -2 sum_{j != k} 1/(x_k - x_j); a lone pair of
gap g collides at g^2/8; this t is one quarter of the de Bruijn-Newman time in z = 2 gamma.

**Library** (`fk.py`, `fk.c`; `val_lib.py`). Complex digamma and log-gamma against mpmath: 7e-16 and 4e-12. Smooth count against
`siegeltheta`: 12 digits. G(x) = sum over all zeros of 1/(x - y) = Re[i xi'/xi(1/2 + i x)]: function value -1.18389554080 at x = 100.3,
archimedean part plus zeta'/zeta: the same 16 digits, 399 zeros plus the density tail: -1.18389608 (5e-7).

**Identity behind (a)** (CLASSICAL). For every omitted y, 2/((a - y)(b - y)) = (2/g)[1/(a - y) - 1/(b - y)], g = b - a, so K_l is a difference of
the field G at the two table points with the table's own terms removed. On the prime side G is cut at resolution 1/L, L = log X:
A_L(x) = sum over all zeros of k_L(x - y) = arch(x) + sum_{n <= X} w(log n/L)[Im c_n cos(x log n) - Re c_n sin(x log n)],
c_n = Lambda_F(n)/sqrt(n), with k_L(r) = L ktilde(rL), ktilde(rho) = int_0^1 w(u) sin(rho u) du, w = 1 on [0, 1/2] and a degree-11 smooth
step down to 0 on [1/2, 1]. ktilde(rho) rho - 1 = 8e-4 at rho = 55 and 2e-13 at rho = 911; at rho = 8 (one mean spacing at height 4e7 with
X = 1e10) the cut kernel is 22 % of 1/r. The comparison is therefore made kernel against kernel: K^L(prime) against K^L(ref), the same cut
kernel summed over the omitted zeros of the longer list, and K^L(dens), the same kernel against the density.

**Flow with regular pairs** (`flow.py`; `val_flow.py`). Disjoint pairs are carried as (c, u) = (centre, squared difference):
dc/dt = -2 sum (c - b)/((c - b)^2 - u/4), du/dt = -8 + 4u sum 1/((c - b)^2 - u/4), regular through u = 0, no square root in a derivative.
Checks: lone pair, collision time g^2/8 to all digits; symmetric triple, d^2/6 to 9.5e-9; three bodies against an unregularised RK4 with
200,000 steps: 3e-15; passage through the collision: Im = sqrt(8t - g^2)/2 to all digits; frozen linear far field against the moving third
body: 3e-10.

**Collision time by two independent routes** (zeta). (i) The zero flow: window of 200 zeros, 150 neighbours on each side moving, the next
20,000 on each side and the density tails as a frozen linear field. (ii) Direct evaluation of H_t: Riemann-Siegel sum with the heat factor
(sampler of `s1-zero-flow-dynamics`, copied to `zgen/`), the time at which the extremum between the two zeros reaches 0, by bisection. Ratio
(ii)/(i) at 62 windows: [0.9999832, 1.0000986] for heights 5e4 .. 4.3e7, [0.9999912, 1.0000117] at 1e9, [0.9999913, 1.0000097] at 1e12.
This fixes the time unit and both codes.

**Source values reproduced.** K_max(0) of imp-95518 at the ten re-anchors N' = 15323 .. 516200: 1.4751, 1.6103, 1.8599, 2.1243, 1.9839,
2.0255, 2.1818, 2.6621, 2.8276, 2.5348 (source: the same ten numbers), record pairs and gaps as in the source table. imp-3725: the ten
plateaus with the same boundaries, theta from 0.9971595 to 0.9998958, K_paper bounds 1.3013e-6, 2.4237e-6, 9.027e-7, 6.547e-7, 2.691e-7,
1.866e-7, 7.377e-8, 7.351e-8, 7.775e-9, 1.372e-9; maximum 2.4237067e-6 (source 2.42370832e-6).

**60-digit recheck** (combination 3). The systems giving the smallest values on each list were integrated again in mpmath at 60 digits with
150 and 300 RK4 steps: agreement with float64 to 12 digits in the final distances and to 6 digits or better in the minima (which fall between
steps): zeta 0.108656429373 / 0.1063155 / 0.086473900348; DH 0.074224541447 / 0.0702858 / 0.051747872948.

## 4. Combination 1: the kernel of the omitted zeros

Zero side, zeta (server; full table in `out/tables.md`):

| N | top height | K_max(0) (at the top gap) | first omitted zero (mean spacings) | r top gap | r depth 10-30 | r depth 100-300 | r depth >= 1000 | record pair: gap, K_l, r_l |
|---|---|---|---|---|---|---|---|---|
| 1e4 | 9877.8 | 2.616 | 1.02 | 1.04 | [1.006, 1.017] | [1.0006, 1.0018] | [1.0001, 1.0002] | 0.037698, 1.190e-3, 1.000036 |
| 15323 (anchor) | 14302.9 | 1.4751 | 2.68 | 0.34 | [0.910, 0.970] | [0.9915, 0.9972] | [0.9992, 0.9996] | 0.037698, 6.866e-4, 0.999953 |
| 1e5 | 74920.8 | 3.038 | 1.65 | 0.58 | [0.979, 0.995] | [0.9989, 0.9997] | [0.9999, 1.0000] | 0.014701, 9.926e-4, 0.999981 |
| 420290 (anchor) | 272839 | 2.8276 | 2.69 | 0.32 | [0.914, 0.972] | [0.9923, 0.9975] | [0.9992, 0.9996] | 0.008636, 1.246e-3, 0.999841 |
| 1e6 | 600270 | 5.735 | 1.14 | 0.85 | [1.002, 1.005] | [1.0002, 1.0007] | [1.0000, 1.0001] | 0.005704, 2.431e-5, 1.000000 |
| 1e7 | 4.992e6 | 19.83 | 0.54 | 1.64 | [0.994, 0.996] | [0.9981, 0.9993] | [0.9998, 0.9999] | 0.002323, 7.54e-6, 1.000000 |
| 1e8 | 4.265e7 | 16.85 | 0.72 | 1.24 | [0.999, 1.002] | [0.9997, 0.9999] | [0.99997, 0.99998] | 0.000520, 4.72e-7, 1.000000 |

(r with the density started half a mean spacing above the last table zero. With the density started where the smooth count equals N the
interior values are closer to 1: |r - 1| < 2.9e-4 at depth 100-300 at every N and of order 1e-6 at depth 1000-2000.)

- The source bound 2.85 holds at its ten anchors and not at a general table size: over 20,000 random N in [1e5, 1e8] the top-gap value
  K_top/dens^2 has quantiles 0.81 (minimum), 1.42 (10 %), 2.14 (median), 3.84 (90 %), 16.3 (99.9 %), 74 (maximum; K_top = 447 at
  N = 73,963,902); 8.5 % of the table sizes have K_top > 22.92. The anchors are table sizes followed by an empty stretch of 2.7 to 3.1 mean
  spacings (K_top/dens^2 about 1.0). The source states the bound "at re-anchored plateaus"; this is consistent.
- K_l of the record pair is 7.5e-6 .. 1.2e-3 and equals the density value to 1e-4 or better: the record pair is far from the table top.
- r_l differs from 1 only within about 100 gaps of the table top, where it is set by the positions of the first omitted zeros.

Prime side (server: 455,062,595 prime powers below 1e10, 571 points; `out_server/t1p_1e10.json`; Mac repeat to 1e8 at the anchors).
K^L(prime) against K^L(ref) and against the density with the same cut kernel; "true" is r with the uncut kernel 1/r.

| object | N | X | 2 pi/L in mean spacings | rms of prime - ref over the bands | r at the top gap: prime / ref / true | r at depth 4-15: prime, [min, max] | r at depth 100-1000: prime, [min, max] |
|---|---|---|---|---|---|---|---|
| zeta | 1e4 | 1e6 | 0.53 | 1.6e-8 .. 3.5e-7 | 1.460 / 1.460 / 1.040 | [1.011, 1.040] | [1.000, 1.002] |
| zeta | 1e4 | 1e10 | 0.32 | 4.1e-8 .. 2.6e-6 | 1.207 / 1.207 / 1.040 | [1.011, 1.040] | [1.000, 1.002] |
| zeta | 15323 | 1e6 | 0.56 | 1.6e-8 .. 3.4e-7 | 0.613 / 0.613 / 0.338 | [0.782, 0.941] | [0.9915, 0.9992] |
| zeta | 15323 | 1e10 | 0.34 | 3.7e-8 .. 2.6e-6 | 0.314 / 0.314 / 0.338 | [0.783, 0.941] | [0.9915, 0.9992] |
| zeta | 1e6 | 1e6 | 0.83 | 2.9e-9 .. 2.8e-8 | 0.307 / 0.307 / 0.852 | [0.989, 1.007] | [1.000, 1.001] |
| zeta | 1e6 | 1e10 | 0.50 | 2.2e-8 .. 9.9e-8 | 0.985 / 0.985 / 0.852 | [1.002, 1.005] | [1.000, 1.001] |
| zeta | 1e8 | 1e6 | 1.14 | 1.0e-6 .. 2.0e-6 | 1.628 / 1.628 / 1.244 | [0.999, 1.074] | [0.9997, 1.0000] |
| zeta | 1e8 | 1e10 | 0.68 | 3.2e-6 .. 8.3e-6 | 1.222 / 1.222 / 1.244 | [1.000, 1.018] | [0.9996, 0.9997] |
| L(chi), chi mod 5 complex | 9e5 | 1e10 | 0.56 | 1.4e-8 .. 3.2e-7 | 0.674 / 0.674 / 0.475 | [0.869, 0.968] | [0.9961, 0.9996] |
| L(chibar) | 9e5 | 1e10 | 0.56 | 1.6e-8 .. 1.1e-7 | 2.599 / 2.599 / 1.799 | [1.025, 1.105] | [1.000, 1.003] |
| L(chi_5) | 1e4 | 1e10 | 0.38 | 2.3e-8 .. 1.0e-7 | 0.923 / 0.923 / 0.689 | [0.953, 0.984] | [0.9971, 0.9997] |
| L(chi_-4) | 1e4 | 1e10 | 0.37 | 2.9e-4 .. 7.6e-4 | 2.144 / 2.144 / 1.545 | [1.032, 1.099] | [0.955, 1.019] |
| L(chi) table with the coefficients of chibar | 1e5 | 1e10 | 0.47 | 33 .. 271 | 51.5 / 1.98 / 0.58 | [-164, 156] | [-9964, 3432] |

- For zeta and the three L-functions with accurate lists the prime side equals the zero-side reference at every table size, cut-off and
  depth: rms difference 7e-10 to 8e-6 for zeta over all bands (largest at N = 1e8, where the ordinates carry 1e-9 .. 1e-8), 2e-11 to
  3e-7 for the complex character, 1e-7 for chi_5. The list of chi_-4 is accurate to about 1e-6 and gives 5e-5 .. 8e-4: an error d in a
  table zero changes K^L by about L^2 dens d. At depth >= 1e5 below the top of the 1e7 and 1e8 tables K_l is 1e-6 or less and the same
  absolute error leaves r undetermined (-7.5 .. 2.1); the reference there is 1.0000.
- The test detects a wrong coefficient sequence at once: the conjugate character on the table of L(chi) gives a mismatch of 33 .. 271.
- The top gap is not resolved by the cut kernel at these cut-offs (2 pi/L is 0.3 to 1.1 mean spacings): its value changes with X (1.46,
  1.21 against 1.04 for the uncut kernel at N = 1e4) while prime side and reference agree at each X. From depth 4 on the cut kernel at
  X = 1e10 equals the uncut one to 1e-3 .. 1e-5. To follow the first omitted zero the cut-off has to grow with the height: the usual relation
  between primes up to X and zeros resolved to 2 pi/log X.

Controls evaluated with their own coefficients on the table of zeta (r = K^L(control)/K^L(density); zeta's own values for comparison):

| N | X | band | zeta | T-NR q = 1000003 | T-NR q = 1000003, function side (uncut) | T-NR q = 3 | E_0.02 | E_0.1 | Liouville | random sign |
|---|---|---|---|---|---|---|---|---|---|---|
| 1e4 | 1e6 | top gap | 1.460 | 1.460 (difference exactly 0) | 1.55 | 0.595 | 3.68 | 4.66 | -0.569 | -3.75 |
| 1e4 | 1e6 | depth 4-15 | [1.011, 1.040] | [1.011, 1.040] | [-386, 607] | [-5460, 1810] | [-157, 78] | [-128, 124] | [-174, 283] | [-102, 98] |
| 1e4 | 1e6 | depth 100-1000 | [1.000, 1.002] | [1.000, 1.002] | [-23600, 8710] | [-9330, 9130] | [-3870, 17] | [-5350, -756] | [-33, 7570] | [1850, 7020] |
| 1e4 | 1e10 | top gap | 1.207 | 13.0 | 1.55 | 1.58 | 2.78 | 4.78 | 0.793 | -0.459 |
| 1e4 | 1e10 | depth 4-15 | [1.011, 1.040] | [-559, 428] | [-386, 607] | [-22500, 36600] | [-74, 87] | [-213, 252] | [-189, 93] | [-171, 158] |
| 1e4 | 1e10 | depth 100-1000 | [1.000, 1.002] | [-28200, 15800] | [-23600, 8710] | [-179000, -2060] | [-2120, 1790] | [-2920, 5300] | [-3220, 4390] | [2400, 4260] |
| 1e8 | 1e6 | top gap | 1.628 | 1.628 (difference exactly 0) | 17.5 | 1.28 | 2.89 | 3.92 | -1.13 | -3.15 |
| 1e8 | 1e6 | depth 100-1000 | [0.9997, 1.0000] | [0.9997, 1.0000] | [-207, 25800] | [-39, 22200] | [-10900, 76] | [-16000, 234] | [-101, 21300] | [-29, 6520] |
| 1e8 | 1e10 | top gap | 1.222 | 6.60 | 17.5 | 0.530 | 1.87 | -1.04 | -0.819 | -4.79 |
| 1e8 | 1e10 | depth 100-1000 | [0.9996, 0.9997] | [51.5, 7680] | [-207, 25800] | [-666, 91600] | [-15600, 283] | [-22600, 1210] | [-519, 30600] | [-58, 5380] |

- T-NR with q = 1000003: the coefficients differ from zeta's only at powers of q, so for X = 1e4 and X = 1e6 the prime side is zeta's to
  the last bit (rms difference 0) while its off-line zeros start at height 0.227 and lie within 0.23 of every point. For X = 1e8 and 1e10
  the single term at n = q enters with weight log q (alpha + 1/alpha) = 30.4 and the mismatch is 16 .. 315 in K^L.
- zeta(s+a)zeta(s-a), the Liouville twist and the random sign twist differ from zeta at every prime; they have no on-line table of their
  own, so these columns only show that the kernel is sensitive to the coefficients (as the conjugate-character row does).

Controls with off-line zeros (zero side; `t1_ctl.py`; r at pairs more than 10 mean spacings from every off-line ordinate and at depth >= 100):

| object | table top | off-line pairs below the top | n | r_l [min, median, max] | r_l from the on-line zeros alone | K_off [min, median, max] | K(b) median |
|---|---|---|---|---|---|---|---|
| DH | 85.20 (N = 43) | 0 | 31 | [0.986, 0.998, 1.005] | [0.83, 0.91, 0.96] | [0.0036, 0.0054, 0.018] | 0.069 |
| DH | 90.70 (N = 45) | 1 | 31 | [1.016, 1.041, 1.161] | | | 0.064 |
| DH | 1000 (N = 848) | 28 | 349 | [1.04, 3.14, 7.73] | [0.91, 0.92, 0.98] | [0.0036, 0.023, 0.080] | 0.010 |
| DH | 1e4 (N = 11,570) | 567 | 1836 | [1.05, 36.5, 178.7] | [0.91, 0.91, 0.98] | [0.0036, 0.064, 0.24] | 0.0016 |
| DH | 9e4 (N = 131,365) | 7220 | 1702 | [1.82, 274, 1915] | [0.90, 0.94, 0.97] | [0.0099, 0.12, 0.38] | 0.00031 |
| H_{-0.1} | 414.76 (N = 211) | 0 | 108 | [0.9944, 0.9993, 0.9995] | [0.965, 0.973, 0.983] | [0.00028, 0.00034, 0.00049] | 0.013 |
| H_{-0.1} | 1000 (N = 633) | 8 | 428 | [0.998, 1.21, 4.38] | [0.957, 0.971, 0.985] | [0.00028, 0.0024, 0.028] | 0.0075 |
| H_{-0.5} | 111.19 (N = 33) | 0 | 21 (depth >= 0) | [0.970, 0.989, 0.992] | [0.76, 0.81, 0.85] | [0.0048, 0.0062, 0.012] | 0.036 |
| H_{-0.5} | 1000 (N = 467) | 91 | 27 | [1.11, 1.38, 6.22] | [0.80, 0.85, 0.88] | [0.0048, 0.0071, 0.039] | 0.014 |
| T-NR q = 3 | 1000 (N = 649) | 175 | 646 (all pairs) | [-1978, 99.7, 338.6] | [0.42, 0.71, 0.72] | [-18.6, 1.37, 3.15] | 0.011 |

Reading. With the table stopped below the first off-line zero, the omitted set is every zero above the table and its field is the density of
all zeros: r_l = 1 to 1.5 %, as for zeta (the on-line zeros alone give 0.83 .. 0.96: the remaining 4 to 17 % is the field of the off-line
zeros above, which the total density contains). As soon as the table top passes an off-line pair, that pair is a zero below the top that the
table does not hold, and K(a) - K(b) = 2 sum Re 1/((x_l - y)(x_{l+1} - y)) over such zeros, about 4/r^2 per pair at distance r. This decays
slowly, so pairs 10 or 30 mean spacings away are affected (r_l up to 1915), and the first 43 DH zeros, all below the first off-line height,
have r_l = 1.04 .. 25 with the table to 1e4. The statistic is a 1/r^2-weighted count of the zeros of the function that lie below the table top
and are not in the table: the content of a zero count (Turing's method) in another kernel. Lane `s5-heat-landing-collision-scaling`
(combination 4) found the same for the kernel 1/r^2 at single zeros.

Why this is not a survivor. (i) The failing size for DH and for the heat family is the size at which the table contains off-line heights; the
lead is zero pairs. (ii) An off-line pair above the table top at distance r changes K_l by O(delta^2/r^4) relative to two on-line zeros at
the same height (delta = its distance from the line): above the top the kernel does not see whether zeros are on the line. (iii) The prime
side resolves a local factor at q only for X >= q: T-NR with q = 1000003 gives zeta's numbers for X = 1e4 and 1e6.

## 5. Combination 2: bracket for the first collision time

Premise replay. The plateau scan of the first 1e6 zeros gives the ten plateaus of imp-3725 and sup K_paper = 2.4237067e-6 on [1e4, 1e6].

Windows of 200 zeros. On a window of 200 the smallest gap is about 0.15 mean spacings and theta >= 0.99 holds in a minority of windows, so
the self-consistency threshold thetaBar was taken as the largest of 0.99, 0.95, 0.9, 0.8, 0.7, 0.5 with theta >= thetaBar (the lemma is
valid for any thetaBar in (0, 1)); 0.95 in most windows. eps'_l = 2 K_l(0), K_l(0) from the zeros outside the window (per gap; the uniform
form uses the maximum).

| object | windows | heights | inside (per gap) | inside (uniform) | t_c / (H^2/8) [min, median, max] | position in the bracket [min, max] | direct H_t / zero flow |
|---|---|---|---|---|---|---|---|
| zeta | 60 | 1.4e3 .. 4.27e7 | 60 | 60 | [1.00108, 1.01595, 1.05647] | [0.32, 0.50] | [0.9999832, 1.0000986] (38 windows) |
| zeta at 1e9 | 12 | 1e9 | 12 | 12 | [1.00243, 1.01515, 1.03422] | [0.39, 0.48] | [0.9999912, 1.0000117] (12) |
| zeta at 1e12 | 12 | 1e12 | 12 | 12 | [1.00190, 1.00896, 1.03552] | [0.40, 0.48] | [0.9999913, 1.0000097] (12) |
| L(chi), L(chibar) mod 5 | 30 + 30 | 1.1e3 .. 5.0e5 | 60 | 59 (1 not certified) | [1.00114, 1.013, 1.07426] | [0.26, 0.49] | not run |
| L(chi_-4), L(chi_5) | 8 + 8 | 340 .. 9.7e3 | 16 | 16 | [1.00760, 1.02, 1.05602] | [0.33, 0.46] | not run |
| DH, full zero set, eps' from the on-line list | 60 | 1.2e3 .. 1.0e5 | 60 | 60 | [1.00009, 1.01222, 1.07100] | [0.30, 0.97] | no sampler |
| H_{-0.1}, H_{-0.5} tables | 8 + 1 | 476 .. 1254 | 9 | 9 | [1.00015, 1.0043, 1.02345] | [0.46, 0.50] | no sampler |
| T-NR q = 1000003 | 8 | 1.4e3 .. 4.27e7 | 0 (8 outside) | 0 (8 outside) | [0.65834, 1.16128, 1.99757] | [-4.1, 16.8] | closed form of the local factor in the flow |
| T-NR q = 3 | 8 | 1.4e3 .. 4.27e7 | 6 (2 outside) | 6 | [0.93137, 1.00900, 1.01602] | [-0.82, 0.53] | |

- Zeta and the L-functions: inside at every window, at every height to 1e12. This is the theorem of imp-3933 (PROVED there for every flow
  with a real field error obeying the difference bound); the run confirms the numbers and the 200-zero windows, it adds no information about
  zeta.
- DH: inside at all 60 windows although every window of 200 contains about 10 off-line pairs and eps' was computed from the on-line zeros
  alone. The field of the off-line zeros at the record pair is K_off = 0.018 .. 4.6 (median 0.11); its effect on the collision time is
  K_off H^2/8 relative, about 1e-4 .. 1e-2, inside a bracket whose width is 1 to 20 % at these window sizes. The closest case (off-line zero
  1.23 mean spacings from the pair, K_off = 4.6) has t_c at 0.968 of the bracket width. In the 40 windows with no off-line zero inside the
  quarantine distance 2/sqrt(K_on) the position is 0.30 .. 0.51, as for zeta.
- T-NR q = 1000003: outside in 8 of 8 windows, in both directions (collision at 0.66 to 2.00 of the pair time; the lower bound H^2/8, valid
  for every real configuration, is violated because the field difference of the off-line progression is of either sign, K_off = -215 .. 421
  against K_on = 0.05 .. 0.90). A Mac run on six other windows gives 6 of 6 outside. q = 3: outside in 2 of 8 (K_off = -14 at both). The progression has spacing 0.455 and distance 0.032 from the line: no window is free of it.
- zeta(s+a)zeta(s-a): no real zero, no window gap. Sign twist: no zero table. Unimodular twist: translate of zeta.

Classification: no control leaves the bracket in a window without an off-line zero inside the quarantine distance. The bracket is a statement
about the window's own gaps plus one number eps' that bounds the rest; an off-line zero enters through eps' alone. Zeros only.

## 6. Combination 3: per-site depth

Each close pair (unfolded gap below 0.1) with 8 neighbours on each side as moving particles and 300 on each side as a frozen linear field,
run to t = g_k^2/16, g_k^2/8, g_k^2/4.

| list | zeros | close pairs | floor at t = 0 | floor over the depth, c = 1/16, 1/8, 1/4 | member-spectator collisions | floors at t = 0 in four height blocks |
|---|---|---|---|---|---|---|
| zeta | 1e4 / 1e5 / 1e6 / 1e7 | 5 / 79 / 878 / 9434 | 1.035 / 0.689 / 0.254 / 0.193 | equal to t = 0 up to 1e7 except c = 1/4 at 1e7: 0.185 | 0 | 1e7: 0.195, 0.235, 0.192, 0.251 |
| zeta | 1.0e8 | 98,032 | 0.115 | 0.109, 0.106, 0.086 | 0 | 0.154, 0.164, 0.115, 0.129 |
| zeta at 1e9 | 1.02e6 | 1009 | 0.177 | 0.174, 0.174, 0.165 | 0 | 0.271, 0.455, 0.399, 0.177 |
| L(chi) / L(chibar) | 9.46e5 | 830 / 838 | 0.320 / 0.312 | equal | 0 | chi: 0.419, 0.526, 0.387, 0.320 |
| L(chi_-4) / L(chi_5) | 1e4 | 6 / 6 | 0.942 / 0.913 | equal | 0 | |
| DH on-line | 1e4 / 1e5 / 8.5e5 | 24 / 181 / 1406 | 0.600 / 0.062 / 0.062 | 1e5: 0.030, 0, 0 | 1 (inside c = 1/8) | 8.5e5: 0.062, 0.254, 0.337, 0.147 |
| DH, pairs with no off-line zero among the moving particles | 1e4 / 1e5 | 11 / 85 | 0.904 / 0.062 | 0.030, 0, 0 | 1 | |
| alt on-line | 7.0e5 | 977 | 0.251 | equal | 0 | 0.512, 0.251, 0.564, 0.480 |
| heat tau = 0 / -1e-4 / -2e-3 / -1e-2 | 4.0e6 / 4.0e6 / 4.0e6 / 3.9e6 | 3876 / 4292 / 8200 / 14,181 | 0.154 / 0.153 / 0.191 / 0.104 | tau = -1e-2: 0.092, 0.083, 0.059 | 0 | tau = -1e-2: 0.163, 0.104, 0.108, 0.136 |

- For zeta the minimum over the depth equals the distance at t = 0 for every pair up to 1e6 zeros and for all but a few pairs above: the
  two zeros of a collapsing pair move toward each other and away from their neighbours; the distance to the nearest spectator at the end of
  the depth is 1.00 to 1.09 times its initial value (0.74 at the single smallest case in 1e8). The statistic is the nearest-neighbour
  distance d_1 of the close pairs at t = 0, the triple-gap law of the list.
- The floor falls with the number of close pairs (1.04 at 5 pairs, 0.115 at 98,032) and its spread over height blocks at 1e8 is 0.05. It is
  not a constant of the object.
- DH: one triple at height 58,335.6 (three on-line zeros with gaps 0.062 and 0.081 mean spacings) gives 0.062 at t = 0 and a collision of a
  pair member with its neighbour before g_k^2/8. The nearest off-line zeros are 30 and 46 mean spacings away. This is below zeta's value at
  1e8 zeros. Of the 18 DH clusters below 1e5 with both gaps under 0.3, all are 11 to 31 mean spacings from the nearest off-line zero (a
  typical DH zero is 6.4 away): the tight clusters sit in the stretches without off-line pairs. The count of such clusters (both gaps
  < 0.2): 20 in 8.5e5 DH zeros against 336 in 1.0e8 for zeta (2.8 per 8.5e5), cumulative exponents 3.1 and 8.2.
- Not a survivor: the DH excess appears at 8.2e4 on-line zeros, 1900 times the index of its first off-line zero, in a list that has already
  lost 10 % of its zeros; no prime enters; T-NR has zeta's on-line list and passes; the backward heat lists differ from tau = 0 only at
  tau = -1e-2 (3.9 % off-line).

Transport coefficient (imp-35168): on Im z = y* the bound |Im M''| <= (2/y*^2)|Im M| is attained only under a single pole. Measured sup over
600 points, first 1e6 zeta zeros: 0.36 against 1.49 at y* = 2 mean spacings (ratio 0.24), 0.0013 against 0.0638 at y* = 5.6 (ratio 0.020);
at half a mean spacing the ratio is 0.57 to 0.84 on every list. The full rate |Im(2MM' + M'')|/|Im M| is 0.017 at y* = 5.6 and the Jacobian
sup 2|M'| is 0.017 there against the bound 2N/y*^2 = 6.4e4. These depend on the local spacing only; DH and the heat lists give the same
order (0.009 and 0.008 against 0.0638 at y* = 5.6).

## 7. Combination 4: isolation ratio of the minimal pair

Zeta, all windows of the first 100,116,297 zeros:

| N | windows | rho > 0.72 | prediction (sine kernel) | prediction (CUE kernel at N_eff, E = 1.4e7) | rho > c_half | largest rho | median rho | counts by height quarter |
|---|---|---|---|---|---|---|---|---|
| 100 | 1,001,162 | 4469 (4.46e-3) | 7148 | 4918 | 893 | 1.769 | 0.182 | 1048, 1159, 1139, 1123 |
| 300 | 333,720 | 219 (6.56e-4) | 382 | 263 | 43 | 0.998 | 0.123 | 51, 59, 53, 56 |
| 1000 | 100,116 | 8 (7.99e-5) | 15.4 | 10.6 | 2 | 0.939 | 0.080 | 2, 3, 2, 1 |
| 3000 | 33,372 | 0 | 0.82 | 0.57 | 0 | 0.688 | 0.055 | |
| 1e4 | 10,011 | 0 | 0.033 | 0.023 | 0 | 0.337 | 0.037 | |
| 3e4 | 3337 | 0 | | | 0 | 0.182 | 0.025 | |
| 1e5 | 1001 | 0 | | | 0 | 0.077 | 0.017 | |

- The premise of the R1 transfer on real data (the globally minimal pair of a window is isolated, rho <= 0.72) is false at N <= 1000 at a
  rate that falls as N^(-1.75) and holds at every window for N >= 3000 in the first 1e8 zeros (47,721 windows). For the prefix tables
  (first N zeros, N in [1e4, 1e6]: the case of the source) rho of the ten record pairs is 0.008 .. 0.049 (gaps and adjacent gaps of the imp-3725 table).
- Prediction (PROVED as a leading-order computation for a determinantal kernel; `t4_pred.py`): with R_2 ~ c_2 r^2 and
  R_3(0, x, x + y) ~ c_3 (xy(x + y))^2, the fraction of windows whose minimal pair has rho > c is
  f(N) = 2 c_3 I_c Gamma(8/3) / (3 (c_2/3)^(8/3)) N^(-5/3), I_c = int_1^(1/c) u^2 (1 + u)^2 du. Sine kernel: c_2 = pi^2/3,
  c_3 = 7.1214, f = 15.38 N^(-5/3) for 0.72 and 3.006 N^(-5/3) for c_half. Prime side: Lam = gamma_0^2 + 2 gamma_1 + sum_p log^2 p/(p - 1)^2
  = 1.573151 (primes to 1e6: 1.385590), N_eff = log(E/2 pi)/sqrt(12 Lam) (Bogomolny et al. 2006), kernel sin(pi r)/(N_eff sin(pi r/N_eff)):
  c_2 ratio 0.912 and c_3 ratio 0.537 at E = 1.4e7, prefactor ratio 0.688. MEASURED against it: 219 against 263 and 8 against 10.6; at
  N = 100 the leading order is 10 % high. The small-gap count itself: 0.893 of the sine value at gap < 0.05 (CUE at N_eff: 0.90 to 0.92).
  Heights 1e9 and 1e12: 53 and 70 of about 10,000 windows at N = 100 (ratio to the first 1e8: 1.16 and 1.57; prediction 1.19 and 1.31).
- L-functions: 27 and 36 of 9464 windows at N = 100 (zeta's rate gives 42), 1 and 1 at N = 300, none above.
- DH on-line: 63 of 8476 at N = 100, 3 of 2825 at N = 300, 1 of 847 at N = 1000. Below 1e5 the 13 events at N = 100 sit 4.9 to 30.9 mean
  spacings from the nearest off-line zero (median for all window minima: 7.3). The median rho of DH is smaller than zeta's at every
  N >= 300 (0.015 against 0.037 at N = 1e4): its minimal gaps are shorter (count below e proportional to e^2.06 against e^2.98) while the
  neighbour distance is not. alt: 27 of 6988. Heat: 171, 183, 161, 141, 121 of about 40,000 for tau = 0 .. -1e-2.
- Not a survivor: on-line list statistic; no prime in the statistic (the prime side enters only through the constant Lam of the prediction);
  T-NR identical to zeta; the DH excess at N = 100 (1.7) needs thousands of windows that each contain about 5 off-line pairs.

## 8. Not run, limits, weakest steps

- Combination 1, function side for DH (F''/F' at the zeros in ball arithmetic): not run in this lane; the equivalent Hadamard identity for the
  kernel 1/r^2 was checked to 2.5e-5 by `s5-heat-landing-collision-scaling` on the same zero tables. The DH numbers above use the zero
  tables of `s3-heat-zero-velocity-channels` (MEASURED lists, off-line list not certified complete below 1e5).
- Combination 1, coefficient side for DH (smoothed sum of its Lambda_F(n)): not run. Its explicit formula sums the cut kernel over all zeros
  including those right of 1, where the cut kernel grows like X^(beta - 1/2).
- Controls of combination 1 to 1e5 .. 1e6: DH reached 1e5 in height (131,365 table zeros), the heat tables 2000.
- Combination 2: 84 zeta windows instead of 50 heights x 1; controls to 1e5 as specified. The far field beyond 20,000 neighbours enters as
  a density tail; zeros below the frozen block of the lowest windows through the even density (effect on t_c below 1e-7 relative).
- T-NR in combination 2: the first server run used a version of `t2.py` that evaluated the closed-form field of the progression at its own
  poles; that unit was stopped by name and the corrected code was run as unit `rh-s6f-t2tnr` (8 windows per q; a moving off-line zero now
  takes the regular part from a 16-point circle mean). The flow tolerance for these windows is 1e-8 instead of 1e-11.
- Weakest steps: (1) the classification of combination 1 rests on the measured equality of K(a) - K(b) with the off-line sum on tables that
  are themselves measured; (2) the prediction of combination 4 is leading order in the gap and first order in 1/N_eff^2 (the CUE kernel
  at non-integer N_eff is negative for N_eff < 2 and is not used below E = 1e6); (3) in combination 3 collisions between particles that are
  not in one of the three regular pairs of a system are not regularised (no non-finite value occurred in 1.3e5 systems).

## 9. Files

`fk.py`, `fk.c`, `fk2.c`, `build.sh` (library and kernels); `flow.py` (flow with regular pairs); `t1_zero.py`, `t1_prime.py`, `t1_ctl.py`;
`t2.py`; `t3.py`; `t4.py`, `t4_pred.py`; `val_lib.py`, `val_flow.py` (validation); `run_t1z.sh`, `run_t1p.sh`, `run_t2.sh`, `run_t2tnr.sh`, `run_t3.sh`,
`run_t4.sh` (server), `run_local.sh` (Mac); `mk_tables.py`; `zgen/` (copy of the `s1` sampler). Outputs: `out_server/` (server JSON and
logs), `out/` (Mac), `out/tables.md` (all tables). Server copy: `~/rh-push/s6-field-channel-omitted-zero-kernel/`.
