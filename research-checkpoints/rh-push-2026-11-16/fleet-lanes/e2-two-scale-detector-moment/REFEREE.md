# REFEREE: e2-two-scale-detector-moment (adversarial, 2026-11-18)

Wrote only this file. Scratch code in /tmp/ref_e2 (not part of the record). All local runs through
`scripts/memcap.sh 8`; largest planned allocation 1.7 GB. The compute server was not used.

Claimed verdict: precise obstruction; combination closed as posed; no abscissa moved.
**Referee verdict: holds, with five corrections (E1-E5) and three narrowings (N1-N3).** No PROVED step is false.
Two MEASURED statements are described incorrectly (row count, pivot error bar) and one summary sentence states
more than Proposition 2 proves. Nothing here is a zero-free region; everything stays relative to the unrefereed
manuscript, Xu-Sang 2610.15291, Liu 2610.26835 and PR 14 (H). RH is not assumed anywhere (GRH appears only in
remarks of the form "true under GRH"), verified height is not used, no known theorem is presented as new.
Suggested strength 0.7.

## 1. PROVED steps re-derived

**Constants.** M1(r*) = A_P(m*) = long(t*) = 0.5903323535; r* + m* = t*; theta0 = 0.0521652; M1(1) = 1 - delta.
Recomputed.

**Proposition 1 (binding block m*).** Confirmed for the system C1-C3.
* By hand: with the saving only on blocks m > m', m' > m*, the flat configuration with sigma lowered on those
  blocks stays feasible (every C1 instance only loses), and block m* still gives rho + sigma_m* - theta m* =
  R + m*(delta/2 - theta), which equals certificate (i) at m* because (i) = (ii) there. So N(theta0) is unchanged
  and N(theta) >= N(theta0) + m*(theta0 - theta) below theta0. The class exponent then has slope
  h(1 - m*) - l_y in theta along that bound.
* Brute force (own script, grid of 5001 blocks x 901 shifts, min over theta of h(N + theta) - l_y(1/2 + theta)):
  drop 1.118e-4 for m' = m* + 1e-4 at omega = 0.025, 0.2 and 0.41 alike; 1.6e-7 for m' = 0.45; 0 for
  m' = 0.4999. Saving on all blocks including m* at omega = 0.025: drop 4.962e-3 = h omega/4. So the statement
  and its independence of omega are correct.
* Numbers: slope = 0.0021694, bound = theta0 x slope = 1.132e-4. The note's 1.15e-4 comes from rounding the slope
  to 0.0022; it is a valid upper bound. See E4 for the mixed values of h.
* Scope as stated by the author: fixed tangent geometry. The headline sentence omits "at fixed geometry".

**Proposition 2 (level sets).** The implication (H_m) => #B_P(m) << U^(A_P(m) - omega) is correct (Chebyshev with
|Q_sel|^2 >= U^(2 q z_m), sigma >= delta m/2, and A_P(m) = 1 - 2 delta m - 2 q z_m). Supply check: z_m* = 0.0363
is below the physical supply 0.21. The summary sentence overstates it: see E3.

**Section 4.2 (bilinear form arithmetic).** #B U^(delta Y) <= J << U^N gives the count N - delta Y; at level it is
(1 - delta) Y >= 1.06; f(Y) = ((1 - delta) Y - R_c)/(Y - 1); f' has the sign of R_c - (1 - delta) = 0.0597.
Table reproduced: f = 0.1667, 0.4794, 0.4857, 0.4948; f = 0 at Y = 1.11246. f(t*) = 1/6 exactly, because
long(t*) = R_c gives (1 - delta) t* - R_c = (t* - 1)/6 (the note prints 0.167 without the identity).
List (A): none of r*, 2m*, r* + m*, 3m*, t* lies in (0.87285, 1.11246). Confirmed.

