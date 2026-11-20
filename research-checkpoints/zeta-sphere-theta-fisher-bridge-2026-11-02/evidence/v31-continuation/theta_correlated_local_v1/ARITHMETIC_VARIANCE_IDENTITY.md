# Exact divisor-variance cancellation and its real-tilt limit

Independently reviewed analytic PASS. This identifies an exact arithmetic cancellation, but does not turn real-tilt positivity into a signed-core bound.

## 1. Transform of the actual unreflected single orbit

Let f(u)=4e^(u/2)(2z²-3z)e^-z, z=pi e^(2u), and define G(t)=integral e^(tu)f(u)du. Direct gamma integration, valid for real t>-5/2, gives
 G(t)=2 pi^(-t/2-1/4) Gamma(t/2+5/4)(t-1/2).
For t>1/2 the complete theta series is absolutely integrable termwise with this tilt, and
 M(t)=integral e^(tu)psi(u)du=G(t)zeta(t+1/2).
The profile psi is positive and even; f is not assumed positive. All logarithms of G below are taken only for t>1/2, where G>0.

## 2. Exact arithmetic grouping of the covariance numerator

Set s=t+1/2>1 and use derivatives of zeta with respect to s. Absolute Dirichlet convergence gives
 sum_k d(k)k^-s=zeta(s)^2,
 sum_k ell_2(k)k^-s=2[zeta(s)zeta''(s)-zeta'(s)^2].
The second identity follows by expanding(log n-log m)^2 in the ordered pair sum.

The midpoint-kernel changes of variables give
 integral e^(2tr) C_f(r)dr=(1/4)[G G''-G'^2],
 integral e^(2tr) A_f(r)dr=(1/2)G².
Combining these with the exact divisor grouping yields
 integral e^(2tr) C(r)dr
 =(1/4){zeta²(GG''-G'^2)+G²(zeta zeta''-zeta'^2)}
 =(1/4)[M M''-M'^2].                               (1)
No mixed term survives. Thus the divisor-log-variance contribution is exactly the missing product-variance term, not an optional positive correction to discard. All identities initially use t>1/2, where interchange is absolute.

## 3. Uniform actual-theta inequality on the real tilt axis

Under the actual tilted probability law p_t(u)=e^(tu)psi(u)/M(t),
 V(t)=(log M)''(t)=Var_(p_t)(u)>0.
The previously audited full-theta log-curvature bound (log psi)''<-17 and the one-dimensional Brascamp–Lieb variance inequality give V(t)<=1/17 for all real t. In the absolutely convergent arithmetic region this becomes
 0 < (log zeta)''(s)+(1/4) trigamma(s/2+1)-1/(s-1)² <=1/17,
 s>1.                                               (2)
The negative pole-square from log G is canceled exactly by the positive pole-square in(log zeta)''. This is a genuine arithmetic aggregate cancellation, uniform in real s. It is NOT a new bound on the signed contact or a next Schur pivot: it controls the real exponential tilt, equivalently the already positive midpoint kernel's Laplace transform.

The core problem involves oscillatory transforms and their actual prefix regression, not merely (2). Continuing (2) as an inequality to imaginary t would be invalid. Analytic continuation preserves identities, not order.

## 4. Explicit failure of that continuation shortcut

Take an auxiliary positive even probability distribution obtained by convolving a centered Gaussian of variance epsilon=1/2 with a three-atom distribution having moment generating function(1+a cosh z)/(1+a), a=1/2, then scaling the random variable by lambda=1/sqrt(34). Its entire moment generating function is
 M_*(z)=exp(epsilon lambda² z²/2)(1+a cosh(lambda z))/(1+a).
It has a smooth, strictly positive, even density. For every real t,
 0<(log M_*)''(t)<=lambda²(epsilon+1)=3/68<1/17,
since the tilted bounded atom variable has variance<=1. Nevertheless at z=i pi/lambda,
 (log M_*)''(z)=lambda²(epsilon-1)=-1/68<0.
The denominator1+a cosh(lambda z)=1-a is nonzero there. Thus even an entire positive-profile transform with the same uniform real-tilt variance bound need not satisfy the required imaginary-axis sign. No claim is made that this auxiliary profile has theta arithmetic or the same pointwise log-curvature; it tests only the attempted inference from (2).

For its real Fourier transform F_*(y)=M_*(iy), the Laguerre expression F_*'^2-F_*F_*'' equals M_*(iy)^2(log M_*)''(iy), so it is negative at y=pi/lambda. This explicitly identifies the sign that cannot be continued from real tilt positivity.

## 5. Consequence for the current research lane

Equation (1) explains exactly how arithmetic variance repairs the signed single-orbit contribution on the real tilt axis. The successful finite core certificates show additional oscillatory cancellation in specific actual-theta cases. Neither fact supplies an all-degree core inequality. A useful new theorem would have to control the oscillatory version of this product-variance cancellation, with the actual prefix inverse and odd-tail cost retained. That comparison remains open.
