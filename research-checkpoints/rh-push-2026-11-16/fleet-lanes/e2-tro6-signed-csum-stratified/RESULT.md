# e2-tro6-signed-csum-stratified: the signed c-sum of TRO6 by squarefull stratum of the row, a row-sensitive statistic, and a test of the dual term

2026-11-18. Internal working note. Nothing committed or pushed. Not refereed.

**Verdict: partial result (measurements) plus a precise obstruction for one leg. TRO6-natural(eta) is not proved for any
eta > 0. No abscissa is claimed: 7/8 and 0.874886647 are unchanged and both rest on unrefereed inputs (openai/math
manuscript, Liu 2610.12234, Xu-Sang 2610.15291, Liu 2610.26835). RH open. NO QED.**

Labels: PROVED / CLASSICAL / EXACT (finite identity checked on the table) / MEASURED / ARGUED / OPEN.
Geometry: the toy geometry of rounds 1-3 (n = 1 part, S' empty, rows N(m) <= Q, conductors N(c) around R = Q^1.4,
shorthand row beta_c = alpha(c) gamma_2(c) w(c), i.e. the row type `a` of round 2). Estimator rho-hat of round 1
(Gauss-sum table to 10^7). All exponents below are in this geometry.

## 0. Summary

1. **Leg (b), stratification by squarefull part: closed as a route [PROVED identity + MEASURED shares].**
   Lemma S: on the stratum m = u m1 m2^2 m3^3 m4^4 m5^5 t^6 the symbol factors as chi_c(m) = chi_c(u m1) xi_k(c), where
   xi_k is a Hecke character of c of conductor dividing 4 rad(m2 m3 m4 m5) (cubic on m2 and m4, quadratic on m3, sextic
   on m5) and the long row sum over m1 keeps the full sextic symbol. The degeneration to quadratic and cubic
   characters is in a bounded-conductor twist of the conductor weights, not in the row sum. The squarefree stratum
   (xi = 1, nothing degenerates) holds 93.9% of sum |rho-hat|^2 and 94.5% of sum |B_m|^2 at Q = 30000; all other
   strata together are at most 5.8% of the Cauchy-Schwarz bound. Stratification can only change a constant.
   The saving needed per stratum is stated in Proposition S2; its k = 1 case is TRO6 on squarefree rows.
2. **First decisive test: a row-sensitive statistic now exists and it finds only the polar term [MEASURED].**
   sup of t over completely multiplicative unimodular nu by coordinate ascent on prime phases, with random-phase rows
   as baseline, per stratum, at 11 path points Q = 938 ... 30000. Before polar removal the optimiser separates
   rho-hat from random rows (squarefree stratum, primes up to sqrt of the window: 1168 against 218 at Q = 30000,
   exponent in Q 1.05 against 0.52). After polar removal rho-hat and random rows agree in every stratum and at every
   level: exponent difference 0.000 +- 0.001 (all primes free), within 0.04 at restricted levels; ratio within 1.2%.
   Hecke twists of bounded conductor (4014 Dirichlet characters, 6424 twists alpha^k N^{iv}) give the maximum
   expected for independent phases in the two large strata. No stratum shows an excess; none shows a power deficit.
   The data do not separate eta = 0 from eta > 0.
3. **New measured structure [MEASURED].** The polar term lives in the squarefree stratum: excess polar share of
   the conductor-side energy 0.148 -> 0.102 (squarefree), 0.0080 -> 0.0059 (max exponent 2), 0.0007 (max exponent
   >= 3). Six rows with a fifth power: signal consistent with 0 (Kazhdan-Patterson rho(m p^5) = 0).
4. **Pivot (form (a), the dual form): the leading dual term is detected for the first time [MEASURED].**
   For 1.2 Q < N(c) <= 4 Q the non-polar remainder times conj gamma_1(c) is correlated with the theta estimator at
   index (S-unit) c: 12 class coefficients at index lambda c explain 49% of its energy inside classes of c mod 36
   against 22% for permuted conductors, at Q = 7500 (5920 conductors); the same from two disjoint modulus ranges of
   the estimator (49%, 45%); 42% against 18% at Q = 3750 and 55% against 27% at Q = 10607. The literal index -e0 c
   gives 27% (near null), which is why the first two scans saw nothing. This supports the orientation of the dual sketch (index c, gamma_1(c) removed, no conjugation, no
   angular factor). It is a correlation between two finite Gauss-sum estimators, not a proved Voronoi formula.
   The s = 1 slice of the Moebius-twisted dual sum is at the random level for the manuscript weight mu alpha^2
   (t = 0.90, max 1.65-1.71 against control max 2.1-2.9) and above it for the neighbouring weight mu alpha (max
   4.1; 4.9 on 7190 conductors).
5. Nothing here is a statement about zeros. No eta. Form (a) remains open; its premise now has numerical support.

## 1. Plan; what is new against the map

Read: BRIEF, OBSTRUCTION_MAP (Z1-Z8, T1, positive list 30-32, open direction 4), SYNTHESIS_R3 (3.4, 3.5, 4.4, 4.5,
next step 3), the four source lanes with their referees, `sextic-theta-proof.md` (Lemmas A.0-A.3, 7.3).

