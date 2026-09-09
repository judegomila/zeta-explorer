import RequestProject.FrozenRung.Kernels

/-!
# TARGET 1 — the detection radius (unconditional)

Setting: `X` is an analytic function (in the source, `X w = ξ (1/2 + w)`), `a > 0` is a level,
and `R a w = X (w - a) / X (w + a)` is the frozen-rung ratio.  A *ghost* is a zero `lam0` of `X`
with `Re lam0 > a`, of multiplicity `m0`, fully uncancelled at level `a`, i.e.
`v0 = ‖X (lam0 - 2a)‖ > 0`.

With `alpha0 = lam0 - a`, `M1` an upper bound for `‖X'‖` on the closed `r`-disk around
`lam0 - 2a` and `M2` such that `‖X‖ ≤ M2 * r ^ m0` on the circle `|ζ - lam0| = r`, the ratio
has modulus `> 1` on the punctured disk of radius

  `detectionRadius X lam0 a r M1 M2 = min r (v0 / (2 * (M1 + M2)))`

around `alpha0`.

Following the flagged division-by-zero convention, the robust form
`‖X (z + a)‖ < ‖X (z - a)‖` is proved first (it is valid on the whole closed disk, in
particular at zeros of the denominator), and the ratio statement `1 < ‖R a z‖` is deduced under
the extra hypothesis `X (z + a) ≠ 0`.
-/

namespace FrozenRung

open Metric

/-- The frozen-rung ratio at level `a`: `R a w = X (w - a) / X (w + a)`. -/
noncomputable def ratioR (X : ℂ → ℂ) (a : ℝ) (w : ℂ) : ℂ := X (w - a) / X (w + a)

/-- The detection radius `ρ(alpha0) = min (r, v0 / (2 (M1 + M2)))` of Prop. 5.2. -/
noncomputable def detectionRadius (X : ℂ → ℂ) (lam0 : ℂ) (a r M1 M2 : ℝ) : ℝ :=
  min r (‖X (lam0 - 2 * a)‖ / (2 * (M1 + M2)))

