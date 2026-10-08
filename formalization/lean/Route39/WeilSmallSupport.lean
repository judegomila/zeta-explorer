import Mathlib

/-
Route 39 (fifty-routes-2026-10-06): Weil explicit formula + Yoshida-type small-support positivity.
Checked with Lean 4.34.1 / Mathlib d13f23b7 using the locally built openai/math tree:
    cd /tmp/qrh-verify/lean && lake env lean <repo>/formalization/lean/Route39/WeilSmallSupport.lean
(This file is NOT part of the core-only Lean 4.9 `DeBruijnNewman` lake build in formalization/lean.)
Numerics: tmp/routes-b9-r39-numerics/ (certify_arch.py, check_normalisation.py).
-/

/-!
# Route 39: Weil explicit formula, small-support positivity (model setting)

Normalisation (Weil / Rudnick–Sarnak, test `g` with `ĝ(t) = ∫ g x e^{itx} dx`):

  Σ_ρ ĝ(γ_ρ) = ĝ(i/2) + ĝ(-i/2) − Σ_n Λ(n) n^{-1/2} (g(log n) + g(-log n))
              + (1/2π) ∫ ĝ(t) (Re ψ(1/4 + it/2) − log π) dt.

For `g = f ⋆ f*` (`f* x = conj (f (-x))`) and Mathlib's `𝓕 f ξ = ∫ f x e^{-2πixξ} dx`:
* `ĝ(t) = ‖𝓕 f (t / 2π)‖²` on the real line, so the archimedean term equals
  `∫ ξ, archSymbol ξ * ‖𝓕 f ξ‖²` with `archSymbol ξ = Re ψ(1/4 + iπξ) − log π`;
* `ĝ(i/2) + ĝ(-i/2) = 2 Re (A(-1/2) · conj A(1/2))` with `A(c) = ∫ f x e^{cx} dx`.

This file proves (sorry-free, axioms = propext, Classical.choice, Quot.sound):
1. `primeSide_eq_zero_of_support`: the prime side vanishes when `supp g ⊆ [-b, b]`, `b < log 2`;
   `primeSide_support_threshold_sharp`: the threshold `log 2` is exact for the prime side.
2. `autocorr_eq_zero_of_support`, `primeSide_autocorr_eq_zero`: `supp f ⊆ [-a,a]`, `2a < log 2`
   kills the prime side of `f ⋆ f*`.
3. `poleTerm_nonneg_of_even`: the pole term is `2|A(1/2)|² ≥ 0` for even `f`.
4. `uncertainty_toeplitz_nonneg`: for any symbol `w ≥ m` outside `[-T,T]` with deficit
   `∫_{[-T,T]} (m − w)⁺ ≤ D`, every Schwartz `f` supported in `[-a,a]` with `2aD ≤ m`
   has `∫ w ‖𝓕 f‖² ≥ 0` (Plancherel + `‖𝓕 f‖∞ ≤ ‖f‖₁` + `‖f‖₁² ≤ 2a‖f‖₂²`).
5. `weilModel_nonneg`: the model Weil functional `pole − prime + arch` is `≥ 0` for even
   Schwartz `f` with `supp f ⊆ [-a,a]`, `2a < log 2`, `2aD ≤ m`.
6. `continuous_archSymbol`: `ξ ↦ Re ψ(1/4 + iπξ) − log π` is continuous (Mathlib digamma).
7. `fourier_autocorr`, `autocorr_exp_integral`, `weilRHS_autocorr`: Fubini identifications;
   the model functional equals the explicit-formula right-hand side `weilRHS` at `g = f ⋆ f*`.
8. `weilModel_archSymbol_nonneg`: positivity with the true archimedean symbol of ζ for
   `supp f ⊆ [-13/150, 13/150]`, under two Arb-certified numerical hypotheses on `Re ψ`.
9. `zeroSide_nonneg_small_support`: conditional on Weil's explicit formula (a hypothesis
   `hEF`, NOT formalised here) the zero side `Σ_ρ ĝ(γ)` is `≥ 0` for those `g = f ⋆ f*`.

NOT formalised: Weil's explicit formula itself (classical: Weil 1952; Iwaniec–Kowalski §5.5),
monotonicity of `Re ψ(1/4 + iy)` in `|y|` (DLMF 5.7.6), and the two numerical facts.
The support constant `13/150` comes from a crude uncertainty bound and is far below the
`log 2 / 2` window where the prime side is already absent.
-/

namespace Route39

open MeasureTheory SchwartzMap FourierTransform Set

/-! ## 1. The prime side -/

/-- Prime side of the Weil explicit formula: `Σ_n Λ(n) n^{-1/2} (g(log n) + g(-log n))`. -/
noncomputable def primeSide (g : ℝ → ℂ) : ℂ :=
  ∑' n : ℕ, ((ArithmeticFunction.vonMangoldt n / Real.sqrt n : ℝ) : ℂ) *
    (g (Real.log n) + g (-Real.log n))

