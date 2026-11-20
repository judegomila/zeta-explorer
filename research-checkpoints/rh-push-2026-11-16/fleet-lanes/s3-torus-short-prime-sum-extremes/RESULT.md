# s3-torus-short-prime-sum-extremes: screening of four combinations (2026-11-19/20)

Lane type: screener. Four combinations of graph nodes were turned into finite statistics, computed for zeta, a Dirichlet L-function (chi mod 5, chi(2) = i) and the controls on the compute server, and classified.

**Verdict: 0 survivors out of 4.**

- Combination 1 (pointwise short prime sums against beta(H)): zeta and L(chi) stay below the threshold at every sampled height; the sign and unimodular twists exceed it only at supports at or above the detection support of Lemma 2 of the source (the support at which the test function resolves an off-line pair at that height): 411 to 825 exceedances in 4e9 heights between 3e12 and 1e14 at N = 1e8, none in 1e10 heights at N = 6420 and none in 2e9 at N = 1.18e6. DEL exceeds once in 3e8 heights below the verified height and never above 3e12; the backward heat coefficients never. At N = 6420 only T-NR and DH exceed (coefficient size); E_a, whose off-line pairs are as dense as the zeros of zeta, exceeds from N = 1.18e6 on. The statistic is Weil non-negativity in one test direction; a pass at height H is the statement "no detectable off-line pair near H": verified height, sampled.
- Combination 2 (realised infimum of the barrier torus function against its torus infimum): the gap exists, with the same size (to 0.002), for the true orbit, for Haar base points, for the sign twist, for a Beurling-type perturbed prime set and for L(chi), over 3.2e9 realised heights of the true primes. No separation.
- Combination 3 (S from S_1 increments): the ratio is at most 1 for every sawtooth, by the lemma itself, for zeta, L(chi), DH and T-NR alike, and the inequality is an equality at delta of one mean spacing. The drift detector reads the count of off-line pairs below t; measured lead: zero for a single event (median lag +10 mean spacings), about 5 mean spacings in an average over 13,861 events (a deficit of the line count of 0.10 at 4 spacings before the off-line height).
- Combination 4 (prime phase resultant, pole removed): the statistic is the explicit formula; with the Fejer weight it is one-sided (V <= 0) exactly when the zeros near phi are on the line. The off-line bias follows the law P^d / ((d^2 + D^2) log P) at distance D (checked to 1e-3 for DH). For DH at P = 1e8 the violations reach 16 to 21 units of height below the nearest off-line zero and do not reach phi <= gamma_off / 4. Detection at distance D costs P of order (D^2 log P)^(1/d): worse than verifying the height.

Labels: PROVED (elementary, argument in this file), CLASSICAL, MEASURED (float64; GPU screen), RECHECKED (compared with exact-phase or 40-digit arithmetic), NOT RUN.

## 0. Shared code and validation

Files (this directory): `s3lib.py` (exact phases, non-uniform FFT, segmented sieve), `torus.py` (copy of the round-1 library: families, coefficient routines), `c1.py` (direct engine), `c1n.py` (lattice engine), `c1_recheck.py`, `c1_summary.py`, `c2.py`, `c2_check.py`, `c2_analyze.py`, `c3.py`, `c3_analyze.py`, `c3_dh_post.py`, `dh_zeros.py`, `c4.py`, `c4dh.py`, `c4_analyze.py`, `chain1.sh` ... `chain5.sh` (server job lists).

- Exact phases. frac(log p / 2 pi) is stored as a 128-bit integer for every prime; for integer heights H the cycle of H log n is an integer product mod 2^128. No phase is formed by multiplying a float64 height near 1e14 by a float64 logarithm.
- Lattice engine. On the lattice H0 + k step the sum over n of z_n e^{-i H log n} is a type-1 non-uniform FFT in k with frequencies 2 pi frac(step log n / 2 pi) (exponential-of-semicircle kernel, width 12 or 14, oversampling 2 or more). Cost per height is independent of the number of terms.
- Known-answer checks (all in the logs or in the JSON files):
  - NUFFT against direct sums: relative error 2.5e-12 (width 12), 5e-14 (width 14) (`v2.py`).
  - Lattice phases against 60-digit mpmath: 1.1e-16 cycles (`validate_lib.py`).
  - Direct engine against lattice engine on the same 2e5 heights: identical histograms, largest difference of the extremes 3.2e-11 (prime-power mode) and 4.7e-11 (full coefficients).
  - Extremes against 40-digit evaluation: see the recheck lines under each table of section 2.1.
  - Combination 2: NUFFT values at the 96 reported minima of the true orbit against direct sums with exact phases: 6.6e-11. Torus infimum recomputed with the source script for two rows: 0.309205 (y = 0.10) and -0.028834 (y = 0.14), equal to the recorded values.
  - Combination 3: Z(t) against mpmath `siegelz`: 3.7e-9 (1e6), 1.2e-9 (1e8), 7.3e-10 (1e10). Zero counts in the windows at 1e12 and 1e13: exactly 1,000,000 zeros found for 1,000,000 expected, and the window mean of S is 0 to 5 decimals with the constant fixed by theta(t0) mod pi (a missed pair of zeros would shift the mean by 2 times the remaining fraction of the window). L(1/2 + it, chi) against mpmath: 1.3e-9; imaginary part of Z_chi and Z_DH: below 8e-8 on [1, 1e6]. The first eight step heights of the DH line count were matched to off-line zeros found by mpmath root finding (30 digits): 0.808517 + 85.699348i, 0.650830 + 114.163343i, 0.574356 + 166.479306i, 0.724258 + 176.702461i, 0.869531 + 240.404672i, 0.819550 + 320.876490i, 0.768223 + 331.050259i, 0.628508 + 366.640908i (`dh_offline_zeros.json`).
  - Combination 4: V(phi) for zeta at P = 1e6 against -(L/2) sum over the first 120 zeros (both signs) of sinc^2((gamma - phi) L / 2), on 1 <= phi <= 135: largest difference 5.3e-4 (the tail of the zero sum); value at the first zero -6.9090 against -L/2 = -6.9078.
- Families. ZETA; CHI (chi mod 5, the positive comparison); SGN (random signs on the primes, completely multiplicative); UNI (random unimodular multipliers); LIO (u_p = -1); DEL (primes of a set S deleted, S with counting function int_2^x t^(b-1) dt / log t, b = 0.75: the control of lane c10 with a real zero at s = b); THIN (sign flip on a set of half that density); T-NR (zeta(s) m(s), m = 3^(s-1/2) + 2.2 + 3^(1/2-s), off-line zeros on Re s = 0.90375 at heights (2k+1) pi / log 3); E_a (zeta(s+a) zeta(s-a), a = 0.1); DH (Davenport-Heilbronn, full log-derivative coefficients Lambda_DH(n), all n); HEAT (coefficient side of the backward heat deformation, a_n = exp(tau log^2 n / 4), tau = -0.5, log-derivative coefficients; the height-dependent factor of H_tau is not included).
- Server use: GPU 1 only, through `rhrun`; per job at most 8 cores and 12 GB; cupy pool limit 20 to 22 GB. The card was shared with other lanes and was full for part of the session (one job of this lane failed at start for that reason and was started again).

## 1. Results table

