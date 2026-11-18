# REFEREE: e1-gl3-theta-order2-rows (2026-11-17)

Adversarial check of `RESULT.md`. Referee scripts: `referee_chk_weight17.py`, `referee_chk_twists.py` (local, single
process, through `scripts/memcap.sh 8`, each under 2 minutes, allocations under 50 MB). No ssh.

**Outcome: holds, with a narrowed scope and four corrections.** Every step labelled PROVED was confirmed. The
verdict "precise obstruction" is established for (a) theta and theta-induced rows in the Goldfeld-Hoffstein /
Chinta-Friedberg-Hoffstein model, conditional on the recalled non-genericity statement, and (b) the square-direction
rows of genuine cusp forms on the double cover of GL(2). It is not established for any cuspidal object on the
double cover of GL(3); RESULT.md says this itself. No step assumes RH, none restates verified height, no zero
statement is made.

## 1. Steps re-derived

| step | label in RESULT | referee |
|---|---|---|
| Lemma T (iv): [(1-y) f_even-in-x](x, 1/p) = 1/(1 - x^2) | PROVED | Confirmed by hand. At y = 1/p, (1-y) f = (1 - x/p)/((1-x)(1 - x^2/p)); the even part is [(1 - x/p)(1+x) + (1 + x/p)(1-x)] / (2(1-x^2)(1 - x^2/p)) = (2 - 2x^2/p)/(2(1-x^2)(1 - x^2/p)) = 1/(1-x^2). |
| N = (1-xy)(1+x)(1+y) = 1 + x + y - x^2 y - x y^2 - x^2 y^2; normalised residue (1 - p^-2)(1 - x^2/p) | PROVED | Confirmed by hand. |
| Iterated residue at s = w = 1 is 0 | PROVED | Confirmed: zeta(2s) is regular at s = 1. The point (1, 1) is the intersection of the two simple-root polar lines (s + w = 2, not on the third line s + w = 3/2), so it is the right point. The residue zeta(2s) does have a pole at s = 1/2, which is the intersection with the third polar line; RESULT lists that line as not covered. |
| Kohnen form delta = (1/2) E_4(4z) D theta - 60 (DG)(4z) theta | CLASSICAL-recalled | Confirmed by hand to q^5 (q - 56 q^4 + 120 q^5) and against the Kohnen-Zagier expansion from memory; it is 60 (2 G_4(4z) D theta - (DG_4)(4z) theta) with G_4 = E_4/240. |
| Kohnen relation, 15647 cases | PROVED (exact) | Code read; the relation is tested against an independently computed tau. Rerun in a different case, see section 2. |
| Check 4 (one value per symbol class) | PROVED | Correct, but it is the case m = p of check 3, not an independent check. |
| Lemma S: R = X T, row series L(s + 11/2, Delta)/L(s + 1/2, chi_D) | PROVED-rel check 3 | Confirmed: e^5/m^{11/2} = e^{-1/2} (m/e)^{-11/2}. |
| Lemma M (Gram depends on |x_m|^2 only) | PROVED | Trivial identity (chi_D real); confirmed. It is a statement about real row symbols only. |
| Local dimension 4 of Whittaker functionals, double cover of GL(3), odd place | recalled | Consistent: [T : T^2 Z] = 16, maximal abelian subgroup of index 4. |

Citations (journal, volume, pages) for Kazhdan-Patterson, Bump-Hoffstein, Bump-Ginzburg, Kohnen-Zagier, Kohnen,
Chinta-Offen, Flicker-Kazhdan agree with the referee's memory. None was opened by the author or by the referee.
Lemma T (i)-(iii) therefore remains CLASSICAL-recalled; this is disclosed (weakest step 1).

## 2. Numeric reruns with different cases

**(a) Kohnen relation at another weight.** Form F = 3 E_6(4z) D theta - (D E_6)(4z) theta (first Rankin-Cohen
bracket of theta and E_6(4z); weight 17/2, plus space, cuspidal; Shimura lift Delta E_4 of weight 16),
F = 6 (q + 88 q^4 - 336 q^5 + 3696 q^8 - 5535 q^9 + ...), exact integers to 120000. Plus-space support: holds.
Relation c(D m^2) = c(D) sum_{e | m} mu(e) (D/e) e^7 a(m/e), a = coefficients of Delta E_4, all fundamental
1 < D < 3000 and D m^2 <= 120000: 9796 cases, 0 mismatches; D = 1, m < 300: holds; c(D) != 0 for all these D.
Lemma S holds for this form with the same X(D, e) = mu(e)(D/e) e^{-1/2}. Consistent with RESULT.

**(b) Twisted means, other twists and a longer range (odd m <= 299, odd d <= 29999).**

| b | phi(b)/b | columns with mean above 0.05 | largest other mean |
|---|---|---|---|
| 11 | 0.909 | 11, 99, 275: 0.909 | 0.0039 |
| 13 | 0.923 | 13, 117: 0.923 | 0.0039 |
| 33 | 0.606 | 33, 297: 0.606 | 0.0039 |
| 35 | 0.686 | 35: 0.686 | 0.0069 |
| 9 | 0.667 | 1, 9, 25, ..., 289: 0.667 | 0.0011 |
| 45 | 0.533 | 5, 45, 125, 245: 0.533 | 0.0023 |

