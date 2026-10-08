/-
Route 40 (b9) — wol-pd lemma L3 (cosine majorant), formal version.

Source: formalization/paper/wol-pd-lemmas.md §3, Lemma 3.1 and Lemma 3.2.
Compiled against Mathlib d13f23b7 / Lean 4.34.1 (tree /tmp/qrh-verify/lean), see
tmp/routes-b9-r40-lean/check.sh.  Not part of the DeBruijnNewman lake target.

Abstraction used.  The torus phase ⟨e(m), θ⟩ of the paper is an arbitrary real number φ i
here (index i ranges over the m > 1 monomials of the label), so the statement is proved for
every θ at once and for arbitrary finite index sets.  The m = 1 coefficient enters only
through X0 = H(0).
-/
import Mathlib

open Complex Finset

namespace Route40

/-- `‖e^{iφ} - 1‖² = 2 (1 - cos φ)`. -/
lemma norm_exp_sub_one_sq (φ : ℝ) :
    ‖Complex.exp (φ * I) - 1‖ ^ 2 = 2 * (1 - Real.cos φ) := by
  rw [Complex.sq_norm, Complex.normSq_apply]
  have hre : (Complex.exp (φ * I) - 1).re = Real.cos φ - 1 := by
    simp [Complex.exp_ofReal_mul_I_re]
  have him : (Complex.exp (φ * I) - 1).im = Real.sin φ := by
    simp [Complex.exp_ofReal_mul_I_im]
  rw [hre, him]
  nlinarith [Real.sin_sq_add_cos_sq φ]

/-- Real part of `c (e^{iφ} - 1)` for real `c`. -/
lemma re_mul_exp_sub_one (c φ : ℝ) :
    ((c : ℂ) * (Complex.exp (φ * I) - 1)).re = -(c * (1 - Real.cos φ)) := by
  simp [Complex.exp_ofReal_mul_I_re]
  ring

