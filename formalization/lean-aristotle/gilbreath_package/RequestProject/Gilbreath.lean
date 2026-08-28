import Mathlib

/-!
# The Gilbreath lemma package

Formalization of `job21_gilbreath_package.tex`: the mod-2 binomial transform for the
absolute-difference operator, the parity invariant, its unconditional instantiation at the
prime-gap row, the propagation fixed point (infinite and finite-prefix forms), finite-window
determinacy, the window-lock and infinite-lock corollaries, and the reduction step.

Nothing here assumes Gilbreath's conjecture.

Rows are modelled as infinite sequences `ℕ → ℕ`, and the absolute difference is `Nat.dist`.
-/

open scoped BigOperators

namespace Gilbreath

set_option autoImplicit false

/-- The absolute-difference operator on sequences: `(D a) i = |a (i+1) - a i|`. -/
def D (a : ℕ → ℕ) : ℕ → ℕ := fun i => Nat.dist (a (i + 1)) (a i)

@[simp] lemma D_apply (a : ℕ → ℕ) (i : ℕ) : D a i = Nat.dist (a (i + 1)) (a i) := rfl

/-- `D^[k] a` is the `k`-th row of the difference triangle of `a`. -/
lemma D_iterate_succ (a : ℕ → ℕ) (k : ℕ) : D^[k + 1] a = D^[k] (D a) :=
  Function.iterate_succ_apply D k a

/-! ### Casting to `ZMod 2` -/

lemma cast_dist (x y : ℕ) : ((Nat.dist x y : ℕ) : ZMod 2) = (x : ZMod 2) + (y : ZMod 2) := by
  have h2 : ((2 : ℕ) : ZMod 2) = 0 := by decide
  rcases le_total x y with h | h
  · rw [Nat.dist_eq_sub_of_le h, Nat.cast_sub h]
    have : ((y : ZMod 2) - x) - ((x : ZMod 2) + y) = -(((2 : ℕ) : ZMod 2) * x) := by
      push_cast
      ring
    rw [h2] at this
    linear_combination this
  · rw [Nat.dist_eq_sub_of_le_right h, Nat.cast_sub h]
    have : ((x : ZMod 2) - y) - ((x : ZMod 2) + y) = -(((2 : ℕ) : ZMod 2) * y) := by
      push_cast
      ring
    rw [h2] at this
    linear_combination this

lemma cast_D (a : ℕ → ℕ) (i : ℕ) :
    ((D a i : ℕ) : ZMod 2) = (a (i + 1) : ZMod 2) + (a i : ZMod 2) := by
  rw [D_apply, cast_dist]

/-! ### Lemma A1: the mod-2 binomial transform -/

