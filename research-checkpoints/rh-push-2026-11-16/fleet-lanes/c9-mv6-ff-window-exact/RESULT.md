# c9-mv6-ff-window-exact: the window statement for the row mean square, tested in F_q[T] in exact arithmetic

Internal working note, 2026-11-19. Slug `c9-mv6-ff-window-exact`. Kind: compute (heavy lane). Not refereed: no
independent referee pass was run from this lane. Nothing committed, pushed or posted. Written: this directory and
`~/rh-push/c9-mv6-ff-window-exact/` on the compute server (through `rhrun`).

This note makes **no statement about zeta** and no statement about zeros of any number-field L-function. It is a
function-field model computation in which the Riemann hypothesis for the twist family is Weil's theorem.
7/8 (unrefereed) stands; RH open. NO QED.

Labels: PROVED (argument given here) / EXACT (equality of exact integers, on the stated cases) / MEASURED
(ratios, logarithms and fits of exact integers; no identity claimed) / ARGUED / NOT-RUN / OPEN.

## 0. Verdict

**Precise obstruction. The pre-registered test gives FAILS: in the model the window statement is false where the
dual length exceeds 3N (sizes run: N = 2, active dual length 6 to 12; N = 3 as a consistency check). The excess of the row mean square over the diagonal grows with a positive exponent for the
probe vectors of Weil targets, at q = 7 and at q = 13, as predicted before the runs. Score: compute lane, no
requirement flag.**

1. **Object (section 2).** Completed marked rows of the compensated probe, row variable m of degree d in the
   window N - lam < d < N + lam, marks = all primes of degree lam, rmax = N + lam - 1 - d + floor(d/2) > 3N.
   N = 2: the completed row equals the squarefree row (PROVED, degree count). N = 3: the cube term (n linear) is
   included, assembled exactly from two kernel runs (EXACT against an independent brute force, 6 of 6). The rescaled
   term of the compensated probe is empty in every configuration (d < 2 lam). The completed rows are coefficients of
   polynomials: they vanish identically above degree 2(d + lam) - 2 (unmarked: 2d - 2), which the squarefree rows
   do not (EXACT, 5 cases). **The reflected dual sums themselves were not constructed: NOT-RUN.** The statistic is
   a function of the row values, so it is the same number in either representation.
2. **Rule outcome (section 3; PREREG section 3).** N = 2, active configurations, slope of log_q(excess) against
   the active dual length r*:

   | vector | q = 7: sizes, slope, excess at largest r* | q = 13: sizes, slope, excess at largest r* |
   |---|---|---|
   | target a | 9, +0.305, 19.6 | 3, +0.255, 17.1 |
   | second target (b / c4) | 9, +0.440, 6.47 | 3, +0.340, 7.39 |
   | one (trivial target) | 3, +0.595, 38.6 | no active size (law) |
   | control mu (Liouville-twisted) | 9, +0.231, 951 | 3, +0.222, 2452 |

   Energy over diagonal for target a at q = 7: 1.19, 1.35 (r* = 6); 4.23, 4.13, 3.52, 3.62, 2.98 (r* = 8 to 11);
   18.0, 20.6 (r* = 12). At q = 13: 2.34, 2.17 (r* = 6); 18.1 (r* = 10). Predicted outcome before the runs: FAILS.
3. **Controls (section 6).** Random phases: inside the band 3/sqrt(q^d) in all 30 configurations. Aligned
   vector: at nsupp/q^d (1e5 to 1.6e11) in all. Liouville-twisted vector mu: positive slope at both q, excess up to
   951 (q = 7) and 2452 (q = 13). Where the law of round 8 has no active class, the targets and mu are below the
   diagonal (33 vector-configuration pairs: energy 0 to 0.65 of the diagonal, exactly 0 in 12); the vector
   `one` is not (up to 27.8): the classes of the law are incomplete for the trivial target.
4. **Advance predictions (section 5).** Intervals for the energy of each unseen configuration and real vector:
   87 hit, 22 missed. All 36 inactive-class predictions for targets and mu hit. The misses: 12 for the vector
   `one` (the law gives 0 or too little where the energy is 2 to 40 times the diagonal), and 10 in active
   configurations where the law is high by up to a factor 1.5 or low by up to a factor 3. The outcome FAILS and the sign of every
   slope were predicted. Prediction "completed row within [0.7, 1.3] of the squarefree row where the latter exceeds
   2": held where the cube term is inactive, and the cube term had not been anticipated (item 5).
5. **Found on the way (section 4; the one pivot, PIVOT_PREREG.md).** For N = 3 the completed row is
   S_3 + Jbar V S_0, and its energy is carried by the cube term Jbar V(m) S_0(m): cofactor A' = 1, no Moebius
   cancellation. Completed against squarefree row, target a: 6.27 against 0.81 at (3, 9, 2); 40.3 against 0.57 at
   (3, 12, 1) (q = 7). Pivot runs at rmax <= 3N, where round 8 found the squarefree rows at the diagonal: completed
   rows of target a at 5.20 and 5.49 (q = 7, rmax = 9), 2.78 and 2.36 (q = 13, rmax = 7), squarefree rows 0.38 to
   0.69. Predicted cube-term energy against measured, target a: ratio 0.82 to 1.12 in 7 of 7 configurations; for
   the vector `one` 0.12 to 1.51 (3 of 4 outside the band). By the pre-registered pivot rule: UNDECIDED (criterion
   (i) fails for `one`); criteria (ii) and (iii) hold at both q.