* Closed and not repeated: per-modulus then l2-in-c (Z7), Type I/II with arbitrary coefficients (Z6), large sieves
  (Z5), row-blind family scans (Z8).
* New here: (i) the stratified form of the signed c-sum written exactly, with the l2 budget per stratum measured;
  (ii) the statistic the round-3 referee asked for (optimiser over multiplicative nu, random-phase baseline), with a
  positive control; (iii) a direct test of the leading term of the dual form on which form (a) depends, over all
  216 S-unit shifts of the index.
* Order of work as assigned: decisive test first (section 3). It did not kill form (a); it left leg (b) without any
  measurable handle, and Lemma S closes (b) on its own. One pivot was taken: the dual-term test (section 4).

## 2. First lemma: the stratified signed c-sum

Notation of `r3-nonpolar-proof` section 1. rho(m) = rho^nat_sigma(-e0 m). c squarefree, primary, prime to 6.
T(c) = sum_m W(N(m)/Q) chi_c(m) rho(m), B = sum_c beta_c T(c) = sum_m rho(m) B_m, B_m = sum_c beta_c chi_c(m).
Lemma L (round 2, EXACT): gamma_2(c) alpha(c) chi_c(m) = mu(c) alpha(c)^2 G(c) conj g~(m, c), so the sign that must be
kept is mu(c) times a class function.

**Lemma S [PROVED; EXACT check `lemma_check.py`].** Every m in O \ {0} is uniquely

  m = u m1 m2^2 m3^3 m4^4 m5^5 t^6,

u a unit times lambda^a 2^b, the m_j primary, squarefree, prime to 6 and pairwise coprime, t primary and prime to 6
(exponent of p in m = 6 v_p(t) + j for p | m_j). Write k = (m2, m3, m4, m5, t), k* = m2^2 m3^3 m4^4 m5^5 t^6. For c
squarefree, primary, prime to 6 m:

  chi_c(m) = chi_c(u m1) xi_k(c),
  xi_k(c) = chi_{m2}(c)^2 · conj chi_{m4}(c)^2 · R(m3, c) chi_{m3}(c)^3 · R(m5, c) conj chi_{m5}(c) · 1[(c, t) = 1],

with R = +-1 the reciprocity sign of manuscript Lemma 4.4, a function of the classes mod 4. Hence

  B = sum_k B_k,   B_k = sum_c beta_c xi_k(c) T_k(c),   T_k(c) = sum_{u, m1 : (m1, k*) = 1} W(N(u m1 k*)/Q) rho(u m1 k*) chi_c(u m1).

*Proof.* Complete multiplicativity of chi_c in the upper argument; chi_c(x)^4 = conj chi_c(x)^2, chi_c(x)^5 =
conj chi_c(x), chi_c(t)^6 = 1 for (c, t) = 1; reciprocity chi_c(x) = R(x, c) chi_x(c) for primary coprime x, c prime
to 6, with R^2 = 1. ∎

EXACT (`lemma_check.log`): 463,384 pairs (prime of norm 7..97 or inert 5, 11; squarefree node c): cubic reciprocity
chi_c(pi)^2 = chi_pi(c)^2 with no sign, 0 failures; chi_c(pi)/chi_pi(c) = +-1, 0 failures; the sign is constant on
each of the 144 cells (class of pi mod 4, class of c mod 4), -1 on 54 of them; composite
m = pi_31 pi_7^2 pi_13^3 pi_19^4 on 2,110,642 coprime nodes, 0 mismatches.

Character to which chi_c degenerates, per factor of the kernel:

| factor of m | symbol in the row variable | as a function of c |
|---|---|---|
| m1 (exponent 1) | sextic, chi_c(m1): unchanged | — (this is the row sum) |
| m2^2 | cubic | cubic Hecke character chi_{m2}^2, conductor m2, no sign |
| m3^3 | quadratic | quadratic character chi_{m3}^3 times the mod-4 sign R(m3, ·) |
| m4^4 | cubic, conjugate | conj chi_{m4}^2, conductor m4 |
| m5^5 | sextic, conjugate | R(m5, ·) conj chi_{m5}; rho vanishes there (Kazhdan-Patterson, CITED in the heuristic setting; MEASURED below) |
| t^6 | trivial | coprimality (c, t) = 1 |

Consequences.

* In every stratum the long sum (over m1, length Q/N(k*)) carries the full sextic symbol. A degenerate symbol sits on
  a long variable only when m2 or m3 is itself long, i.e. N(k*) >= Q^{1-delta}; those rows are a fraction about
  Q^{-(1-delta)/2} of the l2 mass (measured tail below).
* B_k is the k = 1 form with beta twisted by a Hecke character of order dividing 6 and conductor dividing 4 rad(k*),
  and with the row vector rho(· k*). So stratification is a reduction to the squarefree stratum with bounded twists.
* On the row side the same factorisation reads gamma_2(c) chi_c(m) = g~_2(m, c) chi_c(m)^3: the cubic Gauss-sum
  coefficient at index m (which depends on m modulo cubes) times the quadratic symbol of m (which depends on the
  part of m with odd exponent). So B_m is a cubic Kubota sum twisted by a quadratic character of conductor dividing
  4 rad(m1 m3 m5); the twist is trivial only on rows with all exponents even, a set of density 0.
  [PROVED, same algebra; not used below.]