lemma log_two_le_log_of_vonMangoldt_ne_zero {n : ℕ}
    (h : ArithmeticFunction.vonMangoldt n ≠ 0) : Real.log 2 ≤ Real.log n := by
  have hpp : IsPrimePow n := by
    by_contra hc
    exact h (ArithmeticFunction.vonMangoldt_eq_zero_iff.mpr hc)
  have h2 : (2 : ℝ) ≤ n := by exact_mod_cast hpp.two_le
  exact Real.log_le_log (by norm_num) h2

/-- If `g` vanishes outside `[-b, b]` with `b < log 2`, no prime power is seen. -/
theorem primeSide_eq_zero_of_support {g : ℝ → ℂ} {b : ℝ} (hb : b < Real.log 2)
    (hg : ∀ x, b < |x| → g x = 0) : primeSide g = 0 := by
  unfold primeSide
  have hterm : ∀ n : ℕ, ((ArithmeticFunction.vonMangoldt n / Real.sqrt n : ℝ) : ℂ) *
      (g (Real.log n) + g (-Real.log n)) = 0 := by
    intro n
    by_cases h : ArithmeticFunction.vonMangoldt n = 0
    · simp [h]
    · have hl := log_two_le_log_of_vonMangoldt_ne_zero h
      have hpos : 0 ≤ Real.log n := (Real.log_nonneg (by norm_num : (1 : ℝ) ≤ 2)).trans hl
      have h1 : b < |Real.log n| := by rw [abs_of_nonneg hpos]; linarith
      have h2 : b < |-Real.log n| := by rw [abs_neg]; exact h1
      rw [hg _ h1, hg _ h2]; simp
  simp only [hterm, tsum_zero]

/-- The threshold `log 2` is exact for the prime side: a function supported in
`[-log 2, log 2]` (here the point `log 2`) already sees `n = 2`. -/
theorem primeSide_support_threshold_sharp :
    ∃ g : ℝ → ℂ, (∀ x, Real.log 2 < |x| → g x = 0) ∧ primeSide g ≠ 0 := by
  classical
  have hl2 : 0 < Real.log 2 := Real.log_pos (by norm_num)
  refine ⟨fun x => if x = Real.log 2 then 1 else 0, ?_, ?_⟩
  · intro x hx
    have : x ≠ Real.log 2 := by
      rintro rfl
      rw [abs_of_pos hl2] at hx
      exact lt_irrefl _ hx
    simp [this]
  · unfold primeSide
    rw [tsum_eq_single 2]
    · have hneg : (-Real.log 2 : ℝ) ≠ Real.log 2 := by intro h; linarith
      have hΛ : ArithmeticFunction.vonMangoldt 2 = Real.log 2 :=
        by simpa using ArithmeticFunction.vonMangoldt_apply_prime Nat.prime_two
      have hs : (0 : ℝ) < Real.sqrt 2 := by positivity
      simp only [Nat.cast_ofNat, ite_true, hneg, ite_false, add_zero, mul_one, hΛ]
      exact_mod_cast (div_pos hl2 hs).ne'
    · intro n hn
      by_cases h : ArithmeticFunction.vonMangoldt n = 0
      · simp [h]
      · have hl := log_two_le_log_of_vonMangoldt_ne_zero h
        have h2n : (2 : ℕ) ≤ n := by
          have hpp : IsPrimePow n := by
            by_contra hc
            exact h (ArithmeticFunction.vonMangoldt_eq_zero_iff.mpr hc)
          exact hpp.two_le
        have hnpos : (0 : ℝ) < n := by exact_mod_cast (by omega : 0 < n)
        have hne1 : Real.log n ≠ Real.log 2 := by
          intro heq
          have : (n : ℝ) = 2 := Real.log_injOn_pos (Set.mem_Ioi.mpr hnpos)
            (Set.mem_Ioi.mpr (by norm_num)) heq
          exact hn (by exact_mod_cast this)
        have hne2 : -Real.log n ≠ Real.log 2 := by intro heq; linarith
        simp [hne1, hne2]

/-! ## 2. Autocorrelation `g = f ⋆ f*` and its support -/

/-- `g(x) = ∫ f(y) conj f(y - x) dy`, i.e. `f ⋆ f*` with `f* x = conj (f (-x))`. -/
noncomputable def autocorr (f : ℝ → ℂ) (x : ℝ) : ℂ :=
  ∫ y, f y * starRingEnd ℂ (f (y - x))

theorem autocorr_eq_zero_of_support {f : ℝ → ℂ} {a : ℝ} (hf : ∀ x, a < |x| → f x = 0)
    {x : ℝ} (hx : 2 * a < |x|) : autocorr f x = 0 := by
  unfold autocorr
  have h : ∀ y, f y * starRingEnd ℂ (f (y - x)) = 0 := by
    intro y
    by_cases hy : a < |y|
    · rw [hf y hy, zero_mul]
    · push Not at hy
      have htri : |x| ≤ |y| + |y - x| := by
        have := abs_sub y (y - x)
        simpa using this
      have : a < |y - x| := by linarith
      rw [hf _ this]; simp
  simp only [h, integral_zero]

