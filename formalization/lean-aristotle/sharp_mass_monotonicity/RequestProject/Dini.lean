import Mathlib

/-!
# Upper Dini derivatives

This file develops the small amount of one–dimensional real analysis needed for the
sharp–mass monotonicity theorem:

* `DiniUpper f y` : the upper right Dini derivative
  `D⁺f(y) = limsup_{h ↓ 0} (f (y+h) - f y)/h`, valued in `EReal`;
* `DiniUpper_max_le` : **Lemma L1**, `D⁺ max(u,v) ≤ max (D⁺u, D⁺v)`;
* `antitoneOn_of_DiniUpper_nonpos` : **Lemma L3**, the Dini monotonicity criterion;
* `DiniUpper_mul_weight_le` : the "weight peeling" estimate used in **Lemma L2**.
-/

open Filter Set Topology

namespace SharpMass

/-- The upper right Dini derivative `D⁺f(y) = limsup_{h ↓ 0} (f (y + h) - f y)/h`,
written as a `limsup` of slopes over the right neighbourhood filter and valued in `EReal`
(so that it is always defined). -/
noncomputable def DiniUpper (f : ℝ → ℝ) (y : ℝ) : EReal :=
  limsup (fun z => ((slope f y z : ℝ) : EReal)) (𝓝[>] y)

lemma EReal_coe_max (a b : ℝ) : ((max a b : ℝ) : EReal) = max (a : EReal) (b : EReal) := by
  rcases le_total a b with h | h
  · rw [max_eq_right h, max_eq_right (by exact_mod_cast h : (a : EReal) ≤ (b : EReal))]
  · rw [max_eq_left h, max_eq_left (by exact_mod_cast h : (b : EReal) ≤ (a : EReal))]

lemma slope_eq_div (f : ℝ → ℝ) (y z : ℝ) : slope f y z = (f z - f y) / (z - y) :=
  slope_def_field f y z

