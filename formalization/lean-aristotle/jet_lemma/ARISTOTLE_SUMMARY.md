# Summary of changes for run f04e50cc-d1de-4c41-ace1-80de0206c8d0
I formalized the jet-lemma note (`job28_jet_lemma.tex`) in Lean 4 / Mathlib. Everything builds with no `sorry` and all results depend only on the standard axioms (`propext`, `Classical.choice`, `Quot.sound`).

Since the note's "banked" `HeatCorollaries` results were not present in this project, I rebuilt the whole development from scratch, in three files:

**`RequestProject/HeatOp.lean`** — the operator and its algebra.
- `heatOp s p = ∑ₖ (-s)^k/k! · (d/dx)^{2k} p`, i.e. `e^{-sD²}` on `ℝ[X]` (a finite sum). The sign convention is pinned down and verified: `heatOp t (X² - 1) = X² - (1 + 2t)`.
- `hermiteReal n` = mathlib's probabilist Hermite `Polynomial.hermite n` cast to `ℝ`, and `HasOnlyRealRoots p := (card p.roots = p.natDegree)`.
- Basic laws: sum-range independence, additivity, `C`-linearity, commutation with `d/dx`, the commutator identity `e^{-sD²}(x·q) = x·e^{-sD²}q − 2s·D e^{-sD²}q`, the heat-semigroup scaling law `e^{-sD²} ∘ Σ_c = Σ_c ∘ e^{-s c² D²}`, and `heatOp (1/2) xⁿ = Heₙ`.

**`RequestProject/HermiteRoots.lean`** — the genuinely new mathematical content: `hermiteReal n` splits over `ℝ` into `n` *distinct* linear factors (`hermiteReal_eq_prod_X_sub_C`). This is proved by the classical sign-alternation induction along `He_{n+1} = X·He_n − He_n'`: the derivative's sign at the `i`-th root is computed as `(-1)^{n-1-i}`, the two outer roots are produced from the behaviour of a monic polynomial at `±∞`, and the interior ones from the intermediate value theorem; the resulting `n+1` distinct roots force equality with the product of linear factors by a degree/monicity argument.

**`RequestProject/JetLemma.lean`** — the three targets.
- **J1** `heatOp_X_pow_eq_scaled_hermiteReal`: for `s > 0` and `c = √(2s)`, `e^{-sD²}xⁿ = cⁿ · Heₙ(x/c)`.
- **J2** `heatOp_X_pow_two_mul_card_roots`: for `s > 0`, `e^{-sD²}x^{2m}` has exactly `2m` distinct real roots, is `Squarefree`, and has only real roots. (Stated with the note's hypothesis `1 ≤ m`, which the proof does not actually need; noted in the docstring. General-exponent versions `heatOp_X_pow_card_roots`, `heatOp_X_pow_squarefree`, `heatOp_X_pow_eq_prod` are also provided.)
- **J3** `eval_heatOp_X_pow_two_mul_pos`: for `s < 0`, `e^{-sD²}x^{2m}` is strictly positive at every real point, with the corollary `heatOp_X_pow_two_mul_no_real_roots` that its root multiset is empty.
- The note's other quoted results are reproved here as well: `hasOnlyRealRoots_heatOp_X_pow` (for `s ≥ 0`, including `s = 0`), `hermiteReal_hasOnlyRealRoots`, `hermite_map_hasOnlyRealRoots`, `heatOp_half_X_mul`, plus the explicit expansions `heatOp_X_pow_eq_sum`, `eval_heatOp_X_pow` and the note's `m = 2` example `e^{-sD²}x⁴ = x⁴ − 12s x² + 12s²`.

All work is committed and pushed.