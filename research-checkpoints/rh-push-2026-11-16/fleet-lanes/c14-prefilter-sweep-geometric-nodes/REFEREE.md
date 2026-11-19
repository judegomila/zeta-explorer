# REFEREE (second pass by the lane author; not independent)

Lane `c14-prefilter-sweep-geometric-nodes`, 2026-11-19. This file is the author's second pass with separate checks.
No independent referee has read RESULT.md. Under METRIC.md the lane is unrefereed (`refereeHolds: null`).

## 1. Lemma F and its instances

- Lemma F: one-line proof; holds. It is Lemma P of round 13 with the map set T left free.
- Q-B, B2: abs(Theta_a) < 1 in Re z > 0 for Re a > 0: abs(z - a) < abs(z + conj a) there. Holds.
- Q-B, B3: the kernel identity was expanded by hand and checked numerically (`checks.json`,
  `B1_identity_max_defect` = 0 at 80 digits, 200 point pairs). Positive semidefiniteness of the first term is the
  Pick property of an inner function (CLASSICAL); the second term is D P D* with D = diag(Theta(z_i)). Holds.
  Pick matrices of order 10 (6 node sets): min/max eigenvalue 2.4e-9 to 1.4e-6 for M, 2.5e-9 to 1.8e-6 for
  M Theta, -3.16 to -0.019 for M/Theta. The positive ratios are small because Pick matrices are ill conditioned;
  at 80 digits they are far above the rounding level, and the sign for M/Theta is not marginal.
- Q-B, B4: not re-derived. Quoted from `c13-kacmoody-eisenstein-affine-weyl-shift` Theorem C (one independent
  referee pass on file, row D9; rank one; single real factors excluded).
- T-NR as a Blaschke factor: D(z)/D(z+1) has modulus 1 on Re z = 0 (defect 1e-81) and sampled modulus at most
  0.993 on 400 points of Re z > 0 per parameter set. Sampled, not proved here; the product representation is
  quoted from row D9. abs(D) at the predicted zero 1/2 + b + i pi/log q: 1e-81 (the object has the zero).
- Pole-type exclusion 2.2 (a): for m(w) = q^w + q^-w + c and a = b/2 the ratio m(w - a)/m(w + a) has modulus
  1.3e5 to 2.0e5 at distance 1e-6 from w = b - a + i pi/log q, in Re w > 0. The Schur condition fails for T-NR on
  the bridge carrier, as recorded (G21, row G20). Holds.
- Q-S: the check `S1_symmetric_multiplier_defect` = 0 only confirms G(s) = G(1 - s) for the test multiplier; it is
  not a check of Lemma M, which is quoted. The abscissa 1/2 + b of 1/G is computed from the closed form
  (0.824, 0.754, 0.904).

## 2. Sweep: second reading

(a) Keyword cross-check (`build_sweep.py`, five rules). 10 flags in the first build:
- nodes 50, 226, 272 ("log-level object named, no X1 step typed"): identities that define the Weil form; typed
  S1 because the node asserts the identity and not the sign of the form. Kept.
- node 104 (finite-support Euler detector): the detector of node 292 with a unimodular local parameter at
  p = 2 (X1 size); first typed PASS. Changed to silent, class Z. Counts moved 135/69 to 134/70.
- nodes 149, 259 (Pick detection tools): implications valid for every quotient; kept as S1.
- nodes 98, 204, 232 ("RH-equivalence in the text but not formulable"): a function-field statement, an audit
  note, a need statement. Kept.
- node 206: a proved statement filed as measured-phenomenon. Kept.

(b) Random re-read of 36 nodes (seed 1415; indices 52, 54, 82, 95, 113, 121, 122, 127, 131, 164, 178, 197, 209,
216, 235, 272, 275, 278, 286, 293, 297, 309, 325, 326, 330, 335, 341, 348, 379, 390, 397, 400, 405, 425, 435,
442). Outcome: 33 unchanged on re-reading. 3 boundary cases:
- 131 (Hagedorn law) and 397 (polynomial heat flow as graph Laplacian): PASS (S1) against not formulable; node 69
  (the same flow at finite N) was typed not formulable. The convention is not applied uniformly at this boundary.
- 178 (zero-free region implies a Lambda bound): typed silent t because its hypothesis is a zero-free region; as a
  theorem valid for the whole class it could be typed PASS (S1).
