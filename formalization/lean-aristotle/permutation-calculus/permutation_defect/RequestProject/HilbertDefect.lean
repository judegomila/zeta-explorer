import RequestProject.PermDefect

/-!
# Permutation defect bound for products of contractions on a Hilbert space

This file packages the results of `RequestProject.PermDefect` for bounded operators on a complex
Hilbert space `H`, following the statement of the source note:

* `PermDefect.Hilbert.norm_swap_sub_le` (Lemma 1, single adjacent swap);
* `PermDefect.Hilbert.norm_swap_sub_le_of_contraction` (Lemma 1 for contractions);
* `PermDefect.exists_swapChain_permWord` (Lemma 2, adjacent-swap sorting; stated for
  permutations in `RequestProject.PermDefect`);
* `PermDefect.Hilbert.norm_permProd_sub_one_le_sum` (Theorem 3, the target statement);
* `PermDefect.Hilbert.norm_permProd_sub_one_le_sum_weighted` (Theorem 4).

Here `PermDefect.permProd T π = T (π (m-1)) * ⋯ * T (π 0)` (composition of operators), so that
`permProd T 1 = T (m-1) * ⋯ * T 0`, and
`PermDefect.invSet π = {(i, j) | i < j ∧ π⁻¹ j < π⁻¹ i}` is the inversion set of `π`.
-/

namespace PermDefect

namespace Hilbert

variable {m : ℕ} {H : Type*} [NormedAddCommGroup H] [InnerProductSpace ℂ H]

lemma norm_one_le : ‖(1 : H →L[ℂ] H)‖ ≤ 1 := by
  rw [ContinuousLinearMap.one_def]
  exact ContinuousLinearMap.norm_id_le

/-- **Lemma 1** (single adjacent swap).  Swapping two adjacent factors inside a product of
operators changes it by at most `‖P‖ ‖[X, Y]‖ ‖Q‖`, where `P` and `Q` are the surrounding
factors. -/
theorem norm_swap_sub_le (P Q X Y : H →L[ℂ] H) :
    ‖P * (X * Y) * Q - P * (Y * X) * Q‖ ≤ ‖P‖ * ‖X * Y - Y * X‖ * ‖Q‖ := by
  have hfac : P * (X * Y) * Q - P * (Y * X) * Q = P * (X * Y - Y * X) * Q := by noncomm_ring
  rw [hfac]
  exact (norm_mul_le _ _).trans
    (mul_le_mul_of_nonneg_right (norm_mul_le _ _) (norm_nonneg _))

/-- **Lemma 1** for contractions: if the surrounding factors are contractions, an adjacent swap
changes the product by at most the norm of the commutator. -/
theorem norm_swap_sub_le_of_contraction (P Q X Y : H →L[ℂ] H) (hP : ‖P‖ ≤ 1) (hQ : ‖Q‖ ≤ 1) :
    ‖P * (X * Y) * Q - P * (Y * X) * Q‖ ≤ ‖X * Y - Y * X‖ := by
  refine (norm_swap_sub_le P Q X Y).trans ?_
  calc ‖P‖ * ‖X * Y - Y * X‖ * ‖Q‖ ≤ ‖X * Y - Y * X‖ * ‖Q‖ :=
        mul_le_mul_of_nonneg_right (mul_le_of_le_one_left (norm_nonneg _) hP) (norm_nonneg _)
    _ ≤ ‖X * Y - Y * X‖ * 1 := mul_le_mul_of_nonneg_left hQ (norm_nonneg _)
    _ = ‖X * Y - Y * X‖ := mul_one _

/-- **Theorem 3** (permutation defect bound, the paper's Lemma 3.1 eq. (6)).  If
`T 0, …, T (m-1)` are contractions on a complex Hilbert space, then the operator `T_π` obtained by
multiplying them in the order given by `π` differs in operator norm from `T_id = T (m-1) ⋯ T 0`
by at most the sum of the commutator norms over the inversion set of `π`.

(The completeness of `H` is assumed because the source speaks of a Hilbert space, but it is not
needed: the proof only uses that the operator norm is submultiplicative with `‖1‖ ≤ 1`.) -/
theorem norm_permProd_sub_one_le_sum [CompleteSpace H] (T : Fin m → (H →L[ℂ] H))
    (hT : ∀ k, ‖T k‖ ≤ 1) (π : Equiv.Perm (Fin m)) :
    ‖permProd T π - permProd T 1‖ ≤ ∑ p ∈ invSet π, ‖T p.1 * T p.2 - T p.2 * T p.1‖ :=
  PermDefect.norm_permProd_sub_one_le_sum norm_one_le T hT π

/-- **Theorem 4** (noncontractive version).  Without any contraction hypothesis, each summand is
multiplied by the norms of the remaining operators.

(As for Theorem 3, completeness of `H` is assumed only for faithfulness to the source.) -/
theorem norm_permProd_sub_one_le_sum_weighted [CompleteSpace H] (T : Fin m → (H →L[ℂ] H))
    (π : Equiv.Perm (Fin m)) :
    ‖permProd T π - permProd T 1‖ ≤
      ∑ p ∈ invSet π, ‖T p.1 * T p.2 - T p.2 * T p.1‖ * ∏ k ∈ Finset.univ \ {p.1, p.2}, ‖T k‖ :=
  PermDefect.norm_permProd_sub_one_le_sum_weighted norm_one_le T π

end Hilbert

/-! ### Sanity checks on the conventions -/

section Sanity

variable {A : Type*} [NormedRing A]

example (T : Fin 3 → A) : permProd T 1 = T 2 * T 1 * T 0 := by
  simp [permProd, permWord, List.finRange_succ]
  noncomm_ring

example (T : Fin 3 → A) (π : Equiv.Perm (Fin 3)) (hπ : π = Equiv.swap 0 1) :
    permProd T π = T 2 * T 0 * T 1 := by
  subst hπ
  simp [permProd, permWord, List.finRange_succ, Equiv.swap_apply_def]
  noncomm_ring

/-- The inversion set of the transposition of `0` and `1` in `Fin 3` is `{(0, 1)}`. -/
example : invSet (Equiv.swap (0 : Fin 3) 1) = {((0 : Fin 3), (1 : Fin 3))} := by decide

end Sanity

end PermDefect
