/-
Eq48LemmaA.lean  (2026-11-16, slug b-lean-eq48)

Lemma A of tmp/research-2026-11-16/eq48/RESULT.md for Mathlib's Riemann xi function, in the
asymptotic form needed by `Eq48Generic`:

  `XiLow`  : `Lxi(y) >= 1` for all large `y`,
  `XiGrow` : `Lxi(y)/y -> 0`.

Inputs from Mathlib: log-convexity of the real Gamma function (Bohr-Mollerup file), the identity
`-zeta'/zeta = L(Lambda, s)` on `Re s > 1`, and `Lambda >= 0` only through the absolute
convergence bound `|zeta'/zeta(s)| <= sum Lambda(n) n^{-2}` for `Re s >= 2`.

Consequence (`xi_theorem2`): Theorem 2 (a) <=> (b) for the Riemann xi function with NO hypotheses.
-/
import Mathlib
import Eq48Pick
import Eq48Generic
import Eq48Xi

open Complex Filter Topology

namespace Eq48

/-- Convexity bounds for the real digamma function: `log (u-1) <= Gamma'(u)/Gamma(u) <= log u`. -/
lemma real_digamma_bounds {u : ℝ} (hu : 1 < u) :
    Real.log (u - 1) ≤ deriv Real.Gamma u / Real.Gamma u ∧
      deriv Real.Gamma u / Real.Gamma u ≤ Real.log u := by
  have hc : ConvexOn ℝ (Set.Ioi 0) (Real.log ∘ Real.Gamma) := Real.convexOn_log_Gamma
  have h_rec : ∀ x : ℝ, 0 < x →
      (Real.log ∘ Real.Gamma) (x + 1) = (Real.log ∘ Real.Gamma) x + Real.log x := by
    intro x hx
    simp only [Function.comp_apply, Real.Gamma_add_one hx.ne',
      Real.log_mul hx.ne' (Real.Gamma_pos_of_pos hx).ne', add_comm]
  have hu0 : 0 < u := by linarith
  have hdG : DifferentiableAt ℝ Real.Gamma u :=
    Real.differentiableAt_Gamma (fun m => ne_of_gt (by
      have : (0 : ℝ) ≤ m := Nat.cast_nonneg m
      linarith))
  have hd : HasDerivAt (Real.log ∘ Real.Gamma) (deriv Real.Gamma u / Real.Gamma u) u :=
    hdG.hasDerivAt.log (Real.Gamma_pos_of_pos hu0).ne'
  constructor
  · have h1 := hc.slope_le_of_hasDerivAt (x := u - 1) (y := u)
      (Set.mem_Ioi.2 (by linarith)) (Set.mem_Ioi.2 hu0) (by linarith) hd
    rw [slope_def_field] at h1
    have e : (Real.log ∘ Real.Gamma) u = (Real.log ∘ Real.Gamma) (u - 1) + Real.log (u - 1) := by
      have := h_rec (u - 1) (by linarith)
      rwa [sub_add_cancel] at this
    have e2 : u - (u - 1) = 1 := by ring
    rw [e, e2, div_one, add_sub_cancel_left] at h1
    exact h1
  · have h1 := hc.le_slope_of_hasDerivAt (x := u) (y := u + 1)
      (Set.mem_Ioi.2 hu0) (Set.mem_Ioi.2 (by linarith)) (by linarith) hd
    have e2 : u + 1 - u = 1 := by ring
    rw [slope_def_field, h_rec u hu0, e2, div_one, add_sub_cancel_left] at h1
    exact h1

/-- At a positive real point, the real part of the complex digamma is the real digamma. -/
lemma re_logDeriv_Gamma {u : ℝ} (hu : 0 < u) :
    (logDeriv Complex.Gamma (u : ℂ)).re = deriv Real.Gamma u / Real.Gamma u := by
  have hd : DifferentiableAt ℂ Complex.Gamma (u : ℂ) :=
    Complex.differentiableAt_Gamma _ (fun m h => by
      have h' := congrArg Complex.re h
      simp at h'
      have : (0 : ℝ) ≤ m := Nat.cast_nonneg m
      linarith)
  have h1 : HasDerivAt (fun x : ℝ => (Complex.Gamma x).re) (deriv Complex.Gamma u).re u :=
    hd.hasDerivAt.real_of_complex
  have h2 : deriv Real.Gamma u = (deriv Complex.Gamma u).re := by
    have e : (fun x : ℝ => (Complex.Gamma x).re) = Real.Gamma := by
      funext x; rfl
    rw [e] at h1
    exact h1.deriv
  rw [logDeriv_apply, h2, Complex.Gamma_ofReal]
  exact Complex.div_ofReal_re _ _

