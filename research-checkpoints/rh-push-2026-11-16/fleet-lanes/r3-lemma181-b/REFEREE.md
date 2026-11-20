# REFEREE: r3-lemma181-b (numerator-average loss K = (3R+1)/4, structural redesign)

Adversarial referee, 2026-11-16. Wrote only this file. Scratch code in /tmp/ref181b (not part of the record).

**Verdict: holds, with one overstatement to delete.** No abscissa is claimed; B_flat = 0.874886647 (unrefereed
chain: openai/math manuscript, Liu 2610.12234, Xu-Sang 2610.15291, Liu 2610.26835) is unchanged. Theorem A and
Theorem B are correct as statements about the inequality system C1-C3 (+ M1, detector). The sentence
"only a class-restricted or amplified fourth moment, or a moment of order above 4, lowers K" is NOT proved and is
false as a classification (section 3 below). Suggested strength 0.75.

## 1. Source checks (read in ../bypass-78/dl/2610.26835.txt and ~/lean-deps/qrh-verify/paper.txt)

| item in RESULT | source | status |
|---|---|---|
| Prop 14.3 statement, cases (1)/(2), gate (14.15), identity (14.14), Hoelder (14.17) | lines 6500-6623 | matches |
| M2: two plain factors, n1+n2+6 kappa z <= M, z=0 clause with arbitrary bounded lengths, RHS U^{1+eps} | Thm 12.16 (4798-4812), Prop 2.6 (660-676), 4950-4960 | matches C1 |
| prime sums cannot be repeated | Prop 2.6 "disjoint underlying prime supports"; 6625-6627 | matches (and repetition would only reproduce the L >= 1/(6 kappa) case) |
| capacity (1-2m)/(6 kappa), z_M = (1-r)/2 | manuscript (19.2), lines 11116-11123 | matches |
| 1/3 <= m* <= 1/2, r* >= (6-c)/(10-2c) | (2.9) and 5889-5892 | matches (non-strict 1/3) |
| detector for every t in [1,3/2] | (13.14), 5722-5728 | matches |
| bin bound L^S << U^{eps1} on Re s >= a+6e, height (3i+2)T1 | Cor 13.8(2) | matches; C2 itself is the author's Mellin sketch |
| short blocks by ideal counting U^{m/2} | 6617-6622 | matches; Lemma G replaces it by delta m/2 (sketch) |
| (14.7) = d(N(theta)+theta-z0) - l_y(1/2+theta) + const | 6397 | matches (K+theta/2 = N+theta) |

## 2. Re-derivations

* Theorem A lower bound (flat configuration), by hand: tau-tau pairs reduce to z <= (1-m1-m2)/(6 kappa);
  delta-tau pairs to m1 <= m_x; delta-delta pairs to s <= 2 m_x with slope delta - g/(3 kappa) > 0. All three
  confirmed. Upper bound: Hoelder (3/4,1/4) and C2+C3 are valid for arbitrary (non-flat) nonnegative arrays, so the
  restriction to row-uniform exponents costs nothing. Confirmed.
* Relaxed gate: 1/2 - 3 kappa L <= m_x  <=>  R <= 1 - delta + (6 kappa delta - 2g) L; implied by (14.15) iff
  L <= 1/(6 kappa). Confirmed. For m < m0 certificate (i) rises as m falls while (ii) falls, so (ii) is the
  smaller one there. Confirmed.
* 2.2 count formula R_d = 1 - delta F_S(m_d): confirmed against (2.9) text. 2.4 numbers (0.0384, 0.1024, 0.1173):
  confirmed. Slope h(1-m*) - l_y = 0.00217: confirmed from the quoted geometry.
* 2.3: N is convex piecewise affine in theta, hence (14.7) is convex in theta at fixed d and its minimum is at
  theta in {0, theta0, delta/2}; with slope h/2 - l_y < 0 below theta0 this leaves the two existing designs. This is
  a complete argument for "block mixing = class-by-class choice".
* Theorem B: at most two factors of length >= m* > 1/3; r* + m* = t_kappa > 1; (1-r)/(6 kappa) < (1-r)/2. Confirmed.

Numerics. `numerator_lp.py` rerun: output byte-identical to the log (120 cases; 2 lines with gate (14.15) false
and relaxed gate true). Independent re-solve (own LP, 14 random rational classes, kappa in [0.72,1], grid n=24,
L in {1, 1/5}, theta in {0, theta0, delta/2}, C1 at both z = 0 and maximal z, sigma unbounded below): 84/84 agree
with the formula to 1e-9; adding ideal triple moments changes none. `price_lindelof.py` rerun: 0.8666666 x3.

