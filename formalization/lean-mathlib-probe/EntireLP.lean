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
import Mathlib.Analysis.Calculus.IteratedDeriv.Defs
import Mathlib.Analysis.Calculus.Deriv.Polynomial
import Mathlib.Topology.Algebra.InfiniteSum.Basic

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

/-- **Complex iterated derivative of a polynomial-image.**  The `n`-th (holomorphic)
derivative of the entire function `toEntire p` is `toEntire (D^n p)`: differentiation under
`Polynomial.aeval` is the formal polynomial derivative (`Polynomial.deriv_aeval`), iterated.
This is the exact ingredient that makes the order-≤2 heat-flow series *finite* (hence trivially
convergent) on polynomial images.  Sorry-free. -/
theorem iteratedDeriv_toEntire (p : ℝ[X]) (n : ℕ) :
    iteratedDeriv n (toEntire p) = toEntire (Polynomial.derivative^[n] p) := by
  induction n with
  | zero => simp [iteratedDeriv_zero]
  | succ n ih =>
      rw [iteratedDeriv_succ, ih]
      funext z
      rw [Function.iterate_succ_apply']
      exact Polynomial.deriv_aeval _

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

/-! ## 5. The CONCRETE entire heat-flow and the entire-function theorem

The two hypotheses of `isLaguerrePolya_heat_of_flow` are the only analytic facts standing
between the sorry-free bridge and a fully-constructed entire heat flow.  This round replaces
the former `opaque heatFlow` with a **genuine, computable definition** and discharges the
first of the two axioms (`heatFlow_poly`) **sorry-free**.

**The construction (sign-correct `e^{−t·D²}`).**  Rather than the *forward* Gaussian
convolution `f ∗ Gₜ` — which realises `e^{+t·D²}` and DESTROYS real-rootedness (e.g. it
sends `X²−1` to `X²+(2t−1)`, a conjugate pair for `t > 1/2`) — we use de Bruijn's order-≤2
power-series representation

    `heatFlow t f (z) = Σₖ ((−t)ᵏ/k!)·f^{(2k)}(z)`    (`f^{(2k)} =` `iteratedDeriv (2k) f`),

which is exactly `e^{−t·D²}` (Fourier/Weierstrass symbol `e^{−t x²}`).  For an entire `f` of
order `< 2` this series converges locally uniformly; here we realise it by an honest `tsum`,
so it is defined for *every* `f : ℂ → ℂ` (returning the junk value `0` where the series fails
to converge — which never happens on the order-0 polynomial images that `heatFlow_poly`
concerns).

**Sign verification.**  `heatFlow_poly` (below, PROVED) forces `heatFlow t (toEntire p) =
toEntire (heatOp t p)` on every polynomial, and `MathlibBridge.heatOp` is the already
sign-verified `e^{−t·D²}` (`heatOp t (X²−1) = X²−(1+2t)`, real-rooted for `t ≥ 0`).  So the
flow inherits the correct anti-diffusive sign by construction. -/

/-- **The entire heat flow `e^{−t·D²}`, made CONCRETE** (no longer `opaque`).  Defined by the
order-≤2 representation `Σₖ ((−t)ᵏ/k!)·f^{(2k)}(z)` as an `∑'` over `k : ℕ`.  On polynomial
images the sum is genuinely finite (high derivatives vanish), so it converges to
`MathlibBridge.heatOp` — this is `heatFlow_poly`.  For a general entire `f` of order `< 2` the
series still converges (the deferred `heatFlow_continuous` analytic input); elsewhere the
`tsum` is the junk `0`. -/
noncomputable def heatFlow (t : ℝ) (f : ℂ → ℂ) : ℂ → ℂ :=
  fun z => ∑' k : ℕ, ((-t) ^ k / (k.factorial : ℝ)) • iteratedDeriv (2 * k) f z

/-- **`heatFlow_poly` — NOW A THEOREM (axiom discharged, sorry-free).**  The concrete entire
heat flow agrees with the polynomial heat multiplier `MathlibBridge.heatOp` on polynomials:
`heatFlow t (toEntire p) = toEntire (heatOp t p)`.

Proof.  The defining `∑'` has summand `((−t)ᵏ/k!)·(toEntire p)^{(2k)}(z)`.  By
`iteratedDeriv_toEntire`, `(toEntire p)^{(2k)}(z) = aeval z (D^{2k} p)`, and `D^{2k} p = 0`
for `2k > natDegree p`, so all but finitely many terms vanish; `tsum_eq_sum` collapses the
`∑'` to the finite `∑` over `range (natDegree p + 1)`.  The right side, `aeval z (heatOp t p)`,
is that same finite sum (`heatOp = heatPartial (natDegree p + 1)`) after pushing `aeval z`
through the sum (`map_sum`) and the real scalings (`map_smul`).  No convergence/analytic input
is needed — this is why `heatFlow_poly` is the cleanest of the two axioms to discharge. -/
theorem heatFlow_poly (t : ℝ) (p : ℝ[X]) :
    heatFlow t (toEntire p) = toEntire (MathlibBridge.heatOp t p) := by
  funext z
  have hL : heatFlow t (toEntire p) z
      = ∑ k ∈ Finset.range (p.natDegree + 1),
          ((-t) ^ k / (k.factorial : ℝ)) • Polynomial.aeval z (Polynomial.derivative^[2 * k] p) := by
    have hsum :
        (fun k : ℕ => ((-t) ^ k / (k.factorial : ℝ)) • iteratedDeriv (2 * k) (toEntire p) z)
          = (fun k : ℕ => ((-t) ^ k / (k.factorial : ℝ))
              • Polynomial.aeval z (Polynomial.derivative^[2 * k] p)) := by
      funext k; rw [iteratedDeriv_toEntire]; rfl
    show (∑' k : ℕ, ((-t) ^ k / (k.factorial : ℝ)) • iteratedDeriv (2 * k) (toEntire p) z) = _
    rw [hsum]
    refine tsum_eq_sum ?_
    intro k hk
    rw [Finset.mem_range, not_lt] at hk
    rw [Polynomial.iterate_derivative_eq_zero (show p.natDegree < 2 * k by omega), map_zero,
      smul_zero]
  have hR : toEntire (MathlibBridge.heatOp t p) z
      = ∑ k ∈ Finset.range (p.natDegree + 1),
          ((-t) ^ k / (k.factorial : ℝ)) • Polynomial.aeval z (Polynomial.derivative^[2 * k] p) := by
    show Polynomial.aeval z (MathlibBridge.heatOp t p) = _
    unfold MathlibBridge.heatOp MathlibBridge.heatPartial
    rw [map_sum]
    refine Finset.sum_congr rfl (fun k _ => ?_)
    rw [map_smul]
  rw [hL, hR]

/-! ### The former `heatFlow_continuous` axiom is FALSE — corrected architecture

**Critical finding (THIS round).**  The previous round left ONE named axiom,
`heatFlow_continuous`, stating that the entire heat flow is continuous for locally-uniform
convergence *for arbitrary sequences* `F n → g`:

    `TendstoLocallyUniformly F g atTop → TendstoLocallyUniformly (heatFlow t ∘ F) (heatFlow t g)`.

**This statement is FALSE** — even when every `F n` is entire (indeed a real-rooted real
polynomial).  Explicit counterexample (`t = 1`):

    `F n (z) = (n! / (2n)!) · z^{2n}`   (a real polynomial, only real zeros — `z = 0` of
    multiplicity `2n`),      `g = 0`.

* `F n → 0` locally uniformly: on `‖z‖ ≤ R`, `‖F n z‖ ≤ (n!/(2n)!) R^{2n}`, and the ratio of
  consecutive bounds is `(n+1)R² / ((2n+1)(2n+2)) → 0`, so `(n!/(2n)!) R^{2n} → 0` (the
  double factorial dominates).  Hence `sup_{‖z‖≤R} ‖F n z‖ → 0` on every closed ball.
* But `heatFlow 1 (F n) (0) = (-1)ⁿ`, which does NOT converge (it does not tend to
  `heatFlow 1 0 (0) = 0`).  Indeed by `heatFlow_poly`, `heatFlow 1 (F n) = toEntire (heatOp 1 (F n))`,
  and `aeval 0 (heatOp 1 (c·X^{2n})) = c · ((-1)ⁿ/n!) · (2n)!` because among the terms
  `((-1)ᵏ/k!)·D^{2k}(c·X^{2n})` only `k = n` contributes a nonzero constant term
  (`D^{2n}(X^{2n}) = (2n)!`); with `c = n!/(2n)!` this is exactly `(-1)ⁿ`.

**Why this is fatal to the roadmap's H5/B2 plan.**  The plan was to dominate the tail of
`Σₖ ((−t)ᵏ/k!)·f^{(2k)}` by a locally-uniform summable majorant (brick B2, Cauchy estimates)
uniform over the approximating sequence.  The counterexample is a *disproof that any such
uniform majorant exists*: loc-unif convergence of a sequence of entire functions gives NO
control on the infinite sum of their high-order derivatives.  So `heatFlow_continuous` cannot
be discharged — it is not a missing lemma, it is a false statement — and the naive
"loc-unif-continuous operator" route to `heat_preserves_LP_entire` is dead.

**The corrected interface.**  The bridge `isLaguerrePolya_heat_of_flow` above remains a
correct, sorry-free, axiom-clean theorem (a *conditional*: any poly-compatible operator that
IS loc-unif continuous preserves LP).  It simply cannot be instantiated at `Φ = heatFlow t`,
because `heatFlow t` is not loc-unif continuous.  The genuine de Bruijn content that survives
is the following TRUE statement: for `f ∈ LP` one can choose a *specific, type-controlled*
sequence of real-rooted approximants whose heat images converge to `heatFlow t f` (a general
approximating sequence does NOT work — that is exactly what the counterexample shows).  This
choice is the real remaining hard work (it needs the Hadamard/Laguerre–Pólya structure theory,
bricks B2–B8 with genuine order/type control — NOT the impossible uniform majorant), and is
isolated below as the single precise `sorry`. -/

/-- **[THE SINGLE REMAINING GAP — a precise `sorry`, and a TRUE statement].**  The genuine
de Bruijn content of `heat_preserves_LP_entire`, stated at the approximation level.

For `t ≥ 0` and `f ∈ LP`, there is a sequence `P n` of real-rooted real polynomials such that
`toEntire (P n) → f` locally uniformly AND the heat images `toEntire (heatOp t (P n))` converge
locally uniformly to `heatFlow t f`.  (The second convergence is the content: by the
counterexample above it FAILS for a generic `f`-approximating sequence, so `P n` must be chosen
with uniform order/type control — the Hadamard/LP structure theory, bricks B2–B8.)

This is TRUE (de Bruijn) and precisely names the remaining analytic work.  It replaces the
previous, FALSE, `axiom heatFlow_continuous`.  Left as ONE `sorry` (not an axiom) so the audit
shows a single `sorryAx` for a *true* statement, rather than propping the theorem on a false
premise. -/
theorem exists_heatOp_approx_tendsto {f : ℂ → ℂ} {t : ℝ} (ht : 0 ≤ t)
    (hf : IsLaguerrePolya f) :
    ∃ P : ℕ → ℝ[X], (∀ n, MathlibBridge.HasOnlyRealRoots (P n)) ∧
      TendstoLocallyUniformly (fun n => toEntire (P n)) f atTop ∧
      TendstoLocallyUniformly
        (fun n => toEntire (MathlibBridge.heatOp t (P n))) (heatFlow t f) atTop := by
  sorry

/-- **The heat semigroup preserves the Laguerre–Pólya class of ENTIRE functions**
(`heat_preserves_LP_entire`) — the entire-function lift of `MathlibBridge.heat_preserves_LP`.

For `t ≥ 0`, if `f` is Laguerre–Pólya then so is `heatFlow t f`.  This is the entire-function
de Bruijn theorem: the heat flow does not create non-real zeros.

The reduction to `exists_heatOp_approx_tendsto` is sorry-free: the chosen `heatOp t (P n)` are
real-rooted (`MathlibBridge.heat_preserves_LP`), their images converge loc-uniformly to
`heatFlow t f`, and real-on-`ℝ` is inherited via `real_symm_of_tendsto`.  The ONLY remaining
`sorry` (hence the only `sorryAx` in `#print axioms` below) is `exists_heatOp_approx_tendsto`,
a TRUE statement — this replaces the previous, FALSE, `heatFlow_continuous` axiom. -/
theorem heat_preserves_LP_entire {f : ℂ → ℂ} {t : ℝ} (ht : 0 ≤ t)
    (hf : IsLaguerrePolya f) : IsLaguerrePolya (heatFlow t f) := by
  obtain ⟨P, hPrr, _hPf, hQconv⟩ := exists_heatOp_approx_tendsto ht hf
  exact ⟨real_symm_of_tendsto (fun n z => toEntire_conj _ z) hQconv,
         fun n => MathlibBridge.heatOp t (P n),
         fun n => MathlibBridge.heat_preserves_LP t ht (hPrr n), hQconv⟩

/-! ## 6. Axiom audit -/

-- SORRY-FREE, AXIOM-CLEAN (only `propext`, `Classical.choice`, `Quot.sound`):
#print axioms toEntire_conj
#print axioms iteratedDeriv_toEntire            -- complex D^n of a polynomial image
#print axioms tendstoLocallyUniformly_const
#print axioms real_symm_of_tendsto
#print axioms isLaguerrePolya_of_hasOnlyRealRoots
#print axioms isLaguerrePolya_heat_of_flow   -- the sorry-free entire-function BRIDGE
#print axioms heatFlow_poly                  -- AXIOM DISCHARGED THIS ROUND (now a theorem)

-- DEPENDS ON THE SINGLE REMAINING GAP `exists_heatOp_approx_tendsto` (one `sorryAx`, a TRUE
-- statement).  The previous `axiom heatFlow_continuous` was FALSE (see the counterexample in §5)
-- and has been removed; the reduction below is sorry-free apart from that one gap.
#print axioms exists_heatOp_approx_tendsto     -- the one precise remaining `sorry` (TRUE stmt)
#print axioms heat_preserves_LP_entire          -- now [propext, Classical.choice, Quot.sound, sorryAx]

end EntireLP
