# e2-two-scale-detector-moment: restricted fourth moment x two detector scales x Moebius block energy

Internal working note, 2026-11-18. Unrefereed. Nothing committed or pushed. Writes only in this directory.
Everything is relative to unrefereed inputs: the openai/math 7/8 manuscript (`~/lean-deps/qrh-verify/paper.txt`,
Lemma 18.1 at l.9354), Xu-Sang arXiv:2610.15291v2, Liu arXiv:2610.26835v2 ("Liu II"), and PR 14
`rigorous/mobius_bridge_reduction/TARGET_0874.md` (hypothesis (H)). No new zero-free region. No abscissa below
0.874886647 is proved. RH open. NO QED.

**Verdict: precise obstruction. The combination as posed is closed. One pivot was run (section 6); it produced a
measurement, not a proof.**

1. First decisive test (MEASURED, section 1): on prime-conductor sextic rows with U = 2^10..2^19 the detected class
   defined by the source threshold is empty at every U (largest |M_r* S_m*|^2 is 0.52 against a threshold of 1332 at
   U = 2^19). For a rank-defined class of the same size U^R the restricted fourth moment has omega about 0.35-0.37,
   against 0.41 for a random class. Random completely multiplicative sixth-root rows give the same numbers within
   their seed scatter. The statistic does not separate the sextic family from random Euler-type rows, and it does not
   sample rows of the kind hypothesis (H) is about. The LP at any omega >= 0.2 returns 13/15 by saturation; that
   number is a MODEL value with no evidential weight.
2. Structural reason the combination fails (PROVED for the estimate system, sections 2-4):
   (a) the binding numerator block is m* = 0.4183, not the central block m = 1/2. A saving confined to blocks
   m > m* changes the critical-class exponent by at most 1.15e-4 whatever its size;
   (b) at block m*, a class-restricted fourth-moment saving U^-omega is the same statement as a count saving
   U^-omega on the rows whose plain witness is that block (two lines, no Mellin step);
   (c) Lemma 18.1 admits no detector factor of positive length at central length; outside the lemma, any detector
   factor needs a moment at more than 53% of the distance from the large-sieve level to Lindelof-on-average;
   (d) the two-scale bilinear form needs 48-49% of that distance; the one-scale below-level mixed moment needs 16.7%
   and is the cheapest member of the family.
3. One two-scale statement is new relative to the r3 lanes (section 4.1): with t = 1 imposed together with t = t*,
   every row of an extremal class carries a plain witness of length in [0.2543, 0.4183]. Corollary R2 of
   r3-lemma181-a left "long-inverse rows with no plain witness" unconstrained; under the joint detector such rows
   number at most U^(R_c - d) for every d > 0 with the witness range widened by 4.26 d.

Labels: PROVED (argument written here; for system statements: for the stated inequality system) / PROVED-rel
(relative to the sources as stated) / CLASSICAL / READ (structural reading, not re-derived) / MEASURED / MODEL / OPEN.

---

## 0. Plan; what differs from the closed lanes

Read: BRIEF; OBSTRUCTION_MAP rows Z10, Z11, positive item 34, not-covered item 2; SYNTHESIS_R3 sections 3.1-3.3,
4.1-4.3, 5; RESULT of r3-critical-count, r3-lemma181-a, r3-lemma181-b; graph nodes map-open-13,
target-0874-restricted-moment, map-pos-34, mobius-packet-energy-target; PR 14 TARGET_0874.md; manuscript
section 18 statement, 18.1-18.2 and the slot-removal step (l.9316-9665, 10505-10535).

Already on file, not repeated: K = (3R+1)/4 - theta/2 is the LP optimum of C1-C3 (181-b Theorem A); several
detector cutoffs imposed at once still give R_kappa (181-b section 2.4); Theorem R (181-a); Lemmas J, E, W
(critical-count); Theorem B consequence that only a product of total length above 1 containing S_{1/2}^2 lowers K.

