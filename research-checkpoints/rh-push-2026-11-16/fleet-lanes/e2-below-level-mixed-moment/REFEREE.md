# REFEREE: e2-below-level-mixed-moment

Adversarial referee, 2026-11-18. Scratch code and outputs: `/tmp/e2ref/` (not kept in the repo). Nothing in the
result directory was changed except this file.

**Verdict on the claimed verdict (partial-result): holds, with five corrections.** The measurement and the two
LP tables reproduce. No step assumes RH, none restates verified height, no known theorem is presented as new,
no abscissa is claimed. The result contains no PROVED step beyond two one-line inequalities (confirmed below).
The corrections concern (0) the onset "no change for lam >= 0.8334", which the author's LP contradicts at
lam = 0.85, (1) the wording of item 3 ("not a triangle-inequality loss"), (2) the detector-level
bullet, (3) the error bar and the word "decisive", (4) a wrong numeric statement of the detector level.

## 1. What was re-derived

* Chebyshev count C3 = 1 + lam (Y - 1) - delta Y from H(lam) and |M S|^2 >= U^{delta Y}: confirmed.
* Cauchy-Schwarz line Fmix: sum_B |S_m| <= (sum |M S|^2)^{1/2} (sum_B |M|^{-2})^{1/2}
  <= U^{(R + 1 + lam (r+m-1)_+ - delta r)/2}: confirmed.
* Arithmetic: r* + m* = 1.163954; R_c + delta_c (r* + m*) = 0.5903324 + 0.5462956 = 1.136628; lam threshold
  0.136628 / 0.163954 = 0.83334; C3 - (1 - delta) = (lam - delta)(Y - 1). Confirmed.
* The threshold 1.1452 at m = 1/2 is the numerator-block threshold of `r3-lemma181-b/REFEREE.md` (tie value 2/3,
  theta_0 = 0.0521), not the count threshold. The count threshold at m = 1/2 is R_c + delta_c * 1.2457 = 1.1750.
  RESULT section 3 gives only the count formula, so the two thresholds quoted side by side have different
  definitions. They coincide at m* (three-way saddle). No conclusion changes.
* Lemma 14.2 bracket: N + L + (NL)^{2/3} = N L Z^{-u} with u = min{v, z_a, (v + z_a)/3}. Confirmed; this is the
  "+ z_a - u" of (14.14).
* (13.14) of Liu II read at l.5726: t - 1/2 - eps <= r <= t, r + m >= t, 0 <= m <= 1/2 + eps, 1 <= t <= 3/2. The
  choice t = 1 gives the ranges used. Fixing t = 1 is one admissible choice of the prover, so R_sub is a valid
  upper bound given H(lam); it is not shown optimal.
* Quotes checked in the sources: Lemma 14.2 (l.5682), Lemma 14.3 first step (l.5900-5906, inactive slots, mass
  Z^eps), Lemma 17.2 hypotheses (17.2), terminal step l.7457-7475, Liu II l.3636 ("before squaring"). All present
  as quoted.

## 2. Numeric reruns (different cases)

All through `scripts/memcap.sh 8`. Source recompiled from `mixmom.c`.

Independent recomputation. A separate Python implementation (ideals enumerated by exponent tuples, no tree, no
shared code) of the true-row means with Moebius coefficients at U = 1000 and 3000 (all rows):

| U | rows | mean M^2 | mean (M S)^2 at m*, 1/2, 0.21 | agreement with out/U*.json |
|---|---|---|---|---|
| 1000 | 405 | 0.0708538 | 3.576803e-3, 7.268239e-3, 1.4966168e-2 | all printed digits |
| 3000 | 1207 | 0.0673473 | 6.165852e-3, 5.126309e-3, 7.792064e-3 | all printed digits |

This checks the tree, the Moebius signs, the windows and the row filter. It does not check the symbol against an
external definition (both codes use chi_pi(u) = u^{(N pi - 1)/6} mod pi); that weakness (RESULT 5.1) stands.

New cases (Moebius coefficients, true rows; ratio = true / random-multiplicative baseline):

| case | rows | mean m* | ratio | mean m = 1/2 | ratio |
|---|---|---|---|---|---|
| U = 2e5, all rows | 80,582 | 5.182e-3 | 0.857 | 5.030e-3 | 0.865 |
| U = 3e7, new seed | 60,000 | 4.988e-3 +- 0.041e-3 | 0.863 | 5.021e-3 | 0.877 |
| U = 1e6, r = 0.6 (Y = 1.018 / 1.100) | 120,000 | 5.070e-3 | 0.858 | 5.061e-3 | 0.871 |
| U = 1e6, r = 0.9 (Y = 1.318 / 1.400) | 120,000 | 5.086e-3 | 0.863 | 5.057e-3 | 0.873 |
| U = 1e6, height twist N(n)^{-it}, t = 3.7 | 120,000 | 5.101e-3 | 0.875 | 5.065e-3 | 0.877 |
| same, t = 25.3 | 120,000 | 5.098e-3 | 0.865 | 5.052e-3 | 0.876 |
| same, t = 1000 | 120,000 | 5.161e-3 | 0.885 | 5.095e-3 | 0.884 |

