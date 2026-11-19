# REFEREE: c13-tnr-invariance-prefilter-noncone-census

Status of this file: second pass by the lane author, written after RESULT.md, with separate code
(`ref_checks.py`, `ref_checks.json`, `ref_checks.log`; sympy determinants, a different section size, different
node sets, different series code). This lane had no means to start an independent agent. **An independent
referee is owed**; until then the lane counts as not independently refereed (`refereeHolds: null`).

## 1. What was re-derived

1. **T-NR object.** Functional equation of q^s pi^(-s/2) Gamma(s/2) zeta(s) D(s) from
   q^(s-1/2) D(s) = q^(s-1/2) + c + q^(1/2-s): by hand. Zero of D at 1/2 + arccosh(c/2)/log q + i pi/log q for
   c > 0: by hand (q^(s-1/2) = -e^(+-theta)). Numbers in RESULT section 5 reproduced from `census_checks.json`.
   Lambda_F(3^k)/log 3 at c = 2.2 recomputed from the roots: 4.8105, -7.52, 22.034, -53.5904; equal to the
   table of `r3-tnr-control`.
2. **Lemma P.** The implication is immediate. Each S item re-checked:
   S1: m_w is a finite sum of exponentials in s, entire, symmetric; a product of a function with a functional
   equation and a symmetric entire factor keeps it. Holds.
   S2a: for c > 0 the coefficients of D are 1, c sqrt(q), q, all positive. Holds. For c < 0 it does not; the
   lemma excludes c < 0. Holds as stated.
   S2b: theta_w(x) = c theta(x) + q^(-1/2) theta(x/q^2) + q^(1/2) theta(x q^2) and theta_w(1/x) = sqrt(x) theta_w(x):
   re-derived from theta(1/y) = sqrt(y) theta(y). Holds.
   S2d: det[K(x_i y_j)] >= 0 at order 2 for a positive K is g(u1 + v1) + g(u2 + v2) >= g(u1 + v2) + g(u2 + v1),
   g = log K(e^.), i.e. convexity of g for continuous g. Sums of log-convex functions are log-convex. Holds.
   S2f: holds only if the step does not track the constant. This is a judgement in each use; it is the item most
   likely to be mistyped (see section 3).
3. **Lemma L.** Cauchy-Binet identity re-derived; checked numerically at one node set with rows a = (-1, 0, 2)
   by summing all 3-subsets of the intermediate index set: relative defect 7.7e-81, 15 non-zero terms, det W
   >= 0.354 in each, det H < 0 in each. The threshold c >= 2: discriminant c^2 - 4 of q^(-1/2) + c z + q^(1/2) z^2.
   The equality case c = 2 was run (150 of 150 at orders 3, 4, 5). The lemma needs the sign hypothesis on zeta's
   minors with lattice rows; that hypothesis is MEASURED, so the conclusion for T-NR is "PROVED from a measured
   input". The verdict line 3 of RESULT.md was amended to say so.
4. **Lemma E.** xi(1/2 - a + it) = conj xi(1/2 + a + it) by xi(1 - s) = xi(s) and reality; so the product is
   abs(xi(1/2 + a + it))^2 and its kernel is the stated convolution. Composition formula applies to the
   convolution of two kernels on the line. Holds.
5. **Edrei-Thoma.** Root criterion evaluated with sympy for five sequences (numerator roots real negative for
   the three T-NR cases, no numerator for E_a) and 1500 random minors of a 14 x 14 section each: 0 negative for
   T-NR (three parameter sets, one of them new: p0 = 5) and E_a (two parameter sets, one new: p = 2, parameters
   5/4 and 4/5); 1 negative (order 7) for the tempered twin. Agrees with the 8 x 8 exhaustive run.
6. **Kernel shape.** Three-point test on the xi kernel of T-NR at u = 0, l/2, l with an independent series
   routine (mp.nsum): midpoint log defect -0.456 (2, 2.0506), -2.579 (3, 2.0785), -2.569 (3, 2.2), -7.642
   (5, 2.0572), and the kernel increases from l/2 to l in all four. Not log-concave, not unimodal. Agrees with
   `h-tnr-geometric` (table line 71).
7. **E_a kernel.** E*(1, 0.7) = E*(1, 0.3) = -2.3309938134 and E*(2, 0.8) = E*(1/2, 0.8) = -2.9054980641 with a
   60-term Bessel sum (independent truncation rule): both symmetries hold; the value equals the record of
   `c12-univ-pointwise-control-wcone`.
