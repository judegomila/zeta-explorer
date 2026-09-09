import RequestProject.FrozenRung.Detection

/-!
# TARGET 2 — the conditional L2 theorem

This file states and proves the **conditional** form of L2.  The hypothesis (ZR) (effective
zero repulsion) is *not* proven here: it is carried as an explicit named hypothesis, exactly as
in the source, together with an explicit strip bound `𝓑(T)`.

* `ZeroRepulsion X T eta A` is Hypothesis (ZR): for every hypothetical zero `lam0` of `X` with
  `0 < Re lam0 ≤ 1/2`, `|Im lam0| ≤ T`, some level `a ∈ A` with `a < Re lam0` has
  `‖X (lam0 - 2a)‖ ≥ eta`.
* `StripBound X T B` says `‖X‖, ‖X'‖ ≤ B` on the strip.  (The source writes the strip as
  `|Re ζ| ≤ 3/2`, `|Im ζ| ≤ T + 2`; we widen the real part to `|Re ζ| ≤ 2` because the disk
  `closedBall (lam0 - 2a) 1` used by Target 1 reaches `Re ζ > -2` for levels `a < 1/2`.)
* `rho0 eta B = min 1 (eta / (4 B))` is the source's `ρ₀(T,a)`.
* `meshLattice s off T` is the square lattice of spacing `s`, offset by `off`, inside
  `{0 < Re w ≤ 1/2, |Im w| ≤ T}`.
* `Ghost X T` packages a ghost configuration: a zero of `X` in the box together with its
  multiplicity data `X ζ = (ζ - lam)^m * g ζ` on the unit disk (the source's prescribed way of
  expressing multiplicity `m ≥ 1`).

The conclusion `l2_conditional` is: *given* (ZR), for every ghost configuration some level
`a ∈ A` and some mesh point `ẑ` satisfy the detection inequality; and via Target 1's endpoint
this certifies a negative eigenvalue (`l2_conditional_negIndex`).  The sufficient mesh density
obtained here is `s ≤ ρ₀/2` (the halving absorbs the boundary clamping of the lattice inside
the box).

The route taken is the modulus-witness route.  No uniform spectral-margin statement
(`λ_min (G) < -η` with a configuration-independent mesh density) is claimed or proved here.
-/

namespace FrozenRung

open Metric

/-- **Hypothesis (ZR)** (effective zero repulsion — NOT proven).  There is `eta > 0` and a
finite set of levels `A ⊂ (0, 1/2)` such that every hypothetical zero `lam0` of `X` with
`0 < Re lam0 ≤ 1/2` and `|Im lam0| ≤ T` satisfies `‖X (lam0 - 2a)‖ ≥ eta` for at least one
`a ∈ A` with `a < Re lam0`. -/
structure ZeroRepulsion (X : ℂ → ℂ) (T eta : ℝ) (A : Finset ℝ) : Prop where
  eta_pos : 0 < eta
  levels : ∀ a ∈ A, 0 < a ∧ a < 1 / 2
  repulsion : ∀ lam : ℂ, X lam = 0 → 0 < lam.re → lam.re ≤ 1 / 2 → |lam.im| ≤ T →
      ∃ a ∈ A, a < lam.re ∧ eta ≤ ‖X (lam - 2 * a)‖

/-- An explicit strip bound `𝓑(T)` for `X` and `X'`. -/
structure StripBound (X : ℂ → ℂ) (T B : ℝ) : Prop where
  pos : 0 < B
  bound_X : ∀ ζ : ℂ, |ζ.re| ≤ 2 → |ζ.im| ≤ T + 2 → ‖X ζ‖ ≤ B
  bound_deriv : ∀ ζ : ℂ, |ζ.re| ≤ 2 → |ζ.im| ≤ T + 2 → ‖deriv X ζ‖ ≤ B

/-- The source's `ρ₀(T,a) = min (1, eta(T) / (4 𝓑(T)))`. -/
noncomputable def rho0 (eta B : ℝ) : ℝ := min 1 (eta / (4 * B))

/-- The square lattice of spacing `s`, offset by `off`, inside the box
`{0 < Re w ≤ 1/2, |Im w| ≤ T}`. -/
def meshLattice (s : ℝ) (off : ℂ) (T : ℝ) : Set ℂ :=
  {w | (∃ p q : ℤ, w = off + ((p * s : ℝ) : ℂ) + ((q * s : ℝ) : ℂ) * Complex.I) ∧
    0 < w.re ∧ w.re ≤ 1 / 2 ∧ |w.im| ≤ T}

