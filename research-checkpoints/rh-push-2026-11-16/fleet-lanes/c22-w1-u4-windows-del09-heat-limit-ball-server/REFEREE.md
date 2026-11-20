# REFEREE (separate agent, lens: general): c22-w1-u4-windows-del09-heat-limit-ball-server

Date 2026-11-20. Written by a referee agent that did not produce `RESULT.md`. The file previously at this path was the
lane's own second pass (same session as the result); it is kept unchanged below as an appendix and is not counted
as a referee. No statement about zeros of zeta is made in the result or here.

## Verdict

**Holds as a partial result (certified conversions of control rows), with the qualifiers Q1 to Q7.** No sign, ball
or row decision is changed by them. Q1 limits what Part 3 establishes for the rectangles of Table 3.
Flags set by this referee: **R1 = false, R2 = false, R3 = false, R4 = false.**

## 1. What was re-derived and re-run by this referee

### 1.1 Lemma H, re-derived line by line

- (i) H_0(w) = xi((1 + i w)/2)/8 = (1/8) int_R Phi(u) e^(i w u/2) du is the Riemann/Polya representation after the
  substitution u -> u/2 of the usual one; a Gaussian of variance 2 tau has transform e^(-tau u^2/4) at frequency u/2.
  With y = abs(Im w): abs(F(w)) <= (1/8) int Phi (e^(y u/2) + e^(-y u/2)) du = 2 H_0(i y) = xi((1 + y)/2)/4. Uses
  Phi >= 0 and tau >= 0 only. log xi(sigma) = O(sigma log sigma) gives order at most 1; Jensen at 0 (F(0) > 0) gives
  n(r) = O(r log r), so sum abs(rho)^-2 < infinity. Confirmed.
- (ii) Genus at most 1, F'/F = B + sum m_rho (1/(w - rho) + 1/rho); 1/(w - rho) + 1/rho = w/(rho (w - rho)), bounded
  by 2 abs(w)/abs(rho)^2 for abs(rho) >= 2 abs(w): uniform convergence on the contour, termwise integration allowed.
  A rational g = O(abs(w)^-2) has residue sum 0; so the constant terms integrate to 0, a zero inside R contributes
  0, a zero outside contributes -h(rho). h = V(s) conj V(-conj s) with V = sum b_i/(s + z_i) (Lemma R of the c21
  lane, read as text) is O(abs(s)^-2). Sign checked against Lemma R (contour integral = W_R - Q_gen) and against
  Table 3 (W_R - C_R = Q_gen: -0.5047053204 + 0.0149430851 = -0.4897622353). Confirmed.
- (iii) Tail of an absolutely convergent series along an exhaustion. Confirmed.
- Nothing in the proof uses the location of zeros, RH, or verified height. It holds equally for zeta and for the
  control, as the result states.

### 1.2 Numeric check with a different case, Part 2 (unit `rh-c22rgu4-1120162227`, 1 core, through `rhrun`)

Own code (`~/rh-push/<slug>/refgen/u4chk.py` on the server): own sieve, own copy of the greedy rule, the overlap
matrix by 64-point Gauss-Legendre quadrature of the defining integral (no closed form), phases by mpmath at 50
digits, own 6 x 6 eigenvector. Accuracy of this check is float64 linear algebra (about 1e-11); it is not a ball.

