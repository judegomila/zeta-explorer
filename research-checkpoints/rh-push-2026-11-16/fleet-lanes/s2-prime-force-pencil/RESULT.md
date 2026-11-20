# s2-prime-force-pencil: screening of four prime-force combinations (2026-11-19)

Lane: screening arm, slug `s2-prime-force-pencil`. Four combinations from the idea engine were turned into finite tests and run on zeta, on L(s, chi) with chi mod 5 (chi(2) = i), and on the controls. Labels: PROVED (algebra written here), MEASURED (float64 unless a line says mpmath or ball arithmetic), CLASSICAL. Nothing here is a statement about the location of the zeros of zeta. No bound moves.

Verdict: **no survivor.** 4 combinations tested, 4 closed. Two source premises are false at scale: the real-rooted tau-interval (-0.56, 1.22) of the mean-field pencil holds only on the first 50 zeros, and the on-line signed-force margin rho(N, T) has no positive floor: it is 0 for zeta from a finite height T_0(N) (N = 32: float64 onset 3.695e6, infeasibility checked in ball arithmetic at 3.764e6).

## 0. Table

Objects. ZETA; CHI = L(s, chi), chi mod 5, chi(2) = i; DH = Davenport-Heilbronn (Hardy function Z_chi + Z_chibar, real coefficients (1, kappa, -kappa, -1, 0), kappa = 0.2841); ALT = Z_chi - Z_chibar; HEAT tau = Riemann-Siegel model of the backward heat deformation in a window at T = 1e7 (lists of lane `s1-zero-flow-dynamics`, tau = -2e-3, -1e-2 unfolded; tau = 0 is zeta in the same window); T-NR q = zeta(s)(q^(s-1/2) + 2.2 + q^(1/2-s)); SGN = random sign per prime (hash); LIOU = sign -1 at every prime; THIN = sign -1 on the thin set S (greedy floor rule, b = 0.9: 3,579,393 of the 50,847,534 primes below 1e9); UNI = unimodular twist p^(-i); DHC = the DH coefficients at the primes used on zeta's zeros; EA = zeta(s+a)zeta(s-a).

Cells: P = behaves as zeta; F = differs from zeta; N = not formulable; "=" = identical to zeta by construction.

| # | combination (nodes) | statistic | sizes reached | zeta | L(chi) | DH | HEAT | SGN / LIOU | UNI | THIN | T-NR | EA | classification |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | mean-field-pencil-real-rooted + arithmetic-freeze-flow-force | tau-interval on which Z_F + (tau/2) W_c keeps the real-zero count of Z_F; W_c = Re(e^{i theta} sum_{p<=P} c(p) log p p^(-1/2-ix)) | windows of 1.5e5 at T = 30, 1e6, 1e7 (Mac) and 1e8, 1e9 (server); P = 1e2 .. 1e9 (50,847,534 primes); grid step 0.038 | FAILS the pass criterion: interval (-1.1e-5, 1.1e-5) at T <= 1.5e5, (-1.7e-6, 1.3e-6) at 1e7, (-1.6e-6, 1.4e-7) at 1e9; source interval (-0.56, 1.22) reproduced on [10,145] only | interval (-6.5e-6, 2.2e-5) | (-1.4e-6, 1.2e-5) | not run | intervals of the same order (1e-6 .. 1e-4) | same | same | same | N | CLOSED: the pass criterion fails for zeta at the second size |
| 1b | same | asymmetry n(-tau) - n(+tau) of the real-zero count at tau = 0.01, over n(0) | same | 0.018 (T <= 1.5e5), 0.026, 0.030, 0.034, 0.037 (1e6, 1e7, 1e8, 1e9) | 0.022 with own primes; 0.000 with chibar primes | 0.018 with own coefficients (P) | not run | -0.0002 (F); LIOU = sign reversed | 0.004 (F) | 0.021 (partial) | 0.031, 0.032, 0.034 (P) | N | CLOSED: DH and T-NR pass; the quantity is the one-level prime-zero correlation of row 4 |
| 2 | signed-force-lp-margin + lp-signed-force-gram-surrogate + online-margin-positive-floor | Gordan margin rho(N,T) = dist(0, conv{g_k}) over all near-collision extrema to T; onset T_0(N) = least T with rho = 0 | zeta: 1.0e8 zeros (T = 4.27e7, 3.9e7 constraints) on the server, 1.0e7 zeros on the Mac; N = 2 .. 1024; conductor 5: 9.5e5 zeros (T = 5e5) | FAILS: rho = 0 from T_0(N): 1.9e4, 6.4e4, 2.6e5, 7.4e5, 2.3e6, 3.7e6 for N = 2, 4, 8, 16, 24, 32 (ball-arithmetic certificates), 1.28e7 for N = 64 (float64 only); N = 128, 256: rho = 6e-4, 0.012 at the end of the list (4.27e7) | complex weights: T_0 = 1.6e4, 1.0e5, 1.9e5 for N = 2, 4, 8 (zeta: 2.1e4, 1.0e5, 3.4e5) | T_0 = 1.8e4, 5.8e4, 1.7e5, 2.4e5 for N = 2, 4, 8, 16: within a factor 3 of zeta's (P) | window at 1e7, N = 32: onset after 116,042 constraints (tau = 0), 114,355 (tau = -2e-3), 43,750 (tau = -1e-2) | N (no line) | = (translate) | N | q = 2: T_0(32) = 2.8e6 (P); q = 101: T_0 = 1.9e3, 3.2e3, 2.0e4 for N = 32, 64, 128 (F, support N < q^2) | N (no on-line zero) | CLOSED: zeta has no floor; DH is not separated |
| 3 | signed-force-margin-floor + offline-margin-below-line | confining-sign system on complex pairs: value of c_k.w and margin, against u = delta (1/2) log(T/2pi) | planted pairs: 673,230 near-collisions of zeta to T = 1e6, N = 32, 128, 1024; DH: its 84 off-line pairs below 2000 (mpmath, 30 digits) | planted pairs negative under the on-line optimum: 0 for u <= 1, 3e-4 at u = 2, 6e-3 at u = 5 (N = 32); planted system feasible for every u <= 5 | not run | actual off-line pairs: system feasible, margin 0.51 .. 0.71 (N = 4 .. 128); joint with the 544 on-line near-collisions 0.43 .. 0.68; all 84 pairs confined by the on-line optimum (P) | not run | N | N | N | not run | not run | CLOSED: the control does not go negative at any size |
| 4 | prime-phase-crystal + angular-spacing-poisson | bias of C_F(P; gamma) = sum_{p<=P} a_F(p) log p p^(-1/2) cos(gamma log p) over the on-line ordinates, against uniform random heights; gap law of gamma log p mod 2 pi | P = 1e10 (455,052,511 primes) for every list, 2.99e10 on the server for the first 1e6 zeros and for zeros 99,000,001 .. 100,000,000; 1.0e6 ordinates per list (zeta: three windows; CHI 9.5e5; DH 8.5e5; HEAT 1.0e6) | -17.67 at P = 1e10 on the first 1e6 zeros; prediction from F(alpha) = min(alpha, 1): -17.48; random heights 0.00 +- 0.03 | -16.98 (prediction -16.81) (P) | -5.93 with own coefficients; -9.1 would be the value for a complete list (F) | -15.33 at tau = -1e-2 against -15.81 at tau = 0 (F by 3%) | +0.13 (F) | +0.9 (F) | -13.70 = zeta's value minus twice the sum over S | zeta's value plus 2.2 log q mean cos(gamma log q): -17.75, -18.12, -17.70 for q = 2, 101, 1e6+3 | N | CLOSED: Landau's formula; controls fail through the coefficient at single primes or through the count of missing zeros |

