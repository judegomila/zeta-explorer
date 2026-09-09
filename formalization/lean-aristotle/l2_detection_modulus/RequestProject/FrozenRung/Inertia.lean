import Mathlib

/-!
# Inertia: negative index of a Hermitian-type kernel matrix, and Gram matrices

This file provides the two banked interfaces `negIndex` and `gramMatrix` used by the
detection-modulus development (`FrozenRung.Kernels`, `FrozenRung.Detection`).

`negDims M` is the set of dimensions of subspaces of `n → ℂ` on which the quadratic form
`x ↦ xᴴ M x` has negative real part away from `0`; `negIndex M` is the supremum of that set,
i.e. the negative index of inertia of `M`.
-/

namespace FrozenRung

open scoped ComplexConjugate

variable {n : Type*} [Fintype n]

/-- The set of dimensions of subspaces of `n → ℂ` on which the quadratic form associated to
`M` is negative (in real part) away from the origin. -/
def negDims (M : Matrix n n ℂ) : Set ℕ :=
  {k : ℕ | ∃ V : Submodule ℂ (n → ℂ), Module.finrank ℂ V = k ∧
      ∀ x ∈ V, x ≠ 0 → (star x ⬝ᵥ M.mulVec x).re < 0}

/-- The negative index of inertia of `M`. -/
noncomputable def negIndex (M : Matrix n n ℂ) : ℕ := sSup (negDims M)

/-- The Gram matrix of a kernel `K` at the sample points `z`. -/
def gramMatrix {ι : Type*} (K : ℂ → ℂ → ℂ) (z : ι → ℂ) : Matrix ι ι ℂ :=
  fun i j => K (z i) (z j)

theorem negDims_bddAbove (M : Matrix n n ℂ) : BddAbove (negDims M) := by
  refine ⟨Fintype.card n, ?_⟩
  rintro k ⟨V, rfl, -⟩
  have h := V.finrank_le
  simpa [Module.finrank_pi] using h

theorem one_le_negIndex_of_one_mem (M : Matrix n n ℂ) (h : 1 ∈ negDims M) :
    1 ≤ negIndex M :=
  le_csSup (negDims_bddAbove M) h

/-- A single index at which the diagonal entry of `M` has negative real part already forces a
one-dimensional negative subspace. -/
theorem one_mem_negDims_of_diag_neg [DecidableEq n] (M : Matrix n n ℂ) (i : n)
    (hii : (M i i).re < 0) : 1 ∈ negDims M := by
  have hne : (Pi.single i (1 : ℂ) : n → ℂ) ≠ 0 := by
    intro h
    have h1 : (Pi.single i (1 : ℂ) : n → ℂ) i = (0 : n → ℂ) i := by rw [h]
    simp at h1
  refine ⟨Submodule.span ℂ {(Pi.single i (1 : ℂ) : n → ℂ)}, finrank_span_singleton hne, ?_⟩
  intro x hx hx0
  rw [Submodule.mem_span_singleton] at hx
  obtain ⟨c, rfl⟩ := hx
  have hsingle : c • (Pi.single i (1 : ℂ) : n → ℂ) = Pi.single i c := by
    ext j; by_cases h : j = i <;> simp [Pi.single_apply, h]
  have hc : c ≠ 0 := by
    rintro rfl
    exact hx0 (by simp)
  have hstar : star (Pi.single i c : n → ℂ) = Pi.single i (starRingEnd ℂ c) := by
    ext j; by_cases h : j = i <;> simp [Pi.single_apply, h]
  have hmv : M.mulVec (Pi.single i c : n → ℂ) = fun j => M j i * c := by
    ext j; simp [Matrix.mulVec, dotProduct, Pi.single_apply]
  have hval : star (Pi.single i c : n → ℂ) ⬝ᵥ M.mulVec (Pi.single i c : n → ℂ)
      = ((‖c‖ ^ 2 : ℝ) : ℂ) * M i i := by
    rw [hstar, hmv, single_dotProduct,
      show (starRingEnd ℂ) c * (M i i * c) = (c * (starRingEnd ℂ) c) * M i i by ring,
      Complex.mul_conj']
    push_cast
    ring
  rw [hsingle, hval]
  have hcpos : (0 : ℝ) < ‖c‖ ^ 2 := by positivity
  rw [Complex.mul_re, Complex.ofReal_re, Complex.ofReal_im, zero_mul, sub_zero]
  exact mul_neg_of_pos_of_neg hcpos hii

end FrozenRung