**l2 budget per stratum [MEASURED, `norms_strata.py`, 54,261 generic half rows, Q = 30000].**

| stratum (max exponent away from 2, lambda) | rows | share of rows | share of sum of rho-hat squared | noise-corrected | share of sum of B_m squared |
|---|---|---|---|---|---|
| 1 (squarefree, k = 1) | 50,664 | 0.9337 | 0.9388 | 0.9387 | 0.9450 |
| 2 | 3,204 | 0.0590 | 0.0550 | 0.0552 | 0.0499 |
| 3 | 345 | 0.0064 | 0.0055 | 0.0055 | 0.0048 |
| 4 | 42 | 0.0008 | 0.0006 | 0.0006 | 0.0002 |
| 5 | 6 | 0.0001 | 0.00003 | -0.00001 | 0.0001 |

The count share 0.9337 is prod_{p not dividing 6}(1 - N(p)^{-2}) = 1/(zeta_F(2)(1 - 1/16)(1 - 1/9)) = 0.9337. Shares at
Q = 3750, 7500, 15000 agree to 0.002 (`norms_strata.json`). Rows with a fifth power (6 rows, p of norm 7): mean
|rho-hat|^2 = 0.00063 against mean estimator variance 0.00089 and 0.0040 on all rows, i.e. signal consistent with 0.

Tail by kernel norm K = N(k*): share of sum |rho-hat|^2 on rows with K > 30, 100, 300, 1000, 3000 is 0.061, 0.030,
0.020, 0.0074, 0.0031 (count shares 0.066, 0.033, 0.022, 0.0086, 0.0041): about 0.3 K^{-1/2}, the density of the
squarefull numbers. Mean |rho-hat|^2 per row falls from 0.0040 to 0.0030 across that range.

**Proposition S2 (per-stratum saving that would give eta > 0) [PROVED from its hypotheses].** Let C = ||rho W|| ||B||
(the Cauchy-Schwarz bound, Q^{11/12}). Assume
 (T_tau) sum over rows with N(k*) > K of |rho|^2 << K^{-2 tau} ||rho||^2 for 1 <= K <= Q (MEASURED with 2 tau = 1/2; not proved);
 (S_{eta1, A}) |B_k| << N(k*)^A Q^{-eta1} C for every kernel with N(k*) <= K0.
Then |B| << (K0^{A+1/2} Q^{-eta1} + K0^{-tau}) C, and with K0 = Q^{eta1/(A+1/2+tau)}:

  |B| << Q^{-eta_Q} C,  eta_Q = tau eta1 / (A + 1/2 + tau);  for tau = 1/4, A = 0: eta_Q = eta1/3, eta = 80 eta_Q = 80 eta1/3 (capped at 1).

*Proof.* There are << K0^{1/2} kernels of norm at most K0. For the rest, Cauchy-Schwarz over rows and (T_tau). ∎

So a saving Q^{-eta1} on each stratum with kernel norm up to Q^{4 eta1/3}, uniform in the twist xi_k, gives eta > 0.
The k = 1 case of (S) is TRO6 restricted to squarefree rows, with 94% of both norms. **Obstruction for leg (b):**
the stratified form contains the unstratified problem as its dominant term with nothing degenerate in it; the
strata where a character degenerates carry at most sqrt(0.061 · 0.055) = 5.8% of C in total, so even complete
cancellation there changes a constant, not an exponent. (Strata could in principle cancel against each other;
no tool addresses that and it is not claimed either way.)

## 3. First decisive test: the row-sensitive statistic

### 3.1 Construction (`acc.py`, `opt.py`)

* Rows: the 54,261 generic half rows of round 2 (stored rho-hat = rho_str + rho_cor; nothing refitted), split into
  strata 0 (squarefree away from 2, lambda), 1 (max exponent 2), 2 (max exponent >= 3), and "all".
* Per stratum s and conductor c: S_s(c) = sum_{m in s} rho-hat_sigma(-e0 m) chi_c(m) on the exact table, six classes
  sigma per parity. Variants: rho-hat; two draws of random-phase rows (rho-hat times an independent uniform phase per
  (row, class)); the leave-one-out term is carried with the same phases.
* Conductor-side vector x(c) = alpha(c) gamma_2(c) w_k(c) y(c), window |log(N(c)/R_k)| <= 1.6, R_k = Q_k^1.4; y =
  leave-one-out sum (`loo`) or the same minus the cell means of y conj(pred) (`band`, polar part removed; the same
  projection is applied to the random rows).
* t(nu) = |sum_c nu(c) x(c)|^2 / sum_c |x(c)|^2.
* Optimiser: nu completely multiplicative, unimodular, nu(p) free for N(p) <= P and nu(p) = 1 otherwise, P in
  {30, 100, 300, 1000, small = sqrt(max norm), all}. For one prime, X = A + e^{i theta} B, so the optimal phase is closed
  form; cyclic coordinate ascent, 6 sweeps per level, nested warm starts. Primes above sqrt(max norm) have disjoint
  conductor sets and are updated in one block step (monotone). Second run at P = all from a random multiplicative start.
* Hecke twists of bounded conductor: F1 = all 4014 non-principal Dirichlet characters modulo the split primes of
  norm 7..199 (on the primary generator), F2 = 6424 twists alpha^{-k} N^{-iv}, |k| <= 12, |v| <= 126 (2-D FFT).
