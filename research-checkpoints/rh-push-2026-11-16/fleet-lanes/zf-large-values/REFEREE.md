# REFEREE: zf-large-values/RESULT.md

Date 2026-11-16. Adversarial referee pass. Verdict under review: precise obstruction, no new abscissa.
Referee verdict: **holds, with one incomplete inference (repaired below) and one false sentence in the DH section.**
Neither changes the conclusion. No RH assumption found; no verified-height restatement.
Referee scripts (plain python, no sympy): `/tmp/ref-zflv/ref.py`, `/tmp/ref-zflv/mm.py` (not kept in the repo).

## 1. Step-by-step

| step | label claimed | referee result |
|---|---|---|
| P1: Guth-Maynard >= mean value for s <= 7/10 | PROVED | CONFIRMED. (12/5-4s)-(1-2s) = 7/5-2s; first terms equal; second term only adds. Family units re-derived: s = (1+delta)/2, third term 1+2n/5-2S, mean value max(n,1)-S; gain needs S > 2n/5 for n <= 1, none for n > 1. |
| P2 numbers | PROVED rel. paper | CONFIRMED independently. Identity (20.9) exact at 200 fresh random rational points (Fractions); min(-E*) = 2.2814731e-4 at x = 1/2, delta* = 0.3866375622 (derivative 7e-11 there, grid 4001 x 41); closed form 35 sqrt(16354)/12696 - 1491/4232 matches; R* = 0.668464, 1-delta* = 0.613362. Retuned: delta* = 0.3885837, R* = 2/3 exactly (288d^2-588d+185 = 0), l* = 0.1668384, ceiling 0.874957069799. D_x, P_x of the paper agree with the kappa = 3/4 forms at three x. |
| P2 inference "By P1 ... no Guth-Maynard-shape estimate changes any count" | PROVED | **GAP.** P1 compares with the mean-value count. The paper's counts are above the mean-value count (R* = 0.668 vs 1-delta* = 0.613; slot capacity in C1 is (1-r)/2, not 1-r; no count for M_r S_m products). "GM >= MV" does not imply "GM >= R*". Repair below. |
| P3: Lemma 15.1 is a mean square | PROVED | CONFIRMED with scope. (15.2) is a row mean square with loss ((d-1/6)/4)_+ (paper lines 6131-6136). The layer-cake argument is correct. The sentence "large-values estimates equal the mean value bound there" is a fact about estimates of Guth-Maynard shape (they all contain the N^{2-2s} term), not about every conceivable level-set bound. |
| P4 arithmetic | PROVED on imported system | CONFIRMED. kappa = 29991/40000: delta* = 0.4693449407, B* = 0.8748866496166, count 0.5903322805 (= R_kappa at x = 1/2), n_min = 0.760489; n <= 1/2 gives 0.7307; ambient T = U^2 gives 1.102. Omitted: the gain window is two-sided, 0.7605 < n < 0.8927 (second term 1.6n - 2S), best value 4/3 - 5 delta*/3 = 0.5511 at n = 5/6. |
| Literature | abstracts | 2507.08296 (Chen-Gupta-Li, (qT)^{7(1-s)/3}) and 2609.27715 (Cossaboom, GL2, T^{5(1-s)/2}) re-fetched: abstracts match the table. Journal data for Guth-Maynard not checked. |

## 2. Repair of the P2 gap

Needed statement: at the binding bins a hypothetical family estimate of Guth-Maynard shape gives a count >= R*.

* At x = 1/2 every counted polynomial has S <= delta n (witness, slots, products, powers). For delta in (1/5, 2/5]
  max(n(8/5 - 2 delta), 1 - n(2 delta - 2/5)) >= 4/3 - 5 delta/3, with equality at n = 5/6.
* 4/3 - 5 delta*/3 = 0.688937 > R* = 0.668464 (Lemma 20.2 bin); 0.685694 > 2/3 (retuned bin). So the binding
  counts do not change. This is the inequality the note should state; it is not P1.
* The bound 4/3 - 5 delta/3 alone is not enough off the binding bins: it is below R*(delta, x) for x = 0,
  delta in (0.379, 0.4), and for x = 0.25, delta in (0.395, 0.4). There the conclusion depends on which lengths the
  witnesses actually have.