/-- The constant `sum_n Lambda(n) n^{-2}`. -/
noncomputable def CΛ : ℝ :=
  ∑' n, ‖LSeries.term (fun n => (ArithmeticFunction.vonMangoldt n : ℂ)) 2 n‖

lemma CΛ_nonneg : 0 ≤ CΛ := tsum_nonneg fun _ => norm_nonneg _

/-- `|zeta'/zeta(s)| <= sum Lambda(n) n^{-2}` for `Re s >= 2`. -/
lemma norm_logDeriv_zeta_le {s : ℂ} (hs : 2 ≤ s.re) : ‖logDeriv riemannZeta s‖ ≤ CΛ := by
  have hs1 : 1 < s.re := by linarith
  have h := ArithmeticFunction.LSeries_vonMangoldt_eq_deriv_riemannZeta_div hs1
  have e : logDeriv riemannZeta s =
      -LSeries (fun n => (ArithmeticFunction.vonMangoldt n : ℂ)) s := by
    rw [h, logDeriv_apply]; ring
  rw [e, norm_neg, LSeries]
  have hsum2 : Summable fun n =>
      ‖LSeries.term (fun n => (ArithmeticFunction.vonMangoldt n : ℂ)) 2 n‖ :=
    (ArithmeticFunction.LSeriesSummable_vonMangoldt (s := 2) (by norm_num)).norm
  have hsums : Summable fun n =>
      ‖LSeries.term (fun n => (ArithmeticFunction.vonMangoldt n : ℂ)) s n‖ :=
    (ArithmeticFunction.LSeriesSummable_vonMangoldt hs1).norm
  refine (norm_tsum_le_tsum_norm hsums).trans ?_
  exact Summable.tsum_le_tsum
    (fun n => LSeries.norm_term_le_of_re_le_re _ (by simpa using hs) n) hsums hsum2

/-- Field algebra for the logarithmic derivative of a four-factor product. -/
lemma logDeriv_algebra (s w P Gm dG Z dZ lp : ℂ) (hs0 : s ≠ 0) (hw : w ≠ 0) (hPne : P ≠ 0)
    (hGne : Gm ≠ 0) (hζne : Z ≠ 0) :
    (((1 * w + s * 1) / 2 * (P * Gm) +
          s * w / 2 * (P * lp * (-1 / 2) * Gm + P * (dG * (1 / 2)))) * Z +
      (s * w / 2 * (P * Gm)) * dZ) / (s * w / 2 * (P * Gm) * Z) =
    (w + s) / (s * w) - lp / 2 + dG / Gm / 2 + dZ / Z := by
  have hden : s * w / 2 * (P * Gm) * Z ≠ 0 :=
    mul_ne_zero (mul_ne_zero (div_ne_zero (mul_ne_zero hs0 hw) two_ne_zero)
      (mul_ne_zero hPne hGne)) hζne
  have e1 : (w + s) / (s * w) * (s * w / 2 * (P * Gm) * Z) = (w + s) / 2 * (P * Gm) * Z := by
    rw [div_mul_eq_mul_div, div_eq_iff (mul_ne_zero hs0 hw)]; ring
  have e2 : dG / Gm / 2 * (s * w / 2 * (P * Gm) * Z) = s * w / 2 * P * Z * dG / 2 := by
    rw [div_div, div_mul_eq_mul_div, div_eq_iff (mul_ne_zero hGne two_ne_zero)]; ring
  have e3 : dZ / Z * (s * w / 2 * (P * Gm) * Z) = s * w / 2 * (P * Gm) * dZ := by
    rw [div_mul_eq_mul_div, div_eq_iff hζne]; ring
  have h : ((w + s) / (s * w) - lp / 2 + dG / Gm / 2 + dZ / Z) * (s * w / 2 * (P * Gm) * Z) =
      (w + s) / 2 * (P * Gm) * Z - lp / 2 * (s * w / 2 * (P * Gm) * Z) +
        s * w / 2 * P * Z * dG / 2 + s * w / 2 * (P * Gm) * dZ := by
    rw [← e1, ← e2, ← e3]; ring
  rw [div_eq_iff hden, h]
  ring

