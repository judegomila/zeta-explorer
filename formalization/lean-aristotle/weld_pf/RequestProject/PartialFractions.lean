import RequestProject.Defs

/-!
# The algebraic partial-fraction expansion

The core identity is `pf_expansion`: for `X ≠ 0`, `D ≠ 0`, `X + D ≠ 0` and `m + n > 0`,

`1/(X^m (X+D)^n) = ∑_{j<m} (-1)^j C(n+j-1,j) D^{-(n+j)} X^{-(m-j)}
                   + ∑_{i<n} (-1)^i C(m+i-1,i) (-D)^{-(m+i)} (X+D)^{-(n-i)}`.

Specializing at `m = n = s`, `X = t + a`, `D = b - a` gives the repeated-linear-factor
decomposition of the source display, with the coefficients `cCoeff`, `dCoeff`.
-/

open scoped BigOperators

namespace WeldPF

/-- The `X`-side sum of the partial-fraction expansion. -/
noncomputable def Asum (m n : ℕ) (X D : ℝ) : ℝ :=
  ∑ j ∈ Finset.range m,
    (-1) ^ j * (Nat.choose (n + j - 1) j : ℝ) * D ^ (-((n : ℤ) + j)) * X ^ (-((m : ℤ) - j))

lemma Asum_zero (n : ℕ) (X D : ℝ) : Asum 0 n X D = 0 := by
  simp [Asum]

/-- With no `(X+D)` factor, the expansion is trivial. -/
lemma Asum_eq_of_n_zero {m : ℕ} (hm : 0 < m) (X D : ℝ) :
    Asum m 0 X D = (X ^ m)⁻¹ := by
  rw [Asum, Finset.sum_eq_single 0]
  · simp [zpow_neg, zpow_natCast]
  · intro j _ hj
    have h0 : Nat.choose (j - 1) j = 0 := by
      have hj' : 1 ≤ j := Nat.one_le_iff_ne_zero.mpr hj
      exact Nat.choose_eq_zero_of_lt (by omega)
    simp [h0]
  · intro h
    exact absurd (Finset.mem_range.mpr hm) h

/-- An abstract shifting lemma for the Pascal recursion below. -/
lemma sum_shift_aux {f g h : ℕ → ℝ} {D : ℝ} (m : ℕ) (h0 : D⁻¹ * f 0 = h 0)
    (hstep : ∀ j, D⁻¹ * (f (j + 1) - g j) = h (j + 1)) :
    D⁻¹ * ((∑ j ∈ Finset.range (m + 1), f j) - ∑ j ∈ Finset.range m, g j)
      = ∑ j ∈ Finset.range (m + 1), h j := by
  rw [Finset.sum_range_succ' f, Finset.sum_range_succ' h]
  have : D⁻¹ * ((∑ j ∈ Finset.range m, f (j + 1)) + f 0 - ∑ j ∈ Finset.range m, g j)
      = (∑ j ∈ Finset.range m, D⁻¹ * (f (j + 1) - g j)) + D⁻¹ * f 0 := by
    simp only [mul_sub, mul_add, Finset.sum_sub_distrib, ← Finset.mul_sum]
    ring
  rw [this, h0]
  congr 1
  exact Finset.sum_congr rfl fun j _ => hstep j

/-- The key recursion for the `X`-side sums, coming from Pascal's rule. -/
lemma Asum_step (m n : ℕ) {X D : ℝ} (hD : D ≠ 0) :
    D⁻¹ * (Asum (m + 1) n X D - Asum m (n + 1) X D) = Asum (m + 1) (n + 1) X D := by
  simp only [Asum]
  refine sum_shift_aux (D := D) m ?_ ?_
  · simp only [pow_zero, Nat.choose_zero_right, Nat.cast_one, Nat.cast_zero, one_mul, mul_one,
      add_zero, sub_zero, Nat.cast_add]
    rw [show (-((n : ℤ) + 1)) = -(n : ℤ) + (-1) by ring, zpow_add₀ hD, zpow_neg_one]
    ring
  · intro j
    have hc : (n + 1 + (j + 1) - 1).choose (j + 1)
        = (n + j).choose j + (n + j).choose (j + 1) := by
      have h : n + 1 + (j + 1) - 1 = (n + j) + 1 := by omega
      rw [h, Nat.choose_succ_succ]
    have h1 : n + (j + 1) - 1 = n + j := by omega
    have h2 : n + 1 + j - 1 = n + j := by omega
    rw [hc, h1, h2]
    push_cast
    rw [show (-((n : ℤ) + (j + 1))) = (-((n : ℤ) + 1 + j)) by ring]
    rw [show (-((n : ℤ) + 1 + (j + 1))) = (-((n : ℤ) + 1 + j)) + (-1) by ring, zpow_add₀ hD,
      zpow_neg_one]
    rw [show (-(((m : ℤ) + 1) - (j + 1))) = -((m : ℤ) - j) by ring]
    ring