/-- Small support kills the prime side of the autocorrelation. -/
theorem primeSide_autocorr_eq_zero {f : ℝ → ℂ} {a : ℝ} (hf : ∀ x, a < |x| → f x = 0)
    (ha : 2 * a < Real.log 2) : primeSide (autocorr f) = 0 :=
  primeSide_eq_zero_of_support ha (fun _ hx => autocorr_eq_zero_of_support hf hx)

/-! ## 3. The pole term -/

/-- `A(c) = ∫ f x e^{c x} dx`. -/
noncomputable def expMoment (f : ℝ → ℂ) (c : ℝ) : ℂ :=
  ∫ x, f x * (Real.exp (c * x) : ℂ)

/-- `ĝ(i/2) + ĝ(-i/2)` for `g = f ⋆ f*`, in factorised form `2 Re (A(-1/2) conj A(1/2))`. -/
noncomputable def poleTerm (f : ℝ → ℂ) : ℝ :=
  2 * (expMoment f (-(1 / 2)) * starRingEnd ℂ (expMoment f (1 / 2))).re

theorem expMoment_neg_of_even {f : ℝ → ℂ} (hf : ∀ x, f (-x) = f x) (c : ℝ) :
    expMoment f (-c) = expMoment f c := by
  unfold expMoment
  rw [← integral_neg_eq_self (fun x => f x * (Real.exp (-c * x) : ℂ)) volume]
  congr 1
  ext x
  rw [hf]
  congr 3
  ring

theorem poleTerm_nonneg_of_even {f : ℝ → ℂ} (hf : ∀ x, f (-x) = f x) : 0 ≤ poleTerm f := by
  unfold poleTerm
  rw [expMoment_neg_of_even hf, Complex.mul_conj, Complex.ofReal_re]
  have := Complex.normSq_nonneg (expMoment f (1 / 2))
  positivity

/-! ## 4. Uncertainty bound for Toeplitz forms on a window -/

/-- `‖f‖₁² ≤ 2a ‖f‖₂²` for `f` supported in `[-a, a]` (pointwise AM–GM, no Hölder). -/
theorem sq_integral_norm_le {f : ℝ → ℂ} {a : ℝ} (ha : 0 < a) (hf : ∀ x, a < |x| → f x = 0)
    (hf1 : Integrable (fun x => ‖f x‖)) (hf2 : Integrable (fun x => ‖f x‖ ^ 2)) :
    (∫ x, ‖f x‖) ^ 2 ≤ 2 * a * ∫ x, ‖f x‖ ^ 2 := by
  set S : Set ℝ := Icc (-a) a with hS
  set I := ∫ x, ‖f x‖ with hI
  set N := ∫ x, ‖f x‖ ^ 2 with hN
  have hout : ∀ x ∉ S, f x = 0 := by
    intro x hx
    apply hf
    by_contra hle
    push Not at hle
    exact hx ⟨by linarith [neg_abs_le x], by linarith [le_abs_self x]⟩
  have hIS : ∫ x in S, ‖f x‖ = I :=
    setIntegral_eq_integral_of_forall_compl_eq_zero (fun x hx => by simp [hout x hx])
  have hNS : ∫ x in S, ‖f x‖ ^ 2 = N :=
    setIntegral_eq_integral_of_forall_compl_eq_zero (fun x hx => by simp [hout x hx])
  set c := I / (2 * a) with hc
  have hvol : volume.real S = 2 * a := by
    rw [hS, Measure.real, Real.volume_Icc, ENNReal.toReal_ofReal (by linarith)]
    ring
  have hfin : volume S < ⊤ := by rw [hS, Real.volume_Icc]; exact ENNReal.ofReal_lt_top
  -- pointwise 2 c ‖f‖ ≤ ‖f‖² + c²
  have hmono : ∫ x in S, 2 * c * ‖f x‖ ≤ ∫ x in S, (‖f x‖ ^ 2 + c ^ 2) := by
    apply setIntegral_mono_on
    · exact (hf1.const_mul (2 * c)).integrableOn
    · exact (hf2.integrableOn).add (integrableOn_const hfin.ne)
    · exact measurableSet_Icc
    · intro x _
      nlinarith [sq_nonneg (‖f x‖ - c)]
  rw [integral_const_mul, hIS, integral_add hf2.integrableOn (integrableOn_const hfin.ne),
    hNS, setIntegral_const, hvol, smul_eq_mul] at hmono
  -- 2 c I ≤ N + 2a c², with c = I / 2a
  have h2a : 0 < 2 * a := by linarith
  rw [hc] at hmono
  have key : I ^ 2 / (2 * a) ≤ N := by
    have e1 : 2 * (I / (2 * a)) * I = 2 * (I ^ 2 / (2 * a)) := by ring
    have e2 : 2 * a * (I / (2 * a)) ^ 2 = I ^ 2 / (2 * a) := by field_simp
    nlinarith [e1, e2]
  rw [div_le_iff₀ h2a] at key
  linarith

