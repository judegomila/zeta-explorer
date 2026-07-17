/-
  EntireLP — the ENTIRE-FUNCTION lift of the (now complete, sorry-free) polynomial
  de Bruijn / Pólya–Schur theorem `MathlibBridge.heat_preserves_LP`.

  ## What is proved here (and how honest it is)

  The polynomial theorem `MathlibBridge.heat_preserves_LP` says: for `t ≥ 0` the heat
  multiplier `e^{−t·D²} = heatOp t` sends a REAL-ROOTED real polynomial to a real-rooted
  real polynomial.  The genuine object of RH interest is the ENTIRE-function version:
  the Laguerre–Pólya (LP) class — the closure, under locally-uniform limits, of
  real polynomials with only real zeros — is exactly the class of entire functions of
  the form `c·zᵐ·e^{−α z² + β z}·∏(1 − z/aₖ)e^{z/aₖ}` with `aₖ, β ∈ ℝ, α ≥ 0`
  (Levin, *Distribution of Zeros of Entire Functions*, Ch. VIII; Pólya–Schur 1914).
  The Riemann ξ-function is conjectured (RH) to lie in this class.

  This file:
  * DEFINES `IsLaguerrePolya f` for `f : ℂ → ℂ` via the standard limit characterization
    (Levin Thm VIII.3): `f` is real on `ℝ` and a locally-uniform limit of real-rooted
    real polynomials.  The polynomial theorem plugs in DIRECTLY.
  * PROVES, sorry-free and axiom-clean, the natural bridge
    `isLaguerrePolya_heat_of_flow`: any operator `Φ` on entire functions that
      (a) restricts to `heatOp t` on polynomials, and
      (b) is continuous for locally-uniform convergence,
    preserves `IsLaguerrePolya` (for `t ≥ 0`).  This IS the entire-function de Bruijn
    step, reduced to those two analytic interface facts.
  * STATES `heat_preserves_LP_entire` against an `opaque` entire heat-flow `heatFlow`
    whose two interface properties are declared as named `axiom`s (`heatFlow_poly`,
    `heatFlow_continuous`).  The final theorem is then PROVED from the sorry-free bridge.
    `#print axioms heat_preserves_LP_entire` surfaces EXACTLY those two axioms — a
    maximally-precise statement of the remaining analytic gap (see §4 below), preferable
    to an opaque `sorry`.

  ## What mathlib v4.22.0 HAS and LACKS for entire-function theory (survey)

  HAS:
  * `TendstoLocallyUniformlyOn.differentiableOn`
    (`Mathlib/Analysis/Complex/LocallyUniformLimit.lean`): a locally-uniform limit of
    holomorphic functions is holomorphic.  (The Weierstrass convergence theorem.)
  * `TendstoLocallyUniformlyOn.deriv`, `differentiableOn_tsum_of_summable_norm`
    (Weierstrass series), `logDeriv_tendsto`.
  * `Mathlib/Analysis/Complex/Hadamard.lean` — Hadamard THREE-LINES theorem (NOT the
    Hadamard factorization / product theorem).
  * Isolated zeros / identity theorem (`Analysis/Analytic/IsolatedZeros.lean`,
    `Analysis/Analytic/Uniqueness.lean`), open mapping (`Analysis/Complex/OpenMapping.lean`).

  LACKS (the crux, and why the entire lift is genuinely hard):
  * NO Hurwitz theorem for holomorphic functions (limit of non-vanishing ⇒ non-vanishing
    or ≡ 0).  NO Rouché theorem, NO argument principle.  (Searched: no `Rouche`,
    no `ArgumentPrinciple`, no holomorphic Hurwitz anywhere in mathlib.)
  * NO Hadamard factorization / Weierstrass product theorem, NO order/genus of entire
    functions, NO Laguerre–Pólya class.
  * NO Gaussian convolution / heat semigroup on entire functions of order ≤ 2.

  Because the limit characterization is taken as the DEFINITION of the class, the bridge
  below does NOT need holomorphic Hurwitz: real-rootedness of the polynomial approximants
  is inherited by fiat of the definition (the class is a limit-closure).  What we cannot
  yet build in mathlib is the FLOW itself (§4).