/-- Decomposition of `xi'/xi` on `Re s > 1`. -/
lemma logDeriv_xi_eq {s : ℂ} (hs : 1 < s.re) :
    logDeriv xi s = (2 * s - 1) / (s * (s - 1)) - (Real.log Real.pi : ℂ) / 2 +
      logDeriv Complex.Gamma (s / 2) / 2 + logDeriv riemannZeta s := by
  have hs0 : s ≠ 0 := by
    rintro rfl
    simp at hs
    linarith
  have hs1 : s ≠ 1 := by
    rintro rfl
    simp at hs
  have hs1' : s - 1 ≠ 0 := sub_ne_zero.2 hs1
  have hπ : (Real.pi : ℂ) ≠ 0 := ofReal_ne_zero.2 Real.pi_ne_zero
  -- local product formula
  let g : ℂ → ℂ := fun z =>
    z * (z - 1) / 2 * ((Real.pi : ℂ) ^ (-z / 2) * Complex.Gamma (z / 2)) * riemannZeta z
  have hev : xi =ᶠ[𝓝 s] g := by
    filter_upwards [isOpen_halfPlane.mem_nhds hs] with z hz
    have hz' : 1 < z.re := hz
    have hz0 : z ≠ 0 := by
      rintro rfl
      simp at hz'
      linarith
    have hG : Gammaℝ z ≠ 0 := Gammaℝ_ne_zero_of_re_pos (by linarith)
    have hζ := riemannZeta_def_of_ne_zero hz0
    have : completedRiemannZeta z = Gammaℝ z * riemannZeta z := by
      rw [hζ]; field_simp
    simp only [xi, g, this, Gammaℝ_def]
    ring
  have hlog : logDeriv xi s = deriv g s / g s := by
    rw [logDeriv_apply, hev.deriv_eq, hev.self_of_nhds]
  -- derivatives of the factors
  have hGne : Complex.Gamma (s / 2) ≠ 0 := by
    refine Complex.Gamma_ne_zero_of_re_pos ?_
    simp
    linarith
  have hGd : DifferentiableAt ℂ Complex.Gamma (s / 2) :=
    Complex.differentiableAt_Gamma _ (fun m h => by
      have h' := congrArg Complex.re h
      simp at h'
      have : (0 : ℝ) ≤ m := Nat.cast_nonneg m
      linarith)
  have hζne : riemannZeta s ≠ 0 := riemannZeta_ne_zero_of_one_lt_re hs
  have hζd : HasDerivAt riemannZeta (deriv riemannZeta s) s :=
    (differentiableAt_riemannZeta hs1).hasDerivAt
  have h1 : HasDerivAt (fun z : ℂ => z * (z - 1) / 2) ((1 * (s - 1) + s * 1) / 2) s :=
    ((hasDerivAt_id s).mul ((hasDerivAt_id s).sub_const 1)).div_const 2
  have h2 : HasDerivAt (fun z : ℂ => (Real.pi : ℂ) ^ (-z / 2))
      ((Real.pi : ℂ) ^ (-s / 2) * Complex.log (Real.pi : ℂ) * (-1 / 2)) s :=
    (((hasDerivAt_id s).neg).div_const 2).const_cpow (Or.inl hπ)
  have h3 : HasDerivAt (fun z : ℂ => Complex.Gamma (z / 2))
      (deriv Complex.Gamma (s / 2) * (1 / 2)) s :=
    HasDerivAt.comp s hGd.hasDerivAt ((hasDerivAt_id s).div_const 2)
  have hg : HasDerivAt g _ s := (h1.mul (h2.mul h3)).mul hζd
  have hPne : (Real.pi : ℂ) ^ (-s / 2) ≠ 0 := by
    rw [Complex.cpow_def_of_ne_zero hπ]
    exact Complex.exp_ne_zero _
  have hlogπ : Complex.log (Real.pi : ℂ) = (Real.log Real.pi : ℂ) :=
    (Complex.ofReal_log Real.pi_pos.le).symm
  rw [hlog, hg.deriv, logDeriv_apply, logDeriv_apply, ← hlogπ]
  simp only [g, Pi.mul_apply]
  have key := logDeriv_algebra s (s - 1) ((Real.pi : ℂ) ^ (-s / 2)) (Complex.Gamma (s / 2))
    (deriv Complex.Gamma (s / 2)) (riemannZeta s) (deriv riemannZeta s)
    (Complex.log (Real.pi : ℂ)) hs0 hs1' hPne hGne hζne
  have e : (2 * s - 1) / (s * (s - 1)) = (s - 1 + s) / (s * (s - 1)) := by ring
  rw [e]
  exact key

