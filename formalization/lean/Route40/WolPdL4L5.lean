/-
Route 40 (b9) — wol-pd lemmas L4 and L5 (structural parts), formal version.

Source: formalization/paper/wol-pd-lemmas.md §4 (Lemmas 4.1, 4.3, 4.4) and §5 (Lemma 5.3(a),(c)).
Compiled against Mathlib d13f23b7 / Lean 4.34.1 (tree /tmp/qrh-verify/lean).

What is formalised (all for arbitrary data, so for every entry, prefix, t, a):
* `poly_norm_ge`            : |1 + Σ α_k ζ^k| ≥ 1 - Σ |α_k| for |ζ| ≤ 1        (Lemma 4.3(a), first step)
* `min_modulus_disc`        : a zero-free entire F with |F| ≥ m on the unit circle has |F| ≥ m on the
                               closed unit disc (minimum modulus; Lemma 4.3(a), second step)
* `c1_lower_bound`          : |c₁| ≥ Π m_q - δ₀ when |c₁ - Π F_q| ≤ δ₀ and |F_q| ≥ m_q ≥ 0 (Lemma 4.3(a))
* `poly_conj`               : real coefficients ⇒ F(conj ζ) = conj F(ζ)            (Lemma 4.3(c))
* `weak_duality`            : Lemma 4.4 (+ probe only, − probe by evenness)
* `beta_mono`, `V_mono`, `dV_mono`, `hi_mono` : monotonicity used in Lemma 4.1
* `recursion_bound`         : Lemma 5.3(a), |ψ_k| ≤ C_K for all k > K (strong induction)
* `logrpow_le`              : Lemma 5.3(c), (log m) m^{-δ} ≤ (log X) X^{-δ} for m ≥ X ≥ e^{1/δ}
* `tail_le_weighted`        : Lemma 5.3(c), Σ_{m>X} f_m ≤ X^{-δ} (N_δ - Σ_{m≤X} f_m m^δ)
-/
import Mathlib

open Complex Finset Metric

namespace Route40

/-! ### Lemma 4.3 -/

/-- Lemma 4.3(a), first step: for `‖ζ‖ ≤ 1`, `‖1 + Σ_{k<K} α_k ζ^{k+1}‖ ≥ 1 - Σ |α_k|`. -/
lemma poly_norm_ge (K : ℕ) (α : ℕ → ℝ) (ζ : ℂ) (hζ : ‖ζ‖ ≤ 1) :
    1 - ∑ k ∈ range K, |α k| ≤ ‖1 + ∑ k ∈ range K, (α k : ℂ) * ζ ^ (k + 1)‖ := by
  have h1 : ‖∑ k ∈ range K, (α k : ℂ) * ζ ^ (k + 1)‖ ≤ ∑ k ∈ range K, |α k| := by
    refine (norm_sum_le _ _).trans (Finset.sum_le_sum (fun k _ => ?_))
    rw [norm_mul, Complex.norm_real, Real.norm_eq_abs, norm_pow]
    have : ‖ζ‖ ^ (k + 1) ≤ 1 := pow_le_one₀ (norm_nonneg _) hζ
    nlinarith [abs_nonneg (α k)]
  have h2 := norm_sub_norm_le (1 : ℂ) (-(∑ k ∈ range K, (α k : ℂ) * ζ ^ (k + 1)))
  rw [sub_neg_eq_add, norm_neg, norm_one] at h2
  linarith

