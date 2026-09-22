import RequestProject.PartialFractions

/-!
# The half-line piece `W (a,b)`

We prove the first display of Lemma PF:
`W (a,b) = ∫_0^∞ dt/((t+a)^s (t+b)^s) = ∑_{k=2}^s (c_k a^{1-k} + d_k b^{1-k})/(k-1) + c_1 log (b/a)`
for `0 < a`, `0 < b`, `a ≠ b` and `s` a positive integer.

The proof runs the fundamental theorem of calculus on `(t₀, ∞)` with the explicit antiderivative
`Fanti` obtained from the partial-fraction decomposition `pf_at_s`.
-/

open MeasureTheory Set Filter
open scoped BigOperators Topology

namespace WeldPF

/-- The explicit antiderivative of `t ↦ ((t+α)^s (t+β)^s)⁻¹` coming from partial fractions. -/
noncomputable def Fanti (s : ℕ) (α β : ℝ) (t : ℝ) : ℝ :=
  cCoeff s 1 α β * (Real.log (t + α) - Real.log (t + β))
    - ∑ k ∈ Finset.Icc 2 s,
        (cCoeff s k α β * (t + α) ^ (1 - (k : ℤ)) + dCoeff s k α β * (t + β) ^ (1 - (k : ℤ)))
          / ((k : ℝ) - 1)

/-- The coefficients only depend on the difference of the two arguments. -/
lemma cCoeff_shift (s k : ℕ) (t α β : ℝ) : cCoeff s k (t + α) (t + β) = cCoeff s k α β := by
  simp only [cCoeff]
  congr 2
  ring

lemma dCoeff_shift (s k : ℕ) (t α β : ℝ) : dCoeff s k (t + α) (t + β) = dCoeff s k α β := by
  simp only [dCoeff]
  exact cCoeff_shift s k t β α

/-- `d_1 = -c_1`, because `2s-1` is odd. -/
lemma dCoeff_one_eq_neg {s : ℕ} (hs : 0 < s) (a b : ℝ) :
    dCoeff s 1 a b = -cCoeff s 1 a b := by
  have hsign : ((-1 : ℝ)) ^ (-(2 * (s : ℤ) - ((1 : ℕ) : ℤ))) = -1 := by
    have h2 : (2 * (s : ℤ) - ((1 : ℕ) : ℤ)) = ((2 * s - 1 : ℕ) : ℤ) := by
      have h : 1 ≤ 2 * s := by omega
      push_cast [Nat.cast_sub h]; ring
    rw [h2, neg_one_zpow_neg_natCast]
    have hodd : Odd (2 * s - 1) := Nat.Even.sub_odd (by omega) (even_two_mul s) odd_one
    rw [hodd.neg_one_pow]
  simp only [dCoeff, cCoeff]
  have h1 : a - b = (-1 : ℝ) * (b - a) := by ring
  rw [h1, mul_zpow, hsign]
  ring

/-- Splitting off the `k = 1` term of the partial-fraction decomposition, where `d_1 = -c_1`
makes the two logarithms pair up. -/
lemma pf_split_one {s : ℕ} (hs : 0 < s) {t α β : ℝ} (ha : t + α ≠ 0) (hb : t + β ≠ 0)
    (hab : α ≠ β) :
    cCoeff s 1 α β * ((t + α)⁻¹ - (t + β)⁻¹)
      + ∑ k ∈ Finset.Icc 2 s,
          (cCoeff s k α β * (t + α) ^ (-(k : ℤ)) + dCoeff s k α β * (t + β) ^ (-(k : ℤ)))
      = ((t + α) ^ s * (t + β) ^ s)⁻¹ := by
  rw [pf_at_s hs ha hb hab]
  have hIcc : Finset.Icc 1 s = insert 1 (Finset.Icc 2 s) := by
    ext x; simp only [Finset.mem_Icc, Finset.mem_insert]; omega
  have hnot : (1 : ℕ) ∉ Finset.Icc 2 s := by simp
  rw [hIcc, Finset.sum_insert hnot, dCoeff_one_eq_neg hs]
  push_cast
  rw [zpow_neg_one, zpow_neg_one]
  ring

