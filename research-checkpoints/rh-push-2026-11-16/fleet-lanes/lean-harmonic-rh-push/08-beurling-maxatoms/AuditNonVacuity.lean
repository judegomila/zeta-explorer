import Mathlib
open Finset BigOperators
open scoped ComplexConjugate
noncomputable section

def IsPosDefFn (φ : ℝ → ℂ) : Prop :=
  ∀ (n : ℕ) (x : Fin n → ℝ) (c : Fin n → ℂ),
    0 ≤ (∑ i, ∑ j, c i * conj (c j) * φ (x i - x j)).re ∧
      (∑ i, ∑ j, c i * conj (c j) * φ (x i - x j)).im = 0

open Classical in
def comb (t : ℝ) : ℝ := if (∃ k : ℤ, t = (k : ℝ) * 1) then 1 else 0

lemma comb_sub (a b : ℝ) : comb (a - b) = if Int.fract a = Int.fract b then 1 else 0 := by
  unfold comb
  have : (∃ k : ℤ, a - b = (k : ℝ) * 1) ↔ Int.fract a = Int.fract b := by
    rw [Int.fract_eq_fract]
    constructor
    · rintro ⟨k, hk⟩; exact ⟨k, by simpa using hk⟩
    · rintro ⟨k, hk⟩; exact ⟨k, by simpa using hk⟩
  simp only [this]

open Classical in
lemma key (n : ℕ) (x : Fin n → ℝ) (c : Fin n → ℂ) :
    (∑ i, ∑ j, c i * conj (c j) * ((comb (x i - x j) : ℝ) : ℂ))
      = ∑ a ∈ univ.image (fun i => Int.fract (x i)),
          (((Complex.normSq (∑ i, if Int.fract (x i) = a then c i else 0)) : ℝ) : ℂ) := by
  have h2 : ∀ a : ℝ, (((Complex.normSq (∑ i, if Int.fract (x i) = a then c i else 0)) : ℝ) : ℂ)
      = ∑ i, ∑ j, (if Int.fract (x i) = a then c i else 0) *
          conj (if Int.fract (x j) = a then c j else 0) := by
    intro a
    rw [← Complex.mul_conj, map_sum, Finset.sum_mul_sum]
  simp_rw [h2]
  symm
  rw [Finset.sum_comm]
  refine Finset.sum_congr rfl fun i _ => ?_
  rw [Finset.sum_comm]
  refine Finset.sum_congr rfl fun j _ => ?_
  symm
  rw [comb_sub]
  by_cases hij : Int.fract (x i) = Int.fract (x j)
  · rw [Finset.sum_eq_single (Int.fract (x i))]
    · simp [hij]
    · intro b _ hb
      have : ¬ Int.fract (x i) = b := fun h => hb h.symm
      simp [this]
    · intro h; exact absurd (Finset.mem_image_of_mem _ (Finset.mem_univ i)) h
  · simp only [hij, if_false]
    rw [Finset.sum_eq_zero]
    · simp
    · intro b _
      by_cases h1 : Int.fract (x i) = b
      · have : ¬ Int.fract (x j) = b := fun h => hij (h1.trans h.symm)
        simp [this]
      · simp [h1]

theorem comb_posDef : IsPosDefFn (fun t => (comb t : ℂ)) := by
  intro n x c
  rw [key]
  constructor
  · rw [Complex.re_sum]
    exact Finset.sum_nonneg fun a _ => by simpa using Complex.normSq_nonneg _
  · rw [Complex.im_sum]
    exact Finset.sum_eq_zero fun a _ => by simp

/-- all hypotheses of `beurling_core` hold simultaneously for the comb of ℤ -/
theorem hyps_consistent :
    IsPosDefFn (fun t => (comb t : ℂ)) ∧ 0 < comb 0 ∧ (∀ t, comb t = 0 ∨ comb 0 ≤ comb t) ∧
    (∀ R : ℝ, {t : ℝ | comb t ≠ 0 ∧ |t| ≤ R}.Finite) ∧ (∃ t, t ≠ 0 ∧ comb t ≠ 0) := by
  have h0 : comb 0 = 1 := by unfold comb; rw [if_pos ⟨0, by simp⟩]
  have hval : ∀ t, comb t = 0 ∨ comb t = 1 := by
    intro t; unfold comb; split_ifs <;> simp
  refine ⟨comb_posDef, by rw [h0]; exact one_pos, ?_, ?_, ⟨1, one_ne_zero, ?_⟩⟩
  · intro t; rcases hval t with h | h
    · exact Or.inl h
    · exact Or.inr (by rw [h0, h])
  · intro R
    apply ((Set.finite_Icc (-⌈R⌉) ⌈R⌉).image (fun k : ℤ => (k : ℝ))).subset
    rintro t ⟨ht, htR⟩
    have : ∃ k : ℤ, t = (k : ℝ) * 1 := by
      by_contra hne; exact ht (by unfold comb; rw [if_neg hne])
    obtain ⟨k, rfl⟩ := this
    refine ⟨k, ?_, by simp⟩
    rw [mul_one] at htR
    have := abs_le.mp htR
    constructor
    · have : (-(⌈R⌉ : ℝ)) ≤ k := by linarith [Int.le_ceil R]
      exact_mod_cast this
    · have : (k : ℝ) ≤ ⌈R⌉ := by linarith [Int.le_ceil R]
      exact_mod_cast this
  · unfold comb; rw [if_pos ⟨1, by simp⟩]; exact one_ne_zero
end
#print axioms hyps_consistent
