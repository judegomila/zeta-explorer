## 5. Decisive test (server, through rhrun; ball arithmetic)

Method. `wil.py`: the criterion of Theorem 3 and its extension above the Nyquist band, in python-flint balls (512 bits; 1024 to 8192 bits where the smaller precision did not decide). A verdict "pass" means that every pivot of an LDL factorisation of the real symmetric form of R K R + R is a ball certified positive; "fail" means that a pivot is certified negative. Both are rigorous for the synthetic set as defined by the stored floating-point data. Thresholds are found by bisection in the offset (9 to 16 steps); bisection assumes that the passing offsets form an interval, which is not proved. `selftest.py`: the closed form of Theorem 2 (c) to 9 digits; agreement of the criterion with the sign of the smallest eigenvalue of a direct discretisation in 20 cases (u/Lg = 0.67, 1.22, 2.22; with and without tolerance, removed and added on-line points); the fast evaluation of the matrix entries against the direct one (difference below 1e-149).

### 5.1 Test A: scale-free clusters against a tight background (u = 1, A = u b, background c u)

One pair: threshold 2.838446380, 2.177318985, 0.763400798 for c = 2, 1, 0.1; closed form of Theorem 2 (c): the same nine digits. (The value 2.9788 written in `PREDICTIONS.md` for c = 2 was an arithmetic slip; the registered formula gives 2.8384.)

Rows of n pairs, spacing 2 pi/kappa (kappa = 1 is the Nyquist spacing), offsets A cos^(2p) (p = 0: equal offsets). Largest passing A:

| n | 1 | 2 | 4 | 8 | 16 | 24 | 32 | 40 | 48 | 60 |
|---|---|---|---|---|---|---|---|---|---|---|
| c = 2, kappa = 2, cos^2 | 2.84 | 3.56 | 4.57 | 6.03 | 9.38 | 12.86 | 16.38 | 19.93 | 23.47 | 28.83 |
| c = 1, kappa = 2, cos^2 | 2.18 | 3.01 | 4.30 | 5.84 | 9.23 | 12.74 | 16.28 | 19.83 | 23.39 | 28.73 |
| c = 0.01, kappa = 2, cos^2 | 0.24 | 0.42 | 2.07 | 4.31 | 8.37 | 12.16 | 15.86 | 19.51 | 23.16 | 28.58 |
| c = 1, kappa = 1.5, cos^2 | | 2.70 | 3.77 | 4.93 | 7.49 | 9.93 | 12.37 | 14.81 | 17.22 | 20.86 |
| c = 1, kappa = 3, cos^2 | | 2.16 | 3.16 | 4.34 | 6.68 | 9.01 | 11.36 | 13.72 | 16.09 | 19.64 |
| c = 1, kappa = 2, equal offsets | | 3.01 | 3.05 | 3.15 | 3.17 | 3.17 | 3.17 | 3.18 | 3.17 | 3.17 |
| c = 1, kappa = 1 (Nyquist), cos^2 | | 1.90 | 2.14 | 2.21 | 2.20 | 2.19 | 2.17 | 2.18 | 2.16 | 2.16 |

(All 16 values of n, kappa in {1, 1.25, 1.5, 2, 3}, p in {0, 1, 2}: `tables.txt`.) At kappa = 2 the increments between n = 40 and n = 60 are 0.445 per pair for c = 2 and c = 1 and 0.454 for c = 0.01: A*(n) = 0.445 n + 2.1 in this family, independent of the background to the first order. This is the law n = 2.2 A of c16 section 4.5, now for the complete device and with the exact criterion. Rows of equal offsets do not grow with n. Rows at the Nyquist spacing itself (kappa = 1) do not grow either: the taper needs room in the band.

