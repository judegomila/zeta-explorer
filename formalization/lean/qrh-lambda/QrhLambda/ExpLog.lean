import Mathlib
import QrhLambda.Checker

/-!
# Elementary bounds used by the consumer arithmetic

* `taylorNeg n x = Σ_{k<n} (−x)^k/k!`, and the alternating-sign bounds for `x ≥ 0`:
  `exp(−x) ≤ taylorNeg 19 x` (degree 18, AF §12 primary enclosure) and `taylorNeg 18 x ≤ exp(−x)`
  (degree 17, the E6 no-early-crossing test).
* `log(1 + z) ≤ z − z²/(2(1+z))` for `z ≥ 0` (AF §12 alternate log bound).
* `hornerR`: the real model of the integer Horner recursion of `QrhLambda.horner`, and
  `horner_spec`: the integer recursion computes `T₁₈(N/D) = F/C` with `C = 18!·D¹⁸`.
-/

open Finset

namespace QrhLambda

/-- Taylor partial sum of `e^{−x}` with `n` terms (degrees `0 … n−1`). -/
noncomputable def taylorNeg (n : ℕ) (x : ℝ) : ℝ := ∑ k ∈ range n, (-x) ^ k / (k.factorial : ℝ)

lemma taylorNeg_succ_zero (n : ℕ) : taylorNeg (n + 1) 0 = 1 := by
  unfold taylorNeg
  rw [sum_range_succ']
  simp

lemma hasDerivAt_negpow_term (m : ℕ) (x : ℝ) :
    HasDerivAt (fun y : ℝ => (-y) ^ (m + 1) / ((m + 1).factorial : ℝ))
      (-((-x) ^ m / (m.factorial : ℝ))) x := by
  have h1 : HasDerivAt (fun y : ℝ => -y) (-1) x := (hasDerivAt_id' x).fun_neg
  have h2 := (h1.fun_pow (m + 1)).div_const ((m + 1).factorial : ℝ)
  convert h2 using 1
  rw [Nat.add_sub_cancel, Nat.factorial_succ]
  push_cast
  have hk : (m.factorial : ℝ) ≠ 0 := by positivity
  field_simp

lemma hasDerivAt_taylorNeg (n : ℕ) (x : ℝ) :
    HasDerivAt (taylorNeg (n + 1)) (-taylorNeg n x) x := by
  induction n with
  | zero =>
    have h1 : taylorNeg 1 = fun _ => 1 := by
      funext y
      simp [taylorNeg]
    have h0 : taylorNeg 0 x = 0 := by simp [taylorNeg]
    rw [h1, h0, neg_zero]
    exact hasDerivAt_const x (1 : ℝ)
  | succ n ih =>
    have hfun : taylorNeg (n + 1 + 1) =
        fun y => taylorNeg (n + 1) y + (-y) ^ (n + 1) / ((n + 1).factorial : ℝ) := by
      funext y
      simp only [taylorNeg]
      rw [sum_range_succ]
    rw [hfun]
    have h := ih.fun_add (hasDerivAt_negpow_term n x)
    convert h using 1
    simp only [taylorNeg]
    rw [sum_range_succ]
    ring

/-- Alternating-sign Taylor bounds: `(−1)^n (e^{−x} − Σ_{k<n} (−x)^k/k!) ≥ 0` for `x ≥ 0`. -/
theorem taylorNeg_alt (n : ℕ) : ∀ x : ℝ, 0 ≤ x → 0 ≤ (-1) ^ n * (Real.exp (-x) - taylorNeg n x) := by
  induction n with
  | zero =>
    intro x _
    simp [taylorNeg, (Real.exp_pos _).le]
  | succ n ih =>
    intro x hx
    set g : ℝ → ℝ := fun y => (-1) ^ (n + 1) * (Real.exp (-y) - taylorNeg (n + 1) y) with hg
    have hderiv : ∀ y, HasDerivAt g ((-1) ^ n * (Real.exp (-y) - taylorNeg n y)) y := by
      intro y
      have he : HasDerivAt (fun y : ℝ => Real.exp (-y)) (-Real.exp (-y)) y := by
        have := ((hasDerivAt_id' y).fun_neg).exp
        convert this using 1
        ring
      have h := (he.fun_sub (hasDerivAt_taylorNeg n y)).const_mul ((-1 : ℝ) ^ (n + 1))
      convert h using 1
      ring
    have hmono : MonotoneOn g (Set.Ici 0) := by
      apply monotoneOn_of_hasDerivWithinAt_nonneg (convex_Ici 0)
        (fun y _ => (hderiv y).continuousAt.continuousWithinAt)
        (fun y _ => (hderiv y).hasDerivWithinAt)
      intro y hy
      rw [interior_Ici] at hy
      exact ih y (le_of_lt hy)
    have h0 : g 0 = 0 := by
      simp [hg, taylorNeg_succ_zero]
    have := hmono (Set.self_mem_Ici) (Set.mem_Ici.mpr hx) hx
    rw [h0] at this
    exact this

/-- `e^{−x} ≤ T₁₈(x)` for `x ≥ 0`. -/
theorem exp_neg_le_taylor19 {x : ℝ} (hx : 0 ≤ x) : Real.exp (-x) ≤ taylorNeg 19 x := by
  have h := taylorNeg_alt 19 x hx
  have : ((-1 : ℝ) ^ 19) = -1 := by norm_num
  rw [this] at h
  linarith

/-- `T₁₇(x) ≤ e^{−x}` for `x ≥ 0`. -/
theorem taylor18_le_exp_neg {x : ℝ} (hx : 0 ≤ x) : taylorNeg 18 x ≤ Real.exp (-x) := by
  have h := taylorNeg_alt 18 x hx
  have : ((-1 : ℝ) ^ 18) = 1 := by norm_num
  rw [this] at h
  linarith

lemma taylor19_sub_taylor18 (x : ℝ) :
    taylorNeg 19 x - taylorNeg 18 x = x ^ 18 / (Nat.factorial 18 : ℝ) := by
  unfold taylorNeg
  rw [sum_range_succ]
  have : (-x) ^ 18 = x ^ 18 := by rw [neg_pow]; norm_num
  rw [this]
  ring

/-- `log(1 + z) ≤ z − z²/(2(1+z))` for `z ≥ 0`. -/
theorem log_one_add_le_logB {z : ℝ} (hz : 0 ≤ z) : Real.log (1 + z) ≤ z - z * z / (2 * (1 + z)) := by
  have hderiv : ∀ y : ℝ, 0 ≤ y → HasDerivAt (fun y : ℝ => y - y * y / (2 * (1 + y)) - Real.log (1 + y))
      (y ^ 2 / (2 * (1 + y) ^ 2)) y := by
    intro y hy
    have h1 : (1 + y) ≠ 0 := by positivity
    have h2 : (2 * (1 + y)) ≠ 0 := by positivity
    have hid := hasDerivAt_id' y
    have hlin : HasDerivAt (fun y : ℝ => 1 + y) 1 y := hid.const_add 1
    have hden : HasDerivAt (fun y : ℝ => 2 * (1 + y)) (2 * 1) y := hlin.const_mul 2
    have hq := (hid.fun_mul hid).fun_div hden h2
    have hl := hlin.log h1
    have h := (hid.fun_sub hq).fun_sub hl
    convert h using 1
    field_simp
    ring
  have hmono : MonotoneOn (fun y : ℝ => y - y * y / (2 * (1 + y)) - Real.log (1 + y)) (Set.Ici 0) := by
    apply monotoneOn_of_hasDerivWithinAt_nonneg (convex_Ici 0)
      (fun y hy => (hderiv y hy).continuousAt.continuousWithinAt)
      (fun y hy => (hderiv y (interior_subset hy)).hasDerivWithinAt)
    intro y _
    positivity
  have := hmono (Set.self_mem_Ici) (Set.mem_Ici.mpr hz) hz
  simp only [mul_zero, zero_div, sub_zero, add_zero, Real.log_one] at this
  linarith

/-- `Σ_{k<n} (−1)^k z^{k+1}/(k+1)`: alternating partial sum of `log(1+z)` with `n` terms. -/
noncomputable def logSum (n : ℕ) (z : ℝ) : ℝ := ∑ k ∈ range n, (-1) ^ k * z ^ (k + 1) / ((k : ℝ) + 1)

lemma hasDerivAt_logSum (n : ℕ) (z : ℝ) : HasDerivAt (logSum n) (∑ k ∈ range n, (-z) ^ k) z := by
  have hterm : ∀ k ∈ range n, HasDerivAt (fun y : ℝ => (-1) ^ k * y ^ (k + 1) / ((k : ℝ) + 1))
      ((-z) ^ k) z := by
    intro k _
    have h := ((hasDerivAt_pow (k + 1) z).const_mul ((-1 : ℝ) ^ k)).div_const ((k : ℝ) + 1)
    convert h using 1
    rw [Nat.add_sub_cancel, neg_pow]
    push_cast
    have hk : (k : ℝ) + 1 ≠ 0 := by positivity
    field_simp
  have hs := HasDerivAt.fun_sum hterm
  exact hs

/-- `log(1 + z) ≤ Σ_{k<11} (−1)^k z^{k+1}/(k+1)` for `z ≥ 0` (odd number of terms; AF §12 primary log
bound). Derivative of the difference: `Σ_{k<11} (−z)^k − 1/(1+z) = z¹¹/(1+z) ≥ 0`. -/
theorem log_one_add_le_logSum11 {z : ℝ} (hz : 0 ≤ z) : Real.log (1 + z) ≤ logSum 11 z := by
  have hderiv : ∀ y : ℝ, 0 ≤ y → HasDerivAt (fun y : ℝ => logSum 11 y - Real.log (1 + y))
      (y ^ 11 / (1 + y)) y := by
    intro y hy
    have h1 : (1 + y) ≠ 0 := by positivity
    have hl : HasDerivAt (fun y : ℝ => Real.log (1 + y)) (1 / (1 + y)) y :=
      ((hasDerivAt_id' y).const_add 1).log h1
    have h := (hasDerivAt_logSum 11 y).fun_sub hl
    convert h using 1
    simp only [sum_range_succ, sum_range_zero]
    field_simp
    ring
  have hmono : MonotoneOn (fun y : ℝ => logSum 11 y - Real.log (1 + y)) (Set.Ici 0) := by
    apply monotoneOn_of_hasDerivWithinAt_nonneg (convex_Ici 0)
      (fun y hy => (hderiv y hy).continuousAt.continuousWithinAt)
      (fun y hy => (hderiv y (interior_subset hy)).hasDerivWithinAt)
    intro y hy
    rw [interior_Ici] at hy
    have : (0 : ℝ) < y := hy
    positivity
  have := hmono (Set.self_mem_Ici) (Set.mem_Ici.mpr hz) hz
  simp only [logSum, add_zero, Real.log_one, sub_zero] at this
  simp only [zero_pow (Nat.succ_ne_zero _), mul_zero, zero_div, sum_const_zero] at this
  unfold logSum
  linarith

/-! ## The integer Horner scheme -/

/-- Real model of `horner`: `hornerR x (j+1) g = hornerR x j (1 − x/(j+1)·g)`. -/
noncomputable def hornerR (x : ℝ) : ℕ → ℝ → ℝ
  | 0, g => g
  | j + 1, g => hornerR x j (1 - x / ((j : ℝ) + 1) * g)

theorem hornerR_eq_taylor (x : ℝ) : hornerR x 18 1 = taylorNeg 19 x := by
  simp only [hornerR, taylorNeg, sum_range_succ, sum_range_zero, Nat.factorial]
  push_cast
  ring

theorem horner_spec (N D : ℕ) (hD : 0 < D) :
    ∀ (j F C : ℕ) (ok : Bool) (F' C' : ℕ), horner N D j F C ok = (F', C', true) → 0 < C →
      ok = true ∧ C' = C * D ^ j * j.factorial ∧
        (F' : ℝ) / C' = hornerR ((N : ℝ) / D) j ((F : ℝ) / C) := by
  intro j
  induction j with
  | zero =>
    intro F C ok F' C' h _
    simp only [horner, Prod.mk.injEq] at h
    obtain ⟨rfl, rfl, rfl⟩ := h
    simp [hornerR]
  | succ j ih =>
    intro F C ok F' C' h hC
    simp only [horner] at h
    have hC1 : 0 < C * D * (j + 1) := by positivity
    obtain ⟨hok, hC', hF'⟩ := ih _ _ _ _ _ h hC1
    simp only [Bool.and_eq_true, decide_eq_true_eq] at hok
    obtain ⟨hok1, hle⟩ := hok
    refine ⟨hok1, ?_, ?_⟩
    · rw [hC', Nat.factorial_succ, pow_succ]
      ring
    · rw [hF']
      simp only [hornerR]
      congr 1
      rw [Nat.cast_sub hle]
      have hCr : (0 : ℝ) < C := by exact_mod_cast hC
      have hDr : (0 : ℝ) < D := by exact_mod_cast hD
      push_cast
      field_simp

end QrhLambda
