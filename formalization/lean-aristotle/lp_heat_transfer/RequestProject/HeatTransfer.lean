import Mathlib

open scoped BigOperators
open scoped Nat
open scoped Classical
open scoped Polynomial

open Filter Topology

set_option maxHeartbeats 1000000

namespace MathlibBridge

/-- A real polynomial has only real roots when the number of its real roots (with multiplicity)
equals its degree. -/
def HasOnlyRealRoots (p : ℝ[X]) : Prop := Multiset.card p.roots = p.natDegree

/-- Partial sum of the (backward) heat semigroup acting on polynomials. -/
noncomputable def heatPartial (N : ℕ) (t : ℝ) (p : ℝ[X]) : ℝ[X] :=
  ∑ k ∈ Finset.range N,
    ((-t) ^ k / (Nat.factorial k : ℝ)) • Polynomial.derivative^[2 * k] p

/-- The heat operator on polynomials: a finite sum, since high derivatives vanish. -/
noncomputable def heatOp (t : ℝ) (p : ℝ[X]) : ℝ[X] := heatPartial (p.natDegree + 1) t p

end MathlibBridge

namespace EntireLP

/-- A real polynomial viewed as an entire function on `ℂ`. -/
noncomputable def toEntire (p : ℝ[X]) : ℂ → ℂ := fun z => Polynomial.aeval z p

/-- The Laguerre–Pólya class: real entire functions that are locally uniform limits of real
polynomials with only real roots. -/
def IsLaguerrePolya (f : ℂ → ℂ) : Prop :=
  (∀ z : ℂ, f (starRingEnd ℂ z) = starRingEnd ℂ (f z)) ∧
    ∃ P : ℕ → ℝ[X], (∀ n, MathlibBridge.HasOnlyRealRoots (P n)) ∧
      TendstoLocallyUniformly (fun n => toEntire (P n)) f atTop

/-- The (backward) heat flow applied to an entire function, defined as a raw `tsum`
(so it takes the junk value `0` where the series fails to converge). -/
noncomputable def heatFlow (t : ℝ) (f : ℂ → ℂ) : ℂ → ℂ :=
  fun z => ∑' k : ℕ, ((-t) ^ k / (k.factorial : ℝ)) • iteratedDeriv (2 * k) f z

/-- A summable heat majorant for the family `P`, uniform in `n` on every closed ball. -/
def HeatMajorized (t : ℝ) (P : ℕ → ℝ[X]) : Prop :=
  ∀ r : ℝ, 0 < r → ∃ u : ℕ → ℝ, Summable u ∧
    ∀ n k, ∀ z : ℂ, ‖z‖ ≤ r →
      t ^ k / (k.factorial : ℝ) * ‖iteratedDeriv (2 * k) (toEntire (P n)) z‖ ≤ u k

/-! ### Basic facts about `toEntire` -/

theorem differentiable_toEntire (p : ℝ[X]) : Differentiable ℂ (toEntire p) :=
  Polynomial.differentiable_aeval p

