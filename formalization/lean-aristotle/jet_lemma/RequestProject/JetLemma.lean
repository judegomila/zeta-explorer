import RequestProject.HermiteRoots

/-!
# The jet lemma: `e^{-sD²} x^{2m}` is a scaled Hermite polynomial

Main results (targets J1, J2, J3 of the source note):

* `J1` (`heatOp_X_pow_eq_scaled_hermiteReal`): for `s > 0` and `c = √(2s)`,
  `e^{-sD²} xⁿ = cⁿ · Heₙ(x / c)`.
* `J2` (`heatOp_X_pow_two_mul_card_roots`): for `s > 0` and `m ≥ 1`,
  `e^{-sD²} x^{2m}` has exactly `2m` distinct real roots.
* `J3` (`eval_heatOp_X_pow_two_mul_pos`): for `s < 0`, `e^{-sD²} x^{2m}` is
  strictly positive on `ℝ`, hence has no real root.
-/

open Polynomial Finset

namespace JetLemma

open scoped Nat

/-- Sanity check on the sign convention: `heatOp t (X² - 1) = X² - (1 + 2t)`. -/
lemma heatOp_X_sq_sub_one (t : ℝ) :
    heatOp t (X ^ 2 - 1 : ℝ[X]) = X ^ 2 - C (1 + 2 * t) := by
  have hd : (X ^ 2 - 1 : ℝ[X]).natDegree = 2 := by compute_degree!
  rw [heatOp_eq_sum_range t _ (le_of_eq hd)]
  simp only [Finset.sum_range_succ, Finset.sum_range_zero, Function.iterate_succ_apply',
    Function.iterate_zero_apply, C_add, C_mul, C_1]
  norm_num
  ring

/-- Explicit expansion of `e^{-sD²} xⁿ`. -/
lemma heatOp_X_pow_eq_sum (s : ℝ) (n : ℕ) :
    heatOp s (X ^ n) =
      ∑ k ∈ range (n + 1),
        C ((-s) ^ k / (k ! : ℝ) * (n.descFactorial (2 * k) : ℝ)) * X ^ (n - 2 * k) := by
  rw [heatOp_eq_sum_range s _ (le_of_eq (natDegree_X_pow n))]
  refine Finset.sum_congr rfl fun k _ => ?_
  rw [iterate_derivative_X_pow_eq_smul, Polynomial.smul_eq_C_mul, ← mul_assoc, ← C_mul]

/-- The `m = 2` example from the source note: `e^{-sD²} x⁴ = x⁴ - 12s x² + 12s²`. -/
lemma heatOp_X_pow_four (s : ℝ) :
    heatOp s (X ^ 4) = X ^ 4 - C (12 * s) * X ^ 2 + C (12 * s ^ 2) := by
  rw [heatOp_X_pow_eq_sum]
  simp only [Finset.sum_range_succ, Finset.sum_range_zero, Nat.descFactorial, Nat.factorial]
  push_cast
  rw [show ((-s) ^ 0 / 1 * 1 : ℝ) = 1 by norm_num,
    show ((-s) ^ 1 / 1 * 12 : ℝ) = -(12 * s) by ring,
    show ((-s) ^ 2 / 2 * 24 : ℝ) = 12 * s ^ 2 by ring,
    show ((-s) ^ 3 / 6 * 0 : ℝ) = 0 by ring,
    show ((-s) ^ 4 / 24 * 0 : ℝ) = 0 by ring, C_neg, C_1]
  simp
  ring

lemma eval_heatOp_X_pow (s x : ℝ) (n : ℕ) :
    (heatOp s (X ^ n)).eval x =
      ∑ k ∈ range (n + 1),
        (-s) ^ k / (k ! : ℝ) * (n.descFactorial (2 * k) : ℝ) * x ^ (n - 2 * k) := by
  rw [heatOp_X_pow_eq_sum, eval_finset_sum]
  simp

