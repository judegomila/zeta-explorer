# The actual two-feature modular metric is not log-concave near the midpoint

Status: independent analytic audit and midpoint MPFI replay PASS. It rules out a specific scalar Brascamp–Lieb route, not a matrix inequality or an integrated commutator estimate.

Use the actual complete theta profile ψ and modular N=1 notation of MODULAR_REFLECTION: F₀(h,a)=e^(ah)ψ(h), F₁=∂_hF₀, known positive pivots s_j(a), Y_j=F_j/√s_j, reflection matrix R and invariant metric G=I+RᵀR. Let σ_j=lim_{a↓0}s_j(a)/a>0 and α=σ₁/σ₀. The reconstructed MPFI calculation in MIDPOINT_MPFI_CERTIFICATE.md, independently audited and replayed, gives 0<α<13 and q=v'(0)>17 for v=−ψ'/ψ. These inequalities suffice; they do not require the unavailable prior first-prefix interval.

At a=0, reflection is parity and R→diag(1,−1), hence G→2I. The physical pivots and features have smooth normalized limits, so locally in h, with two derivatives,

 a Y(h,a)ᵀG(a)Y(h,a) → 2 f(h),
 f(h)=ψ(h)²/σ₀+ψ'(h)²/σ₁.                              (1)

By evenness ψ'(0)=0. Put q=v'(0)=−ψ''(0)/ψ(0)>17. Then f'(0)=0 and

 f''(0)= [2ψ(0)²/σ₀] q(q/α−1)>0.                          (2)

It follows that (log f)''(0)>0. Continuity in (a,h) gives some ε>0 such that for every sufficiently small 0<a<ε, the positive modular metric density YᵀGY has positive logarithmic second derivative at some h>0 near the midpoint. It is therefore not log-concave on (0,∞).

This is stronger than the separate-feature observation: the *sum in the actual positive modular metric* fails the scalar log-concavity hypothesis already at N=1 and arbitrarily small positive shifts. It uses the known first-prefix ratio, not the unknown next pivot. It does not preclude a different scalar weight, a matrix Brascamp–Lieb inequality, or a direct correlated modular Schur estimate. No explicit ε is claimed.

The integrated modular weight includes the additional factor h e^(−4ah). Its logarithm contributes −1/h² to the second derivative, so the midpoint calculation above does **not** determine whether h e^(−4ah)YᵀGY is log-concave. The no-go applies to the stated unweighted metric density only.