/-- Lemma 4.3(a), second step (minimum modulus principle): an entire function without zeros
on the closed unit disc that is `≥ m > 0` in modulus on the unit circle is `≥ m` on the
closed unit disc. -/
theorem min_modulus_disc (F : ℂ → ℂ) (hF : Differentiable ℂ F)
    (hz : ∀ ζ ∈ closedBall (0 : ℂ) 1, F ζ ≠ 0) (m : ℝ) (hm : 0 < m)
    (hcirc : ∀ ζ ∈ sphere (0 : ℂ) 1, m ≤ ‖F ζ‖) :
    ∀ ζ ∈ closedBall (0 : ℂ) 1, m ≤ ‖F ζ‖ := by
  intro ζ hζ
  set g : ℂ → ℂ := fun z => (F z)⁻¹ with hg
  have hdiff : DifferentiableOn ℂ g (closedBall (0 : ℂ) 1) := by
    intro z hzm
    exact ((hF z).inv (hz z hzm)).differentiableWithinAt
  have hcl : closure (ball (0 : ℂ) 1) = closedBall 0 1 := closure_ball 0 one_ne_zero
  have hfr : frontier (ball (0 : ℂ) 1) = sphere 0 1 := frontier_ball 0 one_ne_zero
  have hDC : DiffContOnCl ℂ g (ball (0 : ℂ) 1) := by
    rw [← hcl] at hdiff
    exact hdiff.diffContOnCl
  have hbound : ∀ z ∈ frontier (ball (0 : ℂ) 1), ‖g z‖ ≤ m⁻¹ := by
    intro z hzf
    rw [hfr] at hzf
    have := hcirc z hzf
    rw [hg, norm_inv]
    exact inv_anti₀ hm this
  have hmem : ζ ∈ closure (ball (0 : ℂ) 1) := by rw [hcl]; exact hζ
  have h := Complex.norm_le_of_forall_mem_frontier_norm_le isBounded_ball hDC hbound hmem
  rw [hg, norm_inv] at h
  have hpos : 0 < ‖F ζ‖ := norm_pos_iff.mpr (hz ζ hζ)
  exact (inv_le_inv₀ hpos hm).mp h

/-- Lemma 4.3(a), assembly: if `‖c - Π_q F_q‖ ≤ δ₀` and `m_q ≤ ‖F_q‖` with `0 ≤ m_q`, then
`‖c‖ ≥ Π_q m_q - δ₀`. -/
lemma c1_lower_bound {σ : Type*} (S : Finset σ) (c : ℂ) (F : σ → ℂ) (m : σ → ℝ) (δ₀ : ℝ)
    (hm0 : ∀ q ∈ S, 0 ≤ m q) (hm : ∀ q ∈ S, m q ≤ ‖F q‖)
    (hδ : ‖c - ∏ q ∈ S, F q‖ ≤ δ₀) :
    (∏ q ∈ S, m q) - δ₀ ≤ ‖c‖ := by
  have hP : ∏ q ∈ S, m q ≤ ‖∏ q ∈ S, F q‖ := by
    rw [norm_prod]
    exact Finset.prod_le_prod₀ hm0 hm
  have := norm_sub_norm_le (∏ q ∈ S, F q) c
  rw [norm_sub_rev] at this
  linarith

/-- Lemma 4.3(c): a polynomial with real coefficients commutes with conjugation, so
`|F(w̄)| = |F(w)|`. -/
lemma poly_conj (K : ℕ) (α : ℕ → ℝ) (ζ : ℂ) :
    ‖∑ k ∈ range K, (α k : ℂ) * (starRingEnd ℂ ζ) ^ k‖ = ‖∑ k ∈ range K, (α k : ℂ) * ζ ^ k‖ := by
  have : ∑ k ∈ range K, (α k : ℂ) * (starRingEnd ℂ ζ) ^ k =
      starRingEnd ℂ (∑ k ∈ range K, (α k : ℂ) * ζ ^ k) := by
    rw [map_sum]
    refine Finset.sum_congr rfl (fun k _ => ?_)
    rw [map_mul, map_pow, Complex.conj_ofReal]
  rw [this, Complex.norm_conj]

/-! ### Lemma 4.4 (weak duality, + probe only) -/

