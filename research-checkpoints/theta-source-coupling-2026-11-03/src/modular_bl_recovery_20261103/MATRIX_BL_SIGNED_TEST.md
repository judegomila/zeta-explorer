# Signed matrix Brascamp–Lieb test for an integrated modular form

Status: independent analytic audit PASS; conditional sufficient test only, not a theta all-degree positivity proof.

Let ψ be the complete positive theta profile, v=−ψ'/ψ, and b real. The probability measure

 dν_b = h exp(2bh) ψ² dh / I_b,    I_b = ∫₀∞h exp(2bh)ψ² dh,

has potential curvature W=h⁻²+2v'>0. For any finite vector F of smooth functions with the required integrability, define μ=E F,

 C=E[(F−μ)(F−μ)^T],       B=E[F' F'^T/W].

Scalar Brascamp–Lieb applied to every linear combination x^T F gives the all-dimensional matrix bound 0 ⪯ C ⪯ B. In particular x^T B x=E[(x^T F')²/W] retains the selected vector's full derivative cross terms. This statement does not assume log-concavity for any individual feature-weighted density, nor a next pivot.

For a fixed real symmetric matrix H let H=H₊−H₋ be its spectral positive/negative decomposition, and define S=E[F^T H F]. Then

 S = μ^T H μ + tr(H C)
   ≤ T := μ^T H μ + tr(H₊B) − tr(H₋C).                              (1)

The exact discarded slack is T−S=tr[H₊(B−C)]≥0. Consequently T<0 is a sufficient condition for S<0, generally stronger rather than equivalent. It preserves the whole negative covariance and all cross terms inside both H spectral subspaces. It is a computable conditional test, not a verified uniform estimate; bounding its slack in terms of an available signed margin is precisely the missing work. The ordinary order C⪯B cannot be contracted with an indefinite H without the positive/negative split.

For an integrated modular form J=∫₀∞ h exp(−4ah) Y^T H Y dh with a constant symmetric H, set b=−a and F=exp(−ah)Y/ψ. Then the exact relation is J=I₋ₐ S. Thus T<0 implies J<0 whenever this is the modular sign sought. If a selected Schur complement requires an additional relation or boundary term, that relation must be established separately: formula (1) does not supply it. Existing old-pivot assumptions needed to define normalized Y are unchanged.

For actual theta and every fixed finite feature degree, ψ decays superexponentially and its logarithmic derivatives have at most exponential growth; the usual derivative-polynomial features therefore make all displayed moments finite. The h factor makes the half-line density vanish at the origin; the BL inequality follows by approximation on compact intervals and passage to the limit. No limit in degree or interchange of an infinite sum is used.

## Exact theta N=1 slack and the recovered payment link

Independent analytic audit PASS. PR #40's tracked `MODULAR_COMMUTATOR_N1_FULL_AUDIT_NEXT.md` gives H=4a[[1,aρ],[aρ,−1]], ρ²=s₀/s₁, and confirms that this is the complete integrated commutator, including the derivative-of-weight term. Under the known positive-prefix assumptions, F=(1/√s₀,(a−v)/√s₁) under ν₋ₐ. Hence F₀ is constant and only B₁₁−C₁₁ can contribute to the BL slack. The exact formula is

 T−S=2a(√(1+a²ρ²)−1)(B₁₁−C₁₁),
 B₁₁=E[v'²/(h⁻²+2v')]/s₁,   C₁₁=Var(v)/s₁.

As a↓0, s₁~aσ₁ and ρ²→σ₀/σ₁, so T−S=O(a²). The tracked `MODULAR_VPRIME_TILT_CERTIFICATE_NEXT.md` certifies C₁<0 for 0<a≤1/4 and its normalized cancellation-safe endpoint is strictly negative. Consequently, using that existing certificate and continuity, this BL test is also negative on some unspecified positive-shift neighborhood. This is a consequence of the already certified sign, not an independent proof of it or a uniform N result.

Most importantly, the tracked `MODULAR_N1_S2_PAYMENT_REDUCTION_NEXT.md` gives κ₁μ₁⁻=−C₁+Rₐ, Rₐ>0. Therefore C₁<0 alone underpays the negative-square cost; the strong sufficient payment is s₂/s₁+C₁≥Rₐ. The note proves the normalized a=0 payment and an unspecified positive-shift neighborhood using separate certified curvature input. Its relation is not asserted equivalent to all parts of the full modular conservation law. The matrix BL test gives no new payment of Rₐ and no higher-degree conclusion.
