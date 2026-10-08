import LeanCert.Analysis.DBN.ForwardPreservation
import LeanCert.Analysis.DBN.XiIdentity
import LeanCert.Analysis.DBN.Threshold

/-!
# Substitution lemma: a zero-free half-plane gives a squared-strip bound for every `H_t`

Source: `src/data/openai-math-integration-2026-10-08.js` (the "start substitution" used by the
conditional QRH values): if `ζ(s) ≠ 0` for `Re s > θ` (`1/2 ≤ θ`), then every zero of `H_t`
(`t ≥ 0`) satisfies `Im(z)² ≤ max((2θ − 1)² − 2t, 0)`; in particular `Λ ≤ (2θ − 1)²/2`.

Ingredients, all machine-checked:

* `H t z = ∫_0^∞ e^{t u²} Φ(u) cos(z u) du` with Riemann's kernel `Φ` — the concrete definition
  `LeanCert.Analysis.DBN.H` (LeanCert, commit 7f91b6eb);
* `H 0 z = ξ(1/2 + i z/2)/8` — `LeanCert.Analysis.DBN.H_zero_eq_riemannXi` (proved in LeanCert from
  Mathlib's Mellin/theta representation of `completedRiemannZeta₀`);
* de Bruijn's squared-strip contraction for the actual `H_t` —
  `LeanCert.Analysis.DBN.H_forward_strip` (proved in LeanCert via symmetric polynomial cutoffs,
  finite shift contraction, and two locally uniform limits);
* `ξ(s) = ξ(1 − s)` — `LeanCert.Analysis.DBN.riemannXi_one_sub`, from Mathlib's
  `completedRiemannZeta₀_one_sub`;
* the relation between zeros of `ξ` and of `ζ` in `Re s > 0` — proved here from Mathlib's
  `riemannZeta_def_of_ne_zero`.

The zero-free half-plane is a HYPOTHESIS (`ZetaZeroFreeRight θ`). It is discharged
unconditionally for `θ = 1` here (Mathlib), and for `θ = 7/8` in `RaymondCore/Instance78.lean`
from the openai/math theorem `OAI.riemannZeta_ne_zero_of_seven_eighths_lt_re` (that file is built
against the openai/math workspace; see README).
-/

open Complex

namespace RaymondCore.Substitution

open LeanCert.Analysis.DBN

/-- `ζ(s) ≠ 0` on the open half-plane `Re s > θ`. -/
def ZetaZeroFreeRight (θ : ℝ) : Prop := ∀ s : ℂ, θ < s.re → riemannZeta s ≠ 0

/-- Mathlib: `θ = 1` is unconditional. -/
theorem zetaZeroFreeRight_one : ZetaZeroFreeRight 1 :=
  fun _ hs => riemannZeta_ne_zero_of_one_lt_re hs

/-- `ξ` has no zeros on `Re s > θ` when `ζ` has none there (`θ ≥ 1/2`). -/
theorem riemannXi_ne_zero_of_right {θ : ℝ} (hθ : 1 / 2 ≤ θ) (hZ : ZetaZeroFreeRight θ)
    {s : ℂ} (hs : θ < s.re) : riemannXi s ≠ 0 := by
  have hre : 0 < s.re := by linarith
  have h0 : s ≠ 0 := by rintro rfl; simp at hre
  by_cases h1 : s = 1
  · subst h1; simp
  · have hζ := hZ s hs
    rw [riemannZeta_def_of_ne_zero h0] at hζ
    have hc : completedRiemannZeta s ≠ 0 := fun h => hζ (by simp [h])
    rw [riemannXi_eq_mul_completed h0 h1]
    exact div_ne_zero (mul_ne_zero (mul_ne_zero h0 (sub_ne_zero.mpr h1)) hc) (by norm_num)

/-- Zeros of `ξ` lie in `1 − θ ≤ Re s ≤ θ` (functional equation `ξ(s) = ξ(1 − s)`). -/
theorem riemannXi_zero_re_bounds {θ : ℝ} (hθ : 1 / 2 ≤ θ) (hZ : ZetaZeroFreeRight θ)
    {s : ℂ} (hs : riemannXi s = 0) : 1 - θ ≤ s.re ∧ s.re ≤ θ := by
  constructor
  · by_contra h
    have h' : θ < (1 - s).re := by simp only [sub_re, one_re]; linarith
    exact riemannXi_ne_zero_of_right hθ hZ h' (by rw [riemannXi_one_sub]; exact hs)
  · by_contra h
    exact riemannXi_ne_zero_of_right hθ hZ (lt_of_not_ge h) hs

/-- Zeros of `H_0` lie in the squared strip `Im(z)² ≤ (2θ − 1)²`. -/
theorem H_zero_im_sq_le {θ : ℝ} (hθ : 1 / 2 ≤ θ) (hZ : ZetaZeroFreeRight θ)
    {z : ℂ} (hz : H 0 z = 0) : z.im ^ 2 ≤ (2 * θ - 1) ^ 2 := by
  rw [H_zero_eq_riemannXi] at hz
  have hx : riemannXi (1 / 2 + I * z / 2) = 0 := by
    simpa [div_eq_zero_iff] using hz
  have hb := riemannXi_zero_re_bounds hθ hZ hx
  have hre : (1 / 2 + I * z / 2 : ℂ).re = (1 - z.im) / 2 := by
    simp [Complex.div_ofNat_re, mul_re]
    ring
  rw [hre] at hb
  have hlo : -(2 * θ - 1) ≤ z.im := by linarith [hb.2]
  have hhi : z.im ≤ 2 * θ - 1 := by linarith [hb.1]
  nlinarith

/-- **Substitution lemma.** If `ζ` has no zeros on `Re s > θ` (`θ ≥ 1/2`), then for every `t ≥ 0`
every zero `z` of `H_t` satisfies `Im(z)² ≤ max((2θ − 1)² − 2t, 0)`. -/
theorem substitution {θ : ℝ} (hθ : 1 / 2 ≤ θ) (hZ : ZetaZeroFreeRight θ)
    {t : ℝ} (ht : 0 ≤ t) {z : ℂ} (hz : H t z = 0) :
    z.im ^ 2 ≤ max ((2 * θ - 1) ^ 2 - 2 * t) 0 :=
  H_forward_strip 0 (2 * θ - 1) t ht (fun _ hw => H_zero_im_sq_le hθ hZ hw)
    (by simpa only [zero_add] using hz)

/-- The same bound in the form `Im(z)² ≤ (2θ − 1)² − 2t`, on the range `2t ≤ (2θ − 1)²`. -/
theorem substitution' {θ : ℝ} (hθ : 1 / 2 ≤ θ) (hZ : ZetaZeroFreeRight θ)
    {t : ℝ} (ht : 0 ≤ t) (ht' : 2 * t ≤ (2 * θ - 1) ^ 2) {z : ℂ} (hz : H t z = 0) :
    z.im ^ 2 ≤ (2 * θ - 1) ^ 2 - 2 * t := by
  have h := substitution hθ hZ ht hz
  rwa [max_eq_left (by linarith)] at h

/-- For `t ≥ (2θ − 1)²/2` all zeros of `H_t` are real. -/
theorem H_real_zeros_of_le {θ : ℝ} (hθ : 1 / 2 ≤ θ) (hZ : ZetaZeroFreeRight θ)
    {t : ℝ} (ht : (2 * θ - 1) ^ 2 / 2 ≤ t) {z : ℂ} (hz : H t z = 0) : z.im = 0 := by
  have ht0 : 0 ≤ t := le_trans (by positivity) ht
  have h := substitution hθ hZ ht0 hz
  rw [max_eq_right (by linarith)] at h
  nlinarith [sq_nonneg z.im]

/-- **Conditional de Bruijn bound.** `ζ ≠ 0` on `Re s > θ` implies `Λ ≤ (2θ − 1)²/2`, where
`Λ = LeanCert.Analysis.DBN.Lambda` is the de Bruijn–Newman constant of the concrete `H`. -/
theorem Lambda_le_of_zeroFree {θ : ℝ} (hθ : 1 / 2 ≤ θ) (hZ : ZetaZeroFreeRight θ) :
    Lambda ≤ (2 * θ - 1) ^ 2 / 2 :=
  (real_zeros_iff_Lambda_le _).1 (fun _ hz => H_real_zeros_of_le hθ hZ le_rfl hz)

/-- Unconditional instance `θ = 1` (de Bruijn 1950: `Λ ≤ 1/2`). -/
theorem Lambda_le_half' : Lambda ≤ 1 / 2 := by
  have h := Lambda_le_of_zeroFree (by norm_num : (1 / 2 : ℝ) ≤ 1) zetaZeroFreeRight_one
  norm_num at h ⊢
  exact h

end RaymondCore.Substitution
