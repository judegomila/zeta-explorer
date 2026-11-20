import Mathlib

/-!
# Sign lemma behind Theorem R (zero tolerance of all-order Pick positivity) -- proved

Statements identical to `rh-push-thmr-sign-lemma/RequestProject/Main.lean`; the `sorry`s are
replaced by proofs.  Method: Bohr mean values.  For an absolutely summable cosine series
`S(y) = ∑ a n cos (y ω n)` the mean `T⁻¹ ∫_0^T S` tends to `∑_{ω n = 0} a n`.  If `g ≤ 0`
everywhere then the means of `g (1 ± cos (y log m)) ≤ 0` are `≤ 0`, and their limits are
`± c m / 2`, so every `c m` vanishes.
-/

open Finset BigOperators Filter Topology

noncomputable section

/-- The almost periodic cosine series with coefficients `c n` at the frequencies `log n`. -/
def gser (c : ℕ → ℝ) (y : ℝ) : ℝ := ∑' n : ℕ, c n * Real.cos (y * Real.log n)

/-! ## General cosine series and Bohr mean -/

/-- General cosine series. -/
def cosSer (a ω : ℕ → ℝ) (y : ℝ) : ℝ := ∑' n : ℕ, a n * Real.cos (y * ω n)

lemma cosSer_term_bound (a ω : ℕ → ℝ) (n : ℕ) (y : ℝ) :
    ‖a n * Real.cos (y * ω n)‖ ≤ |a n| := by
  rw [Real.norm_eq_abs, abs_mul]
  exact mul_le_of_le_one_right (abs_nonneg _) (Real.abs_cos_le_one _)

lemma cosSer_summable (a ω : ℕ → ℝ) (ha : Summable fun n => |a n|) (y : ℝ) :
    Summable fun n => a n * Real.cos (y * ω n) :=
  Summable.of_norm_bounded ha (fun n => cosSer_term_bound a ω n y)

lemma cosSer_continuous (a ω : ℕ → ℝ) (ha : Summable fun n => |a n|) :
    Continuous (cosSer a ω) := by
  unfold cosSer
  exact continuous_tsum (fun n => by fun_prop) ha (fun n y => cosSer_term_bound a ω n y)

/-- The kernel `∫_0^T cos (y ω) dy`. -/
def kern (w T : ℝ) : ℝ := ∫ y in (0:ℝ)..T, Real.cos (y * w)

lemma kern_abs_le (w T : ℝ) (hT : 0 ≤ T) : |kern w T| ≤ T := by
  have h := intervalIntegral.norm_integral_le_of_norm_le_const (a := (0:ℝ)) (b := T)
    (f := fun y => Real.cos (y * w)) (C := 1)
    (fun x _ => by rw [Real.norm_eq_abs]; exact Real.abs_cos_le_one _)
  rw [Real.norm_eq_abs, sub_zero, abs_of_nonneg hT, one_mul] at h
  exact h

lemma kern_zero (T : ℝ) : kern 0 T = T := by
  simp [kern]

lemma kern_ne (w T : ℝ) (hw : w ≠ 0) : kern w T = Real.sin (T * w) / w := by
  unfold kern
  rw [intervalIntegral.integral_comp_mul_right (fun x => Real.cos x) hw]
  simp [integral_cos, div_eq_inv_mul]

