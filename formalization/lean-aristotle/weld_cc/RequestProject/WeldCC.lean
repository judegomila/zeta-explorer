import RequestProject.LayerCake

/-!
# Weld chain (imp-95008), Lemma CC: separation monotonicity of the envelope-pair correlation

Fix a real exponent `s`.  The `MAJ(σ,θ)` envelopes are

  `eᵢ u = Aᵢ * (1 + |u| / rᵢ) ^ (-s)`,  `Aᵢ > 0`, `rᵢ > 0`,

and at fixed widths the envelope-pair correlation at separation `Δ` is

  `h Δ = ∫ e₁ u * e₂ (u - Δ) du`.

**Lemma CC.** `h` is even and nonincreasing in `|Δ|`, for all `Δ`
(`WeldCC.envCorr_even`, `WeldCC.envCorr_antitone`, `WeldCC.envCorr_antitone_abs`).

**Corollary.** At fixed `ρ ∈ (0,1]`, `T ↦ I T ρ` is nonincreasing on `[0, ∞)`, where

  `I T ρ = ρ ^ (-1/2) * ∫ (1 + |u|/ρ) ^ (-s) * (1 + |u - T|) ^ (-s) du`

(`WeldCC.pairCorr_antitone`).

The proof is the layer-cake argument of the source: each envelope is even and unimodal,
so its super-level sets are symmetric intervals, and Tonelli turns `h Δ` into a double
integral of the overlap length of two symmetric intervals with half-lengths `a`, `b` and
center distance `Δ`, namely `max (0, min (2a, 2b, a + b - Δ))`, which is nonincreasing in `Δ`.

*Modelling note.*  The envelopes are written with their centers at the origin, so that `Δ` is
exactly the center distance of the two envelopes (as in the source proof, which speaks of
"two intervals with fixed half-lengths `(a,b)` and center distance `Δ`").  For envelopes
centered at `u₁` and `u₂` the correlation is the present `h` evaluated at `Δ + u₂ - u₁`, by
translation invariance of Lebesgue measure; it is even about `u₁ - u₂` rather than about `0`.

*Flagged added hypothesis* (as in the source document): the layer-cake proof of the
Bochner-integral statement needs `e₁ * e₂ ∈ L¹`, so `1/2 < s` is assumed explicitly
(the reference value `s = 11` satisfies it comfortably).  No such hypothesis is needed for
the Lebesgue-integral form `WeldCC.lcorr_antitone`.
-/

open MeasureTheory Set
open scoped ENNReal

namespace WeldCC

/-- The `MAJ(σ,θ)` envelope `A * (1 + |u| / r) ^ (-s)`, centered at the origin. -/
noncomputable def envelope (A r s : ℝ) (u : ℝ) : ℝ := A * (1 + |u| / r) ^ (-s)

/-- The envelope-pair correlation at separation `Δ`:
`h Δ = ∫ e₁ u * e₂ (u - Δ) du`. -/
noncomputable def envCorr (A₁ r₁ A₂ r₂ s : ℝ) (Δ : ℝ) : ℝ :=
  ∫ u, envelope A₁ r₁ s u * envelope A₂ r₂ s (u - Δ)

/-- The normalized exact pair correlation
`I T ρ = ρ ^ (-1/2) * ∫ (1 + |u|/ρ) ^ (-s) * (1 + |u - T|) ^ (-s) du`. -/
noncomputable def pairCorr (s ρ T : ℝ) : ℝ :=
  ρ ^ (-(1:ℝ)/2) * ∫ u, (1 + |u| / ρ) ^ (-s) * (1 + |u - T|) ^ (-s)

section EnvelopeBasics

variable {A r s : ℝ}

lemma envelope_nonneg (hA : 0 ≤ A) (hr : 0 < r) (u : ℝ) : 0 ≤ envelope A r s u := by
  have hb : (0:ℝ) < 1 + |u| / r := by positivity
  exact mul_nonneg hA (Real.rpow_nonneg hb.le _)

lemma envelope_continuous (hr : 0 < r) : Continuous (envelope A r s) := by
  apply Continuous.mul continuous_const
  apply Continuous.rpow_const
  · fun_prop
  · intro x
    left
    have : (0:ℝ) < 1 + |x| / r := by positivity
    linarith

lemma envelope_measurable (hr : 0 < r) : Measurable (envelope A r s) :=
  (envelope_continuous hr).measurable

/-- Envelopes are even: they only depend on `|u|`. -/
lemma envelope_neg (u : ℝ) : envelope A r s (-u) = envelope A r s u := by
  rw [envelope, envelope, abs_neg]