/-- Core partial-fraction expansion (repeated linear factors, general exponents). -/
theorem pf_expansion (m : ℕ) : ∀ (n : ℕ), 0 < m + n → ∀ {X D : ℝ}, X ≠ 0 → D ≠ 0 → X + D ≠ 0 →
    (X ^ m * (X + D) ^ n)⁻¹ = Asum m n X D + Asum n m (X + D) (-D) := by
  induction m with
  | zero =>
    intro n hn X D hX hD hY
    have hn' : 0 < n := by omega
    rw [Asum_zero, Asum_eq_of_n_zero hn' (X + D) (-D)]
    simp
  | succ m ih =>
    intro n
    induction n with
    | zero =>
      intro _ X D hX hD hY
      rw [Asum_zero, Asum_eq_of_n_zero (Nat.succ_pos m) X D]
      simp
    | succ n ihn =>
      intro _ X D hX hD hY
      have h1 := ihn (by omega) hX hD hY
      have h2 := ih (n + 1) (by omega) hX hD hY
      have key : (X ^ (m + 1) * (X + D) ^ (n + 1))⁻¹
          = D⁻¹ * ((X ^ (m + 1) * (X + D) ^ n)⁻¹ - (X ^ m * (X + D) ^ (n + 1))⁻¹) := by
        have hXm : X ^ m ≠ 0 := pow_ne_zero _ hX
        have hYn : (X + D) ^ n ≠ 0 := pow_ne_zero _ hY
        field_simp
        ring
      have s1 := Asum_step m n (X := X) hD
      have s2 := Asum_step n m (X := X + D) (D := -D) (neg_ne_zero.mpr hD)
      rw [inv_neg] at s2
      rw [key, h1, h2]
      linear_combination s1 + s2

/-- Reindexing `Asum s s` by `k = s - j`: this produces exactly the coefficients `c_k`. -/
lemma Asum_diag_eq (s : ℕ) (X D : ℝ) :
    Asum s s X D = ∑ k ∈ Finset.Icc 1 s,
      ((-1) ^ (s - k) * (Nat.choose (2 * s - k - 1) (s - k) : ℝ) * D ^ (-(2 * (s : ℤ) - k)))
        * X ^ (-(k : ℤ)) := by
  rw [Asum]
  refine Finset.sum_nbij' (fun j => s - j) (fun k => s - k) ?_ ?_ ?_ ?_ ?_ <;>
    intro j hj <;> simp only [Finset.mem_range, Finset.mem_Icc] at hj ⊢
  · omega
  · omega
  · omega
  · omega
  · have h1 : s - (s - j) = j := by omega
    have h2 : 2 * s - (s - j) - 1 = s + j - 1 := by omega
    have h3 : ((s - j : ℕ) : ℤ) = (s : ℤ) - j := by
      have : j ≤ s := le_of_lt hj
      push_cast [this]
      ring
    rw [h1, h2, h3]
    congr 2
    ring_nf

/-- `(-1)^a = (-1)^b` when `a` and `b` have the same parity. -/
lemma neg_one_pow_eq_of_mod {a b : ℕ} (h : a % 2 = b % 2) : ((-1 : ℝ)) ^ a = (-1) ^ b := by
  rcases Nat.even_or_odd a with ha | ha
  · have hb : Even b := by rw [Nat.even_iff] at *; omega
    rw [ha.neg_one_pow, hb.neg_one_pow]
  · have hb : Odd b := by rw [Nat.odd_iff] at *; omega
    rw [ha.neg_one_pow, hb.neg_one_pow]

/-- Negative integer powers of `-1` agree with the corresponding natural powers. -/
lemma neg_one_zpow_neg_natCast (n : ℕ) : ((-1 : ℝ)) ^ (-(n : ℤ)) = (-1) ^ n := by
  rw [zpow_neg, zpow_natCast]
  rcases Nat.even_or_odd n with hn | hn
  · rw [hn.neg_one_pow]; norm_num
  · rw [hn.neg_one_pow]; norm_num

/-- The partial-fraction decomposition at integer `s`, in the form of the source display:
`(t+a)^{-s} (t+b)^{-s} = ∑_{k=1}^s c_k (t+a)^{-k} + d_k (t+b)^{-k}`. -/
theorem pf_at_s {s : ℕ} (hs : 0 < s) {t a b : ℝ} (ha : t + a ≠ 0) (hb : t + b ≠ 0) (hab : a ≠ b) :
    ((t + a) ^ s * (t + b) ^ s)⁻¹ =
      ∑ k ∈ Finset.Icc 1 s,
        (cCoeff s k a b * (t + a) ^ (-(k : ℤ)) + dCoeff s k a b * (t + b) ^ (-(k : ℤ))) := by
  have hD : b - a ≠ 0 := sub_ne_zero.mpr (Ne.symm hab)
  have hXY : (t + a) + (b - a) = t + b := by ring
  have h := pf_expansion s s (by omega) (X := t + a) (D := b - a) ha hD (by rw [hXY]; exact hb)
  rw [hXY] at h
  rw [h, Asum_diag_eq, Asum_diag_eq, ← Finset.sum_add_distrib]
  refine Finset.sum_congr rfl fun k _ => ?_
  have hneg : -(b - a) = a - b := by ring
  rw [hneg]
  simp only [cCoeff, dCoeff]

/-- The finite-piece decomposition: with `S = a + c` and `p_k = binom(2s-k-1,s-k) S^{-(2s-k)}`,
`(x+a)^{-s} (c-x)^{-s} = ∑_{k=1}^s p_k ((x+a)^{-k} + (c-x)^{-k})`. -/
theorem pf_finite {s : ℕ} (hs : 0 < s) {x a c : ℝ} (ha : x + a ≠ 0) (hc : c - x ≠ 0)
    (hS : a + c ≠ 0) :
    ((x + a) ^ s * (c - x) ^ s)⁻¹ =
      ∑ k ∈ Finset.Icc 1 s,
        pCoeff s k (a + c) * ((x + a) ^ (-(k : ℤ)) + (c - x) ^ (-(k : ℤ))) := by
  have hxc : x + -c = -(c - x) := by ring
  have hb : x + -c ≠ 0 := by rw [hxc]; exact neg_ne_zero.mpr hc
  have hab : a ≠ -c := by
    intro hcon; apply hS; rw [hcon]; ring
  have h := pf_at_s hs (t := x) (a := a) (b := -c) ha hb hab
  have hss : ((-1 : ℝ) ^ s) * ((-1 : ℝ) ^ s) = 1 := by
    rw [← mul_pow]; norm_num
  have hinv : ((-1 : ℝ) ^ s)⁻¹ = (-1 : ℝ) ^ s :=
    eq_comm.mp (eq_inv_of_mul_eq_one_left hss)
  have hL : ((x + a) ^ s * (x + -c) ^ s)⁻¹ = (-1 : ℝ) ^ s * ((x + a) ^ s * (c - x) ^ s)⁻¹ := by
    rw [hxc, neg_pow, mul_inv, mul_inv, hinv]
    ring
  rw [hL] at h
  have hgoal : ((x + a) ^ s * (c - x) ^ s)⁻¹
      = (-1 : ℝ) ^ s * ∑ k ∈ Finset.Icc 1 s,
          (cCoeff s k a (-c) * (x + a) ^ (-(k : ℤ))
            + dCoeff s k a (-c) * (x + -c) ^ (-(k : ℤ))) := by
    rw [← h, ← mul_assoc, hss, one_mul]
  rw [hgoal, Finset.mul_sum]
  refine Finset.sum_congr rfl fun k hk => ?_
  simp only [Finset.mem_Icc] at hk
  obtain ⟨hk1, hks⟩ := hk
  simp only [cCoeff, dCoeff, pCoeff]
  have e1 : -c - a = (-1 : ℝ) * (a + c) := by ring
  have e2 : a - -c = a + c := by ring
  have hxc' : x + -c = (-1 : ℝ) * (c - x) := by rw [hxc]; ring
  rw [e1, e2, hxc', mul_zpow, mul_zpow]
  have hz1 : ((-1 : ℝ)) ^ (-(2 * (s : ℤ) - k)) = (-1 : ℝ) ^ k := by
    have h3 : (2 * (s : ℤ) - k) = ((2 * s - k : ℕ) : ℤ) := by
      have : k ≤ 2 * s := by omega
      push_cast [Nat.cast_sub this]; ring
    rw [h3, neg_one_zpow_neg_natCast]
    exact neg_one_pow_eq_of_mod (by omega)
  have hz2 : ((-1 : ℝ)) ^ (-(k : ℤ)) = (-1 : ℝ) ^ k := neg_one_zpow_neg_natCast k
  have hz3 : ((-1 : ℝ)) ^ (s - k) = (-1 : ℝ) ^ s * (-1 : ℝ) ^ k := by
    rw [← pow_add]
    exact neg_one_pow_eq_of_mod (by omega)
  rw [hz1, hz2, hz3]
  rcases Nat.even_or_odd s with hs' | hs' <;> rcases Nat.even_or_odd k with hk' | hk' <;>
    simp [hs'.neg_one_pow, hk'.neg_one_pow] <;> ring

end WeldPF
