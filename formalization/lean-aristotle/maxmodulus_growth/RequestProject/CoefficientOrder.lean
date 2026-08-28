import RequestProject.MaxModulusGrowth

/-!
# The coefficient order is bounded by the maximum-modulus order

For an entire function `f : ℂ → ℂ` with Taylor coefficients `aₙ = f⁽ⁿ⁾(0)/n!` at the origin,
the *coefficient order* is

`coefficientOrder f = limsup_{n → ∞} (n log n) / log (1 / ‖aₙ‖)`.

This file proves, via Cauchy's estimates, the conditional statement
`MaxModulusGrowthFromOrder f → coefficientOrder f ≤ EntireOrder.order f`
and then, feeding in `maxModulusGrowthFromOrder`, the unconditional inequality
`coefficientOrder f ≤ EntireOrder.order f` for every `Differentiable ℂ f`.
-/

open Filter Real Metric
open scoped Topology

/-- The `n`-th Taylor coefficient of `f` at the origin. -/
noncomputable def taylorCoeff (f : ℂ → ℂ) (n : ℕ) : ℂ :=
  iteratedDeriv n f 0 / (n.factorial : ℂ)

/-- The order of `f` read off from the decay of its Taylor coefficients at the origin:
`limsup_n (n log n) / log (1/‖aₙ‖)`. -/
noncomputable def coefficientOrder (f : ℂ → ℂ) : EReal :=
  Filter.limsup
    (fun n : ℕ => (((n : ℝ) * Real.log n / (-Real.log ‖taylorCoeff f n‖) : ℝ) : EReal))
    Filter.atTop

namespace EntireOrder

/-- Every value of `‖f‖` on the sphere of radius `r` is bounded by the maximum modulus. -/
theorem norm_le_maxModulus {f : ℂ → ℂ} (hf : Continuous f) {r : ℝ} {z : ℂ}
    (hz : z ∈ Metric.sphere (0 : ℂ) r) : ‖f z‖ ≤ maxModulus f r := by
  have hcpt : IsCompact (Metric.sphere (0 : ℂ) r) := isCompact_sphere 0 r
  obtain ⟨C, hC⟩ := hcpt.bddAbove_image (f := fun w : ℂ => ‖f w‖) (by fun_prop)
  have hbr : BddAbove (Set.range (fun w : ℂ => ⨆ _ : w ∈ Metric.sphere (0 : ℂ) r, ‖f w‖)) := by
    refine ⟨max C 0, ?_⟩
    rintro x ⟨w, rfl⟩
    show (⨆ _ : w ∈ Metric.sphere (0 : ℂ) r, ‖f w‖) ≤ max C 0
    by_cases hw : w ∈ Metric.sphere (0 : ℂ) r
    · rw [ciSup_pos (f := fun _ : w ∈ Metric.sphere (0 : ℂ) r => ‖f w‖) hw]
      exact le_max_of_le_left (hC ⟨w, hw, rfl⟩)
    · rw [ciSup_neg (f := fun _ : w ∈ Metric.sphere (0 : ℂ) r => ‖f w‖) hw, Real.sSup_empty]
      exact le_max_right C 0
  exact le_trans
    (le_of_eq (ciSup_pos (f := fun _ : z ∈ Metric.sphere (0 : ℂ) r => ‖f z‖) hz).symm)
    (le_ciSup hbr z)

/-- **Cauchy's estimate** for the Taylor coefficients of an entire function. -/
theorem norm_taylorCoeff_le {f : ℂ → ℂ} (hf : Differentiable ℂ f) {R : ℝ} (hR : 0 < R) (n : ℕ) :
    ‖taylorCoeff f n‖ ≤ maxModulus f R / R ^ n := by
  have hcauchy := Complex.norm_iteratedDeriv_le_of_forall_mem_sphere_norm_le (f := f) (c := 0)
    (C := maxModulus f R) n hR hf.diffContOnCl
    (fun z hz => norm_le_maxModulus hf.continuous hz)
  have hfac : (0 : ℝ) < (n.factorial : ℝ) := by positivity
  rw [taylorCoeff, norm_div]
  simp only [Complex.norm_natCast]
  rw [div_le_div_iff₀ hfac (by positivity)]
  calc ‖iteratedDeriv n f 0‖ * R ^ n
      ≤ ((n.factorial : ℝ) * maxModulus f R / R ^ n) * R ^ n := by gcongr
    _ = maxModulus f R * (n.factorial : ℝ) := by field_simp