/-- A ghost configuration: a hypothetical zero of `X` in the box `0 < Re ≤ 1/2`, `|Im| ≤ T`,
together with its multiplicity data on the unit disk. -/
structure Ghost (X : ℂ → ℂ) (T : ℝ) where
  lam : ℂ
  re_pos : 0 < lam.re
  re_le : lam.re ≤ 1 / 2
  im_le : |lam.im| ≤ T
  m : ℕ
  m_pos : 1 ≤ m
  g : ℂ → ℂ
  g_analytic : AnalyticOnNhd ℂ g (closedBall lam 1)
  factor : ∀ ζ ∈ closedBall lam 1, X ζ = (ζ - lam) ^ m * g ζ

theorem Ghost.isZero {X : ℂ → ℂ} {T : ℝ} (G : Ghost X T) : X G.lam = 0 := by
  have h := G.factor G.lam (by simp)
  have hm : G.m ≠ 0 := by have := G.m_pos; omega
  rw [h, sub_self, zero_pow hm, zero_mul]

/-- Covering property of the offset lattice: every point of the box is within `2 s` of a
lattice point of the box (in each coordinate the error is at most `s`, including at the
boundary, where the nearest lattice point has to be clamped back into the box). -/
theorem exists_meshLattice_point_near {s T : ℝ} {off alpha : ℂ}
    (hs : 0 < s) (hs2 : s ≤ 1 / 2) (hsT : s ≤ 2 * T)
    (hoff0 : 0 < off.re) (hoffs : off.re ≤ s)
    (ha1 : 0 < alpha.re) (ha2 : alpha.re ≤ 1 / 2) (ha3 : |alpha.im| ≤ T) :
    ∃ w ∈ meshLattice s off T, ‖w - alpha‖ ≤ 2 * s := by
  have haim1 : -T ≤ alpha.im := neg_le_of_abs_le ha3
  have haim2 : alpha.im ≤ T := le_of_abs_le ha3
  -- horizontal index
  obtain ⟨p, hp1, hp2, hp3⟩ : ∃ p : ℤ, 0 < off.re + p * s ∧ off.re + p * s ≤ 1 / 2 ∧
      |off.re + p * s - alpha.re| ≤ s := by
    set t : ℝ := (alpha.re - off.re) / s with ht
    rcases le_or_gt ⌊t⌋ 0 with hfl | hfl
    · refine ⟨0, by simpa using hoff0, by simpa using le_trans hoffs (by linarith), ?_⟩
      have htlt : t < 1 := lt_of_lt_of_le (Int.lt_floor_add_one t) (by exact_mod_cast by omega)
      have : alpha.re - off.re < s := by
        rw [ht, div_lt_one hs] at htlt; linarith
      rw [abs_le]
      constructor <;> simp <;> linarith
    · have hfl0 : (0 : ℝ) < (⌊t⌋ : ℝ) := by exact_mod_cast hfl
      have hle : (⌊t⌋ : ℝ) * s ≤ alpha.re - off.re := by
        have := Int.floor_le t
        rw [ht, le_div_iff₀ hs] at this
        linarith
      have hgt : alpha.re - off.re < ((⌊t⌋ : ℝ) + 1) * s := by
        have := Int.lt_floor_add_one t
        rw [ht, div_lt_iff₀ hs] at this
        linarith
      refine ⟨⌊t⌋, by nlinarith, by linarith, ?_⟩
      rw [abs_le]
      constructor <;> nlinarith
  -- vertical index
  obtain ⟨q, hq1, hq2⟩ : ∃ q : ℤ, |off.im + q * s| ≤ T ∧ |off.im + q * s - alpha.im| ≤ s := by
    set u : ℝ := (alpha.im - off.im) / s with hu
    have hle : off.im + (⌊u⌋ : ℝ) * s ≤ alpha.im := by
      have := Int.floor_le u
      rw [hu, le_div_iff₀ hs] at this
      linarith
    have hgt : alpha.im < off.im + ((⌊u⌋ : ℝ) + 1) * s := by
      have := Int.lt_floor_add_one u
      rw [hu, div_lt_iff₀ hs] at this
      linarith
    rcases le_or_gt (-T) (off.im + (⌊u⌋ : ℝ) * s) with hcase | hcase
    · refine ⟨⌊u⌋, ?_, ?_⟩
      · rw [abs_le]; constructor <;> linarith
      · rw [abs_le]; constructor <;> nlinarith
    · refine ⟨⌊u⌋ + 1, ?_, ?_⟩
      · push_cast
        rw [abs_le]
        constructor <;> nlinarith
      · push_cast
        rw [abs_le]
        constructor <;> nlinarith
  refine ⟨off + ((p * s : ℝ) : ℂ) + ((q * s : ℝ) : ℂ) * Complex.I, ⟨⟨p, q, rfl⟩, ?_, ?_, ?_⟩, ?_⟩
  · simpa using hp1
  · simpa using hp2
  · simpa using hq1
  · have hre : (off + ((p * s : ℝ) : ℂ) + ((q * s : ℝ) : ℂ) * Complex.I - alpha).re
        = off.re + p * s - alpha.re := by simp
    have him : (off + ((p * s : ℝ) : ℂ) + ((q * s : ℝ) : ℂ) * Complex.I - alpha).im
        = off.im + q * s - alpha.im := by simp
    refine le_trans (Complex.norm_le_abs_re_add_abs_im _) ?_
    rw [hre, him]
    linarith

