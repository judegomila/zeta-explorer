import Mathlib

/-!
# Anchor jet matrix of the Pick (bridge) kernel splits into a Stieltjes Hankel pair

For a real moment sequence `μ : ℕ → ℝ` put
`H0_K = [μ (i+j)]_{i,j<K}`, `H1_K = [μ (i+j+1)]_{i,j<K}` and let `J_N = [c i j]_{i,j<N}` with
`c i j = 0` for `i + j` odd, `c (2a) (2b) = 2 (-1)^(a+b) μ (a+b)`,
`c (2a+1) (2b+1) = 2 (-1)^(a+b) μ (a+b+1)`.

These `c i j` are the Taylor coefficients at `x = y = 0` of the kernel
`(L x + L y)/(x + y)` for `L x = ∑_λ 2x/(x^2 + λ)` with `μ k = ∑_λ λ^{-k-1}`
(`pick_pair_identity`, `pick_pair_expansion` below give this for one `λ`; sums over `λ` are
termwise).

Claims: `J_N` is positive definite iff `H0_{⌈N/2⌉}` and `H1_{⌊N/2⌋}` are; the same for positive
semidefinite; and the first order at which `J_N` fails to be positive definite is
`min (2 K0 - 1) (2 K1)`, `K0`, `K1` the first orders at which `H0`, `H1` fail.
-/

open Finset BigOperators Matrix

noncomputable section

/-- Jet coefficients of the bridge kernel at the anchor. -/
def jetCoeff (μ : ℕ → ℝ) (i j : ℕ) : ℝ :=
  if i % 2 = 0 ∧ j % 2 = 0 then 2 * (-1 : ℝ) ^ (i / 2 + j / 2) * μ (i / 2 + j / 2)
  else if i % 2 = 1 ∧ j % 2 = 1 then 2 * (-1 : ℝ) ^ (i / 2 + j / 2) * μ (i / 2 + j / 2 + 1)
  else 0

def jetMatrix (μ : ℕ → ℝ) (N : ℕ) : Matrix (Fin N) (Fin N) ℝ :=
  Matrix.of fun i j => jetCoeff μ i j

def hankel0 (μ : ℕ → ℝ) (K : ℕ) : Matrix (Fin K) (Fin K) ℝ :=
  Matrix.of fun i j => μ ((i : ℕ) + (j : ℕ))

def hankel1 (μ : ℕ → ℝ) (K : ℕ) : Matrix (Fin K) (Fin K) ℝ :=
  Matrix.of fun i j => μ ((i : ℕ) + (j : ℕ) + 1)

/-- Pick pair formula for one zero parameter `λ`. -/
theorem pick_pair_identity (x y lam : ℂ) (hx : x ^ 2 + lam ≠ 0) (hy : y ^ 2 + lam ≠ 0)
    (hxy : x + y ≠ 0) :
    (2 * x / (x ^ 2 + lam) + 2 * y / (y ^ 2 + lam)) / (x + y)
      = 2 * (x * y + lam) / ((x ^ 2 + lam) * (y ^ 2 + lam)) := by
  sorry

/-- Double power series of the one-`λ` kernel: the coefficients are `jetCoeff` for the moment
sequence `μ k = λ^{-(k+1)}`. -/
theorem pick_pair_expansion (x y lam : ℂ) (hlam : lam ≠ 0)
    (hx : ‖x‖ ^ 2 < ‖lam‖) (hy : ‖y‖ ^ 2 < ‖lam‖) :
    HasSum (fun ab : ℕ × ℕ =>
        2 * (-1 : ℂ) ^ (ab.1 + ab.2) * (lam⁻¹) ^ (ab.1 + ab.2 + 1) * x ^ (2 * ab.1) * y ^ (2 * ab.2)
        + 2 * (-1 : ℂ) ^ (ab.1 + ab.2) * (lam⁻¹) ^ (ab.1 + ab.2 + 2)
            * x ^ (2 * ab.1 + 1) * y ^ (2 * ab.2 + 1))
      (2 * (x * y + lam) / ((x ^ 2 + lam) * (y ^ 2 + lam))) := by
  sorry

/-- Decoupling, positive definite form. -/
theorem jetMatrix_posDef_iff (μ : ℕ → ℝ) (N : ℕ) :
    (jetMatrix μ N).PosDef ↔ (hankel0 μ ((N + 1) / 2)).PosDef ∧ (hankel1 μ (N / 2)).PosDef := by
  sorry

/-- Decoupling, positive semidefinite form. -/
theorem jetMatrix_posSemidef_iff (μ : ℕ → ℝ) (N : ℕ) :
    (jetMatrix μ N).PosSemidef ↔
      (hankel0 μ ((N + 1) / 2)).PosSemidef ∧ (hankel1 μ (N / 2)).PosSemidef := by
  sorry

/-- First-failure rule `N* = min (2 K0 - 1) (2 K1)`. -/
theorem jetMatrix_first_failure (μ : ℕ → ℝ) (K0 K1 : ℕ)
    (h0 : ¬ (hankel0 μ K0).PosDef) (h0' : ∀ k < K0, (hankel0 μ k).PosDef)
    (h1 : ¬ (hankel1 μ K1).PosDef) (h1' : ∀ k < K1, (hankel1 μ k).PosDef) :
    ¬ (jetMatrix μ (min (2 * K0 - 1) (2 * K1))).PosDef ∧
      ∀ N < min (2 * K0 - 1) (2 * K1), (jetMatrix μ N).PosDef := by
  sorry

/-- First-failure rule when only the `H0` ladder fails. -/
theorem jetMatrix_first_failure_H0_only (μ : ℕ → ℝ) (K0 : ℕ)
    (h0 : ¬ (hankel0 μ K0).PosDef) (h0' : ∀ k < K0, (hankel0 μ k).PosDef)
    (h1 : ∀ k, (hankel1 μ k).PosDef) :
    ¬ (jetMatrix μ (2 * K0 - 1)).PosDef ∧ ∀ N < 2 * K0 - 1, (jetMatrix μ N).PosDef := by
  sorry

/-- First-failure rule when only the `H1` ladder fails. -/
theorem jetMatrix_first_failure_H1_only (μ : ℕ → ℝ) (K1 : ℕ)
    (h0 : ∀ k, (hankel0 μ k).PosDef)
    (h1 : ¬ (hankel1 μ K1).PosDef) (h1' : ∀ k < K1, (hankel1 μ k).PosDef) :
    ¬ (jetMatrix μ (2 * K1)).PosDef ∧ ∀ N < 2 * K1, (jetMatrix μ N).PosDef := by
  sorry

end