8. **Quoted records.** 18 phrases used in the comparison column occur verbatim in `push/OBSTRUCTION_MAP.md`.
   The mechanism-table rows 19, 25, 27, 30, 50 were read from `push/stack-combinator/TABLE.md` (NR column).

## 2. Corrections made during the pass (already applied to RESULT.md and PREFILTER.md)

- E1. First draft of PREFILTER.md: "19 device types with a recorded verdict, 9 passes, 10 failures". Recount from
  the table: 14 device types, 8 recorded passes, 8 recorded failures (devices 14 and 26 have one of each). The
  earlier figure included map rows outside the 37 device types.
- E2. First draft: "E_a has the pattern shifted twice (two polar terms)". The run at 60 digits gives E_a the
  unshifted Polya-frequency pattern (-, -, +, +) at orders 2 to 5 (540 of 540 per order), the same as theta - 1.
  The statement was replaced by the measured one; the mechanism for E_a is not determined.
- E3. The record "theta-normalised kernel of E_a is negative" is true on (1/y*, y*) only (y* = 7.25 to 14.89 for
  a = 0.1 to 0.4); outside it the kernel is positive (xi*(1 + 2a) > 0 dominates). The discriminator "kernel with
  polar terms >= 0 fails for E_a" is unaffected.
- E4. First survey at 30 digits; the rerun at 100 digits stopped at the box 2.5 for theta - 1 (rows underflow to
  zero). Final run: 120 digits, 700 digits in the box 2.5; no zero determinant; smallest relative size 1e-233.
- E5. N4d: T-NR fails only in boxes abs(log) >= 1.6 (0 to 2 of 200 in the boxes 0.5 and 1). Stated in the table.
- E6. First draft of the weakest steps counted 5 inferred cells among the records; there are 8.

## 3. Objections that remain

1. **Typing after the fact.** The device table was typed with the records visible. The agreement of 14 of 14 is
   a consistency check, not a blind test. The part that can still be falsified is the list of predicted passes
   without a record (devices 10, 27, 28, 31, 32, 33, identity parts) and the predicted failure of device 6 at
   Lambda_F >= 0.
2. **Boundary of S2f.** Device 26 is typed "PASS for every step except size at p0" on the strength of
   `r3-tnr-control` (bounded-weight feeding, ARGUED there). The manuscript's normaliser condition
   sup abs(H - 1) <= 1/2 is an inequality with a fixed constant (X5 by the lemma's own list). It is taken here
   as part of the size step, as in row Z18. A reader who types it separately gets the same comparison.
3. **"Reads the functional equation".** In the census the FE column means "condition on the completed function
   or its kernel". No non-identity entry uses s <-> 1-s inside the inequality. The census therefore does not
   contain a candidate of the kind STRATEGY 4.0 (a) asks for, independently of the control verdicts.
4. **N4 is small-sample and local.** Random nodes in boxes abs(log) <= 2.5; 60 node sets per cell for E_a.
   zeta's constant signs at orders 2 to 5 are not proved. If they fail elsewhere, N4b to N4d are void; if they
   are provable, N4d is still passed by theta^w.
5. **Schoenberg argument (census reading 5).** Used for theta - 1 after an exponential tilt (the tilt keeps the
   Polya-frequency property). The theorem is recalled, not opened. The conclusion "the pattern breaks at a finite
   order" is ARGUED.
6. **Controls not run** on the census: unimodular twist, Beurling, phase-rotated transfer operator, backward
   heat on N4. They are in the registered run of `c13-noncone-kernel-separator-search`.

## 4. Requirement flags (second pass)

- R1 false. R2 false. R3 false. R4 false. No statement about zeros of zeta.

## 5. Verdict of the second pass

The two lemmas hold as stated with the reading of item 1.3. The device comparison holds as a consistency
statement (0 disagreements among 14 device types with a record). The census conclusion holds: no entry fails
both T-NR and E_a at a step that is an unconditional input for zeta, is on the completed function, and is not
passed by another control. Verdict "precise obstruction" stands. Score 0. Independent referee owed.

---

# Independent referee pass (adversarial, lens: general), 2026-11-19

Separate agent from the lane author. The author's second pass above is kept unchanged. Own code (own theta
series, own node laws and seeds, exact `fractions` determinants), two runs through `scripts/memcap.sh 8`
(`.venv-arb/bin/python`, under 5 minutes each, under 200 MB; scratch scripts were temporary and are not kept; parameters are stated in section B; not part of
the lane). Server not used. No file other than this one was written in the lane.

