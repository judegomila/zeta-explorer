import RequestProject.MathlibBridge

/-!
# Degree truncation of real-rooted polynomials

Given a real polynomial `P` with only real roots and a target degree `m`, we build a
polynomial `truncScale m P` of degree at most `m` which again has only real roots and whose
coefficients are those of `P` multiplied by explicit weights `wgt m P.natDegree j ∈ [0, 1]`
that tend to `1` as `m → ∞` (uniformly in the degree of `P`).

The construction is: reverse the coefficient sequence, differentiate `natDegree P - m` times
(this kills the top `natDegree P - m` coefficients after reversing back, and is legitimate
because differentiation preserves real-rootedness by Rolle's theorem), reverse back, and
finally rescale the variable to compensate the resulting geometric distortion of the
coefficients.
-/

open Polynomial
open scoped Nat

namespace EntireLP

/-- Coefficientwise weight produced by `truncScale`, before the case distinctions. -/
noncomputable def wgtRaw (m M j : ℕ) : ℝ :=
  (m ! : ℝ) * ((M - j)! : ℝ) / ((M ! : ℝ) * ((m - j)! : ℝ)) * ((M : ℝ) / (m : ℝ)) ^ j

/-- The weight by which the `j`-th coefficient gets multiplied in `truncScale m P`, where
`M` is the degree of `P`. -/
noncomputable def wgt (m M j : ℕ) : ℝ :=
  if M ≤ m then 1 else if j ≤ m then wgtRaw m M j else 0

theorem wgtRaw_self (m j : ℕ) (hm : 1 ≤ m) : wgtRaw m m j = 1 := by
  have hm0 : (m : ℝ) ≠ 0 := by
    have : (0 : ℝ) < (m : ℝ) := by exact_mod_cast hm
    exact ne_of_gt this
  have h1 : ((m ! : ℕ) : ℝ) ≠ 0 := Nat.cast_ne_zero.2 (Nat.factorial_ne_zero m)
  have h2 : (((m - j)! : ℕ) : ℝ) ≠ 0 := Nat.cast_ne_zero.2 (Nat.factorial_ne_zero _)
  unfold wgtRaw
  rw [div_self hm0, one_pow, mul_one]
  field_simp

theorem wgtRaw_nonneg (m M j : ℕ) : 0 ≤ wgtRaw m M j := by
  unfold wgtRaw
  have h1 : (0 : ℝ) ≤ (m ! : ℝ) * ((M - j)! : ℝ) / ((M ! : ℝ) * ((m - j)! : ℝ)) := by positivity
  have h2 : (0 : ℝ) ≤ ((M : ℝ) / (m : ℝ)) ^ j := by positivity
  exact mul_nonneg h1 h2

/-- The recursion satisfied by the raw weights when the degree `M` increases by one. -/
theorem wgtRaw_succ (m M j : ℕ) (hj : j ≤ M) (hM : 1 ≤ M) :
    wgtRaw m (M + 1) j
      = wgtRaw m M j * (((M : ℝ) + 1 - j) / ((M : ℝ) + 1)) * ((((M : ℝ) + 1) / (M : ℝ)) ^ j) := by
  have hM0 : (0 : ℝ) < (M : ℝ) := by exact_mod_cast hM
  have hfac : (((M + 1 - j)! : ℕ) : ℝ) = ((M : ℝ) + 1 - j) * (((M - j)! : ℕ) : ℝ) := by
    have h : M + 1 - j = (M - j) + 1 := by omega
    rw [h, Nat.factorial_succ]
    push_cast [Nat.cast_sub hj]
    ring
  have hfac2 : (((M + 1)! : ℕ) : ℝ) = ((M : ℝ) + 1) * ((M ! : ℕ) : ℝ) := by
    rw [Nat.factorial_succ]; push_cast; ring
  have hpow : (((M : ℝ) + 1) / (m : ℝ)) ^ j
      = ((M : ℝ) / (m : ℝ)) ^ j * ((((M : ℝ) + 1) / (M : ℝ)) ^ j) := by
    rw [← mul_pow]
    congr 1
    field_simp
  have hmf : ((m ! : ℕ) : ℝ) ≠ 0 := Nat.cast_ne_zero.2 (Nat.factorial_ne_zero _)
  have hMf : ((M ! : ℕ) : ℝ) ≠ 0 := Nat.cast_ne_zero.2 (Nat.factorial_ne_zero _)
  have hmj : (((m - j)! : ℕ) : ℝ) ≠ 0 := Nat.cast_ne_zero.2 (Nat.factorial_ne_zero _)
  have hMj : (((M - j)! : ℕ) : ℝ) ≠ 0 := Nat.cast_ne_zero.2 (Nat.factorial_ne_zero _)
  unfold wgtRaw
  push_cast
  rw [hfac, hfac2, hpow]
  field_simp

/-- Bernoulli-type bound: the one-step factor in `wgtRaw_succ` is at most one. -/
theorem step_le_one (M j : ℕ) (hM : 1 ≤ M) :
    (((M : ℝ) + 1 - j) / ((M : ℝ) + 1)) * ((((M : ℝ) + 1) / (M : ℝ)) ^ j) ≤ 1 := by
  have hM0 : (0 : ℝ) < (M : ℝ) := by exact_mod_cast hM
  have hM1 : (0 : ℝ) < (M : ℝ) + 1 := by linarith
  have hsmall : 1 / ((M : ℝ) + 1) ≤ 1 := by
    rw [div_le_one hM1]; linarith
  have hb : 1 + (j : ℝ) * (-(1 / ((M : ℝ) + 1))) ≤ (1 + (-(1 / ((M : ℝ) + 1)))) ^ j := by
    refine one_add_mul_le_pow ?_ j
    linarith
  have hrw : (1 : ℝ) + (-(1 / ((M : ℝ) + 1))) = (M : ℝ) / ((M : ℝ) + 1) := by
    field_simp
    ring
  rw [hrw] at hb
  have hb' : ((M : ℝ) + 1 - j) / ((M : ℝ) + 1) ≤ ((M : ℝ) / ((M : ℝ) + 1)) ^ j := by
    calc ((M : ℝ) + 1 - j) / ((M : ℝ) + 1) = 1 + (j : ℝ) * (-(1 / ((M : ℝ) + 1))) := by
          field_simp
          ring
      _ ≤ _ := hb
  have hpos : (0 : ℝ) < (((M : ℝ) + 1) / (M : ℝ)) ^ j := by positivity
  calc (((M : ℝ) + 1 - j) / ((M : ℝ) + 1)) * ((((M : ℝ) + 1) / (M : ℝ)) ^ j)
      ≤ (((M : ℝ) / ((M : ℝ) + 1)) ^ j) * ((((M : ℝ) + 1) / (M : ℝ)) ^ j) :=
        mul_le_mul_of_nonneg_right hb' (le_of_lt hpos)
    _ = 1 := by
        rw [← mul_pow, div_mul_div_comm, mul_comm ((M : ℝ)) ((M : ℝ) + 1),
          div_self (by positivity), one_pow]

/-- Lower bound for the one-step factor in `wgtRaw_succ`. -/
theorem step_ge (M j : ℕ) (hM : 1 ≤ M) (hjM : j ≤ M) :
    1 - (j : ℝ) ^ 2 / ((M : ℝ) * ((M : ℝ) + 1))
      ≤ (((M : ℝ) + 1 - j) / ((M : ℝ) + 1)) * ((((M : ℝ) + 1) / (M : ℝ)) ^ j) := by
  have hM0 : (0 : ℝ) < (M : ℝ) := by exact_mod_cast hM
  have hM1 : (0 : ℝ) < (M : ℝ) + 1 := by linarith
  have hjR : (j : ℝ) ≤ (M : ℝ) := by exact_mod_cast hjM
  have hb : 1 + (j : ℝ) * (1 / (M : ℝ)) ≤ (1 + 1 / (M : ℝ)) ^ j := by
    refine one_add_mul_le_pow ?_ j
    have : (0:ℝ) < 1 / (M : ℝ) := by positivity
    linarith
  have hrw : (1 : ℝ) + 1 / (M : ℝ) = ((M : ℝ) + 1) / (M : ℝ) := by field_simp
  rw [hrw] at hb
  have hfac : (0 : ℝ) ≤ ((M : ℝ) + 1 - j) / ((M : ℝ) + 1) := by
    apply div_nonneg (by linarith) (le_of_lt hM1)
  have hstep : (((M : ℝ) + 1 - j) / ((M : ℝ) + 1)) * (1 + (j : ℝ) / (M : ℝ))
      ≤ (((M : ℝ) + 1 - j) / ((M : ℝ) + 1)) * ((((M : ℝ) + 1) / (M : ℝ)) ^ j) := by
    refine mul_le_mul_of_nonneg_left ?_ hfac
    calc 1 + (j : ℝ) / (M : ℝ) = 1 + (j : ℝ) * (1 / (M : ℝ)) := by ring
      _ ≤ _ := hb
  refine le_trans ?_ hstep
  rw [div_mul_eq_mul_div, le_div_iff₀ hM1]
  have hexp : ((M : ℝ) + 1 - j) * (1 + (j : ℝ) / (M : ℝ))
      = ((M : ℝ) + 1) - (j : ℝ) ^ 2 / (M : ℝ) + (j : ℝ) / (M : ℝ) := by
    field_simp
    ring
  rw [hexp]
  have h1 : (1 - (j : ℝ) ^ 2 / ((M : ℝ) * ((M : ℝ) + 1))) * ((M : ℝ) + 1)
      = ((M : ℝ) + 1) - (j : ℝ) ^ 2 / (M : ℝ) := by
    field_simp
  rw [h1]
  have : (0 : ℝ) ≤ (j : ℝ) / (M : ℝ) := by positivity
  linarith

/-- Two-sided bounds for the raw weights. -/
theorem wgtRaw_bounds (m j : ℕ) (hm : 1 ≤ m) (hj : j ≤ m) :
    ∀ M, m ≤ M → wgtRaw m M j ≤ 1 ∧
      1 - (j : ℝ) ^ 2 * (1 / (m : ℝ) - 1 / (M : ℝ)) ≤ wgtRaw m M j := by
  intro M hM
  induction M, hM using Nat.le_induction with
  | base =>
      refine ⟨le_of_eq (wgtRaw_self m j hm), ?_⟩
      rw [wgtRaw_self m j hm]
      simp
  | succ M hM ih =>
      obtain ⟨ihu, ihl⟩ := ih
      have hM1 : 1 ≤ M := le_trans hm hM
      have hM0 : (0 : ℝ) < (M : ℝ) := by exact_mod_cast hM1
      have hjM : j ≤ M := le_trans hj hM
      have hjR : (j : ℝ) ≤ (M : ℝ) := by exact_mod_cast hjM
      have hjnn : (0 : ℝ) ≤ (j : ℝ) := Nat.cast_nonneg j
      have hrec := wgtRaw_succ m M j hjM hM1
      have hstepu := step_le_one M j hM1
      have hstepl := step_ge M j hM1 hjM
      have hnn := wgtRaw_nonneg m M j
      set S : ℝ := (((M : ℝ) + 1 - j) / ((M : ℝ) + 1)) * ((((M : ℝ) + 1) / (M : ℝ)) ^ j) with hS
      have hrec' : wgtRaw m (M + 1) j = wgtRaw m M j * S := by rw [hrec, hS]; ring
      have hbnn : (0 : ℝ) ≤ 1 - (j : ℝ) ^ 2 / ((M : ℝ) * ((M : ℝ) + 1)) := by
        rw [sub_nonneg, div_le_one (by positivity)]
        nlinarith
      have hSnn : 0 ≤ S := le_trans hbnn hstepl
      refine ⟨?_, ?_⟩
      · rw [hrec']
        calc wgtRaw m M j * S ≤ 1 * 1 := mul_le_mul ihu hstepu hSnn zero_le_one
          _ = 1 := by ring
      · rw [hrec']
        rcases le_or_gt (1 - (j : ℝ) ^ 2 * (1 / (m : ℝ) - 1 / (M : ℝ))) 0 with hneg | hpos
        · have hmono : 1 - (j : ℝ) ^ 2 * (1 / (m : ℝ) - 1 / ((M : ℝ) + 1))
              ≤ 1 - (j : ℝ) ^ 2 * (1 / (m : ℝ) - 1 / (M : ℝ)) := by
            have h1 : 1 / ((M : ℝ) + 1) ≤ 1 / (M : ℝ) :=
              one_div_le_one_div_of_le hM0 (by linarith)
            nlinarith [sq_nonneg (j : ℝ)]
          have hprod : (0 : ℝ) ≤ wgtRaw m M j * S := mul_nonneg hnn hSnn
          push_cast
          linarith
        · have h1 : (1 - (j : ℝ) ^ 2 * (1 / (m : ℝ) - 1 / (M : ℝ)))
              * (1 - (j : ℝ) ^ 2 / ((M : ℝ) * ((M : ℝ) + 1)))
              ≤ wgtRaw m M j * S := mul_le_mul ihl hstepl hbnn hnn
          refine le_trans ?_ h1
          have hid : (1 - (j : ℝ) ^ 2 * (1 / (m : ℝ) - 1 / ((M : ℝ) + 1)))
              = 1 - (j : ℝ) ^ 2 * (1 / (m : ℝ) - 1 / (M : ℝ))
                - (j : ℝ) ^ 2 / ((M : ℝ) * ((M : ℝ) + 1)) := by
            field_simp
            ring
          push_cast
          rw [hid]
          nlinarith [sq_nonneg ((j : ℝ) ^ 2 * (1 / (m : ℝ) - 1 / (M : ℝ)))]

theorem wgt_nonneg (m M j : ℕ) : 0 ≤ wgt m M j := by
  unfold wgt
  split_ifs
  · exact zero_le_one
  · exact wgtRaw_nonneg m M j
  · exact le_refl 0

theorem wgt_le_one (m M j : ℕ) (hm : 1 ≤ m) (hj : j ≤ m) : wgt m M j ≤ 1 := by
  unfold wgt
  split_ifs with h1
  · exact le_refl 1
  · exact (wgtRaw_bounds m j hm hj M (le_of_not_ge h1)).1

theorem one_sub_wgt_le (m M j : ℕ) (hm : 1 ≤ m) (hj : j ≤ m) :
    1 - wgt m M j ≤ (j : ℝ) ^ 2 / (m : ℝ) := by
  unfold wgt
  have hm0 : (0 : ℝ) < (m : ℝ) := by exact_mod_cast hm
  split_ifs with h1
  · have : (0 : ℝ) ≤ (j : ℝ) ^ 2 / (m : ℝ) := by positivity
    linarith
  · have hMm : m ≤ M := le_of_not_ge h1
    have hM1 : 1 ≤ M := le_trans hm hMm
    have hM0 : (0 : ℝ) < (M : ℝ) := by exact_mod_cast hM1
    have hb := (wgtRaw_bounds m j hm hj M hMm).2
    have hpos : (0:ℝ) ≤ (j : ℝ) ^ 2 * (1 / (M : ℝ)) := by positivity
    have hstep : 1 - wgtRaw m M j ≤ (j : ℝ) ^ 2 * (1 / (m : ℝ)) - (j : ℝ) ^ 2 * (1 / (M : ℝ)) := by
      nlinarith
    have hrw : (j : ℝ) ^ 2 * (1 / (m : ℝ)) = (j : ℝ) ^ 2 / (m : ℝ) := by ring
    linarith

/-! ### The truncation operator -/

/-- `truncScale m P` is a polynomial of degree at most `m` with only real roots whenever `P`
has only real roots; its `j`-th coefficient is `wgt m P.natDegree j * P.coeff j`. -/
noncomputable def truncScale (m : ℕ) (P : ℝ[X]) : ℝ[X] :=
  if P.natDegree ≤ m then P
  else C ((m ! : ℝ) / (P.natDegree ! : ℝ)) *
    ((reflect m ((⇑derivative)^[P.natDegree - m] (reflect P.natDegree P))).comp
      (C ((P.natDegree : ℝ) / (m : ℝ)) * X))

theorem coeff_comp_C_mul_X (p : ℝ[X]) (a : ℝ) (j : ℕ) :
    (p.comp (C a * X)).coeff j = a ^ j * p.coeff j := by
  induction p using Polynomial.induction_on' with
  | add p q hp hq => simp [add_comp, hp, hq, mul_add]
  | monomial n c =>
      rw [Polynomial.monomial_comp, mul_pow, ← C_pow]
      simp only [Polynomial.coeff_C_mul, Polynomial.coeff_X_pow, Polynomial.coeff_monomial]
      rcases eq_or_ne j n with rfl | h
      · simp; ring
      · simp [h, Ne.symm h]

/-- Degree bound for the intermediate polynomial appearing in `truncScale`. -/
theorem natDegree_iterate_reflect_le (m : ℕ) (P : ℝ[X]) (h : m ≤ P.natDegree) :
    ((⇑derivative)^[P.natDegree - m] (reflect P.natDegree P)).natDegree ≤ m := by
  have h1 : (reflect P.natDegree P).natDegree ≤ P.natDegree := by
    refine le_trans Polynomial.natDegree_reflect_le ?_
    simp
  have h2 := Polynomial.natDegree_iterate_derivative (reflect P.natDegree P) (P.natDegree - m)
  omega

theorem coeff_truncScale (m : ℕ) (P : ℝ[X]) (j : ℕ) :
    (truncScale m P).coeff j = wgt m P.natDegree j * P.coeff j := by
  unfold truncScale wgt
  split_ifs with h1 h2
  · rw [one_mul]
  · -- the interesting case: the degree exceeds `m` and `j ≤ m`
    have hMm : m < P.natDegree := lt_of_not_ge h1
    have hjM : j ≤ P.natDegree := le_trans h2 (le_of_lt hMm)
    rw [Polynomial.coeff_C_mul, coeff_comp_C_mul_X, Polynomial.coeff_reflect,
      Polynomial.revAt_le h2, Polynomial.coeff_iterate_derivative]
    have hidx : m - j + (P.natDegree - m) = P.natDegree - j := by omega
    rw [hidx, Polynomial.coeff_reflect, Polynomial.revAt_le (by omega : P.natDegree - j ≤ P.natDegree)]
    have hsub : P.natDegree - (P.natDegree - j) = j := by omega
    rw [hsub]
    -- now a purely arithmetic identity
    have hdesc : (((P.natDegree - j).descFactorial (P.natDegree - m) : ℕ) : ℝ)
        = ((P.natDegree - j)! : ℝ) / ((m - j)! : ℝ) := by
      have hle : P.natDegree - m ≤ P.natDegree - j := by omega
      have hkey := Nat.factorial_mul_descFactorial hle
      have heq : P.natDegree - j - (P.natDegree - m) = m - j := by omega
      rw [heq] at hkey
      have hmj : (((m - j)! : ℕ) : ℝ) ≠ 0 := Nat.cast_ne_zero.2 (Nat.factorial_ne_zero _)
      field_simp
      rw [mul_comm]
      exact_mod_cast hkey
    rw [nsmul_eq_mul, hdesc]
    unfold wgtRaw
    have hMf : (((P.natDegree)! : ℕ) : ℝ) ≠ 0 := Nat.cast_ne_zero.2 (Nat.factorial_ne_zero _)
    have hmj : (((m - j)! : ℕ) : ℝ) ≠ 0 := Nat.cast_ne_zero.2 (Nat.factorial_ne_zero _)
    field_simp
  · -- coefficients beyond `m` vanish
    have hMm : m < P.natDegree := lt_of_not_ge h1
    have hjm : m < j := lt_of_not_ge h2
    rw [Polynomial.coeff_C_mul, coeff_comp_C_mul_X, Polynomial.coeff_reflect,
      Polynomial.revAt_eq_self_of_lt hjm]
    have hdeg := natDegree_iterate_reflect_le m P (le_of_lt hMm)
    rw [Polynomial.coeff_eq_zero_of_natDegree_lt (lt_of_le_of_lt hdeg hjm)]
    ring

theorem coeff_truncScale_eq_zero (m : ℕ) (P : ℝ[X]) {j : ℕ} (hj : m < j) :
    (truncScale m P).coeff j = 0 := by
  rw [coeff_truncScale m P j]
  unfold wgt
  split_ifs with h1 h2
  · rw [Polynomial.coeff_eq_zero_of_natDegree_lt (by omega)]
    ring
  · exact absurd h2 (by omega)
  · ring

theorem hasOnlyRealRoots_truncScale (m : ℕ) (hm : 1 ≤ m) {P : ℝ[X]}
    (hP : MathlibBridge.HasOnlyRealRoots P) :
    MathlibBridge.HasOnlyRealRoots (truncScale m P) := by
  unfold truncScale
  split_ifs with h1
  · exact hP
  · have hMm : m < P.natDegree := lt_of_not_ge h1
    have hm0 : (0 : ℝ) < (m : ℝ) := by exact_mod_cast hm
    have hM0 : (0 : ℝ) < (P.natDegree : ℝ) := by
      have : 0 < P.natDegree := by omega
      exact_mod_cast this
    refine MathlibBridge.HasOnlyRealRoots.C_mul ?_
    refine MathlibBridge.HasOnlyRealRoots.comp_scale (by positivity) ?_
    refine MathlibBridge.HasOnlyRealRoots.reflect ?_ (natDegree_iterate_reflect_le m P (le_of_lt hMm))
    exact (hP.reflect (le_refl _)).iterate_derivative _

end EntireLP
