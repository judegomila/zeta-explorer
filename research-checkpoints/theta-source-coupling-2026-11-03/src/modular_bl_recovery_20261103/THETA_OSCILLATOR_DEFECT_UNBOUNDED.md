# Actual-theta obstruction to uniform relative oscillator-defect control

Status: independent analytic audit PASS. This concerns arbitrary same-parity derivative-polynomial tests, not the selected residual or a signed X/Y correlation.

Let ψ be the complete real even theta profile and F(t)=∫_R ψ(h)e^(−ith)dh, a nonzero constant-scaled Xi function under the chosen Fourier convention. Fix any c>0 and η=(D+ch)ψ. Then

 η̂(t)=i[tF(t)+cF'(t)].                                              (1)

A candidate Gaussian-perturbation estimate would assert a finite M such that

 ||p(D)η||₂ ≤ M ||p(D)ψ||₂                                         (2)

for every polynomial p of a given parity. This is false for the actual theta profile, separately in each parity, for every c>0.

Indeed Xi has a nonzero real zero t₀ of finite order m≥1; no simplicity assumption is needed. At t₀, tF+cF' vanishes to order exactly m−1 while F vanishes to order m. Hence their absolute ratio grows as cm/|t−t₀|.

To pass from local spectral ratios to polynomial tests, let μ have density |F|²+|tF+cF'|². Uniform L¹ control on shifted lines inside the theta analytic strip, including for hψ, or the completed-Xi gamma-factor bounds, gives μ a positive exponential moment. Polynomials are dense in L²(μ): if a function is orthogonal to all polynomials, its μ-weighted bilateral Laplace transform is analytic near zero with every derivative zero, and Fourier uniqueness gives the function zero. Since μ is even, its even and odd polynomials are dense in the corresponding parity subspaces.

For an arbitrarily large M choose a small symmetric pair of intervals around ±t₀, excluding the zeros themselves, on which |tF+cF'|>2M|F|. Approximate the even indicator of that pair, or its odd signed counterpart, in L²(μ) by same-parity real polynomials q. The two Fourier norms of qF and q(tF+cF') then converge separately; for a sufficiently close approximant the ratio exceeds M. Replacing q(t) with p(it), using a harmless global phase, realizes the same ratio for real physical polynomials p(D) of the desired parity. Plancherel proves the claim.

The analytically observed midpoint cancellation η=O(h³) does not change this spectral obstruction. The statement does not control the actual selected polynomial, does not rule out a degree-dependent bound or a sign-sensitive cancellation, and does not say that the theta paired gap is false. It is a targeted operator-level no-go, not a lower bound on a Schur pivot and not an RH claim.
