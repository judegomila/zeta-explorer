# REFEREE (general lens): c5-thin-propd-dichotomy

Date 2026-11-18. Internal adversarial pass on `RESULT.md`. No statement about zeros of zeta is at issue. Only this
file was written in the lane directory; referee scratch runs are in `/tmp/ref-c5thin/` (local, `scripts/memcap.sh 8`,
single process, each under 10 s). The compute server was not used.

## Outcome

**holds = false for the claim as worded.** The numbers are reproducible and the measured law is real. Three
statements built on them do not stand:

1. "Non-multiplicative controls show no component" / "multiplicativity produces the signal" (verdict item 6,
   section 4, R1 note): **refuted by a control run by the referee.** The component is present for non-multiplicative
   weights with the same constant; the lane's two non-multiplicative controls had Mertens sum near zero by
   construction.
2. "Absence of the component is excluded at more than 200 standard errors, so the high-side-failure hypothesis is
   excluded" (section 3.4): the test has **no discriminating power** between the two halves. The regression
   coefficient is a linear functional of the weight, fixed by the Liouville rows alone; r near 1 is obtained for every
   weight tried, multiplicative or not.
3. "The failing half of Proposition D is the low estimate (row bound (5.36))" (verdict, first paragraph): the row
   bound (5.36) and the low estimate of Proposition D are different statements. Cauchy-Schwarz gives
   (5.36) => low estimate, not the converse. Even if (5.36) is false for eps (which is an extrapolation, see 4), the
   low estimate |I_eps| << Z^(1/4+epsilon) can still be true and the high comparison the false half.

There are no PROVED steps in the result (labels are ARGUED / MEASURED / HEURISTIC), so there was nothing to re-derive
as a proof. Arithmetic of the exponents was checked (below).

## What was checked and how

### A. Reproduction (same case)

Recompiled `rows.c`, reran `prep.py` on `data/sf_120k.npz` (scipy absent locally; `expi` replaced by its power
series), test G, Z = 1024: MS_one = 207.648404, MS_e95 = 204.802882, MS_liou = 243.150598, rho_e95 = -0.157807;
Mertens sums identical to `data/in_G_1024.bin.side.json` to the printed digits. These equal the ball-arithmetic
values in RESULT section 2. The pooled statistics of section 3.4 (r, chi^2, exponents of Ecoh, exponent of E_liou
1.1767 +- 0.0160) and the raw-ratio exponents of section 3.2 were recomputed from `srv/` with the shipped scripts and
agree with the tables.

### B. Rerun with a different case (non-grid scales)

Test C at Z = 3000, 6000, 12000, 24000 (not on the half-octave grid; 10890 to 87018 rows):

| Z | MS_one/D - 1 (se), percent | MS_liou/D - 1 | rho_e95 (se) / M_e95/M_liou | rho_e90 / pred |
|---|---|---|---|---|
| 3000 | +0.19 (0.98) | +16.92 (1.34) | -0.128 (0.046) / -0.139 | -0.199 / -0.223 |
| 6000 | -0.41 (0.68) | +28.66 (1.05) | -0.130 (0.020) / -0.134 | -0.196 / -0.209 |
| 12000 | +0.21 (0.49) | +38.56 (0.80) | -0.139 (0.011) / -0.131 | -0.211 / -0.196 |
| 24000 | -0.85 (0.34) | +41.99 (0.60) | -0.142 (0.007) / -0.127 | -0.203 / -0.184 |

These interpolate the shipped grid values (2896, 5793, 11585, 23170). The measured statements of items 2, 3 and the
rho table are confirmed at these scales.

### C. Control run by the referee: non-multiplicative weights with a large Mertens sum

Two weights were put in the slots of `rm95b` and `rm90` (scratch copy of `prep.py`):

* `nm10`: w(A) = liou(A) xi(A), xi independent signs with P(+1) = 0.55 (hash of the index). Not multiplicative.
  M_w about 0.10 M_liou.
* `nm50`: w(A) = liou(A) on a random half of the indices, an independent random sign on the other half. Not
  multiplicative. M_w about 0.50 M_liou.

Result (test C, reference liou, rho (se) / M_w/M_liou):

| Z | nm10 | nm50 | MS_nm50/D - 1 (se), percent | (M_nm50/M_liou)^2 x (MS_liou/D - 1), percent |
|---|---|---|---|---|
| 3000 | +0.101 (0.045) / +0.130 | +0.466 (0.065) / +0.486 | +4.86 (1.01) | 4.00 |
| 6000 | +0.086 (0.020) / +0.103 | +0.491 (0.030) / +0.499 | +6.78 (0.74) | 7.15 |
| 12000 | +0.109 (0.011) / +0.096 | +0.500 (0.017) / +0.500 | +8.80 (0.54) | 9.64 |
| 24000 | +0.095 (0.007) / +0.095 | +0.504 (0.012) / +0.500 | +10.37 (0.38) | 10.48 |

