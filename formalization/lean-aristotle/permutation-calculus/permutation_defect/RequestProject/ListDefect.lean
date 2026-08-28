import RequestProject.Inversions

/-!
# Bubble-sort defect bound for products in a normed ring

Given a family `T : ι → A` of elements of a normed ring `A` (with `‖1‖ ≤ 1`) and a duplicate-free
list `l` of indices, the ordered product `(l.map T).prod` differs from the product taken in
decreasing order of the indices by at most the sum, over the inversions of `l`, of the norm of
the corresponding commutator times the norms of the remaining factors.
-/

namespace PermDefect

open List

variable {ι : Type*} [LinearOrder ι] {A : Type*} [NormedRing A]

omit [LinearOrder ι] in
/-- The norm of an ordered product is at most the product of the norms. -/
lemma norm_listProd_le (hone : ‖(1 : A)‖ ≤ 1) (T : ι → A) (l : List ι) :
    ‖(l.map T).prod‖ ≤ (l.map (fun k => ‖T k‖)).prod := by
  induction l with
  | nil => simpa using hone
  | cons a t ih =>
    simp only [List.map_cons, List.prod_cons]
    calc ‖T a * (t.map T).prod‖ ≤ ‖T a‖ * ‖(t.map T).prod‖ := norm_mul_le _ _
      _ ≤ ‖T a‖ * (t.map (fun k => ‖T k‖)).prod :=
          mul_le_mul_of_nonneg_left ih (norm_nonneg _)

/-- The contribution of a single inversion `p = (i, j)` of the list `l`: the norm of the
commutator `[T i, T j]` times the product of the norms of all the other factors of `l`. -/
noncomputable def defectTerm (T : ι → A) (l : List ι) (p : ι × ι) : ℝ :=
  ‖T p.1 * T p.2 - T p.2 * T p.1‖ * (((l.erase p.1).erase p.2).map (fun k => ‖T k‖)).prod

lemma defectTerm_congr {T : ι → A} {l l' : List ι} (h : l ~ l') (p : ι × ι) :
    defectTerm T l p = defectTerm T l' p := by
  unfold defectTerm
  congr 1
  exact (((h.erase p.1).erase p.2).map _).prod_eq

omit [LinearOrder ι] in
/-- **Lemma 1** (single adjacent swap), list form: swapping two adjacent factors of an ordered
product changes it by at most the norm of the commutator times the norms of the other factors. -/
lemma norm_swap_sub_le (hone : ‖(1 : A)‖ ≤ 1) (T : ι → A) (P Q : List ι) (i j : ι) :
    ‖((P ++ i :: j :: Q).map T).prod - ((P ++ j :: i :: Q).map T).prod‖ ≤
      ‖T i * T j - T j * T i‖ * ((P ++ Q).map (fun k => ‖T k‖)).prod := by
  have key : ((P ++ i :: j :: Q).map T).prod - ((P ++ j :: i :: Q).map T).prod =
      (P.map T).prod * ((T i * T j - T j * T i) * (Q.map T).prod) := by
    simp only [List.map_append, List.map_cons, List.prod_append, List.prod_cons]
    noncomm_ring
  rw [key, List.map_append, List.prod_append]
  calc ‖(P.map T).prod * ((T i * T j - T j * T i) * (Q.map T).prod)‖
      ≤ ‖(P.map T).prod‖ * (‖T i * T j - T j * T i‖ * ‖(Q.map T).prod‖) :=
        le_trans (norm_mul_le _ _)
          (mul_le_mul_of_nonneg_left (norm_mul_le _ _) (norm_nonneg _))
    _ ≤ (P.map (fun k => ‖T k‖)).prod * (‖T i * T j - T j * T i‖ *
          (Q.map (fun k => ‖T k‖)).prod) :=
        mul_le_mul (norm_listProd_le hone T P)
          (mul_le_mul_of_nonneg_left (norm_listProd_le hone T Q) (norm_nonneg _))
          (mul_nonneg (norm_nonneg _) (norm_nonneg _))
          (le_trans (norm_nonneg _) (norm_listProd_le hone T P))
    _ = ‖T i * T j - T j * T i‖ *
          ((P.map (fun k => ‖T k‖)).prod * (Q.map (fun k => ‖T k‖)).prod) := by ring

