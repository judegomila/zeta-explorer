# Uniform all-orbit transport with a retained matrix covariance budget

Status: exact derivation, independent analytic review, and constant replay passed. No all-degree bridge positivity is claimed.

## 1. A uniform actual-theta first-orbit mass bound
For h>=0 put z=pi exp(2h),
 f_n=4exp(h/2) z n²(2z n²-3)exp(-z n²), p_n=f_n/psi.
All f_n are positive. The exact ratios satisfy
 f_n/f_1=n²(2z n²-3)/(2z-3) exp[-z(n²-1)]
 <= (48/25)n^4 exp[-(157/50)(n²-1)]  (n>=2).
Indeed z>=pi>157/50 and 2z/(2z-3)<=157/82<48/25. For a_n=n^4 exp[-(157/50)(n²-1)],
 a_(n+1)/a_n <= (3/2)^4 exp(-157/10)<10^-6, n>=2.
Also exp(471/50)>12300. Therefore
 sum_(n>=2)f_n/f_1 < (48/25)*16/[12300(1-10^-6)] <1/400.
The two exponential inequalities are independently reproducible with Arb in constants.py; all remaining inequalities are rational. Consequently p_1>400/401 uniformly on the complete positive half-line. No theta orbit has been discarded.

## 2. Uniform chi-square transport bound
For s>=0, lambda=exp(2s), the exact positive transport multiplier is
 m_s(z_n)=lambda^(5/4)(2lambda z_n-3)/(2z_n-3) exp[-(lambda-1)z_n].
It is decreasing in n for s>0, since
 2z partial_z log m_s=-2z(lambda-1)[1+6/((2lambda z-3)(2z-3))].
Write p=p(h), q=p(h+s), so q_n=m_n p_n/E_p m. Then
 chi²(q||p)=E_p m²/(E_p m)²-1
 <=m_1/E_p m-1 <=1/p_1-1<1/400.
At s=0 chi²=0. For the independent pair laws P=p tensor p, Q=q tensor q,
 chi²(Q||P)=(1+chi²(q||p))²-1<801/160000.
This bound is uniform in h,s and in the number/degree of observables. It does NOT say that differentiated features are uniformly close: their covariance can be large.

## 3. Matrix covariance domination, including arbitrary whitening
Let V be any real finite-dimensional vector on the orbit pair with finite second moments under P. Let mu=E_P V, Sigma=Cov_P(V), and e=E_Q V-E_P V. Scalar Cauchy for every test vector gives the exact Loewner inequality
 e e^T <= chi²(Q||P) Sigma < (801/160000) Sigma.
The non-strict <= version with the displayed constant is meant when Sigma is singular. This is valid under every fixed real linear map, in particular whitening by any actual complete lower block A>0. It requires neither monotonicity nor positivity of individual jet components, and does not replace Sigma by an orbit-independent constant.

## 4. Exact signed jet observable and drift
Let R_j(n,h)=f_n^(j)(h)/f_n(h). For k>=0 define
 V_k(n,m;h)=(-1)^k sum_(j=0)^(2k) (-1)^j binom(2k,j) R_j(n,h)R_(2k-j)(m,h).
Then the signed bridge derivative density satisfies
 (-1)^k partial_v^(2k)[psi(h-v)psi(h+v)]_(v=0)=psi(h)² E_(p(h) tensor p(h)) V_k(h).
All moments in Sections 2-3 are finite for any finite set of k, because each R_j grows polynomially in n² and the orbit masses decay Gaussianly in n.
For any fixed vector of these observables, retain its explicit drift
 d=E_Q[V(h+s)-V(h)].
The full normalized feature shift is exactly
 E_Q V(h+s)-E_P V(h)=d+e,
 with e e^T <=(801/160000) Cov_P(V(h)).
Thus positive heat reweighting has a small dimension-independent covariance coefficient, but its differentiated explicit drift remains fully signed. The factors psi(h)² and psi(h+s)² are positive scalar amplitudes and must be restored for unnormalized moment columns.

## 5. A concrete sufficient angular estimate
After any fixed whitening, let u=E_P V(h), let d denote the whitened drift, and let Sigma denote the whitened covariance. Then
 u^T E_Q V(h+s) >= ||u||²+u^T d-sqrt[(801/160000)u^T Sigma u].
A positive right side proves a positive feature edge, while a negative right side is only an inconclusive lower bound. Analogous component/direction estimates feed the signed-graph matrix-anchor budget without presuming local positive moment blocks.

The remaining all-degree lemma is quantitative: bound the drift and directional covariance relative to the actual complete lower-jet metric and the central feature direction, with enough reserve for the regional projected diagonals. The modular Taylor-radius result shows why replacing Sigma by a fixed finite-orbit estimate uniformly in degree cannot be justified. This transport bound supplies an exact, small reweighting coefficient and preserves the hard arithmetic covariance rather than assuming it away.

## 6. Why the retained covariance is essential at growing degree
The small chi-square number cannot be used as a small relative feature error. At h=0 consider the scalar observable V_k(n)=R_(2k)(n,0), with mean m_k=psi^(2k)(0)/psi(0). Conditional variance on the event n=1 gives the exact lower bound
 Var_p(V_k)>=p_1/(1-p_1) [m_k-V_k(1)]².
The modular-radius obstruction proves that along an unbounded even-derivative subsequence the first-orbit derivative divided by the complete derivative tends to zero. Since p_1 V_k(1)/m_k=f_1^(2k)(0)/psi^(2k)(0), also V_k(1)/m_k tends to zero on that subsequence. Consequently
 liminf_subsequence Var_p(V_k)/m_k² >=p_1/(1-p_1)>400.
For each fixed k, the transported law q=p(s) tends to the first-orbit point mass as s→infinity; polynomial growth of V_k and Gaussian orbit tails justify convergence of its expectation. Hence E_q V_k→V_k(1). On the same increasing-order subsequence, the relative reweighting displacement can approach magnitude one, despite chi²(q||p)<1/400.

This is specifically a frozen-base signed derivative observable, not the full shifted derivative (which includes the explicit drift). It proves that any uniform growing-degree angular argument must exploit correlations/cancellation of covariance with drift or the actual complete lower-block geometry. It cannot obtain a small relative high-jet perturbation from the small distributional transport coefficient alone.
