import RequestProject.EntireLP

/-!
# The main theorem restated in the PROBE's exact vocabulary

`RequestProject.EntireLP` proves the stage-1 theorem
`EntireLP.exists_LP_approx_heatMajorized_order_le_one`, but its reconstructed vocabulary
drifted from the probe's (`mathexplorer/formalization/lean-mathlib-probe`) in two places:

* `EntireLP.toEntire` here is `fun z => (P.map (algebraMap ℝ ℂ)).eval z`, while the probe's
  `EntireLP.toEntire` (probe `EntireLP.lean:78`) is `fun z => Polynomial.aeval z p` — equal
  functions (`Polynomial.aeval_def` + `Polynomial.eval_map`) but not the same text;
* `EntireLP.IsLaguerrePolya` here uses the realness clause `∀ x : ℝ, (f x).im = 0`, while the
  probe's `EntireLP.IsLaguerrePolya` (probe `EntireLP.lean:145-148`) uses the conjugation
  clause `∀ z : ℂ, f (starRingEnd ℂ z) = starRingEnd ℂ (f z)`.

`MathlibBridge.HasOnlyRealRoots` did NOT drift: this project's definition
(`Multiset.card P.roots = P.natDegree`) is byte-identical to the probe's
(probe `MathlibBridge.lean:185-186`, binder name `p` vs `P` only), so the probe's root
predicate is referred to directly by its own fully-qualified name
`MathlibBridge.HasOnlyRealRoots` — no `Probe.`-copy is needed for it.

This file therefore:

1. copies the probe's `toEntire`, `IsLaguerrePolya` VERBATIM (namespace-qualified as
   `Probe.toEntire`, `Probe.IsLaguerrePolya`, since the in-project names are taken), and
   states the seam's `HeatMajorized` (verbatim job33/job34 shape, which is also this
   project's shape) over the probe's `toEntire` as `Probe.HeatMajorized`;
2. proves the bridges `Probe.toEntire_eq` (the two `toEntire`s are equal),
   `Probe.heatMajorized_iff`, and `Probe.isLaguerrePolya_of_probe`
   (probe LP membership ⇒ package LP membership: at real `x` the conjugation clause gives
   `f x = conj (f x)`, hence `(f x).im = 0`; the approximation clause transfers along
   `toEntire_eq`, the root predicate being shared);
3. derives `Probe.exists_LP_approx_heatMajorized_order_le_one` — the main theorem with
   hypotheses and conclusion entirely in the probe's vocabulary, the conclusion being
   EXACTLY the job33/job34 seam conjunction over the probe's `toEntire`.  Nothing is
   weakened: `t` ranges over all of `0 ≤ t` and the growth hypothesis is unchanged.

The composition endpoint (`Probe.heat_preserves_LP_entire_order_le_one`) is NOT derivable
in this project: `heatFlow`, `heatOp` and job34's transfer lemma
(`heatFlow_tendsto_of_heatMajorized`) are not present here, and importing across projects
is out of scope.  The splice point for the consumer is job34's
`EntireLP.exists_heatOp_approx_tendsto`, whose `stage1` hypothesis is exactly the
conclusion of `Probe.exists_LP_approx_heatMajorized_order_le_one` below.
-/

open Polynomial Filter

namespace Probe

/-- PROBE-VERBATIM (probe `EntireLP.lean:78`): a real polynomial `p : ℝ[X]`, viewed as the
entire function `z ↦ p(z)` on `ℂ` via `Polynomial.aeval`.  The only change is the
namespace qualification (`Probe.toEntire` for the probe's `EntireLP.toEntire`, whose name
is taken in this project by the drifted `map`/`eval` form). -/
noncomputable def toEntire (p : ℝ[X]) : ℂ → ℂ := fun z => Polynomial.aeval z p

/-- PROBE-VERBATIM Laguerre–Pólya class (probe `EntireLP.lean:145-148`): conjugation
symmetry (real on `ℝ`) AND locally-uniform approximation by real polynomials that are
real-rooted in the sense of `MathlibBridge.HasOnlyRealRoots` — which is byte-identical
between this project and the probe (probe `MathlibBridge.lean:185-186`), so it is used
directly.  The only change is `Probe.toEntire` for the probe's `toEntire`. -/
def IsLaguerrePolya (f : ℂ → ℂ) : Prop :=
  (∀ z : ℂ, f (starRingEnd ℂ z) = starRingEnd ℂ (f z)) ∧
    ∃ P : ℕ → ℝ[X], (∀ n, MathlibBridge.HasOnlyRealRoots (P n)) ∧
      TendstoLocallyUniformly (fun n => toEntire (P n)) f atTop

