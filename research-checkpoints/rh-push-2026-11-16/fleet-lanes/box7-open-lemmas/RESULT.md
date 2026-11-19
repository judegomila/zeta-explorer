# box7-open-lemmas: three unattended computations on the open lemmas of the 7/8 architecture

Internal working note, 2026-11-18 (box clock, UTC). Slug `box7-open-lemmas`. Not refereed. Nothing committed, pushed or posted.
Local runs: every one through `scripts/memcap.sh 8`. Box runs: only through `~/rh-push/bin/rhrun`, GPU 1 only.

Scope. Three ESTIMATE-SYSTEM statements inside the 7/8 zero-free architecture (openai/math manuscript and the
follow-ups; all unrefereed). Nothing here is a statement about zeros. A computation cannot prove any of the three
lemmas; the purpose is to say which of them survive at scales not sampled before, with a control and an error bar at
every scale. Model end points if the lemmas were proved: 31/36 (K-loss), 6/7 (full TRO6-natural), 5/6 (both). RH open.

Labels: MEASURED (float), EXACT (integer arithmetic), PROVED (elementary, checked numerically), OPEN.

Status at the time of writing: the three units are running on the box and are meant to keep running for up to 7 days.
Section 7 lists what was obtained before hand-over (local small scale, and the first box sizes).

---

## 0. One-screen summary

| | lemma under test | statistic | control | unit |
|---|---|---|---|---|
| E1 | Conjecture WLS / K-loss removal and PAIR(l), mark Gram over Z[omega] | SDP(G)/tr G (within 4/pi of the infinity-to-one norm), its ratio to the random control, exponent in Z; pair maximum | random phase per column (same rows, columns, weights); Kubota row with pole as positive control | `rh-b7-e1-kloss-*` |
| E2 | the same statement over F_q[T] ((L*) through the exact sieve identity), exact arithmetic | exact Gram in Z[omega]; SDP/tr against q^(n+a-b) | random sixth roots per column (2 seeds); pole row; squarefree rows only | `rh-b7-e2-ff-*` |
| E3 | TRO6-natural, non-polar remainder at R = Q^1.4 | sup over target families of form / Cauchy-Schwarz, true theta rows against shuffled rows | 11 shuffled-row vectors per pass, same projection | `rh-b7-e3-tro6-*` |

Check: `ssh [compute-server] '~/rh-push/box7-open-lemmas/status.sh'`.

Three findings already present in the small-scale data (section 7), all MEASURED/EXACT at small scale, none a theorem:

1. E1, Z up to 512000 (16 times the previous range): the manuscript row stays at the random level for l = 1/2 and
   l = 2/3; at the model point l = 1/3 it sits at a constant factor 1.09 to 1.11 above the random control, with no
   growth (exponent of the ratio +0.002 +- 0.004 locally; +0.008 +- 0.003 on the box up to Z = 2.048e6).
2. E2, small degrees: over F_q[T] the answer depends on the factor at infinity. The row WITHOUT it (variant A)
   has a coherent direction and its ratio grows: SDP/tr = 2.99, 5.96, 8.98, 14.99, 17.99, 20.99, 29.99, 35.99 at
   q = 7, 13, 19, 31, 37, 43, 61, 73 for (a, b, n) = (2, 2, 2), i.e. (q - 1)/2 (EXACT matrices). The row WITH it
   (variant Ap, the counterpart of conj alpha) stays within a factor 1.9 of the random control in all families with
   a < b and at a = b = 2, but it grows with q at a = b = n = 3 (ratio 1.24, 1.83, 2.62 at q = 7, 13, 19). So (L*) in
   the form "any row with the quadratic twist" is false in the function-field model at these degrees; the form with
   the factor at infinity is not contradicted for l < 1 and is in doubt on the diagonal l = 1.
3. E3: with shuffled rows as the control (66 shuffles at hand-over), the supremum of the true rows over 91,376
   targets is at or below the control at all 11 path points up to Q = 30000 (ratio 0.88 to 1.02); no row-specific
   excess; after maximisation over multiplicative targets the true rows are below the control (z down to -4.7).

---

## 1. Machine rules followed

- Local (Mac): numpy only, single process, `scripts/memcap.sh 8`. Two local runs were killed by the cap during
  development (a symbol batch and a Gauss-sum batch planned too large); both were fixed by reducing the batch, the
  cap was not raised.
- Box: `rhrun` units only, GPU 1 only (wrapper default, `RH_GPU` not set), no `nohup`, no `pkill`. Budget stated for
  this lane: 14 cores, 24 GB. Units: E1 9 GB / 5 cores, E2 7 GB / 4 cores, E3 8 GB / 5 cores.
  CuPy pool limits: 36 / 20 / 26 GB on GPU 1.
- One box unit (E3, first launch) was killed by its own 8 GB memory limit while writing a checkpoint (two
  complex128 arrays were copied to host memory at once). Fix: the arrays are converted to complex64 on the device and
  written one at a time (1.6 GB each). The limit was not raised.
- Every script prints its planned allocation before allocating and exits if the plan exceeds its limit.
- Float32/float64 GPU results are used only as described per experiment: E1 column sums in complex64 are
  re-checked in complex128 on a row sample at every size; E2's exact variants are integer-valued (exact), its one
  non-exact variant is re-checked in float64 on a row sample; E3 reproduces the stored r2 sums at every path point.

---

## 2. E1: K-loss over Z[omega]

### 2.1 Statement tested
Conjecture WLS and its consequence, K-loss removal (n2-kloss-sdp-certificate section 6; reduced model: no cube
completion, one slot, sharp squarefree columns):

    rows     m primary, not divisible by 2, Z^M/4 < N(m) <= Z^M                          (all R rows)
    columns  c = p c', c' squarefree primary prime to 2, 0.1 Z < N(c') <= Z, (p, c') = 1
    marks    primes p with Z^l <= N(p) <= 2 Z^l                                            (n marks)
    x_p(m) = sum_{c'} b_{pc'} chi_{pc'}(m),   b_c = gamma_2(c) conj-alpha(c) N(c)^(-1/2) W(N(c)/Z^(1+l)),   G = (x_p . conj x_p')

    K-loss removal:   sup_{|a_p| <= 1} a* G a  <=  C_eps Z^eps tr G.
    PAIR(l):          |G[p,p']| <= C_eps Z^(eps - l) sqrt(G[p,p] G[p',p'])   for p != p'   (implies the former; PROVED, Gershgorin).

The manuscript's Lemma 14.3 allows the factor Z^(M+l-1). Families run: M = 1, l = 1/3 (the model point of the
31/36 system), l = 1/2, l = 2/3 (the last one while n <= 2600).

### 2.2 Statistic, control, error bar
- SDP(G)/tr G with primal-dual certificate (solver of n2); tr G <= sup <= SDP <= (4/pi) sup. Also n lambda_max/tr,
  lambda_max of the unit-diagonal Gram, Gershgorin sum/tr, and the pair maximum with conjugate pairs (p, pbar)
  excluded (they carry the proved factor sqrt 2).
- Controls in the same run: R = independent random phase per column in place of gamma_2 conj-alpha (generic
  control); K = Kubota row gamma_2 chi^4 without twist (positive control, for Z <= 5e6).
- Error bar: delete-one-group jackknife over 10 random row groups, at every size, for every statistic (SDP itself
  for n <= 400, otherwise scaled from n lambda_max/tr).
- Fit: exponent of SDP/tr in Z for Ap, R, K, and of the ratio Ap/R. Retained fraction of the K-loss exponent:
  theta = exponent(Ap/R) / (M + l - 1).

### 2.3 What supports, what kills
- Supports removal: theta < 1/18 at 2 standard errors and the ratio Ap/R bounded (the model threshold: the 13/15
  infimum does not move unless less than 1/18 of the exponent remains; n1 LP).
- Kills: theta > 1/18 at 2 standard errors, i.e. power growth of Ap against the control. The K column shows what
  growth looks like in the same functional (exponent 0.27, 0.50, 0.63 for l = 1/3, 1/2, 2/3).
