/-
  EntireCauchy — the CAUCHY ESTIMATES for the iterated derivatives / Taylor coefficients
  of an entire function.

  This is *brick B2* (the coefficient/derivative half) of the months-scale
  entire-function-analysis foundation toward the Laguerre–Pólya structure theory and,
  eventually, a formalized de Bruijn–Newman `Λ`.  It sits directly on top of
  `EntireOrder.maxModulus` (brick B1) and is the standard majorant

      ‖f^{(n)}(0)‖ ≤ n! · M_f(R) / Rⁿ         (Cauchy estimate),
      ‖aₙ‖ = ‖f^{(n)}(0)/n!‖ ≤ M_f(R) / Rⁿ    (Cauchy coefficient inequality),

  from which the whole `order = limsup n log n / log(1/‖aₙ‖)` theory (B2), the exponent of
  convergence of the zeros (B3) and Hadamard factorization (B6) are built.

  ## Honest scope / what mathlib v4.22.0 already had

  mathlib has the Cauchy estimate for the FIRST derivative only
  (`Complex.norm_deriv_le_of_forall_mem_sphere_norm_le`, `Analysis/Complex/Liouville.lean`)
  and NO higher-order (`iteratedDeriv n`) version — verified by a full grep of
  `Mathlib/Analysis/`.  The n-th estimate below is therefore a genuine gap-fill.  It is
  assembled sorry-free from three mathlib ingredients:

  * `Differentiable.hasFPowerSeriesOnBall` — an entire function equals its Cauchy power
    series on all of `ℂ` (`Analysis/Complex/CauchyIntegral.lean`);
  * `HasFPowerSeriesOnBall.factorial_smul` — `n! • pₙ(1,…,1) = f^{(n)}(x)` linking the
    power-series coefficient to the iterated (Fréchet) derivative
    (`Analysis/Calculus/FDeriv/Analytic.lean`);
  * `norm_cauchyPowerSeries_le` — the circle-integral bound on the coefficient norm
    `‖pₙ‖ ≤ ((2π)⁻¹∫‖f∘circleMap‖)·|R|⁻ⁿ` (`MeasureTheory/Integral/CircleIntegral.lean`),
    whose integral average we dominate by the sphere-sup.

  This brick is a NECESSARY ingredient the eventual (type-controlled) proof of
  `EntireLP.heat_preserves_LP_entire` needs — NOT the (false, disproved) uniform majorant
  for the whole heat-flow series; see the counterexample in `EntireLP.lean`.  It is
  load-bearing for the B2/B3/B6 structure theory, not for the dead loc-unif-continuity route.
-/
import EntireOrder
import Mathlib.Analysis.Complex.CauchyIntegral
import Mathlib.Analysis.Calculus.FDeriv.Analytic
import Mathlib.Analysis.SpecialFunctions.Complex.CircleMap
import Mathlib.MeasureTheory.Integral.CircleIntegral

open Filter Metric
open scoped Real Topology

namespace EntireCauchy

/-- **Cauchy estimate for iterated derivatives** (general center, hypothesis bound).

For an ENTIRE `f : ℂ → ℂ`, a center `c`, a radius `R > 0`, and any bound `C` with
`‖f z‖ ≤ C` on the sphere `‖z − c‖ = R`, the `n`-th derivative at the center satisfies

    ‖f^{(n)}(c)‖ ≤ n! · C / Rⁿ.