theorem iteratedDeriv_toEntire (m : ℕ) (p : ℝ[X]) :
    iteratedDeriv m (toEntire p) = toEntire (Polynomial.derivative^[m] p) := by
  induction m with
  | zero => simp
  | succ m ih =>
      rw [iteratedDeriv_succ, ih]
      funext z
      simp only [toEntire, Function.iterate_succ_apply']
      exact Polynomial.deriv_aeval _

theorem differentiable_iteratedDeriv_toEntire (m : ℕ) (p : ℝ[X]) :
    Differentiable ℂ (iteratedDeriv m (toEntire p)) := by
  rw [iteratedDeriv_toEntire]
  exact differentiable_toEntire _

/-- The heat flow of (the entire function attached to) a polynomial is the polynomial produced
by `heatOp`: the defining series is in fact a finite sum. -/
theorem heatFlow_poly (t : ℝ) (p : ℝ[X]) :
    heatFlow t (toEntire p) = toEntire (MathlibBridge.heatOp t p) := by
  funext z
  simp only [heatFlow, iteratedDeriv_toEntire, toEntire, MathlibBridge.heatOp,
    MathlibBridge.heatPartial]
  rw [tsum_eq_sum (s := Finset.range (p.natDegree + 1)) ?_]
  · simp [map_sum, map_smul]
  · intro k hk
    simp only [Finset.mem_range, not_lt] at hk
    have hz : Polynomial.derivative^[2 * k] p = 0 :=
      Polynomial.iterate_derivative_eq_zero (by omega)
    simp [hz]

/-! ### Weierstrass: locally uniform convergence of all derivatives -/

theorem tendstoLocallyUniformly_iteratedDeriv {P : ℕ → ℝ[X]} {f : ℂ → ℂ}
    (h : TendstoLocallyUniformly (fun n => toEntire (P n)) f atTop) (m : ℕ) :
    TendstoLocallyUniformly (fun n => iteratedDeriv m (toEntire (P n)))
      (iteratedDeriv m f) atTop := by
  induction m with
  | zero => simpa using h
  | succ m ih =>
      rw [← tendstoLocallyUniformlyOn_univ] at ih ⊢
      have hd := ih.deriv
        (Eventually.of_forall fun n => (differentiable_iteratedDeriv_toEntire m (P n)).differentiableOn)
        isOpen_univ
      rw [iteratedDeriv_succ]
      simpa [Function.comp_def, iteratedDeriv_succ] using hd

/-! ### A dominated-convergence lemma for uniform convergence of series -/

theorem tendstoUniformlyOn_const_smul {S : Set ℂ} {F : ℕ → ℂ → ℂ} {g : ℂ → ℂ}
    (h : TendstoUniformlyOn F g atTop S) (c : ℝ) :
    TendstoUniformlyOn (fun n z => c • F n z) (fun z => c • g z) atTop S := by
  rw [Metric.tendstoUniformlyOn_iff] at h ⊢
  intro ε hε
  have hpos : 0 < ε / (|c| + 1) := by positivity
  filter_upwards [h (ε / (|c| + 1)) hpos] with n hn z hz
  have hd := hn z hz
  have hdist : dist (c • g z) (c • F n z) = |c| * dist (g z) (F n z) := by
    rw [dist_eq_norm, dist_eq_norm, ← smul_sub, norm_smul, Real.norm_eq_abs]
  rw [hdist]
  calc |c| * dist (g z) (F n z) ≤ (|c| + 1) * dist (g z) (F n z) :=
        mul_le_mul_of_nonneg_right (by linarith) dist_nonneg
    _ < (|c| + 1) * (ε / (|c| + 1)) := mul_lt_mul_of_pos_left hd (by positivity)
    _ = ε := by field_simp

/-- Uniform convergence of series with a uniform summable majorant: if each term converges
uniformly on `S` and all terms are dominated by a fixed summable sequence, then the sums
converge uniformly on `S` (in particular, the limit series converges). -/
theorem tendstoUniformlyOn_tsum_of_majorant {S : Set ℂ} {G : ℕ → ℕ → ℂ → ℂ} {g : ℕ → ℂ → ℂ}
    {u : ℕ → ℝ} (hu : Summable u)
    (hb : ∀ n k, ∀ z ∈ S, ‖G n k z‖ ≤ u k)
    (hconv : ∀ k, TendstoUniformlyOn (fun n => G n k) (g k) atTop S) :
    TendstoUniformlyOn (fun n z => ∑' k, G n k z) (fun z => ∑' k, g k z) atTop S := by
  have hbg : ∀ k, ∀ z ∈ S, ‖g k z‖ ≤ u k := fun k z hz =>
    le_of_tendsto ((hconv k).tendsto_at hz).norm (Eventually.of_forall fun n => hb n k z hz)
  have hsG : ∀ n, ∀ z ∈ S, Summable (fun k => G n k z) := fun n z hz =>
    Summable.of_norm_bounded hu (fun k => hb n k z hz)
  have hsg : ∀ z ∈ S, Summable (fun k => g k z) := fun z hz =>
    Summable.of_norm_bounded hu (fun k => hbg k z hz)
  rw [Metric.tendstoUniformlyOn_iff]
  intro ε hε
  obtain ⟨K, hK⟩ := ((tendsto_sum_nat_add u).eventually
    (gt_mem_nhds (show (0:ℝ) < ε / 8 by positivity))).exists
  have hδpos : 0 < ε / (4 * ((K : ℝ) + 1)) := by positivity
  have hfin : ∀ᶠ n in atTop, ∀ k ∈ Finset.range K, ∀ z ∈ S,
      dist (g k z) (G n k z) < ε / (4 * ((K : ℝ) + 1)) := by
    rw [eventually_all_finset]
    exact fun k _ => (Metric.tendstoUniformlyOn_iff.mp (hconv k)) _ hδpos
  filter_upwards [hfin] with n hn z hz
  set d : ℕ → ℂ := fun k => g k z - G n k z with hdd
  have hdsum : Summable d := (hsg z hz).sub (hsG n z hz)
  have hdb : ∀ k, ‖d k‖ ≤ 2 * u k := by
    intro k
    calc ‖d k‖ ≤ ‖g k z‖ + ‖G n k z‖ := norm_sub_le _ _
      _ ≤ u k + u k := add_le_add (hbg k z hz) (hb n k z hz)
      _ = 2 * u k := by ring
  have husum : Summable (fun i => u (i + K)) := (summable_nat_add_iff K).mpr hu
  have hdtail : Summable (fun i => ‖d (i + K)‖) :=
    Summable.of_nonneg_of_le (fun i => norm_nonneg _) (fun i => hdb (i + K)) (husum.mul_left 2)
  have hsplit : ∑' k, d k = (∑ k ∈ Finset.range K, d k) + ∑' i, d (i + K) :=
    (Summable.sum_add_tsum_nat_add K hdsum).symm
  have key : dist (∑' k, g k z) (∑' k, G n k z) = ‖∑' k, d k‖ := by
    rw [dist_eq_norm, (hsg z hz).tsum_sub (hsG n z hz)]
  rw [key, hsplit]
  have h1 : ‖∑ k ∈ Finset.range K, d k‖ < ε / 4 := by
    have hA : ‖∑ k ∈ Finset.range K, d k‖ ≤ ∑ k ∈ Finset.range K, ‖d k‖ := norm_sum_le _ _
    have h2 : ∑ k ∈ Finset.range K, ‖d k‖ ≤ (K : ℝ) * (ε / (4 * ((K : ℝ) + 1))) := by
      calc ∑ k ∈ Finset.range K, ‖d k‖
          ≤ ∑ _k ∈ Finset.range K, ε / (4 * ((K : ℝ) + 1)) := by
            refine Finset.sum_le_sum fun k hk => ?_
            have hkz := hn k hk z hz
            rw [dist_eq_norm] at hkz
            exact le_of_lt hkz
        _ = (K : ℝ) * (ε / (4 * ((K : ℝ) + 1))) := by simp
    have h3 : (K : ℝ) * (ε / (4 * ((K : ℝ) + 1))) < ε / 4 := by
      have hK0 : (0:ℝ) ≤ (K:ℝ) := Nat.cast_nonneg K
      rw [mul_div_assoc', div_lt_div_iff₀ (by positivity) (by norm_num : (0:ℝ) < 4)]
      nlinarith
    linarith
  have h4 : ‖∑' i, d (i + K)‖ ≤ 2 * ∑' i, u (i + K) := by
    calc ‖∑' i, d (i + K)‖ ≤ ∑' i, ‖d (i + K)‖ := norm_tsum_le_tsum_norm hdtail
      _ ≤ ∑' i, 2 * u (i + K) := hdtail.tsum_le_tsum (fun i => hdb (i + K)) (husum.mul_left 2)
      _ = 2 * ∑' i, u (i + K) := tsum_mul_left
  have h5 : ∑' i, u (i + K) < ε / 8 := hK
  calc ‖(∑ k ∈ Finset.range K, d k) + ∑' i, d (i + K)‖
      ≤ ‖∑ k ∈ Finset.range K, d k‖ + ‖∑' i, d (i + K)‖ := norm_add_le _ _
    _ < ε := by linarith

/-! ### The transfer -/

/-- **Heat evolution is continuous under locally uniform limits, given a summable heat
majorant.** -/
theorem heatFlow_tendsto_of_heatMajorized {P : ℕ → ℝ[X]} {f : ℂ → ℂ} {t : ℝ} (ht : 0 ≤ t)
    (hconv : TendstoLocallyUniformly (fun n => toEntire (P n)) f atTop)
    (hmaj : HeatMajorized t P) :
    TendstoLocallyUniformly (fun n => heatFlow t (toEntire (P n))) (heatFlow t f) atTop := by
  rw [tendstoLocallyUniformly_iff_forall_isCompact]
  intro K hK
  obtain ⟨r, hr⟩ := hK.isBounded.subset_closedBall (0 : ℂ)
  have hR0 : 0 < max r 1 := lt_of_lt_of_le one_pos (le_max_right _ _)
  have hKR : K ⊆ Metric.closedBall 0 (max r 1) :=
    hr.trans (Metric.closedBall_subset_closedBall (le_max_left _ _))
  refine TendstoUniformlyOn.mono ?_ hKR
  obtain ⟨u, husum, hu⟩ := hmaj (max r 1) hR0
  show TendstoUniformlyOn
    (fun n z => ∑' k : ℕ,
      ((-t) ^ k / (k.factorial : ℝ)) • iteratedDeriv (2 * k) (toEntire (P n)) z)
    (fun z => ∑' k : ℕ, ((-t) ^ k / (k.factorial : ℝ)) • iteratedDeriv (2 * k) f z)
    atTop (Metric.closedBall 0 (max r 1))
  refine tendstoUniformlyOn_tsum_of_majorant husum ?_ ?_
  · intro n k z hz
    rw [Metric.mem_closedBall, dist_zero_right] at hz
    rw [norm_smul, Real.norm_eq_abs]
    have habs : |(-t) ^ k / (k.factorial : ℝ)| = t ^ k / (k.factorial : ℝ) := by
      rw [abs_div, abs_pow, abs_neg, abs_of_nonneg ht, Nat.abs_cast]
    rw [habs]
    exact hu n k z hz
  · intro k
    have hlu := (tendstoLocallyUniformly_iff_forall_isCompact.mp
      (tendstoLocallyUniformly_iteratedDeriv hconv (2 * k)))
      (Metric.closedBall 0 (max r 1)) (isCompact_closedBall 0 (max r 1))
    exact tendstoUniformlyOn_const_smul hlu _

/-- **Stage 2 of the heat-flow transfer.** Assuming the stage-1 statement (`stage1`), every
Laguerre–Pólya function `f` is a locally uniform limit of real-rooted polynomials `P n` whose
heat evolutions `heatOp t (P n)` converge locally uniformly to `heatFlow t f`. -/
theorem exists_heatOp_approx_tendsto
    (stage1 : ∀ {f : ℂ → ℂ} {t : ℝ}, 0 ≤ t → IsLaguerrePolya f →
      ∃ P : ℕ → ℝ[X], (∀ n, MathlibBridge.HasOnlyRealRoots (P n)) ∧
        TendstoLocallyUniformly (fun n => toEntire (P n)) f atTop ∧
        HeatMajorized t P)
    {f : ℂ → ℂ} {t : ℝ} (ht : 0 ≤ t)
    (hf : IsLaguerrePolya f) :
    ∃ P : ℕ → ℝ[X], (∀ n, MathlibBridge.HasOnlyRealRoots (P n)) ∧
      TendstoLocallyUniformly (fun n => toEntire (P n)) f atTop ∧
      TendstoLocallyUniformly
        (fun n => toEntire (MathlibBridge.heatOp t (P n))) (heatFlow t f) atTop := by
  obtain ⟨P, hroots, hconv, hmaj⟩ := stage1 ht hf
  refine ⟨P, hroots, hconv, ?_⟩
  have h := heatFlow_tendsto_of_heatMajorized ht hconv hmaj
  simpa only [heatFlow_poly] using h

end EntireLP
