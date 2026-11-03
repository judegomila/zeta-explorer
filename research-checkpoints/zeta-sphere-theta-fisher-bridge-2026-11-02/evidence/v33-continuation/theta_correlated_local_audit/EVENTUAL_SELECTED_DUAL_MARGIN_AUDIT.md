# Independent audit: eventual selected dual margin

2026-11-03. Analytic PASS. Quantifiers: each fixed degree has its own finite sufficiently large shift threshold. No numerical threshold, critical-strip result, or degree-uniform statement is certified.

## Exact measure and asymptotics

The profile factorization psi^2=64 pi^(-1/2) Z^(9/2) exp(-2Z) F(Z) is correct. Transforming 2u^2 sinhc(2au)du = (u/a)sinh(2au)du with u=log(Z/pi)/2 and du=dZ/(2Z) gives precisely the omitted constant 8 pi^(-a-1/2)/a and the displayed gamma-log density. Both sinh branches and the full orbit factor remain present.

F is positive and bounded away from zero on Z>=pi; its large-Z error is O(1/Z). The reference integral with alpha=a+9/2 equals Gamma(alpha+j)2^(-alpha-j)[digamma(alpha+j)-log(2pi)]. The negative logarithm on (0,pi) is harmless as an auxiliary extension: that compact contribution is negligible compared with the growing gamma integral. The opposite sinh branch is bounded by a fixed-j constant times pi^a, since (pi/Z)^a<=1 on Z>=pi, and is likewise negligible. The F error is controlled by the reference moment of 1/Z, of relative order O(1/a).

Thus E Z^j=(a/2)^j[1+O_j(1/a)]. The full-theta local moment asymptotic then gives M_j/(M0 a^j)=(2j-1)!!+O_j(1/a). Standard digamma and gamma-ratio asymptotics independently checked at primary DLMF https://dlmf.nist.gov/5.11.E2 and https://dlmf.nist.gov/5.11.E13. All assertions concern fixed orders before the large-a limit.

## Actual inverse and global spatial bound

After the exact t=sqrt(a)x rescaling and division by M0, the lower parity Gram converges to a positive Gaussian Gram. Continuity of its finite-dimensional inverse proves convergence of the actual selected coefficients without assuming the next target norm sign. The lowest Hermite coefficient is (-1)^N n!/(2^N N!) for both epsilon=0 and epsilon=1, hence nonzero.

The local tail congruence by D_ii=Z^(i+epsilon/2) converges to B=[(2j)!/j!] at j=epsilon+i+k, the variance-2 Gaussian parity Gram. In dimension N+1, lambda_min(B)>=det(B)/(trace B)^N, so the stated eta_n is a valid half-reserve. A sufficiently large fixed spatial R_n realizes (6), independent of the subsequently varying a.

On [0,R_n], coefficient convergence is uniform when multiplied by finitely many continuous local moments; after division by a^(2N), only c0^2 g_epsilon survives. The known g0=1 and g1>17/2 give the compact positive reserve. On u>=R_n, the full local Gram lower bound gives eta_n sum c_i^2 Z^(2i+epsilon), so retaining its i=0 term and |c0|>=|h0|a^N/2 gives the stated tail reserve. Taking the minimum produces the explicit positive delta_n and a finite (unevaluated) threshold A_n. The base n=0 and n=1 cases are compatible.

## Accepted scope

The uncorrected selected local factor, and hence the optimized supporting-plane margin, is positive for every spatial u at all sufficiently large shifts for each fixed degree. This is stronger local information within a regime already covered by exterior integrated positivity. The proof neither bounds A_n uniformly nor places it in [0,1/2], nor changes a zero-free region. It does not conflict with the certified degree-20 negative local factor at a=0, whose selected coefficients differ. No new finite ladder run or numerical certification is claimed.
