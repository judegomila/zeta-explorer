# VERDICT — y-transfer-01758 (Lambda <= 0.1758354 candidate)

**Verification: partly confirmed. Status: interval-arithmetic certificate, unrefereed candidate.**

## Statement supported
Instantiating Polymath15 Theorem 1.2 at t0 = 1583/10000, y0^2 = 87677/2500000, X = 6000000185827 gives
Lambda <= 879177/5000000 = 0.1758354, conditional on: the cited Polymath15 theorems (1.2, 1.3, Prop 6.6), the
Platt-Trudgian verified height, a barrier certificate inherited from the separate 0.1787854 package, window-freeze and
tail lemmas written for another parameter row, a native-binding lemma, the prose y-transfer Theorems B/C, and the
correctness of four Arb verifiers. The y-transfer part: L_N(y) >= L_N(y0) - B for N in [690988, 6000000],
y in [y0, sqrt(1-2 t0)], with B <= 2.4958e-4; assembled margin L12_min - B - eps_cap >= 1.622504e-3.
Lean covers three abstract finite-sum inequalities and one calculus lemma; it does not mention H_t or any number.

## Replayed
- Assembly gate: 23/23 PASS, margin 1.622504081e-3, tail verifier rebuilt byte-identical (gate re-reads logs otherwise).
- Lean: 7 theorems, axioms [propext, Classical.choice, Quot.sound] only; no sorry.
- Independent double-precision implementation of L_N (no shared code) reproduces the three binding lane minima
  to all printed digits: 0.001872347259 (N=690988), 0.1012979548 (N=1000001), 0.01006638441 (N=1300001).
- y-transfer conclusion checked on 9 N x 11 y samples: L_N(y) increases with y everywhere sampled; mass drops by
  >= 0.0077 by y = 0.19. No counter-sample.
- Polymath15 Thm 1.2 transcription matches the arXiv text.

## Not replayed
Full y-Dini run, full lane sweep, barrier, eps_cap derivation, tail lemma, source audit of the 1400-line verifier.

## Stress results
- Edge-tuned: at N=690988 the certificate fails for y0 -> 0.186 (L = -0.0028), t0 -> 0.1580 (L = -0.0042),
  N -> 680000 (L = -0.0028). Slack corresponds to about 1e-4 in Lambda. The value 0.1758354 is where this
  287-weight mollifier's triangle bound reaches zero at x = X.
- Weights rounded to 3 decimals still pass (0.001706). Sign pattern removed: fails (-2.62). Euler{2,3} on leg A: fails (-0.20).
- The y-transfer budget is not the tight step; the base margin at y0 is.
- Functional is a mollified triangle inequality on coefficients b_n^t; zeta enters only through the verified height
  and the approximation theorem.

## Defects
1. "Bound" overstates: candidate, no human referee; Platt-Trudgian 0.2 is the published bound.
2. Lean `DiniGate.summand_antitone` assumes the gate for all real t and sigma' = 1/2 exactly; the certificate supplies
   the gate on [y0,y1] and sigma' >= 1/2. Not instantiable as stated; routine repair not done.
3. Inherited, non-re-audited inputs (barrier, tail, window freeze) from the 0.1787854 package.
4. Provenance gaps in logs (no mollifier hash in the 2026-08-02 run; lane logs do not echo parameters).

## Literature
Method = Polymath15 (arXiv:1904.12438) Theorem 1.2 with an optimised mollifier, at the Platt-Trudgian height.
Unrefereed 2026 claims below it exist: Kornaus < 0.172422, Planat-Raymond arXiv:2611.06245 < 0.156821,
Raymond < 0.149396. 0.1758354 itself not found in the literature. The project's own later work reports lower
conditional values (0.1466).

## Scores
- Arbitrariness 4/5: the number is an optimiser output depending on (t0, y0, X, 287 weights, lane split);
  the excision-budget lemma is a general but routine device.
- Importance 2/5: if refereed it would be an incremental improvement on 0.2 at unchanged verified height with no
  consequence for RH; it is unrefereed and numerically superseded by other unrefereed claims.
