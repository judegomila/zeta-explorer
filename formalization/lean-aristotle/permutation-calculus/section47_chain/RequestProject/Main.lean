import Mathlib

open scoped BigOperators
open scoped Real
open scoped Nat
open scoped Classical
open scoped Pointwise

set_option maxHeartbeats 8000000
set_option maxRecDepth 4000
set_option synthInstance.maxHeartbeats 20000
set_option synthInstance.maxSize 128

set_option relaxedAutoImplicit false
set_option autoImplicit false

set_option pp.fullNames true
set_option pp.structureInstances true
set_option pp.coercions.types true
set_option pp.funBinderTypes true
set_option pp.letVarTypes true
set_option pp.piBinderTypes true

set_option grind.warning false

/-!
# The §4.7 implication chain: from a packet estimate to Theorem 4.1(ii)

Formalization of `job13_section47_chain.tex`, i.e. of §4.7 ("The missing
implication chain, made explicit") of *Permuting the Zeta Twin Ladder*,
eqs. (21)–(23), together with §4.1 (Theorem 4.1) and eq. (19).

The file contains:

* `ZetaTwinLadder.negRealAxis` : the cut `𝓛 = (-∞, 0] ⊆ ℂ`;
* `ZetaTwinLadder.infDist_ge_sub` : **Lemma 1**, distance to a set is
  1-Lipschitz;
* `ZetaTwinLadder.prop2_infDist_Q_gt`, `ZetaTwinLadder.prop2_infDist_Ah_pos`,
  `ZetaTwinLadder.prop2_infDist_Q_pos`, `ZetaTwinLadder.prop2_avoids`, `ZetaTwinLadder.prop2_A_ne_zero`,
  `ZetaTwinLadder.prop2_h_ne_zero` : **Proposition 2** (pointwise avoidance),
  stated unconditionally for complex numbers satisfying (H0)–(H4);
* `ZetaTwinLadder.HasWinding` : winding number of a loop, defined through a
  continuous logarithm along the loop;
* `ZetaTwinLadder.hasWinding_zero_of_mapsTo_slitPlane`,
  `ZetaTwinLadder.prop3_wind_quotient_zero` : **Proposition 3** (zero winding);
* `ZetaTwinLadder.theorem4_chain` : **Theorem 4**, the conditional chain whose
  hypotheses are exactly (H0)–(H6).

The analytic inputs (H5) (certified canonical logarithm / closed ledger) and
(H6) (argument-principle packaging) are hypotheses, as in the source, and so is
the strict inequality (H4), which is the paper's open weld.
-/

namespace ZetaTwinLadder

open Complex Metric Set

/-! ## The cut `𝓛 = (-∞, 0]` -/

/-- The cut `𝓛 = (-∞,0] ⊆ ℂ`: the complex numbers with zero imaginary part and
nonpositive real part. -/
def negRealAxis : Set ℂ := {z : ℂ | z.im = 0 ∧ z.re ≤ 0}

@[simp] theorem zero_mem_negRealAxis : (0 : ℂ) ∈ negRealAxis := by
  simp [negRealAxis]

theorem negRealAxis_nonempty : negRealAxis.Nonempty :=
  ⟨0, zero_mem_negRealAxis⟩

/-- `𝓛 = (-∞,0]` is exactly the complement of Mathlib's slit plane. -/
theorem negRealAxis_eq_compl_slitPlane : negRealAxis = Complex.slitPlaneᶜ := by
  ext z
  simp only [negRealAxis, Set.mem_setOf_eq, Set.mem_compl_iff, Complex.mem_slitPlane_iff,
    not_or, not_lt, not_not]
  tauto

theorem mem_slitPlane_of_notMem_negRealAxis {z : ℂ} (hz : z ∉ negRealAxis) :
    z ∈ Complex.slitPlane := by
  rw [negRealAxis_eq_compl_slitPlane] at hz
  simpa using hz

/-! ## Lemma 1 : the distance to a set is 1-Lipschitz -/

/-- **Lemma 1.** For any set `S ⊆ ℂ` and any `z w : ℂ`,
`dist(w, S) ≥ dist(z, S) - |z - w|`. -/
theorem infDist_ge_sub (S : Set ℂ) (z w : ℂ) :
    Metric.infDist z S - ‖z - w‖ ≤ Metric.infDist w S := by
  have h : Metric.infDist z S ≤ Metric.infDist w S + dist z w :=
    Metric.infDist_le_infDist_add_dist
  rw [Complex.dist_eq] at h
  linarith

/-! ## Proposition 2 : pointwise avoidance (paper (22)–(23))

Here `C, Q, E, A, h` are complex numbers (the values at a point `x ∈ Γ` of
`C₉₇, Q₉₇, E₉₇, A₉₇, H_{t₀}/B_{t₀}`), `m, ε, Rex` are reals (the values of
`m₉₇`, `ε_tr` and the exact global reserve `R_ex` of eq. (19)). -/

section Proposition2

variable {C Q E A h : ℂ} {m eps Rex : ℝ}

/-- The quantity `|A| ε` is nonnegative; this follows from (H2) alone. -/
theorem norm_mul_eps_nonneg (H2 : ‖A * h - Q‖ ≤ ‖A‖ * eps) : 0 ≤ ‖A‖ * eps :=
  le_trans (norm_nonneg _) H2

/-- **Proposition 2, first chain (paper (22)).** Under (H0), (H1), (H3), (H4),
`dist(Q, 𝓛) ≥ dist(C, 𝓛) - |E| > |A| ε`. -/
theorem prop2_infDist_Q_gt
    (H0 : E = C - Q) (H1 : m ≤ Metric.infDist C negRealAxis)
    (H3 : Rex ≤ m - ‖A‖ * eps) (H4 : ‖E‖ < Rex) :
    ‖A‖ * eps < Metric.infDist Q negRealAxis := by
  have hL := infDist_ge_sub negRealAxis C Q
  rw [← H0] at hL
  linarith

/-- **Proposition 2:** in particular `dist(Q, 𝓛) > 0`. -/
theorem prop2_infDist_Q_pos
    (H0 : E = C - Q) (H1 : m ≤ Metric.infDist C negRealAxis)
    (H2 : ‖A * h - Q‖ ≤ ‖A‖ * eps)
    (H3 : Rex ≤ m - ‖A‖ * eps) (H4 : ‖E‖ < Rex) :
    0 < Metric.infDist Q negRealAxis :=
  lt_of_le_of_lt (norm_mul_eps_nonneg H2) (prop2_infDist_Q_gt H0 H1 H3 H4)

/-- **Proposition 2, second chain (paper (23)).** Under (H0)–(H4),
`dist(A·h, 𝓛) ≥ dist(Q, 𝓛) - |A| ε > 0`. -/
theorem prop2_infDist_Ah_pos
    (H0 : E = C - Q) (H1 : m ≤ Metric.infDist C negRealAxis)
    (H2 : ‖A * h - Q‖ ≤ ‖A‖ * eps)
    (H3 : Rex ≤ m - ‖A‖ * eps) (H4 : ‖E‖ < Rex) :
    0 < Metric.infDist (A * h) negRealAxis := by
  have hQ : ‖A‖ * eps < Metric.infDist Q negRealAxis := prop2_infDist_Q_gt H0 H1 H3 H4
  have hL := infDist_ge_sub negRealAxis Q (A * h)
  have hle : ‖Q - A * h‖ ≤ ‖A‖ * eps := by
    rw [← norm_neg]; simpa using H2
  linarith

/-- **Proposition 2, avoidance.** Under (H0)–(H4), `A·h ∉ (-∞, 0]`. -/
theorem prop2_avoids
    (H0 : E = C - Q) (H1 : m ≤ Metric.infDist C negRealAxis)
    (H2 : ‖A * h - Q‖ ≤ ‖A‖ * eps)
    (H3 : Rex ≤ m - ‖A‖ * eps) (H4 : ‖E‖ < Rex) :
    A * h ∉ negRealAxis := by
  intro hmem
  have := prop2_infDist_Ah_pos H0 H1 H2 H3 H4 (h := h)
  rw [Metric.infDist_zero_of_mem hmem] at this
  exact lt_irrefl _ this

/-- **Proposition 2, avoidance, restated:** `A·h` lies in the slit plane. -/
theorem prop2_mem_slitPlane
    (H0 : E = C - Q) (H1 : m ≤ Metric.infDist C negRealAxis)
    (H2 : ‖A * h - Q‖ ≤ ‖A‖ * eps)
    (H3 : Rex ≤ m - ‖A‖ * eps) (H4 : ‖E‖ < Rex) :
    A * h ∈ Complex.slitPlane :=
  mem_slitPlane_of_notMem_negRealAxis (prop2_avoids H0 H1 H2 H3 H4)

/-- **Proposition 2:** since `0 ∈ 𝓛`, avoidance forces `A ≠ 0`. -/
theorem prop2_A_ne_zero
    (H0 : E = C - Q) (H1 : m ≤ Metric.infDist C negRealAxis)
    (H2 : ‖A * h - Q‖ ≤ ‖A‖ * eps)
    (H3 : Rex ≤ m - ‖A‖ * eps) (H4 : ‖E‖ < Rex) :
    A ≠ 0 := by
  intro hA
  exact prop2_avoids H0 H1 H2 H3 H4 (by simp [hA])

/-- **Proposition 2:** since `0 ∈ 𝓛`, avoidance forces `h ≠ 0`, i.e.
`H_{t₀} ≠ 0` at the point. -/
theorem prop2_h_ne_zero
    (H0 : E = C - Q) (H1 : m ≤ Metric.infDist C negRealAxis)
    (H2 : ‖A * h - Q‖ ≤ ‖A‖ * eps)
    (H3 : Rex ≤ m - ‖A‖ * eps) (H4 : ‖E‖ < Rex) :
    h ≠ 0 := by
  intro hh
  exact prop2_avoids H0 H1 H2 H3 H4 (by simp [hh])

end Proposition2

/-! ## Winding numbers via a continuous logarithm

A loop is modelled as a map `ℝ → ℂ` restricted to the parameter interval
`[0,1]`.  `HasWinding g n` says that `g` admits a continuous logarithm `Lg`
along the loop whose total increment is `2πi n`. -/

/-- `HasWinding g n`: the loop `g : [0,1] → ℂ` admits a continuous logarithm
along `[0,1]` whose increment over the loop is `2πi n`; i.e. the winding number
of `g` about `0` is `n`. -/
def HasWinding (g : ℝ → ℂ) (n : ℤ) : Prop :=
  ∃ Lg : ℝ → ℂ, ContinuousOn Lg (Set.Icc 0 1) ∧
    (∀ t ∈ Set.Icc (0 : ℝ) 1, g t = Complex.exp (Lg t)) ∧
    Lg 1 - Lg 0 = 2 * Real.pi * Complex.I * (n : ℂ)

theorem HasWinding.congr {f g : ℝ → ℂ} {n : ℤ} (hf : HasWinding f n)
    (hfg : ∀ t ∈ Set.Icc (0 : ℝ) 1, f t = g t) : HasWinding g n := by
  obtain ⟨Lg, hcont, hexp, hincr⟩ := hf
  exact ⟨Lg, hcont, fun t ht => by rw [← hfg t ht]; exact hexp t ht, hincr⟩

/-- A loop with a continuous logarithm never vanishes on `[0,1]`. -/
theorem HasWinding.ne_zero {f : ℝ → ℂ} {n : ℤ} (hf : HasWinding f n)
    {t : ℝ} (ht : t ∈ Set.Icc (0 : ℝ) 1) : f t ≠ 0 := by
  obtain ⟨Lg, _, hexp, _⟩ := hf
  rw [hexp t ht]
  exact Complex.exp_ne_zero _

/-- Winding numbers subtract under quotients. -/
theorem HasWinding.div {f g : ℝ → ℂ} {m n : ℤ}
    (hf : HasWinding f m) (hg : HasWinding g n) :
    HasWinding (fun t => f t / g t) (m - n) := by
  obtain ⟨Lf, hfc, hfe, hfi⟩ := hf
  obtain ⟨Lg, hgc, hge, hgi⟩ := hg
  refine ⟨fun t => Lf t - Lg t, hfc.sub hgc, ?_, ?_⟩
  · intro t ht
    rw [Complex.exp_sub, ← hfe t ht, ← hge t ht]
  · have h0 : (0 : ℝ) ∈ Set.Icc (0 : ℝ) 1 := by norm_num
    have h1 : (1 : ℝ) ∈ Set.Icc (0 : ℝ) 1 := by norm_num
    have : (Lf 1 - Lg 1) - (Lf 0 - Lg 0) = (Lf 1 - Lf 0) - (Lg 1 - Lg 0) := by ring
    rw [this, hfi, hgi]
    push_cast
    ring

/-! ## Proposition 3 : zero winding -/

/-- **Proposition 3, first half.** A loop that is continuous on `[0,1]` and maps
`[0,1]` into `ℂ \ (-∞,0]` has winding number `0`: the principal logarithm is a
continuous logarithm along the loop. -/
theorem hasWinding_zero_of_mapsTo_slitPlane {g : ℝ → ℂ}
    (hcont : ContinuousOn g (Set.Icc 0 1))
    (hmaps : ∀ t ∈ Set.Icc (0 : ℝ) 1, g t ∉ negRealAxis)
    (hloop : g 0 = g 1) :
    HasWinding g 0 := by
  have hslit : ∀ t ∈ Set.Icc (0 : ℝ) 1, g t ∈ Complex.slitPlane :=
    fun t ht => mem_slitPlane_of_notMem_negRealAxis (hmaps t ht)
  refine ⟨fun t => Complex.log (g t), hcont.clog hslit, ?_, ?_⟩
  · intro t ht
    exact (Complex.exp_log (Complex.slitPlane_ne_zero (hslit t ht))).symm
  · simp [hloop]

/-- **Proposition 3.** If `A·h` maps the whole contour into `ℂ \ (-∞,0]` and
`A` has winding number `0` along the contour, then so does `h`:
`wind(h) = wind(A·h) - wind(A) = 0`. -/
theorem prop3_wind_quotient_zero {A h : ℝ → ℂ}
    (hcont : ContinuousOn (fun t => A t * h t) (Set.Icc 0 1))
    (hmaps : ∀ t ∈ Set.Icc (0 : ℝ) 1, A t * h t ∉ negRealAxis)
    (hloop : A 0 * h 0 = A 1 * h 1)
    (hA : HasWinding A 0) :
    HasWinding h 0 := by
  have hAh : HasWinding (fun t => A t * h t) 0 :=
    hasWinding_zero_of_mapsTo_slitPlane hcont hmaps hloop
  have hdiv : HasWinding (fun t => (A t * h t) / A t) (0 - 0) := hAh.div hA
  simp only [sub_zero] at hdiv
  refine hdiv.congr ?_
  intro t ht
  have hAt : A t ≠ 0 := hA.ne_zero ht
  field_simp

/-! ## Paper constants (row constants of §4.1) -/

/-- Row constant `t₀ = 24727519/200000000`. -/
noncomputable def t0 : ℝ := 24727519 / 200000000

/-- Row constant `y₀ = 1809/10000`. -/
noncomputable def y0 : ℝ := 1809 / 10000

/-- Row constant `X = 6000000185827`. -/
def Xconst : ℝ := 6000000185827

/-- `α = √(1 - y₀²)`. -/
noncomputable def alpha : ℝ := Real.sqrt (1 - y0 ^ 2)

/-- `β = √(1 - 2 t₀)`. -/
noncomputable def beta : ℝ := Real.sqrt (1 - 2 * t0)

/-- Theorem 4.1(ii) of the paper: `H_{t₀}(x + i y) ≠ 0` whenever `x ≥ X + α`
and `y₀ ≤ y ≤ β`. -/
def Theorem41ii (Ht0 : ℂ → ℂ) : Prop :=
  ∀ x y : ℝ, Xconst + alpha ≤ x → y0 ≤ y → y ≤ beta →
    Ht0 ((x : ℂ) + (y : ℂ) * Complex.I) ≠ 0

/-! ## Theorem 4 : the conditional chain -/

/-- **Theorem 4 (conditional chain; the content of §4.7).**

The closed contour `γ` bounding the terminal region is parametrized by
`[0,1]`; the unresolved lower-edge segment `Γ` (paper eq. (9)) corresponds to
the parameter subset `S ⊆ [0,1]`.  The data `C, Q, E, A, hb` (the latter being
`H_{t₀}/B_{t₀}`) and `m, eps` (`m₉₇` and `ε_tr`) are given functions of the
parameter, and `Rex` is the exact global reserve of eq. (19).

Assuming (H0)–(H6), Theorem 4.1(ii) holds.

Note: the hypotheses `H0'` (`0 < Rex`, part of (H0)) and `H5sub`
(`Γ ⊆ γ`, part of (H5)) are kept because the source lists them explicitly,
but the proof of the chain does not use them. -/
theorem theorem4_chain
    (S : Set ℝ) (C Q E A hb : ℝ → ℂ) (m eps : ℝ → ℝ) (Rex : ℝ) (Ht0 : ℂ → ℂ)
    -- (H0)
    (H0 : ∀ t ∈ S, E t = C t - Q t) (H0' : 0 < Rex)
    -- (H1)
    (H1 : ∀ t ∈ S, m t ≤ Metric.infDist (C t) negRealAxis)
    -- (H2)
    (H2 : ∀ t ∈ S, ‖A t * hb t - Q t‖ ≤ ‖A t‖ * eps t)
    -- (H3)
    (H3 : ∀ t ∈ S, Rex ≤ m t - ‖A t‖ * eps t)
    -- (H4)
    (H4 : ∀ t ∈ S, ‖E t‖ < Rex)
    -- (H5) : Γ is a lane of γ; `A` admits a continuous logarithm along `γ`
    -- with zero winding; `A·(H/B)` is continuous along `γ` and closes up;
    -- on the already-closed lanes `γ \ Γ` it avoids `𝓛`.
    (H5sub : S ⊆ Set.Icc 0 1)
    (H5A : HasWinding A 0)
    (H5cont : ContinuousOn (fun t => A t * hb t) (Set.Icc 0 1))
    (H5loop : A 0 * hb 0 = A 1 * hb 1)
    (H5closed : ∀ t ∈ Set.Icc (0 : ℝ) 1 \ S, A t * hb t ∉ negRealAxis)
    -- (H6) : argument-principle packaging
    (H6 : HasWinding hb 0 → Theorem41ii Ht0) :
    Theorem41ii Ht0 := by
  refine H6 (prop3_wind_quotient_zero H5cont ?_ H5loop H5A)
  intro t ht
  by_cases hS : t ∈ S
  · exact prop2_avoids (H0 t hS) (H1 t hS) (H2 t hS) (H3 t hS) (H4 t hS)
  · exact H5closed t ⟨ht, hS⟩

end ZetaTwinLadder
