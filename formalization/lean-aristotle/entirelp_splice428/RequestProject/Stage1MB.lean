import Mathlib

/-!
# Real-rooted real polynomials

This file develops the basic closure properties of the class of real polynomials all of whose
complex roots are real (counted with multiplicity, using the convention
`card roots = natDegree`).

The closure properties proved here are:

* `HasOnlyRealRoots.C_mul`      : multiplication by a nonzero constant;
* `HasOnlyRealRoots.derivative` : Rolle's theorem (via `Polynomial.card_roots_le_derivative`);
* `HasOnlyRealRoots.reflect`    : reversal of the coefficient sequence;
* `HasOnlyRealRoots.comp_scale` : rescaling of the variable.

Together, these are exactly the operations used to build heat-majorized real-rooted
approximants in `RequestProject.Stage1LP`.
-/

open Polynomial

namespace Stage1MB

/-- A real polynomial has only real roots if the number of its real roots, counted with
multiplicity, equals its degree. -/
def HasOnlyRealRoots (P : ℝ[X]) : Prop :=
  Multiset.card P.roots = P.natDegree

theorem hasOnlyRealRoots_iff_splits {P : ℝ[X]} : HasOnlyRealRoots P ↔ P.Splits :=
  splits_iff_card_roots.symm

theorem hasOnlyRealRoots_zero : HasOnlyRealRoots 0 := by
  simp [HasOnlyRealRoots]

theorem splits_multiset_prod {s : Multiset ℝ[X]} (h : ∀ q ∈ s, q.Splits) : s.prod.Splits := by
  induction s using Multiset.induction with
  | empty => simp
  | cons a s ih =>
      rw [Multiset.prod_cons]
      exact (h a (by simp)).mul (ih fun q hq => h q (by simp [hq]))

/-- A constant multiple of a product of real linear factors has only real roots. -/
theorem hasOnlyRealRoots_C_mul_prod (a : ℝ) (s : Multiset ℝ) :
    HasOnlyRealRoots (C a * (s.map (fun x => X - C x)).prod) := by
  rw [hasOnlyRealRoots_iff_splits]
  refine Polynomial.Splits.mul (Polynomial.Splits.C _) ?_
  refine splits_multiset_prod ?_
  intro q hq
  obtain ⟨x, -, rfl⟩ := Multiset.mem_map.1 hq
  exact Polynomial.Splits.X_sub_C x

/-- Structure theorem: a polynomial with only real roots is a constant times a product of
real linear factors. -/
theorem HasOnlyRealRoots.exists_prod {P : ℝ[X]} (hP : HasOnlyRealRoots P) :
    ∃ (a : ℝ) (s : Multiset ℝ), Multiset.card s = P.natDegree ∧
      P = C a * (s.map (fun x => X - C x)).prod := by
  refine ⟨P.leadingCoeff, P.roots, hP, ?_⟩
  exact (hasOnlyRealRoots_iff_splits.1 hP).eq_prod_roots

theorem HasOnlyRealRoots.C_mul {P : ℝ[X]} {c : ℝ} (hP : HasOnlyRealRoots P) :
    HasOnlyRealRoots (C c * P) := by
  rw [hasOnlyRealRoots_iff_splits] at hP ⊢
  exact Polynomial.Splits.mul (Polynomial.Splits.C _) hP

theorem HasOnlyRealRoots.derivative {P : ℝ[X]} (hP : HasOnlyRealRoots P) :
    HasOnlyRealRoots (Polynomial.derivative P) := by
  unfold HasOnlyRealRoots at hP ⊢
  have hle : Multiset.card (Polynomial.derivative P).roots ≤ (Polynomial.derivative P).natDegree :=
    Polynomial.card_roots' _
  have hdeg : (Polynomial.derivative P).natDegree ≤ P.natDegree - 1 :=
    Polynomial.natDegree_derivative_le P
  have hge := Polynomial.card_roots_le_derivative P
  omega

theorem HasOnlyRealRoots.iterate_derivative {P : ℝ[X]} (hP : HasOnlyRealRoots P) (s : ℕ) :
    HasOnlyRealRoots ((⇑Polynomial.derivative)^[s] P) := by
  induction s generalizing P with
  | zero => simpa using hP
  | succ n ih =>
      rw [Function.iterate_succ_apply]
      exact ih hP.derivative

/-- `reflect N (C a)` is `a * X ^ N`. -/
theorem reflect_C (a : ℝ) (N : ℕ) : reflect N (C a) = C a * X ^ N := by
  ext i
  rw [coeff_reflect, coeff_C_mul, coeff_X_pow, coeff_C]
  rcases eq_or_ne i N with rfl | h
  · simp [Polynomial.revAt_le (le_refl i)]
  · have : (revAt N) i ≠ 0 := by
      rcases le_or_gt i N with hiN | hiN
      · rw [Polynomial.revAt_le hiN]
        omega
      · rw [Polynomial.revAt_eq_self_of_lt hiN]
        omega
    simp [this, h]

