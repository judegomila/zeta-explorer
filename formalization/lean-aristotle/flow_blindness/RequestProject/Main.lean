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
# Flow-blindness (Lemma SL2): soft hypotheses cannot prove RH

Formalization of `job29_flow_blindness.tex`.

The de Bruijn–Newman scaffolding of the source (`MathlibBridge.lean:126–172`) is
reproduced here.  The source carries `H` as an `axiom`; for soundness we instead
carry it as a *variable* `H : ℝ → ℂ → ℂ` (an arbitrary two-parameter family),
which is strictly more general: every statement below is proved for *all* `H`.

All Rodgers–Tao content flows through the single named hypothesis
`hRT : 0 ≤ Lambda`; Rodgers–Tao itself is never attempted.

Honest scope (copied from the source): nothing here says that RH is false or
unprovable, and nothing here moves any claim about `Λ`.  The results cap a family
of *soft* strategies: any proof of RH whose hypotheses on the profile `Φ` are
invariant under `Φ ↦ e^{-ε u²} Φ` cannot be correct.
-/

namespace FlowBlindness

section Scaffolding

-- The de Bruijn–Newman flow, as an abstract two-parameter family.  (In the
-- source this is an axiom-level stand-in for `H t z`; here it is a variable.)
variable (H : ℝ → ℂ → ℂ)

/-- `H t` has only real zeros. -/
def HasOnlyRealZeros (t : ℝ) : Prop := ∀ z : ℂ, H t z = 0 → z.im = 0

/-- `Lambda` is the de Bruijn–Newman constant of the family `H`: the time-`t`
function has only real zeros exactly when `Lambda ≤ t`. -/
def IsDBNConstant (Lambda : ℝ) : Prop := ∀ t : ℝ, HasOnlyRealZeros H t ↔ Lambda ≤ t

/-- The Riemann hypothesis, read off the flow at time `0`. -/
def RiemannHypothesis : Prop := HasOnlyRealZeros H 0

/-- Banked packaging: RH is equivalent to `Λ = 0`, given `0 ≤ Λ` (Rodgers–Tao). -/
theorem RH_iff_lambda_eq_zero {Lambda : ℝ} (h : IsDBNConstant H Lambda)
    (hRT : 0 ≤ Lambda) : RiemannHypothesis H ↔ Lambda = 0 := by
  constructor
  · intro hRH
    exact le_antisymm ((h 0).1 hRH) hRT
  · intro hL
    exact (h 0).2 (by simp [hL])

/-! ## F1: backward-time zero failure -/

/-- **F1.**  For every `ε > 0` the backward-time function `H (-ε)` has a non-real
zero: this is immediate from the characterization of `Λ` together with `0 ≤ Λ`
(Rodgers–Tao, carried as `hRT`). -/
theorem noGo_backward {Lambda : ℝ} (h : IsDBNConstant H Lambda) (hRT : 0 ≤ Lambda)
    {eps : ℝ} (heps : 0 < eps) : ¬ HasOnlyRealZeros H (-eps) := by
  intro hzeros
  have hle : Lambda ≤ -eps := (h (-eps)).1 hzeros
  linarith

/-! ## F2: the abstract no-go (the SL2 package) -/

