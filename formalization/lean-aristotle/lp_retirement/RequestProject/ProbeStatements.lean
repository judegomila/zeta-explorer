import RequestProject.Defs
import RequestProject.DerivLimits
import RequestProject.GaussianLP
import RequestProject.HeatDivergence
import RequestProject.Bridge
import RequestProject.EntireLP

/-!
# The refutations restated in the PROBE's exact vocabulary

The three quotable theorems of `RequestProject.EntireLP`, restated with the probe-verbatim
predicates `Probe.IsLaguerrePolya` and `Probe.HasOnlyRealRoots` throughout (both in the
hypothesis and in the `∃ P` clause).  Nothing is weakened: each is proved by the same
Gaussian counterexample, now exhibited in the PROBE's class
(`EntireLP.gaussianScaled_probe_isLaguerrePolya`), and the contradiction never uses the
root predicate of the `∃ P` clause (the majorant terms of the heat series at the origin
are ≥ 1, so the series cannot be summable — exactly as in the package-vocabulary proofs).

* `Probe.not_forall_exists_LP_approx_heatMajorized_of_pos`, `Probe.not_forall_exists_LP_approx_heatMajorized`:
  the base refutations;
* `Probe.not_exists_heatOp_approx_tendsto_full_LP`: the capstone — the negation of the
  honest (everywhere-summable) strengthening of the probe's sorried
  `EntireLP.exists_heatOp_approx_tendsto` (probe `EntireLP.lean:328-334`), stated in the
  probe's vocabulary.
-/

open Filter Polynomial EntireLP

namespace Probe

