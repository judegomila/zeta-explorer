/-
  HeatFlowCounterexample — a machine-checked IMPOSSIBILITY result.

  The file `EntireLP.lean` (§5) documents that the former `axiom heatFlow_continuous`
  — the claim that the entire heat flow `heatFlow t` is continuous for *arbitrary*
  locally-uniformly convergent sequences —

      `TendstoLocallyUniformly F g atTop →
         TendstoLocallyUniformly (fun n => heatFlow t (F n)) (heatFlow t g) atTop`

  is **FALSE**.  There the counterexample is given only in prose.  This file BANKS that
  claim as a `sorry`-free, axiom-clean Lean theorem, `not_heatFlow_continuous`.

  ## The counterexample (`t = 1`)

  `F n : ℝ[X] := (n! / (2n)!) • X^(2n)` — a real polynomial with only real zeros (a single
  zero of multiplicity `2n` at `0`).

  1. `toEntire (F n) → 0` locally uniformly on `ℂ` (`toEntire_F_tendsto_zero`).  On any
     ball, `‖(n!/(2n)!)·z^{2n}‖ ≤ (n!/(2n)!)·R^{2n} ≤ (R²)ⁿ/n! → 0` — the bound
     `n!·n! ≤ (2n)!` reduces the double-factorial decay to the exponential series
     `∑ (R²)ⁿ/n!` (`Real.summable_pow_div_factorial`).
  2. `heatFlow 1 (toEntire (F n)) 0 = (-1)ⁿ` (`heatFlow_F_at_zero`).  Via `heatFlow_poly`,
     this equals `aeval 0 (heatOp 1 (F n)) = (heatOp 1 (F n)).coeff 0`; among the terms
     `((-1)ᵏ/k!)·D^{2k}(F n)` only `k = n` has a nonzero constant term, and it evaluates to
     `((-1)ⁿ/n!)·(n!/(2n)!)·(2n)! = (-1)ⁿ`.
  3. Since `(-1)ⁿ` does not converge to `heatFlow 1 0 0 = 0`, the loc-unif-continuity
     statement is false (`not_heatFlow_continuous`).

  This is exactly why the naive "loc-unif-continuous operator" route to
  `heat_preserves_LP_entire` is dead (see `EntireLP.isLaguerrePolya_heat_of_flow`, whose
  `hcont` hypothesis is precisely the property refuted here).  The genuine remaining work
  is `EntireLP.exists_heatOp_approx_tendsto` (a TRUE statement, left as the single `sorry`
  there — untouched by this file).
-/
import EntireLP
import Mathlib.Analysis.SpecificLimits.Normed

open scoped Polynomial Topology
open Filter

namespace EntireLP

/-! ## 1. The counterexample family -/

/-- The scalar `n! / (2n)!` of the counterexample. -/
noncomputable def cF (n : ℕ) : ℝ := (n.factorial : ℝ) / ((2 * n).factorial : ℝ)

/-- **The counterexample polynomial** `F n = (n!/(2n)!) • X^{2n}` — real-rooted (a single
zero of multiplicity `2n` at `0`), yet its heat flow at `0` is the non-convergent `(-1)ⁿ`. -/
noncomputable def F (n : ℕ) : ℝ[X] := (cF n) • (Polynomial.X ^ (2 * n))

/-- `0 < n!/(2n)!`. -/
theorem cF_pos (n : ℕ) : 0 < cF n :=
  div_pos (by exact_mod_cast Nat.factorial_pos n) (by exact_mod_cast Nat.factorial_pos (2 * n))

/-- **The key double-factorial bound** `n!/(2n)! ≤ 1/n!`, i.e. `n!·n! ≤ (2n)!`.  This is
what turns the double-factorial decay into the (summable) exponential decay `(R²)ⁿ/n!`. -/
theorem cF_le (n : ℕ) : cF n ≤ 1 / (n.factorial : ℝ) := by
  unfold cF
  rw [div_le_div_iff₀ (by exact_mod_cast Nat.factorial_pos (2 * n))
      (by exact_mod_cast Nat.factorial_pos n), one_mul]
  have hdvd : n.factorial * n.factorial ∣ (2 * n).factorial := by
    have h := Nat.factorial_mul_factorial_dvd_factorial_add n n
    rwa [show n + n = 2 * n by ring] at h
  exact_mod_cast Nat.le_of_dvd (Nat.factorial_pos _) hdvd