/-- **F2.**  Model a soft class of profiles, via the flow identity
`Ξ_ε = H_{-ε}`, as a time-indexed predicate `S : ℝ → Prop` ("the time-`t`
profile satisfies the soft hypotheses").  Then flow-invariance, soundness and
containment of the genuine profile are jointly contradictory.

The analytic identity "cosine transform of `e^{-ε u²} Φ` is `H_{-ε}`" is
*absorbed* into the shape of `hInv` here; see `noGo_profile_class` below for the
variant that carries the flow identity as an explicit named hypothesis. -/
theorem softClass_noGo {Lambda : ℝ} (h : IsDBNConstant H Lambda) (hRT : 0 ≤ Lambda)
    (S : ℝ → Prop) :
    ¬ ((∀ t eps : ℝ, 0 < eps → S t → S (t - eps)) ∧
       (∀ t : ℝ, S t → HasOnlyRealZeros H t) ∧
       S 0) := by
  rintro ⟨hInv, hSound, hS0⟩
  have hS1 : S (-1) := by
    have := hInv 0 1 one_pos hS0
    simpa using this
  exact noGo_backward H h hRT one_pos (hSound (-1) hS1)

/-- Gaussian damping of a profile: `Φ_ε (u) = e^{-ε u²} Φ (u)`. -/
noncomputable def gaussianDamp (eps : ℝ) (Phi : ℝ → ℝ) : ℝ → ℝ :=
  fun u => Real.exp (-(eps * u ^ 2)) * Phi u

/-- **F2 (profile-class form).**  The same no-go, stated for a class `C` of
profiles together with an explicit transform `cosTransform` and the flow
identity `cosTransform (Φ_ε) = H (-ε)` as a named hypothesis `hFlow`.

If `C` is invariant under Gaussian damping (`hInv`), if membership in `C` forces
all zeros of the transform to be real (`hSound`), and if the genuine profile `Phi`
lies in `C` (`hPhi`), then — given `0 ≤ Λ` (Rodgers–Tao, `hRT`) — we get a
contradiction.  Hence no such soft class exists. -/
theorem noGo_profile_class {Lambda : ℝ} (h : IsDBNConstant H Lambda) (hRT : 0 ≤ Lambda)
    (C : (ℝ → ℝ) → Prop) (cosTransform : (ℝ → ℝ) → ℂ → ℂ) (Phi : ℝ → ℝ)
    (hFlow : ∀ eps : ℝ, 0 < eps → cosTransform (gaussianDamp eps Phi) = H (-eps))
    (hInv : ∀ eps : ℝ, 0 < eps → C Phi → C (gaussianDamp eps Phi))
    (hSound : ∀ Psi : ℝ → ℝ, C Psi → ∀ z : ℂ, cosTransform Psi z = 0 → z.im = 0)
    (hPhi : C Phi) : False := by
  have hmem : C (gaussianDamp 1 Phi) := hInv 1 one_pos hPhi
  have hzeros : HasOnlyRealZeros H (-1) := by
    intro z hz
    refine hSound (gaussianDamp 1 Phi) hmem z ?_
    rw [hFlow 1 one_pos]
    exact hz
  exact noGo_backward H h hRT one_pos hzeros

end Scaffolding

/-! ## F3: soft-class closure lemmas (unconditional real analysis) -/

section SoftClosure

variable {Phi : ℝ → ℝ} {eps : ℝ}

/-- **F3 (a).**  Gaussian damping preserves evenness. -/
theorem gaussianDamp_even (hPhi : ∀ u : ℝ, Phi (-u) = Phi u) (eps : ℝ) :
    ∀ u : ℝ, gaussianDamp eps Phi (-u) = gaussianDamp eps Phi u := by
  intro u
  simp [gaussianDamp, hPhi u]

/-- **F3 (b).**  Gaussian damping preserves positivity. -/
theorem gaussianDamp_pos (hPhi : ∀ u : ℝ, 0 < Phi u) (eps : ℝ) :
    ∀ u : ℝ, 0 < gaussianDamp eps Phi u := by
  intro u
  exact mul_pos (Real.exp_pos _) (hPhi u)

/-- Auxiliary: `u ↦ -(ε u²)` is concave for `0 ≤ ε`. -/
theorem concaveOn_neg_sq (heps : 0 ≤ eps) :
    ConcaveOn ℝ Set.univ (fun u : ℝ => -(eps * u ^ 2)) := by
  have hconv : ConvexOn ℝ (Set.univ : Set ℝ) (fun u : ℝ => u ^ 2) := by
    simpa using (Even.convexOn_pow (𝕜 := ℝ) (n := 2) (by decide))
  have h2 : ConvexOn ℝ (Set.univ : Set ℝ) (fun u : ℝ => eps * u ^ 2) := by
    simpa [Function.comp, smul_eq_mul] using hconv.smul heps
  convert h2.neg using 1

/-- **F3 (c).**  Gaussian damping preserves log-concavity: for a positive profile,
if `log ∘ Φ` is concave then so is `log ∘ Φ_ε`, since
`log Φ_ε (u) = -(ε u²) + log Φ (u)` and `u ↦ -(ε u²)` is concave. -/
theorem gaussianDamp_logConcave (hpos : ∀ u : ℝ, 0 < Phi u) (heps : 0 ≤ eps)
    (hlog : ConcaveOn ℝ Set.univ (fun u : ℝ => Real.log (Phi u))) :
    ConcaveOn ℝ Set.univ (fun u : ℝ => Real.log (gaussianDamp eps Phi u)) := by
  have hrw : (fun u : ℝ => Real.log (gaussianDamp eps Phi u))
      = fun u : ℝ => -(eps * u ^ 2) + Real.log (Phi u) := by
    funext u
    rw [gaussianDamp, Real.log_mul (Real.exp_ne_zero _) (ne_of_gt (hpos u)), Real.log_exp]
  rw [hrw]
  exact (concaveOn_neg_sq heps).add hlog

/-- **F3 (d), pointwise bound.**  Gaussian damping never increases the absolute
value of the profile. -/
theorem gaussianDamp_abs_le (heps : 0 ≤ eps) (u : ℝ) :
    |gaussianDamp eps Phi u| ≤ |Phi u| := by
  rw [gaussianDamp, abs_mul, abs_of_pos (Real.exp_pos _)]
  have h1 : Real.exp (-(eps * u ^ 2)) ≤ 1 := by
    apply Real.exp_le_one_iff.2
    have : 0 ≤ eps * u ^ 2 := mul_nonneg heps (sq_nonneg u)
    linarith
  nlinarith [abs_nonneg (Phi u)]

/-- **F3 (d).**  Any decay bound is preserved; in particular the
doubly-exponential bound `|Φ (u)| ≤ Ce^{-a e^{b|u|}}` of the soft class. -/
theorem gaussianDamp_doubly_exponential_decay (heps : 0 ≤ eps) {Cst a b : ℝ}
    (hdecay : ∀ u : ℝ, |Phi u| ≤ Cst * Real.exp (-(a * Real.exp (b * |u|)))) :
    ∀ u : ℝ, |gaussianDamp eps Phi u| ≤ Cst * Real.exp (-(a * Real.exp (b * |u|))) :=
  fun u => le_trans (gaussianDamp_abs_le heps u) (hdecay u)

/-- **F3 (d), general form.**  Any pointwise majorant of `|Φ|` is a pointwise
majorant of `|Φ_ε|`. -/
theorem gaussianDamp_decay_transfer (heps : 0 ≤ eps) {g : ℝ → ℝ}
    (hdecay : ∀ u : ℝ, |Phi u| ≤ g u) :
    ∀ u : ℝ, |gaussianDamp eps Phi u| ≤ g u :=
  fun u => le_trans (gaussianDamp_abs_le heps u) (hdecay u)

end SoftClosure

end FlowBlindness