Different here: (i) a measurement of the restricted fourth moment on actual sextic rows with two controls;
(ii) the location of the binding block and the price of a central-only saving; (iii) (H) rewritten as level-set
counts, with its value at the witness block; (iv) the detector-factor capacity of Lemma 18.1 read from its proof;
(v) the two-scale joint estimate as one bilinear form with its threshold; (vi) the t = 1 scale applied to the rows
Corollary R2 left open.

Notation (r3-critical-count section 1): delta_c = 0.469345, kappa = 0.749773, R_c = 0.590332, t* = 1.163954,
r* = 0.745700, m* = 0.418254, theta0 = delta/(12 kappa) = 0.052165, q = delta/2 at x = 1/2.
M1(r) = 1 - delta/2 - delta r/2 (r <= 1), long(r) = (1+5r)/6 - delta r (r >= 1),
A_P(m) = M2(m) = 1 - 2 delta m - delta (1-2m)/(6 kappa). M1(r*) = A_P(m*) = long(t*) = R_c (`exact_checks.log`).

## 1. First decisive test: restricted fourth moment on the sextic family  [MEASURED]

Script `restricted4.py` (self-test `selftest.py`: factor-list pipeline equals direct powering on 74 rows x 203
columns, 0 mismatches). Run through `scripts/memcap.sh 8`; planned peak printed per size, largest 5.4 GB at U = 2^19.

Rows: prime ideals pi of Z[w], norm p = 1 mod 3, U <= p < 2U (38,616 rows at U = 2^19). chi_pi(n) is the sixth
root congruent to n^((p-1)/6) mod pi on primary generators of ideals prime to 3. Polynomials, centrally
normalised, dyadic profile sin^2(pi log2 x) on [1,2]: S_m, M_r (Moebius coefficients); also the smooth sum A to
central length (weight exp(-(N/U^(1/2))^2)). Class: the k = ceil(rows^0.590332) rows with the largest score.
Scores: det = |M_r* S_m*|, plain = |S_m*|, inv = |M_r*|, two = min of the normalised |M_r1 S_m*| (pair admissible
at t = 1, r1 = 1 - m*) and |M_r* S_m*|. Share = restricted fourth moment / full fourth moment; omega defined by
share = rows^-omega. Controls: 6 seeds of random completely multiplicative sixth-root rows through the same
pipeline; a random class of size k (omega = 1 - log k / log rows = 0.4095); "self" = the k rows with the largest
target (the smallest omega any class of that size can have).

Target |S_{1/2}|^4 (`analyse.log`):

| U | rows | k | random class | det (true) | det (random rows, mean, sd) | two (true) | two (random rows) | self (true) | self (random rows) |
|---|---|---|---|---|---|---|---|---|---|
| 2^16 | 5690 | 165 | 0.4095 | 0.350 | 0.357 (0.015) | 0.335 | 0.369 (0.021) | 0.132 | 0.126 (0.002) |
| 2^17 | 10722 | 240 | 0.4094 | 0.378 | 0.347 (0.013) | 0.367 | 0.349 (0.017) | 0.134 | 0.131 (0.004) |
| 2^18 | 20424 | 351 | 0.4095 | 0.373 | 0.355 (0.016) | 0.358 | 0.361 (0.016) | 0.141 | 0.135 (0.001) |
| 2^19 | 38616 | 511 | 0.4095 | 0.348 | 0.335 (0.005) | 0.349 | 0.334 (0.004) | 0.149 | 0.140 (0.002) |

Fits.
* Per-U omega, detector class, U = 2^16..2^19: 0.35 to 0.38 for the true rows, 0.335 to 0.357 for random rows.
  The detector class holds 1.3 to 1.9 times the fourth-moment share of a random class of the same size
  (random rows: 1.6 to 2.2 times).
* Slope of log share against log rows over 2^13..2^19: 0.43 +- 0.11 (true rows), 0.27 +- 0.05 (random rows);
  random class 0.413. The slope fit is noise-limited (seven points, k <= 511 rows in the class).
