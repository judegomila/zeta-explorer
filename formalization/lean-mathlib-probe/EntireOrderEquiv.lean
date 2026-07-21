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

  * `[named input FWD]`  ρ_coeff ≤ ρ_M.  From the LEFT bound, optimize `R` in
    `‖aₙ‖ ≤ M_f(R)/Rⁿ`.  If `ρ_M < σ` then `M_f(R) ≤ exp(R^σ)` eventually (unwinding the
    double-`log⁺` order definition), so `‖aₙ‖ ≤ inf_R exp(R^σ)/Rⁿ`, attained near
    `R = (n/σ)^{1/σ}`, giving `-log‖aₙ‖ ≥ (n/σ)(log(n/σ) − 1)` and hence
    `(n log n)/(−log‖aₙ‖) → σ`.  Needs: (i) the EReal→real unwinding of `order` into the
    pointwise growth bound; (ii) the real-analysis limit of the optimized quotient.

  * `[named input REV]`  ρ_M ≤ ρ_coeff.  From the RIGHT bound `M_f(R) ≤ Σ‖aₙ‖Rⁿ` (proved
    here).  If `ρ_coeff < σ` then `‖aₙ‖ ≤ n^{−n/σ}` eventually, and the tail sum
    `Σ n^{−n/σ} Rⁿ` is bounded by `exp(c·R^σ)` (split the sum at `n ≈ (2R)^σ`; the head is
    `≤ (#terms)·max term`, the tail is geometric), giving `log⁺log⁺ M_f(R)/log R ≤ σ`.
    Needs: the head/tail split estimate on `Σ n^{−n/σ}Rⁿ` and its `log log`-asymptotics.

  These are stated with full precision so a follow-up can discharge them as named lemmas; they
  are deliberately NOT introduced as bare `sorry`s masquerading as done (cf. the removed FALSE
  `heatFlow_continuous` axiom — honesty over apparent completeness).
-/
import EntireOrder
import EntireCauchy
import Mathlib.Analysis.Complex.TaylorSeries
import Mathlib.Analysis.Normed.Module.FiniteDimension
import Mathlib.Analysis.Normed.Group.InfiniteSum

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

/-! ## Axiom audit — sorry-free workhorses (must be `[propext, Classical.choice, Quot.sound]`) -/
#print axioms norm_taylorCoeff_mul_pow_le_maxModulus
#print axioms maxModulus_le_tsum_coeff
#print axioms taylorCoeff_maxModulus_sandwich

end EntireOrderEquiv