-/
import MathlibBridge
import Mathlib.Topology.UniformSpace.LocallyUniformConvergence
import Mathlib.Data.Complex.Module
import Mathlib.Analysis.Complex.Basic
import Mathlib.Algebra.Polynomial.AlgebraMap

open scoped Polynomial Topology
open Filter

namespace EntireLP

/-! ## 1. A real polynomial as an entire function `ℂ → ℂ` -/

/-- A real polynomial `p : ℝ[X]`, viewed as the entire function `z ↦ p(z)` on `ℂ`
(via the `ℝ`-algebra map `ℝ → ℂ`).  This is the embedding along which the polynomial
Laguerre–Pólya theorem is transported to entire functions. -/
noncomputable def toEntire (p : ℝ[X]) : ℂ → ℂ := fun z => Polynomial.aeval z p

/-- **`toEntire p` is real on `ℝ`** (conjugation-symmetric): `p(conj z) = conj p(z)`,
because `p` has real coefficients.  This is the "real entire function" half of the LP
definition, automatic for polynomial approximants. -/
theorem toEntire_conj (p : ℝ[X]) (z : ℂ) :
    toEntire p (starRingEnd ℂ z) = starRingEnd ℂ (toEntire p z) := by
  have h := Polynomial.aeval_algHom_apply Complex.conjAe z p
  simpa only [toEntire, Complex.conjAe_coe] using h

/-! ## 2. Locally-uniform-convergence toolkit -/

/-- The constant sequence converges locally uniformly to its value.  (Used to embed a
single real-rooted polynomial into the LP class.) -/
theorem tendstoLocallyUniformly_const (h : ℂ → ℂ) :
    TendstoLocallyUniformly (fun _ : ℕ => h) h atTop :=
  TendstoUniformly.tendstoLocallyUniformly
    (fun _u hu => Eventually.of_forall fun _n _x => refl_mem_uniformity hu)

/-- **Real-on-`ℝ` passes to locally-uniform limits.**  If every `F n` is
conjugation-symmetric and `F → g` locally uniformly, then `g` is conjugation-symmetric.
(Pointwise limit + continuity of complex conjugation + uniqueness of limits.  This is
why the conjugation-symmetry conjunct of `IsLaguerrePolya` below is automatic for any
function presented as such a limit.) -/
theorem real_symm_of_tendsto {F : ℕ → ℂ → ℂ} {g : ℂ → ℂ}
    (hF : ∀ n z, F n (starRingEnd ℂ z) = starRingEnd ℂ (F n z))
    (h : TendstoLocallyUniformly F g atTop) :
    ∀ z, g (starRingEnd ℂ z) = starRingEnd ℂ (g z) := by
  intro z
  have h1 : Tendsto (fun n => F n (starRingEnd ℂ z)) atTop (𝓝 (g (starRingEnd ℂ z))) :=
    (h.tendstoLocallyUniformlyOn).tendsto_at (Set.mem_univ _)
  have h2 : Tendsto (fun n => F n z) atTop (𝓝 (g z)) :=
    (h.tendstoLocallyUniformlyOn).tendsto_at (Set.mem_univ _)
  have h3 : Tendsto (fun n => starRingEnd ℂ (F n z)) atTop (𝓝 (starRingEnd ℂ (g z))) :=
    (Complex.continuous_conj.tendsto (g z)).comp h2
  have h1' : Tendsto (fun n => starRingEnd ℂ (F n z)) atTop (𝓝 (g (starRingEnd ℂ z))) := by
    simpa only [hF] using h1
  exact tendsto_nhds_unique h1' h3

/-! ## 3. The Laguerre–Pólya class for entire functions -/

/-- **The Laguerre–Pólya class** `IsLaguerrePolya f` for an entire `f : ℂ → ℂ`, via the
standard limit characterization (Levin, *Distribution of Zeros of Entire Functions*,
Thm VIII.3; Pólya–Schur 1914):

* `f` is REAL ON `ℝ`: `f(conj z) = conj f(z)` for all `z` (i.e. real Taylor coefficients);
* `f` is a LOCALLY-UNIFORM LIMIT of real polynomials with only real zeros.

