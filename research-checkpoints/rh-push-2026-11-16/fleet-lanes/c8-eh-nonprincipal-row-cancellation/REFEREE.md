# REFEREE (adversarial, lens: general) for c8-eh-nonprincipal-row-cancellation

Date 2026-11-18. Only this file was written. Scratch scripts are in /tmp/ref_c8eh (not in the repo). All runs local
through `scripts/memcap.sh 8`; the compute server was not contacted. The lane's files were read as text; `dual.py`,
`eh_lp.py`, `tiers_fe_theta.py` were imported by my scripts (a `__pycache__` this created in the lane directory was
removed).

## Verdict

**The computations and the identities are confirmed. Two headline sentences do not hold as worded. holds = false
for the claim as stated; a narrowed claim survives (section 5).**

No statement about zeros of zeta is made by the lane; RH is not assumed; no verified-height input; no known theorem
is presented as new (Lemma 1 is declared to be the triangle inequality).

## 1. What was re-derived and confirmed

| step | label in RESULT | referee outcome |
|---|---|---|
| Lemma 1 (a), (b), (c) | PROVED-rel (10.5) | Confirmed. Read against `paper.txt` (10.5): the identity is asserted with absolute convergence of the u-sum, so NP := I - I_1 is defined and (a) to (c) are the triangle inequality. |
| Corollary: (E-H) at E <=> H_eta/L^S holomorphic on Re s > B_E | PROVED-rel Lemma 1, Prop. 2.1, Lemma S | Confirmed as stated in section 2, with its three hypotheses: low estimate at l0 <= E, remainder of row 1 after the two residues below Z^E, Lemma S (1/2 <= B < 1). See error E1 for the headline. |
| Theorem K' identity | PROVED identity | Confirmed by hand: (M+l-1)/2 + (1+l-M)/2 = l; 1 - (1+l-lx)/r + l/2 = 1 - 1/r + lx/r + l(1/2 - 1/r); >= 1 - 1/r needs lx, l >= 0 and r >= 2. Exact rational test at 20,000 random points with r in {2,3,5,6,7,10} (r = 5, 7, 10 not in the lane's run): 0 violations. |
| B(theta) = (5 - 6 theta)/(6 - 6 theta) | PROVED as feasible point + LP | Algebra confirmed. LP rerun at theta = 1/5, 2/5, 1/10, 3/7 (none in the lane's table): 19/24, 13/18, 22/27, 17/24, each CONFIRMED exactly (feasible at the value, infeasible 1e-9 below). |
| 13/15, 31/36, 7/9 independent of theta | LP | Rerun at the same four new theta: CONFIRMED exactly each time. |
| c5 empty branch min(11/12 - theta/2, 13/12 - theta) | LP | Algebra confirmed; rerun at theta = 1/5, 1/3, 2/5, 1/8: 49/60, 3/4, 41/60, 41/48 CONFIRMED exactly, all on row = empty. |
| Copies | | `cap_lp_copy.py` and `tiers_fe_copy.py` are byte-identical to their sources; `tiers_fe_theta.py` differs in the two lines stated. |
| Counts | EXACT | Recomputed from the five jsonl files with my own script: 5620 records, 2644 with reference, 2644 match, 0 mismatch; 551 blocks (404 + 147); 4116 with T1 > 0; 2042 with NP = 0; 2039 of these with J = Princ = Diag = 0; r <= 4 (q = 7), r <= 3 (q = 13); max rows 2800; max frequencies 13,434; parity counts 3343 / 773 / 768 / 767. All as stated. Medians of table 3.3 (iii) reproduced. |

## 2. Independent numeric check with different cases

The lane's totals are compared only with `ffx.c` values of the predecessor, on the predecessor's weights. I wrote a
brute-force evaluation of J = Sum_{deg m = d} c_k(m) R_{N,lam}(m; W) directly from the definitions (Gauss sums
g_6(m, c), g_3(1, A) as sums over residues, Res via the determinant of multiplication on F_q[T]/(c); complex floats;
no Theorem B, no reciprocity, no closed forms) and compared |J|^2 with the exact integer J2 from `dual.py` on two
weights that neither the lane nor `ffx.c` used: x1 = random +-1 with a new hash seed, x2 = random integers in
{-2, ..., 3} (not unimodular, not multiplicative).

| q | k | N | lam | d | r | parity | x1: brute / dual | x2: brute / dual |
|---|---|---|---|---|---|---|---|---|
| 7 | 2 | 2 | 0 | 2 | 1 | even | 10169108964.000006 / 10169108964 | 32427005625.00003 / 32427005625 |
| 7 | 2 | 1 | 1 | 2 | 1 | even (marked) | 5188320900.000004 / 5188320900 | 420253992900.0003 / 420253992900 |
| 7 | 3 | 2 | 0 | 2 | 2 | odd | 0.000000 / 0 | 0.000000 / 0 |
| 7 | 2 | 2 | 0 | 1 | 2 | even | 368947264.000000 / 368947264 | 282475249.000000 / 282475249 |
| 7 | 1 | 2 | 0 | 1 | 1 | odd | 0.000000 / 0 | 0.000000 / 0 |
| 7 | 3 | 3 | 0 | 3 | 2 | even | 75794888712676.09 / 75794888712676 | 291013063401025.25 / 291013063401025 |
| 13 | 2 | 2 | 0 | 2 | 1 | even | 9514683129744.002 / 9514683129744 | 94298471347599.97 / 94298471347600 |

14 of 14 agree to float precision. The general-W form of Theorem B (totals) is confirmed on an independent code
path, including a marked block and a non-unimodular weight. As the lane states, this checks the sum over rows, not
the assignment of terms to rows; the per-row quantities (T1, U, theta) rest on the lane's definition of a row.

## 3. Errors and overstatements

**E1 (headline; does not hold as worded). "(E-H) is not an independent input ... it is the conclusion restated ...
circularity."** What Lemma 1 and the corollary establish is: given the low estimate (and the bound for the remainder
of row 1), (E-H) at level E is necessary and sufficient for the Prop. 2.1 output at B_E. Sufficiency is Prop. 2.1
itself. Necessity is the triangle inequality. This is a property of every high hypothesis of Prop. 2.1, including
the one the manuscript proves: the manuscript's own (2.5) (termwise H0 bound, proved under the supposition
beta* > sigma_0) satisfies the same equivalence, and it is the non-circular input of the 7/8 argument. So
"equivalent to its conclusion given the other hypothesis" does not show that a hypothesis is not an independent
input, and it is not an obstruction to proving (E-H) by an argument on the rows. "Circularity" should read
"necessity". The correct content is: (E-H) cannot be true at a level below the true abscissa of the target, and
its truth is decided by L(s, eta) alone, not by the row family. Whether it can be proved from the rows is untouched
(the lane concedes this in weakest step 1; section 0 and the proposed map row do not).