* Each (stratum, projection) gives 12 rho-hat columns and 24 random-row columns. z = difference of means over its
  standard error from the random-row scatter. Path points share rows, so they are not independent.

Validation: sum over strata of S_s(c) against the stored round-2 snapshot: max difference 2e-6 ... 8e-5 on values of
rms 0.9 ... 4 (single-precision snapshots), all 11 path points; self-term identical to 1e-15. Polar share for all
rows 0.1870 at Q = 938 (round-3 referee: 0.1870), random-row baseline 0.031 (referee: 0.029-0.032).

Memory: accumulation 4 workers x 1.46 GB planned and printed (unit limit 8 GB, peak 8.0 GB including file cache,
not killed); optimiser at most 2 x 1.36e6 x 36 complex64 = 0.73 GB per parity.

### 3.2 Results (`tables.md` has every path point)

Entries: mean over the 12 rho-hat columns / mean over the 24 random-row columns. Last columns: exponent in Q of each
and their difference with a leave-one-point-out jackknife error.

**After polar removal (`band`).**

| level, stratum | Q = 938 | 3750 | 15000 | 30000 | exponent rho-hat | random rows | difference |
|---|---|---|---|---|---|---|---|
| all primes, squarefree | 1268 / 1272 | 6165 / 6190 | 31094 / 31051 | 70488 / 70564 | 1.159 | 1.159 | +0.000 +- 0.001 |
| all primes, max exp 2 | 1282 / 1291 | 6257 / 6305 | 31522 / 31798 | 71869 / 72428 | 1.162 | 1.162 | -0.000 +- 0.001 |
| all primes, max exp >= 3 | 1381 / 1376 | 6223 / 6314 | 31404 / 31712 | 71519 / 72333 | 1.154 | 1.152 | +0.002 +- 0.005 |
| small, squarefree | 31.0 / 35.7 | 75.4 / 75.9 | 152 / 151 | 216 / 218 | 0.545 | 0.518 | +0.028 +- 0.016 |
| small, max exp 2 | 32.8 / 34.0 | 76.0 / 74.5 | 155 / 155 | 229 / 225 | 0.551 | 0.555 | -0.004 +- 0.016 |
| small, max exp >= 3 | 38.7 / 40.9 | 75.0 / 72.8 | 160 / 152 | 212 / 214 | 0.534 | 0.499 | +0.036 +- 0.016 |
| P = 1000, squarefree | 30.8 / 35.3 | 73.5 / 74.6 | 90.7 / 91.8 | 92.3 / 92.4 | 0.305 | 0.280 | +0.024 +- 0.016 |
| P = 30 (7 phases), squarefree | 4.06 / 6.09 | 4.33 / 5.25 | 5.01 / 5.89 | 4.12 / 4.96 | -0.009 | -0.054 | +0.046 +- 0.060 |
| P = 30, max exp 2 | 4.79 / 5.29 | 5.97 / 4.90 | 5.64 / 4.36 | 6.94 / 5.76 | 0.066 | 0.034 | +0.033 +- 0.043 |
| F1 max (4014 characters), squarefree | 9.15 / 8.92 | 8.41 / 8.72 | 8.56 / 8.75 | 8.46 / 8.80 | -0.014 | 0.002 | -0.016 +- 0.011 |
| F2 max (6424 twists), squarefree | 9.01 / 8.51 | 8.65 / 8.45 | 9.66 / 8.53 | 8.95 / 8.58 | 0.030 | 0.001 | +0.029 +- 0.023 |
| F2 max, max exp >= 3 | 8.44 / 8.65 | 16.7 / 12.6 | 14.0 / 13.0 | 33.9 / 15.1 | 0.282 | 0.145 | +0.136 +- 0.080 |

**Before polar removal (`loo`): positive control.**

| level, stratum | Q = 938 | 3750 | 15000 | 30000 | exponent rho-hat | random rows | difference |
|---|---|---|---|---|---|---|---|
| small, squarefree | 35.2 / 35.3 | 127 / 76.2 | 555 / 150 | 1168 / 218 | 1.049 | 0.516 | +0.533 +- 0.040 |
| all primes, squarefree | 1344 / 1267 | 7081 / 6192 | 39156 / 31056 | 90848 / 70565 | 1.228 | 1.159 | +0.069 +- 0.007 |
| small, max exp 2 | 32.8 / 34.0 | 76.7 / 74.2 | 156 / 155 | 230 / 224 | 0.554 | 0.552 | +0.002 +- 0.012 |
| aligned direction conj(alpha gamma_2 pred), squarefree | 230 / 1.8 | 1352 / 2.7 | 7179 / 2.8 | 16790 / 3.7 | 1.235 | 0.18 | +1.05 +- 0.04 |
| aligned direction, max exp 2 | 12.4 / 1.9 | 67.6 / 2.6 | 399 / 4.4 | 1023 / 4.3 | 1.316 | 0.39 | +0.92 +- 0.06 |
| aligned direction, max exp >= 3 | 2.1 / 2.0 | 6.6 / 1.5 | 45.9 / 2.3 | 103 / 2.8 | 1.088 | 0.10 | +0.99 +- 0.06 |

**Polar share of the conductor-side energy, above the random-row baseline.**