/-- Envelopes are even and unimodal about their center. -/
lemma envelope_symmUnimodal (hA : 0 ≤ A) (hr : 0 < r) (hs : 0 ≤ s) :
    SymmUnimodal (envelope A r s) := by
  intro x y hxy
  have hx : (1:ℝ) ≤ 1 + |x| / r := by
    have : 0 ≤ |x| / r := by positivity
    linarith
  have hle : 1 + |x| / r ≤ 1 + |y| / r := by gcongr
  refine mul_le_mul_of_nonneg_left ?_ hA
  rw [Real.rpow_neg (by linarith), Real.rpow_neg (by linarith)]
  exact inv_anti₀ (Real.rpow_pos_of_pos (by linarith) s) (Real.rpow_le_rpow (by linarith) hle hs)

/-- Square-integrability of an envelope: this is where `1/2 < s` is used. -/
lemma envelope_sq_integrable (hr : 0 < r) (hs : 1 / 2 < s) :
    Integrable (fun u : ℝ => envelope A r s u ^ 2) := by
  have key : Integrable (fun x : ℝ => (1 + ‖x‖) ^ (-(2 * s))) := by
    apply integrable_one_add_norm
    simp
    linarith
  have key2 : Integrable (fun u : ℝ => (1 + ‖(1 / r) * u‖) ^ (-(2 * s))) :=
    (integrable_comp_mul_left_iff _ (by positivity : (1 / r) ≠ 0)).mpr key
  have heq : ∀ u : ℝ, envelope A r s u ^ 2 = A ^ 2 * (1 + ‖(1 / r) * u‖) ^ (-(2 * s)) := by
    intro u
    have hb : (0:ℝ) < 1 + |u| / r := by positivity
    have hn : ‖(1 / r) * u‖ = |u| / r := by
      rw [Real.norm_eq_abs, abs_mul, abs_of_pos (by positivity : (0:ℝ) < 1 / r)]
      ring
    rw [envelope, hn, mul_pow, ← Real.rpow_natCast ((1 + |u| / r) ^ (-s)) 2,
      ← Real.rpow_mul hb.le]
    ring_nf
  simp only [heq]
  exact key2.const_mul _

end EnvelopeBasics

/-- Integrability of the product of two (shifted) envelopes, under the flagged
hypothesis `1/2 < s`. -/
lemma envelope_mul_integrable {A₁ r₁ A₂ r₂ s : ℝ} (hA₁ : 0 ≤ A₁) (hA₂ : 0 ≤ A₂)
    (hr₁ : 0 < r₁) (hr₂ : 0 < r₂) (hs : 1 / 2 < s) (Δ : ℝ) :
    Integrable (fun u : ℝ => envelope A₁ r₁ s u * envelope A₂ r₂ s (u - Δ)) := by
  have i1 : Integrable (fun u : ℝ => envelope A₁ r₁ s u ^ 2) := envelope_sq_integrable hr₁ hs
  have i2 : Integrable (fun u : ℝ => envelope A₂ r₂ s (u - Δ) ^ 2) :=
    (envelope_sq_integrable (A := A₂) hr₂ hs).comp_sub_right Δ
  have ig : Integrable (fun u : ℝ =>
      (envelope A₁ r₁ s u ^ 2 + envelope A₂ r₂ s (u - Δ) ^ 2) / 2) := (i1.add i2).div_const 2
  refine Integrable.mono' ig ?_ ?_
  · exact (envelope_continuous hr₁).aestronglyMeasurable.mul
      (((envelope_continuous (A := A₂) hr₂).comp
        (continuous_id.sub continuous_const)).aestronglyMeasurable)
  · filter_upwards with u
    have h1 := envelope_nonneg (s := s) hA₁ hr₁ u
    have h2 := envelope_nonneg (s := s) hA₂ hr₂ (u - Δ)
    rw [Real.norm_eq_abs, abs_of_nonneg (mul_nonneg h1 h2)]
    nlinarith [sq_nonneg (envelope A₁ r₁ s u - envelope A₂ r₂ s (u - Δ))]

