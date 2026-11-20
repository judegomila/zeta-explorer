import Mathlib

/-!
# Core of the Beurling rigidity theorem (Theorem A, steps A1–A4) — proved

Statements identical to `rh-push-beurling-maxatoms/RequestProject/Main.lean`.
-/

open Finset BigOperators
open scoped ComplexConjugate

noncomputable section

/-- Positive-definite function on `ℝ` (Bochner sense): all finite matrices
`[φ (x i - x j)]` are Hermitian positive semidefinite. -/
def IsPosDefFn (φ : ℝ → ℂ) : Prop :=
  ∀ (n : ℕ) (x : Fin n → ℝ) (c : Fin n → ℂ),
    0 ≤ (∑ i, ∑ j, c i * conj (c j) * φ (x i - x j)).re ∧
      (∑ i, ∑ j, c i * conj (c j) * φ (x i - x j)).im = 0

/-- Two-point form. -/
lemma posDef_two (φ : ℝ → ℂ) (h : IsPosDefFn φ) (t : ℝ) (a b : ℂ) :
    0 ≤ (a * conj a * φ 0 + a * conj b * φ t + (b * conj a * φ (-t) + b * conj b * φ 0)).re ∧
    (a * conj a * φ 0 + a * conj b * φ t + (b * conj a * φ (-t) + b * conj b * φ 0)).im = 0 := by
  have := h 2 ![t, 0] ![a, b]
  simpa [Fin.sum_univ_two] using this

lemma posDef_zero (φ : ℝ → ℂ) (h : IsPosDefFn φ) : 0 ≤ (φ 0).re ∧ (φ 0).im = 0 := by
  have := h 1 ![0] ![1]
  simpa using this

lemma posDef_neg (φ : ℝ → ℂ) (h : IsPosDefFn φ) (t : ℝ) : φ (-t) = conj (φ t) := by
  have h0 := (posDef_zero φ h).2
  have h1 := (posDef_two φ h t 1 1).2
  have h2 := (posDef_two φ h t 1 Complex.I).2
  simp at h1 h2
  apply Complex.ext
  · simp; linarith
  · simp; linarith

/-- (A1) -/
theorem posDef_norm_le (φ : ℝ → ℂ) (h : IsPosDefFn φ) (t : ℝ) :
    (φ 0).im = 0 ∧ ‖φ t‖ ≤ (φ 0).re := by
  obtain ⟨h0re, h0im⟩ := posDef_zero φ h
  refine ⟨h0im, ?_⟩
  have hneg := posDef_neg φ h t
  have key := (posDef_two φ h t (-conj (φ t)) (‖φ t‖ : ℂ)).1
  rw [hneg] at key
  have hr : ‖φ t‖ ^ 2 = (φ t).re ^ 2 + (φ t).im ^ 2 := by
    rw [Complex.sq_norm, Complex.normSq_apply]; ring
  simp at key
  have hnn : 0 ≤ ‖φ t‖ := norm_nonneg _
  set r := ‖φ t‖ with hrdef
  set u := (φ t).re
  set v := (φ t).im
  have key' : 0 ≤ 2 * r ^ 2 * ((φ 0).re - r) := by
    have : 2 * r ^ 2 * ((φ 0).re - r) = (u^2+v^2) * (φ 0).re + r^2 * (φ 0).re - 2 * r * (u^2+v^2) := by
      rw [← hr]; ring
    rw [this]; nlinarith [key, h0im]
  by_contra hlt
  push_neg at hlt
  have hrpos : 0 < r := lt_of_le_of_lt h0re hlt
  have : 2 * r ^ 2 * ((φ 0).re - r) < 0 := by
    apply mul_neg_of_pos_of_neg (by positivity) (by linarith)
  linarith

lemma posDef_three_real (φ : ℝ → ℂ) (h : IsPosDefFn φ) (s t : ℝ) (hs : φ s = φ 0) (ht : φ t = φ 0) :
    (φ 0).re ≤ (φ (s + t)).re := by
  obtain ⟨h0re, h0im⟩ := posDef_zero φ h
  have hns : φ (-s) = φ 0 := by
    rw [posDef_neg φ h s, hs]; apply Complex.ext <;> simp [h0im]
  have hnt : φ (-t) = φ 0 := by
    rw [posDef_neg φ h t, ht]; apply Complex.ext <;> simp [h0im]
  have hnst : φ (-t + -s) = conj (φ (s + t)) := by
    rw [← posDef_neg φ h (s + t)]; congr 1; ring
  have key := (h 3 ![s + t, t, 0] ![1, -2, 1]).1
  simp [Fin.sum_univ_three] at key
  rw [hs, ht, hns, hnt, hnst] at key
  simp at key
  linarith

lemma posDef_add (φ : ℝ → ℂ) (h : IsPosDefFn φ) (s t : ℝ) (hs : φ s = φ 0) (ht : φ t = φ 0) :
    φ (s + t) = φ 0 := by
  obtain ⟨h0re, h0im⟩ := posDef_zero φ h
  have h1 := posDef_three_real φ h s t hs ht
  have h2 := (posDef_norm_le φ h (s + t)).2
  have hr : ‖φ (s + t)‖ ^ 2 = (φ (s + t)).re ^ 2 + (φ (s + t)).im ^ 2 := by
    rw [Complex.sq_norm, Complex.normSq_apply]; ring
  have hnn : 0 ≤ ‖φ (s + t)‖ := norm_nonneg _
  have hsq : ‖φ (s + t)‖ ^ 2 ≤ (φ 0).re ^ 2 := by nlinarith
  have hsq2 : (φ 0).re ^ 2 ≤ (φ (s + t)).re ^ 2 := by nlinarith
  have him : (φ (s + t)).im = 0 := by nlinarith [sq_nonneg (φ (s + t)).im]
  have hre : (φ (s + t)).re ≤ (φ 0).re := by
    have : (φ (s + t)).re ≤ ‖φ (s + t)‖ := Complex.re_le_norm _
    linarith
  apply Complex.ext
  · linarith
  · rw [him, h0im]