**Proposition 4.** Sum_B |S_1/2|^4 <= U^(-delta y) Sum_u |S_1/2^2 D|^2; needed exponent 1 + delta y - omega against
level 1 + y; fraction 1 - delta + omega/y. Confirmed, with delta m* = 0.1963, delta r* = 0.3500, delta t* = 0.5463
and fractions 0.590, 0.564, 0.552 at omega = 1/40. Extra check not in the note: using |D|^(2k) instead of |D|^2
gives fraction 1 - delta + omega/(k y), still above 1 - delta, so powers of the detector do not evade it.

**Proposition 3 (PROVED-rel).** Confirmed. Rows with r1 > r* + 2d/delta number at most U^(M1(r1)) < U^(R_c - d)
(M1 slope -delta/2; conditions r + 2z < 1 and 2r + 8z < 3 hold for 1/2 < r1 <= 1 with z = (1 - r1)/2 <= 0.127,
inside the supply); rows with m1 > m* + d/0.7300 number at most U^(A_P(m1)) < U^(R_c - d); then
m1 >= 1 - r1 >= 0.25430 - 4.2613 d. Consequences recomputed: forced size U^0.04641, threshold d > 0.02992
(omega > 0.1197), 0.0201 at d = 0.05, and 0.3840 for (H_m1). See N1.

## 2. Numeric reruns with different cases

**(a) Half-octave sizes, new seeds** (`restricted4` functions, U = 2^12.5 ... 2^17.5, 4 seeds from 777000+):

| U | rows | mean D^2 true | random rows (sd) | ratio | det omega true | random rows (sd) | over threshold |
|---|---|---|---|---|---|---|---|
| 2^12.5 | 630 | 0.01052 | 0.01070 (0.00123) | 0.983 | 0.274 | 0.379 (0.017) | 0 |
| 2^13.5 | 1180 | 0.01158 | 0.01045 (0.00073) | 1.109 | 0.339 | 0.399 (0.011) | 0 |
| 2^14.5 | 2204 | 0.01072 | 0.01005 (0.00041) | 1.066 | 0.365 | 0.360 (0.021) | 0 |
| 2^15.5 | 4162 | 0.00981 | 0.01004 (0.00023) | 0.977 | 0.345 | 0.373 (0.023) | 0 |
| 2^16.5 | 7790 | 0.01024 | 0.01004 (0.00035) | 1.020 | 0.377 | 0.366 (0.006) | 0 |
| 2^17.5 | 14804 | 0.00992 | 0.01002 (0.00004) | 0.990 | 0.361 | 0.346 (0.017) | 0 |

The threshold class is empty at every size (largest |D|^2 0.43 against 755 at 2^17.5). The mixed moment is
rows x 0.0100 within 2% from 2^15.5 on. The restricted-moment omega of true rows is inside the random-row scatter
from 2^14.5 on. These reproduce the note's three measured conclusions at sizes it did not run.

**(b) MODEL LP at other omega:** 0.05 -> 0.8725663 (matches 181-b), 0.15 -> 0.8677095, 0.19 and 0.25 ->
0.8666666. Saturation at 13/15 sets in between 0.15 and 0.19, so "every omega >= 0.2" is correct.

**(c) Controls.** No zeta-only mechanism and no zero statement is claimed, so there is nothing a control must
fail. The one control that the measurement has (random completely multiplicative sixth-root rows, the family
analogue of the unimodular twist) was rerun with new seeds in (a) and behaves as reported. Propositions 1-4 are
exponent arithmetic valid for arbitrary arrays, as section 7 of the note says.

## 3. Corrections

**E1 (MEASURED, section 1 and 6): the true rows are exact conjugate duplicates; the row counts are doubled.**
`rows_true` emits both (p, w) and (p, w^2), i.e. pi and its conjugate. The column set, the weights and mu are
invariant under conjugation and chi_conj(pi)(n) = conj(chi_pi(conj n)), so every polynomial takes complex-conjugate
values on the two rows. Checked: max |P(pi) - conj P(conj pi)| = 2.5e-15, 3.5e-15, 6.5e-15 at U = 2^13, 2^15, 2^16.
So "38,616 rows at U = 2^19" is 19,308 independent rows, each counted twice, and the class of "511 rows" is 255 or
256 distinct rows. The random control rows have no such pairing. Effects: (i) the shares and the row mean are
unchanged (the class fraction k/rows is the same for true and random rows), so no reported value moves by more
than sampling noise; (ii) the sampling noise of the true rows is about 1.41 times the seed scatter of the random
rows, so "differs by 0.5 to 2.6 seed standard deviations" should read about 0.4 to 1.8; (iii) the selftest cannot
see this. De-duplicated values (own run, class ceil(n^0.590332) of the distinct rows): det omega 0.279, 0.414,
0.356 at 2^13, 2^15, 2^16 against 0.257, 0.411, 0.350 in the note. The reading "not family-specific at this
resolution" stands, and is slightly better supported than stated; the description of the sample is wrong.

