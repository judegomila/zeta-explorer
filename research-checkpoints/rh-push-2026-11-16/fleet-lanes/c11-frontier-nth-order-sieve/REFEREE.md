# REFEREE: c11-frontier-nth-order-sieve (second pass by the lane's own agent; NOT an independent referee)

Date: 2026-11-19. Object: `RESULT.md` in this directory. Status of this file: a self-check by a different method.
It does not count as a referee pass for the campaign rule (three referees for a statement about zeros; this lane
makes no such statement). The lane line in `campaign/lanes.jsonl` records referees = 0.

## What was re-derived, and how

1. **Exponent arithmetic by a second method** (`recheck.py`, float brute force on dense grids and random samples,
   no code shared with `ledger.py`): inf of the new count option 0.697323 at Y = 1 (7/6 - delta_c = 0.697322); old
   0.765330 at Y = 1/2; the window D^(1/2) < K < D^2 (0 mismatches in 200000 random points); Z6 0.8000 -> 0.7500;
   Framework A exponent 2.000000 for n = 3, 4, 5, 6; the identity of Lemma 2 to 5.6e-16 on 1e5 random geometries;
   Ji's 575/576 and 599/600; E_6 = 1/6 at 0.967202; B_flat = 0.8748866470 by Newton iteration.
2. **Lemmas 1 to 3 by hand.** Lemma 1: slopes of the convex function checked at Y = 1/2, 1, 2; the comparison
   uses J >= (5/6) P, which needs D >= P, i.e. 1 + x - 2c x^2 >= 0: true for 0 <= x <= 1/2 and c <= 6/13 (value at
   least 1 + x(1 - 2cx) >= 1). Lemma 2: the four terms sum to 1 identically (expanded twice). Lemma 3:
   lam + 2 - lam - 2/n + lam/n + 2/n - lam/n = 2.
3. **Transcriptions against the downloaded texts.** Theorem 1.1 and the recursion (lines 112 to 114, 1176 to 1302
   of `dl/2610.04045.txt`); Corollary 1.5 (lines 192 to 207; proof lines 1714 to 1760); Ji's (9) to (12), (24),
   (27) to (29), Lemma 4.3; Xu-Sang (1.2), Theorems 1.1 and 1.2 and the comparison table; manuscript (9.16),
   (9.21) to (9.24), the display of E_I(d) and its three pieces.