Reading for round 10 (model statement only): the outcome is "fails". The row mean square of the probe vector is
the diagonal plus the squared signal of the vector's own Moebius sum; beyond dual length 3N the squared signal of
a target with square-root cancellation exceeds the diagonal by a positive power. For completed rows the cube part
adds a squared signal of the same kind with a shorter cofactor; at N = 3 it is the larger one. (E-K) in the window
is not an input independent of the conclusion, and it is false in the range the assignment named.

## 1. Requirement flags as stated before the runs; plan; relation to closed rows

| flag | expectation before work |
|---|---|
| R1 | false: the statistic is a quadratic form in the coefficient vector; multiplicativity enters only through the size of a Moebius sum |
| R2 | false: fixed q, bounded degree; no statement about zeros |
| R3 | false: random-phase vectors sit at the diagonal by Lemma R of round 8, whatever the targets do |
| R4 | false: a model computation inside the 7/8 architecture |

Read: BRIEF to the end (rhrun rules, 2026-11-18 update); OBSTRUCTION_MAP rows Z15, Z15c, Z24, Z26 and the proposed
row Z15d of round 8; `c8-ek-ff-reflected-rows-exact/RESULT.md` (all), `ffx.c` (kernel `en`, `sc`, `row`);
`c8-ek-theta-second-moment-formula/RESULT.md` (verdict, Lemma 1, Theorem 2); ROUND_LOG round 8 results and round 9
allocation.

Known before: round 8 computed the squarefree marked rows up to N + lam = 12, found energy = non-coherent part +
squared signal, and argued from five small cases (N = 1, 2) that Weil targets exceed the diagonal beyond dual
length 3N. Not run there: the completed rows, growth over several sizes, q = 13 at long marks.

New here: (i) a streaming kernel (no stored prime tables) that reaches N + lam = 14 at q = 7 and 12 at q = 13;
(ii) the completed rows for N = 3 and exact checks of the completion; (iii) a pre-registered growth test at both q;
(iv) the cube term of the completed row as a second squared signal, with a pre-registered pivot test.
No closed route is re-run.

Decisive first test (local, `scripts/memcap.sh 8`, before PREREG.md): `ffx en 7 2 2 7` reproduces the round-8
integers (target a: sumnorm 247423680, diag 207531072; `logs/local_repro.log`).

## 2. Object, exact formula, and what was checked

Conventions of `ffx.c` (round 7/8): q = 1 mod 6 prime, chi_0 of order 6, chi_c(x) = chi_0(Res(c, x)),
g_3(1, c) = G_2^(deg c) zeta_6^(g(c)) for squarefree monic c, Jbar = q^2/G_2^3 = conj J(chi_0^2, chi_0^2) in Z[zeta_6]
(norm q).

**Completed marked row** (model form of the marked version of T = L_0 D of manuscript Prop. 5.1; alpha = 1, sharp
degree classes, no excluded set), in units G_2^(N+lam):

    R_m = sum_{j >= 0} Jbar^j V_j(m) S_{N-3j}(m),
    S_{N'}(m) = sum_{P prime, deg P = lam} sum_{A' monic squarefree, deg A' = N', P !| A'} zeta_6^(g(P A')) u(A') chi_{P A'}(m),
    V_j(m)   = sum_{n monic, deg n = j} u(n)^3 chi_n(m)^3.

