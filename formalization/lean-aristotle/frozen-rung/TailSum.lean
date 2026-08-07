import FR.Leakage

/-!
# The unconditional tail estimate (Lemma 4.3) and the explicit L1 tolerance

This file completes Part 3 of `frozen-rung-pt-equivalence.tex`.

* `FrozenRung.integral_log_div_sq` — the elementary evaluation
  `∫_T^∞ log t / t² dt = (1 + log T)/T`, together with the integrability statement
  `FrozenRung.integrableOn_log_div_sq`;
* `FrozenRung.tail_bound_of_integral_le` — **Lemma 4.3**: the tail sum satisfies
  `τ(T) ≤ 16 (1 + log T)/T`, given the partial-summation comparison
  `τ(T) ≤ 2 ∫_T^∞ N(t)/(t - T₀)³ dt` and the zero-counting input `N(t) ≤ t log t`
  (Standing Input on the Riemann–von Mangoldt bound), which enter as hypotheses;
* `FrozenRung.leakage_tolerance_explicit` — the explicit form of the tolerance in
  **Theorem 4.4**, `ε(N,T) ≤ (N/π) e^{128 x_max (1+log T)/T} · 16(1+log T)/T`.
-/

namespace FrozenRung

open MeasureTheory Filter Real Set

/-! ## The elementary integral `∫_T^∞ log t / t² dt` -/

private theorem hasDerivAt_neg_one_add_log_div {T : ℝ} (hT : 0 < T) : ∀ t ∈ Ioi T,
    HasDerivAt (fun s : ℝ => -(1 + Real.log s) / s) (Real.log t / t ^ 2) t := by
  intro t ht
  have ht0 : 0 < t := lt_trans hT ht
  have h0 : HasDerivAt Real.log (1 / t) t := by
    simpa [one_div] using Real.hasDerivAt_log (ne_of_gt ht0)
  have h1 : HasDerivAt (fun s : ℝ => -(1 + Real.log s)) (-(1 / t)) t := (h0.const_add 1).neg
  have h2 : HasDerivAt (fun s : ℝ => s⁻¹) (-(t ^ 2)⁻¹) t := hasDerivAt_inv (ne_of_gt ht0)
  have h3 := h1.mul h2
  have heq : -(1 / t) * t⁻¹ + -(1 + Real.log t) * -(t ^ 2)⁻¹ = Real.log t / t ^ 2 := by
    field_simp; ring
  rw [heq] at h3
  exact h3.congr_of_eventuallyEq (by filter_upwards with s; simp [div_eq_mul_inv])

private theorem continuousWithinAt_neg_one_add_log_div {T : ℝ} (hT : 0 < T) :
    ContinuousWithinAt (fun s : ℝ => -(1 + Real.log s) / s) (Ici T) T :=
  ContinuousAt.continuousWithinAt
    (((continuousAt_const.add (Real.continuousAt_log (ne_of_gt hT))).neg).div
      continuousAt_id (ne_of_gt hT))

private theorem tendsto_neg_one_add_log_div :
    Tendsto (fun t : ℝ => -(1 + Real.log t) / t) atTop (nhds 0) := by
  have h1 : Tendsto (fun t : ℝ => Real.log t / t) atTop (nhds 0) := by
    simpa using Real.isLittleO_log_id_atTop.tendsto_div_nhds_zero
  have h2 : Tendsto (fun t : ℝ => (1 : ℝ) / t) atTop (nhds 0) := by
    simpa using tendsto_inv_atTop_zero
  simpa [neg_div, add_div] using (h2.add h1).neg

private theorem log_div_sq_nonneg {T : ℝ} (hT : 1 ≤ T) : ∀ t ∈ Ioi T, 0 ≤ Real.log t / t ^ 2 := by
  intro t ht
  have h1 : 1 ≤ t := le_of_lt (lt_of_le_of_lt hT ht)
  have := Real.log_nonneg h1
  positivity

theorem integrableOn_log_div_sq {T : ℝ} (hT : 1 ≤ T) :
    IntegrableOn (fun t : ℝ => Real.log t / t ^ 2) (Ioi T) volume :=
  MeasureTheory.integrableOn_Ioi_deriv_of_nonneg
    (continuousWithinAt_neg_one_add_log_div (lt_of_lt_of_le zero_lt_one hT))
    (hasDerivAt_neg_one_add_log_div (lt_of_lt_of_le zero_lt_one hT))
    (log_div_sq_nonneg hT) tendsto_neg_one_add_log_div

