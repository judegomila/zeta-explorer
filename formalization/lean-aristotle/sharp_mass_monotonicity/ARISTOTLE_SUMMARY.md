# Summary of changes for run 28a807a7-e69b-4eb5-b4cd-81c316e138f5
I formalized `job38_sharp_mass_monotonicity.tex` in Lean 4 / Mathlib and proved everything it asks for. The project builds cleanly with no `sorry` and no extra axioms (only `propext`, `Classical.choice`, `Quot.sound`).

**Files added**
- `RequestProject/Dini.lean` — upper right Dini derivative `DiniUpper f y = limsup_{h↓0}(f(y+h)-f(y))/h` (EReal-valued), Lemma **L1**, Lemma **L3**, and the weight-peeling estimate used in L2.
- `RequestProject/Defs.lean` — the producer-exact definitions: `bt`, `lam`, `Dnum`, `qN`, `xN`, `gN`, `gammaN`, `sigmaN`, `cfun`, `cdotN`, the y-independent active set `cellSet`, `Bcoef`, `Acoef`, `Aderiv`, the two branches `u1`, `u2`, the weight `wgt`, `Fsharp`, `NumSharp`, the brackets `PhiMinus`/`PhiPlus` (verbatim shapes), and the named gates `G1`–`G4`.
- `RequestProject/Basic.lean` — positivity/differentiability/continuity of γ_N, A_{N,n}, c(γ_N(·)) and the weight, plus the (G3) weight-decay estimate `w(y') ≤ w(y)e^{-(L/2)(y'-y)}`.
- `RequestProject/Monotonicity.lean` — Lemma **L2** (`L2_minus`, `L2_plus`), the **Main Theorem** (`Fsharp_sub_gammaN_antitoneOn`, plus the displayed inequalities `Fsharp_le` and the strict form `Fsharp_lt`), and the **Corollary** (`NumSharp_monotoneOn`, `NumSharp_ge_of_anchor`).
- `RequestProject/Cells.lean` — Lemma **L4**: the cell quantities `rr`, `C0`, `Cy`, `Cy'`, the factorizations `B = b_t(n)C₀`, `A = b_t(n)e^{yL}C`, `g_NA + A' = b_t(n)e^{yL}((g_N+L)C + C')`, the cell forms of Φ⁻/Φ⁺, the active-set/sector description (`mem_cellSet_iff`, `mem_cellSet_iff_ratio`, `cellSet_upward_closed`, vanishing of empty cells), the cell count `∑_{G₀ ∣ D} τ(G₀) = 3^{|P|}`, and **Theorem 2** (`theorem2_G4`, `theorem2_conclusion`).
- `README.md` — a table mapping each source item to its Lean name, plus the formalization notes below.

**Formalization notes**
- The setup assumption `q_N = N² − t/16 > 0` appears explicitly as `hq : 0 < qN t N` where used; no numeric constants are baked in — `t`, the prime set `P` and `[ylo, yhi]` are arbitrary and all numeric content stays inside the gates, which are hypotheses.
- L1 is proved without the continuity hypothesis stated in the source (it is not needed).
- The Main Theorem is obtained by proving each weighted summand `max(u₁,u₂)·w` nonincreasing (L1 + L2 + (G4) + L3) and then summing, instead of bounding the Dini derivative of the finite sum; the conclusion is identical.
- Gate (G2) is not used for `F♯ − γ` being nonincreasing; it enters only in the second displayed inequality and in the strict form.
- In Theorem 2 a cell is indexed by its active set `S = 𝒟_{N,n}` (equivalently gcd mask plus ratio sector, by `mem_cellSet_iff_ratio`); the region family `R` is not constrained to `{L>0, y ∈ I, 0<γ<1, g<0}`, which only strengthens the statement.