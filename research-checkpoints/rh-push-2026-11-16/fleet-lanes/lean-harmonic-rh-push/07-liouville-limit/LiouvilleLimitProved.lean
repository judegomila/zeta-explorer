import Mathlib

/-!
# The Liouville torus point: `∑ λ(n) n^{-s} = ζ(2s)/ζ(s)`, zero at `s = 1`, negative on `(1/2, 1)`

`λ(n) = (-1)^{Ω(n)}` is the Liouville function (the completely multiplicative function with
`λ(p) = -1`, i.e. all prime phases equal to `π`).
-/

open Filter Topology

noncomputable section

/-- Liouville function as a complex sequence. -/
def liouvilleC (n : ℕ) : ℂ := (-1 : ℂ) ^ (ArithmeticFunction.cardFactors n)

/-! ## Part 1: Euler product -/

/-- `n ↦ λ(n) n^{-s}` as a completely multiplicative function. -/
def liouvilleSummandHom {s : ℂ} (hs : s ≠ 0) : ℕ →*₀ ℂ where
  toFun n := liouvilleC n * (n : ℂ) ^ (-s)
  map_zero' := by simp [hs]
  map_one' := by simp [liouvilleC]
  map_mul' m n := by
    rcases eq_or_ne m 0 with rfl | hm
    · simp [hs]
    rcases eq_or_ne n 0 with rfl | hn
    · simp [hs]
    simp only [liouvilleC, ArithmeticFunction.cardFactors_mul hm hn, pow_add, Nat.cast_mul,
      Complex.natCast_mul_natCast_cpow]
    ring

lemma norm_liouvilleC (n : ℕ) : ‖liouvilleC n‖ = 1 := by
  simp [liouvilleC]

lemma summable_liouvilleSummand {s : ℂ} (hs : 1 < s.re) :
    Summable (fun n ↦ ‖liouvilleSummandHom (Complex.ne_zero_of_one_lt_re hs) n‖) := by
  have h := summable_riemannZetaSummand hs
  refine h.congr fun n ↦ ?_
  simp [liouvilleSummandHom, riemannZetaSummandHom, norm_liouvilleC]