/-- The antiderivative at a point is minus the claimed closed form. -/
lemma Fanti_eq_neg_Wform {s : ℕ} {t α β : ℝ} (ha : t + α ≠ 0) (hb : t + β ≠ 0) :
    Fanti s α β t = -Wform s (t + α) (t + β) := by
  simp only [Fanti, Wform, cCoeff_shift, dCoeff_shift]
  rw [Real.log_div hb ha]
  ring

/-- `Fanti` is an antiderivative of the integrand. -/
lemma Fanti_hasDerivAt {s : ℕ} (hs : 0 < s) {α β t : ℝ} (ha : t + α ≠ 0) (hb : t + β ≠ 0)
    (hab : α ≠ β) : HasDerivAt (Fanti s α β) (((t + α) ^ s * (t + β) ^ s)⁻¹) t := by
  have hda : HasDerivAt (fun t : ℝ => t + α) 1 t := (hasDerivAt_id t).add_const α
  have hdb : HasDerivAt (fun t : ℝ => t + β) 1 t := (hasDerivAt_id t).add_const β
  have hlog : HasDerivAt (fun t : ℝ => Real.log (t + α) - Real.log (t + β))
      ((t + α)⁻¹ - (t + β)⁻¹) t := by
    have h1 : HasDerivAt (fun t : ℝ => Real.log (t + α)) ((t + α)⁻¹) t := by
      simpa [one_div] using hda.log ha
    have h2 : HasDerivAt (fun t : ℝ => Real.log (t + β)) ((t + β)⁻¹) t := by
      simpa [one_div] using hdb.log hb
    exact h1.sub h2
  have hterm : ∀ k ∈ Finset.Icc 2 s,
      HasDerivAt (fun t : ℝ => (cCoeff s k α β * (t + α) ^ (1 - (k : ℤ))
          + dCoeff s k α β * (t + β) ^ (1 - (k : ℤ))) / ((k : ℝ) - 1))
        (-(cCoeff s k α β * (t + α) ^ (-(k : ℤ))
          + dCoeff s k α β * (t + β) ^ (-(k : ℤ)))) t := by
    intro k hk
    simp only [Finset.mem_Icc] at hk
    have hkR : ((k : ℝ) - 1) ≠ 0 := by
      have h2 : (2 : ℝ) ≤ (k : ℝ) := by exact_mod_cast hk.1
      linarith
    have hpa : HasDerivAt (fun t : ℝ => (t + α) ^ (1 - (k : ℤ)))
        ((1 - (k : ℝ)) * (t + α) ^ (-(k : ℤ))) t := by
      have h := (hasDerivAt_zpow (1 - (k : ℤ)) (t + α) (Or.inl ha)).comp t hda
      simpa [show (1 - (k : ℤ)) - 1 = -(k : ℤ) by ring] using h
    have hpb : HasDerivAt (fun t : ℝ => (t + β) ^ (1 - (k : ℤ)))
        ((1 - (k : ℝ)) * (t + β) ^ (-(k : ℤ))) t := by
      have h := (hasDerivAt_zpow (1 - (k : ℤ)) (t + β) (Or.inl hb)).comp t hdb
      simpa [show (1 - (k : ℤ)) - 1 = -(k : ℤ) by ring] using h
    have h := ((hpa.const_mul (cCoeff s k α β)).add
      (hpb.const_mul (dCoeff s k α β))).div_const ((k : ℝ) - 1)
    convert h using 1
    field_simp
    ring
  have hsum := HasDerivAt.sum hterm
  have hfun : (∑ k ∈ Finset.Icc 2 s, fun t : ℝ =>
        (cCoeff s k α β * (t + α) ^ (1 - (k : ℤ))
          + dCoeff s k α β * (t + β) ^ (1 - (k : ℤ))) / ((k : ℝ) - 1))
      = fun t : ℝ => ∑ k ∈ Finset.Icc 2 s,
        (cCoeff s k α β * (t + α) ^ (1 - (k : ℤ))
          + dCoeff s k α β * (t + β) ^ (1 - (k : ℤ))) / ((k : ℝ) - 1) := by
    funext t'
    simp
  rw [hfun] at hsum
  have hF := (hlog.const_mul (cCoeff s 1 α β)).sub hsum
  have hval : cCoeff s 1 α β * ((t + α)⁻¹ - (t + β)⁻¹)
      - ∑ k ∈ Finset.Icc 2 s, -(cCoeff s k α β * (t + α) ^ (-(k : ℤ))
          + dCoeff s k α β * (t + β) ^ (-(k : ℤ)))
      = ((t + α) ^ s * (t + β) ^ s)⁻¹ := by
    rw [← pf_split_one hs ha hb hab, Finset.sum_neg_distrib]
    ring
  rw [← hval]
  exact hF

