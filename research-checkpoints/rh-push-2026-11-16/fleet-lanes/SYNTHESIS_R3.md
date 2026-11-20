# Synthesis, round 3 (2026-11-16): direct push on the zero-free half-plane inputs

Scope: eight round-3 lanes under `tmp/research-2026-11-16/push/r3-*/`, each with a `RESULT.md` and an independent `REFEREE.md`. This file records only what the referee confirmed. Where the author's claim and the referee differ, the referee's version is used.

Standing dependencies for every statement below: the openai/math zero-free half-plane manuscript (Re s > 7/8, Lean-checked locally), Liu arXiv:2610.12234 (Liu I), Xu-Sang arXiv:2610.15291, Liu arXiv:2610.26835 (Liu II). All four are unrefereed. "PROVED-rel" means proved relative to those texts as written.

Labels: PROVED / PROVED-rel / EXACT (exact identity or exact-rational computation) / MEASURED / MODEL (LP or price on unproved inputs) / ARGUED / HEURISTIC / RECALLED / OPEN.

RH is open. No lane proves a zero-free abscissa below 0.874886647.

---

## 1. Abscissas and counts that moved

**None.**

| Quantity | Value before round 3 | Value after round 3 | Status |
|---|---|---|---|
| Lean-checked zero-free half-plane | Re s > 7/8 | 7/8 | unchanged |
| B_flat (follow-up chain) | 0.874886647 | 0.874886647 | unchanged; depends on the four unrefereed inputs; full-system value rests on float LPs, not exact certificates (r3-lemma181-b referee E5) |
| Critical-class count exponent R_c | 0.590332 | 0.590332 | unchanged; no tau > 0 proved |
| Numerator exponent K (Liu II Prop 14.3) | (3R+1)/4 - theta/2 | same | unchanged; no saving d > 0 proved |
| TRO6-natural saving eta | none | none | no eta > 0 proved or measured |

What was established about these fixed values (not movements):

- **R_c = 0.5903324 is an exact three-way saddle** at the witness pair (r*, m*) = (0.7457, 0.4183), with t* = 1.16395. EXACT (exact-rational re-solve by the referee, identical to Liu II (13.16)). Location: `r3-critical-count/RESULT.md`. Referee: holds.
- **K is the exact LP optimum of its own estimate system** (Theorem A; section 4.2). Location: `r3-lemma181-b/RESULT.md`. Referee: holds for the system C1-C3.
- **Exact identity at the critical class**: R + m_p(delta/2 - theta) = (3R+1)/4 - theta/2 = 2/3 at theta = q/(6 kappa), m_p = t* - r* = 0.418254. EXACT (re-derived by hand and numerically by the referee). Location: `r3-lemma181-a/RESULT.md`, Corollary R1.

MODEL prices exist for hypothetical inputs (section 2.3). None is a claimed bound.

---

## 2. Limit of the method family and ranked inputs toward 1/2

Source: `r3-method-limit/RESULT.md` + `REFEREE.md` (referee: PROVED scalar steps and all tabulated LP values confirmed; two statements corrected, see 3.6). These are statements about the estimate system, not about zeros.

### 2.1 What is proved

- **[PROVED scalar]** If the signal exponent is C(s) = s - 1 + lx/2 + h/r and the low estimate is at or above the square-root level Z^{lx/2}, then B >= 1 - h/r. For r = 6 this gives B >= 5/6 under lx >= l, or under M >= 2l with the polar term kept.
- **1/2 requires h = r/2** (effective order 2): a coherent set of exponent 1/2. Nothing in the sextic system supplies it.
- "Square-root level" is a definition of the method family, not a proved lower bound on a norm.

### 2.2 Tiers (EXACT LP on MODEL inputs; source low-side G)

| Floor | Value | What must be removed or supplied to reach it |
|---|---|---|
| Current | 0.874886647 | — |
| 13/15 | 0.866667 | density-level counts not needed; floor holds for the source low side with any counts and without the J-loss; holds for partial TRO6 (eta <= 1/2) |
| 6/7 | 0.857143 | full TRO6 (eta = 1) with source k and ideal high side; attained at (lx, ly, l) = (2/7, 4/7, 1/7) (referee, hand-checked) |
| 31/36 | 0.861111 | K-loss removed (source G, no TRO6) |
| 23/27 | 0.851852 | K-loss and J-loss removed |
| 5/6 | 0.833333 | k = 0; at eta = 1, removing the K-loss alone already gives 5/6 |