| stratum | Q = 938 | 3750 | 15000 | 30000 |
|---|---|---|---|---|
| squarefree | 0.1483 | 0.1340 | 0.1103 | 0.1016 |
| max exp 2 | 0.0080 | 0.0070 | 0.0059 | 0.0059 |
| max exp >= 3 | 0.0007 | 0.0008 | 0.0007 | 0.0006 |
| all | 0.1558 | 0.1409 | 0.1164 | 0.1077 |

Reading.

1. **The statistic is row-sensitive.** With the polar part present the optimiser separates rho-hat from random
   rows at every Q >= 1875 in the squarefree stratum (z from +5 to above +200), with only 85 to 442 free phases,
   and the excess exponent is +0.53. It does so without being told the polar direction, which is not completely
   multiplicative (it contains mu and the class function G). This repairs referee item E1 of `r3-nonpolar-numerics`.
2. **After polar removal there is no excess in any stratum.** With all primes free the two exponents agree to
   0.001 (squarefree and max exponent 2) and 0.005 (max exponent >= 3); the ratio rho-hat / random is 0.996-1.005
   (squarefree), 0.983-1.002 (max exp 2), 0.957-1.003 (max exp >= 3). The sparse strata sit below the random rows
   at 10 of 11 path points (mean log ratio -0.009 +- 0.002 and -0.017 +- 0.004; z between -2.5 and -10 from
   Q = 2652 on): a constant factor, not a power.
3. **Restricted levels.** At P = small and P = 1000 the squarefree ratio is 0.87 at Q = 938 and 0.93-1.05 afterwards
   (mean log ratio -0.02 +- 0.015); the exponent differences +0.02 to +0.04 come from the first points and are within
   2.3 jackknife errors. At P = 30 (7 free phases) the squarefree stratum is below random at 8 of 11 points (mean
   log ratio -0.15 +- 0.07), the stratum max exponent >= 3 at 10 of 11 (-0.18 +- 0.04), and the stratum max exponent 2
   above at 9 of 11 (+0.14 +- 0.04); no trend in Q in any of them.
4. **Unrestricted supremum is counting.** With all primes free t_opt is 0.060 (Q = 938) to 0.026 (Q = 30000) times the window
   size for every row vector (exponent 1.16 in Q, 0.83 in the window size), because each prime above sqrt(max norm) contributes a free
   phase. As the round-3 referee expected, the supremum over all multiplicative nu is a positive power of the window
   size and carries no information by itself; only the comparison with the baseline does.
5. **Bounded-conductor Hecke twists.** F1 and F2 maxima are 8-10 for rho-hat and for random rows in the squarefree
   and max-exponent-2 strata (expected maximum of 4014 or 6424 exponential variables: 8.3, 8.8). In the stratum max
   exponent >= 3 (42 to 393 rows) both are elevated for F2 and rho-hat is above the random rows (33.9 against 15.1
   at Q = 30000, z = +6; 13-17 against 11-13 at intermediate Q). Probable cause, not checked: the few rows m = u
   lambda^a 2^b pi^3 with large |B_m(nu)| for smooth nu (quadratically twisted cubic Kubota sums) add coherently
   over unit and S-unit multiples for rho-hat and incoherently for independent random phases. This stratum holds
   0.55% of the mass.
6. **Measured exponent per stratum.** Excess exponent of the optimised form over the random-row baseline, after
   polar removal: squarefree 0.000 +- 0.001, max exponent 2 0.000 +- 0.001, max exponent >= 3 0.002 +- 0.005 (all
   primes); +0.03 +- 0.02, 0.00 +- 0.02, +0.04 +- 0.02 (primes up to sqrt of the window). Before polar removal: +0.53,
   0.00, +0.03. None of these is a value of eta: a saving eta would appear as a deficit of the true form against
   Cauchy-Schwarz at the single nu of the target, of size Q^{-eta/80} (0.88 at Q = 30000 for eta = 1), far below what
   any column here resolves. The test could have shown a stratum where rho-hat is alignable beyond random rows
   (an obstruction to eta > 0 in that stratum for some multiplicative nu). It shows none.

## 4. Pivot: the leading term of the dual form (form (a))

Form (a) needs the dual expansion of the remainder (sketch in `r3-nonpolar-proof` 4.3; hypothesis (V) of
`r2-tro6-type12-split`, whose orientation test was inconclusive):

  R(c) ~ (unit) gamma_1(c) N(c)^{-1/2} Q^{11/12} sum_{N(s) <~ N(c)/Q} rho(u c s) w~(N(s) Q / N(c)),   N(c) > Q,

after which B_R is a Moebius-twisted sum of theta coefficients over n = c s, and "cancellation in the s-sum" means
treating sum_{s | n} as one divisor-type weight. Nothing in rounds 1-3 tested the expansion itself.

### 4.1 Test

a_{c,sigma} = y_sigma(c) conj gamma_1(c) (y = band-projected leave-one-out sum at Q_k from the round-2 snapshot);
b_{c,tau} = stripped estimator rho-hat_tau at the index zeta_6^U lambda^A 2^B c. Because chi_n(t^6) = 1, the stripped
coefficient depends on (A, B, U) mod 6 only, so 216 systems cover every S-unit shift of the index; 12 of them
coincide up to class constants (shifts by lambda^3, 4, -1), leaving 18 distinct. `dual_coef.py` computes all 216 x 12
coefficients per conductor in one pass (histogram over (cell, e_lambda, e_2, e_zeta, e_c), 4-D DFT); it reproduces
the stored rho_str at index -e0 c to 1e-9. Groups: (c mod 4, c mod 9), so that unit factors depending on c through
its classes are constant; group means removed; null: conductors permuted inside groups.

