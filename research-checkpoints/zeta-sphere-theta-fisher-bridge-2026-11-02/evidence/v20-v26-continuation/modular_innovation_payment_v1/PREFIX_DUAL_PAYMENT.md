# Prefix-only spatial dual witnesses for the next innovation

Status: exact inequalities awaiting independent review; finite numerical checks are floating sanity checks only. Original theta lambda=0 in the checks. No next-pivot positivity assumed.

Assume both actual parity ladders through degree N have positive pivots. Use the true current normalization F=Y_N=F_N/sqrt(s_N), not an unknown next norm. Let V be the OLD next-parity feature vector (degrees of parity N+1 through N-1), in any fixed actual-prefix coordinates. On h>0 use inner product <f,g>_+=integral h f(h)g(h)dh.

The next source can be chosen q=F'(h): its difference from Z=F_(N+1)/sqrt(s_N) lies in the old next-parity span. Consequently its positive-side innovation is EXACTLY
 delta_+=||(I-Pi_V)q||_+².
More structurally, differentiation maps the old current-parity span into the old next-parity span. Thus the next innovation is the derivative-quotient energy of the current positive-side innovation. For N even the derivative old span equals the next old span; for N odd the latter additionally contains the ground-state feature g. No extra sign assertion follows from this nesting.

## 1. One fixed witness, computed entirely from current-prefix data

Put A=<V,V>, c=<V,q>, mu=<F,F>, b=<V,hF>, and
 nu=<hF,hF>-b^T A^-1b.
The test phi=(I-Pi_V)(hF) is orthogonal to all old next features. Integration by parts gives <q,hF>=-mu. Hence
 delta_+ >= (mu+c^TA^-1b)²/nu
when nu>0; the zero-norm case is interpreted on the actual projected span.

Crucially c itself needs no next jet or next pivot:
 c_j=integral h V_j F'=-integral F(V_j+hV_j').
Every V_j' has degree at most N. Theta decay and the factor h remove both endpoint terms. Thus the witness lower bound uses only current-prefix feature functions, their already-known pivot scales, and spatial moments.

## 2. Two fixed spatial witnesses preserve more of the innovation

For fixed odd powers r in a chosen set (in the sanity check, r=1,3), put
 b_r=<V,h^r F>,
 B_rs=<h^rF,h^sF>-b_r^T A^-1b_s,
 ell_r=-(r+1)/2 integral_0^infinity h^r F²dh-c^TA^-1b_r.
Then
 L_+:=ell^T B^-1ell <=delta_+.
Use the inverse on the nonzero projected span, or its pseudoinverse; ell is automatically in that range. This is the squared norm of the projection of the genuine next innovation onto a SMALL specified spatial test space, not an assumed spectral probability. All quantities in L_+ can be formed from the current prefix via the preceding integration by parts. The proved all-moments theta bounds provide rigorous tail control for these spatial weights without raising jet degree.

## 3. Retain the exact negative side and actual inverse feedback

Define positive/negative halfline Grams for the SAME physical derivative source q evaluated at +h and -h, including its physical derivative sign on the negative side. Let their old blocks be A_+,A_-, regression vectors alpha_+,alpha_-, and innovations delta_+,delta_-. The actual old signed block is A=A_+-A_->0, and
 K=A_-+A_-A^-1A_-, Delta=alpha_--alpha_+.
The exact next signed surplus in current normalization is
 s_(N+1)/s_N=delta_+-delta_--Delta^T KDelta.
This is evaluated without normalizing by s_(N+1). In the true old-pivot basis A is the actual identity, but its conditioning is already carried by those pivot scales; it is NOT legitimate to replace A by a parent covariance.

A NONCIRCULAR SUFFICIENT scalar payment criterion for the explicit modular negative-cost term is
 L_+ >= delta_-+Delta^T KDelta+kappa_N mu_N^-.
It implies s_(N+1)/s_N>=kappa_N mu_N^-. This is a deliberately strong comparison with the next signed surplus, not an equivalence to all remaining modular conservation-law terms. It uses a proved lower bound L_+ on the next positive innovation, rather than assuming the next signed pivot positive. The negative innovation and true resolvent cost must still be bounded/evaluated, not discarded.

## 4. Finite verified-rung sanity checks only

Self-authored probe_payment.py: original full-theta formulas evaluated with ten orbits, h<=3 and1200 GL nodes, a=.25, lambda=0; NO interval or infinite-tail numerical certificate claimed. Only the already-verified finite rungs N2->3,N4->5,N5->6 are probed.
For witnesses hF,h³F, the floating strong-payment lower surplus
 L_+-delta_--Delta^TKDelta-kappa_N mu_N^-
is approximately +13.5567,+11.2187,+4.64818 respectively. The one-witness hF test succeeds only at N2 in these checks. Exact surplus identities agree numerically with the independently computed next norm ratios; mu+−mu−=1 and the prefix integration-by-parts identities are also checked.
These sanity values do not establish a uniform inequality in degree or a. In particular the unilateral lower bound has an important normalized-a=0 limitation addressed separately in PAIRED_ERROR_LIMIT.md.
