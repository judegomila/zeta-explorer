# Generic selected-window continuation fails, even with strong curvature

Status: independent analytic audit and 160-bit MPFI replay PASS. This is an auxiliary Gaussian-mixture source, not the actual theta profile.

Let

 F(t)=e^(−t²)+e³e^(−4t²),
 λ=2(F'²−FF'')=4e^(−2t²)+16e⁶e^(−8t²)+e³(20−72t²)e^(−5t²).

Its inverse Fourier profile is the strictly positive even Gaussian mixture of STRONG_CURVATURE_HIGHER_MOMENT_NO_GO; its log curvature is bounded above by −[1/8−(3/2)e^(−4)]<0. Rescaling ψ_L(h)=Lψ(Lh) with L=20 makes its log-curvature magnitude exceed 17 and preserves all relevant signed Gram inertias and pivot signs.

Let m_j=∫_R t^(2j)λ(t)dt. The owned 160-bit MPFI script `cert_selected_q4_mixture_mpfi.py` evaluates the exact Gaussian moment formulas with outward intervals and obtains

 m₀∈(4253.78756,4253.78757),  m₁∈(251.51744,251.51745),
 det[[m₀,m₁],[m₁,m₂]]>109868,
 det[[m₁,m₂],[m₂,m₃]]>538.

Thus the full old two-parity prefix through degree 3 is strictly positive. Its actual selected even monic residual q₄=t⁴+at²+b has the exact signed next pivot

 H(0)=m₄−[m₂,m₃] [[m₀,m₁],[m₁,m₂]]^(−1) [m₂,m₃]^T
     ∈(−0.8890,−0.8889).                                          (1)

No nonselected monomial or parent substitute is used. By the selected-even positive-window theorem, applied to this positive-profile source and the positive old prefix, H(s)=∫λ q₄² e^(−st²)dt is strictly positive for all sufficiently large s. Its unwindowed value is negative by (1), and H is continuous, so it crosses zero at least once for s>0.

Therefore no continuation inequality H'(s)≤K(s)H(s), with K integrable through the crossing, can be deduced merely from the complete positive two-point kernel, evenness, the quantitative strong log-curvature bound, and the actual old-prefix positivity. An integrating factor makes H(s)exp(−∫K) nonincreasing; positive H(S) would force H(0)>0, contradicting (1). The same conclusion holds for a bound asserted only where H>0 if K is integrable up to the first crossing.

This is a targeted counterexample to the proposed generic window-removal strategy, not a theta counterexample and not a claim that an explicitly theta-arithmetic differential inequality is impossible. Its source has no Jacobi theta functional equation. The finite MPFI sign, Gaussian moments, rescaling and integrating-factor argument passed independent audit.
