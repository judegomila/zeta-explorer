# Summary of changes for run 5dfe51ad-0837-474a-8c4e-4c329118c165
Formalized `job19_burgers_heat_identity.tex` in Lean 4 / Mathlib, in the new file `RequestProject/BurgersHeat.lean` (builds cleanly, no `sorry`, only the standard axioms `propext`, `Classical.choice`, `Quot.sound`).

Setting (definitions):
- `BurgersHeat.Pf p z s = (p s).eval z`: a time-dependent polynomial `p : ℝ → ℝ[X]` evaluated at `z`.
- `BurgersHeat.IsHeatFlow N p`: `(p s).natDegree ≤ N` for all `s`, every coefficient `s ↦ (p s).coeff i` differentiable, and the forward heat equation `∂_s P = ∂_z² P` (all derivatives are `deriv`).
- `BurgersHeat.Mf p z s = -(∂_z P)/P`, i.e. the Cauchy transform with the source's flagged sign convention `M = -P'/P`.
- `BurgersHeat.heatOp t q = ∑_k ((-t)^k/k!) • D^{2k} q`, the de Bruijn (anti-diffusive) heat operator `e^{-tD²}` on polynomials.

Results proved:
- `BurgersHeat.burgers_identity` (Theorem 1): for any heat flow and any `(z,s)` with `P(z,s) ≠ 0`, `∂_s M = ∂_z² M - 2 M ∂_z M`, exactly as displayed (with the `-2M ∂_z M` sign matching `M = -P'/P`).
- `BurgersHeat.taylor_representation` (Theorem 2): `p s = ∑_{m ≤ N/2} (s^m/m!) • D^{2m}(p 0)`, a finite sum, proved by a telescoping argument showing that `σ ↦ ∑_m ((s-σ)^m/m!) D^{2m}P(·,σ)` has vanishing derivative.
- `BurgersHeat.taylor_representation_heatOp` (Corollary): the same finite sum is `heatOp (-s) (p 0)`.
- `BurgersHeat.isHeatFlow_sq_add`: `P(z,s) = z² + 2s` is a heat flow of degree bound 2, confirming the hypotheses are satisfiable (non-vacuity).

Supporting lemmas (coefficient form of the heat equation, `∂_s D^k P = D^{k+2} P`, and the first/second `z`-derivatives and `s`-derivative of `M`) are also proved in the file.

Deviations from the source text, documented in the file's module docstring: the interval `I ∋ 0` is taken to be all of `ℝ` (hypotheses imposed for all `s`), and the monic-degree-`N` assumption is weakened to the uniform degree bound `natDegree (p s) ≤ N` that the proofs actually use. The optional auxiliary particle-flow equivalence, described in the source as not the core target, was not formalized.