Status of 5/6: it is the infimum of the reduced ideal system only when lx >= l is imposed as a modelling hypothesis. The manuscript uses one fixed geometry and Liu II section 15.1 relaxes it to M, ly, l >= 0. Under the source-grounded form M >= 2l, ly >= l, k = 0, the 5/6 floor is carried by the polar term alone, which TRO6-natural would remove; with eta = 1 the referee's LP then has no floor inside the model (2/3 at box 4, and the reduced system returns values below 1/2 in some runs, so it is inconsistent outside lx >= l). 5/6 is therefore **not** established as the limit of the method family.

Order r other than 6 is a MODEL transplant, not checked against a source.

### 2.3 Ranked inputs (all unproved; prices are MODEL)

Ranked by the size of the movement the referee-confirmed prices assign, largest first.

1. **Full TRO6-natural (eta = 1)**: 13/15 -> 6/7; combined with removal of the K-loss, 5/6. No eta > 0 is proved or measured (sections 3.4, 3.5, 4.4). Per-unit price near eta = 0: -0.00574 per eta (eta = 0.01 -> 0.8748284), float LP, `r3-nonpolar-proof`.
2. **K-loss removal** (reflected-energy range M + l <= 1, manuscript Lemma 5.8 / 15.1): 13/15 -> 31/36 without TRO6. Open question: whether the K-loss is the true size of the marked row norm or a large-sieve artifact.
3. **Numerator saving d in Xu-Sang (25) / Liu II (14.16)**: dB/dd = -0.183; reaches 13/15 at d = 0.04268 (referee reproduced). Any of the following would give such a saving (r3-lemma181-b referee list):
   - class-restricted fourth moment at central length m = 1/2 (saving U^-0.2 reaches 13/15; about -0.046 per unit omega);
   - moment of order above 4 (sixth moment: 0.8692);
   - mollified second moment sum_u |S_m M_{r*}|^2 << U^E with E < 1.1366 (m = m*) to 1.1452 (m = 1/2), against large-sieve exponents 1.1640 to 1.2457: a saving of U^-0.027 to U^-0.10;
   - rowwise cancellation without absolute values (TRO6-type, outside the system).
4. **Prime cost below capacity in the count** (M1 cost c1 < 2, or M2 cost c2 < 6 kappa): c1 = 1.9 / 1.75 lowers B by about 2.2e-4 / 6.5e-4; c1 = 1.5 by at most about 1.5e-3. Relaxing only the first M1 condition caps the critical-class saving at tau <= 0.0118, because 2r + 8z < 3 binds from c1 about 1.5. The referee reproduced the critical-class counts only; system-level B gains were not rerun.
5. **Effective order 2 (h = r/2)**: the only item that reaches 1/2. No candidate construction. Sub-square-root correlation or prime marks with l - lx = 2 are heuristically circular.

Items 1-4 stay inside [5/6, 7/8]. Only item 5 addresses RH.

---

## 3. Results a referee broke

### 3.1 r3-lemma181-a: Theorem R proof gap (repaired) and scope
- The step "group the O((log U)^2) dyadic twist heights and apply (*)" is wrong: (*) holds at one common t, while the witness height varies per row over a range of length about T_1. Repair: unit bins in the witness height, sup over a unit shift, sum O(T_1) bins. Loss becomes U^{(A+1) eta}; H must cover (3I+1) T_1. Exponent conclusion unchanged.
- "Any numerator saving d implies a count saving d on the plain-witness rows" holds only for rows whose witness presentation induces the numerator character (nu = 1). No source bounds the nu = 1 share.
- It is a reduction, not an impossibility: no class with #B_P = U^R is shown to exist.
- The coupled price -(0.183 + 0.0225) d is not implied by Theorem R.
- The Halasz-Montgomery / Burgess row in section 5 is heuristic.