Survivor definition (task text): zeta passes at every size, every control fails early or for a reason that does not use its zeros, and the statistic uses all primes together. Rows 1 and 2 fail the first clause. Row 3 fails the second. Row 4 fails the second (DH, HEAT: the failure is the weighted count of the zeros missing from the on-line list) and the third (SGN, UNI, T-NR: the failure is a mismatch of the coefficient at each prime separately).

## 1. Definitions used (from the sources, read as text)

Sources: `src/data/rh-route-b-arithmetic-freeze-flow-2026-09-23.js` (Lemma A and the mean-field pencil), `src/data/imp-95999-route-b-hellmann-feynman-force.js`, `src/data/imp-96020-lp-signed-force-feasibility.js` with `tmp/imp-96020-lp-signed-force-feasibility.py`, `src/data/imp-96148-...`, `imp-96345-...`, `imp-96367-...` (margin column and fits), pages `VizPrimePhaseCrystalPage`, `AngularSpacingStatsPage` (node statements only).

- Lemma A of the source: Xi(x) = -P(x) Z(x), Psi_S(x) = -(1/2) P(x) Z_S(x), Z_S(x) = sum_{n in S} n^(-1/2) cos(theta(x) - x log n), P > 0. So Xi + tau Psi_S on the line has the zeros of Z + (tau/2) Z_S. The prime force of the node `arithmetic-freeze-flow-force` in this normalisation is W_c(x) = sum_{p<=P} c(p) log p p^(-1/2) cos(theta(x) - x log p) (form A). The untwisted sum sum c(p) log p p^(-1/2) cos(x log p) (form B) was run as a variant.
- Mean-field pencil of the source: (1 - tau) Z + tau cos(theta).
- Signed-force system: near-collision = consecutive zeros with gap/(2 pi/log(q t/2 pi)) < 0.85; x* = the extremum of Z_F between them; g_k = sign(Z_F''(x*)) a(x*), a_n(x) = n^(-1/2) cos(theta_F(x) - x log n), n <= N, rows normalised; rho(N,T) = dist(0, conv{g_k : x*_k <= T}). "Real weights" uses the cosine modes; "complex weights" adds the sine modes (dimension 2N), which a complex character needs.
- sign(Z_F''(x*)) = -sign(Z_F(x*)), and sign Z_F on the k-th gap is (-1)^k up to one global sign, which the margin does not see.

## 2. Code and validation

All code is in this directory. Shared: `lib.py` (phases, extrema from a zero list, mode matrices, min-norm-point solver with cutting planes, Riemann-Siegel sampler), `primes.py` (segmented sieve, THIN set, sign hash). Per combination: `c1_pencil.py`, `c2_margin.py` (+ `c2_cert.py`, `c2_cert2.py`, `c2_fixed.py`), `c3_offline.py`, `c4_phase.py` (+ `c4_gaps.py`). Tables: `c1_an.py`, `c2_an.py`, `c4_an.py`. Zero lists and the sampled Hardy functions of conductor 5 are those of lane `s1-zero-flow-dynamics` (read only).

Checks against known answers (all MEASURED):

