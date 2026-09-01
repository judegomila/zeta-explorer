import Mathlib

/-!
# The backward heat operator `heatOp s = e^{-s D²}` on `ℝ[X]`

This file sets up the operator `heatOp s = e^{-s·D²}` on real polynomials
(a finite sum, since `D` is locally nilpotent on `ℝ[X]`), records its basic
algebraic properties, and identifies `heatOp (1/2)` on monomials with the
(probabilist's) Hermite polynomials `Heₙ` of `Polynomial.hermite`.
-/

open Polynomial

namespace JetLemma

open scoped Nat

/-- The backward heat operator `e^{-s D²}` acting on real polynomials:
`heatOp s p = ∑ₖ (-s)^k / k! · (d/dx)^{2k} p`.  The sum is finite because
iterated derivatives of a polynomial eventually vanish. -/
noncomputable def heatOp (s : ℝ) (p : ℝ[X]) : ℝ[X] :=
  ∑ k ∈ Finset.range (p.natDegree + 1), C ((-s) ^ k / (k ! : ℝ)) * derivative^[2 * k] p

/-- The real (probabilist's) Hermite polynomial `Heₙ`, the image of mathlib's
`Polynomial.hermite n` under `ℤ → ℝ`. -/
noncomputable def hermiteReal (n : ℕ) : ℝ[X] :=
  (Polynomial.hermite n).map (Int.castRingHom ℝ)

/-- `p` has only real roots: its multiset of (real) roots has size `natDegree p`. -/
def HasOnlyRealRoots (p : ℝ[X]) : Prop := Multiset.card p.roots = p.natDegree

/-- The defining sum of `heatOp` may be taken over any sufficiently long range. -/
lemma heatOp_eq_sum_range (s : ℝ) (p : ℝ[X]) {N : ℕ} (hN : p.natDegree ≤ N) :
    heatOp s p = ∑ k ∈ Finset.range (N + 1), C ((-s) ^ k / (k ! : ℝ)) * derivative^[2 * k] p := by
  unfold heatOp
  have hsub : Finset.range (p.natDegree + 1) ⊆ Finset.range (N + 1) := by
    intro x hx
    simp only [Finset.mem_range] at hx ⊢
    omega
  refine Finset.sum_subset hsub ?_
  intro k hk hk'
  simp only [Finset.mem_range, not_lt] at hk hk'
  rw [Polynomial.iterate_derivative_eq_zero (by omega), mul_zero]

lemma iterate_derivative_C_mul (j : ℕ) (c : ℝ) (p : ℝ[X]) :
    derivative^[j] (C c * p) = C c * derivative^[j] p := by
  induction j with
  | zero => simp
  | succ j ih => simp [Function.iterate_succ_apply', ih]

lemma heatOp_add (s : ℝ) (p q : ℝ[X]) : heatOp s (p + q) = heatOp s p + heatOp s q := by
  have h1 : p.natDegree ≤ max (p + q).natDegree (max p.natDegree q.natDegree) :=
    le_max_of_le_right (le_max_left _ _)
  have h2 : q.natDegree ≤ max (p + q).natDegree (max p.natDegree q.natDegree) :=
    le_max_of_le_right (le_max_right _ _)
  have h3 : (p + q).natDegree ≤ max (p + q).natDegree (max p.natDegree q.natDegree) :=
    le_max_left _ _
  rw [heatOp_eq_sum_range s p h1, heatOp_eq_sum_range s q h2, heatOp_eq_sum_range s (p + q) h3,
    ← Finset.sum_add_distrib]
  refine Finset.sum_congr rfl fun k _ => ?_
  rw [iterate_map_add, mul_add]

lemma heatOp_C_mul (s c : ℝ) (p : ℝ[X]) : heatOp s (C c * p) = C c * heatOp s p := by
  have h1 : p.natDegree ≤ max (C c * p).natDegree p.natDegree := le_max_right _ _
  have h3 : (C c * p).natDegree ≤ max (C c * p).natDegree p.natDegree := le_max_left _ _
  rw [heatOp_eq_sum_range s p h1, heatOp_eq_sum_range s _ h3, Finset.mul_sum]
  refine Finset.sum_congr rfl fun k _ => ?_
  rw [iterate_derivative_C_mul]
  ring

lemma heatOp_one (s : ℝ) : heatOp s 1 = 1 := by
  simp [heatOp]

/-- `heatOp` commutes with differentiation. -/
lemma derivative_heatOp (s : ℝ) (p : ℝ[X]) :
    derivative (heatOp s p) = heatOp s (derivative p) := by
  have h1 : (derivative p).natDegree ≤ p.natDegree :=
    (natDegree_derivative_le p).trans (Nat.sub_le _ _)
  rw [heatOp_eq_sum_range s (derivative p) h1, heatOp_eq_sum_range s p le_rfl, map_sum]
  refine Finset.sum_congr rfl fun k _ => ?_
  rw [derivative_C_mul]
  congr 1
  rw [← Function.iterate_succ_apply' derivative, ← Function.iterate_succ_apply]

/-- Leibniz rule for iterated derivatives of `X * q`. -/
lemma iterate_derivative_X_mul_succ (j : ℕ) (q : ℝ[X]) :
    derivative^[j + 1] (X * q) = X * derivative^[j + 1] q + ((j : ℝ) + 1) • derivative^[j] q := by
  induction j with
  | zero => simp; ring
  | succ j ih =>
    rw [Function.iterate_succ_apply' derivative (j + 1), ih]
    rw [map_add, derivative_mul, derivative_X, one_mul, derivative_smul,
      ← Function.iterate_succ_apply' derivative (j + 1),
      ← Function.iterate_succ_apply' derivative j]
    push_cast
    module

/-- The commutator identity `e^{-sD²} (x·q) = x·e^{-sD²} q - 2s·D e^{-sD²} q`. -/
lemma heatOp_X_mul (s : ℝ) (q : ℝ[X]) :
    heatOp s (X * q) = X * heatOp s q - C (2 * s) * derivative (heatOp s q) := by
  set d := q.natDegree with hd
  have hXq : (X * q).natDegree ≤ d + 1 := by
    refine (natDegree_mul_le).trans ?_
    simp only [natDegree_X, ← hd]
    omega
  have hDq : (derivative q).natDegree ≤ d := (natDegree_derivative_le q).trans (Nat.sub_le _ _)
  have hq' : q.natDegree ≤ d + 1 := by omega
  rw [derivative_heatOp, heatOp_eq_sum_range s (X * q) hXq,
    heatOp_eq_sum_range s q hq',
    heatOp_eq_sum_range s (derivative q) hDq, Finset.mul_sum, Finset.mul_sum]
  -- expand the left sum using the Leibniz rule
  have hterm : ∀ k ∈ Finset.range (d + 1 + 1),
      C ((-s) ^ k / (k ! : ℝ)) * derivative^[2 * k] (X * q)
        = X * (C ((-s) ^ k / (k ! : ℝ)) * derivative^[2 * k] q)
          + C ((-s) ^ k / (k ! : ℝ) * (2 * k)) * derivative^[2 * k - 1] q := by
    intro k _
    rcases Nat.eq_zero_or_pos k with hk | hk
    · subst hk; simp
    · obtain ⟨j, rfl⟩ : ∃ j, k = j + 1 := ⟨k - 1, by omega⟩
      have h2 : 2 * (j + 1) = (2 * j + 1) + 1 := by ring
      rw [h2, iterate_derivative_X_mul_succ]
      have h3 : 2 * j + 1 + 1 - 1 = 2 * j + 1 := by omega
      have hsm : C ((-s) ^ (j + 1) / (((j + 1)! : ℕ) : ℝ)) *
            (((2 * j + 1 : ℕ) : ℝ) + 1) • derivative^[2 * j + 1] q
          = C ((-s) ^ (j + 1) / (((j + 1)! : ℕ) : ℝ) * (2 * ((j + 1 : ℕ) : ℝ)))
              * derivative^[2 * j + 1] q := by
        rw [Polynomial.smul_eq_C_mul, ← mul_assoc, ← C_mul]
        congr 2
        push_cast
        ring
      rw [mul_add, hsm, h3]
      ring
  rw [Finset.sum_congr rfl hterm, Finset.sum_add_distrib, ← Finset.mul_sum]
  rw [sub_eq_add_neg]
  congr 1
  -- the correction term
  rw [Finset.sum_range_succ'
    (fun k => C ((-s) ^ k / (k ! : ℝ) * (2 * (k : ℝ))) * derivative^[2 * k - 1] q)]
  simp only [Nat.cast_zero, mul_zero, map_zero, zero_mul, add_zero]
  rw [← Finset.sum_neg_distrib]
  refine Finset.sum_congr rfl fun j _ => ?_
  have h4 : 2 * (j + 1) - 1 = 2 * j + 1 := by omega
  have hRHS : -(C (2 * s) * (C ((-s) ^ j / (j ! : ℝ)) * derivative^[2 * j] (derivative q)))
      = C (-(2 * s * ((-s) ^ j / (j ! : ℝ)))) * derivative^[2 * j] (derivative q) := by
    rw [← mul_assoc, ← C_mul, ← neg_mul, ← C_neg]
  rw [h4, Function.iterate_succ_apply, hRHS]
  congr 2
  have hfac : (((j + 1)! : ℕ) : ℝ) = ((j : ℝ) + 1) * ((j ! : ℕ) : ℝ) := by
    rw [Nat.factorial_succ]; push_cast; ring
  have hj : ((j : ℝ) + 1) ≠ 0 := by positivity
  have hjf : ((j ! : ℕ) : ℝ) ≠ 0 := Nat.cast_ne_zero.mpr (Nat.factorial_ne_zero j)
  rw [hfac, pow_succ]
  field_simp
  push_cast
  ring

lemma hermiteReal_zero : hermiteReal 0 = 1 := by
  simp [hermiteReal, Polynomial.hermite_zero]

lemma hermiteReal_succ (n : ℕ) :
    hermiteReal (n + 1) = X * hermiteReal n - derivative (hermiteReal n) := by
  simp [hermiteReal, Polynomial.hermite_succ, Polynomial.derivative_map]

lemma hermiteReal_monic (n : ℕ) : (hermiteReal n).Monic := by
  have := Polynomial.hermite_monic n
  simpa [hermiteReal] using this.map (Int.castRingHom ℝ)

lemma natDegree_hermiteReal (n : ℕ) : (hermiteReal n).natDegree = n := by
  rw [hermiteReal, natDegree_map_eq_of_injective (Int.cast_injective) _,
    Polynomial.natDegree_hermite]

/-- `e^{-D²/2}` sends `xⁿ` to the Hermite polynomial `Heₙ`. -/
theorem heatOp_half_X_pow_eq_hermiteReal (n : ℕ) :
    heatOp (1 / 2 : ℝ) (X ^ n) = hermiteReal n := by
  induction n with
  | zero => rw [pow_zero, heatOp_one, hermiteReal_zero]
  | succ n ih =>
    have : (X : ℝ[X]) ^ (n + 1) = X * X ^ n := by ring
    rw [this, heatOp_X_mul, ih, hermiteReal_succ]
    norm_num

/-- Iterated derivatives under the rescaling `x ↦ c x`. -/
lemma iterate_derivative_comp_scale (j : ℕ) (c : ℝ) (p : ℝ[X]) :
    derivative^[j] (p.comp (C c * X)) = C (c ^ j) * (derivative^[j] p).comp (C c * X) := by
  induction j with
  | zero => simp
  | succ j ih =>
    rw [Function.iterate_succ_apply' derivative j, ih, derivative_C_mul, derivative_comp]
    rw [Function.iterate_succ_apply' derivative j]
    simp [pow_succ]
    ring

/-- Scaling law of the heat semigroup: `e^{-sD²} ∘ Σ_c = Σ_c ∘ e^{-s c² D²}`. -/
theorem heatOp_comp_scale (s c : ℝ) (p : ℝ[X]) :
    heatOp s (p.comp (C c * X)) = (heatOp (s * c ^ 2) p).comp (C c * X) := by
  have hdeg : (p.comp (C c * X)).natDegree ≤ p.natDegree := by
    refine natDegree_comp_le.trans ?_
    have : (C c * X : ℝ[X]).natDegree ≤ 1 := by
      refine natDegree_mul_le.trans ?_
      simp
    calc p.natDegree * (C c * X : ℝ[X]).natDegree ≤ p.natDegree * 1 := by
          exact Nat.mul_le_mul_left _ this
      _ = p.natDegree := by ring
  rw [heatOp_eq_sum_range s _ hdeg, heatOp_eq_sum_range (s * c ^ 2) p le_rfl]
  rw [Polynomial.sum_comp]
  refine Finset.sum_congr rfl fun k _ => ?_
  rw [iterate_derivative_comp_scale]
  rw [show ((C ((-(s * c ^ 2)) ^ k / (k ! : ℝ)) * derivative^[2 * k] p).comp (C c * X))
      = C ((-(s * c ^ 2)) ^ k / (k ! : ℝ)) * (derivative^[2 * k] p).comp (C c * X) from by
    simp [mul_comp]]
  rw [← mul_assoc, ← C_mul]
  congr 2
  have hc : (-(s * c ^ 2)) ^ k = (-s) ^ k * (c ^ k) ^ 2 := by
    rw [show -(s * c ^ 2) = (-s) * c ^ 2 by ring, mul_pow, ← pow_mul, ← pow_mul, mul_comm 2 k]
  rw [hc]
  ring

end JetLemma