### 4.2 Results at Q = 7500 (5920 conductors, 9000 < N(c) <= 30000, N(c)/Q in (1.2, 4])

* First scans (`dual_test.py`, `dual_reg.py`; index -e0 u lambda^a 2^b c with a <= 2, b <= 1, from the stored rows):
  nothing above the permutation null at Q = 938 ... 10607 (a planted 8% component is detected: U = 17-22 against 12).
* All S-unit shifts (`dual_full.py`, `dual_probe.py`): every one of the 216 systems is above the null maximum.
  Mean of T = (n_g - 1)|corr_g|^2 over (sigma, tau) and 324 groups: best family 1.78 (index lambda c, i.e. (A, B, U)
  with A in {1, 4}, B even, U in {0, 3}), next 1.52, mean over systems 1.22; null 0.995 +- 0.013, null maximum 1.02.
  Only with b unconjugated and no angular factor: with a factor alpha^j, j = +-1, +-2, the values are at the null
  (largest per-system mean 1.05 against 1.01); with conj(b) and j = 0 there is a weaker signal (1.44 against 1.29,
  group means not removed in that run).
* Explained fraction R^2 of a (6 columns) by the 12 classes tau of one system, 108 groups of median size 55
  (`dual_probe2.py`):

| system (A, B, U) | R^2 | null (permuted) | b from moduli <= 2e6 only | b from moduli > 2e6 only | conjugate conductor |
|---|---|---|---|---|---|
| (1, 0, 0): index lambda c | 0.494 | 0.222 | 0.488 | 0.454 | 0.264 |
| (3, 4, 5) | 0.416 | 0.220 | 0.403 | 0.376 | 0.259 |
| (0, 0, 0): index c | 0.410 | 0.221 | 0.401 | 0.370 | 0.256 |
| (5, 1, 0): index -e0 c | 0.273 | 0.222 | 0.264 | 0.245 | 0.215 |

  With the polar part left in (`loo`) the first row is 0.636.
* By norm range (best family, groups inside each range): T = 1.26, 1.35, 1.39, 1.48, 1.82 for N(c)/Q in (1.2, 1.5],
  (1.5, 1.9], (1.9, 2.4], (2.4, 3.0], (3.0, 4.0] against null 0.99-1.00; per pair (sigma, tau) this is 3.7% to 4.5% of
  the energy in every range.
* Replication at Q = 3750 and Q = 10607: section 4.4.

Reading [MEASURED; interpretation ARGUED]. For 1.2 < N(c)/Q <= 4 a single S-unit system of theta estimators at
index c explains about a quarter to a third of the energy of the non-polar remainder (R^2 0.49 against 0.22;
adjusted for 12 predictors on 55 points: 0.35), with the phase gamma_1(c) removed, unconjugated and with no angular
factor. That is the shape of the s = unit term of the sketch: theta coefficients at multiples of c (exponent 1), not
cubic Gauss sums. All systems correlate because they are different class-weighted sums of the same Kubota partial
sums at index c. The index is c times an S-unit in the class of lambda, not -e0 c.

Limits. Both sides are built from the same Gauss-sum table (moduli up to 10^7): the statement is a correlation
between two finite Kubota-sum estimators. It persists when b uses only moduli <= 2e6 or only > 2e6 (the two halves
correlate 0.80 with each other), but y uses all moduli. It is not a Voronoi formula and gives no bound.

### 4.3 The s = 1 slice of the Moebius-twisted dual sum (`dual_mob.py`)

With R(c) ~ gamma_1(c) rho(S c) and gamma_1 gamma_2 = mu alpha G, the s = 1 part of B_R is
sum_c mu(c) alpha(c)^2 G(c) w(c) rho(S c). Class-resolved statistic (independent of any class function of c mod 4):
t_j = sum_{classes} |sum_{c in class} mu(c) alpha(c)^j rho-hat_tau(S c) N(c)^{-1/2}|^2 / sum |·|^2, 2592 columns,
5920 conductors. Control: random completely multiplicative weights, 20 draws: mean 0.98, maximum over columns 2.1
on average, 2.8 at most.

| j | mean t | max t | max without mu |
|---|---|---|---|
| 2 (manuscript weight) | 0.895 | 1.65 | 1.12 |
| 1 | 1.314 | 4.09 | 0.63 |
| 0 | 0.937 | 2.00 | 137 (first moment of theta coefficients) |
| -1, 3 | 0.96, 1.03 | 2.29, 2.00 | 0.71, 1.26 |

* j = 2: at the random level. No coherent Moebius term in the s = 1 slice for the manuscript weight at this size.
* j = 1: above the control (4.09; 4.22 and 2.93 from the two modulus halves; 4.15 and 3.37 on the lower and upper
  half of the conductors). Since gamma_1 gamma_2 = mu alpha G, this says the theta estimator at squarefree index c
  has a small component along conj(gamma_1(c) gamma_2(c)), amplitude about 0.08 per class. A Groessencharacter twist
  nu = conj(alpha) of the row would meet it. Weak; one path point; recorded, not used.
