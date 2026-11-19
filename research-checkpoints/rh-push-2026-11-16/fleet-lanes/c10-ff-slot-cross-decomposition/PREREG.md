# PREREG: c10-ff-slot-cross-decomposition

Written 2026-11-19, before any production run of this lane and before any server run. Hashes of the kernel, job
lists and weight list at this time: `logs/prereg_hashes.txt`.
No statement about zeta or about zeros of any number-field L-function is tested. Model computation in F_q[T].

## 0. Disclosure: what had been seen when this file was written

- All energies e = E/D of `c9-mv6-ff-window-exact` (its RESULT.md, `c9_results.json`): the totals are known for every
  configuration of that lane. What is new here is the split of E, not E.
- Split values seen while building and validating the kernel `ffs ens` (local, `scripts/memcap.sh 8`):
  q = 7 (2, 7, 2), six weights (one, a, b, mu, al, r1), all fields; the check configurations of `check_slot_ff.py`
  (q = 7: (2, 3, 1), (2, 3, 2), (2, 4, 1), (2, 4, 2), completed (3, 4, 1), (3, 4, 2)); the first eight output lines of
  q = 7 (3, 6, 1) (weights one, a, b, mu). Timing runs at q = 7 (2, 8, .), (2, 9, .), (2, 7, 3), (3, 7, .) and q = 13
  (2, 5, 2), (2, 6, .), (3, 5, 1) were sent to /dev/null or not read.
- From (2, 7, 2): slot-diagonal part SD/D = 0.998 to 1.001 for the real weights; exact projection B/D = 0.737 (a),
  0.118 (b), 1.002 (one), 36.09 (mu); non-coherent cross -0.50 (a), -0.45 (b), +0.30 (one), -0.10 (mu) in units of D.

## 1. Object and the exact identity (first lemma; checked before this file was written)