/-- **Lemma 3.1 (one label), wol-pd-lemmas.md.**
For a finite family of real coefficients `c i` with phases `φ i`, put
`H = X0 + Σ c i (e^{iφ i} - 1)` (so `X0 = H(0)`) and `S1 = Σ |c i|`.  For every `lam > 0`,
`‖H‖ ≤ (lam² + X0²)/(2 lam) + Σ ((-X0 c i + S1 |c i|)/lam) (1 - cos φ i)`. -/
theorem lemma_3_1 {ι : Type*} (s : Finset ι) (c φ : ι → ℝ) (X0 lam : ℝ) (hlam : 0 < lam) :
    ‖(X0 : ℂ) + ∑ i ∈ s, (c i : ℂ) * (Complex.exp (φ i * I) - 1)‖ ≤
      (lam ^ 2 + X0 ^ 2) / (2 * lam) +
        ∑ i ∈ s, ((-X0 * c i + (∑ j ∈ s, |c j|) * |c i|) / lam) * (1 - Real.cos (φ i)) := by
  set dX : ℂ := ∑ i ∈ s, (c i : ℂ) * (Complex.exp (φ i * I) - 1) with hdX
  set S1 : ℝ := ∑ j ∈ s, |c j| with hS1
  set H : ℂ := (X0 : ℂ) + dX with hH
  -- real part of dX
  have hre : dX.re = -∑ i ∈ s, c i * (1 - Real.cos (φ i)) := by
    rw [hdX, Complex.re_sum]
    simp only [re_mul_exp_sub_one, Finset.sum_neg_distrib]
  -- |dX| ≤ Σ |c i| u i, u i = ‖e^{iφ}-1‖
  set u : ι → ℝ := fun i => ‖Complex.exp (φ i * I) - 1‖ with hu
  have hdX_le : ‖dX‖ ≤ ∑ i ∈ s, |c i| * u i := by
    rw [hdX]
    refine (norm_sum_le _ _).trans (le_of_eq ?_)
    refine Finset.sum_congr rfl (fun i _ => ?_)
    rw [norm_mul, Complex.norm_real, Real.norm_eq_abs]
  -- Cauchy–Schwarz: (Σ |c| u)² ≤ S1 Σ |c| u²
  have hCS : (∑ i ∈ s, |c i| * u i) ^ 2 ≤ S1 * ∑ i ∈ s, |c i| * u i ^ 2 := by
    have := Finset.sum_mul_sq_le_sq_mul_sq s (fun i => Real.sqrt |c i|)
      (fun i => Real.sqrt |c i| * u i)
    have e1 : ∀ i, Real.sqrt |c i| * (Real.sqrt |c i| * u i) = |c i| * u i := by
      intro i
      rw [← mul_assoc, Real.mul_self_sqrt (abs_nonneg _)]
    have e2 : ∀ i, Real.sqrt |c i| ^ 2 = |c i| := fun i => Real.sq_sqrt (abs_nonneg _)
    have e3 : ∀ i, (Real.sqrt |c i| * u i) ^ 2 = |c i| * u i ^ 2 := by
      intro i; rw [mul_pow, e2]
    simp only [e1, e2, e3] at this
    simpa [hS1] using this
  have hu2 : ∀ i, u i ^ 2 = 2 * (1 - Real.cos (φ i)) := fun i => norm_exp_sub_one_sq (φ i)
  have hdX2 : ‖dX‖ ^ 2 ≤ S1 * ∑ i ∈ s, |c i| * (2 * (1 - Real.cos (φ i))) := by
    have h0 : 0 ≤ ‖dX‖ := norm_nonneg _
    have : ‖dX‖ ^ 2 ≤ (∑ i ∈ s, |c i| * u i) ^ 2 := by
      exact pow_le_pow_left₀ h0 hdX_le 2
    simpa [hu2] using this.trans hCS
  -- ‖H‖² = X0² + 2 X0 re dX + ‖dX‖²
  have hH2 : ‖H‖ ^ 2 = X0 ^ 2 + 2 * X0 * dX.re + ‖dX‖ ^ 2 := by
    rw [hH, Complex.sq_norm, Complex.sq_norm, Complex.normSq_add]
    simp [Complex.normSq_ofReal]
    ring
  -- AM-GM: ‖H‖ ≤ (lam² + ‖H‖²)/(2 lam)
  have hAM : ‖H‖ ≤ (lam ^ 2 + ‖H‖ ^ 2) / (2 * lam) := by
    rw [le_div_iff₀ (by positivity)]
    nlinarith [sq_nonneg (lam - ‖H‖)]
  -- combine
  have key : ‖H‖ ^ 2 ≤ X0 ^ 2 +
      ∑ i ∈ s, (-2 * X0 * c i + 2 * S1 * |c i|) * (1 - Real.cos (φ i)) := by
    rw [hH2, hre]
    have hsplit : ∑ i ∈ s, (-2 * X0 * c i + 2 * S1 * |c i|) * (1 - Real.cos (φ i)) =
        2 * X0 * (-∑ i ∈ s, c i * (1 - Real.cos (φ i))) +
          S1 * ∑ i ∈ s, |c i| * (2 * (1 - Real.cos (φ i))) := by
      clear_value S1
      rw [mul_neg, Finset.mul_sum, Finset.mul_sum, ← Finset.sum_neg_distrib,
        ← Finset.sum_add_distrib]
      refine Finset.sum_congr rfl (fun i _ => ?_)
      ring
    rw [hsplit]
    linarith
  calc ‖H‖ ≤ (lam ^ 2 + ‖H‖ ^ 2) / (2 * lam) := hAM
    _ ≤ (lam ^ 2 + (X0 ^ 2 +
          ∑ i ∈ s, (-2 * X0 * c i + 2 * S1 * |c i|) * (1 - Real.cos (φ i)))) / (2 * lam) := by
        gcongr
    _ = (lam ^ 2 + X0 ^ 2) / (2 * lam) +
          ∑ i ∈ s, ((-X0 * c i + S1 * |c i|) / lam) * (1 - Real.cos (φ i)) := by
        rw [← add_assoc, add_div, Finset.sum_div]
        congr 1
        · refine Finset.sum_congr rfl (fun i _ => ?_)
          field_simp

