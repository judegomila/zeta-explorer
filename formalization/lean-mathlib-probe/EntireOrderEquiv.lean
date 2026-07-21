/-
  EntireOrderEquiv — toward the ORDER-EQUIVALENCE  ρ_M = ρ_coeff  for entire functions.

  Classical theorem (Boas, *Entire Functions*, §2.2; Levin, Ch. I): for an entire `f` the
  growth order defined via the maximum modulus,

      ρ_M = limsup_{r→∞} log⁺log⁺ M_f(r) / log r        (`EntireOrder.order`),

  equals the order read off the Taylor coefficients `aₙ = f^{(n)}(0)/n!`,

      ρ_coeff = limsup_{n→∞} (n · log n) / log(1/‖aₙ‖)   (`coefficientOrder`).

  This file assembles the two SORRY-FREE workhorse inequalities that pin `M_f(R)` between a
  single coefficient term and the full coefficient series:

      ‖aₙ‖ · Rⁿ  ≤  M_f(R)  ≤  Σₖ ‖aₖ‖ · Rᵏ                          (†)

  The LEFT bound is the banked Cauchy estimate `EntireCauchy.norm_taylorCoeff_le_maxModulus`
  rearranged; the RIGHT bound (`maxModulus_le_tsum_coeff`, proved here) is the genuinely new
  reverse-direction ingredient the coordinator flagged (`M_f(R) ≤ Σ‖aₙ‖Rⁿ`).  Both are
  `#print axioms`-clean (`[propext, Classical.choice, Quot.sound]`, no `sorryAx`).

  ## Honest scope — what is and is NOT closed here

  The sandwich (†) is the CONCRETE, finite-`R` heart of the equivalence and is fully proved.
  The equality `ρ_M = ρ_coeff` itself is NOT proved here: it is the *asymptotic* layer on top
  of (†), and reduces to two classical optimization lemmas that remain **[must-build]** — each
  a real `log log`-asymptotics argument, NOT a one-liner:

  * **FWD  ρ_coeff ≤ ρ_M — CLOSED sorry-free modulo ONE named unwinding.**  The optimization
    itself is now fully proved: `log_norm_taylorCoeff_le` (quantitative decay from a growth
    bound) + `coefficientOrder_le_of_maxModulus_growth` (evaluate at `R = n^{1/σ}`, so
    `−log‖aₙ‖ ≥ (n/σ)(log n − σ)`, and take the `limsup` of the convergent upper bound
    `σ·log n/(log n − σ) → σ`) — BOTH sorry-free.  The only remaining piece is the
    EReal→ℝ unwinding of `order` into the pointwise growth bound `M_f(R) ≤ exp(R^σ)`,
    isolated as the explicit hypothesis `MaxModulusGrowthFromOrder` and consumed by
    `coefficientOrder_le_order`.  So FWD is a genuine `sorryAx`-free CONDITIONAL theorem.

  * `[named input REV]`  ρ_M ≤ ρ_coeff — NOT yet done.  From the RIGHT bound `M_f(R) ≤
    Σ‖aₙ‖Rⁿ` (proved here).  If `ρ_coeff < σ` then `‖aₙ‖ ≤ n^{−n/σ}` eventually, and the tail
    sum `Σ n^{−n/σ} Rⁿ` is bounded by `exp(c·R^σ)` (split the sum at `n ≈ (2R)^σ`; the head is
    `≤ (#terms)·max term`, the tail is geometric), giving `log⁺log⁺ M_f(R)/log R ≤ σ`.
    Needs: the head/tail split estimate on `Σ n^{−n/σ}Rⁿ` and its `log log`-asymptotics — a
    real infinite-sum tail argument, materially harder than FWD, left for a follow-up.

  The remaining gaps (the FWD `order→growth` unwinding, and the whole REV tail estimate) are
  stated with full precision so a follow-up can discharge them; they are deliberately NOT
  introduced as bare `sorry`s masquerading as done (cf. the removed FALSE `heatFlow_continuous`
  axiom — honesty over apparent completeness).
