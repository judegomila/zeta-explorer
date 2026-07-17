/-
  MathlibBridge — the finite → analytic bridge that plain Lean 4 core CANNOT reach.

  The core-only project `DeBruijnNewman.RealRooted` proves the honest degenerate
  shadow of the Hermite–Poulain / heat-step real-rootedness fact, and documents (in
  its own comments) that the general-degree statement

      "the derivative of a real-rooted polynomial is real-rooted"

  is EXACTLY Rolle's theorem / root interlacing, is NOT closeable in plain core (it
  needs the mean value theorem and ℝ-completeness), and is even FALSE pointwise over
  the integers `ℤ` used there (e.g. `d/dx [X(X-1)(X-2)] = 3X² − 6X + 2` has the
  irrational roots `1 ± 1/√3`, so a ℤ-real-rooted cubic can have a derivative with no
  integer roots).

  This module discharges that exact obstruction over `ℝ` using mathlib's Rolle
  theorem (`exists_deriv_eq_zero`) and the polynomial-derivative bridge
  (`Polynomial.deriv`).  Both results are `sorry`-free and `#print axioms`-clean
  (only the three standard mathlib axioms).  This is the genuine analytic content
  that `DeBruijnNewman` could not obtain while stuck on core.
-/
import Mathlib.Analysis.Calculus.LocalExtr.Rolle
import Mathlib.Analysis.Calculus.Deriv.Polynomial
import Mathlib.Analysis.SpecialFunctions.Gaussian.GaussianIntegral
import Mathlib.Topology.Algebra.Polynomial

open scoped Polynomial

namespace MathlibBridge

/-- **Rolle bridge (root interlacing).**  If a real polynomial `p` vanishes at two
distinct points `a < b`, then its formal derivative `p.derivative` vanishes at some
strictly interior point `c ∈ (a, b)`.

This is the finite-dimensional → analytic upgrade of
`DeBruijnNewman.RealRooted.heatStep_preserves_realRooted_of_affine`: the honest
core project could only handle the affine (degenerate-degree) case because the
general case is precisely this Rolle/MVT step.  Here the mean value theorem
(`exists_deriv_eq_zero`) and the polynomial-derivative identity (`Polynomial.deriv`)
supply the missing analytic ingredient. -/
theorem derivative_hasRoot_between {p : ℝ[X]} {a b : ℝ}
    (hab : a < b) (ha : p.eval a = 0) (hb : p.eval b = 0) :
    ∃ c, a < c ∧ c < b ∧ (Polynomial.derivative p).eval c = 0 := by
  obtain ⟨c, hc, hc0⟩ :=
    exists_deriv_eq_zero hab p.continuousOn (ha.trans hb.symm)
  refine ⟨c, hc.1, hc.2, ?_⟩
  rwa [p.deriv] at hc0

/-- **Consecutive real roots interlace with a derivative root.**  A convenient
restatement: between any two roots `a < b` of `p`, the derivative `p.derivative` has
a genuine real root.  This is the atomic step from which mathlib's
`Polynomial.card_roots_le_derivative` (root-count interlacing) is assembled, and the
faithful ℝ-analog of the finite real-rootedness closure used in the LP-class chain. -/
theorem exists_derivative_root_of_two_roots {p : ℝ[X]} {a b : ℝ}
    (hab : a < b) (ha : p.IsRoot a) (hb : p.IsRoot b) :
    ∃ c, a < c ∧ c < b ∧ (Polynomial.derivative p).IsRoot c :=
  derivative_hasRoot_between hab ha hb

/-- **Gaussian heat-kernel positivity.**  The 1-D heat kernel
`G_t(x) = exp(−x²/(4t)) / √(4πt)` is strictly positive for every `x` and every
time `t > 0`.  This is the concrete real-analysis fact named in
`DeBruijnNewman.Basic` as "provable TODAY in mathlib, no `sorry`"; it is the
convolution kernel of the heat semigroup `H_t = Ξ ∗ G_t` that underlies
`heat_preserves_LP`. -/
theorem heatKernel_pos {t : ℝ} (ht : 0 < t) (x : ℝ) :
    0 < Real.exp (-(x ^ 2) / (4 * t)) / Real.sqrt (4 * Real.pi * t) := by
  have hπ : 0 < Real.pi := Real.pi_pos
  positivity

end MathlibBridge
