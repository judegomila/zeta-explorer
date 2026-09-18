import RequestProject.Defs
import RequestProject.DerivLimits
import RequestProject.GaussianDeriv
import RequestProject.GaussianLP
import RequestProject.HeatDivergence

/-!
# Refutation package for the full Laguerre–Pólya heat-flow approximation statement

This file contains

* the two base refutations: no Laguerre–Pólya function admits, for every `t`, a
  heat-majorized sequence of real-rooted polynomial approximants;
* the capstone: the honest (non-junk) reading of `exists_heatOp_approx_tendsto`,
  in which the defining heat series is required to converge everywhere, is false.

The counterexample in every case is a scaled Gaussian `z ↦ exp (-(c z)²)` with
`1 ≤ t * c ^ 2`, whose heat series diverges already at the origin.
-/

open Filter Polynomial

namespace EntireLP

/-- No sequence of polynomial approximants of a scaled Gaussian with `1 ≤ t * c ^ 2` can be
heat-majorized at time `t`. -/
theorem not_exists_heatMajorized_gaussianScaled {c t : ℝ} (h : 1 ≤ t * c ^ 2) :
    ¬ ∃ P : ℕ → ℝ[X], (∀ n, MathlibBridge.HasOnlyRealRoots (P n)) ∧
      TendstoLocallyUniformly (fun n => toEntire (P n))
        (fun z : ℂ => gaussian ((c : ℂ) * z)) atTop ∧ HeatMajorized t P := by
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

/-- **Base refutation (positive time).** For every `t > 0` it is false that every
Laguerre–Pólya function admits a heat-majorized sequence of real-rooted polynomial
approximants. -/
theorem not_forall_exists_LP_approx_heatMajorized_of_pos {t : ℝ} (ht : 0 < t) :
    ¬ ∀ f : ℂ → ℂ, IsLaguerrePolya f →
      ∃ P : ℕ → ℝ[X], (∀ n, MathlibBridge.HasOnlyRealRoots (P n)) ∧
        TendstoLocallyUniformly (fun n => toEntire (P n)) f atTop ∧ HeatMajorized t P := by
  intro H
  have hc : 1 ≤ t * (Real.sqrt (1 / t)) ^ 2 := by
    rw [Real.sq_sqrt (by positivity)]
    field_simp
    norm_num
  exact not_exists_heatMajorized_gaussianScaled hc
    (H _ (gaussianScaled_isLaguerrePolya (Real.sqrt (1 / t))))

/-- **Base refutation.** It is false that every Laguerre–Pólya function admits, at every
time `t ≥ 0`, a heat-majorized sequence of real-rooted polynomial approximants. -/
theorem not_forall_exists_LP_approx_heatMajorized :
    ¬ ∀ (f : ℂ → ℂ) (t : ℝ), 0 ≤ t → IsLaguerrePolya f →
      ∃ P : ℕ → ℝ[X], (∀ n, MathlibBridge.HasOnlyRealRoots (P n)) ∧
        TendstoLocallyUniformly (fun n => toEntire (P n)) f atTop ∧ HeatMajorized t P := by
  intro H
  exact not_forall_exists_LP_approx_heatMajorized_of_pos one_pos
    fun f hf => H f 1 zero_le_one hf

/-- **Capstone.** The honest (non-junk) reading of `exists_heatOp_approx_tendsto`, which
requires the defining heat series to converge at every point, is false: for `t = 1` the
Gaussian is a Laguerre–Pólya function whose heat series already diverges at the origin. -/
theorem not_exists_heatOp_approx_tendsto_full_LP :
    ¬ ∀ (f : ℂ → ℂ) (t : ℝ), 0 ≤ t → IsLaguerrePolya f →
      (∀ z : ℂ, Summable (fun k : ℕ =>
          ((-t) ^ k / (k.factorial : ℝ)) • iteratedDeriv (2 * k) f z)) ∧
      ∃ P : ℕ → ℝ[X], (∀ n, MathlibBridge.HasOnlyRealRoots (P n)) ∧
        TendstoLocallyUniformly (fun n => toEntire (P n)) f atTop ∧
        TendstoLocallyUniformly
          (fun n => toEntire (MathlibBridge.heatOp t (P n))) (heatFlow t f) atTop := by
  intro H
  have h1 : (1 : ℝ) ≤ 1 * (1 : ℝ) ^ 2 := by norm_num
  obtain ⟨hsummable, -⟩ :=
    H (fun z : ℂ => gaussian (((1 : ℝ) : ℂ) * z)) 1 zero_le_one
      (gaussianScaled_isLaguerrePolya 1)
  exact not_summable_heatFlow_term_gaussianScaled h1 (hsummable 0)

end EntireLP

/-
The literal sorried statement being retired reads (junk semantics, NOT decided here):

theorem exists_heatOp_approx_tendsto :
    ∀ (f : ℂ → ℂ) (t : ℝ), 0 ≤ t → IsLaguerrePolya f →
      ∃ P : ℕ → ℝ[X], (∀ n, MathlibBridge.HasOnlyRealRoots (P n)) ∧
        TendstoLocallyUniformly (fun n => toEntire (P n)) f atTop ∧
        TendstoLocallyUniformly
          (fun n => toEntire (MathlibBridge.heatOp t (P n))) (heatFlow t f) atTop

FLAGGED DELTA (from the source request).  The literal sorried statement
`exists_heatOp_approx_tendsto` omits the `Summable` conjunct, so that `heatFlow t f` is a
raw `tsum` carrying the junk value `0` wherever the series diverges.  Refuting `X ∧ Y`
through `Y` alone says nothing about `X`, and this package does NOT decide that literal
junk-semantics statement; whether some exotic real-rooted sequence has heat images
converging locally uniformly to the junk-patched function is left open here.

What is established above, kernel-verified and sorry-free, is:

* `not_forall_exists_LP_approx_heatMajorized` and
  `not_forall_exists_LP_approx_heatMajorized_of_pos`: every heat-majorized route fails,
  for every `t > 0`;
* `not_exists_heatOp_approx_tendsto_full_LP`: the intended (non-junk) reading, in which
  the heat series is required to converge everywhere, is false.
-/