Pooled: r_nm10 = 1.012 +- 0.058 (chi^2 of r = 0: 310), r_nm50 = 1.003 +- 0.018 (chi^2 of r = 0: 3038). For `nm50`
the quadratic law (3) holds in the total as well (last two columns), with an excess over the diagonal larger than
that of any thin weight.

The lane's own tables already show the same thing at lower significance: `shuf95` has r = 1.08 +- 0.05 with
chi^2(r = 0) = 454 on 21 scales, `iid` r = 1.13 +- 0.13. The text of item 6 is hedged ("no coherent component beyond
their own small M_w"); section 4 ("non-multiplicative sign sets of the same density have none") and the summary
claim are not.

Consequence. The component of the rows along the common profile is C_w -> M_w, a **linear** functional of the weight
(sum of mu(c) w(c) q_c^(-1/2) V); it does not require w to be multiplicative. Multiplicativity of eps enters only
through the size of M_eps (the zero at b), which is c4's input, not a finding of this lane. The R1 note in section 5
and the "restated for R3" bullet of section 4 must be reworded accordingly.

## Errors and overstatements

**E1 (logical; affects the headline).** Section 1.2 derives correctly: low estimate false => MS_eps not
O(Z^(2b - 5/6 - delta)) (contrapositive of Cauchy-Schwarz with ||A||^2 << Q/Y; exponents checked:
2(b - 2/3) - 1/2 + ... gives 2b - 5/6 = 1 + 2(b - 11/12)). The converse is not available. The lane measured evidence
for "MS_eps contains a term kappa M_eps^2", which is the direction that does **not** decide Proposition D: a large
||B|| leaves |I_eps| free. Only a bounded row moment would have decided (low estimate true, hence high comparison
false). What the data bear on is the truth of the lemma (5.36) for eps, not which of the two statements about I_eps
is false. Section 4 and weakest step 1 acknowledge that the probe was not computed; the verdict paragraph and the
R3 note ("the failing step is (5.36), not the high comparison") state more than that.

**E2 (the decision statistic is not a test of the dichotomy).** rho_w = Re(X_wv - Dx_wv)/E_v is linear in w. With
v = liou it is a fixed functional L_Z(w) determined by the Liouville rows. The measurement is that
L_Z(w) = (1.0 to 1.16) M_w/M_liou for all 16 weights tried (14 of the lane, 2 of the referee). Hence r near 1 for
eps holds whichever half of Proposition D is false, and "H_high excluded at more than 200 standard errors" excludes
a hypothesis (r = 0) that no scenario predicts once M_eps != 0. RESULT weakest step 1 says "that H_high implies
r = 0 rests on (3)"; in fact (3), being linear in each weight slot, cannot produce r = 0 for any weight with
M_w != 0, so H_high was never represented in the test.

**E3 (the exponent of the coherent part is not an independent measurement).** Ecoh_w = rho_w^2 E_liou, so its exponent
is identically (exponent of M_w^2/M_liou^2) + (exponent of E_liou) + 2 (drift of r) = (2b - 1) - 1 + 1.177 + small.
The first term is arithmetic of the thin set (known from c4), the second is a Liouville measurement. "1.08 against
1.0667 predicted and 1 allowed", "0.98 for b = 0.90" and "the sign change at 11/12 is reproduced" restate
2b - 1 + kappa-exponent; they are not observations on the eps rows beyond the constancy of r. The "4 to 6 standard
errors above 1" for b = 0.95 is therefore a statement that the Liouville kappa exponent exceeds 0.095, with the
same staircase caveat.

**E4 (error bars on the kappa exponent).** Quoted values: 0.177 +- 0.016, 0.182 +- 0.009, 0.163 +- 0.002, collapse
0.195 +- 0.005, 0.187 +- 0.007, 0.148 +- 0.004, 0.133 +- 0.008. These differ by many of their own standard errors; the
single-power fits have chi^2/dof 5830/19 (E_liou, test C) and 204/17 (Ecoh_e95). The referee's four non-grid scales
give 0.28 +- 0.09. The supported statement is "between 0.13 and 0.20 in the windows tried (0.28 in a short window),
staircase, compatible with 1/6"; the summary "0.18 +- 0.01" understates the uncertainty. In test C kappa is flat
(2.42 to 2.49) over Z = 2^16 .. 2^18.

**E5 (independence model).** The scales are half-octaves while test C has support e^(+-1.5) and test G is wider, and
the row sets are nested: adjacent scales share most index terms and most rows. The pooled errors (r = 1.047 +- 0.003)
assume independent scales; chi^2(fit) = 10.8 on 20 degrees of freedom and 2.1 for d75 indicate correlated or
over-estimated errors. The pooled standard errors and the "200 se" figures are not calibrated. This does not change
r != 0.

**E6 (minor).** Section 3.5, weight 1: "1/zeta_K regular, M_one -> 0" is not a theorem: with the q_c^(-1/2)
normalisation M_one(Z) is a sum over zeros of zeta_K on Re s = 1/2 weighted by the Mellin transform of V; it is
small for these tests (measured -0.88 to -0.37, test C, Z = 3000 to 24000) but no limit is established.

**E7 (minor, wording).** "Random prime sets of the same density have it with the same constant (the zero at b is a
property of the density)": consistent with E2; any weight with that Mertens sum has it.

