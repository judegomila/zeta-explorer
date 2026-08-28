import RequestProject.ListDefect

/-!
# Permutation defect bound for products of contractions

Let `T 0, …, T (m-1)` be bounded operators on a Hilbert space (or, more generally, elements of a
normed ring with `‖1‖ ≤ 1`).  For a permutation `π` of `Fin m` write

`permProd T π = T (π (m-1)) * ⋯ * T (π 0)`,  `permProd T 1 = T (m-1) * ⋯ * T 0`,

and let `invSet π = {(i, j) | i < j ∧ π⁻¹ j < π⁻¹ i}` be the inversion set of `π`.

The main results are `PermDefect.norm_permProd_sub_one_le_sum` (Theorem 3: for contractions the
defect is at most the sum of the commutator norms over the inversion set) and
`PermDefect.norm_permProd_sub_one_le_sum_weighted` (Theorem 4: in general each summand is
weighted by the norms of the remaining operators).
-/

namespace PermDefect

open List

variable {m : ℕ} {A : Type*} [NormedRing A]

/-- The index word of the product `T_π`: the list `[π (m-1), …, π 0]`, leftmost factor first. -/
def permWord (π : Equiv.Perm (Fin m)) : List (Fin m) :=
  (List.finRange m).map fun s => π s.rev

/-- The product of the `T k` in the order prescribed by `π`:
`permProd T π = T (π (m-1)) * ⋯ * T (π 0)`. -/
def permProd (T : Fin m → A) (π : Equiv.Perm (Fin m)) : A := ((permWord π).map T).prod

/-- The inversion set of `π`: pairs `(i, j)` with `i < j` whose relative order in `T_π`
differs from their order in `T_id = T (m-1) * ⋯ * T 0`. -/
def invSet (π : Equiv.Perm (Fin m)) : Finset (Fin m × Fin m) :=
  Finset.univ.filter fun p => p.1 < p.2 ∧ π.symm p.2 < π.symm p.1

lemma permWord_eq_map (π : Equiv.Perm (Fin m)) :
    permWord π = (List.finRange m).map ⇑(Fin.revPerm.trans π) := rfl

lemma permWord_nodup (π : Equiv.Perm (Fin m)) : (permWord π).Nodup :=
  (List.nodup_finRange m).map (Fin.revPerm.trans π).injective

lemma mem_permWord (π : Equiv.Perm (Fin m)) (k : Fin m) : k ∈ permWord π := by
  rw [permWord_eq_map, List.mem_map]
  exact ⟨(Fin.revPerm.trans π).symm k, List.mem_finRange _, by simp⟩

lemma permWord_perm_one (π : Equiv.Perm (Fin m)) : permWord π ~ permWord 1 := by
  rw [permWord_eq_map, permWord_eq_map]
  exact (Equiv.Perm.map_finRange_perm (Fin.revPerm.trans π)).trans
    (Equiv.Perm.map_finRange_perm (Fin.revPerm.trans (1 : Equiv.Perm (Fin m)))).symm

lemma permWord_one_pairwise :
    (permWord (1 : Equiv.Perm (Fin m))).Pairwise (fun a b => b ≤ a) := by
  rw [permWord, List.pairwise_map]
  refine (List.pairwise_lt_finRange m).imp ?_
  intro a b h
  simp [Fin.rev_le_rev.2 h.le]

/-- Two elements at increasing positions form a sublist of `finRange`. -/
lemma pair_sublist_finRange {x y : Fin m} (h : x < y) : [x, y] <+ List.finRange m := by
  have hy : (y : ℕ) < (List.finRange m).length := by simp
  simpa using pair_sublist_of_lt (l := List.finRange m) (s := (x : ℕ)) (t := (y : ℕ)) h hy

lemma pair_sublist_map_finRange_iff (σ : Equiv.Perm (Fin m)) (a b : Fin m) :
    [a, b] <+ (List.finRange m).map ⇑σ ↔ σ.symm a < σ.symm b := by
  constructor
  · intro h
    have hP : List.Pairwise (fun x y => σ.symm x < σ.symm y) ((List.finRange m).map ⇑σ) := by
      rw [List.pairwise_map]
      simpa using List.pairwise_lt_finRange m
    simpa using List.Pairwise.sublist h hP
  · intro h
    have h2 : ([a, b] : List (Fin m)) = [σ.symm a, σ.symm b].map ⇑σ := by simp
    rw [h2]
    exact (pair_sublist_finRange h).map _

lemma mem_invs_permWord (π : Equiv.Perm (Fin m)) (p : Fin m × Fin m) :
    p ∈ invs (permWord π) ↔ p ∈ invSet π := by
  rw [mem_invs, permWord_eq_map, invSet, Finset.mem_filter]
  rw [pair_sublist_map_finRange_iff]
  simp only [Equiv.symm_trans_apply, Fin.revPerm_symm, Fin.revPerm_apply, Fin.rev_lt_rev,
    Finset.mem_univ, true_and]

