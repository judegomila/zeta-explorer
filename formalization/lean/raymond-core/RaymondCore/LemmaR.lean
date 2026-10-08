import Mathlib

/-!
# Lemma R (reflection-phase lemma, Track A)

Source: `formalization/paper/joint-pair-arbitrary-shift.md` §1, "Lemma R".

Paper statement. Let `X ≥ 6·10¹²`, `0 < a < 2`, `x ≥ X − 2 + a`, `0 ≤ t ≤ 41/250` and
`θ := (Φ(x+a) − Φ(x−a))/2` with `Φ` continuous on `[x−a, x+a]`. Then

  `|θ − a L(x)/2| ≤ ε_R := a(10 + t(L(x−a)/2 + 1))/(x−a) + a²/(4(x−a)) < 10⁻¹⁰`.

The paper's proof uses `Φ(ξ) = 2 Im log M_t((1+iξ)/2)`, so `Φ'(ξ) = Re β_t` with
`β_t = α + (t/2) α α'`, and the AF (4.6) estimates
`|α − (L/2 + iπ/4)| < 10/ξ`, `|α'| < 2/ξ`, `|α| < L/2 + 1` on `ξ ≥ X − 4`.

What is formalised here (no `sorry`, standard axioms only):

* `reBeta_bound` — the pointwise step `|Re β_t − L/2| ≤ (10 + t(L/2+1))/ξ` from the three
  AF (4.6) estimates (taken as hypotheses).
* `lemmaR_sharp` / `lemmaR` — the integration step: if `Φ` has derivative `Re β_t(ξ)` at every
  `ξ ∈ [x−a, x+a]`, the three AF (4.6) estimates hold there, and `L(ξ) = log ξ − κ`, then
  `|θ − aL(x)/2| ≤ a(10 + t(L(x−a)/2+1))/(x−a) + a²/(8(x−a))` (sharp form; the log-term
  contributes `a²/8(x−a)` because its two halves have opposite signs), hence also `≤ ε_R`.
* `epsR_lt` — the numerical claim `ε_R < 10⁻¹⁰` on the stated parameter range, for every
  `κ ≥ 0`.

