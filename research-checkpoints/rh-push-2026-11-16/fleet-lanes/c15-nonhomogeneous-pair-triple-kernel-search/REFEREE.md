# REFEREE: c15-nonhomogeneous-pair-triple-kernel-search

Second pass by the lane's own agent (no independent agent was available to this lane). It is not an independent
referee; one is owed. Checks below use code paths that do not share the solver (`nsolve.py`) or, where stated, the
float64 kernels. Verdict of this pass: **the outcome "none" holds as worded in RESULT.md section 0, with the scope
lines of items 5 to 9**. Nothing here is a statement about zeros of zeta.

## Checks run

1. **Interval solver against brute force (R1, `ref_check.json`).** 400 random nodes per node group, every pair
   family, tiers PA/all and PA/FE: the feasibility bit from the exact interval logic against a direct scan of the
   midpoints between consecutive object ratios. 11,076 node-tier comparisons on float64-decided nodes, 0
   disagreements (20 feasible nodes among them, all in b2-with, FE tier).
2. **Kernel values against mpmath, 40 digits (R2).** Families a1-with, b1-Aw, b1-Ao, b1-B, b2-with on the pair
   (zeta, chi5.2), the HEAT pair at tau = -0.5 without polar terms and the T-NR pair at the split prime 13 of
   chi7.2, four nodes: 40 values, largest difference 1.9e-15 (absolute or relative).
3. **Phi table (R3).** phi_(1/2) * phi_(3/2)(t) = (1/2) e^(t/2) exp(-2 pi e^t) (Gaussian integral): table exact to
   3.8e-15 on (-15, 1.5); Hermite interpolation at half-steps up to 2.6e-7 relative in the steep right tail. This
   is larger than the 1e-8 noise first registered for the theta-side route; amendment A5 raised it to 1e-6 before
   any product kernel of the record was computed.
4. **Quotient minors (R4, `ref_check2.json`).** 300 functionals of each order recomputed with plain quotients and
   numpy determinants (no equilibration, no noise rule): 600 of 600 have clearly positive and clearly negative
   members among the 529 positives; the smaller side has at least 54 pairs. "0 one-signed on PA" is not an artefact
   of the sign rule.
5. **Paper deletions.** Lemma J1-Q and J1-L re-derived; they need the HEAT lift with the same tau on both members
   and the A side without polar terms, as stated. Measured on 34 HEAT pairs to rounding level. The reflection
   identity needs K(-u) = conj K(u) for both members: it holds for the positives and for the classes of the FE
   tier; for classes without functional equation the value at those nodes is not 0 and such a class can be
   rejected there, but the FE classes cannot, so the node is excluded in every tier that contains an FE class
   (nine, six, FE, canonical). Correct as used.
6. **Run 2 against run 1.** Same nodes and seeds; every registered tier count of the 14 pair families is identical.
7. **Near-miss rows read.** FE tier and canonical tier, b2-with: the held-out failure is on E_a and HEAT (median
   opposite counts 11 and 10 of 24), not on the positives (median 24 of 24). b5l-with canonical: held-out HEAT
   opposite count 0 at every node. PZ tier: held-out positives at most 21 of 24 (c3-T: at most 17).

## Corrections and scope lines

1. **Histogram bin (found in this pass).** In run 1 the count "no lam keeps the positives one-signed" was merged
   into "no class rejected" (initial value 0 instead of -1). Corrected in run 2 and by `onesigned.py`; the table
   of RESULT section 4 does not use the merged bins. T-train, undecided, full and the per-class columns were not
   affected (they are computed from the feasibility masks).
2. **Exactness claim.** "Exhaustive in the third parameter" is exact for the float64 values with their half-widths;
   it is not an interval-arithmetic statement. Entries far from a feasible interval stay float64 in the ball stage.
3. **FE and canonical tiers are not closed.** 60,651 FE-only undecided nodes are unresolved and 85 of 600 sampled
   ones stay undecided at 1024 bits (abs(u) >= 2.09). The canonical tier has 67,138 float64-undecided nodes that
   were not sent to balls. The verdict rests on the nine-class and six-class tiers, where every undecided node was
   resolved. A reader who takes the canonical tier as decisive should read "0 full, 22,508 at T-train, 67,138
   undecided in float64", not "closed".
4. **Product families.** No ball evaluation; the theta-side route is float64 with interpolation. The two-route
   agreement (5.6e-12, 5.1e-11 of max abs C; pointwise up to 9.1e-10 and 6.3e-8 where abs C > 1e-6 of its maximum)
   validates the positives only; for the five classes computed by the theta-side series alone there is no second
   route. The extra tiers of (c) were read from saved arrays with member noise set to 0.
