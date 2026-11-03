# Full-shift Sobolev forcing and a directional hard-edge hypothesis

Status: independent analytic review PASS, under the finite-prime, compact-shift and old-block hypotheses below. No uniform hard-edge estimate or bridge positivity is proved.

Let F be the complete even theta transform. For a≥0 write F_b(t)=F(t+ib), W_b(t)=−Im(F'_b conjugate(F_b)), and λ_a=W_a/a for a>0. Since W_0=0 and ∂_bW_b=|F'_b|²−Re(F''_b conjugate(F_b)), the endpoint-normalized limit is λ_0=F'²−FF''. For τ>0 put

w_{τ,a}=avg_{0≤b≤a}(|F_b|²+τ|F'_b|²),
s_{τ,a}=avg_{0≤b≤a}(|F''_b|²+τ⁻¹|F'_b|²),

with the evident a=0 limits. Joint Cauchy over b and the two components gives λ_a²≤w_{τ,a}s_{τ,a} pointwise, all finite a≥0. The complete theta transform and its derivatives are exponentially decaying on horizontal strips of bounded imaginary height, so the corresponding polynomial-weighted integrals converge. For a>0 the parent w_{τ,a}(t) is strictly positive: otherwise F vanishes on a vertical interval and hence identically. At a=0 its isolated zeros can be assigned ratio zero.

In either parity and n≥2 let v be the lower basis, B=∫vvᵀw_{τ,a}, A=∫vvᵀλ_a>0, and q_B the monic w_{τ,a}-orthogonal residual. Then e=∫v q_B λ_a satisfies

eᵀB⁻¹e≤∫q_B² λ_a²/w_{τ,a}≤∫q_B²s_{τ,a}.             (1)

This is a finite complete-theta forcing bound independent of the next signed pivot. The actual residual is q=q_B−vᵀA⁻¹e. It does not follow from (1) that its B-mismatch energy E=eᵀA⁻¹BA⁻¹e is uniformly bounded. For n=0,1 there is no lower basis and E=0.

## Exact direction-specific condition

Set C=B⁻¹/²AB⁻¹/²>0, u=B⁻¹/²e, and μ(I)=||1_I(C)u||². Then

E=∫_(0,∞) λ⁻² dμ(λ).                                      (2)

This is exact, with no use of the next signed pivot. Define P=∫q_B²w_{τ,a}>0. A sufficient directional hypothesis, uniformly over degrees and any specified shift set, is

μ((0,s])≤C₀ P s^(2+η) for 0<s≤1, and ||u||²≤V₀P,         (3)

for fixed C₀,V₀,η>0. Integration by parts yields

E/P≤V₀+C₀(1+2/η).                                         (4)

Unlike a lower eigenvalue bound for C, (3) permits arbitrarily small eigenvalues: it asks that the particular complete-theta forcing have very little projection onto near-null old modes. It is a concrete candidate for an independently proved theta/arithmetic estimate, not a theorem established here. Its first condition bounds the squared B-norm of the projection of the forcing onto the old near-null eigenspace. The second can be sought using (1), but no uniform-in-degree Sobolev-energy ratio is established. Uniform E/P would imply μ((0,s])≤(E/P)P s²; the exponent 2+η is a sufficient strengthening, not a necessary condition.

## Centered prime covariance on a compact shift strip

Let 0<η₀<1/2 and P be a finite prime set. Set R_P(z)=∏(1−2p^(−1/2)cos(z log p)+p⁻¹), and
 k_a(t)=−Im(R_P'(t+ia)/R_P(t+ia))/a.
The denominator is nonzero for |a|<1/2. For a>0,
 k_a(t)=−∑_{p,m≥1} c_{p,m}(a) cos(m t log p),
 c_{p,m}(a)=2(log p)/a · p^(−m/2) sinh(m a log p),
with c_{p,m}(0)=2m(log p)² p^(−m/2). This includes the a=0 limit k_0=−(log R_P)''.

Let ρ_a=|F_a|²/w_{τ,a}, with the a=0 zero convention. The fundamental theorem and Cauchy imply

0≤ρ_a≤2 max(1,a²/τ) for a>0;  0≤ρ_0≤1.                  (5)

Indeed |F_a|²≤2|F_b|²+2a∫₀ᵃ|F'_s|²ds for each 0≤b≤a; average b. The exact product identity for the normalized shifted bridge is

λ_a(R_PF)/|R_P(t+ia)|² = λ_a(F)+k_a|F_a|².

Thus the correction is represented relative to the same positive parent by K_a=ρ_a k_a; its *full centered covariance* under ν∝q_B²w_{τ,a} is given by the prime-pair formula of SOBOLEV_MISMATCH_OBSTRUCTION, using Φ_j(s)=Eν[ρ_a^j cos(st)] and the a-dependent coefficients c_{p,m}(a). A global minus sign in k_a cancels in its variance. No individual prime-pair sign is assumed.

For 0≤a≤η₀, c_{p,m}(a)≤2m(log p)² p^(−m(1/2−η₀)). Hence truncation at m=M has uniform absolute error at most

T_M(η₀)=∑_{p∈P} 2(log p)² q_p^(M+1)[(M+1)−M q_p]/(1−q_p)²,
q_p=p^(−1/2+η₀)<1.

For K_{a,M}=ρ_a times the truncated kernel, ||K_a−K_{a,M}||∞≤R T_M with R=2 max(1,η₀²/τ). Thus

|Varν(K_a)−Varν(K_{a,M})|≤R T_M [2R∑_{p,m≤M}2m(log p)²q_p^m+R T_M].

The bounds remain finite for each fixed η₀<1/2 and finite P. When P is nonempty, these displayed bounds diverge as η₀ approaches 1/2 and do not justify a uniform endpoint extension. No uniform degree-independent covariance or directional hard-edge bound is proved.