Conventions of `ffx.c` / `ffw.c` (copied unchanged). Long marks: lam > N and lam > d, so P never divides A' or m and
the representation A = P A' is unique. Units G_2^(N+lam); all row values are in Z[zeta_6].

    R(m) = sum_{P prime, deg lam} R^P(m),
    R^P(m) = sum_{A' squarefree, deg N} zeta_6^g(P A') u(A') chi_{P A'}(m)
           = zeta_6^c(P) chi_P(m) sum_{A'} u(A') zeta_6^(5 l(A')) xi_P(A') chi_{A'}(m),      xi_P(A') = chi_0(Res(P, A'))^4

(model form of Lemmas S1, S2 of `c9-mv6-window-statement`: the block of the marked prime P is the unmarked row of
length N for the target twisted by the cubic character xi_P, times chi_P(m)). N = 3, completed row (variant 1):
R^P(m) gains Jbar V(m) zeta_6^g(P) chi_P(m), V(m) = sum_{n linear} u(n) chi_n(m)^3 (the definition of c9).

Projection vectors: v_0(m) = 1 and, for d >= 2, v_1(m) = sum_{a in F_q} chi_0(m(a)); the sextic Gauss-sum rows of
round 8 are c_0 = v_0, c_1 = G_1 conj(v_1), and k <= d/2 means k <= 1 for d <= 3. Pi = orthogonal projection onto
their span. For completed rows the span is enlarged by V v_0, V v_1 (reported separately).

    E  = sum_m |R(m)|^2                         D  = diagonal of the row Gram form (c9)
    SD = sum_P sum_m |R^P(m)|^2                 CR = E - SD = sum_{P != P'} sum_m R^P(m) conj(R^P'(m))
    B  = |Pi R|^2 (exact squared signal)        SB = sum_P |Pi R^P|^2
    CRcoh = B - SB,   CRperp = CR - CRcoh,   SDoff = SD - D

    E = D + SDoff + CRperp + CRcoh,         B = SB + CRcoh.          (identity)

Checked in exact integers against an independent brute force from the definitions (python, explicit double sum over
pairs P != P'; `check_slot_ff.py`, `check_slot_ff.log`): q = 7, N = 2: (d, lam) = (1, 3), (2, 3), (1, 4), (2, 4);
N = 3 completed: (1, 4), (2, 4); eight weights each (one, a, b, mu, aligned, random phases, a and mu with slot
signs); every integer equal. c_1 = G_1 conj(v_1) checked against the definition of g_6 (`ffx bfck`): 49 of 49 and
7 of 7 rows. The kernel total E equals the `ffw enw` value of c9 on (2, 7, 2) (six weights).

Normalised quantities: e = E/D, s = SD/D, c = CR/D, beta = B/D, sb = SB/D, c_coh = beta - sb, c_perp = c - c_coh,
n = e - beta.

## 2. Vectors (`wlist.py`)

Probe vectors (Moebius vectors after unfolding): `one` (trivial target), `a`, `b` (q = 7) / `c4` (q = 13).
Liouville-twisted vector: `mu`. Aligned vector: `al`. Seeded classes, 8 seeds each (2 in the runs marked L):
- `U1..U8`: random completely multiplicative signs on A' (kernel mode 6, seeds 31..38): the model's U class; the
  same vector in every block.
- `r1..r8`: independent random sixth roots on every column (P, A') (mode 1, seeds 11..18).
- `a*e1..8`, `mu*e1..8`: target a and mu with an independent random sign eps_P on each marked prime (seeds 1..8).
  Identity: the mean of E over the signs is SD exactly. This is the control that removes the cross term and
  nothing else.

## 3. Configurations (`jobs_mac.txt`, `jobs_srv.txt`, `jobs_opt.txt`)

All have lam > N, lam > d (kernel condition) and N - lam < d < N + lam. Dual length rmax = N + lam - 1 - d + floor(d/2).
Kind F = all 37 weights, L = 13 weights (two seeds per class), M = 5 weights (one, a, mu, r1, a*e1).

| q | N | d | lam (F, local) | lam (server) | below / above 3N |
|---|---|---|---|---|---|
| 7 | 2 | 1 | 3 .. 11 | 12 (L) | rmax = lam: below for lam <= 6, above for lam >= 7 |
| 7 | 2 | 2 | 3 .. 10 | 11 (L); 12 (M, optional) | rmax = lam |
| 7 | 2 | 3 | 4 .. 9 | - | rmax = lam - 1 |
| 7 | 3 | 1 | 4 .. 10 (completed and squarefree) | 11 (L); 12 (M, optional) | rmax = lam + 1: below for lam <= 8 |
| 7 | 3 | 2 | 4 .. 9 | 10 (L) | rmax = lam + 1 |
| 13 | 2 | 1 | 3 .. 7 | 8 (L) | rmax = lam |
| 13 | 2 | 2 | 3 .. 6 | 7 (F) | rmax = lam |
| 13 | 3 | 1 | 4 .. 6 | 7 (L) | rmax = lam + 1: all below 3N = 9 |
| 13 | 3 | 2 | 4, 5 | 6 (L) | all below |

Not planned (size at 4 cores within 3 hours): q = 13 (2, 10, 1), (2, 8, 3), (2, 9, .), (2, 8, 2); q = 13, N = 3 above
3N (lam >= 9); q = 7 (2, 13, .), (2, 10, 3), (2, 11, 3). At q = 13 the only planned configuration above 3N with an active
class is (2, 7, 2) (c9: e = 2.34 for a, 270 for mu). A job that would run past 3 hours is not started; the optional
jobs are run only if the others have finished; a size not run is reported as not run. No size is added after
results are seen.

## 4. Rules (fixed now)

Real vectors = one, a, b / c4, mu and the class U. "Excess configurations" = those with e >= 2 for the vector.

- **Rule A (the excess is the cross term).** |s - 1| <= 0.05 for every real vector in every configuration with
  lam >= 7. Then e - 1 = c up to 0.05.
- **Rule B (Cross = B_coh + O(diagonal)).** -1.05 <= c_perp <= 1.5 for the probe vectors a, b / c4, for mu and for
  the class U in every configuration (squarefree rows). For mu additionally |c/beta - 1| <= 0.1 wherever beta >= 10.
  `one` is reported and not part of the rule (c9: the law misses it).
- **Rule C (the squared signal is carried by pairs of distinct primes).** sb <= 2 dim/q^d (dim = 1 for d = 1, 2
  for d >= 2) for every real vector in every configuration with lam >= 7.
- **Rule D (controls; each ratio is read against its own class).**
  (i) class r: the mean of c over the seeds is within 3 standard errors of 0 (or within 0.02) in at least 90% of
  the F configurations; (ii) classes a*e, mu*e: the mean of e over the seeds is within 3 standard errors of s (or
  within 0.02) in at least 90% of the F configurations; (iii) class U gives the reference for a generic real
  multiplicative vector: target a is "separated from U" in a configuration only if its c_perp lies outside
  [min, max] of the eight seeds by more than the class range max - min. Reported as a count.
- **Outcome.** "EXCESS = COHERENT CROSS" if A, B, C hold for a, b / c4 and mu at both q and D (i), (ii) hold.
  If B fails, the configuration, the vector and the size of c_perp are reported and the term is named.
  If D fails the run is void for the vector class concerned.
- **Completed rows (N = 3, variant 1).** Reported with both spans. Expected and registered: with the span
  {v_0, v_1} rule B FAILS where the cube term is active (c9: (3, 6, .), (3, 8, .), (3, 9, 2) at q = 7; (3, 6, .) at
  q = 13), because V(m) S_0(m) is not in that span; with the enlarged span {v_0, v_1, V v_0, V v_1} the bound
  c_perp <= 1.5 holds for target a.

## 5. Predictions (before the runs)

1. s within 0.01 of 1 for N = 2, lam >= 7, and within 0.05 for N = 3, lam >= 7 (Weil bound for the prime sum of the
   cubic character xi_P(A_1) conj xi_P(A_2); the proved bound is much weaker than this at lam = 7).
2. c_perp in [-1, 0.6] for a, b / c4 in every configuration. Where c9 found e = 0 exactly: c = -s and beta = 0 exactly.
3. q = 7 (2, 12, 1), target a (e = 20.6 known): beta in [18, 21.5] and c_coh/c in [0.9, 1.1].
4. `one` at q = 7 (2, 8, 3) (e = 9.28, law B_coh = 0, left open by c9): exact beta >= 0.75 (e - 1), that is, the
   term the law misses is in the exact squared signal.
5. Slot-sign classes: e within 3/sqrt(q^d) of s in every configuration (the excess of a and mu disappears).
6. Class U behaves as a target with a random Moebius sum: beta spread over the seeds by more than a factor 3 in
   the active configurations; target a not separated from U in c_perp in at least 90% of the configurations.

## 6. Second part (stated now, computed after the model runs)

Question: at what size would the coherent cross term be visible in the Z[omega] float screen of
`c9-mv6-window-statement` (largest THETA ratio 1.007)? Method fixed now: (i) the model law for the ratio
target / Liouville of the coherent cross = squared ratio of the Moebius sums of the two vectors; (ii) the same
ratio computed in Z[omega] for the screen's column weights from the table `tmp/sextic/data` (float; six unit
classes), times the measured ALIGNED / LIOU cross of the screen; (iii) the screen's resolution = the range of the
cross term of its random-phase vector. Visible = predicted coherent cross >= 5 times that resolution.
Also: the split in the model at the screen's geometry (short marks, lam = N/3; patched copy of `ffx en`), where
c8 found the targets at the diagonal.
