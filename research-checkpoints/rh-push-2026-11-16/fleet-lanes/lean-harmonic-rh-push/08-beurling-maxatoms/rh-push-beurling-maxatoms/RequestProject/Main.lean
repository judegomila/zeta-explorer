import Mathlib

/-!
# Core of the Beurling rigidity theorem (Theorem A, steps A1–A4)

In Theorem A the atom-mass function `φ t = μ({t})` of a positive measure `μ` with `μ^ = μ` is a
positive-definite function on `ℝ` (it is the Fourier–Bohr coefficient of the positive measure
`μ^ = μ`).  The steps of the proof, stated for an arbitrary positive-definite `φ`:

 * (A1) `|φ t| ≤ φ 0`;
 * (A2–A3) the set `{t : φ t = φ 0}` of atoms of maximal mass is a subgroup of `ℝ`;
 * (A4) if `φ` is real, every nonzero value is `≥ φ 0 > 0`, the support is locally finite and
   not `{0}`, then `φ = φ 0 · 1_{cℤ}` for some `c > 0`.

(The last step `c = 1` of Theorem A is Poisson summation for the comb and is not part of this
file.)
-/

open Finset BigOperators
open scoped ComplexConjugate

noncomputable section

/-- Positive-definite function on `ℝ` (Bochner sense): all finite matrices
`[φ (x i - x j)]` are Hermitian positive semidefinite. -/
def IsPosDefFn (φ : ℝ → ℂ) : Prop :=
  ∀ (n : ℕ) (x : Fin n → ℝ) (c : Fin n → ℂ),
    0 ≤ (∑ i, ∑ j, c i * conj (c j) * φ (x i - x j)).re ∧
      (∑ i, ∑ j, c i * conj (c j) * φ (x i - x j)).im = 0

/-- (A1) -/
theorem posDef_norm_le (φ : ℝ → ℂ) (h : IsPosDefFn φ) (t : ℝ) :
    (φ 0).im = 0 ∧ ‖φ t‖ ≤ (φ 0).re := by
  sorry

/-- (A2–A3) The points where `φ` attains `φ 0` form a subgroup. -/
theorem posDef_max_set_subgroup (φ : ℝ → ℂ) (h : IsPosDefFn φ) :
    ∃ S : AddSubgroup ℝ, (S : Set ℝ) = {t | φ t = φ 0} := by
  sorry

open Classical in
/-- (A4) Rigidity: a real positive-definite mass function with every nonzero mass at least
the mass at `0`, locally finite support, and at least one atom away from `0`, is a constant
multiple of the indicator of a lattice `cℤ`. -/
theorem beurling_core (m : ℝ → ℝ) (h : IsPosDefFn (fun t => (m t : ℂ)))
    (hκ : 0 < m 0) (hmass : ∀ t, m t = 0 ∨ m 0 ≤ m t)
    (hloc : ∀ R : ℝ, {t : ℝ | m t ≠ 0 ∧ |t| ≤ R}.Finite)
    (hnontriv : ∃ t, t ≠ 0 ∧ m t ≠ 0) :
    ∃ c : ℝ, 0 < c ∧ ∀ t, m t = if (∃ k : ℤ, t = (k : ℝ) * c) then m 0 else 0 := by
  sorry

end
