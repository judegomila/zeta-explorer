import RequestProject.Truncation

/-!
# Heat-majorized real-rooted approximants for Laguerre–Pólya functions of exponential type

The main result of this file is `Stage1LP.exists_LP_approx_heatMajorized_order_le_one`:
a function `f` in the Laguerre–Pólya class which in addition satisfies a global bound
`‖f z‖ ≤ A * exp (B * ‖z‖)` (order at most one and finite exponential type) admits a sequence
of real polynomials with only real roots that converges to `f` locally uniformly *and* is
heat-majorized in the sense of `Stage1LP.HeatMajorized`.

The statement of the main theorem and the definition of `HeatMajorized` are the ones
prescribed by the task. The auxiliary notions `toEntire`, `IsLaguerrePolya` and
`Stage1MB.HasOnlyRealRoots` are given their standard meanings here: `IsLaguerrePolya` is
the classical description of the Laguerre–Pólya class as the locally uniform limits of real
polynomials with only real roots (together with realness on the real axis), and
`HasOnlyRealRoots` uses the `card roots = natDegree` convention.

The proof produces the approximants explicitly. Starting from any real-rooted approximating
sequence, one applies `Stage1LP.truncScale`: reversing the coefficients, differentiating,
reversing back and rescaling the variable produces a real-rooted polynomial of controlled
degree whose coefficients are those of the original one, damped by weights in `[0, 1]` that
tend to `1`. Cauchy's estimates on discs of radius `j / B`, together with `j ! ≤ j ^ j`, turn
the growth hypothesis into the universal coefficient bound `2 * A * (e * B) ^ j / j !`, which
is exactly what makes the heat majorant `u k = C_r * (t * (e * B) ^ 2) ^ k / k !` summable for
every `t ≥ 0`.
-/

open Polynomial Filter
open scoped Nat Topology

namespace Stage1LP

/-- A real polynomial viewed as an entire function on `ℂ`. -/
noncomputable def toEntire (P : ℝ[X]) : ℂ → ℂ := fun z => (P.map (algebraMap ℝ ℂ)).eval z

/-- A sequence of real polynomials is heat-majorized at time `t` if, on every disc, the
quantities `t ^ k / k ! * ‖(toEntire (P n))^(2k)(z)‖` admit a summable majorant that is
uniform in `n` and `z`. -/
def HeatMajorized (t : ℝ) (P : ℕ → ℝ[X]) : Prop :=
  ∀ r : ℝ, 0 < r → ∃ u : ℕ → ℝ, Summable u ∧
    ∀ n k, ∀ z : ℂ, ‖z‖ ≤ r →
      t ^ k / (k.factorial : ℝ) * ‖iteratedDeriv (2 * k) (toEntire (P n)) z‖ ≤ u k

/-- The Laguerre–Pólya class: real-valued on the real axis, and a locally uniform limit of
real polynomials having only real roots. -/
def IsLaguerrePolya (f : ℂ → ℂ) : Prop :=
  (∀ x : ℝ, (f x).im = 0) ∧
  ∃ P : ℕ → ℝ[X], (∀ n, Stage1MB.HasOnlyRealRoots (P n)) ∧
    TendstoLocallyUniformly (fun n => toEntire (P n)) f atTop

/-- The `j`-th Taylor coefficient of `f` at the origin. -/
noncomputable def taylorCoeff (f : ℂ → ℂ) (j : ℕ) : ℂ := iteratedDeriv j f 0 / (j ! : ℂ)

/-! ### Elementary properties of `toEntire` -/

theorem differentiable_toEntire (P : ℝ[X]) : Differentiable ℂ (toEntire P) := by
  unfold toEntire
  exact (P.map (algebraMap ℝ ℂ)).differentiable

