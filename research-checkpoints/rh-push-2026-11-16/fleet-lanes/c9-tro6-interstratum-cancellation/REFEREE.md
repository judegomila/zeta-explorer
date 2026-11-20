# REFEREE (lens: general) for c9-tro6-interstratum-cancellation/RESULT.md

2026-11-18. Adversarial review. Scratch scripts were run from /tmp/c9ref (not kept in the lane; described below so
they can be rewritten in minutes). Local runs through `scripts/memcap.sh 8`; no server use.

**Outcome: holds, with four corrections. The verdict "precise obstruction" survives in a narrower form (see
"Surviving claim"). Flags: R1 = R2 = R3 = R4 = false, as claimed.**

## 1. Proved steps, re-derived

**Lemma I: confirmed.** m is in the stratum of kappa iff kappa | m and x = m/kappa is squarefree and prime to
kappa. 1[x squarefree] = sum_{d^2 | x} mu(d); 1[(x, kappa) = 1] = sum_{e | (x, rad kappa)} mu(e); the two
divisibility conditions combine to lcm(d^2, e) | x. Summing r(m) gives the statement. Checked by hand:

* B_{p^2}: for p | d the terms e = 1 and e = p have the same index p^2 d^2 and opposite sign, so they cancel; for
  p not dividing d the index is p^2 d^2 and p^3 d^2. The stated reduced formula is correct.
* Every index is squarefull (e divides rad kappa, so it adds no new prime).
* Sign table: all nine entries re-derived; column sums are 0 for Phi(p^2), Phi(p^3), Phi(p^2 q^2), as the net
  coefficient statement requires.
* c(j) <= 4^omega(j): for j = p^a the triples are (p^a,1,1), (p^(a-1),1,p), (p^(a-2),p,1), (p^(a-2),p,p); at most 4,
  and c is multiplicative. Equality occurs (a >= 4).