lemma kern_mean_tendsto (w : ℝ) :
    Tendsto (fun T : ℝ => T⁻¹ * kern w T) atTop (𝓝 (if w = 0 then 1 else 0)) := by
  by_cases hw : w = 0
  · subst hw
    simp only [if_true]
    refine tendsto_const_nhds.congr' ?_
    filter_upwards [eventually_gt_atTop (0:ℝ)] with T hT
    rw [kern_zero, inv_mul_cancel₀ hT.ne']
  · simp only [if_neg hw]
    have h1 : Tendsto (fun T : ℝ => T⁻¹ * |w|⁻¹) atTop (𝓝 (0 * |w|⁻¹)) :=
      tendsto_inv_atTop_zero.mul_const _
    rw [zero_mul] at h1
    refine squeeze_zero_norm' ?_ h1
    filter_upwards [eventually_gt_atTop (0:ℝ)] with T hT
    rw [kern_ne w T hw, Real.norm_eq_abs, abs_mul, abs_div, abs_inv, abs_of_pos hT]
    have hTi : 0 ≤ T⁻¹ := inv_nonneg.mpr hT.le
    apply mul_le_mul_of_nonneg_left _ hTi
    rw [div_eq_mul_inv]
    exact mul_le_of_le_one_left (inv_nonneg.mpr (abs_nonneg _)) (Real.abs_sin_le_one _)

lemma integral_cosSer (a ω : ℕ → ℝ) (ha : Summable fun n => |a n|) (T : ℝ) :
    ∫ y in (0:ℝ)..T, cosSer a ω y = ∑' n, a n * kern (ω n) T := by
  have h := intervalIntegral.hasSum_integral_of_dominated_convergence
    (μ := MeasureTheory.volume) (a := (0:ℝ)) (b := T)
    (F := fun n y => a n * Real.cos (y * ω n)) (f := cosSer a ω)
    (fun n _ => |a n|)
    (fun n => (by fun_prop : Continuous fun y => a n * Real.cos (y * ω n)).aestronglyMeasurable)
    (fun n => Filter.Eventually.of_forall fun y _ => cosSer_term_bound a ω n y)
    (Filter.Eventually.of_forall fun _ _ => ha)
    intervalIntegrable_const
    (Filter.Eventually.of_forall fun y _ => (cosSer_summable a ω ha y).hasSum)
  rw [← h.tsum_eq]
  congr 1
  funext n
  simp [kern]

/-- Bohr mean of an absolutely summable cosine series. -/
lemma cosSer_mean_tendsto (a ω : ℕ → ℝ) (ha : Summable fun n => |a n|) :
    Tendsto (fun T : ℝ => T⁻¹ * ∫ y in (0:ℝ)..T, cosSer a ω y) atTop
      (𝓝 (∑' n, if ω n = 0 then a n else 0)) := by
  have h : Tendsto (fun T : ℝ => ∑' n, a n * (T⁻¹ * kern (ω n) T)) atTop
      (𝓝 (∑' n, a n * (if ω n = 0 then 1 else 0))) := by
    refine tendsto_tsum_of_dominated_convergence (bound := fun n => |a n|) ha ?_ ?_
    · intro n
      exact (kern_mean_tendsto (ω n)).const_mul (a n)
    · filter_upwards [eventually_gt_atTop (0:ℝ)] with T hT n
      rw [Real.norm_eq_abs, abs_mul]
      apply mul_le_of_le_one_right (abs_nonneg _)
      rw [abs_mul, abs_inv, abs_of_pos hT, inv_mul_le_iff₀ hT, mul_one]
      exact kern_abs_le _ _ hT.le
  have e : (fun n => a n * (if ω n = 0 then (1:ℝ) else 0)) =
      fun n => if ω n = 0 then a n else 0 := by
    funext n; split_ifs <;> simp
  rw [e] at h
  refine h.congr' ?_
  filter_upwards with T
  rw [integral_cosSer a ω ha T, ← tsum_mul_left]
  congr 1
  funext n
  ring

/-! ## The sign lemma -/

lemma gser_eq_cosSer (c : ℕ → ℝ) : gser c = cosSer c (fun n => Real.log n) := rfl

lemma log_nat_pos {m : ℕ} (hm : 2 ≤ m) : 0 < Real.log (m : ℝ) :=
  Real.log_pos (by exact_mod_cast hm)

/-- Key step: if `g ≤ 0` everywhere then `s/2 * c m ≤ 0` for `|s| ≤ 1`. -/
lemma key_le (c : ℕ → ℝ) (hsum : Summable fun n => |c n|) (h0 : c 0 = 0) (h1 : c 1 = 0)
    (hle : ∀ y, gser c y ≤ 0) (m : ℕ) (hm : 2 ≤ m) (s : ℝ) (hs : |s| ≤ 1) :
    s / 2 * c m ≤ 0 := by
  set lm : ℝ := Real.log (m : ℝ) with hlm
  have hlmpos : 0 < lm := log_nat_pos hm
  set b : ℕ → ℝ := fun n => s / 2 * c n with hb
  have hbsum : Summable fun n => |b n| := by
    have : (fun n => |b n|) = fun n => |s / 2| * |c n| := by
      funext n; simp [hb, abs_mul]
    rw [this]; exact hsum.mul_left _
  set ω1 : ℕ → ℝ := fun n => Real.log n
  set ω2 : ℕ → ℝ := fun n => Real.log n - lm
  set ω3 : ℕ → ℝ := fun n => Real.log n + lm
  -- pointwise identity
  have hid : ∀ y, gser c y * (1 + s * Real.cos (y * lm)) =
      cosSer c ω1 y + cosSer b ω2 y + cosSer b ω3 y := by
    intro y
    have s1 := cosSer_summable c ω1 hsum y
    have s2 := cosSer_summable b ω2 hbsum y
    have s3 := cosSer_summable b ω3 hbsum y
    unfold cosSer
    rw [← s1.tsum_add s2, ← (s1.add s2).tsum_add s3, gser, ← tsum_mul_right]
    congr 1
    funext n
    simp only [hb, ω1, ω2, ω3, mul_sub, mul_add, Real.cos_sub, Real.cos_add]
    ring
  -- limit of the means
  have t1 := cosSer_mean_tendsto c ω1 hsum
  have t2 := cosSer_mean_tendsto b ω2 hbsum
  have t3 := cosSer_mean_tendsto b ω3 hbsum
  have L1 : (∑' n, if ω1 n = 0 then c n else 0) = 0 := by
    have : (fun n => if ω1 n = 0 then c n else 0) = fun _ => (0:ℝ) := by
      funext n
      split_ifs with h
      · simp only [ω1] at h
        rcases Real.log_eq_zero.mp h with h | h | h
        · have : n = 0 := by exact_mod_cast h
          rw [this, h0]
        · have : n = 1 := by exact_mod_cast h
          rw [this, h1]
        · have : (0:ℝ) ≤ (n:ℝ) := Nat.cast_nonneg n
          linarith
      · rfl
    rw [this, tsum_zero]
  have L2 : (∑' n, if ω2 n = 0 then b n else 0) = b m := by
    rw [tsum_eq_single m]
    · simp [ω2, hlm]
    · intro n hn
      rw [if_neg]
      intro h
      simp only [ω2] at h
      have h' : Real.log (n:ℝ) = Real.log (m:ℝ) := by linarith
      rcases Nat.eq_zero_or_pos n with h0n | hpos
      · rw [h0n, Nat.cast_zero, Real.log_zero] at h'
        exact absurd h'.symm (log_nat_pos hm).ne'
      · have hnpos : (0:ℝ) < (n:ℝ) := by exact_mod_cast hpos
        have hmpos : (0:ℝ) < (m:ℝ) := by exact_mod_cast (by omega : 0 < m)
        have := Real.log_injOn_pos (Set.mem_Ioi.mpr hnpos) (Set.mem_Ioi.mpr hmpos) h'
        exact hn (by exact_mod_cast this)
  have L3 : (∑' n, if ω3 n = 0 then b n else 0) = 0 := by
    have : (fun n => if ω3 n = 0 then b n else 0) = fun _ => (0:ℝ) := by
      funext n
      rw [if_neg]
      simp only [ω3]
      have : 0 ≤ Real.log (n:ℝ) := Real.log_natCast_nonneg n
      linarith
    rw [this, tsum_zero]
  have tsum_all := (t1.add t2).add t3
  rw [L1, L2, L3, zero_add, add_zero] at tsum_all
  refine le_of_tendsto tsum_all ?_
  filter_upwards [eventually_gt_atTop (0:ℝ)] with T hT
  have c1 := (cosSer_continuous c ω1 hsum)
  have c2 := (cosSer_continuous b ω2 hbsum)
  have c3 := (cosSer_continuous b ω3 hbsum)
  have hint : ∫ y in (0:ℝ)..T, (cosSer c ω1 y + cosSer b ω2 y + cosSer b ω3 y) =
      (∫ y in (0:ℝ)..T, cosSer c ω1 y) + (∫ y in (0:ℝ)..T, cosSer b ω2 y)
        + ∫ y in (0:ℝ)..T, cosSer b ω3 y := by
    rw [intervalIntegral.integral_add (f := fun y => cosSer c ω1 y + cosSer b ω2 y)
      (g := fun y => cosSer b ω3 y) ((c1.add c2).intervalIntegrable _ _)
      (c3.intervalIntegrable _ _),
      intervalIntegral.integral_add (f := fun y => cosSer c ω1 y)
      (g := fun y => cosSer b ω2 y) (c1.intervalIntegrable _ _) (c2.intervalIntegrable _ _)]
  have hnonpos : ∫ y in (0:ℝ)..T, (cosSer c ω1 y + cosSer b ω2 y + cosSer b ω3 y) ≤ 0 := by
    have hneg : 0 ≤ ∫ y in (0:ℝ)..T, -(cosSer c ω1 y + cosSer b ω2 y + cosSer b ω3 y) := by
      apply intervalIntegral.integral_nonneg hT.le
      intro y _
      rw [← hid y, neg_nonneg]
      apply mul_nonpos_of_nonpos_of_nonneg (hle y)
      have hc := Real.abs_cos_le_one (y * lm)
      have : |s * Real.cos (y * lm)| ≤ 1 := by
        rw [abs_mul]; exact mul_le_one₀ hs (abs_nonneg _) hc
      linarith [(abs_le.mp this).1]
    rw [intervalIntegral.integral_neg] at hneg
    linarith
  rw [hint] at hnonpos
  have hTi : 0 ≤ T⁻¹ := inv_nonneg.mpr hT.le
  have := mul_nonpos_of_nonneg_of_nonpos hTi hnonpos
  linarith [this]

/-- A nonzero absolutely summable cosine series over the frequencies `log n`, `n ≥ 2`, takes a
strictly positive value. -/
theorem gser_exists_pos (c : ℕ → ℝ) (hsum : Summable fun n => |c n|)
    (h0 : c 0 = 0) (h1 : c 1 = 0) (hne : ∃ n, c n ≠ 0) :
    ∃ y : ℝ, 0 < gser c y := by
  by_contra hcon
  push_neg at hcon
  obtain ⟨m, hm⟩ := hne
  have hm2 : 2 ≤ m := by
    rcases m with _ | _ | m
    · exact absurd h0 hm
    · exact absurd h1 hm
    · omega
  have a1 := key_le c hsum h0 h1 hcon m hm2 1 (by simp)
  have a2 := key_le c hsum h0 h1 hcon m hm2 (-1) (by simp)
  apply hm
  linarith

/-- ... and a strictly negative value. -/
theorem gser_exists_neg (c : ℕ → ℝ) (hsum : Summable fun n => |c n|)
    (h0 : c 0 = 0) (h1 : c 1 = 0) (hne : ∃ n, c n ≠ 0) :
    ∃ y : ℝ, gser c y < 0 := by
  obtain ⟨m, hm⟩ := hne
  obtain ⟨y, hy⟩ := gser_exists_pos (fun n => -c n) (by simpa using hsum) (by simp [h0])
    (by simp [h1]) ⟨m, by simpa using hm⟩
  refine ⟨y, ?_⟩
  have : gser (fun n => -c n) y = -gser c y := by
    unfold gser
    rw [← tsum_neg]
    congr 1
    funext n
    ring
  linarith

/-- The series is continuous. -/
theorem gser_continuous (c : ℕ → ℝ) (hsum : Summable fun n => |c n|) :
    Continuous (gser c) := by
  rw [gser_eq_cosSer]
  exact cosSer_continuous c _ hsum

/-- Open-set form used in Theorem R: positivity on an interval, so a point can be chosen away
from any prescribed closed set with empty interior (the axis zeros). -/
theorem gser_pos_on_interval (c : ℕ → ℝ) (hsum : Summable fun n => |c n|)
    (h0 : c 0 = 0) (h1 : c 1 = 0) (hne : ∃ n, c n ≠ 0) :
    ∃ y₀ ε : ℝ, 0 < ε ∧ ∀ y, |y - y₀| < ε → 0 < gser c y := by
  obtain ⟨y₀, hy₀⟩ := gser_exists_pos c hsum h0 h1 hne
  have hopen : IsOpen {y | 0 < gser c y} :=
    isOpen_lt continuous_const (gser_continuous c hsum)
  obtain ⟨ε, hε, hball⟩ := Metric.isOpen_iff.mp hopen y₀ hy₀
  refine ⟨y₀, ε, hε, fun y hy => hball ?_⟩
  rw [Metric.mem_ball, Real.dist_eq]
  exact hy

/-- Theorem R in the lane's variables: `η` real, supported on `n ≥ 2`, nonzero,
`∑ |η n| n^{-1/2} < ∞`.  Then `∑ η(n) n^{-1/2} cos(y log n) > 0` on an interval, and for any
countable exceptional set `Zs` (heights of axis zeros/poles) there is a `y ∉ Zs` where the sum
is positive, i.e. where the real part `-g(y)` of the perturbed function is negative. -/
theorem theoremR_sign (η : ℕ → ℝ)
    (hsum : Summable fun n : ℕ => |η n| * (n : ℝ) ^ (-(1 / 2 : ℝ)))
    (h0 : η 0 = 0) (h1 : η 1 = 0) (hne : ∃ n, η n ≠ 0) (Zs : Set ℝ) (hZ : Zs.Countable) :
    ∃ y : ℝ, y ∉ Zs ∧
      0 < ∑' n : ℕ, η n * (n : ℝ) ^ (-(1 / 2 : ℝ)) * Real.cos (y * Real.log n) := by
  set c : ℕ → ℝ := fun n => η n * (n : ℝ) ^ (-(1 / 2 : ℝ)) with hc
  have hcs : Summable fun n => |c n| := by
    have : (fun n => |c n|) = fun n : ℕ => |η n| * (n : ℝ) ^ (-(1 / 2 : ℝ)) := by
      funext n
      rw [hc, abs_mul, abs_of_nonneg (Real.rpow_nonneg (Nat.cast_nonneg n) _)]
    rw [this]; exact hsum
  obtain ⟨m, hm⟩ := hne
  have hcm : c m ≠ 0 := by
    have hm0 : m ≠ 0 := fun h => hm (h ▸ h0)
    have hpos : (0:ℝ) < (m:ℝ) := by exact_mod_cast Nat.pos_of_ne_zero hm0
    exact mul_ne_zero hm (Real.rpow_pos_of_pos hpos _).ne'
  obtain ⟨y₀, ε, hε, hpos⟩ := gser_pos_on_interval c hcs (by simp [hc, h0]) (by simp [hc, h1])
    ⟨m, hcm⟩
  have hdense : Dense Zsᶜ := hZ.dense_compl ℝ
  obtain ⟨y, hyZ, hyball⟩ := hdense.exists_mem_open Metric.isOpen_ball
    (⟨y₀, Metric.mem_ball_self hε⟩ : (Metric.ball y₀ ε).Nonempty)
  refine ⟨y, hyZ, ?_⟩
  have := hpos y (by rwa [Metric.mem_ball, Real.dist_eq] at hyball)
  exact this

end

#print axioms gser_exists_pos
#print axioms gser_exists_neg
#print axioms gser_continuous
#print axioms gser_pos_on_interval
#print axioms theoremR_sign
