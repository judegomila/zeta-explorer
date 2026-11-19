# REFEREE.md for c12-repair-sources-statement-o-v3

**Status: the author's own check of this lane, written after the result. It is not an independent referee;
count it as zero independent referees.** (`REFEREE2.md` in this directory is a different thing: this lane's
second-referee report on three round-11 lanes.)

## Checks made

1. Sources. Each "statement found" in RESULT section 1 was compared again with the file under `/tmp/c12src/`:
   Bettin (TeX: theorem and corollary environments listed by line; numbering Corollaries 1 to 5, Lemmas 6 to 8,
   Corollary 9 from the shared counter); Huxley (all seven pages viewed as images); Hamburger (pp. 240, 241 as
   images); Kaczorowski-Perelli (pp. 208 to 210 as extracted text, p. 211 as an image for the dimension
   formula, which the text extraction garbled); Bohr (extracted text and p. 73 as an image; the image shows
   "1/2 < sigma <= 1" in Satz A where the extraction lost the sign). HOLDS.
2. Numerics (`ref2_checks.py`, 20 s, 30 digits, through `scripts/memcap.sh 8`): T-NR lift zeros at four
   parameter sets (abs < 6e-31); strip bound p0^(1/2) + p0^(-1/2); E_a lift functional equation with eps^-2 at
   p = 7, 11 (relative defect < 3e-30) and realness of the axis symbol; nine-term identity at three points
   (defect < 7e-28 against values up to 580); Conrey-Li value at 1 + 282i; lattice (P) and (N2). Nothing is
   interval-certified; all are checks of identities, none is a verdict.
3. Statement O builder: 16 patches, each asserted to match exactly once; the output has 814 lines against 763.
   Lines 2, 4, 6, 8, 10, 11, 12 and section A were not touched (no patch anchors there); sections D and E have one
   source phrase reworded each.
4. Map: row ids recounted by pattern after the edits (186); each new row has six cells; previous file kept.
5. Engine: counts read from the generator's own metadata before and after; a second rebuild after the controls
   edit gave identical counts and an identical top-60 list.

## Reservations

