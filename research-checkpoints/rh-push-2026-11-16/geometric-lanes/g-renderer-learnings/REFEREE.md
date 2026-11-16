# REFEREE: g-renderer-learnings

Date: 2026-11-16. Verdict: the PROVED steps (Theorem A, A', B(i)-(iii), Corollary A1) are confirmed after one
statement fix. The claim survives as a classification plus two elementary identities. Several summary sentences
overstate what was tested. No RH assumption found. No cancellation is claimed, so the coordinate-change check is
vacuous (Corollary A2 itself says the quotient coordinates leave the sign set unchanged).

## Re-derivations

- Step 2 algebra: `(x-b)((x+b)^2+d^2)+(x+b)((x-b)^2+d^2) = 2x(x^2-b^2)+2x d^2`. Confirmed.
- Atlas packet identity: with `P(y) = ((y-b)^2+d^2)((y+b)^2+d^2) = y^4+2y^2(d^2-b^2)+(b^2+d^2)^2`,
  `P(x+a)-P(x-a) = 8ax(x^2+a^2+d^2-b^2)`. Confirmed, so A' holds.
- Theorem B: `(log Xi)'' = sum 1/(s-rho)^2` on the line; on-line zero gives `-1/d^2`, pair gives
  `2(b^2-d^2)/(d^2+b^2)^2`. Confirmed. Cross-check: `lim_{x->0} (Re F'/F)/x` from Theorem A equals the Theorem B sum.
- B(iii): `Xi_c` is even with real coefficients, so both symmetries hold; pair term `2(u-b^2)/(u+b^2)^2` is
  increasing on `u < 3b^2`, minimum `-2/b^2` at `d=0`; windows `|z -+ g| < b` are disjoint for `g > b`. Confirmed.
- Corollary A1: `b < 1/2` from non-vanishing on Re s >= 1; consequences follow. Confirmed.

## Errors and overstatements

1. **Theorem A as written is false at the zeros.** It asserts `{Re s > 1/2, W <= 0}` lies in the union of OPEN
   half-disks. An off-line zero `1/2+b+i gamma` has `W = 0` and lies on the boundary circle, not in the open
   half-disk. For an F with one quartet and no on-line zeros, `W = 0` on the whole arc. Correct statement:
   `{W < 0}` (equivalently `Re F'/F < 0`) lies in the open half-disks, or `{W <= 0}` in the closed ones.
2. **Step 1 convergence.** "Absolutely convergent" for `sum Re 1/(s-rho)` needs zeros in a vertical strip. For
   the stated generality (any order-1 F with the symmetries) the sum must be grouped by reflection pairs; the
   displayed Theorem A formula is already pair-grouped and is correct. Fine for xi and DH.
3. **Theorem B DH table is circular as presented.** The "screening S" column is defined as measured value plus
   `2/b^2`, so "matches to three digits" compares a number with itself. I computed S independently (below) and
   it does match; the RESULT did not.
4. **Catalogue counts.** Item 12 is marked "not tested" on DH and "no universal content", yet the verdict counts
   12 generic items holding for DH and section 1 says DH is tested on every item. "All six R items reduce to one
   set being empty (Theorem A)" is false for item 17 (the RESULT's own Theorem B shows it is strictly weaker) and
   is not shown for items 18 and 20. Item 20 does not "fail for DH exactly at its off-line zeros": DH passes at
   every tested order. Item 16 "E for a >= 1/2" holds for DH too once `a` exceeds its largest `b`.
5. **Section 6, PR 56 sentence.** "The coupling norm at width a can only exceed 1 because of pairs with b > a"
   does not follow from Theorem A', which is a pointwise (diagonal) sign. Kernel positivity needs the
   Hermite-Biehler argument for `F(1/2+a-iz)`. Unproved as written. The suggested next step inherits this gap.
6. **Novelty.** Theorem A without the localisation is the classical monotonicity statement
   (`Re xi'/xi > 0` on Re s > 1/2 iff RH: Hinkkanen 1997, Lagarias 1999, Sondow-Dumitrescu 2010). B(iii) is the
   classical fact that the Laguerre inequality is necessary but not sufficient. PR 42 already disclaims novelty.
   The half-disk localisation and the DH tables are the local contribution.

## Numerics rerun (160-bit Arb via fl.py, different cases; scripts in /tmp/ref_g, not kept in repo)

- Shear, DH, offset fine grid around the four pairs (sigma step 0.007 offset 0.0037, t step 0.013 offset 0.0041,
  4th-order stencil, h = 1e-9): 12,238 samples, 2,815 negative, 0 outside the half-disks.
- DH pair-free strip t in [120,160], 16,440 samples: 0 negative, min +0.00877.
- zeta, new range t in [200,260], 12,380 samples: 0 negative, min +0.00292.
- Independent screening sum: located 555 on-line DH zeros in (0,700) by sign changes (step 0.02), added the mirror
  zeros, the other pairs and a density tail (0.0034). S = 0.8524, 0.9777, 1.0919, 1.2839 against the RESULT's
  0.853, 0.978, 1.092, 1.285. Predicted foot values -20.160, -86.935, -360.649, -38.484. Theorem B(ii) and Step 1
  for DH are confirmed to 3-4 digits.
- Completeness of the DH list (weak step 2): on-line count 122 below T=200 plus 8 off-line = 130; main term
  `T/(2 pi) log(5T/(2 pi e))` = 129.55. No missing pair below 200.
- B(iii) with new parameters b=0.2, g=3: rho=1 gives min -40.07 (552 negatives); rho=2.3 gives min +5.27 on
  [-6,6], no negatives. In the rho=2.3 control `Re F'/F = -1.91` at `1/2+0.1+3i`: shear is still negative inside
  the half-disk while the axis witness is positive, as claimed.
- `xi_DH(1/2) = 1.13604`, `xi_DH(0) = 1.16418` (nonzero, Hadamard form applies).

## DH control and walls

Theorems A, B hold for DH; nothing zeta-only is claimed beyond the zero-free region `b < 1/2`. Consistent with
the DH wall. No RH content.

## Surviving claim

Renderer regularities are symmetry identities, local certificates, zero-free-region facts, or RH restatements.
Negative shear (`Re F'/F < 0`, Re s > 1/2) lies in the open half-disks of radius b about the feet of off-line
pairs; `B_a < 0` only within radius `sqrt(b^2-a^2)`; the axis Laguerre witness obeys the screening formula and
is strictly weaker than zeros on the line. All measured on DH, with the screening sum now checked independently.