/-- **Lemma 3.2 (assembly), wol-pd-lemmas.md, inequality (3.2).**
`K(θ) = κ0 + Σ_m κ m cos φ m` (κ0 = the m = 1 coefficient), labels `r ∈ J` with data
`H_r = X0 r + Σ_m c m r (e^{iφ m} - 1)` and `lam r > 0`.  Then
`K + Σ_r ‖H_r‖ ≤ C + Σ_m M m (1 - cos φ m)` with
`C = κ0 + Σ_m κ m + Σ_r (lam r² + X0 r²)/(2 lam r)` and
`M m = -κ m + Σ_r (-X0 r c m r + S1 r |c m r|)/lam r`. -/
theorem lemma_3_2 {ι κι : Type*} (s : Finset ι) (J : Finset κι) (φ : ι → ℝ)
    (κ0 : ℝ) (κ : ι → ℝ) (X0 lam : κι → ℝ) (c : ι → κι → ℝ) (hlam : ∀ r ∈ J, 0 < lam r) :
    (κ0 + ∑ i ∈ s, κ i * Real.cos (φ i)) +
        ∑ r ∈ J, ‖(X0 r : ℂ) + ∑ i ∈ s, (c i r : ℂ) * (Complex.exp (φ i * I) - 1)‖ ≤
      (κ0 + ∑ i ∈ s, κ i + ∑ r ∈ J, (lam r ^ 2 + X0 r ^ 2) / (2 * lam r)) +
        ∑ i ∈ s, (-κ i + ∑ r ∈ J,
            (-X0 r * c i r + (∑ j ∈ s, |c j r|) * |c i r|) / lam r) * (1 - Real.cos (φ i)) := by
  have hK : κ0 + ∑ i ∈ s, κ i * Real.cos (φ i) =
      κ0 + ∑ i ∈ s, κ i + ∑ i ∈ s, (-κ i) * (1 - Real.cos (φ i)) := by
    rw [add_assoc, ← Finset.sum_add_distrib]
    congr 1
    refine Finset.sum_congr rfl (fun i _ => ?_)
    ring
  have hL : ∑ r ∈ J, ‖(X0 r : ℂ) + ∑ i ∈ s, (c i r : ℂ) * (Complex.exp (φ i * I) - 1)‖ ≤
      ∑ r ∈ J, ((lam r ^ 2 + X0 r ^ 2) / (2 * lam r) +
        ∑ i ∈ s, ((-X0 r * c i r + (∑ j ∈ s, |c j r|) * |c i r|) / lam r) *
          (1 - Real.cos (φ i))) :=
    Finset.sum_le_sum (fun r hr => lemma_3_1 s (fun i => c i r) φ (X0 r) (lam r) (hlam r hr))
  rw [hK]
  refine (add_le_add (le_refl _) hL).trans (le_of_eq ?_)
  rw [Finset.sum_add_distrib, Finset.sum_comm]
  have : ∑ i ∈ s, (-κ i + ∑ r ∈ J,
        (-X0 r * c i r + (∑ j ∈ s, |c j r|) * |c i r|) / lam r) * (1 - Real.cos (φ i)) =
      ∑ i ∈ s, (-κ i) * (1 - Real.cos (φ i)) + ∑ i ∈ s, ∑ r ∈ J,
        ((-X0 r * c i r + (∑ j ∈ s, |c j r|) * |c i r|) / lam r) * (1 - Real.cos (φ i)) := by
    rw [← Finset.sum_add_distrib]
    refine Finset.sum_congr rfl (fun i _ => ?_)
    rw [add_mul, Finset.sum_mul]
  rw [this]
  ring

/-- **Lemma 3.2, separable split step.** Replacing `M` by an upper bound `Mup` and
bounding a mixed monomial by `2 max(0, Mup)`: `M (1 - cos φ) ≤ 2 max 0 Mup` whenever `M ≤ Mup`. -/
lemma mixed_term_le (M Mup φ : ℝ) (h : M ≤ Mup) :
    M * (1 - Real.cos φ) ≤ 2 * max 0 Mup := by
  have h1 : 0 ≤ 1 - Real.cos φ := by linarith [Real.cos_le_one φ]
  have h2 : 1 - Real.cos φ ≤ 2 := by linarith [Real.neg_one_le_cos φ]
  calc M * (1 - Real.cos φ) ≤ Mup * (1 - Real.cos φ) := mul_le_mul_of_nonneg_right h h1
    _ ≤ max 0 Mup * (1 - Real.cos φ) := mul_le_mul_of_nonneg_right (le_max_right _ _) h1
    _ ≤ max 0 Mup * 2 := mul_le_mul_of_nonneg_left h2 (le_max_left _ _)
    _ = 2 * max 0 Mup := by ring

/-- **Lemma 3.3(b) (Lipschitz grid).** If `h` is `Λ`-Lipschitz and every point of a set `A`
lies within `ε` of some grid point `g i` (`i ∈ G`), then `h x ≤ max_i h (g i) + Λ ε` on `A`. -/
lemma lipschitz_grid {ι : Type*} (G : Finset ι) (hG : G.Nonempty) (g : ι → ℝ) (h : ℝ → ℝ)
    (Λ : NNReal) (hh : LipschitzWith Λ h) (ε : ℝ) (A : Set ℝ)
    (hcov : ∀ x ∈ A, ∃ i ∈ G, |x - g i| ≤ ε) :
    ∀ x ∈ A, h x ≤ G.sup' hG (fun i => h (g i)) + Λ * ε := by
  intro x hx
  obtain ⟨i, hi, hxi⟩ := hcov x hx
  have h1 : |h x - h (g i)| ≤ Λ * |x - g i| := by
    have := hh.dist_le_mul x (g i)
    simpa [Real.dist_eq] using this
  have h2 : h (g i) ≤ G.sup' hG (fun i => h (g i)) := Finset.le_sup' (fun i => h (g i)) hi
  have h3 : (Λ : ℝ) * |x - g i| ≤ Λ * ε := mul_le_mul_of_nonneg_left hxi (by positivity)
  linarith [le_abs_self (h x - h (g i))]

end Route40