**Outcome: holds, with five corrections (R-1 to R-5). The three PROVED lemmas are confirmed. No statement about
zeros of zeta is made, RH is not assumed anywhere, no verified-height input is used. Flags R1 to R4 all false.**

## A. PROVED steps re-derived by hand

1. **Object.** m(s) = p0^(s-1/2) + c + p0^(1/2-s); with z = p0^(s-1/2), z + 1/z = -c. For c > 2: z = -e^(+-theta),
   theta = arccosh(c/2), so Re s = 1/2 +- theta/l, Im s = (2k+1) pi/l; in the open strip iff
   c < 2 cosh(l/2) = p0^(1/2) + p0^(-1/2). p0 = 2, c = 2.0506: 0.5 + 0.2245/0.6931 = 0.8239, pi/l = 4.5324. Agrees.
   D(s) = 1 + c sqrt(p0) p0^(-s) + p0 p0^(-2s), D(1-s) = p0^(2s-1) D(s). Agrees.
2. **Kernel actions.** Substitution x = y p0^(2k) in M[f](s) = int f(x) x^(s/2) dx/x gives
   M[psi(x p0^(-2k))] = p0^(ks) xi*(s); hence the stated weights w_k p0^(-k/2) and, with n = -k, the Lemma L
   weights (p0^(-1/2), c, p0^(1/2)). theta_w(1/x) = sqrt(x) theta_w(x) follows from theta(1/y) = sqrt(y) theta(y)
   and w_k = w_(-k). Phi_w(u) = sum w_k Phi(u + k l). All confirmed.
3. **Lemma P.** The implication is immediate from the definition of W-stability. Items of Proposition S checked:
   S1 (symmetric entire factor keeps the functional equation; Dirichlet convolution of multiplicative functions is
   multiplicative), S2a (coefficients 1, c sqrt(p0), p0 >= 0 for c > 0), S2b, S2c (Bochner, from S2a), S2d (order-2
   dilation minor >= 0 for positive K iff u -> log K(e^u) convex; sums and translates of log-convex functions are
   log-convex), S2e, S3. Confirmed. S2f is a typing convention, not a lemma (the author says so).