/-- Mean value inequality: an analytic function moves by at most `M1 * ‖h‖` on a disk on which
its derivative is bounded by `M1`. -/
theorem norm_sub_le_of_deriv_le {X : ℂ → ℂ} {c h : ℂ} {r M1 : ℝ}
    (hXan : AnalyticOnNhd ℂ X (closedBall c r))
    (hM1 : ∀ ζ ∈ closedBall c r, ‖deriv X ζ‖ ≤ M1)
    (hh : ‖h‖ ≤ r) : ‖X (c + h) - X c‖ ≤ M1 * ‖h‖ := by
  have hc : c ∈ closedBall c r := by
    simp only [mem_closedBall, dist_self]
    exact le_trans (norm_nonneg h) hh
  have hch : c + h ∈ closedBall c r := by
    simpa [mem_closedBall, dist_eq_norm] using hh
  have := Convex.norm_image_sub_le_of_norm_hasDerivWithin_le
    (f := X) (f' := deriv X) (s := closedBall c r)
    (fun x hx => ((hXan x hx).differentiableAt.hasDerivAt).hasDerivWithinAt)
    hM1 (convex_closedBall c r) hc hch
  simpa using this

/-- Numerator bound: `‖X (c + h)‖ ≥ ‖X c‖ - M1 ‖h‖`. -/
theorem numerator_lower_bound {X : ℂ → ℂ} {c h : ℂ} {r M1 : ℝ}
    (hXan : AnalyticOnNhd ℂ X (closedBall c r))
    (hM1 : ∀ ζ ∈ closedBall c r, ‖deriv X ζ‖ ≤ M1)
    (hh : ‖h‖ ≤ r) : ‖X c‖ - M1 * ‖h‖ ≤ ‖X (c + h)‖ := by
  have h1 := norm_sub_le_of_deriv_le hXan hM1 hh
  have h2 : ‖X c‖ - ‖X (c + h)‖ ≤ ‖X (c + h) - X c‖ := by
    rw [← norm_neg (X (c + h) - X c)]
    simpa using norm_sub_norm_le (X c) (X (c + h))
  linarith

/-- Denominator bound via the maximum principle applied to `g(h) = X (lam0 + h) / h ^ m0`:
`‖X (lam0 + h)‖ ≤ M2 ‖h‖ ^ m0` on the closed `r`-disk. -/
theorem denominator_upper_bound {X g : ℂ → ℂ} {lam0 h : ℂ} {r M2 : ℝ} {m0 : ℕ}
    (hr0 : 0 < r)
    (hgan : AnalyticOnNhd ℂ g (closedBall lam0 r))
    (hfac : ∀ ζ ∈ closedBall lam0 r, X ζ = (ζ - lam0) ^ m0 * g ζ)
    (hM2 : ∀ ζ ∈ sphere lam0 r, ‖X ζ‖ ≤ M2 * r ^ m0)
    (hh : ‖h‖ ≤ r) : ‖X (lam0 + h)‖ ≤ M2 * ‖h‖ ^ m0 := by
  have hrne : r ≠ 0 := ne_of_gt hr0
  -- the maximum principle bound `‖g‖ ≤ M2` on the closed disk
  have hgle : ∀ w ∈ closedBall lam0 r, ‖g w‖ ≤ M2 := by
    intro w hw
    have hdcc : DiffContOnCl ℂ g (ball lam0 r) := by
      refine ⟨fun x hx =>
        (hgan x (ball_subset_closedBall hx)).differentiableAt.differentiableWithinAt, ?_⟩
      rw [closure_ball lam0 hrne]
      exact fun x hx => ((hgan x hx).continuousAt).continuousWithinAt
    have hfront : ∀ ζ ∈ frontier (ball lam0 r), ‖g ζ‖ ≤ M2 := by
      intro ζ hζ
      rw [frontier_ball lam0 hrne] at hζ
      have hζr : ‖ζ - lam0‖ = r := by
        simpa [dist_eq_norm] using (mem_sphere.mp hζ)
      have hmem : ζ ∈ closedBall lam0 r := sphere_subset_closedBall hζ
      have hX : ‖X ζ‖ = r ^ m0 * ‖g ζ‖ := by
        rw [hfac ζ hmem, norm_mul, norm_pow, hζr]
      have := hM2 ζ hζ
      rw [hX] at this
      have hrp : (0 : ℝ) < r ^ m0 := pow_pos hr0 m0
      nlinarith
    exact Complex.norm_le_of_forall_mem_frontier_norm_le Metric.isBounded_ball hdcc hfront
      (by rwa [closure_ball lam0 hrne])
  have hmem : lam0 + h ∈ closedBall lam0 r := by
    simpa [mem_closedBall, dist_eq_norm] using hh
  rw [hfac (lam0 + h) hmem, norm_mul, norm_pow]
  have hsimp : ‖lam0 + h - lam0‖ = ‖h‖ := by ring_nf
  rw [hsimp, mul_comm]
  exact mul_le_mul_of_nonneg_right (hgle _ hmem) (by positivity)

/-- **TARGET 1 (robust form).**  Detection radius, Prop. 5.2, in the division-safe form
`‖X (z + a)‖ < ‖X (z - a)‖`, valid on the whole closed disk of radius
`ρ(alpha0) = min (r, v0 / (2 (M1 + M2)))` around `alpha0 = lam0 - a`. -/
theorem detection_radius_robust {X g : ℂ → ℂ} {lam0 z : ℂ} {a r M1 M2 : ℝ} {m0 : ℕ}
    (hr0 : 0 < r) (hr1 : r ≤ 1) (hm0 : 1 ≤ m0)
    (hXan : AnalyticOnNhd ℂ X (closedBall (lam0 - 2 * a) r))
    (hM1 : ∀ ζ ∈ closedBall (lam0 - 2 * a) r, ‖deriv X ζ‖ ≤ M1)
    (hM1pos : 0 < M1)
    (hgan : AnalyticOnNhd ℂ g (closedBall lam0 r))
    (hfac : ∀ ζ ∈ closedBall lam0 r, X ζ = (ζ - lam0) ^ m0 * g ζ)
    (hM2 : ∀ ζ ∈ sphere lam0 r, ‖X ζ‖ ≤ M2 * r ^ m0)
    (hv0 : 0 < ‖X (lam0 - 2 * a)‖)
    (hz : ‖z - (lam0 - a)‖ ≤ detectionRadius X lam0 a r M1 M2) :
    ‖X (z + a)‖ < ‖X (z - a)‖ := by
  set v0 : ℝ := ‖X (lam0 - 2 * a)‖ with hv0def
  set h : ℂ := z - (lam0 - a) with hhdef
  -- `M2` is nonnegative because the circle is nonempty
  have hM2nonneg : 0 ≤ M2 := by
    have hmem : lam0 + (r : ℂ) ∈ sphere lam0 r := by
      simp [abs_of_pos hr0]
    have := hM2 _ hmem
    have hrp : (0 : ℝ) < r ^ m0 := pow_pos hr0 m0
    nlinarith [norm_nonneg (X (lam0 + (r : ℂ)))]
  have hsum : 0 < M1 + M2 := by linarith
  have hhr : ‖h‖ ≤ r := le_trans hz (min_le_left _ _)
  have hhbound : ‖h‖ ≤ v0 / (2 * (M1 + M2)) := le_trans hz (min_le_right _ _)
  have hkey : (M1 + M2) * ‖h‖ ≤ v0 / 2 :=
    calc (M1 + M2) * ‖h‖ ≤ (M1 + M2) * (v0 / (2 * (M1 + M2))) :=
          mul_le_mul_of_nonneg_left hhbound (le_of_lt hsum)
      _ = v0 / 2 := by field_simp
  -- rewrite the two evaluation points
  have hnum : z - a = (lam0 - 2 * a) + h := by rw [hhdef]; ring
  have hden : z + a = lam0 + h := by rw [hhdef]; ring
  -- numerator
  have h1 : v0 - M1 * ‖h‖ ≤ ‖X (z - a)‖ := by
    rw [hnum]
    exact numerator_lower_bound hXan hM1 hhr
  -- denominator
  have h2 : ‖X (z + a)‖ ≤ M2 * ‖h‖ := by
    rw [hden]
    refine le_trans (denominator_upper_bound hr0 hgan hfac hM2 hhr) ?_
    have hpow : ‖h‖ ^ m0 ≤ ‖h‖ := by
      calc ‖h‖ ^ m0 ≤ ‖h‖ ^ 1 :=
            pow_le_pow_of_le_one (norm_nonneg h) (le_trans hhr hr1) hm0
        _ = ‖h‖ := pow_one _
    exact mul_le_mul_of_nonneg_left hpow hM2nonneg
  nlinarith

/-- **TARGET 1 (Prop. 5.2, ratio form).**  For a ghost `lam0` of multiplicity `m0`, fully
uncancelled at level `a` (`v0 = ‖X (lam0 - 2a)‖ > 0`), every `z` in the punctured disk
`0 < ‖z - alpha0‖ ≤ ρ(alpha0)` around `alpha0 = lam0 - a` at which the denominator does not
vanish satisfies `1 < ‖R a z‖`.

The paper's standing hypothesis `Re lam0 > a` is kept: it is what makes `alpha0` a point of the
open right half plane, as recorded in the first conjunct and used by the composition endpoint.
The hypothesis `M1 > 0` is also kept, as flagged in the source; here it is used to guarantee
`M1 + M2 > 0`, i.e. that the detection radius is not degenerate.  The paper's `a > 0` is not
needed for the inequality and is therefore not assumed.  The paper's puncture
`0 < ‖z - alpha0‖` is not assumed either: it is implied by `X (z + a) ≠ 0`, since
`X lam0 = 0` by the multiplicity factorisation. -/
theorem detection_radius {X g : ℂ → ℂ} {lam0 z : ℂ} {a r M1 M2 : ℝ} {m0 : ℕ}
    (hlam : a < lam0.re)
    (hr0 : 0 < r) (hr1 : r ≤ 1) (hm0 : 1 ≤ m0)
    (hXan : AnalyticOnNhd ℂ X (closedBall (lam0 - 2 * a) r))
    (hM1 : ∀ ζ ∈ closedBall (lam0 - 2 * a) r, ‖deriv X ζ‖ ≤ M1)
    (hM1pos : 0 < M1)
    (hgan : AnalyticOnNhd ℂ g (closedBall lam0 r))
    (hfac : ∀ ζ ∈ closedBall lam0 r, X ζ = (ζ - lam0) ^ m0 * g ζ)
    (hM2 : ∀ ζ ∈ sphere lam0 r, ‖X ζ‖ ≤ M2 * r ^ m0)
    (hv0 : 0 < ‖X (lam0 - 2 * a)‖)
    (hz : ‖z - (lam0 - a)‖ ≤ detectionRadius X lam0 a r M1 M2)
    (hne : X (z + a) ≠ 0) :
    0 < (lam0 - (a : ℂ)).re ∧ 1 < ‖ratioR X a z‖ := by
  refine ⟨by simp only [Complex.sub_re, Complex.ofReal_re, sub_pos]; exact hlam, ?_⟩
  have hrob := detection_radius_robust hr0 hr1 hm0 hXan hM1 hM1pos hgan hfac hM2 hv0 hz
  rw [ratioR, norm_div]
  exact (one_lt_div (norm_pos_iff.mpr hne)).mpr hrob

/-- **Composition endpoint.**  A mesh `zs` containing a detection point `zs i` in the open right
half plane, at which the denominator does not vanish, certifies a negative eigenvalue of the
Schur Gram matrix of the mesh for `Θ = R a`. -/
theorem one_le_negIndex_gram_of_detection {ι : Type*} [Fintype ι] [DecidableEq ι]
    {X : ℂ → ℂ} {a : ℝ} (zs : ι → ℂ) (i : ι)
    (hre : 0 < (zs i).re) (hne : X (zs i + a) ≠ 0)
    (hdet : ‖X (zs i + a)‖ < ‖X (zs i - a)‖) :
    1 ≤ negIndex (gramMatrix (schurKernel (fun w => X (w - a) / X (w + a))) zs) := by
  refine one_le_negIndex_gram_of_modulus_gt_one zs i hre ?_
  rw [norm_div]
  exact (one_lt_div (norm_pos_iff.mpr hne)).mpr hdet

end FrozenRung