/-- **TARGET 2 (Theorem L2, conditional form).**  Assume Hypothesis (ZR) and an explicit strip
bound `B = 𝓑(T)`.  Let `Z = meshLattice s off T` be a square lattice of spacing
`s ≤ ρ₀(T)/2 = min (1, eta/(4B))/2` inside the box, offset by `off`.  Then for every ghost
configuration there are a level `a ∈ A` and a mesh point `ẑ ∈ Z` at which the detection
inequality `‖X (ẑ + a)‖ < ‖X (ẑ - a)‖` holds.

This is conditional: (ZR) is an explicit hypothesis and is neither proven nor claimed here. -/
theorem l2_conditional {X : ℂ → ℂ} {T eta B s : ℝ} {A : Finset ℝ} {off : ℂ}
    (hT : 1 ≤ T)
    (hXan : AnalyticOnNhd ℂ X Set.univ)
    (hZR : ZeroRepulsion X T eta A) (hB : StripBound X T B)
    (hs : 0 < s) (hmesh : 2 * s ≤ rho0 eta B)
    (hoff0 : 0 < off.re) (hoffs : off.re ≤ s)
    (G : Ghost X T) :
    ∃ a ∈ A, ∃ zhat ∈ meshLattice s off T, ‖X (zhat + a)‖ < ‖X (zhat - a)‖ := by
  obtain ⟨a, haA, halt, hav⟩ :=
    hZR.repulsion G.lam G.isZero G.re_pos G.re_le G.im_le
  obtain ⟨ha0, ha12⟩ := hZR.levels a haA
  refine ⟨a, haA, ?_⟩
  -- the target point `alpha = lam - a`
  set lam : ℂ := G.lam with hlam
  set alpha : ℂ := lam - (a : ℂ) with halpha
  have hrho1 : rho0 eta B ≤ 1 := min_le_left _ _
  have hs2 : s ≤ 1 / 2 := by
    have : 2 * s ≤ 1 := le_trans hmesh hrho1
    linarith
  have hsT : s ≤ 2 * T := by linarith
  have halre : alpha.re = lam.re - a := by simp [halpha]
  have halim : alpha.im = lam.im := by simp [halpha]
  obtain ⟨zhat, hzmem, hznear⟩ := exists_meshLattice_point_near (alpha := alpha)
    hs hs2 hsT hoff0 hoffs (by rw [halre]; linarith)
    (by rw [halre]; linarith [G.re_le]) (by rw [halim]; exact G.im_le)
  refine ⟨zhat, hzmem, ?_⟩
  -- strip membership of the two disks
  have h1 : 0 < lam.re := G.re_pos
  have h2 : lam.re ≤ 1 / 2 := G.re_le
  have h3 : -T ≤ lam.im := neg_le_of_abs_le G.im_le
  have h4 : lam.im ≤ T := le_of_abs_le G.im_le
  have hdisk1 : ∀ ζ ∈ closedBall (lam - 2 * (a : ℂ)) 1, |ζ.re| ≤ 2 ∧ |ζ.im| ≤ T + 2 := by
    intro ζ hζ
    rw [mem_closedBall, dist_eq_norm] at hζ
    have hre : |ζ.re - (lam.re - 2 * a)| ≤ 1 := by
      have heq : (ζ - (lam - 2 * (a : ℂ))).re = ζ.re - (lam.re - 2 * a) := by simp
      exact heq ▸ le_trans (Complex.abs_re_le_norm _) hζ
    have him : |ζ.im - lam.im| ≤ 1 := by
      have heq : (ζ - (lam - 2 * (a : ℂ))).im = ζ.im - lam.im := by simp
      exact heq ▸ le_trans (Complex.abs_im_le_norm _) hζ
    rw [abs_le] at hre him
    exact ⟨abs_le.mpr ⟨by linarith [hre.1], by linarith [hre.2]⟩,
      abs_le.mpr ⟨by linarith [him.1], by linarith [him.2]⟩⟩
  have hdisk2 : ∀ ζ ∈ sphere lam 1, |ζ.re| ≤ 2 ∧ |ζ.im| ≤ T + 2 := by
    intro ζ hζ
    rw [mem_sphere, dist_eq_norm] at hζ
    have hre : |ζ.re - lam.re| ≤ 1 := by
      have heq : (ζ - lam).re = ζ.re - lam.re := by simp
      exact heq ▸ le_trans (Complex.abs_re_le_norm _) (le_of_eq hζ)
    have him : |ζ.im - lam.im| ≤ 1 := by
      have heq : (ζ - lam).im = ζ.im - lam.im := by simp
      exact heq ▸ le_trans (Complex.abs_im_le_norm _) (le_of_eq hζ)
    rw [abs_le] at hre him
    exact ⟨abs_le.mpr ⟨by linarith [hre.1], by linarith [hre.2]⟩,
      abs_le.mpr ⟨by linarith [him.1], by linarith [him.2]⟩⟩
  -- Target 1 applies with `r = 1`, `M1 = M2 = B`
  have hv0 : 0 < ‖X (lam - 2 * (a : ℂ))‖ := lt_of_lt_of_le hZR.eta_pos hav
  have hzdet : ‖zhat - (lam - (a : ℂ))‖ ≤ detectionRadius X lam a 1 B B := by
    rw [detectionRadius]
    refine le_min ?_ ?_
    · exact le_trans hznear (le_trans hmesh hrho1)
    · refine le_trans hznear (le_trans hmesh ?_)
      refine le_trans (min_le_right _ _) ?_
      have hBpos := hB.pos
      rw [div_le_div_iff₀ (by linarith) (by linarith)]
      nlinarith
  exact detection_radius_robust (X := X) (g := G.g) (lam0 := lam) (z := zhat)
    (a := a) (r := 1) (M1 := B) (M2 := B) (m0 := G.m)
    one_pos le_rfl G.m_pos
    (fun ζ _ => hXan ζ (Set.mem_univ ζ))
    (fun ζ hζ => hB.bound_deriv ζ (hdisk1 ζ hζ).1 (hdisk1 ζ hζ).2)
    hB.pos G.g_analytic G.factor
    (fun ζ hζ => by
      simpa using hB.bound_X ζ (hdisk2 ζ hζ).1 (hdisk2 ζ hζ).2)
    hv0 hzdet

