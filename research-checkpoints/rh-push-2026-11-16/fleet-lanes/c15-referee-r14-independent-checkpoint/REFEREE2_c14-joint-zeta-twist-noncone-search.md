# REFEREE2: c14-joint-zeta-twist-noncone-search

Independent referee (c15-referee-r14-independent-checkpoint), 2026-11-19. Verdicts were formed from PREREG.md,
RESULT.md, the code and the mirrored data before the lane's REFEREE.md was opened; the comparison with it is in
the last section. Nothing here is a statement about zeros of zeta.

## Verdict: HOLDS WITH SCOPE LINE

Scope line (exact): "Outcome 'none' (full registered criterion, positives PA) is a MEASURED statement about the
registered dictionary, grid and draws. On the grid stage it holds with the three canonical lifts {T-NR, E_a, HEAT}
alone and with any one of the nine classes dropped (referee recount). 'No functional reaches T-train' holds in the
nine-class reading only; in the FE tier read per class 59 functionals reach T-train on the draws, and they fail on
the held-out positives (18 to 22 of 24), a failure that involves no control lift."

## 1. Lift ruling (full text: LIFT_RULING.md)

| class | ruling | FE tier |
|---|---|---|
| T-NR | canonical (twist of a Dirichlet polynomial on frequencies p0^(+-1); needs gcd(p0, q) = 1; FE-centred form) | yes, PROVED |
| E_a | canonical (chi completely multiplicative) | yes, CLASSICAL |
| HEAT | canonical (multiplier on u commutes with the twist on n); choice "same tau on both members" | yes, PROVED |
| DH | canonical as a twist; keeps the functional equation exactly when chi_G^2(q_psi) = 1 (5 of 28 members; real or complex psi) | per member |
| BLS | lane-defined (same b on both members; polynomial form; no rule ties the added zeros of the twist to those of G) | yes, PROVED for this form |
| theta^w | lane-defined; at w = 1 it gives (zeta, chi^2), not (zeta, chi); for real chi an imprimitive zeta | no |
| U, THIN | canonical as coefficient operations; kernel profile (parity, scale) is a convention | no |
| BEU | lane-defined (transported character); not an off-line control: its zeros in Re s > 0 are those of zeta, and of L(s, chi) for the twist (sum_p ((p+delta)^(-s) - p^(-s)) converges absolutely for Re s > 0) | no |

## 2. Does "none" depend on the lifts

The criterion is monotone in the control set, so dependence can only show as survivors when a class is dropped.
Recount on the mirrored grid sign matrices (`lift_loo.py`, `lift_loo.json`, through `scripts/memcap.sh 8`; my
totals equal the lane's: 94,531 one-signed on PA, 440,516 on PZ, PZ T-train 3, FE-tier PA T-train 0):

| control set | PA T-train | PA full | PZ T-train | PZ full |
|---|---|---|---|---|
| nine classes | 0 | 0 | 3 | 0 |
| nine minus one (each of nine) | 0 | 0 | 3 to 1,121 (minus HEAT) | 0 |
| FE tier per class | 0 | 0 | 35 | 0 |
| FE tier minus E_a / minus HEAT | 4 / 99 | 0 / 0 | 698 / 11,929 | 0 / 0 |
| canonical only {T-NR, E_a, HEAT} | 0 | 0 | 40 | 0 |
| no controls | 94,531 | 55,422 | 440,516 | 97,370 |

Ruling: the outcome does not depend on any non-canonical lift on the grid. On the draws and the adaptive stage the
sign matrices are not mirrored; from the lane's summaries full = 0 in the FE tier (one non-canonical lift, BLS, in
it); "full = 0 with BLS also dropped" on the draws is NOT-RUN. HEAT (canonical) is the binding class.

## 3. Statements labelled PROVED, re-derived

- Lemma T, T-NR row: T(-u) = conj T(u) follows from K_chi(-u) = conj K_chi(u) because the coefficients of
  K_chi(u - l) and K_chi(u + l) are conjugate. Holds. Note: the same holds with the two phases exchanged or with
  both replaced by 1, so the functional equation does not select the lift; the assignment chi(p0) on K_chi(u + l)
  rests on the convention n^(-s) <-> K(u + log n), which I checked against the Dirichlet-series form (Lemma C
  check of the pair-design lane). Zeros: x + 1/x + c = 0 with x = chi(p0) p0^(1/2-s), x real negative, abs(x) != 1
  for c > 2: off the line, in the open strip iff c < p0^(1/2) + p0^(-1/2). Holds.
  Check (`ref2_checks.json` item1, chi mod 7 of order 6, p0 = 3, c = 2.2, u = 0.9): residual 5.3e-5 with 30 terms,
  5.3e-14 with 60 terms. The 30-term value is a truncation effect (the member is read at u - log 3 = -2.0); a
  one-truncation check would have reported a failed functional equation (round-14 lesson 7).
- Lemma T, HEAT and BLS rows: even real multiplier / even real differential operator. Hold.
- Lemma J1 (i), (ii): g(u-h) g(u+h) = g(u)^2 e^(tau h^2/2). Holds. Check at 12 and 40 terms, 400 random
  (tau, u, h, lam): relative defect at most 1.0e-14; JC2 signs equal 400 of 400 at both truncations.
  Scope: needs the same tau on both members (with tau_A != tau_B the two terms get factors e^(tau_A h^2/2) and
  e^(tau_B h^2/2); checked) and kernels without polar terms.
- Extension found in this pass (Lemma J1', LIFT_RULING section 5): every functional invariant under a common
  pointwise scaling of the members (pointwise quotients, cross-ratios, the one-point triple expression
  K_chi^2/(K K_chi^2)) is exactly HEAT-blind. This closes on paper part of what RESULT section 10 lists as
  "a different question (not run)": the pointwise quotient or log-quotient of the pair.

## 4. Sentences to restrict

1. RESULT section 0, "no functional takes one sign on the 529 training positive pairs and the opposite sign on a
   training pair of each of the nine control classes": true as counted; add "with the lane-defined lifts; in the
   FE tier read per class 59 do".
2. RESULT section 9 item 3, "Beurling's zeros in Re s > 0 are zeta's, so it is in the question as a class but is
   not an off-line control": correct, and it means requirement (b) asks for more than R3 in the nine-class reading.
   The table columns "BEU" should not be read as "passes a control".
3. RESULT section 5, "Why no pair functional gains over the one-kernel search (ARGUED)": stays ARGUED; for BLS and
   T-NR "commutes" is true of the lane's lift by definition, so the sentence is about the lift, not about the
   controls.
4. Lemma T, DH row "lost in general": replace by "kept iff chi_G^2(q_psi) = 1; lost otherwise" (MEASURED 5 of 28;
   the rule follows from the root number of a product of characters of coprime conductors, not re-proved here).
5. FE tier: read per member. I did not recount the 59 rows per member (draw matrices not mirrored).

## 5. Not checked

The server run was not repeated. The float64 noise rule, the ball tail bounds and the theta^w recurrence were not
audited. The draws (36.6 of 38.1 million functionals) are covered only through the lane's summary files.

## 6. Comparison with the lane's REFEREE.md (read afterwards)

Agreement on the totals and on DH (its R-1: FE tier per member gives 0). Its open question to an independent
referee (whether the theta^w twist on the index m and the transported Beurling character are the intended
coefficientwise lifts) is answered in section 1: both are lane-defined and not canonical; the outcome does not
depend on either.
