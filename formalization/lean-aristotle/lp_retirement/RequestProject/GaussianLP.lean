import RequestProject.Defs
import RequestProject.DerivLimits

/-!
# The scaled Gaussian belongs to the Laguerre–Pólya class

We show that `(1 - (c²/n) X²)^n` is a real polynomial with only real roots and that the
corresponding entire functions converge to `z ↦ exp (-(c z)²)` locally uniformly on `ℂ`.
-/

open Filter Polynomial

namespace EntireLP

/-- Quantitative form of `(1 + w/n)^n → exp w`. -/
theorem norm_one_add_div_pow_sub_exp_le {n : ℕ} (hn : 0 < n) {M : ℝ} {w : ℂ}
    (hw : ‖w‖ ≤ M) (hMn : M ≤ n) :
    ‖(1 + w / n) ^ n - Complex.exp w‖ ≤ Real.exp M * M ^ 2 / n := by
  have hM : 0 ≤ M := le_trans (norm_nonneg _) hw
  have hn0' : (n : ℂ) ≠ 0 := Nat.cast_ne_zero.mpr hn.ne'
  have hnpos : (0:ℝ) < n := by positivity
  set a : ℂ := 1 + w / n with ha
  set b : ℂ := Complex.exp (w / n) with hb
  have hwn : ‖w / (n:ℂ)‖ ≤ M / n := by
    rw [norm_div, Complex.norm_natCast]
    gcongr
  have hwn1 : ‖w / (n:ℂ)‖ ≤ 1 := le_trans hwn (by rw [div_le_one hnpos]; exact hMn)
  have hbn : b ^ n = Complex.exp w := by
    rw [hb, ← Complex.exp_nat_mul]
    congr 1
    exact mul_div_cancel₀ w hn0'
  have hab : ‖a - b‖ ≤ (M / n) ^ 2 := by
    have h1 : a - b = -(Complex.exp (w / n) - 1 - w / n) := by rw [ha, hb]; ring
    rw [h1, norm_neg]
    calc ‖Complex.exp (w / n) - 1 - w / n‖ ≤ ‖w / (n:ℂ)‖ ^ 2 :=
          Complex.norm_exp_sub_one_sub_id_le hwn1
      _ ≤ (M / n) ^ 2 := by gcongr
  have hK : (0:ℝ) ≤ M / n := by positivity
  have hanorm : ‖a‖ ≤ Real.exp (M / n) := by
    have h0 : ‖a‖ ≤ 1 + M / n := by
      calc ‖a‖ ≤ ‖(1:ℂ)‖ + ‖w / (n:ℂ)‖ := norm_add_le _ _
        _ ≤ 1 + M / n := by simp only [norm_one]; linarith
    exact le_trans h0 (by simpa [add_comm] using Real.add_one_le_exp (M / n))
  have hbnorm : ‖b‖ ≤ Real.exp (M / n) := by
    rw [hb, Complex.norm_exp]
    exact Real.exp_le_exp.mpr (le_trans (Complex.re_le_norm _) hwn)
  have hexp : Real.exp (M / n) ^ n = Real.exp M := by
    rw [← Real.exp_nat_mul]
    congr 1
    field_simp
  have hterm : ∀ i ∈ Finset.range n, ‖a ^ i * b ^ (n - 1 - i)‖ ≤ Real.exp M := by
    intro i hi
    simp only [Finset.mem_range] at hi
    rw [norm_mul, norm_pow, norm_pow]
    have h1 : ‖a‖ ^ i ≤ Real.exp (M/n) ^ i := pow_le_pow_left₀ (norm_nonneg _) hanorm i
    have h2 : ‖b‖ ^ (n-1-i) ≤ Real.exp (M/n) ^ (n-1-i) :=
      pow_le_pow_left₀ (norm_nonneg _) hbnorm _
    calc ‖a‖ ^ i * ‖b‖ ^ (n - 1 - i) ≤ Real.exp (M/n) ^ i * Real.exp (M/n) ^ (n - 1 - i) :=
          mul_le_mul h1 h2 (by positivity) (by positivity)
      _ = Real.exp (M/n) ^ (i + (n - 1 - i)) := by rw [pow_add]
      _ ≤ Real.exp (M/n) ^ n := by
          apply pow_le_pow_right₀ (Real.one_le_exp hK)
          omega
      _ = Real.exp M := hexp
  have hsum : ‖∑ i ∈ Finset.range n, a ^ i * b ^ (n - 1 - i)‖ ≤ n * Real.exp M := by
    calc ‖∑ i ∈ Finset.range n, a ^ i * b ^ (n - 1 - i)‖
        ≤ ∑ i ∈ Finset.range n, ‖a ^ i * b ^ (n - 1 - i)‖ := norm_sum_le _ _
      _ ≤ ∑ _i ∈ Finset.range n, Real.exp M := Finset.sum_le_sum hterm
      _ = n * Real.exp M := by simp
  have hmain : a ^ n - Complex.exp w
      = (∑ i ∈ Finset.range n, a ^ i * b ^ (n - 1 - i)) * (a - b) := by
    rw [geom_sum₂_mul, hbn]
  rw [hmain, norm_mul]
  calc ‖∑ i ∈ Finset.range n, a ^ i * b ^ (n - 1 - i)‖ * ‖a - b‖
      ≤ (n * Real.exp M) * (M / n) ^ 2 :=
        mul_le_mul hsum hab (norm_nonneg _) (by positivity)
    _ = Real.exp M * M ^ 2 / n := by field_simp

