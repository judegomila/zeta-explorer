import RequestProject.ProbeStatements
import RequestProject.RealRootedPreservation

/-!
# The splice: retiring `exists_heatOp_approx_tendsto` by replacement

The probe (`mathexplorer/formalization/lean-mathlib-probe/EntireLP.lean:340-346`) holds ONE
`sorry`: `EntireLP.exists_heatOp_approx_tendsto`, whose intended (everywhere-summable)
reading is kernel-verified FALSE for full LP (Gaussian counterexample), and whose consumer
`heat_preserves_LP_entire` (probe `EntireLP.lean:361-366`) therefore never became
axiom-clean.  The correct carrier of the de Bruijn content is the order-≤1/finite-type
restriction — all that `ξ`/`H_t` need.

This file performs the replacement, entirely within the base (job34/probe) vocabulary:

1. `MathlibBridge.heat_preserves_LP` — the polynomial de Bruijn theorem in the base
   vocabulary, transported (definitional equalities only) from the ported
   `Polynomial.heat_preserves_LP` (`RequestProject.RealRootedPreservation`, the v4.28 port
   of `mathexplorer/formalization/mathlib-pr/RealRootedPreservation.lean`);
2. `EntireLP.toEntire_conj`, `EntireLP.real_symm_of_tendsto` — ported verbatim from the
   probe (`EntireLP.lean:83-86`, `117-130`);
3. `EntireLP.heat_preserves_LP_entire_of_growth` — the entire-function de Bruijn theorem
   for the Laguerre–Pólya class of order ≤ 1 and finite type, mirroring the probe's
   `heat_preserves_LP_entire` proof shape (probe `EntireLP.lean:347-353`), with the
   retired `sorry` replaced by the stage-1 construction
   (`Probe.exists_LP_approx_heatMajorized_order_le_one`, job40) composed with the base's
   transfer lemma (`EntireLP.heatFlow_tendsto_of_heatMajorized` + `heatFlow_poly`, job34).

`#print axioms heat_preserves_LP_entire_of_growth` must report exactly
`[propext, Classical.choice, Quot.sound]`.
-/

open Polynomial Filter
open scoped Topology

/-! ## 1. The polynomial de Bruijn theorem in the base vocabulary -/

namespace MathlibBridge

/-- The base's `heatPartial` (job34 `HeatTransfer.lean`) and the ported
`Polynomial.heatPartial` (`RealRootedPreservation.lean`) are syntactically identical
definitions: the equality is definitional. -/
theorem heatPartial_eq (N : ℕ) (t : ℝ) (p : ℝ[X]) :
    heatPartial N t p = Polynomial.heatPartial N t p := rfl

/-- The base's `heatOp` and the ported `Polynomial.heatOp` agree definitionally. -/
theorem heatOp_eq (t : ℝ) (p : ℝ[X]) : heatOp t p = Polynomial.heatOp t p := rfl

/-- The base's root predicate and the ported `Polynomial.HasOnlyRealRoots` are
definitionally identical (`Multiset.card p.roots = p.natDegree` on both sides). -/
theorem hasOnlyRealRoots_iff_ported (p : ℝ[X]) :
    HasOnlyRealRoots p ↔ Polynomial.HasOnlyRealRoots p := Iff.rfl

/-- **The polynomial de Bruijn / Pólya–Schur theorem, base vocabulary.**  For `t ≥ 0` the
heat operator `e^{-t D²} = heatOp t` preserves real-rootedness.  Transported from the
ported `Polynomial.heat_preserves_LP` along the definitional bridges above. -/
theorem heat_preserves_LP (t : ℝ) (ht : 0 ≤ t) {p : ℝ[X]} (hp : HasOnlyRealRoots p) :
    HasOnlyRealRoots (heatOp t p) := by
  rw [hasOnlyRealRoots_iff_ported, heatOp_eq]
  exact Polynomial.heat_preserves_LP t ht ((hasOnlyRealRoots_iff_ported p).mp hp)

end MathlibBridge

/-! ## 2. The probe's conjugation lemmas, ported -/

namespace EntireLP

/-- PROBE-VERBATIM (probe `EntireLP.lean:83-86`): **`toEntire p` is real on `ℝ`**
(conjugation-symmetric): `p(conj z) = conj p(z)`, because `p` has real coefficients. -/
theorem toEntire_conj (p : ℝ[X]) (z : ℂ) :
    toEntire p (starRingEnd ℂ z) = starRingEnd ℂ (toEntire p z) := by
  have h := Polynomial.aeval_algHom_apply Complex.conjAe z p
  simpa only [toEntire, Complex.conjAe_coe] using h