/-- Pointwise bound `‖𝓕 f ξ‖² ≤ ‖f‖₁²`. -/
theorem norm_fourier_sq_le (f : 𝓢(ℝ, ℂ)) (ξ : ℝ) :
    ‖𝓕 f ξ‖ ^ 2 ≤ (∫ x, ‖f x‖) ^ 2 := by
  have h := norm_fourier_apply_le_toLp_one f ξ
  rw [norm_toLp_one] at h
  exact pow_le_pow_left₀ (norm_nonneg _) h 2

/-- **Uncertainty positivity for Toeplitz forms.** If the symbol `w` is at least `m ≥ 0`
outside `[-T, T]` and its deficit `∫_{[-T,T]} (m − w)⁺` is at most `D`, then every Schwartz
`f` supported in `[-a, a]` with `2 a D ≤ m` has `∫ w ‖𝓕 f‖² ≥ 0`.
(If `w ‖𝓕 f‖²` is not integrable the Bochner integral is `0` and the claim is trivial.) -/
theorem uncertainty_toeplitz_nonneg (f : 𝓢(ℝ, ℂ)) {a T m D : ℝ} (ha : 0 < a) (_hm : 0 ≤ m)
    (hf : ∀ x, a < |x| → f x = 0) (w : ℝ → ℝ)
    (hw_tail : ∀ ξ, T < |ξ| → m ≤ w ξ)
    (hdef_int : IntegrableOn (fun ξ => max (m - w ξ) 0) (Icc (-T) T))
    (hdef : ∫ ξ in Icc (-T) T, max (m - w ξ) 0 ≤ D)
    (hcond : 2 * a * D ≤ m) :
    0 ≤ ∫ ξ, w ξ * ‖𝓕 f ξ‖ ^ 2 := by
  by_cases hint : Integrable (fun ξ => w ξ * ‖𝓕 f ξ‖ ^ 2)
  swap
  · rw [integral_undef hint]
  set φ : ℝ → ℝ := fun ξ => ‖𝓕 f ξ‖ ^ 2 with hφ
  set S : Set ℝ := Icc (-T) T with hS
  set d : ℝ → ℝ := fun ξ => max (m - w ξ) 0 with hd
  set I := ∫ x, ‖f x‖ with hI
  set N := ∫ x, ‖f x‖ ^ 2 with hN
  have hφint : Integrable φ := ((𝓕 f).memLp 2 volume).integrable_norm_pow two_ne_zero
  have hφcont : Continuous φ := (continuous_norm.comp (𝓕 f).continuous).pow 2
  have hφnn : ∀ ξ, 0 ≤ φ ξ := fun ξ => by positivity
  have hφle : ∀ ξ, φ ξ ≤ I ^ 2 := norm_fourier_sq_le f
  have hplanch : ∫ ξ, φ ξ = N := integral_norm_sq_fourier f
  have hf1 : Integrable (fun x => ‖f x‖) := f.integrable.norm
  have hf2 : Integrable (fun x => ‖f x‖ ^ 2) := (f.memLp 2 volume).integrable_norm_pow two_ne_zero
  have hIN : I ^ 2 ≤ 2 * a * N := sq_integral_norm_le ha hf hf1 hf2
  have hNnn : 0 ≤ N := integral_nonneg (fun x => by positivity)
  have hdnn : ∀ ξ, 0 ≤ d ξ := fun ξ => le_max_right _ _
  have hD : 0 ≤ D := le_trans (setIntegral_nonneg measurableSet_Icc (fun ξ _ => hdnn ξ)) hdef
  -- integrability of d φ on S
  have hdφ : IntegrableOn (fun ξ => d ξ * φ ξ) S := by
    refine Integrable.mul_bdd (c := I ^ 2) hdef_int hφcont.aestronglyMeasurable ?_
    refine Filter.Eventually.of_forall (fun ξ => ?_)
    rw [Real.norm_eq_abs, abs_of_nonneg (hφnn ξ)]
    exact hφle ξ
  -- lower function
  set L : ℝ → ℝ := fun ξ => m * φ ξ - S.indicator (fun ξ => d ξ * φ ξ) ξ with hL
  have hLint : Integrable L :=
    (hφint.const_mul m).sub (hdφ.integrable_indicator measurableSet_Icc)
  have hLle : ∀ ξ, L ξ ≤ w ξ * φ ξ := by
    intro ξ
    simp only [hL]
    by_cases hξ : ξ ∈ S
    · rw [indicator_of_mem hξ]
      have : m - d ξ ≤ w ξ := by
        simp only [hd]
        have := le_max_left (m - w ξ) 0
        linarith
      nlinarith [hφnn ξ]
    · rw [indicator_of_notMem hξ, sub_zero]
      have hT : T < |ξ| := by
        by_contra hle
        push Not at hle
        exact hξ ⟨by linarith [neg_abs_le ξ], by linarith [le_abs_self ξ]⟩
      exact mul_le_mul_of_nonneg_right (hw_tail ξ hT) (hφnn ξ)
  have hstep1 : ∫ ξ, L ξ ≤ ∫ ξ, w ξ * φ ξ := integral_mono hLint hint hLle
  have hLval : ∫ ξ, L ξ = m * N - ∫ ξ in S, d ξ * φ ξ := by
    simp only [hL]
    rw [integral_sub (hφint.const_mul m) (hdφ.integrable_indicator measurableSet_Icc),
      integral_const_mul, hplanch, integral_indicator measurableSet_Icc]
  have hdφle : ∫ ξ in S, d ξ * φ ξ ≤ I ^ 2 * D := by
    calc ∫ ξ in S, d ξ * φ ξ ≤ ∫ ξ in S, I ^ 2 * d ξ := by
          apply setIntegral_mono_on hdφ (hdef_int.const_mul _) measurableSet_Icc
          intro ξ _
          rw [mul_comm (I ^ 2)]
          exact mul_le_mul_of_nonneg_left (hφle ξ) (hdnn ξ)
      _ = I ^ 2 * ∫ ξ in S, d ξ := integral_const_mul _ _
      _ ≤ I ^ 2 * D := mul_le_mul_of_nonneg_left hdef (sq_nonneg _)
  have : 0 ≤ m * N - ∫ ξ in S, d ξ * φ ξ := by
    have h1 : I ^ 2 * D ≤ 2 * a * N * D := mul_le_mul_of_nonneg_right hIN hD
    have h2 : 2 * a * N * D ≤ m * N := by nlinarith
    linarith
  linarith