**E2 (MEASURED, section 6 and the claim): the pivot exponent -0.007 +- 0.008 and "17 standard errors" depend on
the fit window.** From the stored JSON:

| window | true exponent | (threshold - exponent)/se |
|---|---|---|
| 2^10..2^19 | +0.040 +- 0.016 | 6.1 |
| 2^13..2^19 | +0.045 +- 0.031 | 3.0 |
| 2^14..2^19 | -0.007 +- 0.008 | 17.6 |
| 2^16..2^19 | +0.009 +- 0.015 | 8.3 |

The true-row mean jumps from 0.0074 at 2^13 to 0.0105 at 2^14 (ratio to random rows 0.75 -> 1.07; the half-octave
points give 1.11 at 2^13.5), and the reported window starts just after the jump. `analyse.log` already prints
+0.045 +- 0.031 for the window from 2^13; the note quotes only the other one. Supported statement: the exponent
lies between -0.01 and +0.05 in every window and is below the threshold +0.137 by 3 to 18 standard errors
depending on the window. The qualitative conclusion (no level growth; consistent with N = 1 + eps; inequality
OPEN) is unchanged, and the author's caveat that the excess length is only U^0.164 = 8.6 at 2^19 remains the
dominant limitation.

**E3 (summary item 2(b) and the claim line: "is the same statement as a count saving").** Proposition 2 proves one
direction at the witness threshold: (H_m*) implies #B_P(m*) << U^(R_c - omega). The converse is not a count
saving on plain-witness rows. It needs (i) the graded counts #{|S_m*| ~ U^sigma} << U^(R_c - omega + 4(delta m*/2
- sigma)) for all sigma in the band (delta m*/2 - omega/4, delta m*/2], i.e. on rows just below the witness
threshold, and (ii) a two-sided bound on |Q_sel|^2 on the class. The body of Proposition 2 says this correctly;
the summary and verdict do not. Also, the identification of the detector's plain witness with the numerator block
is an assumption: TARGET_0874.md says "the detector and numerator characters need not coincide". The author lists
this as weakest step 1, but the label on Proposition 2 should then be PROVED-rel (same polynomial), not PROVED.
The MODEL remark "(H) carries a count saving its own derivation does not use" inherits the same condition.

**E4 (Proposition 1, numbers).** The slope 0.0022 uses h = 0.793948 (tangent geometry of B_flat); the comparison
value "h/160 = 0.00485" uses h = 97/125 from TARGET_0874.md. With one geometry it is 0.793948/160 = 0.00496.
The ratio (about 1 : 43) and the conclusion do not change.

**E5 (labels, summary item 2(c)).** "Lemma 18.1 admits no detector factor of positive length at central length"
is listed under the header "PROVED for the estimate system" in the summary and is labelled READ in section 4.3 and
in the verdict. READ is the correct label. Further, the sentence "a detector factor of length y would be carried
the same way at an affine cost c y" describes an extension the manuscript does not contain: (18.12) and (18.39)
(checked at l.9588 and l.10514-10527) carry prime slots only, through a pointwise bound that has no counterpart
for a Moebius-coefficient factor on a class where that factor is large by definition. What the text supports is
the weaker statement: Lemma 18.1 has plain factors and prime slots, no Moebius factor in any position, and its
z = 0 clause has exactly two plain factors.

## 4. Narrowings

