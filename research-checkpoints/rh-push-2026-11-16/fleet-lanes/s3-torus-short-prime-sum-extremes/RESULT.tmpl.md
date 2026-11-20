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

@@TABLE1@@

## 2. Details per combination

### 2.1 Combination 1: pointwise short prime sums against beta(H)

Nodes: `star-min-pointwise-prime-bound`, `l-damped-finite-window-floor`, `lemma-mp3-multipoint-phase`. Source: `formalization/rh-attempts/2026-11-01-contradiction.md`, "The line where it fails" and section 3.5.

Definitions (from the source). f(u) = e^{-iHu} sinh(delta u) on [-a, a]; g_0(v) = sinh(delta(2a - |v|))/(2 delta) - (2a - |v|) cosh(delta v)/2; m = sinh(2 a delta)/(2 delta) - a; w = g_0 / m;

    LHS_F(H) = sum_{n <= e^{2a}} Re(Lambda_F(n) n^{-iH}) n^{-1/2} w(log n),      (star): LHS_F(H) <= beta_F(H).

(star) is W(f) >= 0 (Weil non-negativity in this direction); the threshold used is thr_F(H) = (1/2) log(q_F H / 2 pi) with q = 1 (zeta), 5 (chi, DH), 9 (T-NR, from the factor 3^(s-1/2)), and 2 beta for E_a (degree 2); the O(1/H) terms are dropped. For the families without a functional equation (SGN, UNI, LIO, DEL, THIN, HEAT) the zeta threshold is used. The source's (star_min) allows the extra slack s(a) > 0 on the right; all runs below use the stronger (star), so every pass of (star) is a pass of (star_min).

Finite consequence tested: zeta's realised supremum of LHS - beta over the sampled heights is negative; each control's is positive at heights unrelated to its zeros; and (the rotation-invariance question of round 1) zeta's supremum along the orbit is smaller than the supremum along Haar-flow orbits by a margin the twists do not have. Survival would need all three at supports below the detection support, the support a_ideal(delta, H) solving sinh(2 a delta)/delta - 2a = log(H / 2 pi) (source, Lemma 2: an isolated off-line pair of offset delta at height H is visible to some test function of support a if and only if a exceeds a_ideal).

Heights: integer lattice in [3e12, 1e14] (runs A, B, C, F) and in [1e6, 3e8] (run E, below the verified height, as a contrast). "Haar flow": every block of 6.7e7 lattice points starts from independent uniform prime phases and follows the same flow; by Lemma R of lane s1 the SGN and UNI orbits are translates of the zeta orbit and are a second Haar reference.

@@C1TABLES@@

Reading (MEASURED unless marked):

@@C1READING@@

