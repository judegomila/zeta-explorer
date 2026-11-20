# REFEREE: r3-nonpolar-numerics

Adversarial review, 2026-11-16. Scope: RESULT.md, its scripts and logs, and an independent rerun at the smallest
path point (Q = 937.5, R = Q^1.4 = 14480). Referee scripts: `/tmp/r3ref/ref.py`, `/tmp/r3ref/ref2.py`; on the
motherbox `~/rh-push/r3-nonpolar-numerics-referee/` (`ref.log`, `ref2.log`; 1 core, 6-10 min each).

**Referee verdict: the claim holds as worded (MEASURED only, no eta, no abscissa, nothing PROVED). The numbers
reproduce. The evidential weight for TRO6-natural is lower than the note's wording suggests: the statistic t does
not depend on the rows being theta coefficients (E1). Three corrections of interpretation (E1-E3), one qualification
of the new observation (E4).**

There is no PROVED step, no changed lemma and no abscissa in the note, so there is nothing to re-derive against the
7/8 manuscript or the follow-up preprints and no optimisation to re-solve. 7/8 and B_flat = 0.874886647 are quoted
unchanged, with the unrefereed inputs named. Dictionary check: 30000^(-1/80) = 0.879 (note: 0.88). Correct.

## 1. What was rerun and what it confirms

| check (Q = 937.5) | referee | note / stored |
|---|---|---|
| S_sigma(c) for all 21,003 window conductors, recomputed from the stored rows with a different code path (`node_exponents(m)` on m directly, not the factorisation cache of round 2) | max difference 1.2e-7 on values of rms 0.6 | single-precision snapshot |
| F1 by explicit character matrices (no FFT), p = 7, 13, 103, 499, 997, `loo` and `band` | relative difference <= 6e-8, index by index | `fam_00.npz` |
| F1 family mean over 73,016 non-principal characters x 12 classes, by Parseval on residue-class sums | 1.0002 (`loo`), 0.9997 (`band`), prime-block se 0.0016 | 1.0002, 0.9997 |
| shuffled labels (different seed) | 0.9988 | 1.0005 |
| polar share (all rows) | 0.1870 | 0.187 |
| Moebius-phased row, `band`, exact phases (no binning), \|k\| = 1, j = 0, 1, 2 | 0.49, 0.72, 0.77 | 0.49, 0.72, 0.77 |

Window: 10,505 + 10,498 conductors, norms 2821-77191; 1644 generic half rows (855 + 789). All as stated.
Not rerun: Q > 938, F3, the Kolmogorov distances at Q = 30000, the slopes. The log values quoted in RESULT.md match
`agg.log`, `post.log`, `series.log`.

## 2. Errors and corrections

**E1 (main). The statistic t is row-blind. Mean 1.000, the Exp(1) law and both exponents delta are properties of
the conductor-side frame, not of theta_6.** The referee replaced rho-hat by other row vectors, kept everything else
(same chi_c(m), same alpha, gamma_2, window, same 73,016 characters), no self-term correction:

| rows | F1 family mean t | 4 primes, 34,800 values: mean, E t^2, P(t > 3) |
|---|---|---|
| rho-hat (`loo`) | 1.0002 | (note) 2.004, 0.0500 |
| rho-hat without the leave-one-out correction | 1.0004 | |
| rho-hat with random phases per row | 1.0011 | 0.998, 1.994, 0.0499 |
| rho-hat permuted over rows | 1.0009 | 1.005, 2.020, 0.0517 |
| complex Gaussian noise | 0.9999 | 0.995, 1.985, 0.0499 |
| all ones | 0.9999 | 0.998, 2.018, 0.0522 |
| N(m)^(-1/2) | 0.9990 | 0.988, 1.949, 0.0479 |

Consequences:
* Item 1 of the summary ("the remainder is at the random level ... with the law of a sum of independent phases") is
  true but would be reported for any rows, including rows with no arithmetic content. The note records that the
  result is target-blind (§6); it does not record that it is row-blind. The measurement therefore says: rho-hat is
  not an exceptional vector for this frame. It does not exhibit a cancellation mechanism specific to theta_6, and
  it is not a sample of "the power saving (PS-U)".
* delta = 0.506 and the sup exponent 0.501 are not independent measurements. r = sqrt(t) * r_null, t = O(1) for every
  vector, r_null * sqrt(rows) is 1.03-1.06 by round 2, so delta = (1/2) dlog(rows)/dlog Q up to noise. "delta = 0 is
  excluded at more than 60 standard errors" has no content beyond "t stays bounded"; it should be removed.