Shape-optimised small clusters (`testA2.py`: symmetric positions and relative offsets, Nelder-Mead from three starts, each shape tested rigorously), c = 1: A = 3.35, 5.11, 6.10, 6.21, 7.33, 7.64 for n = 2, 3, 4, 5, 6, 8 (A/n = 1.67, 1.70, 1.52, 1.24, 1.22, 0.96); c = 0.01: 0.85, 2.26, 3.20, 4.55, 5.53, 5.73. These are lower bounds for the supremum over configurations; the local search does not certify an optimum.

Sharpness of the constant. Corollary T' excludes u b_max > 5.85 n + logarithms. Attained: 1.7 n at n = 3, 0.96 n at n = 8, 0.445 n + 2.1 for n = 40 to 60 in one family. The constant of the linear law lies between 0.445 and 5.85; the factor 13 between them is OPEN. Linear growth in n from both sides is established (upper side relative to Turan's theorem).

### 5.2 Test C: one pair in the pure lattice model (Lg = 18.885, the value at 1e9)

theta' = 0.5 and 0.9, M = 0 and 1: thresholds 0.300603, 0.311548, 0.133645, 0.139072, equal to the exact law of Theorem 2 (d) to the six digits printed, at a lattice midpoint, at a lattice point, and with the lattice point removed. (The three positions agree identically for a reason: an on-line zero at the abscissa of the pair is even about it and the negative direction sinh(bs) is odd.)
theta' > 1 (thresholds: midpoint; lattice point), against the proved interval of Theorem 4 (b):

| theta' | M | passes below (proved) | measured, lattice point | measured, midpoint | excluded above at a midpoint (proved) |
|---|---|---|---|---|---|
| 1.07 | 1 | 0.03759 | 0.05724 | 0.11768 | 0.29067 |
| 1.07 | 1e-2 | 0.003813 | 0.006502 | 0.08511 | 0.12643 |
| 1.07 | 1e-4 | 0.000381 | 0.000651 | 0.01582 | 0.02230 |
| 1.5 | 1 | 0.02274 | 0.02401 | 0.05840 | 0.08670 |
| 1.5 | 1e-2 | 0.002297 | 0.002437 | 0.008386 | 0.01186 |
| 1.5 | 1e-4 | 0.000230 | 0.000244 | 0.000844 | 0.001194 |
| 2.2 | 1 | 0.01284 | 0.01348 | 0.01684 | 0.03046 |
| 2.2 | 1e-2 | 0.001293 | 0.001362 | 0.001745 | 0.003209 |
| 2.2 | 1e-4 | 0.000129 | 0.000136 | 0.000175 | 0.000321 |

All inside the proved interval. For small M the thresholds scale like sqrt(M) (factor 9.9 to 10.0 between M = 1e-2 and 1e-4 at theta' = 1.5 and 2.2) and tend to 0 with M: Theorem 4 (a). A pair at a lattice point is detected almost as if there were no background (within 6 percent of the lower bound at theta' >= 1.5).

### 5.3 Test B: clusters on zeta's ordinates near 1e6, 1e9, 1e12, theta in {1/2, 1, 2}

Synthetic set: zeta's ordinates in [T - H, T + H] (H = 45, 30, 22: 172, 179, 181 ordinates), the lattice of spacing 2 pi/log(T/2 pi) outside, tolerance M. Ordinates at 1e6 and 1e9: the files of c16 (differences from mpmath at most 3.6e-7). Ordinates at 1e12: `zeros12.py` (the method of c16; 246 ordinates in [T - 30, T + 30] against 246.31 expected); they are resolved to the spacing of float64 at 1e12, 1.2e-4 (the spot check against mpmath is 1.2e-4), that is 0.05 percent of the mean spacing. The set under test is the stored one. M = 0 is run only below the Nyquist band; above it every finite cluster fails at M = 0 (Theorem 4 (a) for the lattice exterior).

One pair (15 positions each: at an ordinate with the on-line zero kept, and at a midpoint between consecutive ordinates). Largest passing offset b:

@@TABLE_ONE@@

Readings.
- theta = 1/2 (below the Nyquist band). The median threshold at an ordinate is 0.90 to 0.91 of the exact lattice law at the three heights, at a midpoint 0.95 to 0.99; the extremes over the 30 positions are within 0.80 and 1.10 of it (M = 0; with M = 1 the medians are 0.92 to 0.93). In the scale-free variable the median is u b = 2.46, 2.49, 2.50 at 1e6, 1e9, 1e12 (lattice: 2.69, 2.74, 2.77). The one-pair constant of Theorem 2 is attained on zeta's ordinates to about 10 percent at all three heights (MEASURED); the exact law is PROVED for the lattice at every height.
- theta = 2 (above it), M = 1: the median at an ordinate is 1.05, 1.08, 1.08 times sqrt(12 M) u^(-3/2), and no threshold is below the proved passing bound. The thresholds are 0.30, 0.25, 0.22 of the c15 region c_theta/L: the reach scales like (log T)^(-3/2), not (log T)^(-1). At midpoints the largest thresholds (0.073, 0.047, 0.033) are above the lattice-model exclusion bound for a lattice midpoint (0.052, 0.031, 0.021): zeta's ordinates are not the lattice and a pair in a long gap is less visible. Prediction B2 was wrong in this respect, and its sizes (computed with u - Lg) were too large by a factor 2 to 3.
- theta = 1 (theta' = 1.15, 1.10, 1.07): medians 0.094, 0.071, 0.044 at an ordinate, about 0.4 to 0.5 of the c15 region.
- Against the Fejer-translate device of c16 (its section 4.1, M = 0 and 1): one-pair medians there 0.474 and 0.317 at theta = 1/2 (1e6, 1e9) and 0.169 to 0.199 and 0.128 to 0.135 at theta = 1; the complete device gives 0.356 and 0.240, and 0.094 and 0.071. The complete device excludes more, as it must (Theorem 1).

Clusters of n pairs. Modes: on consecutive ordinates with the on-line zeros kept (added); count preserved (pairs on every second ordinate, both ordinates removed); rows with free positions centred at T. Largest passing value of the deepest offset (cap 0.4999; "<1e-4": fails at the smallest offset tested, 1e-4; 0.000 stands for a threshold between 1e-4 and 5e-4):

@@TABLE_CLUSTERS@@

(All n in {1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 40, 60}: `tables.txt`. Undecided cells: @@UND@@. The cells with n >= 24 that 512 bits did not decide were decided by a fill pass at 2048 and 4096 bits.)

Readings.
1. Clusters placed on zeta's ordinates do not hide deeper as n grows, at any theta: the threshold stays within a factor 1.5 of the one-pair value for every n up to 60 and shows no growth with n (equal offsets, theta = 2: 0.025 to 0.015 at 1e6, 0.014 to 0.009 at 1e9, 0.009 to 0.005 at 1e12 for n from 1 to 60). Prediction B4 holds.
2. Count-preserving replacement on zeta's ordinates at theta = 1/2 (theta' = 0.58, 0.55, 0.54), M = 0: 0.284, 0.196, 0.125 for one pair; 0.025, 0.036, 0.041 for 12 pairs; 0.001, 0.010, 0.015 for 24 pairs; below 1e-4 at n = 40 (1e6) and n = 60 (1e9), and below 5e-4 at n = 60 (1e12), against the c15 region 0.53, 0.36, 0.27. With M = 1 the thresholds level off (0.103, 0.059, 0.035 at n = 60). This is the configuration type of zeta(s+a) zeta(s-a) restricted to a window. Reading by the count of section 2.2: replacing 2n on-line zeros by n pairs opens a gap of length L = 2n/density in the on-line set; the tests concentrated in the gap span about uL/2 pi = 2 n theta' dimensions and the cluster has n positive directions, so for theta' > 1/2 and n large some test in the gap sees a non-positive form whatever the offsets are (ARGUED; the measured thresholds tend to 0 with n as this predicts). For theta' <= 1/2 exact lattice rows of the full density are invisible (Theorem 6). So theta' = 1/2, that is P = sqrt(t/2 pi), is the threshold for count-preserving configurations: PROVED on the passing side for rows, MEASURED and ARGUED on the excluding side. The Fejer-translate device of c16 (section 4.4, lattice-placed rows) passed 0.30 to 0.35 at this theta.
3. Rows with free positions (spacing pi/u, cos^2 offsets) pass with a deepest offset growing linearly in n at every height and every theta: at theta = 2 the value at n = 16 is 0.329, 0.219, 0.164, that is u b = 9.09, 9.08, 9.06 at 1e6, 1e9, 1e12; at n = 24: u b = 12.65, 12.68, 12.60; at n = 32: 16.2, 16.1 (1e9, 1e12; cap at 1e6); at n = 40: 19.7, 19.7. Test A (c = 0.01 to 1) gives 8.4 to 9.2, 12.2 to 12.7, 15.9 to 16.3, 19.5 to 19.8: the scale-free law of section 5.1 is reproduced on zeta's ordinates at the three heights, with the same increment 0.44 per pair. At theta = 1/2 the cap 0.4999 is reached from n = 2, 6, 12 on. The slope in b is 0.44/u to 0.57/u per pair, not 1/(2 (u - Lg)) as registered in B3.
4. Such a row has 2u/pi zeros per unit length: 4 theta' times the density of zeta's zeros (9 times at theta = 2). The passing rows are exactly the configurations with a local density of off-line pairs above u/2 pi, as in (W4).

