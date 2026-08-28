# Aristotle / Lean formalization target ledger

Ranked (value × feasibility) list of formalizable targets across the project,
compiled 2026-08-28 by a corpus-wide scout. E = exact/unconditional statement;
C = conditional implication (machine-check the logic; antecedent stays open).

**In flight (wave 1, submitted 2026-08-27 via the dbn audit session pipeline;
projects ba4468a2, cc9ccae7, 7f037bfe, a9a5af2e, db03b70f):** permutation-defect
lemma · anti-Hermitian strip bound · five-shell identity E97 · §4.7 implication
chain (consuming the kernel-verified rectangle argument principle, audit-repo
PR #30) · twistor Lemma 6.1. Already verified: the frozen-rung set
(lean-aristotle/frozen-rung/), the DBN base case, RealRootedPreservation.lean.

## Wave 2 (ranked)

1. **`newton_inequality` sorry** (E, low) — e_k² ≥ e_{k−1}e_{k+1} for real-rooted p;
   already STATED in lean-mathlib-probe/HeatCorollaries.lean:191 (1 of 2 sorrys in
   the tree); proof = iterated differentiation (banked) + degree-2 discriminant.
2. **Θ-trap core package** (E, med) — dg/ds = −(4/g)(1−Θ) exact; dΘ/ds identity;
   Theorem A (Θ≤1/4 invariant, sharp); Corollary A1/E1 (t_c ≤ g²/(8(1−Θ*))).
   src/data/sg1-theta-contraction.js + sg1c-theta-trap-theorems.js (proofs in source).
3. **Heat-discriminant ODE S4-1/S4-2** (E, low-med) — d/ds log Disc = −8Σ 1/(x_i−x_j)²
   + the vanishing symmetric triple-sum lemma. imp-2563-discriminant-tc-characterization.js (QED in source).
4. **Exact finite-N Burgers/heat identity** (E, low-med) — ∂_s M = ∂_z²M − 2M∂_zM exactly;
   monic P satisfies forward heat eq ⇒ finite Taylor sum. Bridges to RealRootedPreservation heatOp.
5. **Crossover all-orders sign induction imp-34880** (E, low) — P_{n+1} = nuP_n+(2n−1)P_n−uP_n′,
   positivity via multiplier (2n−1−k) ≥ n; boundary forms (n−1)!, (2n−3)!!. Prose QED in source,
   never machine-executed (numerics double-inexact past n=15).
6. **Lemma R1-FN sharp excursion cap** (E, low-med) — Θ ≤ 1−2/N sharp, exact Θ_max(N),
   balanced-lattice maximiser. sg1c-theta-trap-theorems.js:844 (full static proof).
7. **Min-gap sandwich Theorem B + s=0 β-discharge** (C, med-high) — two-sided t_c pinch
   under βg²<2; the s=0 telescoping bound is exact. Isolates the open imp-2683 residual.
8. **Theorem B sharp trap threshold (√73−5)/8** (E, med) — capped-greedy Schur-convex
   majorization + one-variable boundary algebra; sharp.
9. **Isolation-onset closed forms** (E, low-med) — R2-T sign law; c* = √(2+√3)−1 as the
   unique (0,1) root via u = ρ²+2ρ ⇒ u²−2u−2 = 0. (Class theorem; c_glob stays open.)
10. **Ramanujan-reversal identity imp-35068** (E, low-med) — P_n(u) = u^{n−1}R_n(1/u) for all n
    (currently numeric n≤12); corollary row sum P_n(1) = n^{n−1} (Cayley). Upgrades an
    identification to a theorem + closes the unproved row-sum conjecture.
11. **Jet-lemma corollary** (E, low-med) — e^{−sD²}x^{2m} = scaled Hermite (2m simple real
    roots, s>0; none s<0); mostly free from HeatCorollaries hermiteReal results.
12. **Flow-blindness SL2 no-go package** (C on Rodgers–Tao, med-high) — soft-class closure of
    Φ_ε + cosine-transform = H_{−ε} identity; RT as named hypothesis (hRT pattern exists).
13. **`MaxModulusGrowthFromOrder` discharge** (E, low) — order ≤ σ ⇒ M_f(R) ≤ exp(R^{σ+ε});
    EReal/limsup unwinding; makes coefficientOrder_le_order unconditional.
14. **Gilbreath lemma package** (E, low) — mod-2 binomial-transform lemma + row propagation +
    finite lock certificate. src/math/gilbreath.js (complete proofs in source).
15. **Shear-Gram norm identity imp-3343** (E, low-med) — ‖G‖_HS = √2‖G‖_op for rank-2
    antisymmetric + Volterra half-mass ⇒ ‖V‖_HS = ‖G‖_op (state finite-dimensionally).

## Do not attempt (per formalization triage)
Jensen/Hadamard/argument-principle-from-scratch (superseded by the verified rectangle
argument principle), H5′ heatOp approx (needs full Hadamard stack; naive route provably
dead per HeatFlowCounterexample.lean:191), Ξ/H_t construction, Rodgers–Tao Λ≥0 itself,
de Bruijn Thm 13 itself, Koksma–Hlawka (absent from mathlib, heavy).

## Repo flags raised by the scout (fixed alongside this ledger)
- imp-35068's `isRigorous: true` means exact-integer-arithmetic n≤12, NOT all-n — clarified in-module.
- POLYNOMIAL_DE_BRUIJN.md:88 wrote the flow as forward convolution Ξ∗G_t; ENTIRE_ROADMAP.md:108
  and imp-34813 fix the sign — corrected to the ENTIRE_ROADMAP convention.
