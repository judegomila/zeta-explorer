# REFEREE: c13-noncone-kernel-separator-search (independent referee, lens: general)

Date 2026-11-19. Written by a referee agent that did not take part in the lane. The author's own check, which this
file replaces at the top, is kept unchanged as the appendix below.

**Verdict: holds.** The claim is a measured negative ("none" in the registered dictionary D, no statement about zeta)
plus one elementary lemma. The lemma is confirmed. Every number that can be recomputed from the local record was
recomputed and agrees. No sign differed in 1,226 entries re-evaluated with separate code at 330 digits. Nothing assumes
RH, restates verified height, or makes a statement about zeros.
Flags set by this referee: **R1 = false, R2 = false, R3 = false, R4 = false.**

The findings in section 3 qualify how the result should be read. None of them changes the outcome "none".

## 1. PROVED step (Lemma H): re-derived

K_tau(u) = e^(tau u^2/4) K(u), tau < 0, K > 0 on the points read.

- (i) (u_1+v_1)^2 + (u_2+v_2)^2 - [(u_1+v_2)^2 + (u_2+v_1)^2] = 2(u_2-u_1)(v_2-v_1) = 2d. So
  det[K_tau(u_i+v_j)] = e^(tau A/4)(e^(tau d/2) K_11 K_22 - K_12 K_21). With tau < 0, d > 0 and K > 0:
  e^(tau d/2) K_11 K_22 < K_11 K_22, so a negative minor of K gives a negative minor of K_tau. Confirmed.
- (ii) (u-h)^2 + (u+h)^2 = 2u^2 + 2h^2 gives the stated identity; F1[K] < 0 implies F1[K_tau] < 0 for every lam > 0
  (the restriction lam >= 1 is needed only to know F1[K] < 0 from log-concavity). Confirmed.
- (iii) F2 at lam = 1 equals -k^2 (log k)''; the tilt adds a linear term to log k and the Gaussian adds tau/2 to the
  second derivative. Confirmed. In the displayed identity "F2[K]" on the right is the untilted expression
  K'^2 - K K'' (the tilt is in the prefactor e^(2 mu u)); this is a notation point, not an error.
- Hypotheses used: K = zeta's K3 is positive and log-concave. Positivity and log-concavity of the Riemann-Polya
  kernel are classical (Wintner 1935 for monotonicity; Csordas-Varga 1988 prove the stronger statement that
  log Phi(sqrt t) is strictly concave, which implies log-concavity of Phi since Phi is decreasing; cited from memory
  by this referee as well, not checked against the source). Numerically, with a kernel typed from the definition:
  K3 > 0 on [0, 2.6], K3(0) = 1.78678760186849, and (log K3)'' <= -18.7269 on a grid of step 0.025 (largest at u = 0).
- Numeric rerun on a different case (off-grid, real nodes, tau uniform in (-3, -0.01), up to 400 random cases of (i) and
  (ii), every eighth also (iii) with random tilt, mpmath 330 digits): 0 sign failures; the three identities hold to relative
  error 1.7e-267.
- Against the data: in `out/signs_D3a.npy` all 45,520 order-2 minors are negative for zeta and for all 26 heat
  members (1,183,520 entries, none undecided); in D3b-F1 with p = 0, lam >= 1 all 4,578 rows are negative for zeta
  and the heat members; in D3b-F2 with p = 0, lam = 1: 706 positive and 1 undecided for zeta, no heat member opposite.
  Outside the scope of the lemma heat does reject (D3b-F2 grid: 31 rows with a battery heat member opposite to zeta,
  2 of them with p = 0 and lam != 1), so the lemma's scope is stated correctly and is not wider than proved.

Lemma H is the standard fact that a Gaussian factor of negative exponent strengthens log-concavity. RESULT labels it
"elementary" and does not present it as new. It applies to one class (backward heat) and the order-2 part of D3 only.

## 2. Independent numeric checks (code shares nothing with the lane; mpmath, 330 digits, no reflection u -> -u)

Kernels typed from PREREG section 2: zeta Kpol and K3 (term (4w^2 - 6w) e^(u/2) e^(-w), re-derived by hand), characters
3.2, 4.3, 5.2, 5.4, 7.3 with omega measured from the series, DH = Re of the 5.2 kernel, T-NR (3, 2.2), HEAT K3, and
HEAT with polar terms from the integral definition (checked at tau = 0 against zeta's Kpol: relative difference
below 2e-41). The DH coefficients come out as (1, kappa, -kappa, -1), kappa = 0.284079043840412, the
Davenport-Heilbronn value. Rows were drawn from the server sign matrices with this referee's seeds.