## 3. Errors and corrections

**E1 (substantive; overstatement in section 4 "Consequence", section 8 and the headline claim).** Theorem B
excludes only inputs of the shape rho + 2 sum sigma + 2q mu + 2gz <= 1 with total length <= 1. It does not show
that a K-lowering input must contain S_{1/2}^2. Counter-category: a mollified second moment with ONE numerator
block and the class's own inverse witness,

  sum_u |S_m(u) M_{r*}(u)|^2 << U^{E},   m in [m*, 1/2]   (total length m + r* >= t_kappa > 1).

On the class |M_{r*}|^2 >= U^{delta r*}, so by one Cauchy-Schwarz the block exponent is (R + E - delta r*)/2 - theta0 m.
At the critical class this is below the tie value 2/3 iff E < 1.1366 (m = m*) ... 1.1452 (m = 1/2); the large-sieve
exponent m + r* is 1.1640 ... 1.2457. So a saving of U^{-0.027} (at m*) rising to U^{-0.1005} (at m = 1/2) over
the large sieve, for all m in [m*, 1/2], lowers K; a Lindeloef-type E = 1 gives block exponent 0.594-0.598.
This is a second moment (not fourth, not order > 4) and it is the natural "way round": M_r S_m has coefficients
(mu * 1) truncated, i.e. 1 plus a tail supported on norms in (U^{min(m,r)}, U^{m+r}], which is the structure
mollified moments exploit. It is not in the sources and not proved here (family of U characters of conductor U,
so length 1.16-1.25 is beyond the large-sieve range). Replace "only" by "among moment inputs of the shape of
Theorem B"; add this row to section 5 as OPEN/MODEL.

**E2 (presentation of the EXACT check).** In `numerator_lp.py` the "primal" value R + min(delta m/2, tau_m) - theta m
and the "dual" value min((ii),(i)) are the same algebraic expression whenever z is uncapped or the block is on
the delta branch. "Primal = dual in exact rationals on 120 cases" is therefore close to automatic. The
non-trivial exact content is the feasibility assertion over 1891 pairs; optimality rests on the hand certificate
(verified above) and on HiGHS (float). The theorem is unaffected; the wording should say so.

**E3 (hypothesis).** Theorem B needs m* > 1/3 strictly; the source gives m* >= 1/3. m* -> 1/3 as delta -> 0, x -> 0.
True at every class with delta >= 1/8 tested (min seen 0.3509), not proved uniformly. Irrelevant at the critical
class (0.4183).

**E4 (dependence on a sketch).** The upper bound N(theta) for theta > theta0 and the L < 1/(6 kappa) case use C2,
i.e. Lemma G (sketch: height allowance, rowwise conductors, S-factors). The obstruction direction (lower bound,
flat configuration) does not use it, as the author states. Lemma G should not be cited as PROVED anywhere.

**E5 (scope, already listed by the author).** "B_flat unchanged at system level" rests on float LPs of bypass-78
and r2-zf-critical-density (not certificates); section 5 prices are MODEL without the Remark 14.1 gates. The flat
configuration is a point of the exponent system; no L-function realisation is asserted.

## 4. Ways round the obstruction (none proved)

1. E1: mollified second moment sum |S_m M_{r*}|^2 with a power saving over the large sieve at length t_kappa..1/2+r*.
2. Not taking absolute values rowwise (mean cancellation of the coupled numerator against theta coefficients):
   the source lists this as a change of input (Section 15.5); it is TRO6-type and outside C1-C3.
3. Section 5 inputs (class-restricted fourth moment, sixth moment).
A larger shift, unbalanced approximate functional equation, repeated prime factors, t-averaging over |t| <= H and
heterogeneous sub-populations were tried against the system and give nothing (each is a feasible flat type).

## 5. Unrefereed inputs the statements depend on

Liu 2610.26835 (Prop 14.3, Thm 12.16, Cor 13.8, Lemma 13.7, (14.3)-(14.7)); manuscript Lemma 18.1 and (19.2);
Xu-Sang and Liu 2610.12234 only through B_flat and the kappa range. No Lean-checked statement is touched; 7/8
remains the checked value.