No re-read case moves a node into or out of the proposal list of section 5. Estimated rate of boundary
disagreements between PASS and not formulable: 2 of 36; between silent and PASS: 1 of 36.

(c) Proposal list. The two starred candidates of the first reading were checked against the record and removed:
node 84 (Euler-anchored heat certificate) has lane `e1-euler-anchor-heat-certificate` (precise obstruction: the
test fails for every fixed c); node 342 ((star_min)) is the wall named in `support-rigidity` and
`twist-rigidity` (rows P23, P24). Nodes 142 and 157 have no row or outcome under the search strings "phase
transport", "positive core minus", "Lemma W", "wide-support"; a row closing them under another name is possible.

## 3. Control check

- 22 recorded cells, 0 disagreements, by `build_sweep.py`. The step typings of devices 1 to 37 are copied from
  the round-13 table, so this part is a consistency check. Count 13 against 14: device 20 has a generic record
  ("every Dirichlet-series control passes"), not a record by name.
- Rows typed here: 38 (Bost-Connes, S2a: D >= 1 in the centraliser; record row D8 (v)), 40 (X_0(4): linear forms;
  record row G33; the twin has c < -2 and zeros outside the closed strip), 41 (row D9), 42 (row G34). In rows 41
  and 42 the record itself is the source of the Q-B and Q-S lemmas, so agreement there is by construction; the
  content of the check is that Q-B and Q-S give no yes on any of the 8 recorded failures.
- Device 39 (depth-aspect transfer) has no T-NR record and is not in the check.

## 4. Statements narrowed in this pass

1. "The bridge family falls on one side or the other" (verdict item 5) is a statement about R_a as a function of
   a: for a >= 1/2 no pole in Re w > 0 from zeros in the strip; for a < 1/2 an off-line zero with real part
   above a gives a pole. It says nothing about forms that mix several a or integrate over a (node 439 records a
   negative layer with a positive integrated direction).
2. "No silent node displays an inequality that is not the target, a certificate, or closed" depends on the map
   rows cited in section 3.3; the rows were checked to exist with the stated subject (P10, P18, P19, P24, G5, G8,
   G10, G22, G25, L1, L4, D4), not re-derived.
3. Section 6 quotes the behaviour of DH, backward heat and E_a from node texts; none was run.

## 5. Flags

R1 false, R2 false, R3 false, R4 false. Not about zeros. Verdict of this pass: the lemma holds; the sweep is a
reading with the stated uncertainty; the control check is consistent with the record.

---

# REFEREE (independent pass, lens: general), 2026-11-19

Independent of the author's pass above. Read: RESULT.md in full, checks.py/checks.json, sweep.json, dump.txt (all
22 silent nodes of classes K, Z, L; a fresh random sample of 18 PASS and 12 not-formulable nodes, seed 77031; the
four nodes 22, 219, 386, 30), the round-13 source lane for Lemma P and its device table, map rows D8, D9, G20, G21,
G33, G34. One numeric run of my own (`/tmp/ref_c14_general/chk.py`, mpmath at 60 digits through
`scripts/memcap.sh 8`, under 50 MB; different functions, parameters and seed from checks.py). Server not used.

**Outcome: does not hold as written, because one sentence labelled PROVED is false (E1). Everything else labelled
PROVED was re-derived and is confirmed. The defect is local; the corrected statement is on file in the graph
(nodes 386, 358). No statement about zeros of zeta is made; nothing assumes RH; no verified-height restatement.**

## A. Steps re-derived

- Lemma F: confirmed (one line; tau(O_zeta) satisfies all H_i and violates C). It is Lemma P with T left free.
- B1: Theta_a(z) Theta_a(-z) = 1, reality, modulus 1 on Re z = 0 (abs(it - a) = abs(it + conj a)): confirmed.
- B2: abs(Theta_a) < 1 in Re z > 0; H-infinity and causality are kept by a bounded analytic multiplier: confirmed.
- B3: the kernel identity expands correctly; both terms are positive semidefinite. Confirmed. (B3 is B2 restated:
  Pick positivity of all orders is the Schur property.) Rerun: identity defect 1.6e-61 on 300 pairs with a
  two-pair Theta (a = 1.7 + 0.4i, 0.05 + 9.3i) and M = (4/5)(z-1)/(z+1) D(z)/D(z+1), p = 5, c = 2.3. Pick order 8,
  5 node sets: min/max eigenvalue 3.8e-5 to 1.3e-3 for M, 3.8e-5 to 1.6e-3 for M Theta; for M/Theta negative in
  4 sets (-1.3e-4 to -0.49) and positive (3.4e-4) in 1. A finite Pick matrix on a given node set need not detect
  the pole; "negative" in RESULT 2.1 is a statement about the author's 6 sets, not a rule.
