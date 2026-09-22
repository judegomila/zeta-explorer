import RequestProject.WIntegral
import RequestProject.FinitePiece

/-!
# The three-piece assembly

Third display of Lemma PF: splitting the `u`-line at `0` and `T` (with `c = 1 + T` held exact in
the middle piece),

`I (T, ρ) = ρ^{-1/2} (ρ^s W (ρ, 1+T) + ρ^s ∫_0^T ((x+ρ)(1+T-x))^{-s} dx + ρ^s W (ρ+T, 1))`.
-/

open MeasureTheory Set Filter
open scoped BigOperators Topology

namespace WeldPF

/-- The integrand of `I (T, ρ)`. -/
noncomputable def pcIntegrand (s : ℕ) (T ρ : ℝ) (u : ℝ) : ℝ :=
  ((1 + |u| / ρ) ^ s * (1 + |u - T|) ^ s)⁻¹

lemma continuous_pcIntegrand {s : ℕ} {T ρ : ℝ} (hρ : 0 < ρ) :
    Continuous (pcIntegrand s T ρ) := by
  refine Continuous.inv₀ ?_ ?_
  · exact (((continuous_const.add (continuous_abs.div_const ρ)).pow s).mul
      (((continuous_const.add (continuous_abs.comp (continuous_id.sub continuous_const)))).pow s))
  · intro u
    have h1 : 0 < 1 + |u| / ρ := by positivity
    have h2 : 0 < 1 + |u - T| := by positivity
    exact ne_of_gt (mul_pos (pow_pos h1 s) (pow_pos h2 s))

lemma pcIntegrand_left {s : ℕ} {T ρ : ℝ} (hT : 0 ≤ T) (hρ : 0 < ρ) {t : ℝ} (ht : 0 ≤ t) :
    pcIntegrand s T ρ (-t) = ρ ^ s * ((t + ρ) ^ s * (t + (1 + T)) ^ s)⁻¹ := by
  have h1 : |(-t)| = t := by rw [abs_neg, abs_of_nonneg ht]
  have h2 : |(-t) - T| = t + T := by
    rw [abs_of_nonpos (by linarith)]; ring
  have h3 : 1 + t / ρ = (t + ρ) / ρ := by field_simp; ring
  have h4 : 1 + (t + T) = t + (1 + T) := by ring
  rw [pcIntegrand, h1, h2, h3, h4, div_pow, div_mul_eq_mul_div, inv_div, div_eq_mul_inv]

lemma pcIntegrand_mid {s : ℕ} {T ρ : ℝ} (hρ : 0 < ρ) {x : ℝ} (hx : 0 ≤ x) (hxT : x ≤ T) :
    pcIntegrand s T ρ x = ρ ^ s * ((x + ρ) ^ s * (1 + T - x) ^ s)⁻¹ := by
  have h1 : |x| = x := abs_of_nonneg hx
  have h2 : |x - T| = T - x := by rw [abs_of_nonpos (by linarith)]; ring
  have h3 : 1 + x / ρ = (x + ρ) / ρ := by field_simp; ring
  have h4 : 1 + (T - x) = 1 + T - x := by ring
  rw [pcIntegrand, h1, h2, h3, h4, div_pow, div_mul_eq_mul_div, inv_div, div_eq_mul_inv]

lemma pcIntegrand_right {s : ℕ} {T ρ : ℝ} (hT : 0 ≤ T) (hρ : 0 < ρ) {u : ℝ} (hu : T < u) :
    pcIntegrand s T ρ u = ρ ^ s * ((u + ρ) ^ s * (u + (1 - T)) ^ s)⁻¹ := by
  have h1 : |u| = u := abs_of_nonneg (le_trans hT hu.le)
  have h2 : |u - T| = u - T := abs_of_nonneg (by linarith)
  have h3 : 1 + u / ρ = (u + ρ) / ρ := by field_simp; ring
  have h4 : 1 + (u - T) = u + (1 - T) := by ring
  rw [pcIntegrand, h1, h2, h3, h4, div_pow, div_mul_eq_mul_div, inv_div, div_eq_mul_inv]

