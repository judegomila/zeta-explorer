# Gaussian N=2 counterexample to uniform weighted metric log-concavity

Status: independent analytic review PASS. This is an auxiliary Gaussian model, not an assertion about the actual theta N=2 metric.

Let ψ(h)=exp(−c h²/2), c>17. Its Fourier transform has F(z)∝exp(−z²/(2c)); for every a>0 its normalized bridge density is proportional to |F(t+ia)|²/c, a strictly positive Gaussian. Hence all signed pivots in both parities are positive. The physical profile also satisfies −(logψ)''=c>17.

At a→0 the invariant modular metric G_N=I+R_NᵀR_N tends to 2I. For N=2 the first monic parity polynomials correspond to physical T₀=1, T₁=D and T₂=D²+c/2, while the normalized pivot ratios are σ₁/σ₀=c/2 and σ₂/σ₀=c²/2. Consequently the limiting weighted metric density is, up to a positive constant,

 ρ(h)=h exp(−c h²)[1+2c h²+2(c h²−1/2)²]
     =h exp(−c h²)[3/2+2(c h²)²].                         (1)

Setting y=ch², direct differentiation gives

 (logρ)''/c = −1/y−2+(36y−16y³)/(3/2+2y²)².

At y=3/5 the value equals 61/4107>0 exactly. Thus this h-weighted N=2 modular metric is not log-concave even though the profile is strongly log-concave and every signed pivot is positive. Smooth dependence on a and the positive pivot ratios implies the strict positive curvature persists at that fixed h for all sufficiently small a>0.

This refutes a generic inference that profile curvature >17, positive pivots and the modular metric force the h-weighted metric density to be log-concave at every N. It does not show that the actual Riemann theta N=2 density fails log-concavity, and it does not rule out a theta-specific matrix or correlated form inequality.