/-- The elementary approximants `(1 + (-(c z)²)/n)^n` converge locally uniformly on `ℂ`
to the scaled Gaussian. -/
theorem tendstoLocallyUniformly_gaussianScaled (c : ℝ) :
    TendstoLocallyUniformly (fun n : ℕ => fun z : ℂ => (1 + (-((c : ℂ) * z) ^ 2) / n) ^ n)
      (fun z : ℂ => gaussian ((c : ℂ) * z)) atTop := by
  rw [Metric.tendstoLocallyUniformly_iff]
  intro ε hε x
  refine ⟨Metric.ball x 1, Metric.ball_mem_nhds x one_pos, ?_⟩
  set R : ℝ := ‖x‖ + 1 with hR
  have hR0 : 0 ≤ R := by positivity
  set M : ℝ := c ^ 2 * R ^ 2 with hMdef
  have hM0 : 0 ≤ M := by positivity
  filter_upwards [eventually_gt_atTop 0,
    (tendsto_natCast_atTop_atTop (R := ℝ)).eventually_ge_atTop M,
    (tendsto_const_div_atTop_nhds_zero_nat (Real.exp M * M ^ 2)).eventually
      (gt_mem_nhds hε)] with n hn hnM hnε y hy
  have hyR : ‖y‖ ≤ R := by
    have h1 : dist y x < 1 := Metric.mem_ball.mp hy
    have h2 : ‖y‖ ≤ ‖x‖ + ‖y - x‖ := by
      simpa using norm_add_le x (y - x)
    have h3 : ‖y - x‖ < 1 := by simpa [dist_eq_norm] using h1
    rw [hR]; linarith
  have hw : ‖-((c : ℂ) * y) ^ 2‖ ≤ M := by
    rw [norm_neg, norm_pow, norm_mul, Complex.norm_real, Real.norm_eq_abs, mul_pow, sq_abs,
      hMdef]
    gcongr
  have hkey := norm_one_add_div_pow_sub_exp_le hn hw hnM
  have hg : gaussian ((c : ℂ) * y) = Complex.exp (-((c : ℂ) * y) ^ 2) := rfl
  rw [hg, dist_eq_norm, ← norm_neg]
  have : -(Complex.exp (-((c : ℂ) * y) ^ 2) - (1 + -((c : ℂ) * y) ^ 2 / n) ^ n)
      = (1 + -((c : ℂ) * y) ^ 2 / n) ^ n - Complex.exp (-((c : ℂ) * y) ^ 2) := by ring
  rw [this]
  exact lt_of_le_of_lt hkey hnε

/-- The real polynomials `(1 - (c²/n) X²)^n`. -/
noncomputable def gaussianApprox (c : ℝ) (n : ℕ) : ℝ[X] :=
  (1 - C (c ^ 2 / n) * X ^ 2) ^ n

theorem toEntire_gaussianApprox (c : ℝ) (n : ℕ) (z : ℂ) :
    toEntire (gaussianApprox c n) z = (1 + (-((c : ℂ) * z) ^ 2) / n) ^ n := by
  simp only [toEntire, gaussianApprox, map_pow, map_sub, map_one, map_mul, aeval_C, aeval_X,
    Complex.coe_algebraMap]
  push_cast
  ring_nf

/-- All roots of the approximants are real. -/
theorem gaussianApprox_hasOnlyRealRoots (c : ℝ) (n : ℕ) :
    MathlibBridge.HasOnlyRealRoots (gaussianApprox c n) := by
  intro z hz
  rw [gaussianApprox] at hz
  simp only [map_pow, map_sub, map_one, map_mul, aeval_C, aeval_X, Complex.coe_algebraMap] at hz
  rcases Nat.eq_zero_or_pos n with rfl | hn
  · simp at hz
  have hz1 : (1 : ℂ) - ((c ^ 2 / n : ℝ) : ℂ) * z ^ 2 = 0 := by
    have := pow_eq_zero_iff (n := n) hn.ne' |>.mp hz
    exact this
  set A : ℝ := c ^ 2 / n with hA
  have hAz : (A : ℂ) * z ^ 2 = 1 := by
    have := hz1
    rw [sub_eq_zero] at this
    exact this.symm
  have hAnn : 0 ≤ A := by rw [hA]; positivity
  have hAne : A ≠ 0 := by
    intro h0
    rw [h0] at hAz
    simp at hAz
  have hA0 : 0 < A := lt_of_le_of_ne hAnn (Ne.symm hAne)
  have hre := congrArg Complex.re hAz
  have him := congrArg Complex.im hAz
  simp [pow_two, Complex.mul_re, Complex.mul_im] at hre him
  rcases him with h0 | him
  · exact absurd h0 hAne
  have hxy : z.re * z.im = 0 := by linarith
  rcases mul_eq_zero.mp hxy with hx | hy0
  · exfalso
    rw [hx] at hre
    nlinarith [sq_nonneg z.im]
  · exact hy0

/-- The scaled Gaussian is in the Laguerre–Pólya class. -/
theorem gaussianScaled_isLaguerrePolya (c : ℝ) :
    IsLaguerrePolya (fun z : ℂ => gaussian ((c : ℂ) * z)) := by
  refine ⟨gaussianApprox c, gaussianApprox_hasOnlyRealRoots c, ?_⟩
  have h := tendstoLocallyUniformly_gaussianScaled c
  refine h.congr fun n => ?_
  intro z
  exact (toEntire_gaussianApprox c n z).symm

/-- The Gaussian is in the Laguerre–Pólya class. -/
theorem gaussian_isLaguerrePolya : IsLaguerrePolya gaussian := by
  have h := gaussianScaled_isLaguerrePolya 1
  simpa using h

end EntireLP