Independent exact check, different case (own Z[omega] arithmetic and factorisation, no lane code; complex random
r(m); two sizes, neither the lane's 7,172):

| Q | rows | strata | terms | mismatches | net coefficient | max c(j)/4^omega(j) | Prop. E inequality |
|---|---|---|---|---|---|---|---|
| 20,000 | 6,045 | 55 | 139 | 0 | 1 at j = 1, 0 elsewhere | 1.0 | 172,646 <= 278,616 |
| 3,001 | 910 | 21 | 47 | 0 | same | 1.0 | 23,776 <= 43,948 |

The reduced B_{p^2} formula (N p = 7) also holds exactly in both runs.

**Bilinear form |B|^2 = D + I: confirmed** (it is the expansion of a square). The remark on pairs kappa, kappa t^6
is labelled ARGUED / CITED and is not used anywhere; no objection.

**Proposition E: the inequality and the contrapositive are confirmed; the "Reading" overstates it (error E1).**
Triangle inequality in Lemma I gives sum |B_kappa| <= sum c(j) |Phi(j)|. sum_j c(j) N(j)^(-a) converges for a > 1/2
(squarefull j, c(j) << N(j)^eps). Contrapositive: from |Phi(1)| <= Q^(-delta) sum |B_kappa| and c(1) = 1,
sum_{j != 1} c(j) |Phi(j)| >= (Q^delta - 1) |Phi(1)|; if every j != 1 had N(j)^(1/2+eps) |Phi(j)| < c Q^delta |Phi(1)|
the left side would be below c C(1/2+eps) Q^delta |Phi(1)|. This works with c(eps) = 1/(2 C(1/2+eps)) once
Q^delta >= 2; that proviso is missing but harmless.

## 2. Errors

**E1 (overstatement of a proved step).** Section 2, Reading: "An inter-stratum saving therefore exists iff the
total at level 1 is smaller by a power than its own bounded-level copies." Proposition E proves one direction
only (saving implies a sublattice anomaly). The converse is not proved and is not a consequence of Lemma I: Phi(j)
is not a sum of whole strata. Also "bounded-level" is not established: the j supplied by the pigeonhole step can
have norm up to Q. Correct wording: "a saving requires some squarefull j != 1, of any norm up to Q, with
N(j)^(1/2+eps) |Phi(j)| >= c Q^delta |Phi(1)|". The same overstatement is in verdict item (ii) ("bounded-level copies").

**E2 (wrong number and wrong qualifier in a step labelled PROVED).** Section 4.2: "r2 >= 0.75 sqrt(0.94) = 0.73 at
every point ... whatever the signs. [PROVED from the measured shares]".
* The worst point (X = 1e7, Q = 13,801: share 0.9398, rest ratio 0.2526) gives (1 - 0.2526) sqrt(0.9398) = 0.7246.
  The bound is 0.72, not 0.73. (1e6 minimum: 0.731.)
* "Whatever the signs" is false. The column "rest / squarefree (l2)" is the norm of the signed sum of the
  non-squarefree strata (`rest = B[1:].sum(0)` in `istrat_ana.py`), so it already contains the signs among those
  strata. It is not determined by the 94 to 97% share. A bound that is free of the signs must use
  sum_{kappa != 1} ||B_kappa|| (an l1 sum of stratum norms), which is larger than 0.25 ||B_1|| and is not
  reported. The campaign summary sentence "squarefree stratum holds 94-97% of the energy, so the ratio is at
  least 0.73" repeats the wrong inference.
* The bound adds nothing: it is derived from the same measured array that gives r2 = 0.98 to 1.01 directly.
  Label should be MEASURED.

**E3 (the 94 to 97% share is a row count, not an arithmetic fact about theta coefficients).** Recomputed: the
fraction of rows that are squarefree is 0.930 to 0.945 along both paths (0.9337 of all 11,230 rows at 1e7), and
the mean |rho-hat|^2 of squarefree rows over non-squarefree rows is 1.09 (1e7) and 1.15 (1e6). The energy share of
the squarefree stratum is the row-count share times that factor. With random-phase rows I get the same shares
(0.945 to 0.968). The share therefore carries no information on the size of sextic theta coefficients at
non-squarefree arguments, and cannot be used as evidence that an inter-stratum saving is impossible for the true
coefficients. RESULT.md does not say this.

**E4 (scope of the measured claim).** The estimator halves correlate at 0.14 / 0.23 (confirmed, and the same on
squarefree and non-squarefree rows: 0.146 / 0.116 at 1e6, 0.226 / 0.228 at 1e7). So about 85% / 77% of the
amplitude of rho-hat is not common to the two halves. r2 and r1 are statistics of the finite trilinear form, in
which the rows behave like random-phase rows by every test made; they are not a measurement on theta
coefficients. RESULT.md says this in weak step 1, but the verdict line, section 7 and the campaign claim state
"no inter-stratum saving" without the qualifier. The only statistic aimed at the common part is x2, and there the
1e6 exponent is -0.045 (se 0.034), below the pre-registered threshold in value; "no saving" for x2 rests on the
single 1e7 fit (-0.005, se 0.007). In addition the estimator sums only squarefree moduli n prime to m; for
non-squarefree m the moduli sharing a prime with m are omitted, so the normalisation of rho-hat differs between
strata by a local factor that is not computed. This affects any comparison of strata and is not checked.

**E5 (power of the pre-registered criterion; not an error of arithmetic).** The positive control (polar-aligned
weights: every stratum coherent, correlation +0.87 between rest and squarefree) moves the r2 exponent by +0.012
to +0.015 only. The threshold is 0.02 in the other direction. A fully coherent cancellation of the same strength
as the positive control would not have met the criterion. Given r2 >= 0.72, the most negative exponent attainable
on the 1e7 fit range (Q = 708 ... 37,150) is ln(0.72)/ln(52.5) = -0.083, and it cannot persist as Q grows. So the
test could detect only a large transient effect; its null outcome is weak evidence. The stronger basis for the
obstruction is Lemma I + Proposition E, which need no data.

Minor: the server note says "of 150" for rh.slice; the brief's current figure is 80 GB. THIN is not thin at these
sizes (stated in RESULT.md). The date "2026-11-18/19" refers to UTC unit names.

## 3. Numeric check rerun, different cases

Own script on the lane's `data/acc_1e6.npz` and `data/acc_1e7.npz`: own stratification (own Z[omega] division, no
`istrat_ana.py`, no table file), new seeds, and cases the lane did not run.

Reproduction of the headline, to the printed digits: r2 exponent -0.0047 (1e6), +0.0009 (1e7); r1 exponent
-0.1039, -0.0979; r2 values along both paths identical to 3 decimals; strata 31 / 70; rows 2,166 / 11,230.

New cases (exponent of r2 in Q, fit Q >= 600 / fit Q >= 1,500):

