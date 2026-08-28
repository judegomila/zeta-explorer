import Mathlib

open scoped BigOperators
open scoped Real
open scoped Nat
open scoped Classical
open scoped Pointwise

set_option maxHeartbeats 8000000
set_option maxRecDepth 4000
set_option synthInstance.maxHeartbeats 20000
set_option synthInstance.maxSize 128

set_option relaxedAutoImplicit false
set_option autoImplicit false

set_option grind.warning false

/-!
# All-orders coefficient positivity for the crossover numerator polynomials `P n`

Formalization of `job16_crossover_sign_induction.tex`.

Real polynomials `P n` (`n ≥ 2`) are defined by
`P 2 = u + 1`, `P (n+1) = n * u * P n + (2n-1) * P n - u * (P n)'`.
Writing `a_k^{(n)} = (P n).coeff k`, this is the coefficient recurrence
`a_k^{(n+1)} = n * a_{k-1}^{(n)} + (2n-1-k) * a_k^{(n)}`.

Main results:

* `Crossover.P_coeff_pos` (Theorem 1): all coefficients `a_k^{(n)}`, `k ≤ n-1`, are
  strictly positive; together with `Crossover.P_coeff_eq_zero` this gives
  `Crossover.P_natDegree : (P n).natDegree = n - 1` and
  `Crossover.P_eval_pos : 0 < (P n).eval u` for `u > 0`.
* `Crossover.P_coeff_leading` and `Crossover.P_coeff_const` (Theorem 2):
  `a_{n-1}^{(n)} = (n-1)!` and `a_0^{(n)} = (2n-3)!!`.

The cross-check literals `P 3, …, P 6` of the source are verified at the end of the file.
-/

namespace Crossover

open Polynomial

/-- The crossover numerator polynomials.  For `n ≥ 2` these satisfy
`P 2 = X + 1` and `P (n+1) = (n * X + (2n-1)) * P n - X * (P n)'`.
The values at `n = 0, 1` are irrelevant padding. -/
noncomputable def P : ℕ → Polynomial ℝ
  | 0 => 0
  | 1 => 0
  | 2 => X + 1
  | (n + 1) => (C ((n : ℝ)) * X + C (2 * (n : ℝ) - 1)) * P n - X * derivative (P n)

@[simp] theorem P_two : P 2 = X + 1 := rfl

/-- The defining recurrence, valid for all `n ≥ 2`. -/
theorem P_succ {n : ℕ} (hn : 2 ≤ n) :
    P (n + 1) = (C ((n : ℝ)) * X + C (2 * (n : ℝ) - 1)) * P n - X * derivative (P n) := by
  match n, hn with
  | (m + 2), _ => rfl

/-- The constant-term recurrence: `a_0^{(n+1)} = (2n-1) a_0^{(n)}`. -/
theorem P_succ_coeff_zero {n : ℕ} (hn : 2 ≤ n) :
    (P (n + 1)).coeff 0 = (2 * (n : ℝ) - 1) * (P n).coeff 0 := by
  rw [P_succ hn]
  simp only [coeff_sub, coeff_add, add_mul, mul_coeff_zero, coeff_X_zero, coeff_C_zero]
  ring

/-- The coefficient recurrence `a_{k+1}^{(n+1)} = n a_k^{(n)} + (2n-1-(k+1)) a_{k+1}^{(n)}`. -/
theorem P_succ_coeff_succ {n : ℕ} (hn : 2 ≤ n) (k : ℕ) :
    (P (n + 1)).coeff (k + 1) =
      (n : ℝ) * (P n).coeff k + (2 * (n : ℝ) - 1 - (k + 1)) * (P n).coeff (k + 1) := by
  rw [P_succ hn]
  simp only [coeff_sub, coeff_add, mul_assoc, coeff_C_mul, coeff_X_mul, add_mul,
    coeff_derivative]
  ring

