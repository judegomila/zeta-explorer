# Selected theta oscillator defect defeats a naive O(1/n) triangle payment

Status: independent analytic and MPFI replay audit PASS, including the infinite-orbit and spatial tails.

Take the exact endpoint decomposition Xp=X₀p+Ep with
 c=v'(0)=−ψ''(0)/ψ(0),  η=(D+ch)ψ,
 X₀p=−(2/c)D p(D)ψ−p'(D)ψ,  Ep=(2/c)p(D)η,
 Yp=p'(D)ψ.
Let p_n be the monic actual signed-residual polynomial, using the full old signed inverse. A natural sufficient pair for a positive paired Schur form is

 ||Yp_n|| ≤ [1−1/(4(n+1))] ||X₀p_n||,                               (1)
 ||Ep_n|| ≤ [1/(8(n+1))] ||X₀p_n||.                                 (2)

Indeed triangle inequality gives ||Xp_n||≥[1−1/(8(n+1))]||X₀p_n||>||Yp_n||. This is a sufficient strengthening, not equivalent to positivity. The Gaussian satisfies it because η=0 and ||Y||/||X₀||=√(n/(n+1)).

For the actual theta profile n=1 has no old parity regressors and p₁(x)=x. Thus
 X₀p₁=−2ψ''/c−ψ,    Ep₁=2(ψ''+cψ+chψ')/c.                        (3)
At n=1, (2) requires ||Ep₁||/||X₀p₁||≤1/16. Independently reproduced floating diagnostics give 0.1194328083, compared with 0.0625. For n=2 the actual signed regression gives p₂(x)=x²+11.746029959..., and the ratio ≈0.1827887584 exceeds 1/24. These diagnostics are not certificates.

An owned 160-bit MPFI rectangle enclosure `cert_n1_defect_mpfi.py` uses 5,000 outward interval cells covering [0,2], n=1,2 theta orbits, and a conservative ±0.001 enclosure for the omitted orbits and their first two derivatives. It gives c in (18.72690492950331,18.72690492950334), an upper bound 1.5153 for ∫₀²(X₀p₁)² and lower bound 0.00978 for ∫₀²(Ep₁)². Thus the displayed finite-interval margin B−A/256 exceeds 0.00386. With the audited spatial tail below 10^(-20), this certifies that the full theta ratio exceeds 1/16.

For the proposed analytic tail: on 0≤h≤2, z_n=πn²e^(2h)≥3n²≥27 for n≥3, and every derivative polynomial through order 2 is bounded in absolute value by 11z_n⁴. Since z⁴e^(-z) decreases for z≥27 and e^(h/2)≤e, the omitted orbit sum is at most 44e·81 Σ_(n≥3)n⁸ e^(−3n²)<0.001. For h≥2, z=πe^(2h)>162 and Σ_(n≥1)n⁸e^{−(n²−1)z}<2. The same derivative-polynomial bound yields |ψ|,|ψ''|≤9000 e^(17h/2)e^(−πe^(2h)). Since c>17, |X₀|≤27000 e^(17h/2)e^(−πe^(2h)); direct exponential integration gives ∫₂∞X₀²<e^(−269)<10^(−20). No tail lower bound is needed for E².

This falsifies the particular absolute defect budget (2). It does not falsify the signed paired gap. The independently reproduced signed cross term Re⟨X₀,E⟩/||X₀||² is approximately −0.02563 at n=1 and +0.04607 at n=2, emphasizing that its sign cannot be discarded. The unrestricted-polynomial spectral no-go likewise does not decide the selected sequence.