/-! ## 5. The model Weil functional -/

/-- Model Weil functional `pole − prime + arch` with archimedean symbol `w`
(in Mathlib frequency units). With `w = archSymbol` this is the right-hand side of Weil's
explicit formula for `g = f ⋆ f*`, modulo the Fubini identifications in the module doc. -/
noncomputable def weilModel (w : ℝ → ℝ) (f : 𝓢(ℝ, ℂ)) : ℝ :=
  poleTerm f - (primeSide (autocorr f)).re + ∫ ξ, w ξ * ‖𝓕 f ξ‖ ^ 2

/-- Small-support positivity of the model Weil functional for even test functions. -/
theorem weilModel_nonneg (f : 𝓢(ℝ, ℂ)) (heven : ∀ x, f (-x) = f x)
    {a T m D : ℝ} (ha : 0 < a) (hlog : 2 * a < Real.log 2) (hm : 0 ≤ m)
    (hf : ∀ x, a < |x| → f x = 0) (w : ℝ → ℝ)
    (hw_tail : ∀ ξ, T < |ξ| → m ≤ w ξ)
    (hdef_int : IntegrableOn (fun ξ => max (m - w ξ) 0) (Icc (-T) T))
    (hdef : ∫ ξ in Icc (-T) T, max (m - w ξ) 0 ≤ D)
    (hcond : 2 * a * D ≤ m) :
    0 ≤ weilModel w f := by
  unfold weilModel
  rw [primeSide_autocorr_eq_zero hf hlog, Complex.zero_re, sub_zero]
  exact add_nonneg (poleTerm_nonneg_of_even heven)
    (uncertainty_toeplitz_nonneg f ha hm hf w hw_tail hdef_int hdef hcond)

/-- The archimedean symbol of ζ in Mathlib frequency units:
`Re ψ(1/4 + iπξ) − log π` (`ψ = Complex.digamma`). -/
noncomputable def archSymbol (ξ : ℝ) : ℝ :=
  (Complex.digamma (1 / 4 + Complex.I * (Real.pi * ξ))).re - Real.log Real.pi

/-! ## Continuity of the archimedean symbol (discharges the integrability hypothesis) -/

theorem continuousOn_digamma_re_pos :
    ContinuousOn Complex.digamma {s : ℂ | 0 < s.re} := by
  have hU : IsOpen {s : ℂ | 0 < s.re} := isOpen_lt continuous_const Complex.continuous_re
  have hG : DifferentiableOn ℂ Complex.Gamma {s : ℂ | 0 < s.re} := by
    intro s hs
    apply (Complex.differentiableAt_Gamma s _).differentiableWithinAt
    intro m hm
    have : s.re = -(m : ℝ) := by rw [hm]; simp
    have h0 : (0 : ℝ) ≤ m := Nat.cast_nonneg m
    simp only [mem_ofPred_eq] at hs
    linarith
  have hdG : ContinuousOn (deriv Complex.Gamma) {s : ℂ | 0 < s.re} :=
    (hG.deriv hU).continuousOn
  rw [Complex.digamma_def]
  have : logDeriv Complex.Gamma = fun s => deriv Complex.Gamma s / Complex.Gamma s := by
    ext s; exact logDeriv_apply _ _
  rw [this]
  exact hdG.div hG.continuousOn (fun s hs => Complex.Gamma_ne_zero_of_re_pos hs)

