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
  (`Polynomial.deriv`).  All results here are `sorry`-free and `#print axioms`-clean
  (only the standard mathlib axioms, plus the explicitly-declared entire-function
  stand-in `H`) EXCEPT the single deep-analytic `heat_preserves_LP`, which is reduced
  to the Hermite–Poulain / Pólya–Schur multiplier theorem that mathlib still lacks
  (an explicit, cited `sorry`).

  ## What is genuinely NEW here (real, not affine, shadow)

  * `MathlibBridge.hasOnlyRealRoots_derivative` — **the general-degree statement**:
    the derivative of a real-rooted real polynomial is real-rooted, counting roots
    with multiplicity (`HasOnlyRealRoots p → HasOnlyRealRoots p.derivative`).  This
    is the exact fact the core project could ONLY prove in the affine (degree ≤ 1)
    degenerate case (`RealRooted.heatStep_preserves_realRooted_of_affine`).  It is
    the true ℝ-analog of the Hermite–Poulain differentiation step, and is FALSE over
    the `ℤ` model the core project was forced to use.  Sorry-free, via mathlib Rolle.
  * The four DBN order-lemmas re-proved over the REAL predicate
    `HasOnlyRealZeros t := ∀ z : ℂ, H t z = 0 → z.im = 0` on the REAL time axis `ℝ`
    (the core project used an `opaque` predicate on the `ℤ` time axis).
-/
import Mathlib.Analysis.Calculus.LocalExtr.Rolle
import Mathlib.Analysis.Calculus.Deriv.Polynomial
import Mathlib.Analysis.Calculus.LocalExtr.Polynomial
import Mathlib.Analysis.SpecialFunctions.Gaussian.GaussianIntegral
import Mathlib.Topology.Algebra.Polynomial
import Mathlib.Data.Complex.Basic

open scoped Polynomial

namespace MathlibBridge

/-! ## 0. The Rolle bridge and heat-kernel positivity (finite → analytic upgrade) -/

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

/-! ## 1. The DBN order-lemmas over the REAL predicate on the REAL time axis

The core project (`DeBruijnNewman.Basic`) modelled time as `ℤ` and kept
`HasOnlyRealZeros` an `opaque` `Int → Prop`, because plain Lean 4 core has neither
`ℝ` nor `ℂ` nor entire functions.  With mathlib we upgrade to:

* the REAL time axis `ℝ`;
* the GENUINE real-zero predicate
    `HasOnlyRealZeros t := ∀ z : ℂ, H t z = 0 → z.im = 0`
  where `H : ℝ → ℂ → ℂ` is the heat-flow family `H_t = Ξ ∗ G_t`.

`H` is declared as an `axiom`-level stand-in: defining the genuine Riemann Ξ and its
Gaussian convolution is a large entire-function-theory development still absent from
mathlib.  But — crucially — the *predicate is now real*: it is a literal statement
about the imaginary parts of the complex zeros of `H t`, not an opaque black box.
The four order-lemmas below are re-proved sorry-free against this real predicate. -/

/-- Heat-flow family `H_t = Ξ ∗ G_t : ℂ → ℂ`.  Declared as an `axiom`-level stand-in
for the genuine entire function (defining Ξ and the Gaussian convolution needs
entire-function theory not yet in mathlib).  The real-zero predicate below is stated
directly in terms of `H`, so it is a genuine analytic predicate, not an opaque one. -/
axiom H : ℝ → ℂ → ℂ

/-- **Genuine real-zero predicate.**  `HasOnlyRealZeros t` says every complex zero of
`H t` has zero imaginary part.  Unlike the core project's `opaque HasOnlyRealZeros`,
this is the real predicate `∀ z : ℂ, H t z = 0 → z.im = 0`. -/
def HasOnlyRealZeros (t : ℝ) : Prop := ∀ z : ℂ, H t z = 0 → z.im = 0

/-- `IsDBNConstant Λ` : the "good" times (those `t` with `H_t` having only real zeros)
are exactly the ray `[Λ, ∞)`.  Now over the REAL time axis `ℝ`. -/
def IsDBNConstant (Λ : ℝ) : Prop := ∀ t : ℝ, HasOnlyRealZeros t ↔ Λ ≤ t

/-- The Riemann Hypothesis in this framework: `H_0 = Ξ` has only real zeros. -/
def RiemannHypothesis : Prop := HasOnlyRealZeros 0

/-- **Uniqueness of the de Bruijn–Newman constant** (over `ℝ`).  Each candidate is
`≤` the other by evaluating the characterization at the other point; then `ℝ`
antisymmetry.  Ports verbatim from the `ℤ` version — uses only `le_antisymm`. -/
theorem dbn_unique {Λ₁ Λ₂ : ℝ}
    (h₁ : IsDBNConstant Λ₁) (h₂ : IsDBNConstant Λ₂) : Λ₁ = Λ₂ :=
  le_antisymm
    ((h₁ Λ₂).mp ((h₂ Λ₂).mpr le_rfl))
    ((h₂ Λ₁).mp ((h₁ Λ₁).mpr le_rfl))

