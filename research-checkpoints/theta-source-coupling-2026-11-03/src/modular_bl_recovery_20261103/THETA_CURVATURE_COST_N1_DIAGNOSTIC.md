# Theta curvature-remainder cost: n=1 floating diagnostic

Status: exploratory numerical quadrature only. No interval, tail or roundoff certification.

For the actual theta profile and Fourier convention F(t)=∫ψ(h)e^(−ith)dh, let λ=2(F'²−FF'') and q₁(t)=t. The owned `theta_curvature_cost_probe.py` uses eight theta orbits, 400-point Gauss–Legendre quadrature on 0≤h≤2.5, and a trapezoid grid 0≤t≤100. It reports

 D₁=∫λ≈0.7901261,   Q₁=∫t²λ≈9.2808444,
 [∫(λ''−λ)_+t²]/D₁≈0.01437.

Thus C=1 looks feasible at this finite rung. Oscillatory Fourier quadrature, finite source and frequency cutoffs, and the near-zero sign of λ''−λ are not certified; the tiny estimated cost at larger C is particularly vulnerable to numerical noise. This does not prove the hypothesis even for n=1 and gives no bound for larger degree. The rigorously checked two-Gaussian countermodel shows that a positive first pivot alone cannot make the criterion automatic.