**E2 (headline omits a hypothesis).** Section 0 item 1, the claim line and the proposed row Z15d state the
equivalence "given the low estimate". The corollary also needs the remainder of row 1 (after the residues at
w = 1, z = 1/6) to be below Z^E; this is labelled MODEL in section 8 and is not derived. That remainder contains
1/L^S(s, eta) and is bounded in the manuscript only relative to beta*, the same kind of input as the rows u != 1.
The exact unconditional statement is for the manuscript's actual (2.5): given e(J) <= E, e(J - f) <= E <=> e(f) <= E
<=> (Lemma S) holomorphy on Re s > B_E. For NP alone the equivalence is conditional on the remainder.

**E3 ("control-blind" is stronger than the data).** Established: cancellation over rows (theta > 0) occurs for
every weight tested. Not established: that the targets and the controls have the same cancellation exponent.
(a) The pooled medians of table 3.3 (iii) mix odd blocks, where Princ = Diag = 0 and NP = J' (so "cancellation in
NP" is the size of the probe, the low side), with even blocks, the only ones where NP is a different object from
J'. Split by parity (my recomputation, q = 7, d >= N', U >= 20, NP != 0, even blocks, n = 22 each): theta median
0.498 (a), 0.550 (b), 0.514 (lnu), 0.493 (dh) against 0.281 (thin), 0.357 (rm), 0.283 (rma), 0.300 (n1), 0.435 (n2),
0.101 (mu), 0.096 (t). In the ledger region lx < l (even, n = 18): 0.51 to 0.59 for a, b, lnu, dh against 0.28 to
0.46 for thin, rm, rma, n1, n2. NP/RMS median there: 0.68 to 0.92 (a, b, lnu, dh) against 1.85 to 2.09.
(b) Paired with target a in the ledger region (20 geometries, signs of theta_w - theta_a, negative / positive /
zero): thin 13/3/4, n1 12/4/4, rma 11/5/4, rm 10/6/4, n2 10/6/4; b 7/9/4, lnu 6/5/9, dh 7/9/4. Every weight without
an L-function of Weil type leans negative; every weight built linearly from the targets is centred at 0. The effect
is small (paired medians -0.01 to -0.09) and at the edge of significance (sign test for thin about p = 0.02, the
others weaker).
(c) q = 13 (7 to 12 blocks) does not show the separation (n2, rma above a).
So the data neither resolve a difference nor exclude one of size 0.1 to 0.2 in theta; "control-blind" should read
"cancellation present for every weight; a target-specific excess is not resolved at r <= 4". The sentence "it does
not follow the function-field Riemann hypothesis" is not supported in the even blocks at q = 7, where the ordering
of the weights is the ordering by L-function structure.

**E4 (the DH weight is not an off-line control in this model).** dh = nu_a + nu_b has generating polynomial
L_a + L_b = 2(1 + ((a_1 + b_1)/2) u + q u^2) with |(a_1 + b_1)/2| <= 2 sqrt(q): both zeros lie on |u| = q^(-1/2).
In F_q[T] with two degree-2 L-polynomials the Davenport-Heilbronn sum satisfies the model Riemann hypothesis. Its
agreement with the targets (paired 0.000) is linearity of the decomposition, as the lane says, and is not evidence
that a weight with zeros off the line shows the same cancellation. The same applies to lnu (a twist of the target
by mu on squarefree arguments). The weights that lack RH-type structure are thin, rm, rma, n1, n2, and those are
the ones that sit lower (E3).

