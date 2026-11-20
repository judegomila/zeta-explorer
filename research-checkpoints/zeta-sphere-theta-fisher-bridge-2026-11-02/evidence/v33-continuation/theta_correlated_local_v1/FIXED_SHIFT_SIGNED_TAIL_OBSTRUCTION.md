# Fixed-shift signed-tail cancellation: what uniform degree control must prove

Status: independent analytic review PASS. This is a sharp limitation on integrated tail-smallness arguments, not a claim of a negative actual-theta density.

## 1. Actual inverse-selection cannot hide a genuinely negative tail interval

Fix 0<a<1/2 and retain the original complete-theta Λ_a. It is continuous, even and has exponential moments, by the contour estimate in DEGREE_DEPENDENT_CRITICAL_BAND.md (or the same contour argument at any fixed a). If Λ_a is negative on any nonempty interval, there exists a polynomial p with ∫p²Λ_a<0, and such polynomials exist in both parity classes.

Proof: polynomials are dense in L²(|Λ_a|dt). Indeed an orthogonal function produces a finite signed density with an analytic bilateral Laplace transform on a strip, all derivatives zero at zero, hence the zero density. Approximate the indicator of a symmetric pair of compact negative intervals to obtain an even polynomial; approximate its signed odd counterpart to obtain an odd polynomial. L² approximation implies convergence of the square integrals in L¹(|Λ_a|dt). No size threshold on the negative interval or its total mass appears.

Thus positivity of every actual inverse-selected pivot at this fixed a is equivalent to nonnegativity of the full density Λ_a(t) at every t. If a negative polynomial exists, take the first degree where the full moment block ceases to be positive definite. Its previous prefix is positive, its actual selected monic extension exists, and its Schur value is ≤0. A degenerate first failure is allowed; strict negativity at the first failure is not asserted.

The converse uses that a nonnegative continuous density with positive scalar mass gives strictly positive polynomial forms. The original scalar bridge mass is positive independently, so no finite-support degeneracy occurs.

This applies to the actual inverse-selected sequence, not only arbitrary ambient polynomial multiples. It does NOT assert that actual theta has a negative interval. It says that cancellation across different frequency intervals cannot pay a genuinely negative density for every degree: localization eventually defeats it. A successful uniform theorem must establish the relevant complete density sign, possibly by signed cancellation among arithmetic/zero contributions at each frequency.

## 2. Fixed interior shifts with arbitrarily remote, exponentially small negative mass

The following admissible analytic analogue demonstrates why a small signed tail budget is insufficient. It is not rank-one modular theta.

Fix any 0<a₀<d₀<1/2. Let b→∞, A=d₀b/π, ε=b^{−4}, and

ψ_b(u)=e^{−Au²/2}(1+ε cos(bu)).

It is positive, even, entire and Schwartz with every exponential moment. Its logarithmic curvature obeys

−(logψ_b)″≥A−εb²/(1−ε)²>17

for all sufficiently large b. Its Fourier transform is exactly

F_b(z)=sqrt(2π/A)e^{−z²/(2A)}[1+c_b cosh(kz)],
k=b/A=π/d₀, c_b=εe^{−b²/(2A)}.

Set γ_b=k^{−1}arcosh(1/c_b), so γ_b=b/2+O(log b)→∞. At z=γ_b+ia₀, put θ=ka₀∈(0,π) and s_b=sqrt(1−c_b²). Direct division gives

−Im(F_b′/F_b)(z)
=a₀/A−k sinθ(1+c_b² cosθ)/[(1+cosθ)²+s_b² sin²θ]
→−(k/2)tan(θ/2)<0.                                          (1)

The denominator is nonzero. Therefore the normalized bridge Λ_{b,a₀} is genuinely negative at the remote frequency γ_b, and on an open interval around it, at the SAME fixed shift a₀.

On every fixed compact frequency interval the correction c_b cosh(kz) and its first derivative are exponentially small, while the base Gaussian logarithmic phase is a₀/A>0. Hence Λ_{b,a₀}>0 on that interval for large b. In particular, this is not a low-frequency failure hidden by rescaling the shift toward zero.

## 3. An explicit global negative-mass bound for the analogue

Write F_b=F_0+F_++F_−, where

F_j(z)=sqrt(2π/A)c_j exp(−(z−μ_j)²/(2A)),
(μ_0,μ_+,μ_−)=(0,b,−b), (c_0,c_+,c_−)=(1,ε/2,ε/2).

Each self bridge is |F_j(t+ia₀)|²/A≥0. Only cross terms can contribute negative mass. Gaussian integration, using
|t−μ_i|≤|μ_i−μ_j|/2+|t−(μ_i+μ_j)/2|,
gives

∫(−Λ_{b,a₀})_+ dt
≤ [2π^{3/2} e^{a₀²/A}/(a₀ A^{3/2})]
 × {2ε[b/2+sqrt(A/π)+a₀]e^{−b²/(4A)}
    +(ε²/2)[b+sqrt(A/π)+a₀]e^{−b²/A}}.                       (2)

Here the ordered base/side pairs have total coefficient 2ε, and the ordered opposite-side pairs have total coefficient ε²/2. The bound follows directly from a₀^{−1}Σ_{i≠j}∫|F_i′||F_j|; no favorable cross sign was discarded from a claimed lower bound.

Since A=d₀b/π, (2) is O(b^{−9/2}exp[−πb/(4d₀)]). Meanwhile on any fixed interval the central positive mass is of order A^{−2}, so the negative mass is exponentially small even relative to that positive reserve. Nevertheless Section 1 applies to this Gaussian-decaying analogue and yields a finite polynomial failure at the fixed shift a₀. The offending degree is not claimed bounded independently of b.

Thus positive central mass, strong physical log-curvature, analyticity, parity, remote negative support and arbitrarily tiny total negative mass do not yield degree-uniform compensation. This does not refute a genuine theta-specific arithmetic sign theorem.

## 4. Relation to the constructed critical band and the remaining arithmetic task

The audited band proof pays an absolute high-frequency tail for each bounded degree; its degree dependence is therefore essential to that particular mechanism. The preceding arguments do NOT prove that the true theta positivity band must shrink. If RH is true, its full density is nonnegative at every positive shift, and no localization obstruction occurs.

More precisely, a theorem proving every degree for every shift a≥a_* with a fixed a_*<1/2 would imply that every Xi zero has imaginary part of magnitude≤a_*. If a zero had height d>a_*, the pole-free local zero factor makes Λ_a negative near its real coordinate for shifts a<d sufficiently close to d. Section 1 then forces a failed finite block at one of those shifts. This conditional argument is the already-audited local zero test, not an assumption that such a zero exists.

Accordingly, the missing lemma must control the full signed arithmetic contributions strongly enough to exclude a genuine negative density throughout the intended fixed shift region. A small integral remainder, or an estimate based only on known zero-free height and contour decay, cannot by itself establish that all-degree conclusion. No new fixed-strip zero-free result, target positivity or RH claim is made here.
