# Uniform square variance and the full rectangle margin

19 October 2026. New bounded derivation for independent review. No publication, global zero-free curve, or improved height exponent is claimed.

Use the reviewed coefficients a_p=(1-p^(-h))p^(-s), d_p=(1-p^(-2h))p^(-2s)/2, with s>1/2, h>0, Q>=2. Let S1 and S2 be the prime and square cosine sums, respectively. Fix Poisson width x>0, target b=s+x, and carrier T. All expectations and covariances below use the complete Poisson probability measure at (x,T).

Define Z(r)=2^(-r)+2^(1-r)/(r-1), r>1,
D=Z(2s)/2, D_b=Z(2b)/2.
The simple uniform bounds are |S2|<=D and |m2|<=D_b, where m2=E S2. Since b>s, D_b<D.

## 1. An explicit cutoff- and carrier-uniform square variance

Put
K(s,x)=D_b^2(4^(2x)-1)/2
 +x/4 [4^(-2s)/(2s)
       +2*4^(1/2-2s)/((2b-1)(2s-1/2))
       +4^(1-2s)/((2b-1)^2(2s-1))].
Then

v2=Var(S2)<=K(s,x).                                       (1)

Proof: the previously checked exact square-tail representation is
v2=x integral_1^(Q^2) v^(2x-1)|A2(v)|^2dv,
A2(v)=sum_(p<=Q,p^2>=v) d_p p^(-2x-2iT).
For1<=v<=4, |A2(v)|<=D_b. For v>=4, enlarging primes to integers and using the decreasing-tail integral bound gives
|A2(v)|<=[v^(-b)+v^(1/2-b)/(2b-1)]/2.
Indeed the integer tail beginning at ceil(sqrt(v)) is at most v^(-b)+v^(1/2-b)/(2b-1). The term at its lower endpoint is included. Extend the nonnegative integral to infinity and integrate the three powers after squaring. Their denominators are2s, 2s-1/2, and2s-1, all positive. This yields K exactly. No prime cancellation, height average, or discarded tail enters the estimate.

For orientation only, at s=.834 the formula evaluates approximately as follows:
b=.86796: D=.6284364, D_b=.5580573, K=.02908655;
b=.875: D=.6284364, D_b=.5450533, K=.03393187.
These are ordinary rounded evaluations, not interval certificates or a claimed bound throughout the intervening b interval. The exact expression is the result.

## 2. A rigorous mixed-term bound and its limitation

Write m1=E S1 and v1=Var(S1). The covariance retains its actual sign, but Cauchy proves

|Cov(S1,S2)|<=sqrt(v1 v2)<=sqrt(K v1),
max(sqrt(v1)-sqrt(K),0)^2<=Var(S1+S2)
                              <=(sqrt(v1)+sqrt(K))^2.       (2)

Thus square modes can neither be presumed independent nor assigned a favorable covariance. For fixed s>1/2 and fixed x, their mean and standard deviation cost only bounded quantities. In particular if v1 is large, the standard deviation of the combined sum differs from sqrt(v1) by at most sqrt(K). This does not estimate v1 itself.

## 3. Compare complete sufficient upper bounds

Let Phi(a,v)=(a+sqrt(a^2+v))/2. Keep the original analytic rectangle and let c be its verified left-ratio logarithmic allowance. Let C3(s) be the reviewed j>=3 remainder bound. Set
A=c+C3(s)-m1,
Bstar=-w_L log2-w_R R_right-w_H B_horizontal.
All right and horizontal edge terms remain in Bstar.

Paying squares absolutely gives the valid upper bound
U_abs=Phi(A+D,v1)
for E(c+L_Q)_+. Keeping their actual joint moments gives
U_exact=Phi(A-m2,v1+v2+2Cov(S1,S2)).
The unconditional square bounds above also give
U_joint=Phi(A+D_b,(sqrt(v1)+sqrt(K))^2),                    (3)
and the positive-part Lipschitz inequality gives
U_lip=Phi(A,v1)+sqrt(D_b^2+K).                             (4)
To see (4), bound E|S2| by sqrt(E S2^2)<=sqrt(D_b^2+K).

Therefore it is sufficient that

min(U_abs,U_joint,U_lip)<Bstar.                            (5)

If the actual joint moments are certified, U_exact can also be included in this minimum. The choice of the minimum ensures that a worse moment majorant never replaces the better absolute one. These are upper bounds for the same clipped integral, not assertions that the missing actual-prime statistics satisfy the certificate.

The exact comparison with U_abs is especially transparent. Whenever U_abs>0,

U_joint<U_abs iff K+2sqrt(K v1)<4U_abs(D-D_b).              (6)

Indeed U_abs obeys v1=4U_abs(U_abs-A-D). Also U_abs>=A+D>A+D_b, so the strict sharp-moment test at threshold U_abs applies and reduces to (6). This gives a precise test for when the retained-square majorant improves the FULL sufficient moment budget. It makes no assumption that such a parameter pair (A,v1) occurs at an actual carrier. At Q>=2,h>0,x>0 the prime sum is nonconstant, so v1>0 and U_abs>0.

## 4. What cannot follow from square separation alone

Pointwise Lipschitz continuity gives
|(c+C3-S1-S2)_+-(c+C3-S1)_+|<=|S2|<=D.
After Poisson averaging the actual clipped quantities therefore differ by at most D. At fixed s>1/2 this is independent of T and Q. Retaining square modes may improve a finite-height/additive margin, but cannot alone supply a saving proportional to log T or change a leading logarithmic exponent. Similarly (2) cannot remove a leading prime variance of logarithmic-square size.

This limitation is expressly for fixed s>1/2. As s approaches1/2 the absolute D and the present K bound diverge; the previous uniform C3 remains valid but does not imply uniform square control there.

## 5. Analytic and arithmetic frontier

The residual G(s)=zeta(s)/(V_Q(s)zeta(s+h))-1 is unchanged. Denominator zero-freeness on a neighborhood of the closed rectangle, the left ratio estimate, both other edge bounds, every-target coverage, and effective onset remain prerequisites. Changing s or h requires rechecking their analytic margins. The Poisson width must be the target's actual distance from the left edge.

Equations (1)--(6) are new rigorous bounds and comparisons for the square component. They leave the actual-prime mean m1 and variance v1, or the corresponding signed discrepancy energy, unbounded at the strength needed to complete the proposed all-height curve. No heuristic covariance sign or empirical sample is used as proof.
