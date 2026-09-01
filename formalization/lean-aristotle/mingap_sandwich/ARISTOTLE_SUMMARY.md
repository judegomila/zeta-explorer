# Summary of changes for run 113dab82-f18d-4faf-9b73-8dda4f399e10
I formalized `job26_mingap_sandwich.tex` in Lean 4 / Mathlib, in the new file `RequestProject/MinGapSandwich.lean` (~680 lines). The project builds cleanly with no `sorry`, no `axiom`, and every result depends only on the standard axioms (`propext`, `Classical.choice`, `Quot.sound`).

**Setup (the standing hypotheses, made explicit as the source asks).**
- `MinGap.IsCMFlow N tc x` — a strictly ordered C¹ solution `x₁(s) < … < x_N(s)` on `[0, tc)` of the attractive Calogero–Moser flow `dx_k/ds = -2 ∑_{j≠k} 1/(x_k - x_j)`, with `x : ℕ → ℝ → ℝ` and fields `hasDeriv`, `ordered`.
- `MinGap.bgStatic N y lo hi` — the background field `B = ∑_{j≠lo,hi} 1/((y_hi - y_j)(y_lo - y_j))`.

**Results proved.**
1. *Exact gap ODE* (`IsCMFlow.hasDerivAt_gap`, `IsCMFlow.hasDerivAt_gapSq`): for any pair `lo < hi` (adjacency not needed), `r' = -4/r + 2rB` and, with `u = r²`, `u' = -8 + 4Bu`.
2. *Theorem B, the min-gap sandwich* (`minGap_sandwich`): under the named hypotheses `h_β` (a bound `β` on `|B_p|` over all adjacent pairs and all times), `h_gate` (`βg² < 2`) and `h_tc`, the two-sided pinch `T₋ ≤ tc ≤ T₊` with the exact closed forms `T₋ = (1/(4β))·log(1 + βg²/2)` and `T₊ = (1/(4β))·log(2/(2 - βg²))`. The upper bound tracks the fixed initially-minimal pair, as flagged in the source; the lower bound is obtained by running the comparison pair by pair (the differential inequality `u' ≥ -8 - 4βu` holds for every adjacent pair with the same constants), which yields the bound for the running minimum without needing Dini derivatives. Two general Grönwall-type comparison lemmas (`gronwall_le`, `gronwall_ge`) were built for this.
3. *Optional corollary* (`Tplus_le`): `T₊ ≤ g²/(8(1 - βg²/2))`.
4. *Unconditional static s = 0 discharge*: `bgStatic_term_pos` (positivity — no particle lies between a minimal adjacent pair), `bgStatic_nonneg`, `bgStatic_telescope_bound` (the telescope `B ≤ (1/G²)((1 - 1/(lo+1)) + (1 - 1/(N-lo-1)))`, i.e. the asymmetric-flank form of the source's symmetric-K statement), and `bgStatic_mul_sq_lt_two` (`B·G² < 2`, uniformly in `N`).

**Formalization choices worth noting.**
- `β > 0` is an explicit hypothesis of Theorem B: with `β = 0` the closed forms `T±` are not meaningful.
- `h_tc` is used through the consequence of `liminf_{s→tc⁻} g_min(s) = 0` that the minimal gap becomes arbitrarily small somewhere on `[0, tc)`; this is a weaker hypothesis, so the theorem proved is correspondingly stronger.
- The `sup_s` gate at positive times is left as a hypothesis and is not discharged, exactly as the source instructs; this is recorded in the file header.
- To rule out a vacuous reading, I added the explicit two-particle solution `twoParticle g` (`x₀ = -√(g²-8s)/2`, `x₁ = √(g²-8s)/2`, collision time `g²/8`), proved it is a Calogero–Moser flow, proved it satisfies every hypothesis of Theorem B (`twoParticle_satisfies_sandwich_hypotheses`), and instantiated the sandwich at it (`twoParticle_sandwich`).

The original `.tex` source is untouched; all work is committed and pushed.