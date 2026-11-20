# Diagonal-compensated conditional action: no signed term dropped

Status: new exact algebra; awaiting independent audit. Same hypotheses and conventions as CONDITIONING.md. This is NOT a proof of a positive return reserve.

The previous positive projection can be strengthened by removing the component parallel to the positive innovation as an EXACT integrating factor, rather than paying its absolute magnitude. Let
 r=(I-Pi_V)F, delta=||r||²>0,
 R=(I-Pi_V)(u²F+2uK), alpha=<r,R>/delta,
 R_perp=R-alpha r,
 U=uF-(s/delta)r.
Since uF is perpendicular V and <uF,r>=s, both U and R_perp are perpendicular to the complete SAME-PARITY space span(V,F). In particular
 ||U||²=||uF||²-s²/delta,
 ||R_perp||²=||R||²-alpha² delta,
 s'=2 alpha s+2<U,R_perp>.
No opposite-parity positivity or signed spectral measure was assumed.

Let A(lambda)=integral_0^lambda alpha(t)dt and w=e^{-2A}. The compensated Schur functional is
 E(lambda)=w(lambda)s(lambda),
 E'=2w<U,R_perp>.
Thus the precise sufficient paid return test is
 2 integral_0^1 exp(2 integral_lambda^1 alpha(t)dt) ||U_lambda|| ||R_perp,lambda|| dlambda < s_1.
The diagonal drift is retained through its signed exponential; this is not a replacement by an unsigned norm.

In actual positive-parent coordinates P, b=P/P_1, m=s/P, d=delta/P and eta_perp=||R_perp||/sqrt(P), the accepted all-degree spatial theorem gives the fully explicit sufficient bound
 [2/m_1] integral_0^1 exp(2 integral_lambda^1 alpha) b(lambda)
       sqrt(C(n,1)²-m(lambda)²/d(lambda)) eta_perp(lambda) dlambda <1.
The square root is real because the exact Cauchy relation s²/delta<=||uF||² and spatial bound imply its nonnegative argument. This formula names every conditioning factor; it does not presume the desired lower bound on m.

The remaining theta-specific target is control of the SIGNED conditional correlation <U,R_perp>, or its reflected/blockwise conditional means, relative to terminal reserve. The positive conditional variance product is only an upper estimate. In particular curvature/entropy relaxation cannot simply replace this actual matrix/feature geometry.

Own-source floating probe_compensated.py (201 lambda trapezoidal nodes, spatial setup of probe_conditioning.py) gives compensated Cauchy cost/terminal ratios:
 n=2:4.4781; n=5:10.4340; n=9:13.4227; n=15:13.3886.
These are not certificates. The exact diagonal compensation helps some low degrees but does not rescue the actual fixed-interval Cauchy budget. Reflection/block integration remains necessary; the missing control is quantitative conditional cancellation, not merely scalar drift subtraction.