/-- Lemma A1, stated in `ZMod 2`. -/
lemma A1_zmod (a : ℕ → ℕ) (k i : ℕ) :
    ((D^[k] a i : ℕ) : ZMod 2)
      = ∑ j ∈ Finset.range (k + 1), (k.choose j : ZMod 2) * (a (i + j) : ZMod 2) := by
  induction k generalizing a with
  | zero => simp
  | succ k ih =>
      rw [D_iterate_succ, ih (D a)]
      have hL : ∀ j : ℕ, ((D a (i + j) : ℕ) : ZMod 2)
          = (a (i + j + 1) : ZMod 2) + (a (i + j) : ZMod 2) := fun j => cast_D a (i + j)
      simp only [hL, mul_add]
      rw [Finset.sum_add_distrib]
      -- Right-hand side: peel off the `j = 0` term with `sum_range_succ'`.
      rw [Finset.sum_range_succ' (fun j => ((k + 1).choose j : ZMod 2) * (a (i + j) : ZMod 2))]
      -- Left-hand second sum: peel off the `j = 0` term as well.
      rw [Finset.sum_range_succ' (fun j => (k.choose j : ZMod 2) * (a (i + j) : ZMod 2))]
      have hstep : ∀ j : ℕ, a (i + j + 1) = a (i + (j + 1)) := by
        intro j; ring_nf
      simp only [hstep]
      have hlast : ∑ j ∈ Finset.range (k + 1),
            (k.choose (j + 1) : ZMod 2) * (a (i + (j + 1)) : ZMod 2)
          = ∑ j ∈ Finset.range k, (k.choose (j + 1) : ZMod 2) * (a (i + (j + 1)) : ZMod 2) := by
        rw [Finset.sum_range_succ]
        simp [Nat.choose_succ_self]
      rw [← hlast]
      have hpascal : ∀ j : ℕ, ((k + 1).choose (j + 1) : ZMod 2)
          = (k.choose j : ZMod 2) + (k.choose (j + 1) : ZMod 2) := by
        intro j
        rw [Nat.choose_succ_succ]
        push_cast
        ring
      simp only [hpascal, add_mul]
      rw [Finset.sum_add_distrib]
      simp only [Nat.choose_zero_right, Nat.cast_one, one_mul, Nat.add_zero]
      ring

/-- **Lemma A1 (mod-2 binomial transform).**  For all `k, i`,
`(Dᵏ a)(i) ≡ ∑_{j=0}^{k} C(k,j) · a(i+j)  (mod 2)`. -/
theorem A1_binomial_transform (a : ℕ → ℕ) (k i : ℕ) :
    D^[k] a i ≡ ∑ j ∈ Finset.range (k + 1), k.choose j * a (i + j) [MOD 2] := by
  have h := A1_zmod a k i
  rw [← ZMod.natCast_eq_natCast_iff]
  push_cast
  simpa using h

/-! ### Lemma A2: the parity invariant -/

/-- **Lemma A2 (parity invariant).**  If `a 0` is odd and `a j` is even for every `j ≥ 1`,
then `(Dᵏ a)(0)` is odd for every `k`. -/
theorem A2_parity_invariant (a : ℕ → ℕ) (h0 : Odd (a 0)) (h1 : ∀ j, 1 ≤ j → Even (a j))
    (k : ℕ) : Odd (D^[k] a 0) := by
  have hz : ((D^[k] a 0 : ℕ) : ZMod 2) = 1 := by
    rw [A1_zmod a k 0]
    rw [Finset.sum_range_succ' (fun j => (k.choose j : ZMod 2) * (a (0 + j) : ZMod 2))]
    have hvanish : ∀ j ∈ Finset.range k,
        (k.choose (j + 1) : ZMod 2) * (a (0 + (j + 1)) : ZMod 2) = 0 := by
      intro j _
      have : Even (a (0 + (j + 1))) := h1 _ (by omega)
      obtain ⟨t, ht⟩ := this
      rw [ht]
      have h2 : ((2 : ℕ) : ZMod 2) = 0 := by decide
      have : ((t + t : ℕ) : ZMod 2) = 0 := by
        have : (t + t : ℕ) = 2 * t := by ring
        rw [this]
        push_cast
        rw [show ((2 : ZMod 2)) = ((2 : ℕ) : ZMod 2) by norm_num, h2]
        ring
      rw [this, mul_zero]
    rw [Finset.sum_eq_zero hvanish]
    obtain ⟨t, ht⟩ := h0
    simp only [Nat.choose_zero_right, Nat.cast_one, one_mul, zero_add]
    rw [ht]
    have h2 : ((2 : ℕ) : ZMod 2) = 0 := by decide
    have : ((2 * t + 1 : ℕ) : ZMod 2) = 1 := by
      push_cast
      rw [show ((2 : ZMod 2)) = ((2 : ℕ) : ZMod 2) by norm_num, h2]
      ring
    simpa using this
  rw [Nat.odd_iff]
  have := (ZMod.natCast_eq_natCast_iff (D^[k] a 0) 1 2).mp (by simpa using hz)
  simpa [Nat.ModEq] using this

/-! ### Corollary A3: the prime instantiation -/

/-- The first row of the prime difference triangle: `g j = p_{j+2} - p_{j+1}`
(with `Nat.nth Nat.Prime` 0-indexed, `g j = nth Prime (j+1) - nth Prime j`). -/
noncomputable def primeGap (j : ℕ) : ℕ := Nat.nth Nat.Prime (j + 1) - Nat.nth Nat.Prime j

lemma primeGap_zero : primeGap 0 = 1 := by
  simp [primeGap, Nat.nth_prime_zero_eq_two, Nat.nth_prime_one_eq_three]

lemma odd_nth_prime (j : ℕ) (hj : 1 ≤ j) : Odd (Nat.nth Nat.Prime j) := by
  have hp : Nat.Prime (Nat.nth Nat.Prime j) := Nat.prime_nth_prime j
  have hge : j + 2 ≤ Nat.nth Nat.Prime j := Nat.add_two_le_nth_prime j
  exact hp.odd_of_ne_two (by omega)

lemma primeGap_even (j : ℕ) (hj : 1 ≤ j) : Even (primeGap j) := by
  have h1 : Odd (Nat.nth Nat.Prime j) := odd_nth_prime j hj
  have h2 : Odd (Nat.nth Nat.Prime (j + 1)) := odd_nth_prime (j + 1) (by omega)
  exact Nat.Odd.sub_odd h2 h1

/-- **Corollary A3 (prime instantiation, unconditional).**  Every leading entry
`(Dᵏ g)(0)` of the prime difference triangle, `g` being the row of prime gaps, is odd. -/
theorem A3_prime_leading_odd (k : ℕ) : Odd (D^[k] primeGap 0) := by
  refine A2_parity_invariant primeGap ?_ (fun j hj => primeGap_even j hj) k
  rw [primeGap_zero]
  exact odd_one

/-! ### Lemma B and B′: propagation -/

/-- **Lemma B (propagation fixed point).** -/
theorem B_propagation (a : ℕ → ℕ) (h0 : a 0 = 1) (h1 : ∀ i, 1 ≤ i → a i = 0 ∨ a i = 2) :
    D a 0 = 1 ∧ ∀ i, 1 ≤ i → D a i = 0 ∨ D a i = 2 := by
  constructor
  · have := h1 1 le_rfl
    rcases this with h | h <;> simp [D, h0, h, Nat.dist]
  · intro i hi
    have hA := h1 i hi
    have hB := h1 (i + 1) (by omega)
    rcases hA with hA | hA <;> rcases hB with hB | hB <;>
      simp [D, hA, hB, Nat.dist]

/-- **Lemma B′ (prefix form).**

The hypothesis `1 ≤ W` is needed: for `W = 0` the window hypothesis is vacuous, so nothing
is known about `a 1` and the conclusion `D a 0 = 1` can fail. -/
theorem B'_propagation_prefix (a : ℕ → ℕ) (W : ℕ) (hW : 1 ≤ W) (h0 : a 0 = 1)
    (h1 : ∀ i, 1 ≤ i → i ≤ W → a i = 0 ∨ a i = 2) :
    D a 0 = 1 ∧ ∀ i, 1 ≤ i → i ≤ W - 1 → D a i = 0 ∨ D a i = 2 := by
  constructor
  · have := h1 1 le_rfl hW
    rcases this with h | h <;> simp [D, h0, h, Nat.dist]
  · intro i hi hiW
    have hA := h1 i hi (by omega)
    have hB := h1 (i + 1) (by omega) (by omega)
    rcases hA with hA | hA <;> rcases hB with hB | hB <;>
      simp [D, hA, hB, Nat.dist]

/-! ### Lemma C: finite-window determinacy -/

/-- **Lemma C (finite-window determinacy).** -/
theorem C_window_determinacy (a b : ℕ → ℕ) (k i : ℕ)
    (h : ∀ i', i ≤ i' → i' ≤ i + k → a i' = b i') : D^[k] a i = D^[k] b i := by
  induction k generalizing a b with
  | zero => simpa using h i le_rfl (by omega)
  | succ k ih =>
      rw [D_iterate_succ, D_iterate_succ]
      refine ih (D a) (D b) ?_
      intro i' h1 h2
      simp only [D_apply]
      rw [h i' h1 (by omega), h (i' + 1) (by omega) (by omega)]

/-! ### Corollaries WL, IL, R -/

/-- **Corollary WL (window lock).** -/
theorem WL_window_lock (a : ℕ → ℕ) (W : ℕ) (h0 : a 0 = 1)
    (h1 : ∀ i, 1 ≤ i → i ≤ W → a i = 0 ∨ a i = 2) :
    ∀ m, m ≤ W → D^[m] a 0 = 1 := by
  intro m
  induction m generalizing a W with
  | zero => intro _; simpa using h0
  | succ m ih =>
      intro hm
      have hW : 1 ≤ W := by omega
      obtain ⟨hD0, hD1⟩ := B'_propagation_prefix a W hW h0 h1
      rw [D_iterate_succ]
      exact ih (D a) (W - 1) hD0 hD1 (by omega)

/-- **Lock certificate.**  The formal content of the source's `lockCertificate` report:
if row `r` of the difference triangle of `a` starts with `1` followed by a window of `W`
entries in `{0, 2}`, then every leading entry from row `r` through row `r + W`
(`guaranteedThrough = r + W`) equals `1`. -/
theorem WL_lock_certificate (a : ℕ → ℕ) (r W : ℕ) (h0 : D^[r] a 0 = 1)
    (h1 : ∀ i, 1 ≤ i → i ≤ W → D^[r] a i = 0 ∨ D^[r] a i = 2) :
    ∀ k, r ≤ k → k ≤ r + W → D^[k] a 0 = 1 := by
  intro k hrk hkW
  obtain ⟨m, rfl⟩ := Nat.exists_eq_add_of_le hrk
  rw [Nat.add_comm, Function.iterate_add_apply]
  exact WL_window_lock (D^[r] a) W h0 h1 m (by omega)

/-- **Corollary IL (infinite lock).** -/
theorem IL_infinite_lock (a : ℕ → ℕ) (h0 : a 0 = 1)
    (h1 : ∀ i, 1 ≤ i → a i = 0 ∨ a i = 2) : ∀ m, D^[m] a 0 = 1 := by
  intro m
  induction m generalizing a with
  | zero => simpa using h0
  | succ m ih =>
      obtain ⟨hD0, hD1⟩ := B_propagation a h0 h1
      rw [D_iterate_succ]
      exact ih (D a) hD0 hD1

/-- **Corollary R (reduction step), elementary form.** -/
theorem R_odd_le_two {n : ℕ} (hodd : Odd n) (hle : n ≤ 2) : n = 1 := by
  rw [Nat.odd_iff] at hodd
  omega

/-- **Corollary R (reduction step).** -/
theorem R_reduction (a : ℕ → ℕ) (h : ∀ k, Odd (D^[k] a 0)) :
    (∀ k, D^[k] a 0 ≤ 2) ↔ (∀ k, D^[k] a 0 = 1) := by
  constructor
  · intro hk k; exact R_odd_le_two (h k) (hk k)
  · intro hk k; rw [hk k]; omega

/-- **Corollary R at the prime triangle** (A3 combined with R): the leading entries of the
prime difference triangle are bounded by `2` if and only if they are all equal to `1`. -/
theorem R_reduction_prime :
    (∀ k, D^[k] primeGap 0 ≤ 2) ↔ (∀ k, D^[k] primeGap 0 = 1) :=
  R_reduction primeGap A3_prime_leading_odd

end Gilbreath
