import FR.Kernels

/-!
# Part 3 (L1): the tail-leakage bound

This file formalizes the kernel-algebra and counting content of Part 3 of
`frozen-rung-pt-equivalence.tex`.

* `FrozenRung.norm_blaschke_sq` and `FrozenRung.norm_blaschke_le_one` — the consequences of the
  two-point identity used throughout;
* `FrozenRung.norm_one_sub_prod_le` — the telescoping inequality
  `|1 - ∏ u_j| ≤ ∑ |1 - u_j|` for `|u_j| ≤ 1`;
* `FrozenRung.norm_schurKernel_blaschkeProd_le` — the window bound
  `|K_B(z,w)| ≤ τ/π` on the tail Blaschke kernel;
* `FrozenRung.inv_norm_blaschkeProd_sq_le` — the bound `|B(z)|⁻² ≤ exp(8 x_max τ)`;
* `FrozenRung.leakage_quadratic_form_bound` — **Theorem 4.4 (L1)** in quadratic-form
  (equivalently, `λ_min`) shape: under the Krein–Langer factorization hypothesis, entering here
  as the positivity of the `S`-Gram, the window Gram of `K_{S/B}` satisfies
  `x* G x ≥ -ε ‖x‖²` with `ε = (N/π) e^{8 x_max τ} τ`.

The tail estimate `τ(T) ≤ 16(1+log T)/T` (Lemma 4.3) is proved in
`FrozenRung.tail_bound_of_integral_le` from the partial-summation comparison, whose
integral is evaluated in `FrozenRung.integral_log_div_sq`.
-/

namespace FrozenRung

open Complex Matrix Finset
open scoped ComplexConjugate ComplexOrder

/-! ## Blaschke factors: modulus identities -/

theorem conj_add_ne_zero {α z : ℂ} (hz : z + conj α ≠ 0) : conj z + α ≠ 0 := by
  intro h
  apply hz
  have := congrArg (starRingEnd ℂ) h
  simpa using this

theorem norm_blaschke_sq {α z : ℂ} (hz : z + conj α ≠ 0) :
    ‖blaschke α z‖ ^ 2 = 1 - 4 * α.re * z.re / ‖z + conj α‖ ^ 2 := by
  have h := blaschke_two_point (α := α) (z := z) (w := z) hz (conj_add_ne_zero hz)
  have h2 : blaschke α z * conj (blaschke α z) = ((‖blaschke α z‖ ^ 2 : ℝ) : ℂ) := by
    rw [Complex.mul_conj, Complex.normSq_eq_norm_sq]
  have h3 : (z + conj α) * (conj z + α) = ((‖z + conj α‖ ^ 2 : ℝ) : ℂ) := by
    have hc : conj z + α = conj (z + conj α) := by simp
    rw [hc, Complex.mul_conj, Complex.normSq_eq_norm_sq]
  have h4 : z + conj z = ((2 * z.re : ℝ) : ℂ) := by rw [Complex.add_conj]
  rw [h2, h3, h4] at h
  have hnz : ‖z + conj α‖ ^ 2 ≠ 0 := by
    have : ‖z + conj α‖ ≠ 0 := norm_ne_zero_iff.2 hz
    positivity
  have hcast : ((1 - ‖blaschke α z‖ ^ 2 : ℝ) : ℂ)
      = ((4 * α.re * z.re / ‖z + conj α‖ ^ 2 : ℝ) : ℂ) := by
    push_cast at h ⊢
    rw [h]; ring
  have := Complex.ofReal_inj.1 hcast
  linarith

theorem norm_blaschke_le_one {α z : ℂ} (hα : 0 ≤ α.re) (hz : 0 ≤ z.re) : ‖blaschke α z‖ ≤ 1 := by
  rcases eq_or_ne (z + conj α) 0 with h | h
  · simp [blaschke, h]
  · have hsq := norm_blaschke_sq (α := α) (z := z) h
    have hnn : 0 ≤ 4 * α.re * z.re / ‖z + conj α‖ ^ 2 := by positivity
    nlinarith [norm_nonneg (blaschke α z), hsq]

/-! ## The telescoping inequality -/

