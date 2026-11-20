# REFEREE: c5-marks-circularity-order2 (adversarial, lens: general, 2026-11-18)

Scope: RESULT.md, lp5.py/.log, tiers_copy.py, chk_high.py/.log, wls_tall.py and its logs, checked against
`r3-method-limit` RESULT + REFEREE and the manuscript text around (12.5). Independent work: exact rational checks
typed separately (`/tmp/ref_c5/chk.py`, not kept), reruns of `lp5.py` functions with different cases, reruns of
`wls_tall.py` under `scripts/memcap.sh 8` with a new seed and a new geometry. No ssh. Nothing here concerns zeros.

Outcome: the scalar algebra and every tabulated LP value are confirmed. Four statements are wrong or unproved as
written (E1-E4), and two labels are too strong (E5, E6). The obstruction survives in a corrected, narrower form.
**holds = false as stated** (a PROVED-rel step, Theorem B, is not proved under its stated hypothesis; one sentence
of claim (A) is false).

## Confirmed

1. Transcription of r3's reduced system in `lp5.py`: B_low = 5/6 + (lx - l)/6 + G + k/2, G and k branches, high
   rows E(delta, x) with and without compensation. Matches r3 section 1 and `tiers.py` term by term.
2. Lemma 1: with h = 3, C(1/2) = lx/2; B = 1/2 needs G + k/2 = 0. Correct.
3. Theorem A, scalar: compensated, M >= 2l and l >= M force M = l = 0; uncompensated, h >= 1 + ly gives
   H0' >= 4/3 + ly/3. Correct. (The proof stops at "M = l = 0"; at that point H0 = 4/3 > 1, so it closes.)
   Independent check: 200000 random thin geometries, none with max(H0 or H0', 1 - h/6) <= 1.
   Duality remark (i) and the pricing formula (ii) B_low = 5/6 + lx/6 + G + l(theta - 2/3): correct.
4. All table entries of section 2 agree with `lp5.log`. "Tall" at B = 1/2 re-derived by hand: uncompensated
   M - l = ly - h + 1 >= 2h/3 + 1 >= 3; compensated with TRO6 G: lx >= 4, M - l >= 6.
5. Ray (b, 2b, (3b-2)/2): M = 2 + 2l, GEO-Q, b - ly/2 = 0, h/6 = b/12 hold identically. High rows on the whole ray:
   E(0) = 1 - B - 4b/3 and E(2B-1, 1/2) = 1 - B - 19b/12 + bB/2, both < 0 for b >= 2, 1/2 <= B <= 1 (hand; and exact
   grid b in [2, 16], 101 values of B: 0 failures). RESULT cites only three points; the statement is true on the ray.
6. Cone (t, t, t + 2 + d): B_low = 1/2 - d/6; high rows on [1/2, 1] hold iff t >= 5 + 5d/3 (exact; fails at
   t = 5 + 5d/3 - 1/100). RESULT's "t > 5 + 2d" is sufficient.
7. T6 with different cases (B_low = 9/20, 1/3; package TRO6/wls/no-comp added): feasible at h = 33/10 and h = 4,
   (h - 3)/6 = 1/2 - B_low in each case.
8. k = 0 for M >= 2 + 2l: correct, and it is the proved cubic large sieve in the range (QN)^(2/3) <= Q, i.e. the
   `hb` package already contains it. It is a known consequence, not a new input (RESULT section 0 item 2 lists it
   under "new"; the body labels it ARGUED, which is adequate).
9. Numerics rerun. Z = 128, (2.8, 1.6), seed 7: Ap one = 1.01014, lam = 1.55372; K one = 1.57915 (identical to
   the lane; only the random control moves: 1.00212). New geometry (M, l) = (3.0, 1.3), seed 3:

   | Z | rows | marks | columns | Ap one | Rnd one | K one |
   |---|---|---|---|---|---|---|
   | 32 | 7435 | 19 | 171 | 0.9839 | 1.0051 | 1.1548 |
   | 64 | 59430 | 39 | 624 | 1.0089 | 0.9973 | 1.1644 |
   | 128 | 475464 | 83 | 2739 | 1.0120 | 1.0008 | 1.1955 |

   Ap flat and equal to the random control: reproduced at a third geometry.

## Errors

E1 (false sentence in claim (A)). "r3 Theorem 3(b), columns 'polar kept' and 'G = 0' ... use the compensated high
   side with M < 2l; they are not vertices of a consistent system." True for the polar column (polar G with
   GEO-Q gives 5/6, r3 Theorem 1 second form). False for the G = 0 column. With r3's own package (G = 0 for every b,
   k = 0) and (GEO-Q) imposed, `lp5.minsum(1/2, G="zero", k="zero", comp=True)` returns (0, 4, 2): l = 2, M = 4 = 2l,
   ly >= l, h = 3; interior points exist, e.g. (1/10, 9/2, 21/10) with H0 < 1/2. With the proved sieve the vertex is
   (0, 6, 2), where M = 2 + 2l and k = 0 is proved. `lp5.py` never runs G = "zero" in T1-T3. What removes that
   column is not geometry: G = 0 at b > ly/2 drops the P_a^2/Y' term, an input beyond TRO6 at eta = 1 (r3 says so
   in Theorem 2(iii)). Sections 1, 2 and 8 of RESULT repeat the wrong reason.

