import Mathlib

/-!
# Abel's binomial identity and the tree-function convolution

This file develops the classical Abel polynomials `A_k(x) = x (x+k)^{k-1}` (with `A_0 = 1`),
proves that they form a sequence of binomial type (Abel's binomial theorem), and deduces the
convolution identity satisfied by the numbers `n^{n-1}/n!`.

The convolution identity is what makes the "tree function"
`T = ∑ n^{n-1} X^n / n!` satisfy the differential equation `X (1 - T) T' = T`, which is used
in `RequestProject.TreeSeries` to prove the Ramanujan/Cayley evaluation `R_n(1) = n^{n-1}`.
-/

namespace RamanujanReversal

open Polynomial Finset

/-- The Abel polynomials `A_0 = 1` and `A_{k+1}(x) = x (x + (k+1))^k`. -/
noncomputable def abelPoly (R : Type*) [CommRing R] : ℕ → R[X]
  | 0 => 1
  | (k + 1) => X * (X + C ((k : R) + 1)) ^ k

variable {R : Type*} [CommRing R]

@[simp] lemma abelPoly_zero : abelPoly R 0 = 1 := rfl

lemma abelPoly_succ (k : ℕ) : abelPoly R (k + 1) = X * (X + C ((k : R) + 1)) ^ k := rfl

/-- The basic "delta operator" property of the Abel polynomials: `A_{k+1}'(x) = (k+1) A_k(x+1)`. -/
lemma derivative_abelPoly (k : ℕ) :
    derivative (abelPoly R (k + 1)) = C ((k : R) + 1) * (abelPoly R k).comp (X + 1) := by
  cases k with
  | zero => simp [abelPoly]
  | succ m =>
      rw [abelPoly_succ, abelPoly_succ]
      simp only [derivative_mul, derivative_X, one_mul, derivative_pow, derivative_add,
        derivative_C, add_zero, Nat.add_sub_cancel, mul_comp, X_comp, pow_comp, add_comp, C_comp]
      simp only [map_add, map_one, map_natCast, Nat.cast_add, Nat.cast_one]
      ring

lemma eval_zero_abelPoly (k : ℕ) : (abelPoly R k).eval 0 = if k = 0 then 1 else 0 := by
  cases k with
  | zero => simp
  | succ m => simp [abelPoly_succ]

/-- `A_k` has `x`-coefficient `k^{k-1}` (and `0` for `k = 0`). -/
lemma coeff_one_abelPoly (k : ℕ) :
    (abelPoly R k).coeff 1 = if k = 0 then 0 else (k : R) ^ (k - 1) := by
  cases k with
  | zero => simp [Polynomial.coeff_one]
  | succ m =>
      rw [abelPoly_succ]
      rw [Polynomial.coeff_X_mul]
      rw [Polynomial.coeff_zero_eq_eval_zero]
      simp

/-- The Abel convolution sum `∑_k C(n,k) A_{n-k}(y) A_k(x)`, as a polynomial in `x`. -/
noncomputable def abelSum (R : Type*) [CommRing R] (n : ℕ) (y : R) : R[X] :=
  ∑ k ∈ range (n + 1), C ((n.choose k : R) * (abelPoly R (n - k)).eval y) * abelPoly R k

lemma eval_zero_abelSum (n : ℕ) (y : R) :
    (abelSum R n y).eval 0 = (abelPoly R n).eval y := by
  rw [abelSum, eval_finset_sum, Finset.sum_eq_single 0]
  · simp
  · intro b _ hb
    simp [eval_zero_abelPoly, hb]
  · intro h
    simp at h

lemma derivative_abelSum (N : ℕ) (y : R) :
    derivative (abelSum R (N + 1) y) = C ((N : R) + 1) * (abelSum R N y).comp (X + 1) := by
  rw [abelSum, abelSum, derivative_sum, Finset.sum_range_succ' _ (N + 1), Polynomial.sum_comp,
    Finset.mul_sum]
  simp only [abelPoly_zero, mul_one, derivative_C, add_zero, Nat.choose_zero_right, Nat.sub_zero]
  refine Finset.sum_congr rfl (fun j _ => ?_)
  rw [derivative_C_mul, derivative_abelPoly, mul_comp, C_comp]
  have hchoose : (((N + 1).choose (j + 1) : R)) * ((j : R) + 1)
      = ((N : R) + 1) * (N.choose j : R) := by
    have h2 : ((N + 1) * N.choose j : ℕ) = ((N + 1).choose (j + 1) * (j + 1) : ℕ) :=
      Nat.add_one_mul_choose_eq N j
    have h3 := congrArg (fun m : ℕ => (m : R)) h2
    push_cast at h3
    exact h3.symm
  have hsub : N + 1 - (j + 1) = N - j := by omega
  rw [hsub, ← mul_assoc, ← C_mul]
  have key : C ((((N + 1).choose (j + 1) : R)) * eval y (abelPoly R (N - j)) * ((j : R) + 1))
      = C ((N : R) + 1) * C ((N.choose j : R) * eval y (abelPoly R (N - j))) := by
    rw [← C_mul]
    congr 1
    linear_combination (eval y (abelPoly R (N - j))) * hchoose
  rw [key, mul_assoc]

lemma eq_of_derivative_eq_of_eval_zero {R : Type*} [CommRing R] [IsDomain R] [CharZero R]
    {p q : R[X]} (hd : derivative p = derivative q) (h0 : p.eval 0 = q.eval 0) : p = q := by
  have h : derivative (p - q) = 0 := by rw [derivative_sub, hd, sub_self]
  obtain ⟨c, hc⟩ := natDegree_eq_zero.1 (natDegree_eq_zero_of_derivative_eq_zero h)
  have hc0 : c = 0 := by
    have := congrArg (Polynomial.eval 0) hc
    simpa [h0] using this
  have hpq : p - q = 0 := by rw [← hc, hc0, map_zero]
  linear_combination (norm := ring_nf) hpq

/-- **Abel's binomial theorem**: `∑_k C(n,k) A_k(x) A_{n-k}(y) = A_n(x+y)`. -/
theorem abelSum_eq [IsDomain R] [CharZero R] (n : ℕ) (y : R) :
    abelSum R n y = (abelPoly R n).comp (X + C y) := by
  induction n with
  | zero => simp [abelSum]
  | succ N ih =>
      refine eq_of_derivative_eq_of_eval_zero ?_ ?_
      · rw [derivative_abelSum, ih, derivative_comp, derivative_abelPoly, mul_comp, C_comp,
          comp_assoc, comp_assoc]
        have h1 : ((X : R[X]) + C y).comp (X + 1) = (X + 1).comp (X + C y) := by
          simp [add_comm, add_assoc]
        rw [h1]
        simp
      · rw [eval_zero_abelSum, eval_comp]
        simp

/-- `t k = k^{k-1}` is the number of rooted labelled trees on `k` vertices (`t 0 = 0`). -/
noncomputable def treeCount (k : ℕ) : ℚ := if k = 0 then 0 else (k : ℚ) ^ (k - 1)

@[simp] lemma treeCount_zero : treeCount 0 = 0 := rfl

lemma treeCount_succ (k : ℕ) : treeCount (k + 1) = ((k : ℚ) + 1) ^ k := by
  simp [treeCount]

/-- The `x`-coefficient extraction of Abel's binomial theorem, as an identity of
polynomials in `y`. -/
theorem abel_deriv_poly (n : ℕ) :
    ∑ k ∈ range (n + 1), C ((n.choose k : ℚ) * treeCount k) * abelPoly ℚ (n - k)
      = derivative (abelPoly ℚ n) := by
  apply Polynomial.funext
  intro y
  have h := congrArg (fun p : ℚ[X] => p.coeff 1) (abelSum_eq n y)
  simp only [abelSum, finset_sum_coeff, coeff_C_mul, coeff_one_abelPoly] at h
  rw [eval_finset_sum]
  have hR : ((abelPoly ℚ n).comp (X + C y)).coeff 1 = eval y (derivative (abelPoly ℚ n)) := by
    rw [← taylor_apply, taylor_coeff_one]
  rw [hR] at h
  rw [← h]
  refine Finset.sum_congr rfl (fun k _ => ?_)
  simp only [eval_mul, eval_C, treeCount]
  ring

/-- Abel's identity in the form
`∑_k C(n,k) k^{k-1} (n-k)^{n-k-1} = 2 (n-1) n^{n-2}`. -/
theorem abel_conv (n : ℕ) (hn : 1 ≤ n) :
    ∑ k ∈ range (n + 1), (n.choose k : ℚ) * treeCount k * treeCount (n - k)
      = 2 * ((n : ℚ) - 1) * (n : ℚ) ^ (n - 2) := by
  have h := congrArg (fun p : ℚ[X] => p.coeff 1) (abel_deriv_poly n)
  simp only [finset_sum_coeff, coeff_C_mul, coeff_one_abelPoly, coeff_derivative] at h
  -- left-hand sides agree
  have hL : ∑ k ∈ range (n + 1), (n.choose k : ℚ) * treeCount k * treeCount (n - k)
      = ∑ k ∈ range (n + 1), (n.choose k : ℚ) * treeCount k *
          (if n - k = 0 then 0 else ((n - k : ℕ) : ℚ) ^ (n - k - 1)) := by
    refine Finset.sum_congr rfl (fun k _ => ?_)
    simp [treeCount]
  rw [hL, h]
  -- now compute `coeff 2` of the Abel polynomial
  obtain ⟨m, rfl⟩ : ∃ m, n = m + 1 := ⟨n - 1, by omega⟩
  rw [abelPoly_succ]
  rw [Polynomial.coeff_X_mul]
  have hco : ((X + C ((m : ℚ) + 1)) ^ m).coeff 1 = (m : ℚ) * ((m : ℚ) + 1) ^ (m - 1) := by
    rw [Polynomial.coeff_X_add_C_pow]
    cases m with
    | zero => simp
    | succ p => simp [Nat.choose_one_right, mul_comm]
  rw [hco]
  push_cast
  cases m with
  | zero => norm_num
  | succ p =>
      simp only [Nat.add_sub_cancel]
      push_cast
      ring

/-- `u n = n^{n-1}/n!`, the coefficients of the tree function. -/
noncomputable def treeCoeff (n : ℕ) : ℚ := treeCount n / (n.factorial : ℚ)

@[simp] lemma treeCoeff_zero : treeCoeff 0 = 0 := by simp [treeCoeff]

@[simp] lemma treeCoeff_one : treeCoeff 1 = 1 := by simp [treeCoeff, treeCount]

lemma choose_treeCount (n k : ℕ) (hk : k ≤ n) :
    (n.choose k : ℚ) * treeCount k * treeCount (n - k)
      = (n.factorial : ℚ) * (treeCoeff k * treeCoeff (n - k)) := by
  have h := Nat.choose_mul_factorial_mul_factorial hk
  have h' : ((n.choose k : ℚ)) * (k.factorial : ℚ) * ((n - k).factorial : ℚ)
      = (n.factorial : ℚ) := by
    exact_mod_cast congrArg (fun m : ℕ => (m : ℚ)) h
  have hk0 : ((k.factorial : ℚ)) ≠ 0 := by positivity
  have hnk0 : (((n - k).factorial : ℚ)) ≠ 0 := by positivity
  simp only [treeCoeff]
  field_simp
  linear_combination (treeCount k * treeCount (n - k)) * h'

/-- The convolution identity satisfied by the tree-function coefficients:
`(n-1) u_n = ∑_{i<n} (n-i) u_i u_{n-i}`. -/
theorem treeCoeff_conv (n : ℕ) (hn : 1 ≤ n) :
    ((n : ℚ) - 1) * treeCoeff n
      = ∑ i ∈ range n, ((n : ℚ) - i) * treeCoeff i * treeCoeff (n - i) := by
  have hfac : ((n.factorial : ℚ)) ≠ 0 := by positivity
  have hS : ∑ k ∈ range (n + 1), treeCoeff k * treeCoeff (n - k)
      = 2 * ((n : ℚ) - 1) * (n : ℚ) ^ (n - 2) / (n.factorial : ℚ) := by
    have h := abel_conv n hn
    rw [Finset.sum_congr rfl
      (fun k hk => choose_treeCount n k (by simpa [Nat.lt_succ_iff] using hk))] at h
    rw [← Finset.mul_sum] at h
    field_simp at h ⊢
    linarith [h]
  set f : ℕ → ℚ := fun k => ((n : ℚ) - k) * treeCoeff k * treeCoeff (n - k) with hf
  have hrefl : ∑ k ∈ range (n + 1), f (n - k) = ∑ k ∈ range (n + 1), f k := by
    simpa using Finset.sum_range_reflect f (n + 1)
  have hB : ∑ k ∈ range (n + 1), f (n - k)
      = ∑ k ∈ range (n + 1), (k : ℚ) * treeCoeff k * treeCoeff (n - k) := by
    refine Finset.sum_congr rfl (fun k hk => ?_)
    have hkn : k ≤ n := by simpa [Nat.lt_succ_iff] using hk
    have h1 : n - (n - k) = k := by omega
    simp only [hf, h1]
    have h2 : ((n - k : ℕ) : ℚ) = (n : ℚ) - k := by push_cast [hkn]; ring
    rw [h2]
    ring
  have hsum : (∑ k ∈ range (n + 1), f k)
        + (∑ k ∈ range (n + 1), (k : ℚ) * treeCoeff k * treeCoeff (n - k))
      = (n : ℚ) * ∑ k ∈ range (n + 1), treeCoeff k * treeCoeff (n - k) := by
    rw [← Finset.sum_add_distrib, Finset.mul_sum]
    refine Finset.sum_congr rfl (fun k _ => ?_)
    simp only [hf]
    ring
  rw [← hB, hrefl] at hsum
  have hA : (∑ k ∈ range (n + 1), f k)
      = (n : ℚ) * (2 * ((n : ℚ) - 1) * (n : ℚ) ^ (n - 2) / (n.factorial : ℚ)) / 2 := by
    rw [hS] at hsum
    linarith [hsum]
  have hlast : ∑ k ∈ range (n + 1), f k = ∑ k ∈ range n, f k := by
    rw [Finset.sum_range_succ]
    simp [hf]
  rw [hlast] at hA
  rw [hA]
  have hnn : (n : ℚ) * (n : ℚ) ^ (n - 2) = (n : ℚ) ^ (n - 1) := by
    obtain ⟨m, rfl⟩ : ∃ m, n = m + 1 := ⟨n - 1, by omega⟩
    cases m with
    | zero => norm_num
    | succ p => simp [← pow_succ']
  rw [treeCoeff, treeCount, if_neg (by omega), ← hnn]
  field_simp

end RamanujanReversal
