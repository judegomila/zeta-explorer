# Summary of changes for run ee38c46e-d08f-42b4-bc34-d9eaa6192125
I formalized `job18_heat_discriminant_ode.tex` in Lean 4 / Mathlib. Everything lives in `RequestProject/Main.lean`, which builds cleanly with no `sorry` and no non-standard axioms (all results depend only on `propext`, `Classical.choice`, `Quot.sound`).

**Setup.** Positions are `x : ℝ → Fin N → ℝ`; `pairsLt N` indexes pairs `i < j`; `disc y = ∏_{i<j} (y i - y j)^2`. The flow `dx_k/ds = -2 ∑_{j≠k} 1/(x_k - x_j)`, `C¹` regularity (as `HasDerivAt` hypotheses) and the no-collision condition (as injectivity of `x s`) are explicit hypotheses, exactly as the source note requests.

**Results proved.**
1. `sum_inv_triple_eq_zero` (Lemma 0): for pairwise distinct reals, `∑_{(i,j,l) pairwise distinct} 1/((y i - y j)(y i - y l)) = 0`, proved by cyclically rotating each triple and using the partial-fraction identity.
2. Lemma S4-1 in all four requested shapes:
   - `hasDerivAt_log_disc_flow_G`: `d/ds log Disc = -∑_k ẋ_k²` (form (G));
   - `hasDerivAt_log_disc_flow_S`: `d/ds log Disc = -8 ∑_{i<j} 1/(x_i - x_j)²` (form (S));
   - `hasDerivAt_disc_flow_G` / `hasDerivAt_disc_flow_S`: the logarithm-free equivalents `Disc' = Disc·(…)`.
   Supporting algebraic identities are isolated as `sum_pairsLt_speed` (symmetrization plus the ODE gives minus the kinetic energy) and `sum_sq_speed` (kinetic energy `= 8 ∑_{i<j} 1/(x_i-x_j)²`, where the off-diagonal triples cancel by Lemma 0).
3. `strictAntiOn_disc` (Corollary S4-2): for `N ≥ 2`, on any convex set of times where the solution is differentiable, satisfies the flow and has pairwise distinct positions, `s ↦ Disc(x s)` is strictly decreasing.
4. `collisionTime_eq_sInf`: the optional continuation — given a discriminant function agreeing with `Disc` on `[0, t_c)` and vanishing at `t_c`, `t_c` is the least, hence the infimum of the, positive zero.

**Non-vacuity check.** To confirm the hypothesis set is satisfiable, I added the explicit solution `twoParticle s = (-√(1-2s), √(1-2s))`, verified that it satisfies the differentiability, distinctness and flow hypotheses, and derived from the general theorems that its discriminant equals `4(1-2s)`, has derivative `-8`, and is strictly decreasing on `(-∞, 1/2)`.