| check | rows | entries compared | different signs |
|---|---|---|---|
| Prediction 2a: D1 grid rows one-signed on P2 with battery T-NR opposite (6,824 eligible = 19,269 x 0.354), 20 rows not chosen by the lane; objects zeta, five characters, T-NR | 20 | 140 | 0 |
| Battery DH on P2-one-signed rows: D3a 25, D1 20, D2-F1 20, D3b-F1 20, D2-F2 12, D3b-F2 12, D3b-F3 5; objects zeta, five characters, DH, T-NR, and both battery heat members for the K3 families | 114 | 1,036 | 0 |
| The five zeta-only T-train functionals (A3 draws): zeta, five characters, DH, T-NR, HEAT -0.1 and -0.5 with polar terms | 5 | 50 | 0 |

In the first check T-NR is opposite to zeta and to the five characters in 20 of 20 rows: prediction 2a is false, as
RESULT says. In the second, DH has zeta's sign in 114 of 114 rows. In the third, zeta is negative on all five,
DH and T-NR are positive, HEAT -0.5 is positive, and HEAT -0.1 is negative on four of the five: the rejection of the
heat class by these functionals is by the member tau = -0.5 only. The third check covers HEAT with polar terms, which
the author's mpmath check did not run.

(A first pass of these checks at 70 digits with other seeds also showed no difference, but 70 digits is below the
size of some kernel values at u < -2 when the reflection is not used; it is not counted.)

Counts recomputed from the grid sign matrices with separate selection code: 2,794,368 rows; 51,764 one-signed on P2
(per family 19,269 / 27,421 / 1,352 / 1,092 / 1,747 / 877 as in table 3.1); battery DH opposite on 0 of them;
float64 T-train 0 for P0 and P2; 262,135 rows that float64 cannot exclude (the ball-stage input of table 3.5,
D1: 246,765). Zeta's sign pattern on D3a (order 2: -, order 3: -, order 4: +, all 1,294,690 rows) and "no heat entry
differs from zeta on D3a" are confirmed from the matrix. The arithmetic of the stage totals, of the ball-stage kill
columns and of the percentages in section 0 is consistent. E*(i, 0.7) = -2.3309938134148152 by this referee's
Fourier expansion, equal to the lane's value; xi*(1.4) = 1.8089 > 0 > xi*(0.4) = -4.1436 as used for E_a.

Zeta-only mechanism: none is claimed. The five zeta-only functionals are reported as not meeting the rule and as
separating zeta from the L-functions; this referee's evaluation agrees (for example the D2-F2 functional is negative
on zeta and positive on all five characters tested).

## 3. Findings that qualify the reading (none is an error in a reported number)

1. **The positive condition does not hold out, and this is stronger than the DH statement.** On the 51,764 grid
   functionals one-signed on P2, a held-out L-function (conductor 14 to 40) has the opposite sign at a mean rate of
   0.287 (single members up to 0.98: chi31.15c on D1, chi31.11c on D2-F2); only 529 functionals (1.0%) keep their
   sign on all 24 held-out L-functions. Held-out DH members of real-part type (10 of the 24) are opposite at a mean
   rate of 0.193, lower than the held-out L-functions; those of imaginary-part type (14) at 0.709. So in D "one sign
   on zeta and the characters of conductor <= 13" is a fitted condition on 24 objects, and out of sample the
   functionals reject Euler products more often than real-part combinations without one. The line "0 of 629,432
   reject the battery Davenport-Heilbronn function" is correct, but it should not be read as a sensitivity of D to
   the Euler product that one member happens to escape.
2. **Held-out DH rejections are carried by the imaginary-part members.** Under the lane's normalisation
   K(-u) = conj K(u), the imaginary part is odd in u and changes sign at u = 0. The count "1,265 functionals reject
   at least 23 of 24 held-out DH members" therefore depends on the convention that admits Im parts into the class
   (RESULT section 8 item 3 names the root number; it does not give the split).
3. **The 629,432 are not independent draws.** 459,547 of them (73%) come from the adaptive stage, 500 perturbations
   around at most 200 centres per family. The independent part is 169,885 (grid 51,764, draws 10,673 + 107,448).
4. **What "resolved in balls" covers.** `hp.py` evaluates in balls only the entries float64 left undecided and stops
   at the first class that does not reject; a float64-decided entry is trusted. On the grid this matters little
   (of the 262,135 ball-stage rows zeta was float64-decided on 45, and no kill by T-NR rests on float64 signs
   alone), but the verdict for the 12.15 million rows that float64 excluded rests on the rounding-noise rule A1,
   which is a model (RESULT section 8 item 2 says so). Evidence for A1: 0 differences in the lane's 69,577 entries
   and in this referee's 1,226.
5. **What could not be rechecked locally.** The sign matrices of the registered draws, the adaptive stage and the A3
   draws (10.2 of the 13.0 million functionals) are on the server only; their counts were read from the JSON files
   and not recomputed. The five A3 survivors of the zeta-only tier were rechecked from the mirrored parameter tables.
   No server job was launched by this referee.
