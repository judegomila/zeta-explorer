import Mathlib

/-!
# Inertia theorem for the bridge kernel, finite form

Finite model of the logarithmic derivative of a function of class (H):

  `L z = a z + ∑_k ma k / (z - i γ k) + ∑_j mr j * (1/(z - ρ j) + 1/(z + conj (ρ j)))`

with `a ≥ 0`, axis zeros `i γ k` of weights `ma k > 0`, and `κ` distinct zeros `ρ j` in
`Re > 0` (each paired with `-conj (ρ j)`), weights `mr j > 0`.
Kernel `K z w = (L z + conj (L w)) / (z + conj w)` on
`Ω = {Re z > 0} \ {ρ j}`.

Claims:
 * `kernel_identity`: the termwise (Pick) decomposition of `K`;
 * `form_nonneg_of_constraints`: the Hermitian form of `K` on any finite point set is `≥ 0` on
   the subspace cut out by the `κ` linear conditions `∑_i c i / (z i - ρ j) = 0`
   (so at most `κ` negative squares);
 * `exists_negative_subspace`: some finite point set in `Ω` carries a `κ`-dimensional subspace
   on which the form is negative definite (so at least `κ` negative squares).
Together: the kernel has exactly `κ` negative squares, `κ` = number of distinct zeros in
`Re z > 0`, independent of the weights (multiplicities).
-/

open Finset BigOperators
open scoped ComplexConjugate

noncomputable section

variable {m κ : ℕ}

def Lfun (a : ℝ) (γ ma : Fin m → ℝ) (ρ : Fin κ → ℂ) (mr : Fin κ → ℝ) (z : ℂ) : ℂ :=
  (a : ℂ) * z + ∑ k, (ma k : ℂ) / (z - Complex.I * (γ k : ℂ))
    + ∑ j, (mr j : ℂ) * (1 / (z - ρ j) + 1 / (z + conj (ρ j)))

def Kker (a : ℝ) (γ ma : Fin m → ℝ) (ρ : Fin κ → ℂ) (mr : Fin κ → ℝ) (z w : ℂ) : ℂ :=
  (Lfun a γ ma ρ mr z + conj (Lfun a γ ma ρ mr w)) / (z + conj w)

/-- Hermitian form of the kernel on the points `z i` with coefficients `c i`. -/
def kform (a : ℝ) (γ ma : Fin m → ℝ) (ρ : Fin κ → ℂ) (mr : Fin κ → ℝ)
    {n : ℕ} (z : Fin n → ℂ) (c : Fin n → ℂ) : ℂ :=
  ∑ i, ∑ l, c i * conj (c l) * Kker a γ ma ρ mr (z i) (z l)

theorem kernel_identity (a : ℝ) (γ ma : Fin m → ℝ) (ρ : Fin κ → ℂ) (mr : Fin κ → ℝ)
    (hρ : ∀ j, 0 < (ρ j).re) (z w : ℂ) (hz : 0 < z.re) (hw : 0 < w.re)
    (hzρ : ∀ j, z ≠ ρ j) (hwρ : ∀ j, w ≠ ρ j) :
    Kker a γ ma ρ mr z w
      = (a : ℂ)
        + ∑ k, (ma k : ℂ) / ((z - Complex.I * (γ k : ℂ)) * conj (w - Complex.I * (γ k : ℂ)))
        + ∑ j, (mr j : ℂ) * (1 / ((z - ρ j) * (conj w + ρ j))
                              + 1 / ((z + conj (ρ j)) * (conj w - conj (ρ j)))) := by
  sorry

theorem kform_im_eq_zero (a : ℝ) (γ ma : Fin m → ℝ) (ρ : Fin κ → ℂ) (mr : Fin κ → ℝ)
    (hρ : ∀ j, 0 < (ρ j).re) {n : ℕ} (z : Fin n → ℂ) (c : Fin n → ℂ)
    (hz : ∀ i, 0 < (z i).re) (hzρ : ∀ i j, z i ≠ ρ j) :
    (kform a γ ma ρ mr z c).im = 0 := by
  sorry

/-- Upper bound: at most `κ` negative squares. -/
theorem form_nonneg_of_constraints (a : ℝ) (ha : 0 ≤ a) (γ ma : Fin m → ℝ) (hma : ∀ k, 0 < ma k)
    (ρ : Fin κ → ℂ) (mr : Fin κ → ℝ) (hρ : ∀ j, 0 < (ρ j).re)
    {n : ℕ} (z : Fin n → ℂ) (c : Fin n → ℂ)
    (hz : ∀ i, 0 < (z i).re) (hzρ : ∀ i j, z i ≠ ρ j)
    (hc : ∀ j, ∑ i, c i / (z i - ρ j) = 0) :
    0 ≤ (kform a γ ma ρ mr z c).re := by
  sorry

/-- Lower bound: at least `κ` negative squares (distinct zeros, positive weights). -/
theorem exists_negative_subspace (a : ℝ) (ha : 0 ≤ a) (γ ma : Fin m → ℝ) (hma : ∀ k, 0 < ma k)
    (ρ : Fin κ → ℂ) (mr : Fin κ → ℝ) (hρ : ∀ j, 0 < (ρ j).re) (hmr : ∀ j, 0 < mr j)
    (hinj : Function.Injective ρ) :
    ∃ (n : ℕ) (z : Fin n → ℂ), (∀ i, 0 < (z i).re) ∧ (∀ i j, z i ≠ ρ j) ∧
      ∃ W : Submodule ℂ (Fin n → ℂ), Module.finrank ℂ W = κ ∧
        ∀ c ∈ W, c ≠ 0 → (kform a γ ma ρ mr z c).re < 0 := by
  sorry

end
