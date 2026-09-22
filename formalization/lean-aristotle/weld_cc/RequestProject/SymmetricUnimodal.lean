import Mathlib

/-!
# Symmetric unimodal sets and the overlap-length formula

This file develops the geometric input for Lemma CC (separation monotonicity):
the super-level sets of an even, unimodal envelope are *symmetric intervals*, and
the overlap of two symmetric intervals with half-lengths `a`, `b` whose centers are
at distance `Δ ≥ 0` has length exactly

  `max (0, min (2a, 2b, a + b - Δ))`

which is nonincreasing in `Δ`.
-/

open MeasureTheory Set

namespace WeldCC

private lemma ofReal_max_zero (x : ℝ) : ENNReal.ofReal x = ENNReal.ofReal (max 0 x) := by
  rcases le_total 0 x with h | h
  · rw [max_eq_right h]
  · rw [max_eq_left h, ENNReal.ofReal_eq_zero.2 h, ENNReal.ofReal_zero]

/-- A set of reals which is symmetric about `0` and "downward closed" for `|·|`:
this is exactly the shape of a super-level set of an even unimodal function. -/
def SymmDown (S : Set ℝ) : Prop := ∀ ⦃x y : ℝ⦄, |x| ≤ |y| → y ∈ S → x ∈ S

lemma SymmDown.neg {S : Set ℝ} (hS : SymmDown S) {x : ℝ} (hx : x ∈ S) : -x ∈ S :=
  hS (by simp) hx

/-- Structure theorem: a symmetric downward-closed set is empty, all of `ℝ`, or a
symmetric interval with some half-length `a ≥ 0`. -/
lemma SymmDown.trichotomy {S : Set ℝ} (hS : SymmDown S) :
    S = ∅ ∨ S = univ ∨ ∃ a : ℝ, 0 ≤ a ∧ Ioo (-a) a ⊆ S ∧ S ⊆ Icc (-a) a := by
  rcases eq_empty_or_nonempty S with h | ⟨x0, hx0⟩
  · exact Or.inl h
  right
  have h0 : (0:ℝ) ∈ S := hS (by simp) hx0
  by_cases hb : BddAbove S
  · right
    refine ⟨sSup S, le_csSup hb h0, ?_, ?_⟩
    · intro x hx
      have hlt : |x| < sSup S := by
        rcases abs_cases x with ⟨h1, h2⟩ | ⟨h1, h2⟩ <;> simp [h1] <;> simp at hx <;>
          linarith [hx.1, hx.2]
      obtain ⟨y, hy, hxy⟩ := exists_lt_of_lt_csSup ⟨x0, hx0⟩ hlt
      exact hS (le_of_lt (lt_of_lt_of_le hxy (le_abs_self y))) hy
    · intro x hx
      refine ⟨?_, le_csSup hb hx⟩
      have hx' : -x ∈ S := hS (by simp) hx
      have := le_csSup hb hx'
      linarith
  · left
    ext u
    simp only [mem_univ, iff_true]
    rw [not_bddAbove_iff] at hb
    obtain ⟨y, hy, huy⟩ := hb |u|
    exact hS (le_of_lt (lt_of_lt_of_le huy (le_abs_self y))) hy

/-- Overlap of two open symmetric intervals: the verbatim formula. -/
lemma volume_Ioo_inter_Ioo (a b Δ : ℝ) (hΔ : 0 ≤ Δ) :
    volume (Ioo (-a) a ∩ Ioo (Δ - b) (Δ + b))
      = ENNReal.ofReal (max 0 (min (2 * a) (min (2 * b) (a + b - Δ)))) := by
  rw [Set.Ioo_inter_Ioo, Real.volume_Ioo, ofReal_max_zero]
  congr 1
  rcases le_total a (Δ + b) with h1 | h1 <;> rcases le_total (-a) (Δ - b) with h2 | h2 <;>
    simp [max_def, min_def] <;> split_ifs <;> linarith

/-- Overlap of two closed symmetric intervals: the same verbatim formula. -/
lemma volume_Icc_inter_Icc (a b Δ : ℝ) (hΔ : 0 ≤ Δ) :
    volume (Icc (-a) a ∩ Icc (Δ - b) (Δ + b))
      = ENNReal.ofReal (max 0 (min (2 * a) (min (2 * b) (a + b - Δ)))) := by
  rw [Set.Icc_inter_Icc, Real.volume_Icc, ofReal_max_zero]
  congr 1
  rcases le_total a (Δ + b) with h1 | h1 <;> rcases le_total (-a) (Δ - b) with h2 | h2 <;>
    simp [max_def, min_def] <;> split_ifs <;> linarith

private lemma shift_lower {T : Set ℝ} {b : ℝ} (hTl : Ioo (-b) b ⊆ T) (Δ : ℝ) :
    Ioo (Δ - b) (Δ + b) ⊆ (fun u => u - Δ) ⁻¹' T := by
  intro u hu
  exact hTl ⟨by simp; linarith [hu.1], by simp; linarith [hu.2]⟩