theorem norm_one_sub_prod_le {ι : Type*} (s : Finset ι) (u : ι → ℂ) (hu : ∀ i ∈ s, ‖u i‖ ≤ 1) :
    ‖1 - ∏ i ∈ s, u i‖ ≤ ∑ i ∈ s, ‖1 - u i‖ := by
  classical
  induction s using Finset.induction with
  | empty => simp
  | insert a s ha ih =>
      rw [Finset.prod_insert ha, Finset.sum_insert ha]
      have hus : ∀ i ∈ s, ‖u i‖ ≤ 1 := fun i hi => hu i (Finset.mem_insert_of_mem hi)
      have hua : ‖u a‖ ≤ 1 := hu a (Finset.mem_insert_self a s)
      have key : (1 : ℂ) - u a * ∏ i ∈ s, u i = (1 - u a) + u a * (1 - ∏ i ∈ s, u i) := by ring
      calc ‖(1 : ℂ) - u a * ∏ i ∈ s, u i‖
          = ‖(1 - u a) + u a * (1 - ∏ i ∈ s, u i)‖ := by rw [key]
        _ ≤ ‖1 - u a‖ + ‖u a * (1 - ∏ i ∈ s, u i)‖ := norm_add_le _ _
        _ ≤ ‖1 - u a‖ + ∑ i ∈ s, ‖1 - u i‖ := by
              have h1 : ‖u a * (1 - ∏ i ∈ s, u i)‖ = ‖u a‖ * ‖1 - ∏ i ∈ s, u i‖ := norm_mul _ _
              have h2 : ‖u a‖ * ‖1 - ∏ i ∈ s, u i‖ ≤ ‖1 - ∏ i ∈ s, u i‖ := by
                nlinarith [norm_nonneg (1 - ∏ i ∈ s, u i), norm_nonneg (u a)]
              have h3 := ih hus
              linarith [h1 ▸ h2]

/-! ## The window bound on the tail Blaschke kernel -/

/-- A window point is separated from a ghost above the window: `|z + conj α| ≥ |Im α| - T₀`. -/
theorem window_dist_ge {z α : ℂ} {T₀ : ℝ} (hz : |z.im| ≤ T₀) :
    |α.im| - T₀ ≤ ‖z + conj α‖ := by
  have h1 : |(z + conj α).im| ≤ ‖z + conj α‖ := Complex.abs_im_le_norm _
  have h2 : (z + conj α).im = z.im - α.im := by simp [sub_eq_add_neg]
  have h3 : |α.im| - |z.im| ≤ |z.im - α.im| := by
    have := abs_sub_abs_le_abs_sub α.im z.im
    rwa [abs_sub_comm α.im z.im] at this
  rw [h2] at h1
  linarith

