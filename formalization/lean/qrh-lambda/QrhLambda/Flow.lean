import QrhLambda.Defs

/-!
# The barrier flow `β(u) = (q + 2/c)e^{−cu} − 2/c`

Facts used to glue substeps (AF §12; review B §§4.2, 5, 6):
* `flow_zero`, `flow_add` (semigroup), `flow_antitone`, `continuous_flow`;
* `flow_ge_lin`: convexity, `β(u) ≥ q − (2 + cq)u` (the strict-entry estimate S1);
* `flow_lag`: the exact crossing time of the terminal level, `β(log(1+z)/c) = q_e` with
  `z = c(q − q_e)/(2 + c q_e)`.
-/

namespace QrhLambda

lemma flow_zero (q c : ℝ) : flow q c 0 = q := by simp [flow]

lemma flow_add (q c u₁ u₂ : ℝ) : flow (flow q c u₁) c u₂ = flow q c (u₁ + u₂) := by
  unfold flow
  rw [show -(c * (u₁ + u₂)) = -(c * u₁) + -(c * u₂) by ring, Real.exp_add]
  ring

lemma continuous_flow (q c : ℝ) : Continuous (flow q c) := by
  unfold flow
  fun_prop

lemma flow_antitone {q c : ℝ} (hc : 0 < c) (hq : 0 ≤ q + 2 / c) : Antitone (flow q c) := by
  intro u₁ u₂ h
  unfold flow
  have : Real.exp (-(c * u₂)) ≤ Real.exp (-(c * u₁)) := by
    apply Real.exp_le_exp.mpr
    nlinarith
  nlinarith [mul_le_mul_of_nonneg_left this hq]

lemma flow_ge_lin {q c u : ℝ} (hc : 0 < c) (hq : 0 ≤ q + 2 / c) :
    q - (2 + c * q) * u ≤ flow q c u := by
  unfold flow
  have h1 : 1 + -(c * u) ≤ Real.exp (-(c * u)) := by
    have := Real.add_one_le_exp (-(c * u))
    linarith
  have h2 := mul_le_mul_of_nonneg_left h1 hq
  have hc' : c ≠ 0 := ne_of_gt hc
  have : (q + 2 / c) * (1 + -(c * u)) - 2 / c = q - (2 + c * q) * u := by
    field_simp
    ring
  linarith

lemma flow_lag {q c qe : ℝ} (hc : 0 < c) (hqe : 0 ≤ qe) (hq : qe < q) :
    flow q c (Real.log (1 + c * (q - qe) / (2 + c * qe)) / c) = qe := by
  unfold flow
  have hc' : c ≠ 0 := ne_of_gt hc
  have hd : 0 < 2 + c * qe := by positivity
  have hz : 0 < 1 + c * (q - qe) / (2 + c * qe) := by
    have : 0 < c * (q - qe) / (2 + c * qe) := by
      apply div_pos (mul_pos hc (by linarith)) hd
    linarith
  rw [show -(c * (Real.log (1 + c * (q - qe) / (2 + c * qe)) / c)) =
      -Real.log (1 + c * (q - qe) / (2 + c * qe)) by field_simp]
  rw [Real.exp_neg, Real.exp_log hz]
  have h1 : 1 + c * (q - qe) / (2 + c * qe) = (2 + c * q) / (2 + c * qe) := by
    field_simp
    ring
  rw [h1, inv_div]
  have h2 : 0 < 2 + c * q := by nlinarith
  have h2' : (2 + c * q) ≠ 0 := h2.ne'
  have e1 : q + 2 / c = (2 + c * q) / c := by field_simp; ring
  rw [e1, div_mul_div_comm, mul_comm (2 + c * q) (2 + c * qe), ← div_mul_div_comm, div_self h2', mul_one,
    div_sub_div_same]
  field_simp
  ring

end QrhLambda
