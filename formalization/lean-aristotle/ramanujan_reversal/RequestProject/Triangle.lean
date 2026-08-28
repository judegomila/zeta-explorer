import Mathlib

/-!
# The crossover coefficient triangle and the Ramanujan polynomials

`crossoverPoly R n` is the polynomial `P_n` of the crossover coefficient triangle:
`P_1 = 1` and `P_{n+1}(u) = (n u + (2n-1)) P_n(u) - u P_n'(u)`, which coefficientwise reads
`a_k^{(n+1)} = n a_{k-1}^{(n)} + (2n-1-k) a_k^{(n)}`.  In particular `P_2 = 1 + u`, the base
case of the source.

`ramanujanPoly R n` is the classical Ramanujan polynomial `R_n`:
`R_1 = 1` and `R_{n+1}(x) = n (1+x) R_n(x) + x^2 R_n'(x)`.

The main result of this file is `crossover_coeff_eq_ramanujan_coeff`: the two triangles are
reverses of each other, `a_k^{(n)} = r_{n-1-k}^{(n)}`.
-/

namespace RamanujanReversal

open Polynomial

/-- The crossover triangle polynomials `P_n` (`P_0 = 0` is a dummy value). -/
noncomputable def crossoverPoly (R : Type*) [CommRing R] : ℕ → R[X]
  | 0 => 0
  | 1 => 1
  | (n + 2) => (C ((n : R) + 1) * X + C (2 * (n : R) + 1)) * crossoverPoly R (n + 1)
      - X * derivative (crossoverPoly R (n + 1))

/-- The Ramanujan polynomials `R_n` (`R_0 = 0` is a dummy value). -/
noncomputable def ramanujanPoly (R : Type*) [CommRing R] : ℕ → R[X]
  | 0 => 0
  | 1 => 1
  | (n + 2) => C ((n : R) + 1) * ((1 + X) * ramanujanPoly R (n + 1))
      + X ^ 2 * derivative (ramanujanPoly R (n + 1))

variable {R : Type*} [CommRing R]

@[simp] lemma crossoverPoly_one : crossoverPoly R 1 = 1 := rfl

@[simp] lemma ramanujanPoly_one : ramanujanPoly R 1 = 1 := rfl

/-- The recurrence of the source, in the form `P_{n+1} = (n X + (2n-1)) P_n - X P_n'`. -/
lemma crossoverPoly_succ (N : ℕ) (hN : 1 ≤ N) :
    crossoverPoly R (N + 1) = (C (N : R) * X + C (2 * (N : R) - 1)) * crossoverPoly R N
      - X * derivative (crossoverPoly R N) := by
  obtain ⟨m, rfl⟩ : ∃ m, N = m + 1 := ⟨N - 1, by omega⟩
  rw [crossoverPoly]
  push_cast
  ring_nf

/-- The classical Ramanujan recurrence `R_{n+1} = n (1+X) R_n + X² R_n'`. -/
lemma ramanujanPoly_succ (N : ℕ) (hN : 1 ≤ N) :
    ramanujanPoly R (N + 1) = C (N : R) * ((1 + X) * ramanujanPoly R N)
      + X ^ 2 * derivative (ramanujanPoly R N) := by
  obtain ⟨m, rfl⟩ : ∃ m, N = m + 1 := ⟨N - 1, by omega⟩
  rw [ramanujanPoly]
  push_cast
  ring_nf

/-- The base case of the source: `P_2(u) = 1 + u`. -/
lemma crossoverPoly_two : crossoverPoly R 2 = 1 + X := by
  rw [show (2 : ℕ) = 1 + 1 from rfl, crossoverPoly_succ 1 le_rfl]
  simp [Polynomial.C_1]
  rw [Polynomial.C_ofNat 2]
  ring

lemma ramanujanPoly_two : ramanujanPoly R 2 = 1 + X := by
  rw [show (2 : ℕ) = 1 + 1 from rfl, ramanujanPoly_succ 1 le_rfl]
  simp

/-! ### Coefficient recurrences -/