/-- **The window bound `|K_B(z,w)| ≤ τ/π`** for the Blaschke product over the ghosts above the
window, with `τ = ∑ σ_j / (|γ_j| - T₀)²`. -/
theorem norm_schurKernel_blaschkeProd_le {ι : Type*} [Fintype ι] (α : ι → ℂ) {z w : ℂ} {T₀ : ℝ}
    (hα : ∀ i, 0 < (α i).re) (hz : 0 ≤ z.re) (hw : 0 ≤ w.re)
    (hzim : |z.im| ≤ T₀) (hwim : |w.im| ≤ T₀) (hgap : ∀ i, T₀ < |(α i).im|)
    (hzw : z + conj w ≠ 0) :
    ‖schurKernel (fun u => ∏ i, blaschke (α i) u) z w‖ ≤
      (∑ i, (α i).re / (|(α i).im| - T₀) ^ 2) / Real.pi := by
  have hpi := Real.pi_pos
  have hzwn : (0:ℝ) < ‖z + conj w‖ := norm_pos_iff.2 hzw
  -- separation of each ghost from the window
  have hsep : ∀ i, (0:ℝ) < |(α i).im| - T₀ := fun i => by linarith [hgap i]
  have hzα : ∀ i, z + conj (α i) ≠ 0 := by
    intro i h
    have := window_dist_ge (z := z) (α := α i) hzim
    rw [h] at this
    simp at this
    linarith [hsep i]
  have hwα : ∀ i, conj w + α i ≠ 0 := by
    intro i h
    have hc : w + conj (α i) = 0 := by
      have := congrArg (starRingEnd ℂ) h
      simpa using this
    have := window_dist_ge (z := w) (α := α i) hwim
    rw [hc] at this
    simp at this
    linarith [hsep i]
  -- the product form of the kernel numerator
  have hprod : (∏ i, blaschke (α i) z) * conj (∏ i, blaschke (α i) w)
      = ∏ i, (blaschke (α i) z * conj (blaschke (α i) w)) := by
    rw [map_prod, ← Finset.prod_mul_distrib]
  have hbound : ∀ i, ‖1 - blaschke (α i) z * conj (blaschke (α i) w)‖ ≤
      2 * (α i).re * ‖z + conj w‖ / (|(α i).im| - T₀) ^ 2 := by
    intro i
    rw [blaschke_two_point (hzα i) (hwα i)]
    rw [norm_div, norm_mul, norm_mul, norm_mul]
    have hre : ‖(2 : ℂ)‖ * ‖((α i).re : ℂ)‖ = 2 * (α i).re := by
      simp [abs_of_pos (hα i)]
    rw [hre]
    have h1 : (|(α i).im| - T₀) ≤ ‖z + conj (α i)‖ := window_dist_ge hzim
    have h2 : (|(α i).im| - T₀) ≤ ‖conj w + α i‖ := by
      have hc : ‖conj w + α i‖ = ‖w + conj (α i)‖ := by
        rw [show conj w + α i = conj (w + conj (α i)) by simp, RCLike.norm_conj]
      rw [hc]
      exact window_dist_ge hwim
    have h3 : (0:ℝ) < ‖z + conj (α i)‖ := lt_of_lt_of_le (hsep i) h1
    have h4 : (0:ℝ) < ‖conj w + α i‖ := lt_of_lt_of_le (hsep i) h2
    have h5 : (|(α i).im| - T₀) ^ 2 ≤ ‖z + conj (α i)‖ * ‖conj w + α i‖ := by
      have := hsep i
      nlinarith
    have h6 : (0:ℝ) ≤ 2 * (α i).re * ‖z + conj w‖ := by
      have := (hα i).le
      positivity
    have hsq : (0:ℝ) < (|(α i).im| - T₀) ^ 2 := by have := hsep i; positivity
    exact div_le_div_of_nonneg_left h6 hsq h5
  -- assemble
  have hnum : ‖1 - (∏ i, blaschke (α i) z) * conj (∏ i, blaschke (α i) w)‖ ≤
      ∑ i, 2 * (α i).re * ‖z + conj w‖ / (|(α i).im| - T₀) ^ 2 := by
    rw [hprod]
    refine le_trans (norm_one_sub_prod_le Finset.univ _ ?_) (Finset.sum_le_sum fun i _ => hbound i)
    intro i _
    rw [norm_mul, RCLike.norm_conj]
    have := norm_blaschke_le_one (α := α i) (z := z) (hα i).le hz
    have := norm_blaschke_le_one (α := α i) (z := w) (hα i).le hw
    nlinarith [norm_nonneg (blaschke (α i) z), norm_nonneg (blaschke (α i) w)]
  have hden : ‖(2 : ℂ) * (Real.pi : ℂ) * (z + conj w)‖ = 2 * Real.pi * ‖z + conj w‖ := by
    rw [norm_mul, norm_mul]
    simp [abs_of_pos hpi]
  rw [schurKernel, norm_div, hden]
  rw [div_le_div_iff₀ (by positivity) (by positivity)]
  have hsum : ∑ i, 2 * (α i).re * ‖z + conj w‖ / (|(α i).im| - T₀) ^ 2
      = 2 * ‖z + conj w‖ * ∑ i, (α i).re / (|(α i).im| - T₀) ^ 2 := by
    rw [Finset.mul_sum]
    refine Finset.sum_congr rfl fun i _ => ?_
    field_simp
  rw [hsum] at hnum
  nlinarith [hnum, hzwn, hpi]

/-! ## The `D`-bound -/

theorem inv_one_sub_le_exp {u : ℝ} (hu : 0 ≤ u) (h : u ≤ 1 / 2) : (1 - u)⁻¹ ≤ Real.exp (2 * u) := by
  have h1 : (0:ℝ) < 1 - u := by linarith
  have h2 : 1 + 2 * u ≤ Real.exp (2 * u) := by
    have := Real.add_one_le_exp (2 * u)
    linarith
  have h3 : (1 - u)⁻¹ ≤ 1 + 2 * u := by
    rw [inv_le_iff_one_le_mul₀ h1]
    nlinarith
  linarith

