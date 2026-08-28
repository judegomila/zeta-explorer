import Mathlib

/-!
# Conditional heat compatibility of the twistor incidence transform

Formalization of Lemma 6.1 ("Conditional heat compatibility") from
*A Consistency-Preserving Twistor Framework for the Zeta Twin Ladder*.

Setting: analytic state spaces `Ap`, `Am` and twistor / dual-twistor cohomological
spaces `Tp`, `Tm`, all modules over a commutative ring `K` (the paper works over
complex vector spaces; the diagram chase needs nothing more than modules), together
with linear maps

* `R : Ap →ₗ Am`,
* `Fp : Ap →ₗ Tp`, `Fm : Am →ₗ Tm`,
* `IK : Tp →ₗ Tm` (the incidence transform `𝓘_K`),
* `Ahatp : Tp →ₗ Tp`, `Ahatm : Tm →ₗ Tm` (the transported heat generators),
* `Aopp : Ap →ₗ Ap`, `Aopm : Am →ₗ Am` (the heat generator `𝒜 = ¼ ∂ₛ²` in each channel).

(The paper's subscripts `±` are rendered here as the suffixes `p` / `m`.)

Hypotheses:

* (I1) `R ∘ Aopp = Aopm ∘ R`   (`R𝒜 = 𝒜R`),
* (I2) `IK ∘ Fp = Fm ∘ R`      (paper eq. (12)),
* (I3) `Ahatp ∘ Fp = Fp ∘ Aopp` and `Ahatm ∘ Fm = Fm ∘ Aopm`.

Conclusion: `IK ∘ Ahatp = Ahatm ∘ IK` on `ran Fp`.
-/

namespace TwistorHeatCompat

variable {K : Type*} [CommRing K]
variable {Ap Am Tp Tm : Type*}
variable [AddCommGroup Ap] [Module K Ap] [AddCommGroup Am] [Module K Am]
variable [AddCommGroup Tp] [Module K Tp] [AddCommGroup Tm] [Module K Tm]

/-- **Paper Lemma 6.1 (conditional heat compatibility), pointwise form.**

Under the three intertwining relations (I1) `R ∘ Aopp = Aopm ∘ R`, (I2) `IK ∘ Fp = Fm ∘ R`
and (I3) `Ahat± ∘ F± = F± ∘ Aop±`, the incidence transform intertwines the transported
heat generators on the range of `Fp`: for every `a : Ap`,
`IK (Ahatp (Fp a)) = Ahatm (IK (Fp a))`. -/
theorem heat_compat_apply
    (R : Ap →ₗ[K] Am) (Fp : Ap →ₗ[K] Tp) (Fm : Am →ₗ[K] Tm)
    (IK : Tp →ₗ[K] Tm) (Ahatp : Tp →ₗ[K] Tp) (Ahatm : Tm →ₗ[K] Tm)
    (Aopp : Ap →ₗ[K] Ap) (Aopm : Am →ₗ[K] Am)
    (I1 : R ∘ₗ Aopp = Aopm ∘ₗ R)
    (I2 : IK ∘ₗ Fp = Fm ∘ₗ R)
    (I3p : Ahatp ∘ₗ Fp = Fp ∘ₗ Aopp)
    (I3m : Ahatm ∘ₗ Fm = Fm ∘ₗ Aopm)
    (a : Ap) :
    IK (Ahatp (Fp a)) = Ahatm (IK (Fp a)) := by
  have h3p : Ahatp (Fp a) = Fp (Aopp a) := congrArg (fun L => L a) I3p
  have h2 : ∀ x : Ap, IK (Fp x) = Fm (R x) := fun x => congrArg (fun L => L x) I2
  have h1 : R (Aopp a) = Aopm (R a) := congrArg (fun L => L a) I1
  have h3m : Ahatm (Fm (R a)) = Fm (Aopm (R a)) := congrArg (fun L => L (R a)) I3m
  calc IK (Ahatp (Fp a)) = IK (Fp (Aopp a)) := by rw [h3p]
    _ = Fm (R (Aopp a)) := h2 _
    _ = Fm (Aopm (R a)) := by rw [h1]
    _ = Ahatm (Fm (R a)) := h3m.symm
    _ = Ahatm (IK (Fp a)) := by rw [h2 a]

/-- **Paper Lemma 6.1**, stated as the equality of compositions
`IK ∘ Ahatp ∘ Fp = Ahatm ∘ IK ∘ Fp`. -/
theorem heat_compat_comp
    (R : Ap →ₗ[K] Am) (Fp : Ap →ₗ[K] Tp) (Fm : Am →ₗ[K] Tm)
    (IK : Tp →ₗ[K] Tm) (Ahatp : Tp →ₗ[K] Tp) (Ahatm : Tm →ₗ[K] Tm)
    (Aopp : Ap →ₗ[K] Ap) (Aopm : Am →ₗ[K] Am)
    (I1 : R ∘ₗ Aopp = Aopm ∘ₗ R)
    (I2 : IK ∘ₗ Fp = Fm ∘ₗ R)
    (I3p : Ahatp ∘ₗ Fp = Fp ∘ₗ Aopp)
    (I3m : Ahatm ∘ₗ Fm = Fm ∘ₗ Aopm) :
    IK ∘ₗ Ahatp ∘ₗ Fp = Ahatm ∘ₗ IK ∘ₗ Fp := by
  ext a
  simpa using heat_compat_apply R Fp Fm IK Ahatp Ahatm Aopp Aopm I1 I2 I3p I3m a

/-- **Paper Lemma 6.1**, stated on the range of `Fp`: for every `t ∈ ran(Fp)`,
`IK (Ahatp t) = Ahatm (IK t)`. -/
theorem heat_compat_on_range
    (R : Ap →ₗ[K] Am) (Fp : Ap →ₗ[K] Tp) (Fm : Am →ₗ[K] Tm)
    (IK : Tp →ₗ[K] Tm) (Ahatp : Tp →ₗ[K] Tp) (Ahatm : Tm →ₗ[K] Tm)
    (Aopp : Ap →ₗ[K] Ap) (Aopm : Am →ₗ[K] Am)
    (I1 : R ∘ₗ Aopp = Aopm ∘ₗ R)
    (I2 : IK ∘ₗ Fp = Fm ∘ₗ R)
    (I3p : Ahatp ∘ₗ Fp = Fp ∘ₗ Aopp)
    (I3m : Ahatm ∘ₗ Fm = Fm ∘ₗ Aopm)
    {t : Tp} (ht : t ∈ LinearMap.range Fp) :
    IK (Ahatp t) = Ahatm (IK t) := by
  obtain ⟨a, rfl⟩ := ht
  exact heat_compat_apply R Fp Fm IK Ahatp Ahatm Aopp Aopm I1 I2 I3p I3m a

end TwistorHeatCompat