/-- Two-sided bound for `Lxi` at `x >= 4`:
`log(x/2 - 3/4)/2 - (log pi)/2 - C <= Lxi x <= 2 - (log pi)/2 + log(x/2 + 1/4)/2 + C`. -/
lemma Lxi_bounds {x : ℝ} (hx : 4 ≤ x) :
    Real.log (x / 2 - 3 / 4) / 2 - Real.log Real.pi / 2 - CΛ ≤ Lxi x ∧
      Lxi x ≤ 2 - Real.log Real.pi / 2 + Real.log (x / 2 + 1 / 4) / 2 + CΛ := by
  set σ : ℝ := 1 / 2 + x with hσ
  have hσ2 : 2 ≤ σ := by rw [hσ]; linarith
  have hcast : (1 / 2 : ℂ) + (x : ℂ) = ((σ : ℝ) : ℂ) := by
    rw [hσ]; push_cast; ring
  have hre : 1 < ((σ : ℝ) : ℂ).re := by simp; linarith
  have hdec := logDeriv_xi_eq hre
  have hT1 : (2 * (σ : ℂ) - 1) / ((σ : ℂ) * ((σ : ℂ) - 1)) =
      (((2 * σ - 1) / (σ * (σ - 1)) : ℝ) : ℂ) := by
    push_cast; ring
  have hhalf : (σ : ℂ) / 2 = ((σ / 2 : ℝ) : ℂ) := by push_cast; ring
  have hψ := re_logDeriv_Gamma (u := σ / 2) (by linarith)
  have hz := norm_logDeriv_zeta_le (s := ((σ : ℝ) : ℂ)) (by simpa using hσ2)
  have hzre := Complex.abs_re_le_norm (logDeriv riemannZeta ((σ : ℝ) : ℂ))
  have hzb := abs_le.1 (hzre.trans hz)
  have hval : Lxi x = (2 * σ - 1) / (σ * (σ - 1)) - Real.log Real.pi / 2 +
      (deriv Real.Gamma (σ / 2) / Real.Gamma (σ / 2)) / 2 +
        (logDeriv riemannZeta ((σ : ℝ) : ℂ)).re := by
    simp only [Lxi]
    rw [hcast, hdec, hT1, hhalf]
    have e1 : (logDeriv Complex.Gamma ((σ / 2 : ℝ) : ℂ) / 2).re =
        (logDeriv Complex.Gamma ((σ / 2 : ℝ) : ℂ)).re / 2 := by
      have : (2 : ℂ) = ((2 : ℝ) : ℂ) := by norm_num
      rw [this, Complex.div_ofReal_re]
    have e2 : ((Real.log Real.pi : ℂ) / 2).re = Real.log Real.pi / 2 := by
      have : (2 : ℂ) = ((2 : ℝ) : ℂ) := by norm_num
      rw [this, Complex.div_ofReal_re, Complex.ofReal_re]
    simp only [Complex.add_re, Complex.sub_re, Complex.ofReal_re, e1, e2, hψ]
  obtain ⟨hlo, hhi⟩ := real_digamma_bounds (u := σ / 2) (by linarith)
  have hT1lo : 0 ≤ (2 * σ - 1) / (σ * (σ - 1)) := by
    apply div_nonneg <;> nlinarith
  have hT1hi : (2 * σ - 1) / (σ * (σ - 1)) ≤ 2 := by
    rw [div_le_iff₀ (by nlinarith)]
    nlinarith
  have ea : σ / 2 - 1 = x / 2 - 3 / 4 := by rw [hσ]; ring
  have eb : σ / 2 = x / 2 + 1 / 4 := by rw [hσ]; ring
  rw [ea] at hlo
  rw [eb] at hhi hlo
  rw [hval, eb]
  constructor <;> linarith [hzb.1, hzb.2]