5. **Lifts.** The product kernel of a class without functional equation is a definition of this lane (no n = 0
   term); the ruling of `c15-referee-r14-independent-checkpoint` does not cover it. BLS, theta^w and BEU are
   lane-defined per that ruling; the six-class tier removes them. Requests 2 and 4 of the ruling and its unequal-tau
   HEAT class were not implemented.
6. **Held-out design of kind T is thin**: three held-out cubic conductors, one held-out E_a twist, three positives
   with zeta. With T-train 0 in every tier the held-out rule was never used for kind T under PA.
7. **Lemma C wording.** RESULT uses Lemma C only to delete the function-side reading; per the round-14 referee the
   T-NR statement at a split prime is "the same statement as for zeta plus a common term". Nothing in the result
   depends on it.
8. **Brief.** Log polling at 20 to 60 second intervals inside ssh sessions departs from "poll at intervals of
   minutes"; stated in RESULT section 8. No computation was run outside `rhrun`; no process was killed on the
   server.
9. **Not checked in this pass.** The c13/c14 kernel code copied as text (trusted as refereed there); ball tail
   bounds of `jball.py`; the fixed-point theta^w coefficients beyond the c14 checks at w = 1, 2.

---

# Independent referee pass (adversarial, lens: general), 2026-11-19

Separate agent from the lane author. The author's pass above is kept unchanged. Verdict of this pass: **holds**
(outcome "none", verdict dead, no statement about zeros of zeta), with one count correction and the scope lines
below. Flags set by this referee: R1 = false, R2 = false, R3 = false, R4 = false.

## A. PROVED steps re-derived

1. **Lemma J1-Q.** With the lane's HEAT lift (pointwise multiplier g(u) = e^(tau u^2/4) on the kernel without polar
   terms, the same tau on both members; `jk.HeatX`, `kern.Heat` read as text), R = gK_B / gK_A = K_B / K_A. Correct.
   It is a one-line identity. Scope: equal tau on both members and the A side without polar terms. With unequal
   tau R is multiplied by e^((tau_B - tau_A) u^2/4) and the lemma does not apply (RESULT lists this as NOT-RUN).
2. **Lemma J1-L.** g > 0, so log|gK| = tau u^2/4 + log|K|. Second difference of u^2 with step h is 2h^2, giving the
   shift tau h^2/2; third difference of a quadratic is 0 for the centred stencil of `nf.d3`
   (u -+ h/2, u -+ 3h/2). Correct. L3_B is unchanged under both A-side readings because the B member has no polar
   term. Correct.
3. **Reflection nodes.** K(-u) = conj K(u) gives log|K| even. Then the antisymmetric stencil of `nf.d3` vanishes at
   u = 0 and log|R(u+h)| - log|R(u)| = 0 at u = -h/2. For a threshold family the common value 0 gives every
   FE-class member the sign of -mu, the same as the positives; for b5l both sides are 0 and no lam makes the
   positives one-signed. Correct, in every tier that contains an FE class (nine, six, FE, canonical). In the code
   the evenness is by construction (kernels are evaluated at abs(u) and reflected); the underlying fact is the
   classical theta functional equation and is not checked numerically here.
4. None of these three steps is new mathematics and the result does not present them as new beyond "elementary".
   Nothing assumes RH. Nothing restates verified height. No zeta-only mechanism is claimed, so there is no
   positive mechanism to run controls against; the result is that the controls block.

## B. Numeric checks rerun with different cases (local, `scripts/memcap.sh 8`, `.venv-arb`; scratch scripts in /tmp/c15ref, not kept)

1. **Deletion identities on HEAT pairs not in the lane's check** (tau = -1.7, -0.13, -3.0, -0.9 with chi16.5c,
   chi40.29, chi13.12, chi8.5; seed 990017; 1,000 random nodes per family per pair). Deleted families equal on the
   HEAT pair and its positive pair: a1-without <= 4.0e-16; b4m-without <= 1.2e-13; b6-without <= 1.8e-14;
   b2-without, b5m-without <= 4.6e-13; b2-B <= 4.3e-14. L2 shift equal to tau h^2/2: b1-Ao <= 1.2e-13, b1-B <=
   1.8e-14. Same level as the lane's `identity_check.json`.
   The same run on the with-polar readings, which the lemmas do not cover: a1-with differs by up to 0.21, b4m-with
   0.93, b6-with 0.71, b1-Aw 4.9e-3, b2-with 7.3e-3, b5m-with 7.1e-3. So the blindness is confined to the
   no-polar sub-dictionaries, as RESULT says; the with-polar HEAT zero columns are MEASURED only.