### 3.2 r3-lemma181-b: the "only" classification is false
- "Only a class-restricted or amplified fourth moment, or a moment of order above 4, lowers K" is not proved and is false as a classification. A mollified second moment sum_u |S_m M_{r*}|^2 with E < 1.1366-1.1452 also lowers K (unlisted, not in the sources, unproved).
- "Exact primal = dual on 120 cases" is close to automatic (same algebraic expression in most cases). The exact content is primal feasibility over 1891 pairs; optimality rests on the hand certificate (verified) and a float solver.
- Theorem B needs m* > 1/3 strictly; the source gives >= 1/3. Irrelevant at the critical class (0.4183).
- The upper bound for theta > theta0 and the L < 1/(6 kappa) case use Lemma G, a sketch. The obstruction direction does not use it.

### 3.3 r3-critical-count: four corrections, no PROVED step false
- R1: the model drops the second M1 condition 2r + 8z < 3. With it kept, lowering c1 alone saturates at critical-class count 0.57858 from c1 about 1.5. The row c1 = 1.5 is about 2.5% optimistic; rows c1 <= 1.25 and "saturates near 0.8728-0.8730 because of supply 0.21" hold only if both M1 conditions are replaced.
- R2: Lemma E proves a hybrid second moment at level cannot beat the row-only second moment at level, not that it cannot beat 0.5903. The hybrid sieve shape in Lemma T is unsourced. "Only multiplicity is u -> u a^6" is proved only for identical character values.
- R3: "only via c1 < 2 or c2 < 6 kappa" needs the qualifier "among second moments at level". A below-level mixed moment sum |M_{r*} S_{m*}|^2 << U^N with N < 1.1366 also lowers the count and is unpriced.
- R4: Lemma J "no bound" should read "no bound below trivial".

### 3.4 r3-nonpolar-numerics: the statistic is row-blind
- The statistic t = |sum_c nu(c) x(c)|^2 / sum_c |x(c)|^2 has family mean 0.999-1.001 and the Exp(1) law for random-phase rows, permuted rows, Gaussian noise, all ones and N(m)^{-1/2}. Mean 1.000, Exp(1), delta = 0.506 and sup-delta = 0.501 are properties of the conductor-side frame, not of theta_6. "delta = 0 excluded at 60 se" has no content.
- The coherent bound 2.1e-4 to 2.5e-4 was compared with the wrong scale: Bessel / large sieve already caps it near 1/sqrt(rows) (0.003-0.006) for any row vector. Gain over trivial is about 10-25x.
- Polar share had an unsubtracted projection baseline. Corrected: about 0.157 -> 0.108, slope about -0.11 (not -0.161 +- 0.006); inside Theorem P's -0.10 to -0.13 range.
- The Moebius-phased low-frequency zone is not specific to theta_6: all-ones rows show a deeper zone.
- Independent rerun at Q = 937.5 reproduced the stored values (S_sigma(c) to 1.2e-7 by a different code path). Q > 938, F3, KS at Q = 30000 and slopes were not rerun.

### 3.5 r3-nonpolar-proof: referee holds = false as labelled; negative verdict survives
- Section 2.3 applies manuscript Lemma 9.1 to all m with N(m) <= Q; the lemma restricts rows and columns to squarefree ideals, and rho(m) is not supported on squarefree m. The "+3/10" deficit holds for the squarefree part only; for the full sum it is "at least +3/10".
- "Exact exponents" is overstated: the convexity and Lindelof rows assume the open functional equation (V); the optimal sieve Q + D is not known.
- (LB) is measured on a sharp-cutoff stripped estimator, not on R = T - P with smooth W. The remark that (LB) is a theorem for D >= Q^{2+eps} has no proof.
- Statement P' (prime-modulus polar law up to Q^{1-delta}) gets no support from the stored data: the prime residual grows from 0.24 to 0.75 across N(p) bands and exceeds the composite residual in the top band in all three runs (the k = 5 control grows the same way, so the test does not refute P'). The dual-term length is internally inconsistent (N(p)^2/Q vs Q/N(p)^2). Relabelled HEURISTIC.
- Price table reproduces (float LP).

### 3.6 r3-method-limit: two statements false or overstated
- "TRO6 does not move 13/15" is false: at eta = 1 the floor is 6/7; 0.86469 at eta = 0.6; 0.86084 at eta = 0.8. True only for eta <= 1/2.
- (GEO) lx >= l was labelled PROVED-rel manuscript; it is a modelling hypothesis. "TRO6 does not move 5/6" holds only under strict lx >= l.
- Runs F1, F2, Q2 return B < 1/2: the reduced ideal system is inconsistent outside lx >= l.
- Liu II h is 0.7952, not 0.794.