/-- The Bochner integral defining `envCorr` is the `toReal` of its Lebesgue-integral version. -/
lemma envCorr_eq_toReal {A₁ r₁ A₂ r₂ s : ℝ} (hA₁ : 0 ≤ A₁) (hA₂ : 0 ≤ A₂)
    (hr₁ : 0 < r₁) (hr₂ : 0 < r₂) (Δ : ℝ) :
    envCorr A₁ r₁ A₂ r₂ s Δ
      = (lcorr (envelope A₁ r₁ s) (envelope A₂ r₂ s) Δ).toReal := by
  have hmeas : AEStronglyMeasurable
      (fun u : ℝ => envelope A₁ r₁ s u * envelope A₂ r₂ s (u - Δ)) volume :=
    (envelope_continuous hr₁).aestronglyMeasurable.mul
      (((envelope_continuous (A := A₂) hr₂).comp
        (continuous_id.sub continuous_const)).aestronglyMeasurable)
  rw [envCorr, integral_eq_lintegral_of_nonneg_ae
    (Filter.Eventually.of_forall fun u =>
      mul_nonneg (envelope_nonneg (s := s) hA₁ hr₁ u)
        (envelope_nonneg (s := s) hA₂ hr₂ (u - Δ))) hmeas]
  congr 1
  refine lintegral_congr fun u => ?_
  rw [ENNReal.ofReal_mul (envelope_nonneg (s := s) hA₁ hr₁ u)]

lemma lcorr_envelope_ne_top {A₁ r₁ A₂ r₂ s : ℝ} (hA₁ : 0 ≤ A₁) (hA₂ : 0 ≤ A₂)
    (hr₁ : 0 < r₁) (hr₂ : 0 < r₂) (hs : 1 / 2 < s) (Δ : ℝ) :
    lcorr (envelope A₁ r₁ s) (envelope A₂ r₂ s) Δ ≠ ⊤ := by
  have hF := envelope_mul_integrable hA₁ hA₂ hr₁ hr₂ hs Δ
  have h0 : ∀ u : ℝ, 0 ≤ envelope A₁ r₁ s u * envelope A₂ r₂ s (u - Δ) := fun u =>
    mul_nonneg (envelope_nonneg (s := s) hA₁ hr₁ u) (envelope_nonneg (s := s) hA₂ hr₂ (u - Δ))
  have hfin := hF.hasFiniteIntegral
  rw [hasFiniteIntegral_iff_enorm] at hfin
  have heq : ∀ u : ℝ, ENNReal.ofReal (envelope A₁ r₁ s u) *
      ENNReal.ofReal (envelope A₂ r₂ s (u - Δ))
      = ‖envelope A₁ r₁ s u * envelope A₂ r₂ s (u - Δ)‖ₑ := by
    intro u
    rw [← ENNReal.ofReal_mul (envelope_nonneg (s := s) hA₁ hr₁ u), ← ofReal_norm_eq_enorm,
      Real.norm_eq_abs, abs_of_nonneg (h0 u)]
  rw [lcorr]
  simp only [heq]
  exact hfin.ne

/-- **Lemma CC, evenness.**  At fixed widths, `h Δ = ∫ e₁ u * e₂ (u - Δ) du` is even in `Δ`. -/
theorem envCorr_even (A₁ r₁ A₂ r₂ s : ℝ) (Δ : ℝ) :
    envCorr A₁ r₁ A₂ r₂ s (-Δ) = envCorr A₁ r₁ A₂ r₂ s Δ := by
  have := integral_neg_eq_self
    (fun u : ℝ => envelope A₁ r₁ s u * envelope A₂ r₂ s (u - Δ)) volume
  rw [envCorr, envCorr, ← this]
  refine integral_congr_ae (Filter.Eventually.of_forall fun u => ?_)
  show envelope A₁ r₁ s u * envelope A₂ r₂ s (u - -Δ)
      = envelope A₁ r₁ s (-u) * envelope A₂ r₂ s (-u - Δ)
  have h1 : (-u) - Δ = -(u + Δ) := by ring
  have h2 : u - -Δ = u + Δ := by ring
  rw [h2, envelope_neg, h1, envelope_neg]

/-- `h` at separation `|Δ|` agrees with `h` at separation `Δ`. -/
lemma envCorr_abs (A₁ r₁ A₂ r₂ s : ℝ) (Δ : ℝ) :
    envCorr A₁ r₁ A₂ r₂ s |Δ| = envCorr A₁ r₁ A₂ r₂ s Δ := by
  rcases abs_cases Δ with ⟨h, _⟩ | ⟨h, _⟩
  · rw [h]
  · rw [h, ← envCorr_even, neg_neg]

