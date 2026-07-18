/-
  EntireOrder — the ORDER of an entire function `f : ℂ → ℂ`.

  This is *brick 1* of the months-scale entire-function-analysis foundation toward a
  formalized `Λ ≥ 0` (de Bruijn–Newman).  The genuine target is a mathlib-grade theory
  of the **Hadamard factorization** and the **Laguerre–Pólya class** on `ℂ → ℂ`, which
  mathlib v4.22.0 lacks.  A prerequisite for BOTH is the *order of growth* of an entire
  function.  This file supplies exactly that one prerequisite.

  ## What mathlib v4.22.0 HAS toward entire-function order/growth (survey)

  * `Real.posLog` (notation `log⁺`, `Mathlib/Analysis/SpecialFunctions/Log/PosLog.lean`):
    `log⁺ r = max 0 (log r)`, with `posLog_mul`, `posLog_add`, `posLog_prod`,
    `posLog_sum`, `monotoneOn_posLog` (on `Set.Ici 0`), `posLog_eq_log` (for `1 ≤ |x|`),
    `posLog_nonneg`.  These are the *exact* building blocks for order-of-growth.
  * `Real.isLittleO_log_id_atTop : log =o[atTop] id` and `tendsto_log_atTop`
    (`Mathlib/Analysis/SpecialFunctions/Log/Basic.lean`).  Composing these gives the
    crux limit `log (log r) / log r → 0`, i.e. `iterated log is o(log)` — the analytic
    heart of "polynomials have order 0".
  * `Polynomial.isEquivalent_atTop_lead`, `Polynomial.isBigO_of_degree_le`,
    `Polynomial.abs_tendsto_atTop` (`Mathlib/Analysis/Polynomial/Basic.lean`): polynomial
    growth asymptotics — but only for `𝕜 → 𝕜` eval along a *real/normed-field* variable,
    NOT the complex max-modulus `sup_{‖z‖=r} ‖p z‖` we need.  We re-derive the modulus
    bound directly.
  * `Complex.eqOn_of_isPreconnected_of_isMaxOn_norm` (`Mathlib/Analysis/Complex/AbsMax.lean`):
    the maximum-modulus principle.  `NormedSpace.sphere_nonempty : (sphere x r).Nonempty ↔ 0 ≤ r`.
  * A whole Nevanlinna-theory folder `Mathlib/Analysis/Complex/ValueDistribution/`
    (`characteristic`, `proximity`, `CountingFunction`, `FirstMainTheorem`): the order of
    an entire function can *alternatively* be defined as `limsup T(r)/log r`.  We use the
    classical max-modulus definition here (self-contained, no meromorphic hypotheses).
  * `Filter.limsup` in a `CompleteLinearOrder` (we use `EReal`, so order ∈ `[0, ∞]`),
    `Filter.Tendsto.limsup_eq`, `limsup_const`, `EReal.tendsto_coe`,
    `continuous_coe_real_ereal`.

  ## What mathlib LACKS (why this brick is needed)

  * NO definition of the ORDER (or genus) of an entire function `f : ℂ → ℂ`.
  * NO Hadamard factorization / Weierstrass product, NO Laguerre–Pólya class on `ℂ`.
  * NO Hurwitz / Rouché / argument principle for holomorphic functions.

  ## What THIS file delivers

  * `maxModulus f r := ⨆ z : sphere 0 r, ‖f z‖`  and
    `order f := limsup_{r→∞} (log⁺ log⁺ (maxModulus f r)) / log r`  (into `EReal`).
    Both typecheck.
  * Sorry-free, `#print axioms`-clean:
      - `maxModulus_nonneg`
      - `order_nonneg`
      - `tendsto_posLog_posLog_div_log`  (the crux `log⁺ log⁺ r / log r → 0`)
      - `maxModulus_polynomial_le`  (`M_p(r) ≤ C · r^{natDegree}` for `r ≥ 1`)
  * `order_polynomial_le_zero` / `order_mul_le` : structured with PRECISE `sorry`s naming
    the exact missing lemma (see each `sorry` comment).  Honest scope: brick 1 of many.
-/
import Mathlib.Analysis.SpecialFunctions.Log.PosLog
import Mathlib.Analysis.SpecialFunctions.Log.Basic
import Mathlib.Analysis.Polynomial.Basic
import Mathlib.Analysis.Complex.AbsMax
import Mathlib.Analysis.Complex.LocallyUniformLimit
import Mathlib.Analysis.Complex.CauchyIntegral
import Mathlib.Analysis.Calculus.IteratedDeriv.Defs
import Mathlib.Topology.Instances.EReal.Lemmas
import Mathlib.Topology.Order.LiminfLimsup