## Points checked and found correct

* conj(alpha) in the row: the manuscript text of (5.30) prints alpha, but D(s, Psi) and L_0(s, Psi) of Proposition
  5.1 (paper.txt lines 1417 to 1422) carry the conjugate and (5.31) forces it. The lane's reading is right; the
  plain-alpha control supports it.
* Lemma 5.8 at M = N = 1, O = 0 gives Z^(1+epsilon) for rows q_m <= C_m Z (paper.txt (5.36)); hypothesis "finite-ray
  characters" as quoted.
* Threshold arithmetic: kappa ~ Z^(1/6), M_w^2 ~ Z^(2b-1) => Z^(2b - 5/6), above Z exactly for b > 11/12.
* Extrapolation scale: 0.88 percent growing at local exponent 0.087 reaches 100 percent after a factor
  114^(1/0.087) ~ 10^23.6 in Z, i.e. Z ~ 10^30; with 0.0667, Z ~ 10^37. As stated.
* The raw statistic MS_eps/MS_one has no power at these scales: confirmed (raw exponents recomputed, 0.0005 +- 0.0003).
* Liouville: growth of MS_liou relative to the diagonal is seen directly (17 percent to 42 percent over
  Z = 3000 .. 24000 in the referee run; 77 percent at 2^21 in the lane data).
* Nothing assumes RH, restates verified height, or presents a known theorem as new. The remark that (2) with (3)
  would give no pole of 1/L(s, w) in Re s > 11/12 is labelled heuristic and is weaker than known results.
* Server use as described in the result (rhrun units, none left running) was not re-audited on the box.

## Requirement flags (set by the referee)

* R1 = false. No mechanism is established in which multiplicativity is essential. Stronger: the referee control
  shows the measured component does not need multiplicativity of the weight.
* R2 = false. No height-uniform or every-window statement.
* R3 = false. One control (THIN) is examined; the step at which it fails is not decided (E1), and no other control
  is run.
* R4 = false. No passage to the critical line.

## Surviving claim

MEASURED (float64, complete enumeration; Z <= 2^21 compact test, Z <= 2^18.5 Gaussian test; reproduced at
Z = 1024 and at four non-grid scales): for S = {2, lambda}, rows 0 < N(m) <= Z of the completed cubic theta row
(5.30),

1. weight 1 has mean square equal to the diagonal within about 1 percent (exponent 1.001);
2. the Liouville-weighted rows have an off-diagonal excess E_liou(Z) that grows faster than Z (17 percent of the
   diagonal at Z = 3000, 77 percent at 2^21; exponent of E_liou/M_liou^2 between 0.13 and 0.20 depending on test and
   window, staircase, compatible with 1/6);
3. for every sign weight w tried, multiplicative or not (16 weights), the off-diagonal cross moment with the
   Liouville rows is (1.0 to 1.16) (M_w/M_liou) E_liou, M_w the Mertens-type sum of w: the rows carry a common
   component whose amplitude is linear in w;
4. for the thin weights this component is below 2 percent of the mean square in the range, and the raw exponent of
   MS_eps/MS_one (0.0005 +- 0.0003 at b = 0.95) cannot discriminate.

HEURISTIC consequence: if law 3 and the growth in 2 persist, Bessel's inequality gives MS_eps >> Z^(2b - 5/6 - o(1)),
so the row bound (5.36) would be false for eps with b > 11/12 at Z of order 10^30 or more. This is an extrapolation.
It would show that the manuscript's proof of the low estimate is unavailable for eps in its conclusion and not only
in its hypothesis; it does not decide which of the low estimate and the high comparison for the probe I_eps is
false. That requires the probe (6.1) itself (the lane's follow-up 1).

## Required changes to RESULT.md

1. Verdict and section 4: replace "the half that fails is the low estimate" by "measured evidence, by
   extrapolation, that the row bound (5.36) fails for eps; which half of Proposition D fails for I_eps is still
   open" (E1).
2. Remove the H_high / H_low decision language and the ">200 se" exclusion, or state that r is a linear functional
   that cannot separate the halves (E2); state that the Ecoh exponents are derived from 2b - 1 and the Liouville
   kappa exponent (E3).
3. Replace "non-multiplicative controls have no component" and the R1 / R3 remarks by the linear statement, and
   add a non-multiplicative control with large M_w (section C above) (finding 1).
4. Quote the kappa exponent as a range (E4); note the correlation of scales (E5).