/-- Probe-vocabulary form of `EntireLP.not_exists_heatMajorized_gaussianScaled`: no
sequence of polynomial approximants (real-rooted in the PROBE's root-count sense) of a
scaled Gaussian with `1 ≤ t * c ^ 2` can be heat-majorized at time `t`.  The proof is the
package proof verbatim — it never uses the root predicate. -/
theorem not_exists_heatMajorized_gaussianScaled {c t : ℝ} (h : 1 ≤ t * c ^ 2) :
    ¬ ∃ P : ℕ → ℝ[X], (∀ n, Probe.HasOnlyRealRoots (P n)) ∧
      TendstoLocallyUniformly (fun n => EntireLP.toEntire (P n))
        (fun z : ℂ => EntireLP.gaussian ((c : ℂ) * z)) atTop ∧ EntireLP.HeatMajorized t P := by
  rintro ⟨P, -, hconv, hmaj⟩
  have hc2 : (0 : ℝ) ≤ c ^ 2 := sq_nonneg c
  have ht : 0 < t := by nlinarith
  obtain ⟨u, hu, hbound⟩ := hmaj 1 one_pos
  -- pass to the limit in the majorization at the origin
  have hlim : ∀ k : ℕ,
      t ^ k / (k.factorial : ℝ) *
        ‖iteratedDeriv (2 * k) (fun z : ℂ => gaussian ((c : ℂ) * z)) 0‖ ≤ u k := by
    intro k
    have htends := tendsto_iteratedDeriv_at (F := fun n => toEntire (P n))
      (fun n => differentiable_toEntire (P n)) hconv (2 * k) 0
    have hnorm : Tendsto (fun n => t ^ k / (k.factorial : ℝ) *
        ‖iteratedDeriv (2 * k) (toEntire (P n)) 0‖) atTop
        (nhds (t ^ k / (k.factorial : ℝ) *
          ‖iteratedDeriv (2 * k) (fun z : ℂ => gaussian ((c : ℂ) * z)) 0‖)) :=
      (htends.norm).const_mul _
    refine le_of_tendsto hnorm (Eventually.of_forall fun n => ?_)
    exact hbound n k 0 (by simp)
  -- hence the heat series of the Gaussian converges at the origin, a contradiction
  refine not_summable_heatFlow_term_gaussianScaled h ?_
  refine Summable.of_norm_bounded hu fun k => ?_
  rw [norm_smul, Real.norm_eq_abs, abs_div, abs_pow, abs_neg, abs_of_pos ht,
    abs_of_pos (by exact_mod_cast Nat.factorial_pos k : (0:ℝ) < (k.factorial : ℝ))]
  exact hlim k

/-- **Base refutation (positive time), PROBE vocabulary.** For every `t > 0` it is false
that every function in the PROBE's Laguerre–Pólya class admits a heat-majorized sequence
of polynomial approximants that are real-rooted in the PROBE's root-count sense. -/
theorem not_forall_exists_LP_approx_heatMajorized_of_pos {t : ℝ} (ht : 0 < t) :
    ¬ ∀ f : ℂ → ℂ, Probe.IsLaguerrePolya f →
      ∃ P : ℕ → ℝ[X], (∀ n, Probe.HasOnlyRealRoots (P n)) ∧
        TendstoLocallyUniformly (fun n => EntireLP.toEntire (P n)) f atTop ∧
        EntireLP.HeatMajorized t P := by
  intro H
  have hc : 1 ≤ t * (Real.sqrt (1 / t)) ^ 2 := by
    rw [Real.sq_sqrt (by positivity)]
    field_simp
    norm_num
  exact Probe.not_exists_heatMajorized_gaussianScaled hc
    (H _ (gaussianScaled_probe_isLaguerrePolya (Real.sqrt (1 / t))))

/-- **Base refutation, PROBE vocabulary.** It is false that every function in the PROBE's
Laguerre–Pólya class admits, at every time `t ≥ 0`, a heat-majorized sequence of
polynomial approximants that are real-rooted in the PROBE's root-count sense. -/
theorem not_forall_exists_LP_approx_heatMajorized :
    ¬ ∀ (f : ℂ → ℂ) (t : ℝ), 0 ≤ t → Probe.IsLaguerrePolya f →
      ∃ P : ℕ → ℝ[X], (∀ n, Probe.HasOnlyRealRoots (P n)) ∧
        TendstoLocallyUniformly (fun n => EntireLP.toEntire (P n)) f atTop ∧
        EntireLP.HeatMajorized t P := by
  intro H
  exact Probe.not_forall_exists_LP_approx_heatMajorized_of_pos one_pos
    fun f hf => H f 1 zero_le_one hf

/-- **Capstone, PROBE vocabulary.** The honest (non-junk) reading of the probe's sorried
`EntireLP.exists_heatOp_approx_tendsto` — with the defining heat series required to
converge at every point, and with the probe's own predicates `Probe.IsLaguerrePolya` and
`Probe.HasOnlyRealRoots` — is false: for `t = 1` the Gaussian lies in the PROBE's
Laguerre–Pólya class, yet its heat series diverges already at the origin. -/
theorem not_exists_heatOp_approx_tendsto_full_LP :
    ¬ ∀ (f : ℂ → ℂ) (t : ℝ), 0 ≤ t → Probe.IsLaguerrePolya f →
      (∀ z : ℂ, Summable (fun k : ℕ =>
          ((-t) ^ k / (k.factorial : ℝ)) • iteratedDeriv (2 * k) f z)) ∧
      ∃ P : ℕ → ℝ[X], (∀ n, Probe.HasOnlyRealRoots (P n)) ∧
        TendstoLocallyUniformly (fun n => EntireLP.toEntire (P n)) f atTop ∧
        TendstoLocallyUniformly
          (fun n => EntireLP.toEntire (MathlibBridge.heatOp t (P n)))
          (EntireLP.heatFlow t f) atTop := by
  intro H
  have h1 : (1 : ℝ) ≤ 1 * (1 : ℝ) ^ 2 := by norm_num
  obtain ⟨hsummable, -⟩ :=
    H (fun z : ℂ => gaussian (((1 : ℝ) : ℂ) * z)) 1 zero_le_one
      (gaussianScaled_probe_isLaguerrePolya 1)
  exact not_summable_heatFlow_term_gaussianScaled h1 (hsummable 0)

end Probe