/-- `e^{-sD²} xⁿ` is monic of degree `n`. -/
lemma heatOp_X_pow_monic_natDegree (s : ℝ) (n : ℕ) :
    (heatOp s (X ^ n)).Monic ∧ (heatOp s (X ^ n)).natDegree = n := by
  induction n with
  | zero => rw [pow_zero, heatOp_one]; exact ⟨monic_one, natDegree_one⟩
  | succ n ih =>
    obtain ⟨hm, hd⟩ := ih
    have hx : (X : ℝ[X]) ^ (n + 1) = X * X ^ n := by ring
    rw [hx, heatOp_X_mul]
    have h1 : (X * heatOp s (X ^ n)).Monic := monic_X.mul hm
    have h1d : (X * heatOp s (X ^ n)).natDegree = n + 1 := by
      rw [natDegree_mul X_ne_zero hm.ne_zero, natDegree_X, hd, Nat.add_comm]
    have h2 : (C (2 * s) * derivative (heatOp s (X ^ n))).natDegree
        < (X * heatOp s (X ^ n)).natDegree := by
      have hle : (C (2 * s) * derivative (heatOp s (X ^ n))).natDegree
          ≤ (derivative (heatOp s (X ^ n))).natDegree := natDegree_C_mul_le _ _
      have hle2 : (derivative (heatOp s (X ^ n))).natDegree ≤ n :=
        (natDegree_derivative_le _).trans (by omega)
      omega
    exact ⟨h1.sub_of_left (degree_lt_degree h2),
      by rw [natDegree_sub_eq_left_of_natDegree_lt h2, h1d]⟩

lemma natDegree_heatOp_X_pow (s : ℝ) (n : ℕ) : (heatOp s (X ^ n)).natDegree = n :=
  (heatOp_X_pow_monic_natDegree s n).2

lemma monic_heatOp_X_pow (s : ℝ) (n : ℕ) : (heatOp s (X ^ n)).Monic :=
  (heatOp_X_pow_monic_natDegree s n).1

/-- At `s = 0` the heat operator is the identity. -/
lemma heatOp_zero (p : ℝ[X]) : heatOp (0 : ℝ) p = p := by
  rw [heatOp_eq_sum_range 0 p le_rfl, Finset.sum_eq_single 0]
  · simp
  · intro k _ hk
    simp only [neg_zero, zero_pow hk, zero_div, map_zero, zero_mul]
  · intro h
    exact absurd (Finset.mem_range.mpr (Nat.succ_pos _)) h

/-! ### J1 -/

/-- **J1**: for `s > 0`, writing `c = √(2s)`, the backward heat flow of `xⁿ` is the
rescaled Hermite polynomial `cⁿ Heₙ(x/c)`. -/
theorem heatOp_X_pow_eq_scaled_hermiteReal (s : ℝ) (hs : 0 < s) (n : ℕ) :
    heatOp s (X ^ n) =
      C (Real.sqrt (2 * s) ^ n) * (hermiteReal n).comp (C (Real.sqrt (2 * s))⁻¹ * X) := by
  set c := Real.sqrt (2 * s) with hc
  have hcpos : 0 < c := Real.sqrt_pos.mpr (by linarith)
  have hcne : c ≠ 0 := ne_of_gt hcpos
  have hc2 : c ^ 2 = 2 * s := Real.sq_sqrt (by linarith)
  have hhalf : s * (c⁻¹) ^ 2 = 1 / 2 := by
    rw [inv_pow, hc2]
    field_simp
  have hcomp := heatOp_comp_scale s c⁻¹ (X ^ n)
  rw [hhalf, heatOp_half_X_pow_eq_hermiteReal] at hcomp
  have hlhs : ((X : ℝ[X]) ^ n).comp (C c⁻¹ * X) = C (c⁻¹ ^ n) * X ^ n := by
    rw [pow_comp, X_comp, mul_pow, C_pow]
  rw [hlhs, heatOp_C_mul] at hcomp
  have hcancel : C (c ^ n) * (C (c⁻¹ ^ n) * heatOp s (X ^ n)) = heatOp s (X ^ n) := by
    rw [← mul_assoc, ← C_mul, ← mul_pow, mul_inv_cancel₀ hcne, one_pow, C_1, one_mul]
  rw [← hcancel, hcomp]

/-! ### J2 -/