/-- `∫_T^∞ (log t)/t² dt = (1 + log T)/T`. -/
theorem integral_log_div_sq {T : ℝ} (hT : 1 ≤ T) :
    ∫ t in Ioi T, Real.log t / t ^ 2 = (1 + Real.log T) / T := by
  have hT0 : 0 < T := lt_of_lt_of_le zero_lt_one hT
  rw [MeasureTheory.integral_Ioi_of_hasDerivAt_of_nonneg
    (continuousWithinAt_neg_one_add_log_div hT0) (hasDerivAt_neg_one_add_log_div hT0)
    (log_div_sq_nonneg hT) tendsto_neg_one_add_log_div]
  ring

/-! ## Lemma 4.3: the tail sum estimate -/

/-- The pointwise comparison behind Lemma 4.3: for `t > T ≥ max(1, 2T₀)` and a counting
function bounded by `t log t`, one has `N(t)/(t-T₀)³ ≤ 8 (log t)/t²`. -/
theorem counting_div_cube_le {T T₀ : ℝ} (hT : 1 ≤ T) (hTT₀ : 2 * T₀ ≤ T) (N : ℝ → ℝ)
    (hNle : ∀ t ∈ Ioi T, N t ≤ t * Real.log t) :
    ∀ t ∈ Ioi T, N t / (t - T₀) ^ 3 ≤ 8 * (Real.log t / t ^ 2) := by
  intro t ht
  have ht1 : 1 < t := lt_of_le_of_lt hT ht
  have ht0 : 0 < t := lt_trans zero_lt_one ht1
  have hhalf : t / 2 ≤ t - T₀ := by
    have : T₀ ≤ t / 2 := by linarith [ht.out]
    linarith
  have hpos : 0 < t / 2 := by linarith
  have hcube : (t / 2) ^ 3 ≤ (t - T₀) ^ 3 := pow_le_pow_left₀ (le_of_lt hpos) hhalf 3
  have hc0 : (0 : ℝ) < (t / 2) ^ 3 := by positivity
  have hd0 : (0 : ℝ) < (t - T₀) ^ 3 := lt_of_lt_of_le hc0 hcube
  have hlog : 0 ≤ Real.log t := Real.log_nonneg (le_of_lt ht1)
  calc N t / (t - T₀) ^ 3 ≤ t * Real.log t / (t - T₀) ^ 3 :=
        (div_le_div_iff_of_pos_right hd0).mpr (hNle t ht)
    _ ≤ t * Real.log t / (t / 2) ^ 3 := div_le_div_of_nonneg_left (by positivity) hc0 hcube
    _ = 8 * (Real.log t / t ^ 2) := by field_simp; ring