/-! ## 2. Local-uniform convergence of the family to `0` -/

/-- **Step 1 — `toEntire (F n) → 0` locally uniformly on `ℂ`.**  On a ball of radius `1`
about `x`, every `y` has `‖y‖ ≤ ‖x‖ + 1 =: R`, so
`‖toEntire (F n) y‖ = (n!/(2n)!)·‖y‖^{2n} ≤ (n!/(2n)!)·R^{2n} ≤ (R²)ⁿ/n!`, and the last
tends to `0` because `∑ (R²)ⁿ/n!` converges (exponential series). -/
theorem toEntire_F_tendsto_zero :
    TendstoLocallyUniformly (fun n => toEntire (F n)) (0 : ℂ → ℂ) atTop := by
  rw [Metric.tendstoLocallyUniformly_iff]
  intro ε hε x
  refine ⟨Metric.ball x 1, Metric.ball_mem_nhds x one_pos, ?_⟩
  set R : ℝ := ‖x‖ + 1 with hR
  have hRpos : 0 < R := by rw [hR]; positivity
  have hlim : Tendsto (fun n => (R ^ 2) ^ n / (n.factorial : ℝ)) atTop (𝓝 0) :=
    (Real.summable_pow_div_factorial (R ^ 2)).tendsto_atTop_zero
  have hev : ∀ᶠ n in atTop, (R ^ 2) ^ n / (n.factorial : ℝ) < ε :=
    hlim.eventually_lt_const hε
  filter_upwards [hev] with n hn y hy
  show dist ((0 : ℂ → ℂ) y) (toEntire (F n) y) < ε
  have hyx : dist y x < 1 := Metric.mem_ball.mp hy
  have hyR : ‖y‖ ≤ R := by
    have h1 : ‖y‖ - ‖x‖ ≤ ‖y - x‖ := norm_sub_norm_le y x
    rw [dist_eq_norm] at hyx; rw [hR]; linarith
  have hval : toEntire (F n) y = (cF n) • y ^ (2 * n) := by
    show Polynomial.aeval y (F n) = _
    unfold F; rw [map_smul, map_pow, Polynomial.aeval_X]
  have hnormval : ‖toEntire (F n) y‖ = (cF n) * ‖y‖ ^ (2 * n) := by
    rw [hval, norm_smul, Real.norm_eq_abs, abs_of_nonneg (cF_pos n).le, norm_pow]
  have hbound : (cF n) * ‖y‖ ^ (2 * n) ≤ (R ^ 2) ^ n / (n.factorial : ℝ) := by
    have hyn : ‖y‖ ^ (2 * n) ≤ R ^ (2 * n) := pow_le_pow_left₀ (norm_nonneg y) hyR _
    calc (cF n) * ‖y‖ ^ (2 * n)
        ≤ (cF n) * R ^ (2 * n) := mul_le_mul_of_nonneg_left hyn (cF_pos n).le
      _ ≤ (1 / (n.factorial : ℝ)) * R ^ (2 * n) :=
          mul_le_mul_of_nonneg_right (cF_le n) (pow_nonneg hRpos.le _)
      _ = (R ^ 2) ^ n / (n.factorial : ℝ) := by rw [pow_mul]; ring
  rw [Pi.zero_apply, dist_eq_norm, zero_sub, norm_neg, hnormval]
  exact lt_of_le_of_lt hbound hn

/-! ## 3. The heat flow of the family at `0` is `(-1)ⁿ` -/