open Filter Topology Real Metric
open scoped Topology

namespace EntireOrder

/-- The **maximum modulus** `M_f(r) = sup_{‖z‖ = r} ‖f z‖` of `f : ℂ → ℂ` on the sphere of
radius `r`, as an indexed supremum over the (subtype) sphere.  For `r < 0` the sphere is
empty and this is `0`; for `r ≥ 0` the sphere is nonempty and this is the genuine sup. -/
noncomputable def maxModulus (f : ℂ → ℂ) (r : ℝ) : ℝ :=
  ⨆ z : Metric.sphere (0 : ℂ) r, ‖f z‖

/-- `M_f(r) ≥ 0` always (norms are nonnegative; `sSup` of nonnegatives, or `sSup ∅ = 0`). -/
theorem maxModulus_nonneg (f : ℂ → ℂ) (r : ℝ) : 0 ≤ maxModulus f r := by
  unfold maxModulus
  rw [iSup]
  apply Real.sSup_nonneg
  rintro x ⟨z, rfl⟩
  exact norm_nonneg _

/-- The **order (of growth)** of an entire function `f : ℂ → ℂ`:
`order f = limsup_{r→∞} (log⁺ log⁺ M_f(r)) / log r`, valued in `EReal` (so `[0, ∞]`). -/
noncomputable def order (f : ℂ → ℂ) : EReal :=
  Filter.limsup
    (fun r : ℝ => ((Real.posLog (Real.posLog (maxModulus f r)) / Real.log r : ℝ) : EReal))
    Filter.atTop

/-- The order is always `≥ 0`: every ratio `log⁺ log⁺ M / log r` is `≥ 0` for `r > 1`
(numerator `≥ 0`, denominator `> 0`), so the `limsup` is `≥ 0`. -/
theorem order_nonneg (f : ℂ → ℂ) : 0 ≤ order f := by
  unfold order
  refine le_trans (le_of_eq (limsup_const (α := ℝ) (f := atTop) (0 : EReal)).symm) ?_
  apply limsup_le_limsup
  · filter_upwards [eventually_gt_atTop (1 : ℝ)] with r hr
    have hnum : 0 ≤ Real.posLog (Real.posLog (maxModulus f r)) := Real.posLog_nonneg
    have hden : 0 ≤ Real.log r := Real.log_nonneg hr.le
    have : (0 : ℝ) ≤ Real.posLog (Real.posLog (maxModulus f r)) / Real.log r :=
      div_nonneg hnum hden
    exact_mod_cast this
  · exact isCobounded_le_of_bot
  · exact isBounded_le_of_top

/-- **Crux limit.**  `log⁺ log⁺ r / log r → 0` as `r → ∞`.  Equivalently: the *iterated*
positive logarithm is `o(log)`.  This is the analytic heart of "order of a polynomial is
`0`": any polynomial growth `M(r) ≤ C r^d` gives `log⁺ log⁺ M(r) = O(log log r) = o(log r)`.

Proof: for large `r`, `log⁺ log⁺ r = log (log r)`, and `log ∘ log =o[atTop] log` because
`log =o[atTop] id` composed with `log → ∞`. -/
theorem tendsto_posLog_posLog_div_log :
    Tendsto (fun r : ℝ => Real.posLog (Real.posLog r) / Real.log r) atTop (𝓝 0) := by
  -- `log ∘ log =o[atTop] id ∘ log = log`, hence the ratio → 0.
  have hoo : (fun r : ℝ => Real.log (Real.log r)) =o[atTop] (fun r : ℝ => Real.log r) := by
    have := Real.isLittleO_log_id_atTop.comp_tendsto Real.tendsto_log_atTop
    simpa [Function.comp] using this
  -- turn the little-o into a `/`-limit
  have hdiv : Tendsto (fun r : ℝ => Real.log (Real.log r) / Real.log r) atTop (𝓝 0) := by
    have := hoo.tendsto_div_nhds_zero
    simpa using this
  -- eventually the numerator `log⁺ log⁺ r` equals `log (log r)` (for `r ≥ e^e ... `, i.e.
  -- once `log r ≥ 1`, so `log⁺ r = log r`, and `log r ≥ 1` again so `log⁺(log r) = log(log r)`)
  refine hdiv.congr' ?_
  filter_upwards [eventually_ge_atTop (Real.exp (Real.exp 1))] with r hr
  have he1 : (1 : ℝ) ≤ Real.exp 1 := (Real.one_le_exp_iff).2 zero_le_one
  have hr0 : 0 < r := lt_of_lt_of_le (Real.exp_pos _) hr
  have hrge : Real.exp 1 ≤ Real.log r := by
    have := Real.le_log_iff_exp_le hr0 |>.2 hr
    -- `Real.exp (Real.exp 1) ≤ r ↔ Real.exp 1 ≤ log r`
    simpa using this
  have hlogr1 : (1 : ℝ) ≤ Real.log r := le_trans he1 hrge
  have hlogr_pos : 0 < Real.log r := lt_of_lt_of_le zero_lt_one hlogr1
  have hloglog1 : (1 : ℝ) ≤ Real.log (Real.log r) := by
    have : Real.exp 1 ≤ Real.log r := hrge
    have := Real.le_log_iff_exp_le hlogr_pos |>.2 (by simpa using this)
    -- `Real.exp 1 ≤ log r ↔ 1 ≤ log (log r)`
    simpa using this
  -- rewrite both `posLog`s to `log`
  have e1 : Real.posLog r = Real.log r := by
    rw [Real.posLog_def]; exact max_eq_right hlogr_pos.le
  have e2 : Real.posLog (Real.posLog r) = Real.log (Real.log r) := by
    rw [e1, Real.posLog_def]
    exact max_eq_right (le_trans zero_le_one hloglog1)
  rw [e2]