/-- **Lemma 4.4.** `f q` even, `ℓ q ≥ log g⁺_q` pointwise, the − probe given by
`log g⁻_q(φ) = log g⁺_q(-φ)` (Lemma 4.3(c)), `P(θ) = max_s Σ_q log g^s_q(θ_q)`.
If `U q ≥ f q φ + lam * ℓ q φ` for all `φ` (an upper bound for the one-prime supremum) and
`lam ≥ 0`, then on `{P > G}`, `Σ_q f q (θ q) ≤ Σ_q U q - lam G`. -/
theorem weak_duality {σ : Type*} (S : Finset σ) (f ℓ lg : σ → ℝ → ℝ) (lam G : ℝ)
    (hlam : 0 ≤ lam) (heven : ∀ q φ, f q (-φ) = f q φ) (hℓ : ∀ q φ, lg q φ ≤ ℓ q φ)
    (U' : σ → ℝ) (hU : ∀ q φ, f q φ + lam * ℓ q φ ≤ U' q) (θ : σ → ℝ)
    (hP : G < max (∑ q ∈ S, lg q (θ q)) (∑ q ∈ S, lg q (-θ q))) :
    ∑ q ∈ S, f q (θ q) ≤ ∑ q ∈ S, U' q - lam * G := by
  -- one probe suffices once θ is replaced by ±θ
  have core : ∀ θ' : σ → ℝ, G < ∑ q ∈ S, lg q (θ' q) →
      ∑ q ∈ S, f q (θ' q) ≤ ∑ q ∈ S, U' q - lam * G := by
    intro θ' h
    have h1 : lam * G ≤ lam * ∑ q ∈ S, ℓ q (θ' q) := by
      apply mul_le_mul_of_nonneg_left _ hlam
      exact h.le.trans (Finset.sum_le_sum (fun q _ => hℓ q (θ' q)))
    have h2 : ∑ q ∈ S, (f q (θ' q) + lam * ℓ q (θ' q)) ≤ ∑ q ∈ S, U' q :=
      Finset.sum_le_sum (fun q _ => hU q (θ' q))
    rw [Finset.sum_add_distrib, ← Finset.mul_sum] at h2
    linarith
  rcases lt_max_iff.mp hP with h | h
  · exact core θ h
  · have := core (fun q => -θ q) h
    simpa [heven] using this

/-! ### Lemma 4.1: monotonicity of β, V, dV, hi in (B2, A2, Wn) -/

/-- `β = (1 + ε) B2/(1 - Wn²)` is nondecreasing in `B2 ≥ 0` and `Wn ∈ [0, 1)`. -/
lemma beta_mono (ε B B' W W' : ℝ) (hε : 0 ≤ ε) (hB : 0 ≤ B) (hBB : B ≤ B')
    (hW : 0 ≤ W) (hWW : W ≤ W') (hW1 : W' < 1) :
    (1 + ε) * B / (1 - W ^ 2) ≤ (1 + ε) * B' / (1 - W' ^ 2) := by
  have h1 : 0 < 1 - W' ^ 2 := by nlinarith
  have h2 : 1 - W' ^ 2 ≤ 1 - W ^ 2 := by nlinarith
  calc (1 + ε) * B / (1 - W ^ 2) ≤ (1 + ε) * B / (1 - W' ^ 2) :=
        div_le_div_of_nonneg_left (by positivity) h1 h2
    _ ≤ (1 + ε) * B' / (1 - W' ^ 2) := by
        apply div_le_div_of_nonneg_right _ h1.le
        exact mul_le_mul_of_nonneg_left hBB (by linarith)

/-- `V = A2/(1 - Wn)` is nondecreasing. -/
lemma V_mono (A A' W W' : ℝ) (hA : 0 ≤ A) (hAA : A ≤ A') (hWW : W ≤ W') (hW1 : W' < 1) :
    A / (1 - W) ≤ A' / (1 - W') := by
  have h1 : 0 < 1 - W' := by linarith
  calc A / (1 - W) ≤ A / (1 - W') := div_le_div_of_nonneg_left hA h1 (by linarith)
    _ ≤ A' / (1 - W') := div_le_div_of_nonneg_right hAA h1.le

/-- `dV = B2/(1 - Wn)` is nondecreasing (same statement as `V_mono`). -/
lemma dV_mono (B B' W W' : ℝ) (hB : 0 ≤ B) (hBB : B ≤ B') (hWW : W ≤ W') (hW1 : W' < 1) :
    B / (1 - W) ≤ B' / (1 - W') := V_mono B B' W W' hB hBB hWW hW1

/-- `hi = dV · V/(1 - V)` is nondecreasing in (B2, A2, Wn) on `{Wn < 1, V < 1}`. -/
lemma hi_mono (A A' B B' W W' : ℝ) (hA : 0 ≤ A) (hAA : A ≤ A') (hB : 0 ≤ B) (hBB : B ≤ B')
    (hWW : W ≤ W') (hW1 : W' < 1) (hV1 : A' / (1 - W') < 1) :
    (B / (1 - W)) * (A / (1 - W)) / (1 - A / (1 - W)) ≤
      (B' / (1 - W')) * (A' / (1 - W')) / (1 - A' / (1 - W')) := by
  have hW1' : W < 1 := lt_of_le_of_lt hWW hW1
  have hV : A / (1 - W) ≤ A' / (1 - W') := V_mono A A' W W' hA hAA hWW hW1
  have hdV : B / (1 - W) ≤ B' / (1 - W') := dV_mono B B' W W' hB hBB hWW hW1
  have hV0 : 0 ≤ A / (1 - W) := div_nonneg hA (by linarith)
  have hdV0 : 0 ≤ B / (1 - W) := div_nonneg hB (by linarith)
  have hden : 0 < 1 - A' / (1 - W') := by linarith
  have hden2 : 1 - A' / (1 - W') ≤ 1 - A / (1 - W) := by linarith
  calc (B / (1 - W)) * (A / (1 - W)) / (1 - A / (1 - W))
      ≤ (B / (1 - W)) * (A / (1 - W)) / (1 - A' / (1 - W')) :=
        div_le_div_of_nonneg_left (by positivity) hden hden2
    _ ≤ (B' / (1 - W')) * (A' / (1 - W')) / (1 - A' / (1 - W')) := by
        apply div_le_div_of_nonneg_right _ hden.le
        exact mul_le_mul hdV hV hV0 (hdV0.trans hdV)

