# Actual-theta real/imaginary coupling on a finite oscillatory sector

Independently reviewed analytic PASS. This is a finite-frequency inequality, not an all-degree signed-core proof.

Use the actual complete even positive theta profile psi and its audited(log psi)''<-17. Let
 C(r)=integral v²psi(r+v)psi(r-v)dv,
 M(z)=integral e^(zu)psi(u)du,
 D(z)=M(z)M''(z)-M'(z)².
All transforms are entire; D(z)=4 integral e^(2zr)C(r)dr. At z=it, D(it)=Lambda(t)=F'(t)²-F(t)F''(t), with F(t)=M(it).

## 1. The actual midpoint kernel inherits stronger log-curvature

On the convex domain v>0 set
 W(r,v)=-log psi(r+v)-log psi(r-v)-2log v.
For any vector(a,b),
 Hess W[(a,b)]>=17[(a+b)²+(a-b)²]+2b²/v²
                  >=34(a²+b²).
Since C(r)=2 integral_(v>0)e^-W(r,v)dv, the strong form of marginal log-concavity gives
 (log C)''(r)<=-34.                                (1)
One direct justification is to apply the ordinary marginal log-concavity theorem to W(r,v)-17r², which is convex; the domain v>0 is convex and the profile decays at both integration boundaries. This uses the actual positive midpoint kernel, not a differentiated C_N.

For real s define rho_s(r)=e^(2sr)C(r)/integral e^(2sx)C(x)dx, with mean m_s and variance sigma_s². Linear tilting preserves (1), so the one-dimensional Brascamp–Lieb inequality gives
 sigma_s²<=1/34.                                    (2)
Both m_s and sigma_s involve positive midpoint integrals, not the unknown next pivot. In particular m_s=D'(s)/(2D(s)) and D(s)>0.

## 2. A rigorous oscillatory inequality, with its phase retained

The exact identity is
 D(s+it)/D(s)=E_(rho_s) exp(2itr).
Using cos x>=1-x²/2 after centering at the actual m_s gives
 Re{exp(-2it m_s)D(s+it)/D(s)}
 >=1-2t²sigma_s² >=1-t²/17.                        (3)
This is an actual real/imaginary coupling, not analytic continuation of a real positivity inequality. It proves D(s+it) is nonzero for every real s and |t|<sqrt(17), and bounds its rotated real part explicitly.

At s=0, C is even and m_0=0, so
 Lambda(t)>=Lambda(0)(1-t²/17), |t|<=sqrt(17).      (4)
It is strictly positive in the open interval. In the arithmetic region Re z>1/2, D also equals the exact Gamma/zeta product-variance numerator of ARITHMETIC_VARIANCE_IDENTITY.md. Equation (3) therefore bounds that complex cancellation in a finite strip. Elsewhere use the entire numerator identity, not logarithmic quotients at zeros.

The sharper first bound in(3) can use an explicitly computed sigma_s. Changing s, however, changes the function point and the phase m_s. It does not extend(4) to arbitrary imaginary t on the original s=0 axis. Transport in s retains the exact signed covariance
 partial_s[D(s+it)/D(s)]=2 Cov_(rho_s)(r,exp(2itr)),
and that feedback has not been assigned a favorable sign.

## 3. Exact remaining cost for an actual prefix residual

Let P_N be the actual known monic prefix polynomial, and let b<=sqrt(17). With the original signed h_N=integral P_N(t²)²Lambda(t)dt,
 h_N >= Lambda(0) integral_(-b)^b P_N(t²)²(1-t²/17)dt
            - integral_(|t|>b) P_N(t²)²|Lambda(t)|dt. (5)
For the odd target insert t²Q_N(t²)² in BOTH terms. The actual prefix inverse remains in P_N or Q_N; it is not replaced by a positive parent polynomial. The high-frequency cost in(5) is unpaid by (3)-(4). In an arithmetic certificate the separate negative odd arithmetic remainder also still requires its established payment; these are alternative representations, not two independently discardable costs.

A fixed positive-frequency window does not by itself imply the signed moment/Schur hierarchy is positive. No growing-degree success of(5) is claimed.

## 4. Why midpoint curvature alone cannot provide all-frequency positivity

Consider the auxiliary kernel C_*(r)=exp(-17r²-289r^4). It is positive, even, rapidly decreasing and has
 -(log C_*)''=34+3468r²>=34.
But C_*''''(0)=12*17²-24*289=-3468<0. If its Fourier transform were nonnegative everywhere, Fourier inversion would imply
 C_*''''(0)=(1/(2pi))integral t^4 hat C_*(t)dt>=0,
a contradiction. Thus its real Fourier transform is negative somewhere despite exactly the same strong midpoint curvature bound. All functions are Schwartz, so the moment/inversion step is justified.

This is not the actual theta midpoint kernel and is not a counterexample to RH. It rules out replacing the missing theta-specific oscillatory control by curvature alone. The finite-sector inequality and its explicit phase are valid; extending it to the full signed core remains open.
