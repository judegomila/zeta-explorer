import RequestProject.FrozenRung.Inertia

/-!
# The Schur/de Branges kernel and the modulus witness

`schurKernel Θ` is the kernel attached to a function `Θ` on the right half plane.  Its diagonal
value at `z` with `Re z > 0` has negative real part exactly when `‖Θ z‖ > 1`
(`modulus_witness`), which immediately produces a one-dimensional negative subspace for any
Gram matrix built from a mesh containing such a point
(`one_le_negIndex_gram_of_modulus_gt_one`).
-/

namespace FrozenRung

open scoped ComplexConjugate

/-- The Schur kernel attached to `Θ`. -/
noncomputable def schurKernel (Th : ℂ → ℂ) (z w : ℂ) : ℂ :=
  (1 - Th z * conj (Th w)) / (2 * (Real.pi : ℂ) * (z + conj w))

/-- **Modulus witness.**  If `Re z > 0` and `‖Θ z‖ > 1`, the diagonal Schur-kernel entry at `z`
has negative real part. -/
theorem modulus_witness {Th : ℂ → ℂ} {z : ℂ} (hz : 0 < z.re) (hTh : 1 < ‖Th z‖) :
    (schurKernel Th z z).re < 0 := by
  have h1 : Th z * conj (Th z) = ((‖Th z‖ ^ 2 : ℝ) : ℂ) := by
    rw [Complex.mul_conj']
    push_cast
    ring
  have h2 : z + conj z = ((2 * z.re : ℝ) : ℂ) := by
    rw [Complex.add_conj]
  have hden : (2 : ℂ) * (Real.pi : ℂ) * ((2 * z.re : ℝ) : ℂ)
      = ((4 * Real.pi * z.re : ℝ) : ℂ) := by
    push_cast; ring
  have hkey : schurKernel Th z z
      = (((1 - ‖Th z‖ ^ 2) / (4 * Real.pi * z.re) : ℝ) : ℂ) := by
    rw [schurKernel, h1, h2, hden]
    push_cast
    ring
  rw [hkey, Complex.ofReal_re]
  have hnum : 1 - ‖Th z‖ ^ 2 < 0 := by nlinarith [norm_nonneg (Th z)]
  have hdpos : 0 < 4 * Real.pi * z.re := by
    have := Real.pi_pos
    positivity
  exact div_neg_of_neg_of_pos hnum hdpos

/-- **Composition endpoint.**  A mesh point with positive real part at which `‖Θ‖ > 1` certifies
a negative eigenvalue of the Schur Gram matrix of the mesh. -/
theorem one_le_negIndex_gram_of_modulus_gt_one {ι : Type*} [Fintype ι] [DecidableEq ι]
    {Th : ℂ → ℂ} (zs : ι → ℂ) (i : ι) (hz : 0 < (zs i).re) (hTh : 1 < ‖Th (zs i)‖) :
    1 ≤ negIndex (gramMatrix (schurKernel Th) zs) :=
  one_le_negIndex_of_one_mem _
    (one_mem_negDims_of_diag_neg _ i (modulus_witness hz hTh))

end FrozenRung
