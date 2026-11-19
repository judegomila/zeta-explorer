# REFEREE: c9-mv6-ff-window-exact (adversarial, lens: general)

Referee pass of 2026-11-18 (local time). Target: `RESULT.md` in this directory. Claimed verdict: precise-obstruction
(F_q[T] model; no statement about zeta). Only this file was written. All referee runs were local, through
`scripts/memcap.sh 8`, in a scratch copy (`/tmp/c9ref`); the compute server was not used.

## Outcome

**The claim holds in a narrowed form.** No arithmetic error was found. Every number I recomputed from the raw
integer files agrees with RESULT.md, the one PROVED step is correct, and the kernel agrees with an independent
brute force on cases the lane did not use. The wording "grows with a positive exponent" and the sentence "a proof
lane has no true statement to prove in the range dual length > 3N" are stronger than the data (items E1 to E4).
No statement about zeta is made, RH is not assumed (the model uses Weil's theorem, stated as such), verified height
is not restated, and no known theorem is presented as new.

Flags set by the referee: **R1 = false, R2 = false, R3 = false, R4 = false** (same as claimed; none of the four
properties is established or claimed).

## What was re-derived or rerun

| item | what the referee did | result |
|---|---|---|
| Lemma P (PROVED) | Re-derived. j ranges over 3j <= N, so N <= 2 gives j = 0 only. A mark P inside the cube part needs deg(n^3) >= 3 lam, i.e. 3 lam <= N + lam; all configurations have lam > N. | Correct. It is a statement about the model definition R_m = sum_j Jbar^j V_j S_{N-3j}, not about the manuscript's object (see E5). |
| Gauss-sum convention g_3(1, c) = G_2^(deg c) zeta_6^(g(c)) | Computed g_3(1, c) from the definition (sum over x mod c, complex floats, resultant as the determinant of multiplication by x on F_q[T]/(c): code independent of the lane's Euclidean resultant) for 12 products c = P A' of degree 5, q = 7. | 12 of 12 phases equal `ffpy.gphase`. |
| Kernel `ffw enw` (different cases) | Rows from the definition with the referee's own resultant code, vectors one, a, mu, at q = 7 (d, N, lam) = (2, 2, 3), (1, 2, 4) and q = 13 (1, 2, 3). None of these is a production or validation case named in RESULT.md. | sumnorm and diagonal identical in 9 of 9 (e.g. q = 7 (1, 2, 4): 1778112, 57996, 1397844 over 148176). |
| Polynomiality of the completed unmarked row (different cases) | `fe_check.py` at q = 7, d = 3, N <= 7 and q = 13, d = 2, N <= 5 (the lane ran q = 7, d = 1, 2). | C_N = 0 for every m for N >= 5 (q = 7, d = 3: degree 2d - 2 = 4) and N >= 3 (q = 13, d = 2); non-zero with J in place of Jbar; the squarefree row alone is non-zero. Confirms the completion formula for the trivial vector. |
| Assembly of the N = 3 completed row (different case) | `check_completed.py` at q = 7 (3, 5, 1). | 3 of 3 equal (413855568, 7483968, 375753168). |
| Table of section 3, slopes, rule | Recomputed from `results/*.txt` with a separate script (row norms re-summed against the header integers). | All 23 N = 2 lines agree to the digits shown. Slopes: a 0.305, b 0.440, one 0.595, mu 0.231 (q = 7); a 0.255, c4 0.340, mu 0.222 (q = 13). Rule outcome FAILS follows from the pre-registered text. |
| Prediction count | Counted from `summary.txt`. | 87 hit, 22 missed, classes as stated. |
| Controls | Recomputed r1, al, mu from the raw files; counted configurations. | 30 run configurations (23 at N = 2, 7 at N = 3); r1 inside the band in all; al at the stated sizes; mu 951 and 2452 at the largest r*. |
| Pre-registration | Recomputed SHA-256 of `ffx.c`, `plan.py`, `predict.py`, `predictions.txt`; compared file times with the first result files. | Hashes equal `logs/prereg_hashes.txt` (the `ffw.c` of that list is the present `ffw_v2.c`, as RESULT.md says). PREREG.md 18:12:21 local, first production file 18:19:28. Skip markers for q = 7 lam = 13 are from 18:27:35, before any lam >= 11 result existed: the dropped sizes do not depend on outcomes. |
| Pivot table | Compared `pivot_predictions.txt` (20:42:40) with the Delta column and with the later `pivot_predictions.json`. | Same values. |

Zeta-only mechanism: none is claimed, so there is no control to run under R3. The R3 control list
(Davenport-Heilbronn, sign-twisted primes, and so on) was not run in this lane and RESULT.md says so.

## Errors and overstatements

**E1. "Grows with a positive exponent" rests on two steps at q = 7 and one at q = 13.** For target a at q = 7 the
excess is 0.19, 0.35 at r* = 6; then 3.23, 3.13, 2.52, 2.63, 1.98 at r* = 8, 9, 10, 10, 11 (decreasing over four
units of r*); then 17.0, 19.6 at r* = 12. The fitted slope +0.305 is a line through three levels. RESULT.md says
this in its observations and in weakest step 2, but the verdict paragraph does not. What is measured: two upward
jumps of a factor 7 to 10, with a slow decrease between them.

**E2. q = 13: "3 sizes" are two values of r*.** The points are r* = 6, 6, 10. The slope +0.255 is the difference of
two levels, and the upper level is one configuration with 13 rows. The pre-registered requirement "at least three
sizes" is met in the letter only. The q = 13 leg confirms one step, not a slope.

**E3. The slope +0.440 for the second target at q = 7 is inflated by the floor.** Two of its nine points have
negative excess (-0.371, -0.150) and enter as x = 0.01 by the pre-registered convention. Without those two points
the slope is +0.255 (referee recomputation). The rule is still met by target a alone, so the outcome does not
change; the number 0.440 should not be quoted as a measured exponent.

**E4. Section 10, "no true statement to prove in the range dual length > 3N", is too broad.** In the same range the
targets are below the diagonal in every configuration whose class the law calls inactive (energy 0 to 0.65 of the
diagonal). The measured failure is confined to configurations in which a class with 6 | r or 6 | k - N - lam is
active, at N = 2 only (N = 3 has no slope), with sharp degree classes and no excluded set. The supported statement
is: the unrestricted window bound with sharp degree classes is exceeded by a factor up to 20 at N = 2 in the active
classes; a bound restricted to inactive classes, or with weights that remove the sixth-power frequencies, is not
tested.

**E5. "Completed" is proved only relative to a transcription, and for twisted vectors it is untested.** The
vanishing tests that support the completion formula (the lane's and the two the referee added) all use the trivial
vector. For a target vector the factor u(n)^3 in the cube term is a definition, not a checked completion. At
N = 2 this does not matter (no cube term occurs); it matters for every N = 3 number, including the pivot.

**E6. "Dual length above 3N" is nominal.** The reflected sums were not built (stated as NOT-RUN). The dual length
is the value rmax, or R = 2(d + lam) - 2 - N from the polynomial degree; no dual sum of that length was computed.

**E7. Pivot pre-registration is thin.** PIVOT_PREREG.md states "about 04:50 UTC"; its file time is 20:43:11 local
(04:43 UTC) and the first pivot result file is from 20:43:13, two seconds later. No hash was recorded for the pivot
files, and `pivot_predict.py` and `pivot_predictions.json` were rewritten at 20:54, after the q = 7 pivot results
(the earlier `.txt` agrees with them). The order "prediction before run" is consistent with the file times but
not demonstrable. The pivot outcome is UNDECIDED by its own rule in any case, and carries no verdict.

**E8. The random-phase control is weak at d = 1.** With 7 or 13 rows the band 3/sqrt(q^d) admits e from about 0 to
2.1 (q = 7) or 0.17 to 1.83 (q = 13); observed values run from 0.49 to 1.74. The control separates the targets
from random phases only because the target values in the active classes (3.5 to 20.6) are far outside. The q = 13
upper point (18.1 with 13 rows) depends on this.

**E9. Minor.** (a) "Controls pass" refers to the three code controls (mu, al, r1). The vector mu is not a control
in the sense of R3: it is the vector with no cancellation and has the largest excess. (b) RESULT.md says the skip
marker of q = 13 (3, 9, 1) was the exception set after a start; its file time is the same as the (2, 9, 2) marker
(18:50:21). No effect on any number.

## Surviving claim

F_q[T] model, exact integers, rule fixed before the runs. For squarefree marked rows at N = 2 (equal to the
completed rows by Lemma P, relative to the model definition), window N - lam < d < N + lam, rmax > 3N, sharp degree
classes: the probe vector of a quadratic target of prime conductor has row energy 1.19 to 20.6 times the diagonal
at q = 7 (nine active configurations, r* = 6 to 12) and 2.17 to 18.1 at q = 13 (three active configurations,
r* = 6 and 10). The excess rises in steps (two at q = 7, one at q = 13) and is not monotone between steps. In
inactive classes the same vectors are below the diagonal. Random-phase vectors are at the diagonal and the
aligned vector at operator-norm size in all 30 configurations. The pre-registered rule returns FAILS. The N = 3
cube-term observation (target vectors at 2.4 to 5.5 times the diagonal at rmax <= 3N) is measured on 4
configurations, with a completion formula untested for twisted vectors; its rule returned UNDECIDED. Reflected
dual sums not run. No statement about zeta or about zeros of any number-field L-function.

## Requirement flags (referee)

| flag | value | reason |
|---|---|---|
| R1 | false | the statistic is a quadratic form in the vector; no step uses multiplicativity in an essential way |
| R2 | false | fixed q, degrees up to 14; no statement uniform in height |
| R3 | false | no mechanism that fails for the controls is exhibited; the structural controls were not run |
| R4 | false | model computation; nothing reaches the critical line |
