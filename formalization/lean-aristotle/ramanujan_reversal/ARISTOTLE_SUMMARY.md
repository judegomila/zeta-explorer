# Summary of changes for run 9b5a1d1b-705f-462b-bfcf-93f6de88a91c
`job20_ramanujan_reversal.tex` is fully formalized in Lean 4 / Mathlib. The whole project builds with no `sorry`, and every result depends only on the standard axioms `propext`, `Classical.choice`, `Quot.sound`.

**Definitions** (`RequestProject/Triangle.lean`, namespace `RamanujanReversal`)
- `crossoverPoly R n` — the triangle `P_n` via `P_1 = 1`, `P_{n+1}(u) = (n u + (2n-1))P_n(u) - u P_n'(u)`; `crossoverPoly_two` confirms the source's base row `P_2 = 1 + u`.
- `ramanujanPoly R n` — `R_1 = 1`, `R_{n+1}(x) = n(1+x)R_n(x) + x^2 R_n'(x)`.
- `crossoverCoeff n k = a_k^{(n)}` and `ramanujanCoeff n j = r_j^{(n)}` over ℤ (`RequestProject/Main.lean`); out-of-range entries are `0`, proved as `crossoverCoeff_eq_zero` / `ramanujanCoeff_eq_zero`. The coefficient recurrences of the source are recorded as `crossoverCoeff_recurrence(_zero)` and `ramanujanCoeff_recurrence(_zero)`, and `crossoverPoly_three` / `ramanujanPoly_three` check row 3 (`P_3 = 3+4u+2u²`, `R_3 = 2+4x+3x²`).

**The four requested theorems** (all in `RequestProject/Main.lean`, each stated for all `n`, no `n ≤ 12` restriction)
- `theorem_1_reversal` : `a_k^{(n)} = r_{n-1-k}^{(n)}` (proved for all `n ≥ 1`), plus the equivalent polynomial form `theorem_1_reversal_reflect` : `P_n = reflect_{n-1} R_n`.
- `theorem_2_ramanujan_value` : `R_n(1) = n^{n-1}`.
- `corollary_1_row_sum` : `P_n(1) = n^{n-1}`.
- `corollary_2_subleading` : `a_{n-2}^{(n)} = (n-1)·(n-1)!`.

**Theorem 2 is proved, not cited.** Mathlib has no Cayley/Lagrange-inversion result usable here, so the required theory was built from scratch:
- `RequestProject/AbelIdentity.lean` — Abel polynomials and Abel's binomial theorem (`abelSum_eq`), then the convolution identity `(n-1)u_n = Σ_{i<n} (n-i) u_i u_{n-i}` for `u_n = n^{n-1}/n!`.
- `RequestProject/TreeSeries.lean` — the tree function in `ℚ⟦X⟧`, its ODE `X(1-T)T' = T`, the identity `X^n(1-T)^{2n-1} D^n T = T^n P_n(1-T)`, and hence `P_n(1) = n^{n-1}` over ℚ.
- `Main.lean` transfers this to ℤ and derives `R_n(1)` from it through Theorem 1.

Also included is the auxiliary fact from the source that makes "reversal" well-formed: `ramanujanCoeff_top` (`r_{n-1}^{(n)} = ∏_{i<n-1}(2i+1) = (2n-3)!!`) and `natDegree_ramanujanPoly` (`deg R_n = n-1`).