### 3.7 r3-higher-rows-dual: referee holds = false as labelled; verdict survives
- Theorem A(i),(ii) cite the wrong series: dFDH arXiv:2607.07911 (6.8)-(6.16) cover the untwisted psi only. The absorbed dual T carries the Groessencharacter twist alpha(a) = a/|a|; its functional equation rests on theory marked "cited, not read". Exponent 3 with no pole is PROVED-rel for the untwisted class-3 column only.
- r = 5 exponent 6 is RECALLED (no source read).
- "No a = 2 reflection exists" is stronger than shown.
- MODEL rows 0.8906 (r = 4) and 0.9259 (r = 5) contradict the note's own Cor. B1: the balanced input gives 1 - 1/(2r) = 0.875 and 0.9.
- "Alone yields only 1 - 1/(2r)" is proved in one direction only.
- Theorem B: coprime-pair algebra correct; non-coprime pairs, the ramified prime and Mellin separation are unwritten; Cor. B2 is the least supported; no numerical test.

### 3.8 r3-tnr-control: referee holds = false as labelled
- The Laurent twin with p = 2, e = 0.2 has its zero at Re s = 2.7604, outside the strip; "Sections 2-4 apply unchanged" is false for it. Zeros inside the strip need 0.471 < e < 0.5 for p = 2.
- Prop T does not localise the failure to (2.4): it proves only that (2.4) and (2.5) cannot both hold, which follows from Prop 2.1 and the twin zero. "Fails only at the local size condition" is ARGUED, not PROVED.
- "x + z > 5/6 is replaced by x + z > 2/3" is false for w_r < 1/2: absolute convergence also needs 6x + 6z + 2w > 5. Correct at w = 1.
- The tabulated twins (q = 2, 3, 5, 7) always lie in the deleted set S, so only the deletion reading is literal for them.

---

## 4. Obstructions (referee-confirmed form)

### 4.1 Numerator saving is at least as hard as a count saving (r3-lemma181-a)
PROVED-rel after the unit-bin repair, loss (1 + T_1)^{A+1}. A first-moment bound U^N for the numerator on Re = 1/2 + theta, uniform in |t| <= H, forces #{u in B_P(m), nu = 1} << U^{N - m(delta/2 - theta) + eps}. With Corollary R1, a saving d in Xu-Sang (25) / Liu II (14.16) implies a count saving d on the nu = 1 plain-witness rows at m_p. Not constrained: rows with nu != 1 witnesses; long-inverse-witness rows (r = t* = 1.164). Not rerun: LP columns 6.1-6.3; the proof of manuscript Lemma 18.1 itself.

### 4.2 The numerator exponent is LP-optimal in its system (r3-lemma181-b)
PROVED for the estimate system C1-C3 (M2 at capacity 6 kappa, bin bound, count), under 1 - delta <= R <= 1 - g/(3 kappa) and the relaxed gate. (3R+1)/4 - theta/2 is the exact optimum for 0 <= theta <= theta0, and R + m_x(delta/2 - theta) beyond. It is attained by a flat configuration that also satisfies the detector at all cutoffs and M1, at every block length in [m*, 1/2] at theta0. Class or prime-range splitting, weights, exchanged Cauchy-Schwarz and block-wise pointwise mixing give the same exponent. Theorem B: no moment input with right side U^1 and total length <= 1 changes N(theta) for theta <= theta0 when m* > 1/3. The gate (14.15) relaxation is a sketch.

### 4.3 The critical count is a saddle closed to level second moments (r3-critical-count)
- Lemma J (PROVED): the pair-averaged Halasz-Montgomery / Jutila chain of every order k gives no bound below trivial for spike ratio <= 1/2; the critical class has 0.4693.
- Lemma E (PROVED, restricted form): a hybrid (target or t) second moment at level never beats the row-only second moment at level; sixth-power amplification never pays for primes.
- Lemma W (PROVED-rel): among second moments at level, the count moves only through prime length beyond the M1 or M2 capacity. A second moment at level lowers it only for total length in (0.87285, 1.11246).
- Not excluded: the below-level mixed moment (N < 1.1366); joint use of two detector scales. OPEN: (M1+).

