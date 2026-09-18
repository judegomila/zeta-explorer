import Mathlib

/-!
# Basic definitions for the Laguerre–Pólya / heat-flow package

This file fixes the vocabulary used throughout: the Laguerre–Pólya class,
polynomials with only real roots, the heat operator on polynomials, the formal
heat flow of an entire function, and the heat-majorization condition on a
sequence of polynomial approximants.
-/

open Polynomial Filter

namespace MathlibBridge

/-- A real polynomial has only real roots when each of its complex roots is real. -/
def HasOnlyRealRoots (P : ℝ[X]) : Prop :=
  ∀ z : ℂ, Polynomial.aeval z P = 0 → z.im = 0

/-- The heat operator `e^{-t D²}` applied to a polynomial: the (finite) sum
`∑ k, (-t)^k / k! * P^{(2k)}`. -/
noncomputable def heatOp (t : ℝ) (P : ℝ[X]) : ℝ[X] :=
  ∑ k ∈ Finset.range (P.natDegree + 1),
    ((-t) ^ k / (k.factorial : ℝ)) • (Polynomial.derivative^[2 * k] P)

end MathlibBridge

namespace EntireLP

/-- A real polynomial viewed as an entire function on `ℂ`. -/
noncomputable def toEntire (P : ℝ[X]) : ℂ → ℂ := fun z => Polynomial.aeval z P

/-- The Laguerre–Pólya class: locally uniform limits on `ℂ` of real polynomials all of
whose roots are real. -/
def IsLaguerrePolya (f : ℂ → ℂ) : Prop :=
  ∃ P : ℕ → ℝ[X], (∀ n, MathlibBridge.HasOnlyRealRoots (P n)) ∧
    TendstoLocallyUniformly (fun n => toEntire (P n)) f atTop

/-- A sequence of polynomials is heat-majorized at time `t` when, on every ball, the
terms of the heat series of the approximants are dominated, uniformly in `n`, by a
summable sequence. -/
def HeatMajorized (t : ℝ) (P : ℕ → ℝ[X]) : Prop :=
  ∀ r : ℝ, 0 < r → ∃ u : ℕ → ℝ, Summable u ∧
    ∀ n k, ∀ z : ℂ, ‖z‖ ≤ r →
      t ^ k / (k.factorial : ℝ) * ‖iteratedDeriv (2 * k) (toEntire (P n)) z‖ ≤ u k

/-- The Gaussian `z ↦ exp (-z²)`. -/
noncomputable def gaussian : ℂ → ℂ := fun z => Complex.exp (-z ^ 2)

/-- The formal heat flow `e^{-t D²} f` of an entire function, defined by its series
(with the junk value `0` at points where the series diverges). -/
noncomputable def heatFlow (t : ℝ) (f : ℂ → ℂ) : ℂ → ℂ :=
  fun z => ∑' k : ℕ, ((-t) ^ k / (k.factorial : ℝ)) • iteratedDeriv (2 * k) f z

end EntireLP

/-! ## Probe-verbatim vocabulary

The two definitions below are copied VERBATIM from the probe being refuted, so that the
refutation theorems can be stated in exactly the probe's vocabulary:

* `Probe.HasOnlyRealRoots` is `MathlibBridge.HasOnlyRealRoots` of the probe's
  `MathlibBridge.lean` (lines 185–186): the multiplicity-counted root-count form
  `Multiset.card p.roots = p.natDegree`;
* `Probe.IsLaguerrePolya` is `EntireLP.IsLaguerrePolya` of the probe's `EntireLP.lean`
  (lines 145–148): the conjugation-symmetry conjunct AND the locally-uniform
  approximation clause with the probe's root predicate.

The only changes are namespace qualification (`Probe.HasOnlyRealRoots` for the probe's
`MathlibBridge.HasOnlyRealRoots`, `EntireLP.toEntire` for the probe's `toEntire` — the
`toEntire` definitions coincide verbatim). -/

namespace Probe

/-- PROBE-VERBATIM real-rootedness predicate (probe `MathlibBridge.HasOnlyRealRoots`):
the number of real roots of `p`, counted with multiplicity, equals its degree. -/
def HasOnlyRealRoots (p : ℝ[X]) : Prop :=
  Multiset.card p.roots = p.natDegree

/-- PROBE-VERBATIM Laguerre–Pólya class (probe `EntireLP.IsLaguerrePolya`): conjugation
symmetry (real on `ℝ`) AND locally-uniform approximation by real polynomials with only
real roots in the sense of `Probe.HasOnlyRealRoots`. -/
def IsLaguerrePolya (f : ℂ → ℂ) : Prop :=
  (∀ z : ℂ, f (starRingEnd ℂ z) = starRingEnd ℂ (f z)) ∧
    ∃ P : ℕ → ℝ[X], (∀ n, Probe.HasOnlyRealRoots (P n)) ∧
      TendstoLocallyUniformly (fun n => EntireLP.toEntire (P n)) f atTop

end Probe
