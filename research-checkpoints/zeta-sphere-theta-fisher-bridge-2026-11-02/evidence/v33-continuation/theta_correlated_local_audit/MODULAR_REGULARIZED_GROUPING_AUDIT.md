# Independent symmetrized regularization audit

Analytic PASS without corrections, 2026-11-03. No numerical computation.

Euler approximation errors at s and1-s average to the exact xi-Y_N error. The derivative of the reflected term has a minus sign; absolute weighted norms pay it. The bounds remain valid for any fixed real p because the coefficient/error modulus functions are even in t under complex conjugation. Gamma tails and N^-sigma logN bounds give convergence uniformly on compact sigma subsets of(0,1), without uniform polynomial-degree conditioning.

Direct substitution z=pi*n^2*exp(2u) gives transform(f_n)=s(s-1)pi^(-s/2)Gamma(s/2)n^-s=2A(s)n^-s. The added g_N gives s*pi^(-s/2)Gamma(s/2)N^(1-s), precisely twice the Euler counterterm. The raw Mellin domain is Re(s)>-2; reflecting also imposes Re(s)<3, equivalently |Im(z)|<5/2. Therefore the symmetric profile transform is exactly2Y_N in that strip, with removable poles interpreted after cancellation.

At the negative physical end, the leading coefficient is -12pi sum_(n<=N)n^2+4pi N^3=-2pi N(3N+1). Symmetrization halves it and yields the stated negative exponential tail of chi_N at either end. chi_N(0)>0, so it has a real zero and cannot inherit full-theta positivity/log-curvature. None of these are inferred from numerics.

Evenness plus Parseval gives the exact scalar derivative8pi integral_0^infinity u*sinh(2au)*chi_N^2, finite and strictly positive for0<a<5/2. This repairs the unsymmetrized scalar failure but proves no higher-degree bridge positivity. The signed finite-form lower bound exceeding the actual error remains unpaid. No new theta ladder degree, all-degree estimate, or RH conclusion follows.

Separately added Section4 accepted: X_N(0)=0 since D_N(0)=0 and A(0) is finite, whereas X_N(1)=1/2 by the retained counterterm. Thus F_N(i/2)=1/2. At the center F_N(0)=Gamma(1/4)pi^-1/4 b_N/4, with b_1=1 and strictly positive increments. The elementary integral e^-x>1-x on(0,1) gives Gamma(1/4)>16/5, and pi<4 yields F_N(0)>4/(5sqrt2)>1/2. Therefore the squared modulus decreases between the endpoints, forcing a strictly negative shift derivative at some interior a_N. Gamma vertical decay makes the even signed density exponentially integrable; polynomial density then supplies negative directions in both parity spaces at finite, unspecified degrees. This applies to every FIXED N approximant, not actual xi and not a degree-adaptive scheme. No actual-theta residual sign or location of a_N is identified. The positive scalar integral and negative local spectral density are consistent.
