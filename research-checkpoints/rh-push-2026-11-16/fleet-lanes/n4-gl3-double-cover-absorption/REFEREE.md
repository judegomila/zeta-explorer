# REFEREE: n4-gl3-double-cover-absorption (2026-11-17)

Adversarial referee, general. Read: BRIEF (all notices), OBSTRUCTION_MAP (rows G18, Z14, Z15, section 6), RESULT.md,
test1.py/test1b.py/test2.py and logs. All referee runs local, single process, through `scripts/memcap.sh 8`,
`.venv-arb/bin/python`; largest allocation 58 MB (printed first); total run time under 2 minutes. No ssh.
Referee scripts (not part of the lane): `/tmp/ref-n4/ref1.py`, `ref2.py`, `ref3.py`.

**Outcome: the verdict (precise obstruction; kill condition met) holds.** Every PROVED step was reproduced
independently. One stated lemma clause is false as written (Lemma 1(i), Whittaker normalisation), two readings of
the measurement are not supported, and Theorem E2(4) is worded more widely than its proof. None of these changes
the kill. No RH assumption, no restatement of verified height, no zero statement, no novelty claim that needs a
literature search (all objects are cited as classical).

---

## 1. PROVED steps re-derived

| step | check | result |
|---|---|---|
| (a) invariance of f under sigma_1, sigma_2 | own code, q = sqrt(p) as a symbol, `cancel(together(...))` | 0, 0. Confirmed |
| action is a group action | sigma_1^2 = sigma_2^2 = id and braid relation 121 = 212 on a generic rational test function | all True (not checked in the lane; needed for (b) to mean anything) |
| (b) uniqueness | bidegree <= (3,3): only c(1 - xy). Extended to bidegree <= (4,4) (25 unknowns): still only c(1 - xy) | Confirmed and strengthened |
| (b) sensitivity | wrong denominator (1-x)(1-y)(1 - x^2 y^2) (no p): only N = 0. Denominator (1-x^2)(1-y^2)(1 - p x^2 y^2): only c(1+x)(1+y)(1 - xy), the same f | the test does detect a wrong p-power; f is the unique invariant of this family |
| (c) columns = L_p Q | by hand: Q_{p^j} = (1 - chi x) sum_{b<j} (p x^2)^b + (p x^2)^j, so L_p Q = sum_{b<j} (p x^2)^b + (p x^2)^j/(1 - chi x). Globally: series built from Z = sum_d L(s, chi_{d0}) Q_d(s) d^{-w} for odd m <= 150, d <= 4000 reproduces the table for p = 3, 5, 7 | Confirmed |
| (d), (e) row-linear coefficient | from the closed form above the x^1 coefficient is 0 for every j >= 1 and every chi; sympy for j = 1..4 | Confirmed |
| (f) | (1 - y) + (1 - x) - (1 - x)(1 - y) = 1 - xy | Confirmed by hand |
| (g) group order 6, s-images s, 1-s, s+w-1/2, w, 3/2-s-w, 1-w | by hand | Confirmed |
| (h) N = (1 - xy)(1 + x)(1 + y) | by hand; and globally by Moebius inversion of zeta(2s) zeta(2w) zeta(2s+2w-1) on the integer array: p-part = [[1,1,0],[1,0,-1],[0,-1,-1]] for p = 3, 5, 7 | Confirmed |
| Lemma 1(iii) | global array: series normalisation a(p, d0 p^2) = a(p, d0 p^4) = 0; Whittaker H_N(p, d0 p^2) = -chi_{d0}(p), H_N(p, d0 p^4) = 0, for p = 3, 5 and d0 = 1, 7, 11, 13, 17 (both signs of chi) | Confirmed |
| Lemma 2 (slice; labelled ARGUED) | H_N(m, d0 m^2) = mu(m) chi_{d0}(m) H_N(1, d0) in 309 of 309 cases (d0 odd squarefree < 200, m odd, gcd(m, d0) = 1, d0 m^2 <= 4000, including non-squarefree m with target 0) | Confirmed in the Goldfeld-Hoffstein/CFH model (sign +1 there). Reciprocity signs of the Gauss-sum normalisation not tested |
| Lemma 3 | follows from the closed form in (c) | Confirmed |
| Theorem E2(2) region | image of {sigma>1, omega>1} under sigma_2 is {omega<0, sigma+omega>3/2}: sigma = sigma' + omega' - 1/2. Boundary line through (1,1), (3/2,0) is 2 sigma + omega = 3 | Confirmed, with the remarks in 2.2 |
| g(p, p^2) = -p | sum over a mod p^2 coprime to p of e(a/p) = p * (-1) | Confirmed |