6. **Verdict label.** "precise-obstruction" is accurate only in the sense "measured closure of D on the registered
   grid and draws, with the conventions of PREREG section 2, and a per-class table". The only proved obstruction is
   Lemma H. T-NR and DH have one battery member each. A map row should carry the words MEASURED and "finite search".
7. **Wording.** "Each disagrees with 16 to 22 of the 24 L-functions": the 24 include zeta, so it is 16 to 22 of the
   23 other training positives. Section 6 gives the slice as "of 150 GB"; the brief gives 80 GB. Neither affects a
   result.

## 4. Requirement flags (strict)

| flag | value | reason |
|---|---|---|
| R1 | false | no argument uses multiplicativity; the search found no functional that separates Euler products, and finding 1 shows the fitted functionals do not track the Euler product out of sample |
| R2 | false | no height-uniform or every-window conclusion; kernel read on [-2.6, 2.6] |
| R3 | false | the measured result is that controls pass: battery DH on every P2-one-signed functional, heat on more than 99.9%; Lemma H proves that heat passes the order-2 part of D3 |
| R4 | false | nothing reaches the critical line |

No PROVED claim broken. No statement about zeros of zeta. Referee scripts were run from a scratch directory through
`scripts/memcap.sh 8` and are not part of the record; the method is described in section 2.

---

# Appendix: the author's own check (unchanged; not an independent referee)

# REFEREE: c13-noncone-kernel-separator-search (author's adversarial check; NOT an independent referee)

Date 2026-11-19. Written by the lane's own agent in a second pass with separate code. It does not count as a referee
under `campaign/METRIC.md`: referees = 0, refereeHolds is not set by this file. An independent referee is owed.
Part A: checks made with code that shares nothing with the search. Part B: attacks on the claims. Part C: what an
independent referee should do first.

## A. Independent checks

**A1. Third implementation of the functionals (`ref_check.py`, `tables/referee_mp_check.json`).** mpmath, 60 digits,
kernels typed from PREREG section 2 as plain sums (theta by `jtheta`, characters by their series, Bessel sums by
`besselk`, K3 of the Gaussian sums by the hand-derived term (4w^2 - 6w) e^(x/2) e^(-w)), evaluated at every real x
without the reflection u -> -u that `kern.py` and `ballk.py` use. Random (functional, object) pairs of the server
sign matrices of D1, D3a, D2-F1, D2-F2, D2-F3, D3b-F1, D3b-F2, D3b-F4:
1,107 float64-decided pairs, 1,107 equal signs, 0 different; 93 float64-undecided; 307 pairs not run (K3 of theta^w
and of E_a, which would need nested numerical differentiation, and HEAT with polar terms). By type: character 253,
DH-type 115, no-functional-equation objects 392, T-NR 117, E_a 102, theta^w 48, HEAT (K3) 76, zeta 4.
The first pass of this check reported 14 different signs. All 14 were defects of the reference, found by
re-evaluating each case in balls: 13 came from `mpmath.det`, which returns 0 for a matrix whose entries are of size
1e-200 (replaced by the Leibniz formula); 1 came from `mpmath.diff` applied at u = 0 to a formula written with
abs(u), where the truncated Bessel sum leaves a derivative of size 1e-70 that the step 1/h multiplies (the reference
was rewritten without abs). The float64 and ball signs of the search agreed with each other in all 14 cases. A check
that needed two repairs of its own reference is weaker evidence than one that ran clean; the counts above are from
the repaired run.

**A2. Selection logic (`ref_select.py`, `tables/referee_selection_check.json`).** The criterion of PREREG sections
1 and 5 re-typed row by row with python sets. On the ten Turan families of the grid (every row): the numbers of
one-signed functionals for P0, P1, P2, the nine per-class rejection counts and the T-train and full counts are
identical to `analysis_*.json`. On D1 and D3a (every 7th row): counts within sampling error of one seventh of the
full counts (for example D1, P0: 118,475 against 118,509.7), T-train 0.

**A3. Float64 against balls (run by the search, not by this file).** 17,257 random pairs and 53,850 confirmation
entries: 69,577 float64-decided, 0 different.

**A4. Kernels against the c12 battery interface (`validate.py`).** int K e^(zu) du divided by `core.completed(1/2 + z)`
at z = 0.3 + 2i, -0.1 + 7.5i, 0.45 + 14i is constant to 3e-14 (zeta), 2e-13 (DH), 3e-13 (T-NR), 2e-11 (EA-1/4). The
validation also had a defect of its own on first run: the closed form used for zeta's K3 was half the kernel's
normalisation and was summed with too few terms at negative u; after correction the HEAT entries agree to 6.5e-15
(K3) and 2.2e-16 (Kpol and two derivatives, 4 points) (`tables/validation.json`). This was a reference error; no kernel was changed.