* What survives as a statement about the object of interest is an upper bound: for each of the 93,486 targets and
  the estimator rho-hat, |r| <= 0.0117 of Cauchy-Schwarz at Q = 30000 (n = 1 part, S' empty).

**E2. The coherent bound is compared with the wrong scale.** The family mean of t is a Rayleigh quotient of
G = sum_nu B(nu)B(nu)^* at rho-hat. With 93,486 near-orthogonal targets and about 54,000 half rows, Bessel/large
sieve bounds a component common to the whole family by a small multiple of 1/sqrt(rows) (0.003-0.006) for every
row vector. The stated 2.1e-4 - 2.5e-4 is a gain of roughly 10-25 over that, not of 3500 over the TRO6 threshold
0.88 as item 3 reads. TRO6-natural is a statement per target (a supremum); the relevant number is r_max = 0.0117.
The note's own caveat ("a component confined to a sparse set of targets is limited only by the supremum") is the
operative statement and should be the headline.

**E3. Polar share: null baseline not subtracted; the slope is biased.** The cell-mean projection removes energy
from any vector. Referee, Q = 937.5: share 0.0294-0.0320 for seven control row vectors (0.0251 for all ones)
against 0.1870 for rho-hat. The excess over the null is about 0.157, not 0.187. The baseline scales like
cells/conductors (192 cells per parity; 10,505 conductors at Q = 938, 1.36 million at Q = 30000), so it is about
2e-4 at the top. Two-point slope after subtraction: log(0.108/0.157)/log(32) = -0.108, against the stated
-0.161 +- 0.006. The corrected value sits inside Theorem P's range (-0.10 to -0.13); the stated "steeper by
0.03-0.08" is the baseline. The jackknife error 0.006 does not cover this bias. (Only the Q = 938 baseline was
measured; the value at Q = 30000 is the scaling estimate.)

**E4. The low-frequency zone (item 5b) is reproduced at Q = 938 but is not specific to theta_6.** Same construction
(`band`, exact phases, mean over 12 classes and +-k):

| rows | (1,0) | (1,1) | (2,0) | (3,0) | (3,1) | (5,0) | (20,0) |
|---|---|---|---|---|---|---|---|
| rho-hat | 0.49 | 0.72 | 0.70 | 0.51 | 0.58 | 1.40 | 1.37 |
| random-phase rows, 6 draws | 0.69-1.10 | 0.73-1.25 | 0.70-0.98 | 0.90-1.20 | 0.79-1.40 | 0.61-1.34 | 0.70-1.08 |
| all ones | 0.31 | 0.22 | 0.17 | 0.29 | 0.40 | 0.32 | 0.91 |

* At Q = 938 a single cell of rho-hat is within about 2 standard deviations of the control scatter (0.69-1.10);
  the claim rests on persistence over cells and over Q, which the referee did not rerun at Q = 30000.
* The row m -> 1 shows a deeper zone than rho-hat. The effect is therefore a property of rows that are smooth or
  slowly varying in m paired with conj(pred(c)) = Gauss-sum phases (a smoothed Kubota sum), consistent with the
  note's heuristic reading, and it gives no information particular to theta_6 or to Type-I sums of theta_6.
  "New" should be read as "observed", with the all-ones control added.

**E5 (minor, statistics).** (i) F2 `loo`: KS 0.0037 against 0.0029 (0.0041 on rows prime to 6), excused by the
conjugation tie; pooled mean 1.0025 with nominal error 0.0007. (ii) F3 j = 1, 5: 9 of 11 path points below 1, pooled
0.988; F1 order 2: 9 of 11 below 1, 0.934 +- 0.021 at Q = 30000 with shuffled control 1.030. Both are deficits
(below random), small, and correctly not claimed; the sentence "no group departs from 1 by more than 3%" is right,
"within 3%" for order 2 at Q = 30000 alone is not (6.6%, 3 se). (iii) "876,192 values" are 73,016 characters x 12
classes; classes are tied in pairs, so the KS level is nearer 0.002 than 0.0015. None of this changes the verdict.

**E6 (scope, disclosed).** "Manuscript geometry" is met only in R = Q^1.4 and the weight alpha*nu. The A = c n^3
part (stored by round 2 as `B3`) is not used; S' is empty; conductors lie inside the estimator's own range; the
estimator noise share is 0.17-0.37. The note states all of this in §8. The task's "A = c n^3" is not delivered.

## 3. A way past the stated limit

The note says the regime where TRO6-natural could fail (targets tied to zeros by Theorem D) is not sampled, and
that C-sqrt-2 "is a statement about targets of low complexity" without identifying the property. Sampling 93,486
targets cannot find a bad direction; an optimiser can.
* Maximise t over completely multiplicative unimodular nu directly: X(nu) = sum_c nu(c) x(c) with nu(c) = product of
  prime phases; for one prime pi, X = A + e^{i theta_pi} B, so the optimal theta_pi is closed-form and coordinate ascent
  over the primes of the table converges monotonically. Cost per sweep is that of the Steinhaus control.
* Expected outcome by counting: the window holds about as many free prime phases as a fixed fraction of the
  conductors, so sup t is probably a positive power of the window size, not log. If so, C-sqrt-2 is false for
  general multiplicative nu and the randomness of sampled targets carries no information on the supremum; the
  property needed is then an analytic-conductor bound on nu, and the test should be rerun on the optimiser
  restricted to twists by Hecke characters of bounded conductor (a finite-dimensional maximisation over (k, v, psi)).
* The same optimiser applied to random-phase rows gives the baseline; only a difference between rho-hat and that
  baseline is information about theta_6. This also repairs E1.

## 4. Summary for the orchestrator

* holds: yes, for the claim as worded (MEASURED only).
* Surviving statement: at R = Q^1.4, Q <= 30000, n = 1 part, S' empty, estimator rho-hat at cutoff 1e7: for each of
  93,486 sampled targets the theta-row form is <= 0.0117 of Cauchy-Schwarz at Q = 30000, before and after polar
  removal; t has mean 1 and the Exp(1) law, as it does for arbitrary row vectors; polar share above the projection
  baseline about 0.16 -> 0.11 (slope about -0.11, consistent with Theorem P); Moebius-phased rows under smooth
  twists are below random, as are all-ones rows. No eta > 0. No abscissa. TRO6-natural neither supported
  specifically nor contradicted. RH open.