/-- **The `D`-bound.** With `τ = ∑ σ_j/(|γ_j| - T₀)²` and the separation hypothesis
`4 σ_j x_max/(|γ_j| - T₀)² ≤ 1/2`, the reciprocal Blaschke product is bounded on the window:
`|B(z)|⁻² ≤ exp(8 x_max τ)`. -/
theorem inv_norm_blaschkeProd_sq_le {ι : Type*} [Fintype ι] (α : ι → ℂ) {z : ℂ} {T₀ xmax : ℝ}
    (hα : ∀ i, 0 < (α i).re) (hz : 0 ≤ z.re) (hzmax : z.re ≤ xmax)
    (hzim : |z.im| ≤ T₀) (hgap : ∀ i, T₀ < |(α i).im|)
    (hsmall : ∀ i, 4 * (α i).re * xmax / (|(α i).im| - T₀) ^ 2 ≤ 1 / 2) :
    (‖∏ i, blaschke (α i) z‖ ^ 2)⁻¹ ≤
      Real.exp (8 * xmax * ∑ i, (α i).re / (|(α i).im| - T₀) ^ 2) := by
  have hsep : ∀ i, (0:ℝ) < |(α i).im| - T₀ := fun i => by linarith [hgap i]
  have hxmax : 0 ≤ xmax := le_trans hz hzmax
  have hzα : ∀ i, z + conj (α i) ≠ 0 := by
    intro i h
    have := window_dist_ge (z := z) (α := α i) hzim
    rw [h] at this
    simp at this
    linarith [hsep i]
  set u : ι → ℝ := fun i => 4 * (α i).re * z.re / ‖z + conj (α i)‖ ^ 2 with hu
  set v : ι → ℝ := fun i => 4 * (α i).re * xmax / (|(α i).im| - T₀) ^ 2 with hv
  have hu0 : ∀ i, 0 ≤ u i := by
    intro i
    have := (hα i).le
    positivity
  have huv : ∀ i, u i ≤ v i := by
    intro i
    have h1 : (|(α i).im| - T₀) ≤ ‖z + conj (α i)‖ := window_dist_ge hzim
    have h2 : (0:ℝ) < ‖z + conj (α i)‖ := lt_of_lt_of_le (hsep i) h1
    have h3 : (|(α i).im| - T₀) ^ 2 ≤ ‖z + conj (α i)‖ ^ 2 := by
      have := hsep i
      nlinarith
    have h4 : 4 * (α i).re * z.re ≤ 4 * (α i).re * xmax := by
      have := (hα i).le
      nlinarith
    have hsq : (0:ℝ) < (|(α i).im| - T₀) ^ 2 := by have := hsep i; positivity
    have hden : (0:ℝ) < ‖z + conj (α i)‖ ^ 2 := by positivity
    calc u i = 4 * (α i).re * z.re / ‖z + conj (α i)‖ ^ 2 := rfl
      _ ≤ 4 * (α i).re * xmax / ‖z + conj (α i)‖ ^ 2 :=
          (div_le_div_iff_of_pos_right hden).mpr h4
      _ ≤ v i := by
          refine div_le_div_of_nonneg_left ?_ hsq h3
          have := (hα i).le
          positivity
  have hnormsq : ∀ i, ‖blaschke (α i) z‖ ^ 2 = 1 - u i := fun i => norm_blaschke_sq (hzα i)
  have hupos : ∀ i, 0 < 1 - u i := by
    intro i
    have := huv i
    have := hsmall i
    have : u i ≤ 1 / 2 := le_trans (huv i) (hsmall i)
    linarith
  have hprod : ‖∏ i, blaschke (α i) z‖ ^ 2 = ∏ i, (1 - u i) := by
    rw [norm_prod, ← Finset.prod_pow]
    exact Finset.prod_congr rfl fun i _ => hnormsq i
  rw [hprod, ← Finset.prod_inv_distrib]
  have hexp : Real.exp (8 * xmax * ∑ i, (α i).re / (|(α i).im| - T₀) ^ 2) =
      ∏ i, Real.exp (2 * v i) := by
    rw [← Real.exp_sum]
    congr 1
    rw [Finset.mul_sum]
    refine Finset.sum_congr rfl fun i _ => ?_
    rw [hv]
    field_simp
    ring
  rw [hexp]
  refine Finset.prod_le_prod (fun i _ => ?_) (fun i _ => ?_)
  · exact le_of_lt (inv_pos.2 (hupos i))
  · refine le_trans (inv_one_sub_le_exp (hu0 i) (le_trans (huv i) (hsmall i))) ?_
    exact Real.exp_le_exp.2 (by linarith [huv i])

/-! ## Theorem 4.4 (L1) -/

