import FR.Inertia

/-!
# Kernel algebra: Szegő kernel, Schur-class kernels, Blaschke factors

This file sets up the kernels of §2.1 of `frozen-rung-pt-equivalence.tex` and proves the
pointwise identities used in Part 2 and Part 3:

* `FrozenRung.blaschke_two_point` — the exact two-point identity (3.6),
  `1 - b_α(z) conj (b_α(w)) = 2 Re α (z + conj w) / ((z + conj α)(conj w + α))`;
* `FrozenRung.schurKernel_blaschke` — the resulting rank-one form of `K_{b_α}`;
* `FrozenRung.schurKernel_div` — the Gram splitting identity (3.5),
  `K_{S/B} = (1/B) (K_S - K_B) conj (1/B)`;
* `FrozenRung.schurKernel_self` — the diagonal formula `K_Θ(z,z) = (1-|Θ z|²)/(4π Re z)`;
* `FrozenRung.modulus_witness` and `FrozenRung.one_le_negIndex_gram_of_modulus_gt_one` —
  Proposition 5.1 (the modulus witness), unconditionally.
-/

namespace FrozenRung

open Complex Matrix
open scoped ComplexConjugate

/-- The Szegő kernel of the right half-plane, `k(z,w) = 1 / (2π (z + conj w))`. -/
noncomputable def szego (z w : ℂ) : ℂ := 1 / (2 * (Real.pi : ℂ) * (z + conj w))

/-- The Schur-class kernel of a meromorphic function `Θ`,
`K_Θ(z,w) = (1 - Θ(z) conj (Θ(w))) / (2π (z + conj w))`. -/
noncomputable def schurKernel (Θ : ℂ → ℂ) (z w : ℂ) : ℂ :=
  (1 - Θ z * conj (Θ w)) / (2 * (Real.pi : ℂ) * (z + conj w))

/-- The half-plane Blaschke factor `b_α(w) = (w - α)/(w + conj α)`. -/
noncomputable def blaschke (α w : ℂ) : ℂ := (w - α) / (w + conj α)

theorem schurKernel_one (z w : ℂ) : schurKernel (fun _ => 1) z w = 0 := by
  simp [schurKernel]

/-- **The exact two-point identity (3.6).** -/
theorem blaschke_two_point {α z w : ℂ} (hz : z + conj α ≠ 0) (hw : conj w + α ≠ 0) :
    1 - blaschke α z * conj (blaschke α w) =
      2 * (α.re : ℂ) * (z + conj w) / ((z + conj α) * (conj w + α)) := by
  have hconj : conj (blaschke α w) = (conj w - conj α) / (conj w + α) := by
    simp [blaschke, map_div₀]
  have hre : (2 : ℂ) * (α.re : ℂ) = α + conj α := by
    rw [Complex.add_conj]; push_cast; ring
  rw [blaschke, hconj, hre]
  field_simp
  ring

/-- The Schur kernel of a Blaschke factor is the rank-one positive kernel
`K_{b_α}(z,w) = (Re α / π) (z + conj α)⁻¹ conj ((w + conj α)⁻¹)`. -/
theorem schurKernel_blaschke {α z w : ℂ} (hz : z + conj α ≠ 0) (hw : conj w + α ≠ 0)
    (hzw : z + conj w ≠ 0) :
    schurKernel (blaschke α) z w =
      ((α.re : ℂ) / (Real.pi : ℂ)) * (1 / (z + conj α)) * conj (1 / (w + conj α)) := by
  have hpi : (Real.pi : ℂ) ≠ 0 := by
    exact_mod_cast Real.pi_ne_zero
  have hcw : conj (1 / (w + conj α)) = 1 / (conj w + α) := by
    simp
  rw [schurKernel, blaschke_two_point hz hw, hcw]
  field_simp