lemma coeff_crossoverPoly_succ_zero (N : ℕ) (hN : 1 ≤ N) :
    (crossoverPoly R (N + 1)).coeff 0 = (2 * (N : R) - 1) * (crossoverPoly R N).coeff 0 := by
  rw [crossoverPoly_succ N hN, coeff_sub, add_mul, coeff_add, mul_assoc, coeff_C_mul, coeff_C_mul]
  simp

/-- The coefficient recurrence of the source:
`a_k^{(n+1)} = n a_{k-1}^{(n)} + (2n-1-k) a_k^{(n)}`. -/
lemma coeff_crossoverPoly_succ (N k : ℕ) (hN : 1 ≤ N) :
    (crossoverPoly R (N + 1)).coeff (k + 1)
      = (N : R) * (crossoverPoly R N).coeff k
        + (2 * (N : R) - 1 - ((k : R) + 1)) * (crossoverPoly R N).coeff (k + 1) := by
  rw [crossoverPoly_succ N hN, coeff_sub, add_mul, coeff_add, mul_assoc, coeff_C_mul, coeff_C_mul,
    coeff_X_mul, coeff_X_mul, coeff_derivative]
  ring

lemma coeff_ramanujanPoly_succ_zero (N : ℕ) (hN : 1 ≤ N) :
    (ramanujanPoly R (N + 1)).coeff 0 = (N : R) * (ramanujanPoly R N).coeff 0 := by
  rw [ramanujanPoly_succ N hN]
  simp

/-- The coefficient form of the Ramanujan recurrence:
`r_j^{(n+1)} = n r_j^{(n)} + (n+j-1) r_{j-1}^{(n)}`. -/
lemma coeff_ramanujanPoly_succ (N j : ℕ) (hN : 1 ≤ N) :
    (ramanujanPoly R (N + 1)).coeff (j + 1)
      = (N : R) * (ramanujanPoly R N).coeff (j + 1)
        + ((N : R) + (j : R)) * (ramanujanPoly R N).coeff j := by
  rw [ramanujanPoly_succ N hN, coeff_add, coeff_C_mul, add_mul, one_mul, coeff_add, coeff_X_mul]
  cases j with
  | zero =>
      have h2 : ((X : R[X]) ^ 2 * derivative (ramanujanPoly R N)).coeff 1 = 0 := by
        rw [pow_two, mul_assoc, coeff_X_mul]
        simp
      rw [h2]
      push_cast
      ring
  | succ i =>
      have h2 : ((X : R[X]) ^ 2 * derivative (ramanujanPoly R N)).coeff (i + 1 + 1)
          = (ramanujanPoly R N).coeff (i + 1) * ((i : R) + 1) := by
        rw [pow_two, mul_assoc, coeff_X_mul, coeff_X_mul, coeff_derivative]
      rw [h2]
      push_cast
      ring

/-! ### Degree bounds: out-of-range coefficients vanish -/