S_{N'} is the squarefree marked row of round 8. Statistic: E = sum_m |R_m|^2, X D = diagonal of the row Gram form,
e = E/(X D), excess x = e - 1. Vectors: `one` (u = 1), `a`, `b` (q = 7) or `c4` (q = 13): quadratic characters of
prime conductor of degree 3, 3, 4 (probe vectors: after the Gauss identity the unfolded vector is mu u);
`mu` (u = mu, unfolded vector 1: the Liouville-twisted control); `al` (aligned); `r1` (random sixth roots).

**Lemma P [PROVED].** For N <= 2 the sum has only j = 0, and for lam > N/2 no term has P | n. Proof: 3j <= N, and
P | n needs 3 lam <= N + lam. So at N = 2 the completed row is the squarefree row.

**Compensated probe.** In the transcription of c8 section 6 the rescaled term is a base row at row degree
d - 2 lam. All configurations have d < 2 lam: the term is absent and the row of the compensated probe is R_m
[PROVED-rel that transcription].

**Checks of the completion and of the code (all EXACT, before the production runs unless stated).**

| check | cases | outcome |
|---|---|---|
| unmarked completed row with trivial vector, C_N = sum_j Jbar^j V_j S_{N-3j}, q = 7, d = 2, N = 0..7 (`fe_check.py`) | 49 m per N | C_N = 0 for every m and every N >= 3; with J in place of Jbar it is not (sum of norms 7938 at N = 3). The squarefree row alone is non-zero at every N. d = 1: all rows vanish for N >= 1 |
| marked completed row, one prime P at a time (`fe_marked.py`): q = 7 (d, lam) = (1,1), (1,2), (2,1); q = 13 (1,1) | 42, 21, 126, 48 pairs (P, m) | zero for every N > 2(d + lam) - 2 up to the largest N computed (N <= 6; N <= 4 at q = 13); the squarefree row alone is non-zero there |
| assembly of the N = 3 completed row from two kernel runs against a brute force from the definition (`check_completed.py`), q = 7, (3, 4, 1), (3, 4, 2), vectors one, a, mu | 6 | equal |
| `ffw enw` against `ffx en` (np, sumnorm, diag, sW2), seven vectors each, both code paths | locally 20, 15, 15 configurations (three kernel versions); on the server 12 (the version that ran q = 7) and 8 (the final version) | identical |
| `ffw enw` against the round-8 result files at production size, q = 7 (2, 7, 2), (2, 10, 2) (`logs/compare_c8.log`) | 8 energies (the random vector uses a different hash by design) | identical |
| prime count of every run against the necklace count; direct resultants on sampled primes inside every run | all runs | equal; no mismatch |

So the completed row is the coefficient of a polynomial of degree 2(d + lam) - 2 in the model: the dual length of a
row of length N is R = 2(d + lam) - 2 - N (manuscript: (Q P)^2/(Z P)). **What is not done:** the companion family
on the other side of the functional equation was not identified (the conjugate-twist candidate satisfies the
modulus relation only in part of the cases, `logs/fe_marked_*.log`), so the reflected dual sums were not built:
**NOT-RUN**. "Dual length above 3N" is taken as rmax > 3N (the convention of round 8); R > 3N holds as well in
every configuration.

## 3. Pre-registered runs, N = 2 (completed row = squarefree row)

e = E/(X D), exact rationals shown to three digits. r* = active dual length of the law for target a; B_coh the
law of round 8 (`predictions.txt`, written before the runs). "not run" = dropped for time as allowed by PREREG
section 2.

**q = 7, N = 2 (completed row = squarefree row)**

| (N, lam, d) | rmax | r* (a) | B_coh (a) | one | a | b | mu | al | r1 |
|---|---|---|---|---|---|---|---|---|---|
| (2, 7, 2) | 7 | 6 | 1 | 2.26 | 1.19 | 0.629 | 37 | 1.15e+05 | 0.945 |
| (2, 8, 2) | 8 | - | 0 | 0.195 | 0.464 | 0.552 | 0.094 | 7.06e+05 | 1.12 |
| (2, 9, 2) | 9 | - | 0 | 0 | 0.0235 | 0.0176 | 0 | 4.39e+06 | 1.11 |
| (2, 10, 2) | 10 | 9 | 4.7 | 6.32 | 4.13 | 1.55 | 173 | 2.77e+07 | 0.942 |
| (2, 11, 2) | 11 | 11 | 3.66 | 6.91 | 2.98 | 1.17 | 133 | 1.76e+08 | 0.883 |
| (2, 12, 2) | 12 | 12 | 24.5 | 39.6 | 18 | 4.98 | 832 | 1.13e+09 | 1.05 |
| (2, 13, 2) | 13 | 12 | 26.4 | not run | not run | not run | not run | not run | not run |
| (2, 7, 1) | 7 | - | 0 | 0 | 0.256 | 0.258 | 0 | 6.87e+05 | 0.505 |
| (2, 8, 1) | 8 | - | 0 | 0 | 0.087 | 0.329 | 0 | 4.20e+06 | 1.61 |
| (2, 9, 1) | 9 | - | 0 | 0 | 0 | 0 | 0 | 2.62e+07 | 1.43 |
| (2, 10, 1) | 10 | 10 | 4.7 | 4.99 | 3.52 | 1.57 | 162 | 1.65e+08 | 0.485 |
| (2, 11, 1) | 11 | - | 0 | 0 | 0.135 | 0.119 | 0 | 1.05e+09 | 1.61 |
| (2, 12, 1) | 12 | 12 | 28.6 | 27.8 | 20.6 | 7.47 | 952 | 6.73e+09 | 1.74 |
| (2, 13, 1) | 13 | - | 0 | not run | not run | not run | not run | not run | not run |
| (2, 8, 3) | 7 | 6 | 0.875 | 9.28 | 1.35 | 0.85 | 33.4 | 1.03e+05 | 0.923 |
| (2, 9, 3) | 8 | - | 0 | 0.816 | 0.652 | 0.562 | 0.198 | 6.41e+05 | 1.06 |
| (2, 10, 3) | 9 | 8 | 4.7 | 8.28 | 4.23 | 1.63 | 181 | 4.04e+06 | 1.02 |
| (2, 11, 3) | 10 | 10 | 3.66 | 4.81 | 3.62 | 1.26 | 148 | 2.57e+07 | 1.02 |

**q = 13, N = 2 (completed row = squarefree row)**

| (N, lam, d) | rmax | r* (a) | B_coh (a) | one | a | c4 | mu | al | r1 |
|---|---|---|---|---|---|---|---|---|---|
| (2, 7, 2) | 7 | 6 | 1.86 | 3.91 | 2.34 | 1.16 | 270 | 8.91e+06 | 1.01 |
| (2, 8, 2) | 8 | - | 0 | 0.29 | 0.571 | 0.464 | 0.146 | 1.01e+08 | 1.13 |
| (2, 9, 2) | 9 | - | 0 | not run | not run | not run | not run | not run | not run |
| (2, 7, 1) | 7 | - | 0 | 0 | 0.347 | 0.179 | 0 | 1.07e+08 | 0.92 |
| (2, 8, 1) | 8 | - | 0 | 0 | 0.236 | 0.365 | 0 | 1.22e+09 | 0.868 |
| (2, 9, 1) | 9 | - | 0 | 0 | 0 | 0 | 0 | 1.40e+10 | 1.62 |
| (2, 10, 1) | 10 | 10 | 16.7 | 16.9 | 18.1 | 8.39 | 2.45e+03 | 1.64e+11 | 0.681 |
| (2, 8, 3) | 7 | 6 | 1.62 | 26.6 | 2.17 | 1.32 | 239 | 7.84e+06 | 0.953 |

Slopes and rule (`summary.txt`, TABLE 3 and RULE; active configurations as fixed in `predictions.txt`):

| vector | q | sizes | slope | excess at the largest r* | points (r*: excess) |
|---|---|---|---|---|---|
| a | 7 | 9 | +0.305 | 19.6 | 6: 0.19, 0.35; 8: 3.23; 9: 3.13; 10: 2.52, 2.63; 11: 1.98; 12: 17.0, 19.6 |
| b | 7 | 9 | +0.440 | 6.47 | 6: -0.37, -0.15; 8: 0.63; 9: 0.55; 10: 0.26, 0.57; 11: 0.17; 12: 3.98, 6.47 |
| one | 7 | 3 | +0.595 | 38.6 | 10: 3.81; 11: 5.91; 12: 38.6 |
| mu (control) | 7 | 9 | +0.231 | 951 | 6: 32.4, 36.0; 8: 180; 9: 172; 10: 147, 161; 11: 132; 12: 831, 951 |
| a | 13 | 3 | +0.255 | 17.1 | 6: 1.17, 1.34; 10: 17.1 |
| c4 | 13 | 3 | +0.340 | 7.39 | 6: 0.16, 0.32; 10: 7.39 |
| one | 13 | 0 | - | - | no active configuration under the law |
| mu (control) | 13 | 3 | +0.222 | 2452 | 6: 238, 269; 10: 2452 |

Rule: a probe vector with positive slope over at least three sizes and excess >= 1 at the largest r*, at q = 7 and
(where three active sizes exist) at q = 13. Met by a (both q), by b / c4 (both q) and by `one` (q = 7; no active
size at q = 13). **VERDICT BY THE RULE: FAILS in the model.** Largest excess of a probe vector: 39.3. The controls
of the code pass (section 6), so the verdict is not void.

Cross-q exponent ln(x_13/x_7)/ln(13/7) of the excess: target a 3.13 at (2, 7, 2), 1.93 at (2, 8, 3), 3.09 at
(2, 10, 1); mu 3.25, 3.22, 4.40 (law: 1.0, 1.0, 2.05 for B_coh). For target a the exponent of the excess is inflated
at r* = 6, where x_7 is small (e goes from 1.19 to 2.34 and from 1.35 to 2.17); the law is low for mu at q = 13
relative to q = 7 by the same direction. Reported, not part of the rule.

Observations.
- Configurations in which the law has no active class for the vector: the targets and mu are below the diagonal
  (33 pairs, e from 0 to 0.65, exactly 0 in 12; at d = 1 the rows of mu vanish identically). For `one` the list
  of inactive classes of the law is wrong: e = 2.26, 6.32, 4.99, 27.8, 9.28, 8.28 at (2, 7, 2), (2, 10, 2),
  (2, 10, 1), (2, 12, 1), (2, 8, 3), (2, 10, 3) (q = 7) and 3.91, 16.9, 26.6 at (2, 7, 2), (2, 10, 1), (2, 8, 3)
  (q = 13); elsewhere e is 0 exactly (8 cases) or at most 0.82.
- The excess is a staircase in r*, not a smooth power: about 0.2 to 1.3 at r* = 6, 2 to 3.2 at r* = 8 to 11, 17
  to 20 at r* = 12 for target a at q = 7 (law: wt^2 = q^3, (q^2 - 1)^2, q^5). The fitted slope 0.30 per unit of r*
  is the average of that staircase (law: 1/3).
- `one` at (2, 8, 3): 9.28 (q = 7) and 26.6 (q = 13) with B_coh = 0. The energy is spread over all factorisation
  types of m (`logs/mtypes_*.log`). Not explained by the law or by its refinement in section 5: OPEN.

## 4. Completed rows with a cube part, N = 3

Pre-registered runs (q = 7; completed / squarefree row):

| (N, lam, d) | rmax | one | a | b | mu | al | r1 |
|---|---|---|---|---|---|---|---|
| (3, 9, 2) | 10 | 6.02 / 0.0775 | 6.27 / 0.807 | 6.54 / 1.12 | 172 / 197 | 2.64e+07 / 3.00e+07 | 0.755 / 0.796 |
| (3, 10, 2) | 11 | 0.561 / 0.652 | 0.923 / 1.08 | 0.59 / 0.691 | 144 / 167 | 1.67e+08 / 1.89e+08 | 0.903 / 0.923 |
| (3, 11, 2) | 12 | 4.2 / 4.88 | 2.18 / 2.54 | 2.92 / 3.4 | 859 / 999 | 1.06e+09 / 1.20e+09 | 1.14 / 1.11 |
| (3, 12, 2) | 13 | not run | not run | not run | not run | not run | not run |
| (3, 9, 1) | 10 | 0 / 0 | 0.615 / 0.715 | 1.69 / 1.97 | 147 / 171 | 1.64e+08 / 1.84e+08 | 1.3 / 1.26 |
| (3, 10, 1) | 11 | 0 / 0 | 0.296 / 0.344 | 0.501 / 0.583 | 0 / 0 | 1.03e+09 / 1.16e+09 | 1.26 / 0.989 |
| (3, 11, 1) | 12 | 1.67 / 1.94 | 2.87 / 3.34 | 3.6 / 4.19 | 997 / 1.16e+03 | 6.56e+09 / 7.39e+09 | 0.948 / 0.86 |
| (3, 12, 1) | 13 | 0 / 0 | 40.3 / 0.569 | 26.8 / 0.33 | 0 / 0 | 4.21e+10 / 4.74e+10 | 1 / 0.82 |

(3, 12, 2) at q = 7 and (3, 9, 1) at q = 13: not run (time).

Exact decomposition E = E_0 + E_1 + cross of the completed energy, E_1 = q sum_m V(m)^2 |S_0(m)|^2 the cube term
(`decomp.txt`), in units of the diagonal, target a: (3, 9, 2): 0.69 + 5.35 + 0.23; (3, 12, 1): 0.49 + 34.5 + 5.29;
(3, 10, 2), (3, 11, 2), (3, 9, 1), (3, 10, 1), (3, 11, 1): E_1 <= 0.0003. The companion row
S_0(m) = sum_P zeta_6^(g(P)) chi_P(m) (marked row with trivial cofactor) has energy over its own diagonal 37.5 at
(0, 9, 2) and 215 at (0, 12, 1), and is exactly 0 at (0, 11, 2), (0, 9, 1), (0, 10, 1), (0, 11, 1): it is the
row of round 8 with Moebius sum pi(lam) (no cancellation), active in the classes 6 | k - lam or 6 | k + lam - 1 - d.
For `one` at d = 2 the cube term sits on the 7 square rows m = l^2 (V = q - 1 there, -1 elsewhere: 86% of the
energy at (3, 9, 2)); at d = 1, V = 0 for `one` and `mu`. For a target twist V(m) is the linear coefficient of
L(u, nu chi_m^3) and the cube term is on all rows (e on the non-square rows of (3, 9, 2): 6.59; `squares.txt`).

**Pivot (PIVOT_PREREG.md, written before these runs; local, `scripts/memcap.sh 8`).** Completed rows, N = 3,
rmax <= 3N = 9. Delta = predicted cube-term energy over the diagonal (`pivot_predictions.txt`).

| q | (N, lam, d) | rmax | vector | e completed | e squarefree | E_1/(X D) | Delta | ratio |
|---|---|---|---|---|---|---|---|---|
| 7 | (3, 6, 1) | 7 | a | 1.06 | 0.459 | 0.966 | 0.960 | 1.01 |
| 7 | (3, 6, 2) | 7 | a | 2.10 | 0.620 | 0.893 | 0.843 | 1.06 |
| 7 | (3, 6, 2) | 7 | one | 2.48 | 1.34 | 0.534 | 0.840 | 0.64 |
| 7 | (3, 7, 1) | 8 | a | 0.139 | 0.161 | 0 | 0 | - |
| 7 | (3, 7, 2) | 8 | a | 1.32 | 0.370 | 0.948 | 0.845 | 1.12 |
| 7 | (3, 7, 2) | 8 | one | 6.97 | 7.31 | 0.141 | 0.842 | 0.17 |
| 7 | (3, 8, 1) | 9 | a | 5.20 | 0.507 | 6.88 | 6.88 | 1.00 |
| 7 | (3, 8, 2) | 9 | a | 5.49 | 0.382 | 5.79 | 7.04 | 0.82 |
| 7 | (3, 8, 2) | 9 | one | 1.02 | 0.027 | 0.860 | 7.02 | 0.12 |
| 13 | (3, 6, 1) | 7 | a | 2.78 | 0.379 | 1.70 | 1.69 | 1.00 |
| 13 | (3, 6, 2) | 7 | a | 2.36 | 0.694 | 1.93 | 1.84 | 1.05 |
| 13 | (3, 6, 2) | 7 | one | 3.81 | 2.16 | 2.77 | 1.84 | 1.51 |
| 13 | (3, 7, 1) | 8 | a | 0.658 | 0.713 | 0 | 0 | - |

Second targets: b 0.69, 1.50, 1.13, 7.16, 5.55 (q = 7, the five active configurations in the order of the table);
c4 2.97, 2.70 (q = 13). (3, 7, 2) at q = 13: not run (time). Full table: `pivot_summary.txt`.
Pivot rule: (i) ratio in [0.5, 1.5] wherever Delta >= 0.8: holds for target a (7 of 7), fails for `one` (3 of 4
outside); (ii) E_1 = 0 where Delta = 0: holds (7 of 7); (iii) target a has e >= 1.5 where Delta >= 1.5: holds at
both q (5.20, 5.49; 2.78, 2.36). **Outcome by the rule: UNDECIDED** (criterion (i) is not met for `one`). The
even-spreading assumption of the prediction is wrong for `one`, whose V is concentrated on square rows.
What stands [MEASURED]: for the probe vector of a Weil target at N = 3, the completed row exceeds the diagonal
below rmax = 3N at both q, by the cube term, at the predicted size.

**Scaling [ARGUED, not measured beyond N = 3].** With the law of round 8, the term j of the completed row has
coherent energy over the diagonal about wt(r - 3j)^2 |M_{N-3j}(u)|^2 q^(-2(N-3j)) q^(-j) /lam times |V_j|^2/q^j.
For a Weil target (|M_L|^2 about q^L, |V_j|^2 about q^j) this is q^(r/3 + 1 + j - N)/lam up to constants: largest at
j = N/3, exponent r/3 + 1 - 2N/3 against r/3 + 1 - N for the squarefree part. On this count the completed-row
statement fails for r > 2N - 3 (h > 2 in ledger variables) instead of r > 3N - 3. Only j = 1, N = 3 is computed.
The line h = 2 is abscissa 2/3 in the scalar bound B >= 1 - h/6 of map row Z15; whether this is the same
phenomenon as the normaliser cap of row Z24 is not examined here.

## 5. Advance predictions; a refinement of the law found afterwards

Pre-registered intervals e in [(1 - 1/q)^2 B_coh, B_coh + 1.1] for the unseen configurations and the real vectors
(`summary.txt` TABLE 2): **87 hit, 22 missed.** By class (hit, miss): active/target (24, 6), active/mu (11, 4), active/one (2, 3), inactive/target (24, 0), inactive/mu (12, 0), inactive/one (14, 9).
The outcome itself (FAILS, positive slopes for a, b and mu) was predicted. Predicted and measured slopes: target a
0.25 / 0.305, b 0.25 / 0.440, one 0.49 / 0.595, mu 0.25 / 0.231 (q = 7); a 0.22 / 0.255, c4 0.22 / 0.340, mu 0.22 / 0.222
(q = 13).
Other advance statements: "inactive configurations: every real weight has e <= 1.1": held for the targets and mu
(36 of 36 unseen), missed for `one` in 9 of 23;
"completed within [0.7, 1.3] of the squarefree row where the latter exceeds 2": held for mu (0.86 to 0.88) and in
the inactive cube classes, missed where the cube term is active (it had not been anticipated); "r1 inside its
band", "al at nsupp/q^d": held.

Post hoc (`postlaw.py`, `postlaw.txt`; written after the q = 7 results, not an advance prediction): the law of
round 8 counts the sixth-power frequencies a l^6 without the condition (l, A) = 1. Putting the count cop_j(A)
inside the Moebius sum removes most of the factor (1 - 1/q)^2 noted in round 8 (it is exactly that factor for a
prime-conductor target at r = 6) and gives a non-zero term for `one` at k = 0 (3.6 at (2, 10, 2) against 6.32
measured; 21 at (2, 12, 1) against 27.8). Non-coherent part n = e - B_corr, active configurations: targets
(34 configurations) between -0.87 and 5.1, median 0.75; mu within 14% of B_corr; `one` not captured at
k = 1 (the refined count is high by a factor 2) and at d = 3.

## 6. Controls

| control | what was run | outcome | named step |
|---|---|---|---|
| Liouville-twisted vector (u = mu) | all configurations | above the diagonal by 32 to 951 (q = 7) and 238 to 2452 (q = 13) in the active classes, positive slope; 0 to 0.2 in the inactive classes | its Moebius sum is the full count pi(lam) q^N-type sum: no cancellation |
| aligned vector | all configurations | e/(nsupp/q^d) in [0.5, 2] in all; 1e5 to 1.6e11 | Lemma AL of round 8: the operator-norm size |
| random phases | all configurations | inside 3/sqrt(q^d) in all (d = 1, 7 or 13 rows: e from 0.49 to 1.74; d >= 2: 0.76 to 1.14) | Lemma R of round 8: mean over phases = diagonal exactly |
| trivial target (`one`) | all configurations | exceeds the diagonal like the targets in the active classes, and at (2, 7, 2), (2, 10, .), (2, 8, 3), (2, 12, 1) beyond the law | Moebius sum of the cofactor weighted by coprimality counts; partly OPEN |
| DH-type, sign-twisted primes, THIN, unimodular twist as a family, backward heat, zeta(s+a)zeta(s-a), T-NR, Beurling, phase-rotated transfer operator, theta^w | not run in this lane | - | round 8 ran dh, th, tb, n1 on the same statistic: they behave as the targets, by the size of their Moebius sum; no positivity or zero statement is made here |

The window statement fails for the targets and holds for the random-phase vector: the statistic does not separate
a multiplicative target from a generic vector in the direction a proof would need.

## 7. Requirement flags (result of this lane)

| flag | value | evidence |
|---|---|---|
| R1 multiplicativity essential | false | E is a quadratic form; the excess is governed by the size of a Moebius sum of the vector (mu: no cancellation, largest excess; targets: square-root cancellation, excess beyond 3N; random phases: none) |
| R2 height-uniform, every window | false | no statement about zeros; fixed q, degrees up to 14 |
| R3 controls fail structurally | false | the random-phase control passes where the targets fail; no control fails for a reason absent from the targets |
| R4 reaches the critical line | false | model computation; the statement tested is false in the model in the range named; no abscissa changes |

## 8. Three weakest steps

1. **The reflected dual sums are not built, and the model is a transcription.** The object computed is the direct
   side of the completed marked row with alpha = 1, sharp degree classes, no smooth weights, no excluded set, no
   ray classes. Polynomiality of the completed rows is verified on five small cases with the trivial vector only;
   the partner family of the functional equation is not identified. If the manuscript's reflected row carried
   weights that remove the sixth-power classes, the excess here would not transfer.
2. **Growth is measured in the mark length at N = 2 and in q, not in N.** r* runs from 6 to 12 at fixed N = 2
   (h = r/N from 3 to 6); the staircase has three steps, and the slope is a fit through them. At q = 13 the sizes
   above r* = 6 are one configuration with 13 rows (d = 1). N = 3 has no slope. The statement "fails for r > 3N"
   as a law in N rests on the squared-signal law, which is measured (round 8 and here), not proved beyond the
   Bessel inequality at dual length 0; the law misses the vector `one` in 12 of 28 unseen configurations.
3. **The cube-term finding is one cube step.** N = 3, j = 1, cofactor of length 0, small row sets (7 to 169 rows);
   the pivot rule came out UNDECIDED because of the vector `one`. The scaling in section 4 (threshold r > 2N - 3
   for completed rows) is ARGUED from the round-8 law and is not computed for any N >= 6. The diagonal used for
   N = 3 treats the pairs (P, n) with n linear as distinct characters, which is correct for j = 1 only.

## 9. Compute record

Server ([compute-server]), computations only through `~/rh-push/bin/rhrun`; `rhstatus` read before each launch; GPU not
used. Planned memory printed by the kernel before allocation: at most 0.014 GB (no prime tables are stored).

| unit | cores, memory limit | what | outcome |
|---|---|---|---|
| build-1119021323 | 2, 2 GB | build | failed at link (missing -lm); nothing ran |
| build-1119021425 | 2, 2 GB | build + validation against `ffx en` | 7 + 1 configurations identical, then **killed by its memory limit** inside the reference program `ffx en` at q = 13 (2, 6, 1) (its table W of 13^8 entries). The limit was not raised; the validation was repeated on smaller configurations |
| val13-1119021748 | 2, 2 GB | validation, q = 13, smaller configurations | 4 identical; completed |
| q7-1119021927 | 16 (quota set to 8 from 02:40 while the q = 13 unit ran), 4 GB | production q = 7, 31 jobs | completed 03:59 UTC; job times sum 5989 s; longest (2, 11, 3): 1701 s; peak memory 9 MB |
| q13-1119023954 | 8, 4 GB | validation of the final kernel (8 configurations identical), production q = 13, 7 jobs | (2, 8, 3) took 5927 s. After it the unit began a duplicate of (2, 10, 1), which the next unit was already computing (my error: a skip marker had been removed); I stopped the unit with `systemctl --user stop` after 6 minutes; no output of the duplicate was used |
| q13x-1119035933 | 16 (quota 8 until 04:54 while the other unit ran), 4 GB | q = 13 (2, 10, 1); then (3, 9, 1) | (2, 10, 1): 6320 s, 1.38e10 primes. (3, 9, 1) was started at 05:45 UTC and stopped by me (`systemctl --user stop`) after about 3 minutes: its estimated time was 50 to 70 minutes for a consistency line whose cube class is inactive; dropped for time |

Core quotas of my simultaneously active units never exceeded 16, except between 04:47 and 04:54 UTC, when the
duplicate job of the q13 unit ran beside the q13x unit (quotas 8 + 8 = 16 allowed, so the cap held by quota; the
duplicate wasted about 45 core-minutes). No job ran longer than 3 hours. Sizes dropped for time, as allowed by
PREREG section 2 (skip markers set before those jobs started, except the last, which was started and stopped as stated): q = 7
(2, 13, 1), (2, 13, 2), (3, 12, 2); q = 13 (2, 9, 2), (3, 9, 1). No unit of this lane is active now (checked after the stop). Only my own units were touched. Not through `rhrun`: one
compilation of the final kernel (`gcc`, about 2 s) run directly over ssh, and file copies with rsync.

Local (Mac), through `scripts/memcap.sh 8`: reproduction of round 8, predictions (`predict.py`), exact checks
(`fe_check.py`, `fe_marked.py`, `check_completed.py`), the pivot runs (q = 7 six configurations, 18 s; q = 13
three configurations, about 9 minutes), analysis scripts. Not through the wrapper, all mine, each below 0.1 GB:
the first build-and-compare loops of the new kernel (`validate.sh`, seconds to two minutes) and two timing calls.

Files: `PREREG.md`, `PIVOT_PREREG.md`, `RESULT.md`, `lanes_line.json`; `ffx.c` (round-8 kernel, unchanged),
`ffw.c` (streaming kernel `enw`; `ffw_v1.c`, `ffw_v2.c` earlier versions: v2 ran the q = 7 queue, the final file
the q = 13 runs and the pivot; identical output on the validation sets), `ffpy.py`, `plan.py`, `predict.py`,
`predictions.txt/.json`, `genjobs9.py`, `jobs*.txt`, `runjobs9.sh`, `validate.sh`; `results/` (exact integers:
ENW lines and every row value), `results_pivot/`; `analyze.py`, `summary.txt`, `results.json`, `tables.md`;
`decomp.py/.txt`, `squares.py/.txt`, `postlaw.py/.txt`, `mtypes.py`, `pivot_*.py/.txt`; `fe_check.py`,
`fe_marked.py`, `check_completed.py`; `logs/` (local logs, hashes at pre-registration, server unit logs).

## 10. For the next allocation; proposed map row (not applied)

- Outcome for the round-10 branch: **fails**. (E-K) in the window is the bound "squared signal <= diagonal" for the
  vector's own Moebius sum. In the model it holds for Weil targets up to r = 3N for squarefree rows and is false
  beyond, with measured growth at both q. A proof lane in F_q[T] "not using the family RH" has no true statement to
  prove in the range dual length > 3N.
- Before ORDER-2 through (E-K) is used at any vertex with h between 2 and 3, the cube term should be checked at
  N = 6 (j = 2): one run (6, 9, 2) at q = 7 (117,649 cofactors, about 4.5e6 primes; needs the kernel limit on the
  cofactor count lifted and the diagonal for n = l^2 written out). Prediction from section 4: completed excess
  about 0.8 against about 0.02 for the squarefree part.
- The manuscript's signal computation for completed rows (section 7.2) should be compared with the cube term:
  if the signal of Prop. 2.1 already contains it, the term is the Cauchy-Schwarz step read backwards, as in round 8.
- OPEN in the model: the excess of the trivial-target vector at (2, 8, 3) (9.3 at q = 7, 26.6 at q = 13).

| Z15d (extension) | (E-K) in the window, completed rows, F_q[T], exact integers | Window N - lam < d < N + lam, rmax > 3N, N = 2 (completed = squarefree) and N = 3 (with cube term), q = 7 up to N + lam = 14, q = 13 up to 12. Weil targets: energy/diagonal 1.2 to 20.6 (q = 7), growing with the active dual length (slope of log_q excess +0.30 over 9 sizes); q = 13: 2.2 to 2.3 at r* = 6 and 18.1 at r* = 10 (slope +0.25, 3 sizes). Inactive classes: below the diagonal. Completed rows at N = 3: cube term Jbar V S_0 with trivial cofactor carries the energy (6.3 against 0.8; 40 against 0.6) and puts the target vectors above the diagonal at rmax <= 3N (2.4 to 5.5). Completed rows are polynomial coefficients (degree 2(d + lam) - 2). | EXACT integers; rule pre-registered, outcome FAILS as predicted; cube-term pivot UNDECIDED by its rule (holds for the target vector); scaling in N ARGUED; reflected dual sums NOT-RUN; no referee | mu: largest excess; aligned: operator-norm size; random phases: diagonal (pass where the targets fail) | `c9-mv6-ff-window-exact` |

No statement about zeta. No abscissa below 0.874886647 is proved.