Memory of the sources: the referee's own recollection of Chinta-Gunnells (D(x) = product over positive roots of
(1 - q^{d(alpha)-1} x^{2 alpha}), N = (1 - xy)(1 + x)(1 + y) for A_2, n = 2) agrees with the note. Neither the lane
nor the referee opened the papers. The (4,4) uniqueness and the wrong-denominator probe reduce the exposure to: the
form of the action itself, which satisfies the group relations.

## 2. Errors and overstatements

**2.1 Lemma 1(i) is false in the Whittaker normalisation for non-squarefree d. [ERROR, does not affect the kill]**
The note states: "p not dividing d: the coefficient at (m, d) = (p, d) is +chi_d(p) in both normalisations."
In the series normalisation this holds (0 mismatches in 8311 cases, p in {3,5,7,11,13}, odd d <= 4000). In the
Whittaker normalisation H_N(p, d) = chi_d(p) H_N(1, d), and H_N(1, d) = 0 unless d is squarefree (N has no
monomial y^2 x^0). Measured: 1335 mismatches, all at non-squarefree d, all with H_N = 0 (examples (p, d) = (5, 9),
(7, 9), (3, 25)); 0 mismatches at squarefree d. Corrected statement: +chi_d(p) for d squarefree, 0 otherwise.
The coefficient is still never a negative multiple of the symbol off the slice, so the first clause of the
decision rule is met as claimed.

**2.2 Theorem E2(2): proof wording and scope. [GAP in the written proof; conclusion stands]**
- "The hull of the two convex sets" is not by itself a continuation argument: the two tube domains are disjoint
  (omega > 1 and omega < 0). The region is obtained directly from the convexity bound
  L(w, chi_c) << c^{(1-omega)/2+eps} in 0 <= omega <= 1, which gives absolute convergence for 2 sigma + omega > 3.
  With this sentence added the stated region is proved.
- The term c = 1 is zeta(w): the statement needs "away from w = 1" (or the factor (w - 1)).
- sigma_2 for each c needs the split by c mod 4 (conductor c or 4c, parity of chi_c); "conductor factor
  c^{1/2-w}" is correct only up to these classes. Standard, not written.
- The region is what "sigma_2 and convexity" reach; it is not the largest region reachable by classical inputs.
  The quadratic large sieve (Heath-Brown) gives sum_{c<=X} abs(L(w, chi_c)) << X^{1+eps} for omega >= 1/2, hence
  {sigma > 1, omega >= 1/2} and by sigma_2 {sigma + omega > 3/2, omega <= 1/2}. The infimum of Re s is still 1,
  so "inf Re s = 1" survives. It is a statement about the estimate system, not a natural boundary: for
  x = abs(mu) the function continues further through the row functional equation.

**2.3 Theorem E2(4) is worded as "the system has no design"; the proof covers two designs. [OVERSTATEMENT]**
Covered: c = H, and a bounded x inserted in one variable. Not covered: coefficients inserted in both variables,
residues of Z on its polar lines, and the objects in section 7 items 1-2 (already listed by the note). The
statement should read "neither of the two designs examined".

**2.4 Measurement readings (section 5; declared not to bear on the verdict). [TWO UNSUPPORTED SENTENCES]**
Rerun with independent code (own Jacobi symbol, float64) at different sizes Z = 3000 and Z = 6000:

| Z | mu [sqfree, square, other] | abs(mu) | random signs mean (sd) | coprimality diagonal (exact) |
|---|---|---|---|---|
| 3000 | 0.744, 3.52, 0.326 | 0.601, 894, 0.174 | 0.874 (0.028), 0.80 (1.10), 0.723 (0.131) | 0.873, 0.849, 0.717 |
| 6000 | 0.830, 2.83, 0.368 | 0.623, 1771, 0.180 | 0.871 (0.019), 0.79 (0.83), 0.732 (0.074) | 0.873, 0.843, 0.720 |

- The table of the note is reproduced in kind (abs(mu) square rows 0.298 Z and 0.295 Z; mu square rows O(1)).
- The random-sign mean is exactly the density of pairs with gcd(c, d) = 1 (0.873 on squarefree rows): the control
  measures the vanishing of the symbol, nothing else.