/-- The Euclidean square norm of a coefficient vector. -/
noncomputable def sqNorm {ι : Type*} [Fintype ι] (x : ι → ℂ) : ℝ := ∑ i, ‖x i‖ ^ 2

theorem sqNorm_nonneg {ι : Type*} [Fintype ι] (x : ι → ℂ) : 0 ≤ sqNorm x :=
  Finset.sum_nonneg fun i _ => by positivity

theorem qform_sub {ι : Type*} [Fintype ι] (M N : Matrix ι ι ℂ) (x : ι → ℂ) :
    qform (M - N) x = qform M x - qform N x := by
  unfold qform
  rw [Matrix.sub_mulVec, dotProduct_sub, Complex.sub_re]

theorem qform_nonneg_of_posSemidef {ι : Type*} [Fintype ι] {M : Matrix ι ι ℂ}
    (h : M.PosSemidef) (x : ι → ℂ) : 0 ≤ qform M x :=
  h.re_dotProduct_nonneg x

/-- Crude entrywise bound on a Hermitian form. -/
theorem abs_qform_le {ι : Type*} [Fintype ι] (M : Matrix ι ι ℂ) (x : ι → ℂ) :
    |qform M x| ≤ ∑ i, ∑ j, ‖M i j‖ * ‖x i‖ * ‖x j‖ := by
  refine (Complex.abs_re_le_norm _).trans ?_
  have h2 : star x ⬝ᵥ M *ᵥ x = ∑ i, ∑ j, conj (x i) * (M i j * x j) := by
    simp [dotProduct, Matrix.mulVec, Finset.mul_sum]
  rw [h2]
  refine (norm_sum_le _ _).trans (Finset.sum_le_sum fun i _ => ?_)
  refine (norm_sum_le _ _).trans (Finset.sum_le_sum fun j _ => ?_)
  rw [norm_mul, norm_mul, RCLike.norm_conj]
  ring_nf
  exact le_refl _

/-- If every entry of `M` has modulus at most `c`, the Hermitian form of `M` is bounded by
`c · N · ‖x‖²` where `N` is the mesh size. -/
theorem abs_qform_le_of_entries_le {ι : Type*} [Fintype ι] {M : Matrix ι ι ℂ} {c : ℝ}
    (hc : 0 ≤ c) (h : ∀ i j, ‖M i j‖ ≤ c) (x : ι → ℂ) :
    |qform M x| ≤ c * Fintype.card ι * sqNorm x := by
  refine (abs_qform_le M x).trans ?_
  have step1 : ∑ i, ∑ j, ‖M i j‖ * ‖x i‖ * ‖x j‖ ≤ ∑ i, ∑ j, c * (‖x i‖ * ‖x j‖) := by
    refine Finset.sum_le_sum fun i _ => Finset.sum_le_sum fun j _ => ?_
    have : ‖M i j‖ * ‖x i‖ * ‖x j‖ = ‖M i j‖ * (‖x i‖ * ‖x j‖) := by ring
    rw [this]
    exact mul_le_mul_of_nonneg_right (h i j) (by positivity)
  refine step1.trans ?_
  have step2 : ∑ i, ∑ j, c * (‖x i‖ * ‖x j‖) = c * (∑ i, ‖x i‖) ^ 2 := by
    rw [sq, Finset.sum_mul_sum, Finset.mul_sum]
    exact Finset.sum_congr rfl fun i _ => by rw [Finset.mul_sum]
  rw [step2]
  have step3 : (∑ i, ‖x i‖) ^ 2 ≤ (Fintype.card ι : ℝ) * sqNorm x := by
    simpa [sqNorm, Finset.card_univ] using
      (sq_sum_le_card_mul_sum_sq (s := (Finset.univ : Finset ι)) (f := fun i => ‖x i‖))
  calc c * (∑ i, ‖x i‖) ^ 2 ≤ c * ((Fintype.card ι : ℝ) * sqNorm x) :=
        mul_le_mul_of_nonneg_left step3 hc
    _ = c * Fintype.card ι * sqNorm x := by ring