/-- **Polynomial growth of the modulus.**  For a complex polynomial `p` and `r ≥ 1`,
`M_p(r) ≤ (∑_{i ≤ natDegree p} ‖coeff i‖) · r^{natDegree p}`.  This is the finite-index
sup bound `‖p.eval z‖ ≤ ∑ ‖coeff i‖ · ‖z‖^i ≤ C · r^d` for `‖z‖ = r ≥ 1`. -/
theorem maxModulus_polynomial_le (p : Polynomial ℂ) {r : ℝ} (hr : 1 ≤ r) :
    maxModulus (fun z => p.eval z) r ≤
      (∑ i ∈ Finset.range (p.natDegree + 1), ‖p.coeff i‖) * r ^ p.natDegree := by
  set C : ℝ := ∑ i ∈ Finset.range (p.natDegree + 1), ‖p.coeff i‖ with hC
  have hr0 : (0 : ℝ) ≤ r := le_trans zero_le_one hr
  have hne : Nonempty (Metric.sphere (0 : ℂ) r) :=
    (NormedSpace.sphere_nonempty (x := (0 : ℂ)) (r := r)).2 hr0 |>.to_subtype
  apply ciSup_le
  intro z
  have hz : ‖(z : ℂ)‖ = r := by
    have := z.2; rw [Metric.mem_sphere, dist_zero_right] at this; exact this
  -- `‖p.eval z‖ ≤ ∑_{i<d+1} ‖coeff i‖ ‖z‖^i`
  have hbound : ‖p.eval (z : ℂ)‖ ≤ ∑ i ∈ Finset.range (p.natDegree + 1), ‖p.coeff i‖ * r ^ i := by
    calc ‖p.eval (z : ℂ)‖
        = ‖∑ i ∈ Finset.range (p.natDegree + 1), p.coeff i * (z : ℂ) ^ i‖ := by
          rw [Polynomial.eval_eq_sum_range]
      _ ≤ ∑ i ∈ Finset.range (p.natDegree + 1), ‖p.coeff i * (z : ℂ) ^ i‖ := norm_sum_le _ _
      _ = ∑ i ∈ Finset.range (p.natDegree + 1), ‖p.coeff i‖ * r ^ i := by
          apply Finset.sum_congr rfl
          intro i _
          rw [norm_mul, norm_pow, hz]
  -- and `∑ ‖coeff i‖ r^i ≤ (∑ ‖coeff i‖) r^d` since `r^i ≤ r^d` for `i ≤ d`, `r ≥ 1`
  refine hbound.trans ?_
  rw [hC, Finset.sum_mul]
  apply Finset.sum_le_sum
  intro i hi
  have hid : i ≤ p.natDegree := Nat.lt_succ_iff.1 (Finset.mem_range.1 hi)
  have hri : r ^ i ≤ r ^ p.natDegree := pow_le_pow_right₀ hr hid
  exact mul_le_mul_of_nonneg_left hri (norm_nonneg _)

/-- **Order of a polynomial is `0`** — sorry-free.

Combined with `order_nonneg` this gives `order p = 0` (see `order_polynomial_eq_zero`).