lemma coeff_crossoverPoly_eq_zero (n k : ℕ) (h : n ≤ k) : (crossoverPoly R n).coeff k = 0 := by
  induction n generalizing k with
  | zero => simp [crossoverPoly]
  | succ N ih =>
      rcases Nat.eq_zero_or_pos N with hN | hN
      · subst hN
        have hk : k ≠ 0 := by omega
        show (1 : R[X]).coeff k = 0
        simp [Polynomial.coeff_one, hk]
      · obtain ⟨k', rfl⟩ : ∃ k', k = k' + 1 := ⟨k - 1, by omega⟩
        rw [coeff_crossoverPoly_succ N k' hN, ih k' (by omega), ih (k' + 1) (by omega)]
        ring

lemma coeff_ramanujanPoly_eq_zero (n j : ℕ) (h : n ≤ j) : (ramanujanPoly R n).coeff j = 0 := by
  induction n generalizing j with
  | zero => simp [ramanujanPoly]
  | succ N ih =>
      rcases Nat.eq_zero_or_pos N with hN | hN
      · subst hN
        have hj : j ≠ 0 := by omega
        show (1 : R[X]).coeff j = 0
        simp [Polynomial.coeff_one, hj]
      · obtain ⟨j', rfl⟩ : ∃ j', j = j' + 1 := ⟨j - 1, by omega⟩
        rw [coeff_ramanujanPoly_succ N j' hN, ih (j' + 1) (by omega), ih j' (by omega)]
        ring

/-! ### Theorem 1: the reversal identity -/

/-- **Theorem 1 (reversal identity).** For `k + j + 1 = n` we have `a_k^{(n)} = r_j^{(n)}`,
i.e. `a_k^{(n)} = r_{n-1-k}^{(n)}`: the crossover triangle is the coefficientwise reversal of
the Ramanujan polynomials. -/
theorem crossover_coeff_eq_ramanujan_coeff :
    ∀ (n : ℕ), 1 ≤ n → ∀ (k j : ℕ), k + j + 1 = n →
      (crossoverPoly R n).coeff k = (ramanujanPoly R n).coeff j := by
  intro n
  induction n with
  | zero => omega
  | succ N ih =>
      intro _ k j hkj
      rcases Nat.eq_zero_or_pos N with hN | hN
      · subst hN
        have hk : k = 0 := by omega
        have hj : j = 0 := by omega
        rw [hk, hj]
        rfl
      · cases k with
        | zero =>
            have hj : j = N := by omega
            rw [hj]
            obtain ⟨j', hj'⟩ : ∃ j', N = j' + 1 := ⟨N - 1, by omega⟩
            subst hj'
            rw [coeff_crossoverPoly_succ_zero _ hN,
              coeff_ramanujanPoly_succ (j' + 1) j' (by omega),
              coeff_ramanujanPoly_eq_zero (R := R) (j' + 1) (j' + 1) le_rfl,
              ← ih hN 0 j' (by omega)]
            push_cast
            ring
        | succ k' =>
            rw [coeff_crossoverPoly_succ N k' hN]
            cases j with
            | zero =>
                rw [coeff_ramanujanPoly_succ_zero N hN, ← ih hN k' 0 (by omega),
                  coeff_crossoverPoly_eq_zero (R := R) N (k' + 1) (by omega)]
                ring
            | succ j' =>
                rw [coeff_ramanujanPoly_succ N j' hN, ← ih hN k' (j' + 1) (by omega),
                  ← ih hN (k' + 1) j' (by omega)]
                have hcast : (N : R) = (k' : R) + (j' : R) + 2 := by
                  have hN2 : N = k' + j' + 2 := by omega
                  rw [hN2]; push_cast; ring
                rw [hcast]
                ring

/-! ### The first two Ramanujan coefficients -/

/-- `r_0^{(n)} = (n-1)!`. -/
lemma coeff_zero_ramanujanPoly (n : ℕ) (hn : 1 ≤ n) :
    (ramanujanPoly R n).coeff 0 = ((Nat.factorial (n - 1) : ℕ) : R) := by
  induction n with
  | zero => omega
  | succ N ih =>
      rcases Nat.eq_zero_or_pos N with hN | hN
      · subst hN
        show (1 : R[X]).coeff 0 = _
        simp
      · rw [coeff_ramanujanPoly_succ_zero N hN, ih hN]
        obtain ⟨m, hm⟩ : ∃ m, N = m + 1 := ⟨N - 1, by omega⟩
        subst hm
        simp only [Nat.add_sub_cancel, Nat.factorial_succ]
        push_cast
        ring

/-- `r_1^{(n)} = (n-1) (n-1)!`. -/
lemma coeff_one_ramanujanPoly (n : ℕ) (hn : 1 ≤ n) :
    (ramanujanPoly R n).coeff 1 = (((n - 1) * Nat.factorial (n - 1) : ℕ) : R) := by
  induction n with
  | zero => omega
  | succ N ih =>
      rcases Nat.eq_zero_or_pos N with hN | hN
      · subst hN
        show (1 : R[X]).coeff 1 = _
        simp [Polynomial.coeff_one]
      · rw [coeff_ramanujanPoly_succ N 0 hN, ih hN, coeff_zero_ramanujanPoly N hN]
        obtain ⟨m, hm⟩ : ∃ m, N = m + 1 := ⟨N - 1, by omega⟩
        subst hm
        simp only [Nat.add_sub_cancel, Nat.factorial_succ]
        push_cast
        ring

end RamanujanReversal
