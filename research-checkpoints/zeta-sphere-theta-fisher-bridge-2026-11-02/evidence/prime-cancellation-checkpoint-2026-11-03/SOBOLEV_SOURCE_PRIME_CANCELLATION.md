# Exact complete-theta source/prime cancellation in Sobolev-parent L²

Status: independent analytic review PASS for the source/prime identity, asymptotics and localization corollary. This is an unconditional Hilbert-space cancellation theorem for the *constant-old-test coefficient vector*. It does not prove bridge positivity, a bound on the actual signed inverse, or a degree-uniform selected-residual estimate.

Fix τ>0 and a∈[0,1/2). Let F be the complete even theta transform, w=w_{τ,a}=avg_{0≤b≤a}(|F_b|²+τ|F'_b|²) with F_b(t)=F(t+ib), and λ=λ_a(F)=−Im(F'_a conjugate F_a)/a, with the audited continuous normalized a=0 limit Λ=F'²−FF''. Let p₀ be the positive constant normalized in L²(w dt), and {p_N}_{N≥0} the complete real even parent-orthonormal polynomials. The parent has exponential moments and is positive a.e., so this basis is complete in the even subspace.

For X≥2, let R_X(z) be the finite symmetric Euler product over primes p≤X. It is zero-free on |Im z|<1/2. Define the *positive* prime correction

K_X(t)=∑_{p≤X}∑_{m≥1} c_{p,m}(a) cos(m t log p),
 c_{p,m}(a)=2(log p)p^(−m/2)sinh(m a log p)/a,
with c_{p,m}(0)=2m(log p)²p^(−m/2). The harmonic series converges uniformly in t for each finite X.

Define elements of H=L²_even(w dt), assigning arbitrary values at isolated zeros of w,

E(t)=p₀ λ(t)/w(t),
D_X(t)=p₀ |F_a(t)|² K_X(t)/w(t),
S_X(t)=p₀ λ_a(R_XF)(t)/[w(t)|R_X(t+ia)|²].

The exact finite Euler product identity gives E=S_X+D_X pointwise a.e. The audited shifted Sobolev bound λ²/w≤avg(|F''_b|²+τ⁻¹|F'_b|²) makes E∈H for every fixed a including 0. For each finite X, the bounded K_X and |F_a|²/w≤2max(1,a²/τ) give D_X∈H. The identity then gives S_X∈H, with no independent positivity assertion and no need to invert R_X outside its valid strip.

## Asymptotic size of the complete signed prime vector

Write the finite nonzero positive weight
 H_a(t)=p₀² |F_a(t)|⁴/w(t).
It is integrable since |F_a|²/w is bounded and F_a∈L².

At a=0, the unconditional prime number theorem and partial summation imply, for fixed real t,

K_X(t)/(√X log X) = 2 Re[e^(it log X)/(1/2+it)] + o(1). (1)

The normalized left side is uniformly bounded in t and sufficiently large X. The m≥2 contribution is O((log X)^3), using an integer majorant, and is negligible. Dominated convergence applied to the difference from the oscillatory main term, followed by Riemann–Lebesgue, yields

||D_X||_H² ∼ 2X(log X)² ∫ H_0(t)/(1/4+t²)dt >0.          (2)

For fixed 0<a<1/2 put σ=1/2+a. The m=1 term and PNT give

K_X(t)/X^σ = (1/a) Re[e^(it log X)/(σ+it)] + o(1),      (3)

again for fixed t with a uniform bound. The m≥2 part is O_a(X^(2a)log X), which is o(X^σ) because a<1/2; the p^(−1/2−a) portion is also lower order. The same argument gives

||D_X||_H² ∼ X^(1+2a)/(2a²) ∫ H_a(t)/(σ²+t²)dt >0.       (4)

These are fixed-shift asymptotics; (4) is not uniform as a→0 or a→1/2. The integrals are strictly positive because F is not identically zero and w>0 a.e. The conclusion depends only on the classical PNT, finite Euler identities, and the complete-theta decay, not on RH or a hypothesized negative support.

## Necessary source–prime correlation

Since E is a fixed finite-norm vector and ||D_X||_H→∞, the exact identity implies

||S_X||_H/||D_X||_H → 1,
⟨S_X,D_X⟩_H/||D_X||_H² → −1.                             (5)

All quantities are real and even. In parent polynomial coordinates the same equalities hold by Parseval. Thus the all-degree filtered-source and full prime vectors must cancel at leading order, including all signed prime and source cross terms. A proof replacing either by a uniformly smaller uncoupled norm would fail. The cancellation is an exact consequence of the finite-product identity and a fixed target vector; it is not an estimate of a positive remainder.

This norm concerns the constant old test against *all* parent degrees, not the moving inverse-selected residual A_N⁻¹e_N. The conclusion does not imply a uniform per-degree bound, convergence of either divergent vector, or the sign of any Schur pivot. At a≥1/2 the finite Euler factor has zeros on the boundary or within the strip and these formulas are not asserted.

## Localization and the inverse-weighted limitation

For every fixed parent basis polynomial p_N, the coefficients ⟨p_N,D_X⟩ converge absolutely as X→∞ by THETA_PRIME_CORRELATION_TAIL. Since ||D_X||→∞, these fixed components of D_X/||D_X|| tend to zero. The normalized vectors are norm-bounded, so density of finite polynomial spans gives

D_X/||D_X|| ⇀ 0,  S_X/||D_X|| ⇀ 0 in H,
(S_X+D_X)/||D_X|| → 0 strongly in H.

Thus the leading divergence and its cancellation escape every fixed parent-degree window. In particular, any fixed compact operator on H maps both normalized sequences to zero in norm. This does not apply automatically to the moving old inverses A_N⁻¹, which change with N and may have unbounded norms. No inverse-weighted cancellation or uniform selected-residual estimate follows from this localization alone.
