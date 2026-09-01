# Summary of changes for run 493db694-2fe8-4000-b933-8a23731fcdd4
Formalization of `job27_trap_threshold.tex` is complete: the whole development builds with `lake build` and contains no `sorry`, `admit`, or added axioms (`#print axioms` on every headline result reports only `propext`, `Classical.choice`, `Quot.sound`).

The `theta_trap` project referenced by the source document was not present, so the entire vocabulary was rebuilt from scratch. Four modules under `RequestProject/`:

- **`Static.lean`** — the constants `Θ_b = (√73−5)/8` and `r_b = (√73−7)/4`, the boundary-rate functional `rate s μ = −4S + S² + 6∑μ² + 2∑μ³`, and the constant/root lemmas relating them.
  - **S1 (static core)** `rate_nonpos_of_sum_le`: for any finite family μ ∈ [0,1/2]^K with total mass S ≤ 2Θ_b, the boundary rate is ≤ 0. Proved by a maximal-element case split (a linear bound when 2·max ≤ S, and a capped two-part greedy bound otherwise), plus a quantitative companion `rate_le_of_sum_ge`.
  - **S3 (sharpness)** `rate_pos_of_gt_ThetaB`: for every level Θ* ∈ (Θ_b, 1/2] the admissible profile (1/2, 2Θ*−1/2) has mass 2Θ* and strictly positive rate. Complemented by `greedy_rate_formula` and `greedy_rate_nonpos_iff`, which identify the capped-greedy boundary value as r(2r²+7r−3) and show it is ≤ 0 exactly up to r = r_b.

- **`Flow.lean`** — the attractive Calogero–Moser flow (`IsCMFlow`), ordering, environment index set, environment weights `T_m`, envelope `E`, gap `g`, the trapping functional `Θ = g²E/2` and its rate `ThetaDot`.
  - **Lemma 2** `lemma2`: the exact Θ-derivative along the flow, `HasDerivAt (fun t => Θ(x(t))) (ThetaDot (x(s))) s`, obtained from a pairwise-cancellation identity for the cross terms.
  - **S2 (cap)** `cap_of_minimal_gap`: if the tracked pair realises the global minimal gap, then every normalized environment weight satisfies μ_m = g²T_m ≤ 1/2.

- **`Trap.lean`** — an abstract Grönwall-type trapping lemma, the identification `ThetaDot = rate/g²` on the normalized profile, and **Theorem B** `theoremB`: along an attractive CM flow whose tracked adjacent pair realises the global minimal gap on [s₀,s₁] ⊂ [0,t_c), every level Θ* ≤ Θ_b is trapping. The minimal-gap hypothesis is stated explicitly as a hypothesis over the interval; the borderline level Θ* = Θ_b is included, handled by the Grönwall argument (a compactness step supplies a positive lower bound on the gap).

- **`Witness.lean`** — the four-particle realizability witness {−g, 0, g, g+d₂} with tracked pair (0,g): its ordering, gap, minimal-gap property and exact value Θ = 1/4 + 1/(2·d̂₂(d̂₂+1)); `witness_threshold` shows that tuning d̂₂ = d₂/g so that d̂₂(d̂₂+1) = 1/r_b gives exactly Θ = Θ_b while keeping g < d₂, so the threshold level really is attained by an admissible configuration.

`RequestProject/Main.lean` now imports all four modules. All work is committed and pushed.