lemma liouville_term_eq {s : ℂ} (hs : 1 < s.re) :
    LSeries.term liouvilleC s = fun n ↦ liouvilleSummandHom (Complex.ne_zero_of_one_lt_re hs) n := by
  funext n
  rw [LSeries.term_of_ne_zero' (Complex.ne_zero_of_one_lt_re hs)]
  simp [liouvilleSummandHom, Complex.cpow_neg, div_eq_mul_inv]

/-- The Dirichlet series of `λ` is absolutely convergent for `Re s > 1`. -/
theorem liouville_lseries_summable (s : ℂ) (hs : 1 < s.re) : LSeriesSummable liouvilleC s := by
  rw [LSeriesSummable, liouville_term_eq hs]
  exact (summable_liouvilleSummand hs).of_norm

lemma liouville_eulerProduct_hasProd {s : ℂ} (hs : 1 < s.re) :
    HasProd (fun p : Nat.Primes ↦ (1 + (p : ℂ) ^ (-s))⁻¹) (LSeries liouvilleC s) := by
  have h := EulerProduct.eulerProduct_completely_multiplicative_hasProd
    (summable_liouvilleSummand hs)
  rw [LSeries, liouville_term_eq hs]
  convert h using 2 with p
  have : ArithmeticFunction.cardFactors (p : ℕ) = 1 :=
    ArithmeticFunction.cardFactors_apply_prime p.prop
  simp [liouvilleSummandHom, liouvilleC, this]

/-- `ζ(s) * ∑ λ(n) n^{-s} = ζ(2s)` for `Re s > 1`. -/
theorem liouville_lseries_mul_zeta (s : ℂ) (hs : 1 < s.re) :
    LSeries liouvilleC s * riemannZeta s = riemannZeta (2 * s) := by
  have h1 := liouville_eulerProduct_hasProd hs
  have h2 := riemannZeta_eulerProduct_hasProd hs
  have hs2 : 1 < (2 * s).re := by simp; linarith
  have h3 := riemannZeta_eulerProduct_hasProd hs2
  have h12 := h1.mul h2
  refine h12.unique ?_
  convert h3 using 2 with p
  rw [← mul_inv]
  congr 1
  have : (p : ℂ) ^ (-(2 * s)) = (p : ℂ) ^ (-s) * (p : ℂ) ^ (-s) := by
    rw [← Complex.cpow_add _ _ (by exact_mod_cast p.prop.ne_zero)]
    congr 1; ring
  rw [this]; ring

lemma riemannZeta_ne_zero_of_one_lt_re' {s : ℂ} (hs : 1 < s.re) : riemannZeta s ≠ 0 :=
  riemannZeta_ne_zero_of_one_le_re hs.le

/-- `∑ λ(n) n^{-s} = ζ(2s)/ζ(s)` for `Re s > 1`. -/
theorem liouville_lseries_eq (s : ℂ) (hs : 1 < s.re) :
    LSeries liouvilleC s = riemannZeta (2 * s) / riemannZeta s := by
  rw [← liouville_lseries_mul_zeta s hs, mul_div_cancel_right₀ _
    (riemannZeta_ne_zero_of_one_lt_re' hs)]

/-- The continuation `ζ(2s)/ζ(s)` tends to `0` at `s = 1` (the pole of `ζ`). -/
theorem zeta_ratio_tendsto_zero :
    Tendsto (fun s : ℂ => riemannZeta (2 * s) / riemannZeta s) (𝓝[≠] 1) (𝓝 0) := by
  have h1 := riemannZeta_residue_one
  have h2 : Tendsto (fun s : ℂ => riemannZeta (2 * s)) (𝓝[≠] 1) (𝓝 (riemannZeta 2)) := by
    have hc : ContinuousAt (fun s : ℂ => riemannZeta (2 * s)) 1 := by
      have : ContinuousAt riemannZeta (2 * 1) :=
        (differentiableAt_riemannZeta (by norm_num)).continuousAt
      exact ContinuousAt.comp (f := fun s : ℂ => 2 * s) this (by fun_prop)
    have := hc.tendsto
    simp only [mul_one] at this
    exact this.mono_left nhdsWithin_le_nhds
  have h3 : Tendsto (fun s : ℂ => s - 1) (𝓝[≠] 1) (𝓝 0) := by
    have : Tendsto (fun s : ℂ => s - 1) (𝓝 1) (𝓝 (1 - 1)) :=
      (continuous_id.sub continuous_const).tendsto 1
    simpa using this.mono_left nhdsWithin_le_nhds
  have h4 := h2.mul (h3.div h1 one_ne_zero)
  simp only [zero_div, mul_zero] at h4
  refine h4.congr' ?_
  filter_upwards [self_mem_nhdsWithin] with s hs
  have hs' : s - 1 ≠ 0 := sub_ne_zero.mpr hs
  by_cases hz : riemannZeta s = 0
  · simp [hz]
  · simp only [Pi.div_apply]
    field_simp

/-- The Dirichlet series itself tends to `0` as `σ ↓ 1` along the reals. -/
theorem liouville_lseries_tendsto_zero :
    Tendsto (fun σ : ℝ => LSeries liouvilleC (σ : ℂ)) (𝓝[>] 1) (𝓝 0) := by
  have hc : Tendsto (fun σ : ℝ => (σ : ℂ)) (𝓝[>] 1) (𝓝[≠] 1) := by
    refine tendsto_nhdsWithin_iff.mpr ⟨?_, ?_⟩
    · have : Tendsto (fun σ : ℝ => (σ : ℂ)) (𝓝 1) (𝓝 ((1 : ℝ) : ℂ)) :=
        Complex.continuous_ofReal.tendsto 1
      simpa using this.mono_left nhdsWithin_le_nhds
    · filter_upwards [self_mem_nhdsWithin] with σ hσ
      have : (1 : ℝ) < σ := hσ
      simp only [Set.mem_compl_iff, Set.mem_singleton_iff]
      exact_mod_cast this.ne'
  refine (zeta_ratio_tendsto_zero.comp hc).congr' ?_
  filter_upwards [self_mem_nhdsWithin] with σ hσ
  have : (1 : ℝ) < σ := hσ
  simp only [Function.comp]
  rw [liouville_lseries_eq]
  simpa using this


/-! ## Part 2: the sign of `ζ` on `(0, 1)` via the alternating (eta) series -/

/-- Paired terms of the alternating zeta series. -/
def etaPair (k : ℕ) (s : ℂ) : ℂ := (2 * (k : ℂ) + 1) ^ (-s) - (2 * (k : ℂ) + 2) ^ (-s)

/-- The paired alternating series. -/
def etaG (s : ℂ) : ℂ := ∑' k : ℕ, etaPair k s

lemma cpow_sub_bound {a : ℝ} (ha : 1 ≤ a) (s : ℂ) (hs : 0 < s.re) :
    ‖(a : ℂ) ^ (-s) - ((a : ℂ) + 1) ^ (-s)‖ ≤ ‖s‖ * a ^ (-s.re - 1) := by
  have hd : ∀ x ∈ Set.Icc a (a + 1), HasDerivWithinAt (fun y : ℝ => (y : ℂ) ^ (-s))
      (-s * (x : ℂ) ^ (-s - 1)) (Set.Icc a (a + 1)) x := by
    intro x hx
    have hx0 : 0 < x := by linarith [hx.1]
    have := (Complex.hasStrictDerivAt_cpow_const (x := (x : ℂ)) (c := -s)
      (Complex.ofReal_mem_slitPlane.mpr hx0)).hasDerivAt.comp_ofReal
    exact this.hasDerivWithinAt
  have hb : ∀ x ∈ Set.Icc a (a + 1), ‖-s * (x : ℂ) ^ (-s - 1)‖ ≤ ‖s‖ * a ^ (-s.re - 1) := by
    intro x hx
    have hx0 : 0 < x := by linarith [hx.1]
    rw [norm_mul, norm_neg, Complex.norm_cpow_eq_rpow_re_of_pos hx0]
    simp only [Complex.sub_re, Complex.neg_re, Complex.one_re]
    exact mul_le_mul_of_nonneg_left
      (Real.rpow_le_rpow_of_nonpos (by linarith) hx.1 (by linarith)) (norm_nonneg _)
  have := Convex.norm_image_sub_le_of_norm_hasDerivWithin_le hd hb (convex_Icc _ _)
    (Set.left_mem_Icc.mpr (by linarith)) (Set.right_mem_Icc.mpr (by linarith))
  rw [norm_sub_rev]
  simpa using this

lemma etaPair_bound (k : ℕ) (s : ℂ) (hs : 0 < s.re) :
    ‖etaPair k s‖ ≤ ‖s‖ * ((2 * k + 1 : ℕ) : ℝ) ^ (-s.re - 1) := by
  have h := cpow_sub_bound (a := ((2 * k + 1 : ℕ) : ℝ)) (by norm_cast; omega) s hs
  have e : etaPair k s = (((2 * k + 1 : ℕ) : ℝ) : ℂ) ^ (-s) - ((((2 * k + 1 : ℕ) : ℝ) : ℂ) + 1) ^ (-s) := by
    unfold etaPair
    push_cast
    ring_nf
  rw [e]; exact h

lemma summable_odd_rpow {ε : ℝ} (hε : 0 < ε) :
    Summable (fun k : ℕ => ((2 * k + 1 : ℕ) : ℝ) ^ (-ε - 1)) := by
  have h : Summable (fun n : ℕ => (n : ℝ) ^ (-ε - 1)) :=
    Real.summable_nat_rpow.mpr (by linarith)
  have hinj : Function.Injective (fun k : ℕ => 2 * k + 1) := fun a b h => by
    simp only at h; omega
  exact h.comp_injective hinj

lemma etaPair_bound_region {ε M : ℝ} (k : ℕ) (s : ℂ) (h1 : ε < s.re) (hε : 0 < ε)
    (h2 : ‖s‖ < M) : ‖etaPair k s‖ ≤ M * ((2 * k + 1 : ℕ) : ℝ) ^ (-ε - 1) := by
  refine (etaPair_bound k s (hε.trans h1)).trans ?_
  have hb : (1 : ℝ) ≤ ((2 * k + 1 : ℕ) : ℝ) := by norm_cast; omega
  have h3 : ((2 * k + 1 : ℕ) : ℝ) ^ (-s.re - 1) ≤ ((2 * k + 1 : ℕ) : ℝ) ^ (-ε - 1) :=
    Real.rpow_le_rpow_of_exponent_le hb (by linarith)
  exact mul_le_mul h2.le h3 (Real.rpow_nonneg (by positivity) _) ((norm_nonneg _).trans h2.le)

lemma summable_etaPair (s : ℂ) (hs : 0 < s.re) : Summable (fun k => etaPair k s) := by
  refine Summable.of_norm_bounded (g := fun k : ℕ => (‖s‖ + 1) * ((2 * k + 1 : ℕ) : ℝ) ^ (-(s.re / 2) - 1))
    ((summable_odd_rpow (half_pos hs)).mul_left _) fun k => ?_
  exact etaPair_bound_region k s (by linarith) (half_pos hs) (by linarith)

lemma differentiable_etaPair (k : ℕ) : Differentiable ℂ (etaPair k) := by
  unfold etaPair
  have h1 : (2 * (k : ℂ) + 1) ≠ 0 := by norm_cast
  have h2 : (2 * (k : ℂ) + 2) ≠ 0 := by norm_cast
  intro s
  exact ((differentiableAt_id.neg).const_cpow (Or.inl h1)).sub
    ((differentiableAt_id.neg).const_cpow (Or.inl h2))

lemma differentiableAt_etaG {s : ℂ} (hs : 0 < s.re) : DifferentiableAt ℂ etaG s := by
  set ε := s.re / 2
  set M := ‖s‖ + 1
  have hV : IsOpen {w : ℂ | ε < w.re ∧ ‖w‖ < M} :=
    (isOpen_lt continuous_const Complex.continuous_re).inter (isOpen_lt continuous_norm continuous_const)
  have hd : DifferentiableOn ℂ etaG {w : ℂ | ε < w.re ∧ ‖w‖ < M} := by
    refine Complex.differentiableOn_tsum_of_summable_norm
      (u := fun k : ℕ => M * ((2 * k + 1 : ℕ) : ℝ) ^ (-ε - 1))
      ((summable_odd_rpow (half_pos hs)).mul_left _)
      (fun k => (differentiable_etaPair k).differentiableOn) hV ?_
    intro k w hw
    exact etaPair_bound_region k w hw.1 (half_pos hs) hw.2
  refine hd.differentiableAt (hV.mem_nhds ⟨?_, ?_⟩)
  · simp only [ε]; linarith
  · simp only [M]; linarith

/-- For `Re s > 1`, the paired alternating series equals `(1 - 2^{1-s}) ζ(s)`. -/
lemma etaG_eq_of_one_lt {s : ℂ} (hs : 1 < s.re) :
    etaG s = (1 - (2 : ℂ) ^ (1 - s)) * riemannZeta s := by
  set f : ℕ → ℂ := fun n => 1 / ((n : ℂ) + 1) ^ s with hf
  have hz : riemannZeta s = ∑' n, f n := zeta_eq_tsum_one_div_nat_add_one_cpow hs
  have hsum : Summable f := by
    have h := (Complex.summable_one_div_nat_cpow (p := s)).mpr hs
    have := (summable_nat_add_iff 1).mpr h
    refine this.congr fun n => ?_
    simp [hf]
  have he : Summable (fun k => f (2 * k)) :=
    hsum.comp_injective (fun a b (h : 2 * a = 2 * b) => by omega)
  have ho : Summable (fun k => f (2 * k + 1)) :=
    hsum.comp_injective (fun a b (h : 2 * a + 1 = 2 * b + 1) => by omega)
  have hsplit := tsum_even_add_odd he ho
  have hodd : ∀ k, f (2 * k + 1) = (2 : ℂ) ^ (-s) * f k := by
    intro k
    simp only [hf]
    have : ((2 * k + 1 : ℕ) : ℂ) + 1 = ((2 : ℕ) : ℂ) * ((k + 1 : ℕ) : ℂ) := by push_cast; ring
    rw [this, Complex.natCast_mul_natCast_cpow, Complex.cpow_neg]
    push_cast
    field_simp
  have hO : ∑' k, f (2 * k + 1) = (2 : ℂ) ^ (-s) * riemannZeta s := by
    simp_rw [hodd]
    rw [tsum_mul_left, hz]
  have hpair : ∀ k, etaPair k s = f (2 * k) - f (2 * k + 1) := by
    intro k
    simp only [hf, etaPair, Complex.cpow_neg, one_div]
    push_cast
    ring_nf
  have hG : etaG s = ∑' k, f (2 * k) - ∑' k, f (2 * k + 1) := by
    unfold etaG
    simp_rw [hpair]
    exact he.tsum_sub ho
  have h2 : (2 : ℂ) ^ (1 - s) = 2 * (2 : ℂ) ^ (-s) := by
    rw [sub_eq_add_neg, Complex.cpow_add _ _ two_ne_zero, Complex.cpow_one]
  rw [hG, h2]
  have hE : ∑' k, f (2 * k) = riemannZeta s - (2 : ℂ) ^ (-s) * riemannZeta s := by
    rw [hO, ← hz] at hsplit
    exact eq_sub_of_add_eq hsplit
  rw [hE, hO]; ring

/-- The star-shaped domain `{Re s > 0} \ [1, ∞)`. -/
def slitHalfPlane : Set ℂ := {s : ℂ | 0 < s.re ∧ (s.im = 0 → s.re < 1)}

lemma isOpen_slitHalfPlane : IsOpen slitHalfPlane := by
  have : slitHalfPlane = {s : ℂ | 0 < s.re} ∩ ({s : ℂ | s.im ≠ 0} ∪ {s : ℂ | s.re < 1}) := by
    ext s
    simp only [slitHalfPlane, Set.mem_setOf_eq, Set.mem_inter_iff, Set.mem_union]
    constructor
    · rintro ⟨h1, h2⟩
      refine ⟨h1, ?_⟩
      by_cases h : s.im = 0
      · exact Or.inr (h2 h)
      · exact Or.inl h
    · rintro ⟨h1, h2 | h2⟩
      · exact ⟨h1, fun h => absurd h h2⟩
      · exact ⟨h1, fun _ => h2⟩
  rw [this]
  exact (isOpen_lt continuous_const Complex.continuous_re).inter
    ((isOpen_ne_fun Complex.continuous_im continuous_const).union
      (isOpen_lt Complex.continuous_re continuous_const))

lemma starConvex_slitHalfPlane : StarConvex ℝ (1 / 2 : ℂ) slitHalfPlane := by
  intro z hz a b ha hb hab
  obtain ⟨hz1, hz2⟩ := hz
  have hre : (a • (1 / 2 : ℂ) + b • z).re = a / 2 + b * z.re := by
    simp [Complex.add_re]; ring
  have him : (a • (1 / 2 : ℂ) + b • z).im = b * z.im := by
    simp [Complex.add_im]
  refine ⟨?_, ?_⟩
  · rw [hre]
    rcases eq_or_lt_of_le hb with hb0 | hb0
    · have : a = 1 := by linarith
      rw [← hb0, this]; norm_num
    · have : 0 < b * z.re := mul_pos hb0 hz1
      have ha2 : 0 ≤ a / 2 := by linarith
      linarith
  · rw [hre, him]
    intro h
    rcases mul_eq_zero.mp h with hb0 | hz0
    · have : a = 1 := by linarith
      rw [hb0, this]; norm_num
    · have := hz2 hz0
      nlinarith

lemma isPreconnected_slitHalfPlane : IsPreconnected slitHalfPlane := by
  have hne : (1 / 2 : ℂ) ∈ slitHalfPlane := by
    refine ⟨by norm_num, fun _ => by norm_num⟩
  exact (starConvex_slitHalfPlane.isPathConnected hne).isConnected.isPreconnected

/-- The eta identity on the slit half-plane, by analytic continuation. -/
lemma etaG_eq_on_slit : Set.EqOn etaG (fun s => (1 - (2 : ℂ) ^ (1 - s)) * riemannZeta s)
    slitHalfPlane := by
  have hG : AnalyticOnNhd ℂ etaG slitHalfPlane :=
    DifferentiableOn.analyticOnNhd
      (fun s hs => (differentiableAt_etaG hs.1).differentiableWithinAt) isOpen_slitHalfPlane
  have hF : AnalyticOnNhd ℂ (fun s => (1 - (2 : ℂ) ^ (1 - s)) * riemannZeta s) slitHalfPlane := by
    refine DifferentiableOn.analyticOnNhd (fun s hs => ?_) isOpen_slitHalfPlane
    have hs1 : s ≠ 1 := by
      rintro rfl
      have := hs.2 (by simp)
      simp at this
    have hd : DifferentiableAt ℂ (fun s : ℂ => (1 - (2 : ℂ) ^ (1 - s))) s :=
      (differentiableAt_const _).sub
        (((differentiableAt_const _).sub differentiableAt_id).const_cpow (Or.inl two_ne_zero))
    exact (hd.mul (differentiableAt_riemannZeta hs1)).differentiableWithinAt
  have hz0 : (2 + Complex.I : ℂ) ∈ slitHalfPlane := by
    refine ⟨by simp, fun h => ?_⟩
    simp at h
  refine hG.eqOn_of_preconnected_of_eventuallyEq hF isPreconnected_slitHalfPlane hz0 ?_
  have hopen : IsOpen {s : ℂ | 1 < s.re} := isOpen_lt continuous_const Complex.continuous_re
  filter_upwards [hopen.mem_nhds (show (2 + Complex.I : ℂ) ∈ {s : ℂ | 1 < s.re} by simp)] with s hs
  exact etaG_eq_of_one_lt hs

/-- On real `σ > 0` the paired series is a positive real number. -/
lemma etaG_real_pos {σ : ℝ} (hσ : 0 < σ) : ∃ R : ℝ, 0 < R ∧ etaG (σ : ℂ) = (R : ℂ) := by
  set r : ℕ → ℝ := fun k => (2 * (k : ℝ) + 1) ^ (-σ) - (2 * (k : ℝ) + 2) ^ (-σ) with hr
  have hcast : ∀ k, etaPair k (σ : ℂ) = ((r k : ℝ) : ℂ) := by
    intro k
    simp only [hr, etaPair]
    rw [Complex.ofReal_sub, Complex.ofReal_cpow (by positivity), Complex.ofReal_cpow (by positivity)]
    push_cast
    rfl
  have hpos : ∀ k, 0 < r k := by
    intro k
    simp only [hr]
    have : (2 * (k : ℝ) + 2) ^ (-σ) < (2 * (k : ℝ) + 1) ^ (-σ) :=
      Real.rpow_lt_rpow_of_neg (by positivity) (by linarith) (by linarith)
    linarith
  have hsumC : Summable (fun k => ((r k : ℝ) : ℂ)) := by
    have := summable_etaPair (σ : ℂ) (by simpa using hσ)
    exact this.congr hcast
  have hsum : Summable r := Complex.summable_ofReal.mp hsumC
  refine ⟨∑' k, r k, hsum.tsum_pos (fun k => (hpos k).le) 0 (hpos 0), ?_⟩
  unfold etaG
  simp_rw [hcast]
  exact (Complex.ofReal_tsum _).symm

/-- `ζ(σ)` is a negative real number for real `σ ∈ (0, 1)`. -/
theorem riemannZeta_real_neg {σ : ℝ} (h0 : 0 < σ) (h1 : σ < 1) :
    ∃ r : ℝ, r < 0 ∧ riemannZeta (σ : ℂ) = (r : ℂ) := by
  obtain ⟨R, hR, hG⟩ := etaG_real_pos h0
  have hmem : (σ : ℂ) ∈ slitHalfPlane := ⟨by simpa using h0, fun _ => by simpa using h1⟩
  have h := etaG_eq_on_slit hmem
  simp only at h
  rw [hG] at h
  set c : ℝ := 1 - (2 : ℝ) ^ (1 - σ) with hc
  have hcneg : c < 0 := by
    have : (1 : ℝ) < (2 : ℝ) ^ (1 - σ) := Real.one_lt_rpow (by norm_num) (by linarith)
    simp only [hc]; linarith
  have hcC : (1 - (2 : ℂ) ^ (1 - (σ : ℂ))) = ((c : ℝ) : ℂ) := by
    simp only [hc]
    rw [Complex.ofReal_sub, Complex.ofReal_cpow (by norm_num)]
    push_cast
    rfl
  rw [hcC] at h
  refine ⟨R / c, div_neg_of_pos_of_neg hR hcneg, ?_⟩
  have hc0 : ((c : ℝ) : ℂ) ≠ 0 := by exact_mod_cast hcneg.ne
  rw [Complex.ofReal_div, h]
  field_simp

/-- `ζ(x)` is a positive real number for real `x > 1`. -/
theorem riemannZeta_real_pos {x : ℝ} (hx : 1 < x) :
    ∃ r : ℝ, 0 < r ∧ riemannZeta (x : ℂ) = (r : ℂ) := by
  have hxC : 1 < (x : ℂ).re := by simpa using hx
  set g : ℕ → ℝ := fun n => 1 / ((n : ℝ) + 1) ^ x with hg
  have hcast : ∀ n : ℕ, (1 / ((n : ℂ) + 1) ^ (x : ℂ) : ℂ) = ((g n : ℝ) : ℂ) := by
    intro n
    simp only [hg]
    rw [Complex.ofReal_div, Complex.ofReal_cpow (by positivity)]
    push_cast
    rfl
  have hpos : ∀ n, 0 < g n := fun n => by simp only [hg]; positivity
  have hsumC : Summable (fun n : ℕ => (1 / ((n : ℂ) + 1) ^ (x : ℂ) : ℂ)) := by
    have h := (Complex.summable_one_div_nat_cpow (p := (x : ℂ))).mpr hxC
    have := (summable_nat_add_iff 1).mpr h
    refine this.congr fun n => ?_
    simp
  have hsum : Summable g := Complex.summable_ofReal.mp (hsumC.congr hcast)
  refine ⟨∑' n, g n, hsum.tsum_pos (fun n => (hpos n).le) 0 (hpos 0), ?_⟩
  rw [zeta_eq_tsum_one_div_nat_add_one_cpow hxC]
  simp_rw [hcast]
  exact (Complex.ofReal_tsum _).symm

/-- On the real segment `(1/2, 1)` the limit function `ζ(2σ)/ζ(σ)` is real and negative. -/
theorem zeta_ratio_neg (σ : ℝ) (h1 : 1 / 2 < σ) (h2 : σ < 1) :
    (riemannZeta (2 * (σ : ℂ)) / riemannZeta (σ : ℂ)).re < 0 ∧
    (riemannZeta (2 * (σ : ℂ)) / riemannZeta (σ : ℂ)).im = 0 := by
  obtain ⟨r, hr, hzr⟩ := riemannZeta_real_neg (σ := σ) (by linarith) h2
  obtain ⟨a, ha, hza⟩ := riemannZeta_real_pos (x := 2 * σ) (by linarith)
  have e : (2 * (σ : ℂ)) = ((2 * σ : ℝ) : ℂ) := by push_cast; rfl
  rw [e, hza, hzr, ← Complex.ofReal_div]
  exact ⟨by simpa using div_neg_of_pos_of_neg ha hr, Complex.ofReal_im _⟩

end

#print axioms liouville_lseries_summable
#print axioms liouville_lseries_mul_zeta
#print axioms liouville_lseries_eq
#print axioms zeta_ratio_tendsto_zero
#print axioms liouville_lseries_tendsto_zero
#print axioms zeta_ratio_neg