Sharpness, all-heights form. PROVED for every height: the frame (Theorem 1), the one-pair law against a tight or lattice background (Theorems 2, 3), the transition and the two-sided one-pair bounds above it (Theorem 4), rows (Theorem 6). MEASURED at the three heights: the same constants on zeta's ordinates (one pair: 0.90 to 0.99 of the lattice law in the median below the Nyquist band; 1.05 to 1.08 of the proved passing bound above it; rows: u b = 9.1, 12.6, 16.2, 19.7 at n = 16, 24, 32, 40, the scale-free values, at the heights where the cap is not reached). OPEN: the constant of the linear law between 0.445 and 5.85; any statement for zeta's ordinates at all heights.

### 5.4 Units and limits

Units (all through rhrun; all finished or stopped; none left running): rh-c17wil-self-1120005051, -self-1120005213, -self-1120012609 (selftests), -zeros12-1120005101, -testA-1120005441, -testA2-1120010110, -testAb-1120010139 (stopped after seconds: it would have exceeded 8 cores), -testAb-1120010444, -testC-1120011553, -testB69-1120005441 and -testB12-1120011847 (stopped after the theta = 2 cells at 1e6 and part of 1e9, 1e12: the matrix entries were then evaluated 5 times faster and the runs restarted), -testB9-1120013100, -testB12-1120013100, -testB6-1120014426, -hp6-1120022346 (stopped at start, replaced by the fill pass), -fill6-1120022412, -fill9-1120024241, -fill12-1120024241 (adaptive precision for the cells undecided at 512 bits; the last two were killed by their own 3 GB memory limit, which had been set low because rhrun had refused a larger request while the machine was short of memory), -fill9b-1120032551, -fill12b-1120032551 (the remaining theta = 1/2 cells only, limit 8 GB, inside the lane allowance of 12 GB). Cores: at most 8 held by the lane, except about one minute at 9 before the first -testAb unit was stopped. Memory: below 1 GB per unit. One launch was refused by rhrun for machine memory (other users' load) and repeated with a smaller limit. The machine load was 130 to 180 during the runs.
Local runs: none (no numerical library in the local Python); `aggregate.py` and `build_result.py` are text processing.