/-- **Lemma 4.3 (unconditional tail estimate).**  Let `N` be the zero-counting function,
subject to the Riemann–von Mangoldt bound `N(t) ≤ t log t` of the Standing Inputs, and let
`tau` be the tail sum, dominated by the partial-summation integral
`2 ∫_T^∞ N(t)/(t-T₀)³ dt`.  Then for `T ≥ max(2, 2T₀)` we have `tau ≤ 16(1 + log T)/T`. -/
theorem tail_bound_of_integral_le {T T₀ tau : ℝ} (hT : 1 ≤ T) (hTT₀ : 2 * T₀ ≤ T) (N : ℝ → ℝ)
    (hN0 : ∀ t ∈ Ioi T, 0 ≤ N t)
    (hNle : ∀ t ∈ Ioi T, N t ≤ t * Real.log t)
    (hsum : tau ≤ 2 * ∫ t in Ioi T, N t / (t - T₀) ^ 3) :
    tau ≤ 16 * (1 + Real.log T) / T := by
  have hT0 : 0 < T := lt_of_lt_of_le zero_lt_one hT
  have hnn : ∀ t ∈ Ioi T, 0 ≤ N t / (t - T₀) ^ 3 := by
    intro t ht
    have ht1 : 1 < t := lt_of_le_of_lt hT ht
    have hhalf : t / 2 ≤ t - T₀ := by
      have : T₀ ≤ t / 2 := by linarith [ht.out]
      linarith
    have hpos : (0 : ℝ) < t / 2 := by linarith
    have hd0 : (0 : ℝ) < (t - T₀) ^ 3 :=
      lt_of_lt_of_le (by positivity) (pow_le_pow_left₀ (le_of_lt hpos) hhalf 3)
    exact div_nonneg (hN0 t ht) (le_of_lt hd0)
  have hint : IntegrableOn (fun t : ℝ => 8 * (Real.log t / t ^ 2)) (Ioi T) volume :=
    (integrableOn_log_div_sq hT).const_mul 8
  have hmono : (∫ t in Ioi T, N t / (t - T₀) ^ 3) ≤ ∫ t in Ioi T, 8 * (Real.log t / t ^ 2) := by
    refine MeasureTheory.integral_mono_of_nonneg ?_ hint ?_
    · filter_upwards [self_mem_ae_restrict measurableSet_Ioi] with t ht using hnn t ht
    · filter_upwards [self_mem_ae_restrict measurableSet_Ioi] with t ht using
        counting_div_cube_le hT hTT₀ N hNle t ht
  have hval : (∫ t in Ioi T, 8 * (Real.log t / t ^ 2)) = 8 * ((1 + Real.log T) / T) := by
    rw [MeasureTheory.integral_const_mul, integral_log_div_sq hT]
  rw [hval] at hmono
  have : tau ≤ 2 * (8 * ((1 + Real.log T) / T)) := le_trans hsum (by linarith)
  calc tau ≤ 2 * (8 * ((1 + Real.log T) / T)) := this
    _ = 16 * (1 + Real.log T) / T := by ring

/-! ## The explicit tolerance in Theorem 4.4 -/

/-- **Theorem 4.4, explicit tolerance.** Combining the leakage bound with Lemma 4.3, the
`λ_min` tolerance is at most `(N/π) e^{128 x_max (1+log T)/T} · 16(1+log T)/T`. -/
theorem leakage_tolerance_explicit {T xmax tau : ℝ} {card : ℕ} (hxmax : 0 ≤ xmax)
    (htau : 0 ≤ tau) (hbd : tau ≤ 16 * (1 + Real.log T) / T) :
    (card / Real.pi) * Real.exp (8 * xmax * tau) * tau ≤
      (card / Real.pi) * Real.exp (128 * xmax * ((1 + Real.log T) / T)) *
        (16 * (1 + Real.log T) / T) := by
  have hpi := Real.pi_pos
  have hcard : (0 : ℝ) ≤ (card : ℝ) / Real.pi := by positivity
  have hexp : Real.exp (8 * xmax * tau) ≤ Real.exp (128 * xmax * ((1 + Real.log T) / T)) := by
    refine Real.exp_le_exp.2 ?_
    have h1 : 8 * xmax * tau ≤ 8 * xmax * (16 * (1 + Real.log T) / T) :=
      mul_le_mul_of_nonneg_left hbd (by positivity)
    calc 8 * xmax * tau ≤ 8 * xmax * (16 * (1 + Real.log T) / T) := h1
      _ = 128 * xmax * ((1 + Real.log T) / T) := by ring
  have hexp0 : (0 : ℝ) < Real.exp (8 * xmax * tau) := Real.exp_pos _
  have hstep1 : (card / Real.pi) * Real.exp (8 * xmax * tau) ≤
      (card / Real.pi) * Real.exp (128 * xmax * ((1 + Real.log T) / T)) :=
    mul_le_mul_of_nonneg_left hexp hcard
  have hpos2 : (0 : ℝ) ≤ (card / Real.pi) * Real.exp (128 * xmax * ((1 + Real.log T) / T)) :=
    mul_nonneg hcard (le_of_lt (Real.exp_pos _))
  calc (card / Real.pi) * Real.exp (8 * xmax * tau) * tau
      ≤ (card / Real.pi) * Real.exp (128 * xmax * ((1 + Real.log T) / T)) * tau :=
        mul_le_mul_of_nonneg_right hstep1 htau
    _ ≤ (card / Real.pi) * Real.exp (128 * xmax * ((1 + Real.log T) / T)) *
          (16 * (1 + Real.log T) / T) := mul_le_mul_of_nonneg_left hbd hpos2

end FrozenRung
