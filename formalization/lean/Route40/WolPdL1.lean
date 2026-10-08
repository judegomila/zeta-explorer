/-
Route 40 (b9) — wol-pd Lemma 1.1(b), the derivation identities, formal version.

Source: formalization/paper/wol-pd-lemmas.md §1, Lemma 1.1(b):
  dw_r = (d_r - w_r d_1)/c_1 = -½ (D_S + v_r) w_r,
  dl_r = -½ (D_S + v_r) l_r   (for the rough-log label recursion).
Abstract setting: a commutative ℝ-algebra `A` (e.g. ℂ[[z]]) with a derivation `δ` (e.g. D_S),
`c` invertible (`c * cinv = 1`).  The identity l_r = Λ_r (formal logarithm) is NOT formalised here
(prepared as Aristotle job J3, second half).
Compiled against Mathlib d13f23b7 / Lean 4.34.1 (tree /tmp/qrh-verify/lean).

Referee correction (batch 9, 2026-10-14): the first version had `v : ℕ → ℚ`, a ℚ-algebra and
`hv : ∀ d e, v (d * e) = v d + v e` over all of ℕ; `hv 0 2` gives `v 2 = 0`, contradicting `hvpos 2`, so
`dl_identity` was vacuous (and v = log was not admissible).  This version (referee file
tmp/routes-b9-ref40-lean/L1fix.lean) uses `v : ℕ → ℝ`, an ℝ-algebra, additivity only for nonzero
arguments, and proves non-vacuity: `log_ok` shows v = Real.log satisfies the hypotheses.
-/
import Mathlib

open Finset

namespace Route40.L1

variable {A : Type*} [CommRing A] [Algebra ℝ A]

/-- Derivative of an inverse: `δ cinv = - cinv² δ c`. -/
lemma deriv_inv (δ : Derivation ℝ A A) (c cinv : A) (h : c * cinv = 1) :
    δ cinv = -(cinv * cinv * δ c) := by
  have h0 : δ (c * cinv) = 0 := by rw [h, Derivation.map_one_eq_zero]
  rw [Derivation.leibniz, smul_eq_mul, smul_eq_mul] at h0
  linear_combination cinv * h0 - δ cinv * h

/-- **Lemma 1.1(b), first identity** (stated with the factor 2 cleared):
with `w = c_r/c`, `2 d_r = -(δ c_r + v c_r)`, `2 d_1 = -δ c`:
`(2 d_r - w · 2 d_1)/c = -(δ w + v w)`. -/
theorem dw_identity (δ : Derivation ℝ A A) (c cinv cr v : A) (h : c * cinv = 1) :
    ((-(δ cr + v * cr)) - (cr * cinv) * (-(δ c))) * cinv = -(δ (cr * cinv) + v * (cr * cinv)) := by
  have hi := deriv_inv δ c cinv h
  rw [Derivation.leibniz, smul_eq_mul, smul_eq_mul, hi]
  ring

