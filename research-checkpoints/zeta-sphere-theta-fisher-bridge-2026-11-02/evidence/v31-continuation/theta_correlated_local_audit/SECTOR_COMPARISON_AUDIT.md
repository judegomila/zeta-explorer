# Independent fixed-sector cost comparison audit

PASS, 2026-11-03. Limitation of a sufficient method, not an actual-theta pivot failure.

For psi_G=exp(-17u²/2), F=sqrt(2pi/17)exp(-t²/34) and Lambda=F²/17=(2pi/289)exp(-t²/17). Monic residuals for this actual Gaussian spectral weight are17^N 2^(-2N)H_(2N)(t/sqrt17). Thus the example preserves genuine residual orthogonality, rather than selecting a convenient arbitrary polynomial.

At N1 the full squared y norm is sqrt(pi)/2, and integrating y4-y²+1/4 on[-1,1] gives sqrt(pi)erf(1)/2-3/(2e). The stated fraction follows. Since erf1<1 and e sqrt(pi)<6, it is strictly below1/2. On this band1-y²<=exp(-y²), so the sector reserve is no larger than the actual inside norm; outside absolute cost equals the actual positive outside norm. The method therefore gives a negative lower bound despite a positive actual Gaussian pivot.

Hermite multiplication gives E y²=n+1/2 and E y4=3(2n²+2n+1)/4. Their ratio is at least5/8 for n>=2. Paley–Zygmund at theta1/16 yields outside threshold mass>=1125/2048>1/2. Hence a band containing more than half the norm must have squared physical radius>17(n+1/2)/16. At fixed radius sqrt17 and n>=16, the sufficient comparison is at most(1-2*1125/2048)=-101/1024 times the true norm. Even n2N and odd n2N+1 both include every N>=8. This is a necessary band-growth condition for that method, not a sufficient estimate.

For the separate actual-theta-weight family, all x roots lie in(1,3/2], giving |R_N|<=16^N on x<=17 and |R_N|>=(47/2)^N on25<=x<=36. Actual Lambda is entire, nonzero at zero, and therefore not identically zero on[5,6]; its absolute integral there is positive. Divide the resulting tail lower bound by2sqrt17 Lambda(0)16^(2N) to obtain the stated exponential ratio. This polynomial family is expressly not identified with actual theta orthogonal residuals.

Accepted: the fixed-width/absolute-tail strategy cannot be justified uniformly from curvature, rapid decay, genuine Gaussian orthogonality, or positive-root structure alone. No assertion is made that every actual-theta residual fails that test. Signed exterior contributions, expanding sectors, and direct divisor-core comparison remain possible routes.