| # | combination (nodes) | statistic | sizes reached | zeta | L(chi mod 5) | sign and unimodular twists | DEL / THIN / LIO | DH | T-NR | E_a (a = 0.1) | backward heat | classification |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | star-min-pointwise-prime-bound + l-damped-finite-window-floor + lemma-mp3-multipoint-phase | max over sampled integer heights H of LHS_F(H) - beta_F(H); LHS = sum_{n<=N} Re(Lambda_F(n) n^(-iH)) n^(-1/2) w_{a,delta}(log n); count of exceedances; extremes in units of the Haar sd | H in [3e12, 1e14]: 1e10 heights at N = 6420; 2e9 at N = 1.18e6; 4e9 at N = 1e8 (5.76e6 prime powers); Haar-flow references 2e9, 2e9, 1e9. H in [1e6, 3e8]: 2.99e8 heights at N = 6e4. Extremes rechecked: 40 digits (N <= 1.18e6), exact 128-bit phases (N = 1e8), agreement 9e-8 or better | no exceedance in any run; max -6.31 (N = 6420), -3.01 (1.18e6), -1.84 (1e8), -0.82 (verified range). Largest LHS in sd: 6.14, 5.40, 4.57, 4.31; smallest: -6.1, -5.9, -6.1, -5.3 | no exceedance; -6.64, -3.68, -2.28, -1.14; 6.6, 5.4, 4.7, 4.7 sd | N = 6420: none (max -5.66), tail = Haar. N = 1.18e6: none (max -1.13). N = 1e8: 411 to 825 exceedances per column (rate 1.0e-7 to 2.1e-7 = Haar-flow rate). Verified range: 444 to 550 (1.5e-6 to 1.8e-6 = Haar-flow rate) | DEL: none above 3e12 (max -0.85 at N = 1e8); verified range 0 and 1 exceedances. THIN: 88 and 126; LIO: 185 and 246 (verified range; not run above 3e12) | full coefficients: rate 7.2e-5 at N = 6420, 1.0e-2 at N = 1.18e6 (extremes of 17 and 58 sd: coefficient growth, zeros to the right of 1) | rate 1.1e-2 (N = 6420) to 0.46 (N = 1e8) (root of the local factor at 3 of modulus 3^0.404) | none at N = 6420 (max -9.2); 6.6e-7 at N = 1.18e6; 4.2e-3 at N = 1e8; 7.8e-6 in the verified range | coefficient side, tau = -0.5: never (torus sup 8.3 below beta at N = 6420; max -8.8 at N = 1.18e6) | not a survivor: no separation from the twists below the detection support; at the detection support the pass of zeta is Weil non-negativity for one window (a local zero-free statement); DEL and heat do not fail |
| 2 | bohr-torus-scan-certification + fejer-riesz-branch-reduction + p47-late-cell-floors | inf over realised heights x of G = abs B - gamma abs A (N = 690988, six rows of the line Lambda = 0.145) minus the torus infimum | every x on a grid of step 0.1294 in 48 windows of length 8.68e6 for the true primes (3.2e9 heights; 16 of them from x = 4 pi N^2), 56 Haar windows, 20 sign-twist, 20 perturbed-prime, 16 + 16 for L(chi); minima rechecked with exact phases (6.6e-11) | realised inf 0.326 to 0.43; above the torus inf by 0.045 to 0.055 (rows y <= 0.10), 0.36 (y = 0.12), 0.44 to 0.94 (rows y >= 0.14, torus inf negative) | its own torus function (multiples of 5 removed): window minima equal to those of its Haar flow (z = -0.1 to -0.5) | same gap: mean window minima within 0.002 of the true orbit (z between -3.2 and +1.3; the -3 only against the first 8 Haar windows, +0.6 against 16 new ones) | Beurling-type perturbed primes: same gap (z between -3.8 and +1.3) | not applicable | not applicable | not applicable | the function is the heat-deformed sum itself | not a survivor: the finite-window gap is the same for true primes and controls |
| 3 | sawtooth-s-of-t + sawtooth-s-of-t-lemma + discrepancy-bridge-constant | sup abs S / sqrt(2 A rho), A = range of S_1 (the family's own); the same with A_delta at delta = 1 to 32 mean spacings; drift of the line count S_0 and its lead before an off-line height | zeta: 1e6 zeros in each of five windows at t = 1e6, 1e8, 1e10, 1e12, 1e13 (4e7 grid points each); L(chi), DH: all zeros with t < 1e6 (2.0e6 and 1.79e6 on the line; 106,199 off-line pairs of DH) | ratio 0.73, 0.65, 0.64, 0.63, 0.59; sup abs S = 1.90, 1.97, 2.18, 2.39, 2.32; at delta = one mean spacing the ratio is 0.99 to 1.00 (equality case) | ratio 0.52; sup abs S = 1.84 | no functional equation: S not defined | not defined | ratio at most 1 (Lemma T); below the first off-line height (85.7): 0.67. Line count drifts to -212,397; single-event lead 0 (median lag +10 mean spacings); averaged over 13,861 steps: deficit 0.10 at 4 spacings before | true S: ratio 0.69; line count drifts at slope -log 3 / pi from t = 0, crosses the bound at t = 7.5 (first off-line zero 2.86) | not run | not run | not a survivor: the ratio cannot exceed 1 for any counting function; the drift is Turing's count with lead zero |
| 4 | hyperbolic-prime-spiral + sunit-count-cubic | V(phi; P) = Re R_F - Re Pole - beta_F, R_F = sum_{n<=P} Lambda_F(n) n^(-1/2) (1 - log n / log P) e^(-i phi log n); sup over phi; violations on phi <= gamma_off / 4 | all 4,118,054,813 primes to 1e11 and their powers; 1e8 values of phi in (0, 1e6]; checkpoints 1e7 ... 1e11. DH with full coefficients: n <= 1e8, phi <= 400. Checked against the zero sum of zeta to 5e-4 | V < 0 everywhere: sup = -0.0016 at P = 1e11; mean -5.489 = -mean beta | V < 0 everywhere: sup = -0.0056 | V > 0 on 4.5 to 14.2 percent of phi; on half of the points of phi <= 21.4 | DEL, THIN: V > 0 on 1.5 to 13 percent; sup 248 and 497 at phi = 0.2 (the real zero at 3/4, term P^(1/4)) | full coefficients: no violation on phi <= 21.4 = gamma_1 / 4 up to P = 1e8 (off-line term 0.003 against an on-line sum of at least 0.007); violations within 16 to 21 of an off-line zero; V minus the predicted off-line term <= -0.004. Prime-only coefficients: violations at every P (not a character) | V > 0 on 37 to 50 percent of phi (off-line zeros within 2.86 of every phi) | V > 0 on 11 to 35 percent | not run (coefficients needed at all n; see combination 1 for the short sums) | not a survivor: the statistic is the explicit formula; the non-local term P^d / ((d^2 + D^2) L) is confirmed and too small at phi <= gamma_off / 4 for DH at the sizes reached |

## 2. Details per combination

### 2.1 Combination 1: pointwise short prime sums against beta(H)

Nodes: `star-min-pointwise-prime-bound`, `l-damped-finite-window-floor`, `lemma-mp3-multipoint-phase`. Source: `formalization/rh-attempts/2026-11-01-contradiction.md`, "The line where it fails" and section 3.5.

Definitions (from the source). f(u) = e^{-iHu} sinh(delta u) on [-a, a]; g_0(v) = sinh(delta(2a - |v|))/(2 delta) - (2a - |v|) cosh(delta v)/2; m = sinh(2 a delta)/(2 delta) - a; w = g_0 / m;

    LHS_F(H) = sum_{n <= e^{2a}} Re(Lambda_F(n) n^{-iH}) n^{-1/2} w(log n),      (star): LHS_F(H) <= beta_F(H).

(star) is W(f) >= 0 (Weil non-negativity in this direction); the threshold used is thr_F(H) = (1/2) log(q_F H / 2 pi) with q = 1 (zeta), 5 (chi, DH), 9 (T-NR, from the factor 3^(s-1/2)), and 2 beta for E_a (degree 2); the O(1/H) terms are dropped. For the families without a functional equation (SGN, UNI, LIO, DEL, THIN, HEAT) the zeta threshold is used. The source's (star_min) allows the extra slack s(a) > 0 on the right; all runs below use the stronger (star), so every pass of (star) is a pass of (star_min).

Finite consequence tested: zeta's realised supremum of LHS - beta over the sampled heights is negative; each control's is positive at heights unrelated to its zeros; and (the rotation-invariance question of round 1) zeta's supremum along the orbit is smaller than the supremum along Haar-flow orbits by a margin the twists do not have. Survival would need all three at supports below the detection support, the support a_ideal(delta, H) solving sinh(2 a delta)/delta - 2a = log(H / 2 pi) (source, Lemma 2: an isolated off-line pair of offset delta at height H is visible to some test function of support a if and only if a exceeds a_ideal).

Heights: integer lattice in [3e12, 1e14] (runs A, B, C, F) and in [1e6, 3e8] (run E, below the verified height, as a contrast). "Haar flow": every block of 6.7e7 lattice points starts from independent uniform prime phases and follows the same flow; by Lemma R of lane s1 the SGN and UNI orbits are translates of the zeta orbit and are a second Haar reference.

#### Run A: N = 6420 (detection support of offset 3/8 at 3e12) [c1n_A.json]  N = 6.42e+03 (879 terms), heights 1.000e+10 on the lattice 3e+12 + k*9701, mode orbit
| family | delta | 2a | torus sup | sd | max LHS | max LHS / sd | min LHS / sd | max (LHS - thr) | count LHS > thr | rate | rate above thr - x, orbit vs Haar flow |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ZETA | 0.375 | 8.767 | 40.85 | 1.273 | 7.821 | 6.14 | -6.11 | -6.308 | 0 | 0.00e+00 | x=9: 1.13e-05 vs 1.13e-05; x=8: 3.23e-07 vs 3.33e-07; x=7: 4.60e-09 vs 5.00e-09; x=6: 0.00e+00 vs 0.00e+00 |
| ZETA | 0.05 | 8.767 | 40.44 | 1.340 | 8.229 | 6.14 | -6.11 | -6.018 | 0 | 0.00e+00 | x=9: 2.55e-05 vs 2.55e-05; x=8: 9.91e-07 vs 9.92e-07; x=7: 2.14e-08 vs 2.50e-08; x=6: 0.00e+00 vs 5.00e-10 |
| CHI | 0.375 | 8.767 | 40.49 | 1.256 | 8.230 | 6.55 | -6.32 | -7.152 | 0 | 0.00e+00 |  |
| CHI | 0.05 | 8.767 | 40.03 | 1.319 | 8.691 | 6.59 | -6.34 | -6.640 | 0 | 0.00e+00 |  |
| SGN | 0.375 | 8.767 | 40.85 | 1.273 | 8.546 | 6.71 | -6.54 | -6.176 | 0 | 0.00e+00 | x=9: 1.13e-05 vs 1.13e-05; x=8: 3.31e-07 vs 3.33e-07; x=7: 5.60e-09 vs 5.00e-09; x=6: 0.00e+00 vs 0.00e+00 |
| SGN | 0.05 | 8.767 | 40.44 | 1.340 | 8.914 | 6.65 | -6.43 | -5.664 | 0 | 0.00e+00 | x=9: 2.54e-05 vs 2.55e-05; x=8: 9.90e-07 vs 9.92e-07; x=7: 2.18e-08 vs 2.50e-08; x=6: 2.00e-10 vs 5.00e-10 |
| UNI | 0.375 | 8.767 | 40.85 | 1.273 | 8.239 | 6.47 | -6.31 | -6.295 | 0 | 0.00e+00 | x=9: 1.13e-05 vs 1.13e-05; x=8: 3.18e-07 vs 3.33e-07; x=7: 5.00e-09 vs 5.00e-09; x=6: 0.00e+00 vs 0.00e+00 |
| UNI | 0.05 | 8.767 | 40.44 | 1.340 | 8.805 | 6.57 | -6.32 | -5.871 | 0 | 0.00e+00 | x=9: 2.55e-05 vs 2.55e-05; x=8: 9.79e-07 vs 9.92e-07; x=7: 2.25e-08 vs 2.50e-08; x=6: 2.00e-10 vs 5.00e-10 |
| DEL | 0.375 | 8.767 | 32.38 | 1.113 | 7.130 | 6.40 | -6.20 | -6.581 | 0 | 0.00e+00 |  |
| DEL | 0.05 | 8.767 | 31.62 | 1.158 | 7.518 | 6.49 | -6.41 | -6.193 | 0 | 0.00e+00 |  |
| TNR | 0.375 | 8.767 | 61.40 | 7.716 | 23.493 | 3.04 | -3.30 | +8.178 | 107297087 | 1.07e-02 |  |
| TNR | 0.05 | 8.767 | 61.59 | 7.591 | 23.923 | 3.15 | -3.44 | +8.609 | 117769934 | 1.18e-02 |  |
| EA | 0.375 | 8.767 | 101.90 | 3.059 | 18.978 | 6.20 | -6.07 | -9.653 | 0 | 0.00e+00 |  |
| EA | 0.05 | 8.767 | 99.91 | 3.173 | 19.513 | 6.15 | -6.11 | -9.213 | 0 | 0.00e+00 |  |

#### Run D: Haar-flow reference for A [c1n_D.json]  N = 6.42e+03 (879 terms), heights 2.000e+09 on the lattice 3e+12 + k*48501, mode haarflow
| family | delta | 2a | torus sup | sd | max LHS | max LHS / sd | min LHS / sd | max (LHS - thr) | count LHS > thr | rate | rate above thr - x, orbit vs Haar flow |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ZETA | 0.375 | 8.767 | 40.85 | 1.273 | 8.408 | 6.60 | -6.07 | -6.257 | 0 | 0.00e+00 |  |
| ZETA | 0.05 | 8.767 | 40.44 | 1.340 | 8.767 | 6.54 | -6.13 | -5.898 | 0 | 0.00e+00 |  |

#### Run B: N = 1.18e6 (detection support of offset 0.2) [c1n_B.json]  N = 1.18e+06 (91741 terms), heights 2.000e+09 on the lattice 3e+12 + k*48501, mode orbit
| family | delta | 2a | torus sup | sd | max LHS | max LHS / sd | min LHS / sd | max (LHS - thr) | count LHS > thr | rate | rate above thr - x, orbit vs Haar flow |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ZETA | 0.2 | 13.98 | 513.36 | 2.089 | 11.273 | 5.40 | -5.94 | -3.439 | 0 | 0.00e+00 | x=9: 3.63e-03 vs 3.58e-03; x=8: 7.93e-04 vs 8.09e-04; x=7: 1.35e-04 vs 1.50e-04; x=6: 1.56e-05 vs 2.27e-05 |
| ZETA | 0.05 | 13.98 | 492.29 | 2.165 | 11.563 | 5.34 | -5.93 | -3.014 | 0 | 0.00e+00 | x=9: 4.77e-03 vs 4.68e-03; x=8: 1.15e-03 vs 1.16e-03; x=7: 2.23e-04 vs 2.38e-04; x=6: 3.20e-05 vs 4.04e-05 |
| CHI | 0.2 | 13.98 | 512.79 | 2.064 | 11.177 | 5.41 | -6.15 | -4.061 | 0 | 0.00e+00 |  |
| CHI | 0.05 | 13.98 | 491.67 | 2.138 | 11.563 | 5.41 | -6.31 | -3.681 | 0 | 0.00e+00 |  |
| SGN | 0.2 | 13.98 | 513.36 | 2.089 | 12.870 | 6.16 | -5.98 | -1.675 | 0 | 0.00e+00 | x=9: 3.58e-03 vs 3.58e-03; x=8: 8.09e-04 vs 8.09e-04; x=7: 1.50e-04 vs 1.50e-04; x=6: 2.29e-05 vs 2.27e-05 |
| SGN | 0.05 | 13.98 | 492.29 | 2.165 | 13.166 | 6.08 | -6.06 | -1.134 | 0 | 0.00e+00 | x=9: 4.68e-03 vs 4.68e-03; x=8: 1.16e-03 vs 1.16e-03; x=7: 2.38e-04 vs 2.38e-04; x=6: 4.06e-05 vs 4.04e-05 |
| UNI | 0.2 | 13.98 | 513.36 | 2.089 | 12.522 | 5.99 | -6.17 | -1.786 | 0 | 0.00e+00 | x=9: 3.58e-03 vs 3.58e-03; x=8: 8.09e-04 vs 8.09e-04; x=7: 1.50e-04 vs 1.50e-04; x=6: 2.27e-05 vs 2.27e-05 |
| UNI | 0.05 | 13.98 | 492.29 | 2.165 | 13.045 | 6.03 | -6.01 | -1.289 | 0 | 0.00e+00 | x=9: 4.68e-03 vs 4.68e-03; x=8: 1.16e-03 vs 1.16e-03; x=7: 2.38e-04 vs 2.38e-04; x=6: 4.03e-05 vs 4.04e-05 |
| DEL | 0.2 | 13.98 | 479.26 | 1.924 | 11.009 | 5.72 | -5.85 | -3.095 | 0 | 0.00e+00 |  |
| DEL | 0.05 | 13.98 | 458.00 | 1.981 | 11.173 | 5.64 | -5.81 | -2.930 | 0 | 0.00e+00 |  |
| TNR | 0.2 | 13.98 | 688.18 | 54.545 | 174.470 | 3.20 | -3.09 | +158.178 | 625410714 | 3.13e-01 |  |
| TNR | 0.05 | 13.98 | 662.74 | 51.579 | 169.702 | 3.29 | -3.17 | +153.478 | 535062657 | 2.68e-01 |  |
| EA | 0.2 | 13.98 | 1801.19 | 6.420 | 34.320 | 5.35 | -5.87 | +4.801 | 1326 | 6.63e-07 |  |
| EA | 0.05 | 13.98 | 1707.57 | 6.504 | 33.994 | 5.23 | -5.94 | +4.604 | 2092 | 1.05e-06 |  |

#### Run D2: Haar-flow reference for B [c1n_D2.json]  N = 1.18e+06 (91741 terms), heights 2.000e+09 on the lattice 3e+12 + k*48501, mode haarflow
| family | delta | 2a | torus sup | sd | max LHS | max LHS / sd | min LHS / sd | max (LHS - thr) | count LHS > thr | rate | rate above thr - x, orbit vs Haar flow |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ZETA | 0.2 | 13.98 | 513.36 | 2.089 | 14.060 | 6.73 | -5.87 | -0.378 | 0 | 0.00e+00 |  |
| ZETA | 0.05 | 13.98 | 492.29 | 2.165 | 14.842 | 6.86 | -5.89 | +0.404 | 1 | 5.00e-10 |  |

#### Run F: N = 1e8 (detection support of offset 0.137) [c1n_F.json]  N = 1e+08 (5762859 terms), heights 4.000e+09 on the lattice 3e+12 + k*24251, mode orbit
| family | delta | 2a | torus sup | sd | max LHS | max LHS / sd | min LHS / sd | max (LHS - thr) | count LHS > thr | rate | rate above thr - x, orbit vs Haar flow |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ZETA | 0.137 | 18.42 | 4259.89 | 2.785 | 12.713 | 4.57 | -6.10 | -2.074 | 0 | 0.00e+00 | x=9: 2.11e-02 vs 2.07e-02; x=8: 8.56e-03 vs 8.37e-03; x=7: 3.03e-03 vs 3.03e-03; x=6: 8.40e-04 vs 9.81e-04 |
| ZETA | 0.1 | 18.42 | 4155.13 | 2.826 | 12.872 | 4.55 | -6.07 | -1.943 | 0 | 0.00e+00 | x=9: 2.27e-02 vs 2.22e-02; x=8: 9.38e-03 vs 9.18e-03; x=7: 3.45e-03 vs 3.41e-03; x=6: 1.02e-03 vs 1.14e-03 |
| ZETA | 0.05 | 18.42 | 4055.35 | 2.861 | 12.993 | 4.54 | -6.04 | -1.843 | 0 | 0.00e+00 | x=9: 2.40e-02 vs 2.35e-02; x=8: 1.01e-02 vs 9.90e-03; x=7: 3.82e-03 vs 3.76e-03; x=6: 1.19e-03 vs 1.28e-03 |
| CHI | 0.137 | 18.42 | 4259.19 | 2.759 | 13.021 | 4.72 | -6.12 | -2.531 | 0 | 0.00e+00 |  |
| CHI | 0.1 | 18.42 | 4154.41 | 2.800 | 13.232 | 4.73 | -6.12 | -2.421 | 0 | 0.00e+00 |  |
| CHI | 0.05 | 18.42 | 4054.62 | 2.834 | 13.392 | 4.73 | -6.12 | -2.284 | 0 | 0.00e+00 |  |
| SGN | 0.137 | 18.42 | 4259.89 | 2.785 | 17.676 | 6.35 | -6.59 | +3.657 | 411 | 1.03e-07 | x=9: 2.07e-02 vs 2.07e-02; x=8: 8.37e-03 vs 8.37e-03; x=7: 3.03e-03 vs 3.03e-03; x=6: 9.78e-04 vs 9.81e-04 |
| SGN | 0.1 | 18.42 | 4155.13 | 2.826 | 18.123 | 6.41 | -6.60 | +4.104 | 585 | 1.46e-07 | x=9: 2.22e-02 vs 2.22e-02; x=8: 9.18e-03 vs 9.18e-03; x=7: 3.41e-03 vs 3.41e-03; x=6: 1.13e-03 vs 1.14e-03 |
| SGN | 0.05 | 18.42 | 4055.35 | 2.861 | 18.496 | 6.47 | -6.64 | +4.478 | 795 | 1.99e-07 | x=9: 2.35e-02 vs 2.35e-02; x=8: 9.90e-03 vs 9.90e-03; x=7: 3.76e-03 vs 3.76e-03; x=6: 1.28e-03 vs 1.28e-03 |
| UNI | 0.137 | 18.42 | 4259.89 | 2.785 | 18.007 | 6.47 | -6.23 | +3.286 | 426 | 1.06e-07 | x=9: 2.07e-02 vs 2.07e-02; x=8: 8.37e-03 vs 8.37e-03; x=7: 3.03e-03 vs 3.03e-03; x=6: 9.79e-04 vs 9.81e-04 |
| UNI | 0.1 | 18.42 | 4155.13 | 2.826 | 18.223 | 6.45 | -6.28 | +3.502 | 632 | 1.58e-07 | x=9: 2.22e-02 vs 2.22e-02; x=8: 9.18e-03 vs 9.18e-03; x=7: 3.41e-03 vs 3.41e-03; x=6: 1.13e-03 vs 1.14e-03 |
| UNI | 0.05 | 18.42 | 4055.35 | 2.861 | 18.385 | 6.43 | -6.32 | +3.664 | 825 | 2.06e-07 | x=9: 2.35e-02 vs 2.35e-02; x=8: 9.90e-03 vs 9.90e-03; x=7: 3.76e-03 vs 3.76e-03; x=6: 1.28e-03 vs 1.28e-03 |
| DEL | 0.137 | 18.42 | 4157.54 | 2.616 | 13.442 | 5.14 | -5.58 | -1.213 | 0 | 0.00e+00 |  |
| DEL | 0.1 | 18.42 | 4053.18 | 2.650 | 13.623 | 5.14 | -5.59 | -1.028 | 0 | 0.00e+00 |  |
| DEL | 0.05 | 18.42 | 3953.92 | 2.678 | 13.767 | 5.14 | -5.59 | -0.848 | 0 | 0.00e+00 |  |
| TNR | 0.137 | 18.42 | 5228.36 | 284.312 | 960.873 | 3.38 | -3.18 | +944.808 | 1863913726 | 4.66e-01 |  |
| TNR | 0.1 | 18.42 | 5106.40 | 275.932 | 943.447 | 3.42 | -3.21 | +927.502 | 1853106514 | 4.63e-01 |  |
| TNR | 0.05 | 18.42 | 4989.76 | 268.173 | 926.407 | 3.45 | -3.24 | +910.561 | 1842009442 | 4.61e-01 |  |
| EA | 0.137 | 18.42 | 21511.68 | 11.168 | 54.258 | 4.86 | -5.80 | +23.980 | 16798829 | 4.20e-03 |  |
| EA | 0.1 | 18.42 | 20871.57 | 11.180 | 54.286 | 4.86 | -5.82 | +24.007 | 17033323 | 4.26e-03 |  |
| EA | 0.05 | 18.42 | 20270.76 | 11.181 | 54.209 | 4.85 | -5.83 | +23.931 | 17118684 | 4.28e-03 |  |

#### Run F2: Haar-flow reference for F [c1n_F2.json]  N = 1e+08 (5762859 terms), heights 1.000e+09 on the lattice 3e+12 + k*97001, mode haarflow
| family | delta | 2a | torus sup | sd | max LHS | max LHS / sd | min LHS / sd | max (LHS - thr) | count LHS > thr | rate | rate above thr - x, orbit vs Haar flow |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ZETA | 0.137 | 18.42 | 4259.89 | 2.785 | 16.858 | 6.05 | -6.08 | +2.516 | 95 | 9.50e-08 |  |
| ZETA | 0.1 | 18.42 | 4155.13 | 2.826 | 17.226 | 6.10 | -6.03 | +2.906 | 155 | 1.55e-07 |  |
| ZETA | 0.05 | 18.42 | 4055.35 | 2.861 | 17.552 | 6.14 | -6.02 | +3.232 | 220 | 2.20e-07 |  |

#### Run C: full log-derivative coefficients, N = 6420 [c1n_C.json]  N = 6.42e+03 (6419 terms), heights 1.000e+09 on the lattice 3e+12 + k*97001, mode orbit
| family | delta | 2a | torus sup | sd | max LHS | max LHS / sd | min LHS / sd | max (LHS - thr) | count LHS > thr | rate | rate above thr - x, orbit vs Haar flow |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ZETA | 0.375 | 8.767 | 40.85 | 1.273 | 8.099 | 6.36 | -6.02 | -6.753 | 0 | 0.00e+00 |  |
| ZETA | 0.05 | 8.767 | 40.44 | 1.340 | 8.623 | 6.43 | -6.07 | -6.327 | 0 | 0.00e+00 |  |
| DH | 0.375 | 8.767 | 93.07 | 1.874 | 32.563 | 17.38 | -17.45 | +17.435 | 71777 | 7.18e-05 |  |
| DH | 0.05 | 8.767 | 90.00 | 1.909 | 32.126 | 16.83 | -16.84 | +16.998 | 72552 | 7.26e-05 |  |
| HEAT | 0.375 | 8.767 | 8.33 | 0.411 | 2.187 | 5.32 | -10.21 | -11.807 | 0 | 0.00e+00 |  |
| HEAT | 0.05 | 8.767 | 8.71 | 0.453 | 2.256 | 4.97 | -9.48 | -11.753 | 0 | 0.00e+00 |  |

#### Run C2: full log-derivative coefficients, N = 1.18e6 [c1n_C2.json]  N = 1.18e+06 (1179999 terms), heights 1.000e+09 on the lattice 3e+12 + k*97001, mode orbit
| family | delta | 2a | torus sup | sd | max LHS | max LHS / sd | min LHS / sd | max (LHS - thr) | count LHS > thr | rate | rate above thr - x, orbit vs Haar flow |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ZETA | 0.2 | 13.98 | 513.36 | 2.089 | 10.947 | 5.24 | -5.68 | -3.293 | 0 | 0.00e+00 |  |
| ZETA | 0.05 | 13.98 | 492.29 | 2.165 | 11.561 | 5.34 | -5.74 | -3.062 | 0 | 0.00e+00 |  |
| DH | 0.2 | 13.98 | 2136.60 | 6.285 | 366.106 | 58.25 | -57.31 | +350.134 | 10674180 | 1.07e-02 |  |
| DH | 0.05 | 13.98 | 2013.77 | 6.128 | 351.995 | 57.44 | -55.70 | +336.023 | 10049618 | 1.00e-02 |  |
| HEAT | 0.2 | 13.98 | 28.90 | 0.559 | 6.096 | 10.90 | -18.25 | -8.868 | 0 | 0.00e+00 |  |
| HEAT | 0.05 | 13.98 | 29.25 | 0.592 | 6.148 | 10.39 | -17.22 | -8.816 | 0 | 0.00e+00 |  |

#### Run E: heights 1e6 to 3e8 (below the verified height), N = 6e4 [c1n_E.json]  N = 6e+04 (6148 terms), heights 2.990e+08 on the lattice 1e+06 + k*1, mode orbit
| family | delta | 2a | torus sup | sd | max LHS | max LHS / sd | min LHS / sd | max (LHS - thr) | count LHS > thr | rate | rate above thr - x, orbit vs Haar flow |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ZETA | 0.2 | 11.0 | 120.87 | 1.659 | 7.143 | 4.31 | -5.28 | -0.853 | 0 | 0.00e+00 | x=9: 6.48e-01 vs 6.45e-01; x=8: 4.14e-01 vs 4.17e-01; x=7: 2.13e-01 vs 2.16e-01; x=6: 8.94e-02 vs 8.74e-02 |
| ZETA | 0.15 | 11.0 | 120.01 | 1.676 | 7.202 | 4.30 | -5.27 | -0.816 | 0 | 0.00e+00 | x=9: 6.46e-01 vs 6.43e-01; x=8: 4.15e-01 vs 4.17e-01; x=7: 2.15e-01 vs 2.18e-01; x=6: 9.13e-02 vs 8.94e-02 |
| CHI | 0.2 | 11.0 | 120.37 | 1.635 | 7.678 | 4.70 | -5.35 | -1.171 | 0 | 0.00e+00 |  |
| CHI | 0.15 | 11.0 | 119.50 | 1.652 | 7.779 | 4.71 | -5.33 | -1.136 | 0 | 0.00e+00 |  |
| SGN | 0.2 | 11.0 | 120.87 | 1.659 | 10.025 | 6.04 | -5.71 | +2.002 | 447 | 1.49e-06 | x=9: 6.45e-01 vs 6.45e-01; x=8: 4.17e-01 vs 4.17e-01; x=7: 2.16e-01 vs 2.16e-01; x=6: 8.74e-02 vs 8.74e-02 |
| SGN | 0.15 | 11.0 | 120.01 | 1.676 | 10.111 | 6.03 | -5.73 | +2.064 | 539 | 1.80e-06 | x=9: 6.43e-01 vs 6.43e-01; x=8: 4.17e-01 vs 4.17e-01; x=7: 2.18e-01 vs 2.18e-01; x=6: 8.94e-02 vs 8.94e-02 |
| UNI | 0.2 | 11.0 | 120.87 | 1.659 | 9.532 | 5.75 | -5.63 | +2.072 | 444 | 1.48e-06 | x=9: 6.45e-01 vs 6.45e-01; x=8: 4.17e-01 vs 4.17e-01; x=7: 2.16e-01 vs 2.16e-01; x=6: 8.74e-02 vs 8.74e-02 |
| UNI | 0.15 | 11.0 | 120.01 | 1.676 | 9.658 | 5.76 | -5.64 | +2.186 | 550 | 1.84e-06 | x=9: 6.43e-01 vs 6.43e-01; x=8: 4.17e-01 vs 4.17e-01; x=7: 2.18e-01 vs 2.18e-01; x=6: 8.94e-02 vs 8.94e-02 |
| LIO | 0.2 | 11.0 | 120.87 | 1.659 | 9.276 | 5.59 | -4.57 | +1.414 | 185 | 6.19e-07 | x=9: 6.46e-01 vs 6.45e-01; x=8: 4.16e-01 vs 4.17e-01; x=7: 2.15e-01 vs 2.16e-01; x=6: 8.77e-02 vs 8.74e-02 |
| LIO | 0.15 | 11.0 | 120.01 | 1.676 | 9.366 | 5.59 | -4.57 | +1.491 | 246 | 8.23e-07 | x=9: 6.44e-01 vs 6.43e-01; x=8: 4.16e-01 vs 4.17e-01; x=7: 2.17e-01 vs 2.18e-01; x=6: 8.97e-02 vs 8.94e-02 |
| DEL | 0.2 | 11.0 | 104.91 | 1.486 | 7.451 | 5.01 | -5.23 | -0.028 | 0 | 0.00e+00 |  |
| DEL | 0.15 | 11.0 | 103.98 | 1.498 | 7.522 | 5.02 | -5.26 | +0.036 | 1 | 3.34e-09 |  |
| THIN | 0.2 | 11.0 | 120.87 | 1.659 | 8.624 | 5.20 | -5.50 | +1.116 | 88 | 2.94e-07 | x=9: 6.45e-01 vs 6.45e-01; x=8: 4.16e-01 vs 4.17e-01; x=7: 2.15e-01 vs 2.16e-01; x=6: 8.78e-02 vs 8.74e-02 |
| THIN | 0.15 | 11.0 | 120.01 | 1.676 | 8.718 | 5.20 | -5.50 | +1.176 | 126 | 4.21e-07 | x=9: 6.43e-01 vs 6.43e-01; x=8: 4.17e-01 vs 4.17e-01; x=7: 2.17e-01 vs 2.18e-01; x=6: 8.98e-02 vs 8.94e-02 |
| TNR | 0.2 | 11.0 | 172.55 | 17.340 | 51.364 | 2.96 | -3.10 | +42.118 | 69815330 | 2.33e-01 |  |
| TNR | 0.15 | 11.0 | 171.70 | 17.181 | 51.360 | 2.99 | -3.13 | +42.057 | 67282069 | 2.25e-01 |  |
| EA | 0.2 | 11.0 | 341.93 | 4.343 | 19.138 | 4.41 | -5.21 | +2.018 | 2336 | 7.81e-06 |  |
| EA | 0.15 | 11.0 | 338.62 | 4.368 | 19.200 | 4.40 | -5.21 | +2.171 | 2713 | 9.07e-06 |  |

#### Run E2: Haar-flow reference for E [c1n_E2.json]  N = 6e+04 (6148 terms), heights 2.990e+08 on the lattice 1e+06 + k*1, mode haarflow
| family | delta | 2a | torus sup | sd | max LHS | max LHS / sd | min LHS / sd | max (LHS - thr) | count LHS > thr | rate | rate above thr - x, orbit vs Haar flow |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ZETA | 0.2 | 11.0 | 120.87 | 1.659 | 9.516 | 5.74 | -5.91 | +2.288 | 442 | 1.48e-06 |  |
| ZETA | 0.15 | 11.0 | 120.01 | 1.676 | 9.565 | 5.71 | -5.89 | +2.413 | 541 | 1.81e-06 |  |

RECHECKED (largest values of LHS - threshold per column, re-evaluated with 40-digit arithmetic, or for more than 3e5 terms with exact 128-bit phases and float64 summation): run A: 42 extremes, max difference 4.1e-08 (40-digit); run B: 14 extremes, max difference 1.7e-08 (40-digit); run F: 21 extremes, max difference 8.8e-08 (exact phases + float64 sum); run C: 6 extremes, max difference 4.0e-08 (40-digit); run C2: 6 extremes, max difference 4.0e-08 (exact phases + float64 sum); run E: 18 extremes, max difference 5.1e-08 (40-digit).

Reading (MEASURED unless marked):

- Run A (N = 6420, the detection support of offset 3/8 at 3e12; 1e10 heights). No family with bounded coefficients reaches the threshold: the largest LHS - beta is -6.31 (zeta), -7.15 (chi), -6.18 and -5.66 (SGN), -6.30 and -5.87 (UNI), -6.58 (DEL), -9.21 (E_a, against 2 beta). The largest LHS is 6.14 sd for zeta, 6.55 to 6.59 for chi, 6.65 to 6.71 for SGN, 6.47 to 6.57 for UNI, 6.54 to 6.60 for the Haar flow (2e9 heights); the rates above "threshold - 8" are 3.23e-7 (zeta), 3.31e-7 (SGN), 3.18e-7 (UNI), 3.33e-7 (Haar flow), equal within counting error; the lower extremes are -6.1 to -6.5 sd for all. The realised supremum is 0.19 to 0.21 of the torus supremum (40.85) for zeta and for the twists alike. Only T-NR exceeds (1.07e-2 of the heights: its coefficients at powers of 3 grow like 3^(0.404 k)).
- Run C (full coefficients, 1e9 heights). DH exceeds at N = 6420 at a rate 7.2e-5 with extremes of 17 sd (|Lambda_DH(n)| n^(-1/2) reaches 2.5; the coefficients grow because DH has zeros to the right of 1), and at N = 1.18e6 at a rate 1.0e-2. The heat coefficients never exceed: their torus supremum at N = 6420 is 8.33, below beta = 13.5, and at N = 1.18e6 the largest value is 6.1.
- Run B (N = 1.18e6, the detection support of offset 0.2; 2e9 heights). Largest LHS: zeta 5.34 to 5.40 sd, chi 5.41, SGN 6.08 to 6.16, UNI 5.99 to 6.03, Haar flow 6.73 to 6.86; lower extremes -5.9 to -6.3 sd for all. Zeta's upper tail is shorter than the Haar tail by about one sd, but no twist reaches the threshold in 2e9 heights (closest: SGN -1.13; the Haar flow has one exceedance, +0.40). E_a exceeds (6.6e-7 and 1.0e-6 of the heights).
- Run F (N = 1e8, 5,762,859 prime powers, the detection support of offset 0.137 at 3e12; 4e9 heights between 3e12 and 1e14, all above the verified height). Zeta: no exceedance, largest LHS - beta = -2.07, -1.94, -1.84 for the three weights; largest LHS 4.54 to 4.57 sd against a lower extreme of -6.04 to -6.10 sd. L(chi): no exceedance (-2.28 to -2.53; 4.72 sd against -6.12). SGN: 411, 585, 795 exceedances (rates 1.0e-7 to 2.0e-7), largest LHS 6.35 to 6.47 sd. UNI: 426, 632, 825. Haar flow (1e9 heights): 95, 155, 220 (rates 0.95e-7 to 2.2e-7, the rates of the twists). DEL: no exceedance (-1.21, -1.03, -0.85; 5.14 sd). E_a: 4.2e-3 of the heights; T-NR: 0.46. Tail rates of zeta against the Haar flow (first weight): 2.11e-2 against 2.07e-2 above "threshold - 9", 8.56e-3 against 8.37e-3 above "threshold - 8", 3.03e-3 against 3.03e-3 above "threshold - 7", 8.4e-4 against 9.8e-4 above "threshold - 6", and nothing above -2.07: the mass missing from the top of the distribution sits just below it. The twists have the Haar rates at every level.
- Run E (heights 1e6 to 3e8, all integers; N = 6e4, the detection support of offset 0.2 at 5e5; the range where the zeros are known to be on the line). Zeta: no exceedance in 2.99e8 heights, largest LHS - beta = -0.85 and -0.82 (4.3 sd against -5.3 sd below). L(chi): none (-1.17, -1.14). SGN: 447 and 539 (1.5e-6, 1.8e-6); UNI: 444 and 550; Haar flow: 442 and 541; LIO: 185 and 246 (its lower tail is the truncated one: -4.57 sd); THIN: 88 and 126; DEL: 0 and 1 (largest values -0.03 and +0.04); E_a: 2336 and 2713; T-NR: 0.23 of the heights. This reproduces the source's phase test A (largest value -0.73 on 1e5 random heights in [4e5, 6e5]; here -0.80 on the 2e5 integers of that interval, local run) and adds the controls.
- Answer to the rotation question of round 1. Along the realised orbit zeta's supremum is smaller than the Haar supremum by a margin the twists do not have exactly when the support reaches the detection support: 6.14 sd against 6.5 to 6.7 at N = 6420 (within the scatter of extremes: the tail rates are equal), 5.4 against 6.0 to 6.9 at N = 1.18e6, 4.6 against 6.1 to 6.5 at N = 1e8; in run E 4.3 against 5.7 to 6.0. The lower extremes show no such difference at any support. The same holds for L(chi).
- Lemma MP3 and the finite-window floor (the other two nodes) give bounds that depend on the torus function only; by Lemma R of lane s1 such bounds are the same for zeta and for every twist, and the measured torus supremum (40.85 to 4260) is 3 to 300 times the threshold at every support.

- Scale of the statistic (variance bound PROVED, elementary; the Gaussian rate is a model, checked by the Haar-flow runs). |w| <= 1 and the Haar variance is sigma^2 = (1/2) sum Lambda(n)^2 w(log n)^2 / n <= (1/2) int_0^{2a} v dv = a^2. For fixed delta the weight decays like e^{-delta v}, so sigma stays bounded as the support grows (about 1/(2 sqrt 2 delta) from the positive lobe, plus the negative lobe: measured 1.27, 2.09, 2.79 at the detection supports of delta = 3/8, 0.2, 0.137) while beta(H) = (1/2) log(H / 2 pi) grows. Under Haar the exceedance probability per height is about exp(-beta^2 / (2 sigma^2)); the expected number of exceedances among the roughly H independent heights below H is H exp(-(log H)^2 / (8 sigma^2)), which decreases once log H > 8 sigma^2 (H > 4e5 for delta = 3/8; H above about e^100 for delta = 0.1). So at the detection support of delta = 3/8 the torus gap (40.85 against 13.5, the factor 3.03 of the node) is carried by a set of Haar measure about 1e-26: neither zeta nor any twist comes near the threshold in 1e10 heights, and the test cannot separate them there. A separation at heights above 3e12 needs sigma of order beta / 5, that is delta <= 0.14 and N >= 1e8: run F.
- Why this is verified height in another form (CLASSICAL plus the source's Lemma 2 and Proposition 6). LHS_F(H) <= beta_F(H) is W(f) >= 0, and W(f) = sum over zeros of |F(gamma)|^2 for the zeros on the line plus -2 m^2 (1 + o(1)) for each off-line pair within the resolution of f. Below the detection support the term of an isolated off-line pair cannot dominate (Lemma 2, continuous model), so the inequality does not see such a pair; at and above it, in the source's continuous model, a pass at height H is equivalent to "no off-line pair of offset >= delta within the window of f at H". The runs make no rigorous statement about zeros: they use the ideal support, not the rigorous one (a_rig of the source is 2 to 3 times larger), and they sample heights. Each sampled height is a zero-free statement for one window, obtained with N = (c log H)^(1/delta) prime powers (1e8 for delta = 0.137 at 3e12) where the Riemann-Siegel formula uses 7e5 terms.
- Why the twists fail there (Lemma R of lane s1, PROVED there; rates MEASURED). A twist has the same torus function translated; its orbit is a Haar-typical line; the threshold beta is zeta's archimedean term, and a twist has no functional equation that would force W >= 0. Its exceedance rate equals the Haar-flow rate (1.0e-7 to 2.1e-7 against 0.95e-7 to 2.2e-7 in run F; 1.5e-6 to 1.8e-6 against the same in run E). The failure does not depend on zeros, and it occurs exactly at the supports where the Haar rate is visible in the sample, which are the supports at or above the detection support for the offsets in question.
- Classification: **not a survivor**. (i) Below the detection support: no separation from the twists at any sample size reached; only coefficient size separates (T-NR through its non-tempered factor at 3, DH through coefficient growth caused by zeros to the right of 1; E_a does not exceed at N = 6420). (ii) At the detection support: zeta and L(chi) pass and SGN, UNI (and LIO, THIN in run E) fail, at heights above the verified height in run F; but the pass of zeta at a height is the local zero-free statement that the test was built to detect (the size at which the twists fail is the size at which the test resolves an off-line pair), DEL fails once in 3e8 heights and not at all above 3e12, and the heat coefficients never fail. What run F measures is that 4e9 sampled windows between 3e12 and 1e14 show the one-sided truncation that Weil non-negativity predicts.

### 2.2 Combination 2: realised infimum against torus infimum of the barrier function

Nodes: `bohr-torus-scan-certification`, `fejer-riesz-branch-reduction`, `p47-late-cell-floors`. Sources: `src/data/barrier-mollifier-length-ceiling-2026-09.js` (read as text), `tmp/torus_floor_scan.py`, `src/data/route-4-fejer-riesz-wol-2026-10-07.js`, `src/data/route-1-finish-route-p-2026-10-06.js`.

Object. G(theta) = |B(theta)| - gamma |A(theta)| on the torus of the 55,874 prime phases below N = 690988, with B = sum_{n<=N} w_n e^{-i theta.v(n)}, A = sum w_n n^y e^{-i theta.v(n)}, w_n = exp((t/4) log^2 n - sigma log n), on the six recorded rows of the line t + y^2/2 = 0.145. Torus infimum: the recorded L-BFGS values (two rows recomputed here, equal). Scope note: the per-prime fibre function g_q of route 4 (the |sin k theta| terms, k <= 7) and the P47 cell ledger (cells 417-424) were not rebuilt; they are bounds for suprema of pieces of this same kind of torus function, and the question asked of them (does the realised orbit stay away from the torus extremum by a margin a control lacks) is asked here of the full function G, which is the object of the first node.

Finite consequence tested: inf of G over realised heights minus inf over the torus is positive for the true primes and not for the controls. Realised phases theta_p = (x/2) log p for x on a grid of step 0.1294 covering whole windows of length 8.68e6 (6.7e7 points per window, a NUFFT in x); 16 consecutive windows from x = 4 pi N^2 = 6.0000e12 (1.07e9 heights, the length of 8 cells of the Riemann-Siegel index), 32 windows near 6.14e12 (2.1e9 heights); the third run repeats the 16 windows from 6.0000e12 against new controls (48 distinct windows, 3.2e9 heights). Controls, same flow and window length: Haar base phases (56 windows), sign twist of the true base (20), Beurling-type set p -> p + U(-1/2, 1/2) with Haar base (20); L(chi mod 5) (true base rotated by arg chi(p), multiples of 5 removed; 16 windows) against its own Haar flow (16).

First run (true windows start at x = 4 pi N^2), `c2_main.json`:

windows of 67108864 grid points, dx=0.1294, length 8.684e+06; N=690988
| y | t | gamma | torus inf (scan) | kind | windows | realised inf (min over windows) | mean of window minima | sd | realised - torus | frac G<0 | q(1e-6) | q(1e-3) | mean G |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0.08 | 0.1418 | 0.3416 | +0.2812 | true | 16 | +0.3263 | +0.3285 | 0.0010 | +0.0451 | 0.0e+00 | +0.3325 | +0.3625 | +0.6891 |
| 0.08 | 0.1418 | 0.3416 | +0.2812 | haar | 8 | +0.3284 | +0.3295 | 0.0007 | +0.0472 | 0.0e+00 | +0.3325 | +0.3625 | +0.6891 |
| 0.08 | 0.1418 | 0.3416 | +0.2812 | sgn | 4 | +0.3288 | +0.3296 | 0.0009 | +0.0476 | 0.0e+00 | +0.3325 | +0.3625 | +0.6891 |
| 0.08 | 0.1418 | 0.3416 | +0.2812 | beurling | 4 | +0.3293 | +0.3297 | 0.0004 | +0.0481 | 0.0e+00 | +0.3325 | +0.3625 | +0.6891 |
| 0.1 | 0.14 | 0.2612 | +0.3092 | true | 16 | +0.3636 | +0.3662 | 0.0012 | +0.0544 | 0.0e+00 | +0.3725 | +0.4025 | +0.7739 |
| 0.1 | 0.14 | 0.2612 | +0.3092 | haar | 8 | +0.3661 | +0.3673 | 0.0007 | +0.0569 | 0.0e+00 | +0.3725 | +0.4025 | +0.7739 |
| 0.1 | 0.14 | 0.2612 | +0.3092 | sgn | 4 | +0.3666 | +0.3674 | 0.0010 | +0.0574 | 0.0e+00 | +0.3725 | +0.4025 | +0.7739 |
| 0.1 | 0.14 | 0.2612 | +0.3092 | beurling | 4 | +0.3671 | +0.3676 | 0.0005 | +0.0579 | 0.0e+00 | +0.3725 | +0.4025 | +0.7739 |
| 0.12 | 0.1378 | 0.1997 | +0.0348 | true | 16 | +0.3905 | +0.3934 | 0.0013 | +0.3557 | 0.0e+00 | +0.4025 | +0.4325 | +0.8390 |
| 0.12 | 0.1378 | 0.1997 | +0.0348 | haar | 8 | +0.3934 | +0.3947 | 0.0008 | +0.3586 | 0.0e+00 | +0.4025 | +0.4325 | +0.8390 |
| 0.12 | 0.1378 | 0.1997 | +0.0348 | sgn | 4 | +0.3938 | +0.3947 | 0.0011 | +0.3590 | 0.0e+00 | +0.4025 | +0.4325 | +0.8390 |
| 0.12 | 0.1378 | 0.1997 | +0.0348 | beurling | 4 | +0.3944 | +0.3949 | 0.0005 | +0.3596 | 0.0e+00 | +0.4025 | +0.4325 | +0.8390 |
| 0.14 | 0.1352 | 0.1526 | -0.0288 | true | 16 | +0.4092 | +0.4123 | 0.0014 | +0.4380 | 0.0e+00 | +0.4225 | +0.4575 | +0.8892 |
| 0.14 | 0.1352 | 0.1526 | -0.0288 | haar | 8 | +0.4123 | +0.4137 | 0.0009 | +0.4411 | 0.0e+00 | +0.4225 | +0.4575 | +0.8892 |
| 0.14 | 0.1352 | 0.1526 | -0.0288 | sgn | 4 | +0.4128 | +0.4136 | 0.0012 | +0.4416 | 0.0e+00 | +0.4225 | +0.4575 | +0.8892 |
| 0.14 | 0.1352 | 0.1526 | -0.0288 | beurling | 4 | +0.4134 | +0.4140 | 0.0006 | +0.4422 | 0.0e+00 | +0.4225 | +0.4575 | +0.8892 |
| 0.16 | 0.1322 | 0.1167 | -0.0647 | true | 16 | +0.4213 | +0.4246 | 0.0015 | +0.4860 | 0.0e+00 | +0.4325 | +0.4725 | +0.9281 |
| 0.16 | 0.1322 | 0.1167 | -0.0647 | haar | 8 | +0.4247 | +0.4262 | 0.0009 | +0.4894 | 0.0e+00 | +0.4325 | +0.4725 | +0.9281 |
| 0.16 | 0.1322 | 0.1167 | -0.0647 | sgn | 4 | +0.4252 | +0.4260 | 0.0013 | +0.4899 | 0.0e+00 | +0.4325 | +0.4725 | +0.9281 |
| 0.16 | 0.1322 | 0.1167 | -0.0647 | beurling | 4 | +0.4257 | +0.4265 | 0.0006 | +0.4904 | 0.0e+00 | +0.4325 | +0.4725 | +0.9281 |
| 0.25 | 0.11375 | 0.0349 | -0.5170 | true | 16 | +0.4219 | +0.4264 | 0.0020 | +0.9389 | 0.0e+00 | +0.4375 | +0.4825 | +1.0230 |
| 0.25 | 0.11375 | 0.0349 | -0.5170 | haar | 8 | +0.4269 | +0.4285 | 0.0013 | +0.9439 | 0.0e+00 | +0.4375 | +0.4825 | +1.0230 |
| 0.25 | 0.11375 | 0.0349 | -0.5170 | sgn | 4 | +0.4261 | +0.4276 | 0.0020 | +0.9431 | 0.0e+00 | +0.4375 | +0.4825 | +1.0230 |
| 0.25 | 0.11375 | 0.0349 | -0.5170 | beurling | 4 | +0.4277 | +0.4288 | 0.0009 | +0.9447 | 0.0e+00 | +0.4375 | +0.4825 | +1.0230 |

z-scores of the mean window minimum, true orbit against each control (Welch):
y=0.08: haar -2.82, sgn -2.12, beurling -3.75; total variation distance of the G histograms (true vs haar) = 2.61e-04
y=0.1: haar -2.87, sgn -2.07, beurling -3.74; total variation distance of the G histograms (true vs haar) = 2.74e-04
y=0.12: haar -2.94, sgn -2.01, beurling -3.71; total variation distance of the G histograms (true vs haar) = 2.82e-04
y=0.14: haar -2.99, sgn -1.93, beurling -3.69; total variation distance of the G histograms (true vs haar) = 3.05e-04
y=0.16: haar -3.04, sgn -1.83, beurling -3.71; total variation distance of the G histograms (true vs haar) = 3.06e-04
y=0.25: haar -3.18, sgn -1.04, beurling -3.62; total variation distance of the G histograms (true vs haar) = 3.63e-04

Second run (true windows near x = 6.14e12; new seed), `c2_more.json`:

windows of 67108864 grid points, dx=0.1294, length 8.684e+06; N=690988
| y | t | gamma | torus inf (scan) | kind | windows | realised inf (min over windows) | mean of window minima | sd | realised - torus | frac G<0 | q(1e-6) | q(1e-3) | mean G |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0.1 | 0.14 | 0.2612 | +0.3092 | true | 32 | +0.3617 | +0.3663 | 0.0016 | +0.0525 | 0.0e+00 | +0.3725 | +0.4025 | +0.7739 |
| 0.1 | 0.14 | 0.2612 | +0.3092 | haar | 32 | +0.3613 | +0.3658 | 0.0018 | +0.0521 | 0.0e+00 | +0.3725 | +0.4025 | +0.7739 |
| 0.1 | 0.14 | 0.2612 | +0.3092 | sgn | 16 | +0.3637 | +0.3664 | 0.0014 | +0.0545 | 0.0e+00 | +0.3725 | +0.4025 | +0.7739 |
| 0.1 | 0.14 | 0.2612 | +0.3092 | beurling | 16 | +0.3629 | +0.3658 | 0.0017 | +0.0537 | 0.0e+00 | +0.3725 | +0.4025 | +0.7739 |
| 0.14 | 0.1352 | 0.1526 | -0.0288 | true | 32 | +0.4069 | +0.4124 | 0.0019 | +0.4357 | 0.0e+00 | +0.4225 | +0.4575 | +0.8892 |
| 0.14 | 0.1352 | 0.1526 | -0.0288 | haar | 32 | +0.4064 | +0.4118 | 0.0021 | +0.4352 | 0.0e+00 | +0.4225 | +0.4575 | +0.8892 |
| 0.14 | 0.1352 | 0.1526 | -0.0288 | sgn | 16 | +0.4094 | +0.4125 | 0.0016 | +0.4382 | 0.0e+00 | +0.4225 | +0.4575 | +0.8892 |
| 0.14 | 0.1352 | 0.1526 | -0.0288 | beurling | 16 | +0.4082 | +0.4118 | 0.0019 | +0.4370 | 0.0e+00 | +0.4225 | +0.4575 | +0.8892 |
| 0.25 | 0.11375 | 0.0349 | -0.5170 | true | 32 | +0.4190 | +0.4265 | 0.0027 | +0.9360 | 0.0e+00 | +0.4375 | +0.4825 | +1.0230 |
| 0.25 | 0.11375 | 0.0349 | -0.5170 | haar | 32 | +0.4184 | +0.4257 | 0.0031 | +0.9354 | 0.0e+00 | +0.4375 | +0.4825 | +1.0230 |
| 0.25 | 0.11375 | 0.0349 | -0.5170 | sgn | 16 | +0.4228 | +0.4264 | 0.0020 | +0.9398 | 0.0e+00 | +0.4375 | +0.4825 | +1.0230 |
| 0.25 | 0.11375 | 0.0349 | -0.5170 | beurling | 16 | +0.4198 | +0.4254 | 0.0026 | +0.9368 | 0.0e+00 | +0.4375 | +0.4825 | +1.0230 |

z-scores of the mean window minimum, true orbit against each control (Welch):
y=0.1: haar +1.11, sgn -0.39, beurling +0.85; total variation distance of the G histograms (true vs haar) = 1.81e-04
y=0.14: haar +1.11, sgn -0.31, beurling +0.96; total variation distance of the G histograms (true vs haar) = 1.72e-04
y=0.25: haar +1.03, sgn +0.14, beurling +1.28; total variation distance of the G histograms (true vs haar) = 2.11e-04

Third run (L(chi mod 5) against its own Haar flow; zeta rows repeated with a new seed), `c2_chi.json`:

windows of 67108864 grid points, dx=0.1294, length 8.684e+06; N=690988
| y | t | gamma | torus inf (scan) | kind | windows | realised inf (min over windows) | mean of window minima | sd | realised - torus | frac G<0 | q(1e-6) | q(1e-3) | mean G |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 0.1 | 0.14 | 0.2612 | +0.3092 | true | 16 | +0.3636 | +0.3662 | 0.0012 | +0.0544 | 0.0e+00 | +0.3725 | +0.4025 | +0.7739 |
| 0.1 | 0.14 | 0.2612 | +0.3092 | haar | 16 | +0.3625 | +0.3659 | 0.0016 | +0.0533 | 0.0e+00 | +0.3725 | +0.4025 | +0.7739 |
| 0.1 | 0.14 | 0.2612 | +0.3092 | chi | 16 | +0.3895 | +0.3934 | 0.0015 | +0.0803 | 0.0e+00 | +0.4025 | +0.4275 | +0.7722 |
| 0.1 | 0.14 | 0.2612 | +0.3092 | chihaar | 16 | +0.3887 | +0.3937 | 0.0018 | +0.0795 | 0.0e+00 | +0.4025 | +0.4275 | +0.7722 |
| 0.14 | 0.1352 | 0.1526 | -0.0288 | true | 16 | +0.4092 | +0.4123 | 0.0014 | +0.4380 | 0.0e+00 | +0.4225 | +0.4575 | +0.8892 |
| 0.14 | 0.1352 | 0.1526 | -0.0288 | haar | 16 | +0.4078 | +0.4120 | 0.0019 | +0.4366 | 0.0e+00 | +0.4225 | +0.4575 | +0.8892 |
| 0.14 | 0.1352 | 0.1526 | -0.0288 | chi | 16 | +0.4391 | +0.4439 | 0.0018 | +0.4679 | 0.0e+00 | +0.4525 | +0.4825 | +0.8871 |
| 0.14 | 0.1352 | 0.1526 | -0.0288 | chihaar | 16 | +0.4382 | +0.4442 | 0.0022 | +0.4670 | 0.0e+00 | +0.4525 | +0.4825 | +0.8871 |
| 0.25 | 0.11375 | 0.0349 | -0.5170 | true | 16 | +0.4219 | +0.4264 | 0.0020 | +0.9389 | 0.0e+00 | +0.4375 | +0.4825 | +1.0230 |
| 0.25 | 0.11375 | 0.0349 | -0.5170 | haar | 16 | +0.4196 | +0.4259 | 0.0025 | +0.9366 | 0.0e+00 | +0.4375 | +0.4825 | +1.0230 |
| 0.25 | 0.11375 | 0.0349 | -0.5170 | chi | 16 | +0.4573 | +0.4640 | 0.0026 | +0.9743 | 0.0e+00 | +0.4775 | +0.5175 | +1.0197 |
| 0.25 | 0.11375 | 0.0349 | -0.5170 | chihaar | 16 | +0.4555 | +0.4641 | 0.0032 | +0.9725 | 0.0e+00 | +0.4775 | +0.5175 | +1.0197 |

z-scores of the mean window minimum, true orbit against each control (Welch):
y=0.1: haar +0.58, chi -56.32, chihaar -50.44, chi vs its own Haar flow -0.49; total variation distance of the G histograms (true vs haar) = 2.37e-04
y=0.14: haar +0.59, chi -54.67, chihaar -48.30, chi vs its own Haar flow -0.45; total variation distance of the G histograms (true vs haar) = 2.49e-04
y=0.25: haar +0.59, chi -46.06, chihaar -39.70, chi vs its own Haar flow -0.12; total variation distance of the G histograms (true vs haar) = 2.99e-04

(In the third table the z-scores "chi" and "chihaar" against the zeta orbit compare two different torus functions and are not used; the comparison for L(chi) is the entry "chi vs its own Haar flow".)

Reading:

- MEASURED. The realised infimum over 1e9 to 2e9 heights is 0.326 to 0.43 on every row, for every orbit type. On the rows y <= 0.10 it is 0.045 to 0.058 above the torus infimum; on the row y = 0.12 it is 0.36 above; on the rows y >= 0.14, where the torus infimum is negative (the recorded obstruction), it is 0.44 to 0.94 above it. G was negative at no sampled point of any orbit.
- MEASURED. The gap is the same for the true orbit and for the controls: mean window minima agree to 0.002; the histograms of G agree to a total variation distance of 2e-4 to 4e-4. First run (16 windows starting at x = 4 pi N^2 against 8 Haar windows): the true minima are lower by 0.0010 to 0.0021 (z = -2.8 to -3.2, the six rows are the same windows and are not independent). Second run (32 against 32 windows, x near 6.14e12, where N is not the Riemann-Siegel index of x): z = +1.0 to +1.1. Third run (16 against 16, again from x = 4 pi N^2, new Haar seed): z = +0.6. L(chi) against its own Haar flow: z = -0.1 to -0.5. A difference of the size of the first run at x = 4 pi N^2 is what the stationary terms n near N can produce (about sqrt(N) consecutive terms with aligned phases, total size w_N sqrt(N) = 9e-4; HEURISTIC), a property of the integers near sqrt(x / 4 pi), not of the primes; it is not reproduced by the third run and is counted as not established.
- PROVED (Kronecker, and Lemma R of lane s1). For rationally independent frequencies every orbit is dense, so the realised infimum over all x equals the torus infimum for the true primes and for every control; a sign twist or a character twist is a translate of the same orbit. A finite-window gap can only come from the window length, which is the same for all.
- The torus minimiser on the rows y >= 0.14 needs A large (|A| = 3.1 at y = 0.14 against a mean of about 0.4), a phase alignment of many primes; its Haar measure is below the sample size of any orbit. This is the reason for the gap, and it is rotation invariant.
- Classification: **not a survivor**. The control's realised infimum does not reach the torus infimum either; there is no margin that the true primes have and the controls lack.

### 2.3 Combination 3: S(t) from S_1 increments

Nodes: `sawtooth-s-of-t`, `sawtooth-s-of-t-lemma`, `discrepancy-bridge-constant`. Source: `src/data/route-49-unconditional-s-of-t-2026-10-06.js` (read as text).

Finite consequence tested: sup|S| / sqrt(2 A rho) <= 1 with A from the family's own S_1; fail = ratio > 1, or a drift of S_1 in windows below the first off-line height. The lead of the drift detector is measured.

**Lemma T (PROVED).** Let S have upward jumps only and derivative >= -rho between jumps, S_1' = S, and A_delta = sup over |t2 - t1| <= delta of |S_1(t2) - S_1(t1)|. Then sup S <= A_delta / delta + delta rho / 2 and inf S >= -(A_delta / delta + delta rho / 2). If no jump lies within delta after the point where the supremum is approached, the first inequality is an equality. Proof: for u in [t, t + delta], S(u) >= S(t) - rho (u - t); integrate; in the absence of a jump the bound on S(u) is an equality. The lemma uses nothing about the function except that its zero-counting function is non-decreasing. It holds for S of zeta, of L(chi), of DH and of T-NR (off-line pairs are jumps of size 2), and for the line count S_0 (zeros on the line only) of any of them.

**Lemma S (PROVED).** Let F have a functional equation with Z_F real on the line. In the Hadamard product of Z_F an off-line pair 1/2 +- d + i g contributes the factor ((t - g)^2 + d^2) / (g^2 + d^2), positive for real t. So the sign changes of Z_F, the line count N_0 and S_0 = N_0 - theta/pi - 1 are determined by the zeros on the line and the smooth part, and S = S_0 + 2 #{off-line pairs with height <= t}: an off-line pair and a double zero on the line at the same height give the same S. The drift of S_0 (Turing's criterion; the Littlewood term enters the integral of log|F| on the line, not S_1) starts at the off-line height: lead zero.

MEASURED (zeta: windows of 1e6 zeros, 4e7 grid points each, at t = 1e6, 1e8, 1e10, 1e12, 1e13; L(chi) and DH: all zeros with 1 < t < 1e6):

| object | jumps | rho | sup S | inf S | A = range of S_1 | sqrt(2 A rho) | sup abs S / sqrt(2 A rho) | ratio at delta = 1 spacing | at 4 spacings | window mean of S | notes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| ZETA T=1e+06 | 1018838 | 1.973 | +1.823 | -1.897 | 1.720 | 2.606 | 0.728 | 0.955-0.994 | 0.714-0.719 | +0.0000 | grid 4.0e+07 pts, close pairs 4, Z err vs mpmath 3.749429988708641e-09 |
| ZETA T=1e+08 | 1000113 | 2.640 | +1.956 | -1.968 | 1.754 | 3.043 | 0.647 | 0.961-1.000 | 0.698-0.703 | -0.0000 | grid 4.0e+07 pts, close pairs 8, Z err vs mpmath 1.165110660727997e-09 |
| ZETA T=1e+10 | 1000001 | 3.372 | +2.047 | -2.181 | 1.744 | 3.429 | 0.636 | 0.961-1.000 | 0.735-0.741 | +0.0000 | grid 4.0e+07 pts, close pairs 2, Z err vs mpmath 7.292402237624174e-10 |
| ZETA T=1e+12 | 1000000 | 4.105 | +2.255 | -2.392 | 1.763 | 3.805 | 0.629 | 0.962-1.000 | 0.783-0.789 | -0.0000 | grid 4.0e+07 pts, close pairs 4, Z err vs mpmath None |
| ZETA T=1e+13 | 1000000 | 4.472 | +2.318 | -2.154 | 1.735 | 3.940 | 0.588 | 0.962-1.000 | 0.744-0.749 | +0.0000 | grid 4.0e+07 pts, close pairs 14, Z err vs mpmath None |
| T-NR true S, T=1e+06 | 1110560 | 2.323 | +2.616 | -2.576 | 3.122 | 3.808 | 0.687 | 0.949-0.996 | 0.774-0.781 | +0.0000 | 91722 off-line pairs in window; line count drifts at slope -0.3497 |
| CHI | 2003295 | 2.162 | +1.836 | -1.771 | 2.898 | 3.540 | 0.519 | 0.916-1.000 | 0.671-0.681 | +0.0000 | imag part of Z 8.0e-08; L err {'L_chi_maxerr_vs_mpmath': 1.2586814044349531e-09} |
| DH true S (steps restored) | 1897090 | 2.162 | +5.878 | -6.234 | 157905.040 | 826.392 | 0.008 | 0.919-0.998 | 0.840-0.856 | -0.1579 | 106203 steps of 2 restored at gap midpoints |
| DH line count S_0 | 1790887 | 2.162 | +0.906 | -212407.483 | 100841851373.733 | 660402.027 | 0.322 | 0.917-1.000 | 0.978-1.000 | -100841.9522 | line count only; final level -212397.2 |
| DH below the first off-line height | 43 | 0.671 | +0.906 | -0.880 | 1.348 | 1.346 | 0.674 | 0.893-0.901 | 0.419-0.420 | -0.0141 | window below the first off-line height |

(The row "DH true S (steps restored)" is not used for the ratio: placing the steps of 2 at gap midpoints leaves a residual drift of the restored S, window mean -0.16; see section 4.)

- The ratio with A = range of S_1 over the whole window is 0.59 to 0.73 for zeta, 0.52 for L(chi), 0.69 for the true S of T-NR. At delta of one mean spacing the upper end of the bracket for the ratio is 0.994 to 1.000 in every row (the equality case of Lemma T; the bracket is the grid resolution of S_1): with the family's own A the inequality is sharp and carries no information; its content in the source is Trudgian's bound for A, a statement about zeta alone.
- DH: 1,790,887 zeros on the line and 106,199 off-line pairs below 1e6 (10.6 percent of the zeros are off the line). The line count S_0 falls to -212,397. Below the first off-line height (85.70) the window contains 43 zeros, S is within [-0.88, 0.91], ratio 0.67: nothing separates DH from L(chi) there.
- T-NR: Z is zeta's Z times the positive factor 2.2 + 2 cos(t log 3). The line count drifts at slope -log 3 / pi from t = 0; it exceeds sqrt(2 A rho) of zeta (2.6, the value of the window at 1e6) after t = 7.5; the first off-line pair is at 2.86. Lag, not lead.
- Lead of the drift detector for DH. Single events: the detector "median of the line count over the next 21 zeros below level - 1" fires a median of 10.3 mean spacings after the located step (5 percent quantile +0.9; 4.3 percent of the events are negative, at most -3.5, which is the size of the error of locating a step at the midpoint of the largest gap). Averaged over 13,861 isolated steps (offset in mean spacings from the gap midpoint: mean of the line count relative to its level before): -12: +0.087, -8: -0.012, -6: -0.010, -5: -0.040, -4: -0.096, -3: -0.168, -2: -0.246, 0: -0.982, +2: -1.715, +4: -1.856, +8: -1.935, +12: -2.014 (standard errors 0.004 to 0.007). The mean gap at a step is 2.53 mean spacings. So the line count is depressed by 0.1 at 4 spacings before an off-line pair and relaxes to -2 over about 5 spacings after it; the single-event standard deviation of S is about 0.5. The averaged lead is 5 mean spacings (2.3 units of t at 1e6), the single-event lead is zero.
- Backward heat: NOT RUN (no off-line zero of H_tau at a computable height is located for small |tau|; the coefficient-side family used in combinations 1 and 4 has no functional equation and no S).
- Classification: **not a survivor**. The ratio test cannot fail for any family (Lemma T). The drift is Turing's method; it reads the off-line count below t (Lemma S), with a measured lead of at most a few mean spacings, which is the hole left on the line by the two missing zeros.

### 2.4 Combination 4: prime phase resultant, pole removed

Nodes: `hyperbolic-prime-spiral`, `sunit-count-cubic`. The spiral's coherent rings at phi near 2 pi / log p are the single-prime terms of R below; the S-unit count ratio (2.49 ... 1.26) is not used by the statistic.

Statistic. R_F(phi; P) = sum_{n <= P} Lambda_F(n) n^{-1/2} (1 - log n / L) e^{-i phi log n}, L = log P (Fejer weight; prime powers included). With s = 1/2 + i phi and h(z) = (e^z - 1 - z)/z^2:

    Re R_zeta = beta(phi) + Re[L h((1 - s) L)] - sum_rho Re[L h((rho - s) L)] + O(P^{-5/2}),
    beta(phi) = (1/2) Re psi(s/2 + 1) - (1/2) log pi + (1/(4L)) Re psi'(s/2 + 1)        (CLASSICAL: contour integral of -zeta'/zeta(s+w) P^w / (w^2 L)).

A zero on the line contributes -(L/2) sinc^2((gamma - phi) L / 2) <= 0; at phi = gamma the trough is -L/2 per zero. An off-line pair of offset d at distance D contributes a term of size up to P^d / ((d^2 + D^2) L) with oscillating sign. So V := Re R - Re Pole - beta satisfies V <= 0 for all phi and P if and only if no zero is off the line (the Fejer case of Weil non-negativity), and the "bias at any phi" of the task is the term P^d / ((d^2 + D^2) L). Pole terms are subtracted for all families that have them (zeta, DEL, THIN, T-NR; the two poles of E_a); thresholds: beta of zeta, beta of chi mod 5 for CHI and DH, beta + log 3 for T-NR, 2 beta for E_a.

Finite consequence tested: V <= 0 for zeta and L(chi); for each control V > 0 at phi <= gamma_off / 4, above the size of the on-line sum there.

Run 1 (GPU, 1231 s): all primes to 1e11 (4,118,054,813 primes; the counts at the five checkpoints equal pi(1e7) ... pi(1e11); segmented sieve on 7 cores, NUFFT onto 20 grids of 5.0e7 points, kernel width 12), phi from 0 to 1e6 in steps of 0.01 (1e8 values, ten shifted transforms of the grid of step 0.1), checkpoints P = 1e7, 1e8, 1e9, 1e10, 1e11. Families whose coefficients are known at every prime: ZETA, CHI, SGN, UNI, DEL (random thin set of the same density), THIN, T-NR, E_a, and DHP (the prime-only sum with the coefficients of the DH series, a combination of the sums of chi and chi-bar). Column "max V on 1<=phi<=21.4": the window below a quarter of the first off-line height of DH.

phi grid: step 0.01, phi <= 1000000.0; V = Re R - Re Pole - beta_F
| P | family | part | points | max V | argmax phi | frac V>0 | mean V | sd | min V | max V on 1<=phi<=21.4 | V>0 there |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1e+07 | ZETA | all | 1.00e+08 | -0.0024 | 0.39 | 0.000e+00 | -5.489 | 3.240 | -22.59 | -0.0024 | 0/2040 |
| 1e+07 | CHI | all | 1.00e+08 | -0.0093 | 2.64 | 0.000e+00 | -6.294 | 3.216 | -22.97 | -0.0093 | 0/2040 |
| 1e+07 | DHP | all | 1.00e+08 | +0.8336 | 64.71 | 2.154e-04 | -6.294 | 2.334 | -17.53 | +0.8276 | 645/2040 |
| 1e+07 | SGN | all | 1.00e+08 | +11.1916 | 559111.51 | 4.510e-02 | -5.489 | 3.223 | -21.70 | +9.1892 | 991/2040 |
| 1e+07 | UNI | all | 1.00e+08 | +11.1094 | 53723.75 | 4.506e-02 | -5.489 | 3.223 | -22.90 | +7.8256 | 976/2040 |
| 1e+07 | EA | all | 1.00e+08 | +5.4258 | 990650.08 | 1.065e-01 | -10.978 | 8.476 | -54.32 | +1.9422 | 903/2040 |
| 1e+07 | DEL | all | 1.00e+08 | +24.7445 | 0.28 | 1.461e-02 | -5.489 | 2.825 | -49.94 | +3.9224 | 1009/2040 |
| 1e+07 | THIN | all | 1.00e+08 | +49.8057 | 0.28 | 4.475e-02 | -5.489 | 3.243 | -99.04 | +7.5698 | 1032/2040 |
| 1e+07 | TNR | all | 1.00e+08 | +181.1095 | 20.27 | 3.733e-01 | -6.587 | 60.351 | -274.92 | +181.1095 | 1004/2040 |
| 1e+08 | ZETA | all | 1.00e+08 | -0.0019 | 0.17 | 0.000e+00 | -5.489 | 3.680 | -25.09 | -0.0019 | 0/2040 |
| 1e+08 | CHI | all | 1.00e+08 | -0.0073 | 0.33 | 0.000e+00 | -6.294 | 3.678 | -25.42 | -0.0074 | 0/2040 |
| 1e+08 | DHP | all | 1.00e+08 | +0.9589 | 137151.06 | 8.596e-04 | -6.294 | 2.676 | -18.96 | +0.7189 | 711/2040 |
| 1e+08 | SGN | all | 1.00e+08 | +14.4309 | 586496.17 | 6.933e-02 | -5.489 | 3.696 | -24.82 | +10.5871 | 971/2040 |
| 1e+08 | UNI | all | 1.00e+08 | +13.4882 | 27726.96 | 6.924e-02 | -5.489 | 3.696 | -24.93 | +9.6188 | 975/2040 |
| 1e+08 | EA | all | 1.00e+08 | +8.1531 | 940068.46 | 1.806e-01 | -10.978 | 10.338 | -63.26 | +2.9493 | 886/2040 |
| 1e+08 | DEL | all | 1.00e+08 | +45.3071 | 0.24 | 2.807e-02 | -5.489 | 3.271 | -80.59 | +5.2736 | 1014/2040 |
| 1e+08 | THIN | all | 1.00e+08 | +91.0584 | 0.24 | 6.756e-02 | -5.489 | 3.686 | -160.29 | +10.4952 | 1033/2040 |
| 1e+08 | TNR | all | 1.00e+08 | +435.5432 | 597.44 | 4.565e-01 | -6.587 | 133.569 | -585.45 | +435.4911 | 1015/2040 |
| 1e+09 | ZETA | all | 1.00e+08 | -0.0016 | 0.15 | 0.000e+00 | -5.489 | 4.099 | -27.55 | -0.0016 | 0/2040 |
| 1e+09 | CHI | all | 1.00e+08 | -0.0076 | 0.11 | 0.000e+00 | -6.294 | 4.125 | -27.91 | -0.0078 | 0/2040 |
| 1e+09 | DHP | all | 1.00e+08 | +1.0847 | 4748.44 | 2.455e-03 | -6.294 | 3.005 | -20.98 | +0.6720 | 759/2040 |
| 1e+09 | SGN | all | 1.00e+08 | +17.6181 | 586496.17 | 9.435e-02 | -5.489 | 4.170 | -28.44 | +11.8440 | 941/2040 |
| 1e+09 | UNI | all | 1.00e+08 | +16.3360 | 27726.95 | 9.431e-02 | -5.489 | 4.170 | -27.19 | +11.3496 | 965/2040 |
| 1e+09 | EA | all | 1.00e+08 | +12.3558 | 982875.05 | 2.507e-01 | -10.978 | 12.424 | -73.47 | +4.3140 | 923/2040 |
| 1e+09 | DEL | all | 1.00e+08 | +80.9501 | 0.21 | 4.387e-02 | -5.489 | 3.698 | -130.23 | +7.8534 | 997/2040 |
| 1e+09 | THIN | all | 1.00e+08 | +162.4457 | 0.21 | 9.000e-02 | -5.489 | 4.110 | -259.55 | +15.4701 | 1014/2040 |
| 1e+09 | TNR | all | 1.00e+08 | +1034.8813 | 8.39 | 4.831e-01 | -6.587 | 300.435 | -1286.82 | +1034.8813 | 1014/2040 |
| 1e+10 | ZETA | all | 1.00e+08 | -0.0017 | 5.14 | 0.000e+00 | -5.489 | 4.497 | -29.59 | -0.0017 | 0/2040 |
| 1e+10 | CHI | all | 1.00e+08 | -0.0059 | 0.48 | 0.000e+00 | -6.294 | 4.552 | -30.19 | -0.0059 | 0/2040 |
| 1e+10 | DHP | all | 1.00e+08 | +1.3152 | 5985.98 | 5.352e-03 | -6.294 | 3.320 | -23.20 | +0.8520 | 823/2040 |
| 1e+10 | SGN | all | 1.00e+08 | +19.3966 | 586496.16 | 1.187e-01 | -5.489 | 4.643 | -31.37 | +13.2727 | 929/2040 |
| 1e+10 | UNI | all | 1.00e+08 | +20.3105 | 822460.64 | 1.187e-01 | -5.489 | 4.643 | -29.30 | +13.2377 | 954/2040 |
| 1e+10 | EA | all | 1.00e+08 | +17.8949 | 300364.79 | 3.064e-01 | -10.978 | 14.785 | -82.17 | +6.2632 | 939/2040 |
| 1e+10 | DEL | all | 1.00e+08 | +142.7849 | 0.18 | 6.038e-02 | -5.489 | 4.105 | -211.16 | +12.0373 | 994/2040 |
| 1e+10 | THIN | all | 1.00e+08 | +286.2161 | 0.18 | 1.111e-01 | -5.489 | 4.514 | -421.39 | +23.6940 | 1034/2040 |
| 1e+10 | TNR | all | 1.00e+08 | +2443.9875 | 19.85 | 4.933e-01 | -6.587 | 683.831 | -2889.39 | +2443.9875 | 1020/2040 |
| 1e+11 | ZETA | all | 1.00e+08 | -0.0016 | 2.71 | 0.000e+00 | -5.489 | 4.875 | -31.49 | -0.0016 | 0/2040 |
| 1e+11 | CHI | all | 1.00e+08 | -0.0056 | 3.22 | 0.000e+00 | -6.294 | 4.959 | -31.96 | -0.0056 | 0/2040 |
| 1e+11 | DHP | all | 1.00e+08 | +1.7797 | 5985.98 | 9.584e-03 | -6.294 | 3.621 | -25.31 | +0.9504 | 864/2040 |
| 1e+11 | SGN | all | 1.00e+08 | +22.1878 | 99881.78 | 1.417e-01 | -5.489 | 5.117 | -33.16 | +13.8800 | 945/2040 |
| 1e+11 | UNI | all | 1.00e+08 | +23.9143 | 822460.63 | 1.417e-01 | -5.489 | 5.117 | -31.71 | +14.7519 | 998/2040 |
| 1e+11 | EA | all | 1.00e+08 | +25.0866 | 800857.31 | 3.483e-01 | -10.978 | 17.493 | -91.89 | +8.8598 | 936/2040 |
| 1e+11 | DEL | all | 1.00e+08 | +248.3869 | 0.16 | 7.676e-02 | -5.489 | 4.494 | -343.64 | +16.5960 | 988/2040 |
| 1e+11 | THIN | all | 1.00e+08 | +497.4887 | 0.16 | 1.305e-01 | -5.489 | 4.900 | -686.32 | +32.9870 | 1017/2040 |
| 1e+11 | TNR | all | 1.00e+08 | +5814.2790 | 4446.53 | 4.968e-01 | -6.587 | 1571.681 | -6644.36 | +5814.2293 | 1016/2040 |

Run 2 (CPU): DH with its full log-derivative coefficients Lambda_DH(n), all n <= 1e8, phi in [0, 400] in steps of 0.01, against the predicted contribution of the eight off-line pairs below 367.

| P | max V | at phi | fraction of [0.5, 347] with V > 0 | largest distance of a violation from the nearest off-line zero | max of V minus the off-line prediction | max V on phi <= 21.4 | off-line term on phi <= 21.4 (measured / predicted from the first pair) |
|---|---|---|---|---|---|---|---|
| 1e4 | 7.47 | 240.91 | 0.018 | 2.6 | -0.017 | -0.016 | 0.0005 / 0.0005 |
| 1e5 | 20.28 | 240.79 | 0.025 | 5.9 | -0.009 | -0.010 | 0.0007 / 0.0007 |
| 1e6 | 49.59 | 240.09 | 0.033 | 8.2 | -0.011 | -0.010 | 0.0015 / 0.0012 |
| 1e7 | 115.58 | 240.66 | 0.050 | 20.7 | -0.004 | -0.004 | 0.0025 / 0.0022 |
| 3e7 | 171.16 | 240.64 | 0.056 | 18.6 | -0.008 | -0.007 | 0.0033 / 0.0028 |
| 1e8 | 261.45 | 240.62 | 0.063 | 16.1 | -0.007 | -0.007 | 0.0027 / 0.0039 |

Reading:

- Zeta (MEASURED; forced by the formula). V < 0 at every one of the 1e8 values of phi in (0, 1e6] and at every P: the largest value is -0.0024, -0.0019, -0.0016, -0.0017, -0.0016 for P = 1e7 ... 1e11. The mean of V is -5.489 at every P, which is minus the mean of beta (the on-line sum has mean beta). The smallest value falls from -22.6 to -31.5 (clusters of zeros; one zero gives -L/2 = -12.7 at P = 1e11). L(chi): largest value -0.0093 to -0.0056, mean -6.294. All zeros of both functions below 1e6 are on the line, so the sign of V is the explicit formula and not new information.
- Sign and unimodular twists. V > 0 on 4.5 percent (P = 1e7) to 14.2 percent (P = 1e11) of the phi values, largest value 11.2 to 22.2 (SGN) and 11.1 to 23.9 (UNI); on 1 <= phi <= 21.4 on 46 to 49 percent of the points. The standard deviation of V (3.2 to 5.1) equals that of zeta (3.2 to 4.9): the twists have the same spread and no one-sidedness. They fail because they have no functional equation; the failure is immediate where beta is small (low phi) and does not involve zeros.
- DEL and THIN. Largest value at phi near 0.2: 24.7, 45.3, 81.0, 142.8, 248.4 for DEL (a factor 1.74 to 1.83 per decade of P; 10^(1/4) = 1.78) and twice that for THIN: the term P^(1/4) / ((1/16 + phi^2) L) of the real zero at s = 3/4, seen from distance phi. On 1 <= phi <= 21.4: largest value 3.9 to 16.6, V > 0 on half of the points; over all phi on 1.5 to 7.7 percent.
- T-NR. V > 0 on 37 to 50 percent of all phi, largest value 181 to 5814 (a factor 2.3 to 2.4 per decade; 10^0.404 = 2.53 divided by the growth of L): every phi is within 2.86 of one of its off-line zeros. E_a: 11 to 35 percent.
- DHP (prime-only sum with the DH coefficients). V > 0 on 2e-4 (P = 1e7) to 9.6e-3 (P = 1e11) of all phi and on 32 to 42 percent of the points of 1 <= phi <= 21.4, largest value 0.83 to 1.78. Re R_DHP = (1/2) Re(R_chi + R_chibar) + (kappa/2) Im(R_chi - R_chibar): the imaginary parts are not one-sided. This separates DH from L(chi) at every P and at heights unrelated to its zeros, but it is the statement that the coefficients (1, kappa, -kappa, -1 on the classes mod 5) are not the values of a character, which is the definition of the control.

- DH (MEASURED, run 2). V_DH minus the predicted off-line term is negative at every phi and P (largest value -0.004): the explicit formula with the eight located pairs accounts for every violation. Violations lie within 2.6 (P = 1e4) to 20.7 (P = 1e7) of an off-line zero; none on phi <= gamma_1 / 4 = 21.4 up to P = 1e8, where the off-line term is 0.003 and the supremum of the on-line part is -0.007. Extrapolating the term as P^0.3085 / log P, the first violation in that window is expected for P between 1e9 and 1e10 (HEURISTIC; the full coefficients need all n <= P and were not computed beyond 1e8).
- Exchange rate (PROVED from the formula above). An off-line pair of offset d is visible at distance D when P^d / (D^2 L) exceeds the on-line sum at the observation point, which is (2/L) sum over nearby zeros of sin^2((gamma - phi) L / 2) / (gamma - phi)^2 and has mean beta(phi). Hence P >= (c D^2 L)^(1/d) with c the infimum of the on-line sum over the window searched. For a pair above the verified height (gamma > 3e12, d <= 3/8) seen from distance D = 1e6: P >= 1e32 even with c = 1e-3. With the sharp cutoff instead of the Fejer weight the term is P^d / (D L) and the statistic is two-sided (psi(x) - x against x^(1/2) log^2 x): P >= (D L)^(1/d). In both forms the cost in primes exceeds the cost of verifying the zeros between the observation point and the pair.
- Classification: **not a survivor**. The pole-subtracted resultant is the explicit formula; zeta's pass on phi <= 1e6 is forced by the zeros below 1e6 being on the line; the non-local bias exists, has the size P^d / ((d^2 + D^2) L), and is not detectable at phi <= gamma_off / 4 for DH at the sizes reached; the twists, DEL, THIN, T-NR and E_a fail at every P, each for a reason listed above (no functional equation; a real zero at distance below 21; off-line zeros within 2.86 of every phi).

## 3. One line per closed combination

- (1) Short prime sum against beta: Haar scale sigma <= a against beta = (1/2) log(H/2 pi); no exceedance for zeta or for any twist below the detection support at 1e10 heights; separation from the twists only at N >= detection support, where a pass is a local zero-free statement.
- (2) Realised against torus infimum of |B| - gamma|A|: same finite-window gap for true primes, Haar base, sign twist, perturbed primes, L(chi), at 3.2e9 heights; the gap is the Haar measure of the minimiser.
- (3) Sawtooth ratio: at most 1 for every non-decreasing counting function, sharp at one mean spacing; drift = Turing count, lead zero per event.
- (4) Pole-subtracted prime resultant: equals the explicit formula to 5e-4; bias law P^d / ((d^2 + D^2) L) confirmed for DH to 1e8; detection at distance D needs P >= (D^2 L)^(1/d).

## 4. Weakest steps

1. Combination 2 does not rebuild the P47 fibre function g_q or the late-cell ledger; it tests the full torus function of the first node at N = 690988 on the six recorded rows. A statement about cells 417-424 specifically is not made.
2. Combination 1 samples heights (1e10 on a lattice of step 9701; 4e9 on a lattice of step 24251); it is not a cover. The thresholds beta_F for T-NR, E_a and DH are the leading archimedean terms; the O(1/H) and pole terms are not included (they are below 1e-9 at these heights by the source's estimates).
3. Combination 3: the off-line heights of DH above 367 are located by the largest gap of the line count, not by root finding; the "true S" of DH restored from these locations is not accurate enough for a ratio (it is reported only for the line count and below the first off-line height). The averaged profile is conditioned on isolated steps.
4. The DH prediction for a violation at phi <= 21.4 between P = 1e9 and 1e10 is an extrapolation.

## 5. Reproduction and server units

Local (each through `scripts/memcap.sh 8`, python of `.venv-arb`): `validate_lib.py`, `v2.py`, `c1.py --K 2e5`, `c1n.py --K 2e5 --logM 16`, `c1_recheck.py <json>`, `c2.py --logM 16 --ntrue 2 --nhaar 2 --nsgn 1 --nbeu 1`, `c2_check.py <json>`, `c3.py --heights 1e6 --nz 2000 --Tmax 6000`, `dh_zeros.py c3_local.json 400`, `c4.py --Pmax 1e6 --checks 1e4,1e5,1e6 --phimax 400 --fine 4`, `c4dh.py --N 1e6`.

Server (`~/rh-push/s3-torus-short-prime-sum-extremes/`, through `rhrun`): `chain1.sh` (runs A, B, C, C2, D, D2, E, E2 of combination 1, then combination 4), `chain2.sh` (combinations 2 and 3), `chain3.sh` and `chain5.sh` (more windows for combination 2), `chain4.sh` (run F), `c4dh.py --N 1e8` (CPU). Units: `rh-s3c1bench-1120010753` (throughput test of the direct engine: 2.5e8 terms per second on the shared card), `rh-s3tsp-c1a-1120011217` (failed at start: complex scatter not supported by cupy; fixed), `rh-s3tsp-c1t-1120011403` (failed: syntax error from that fix), `rh-s3tsp-c1t-1120011612` (timing of the lattice engine), `rh-s3tsp-chain1-1120012623`, `rh-s3tsp-chain2-1120012646`, `rh-s3tsp-c4dh-1120012926`, `rh-s3tsp-chain3-1120013420`, `rh-s3tsp-chain4-1120014047`, `rh-s3tsp-chain5-1120014357` (failed at start: GPU memory full), `rh-s3tsp-chain5b-1120021004`. All units of this lane are stopped or finished.

Result files: `c1n_A.json` ... `c1n_F2.json` with `*_recheck.json`; `c2_main.json`, `c2_more.json`, `c2_chi.json`, `c2_main_check.json`; `c3_main.json`, `c3_main_dhzeros.npy`, `c3_dh_post.json`, `dh_offline_zeros.json`; `c4_main.json`, `c4dh_main.json`; server logs in `logs/`.
