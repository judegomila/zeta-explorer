import Mathlib

/-!
# Weld chain (imp-95008), Lemma RM: width-ratio monotonicity of the pair correlation

Let `s > 1` be a real exponent.  For `T ≥ 0` and `ρ ∈ (0,1]` the normalized exact pair
correlation is
`I(T,ρ) = ρ^(-1/2) ∫_ℝ (1 + |u|/ρ)^(-s) (1 + |u - T|)^(-s) du`.

**Lemma RM.**  For `s > 1` and `T ≥ Y*(s) := (2s-1)^(1/(s-1)) - 1`, the map `ρ ↦ I(T,ρ)` is
nondecreasing on `(0,1]`.

The file contains, as named steps:

* `WeldRM.dom_majorant`     – the explicit domination (DOM) used for differentiating under
                              the integral sign;
* `WeldRM.hasDerivAt_Ipc`   – differentiation under the integral sign;
* `WeldRM.integral_fold`, `WeldRM.dIpc_eq_fold` – the folding of `ℝ` onto `[0,∞)`;
* `WeldRM.hasDerivAt_PhiK`  – the antiderivative identity `Φ' = φ_K` (with `Φ 0 = 0`);
* `WeldRM.threshold_criterion` – `(s - 1/2)(1+Y)^(1-s) ≤ 1/2 ↔ Y ≥ Y*(s)`;
* `WeldRM.Ipc_monotoneOn`   – Lemma RM itself.
-/

open MeasureTheory Set Filter Metric
open scoped Topology

namespace WeldRM

/-- `g(u) = (1 + |u - T|)^(-s)`. -/
noncomputable def gk (s T u : ℝ) : ℝ := (1 + |u - T|) ^ (-s)

/-- The folded kernel `G(x) = g(x) + g(-x)`. -/
noncomputable def Gk (s T x : ℝ) : ℝ := gk s T x + gk s T (-x)

/-- The normalized exact pair correlation
`I(T,ρ) = ρ^(-1/2) ∫_ℝ (1 + |u|/ρ)^(-s) (1 + |u - T|)^(-s) du`. -/
noncomputable def Ipc (s T ρ : ℝ) : ℝ :=
  ρ ^ (-(1 : ℝ) / 2) * ∫ u : ℝ, (1 + |u| / ρ) ^ (-s) * (1 + |u - T|) ^ (-s)

/-- `∂_ρ [ρ^(-1/2) (1 + |u|/ρ)^(-s)]`. -/
noncomputable def dfk (s ρ u : ℝ) : ℝ :=
  ρ ^ (-(3 : ℝ) / 2) * (1 + |u| / ρ) ^ (-s - 1) * ((s - 1 / 2) * (|u| / ρ) - 1 / 2)

/-- `φ_K(y) = (1+y)^(-s-1) ((s - 1/2) y - 1/2)`. -/
noncomputable def phiK (s y : ℝ) : ℝ := (1 + y) ^ (-s - 1) * ((s - 1 / 2) * y - 1 / 2)

/-- The exact antiderivative
`Φ(Y) = 1/(2(s-1)) - (1+Y)^(-s) ((s - 1/2)(1+Y) - (s-1))/(s-1)`. -/
noncomputable def PhiK (s Y : ℝ) : ℝ :=
  1 / (2 * (s - 1)) - (1 + Y) ^ (-s) * ((s - 1 / 2) * (1 + Y) - (s - 1)) / (s - 1)

/-- The threshold `Y*(s) = (2s-1)^(1/(s-1)) - 1`. -/
noncomputable def Ystar (s : ℝ) : ℝ := (2 * s - 1) ^ (1 / (s - 1)) - 1

/-- The sign change point `y₀ = 1/(2s-1)` of `φ_K`. -/
noncomputable def y0 (s : ℝ) : ℝ := 1 / (2 * s - 1)

/-! ### Elementary bounds -/

/-- `x ^ (p + 1) = x ^ p * x` for `x > 0` (rpow). -/
lemma rpow_succ_aux {x : ℝ} (hx : 0 < x) (p : ℝ) : x ^ (p + 1) = x ^ p * x := by
  rw [Real.rpow_add hx, Real.rpow_one]

lemma gk_pos (s T u : ℝ) : 0 < gk s T u := by
  unfold gk; apply Real.rpow_pos_of_pos; positivity

lemma gk_le_one {s : ℝ} (hs : 0 ≤ s) (T u : ℝ) : gk s T u ≤ 1 := by
  unfold gk
  rw [Real.rpow_neg (by positivity), inv_le_one_iff₀]
  right
  exact Real.one_le_rpow (by simp [abs_nonneg]) hs

lemma Gk_nonneg (s T x : ℝ) : 0 ≤ Gk s T x := by
  unfold Gk; have := gk_pos s T x; have := gk_pos s T (-x); linarith

lemma Gk_le_two {s : ℝ} (hs : 0 ≤ s) (T x : ℝ) : Gk s T x ≤ 2 := by
  unfold Gk; have := gk_le_one hs T x; have := gk_le_one hs T (-x); linarith

/-- The reference integrable majorant `(1 + |u|)^(-s)`, integrable exactly because `s > 1`. -/
lemma integrable_one_add_abs_rpow {s : ℝ} (hs : 1 < s) :
    Integrable (fun u : ℝ => (1 + |u|) ^ (-s)) := by
  have := integrable_one_add_norm (E := ℝ) (μ := volume) (r := s) (by simpa using hs)
  simpa using this