## B. Attacks on the claims

**B1. Is "none" produced by the strictness of criterion (c)?** No: (c) is never reached. With the registered
positives no functional rejects a battery member of each class (T-train = 0 in 12,994,697). The weaker readings
registered in advance give: T-weak 0 (P1, P2), 5 (P0); "an opposite member, battery or held-out, in every class"
(not registered as a tier; reported in `tables/closest_approaches.md`): 8 functionals with P2, worst-class held-out
fraction at most 2/24.

**B2. Is the zero for the battery DH member an artefact of putting its parent character among the positives?**
Tested after the run (`tables/dh_diagnostic.json`, post hoc): removing the complex character mod 5 from the positives
leaves every count unchanged on the grid. Not tested: removing all characters of conductor 5, or all odd characters.
Held-out DH-type members are rejected often (about half of them on a typical one-signed functional), so the zero
belongs to the battery member, not to the class; with "any member" the DH class is not the blocker and HEAT is.

**B3. Amendment A1 was written after data had been seen.** True, and stated in PREREG section 10. Its direction is
checkable: it only turns decided entries into undecided ones, and undecided entries are sent to the ball stage; the
one-signed counts for P2 are the same before and after on the families printed in both local runs (D1 19,269; D3a
27,421; D2-F2 1,092; D3b-F1 1,747; D3b-F2 877), and the P0 counts drop where Hecke-compensated polar kernels cancel
(D2-F1 44,915 to 33,183). The local trial outputs were deleted, so the "before" numbers are in the session log only.

**B4. The ball stage stops at the first class that does not reject.** For a functional killed by T-NR the other
classes were not resolved in balls. This is sufficient for T-train = 0 and for the verdict; it does not give the
per-class table on the float64-undecided rows. The pass fractions of section 3 are therefore fractions among
functionals whose sign on the positives float64 could decide (for D1 with P0: 829,568 of 1,294,690).

**B5. Tail enclosures.** `ballk.gauss_series` adds a radius 8(N+1) e^(beta u) (|beta| + 2(W + k + 1))^k e^(-W) for the
terms beyond N, justified by a ratio below 1/2 between consecutive terms once W > 60; this is argued in a comment, not
proved in the file. The Bessel tail uses |K_a(x)| <= K_(1/2)(x) for |Re a| <= 1/2 (integral representation) and a
crude factor for derivatives. HEAT with polar terms uses `acb.integral` to VMAX = 4 and adds 2^(-13000) for the
remainder without a written bound. None of these was exercised on a row where it decides the verdict: the 841,651
ball rows were decided by zeta, T-NR, theta^w, DEL/THIN and DH (Gaussian sums) except 5 kills by E_a and HEAT in the
A3 draws and the completion of the 5 alive rows.

**B6. Lemma H.** Checked against the data: on D3a no HEAT member (26 objects) differs from zeta on any of the
1,294,690 grid minors, which contains the proved order-2 case (45,520 minors) and is otherwise measured. The lemma's
use of log-concavity of the Riemann-Polya kernel is cited from memory.

**B7. The planted control lost one tilt.** After A1 the kernel-level planted separator is found at 6 of 7 tilts; at
mu = 0 the entry k'(0) = 0 is exact and A1 calls the value undecided. Before A1 the local run found 7 of 7. This is
the conservative side of A1 and shows that float64 alone can miss a true separator on rows with an exactly vanishing
entry; in the real run such rows go to the ball stage (0 functionals had a ball-zero value on zeta).

**B8. Shuffles.** Two of 5,000 permutation runs have a T-train survivor (both in D3a families); none has a T-weak or
full survivor. So the full criterion has an estimated false-positive rate below 1/5,000 per family run, and T-train
alone would not have been evidence.

**B9. What the lane does not show.** It does not show that no functional of the registered form separates; it shows
none was found among 13.0 million, and names the class that stops each family. It does not test Hermitian forms,
orders above 4, or kernels in another normalisation. The statement "the character kernels break the Polya-frequency
sign pattern more often than E_a, HEAT, EIS-w, theta^w" is for nodes u_i + log n_j in [-2.6, 2.6] with n <= 13.

## C. For an independent referee

1. Re-derive two kernels by hand and compare with `tables/validation.json`: the heat kernel with polar terms (PREREG
   section 2) and the E_a kernel with its polar constants xi*(1 + 2a), xi*(2a).
2. Re-run `ref_select.py` and `ref_check.py` (local, minutes) on `out/`.
3. Decide whether the conventions (real part for complex kernels; untwisted n = 0 term; battery member against any
   member) are the ones the registered question intends; the answer "none" holds under each reading tried, the
   per-class table changes with them.
4. Check prediction 2a independently: `out/confirm_D1.json`, field `prediction2_tnr_counterexamples_ball`.