2. **mpmath at 40 digits, different points and character** (HEAT pair tau = -1.7, chi16.5c, four nodes):
   a1-without, b2-without, b2-B from the lane code against an independent series: largest difference 1.7e-15;
   L3 of g K3_zeta minus L3 of K3_zeta in mpmath: <= 3.9e-16.
3. **Quotient minors, different seed (424242), 400 functionals per order, plain numpy determinants, fixed
   threshold 1e-6 after scaling:** order 2: 400 of 400 have both signs among the 529 positives (smallest minority
   70 pairs); order 3: 400 of 400 (smallest minority 27). Agrees with "0 one-signed on PA".
4. **Solver against brute force, different seed (31337), 250 nodes per group, all 14 pair families, tiers nine,
   six, canonical** (the author's check did not cover six and canonical): 10,406 float64-decided comparisons, 0
   disagreements. Nine and six: 0 feasible in all families. Canonical: b2-with 26 of 233 feasible, b5l-with 7 of
   233, consistent with the reported rates 15,784 / 163,377 and 6,724 / 163,377. Float64-undecided in the
   canonical tier in this sample: b1-Aw 30, b3-with 30, b2-with 17, b5l-with 17 of 250.

## C. Arithmetic of the tables

Checked against `tables/totals.json`, `tables/tiers_run2.md`, `out/ball_und.json`, `out2/ball_und_six.json`:
2,898,030 pair family-nodes; 752 undecided (80 + 472 + 80 + 80 + 40); 1,598,273 minors; 20,300 product nodes;
22,508 canonical T-train; 67,138 canonical undecided; 16,727 PZ T-train; 61,251 FE-only undecided; 2,774 six-class
undecided. All agree.

## D. Errors and scope lines

1. **Count error (no effect on any zero).** RESULT sections 0, 2 and 6 say 280 nodes are excluded by the reflection
   identity. The list given in section 2 (b6: 40; b2, b5l, b5m, b5p: 80 each) sums to 360, and the ball-stage
   files record 360 symmetric nodes (40 + 4 x 80) in both tiers. Correct split: nine-class tier 752 = 360 identity
   + 392 in balls (not 280 + 472); six-class tier 2,774 = 360 identity + 2,414 in balls (RESULT section 0 writes
   "280 identity, 2,414 in balls", which sums to 2,694; section 6 writes "280 identity, 2,494 read"). The 472 and
   2,494 are the b5l-with undecided totals, which include its 80 identity nodes.
2. **"Backward heat is exactly blind" is a statement about one lift.** Proved for equal tau on both members and
   the kernel without polar terms. It is not a statement about every backward-heat control.
3. **Canonical and FE tiers are not closed.** 0 full in the canonical tier is a float64 statement on the 22,508
   T-train nodes; 67,138 nodes remain float64-undecided and could in principle reach T-train. The verdict rests on
   the nine-class and six-class tiers. A reader should not cite "no separator against {T-NR, E_a, HEAT}".
4. **Control list.** The nine classes are DH, T-NR, E_a, HEAT, theta^w, U, THIN, BLS, BEU. The campaign's
   sign-twisted-prime and phase-rotated transfer-operator controls are not among them. For outcome "none" this is
   harmless (no functional rejects a subset, so none rejects a superset).
5. **Product families** have no ball evaluation and, for five classes, a single float64 route; minors a2, a3 have
   no exact parameter. "None" there is a sampled float64 statement (already stated in RESULT section 9).
6. Not rechecked here: `jball.py` tail bounds; the theta^w coefficient code; the product-kernel code `nc.py`; the
   server runs themselves (only the saved summaries were read and a local sample recomputed).

## E. Requirement flags (strict)

| flag | value | reason |
|---|---|---|
| R1 | false | no argument; multiplicativity is not used in any established step |
| R2 | false | finite scan on [-2.6, 2.6]; no height-uniform conclusion |
| R3 | false | no functional rejects the controls; HEAT passes three sub-dictionaries identically |
| R4 | false | no content about the critical line |

Surviving claim: in dictionary DN, on the registered objects, nodes and lifts, no functional reaches training-level
separation against the nine classes or against the six classes {DH, T-NR, E_a, HEAT, U, THIN} (MEASURED; float64
with ball resolution of the undecided pair-family nodes); HEAT with equal tau is blind to quotient and
third-log-difference functionals without polar terms (elementary identity). No statement about zeros of zeta.