Proof: `f` equals its Cauchy power series `p = cauchyPowerSeries f c R` on all of `ℂ`
(`Differentiable.hasFPowerSeriesOnBall`); `HasFPowerSeriesOnBall.factorial_smul` at the
all-`1` vector gives `n! • pₙ(1,…,1) = f^{(n)}(c)` (`iteratedFDeriv` = `iteratedDeriv` via
`iteratedDeriv_eq_iteratedFDeriv`); `ContinuousMultilinearMap.le_opNorm` bounds
`‖pₙ(1,…,1)‖ ≤ ‖pₙ‖`; and `norm_cauchyPowerSeries_le` bounds `‖pₙ‖` by
`((2π)⁻¹∫₀^{2π}‖f(circleMap c R θ)‖) · |R|⁻ⁿ`, whose integral average is `≤ C` by
`intervalIntegral.integral_mono_on` (comparison with the constant `C`, using
`circleMap c R θ ∈ sphere c R`). -/
theorem norm_iteratedDeriv_le_of_forall_mem_sphere_norm_le
    {f : ℂ → ℂ} (hf : Differentiable ℂ f) {c : ℂ} {R C : ℝ} (hR : 0 < R)
    (hC : ∀ z ∈ Metric.sphere c R, ‖f z‖ ≤ C) (n : ℕ) :
    ‖iteratedDeriv n f c‖ ≤ (n.factorial : ℝ) * C / R ^ n := by
  -- `C ≥ 0` : the sphere is nonempty for `R > 0`.
  have hmem0 : circleMap c R 0 ∈ Metric.sphere c R := circleMap_mem_sphere c hR.le 0
  have hCnn : 0 ≤ C := le_trans (norm_nonneg _) (hC _ hmem0)
  -- `f` is its own Cauchy power series on all of `ℂ`.
  lift R to NNReal using hR.le with R hRc
  have hRpos : 0 < R := by exact_mod_cast hR
  have hpow : HasFPowerSeriesOnBall f (cauchyPowerSeries f c R) c ⊤ :=
    hf.hasFPowerSeriesOnBall c hRpos
  -- `n! • pₙ(1,…,1) = f^{(n)}(c)`.
  have hfac : (n.factorial : ℕ) • cauchyPowerSeries f c (R : ℝ) n (fun _ => (1 : ℂ))
      = iteratedDeriv n f c := by
    rw [hpow.factorial_smul (1 : ℂ) n]
    rw [iteratedDeriv_eq_iteratedFDeriv]
  -- turn the value-norm into `n! * ‖pₙ(1,…,1)‖`.
  have hnorm : ‖iteratedDeriv n f c‖
      = (n.factorial : ℝ) * ‖cauchyPowerSeries f c (R : ℝ) n (fun _ => (1 : ℂ))‖ := by
    rw [← hfac, nsmul_eq_mul, norm_mul, Complex.norm_natCast]
  -- `‖pₙ(1,…,1)‖ ≤ ‖pₙ‖`.
  have hopn : ‖cauchyPowerSeries f c (R : ℝ) n (fun _ => (1 : ℂ))‖
      ≤ ‖cauchyPowerSeries f c (R : ℝ) n‖ := by
    have h := (cauchyPowerSeries f c (R : ℝ) n).le_opNorm (fun _ : Fin n => (1 : ℂ))
    simp only [norm_one, Finset.prod_const_one, mul_one] at h
    exact h
  -- `((2π)⁻¹ ∫ ‖f∘circleMap‖) ≤ C`.
  have hintg : IntervalIntegrable (fun θ : ℝ => ‖f (circleMap c R θ)‖)
      MeasureTheory.volume 0 (2 * π) :=
    ((hf.continuous.comp (continuous_circleMap c R)).norm).intervalIntegrable 0 (2 * π)
  have hle_int : (∫ θ : ℝ in (0)..2 * π, ‖f (circleMap c R θ)‖)
      ≤ ∫ _ : ℝ in (0)..2 * π, C := by
    refine intervalIntegral.integral_mono_on Real.two_pi_pos.le hintg
      (intervalIntegrable_const) ?_
    intro x _
    exact hC _ (circleMap_mem_sphere c hR.le x)
  have hAle : (2 * π)⁻¹ * (∫ θ : ℝ in (0)..2 * π, ‖f (circleMap c R θ)‖) ≤ C := by
    have h2pi : (0 : ℝ) < 2 * π := Real.two_pi_pos
    rw [intervalIntegral.integral_const, sub_zero, smul_eq_mul] at hle_int
    calc (2 * π)⁻¹ * (∫ θ : ℝ in (0)..2 * π, ‖f (circleMap c R θ)‖)
        ≤ (2 * π)⁻¹ * (2 * π * C) :=
          mul_le_mul_of_nonneg_left hle_int (by positivity)
      _ = C := by field_simp
  -- `‖pₙ‖ ≤ C / Rⁿ`.
  have hpn : ‖cauchyPowerSeries f c (R : ℝ) n‖ ≤ C / (R : ℝ) ^ n := by
    refine (norm_cauchyPowerSeries_le f c (R : ℝ) n).trans ?_
    have hRabs : |(R : ℝ)| = (R : ℝ) := abs_of_pos hRpos
    calc ((2 * π)⁻¹ * ∫ θ : ℝ in (0)..2 * π, ‖f (circleMap c R θ)‖) * |(R : ℝ)|⁻¹ ^ n
        ≤ C * |(R : ℝ)|⁻¹ ^ n :=
          mul_le_mul_of_nonneg_right hAle (by positivity)
      _ = C / (R : ℝ) ^ n := by
          rw [hRabs, inv_pow, ← div_eq_mul_inv]
  -- assemble.
  rw [hnorm]
  calc (n.factorial : ℝ) * ‖cauchyPowerSeries f c (R : ℝ) n (fun _ => (1 : ℂ))‖
      ≤ (n.factorial : ℝ) * ‖cauchyPowerSeries f c (R : ℝ) n‖ :=
        mul_le_mul_of_nonneg_left hopn (by positivity)
    _ ≤ (n.factorial : ℝ) * (C / (R : ℝ) ^ n) :=
        mul_le_mul_of_nonneg_left hpn (by positivity)
    _ = (n.factorial : ℝ) * C / (R : ℝ) ^ n := by rw [mul_div_assoc]