end EntireOrder

/-- The core estimate: if `M_f(R) ≤ exp (R ^ σ)` eventually, then for every `ε > 0` the
quotients `n log n / log (1/‖aₙ‖)` are eventually bounded by `σ (1 + ε)`.

The optimal radius `R = (n/σ)^(1/σ)` in Cauchy's estimate gives
`log (1/‖aₙ‖) ≥ (n/σ) (log n - log σ - 1)`. -/
theorem eventually_taylorQuotient_le {f : ℂ → ℂ} (hf : Differentiable ℂ f) {σ ε : ℝ}
    (hσ : 0 < σ) (hε : 0 < ε)
    (hgrow : ∀ᶠ R : ℝ in atTop, EntireOrder.maxModulus f R ≤ Real.exp (R ^ σ)) :
    ∀ᶠ n : ℕ in atTop,
      (n : ℝ) * Real.log n / (-Real.log ‖taylorCoeff f n‖) ≤ σ * (1 + ε) := by
  obtain ⟨R₀, hR₀⟩ := eventually_atTop.1 hgrow
  set c : ℝ := Real.log σ + 1 with hc
  have htend : Tendsto (fun n : ℕ => ((n : ℝ) / σ) ^ (1 / σ)) atTop atTop :=
    (tendsto_rpow_atTop (by positivity)).comp (tendsto_natCast_atTop_atTop.atTop_div_const hσ)
  have hlogtend : Tendsto (fun n : ℕ => Real.log n) atTop atTop :=
    Real.tendsto_log_atTop.comp tendsto_natCast_atTop_atTop
  filter_upwards [htend.eventually_ge_atTop (max R₀ 1),
    hlogtend.eventually_ge_atTop (c * (1 + ε) / ε), hlogtend.eventually_gt_atTop 0]
    with n hRn hlogn hlogpos
  set R : ℝ := ((n : ℝ) / σ) ^ (1 / σ) with hRdef
  have hR1 : (1 : ℝ) ≤ R := le_trans (le_max_right R₀ 1) hRn
  have hRpos : 0 < R := lt_of_lt_of_le zero_lt_one hR1
  have hRR₀ : R₀ ≤ R := le_trans (le_max_left R₀ 1) hRn
  have hnpos : (0 : ℝ) < n := by
    rcases Nat.eq_zero_or_pos n with h | h
    · simp [h] at hlogpos
    · exact_mod_cast h
  have hquot : (0 : ℝ) < (n : ℝ) / σ := by positivity
  have hRsigma : R ^ σ = (n : ℝ) / σ := by
    rw [hRdef, ← Real.rpow_mul hquot.le, one_div, inv_mul_cancel₀ (ne_of_gt hσ), Real.rpow_one]
  have hlogR : Real.log R = (Real.log n - Real.log σ) / σ := by
    rw [hRdef, Real.log_rpow hquot, Real.log_div (ne_of_gt hnpos) (ne_of_gt hσ)]
    ring
  have hM : EntireOrder.maxModulus f R ≤ Real.exp ((n : ℝ) / σ) := by
    have := hR₀ R hRR₀
    rwa [hRsigma] at this
  have hcoef : ‖taylorCoeff f n‖ ≤ Real.exp ((n : ℝ) / σ) / R ^ n := by
    refine le_trans (EntireOrder.norm_taylorCoeff_le hf hRpos n) ?_
    gcongr
  set B : ℝ := (n : ℝ) * Real.log n / (σ * (1 + ε)) with hB
  have hBpos : 0 < B := by rw [hB]; positivity
  rcases eq_or_lt_of_le (norm_nonneg (taylorCoeff f n)) with h0 | hpos
  · rw [← h0]
    simp only [Real.log_zero, neg_zero, div_zero]
    positivity
  · have hlogle : Real.log ‖taylorCoeff f n‖ ≤ (n : ℝ) / σ - n * Real.log R := by
      refine le_trans (Real.log_le_log hpos hcoef) ?_
      rw [Real.log_div (Real.exp_ne_zero _) (by positivity), Real.log_exp, Real.log_pow]
    have hL : B ≤ -Real.log ‖taylorCoeff f n‖ := by
      have key : B ≤ (n : ℝ) * Real.log R - (n : ℝ) / σ := by
        rw [hlogR, hB, div_le_iff₀ (by positivity)]
        have hεle : c * (1 + ε) ≤ Real.log n * ε := by
          rw [div_le_iff₀ hε] at hlogn
          linarith
        have hfac : Real.log n / (1 + ε) ≤ Real.log n - c := by
          rw [div_le_iff₀ (by positivity)]
          nlinarith
        calc (n : ℝ) * Real.log n
            = ((n : ℝ) / σ * (Real.log n / (1 + ε))) * (σ * (1 + ε)) := by field_simp
          _ ≤ ((n : ℝ) / σ * (Real.log n - c)) * (σ * (1 + ε)) := by gcongr
          _ = ((n : ℝ) * ((Real.log n - Real.log σ) / σ) - (n : ℝ) / σ) * (σ * (1 + ε)) := by
              rw [hc]; field_simp; ring
      linarith
    have hquotle : (n : ℝ) * Real.log n / (-Real.log ‖taylorCoeff f n‖)
        ≤ (n : ℝ) * Real.log n / B :=
      div_le_div_of_nonneg_left (by positivity) hBpos hL
    rw [hB] at hquotle
    calc (n : ℝ) * Real.log n / (-Real.log ‖taylorCoeff f n‖)
        ≤ (n : ℝ) * Real.log n / ((n : ℝ) * Real.log n / (σ * (1 + ε))) := hquotle
      _ = σ * (1 + ε) := by field_simp