/-- **The Gram splitting identity (3.5).** -/
theorem schurKernel_div {S B : ℂ → ℂ} {z w : ℂ} (hBz : B z ≠ 0) (hBw : B w ≠ 0) :
    schurKernel (fun u => S u / B u) z w =
      (1 / B z) * (schurKernel S z w - schurKernel B z w) * conj (1 / B w) := by
  have hBw' : conj (B w) ≠ 0 := by simpa using (starRingEnd ℂ).injective.ne_iff.2 hBw
  have key : (1 - S z / B z * (conj (S w) / conj (B w)))
      = (B z)⁻¹ * ((1 - S z * conj (S w)) - (1 - B z * conj (B w))) * (conj (B w))⁻¹ := by
    field_simp
    ring
  simp only [schurKernel, map_div₀, map_inv₀, div_sub_div_same, one_div]
  rw [key]
  ring

/-- The diagonal of a Schur kernel: `K_Θ(z,z) = (1 - |Θ z|²)/(4π Re z)`. -/
theorem schurKernel_self {Θ : ℂ → ℂ} {z : ℂ} (hz : z.re ≠ 0) :
    schurKernel Θ z z = (((1 - ‖Θ z‖ ^ 2) / (4 * Real.pi * z.re) : ℝ) : ℂ) := by
  have h1 : z + conj z = ((2 * z.re : ℝ) : ℂ) := by
    rw [Complex.add_conj]
  have h2 : Θ z * conj (Θ z) = ((‖Θ z‖ ^ 2 : ℝ) : ℂ) := by
    rw [Complex.mul_conj, Complex.normSq_eq_norm_sq]
  have hpi : (Real.pi : ℂ) ≠ 0 := by exact_mod_cast Real.pi_ne_zero
  have hzr : ((z.re : ℝ) : ℂ) ≠ 0 := by exact_mod_cast hz
  rw [schurKernel, h1, h2]
  push_cast
  field_simp
  ring

/-- **Proposition 5.1 (modulus witness).** If `|Θ(ẑ)| > 1` at a point of the open right
half-plane, then the diagonal entry `K_Θ(ẑ,ẑ)` of the Gram matrix is negative.  No
factorization theory is used. -/
theorem modulus_witness {Θ : ℂ → ℂ} {z : ℂ} (hz : 0 < z.re) (hΘ : 1 < ‖Θ z‖) :
    (schurKernel Θ z z).re < 0 := by
  rw [schurKernel_self (ne_of_gt hz), Complex.ofReal_re]
  have h1 : 1 - ‖Θ z‖ ^ 2 < 0 := by nlinarith [norm_nonneg (Θ z)]
  have h2 : 0 < 4 * Real.pi * z.re := by
    have := Real.pi_pos
    positivity
  exact div_neg_of_neg_of_pos h1 h2

/-- **Proposition 5.1, certificate form.** A mesh point where `|R_a| > 1` forces the Gram
matrix of `K_{R_a}` to have a negative eigenvalue, so the Lemma 23.3 acceptance gate cannot
pass. -/
theorem one_le_negIndex_gram_of_modulus_gt_one {ι : Type*} [Fintype ι] [DecidableEq ι]
    {Θ : ℂ → ℂ} (zs : ι → ℂ) (i : ι) (hz : 0 < (zs i).re) (hΘ : 1 < ‖Θ (zs i)‖) :
    1 ≤ negIndex (gramMatrix (schurKernel Θ) zs) := by
  refine one_le_negIndex_of_qform_neg (x := Pi.single i 1) ?_ ?_
  · intro h
    have := congrFun h i
    simp at this
  · have hq : qform (gramMatrix (schurKernel Θ) zs) (Pi.single i 1) =
        (schurKernel Θ (zs i) (zs i)).re := by
      unfold qform gramMatrix
      congr 1
      simp [dotProduct, Matrix.mulVec, Pi.single_apply, Finset.sum_ite_eq']
    rw [hq]
    exact modulus_witness hz hΘ

end FrozenRung