4. **Lemma L.** W_(i,m) = omega_(m - a_i); Cauchy-Binet over column sets m_1 < ... < m_k (finitely many non-zero
   terms); the intermediate row nodes x0 p0^(2m) lie on the same lattice, so the hypothesis applies to every
   minor of H; W is a submatrix with increasing rows and columns of (omega_(j-i)); Aissen-Schoenberg-Whitney-Edrei
   for a finite sequence: totally positive iff the generating polynomial has only real non-positive zeros, i.e.
   c^2 >= 4 and c >= 0. Confirmed as a conditional statement (hypothesis on zeta's lattice-row minors is MEASURED).
5. **Lemma E.** xi(1/2 + a + it) = int Phi(u) e^(au) e^(itu) du; xi(1/2 - a + it) = conj xi(1/2 + a + it); product of
   transforms = transform of the convolution; exponential tilt multiplies rows and columns of
   [Phi(u_i - v_j)] by positive numbers; the composition formula
   det[(f*g)(u_i - v_j)] = int over w_1 < ... < w_k of det[f(u_i - w_r)] det[g(w_r - v_j)] dw gives the sign.
   Confirmed.
6. **Closed forms.** N5a: with m(1/2+it) = c + 2 cos(tl), at tl = pi: m' = 0, m'' = 2 l^2, so
   -(log m)'' = -2 l^2/(c - 2): 18.99 (p0 = 2) and 30.75 (p0 = 3) before adding zeta's term; consistent with
   -18.935 and -30.717. E_a at gamma_1: -2/a^2. Lambda_F(3^k)/log 3 = 1 + (-1)^(k+1)(a^k + b^k), a + b = c sqrt 3,
   ab = 3: 4.8105, -7.52 at c = 2.2. E*(i, 0.7): polar part xi*(1.4) + xi*(0.4) = 1.809 - 4.144 = -2.335, plus a
   Bessel part of size 4e-3. Sequences 1, 39/10, 59/10 and roots -0.565, -0.885 of 1 + 2.9x + 2x^2; a_9 = -0.110
   for trace 19/10. All agree.
7. **Schoenberg argument (reading 5).** int (theta(e^u) - 1) e^(-su) du = 2 pi^s Gamma(-s) zeta(-2s) for
   Re s < -1/2; its reciprocal has poles at the zeros of zeta(-2s), so the function is not a Polya frequency
   function of infinite order. The step "some finite order fails" is correct given the theorem (recalled).

## B. Numeric checks rerun with different cases (MEASURED, mpmath 160 digits; 400 digits for lattice rows)

| check | new case | result |
|---|---|---|
| zeta theta kernel, orders 2-5 | uniform box 1.3 (seed 77), clustered nodes (width 0.15, centres in box 1.4), Gaussian nodes; 80 node sets each | signs +, -, -, + on 80 of 80 in all twelve cells; smallest abs(det)/Hadamard 1e-68 |
| order 2 by a different method | second derivative of u -> log theta(e^u) on the grid [-3, 3], step 0.02 | positive at every grid point; minimum 3.1e-24 at the ends; value 0.47366 at u = 0 |
| Lemma L | rows on the 2^2- and 3^2-lattice with random offset, free columns, orders 3 and 4, 40 node sets | zeta: -, - (40 of 40). T-NR c = 2.1 and c = 2: 40 of 40 agree in all cells. c = 1: agrees at order 3, 7 to 8 of 40 opposite at order 4. c = 0.3: 36 to 40 of 40 opposite at order 3, 19 to 20 at order 4 |
| N4c, N4d for T-NR | (p0, c) = (5, 2.3) and (7, 2.05), boxes 1 and 1.6, 80 node sets | order 2: 80 of 80 positive. Order 3: 10, 22, 12, 31 of 80 positive (fails, as claimed). Order 4: 0, 2, 0, 1 of 80 positive |
| N3 for T-NR | three-point log test at u = 0, l/2, l for (7, 2.05), (11, 2.5), (2, 2.1); kernel code checked against xi(1/2 + 3.7i) = 0.361012588926 | midpoint defect -13.14, -24.62, -0.452; kernel rises from l/2 to l in each. zeta at the same nodes: +56.8 |
| Edrei-Thoma, exact | all minors of the 7 x 7 Toeplitz section: T-NR p0 = 7 (c sqrt 7 = 27/5), p0 = 11 (c sqrt 11 = 7), boundary (1 + 2x)^2/(1 - x), E_a p = 5 with p^a = 7/4, T-NR with c < 0 | 0 negative for the first four (1340, 1340, 1340, 1093 positive); 594 negative for c < 0, first at order 1 |
| theta^w control | w = 1/3, 1/2, 2, 3, 3.5, 4, 5, 8, 24; boxes 0.5, 1, 1.6; 100 node sets | see R-2 |

## C. Corrections

- **R-1 (record misquoted; counts change).** Devices 2 and 15 cite "TABLE row 19 (Theorem R): F" for T-NR. In
  `push/stack-combinator/TABLE.md` row 19 the cells DH..B read P, N, F, F, N, N, N: the NR cell is **N (not
  formulable)**, not F. The two F cells are TW+ and TW-. (The row contains two escaped bars, which shifts a naive
  column count by two.) N is consistent with the object: the perturbation of L has weights of size
  (abs(alpha)/sqrt(p0))^k with abs(alpha) > sqrt(p0), outside the summability hypothesis of Theorem R.
  Consequence: device 2 has no pass/fail record for T-NR; device 15 keeps row 27 (F*, an inference). Corrected
  counts: **13 device types with a record, 8 recorded passes, 7 recorded failures, 0 disagreements**; of the 15
  recorded cells 8 are inferences. Rows 25, 27, 30, 50 read F* as quoted. The map phrases for G21, P53, Q22, Z34,
  Q28, P35, G25, P11, G32, P52, D7, Z18 were opened and agree with the table.
- **R-2 (the statement "theta^w passes N4b, N4c, N4d" holds only for the exponents tested).** Positive
  determinants out of 100 (claimed sign for a pass is -):

  | w | order 3: box 0.5 / 1 / 1.6 | order 4: box 0.5 / 1 / 1.6 |
  |---|---|---|
  | 1/3 (80 sets), 1/2, 2, 3 | 0 / 0 / 0 | 0 / 0 / 0 |
  | 3.5 | 0 / 0 / 0 | 21 / 0 / 0 |
  | 4 | 0 / 0 / 0 | 57 / 2 / 0 |
  | 5 | 0 / 0 / 0 | 69 / 19 / 1 |
  | 8 | 80 / 40 / 16 | 0 / 15 / 38 |
  | 24 | 100 / 90 / 80 | 88 / 45 / 15 |

  (smallest abs(det)/Hadamard 1e-40 at 160 digits). So theta^w fails N4d for w >= 3.5 and N4c for w >= 8 in
  measurement. The census conclusion on N4d is unchanged, because one passing control is enough and w = 1/3, 1/2
  and 3 pass in every cell. Two wordings must change: section 6 row "theta^w passes N4b, N4c, N4d" becomes "passes
  for w = 1/3, 1/2, 2, 3; fails N4d from w = 3.5 and N4c from w = 8"; and theta^2 should not be counted as a
  control here, since its Mellin transform is the completed zeta(s) L(s, chi_-4) (Euler product, no known
  off-line zero). The passing controls for N4d are w = 1/2, 1/3 and 3.
- **R-3 (N4d for T-NR depends on (p0, c) and the box).** At (5, 2.3) and (7, 2.05) the order-4 minors have the
  sign of zeta's on 157 of 160 node sets in boxes 1 and 1.6 (0 to 2 of 80 opposite). "N4d fails both controls"
  stands in the sense of one exception being enough, but for T-NR the failure is rare outside p0 = 2, 3; the
  robust T-NR failure among the theta-kernel entries is N4c (order 3).
- **R-4 (wording of the threshold in verdict item 3 and section 2.3).** "Totally positive exactly when c >= 2, i.e.
  exactly when the twin's extra zeros leave the line" is inexact at two places: at c = 2 the weights are totally
  positive and the extra zeros are on the line (double); for c <= -2 the zeros are off the line (real zeros at
  1/2 +- arccosh(abs(c)/2)/l) and the weights are not totally positive. Correct form: for c > 0, totally positive
  iff c >= 2; zeros off the line iff c > 2. Lemma L itself is unaffected.
- **R-5 (novelty labels).** Lemma E is the classical closure of Polya-frequency order k under convolution
  (Schoenberg; Karlin) combined with an exponential tilt; Lemma L is Cauchy-Binet with the
  Aissen-Schoenberg-Whitney-Edrei criterion. Both are correct; they are applications of classical theorems to
  these two controls and should be listed as such, not under "New here" without that qualifier. Log-concavity of
  Phi (N3, k = 2) and the Turan inequalities (N5b) are correctly labelled CLASSICAL. Formal point: the header of
  S1 ("V a linear space") does not cover "multiplicative coefficients"; the parenthetical argument given for it
  is the proof. The functional equation with conductor 1 and the integer Dirichlet series live in two
  normalisations (Laurent form and D form); the result states this under X4.

## D. Controls

No zeta-only mechanism is claimed, so no control run is owed for a mechanism. For the one entry that fails both
T-NR and E_a in measurement (N4d) the theta^w control was rerun with new exponents (R-2): w = 1/2, 1/3, 3 pass.
The E_a rows of the sign table (60 node sets per cell) were not rerun here; the E_a failure at orders 1 and 2
follows from the polar coefficient xi*(2a) < 0 and was checked at one value by hand (A.6). Unimodular twist,
Beurling, phase-rotated transfer operator, backward heat on N4: not run by the lane and not run here.

## E. Requirement flags (set by this referee)

- R1 false: no argument about zeta; multiplicativity is not used in any step that constrains zeros.
- R2 false: no statement at height.
- R3 false: no census entry fails every control; N4d is passed by theta^(1/2), theta^(1/3), theta^3, is measured
  only, and zeta's own sign is not proved.
- R4 false: nothing passes to the critical line.

## F. Verdict

Holds as a precise obstruction after R-1 to R-5. Surviving claim: Lemma P (T-NR with c > 0 satisfies every
hypothesis of type S1 to S3; exclusions X1 to X5), consistent with the 13 device types that carry a T-NR record
(8 recorded passes, 7 recorded failures, each failure at an excluded step; a consistency check typed with the
records visible, not a blind test); Lemma L (conditional on a measured sign hypothesis for zeta) and Lemma E as
applications of classical total-positivity theorems; Edrei-Thoma local total positivity passes T-NR (c >= 2) and
E_a exactly and is closed as a device; in the census of 12 non-cone types no entry fails both T-NR and E_a at an
unconditional input of zeta that another control does not pass. No statement about zeros of zeta. Score 0.
