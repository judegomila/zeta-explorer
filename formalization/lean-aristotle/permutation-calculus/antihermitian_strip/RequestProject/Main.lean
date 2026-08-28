import Mathlib

open scoped BigOperators
open scoped Real
open scoped Nat
open scoped Classical
open scoped Pointwise

set_option maxHeartbeats 8000000
set_option maxRecDepth 4000
set_option synthInstance.maxHeartbeats 20000
set_option synthInstance.maxSize 128

set_option relaxedAutoImplicit false
set_option autoImplicit false

set_option pp.fullNames true
set_option pp.structureInstances true
set_option pp.coercions.types true
set_option pp.funBinderTypes true
set_option pp.letVarTypes true
set_option pp.piBinderTypes true

set_option grind.warning false

/-!
# Anti-Hermitian strip bound for a Fredholm pencil

Formalization of `job11_antihermitian_strip.tex`:

* `AntiHermitianStrip.antiHermPart` : the operator `K = (R - R^*)/(2i)`.
* `AntiHermitianStrip.im_eq_inner_antiHermPart` and
  `AntiHermitianStrip.abs_im_le_norm_antiHermPart` : Lemma 1 (Rayleigh-quotient core).
* `AntiHermitianStrip.abs_im_le_of_represented` : Proposition 2 (strip bound for
  represented zeros).
* `AntiHermitianStrip.deBruijnNewman_le_of_global_representation` : Proposition 3
  (conditional global conclusion).

Throughout `H` is a complex Hilbert space and all operators are bounded
(`ContinuousLinearMap`).  The inner product convention is Mathlib's: `inner 𝕜 x y`
is conjugate-linear in `x` and linear in `y`, so the paper's `⟨Kv, v⟩` is rendered
as `inner ℂ v (K v)` (both are equal here, since `K` is self-adjoint, and both are
real).
-/

namespace AntiHermitianStrip

variable {H : Type*} [NormedAddCommGroup H] [InnerProductSpace ℂ H] [CompleteSpace H]

/-- The anti-Hermitian part `K = (R - R^*)/(2i)` of a bounded operator `R`. -/
noncomputable def antiHermPart (R : H →L[ℂ] H) : H →L[ℂ] H :=
  (2 * Complex.I)⁻¹ • (R - ContinuousLinearMap.adjoint R)

/-- `K = (R - R^*)/(2i)` is self-adjoint. -/
theorem isSelfAdjoint_antiHermPart (R : H →L[ℂ] H) :
    IsSelfAdjoint (antiHermPart R) := by
  have h2 : (starRingEnd ℂ) (2 * Complex.I)⁻¹ = -(2 * Complex.I)⁻¹ := by
    rw [map_inv₀, map_mul]
    simp [Complex.conj_ofNat]
  unfold antiHermPart IsSelfAdjoint
  rw [star_smul, star_sub]
  simp only [ContinuousLinearMap.star_eq_adjoint, ContinuousLinearMap.adjoint_adjoint]
  rw [show (star (2 * Complex.I)⁻¹ : ℂ) = -(2 * Complex.I)⁻¹ from h2]
  module

/-- The imaginary part of `⟪v, R v⟫` is `⟪v, K v⟫` with `K = (R - R^*)/(2i)`. -/
theorem inner_antiHermPart_eq (R : H →L[ℂ] H) (v : H) :
    (inner ℂ v (antiHermPart R v) : ℂ) = ((inner ℂ v (R v) : ℂ).im : ℂ) := by
  have hadj : (inner ℂ v ((ContinuousLinearMap.adjoint R) v) : ℂ)
      = starRingEnd ℂ (inner ℂ v (R v) : ℂ) := by
    rw [ContinuousLinearMap.adjoint_inner_right, inner_conj_symm]
  simp only [antiHermPart, ContinuousLinearMap.smul_apply, ContinuousLinearMap.sub_apply,
    inner_smul_right, inner_sub_right, hadj]
  rw [Complex.sub_conj]
  field_simp
  ring_nf
  simp