* With the smooth central sum A as target: per-U omega 0.35-0.37 (true), 0.31-0.34 (random rows) at 2^17..2^19.
* Correlation of log|M_r* S_m*| with log|S_{1/2}| is +0.05 to +0.10 at every U >= 2^14.

Threshold class. The source detector asks |M_r* S_m*|^2 >= U^(delta t*). At U = 2^19 the threshold is 1332; the
mean of |M_r* S_m*|^2 is 0.0101 and the largest value over 38,616 rows is 0.52. No row passes at any U, with or
without normalising by the mean. This is what GRH for these rows predicts.

Reading.
1. The fitted omega (0.35-0.37 per U; 0.43 +- 0.11 as a slope) is the value for a class that is nearly
   independent of the central block. It differs from the random-row control by 0.5 to 2.6 seed standard deviations
   at the four largest sizes (0.01-0.03 in omega), so it shows no effect specific to sextic residue symbols at
   this resolution.
2. Hypothesis (H) concerns rows that carry an off-line zero with real part 0.7347. None is present in the sample.
   On such rows the numerator is forced large (section 3), which is the opposite of independence. The measurement
   therefore cannot support (H), and TARGET_0874.md already states that a finite-row experiment is insufficient.
3. MODEL value requested by the assignment (`model_lp.log`, float LP of bypass-78, optimistic conventions, gates
   not imposed, K = max(R, (3R+1-omega)/4)): omega = 0.36 gives 0.8666666 = 13/15; so does every omega >= 0.2
   (omega = 0.025 gives 0.8737351, omega = 0.1197 gives 0.8692124). This is the saturation of the model at K = R,
   not a prediction.

The test does not kill the combination by a number; it shows the number is not available from data. The
combination is closed by sections 2-4.

## 2. The binding block is m*, not the central block  [PROVED for the system C1-C3; uses 181-b Theorem A]

By 181-b Theorem A, at theta = theta0 the block exponent R + tau_m - theta0 m is the same for every m in
[m*, 1/2] (identity I3), and for theta > theta0 the maximum sits at m = m*.

