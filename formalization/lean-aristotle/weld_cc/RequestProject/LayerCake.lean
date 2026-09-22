import RequestProject.SymmetricUnimodal

/-!
# Layer-cake proof of separation monotonicity for the correlation of unimodal functions

For nonnegative, measurable, even and unimodal `f`, `g` on `ℝ`, the correlation
`Δ ↦ ∫ f u * g (u - Δ) du` is even and nonincreasing in `|Δ|`.  Here we prove the
statement for the Lebesgue (lower) integral, where no integrability hypothesis is needed;
the Bochner-integral version is deduced in `RequestProject.WeldCC`.

The proof is exactly the source proof: the layer-cake representation of `f` and of `g`
turns the correlation into a double integral of the overlap length of two symmetric
intervals, which is given by the formula
`max (0, min (2a, 2b, a + b - Δ))` and is nonincreasing in `Δ ≥ 0`.
-/

open MeasureTheory Set
open scoped ENNReal

namespace WeldCC

/-- An even function which is nonincreasing in `|·|` ("even and unimodal about its center"). -/
def SymmUnimodal (f : ℝ → ℝ) : Prop := ∀ ⦃x y : ℝ⦄, |x| ≤ |y| → f y ≤ f x

lemma SymmUnimodal.symm_eq {f : ℝ → ℝ} (hf : SymmUnimodal f) (x : ℝ) : f (-x) = f x :=
  le_antisymm (hf (x := x) (y := -x) (by simp)) (hf (x := -x) (y := x) (by simp))

/-- Super-level sets of an even unimodal function are symmetric intervals. -/
lemma SymmUnimodal.symmDown {f : ℝ → ℝ} (hf : SymmUnimodal f) (lam : ℝ) :
    SymmDown {u | lam < f u} := fun _ _ hxy hy => lt_of_lt_of_le hy (hf hxy)

/-- The correlation of `f` and `g` at separation `Δ`, as a Lebesgue (lower) integral. -/
noncomputable def lcorr (f g : ℝ → ℝ) (Δ : ℝ) : ℝ≥0∞ :=
  ∫⁻ u, ENNReal.ofReal (f u) * ENNReal.ofReal (g (u - Δ))

/-- **Layer-cake representation.**  The correlation is the double integral over levels
`lam, mu > 0` of the overlap of the level sets `{f > lam}` and `{g > mu} + Δ`. -/
lemma lcorr_layercake {f g : ℝ → ℝ} (hf : Measurable f) (hg : Measurable g)
    (hf0 : ∀ u, 0 ≤ f u) (hg0 : ∀ u, 0 ≤ g u) (Δ : ℝ) :
    lcorr f g Δ = ∫⁻ lam in Ioi 0, ∫⁻ mu in Ioi 0,
      volume ({u | lam < f u} ∩ (fun u => u - Δ) ⁻¹' {u | mu < g u}) := by
  have hgs : Measurable (fun u : ℝ => g (u - Δ)) := hg.comp (measurable_id.sub_const Δ)
  have hd : Measurable (fun u : ℝ => ENNReal.ofReal (g (u - Δ))) := hgs.ennreal_ofReal
  have hfm : Measurable (fun u : ℝ => ENNReal.ofReal (f u)) := hf.ennreal_ofReal
  set ν : Measure ℝ := volume.withDensity (fun u => ENNReal.ofReal (g (u - Δ))) with hν
  have h1 : ∫⁻ u, ENNReal.ofReal (f u) ∂ν = lcorr f g Δ := by
    rw [hν, lintegral_withDensity_eq_lintegral_mul _ hd hfm]
    simp [lcorr, Pi.mul_apply, mul_comm]
  rw [← h1, lintegral_eq_lintegral_meas_lt ν (Filter.Eventually.of_forall hf0) hf.aemeasurable]
  refine lintegral_congr fun lam => ?_
  have hS : MeasurableSet {a : ℝ | lam < f a} := measurableSet_lt measurable_const hf
  rw [hν, withDensity_apply _ hS,
    lintegral_eq_lintegral_meas_lt (volume.restrict {a : ℝ | lam < f a})
      (Filter.Eventually.of_forall (fun u => hg0 (u - Δ))) hgs.aemeasurable]
  refine lintegral_congr fun mu => ?_
  rw [Measure.restrict_apply (measurableSet_lt measurable_const hgs), Set.inter_comm]
  rfl

/-- **Evenness.**  The correlation of two even functions is an even function of the
separation `Δ`. -/
lemma lcorr_even {f g : ℝ → ℝ} (hf : ∀ x, f (-x) = f x) (hg : ∀ x, g (-x) = g x) (Δ : ℝ) :
    lcorr f g (-Δ) = lcorr f g Δ := by
  have := lintegral_neg_eq_self (μ := (volume : Measure ℝ))
    (fun u : ℝ => ENNReal.ofReal (f u) * ENNReal.ofReal (g (u - Δ)))
  rw [lcorr, lcorr, ← this]
  refine lintegral_congr fun u => ?_
  rw [hf u]
  congr 2
  have : -u - Δ = -(u + Δ) := by ring
  rw [this, hg (u + Δ)]
  ring_nf

/-- **Lemma CC, Lebesgue-integral form.**  For nonnegative measurable even unimodal `f`, `g`
the correlation `lcorr f g Δ` is nonincreasing in `Δ ≥ 0`. -/
lemma lcorr_antitone {f g : ℝ → ℝ} (hf : Measurable f) (hg : Measurable g)
    (hf0 : ∀ u, 0 ≤ f u) (hg0 : ∀ u, 0 ≤ g u)
    (hfu : SymmUnimodal f) (hgu : SymmUnimodal g)
    {Δ₁ Δ₂ : ℝ} (h0 : 0 ≤ Δ₁) (h12 : Δ₁ ≤ Δ₂) :
    lcorr f g Δ₂ ≤ lcorr f g Δ₁ := by
  rw [lcorr_layercake hf hg hf0 hg0, lcorr_layercake hf hg hf0 hg0]
  refine lintegral_mono fun lam => ?_
  refine lintegral_mono fun mu => ?_
  exact volume_inter_shift_antitone (hfu.symmDown lam) (hgu.symmDown mu) h0 h12

end WeldCC
