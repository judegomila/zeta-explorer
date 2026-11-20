# An explicit all-degree one-sided Ward bound in the exterior shift region

Status: independent analytic review PASS. This quantitatively strengthens an already-established exterior region; it does not enter the unresolved critical shift range.

## 1. Domain and explicit constant

Use the original F(z)=2ξ(1/2+iz), normalized bridge density

Λ_a(t)=−Im(F′(t+ia) conjugate(F(t+ia)))/a, a>0.

Fix δ>0 and allow every a≥1/2+δ. Set σ=1/2+a≥1+δ and

L(σ)=Σ_{m≥2}Λ_vM(m)m^{−σ}=−ζ′(σ)/ζ(σ)>0,
C_δ=π/2+2/(1+δ)+2/δ+2L(1+δ).                                (1)

Here Λ_vM denotes the von Mangoldt function, not the bridge density. The prime-power sum converges absolutely and is unrelated to a finite sieve. An entirely elementary upper bound is obtained by putting r=2^{−δ}:

L(1+δ)≤(log 2) r(2−r)/(1−r)².

Indeed Λ_vM(m)≤log m and grouping integers 2^k≤m<2^{k+1}, k≥1, yields that geometric sum. The exact constant in (1) behaves as 4/δ+O(1) as δ↓0, by the ordinary pole of ζ at 1. The elementary substitute is less sharp.

We prove uniformly in this full exterior range

Λ_a(t)>0,  |∂_t log Λ_a(t)|≤C_δ for all real t.                (2)

## 2. Positive zero sum and its relative derivative

The standard unconditional zero strip and paired Hadamard product give

ρ_σ(t)=Re(ξ′/ξ)(σ+it)
      =Σ_{ρ=β+iγ}(σ−β)/[(σ−β)²+(t−γ)²]>0,

with the usual symmetric zero ordering. The displayed real series is absolutely convergent; all β lie in (0,1). Since σ−β≥δ, its termwise derivative satisfies

|ρ_σ′(t)|≤ρ_σ(t)/δ.                                          (3)

This follows from 2|x|/(d²+x²)≤1/d≤1/δ. Differentiation is locally justified by the same summability and positive gap. The absence of an extra real constant is the standard paired-Hadamard normalization already used in the campaign's exterior-shift proof; it follows equally from the even Xi product.

Functional symmetry gives

Λ_a(t)=(4/a)|ξ(σ+it)|² ρ_σ(t),
∂_t log Λ_a=−2 Im(ξ′/ξ)(σ+it)+ρ_σ′/ρ_σ.                     (4)

Thus it remains to bound the first logarithmic derivative without using a zero-side positivity criterion in the critical strip.

## 3. Explicit gamma and prime-power bounds

For s=σ+it, σ>1,

ξ′/ξ(s)=1/s+1/(s−1)−(1/2)log π+(1/2)digamma(s/2)+ζ′/ζ(s).

The rational imaginary parts are bounded by 1/(2σ) and 1/[2(σ−1)]. If x=σ/2 and y=t/2, the standard digamma series gives

|Im digamma(x+iy)|=Σ_{k≥0}|y|/[(x+k)²+y²]
≤1/(2x)+π/2.

The estimate uses the first term plus the decreasing integral; it holds also at y=0 by continuity. Absolute Euler-product convergence gives |ζ′/ζ(s)|≤L(σ)≤L(1+δ). Consequently

2|Im(ξ′/ξ)(s)|≤2/σ+1/(σ−1)+π/2+2L(σ).

Combining this with (3) proves (2) with (1). Every ingredient is unconditional outside σ>1. The full kernel and every prime power remain present.

## 4. Actual selected residuals and a uniform degree bound

Let p_n(t;a) be the actual monic orthogonal polynomials for Λ_a(t)dt and h_n(a)=∫p_n²Λ_a. Positivity of this measure in the exterior follows independently from Section 2, so these actual selected polynomials exist at every degree. All integrations by parts have vanishing boundary terms by Gamma decay. The selected Ward identity gives

n h_{n−1}=−∫p_n p_{n−1}Λ_a′.

Using (2) and Cauchy–Schwarz in this now independently positive measure,

n h_{n−1}≤C_δ sqrt(h_n h_{n−1}),

hence

h_n(a)/h_{n−1}(a)≥n²/C_δ²,
h_n(a)≥(n!)² C_δ^{−2n} h_0(a).                               (5)

For every c>0 the actual signed Ward defect therefore satisfies

E_{n,c}(a)≥[2c n²/C_δ²−n] h_{n−1}(a),                       (6)

uniformly for all n≥1 and a≥1/2+δ. This allows large beneficial positive defects: (6) is nonnegative once n≥C_δ²/(2c). In the notation of the sufficient bound from the preceding packet, ε_n=2cn/C_δ² is a valid explicit positive margin; it need not be less than one.

No absolute-defect estimate is used. Both parity ladders participate through adjacent selected polynomials. Monic pivot lower bounds (5) are not eigenvalue or full inverse-conditioning bounds for an arbitrarily scaled Gram matrix.

## 5. Exact limitations and noncircularity

This is not an induction proof in the critical range: the positivity used for Cauchy–Schwarz is established independently only by the exterior positive zero sum. Moving that step into 0≤a<1/2 without a separate sign proof would be circular. The previous normalized a=0 signed examples remain fully compatible with this theorem.

The constant C_δ diverges as δ↓0, so this particular estimate supplies no uniform boundary passage or critical-strip control. This degeneration does not prove that the actual logarithmic score diverges at a=1/2; individual terms in the gamma/Euler decomposition can cancel there. Nor does the theorem assert an obstruction to a sharper method.

The result is a genuine all-degree arithmetic bound on the selected signed defect in an already-known positive region, not new RH scope, a new finite certificate, or a proof for arbitrary spatial cutoffs. The original full spatial kernel is essential.

Primary standard identities: the Euler product/logarithmic derivative in Re s>1 and the digamma partial-fraction series. The paired Hadamard/zero-strip normalization is retained from FULL_SHIFT_DEGREE9.md Section 5 and its independently audited source dependencies.

Primary links: Euler product https://dlmf.nist.gov/25.2#E11; unconditional zero strip https://dlmf.nist.gov/25.10; digamma series https://dlmf.nist.gov/5.7#E6. These support the standard inputs only; the displayed explicit score and Ward bounds are derived above.
