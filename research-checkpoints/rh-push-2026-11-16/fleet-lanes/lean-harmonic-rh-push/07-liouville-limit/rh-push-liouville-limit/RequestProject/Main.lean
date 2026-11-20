import Mathlib

/-!
# The Liouville torus point: `∑ λ(n) n^{-s} = ζ(2s)/ζ(s)`, zero at `s = 1`, negative on `(1/2, 1)`

`λ(n) = (-1)^{Ω(n)}` is the Liouville function (the completely multiplicative function with
`λ(p) = -1`, i.e. all prime phases equal to `π`).
-/

open Filter Topology

noncomputable section

/-- Liouville function as a complex sequence. -/
def liouvilleC (n : ℕ) : ℂ := (-1 : ℂ) ^ (ArithmeticFunction.cardFactors n)

/-- The Dirichlet series of `λ` is absolutely convergent for `Re s > 1`. -/
theorem liouville_lseries_summable (s : ℂ) (hs : 1 < s.re) : LSeriesSummable liouvilleC s := by
  sorry

/-- `ζ(s) * ∑ λ(n) n^{-s} = ζ(2s)` for `Re s > 1`. -/
theorem liouville_lseries_mul_zeta (s : ℂ) (hs : 1 < s.re) :
    LSeries liouvilleC s * riemannZeta s = riemannZeta (2 * s) := by
  sorry

/-- `∑ λ(n) n^{-s} = ζ(2s)/ζ(s)` for `Re s > 1`. -/
theorem liouville_lseries_eq (s : ℂ) (hs : 1 < s.re) :
    LSeries liouvilleC s = riemannZeta (2 * s) / riemannZeta s := by
  sorry

/-- The continuation `ζ(2s)/ζ(s)` tends to `0` at `s = 1` (the pole of `ζ`). -/
theorem zeta_ratio_tendsto_zero :
    Tendsto (fun s : ℂ => riemannZeta (2 * s) / riemannZeta s) (𝓝[≠] 1) (𝓝 0) := by
  sorry

/-- The Dirichlet series itself tends to `0` as `σ ↓ 1` along the reals. -/
theorem liouville_lseries_tendsto_zero :
    Tendsto (fun σ : ℝ => LSeries liouvilleC (σ : ℂ)) (𝓝[>] 1) (𝓝 0) := by
  sorry

/-- On the real segment `(1/2, 1)` the limit function `ζ(2σ)/ζ(σ)` is real and negative. -/
theorem zeta_ratio_neg (σ : ℝ) (h1 : 1 / 2 < σ) (h2 : σ < 1) :
    (riemannZeta (2 * (σ : ℂ)) / riemannZeta (σ : ℂ)).re < 0 ∧
    (riemannZeta (2 * (σ : ℂ)) / riemannZeta (σ : ℂ)).im = 0 := by
  sorry

end