/-- The seam's heat-majorization predicate (verbatim job33/job34 `EntireLP.HeatMajorized`,
which is also this project's shape), stated over the probe's `toEntire`. -/
def HeatMajorized (t : ℝ) (P : ℕ → ℝ[X]) : Prop :=
  ∀ r : ℝ, 0 < r → ∃ u : ℕ → ℝ, Summable u ∧
    ∀ n k, ∀ z : ℂ, ‖z‖ ≤ r →
      t ^ k / (k.factorial : ℝ) * ‖iteratedDeriv (2 * k) (toEntire (P n)) z‖ ≤ u k

/-! ### Bridges to the package vocabulary -/

/-- The probe's `toEntire` (`aeval`) and this project's `toEntire` (`map` then `eval`)
are the same function. -/
theorem toEntire_eq (p : ℝ[X]) : toEntire p = EntireLP.toEntire p := by
  funext z
  simp only [toEntire, EntireLP.toEntire, Polynomial.aeval_def, Polynomial.eval_map]

/-- The probe-vocabulary and package-vocabulary heat-majorization predicates agree. -/
theorem heatMajorized_iff (t : ℝ) (P : ℕ → ℝ[X]) :
    HeatMajorized t P ↔ EntireLP.HeatMajorized t P := by
  unfold HeatMajorized EntireLP.HeatMajorized
  simp only [toEntire_eq]

/-- Probe Laguerre–Pólya membership implies package Laguerre–Pólya membership (the
direction needed to feed the in-project main theorem).  The conjugation clause evaluated
at a real `x` gives `f x = conj (f x)`, hence `(f x).im = 0`; the approximation clause
transfers along `toEntire_eq`, the root predicate being shared verbatim. -/
theorem isLaguerrePolya_of_probe {f : ℂ → ℂ} (hf : IsLaguerrePolya f) :
    EntireLP.IsLaguerrePolya f := by
  obtain ⟨hconj, P, hroots, hconv⟩ := hf
  refine ⟨fun x => ?_, P, hroots, ?_⟩
  · have h := hconj (x : ℂ)
    rw [Complex.conj_ofReal] at h
    have him := congrArg Complex.im h
    simp only [Complex.conj_im] at him
    linarith
  · simpa only [toEntire_eq] using hconv

/-! ### The main theorem in the probe's vocabulary -/

/-- **Stage 1 for the restricted class, PROBE vocabulary.**  A function in the PROBE's
Laguerre–Pólya class (`Probe.IsLaguerrePolya`, conjugation clause included) satisfying the
order-≤1/finite-type growth bound is the locally uniform limit (in the probe's `toEntire`)
of real polynomials that are real-rooted in the probe's sense
(`MathlibBridge.HasOnlyRealRoots`, byte-identical here and in the probe) and heat-majorized
at every time `t ≥ 0`.  The conclusion is exactly the job33/job34 seam conjunction, i.e.
the `stage1` hypothesis of job34's `EntireLP.exists_heatOp_approx_tendsto`.  Derived from
`EntireLP.exists_LP_approx_heatMajorized_order_le_one`; nothing is weakened. -/
theorem exists_LP_approx_heatMajorized_order_le_one {f : ℂ → ℂ} {t : ℝ}
    (ht : 0 ≤ t) (hf : IsLaguerrePolya f)
    (hgrowth : ∃ A B : ℝ, ∀ z : ℂ, ‖f z‖ ≤ A * Real.exp (B * ‖z‖)) :
    ∃ P : ℕ → ℝ[X], (∀ n, MathlibBridge.HasOnlyRealRoots (P n)) ∧
      TendstoLocallyUniformly (fun n => toEntire (P n)) f atTop ∧
      HeatMajorized t P := by
  obtain ⟨P, hroots, hconv, hmaj⟩ :=
    EntireLP.exists_LP_approx_heatMajorized_order_le_one ht (isLaguerrePolya_of_probe hf)
      hgrowth
  exact ⟨P, hroots, by simpa only [toEntire_eq] using hconv, (heatMajorized_iff t P).mpr hmaj⟩

end Probe
