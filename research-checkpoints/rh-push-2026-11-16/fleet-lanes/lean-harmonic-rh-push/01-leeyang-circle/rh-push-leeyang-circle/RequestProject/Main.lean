import Mathlib

/-!
# Multivariate Lee–Yang circle theorem, occupation-number form

Finite index set `Fin n` (the "prime sites"), symmetric nonnegative pair couplings `K p q`.
The partition polynomial in the activities `z p` is

  `stageZ K z = ∑_{S ⊆ Fin n} exp(∑_{p<q, p,q ∈ S} K p q) * ∏_{p ∈ S} z p`.

With `r p = ∑_{q ≠ p} K p q` and `ζ p = exp(r p / 2) * z p` this is the standard Lee–Yang
polynomial `∑_S ∏_{i ∈ S, j ∉ S} a_ij ∏_{i ∈ S} ζ_i` with `a_ij = exp(-K i j / 2) ∈ (0,1]`.
The multivariate circle theorem (Lee–Yang 1952, Ruelle): the polynomial does not vanish when
all `|ζ p| < 1`, and does not vanish when all `|ζ p| > 1`.
-/

open Finset BigOperators

noncomputable section

/-- Occupation-number partition polynomial of a pair model on `Fin n`. -/
def stageZ {n : ℕ} (K : Fin n → Fin n → ℝ) (z : Fin n → ℂ) : ℂ :=
  ∑ S : Finset (Fin n),
    (Real.exp (∑ p ∈ S, ∑ q ∈ S, if p < q then K p q else 0) : ℂ) * ∏ p ∈ S, z p

/-- Total coupling attached to the site `p`. -/
def rowSum {n : ℕ} (K : Fin n → Fin n → ℝ) (p : Fin n) : ℝ :=
  ∑ q ∈ (Finset.univ.erase p), K p q

/-- Lee–Yang, inside the polydisc: ferromagnetic couplings, all normalised activities of
modulus `< 1`. -/
theorem lee_yang_inside {n : ℕ} (K : Fin n → Fin n → ℝ)
    (hsymm : ∀ p q, K p q = K q p) (hnn : ∀ p q, 0 ≤ K p q)
    (z : Fin n → ℂ) (hz : ∀ p, ‖z p‖ * Real.exp (rowSum K p / 2) < 1) :
    stageZ K z ≠ 0 := by
  sorry

/-- Lee–Yang, outside the polydisc: all normalised activities of modulus `> 1`. -/
theorem lee_yang_outside {n : ℕ} (K : Fin n → Fin n → ℝ)
    (hsymm : ∀ p q, K p q = K q p) (hnn : ∀ p q, 0 ≤ K p q)
    (z : Fin n → ℂ) (hz : ∀ p, 1 < ‖z p‖ * Real.exp (rowSum K p / 2)) :
    stageZ K z ≠ 0 := by
  sorry

end