| check | result |
|---|---|
| mean-field pencil on [10, 145], count on the source grid | 50 real zeros at tau = 0; first change at tau = 1.24 and -0.58: the source values |
| rho(32, T) at the seven source heights 60 .. 395.98 | 0.7607, 0.6918, 0.6602, 0.6362, 0.6192, 0.6003, 0.5593 against the source 0.761, 0.692, 0.660, 0.636, 0.619, 0.600, 0.559; 72 near-collisions below gamma_200 as in the source |
| rho(32, 4506.31) | 0.3772 with matching lower and upper bounds; source 0.3791 (Gilbert iteration, 4000 steps, an upper bound) |
| extremum from the zero list (log-derivative of the local Hadamard product, 40 neighbours each side) against mpmath | relative to the gap: at most 2e-3 above height 900; below 1000 the mpmath extrema are used; sign rule agrees 90/90 |
| Riemann-Siegel sampler against mpmath `siegelz` | 2e-5 at 35, 3e-8 at 1000, at most 1.6e-8 from 7005 to 4.9e6 |
| prime sum on the grid (Gaussian gridding + FFT) against direct summation over 50,847,534 primes | 3e-9 (T = 1e5), 3e-7 (1e7), 2e-6 (1e8), 3e-5 (1e9) for values of size 10 |
| s_p = mean of e^{i gamma log p} (non-uniform FFT) against direct summation, 20 primes per list up to 1e10 | at most 2e-8 for values of size 1e-3 |
| Landau: mean cos(gamma log 2) over 1e6 zeros at 1e7 | -0.03427, formula -log 2/(sqrt 2 L) = -0.03427 |
| server against Mac | onset K_0(32) = 2,790,511 on both; the conductor-5 phase tables agree in all printed digits |

## 3. Combination 1: pencil of Xi_F with a prime force

Test. Count of sign changes n(tau) of Z_F + (tau/2) W_c on a grid of step 2 pi/(8 log P) = 0.038 over a window; tau_+ and tau_- are the first positive and negative tau with n(tau) != n(0) (log grid from 1e-4, then 18 bisections; an upper bound for the first change). Pass for the true primes: the interval contains [0, 1].

Source premise (MEASURED). On [10, 145] the mean-field pencil keeps 50 real zeros for tau in (-0.58, 1.24), as in the source. On [30, 1e5] and on every later window the count has changed at abs(tau) = 0.02, the first grid point (n(1) - n(0) = +22 on [30, 1e5], +9 on [30, 1.5e5], +48 at 1e6, +106 at 1e7, +191 at 1e8, +345 at 1e9). The interval (-0.56, 1.22) is a property of the first 50 zeros.

Result for the prime force (MEASURED, form A, P = 1e9, true primes):

| window | n(0) | tau_+ | tau_- | n(+0.01)/n(0) | n(-0.01)/n(0) | n(+0.1)/n(0) | n(-0.1)/n(0) |
|---|---|---|---|---|---|---|---|
| [10, 145], P = 1e4 | 50 | 0.154 | -0.021 | 1 | 1 | 1.00 | 1.16 |
| [30, 1.5e5] | 216,769 | 1.12e-5 | -1.14e-5 | 0.9858 | 1.0041 | 0.9686 | 1.2789 |
| [1e6, 1.15e6] | 287,603 | 5.3e-6 | -2.0e-6 | 0.9737 | 0.9992 | 0.8962 | 1.0955 |
| [1e7, 1.015e7] | 340,987 | 1.3e-6 | -1.7e-6 | 0.9683 | 0.9985 | 0.8602 | 1.0271 |
| [1e8, 1.0015e8] (server) | 395,712 | 1.7e-6 | -3.6e-6 | 0.9639 | 0.9979 | 0.8244 | 0.9866 |
| [1e9, 1.00015e9] (server) | 450,512 | 1.4e-7 | -1.6e-6 | 0.9603 | 0.9968 | 0.7906 | 0.9707 |

The interval never contains 1; at T = 1e7 the count has changed by 3% at tau = 0.01. The pass criterion fails for zeta from the second size on. Reason (PROVED, one line): a pair of real zeros of Z + (tau/2) W merges where Z has a local extremum of height abs(Z(x*)) <= (tau/2) abs(W(x*)) of the opposite sign; W has root mean square (1/2) log P to log P (measured 6.6 to 13.7) and the smallest extremum of Z over a window shrinks with the window (Lehmer pairs), so tau_+- tends to 0 for every coefficient family.

Families at T = 1e7, P = 1e9, form A (zeta's zeros with each family's primes; no control zeros used):

| family | tau_+ | tau_- | n(+0.01)/n0 | n(-0.01)/n0 | asymmetry at 0.01 | n(+0.1)/n0 | n(-0.1)/n0 |
|---|---|---|---|---|---|---|---|
| true primes | 1.3e-6 | -1.7e-6 | 0.9683 | 0.9985 | 0.0302 | 0.8602 | 1.0271 |
| T-NR q = 2 | 1.4e-6 | -1.7e-6 | 0.9678 | 0.9983 | 0.0305 | 0.8605 | 1.0194 |
| T-NR q = 101 | 1.3e-6 | -1.6e-6 | 0.9653 | 0.9977 | 0.0324 | 0.8453 | 0.9654 |
| T-NR q = 1e6+3 | 6.3e-7 | -4.0e-6 | 0.9592 | 0.9928 | 0.0336 | 0.8358 | 0.8874 |
| THIN | 3.6e-5 | -1.7e-5 | 0.9782 | 0.9988 | 0.0206 | 0.8937 | 0.9914 |
| random signs | 5.6e-6 | -6.0e-5 | 0.9927 | 0.9925 | -0.0002 | 0.9352 | 0.9325 |
| DH coefficients | 9.2e-6 | -2.4e-5 | 0.9952 | 0.9952 | 0.0000 | 0.9378 | 0.9386 |
| unimodular p^(-i) | 2.0e-6 | -7.3e-5 | 0.9912 | 0.9953 | 0.0041 | 0.9159 | 0.9301 |