| t | P | prime powers below P | primes of S below P | lambda_min DEL b=0.9, this referee | lane | zeta on the same vector | err |
|---|---|---|---|---|---|---|---|
| 101750922.75 (lane's lowest window) | 1013103 | 79712 | 22426 | -1.985698989839588 | [-1.98569898983956709879981842 +/- 2.43e-27] | +2.893791888572 | 0.00115264 |
| **197550176.75 (not among the lane's eight; ninth block minimum of the screen)** | 1666318 | 126052 | 33745 | **-1.59934851664761** | screen (P frozen): -1.5992101 | +5.156494590799 | 0.00061641 |

P, both counts, the value to 2e-14 and err agree at the lane's window. At the new window the form is negative by
2600 times err; lambda_min of the zeta matrix there is +4.13. A second vector (the eigenvector rounded to two
decimals) gives -1.98505 and -1.59852: the sign does not depend on the digits of the test vector.

### 1.3 Control run by this referee, Part 3 (unit `rh-c22rgheat-1120162227`, 1 core, through `rhrun`)

Own evaluation of H_t (Polymath variables, H_t(x) = (1/2) int_R e^(t v^2) Phi(v) e^(i x v) dv, t = -1), plain trapezoid
rule on the real line at 1000 digits (no contour shift, no slabs; aliasing error is H_t at shifted frequencies),
two step sizes agreeing to 1.7e-153 relative; normalisation checked at t = 0 against xi((1 + i w)/2)/8 at the same
point (relative difference 5.8e-155).
- At w = -2 i z, z = 0.817574037648391 + 2500.823423924555 i (the off-line zero quoted in RESULT 4.3):
  abs(F(w))/abs(F(w + 0.3)) = 3.0e-12, Newton step 7.5e-13 in w (3.8e-13 in z, the rounding of the 12 printed decimals).
- At the same point for t = 0 (xi): abs(H_0(w))/abs(H_0(w + 0.3)) = 1.08: no zero there.
So the HEAT object of Table 3 is the stated one and has the stated off-line zero; the control is a non-trivial
instance. The contour integrals and the windings were not recomputed by this referee.

### 1.4 Read from the files (not recomputed)

Counts 3872 / 3846, minimum, histogram, mean lambda_min: equal to `scan_big.json`. Eight DEL b = 0.9 windows with
`ctl_below_minus_err` true and four zeta windows with `zeta_above_plus_err` true: equal to `ball_part2_p128.json`.
Largest radius in Part 1: 9.37e-30 (`ball_part1_p128.json`). 163 zero representatives = 83 + 80 pairs = 243 zeros
(`cells_heat_ext128_p128.json`); 243 in a window of height 256 is density 0.949 against (1/2 pi) log(T/2 pi) = 0.953.
Ratios 0.561 .. 0.502 and Y abs(C_R) = 1.9127 at Y = 128 follow from the table.

## 2. Qualifiers (errors of statement or scope; none reverses a result)

- **Q1 (scope of "C_R -> 0", the main one).** Lemma H (iii) is for rectangles that exhaust the plane. The rectangles
  of Table 3 have fixed half-width abs(Re z) <= 3 and are centred at height 2500.75; they are not an exhaustion. Along
  that family the lemma gives C_R -> - (sum of h(rho) over HEAT zeros with abs(Re z) > 3), which is 0 only if H_{-1}
  has no zero with abs(Re z) > 3 at any height. That is not established here (the census, largest abs(Re z) = 1.338,
  covers one window of height 256). So "Y abs(C_R) -> 1.91" is an observation on Y <= 128, not a limit, and Table 3
  illustrates Lemma H (ii) without instantiating (iii). The lane's own second pass says this; RESULT sections 0 and
  4.3 do not. The clause of line 11 ("passage to the sum over all zeros for HEAT") is covered by the lemma for
  exhaustions and for tau >= 0 only.
- **Q2 (referee count).** `lanes.jsonl` records `refereeHolds: true` with `referees: 0`; that entry rested on the
  same-session pass. With this file there is one separate referee. The record's rule for PROVED on line 11 is as the
  record lane defines it.
- **Q3 (novelty).** Lemma H is a standard consequence of Hadamard factorisation and the residue theorem for an
  entire function of order at most 1; that H_t is entire of order 1 is in the de Bruijn / Polymath15 literature. It is
  new only against the campaign record ("ARGUED" -> proved), as RESULT section 1 says with "against the record".
- **Q4 (zeta row of Part 2).** "No height below 0" is a float64 statement on the grid of step 0.1 with P frozen per
  block; it is not a statement for all t in the range. All heights are below 2.001e8, inside the verified height, so
  the zeta pass carries no information about zeros beyond what is known; the result does not claim otherwise.
- **Q5 ("decided", "fails S3").** What is certified is the sign of an explicit finite sum and Q + err < 0 with err
  evaluated from the formula of the U4 lane. That err bounds the distance to step S3 (Proposition M) was not
  re-derived here or by this referee.
- **Q6 (prediction).** The registered bands are wide (fraction: four decades; minimum: a factor 10). The prediction
  held; this is weak support for the model behind it. The two pre-registered criteria that failed as worded (E1, E2
  of the appendix) are reported in the result.
- **Q7 (Lemma H (ii), wording).** The statement needs "no zero of F at a pole of h" for h(rho) to be defined; true
  for the rows used (poles at Re z = -+3/8, -+5/8, certified abs F > 0 at the rate points).

## 3. Checks requested by the assignment

- RH assumed anywhere: no. Verified height restated as a result: no (see Q4). Known theorem presented as new: Q3.
- Zeta-only mechanism claimed: none. Controls behave as stated: DEL b = 0.9 fails at a window found independently
  (1.2); HEAT has the off-line zero and the identity is location-blind (1.1, 1.3).
- Not checked by this referee: Proposition M; the c20 quadrature lemmas and the three new error steps of 4.2; the
  HEAT cells for Y >= 8; Part 1 (recomputed only by the lane's own second pass); the 2.0e9-height screen itself.

## 4. Requirement flags (strict)

- R1 false: the forms are linear in the prime weights; Lemma H uses no arithmetic.
- R2 false: finite windows, finite rectangles, and a limit identity that carries no inequality.
- R3 false: no device; two controls fail a size test at explicit windows, one control passes an identity that
  every entire function of order at most 1 passes.
- R4 false: not addressed.

## 5. Server use by this referee

Two units through `rhrun` (1 core each, 6 GB and 2 GB limits), both finished on their own; nothing stopped or
killed; GPU not used. Scripts in `~/rh-push/c22-w1-u4-windows-del09-heat-limit-ball-server/refgen/`.

---

# Appendix: the lane's own second pass (same session as RESULT.md; not a separate referee; text unchanged, heading levels lowered)

## Lane second pass: c22-w1-u4-windows-del09-heat-limit-ball-server

Date 2026-11-20. **Status of this file.** It was written in the same session as `RESULT.md`. It is a second pass with
separate code (mpmath, floating point, different formulas and quadrature parameters) and a step-by-step re-reading
of the one proof; it is not a referee by a separate agent, and the lane line records `referees: 0`. A separate
referee is owed for Lemma H and for the cells above Y = 4. No statement about zeros of zeta is examined or made.

### Verdict

**Holds as a certified conversion, with the corrections E1 to E7 (none changes a sign, a cell or a row decision).**
- Part 1: the six windows are negative in balls; recomputed by a different formula to 28 digits. Holds.
- Part 2: DEL b = 0.9 has certified negative windows; two of the eight recomputed by a different formula (section 2).
  The row decision holds. The fraction 1.9e-6 and the zeta count are float64 (screen) and are labelled so.
- Part 3: Lemma H re-read; no gap found (section 3). The cells at Y = 1 and Y = 4 recomputed with separate
  quadrature; the zeta row recomputed from zeros for all six rectangles. Holds; "PROVED-1" is the right label and
  the record's rule (two referee files) is not met by this file.

### 1. Part 1, recomputation (`ref_u4.py` -> `ref_u4_part1.json`; unit `rh-c22refu1-1120154449`)

Separate code path: own sieve, own copy of the greedy rule (sha256 of the four sets equal to the lane's record on
the same prime range), the overlap integral through complex exponentials instead of the sine closed form, mpmath at
40 digits, t the decimal.

| family | t | Q_ctl, referee | Q_ctl, lane (ball midpoint) | Q_zeta, referee |
|---|---|---|---|---|
| DEL b=0.55 | 633099.15 | -2.86043313867876245654840728918 | -2.86043313867876245654840728918 | 2.08774261596751324340970725959 |
| DEL b=0.55 | 935352.75 | -2.79284577323639448395341276073 | -2.79284577323639448395341276073 | 1.46937085293607040712599583876 |
| DEL b=0.75 | 431553.15 | -1.92425291401937906873150554168 | -1.92425291401937906873150554168 | 3.3277892183194602128584955984 |
| DEL b=0.75 | 1078583.65 | -1.80648218021628177468174286271 | -1.80648218021628177468174286271 | 0.948516161892862660226536472222 |
| DEL b=0.9 | 1371365.25 | 0.113976912290848027921189381683 | 0.11397691229084802792118938168 | 5.29034549105115159845541123497 |
| DEL b=0.9 | 1501888.45 | 0.70706962110696804746988212101 | 0.70706962110696804746988212101 | 4.23625894809607187148856188602 |
| THIN b=0.75 | 1177978.95 | -7.86901984080968139807296461591 | -7.86901984080968139807296461591 | 2.6858079530147419027518315123 |
| THIN b=0.75 | 1440312.45 | -7.69879038732118599432164535264 | -7.6987903873211859943216453526 | 4.26457328572468390598008614841 |
| zeta | 1746644.65 | 0.025778381379835894781539134648 | 0.02577838137983589478153913465 | (same) |
| zeta | 955947.35 | 0.0464186014141301172384380756453 | 0.04641860141413011723843807565 | (same) |

All agree to the digits of the ball. The counts of primes of S below P (58, 66, 244, 375, 1659, 1751, 195, 215)
agree with round 21. The explanation of the 1e-11 differences against round 21 (decimal t against the nearest
float64) is confirmed by Table 1b of the lane: at the float64 height the balls reproduce all 15 printed digits.

### 2. Part 2

- Screen against round 21 on the round-21 range: five minima and five counts identical to the printed digits
  (`scan_r21range.json` against `scan_1e5_2.1e6.json`). The two programs share the overlap function and the
  greedy rule but not the summation (direct against non-uniform FFT). Deviation from direct sums inside the new
  program: at most 6.4e-7 over 6404 blocks.
- The screen is not the verdict: each certified window is recomputed at the exact P with a new eigenvector, and the
  only inputs taken from the screen are the eight heights.
- Recomputation by `ref_u4.py` (40 digits, exponential formula, own sets) of the first two windows of Table 2:
  see `ref_u4_part2.json` (unit `rh-c22refu2-1120160622`); the entries are quoted in the addendum at the end of this
  file. If that file is absent the recomputation did not finish and Part 2 rests on the lane's ball run alone.
- The prediction was registered before the run and is specific enough to fail (three numerical ranges); it held.
  Its derivation (Gaussian tail from one mean and one minimum) is crude; its success is not evidence for the
  Gaussian model, since the deleted fraction changes with height.

### 3. Lemma H, re-read

| step | check | finding |
|---|---|---|
| Fourier form of F | H_0(w) = c integral Phi(u) e^(i w u/2) du is the classical representation of xi(1/2 + i x) at x = w/2; convolution with G_tau(v) = (4 pi tau)^(-1/2) e^(-v^2/(4 tau)) multiplies the integrand by the transform of G_tau at frequency u/2, e^(-tau u^2/4); Fubini by absolute convergence | holds; the normalising constant of Phi is immaterial |
| bound | abs(e^(i w u/2)) = e^(-Im(w) u/2) <= e^(y u/2) + e^(-y u/2), y = abs(Im w); e^(-tau u^2/4) <= 1 needs tau >= 0 | holds for tau >= 0, which is the HEAT family of line 4 in this convention (backward flow = Gaussian smoothing); for the opposite sign the order is still 1 but the displayed bound is not the one to use (E5) |
| F(0) > 0 | Phi > 0 (recalled) | holds given the recalled input; it is used only to apply Jensen at 0 and to write Hadamard without a factor w^m, and could be dropped |
| order, Jensen | log xi(sigma) = O(sigma log sigma); n(r) <= log(M(e r)/F(0)) | holds; gives sum abs(rho)^(-1-delta) finite for every delta > 0 |
| Hadamard | order at most 1, so genus at most 1; logarithmic derivative termwise, locally uniformly | holds (recalled) |
| termwise integration | sup over the contour of abs(1/(w - rho) + 1/rho) <= 2 max abs(w)/abs(rho)^2 for abs(rho) >= 2 max abs(w); finitely many other terms are continuous on the contour | holds |
| residues | for rational g = O(abs(w)^-2): sum of all residues is 0 (integral over a large circle); applied to h, to h/(w - rho) with rho inside (all poles inside R), and with rho outside (poles inside R are those of h; the residue at rho is h(rho)) | holds; sign: C_R = - sum over outside zeros, consistent with Table 3 (W_R - Q_gen = C_R: for P8, -0.5493 - (-0.4898) = -0.0596) |
| limit | tail of an absolutely convergent series | holds for exhaustions; the nested rectangles of Table 3 lie in the upper half-plane and are not an exhaustion, so Table 3 illustrates the lemma and does not instantiate (iii) |

Numerical consistency with the lemma (not a proof of it): (a) C_R is unchanged between Y = 1 and Y = 2, where no
zero enters; (b) Y abs(C_R) tends to 2 (1/2 pi) log(T/2 pi) = 1.906 (observed 1.904 to 1.913 for Y >= 32); (c) the zeta
row has the same tail to 1.1e-5 at Y = 32.

### 4. Part 3, recomputation

- `ref_heat.py` -> `ref_heat.json` (unit `rh-c22refh-1120150911`, mpmath 34 digits). Separate evaluation of F: its own
  node line y0 = -1.4 (the lane: -1.6), step 0.03 (the lane: 0.0374), one global node grid, all nodes within 34 of
  Re w, no slabs, no reflection, no mean-value form; contour integrals by mpmath quadrature.

| quantity | referee | lane |
|---|---|---|
| Q_gen, P8 | -0.4897622353471303714729122 | [-0.4897622353471303714729122 +/- 7.34e-26] |
| Q_gen, P1 | 2.92235934059363905358215 | [2.92235934059363905358 +/- 8.05e-21] |
| max abs(F/F') at the 40 listed zero representatives | 4.8e-31 | boxes of half-width 1e-15, winding number 1 |
| Y = 1: contour count | 3.0 (imaginary part 8e-36) | 3 |
| Y = 1: C_R, P8 / P1 | -0.81694413921256172076 / -0.26470727276151717407 | [-0.816944139212561720758 +/- 5.06e-22] / [-0.264707272761517174066 +/- 6.06e-22] |
| Y = 1: abs(Q_gen - W_R + C_R), P8 / P1 | 1.8e-30 / 1.3e-30 | cell radius 2.2e-14 / 5.1e-14, encloses 0 |
| Y = 4: contour count | 8.0 | 8 |
| Y = 4: C_R, P8 / P1 | -0.45841101650722253716 / -0.15228810167077742533 | [-0.458411016507222537164 +/- 5.07e-22] / [-0.152288101670777425332 +/- 6.78e-22] |
| Y = 4: abs(cell), P8 / P1 | 1.8e-30 / 1.3e-30 | encloses 0 |

  Shared with the lane: the representation (Cauchy shift plus trapezoid rule) and the zero list used for W_R.
  Not shared: node line, step, truncation, evaluation code, quadrature.
- `ref_zeta.py` -> `ref_zeta.json` (unit `rh-c22refz-1120154517`, mpmath 30 digits): Q_gen from xi'/xi by mpmath
  (7.29060378574827883356443 and 5.612677626531679303397997; the lane's balls contain them); abs zeta at the 61 listed
  zeros at most 2.1e-27; W_R - Q_gen from the zero list against the lane's contour integral C_R (which does not use
  the zero list), row P8: -1.0219630544483528319, same, -0.52350944741306346059, -0.24174993667311881095,
  -0.11730268061648741478, -0.059553260140707412583 for Y = 1 .. 32: equal to the lane's C_R to its ball in all
  six rows; row P1 likewise.
- Not recomputed: HEAT rows Y = 8 .. 128 (the extension run repeats rows Y <= 32 of the first run with the same
  slabs, so its agreement to the last digit is determinism, not a check); the certified windings; the proved error
  bounds of the c20 quadrature (refereed in that lane).

### 5. Corrections and qualifiers

- **E1 (pre-registered threshold not met as written).** "The ball must contain the 30-digit value of round 21 to its
  printed 15 digits" fails for six of ten rows at the decimal t. Cause identified and tested (float64 height in
  round 21). Recorded in RESULT 2.2; the threshold should have named the object.
- **E2 (pre-registered criterion not met as written).** "abs(C_R) strictly ordered for k = 1 .. 6" fails at k = 1 -> 2
  (equal values). The lemma predicts equality whenever no zero enters; the criterion was wrongly worded.
- **E3.** Y = 64 and 128 and the zeta evaluator by series were added after PREREG; they are marked as such. The
  first zeta run did not finish (one contour piece ran for more than ten minutes with the first evaluator) and was
  stopped by exact unit name; no result of that run is used.
- **E4.** "Boxes meeting the line" is not a statement that a zero is on the line; for HEAT the on-line / off-line
  split (83 / 160) is certified only in the direction "off the line" (the box of an off-line representative does
  not meet the real w-axis).
- **E5.** Lemma H is stated for tau >= 0 in the convention F = H_0 * G_tau; the sentence "holds verbatim for tau = 0"
  is correct; no claim for the forward direction is made or needed.
- **E6.** "Fails S3" is relative to the error term err of the U4 lane (Proposition M); the certified facts are the
  sign of the explicit form and the inequality Q + err < 0 with err evaluated by the lane's formula. Stated in
  RESULT section 7.
- **E7.** For a few minutes 9 cores were in use against the 8 of the assignment (the 6-core screen, two 1-core cell
  runs and a 1-core recomputation). Memory stayed below the limit.

### 6. Three weakest steps (referee's view)

1. Lemma H has one derivation and three recalled inputs; this file is not independent of it. The explicit rate is
   missing, so "C_R -> 0" is a limit statement without a certified modulus.
2. The HEAT cells for Y >= 8 have a single execution; their correctness rests on the c20 lemmas, on the window
   bound written once in this lane, and on Arb. The agreement of Y abs(C_R) with 2 (density) is a consistency check
   in floating-point sense only.
3. The U4 rows inherit err and the 6-mode space from the earlier lanes; the screen's counts are float64; the first
   failing height of DEL b = 0.9 and the dependence of the failing fraction on height were not extracted.

### 7. Flags

R1 = R2 = R3 = R4 = false, as in RESULT section 6. Agrees with the lane.

### Addendum: recomputation of two windows of Table 2 (`ref_u4_part2.json`, finished)

| family | t | P | primes of S below P | Q_DEL, referee (mpmath, 40 digits, exponential formula, own sets) | Q_DEL, lane (ball) | Q_zeta, referee | Q_zeta, lane (ball) |
|---|---|---|---|---|---|---|---|
| DEL b=0.9 | 101750922.75 | 1013103 | 22426 | -1.98569898983956709879981841968 | [-1.98569898983956709879981842 +/- 2.43e-27] | 2.8937918885900136239224272972 | [2.89379188859001362392242730 +/- 6.20e-27] |
| DEL b=0.9 | 32966257.05 | 435063 | 11246 | -1.9787446148483910741415086684 | [-1.97874461484839107414150867 +/- 2.16e-27] | 3.94434313991016742279599996225 | [3.94434313991016742279599996 +/- 3.19e-27] |

Both referee values lie in the lane's balls. The other six DEL b = 0.9 windows and the four zeta windows of Table 2
were not recomputed.