* 5920 terms cannot test a power saving in the Moebius sum; the slice only excludes a coherent term of relative
  amplitude above about 0.06 per class for j = 2.

### 4.4 Replication

Same pipeline at two other path points (`dual_probe_04.log`, `dual_probe_07.log`, `dual_probe2_0*.log`,
`dual_mob_0*.log`; server runs). The conductor sets overlap (all have N(c) <= 30000) and the b-side is the same; the
a-side (twisted sums at a different Q) is different data.

| Q | conductors, N(c)/Q | R^2, index lambda c | null | b from moduli <= 2e6 | > 2e6 | conjugate conductor | index -e0 c |
|---|---|---|---|---|---|---|---|
| 3750 | 7190, (1.2, 8.0] | 0.424 | 0.183-0.186 | 0.415 | 0.388 | 0.222 | 0.228 |
| 7500 | 5920, (1.2, 4.0] | 0.494 | 0.222 | 0.488 | 0.454 | 0.264 | 0.273 |
| 10607 | 4872, (1.2, 2.83] | 0.546 | 0.271-0.274 | 0.543 | 0.508 | 0.318 | 0.319 |

(The null is 12/n_g; n_g = 67, 55, 45.) The same family of 12 systems is the best at all three; 216 of 216 systems
are above the null maximum at each.

* By norm range at Q = 3750: T = 1.10, 1.22, 1.20, 1.22, 1.38, 1.52, 1.81 for N(c)/Q in (1.2, 1.5] ... (5.5, 8.0], null
  0.99-1.03; per pair (sigma, tau) about 2% to 4.4% of the energy, with no decrease out to N(c)/Q = 8. At Q = 10607:
  1.37, 1.44, 1.61, 1.54 (3.5% to 4.7%). A dual sum of length N(c)/Q would suggest that the share of the s = unit
  term falls as N(c)/Q grows; that is not seen in this range. Not explained.
* Moebius slice (the statistic does not depend on Q, only on the conductor set): j = 2: mean t 0.90, 0.90, 0.93 and
  max 1.71, 1.65, 1.66 for the three sets, against control maxima 2.1 (average) and 2.6-2.9 (largest): random level.
  j = 1: max 4.85 (7190 conductors), 4.09 (5920), 2.89 (4872), each time at the same column (system (1, 1, 0),
  class 8): (t - 1) grows about linearly with the number of conductors, as for a coherent component.

### 4.5 What this does to form (a)

* Its premise (leading dual term at index c s, Ramanujan-sum orientation) has numerical support for s = unit.
* The stratification of leg (b) applies to the dual index n = c s in the same way (Lemma S with n in place of m):
  the squarefree part n (s squarefree and prime to c) is the bulk, and the degenerate strata are again a bounded
  twist. So (a) x (b) reduces to (a) on squarefree n.
* What (a) then asks is a bound for sum_n mu(n) Psi(n) lambda_S(n) rho(n) with lambda_S a divisor-type weight of
  level N(c)/Q. Two facts stand against a quick argument: rho has no Euler product at squarefree indices
  (Kazhdan-Patterson; `sextic-theta-computation.md`: twisted multiplicativity explains at most 4% at products), so
  the Dirichlet series sum mu(n) rho(n) N(n)^{-s} is not a quotient of L-functions and no Type II factorisation of
  rho(ab) is available in the dual form; and by Theorem D a saving is a zero-free statement for the target.
  OPEN. Not tested beyond 4.3.

## 5. Controls

* **Random-phase rows.** Baseline of every entry in section 3 (24 columns per cell); also for the polar share.
  Outcome: after polar removal rho-hat is not distinguishable from them, except for the constant deficits of about 1%
  in the two sparse strata, the small-P effects of item 3 and the F2 maximum in the stratum with max exponent >= 3.
* **Positive control.** The polar term (Theorem P) is found by the optimiser and by the aligned direction in all
  three strata (aligned t 16790, 1023, 103 against 3-4 at Q = 30000).
* **Permutation and planted controls** for section 4: conductors permuted inside groups; a planted component of
  amplitude 0.3 (8% of the energy) on one class is detected (U 17-22 against 12; T 2.7 against 1.0).
* **Function-field model.** Not run. ARGUED: Lemma S and Proposition S2 are formal (multiplicativity of the symbol
  and reciprocity) and hold over F_q[T] with the squarefree stratum of density 1 - 1/q. The saving in
  `r2-ff-tro6-complete` Theorem C comes from Weil's bound for the coefficients of 1/L of the target (the Moebius
  factor), on the range r <= 6d/(6 + eta); stratifying the rows does not touch that step. So in the model the
  per-stratum statement (S) on k = 1 is implied by the same Weil bound and by nothing weaker, in agreement with
  the map (T1). The model therefore gives the same verdict for leg (b).