Form B (untwisted) is symmetric in tau for every family (true primes at 1e7: 0.9757 against 0.9759 at tau = 0.01). Liouville signs are tau -> -tau.

Own pairs, window [30, 1.5e5], P = 1e9, form A: zeta 0.9858 / 1.0041 (asymmetry 0.018); CHI with chi(p): 0.9784 / 0.9999 (0.022); CHI with chibar(p): 0.9959 / 0.9962 (0.000); CHI with c = 1: 0.9981 / 0.9995 (0.001); DH with its own coefficients: 0.9911 / 1.0093 (0.018); DH with chi(p): 0.9954 / 1.0046 (0.009); DH with c = 1: 1.0014 / 1.0011 (0.000).

Reading. The one quantity that distinguishes the true primes is the asymmetry of n(tau) in form A. It is present for zeta, for L(chi) with chi(p), for DH with the DH coefficients at the primes, and for T-NR; it is absent for random signs, for the DH coefficients on zeta's zeros, for chibar on the zeros of chi and for the unimodular twist. It measures whether the prime coefficients are the ones attached to the zero list (the one-level correlation of section 6); it does not distinguish DH from zeta.

Classification: CLOSED. (i) The stated pass criterion is false for zeta from T = 1e5. (ii) The asymmetry is the Landau correlation of section 6 and DH has it.

## 4. Combination 2: Gordan margin of the signed-force system

### 4.1 Zeta (MEASURED; certificates in ball arithmetic)

Real weights, all near-collisions below T:

| N | onset: constraints K_0 | onset height T_0 (float64) | T_0/(2 pi N^2) | rho at the last ladder level before | certified infeasible at |
|---|---|---|---|---|---|
| 2 | 8,197 | 19,140.06 | 762 | 0.0138 | T_0 (min barycentric coordinate 0.258) |
| 4 | 32,261 | 64,127.35 | 638 | 0.0470 | T_0 (0.088) |
| 8 | 153,373 | 260,123.3 | 647 | 0.0022 | T_0 (2.3e-4) |
| 16 | 481,262 | 735,839.2 | 457 | 0.0314 | T_0 (1.3e-5) |
| 24 | 1,650,011 | 2,276,676 | 629 | 0.0220 | T_0 (7.8e-4) |
| 32 | 2,790,511 | 3,695,283 | 574 | 0.0053 | 3,763,550 (3.8e-5) |
| 64 | 10,624,609 | 12,754,075 | 496 | 0.0012 (at 1.086e7) | not certified (below) |
| 128 | none below 4.27e7 | | | 0.0163 (1.54e7), 0.00062 (4.27e7, all 38,825,609 constraints) | |
| 256 | none below 4.27e7 | | | 0.0198 (1.54e7), 0.0121 (4.27e7, all 38,825,609 constraints) | |
| 512 | none below 4.99e6 | | | 0.0512 (1.30e6), 0.0320 (4.99e6) | |
| 1024 | none below 4.99e6 | | | 0.0502 (1.30e6), 0.0320 (4.99e6) | |

The margin column of the source continues as rho(32, T) = 0.559 (396), 0.377 (4506), 0.207 (2.2e4), 0.144 (7.5e4), 0.085 (2.6e5), 0.044 (9.2e5), 0.0053 (3.27e6), 0 from 3.70e6. The fitted intercepts of the source (0.160 -> 0.037) were the start of this decay; the question "does it reach 0" is settled for N <= 32 (certified) and answered in float64 for N = 64: it does, at T_0(N) of the order of 500 to 760 times 2 pi N^2. For N = 128 this scale is 5e7, just above the list (4.27e7), where the margin is 6.2e-4; for N = 256 the margin at 4.27e7 is 0.0121. At fixed T the margin saturates in N: rho(N, 4.99e6) = 0.0243, 0.0293, 0.0309, 0.0320, 0.0320 for N = 64, 128, 256, 512, 1024.

