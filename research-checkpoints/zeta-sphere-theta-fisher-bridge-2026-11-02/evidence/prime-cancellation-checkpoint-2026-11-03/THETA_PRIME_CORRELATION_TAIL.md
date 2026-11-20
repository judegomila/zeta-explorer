# Full-theta superexponential prime-power correlation tail

Status: independent analytic review PASS. This is a genuine source-specific fixed-degree result, not a uniform-in-degree inverse bound or RH claim.

Let F(z)=∫_R ψ(u)e^{izu}du be the complete even theta transform, up to a fixed nonzero normalization absorbed below. Fix finite physical degrees, a compact shift 0≤a≤η<1/2, and polynomials h_i(t) of bounded degree with real coefficients continuous in a and uniformly bounded on the compact shift interval. In the application h_i=v_i p_N from the actual orthonormal Sobolev-parent basis; for fixed N these coefficients are uniformly bounded because the finite positive parent moment matrices depend continuously on a and are uniformly nonsingular on the compact interval. Define

d_{p,m,i}(a)=∫_R h_i(t)|F(t+ia)|² cos(m t log p)dt.

## Source-specific decay

For each derivative order j and compact η, the complete theta series and its exact reflection imply constants C_{j,η}<∞ such that

|∂_u^j(e^(−au)ψ(u))| ≤ C_{j,η} exp[−(π/2)e^(2|u|)]
for all real u and 0≤a≤η. For u≥0 differentiate the complete theta orbit series, absorb the finite polynomial/exponential prefactors into half of the leading Gaussian exponential, and sum the n≥1 orbit tails. The u≤0 bound follows from ψ even and derivative parity, with e^(−au) absorbed similarly. This is a bound on the complete source, not a finite-orbit truncation.

Write g_a(u)=e^(−au)ψ(u). Fourier inversion expresses ∫|F(t+ia)|²cos(ωt)dt as a fixed normalization times the autocorrelation C_a(ω)=∫g_a(u)g_a(u+ω)du. Multiplication by the polynomial h_i(t) corresponds to a finite linear combination of derivatives ∂_ω^j C_a(ω). For |ω|=L, split the u integral according to |u|≥L/2 or |u+ω|≥L/2. Keeping half of the superexponential factor for integration gives

||d_{p,m}(a)|| ≤ C_{N,η} exp[−(π/4)p^m]                 (1)

for all p,m and 0≤a≤η, with a finite constant depending on N, η, and the actual parent basis, but not p,m,a. The precise Fourier normalization is absorbed into C_{N,η}. No inverse or next signed pivot is used in (1).

## All-prime convergence and explicit tail

For the shifted Euler phase coefficients of CORRELATED_PRIME_INVERSE,

0≤c_{p,m}(a)≤2m(log p)² p^(−m(1/2−η))≤2m(log p)².

At q=p^m, m(log p)²=(log q)²/m≤(log q)². Each prime power has a unique prime base. Thus the sum of absolute vector contributions over all prime powers q>K is bounded by

2C_{N,η}∑_{q>K, q prime power}(log q)² exp(−πq/4)
≤2C_{N,η}∑_{n>K}n² exp(−πn/4).                         (2)

For integer K≥1 the final sum equals, with x=exp(−π/4),

x^(K+1)[(K+1)²/(1−x)+2(K+1)x/(1−x)²+x(1+x)/(1−x)³].   (3)

Therefore the full signed prime vector ∑_{p,m}c_{p,m}(a)d_{p,m}(a) converges absolutely in finite-dimensional norm over all primes, uniformly for 0≤a≤η. The individual vector terms and their correlations retain their signs; (2) is used only to pay the tail.

For each finite prime set P, the exact product identity gives e=d₀(P)+∑_{p∈P,m}c d_{p,m}. Hence d₀(P) converges, along any exhaustion of primes, to e minus the absolutely convergent full-prime vector, uniformly in a at fixed degree. This is a limit of the *integrated source vectors*, not a claim that the infinite Euler multiplier exists or is nonzero pointwise. For fixed N and old A_N(a)>0 throughout the compact shift interval, continuity gives a finite uniform inverse norm, so the same convergence holds after applying the actual A_N(a)⁻¹. If old positivity is not known on the whole interval, the inverse claim applies only on compact subsets where it is known.

The constants C_{N,η} and, for the last statement, the actual inverse bound can deteriorate severely with N. Nothing here proves a uniform-in-degree correlation or mismatch bound, justifies interchanging N→∞ with the prime limit, or removes the fixed-strip condition η<1/2.

## Explicit dependence on the actual old inverse

On a compact shift set where A_N(a)>0, each entry of A_N(a)⁻¹ is continuous and bounded. Instead of factoring out the operator norm, apply the same derivative/correlation proof coordinatewise to the actual inverse-dual polynomials

g_i(t,a)=∑_j(A_N(a)⁻¹)_{ij}v_j(t,a),

using h_i=p_Ng_i. Taking the Euclidean sum of the resulting finite coefficient-weighted theta derivative constants gives a finite C^{inv}_{N,η} such that

||A_N(a)⁻¹d_{p,m}(a)||≤C^{inv}_{N,η}e^(−πp^m/4).

Its entries and coefficients are determined by the actual old signed Gram and positive parent, not an auxiliary norm. Alternatively C^{inv}_{N,η}=C_{N,η}sup_a||A_N(a)⁻¹|| works. These are explicit structural dependencies, not a degree-uniform bound: the derivative constants, parent polynomial coefficients and inverse-dual polynomial coefficients may all grow with N.