- T-NR factor D(z)/D(z+1): RESULT labels its Schur property MEASURED. It is provable in two lines: zeros of
  D(z+1) lie on Re z = -1/2 +- b < 0, D(it) = conj D(1+it), the quotient is periodic in Im z and tends to 1/p as
  Re z -> infinity, so the maximum principle on a period strip gives abs <= 1. Rerun (p = 5, c = 2.3, b = 0.3362):
  grid supremum 0.9715 over a full period, axis defect 0. Note: this factor is an infinite inner function, not a
  finite product of pairs, so it is outside the set T as Q-B defines it; B1 to B3 hold for any inner multiplier,
  B4 (Theorem C) is quoted for finite products only.
- Q-S (iii): 1/G = x/(1 + c x + x^2), x = p^(-(w-1/2)), converges absolutely iff Re w > 1/2 + b. Confirmed, and
  rerun for a negative weight (p = 5, c = -2.4, b = 0.3867): absolute sum 43.78 (stable in N) at 1/2 + b + 0.02,
  divergent (2.7e4, 1.7e7, 6.6e12 at N = 200, 400, 800) at 1/2 + b - 0.02; G vanishes at the real point 1/2 + b.
- Bridge ratio, a >= 1/2: RESULT asserts "Schur unconditionally" without a proof. Proof supplied here. For an
  even real X of the class with zeros abs(Re lambda) < 1/2, group the zeros lambda = beta + i gamma and
  -conj(lambda). With w = u + it, u > 0, d = t - gamma, the squared modulus of the paired factor of
  X(w-a)/X(w+a) is ((u-a-beta)^2 + d^2)((u-a+beta)^2 + d^2) / (((u+a-beta)^2 + d^2)((u+a+beta)^2 + d^2)).
  Numerator minus denominator, term by term: the d^4 terms cancel; the d^2 terms give -8ua d^2; the constant
  terms give ((u-a)^2 - beta^2)^2 - ((u+a)^2 - beta^2)^2 = -4ua (2u^2 + 2a^2 - 2beta^2) < 0 when
  abs(beta) <= a. So every paired factor has modulus < 1 in Re w > 0 whenever abs(beta) <= a; in particular for
  all a >= 1/2. Rerun on a finite even real X with off-line quadruples (beta = 0.35, 0, 0.45): supremum 0.99996
  (a = 0.5), 0.99994 (a = 0.8), 0.99997 (a = 0.45); 212 at a = 0.25 (pole).

## B. Errors and corrections