Consistent with Lemma E for squarefree b. Correction 3 below for non-squarefree b.

**(c) Theta rows against random signs.** See correction 1.

## 3. Errors and corrections

1. **False parenthetical in section 3.** "5482 row pairs with correlation above 0.5 ... (the same holds for random
   signs on 44 columns)". Measured: random sign matrices 607 x 44 give 56, 69, 46 pairs above 0.5 (three draws;
   rms 0.151, max 0.68), against 5483 for the theta rows (rms 0.203, max 0.930). Independent random completely
   multiplicative signs on 44 columns give 10059 pairs. The excess is caused by multiplicativity on a short range
   (44 columns carry 14 independent prime signs, dominated by p = 2, 3, 5, 7), not by thinness alone. The
   conclusion drawn (not a coherent set of the 7/8 method; rank at most 44) is unaffected, the stated reason is wrong.
2. **The "DH" row of the control table is not Davenport-Heilbronn.** Inserting chi_5(e) is a character twist; it
   keeps an Euler product. A Davenport-Heilbronn control would be a fixed linear combination of two Hecke parts or
   two twisted rows. It was not run. Since no zero statement is made the omission cannot let a control pass
   wrongly, but the row should be relabelled "character twist".
3. **Slice for non-squarefree b.** The slice is m = b_0 n^2 with b_0 the squarefree part of b, value phi(b)/b
   (b = 9: m = n^2; b = 45: m = 5 n^2). "m = b n^2" is correct only for squarefree b, which is all RESULT tested.
4. **"Nothing in the table separates the true rows from the controls" is too strong for the E_a row.** After
   removing the common part: true rows 0.460 (rms 0.471), random multiplicative signs 0.456 (0.470), chi_5 twist
   0.519 (0.516), E_a 0.761 (0.633). The first two agree; E_a differs by a factor 1.65 in sv_1^2/rows because T
   is different (unnormalised weight (m/d)^{-a} d^{a} grows). The supported statement is: the symbol factor X is
   the same for all of them, and the sign twist is indistinguishable at this size. One size and one seed.

## 4. Scope and novelty

* Lemma S and mechanism M2 are Shimura / Kohnen; the conclusion "reciprocal at shift 1/2, abscissa 1" is the
  existing row OBS-ORDER-TWO-NONPOISSON. The pivot re-verifies a closed row on raw coefficients; it adds no new
  closure. RESULT states this.
* New relative to N21: the residue computation of Lemma T (iv) and the measured slice structure of Lemma E. Both
  are in the Goldfeld-Hoffstein / CFH model, odd part, one twist variable; reciprocity signs and the factor at 2
  untested (disclosed).
* "beta > 3/2 - h/r" is MODEL. It depends on normalising the Hecke part to the unitary axis. With rows divided by
  m^5 instead of m^{11/2} the reciprocal is 1/L(s, chi_D) (centred) and the column weights grow like m^{1/2}; in
  (S), (L) the low side then rises by Z^{1/2}, so the two normalisations give the same abscissa. RESULT does not
  state this equivalence; the referee checked it at the level of exponents only. The bound h <= 1 is taken from
  `r3-method-limit` (GEO) and not re-derived.
* "Moebius sign and centring do not occur together" is a table of five computed cases, not a theorem (disclosed).
* Cusp forms on the double cover of GL(3), and the true Whittaker coefficients of the Eisenstein series induced
  from a genuine GL(2) cusp form, were not computed. The verdict line for the GL(3) double cover as a whole is
  therefore an obstruction for the tested objects plus an expectation for the rest.

## 5. Controls

No zeta-only mechanism is claimed, so there was no mechanism to test against the controls. Sign twist: Lemma M is
an identity (confirmed); the measured sign-twist row agrees with the true rows. Character twist: run by the author.
E_a: run by the author, see correction 4. Davenport-Heilbronn, backward heat, NR, Beurling: not run / not
formulable at the row level; reported as such.

## 6. Surviving claim

In the Goldfeld-Hoffstein / CFH model of the quadratic A_2 series: the residue at w = 1 has p-part 1/(1 - x^2)
(zeta(2s) on the square columns; normalised 1/(zeta(2) zeta(2s+1))), the iterated residue at s = w = 1 vanishes,
and the chi_b-twisted residue is supported on m = b_0 n^2 with constant value phi(b)/b (measured, 12 twists,
d <= 29999). Given the recalled non-genericity of theta on the double cover of GL(3), theta and theta-induced rows
are of symbol type with no reciprocal: h = 0, model abscissa 1. For genuine cusp forms on the double cover of GL(2)
(two forms, weights 13/2 and 17/2, exact): normalised square-direction rows are R = X T with
X = mu(e)(D/e) e^{-1/2}; c(D) is a row scaling; the Gram matrix of symbol-times-coefficient rows is sign-blind;
model detection condition beta > 3/2 - h/r >= 1. Cuspidal objects on the double cover of GL(3): open, not computed.
Nothing about zeros; RH open.