Proof: write `ratio r = log⁺ log⁺ M_p(r) / log r`.  With `C' = (∑‖coeffᵢ‖)+1 > 0` and
`d' = natDegree+1 ≥ 1`, the growth bound `maxModulus_polynomial_le` gives
`M_p(r) ≤ C' · r^{d'}` for `r ≥ 1`, hence (monotone `log⁺`, twice) `0 ≤ ratio r ≤ upper r`
where `upper r = log⁺ log⁺ (C' r^{d'}) / log r`.  Factor `upper = g₁ · g₂` with
`g₁ r = log⁺ log⁺ (C' r^{d'}) / log (C' r^{d'}) → 0` (the crux
`tendsto_posLog_posLog_div_log` composed with `C' r^{d'} → ∞`) and
`g₂ r = log(C' r^{d'}) / log r → d'` (finite).  So `upper → 0`, and the squeeze forces
`ratio → 0`; then `order = limsup (coe ∘ ratio) = 0` by `Tendsto.limsup_eq`. -/
theorem order_polynomial_eq_zero (p : Polynomial ℂ) : order (fun z => p.eval z) = 0 := by
  set d' : ℕ := p.natDegree + 1 with hd'
  have hd'pos : 0 < d' := Nat.succ_pos _
  set C' : ℝ := (∑ i ∈ Finset.range (p.natDegree + 1), ‖p.coeff i‖) + 1 with hC'
  have hCnn : 0 ≤ ∑ i ∈ Finset.range (p.natDegree + 1), ‖p.coeff i‖ :=
    Finset.sum_nonneg fun _ _ => norm_nonneg _
  have hC'pos : 0 < C' := by positivity
  -- the ratio function
  set ratio : ℝ → ℝ :=
    fun r => Real.posLog (Real.posLog (maxModulus (fun z => p.eval z) r)) / Real.log r with hratio
  -- `s r = C' r^{d'} → ∞`
  have hs_top : Tendsto (fun r : ℝ => C' * r ^ d') atTop atTop :=
    (tendsto_pow_atTop hd'pos.ne').const_mul_atTop hC'pos
  -- g₁ → 0  (crux ∘ (s → ∞))
  have hg1 : Tendsto
      (fun r : ℝ => Real.posLog (Real.posLog (C' * r ^ d')) / Real.log (C' * r ^ d'))
      atTop (𝓝 0) := tendsto_posLog_posLog_div_log.comp hs_top
  -- g₂ → d'  :  log (C' r^{d'}) / log r = log C'/log r + d'  →  0 + d' = d'
  have hg2 : Tendsto (fun r : ℝ => Real.log (C' * r ^ d') / Real.log r) atTop (𝓝 (d' : ℝ)) := by
    have hlog0 : Tendsto (fun r : ℝ => Real.log C' / Real.log r) atTop (𝓝 0) :=
      (tendsto_const_nhds).div_atTop Real.tendsto_log_atTop
    have hsum : Tendsto (fun r : ℝ => Real.log C' / Real.log r + (d' : ℝ)) atTop (𝓝 (d' : ℝ)) := by
      simpa using hlog0.add (tendsto_const_nhds (x := (d' : ℝ)))
    refine hsum.congr' ?_
    filter_upwards [eventually_gt_atTop (1 : ℝ)] with r hr
    have hr0 : 0 < r := lt_trans zero_lt_one hr
    have hlogr : Real.log r ≠ 0 := ne_of_gt (Real.log_pos hr)
    rw [Real.log_mul (ne_of_gt hC'pos) (by positivity), Real.log_pow]
    field_simp
  -- upper = g₁ · g₂ → 0 · d' = 0
  have hupper : Tendsto
      (fun r : ℝ => Real.posLog (Real.posLog (C' * r ^ d')) / Real.log r) atTop (𝓝 0) := by
    have hmul := hg1.mul hg2
    simp only [zero_mul] at hmul
    refine hmul.congr' ?_
    filter_upwards [eventually_gt_atTop (1 : ℝ)] with r hr
    have hr0 : 0 < r := lt_trans zero_lt_one hr
    have hpos : 0 < C' * r ^ d' := by positivity
    have hlogr : Real.log r ≠ 0 := ne_of_gt (Real.log_pos hr)
    have hlogs : Real.log (C' * r ^ d') ≠ 0 := by
      apply ne_of_gt; apply Real.log_pos
      have hC1 : (1 : ℝ) ≤ C' := by rw [hC']; linarith
      have hrd : (1 : ℝ) < r ^ d' := one_lt_pow₀ hr hd'pos.ne'
      have hle : r ^ d' ≤ C' * r ^ d' := le_mul_of_one_le_left (by positivity) hC1
      linarith
    -- cancel log(C' r^{d'}) :  A/B * (B/C) = A/C
    rw [div_mul_div_comm,
        mul_comm (Real.posLog (Real.posLog (C' * r ^ d'))) (Real.log (C' * r ^ d')),
        mul_div_mul_left _ _ hlogs]
  -- squeeze: 0 ≤ ratio r ≤ upper r  eventually  ⇒  ratio → 0
  have hratio_tendsto : Tendsto ratio atTop (𝓝 0) := by
    apply tendsto_of_tendsto_of_tendsto_of_le_of_le' (tendsto_const_nhds) hupper
    · filter_upwards [eventually_ge_atTop (1 : ℝ)] with r hr
      exact div_nonneg Real.posLog_nonneg (Real.log_nonneg hr)
    · filter_upwards [eventually_ge_atTop (Real.exp 1)] with r hr
      have he1 : (1 : ℝ) ≤ Real.exp 1 := (Real.one_le_exp_iff).2 zero_le_one
      have hr1 : (1 : ℝ) ≤ r := le_trans he1 hr
      have hlogr_pos : 0 < Real.log r := by
        have : Real.exp 1 ≤ r := hr
        have := Real.log_le_log (Real.exp_pos 1) this
        rw [Real.log_exp] at this; exact lt_of_lt_of_le zero_lt_one this
      -- M_p(r) ≤ C r^d ≤ C' r^{d'}
      have hMle : maxModulus (fun z => p.eval z) r ≤ C' * r ^ d' := by
        refine (maxModulus_polynomial_le p hr1).trans ?_
        have h1 : (∑ i ∈ Finset.range (p.natDegree + 1), ‖p.coeff i‖) * r ^ p.natDegree
                    ≤ C' * r ^ p.natDegree := by
          apply mul_le_mul_of_nonneg_right (by rw [hC']; linarith) (by positivity)
        refine h1.trans ?_
        rw [hd']
        exact mul_le_mul_of_nonneg_left (pow_le_pow_right₀ hr1 (Nat.le_succ _)) hC'pos.le
      -- monotone posLog twice
      have hMnn : 0 ≤ maxModulus (fun z => p.eval z) r := maxModulus_nonneg _ _
      have hCrd_nn : 0 ≤ C' * r ^ d' := by positivity
      have step1 : Real.posLog (maxModulus (fun z => p.eval z) r)
                    ≤ Real.posLog (C' * r ^ d') :=
        Real.monotoneOn_posLog (Set.mem_Ici.2 hMnn) (Set.mem_Ici.2 hCrd_nn) hMle
      have step2 : Real.posLog (Real.posLog (maxModulus (fun z => p.eval z) r))
                    ≤ Real.posLog (Real.posLog (C' * r ^ d')) :=
        Real.monotoneOn_posLog (Set.mem_Ici.2 Real.posLog_nonneg)
          (Set.mem_Ici.2 Real.posLog_nonneg) step1
      exact div_le_div_of_nonneg_right step2 hlogr_pos.le
  -- conclude: order = limsup (coe ∘ ratio) = coe 0 = 0
  have hcoe : Tendsto (fun r : ℝ => (ratio r : EReal)) atTop (𝓝 (0 : EReal)) := by
    have : Tendsto (fun r : ℝ => (ratio r : EReal)) atTop (𝓝 ((0 : ℝ) : EReal)) :=
      (continuous_coe_real_ereal.tendsto 0).comp hratio_tendsto
    simpa using this
  unfold order
  exact hcoe.limsup_eq

/-- Order of a polynomial is `0` (upper-bound corollary form). -/
theorem order_polynomial_le_zero (p : Polynomial ℂ) : order (fun z => p.eval z) ≤ 0 :=
  (order_polynomial_eq_zero p).le

/-- **Sub-multiplicativity of the maximum modulus** (brick 2).

For CONTINUOUS `f g : ℂ → ℂ`, `M_{fg}(r) ≤ M_f(r) · M_g(r)`.  Continuity is the essential
hypothesis: `Metric.sphere 0 r` is compact (`isCompact_sphere`, `ℂ` is a `ProperSpace`), so
`z ↦ ‖f z‖` attains a bounded sup on it (`IsCompact.bddAbove_image`), i.e. each sphere-sup is
a genuine `BddAbove` supremum and `le_ciSup`/`ciSup_le` apply.  For arbitrary (possibly
discontinuous) `f` the pointwise norm can be unbounded on the sphere, `Real.sSup` collapses to
its junk value `0`, and the inequality fails — which is exactly why brick 1 left this deferred. -/
theorem maxModulus_mul_le {f g : ℂ → ℂ} (hf : Continuous f) (hg : Continuous g) (r : ℝ) :
    maxModulus (fun z => f z * g z) r ≤ maxModulus f r * maxModulus g r := by
  rcases lt_or_ge r 0 with hr | hr
  · -- `r < 0`: the sphere is empty and every `maxModulus` is the `sSup ∅ = 0` junk value.
    have hemp : ¬ (Metric.sphere (0 : ℂ) r).Nonempty := by
      rw [NormedSpace.sphere_nonempty]; exact not_le.2 hr
    haveI hE : IsEmpty (Metric.sphere (0 : ℂ) r) := by
      rw [Set.isEmpty_coe_sort]; exact Set.not_nonempty_iff_eq_empty.1 hemp
    have hz : ∀ h : ℂ → ℂ, maxModulus h r = 0 := by
      intro h; unfold maxModulus; rw [iSup, Set.range_eq_empty, Real.sSup_empty]
    rw [hz (fun z => f z * g z), hz f, hz g, mul_zero]
  · -- `r ≥ 0`: nonempty compact sphere; both sphere-sups are `BddAbove`.
    haveI hne : Nonempty (Metric.sphere (0 : ℂ) r) :=
      ((NormedSpace.sphere_nonempty (x := (0 : ℂ)) (r := r)).2 hr).to_subtype
    have hcpt := isCompact_sphere (0 : ℂ) r
    have hbf : BddAbove (Set.range fun z : Metric.sphere (0 : ℂ) r => ‖f z‖) := by
      have h := hcpt.bddAbove_image hf.norm.continuousOn
      rwa [Set.image_eq_range] at h
    have hbg : BddAbove (Set.range fun z : Metric.sphere (0 : ℂ) r => ‖g z‖) := by
      have h := hcpt.bddAbove_image hg.norm.continuousOn
      rwa [Set.image_eq_range] at h
    refine ciSup_le fun z => ?_
    simp only [norm_mul]
    exact mul_le_mul (le_ciSup hbf z) (le_ciSup hbg z) (norm_nonneg _) (maxModulus_nonneg f r)

/-- **Sub-multiplicativity of order** (brick 2, sorry-free) — `order (f · g) ≤ max (order f)
(order g)` for continuous `f g`.

Two ingredients:

1. `maxModulus_mul_le` (continuity hypothesis) gives `M_{fg}(r) ≤ M_f(r) · M_g(r)`.  Two
   applications of `Real.posLog_mul` and monotonicity of `log⁺` turn this into the real
   estimate
   `log⁺ log⁺ M_{fg}(r) ≤ log⁺ 2 + max (log⁺ log⁺ M_f(r)) (log⁺ log⁺ M_g(r))`
   (using `a + b ≤ 2 · max a b` and that `log⁺` preserves `max` on `[0,∞)`).  Dividing by
   `log r > 0` (`max_div_div_right`) yields, eventually,
   `w r ≤ corr r + (u r ⊔ v r)` in `EReal`, where `corr r = log⁺2 / log r → 0`.

2. The `EReal`-limsup step: `EReal.limsup_add_le` (with `limsup corr = 0`) splits the sum, and
   `Filter.limsup_max` turns `limsup (u ⊔ v)` into `max (limsup u) (limsup v) = max (order f)
   (order g)`. -/
theorem order_mul_le {f g : ℂ → ℂ} (hf : Continuous f) (hg : Continuous g) :
    order (fun z => f z * g z) ≤ max (order f) (order g) := by
  -- the three EReal ratio-sequences and the vanishing correction term
  set u : ℝ → EReal :=
    fun r => ((Real.posLog (Real.posLog (maxModulus f r)) / Real.log r : ℝ) : EReal) with hu
  set v : ℝ → EReal :=
    fun r => ((Real.posLog (Real.posLog (maxModulus g r)) / Real.log r : ℝ) : EReal) with hv
  set w : ℝ → EReal :=
    fun r => ((Real.posLog (Real.posLog (maxModulus (fun z => f z * g z) r)) / Real.log r : ℝ)
      : EReal) with hw
  set corr : ℝ → EReal := fun r => ((Real.posLog 2 / Real.log r : ℝ) : EReal) with hcorr
  set U : ℝ → EReal := fun r => max (u r) (v r) with hU
  -- the real coercion sends `max` to `max`
  have coe_max : ∀ a b : ℝ, ((max a b : ℝ) : EReal) = max (a : EReal) (b : EReal) := by
    intro a b
    rcases le_total a b with h | h
    · rw [max_eq_right h, max_eq_right (EReal.coe_le_coe h)]
    · rw [max_eq_left h, max_eq_left (EReal.coe_le_coe h)]
  -- `limsup corr = 0`
  have hcorr0 : limsup corr atTop = 0 := by
    have ht : Tendsto (fun r : ℝ => Real.posLog 2 / Real.log r) atTop (𝓝 0) :=
      tendsto_const_nhds.div_atTop Real.tendsto_log_atTop
    have htc : Tendsto corr atTop (𝓝 (0 : EReal)) := by
      have := (continuous_coe_real_ereal.tendsto 0).comp ht
      simpa [hcorr, Function.comp] using this
    exact htc.limsup_eq
  -- eventual bound `w ≤ corr + U`
  have hev : w ≤ᶠ[atTop] corr + U := by
    filter_upwards [eventually_gt_atTop (1 : ℝ)] with r hr
    have hlogr : 0 < Real.log r := Real.log_pos hr
    have hA : 0 ≤ maxModulus f r := maxModulus_nonneg f r
    have hB : 0 ≤ maxModulus g r := maxModulus_nonneg g r
    have hP : 0 ≤ maxModulus (fun z => f z * g z) r := maxModulus_nonneg _ r
    have hPAB : maxModulus (fun z => f z * g z) r ≤ maxModulus f r * maxModulus g r :=
      maxModulus_mul_le hf hg r
    set pA := Real.posLog (maxModulus f r) with hpA
    set pB := Real.posLog (maxModulus g r) with hpB
    -- `log⁺ M_{fg} ≤ log⁺ M_f + log⁺ M_g ≤ 2 · max (log⁺ M_f) (log⁺ M_g)`
    have h1 : Real.posLog (maxModulus (fun z => f z * g z) r) ≤ pA + pB :=
      (Real.monotoneOn_posLog (Set.mem_Ici.2 hP) (Set.mem_Ici.2 (mul_nonneg hA hB)) hPAB).trans
        Real.posLog_mul
    have h2 : pA + pB ≤ 2 * max pA pB := by
      have := le_max_left pA pB; have := le_max_right pA pB; linarith
    have hPle : Real.posLog (maxModulus (fun z => f z * g z) r) ≤ 2 * max pA pB := h1.trans h2
    -- apply `log⁺` again and use `log⁺ (2 · M) ≤ log⁺ 2 + log⁺ M`
    have h3 : Real.posLog (Real.posLog (maxModulus (fun z => f z * g z) r))
                ≤ Real.posLog (2 * max pA pB) :=
      Real.monotoneOn_posLog (Set.mem_Ici.2 Real.posLog_nonneg)
        (Set.mem_Ici.2 (mul_nonneg (by norm_num)
          (le_trans Real.posLog_nonneg (le_max_left pA pB)))) hPle
    have h4 : Real.posLog (2 * max pA pB) ≤ Real.posLog 2 + Real.posLog (max pA pB) :=
      Real.posLog_mul
    -- `log⁺` preserves `max` on `[0,∞)`
    have h5 : Real.posLog (max pA pB) = max (Real.posLog pA) (Real.posLog pB) := by
      rcases le_total pA pB with h | h
      · rw [max_eq_right h,
          max_eq_right (Real.monotoneOn_posLog (Set.mem_Ici.2 Real.posLog_nonneg)
            (Set.mem_Ici.2 Real.posLog_nonneg) h)]
      · rw [max_eq_left h,
          max_eq_left (Real.monotoneOn_posLog (Set.mem_Ici.2 Real.posLog_nonneg)
            (Set.mem_Ici.2 Real.posLog_nonneg) h)]
    have hnum : Real.posLog (Real.posLog (maxModulus (fun z => f z * g z) r))
                  ≤ Real.posLog 2 + max (Real.posLog pA) (Real.posLog pB) := by
      calc Real.posLog (Real.posLog (maxModulus (fun z => f z * g z) r))
          ≤ Real.posLog 2 + Real.posLog (max pA pB) := h3.trans h4
        _ = Real.posLog 2 + max (Real.posLog pA) (Real.posLog pB) := by rw [h5]
    -- divide by `log r > 0`
    have hreal : Real.posLog (Real.posLog (maxModulus (fun z => f z * g z) r)) / Real.log r
        ≤ Real.posLog 2 / Real.log r
          + max (Real.posLog pA / Real.log r) (Real.posLog pB / Real.log r) := by
      calc Real.posLog (Real.posLog (maxModulus (fun z => f z * g z) r)) / Real.log r
          ≤ (Real.posLog 2 + max (Real.posLog pA) (Real.posLog pB)) / Real.log r :=
            div_le_div_of_nonneg_right hnum hlogr.le
        _ = Real.posLog 2 / Real.log r
              + max (Real.posLog pA) (Real.posLog pB) / Real.log r := by rw [add_div]
        _ = Real.posLog 2 / Real.log r
              + max (Real.posLog pA / Real.log r) (Real.posLog pB / Real.log r) := by
            rw [max_div_div_right hlogr.le]
    -- coerce the real inequality into `EReal`
    show w r ≤ (corr + U) r
    simp only [hw, hcorr, hU, hu, hv, Pi.add_apply]
    rw [← coe_max, ← EReal.coe_add]
    exact EReal.coe_le_coe hreal
  -- assemble via `EReal.limsup_add_le` and `Filter.limsup_max`
  have hne1 : limsup corr atTop ≠ ⊥ ∨ limsup U atTop ≠ ⊤ :=
    Or.inl (by rw [hcorr0]; exact EReal.bot_lt_zero.ne')
  have hne2 : limsup corr atTop ≠ ⊤ ∨ limsup U atTop ≠ ⊥ :=
    Or.inl (by rw [hcorr0]; exact EReal.zero_lt_top.ne)
  have key : limsup w atTop ≤ max (limsup u atTop) (limsup v atTop) := by
    calc limsup w atTop
        ≤ limsup (corr + U) atTop :=
          limsup_le_limsup hev isCobounded_le_of_bot isBounded_le_of_top
      _ ≤ limsup corr atTop + limsup U atTop := EReal.limsup_add_le hne1 hne2
      _ = limsup U atTop := by rw [hcorr0, zero_add]
      _ = max (limsup u atTop) (limsup v atTop) := by
          rw [hU]
          exact limsup_max isCobounded_le_of_bot isCobounded_le_of_bot
            isBounded_le_of_top isBounded_le_of_top
  -- `limsup w = order (f·g)`, `limsup u = order f`, `limsup v = order g` (definitional)
  have e0 : order (fun z => f z * g z) = limsup w atTop := rfl
  have ef : order f = limsup u atTop := rfl
  have eg : order g = limsup v atTop := rfl
  rw [e0, ef, eg]; exact key

/-! ## Weierstrass: locally-uniform convergence of iterated derivatives

A genuine, sorry-free analytic ingredient for the entire heat-flow theory: if a sequence of
ENTIRE functions converges locally uniformly on an open set, then so does every one of their
iterated (complex) derivatives.  Proof: iterate mathlib's Weierstrass
`TendstoLocallyUniformlyOn.deriv` (a loc-unif limit of holomorphic functions has a
loc-unif-convergent derivative), using that an entire function's iterated derivatives are
themselves entire (`ContDiff.differentiable_iteratedDeriv'`).

**Honest scope.**  This is NECESSARY but NOT SUFFICIENT for the (now-known-FALSE, see the
counterexample in `EntireLP.lean`) locally-uniform continuity of the order-≤2 heat-flow series
`Σₖ ((−t)ᵏ/k!)·f^{(2k)}`: loc-unif convergence of each individual derivative *term* does NOT
control the infinite `k`-sum, and no uniform majorant for that sum exists across all
loc-unif-convergent entire sequences (the counterexample disproves it).  The lemma is kept
because it is a correct, reusable Weierstrass fact that the eventual (type-controlled) proof of
`heat_preserves_LP_entire` will need. -/
theorem iteratedDeriv_tendstoLocallyUniformlyOn
    {F : ℕ → ℂ → ℂ} {g : ℂ → ℂ} {U : Set ℂ} (hU : IsOpen U)
    (hF : ∀ n, Differentiable ℂ (F n))
    (h : TendstoLocallyUniformlyOn F g Filter.atTop U) (m : ℕ) :
    TendstoLocallyUniformlyOn
      (fun n => iteratedDeriv m (F n)) (iteratedDeriv m g) Filter.atTop U := by
  induction m with
  | zero => simpa only [iteratedDeriv_zero] using h
  | succ m ih =>
      have hdiff : ∀ᶠ n in (Filter.atTop : Filter ℕ),
          DifferentiableOn ℂ (iteratedDeriv m (F n)) U :=
        Filter.Eventually.of_forall fun n =>
          (((hF n).contDiff).differentiable_iteratedDeriv' m).differentiableOn
      have hd := ih.deriv hdiff hU
      simpa only [iteratedDeriv_succ, Function.comp_def] using hd

-- Axiom audit for the two brick-2 theorems (should be the standard three:
-- `propext`, `Classical.choice`, `Quot.sound` — no `sorryAx`).
#print axioms EntireOrder.maxModulus_mul_le
#print axioms EntireOrder.order_mul_le
-- Weierstrass iterated-derivative convergence (sorry-free reachable analytic brick):
#print axioms EntireOrder.iteratedDeriv_tendstoLocallyUniformlyOn

end EntireOrder