lemma sum_invs_permWord (π : Equiv.Perm (Fin m)) (f : Fin m × Fin m → ℝ) :
    ((invs (permWord π)).map f).sum = ∑ p ∈ invSet π, f p := by
  rw [← List.sum_toFinset f (invs_nodup (permWord_nodup π))]
  congr 1
  ext p
  rw [List.mem_toFinset]
  exact mem_invs_permWord π p

lemma defectTerm_permWord (T : Fin m → A) (π : Equiv.Perm (Fin m)) (p : Fin m × Fin m) :
    defectTerm T (permWord π) p =
      ‖T p.1 * T p.2 - T p.2 * T p.1‖ * ∏ k ∈ Finset.univ \ {p.1, p.2}, ‖T k‖ := by
  have hnd : (((permWord π).erase p.1).erase p.2).Nodup :=
    ((permWord_nodup π).erase _).erase _
  have hset : (((permWord π).erase p.1).erase p.2).toFinset = Finset.univ \ {p.1, p.2} := by
    ext k
    simp only [List.mem_toFinset, Finset.mem_sdiff, Finset.mem_univ, Finset.mem_insert,
      Finset.mem_singleton, true_and]
    rw [List.Nodup.mem_erase_iff ((permWord_nodup π).erase _),
      List.Nodup.mem_erase_iff (permWord_nodup π)]
    constructor
    · rintro ⟨h2, h1, -⟩
      exact fun hc => hc.elim h1 h2
    · intro h
      exact ⟨fun hc => h (Or.inr hc), fun hc => h (Or.inl hc), mem_permWord π k⟩
  rw [defectTerm, ← List.prod_toFinset _ hnd, hset]

/-- **Lemma 2** (adjacent-swap sorting) for permutations: the word of `T_π` can be sorted into the
word of `T_id` by a sequence of transpositions of adjacent out-of-order factors, the transposed
index pairs ranging exactly once over the inversion set `invSet π`. -/
theorem exists_swapChain_permWord (π : Equiv.Perm (Fin m)) :
    ∃ S : List (Fin m × Fin m), SwapChain (permWord π) S (permWord 1) ∧ S.Nodup ∧
      S.toFinset = invSet π ∧ S.length = (invSet π).card := by
  obtain ⟨S, hchain, hS⟩ := exists_swapChain (invs (permWord π)).length (permWord π)
    (permWord 1) rfl (permWord_perm_one π) permWord_one_pairwise
  have hnd : S.Nodup := hS.nodup_iff.2 (invs_nodup (permWord_nodup π))
  have hset : S.toFinset = invSet π := by
    ext p
    rw [List.mem_toFinset, hS.mem_iff]
    exact mem_invs_permWord π p
  refine ⟨S, hchain, hnd, hset, ?_⟩
  rw [← hset, List.toFinset_card_of_nodup hnd]

/-- **Theorem 4** (noncontractive permutation defect bound). -/
theorem norm_permProd_sub_one_le_sum_weighted (hone : ‖(1 : A)‖ ≤ 1) (T : Fin m → A)
    (π : Equiv.Perm (Fin m)) :
    ‖permProd T π - permProd T 1‖ ≤
      ∑ p ∈ invSet π, ‖T p.1 * T p.2 - T p.2 * T p.1‖ * ∏ k ∈ Finset.univ \ {p.1, p.2}, ‖T k‖ := by
  have hmain := norm_prod_sub_prod_le hone T (invs (permWord π)).length (permWord π)
    (permWord 1) rfl (permWord_nodup π) (permWord_perm_one π) permWord_one_pairwise
  refine hmain.trans ?_
  rw [sum_invs_permWord π (defectTerm T (permWord π))]
  exact Finset.sum_le_sum fun p _ => le_of_eq (defectTerm_permWord T π p)

/-- **Theorem 3** (permutation defect bound for contractions). -/
theorem norm_permProd_sub_one_le_sum (hone : ‖(1 : A)‖ ≤ 1) (T : Fin m → A)
    (hT : ∀ k, ‖T k‖ ≤ 1) (π : Equiv.Perm (Fin m)) :
    ‖permProd T π - permProd T 1‖ ≤ ∑ p ∈ invSet π, ‖T p.1 * T p.2 - T p.2 * T p.1‖ := by
  refine (norm_permProd_sub_one_le_sum_weighted hone T π).trans ?_
  refine Finset.sum_le_sum fun p _ => ?_
  calc ‖T p.1 * T p.2 - T p.2 * T p.1‖ * ∏ k ∈ Finset.univ \ {p.1, p.2}, ‖T k‖
      ≤ ‖T p.1 * T p.2 - T p.2 * T p.1‖ * 1 := by
        refine mul_le_mul_of_nonneg_left ?_ (norm_nonneg _)
        exact Finset.prod_le_one (fun i _ => norm_nonneg _) (fun i _ => hT i)
    _ = ‖T p.1 * T p.2 - T p.2 * T p.1‖ := mul_one _

end PermDefect