**Proposition 1.** Suppose the restricted fourth moment improves by U^(-omega(m)) on blocks m in (m', 1/2] with
m' > m*, and not at m*. Then N(theta) is unchanged for every theta >= theta0, and for theta < theta0
N(theta) >= (3R+1)/4 - theta0/2 + m*(theta0 - theta). At the tangent geometry (h = 0.793948, l_y = 0.459707;
181-b section 2.3) the critical-class exponent h(N(theta) + theta) - l_y(1/2 + theta) can drop by at most
theta0 (h(1 - m*) - l_y) = 0.052165 x 0.0022 = 1.15e-4, for any omega. The target of TARGET_0874.md needs a drop
of h/160 = 0.00485.

Proof. Block m* is untouched and already attains N(theta0); for theta > theta0 the maximum over m of
min((i), (ii)) is at the crossing m*. For theta < theta0 keep block m* in the maximum and differentiate the class
exponent along it. QED.

Consequence. The price "-0.046 omega" (181-b `price_moments.py`) assumes the saving on every block in [m*, 1/2],
block m* included. "Class-restricted fourth moment at central length m = 1/2" alone is worth at most 1.15e-4 in the
critical exponent at fixed geometry. The geometry was not re-optimised here (weakest step 2).

## 3. At block m*, the restricted fourth moment is a count  [PROVED; two lines]

**Proposition 2 ((H) in level-set form).** Let B be a class with amplitude q (so |Q_sel|^2 >= U^(2 q z - eps) on
B), m <= 1/2, z_m = (1 - 2m)/(6 kappa). The bound

    Sum_{u in B} |S_m(u)|^4 |Q_sel(u)|^2 << U^(1 - omega + eps)                                  (H_m)

holds if and only if, for every sigma, #{u in B : |S_m(u)| ~ U^sigma} << U^(1 - omega - 4 sigma - 2 q z_m + eps)
(dyadic level sets; equivalence up to U^eps when |Q_sel|^2 is two-sided on the class, one direction otherwise).
In particular, for the rows B_P(m) of B whose plain witness |S_m|^2 >= U^(delta m) is that block,

    #B_P(m) << U^(A_P(m) - omega + eps).

At m = m*: #B_P(m*) << U^(R_c - omega). With omega = 1/40, (H) contains a count saving 1/40 on those rows.

Proof. Chebyshev in one direction, dyadic decomposition in the other; A_P(m) = 1 - 2 delta m - 2 q z_m. QED.

Scope. The witness block and the numerator block must be the same polynomial: same presentation (nu = 1, or (H)
taken uniformly over the fixed twists, as TARGET_0874.md requires), same profile family and twist height range.

Remarks.
* This is sharper than Corollary R1 of 181-a, which derives a count saving eta = omega/4 from the first-moment
  form through a Mellin step. The fourth-moment form gives the full omega with no Mellin step.
* With Proposition 1: any improvement of N(theta0) must include block m*, and at block m* the improvement is a
  count saving on plain-witness rows. The restricted fourth moment is therefore not an input independent of the
  critical count (map row Z11); it is the count on the M2 branch, with a moment bound attached for the blocks
  above m*.
* MODEL (`exact_checks.log` (D)): lowering the M2 option by 1/40 at every m moves the saddle to R_c - 0.00409
  (t moves by -0.0112). At the refereed rate -0.138 this alone is -0.00056 in B, against the -0.00088665 that
  TARGET_0874.md books for (H) through K. So (H) carries a count saving that its own derivation does not use.
  Neither number is a bound.
* By Lemma W of r3-critical-count, a count saving at (r*, m*) from second moments at level comes only from prime
  length beyond the M2 capacity z_S = 0.0363. (H) is not of that type, and nothing at level supplies it.

## 4. Two detector scales

### 4.1 The scale t = 1 forces a plain witness on every extremal row  [PROVED-rel detector (13.14) and counts]

At t = 1 the detector gives each row a pair (r1, m1) with 1/2 <= r1 <= 1, r1 + m1 >= 1, m1 <= 1/2. The rows with
a given pair number at most U^min(M1(r1), A_P(m1)). M1 and A_P are decreasing, with M1(r*) = A_P(m*) = R_c.

**Proposition 3.** For d > 0, all rows of a class except at most U^(R_c - d + eps) have, at t = 1,
r1 <= r* + 2d/delta and m1 <= m* + d/0.730, hence a plain witness of length

    m1 >= 1 - r* - 2d/delta = 0.2543 - 4.26 d.

So a class of size U^(R_c) cannot consist of rows whose only witness is the long inverse M_t, t >= t*
(the "second kind" of 181-a Corollary R2). The count R_c is attained only by rows that carry both the pair at
t = 1 with m1 in [0.2543, 0.4183] and their pair at t*.

Consequences (PROVED-rel Theorem R for nu = 1 presentations; `exact_checks.log` (E)).
* Every such row has numerator at least U^(m1 (delta/2 - theta)) on the line 1/2 + theta: at theta0 at least
  U^0.0464. A first-moment saving d for the class then forces a count saving on all nu = 1 rows once
  d > 0.0299 (omega > 0.1197), not only on first-kind rows. The 13/15 target (omega = 0.2, d = 0.05) forces
  a count saving of at least 0.020 on every nu = 1 row and 0.05 on first-kind rows.
* (H_m) at m = m1 gives a count saving only for m1 > m* - (1/40)/0.730 = 0.3840.
* The adversary's joint choice is (r1, m1) = (r*, 1 - r*) at t = 1 and (r*, m*) or (t, 0) from t* on; the flat
  configuration of 181-b section 3 supplies all of them at once, so no bound on R_c follows.

### 4.2 The joint estimate as one bilinear form  [PROVED arithmetic; the estimate itself OPEN]

Any use of two scales that is not the minimum of two one-scale counts is a moment of a product of the two
witnesses. With D_t the detector polynomial at scale t (length U^t, |D_t|^2 >= U^(delta t) on the class):

    J(t1, t2) = Sum_u |D_{t1}(u)|^2 |D_{t2}(u)|^2 = Sum_u |Sum_n c_n chi_u(n)|^2,   c = c^(t1) * c^(t2),      (TS)

a bilinear form in (rows, n) with coefficients the Dirichlet convolution of the two detector coefficient
sequences, length Y = t1 + t2 >= 2. It bounds the class by #B << U^(N - delta Y) when J << U^N.

* At level (N >= max(1, Y)): the count exponent is (1 - delta) Y >= 1.06. Nothing. This case is covered by
  Lemma E, and the list of products of M_r*, S_m*, M_t (t >= t*) contains no length in the window
  (0.87285, 1.11246) of Lemma W2 (`exact_checks.log` (A): empty list for exponents up to 3, 3, 2).
* Below level: (TS) lowers the count iff N < R_c + delta Y. Write f(Y) = ((1 - delta) Y - R_c)/(Y - 1) for the
  fraction of the distance from the level Y to the Lindelof-on-average value 1 that must be proved. Then
  f'(Y) has the sign of R_c - (1 - delta) = 0.0597 > 0: f increases with Y, from f = 0 at Y = 1.1125 to
  1 - delta = 0.5307.

| form | Y | needs N < | f |
|---|---|---|---|
| one scale, M_r* S_m* (SYNTHESIS_R3 item 4) | 1.1640 | 1.1366 | 0.167 |
| two scales, t = 1 and t* | 2.1640 | 1.6060 | 0.479 |
| two scales, t* and t*+ | 2.3279 | 1.6829 | 0.486 |
| two scales, t* and 3/2 | 2.6640 | 1.8406 | 0.495 |

**Not implied by Lemmas J, E, W.** Lemma J concerns Halasz-Montgomery chains with spike ratio <= 1/2 and gives no
bound below trivial; Lemma E and Lemma W concern second moments at level. A bound (TS) with N < R_c + delta Y is
below level by more than 0.55 in the exponent; none of the three lemmas gives or excludes it. Under GRH for the
rows it holds with N = 1 + eps. It is strictly more demanding than the one-scale mixed moment by the measure f,
and no implication between (TS) and the one-scale moment is proved in either direction.

### 4.3 Does the Lemma 18.1 induction admit a detector factor at z = 0?  [READ; no]

Reading of manuscript section 18 (l.9316-9665, 10505-10535):
* The z = 0 clause (all lengths) rests on reflecting each plain factor longer than M/2 once, by the functional
  equation of the primitive character ((18.8)-(18.10)); the padded core has two plain factors with A* <= M + delta.
  A Moebius-coefficient factor M_r has no reflection. A third plain factor at central lengths gives A* up to
  3M/2, outside the core.
* A positive-length passenger is carried only through the pointwise bound (18.12), |Q|^2 <= Z^(kappa z) (needs
  beta_* <= (1+kappa)/2), applied when a child crosses the affine boundary ((18.39): "a removed slot of length d
  decreases A + (6 kappa - 1) z by 6 kappa d"). A detector factor of length y would be carried the same way at an
  affine cost c y with c > 0, so its capacity is (M - n1 - n2)/c, which is 0 at n1 = n2 = M/2.

So the induction as written admits no factor of positive length next to two central plain factors. A detector
factor has to be attached outside the lemma:

**Proposition 4 [PROVED arithmetic].** Let D have length U^y and |D|^2 >= U^(delta y) on B. Then
Sum_B |S_{1/2}|^4 <= U^(-delta y) Sum_u |S_{1/2}^2 D|^2, and a saving U^-omega needs
Sum_u |S_{1/2}^2 D|^2 << U^(1 + delta y - omega). The level is 1 + y, so the fraction of the distance to
Lindelof-on-average is 1 - delta + omega/y >= 0.5307. The largest saving a factor can give is omega = delta y:
0.196 for S_m* (so the 13/15 value omega = 0.2 is out of reach of the plain witness alone even under
Lindelof-on-average), 0.350 for M_r*, 0.546 for M_r* S_m*.
(`exact_checks.log` (C): omega = 1/40 needs fraction 0.590, 0.564, 0.552 for y = m*, r*, t*.)

## 5. The Moebius block-energy form  [READ; relation only]

PR 14's packet S(L) = Sum_d mu(d) d^(-1/2) F(L - log d) is a Moebius sum convolved with a smooth plain sum, and
its energy exponent 0.7496 = 2B - 1 = kappa is the zeta-row analogue of the pointwise prime bound (18.12).
The detector polynomial D = M_r S_m is the same object for the row character: coefficients
c_n = Sum_{d | n, d ~ U^r} mu(d). The one-scale mixed moment Sum_u |M_r* S_m*|^2 has diagonal
Sum_n |c_n|^2 / N(n), which is bounded (CLASSICAL: mean square of truncated Moebius divisor sums,
Dress-Iwaniec-Tenenbaum), so the diagonal contributes U^(1+eps); everything above that is the off-diagonal, i.e.
pairs (d1, d2) of Moebius variables with small common divisor whose ratio is far from a sixth power. That is the
family form of the "signed pairs with small common divisor and large separation" that PR 14 leaves open. No
estimate for it is proved here.

## 6. Pivot (one): the one-scale below-level mixed moment  [MEASURED]

By section 4.2 the cheapest member of the product family is Sum_u |M_r* S_m*|^2 << U^N, N < 1.1366 (level 1.1640).
The stored run contains its row mean (`pivot_mixed.log`):

| U | rows | mean true | mean, random rows (sd) | ratio |
|---|---|---|---|---|
| 2^14 | 1612 | 0.01047 | 0.00981 (0.00024) | 1.067 |
| 2^15 | 3028 | 0.01015 | 0.01029 (0.00020) | 0.987 |
| 2^16 | 5690 | 0.00981 | 0.01025 (0.00015) | 0.957 |
| 2^17 | 10722 | 0.01031 | 0.01005 (0.00015) | 1.025 |
| 2^18 | 20424 | 0.00997 | 0.01017 (0.00009) | 0.980 |
| 2^19 | 38616 | 0.01013 | 0.01006 (0.00009) | 1.007 |

Exponent of the row mean in U over 2^14..2^19: -0.007 +- 0.008 (true rows), +0.003 +- 0.007 (random rows).
Level growth would be +0.164 and the threshold is +0.137. The true mean equals the diagonal (random-row) value
within 7% at every size. So at these sizes Sum_u |M_r* S_m*|^2 is about rows x constant, about 17 standard errors below
the threshold slope.

Limits of this measurement: prime conductors only; the excess length U^(Y-1) is 8.6 at U = 2^19, so few
off-diagonal dual terms exist at these sizes; a mean value in the bulk says nothing about a uniform bound with
the source's profile and twist uniformity. It is consistent with N = 1 + eps and is not evidence about the proof.
Status of the inequality: OPEN (true under GRH for the rows).

## 7. Controls

* Random completely multiplicative sixth-root rows (Euler-type rows without reciprocity or functional equation):
  same restricted-moment omega and same mixed moment as the true rows. The measured quantities do not use the
  arithmetic of the sextic family.
* Random class of the same size: omega = 0.4095; the detector class sits 0.03-0.06 below it for true and random
  rows alike.
* Campaign controls (DH, backward heat, sign twist, unimodular twist, zeta(s+a)zeta(s-a), T-NR, Beurling,
  phase-rotated transfer operator, theta^w): no zero statement is made. Propositions 1-4 are statements about an
  estimate system and hold for arbitrary coefficient arrays; they cannot succeed for a control by accident.
  The open inequalities ((H), (TS), the one-scale mixed moment) contain Moebius coefficients of the row character,
  so they use multiplicativity; they hold for random multiplicative rows on average (section 6), which means an
  on-average form of them does not distinguish the sextic family from the unimodular-twist control. Uniformity
  over the class, not the mean value, is where the arithmetic would have to enter.
* The three requirements: (H) and its relatives are count statements for one family at one scale; they are
  consumed by the zero-free method and are not uniform-in-height statements about zeros.

## 8. Verdict

Precise obstruction.

* MEASURED: the class-restricted fourth moment on prime-conductor sextic rows, U <= 2^19, has omega 0.35-0.37 for
  the rank-defined detector class (random class 0.41, random multiplicative rows 0.335-0.357); the threshold
  class is empty. MODEL LP value at that omega: 13/15 by saturation; not evidence.
* PROVED (system): a saving confined to blocks above m* is worth at most 1.15e-4 in the critical exponent
  (Proposition 1). At block m*, (H) with exponent 1 - omega is a count saving omega on plain-witness rows
  (Proposition 2). A detector factor next to the central fourth moment needs more than 53% of the gap between the
  large-sieve level and Lindelof-on-average (Proposition 4); two scales need 48-49% (section 4.2).
* PROVED-rel: with t = 1 and t* imposed together, every extremal row has a plain witness of length in
  [0.2543, 0.4183] (Proposition 3).
* READ: Lemma 18.1 admits no positive-length detector factor at central length.
* OPEN: (H); (TS); the one-scale mixed moment with N < 1.1366; any count saving at (r*, m*).

Recommendation for the route list: close "class-restricted or amplified fourth moment at central length" and
"joint use of two detector scales" as separate items. Both reduce to a count saving at the pair (r*, m*), for
which the cheapest open inequality is the one-scale below-level mixed moment (SYNTHESIS_R3 item 4) or (M1+).

## 9. Three weakest steps

1. Proposition 2 needs the detector's plain witness and the numerator block to be the same polynomial. The
   sources allow witness presentations nu chi^(+-1) with nu != 1, a bounded family of profiles and twist heights
   up to T_1. The identification holds if (H) is uniform over those, as TARGET_0874.md asks; no source bounds the
   share of nu = 1 rows, and the dyadic position of the witness block against the approximate-functional-equation
   blocks was not checked in the source text.
2. Proposition 1 uses the tangent geometry (h, l_y) and the slope 0.0022 quoted from 181-b section 2.3; the
   geometry was not re-optimised with a central-only saving, and Theorem A itself is a statement about the system
   C1-C3 (its bin bound C2 rests on a sketch). Section 4.3 is a reading of a 170-page proof, not a re-derivation:
   the claim "no detector factor at central length" is about the proof as written, not an impossibility theorem.
3. The measurement uses prime conductors, a rank-defined class (the threshold class is empty), dyadic profiles of
   one shape, U <= 2^19 with at most 511 rows in the class, and a block S_{1/2} with few terms at small U. The
   slope fits have standard errors of 0.05-0.11. Proposition 3 takes the detector (13.14) and the two count
   options from the summary in r3-critical-count section 1 rather than from Liu II directly, and assumes the
   t = 1 pair is counted by the same M1 / M2 options with the same prime amplitudes.

## 10. Files

`PY=.venv-arb/bin/python`; numerics run as
`scripts/memcap.sh 8 $PY -I <script>`.
* `restricted4.py 10 19 6` -> `run_10_19.log`, `restricted4_10_19.json` (about 3 min; peak planned 5.4 GB)
* `selftest.py` -> `selftest.log`
* `analyse.py` -> `analyse.log`; `pivot_mixed.py` -> `pivot_mixed.log`
* `exact_checks.py` -> `exact_checks.log` (saddle, window, fractions f, level-set arithmetic, Theorem R ceilings)
* `model_lp.py` -> `model_lp.log` (MODEL abscissa at given omega; imports `../bypass-78/scalar_system.py`)