/-- Theorem 1, main induction: all coefficients below index `n` are strictly positive and
all coefficients from index `n` on vanish. -/
theorem P_coeff_pos_and_vanish :
    ∀ n : ℕ, 2 ≤ n → (∀ k < n, 0 < (P n).coeff k) ∧ (∀ k, n ≤ k → (P n).coeff k = 0) := by
  intro n hn
  induction n, hn using Nat.le_induction with
  | base =>
      constructor
      · intro k hk
        interval_cases k <;> simp [coeff_one]
      · intro k hk
        have h1 : k ≠ 0 := by omega
        have h2 : k ≠ 1 := by omega
        rw [P_two]
        simp [coeff_one, coeff_X, h1, Ne.symm h2]
  | succ n hn ih =>
      obtain ⟨hpos, hzero⟩ := ih
      have hn2 : (2 : ℝ) ≤ (n : ℝ) := by exact_mod_cast hn
      constructor
      · intro k hk
        match k with
        | 0 =>
            rw [P_succ_coeff_zero hn]
            exact mul_pos (by linarith) (hpos 0 (by omega))
        | (k + 1) =>
            rw [P_succ_coeff_succ hn k]
            have h1 : 0 < (n : ℝ) * (P n).coeff k := mul_pos (by linarith) (hpos k (by omega))
            rcases lt_or_ge (k + 1) n with hlt | hge
            · have hkn : ((k : ℝ) + 1) + 1 ≤ (n : ℝ) := by exact_mod_cast hlt
              have h2 : 0 < (2 * (n : ℝ) - 1 - ((k : ℝ) + 1)) * (P n).coeff (k + 1) :=
                mul_pos (by linarith) (hpos (k + 1) hlt)
              push_cast at h2 ⊢
              linarith
            · rw [hzero (k + 1) hge]
              simpa using h1
      · intro k hk
        match k with
        | 0 => omega
        | (k + 1) =>
            rw [P_succ_coeff_succ hn k, hzero k (by omega), hzero (k + 1) (by omega)]
            ring

/-- **Theorem 1 (all-orders strict coefficient positivity).**
For `n ≥ 2` every coefficient `a_k^{(n)}`, `k = 0, …, n-1`, is strictly positive. -/
theorem P_coeff_pos {n : ℕ} (hn : 2 ≤ n) {k : ℕ} (hk : k < n) : 0 < (P n).coeff k :=
  (P_coeff_pos_and_vanish n hn).1 k hk

/-- The coefficients of `P n` above index `n - 1` vanish. -/
theorem P_coeff_eq_zero {n : ℕ} (hn : 2 ≤ n) {k : ℕ} (hk : n ≤ k) : (P n).coeff k = 0 :=
  (P_coeff_pos_and_vanish n hn).2 k hk

/-- `deg (P n) = n - 1`. -/
theorem P_natDegree {n : ℕ} (hn : 2 ≤ n) : (P n).natDegree = n - 1 := by
  have hne : (P n).coeff (n - 1) ≠ 0 := ne_of_gt (P_coeff_pos hn (by omega))
  refine natDegree_eq_of_degree_eq_some (degree_eq_of_le_of_coeff_ne_zero ?_ hne)
  refine (degree_le_iff_coeff_zero _ _).mpr ?_
  intro m hm
  have hm' : n ≤ m := by
    rcases m with _ | m
    · simp at hm
    · have : ((n : ℕ) - 1 : ℕ) < (m + 1 : ℕ) := by exact_mod_cast hm
      omega
  exact P_coeff_eq_zero hn hm'