| case | 1e6 | 1e7 |
|---|---|---|
| theta estimator, same geometry | -0.0047 / -0.0071 | +0.0009 / +0.0022 |
| theta estimator, conductor octave shifted +1 against the row cutoff | -0.0022 / -0.0057 | +0.0016 / +0.0033 |
| theta estimator, conductor octave shifted -1 | -0.0035 / -0.0130 | +0.0010 / +0.0071 |
| complex-conjugated rows (wrong pairing; new control) | +0.0016 / +0.0094 | +0.0002 / +0.0019 |
| random-phase rows, new seed | +0.0012 / -0.0052 | +0.0014 / -0.0002 |
| random-phase rows, octave +1 | +0.0033 / +0.0032 | -0.0002 / +0.0001 |
| cubic rows | -0.0088 / +0.0091 | -0.0018 / +0.0016 |
| polar-aligned weights | +0.0150 / +0.0131 | +0.0121 / +0.0074 |

Direct statistic ||B|| / ||B_1|| (does adding the non-squarefree strata shrink the total): theta 1.000 to 1.032 at
1e7 (exponent +0.0034), random-phase 1.008 to 1.037 (+0.0039); the value expected for uncorrelated strata is
1/sqrt(share) = 1.028. No point is below 1.

Per-cell statistic (weak step 2): the minimum over the 1,296 cells of |B^f| / sqrt(D^f) is 0.00 to 0.23 for the
theta rows and 0.01 to 0.19 for random-phase rows; the 1% quantile has no stable trend in either. No cell
separates the theta rows from the controls.

Constant offset of 4.2: confirmed in size (theta mean r2 0.992 at 1e7; 0.993 with octave +1; 0.992 with octave
-1; conjugated rows 0.9995; random-phase 0.9996). It is present at all three geometries and absent for
conjugated rows, so it is tied to the correct pairing of rows and conductors. It has no trend in Q. It remains
unexplained, as stated.

Conclusion of the rerun: the measured numbers are correct and stable under change of geometry, seed and fit
window. No case gives an r2 exponent near -0.02 at 1e7.

## 4. Controls, RH, verified height, novelty

* No zeta-only mechanism is claimed, so there is no control to fail. I added one control (conjugated rows); it
  behaves like the other row controls in exponent.
* Nothing assumes RH. Nothing restates verified height. No statement about zeros.
* Lemma I is Moebius inclusion-exclusion over the squarefull part and Proposition E is the triangle inequality
  with a convergent squarefull sum; both are elementary and are used only as the reason for an obstruction, not
  presented as new theorems. The Kazhdan-Patterson periodicity is cited and labelled unchecked.
* 7/8 and 0.874886647 are stated as unchanged and resting on unrefereed manuscripts. Correct.

## 5. Requirement flags (set by the referee)

| flag | value | reason |
|---|---|---|
| R1 | false | Lemma I and Proposition E hold for arbitrary r(m); the data do not separate theta rows from non-multiplicative rows |
| R2 | false | finite family mean square at Q <= 37,150; no height statement |
| R3 | false | control-blind by construction; every row control gives the same exponent |
| R4 | false | nothing reaches the critical line or moves an abscissa |

## 6. Surviving claim

PROVED: Lemma I (each squarefull stratum is a signed sum, signs mu(d) mu(e), of sublattice sums Phi(j) with j
squarefull) and the one-directional Proposition E (a power saving of |B| against sum_kappa |B_kappa| requires a
squarefull j != 1, of norm up to Q, with N(j)^(1/2+eps) |Phi(j)| >= c Q^delta |Phi(1)|). MEASURED, for the finite
trilinear estimator (whose rows are 77 to 85% not common to its two halves) in the class-cell mean square at
X = 1e6 and 1e7: the ratio of the signed sum over strata to the root sum of squares has exponent -0.005 / +0.001
in Q, equal to random-phase, conjugated, Liouville, THIN, random multiplicative and cubic rows within the null
scatter 0.003, and stable under a shift of the conductor octave; r2 >= 0.72 at every point from the measured
arrays. Not established: the converse of Proposition E; any statement for true sextic theta coefficients or for a
single target; that the squarefree energy share reflects anything but the 93% row count. The proposal to close
lead 17 for the squarefull stratification is supported by the two proved statements; the data add little weight
(E5). No eta, no abscissa, nothing about zeros.