NOT formalised (hypotheses of `lemmaR`): the AF (4.6) estimates themselves (Stirling-type bounds
for the logarithmic derivative `α` of Raymond's `M_t`), and the identity `Φ' = Re β_t`
(differentiation of `2 Im log M_t((1+iξ)/2)` along a continuous branch).
-/

open Real Set

namespace RaymondCore.LemmaR

/-- `L(ξ) = log ξ − κ` (the paper's `L`, up to the additive constant `κ`). -/
noncomputable def Lfun (κ ξ : ℝ) : ℝ := Real.log ξ - κ

/-- `ε_R` as stated in the paper. -/
noncomputable def epsR (κ x a t : ℝ) : ℝ :=
  a * (10 + t * (Lfun κ (x - a) / 2 + 1)) / (x - a) + a ^ 2 / (4 * (x - a))

/-- Pointwise step: `|Re(α + (t/2)αα') − L/2| ≤ (10 + t(L/2+1))/ξ`. -/
lemma reBeta_bound {α α' : ℂ} {Lξ ξ t : ℝ} (hξ : 0 < ξ) (ht : 0 ≤ t)
    (h1 : ‖α - (((Lξ / 2 : ℝ) : ℂ) + ((π / 4 : ℝ) : ℂ) * Complex.I)‖ ≤ 10 / ξ)
    (h2 : ‖α'‖ ≤ 2 / ξ) (h3 : ‖α‖ ≤ Lξ / 2 + 1) :
    |(α + ((t / 2 : ℝ) : ℂ) * α * α').re - Lξ / 2| ≤ (10 + t * (Lξ / 2 + 1)) / ξ := by
  have hre : (α + ((t / 2 : ℝ) : ℂ) * α * α').re - Lξ / 2 =
      (α - (((Lξ / 2 : ℝ) : ℂ) + ((π / 4 : ℝ) : ℂ) * Complex.I)).re + t / 2 * (α * α').re := by
    rw [mul_assoc, Complex.add_re, Complex.re_ofReal_mul]
    simp [Complex.sub_re]
    ring
  rw [hre]
  have hA : |(α - (((Lξ / 2 : ℝ) : ℂ) + ((π / 4 : ℝ) : ℂ) * Complex.I)).re| ≤ 10 / ξ :=
    (Complex.abs_re_le_norm _).trans h1
  have hL : 0 ≤ Lξ / 2 + 1 := (norm_nonneg _).trans h3
  have hB : |(α * α').re| ≤ (Lξ / 2 + 1) * (2 / ξ) := by
    refine (Complex.abs_re_le_norm _).trans ?_
    rw [norm_mul]
    exact mul_le_mul h3 h2 (norm_nonneg _) hL
  calc |(α - (((Lξ / 2 : ℝ) : ℂ) + ((π / 4 : ℝ) : ℂ) * Complex.I)).re + t / 2 * (α * α').re|
      ≤ |(α - (((Lξ / 2 : ℝ) : ℂ) + ((π / 4 : ℝ) : ℂ) * Complex.I)).re| +
          |t / 2 * (α * α').re| := abs_add_le _ _
    _ ≤ 10 / ξ + t / 2 * ((Lξ / 2 + 1) * (2 / ξ)) := by
        rw [abs_mul, abs_of_nonneg (by linarith : (0 : ℝ) ≤ t / 2)]
        exact add_le_add hA (mul_le_mul_of_nonneg_left hB (by linarith))
    _ = (10 + t * (Lξ / 2 + 1)) / ξ := by field_simp

/-- Monotonicity from a nonnegative derivative on a closed interval (helper). -/
lemma le_of_hasDerivAt_nonneg {f f' : ℝ → ℝ} {p q : ℝ} (hpq : p ≤ q)
    (hd : ∀ ξ ∈ Icc p q, HasDerivAt f (f' ξ) ξ) (h0 : ∀ ξ ∈ Icc p q, 0 ≤ f' ξ) :
    f p ≤ f q :=
  monotoneOn_of_hasDerivWithinAt_nonneg (convex_Icc p q)
    (fun ξ hξ => (hd ξ hξ).continuousAt.continuousWithinAt)
    (fun ξ hξ => (hd ξ (interior_subset hξ)).hasDerivWithinAt)
    (fun ξ hξ => h0 ξ (interior_subset hξ)) ⟨le_refl p, hpq⟩ ⟨hpq, le_refl q⟩ hpq

/-- The decreasing-bound step: `(10 + t(L(ξ)/2+1))/ξ ≤ (10 + t(L(y)/2+1))/y` for `0 < y ≤ ξ`,
provided `L(y) ≥ −2` and `0 ≤ t ≤ 20`. -/
lemma bound_antitone {κ y ξ t : ℝ} (hy : 0 < y) (hyξ : y ≤ ξ) (ht : 0 ≤ t) (ht20 : t ≤ 20)
    (hLy : -2 ≤ Lfun κ y) :
    (10 + t * (Lfun κ ξ / 2 + 1)) / ξ ≤ (10 + t * (Lfun κ y / 2 + 1)) / y := by
  have hξ : 0 < ξ := lt_of_lt_of_le hy hyξ
  rw [div_le_div_iff₀ hξ hy]
  have hlog : Real.log ξ - Real.log y ≤ ξ / y - 1 := by
    rw [← Real.log_div hξ.ne' hy.ne']
    exact Real.log_le_sub_one_of_pos (div_pos hξ hy)
  have hmul : y * (Real.log ξ - Real.log y) ≤ ξ - y := by
    have h := mul_le_mul_of_nonneg_left hlog hy.le
    have e : y * (ξ / y - 1) = ξ - y := by field_simp
    linarith
  unfold Lfun at hLy ⊢
  nlinarith [mul_le_mul_of_nonneg_left hmul ht, mul_nonneg ht (sub_nonneg.2 hyξ),
    mul_nonneg (mul_nonneg ht (sub_nonneg.2 hyξ)) (by linarith : (0 : ℝ) ≤ Real.log y - κ + 2)]

/-- Antiderivative of `L/2`. -/
noncomputable def Fprim (κ ξ : ℝ) : ℝ := (ξ * Real.log ξ - ξ - κ * ξ) / 2

/-- Antiderivative of `log(ξ/x)/2`. -/
noncomputable def Kfun (x ξ : ℝ) : ℝ := (ξ * Real.log ξ - ξ - ξ * Real.log x) / 2

lemma hasDerivAt_Fprim (κ : ℝ) {ξ : ℝ} (hξ : 0 < ξ) :
    HasDerivAt (Fprim κ) (Lfun κ ξ / 2) ξ := by
  have h := (((Real.hasDerivAt_mul_log hξ.ne').sub (hasDerivAt_id' ξ)).sub
    ((hasDerivAt_id' ξ).const_mul κ)).div_const 2
  have e : Fprim κ = fun ξ => (ξ * Real.log ξ - ξ - κ * ξ) / 2 := rfl
  rw [e]
  convert h using 1
  unfold Lfun; ring

lemma hasDerivAt_Kfun (x : ℝ) {ξ : ℝ} (hξ : 0 < ξ) :
    HasDerivAt (Kfun x) ((Real.log ξ - Real.log x) / 2) ξ := by
  have h := (((Real.hasDerivAt_mul_log hξ.ne').sub (hasDerivAt_id' ξ)).sub
    ((hasDerivAt_id' ξ).mul_const (Real.log x))).div_const 2
  have e : Kfun x = fun ξ => (ξ * Real.log ξ - ξ - ξ * Real.log x) / 2 := rfl
  rw [e]
  convert h using 1
  ring

lemma hasDerivAt_sqR (x c ξ : ℝ) :
    HasDerivAt (fun ξ => (ξ - x) ^ 2 / c) (2 * (ξ - x) / c) ξ := by
  have h := (((hasDerivAt_id' ξ).sub_const x).pow 2).div_const c
  convert h using 1
  simp

lemma hasDerivAt_sqL (x c ξ : ℝ) :
    HasDerivAt (fun ξ => (x - ξ) ^ 2 / c) (-(2 * (x - ξ)) / c) ξ := by
  have h := (((hasDerivAt_id' ξ).const_sub x).pow 2).div_const c
  convert h using 1
  simp

/-- **Lemma R (sharp form).** -/
theorem lemmaR_sharp (Φ : ℝ → ℝ) (α α' : ℝ → ℂ) {κ x a t : ℝ}
    (ha : 0 < a) (hxa : 0 < x - a) (ht : 0 ≤ t) (ht20 : t ≤ 20)
    (hΦ : ∀ ξ ∈ Icc (x - a) (x + a),
      HasDerivAt Φ ((α ξ + ((t / 2 : ℝ) : ℂ) * α ξ * α' ξ).re) ξ)
    (h1 : ∀ ξ ∈ Icc (x - a) (x + a),
      ‖α ξ - (((Lfun κ ξ / 2 : ℝ) : ℂ) + ((π / 4 : ℝ) : ℂ) * Complex.I)‖ ≤ 10 / ξ)
    (h2 : ∀ ξ ∈ Icc (x - a) (x + a), ‖α' ξ‖ ≤ 2 / ξ)
    (h3 : ∀ ξ ∈ Icc (x - a) (x + a), ‖α ξ‖ ≤ Lfun κ ξ / 2 + 1) :
    |(Φ (x + a) - Φ (x - a)) / 2 - a * Lfun κ x / 2| ≤
      a * (10 + t * (Lfun κ (x - a) / 2 + 1)) / (x - a) + a ^ 2 / (8 * (x - a)) := by
  obtain ⟨y, hy⟩ : ∃ y, y = x - a := ⟨_, rfl⟩
  rw [← hy] at hxa h1 h2 h3 hΦ ⊢
  obtain ⟨e0, he0⟩ : ∃ e0, e0 = (10 + t * (Lfun κ y / 2 + 1)) / y := ⟨_, rfl⟩
  have hx : 0 < x := by linarith
  have hyx : y ≤ x + a := by linarith
  have hyx' : y ≤ x := by linarith
  have hmemy : y ∈ Icc y (x + a) := ⟨le_refl _, hyx⟩
  have hLy : -2 ≤ Lfun κ y := by have := (norm_nonneg _).trans (h3 y hmemy); linarith
  have hpos : ∀ ξ ∈ Icc y (x + a), 0 < ξ := fun ξ hξ => lt_of_lt_of_le hxa hξ.1
  -- pointwise bound on G' = Re β − L/2
  have hG' : ∀ ξ ∈ Icc y (x + a),
      |(α ξ + ((t / 2 : ℝ) : ℂ) * α ξ * α' ξ).re - Lfun κ ξ / 2| ≤ e0 := fun ξ hξ => by
    rw [he0]
    exact (reBeta_bound (hpos ξ hξ) ht (h1 ξ hξ) (h2 ξ hξ) (h3 ξ hξ)).trans
      (bound_antitone hxa hξ.1 ht ht20 hLy)
  -- G = Φ − F with |G'| ≤ e0, in two one-sided forms
  have hup : -(Φ y - Fprim κ y - e0 * y) ≤ -(Φ (x + a) - Fprim κ (x + a) - e0 * (x + a)) :=
    le_of_hasDerivAt_nonneg (f := fun ξ => -(Φ ξ - Fprim κ ξ - e0 * ξ))
      (f' := fun ξ => -((α ξ + ((t / 2 : ℝ) : ℂ) * α ξ * α' ξ).re - Lfun κ ξ / 2 - e0 * 1)) hyx
      (fun ξ hξ => (((hΦ ξ hξ).sub (hasDerivAt_Fprim κ (hpos ξ hξ))).sub
        ((hasDerivAt_id' ξ).const_mul e0)).neg)
      (fun ξ hξ => by have := (abs_le.1 (hG' ξ hξ)).2; linarith)
  have hlo : Φ y - Fprim κ y + e0 * y ≤ Φ (x + a) - Fprim κ (x + a) + e0 * (x + a) :=
    le_of_hasDerivAt_nonneg (f := fun ξ => Φ ξ - Fprim κ ξ + e0 * ξ)
      (f' := fun ξ => (α ξ + ((t / 2 : ℝ) : ℂ) * α ξ * α' ξ).re - Lfun κ ξ / 2 + e0 * 1) hyx
      (fun ξ hξ => ((hΦ ξ hξ).sub (hasDerivAt_Fprim κ (hpos ξ hξ))).add
        ((hasDerivAt_id' ξ).const_mul e0))
      (fun ξ hξ => by have := (abs_le.1 (hG' ξ hξ)).1; linarith)
  -- K pieces, A = a²/(4y)
  obtain ⟨A, hA⟩ : ∃ A, A = a ^ 2 / (4 * y) := ⟨_, rfl⟩
  have hR0 : Kfun x x ≤ Kfun x (x + a) :=
    le_of_hasDerivAt_nonneg (by linarith) (fun ξ hξ => hasDerivAt_Kfun x (by linarith [hξ.1]))
      (fun ξ hξ => by have := Real.log_le_log hx hξ.1; linarith)
  have hR1 : (x - x) ^ 2 / (4 * y) - Kfun x x ≤ (x + a - x) ^ 2 / (4 * y) - Kfun x (x + a) :=
    le_of_hasDerivAt_nonneg (f := fun ξ => (ξ - x) ^ 2 / (4 * y) - Kfun x ξ)
      (f' := fun ξ => 2 * (ξ - x) / (4 * y) - (Real.log ξ - Real.log x) / 2)
      (by linarith : x ≤ x + a)
      (fun ξ hξ => (hasDerivAt_sqR x (4 * y) ξ).sub (hasDerivAt_Kfun x (by linarith [hξ.1])))
      (fun ξ hξ => by
        have hξ0 : 0 < ξ := by linarith [hξ.1]
        have hl : Real.log ξ - Real.log x ≤ (ξ - x) / y := by
          rw [← Real.log_div hξ0.ne' hx.ne']
          refine (Real.log_le_sub_one_of_pos (div_pos hξ0 hx)).trans ?_
          rw [div_sub_one hx.ne']
          exact div_le_div_of_nonneg_left (by linarith [hξ.1]) hxa (by linarith)
        have e : 2 * (ξ - x) / (4 * y) = (ξ - x) / y / 2 := by field_simp; ring
        rw [e]; linarith)
  have hL0 : -Kfun x y ≤ -Kfun x x :=
    le_of_hasDerivAt_nonneg (f := fun ξ => -Kfun x ξ)
      (f' := fun ξ => -((Real.log ξ - Real.log x) / 2)) hyx'
      (fun ξ hξ => (hasDerivAt_Kfun x (lt_of_lt_of_le hxa hξ.1)).neg)
      (fun ξ hξ => by have := Real.log_le_log (lt_of_lt_of_le hxa hξ.1) hξ.2; linarith)
  have hL1 : Kfun x y - (x - y) ^ 2 / (4 * y) ≤ Kfun x x - (x - x) ^ 2 / (4 * y) :=
    le_of_hasDerivAt_nonneg (f := fun ξ => Kfun x ξ - (x - ξ) ^ 2 / (4 * y))
      (f' := fun ξ => (Real.log ξ - Real.log x) / 2 - -(2 * (x - ξ)) / (4 * y)) hyx'
      (fun ξ hξ => (hasDerivAt_Kfun x (lt_of_lt_of_le hxa hξ.1)).sub (hasDerivAt_sqL x (4 * y) ξ))
      (fun ξ hξ => by
        have hξ0 : 0 < ξ := lt_of_lt_of_le hxa hξ.1
        have hl : Real.log x - Real.log ξ ≤ (x - ξ) / y := by
          rw [← Real.log_div hx.ne' hξ0.ne']
          refine (Real.log_le_sub_one_of_pos (div_pos hx hξ0)).trans ?_
          rw [div_sub_one hξ0.ne']
          exact div_le_div_of_nonneg_left (by linarith [hξ.2]) hxa hξ.1
        have e : -(2 * (x - ξ)) / (4 * y) = -((x - ξ) / y / 2) := by field_simp; ring
        rw [e]; linarith)
  have eA1 : (x + a - x) ^ 2 / (4 * y) = A := by rw [hA]; ring_nf
  have eA2 : (x - y) ^ 2 / (4 * y) = A := by rw [hA, hy]; ring_nf
  have eA0 : (x - x) ^ 2 / (4 * y) = 0 := by simp
  rw [eA1, eA0] at hR1
  rw [eA2, eA0] at hL1
  have hΔK : |Kfun x (x + a) - Kfun x y| ≤ A := by
    rw [abs_le]; constructor <;> linarith
  -- assemble
  have hsplit : (Φ (x + a) - Φ y) / 2 - a * Lfun κ x / 2 =
      ((Φ (x + a) - Fprim κ (x + a)) - (Φ y - Fprim κ y)) / 2 +
      (Kfun x (x + a) - Kfun x y) / 2 := by
    simp only [Fprim, Kfun, Lfun]; rw [hy]; ring
  rw [hsplit]
  have hA8 : A / 2 = a ^ 2 / (8 * y) := by rw [hA]; field_simp; ring
  have hfin : a * (10 + t * (Lfun κ y / 2 + 1)) / y = a * e0 := by rw [he0]; ring
  have he0a : e0 * (x + a) - e0 * y = 2 * a * e0 := by rw [hy]; ring
  rw [hfin, ← hA8]
  rw [abs_le] at hΔK ⊢
  constructor <;> nlinarith [hΔK.1, hΔK.2, hup, hlo, he0a]

/-- **Lemma R (paper form).** `|θ − aL(x)/2| ≤ ε_R`. -/
theorem lemmaR (Φ : ℝ → ℝ) (α α' : ℝ → ℂ) {κ x a t : ℝ}
    (ha : 0 < a) (hxa : 0 < x - a) (ht : 0 ≤ t) (ht20 : t ≤ 20)
    (hΦ : ∀ ξ ∈ Icc (x - a) (x + a),
      HasDerivAt Φ ((α ξ + ((t / 2 : ℝ) : ℂ) * α ξ * α' ξ).re) ξ)
    (h1 : ∀ ξ ∈ Icc (x - a) (x + a),
      ‖α ξ - (((Lfun κ ξ / 2 : ℝ) : ℂ) + ((π / 4 : ℝ) : ℂ) * Complex.I)‖ ≤ 10 / ξ)
    (h2 : ∀ ξ ∈ Icc (x - a) (x + a), ‖α' ξ‖ ≤ 2 / ξ)
    (h3 : ∀ ξ ∈ Icc (x - a) (x + a), ‖α ξ‖ ≤ Lfun κ ξ / 2 + 1) :
    |(Φ (x + a) - Φ (x - a)) / 2 - a * Lfun κ x / 2| ≤ epsR κ x a t := by
  refine (lemmaR_sharp Φ α α' ha hxa ht ht20 hΦ h1 h2 h3).trans ?_
  unfold epsR
  have : a ^ 2 / (8 * (x - a)) ≤ a ^ 2 / (4 * (x - a)) :=
    div_le_div_of_nonneg_left (sq_nonneg a) (by positivity) (by linarith)
  linarith

/-- **Numerical part of Lemma R.** On the stated range, `ε_R < 10⁻¹⁰` (any `κ ≥ 0`). -/
theorem epsR_lt {κ X x a t : ℝ} (hκ : 0 ≤ κ) (hX : 6 * 10 ^ 12 ≤ X) (ha : 0 < a) (ha2 : a < 2)
    (hx : X - 2 + a ≤ x) (ht : 0 ≤ t) (ht' : t ≤ 41 / 250) :
    epsR κ x a t < 1 / 10 ^ 10 := by
  obtain ⟨y, hy⟩ : ∃ y, y = x - a := ⟨_, rfl⟩
  obtain ⟨y0, hy0⟩ : ∃ y0 : ℝ, y0 = 6 * 10 ^ 12 - 2 := ⟨_, rfl⟩
  have hyy0 : y0 ≤ y := by rw [hy, hy0]; linarith
  have hy0pos : 0 < y0 := by rw [hy0]; norm_num
  have hypos : 0 < y := lt_of_lt_of_le hy0pos hyy0
  -- log y0 ≤ 31 via e > 2.7
  have hlog0 : Real.log y0 ≤ 31 := by
    rw [Real.log_le_iff_le_exp hy0pos]
    have he : (2.7 : ℝ) ^ 31 ≤ Real.exp 1 ^ 31 :=
      pow_le_pow_left₀ (by norm_num) (by linarith [Real.exp_one_gt_d9]) 31
    rw [Real.exp_one_pow] at he
    have : y0 ≤ (2.7 : ℝ) ^ 31 := by rw [hy0]; norm_num
    exact_mod_cast this.trans he
  -- log y ≤ log y0 + y / y0 − 1
  have hlog : Real.log y ≤ 30 + y / y0 := by
    have h := Real.log_le_sub_one_of_pos (div_pos hypos hy0pos)
    rw [Real.log_div hypos.ne' hy0pos.ne'] at h
    linarith
  have hL : Lfun κ y ≤ 30 + y / y0 := by unfold Lfun; linarith
  obtain ⟨r, hr⟩ : ∃ r, r = y / y0 := ⟨_, rfl⟩
  have hr1 : 1 ≤ r := by rw [hr, le_div_iff₀ hy0pos]; linarith
  have hyr : y = r * y0 := by rw [hr]; exact (div_mul_cancel₀ y hy0pos.ne').symm
  obtain ⟨B, hB⟩ : ∃ B, B = 10 + t * (Lfun κ y / 2 + 1) := ⟨_, rfl⟩
  obtain ⟨B1, hB1⟩ : ∃ B1 : ℝ, B1 = 10 + 41 / 250 * (15 + r / 2 + 1) := ⟨_, rfl⟩
  have hBB1 : B ≤ B1 := by
    have h1 : t * (Lfun κ y / 2 + 1) ≤ t * (15 + r / 2 + 1) :=
      mul_le_mul_of_nonneg_left (by linarith) ht
    have h2 : t * (15 + r / 2 + 1) ≤ 41 / 250 * (15 + r / 2 + 1) :=
      mul_le_mul_of_nonneg_right ht' (by linarith)
    rw [hB, hB1]; linarith
  have hB1pos : 0 ≤ B1 := by rw [hB1]; positivity
  have haB : a * B ≤ 2 * B1 :=
    (mul_le_mul_of_nonneg_left hBB1 ha.le).trans (mul_le_mul_of_nonneg_right ha2.le hB1pos)
  have ha4 : a ^ 2 ≤ 4 := by nlinarith
  have hstep : epsR κ x a t ≤ (2 * B1 + 1) / y := by
    unfold epsR
    rw [← hy, ← hB]
    have e1 : a * B / y ≤ 2 * B1 / y := div_le_div_of_nonneg_right haB hypos.le
    have e2 : a ^ 2 / (4 * y) ≤ 1 / y := by
      rw [div_le_div_iff₀ (by positivity) hypos]; nlinarith
    have e3 : (2 * B1 + 1) / y = 2 * B1 / y + 1 / y := add_div _ _ _
    linarith
  refine lt_of_le_of_lt hstep ?_
  rw [div_lt_iff₀ hypos, hyr, hB1, hy0]
  nlinarith

/-- With `κ = log(4π)`, `Lfun κ ξ = log(ξ/(4π))`, the paper's `L` (AF; `joint-pair-arbitrary-shift.md`). -/
lemma Lfun_fourPi {ξ : ℝ} (hξ : 0 < ξ) : Lfun (Real.log (4 * π)) ξ = Real.log (ξ / (4 * π)) := by
  rw [Lfun, Real.log_div hξ.ne' (by positivity)]

lemma log_fourPi_nonneg : 0 ≤ Real.log (4 * π) :=
  Real.log_nonneg (by nlinarith [Real.pi_gt_three])

/-- **Lemma R, paper form with `L = log(ξ/4π)`**: on `X ≥ 6·10¹²`, `0 < a < 2`, `x ≥ X − 2 + a`,
`0 ≤ t ≤ 41/250`, and given the AF (4.6) estimates and `Φ' = Re β_t` on `[x−a, x+a]`,
`|θ − aL(x)/2| ≤ ε_R < 10⁻¹⁰`. -/
theorem lemmaR_paper (Φ : ℝ → ℝ) (α α' : ℝ → ℂ) {X x a t : ℝ}
    (hX : 6 * 10 ^ 12 ≤ X) (ha : 0 < a) (ha2 : a < 2) (hx : X - 2 + a ≤ x)
    (ht : 0 ≤ t) (ht' : t ≤ 41 / 250)
    (hΦ : ∀ ξ ∈ Icc (x - a) (x + a),
      HasDerivAt Φ ((α ξ + ((t / 2 : ℝ) : ℂ) * α ξ * α' ξ).re) ξ)
    (h1 : ∀ ξ ∈ Icc (x - a) (x + a),
      ‖α ξ - (((Real.log (ξ / (4 * π)) / 2 : ℝ) : ℂ) + ((π / 4 : ℝ) : ℂ) * Complex.I)‖ ≤ 10 / ξ)
    (h2 : ∀ ξ ∈ Icc (x - a) (x + a), ‖α' ξ‖ ≤ 2 / ξ)
    (h3 : ∀ ξ ∈ Icc (x - a) (x + a), ‖α ξ‖ ≤ Real.log (ξ / (4 * π)) / 2 + 1) :
    |(Φ (x + a) - Φ (x - a)) / 2 - a * Real.log (x / (4 * π)) / 2| ≤
        epsR (Real.log (4 * π)) x a t ∧
      epsR (Real.log (4 * π)) x a t < 1 / 10 ^ 10 := by
  have hxa : 0 < x - a := by nlinarith
  have hpos : ∀ ξ ∈ Icc (x - a) (x + a), 0 < ξ := fun ξ hξ => lt_of_lt_of_le hxa hξ.1
  refine ⟨?_, epsR_lt log_fourPi_nonneg hX ha ha2 hx ht ht'⟩
  rw [← Lfun_fourPi (by linarith : 0 < x)]
  exact lemmaR Φ α α' ha hxa ht (by linarith)
    hΦ (fun ξ hξ => by rw [Lfun_fourPi (hpos ξ hξ)]; exact h1 ξ hξ) h2
    (fun ξ hξ => by rw [Lfun_fourPi (hpos ξ hξ)]; exact h3 ξ hξ)

end RaymondCore.LemmaR