**N1 (Proposition 3, novelty and wording).** The proof uses the scale t = 1 and the two count options only; the
scale t* enters only through the definition of "second kind" rows. "Every extremal row" means: for each d > 0,
all rows but at most U^(R_c - d + eps), with the range widened by 4.26 d on the left and 1.37 d on the right;
d = 0 is not available. The known saturating configuration (r3-critical-count Lemma W1; 181-b section 2.4)
already carries the pair (r*, m*) at every t <= t*, so the new content is that this is forced, which constrains
the rows left open by Corollary R2 of 181-a. It gives no bound on R_c, as the note says.

**N2 (section 4.2, "any use of two scales ... is a moment of a product").** Not proved; it is a description of
the uses considered. The fraction f is a bookkeeping measure of how far below level a bound must be. It is not
a statement that a smaller f is easier to prove, and no implication between (TS) and the one-scale moment is
shown (the note says so). "Any detector factor needs more than 53%" refers to the attachment of Proposition 4
(and its powers, section 1 above), not to every conceivable use of a detector next to the fourth moment.

**N3 (section 1, range and small sizes).** The headline "omega 0.35-0.37" is 0.348-0.378 in the table for the
detector class. At U = 2^12.5, 2^13 and 2^13.5 the true rows have det omega 0.26-0.34 against 0.36-0.40 for
random rows (about 2 to 4 standard deviations after the correction of E1; the scatter is estimated from 4 to 6
seeds); at 2^10 and 2^11 they are lower by about one standard deviation. This small-size difference is what
produces the slope gap 0.43 against 0.27 and is not discussed. It disappears from 2^14 on.
"Not family-specific" is supported for 2^14 <= U <= 2^19 only. Section 5 cites Dress-Iwaniec-Tenenbaum for the
bounded diagonal; that theorem is for rational integers with sharp truncation, and the Eisenstein smooth-dyadic
analogue is assumed, not cited. The measured constant 0.0100 is consistent with boundedness.

## 5. Checks against the brief

* RH / GRH assumed: no. Verified height restated: no. Known theorem presented as new: no (Propositions 1-4 are
  exponent arithmetic on the r3 system; Proposition 3 is elementary and labelled relative to the sources).
* Source lanes used as inputs (r3-lemma181-a, r3-lemma181-b, r3-critical-count) each have a referee report with
  verdict "holds"; Proposition 1 is consistent with the 181-b referee's deletion of the sentence that a
  central-length input alone lowers K, and sharpens it: a central-only input moves the critical exponent by at
  most 1.13e-4.
* Hypothesis (H) quoted correctly from PR 14 TARGET_0874.md (exponent 39/40, selection length (1 - 2m)/(6 kappa),
  blocks 0 <= m <= 1/2, uniformity requirements).
* Three requirements and campaign controls: not engaged; the note makes a statement about an estimate system for
  one family at one scale, and says so.

## 6. What survives

Precise obstruction, relative to the unrefereed sources. For the system C1-C3: a restricted-moment saving that
does not include block m* = 0.4183 lowers the critical-class exponent by at most 1.13e-4 at fixed geometry; (H)
at block m* implies a count saving omega on rows whose plain witness is that block, provided witness and numerator
block are the same polynomial; a detector factor attached by Chebyshev to the central fourth moment needs a bound
at more than 53% of the distance from level to Lindelof-on-average, the two-scale bilinear form 48-49%, the
one-scale mixed moment 1/6. With the detector at t = 1, all but U^(R_c - d) rows have a plain witness of length
in [0.2543 - 4.26 d, 0.4183 + 1.37 d]. Measured on 19,308 independent prime-conductor rows at U = 2^19 (and at
smaller and half-octave sizes): threshold class empty; rank-class omega 0.35-0.38 against 0.41 for a random class
and 0.33-0.37 for random multiplicative rows; row mean of |M_r* S_m*|^2 equal to the diagonal value within 2%
from 2^15.5 on, exponent between -0.01 and +0.05 depending on the window against threshold +0.137. (H), (TS) and
the one-scale mixed moment are OPEN. No abscissa moved.