/-- **Cauchy estimate in terms of the maximum modulus** (center `0`, brick-B1 interface).

For entire `f` and `R > 0`,   `‖f^{(n)}(0)‖ ≤ n! · M_f(R) / Rⁿ`,  where `M_f(R)` is
`EntireOrder.maxModulus f R = ⨆_{‖z‖=R} ‖f z‖`.  Immediate from the general estimate: on the
compact sphere `‖z‖ = R` the continuous `‖f‖` is `BddAbove`, so each value is `≤` the sup. -/
theorem norm_iteratedDeriv_le_maxModulus {f : ℂ → ℂ} (hf : Differentiable ℂ f)
    {R : ℝ} (hR : 0 < R) (n : ℕ) :
    ‖iteratedDeriv n f 0‖ ≤ (n.factorial : ℝ) * EntireOrder.maxModulus f R / R ^ n := by
  refine norm_iteratedDeriv_le_of_forall_mem_sphere_norm_le hf hR ?_ n
  intro z hz
  -- `‖f z‖ ≤ ⨆_{sphere} ‖f‖`, using `BddAbove` from compactness of the sphere.
  have hcpt := isCompact_sphere (0 : ℂ) R
  have hbf : BddAbove (Set.range fun w : Metric.sphere (0 : ℂ) R => ‖f w‖) := by
    have h := hcpt.bddAbove_image hf.continuous.norm.continuousOn
    rwa [Set.image_eq_range] at h
  exact le_ciSup hbf ⟨z, hz⟩

/-- **Cauchy coefficient inequality** (`‖aₙ‖ ≤ M_f(R)/Rⁿ`, brick B2).

For entire `f` and `R > 0`, the `n`-th Taylor coefficient `aₙ = f^{(n)}(0)/n!` (in the
`(n!)⁻¹ • f^{(n)}(0)` normalization used by mathlib's `hasSum_taylorSeries_of_entire`)
satisfies

    ‖aₙ‖ ≤ M_f(R) / Rⁿ.

This is exactly the derivative estimate divided by `n!`, and is the coefficient majorant that
the order-via-Taylor-coefficients formula and the exponent-of-convergence theory (B3) run on. -/
theorem norm_taylorCoeff_le_maxModulus {f : ℂ → ℂ} (hf : Differentiable ℂ f)
    {R : ℝ} (hR : 0 < R) (n : ℕ) :
    ‖((n.factorial : ℂ))⁻¹ • iteratedDeriv n f 0‖ ≤ EntireOrder.maxModulus f R / R ^ n := by
  have hfac_pos : (0 : ℝ) < (n.factorial : ℝ) := by exact_mod_cast n.factorial_pos
  have hbase := norm_iteratedDeriv_le_maxModulus hf hR n
  rw [norm_smul, norm_inv, Complex.norm_natCast]
  rw [inv_mul_le_iff₀ hfac_pos]
  -- goal: ‖f^{(n)}(0)‖ ≤ n! * (M/Rⁿ)
  refine hbase.trans_eq ?_
  rw [mul_div_assoc]

/-! ## Axiom audit — all three should be the standard `[propext, Classical.choice, Quot.sound]`
(no `sorryAx`), i.e. sorry-free. -/
#print axioms norm_iteratedDeriv_le_of_forall_mem_sphere_norm_le
#print axioms norm_iteratedDeriv_le_maxModulus
#print axioms norm_taylorCoeff_le_maxModulus

end EntireCauchy