/-- The antiderivative tends to `0` at `+∞`. -/
lemma Fanti_tendsto_atTop (s : ℕ) (α β : ℝ) :
    Tendsto (Fanti s α β) atTop (𝓝 0) := by
  have hlog : Tendsto (fun t : ℝ => Real.log (t + α) - Real.log (t + β)) atTop (𝓝 0) := by
    have hb : Tendsto (fun t : ℝ => t + β) atTop atTop :=
      tendsto_atTop_add_const_right _ β tendsto_id
    have h2 : Tendsto (fun t : ℝ => (α - β) / (t + β)) atTop (𝓝 0) :=
      Tendsto.div_atTop tendsto_const_nhds hb
    have h3 : Tendsto (fun t : ℝ => 1 + (α - β) / (t + β)) atTop (𝓝 1) := by
      simpa using tendsto_const_nhds.add h2
    have h4 : Tendsto (fun t : ℝ => Real.log (1 + (α - β) / (t + β))) atTop (𝓝 0) := by
      simpa using (Real.continuousAt_log one_ne_zero).tendsto.comp h3
    refine h4.congr' ?_
    filter_upwards [eventually_gt_atTop (max (-α) (-β))] with t ht
    have hta : 0 < t + α := by
      have := lt_of_le_of_lt (le_max_left (-α) (-β)) ht; linarith
    have htb : 0 < t + β := by
      have := lt_of_le_of_lt (le_max_right (-α) (-β)) ht; linarith
    rw [← Real.log_div (ne_of_gt hta) (ne_of_gt htb)]
    congr 1
    field_simp
    ring
  have hpow : ∀ γ : ℝ, ∀ k ∈ Finset.Icc 2 s,
      Tendsto (fun t : ℝ => (t + γ) ^ (1 - (k : ℤ))) atTop (𝓝 0) := by
    intro γ k hk
    simp only [Finset.mem_Icc] at hk
    have hneg : (1 - (k : ℤ)) < 0 := by
      have : (2 : ℤ) ≤ (k : ℤ) := by exact_mod_cast hk.1
      omega
    have h := tendsto_zpow_atTop_zero (𝕜 := ℝ) hneg
    exact h.comp (tendsto_atTop_add_const_right _ γ tendsto_id)
  have hterms : Tendsto (fun t : ℝ => ∑ k ∈ Finset.Icc 2 s,
      (cCoeff s k α β * (t + α) ^ (1 - (k : ℤ))
        + dCoeff s k α β * (t + β) ^ (1 - (k : ℤ))) / ((k : ℝ) - 1)) atTop (𝓝 0) := by
    have : Tendsto (fun t : ℝ => ∑ k ∈ Finset.Icc 2 s,
        (cCoeff s k α β * (t + α) ^ (1 - (k : ℤ))
          + dCoeff s k α β * (t + β) ^ (1 - (k : ℤ))) / ((k : ℝ) - 1))
        atTop (𝓝 (∑ k ∈ Finset.Icc 2 s, (0 : ℝ))) := by
      refine tendsto_finset_sum _ fun k hk => ?_
      have ha := hpow α k hk
      have hb := hpow β k hk
      simpa using (((ha.const_mul (cCoeff s k α β)).add
        (hb.const_mul (dCoeff s k α β))).div_const ((k : ℝ) - 1))
    simpa using this
  have := (hlog.const_mul (cCoeff s 1 α β)).sub hterms
  simpa [Fanti] using this