/-- **Lemma CC, separation monotonicity on `[0, ∞)`.**  At fixed widths,
`h Δ = ∫ e₁ u * e₂ (u - Δ) du` is nonincreasing for `Δ ≥ 0`. -/
theorem envCorr_antitone {A₁ r₁ A₂ r₂ s : ℝ} (hA₁ : 0 ≤ A₁) (hA₂ : 0 ≤ A₂)
    (hr₁ : 0 < r₁) (hr₂ : 0 < r₂) (hs : 1 / 2 < s)
    {Δ₁ Δ₂ : ℝ} (h0 : 0 ≤ Δ₁) (h12 : Δ₁ ≤ Δ₂) :
    envCorr A₁ r₁ A₂ r₂ s Δ₂ ≤ envCorr A₁ r₁ A₂ r₂ s Δ₁ := by
  have hs0 : (0:ℝ) ≤ s := by linarith
  rw [envCorr_eq_toReal hA₁ hA₂ hr₁ hr₂, envCorr_eq_toReal hA₁ hA₂ hr₁ hr₂]
  refine ENNReal.toReal_mono (lcorr_envelope_ne_top hA₁ hA₂ hr₁ hr₂ hs Δ₁) ?_
  exact lcorr_antitone (envelope_measurable hr₁) (envelope_measurable hr₂)
    (envelope_nonneg (s := s) hA₁ hr₁) (envelope_nonneg (s := s) hA₂ hr₂)
    (envelope_symmUnimodal hA₁ hr₁ hs0) (envelope_symmUnimodal hA₂ hr₂ hs0) h0 h12

/-- **Lemma CC (full form).**  At fixed widths, `h Δ = ∫ e₁ u * e₂ (u - Δ) du` is
nonincreasing in `|Δ|`, for all `Δ`. -/
theorem envCorr_antitone_abs {A₁ r₁ A₂ r₂ s : ℝ} (hA₁ : 0 ≤ A₁) (hA₂ : 0 ≤ A₂)
    (hr₁ : 0 < r₁) (hr₂ : 0 < r₂) (hs : 1 / 2 < s)
    {Δ₁ Δ₂ : ℝ} (h12 : |Δ₁| ≤ |Δ₂|) :
    envCorr A₁ r₁ A₂ r₂ s Δ₂ ≤ envCorr A₁ r₁ A₂ r₂ s Δ₁ := by
  rw [← envCorr_abs A₁ r₁ A₂ r₂ s Δ₁, ← envCorr_abs A₁ r₁ A₂ r₂ s Δ₂]
  exact envCorr_antitone hA₁ hA₂ hr₁ hr₂ hs (abs_nonneg Δ₁) h12

/-- `I T ρ` is the (normalized) envelope-pair correlation with `A₁ = A₂ = 1`,
`r₁ = ρ`, `r₂ = 1`. -/
lemma pairCorr_eq (s ρ T : ℝ) :
    pairCorr s ρ T = ρ ^ (-(1:ℝ)/2) * envCorr 1 ρ 1 1 s T := by
  rw [pairCorr, envCorr]
  congr 1
  refine integral_congr_ae (Filter.Eventually.of_forall fun u => ?_)
  simp [envelope]

/-- **Corollary.**  At fixed `ρ ∈ (0,1]`, the map `T ↦ I T ρ` is nonincreasing on `[0, ∞)`.
(The hypothesis `ρ ≤ 1` is part of the statement in the source document; the proof does
not need it.) -/
theorem pairCorr_antitone {s ρ : ℝ} (hρ : ρ ∈ Set.Ioc (0:ℝ) 1) (hs : 1 / 2 < s)
    {T₁ T₂ : ℝ} (h0 : 0 ≤ T₁) (h12 : T₁ ≤ T₂) :
    pairCorr s ρ T₂ ≤ pairCorr s ρ T₁ := by
  have hρ0 : 0 < ρ := hρ.1
  rw [pairCorr_eq, pairCorr_eq]
  have hpos : (0:ℝ) < ρ ^ (-(1:ℝ)/2) := Real.rpow_pos_of_pos hρ0 _
  exact mul_le_mul_of_nonneg_left
    (envCorr_antitone zero_le_one zero_le_one hρ0 one_pos hs h0 h12) hpos.le

/-- The reference parameters of the source (`σ = 1`, `θ = 10`, so `s = σ + θ = 11`) satisfy the
flagged hypothesis `1/2 < s`, so separation monotonicity holds there. -/
theorem pairCorr_antitone_reference {ρ : ℝ} (hρ : ρ ∈ Set.Ioc (0:ℝ) 1)
    {T₁ T₂ : ℝ} (h0 : 0 ≤ T₁) (h12 : T₁ ≤ T₂) :
    pairCorr (1 + 10) ρ T₂ ≤ pairCorr (1 + 10) ρ T₁ :=
  pairCorr_antitone hρ (by norm_num) h0 h12

end WeldCC