- Scale of the statistic (variance bound PROVED, elementary; the Gaussian rate is a model, checked by the Haar-flow runs). |w| <= 1 and the Haar variance is sigma^2 = (1/2) sum Lambda(n)^2 w(log n)^2 / n <= (1/2) int_0^{2a} v dv = a^2. For fixed delta the weight decays like e^{-delta v}, so sigma stays bounded as the support grows (about 1/(2 sqrt 2 delta) from the positive lobe, plus the negative lobe: measured 1.27, 2.09, 2.79 at the detection supports of delta = 3/8, 0.2, 0.137) while beta(H) = (1/2) log(H / 2 pi) grows. Under Haar the exceedance probability per height is about exp(-beta^2 / (2 sigma^2)); the expected number of exceedances among the roughly H independent heights below H is H exp(-(log H)^2 / (8 sigma^2)), which decreases once log H > 8 sigma^2 (H > 4e5 for delta = 3/8; H above about e^100 for delta = 0.1). So at the detection support of delta = 3/8 the torus gap (40.85 against 13.5, the factor 3.03 of the node) is carried by a set of Haar measure about 1e-26: neither zeta nor any twist comes near the threshold in 1e10 heights, and the test cannot separate them there. A separation at heights above 3e12 needs sigma of order beta / 5, that is delta <= 0.14 and N >= 1e8: run F.
- Why this is verified height in another form (CLASSICAL plus the source's Lemma 2 and Proposition 6). LHS_F(H) <= beta_F(H) is W(f) >= 0, and W(f) = sum over zeros of |F(gamma)|^2 for the zeros on the line plus -2 m^2 (1 + o(1)) for each off-line pair within the resolution of f. Below the detection support the term of an isolated off-line pair cannot dominate (Lemma 2, continuous model), so the inequality does not see such a pair; at and above it, in the source's continuous model, a pass at height H is equivalent to "no off-line pair of offset >= delta within the window of f at H". The runs make no rigorous statement about zeros: they use the ideal support, not the rigorous one (a_rig of the source is 2 to 3 times larger), and they sample heights. Each sampled height is a zero-free statement for one window, obtained with N = (c log H)^(1/delta) prime powers (1e8 for delta = 0.137 at 3e12) where the Riemann-Siegel formula uses 7e5 terms.
- Why the twists fail there (Lemma R of lane s1, PROVED there; rates MEASURED). A twist has the same torus function translated; its orbit is a Haar-typical line; the threshold beta is zeta's archimedean term, and a twist has no functional equation that would force W >= 0. Its exceedance rate equals the Haar-flow rate (1.0e-7 to 2.1e-7 against 0.95e-7 to 2.2e-7 in run F; 1.5e-6 to 1.8e-6 against the same in run E). The failure does not depend on zeros, and it occurs exactly at the supports where the Haar rate is visible in the sample, which are the supports at or above the detection support for the offsets in question.
- Classification: **not a survivor**. (i) Below the detection support: no separation from the twists at any sample size reached; only coefficient size separates (T-NR through its non-tempered factor at 3, DH through coefficient growth caused by zeros to the right of 1; E_a does not exceed at N = 6420). (ii) At the detection support: zeta and L(chi) pass and SGN, UNI (and LIO, THIN in run E) fail, at heights above the verified height in run F; but the pass of zeta at a height is the local zero-free statement that the test was built to detect (the size at which the twists fail is the size at which the test resolves an off-line pair), DEL fails once in 3e8 heights and not at all above 3e12, and the heat coefficients never fail. What run F measures is that 4e9 sampled windows between 3e12 and 1e14 show the one-sided truncation that Weil non-negativity predicts.

### 2.2 Combination 2: realised infimum against torus infimum of the barrier function

Nodes: `bohr-torus-scan-certification`, `fejer-riesz-branch-reduction`, `p47-late-cell-floors`. Sources: `src/data/barrier-mollifier-length-ceiling-2026-09.js` (read as text), `tmp/torus_floor_scan.py`, `src/data/route-4-fejer-riesz-wol-2026-10-07.js`, `src/data/route-1-finish-route-p-2026-10-06.js`.

Object. G(theta) = |B(theta)| - gamma |A(theta)| on the torus of the 55,874 prime phases below N = 690988, with B = sum_{n<=N} w_n e^{-i theta.v(n)}, A = sum w_n n^y e^{-i theta.v(n)}, w_n = exp((t/4) log^2 n - sigma log n), on the six recorded rows of the line t + y^2/2 = 0.145. Torus infimum: the recorded L-BFGS values (two rows recomputed here, equal). Scope note: the per-prime fibre function g_q of route 4 (the |sin k theta| terms, k <= 7) and the P47 cell ledger (cells 417-424) were not rebuilt; they are bounds for suprema of pieces of this same kind of torus function, and the question asked of them (does the realised orbit stay away from the torus extremum by a margin a control lacks) is asked here of the full function G, which is the object of the first node.

Finite consequence tested: inf of G over realised heights minus inf over the torus is positive for the true primes and not for the controls. Realised phases theta_p = (x/2) log p for x on a grid of step 0.1294 covering whole windows of length 8.68e6 (6.7e7 points per window, a NUFFT in x); 16 consecutive windows from x = 4 pi N^2 = 6.0000e12 (1.07e9 heights, the length of 8 cells of the Riemann-Siegel index), 32 windows near 6.14e12 (2.1e9 heights); the third run repeats the 16 windows from 6.0000e12 against new controls (48 distinct windows, 3.2e9 heights). Controls, same flow and window length: Haar base phases (56 windows), sign twist of the true base (20), Beurling-type set p -> p + U(-1/2, 1/2) with Haar base (20); L(chi mod 5) (true base rotated by arg chi(p), multiples of 5 removed; 16 windows) against its own Haar flow (16).

@@C2TABLES@@

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

@@C3TABLE@@

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

@@C4TABLE@@

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

@@C4READING@@

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

Server (`~/rh-push/s3-torus-short-prime-sum-extremes/`, through `rhrun`): `chain1.sh` (runs A, B, C, C2, D, D2, E, E2 of combination 1, then combination 4), `chain2.sh` (combinations 2 and 3), `chain3.sh` and `chain5.sh` (more windows for combination 2), `chain4.sh` (run F), `c4dh.py --N 1e8` (CPU). Units: @@UNITS@@. All units of this lane are stopped or finished.

Result files: `c1n_A.json` ... `c1n_F2.json` with `*_recheck.json`; `c2_main.json`, `c2_more.json`, `c2_chi.json`, `c2_main_check.json`; `c3_main.json`, `c3_main_dhzeros.npy`, `c3_dh_post.json`, `dh_offline_zeros.json`; `c4_main.json`, `c4dh_main.json`; server logs in `logs/`.
