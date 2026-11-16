# Falsification of pointwise positivity for the endpoint-corrected N=1 grouping

Status: independent analytic review and scalar Arb replay PASS. This is a one-constant candidate falsification, not a new finite bridge certificate.

For the corrected arithmetic expression at N=1,
 Z_1(s)=(1/4)s(s+1)pi^(-s/2)Gamma(s/2).
Let G_1(z)=Z_1(1/2+iz)+Z_1(1/2-iz). Then the exact endpoint correction gives G_1(i/2)=1, while
 G_1(0)=(3/8)pi^(-1/4)Gamma(1/4)>1.021>1.
The last inequality is checked with160-bit Arb in check_corrected_N1.py; its complete output is corrected_N1.json. No polynomial inverse or existing target certificate is an input.

Thus |G_1(ia)|^2 decreases between0 and1/2, and its derivative is negative at some intermediate shift. The endpoint-corrected approximant still has a negative pointwise spectral bridge region. By the even/exponentially integrable polynomial-density argument, some finite polynomial degree detects a negative quadratic form. This does not specify a particular degree, actual-theta residual, or shift, and does not disprove the complete-theta target.

The scalar integrated bridge remains positive by its even real physical-profile Hardy formula. Correcting the boundary-layer approximation error therefore does not automatically make the approximant a positive spectral kernel. A signed degree-dependent lower estimate is still necessary.