Certificate (`c2_cert.py`, `c2_cert2.py`, `c2_cert3.py`): each extremum x* of the support is recomputed by mpmath (root of Z', 25 digits; sign of Z'' from mpmath), the signed mode vectors are evaluated in python-flint balls at 256 bits, and the barycentric coordinates of 0 in the simplex of d+1 support vectors are solved with `arb_mat.solve`. All coordinates positive as balls: 0 is interior to the simplex of the g_k, so g_k.w > 0 has no solution. The float64 extrema carry an error of about 3e-4 of a gap, and at the onset the simplex is marginal, so for N = 16 and 32 the support was chosen after the refinement (`c2_cert3.py`: the whole working set is refined, the min-norm problem is solved again on the refined rows, then the ball check). Certified: N = 2, 4, 8, 16, 24 at the float64 onset; N = 32 at K = 2,846,321 (T = 3,763,550, 2% above the float64 onset; at the float64 onset the refined working set keeps a margin of 6.7e-5).

N = 64 (server, float64): onset at constraint 10,624,609, T = 12,754,075. Not certified: at cuts 1.02, 1.05, 1.2, 1.5 times K_0 the working sets (186 to 364 constraints) refined by mpmath keep a min-norm of 2.2e-5 to 7.6e-5, and the single-support ball checks at 1 to 3 times K_0 have one coordinate between -3e-2 and -3e-4. What is established for N = 64 is rho(64, 1.33e7) <= 2.2e-5 on refined extrema (any convex combination bounds the margin from above) against 0.56 at height 400; whether it is exactly 0 there is below the resolution of the extremum positions.

Mechanism (MEASURED). The margin just before the onset is between 3e-5 (N = 32) and 0.027 (N = 16): for N = 16 one constraint (number 481,262, x* = 735,839.23) takes the margin from 0.027 to 0, and the same constraint ends the complex-weight system with N = 12. The new vector is nearly opposite to a positive combination of earlier ones: a near-recurrence of the phases (theta(x) - x log n mod 2 pi, n <= N), a point of a torus of dimension pi(N) + 1, at two extrema of opposite sign. The number of constraints grows like T log T and the dimension is fixed, so such a recurrence must occur; nothing in it refers to the location of zeros.

Complex weights (dimension 2N): T_0 = 20,727; 100,799; 340,760; 735,839; 1,389,660 for N = 2, 4, 8, 12, 16 (N = 2, 4, 8, 12 certified at T_0, minimal barycentric coordinate 0.14, 0.020, 4.5e-3, 4.2e-4).

Fixed weights (the "w_n proportional to a_F(n)" variant, `c2_fixed.py`): with w = (1, .., 1), n <= N, the sign of the truncated sum agrees with the sign of Z at 90%, 84%, 79%, 69% of the 3,864,834 near-collisions below 5e6 for N = 8, 32, 128, 1024; first disagreement at x* = 60.1, 221.1, 782.4, 4589.7. The one-dimensional family fails for zeta at the fifth to the 1575th constraint.

### 4.2 Comparison and controls (MEASURED, float64, extrema refined on the sampled Hardy functions; signs from the samples, parity rule agrees on every pair)

| object | weights | N (dim) | K_0 | T_0 | zeta at the same dim: K_0, T_0 |
|---|---|---|---|---|---|
| CHI | complex | 2 (4) | 8,252 | 16,357 | 8,985; 20,727 |
| CHI | complex | 4 (8) | 62,011 | 100,964 | 53,501; 100,799 |
| CHI | complex | 8 (16) | 125,175 | 191,015 | 206,610; 340,760 |
| CHI | complex | 12 .. 64 | none below 5e5 (rho = 0.004 .. 0.050 at 5e5) | | 12: 481,262; 735,839 |
| DH | real | 2 (2) | 6,678 | 17,644 | 8,197; 19,140 |
| DH | real | 4 (4) | 25,257 | 58,336 | 32,261; 64,127 |
| DH | real | 8 (8) | 82,922 | 172,542 | 153,373; 260,123 |
| DH | real | 16 (16) | 119,257 | 241,299 | 481,262; 735,839 |
| DH | real | 24 .. 128 | none below 5e5 (rho = 0.016 .. 0.039 at 5e5) | | 24: 1,650,011; 2,276,676 |
| DH | complex | 2, 4, 8, 12 | 10,312; 25,257; 92,583; 119,257 | 25,884; 58,336; 191,044; 241,299 | 8,985 .. 481,262 |
| ALT | complex | 2, 4, 8, 12, 16 | 100; 1,930; 25,027; 27,563; 64,823 | 1,115; 11,946; 102,803; 111,760; 235,805 | 8,985 .. 964,078 |
| HEAT 0 (zeta, window from 1e7) | real | 32 | 116,042 | 1e7 + 131,498 | (window; no constraints below 1e7) |
| HEAT -2e-3 | real | 32 | 114,355 | 1e7 + 130,143 | |
| HEAT -1e-2 | real | 32 | 43,750 | 1e7 + 52,246 | |
| HEAT 0, -1e-2 | real | 64, 128, 1024 | none in the window (rho = 0.020 .. 0.030 and 0.007 .. 0.025 at its end) | | |
| T-NR q = 2 | real | 32 | 2,095,166 | 2,836,716 | 2,790,511; 3,695,283 |
| T-NR q = 101 | real | 32, 64, 128 | 541; 1,028; 8,617 | 1,891; 3,195; 19,976 | |

Margins at equal height, N = 32, real weights: DH 0.496 (2145), 0.271 (7094), 0.153 (2.4e4), 0.075 (8.5e4), 0.024 (3.0e5), 0.021 (5e5); zeta 0.422 (2035), 0.339 (6561), 0.207 (2.2e4), 0.144 (7.5e4), 0.085 (2.6e5).

Reading.
- DH: positive margin at every N >= 24 up to the end of its list (T = 5e5, where it has about 1e5 off-line zeros; first at 85.7), and onsets for N <= 16 between 0.33 and 0.92 of zeta's height (between 1.6 and 4.6 of zeta's in the conductor-scaled height 5T). The control is not separated; it does not fail "much below" anything.
- ALT fails earlier (N = 2: T_0 = 1115; N = 16: 2.4e5 against 1.4e6). It has 26% of its zeros off the line (698,848 on-line zeros below 5e5 against 946,483 expected), so at its earliest onset (100 constraints, T = 1115) the list is already missing about 200 zeros; the size is not below the resolution of its off-line zeros.
- HEAT: tau = -2e-3 is indistinguishable from tau = 0 (114,355 against 116,042 constraints); tau = -1e-2 fails after 0.38 of the constraints, at which point the window already holds about 2,000 off-line pairs (4% of the zeros). For N >= 64 neither fails in the window.
- T-NR q = 2 behaves as zeta. T-NR q = 101 fails at T = 1.9e3 to 2.0e4 because its own main modes are n = 1, q, q^2 (Z_F = Z (2.2 + 2 cos(x log q)), frequencies log(n/q)) and N <= 128 < q^2 = 10201 leaves one of the three out of the span: a truncation of the support against the conductor q^2, not an arithmetic effect. q = 1e6+3 was not run for the same reason (N <= 1024 < q).
- EA has no on-line zero; the sign twists have no line; the unimodular twist is zeta translated.