- PAIR(l): supported if the pair maximum decays at least like Z^(-l). At l = 1/3 a term of exactly this size is
  present by construction (columns divisible by p and p'), so the decisive quantity is pair_max * Z^l staying bounded.

### 2.4 Fixes relative to the lane
- The referee's E2 (4 to 6 marks at the model point): the ladder reaches about 55 marks at l = 1/3 and 880 at
  l = 1/2 at Z = 6.5e7.
- The comparison is with the random control and with n, not with Z^(M+l-1) alone.
- Row count is complete (no sampling) up to Z = 6.5536e7; the last rung (9.27e7) uses a 25% random row sample and is
  flagged `rowfrac` in the results.

### 2.5 Code and validation
`e1/e1_kloss.py`. Exact reformulations of the lane's `gram.py`: vectorised sextic symbols (GPU kernel), cubic Gauss
sums of primes from two cubic exponential sums (S(t) = -1 + 2 Re(conj chi(t) g)), cubic reciprocity for the pair
factors, breadth-first enumeration of the squarefree cofactors, row blocks and column chunks.
`e1/e1_test.py` (local and on the box GPU): the Gram matrices of variants Ap and K equal the lane's stored matrices
entrywise (5 cases, maximum relative difference 1e-13 local, 1.5e-14 on the GPU path); Gauss-sum shortcut against the
direct sum on 660 primes: 8.5e-13; g^3 = -alpha(p) to 2.6e-12.
Above Z = 1.3e5 the column sums are complex64; re-check in complex128 on 24 rows at every size: 9e-7 to 1.9e-6.

---

## 3. E2: the same question over F_q[T], exact

### 3.1 Statement tested
(L*) of n1 / the hypothesis of Lemma B of n3-ff-cubic-sieve-rational-deflation for the marked rows. q = 1 mod 6
prime, monic polynomials, chi_c(m) = chi0(Res(c, m)) sextic, e(y/c) from the coefficient of T^(deg c - 1):

    rows     all monic m of degree n                                  (complete sum, R = q^n)
    columns  c = p c', c' squarefree monic of degree b, (p, c') = 1
    marks    all monic primes p of degree a                           (N marks)
    x_p(m) = sum_{c'} gamma_2(p c') chi_{p c'}(m)^k,     G = (x_p . conj x_p')

    FF-(L*):  sup_{|a_p| <= 1} a* G a <= C tr G  with C independent of q^(n+a-b).

Dictionary: Z = q^b, l = a/b, M = n/b, K-loss factor Z^(M+l-1) = q^(n+a-b). By Lemma A (sextic form) the column
Gram H[c, c'] = sum_m chi_c(m) conj chi_c'(m) equals q^(n-m)[(q-1) sum_{deg r <= k0} - sum_{deg r = k0+1}] of the
Gauss-twisted dual, k0 = 2 deg c - 2 - n, so FF-(L*) is the statement that the marked coefficient vectors have a
flat Gauss-twisted dual sum up to conductor degree k0. For n = b the dual side is longer than the direct side
(k0 = 2a + b - 2), so the production run computes the direct side; the identity is used as an exact check
(`e2_test.py` T3: 144 cases, defect 1e-14) and as the interpretation of the result.

### 3.2 Exactness
gamma_2(c) = (-u)^(deg c) mu(c) zeta_6^(g(c)), u = G_1(chi0^2)/sqrt q (Hasse-Davenport for prime moduli, twisted
multiplicativity, cubic reciprocity). Checked against brute-force Gauss sums on all 2540 squarefree moduli of
degree <= 3 for q = 7, 13 (8.7e-15). All columns have one degree, so the constant drops out and G has entries in
Z[omega]. The products are integer matrix products held in float32/float64 with every partial sum below 2^24 / 2^53
(exact), accumulated in int64, Hermitian symmetry asserted in Z[omega]. `e2_test.py` T2: exact Gram against
brute-force x_p(m) with brute-force Gauss sums, 6 configurations, agreement to rounding of the brute force (1e-15).
Variants: A (k = 1, quadratic twist, no factor at infinity; EXACT), Asf (A on squarefree rows; EXACT), K (k = 4, pole
control; EXACT, small sizes), R1, R2 (random sixth roots per column; EXACT), Ap (A times conj lambda(c),
lambda(c) = e_q(c_1) the Hecke character at infinity, counterpart of conj alpha; values in Z[zeta_3q], computed with
float32 products and re-checked in float64 on 32 rows per size, deviation about 1e-6; MEASURED, not exact).
SDP/tr and eigenvalues are float64 computations from the exact matrices.

### 3.3 What supports, what kills
- Kills FF-(L*) for a variant: SDP/tr over the random control grows like a positive power of q^(n+a-b) along a
  family (fixed (a, b, n) in q, or fixed q in the degrees). This is already the case for variant A at small degree.
- Supports: ratio bounded along both aspects. Variant Ap is the manuscript-type row; its table is the result.
- Because single-degree sums are exact, a pattern in the residues of (a, b, n) is expected; the pooled exponent in
  `status.sh` is a summary, the table is the result.

### 3.4 Sizes
100 sizes in `e2/sizes.txt`, sorted by estimated cost at run time: q = 7 (b up to 9), 13 (b up to 7), 19 (b up to 6),
31 (b up to 5), marks degree a = 1..5 while N <= 3500; n = b, plus 20 sizes with n = b +- 1; q = 37, 43, 61, 73 at small
degree for the q-aspect. Queue protection: a size whose memory plan exceeds its limit is logged as "size not run" and
the queue continues; the sizes with a host plan above 4 GB run last, smallest plan first: (19, 1, 6) 4.6 GB,
(7, 1, 9) 5.6 GB. (13, 1, 7) has a host plan of 7.0 GB against `--host-gb 6` and will be refused (not run) unless
the unit is relaunched with more memory, which was not done. Run order of the last sizes: ..., (13, 3, 6), (31, 1, 5),
(31, 2, 5), (19, 1, 6), (7, 1, 9).

---

## 4. E3: TRO6-natural, non-polar remainder at the manuscript geometry

### 4.1 Statement tested
TRO6-natural(eta) for the n = 1 part of manuscript-type rows beta = alpha nu at R = Q^1.4, S' empty:

    |sum_m rho_sigma(-e0 m) B_m(nu)|  <=  C Q^(-eta/80) ||rho_sigma|| ||B(nu)||,     B_m(nu) = sum_c nu(c) alpha(c) gamma_2(c) w_R(c) chi_c(m),

for the admissible targets nu, after the polar part is removed. In conductor form the left side is
sum_c nu(c) x_sigma(c), x_sigma(c) = alpha gamma_2 w_R(c) y_sigma(c), y_sigma(c) = sum_m rho_sigma(m) chi_c(m).
Input data (read-only): the estimator rho-hat of r2-tro6-nonpolar-scale (cutoff 1e7, generic half rows N(m) <= 30000,
11 path points Q = 938..30000) and its exact Gauss-sum table.

### 4.2 Fix of the referee's E1 (row-blind statistic)
The statistic of r3 was a property of the conductor-side frame. Here every statistic is computed for the true rows
and, in the same pass and with the same code path, for K = 11 SHUFFLED row vectors: the 12-vector rho(m) of each
generic half row is given to another row of the same bin and stratum. Marginals and all norms are identical; the
arithmetic link between rho(m) and chi_c(m) is destroyed. Only a difference between the true rows and the shuffled
rows is information about theta_6.
- Polar law: variant `loo` (exact leave-one-out self-term only) and `band` (the component along the polar phase
  pred(c) = gamma_1(c) conj chi_c(-e0) removed exactly on each (class of c, norm shell) cell). The same projection
  is applied to the shuffled rows, which gives the projection baseline the referee asked for (E3). Theorem P's
  closed-form amplitude is not used: it is proved for N(c) <= Q^(1/2-delta) and for the limit coefficient, and the
  stored estimator differs from it by factors up to 3.6 (r2-tro6-polar-theorem section 5).
- Row-sensitive statistics (per path point, true against shuffled): sup over F1 (73,016 non-principal Dirichlet
  characters modulo the 160 split primes of norm <= 997) and F2 (18,360 twists alpha^k N^{iv}) of the correlation
  against Cauchy-Schwarz; the same supremum normalised by each row vector's own conductor-side energy; and r_opt,
  the value after coordinate ascent over completely multiplicative targets with free phases at the 165 primes of
  norm <= 1000 (the referee's section 3).
- Validation at every path point of pass 0: the recomputed twisted sums of the true rows equal the stored r2
  values (differences 7e-7 to 2.4e-6, single-precision snapshots).

### 4.3 What supports, what kills, and what cannot be decided
- Kills (eta = 0 sharp): a row-specific excess of the true rows over the shuffled rows that does not decay with Q.
- Supports: true rows indistinguishable from shuffled rows at every Q, both decaying like Q^(-1/2). Then the form
  is below the TRO6 threshold Q^(-eta/80) for every eta <= 1 on these families, by the factor printed by `status.sh`.
- Not decidable at Q <= 30000: eta = 0 with a constant below the control noise. `status.sh` prints the 95% bound
  a95 on a row-specific coherent component and the Q needed: the slope of a component of size a is resolved to
  0.006 (half of eta = 1) over a factor 32 in Q once a^2 >= 32.6 sd(r_ctrl^2), which scales like 1/Q.
- Reach in Q: 30000 is the limit of the exact table (conductors up to 5 Q^1.4 <= 1e7). Q = 1e5 needs the table to
  5e7 (prime Gauss sums: about 7e13 terms) and new estimator rows; not attempted. The 7 days are spent on shuffles:
  1500 passes, 16,500 shuffled vectors per path point.

---

## 5. Units, commands, check, stop, resume

All on the box in `~/rh-push/box7-open-lemmas/`:

    ./status.sh                 # per experiment: sizes done, current size, fitted exponent with error bar, verdict so far
    cat units.txt               # experiment, unit name, launch time
    ./launch.sh [e1|e2|e3|all]  # (re)launch through rhrun; does nothing for an experiment whose unit is active
    systemctl --user stop <unit>          # stop one unit (never pkill)
    tail -f ~/rh-push/logs/<unit>.log

Exact launch commands (inside `launch.sh`):

    rhrun b7-e1-kloss 9 5 -- env E_GPU_GB=36 python e1/e1_kloss.py --Z "$(cat e1/ladder.txt)" --nmax 2600 --rowfrac 9e7:0.25 --out e1/out
    rhrun b7-e2-ff    7 4 -- env E_GPU_GB=20 python e2/e2_ff.py --sizes "<e2/sizes.txt joined by ;>" --out e2/out
    rhrun b7-e3-tro6  8 5 -- env E_GPU_GB=26 python e3/e3_tro6.py --out e3/out

Resumption: results are append-only JSON lines (`e*/out/results.jsonl`); a finished size (E1, E2) or pass (E3) is
skipped on relaunch. Inside a size E1 and E2 write `ck_*.npz` every 10 minutes (Gram accumulators and the next row
index); E3 writes its accumulators after bins 7, 8, 9 of a pass. `./launch.sh` after a stop, a crash or a reboot
continues from there. Copy results back with
`rsync -a [compute-server]:rh-push/box7-open-lemmas/e*/out/results.jsonl ...` (the `gauss_cache.npz`,
`Ecache_*.dat` and `ck_*` files are caches).

### 5.1 Units at hand-over (do not stop; they are meant to run for up to 7 days)

| experiment | unit | launched (UTC, box clock) |
|---|---|---|
| E1 | `rh-b7-e1-kloss-1118065725` | 2026-11-18 06:57:25 |
| E2 | `rh-b7-e2-ff-1118071213` | 2026-11-18 07:12:13 |
| E3 | `rh-b7-e3-tro6-1118070133` | 2026-11-18 07:01:33 |

First launches: E1 and E2 at 06:39:46, E3 at 06:38:42. The current units are the relaunches made during the
stop/relaunch tests below; they continue the same `results.jsonl` files.

### 5.2 Verification done

- Progress. E1: 12 sizes (36 result lines, Z = 1000 .. 2.048e6) in the first 22 minutes, then the size 4.096e6.
  E2: 49 sizes in the first 25 minutes. E3: one pass (11 path points) per 2.5 to 6 minutes. State at hand-over:
  at 07:23:11 UTC all three units `active`; E1 at Z = 4.096e6, 29% of the rows at the
  10-minute checkpoint (434 rows/s, checkpoint file 2.9 GB written 07:14); E2 74 sizes done, working on (7, 3, 7, 7);
  E3 in pass 5 (64 result lines). rh.slice 13 GB; GPU 1 at 48 GB, 99%.
- Stop / relaunch, E1 (06:55 and 06:57): stopped while the statistics of Z = 2.048e6 were being computed (rows
  complete, 2 of 3 families written). Relaunch: `resumed from checkpoint: row 464316 of 464316, 249s already spent`,
  the two written families were not repeated, the third was written, and the run went on to 4.096e6. (The first
  relaunch showed a defect: a size with some families written was treated as complete. Fixed: a size is skipped
  only after its completion marker; families already written are not repeated. Tested locally by deleting one
  family line and the marker.)
- Stop / relaunch, E2 (06:55, 07:02 and 07:12; the last one to install the queue protection of section 3.4): 43 finished sizes skipped; the size in progress (q = 61, (2, 2, 2))
  `resumed from checkpoint: row 3721 of 3721` and was completed.
- Stop / relaunch, E3 (07:01): stopped 2 s after `pass 2: checkpoint after bin 8`; relaunch:
  `pass 2: resumed from the checkpoint after bin 8`; point 9 of pass 2 gave the true-row value 0.01286, identical
  to passes 0 and 1 (the true rows are deterministic; the shuffles are seeded by the pass number). An earlier
  stop between checkpoints restarted the pass from its beginning with identical values. The same test was run
  locally (numpy) with identical results before and after resumption.
- Failures found and fixed during the launch (all before the units listed above):
  E3 `cupyx.scatter_add` does not accept complex input (real and imaginary parts are now added separately);
  E3 killed by its 8 GB memory limit while writing a checkpoint (now complex64, one array at a time);
  E3 device pool limit reached by a 3.25 GB temporary in the row accumulation (now added in column slices);
  E1/E2 SDP stopping rule too slow for N > 1000 (now one eigen-decomposition per round; values equal to the
  lane's stored SDP values to 6 digits, gap <= 5e-9, on 15 stored matrices).

---

## 6. Expected runtime, with the measurements behind it

All box figures were measured with the three units sharing GPU 1 (and the slice with one other lane).

**E1** (`e1/ladder.txt`: Z = 1000 x 2^k, k = 0..16, then 9.2682e7 with a 25% row sample).
Cost model, confirmed by the profile (`E_PROF=1`): the stacked product (n marks) x (0.25 Z cofactors) x (0.227 Z rows)
dominates; symbols 1e10 evaluations/s, exponent sums 5e10 pairs/s.

| Z | marks n (l = 1/3, 1/2, 2/3) | rows | local numpy, 1 process | box, rows part | status |
|---|---|---|---|---|---|
| 64000 | 10, 41, 201 | 14518 | 7 s | 1 s | done |
| 128000 | 10, 55, 309 | 29026 | 33 s | 6 s (complex128) | done |
| 256000 | 13, 74, 453 | 58037 | 205 s | 2 s | done |
| 512000 | 15, 99, 697 | 116092 | 1463 s, peak RSS 4.7 GB | 9 s | done |
| 1.024e6 | 21, 139, 1047 | 232174 | not run | 54 s | done |
| 2.048e6 | 24, 191, 1588 | 464316 | not run | 249 s + about 3 min statistics | done |
| 4.096e6 | 27, 251, 2427 | 928632 | | 36 min (measured rate 434 rows/s, 3.7e12 complex multiply-adds/s) + statistics | running at hand-over; est. 08:00 UTC |
| 8.192e6 | about 30, 350 (l = 2/3 above the cap n <= 2600; K dropped) | 1.86e6 | | est. 20 min | est. 08:15 UTC Nov 18 |
| 1.6384e7 | about 37, 480 | 3.7e6 | | est. 2 h | est. 10:30 UTC Nov 18 |
| 3.2768e7 | about 45, 630 | 7.4e6 | | est. 10 h | est. 21:00 UTC Nov 18 |
| 6.5536e7 | about 55, 880 | 1.49e7 | | est. 2 to 2.5 days | est. Nov 21 |
| 9.2682e7 (25% rows) | about 60, 1050 | 5.3e6 of 2.1e7 | | est. 1.5 days | est. Nov 22-23 |

Estimates beyond 4.096e6 are extrapolations of the measured 2.048e6 time by (n Z^2 x variants); the log prints
the measured rate and ETA at every checkpoint. Memory: device plan printed per size (20 to 32 GB at the top, limit
36 GB); host peak about 70 bytes x Z (4.6 GB at 6.5536e7, 6.5 GB at 9.2682e7; the script refuses a size whose plan
exceeds `--host-gb 7`). Before the stacked complex64 product the same sizes took 50 s (256000) and 250 s (512000)
on the box; the complex128 gemm was 97% of the time.

**E2** (100 sizes, cost-sorted). Local numpy: 26 sizes up to (q, a, b) = (13, 2, 4) in 63 s, peak RSS 1.2 GB.
Box, after the fused kernels: (19, 2, 4, 4) 2 s; (7, 1, 7, 7) 14 s (was 115 s); (31, 1, 4, 4) 31 s for 8.3e11
(cofactor, row) pairs. Rates: exponent kernel 8e10 pairs/s, products about 6.6e-13 s per pair per mark, symbols
about 4e10/s. The statistics (SDP on N x N, CPU) take about 2 minutes for N = 1830 and dominate the small sizes.

| size (q, a, b) | pairs Cn x R | marks | estimate |
|---|---|---|---|
| all sizes with q^b <= 1e6 (about 80 sizes) | <= 1e12 | <= 3360 | first 2 to 4 hours |
| (7, 1..3, 8), (13, 1..3, 6), (19, 1..3, 5) | 2.8e13, 2.1e13, 5.7e12 | up to 2286 | 0.5 to 8 h each; all by about Nov 19 |
| (31, 1, 5) | 7.9e14 | 31 | 8 to 16 h; est. done Nov 19-20 |
| (31, 2, 5) | 7.9e14 | 465 | about 3 days; est. done Nov 23 |
| (19, 1, 6) | 2.2e15 | 19 | about 16 h; est. Nov 24 |
| (7, 1, 9) | 1.4e15 | 7 | about 10 h; est. Nov 24-25 (may fall outside the 7 days) |
| (13, 1, 7) | 3.9e15 | 13 | refused by the host memory plan (7.0 GB > 6 GB); not run |

**E3.** Local (numpy, the small r2-format data set generated with `scale.py 1000 3 1`): one pass with K = 2, 3 path
points, 83 to 108 s, peak RSS 7.0 GB. Box: exponent cache 144 s (once); one pass (11 path points, true rows + 11
shuffles, 91,376 targets + the optimiser) 2.5 minutes when the GPU is free, 5 to 6 minutes while E1 runs its
largest products. 2500 passes are scheduled (27,500 shuffled vectors per path point); at 7 days the run is simply
stopped or left to finish. Device peak planned 23 GB, host about 4 GB.

---

## 7. Results obtained before hand-over

All numbers below are MEASURED (E1, E3) or EXACT matrices with float statistics (E2 variants A, Asf, K, R).
Local results are stored in `local/`; the box results are the first hours of the unattended run (`status.sh`
output at hand-over, 2026-11-18 about 07:25 UTC, reproduced verbatim).

### 7.1 E1

Local (Mac, numpy, `memcap 8`): Z = 1000 .. 512000, all rows, three families, file `local/e1_results_local.jsonl`.
The box run repeats these sizes (same rows, columns and marks; an independent random control) and continues.
SDP/tr at the model point l = 1/3 (local): manuscript row 1.147, 1.285, 1.141, 1.146, 1.139, 1.075, 1.150, 1.127,
1.130, 1.108 for Z = 1000 .. 512000; random control 1.131 .. 1.017; pole control 1.95 .. 10.1.

    E1  K-loss over Z[omega] (mark Gram, infinity-to-one norm against trace)      unit rh-b7-e1-kloss-1118065725: active
        current: [    1051s]   rows 269516/928632 (29.0%), 434.1 rows/s, ETA 0.42 h [checkpoint]
      family (M, l) = (1, 0.3333); K-loss exponent M + l - 1 = 0.3333; sizes done: 12 (Z = 1000 .. 2.048e+06)
           Z        n       R    SDP/tr Ap (se)     random (se)     pole K      MP    Ap/random   pair_max Ap  *Z^l   Gersh/tr
            1000     4      226    1.1467 (0.0357)   1.2288 (0.0744)     1.951  1.2838    0.9332    3.882e-02  0.388    1.194
            2000     5      454    1.2850 (0.0573)   1.1343 (0.0600)     2.476  1.2209    1.1328    1.040e-01  1.310    1.330
            4000     5      904    1.1412 (0.0100)   1.0660 (0.0316)     2.556  1.1543    1.0705    6.176e-02  0.980    1.165
            8000     5     1813    1.1458 (0.0191)   1.0670 (0.0195)     2.739  1.1078    1.0738    6.202e-02  1.240    1.174
           16000     6     3625    1.1393 (0.0123)   1.0423 (0.0124)     3.397  1.0830    1.0930    4.795e-02  1.208    1.146
           32000     6     7249    1.0750 (0.0137)   1.0385 (0.0105)     3.554  1.0584    1.0352    2.590e-02  0.822    1.080
           64000    10    14518    1.1499 (0.0044)   1.0426 (0.0079)     5.761  1.0532    1.1029    2.469e-02  0.987    1.159
          128000    10    29026    1.1273 (0.0083)   1.0277 (0.0056)     6.309  1.0375    1.0969    2.135e-02  1.076    1.133
          256000    13    58037    1.1302 (0.0052)   1.0209 (0.0022)     8.629  1.0302    1.1071    1.853e-02  1.176    1.135
          512000    15   116092    1.1080 (0.0029)   1.0149 (0.0024)    10.149  1.0229    1.0917    1.241e-02  0.992    1.112
         1024000    21   232174    1.1449 (0.0023)   1.0143 (0.0014)    14.765  1.0191    1.1287    1.331e-02  1.341    1.148
         2048000    24   464316    1.1298 (0.0011)   1.0113 (0.0014)    17.638  1.0144    1.1171    8.743e-03  1.110    1.132
        exponent of SDP/tr in Z: Ap -0.0011 +- 0.0026; random control -0.0061 +- 0.0011; independent-vector value MP -0.0280; Ap/random +0.0076 +- 0.0031
        positive control (pole row K): exponent +0.2927 +- 0.0170 (the functional detects growth when present)
        PAIR(l): pair maximum ~ Z^(-0.2757 +- 0.0379); PAIR(l) asks for exponent <= -0.3333: undecided; Gershgorin sum/tr ~ Z^(-0.0119 +- 0.0052)
        VERDICT (l = 0.3333): SUPPORTS removal of the loss at the tested scales (retained fraction +0.023 +- 0.009 < 1/18 at 2 se)  [fraction = exponent of Ap/random divided by M + l - 1]
      family (M, l) = (1, 0.5000); K-loss exponent M + l - 1 = 0.5000; sizes done: 12 (Z = 1000 .. 2.048e+06)
           Z        n       R    SDP/tr Ap (se)     random (se)     pole K      MP    Ap/random   pair_max Ap  *Z^l   Gersh/tr
            1000     6      226    1.2664 (0.0430)   1.2065 (0.0566)     2.242  1.3524    1.0496    1.566e-01  4.951    1.368
            2000     8      454    1.2107 (0.0533)   1.1820 (0.0255)     2.734  1.2831    1.0243    8.854e-02  3.959    1.351
            4000    13      904    1.1904 (0.0342)   1.1530 (0.0342)     5.034  1.2542    1.0324    6.766e-02  4.279    1.368
            8000    17     1813    1.2100 (0.0302)   1.1449 (0.0178)     6.868  1.2030    1.0569    4.858e-02  4.345    1.385
           16000    24     3625    1.1865 (0.0166)   1.1320 (0.0123)     9.971  1.1694    1.0481    4.308e-02  5.449    1.394
           32000    31     7249    1.1411 (0.0153)   1.1025 (0.0054)    13.255  1.1351    1.0350    3.143e-02  5.622    1.333
           64000    41    14518    1.1196 (0.0088)   1.0960 (0.0051)    18.113  1.1091    1.0215    2.153e-02  5.446    1.303
          128000    55    29026    1.1154 (0.0044)   1.0774 (0.0060)    25.320  1.0890    1.0352    1.868e-02  6.684    1.291
          256000    74    58037    1.1096 (0.0044)   1.0635 (0.0027)    35.434  1.0727    1.0434    1.114e-02  5.637    1.284
          512000    99   116092    1.1050 (0.0035)   1.0504 (0.0018)    49.890  1.0593    1.0520    8.371e-03  5.990    1.275
         1024000   139   232174    1.0984 (0.0021)   1.0433 (0.0008)    73.147  1.0495    1.0528    5.822e-03  5.891    1.265
         2048000   191   464316    1.0923 (0.0015)   1.0372 (0.0005)   105.875  1.0410    1.0531    4.844e-03  6.933    1.259
        exponent of SDP/tr in Z: Ap -0.0099 +- 0.0014; random control -0.0134 +- 0.0011; independent-vector value MP -0.0337; Ap/random +0.0043 +- 0.0012
        positive control (pole row K): exponent +0.5012 +- 0.0088 (the functional detects growth when present)
        PAIR(l): pair maximum ~ Z^(-0.4419 +- 0.0122); PAIR(l) asks for exponent <= -0.5000: violated at these scales; Gershgorin sum/tr ~ Z^(-0.0133 +- 0.0021)
        VERDICT (l = 0.5000): SUPPORTS removal of the loss at the tested scales (retained fraction +0.009 +- 0.002 < 1/18 at 2 se)  [fraction = exponent of Ap/random divided by M + l - 1]
      family (M, l) = (1, 0.6667); K-loss exponent M + l - 1 = 0.6667; sizes done: 12 (Z = 1000 .. 2.048e+06)
           Z        n       R    SDP/tr Ap (se)     random (se)     pole K      MP    Ap/random   pair_max Ap  *Z^l   Gersh/tr
            1000    21      226    1.5524 (0.0457)   1.5295 (0.0683)     5.283  1.7026    1.0150    1.563e-01 15.632    2.224
            2000    27      454    1.4450 (0.0416)   1.4178 (0.0350)     5.895  1.5472    1.0192    1.073e-01 17.041    2.070
            4000    41      904    1.3691 (0.0190)   1.3714 (0.0200)     9.989  1.4713    0.9983    7.829e-02 19.733    2.128
            8000    61     1813    1.3346 (0.0160)   1.3395 (0.0154)    15.395  1.4005    0.9963    6.918e-02 27.681    2.253
           16000    89     3625    1.2960 (0.0051)   1.2901 (0.0091)    22.669  1.3379    1.0046    4.553e-02 28.919    2.297
           32000   139     7249    1.2694 (0.0112)   1.2588 (0.0051)    37.427  1.2961    1.0084    3.203e-02 32.292    2.437
           64000   201    14518    1.2314 (0.0055)   1.2233 (0.0024)    57.593  1.2492    1.0066    2.645e-02 42.332    2.472
          128000   309    29026    1.2007 (0.0031)   1.2011 (0.0018)    93.784  1.2170    0.9996    1.807e-02 45.906    2.594
          256000   453    58037    1.1746 (0.0044)   1.1736 (0.0033)   146.561  1.1845    1.0009    1.379e-02 55.609    2.657
          512000   697   116092    1.1538 (0.0041)   1.1518 (0.0038)   239.843  1.1610    1.0017    9.553e-03 61.167    2.800
         1024000  1047   232174    1.1327 (0.0019)   1.1323 (0.0017)   380.194  1.1388    1.0003    6.963e-03 70.772    2.913
         2048000  1588   464316    1.1159 (0.0013)   1.1151 (0.0014)   606.332  1.1204    1.0007    4.985e-03 80.437    3.050
        exponent of SDP/tr in Z: Ap -0.0298 +- 0.0012; random control -0.0282 +- 0.0009; independent-vector value MP -0.0513; Ap/random -0.0006 +- 0.0008
        positive control (pole row K): exponent +0.6451 +- 0.0114 (the functional detects growth when present)
        PAIR(l): pair maximum ~ Z^(-0.4453 +- 0.0071); PAIR(l) asks for exponent <= -0.6667: violated at these scales; Gershgorin sum/tr ~ Z^(+0.0488 +- 0.0038)
        VERDICT (l = 0.6667): SUPPORTS removal of the loss at the tested scales (retained fraction -0.001 +- 0.001 < 1/18 at 2 se)  [fraction = exponent of Ap/random divided by M + l - 1]

Reading (MEASURED, reduced model, Z <= 2.048e6 at hand-over):
- l = 2/3: manuscript row = random control to 0.1% at every Z (ratio 1.0003 to 1.0017 for Z >= 128000).
- l = 1/2: ratio 1.035 to 1.053, exponent +0.004 +- 0.001: a small positive drift, about 1% of the K-loss exponent.
  Whether it saturates is what the sizes 8e6 to 6.5e7 decide (n = 350 to 880 marks).
- l = 1/3 (model point): ratio 1.09 to 1.13 with 10 to 24 marks, exponent +0.008 +- 0.003 (2% of the K-loss
  exponent, threshold 5.6%). The pair maximum times Z^(1/3) stays between 0.8 and 1.3: the pairs are at the size
  of the common-column term, which PAIR(1/3) allows. Not yet decisive: the mark count is still small.
- l >= 1/2: the pair maximum decays like Z^(-0.44), slower than Z^(-l): PAIR(l) is not the route there (as the lane
  found), while SDP/tr stays flat: the signs of the entries matter.
- Pole control K: exponents 0.29, 0.50, 0.65 at l = 1/3, 1/2, 2/3.

### 7.2 E2

Local: 26 sizes (file `local/e2_results_local.jsonl`, variants A, Asf, Ap, R1). Box at hand-over:

    E2  K-loss over F_q[T], exact Gram in Z[omega] (rows deg n, cofactors deg b, marks deg a)      unit rh-b7-e2-ff-1118071213: active
        current: [     648s] q=7 (a,b,n)=(3,7,7): rows R=823543, cofactors Cn=705894 (max depth 7), marks N=112, primes(deg<=7)=141280, variants ['A', 'Asf', 'Ap', 'K', 'R1', 'R2'], row block 10617, column chunk 23547
      sizes done: 74
         q  a  b  n     marks      rows   Kfac=q^(n+a-b)   A (exact)   A sqfree rows   Ap (ang. factor)   K (pole)   random mean (sd)    MP     A/rnd   Ap/rnd
         7  1  2  2         7        49              7      1.0194      1.0522          1.2183          3.889    1.4535 (0.0287)   1.899    0.701    0.838
         7  1  3  2         7        49              1      1.6623      2.4615          1.7032          5.492    1.5521 (0.0856)   1.899    1.071    1.097
         7  1  3  3         7       343              7      1.9454      2.1343          1.6998          5.586    1.1725 (0.0395)   1.306    1.659    1.450
         7  1  3  4         7      2401             49      1.3653      1.3192          1.5612          3.627    1.0987 (0.0247)   1.111    1.243    1.421
         7  1  4  3         7       343              1      1.0663      1.0647          1.5769          1.671    1.2232 (0.0052)   1.306    0.872    1.289
         7  1  4  4         7      2401              7      3.1597      3.2031          1.7345          5.732    1.0811 (0.0096)   1.111    2.923    1.604
         7  1  4  5         7     16807             49      1.3990      1.4174          1.6616          5.616    1.0334 (0.0030)   1.041    1.354    1.608
         7  1  5  4         7      2401              1      5.4401      4.9041          1.4983          6.277    1.0865 (0.0256)   1.111    5.007    1.379
         7  1  5  5         7     16807              7      1.6096      1.6009          1.6487          2.005    1.0307 (0.0042)   1.041    1.562    1.600
         7  1  5  6         7    117649             49      1.6977      1.6899          1.6522          5.606    1.0142 (0.0001)   1.015    1.674    1.629
         7  1  6  6         7    117649              7      2.3357      2.1410          1.6637          6.180    1.0101 (0.0001)   1.015    2.312    1.647
         7  1  7  7         7    823543              7      1.8506      1.8905          1.6575          6.203    1.0036 (0.0003)   1.006    1.844    1.652
         7  2  2  2        21        49             49      2.9924      3.0892          2.5534         14.359    2.2340 (0.1258)   2.738    1.339    1.143
         7  2  3  3        21       343             49      3.4778      3.9461          1.4282          4.193    1.3938 (0.0331)   1.556    2.495    1.025
         7  2  4  3        21       343              7      1.4045      1.4409          1.6769         18.054    1.4196 (0.0193)   1.556    0.989    1.181
         7  2  4  4        21      2401             49      3.6870      1.4505          1.3209         17.586    1.1529 (0.0000)   1.196    3.198    1.146
         7  2  4  5        21     16807            343      1.3510      1.4095          1.4225          4.006    1.0568 (0.0037)   1.072    1.278    1.346
         7  2  5  4        21      2401              7      2.9718      3.3142          1.5237          1.082    1.1477 (0.0060)   1.196    2.589    1.328
         7  2  5  5        21     16807             49      1.0782      1.0540          1.3793         17.672    1.0569 (0.0022)   1.072    1.020    1.305
         7  2  5  6        21    117649            343      1.0510      1.0322          1.3912         17.806    1.0230 (0.0007)   1.027    1.027    1.360
         7  2  6  5        21     16807              7      2.3822      2.5276          1.3257         20.076    1.0551 (0.0011)   1.072    2.258    1.256
         7  2  6  6        21    117649             49      1.4760      1.5537          1.3843          1.067    1.0203 (0.0005)   1.027    1.447    1.357
         7  2  6  7        21    823543            343      1.5847      1.6000          1.3913         17.740    1.0086 (0.0005)   1.010    1.571    1.379
         7  2  7  7        21    823543             49      1.4815      1.5071          1.3822         20.093    1.0082 (0.0002)   1.010    1.469    1.371
         7  3  3  3       112       343            343      3.6023      3.6479          2.8213         84.595    2.2757 (0.0563)   2.469    1.583    1.240
         7  3  4  4       112      2401            343      1.6479      1.6653          1.4883          2.672    1.4207 (0.0120)   1.479    1.160    1.048
         7  3  5  4       112      2401             49     13.6932     12.6154          2.3417         95.399    1.4160 (0.0014)   1.479    9.671    1.654
         7  3  5  5       112     16807            343      3.8817      4.2984          1.2878         95.428    1.1544 (0.0023)   1.170    3.363    1.116
         7  3  5  6       112    117649           2401      1.2789      1.2724          1.2956          1.291    1.0573 (0.0013)   1.063    1.210    1.225
         7  3  6  6       112    117649            343      3.7277      3.7870          1.3065         95.422    1.0556 (0.0005)   1.063    3.531    1.238
         7  4  4  4       588      2401           2401     11.3099     11.1509          2.2078        447.460    2.1504 (0.0009)   2.235    5.259    1.027
         7  4  5  5       588     16807           2401      4.9634      5.1426          2.1514          3.305    1.3853 (0.0001)   1.409    3.583    1.553
         7  4  6  6       588    117649           2401     14.3971     15.4650          1.2453        502.004    1.1393 (0.0001)   1.146   12.637    1.093
        13  1  2  2        13       169             13      1.0616      1.0693          1.7259          6.524    1.5147 (0.0351)   1.632    0.701    1.139
        13  1  3  2        13       169              1      3.4589      5.0938          1.8043         11.254    1.4454 (0.0215)   1.632    2.393    1.248
        13  1  3  3        13      2197             13      1.7310      1.8553          1.6677         11.351    1.1481 (0.0415)   1.160    1.508    1.453
        13  1  3  4        13     28561            169      1.6636      1.6172          1.7807          6.446    1.0409 (0.0034)   1.043    1.598    1.711
        13  1  4  3        13      2197              1      1.0547      1.0549          1.7124          1.382    1.1165 (0.0005)   1.160    0.945    1.534
        13  1  4  4        13     28561             13      4.0277      3.8057          1.8067         11.449    1.0329 (0.0001)   1.043    3.899    1.749
        13  1  4  5        13    371293            169      1.5890      1.6034          1.7964         11.382    1.0128 (0.0006)   1.012    1.569    1.774
        13  1  5  5        13    371293             13      1.7107      1.7154          1.7991          2.054    1.0098 (0.0003)   1.012    1.694    1.782
        13  2  2  2        78       169            169      5.9631      6.0033          2.7690         65.423    2.4829 (0.0123)   2.820    2.402    1.115
        13  2  3  3        78      2197            169      7.0286      7.5625          1.4234          7.336    1.3554 (0.0053)   1.412    5.186    1.050
        13  2  4  3        78      2197             13      1.2808      1.3698          1.8945         71.990    1.3543 (0.0020)   1.412    0.946    1.399
        13  2  4  4        78     28561            169      6.5198      1.1425          1.4220         71.512    1.0927 (0.0026)   1.107    5.967    1.301
        13  2  4  5        78    371293           2197      1.7180      1.7721          1.4461          7.200    1.0261 (0.0009)   1.029    1.674    1.409
        13  2  5  5        78    371293            169      1.0177      1.0235          1.4556         71.573    1.0256 (0.0000)   1.029    0.992    1.419
        13  3  3  3       728      2197           2197      5.4953      5.4827          4.3659        626.733    2.3825 (0.0040)   2.483    2.307    1.833
        13  3  4  4       728     28561           2197      1.6481      1.6545          1.4637          4.770    1.3262 (0.0007)   1.345    1.243    1.104
        19  1  2  2        19       361             19      1.0446      1.0478          1.9415          9.424    1.4092 (0.0412)   1.511    0.741    1.378
        19  1  3  3        19      6859             19      1.4542      1.5277          1.7886         17.249    1.0853 (0.0000)   1.108    1.340    1.648
        19  1  4  4        19    130321             19      4.4142      4.0113          1.8603         17.324    1.0190 (0.0013)   1.024    4.332    1.826
        19  2  2  2       171       361            361      8.9811      9.0091          2.8749        152.447    2.6413 (0.0782)   2.850    3.400    1.088
        19  2  3  3       171      6859            361     10.0137     10.5389          1.5878         10.428    1.3066 (0.0026)   1.341    7.664    1.215
        19  2  4  4       171    130321            361      9.3731      1.1054          1.4294        161.497    1.0663 (0.0006)   1.074    8.790    1.340
        19  3  3  3      2280      6859           6859      7.2906      7.2395          6.3391       2056.267    2.4243 (0.0024)   2.486    3.007    2.615
        31  1  2  2        31       961             31      1.0294      1.0305          1.8735         15.351    1.2924 (0.0147)   1.391    0.796    1.450
        31  1  3  3        31     29791             31      1.2997      1.3427          1.8787         29.156    1.0537 (0.0004)   1.066    1.233    1.783
        31  1  4  4        31    923521             31      4.6829      4.0761          1.9209         29.209    1.0097 (0.0002)   1.012    4.638    1.903
        31  2  2  2       465       961            961     14.9864     15.0033          2.8368        434.468    2.7270 (0.0068)   2.875    5.496    1.040
        31  2  3  3       465     29791            961     15.9988     16.5141          1.5107         16.240    1.2484 (0.0003)   1.265   12.816    1.210
        37  1  2  2        37      1369             37      1.0253      1.0261          1.9458         18.333    1.2854 (0.0017)   1.356    0.798    1.514
        37  1  3  3        37     50653             37      1.2446      1.2792          1.9020         35.132    1.0455 (0.0039)   1.055    1.190    1.819
        37  2  2  2       666      1369           1369     17.9879     18.0018          2.8194        629.473    2.7518 (0.0125)   2.881    6.537    1.025
        37  2  3  3       666     50653           1369     18.9702     19.4824          1.4954         19.468    1.2286 (0.0006)   1.242   15.440    1.217
        43  1  2  2        43      1849             43      1.0222      1.0228          1.9295         21.321    1.2645 (0.0052)   1.328    0.808    1.526
        43  1  3  3        43     79507             43      1.2140      1.2425          1.9309         41.114    1.0391 (0.0004)   1.047    1.168    1.858
        43  2  2  2       903      1849           1849     20.9900     21.0018          2.8293        860.477    2.7608 (0.0002)   2.886    7.603    1.025
        61  1  2  2        61      3721             61      1.0158      1.0161          2.0312         30.299    1.2314 (0.0061)   1.272    0.825    1.650
        61  1  3  3        61    226981             61      1.1475      1.1664          1.9211         59.081    1.0285 (0.0009)   1.033    1.116    1.868
        61  2  2  2      1830      3721           3721     29.9929     30.0012          3.0555       1769.484    2.8020 (0.0029)   2.894   10.704    1.090
        73  1  2  2        73      5329             73      1.0132      1.0134          2.0095         36.291    1.2140 (0.0084)   1.248    0.835    1.655
        73  1  3  3        73    389017             73      1.1249      1.1406          1.9560         71.068    1.0243 (0.0011)   1.028    1.098    1.910
        73  2  2  2      2628      5329           5329     35.9940     36.0010          2.8771       2555.486    2.8154 (0.0002)   2.898   12.785    1.022
      retained fraction of the K-loss exponent = exponent of (value / random control) in Kfac = Z^(M+l-1):
        n = b, all (q, a, b); manuscript-type row with the factor at infinity: Ap/random ~ Kfac^(-0.0515 +- 0.0143) over 54 sizes; max ratio 2.615
        n = b >= 2a + 1; manuscript-type row with the factor at infinity: Ap/random ~ Kfac^(-0.0201 +- 0.0305) over 20 sizes; max ratio 1.910
        n = b, all (q, a, b); row without the factor at infinity: A/random ~ Kfac^(+0.2565 +- 0.0495) over 54 sizes; max ratio 15.440
        n = b >= 2a + 1; row without the factor at infinity: A/random ~ Kfac^(-0.2916 +- 0.1062) over 20 sizes; max ratio 4.638
        n = b, all (q, a, b); A, squarefree rows only: Asf/random ~ Kfac^(+0.2550 +- 0.0495) over 54 sizes; max ratio 15.857
        n = b >= 2a + 1; A, squarefree rows only: Asf/random ~ Kfac^(-0.2798 +- 0.0963) over 20 sizes; max ratio 4.037
        q = 7, degree aspect, Ap: Ap/random ~ Kfac^(-0.0487 +- 0.0164) over 19 sizes; max ratio 1.652
        q = 13, degree aspect, Ap: Ap/random ~ Kfac^(-0.0367 +- 0.0393) over 10 sizes; max ratio 1.833
        q = 19, degree aspect, Ap: Ap/random ~ Kfac^(+0.0445 +- 0.0517) over 7 sizes; max ratio 2.615
        q = 31, degree aspect, Ap: Ap/random ~ Kfac^(-0.1249 +- 0.0333) over 5 sizes; max ratio 1.903
        q = 37, degree aspect, Ap: Ap/random ~ Kfac^(-0.1097 +- 0.0349) over 4 sizes; max ratio 1.819
        q = 43, degree aspect, Ap: Ap/random ~ Kfac^(-0.1320 +- 0.0454) over 3 sizes; max ratio 1.858
        q = 61, degree aspect, Ap: Ap/random ~ Kfac^(-0.1158 +- 0.0262) over 3 sizes; max ratio 1.868
        q = 73, degree aspect, Ap: Ap/random ~ Kfac^(-0.1291 +- 0.0288) over 3 sizes; max ratio 1.910
        VERDICT (Ap, n = b, all sizes pooled): SUPPORTS removal of the loss at the tested scales (retained fraction -0.052 +- 0.014 < 1/18 at 2 se)
        VERDICT (A, n = b, all sizes pooled): KILLS removal (retained fraction +0.256 +- 0.050 > 1/18 at 2 se)
        note: exact single-degree sums; the table, not the pooled exponent, is the result when the pattern depends on (a, b, n) residues

Reading (EXACT matrices for A, Asf, K, R; Ap float; small degrees only):
- Variant A (quadratic twist, no factor at infinity) is NOT flat. At (a, b, n) = (2, 2, 2): SDP/tr = 2.992, 5.963,
  8.981, 14.986, 17.988, 20.990, 29.993 for q = 7, 13, 19, 31, 37, 43, 61, i.e. (q - 1)/2 to within 0.01, against
  2.2 to 2.9 for the random control. The top eigenvector has entries of equal modulus (the affine group
  T -> uT + v permutes the marks), so SDP/tr = n lambda_max/tr exactly in these cases. At (2, 3, 3): 3.48, 7.03,
  10.01 (q = 7, 13, 19). The excess is carried by squarefree rows at (2, 3, 3) and by non-squarefree rows at
  (2, 4, 4) (column Asf: 1.45 and 1.14 there), and it is absent at (2, 5, 5) (1.078) and (1, 2, 2).
- Variant Ap (with the character at infinity) removes that growth in every family with a < b computed so far and at
  a = b = 2: (2, 2, 2) gives 2.55 to 3.06 for q = 7 .. 73 against 2.23 to 2.82 for the random control (ratio 1.02
  to 1.14); (2, 3, 3) ratio 1.03 to 1.22; a = 1 tends to about 2.0 against 1.0 to 1.2 (ratio up to 1.91, bounded in q
  and in the degree at q = 7).
- Exception found at hand-over: at a = b = n = 3 the row Ap GROWS with q: 2.82, 4.37, 6.34 for q = 7, 13, 19 against
  2.28, 2.38, 2.42 (ratio 1.24, 1.83, 2.62; three points, exponent about 0.25 in q^3). At (7, 4, 4, 4) the ratio is 1.03.
  So with this choice of character at infinity (e_q(c_1)) the function-field statement is not flat on the diagonal
  a = b = 3. Whether this is a degree-3 effect of the cubic theta series, or disappears with a character of higher
  conductor at infinity, is not decided here; the long run adds (7, 5, 5, 5), (7, 5, 6, 6) and the (a, b) = (3, 4..8) rows.
- Consequence for the lemma: over F_q[T] the flat-sieve statement fails for the row with the quadratic twist alone,
  at many degrees, with exact values; a proof of (L*) over F_q[T] has to use the factor at infinity, and for l = 1
  even that is in doubt. Over Z[omega] the alpha-free row was flat at Z <= 32000 (referee of n2), so the two models
  differ on this point. The pooled exponents printed by `status.sh` average over families with different behaviour.

### 7.3 E3

Local: small r2-format data set (Q <= 1000, 1755 half rows, K = 2 shuffles): r_sup true 0.076, 0.066, 0.055 against
shuffled 0.086, 0.068, 0.056 at Q = 500, 707, 1000; validation against the stored sums 3.8e-7. Box at hand-over:

    E3  TRO6-natural, non-polar remainder at R = Q^1.4: true theta rows against shuffled rows      unit rh-b7-e3-tro6-1118070133: active
        current: [    1287s] pass 5 point 6 Q=7500: rows 8s, stats 49s; band/all: r_sup(F1+F2) true 0.02183, shuffled mean 0.02314; t_opt true 92.9, shuffled 83.6
      path points done: 11 (Q = 938 .. 30000); passes with data: 6; shuffled-row controls per point: up to 66
      r_sup = sup over F1 and F2 of |form| / Cauchy-Schwarz (polar part projected out, all rows)
            Q      true      shuffled mean    sd      n    true/shuffled    z
           938  0.059416   0.064665   0.003270    66      0.919      -1.61
          1326  0.050948   0.054894   0.002219    66      0.928      -1.78
          1875  0.044273   0.046600   0.001895    66      0.950      -1.23
          2652  0.034179   0.039074   0.001671    66      0.875      -2.93
          3750  0.030995   0.032753   0.001409    66      0.946      -1.25
          5303  0.025274   0.027590   0.001182    66      0.916      -1.96
          7500  0.021834   0.023553   0.000982    66      0.927      -1.75
         10607  0.018549   0.019694   0.000929    55      0.942      -1.23
         15000  0.015188   0.016501   0.000567    55      0.920      -2.32
         21213  0.012855   0.013816   0.000526    55      0.930      -1.83
         30000  0.011731   0.011528   0.000505    55      1.018      +0.40
        decay exponent delta in r ~ Q^-delta: true 0.4827; shuffled 0.4964 (sd of one shuffle 0.0124, n = 55); difference -0.0137 +- 0.0124; nominal eta = 80 delta = 38.6 (eta = 1 is delta = 0.0125)
        row-specific coherent component at Q = 30000: a <= 0.00531 of Cauchy-Schwarz (95%); TRO6-natural threshold Q^(-eta/80) at eta = 1: 0.879
        separation of eta = 0 from eta > 0 needs a component whose slope is resolved to 0.006 over a factor 32 in Q: a >= 0.01967 at Q = 30000 (a_min ~ Q^-1/2); a component of size 0.01 needs Q >= 1.16e+05, size 0.001 needs Q >= 1.16e
        VERDICT: true rows indistinguishable from shuffled rows (max |z| = 2.93); remainder at the control level: SUPPORTS TRO6-natural on the tested families with margin 75x at eta = 1; eta = 0 with a constant below 0.00531 is NOT ex
      sqrt(t_sup): the same supremum normalised by each row vector's own conductor-side energy (removes the polar-energy offset)
            Q      true      shuffled mean    sd      n    true/shuffled    z
           938  3.763827   3.804956   0.195712    66      0.989      -0.21
          1326  3.650903   3.772712   0.143791    66      0.968      -0.85
          1875  3.748159   3.789396   0.153620    66      0.989      -0.27
          2652  3.473875   3.795639   0.161633    66      0.915      -1.99
          3750  3.736550   3.788985   0.163934    66      0.986      -0.32
          5303  3.595958   3.782892   0.164084    66      0.951      -1.14
          7500  3.672467   3.828751   0.159175    66      0.959      -0.98
         10607  3.702540   3.797137   0.179666    55      0.975      -0.53
         15000  3.602320   3.794528   0.131154    55      0.949      -1.47
         21213  3.643268   3.787782   0.144809    55      0.962      -1.00
         30000  3.931491   3.754543   0.165576    55      1.047      +1.07
        decay exponent delta in r ~ Q^-delta: true -0.0053; shuffled 0.0002 (sd of one shuffle 0.0123, n = 55); difference -0.0055 +- 0.0123; nominal eta = 80 delta = -0.4 (eta = 1 is delta = 0.0125)
      r_opt = same after maximisation over multiplicative targets with free phases at small primes
            Q      true      shuffled mean    sd      n    true/shuffled    z
           938  0.141961   0.151647   0.002752    66      0.936      -3.52
          1326  0.125441   0.128881   0.002438    66      0.973      -1.41
          1875  0.107212   0.109867   0.001967    66      0.976      -1.35
          2652  0.085435   0.092428   0.001696    66      0.924      -4.12
          3750  0.075809   0.078210   0.001311    66      0.969      -1.83
          5303  0.065922   0.066310   0.000986    66      0.994      -0.39
          7500  0.057090   0.056376   0.000946    66      1.013      +0.75
         10607  0.045399   0.048004   0.000955    55      0.946      -2.73
         15000  0.038145   0.040517   0.000690    55      0.941      -3.44
         21213  0.031460   0.034080   0.000555    55      0.923      -4.72
         30000  0.027219   0.028527   0.000527    55      0.954      -2.48
        decay exponent delta in r ~ Q^-delta: true 0.4837; shuffled 0.4801 (sd of one shuffle 0.0062, n = 55); difference +0.0036 +- 0.0062; nominal eta = 80 delta = 38.7 (eta = 1 is delta = 0.0125)
      r_rms over F1 (row-blind by the referee's E1; sanity line)
            Q      true      shuffled mean    sd      n    true/shuffled    z
           938  0.016190   0.016931   0.000056    66      0.956     -13.31
          1326  0.014010   0.014531   0.000035    66      0.964     -15.01
          1875  0.011818   0.012291   0.000024    66      0.962     -19.86
          2652  0.009837   0.010291   0.000017    66      0.956     -26.25
          3750  0.008275   0.008640   0.000010    66      0.958     -35.80
          5303  0.007027   0.007292   0.000008    66      0.964     -34.55
          7500  0.005921   0.006150   0.000006    66      0.963     -36.87
         10607  0.004996   0.005189   0.000005    55      0.963     -37.83
         15000  0.004192   0.004348   0.000003    55      0.964     -49.11
         21213  0.003527   0.003647   0.000002    55      0.967     -55.19
         30000  0.002981   0.003070   0.000002    55      0.971     -42.65
        decay exponent delta in r ~ Q^-delta: true 0.4925; shuffled 0.4956 (sd of one shuffle 0.0007, n = 55); difference -0.0030 +- 0.0007; nominal eta = 80 delta = 39.4 (eta = 1 is delta = 0.0125)
        validation: recomputed twisted sums of the true rows against the stored r2 values: max difference 4.03e-06
        polar share of the conductor-side energy (true rows, all): 0.187 0.173 0.169 0.156 0.145 0.139 0.129 0.123 0.117 0.113 0.108; shuffled rows (projection baseline): 0.0317 0.0195 0.0123 0.0081 0.0053 0.0035 0.0024 0.0017 0.0012 

Reading (MEASURED, estimator rows, Q <= 30000):
- The supremum over 91,376 targets of the true rows is at or below the shuffled rows at every path point
  (ratio 0.88 to 1.01); the same after normalising by the conductor-side energy (0.92 to 1.04). No row-specific
  excess. Both decay like Q^(-0.48 .. -0.50).
- After maximisation over multiplicative targets (165 free prime phases) the true rows are BELOW the shuffled
  rows at most path points (z down to -5): the row-specific structure that exists is a deficit, not an excess.
- The polar share of the true rows (0.187 -> 0.108) and the projection baseline of the shuffled rows
  (0.032 -> 0.0006) reproduce the r3 values and the referee's baseline.
- This supports TRO6-natural on these families only in the sense of 4.3: no coherent row-specific component above
  about 0.005 of Cauchy-Schwarz at Q = 30000. It does not separate eta = 0 from eta > 0.

---

## 8. Controls and walls

- No statement about zeros, no positivity statement: Davenport-Heilbronn, backward heat and the sign twist have
  nothing to act on (as in the lanes these experiments continue). The statements are mean-value / norm statements
  consumed on the low side of the 7/8 system; MV-CAP is not engaged. No RH or GRH is used.
- E1 and E2 measure operator-norm type quantities on finite matrices; E3 measures correlations on an estimator.
  A bounded ratio at tested scales does not prove the lemma; a growing ratio against the control at tested
  scales does not disprove it either, but it marks the statement as one not to spend proof effort on in that form.

## 9. Three weakest steps

1. **E1 is a reduced model.** No cube completion, one slot, sharp squarefree columns, no cusp sectors or ray
   characters; a loss carried by any of these is invisible (same caveat as the lane). The 4/pi gap between SDP
   and the true supremum is a constant and does not affect exponents. At the top rung the rows are a 25% sample.
2. **E2 is a different arithmetic.** Single-degree complete sums over F_q[T] show exact degeneracies that have no
   counterpart with smooth weights over Z[omega] (the alpha-free row A is flat over Z[omega] at Z <= 32000 by the
   lane's referee, and not flat over F_q[T] at small degree). Which of the two the manuscript's completed rows
   resemble is not established. The variant Ap uses one choice of character at infinity (e_q(c_1)) and is not exact.
   Exactness of A, K, R rests on the Gauss-sum formula, verified by brute force for degree <= 3 at q = 7, 13 and by
   the Gram comparison for degree <= 4, not proved here for all degrees (the ingredients are classical).
3. **E3 measures an estimator at Q <= 30000.** rho-hat has noise share 0.17 to 0.37 and its conductors lie inside its
   own range; the leave-one-out correction is applied to the true rows only (the shuffled rows have no self term).
   The families are bounded (conductor <= 997, |k| <= 30, |v| <= 295, 165 free prime phases). Targets tied to zeros
   near the 7/8 line are not sampled. The experiment can show a row-specific excess if one exists above the control
   noise; it cannot establish eta > 0.

## 10. Files

`common/kstats.py` (SDP solver, Gram statistics, weighted fit) · `e1/e1_kloss.py`, `e1/e1_test.py`, `e1/ladder.txt`,
`e1/ref/` (five reference Gram matrices of the n2 lane) · `e2/e2_ff.py`, `e2/e2_test.py`, `e2/sizes.txt` ·
`e3/e3_tro6.py`, `e3/sx/` (copies of `alib.py`, `zomega.py`, `rows_nat.py`) · `status.py`, `status.sh`, `launch.sh` ·
`local/` (results of the local small-scale runs).
