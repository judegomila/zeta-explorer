import RequestProject.Defs
import RequestProject.TaylorCoeff

/-!
# Iterated derivatives of the (scaled) Gaussian at the origin

We compute `iteratedDeriv (2 * k) (fun z => gaussian (c * z)) 0`.
-/

open Filter

namespace EntireLP

/-- The Taylor coefficients of `z ↦ exp (-(c z)²)` at the origin. -/
noncomputable def gaussianCoeff (c : ℝ) : ℕ → ℂ := fun n =>
  if Even n then (-1) ^ (n / 2) * (c : ℂ) ^ n / ((n / 2).factorial : ℂ) else 0

private lemma two_mul_injective : Function.Injective (fun k : ℕ => 2 * k) := by
  intro a b h
  simp only at h
  omega

private lemma gaussianCoeff_two_mul (c : ℝ) (k : ℕ) :
    gaussianCoeff c (2 * k) = (-1) ^ k * (c : ℂ) ^ (2 * k) / (k.factorial : ℂ) := by
  have h : (2 * k) / 2 = k := by omega
  simp [gaussianCoeff, h]

private lemma gaussianCoeff_eq_zero_of_not_mem_range (c : ℝ) {n : ℕ}
    (hn : n ∉ Set.range (fun k : ℕ => 2 * k)) : gaussianCoeff c n = 0 := by
  have : ¬ Even n := by
    rintro ⟨m, rfl⟩
    exact hn ⟨m, by ring⟩
  simp [gaussianCoeff, this]

/-- The scaled Gaussian is the sum of its Taylor series at the origin, everywhere. -/
theorem hasSum_gaussianCoeff (c : ℝ) (z : ℂ) :
    HasSum (fun n => gaussianCoeff c n * z ^ n) (gaussian ((c : ℂ) * z)) := by
  have hexp : HasSum (fun k : ℕ => (-((c : ℂ) * z) ^ 2) ^ k / (k.factorial : ℂ))
      (Complex.exp (-((c : ℂ) * z) ^ 2)) := by
    rw [Complex.exp_eq_exp_ℂ]
    exact NormedSpace.expSeries_div_hasSum_exp _
  rw [← two_mul_injective.hasSum_iff
    (fun n hn => by simp [gaussianCoeff_eq_zero_of_not_mem_range c hn])]
  have hfun : (fun n => gaussianCoeff c n * z ^ n) ∘ (fun k : ℕ => 2 * k)
      = fun k : ℕ => (-((c : ℂ) * z) ^ 2) ^ k / (k.factorial : ℂ) := by
    funext k
    simp only [Function.comp_apply, gaussianCoeff_two_mul]
    ring
  rw [hfun]
  simpa [gaussian] using hexp

/-- Summability of the majorant series for the Taylor coefficients of the scaled Gaussian. -/
theorem summable_norm_gaussianCoeff (c : ℝ) (r : NNReal) :
    Summable fun n => ‖gaussianCoeff c n‖ * (r : ℝ) ^ n := by
  rw [← two_mul_injective.summable_iff]
  · refine (Real.summable_pow_div_factorial (c ^ 2 * (r : ℝ) ^ 2)).congr fun k => ?_
    simp only [Function.comp_apply, gaussianCoeff_two_mul]
    rw [norm_div, norm_mul, norm_pow, norm_pow]
    simp only [norm_neg, norm_one, one_pow, one_mul, Complex.norm_real, Complex.norm_natCast,
      Real.norm_eq_abs, mul_pow, pow_mul]
    rw [sq_abs]
    ring
  · intro n hn
    simp [gaussianCoeff_eq_zero_of_not_mem_range c hn]

/-- The even-order derivatives of the scaled Gaussian at the origin. -/
theorem iteratedDeriv_gaussianScaled_zero (c : ℝ) (k : ℕ) :
    iteratedDeriv (2 * k) (fun z : ℂ => gaussian ((c : ℂ) * z)) 0
      = ((2 * k).factorial : ℂ) * ((-1) ^ k * (c : ℂ) ^ (2 * k) / (k.factorial : ℂ)) := by
  rw [iteratedDeriv_zero_of_hasSum (summable_norm_gaussianCoeff c) (hasSum_gaussianCoeff c),
    gaussianCoeff_two_mul]

/-- The even-order derivatives of the Gaussian at the origin. -/
theorem iteratedDeriv_gaussian_zero (k : ℕ) :
    iteratedDeriv (2 * k) gaussian 0
      = ((2 * k).factorial : ℂ) * ((-1) ^ k / (k.factorial : ℂ)) := by
  have h := iteratedDeriv_gaussianScaled_zero 1 k
  simpa using h

end EntireLP