/-- **Theorem 4** (noncontractive bound), list form.  For a duplicate-free list `l` of indices
and the corresponding decreasingly sorted list `l₀`, the ordered products differ by at most the
sum over the inversions of `l` of the commutator norms weighted by the norms of the
remaining factors. -/
theorem norm_prod_sub_prod_le (hone : ‖(1 : A)‖ ≤ 1) (T : ι → A) :
    ∀ (n : ℕ) (l l₀ : List ι), (invs l).length = n → l.Nodup → l ~ l₀ →
      l₀.Pairwise (fun a b => b ≤ a) →
      ‖(l.map T).prod - (l₀.map T).prod‖ ≤ ((invs l).map (defectTerm T l)).sum := by
  intro n
  induction n with
  | zero =>
    intro l l₀ hn _ hperm hsorted
    have hnil : invs l = [] := List.length_eq_zero_iff.1 hn
    have hl : l.Pairwise (fun a b => b ≤ a) := invs_eq_nil_iff.1 hnil
    have hll : l = l₀ :=
      List.Perm.eq_of_pairwise (fun _ _ _ _ hab hba => le_antisymm hba hab) hl hsorted hperm
    subst hll
    rw [hnil]
    simp
  | succ k ih =>
    intro l l₀ hn hnodup hperm hsorted
    have hne : invs l ≠ [] := by
      intro hc; rw [hc] at hn; simp at hn
    have hnp : ¬ l.Pairwise (fun a b => b ≤ a) := fun hc => hne (invs_eq_nil_iff.2 hc)
    obtain ⟨P, i, j, Q, rfl, hij⟩ := exists_adjacent_lt_of_not_pairwise hnp
    set l' : List ι := P ++ j :: i :: Q with hl'
    have hswap : invs (P ++ i :: j :: Q) ~ (i, j) :: invs l' := invs_swap P Q hij
    have hpp : (P ++ i :: j :: Q) ~ l' := List.Perm.append_left _ (List.Perm.swap _ _ _)
    have hnodup' : l'.Nodup := hpp.nodup_iff.1 hnodup
    have hlen : (invs l').length = k := by
      have := hswap.length_eq
      simp only [List.length_cons] at this
      omega
    have hIH := ih l' l₀ hlen hnodup' (hpp.symm.trans hperm) hsorted
    -- the list obtained by deleting the two swapped factors is `P ++ Q`
    have hd := (List.nodup_append.1 hnodup).2.2
    have hiP : i ∉ P := fun hc => hd i hc i (by simp) rfl
    have hjP : j ∉ P := fun hc => hd j hc j (by simp) rfl
    have herase : (((P ++ i :: j :: Q).erase i).erase j) = P ++ Q := by
      rw [List.erase_append_right _ hiP, List.erase_cons_head,
        List.erase_append_right _ hjP, List.erase_cons_head]
    have hkey : ‖((P ++ i :: j :: Q).map T).prod - (l'.map T).prod‖ ≤
        defectTerm T (P ++ i :: j :: Q) (i, j) := by
      rw [defectTerm, herase]
      exact norm_swap_sub_le hone T P Q i j
    have hsum : ((invs (P ++ i :: j :: Q)).map (defectTerm T (P ++ i :: j :: Q))).sum =
        defectTerm T (P ++ i :: j :: Q) (i, j) + ((invs l').map (defectTerm T l')).sum := by
      rw [(hswap.map (defectTerm T (P ++ i :: j :: Q))).sum_eq]
      simp only [List.map_cons, List.sum_cons]
      congr 1
      exact congrArg List.sum (List.map_congr_left fun p _ => defectTerm_congr hpp p)
    have htri : ‖((P ++ i :: j :: Q).map T).prod - (l₀.map T).prod‖ ≤
        ‖((P ++ i :: j :: Q).map T).prod - (l'.map T).prod‖ +
          ‖(l'.map T).prod - (l₀.map T).prod‖ := by
      have := norm_add_le (((P ++ i :: j :: Q).map T).prod - (l'.map T).prod)
        ((l'.map T).prod - (l₀.map T).prod)
      rwa [sub_add_sub_cancel] at this
    rw [hsum]
    linarith

/-!
### Lemma 2: bubble sorting by adjacent transpositions
-/

/-- `SwapChain l S l'` says that `l'` is obtained from `l` by successively transposing the
adjacent out-of-order pairs listed by `S`, in order. -/
inductive SwapChain : List ι → List (ι × ι) → List ι → Prop
  | refl (l : List ι) : SwapChain l [] l
  | step (P Q : List ι) (i j : ι) (S : List (ι × ι)) (l' : List ι) (hij : i < j) :
      SwapChain (P ++ j :: i :: Q) S l' → SwapChain (P ++ i :: j :: Q) ((i, j) :: S) l'

/-- **Lemma 2** (adjacent-swap sorting), list form: any list can be sorted decreasingly by a
sequence of transpositions of adjacent out-of-order pairs, the transposed pairs ranging exactly
once over the inversions of the list. -/
theorem exists_swapChain :
    ∀ (n : ℕ) (l l₀ : List ι), (invs l).length = n → l ~ l₀ →
      l₀.Pairwise (fun a b => b ≤ a) → ∃ S, SwapChain l S l₀ ∧ S ~ invs l := by
  intro n
  induction n with
  | zero =>
    intro l l₀ hn hperm hsorted
    have hnil : invs l = [] := List.length_eq_zero_iff.1 hn
    have hl : l.Pairwise (fun a b => b ≤ a) := invs_eq_nil_iff.1 hnil
    have hll : l = l₀ :=
      List.Perm.eq_of_pairwise (fun _ _ _ _ hab hba => le_antisymm hba hab) hl hsorted hperm
    subst hll
    exact ⟨[], SwapChain.refl l, by rw [hnil]⟩
  | succ k ih =>
    intro l l₀ hn hperm hsorted
    have hne : invs l ≠ [] := by
      intro hc; rw [hc] at hn; simp at hn
    have hnp : ¬ l.Pairwise (fun a b => b ≤ a) := fun hc => hne (invs_eq_nil_iff.2 hc)
    obtain ⟨P, i, j, Q, rfl, hij⟩ := exists_adjacent_lt_of_not_pairwise hnp
    have hswap : invs (P ++ i :: j :: Q) ~ (i, j) :: invs (P ++ j :: i :: Q) := invs_swap P Q hij
    have hpp : (P ++ i :: j :: Q) ~ (P ++ j :: i :: Q) :=
      List.Perm.append_left _ (List.Perm.swap _ _ _)
    have hlen : (invs (P ++ j :: i :: Q)).length = k := by
      have := hswap.length_eq
      simp only [List.length_cons] at this
      omega
    obtain ⟨S, hchain, hS⟩ := ih _ l₀ hlen (hpp.symm.trans hperm) hsorted
    exact ⟨(i, j) :: S, SwapChain.step P Q i j S l₀ hij hchain, (hS.cons _).trans hswap.symm⟩

end PermDefect