The second clause is the operative one; by `real_symm_of_tendsto` it already forces the
first, so the definition is equivalent to "locally-uniform limit of real-rooted real
polynomials".  Both clauses are stated to be faithful to Levin's "real entire function"
formulation, and so that `MathlibBridge.heat_preserves_LP` plugs in directly. -/
def IsLaguerrePolya (f : ℂ → ℂ) : Prop :=
  (∀ z : ℂ, f (starRingEnd ℂ z) = starRingEnd ℂ (f z)) ∧
    ∃ P : ℕ → ℝ[X], (∀ n, MathlibBridge.HasOnlyRealRoots (P n)) ∧
      TendstoLocallyUniformly (fun n => toEntire (P n)) f atTop

/-- The conjugation-symmetry (real-on-`ℝ`) component of LP membership. -/
theorem IsLaguerrePolya.real_symm {f : ℂ → ℂ} (hf : IsLaguerrePolya f) :
    ∀ z : ℂ, f (starRingEnd ℂ z) = starRingEnd ℂ (f z) := hf.1

/-- **Every real-rooted real polynomial is Laguerre–Pólya** — the direct plug-in of the
polynomial theory into the entire-function class. -/
theorem isLaguerrePolya_of_hasOnlyRealRoots {p : ℝ[X]}
    (hp : MathlibBridge.HasOnlyRealRoots p) : IsLaguerrePolya (toEntire p) :=
  ⟨toEntire_conj p, fun _ => p, fun _ => hp, tendstoLocallyUniformly_const _⟩

/-! ## 4. The entire-function de Bruijn / Pólya–Schur bridge -/

/-- **The bridge (sorry-free, axiom-clean).**  Let `Φ` be any operator on entire
functions such that, for a fixed `t ≥ 0`,

* (poly-compat) `Φ` restricts to the polynomial heat multiplier on polynomials:
  `Φ (toEntire p) = toEntire (heatOp t p)`;
* (loc-unif-continuity) `Φ` maps locally-uniformly-convergent sequences to
  locally-uniformly-convergent sequences with the correspondingly-mapped limit.

Then `Φ` PRESERVES the Laguerre–Pólya class.

This is the entire-function de Bruijn step, reduced to those two interface facts.  The
proof: LP membership of `f` gives real-rooted approximants `Pₙ → f`; the polynomial
theorem `heat_preserves_LP` makes `Qₙ := heatOp t Pₙ` real-rooted; poly-compat gives
`toEntire Qₙ = Φ (toEntire Pₙ)`; loc-unif-continuity pushes the limit through to
`toEntire Qₙ → Φ f`; hence `Φ f` is an LP function (real-on-`ℝ` is inherited via
`real_symm_of_tendsto`).  No holomorphic Hurwitz theorem is needed — the class is a
limit-closure by definition, and real-rootedness of the approximants is the finite
`heat_preserves_LP`. -/
theorem isLaguerrePolya_heat_of_flow
    (Φ : (ℂ → ℂ) → (ℂ → ℂ)) (t : ℝ) (ht : 0 ≤ t)
    (hpoly : ∀ p : ℝ[X], Φ (toEntire p) = toEntire (MathlibBridge.heatOp t p))
    (hcont : ∀ {F : ℕ → ℂ → ℂ} {g : ℂ → ℂ}, TendstoLocallyUniformly F g atTop →
        TendstoLocallyUniformly (fun n => Φ (F n)) (Φ g) atTop)
    {f : ℂ → ℂ} (hf : IsLaguerrePolya f) :
    IsLaguerrePolya (Φ f) := by
  obtain ⟨_, P, hPrr, hPlim⟩ := hf
  refine ⟨?_, fun n => MathlibBridge.heatOp t (P n),
          fun n => MathlibBridge.heat_preserves_LP t ht (hPrr n), ?_⟩
  · -- real-on-ℝ for `Φ f`, from the (about-to-be-established) limit of real approximants
    have hlim : TendstoLocallyUniformly
        (fun n => toEntire (MathlibBridge.heatOp t (P n))) (Φ f) atTop := by
      have hc := hcont hPlim
      simpa only [hpoly] using hc
    exact real_symm_of_tendsto (fun n z => toEntire_conj _ z) hlim
  · -- the transported limit `toEntire (heatOp t Pₙ) → Φ f`
    have hc := hcont hPlim
    simpa only [hpoly] using hc

/-! ## 5. The opaque entire heat-flow and the entire-function theorem

The two hypotheses of `isLaguerrePolya_heat_of_flow` are precisely the analytic facts
that mathlib v4.22.0 cannot yet supply for a genuinely-defined entire heat flow:

* CONSTRUCTING `heatFlow t f = (f ∗ Gₜ)` — the Weierstrass/Gaussian transform on entire
  functions of order ≤ 2 — requires a convergent complex Gaussian convolution integral
  (mathlib has `Mathlib/Analysis/SpecialFunctions/Gaussian/*` on `ℝ` but no entire-order
  growth theory to control the integral on `ℂ`).
* `heatFlow_poly` (agreement with `heatOp` on polynomials) is de Bruijn's computation
  `e^{−tD²} p = (2√(πt))⁻¹∫ p(z − s) e^{−s²/4t} ds` (de Bruijn 1950, §1); needs the above
  integral plus differentiation under the integral sign.
* `heatFlow_continuous` (continuity for locally-uniform convergence) is a dominated-
  convergence estimate on the same integral.

We therefore declare `heatFlow` `opaque` with these two properties as named `axiom`s.
The final theorem is proved from the sorry-free bridge; `#print axioms` then names
exactly the missing analytic inputs — an honest, precise accounting of the gap. -/

/-- The intended entire heat flow `e^{−t·D²}` on `ℂ → ℂ` — declared `opaque` because
mathlib lacks the order-≤2 Gaussian-convolution theory needed to construct it (§5). -/
opaque heatFlow : ℝ → (ℂ → ℂ) → (ℂ → ℂ)

/-- **[AXIOM — missing mathlib input]** The entire heat flow agrees with the polynomial
heat multiplier `MathlibBridge.heatOp` on polynomials.  (de Bruijn 1950, §1: the
Gaussian-transform formula for `e^{−tD²}`; needs entire Gaussian convolution.) -/
axiom heatFlow_poly (t : ℝ) (p : ℝ[X]) :
    heatFlow t (toEntire p) = toEntire (MathlibBridge.heatOp t p)

/-- **[AXIOM — missing mathlib input]** The entire heat flow is continuous for
locally-uniform convergence.  (Dominated-convergence estimate on the Gaussian
convolution; needs the entire-order growth theory mathlib lacks.) -/
axiom heatFlow_continuous (t : ℝ) {F : ℕ → ℂ → ℂ} {g : ℂ → ℂ}
    (h : TendstoLocallyUniformly F g atTop) :
    TendstoLocallyUniformly (fun n => heatFlow t (F n)) (heatFlow t g) atTop

/-- **The heat semigroup preserves the Laguerre–Pólya class of ENTIRE functions**
(`heat_preserves_LP_entire`) — the entire-function lift of `MathlibBridge.heat_preserves_LP`.

For `t ≥ 0`, if `f` is Laguerre–Pólya then so is `heatFlow t f`.  This is the
entire-function de Bruijn theorem: the heat flow does not create non-real zeros.  It is
proved from the sorry-free bridge `isLaguerrePolya_heat_of_flow` together with the two
declared interface axioms on `heatFlow` (§5).  `#print axioms` on this theorem lists
those axioms explicitly (`heatFlow`, `heatFlow_poly`, `heatFlow_continuous`), pinpointing
the exact remaining analytic gap. -/
theorem heat_preserves_LP_entire {f : ℂ → ℂ} {t : ℝ} (ht : 0 ≤ t)
    (hf : IsLaguerrePolya f) : IsLaguerrePolya (heatFlow t f) :=
  isLaguerrePolya_heat_of_flow (heatFlow t) t ht (heatFlow_poly t)
    (fun {_F _g} h => heatFlow_continuous t h) hf

/-! ## 6. Axiom audit -/

-- SORRY-FREE, AXIOM-CLEAN (only `propext`, `Classical.choice`, `Quot.sound`):
#print axioms toEntire_conj
#print axioms tendstoLocallyUniformly_const
#print axioms real_symm_of_tendsto
#print axioms isLaguerrePolya_of_hasOnlyRealRoots
#print axioms isLaguerrePolya_heat_of_flow   -- the sorry-free entire-function BRIDGE

-- DEPENDS ON THE DECLARED FLOW AXIOMS (the honest remaining gap, precisely named):
--   `heatFlow`, `heatFlow_poly`, `heatFlow_continuous`  — NO `sorryAx`.
#print axioms heat_preserves_LP_entire

end EntireLP