private lemma shift_upper {T : Set ℝ} {b : ℝ} (hTu : T ⊆ Icc (-b) b) (Δ : ℝ) :
    (fun u => u - Δ) ⁻¹' T ⊆ Icc (Δ - b) (Δ + b) := by
  intro u hu
  have h := hTu hu
  simp only [mem_Icc] at h ⊢
  constructor <;> linarith [h.1, h.2]

/-- **Overlap length formula.**  If `S` and `T` are symmetric intervals with half-lengths
`a` and `b`, then the overlap of `S` with the translate of `T` by `Δ ≥ 0` has measure
`max (0, min (2a, 2b, a + b - Δ))`. -/
lemma volume_inter_shift_eq {S T : Set ℝ} {a b : ℝ}
    (hSl : Ioo (-a) a ⊆ S) (hSu : S ⊆ Icc (-a) a)
    (hTl : Ioo (-b) b ⊆ T) (hTu : T ⊆ Icc (-b) b)
    {Δ : ℝ} (hΔ : 0 ≤ Δ) :
    volume (S ∩ (fun u => u - Δ) ⁻¹' T)
      = ENNReal.ofReal (max 0 (min (2 * a) (min (2 * b) (a + b - Δ)))) := by
  have hlow : Ioo (-a) a ∩ Ioo (Δ - b) (Δ + b) ⊆ S ∩ (fun u => u - Δ) ⁻¹' T :=
    inter_subset_inter hSl (shift_lower hTl Δ)
  have hup : S ∩ (fun u => u - Δ) ⁻¹' T ⊆ Icc (-a) a ∩ Icc (Δ - b) (Δ + b) :=
    inter_subset_inter hSu (shift_upper hTu Δ)
  refine le_antisymm ?_ ?_
  · calc volume (S ∩ (fun u => u - Δ) ⁻¹' T)
        ≤ volume (Icc (-a) a ∩ Icc (Δ - b) (Δ + b)) := measure_mono hup
      _ = _ := volume_Icc_inter_Icc a b Δ hΔ
  · calc ENNReal.ofReal (max 0 (min (2 * a) (min (2 * b) (a + b - Δ))))
        = volume (Ioo (-a) a ∩ Ioo (Δ - b) (Δ + b)) := (volume_Ioo_inter_Ioo a b Δ hΔ).symm
      _ ≤ _ := measure_mono hlow

/-- The measure of the translate of a symmetric interval does not depend on the translation. -/
lemma volume_shift_eq {T : Set ℝ} {b : ℝ}
    (hTl : Ioo (-b) b ⊆ T) (hTu : T ⊆ Icc (-b) b) (Δ : ℝ) :
    volume ((fun u => u - Δ) ⁻¹' T) = ENNReal.ofReal (2 * b) := by
  have e1 : volume (Ioo (Δ - b) (Δ + b)) = ENNReal.ofReal (2 * b) := by
    rw [Real.volume_Ioo]; ring_nf
  have e2 : volume (Icc (Δ - b) (Δ + b)) = ENNReal.ofReal (2 * b) := by
    rw [Real.volume_Icc]; ring_nf
  exact le_antisymm (e2 ▸ measure_mono (shift_upper hTu Δ))
    (e1 ▸ measure_mono (shift_lower hTl Δ))

/-- **Separation monotonicity at the level of sets.**  For symmetric unimodal sets `S`, `T`,
the overlap `S ∩ (T + Δ)` has nonincreasing measure in `Δ ≥ 0`. -/
lemma volume_inter_shift_antitone {S T : Set ℝ} (hS : SymmDown S) (hT : SymmDown T)
    {Δ₁ Δ₂ : ℝ} (h0 : 0 ≤ Δ₁) (h12 : Δ₁ ≤ Δ₂) :
    volume (S ∩ (fun u => u - Δ₂) ⁻¹' T) ≤ volume (S ∩ (fun u => u - Δ₁) ⁻¹' T) := by
  have h0' : 0 ≤ Δ₂ := le_trans h0 h12
  rcases hS.trichotomy with hSe | hSu | ⟨a, ha, hSl, hSu⟩
  · simp [hSe]
  · rcases hT.trichotomy with hTe | hTu | ⟨b, hb, hTl, hTu⟩
    · simp [hTe]
    · simp [hSu, hTu]
    · rw [hSu, univ_inter, univ_inter, volume_shift_eq hTl hTu, volume_shift_eq hTl hTu]
  · rcases hT.trichotomy with hTe | hTu' | ⟨b, hb, hTl, hTu⟩
    · simp [hTe]
    · have : ∀ Δ : ℝ, S ∩ (fun u => u - Δ) ⁻¹' T = S := by
        intro Δ; rw [hTu']; simp
      rw [this, this]
    · rw [volume_inter_shift_eq hSl hSu hTl hTu h0',
        volume_inter_shift_eq hSl hSu hTl hTu h0]
      apply ENNReal.ofReal_le_ofReal
      apply max_le_max le_rfl
      apply min_le_min le_rfl
      apply min_le_min le_rfl
      linarith

end WeldCC