- "mu is below the random mean ... at Z = 8000 by 5.7 control standard deviations" is not a stable figure. The
  sequence over Z = 1000, 2000, 3000, 4000, 6000, 8000 is 0.659, 0.644, 0.744, 0.811, 0.830, 0.776; at Z = 6000 the
  gap is 2.2 control sd. The spread of the random controls is not the scale of the fluctuation of the mu value
  across Z. Supported statement: order 1, below the coprimality diagonal at all six sizes, no trend resolved.
- "The whole difference between mu and abs(mu) is in the square rows" and "the non-square rows do not separate mu
  from a sign pattern" are too strong. On the "other" rows (non-square, non-squarefree) mu gives 0.33-0.37 at
  every size, random signs 0.72 (sd 0.07-0.13), abs(mu) 0.17-0.19: a factor-2 separation of mu from random signs
  in the same direction at every Z, not mentioned in the note. It is an O(1) factor, so the qualitative conclusion
  (no power of Z outside the coherent rows) is not contradicted.

## 3. Controls

The note claims no zeta-only mechanism and makes no zero statement, so there is no step that must fail for the
controls. Checked what can be checked:

- **Character-twisted Moebius (the DH-type component, x_c = mu(c) (c/5)); run by the referee.** Rows
  [squarefree, square, other, d = 5 * square]: Z = 3000: 0.801, 0.546, 0.838, 9.86; Z = 6000: 0.825, 0.100, 0.744,
  8.50. With abs(mu)(c/5): d = 5 * square rows 784 and 1575 (0.26 Z). The coherent set moves from squares to
  5 * squares and the non-coherent rows stay O(1): the row-norm picture is the same for the twisted object. Nothing
  in section 5 is specific to zeta, in agreement with the note's table (DH: "each has its own group").
- **Sign twist.** Theorem E2(2) is by construction independent of x; the lane's random multiplicative signs and
  the referee's random signs give the coprimality diagonal. Consistent with "sigma_2 holds, sigma_1 lost".
- **Backward heat.** Not formulable for a coefficient identity; agreed. No step would need it.

## 4. Other checks

- RH or GRH assumed: no. The remark that 1/L(s, chi_d) is separated from Re s < 0 by poles is unconditional.
- Verified height restated: no.
- Known theorem presented as new: no. f, Q_d, N and the S_3 functional equations are cited as classical
  (Goldfeld-Hoffstein, Chinta-Friedberg-Hoffstein, Chinta-Gunnells, Brubaker-Bump-Friedberg-Hoffstein). Lemma 2
  is a one-line consequence of N; Theorem E2 is internal bookkeeping relative to `ap-order-two`. No literature
  search was needed because no novelty is claimed.
- Label audit: Lemma 1 is "PROVED from the p-part, ARGUED globally". The referee's global array confirms it in
  the Q_d model (with the correction 2.1). The identification with Whittaker coefficients of the metaplectic
  Eisenstein series (weakest step 1) remains CLASSICAL-recalled and unverified by both lane and referee; the
  2-adic and archimedean factors are untested.
- Scope of the verdict: "effective order 2 is not supplied by the double cover of GL(3) through its Borel
  Eisenstein series" is supported for the coefficient array H and for one-variable insertion. The sentence
  "contour operations ... cannot select the slice" stays ARGUED (as labelled).

## 5. Surviving claim

The quadratic A_2 p-part f = (1 - xy)/((1 - x)(1 - y)(1 - p x^2 y^2)) is invariant, unique over its denominator up
to bidegree (4,4), and its columns are L_p Q. Row-linear coefficients are +1 or 0 in the series normalisation; in
the Whittaker normalisation they are +chi_d(p) for squarefree d coprime to p, -chi_{d0}(p) at d = d0 p^2 only, and
0 otherwise. The Moebius-times-symbol term lies on the slice d = d0 m^2 with generating function
d0^{-w}/L(s + 2w, chi_{d0}) (verified in the Q_d model for 309 cases). The inserted-coefficient series Z_x has
sigma_2 only and the two tools sigma_2 + convexity (also the quadratic large sieve) reach inf Re s = 1. The kill
condition fixed in advance is met. No zero statement. OBSTRUCTION_MAP section 6 item 1 stays open for the theta
representation and the cuspidal/maximal-parabolic objects on the double cover of GL(3).

Required corrections to RESULT.md: Lemma 1(i) (2.1); one sentence in the proof of E2(2) plus the w = 1 pole (2.2);
wording of E2(4) (2.3); the two measurement sentences (2.4).