theorem iteratedDeriv_toEntire (N : ℕ) (P : ℝ[X]) :
    iteratedDeriv N (toEntire P) = toEntire ((⇑derivative)^[N] P) := by
  induction N generalizing P with
  | zero => simp [iteratedDeriv_zero]
  | succ n ih =>
      rw [iteratedDeriv_succ']
      have hd : deriv (toEntire P) = toEntire (derivative P) := by
        funext z
        unfold toEntire
        rw [Polynomial.deriv, ← Polynomial.derivative_map]
      rw [hd, ih, Function.iterate_succ_apply]

theorem hasSum_toEntire (P : ℝ[X]) (z : ℂ) :
    HasSum (fun j => ((P.coeff j : ℝ) : ℂ) * z ^ j) (toEntire P z) := by
  have hsupp : ∀ j ∉ Finset.range (P.natDegree + 1), ((P.coeff j : ℝ) : ℂ) * z ^ j = 0 := by
    intro j hj
    simp only [Finset.mem_range, not_lt] at hj
    rw [Polynomial.coeff_eq_zero_of_natDegree_lt (by omega)]
    simp
  have key : HasSum (fun j => ((P.coeff j : ℝ) : ℂ) * z ^ j)
      (∑ j ∈ Finset.range (P.natDegree + 1), ((P.coeff j : ℝ) : ℂ) * z ^ j) :=
    hasSum_sum_of_ne_finset_zero hsupp
  convert key using 1
  unfold toEntire
  rw [Polynomial.eval_eq_sum_range' (n := P.natDegree + 1)]
  · refine Finset.sum_congr rfl ?_
    intro i _
    simp [Polynomial.coeff_map]
  · exact lt_of_le_of_lt (Polynomial.natDegree_map_le) (by omega)

theorem toEntire_coeff_eq (P : ℝ[X]) (j : ℕ) :
    ((P.coeff j : ℝ) : ℂ) = taylorCoeff (toEntire P) j := by
  unfold taylorCoeff
  rw [iteratedDeriv_toEntire]
  have h : toEntire ((⇑derivative)^[j] P) 0 = ((j ! : ℕ) : ℂ) * ((P.coeff j : ℝ) : ℂ) := by
    unfold toEntire
    rw [Polynomial.eval_zero_map, ← Polynomial.coeff_zero_eq_eval_zero,
      Polynomial.coeff_iterate_derivative]
    simp [Nat.descFactorial_self]
  rw [h]
  have hne : ((j ! : ℕ) : ℂ) ≠ 0 := Nat.cast_ne_zero.2 (Nat.factorial_ne_zero _)
  field_simp

/-! ### Cauchy estimates -/

/-- Cauchy's estimate in the form we need: a bound on a circle of radius `ρ` bounds the Taylor
coefficients at the origin. -/
theorem norm_taylorCoeff_le {g : ℂ → ℂ} (hg : Differentiable ℂ g) {ρ C : ℝ} (hρ : 0 < ρ)
    (hb : ∀ z : ℂ, ‖z‖ = ρ → ‖g z‖ ≤ C) (j : ℕ) :
    ‖taylorCoeff g j‖ ≤ C / ρ ^ j := by
  have hdc : DiffContOnCl ℂ g (Metric.ball (0 : ℂ) ρ) := (hg.diffContOnCl)
  have hsph : ∀ z ∈ Metric.sphere (0 : ℂ) ρ, ‖g z‖ ≤ C := by
    intro z hz
    refine hb z ?_
    simpa [Complex.dist_eq] using hz
  have := Complex.norm_iteratedDeriv_le_of_forall_mem_sphere_norm_le j hρ hdc hsph
  unfold taylorCoeff
  rw [norm_div]
  have hfac : ‖((j ! : ℕ) : ℂ)‖ = (j ! : ℝ) := by
    simp
  rw [hfac]
  have hfpos : (0 : ℝ) < (j ! : ℝ) := by
    exact_mod_cast Nat.factorial_pos j
  rw [div_le_div_iff₀ hfpos (by positivity)]
  calc ‖iteratedDeriv j g 0‖ * ρ ^ j ≤ ((j ! : ℝ) * C / ρ ^ j) * ρ ^ j := by
        exact mul_le_mul_of_nonneg_right this (by positivity)
    _ = (j ! : ℝ) * C := by
        field_simp
    _ = C * (j ! : ℝ) := by ring

/-! ### Coefficient bounds coming from the exponential type hypothesis -/

/-- A normalized form of the growth hypothesis. -/
theorem exists_normalized_growth {f : ℂ → ℂ}
    (hgrowth : ∃ A B : ℝ, ∀ z : ℂ, ‖f z‖ ≤ A * Real.exp (B * ‖z‖)) :
    ∃ A B : ℝ, 1 ≤ A ∧ 1 ≤ B ∧ ∀ z : ℂ, ‖f z‖ ≤ A * Real.exp (B * ‖z‖) := by
  obtain ⟨A, B, hAB⟩ := hgrowth
  have hA0 : 0 ≤ A := by
    by_contra h
    push_neg at h
    have := hAB 0
    have hexp : (0:ℝ) < Real.exp (B * ‖(0 : ℂ)‖) := Real.exp_pos _
    nlinarith [norm_nonneg (f 0)]
  refine ⟨A + 1, max B 1, by linarith, le_max_right _ _, ?_⟩
  intro z
  have h1 : A * Real.exp (B * ‖z‖) ≤ (A + 1) * Real.exp (max B 1 * ‖z‖) := by
    have hmono : Real.exp (B * ‖z‖) ≤ Real.exp (max B 1 * ‖z‖) := by
      apply Real.exp_le_exp.2
      have : B ≤ max B 1 := le_max_left _ _
      exact mul_le_mul_of_nonneg_right this (norm_nonneg z)
    have hpos : (0:ℝ) < Real.exp (max B 1 * ‖z‖) := Real.exp_pos _
    nlinarith
  exact le_trans (hAB z) h1

/-- The Taylor coefficients of a function satisfying an exponential-type bound on a disc of
radius `R` decay like `(e * B) ^ j / j !`, for all orders `j ≤ B * R`. -/
theorem norm_taylorCoeff_le_of_growth_on {f : ℂ → ℂ} (hfd : Differentiable ℂ f) {A B R : ℝ}
    (hA : 0 ≤ A) (hB : 0 < B) (hR : 0 < R)
    (hfb : ∀ z : ℂ, ‖z‖ ≤ R → ‖f z‖ ≤ A * Real.exp (B * ‖z‖)) {j : ℕ} (hj : (j : ℝ) ≤ B * R) :
    ‖taylorCoeff f j‖ ≤ A * (Real.exp 1 * B) ^ j / (j ! : ℝ) := by
  have hA0 : (0 : ℝ) ≤ A := hA
  have hB0 : (0 : ℝ) < B := hB
  rcases Nat.eq_zero_or_pos j with rfl | hj0
  · have h0 : taylorCoeff f 0 = f 0 := by simp [taylorCoeff]
    rw [h0]
    have hb := hfb 0 (by simpa using le_of_lt hR)
    simp only [norm_zero, mul_zero, Real.exp_zero, mul_one] at hb
    simpa using hb
  · set ρ : ℝ := (j : ℝ) / B with hρdef
    have hjR : (0:ℝ) < (j : ℝ) := by exact_mod_cast hj0
    have hρ : 0 < ρ := by positivity
    have hρR : ρ ≤ R := by
      rw [hρdef, div_le_iff₀ hB0]
      linarith [hj]
    have hbound : ∀ z : ℂ, ‖z‖ = ρ → ‖f z‖ ≤ A * Real.exp (j : ℝ) := by
      intro z hz
      have hb := hfb z (by rw [hz]; exact hρR)
      rw [hz] at hb
      have hBρ : B * ρ = (j : ℝ) := by
        rw [hρdef]; field_simp
      rwa [hBρ] at hb
    have hc := norm_taylorCoeff_le hfd hρ hbound j
    refine le_trans hc ?_
    have hρj : ρ ^ j = (j : ℝ) ^ j / B ^ j := by rw [hρdef, div_pow]
    have hfacle : ((j ! : ℕ) : ℝ) ≤ (j : ℝ) ^ j := by
      have := Nat.factorial_le_pow j
      exact_mod_cast this
    have hfacpos : (0 : ℝ) < ((j ! : ℕ) : ℝ) := by
      exact_mod_cast Nat.factorial_pos j
    have hexp : (Real.exp 1 * B) ^ j = Real.exp (j : ℝ) * B ^ j := by
      rw [mul_pow, ← Real.exp_nat_mul]
      ring_nf
    rw [hρj, hexp]
    rw [div_div_eq_mul_div]
    have hnum : (0 : ℝ) ≤ A * Real.exp (j : ℝ) * B ^ j := by positivity
    have hjpow : (0 : ℝ) < (j : ℝ) ^ j := by positivity
    calc A * Real.exp (j : ℝ) * B ^ j / (j : ℝ) ^ j
        ≤ A * Real.exp (j : ℝ) * B ^ j / ((j ! : ℕ) : ℝ) := by
          gcongr
      _ = A * (Real.exp (j : ℝ) * B ^ j) / ((j ! : ℕ) : ℝ) := by ring_nf

/-- Taylor coefficients are additive in the function. -/
theorem taylorCoeff_sub {g h : ℂ → ℂ} (hg : Differentiable ℂ g) (hh : Differentiable ℂ h) (j : ℕ) :
    taylorCoeff (fun z => g z - h z) j = taylorCoeff g j - taylorCoeff h j := by
  unfold taylorCoeff
  rw [iteratedDeriv_fun_sub hg.contDiff.contDiffAt hh.contDiff.contDiffAt]
  ring

/-- Coefficients of a polynomial which is bounded on a circle. -/
theorem norm_coeff_le_of_bound_on_sphere (Q : ℝ[X]) {ρ C : ℝ} (hρ : 0 < ρ)
    (hb : ∀ z : ℂ, ‖z‖ = ρ → ‖toEntire Q z‖ ≤ C) (j : ℕ) :
    |Q.coeff j| ≤ C / ρ ^ j := by
  have h := norm_taylorCoeff_le (differentiable_toEntire Q) hρ hb j
  rw [← toEntire_coeff_eq] at h
  simpa using h

/-! ### Heat majorization from coefficient bounds -/

/-- A polynomial is bounded on a disc by the sum of the absolute values of its coefficients
times powers of the radius. -/
theorem norm_toEntire_le (R : ℝ[X]) {z : ℂ} {r : ℝ} (hz : ‖z‖ ≤ r) :
    ‖toEntire R z‖ ≤ ∑ i ∈ Finset.range (R.natDegree + 1), |R.coeff i| * r ^ i := by
  have hsum : toEntire R z = ∑ i ∈ Finset.range (R.natDegree + 1), ((R.coeff i : ℝ) : ℂ) * z ^ i := by
    unfold toEntire
    rw [Polynomial.eval_eq_sum_range' (n := R.natDegree + 1)
      (lt_of_le_of_lt (Polynomial.natDegree_map_le) (by omega))]
    refine Finset.sum_congr rfl ?_
    intro i _
    simp [Polynomial.coeff_map]
  rw [hsum]
  refine le_trans (norm_sum_le _ _) (Finset.sum_le_sum ?_)
  intro i _
  rw [norm_mul, norm_pow, Complex.norm_real, Real.norm_eq_abs]
  have hpow : ‖z‖ ^ i ≤ r ^ i := by gcongr
  exact mul_le_mul_of_nonneg_left hpow (abs_nonneg _)

/-- If the coefficients of all the `Q n` obey a common bound of the shape `K * B₁ ^ j / j !`,
then the sequence is heat-majorized for every `t ≥ 0`. -/
theorem heatMajorized_of_coeff_bounds {t : ℝ} (ht : 0 ≤ t) (Q : ℕ → ℝ[X]) {K B₁ : ℝ}
    (hK : 0 ≤ K) (hB₁ : 0 < B₁)
    (h : ∀ n j, |(Q n).coeff j| ≤ K * B₁ ^ j / (j ! : ℝ)) :
    HeatMajorized t Q := by
  intro r hr
  refine ⟨fun k => K * Real.exp (B₁ * r) * ((t * B₁ ^ 2) ^ k / (k ! : ℝ)), ?_, ?_⟩
  · exact (Real.summable_pow_div_factorial (t * B₁ ^ 2)).mul_left _
  · intro n k z hz
    have hD : iteratedDeriv (2 * k) (toEntire (Q n)) z
        = toEntire ((⇑derivative)^[2 * k] (Q n)) z := by
      rw [iteratedDeriv_toEntire]
    rw [hD]
    -- coefficientwise bound for the derivative
    have hcoeff : ∀ i, |((⇑derivative)^[2 * k] (Q n)).coeff i| ≤ K * B₁ ^ (i + 2 * k) / (i ! : ℝ) := by
      intro i
      rw [Polynomial.coeff_iterate_derivative, nsmul_eq_mul, abs_mul, Nat.abs_cast]
      have hdesc : (((i + 2 * k).descFactorial (2 * k) : ℕ) : ℝ)
          = (((i + 2 * k)! : ℕ) : ℝ) / ((i ! : ℕ) : ℝ) := by
        have hkey := Nat.factorial_mul_descFactorial (show 2 * k ≤ i + 2 * k by omega)
        have hsub : i + 2 * k - 2 * k = i := by omega
        rw [hsub] at hkey
        have hi : (((i)! : ℕ) : ℝ) ≠ 0 := Nat.cast_ne_zero.2 (Nat.factorial_ne_zero _)
        field_simp
        rw [mul_comm]
        exact_mod_cast hkey
      rw [hdesc]
      have hb := h n (i + 2 * k)
      have hipos : (0 : ℝ) < ((i ! : ℕ) : ℝ) := by exact_mod_cast Nat.factorial_pos i
      have hfpos : (0 : ℝ) < (((i + 2 * k)! : ℕ) : ℝ) := by
        exact_mod_cast Nat.factorial_pos (i + 2 * k)
      calc (((i + 2 * k)! : ℕ) : ℝ) / ((i ! : ℕ) : ℝ) * |(Q n).coeff (i + 2 * k)|
          ≤ (((i + 2 * k)! : ℕ) : ℝ) / ((i ! : ℕ) : ℝ) * (K * B₁ ^ (i + 2 * k) / (((i + 2 * k)! : ℕ) : ℝ)) := by
            gcongr
        _ = K * B₁ ^ (i + 2 * k) / ((i ! : ℕ) : ℝ) := by
            field_simp
    -- bound the polynomial on the disc
    have hpoly : ‖toEntire ((⇑derivative)^[2 * k] (Q n)) z‖ ≤ K * B₁ ^ (2 * k) * Real.exp (B₁ * r) := by
      refine le_trans (norm_toEntire_le _ hz) ?_
      have hterm : ∀ i ∈ Finset.range (((⇑derivative)^[2 * k] (Q n)).natDegree + 1),
          |((⇑derivative)^[2 * k] (Q n)).coeff i| * r ^ i
            ≤ K * B₁ ^ (2 * k) * ((B₁ * r) ^ i / (i ! : ℝ)) := by
        intro i _
        have h1 := hcoeff i
        have h2 : (0 : ℝ) ≤ r ^ i := by positivity
        calc |((⇑derivative)^[2 * k] (Q n)).coeff i| * r ^ i
            ≤ (K * B₁ ^ (i + 2 * k) / (i ! : ℝ)) * r ^ i := by gcongr
          _ = K * B₁ ^ (2 * k) * ((B₁ * r) ^ i / (i ! : ℝ)) := by
              rw [mul_pow, pow_add]
              field_simp
      refine le_trans (Finset.sum_le_sum hterm) ?_
      rw [← Finset.mul_sum]
      have hexp : ∑ i ∈ Finset.range (((⇑derivative)^[2 * k] (Q n)).natDegree + 1),
          (B₁ * r) ^ i / (i ! : ℝ) ≤ Real.exp (B₁ * r) :=
        Real.sum_le_exp_of_nonneg (by positivity) _
      have hKB : (0 : ℝ) ≤ K * B₁ ^ (2 * k) := by positivity
      exact mul_le_mul_of_nonneg_left hexp hKB
    have hfacpos : (0 : ℝ) < (k ! : ℝ) := by exact_mod_cast Nat.factorial_pos k
    have htk : (0 : ℝ) ≤ t ^ k / (k ! : ℝ) := by positivity
    calc t ^ k / (k.factorial : ℝ) * ‖toEntire ((⇑derivative)^[2 * k] (Q n)) z‖
        ≤ t ^ k / (k.factorial : ℝ) * (K * B₁ ^ (2 * k) * Real.exp (B₁ * r)) :=
          mul_le_mul_of_nonneg_left hpoly htk
      _ = K * Real.exp (B₁ * r) * ((t * B₁ ^ 2) ^ k / (k ! : ℝ)) := by
          rw [mul_pow, ← pow_mul]
          ring

/-! ### Locally uniform convergence from coefficient convergence -/

theorem tendstoLocallyUniformly_of_coeff {f : ℂ → ℂ} (hfd : Differentiable ℂ f)
    (Q : ℕ → ℝ[X]) {K B₁ : ℝ} (hB₁ : 0 < B₁)
    (hbound : ∀ n j, |(Q n).coeff j| ≤ K * B₁ ^ j / (j ! : ℝ))
    (hconv : ∀ j, Tendsto (fun n => (((Q n).coeff j : ℝ) : ℂ)) atTop (𝓝 (taylorCoeff f j))) :
    TendstoLocallyUniformly (fun n => toEntire (Q n)) f atTop := by
  -- the Taylor coefficients of the limit obey the same bound
  have hfbound : ∀ j, ‖taylorCoeff f j‖ ≤ K * B₁ ^ j / (j ! : ℝ) := by
    intro j
    refine le_of_tendsto ((hconv j).norm) ?_
    filter_upwards with n
    simpa using hbound n j
  set d : ℕ → ℕ → ℂ := fun n j => (((Q n).coeff j : ℝ) : ℂ) - taylorCoeff f j with hd
  rw [Metric.tendstoLocallyUniformly_iff]
  intro ε hε x
  refine ⟨Metric.ball x 1, Metric.ball_mem_nhds x one_pos, ?_⟩
  set r : ℝ := ‖x‖ + 1 with hrdef
  have hr : 0 < r := by positivity
  have hsum_bound : Summable (fun j : ℕ => 2 * K * ((B₁ * r) ^ j / (j ! : ℝ))) :=
    (Real.summable_pow_div_factorial (B₁ * r)).mul_left _
  have hdb : ∀ n j, ‖d n j‖ * r ^ j ≤ 2 * K * ((B₁ * r) ^ j / (j ! : ℝ)) := by
    intro n j
    have h1 : ‖d n j‖ ≤ 2 * K * B₁ ^ j / (j ! : ℝ) := by
      have hb1 : ‖(((Q n).coeff j : ℝ) : ℂ)‖ ≤ K * B₁ ^ j / (j ! : ℝ) := by
        simpa using hbound n j
      have hb2 := hfbound j
      have hsub := norm_sub_le (((Q n).coeff j : ℝ) : ℂ) (taylorCoeff f j)
      have hsplit : 2 * K * B₁ ^ j / (j ! : ℝ)
          = K * B₁ ^ j / (j ! : ℝ) + K * B₁ ^ j / (j ! : ℝ) := by ring
      rw [hd]
      simp only
      rw [hsplit]
      linarith
    have h2 : (0 : ℝ) ≤ r ^ j := by positivity
    calc ‖d n j‖ * r ^ j ≤ (2 * K * B₁ ^ j / (j ! : ℝ)) * r ^ j := by gcongr
      _ = 2 * K * ((B₁ * r) ^ j / (j ! : ℝ)) := by
          rw [mul_pow]
          field_simp
  have hzero : ∀ j, Tendsto (fun n => ‖d n j‖ * r ^ j) atTop (𝓝 0) := by
    intro j
    have h0 : Tendsto (fun n => d n j) atTop (𝓝 0) := by
      have := (hconv j).sub (tendsto_const_nhds (x := taylorCoeff f j))
      simpa [hd] using this
    have := (h0.norm).mul_const (r ^ j)
    simpa using this
  have hc : Tendsto (fun n => ∑' j, ‖d n j‖ * r ^ j) atTop (𝓝 0) := by
    have h := tendsto_tsum_of_dominated_convergence (f := fun n j => ‖d n j‖ * r ^ j)
      (g := fun _ : ℕ => (0 : ℝ)) hsum_bound hzero ?_
    · simpa using h
    · filter_upwards with n j
      have hnn : (0 : ℝ) ≤ ‖d n j‖ * r ^ j := by positivity
      rw [Real.norm_eq_abs, abs_of_nonneg hnn]
      exact hdb n j
  filter_upwards [hc.eventually (gt_mem_nhds hε)] with n hn y hy
  have hynorm : ‖y‖ ≤ r := by
    have h1 : dist y x < 1 := by simpa [Metric.mem_ball] using hy
    have h2 : ‖y‖ ≤ ‖x‖ + ‖y - x‖ := by
      simpa using norm_add_le x (y - x)
    rw [hrdef]
    have : ‖y - x‖ < 1 := by simpa [dist_eq_norm] using h1
    linarith
  -- compare with the coefficient series
  have h1 : HasSum (fun j => (((Q n).coeff j : ℝ) : ℂ) * y ^ j) (toEntire (Q n) y) :=
    hasSum_toEntire (Q n) y
  have h2 : HasSum (fun j => taylorCoeff f j * y ^ j) (f y) := by
    have h := Complex.hasSum_taylorSeries_of_entire hfd 0 y
    have heq : (fun j : ℕ => ((j ! : ℂ))⁻¹ • (y - 0) ^ j • iteratedDeriv j f 0)
        = fun j : ℕ => taylorCoeff f j * y ^ j := by
      funext j
      simp only [taylorCoeff, sub_zero, smul_eq_mul]
      field_simp
    rwa [heq] at h
  have h3 : HasSum (fun j => d n j * y ^ j) (toEntire (Q n) y - f y) := by
    have := h1.sub h2
    refine this.congr_fun ?_
    intro j
    rw [hd]
    ring
  have hnormsummable : Summable (fun j => ‖d n j * y ^ j‖) := by
    refine Summable.of_nonneg_of_le (fun j => norm_nonneg _) (fun j => ?_) hsum_bound
    rw [norm_mul, norm_pow]
    calc ‖d n j‖ * ‖y‖ ^ j ≤ ‖d n j‖ * r ^ j := by gcongr
      _ ≤ _ := hdb n j
  have hsummable_d : Summable (fun j => ‖d n j‖ * r ^ j) :=
    Summable.of_nonneg_of_le (fun j => by positivity) (fun j => hdb n j) hsum_bound
  have hle : ‖toEntire (Q n) y - f y‖ ≤ ∑' j, ‖d n j‖ * r ^ j := by
    rw [← h3.tsum_eq]
    refine le_trans (norm_tsum_le_tsum_norm hnormsummable) ?_
    refine Summable.tsum_mono hnormsummable hsummable_d (fun j => ?_)
    rw [norm_mul, norm_pow]
    gcongr
  rw [dist_comm, Complex.dist_eq]
  exact lt_of_le_of_lt hle hn

/-! ### The key construction -/

/-- Main construction: from a Laguerre–Pólya function of exponential type one can produce,
with prescribed accuracy on any finite set of Taylor coefficients, a real-rooted polynomial
whose coefficients obey the universal bound `2 * A * (e * B) ^ j / j !`. -/
theorem exists_approx {f : ℂ → ℂ} (hf : IsLaguerrePolya f) {A B : ℝ} (hA : 1 ≤ A) (hB : 1 ≤ B)
    (hfb : ∀ z : ℂ, ‖f z‖ ≤ A * Real.exp (B * ‖z‖)) (ε : ℝ) (hε : 0 < ε) (J : ℕ) :
    ∃ Q : ℝ[X], Stage1MB.HasOnlyRealRoots Q ∧
      (∀ j, |Q.coeff j| ≤ 2 * A * (Real.exp 1 * B) ^ j / (j ! : ℝ)) ∧
      (∀ j ≤ J, ‖((Q.coeff j : ℝ) : ℂ) - taylorCoeff f j‖ ≤ ε) := by
  obtain ⟨-, P, hProots, hPconv⟩ := hf
  have hA0 : (0 : ℝ) < A := lt_of_lt_of_le one_pos hA
  have hB0 : (0 : ℝ) < B := lt_of_lt_of_le one_pos hB
  have heB : (1 : ℝ) ≤ Real.exp 1 * B := by
    have h1 : (1 : ℝ) ≤ Real.exp 1 := Real.one_le_exp (by norm_num)
    nlinarith
  have hfd : Differentiable ℂ f := by
    rw [← differentiableOn_univ]
    refine TendstoLocallyUniformlyOn.differentiableOn
      (tendstoLocallyUniformlyOn_univ.2 hPconv) ?_ isOpen_univ
    filter_upwards with n
    exact (differentiable_toEntire _).differentiableOn
  set S : ℝ := 2 * A * (Real.exp 1 * B) ^ J with hSdef
  have hS0 : 0 < S := by positivity
  -- choose the truncation degree `m`
  obtain ⟨m, hm1, hmJ, hmbig⟩ : ∃ m : ℕ, 1 ≤ m ∧ J ≤ m ∧ (J : ℝ) ^ 2 * S / (m : ℝ) ≤ ε / 2 := by
    obtain ⟨m0, hm0⟩ := exists_nat_gt (2 * (J : ℝ) ^ 2 * S / ε)
    refine ⟨max (max J 1) m0, le_trans (le_max_right J 1) (le_max_left _ _),
      le_trans (le_max_left J 1) (le_max_left _ _), ?_⟩
    have hmge : (m0 : ℝ) ≤ ((max (max J 1) m0 : ℕ) : ℝ) := by
      exact_mod_cast le_max_right (max J 1) m0
    have hm1' : 1 ≤ max (max J 1) m0 := le_trans (le_max_right J 1) (le_max_left _ _)
    have hmpos : (0 : ℝ) < ((max (max J 1) m0 : ℕ) : ℝ) := by
      exact_mod_cast lt_of_lt_of_le zero_lt_one hm1'
    rw [div_le_iff₀ hmpos]
    have h1 : 2 * (J : ℝ) ^ 2 * S / ε < ((max (max J 1) m0 : ℕ) : ℝ) := lt_of_lt_of_le hm0 hmge
    rw [div_lt_iff₀ hε] at h1
    nlinarith
  have hmpos : (0 : ℝ) < (m : ℝ) := by exact_mod_cast hm1
  set η : ℝ := min A (ε / 2) with hηdef
  have hη0 : 0 < η := lt_min hA0 (by linarith)
  have hηA : η ≤ A := min_le_left _ _
  have hηε : η ≤ ε / 2 := min_le_right _ _
  -- uniform approximation on the closed ball of radius `m`
  obtain ⟨k, hk⟩ : ∃ k, ∀ z : ℂ, ‖z‖ ≤ (m : ℝ) → ‖toEntire (P k) z - f z‖ ≤ η := by
    have hcompact : IsCompact (Metric.closedBall (0 : ℂ) (m : ℝ)) := isCompact_closedBall _ _
    have huniform : TendstoUniformlyOn (fun n => toEntire (P n)) f atTop
        (Metric.closedBall (0 : ℂ) (m : ℝ)) := by
      rw [← tendstoLocallyUniformlyOn_iff_tendstoUniformlyOn_of_compact hcompact]
      exact hPconv.tendstoLocallyUniformlyOn
    obtain ⟨k, hk⟩ := (Metric.tendstoUniformlyOn_iff.1 huniform η hη0).exists
    refine ⟨k, fun z hz => ?_⟩
    have h := hk z (by simpa [Metric.mem_closedBall] using hz)
    rw [dist_comm, Complex.dist_eq] at h
    exact le_of_lt h
  have hPkd : Differentiable ℂ (toEntire (P k)) := differentiable_toEntire _
  -- the Cauchy estimate gives a universal bound for the low coefficients of `P k`
  have hPcoeff : ∀ j, j ≤ m → |(P k).coeff j| ≤ 2 * A * (Real.exp 1 * B) ^ j / (j ! : ℝ) := by
    intro j hj
    have hgb : ∀ z : ℂ, ‖z‖ ≤ (m : ℝ) → ‖toEntire (P k) z‖ ≤ (2 * A) * Real.exp (B * ‖z‖) := by
      intro z hz
      have h1 := hk z hz
      have h2 := hfb z
      have h3 : ‖toEntire (P k) z‖ ≤ ‖toEntire (P k) z - f z‖ + ‖f z‖ := by
        simpa using norm_add_le (toEntire (P k) z - f z) (f z)
      have hexp1 : (1 : ℝ) ≤ Real.exp (B * ‖z‖) := Real.one_le_exp (by positivity)
      nlinarith
    have hjB : (j : ℝ) ≤ B * (m : ℝ) := by
      have hjm : (j : ℝ) ≤ (m : ℝ) := by exact_mod_cast hj
      nlinarith
    have hc := norm_taylorCoeff_le_of_growth_on hPkd (A := 2 * A) (B := B) (R := (m : ℝ))
      (by linarith) hB0 hmpos hgb hjB
    rw [← toEntire_coeff_eq] at hc
    simpa using hc
  refine ⟨truncScale m (P k), hasOnlyRealRoots_truncScale m hm1 (hProots k), ?_, ?_⟩
  · intro j
    rcases le_or_gt j m with hj | hj
    · rw [coeff_truncScale m (P k) j, abs_mul, abs_of_nonneg (wgt_nonneg _ _ _)]
      have h1 := wgt_le_one m (P k).natDegree j hm1 hj
      have h2 := hPcoeff j hj
      have hnn : 0 ≤ |(P k).coeff j| := abs_nonneg _
      have hw : 0 ≤ wgt m (P k).natDegree j := wgt_nonneg _ _ _
      nlinarith
    · rw [coeff_truncScale_eq_zero m (P k) hj, abs_zero]
      positivity
  · intro j hjJ
    have hjm : j ≤ m := le_trans hjJ hmJ
    have hjJR : (j : ℝ) ≤ (J : ℝ) := by exact_mod_cast hjJ
    -- the distortion introduced by the truncation weights
    have hpart1 : |(truncScale m (P k)).coeff j - (P k).coeff j| ≤ ε / 2 := by
      rw [coeff_truncScale m (P k) j]
      have hfactor : (wgt m (P k).natDegree j) * (P k).coeff j - (P k).coeff j
          = -((1 - wgt m (P k).natDegree j) * (P k).coeff j) := by ring
      rw [hfactor, abs_neg, abs_mul]
      have hw1 := wgt_le_one m (P k).natDegree j hm1 hjm
      have h1' : |1 - wgt m (P k).natDegree j| ≤ (j : ℝ) ^ 2 / (m : ℝ) := by
        rw [abs_of_nonneg (by linarith)]
        exact one_sub_wgt_le m (P k).natDegree j hm1 hjm
      have h2 := hPcoeff j hjm
      have h3 : 2 * A * (Real.exp 1 * B) ^ j / (j ! : ℝ) ≤ S := by
        rw [hSdef]
        have hp : (Real.exp 1 * B) ^ j ≤ (Real.exp 1 * B) ^ J := pow_le_pow_right₀ heB hjJ
        have hfac : (1 : ℝ) ≤ ((j ! : ℕ) : ℝ) := by
          exact_mod_cast Nat.one_le_iff_ne_zero.2 (Nat.factorial_ne_zero j)
        have hnum : (0 : ℝ) ≤ 2 * A * (Real.exp 1 * B) ^ j := by positivity
        calc 2 * A * (Real.exp 1 * B) ^ j / ((j ! : ℕ) : ℝ)
            ≤ 2 * A * (Real.exp 1 * B) ^ j / 1 := by gcongr
          _ = 2 * A * (Real.exp 1 * B) ^ j := by ring
          _ ≤ 2 * A * (Real.exp 1 * B) ^ J := by gcongr
      calc |1 - wgt m (P k).natDegree j| * |(P k).coeff j|
          ≤ ((j : ℝ) ^ 2 / (m : ℝ)) * S :=
            mul_le_mul h1' (le_trans h2 h3) (abs_nonneg _) (by positivity)
        _ ≤ ((J : ℝ) ^ 2 / (m : ℝ)) * S := by gcongr
        _ = (J : ℝ) ^ 2 * S / (m : ℝ) := by ring
        _ ≤ ε / 2 := hmbig
    -- the Cauchy estimate applied to the difference
    have hpart2 : ‖(((P k).coeff j : ℝ) : ℂ) - taylorCoeff f j‖ ≤ ε / 2 := by
      have hg : Differentiable ℂ (fun z => toEntire (P k) z - f z) := hPkd.sub hfd
      have hsphere : ∀ z : ℂ, ‖z‖ = (m : ℝ) → ‖toEntire (P k) z - f z‖ ≤ η :=
        fun z hz => hk z (le_of_eq hz)
      have hc := norm_taylorCoeff_le hg hmpos hsphere j
      rw [taylorCoeff_sub hPkd hfd, ← toEntire_coeff_eq] at hc
      refine le_trans hc ?_
      have hmj : (1 : ℝ) ≤ (m : ℝ) ^ j := one_le_pow₀ (by exact_mod_cast hm1)
      calc η / (m : ℝ) ^ j ≤ η := div_le_self (le_of_lt hη0) hmj
        _ ≤ ε / 2 := hηε
    have hsplit : ‖(((truncScale m (P k)).coeff j : ℝ) : ℂ) - taylorCoeff f j‖
        ≤ |(truncScale m (P k)).coeff j - (P k).coeff j|
          + ‖(((P k).coeff j : ℝ) : ℂ) - taylorCoeff f j‖ := by
      have hrw : (((truncScale m (P k)).coeff j : ℝ) : ℂ) - taylorCoeff f j
          = (((truncScale m (P k)).coeff j - (P k).coeff j : ℝ) : ℂ)
            + ((((P k).coeff j : ℝ) : ℂ) - taylorCoeff f j) := by
        push_cast
        ring
      rw [hrw]
      refine le_trans (norm_add_le _ _) (le_of_eq ?_)
      rw [Complex.norm_real, Real.norm_eq_abs]
    linarith

/-! ### A sanity check: the hypotheses are satisfiable -/

/-- The identity function belongs to the Laguerre–Pólya class and satisfies the growth
hypothesis, so the main theorem is not vacuous. -/
theorem isLaguerrePolya_id : IsLaguerrePolya (fun z : ℂ => z) := by
  refine ⟨fun x => by simp, fun _ => (X : ℝ[X]), fun n => ?_, ?_⟩
  · rw [Stage1MB.hasOnlyRealRoots_iff_splits]
    exact Polynomial.Splits.X
  · rw [Metric.tendstoLocallyUniformly_iff]
    intro ε hε x
    refine ⟨Set.univ, Filter.univ_mem, ?_⟩
    filter_upwards with n y _
    have : toEntire (X : ℝ[X]) y = y := by simp [toEntire]
    rw [this]
    simpa using hε

theorem growth_id : ∃ A B : ℝ, ∀ z : ℂ, ‖(fun w : ℂ => w) z‖ ≤ A * Real.exp (B * ‖z‖) := by
  refine ⟨1, 1, fun z => ?_⟩
  have h := Real.add_one_le_exp (‖z‖)
  simp only [one_mul]
  linarith [norm_nonneg z]

/-! ### Main theorem -/

/-- **Stage 1 for the restricted class.** A Laguerre–Pólya function of order at most one and
finite exponential type is the locally uniform limit of real-rooted real polynomials which are
moreover heat-majorized for every `t ≥ 0`. -/
theorem exists_LP_approx_heatMajorized_order_le_one {f : ℂ → ℂ} {t : ℝ}
    (ht : 0 ≤ t) (hf : IsLaguerrePolya f)
    (hgrowth : ∃ A B : ℝ, ∀ z : ℂ, ‖f z‖ ≤ A * Real.exp (B * ‖z‖)) :
    ∃ P : ℕ → ℝ[X], (∀ n, Stage1MB.HasOnlyRealRoots (P n)) ∧
      TendstoLocallyUniformly (fun n => toEntire (P n)) f atTop ∧
      HeatMajorized t P := by
  obtain ⟨A, B, hA, hB, hfb⟩ := exists_normalized_growth hgrowth
  -- `f` is entire, being a locally uniform limit of polynomials
  have hfd : Differentiable ℂ f := by
    rw [← differentiableOn_univ]
    refine TendstoLocallyUniformlyOn.differentiableOn
      (tendstoLocallyUniformlyOn_univ.2 hf.2.choose_spec.2) ?_ isOpen_univ
    filter_upwards with n
    exact (differentiable_toEntire _).differentiableOn
  -- choose approximants with accuracy `1 / (n + 1)` on the first `n` coefficients
  have hchoice : ∀ n : ℕ, ∃ Q : ℝ[X], Stage1MB.HasOnlyRealRoots Q ∧
      (∀ j, |Q.coeff j| ≤ 2 * A * (Real.exp 1 * B) ^ j / (j ! : ℝ)) ∧
      (∀ j ≤ n, ‖((Q.coeff j : ℝ) : ℂ) - taylorCoeff f j‖ ≤ 1 / (n + 1)) := by
    intro n
    exact exists_approx hf hA hB hfb (1 / (n + 1)) (by positivity) n
  choose Q hQroots hQbound hQclose using hchoice
  have hB₁ : (0 : ℝ) < Real.exp 1 * B := by positivity
  refine ⟨Q, hQroots, ?_, ?_⟩
  · refine tendstoLocallyUniformly_of_coeff hfd Q (K := 2 * A) (B₁ := Real.exp 1 * B)
      hB₁ hQbound ?_
    intro j
    rw [Metric.tendsto_atTop]
    intro ε hε
    obtain ⟨N, hN⟩ := exists_nat_gt (1 / ε)
    refine ⟨max N j, ?_⟩
    intro n hn
    have hnj : j ≤ n := le_trans (le_max_right N j) hn
    have h1 := hQclose n j hnj
    have hnN : (N : ℝ) ≤ (n : ℝ) := by
      exact_mod_cast le_trans (le_max_left N j) hn
    have hεpos : (0 : ℝ) < ε := hε
    have hlt : 1 / ((n : ℝ) + 1) < ε := by
      rw [div_lt_iff₀ (by positivity)]
      have : 1 / ε < (n : ℝ) + 1 := by linarith
      rw [div_lt_iff₀ hεpos] at this
      linarith
    rw [Complex.dist_eq]
    exact lt_of_le_of_lt h1 hlt
  · exact heatMajorized_of_coeff_bounds ht Q (by linarith) hB₁ hQbound

end Stage1LP