(The height twist was added in a scratch copy `mixt.c`, the same N^{-it} on M and on S; t = 0 reproduces the
original.) The mean is flat in U, in r from 0.6 to 0.9, and in t up to 1000. The measured statement in RESULT
item 1 reproduces and extends to these cases. Largest max/mean in the reruns: 119.

Factorisation check from `out/*.json`: mean(|M S|^2) / (mean |M|^2 mean |S|^2) is 1.056-1.077 for true rows and
1.052-1.089 for baseline rows at every U >= 1e5; baseline single factors equal the diagonal to 0.5%; true single
factors are 0.936-0.952 and 0.929-0.947 of the diagonal. The reading "the ratio 0.87 is the coprimality loss"
is confirmed (expected factor prod (1 - 1/(Np (Np + 1))) over prime ideals of norm >= 7 is about 0.94 per factor).

LP reruns at values of lam not in the logs (`lp_mixed.py lam 0.7 0.3 0.85`, 11.7 minutes): lam = 0.7 gives
0.8736461, lam = 0.3 gives 0.8695150, lam = 0.85 gives 0.8748595. The first two lie between the neighbouring
table entries (0.8740912 / 0.8725036 and 0.8717019 / 0.8691838). The third is below the reference 0.8748864 by
2.7e-5: see 3.0. `lp_gates.py` was not rerun.

## 3. Errors and overstatements

**3.0 "No change for lam >= 0.8334" is false in the author's own model.** `lp_mixed.py` at lam = 0.85 returns
0.8748595, against 0.8748864 for the source system on the same grid and for lam = 0.9. The difference 2.7e-5 is
about 100 times the stated grid error (2e-7). The value 0.8334 is the threshold for the single saddle pair
(r*, m*); in the model the adversary's other pairs and the neighbouring classes respond earlier. From the three
values 0.8333 (-9.9e-5), 0.85 (-2.7e-5), 0.9 (0) the onset is between 0.85 and 0.9 (linear estimate 0.856).
Also, the table row at lam = 0.8333 already shows a gain of 1e-4 (5e-5 in the gated system), which is not
compatible with a threshold at 0.8334. Corrected MODEL statement: no change for lam >= 0.9; first change observed
at lam = 0.85. The size of the effect is small and no other table entry is affected.

**3.1 Item 3 ("the + z_0 charge is not a triangle-inequality loss") is correct about the location in the text
and wrong about the size.** The cited sentence of Lemma 14.3 does concern the inactive slots and costs Z^eps;
`r3-critical-count` 5.1 cited the wrong step. But at the binding point identified by RESULT itself (dual length
v = 0, N of bounded size, u = 0) the bracket of Lemma 14.2 is N + L + (NL)^{2/3} = L = N L. The triangle
inequality over the active tuples gives |sum_P a(P) q_P^{-1/2} ...|^2 <= (sum_P q_P^{-1/2})^2, which is L. So at
v = 0 the Lemma 14.2 bound equals the trivial bound: Z^{z_0} above what orthogonality over P would give. The
sentence "It is a cubic large-sieve term, already smaller than the triangle bound NL" is false at v = 0 (it is
true for v > 0, where u > 0). The quantitative statement of `r3-critical-count` 5.1 ("costs Z^{z_0} more than
orthogonality would") is therefore right in size; only its attribution to the inactive-slot step is wrong.
Corrected statement: the "+ z_0" is the absence of any saving over the active marked tuples at bounded dual
length, entering through the term L of Lemma 14.2; for arbitrary bounded product coefficients it is attained
(take a(P) = conjugate of the character value at one fixed dual index; product form is preserved), so it cannot
be removed without restricting the coefficients. RESULT's consequence (the open statement is cancellation in the
prime sum of cubic Gauss sums for the application's coefficients) is unaffected. The alignment argument is in
fact complete at N of bounded size, where there is a single dual index; the caveat "cancellation between dual
indices was not examined" applies only to v > 0.

**3.2 The detector-level bullet has no content in the absolute normalisation and a wrong number in the relative
one.** The source's detector is |M_r|^2 >> U^{delta r - eps}, |S_m|^2 >> U^{delta m - eps} in the central
normalisation, with unspecified constants. With constant 1, the trivial bound (sum of weights)^2 for S_m is
4.95 at U = 1e6 and 7.90 at U = 3e6 (m = m*), 15.4 and 26.7 (m = 1/2); the levels U^{delta m} are 15.1 and 18.7,
25.6 and 33.1. No unimodular row, including a principal one, can reach the S-level in the complete families.
The tail counts in `analyse.log` (zero rows above U^c for every c >= 0.05) are absolute and are vacuous for the
same reason: the largest |M S|^2 observed is 0.2-0.6. RESULT's text uses the relative reading (level = U^0.546
times the mean; max/mean <= 121 against 1,900-3,450). In that reading the statement has content and is
confirmed, but it rests on a constant of size 200 = U^0.38 at U = 1e6 that the source does not fix. The sentence
"would raise the mean by U^0.137 (6.6 at 1e6; 17 at 1e9)" is valid only in the relative reading. The claim "no row
at detector level in the complete families" should carry the qualifier "relative to the mean; in absolute units
the level is out of range for every row at U <= 3e6".