/-- For `s > 0`, `e^{-sD²} xⁿ` splits into `n` distinct real linear factors. -/
theorem heatOp_X_pow_eq_prod (s : ℝ) (hs : 0 < s) (n : ℕ) :
    ∃ S : Finset ℝ, S.card = n ∧ heatOp s (X ^ n) = ∏ x ∈ S, (X - C x) := by
  classical
  set c := Real.sqrt (2 * s) with hc
  have hcpos : 0 < c := Real.sqrt_pos.mpr (by linarith)
  have hcne : c ≠ 0 := ne_of_gt hcpos
  obtain ⟨S₀, hcard, hS₀⟩ := hermiteReal_eq_prod_X_sub_C n
  have hinj : Set.InjOn (fun x => c * x) ↑S₀ := by
    intro x _ y _ hxy
    exact mul_left_cancel₀ hcne hxy
  refine ⟨S₀.image (fun x => c * x), ?_, ?_⟩
  · rw [Finset.card_image_of_injOn hinj, hcard]
  · rw [heatOp_X_pow_eq_scaled_hermiteReal s hs n, hS₀, Polynomial.prod_comp]
    have hfac : ∀ x ∈ S₀, ((X : ℝ[X]) - C x).comp (C c⁻¹ * X) = C c⁻¹ * (X - C (c * x)) := by
      intro x _
      simp only [sub_comp, X_comp, C_comp, mul_sub, ← C_mul]
      rw [show c⁻¹ * (c * x) = x by field_simp]
    rw [Finset.prod_congr rfl hfac, Finset.prod_mul_distrib, Finset.prod_const, hcard,
      Finset.prod_image hinj, ← C_pow, ← mul_assoc, ← C_mul, ← mul_pow]
    rw [mul_inv_cancel₀ hcne, one_pow, C_1, one_mul]

/-- Consequences of splitting into distinct linear factors. -/
lemma roots_of_eq_prod {p : ℝ[X]} {S : Finset ℝ} (h : p = ∏ x ∈ S, (X - C x)) :
    p.roots.toFinset = S ∧ Multiset.card p.roots = S.card ∧ Squarefree p := by
  classical
  have hroots : p.roots = S.val := by rw [h, roots_prod_X_sub_C]
  refine ⟨by rw [hroots]; exact S.val_toFinset, by simp [hroots], ?_⟩
  have hsep : p.Separable := by
    rw [h]
    exact Polynomial.separable_prod_X_sub_C_iff'.mpr fun x _ y _ hxy => hxy
  exact hsep.squarefree

/-- For `s ≥ 0`, `e^{-sD²} xⁿ` has only real roots (counted with multiplicity). -/
theorem hasOnlyRealRoots_heatOp_X_pow (s : ℝ) (hs : 0 ≤ s) (n : ℕ) :
    HasOnlyRealRoots (heatOp s (X ^ n)) := by
  rcases eq_or_lt_of_le hs with hs0 | hs0
  · rw [← hs0, heatOp_zero]
    unfold HasOnlyRealRoots
    rw [roots_pow, natDegree_X_pow, roots_X]
    simp
  · obtain ⟨S, hcard, hS⟩ := heatOp_X_pow_eq_prod s hs0 n
    unfold HasOnlyRealRoots
    rw [(roots_of_eq_prod hS).2.1, hcard, natDegree_heatOp_X_pow]

/-- For `s > 0`, `e^{-sD²} xⁿ` has exactly `n` *distinct* real roots. -/
theorem heatOp_X_pow_card_roots (s : ℝ) (hs : 0 < s) (n : ℕ) :
    (heatOp s (X ^ n)).roots.toFinset.card = n := by
  obtain ⟨S, hcard, hS⟩ := heatOp_X_pow_eq_prod s hs n
  rw [(roots_of_eq_prod hS).1, hcard]

/-- For `s > 0`, `e^{-sD²} xⁿ` has simple roots. -/
theorem heatOp_X_pow_squarefree (s : ℝ) (hs : 0 < s) (n : ℕ) :
    Squarefree (heatOp s (X ^ n)) := by
  obtain ⟨S, hcard, hS⟩ := heatOp_X_pow_eq_prod s hs n
  exact (roots_of_eq_prod hS).2.2