/-- **Theorem 4.4 (L1), quadratic-form shape.** Let `Z = {z_i}` be a window mesh, let `S` be a
Schur-class function on the window, so that its Gram matrix is positive semidefinite, and let `B`
be the tail Blaschke product.  If the tail kernel is uniformly small on the window,
`|K_B(z_i,z_j)| ≤ τ/π`, and the reciprocal `|1/B|²` is bounded by `e^{8 x_max τ}` there, then the
Gram matrix of the ratio kernel `K_{S/B}` satisfies
`x* G x ≥ -(N/π) e^{8 x_max τ} τ ‖x‖²`,
i.e. its smallest eigenvalue is at least `-(N/π) e^{8 x_max τ} τ`. -/
theorem leakage_quadratic_form_bound {ι : Type*} [Fintype ι] [DecidableEq ι]
    (S B : ℂ → ℂ) (z : ι → ℂ) (τ xmax : ℝ) (hτ : 0 ≤ τ)
    (hBne : ∀ i, B (z i) ≠ 0)
    (hS : (gramMatrix (schurKernel S) z).PosSemidef)
    (hB : ∀ i j, ‖schurKernel B (z i) (z j)‖ ≤ τ / Real.pi)
    (hD : ∀ i, ‖1 / B (z i)‖ ^ 2 ≤ Real.exp (8 * xmax * τ))
    (x : ι → ℂ) :
    -((Fintype.card ι / Real.pi) * Real.exp (8 * xmax * τ) * τ) * sqNorm x ≤
      qform (gramMatrix (schurKernel fun u => S u / B u) z) x := by
  classical
  have hpi := Real.pi_pos
  set D : Matrix ι ι ℂ := Matrix.diagonal (fun i => 1 / B (z i)) with hDdef
  set GS := gramMatrix (schurKernel S) z with hGS
  set GB := gramMatrix (schurKernel B) z with hGB
  -- the Gram splitting identity in matrix form
  have hsplit : gramMatrix (schurKernel fun u => S u / B u) z = Dᴴᴴ * (GS - GB) * Dᴴ := by
    ext i j
    have hd : (D * (GS - GB) * Dᴴ) i j
        = (1 / B (z i)) * ((GS - GB) i j) * conj (1 / B (z j)) := by
      simp [hDdef, Matrix.diagonal_mul, Matrix.mul_diagonal, mul_assoc]
    rw [Matrix.conjTranspose_conjTranspose, hd]
    simpa [hGS, hGB, gramMatrix] using schurKernel_div (S := S) (B := B) (hBne i) (hBne j)
  set y : ι → ℂ := Dᴴ *ᵥ x with hy
  have hqf : qform (gramMatrix (schurKernel fun u => S u / B u) z) x = qform GS y - qform GB y := by
    rw [hsplit, qform_conjTranspose_mul_mul, qform_sub]
  -- the size of the transformed vector
  have hyi : ∀ i, ‖y i‖ ^ 2 = ‖1 / B (z i)‖ ^ 2 * ‖x i‖ ^ 2 := by
    intro i
    have : y i = conj (1 / B (z i)) * x i := by
      simp [hy, hDdef, Matrix.mulVec, dotProduct, Matrix.diagonal_apply]
    rw [this, norm_mul, RCLike.norm_conj, mul_pow]
  have hsq : sqNorm y ≤ Real.exp (8 * xmax * τ) * sqNorm x := by
    rw [sqNorm, sqNorm, Finset.mul_sum]
    refine Finset.sum_le_sum fun i _ => ?_
    rw [hyi i]
    exact mul_le_mul_of_nonneg_right (hD i) (by positivity)
  -- the tail term is small
  have hcnn : (0:ℝ) ≤ τ / Real.pi := by positivity
  have hGBbd : |qform GB y| ≤ (τ / Real.pi) * Fintype.card ι * sqNorm y :=
    abs_qform_le_of_entries_le hcnn (fun i j => hB i j) y
  have hcard : (0:ℝ) ≤ (Fintype.card ι : ℝ) := by positivity
  have hfinal : (τ / Real.pi) * Fintype.card ι * sqNorm y ≤
      (Fintype.card ι / Real.pi) * Real.exp (8 * xmax * τ) * τ * sqNorm x := by
    have := mul_le_mul_of_nonneg_left hsq (by positivity : (0:ℝ) ≤ (τ / Real.pi) * Fintype.card ι)
    refine this.trans (le_of_eq ?_)
    field_simp
  have hpos : 0 ≤ qform GS y := qform_nonneg_of_posSemidef hS y
  have h1 : qform GB y ≤ (τ / Real.pi) * Fintype.card ι * sqNorm y :=
    le_trans (le_abs_self _) hGBbd
  rw [hqf]
  linarith

end FrozenRung