4. **Regression of the borrowed ledgers.** `ledger_dir6.py` reproduces 13/15 (A1), 1 (B3 dir) and 5/6 (B3' dir0)
   of the source files before the new branch is added; `ledger.py` reproduces 0.765328, 0.7956 (grid value of the
   file 0.795641; exact LP 0.795580), 3(1-s)/(2-s) = 0.629072, Q^(4/5), e = 1/3, and the manuscript's closed form
   (9.24) on a rational grid; `scalar_rerun.py` and `part1_envelope.py` reproduce 0.874886508 and 0.874956785 of
   `bypass-78/scalar_system.log`.

## Points a referee should attack

- **P1. Scope of "the sextic sieve enters only the preliminary stage".** Established by text search and by reading
  the passages found, not by reading the manuscripts through. The Xu-Sang system (2610.15291) was searched for the
  same phrases (none found beyond a bibliography entry) but its lemmas were not read.
- **P2. The count comparison uses the formula R_kappa(delta, x) as transcribed in `bypass-78/scalar_system.py`.**
  If that transcription of Liu (14.3) is wrong, Lemma 1's comparison is about the wrong function. Partial
  protection: the x = 0 column agrees identically with Xu-Sang's printed R(sigma) = (31 - 32 sigma)/(21 - 12 sigma)
  (an independent text), and their printed table agrees with Cor 1.5 as transcribed here.
- **P3. "Coverage: yes".** The matching of the manuscript's rows with de Faveri's family at n = 6 is by hypotheses
  and by a sentence of Xu-Sang. A referee with the September manuscript's Lemma 9.1 proof open should check that
  the kernel (k, n) -> chi_n(k)^(+-1) with squarefree k, n over Z[omega] is the kernel Xi_6 up to fixed ray classes.
- **P4. The float screens.** `scalar_rerun` and `part1_envelope` are HiGHS LPs on class grids with bisection; the
  equality "difference 0.0e+00" is a float statement. The claim that the count vector is unchanged is the exact
  Lemma 1, not the screen. The secondary figure 0.908705 is a screen value only and is a MODEL figure (free
  geometry of a pointwise system).
- **P5. Section 3.7, item 3.** The r = 6 threshold is a model statement; the exclusion of the lossy top-group
  alternative was shown only with the quartic Prop 2.1 exponents.
- **P6. Lower-bound statements are quoted.** "Input (i) of the quartic note is false" depends on (1.7) of
  de Faveri-Dunn-Hoffstein as quoted in 2610.04045; the sharpness at n = 6 depends on Xu-Sang Theorem 1.1, which is
  relative to the September manuscript. None was checked.

## Errors found in this pass and corrected before filing

- The window sentence taken from c10 item 1 (D^(4/5) < K < D^(5/4)) failed the first exact grid check; corrected to
  D^(1/2) < K < D^2 (single term: D^(4/5) < K < D^2). The c10 referee had already recorded this as E1.
- A first transcription check of Cor 1.5 divided by zero at n = 3 (the middle range collapses there); the check
  now treats n = 3 separately. No value used in the result was affected.
- The first version of the result listed "further uses of Lemma 9.1 not checked" as weakest step 1; the manuscript
  text was then searched and section 3.6 rewritten.

## Flags as set by this pass

R1 false, R2 false, R3 false, R4 false. aboutZeros false. Verdict: precise obstruction for the frontier input
(no figure changes); no claimed part-B number.

---

# INDEPENDENT REFEREE (adversarial, lens: general). 2026-11-19

Separate agent from the lane. The section above is the lane's self-check and is left unchanged. Scripts of this pass
were run outside the lane directory (scratch, through `scripts/memcap.sh 8`); no file other than this one was written
here. The compute server was not used.

## Outcome

**holds = true** for the claimed verdict (precise obstruction, part B only, no statement about zeros of zeta, no R4
answer). Every PROVED step was re-derived; no PROVED step failed. Five defects of wording, scope or reproducibility
are listed below; none changes a figure.

Flags set by this referee: **R1 false, R2 false, R3 false, R4 false.** The result is exponent bookkeeping with a
coefficient-blind inequality; it establishes none of the four properties and claims none.

## Re-derivations (by hand)

- **3.1.** K^(5/6) D^(1/3) > K iff K < D^2; > D iff K > D^(4/5). K^(1/3) D^(5/6) > K iff K < D^(5/4); > D iff
  K > D^(1/2). Union of the two windows: D^(1/2) < K < D^2, the window of (KD)^(2/3). Confirmed. New <= old:
  K^(5/6) D^(1/3) <= (KD)^(2/3) iff K <= D^2, else it is < K. Confirmed.
- **Lemma 1.** Breakpoints of max(1, Y, 5/6 + Y/3, 1/3 + 5Y/6) at Y = 1/2, 1, 2 with slopes 0, 1/3, 5/6, 1;
  subtracting delta Y gives the minimum at Y = 1/2 for delta <= 1/3 and at Y = 1 for 1/3 <= delta <= 5/6. Comparison:
  D - P = 3 - (1 + 2c)x - (2 - 2cx)(1 - x) = 1 + x - 2c x^2 >= 1 on 0 <= x <= 1/2, c <= 6/13; P > 0; so
  J = (5/6 - delta) D + delta P >= (5/6) P and R - (1 - delta) <= (3/5) delta (5/6 - delta), maximum 5/48 at
  delta = 5/12, below 1/6. For delta <= 1/3 the same bound gives R - (1 - delta) <= delta/2 - (3/5) delta^2 < delta/2
  directly (the cited "file's bound R <= 1 - 2 delta/3" is not needed). Confirmed.
- **x = 0 identity.** R(delta, 0) = (15 - 16 delta)/(15 - 6 delta) = (31 - 32 sigma)/(21 - 12 sigma) at
  delta = 2 sigma - 1. Confirmed by hand; kappa drops out.
- **Lemma 2.** 1 - (1 - lx + l)/6 + (ly - lx)/12 + (1 + l)/6 - (lx + ly)/12 = 1. Confirmed. The dir6 branch
  exponents are new(M, 1 + l) - M term by term. Confirmed.
- **Lemma 3.** lam + (1 - 1/n)(2 - lam) + 2/n - lam/n = 2. Confirmed; consistent with the file's formula
  3/8 + c (general (MN)^c at lam = 1 gives (1 + 2c - 1/4)/2).
- **Z6, Z5.** Q^(1/3) D^(5/6) at D = Q^(7/5) is Q^(3/2); half is 3/4. new(1, x) - 1 = (2x - 1)/6 on 1/2 <= x <= 1
  (the other off-diagonal term is smaller there). Confirmed.
- **Part I.** delta + R(delta) is 1 + delta (delta <= 1/3), 4/3 (1/3..2/3), 1 + delta/2 (above) for the old
  envelope; E_I = -1/12 on the middle range (matches manuscript line 4609) and -1/24 at delta = 5/6 with either
  envelope. Confirmed.
- **Ji replay.** 2 + 4/288 - (9/4)(65/144) = 575/576; 1 - 12/(25 x 288) = 599/600; 1 - 65/1152 = 1087/1152.
  Confirmed.

## Numeric rerun with different cases (exact rationals, own script, no code shared with the lane)

- Lemma 1 closed form at 400 random rational delta in (0, 5/6) (denominator 9996), infimum by brute force over Y on a
  step-1/240 grid: 0 mismatches. Margin over R at 16000 random (delta, x, kappa): positive everywhere. Different
  case delta = 3/5: new 17/30, old 7/10, R(x = 0) = 9/19.
- Window and new <= old at 100000 random rational (a, b): 0 mismatches.
- Lemma 3 for n = 3..12 and 75 values lam = i/37: identity holds. Lemma 2 at 20000 random geometries: holds.
- Z6 at other toy geometries: D = Q^(3/2): 5/6 -> 19/24 (diagonal floor 3/4); D = Q^(6/5): 11/15 -> 2/3 (floor 3/5).
  In each the new exponent stays above 1/2, as claimed.
- Polynomial: real roots near 0.40927, 0.56402, 0.87489, 0.97304; one root in [5/6, 7/8], 0.874886647040.
- Cor 1.5 at n = 6: 5/6, 8/11, 4/7 at sigma = 2/3, 3/4, 5/6 (matches the table printed in Xu-Sang, read in
  `dl/2610.17675.txt`); 0.750052 at sigma = 0.734672; E_4(599/600) = 3/302 (matches the value printed in Ji, an
  independent text, which checks the third branch of the transcription); E_4(19/20) = 1/4; E_6(0.967202) = 1/6.
- Split-kept envelope at delta = 1/4, 1/3, 5/12 on grids 120, 420, 504: 15/16, 7/8, 13/16 where the grid contains
  the optimum (o = 3 delta/2 - 1/4, r = 1); grids missing it give smaller values, never larger.
- `ledger_dir6.py` rerun (108 s, cap 8 GB): log reproduced line for line (13/15 at (2/5, 2/5, 1/5), row refl).

## Source checks (texts read as text only)

- `dl/2610.04045.txt`: Theorem 1.1 as transcribed, no hypothesis in the statement; (1.7) is stated as an
  unconditional lower bound for the family of Example 2.3; Cor 1.5 first two branches as transcribed.
- `dl/2610.17675.txt`: (1.2), Theorems 1.1 and 1.2, kappa_6, and the comparison table as transcribed. Its Theorem 1.1
  is relative to Lemma 18.1 of the September manuscript.
- `dl/2611.16665.txt`: H = X^(65/144), Y = X^(1/288), Props 2.1 to 2.3, 13/25 contour, E(599/600) = 3/302,
  -1/15100 as transcribed. No sextic statement in the text.
- 7/8 manuscript: Lemma 9.1 (line 3693, squarefree rows and columns, (KD)^(2/3)), Prop 9.2 and (9.16) (line 4061),
  uses of Prop 9.2 at lines 4569 and 5028, (14.6) is the cubic sieve (line 5668). Liu 2610.12234 line 1068 and Liu
  2610.26835 section 6 (quadratic and cubic only) as stated. My own search for "sieve" in the three texts found no
  further application of the sextic sieve.

## Defects

- **D1 (reproducibility).** RESULT 3.6 cites the manuscript as `paper.txt` without a path. The file used is
  `~/lean-deps/qrh-verify/paper.txt` (outside the repository). The only `paper.txt` under `push/` is
  `verify-0107965/paper.txt`, a different document (it contains no sextic sieve). The path should be stated.
- **D2 (scope of a sentence).** The verdict says the structured counts "are already below anything it can give".
  What is proved is narrower: Lemma 1 covers the product-polynomial count option for all classes; the comparisons
  with Cor 1.5 and with the two-class scheme are exact only on the stated grids (delta >= 1/8; four values of
  kappa; the two-class value at the critical class only). Not every way of using Theorem 1.1 is enumerated.
- **D3 (margin statement).** "Least margin 0.0252" is a property of the grid, which starts at delta = 1/8. The
  margin of Lemma 1 is positive for every delta > 0 but tends to 0 with delta (1.7e-7 at delta = 1e-6). The strict
  inequality of Lemma 1 is correct; there is no uniform margin.
- **D4 (attribution).** The summary attaches "13/15 unchanged" to Lemma 2. Lemma 2 only shows B >= 1 for the dir6
  row with the polar branch kept (for G = 0 its own line gives 1 + (lx - ly)/12, which is below 1 when ly > lx).
  "13/15 unchanged" is the exact LP in the reduced MODEL ledger, in the configurations listed in `ledger_dir6.log`.
- **D5 (status of inputs).** Coverage of the manuscript's rows by Theta_6 is by hypotheses plus one sentence of
  Xu-Sang; "input (i) of the quartic note is false" is relative to (1.7) as quoted; the three arXiv texts are
  unrefereed and their proofs were not checked by the lane or by this pass. RESULT states all of this; it is
  repeated here because the claim summary is shorter than the caveats.

## Checks required by the task

- **Controls.** No zeta-only mechanism is claimed, so there is no control run to perform. The lane's statement that
  every control passes the new input is correct for the reason given: Theorem 1.1 is an inequality for arbitrary
  coefficient vectors and does not involve the target. R3 is false.
- **RH assumed?** No. The only GRH mention in the sources is a quoted earlier result not used here.
- **Verified height restated?** No.
- **Known theorem presented as new?** No. Lemmas 1 to 3 are labelled elementary bookkeeping; the sieve bound and its
  lower bounds are cited.
- **Statement about zeros of zeta?** None. Ji's text claims a zero-free half-plane; the lane replays its exponent
  arithmetic only and adopts no such claim.

## What survives

Relative to de Faveri 2610.04045 Theorem 1.1 (unrefereed, proof unchecked) and to the manuscripts named in the
result: replacing (KD)^(2/3) by the n = 6 bound changes no figure in the ledgers tested. Product-polynomial count
option 7/6 - delta > R at every class (proved); Z6 toy exponent 4/5 -> 3/4 against 1/2 - eta; Z5 Gram exponent
1/3 -> 1/6; Framework A with the bound on the Poisson dual has exponent exactly 2 at every order (proved identity);
reduced-model LP floor 13/15 unchanged; part-B abscissa stays 0.8748866470. Not a statement about zeros.
