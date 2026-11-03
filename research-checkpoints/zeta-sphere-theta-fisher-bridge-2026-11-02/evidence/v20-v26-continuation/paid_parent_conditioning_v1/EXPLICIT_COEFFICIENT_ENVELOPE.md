# Fully explicit but deliberately coarse degree envelope

Status: new proof awaiting independent review. This supplies finite degree-only bounds for the lower-polynomial ratio rho and terminal tau in CONDITIONING.md; their size makes clear why they cannot replace signed cancellation. It is not the preferred numerical bound.

Uniformly 0<=a<=1/2,0<=lambda<=1, the actual analytic profile g(z)=e^{az+lambda z²}psi(z) satisfies
 sup_{|y|<=pi/8} ||g(.+iy)||_2 <64.
Proof: use the complete theta expansion for x>=0, and psi(-z)=psi(z) for x<0. Put z0=pi e^{2|x|}. cos(2y)>=sqrt(2)/2>7/10. The absolute theta series is bounded by
 4e^{|x|/2} sum_{m>=1}(2z0²m^4+3z0m²)e^{-(7/10)z0m²}
 <=13e^{|x|/2}z0² e^{-(7/10)z0}.
Indeed 2z²+3z<=3z² for z>=3; consecutive m^4 exp[-.7z0m²] ratios are <=16e^{-6.3}<.03, and 12/.97<13.
Thus |g(x+iy)|<=13e^{x²+|x|}z0²e^{-.7z0}. Since 2x²+2x<=e^{2x}<=z0/3 for x>=0 and 4log z0<=z0/2+5,
 ||g(.+iy)||² <=338e^5 integral_0^infty exp[-z0/2] dx
 <=338e^5 e^{-3/2}/3 <4096.
The final inequality is elementary (e^5<149,e^{-3/2}<.224 imply upper3761). The discarded imaginary-square exponential factor has modulus<=1.

Cauchy's integral formula on radius pi/8, Minkowski, and real translation invariance of L2 give
 ||g^(j)||_2 <=64 j! (8/3)^j,
using pi>3. This is an actual full-theta analytic-strip bound, not a finite-orbit truncation.

Let p(t)=sum_{j=0}^n c_jt^j. The independently accepted low-frequency parent coercivity gives
 ||c||² <=16*9^{n+1}(n+1)² ||p(-iD)g||².
For K=p'(-iD)g (irrelevant unit phases suppressed), coefficient Cauchy and the derivative bound imply, for n>=1,
 rho=||K||/||p(-iD)g||
 <=2304 n(n+1)sqrt(n) (n-1)! 8^{n-1}=:R_n.
For the terminal spectral second moment,
 tau_n=||D[p(-iD)g]||²/||p(-iD)g||²
 <=65536 (n+1)^3 [(n+1)!]^2 64^{n+1}=:T_n.
These hold for ALL polynomial coefficients, including the actual signed residual; no signed positivity is used.

Hence the fully explicit source envelope is C(n,1)[C(n,2)+2C(n-1,1)R_n] times the actual parent path mass P_lambda. The one-zero terminal lower reserve is at least 2a/(T_n+r_*²+a²). The remaining path mass ratio b=P_lambda/P_1 is deliberately NOT set to one: it depends on the actual signed regression path and can become singular if the old signed Gram loses positivity. One can use exact finite matrices or a certified path bound for b, but qualitative terminal real-zero structure does not supply it.

Both R_n and T_n are factorial-scale overestimates. They make an explicit sufficient test, not an asymptotic estimate of the actual theta residual. Actual floating data in CONDITIONING.md are many orders better but still lose the signed cost after positive Cauchy. The sharper logarithmic spatial theorem solves a different problem (multiplication by u); it cannot erase the derivative/terminal conditioning factor.
