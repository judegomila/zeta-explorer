# REFEREE: r3-tnr-control

Adversarial referee pass, 2026-11-16. Sources opened: `~/lean-deps/qrh-verify/paper.txt` (Section 2, (4.7), (7.6),
(7.10)-(7.17), (10.1)-(10.2), Section 16 principal factor), `bypass-78/dl/*.txt`. Reruns in `/tmp/ref_tnr/`.

Verdict: **holds = false as labelled** (two PROVED/"unchanged" statements do not survive); the core obstruction and
Proposition N at the residue point do survive. No abscissa is claimed, so there is no optimisation to re-solve.

## Confirmed

* Twin (q = 3, c = 2.2): FE defect 8e-26 at dps 25, zero 0.9037532 + 2.8596009i with abs F = 4e-27, delta0 =
  arccosh(1.1)/log 3, 10 heights pi(2k+1)/log 3 below 60. M_F(x)/x^0.903753 = 1.1092 (1e4), 1.8268 (1e5):
  matches the table. Parameter ranges for the five table rows are admissible (abs alpha < q).
* (7.6): a_p = alpha(p)^3 eta(p)^3, alpha(a) = a/abs(a) (paper line 516), R = a_p^2 Q^{4-6x-6z}. So
  a_p^2 = (lambda eta)^6 and R = (lambda eta)^6(p) Q^{-(6s-3)} at (w, z) = (1, 1/6). Correct.
* Proposition N: the numerator identity was re-expanded by hand from (7.11)-(7.12) at j = 0, rho = 1 and matches;
  the closed form at (1, 1/6) follows. H_eta = L^S(6s-3, (lambda eta)^6) E_eta, E_eta absolutely convergent for
  Re s > 1/2 (largest term Q^{2-6 sigma}), per-prime absolute bound stops at 2/3. Correct.
* Weight 7, level 3 CM form: coefficients and first zero gamma' = 6.5102066 reproduced (sign change, two
  different splitting parameters). Normalizer zeros at 7/12 + i gamma'/6 follow (E_eta converges at 7/12).
* Proposition T (a) and the upper bounds in (b): correct.
* Non-binding at 0.8749 and 13/15: correct (2/3 < 13/15), given bypass-78's description.

## Errors

1. **Laurent twin (Section 1, "everything in Sections 2-4 applies to it unchanged"): false for the measured case.**
   p = 2, e = 0.2 has its zero at Re s = 2.7604 (twin.json), outside the critical strip and to the right of the
   contour Re s = 2 of (2.3). The function is not an ordinary Dirichlet series (term p^{s-1/2}); 1/(1 + e(Y + 1/Y))
   on Re s = 2 has abs Y = 0.354 between the roots 0.209 and 4.79, so the expansion is a two-sided Laurent series
   and Prop T (a) ("converges absolutely on Re s = 2 because abs alpha < q") does not apply. Zeros inside the
   strip need 1/(p^{1/2} + p^{-1/2}) < e < 1/2 (p = 2: 0.471 < e < 0.5). The claim "Laurent variant ... 10 zeros /
   same structure" must be restricted to that range or dropped.
2. **Proposition T, "Hence" sentence and (c): localisation to (2.4) not proved.** When beta*(zeta family) <= beta_F
   (the case (c) assumes), bound (b) gives T[J - f] = O(Z^{C(beta_F)}), the same order as the main term of T[f]
   and with no saving against C(beta*_twin) = C(beta_F). So (i) hypothesis (2.5) also fails for the transferred
   pair (no sigma' > 0), and (ii) "the exponents in (b) cannot be lowered" is proved for T[f] only, not for
   T[J] = T[f] + T[J - f] (cancellation between two terms of equal order is not excluded). "Hold exactly when
   sigma0 + omega >= beta_F" is not established in the "if" direction (log factor at equality; (2.5) saving
   missing). What is proved: the transferred pair cannot satisfy (2.4) and (2.5) together with omega < Delta0,
   which already follows from Prop 2.1 and the existence of the twin zero. The statement "the failure in feeding
   (ii) is in the direct bound (2.4)" should read "(2.4) and (2.5) both lose; which one is not determined".
   Minor: (c) moves the contour through H_eta, holomorphic only on Re s > sigma0, so it needs beta_F - eps > sigma0;
   for c > 0 the period in log Z is 2 log q, not log q; the coefficient omits the non-zero factor (1 - q^{-rho}).
3. **"Fails at one place, and only there" is labelled PROVED in the claim; in the note it is ARGUED.** Feeding (i)
   low side, the S2/S4 rows of the step table and the DH / sign-twist rows were not replayed (the note says so in
   Section 5). The exclusivity statement is a structural reading, not a proof.
4. **General (x, w, z) region (Section 3, "x + z > 5/6 replaced by x + z > 2/3"): false for w_r < 1/2.** The note's
   own numerator contains -R W^2 (1 - V), of size Q^{4-6x-6z-2w}; absolute convergence of the residual product
   needs 6x + 6z + 2w > 5 as well. In region (7.14) (w_r >= -1/100) this gives back x + z > 5/6 + 1/300. The
   statement is correct at w = 1 and for w_r >= 1/2. Strengthening proposal item 1 needs this restriction; for
   u != 1 the other J_j terms were not examined.
5. Scope: in the manuscript S contains every prime of norm <= P0 with P0 large (10.2), and 3 is ramified in
   Q(sqrt(-3)). The tabulated twins (q = 2, 3, 5, 7) are therefore always inside S; feeding (i)/(ii) with q
   outside S needs q > P0. This does not change the conclusion; it means only the S0/S6 reading is literal for
   the measured examples.

## Is the obstruction avoidable?

The obstruction itself (F = zeta times one local factor passes every global step) is close to a tautology and
stands. A way to make T-NR-type controls informative: put the non-tempered local factors at infinitely many
primes (or at a set growing with the scale), so that they cannot be absorbed into S; such objects lose the
functional equation unless built from a non-tempered automorphic-type family, which is where a real test would
sit. A second route: apply the single-prime twin to mechanisms that take "Euler product + FE + pole" as abstract
hypotheses (g-passive-cascade, stack-combinator table), where a deleted set S is not available.

## Surviving statement

MEASURED: the Dirichlet twin zeta D_q has FE and the stated off-line zeros. ARGUED: the 7/8 argument excludes it
through abs(eta(p)) = 1 (Section 2 deletion sentence; Lemma 7.1 size bounds), a local hypothesis, so the twin
does not locate the binding arithmetic. EXACT: H_eta(s) = L^S(6s-3, (lambda eta)^6) E_eta(s) at the principal
residue point, E_eta absolutely convergent for Re s > 1/2; per-prime bounds stop at 2/3; zeros at
7/12 + i gamma'/6 (first 1.0850 for eta = 1). No abscissa moves.
