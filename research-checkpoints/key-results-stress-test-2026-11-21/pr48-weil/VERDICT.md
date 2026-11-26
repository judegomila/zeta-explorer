# Verdict: pr48-weil

Listed claim: "The PR-48 residual target equals the Weil functional (Lean-formalised)."

## Statement that holds
Let F(w) = xi(1/2+w), L = F'/F, x_1..x_N distinct reals > 1/2, b_j complex, v(t) = sum b_j e^{-x_j t}, V(z) = sum b_j/(z+x_j).

1. Identity (proved in notes, checked by two AI referees, not in Lean).
   E_gamma(v) - 2 c0 ||v||^2 - 2 Re int_0^inf M(l) C_v'(l) dl = sum_{i,j} b_i conj(b_j) (L(x_i)+L(x_j))/(x_i+x_j) = sum_rho V(rho) conj V(-conj rho).
   The right side is the zero side of the Weil explicit formula for h = g * g~ with g = v on [0, inf), 0 elsewhere.
   So PR-48 inequality (21) for a given v is the statement W(g) >= 0 for that one-sided exponential test.
2. Lean (Lean 4.22 / Mathlib, no sorry, standard axioms). For Mathlib's xi: "every Schur defect of the Pick matrix is >= 0 whenever the smaller Pick matrix is positive definite (empty node set included)" is equivalent to "every real-node Pick matrix with nodes > 1/2 is positive semidefinite" (`Eq48.xi_theorem2`).
3. Equivalence with RH: proved in notes. In Lean only conditionally, with two hypotheses that are not formalized (off-line zero gives a negative test; Hadamard pairing under RH).

## What is wrong with the listed wording
- The Lean files do not contain the Weil functional, E_gamma, the compensated prime count, or the explicit formula. "Lean-formalised" applies to item 2, not to "equals the Weil functional".
- The Lean residual target is the Pick-side Schur defect, not inequality (21). The link between the two is item 1.
- The test functions are one-sided exponentials, not compactly supported smooth functions; "Weil functional" means the absolutely convergent zero-side sum.

Suggested wording: "The PR-48 residual inequality is the Weil explicit-formula quadratic form on one-sided exponential test functions (proved in notes; numerically checked to 1e-33). Its Schur-residual form is equivalent to positivity of all real-node Pick matrices of xi'/xi (Lean-checked). Both are equivalent to RH (notes)."

## Replay
- Lean: all 7 files plus my own pinning file compiled against the existing Mathlib build; 0 errors; axioms [propext, Classical.choice, Quot.sound] for all 29 audited theorems; unfolded statement of `xi_theorem2` accepted.
- Numerics (own script, 40 digits, 6 nodes, complex coefficients, primes to 3e5, 600 zeros):
  PR-48 side vs Pick form: 7.7e-34, 5.9e-33, 7.5e-33 (original: 1.4e-10).
  Textbook Guinand-Weil form (pole terms + digamma integral - primes) vs Pick form: same size.
  Zero sum vs Pick form: 8.4e-18 and 2.2e-22 with fast-decaying tests; 3.3e-4 with a slowly decaying test, consistent with an O(1/gamma_600) tail.

## Stress
- Removing the pole part changes the value by 1.7e-3 and removing primes by 4.1e-5, so the agreement is sensitive to each term.
- Control: the same identity holds for L(s, chi_4) with chi_4(n) Lambda(n) to 4.4e-36. The identity is the explicit formula and does not distinguish zeta. The Lean equivalence is parametric in L and applies equally to Davenport-Heilbronn (earlier referee: DH Schur defects positive at orders 6 and 8).
- No circularity, tuned constant or normalisation slip found. The split of terms into "E_gamma" and "prime forcing" depends on a chosen anchor (5/4) and compensator; the total does not.
- Carried corrections: the margin version (theta < 1) is refuted only on the full exponential class, not on Schur residuals; the single-sequence variant needs all prefixes positive definite.

## Literature
RH <=> Re xi'/xi > 0 on Re s > 1/2 (Hinkkanen 1997; Lagarias 1999), which by the Caratheodory/Pick kernel theorem is positivity of (L(z)+conj L(w))/(z+conj w); Weil's criterion (Weil 1952; Bombieri 2000); Li's criterion as Weil positivity on rational-transform tests (Bombieri-Lagarias 1999); Suzuki's screw function (arXiv:2206.03682). The identity is a restatement of the explicit formula on a specific test class. The real-node Pick kernel and the Schur-residual reduction were not found stated in this form in 5 searches; no full papers were opened.

## Scores
- Arbitrariness 2/5. The identity and the Pick kernel are canonical. The "residual target", E_gamma and the anchored split are project objects.
- Importance 2/5. Consequence: the residual-energy lane, the Pick-preservation lane, Weil positivity and Suzuki positivity are one RH-equivalent target, so that lane has no advantage over RH. No information on zeros, no bound on the de Bruijn-Newman constant. A specialist would read it as the explicit formula plus a known positivity criterion.
- Status: identity proved in notes, unrefereed externally; Pick/Schur equivalence Lean-checked.