- **E1 (false as written; labelled PROVED; verdict item 5, section 2.2 row Q-B (a), and "none sits between").**
  "For a < 1/2 an off-line zero is a pole and the Schur condition is the zero-free statement itself." Two
  defects. (i) Only zeros with Re lambda > a give a pole in Re w > 0 (the author's pass narrowed this). (ii) The
  pole at lambda - a is cancelled when X has a zero at lambda - 2a, so the Schur property at a fixed a < 1/2 does
  not imply the strip abs(Re lambda) <= a. Counter-example run here: a = 1/4, X with zeros at
  +-0.35 +- 3i and +-0.15 +- 3i (0.15 = 1/2 - 0.35): R_a has modulus 1 on the axis (defect 7.8e-62) and
  supremum 0.99999 on the grid in Re w > 0, with zeros at displacement 0.35 > a. The correct statement is the
  one already in the graph: node 386 ("Schur iff m(lambda) <= m(lambda - 2a) for every zero with
  Re lambda > a") and node 358 ("cancellation-aware"). Corrected item 5: abs(Re lambda) <= a for all zeros
  implies R_a Schur (proved in A); the converse holds only up to the cancellation condition of node 386; the
  family over a -> 0+ is RH. The typing "target-level (X3)" of the pole-type nodes is not changed by this,
  since T-NR's added zeros are not in a cancelling configuration unless a = b.
- **E2 (not new).** Section 1 lists "the a >= 1/2 against a < 1/2 reading of the bridge ratio" as new. Node 386
  already states "a >= 1/2 holds unconditionally; B(w) = xi(w)/xi(w+1) is inner". Lemma B in Schur, Pick and
  H-infinity form is the textbook closure of the Schur class under inner multipliers; section 6 marks it "(new)".
  It is new to the record as a typed filter question, not as mathematics. Row D9 already records T-NR as the
  factor D(z)/D(z+1).
- **E3 (control check overstated).** "22 recorded T-NR cells" covers 18 device rows: 17 cells of the 14 round-13
  device types (typings copied, so a consistency check) and 5 cells typed here. Of the "3 recorded passes resolved
  by Q-B/Q-S", two (rows 41, 42) are the lanes from which Q-B and Q-S were extracted, so agreement is by
  construction; the third (row 40, X_0(4) twin, c = -(p^(3/2) + p^(1/2))) does not meet Q-S as defined: its
  1/G converges absolutely only in Re w > 2.24 (p = 3), not in Re w > 1, and Lemma F (iii) fails for it (zeros
  outside the closed strip). The independent content of the control check is: no recorded failure (9 cells in the
  table of section 4, not 8) receives a yes from Q-B or Q-S. That part I confirm from the table.
- **E4 (one typing not supported).** Node 30 (prime LC cascade, S21 proportional to zeta(2s)/zeta(s)), the only
  node passed by Q-S alone, has steps S1, S3, X2. The identity uses the exact local sections at every prime; it
  is not of the form (F*(s)/F*(w)) A(w, s) with A independent of the target, and F -> F G does not keep it. Under
  the lane's own rule it is silent (class Z) or an identity for zeta only. Counts would read PASS 133, silent 71,
  Q-S yes 12.
- **E5 (PASS against silent-t depends on phrasing).** 18 of the 134 PASS nodes contain an RH-equivalence in the
  statement (17, 26, 50, 105, 109, 130, 169, 171, 182, 235, 256, 268, 279, 324, 325, 373, 386, 396) and are
  typed S1 because the node asserts the equivalence; nodes that display the same positivity as a target are
  typed silent t. This follows the stated reading rule, but it means the split 134/70 measures how nodes are
  worded as much as what a control passes. 120 of 134 PASS verdicts are "S1 only". "Passed by a control" means
  "predicted to pass under the typing"; no control was run on any node.
- **E6 (minor).** Node 375 (definition of V_{a,Phi}) is typed PASS S1 while definitions elsewhere are typed not
  formulable; same boundary the author reports. The author's pass says "8 recorded failures"; the table has 9.

## C. Checks of the remaining claims

- Counts 134/70/239, class split 30/18/10/7/5, 402 declared plus 41 inferred, by-tag table: reproduce from
  sweep.json.
- "No silent node displays an inequality that is not the target, a certificate, or closed on file": I read the
  22 silent nodes of classes K, Z, L. Each cites its closing row or lane in its own text except 142 and 157,
  which RESULT proposes. I did not re-derive the closing rows. For class t and c (48 nodes) I relied on the table.
  Confirmed as a reading, with E4 adding node 30 to class Z (its text already says zeta zeros are poles of S21
  and the cascade is valid right of 1; row G10).
- Controls: no zeta-only mechanism is claimed, so there was no control to run against one. DH, backward heat,
  E_a, sign twists, unimodular twist, Beurling, phase-rotated transfer operator, theta^w: not run by the lane,
  as it says.
- RH assumed: no. Verified height restated: no. Known theorem presented as new: E2.

## D. Requirement flags (set by this referee)

R1 false (no argument about zeta). R2 false (no statement at height). R3 false (the lane shows controls passing;
no node where every control is shown to fail). R4 false (nothing crosses to the line).

## E. Surviving claim

No statement about zeros of zeta. Lemma F with instances Q-P (quoted), Q-B (B1 to B3 confirmed; classical in
content; B4 quoted) and Q-S (quoted; abscissa confirmed) holds as a sufficient test for "a control passes".
Sweep of 443 nodes by one reader: about 133 predicted PASS, 71 silent, 239 not formulable, with the PASS/silent-t
and PASS/not-formulable boundaries set by convention. Control check: no recorded failure gets a yes from any
question; the three "resolved" passes carry no independent weight. Bridge ratio: abs(Re lambda) <= a for all
zeros implies R_a Schur on Re w > 0 (proved above), hence Schur for every a >= 1/2 and Blaschke-closed there; for
a < 1/2 the Schur property is the cancellation-aware condition of node 386, not the zero-free strip statement.
