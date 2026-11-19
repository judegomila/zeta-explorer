# REFEREE: c15-referee-r14-independent-checkpoint (adversarial pass, lens: general)

Date 2026-11-19. Object refereed: RESULT.md of this directory and the files it rests on (LIFT_RULING.md, seven
REFEREE2 files, lift_loo.py, ref2_checks*.py, CHECKPOINT_R15_REFEREED.md, LABEL_RESTRICTIONS.md). The lane is a
referee record; it makes no statement about zeros of zeta and neither does this file. Runs: two local scripts
through `scripts/memcap.sh 8` (kept outside the repo, in /tmp/ref_c15/); the server was not contacted.

## Verdict: HOLDS (as a referee record), with five corrections, none of which breaks a PROVED step

Requirement flags, set by me: R1 = false, R2 = false, R3 = false, R4 = false. Nothing in the lane establishes any
of them; it proposes no device. No step assumes RH, none restates verified height, no classical theorem is
presented as new (Hamburger 1921, Montgomery Theorem 12.1, Dirichlet, the maximum principle are cited as such).

## 1. PROVED steps re-derived by me

| step | result |
|---|---|
| Lemma J1 / J1': g(u-h) g(u+h) = g(u)^2 e^(tau h^2/2); common pointwise scaling | holds (one line each). J1' is trivial once stated; correct label "elementary" |
| T-NR quotient D(z)/D(z+1) is Schur | holds: conj D(it) = D(1+it) for real c; zeros of D(z+1) at Re z = -1/2 +- b, left of the axis iff b < 1/2, that is iff c < p0^(1/2) + p0^(-1/2); limit 1/p0; periodic in Im z; maximum principle. The condition "b < 1/2" (zeros in the open strip) is used and is not stated in REFEREE2 prefilter section 1: for c above the bound the quotient has a pole (my run: p0 = 7, c = 3.5, sampled supremum 11 and 51) |
| D(1 - z) = D(z), so zeta m_w has zeta's own functional equation, same gamma factor | holds |
| DH twist rule chi_G^2(q_psi) = 1 | holds, and the proof is three lines (the lane says "not written out"): W(chi psi)/W(conj(chi) psi) = [W(chi)/W(conj chi)] chi(q)^2 for coprime conductors, and c2 = conj c1 gives conj Lambda_psi(1 - conj s) = Lambda_(conj psi)(1 - s). Numerical: ratio defect <= 5e-16 for psi of conductor 4, 11 (two complex psi), 19; defect 2.0 (factor -1) for conductors 3, 7, 13 |
| BEU has the zeros of zeta in Re s > 0 | holds: abs((p+delta)^(-ks) - p^(-ks)) <= k delta abs(s) p^(-k sigma - 1), summable over p and k for sigma > 0, so zeta_B/zeta is analytic and zero-free there. Partial sums of absolute values at s = 0.3 + 9i: 4.574, 4.620, 4.639 (p < 1e4, 1e5, 1e6) |
| bridge ratio: zeros with Re lambda <= a give no pole; a pole at lambda - a is cancelled by a zero at lambda - 2a | holds. Corrected sentence also holds: Schur for all a in an interval would need a continuum of zeros |
| theta lane: A(1, s) carries 1 + 2^(1-u); W_1 does not vanish there | holds given the lane's formulas: at 2^(3/2) x = -1, W_1 = (1+i) x^2 (1 + 1/2 - 1/2) |
| local factor 1 + phi(p^2) x^2 + p^(5/2) x^3 divisible by 1 + p^(1/2) x | holds (1 + (p-1) - p = 0) |
| TW gap abs(log(n m'/m)) >= log(1 + 1/M); Lemma C factorisation and zero position 0.789 | hold |
| Lemma A exponents: ranges meet at 4/5; 0.273 against 0.222 at 0.9 | hold; agrees with my recollection of Montgomery Theorem 12.1 (not opened by me either) |
| U8 heat inheritance of monomial upper bounds | holds for real non-zero K at the nodes with negative exponent; that hypothesis should be written |
| Theorem L eigenvalue of T_p on 1; L^q membership; Proposition E symmetry; L(0, chi) = 0 for even chi | hold |

## 2. Numeric checks rerun with different cases

Grid recount (own code, same mirrored sign matrices; 523,771 stage-2 rows):
- All counts of lift_loo.json reproduced: PA one-signed 94,531, PZ 440,516; PA T-train 0 for nine, each
  nine-minus-one (minus HEAT checked), FE tier, canonical three; FE tier minus HEAT 99; PZ 3 / 35 / 40 / 1,121 /
  11,929; full 0 in every tier.
- New cases: held-out threshold 22 and 20 in place of 23: full = 0 in every tier with at least one class
  (no-control ceilings 71,969 / 92,893 on PA). HEAT alone: PA T-train 6, PZ 963, full 0. {T-NR, E_a}: PA 101,
  PZ 19,972, full 0. Nine minus {BEU, theta^w, BLS}: PA 0, PZ 5, full 0.
- Completeness of the recount: I checked that every one of the 963,787 rows excluded at stage 1 has two opposite
  decided signs on PZ (0 exceptions), so no control set can admit them. The recount therefore covers the grid.

Other reruns (different parameters): T-NR quotient at (p0, c) = (7, 2.6) and (2, 2.05): modulus 1 on the axis to
2e-16, supremum 0.959 / 0.990 and 0.994 / 0.998 on two grids. Bridge ratio at a = 0.1 with zeros 0.3 and 0.1
(cancelling): 0.9992 / 0.9996; a chain 0.45, 0.25, 0.05: 0.9988 / 0.9995; 0.3 with 0.05 (no cancellation): 8.6 / 9.5.

## 3. Errors and overstatements found

1. **H2 two-truncation note, wrong number.** REFEREE2 Lax-Phillips: "on one prime the divergence is not visible
   before k of about 45". For p = 2, a = 1/4, theta = 0.20, mu = -1/4 + i gamma_1/2 the ratio first exceeds 1 at
   k = 56 (my run; p = 3: k = 28; theta = 0.22: k = 90). The supremum values 1.000 (k <= 30) and 1.154 (k <= 60)
   are right. Replace "about 45" by 56.
2. **"HEAT is the binding class everywhere" (LIFT_RULING section 2 item 4; RESULT section 3).** Not true of the
   registered reading: on PA with nine classes, dropping HEAT leaves T-train 0, and full is 0 in every tier
   without HEAT. HEAT is binding for T-train in the FE tier and the canonical tier (99 and 101 appear without
   it) and on PZ. Also HEAT alone does not give T-train 0 on PA (6 rows); it is the conjunction with T-NR and E_a.
3. **"1,487,558 functionals recounted".** The script reads the 523,771 stage-2 rows. The statement about the
   whole grid is correct only with the stage-1 argument (rows with two opposite signs on PZ fail (a) for every
   control set), which RESULT.md does not give. Verified here (section 2). The recount reuses the lane's float64
   sign matrices; it is a recount of the tiers, not of the signs (RESULT says the sign rule was not audited).
4. **Checkpoint, "U1 and U2 are protected by INT, not by FE".** Shown: FE alone does not protect (T-NR Laurent,
   symmetric multipliers). Not shown: that {FE, GEOM} or {FE, SIZE, POS} without INT contains a control. T-NR
   fails GEOM, SIZE and POS at p0; the only candidate is the pending ZQ lane, which has a same-lane check only
   and whose twists have poles on the line. For U1 the placement in U3 is nevertheless correct for a different
   reason: GEOM at every rational prime already gives an ordinary Dirichlet series, so INT is implied and
   Hamburger applies. For U2 adding INT is a narrowing by decision of this pass, not a consequence; the cell
   {FE, SIZE, POS at log level} without INT is dropped from the list without a control that defeats it. It
   should be kept as an open cell conditional on ZQ.
5. **LIFT_RULING section 4 item 2, conductor list.** "all psi of conductor +-1 mod 5: 4, 11, 19, 29, 31, ..."
   omits 9, 16, 21, 24 (and 36, 39 in the held-out range 14 to 40). A compute lane that takes the list literally
   loses members. The rule is right; print the full list.
6. Minor. (a) The Schur proof for the T-NR quotient needs c < p0^(1/2) + p0^(-1/2) written as a hypothesis.
   (b) "Canonical" is the lane's own definition (it says so); the ruling is a convention plus a robustness count,
   and only the count is evidence. (c) The theta-lane counter-example sits on Re u = 1, not at a zero of zeta: it
   refutes the sentence about propagation by the Hecke relation, not the vanishing of the row at s_rho (the lane
   says the latter is unaffected). (d) The pass was not blind on the prefilter item (stated by the lane) and
   point (ii) there is taken from the earlier referee (stated).

## 4. Controls

No zeta-only mechanism is claimed, so no control run is owed. The control statements the lane makes were run:
T-NR Laurent keeps the functional equation (identity); BEU has zeta's zeros in Re s > 0 (proved above); DH
twists keep the reflection symmetry exactly at conductors +-1 mod 5 (run above); same-tau HEAT is exactly blind
to scaling-invariant functionals (identity). The phase-rotated transfer operator, the unimodular twist, T-NR in
ordinary-series form and theta^w were run against nothing, as the lane states.

## 5. What remains unverified by this pass

The draw and adaptive stages (36.6 of 38.1 million functionals); the float64 sign rule and ball stage; the
unopened sources (Montgomery 12.1, regularised Rankin-Selberg for half-integral weight, Shimura 1973); Lemma E
(iii), Lemma V and Lemma Q of the refereed lanes; the 443-node sweep; the catalogue table row by row; the
comparison of U5, U7, U6 (c) to (f) with all map rows. RESULT.md lists the same gaps.

## 6. Surviving claim

Referee record only. Round-14 lanes 1 to 6 and the checkpoint draft hold with the scope lines given; the three
sentences named are false as written; on the grid stage the outcome "none" (full criterion) holds with the
lifts T-NR, E_a, HEAT alone, with any one class dropped, and with the held-out threshold lowered to 20; BEU is
not an off-line control; the DH twist keeps its functional equation exactly when chi_G^2(q_psi) = 1. Corrections
1 to 5 of section 3 apply. Nothing about zeros of zeta.