/-- Scaling comparison: `(1 + |u|/ρ)^(-s) ≤ (max 1 ρ)^s (1 + |u|)^(-s)`. -/
lemma rpow_scaled_le {s ρ : ℝ} (hs : 0 ≤ s) (hρ : 0 < ρ) (u : ℝ) :
    (1 + |u| / ρ) ^ (-s) ≤ (max 1 ρ) ^ s * (1 + |u|) ^ (-s) := by
  have hm : (1:ℝ) ≤ max 1 ρ := le_max_left _ _
  have hmρ : ρ ≤ max 1 ρ := le_max_right _ _
  have habs : (0:ℝ) ≤ |u| := abs_nonneg u
  have hpos1 : (0:ℝ) < 1 + |u| := by positivity
  have hpos2 : (0:ℝ) < 1 + |u| / ρ := by positivity
  have key : 1 + |u| ≤ max 1 ρ * (1 + |u| / ρ) := by
    rw [mul_add, mul_one, mul_div_assoc']
    have : |u| ≤ max 1 ρ * |u| / ρ := by
      rw [le_div_iff₀ hρ]; nlinarith
    linarith
  have hstep : (1 + |u|) ^ s ≤ (max 1 ρ * (1 + |u| / ρ)) ^ s :=
    Real.rpow_le_rpow hpos1.le key hs
  rw [Real.mul_rpow (by linarith) hpos2.le] at hstep
  have hA : (0:ℝ) < (1 + |u| / ρ) ^ s := Real.rpow_pos_of_pos hpos2 s
  have hB : (0:ℝ) < (1 + |u|) ^ s := Real.rpow_pos_of_pos hpos1 s
  rw [Real.rpow_neg hpos1.le, Real.rpow_neg hpos2.le, ← div_eq_mul_inv, le_div_iff₀ hB,
    inv_mul_eq_div, div_le_iff₀ hA]
  linarith

lemma continuous_kernel {s ρ : ℝ} (hρ : 0 < ρ) (T : ℝ) :
    Continuous fun u : ℝ => (1 + |u| / ρ) ^ (-s) * (1 + |u - T|) ^ (-s) := by
  apply Continuous.mul
  · exact Continuous.rpow_const (by fun_prop) (fun x => Or.inl (by positivity))
  · exact Continuous.rpow_const (by fun_prop) (fun x => Or.inl (by positivity))

/-- The integrand of `I(T,ρ)` is integrable for every `ρ > 0`. -/
lemma integrable_kernel {s ρ : ℝ} (hs : 1 < s) (hρ : 0 < ρ) (T : ℝ) :
    Integrable fun u : ℝ => (1 + |u| / ρ) ^ (-s) * (1 + |u - T|) ^ (-s) := by
  refine Integrable.mono' ((integrable_one_add_abs_rpow hs).const_mul ((max 1 ρ) ^ s))
    (continuous_kernel hρ T).aestronglyMeasurable (Filter.Eventually.of_forall fun u => ?_)
  have h1 : (0:ℝ) < (1 + |u| / ρ) ^ (-s) := Real.rpow_pos_of_pos (by positivity) _
  have h2 : (0:ℝ) < (1 + |u - T|) ^ (-s) := Real.rpow_pos_of_pos (by positivity) _
  have h2' : (1 + |u - T|) ^ (-s) ≤ 1 := gk_le_one (by linarith) T u
  have h3 := rpow_scaled_le (s := s) (ρ := ρ) (by linarith) hρ u
  rw [Real.norm_eq_abs, abs_of_pos (by positivity)]
  calc (1 + |u| / ρ) ^ (-s) * (1 + |u - T|) ^ (-s) ≤ (1 + |u| / ρ) ^ (-s) * 1 := by nlinarith
    _ ≤ (max 1 ρ) ^ s * (1 + |u|) ^ (-s) := by rw [mul_one]; exact h3

/-! ### (ii) Differentiation under the integral sign -/

/-- Pointwise differentiability in `ρ` of the integrand. -/
lemma hasDerivAt_integrand {s ρ : ℝ} (hρ : 0 < ρ) (T u : ℝ) :
    HasDerivAt (fun r : ℝ => r ^ (-(1 : ℝ) / 2) * ((1 + |u| / r) ^ (-s) * (1 + |u - T|) ^ (-s)))
      (dfk s ρ u * gk s T u) ρ := by
  have hcnn : (0:ℝ) ≤ |u| := abs_nonneg u
  have hy : (0:ℝ) < 1 + |u| / ρ := by positivity
  have h1 : HasDerivAt (fun r : ℝ => r ^ (-(1:ℝ)/2)) ((-(1:ℝ)/2) * ρ ^ ((-(1:ℝ)/2) - 1)) ρ :=
    Real.hasDerivAt_rpow_const (Or.inl hρ.ne')
  have h2 : HasDerivAt (fun r : ℝ => 1 + |u| / r) (-(|u| / ρ^2)) ρ := by
    have := ((hasDerivAt_inv hρ.ne').const_mul |u|).const_add 1
    simpa [div_eq_mul_inv, mul_comm, mul_neg, neg_div] using this
  have h3 : HasDerivAt (fun r : ℝ => (1 + |u|/r) ^ (-s))
      ((-(|u|/ρ^2)) * (-s) * (1 + |u|/ρ)^(-s-1)) ρ := h2.rpow_const (Or.inl hy.ne')
  have h5 := h1.mul (h3.mul_const ((1 + |u - T|) ^ (-s)))
  convert h5 using 1
  have e1 : ρ ^ ((-(1:ℝ)/2) - 1) = ρ ^ (-(3:ℝ)/2) := by norm_num
  have e2 : ρ ^ (-(1:ℝ)/2) = ρ ^ (-(3:ℝ)/2) * ρ := by
    have := rpow_succ_aux hρ (-(3:ℝ)/2); norm_num at this ⊢; linarith [this]
  have e3 : (1 + |u|/ρ) ^ (-s) = (1 + |u|/ρ) ^ (-s-1) * (1 + |u|/ρ) := by
    have := rpow_succ_aux hy (-s-1); rw [show -s-1+1 = -s by ring] at this; exact this
  rw [e1, e2, e3]
  unfold dfk gk
  field_simp
  ring

/-- **(DOM)** the explicit integrable majorant for the `ρ`-derivative of the integrand:
for `0 < a ≤ ρ ≤ b` one has `|∂_ρ f_ρ(u) g(u)| ≤ s a^(-3/2) (max 1 b)^s (1 + |u|)^(-s)`. -/
lemma dom_majorant {s a b ρ : ℝ} (hs : 1 < s) (ha : 0 < a) (haρ : a ≤ ρ) (hρb : ρ ≤ b)
    (T u : ℝ) :
    |dfk s ρ u * gk s T u| ≤ s * a ^ (-(3 : ℝ) / 2) * (max 1 b) ^ s * (1 + |u|) ^ (-s) := by
  have hρ : 0 < ρ := lt_of_lt_of_le ha haρ
  have hy0 : 0 ≤ |u| / ρ := by positivity
  have hy1 : (0:ℝ) < 1 + |u| / ρ := by linarith
  have hpow : (0:ℝ) < ρ ^ (-(3:ℝ)/2) := Real.rpow_pos_of_pos hρ _
  have hpow2 : (0:ℝ) < (1 + |u| / ρ) ^ (-s-1) := Real.rpow_pos_of_pos hy1 _
  have habs : |(s - 1/2) * (|u|/ρ) - 1/2| ≤ s * (1 + |u|/ρ) := by
    rw [abs_le]; constructor <;> nlinarith
  have hsplit : (1 + |u|/ρ) ^ (-s-1) * (1 + |u|/ρ) = (1 + |u|/ρ) ^ (-s) := by
    have := rpow_succ_aux hy1 (-s-1); rw [show -s-1+1 = -s by ring] at this; exact this.symm
  have hdfk : |dfk s ρ u| ≤ s * ρ ^ (-(3:ℝ)/2) * (1 + |u|/ρ) ^ (-s) := by
    unfold dfk
    rw [abs_mul, abs_of_pos (by positivity : (0:ℝ) < ρ ^ (-(3:ℝ)/2) * (1 + |u| / ρ) ^ (-s - 1))]
    calc ρ ^ (-(3:ℝ)/2) * (1 + |u| / ρ) ^ (-s - 1) * |(s - 1/2) * (|u|/ρ) - 1/2|
        ≤ ρ ^ (-(3:ℝ)/2) * (1 + |u| / ρ) ^ (-s - 1) * (s * (1 + |u|/ρ)) :=
          mul_le_mul_of_nonneg_left habs (by positivity)
      _ = s * ρ ^ (-(3:ℝ)/2) * (1 + |u|/ρ) ^ (-s) := by rw [← hsplit]; ring
  have hgk : |gk s T u| ≤ 1 := by
    rw [abs_of_pos (gk_pos s T u)]; exact gk_le_one (by linarith) T u
  have hkey : |dfk s ρ u * gk s T u| ≤ s * ρ ^ (-(3:ℝ)/2) * (1 + |u|/ρ) ^ (-s) := by
    rw [abs_mul]
    calc |dfk s ρ u| * |gk s T u| ≤ |dfk s ρ u| * 1 :=
          mul_le_mul_of_nonneg_left hgk (abs_nonneg _)
      _ = |dfk s ρ u| := mul_one _
      _ ≤ _ := hdfk
  refine hkey.trans ?_
  have A : ρ ^ (-(3:ℝ)/2) ≤ a ^ (-(3:ℝ)/2) := Real.rpow_le_rpow_of_nonpos ha haρ (by norm_num)
  have B : (1 + |u|/ρ) ^ (-s) ≤ (max 1 ρ) ^ s * (1 + |u|) ^ (-s) :=
    rpow_scaled_le (by linarith) hρ u
  have C : (max 1 ρ) ^ s ≤ (max 1 b) ^ s :=
    Real.rpow_le_rpow (by positivity) (max_le_max le_rfl hρb) (by linarith)
  have hu : (0:ℝ) < (1 + |u|) ^ (-s) := Real.rpow_pos_of_pos (by positivity) _
  have ha' : (0:ℝ) < a ^ (-(3:ℝ)/2) := Real.rpow_pos_of_pos ha _
  calc s * ρ ^ (-(3:ℝ)/2) * (1 + |u|/ρ) ^ (-s)
      ≤ s * a ^ (-(3:ℝ)/2) * ((max 1 ρ) ^ s * (1 + |u|) ^ (-s)) :=
        mul_le_mul (by nlinarith) B (Real.rpow_nonneg hy1.le _) (by positivity)
    _ ≤ s * a ^ (-(3:ℝ)/2) * ((max 1 b) ^ s * (1 + |u|) ^ (-s)) :=
        mul_le_mul_of_nonneg_left (mul_le_mul_of_nonneg_right C hu.le) (by positivity)
    _ = s * a ^ (-(3:ℝ)/2) * (max 1 b) ^ s * (1 + |u|) ^ (-s) := by ring

/-- The majorant of (DOM) is integrable, exactly because `s > 1`. -/
lemma integrable_dom_majorant {s a b : ℝ} (hs : 1 < s) :
    Integrable fun u : ℝ => s * a ^ (-(3 : ℝ) / 2) * (max 1 b) ^ s * (1 + |u|) ^ (-s) :=
  (integrable_one_add_abs_rpow hs).const_mul _

lemma continuous_dfk_gk {s ρ : ℝ} (hρ : 0 < ρ) (T : ℝ) :
    Continuous fun u : ℝ => dfk s ρ u * gk s T u := by
  unfold dfk gk
  apply Continuous.mul
  · apply Continuous.mul
    · exact Continuous.mul continuous_const
        (Continuous.rpow_const (by fun_prop) (fun x => Or.inl (by positivity)))
    · fun_prop
  · exact Continuous.rpow_const (by fun_prop) (fun x => Or.inl (by positivity))

/-- **Differentiation under the integral sign** for `I(T, ·)`. -/
theorem hasDerivAt_Ipc {s ρ : ℝ} (hs : 1 < s) (hρ : 0 < ρ) (T : ℝ) :
    HasDerivAt (fun r : ℝ => Ipc s T r) (∫ u : ℝ, dfk s ρ u * gk s T u) ρ := by
  have hfun : (fun r : ℝ => Ipc s T r) = fun r : ℝ =>
      ∫ u : ℝ, r ^ (-(1:ℝ)/2) * ((1 + |u| / r) ^ (-s) * (1 + |u - T|) ^ (-s)) := by
    funext r; rw [Ipc, integral_const_mul]
  rw [hfun]
  have hSmem : ball ρ (ρ/2) ∈ 𝓝 ρ := ball_mem_nhds _ (by linarith)
  have hSpos : ∀ r ∈ ball ρ (ρ/2), ρ/2 < r ∧ r < 3*ρ/2 := by
    intro r hr
    rw [mem_ball, Real.dist_eq, abs_lt] at hr
    constructor <;> linarith [hr.1, hr.2]
  refine (hasDerivAt_integral_of_dominated_loc_of_deriv_le
    (F := fun r u => r ^ (-(1:ℝ)/2) * ((1 + |u| / r) ^ (-s) * (1 + |u - T|) ^ (-s)))
    (F' := fun r u => dfk s r u * gk s T u)
    (bound := fun u => s * (ρ/2) ^ (-(3:ℝ)/2) * (max 1 (3*ρ/2)) ^ s * (1 + |u|) ^ (-s))
    hSmem ?_ ?_ ?_ ?_ ?_ ?_).2
  · filter_upwards [eventually_gt_nhds hρ] with r hr
    exact ((continuous_kernel (s := s) hr T).const_smul (r ^ (-(1:ℝ)/2))).aestronglyMeasurable
  · exact (integrable_kernel hs hρ T).const_mul _
  · exact (continuous_dfk_gk hρ T).aestronglyMeasurable
  · filter_upwards with u r hr
    rw [Real.norm_eq_abs]
    exact dom_majorant hs (by linarith) (hSpos r hr).1.le (hSpos r hr).2.le T u
  · exact integrable_dom_majorant hs
  · filter_upwards with u r hr
    exact hasDerivAt_integrand (by linarith [(hSpos r hr).1]) T u

/-! ### Folding `ℝ` onto `[0,∞)` -/

lemma abs_phiK_le {s y : ℝ} (hs : 1 < s) (hy : 0 ≤ y) : |phiK s y| ≤ s * (1 + y) ^ (-s) := by
  have hy1 : (0:ℝ) < 1 + y := by linarith
  have hsplit : (1 + y) ^ (-s-1) * (1 + y) = (1 + y) ^ (-s) := by
    have := rpow_succ_aux hy1 (-s-1); rw [show -s-1+1 = -s by ring] at this; exact this.symm
  have habs : |(s - 1/2) * y - 1/2| ≤ s * (1 + y) := by
    rw [abs_le]; constructor <;> nlinarith
  unfold phiK
  rw [abs_mul, abs_of_pos (Real.rpow_pos_of_pos hy1 _)]
  calc (1 + y) ^ (-s-1) * |(s - 1/2) * y - 1/2| ≤ (1 + y) ^ (-s-1) * (s * (1+y)) :=
        mul_le_mul_of_nonneg_left habs (by positivity)
    _ = s * (1 + y) ^ (-s) := by rw [← hsplit]; ring

lemma continuous_phiK_abs {s : ℝ} : Continuous fun y : ℝ => phiK s |y| := by
  unfold phiK
  exact Continuous.mul (Continuous.rpow_const (by fun_prop) (fun x => Or.inl (by positivity)))
    (by fun_prop)

lemma continuous_gk (s T : ℝ) : Continuous (gk s T) := by
  unfold gk
  exact Continuous.rpow_const (by fun_prop) (fun x => Or.inl (by positivity))

lemma continuous_Gk (s T : ℝ) : Continuous (Gk s T) := by
  unfold Gk
  exact (continuous_gk s T).add ((continuous_gk s T).comp continuous_neg)

lemma measurable_phiK (s : ℝ) : Measurable (phiK s) := by
  unfold phiK
  exact (Measurable.pow_const (by fun_prop) _).mul (by fun_prop)

/-- Folding of an integrable function: `∫_ℝ h = ∫_{(0,∞)} (h y + h (-y))`. -/
lemma integral_fold {h : ℝ → ℝ} (hh : Integrable h) :
    ∫ y : ℝ, h y = ∫ y in Ioi (0 : ℝ), (h y + h (-y)) := by
  have hneg : Integrable (fun y : ℝ => h (-y)) := hh.comp_neg
  have h1 : ∫ y : ℝ, h y = (∫ y in Iic (0:ℝ), h y) + ∫ y in Ioi (0:ℝ), h y := by
    rw [← setIntegral_union (Iic_disjoint_Ioi le_rfl) measurableSet_Ioi hh.integrableOn
      hh.integrableOn, Iic_union_Ioi, Measure.restrict_univ]
  have h2 : ∫ y in Iic (0:ℝ), h y = ∫ y in Ioi (0:ℝ), h (-y) := by simp
  rw [h1, h2, ← integral_add hneg.integrableOn hh.integrableOn]
  simp_rw [add_comm]

lemma integrable_phiK_abs_gk {s ρ : ℝ} (hs : 1 < s) (T : ℝ) :
    Integrable (fun y : ℝ => phiK s |y| * gk s T (ρ * y)) := by
  refine Integrable.mono' ((integrable_one_add_abs_rpow hs).const_mul s)
    ((continuous_phiK_abs.mul ((continuous_gk s T).comp (by fun_prop))).aestronglyMeasurable)
    (Filter.Eventually.of_forall fun y => ?_)
  rw [Real.norm_eq_abs, abs_mul, abs_of_pos (gk_pos s T _)]
  have h1 := abs_phiK_le hs (abs_nonneg y)
  have h2 := gk_le_one (le_of_lt (by linarith : (0:ℝ) < s)) T (ρ*y)
  have h3 := gk_pos s T (ρ*y)
  nlinarith [abs_nonneg (phiK s |y|)]

lemma integrable_phiK_Gk {s ρ : ℝ} (hs : 1 < s) (T : ℝ) :
    IntegrableOn (fun y : ℝ => phiK s y * Gk s T (ρ * y)) (Ioi 0) := by
  refine Integrable.mono' (((integrable_one_add_abs_rpow hs).const_mul (2*s)).restrict)
    (((measurable_phiK s).mul (((continuous_Gk s T).comp (continuous_const.mul
      continuous_id)).measurable)).aestronglyMeasurable) ?_
  refine (ae_restrict_iff' measurableSet_Ioi).mpr (Filter.Eventually.of_forall fun y hy => ?_)
  have hy0 : (0:ℝ) < y := hy
  rw [Real.norm_eq_abs, abs_mul, abs_of_nonneg (Gk_nonneg s T (ρ*y)), abs_of_pos hy0]
  have h1 := abs_phiK_le hs hy0.le
  have h2 := Gk_le_two (le_of_lt (by linarith : (0:ℝ) < s)) T (ρ*y)
  have h3 := Gk_nonneg s T (ρ*y)
  have h4 : (0:ℝ) ≤ |phiK s y| := abs_nonneg _
  nlinarith

/-- The derivative of `I(T, ·)`, after the substitution `u = ρ y` and folding, equals
`ρ^(-1/2) ∫_0^∞ φ_K(y) G(ρ y) dy`. -/
theorem dIpc_eq_fold {s ρ : ℝ} (hs : 1 < s) (hρ : 0 < ρ) (T : ℝ) :
    (∫ u : ℝ, dfk s ρ u * gk s T u)
      = ρ ^ (-(1 : ℝ) / 2) * ∫ y in Ioi (0 : ℝ), phiK s y * Gk s T (ρ * y) := by
  have hpt : ∀ y : ℝ, dfk s ρ (ρ*y) * gk s T (ρ*y)
      = ρ ^ (-(3:ℝ)/2) * (phiK s |y| * gk s T (ρ*y)) := by
    intro y
    unfold dfk phiK
    rw [abs_mul, abs_of_pos hρ, mul_div_cancel_left₀ _ hρ.ne']
    ring
  have hcov : ∫ y : ℝ, (dfk s ρ (ρ*y) * gk s T (ρ*y)) = |ρ⁻¹| • ∫ u : ℝ, dfk s ρ u * gk s T u :=
    Measure.integral_comp_mul_left (fun u => dfk s ρ u * gk s T u) ρ
  rw [funext hpt, integral_const_mul] at hcov
  rw [abs_of_pos (by positivity : (0:ℝ) < ρ⁻¹), smul_eq_mul] at hcov
  have hI : ∫ u : ℝ, dfk s ρ u * gk s T u
      = ρ ^ (-(1:ℝ)/2) * ∫ y : ℝ, phiK s |y| * gk s T (ρ*y) := by
    have e2 : ρ ^ (-(1:ℝ)/2) = ρ ^ (-(3:ℝ)/2) * ρ := by
      have := rpow_succ_aux hρ (-(3:ℝ)/2); norm_num at this ⊢; linarith [this]
    have h1 : ρ * (ρ ^ (-(3:ℝ)/2) * ∫ y : ℝ, phiK s |y| * gk s T (ρ*y))
        = ρ ^ (-(1:ℝ)/2) * ∫ y : ℝ, phiK s |y| * gk s T (ρ*y) := by rw [e2]; ring
    rw [← h1, hcov]
    field_simp
  rw [hI]
  congr 1
  rw [integral_fold (integrable_phiK_abs_gk hs T)]
  refine setIntegral_congr_fun measurableSet_Ioi (fun y hy => ?_)
  have hy0 : (0:ℝ) < y := hy
  rw [abs_of_pos hy0, abs_of_neg (neg_neg_iff_pos.mpr hy0), neg_neg]
  unfold Gk
  rw [show ρ * -y = -(ρ*y) by ring]
  ring

/-! ### (iii) The antiderivative identity `Φ' = φ_K`, `Φ(0) = 0` -/

theorem PhiK_zero {s : ℝ} (hs : 1 < s) : PhiK s 0 = 0 := by
  have h : s - 1 ≠ 0 := by linarith
  unfold PhiK
  norm_num [Real.one_rpow]
  field_simp
  ring

theorem hasDerivAt_PhiK {s Y : ℝ} (hs : 1 < s) (hY : -1 < Y) :
    HasDerivAt (PhiK s) (phiK s Y) Y := by
  have ht : (0:ℝ) < 1 + Y := by linarith
  have hs1 : s - 1 ≠ 0 := by linarith
  have h1 : HasDerivAt (fun Y : ℝ => (1 + Y) ^ (-s)) (1 * (-s) * (1 + Y) ^ (-s - 1)) Y :=
    ((hasDerivAt_id Y).const_add 1).rpow_const (Or.inl ht.ne')
  have h2 : HasDerivAt (fun Y : ℝ => (s - 1/2) * (1 + Y) - (s - 1)) (s - 1/2) Y := by
    have := ((hasDerivAt_id Y).const_add (1:ℝ)).const_mul (s - 1/2)
    simpa using this.sub_const (s - 1)
  have h3 := ((h1.mul h2).div_const (s - 1)).const_sub (1 / (2 * (s - 1)))
  convert h3 using 1
  have e : (1 + Y) ^ (-s) = (1 + Y) ^ (-s-1) * (1 + Y) := by
    have := rpow_succ_aux ht (-s-1); rw [show -s-1+1 = -s by ring] at this; exact this
  unfold phiK
  rw [e]
  field_simp
  ring

/-! ### (iv) The threshold criterion -/

theorem threshold_criterion {s Y : ℝ} (hs : 1 < s) (hY : 0 ≤ Y) :
    (s - 1 / 2) * (1 + Y) ^ (1 - s) ≤ 1 / 2 ↔ Ystar s ≤ Y := by
  have ht : (0:ℝ) < 1 + Y := by linarith
  have hp : (0:ℝ) < s - 1 := by linarith
  have ha : (0:ℝ) < 2 * s - 1 := by linarith
  have hpow : (0:ℝ) < (1 + Y) ^ (s - 1) := Real.rpow_pos_of_pos ht _
  have hinv : (1 + Y) ^ (1 - s) = ((1 + Y) ^ (s - 1))⁻¹ := by
    rw [show (1:ℝ) - s = -(s-1) by ring, Real.rpow_neg ht.le]
  constructor
  · intro h
    rw [hinv, mul_inv_le_iff₀ hpow] at h
    have h2 : (2 * s - 1) ≤ (1 + Y) ^ (s - 1) := by linarith
    have := (Real.rpow_le_rpow_iff ha.le hpow.le (show (0:ℝ) < 1/(s-1) by positivity)).mpr h2
    rw [← Real.rpow_mul ht.le, mul_one_div, div_self hp.ne', Real.rpow_one] at this
    unfold Ystar
    linarith
  · intro h
    unfold Ystar at h
    have h1 : (2 * s - 1) ^ (1/(s-1)) ≤ 1 + Y := by linarith
    have h2 : ((2 * s - 1) ^ (1/(s-1))) ^ (s-1) ≤ (1 + Y) ^ (s-1) :=
      Real.rpow_le_rpow (Real.rpow_nonneg ha.le _) h1 hp.le
    rw [← Real.rpow_mul ha.le, one_div, inv_mul_cancel₀ hp.ne', Real.rpow_one] at h2
    rw [hinv, mul_inv_le_iff₀ hpow]
    linarith

/-- `Φ(Y) ≥ 0` as soon as `Y ≥ Y*(s)`. -/
theorem PhiK_nonneg {s Y : ℝ} (hs : 1 < s) (hY : 0 ≤ Y) (hYs : Ystar s ≤ Y) :
    0 ≤ PhiK s Y := by
  have ht : (0:ℝ) < 1 + Y := by linarith
  have hcrit := (threshold_criterion hs hY).mpr hYs
  have e : (1 + Y) ^ (-s) * (1 + Y) = (1 + Y) ^ (1 - s) := by
    have := rpow_succ_aux ht (-s); rw [show -s+1 = 1-s by ring] at this; exact this.symm
  have key : PhiK s Y = (1/2 - (s - 1/2) * (1+Y)^(1-s) + (s-1) * (1+Y)^(-s)) / (s-1) := by
    unfold PhiK
    rw [← e]
    field_simp
    ring
  rw [key]
  apply div_nonneg _ (by linarith)
  nlinarith [Real.rpow_pos_of_pos ht (-s)]

lemma Ystar_nonneg {s : ℝ} (hs : 1 < s) : 0 ≤ Ystar s := by
  unfold Ystar
  have : (1:ℝ) ≤ (2*s-1) ^ (1/(s-1)) :=
    Real.one_le_rpow (by linarith) (div_nonneg zero_le_one (by linarith))
  linarith

/-- `y₀ = 1/(2s-1) ≤ Y*(s)`. -/
lemma y0_le_Ystar {s : ℝ} (hs : 1 < s) : y0 s ≤ Ystar s := by
  have hp : (0:ℝ) < s - 1 := by linarith
  have ha0 : (0:ℝ) < 2*s - 1 := by linarith
  have hlog : 1 - 1/(2*s-1) ≤ Real.log (2*s-1) := by
    have h := Real.log_le_sub_one_of_pos (show (0:ℝ) < 1/(2*s-1) by positivity)
    rw [one_div, Real.log_inv] at h
    have h2 : (2*s-1)⁻¹ - 1 = 1/(2*s-1) - 1 := by rw [one_div]
    rw [h2] at h
    linarith
  have hkey : 1/(2*s-1) ≤ Real.log (2*s-1) * (1/(s-1)) := by
    rw [mul_one_div, le_div_iff₀ hp]
    have h3 : (s-1)/(2*s-1) ≤ 1 - 1/(2*s-1) := by
      rw [div_le_iff₀ ha0, sub_mul, one_div, inv_mul_cancel₀ (by linarith)]
      linarith
    calc 1/(2*s-1) * (s-1) = (s-1)/(2*s-1) := by ring
      _ ≤ 1 - 1/(2*s-1) := h3
      _ ≤ Real.log (2*s-1) := hlog
  have hexp : Real.exp (1/(2*s-1)) ≤ (2*s-1) ^ (1/(s-1)) := by
    rw [Real.rpow_def_of_pos ha0]
    exact Real.exp_le_exp.mpr hkey
  have hlin : 1 + 1/(2*s-1) ≤ Real.exp (1/(2*s-1)) := by
    have := Real.add_one_le_exp (1/(2*s-1)); linarith
  unfold y0 Ystar
  linarith

/-! ### Sign of `φ_K` and monotonicity of `G` -/

lemma phiK_nonpos_of_le {s y : ℝ} (hs : 1 < s) (hy : 0 ≤ y) (hy0 : y ≤ y0 s) :
    phiK s y ≤ 0 := by
  have ha0 : (0:ℝ) < 2*s - 1 := by linarith
  have hy1 : (0:ℝ) < 1 + y := by linarith
  have hlin : (s - 1/2) * y - 1/2 ≤ 0 := by
    unfold y0 at hy0
    rw [le_div_iff₀ ha0] at hy0
    linarith
  unfold phiK
  exact mul_nonpos_of_nonneg_of_nonpos (Real.rpow_pos_of_pos hy1 _).le hlin

lemma phiK_nonneg_of_ge {s y : ℝ} (hs : 1 < s) (hy0 : y0 s ≤ y) : 0 ≤ phiK s y := by
  have ha0 : (0:ℝ) < 2*s - 1 := by linarith
  have hy : (0:ℝ) < y := lt_of_lt_of_le (by unfold y0; positivity) hy0
  have hy1 : (0:ℝ) < 1 + y := by linarith
  have hlin : 0 ≤ (s - 1/2) * y - 1/2 := by
    unfold y0 at hy0
    rw [div_le_iff₀ ha0] at hy0
    linarith
  unfold phiK
  exact mul_nonneg (Real.rpow_pos_of_pos hy1 _).le hlin

lemma Gk_eq_on_Icc {s T x : ℝ} (hx : x ∈ Icc 0 T) :
    Gk s T x = (1 + T - x) ^ (-s) + (1 + T + x) ^ (-s) := by
  obtain ⟨hx0, hxT⟩ := hx
  unfold Gk gk
  rw [abs_of_nonpos (by linarith : x - T ≤ 0), abs_of_nonpos (by linarith : -x - T ≤ 0)]
  congr 2 <;> ring

lemma H_monotoneOn {s T : ℝ} (hs : 1 < s) :
    MonotoneOn (fun x : ℝ => (1 + T - x) ^ (-s) + (1 + T + x) ^ (-s)) (Icc 0 T) := by
  have hderiv : ∀ x ∈ Ioo (0:ℝ) T, HasDerivAt (fun x : ℝ => (1 + T - x) ^ (-s) + (1 + T + x) ^ (-s))
      (s * (1 + T - x) ^ (-s-1) - s * (1 + T + x) ^ (-s-1)) x := by
    intro x hx
    have h1 : (0:ℝ) < 1 + T - x := by linarith [hx.2]
    have h2 : (0:ℝ) < 1 + T + x := by linarith [hx.1]
    have d1 : HasDerivAt (fun x : ℝ => 1 + T - x) (-1) x := by
      simpa using (hasDerivAt_id x).const_sub (1 + T)
    have d2 : HasDerivAt (fun x : ℝ => 1 + T + x) 1 x := by
      simpa using (hasDerivAt_id x).const_add (1 + T)
    have e1 : HasDerivAt (fun x : ℝ => (1 + T - x) ^ (-s))
        (-1 * (-s) * (1 + T - x) ^ (-s - 1)) x := d1.rpow_const (Or.inl h1.ne')
    have e2 : HasDerivAt (fun x : ℝ => (1 + T + x) ^ (-s))
        (1 * (-s) * (1 + T + x) ^ (-s - 1)) x := d2.rpow_const (Or.inl h2.ne')
    have := e1.add e2
    convert this using 1
    ring
  apply monotoneOn_of_deriv_nonneg (convex_Icc 0 T)
  · apply ContinuousOn.add
    · apply ContinuousOn.rpow_const (by fun_prop)
      intro x hx; exact Or.inl (by simp at hx; linarith [hx.2])
    · apply ContinuousOn.rpow_const (by fun_prop)
      intro x hx; exact Or.inl (by simp at hx; linarith [hx.1])
  · rw [interior_Icc]
    exact fun x hx => (hderiv x hx).differentiableAt.differentiableWithinAt
  · rw [interior_Icc]
    intro x hx
    rw [(hderiv x hx).deriv]
    have h1 : (0:ℝ) < 1 + T - x := by linarith [hx.2]
    have hle : (1 + T + x) ^ (-s-1) ≤ (1 + T - x) ^ (-s-1) :=
      Real.rpow_le_rpow_of_nonpos h1 (by linarith [hx.1]) (by linarith)
    nlinarith

/-- `G` is nondecreasing on `[0,T]`. -/
lemma Gk_monotoneOn {s T : ℝ} (hs : 1 < s) :
    MonotoneOn (Gk s T) (Icc 0 T) := by
  intro a ha b hb hab
  rw [Gk_eq_on_Icc ha, Gk_eq_on_Icc hb]
  exact H_monotoneOn hs ha hb hab

/-! ### The core inequality -/

lemma continuousOn_phiK {s a b : ℝ} (hab : 0 ≤ a) : ContinuousOn (phiK s) (Icc a b) := by
  apply ContinuousOn.mul
  · apply ContinuousOn.rpow_const (by fun_prop)
    intro x hx; exact Or.inl (by simp at hx; linarith [hx.1])
  · fun_prop

/-- The exact antiderivative in action: `∫_0^Y φ_K = Φ(Y)`. -/
lemma integral_phiK_eq {s Y : ℝ} (hs : 1 < s) (hY : 0 ≤ Y) :
    ∫ y in Ioc (0:ℝ) Y, phiK s y = PhiK s Y := by
  have hcont : ContinuousOn (phiK s) (Set.uIcc (0:ℝ) Y) := by
    rw [Set.uIcc_of_le hY]; exact continuousOn_phiK le_rfl
  have hint : IntervalIntegrable (phiK s) volume 0 Y := hcont.intervalIntegrable
  have hFTC := intervalIntegral.integral_eq_sub_of_hasDerivAt
    (f := PhiK s) (f' := phiK s) (a := 0) (b := Y)
    (fun x hx => hasDerivAt_PhiK hs (by rw [Set.uIcc_of_le hY] at hx; linarith [hx.1])) hint
  rw [intervalIntegral.integral_of_le hY] at hFTC
  rw [hFTC, PhiK_zero hs, sub_zero]

/-- For `T ≥ Y*(s)` and `0 < ρ ≤ 1` one has `∫_0^∞ φ_K(y) G(ρ y) dy ≥ 0`. -/
theorem core_nonneg {s T ρ : ℝ} (hs : 1 < s) (hT : Ystar s ≤ T) (hρ : 0 < ρ) (hρ1 : ρ ≤ 1) :
    0 ≤ ∫ y in Ioi (0 : ℝ), phiK s y * Gk s T (ρ * y) := by
  have ha0 : (0:ℝ) < 2*s - 1 := by linarith
  set Y := T / ρ with hYdef
  have hT0 : 0 ≤ T := le_trans (Ystar_nonneg hs) hT
  have hTY : T ≤ Y := by rw [hYdef, le_div_iff₀ hρ]; nlinarith
  have hY0 : 0 ≤ Y := le_trans hT0 hTY
  have hYs : Ystar s ≤ Y := le_trans hT hTY
  have hρY : ρ * Y = T := by rw [hYdef, mul_div_cancel₀ _ hρ.ne']
  have hy0Y : y0 s ≤ Y := le_trans (le_trans (y0_le_Ystar hs) hT) hTY
  have hy0pos : (0:ℝ) < y0 s := by unfold y0; positivity
  have hfint : IntegrableOn (fun y : ℝ => phiK s y * Gk s T (ρ * y)) (Ioi 0) :=
    integrable_phiK_Gk hs T
  have hf1 : IntegrableOn (fun y : ℝ => phiK s y * Gk s T (ρ * y)) (Ioc 0 Y) :=
    hfint.mono_set Ioc_subset_Ioi_self
  have hf2 : IntegrableOn (fun y : ℝ => phiK s y * Gk s T (ρ * y)) (Ioi Y) :=
    hfint.mono_set (Ioi_subset_Ioi hY0)
  have hsplit : ∫ y in Ioi (0:ℝ), phiK s y * Gk s T (ρ*y)
      = (∫ y in Ioc (0:ℝ) Y, phiK s y * Gk s T (ρ*y))
        + ∫ y in Ioi Y, phiK s y * Gk s T (ρ*y) := by
    rw [← setIntegral_union (Ioc_disjoint_Ioi le_rfl) measurableSet_Ioi hf1 hf2,
      Ioc_union_Ioi_eq_Ioi hY0]
  have hpart2 : 0 ≤ ∫ y in Ioi Y, phiK s y * Gk s T (ρ*y) := by
    apply setIntegral_nonneg measurableSet_Ioi
    intro y hy
    exact mul_nonneg (phiK_nonneg_of_ge hs (le_trans hy0Y (le_of_lt hy))) (Gk_nonneg s T _)
  have hphiint : IntegrableOn (phiK s) (Ioc 0 Y) := by
    have hcont : ContinuousOn (phiK s) (Set.uIcc (0:ℝ) Y) := by
      rw [Set.uIcc_of_le hY0]; exact continuousOn_phiK le_rfl
    have h2 : IntervalIntegrable (phiK s) volume 0 Y := hcont.intervalIntegrable
    rwa [intervalIntegrable_iff_integrableOn_Ioc_of_le hY0] at h2
  have hg : IntegrableOn (fun y : ℝ => phiK s y * Gk s T (ρ * y0 s)) (Ioc 0 Y) :=
    hphiint.mul_const _
  have hcomp : (∫ y in Ioc (0:ℝ) Y, phiK s y * Gk s T (ρ * y0 s))
      ≤ ∫ y in Ioc (0:ℝ) Y, phiK s y * Gk s T (ρ*y) := by
    apply setIntegral_mono_on hg hf1 measurableSet_Ioc
    intro y hy
    have hy1 : 0 < y := hy.1
    have hyY : y ≤ Y := hy.2
    have hmem1 : ρ * y ∈ Icc 0 T := ⟨by positivity, by nlinarith⟩
    have hmem2 : ρ * y0 s ∈ Icc 0 T := ⟨by positivity, by nlinarith⟩
    rcases le_total y (y0 s) with hle | hle
    · have hp := phiK_nonpos_of_le hs hy1.le hle
      have hG := Gk_monotoneOn (T := T) hs hmem1 hmem2 (by nlinarith)
      nlinarith
    · have hp := phiK_nonneg_of_ge hs hle
      have hG := Gk_monotoneOn (T := T) hs hmem2 hmem1 (by nlinarith)
      nlinarith
  have hval : (∫ y in Ioc (0:ℝ) Y, phiK s y * Gk s T (ρ * y0 s))
      = PhiK s Y * Gk s T (ρ * y0 s) := by
    rw [integral_mul_const, integral_phiK_eq hs hY0]
  have hpart1 : 0 ≤ ∫ y in Ioc (0:ℝ) Y, phiK s y * Gk s T (ρ*y) := by
    refine le_trans ?_ hcomp
    rw [hval]
    exact mul_nonneg (PhiK_nonneg hs hY0 hYs) (Gk_nonneg s T _)
  rw [hsplit]
  linarith

/-! ### Lemma RM -/

/-- **Lemma RM (width-ratio monotonicity).**  For `s > 1` and `T ≥ Y*(s) = (2s-1)^(1/(s-1)) - 1`,
the map `ρ ↦ I(T,ρ)` is nondecreasing on `(0,1]`. -/
theorem Ipc_monotoneOn {s T : ℝ} (hs : 1 < s) (hT : Ystar s ≤ T) :
    MonotoneOn (fun ρ : ℝ => Ipc s T ρ) (Ioc 0 1) := by
  apply monotoneOn_of_deriv_nonneg (convex_Ioc 0 1)
  · exact fun x hx => ((hasDerivAt_Ipc hs hx.1 T).continuousAt).continuousWithinAt
  · rw [interior_Ioc]
    exact fun x hx => (hasDerivAt_Ipc hs hx.1 T).differentiableAt.differentiableWithinAt
  · rw [interior_Ioc]
    intro x hx
    rw [(hasDerivAt_Ipc hs hx.1 T).deriv, dIpc_eq_fold hs hx.1 T]
    exact mul_nonneg (Real.rpow_nonneg hx.1.le _) (core_nonneg hs hT hx.1 hx.2.le)

end WeldRM