* Different test case (referee model, not the author's): minimax over t in [1, 3/2] and adversarial (r, m) of
  C1-C4, with and without a hypothetical family count applied to every M_r^a S_m^b x slots (a <= 2, b <= 3,
  slot length up to 0.2 and up to 1). Baseline reproduces R* to grid accuracy (<= 1.6e-3) at 27 bins. With the
  hypothetical count: no change at any tested delta <= 0.40 (x = 0, 0.25, 0.5); change at delta = 0.43 and 0.47
  (e.g. 0.589 -> 0.560 at delta = 0.47, x = 1/2). This supports "no count changes for delta <= 2/5" as MEASURED on
  that grid, and confirms that the Xu-Sang bin is in range. It is a grid check, not a proof for all bins.
* The abscissa conclusion needs only the binding bin (single-bin obstruction: at (delta*, 1/2) the endpoint is
  b-independent), so "gain exactly 0" stands as PROVED relative to the paper's formulas.

## 3. DH control

The verdict is an obstruction about counts, so there is nothing that could wrongly succeed for
Davenport-Heilbronn. One sentence in section 5 is false and should be removed:

> "Large-values and zero-density estimates use no Euler product: they hold ... for the Davenport-Heilbronn function"

Large-value estimates are coefficient-free. Zero-density estimates are not: the Davenport-Heilbronn function has
>> T zeros in every strip 1/2 < s1 < Re s < s2 < 1, so N(s,T) << T^{A(1-s)} with A(1-s) < 1 fails for it. The
zero-detection step uses the mollifier for 1/L, i.e. the Euler product. This matches the note's own later remark
that the Euler product enters through 1/L(s, eta); the first sentence contradicts it.

## 4. Is the obstruction real or an artifact of a weak attempt?

* Paper system: real. The binding bin is at s_eff < 7/10, where no known large-value estimate beats the mean value
  (ANTEDB), and a mean-value-optimal family count (1 - delta) is the only count that would move it. That is a
  large-sieve question, not a Guth-Maynard question.
* Xu-Sang system: the obstruction is to the Guth-Maynard *method as stated* (coefficient-free, difference-closed
  family), not to a count gain. S1 is CLASSICAL/RECALLED plus one OPEN step, as the note says. Two points:
  1. "The coefficient-free mean value bound is unavailable at n > 1/2" is correct, but coefficient-specific
     mean-value-level counts already exist at those lengths: C1 gives 1 - delta r for M_r up to r <= 1 and C3 gives
     1 - 2 delta m for S_m^2. So the starting norm is not the missing input for these witnesses.
  2. One way around, not attempted in the note: run the Guth-Maynard expansion (powers of M M* restricted to the
     large-value rows) on the specific witness M_r with r in (0.76, 0.89), using the Lemma 17.1 mechanism in
     place of the sharp norm, and treat the quotient-conductor U^2 sums by the sextic functional equation. The
     note asserts this reduces to the TRO6 term; that reduction is stated, not derived. It should be labelled
     OPEN, not part of the obstruction.
* Ceiling on the prize either way: 7.2e-4 below 7/8 (imported envelope), conditional on the unverified Xu-Sang
  system.

## 5. Other checks

* RH/GRH: used only in S1 through Dunn-Radziwill (GRH-conditional, cubic), labelled. No PROVED step depends on it.
* Verified height: not used.
* "S/n <= delta for every counted polynomial": consistent with the C1-C4 table (slot spike 2 x delta z <= delta z);
  not re-derived from Sections 17-19 (the note lists this as weak step 2; unchanged).

## 6. Surviving claim

No new abscissa; 7/8 stands. PROVED: Guth-Maynard >= mean value for s <= 7/10. PROVED relative to the paper's
formulas: both binding bins (0.386638 and 0.388584) have s_eff < 7/10 and a family Guth-Maynard-shape count there
is >= 4/3 - 5 delta/3 > R*, so the gain is 0 (via the repaired inequality, not via P1 alone). PROVED: Lemma 15.1 is
a mean square, not improvable by Guth-Maynard-shape level-set bounds. Imported, unverified: the Xu-Sang bin
0.469345 is in range with gain window 0.7605 < n < 0.8927. OPEN: coefficient-specific Guth-Maynard for M_r at those
lengths, and sextic (KD)^{2/3} sharpness. Section 5's zero-density sentence is wrong and is withdrawn.
