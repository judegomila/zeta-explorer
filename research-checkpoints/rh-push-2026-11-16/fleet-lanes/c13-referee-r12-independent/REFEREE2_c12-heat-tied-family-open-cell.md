# REFEREE2: c12-heat-tied-family-open-cell, Lemmas S and T at q = 5, 7, 13 (independent second referee)

Date 2026-11-19. Written from the lane's RESULT.md only (the lane's `cell2.py` header was opened once to find the python-flint character API; its REFEREE.md was not read before this report was complete). Scripts: `item4_ST.py` / `item4_ST_lib.py` (log `item4_ST.log`), `item4_fix.py` (log `item4_fix.log`); python-flint 0.9.0, Arb at 128 and 300 bits, local, `scripts/memcap.sh 8`, 15 s in total. Source opened by this referee: Conrey-Li, arXiv:math/9812166, Theorem 2 (text extracted from the PDF).

## Verdict

**Lemma S holds. Lemma T holds.** Both are PROVED given Theorem 2 of Conrey-Li, whose printed statement is as the lane quotes it. Their numerical inputs at q = 5, 7, 13 are confirmed, by a method different from the lane's for Lemma S and on a different grid for Lemma T. Scope unchanged from the lane: cell 2 (tied family V3b) is closed in the three readings (m = w, 1/w, v) for the families listed. Cell 1 (heat at (N2)) was not part of this assignment and was not checked.

## 1. Source

Theorem 2 as printed: W analytic and without zeros in the upper half-plane; T a linear transformation of F(W) into itself taking K(w, z) to K(w + i, z) for Im w > 0; Re <F, TF> >= 0 for all F in F(W). Then W extends analytically to Im z > -1/2 and W(z)/W(z + i) has non-negative real part there. The lane's quotation is accurate. Conrey-Li use the same deduction as Lemma S in their own text (no zeros of W in Im z > -1/2).

## 2. Re-derivation

**Lemma S.** P = W(z)/W(z + i) is analytic with Re P >= 0 on Im z > -1/2. For -1/2 < Im z <= 0, W(z + i) != 0 (z + i is in the upper half-plane), so a zero of W there is a zero of P; Re P is harmonic, >= 0 and vanishes at an interior point, so Re P = 0 identically, P is an imaginary constant, and P = 0 identically: impossible. So W is zero-free on Im z > -1/2, W* on Im z < 1/2, and W W* is analytic and zero-free on |Im z| < 1/2. On the real axis W W* = |W|^2 = 1/m; W is analytic across the axis, so the identity continues: m, as a meromorphic function of s = 1 - iz, has neither zeros nor poles in 1/2 < Re s < 3/2. Holds. Hypotheses used beyond Theorem 2: existence of one W, analytic and zero-free in the upper half-plane, with |W(x)|^(-2) = m(x) on the axis, and m meromorphic near the strip (true for w, 1/w, v). On Re s = 1, w and v are positive (2 - s = conj s and xi(conj s, conj chi) = conj xi(s, chi)), so each reading is a weight.

**Lemma T.** For |Im z| < 1/2, W(z) = 1/(m(z) W*(z)), so P(z) = 1/(m(z) W*(z) W(z + i)). As z -> x - i/2: W*(z) -> conj W(x + i/2) and W(z + i) -> W(x + i/2), both interior values, non-zero by Lemma S. Hence P(z) -> 1/(m(x - i/2) |W(x + i/2)|^2) where m is finite and non-zero, and Re P >= 0 passes to the limit: Re(1/m) >= 0, that is Re m >= 0, at s = 1/2 - ix. With s = 1/2 + it: m = v gives S_v(t) = Re sum xi(1/2 + it, chi) conj xi(3/2 + it, chi) >= 0, and m = w or 1/w gives S_w(t) >= 0. Holds. The check on W = 1/xi(1 - iz) is correct (P = xi(3/2 - ix)/xi(1/2 - ix)).

**Corollary** (a simple pole of w at a zero of one L(s, chi_0) forces a sign change of S_w unless the single-character phase condition holds): correct.

## 3. Numerical inputs

### Lemma S: one zero of w0 in the strip per family (CERTIFIED, Rouche)

Method (independent of the lane's winding number on a square): N(s) = sum_chi prod_(chi' != chi) L(s, chi') L(2 - s, conj chi') is entire and w0 = N / prod X_chi. Around the Newton-refined point c (300 bits): M = Arb enclosure of sup |N| on the square of half-side 1e-3; d = central difference of N at step 1e-20 with Cauchy error M h^2/R^3; Taylor remainder M (r/R)^2/(1 - r/R) at r = 1e-9. The inequality |N(c)| + |d - N'(c)| r + remainder < |d| r holds in ball arithmetic, so N has exactly one zero in |s - c| < 1e-9; every factor L(s, chi) L(2 - s, conj chi) is certified non-zero on that disc, so w0 has exactly one zero there and no pole.

