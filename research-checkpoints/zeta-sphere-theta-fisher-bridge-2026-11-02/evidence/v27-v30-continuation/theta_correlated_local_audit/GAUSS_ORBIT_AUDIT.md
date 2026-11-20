# Independent Gauss/cosine and monotone-orbit audit

PASS, 2026-11-03. Separate post-v29 analytical packet; no new finite pivot.

The known Hankel G>0 gives orthonormal polynomials through degree N-1 and the compressed multiplication matrix formed with Gx. Hankel identities make this an irreducible finite Jacobi matrix, with positive subdiagonal entries from known norms. Gx>0 makes its eigenvalues positive; cyclicity of the constant vector gives strictly positive quadrature weights and simple nodes. Polynomial division by its monic P_N proves exactness through degree2N-1 without mu_2N. Whitening C=sG+Gx and b=G e0 gives rho=sum w_l/(s+x_l).

The halfline exponential integral of cos(2sqrt(x_l)r) is sqrt(s)/(2(s+x_l)). Combined with q_N's factor1/(4pi) and the Laplace factor8pi/sqrt(s), this is exactly rho. Contact matching follows C^(2j)(0)=(-4)^j mu_j/(4pi). At order4N the quadrature error in the monic polynomial x^(2N) equals the original h_N, since quadrature annihilates P_N² and is exact on the lower difference. Thus the first unmatched contact has the stated factor and sign, without assuming h_N positive.

Reflection is essential: at |u|, every orbit summand is positive because z_n>=pi>3/2. The finite sums increase to actual psi by modular evenness, but need not be differentiable at zero. No derivative approximation is used. For delta0 or delta2, use 1,u²<=e^u for u>=0, drop the negative orbit term, and substitute t=pi n²e^(2u). This gives exactly 8 sum (pi n²)^(-3/4) Gamma(11/4,pi n²). Bounding the power derivative by7/(4a) gives Gamma<=a^(7/4)e^-a/(1-7/(4a))<3a^(7/4)e^-a for a>=pi. Successive a_n e^-a_n ratios are at most4e^-3pi<1/2, yielding48a e^-a. At M=0 this is below8 and bounds both full moments.

Expand the positive product difference in J into two tail terms. Evenness removes odd cross moments, giving pi/sqrt(s)(delta0 M2+M0 delta2), hence16pi D_M/sqrt(s). For the compact C error, bound each other profile by192 and change variables; two terms each contribute192(delta2+r²delta0), giving384D_M(1+r²).

Scaling by sP_N(-s)^2 gives the stated error. Since log a<=a/2 for a>=pi, D_M<=48e^-a/2, so the explicit accuracy rule follows with768pi sqrt(s)P_N(-s)^2. Actual coefficients remain in this expression. This controls source approximation, not the sign of the subtracted finite Gauss expression.

The elementary cosine tail has numerator kappa cos(omega R)-omega sin(omega R); its sign is not fixed and is correctly retained. Omitting only the positive C tail gives a lower bound. For the synthetic exp(-r²-r4), moments are4pi,2pi,-3pi; h1=-4pi, q1=cos(sqrt2 r), and C-q1=-2r4/3+O(r6). Its fourth differentiated leading tail is positive. This is a counterexample only to the stated generic-property shortcut, not a theta midpoint correlation or RH counterexample.

Accepted: exact prefix-determined cosine subtraction, monotone complete-theta source approximation, explicit finite-degree accuracy/error budget, and a legitimate conditional next-pivot test. The signed weighted mean still lacks a uniform lower bound.