/-- `⟪v, D v⟫` is real for self-adjoint `D`. -/
theorem inner_self_im_eq_zero_of_isSelfAdjoint {D : H →L[ℂ] H} (hD : IsSelfAdjoint D) (v : H) :
    (inner ℂ v (D v) : ℂ).im = 0 := by
  rw [← Complex.conj_eq_iff_im]
  conv_rhs => rw [show D = ContinuousLinearMap.adjoint D from hD.star_eq.symm]
  rw [ContinuousLinearMap.adjoint_inner_right, inner_conj_symm]

/-- **Lemma 1 (Rayleigh-quotient core at one point), equality form.**
If `D` is self-adjoint, `K = (R - R^*)/(2i)` and `(D - x•I + R) v = 0`, then
`(Im x) ‖v‖² = ⟪v, K v⟫`. -/
theorem im_eq_inner_antiHermPart {D R : H →L[ℂ] H} (hD : IsSelfAdjoint D) (x : ℂ) {v : H}
    (hv : (D - x • ContinuousLinearMap.id ℂ H + R) v = 0) :
    x.im * ‖v‖ ^ 2 = (inner ℂ v (antiHermPart R v) : ℂ).re := by
  have h0 : (inner ℂ v ((D - x • ContinuousLinearMap.id ℂ H + R) v) : ℂ) = 0 := by
    rw [hv, inner_zero_right]
  have hexp : (inner ℂ v (D v) : ℂ) - x * (‖v‖ ^ 2 : ℝ) + (inner ℂ v (R v) : ℂ) = 0 := by
    rw [← h0]
    simp only [ContinuousLinearMap.add_apply, ContinuousLinearMap.sub_apply,
      ContinuousLinearMap.smul_apply, ContinuousLinearMap.id_apply, inner_add_right,
      inner_sub_right, inner_smul_right]
    rw [inner_self_eq_norm_sq_to_K]
    push_cast
    rfl
  have him := congrArg Complex.im hexp
  simp only [Complex.add_im, Complex.sub_im, Complex.mul_im, Complex.zero_im,
    Complex.ofReal_re, Complex.ofReal_im] at him
  rw [inner_self_im_eq_zero_of_isSelfAdjoint hD v] at him
  rw [inner_antiHermPart_eq]
  simp only [Complex.ofReal_re]
  nlinarith [him]

/-- **Lemma 1 (Rayleigh-quotient core at one point), bound form.**
If `D` is self-adjoint, `v ≠ 0` and `(D - x•I + R) v = 0`, then
`|Im x| ≤ ‖K‖` with `K = (R - R^*)/(2i)`. -/
theorem abs_im_le_norm_antiHermPart {D R : H →L[ℂ] H} (hD : IsSelfAdjoint D) (x : ℂ) {v : H}
    (hv0 : v ≠ 0) (hv : (D - x • ContinuousLinearMap.id ℂ H + R) v = 0) :
    |x.im| ≤ ‖antiHermPart R‖ := by
  have hnorm : (0 : ℝ) < ‖v‖ := norm_pos_iff.mpr hv0
  have hkey := im_eq_inner_antiHermPart hD x hv
  have h1 : |x.im| * ‖v‖ ^ 2 = |(inner ℂ v (antiHermPart R v) : ℂ).re| := by
    rw [← hkey, abs_mul, abs_of_nonneg (by positivity : (0:ℝ) ≤ ‖v‖ ^ 2)]
  have h2 : |(inner ℂ v (antiHermPart R v) : ℂ).re| ≤ ‖(inner ℂ v (antiHermPart R v) : ℂ)‖ :=
    Complex.abs_re_le_norm _
  have h3 : ‖(inner ℂ v (antiHermPart R v) : ℂ)‖ ≤ ‖v‖ * ‖antiHermPart R v‖ :=
    norm_inner_le_norm _ _
  have h4 : ‖antiHermPart R v‖ ≤ ‖antiHermPart R‖ * ‖v‖ :=
    ContinuousLinearMap.le_opNorm _ _
  have h5 : |x.im| * ‖v‖ ^ 2 ≤ ‖antiHermPart R‖ * ‖v‖ ^ 2 := by
    calc |x.im| * ‖v‖ ^ 2 = |(inner ℂ v (antiHermPart R v) : ℂ).re| := h1
      _ ≤ ‖v‖ * ‖antiHermPart R v‖ := le_trans h2 h3
      _ ≤ ‖v‖ * (‖antiHermPart R‖ * ‖v‖) := by
          exact mul_le_mul_of_nonneg_left h4 (le_of_lt hnorm)
      _ = ‖antiHermPart R‖ * ‖v‖ ^ 2 := by ring
  have hsq : (0 : ℝ) < ‖v‖ ^ 2 := by positivity
  exact le_of_mul_le_mul_right (by linarith [h5]) hsq

