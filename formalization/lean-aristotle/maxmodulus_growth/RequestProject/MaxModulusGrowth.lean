import Mathlib

/-!
# Maximum-modulus growth from the order of an entire function

This file sets up the classical "order of growth" of a function `f : ℂ → ℂ` in terms of its
maximum modulus, and proves the growth statement

`EntireOrder.order f < σ → ∀ᶠ R in atTop, EntireOrder.maxModulus f R ≤ Real.exp (R ^ σ)`,

which holds for an *arbitrary* function `f : ℂ → ℂ` (no differentiability is needed: it is a
pure unwinding of the `limsup`/`log⁺` definition of the order).
-/

open Filter Real
open scoped Topology

namespace EntireOrder

/-- The maximum modulus `M_f(r) = ⨆ z ∈ sphere 0 r, ‖f z‖`. -/
noncomputable def maxModulus (f : ℂ → ℂ) (r : ℝ) : ℝ :=
  ⨆ z ∈ Metric.sphere (0 : ℂ) r, ‖f z‖

theorem maxModulus_nonneg (f : ℂ → ℂ) (r : ℝ) : 0 ≤ maxModulus f r := by
  refine Real.sSup_nonneg ?_
  rintro x ⟨z, rfl⟩
  exact Real.sSup_nonneg (by rintro y ⟨-, rfl⟩; positivity)

/-- The order of growth of `f`, defined as
`limsup_{r → ∞} log⁺ log⁺ M_f(r) / log r ∈ EReal`. -/
noncomputable def order (f : ℂ → ℂ) : EReal :=
  Filter.limsup (fun r : ℝ => ((log⁺ (log⁺ (maxModulus f r)) / Real.log r : ℝ) : EReal))
    Filter.atTop

theorem order_nonneg (f : ℂ → ℂ) : 0 ≤ order f := by
  refine Filter.le_limsup_of_frequently_le (Filter.Eventually.frequently ?_)
  filter_upwards [Filter.eventually_gt_atTop (1 : ℝ)] with r hr
  have hlog : 0 < Real.log r := Real.log_pos hr
  have : (0:ℝ) ≤ log⁺ (log⁺ (maxModulus f r)) / Real.log r :=
    div_nonneg Real.posLog_nonneg hlog.le
  exact_mod_cast this

/-- The target predicate: the order controls the growth of the maximum modulus. -/
def MaxModulusGrowthFromOrder (f : ℂ → ℂ) : Prop :=
  ∀ σ : ℝ, EntireOrder.order f < (σ : EReal) →
    ∀ᶠ R : ℝ in atTop, EntireOrder.maxModulus f R ≤ Real.exp (R ^ σ)

end EntireOrder

/-- If `order f < σ` then `σ > 0`. -/
theorem EntireOrder.pos_of_order_lt {f : ℂ → ℂ} {σ : ℝ}
    (h : EntireOrder.order f < (σ : EReal)) : 0 < σ := by
  have := lt_of_le_of_lt (EntireOrder.order_nonneg f) h
  exact_mod_cast this

/-- The key pointwise step: if `log⁺ log⁺ M < log (R ^ σ)` with `1 ≤ R`, `0 < σ` and `0 ≤ M`,
then `M ≤ exp (R ^ σ)`. -/
theorem EntireOrder.le_exp_rpow_of_posLog_lt {M R σ : ℝ} (hM : 0 ≤ M) (hR : 1 ≤ R) (hσ : 0 < σ)
    (h : log⁺ (log⁺ M) < Real.log (R ^ σ)) : M ≤ Real.exp (R ^ σ) := by
  have hR1 : (1:ℝ) ≤ R ^ σ := Real.one_le_rpow hR hσ.le
  rcases le_or_gt M (Real.exp 1) with hMe | hMe
  · exact hMe.trans (Real.exp_le_exp.2 hR1)
  · have hexp1 : (1:ℝ) < Real.exp 1 := by simp
    have hM1 : 1 < M := hexp1.trans hMe
    have h1 : 1 < Real.log M := by
      have := Real.log_lt_log (Real.exp_pos 1) hMe
      simpa using this
    have hlp : log⁺ M = Real.log M :=
      Real.posLog_eq_log (by rw [abs_of_nonneg hM]; exact hM1.le)
    have hlp2 : log⁺ (log⁺ M) = Real.log (Real.log M) := by
      rw [hlp]
      exact Real.posLog_eq_log
        (by rw [abs_of_nonneg (by linarith : (0:ℝ) ≤ Real.log M)]; linarith)
    rw [hlp2] at h
    have hlogM : Real.log M < R ^ σ :=
      (Real.log_lt_log_iff (by linarith) (by linarith)).1 h
    have hMpos : 0 < M := by
      have : (0:ℝ) < Real.exp 1 := Real.exp_pos 1
      linarith
    calc M = Real.exp (Real.log M) := (Real.exp_log hMpos).symm
      _ ≤ Real.exp (R ^ σ) := Real.exp_le_exp.2 hlogM.le

/-- **Main theorem.** For every `f : ℂ → ℂ`, the order controls the growth of the maximum
modulus. -/
theorem maxModulusGrowthFromOrder (f : ℂ → ℂ) : EntireOrder.MaxModulusGrowthFromOrder f := by
  intro σ hσ
  have hσpos : 0 < σ := EntireOrder.pos_of_order_lt hσ
  have hev := Filter.eventually_lt_of_limsup_lt hσ
  filter_upwards [hev, Filter.eventually_gt_atTop (1 : ℝ)] with R hR hR1
  have hlogR : 0 < Real.log R := Real.log_pos hR1
  have hlt : log⁺ (log⁺ (EntireOrder.maxModulus f R)) / Real.log R < σ := by
    exact_mod_cast hR
  have h : log⁺ (log⁺ (EntireOrder.maxModulus f R)) < σ * Real.log R :=
    (div_lt_iff₀ hlogR).1 hlt
  have hrw : Real.log (R ^ σ) = σ * Real.log R := Real.log_rpow (by linarith) σ
  exact EntireOrder.le_exp_rpow_of_posLog_lt (EntireOrder.maxModulus_nonneg f R) hR1.le hσpos
    (by rw [hrw]; exact h)