theorem splits_reflect_prod (a : ℝ) :
    ∀ (s : Multiset ℝ) (N : ℕ), Multiset.card s ≤ N →
      HasOnlyRealRoots (reflect N (C a * (s.map (fun x => X - C x)).prod)) := by
  intro s
  induction s using Multiset.induction with
  | empty =>
      intro N _
      simp only [Multiset.map_zero, Multiset.prod_zero, mul_one]
      rw [reflect_C, hasOnlyRealRoots_iff_splits]
      exact Polynomial.Splits.mul (Polynomial.Splits.C _)
        (Polynomial.Splits.pow Polynomial.Splits.X _)
  | cons x s ih =>
      intro N hN
      have hN1 : 1 ≤ N := by
        simp only [Multiset.card_cons] at hN; omega
      have hcard : Multiset.card s ≤ N - 1 := by
        simp only [Multiset.card_cons] at hN; omega
      have hrw : C a * ((x ::ₘ s).map (fun y => X - C y)).prod =
          (C a * (s.map (fun y => X - C y)).prod) * (X - C x) := by
        simp [Multiset.map_cons, Multiset.prod_cons]
        ring
      have hdeg1 : (C a * (s.map (fun y => X - C y)).prod).natDegree ≤ N - 1 := by
        refine le_trans (Polynomial.natDegree_mul_le) ?_
        have h2 : ((s.map (fun y => X - C y)).prod).natDegree ≤ Multiset.card s := by
          refine le_trans (Polynomial.natDegree_multiset_prod_le _) ?_
          refine le_trans (Multiset.sum_map_le_sum_map _ (fun _ => 1) ?_) ?_
          · intro q hq
            obtain ⟨y, -, rfl⟩ := Multiset.mem_map.1 hq
            simp
          · simp
        simp only [Polynomial.natDegree_C, zero_add]
        omega
      have hdeg2 : (X - C x : ℝ[X]).natDegree ≤ 1 := by
        simp
      have hNsplit : N = (N - 1) + 1 := by omega
      rw [hrw, hNsplit, Polynomial.reflect_mul _ _ hdeg1 hdeg2, hasOnlyRealRoots_iff_splits]
      refine Polynomial.Splits.mul (hasOnlyRealRoots_iff_splits.1 (ih (N - 1) hcard)) ?_
      refine Polynomial.Splits.of_natDegree_le_one ?_
      exact le_trans Polynomial.natDegree_reflect_le (by simp)

theorem HasOnlyRealRoots.reflect {P : ℝ[X]} {N : ℕ} (hP : HasOnlyRealRoots P)
    (hN : P.natDegree ≤ N) : HasOnlyRealRoots (Polynomial.reflect N P) := by
  obtain ⟨a, s, hs, rfl⟩ := hP.exists_prod
  exact splits_reflect_prod a s N (by omega)

theorem comp_C_mul_X_prod {c : ℝ} (hc : c ≠ 0) (a : ℝ) :
    ∀ (s : Multiset ℝ),
      (C a * (s.map (fun x => X - C x)).prod).comp (C c * X)
        = C (a * c ^ (Multiset.card s)) * ((s.map (fun x => x / c)).map (fun x => X - C x)).prod := by
  intro s
  induction s using Multiset.induction with
  | empty => simp
  | cons x s ih =>
      have hrw : C a * ((x ::ₘ s).map (fun y => X - C y)).prod =
          (C a * (s.map (fun y => X - C y)).prod) * (X - C x) := by
        simp [Multiset.map_cons, Multiset.prod_cons]; ring
      have hlin : (X - C x : ℝ[X]).comp (C c * X) = C c * (X - C (x / c)) := by
        rw [Polynomial.sub_comp, Polynomial.X_comp, Polynomial.C_comp, mul_sub, ← map_mul,
          mul_div_cancel₀ _ hc]
      have hmap : ∀ t : Multiset ℝ,
          (Multiset.map (fun y => X - C y) (Multiset.map (fun y : ℝ => y / c) t))
            = Multiset.map (fun y : ℝ => X - C (y / c)) t := by
        intro t; rw [Multiset.map_map]; rfl
      rw [hrw, Polynomial.mul_comp, ih, hlin]
      simp only [Multiset.map_cons, Multiset.prod_cons, Multiset.card_cons, hmap, map_mul,
        map_pow, pow_succ]
      ring

theorem HasOnlyRealRoots.comp_scale {P : ℝ[X]} {c : ℝ} (hc : c ≠ 0)
    (hP : HasOnlyRealRoots P) : HasOnlyRealRoots (P.comp (C c * X)) := by
  obtain ⟨a, s, -, rfl⟩ := hP.exists_prod
  rw [comp_C_mul_X_prod hc a s]
  exact hasOnlyRealRoots_C_mul_prod _ _

end Stage1MB
