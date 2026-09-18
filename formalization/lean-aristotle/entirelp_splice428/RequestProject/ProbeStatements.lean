import RequestProject.HeatTransfer
import RequestProject.Stage1LP

/-!
# The stage-1 theorem restated in the BASE (job34 / probe) vocabulary

The base package (`RequestProject.HeatTransfer`, imported from job34) carries the
probe-faithful definitions:

* `EntireLP.toEntire p = fun z => Polynomial.aeval z p`  (probe `EntireLP.lean:78`);
* `EntireLP.IsLaguerrePolya` with the CONJUGATION clause
  `∀ z : ℂ, f (starRingEnd ℂ z) = starRingEnd ℂ (f z)`  (probe `EntireLP.lean:145-148`);
* `MathlibBridge.HasOnlyRealRoots p : Multiset.card p.roots = p.natDegree`
  (probe `MathlibBridge.lean:185-186`, byte-identical);
* `EntireLP.HeatMajorized` (the job33/job34 seam shape, over the probe's `toEntire`).

The stage-1 construction (job40, imported as `RequestProject.Stage1LP` after the mechanical
namespace renames `EntireLP → Stage1LP`, `MathlibBridge → Stage1MB`) proves
`Stage1LP.exists_LP_approx_heatMajorized_order_le_one` over its own drifted vocabulary:

* `Stage1LP.toEntire p = fun z => (p.map (algebraMap ℝ ℂ)).eval z` — equal function,
  different text;
* `Stage1LP.IsLaguerrePolya` with the realness clause `∀ x : ℝ, (f x).im = 0`;
* `Stage1MB.HasOnlyRealRoots` — definitionally identical to `MathlibBridge.HasOnlyRealRoots`;
* `Stage1LP.HeatMajorized` — the same shape, over `Stage1LP.toEntire`.

This file proves the four bridges and derives
`Probe.exists_LP_approx_heatMajorized_order_le_one`, the stage-1 theorem with hypotheses and
conclusion ENTIRELY in the base vocabulary — exactly the `stage1` hypothesis of the base's
`EntireLP.exists_heatOp_approx_tendsto`, and the input to the splice
(`RequestProject.Splice`).  Nothing is weakened: `t` ranges over all of `0 ≤ t` and the
growth hypothesis is unchanged.
-/

open Polynomial Filter

namespace Probe

/-! ### Bridges between the base and stage-1 vocabularies -/

/-- The two root predicates are definitionally identical
(`Multiset.card p.roots = p.natDegree` on both sides). -/
theorem hasOnlyRealRoots_iff (p : ℝ[X]) :
    Stage1MB.HasOnlyRealRoots p ↔ MathlibBridge.HasOnlyRealRoots p := Iff.rfl

/-- The base's `toEntire` (`aeval`) and stage-1's `toEntire` (`map` then `eval`) are the
same function. -/
theorem toEntire_eq (p : ℝ[X]) : EntireLP.toEntire p = Stage1LP.toEntire p := by
  funext z
  simp only [EntireLP.toEntire, Stage1LP.toEntire, Polynomial.aeval_def, Polynomial.eval_map]

/-- The base and stage-1 heat-majorization predicates agree. -/
theorem heatMajorized_iff (t : ℝ) (P : ℕ → ℝ[X]) :
    EntireLP.HeatMajorized t P ↔ Stage1LP.HeatMajorized t P := by
  unfold EntireLP.HeatMajorized Stage1LP.HeatMajorized
  simp only [toEntire_eq]

/-- Base Laguerre–Pólya membership (conjugation clause) implies stage-1 membership
(realness clause): the conjugation clause evaluated at a real `x` gives
`f x = conj (f x)`, hence `(f x).im = 0`; the approximation clause transfers along
`toEntire_eq`, the root predicate being definitionally shared. -/
theorem stage1_isLaguerrePolya_of_base {f : ℂ → ℂ} (hf : EntireLP.IsLaguerrePolya f) :
    Stage1LP.IsLaguerrePolya f := by
  obtain ⟨hconj, P, hroots, hconv⟩ := hf
  refine ⟨fun x => ?_, P, fun n => (hasOnlyRealRoots_iff (P n)).mpr (hroots n), ?_⟩
  · have h := hconj (x : ℂ)
    rw [Complex.conj_ofReal] at h
    have him := congrArg Complex.im h
    simp only [Complex.conj_im] at him
    linarith
  · simpa only [toEntire_eq] using hconv

/-! ### The stage-1 theorem in the base vocabulary -/

/-- **Stage 1 for the restricted class, BASE vocabulary.**  A function in the base's
Laguerre–Pólya class (`EntireLP.IsLaguerrePolya`, conjugation clause) satisfying the
order-≤1/finite-type growth bound is the locally uniform limit (in the base's `toEntire`)
of real polynomials that are real-rooted in the base's sense
(`MathlibBridge.HasOnlyRealRoots`) and heat-majorized (`EntireLP.HeatMajorized`) at every
time `t ≥ 0`.  The conclusion is exactly the `stage1` hypothesis of the base's
`EntireLP.exists_heatOp_approx_tendsto`.  Derived from
`Stage1LP.exists_LP_approx_heatMajorized_order_le_one`; nothing is weakened. -/
theorem exists_LP_approx_heatMajorized_order_le_one {f : ℂ → ℂ} {t : ℝ}
    (ht : 0 ≤ t) (hf : EntireLP.IsLaguerrePolya f)
    (hgrowth : ∃ A B : ℝ, ∀ z : ℂ, ‖f z‖ ≤ A * Real.exp (B * ‖z‖)) :
    ∃ P : ℕ → ℝ[X], (∀ n, MathlibBridge.HasOnlyRealRoots (P n)) ∧
      TendstoLocallyUniformly (fun n => EntireLP.toEntire (P n)) f atTop ∧
      EntireLP.HeatMajorized t P := by
  obtain ⟨P, hroots, hconv, hmaj⟩ :=
    Stage1LP.exists_LP_approx_heatMajorized_order_le_one ht
      (stage1_isLaguerrePolya_of_base hf) hgrowth
  exact ⟨P, fun n => (hasOnlyRealRoots_iff (P n)).mp (hroots n),
    by simpa only [toEntire_eq] using hconv, (heatMajorized_iff t P).mpr hmaj⟩

end Probe