-/
import EntireOrder
import EntireCauchy
import Mathlib.Analysis.Complex.TaylorSeries
import Mathlib.Analysis.Normed.Module.FiniteDimension
import Mathlib.Analysis.Normed.Group.InfiniteSum
import Mathlib.Analysis.SpecialFunctions.Pow.Asymptotics
import Mathlib.Analysis.SpecialFunctions.Pow.Real
import Mathlib.Analysis.SpecialFunctions.Log.Basic

open Filter Metric
open scoped Topology

namespace EntireOrderEquiv

/-- The `n`-th **Taylor coefficient** of an entire `f` at `0`, `aₙ = f^{(n)}(0)/n!`, in the
`(n!)⁻¹ • f^{(n)}(0)` normalization matching `Complex.hasSum_taylorSeries_of_entire` and the
banked `EntireCauchy.norm_taylorCoeff_le_maxModulus`. -/
noncomputable def taylorCoeff (f : ℂ → ℂ) (n : ℕ) : ℂ :=
  ((n.factorial : ℂ))⁻¹ • iteratedDeriv n f 0

/-- **LEFT bound of the sandwich (†)** — a single coefficient term is dominated by the maximum
modulus:  `‖aₙ‖ · Rⁿ ≤ M_f(R)`  (entire `f`, `R > 0`).  This is the banked Cauchy estimate
`EntireCauchy.norm_taylorCoeff_le_maxModulus` (`‖aₙ‖ ≤ M_f(R)/Rⁿ`) multiplied through by
`Rⁿ > 0`.  Sorry-free. -/
theorem norm_taylorCoeff_mul_pow_le_maxModulus {f : ℂ → ℂ} (hf : Differentiable ℂ f)
    {R : ℝ} (hR : 0 < R) (n : ℕ) :
    ‖taylorCoeff f n‖ * R ^ n ≤ EntireOrder.maxModulus f R := by
  have hRn : (0 : ℝ) < R ^ n := by positivity
  have h := EntireCauchy.norm_taylorCoeff_le_maxModulus hf hR n
  -- `h : ‖(n!)⁻¹ • D^n f 0‖ ≤ M_f(R) / Rⁿ`, and `taylorCoeff f n = (n!)⁻¹ • D^n f 0` by def.
  calc ‖taylorCoeff f n‖ * R ^ n
      ≤ (EntireOrder.maxModulus f R / R ^ n) * R ^ n :=
        mul_le_mul_of_nonneg_right h hRn.le
    _ = EntireOrder.maxModulus f R := by field_simp

/-- **RIGHT bound of the sandwich (†)** — the maximum modulus is dominated by the coefficient
series:  `M_f(R) ≤ Σₙ ‖aₙ‖ · Rⁿ`  (entire `f`, `R > 0`).  This is the reverse-direction
workhorse for `ρ_M ≤ ρ_coeff`.

Proof.  For `‖z‖ = R`, the Taylor expansion (`Complex.hasSum_taylorSeries_of_entire`) gives
`f z = ∑' n, (n!)⁻¹ • zⁿ • f^{(n)}(0)`.  In `ℂ` (finite-dimensional over `ℝ`) unconditional
summability is equivalent to absolute summability (`summable_norm_iff`), so the norm series is
summable and `‖f z‖ ≤ ∑' ‖·‖` (`norm_tsum_le_tsum_norm`).  Each norm term equals
`‖aₙ‖ · ‖z‖ⁿ = ‖aₙ‖ · Rⁿ`, a bound independent of `z`; taking the sup over the (nonempty,
`R > 0`) sphere via `ciSup_le` finishes.  Sorry-free. -/
theorem maxModulus_le_tsum_coeff {f : ℂ → ℂ} (hf : Differentiable ℂ f)
    {R : ℝ} (hR : 0 < R) :
    EntireOrder.maxModulus f R ≤ ∑' n : ℕ, ‖taylorCoeff f n‖ * R ^ n := by
  haveI hne : Nonempty (Metric.sphere (0 : ℂ) R) :=
    ((NormedSpace.sphere_nonempty (x := (0 : ℂ)) (r := R)).2 hR.le).to_subtype
  unfold EntireOrder.maxModulus
  refine ciSup_le fun z => ?_
  have hz : ‖(z : ℂ)‖ = R := by
    have := z.2; rwa [Metric.mem_sphere, dist_zero_right] at this
  -- Taylor `HasSum` at `0`, evaluated at `z`.
  have h := Complex.hasSum_taylorSeries_of_entire hf 0 (z : ℂ)
  set term : ℕ → ℂ :=
    fun n => ((n.factorial : ℂ))⁻¹ • ((z : ℂ) - 0) ^ n • iteratedDeriv n f 0 with hterm_def
  have hsum_norm : Summable (fun n => ‖term n‖) := summable_norm_iff.mpr h.summable
  -- each norm term is `‖aₙ‖ · Rⁿ`
  have hcoe : ∀ n, ‖term n‖ = ‖taylorCoeff f n‖ * R ^ n := by
    intro n
    simp only [hterm_def, taylorCoeff, sub_zero, smul_smul, norm_smul, norm_mul, norm_pow, hz]
    ring
  have hle : ‖f (z : ℂ)‖ ≤ ∑' n, ‖term n‖ := by
    rw [← h.tsum_eq]
    exact norm_tsum_le_tsum_norm hsum_norm
  calc ‖f (z : ℂ)‖ ≤ ∑' n, ‖term n‖ := hle
    _ = ∑' n, ‖taylorCoeff f n‖ * R ^ n := tsum_congr hcoe