/-- **Constant term of the iterated derivative of `X^m`.**  `(D^j (X^m)).coeff 0 = m!` if
`j = m`, else `0` (a nonzero constant term appears only when the whole monomial is
differentiated down to a constant). -/
theorem coeff_zero_iterate_deriv_X_pow (m j : ℕ) :
    (Polynomial.derivative^[j] (Polynomial.X ^ m : ℝ[X])).coeff 0
      = if j = m then (m.factorial : ℝ) else 0 := by
  rw [Polynomial.iterate_derivative_X_pow_eq_C_mul, Polynomial.coeff_C_mul,
      Polynomial.coeff_X_pow]
  by_cases hjm : j = m
  · subst hjm; simp [Nat.descFactorial_self]
  · rw [if_neg hjm]
    rcases lt_or_gt_of_ne hjm with hlt | hgt
    · rw [if_neg (by omega : ¬ ((0 : ℕ) = m - j)), mul_zero]
    · rw [Nat.descFactorial_eq_zero_iff_lt.mpr hgt, Nat.cast_zero, zero_mul]

/-- **The constant term of `heatOp 1 (F n)` is `(-1)ⁿ`.**  Only the `k = n` term of
`∑ ((-1)ᵏ/k!)·D^{2k}(F n)` contributes a nonzero constant term, equal to
`((-1)ⁿ/n!)·(n!/(2n)!)·(2n)! = (-1)ⁿ`. -/
theorem heatOp_F_coeff_zero (n : ℕ) :
    (MathlibBridge.heatOp 1 (F n)).coeff 0 = (-1) ^ n := by
  have hane : cF n ≠ 0 := (cF_pos n).ne'
  have hdeg : (F n).natDegree = 2 * n := by
    unfold F; rw [Polynomial.natDegree_smul _ hane, Polynomial.natDegree_X_pow]
  have h1 : (n.factorial : ℝ) ≠ 0 := by exact_mod_cast (Nat.factorial_pos n).ne'
  have h2 : ((2 * n).factorial : ℝ) ≠ 0 := by exact_mod_cast (Nat.factorial_pos (2 * n)).ne'
  unfold MathlibBridge.heatOp MathlibBridge.heatPartial
  rw [hdeg, Polynomial.finset_sum_coeff]
  refine (Finset.sum_eq_single_of_mem n (Finset.mem_range.mpr (by omega)) ?_).trans ?_
  · -- every `k ≠ n` term has zero constant term
    intro k _ hkn
    rw [Polynomial.coeff_smul, smul_eq_mul]
    have hz : (Polynomial.derivative^[2 * k] (F n)).coeff 0 = 0 := by
      unfold F
      rw [Polynomial.iterate_derivative_smul, Polynomial.coeff_smul, smul_eq_mul,
          coeff_zero_iterate_deriv_X_pow, if_neg (by omega : ¬ (2 * k = 2 * n)), mul_zero]
    rw [hz, mul_zero]
  · -- the surviving `k = n` term equals `(-1)ⁿ`
    rw [Polynomial.coeff_smul, smul_eq_mul]
    have hmain : (Polynomial.derivative^[2 * n] (F n)).coeff 0
        = (cF n) * ((2 * n).factorial : ℝ) := by
      unfold F
      rw [Polynomial.iterate_derivative_smul, Polynomial.coeff_smul, smul_eq_mul,
          coeff_zero_iterate_deriv_X_pow, if_pos rfl]
    rw [hmain]; unfold cF; field_simp

/-- **Step 2 — `heatFlow 1 (toEntire (F n)) 0 = (-1)ⁿ`.**  Via `heatFlow_poly`, the flow of
the polynomial image is `toEntire (heatOp 1 (F n))`; evaluating at `0` is the constant term
`heatOp_F_coeff_zero`. -/
theorem heatFlow_F_at_zero (n : ℕ) :
    heatFlow 1 (toEntire (F n)) 0 = (-1) ^ n := by
  rw [heatFlow_poly]
  show Polynomial.aeval (0 : ℂ) (MathlibBridge.heatOp 1 (F n)) = (-1) ^ n
  rw [Polynomial.aeval_def, Polynomial.eval₂_at_zero, heatOp_F_coeff_zero,
      map_pow, map_neg, map_one]

