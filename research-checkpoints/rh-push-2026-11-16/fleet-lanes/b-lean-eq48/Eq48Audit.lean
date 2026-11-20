/-
Eq48Audit.lean  (2026-11-16, slug b-lean-eq48)

1. Theorem 3 skeleton: the logical assembly of the equivalence with RH, with the two analytic
   legs that are NOT formalized entering as explicit hypotheses.
2. Axiom audit (`#print axioms`) of every main theorem.  Expected output for each:
   `[propext, Classical.choice, Quot.sound]` (no `sorryAx`).
-/
import Mathlib
import Eq48Pick
import Eq48Hadamard
import Eq48Generic
import Eq48Controls
import Eq48Xi
import Eq48LemmaA

namespace Eq48

/-- **Theorem 3 skeleton.**  `RH` is an abstract proposition.  Hypotheses:
* `hProp5`    : PR #50 Prop. 5 (an off-axis zero gives a negative finite test) -- NOT formalized;
* `hHadamard` : under RH, `L` is the on-line Hadamard partial-sum limit -- NOT formalized;
* (H-AN), (H-LOW), (H-GROW) as in `Eq48Generic`.
Conclusion: the residual target (a) is equivalent to RH. -/
theorem residualTarget_iff_RH {L : ℝ → ℝ} {a : ℝ} (ha : 0 ≤ a) (RH : Prop)
    (hLa : AnalyticOnNhd ℝ L (Set.Ioi a)) {c : ℝ} (hc : 0 < c)
    (hlow : ∀ᶠ y in Filter.atTop, c ≤ L y)
    (hgrow : Filter.Tendsto (fun y => L y / y) Filter.atTop (nhds 0))
    (hProp5 : ¬ RH → ¬ FullClass L (Set.Ioi a))
    (hHadamard : RH → ∃ γ : ℕ → ℝ, HadamardOnLine L (Set.Ioi a) γ) :
    ResidualTarget L (Set.Ioi a) ↔ RH := by
  constructor
  · intro h
    by_contra hRH
    exact hProp5 hRH ((residualTarget_iff_fullClass_of_analytic ha hLa hc hlow hgrow).1 h)
  · intro hRH
    obtain ⟨γ, hγ⟩ := hHadamard hRH
    exact residualTarget_of_hadamardOnLine (fun _ hx => lt_of_le_of_lt ha hx) hγ

/-- **Theorem 3 skeleton for the Riemann xi function** (`RiemannHypothesis` is Mathlib's
statement).  Everything except the two named analytic legs is machine-checked:
* `hProp5`    : PR #50 Prop. 5 -- NOT formalized;
* `hHadamard` : Hadamard pairing of `xi'/xi` with all zeros on the line -- NOT formalized. -/
theorem xi_residualTarget_iff_RH
    (hProp5 : ¬ RiemannHypothesis → ¬ FullClass Lxi (Set.Ioi (1 / 2)))
    (hHadamard : RiemannHypothesis → ∃ γ : ℕ → ℝ, HadamardOnLine Lxi (Set.Ioi (1 / 2)) γ) :
    ResidualTarget Lxi (Set.Ioi (1 / 2)) ↔ RiemannHypothesis := by
  obtain ⟨c, hc, hl⟩ := xiLow
  exact residualTarget_iff_RH (by norm_num) RiemannHypothesis Lxi_analyticOnNhd hc hl xiGrow
    hProp5 hHadamard

/-- Theorem 2 (a) <=> (b) for xi in the nonempty-`T` reading of (a); the extra hypothesis is
Lemma A positivity `Lxi >= 0` on `(1/2, ∞)` (CLASSICAL via the Hadamard pairing; NOT formalized). -/
theorem xi_theorem2_pos (hLnn : ∀ x ∈ Set.Ioi (1 / 2 : ℝ), 0 ≤ Lxi x) :
    ResidualTargetPos Lxi (Set.Ioi (1 / 2)) ↔ FullClass Lxi (Set.Ioi (1 / 2)) := by
  constructor
  · intro h
    exact xi_theorem2.1 (residualTarget_of_pos (fun _ hx => lt_trans (by norm_num) hx) hLnn h)
  · intro h n t y _ ht hy hny hPD
    exact xi_theorem2.2 h n t y ht hy hny hPD

end Eq48

#print axioms Eq48.xiLow
#print axioms Eq48.xiGrow
#print axioms Eq48.xi_theorem2
#print axioms Eq48.xi_theorem2_pos
#print axioms Eq48.xi_residualTarget_iff_RH
#print axioms Eq48.pick_extend_posSemidef_iff
#print axioms Eq48.pick_extend_posDef_iff
#print axioms Eq48.det_pick_extend
#print axioms Eq48.residual_form_eq_defect
#print axioms Eq48.residualTarget_iff_fullClass
#print axioms Eq48.prefix_posDef_iff_strict_defects
#print axioms Eq48.bI_of_prefix_posSemidef
#print axioms Eq48.bI_of_prefix_posDef
#print axioms Eq48.bI_of_strict_defects
#print axioms Eq48.pair_identity
#print axioms Eq48.finite_zero_sum_identity
#print axioms Eq48.finite_zero_sum_on_line
#print axioms Eq48.fullClass_of_hadamardOnLine
#print axioms Eq48.complex_form_nonneg
#print axioms Eq48.genericNonsingular_of_analytic
#print axioms Eq48.residualTarget_iff_fullClass_of_analytic
#print axioms Eq48.M3_skeleton_counterexample
#print axioms Eq48.hypotheses_satisfiable
#print axioms Eq48.offLine_pair_not_residualTarget
#print axioms Eq48.literal_a'_gap
#print axioms Eq48.Lxi_analyticOnNhd
#print axioms Eq48.xi_residualTarget_iff_fullClass
#print axioms Eq48.xi_bI_of_prefix_posDef
#print axioms Eq48.residualTarget_iff_RH
