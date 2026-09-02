/-
  DiniGate — machine-checked per-box Dini gate (Lemma B3 of the general-mollifier
  y-transfer, provenance/Y_TRANSFER_GENMOLL_THEOREM.md).

  The finite-lane summand, as a function of the height `y`, is
      f y = (P + exp(g·y)·|A y|) · (W0 · exp(-(L/2)·y)),
  where P = |B_n| ≥ 0 is the y-independent B-side, exp(g·y) = γ_N(y) the A-side
  gamma, |A y| = |A_n(y)| the A-side divisor sum, and W0·exp(-(L/2)·y) = n^{-σ(y)}
  the height factor (σ'(y) = 1/2).  `A` is a finite exponential sum in `y`
  (Dirichlet-type), hence everywhere differentiable; here it is any differentiable
  function with derivative `A'`.

  Lemma B3 states: the per-box "gate"
      exp(g·y)·((g - L/2)·|A y| + |A' y|) ≤ (L/2)·P
  forces f'(y) ≤ 0.  This is the analytic implication that the Arb verifier's
  numerical gate discharges; formalizing it independently checks Fable's
  derivative bound (the one analytic link not otherwise re-derived).

  This file proves, sorry-free and axiom-clean:
    • `summand_deriv_nonpos` — the POINTWISE bound (gate ⇒ deriv ≤ 0 at A ≠ 0);
    • `summand_antitone` — the GLOBAL statement: if `A` is differentiable
      everywhere and the gate holds at every height, the summand is antitone in
      `y` on `[a,b]`.  The `|A|` corners at zeros of `A` are handled directly by
      the one-sided (right) derivative (`hasDerivWithinAt_abs_of_zero` +
      `summand_deriv_corner`), where the gate reads `exp(g·x)|A' x| ≤ (L/2)P`;
      no countable-zeros / a.e. hypothesis is needed.
-/
import Mathlib

namespace DiniGate

open Real Filter Topology

/-- Derivative of `|A ·|` at a point where `A y ≠ 0`: locally `A` keeps its
    sign, so `|A ·|` agrees with `± A` near `y`. -/
lemma hasDerivAt_abs_of_ne {A A' : ℝ → ℝ} {y : ℝ}
    (hA : HasDerivAt A (A' y) y) (hne : A y ≠ 0) :
    HasDerivAt (fun t => |A t|) (Real.sign (A y) * A' y) y := by
  have hcont : ContinuousAt A y := hA.continuousAt
  rcases hne.lt_or_gt with hlt | hgt
  · -- A y < 0 : |A ·| =ᶠ -A
    have hnhds : A ⁻¹' Set.Iio 0 ∈ 𝓝 y := hcont.preimage_mem_nhds (Iio_mem_nhds hlt)
    have hev : (fun t => |A t|) =ᶠ[𝓝 y] fun t => -A t := by
      filter_upwards [hnhds] with t ht
      exact abs_of_neg ht
    rw [Real.sign_of_neg hlt]
    have := (hA.neg).congr_of_eventuallyEq hev
    simpa [neg_one_mul] using this
  · -- 0 < A y : |A ·| =ᶠ A
    have hnhds : A ⁻¹' Set.Ioi 0 ∈ 𝓝 y := hcont.preimage_mem_nhds (Ioi_mem_nhds hgt)
    have hev : (fun t => |A t|) =ᶠ[𝓝 y] fun t => A t := by
      filter_upwards [hnhds] with t ht
      exact abs_of_pos ht
    rw [Real.sign_of_pos hgt]
    have := hA.congr_of_eventuallyEq hev
    simpa [one_mul] using this

/-- Right derivative of `|A ·|` at a zero of `A`: it equals `|A' x|`
    (from the right, `|A t| / (t - x) = |slope A x t| → |A' x|`). -/
lemma hasDerivWithinAt_abs_of_zero {A A' : ℝ → ℝ} {x : ℝ}
    (hA : HasDerivWithinAt A (A' x) (Set.Ici x) x) (h0 : A x = 0) :
    HasDerivWithinAt (fun t => |A t|) (|A' x|) (Set.Ici x) x := by
  rw [hasDerivWithinAt_iff_tendsto_slope] at hA ⊢
  refine (hA.abs).congr' ?_
  filter_upwards [self_mem_nhdsWithin] with t ht
  rcases ht with ⟨hti, htne⟩
  rw [Set.mem_Ici] at hti
  rw [Set.mem_singleton_iff] at htne
  have htx : x < t := hti.lt_of_ne (Ne.symm htne)
  rw [slope_def_field, slope_def_field, h0]
  simp only [abs_zero, sub_zero]
  rw [abs_div, abs_of_pos (sub_pos.mpr htx)]

/-- Clean `HasDerivAt` for the summand at a point with `A y ≠ 0` (the derivative
    value stated as `deriv f y`, avoiding a beta-expanded product-rule term). -/
lemma summand_hasDerivAt
    (P g L W0 : ℝ) (A A' : ℝ → ℝ) (y : ℝ)
    (hA : HasDerivAt A (A' y) y) (hne : A y ≠ 0) :
    HasDerivAt (fun t => (P + Real.exp (g * t) * |A t|) * (W0 * Real.exp (-(L / 2) * t)))
      (deriv (fun t => (P + Real.exp (g * t) * |A t|) * (W0 * Real.exp (-(L / 2) * t))) y) y := by
  have hE : HasDerivAt (fun t => Real.exp (g * t)) (Real.exp (g * y) * g) y := by
    simpa using ((hasDerivAt_id y).const_mul g).exp
  have hEabs := hE.mul (hasDerivAt_abs_of_ne hA hne)
  have hu := hEabs.const_add P
  have hv : HasDerivAt (fun t => W0 * Real.exp (-(L / 2) * t))
      (W0 * (Real.exp (-(L / 2) * y) * (-(L / 2)))) y := by
    have : HasDerivAt (fun t => Real.exp (-(L / 2) * t)) (Real.exp (-(L / 2) * y) * (-(L / 2))) y := by
      simpa using ((hasDerivAt_id y).const_mul (-(L / 2))).exp
    exact this.const_mul W0
  have hf : HasDerivAt
      (fun t => (P + Real.exp (g * t) * |A t|) * (W0 * Real.exp (-(L / 2) * t))) _ y :=
    hu.mul hv
  rwa [hf.deriv]

/-- **Lemma B3 (per-box Dini gate), pointwise.**  At any height `y` with
    `A y ≠ 0`, the gate inequality forces the summand's derivative to be `≤ 0`.
    Proven sorry-free. -/
theorem summand_deriv_nonpos
    (P g L W0 : ℝ) (A A' : ℝ → ℝ) (y : ℝ)
    (hP : 0 ≤ P) (hW0 : 0 ≤ W0)
    (hA : HasDerivAt A (A' y) y) (hne : A y ≠ 0)
    (hgate : Real.exp (g * y) * ((g - L / 2) * |A y| + |A' y|) ≤ (L / 2) * P) :
    deriv (fun t => (P + Real.exp (g * t) * |A t|) * (W0 * Real.exp (-(L / 2) * t))) y ≤ 0 := by
  -- pieces
  have hE : HasDerivAt (fun t => Real.exp (g * t)) (Real.exp (g * y) * g) y := by
    simpa using ((hasDerivAt_id y).const_mul g).exp
  have habs := hasDerivAt_abs_of_ne hA hne
  -- u = P + exp(g·)·|A·|
  have hEabs : HasDerivAt (fun t => Real.exp (g * t) * |A t|)
      (Real.exp (g * y) * g * |A y| + Real.exp (g * y) * (Real.sign (A y) * A' y)) y :=
    hE.mul habs
  have hu : HasDerivAt (fun t => P + Real.exp (g * t) * |A t|)
      (Real.exp (g * y) * g * |A y| + Real.exp (g * y) * (Real.sign (A y) * A' y)) y :=
    hEabs.const_add P
  -- v = W0·exp(-(L/2)·)
  have hv : HasDerivAt (fun t => W0 * Real.exp (-(L / 2) * t))
      (W0 * (Real.exp (-(L / 2) * y) * (-(L / 2)))) y := by
    have : HasDerivAt (fun t => Real.exp (-(L / 2) * t)) (Real.exp (-(L / 2) * y) * (-(L / 2))) y := by
      simpa using ((hasDerivAt_id y).const_mul (-(L / 2))).exp
    exact this.const_mul W0
  -- f = u·v  (ascribe the function so `hf.deriv` matches the goal's `deriv`)
  have hf : HasDerivAt
      (fun t => (P + Real.exp (g * t) * |A t|) * (W0 * Real.exp (-(L / 2) * t))) _ y :=
    hu.mul hv
  -- sign(A y)·A' y ≤ |A' y|
  have hsign : Real.sign (A y) * A' y ≤ |A' y| := by
    rcases hne.lt_or_gt with h0 | h0
    · rw [Real.sign_of_neg h0]; simpa [neg_one_mul] using neg_le_abs (A' y)
    · rw [Real.sign_of_pos h0]; simpa [one_mul] using le_abs_self (A' y)
  -- the bracket exp(g·y)·((g-L/2)|A| + sign·A') - (L/2)P ≤ 0
  have hexp_pos : 0 < Real.exp (g * y) := Real.exp_pos _
  have hbracket :
      Real.exp (g * y) * ((g - L / 2) * |A y| + Real.sign (A y) * A' y) - (L / 2) * P ≤ 0 := by
    have h1 : Real.exp (g * y) * ((g - L / 2) * |A y| + Real.sign (A y) * A' y)
            ≤ Real.exp (g * y) * ((g - L / 2) * |A y| + |A' y|) :=
      mul_le_mul_of_nonneg_left (by linarith [hsign]) hexp_pos.le
    linarith [hgate]
  -- height factor is nonnegative
  have hvy_nonneg : 0 ≤ W0 * Real.exp (-(L / 2) * y) :=
    mul_nonneg hW0 (Real.exp_pos _).le
  -- product-rule expression = bracket · (height factor)
  have key :
      (Real.exp (g * y) * g * |A y| + Real.exp (g * y) * (Real.sign (A y) * A' y))
          * (W0 * Real.exp (-(L / 2) * y))
        + (P + Real.exp (g * y) * |A y|) * (W0 * (Real.exp (-(L / 2) * y) * (-(L / 2))))
      = (Real.exp (g * y) * ((g - L / 2) * |A y| + Real.sign (A y) * A' y) - (L / 2) * P)
          * (W0 * Real.exp (-(L / 2) * y)) := by ring
  rw [hf.deriv]
  show (Real.exp (g * y) * g * |A y| + Real.exp (g * y) * (Real.sign (A y) * A' y))
          * (W0 * Real.exp (-(L / 2) * y))
        + (P + Real.exp (g * y) * |A y|) * (W0 * (Real.exp (-(L / 2) * y) * (-(L / 2)))) ≤ 0
  rw [key]
  exact mul_nonpos_iff.mpr (Or.inr ⟨hbracket, hvy_nonneg⟩)

/-- Gluing wrapper: a continuous function on `[a,b]` whose right derivative exists
    and is `≤ 0` at every point of `[a,b)` is antitone on `[a,b]`.  (Standard
    right-derivative fencing; tolerates the `|A|` corners since only the
    one-sided derivative is required.) -/
theorem antitoneOn_Icc_of_hasDerivWithinAt_Ici_nonpos
    {f f' : ℝ → ℝ} {a b : ℝ}
    (hf : ContinuousOn f (Set.Icc a b))
    (hf' : ∀ x ∈ Set.Ico a b, HasDerivWithinAt f (f' x) (Set.Ici x) x)
    (hnonpos : ∀ x ∈ Set.Ico a b, f' x ≤ 0) :
    AntitoneOn f (Set.Icc a b) := by
  intro x1 hx1 x2 hx2 hle
  have hsub : Set.Icc x1 b ⊆ Set.Icc a b := Set.Icc_subset_Icc hx1.1 le_rfl
  have hmain : ∀ ⦃x⦄, x ∈ Set.Icc x1 b → f x ≤ f x1 :=
    image_le_of_deriv_right_le_deriv_boundary (f := f) (f' := f')
      (B := fun _ => f x1) (B' := fun _ => (0 : ℝ))
      (hf.mono hsub)
      (fun x hx => hf' x ⟨le_trans hx1.1 hx.1, hx.2⟩)
      (le_refl (f x1)) continuousOn_const
      (fun x _ => (hasDerivAt_const x (f x1)).hasDerivWithinAt)
      (fun x hx => hnonpos x ⟨le_trans hx1.1 hx.1, hx.2⟩)
  exact hmain ⟨hle, hx2.2⟩

/-- Corner case: at a zero of `A` the summand still has a right derivative, and
    the gate (where `|A x| = 0`, so it reads `exp(g x)|A' x| ≤ (L/2)P`) forces it
    `≤ 0`.  `|A|`'s right derivative at the zero is `|A' x|`. -/
lemma summand_deriv_corner
    (P g L W0 : ℝ) (A A' : ℝ → ℝ) (x : ℝ)
    (hP : 0 ≤ P) (hW0 : 0 ≤ W0)
    (hA : HasDerivAt A (A' x) x) (h0 : A x = 0)
    (hgate : Real.exp (g * x) * ((g - L / 2) * |A x| + |A' x|) ≤ (L / 2) * P) :
    ∃ d : ℝ, d ≤ 0 ∧ HasDerivWithinAt
      (fun t => (P + Real.exp (g * t) * |A t|) * (W0 * Real.exp (-(L / 2) * t)))
      d (Set.Ici x) x := by
  have habsw := hasDerivWithinAt_abs_of_zero hA.hasDerivWithinAt h0
  have hEw : HasDerivWithinAt (fun t => Real.exp (g * t)) (Real.exp (g * x) * g) (Set.Ici x) x := by
    simpa using (((hasDerivAt_id x).const_mul g).exp).hasDerivWithinAt
  have hEabsw := hEw.mul habsw
  have huw := hEabsw.const_add P
  have hvw : HasDerivWithinAt (fun t => W0 * Real.exp (-(L / 2) * t))
      (W0 * (Real.exp (-(L / 2) * x) * (-(L / 2)))) (Set.Ici x) x := by
    have : HasDerivWithinAt (fun t => Real.exp (-(L / 2) * t)) (Real.exp (-(L / 2) * x) * (-(L / 2))) (Set.Ici x) x := by
      simpa using (((hasDerivAt_id x).const_mul (-(L / 2))).exp).hasDerivWithinAt
    exact this.const_mul W0
  have hfw : HasDerivWithinAt
      (fun t => (P + Real.exp (g * t) * |A t|) * (W0 * Real.exp (-(L / 2) * t))) _ (Set.Ici x) x :=
    huw.mul hvw
  refine ⟨_, ?_, hfw⟩
  show (Real.exp (g * x) * g * |A x| + Real.exp (g * x) * |A' x|) * (W0 * Real.exp (-(L / 2) * x))
      + (P + Real.exp (g * x) * |A x|) * (W0 * (Real.exp (-(L / 2) * x) * (-(L / 2)))) ≤ 0
  have hgate' : Real.exp (g * x) * |A' x| ≤ (L / 2) * P := by
    rw [h0] at hgate; simpa using hgate
  have hvpos : 0 ≤ W0 * Real.exp (-(L / 2) * x) := mul_nonneg hW0 (Real.exp_pos _).le
  have hkey : Real.exp (g * x) * |A' x| * (W0 * Real.exp (-(L / 2) * x))
            ≤ (L / 2) * P * (W0 * Real.exp (-(L / 2) * x)) :=
    mul_le_mul_of_nonneg_right hgate' hvpos
  rw [h0]
  simp only [abs_zero, mul_zero, zero_add, add_zero]
  nlinarith [hkey, hvpos]

/-- **Lemma B3 — global.**  If `A` is differentiable everywhere (a finite
    exponential sum in the application) and the per-box gate holds at every
    height, then the finite-lane summand is antitone in `y` on any `[a,b]`.  The
    `|A|` corners at zeros of `A` are handled by the corner right-derivative;
    everywhere else the two-sided derivative is `≤ 0` (Lemma B3 pointwise).
    Proven sorry-free. -/
theorem summand_antitone
    (P g L W0 : ℝ) (A A' : ℝ → ℝ) (a b : ℝ)
    (hP : 0 ≤ P) (hW0 : 0 ≤ W0)
    (hA : ∀ t, HasDerivAt A (A' t) t)
    (hgate : ∀ t, Real.exp (g * t) * ((g - L / 2) * |A t| + |A' t|) ≤ (L / 2) * P) :
    AntitoneOn (fun t => (P + Real.exp (g * t) * |A t|) * (W0 * Real.exp (-(L / 2) * t)))
      (Set.Icc a b) := by
  have hAcont : Continuous A := continuous_iff_continuousAt.mpr (fun t => (hA t).continuousAt)
  have hAabs : Continuous (fun t => |A t|) := hAcont.abs
  have hfcont : Continuous
      (fun t => (P + Real.exp (g * t) * |A t|) * (W0 * Real.exp (-(L / 2) * t))) := by fun_prop
  have hkey : ∀ x, ∃ d : ℝ, d ≤ 0 ∧ HasDerivWithinAt
      (fun t => (P + Real.exp (g * t) * |A t|) * (W0 * Real.exp (-(L / 2) * t))) d (Set.Ici x) x := by
    intro x
    by_cases hx0 : A x = 0
    · exact summand_deriv_corner P g L W0 A A' x hP hW0 (hA x) hx0 (hgate x)
    · exact ⟨_, summand_deriv_nonpos P g L W0 A A' x hP hW0 (hA x) hx0 (hgate x),
             (summand_hasDerivAt P g L W0 A A' x (hA x) hx0).hasDerivWithinAt⟩
  refine antitoneOn_Icc_of_hasDerivWithinAt_Ici_nonpos
    (f' := fun x => derivWithin
      (fun t => (P + Real.exp (g * t) * |A t|) * (W0 * Real.exp (-(L / 2) * t))) (Set.Ici x) x)
    hfcont.continuousOn ?_ ?_
  · intro x _
    obtain ⟨d, _, hderiv⟩ := hkey x
    simp only []
    rw [hderiv.derivWithin (uniqueDiffWithinAt_Ici x)]
    exact hderiv
  · intro x _
    obtain ⟨d, hd, hderiv⟩ := hkey x
    simp only []
    rw [hderiv.derivWithin (uniqueDiffWithinAt_Ici x)]
    exact hd

end DiniGate


#print axioms DiniGate.summand_antitone
#print axioms DiniGate.summand_deriv_corner
#print axioms DiniGate.hasDerivWithinAt_abs_of_zero
#print axioms DiniGate.summand_deriv_nonpos