/-- **Lemma A (lower bound), proved.** -/
theorem xiLow : XiLow := by
  refine ⟨1, one_pos, ?_⟩
  set M : ℝ := 2 * (1 + Real.log Real.pi / 2 + CΛ) with hM
  filter_upwards [eventually_ge_atTop (max 4 (2 * Real.exp M + 2))] with x hx
  have hx4 : 4 ≤ x := le_trans (le_max_left _ _) hx
  have hxM : 2 * Real.exp M + 2 ≤ x := le_trans (le_max_right _ _) hx
  have hlog : M ≤ Real.log (x / 2 - 3 / 4) := by
    rw [Real.le_log_iff_exp_le (by linarith)]
    linarith
  have := (Lxi_bounds hx4).1
  rw [hM] at hlog
  linarith

/-- **Lemma A (growth), proved.** -/
theorem xiGrow : XiGrow := by
  unfold XiGrow
  set K1 : ℝ := Real.log Real.pi / 2 + CΛ with hK1
  set K2 : ℝ := 2 - Real.log Real.pi / 2 + CΛ with hK2
  have hlog0 : Tendsto (fun x : ℝ => Real.log x / x) atTop (𝓝 0) := by
    have := Real.tendsto_pow_log_div_mul_add_atTop 1 0 1 one_ne_zero
    simpa using this
  have hlow : Tendsto (fun x : ℝ => -K1 / x) atTop (𝓝 0) :=
    tendsto_const_nhds.div_atTop tendsto_id
  have hupp : Tendsto (fun x : ℝ => K2 / x + (Real.log x / x) / 2) atTop (𝓝 0) := by
    have h1 : Tendsto (fun x : ℝ => K2 / x) atTop (𝓝 0) :=
      tendsto_const_nhds.div_atTop tendsto_id
    have := h1.add (hlog0.div_const 2)
    simpa using this
  refine tendsto_of_tendsto_of_tendsto_of_le_of_le' hlow hupp ?_ ?_
  · filter_upwards [eventually_ge_atTop (4 : ℝ)] with x hx
    have hx0 : 0 < x := by linarith
    have h := (Lxi_bounds hx).1
    have hl : 0 ≤ Real.log (x / 2 - 3 / 4) := Real.log_nonneg (by linarith)
    rw [div_le_div_iff_of_pos_right hx0]
    rw [hK1]; linarith
  · filter_upwards [eventually_ge_atTop (4 : ℝ)] with x hx
    have hx0 : 0 < x := by linarith
    have h := (Lxi_bounds hx).2
    have hl : Real.log (x / 2 + 1 / 4) ≤ Real.log x :=
      Real.log_le_log (by linarith) (by linarith)
    have : K2 / x + (Real.log x / x) / 2 = (K2 + Real.log x / 2) / x := by
      field_simp
      ring
    rw [this, div_le_div_iff_of_pos_right hx0, hK2]
    linarith

/-- **Theorem 2, (a) <=> (b), for the Riemann xi function: no hypotheses.**
The residual target at every order (Schur defects `>= 0` whenever the smaller Pick matrix is
PD) is equivalent to positive semidefiniteness of every real-node Pick matrix of
`L = xi'/xi(1/2 + .)` at nodes `> 1/2`. -/
theorem xi_theorem2 :
    ResidualTarget Lxi (Set.Ioi (1 / 2)) ↔ FullClass Lxi (Set.Ioi (1 / 2)) :=
  xi_residualTarget_iff_fullClass xiLow xiGrow

end Eq48