### 4.4 The per-modulus then l2-in-c route misses Cauchy-Schwarz (r3-nonpolar-proof)
Toy geometry (n = 1, S' empty, D = Q^{7/5}). Unconditionally the route misses by +7/10 with the trivial bound and by at least +3/10 with manuscript Lemma 9.1 (squarefree part only). With hypothetical inputs (Lindelof per modulus under the open functional equation (V), or an optimal sieve Q + D) it misses by +1/5; a per-modulus saving delta_s > 9/14 would be needed. PROVED-rel Theorem P: A_c(w) W-hat(w) minus one simple pole at w = 5/6 is entire, bounded by N(c)^{(2+delta)(11/12 - sigma)}. PROVED-rel the measured (LB): any bound that drops the sign of beta_c is at least Q^{11/12} (D/Q)^{1/2}.

### 4.5 Numerics cannot currently separate eta = 0 from eta > 0 (r3-nonpolar-numerics)
MEASURED: at R = Q^1.4, Q <= 30000, n = 1 part, S' empty, estimator cutoff 1e7, each of 93,486 sampled targets has theta-row form at most 0.0117 of Cauchy-Schwarz at Q = 30000, before and after polar removal. The statistic is row-blind (3.4), so this is not evidence specific to theta_6. TRO6-natural is neither supported nor contradicted. Zero-carrying targets and the A = c n^3 part are not sampled.

### 4.6 Higher-order rows do not go below 7/8 (r3-higher-rows-dual)
- (B) PROVED-sketch (coprime part re-derived): Poisson in the row variable exchanges the off-diagonal mean square of the absorbed dual with that of the order-r Moebius twist family. The balanced moment follows from GRH and implies zero-freeness in Re s > 1 - 1/(2r): 7/8 for r = 4 (a tie), 9/10 for r = 5, 5/6 for r = 3. That it gives nothing lower is heuristic.
- (C) Arithmetic confirmed, relative to dFDH for n = 3, 4: coefficient-blind bounds on the Poisson dual are no better than trivial (D^2) at every amplifier length.
- MEASURED (reproduced at smaller scale): r = 4 absorbed class at random-phase level (0.913 vs 0.918 at Z = 2e5); polar control 5.45, exponent 0.219; r = 5 Moebius side 0.986 +- 0.012.
- Values 0.810 (r = 4) and 0.849 (r = 5) need perfect Moebius orthogonality for q < 1, for which nothing is known.
- Referee observation: the untwisted K3 column shows a dip (R about 0.35) moving roughly as Z ~ const N(m)^{3/2}, rough support for exponent 3 in the untwisted class.

### 4.7 The one-prime twin does not locate the binding arithmetic (r3-tnr-control)
- MEASURED: F = zeta D_q (q = 3, c = 2.2) has the functional equation (defect 8e-26 at 25 digits on rerun) and 10 zeros at Re 0.90375 below height 60.
- ARGUED: the 7/8 argument excludes the twin through the local hypothesis |eta(p)| = 1 (Section 2 deletion sentence; Lemma 7.1 bounds). Because F is zeta times one local factor, the control is near-tautological.
- EXACT (Prop N): at (w, z) = (1, 1/6), H_eta(s) = L^S(6s - 3, (lambda eta)^6) E_eta(s), with E_eta absolutely convergent for Re s > 1/2. Per-prime absolute bounds stop at 2/3. Normalizer zeros at 7/12 + i gamma'/6, first at height 1.0850 for eta = 1. Not binding at 0.8749 or 13/15.

### 4.8 Method-family scalar bound (r3-method-limit)
Section 2.1. B >= 1 - h/r under the stated hypotheses; reaching 1/2 needs h = r/2.

---

## 5. Top 5 next moves

Ordered by relevance to RH first, then by the size of the confirmed MODEL price.

1. **Effective order 2: find or exclude a coherent set of exponent 1/2 (h = r/2).** This is the only input in the ledger that reaches 1/2 (section 2.1). First step: referee Theorem 1 hypothesis (ii) of `r3-method-limit` (low estimate at or above Z^{lx/2}) and decide whether "square-root level" is a provable norm lower bound or only a definition. In parallel, per the `r3-tnr-control` referee, test the unused coincidence chi_u = eta chi_u for the zeta target (hybrid target-row mean value) in steps S2/S4, and apply the one-prime twin to mechanisms with no deleted set (g-passive-cascade, stack-combinator).

2. **Decide whether the K-loss is real.** Measure sum_m |B_m|^2 for row range above the completed scale (manuscript Lemma 5.8 / 15.1, range M + l <= 1). If it is a large-sieve artifact, 13/15 -> 31/36 is one lemma, and with eta = 1 the floor is 5/6. Also settle (GEO): which of lx >= l or M >= 2l the sources actually force, since the 5/6 floor depends on it.

3. **TRO6-natural through the signed c-sum, not l2-in-c.** Every per-modulus or l2-in-c route is closed at +1/5 or worse (4.4). Remaining forms: (a) cancellation in the s-tilde sum of the dual form (per-progression requirement drops from 2/7 to 1/7 of the length; depends on the unchecked section 4.3 of `r3-nonpolar-proof`); (b) stratify m by squarefull part, where chi_c(m2) degenerates to quadratic or cubic characters. Numerics first need a row-sensitive statistic: maximise t over completely multiplicative unimodular nu by coordinate ascent on prime phases with random-phase rows as baseline, then restrict to Hecke twists of bounded conductor; extend the exact Gauss-sum table to 1e8 so row conductors sit outside the estimator range.

4. **Below-level mixed moment sum_u |M_{r*} S_m|^2 << U^E, m in [m*, 1/2].** Found independently by two referees (3.2, 3.3). Thresholds: E < 1.1366 at m = m*, 1.1452 at m = 1/2, against large-sieve 1.1640-1.2457. It lowers both K and the critical count and is not excluded by Theorems A, B or Lemmas E, W. First piece: sum |M_r S_b|^2 << U^{1+eps} with r + b <= 1, b <= 0.21 (Heath-Brown-identity component), after tracing the "+ z_0" charge through manuscript Lemma 14.3 / 17.2 and Liu II Theorem 11.2 to confirm it is a triangle-inequality loss.

5. **Class-restricted or amplified fourth moment of the sextic twist family at central length m = 1/2.** MODEL: saving U^-omega moves B by about -0.046 omega; U^-0.2 reaches 13/15. Test whether the Lemma 18.1 induction admits a detector factor at z = 0, and whether a twist-sensitive numerator estimate reaches the nu != 1 rows left unconstrained by Theorem R.

Routes to close: r = 4 and r = 5 rows as routes below 7/8 (4.6; the only higher-row target below 7/8 is r = 3 with a cubic balanced Moebius moment exponent E < 25/12); T-NR as a locator of the binding arithmetic (4.7); pair-averaged Halasz-Montgomery at the critical class (4.3); second moments at level for the count (4.3); per-modulus plus l2-in-c for TRO6 (4.4).

---

## Referee outcome table

| Lane | Verdict | Referee holds | File |
|---|---|---|---|
| r3-lemma181-a | precise obstruction | yes, after repair and scope restriction | `r3-lemma181-a/RESULT.md`, `REFEREE.md` |
| r3-lemma181-b | precise obstruction | yes; "only" classification removed | `r3-lemma181-b/RESULT.md`, `REFEREE.md` |
| r3-critical-count | precise obstruction | yes; four corrections | `r3-critical-count/RESULT.md`, `REFEREE.md` |
| r3-nonpolar-numerics | partial result (MEASURED) | yes; interpretation reduced to a per-target upper bound | `r3-nonpolar-numerics/RESULT.md`, `REFEREE.md` |
| r3-nonpolar-proof | precise obstruction | no as labelled; negative verdict survives | `r3-nonpolar-proof/RESULT.md`, `REFEREE.md` |
| r3-higher-rows-dual | precise obstruction | no as labelled; verdict survives | `r3-higher-rows-dual/RESULT.md`, `REFEREE.md` |
| r3-method-limit | precise obstruction | yes; two statements corrected | `r3-method-limit/RESULT.md`, `REFEREE.md` |
| r3-tnr-control | precise obstruction | no as labelled; Prop N and numerics survive | `r3-tnr-control/RESULT.md`, `REFEREE.md` |

All paths are relative to `tmp/research-2026-11-16/push/`.