/-- The **coefficient order** `ρ_coeff = limsup_{n→∞} (n · log n) / log(1/‖aₙ‖)` of an entire
`f`, valued in `EReal` (so `[0,∞]`).  `log(1/‖aₙ‖) = −log‖aₙ‖` (mathlib's `Real.log`); the
junk values at the finitely many `n` with `aₙ = 0` (where `Real.log 0 = 0`) do not affect the
`limsup`.  This is the coefficient-side order that the classical theorem equates with
`EntireOrder.order` (`ρ_M`); see the file header for the precise remaining asymptotic inputs. -/
noncomputable def coefficientOrder (f : ℂ → ℂ) : EReal :=
  Filter.limsup
    (fun n : ℕ => (((n : ℝ) * Real.log n / (- Real.log ‖taylorCoeff f n‖) : ℝ) : EReal))
    Filter.atTop

/-- **The finite-`R` sandwich (†)**, packaged: for entire `f`, `R > 0` and every `n`,

    ‖aₙ‖ · Rⁿ  ≤  M_f(R)  ≤  Σₖ ‖aₖ‖ · Rᵏ.

Both halves sorry-free (from `norm_taylorCoeff_mul_pow_le_maxModulus` and
`maxModulus_le_tsum_coeff`).  This is the concrete core on which the (still `[must-build]`)
asymptotic equality `EntireOrder.order f = coefficientOrder f` is built. -/
theorem taylorCoeff_maxModulus_sandwich {f : ℂ → ℂ} (hf : Differentiable ℂ f)
    {R : ℝ} (hR : 0 < R) (n : ℕ) :
    ‖taylorCoeff f n‖ * R ^ n ≤ EntireOrder.maxModulus f R ∧
      EntireOrder.maxModulus f R ≤ ∑' k : ℕ, ‖taylorCoeff f k‖ * R ^ k :=
  ⟨norm_taylorCoeff_mul_pow_le_maxModulus hf hR n, maxModulus_le_tsum_coeff hf hR⟩

/-! ## FWD direction:  ρ_coeff ≤ ρ_M

This CLOSES the forward inequality sorry-free, conditional on the growth bound
`M_f(R) ≤ exp(R^σ)` (eventually in `R`) — the standard "finite-order ⇒ growth" form.  The
EReal→ℝ unwinding `ρ_M < σ ⟹ (this growth bound)` is the one remaining named input
`order_lt_imp_maxModulus_growth` below; everything downstream of it is proved here. -/

/-- **Quantitative coefficient decay** (the analytic heart of FWD, sorry-free).  If the maximum
modulus obeys `M_f(R) ≤ exp(R^σ)` at a radius `R > 0`, then every nonzero Taylor coefficient
satisfies `log‖aₙ‖ ≤ R^σ − n·log R`.

Proof: the left half of the sandwich gives `‖aₙ‖·Rⁿ ≤ M_f(R) ≤ exp(R^σ)`; both sides are
positive, so taking `Real.log` (monotone) and expanding `log(‖aₙ‖·Rⁿ) = log‖aₙ‖ + n·log R`
(`Real.log_mul`, `Real.log_pow`) and `log(exp ·) = ·` (`Real.log_exp`) rearranges to the claim.
Here `R^σ` is `Real.rpow`. -/
theorem log_norm_taylorCoeff_le {f : ℂ → ℂ} (hf : Differentiable ℂ f) {σ R : ℝ}
    (hR : 0 < R) (hgrow : EntireOrder.maxModulus f R ≤ Real.exp (R ^ σ))
    {n : ℕ} (hn : taylorCoeff f n ≠ 0) :
    Real.log ‖taylorCoeff f n‖ ≤ R ^ σ - n * Real.log R := by
  have hpos : 0 < ‖taylorCoeff f n‖ := norm_pos_iff.mpr hn
  have hRn : (0 : ℝ) < R ^ n := by positivity
  have h1 : ‖taylorCoeff f n‖ * R ^ n ≤ Real.exp (R ^ σ) :=
    (norm_taylorCoeff_mul_pow_le_maxModulus hf hR n).trans hgrow
  have h2 : (0 : ℝ) < ‖taylorCoeff f n‖ * R ^ n := mul_pos hpos hRn
  have h3 : Real.log (‖taylorCoeff f n‖ * R ^ n) ≤ R ^ σ := by
    have := (Real.log_le_log_iff h2 (Real.exp_pos _)).mpr h1
    rwa [Real.log_exp] at this
  rw [Real.log_mul (ne_of_gt hpos) (ne_of_gt hRn), Real.log_pow] at h3
  linarith

/-- **[NAMED INPUT — the one remaining FWD gap: EReal→ℝ unwinding of `order`].**  If the
max-modulus order `ρ_M = EntireOrder.order f` is `< σ` (a finite real `σ`), then `f` obeys the
growth bound `M_f(R) ≤ exp(R^σ)` for all large `R`.

This is the standard translation of the double-`log⁺` `limsup` definition of order into a
pointwise growth bound: `order f < σ` gives (via `eventually_lt_of_limsup_lt`) that eventually
`log⁺log⁺ M_f(R) / log R < σ`, i.e. `log⁺ M_f(R) < R^σ` (exponentiate through the two `log⁺`s,
using `log r > 0`), i.e. `M_f(R) ≤ exp(R^σ)`.  It is a real (`[must-build]`) analytic lemma
— `posLog` case-analysis + `Real.exp_log`/`Real.rpow` bookkeeping — NOT proved here.  It is
deliberately an explicit HYPOTHESIS (not a `sorry`), so `coefficientOrder_le_order` below is a
genuine, `sorryAx`-free conditional theorem; discharging this hypothesis completes FWD. -/
def MaxModulusGrowthFromOrder (f : ℂ → ℂ) : Prop :=
  ∀ σ : ℝ, EntireOrder.order f < (σ : EReal) →
    ∀ᶠ R : ℝ in atTop, EntireOrder.maxModulus f R ≤ Real.exp (R ^ σ)

/-- **FWD, conditional on the growth bound (sorry-free):**  `coefficientOrder f ≤ σ` whenever
`M_f(R) ≤ exp(R^σ)` eventually, for `σ > 0`.

This is the genuine forward analysis: the quantitative decay `log_norm_taylorCoeff_le`,
evaluated at the near-optimal radius `R = n^{1/σ}` (so `R^σ = n`, `log R = (log n)/σ`), gives
`−log‖aₙ‖ ≥ (n/σ)(log n − σ)`, hence the coefficient quotient
`n·log n / (−log‖aₙ‖) ≤ σ·log n/(log n − σ) = σ + σ²/(log n − σ) → σ`; the `limsup` is then
`≤ σ` by comparison with this convergent upper bound (same EReal pattern as
`EntireOrder.order_polynomial_eq_zero`).  Coefficients with `aₙ = 0` contribute the junk
value `0 ≤ σ` and are harmless. -/
theorem coefficientOrder_le_of_maxModulus_growth {f : ℂ → ℂ} (hf : Differentiable ℂ f)
    {σ : ℝ} (hσ : 0 < σ)
    (hgrow : ∀ᶠ R : ℝ in atTop, EntireOrder.maxModulus f R ≤ Real.exp (R ^ σ)) :
    coefficientOrder f ≤ (σ : EReal) := by
  obtain ⟨R₀, hR₀⟩ := eventually_atTop.mp hgrow
  set term : ℕ → ℝ :=
    fun n => (n : ℝ) * Real.log n / (- Real.log ‖taylorCoeff f n‖) with hterm_def
  set upper : ℕ → ℝ := fun n => σ + σ ^ 2 / (Real.log n - σ) with hupper_def
  -- `log ↑n → ∞`, and `n^{1/σ} → ∞`.
  have hlogtop : Tendsto (fun n : ℕ => Real.log n) atTop atTop :=
    Real.tendsto_log_atTop.comp tendsto_natCast_atTop_atTop
  have hRtop : Tendsto (fun n : ℕ => (n : ℝ) ^ (1 / σ)) atTop atTop :=
    (tendsto_rpow_atTop (by positivity)).comp tendsto_natCast_atTop_atTop
  -- eventual comparison `term n ≤ upper n`.
  have hev : ∀ᶠ n : ℕ in atTop, term n ≤ upper n := by
    filter_upwards [eventually_ge_atTop 1, hlogtop.eventually_gt_atTop σ,
      hRtop.eventually_ge_atTop R₀] with n hn1 hlogn hRnge
    have hnpos : (0 : ℝ) < n := by exact_mod_cast Nat.lt_of_lt_of_le Nat.zero_lt_one hn1
    have hnne : (n : ℝ) ≠ 0 := ne_of_gt hnpos
    set L : ℝ := Real.log n with hL
    have hD : 0 < L - σ := by simpa [hL] using sub_pos.mpr hlogn
    have hDne : L - σ ≠ 0 := ne_of_gt hD
    have hLpos : 0 < L := lt_trans hσ hlogn
    -- the radius `R = n^{1/σ}` and its rpow/log values
    set R : ℝ := (n : ℝ) ^ (1 / σ) with hR
    have hRpos : 0 < R := Real.rpow_pos_of_pos hnpos _
    have hRσ : R ^ σ = (n : ℝ) := by
      rw [hR, ← Real.rpow_mul hnpos.le, one_div, inv_mul_cancel₀ hσ.ne', Real.rpow_one]
    have hlogR : Real.log R = (1 / σ) * L := by
      rw [hR, Real.log_rpow hnpos, hL]
    -- `upper n = σ·L/(L−σ)`  (the target of the quotient bound)
    have hupper_eq : upper n = σ * L / (L - σ) := by
      rw [hupper_def]
      field_simp
      ring
    rcases eq_or_ne (taylorCoeff f n) 0 with h0 | hne
    · -- `aₙ = 0` : `term n = 0 ≤ upper n`
      have hterm0 : term n = 0 := by
        rw [hterm_def]; simp [h0, Real.log_zero]
      rw [hterm0, hupper_eq]
      positivity
    · -- `aₙ ≠ 0` : use the quantitative decay bound at `R = n^{1/σ}`
      have hlog := log_norm_taylorCoeff_le hf hRpos (hR₀ R hRnge) hne
      rw [hRσ, hlogR] at hlog
      -- `log‖aₙ‖ ≤ n − (n/σ)·L`, i.e. `−log‖aₙ‖ ≥ (n/σ)(L−σ) =: c > 0`
      have hσne : σ ≠ 0 := hσ.ne'
      set c : ℝ := (n / σ) * (L - σ) with hc
      have hcpos : 0 < c := by rw [hc]; positivity
      have hceq : c = (n : ℝ) * (1 / σ * L) - n := by rw [hc]; field_simp; ring
      have hble : c ≤ - Real.log ‖taylorCoeff f n‖ := by rw [hceq]; linarith [hlog]
      have hnum : 0 ≤ (n : ℝ) * L := by positivity
      have hstep : term n ≤ (n : ℝ) * L / c :=
        div_le_div_of_nonneg_left hnum hcpos hble
      have hcancel : (n : ℝ) * L / c = σ * L / (L - σ) := by
        rw [hc]; field_simp; ring
      rw [hupper_eq]
      exact hstep.trans_eq hcancel
  -- `upper → σ`, hence `limsup (coe∘term) ≤ limsup (coe∘upper) = σ`.
  have hupper_lim : Tendsto upper atTop (𝓝 σ) := by
    have hden : Tendsto (fun n : ℕ => Real.log n - σ) atTop atTop := by
      simpa [sub_eq_add_neg] using tendsto_atTop_add_const_right atTop (-σ) hlogtop
    have h0 : Tendsto (fun n : ℕ => σ ^ 2 / (Real.log n - σ)) atTop (𝓝 0) :=
      tendsto_const_nhds.div_atTop hden
    simpa [hupper_def] using tendsto_const_nhds.add h0
  have hcoe_upper : Tendsto (fun n : ℕ => ((upper n : ℝ) : EReal)) atTop (𝓝 ((σ : ℝ) : EReal)) :=
    (continuous_coe_real_ereal.tendsto σ).comp hupper_lim
  have hlim_upper : limsup (fun n : ℕ => ((upper n : ℝ) : EReal)) atTop = (σ : EReal) :=
    hcoe_upper.limsup_eq
  have hev' : (fun n : ℕ => ((term n : ℝ) : EReal)) ≤ᶠ[atTop]
      (fun n => ((upper n : ℝ) : EReal)) := by
    filter_upwards [hev] with n hn
    exact_mod_cast hn
  calc coefficientOrder f
      = limsup (fun n : ℕ => ((term n : ℝ) : EReal)) atTop := rfl
    _ ≤ limsup (fun n : ℕ => ((upper n : ℝ) : EReal)) atTop :=
        limsup_le_limsup hev' isCobounded_le_of_bot isBounded_le_of_top
    _ = (σ : EReal) := hlim_upper

/-- **FWD inequality `ρ_coeff ≤ ρ_M`, modulo the one named unwinding input.**  Given the
translation `MaxModulusGrowthFromOrder f` (order `< σ` ⟹ growth bound `exp(R^σ)`), the
coefficient order is `≤` the max-modulus order.

Proof: for every real `σ` with `ρ_M < σ` (so necessarily `σ > 0`, as `ρ_M ≥ 0`), the growth
input feeds `coefficientOrder_le_of_maxModulus_growth` to give `ρ_coeff ≤ σ`; taking the
infimum over such `σ` (i.e. `le_of_forall_lt`-style on `EReal`) yields `ρ_coeff ≤ ρ_M`.  Only
the `EReal` "≤ of all upper reals" step and `σ > 0` extraction are used; sorry-free given the
hypothesis. -/
theorem coefficientOrder_le_order {f : ℂ → ℂ} (hf : Differentiable ℂ f)
    (hgrow : MaxModulusGrowthFromOrder f) :
    coefficientOrder f ≤ EntireOrder.order f := by
  -- It suffices to show `coefficientOrder f ≤ c` for every EReal `c > ρ_M`.
  refine le_of_forall_gt_imp_ge_of_dense fun c hc => ?_
  -- `hc : order f < c`; pick a real `σ` strictly between (density of ℝ in EReal).
  obtain ⟨σ, hσ1, hσ2⟩ := EReal.lt_iff_exists_real_btwn.mp hc
  have hσpos : 0 < σ := by
    have h0 : (0 : EReal) ≤ EntireOrder.order f := EntireOrder.order_nonneg f
    have : (0 : EReal) < (σ : EReal) := lt_of_le_of_lt h0 hσ1
    exact_mod_cast this
  exact (coefficientOrder_le_of_maxModulus_growth hf hσpos (hgrow σ hσ1)).trans hσ2.le

/-! ## Axiom audit — must be `[propext, Classical.choice, Quot.sound]` (no `sorryAx`) -/
#print axioms norm_taylorCoeff_mul_pow_le_maxModulus
#print axioms maxModulus_le_tsum_coeff
#print axioms taylorCoeff_maxModulus_sandwich
#print axioms log_norm_taylorCoeff_le
#print axioms coefficientOrder_le_of_maxModulus_growth
#print axioms coefficientOrder_le_order

end EntireOrderEquiv