/-! ### Lemma 5.3(a): the one-prime inverse recursion -/

/-- **Lemma 5.3(a), induction step.**  Suppose for every `k > K` (with `K ≥ Kq ≥ 1`)
`ψ k = -Σ_{i=1}^{Kq} β i ψ (k - i)`, with `β i ≥ 0` and `Σ β i ≤ 1`, and `|ψ j| ≤ C` for
`K - Kq < j ≤ K`.  Then `|ψ k| ≤ C` for every `k > K - Kq`, in particular for every `k > K`. -/
theorem recursion_bound (ψ β : ℕ → ℝ) (K Kq : ℕ) (hKq : 1 ≤ Kq) (hK : Kq ≤ K) (C : ℝ)
    (hβ : ∀ i, 0 ≤ β i) (hs : ∑ i ∈ Finset.Icc 1 Kq, β i ≤ 1)
    (hrec : ∀ k, K < k → ψ k = -∑ i ∈ Finset.Icc 1 Kq, β i * ψ (k - i))
    (hC : ∀ j, K - Kq < j → j ≤ K → |ψ j| ≤ C) :
    ∀ k, K - Kq < k → |ψ k| ≤ C := by
  have hC0 : 0 ≤ C := (abs_nonneg _).trans (hC K (by omega) le_rfl)
  intro k
  induction k using Nat.strong_induction_on with
  | _ k ih =>
    intro hk
    by_cases hkK : k ≤ K
    · exact hC k hk hkK
    · push Not at hkK
      rw [hrec k hkK, abs_neg]
      calc |∑ i ∈ Finset.Icc 1 Kq, β i * ψ (k - i)|
          ≤ ∑ i ∈ Finset.Icc 1 Kq, |β i * ψ (k - i)| := Finset.abs_sum_le_sum_abs _ _
        _ ≤ ∑ i ∈ Finset.Icc 1 Kq, β i * C := by
            refine Finset.sum_le_sum (fun i hi => ?_)
            rw [abs_mul, abs_of_nonneg (hβ i)]
            have hi' := Finset.mem_Icc.mp hi
            exact mul_le_mul_of_nonneg_left (ih (k - i) (by omega) (by omega)) (hβ i)
        _ = (∑ i ∈ Finset.Icc 1 Kq, β i) * C := by rw [Finset.sum_mul]
        _ ≤ 1 * C := mul_le_mul_of_nonneg_right hs hC0
        _ = C := one_mul C

/-! ### Lemma 5.3(c): head-subtracted far tail -/

/-- Lemma 5.3(c), logarithmic part: `(log m) m^{-δ} ≤ (log X) X^{-δ}` for `m ≥ X ≥ e^{1/δ}`. -/
lemma logrpow_le (δ X m : ℝ) (hδ : 0 < δ) (hX : Real.exp (1 / δ) ≤ X) (hm : X ≤ m) :
    Real.log m / m ^ δ ≤ Real.log X / X ^ δ :=
  Real.log_div_self_rpow_antitoneOn hδ (by simpa [one_div] using hX)
    (by simpa [one_div] using hX.trans hm) hm

