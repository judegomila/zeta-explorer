import Mathlib

/-!
# Inversion pairs of a list

For a list `l` over a linear order, `PermDefect.invs l` is the list of pairs `(a, b)` with
`a < b` such that `a` occurs before `b` in `l`.  These are exactly the inversions of `l`
relative to the *descending* order, i.e. the pairs that a bubble sort of `l` into decreasing
order has to swap.

The main results are

* `PermDefect.mem_invs`: membership characterisation via `[a, b] <+ l`;
* `PermDefect.invs_swap`: swapping an adjacent out-of-order pair removes exactly one inversion;
* `PermDefect.invs_eq_nil_iff`: `invs l = []` iff `l` is sorted decreasingly.
-/

namespace PermDefect

open List

variable {ι : Type*} [LinearOrder ι]

/-- `invs l` is the list of inversion pairs of `l` relative to the descending order: the pairs
`(a, b)` with `a < b` such that `a` occurs before `b` in `l`. -/
def invs : List ι → List (ι × ι)
  | [] => []
  | a :: t => (t.filter (fun b => a < b)).map (fun b => (a, b)) ++ invs t

@[simp] lemma invs_nil : invs ([] : List ι) = [] := rfl

lemma invs_cons (a : ι) (t : List ι) :
    invs (a :: t) = (t.filter (fun b => a < b)).map (fun b => (a, b)) ++ invs t := rfl