/-- On a half-line where both factors stay positive, the integrand is regular and positive. -/
lemma pf_deriv_facts {s : ℕ} (hs : 0 < s) {t₀ α β : ℝ} (ha : 0 < t₀ + α) (hb : 0 < t₀ + β)
    (hab : α ≠ β) :
    (∀ x ∈ Ioi t₀, HasDerivAt (Fanti s α β) (((x + α) ^ s * (x + β) ^ s)⁻¹) x) ∧
      (∀ x ∈ Ioi t₀, 0 ≤ ((x + α) ^ s * (x + β) ^ s)⁻¹) := by
  constructor
  · intro x hx
    simp only [mem_Ioi] at hx
    exact Fanti_hasDerivAt hs (by intro h; nlinarith) (by intro h; nlinarith) hab
  · intro x hx
    simp only [mem_Ioi] at hx
    have h1 : 0 < x + α := by linarith
    have h2 : 0 < x + β := by linarith
    exact le_of_lt (inv_pos.mpr (mul_pos (pow_pos h1 s) (pow_pos h2 s)))

/-- The integrand is integrable on any half-line on which it is regular. -/
theorem integrableOn_pf_Ioi {s : ℕ} (hs : 0 < s) {t₀ α β : ℝ} (ha : 0 < t₀ + α) (hb : 0 < t₀ + β)
    (hab : α ≠ β) :
    IntegrableOn (fun t => ((t + α) ^ s * (t + β) ^ s)⁻¹) (Ioi t₀) := by
  obtain ⟨hderiv, hnonneg⟩ := pf_deriv_facts hs ha hb hab
  exact integrableOn_Ioi_deriv_of_nonneg
    (Fanti_hasDerivAt hs (ne_of_gt ha) (ne_of_gt hb) hab).continuousAt.continuousWithinAt
    hderiv hnonneg (Fanti_tendsto_atTop s α β)

/-- The closed form of the half-line integral, from an arbitrary base point. -/
theorem integral_Ioi_pf {s : ℕ} (hs : 0 < s) {t₀ α β : ℝ} (ha : 0 < t₀ + α) (hb : 0 < t₀ + β)
    (hab : α ≠ β) :
    ∫ t in Ioi t₀, ((t + α) ^ s * (t + β) ^ s)⁻¹ = Wform s (t₀ + α) (t₀ + β) := by
  obtain ⟨hderiv, hnonneg⟩ := pf_deriv_facts hs ha hb hab
  rw [integral_Ioi_of_hasDerivAt_of_nonneg
    (Fanti_hasDerivAt hs (ne_of_gt ha) (ne_of_gt hb) hab).continuousAt.continuousWithinAt
    hderiv hnonneg (Fanti_tendsto_atTop s α β)]
  rw [Fanti_eq_neg_Wform (ne_of_gt ha) (ne_of_gt hb)]
  ring

/-- **Lemma PF, first display.** The exact closed form of
`W (a,b) = ∫_0^∞ dt / ((t+a)^s (t+b)^s)` at integer `s ≥ 1`, for `0 < a`, `0 < b`, `a ≠ b`. -/
theorem W_eq_Wform {s : ℕ} (hs : 0 < s) {a b : ℝ} (ha : 0 < a) (hb : 0 < b) (hab : a ≠ b) :
    W s a b = Wform s a b := by
  have h := integral_Ioi_pf hs (t₀ := 0) (α := a) (β := b) (by simpa using ha) (by simpa using hb)
    hab
  simpa [W] using h

end WeldPF