- R-1. Correction R-3 of `REFEREE2.md` ("no single control keeps log-level positivity and M_q's own functional
  equation") is a statement about the controls on the table plus a quotation of the degree-one classification.
  It is not a theorem about generalised Dirichlet series, and it should not be cited as one.
- R-2. T-1 says what the opened paper states. Whether an exact reciprocity for abs(L(1/2 + it, chi))^2 follows
  from its Theorem 5 and a two-parameter form of its Lemma 8 was not examined.
- R-3. "The deduction of the short-interval count from the density estimate is Ingham 1937" is recalled; the
  attribution inside Huxley's text is to "Ingham [2]" for the gap bound. If Ingham's paper states only the gap
  bound, the count needs another reference (a textbook form exists; not opened).
- R-4. The first placement of the regular-representation row (S13, section 3.4) was wrong and was corrected
  (Q28, section 3.3). Other lanes that read the map between the two scripts (about one minute apart) may have
  seen S13.
- R-5. The device count 11 / 23 was recounted, not re-derived; 33 of 34 cells were not re-read.
- R-6. Section 6 of RESULT (the mutual wait of the two `euler` processes) is an inference from the two command
  lines and script texts; no process was traced.
- R-7. The c9 Statement O file was not overwritten; "replacing" is done through map row O1. If the planner wants
  the file itself replaced, that is one copy command and was left to the owner of that directory.

---

# Independent referee (lens: general), 2026-11-19

Written by an agent that wrote none of RESULT.md, REFEREE2.md or the section above. Count this as one
independent referee. Scope: RESULT.md and, because the result's content is REFEREE2.md, every CONFIRMED step
there. Local only; numerics through `scripts/memcap.sh 8` (mpmath, 40 digits; script kept outside the lane at
`/tmp/c12ref_general/chk.py`, not part of the record). No process signalled. Nothing edited except this file.

**Verdict: HOLDS as a record lane (partial result).** No broken step found. One wording error that should be
fixed in the summaries (E1), four cautions. No statement about zeros of zeta is made; nothing assumes RH;
nothing restates verified height; no known theorem is presented as new (all five are cited as sources).

## A. Sources re-read from the files under `/tmp/c12src/` (read as text or images; nothing executed)

| source | what I checked | result |
|---|---|---|
| Huxley 1972 | pp. 164, 165 as images: (1.1) to (1.10) | CONFIRMED. Gap bound for delta > 7/12; (1.5) "after Ingham [2]" implies (1.1) for delta > 1 - 1/lambda; lambda = 12/5 from (1.7), (1.8); (1.10) for alpha >= 5/6. No short-interval count on these two pages. Pages 166 to 170 not re-read by me |
| Hamburger 1921 | pp. 240, 241 as images | CONFIRMED. Satz 1 with (a) to (d); (d') on p. 241 with g(1 - s) absolutely convergent for sigma < -alpha; conclusion f = g = a zeta. Title in the scan reads "zeta-Funktion", as cited |
| Bohr 1916 | p. 73 as image; extracted text | CONFIRMED. Satz A for 1/2 < sigma_0 <= 1, domain G and branch as stated |
| Kaczorowski-Perelli 1999 | extracted text, Theorems 2, 3, Hamburger remark | CONFIRMED (Theorem 2 (i) with periodicity of a(n) n^(i theta); Theorem 3). Dimension formula (p. 211 image) not re-read |
| Bettin 1607.05595v1 | TeX: environments and numbering; Theorems 1, 2, 3, 5; Lemmas 6, 7; Proposition; Corollary 9 | CONFIRMED with E1 below. Numbering (Corollaries 1 to 5, Lemmas 6 to 8, Corollary 9 on a shared counter) is right |

**E1 (wording error in summaries; no verdict changes).** The Estermann reciprocity (the Proposition after
Lemma 8) is for D_0(s + 1/2; a/q) = D(s + 1/2, 2s; a/q) with complex s, abs(Re s) < 1/2. In Theorem 5 this is
S = 1/2 + s, Z = j, the pair L(1/2 + s - j, chi-bar) L(1/2 + s + j, chi). Taking s = i t gives an exact
reciprocity at height t != 0 for the bilinear pair L(1/2 + it, chi-bar) L(1/2 + it, chi). This is not
abs(L(1/2 + it, chi))^2 (that is S = 1/2, Z = it), so the detailed statements (RESULT table cell; REFEREE2 T-1
(c); map rows Z34 and section 7) are correct. The short forms are too strong and disagree with each other:
- REFEREE2 section 4, row T-1: "exact reciprocity at s = 1/2 only". The same file, T-1 (c), grants real shifts.
- RESULT section 1, label (ii) and weakest step 1: "no exact reciprocity at height t != 0 in that text".
- The lane claim: "none at height t != 0".
Correct short form: "exact reciprocity for the Hermitian moment abs(L(s, chi))^2 only on the real axis
(s = 1/2 and real shifts); at height t != 0 the text has it only for the bilinear pair
L(1/2 + it, chi-bar) L(1/2 + it, chi)". Also "at real shifts" should read "at a common complex shift s in the
divisor index, plus integer shifts j"; the Hermitian case is real s, j = 0. The twist-modulus verdict is
unaffected: device J_p reads abs(F A - 1)^2, a Hermitian form.

## B. REFEREE2 steps re-derived by hand

- T-NR bracket: with x = chi(p0) p0^(1/2-s), bracket = 1/x + c + x, zero iff x = -exp(+-theta), cosh theta = c/2.
  Re s = 1/2 +- theta/log p0, Im s = (arg chi(p0) - pi)/log p0 mod 2 pi/log p0. In the open strip iff
  theta < (log p0)/2 iff c < p0^(1/2) + p0^(-1/2). CONFIRMED (R-2). Values 2.1213, 2.3094, 2.6833; p0 = 2, c = 2.5
  gives Re s = 3/2; c = 3 gives 1.8885; c = 2.1 gives 0.9543: all CONFIRMED.
- Ordinary-series form L(s, chi)(1 + c alpha p0^-s + alpha^2 p0^-2s), alpha = chi(p0) p0^(1/2): coefficient
  b_n = chi(n) g(min(v_p0(n), 2)), g = 1, 1 + c p0^(1/2), 1 + c p0^(1/2) + p0. Periodic mod q p0^2. CONFIRMED.
  Reciprocal local roots have modulus p0^(1/2) exp(+-theta). CONFIRMED.
- E_a lift: coefficients sigma_2a(n) n^(-a) R(n); functional equation with eps^-2 and two gamma factors (R-1);
  axis symbol eps^-1 Lambda(1/2 + a + it) Lambda(1/2 - a + it) = abs(Lambda(1/2 + a + it, chi))^2. CONFIRMED.
- LAT: E*(z) = E(z - i); abs(E)^2 - abs(E*)^2 = sinh^2(L(y + 1/2)) - sinh^2(L(y - 1/2)) > 0 for y > 0;
  sin(u + iL)/sin u = cosh L + sinh L (1 + q)/(1 - q), q = exp(2iu), so real part > cosh L for Im u > 0;
  i E'(w)/E(w + i) = L/sinh L at every zero. CONFIRMED.
- Bohr step (V1c): gamma phase difference tends to -h pi/4 in size h pi/4 (Stirling: Im log Gamma(x + iy) =
  y log y - y + (x - 1/2) pi/2 + o(1)); the pi-powers give a real ratio; so a bounded Im log f on the line gives
  bounded Im log zeta(sigma + it), against Satz A. CONFIRMED relative to Satz A.
- Window translate sign (T-3): weights a_l l^(+i alpha). CONFIRMED.

## C. Numerics rerun with different cases (mine; 40 digits; identities only, no interval arithmetic)

| check | cases (different from the lane's) | result |
|---|---|---|
| T-NR bracket zero, both signs of theta, third period in Im s | (q, p0, c) = (13, 7, 2.6), (11, 2, 2.12), (13, 3, 2.31), (11, 5, 2.9), three characters each | abs(bracket) < 3e-40 in all 24 cases. Re s = 0.8887 / 0.1113 (in strip); 0.99730 / 0.00270 (in strip, c just below 2.1213); 1.00047 / -0.00047 (outside, c just above 2.3094); 1.0693 / -0.0693 (outside). The bound of R-2 separates the cases on both sides |
| periodicity of b_n | q = 7, p0 = 3, c = 2.2, n < 400 | defect 0 at period q p0^2 = 63; defect 3.0 at period q p0 = 21 |
| E_a lift functional equation | p = 5, 13; s = 0.81 - 5.3i; a = 0.33 | relative defect < 3e-40 with eps^-2. With eps^-1 instead the defect is 0.53 to 1.19 (except the one character with eps^2 = eps): R-1 is needed |
| axis symbol | t = 9.1 | equals abs(Lambda)^2 to 1e-43; imaginary part < 2e-43 |
| Conrey-Li point | 1 + 282i | Re{xi(s)/xi(s + 1)} = -0.000131957293372 (agrees). Nearby: +0.00202 at 1 + 282.2i, +0.0174 at 1.1 + 282i: the negative region is small; the sign at the point is clear at this precision |
| LAT (P) | 6000 random (L, u), L in (0.01, 9), Im u down to 1e-9 | min Re{sin u/sin(u + iL)} = 4e-10 > 0; min of Re{ratio} - cosh L = 1e-10 > 0 |
| LAT (N2) | (L, n) = (0.3, 2), (4.4, -7) | equals L/sinh L to 40 digits |

## D. Bookkeeping recounted

- Map: row ids by pattern P 53, G 32, Q 28, S 12, Z 37, F 8, T 3, L 5, D 7, O 1 = 186; no duplicate id; no S13;
  P53, G32, Q28, Z34 have six cells each. CONFIRMED.
- Engine metadata before / after: nodes 1,655 / 1,659; edges 8,903 / 8,922; control-defeats 751 / 770; rows
  218 / 222; crossing pool 9 / 6; generated 44,860 / 36,558; scored 14,980 / 8,437; device types 33/1/3 to
  36/1/0; top-60 with open device 36 / 0. CONFIRMED against `engine_counts_*.json` and the second rerun log.
- Device count: `counts_v2.json` has PF 6, PP 5, T 2, O 1, NF 19, FAIL 1, n = 34, so 11 / 23. CONFIRMED.
- Statement O version 3: 814 lines; header count PROVED 4, PROVED-relative 1, MEASURED 1, ARGUED 6.
- Section 6: PID 90095 (`queue4.sh`, parent 1) and PID 94875 alive, PID 80786 absent (process table read only).
  The mutual-wait reading was not traced by me either.

## E. Cautions (none breaks a step)

- C1. The engine now treats three device types as closed. The second pass behind that is on control tables
  only (weakest step 2 of RESULT), and was written by a lane that had no independent referee at the time. This
  report confirms the control-table steps, not Theorem 2 / Lemma 4 of the twist-modulus lane, V3b, or the
  de Branges numeric screens. The closure removed 36 of the top-60 candidates; the before-copies in
  `engine/scratch/` make it reversible.
- C2. S(theta) still rests on a step that nobody opened (Ingham's deduction). The label says so. The lemma needs
  only some theta < 1, so the dependence is light, but "PROVED relative to a cited theorem" for line 5 of
  Statement O is, as of now, relative to a recalled theorem.
- C3. Correction R-3 of REFEREE2 is an observation about the two controls on the table. Kaczorowski-Perelli
  Theorem 3 needs the Selberg-class axioms; the T-NR series leaves the class through the size of its local
  roots at p0 (modulus p0^(1/2) exp(theta) > p0^(1/2)), not through positivity. It is not a theorem on
  generalised Dirichlet series (the author's own reservation R-1 says the same).
- C4. Statement O version 3 keeps the first-writing header, including "Huxley 1972, asymptotic for
  theta > 7/12 ... primary text was not opened" (about line 35). An italic note marks it as the earlier state.
  A reader who jumps into the file there gets the superseded label.

## F. Requirement flags (set by this referee)

| flag | value | reason |
|---|---|---|
| R1 | false | no argument using the primes; record and referee work |
| R2 | false | no conclusion in windows or uniform in height |
| R3 | false | no mechanism claimed for zeta; the lane confirms that controls PASS three closed devices |
| R4 | false | no step from finite stages or from the right of 1 to the critical line |

aboutZeros = false. Broken PROVED steps: 0. Surviving claim: five sources opened with the matches and
mismatches as tabulated (with E1 applied to the Bettin short form); the control tables of the three round-11
closures hold with corrections R-1 to R-3, T-1 to T-3, B-1; map at 186 rows; engine counts as logged.