**E5 (the 2042 exact zeros carry no information about (E-H)).** In 1702 of the 2042 records the random
non-multiplicative weights n1, n2 vanish in the same geometry; my brute-force run shows J = 0 for arbitrary integer
weights in such blocks (k=3, N=2, d=2 and k=1, N=2, d=1 above). There the probe is identically zero as a linear
functional of W (c_k orthogonal to every chi_A on degree d), so "NP = 0 with several hundred non-zero rows" is a
linear relation among the row functionals produced by the grouping into rows. The lane says this in section 9;
the headline ("NP = 0 exactly in 2042 of 4116 records for every weight") presents it as evidence of
control-blindness. It should be reported as "blocks with J identically zero" and excluded from the evidence.

**E6 (scope of Theorem K').** The identity is correct. The cap B >= 1 - 1/r is relative to three inputs that are
not proved here: the signal exponent (S), the K-branch being kept, and the Hilbert-Schmidt floor formula for T_np
(entries unimodular on a proportion about 1 of positions after removing sixth-power frequencies: ARGUED). The
label "PROVED: identity; relative to ..." in section 4 is accurate; "its norm version is capped" in section 0 and
in the R4 row should carry "in the model ledger".

**E7 (minor, wording).** Section 0 item 4 (b) says that with the source ledger (E-H) never binds (13/15 for every
theta). That is true in the `cap_lp` system only. In the c5 system with the same source ledger (E-H) binds for
theta > 1/10 through the empty-dual branch (confirmed: 49/60 at theta = 1/5). Both facts are in section 5; the
summary sentence should name the system. The statement "I is negligible on the empty-dual branch" is imported
from c5 and was not checked by the lane or by me.

**E8 (consequence drawn).** "(E-H) leaves the list of escapes of `c7-probe-format-h-cap` section 4" is not
justified by E1 to E3: item 1 is necessity, not exclusion; item 2 is a pre-asymptotic measurement that does not
resolve the question; item 3 covers the norm treatment only, in the model. What can be recorded is that the
termwise and norm treatments of NP give nothing below 5/6 in the model ledger and that no model evidence of a
target-specific handle was found at r <= 4.

## 4. Requirement flags (set by the referee)

| flag | value | reason |
|---|---|---|
| R1 | false | No argument in which multiplicativity is essential; the decomposition holds for arbitrary W (confirmed on non-multiplicative, non-unimodular weights). |
| R2 | false | No conclusion about zeros; nothing uniform in height. |
| R3 | false | No mechanism that fails for the controls is established. (The converse claim "control-blind" is also not established, E3.) |
| R4 | false | Nothing passes to the critical line; all abscissae are model values >= 7/12 on hypothetical inputs. |

## 5. Surviving claim

Relative to MS (10.5) and Lemma S: NP = I - I_1 exactly; given the low estimate at l0 <= E and the bound Z^E for
the remainder of row 1, a bound Z^E for NP is necessary and sufficient for H_eta/L^S(s, eta) to be holomorphic on
Re s > B_E (unconditionally so for the manuscript's (2.5) quantity J - f). This is necessity of the high hypothesis,
shared by the manuscript's proved (2.5); it is not circularity and does not exclude a proof of (E-H) from the rows.
Model ledger: a norm bound of NP together with the K-branch gives B >= 1 - 1/r + lx/r + l(1/2 - 1/r) (identity
confirmed; floor of the norm ARGUED); with a saving theta on the row count the exact LP values are
(5 - 6 theta)/(6 - 6 theta) in the three-input system, 13/15 and 31/36 (with (E-K)) independent of theta in the
`cap_lp` source ledger, and min(11/12 - theta/2, 13/12 - theta) on the empty-dual branch of the c5 system (all
confirmed at new theta). F_q[T]: the general-weight dual decomposition reproduces the exact |J|^2 (2644 of 2644 in
the lane; 14 of 14 on new weights by independent brute force). Cancellation over rows is present for every weight
at r <= 4; in even blocks at q = 7 the weights a, b, lnu, dh sit at theta about 0.5 and thin, rm, rma, n1, n2 at 0.28
to 0.44, a difference that is not resolved (not replicated at q = 13) and not excluded. The model DH weight
satisfies the model Riemann hypothesis and is not an off-line control. (E-H) stays on the list of open escapes
with the status: termwise and norm treatments closed in the model; target-specific treatment undecided.

## 6. Not checked

Lemma S and Lemma H of `c6-marks-bc-manuscript-check` (taken as refereed); the transcription of the r3 / c5
estimate systems against the sources; the Hilbert-Schmidt floor of T_np; the assignment of individual terms to rows
in `dual.py` (only row sums are verified); the lane's full runs at d >= 4 (not rerun; counts recomputed from its
output files).