/-- **Proposition 2 (strip bound for represented zeros).**
Let `D` be self-adjoint, `R : ℂ → (H →L[ℂ] H)` a family of bounded residuals, and
`η` a bound for the norms of the anti-Hermitian parts `K(x) = (R x - (R x)^*)/(2i)`.
If every `x` in a set `Z` is *represented*, i.e. admits a nonzero `v` with
`(D - x•I + R x) v = 0`, then every `x ∈ Z` satisfies `|Im x| ≤ η`. -/
theorem abs_im_le_of_represented {D : H →L[ℂ] H} (hD : IsSelfAdjoint D)
    (R : ℂ → (H →L[ℂ] H)) (η : ℝ) (hη : ∀ x : ℂ, ‖antiHermPart (R x)‖ ≤ η)
    (Z : Set ℂ)
    (hrep : ∀ x ∈ Z, ∃ v : H, v ≠ 0 ∧ (D - x • ContinuousLinearMap.id ℂ H + R x) v = 0) :
    ∀ x ∈ Z, |x.im| ≤ η := by
  intro x hx
  obtain ⟨v, hv0, hv⟩ := hrep x hx
  exact le_trans (abs_im_le_norm_antiHermPart hD x hv0 hv) (hη x)

/-- **Proposition 3 (conditional global conclusion).**
In the setting of Proposition 2, assume in addition:
(G) the zero set `Z` of `H_t` is globally represented (this is the hypothesis
`hrep` below, applied to all of `Z`), and
(S) the de Bruijn strip contraction: for every `y ≥ 0`, if all zeros of `H_t` lie
in the strip `|Im x| ≤ y`, then `Λ ≤ t + y²/2`.
Then `Λ ≤ t + η²/2`.  Hypothesis (S) is taken as an explicit assumption and is not
proved here. -/
theorem deBruijnNewman_le_of_global_representation {D : H →L[ℂ] H} (hD : IsSelfAdjoint D)
    (R : ℂ → (H →L[ℂ] H)) (η : ℝ) (hη : ∀ x : ℂ, ‖antiHermPart (R x)‖ ≤ η)
    (Z : Set ℂ)
    (hrep : ∀ x ∈ Z, ∃ v : H, v ≠ 0 ∧ (D - x • ContinuousLinearMap.id ℂ H + R x) v = 0)
    (Lam t : ℝ)
    (hS : ∀ y : ℝ, 0 ≤ y → (∀ x ∈ Z, |x.im| ≤ y) → Lam ≤ t + y ^ 2 / 2) :
    Lam ≤ t + η ^ 2 / 2 := by
  have hη0 : 0 ≤ η := le_trans (norm_nonneg _) (hη 0)
  exact hS η hη0 (abs_im_le_of_represented hD R η hη Z hrep)

end AntiHermitianStrip