* **DH, backward heat, sign twist, unimodular twist, zeta(s+a) zeta(s-a), T-NR, Beurling, phase-rotated transfer
  operator, theta^w.** Not engaged: no statement about zeros is made. Lemma S and Proposition S2 hold for arbitrary
  beta_c (they use no Euler product), which is the reason they cannot by themselves give a saving; the statistic of
  section 3 maximises over nu and involves no target. The three requirements (all primes together, uniform in
  height, failing for the controls) would have to be met by a proof of (S) on the squarefree stratum, i.e. by a
  proof of TRO6 itself; the step that uses multiplicativity is the signed sum over c with mu(c) (Lemma L).

## 6. Verdict

* PROVED (elementary) + EXACT: Lemma S. PROVED from hypotheses: Proposition S2.
* MEASURED: l2 shares per stratum (squarefree 93.9% / 94.5%), tail about 0.3 K^{-1/2}; polar share per stratum;
  the row-sensitive statistic with its positive control; no excess of rho-hat over random-phase rows in any stratum
  after polar removal (exponent differences 0.000 +- 0.001, 0.000 +- 0.001, 0.002 +- 0.005 with all primes free).
* Precise obstruction for leg (b): the degeneration of chi_c on squarefull strata is a bounded twist of beta; the
  squarefree stratum is the whole problem up to 5.8% of the Cauchy-Schwarz bound.
* MEASURED (pivot): the leading dual term at index (S-unit) c, R^2 0.49 against 0.22 at Q = 7500, robust to the
  modulus range of the estimator; s = 1 Moebius slice at the random level for the manuscript weight.
* Form (a) is not closed and not advanced to a bound. No eta > 0 proved or measured. No change to 7/8,
  0.874886647 or any Lambda value.

## 7. Three weakest steps

1. **The estimator.** Window conductors lie inside the modulus range of rho-hat (noise share 0.24 of sum
   |rho-hat|^2); the leave-one-out term removes only the diagonal. Random-phase rows scramble the remaining
   estimator structure, so the 1% deficits, the small-P effects and the F2 excess in the sparse stratum may be
   properties of the estimator rather than of theta_6. The table was not extended towards 10^8 (no memory plan was
   needed because no extension was attempted). rho_cor is included in the rows but not in the leave-one-out term.
   Toy geometry only: n = 1, S' empty, shorthand row without the second G, sharp cutoff in m.
2. **The optimiser and its normalisation.** Coordinate ascent reaches local maxima; the two starts differ by 0.4-2% (`band`) and
   3.5-11.5% (`loo`) at P = all. ||B(nu)|| at the optimised nu was not computed, so t_opt is not expressed as a fraction of
   Cauchy-Schwarz and the comparison is only against random-phase rows at the same nu-family. The optimised nu has
   unbounded analytic conductor; the bounded-conductor part of the test is the F1/F2 grid (no joint maximisation
   over (k, v, psi), no continuous refinement in v).
3. **The dual-term measurement.** It is a correlation between finite estimators from one table; the family of
   groups and the regression were fixed after the first scan failed, and the best of 18 distinct systems is quoted
   (the selection effect is small against 0.49 vs 0.22 but not zero). The kernel w~, the constant and the classes
   that enter are not derived, so no quantitative comparison with the sketch is made; N(c)/Q <= 8 only, while the
   rows of the conjecture have N(c)/Q = Q^{0.4}; the three path points share conductors and the b-side; the share
   of the unit term does not fall with N(c)/Q as a dual sum of that length would suggest. The j = 1 Moebius component rests on t = 4.1-4.9 against a
   control maximum of 2.9, on nested conductor sets. Proposition S2's hypothesis (T_tau) is measured, not proved.

## 8. Reproduction and files

All paths under `tmp/research-2026-11-16/push/e2-tro6-signed-csum-stratified/`. Local runs through
`scripts/memcap.sh 8`; server runs through `rhrun` only (units `rh-e2-tro6s-*`, logs copied to `logs/`), reading
`~/rh-push/r2-tro6-nonpolar-scale/out` read-only.

| file | content | run |
|---|---|---|
| `lemma_check.py`, `.log` | exact check of Lemma S | local, 1 min |
| `norms_strata.py`, `.json` | l2 shares by stratum and kernel norm | server, 1 core, 2 min |
| `acc.py` | per-stratum twisted sums S_s(c), 3 variants | server, 4 cores, 8 GB, 53 min |
| `opt.py`, `opt_00..10.json` | statistic, optimiser, F1, F2 | server, 1-2 cores, 8 GB, 33 min in total |
| `tables.py`, `tables.md`, `summ2.py`, `summ2_all.log` | tables | local |
| `dual_test.py`, `dual_reg.py`, `dual_00.json`, `dreg_0*.json` | first scans of the dual term (null) | server, 1 core |
| `dual_coef.py` | theta estimators at all 216 S-unit shifts of c, with split moduli | local, 11 min (Q = 7500); server for Q = 3750, 10607 |
| `dual_full.py`, `dual_probe.py`, `dual_probe2.py`, `dual_mob.py` and logs `*_04`, `*_06`, `*_07` | sections 4.2-4.4 | local (Q = 7500) and server, under 2 min each |

Left in place: on the server `~/rh-push/e2-tro6-signed-csum-stratified/out` (15 GB of per-stratum sums; can be
deleted). Locally `out_local/`, `out_local2/`, `r2in/` and `*.npz` (1.1 GB, listed in `.gitignore`); a clean-up
`rm` of `out_local/` was refused by the shell safety check and was not retried.
