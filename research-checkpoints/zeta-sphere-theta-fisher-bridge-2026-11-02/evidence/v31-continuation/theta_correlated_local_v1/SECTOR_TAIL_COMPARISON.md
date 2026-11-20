# Fixed oscillatory sector versus the actual absolute tail cost

Independently reviewed analytic PASS. This isolates a failure of a proposed sufficient method, not failure of a theta pivot.

## 1. Keep the true residual and its entire unpaid cost

With b=sqrt(17), let p_N(t)=P_N(t²) for the actual even prefix residual, or tQ_N(t²) for the actual odd residual. The reviewed sector theorem gives the valid lower bound
 h_N>=S_N-T_N,
 S_N=Lambda(0) integral_(|t|<=b) p_N(t)²(1-t²/17)dt,
 T_N=integral_(|t|>b) p_N(t)²|Lambda(t)|dt.          (1)
The coefficients of p_N still contain the actual prefix inverse. A uniform conclusion requires a comparison of these two specific quantities. Positivity/decay of a parent density or coefficient positivity cannot replace it. The odd arithmetic tail retains its separately established payment if the divisor representation is used.

## 2. Exact Gaussian obstruction WITH actual orthogonal residuals

Take the auxiliary positive profile psi_G(u)=exp(-17u²/2). It has the same log-curvature17 as the hypothesis used for the finite sector, and faster spectral decay than the actual theta profile. Its spectral numerator is
 Lambda_G(t)=(2pi/289) exp(-t²/17)>0.
All its genuine moment Grams and pivots are positive. Set y=t/sqrt(17). The actual monic even residual is
 P_N(t²)=17^N 2^(-2N) H_(2N)(y),
where H_n is the physicists' Hermite polynomial orthogonal for exp(-y²). Thus this example retains true orthogonality and inverse feedback, not an arbitrarily selected polynomial.

For N=1, P1=t²-17/2. The fraction of its actual squared norm in the sector |t|<=sqrt(17) is exactly
 eta_1=erf(1)-3/(e sqrt(pi))<1/2.                  (2)
Indeed the full y integral of(y²-1/2)²e^-y² is sqrt(pi)/2, and its integral over[-1,1] is sqrt(pi)erf(1)/2-3/(2e). For the strict inequality use erf(1)<1 and e sqrt(pi)<6. Numerically the fraction is about22%, not a rigorous input.

Inside the sector, 1-y²<=e^-y². Hence the S_N term in(1) is no greater than the actual inside norm, while T_N is EXACTLY the outside norm because Lambda_G>0. Therefore S_1-T_1<0 although h_1>0. An absolute-cost proof cannot be justified from curvature, rapid decay, and actual polynomial orthogonality alone.

## 3. Explicit degree growth necessary for this method, both parities

For the normalized Hermite residual density proportional H_n(y)²e^-y²,
 E[y²]=n+1/2,
 E[y4]=(3/4)(2n²+2n+1).
These follow directly by applying y h_n=sqrt((n+1)/2)h_(n+1)+sqrt(n/2)h_(n-1) twice to the orthonormal Hermite functions. For every n>=2,
 (E y²)²/E y4 >=5/8.
Applying the elementary second-moment lower bound to X=y² at theta=1/16 gives
 Pr{y²> (n+1/2)/16} >=(15/16)²*(5/8)=1125/2048>1/2. (3)
The inequality follows by bounding E[X 1_(X>theta EX)] below by(1-theta)EX and applying Cauchy–Schwarz; no asymptotic formula is used.

Thus to place more than half the actual residual norm inside a band of radius b_t, it is necessary that
 b_t²>17(n+1/2)/16.                                (4)
This is a necessary lower bound on band growth, not a sufficient one. For the fixed b_t=sqrt(17), every n>=16 has outside mass at least1125/2048, and the lower-bound method(1) is at most -101/1024 times the true positive norm.

Even targets have n=2N; odd targets have n=2N+1. Accordingly the fixed-sector comparison fails at every N>=8 in both Gaussian ladders, despite their entirely positive pivots and exact known inverses. The required sector width must at least grow on the order of sqrt(N) even in this favorable model. The actual theta sector theorem currently supplies only a fixed width.

## 4. Actual-theta obstruction to a generic positive-root concentration claim

There is a separate statement for the ACTUAL theta weight, without pretending that the following polynomials are its actual orthogonal residuals. Define
 R_N(t)=product_(j=1)^N [t²-(1+j/(2N))].
Its roots in x=t² are distinct and positive, so it has precisely the coefficient-sign property used in the arithmetic-tail theorem. On |t|<=sqrt(17), |R_N(t)|<=16^N. On5<=t<=6, |R_N(t)|>=(47/2)^N.

The actual entire Lambda is nonzero at0 and cannot vanish on the interval[5,6]. Consequently
 c_*=integral_5^6 |Lambda(t)|dt>0.
The ratio of the actual absolute tail cost to the sector reserve upper bound is at least
 [c_*/(2sqrt(17)Lambda(0))]*(47/32)^(2N),            (5)
which tends to infinity. This proves that positive roots and actual theta decay alone cannot yield a uniform concentration inequality of the needed form. The actual prefix residual may behave differently; that distinction is essential.

## 5. Conclusion and remaining route

The fixed finite sector is rigorous, but treating every exterior frequency as an absolute debit is not a viable GENERAL uniform argument. It fails even for Gaussian genuine residuals and for positive-root families under the actual theta weight. This does not show that the same test fails for every actual-theta residual, or that signed exterior contributions are adverse.

A successful theta-specific route must preserve favorable signed high-frequency contributions, establish a degree-expanding actual sector, or prove a direct signed divisor-core comparison. The current arithmetic method does retain those signs and its odd tail cost; no new uniform core inequality is established here. No finite ladder run was performed for this note.
