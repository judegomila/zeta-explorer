import Mathlib

/-!
# Taylor coefficients of an entire function given by a power series

If `f : ℂ → ℂ` is the sum of an everywhere-convergent power series `∑ a n * z ^ n`,
then `iteratedDeriv n f 0 = n ! * a n`.
-/

open Filter

namespace EntireLP

/-- An everywhere convergent power series with absolutely summable coefficients on every
radius has full radius of convergence and represents its sum on the whole plane. -/
theorem hasFPowerSeriesOnBall_of_hasSum {f : ℂ → ℂ} {a : ℕ → ℂ}
    (hsum : ∀ r : NNReal, Summable fun n => ‖a n‖ * (r : ℝ) ^ n)
    (hf : ∀ z : ℂ, HasSum (fun n => a n * z ^ n) (f z)) :
    HasFPowerSeriesOnBall f (FormalMultilinearSeries.ofScalars ℂ a) 0 ⊤ where
  r_le := by
    rw [FormalMultilinearSeries.radius_eq_top_of_summable_norm]
    intro r
    simpa [FormalMultilinearSeries.ofScalars_norm] using hsum r
  r_pos := by simp
  hasSum := by
    intro y _
    simpa [FormalMultilinearSeries.ofScalars_apply_eq, smul_eq_mul, mul_comm] using hf y

/-- The iterated derivatives at the origin of the sum of an everywhere convergent power
series are `n !` times the coefficients. -/
theorem iteratedDeriv_zero_of_hasSum {f : ℂ → ℂ} {a : ℕ → ℂ}
    (hsum : ∀ r : NNReal, Summable fun n => ‖a n‖ * (r : ℝ) ^ n)
    (hf : ∀ z : ℂ, HasSum (fun n => a n * z ^ n) (f z)) (n : ℕ) :
    iteratedDeriv n f 0 = (n.factorial : ℂ) * a n := by
  have h := hasFPowerSeriesOnBall_of_hasSum hsum hf
  have h2 := h.factorial_smul (1 : ℂ) n
  rw [iteratedDeriv_eq_iteratedFDeriv, ← h2,
    FormalMultilinearSeries.ofScalars_apply_eq]
  simp [nsmul_eq_mul]

end EntireLP