/-- The slope of a pointwise maximum is bounded by the maximum of the slopes (to the right). -/
lemma slope_max_le (u v : ℝ → ℝ) {y z : ℝ} (hz : y < z) :
    slope (fun x => max (u x) (v x)) y z ≤ max (slope u y z) (slope v y z) := by
  have hz' : 0 < z - y := sub_pos.2 hz
  have hmax : max (u z) (v z) - max (u y) (v y) ≤ max (u z - u y) (v z - v y) := by
    refine sub_le_iff_le_add.2 (max_le ?_ ?_)
    · linarith [le_max_left (u z - u y) (v z - v y), le_max_left (u y) (v y)]
    · linarith [le_max_right (u z - u y) (v z - v y), le_max_right (u y) (v y)]
  rw [slope_eq_div, slope_eq_div, slope_eq_div, max_div_div_right hz'.le]
  gcongr

/-- **Lemma L1.** The upper Dini derivative of a maximum of two functions is bounded by the
maximum of their upper Dini derivatives. -/
theorem DiniUpper_max_le (u v : ℝ → ℝ) (y : ℝ) :
    DiniUpper (fun x => max (u x) (v x)) y ≤ max (DiniUpper u y) (DiniUpper v y) := by
  have key : ∀ᶠ z in 𝓝[>] y, ((slope (fun x => max (u x) (v x)) y z : ℝ) : EReal)
      ≤ max ((slope u y z : ℝ) : EReal) ((slope v y z : ℝ) : EReal) := by
    filter_upwards [self_mem_nhdsWithin] with z hz
    rw [← EReal_coe_max]
    exact_mod_cast slope_max_le u v hz
  calc DiniUpper (fun x => max (u x) (v x)) y
      ≤ limsup (fun z => max ((slope u y z : ℝ) : EReal) ((slope v y z : ℝ) : EReal)) (𝓝[>] y) :=
        limsup_le_limsup key
    _ = max (DiniUpper u y) (DiniUpper v y) := limsup_max

/-- A convenient way of bounding an upper Dini derivative: dominate the slopes by a function
with a limit. -/
theorem DiniUpper_le_of_eventually_le {f g : ℝ → ℝ} {y M : ℝ}
    (hg : Tendsto g (𝓝[>] y) (𝓝 M))
    (h : ∀ᶠ z in 𝓝[>] y, slope f y z ≤ g z) : DiniUpper f y ≤ (M : EReal) := by
  have h1 : limsup (fun z => ((slope f y z : ℝ) : EReal)) (𝓝[>] y)
      ≤ limsup (fun z => ((g z : ℝ) : EReal)) (𝓝[>] y) := by
    refine limsup_le_limsup (h.mono fun z hz => ?_)
    simp only [EReal.coe_le_coe_iff]
    exact hz
  exact h1.trans_eq (Tendsto.limsup_eq ((continuous_coe_real_ereal.tendsto M).comp hg))

/-- **Lemma L3** (Dini criterion). A continuous function on `[a,b]` whose upper right Dini
derivative is `≤ 0` at every point of `[a,b)` is nonincreasing on `[a,b]`. -/
theorem antitoneOn_of_DiniUpper_nonpos {f : ℝ → ℝ} {a b : ℝ}
    (hf : ContinuousOn f (Icc a b)) (h : ∀ y ∈ Ico a b, DiniUpper f y ≤ 0) :
    AntitoneOn f (Icc a b) := by
  intro p hp q hq hpq
  have hsub : Icc p b ⊆ Icc a b := Icc_subset_Icc hp.1 le_rfl
  refine image_le_of_liminf_slope_right_le_deriv_boundary (f := f) (a := p) (b := b)
    (hf.mono hsub) (B := fun _ => f p) (B' := fun _ => 0) le_rfl continuousOn_const
    (fun x _ => hasDerivWithinAt_const _ _ _) ?_ (x := q) ⟨hpq, hq.2⟩
  intro x hx r hr
  have hx' : x ∈ Ico a b := ⟨le_trans hp.1 hx.1, hx.2⟩
  have hlt : DiniUpper f x < (r : EReal) :=
    lt_of_le_of_lt (h x hx') (by exact_mod_cast hr)
  have hev : ∀ᶠ z in 𝓝[>] x, ((slope f x z : ℝ) : EReal) < (r : EReal) :=
    eventually_lt_of_limsup_lt hlt
  exact (hev.mono fun z hz => by exact_mod_cast hz).frequently

/-- Auxiliary limit: the slope at `y` of `z ↦ exp (-(k * (z - y)))` tends to `-k`. -/
lemma tendsto_exp_weight_slope (y k : ℝ) :
    Tendsto (fun z => (Real.exp (-(k * (z - y))) - 1) / (z - y)) (𝓝[>] y) (𝓝 (-k)) := by
  have hE : HasDerivAt (fun z => Real.exp (-(k * (z - y)))) (-k) y := by
    have h1 : HasDerivAt (fun z : ℝ => -(k * (z - y))) (-k) y := by
      simpa using (((hasDerivAt_id y).sub_const y).const_mul k).neg
    simpa using h1.exp
  have h2 := hasDerivAt_iff_tendsto_slope.1 hE
  have h3 : Tendsto (slope (fun z => Real.exp (-(k * (z - y)))) y) (𝓝[>] y) (𝓝 (-k)) :=
    h2.mono_left (nhdsWithin_mono _ (fun x hx => ne_of_gt hx))
  refine h3.congr fun z => ?_
  rw [slope_eq_div]
  simp

/-- If `φ` is differentiable at `y`, the right difference quotients of `|φ(z) - φ(y)|`
tend to `|φ'(y)|`. -/
lemma tendsto_abs_slope {f : ℝ → ℝ} {y c : ℝ} (h : HasDerivAt f c y) :
    Tendsto (fun z => |f z - f y| / (z - y)) (𝓝[>] y) (𝓝 |c|) := by
  have h1 : Tendsto (slope f y) (𝓝[>] y) (𝓝 c) :=
    (hasDerivAt_iff_tendsto_slope.1 h).mono_left (nhdsWithin_mono _ fun x hx => ne_of_gt hx)
  have h2 := (continuous_abs.tendsto c).comp h1
  refine h2.congr' ?_
  filter_upwards [self_mem_nhdsWithin] with z hz
  have hz' : (0:ℝ) < z - y := sub_pos.2 hz
  rw [Function.comp_apply, slope_eq_div, abs_div, abs_of_pos hz']

/-- The weight-peeling estimate behind **Lemma L2**: if `u ≥ 0`, the positive weight `w`
decays at least like `exp (-k (z - y))` to the right of `y`, and the increments of `u` are
dominated by `p` with `p z / (z - y) → m`, then `D⁺(u w)(y) ≤ w y * (m - k * u y)`. -/
theorem DiniUpper_mul_weight_le {u w p : ℝ → ℝ} {y b k m : ℝ} (hyb : y < b)
    (hu0 : ∀ z ∈ Ioc y b, 0 ≤ u z) (hwy : 0 < w y)
    (hw : ∀ z ∈ Ioc y b, w z ≤ w y * Real.exp (-(k * (z - y))))
    (hp : ∀ z ∈ Ioc y b, u z - u y ≤ p z)
    (hlim : Tendsto (fun z => p z / (z - y)) (𝓝[>] y) (𝓝 m)) :
    DiniUpper (fun z => u z * w z) y ≤ ((w y * (m - k * u y) : ℝ) : EReal) := by
  set g : ℝ → ℝ := fun z => w y * ((p z / (z - y)) * Real.exp (-(k * (z - y)))
    + u y * ((Real.exp (-(k * (z - y))) - 1) / (z - y))) with hg
  have hE : Tendsto (fun z => Real.exp (-(k * (z - y)))) (𝓝[>] y) (𝓝 1) := by
    have : Continuous fun z : ℝ => Real.exp (-(k * (z - y))) := by fun_prop
    simpa using (this.tendsto y).mono_left nhdsWithin_le_nhds
  have hgt : Tendsto g (𝓝[>] y) (𝓝 (w y * (m - k * u y))) := by
    have := (tendsto_const_nhds (x := w y) (f := 𝓝[>] y)).mul
      ((hlim.mul hE).add ((tendsto_const_nhds (x := u y) (f := 𝓝[>] y)).mul
        (tendsto_exp_weight_slope y k)))
    simpa [hg, mul_comm, mul_left_comm, mul_assoc] using this
  refine DiniUpper_le_of_eventually_le hgt ?_
  filter_upwards [Ioc_mem_nhdsGT hyb] with z hz
  have hzy : 0 < z - y := sub_pos.2 hz.1
  have he : (0:ℝ) < Real.exp (-(k * (z - y))) := Real.exp_pos _
  have h1 : u z * w z ≤ u z * (w y * Real.exp (-(k * (z - y)))) :=
    mul_le_mul_of_nonneg_left (hw z hz) (hu0 z hz)
  have h2 : u z * (w y * Real.exp (-(k * (z - y)))) - u y * w y
      ≤ w y * (p z * Real.exp (-(k * (z - y))) + u y * (Real.exp (-(k * (z - y))) - 1)) := by
    have := mul_le_mul_of_nonneg_right (hp z hz) he.le
    nlinarith [hwy, this]
  have hnum : u z * w z - u y * w y
      ≤ w y * (p z * Real.exp (-(k * (z - y))) + u y * (Real.exp (-(k * (z - y))) - 1)) := by
    linarith
  rw [slope_eq_div, div_le_iff₀ hzy]
  have hgz : g z * (z - y)
      = w y * (p z * Real.exp (-(k * (z - y))) + u y * (Real.exp (-(k * (z - y))) - 1)) := by
    simp only [hg]
    field_simp
  rw [hgz]
  exact hnum

end SharpMass