/-- **de Bruijn monotonicity, as a formal consequence** (over `ℝ`).  If `H_t` has only
real zeros and `t ≤ s`, then so does `H_s`.  Uses only `le_trans`. -/
theorem monotone_of_dbn {Λ t s : ℝ}
    (h : IsDBNConstant Λ) (hts : HasOnlyRealZeros t) (hle : t ≤ s) :
    HasOnlyRealZeros s :=
  (h s).mpr (le_trans ((h t).mp hts) hle)

/-- **RH ⟺ Λ ≤ 0** (over `ℝ`).  Immediate specialization of the characterization at
`t = 0`, using `H_0 = Ξ`. -/
theorem RH_iff_lambda_nonpos {Λ : ℝ} (h : IsDBNConstant Λ) :
    RiemannHypothesis ↔ Λ ≤ 0 :=
  h 0

/-- **RH ⟺ Λ = 0** (over `ℝ`).  Given the Rodgers–Tao bound `0 ≤ Λ` (2020, Ann. of
Math.) as an explicit hypothesis `hRT`, the Riemann Hypothesis is equivalent to
`Λ = 0`.  Taking Rodgers–Tao as a *hypothesis* (rather than an internal `sorry`)
keeps this lemma genuinely sorry-free and `#print axioms`-clean; the deep analytic
content `0 ≤ Λ` is honestly surfaced as the hypothesis it is. -/
theorem RH_iff_lambda_eq_zero {Λ : ℝ} (h : IsDBNConstant Λ) (hRT : 0 ≤ Λ) :
    RiemannHypothesis ↔ Λ = 0 := by
  rw [RH_iff_lambda_nonpos h]
  constructor
  · intro hle; exact le_antisymm hle hRT
  · intro heq; rw [heq]

/-! ## 2. General-degree Laguerre–Pólya scaffolding (the REAL, not affine, shadow)

Here is the genuine advance over the core project's affine shadow.  We use mathlib's
Rolle-based root-count interlacing (`Polynomial.card_roots_le_derivative`) to prove
the FULL general-degree statement that differentiation preserves real-rootedness. -/

/-- **Real-rootedness predicate.**  `HasOnlyRealRoots p` says the real polynomial `p`
"has only real roots" (splits over `ℝ`): the number of its real roots, counted with
multiplicity, equals its degree.  Equivalently every complex root of `p` is real.
This is the genuine (multiplicity-aware) real predicate — the polynomial-level
Laguerre–Pólya membership — replacing the core project's `opaque InLaguerrePolya`. -/
def HasOnlyRealRoots (p : ℝ[X]) : Prop :=
  Multiset.card p.roots = p.natDegree

/-- **General-degree Hermite–Poulain differentiation step (REAL, sorry-free).**
The derivative of a real-rooted real polynomial is real-rooted, roots counted with
multiplicity.  This is the exact statement the core project could prove ONLY in the
affine (degree ≤ 1) case (`RealRooted.heatStep_preserves_realRooted_of_affine`) and
which is FALSE over its `ℤ` model.  It is now proved in full generality over `ℝ`.

Proof (three mathlib inputs, then `omega`):
* `Polynomial.card_roots'`          : `card p'.roots ≤ p'.natDegree`         (always);
* `Polynomial.card_roots_le_derivative` (Rolle, with multiplicity):
                                       `card p.roots ≤ card p'.roots + 1`;
* `Polynomial.natDegree_derivative_le` : `p'.natDegree ≤ p.natDegree − 1`.
With the hypothesis `card p.roots = p.natDegree`, linear arithmetic over `ℕ` forces
`card p'.roots = p'.natDegree`, i.e. `p'` is real-rooted.  (No char-zero hypothesis
is needed: `natDegree_derivative_le` holds unconditionally.) -/
theorem hasOnlyRealRoots_derivative {p : ℝ[X]} (hp : HasOnlyRealRoots p) :
    HasOnlyRealRoots (Polynomial.derivative p) := by
  have h1 : Multiset.card (Polynomial.derivative p).roots ≤ (Polynomial.derivative p).natDegree :=
    Polynomial.card_roots' _
  have h2 : Multiset.card p.roots ≤ Multiset.card (Polynomial.derivative p).roots + 1 :=
    Polynomial.card_roots_le_derivative p
  have h3 : (Polynomial.derivative p).natDegree ≤ p.natDegree - 1 :=
    Polynomial.natDegree_derivative_le p
  unfold HasOnlyRealRoots at hp ⊢
  omega

