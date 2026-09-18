import RequestProject.GaussianDeriv

/-!
# Divergence of the heat series of a scaled Gaussian

For `1 ≤ t * c ^ 2` every term of the heat series of `z ↦ gaussian (c * z)` at the
origin has norm at least `1`, so the series diverges and the `tsum` defining
`heatFlow t (gaussian (c * ·)) 0` takes its junk value `0`.
-/

open Filter

namespace EntireLP

/-- The norm of the `2k`-th derivative of the scaled Gaussian at the origin. -/
theorem norm_iteratedDeriv_gaussianScaled_zero (c : ℝ) (k : ℕ) :
    ‖iteratedDeriv (2 * k) (fun z : ℂ => gaussian ((c : ℂ) * z)) 0‖
      = ((2 * k).factorial : ℝ) * |c| ^ (2 * k) / (k.factorial : ℝ) := by
  rw [iteratedDeriv_gaussianScaled_zero, norm_mul, norm_div, norm_mul, norm_pow, norm_pow]
  simp [Real.norm_eq_abs, mul_div_assoc]

private lemma factorial_sq_le_factorial_two_mul (k : ℕ) :
    (k.factorial : ℝ) * (k.factorial : ℝ) ≤ ((2 * k).factorial : ℝ) := by
  have h : k.factorial * k.factorial ≤ (2 * k).factorial := by
    have hdvd := Nat.factorial_mul_factorial_dvd_factorial_add k k
    have := Nat.le_of_dvd (Nat.factorial_pos _) hdvd
    simpa [two_mul] using this
  exact_mod_cast h

/-- Under `1 ≤ t * c ^ 2`, every term of the heat series of the scaled Gaussian at the
origin has norm at least one. -/
theorem one_le_heatTerm_gaussianScaled {c t : ℝ} (h : 1 ≤ t * c ^ 2) (k : ℕ) :
    1 ≤ ‖((-t) ^ k / (k.factorial : ℝ)) •
      iteratedDeriv (2 * k) (fun z : ℂ => gaussian ((c : ℂ) * z)) 0‖ := by
  have hc2 : (0 : ℝ) ≤ c ^ 2 := sq_nonneg c
  have ht : 0 < t := by nlinarith
  have hkpos : (0 : ℝ) < (k.factorial : ℝ) := by
    exact_mod_cast Nat.factorial_pos k
  rw [norm_smul, norm_iteratedDeriv_gaussianScaled_zero]
  have habs : ‖(-t) ^ k / (k.factorial : ℝ)‖ = t ^ k / (k.factorial : ℝ) := by
    rw [Real.norm_eq_abs, abs_div, abs_pow, abs_neg, abs_of_pos ht,
      abs_of_pos hkpos]
  rw [habs]
  have habs2 : |c| ^ (2 * k) = (c ^ 2) ^ k := by
    rw [pow_mul, sq_abs]
  rw [habs2]
  have key : t ^ k / (k.factorial : ℝ) *
      (((2 * k).factorial : ℝ) * (c ^ 2) ^ k / (k.factorial : ℝ))
      = (t * c ^ 2) ^ k * (((2 * k).factorial : ℝ) / ((k.factorial : ℝ) * (k.factorial : ℝ))) := by
    rw [mul_pow]
    field_simp
  rw [key]
  have h1 : (1 : ℝ) ≤ (t * c ^ 2) ^ k := one_le_pow₀ h
  have h2 : (1 : ℝ) ≤ ((2 * k).factorial : ℝ) / ((k.factorial : ℝ) * (k.factorial : ℝ)) := by
    rw [le_div_iff₀ (by positivity)]
    simpa using factorial_sq_le_factorial_two_mul k
  nlinarith

/-- The heat series of the scaled Gaussian diverges at the origin. -/
theorem not_summable_heatFlow_term_gaussianScaled {c t : ℝ} (h : 1 ≤ t * c ^ 2) :
    ¬ Summable (fun k : ℕ => ((-t) ^ k / (k.factorial : ℝ)) •
      iteratedDeriv (2 * k) (fun z : ℂ => gaussian ((c : ℂ) * z)) 0) := by
  intro hs
  have htend := hs.tendsto_atTop_zero
  have hnorm : Tendsto (fun k : ℕ => ‖((-t) ^ k / (k.factorial : ℝ)) •
      iteratedDeriv (2 * k) (fun z : ℂ => gaussian ((c : ℂ) * z)) 0‖) atTop (nhds 0) := by
    simpa using htend.norm
  have hlt : ∀ᶠ k : ℕ in atTop, ‖((-t) ^ k / (k.factorial : ℝ)) •
      iteratedDeriv (2 * k) (fun z : ℂ => gaussian ((c : ℂ) * z)) 0‖ < 1 := by
    have := hnorm.eventually (eventually_lt_nhds (by norm_num : (0:ℝ) < 1))
    simpa using this
  obtain ⟨k, hk⟩ := hlt.exists
  exact absurd (one_le_heatTerm_gaussianScaled h k) (not_le.mpr hk)

/-- Consequently the formal heat flow of the scaled Gaussian takes the `tsum` junk value
`0` at the origin. -/
theorem heatFlow_gaussianScaled_zero_eq_zero {c t : ℝ} (h : 1 ≤ t * c ^ 2) :
    heatFlow t (fun z : ℂ => gaussian ((c : ℂ) * z)) 0 = 0 :=
  tsum_eq_zero_of_not_summable (not_summable_heatFlow_term_gaussianScaled h)

end EntireLP
