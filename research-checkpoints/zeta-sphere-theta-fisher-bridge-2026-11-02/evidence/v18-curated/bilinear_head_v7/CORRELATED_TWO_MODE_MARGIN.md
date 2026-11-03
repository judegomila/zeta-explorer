# A uniform positive signed margin after completing the first arithmetic square

2 November 2026. Independent hierarchy-lane review PASS; see TWO_MODE_REVIEW_HIERARCHY.md. This is an analytic all-high-frequency theorem for a finite head, not a numerical Gram test or a full-kernel theorem.

Let D_(a,2) be the corrected Ewald square head retaining the entire collective axis and all1<=n,m<=2. For every t>=1000 and0<a<=1/2,

             hat D_(a,2)(2t)/a >=(1/2)t³exp(-pi t/2).  (1)

The proof retains the correlated phase t log2 exactly. It shows how adding the missing(2,2) diagonal repairs the negative fixed product-M2 example, within this limited square head. It does not control the omitted full arithmetic tail.

## 1. Positive paired outward curvature for two modes

Put p=1/2+a and

 g(p)=pi^(-p)|Gamma((p+it)/2)|²,
 F(p)=g(p)|1+2^(-p)exp(-it log2)|²,
 ell=g'/g, l=log2, r=2^(-p), c=cos(t log2).

The completed Mellin parent is T(a)=F(1/2+a)+F(1/2-a). For0<=p<=1 andt>=1000, the elementary digamma estimates already proved in signed_head_v5 imply

 ell>2, ell'>-1/2, g(p)>=g(0).

For clarity, ell>=log(t/(2pi))-gamma-2/t²-pi/(2t)>2 follows from gamma<1, pi<4, e<3 andt>=1000; the same trigamma estimate gives ell'>-1/2.

Direct differentiation gives

 F''/g=(ell²+ell')(1+r²+2rc)
             -4ell l(r²+rc)+4l²r²+2l²rc.

The coefficient of c is2r[(ell-l)²+ell']>0. Thus the worst phase is c=-1, and for every actual phase

 F''/g >=(ell²+ell')(1-r)²
             +4ell l r(1-r)+2l²r(2r-1).              (2)

Here1/2<=r<=1, so every displayed term is nonnegative. If r<=3/4, the first term is at least(7/2)/16=7/32>1/5. If r>=3/4, the last term is at least(3/4)l²>=1/3>1/5, using log2>=2/3. Therefore

                         F''(p)>=g(0)/5.             (3)

This is a phase-correlated inequality, not a termwise absolute estimate on the reciprocal cross pair.

Integrating(3) from1/2-a to1/2+a gives T'(a)/a>=2g(0)/5. Since P_a'(2t)/a>0 andT>=0,

 partial_a[P_a(2t)T(a)]/(128a)
       >=t⁴g(0)/20
       =pi t³/[10sinh(pi t/2)]
       >(3/5)t³exp(-pi t/2).                          (4)

## 2. Exact low-integral and axis corrections

The reviewed completed-parent decomposition has a low-integral correction bounded by

 4|Gamma(it)|exp(16pi²/t)(6t+6/t+2/t³).

For t>=1000, |Gamma(it)|<3t^(-1/2)exp(-pi t/2), exp(16pi²/t)<2 and the last bracket<7t. Thus its magnitude is less than168sqrt(t)exp(-pi t/2).

The entire axis satisfies the reviewed bound2t²exp(-pi t/2). Their sum is less than3t²exp(-pi t/2). Subtracting from(4) proves(1), because(3/5)t³-3t²>t³/2 for t>=1000.

## 3. Scope and mechanism

The theorem is uniform as a decreases to zero and includes the endpoint a=1/2 by the already justified paired continuation. The full normalized omitted orbit tail is not small relative to this fixed head at all heights; no full positivity follows.

This is a concrete signed bilinear reserve for the first complete arithmetic square. It coexists with the negative coefficient-matrix minor: only the constrained physical vector(1,2^(-it)) and its p-dependent amplitudes are controlled, not arbitrary complex coefficients. The argument relies on the special two-mode geometry r in[1/2,1]; no extension to a growing number of modes or to the adaptive product head is asserted.