/-- PROBE-VERBATIM (probe `EntireLP.lean:117-130`): **Real-on-`ℝ` passes to
locally-uniform limits.**  If every `F n` is conjugation-symmetric and `F → g` locally
uniformly, then `g` is conjugation-symmetric. -/
theorem real_symm_of_tendsto {F : ℕ → ℂ → ℂ} {g : ℂ → ℂ}
    (hF : ∀ n z, F n (starRingEnd ℂ z) = starRingEnd ℂ (F n z))
    (h : TendstoLocallyUniformly F g atTop) :
    ∀ z, g (starRingEnd ℂ z) = starRingEnd ℂ (g z) := by
  intro z
  have h1 : Tendsto (fun n => F n (starRingEnd ℂ z)) atTop (𝓝 (g (starRingEnd ℂ z))) :=
    (h.tendstoLocallyUniformlyOn).tendsto_at (Set.mem_univ _)
  have h2 : Tendsto (fun n => F n z) atTop (𝓝 (g z)) :=
    (h.tendstoLocallyUniformlyOn).tendsto_at (Set.mem_univ _)
  have h3 : Tendsto (fun n => starRingEnd ℂ (F n z)) atTop (𝓝 (starRingEnd ℂ (g z))) :=
    (Complex.continuous_conj.tendsto (g z)).comp h2
  have h1' : Tendsto (fun n => starRingEnd ℂ (F n z)) atTop (𝓝 (g (starRingEnd ℂ z))) := by
    simpa only [hF] using h1
  exact tendsto_nhds_unique h1' h3

/-! ## 3. The spliced entire-function de Bruijn theorem -/

/-- **The heat semigroup preserves the Laguerre–Pólya class of entire functions of order
at most one and finite exponential type** — the entire-function de Bruijn theorem for the
growth-restricted class, the sound replacement of the probe's retired
`exists_heatOp_approx_tendsto` route.

For `t ≥ 0` and `f` Laguerre–Pólya with `‖f z‖ ≤ A·exp(B‖z‖)`, `heatFlow t f` is
Laguerre–Pólya.  Proof (mirroring the probe's `heat_preserves_LP_entire`, probe
`EntireLP.lean:347-353`): stage 1 (job40) produces real-rooted heat-majorized approximants
`P n → f`; the polynomial de Bruijn theorem makes `heatOp t (P n)` real-rooted; the
transfer lemma (job34) plus `heatFlow_poly` gives
`toEntire (heatOp t (P n)) → heatFlow t f` locally uniformly; and real-on-`ℝ` is
inherited via `real_symm_of_tendsto`. -/
theorem heat_preserves_LP_entire_of_growth {f : ℂ → ℂ} {t : ℝ} (ht : 0 ≤ t)
    (hf : IsLaguerrePolya f)
    (hgrowth : ∃ A B : ℝ, ∀ z : ℂ, ‖f z‖ ≤ A * Real.exp (B * ‖z‖)) :
    IsLaguerrePolya (heatFlow t f) := by
  obtain ⟨P, hroots, hconv, hmaj⟩ :=
    Probe.exists_LP_approx_heatMajorized_order_le_one ht hf hgrowth
  have hQconv : TendstoLocallyUniformly
      (fun n => toEntire (MathlibBridge.heatOp t (P n))) (heatFlow t f) atTop := by
    simpa only [heatFlow_poly] using heatFlow_tendsto_of_heatMajorized ht hconv hmaj
  exact ⟨real_symm_of_tendsto (fun n z => toEntire_conj _ z) hQconv,
    fun n => MathlibBridge.heatOp t (P n),
    fun n => MathlibBridge.heat_preserves_LP t ht (hroots n), hQconv⟩

end EntireLP

/-! ## 4. Non-vacuity: the hypotheses are jointly satisfiable -/

namespace EntireLP

/-- PROBE-VERBATIM (probe `EntireLP.lean:107-110`): the constant sequence converges
locally uniformly to its value. -/
theorem tendstoLocallyUniformly_const (h : ℂ → ℂ) :
    TendstoLocallyUniformly (fun _ : ℕ => h) h atTop :=
  TendstoUniformly.tendstoLocallyUniformly
    (fun _u hu => Eventually.of_forall fun _n _x => refl_mem_uniformity hu)

/-- The identity function is Laguerre–Pólya (base vocabulary). -/
theorem isLaguerrePolya_id : IsLaguerrePolya (fun z : ℂ => z) := by
  have hX : toEntire (X : ℝ[X]) = fun z : ℂ => z := by
    funext z; simp [toEntire]
  refine ⟨fun z => rfl, fun _ => (X : ℝ[X]), fun _ => ?_, ?_⟩
  · exact (Probe.hasOnlyRealRoots_iff _).mp
      (Stage1MB.hasOnlyRealRoots_iff_splits.mpr Polynomial.Splits.X)
  · simpa only [hX] using tendstoLocallyUniformly_const (fun z : ℂ => z)

/-- The identity function satisfies the order-≤1/finite-type growth bound. -/
theorem growth_id : ∃ A B : ℝ, ∀ z : ℂ, ‖(fun w : ℂ => w) z‖ ≤ A * Real.exp (B * ‖z‖) := by
  refine ⟨1, 1, fun z => ?_⟩
  have h := Real.add_one_le_exp ‖z‖
  simp only [one_mul]
  linarith [norm_nonneg z]

/-- Non-vacuity of the capstone: it applies to the identity function. -/
theorem heatFlow_id_isLaguerrePolya (t : ℝ) (ht : 0 ≤ t) :
    IsLaguerrePolya (heatFlow t (fun z : ℂ => z)) :=
  heat_preserves_LP_entire_of_growth ht isLaguerrePolya_id growth_id

end EntireLP