theorem continuous_archSymbol : Continuous archSymbol := by
  unfold archSymbol
  have hline : Continuous (fun ξ : ℝ => (1 / 4 : ℂ) + Complex.I * (Real.pi * ξ)) := by
    fun_prop
  have hmaps : ∀ ξ : ℝ, (1 / 4 : ℂ) + Complex.I * (Real.pi * ξ) ∈ {s : ℂ | 0 < s.re} := by
    intro ξ
    simp only [mem_ofPred_eq, Complex.add_re, Complex.mul_re, Complex.I_re, Complex.I_im,
      Complex.ofReal_re, Complex.ofReal_im]
    norm_num
  have h := continuousOn_digamma_re_pos.comp_continuous hline hmaps
  exact (Complex.continuous_re.comp h).sub continuous_const

theorem integrableOn_archDeficit (m T : ℝ) :
    IntegrableOn (fun ξ => max (m - archSymbol ξ) 0) (Icc (-T) T) :=
  ((continuous_const.sub continuous_archSymbol).max continuous_const).integrableOn_Icc

/-! ## Fubini identifications for `g = f ⋆ f*` -/

/-- General splitting lemma: if `K (y - u) = E y * F u` then
`∫ g K = (∫ f E) * (∫ conj f * F)` for `g = f ⋆ f*`, `f` continuous with compact support. -/
theorem autocorr_integral_mul {f : ℝ → ℂ} (hfc : Continuous f) (hfs : HasCompactSupport f)
    (K E F : ℝ → ℂ) (hK : Continuous K) (hsplit : ∀ y u, K (y - u) = E y * F u) :
    ∫ x, autocorr f x * K x =
      (∫ y, f y * E y) * ∫ u, starRingEnd ℂ (f u) * F u := by
  -- integrability on ℝ × ℝ
  set s := tsupport f with hs
  have hsc : IsCompact s := hfs
  set Φ : ℝ × ℝ → ℂ := fun p => f p.2 * starRingEnd ℂ (f (p.2 - p.1)) * K p.1 with hΦ
  have hΦc : Continuous Φ := by
    simp only [hΦ]
    fun_prop
  have hΦs : HasCompactSupport Φ := by
    refine HasCompactSupport.intro
      ((hsc.prod hsc).image (by fun_prop : Continuous (fun q : ℝ × ℝ => (q.1 - q.2, q.1)))) ?_
    intro p hp
    simp only [hΦ]
    by_cases h1 : p.2 ∈ s
    · by_cases h2 : p.2 - p.1 ∈ s
      · exfalso
        apply hp
        refine ⟨(p.2, p.2 - p.1), ⟨h1, h2⟩, ?_⟩
        ext <;> simp
      · rw [image_eq_zero_of_notMem_tsupport h2]; simp
    · rw [image_eq_zero_of_notMem_tsupport h1]; simp
  have hΦi : Integrable Φ (volume.prod volume) := by
    have := hΦc.integrable_of_hasCompactSupport (μ := volume) hΦs
    simpa [Measure.volume_eq_prod] using this
  -- unfold and swap
  have step1 : ∫ x, autocorr f x * K x = ∫ x, ∫ y, f y * starRingEnd ℂ (f (y - x)) * K x := by
    congr 1; ext x
    unfold autocorr
    rw [← integral_mul_const]
  rw [step1, integral_integral_swap (f := fun x y => f y * starRingEnd ℂ (f (y - x)) * K x) hΦi]
  -- inner integral
  have inner : ∀ y, ∫ x, f y * starRingEnd ℂ (f (y - x)) * K x =
      f y * E y * ∫ u, starRingEnd ℂ (f u) * F u := by
    intro y
    have hsub : ∫ x, starRingEnd ℂ (f (y - x)) * K x = ∫ u, starRingEnd ℂ (f u) * K (y - u) := by
      have := integral_sub_left_eq_self (fun u => starRingEnd ℂ (f u) * K (y - u)) volume y
      simpa using this
    calc ∫ x, f y * starRingEnd ℂ (f (y - x)) * K x
        = f y * ∫ x, starRingEnd ℂ (f (y - x)) * K x := by
          rw [← integral_const_mul]; congr 1; ext x; ring
      _ = f y * ∫ u, starRingEnd ℂ (f u) * (E y * F u) := by
          rw [hsub]; simp only [hsplit]
      _ = f y * E y * ∫ u, starRingEnd ℂ (f u) * F u := by
          rw [mul_assoc]; congr 1; rw [← integral_const_mul]; congr 1; ext u; ring
  simp only [inner]
  rw [integral_mul_const]