Classification: CLOSED. Zeta's margin reaches 0 (certified for N <= 32), so the pass clause fails; DH and L(chi) reach 0 at comparable sizes; the mechanism is a recurrence on the phase torus.

## 5. Combination 3: confining-sign system on complex pairs

Setting. Under the pencil F - tau Z_w an off-line zero z_0 (Im z_0 > 0, s = 1/2 + i z) moves with dz_0/dtau = Z_w(z_0)/F'(z_0); confining means Im dz_0/dtau < 0. The constraint vector is c_n = -Im(Z_n(z_0)/F'(z_0)), Z_n(z) = n^(-1/2) cos(theta_F(z) - z log n).

Lemma (PROVED to first order in delta, MEASURED in mpmath). Plant a pair at z_0 = x* + i delta in place of a near-collision pair (g_a, g_b) of zeta: Z_pl(z) = Z(z)(z - z_0)(z - conj z_0)/((z - g_a)(z - g_b)). Then Z_pl'(z_0) = -2 i delta Z(z_0)/(delta^2 + (g_b - g_a)^2/4), Z(z_0) = Z(x*) - delta^2 Z''(x*)/2 + O(delta^3) is real with the sign of Z(x*), and Re Z_n(z_0) = a_n(x*) cosh(delta (theta'(x*) - log n)) + O(delta^2). Hence the confining constraint is, up to a positive factor,
 c_n = s_k a_n(x*_k) cosh(delta (theta'(x*_k) - log n)), s_k = sign Z''(x*_k):
the on-line constraint with the n-th mode multiplied by cosh(u (1 - log n/theta')), u = delta theta'(x*) = delta (1/2) log(T/2 pi). Check (`c3_offline.py A`, 30 digits, pairs near 111, 1454, 18054, 107732): cosine between the exact c and this form 0.99999998 .. 0.9999998 at u = 0.05, 0.9985 .. 0.9998 at u = 0.5, 0.86 .. 0.99 at u = 2; same orientation in all 12 cases; the velocity formula agrees with a direct root shift to 1e-6 or better.

Consequence (PROVED). If every pair is planted at the same u, the factor depends on k only through theta'(x*_k), which varies slowly; to that extent it is a fixed positive diagonal scaling of the modes, and feasibility of a strict homogeneous system is invariant under positive diagonal scalings. The off-line system is the on-line system in other coordinates.

Measured (`c3_offline.py B`, 673,230 near-collisions of zeta below 1e6, first-order form):

| N | u = 0 | 0.5 | 1 | 1.5 | 2 | 3 | 5 |
|---|---|---|---|---|---|---|---|
| 32: fraction of planted pairs with negative value under the on-line optimal weight | 0 | 0 | 0 | 1e-4 | 3e-4 | 1.5e-3 | 6.2e-3 |
| 32: margin of the planted system | 0.0424 | 0.0426 | 0.0419 | 0.0384 | 0.0338 | 0.0244 | 0.0103 |
| 128: fraction negative | 0 | 0 | 0 | 3e-4 | 1.0e-3 | 3.5e-3 | 1.0e-2 |
| 128: margin of the planted system | 0.0516 | 0.0524 | 0.0527 | 0.0507 | 0.0460 | 0.0333 | 0.0140 |
| 1024: fraction negative | 0 | 0 | 1e-4 | 6e-4 | 2.0e-3 | 5.9e-3 | 1.4e-2 |
| 1024: margin of the planted system | 0.0523 | 0.0536 | 0.0553 | 0.0535 | 0.0474 | 0.0326 | 0.0132 |

So the system does not detect planted pairs: at most 1e-4 of the pairs are negative while delta log(T/2 pi) <= 2, and about 1% are at delta log(T/2 pi) = 10; the planted system itself stays feasible with a margin of the size of the on-line one. The n = 1 sign rule of the source (sign Z'' = -sign cos theta at x*) holds at all 72 near-collisions below gamma_200 and fails at 27,109 of the 673,230 below 1e6 (4.0%; first at x* = 5658.09).

DH, actual pairs (`c3_offline.py C`; F' by mpmath at the 84 tabulated off-line zeros below 2000, delta = 0.016 .. 0.370, delta (1/2) log(5t/2pi) = 0.05 .. 1.23; normalisation checked against the sampled Hardy function to 8 digits):

| N | margin, 84 off-line pairs | margin, 544 on-line near-collisions | joint | off-line pairs confined by the on-line optimum |
|---|---|---|---|---|
| 4 | 0.705 | 0.689 | 0.675 | 84/84 |
| 16 | 0.553 | 0.538 | 0.530 | 84/84 |
| 32 | 0.535 | 0.496 | 0.490 | 84/84 |
| 128 | 0.507 | 0.434 | 0.432 | 84/84 |

With DH's own coefficients as the weight the fraction of off-line pairs confined is 1.00, 0.88, 0.66, 0.48, 0.25, 0.17 for N = 4 .. 128: the fixed weight has no sign; the free weight confines every pair.

Classification: CLOSED. For zeta the on-line system has no negative margin on near-collisions only up to T_0(N) (section 4); the actual off-line pairs of DH satisfy the confining system with a margin as large as the on-line one; planted pairs are invisible up to delta log T of order 10. Not run: the off-line pairs of the heat family and of EA (no table of F' was built); by the lemma they would be read in the same coordinates.

## 6. Combination 4: zero-conditioned prime phase sums

Method. For a list of M ordinates in a window, s_p = (1/M) sum_gamma e^{i gamma log p} is computed for every prime p <= P by a non-uniform FFT in u = log p (Gaussian gridding, 8-fold oversampling, 6-point interpolation), and A_fam(P) = sum_{p<=P} c_fam(p) log p p^(-1/2) s_p is accumulated per family and per residue class mod 5. The bias of C_F is Re A (for a complex character Re sum chi(p) conj(s_p)). Random heights: the same number of uniform points in the same window.

Expected value. CLASSICAL (Landau; Gonek for uniformity under RH): sum_{0<gamma<=T} x^{i gamma} = -(T/2pi) Lambda(x)/sqrt x + O(log T) for fixed x, so mean cos(gamma log p) = -log p/(sqrt p L), L = log(qT/2pi), and the bias is -sum_{p<=P} log^2 p/(p L) = -(log P)^2/(2L) while log P < L. Beyond (PROVED here from the explicit formula at a zero, given the pair-correlation form factor): sum_{n<=x} Lambda(n) n^(-rho) = -log x + L/2 - sum_{gamma' != gamma} sin((gamma'-gamma) log x)/(gamma'-gamma) + ..., and with F(alpha) = min(alpha, 1) the bias is -L int_0^alpha min(u, 1) du, alpha = log P/L: -log P + L/2 for alpha >= 1. For alpha > 1 this is the Montgomery conjecture beyond the proved range (prime-pair correlations), not a theorem.

Results (MEASURED; every list 1.0e6 ordinates unless stated; value at random heights in the same windows between -0.03 and +0.08):

| list | L | P = 1e2 | 1e4 | 1e6 | 1e8 | 1e10 | alpha at 1e10 |
|---|---|---|---|---|---|---|---|
| zeta, first 1e6 zeros: measured | 10.56 | -0.835 | -3.817 | -8.432 | -13.045 | -17.674 | 2.18 |
| prediction F = min(alpha, 1) | | -0.835 | -3.812 | -8.285 | -12.882 | -17.480 | |
| Landau diagonal alone | | -0.835 | -3.822 | -8.876 | -15.968 | -25.087 | |
| zeta, 1e6 zeros at 4.5e6 .. 5.0e6: measured | 13.54 | -0.645 | -2.955 | -6.857 | -11.580 | -16.187 | 1.70 |
| prediction | | -0.645 | -2.955 | -6.858 | -11.455 | -16.053 | |
| zeta, zeros 99,000,001 .. 100,000,000 (4.225e7 .. 4.265e7; server): measured | 15.73 | -0.556 | -2.544 | -5.908 | -10.493 | -15.107 (-16.199 at 2.99e10) | 1.46 (1.53) |
| prediction | | -0.556 | -2.544 | -5.907 | -10.391 | -14.989 (-16.083) | |
| zeta, first 1e5 zeros: measured | 8.51 | -1.042 | -4.721 | -9.437 | -14.041 | -18.862 | 2.71 |
| prediction | | -1.041 | -4.669 | -9.250 | -13.847 | -18.445 | |
| CHI with chi(p), 9.46e5 zeros to 5e5: measured | 11.98 | -0.691 | -3.320 | -7.733 | -12.365 | -16.977 | 1.92 |
| prediction | | -0.735 | -3.362 | -7.610 | -12.206 | -16.805 | |
| CHI with chibar(p) | | 0.125 | 0.167 | 0.219 | 0.174 | 0.171 | |
| CHI with c = 1 | | -0.015 | -0.027 | 0.050 | 0.083 | 0.055 | |
| DH on-line zeros (8.48e5) with a_DH(p) | 11.98 | -0.253 | -1.505 | -3.600 | -4.930 | -5.928 | 1.92 |
| (1 + kappa^2)/2 times the prediction (complete list) | | -0.397 | -1.817 | -4.113 | -6.596 | -9.081 | |
| HEAT tau = 0 (zeta at 1e7) | 14.30 | -0.611 | -2.797 | -6.489 | -11.186 | -15.807 | 1.61 |
| HEAT tau = -1e-2, on-line zeros (9.62e5) | 14.30 | -0.582 | -2.764 | -6.431 | -10.929 | -15.333 | |

Mixed pairs on zeta's first 1e6 zeros at P = 1e10 (true primes -17.674): random signs +0.128; DH coefficients -0.030; chi(p) +0.097; unimodular p^(-i) +0.878 and p^(-i/4) +5.07 (not a bias: the value oscillates with P); THIN -13.696 (= true - 2 * 1.989: the sum over S); T-NR q = 2, 101, 1e6+3: -17.746, -18.120, -17.704 (= true + 2.2 log q mean cos(gamma log q), mean cos = -0.0468, -0.0439, -0.00098).

Single primes. Zeta at 1e7: mean cos(gamma log q) = -0.03427, -0.04435, -0.05033, -0.03211 for q = 2, 3, 5, 101; Landau gives the same digits. DH on-line zeros: +0.04304 at q = 2 and -0.03291 at q = 3, where a complete list with coefficient a_DH(2) = kappa, a_DH(3) = -kappa would give -0.0117 and +0.0152. Per residue class the on-line zeros of DH carry the apparent prime coefficients (0.96, -0.06, +0.05, -0.96) against (1, 0.284, -0.284, -1).

Gap law (`c4_gaps.py`, 1500 heights, primes to 1e4 and 1e6, T = 1e3, 1e5, 4e6): the pooled law of the normalised gaps of gamma log p mod 2 pi is exponential for zeros and for random heights alike; Kolmogorov distance zeros against random 8e-5 to 2e-3, equal to the sampling scale 1/sqrt(number of gaps) in each of the five cases. Conditioning on a zero changes the first circular moment only (the bias above).

Reading.
- Zeta and L(chi) follow the form-factor prediction to alpha = 2.2 and 1.9 with a constant offset of -0.13 to -0.19 (lower-order terms; -0.42 at alpha = 2.7 on 1e5 zeros, inside the noise of that list, 0.07 to 0.3).
- The mixed pairs fail at every P, from the first prime: s_p determines Lambda(p) for each p separately (Landau). This is the recovery of the coefficients from the zeros (map row 33, lane `s1-zero-statistics-gram` section 5.2); it is linear in the coefficients, holds for every Dirichlet series with a logarithmic derivative whatever the position of its zeros, and is not a statement about all primes jointly.
- DH and HEAT fail on their own lists because the on-line list is incomplete: Landau's sum runs over all zeros, the off-line zeros carry weight x^{beta - 1/2 + i gamma}, and the on-line part differs by exactly their contribution (10.4% of DH's zeros; 4% for HEAT -1e-2, whose value is 3% off). The discrepancy at q = 2 for DH is 0.055 per zero against an error term O(log T) for the whole sum, so it is visible from about 100 zeros, T about 150, where DH has two off-line pairs. It is the count of missing zeros with the weight 2^{i gamma} (weight 1 gives the Turing count): verified height in another form.
- T-NR: the on-line list is zeta's, the q-coefficient enters through one term.

Classification: CLOSED.

## 7. What was not reached, and limits

- Combination 1: T to 1e9 was reached in windows of length 1.5e5, not on the whole range; P = 1e9. The sign-change count on a grid of step 0.038 misses pairs of zeros closer than the step (24 of 138,066 on [30, 1e5]); tau_+- are upper bounds for the first change. HEAT and EA pencils were not run.
- Combination 2: N = 1024 and 1e8 zeros were not reached together. The GPU stage could not allocate (device 1 held 89 to 93 GB of 98 GB for other jobs; two attempts ended in out-of-memory at 2.0 GB and at 0.3 GB) and the lane's CPU share on the server gave about 4e7 cosines per second, so the 1e8-zero list was used in full for N = 32, 64, 128 and 256 (one solve over 38,825,609 constraints takes 40 to 60 minutes at N = 128, 256), and N = 512, 1024 were run on the 1e7-zero list (T = 4.99e6). N = 64 is not certified. L(chi_-3) was replaced by chi mod 5 (lists available); conductor-5 lists end at T = 5e5, so onsets for N >= 24 (DH) and N >= 12 (CHI) are not located. The exact first infeasible index is float64; the certified statements are those of the last column of the table in 4.1.
- Combination 3: planted pairs use the first-order form (validated to u = 0.5; at u = 2 the exact vector differs by 1% to 14% in direction). Heights to 1e6 (task: 1e6). Heat and EA pairs not run.
- Combination 4: 1.0e6 ordinates per list (task: 1e7) and P = 1e10, 3e10 for two zeta lists (task: 1e10); the non-uniform FFT is float64 and was checked against direct sums on 20 primes per list. The "explicit-formula value" for alpha > 1 is the form-factor prediction, conjectural.
- The server ran at load average 120 to 160 on 48 cores during the session and the wrapper refused new units below 46 GB of available memory three times; several runs were therefore made on the Mac under `scripts/memcap.sh 8` (pencil windows to 1e7, control ladders, 1e10 phase sums), with the server used for the 1e8 zero list, the windows at 1e8 and 1e9, the control phase sums (second copy, identical digits) and the top window of the 1e8 list.

## 8. Files

- Code: `lib.py`, `primes.py`, `c1_pencil.py`, `c1_an.py`, `c2_margin.py`, `c2_an.py`, `c2_cert.py`, `c2_cert2.py`, `c2_cert3.py`, `c2_fixed.py`, `c3_offline.py`, `c4_phase.py`, `c4_an.py`, `c4_gaps.py`, `t_c2.py`, `t_c2b.py`, `run_*.sh`.
- Mac outputs `out/`: `c1_*.json`, `c2S_*.json` (N <= 24), `c2L_*.json`, `c2_local_zeta_cos_5e6.json`, `c2_local_zeta_cos_bigN.json` (N = 256, 512, 1024), `cert2_zeta_cos.json`, `cert3_zeta_cos_16.json`, `cert3_zeta_cos_32.json`, `c2S_zeta_cos_cert.json`, `c2S_zeta_cossin_cert.json`, `c2_fixed.json`, `c3_A.json`, `c3_B.json`, `c3_C.json`, `c4_local_zeta_1e10.json`, `c4_local_ctrl_1e10.json`, `c4_gaps.json`, logs.
- Server outputs copied to `out_server/` (server directory `~/rh-push/s2-prime-force-pencil/out/`; unit logs in `out_server/logs/`): `c2_zeta_cos_a.json` (N = 32, 64 on 1e8 zeros), `c2_zeta_cos_top_128.json`, `c2_zeta_cos_top_256.json`, `cert3_zeta_cos_64.json` (empty: not certified), `c1_zeta_w1e8_P1e9.json`, `c1_zeta_w1e9_P1e9.json`, `c4_zeta_top_3e10.json`, `c4_ctrl_1e10.json`. All units of this lane are stopped; the server directory keeps a 0.9 GB cache of the extrema of the 1e8 list (`out/nc_zeta_100116297.npz`).
- `data/dir_samples.npz`: copy of the sampled conductor-5 Hardy functions of lane `s1-zero-flow-dynamics` (65 MB).