/-- Two elements at increasing positions of a list form a two-element sublist. -/
lemma pair_sublist_of_lt {α : Type*} {l : List α} {s t : ℕ} (hst : s < t) (ht : t < l.length) :
    [l[s]'(by omega), l[t]] <+ l := by
  induction l generalizing s t with
  | nil => simp at ht
  | cons c l' ih =>
    match s, t with
    | 0, (t' + 1) =>
      simp only [List.getElem_cons_zero, List.getElem_cons_succ]
      exact List.cons_sublist_cons.2 (List.singleton_sublist.2 (List.getElem_mem _))
    | (s' + 1), (t' + 1) =>
      simp only [List.getElem_cons_succ]
      exact List.Sublist.cons c (ih (s := s') (t := t') (by omega) (by simpa using ht))

lemma mem_invs {p : ι × ι} {l : List ι} : p ∈ invs l ↔ p.1 < p.2 ∧ [p.1, p.2] <+ l := by
  induction l with
  | nil => simp [invs]
  | cons a t ih =>
    rw [invs_cons, List.mem_append, ih, List.sublist_cons_iff]
    constructor
    · rintro (hmem | ⟨h1, h2⟩)
      · simp only [List.mem_map, List.mem_filter, decide_eq_true_eq] at hmem
        obtain ⟨b, ⟨hb, hab⟩, rfl⟩ := hmem
        exact ⟨hab, Or.inr ⟨[b], rfl, List.singleton_sublist.2 hb⟩⟩
      · exact ⟨h1, Or.inl h2⟩
    · rintro ⟨h1, h2 | ⟨r, hr, hrt⟩⟩
      · exact Or.inr ⟨h1, h2⟩
      · left
        obtain ⟨rfl, hr2⟩ : p.1 = a ∧ [p.2] = r := by
          cases r with
          | nil => simp at hr
          | cons c r' => simp only [List.cons.injEq] at hr; exact ⟨hr.1, by simp [hr.2]⟩
        subst hr2
        simp only [List.mem_map, List.mem_filter, decide_eq_true_eq]
        exact ⟨p.2, ⟨List.singleton_sublist.1 hrt, h1⟩, rfl⟩

lemma invs_eq_nil_iff {l : List ι} : invs l = [] ↔ l.Pairwise (fun a b => b ≤ a) := by
  induction l with
  | nil => simp
  | cons a t ih =>
    rw [invs_cons, List.append_eq_nil_iff, List.pairwise_cons, ih, List.map_eq_nil_iff,
      List.filter_eq_nil_iff]
    simp only [decide_eq_true_eq, not_lt]

/-- Swapping an adjacent out-of-order pair `i < j` removes exactly the inversion `(i, j)`. -/
lemma invs_swap (P Q : List ι) {i j : ι} (h : i < j) :
    invs (P ++ i :: j :: Q) ~ (i, j) :: invs (P ++ j :: i :: Q) := by
  induction P with
  | nil =>
    have hfil : (j :: Q).filter (fun b => i < b) = j :: Q.filter (fun b => i < b) := by
      simp [h]
    have hfil2 : (i :: Q).filter (fun b => j < b) = Q.filter (fun b => j < b) := by
      simp [not_lt.2 h.le]
    simp only [List.nil_append, invs_cons, hfil, hfil2, List.map_cons, List.cons_append]
    refine List.Perm.cons _ ?_
    -- `A ++ (B ++ C) ~ B ++ (A ++ C)` with
    -- `A = map (i, ·) (filter (i < ·) Q)`, `B = map (j, ·) (filter (j < ·) Q)`, `C = invs Q`
    calc ((Q.filter (fun b => i < b)).map (fun b => (i, b))) ++
            ((Q.filter (fun b => j < b)).map (fun b => (j, b)) ++ invs Q)
        ~ ((Q.filter (fun b => j < b)).map (fun b => (j, b)) ++ invs Q) ++
            ((Q.filter (fun b => i < b)).map (fun b => (i, b))) := List.perm_append_comm
      _ ~ (Q.filter (fun b => j < b)).map (fun b => (j, b)) ++
            (invs Q ++ (Q.filter (fun b => i < b)).map (fun b => (i, b))) := by
              rw [List.append_assoc]
      _ ~ (Q.filter (fun b => j < b)).map (fun b => (j, b)) ++
            ((Q.filter (fun b => i < b)).map (fun b => (i, b)) ++ invs Q) :=
              List.Perm.append_left _ List.perm_append_comm
  | cons a P' ih =>
    have hperm : P' ++ i :: j :: Q ~ P' ++ j :: i :: Q :=
      List.Perm.append_left _ (List.Perm.swap _ _ _)
    simp only [List.cons_append, invs_cons]
    calc ((P' ++ i :: j :: Q).filter (fun b => a < b)).map (fun b => (a, b)) ++
            invs (P' ++ i :: j :: Q)
        ~ ((P' ++ j :: i :: Q).filter (fun b => a < b)).map (fun b => (a, b)) ++
            ((i, j) :: invs (P' ++ j :: i :: Q)) :=
          List.Perm.append ((hperm.filter _).map _) ih
      _ ~ (i, j) :: (((P' ++ j :: i :: Q).filter (fun b => a < b)).map (fun b => (a, b)) ++
            invs (P' ++ j :: i :: Q)) := List.perm_middle

lemma fst_mem_of_mem_invs {p : ι × ι} {l : List ι} (h : p ∈ invs l) : p.1 ∈ l :=
  (mem_invs.1 h).2.subset (by simp)

lemma invs_nodup {l : List ι} (h : l.Nodup) : (invs l).Nodup := by
  induction l with
  | nil => simp
  | cons a t ih =>
    obtain ⟨hat, ht⟩ := List.nodup_cons.1 h
    rw [invs_cons, List.nodup_append]
    refine ⟨List.Nodup.map (fun x y hxy => by simpa using hxy) (ht.filter _), ih ht, ?_⟩
    rintro p hp q hq rfl
    simp only [List.mem_map, List.mem_filter] at hp
    obtain ⟨b, -, rfl⟩ := hp
    exact hat (fst_mem_of_mem_invs hq)

/-- A list that is not sorted decreasingly contains an adjacent out-of-order pair. -/
lemma exists_adjacent_lt_of_not_pairwise {l : List ι} (h : ¬ l.Pairwise (fun a b => b ≤ a)) :
    ∃ (P : List ι) (i j : ι) (Q : List ι), l = P ++ i :: j :: Q ∧ i < j := by
  induction l with
  | nil => exact absurd List.Pairwise.nil h
  | cons a t ih =>
    by_cases ht : t.Pairwise (fun a b => b ≤ a)
    · match t, ht with
      | [], _ => exact absurd (by simp) h
      | (c :: t'), ht =>
        by_cases hac : a < c
        · exact ⟨[], a, c, t', rfl, hac⟩
        · refine absurd ?_ h
          rw [List.pairwise_cons]
          refine ⟨fun b hb => ?_, ht⟩
          rcases List.mem_cons.1 hb with rfl | hb'
          · exact not_lt.1 hac
          · exact le_trans ((List.pairwise_cons.1 ht).1 b hb') (not_lt.1 hac)
    · obtain ⟨P, i, j, Q, rfl, hij⟩ := ih ht
      exact ⟨a :: P, i, j, Q, rfl, hij⟩

end PermDefect