| family | certified zero of w0 (centre; radius 1e-9) | lower bound for N'(c) | Re s - 1/2 >= |
|---|---|---|---|
| q = 5, pair {chi, conj chi}, chi(2) = i | 0.5102208213939666302655 + 77.22899252693220879017 i | 5.63 | 0.010221 |
| q = 7, even pair (order 3) | 0.5054676842298625867825 + 62.06379732232545594046 i | 4.57 | 0.005468 |
| q = 7, three odd | 0.5085957730951408223204 + 17.48111285037289304777 i | 16.4 | 0.008596 |
| q = 13, six odd | 0.5066815768421099486833 + 5.756777695214457982420 i | 59.9 | 0.006682 |
| q = 13, five non-principal even | 0.5083033922110507847601 + 10.48209293943527704292 i | 8.0 | 0.008303 |

All five agree with the lane's digits. Starting points were the lane's values, so this confirms the five zeros it lists first; the counts (33, 10, 36, 16, 12) and "first zero" (no zero below) were not re-scanned.

Consequence by reading: for a pair, w0 = 0 iff v = 0, so the two pair rows close all three readings by Lemma S. For the three families with 3, 5 and 6 characters the zero of w closes readings (a), (b); reading (c) is closed for them by Lemma T below. Same division as in the lane.

### Lemma T: certified negative boundary values (CERTIFIED signs, my grid t = 0.013 + 0.05 k, 0 < t <= 40, 128 bits; no undetermined sign)

| family | first certified S_v < 0 (value) | lane, grid 0.01 | first certified S_w < 0 | lane |
|---|---|---|---|---|
| zeta alone | 13.563 (-2.14e-7) | 13.54 | 13.563 | 13.54 |
| q = 5, one character | 5.413 (-2.63e-5) | 5.41 | 5.413 | 5.41 |
| q = 5, pair | 8.563 (-8.33e-7) | 8.55 | 3.813 | 3.79 |
| q = 7, even pair | 7.863 (-2.55e-6) | 7.85 | 3.913 | 3.92 |
| q = 7, odd complex pair | 9.663 (-5.92e-7) | 9.62 | 2.313 | 2.27 |
| q = 7, three odd | 16.763 (-4.19e-11) | 16.75 | 2.313 | 2.31 |
| q = 13, pair {2, 7} | 5.113 (-3.81e-5) | 5.11 | 2.013 | 2.01 |
| q = 13, five even | 16.013 (-2.47e-11) | 16.01 | 2.113 | 2.08 |
| q = 13, six odd | 17.463 (-4.94e-11) | 17.43 | 0.864 on a grid of step 0.002 (-0.0486); 2.013 on the 0.05 grid | 0.87 |

Every family has certified negative values of both S_v and S_w; the first heights agree with the lane to the grid step. (On the coarse grid the short negative interval of S_w near 0.87 for q = 13 odd is missed; the fine grid finds it.) So the boundary condition Re m >= 0 is violated in each reading at each q.

## 4. Remarks

1. The values of S_v at the first negative points are small (1e-5 to 1e-11) because the gamma factor decays; the signs are certified by balls with radius below 1e-13 relative to those values.
2. Lemma S and Lemma T are statements about a weight m. The lane's weakest step 1 (that "tied family" is modelled by one of three weights; a tie with one shift operator per character and a common F is not of this form) stands and is not narrowed by this report.
3. T-NR factor statement in 3.5: m(1/2 + it) = 2 cos(t log 2) + 2.5 > 0 and arg m(3/2 + it) = arctan(0.6 tan(t log 2/2)), exceeding pi/4 for t in (2.973, 4.532): re-derived, correct for the factor. That this produces the first negative value of the T-NR family is MEASURED in the lane (not rerun here).

## 5. Labels

| statement | lane label | this referee |
|---|---|---|
| Lemma S | PROVED given Theorem 2 | holds; Theorem 2 opened and matches |
| Lemma T | PROVED given Theorem 2 | holds |
| Corollary (readings (a), (b)) | PROVED | holds |
| zeros of w0 in the strip, q = 5, 7, 13 | MEASURED, each confirmed by Arb winding number | the five first-listed zeros are CERTIFIED by a second method; counts and "first" not rechecked |
| S_v, S_w negative values | MEASURED, signs certified | confirmed on an independent grid |
| conductor-aspect table, E_a margin, cell 1 (heat) | MEASURED / ARGUED | not checked (outside the assignment) |

No PROVED label is downgraded.

## 6. Run note

In `item4_ST.log` the q = 5 line of the Lemma S block prints `nan` (the starting point was passed to the ball constructor in a form it did not parse; the summary line there reads `False` for that reason only). The q = 5 certificate is the one in `item4_fix.log`, produced by the same `certify` routine with the starting point built from two real balls. The other four certificates are in `item4_ST.log`.