/-- **J2**: for `s > 0` and `m ≥ 1`, `e^{-sD²} x^{2m}` has `2m` distinct real roots
(and hence simple roots).  The hypothesis `1 ≤ m` is the one stated in the source note; the
proof does not need it (for `m = 0` the statement is the trivial one about `x⁰ = 1`). -/
theorem heatOp_X_pow_two_mul_card_roots (s : ℝ) (hs : 0 < s) (m : ℕ) (hm : 1 ≤ m) :
    (heatOp s (X ^ (2 * m))).roots.toFinset.card = 2 * m ∧
      Squarefree (heatOp s (X ^ (2 * m))) ∧
      HasOnlyRealRoots (heatOp s (X ^ (2 * m))) :=
  ⟨heatOp_X_pow_card_roots s hs _, heatOp_X_pow_squarefree s hs _,
    hasOnlyRealRoots_heatOp_X_pow s hs.le _⟩

/-! ### J3 -/

/-- **J3**: for `s < 0`, `e^{-sD²} x^{2m}` is strictly positive on `ℝ`; in particular it
has no real root. -/
theorem eval_heatOp_X_pow_two_mul_pos (s : ℝ) (hs : s < 0) (m : ℕ) (x : ℝ) :
    0 < (heatOp s (X ^ (2 * m))).eval x := by
  rw [eval_heatOp_X_pow]
  refine Finset.sum_pos' ?_ ⟨m, Finset.mem_range.mpr (by omega), ?_⟩
  · intro k _
    have h1 : 0 < (-s) ^ k := pow_pos (by linarith) k
    have h2 : (0 : ℝ) < (k ! : ℝ) := by exact_mod_cast Nat.factorial_pos k
    have h3 : (0 : ℝ) ≤ ((2 * m).descFactorial (2 * k) : ℝ) := by positivity
    have h4 : (0 : ℝ) ≤ x ^ (2 * m - 2 * k) := by
      have : Even (2 * m - 2 * k) := ⟨m - k, by omega⟩
      exact this.pow_nonneg x
    positivity
  · have hdesc : (2 * m).descFactorial (2 * m) = (2 * m)! := Nat.descFactorial_self (2 * m)
    have h1 : 0 < (-s) ^ m := pow_pos (by linarith) m
    have h2 : (0 : ℝ) < (m ! : ℝ) := by exact_mod_cast Nat.factorial_pos m
    have h3 : (0 : ℝ) < ((2 * m).descFactorial (2 * m) : ℝ) := by
      rw [hdesc]
      exact_mod_cast Nat.factorial_pos (2 * m)
    have h4 : x ^ (2 * m - 2 * m) = 1 := by simp
    rw [h4, mul_one]
    positivity

theorem heatOp_X_pow_two_mul_no_real_roots (s : ℝ) (hs : s < 0) (m : ℕ) :
    (heatOp s (X ^ (2 * m))).roots = 0 := by
  rw [Multiset.eq_zero_iff_forall_notMem]
  intro x hx
  have hne : heatOp s (X ^ (2 * m)) ≠ 0 := (monic_heatOp_X_pow s (2 * m)).ne_zero
  have hzero : (heatOp s (X ^ (2 * m))).eval x = 0 := (mem_roots hne).mp hx
  exact absurd hzero (ne_of_gt (eval_heatOp_X_pow_two_mul_pos s hs m x))

/-! ### Auxiliary banked results, reproved here -/

theorem hermiteReal_hasOnlyRealRoots (n : ℕ) : HasOnlyRealRoots (hermiteReal n) := by
  obtain ⟨S, hcard, hS⟩ := hermiteReal_eq_prod_X_sub_C n
  unfold HasOnlyRealRoots
  rw [(roots_of_eq_prod hS).2.1, hcard, natDegree_hermiteReal]

theorem hermite_map_hasOnlyRealRoots (n : ℕ) :
    HasOnlyRealRoots ((Polynomial.hermite n).map (Int.castRingHom ℝ)) :=
  hermiteReal_hasOnlyRealRoots n

theorem heatOp_half_X_mul (q : ℝ[X]) :
    heatOp (1 / 2 : ℝ) (X * q)
      = X * heatOp (1 / 2 : ℝ) q - derivative (heatOp (1 / 2 : ℝ) q) := by
  rw [heatOp_X_mul]
  norm_num

end JetLemma