/-- **TARGET 2, composition endpoint.**  Under (ZR) and the mesh density `s ≤ ρ₀/2`, any finite
sample `zs` covering the lattice, at which the denominator never vanishes (the source's generic
offset / fail-closed interval arithmetic), certifies a negative eigenvalue of the Schur Gram
matrix at some level `a ∈ A`, for every ghost configuration. -/
theorem l2_conditional_negIndex {ι : Type*} [Fintype ι] [DecidableEq ι]
    {X : ℂ → ℂ} {T eta B s : ℝ} {A : Finset ℝ} {off : ℂ}
    (hT : 1 ≤ T)
    (hXan : AnalyticOnNhd ℂ X Set.univ)
    (hZR : ZeroRepulsion X T eta A) (hB : StripBound X T B)
    (hs : 0 < s) (hmesh : 2 * s ≤ rho0 eta B)
    (hoff0 : 0 < off.re) (hoffs : off.re ≤ s)
    (zs : ι → ℂ) (hcover : ∀ w ∈ meshLattice s off T, ∃ i, zs i = w)
    (hnopole : ∀ a ∈ A, ∀ i, X (zs i + a) ≠ 0)
    (G : Ghost X T) :
    ∃ a ∈ A, 1 ≤ negIndex (gramMatrix (schurKernel (fun w => X (w - a) / X (w + a))) zs) := by
  obtain ⟨a, haA, zhat, hzmem, hdet⟩ :=
    l2_conditional hT hXan hZR hB hs hmesh hoff0 hoffs G
  obtain ⟨i, rfl⟩ := hcover zhat hzmem
  exact ⟨a, haA, one_le_negIndex_gram_of_detection zs i hzmem.2.1 (hnopole a haA i) hdet⟩

end FrozenRung