/-- Reflection transfers integrability from `(0, ∞)` to `(-∞, 0]`. -/
lemma integrableOn_comp_neg_Iic {f : ℝ → ℝ} {c : ℝ} (h : IntegrableOn f (Ici (-c))) :
    IntegrableOn (fun x => f (-x)) (Iic c) := by
  have hm : MeasurableEmbedding (fun x : ℝ => -x) := (Homeomorph.neg ℝ).measurableEmbedding
  have hp : MeasurePreserving (fun x : ℝ => -x) volume volume := Measure.measurePreserving_neg _
  rw [show Iic c = (fun x : ℝ => -x) ⁻¹' (Ici (-c)) by ext x; simp]
  exact (hp.integrableOn_comp_preimage hm).2 h

lemma integrableOn_pcIntegrand_Iic {s : ℕ} (hs : 0 < s) {T ρ : ℝ} (hT : 0 ≤ T) (hρ : 0 < ρ)
    (h1 : ρ ≠ 1 + T) : IntegrableOn (pcIntegrand s T ρ) (Iic 0) := by
  have hbase : IntegrableOn (fun t : ℝ => ρ ^ s * ((t + ρ) ^ s * (t + (1 + T)) ^ s)⁻¹) (Ioi 0) :=
    ((integrableOn_pf_Ioi hs (t₀ := 0) (α := ρ) (β := 1 + T) (by simpa using hρ)
      (by simp; linarith) h1).const_mul (ρ ^ s))
  have hbase' : IntegrableOn (fun t : ℝ => ρ ^ s * ((t + ρ) ^ s * (t + (1 + T)) ^ s)⁻¹)
      (Ici (-(0 : ℝ))) := by
    rw [neg_zero, integrableOn_Ici_iff_integrableOn_Ioi]
    exact hbase
  have hrefl := integrableOn_comp_neg_Iic hbase'
  refine hrefl.congr_fun ?_ measurableSet_Iic
  intro u hu
  simp only [mem_Iic] at hu
  rw [show u = -(-u) by ring, pcIntegrand_left hT hρ (by linarith), neg_neg]

lemma integrableOn_pcIntegrand_Ioi {s : ℕ} (hs : 0 < s) {T ρ : ℝ} (hT : 0 ≤ T) (hρ : 0 < ρ)
    (h2 : ρ + T ≠ 1) : IntegrableOn (pcIntegrand s T ρ) (Ioi T) := by
  have hne : ρ ≠ 1 - T := by intro h; apply h2; rw [h]; ring
  have hbase : IntegrableOn (fun u : ℝ => ρ ^ s * ((u + ρ) ^ s * (u + (1 - T)) ^ s)⁻¹) (Ioi T) :=
    ((integrableOn_pf_Ioi hs (t₀ := T) (α := ρ) (β := 1 - T) (by linarith)
      (by simp) hne).const_mul (ρ ^ s))
  refine hbase.congr_fun ?_ measurableSet_Ioi
  intro u hu
  simp only [mem_Ioi] at hu
  exact (pcIntegrand_right hT hρ hu).symm

lemma intervalIntegrable_pcIntegrand {s : ℕ} {T ρ : ℝ} (hρ : 0 < ρ) :
    IntervalIntegrable (pcIntegrand s T ρ) volume 0 T :=
  (continuous_pcIntegrand hρ).intervalIntegrable 0 T

lemma integral_Iic_pcIntegrand {s : ℕ} (hs : 0 < s) {T ρ : ℝ} (hT : 0 ≤ T) (hρ : 0 < ρ)
    (h1 : ρ ≠ 1 + T) :
    ∫ u in Iic (0 : ℝ), pcIntegrand s T ρ u = ρ ^ s * W s ρ (1 + T) := by
  have hrefl : ∫ u in Iic (0 : ℝ), pcIntegrand s T ρ u
      = ∫ t in Ioi (0 : ℝ), pcIntegrand s T ρ (-t) := by
    simp
  rw [hrefl]
  rw [setIntegral_congr_fun measurableSet_Ioi
    (fun t ht => pcIntegrand_left hT hρ (le_of_lt (mem_Ioi.mp ht)))]
  rw [integral_const_mul]
  rw [integral_Ioi_pf hs (t₀ := 0) (α := ρ) (β := 1 + T) (by simpa using hρ)
    (by simp; linarith) h1]
  rw [W_eq_Wform hs hρ (by linarith) h1]
  norm_num

lemma integral_Ioi_pcIntegrand {s : ℕ} (hs : 0 < s) {T ρ : ℝ} (hT : 0 ≤ T) (hρ : 0 < ρ)
    (h2 : ρ + T ≠ 1) :
    ∫ u in Ioi T, pcIntegrand s T ρ u = ρ ^ s * W s (ρ + T) 1 := by
  have hne : ρ ≠ 1 - T := by intro h; apply h2; rw [h]; ring
  rw [setIntegral_congr_fun measurableSet_Ioi
    (fun u hu => pcIntegrand_right hT hρ (mem_Ioi.mp hu))]
  rw [integral_const_mul]
  rw [integral_Ioi_pf hs (t₀ := T) (α := ρ) (β := 1 - T) (by linarith) (by simp) hne]
  rw [W_eq_Wform hs (show (0:ℝ) < ρ + T by linarith) one_pos h2]
  congr 2
  · ring
  · ring

lemma integral_mid_pcIntegrand {s : ℕ} {T ρ : ℝ} (hT : 0 ≤ T) (hρ : 0 < ρ) :
    ∫ u in (0 : ℝ)..T, pcIntegrand s T ρ u
      = ρ ^ s * ∫ x in (0 : ℝ)..T, ((x + ρ) ^ s * (1 + T - x) ^ s)⁻¹ := by
  rw [← intervalIntegral.integral_const_mul]
  refine intervalIntegral.integral_congr ?_
  intro x hx
  rw [uIcc_of_le hT] at hx
  exact pcIntegrand_mid hρ hx.1 hx.2

/-- **Lemma PF, third display (three-piece assembly).**
The hypotheses `ρ ≤ 1`, `ρ ≠ 1 + T` and `ρ + T ≠ 1` are the ones listed in the source; the last
two guarantee that the two outer `W`-pieces have distinct arguments. (`ρ ≤ 1` is part of the
setting and is not needed for the identity.) -/
theorem pairCorrelation_assembly {s : ℕ} (hs : 0 < s) {T ρ : ℝ} (hT : 0 ≤ T) (hρ : 0 < ρ)
    (hρ1 : ρ ≤ 1) (h1 : ρ ≠ 1 + T) (h2 : ρ + T ≠ 1) :
    Icorr s T ρ = ρ ^ (-(1 : ℝ) / 2) *
      (ρ ^ s * W s ρ (1 + T)
        + ρ ^ s * (∫ x in (0 : ℝ)..T, ((x + ρ) ^ s * (1 + T - x) ^ s)⁻¹)
        + ρ ^ s * W s (ρ + T) 1) := by
  have hIoi : IntegrableOn (pcIntegrand s T ρ) (Ioi T) :=
    integrableOn_pcIntegrand_Ioi hs hT hρ h2
  have hIic : IntegrableOn (pcIntegrand s T ρ) (Iic 0) :=
    integrableOn_pcIntegrand_Iic hs hT hρ h1
  have hmid : IntervalIntegrable (pcIntegrand s T ρ) volume 0 T :=
    intervalIntegrable_pcIntegrand hρ
  have hIoi0 : IntegrableOn (pcIntegrand s T ρ) (Ioi 0) := by
    have hsplit : Ioi (0 : ℝ) = Ioc 0 T ∪ Ioi T := (Ioc_union_Ioi_eq_Ioi hT).symm
    rw [hsplit]
    exact IntegrableOn.union
      ((intervalIntegrable_iff_integrableOn_Ioc_of_le hT).1 hmid) hIoi
  have htotal : ∫ u : ℝ, pcIntegrand s T ρ u
      = (∫ u in Iic (0 : ℝ), pcIntegrand s T ρ u) + ∫ u in Ioi (0 : ℝ), pcIntegrand s T ρ u :=
    (intervalIntegral.integral_Iic_add_Ioi hIic hIoi0).symm
  have hright : (∫ u in (0 : ℝ)..T, pcIntegrand s T ρ u) + ∫ u in Ioi T, pcIntegrand s T ρ u
      = ∫ u in Ioi (0 : ℝ), pcIntegrand s T ρ u :=
    intervalIntegral.integral_interval_add_Ioi' hmid hIoi
  have hI : Icorr s T ρ = ρ ^ (-(1 : ℝ) / 2) * ∫ u : ℝ, pcIntegrand s T ρ u := rfl
  rw [hI, htotal, ← hright, integral_Iic_pcIntegrand hs hT hρ h1,
    integral_Ioi_pcIntegrand hs hT hρ h2, integral_mid_pcIntegrand hT hρ]
  ring

/-- The fully explicit closed form of `I (T, ρ)` obtained by combining the three displays. -/
theorem pairCorrelation_closed_form {s : ℕ} (hs : 0 < s) {T ρ : ℝ} (hT : 0 ≤ T) (hρ : 0 < ρ)
    (hρ1 : ρ ≤ 1) (h1 : ρ ≠ 1 + T) (h2 : ρ + T ≠ 1) :
    Icorr s T ρ = ρ ^ (-(1 : ℝ) / 2) *
      (ρ ^ s * Wform s ρ (1 + T)
        + ρ ^ s * (∑ k ∈ Finset.Icc 1 s,
            pCoeff s k (ρ + (1 + T)) * (Jfun_a T ρ k + Jfun_c T (1 + T) k))
        + ρ ^ s * Wform s (ρ + T) 1) := by
  rw [pairCorrelation_assembly hs hT hρ hρ1 h1 h2,
    W_eq_Wform hs hρ (by linarith) h1,
    W_eq_Wform hs (show (0:ℝ) < ρ + T by linarith) one_pos h2,
    finite_piece_eq hs (T := T) (a := ρ) (c := 1 + T) hρ hT (by linarith)]

end WeldPF