/-- Lemma 5.3(c), plain tail: for nonnegative `f` with `Σ f_m m^δ ≤ N` (summable),
`Σ_{m>X} f_m ≤ X^{-δ} (N - Σ_{m≤X} f_m m^δ)`, `X ≥ 1` a natural number. -/
theorem tail_le_weighted (f : ℕ → ℝ) (hf : ∀ m, 0 ≤ f m) (δ : ℝ) (hδ : 0 ≤ δ) (X : ℕ)
    (hX : 1 ≤ X) (N : ℝ) (hsum : Summable (fun m : ℕ => f m * (m : ℝ) ^ δ))
    (hN : ∑' m : ℕ, f m * (m : ℝ) ^ δ ≤ N) :
    ∑' m : ℕ, (if X < m then f m else 0) ≤
      ((X : ℝ) ^ δ)⁻¹ * (N - ∑ m ∈ range (X + 1), f m * (m : ℝ) ^ δ) := by
  have hXpos : (0 : ℝ) < (X : ℝ) := by exact_mod_cast hX
  have hXδ : 0 < (X : ℝ) ^ δ := Real.rpow_pos_of_pos hXpos δ
  -- pointwise: 1_{m>X} f_m ≤ X^{-δ} 1_{m>X} f_m m^δ
  set g : ℕ → ℝ := fun m => if X < m then f m * (m : ℝ) ^ δ else 0 with hg
  have hpt : ∀ m, (if X < m then f m else 0) ≤ ((X : ℝ) ^ δ)⁻¹ * g m := by
    intro m
    by_cases h : X < m
    · simp only [h, ite_true, hg]
      have hm1 : (X : ℝ) ≤ m := by exact_mod_cast h.le
      have : (X : ℝ) ^ δ ≤ (m : ℝ) ^ δ := Real.rpow_le_rpow hXpos.le hm1 hδ
      rw [inv_mul_eq_div, le_div_iff₀ hXδ]
      exact mul_le_mul_of_nonneg_left this (hf m)
    · simp [h, hg]
  have hgs : Summable g := by
    refine Summable.of_nonneg_of_le (fun m => ?_) (fun m => ?_) hsum
    · simp only [hg]; split_ifs
      · exact mul_nonneg (hf m) (Real.rpow_nonneg (Nat.cast_nonneg _) _)
      · exact le_refl 0
    · simp only [hg]; split_ifs
      · exact le_rfl
      · exact mul_nonneg (hf m) (Real.rpow_nonneg (Nat.cast_nonneg _) _)
  have hls : Summable (fun m : ℕ => if X < m then f m else 0) := by
    refine Summable.of_nonneg_of_le (fun m => ?_) hpt (hgs.mul_left _)
    split_ifs
    · exact hf m
    · exact le_refl 0
  -- Σ g = Σ (f m^δ) - head
  have hsplit : ∑' m, f m * (m : ℝ) ^ δ =
      ∑ m ∈ range (X + 1), f m * (m : ℝ) ^ δ + ∑' m, g m := by
    rw [← hsum.sum_add_tsum_nat_add (X + 1)]
    congr 1
    rw [← (hgs.sum_add_tsum_nat_add (X + 1))]
    have h0 : ∑ m ∈ range (X + 1), g m = 0 := by
      refine Finset.sum_eq_zero (fun m hm => ?_)
      have : ¬ X < m := by have := Finset.mem_range.mp hm; omega
      simp [hg, this]
    rw [h0, zero_add]
    congr 1
    funext k
    have : X < k + (X + 1) := by omega
    simp [hg, this]
  calc ∑' m : ℕ, (if X < m then f m else 0) ≤ ∑' m, ((X : ℝ) ^ δ)⁻¹ * g m :=
        hls.tsum_le_tsum hpt (hgs.mul_left _)
    _ = ((X : ℝ) ^ δ)⁻¹ * ∑' m, g m := tsum_mul_left
    _ ≤ ((X : ℝ) ^ δ)⁻¹ * (N - ∑ m ∈ range (X + 1), f m * (m : ℝ) ^ δ) := by
        apply mul_le_mul_of_nonneg_left _ (inv_nonneg.mpr hXδ.le)
        linarith

end Route40
