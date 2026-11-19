# REFEREE.md for c13-repair-map-engine-battery-records (author's own adversarial pass; NOT an independent referee)

Date 2026-11-19. Written by the lane itself after RESULT.md. `refereeHolds` should be recorded as null and referees = 0 until an
independent pass exists. Checks rerun: `ref_checks.py` (`logs/ref_checks.log`, `ref_checks.json`; through `scripts/memcap.sh 8`,
123 s). Server not used.

## Checks made

1. **New HEAT pairs by the other method.** Each of the 17 new pairs for tau = -0.5 was evaluated with
   `c12-control-battery-harness/battery/heatlib.py` (Gauss-Legendre in u at 1406, 2004, 2605 bits), which shares nothing with
   the Gaussian convolution used to find them: Newton residual abs(F/F') between 1.4e-32 and 4.5e-31. They are zeros of the
   battery's own function to 30 digits. Holds.
2. **Method control.** The same pipeline at tau = -0.1, where the battery list was already balanced, returns 0 unbalanced boxes
   and all 41 pairs (difference at most 5.0e-29, the print precision of the table). The three on-line zeros of that table for
   which the float interpolation differed by more than 2e-3 (close pairs near 1309.24 and 1919.06) have certified sign changes
   within 1e-20 of the table ordinates (`chk01.py`). Holds.
3. **Corrected minima by a third code.** mpmath at 40 digits at the corrected ordinates: DH 10000-10008, h = 1: -0.6281622294973357
   (2 failures), h = 1/2: 0.05890543999882647 (0 failures); gamma-only at h = 2: 0.02264996194844583, 0.004329625088245757,
   0.0004486797582555081, 0 failures in each window. All equal to the ball values to the 16 digits printed. Largest Newton
   residual of the corrected DH ordinates near 1e4 in mpmath: 4.6e-36. Holds.
4. **Same harness on the original record.** `d1_corrected.py` on `before/screen.json` returns 19 of 20 with the same failing
   check and the same numbers as c12's `device_D1.json`, so the 20 of 20 is not an effect of the changed script. Holds.
5. **Count of changed record entries** recounted by a separate loop over both files: 31 of 54 minima, 2 of 54 fail counts,
   0 zero counts. The c12 referee's "7 of 24 in the four replayed windows" is reproduced (extension 17 of 24). Holds.
6. **Map arithmetic.** Row counts: P 54, G 33, Q 29, S 12, Z 38, F 8, T 3, L 5, D 8, O 1 = 191; the parser reports 227 table
   rows (222 + 5). Holds.

## Reservations that stand

- R-1. The D1 threshold is met against a record written by the lane that reran the check. The safeguard is the different zero
  finder, the different form of DH and the mpmath pass; a referee should rerun `screen_ball.py` with a zero finder of their own
  of their own. The ordinate-by-ordinate comparison with `tables/zeros_DH.json` was made (`ordinate_compare.py`): largest
  difference 5.0e-30 below 200 and 5.0e-29 near 1000 (print precision of the table); both finders use Arb's Hurwitz zeta.
- R-2. "5 of 5 verdicts" counts four verdicts that this lane did not rerun.
- R-3. HEAT completeness is a count balance in float64 with contours at Re z <= 3; no interval certificate. Pairs are assumed
  simple; a double zero on the line would be counted as on-line by neither method (no sign change) and would show as a box
  deficit of 2, of which there is none after the fill.
- R-4. The gamma-only fail counts at h = 2 changed from (0, 12, 31) to (0, 0, 0). The c11 text and its referee already placed
  the boundary at h = 2 (all positive at 1.9, all negative at 2.1), so no sentence of the c11 verdict depends on the old counts;
  the c11 RESULT table still prints them and was not edited (outside the write set).
- R-5. Map rows D8, Z35, G33, P54, Q29 were worded from lane texts and one referee file each. Places where this lane chose the
  wording: in D8 the DEL entry is stated under the Poisson reading of the functional-equation step (the referee gives both
  readings); in G33 the phrase "classical identities; bookkeeping" follows referee remark 3; in P54 "decides 1" follows the
  lane's count although the decided device is a restatement.
- R-6. The status string `relative to joint universality` in `controls.json` is outside the ranked list of `build_graph.py`;
  it is accepted by the script, and two control-defeats edges of `ctl-UNIV` are keyword matches that were not read.
- R-7. The scoreboard deltas mix this lane's six nodes with six nodes of the planner's earlier rerun and one lane line written
  by another round-13 lane; they were not separated.

## Outcome of this pass

The numbers in RESULT.md sections 2.1 to 2.3 were each reproduced by a second code path. No claim about zeros of zeta is made.
Flags R1 = R2 = R3 = false, R4 not addressed.

---

# Independent referee pass (lens: general), 2026-11-19

Not the author. Scripts written for this pass are outside the repo (`/tmp/ref_c13_general/chk1.py`, `chk2.py`, `chk3.py`); all runs
local through `scripts/memcap.sh 8` with `.venv-arb/bin/python`; longest run 332 s. Server not contacted. Nothing was edited except
this file.

## Outcome

**Holds as a record lane (partial-result), with the corrections G1 to G6 below. No number of sections 2.1 to 2.3 failed a rerun.**
The lane contains no step labelled PROVED, no statement about zeros of zeta, no use of RH, no restatement of verified height and no
classical theorem presented as new. Flags set by this pass: R1 = R2 = R3 = R4 = false (nothing of the kind is established or claimed).

## What was rerun, with different code and different cases

1. **Screen record (2.1), a third code.** mpmath at 50 digits; DH from `mpmath.zeta(s, a)` in the character form; own zero finder
   (scan at steps 0.017 / 0.07 / 0.04, different from the record's and the battery's, then 150 bisections; derivative by central
   difference). Windows chosen to differ from the author's mpmath pass (which took DH near 1e4 and h = 2 only): all six shifts in
   DH 1000 to 1020, gamma-only 1000 to 1040 and gamma-only 10000 to 10030.
   - Zero counts 17, 32, 35: equal to the record. Largest ordinate difference from `screen.corrected.json`: 4.5e-37, 5.0e-37, 5.0e-36.
   - All 18 minima equal the corrected record to at most 5.1e-17; all 18 fail counts equal. In particular DH 1000 to 1020, h = 1:
     -0.33053338578645175, 3 failures (original record -0.3348103021277858); gamma-only h = 2: +0.004329625088245757 and
     +0.0004486797582555081 with 0 failures (original: 12 and 31 failures).
   - Structural cross-check of the gamma-only values (not in RESULT.md): at a zero of g(s) + g(1 - s) one has, to leading order,
     X'(rho) = 2 L g(rho) with L = (1/2) log(t / 2 pi) and X(rho + h) = g(rho) (t / 2 pi)^(h/2) e^(i pi h / 4), so q_h tends to
     cos(pi h / 4): 0.9239, 0.7071, 0, -1 at h = 1/2, 1, 2, 4. The corrected minima are 0.9239, 0.7072, +0.00045, -0.9999994
     near 1e4, and the h = 2 minima times the height are 4.50, 4.50, 4.50 in the three windows (a 4.5/t term). The original
     negative entries at h = 2 do not fit this; the corrected ones do. The sign of the 1/t term was not derived here; it is
     ball-certified in the record and confirmed by mpmath.
   - Recount of changed entries by a separate loop: 54 minima, 31 changed, largest change 1.3033e-2; 2 fail counts; 0 zero counts.
2. **D1 (2.3).** `d1_corrected.py` rerun on both records: 20 of 20 (extension 24 of 24) and 19 of 20 (extension 17 of 24, failing
   check DH_t1000_1020 min q_1). The diff against `c12-control-battery-harness/devices/d1_debranges.py` was read: the checks,
   order and tolerances are unchanged; the recorded numbers are read from the file; the full-height windows of c12 are dropped
   (not registered). One difference not stated in RESULT.md: c12 typed the Conrey-Li value to 12 digits, the record carries 16;
   the tolerance is rel 1e-11, so the check is unaffected.
3. **HEAT (2.2), own quadrature.** Shifted trapezoid of the Gaussian convolution (step 0.0625, offset 0.021, range 8, 200 bits;
   a different lattice from the lane's 0.05 / 0 / 7.5), no shared code.
   - Newton residual abs(F/F') at four new pairs (ordinates 1118.73, 1427.01, 1735.81, 1946.23): 1.2e-31, 1.4e-31, 2.7e-31,
     3.7e-31; at 0.5 + 1735.8i (not a zero) 0.32. The value at 1118.73 equals the author's heatlib value to all 17 printed
     digits (1.1709586222191791e-31), so the two representations (Gaussian convolution; Gauss-Legendre in u) agree at that
     point to about 1e-47, and the residual is the print precision of the file (34 significant digits of an ordinate near 1e3).
   - Three-sided box counts with my own contour sampling (horizontal step 0.025, right side step 0.04, 128 bits) and my own
     on-line sign-change count (step 0.02): box [945.0375, 949.2375] count 4 = 2 + 2 x 1; box [1284.2625, 1290.7375] count
     6 = 2 + 2 x 2; box [1734.4875, 1739.3375] count 5 = 3 + 2 x 1. Each was short by 2 before the fill and balances with the
     corrected list. Largest phase step on my contours 0.118 rad.
   - Two regions the lane's 399 boxes do not cover: [0.6, 8.0125] count 0 (no zeros); [1999.2375, 2000.30] count 1 = the
     on-line zero at 1999.9502, no pair. So the sentence "929 + 2 x 294 = 1517" has no uncounted pair in the strip above the
     last cut, as far as Re z <= 3.
4. **Map row P53 figures.** Own flint code (`acb.zeta_zeros`, 256 bits): q_(1/2) < 0 exactly at zeros 922, 996, 1308, 1496 among
   the first 1517 (values -0.05425, -0.12153, -0.04112, -0.27847; ball-certified signs); least q_(1/4) = 0.13240. As in the row.
5. **Arithmetic re-derived in the map text.** (a) T-NR local factor 1 + c x + x^2, x = q^(1/2 - s): for c > 2 the roots are real,
   r and 1/r with r + 1/r = c, and the zero lines are at distance log r / log q from 1/2; inside the strip iff r < q^(1/2) iff
   c < q^(1/2) + q^(-1/2); at q = 2 this is 2.1213. Rows D8 / Q29 and the section-2 note are correct. (b) Row G33: 1 + 1/p -
   2 p^(-3/2) cosh((s - 1/2) log p) = -p^(-3/2) (x + 1/x - (p^(3/2) + p^(1/2))), larger root above p^(1/2), so the extra zeros are
   outside the closed strip; correct. (c) Row Z12: 2r + 8z < 3 at r = 0 gives z < 3/8; correct. (d) Sizes 1e-68, 1e-340, 1e-3411
   are e^(-pi t/4) at t = 200, 1000, 1e4; correct.
6. **Bookkeeping.** Map: 191 row ids (P 54, G 33, Q 29, S 12, Z 38 including Z15b, Z15c, Z24b, F 8, T 3, L 5, D 8, O 1), 186
   before, new ids exactly {P54, G33, Q29, Z35, D8}, none removed. `before/screen.json` and `before/zeros_HEAT--0.5.json` are
   byte-identical to the c11 and c12 files, so those copies are unchanged as claimed. `devices.json`: 40 types, 39 closed,
   1 floored. `engine_counts_before/after.json`: 1665 -> 1671 nodes, 8922 -> 8937 edges, control-defeats 770 -> 783, rows
   222 -> 227, controls 17 -> 18, live 963 both; 59 of 60 top entries identical. As in the table of 2.5.

## Corrections and limits (none changes the verdict)

- G1. **What the D1 "20 of 20" measures.** 18 of the 20 registered checks are identical under both records (the zeta windows
  and all counts). The pass turns on one number, min q_1 of DH 1000 to 1020, and the battery's value for it
  (-0.33053338578645175) was already printed by c12 before this lane wrote the corrected record. The check is therefore
  "a second and now a third independent code reproduce that number to 1e-16", not a blind prediction. That is sufficient for a
  record correction; the headline should be read that way.
- G2. **"5 of 5 verdicts"** is a count of one verdict rerun here and four taken from c12 without rerun (stated in RESULT.md;
  repeated here because the one-line claim drops the qualifier for D3: 48 of 48 only at the record's quadrature step, with the
  converged residual 2.2e-11 against the recorded 5.4e-12).
- G3. **HEAT count.** (i) The table of 2.2 gives "399 boxes" next to "929 + 2 x 294 = 1517" without saying that the boxes hold
  1516 zeros and that the last on-line zero (1999.9502) lies above the last cut; this is in the JSON `box_check` field only.
  The strip was counted in this pass (item 3). (ii) Equality with zeta_nzeros(2000) is not a completeness argument: the number
  of zeros of F_tau below a fixed height is not conserved by the flow (zeros move across the height-2000 line), so 1517 is a
  consistency figure. The completeness evidence is the per-box balance. (iii) Unchanged limits: float64 phases, contours at
  Re z = 3, no interval enclosure of the quadrature; pairs assumed simple. "Complete below 2000" is MEASURED, as labelled.
- G4. **Digits.** "34 digits in the file" means 34 significant digits, i.e. about 30 decimals at these heights; the residuals
  1e-31 quoted from heatlib are this print precision and not a discrepancy between methods. The `max_residual` 7e-52 in
  `heat_b_-0.5.json` is taken before printing and is not a property of the stored strings.
- G5. **Wording in the map.** Section-2 T-NR note: "D >= 1 for c > 2" is true but the condition is not needed (D >= 1 for every
  c >= 0, being 1 plus positive multiples of projections); the range of c matters only for the location of the zeros. RESULT.md
  section 3 says the gamma-only fake "passes (N2_h) for h <= 2"; at h = 2 this is a measured statement in three windows with
  margin 4.5/t, not a proved boundary case; row P53 words it correctly ("positive, tending to the boundary value 0").
- G6. **Engine table.** Two changed counters are not listed in 2.5: `restates` edges 183 -> 185 and `crossingKeyword` 296 -> 299.
  The author's reservations R-5 to R-7 stand: rows D8, Z35, G33, P54, Q29 and the Xu-Sang edits of Z11 / Z12 were worded from
  lane texts and one referee file each and were not re-derived by this lane; in this pass only the items of point 5 were
  re-derived, so the identity N - delta - R0 = 6 (delta - delta*)^2 / (15 - 6 delta), the thresholds t_r of row Z35 and the
  UNIV device codes 1 / 4 / 2 / 27 remain unverified here.

## Requirement flags (this pass)

R1 false, R2 false, R3 false, R4 false. The lane makes no inequality, no height-uniform conclusion, no argument for a control to
fail, and no passage to the critical line. `aboutZeros` false. Nothing here counts toward the campaign headline.
