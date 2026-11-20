# Independent review: grouped Ewald closure and normalized tails

Reviewed modular_epstein_v3/GROUPED_EWALD_CANDIDATE.md line by line. Result: PASS on the exact construction, the finite-axis obstruction, the normalized supremum/L1 constants, and the finite-Gram relative sufficient condition. Positive definiteness of the candidate heads is not established by any of these estimates.

## 1. Direct/dual identity and axis closure

For the exact Mellin split, the rational term is 1/(p-1)-1/p=-1/[p(1-p)]. The two incomplete-gamma weights have exponents p-1 and -p and are exchanged by p ->1-p. Sign and coordinate-swap orbits therefore preserve the exact even symmetries before any derivatives.

For J_s(y)=integral_1^infinity x^(s-1)(theta(yx)-1)dx, substitute x=yt in J_s(1/y), split the full Mellin integral at 1/y, and use theta(t)=t^-1/2 theta(1/t). This gives exactly

J_s(1/y)=2Lambda(2s)y^s-sqrt(y)/(s-1/2)+1/s-sqrt(y)J_(1/2-s)(y).

Pairing s=p and 1-p cancels both sqrt(y)/(s-1/2) terms. The two remaining rational constants sum to 1/[p(1-p)] and cancel the original pole. The residual integral weights are

x^(p-1)+x^-p=2x^-1/2 cosh(a log x),
x^(-1-a)+x^(-1+a)=2x^-1 cosh(a log x).

This independently checks the axis remainder H_a and its factor 2. The homogeneous modes have exponents 2p and 2(1-p) and are annihilated identically by L_a, including before taking the a derivative. Their coefficient poles therefore do not enter the final axis output.

The global axis parent is smooth even in v. The right-half-line H_a need not itself have a smooth even reflection; only its transformed output does. The candidate correctly retains that distinction. Uniform estimates through a=0 and up to a=1/2 are justified for the transformed axis block by the pole-free integral, not by separate divergent coefficient estimates.

## 2. Naive finite axes: normalization failure checked

At small Q the paired Mellin weight has two homogeneous powers plus constant -1/[p(1-p)] and an O(Q) remainder. For a fixed finite square, exactly 2N short-axis vectors survive as v tends to positive infinity; all other vectors have exponentially large Q. Together with the pole this leaves the constant -(2N+1)/[p(1-p)] after homogeneous terms are killed.

Since L_a1=16p²(1-p)², applying (1/128)partial_a gives a(2N+1)/4. This is the claimed nonzero limit at infinity. Local convergence at v=0 keeps C_N(0) bounded while that spatial limit grows with N, proving eventual violation of the PD maximum-at-zero inequality. Subtracting this diverging constant to force decay destroys convergence at every fixed v. The correction of retaining all axes is substantive, not cosmetic.

The full interior lattice contributes four sign copies, so I_(a,nm)=(1/32)partial_a L_aG_p(Q_nm) has the right constant. Coordinate-swap pairs then provide evenness in v; single ordered interior terms need not be even.

## 3. Normalized derivative majorant

For y=pi xQ and x>=1, G_p=2 integral x^-1/2 cosh(a log x)exp(-y)dx. The derivative identities are

(partial_a L_a)/a=-16D_v²+16(4a²-1),
(log x)sinh(a log x)/a <=(log x)²cosh(A log x),
cosh(A log x)<=x^A.

These remain bounded as a decreases to zero, uniformly for 0<a<=A<=1/2. No arbitrary a-independent error is divided by a.

Faà di Bruno/Touchard bounds use |D_v^j y|<=2^j y. For y>=2pi, they give |D²exp(-y)|<=8y²exp(-y) and |D⁴exp(-y)|<=240y⁴exp(-y). The L_a contribution is therefore at most 276y⁴exp(-y); the differentiated-L contribution is below 160y⁴exp(-y). Including the factor 2/32=1/16 yields

|I_(a,nm)(v)/a|
 <=28 integral_1^infinity x^(A-1/2)(1+log²x)y⁴exp(-y)dx.

All constants and polynomial powers in this estimate check.

## 4. L1 and supremum constants

Write s=2pi nm and w=v-(1/2)log(n/m), so y=sx cosh(2w). From log cosh(2w)<=cosh(2w)-1 and cosh(2w)-1>=2w²,

integral_R y⁴exp(-y)dv
 <=(sx)^4exp(-sx)sqrt(pi/[2(sx-4)])
 <=3(sx)^(7/2)exp(-sx).

The last inequality is valid for sx>=2pi. Consequently the L1 contribution is bounded by

84s^(7/2) integral_1^infinity x^(A+3)(1+log²x)exp(-sx)dx.

Set d=s-A-3 and use x^r<=exp(r(x-1)), log x<=x-1. The remaining scalar integral is at most exp(-s)(1/d+2/d³). Uniformly for s>=2pi and A<=1/2, this is <=4exp(-s)/s. One elementary check is that s/(s-c)+2s/(s-c)^3 decreases in s for fixed c>0, and at the weaker endpoint s=6,c=7/2 it is 3.168<4. This proves the coefficient 336s^(5/2)exp(-s).

For the supremum norm, y⁴exp(-y) decreases once y>=4, so replace y by sx before integrating x. The power becomes x^(A+7/2), with d=s-A-7/2>=s-4. The same decreasing rational expression is at most 5 for s>=6,c=4 (its value there is 4.5). This gives 140s³exp(-s).

Grouping nm=k and using the divisor bound d(k)<=k gives, for max(n,m)>N, a conservative sum over all k>=N+1. The single coefficient

150(2pi)^3

exceeds both 140(2pi)^3 and 336(2pi)^(5/2), since 150sqrt(2pi)>336. Also k^(7/2)<=k^4. Thus

epsilon_N=150(2pi)^3 sum_(k>=N+1)k^4exp(-2pi k)

bounds BOTH the normalized supremum error and the normalized full-line L1 error, uniformly for 0<a<=1/2. This is a true all-frequency absolute Fourier bound, not a relative sign bound.

The geometric-polynomial closed form in the candidate has the correct fourth-moment coefficients. Higher derivative/weighted-v estimates add polynomial factors and powers of log(nm), still dominated by the product-index exponential tail; this supports the stated qualitative Schwartz convergence after exact axis closure.

## 5. Finite Gram condition

All matrices must use the normalized kernel D_(a,N)/a. Entry errors bounded by epsilon_N imply operator error at most J epsilon_N for J nodes. Congruence by the inverse square root of a certified positive candidate matrix gives norm at most J epsilon_N/lambda_min(D_N). If this ratio is below one, the full specified Gram matrix is strictly positive. This argument is correct but requires an independently certified positive candidate matrix; no statement about arbitrary nodes or arbitrary matrix sizes follows.

## Conclusion

The construction preserves full modular endpoint cancellation while supplying effective absolute errors uniform down to arbitrarily small a. It removes the prior ordinary-cutoff cusp and the finite-axis normalization defect. The unresolved task is a positive relative margin for suitable grouped tests, ultimately all tests if RH is to follow. No individual block positivity or global spectral positivity is silently assumed.