/-- `𝓕 (f ⋆ f*) ξ = ‖𝓕 f ξ‖²` (archimedean identification). -/
theorem fourier_autocorr {f : ℝ → ℂ} (hfc : Continuous f) (hfs : HasCompactSupport f) (ξ : ℝ) :
    𝓕 (autocorr f) ξ = ((‖𝓕 f ξ‖ ^ 2 : ℝ) : ℂ) := by
  set e : ℝ → ℂ := fun x => Complex.exp (((2 * Real.pi * (-(x * ξ)) : ℝ) : ℂ) * Complex.I) with he
  have hF : ∀ h : ℝ → ℂ, 𝓕 h ξ = ∫ x, h x * e x := by
    intro h
    rw [Real.fourier_real_eq]
    congr 1; ext x
    rw [Circle.smul_def, Real.fourierChar_apply, smul_eq_mul, mul_comm]
  set e' : ℝ → ℂ := fun u => Complex.exp (((2 * Real.pi * (u * ξ)) : ℝ) * Complex.I) with he'
  have hsplit : ∀ y u, e (y - u) = e y * e' u := by
    intro y u
    simp only [he, he', ← Complex.exp_add]
    congr 1; push_cast; ring
  have hce : ∀ u, starRingEnd ℂ (e u) = e' u := by
    intro u
    simp only [he, he', ← Complex.exp_conj, map_mul, Complex.conj_ofReal, Complex.conj_I]
    congr 1; push_cast; ring
  have hconj : ∀ u, starRingEnd ℂ (f u) * e' u = starRingEnd ℂ (f u * e u) := by
    intro u
    rw [map_mul, hce]
  rw [hF, autocorr_integral_mul hfc hfs e e e' (by fun_prop) hsplit]
  simp only [hconj]
  rw [integral_conj, ← hF, Complex.mul_conj, Complex.normSq_eq_norm_sq]

/-- `ĝ(i/2) = ∫ g(x) e^{-x/2} dx = A(-1/2) · conj A(1/2)` (pole identification). -/
theorem autocorr_exp_integral {f : ℝ → ℂ} (hfc : Continuous f) (hfs : HasCompactSupport f)
    (c : ℝ) :
    ∫ x, autocorr f x * (Real.exp (c * x) : ℂ) =
      (∫ y, f y * (Real.exp (c * y) : ℂ)) *
        starRingEnd ℂ (∫ u, f u * (Real.exp (-c * u) : ℂ)) := by
  rw [autocorr_integral_mul hfc hfs (fun x => (Real.exp (c * x) : ℂ))
    (fun y => (Real.exp (c * y) : ℂ)) (fun u => (Real.exp (-c * u) : ℂ)) (by fun_prop)]
  · rw [← integral_conj]
    congr 2; ext u
    rw [map_mul, Complex.conj_ofReal]
  · intro y u
    rw [← Complex.ofReal_mul, ← Real.exp_add]
    congr 2; ring

/-- Instance with the true archimedean symbol of ζ. Two numerical hypotheses
(`archSymbol ≥ 26/25` for `|ξ| > 57/20`; deficit `∫_{[-57/20, 57/20]} (26/25 − archSymbol)⁺ ≤ 6`)
are certified outside Lean (Arb: `w(57/20) ∈ 1.04718898431564499 ± 1e-20`, deficit `≤ 5.91226`,
plus monotonicity of `Re ψ(1/4 + iy)` in `|y|`, DLMF 5.7.6). Integrability is proved
(`integrableOn_archDeficit`). Conclusion: the model Weil functional is `≥ 0` for every even
Schwartz `f` supported in `[-13/150, 13/150]`, i.e. `g = f ⋆ f*` supported in
`[-13/75, 13/75] ≈ [-0.1733, 0.1733]`. -/
theorem weilModel_archSymbol_nonneg (f : 𝓢(ℝ, ℂ)) (heven : ∀ x, f (-x) = f x)
    (hf : ∀ x, (13 / 150 : ℝ) < |x| → f x = 0)
    (hN1 : ∀ ξ, (57 / 20 : ℝ) < |ξ| → (26 / 25 : ℝ) ≤ archSymbol ξ)
    (hN3 : ∫ ξ in Icc (-(57 / 20 : ℝ)) (57 / 20), max ((26 / 25 : ℝ) - archSymbol ξ) 0 ≤ 6) :
    0 ≤ weilModel archSymbol f := by
  have hlog : 2 * (13 / 150 : ℝ) < Real.log 2 := by
    have := Real.log_two_gt_d9
    norm_num at this ⊢
    linarith
  exact weilModel_nonneg f heven (by norm_num) hlog (by norm_num) hf archSymbol hN1
    (integrableOn_archDeficit _ _) hN3 (by norm_num)

/-! ## 6. The model functional is the right-hand side of Weil's explicit formula -/

/-- Right-hand side of Weil's explicit formula for `ζ` and a test function `g`
(`ĝ(t) = ∫ g e^{itx}`; Mathlib `𝓕 g ξ = ĝ(-2πξ)`; real parts taken):
`Re[ĝ(i/2) + ĝ(-i/2)] − Re P(g) + ∫ archSymbol ξ · Re 𝓕 g ξ dξ`. -/
noncomputable def weilRHS (g : ℝ → ℂ) : ℝ :=
  ((∫ x, g x * (Real.exp (-(1 / 2) * x) : ℂ)) + ∫ x, g x * (Real.exp ((1 / 2) * x) : ℂ)).re
    - (primeSide g).re + ∫ ξ, archSymbol ξ * (𝓕 g ξ).re

theorem hasCompactSupport_of_vanish {f : ℝ → ℂ} {a : ℝ} (hf : ∀ x, a < |x| → f x = 0) :
    HasCompactSupport f := by
  refine HasCompactSupport.intro (isCompact_Icc (a := -a) (b := a)) ?_
  intro x hx
  apply hf
  by_contra hle
  push Not at hle
  exact hx ⟨by linarith [neg_abs_le x], by linarith [le_abs_self x]⟩

/-- **Exact identification.** For a compactly supported Schwartz `f`, the model functional
equals the explicit-formula right-hand side evaluated at `g = f ⋆ f*`. -/
theorem weilRHS_autocorr (f : 𝓢(ℝ, ℂ)) (hfs : HasCompactSupport f) :
    weilRHS (autocorr f) = weilModel archSymbol f := by
  unfold weilRHS weilModel poleTerm expMoment
  have h1 := autocorr_exp_integral f.continuous hfs (-(1 / 2))
  have h2 := autocorr_exp_integral f.continuous hfs (1 / 2)
  rw [neg_neg] at h1
  rw [h1, h2]
  have harch : ∀ ξ, (𝓕 (autocorr f) ξ).re = ‖𝓕 f ξ‖ ^ 2 := by
    intro ξ
    rw [fourier_autocorr f.continuous hfs ξ, Complex.ofReal_re, SchwartzMap.fourier_coe]
  simp only [harch]
  congr 2
  set A := ∫ y, f y * (Real.exp (-(1 / 2) * y) : ℂ)
  set B := ∫ y, f y * (Real.exp ((1 / 2) * y) : ℂ)
  have : B * starRingEnd ℂ A = starRingEnd ℂ (A * starRingEnd ℂ B) := by
    rw [map_mul, Complex.conj_conj, mul_comm]
  rw [this, Complex.add_re, Complex.conj_re]
  ring

/-- **Conditional Yoshida-type positivity for `ζ`.** Let `Z g` denote the zero side
`Re Σ_ρ ĝ(γ_ρ)` of the explicit formula. Assuming Weil's explicit formula for compactly
supported Schwartz autocorrelations (classical, NOT formalised here) and the two
Arb-certified numerical facts, `Z (f ⋆ f*) ≥ 0` for every even Schwartz `f` supported in
`[-13/150, 13/150]`. (Under RH this is trivial; the point is that it is unconditional in RH.) -/
theorem zeroSide_nonneg_small_support (Z : (ℝ → ℂ) → ℝ)
    (hEF : ∀ f : 𝓢(ℝ, ℂ), HasCompactSupport f → Z (autocorr f) = weilRHS (autocorr f))
    (f : 𝓢(ℝ, ℂ)) (heven : ∀ x, f (-x) = f x)
    (hf : ∀ x, (13 / 150 : ℝ) < |x| → f x = 0)
    (hN1 : ∀ ξ, (57 / 20 : ℝ) < |ξ| → (26 / 25 : ℝ) ≤ archSymbol ξ)
    (hN3 : ∫ ξ in Icc (-(57 / 20 : ℝ)) (57 / 20), max ((26 / 25 : ℝ) - archSymbol ξ) 0 ≤ 6) :
    0 ≤ Z (autocorr f) := by
  have hfs := hasCompactSupport_of_vanish hf
  rw [hEF f hfs, weilRHS_autocorr f hfs]
  exact weilModel_archSymbol_nonneg f heven hf hN1 hN3

end Route39

#print axioms Route39.primeSide_support_threshold_sharp
#print axioms Route39.primeSide_autocorr_eq_zero
#print axioms Route39.uncertainty_toeplitz_nonneg
#print axioms Route39.weilModel_nonneg
#print axioms Route39.continuous_archSymbol
#print axioms Route39.fourier_autocorr
#print axioms Route39.weilRHS_autocorr
#print axioms Route39.weilModel_archSymbol_nonneg
#print axioms Route39.zeroSide_nonneg_small_support