/-- **Lemma 1.1(b), label-log identity.** Labels `r ≥ 2` with additive weights `v`
(`v (d e) = v d + v e`, `v r > 0`).  If `dw r = -½(δ (w r) + v r w r)` and `l`, `dl` satisfy the
recursions of §0.4 / (5.6), then `dl r = -½(δ (l r) + v r l r)` for every label `r`. -/
theorem dl_identity (δ : Derivation ℝ A A) (v : ℕ → ℝ)
    (hv : ∀ d e, d ≠ 0 → e ≠ 0 → v (d * e) = v d + v e) (hvpos : ∀ r, 2 ≤ r → v r ≠ 0)
    (w dw l dl : ℕ → A)
    (hdw : ∀ r, dw r = -(1 / 2 : ℝ) • (δ (w r) + v r • w r))
    (hl : ∀ r, 2 ≤ r → v r • l r = v r • w r -
      ∑ x ∈ (Nat.divisorsAntidiagonal r).filter (fun x => 2 ≤ x.1 ∧ 2 ≤ x.2), v x.1 • (l x.1 * w x.2))
    (hdl : ∀ r, 2 ≤ r → v r • dl r = v r • dw r -
      ∑ x ∈ (Nat.divisorsAntidiagonal r).filter (fun x => 2 ≤ x.1 ∧ 2 ≤ x.2),
        v x.1 • (dl x.1 * w x.2 + l x.1 * dw x.2)) :
    ∀ r, 2 ≤ r → dl r = -(1 / 2 : ℝ) • (δ (l r) + v r • l r) := by
  intro r
  induction r using Nat.strong_induction_on with
  | _ r ih =>
    intro hr
    set P := (Nat.divisorsAntidiagonal r).filter (fun x => 2 ≤ x.1 ∧ 2 ≤ x.2) with hP
    -- members of P: x.1 < r, 2 ≤ x.1, x.1 * x.2 = r
    have hmem : ∀ x ∈ P, x.1 < r ∧ 2 ≤ x.1 ∧ v r = v x.1 + v x.2 := by
      intro x hx
      rw [hP, Finset.mem_filter, Nat.mem_divisorsAntidiagonal] at hx
      obtain ⟨⟨hxr, -⟩, h1, h2⟩ := hx
      refine ⟨?_, h1, by rw [← hxr, hv _ _ (by omega) (by omega)]⟩
      rw [← hxr]; nlinarith
    -- each summand of the dl recursion
    have hterm : ∀ x ∈ P, v x.1 • (dl x.1 * w x.2 + l x.1 * dw x.2) =
        -(1 / 2 : ℝ) • (δ (v x.1 • (l x.1 * w x.2)) + v r • (v x.1 • (l x.1 * w x.2))) := by
      intro x hx
      obtain ⟨hlt, h2, hvr⟩ := hmem x hx
      rw [ih x.1 hlt h2, hdw x.2, Derivation.map_smul, Derivation.leibniz, smul_eq_mul, smul_eq_mul,
        hvr]
      simp only [Algebra.smul_def, map_add]
      ring
    have hvr0 := hvpos r hr
    have hsum : ∑ x ∈ P, -(1 / 2 : ℝ) • (δ (v x.1 • (l x.1 * w x.2)) +
        v r • (v x.1 • (l x.1 * w x.2))) =
        -(1 / 2 : ℝ) • (δ (∑ x ∈ P, v x.1 • (l x.1 * w x.2)) +
          v r • ∑ x ∈ P, v x.1 • (l x.1 * w x.2)) := by
      simp only [map_sum, Finset.smul_sum, smul_add, Finset.sum_add_distrib]
    have hS : ∑ x ∈ P, v x.1 • (l x.1 * w x.2) = v r • w r - v r • l r := by
      rw [hl r hr]; abel
    -- v r • (target)
    have htarget : v r • dl r = v r • (-(1 / 2 : ℝ) • (δ (l r) + v r • l r)) := by
      rw [hdl r hr, Finset.sum_congr rfl hterm, hdw r, hsum, hS, map_sub, Derivation.map_smul,
        Derivation.map_smul]
      simp only [Algebra.smul_def]
      ring
    have := congrArg (fun X => (v r)⁻¹ • X) htarget
    simp only [smul_smul] at this
    rw [inv_mul_cancel₀ hvr0, one_smul, ← mul_assoc, inv_mul_cancel₀ hvr0, one_mul] at this
    exact this

/-- non-vacuity: v = log satisfies the corrected hypotheses -/
theorem log_ok : (∀ d e : ℕ, d ≠ 0 → e ≠ 0 → Real.log ((d * e : ℕ) : ℝ) = Real.log d + Real.log e) ∧
    (∀ r : ℕ, 2 ≤ r → Real.log (r : ℝ) ≠ 0) := by
  refine ⟨fun d e hd he => by push_cast; exact Real.log_mul (by exact_mod_cast hd) (by exact_mod_cast he), fun r hr => ?_⟩
  exact (Real.log_pos (by exact_mod_cast (by omega : 1 < r))).ne'
end Route40.L1