**3.3 "Decisive test" and "E = 1.000 +- 0.002".** The outcome E = 1 is what the diagonal computation predicts
for these coefficients: for random multiplicative rows the mean is the multiplicative energy of mu-weighted
dyadic windows, which is bounded, and the true family is not expected to differ at t = 0. A violation of H(0) in
a t = 0 mean over U <= 1e9 would have contradicted GRH-level heuristics. The test had almost no chance of the
other outcome and does not bear on whether H(lam < 1) is provable. RESULT says this in part ("could only have
killed"); the heading overstates. The error bar: for U >= 1e5 the fit gives +0.0038 +- 0.0012 with chi2 15.8/6,
and the baseline shows the same drift (+0.0052); neighbouring complete families differ by 2-4% (4.91e-3, 5.18e-3,
4.99e-3 at 1e5, 2e5, 3e5) against row-sampling errors of 0.7%. The scatter is a deterministic window effect,
not sampling noise, so the WLS errors are too small; +- 0.004 is supported, +- 0.002 only for U >= 1e6. The
distance to the thresholds (0.137, 0.145) makes this immaterial.

**3.4 Sampling power above 3e6.** At U = 1e9 the saddle class would have density U^{-0.41} = 2e-4; 8,000 sampled
rows expect 1.6 such rows. At 1e8 (40,000 rows) the expectation is 21, at 1e7 (150,000 rows) 203. The mean test
has power to 1e8 and little at 1e9. Sampled runs above 3e6 also keep rows u = v^6 with N(v) = 19 (19^6 = 4.7e7),
contrary to "this removes all rows divisible by a sixth power in the range"; the statement is true for the
complete families (2U <= 6e6) and the omission has probability about 1e-7 per sampled row.

**3.5 The at-level piece (b = 0.21).** "ratio 0.84-0.94, no trend" is accurate as a range; the fit of the ratio
for U >= 1e6 has slope -0.0057 +- 0.0019 with chi2 101.7/4. The ratio varies with the 2-23 terms of S_b by far
more than its sampling error. No exponent can be read from this piece; RESULT does not read one.

**3.6 H(lam) at lam = 1.** "lam = 1 is a perfect large sieve (not known for r + m > 1 either)" should say that
H(1) is not a theorem at any length for this family; the LP validation "lam = 1 returns the same value" shows
only that the source system does not use more than H(1) would give at the saddle, not that H(1) is available.

## 4. Controls and the three requirements

No zeta-only mechanism is claimed, so there is no control to run against a zero statement. The controls that
apply to the new input were rerun here: random multiplicative rows (same exponent, ratio 0.86-0.89), random
signs and the twisted Moebius function (same exponent at t = 0), height twists. The input H(lam) is blind to
the target and to the row structure, as RESULT states. Davenport-Heilbronn, backward heat, zeta(s+a)zeta(s-a),
T-NR, Beurling, the phase-rotated transfer operator and theta^w were not run by the author or by me; the
statement that the combination inherits their behaviour from the 7/8 architecture is an inheritance claim, not a
test. Requirement 3 is met only through the architecture, as stated. The end-point statement (nothing passes
from the right of 5/6 to the critical line; best MODEL value 13/15) is consistent with the tables.

## 5. Not checked

The validity of R_sub and Fmix as reductions inside Liu II sections 13-14 (same character on witness and
numerator blocks); the base systems `numerator_system.py` and `caps.py`; the gated column (0.8730210); the step
from the scalar system to a zero-free half-plane; the symbol convention against `tmp/sextic/zomega.py`; the
(FP) "known part" sketch; the c1 = 5/3 remark.

## 6. Surviving claim

MEASURED (reproduced, extended to r = 0.6 and 0.9 and to height twists t <= 1000 at U = 1e6): the mixed moment
over the sextic residue-symbol rows has E = 1.000 +- 0.004 for 1e5 <= U <= 1e9 at t = 0, equal to the random
multiplicative baseline up to the coprimality factor, for Moebius, random-sign and twisted coefficients; no row
exceeds 121 times the mean in the complete families (the absolute detector level is out of range for every row
there). MODEL (reproduced at three further lam): the tables of section 3, with the onset corrected to "no change for
lam >= 0.9; 0.8748595 at lam = 0.85". READ: the "+ z_0" charge enters through
the term L of Lemma 14.2 and not through the inactive-slot triangle step; at bounded dual length it equals the
trivial bound over the active tuples and is attained for arbitrary bounded product coefficients. Nothing proved;
no abscissa below 0.874886647; H(lam < 1) is a density-type statement for the twist family.