/-- **Iterated differentiation preserves real-rootedness** (sorry-free corollary).
Every formal derivative `D^n p` of a real-rooted real polynomial is real-rooted.
This is the finite Hermite–Poulain operator `D^n` — the honest, fully-proved core of
"the heat multiplier `e^{tD²} = ∑ (tᵏ/k!) D^{2k}` maps LP into LP"; only the infinite
sum / limit passage (below) remains a gap. -/
theorem hasOnlyRealRoots_iterate_derivative {p : ℝ[X]} (hp : HasOnlyRealRoots p) :
    ∀ n : ℕ, HasOnlyRealRoots (Polynomial.derivative^[n] p)
  | 0 => hp
  | n + 1 => by
      rw [Function.iterate_succ', Function.comp_apply]
      exact hasOnlyRealRoots_derivative (hasOnlyRealRoots_iterate_derivative hp n)

/-! ### The remaining honest gap: the Hermite–Poulain / Pólya–Schur multiplier theorem

The heat semigroup acts on polynomials as `e^{t·D²} = ∑ₖ (tᵏ/k!)·D^{2k}`, a
*diagonal (Hermite–Poulain) multiplier operator*.  The Pólya–Schur theorem
identifies exactly which such operators preserve the Laguerre–Pólya class, and
`e^{t·D²}` is one of them.  The FINITE ingredients of this are now proved above
(`hasOnlyRealRoots_derivative`, `hasOnlyRealRoots_iterate_derivative`); what mathlib
still lacks — and what stays an explicit, cited `sorry` — is the multiplier theorem
itself: the passage from the finite differential operators to the full multiplier and
its LP-preservation. -/

/-- The heat/Hermite–Poulain multiplier operator `e^{t·D²}` applied to a polynomial.
Declared `opaque`: mathlib lacks the Pólya–Schur construction of this operator as a
map `ℝ[X] → ℝ[X]` (it is the limit `∑ₖ (tᵏ/k!)·D^{2k}`, which coincides with the
finite differential operators `hasOnlyRealRoots_derivative` proves things about, but
whose convergence/definition needs entire-function multiplier theory). -/
noncomputable opaque heatMultiplier : ℝ → ℝ[X] → ℝ[X]

/-- **Heat semigroup preserves the (polynomial) Laguerre–Pólya class** — `heat_preserves_LP`.

If `p` has only real roots then so does `e^{t·D²} p` for every `t`.  This is the
Hermite–Poulain / Pólya–Schur multiplier theorem, the honest remaining gap:

* **mathlib GAP** (the `sorry`): the Pólya–Schur / Hermite–Poulain multiplier
  theorem — that the diagonal operator `e^{t·D²} = ∑ₖ (tᵏ/k!) D^{2k}` maps the
  Laguerre–Pólya class into itself.  Reference: Pólya–Schur (*J. reine angew. Math.*
  144, 1914); N. Obreschkoff, *Verteilung und Berechnung der Nullstellen reeller
  Polynome* (1963), Hermite–Poulain theorem; see also Rahman–Schmeisser,
  *Analytic Theory of Polynomials* (2002), Ch. 5.
* **PROVED, sorry-free, reachable ingredients**: the finite Hermite–Poulain
  differentiation operators `D^n` preserve real-rootedness in FULL general degree —
  `hasOnlyRealRoots_derivative` and `hasOnlyRealRoots_iterate_derivative` above.
  These are the genuine ℝ-analogs (via mathlib Rolle) of the core project's affine
  shadow, and are the atomic content the multiplier theorem assembles by summation. -/
theorem heat_preserves_LP (t : ℝ) {p : ℝ[X]} (hp : HasOnlyRealRoots p) :
    HasOnlyRealRoots (heatMultiplier t p) := by
  sorry

/-! ## 3. Axiom audit -/

-- Sorry-free lemmas (each should report ONLY the standard mathlib axioms
-- `propext`, `Classical.choice`, `Quot.sound`, plus the declared stand-in `H`
-- for the DBN-flow lemmas).  No `sorryAx`.
#print axioms derivative_hasRoot_between
#print axioms exists_derivative_root_of_two_roots
#print axioms heatKernel_pos
#print axioms dbn_unique
#print axioms monotone_of_dbn
#print axioms RH_iff_lambda_nonpos
#print axioms RH_iff_lambda_eq_zero
#print axioms hasOnlyRealRoots_derivative
#print axioms hasOnlyRealRoots_iterate_derivative

-- The single deep-analytic gap: this SHOULD report `sorryAx` (Hermite–Poulain /
-- Pólya–Schur multiplier theorem, not in mathlib).
#print axioms heat_preserves_LP

end MathlibBridge
