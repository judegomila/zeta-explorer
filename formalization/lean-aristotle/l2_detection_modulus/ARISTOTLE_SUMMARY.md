# Summary of changes for run 84791b13-ddb9-4095-aee7-573e3e0658c4
Formalized `job32_l2_detection_modulus.tex` in Lean 4 / Mathlib, in the `FrozenRung` namespace. Everything builds with no `sorry` and depends only on the standard axioms (`propext`, `Classical.choice`, `Quot.sound`).

**Banked interfaces.** The modules quoted in the job file were not present in the repository, so they are supplied here with the quoted signatures (transliterated identifiers restored) and are imported and used, not restated:
- `RequestProject/FrozenRung/Inertia.lean` — `negDims`, `negIndex M = sSup (negDims M)`, `gramMatrix`, boundedness of `negDims`, and the one-dimensional negative-subspace witness.
- `RequestProject/FrozenRung/Kernels.lean` — `schurKernel`, `modulus_witness` (proved), `one_le_negIndex_gram_of_modulus_gt_one` (proved).

**Target 1 (unconditional), `RequestProject/FrozenRung/Detection.lean`.**
- `detection_radius_robust`: with `M₁` bounding `‖X'‖` on the closed `r`-disk about `λ₀-2a` and `‖X‖ ≤ M₂ r^{m₀}` on the circle `|ζ-λ₀| = r`, the inequality `‖X(z+a)‖ < ‖X(z-a)‖` holds on the closed disk of radius `detectionRadius = min(r, v₀/(2(M₁+M₂)))` about `α₀ = λ₀ - a`. The proof is the source's: mean value inequality for the numerator, maximum principle applied to `g(h) = X(λ₀+h)/h^{m₀}` for the denominator.
- `detection_radius`: the ratio form `1 < ‖R_a z‖` under `X(z+a) ≠ 0`, together with `Re α₀ > 0`.
- `one_le_negIndex_gram_of_detection`: the composition endpoint, concluding `1 ≤ negIndex (gramMatrix (schurKernel Θ) zs)` for `Θ = fun w => X (w-a) / X (w+a)` via the banked theorem.

**Target 2 (conditional), `RequestProject/FrozenRung/L2Conditional.lean`.** Hypothesis (ZR) is a named structure `ZeroRepulsion` and is used only as a hypothesis — nothing in the project proves or absorbs it. With `StripBound` (`𝓑(T)`), `rho0 η B = min(1, η/(4B))`, `meshLattice` (offset square lattice in `{0 < Re w ≤ 1/2, |Im w| ≤ T}`) and `Ghost` (a zero in the box with its multiplicity factorisation `X ζ = (ζ-λ)^m g ζ`):
- `exists_meshLattice_point_near`: lattice covering with boundary clamping;
- `l2_conditional`: given (ZR), every ghost configuration is detected — some `a ∈ A` and some mesh point `ẑ` satisfy `‖X(ẑ+a)‖ < ‖X(ẑ-a)‖` — whenever the spacing satisfies `2s ≤ ρ₀`;
- `l2_conditional_negIndex`: the endpoint, giving `1 ≤ negIndex` of the Schur Gram matrix at some level `a ∈ A`.

No uniform spectral-margin (`λ_min < -η`) statement is attempted, per the source's refutation of that route.

**Non-vacuity.** `RequestProject/FrozenRung/Examples.lean` exhibits an entire function that simultaneously satisfies (ZR), the strip bound, and carries a ghost, and instantiates `l2_conditional` on it, so the Target 2 hypothesis package is demonstrably satisfiable.

**Documented deviations** (all listed in `FROZENRUNG_NOTES.md` and in the file docstrings): the division-safe robust inequality (as the source recommends); `M₁, M₂` taken as upper bounds rather than suprema; multiplicity via the prescribed factorisation; `a > 0` and the puncture `0 < ‖z-α₀‖` dropped in Target 1 as unnecessary (`M₁ > 0` and `Re λ₀ > a` are kept and are load-bearing); the strip widened from `|Re ζ| ≤ 3/2` to `|Re ζ| ≤ 2` so that the disks used by Target 1 actually lie inside it; mesh spacing `s ≤ ρ₀/2`, the halving absorbing the clamping of lattice points at the box boundary.