E2 (incomplete vertex list). "Consistent vertices at B = 1/2: (5, 5, 7) without compensation, (4, 8, 6), (6, 12, 8)
   with compensation." `lp5.log` T1/T2 already contain the uncompensated TRO6 vertex (5/2, 5, 9/2) (M = 15/2 < 2l = 9,
   so by the lane's rule it is in the uncompensated branch and is consistent); restricting the uncompensated branch
   to where GEO-Q fails gives also (3, 5, 5) and, with the proved sieve, (8, 16, 12). The smallest mark length at
   B = 1/2 in the lane's system is therefore 9/2, not 6 or 7. All are tall (M - l = 3 or more), so Theorem A and the
   reading are unaffected, but the list and the section 8 replacement text for r3's table are not complete.

E3 (Theorem B is not proved under its stated hypothesis). The case beta* = 1/2 needs
   noise << Z^(C(1/2) - margin), i.e. strict slack in the floor-class row at B = 1/2 (H0 or H0' < 1/2). The
   hypothesis says only that the high rows hold on [1/2, 1]. At the three uncompensated T6 geometries listed under
   "Regions", (51/10, 51/10, 179/25), (6, 6, 43/5), (15/2, 15/2, 11), E(0) at B = 1/2 is exactly 0 (they are LP
   vertices on the high row), so under GRH the argument gives no contradiction there: signal and noise are both of
   size Z^(C(1/2)) and cancellation is not excluded. The compensated T6 points have slack (E(0) = -383/50, -91/10,
   -23/2) and the cone of section 5 with t > 5 + 5d/3 has slack, so the theorem is repairable by adding
   "H0(g) < 1/2 (resp. H0'(g) < 1/2)" to the hypothesis and replacing the three uncompensated examples by interior
   points. As written, with those examples, it is not confirmed.

E4 ("infimum 1/2 (EXACT)" is not an LP output). `lp5.py` T1 starts its search at lo = 1/2 and reports "<= 1/2".
   Searching from 0 the same LP returns 0 (the search bound) for polar/k=0/no-comp at (11, 11, 16), TRO6/no-comp at
   (11/2, 11, 21/2), and TRO6/comp at box 40 at (10, 20, 15); at box 16 the compensated values are 1/6 and 1/3,
   so the number is box-dependent. The exact statement is: the reduced ideal system is feasible at 1/2 and below;
   values below 1/2 are excluded only through Theorem B (inputs false, relative to (S), (H)); the value 1/2 is
   attained only if an input equivalent (modulo (H)) to GRH for the family holds. "The infimum is 1/2, not 5/6"
   should read "the reduced system has no floor at 5/6 without lx >= l; its LP value is the search bound".
   This is r3 referee item E3 again, and RESULT section 8 proposes to write the incorrect form into the map.

E5 (equivalences are modulo unproved hypotheses in both directions). Corollary B1 and Theorem C(ii) say
   "equivalent to GRH / to the conclusion". What is shown: GRH => (N) needs (S) continued to Re s = 1/2 with no
   other singularity of F; (N) => GRH needs the ideal high side at every B in (1/2, 1], which prices
   density-hypothesis counts and Lindelof on the class. Neither follows from (N). So the statement is
   "(N) and DH and LH <=> GRH, given (S)", and likewise C(ii, <=) needs DH counts for classes delta <= 2B - 1, which
   a zero-free region right of 1 - sigma does not supply. RESULT states "given the high side" in the body; the
   verdict and the claimed summary drop it. In addition, row Z18 (quoted in weakest step 1) records a pole of the
   scalar factor at s = 2/3 for targets with (lambda eta)^6 principal: for those targets C(ii, <=) fails for
   sigma > 1/3 and "GRH => (N)" fails, because the signal then contains Z^(C(2/3)). The label PROVED-rel for B, B1,
   C is too strong; ARGUED-rel (model statement) is what the text supports. In C(iii) "Cauchy-Schwarz with proved
   norms" contradicts weakest step 2, which calls the non-polar Gram bound MODEL at b >= 2.

E6 (pole control). "Pole control grows" is supported at one geometry. At (2.8, 1.6) the step exponents are
   0.85, 0.36, 0.52, 0.79; only the last is near the predicted 0.8. At the new geometry (3.0, 1.3) the predicted
   exponent is (2 + 2l - M)/3 = 0.53 and the K excess is 0.155, 0.164, 0.195 (step exponents 0.08, 0.25): not
   resolved, as at (3.2, 1.0). Also the effective aspect ratio is larger than the exponents state: at Z = 128,
   (2.8, 1.6), rows/columns = 180174/9372 = 19 against Z^(M - 1 - l) = 2.6, because columns are a slot prime times
   a cofactor <= Z. The test is a test of a sparse-column sieve; the lane's caveat "small numerics" should say this.

Minor. Section 5: "the proved sieve gives Z^(8/3)" is the mark factor alone ((KP)^(2/3)/K); for the full dual
columns it is Z^(10/3). Theorem A's uncompensated half rests on H0' (r3's guess, never derived); "PROVED scalar"
means relative to that guess. `python3` on this machine has no numpy; the runs need the homebrew 3.14 interpreter
(not recorded in the lane).

## Checks requested by the task

* Assumes RH/GRH? No PROVED claim uses it as a hypothesis; GRH, DH and Lindelof appear as priced MODEL inputs.
  Theorem B uses the unconditional existence of critical zeros, correctly.
* Restates verified height? No.
* Known theorem as new? k = 0 for M >= 2 + 2l is the known large-sieve range (item 8). Theorem B is r3 referee item
  E3 plus c4-thin Proposition D; RESULT says so.
* Zeta-only mechanism? None claimed. The lane's own control (random phases) passes like the manuscript row;
  reproduced. Section 7's control table is read from other lanes and was not verified here or by the lane.

## Requirement flags (set by the referee)

R1 false. R2 false. R3 false. R4 false. No property is established; the result is bookkeeping of an estimate system
and the numerics pass with random phases.

## Surviving claim

Relative to r3's reduced system, transcribed and not re-derived ((S) extended to Re s >= 1/2, ideal high side with
DH counts and Lindelof, uncompensated branch H0' a guess, polar decomposition MODEL):
(1) [PROVED scalar, relative] no geometry with l >= M has abscissa <= 1; with polar G and compensation geometry
(ly >= l, M >= 2l) the floor is 5/6, so r3's "polar kept, l = 7/2" vertex is not consistent. r3's "G = 0, l = 2"
vertex is consistent with the compensation geometry at (0, 4, 2); it is removed only by rejecting G = 0 beyond
b = ly/2.
(2) [EXACT LP] B = 1/2 is feasible at tall points with h = 3: (5, 5, 7), (5/2, 5, 9/2), (3, 5, 5) uncompensated;
(4, 8, 6), (6, 12, 8) compensated with TRO6 G; the LP itself has no floor at 1/2.
(3) [ARGUED-rel (S), DH, LH] at a geometry with h > 3 and strict slack H0 < 1/2, a low estimate with exponent below
lx/2 + (h - 3)/6 is false; at h = 3 the estimate (N) together with DH and LH is equivalent to GRH for the family.
(4) [ARGUED-rel, same hypotheses plus the polar decomposition] on the ray (b, 2b, (3b-2)/2), k = 0 is the proved
large sieve, the high rows hold for all b >= 2, and a saving Z^(-sigma) in the polar correlation corresponds to
abscissa 1 - sigma, for targets without the s = 2/3 pole.
(5) [MEASURED] the marked-row mean square with manuscript coefficients equals the random control for Z <= 256 at
(2.8, 1.6), Z <= 128 at (3.2, 1.0) and (3.0, 1.3); the Kubota control shows growth at (2.8, 1.6) only.
The branch "h = r/2 by long marks" gives no route: precise obstruction inside the model, not unconditional.
Nothing about zeros of zeta. 7/8 (unrefereed) stands; RH open.
