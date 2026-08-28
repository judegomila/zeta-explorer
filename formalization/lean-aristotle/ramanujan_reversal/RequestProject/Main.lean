import Mathlib
import RequestProject.Triangle
import RequestProject.TreeSeries
import RequestProject.AbelIdentity

open scoped BigOperators
open scoped Nat

/-!
# Ramanujan-reversal identity for the crossover coefficient triangle

This file collects the four requested results, over the integers.

* `crossoverCoeff n k = a_k^{(n)}` is the crossover coefficient triangle: `P_1 = 1`,
  `P_{n+1}(u) = (n u + (2n-1)) P_n(u) - u P_n'(u)`, i.e.
  `a_k^{(n+1)} = n a_{k-1}^{(n)} + (2n-1-k) a_k^{(n)}`, with `P_2 = 1 + u`
  (`RamanujanReversal.crossoverPoly_two`); out-of-range coefficients are `0`.
* `ramanujanCoeff n j = r_j^{(n)}` are the coefficients of the Ramanujan polynomials
  `R_1 = 1`, `R_{n+1}(x) = n (1+x) R_n(x) + x^2 R_n'(x)`.

The four theorems:

* `theorem_1_reversal`  : `a_k^{(n)} = r_{n-1-k}^{(n)}`;
* `theorem_2_ramanujan_value` : `R_n(1) = n^{n-1}` (the Ramanujan/Cayley value, proved here
  from Abel's binomial identity via the tree function, not cited);
* `corollary_1_row_sum` : `P_n(1) = n^{n-1}`;
* `corollary_2_subleading` : `a_{n-2}^{(n)} = (n-1)·(n-1)!`.
-/

namespace RamanujanReversal

open Polynomial Finset

/-- `a_k^{(n)}`, the crossover coefficient triangle. -/
noncomputable def crossoverCoeff (n k : ℕ) : ℤ := (crossoverPoly ℤ n).coeff k

/-- `r_j^{(n)}`, the coefficients of the `n`-th Ramanujan polynomial. -/
noncomputable def ramanujanCoeff (n j : ℕ) : ℤ := (ramanujanPoly ℤ n).coeff j

/-! ### Sanity checks on the definitions -/

lemma crossoverCoeff_two (k : ℕ) : crossoverCoeff 2 k = if k = 0 ∨ k = 1 then 1 else 0 := by
  rw [crossoverCoeff, crossoverPoly_two]
  match k with
  | 0 => simp
  | 1 => simp [Polynomial.coeff_one]
  | (m + 2) => simp [Polynomial.coeff_one, Polynomial.coeff_X]

/-- Numerical check of the two families in row 3. -/
lemma crossoverPoly_three : crossoverPoly ℤ 3 = 3 + 4 * X + 2 * X ^ 2 := by
  show crossoverPoly ℤ (2 + 1) = _
  rw [crossoverPoly_succ 2 (by norm_num), crossoverPoly_two]
  simp [Polynomial.derivative_add]
  ring

lemma ramanujanPoly_three : ramanujanPoly ℤ 3 = 2 + 4 * X + 3 * X ^ 2 := by
  show ramanujanPoly ℤ (2 + 1) = _
  rw [ramanujanPoly_succ 2 (by norm_num), ramanujanPoly_two]
  simp [Polynomial.derivative_add]
  ring

/-- The recurrence of the source: `a_k^{(n+1)} = n a_{k-1}^{(n)} + (2n-1-k) a_k^{(n)}`
(for `n ≥ 1`, `k ≥ 1`), together with `a_0^{(n+1)} = (2n-1) a_0^{(n)}`. -/
lemma crossoverCoeff_recurrence (n k : ℕ) (hn : 1 ≤ n) :
    crossoverCoeff (n + 1) (k + 1)
      = (n : ℤ) * crossoverCoeff n k + (2 * (n : ℤ) - 1 - ((k : ℤ) + 1)) * crossoverCoeff n (k + 1) :=
  coeff_crossoverPoly_succ n k hn

lemma crossoverCoeff_recurrence_zero (n : ℕ) (hn : 1 ≤ n) :
    crossoverCoeff (n + 1) 0 = (2 * (n : ℤ) - 1) * crossoverCoeff n 0 :=
  coeff_crossoverPoly_succ_zero n hn

/-- The Ramanujan recurrence in coefficient form:
`r_j^{(n+1)} = n r_j^{(n)} + (n+j-1) r_{j-1}^{(n)}`. -/
lemma ramanujanCoeff_recurrence (n j : ℕ) (hn : 1 ≤ n) :
    ramanujanCoeff (n + 1) (j + 1)
      = (n : ℤ) * ramanujanCoeff n (j + 1) + ((n : ℤ) + (j : ℤ)) * ramanujanCoeff n j :=
  coeff_ramanujanPoly_succ n j hn

lemma ramanujanCoeff_recurrence_zero (n : ℕ) (hn : 1 ≤ n) :
    ramanujanCoeff (n + 1) 0 = (n : ℤ) * ramanujanCoeff n 0 :=
  coeff_ramanujanPoly_succ_zero n hn

/-- Out-of-range coefficients vanish. -/
lemma crossoverCoeff_eq_zero (n k : ℕ) (h : n ≤ k) : crossoverCoeff n k = 0 :=
  coeff_crossoverPoly_eq_zero n k h

lemma ramanujanCoeff_eq_zero (n j : ℕ) (h : n ≤ j) : ramanujanCoeff n j = 0 :=
  coeff_ramanujanPoly_eq_zero n j h

/-! ### Theorem 1 -/

/-- **Theorem 1 (reversal identity).** For every `n ≥ 1` and every `k ≤ n-1`,
`a_k^{(n)} = r_{n-1-k}^{(n)}`. -/
theorem theorem_1_reversal (n k : ℕ) (hn : 1 ≤ n) (hk : k ≤ n - 1) :
    crossoverCoeff n k = ramanujanCoeff n (n - 1 - k) :=
  crossover_coeff_eq_ramanujan_coeff n hn k (n - 1 - k) (by omega)

/-- **Theorem 1, polynomial form.** `P_n = reflect_{n-1} R_n`, i.e. `P_n(u) = u^{n-1} R_n(1/u)`. -/
theorem theorem_1_reversal_reflect (n : ℕ) (hn : 1 ≤ n) :
    crossoverPoly ℤ n = (ramanujanPoly ℤ n).reflect (n - 1) := by
  ext k
  rw [Polynomial.coeff_reflect]
  rcases le_or_gt k (n - 1) with h | h
  · rw [Polynomial.revAt_le h]
    exact crossover_coeff_eq_ramanujan_coeff n hn k (n - 1 - k) (by omega)
  · rw [Polynomial.revAt_eq_self_of_lt h, coeff_crossoverPoly_eq_zero n k (by omega),
      coeff_ramanujanPoly_eq_zero n k (by omega)]

/-! ### The leading coefficient of `R_n`, making the reversal well-formed -/

/-- `r_{n-1}^{(n)} = (2n-3)!! = ∏_{i<n-1} (2i+1)`. -/
lemma ramanujanCoeff_top (n : ℕ) (hn : 1 ≤ n) :
    ramanujanCoeff n (n - 1) = ∏ i ∈ Finset.range (n - 1), (2 * (i : ℤ) + 1) := by
  obtain ⟨m, rfl⟩ : ∃ m, n = m + 1 := ⟨n - 1, by omega⟩
  clear hn
  induction m with
  | zero => simp [ramanujanCoeff]
  | succ M ih =>
      have hrec := ramanujanCoeff_recurrence (M + 1) M le_add_self
      rw [ramanujanCoeff_eq_zero (M + 1) (M + 1) le_rfl] at hrec
      simp only [Nat.add_sub_cancel] at ih hrec ⊢
      rw [hrec, ih, Finset.prod_range_succ]
      push_cast
      ring

/-- `R_n` has degree exactly `n-1`. -/
lemma natDegree_ramanujanPoly (n : ℕ) (hn : 1 ≤ n) :
    (ramanujanPoly ℤ n).natDegree = n - 1 := by
  have hne : (ramanujanPoly ℤ n).coeff (n - 1) ≠ 0 := by
    rw [← ramanujanCoeff, ramanujanCoeff_top n hn]
    exact Finset.prod_ne_zero_iff.2 (fun i _ => by positivity)
  refine le_antisymm ?_ (Polynomial.le_natDegree_of_ne_zero hne)
  exact Polynomial.natDegree_le_iff_coeff_eq_zero.2
    (fun N hN => coeff_ramanujanPoly_eq_zero n N (by omega))

/-! ### Transferring the row sums between `ℤ` and `ℚ` -/

lemma map_crossoverPoly {R S : Type*} [CommRing R] [CommRing S] (f : R →+* S) (n : ℕ) :
    (crossoverPoly R n).map f = crossoverPoly S n := by
  induction n with
  | zero => simp [crossoverPoly]
  | succ N ih =>
      rcases Nat.eq_zero_or_pos N with hN | hN
      · subst hN; simp [crossoverPoly]
      · rw [crossoverPoly_succ N hN, crossoverPoly_succ N hN]
        simp [← Polynomial.derivative_map, ih, map_ofNat]

/-- **Corollary 1 (row sum).** `P_n(1) = ∑_k a_k^{(n)} = n^{n-1}`. -/
theorem corollary_1_row_sum (n : ℕ) (hn : 1 ≤ n) :
    (crossoverPoly ℤ n).eval 1 = (n : ℤ) ^ (n - 1) := by
  have h := crossoverPoly_eval_one_rat n hn
  have hmap : (crossoverPoly ℤ n).map (Int.castRingHom ℚ) = crossoverPoly ℚ n :=
    map_crossoverPoly _ n
  have hcast : (((crossoverPoly ℤ n).eval 1 : ℤ) : ℚ) = (crossoverPoly ℚ n).eval 1 := by
    rw [← hmap]
    simp [Polynomial.eval_map, Polynomial.eval₂_at_one]
  rw [h] at hcast
  exact_mod_cast hcast

/-- The row sums of the two triangles agree, because they are reverses of each other. -/
lemma eval_one_crossoverPoly_eq_eval_one_ramanujanPoly (n : ℕ) (hn : 1 ≤ n) :
    (crossoverPoly ℤ n).eval 1 = (ramanujanPoly ℤ n).eval 1 := by
  have hdC : (crossoverPoly ℤ n).natDegree < n := by
    have : (crossoverPoly ℤ n).natDegree ≤ n - 1 :=
      Polynomial.natDegree_le_iff_coeff_eq_zero.2
        (fun N hN => coeff_crossoverPoly_eq_zero n N (by omega))
    omega
  have hdR : (ramanujanPoly ℤ n).natDegree < n := by
    have : (ramanujanPoly ℤ n).natDegree ≤ n - 1 :=
      Polynomial.natDegree_le_iff_coeff_eq_zero.2
        (fun N hN => coeff_ramanujanPoly_eq_zero n N (by omega))
    omega
  rw [Polynomial.eval_eq_sum_range' hdC, Polynomial.eval_eq_sum_range' hdR]
  simp only [one_pow, mul_one]
  rw [← Finset.sum_range_reflect (fun j => (ramanujanPoly ℤ n).coeff j) n]
  refine Finset.sum_congr rfl (fun k hk => ?_)
  have hk' : k < n := Finset.mem_range.1 hk
  exact crossover_coeff_eq_ramanujan_coeff n hn k (n - 1 - k) (by omega)

/-- **Theorem 2 (Ramanujan/Cayley value).** `R_n(1) = n^{n-1}` for every `n ≥ 1`. -/
theorem theorem_2_ramanujan_value (n : ℕ) (hn : 1 ≤ n) :
    (ramanujanPoly ℤ n).eval 1 = (n : ℤ) ^ (n - 1) := by
  rw [← eval_one_crossoverPoly_eq_eval_one_ramanujanPoly n hn]
  exact corollary_1_row_sum n hn

/-- **Corollary 2 (subleading coefficient).** `a_{n-2}^{(n)} = (n-1)·(n-1)!` for `n ≥ 2`. -/
theorem corollary_2_subleading (n : ℕ) (hn : 2 ≤ n) :
    crossoverCoeff n (n - 2) = ((n - 1) * (n - 1)! : ℕ) := by
  have h1 : crossoverCoeff n (n - 2) = ramanujanCoeff n 1 :=
    crossover_coeff_eq_ramanujan_coeff n (by omega) (n - 2) 1 (by omega)
  rw [h1, ramanujanCoeff, coeff_one_ramanujanPoly n (by omega)]

end RamanujanReversal