/-- **The flow of the zero function at `0` is `0`.**  (The limit value the sequence
`(-1)ⁿ` would have to converge to.) -/
theorem heatFlow_zero_fun_at_zero : heatFlow (1 : ℝ) (0 : ℂ → ℂ) 0 = 0 := by
  have h0 : (0 : ℂ → ℂ) = toEntire (0 : ℝ[X]) := by
    funext z
    show (0 : ℂ) = Polynomial.aeval z (0 : ℝ[X])
    rw [map_zero]
  have hop : MathlibBridge.heatOp 1 (0 : ℝ[X]) = 0 := by
    unfold MathlibBridge.heatOp MathlibBridge.heatPartial
    simp
  rw [h0, heatFlow_poly, hop]
  show Polynomial.aeval (0 : ℂ) (0 : ℝ[X]) = 0
  rw [map_zero]

/-! ## 4. The impossibility theorem -/

/-- **`not_heatFlow_continuous` — the former `axiom heatFlow_continuous` is FALSE.**

The entire heat flow `heatFlow t` is NOT continuous for arbitrary locally-uniformly
convergent sequences: there is no true statement of the form

    `∀ t, TendstoLocallyUniformly f g → TendstoLocallyUniformly (heatFlow t ∘ f) (heatFlow t g)`.

This is exactly the hypothesis `hcont` of `EntireLP.isLaguerrePolya_heat_of_flow` at
`Φ = heatFlow t`, so the bridge — though itself a correct, sorry-free conditional — CANNOT
be instantiated at the genuine heat flow.  Witness (`t = 1`): `F n = (n!/(2n)!)·X^{2n}` with
`toEntire (F n) → 0` locally uniformly, yet `heatFlow 1 (toEntire (F n)) 0 = (-1)ⁿ ↛ 0`.
Machine-checked, `sorry`-free. -/
theorem not_heatFlow_continuous :
    ¬ ∀ (t : ℝ) {f : ℕ → ℂ → ℂ} {g : ℂ → ℂ},
        TendstoLocallyUniformly f g atTop →
        TendstoLocallyUniformly (fun n => heatFlow t (f n)) (heatFlow t g) atTop := by
  intro hcont
  -- Apply the (hypothetical) continuity at `t = 1` to the family `toEntire (F n) → 0`.
  have hconv : TendstoLocallyUniformly
      (fun n => heatFlow 1 (toEntire (F n))) (heatFlow 1 (0 : ℂ → ℂ)) atTop :=
    hcont 1 toEntire_F_tendsto_zero
  -- Extract pointwise convergence at `z = 0`.
  have hpt : Tendsto (fun n => heatFlow 1 (toEntire (F n)) 0) atTop
      (𝓝 (heatFlow 1 (0 : ℂ → ℂ) 0)) :=
    (hconv.tendstoLocallyUniformlyOn).tendsto_at (Set.mem_univ 0)
  rw [heatFlow_zero_fun_at_zero] at hpt
  simp only [heatFlow_F_at_zero] at hpt
  -- `hpt : Tendsto (fun n => (-1)ⁿ) atTop (𝓝 0)` — impossible, the norm is constantly `1`.
  have hn1 : Tendsto (fun n : ℕ => ‖((-1 : ℂ)) ^ n‖) atTop (𝓝 ‖(0 : ℂ)‖) :=
    (continuous_norm.tendsto (0 : ℂ)).comp hpt
  simp only [norm_pow, norm_neg, norm_one, one_pow, norm_zero] at hn1
  exact zero_ne_one (tendsto_nhds_unique hn1 tendsto_const_nhds)

/-! ## 5. Axiom audit -/

-- SORRY-FREE, AXIOM-CLEAN (only `propext`, `Classical.choice`, `Quot.sound`):
#print axioms cF_le
#print axioms toEntire_F_tendsto_zero      -- Step 1: loc-unif → 0
#print axioms coeff_zero_iterate_deriv_X_pow
#print axioms heatOp_F_coeff_zero
#print axioms heatFlow_F_at_zero           -- Step 2: value `(-1)ⁿ`
#print axioms heatFlow_zero_fun_at_zero
#print axioms not_heatFlow_continuous      -- THE IMPOSSIBILITY RESULT (machine-checked)

end EntireLP
