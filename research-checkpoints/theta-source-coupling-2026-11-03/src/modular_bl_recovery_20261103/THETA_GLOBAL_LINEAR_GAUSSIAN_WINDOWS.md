# Global theta paired form on linear Gaussian windows

Status: independent analytic audit PASS. This is an endpoint, degree-one Gaussian-window family, not an all-degree positivity theorem or RH claim.

Let ψ be the complete positive even theta profile, F=ψ̂, λ=2(F'²−FF''), and ℓ=logψ. The already audited actual-theta curvature theorem gives ℓ''(h)<−17 on R. More generally assume ℓ''≤−κ for some κ>0.

For every s≥0 define

 A₀(s)=∫_R λ(t)e^(−st²)dt,    A₂(s)=∫_R t²λ(t)e^(−st²)dt.

Then

 A₀(s)>0,    A₂(s) ≥ [κ/{2(1+κs)}] A₀(s)>0.                         (1)

Consequently for any complex A,B, not both zero,

 ∫_R λ(t)|A+Bt|²e^(−st²)dt
 ≥ A₀(s)[|A|²+κ|B|²/{2(1+κs)}] >0.                                  (2)

The λ integrand is signed; this is a global correlated integral, not pointwise λ positivity. The whole complete theta source, including every orbit cross term, is retained. The Gaussian profile ψ=e^(−κh²/2) gives equality in the ratio bound (1), so its constant is sharp for the stated curvature hypothesis.

## Proof

Use the exact complete-theta conditional-variance kernel from THETA_TURAN_NEXT:

 R(u)=(1/16)∫_R v² ψ((u+v)/2)ψ((u−v)/2)dv,
 λ=8 R̂,      R(2a)=∫₀∞h² ψ(h−a)ψ(h+a)dh.                         (3)

R is positive and even. Differentiating the complete product and using ℓ''≤−κ gives

 d/da log R(2a) ≤ −2κa,   a>0.

Therefore R(u) exp(κu²/4) is nonincreasing as a function of |u|. Theta decay justifies differentiation and the Fourier integrals.

For s>0 the inverse Gaussian Fourier integral gives

 A₀(s)=8√(π/s)∫_R R(u)e^(−u²/(4s))du,
 A₂(s)=A₀(s)/(2s)−[8√(π/s)/(4s²)]∫_R u²R(u)e^(−u²/(4s))du.

The R-weighted Gaussian law is obtained from the centered Gaussian of variance 2s/(1+κs) by multiplying by the nonincreasing function R(u)exp(κu²/4) of |u|. Its covariance with increasing u² is nonpositive, so its second moment is at most 2s/(1+κs). Substitution proves (1). Evenness of λ removes the linear cross term in (2), including for complex A,B.

For s↓0, the complete-Xi exponential frequency envelope justifies dominated convergence; (1) tends to κ/2. Alternatively, Fourier inversion gives A₀(0)=16πR(0)>0 and A₂(0)=−16πR''(0)>0, with R''(0)=(1/2)∫₀∞h²ψ(h)²ℓ''(h)dh<0.

## Scope

The conclusion is a two-dimensional family of global tests. It does not control general high-degree selected polynomials, and no all-degree Schur payment follows. A separate strongly log-concave Gaussian-mixture counterexample to the converse is recorded below once independently checked; thus the family alone need not imply pointwise positivity of λ.