/-- The subgroup of maximal atoms. -/
def maxSubgroup (φ : ℝ → ℂ) (h : IsPosDefFn φ) : AddSubgroup ℝ where
  carrier := {t | φ t = φ 0}
  zero_mem' := rfl
  add_mem' := fun {a b} ha hb => posDef_add φ h a b ha hb
  neg_mem' := fun {a} ha => by
    have h0im := (posDef_zero φ h).2
    show φ (-a) = φ 0
    rw [posDef_neg φ h a, (ha : φ a = φ 0)]; apply Complex.ext <;> simp [h0im]

/-- (A2–A3) The points where `φ` attains `φ 0` form a subgroup. -/
theorem posDef_max_set_subgroup (φ : ℝ → ℂ) (h : IsPosDefFn φ) :
    ∃ S : AddSubgroup ℝ, (S : Set ℝ) = {t | φ t = φ 0} :=
  ⟨maxSubgroup φ h, rfl⟩

open Classical in
/-- (A4) Rigidity: a real positive-definite mass function with every nonzero mass at least
the mass at `0`, locally finite support, and at least one atom away from `0`, is a constant
multiple of the indicator of a lattice `cℤ`. -/
theorem beurling_core (m : ℝ → ℝ) (h : IsPosDefFn (fun t => (m t : ℂ)))
    (hκ : 0 < m 0) (hmass : ∀ t, m t = 0 ∨ m 0 ≤ m t)
    (hloc : ∀ R : ℝ, {t : ℝ | m t ≠ 0 ∧ |t| ≤ R}.Finite)
    (hnontriv : ∃ t, t ≠ 0 ∧ m t ≠ 0) :
    ∃ c : ℝ, 0 < c ∧ ∀ t, m t = if (∃ k : ℤ, t = (k : ℝ) * c) then m 0 else 0 := by
  set S := maxSubgroup (fun t => (m t : ℂ)) h with hS
  have memS : ∀ t, t ∈ S ↔ m t = m 0 := by
    intro t
    show ((m t : ℂ) = (m 0 : ℂ)) ↔ _
    exact_mod_cast Iff.rfl
  -- support = S
  have supp : ∀ t, m t ≠ 0 → m t = m 0 := by
    intro t ht
    have h1 : m 0 ≤ m t := (hmass t).resolve_left ht
    have h2 := (posDef_norm_le _ h t).2
    simp at h2
    have : m t ≤ |m t| := le_abs_self _
    linarith
  -- isolate zero
  have hfin : ({t : ℝ | m t ≠ 0 ∧ |t| ≤ 1} \ {0}).Finite := (hloc 1).subset Set.diff_subset
  have hopen : IsOpen (({t : ℝ | m t ≠ 0 ∧ |t| ≤ 1} \ {0})ᶜ) := hfin.isClosed.isOpen_compl
  obtain ⟨ε, hε, hball⟩ := Metric.isOpen_iff.mp hopen 0 (by simp)
  have hdisj : Disjoint (S : Set ℝ) (Set.Ioo 0 (min ε 1)) := by
    rw [Set.disjoint_left]
    intro x hxS hx
    have hx0 : 0 < x := hx.1
    have hxε : x < ε := lt_of_lt_of_le hx.2 (min_le_left _ _)
    have hx1 : x < 1 := lt_of_lt_of_le hx.2 (min_le_right _ _)
    have : x ∈ Metric.ball (0 : ℝ) ε := by
      simp [Metric.mem_ball, abs_of_pos hx0, hxε]
    have hc := hball this
    apply hc
    refine ⟨⟨?_, ?_⟩, ?_⟩
    · rw [(memS x).mp hxS]; exact hκ.ne'
    · rw [abs_of_pos hx0]; exact hx1.le
    · exact hx0.ne'
  obtain ⟨b, hb⟩ := AddSubgroup.cyclic_of_isolated_zero (lt_min hε one_pos) hdisj
  have hb0 : b ≠ 0 := by
    rintro rfl
    obtain ⟨t, ht0, htm⟩ := hnontriv
    have : t ∈ S := (memS t).mpr (supp t htm)
    rw [hb, AddSubgroup.mem_closure_singleton] at this
    obtain ⟨n, hn⟩ := this
    exact ht0 (by rw [← hn]; simp)
  have memb : ∀ t, t ∈ S ↔ ∃ k : ℤ, t = (k : ℝ) * |b| := by
    intro t
    rw [hb, AddSubgroup.mem_closure_singleton]
    constructor
    · rintro ⟨n, rfl⟩
      rcases le_or_gt 0 b with hbp | hbn
      · exact ⟨n, by rw [abs_of_nonneg hbp]; simp⟩
      · exact ⟨-n, by rw [abs_of_neg hbn]; simp⟩
    · rintro ⟨k, rfl⟩
      rcases le_or_gt 0 b with hbp | hbn
      · exact ⟨k, by rw [abs_of_nonneg hbp]; simp⟩
      · exact ⟨-k, by rw [abs_of_neg hbn]; simp⟩
  refine ⟨|b|, abs_pos.mpr hb0, ?_⟩
  intro t
  split_ifs with hk
  · exact (memS t).mp ((memb t).mpr hk)
  · by_contra hne
    exact hk ((memb t).mp ((memS t).mpr (supp t hne)))

end

#print axioms posDef_norm_le
#print axioms posDef_max_set_subgroup
#print axioms beurling_core