/-- If the order of `f` is smaller than the real number `τ`, then the coefficient order is at
most `τ`. -/
theorem coefficientOrder_le_of_order_lt {f : ℂ → ℂ} (hf : Differentiable ℂ f)
    (hgrow : EntireOrder.MaxModulusGrowthFromOrder f) {τ : ℝ}
    (hτ : EntireOrder.order f < (τ : EReal)) : coefficientOrder f ≤ (τ : EReal) := by
  obtain ⟨σ, hσ1, hσ2⟩ := EReal.exists_between_coe_real hτ
  have hσpos : 0 < σ := EntireOrder.pos_of_order_lt hσ1
  have hστ : σ < τ := by exact_mod_cast hσ2
  set ε : ℝ := (τ - σ) / (2 * σ) with hεdef
  have hε : 0 < ε := by
    rw [hεdef]; exact div_pos (by linarith) (by positivity)
  have hlt : σ * (1 + ε) ≤ τ := by
    rw [hεdef]
    field_simp
    linarith
  refine Filter.limsup_le_of_le (by isBoundedDefault) ?_
  filter_upwards [eventually_taylorQuotient_le hf hσpos hε (hgrow σ hσ1)] with n hn
  exact_mod_cast le_trans hn hlt

/-- The conditional theorem: growth control by the order gives `coefficientOrder ≤ order`. -/
theorem coefficientOrder_le_order_of_growth {f : ℂ → ℂ} (hf : Differentiable ℂ f)
    (hgrow : EntireOrder.MaxModulusGrowthFromOrder f) :
    coefficientOrder f ≤ EntireOrder.order f := by
  by_contra hcon
  push_neg at hcon
  obtain ⟨τ, hτ1, hτ2⟩ := EReal.exists_between_coe_real hcon
  exact absurd (coefficientOrder_le_of_order_lt hf hgrow hτ1) (not_le.2 hτ2)

/-- **Unconditional corollary.** For every entire function `f`, the coefficient order is at
most the maximum-modulus order. -/
theorem coefficientOrder_le_order {f : ℂ → ℂ} (hf : Differentiable ℂ f) :
    coefficientOrder f ≤ EntireOrder.order f :=
  coefficientOrder_le_order_of_growth hf (maxModulusGrowthFromOrder f)