/-- Consequence of Theorem 1: `P n` is strictly positive on the positive reals. -/
theorem P_eval_pos {n : ℕ} (hn : 2 ≤ n) {u : ℝ} (hu : 0 < u) : 0 < (P n).eval u := by
  have hdeg : (P n).natDegree < n := by
    have := P_natDegree hn; omega
  rw [eval_eq_sum_range' hdeg]
  refine Finset.sum_pos (fun k hk => ?_) ⟨0, Finset.mem_range.mpr (by omega)⟩
  exact mul_pos (P_coeff_pos hn (Finset.mem_range.mp hk)) (pow_pos hu k)

/-- **Theorem 2 (leading coefficient).** `a_{n-1}^{(n)} = (n-1)!`. -/
theorem P_coeff_leading {n : ℕ} (hn : 2 ≤ n) : (P n).coeff (n - 1) = ((n - 1)! : ℕ) := by
  induction n, hn using Nat.le_induction with
  | base => norm_num [coeff_one]
  | succ n hn ih =>
      have hn1 : n + 1 - 1 = (n - 1) + 1 := by omega
      rw [hn1, P_succ_coeff_succ hn (n - 1), ih,
        P_coeff_eq_zero hn (show n ≤ n - 1 + 1 by omega)]
      obtain ⟨m, rfl⟩ : ∃ m, n = m + 2 := ⟨n - 2, by omega⟩
      have e : m + 2 - 1 = m + 1 := by omega
      rw [e]
      push_cast [Nat.factorial_succ]
      ring

/-- **Theorem 2 (constant coefficient).** `a_0^{(n)} = (2n-3)!!`. -/
theorem P_coeff_const {n : ℕ} (hn : 2 ≤ n) : (P n).coeff 0 = ((2 * n - 3)‼ : ℕ) := by
  induction n, hn using Nat.le_induction with
  | base => simp [Nat.doubleFactorial]
  | succ n hn ih =>
      rw [P_succ_coeff_zero hn, ih]
      have hdf : (2 * (n + 1) - 3)‼ = (2 * n - 1) * (2 * n - 3)‼ := by
        obtain ⟨m, rfl⟩ : ∃ m, n = m + 2 := ⟨n - 2, by omega⟩
        have h1 : 2 * (m + 2 + 1) - 3 = (2 * m + 1) + 2 := by omega
        have h2 : 2 * (m + 2) - 3 = 2 * m + 1 := by omega
        have h3 : 2 * (m + 2) - 1 = 2 * m + 3 := by omega
        rw [h1, h2, h3, Nat.doubleFactorial_add_two]
      rw [hdf]
      have h2n : (1 : ℕ) ≤ 2 * n := by omega
      push_cast [Nat.cast_sub h2n]
      ring

/-! ### Cross-check against the measured literals of the source -/

theorem P_three : P 3 = 2 * X ^ 2 + 4 * X + 3 := by
  rw [P_succ (n := 2) le_rfl, P_two]
  simp only [derivative_add, derivative_X, derivative_one]
  norm_num
  simp only [C_ofNat]
  ring

theorem P_four : P 4 = 6 * X ^ 3 + 18 * X ^ 2 + 25 * X + 15 := by
  rw [P_succ (n := 3) (by norm_num), P_three]
  simp only [derivative_add, derivative_mul, derivative_X, derivative_pow, derivative_ofNat]
  norm_num
  simp only [C_ofNat]
  ring

theorem P_five : P 5 = 24 * X ^ 4 + 96 * X ^ 3 + 190 * X ^ 2 + 210 * X + 105 := by
  rw [P_succ (n := 4) (by norm_num), P_four]
  simp only [derivative_add, derivative_mul, derivative_X, derivative_pow, derivative_ofNat]
  norm_num
  simp only [C_ofNat]
  ring

theorem P_six :
    P 6 = 120 * X ^ 5 + 600 * X ^ 4 + 1526 * X ^ 3 + 2380 * X ^ 2 + 2205 * X + 945 := by
  rw [P_succ (n := 5) (by norm_num), P_five]
  simp only [derivative_add, derivative_mul, derivative_X, derivative_pow, derivative_ofNat]
  norm_num
  simp only [C_ofNat]
  ring

end Crossover
