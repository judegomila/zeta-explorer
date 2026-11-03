# Exact weakly singular compression and the support-three gap budget

2 November2026. Completed exact-compression and Rayleigh certificates; independent audit/replays PASS (bilinear_head_v7/suzuki_v10_review/REVIEW.md). V9 frozen files unchanged. This note develops a quadrature-free compression certificate and a necessary gap budget at the next genuine threshold A²=3. It does not yet certify invertibility there.

## 1. Analytic second primitive

Use the v8/v9 arithmetic logarithmic kernel at w=2/5. Let C=pi^w/Gamma(w), z=1−exp(−2r), and

 F_alpha(z)=sum_(j>=0) f_alpha,j z^j,
 f_alpha,j=(-alpha)_j/[j!(w+j)].

The already proved primitive is

 Q(r)=C z^w[9F_(1/20)(z)−8(1−z)^(-1/20)F_(1/10)(z)], r>=0.

Put T(r)=integral_0^r Q(u)du, T=0 for r<=0. Since dr=dz/[2(1−z)],

 T(r)=(C/2) z^(w+1) sum_(j>=0) a_j z^j/(w+j+1),
 a_j=9 sum_(k=0)^j f_(1/20),k
     −8 sum_(k=0)^j f_(1/10),k b_(j−k),
 b_l=(21/20)_l/l!.

This is an exact absolutely convergent formula on every finite r interval. It handles the fractional singularity analytically and needs no singular point samples, quadrature, or alignment of log2 with a grid.

For r<=log3, z<=8/9. The elementary bounds |f_alpha,j|<=5/2 and b_l<=l+1 give |a_j|<=33(j+2)^2. After truncating at degree K, a uniform absolute remainder is

 epsilon_T=(C/2)*66(K+3)^2(8/9)^(K+1)/(1−8/9)^3.       (1)

Indeed the remaining polynomial-geometric sum is bounded by2(K+3)^2 z^(K+1)/(1−z)^3, and z^(w+1)/(w+j+1)<=1. All finite coefficients and evaluations can therefore be enclosed with interval arithmetic, including cancellation.

## 2. Exact Galerkin matrix, without an aligned arithmetic threshold

Set R=log3, h=R/n and normalized cell constants on [0,R]. In reflected logarithmic coordinates the kernel is

 H(x,y)=q(x+y−R)+c2 q(x+y−R−log2),
 c2=(2^w−2^(−w))/sqrt2.

At the endpoint R=log3 the n=3 term has support only on a measure-zero corner and contributes zero to the operator. For a later support R>log3 it must be included explicitly.

Define U(r)=T(r)+c2 T(r−log2). Exact double integration gives

 A_ij=[U((i+j+2)h−R)−2U((i+j+1)h−R)+U((i+j)h−R)]/h,
 0<=i,j<n.                                              (2)

The proof is simply T''=q in the locally integrable/distributional sense; Q(0)=T(0)=0 introduces no delta terms. Thus(2) is valid despite q's integrable unbounded onset.

For any nonzero integer vector c, set d_k=sum_(i+j=k)c_i c_j. Its exact Rayleigh quotient is

 r_c={sum_k d_k[U((k+2)h−R)−2U((k+1)h−R)+U(kh−R)]}
                       /[h sum_i c_i²].                 (3)

This reduces validation to O(n) interval function evaluations and exact integer convolution weights, instead of interval eigensolving. The vector may be proposed by an untrusted floating eigensolver; only its integers and the interval evaluation of(3) enter the certificate. No numerical eigenvalue is assumed accurate.

## 3. Scope of the quantitative implication

The completed n512,K512 interval run encloses r_c in

 [.9999948818028,.9999948818195].

The exact endpoints and integer witness are preserved in primitive_trial_512_certificate.json. The higher-resolution n2048,K640 run has completed and encloses its integer witness quotient in [.9999996447987626036,.9999996447987627196], saved in primitive_trial_certificate.json. Independent review and differently accumulated replay PASS.

Unconditionally, self-adjointness and(3) give ||H||>=r_c. Consequently any sought contraction certificate ||H||<=1−g at this support must have g<=1−r_c. The n2048 witness forces g<.000000355202, over100 times smaller than v9's certified uniform margin. This does NOT prove noninvertibility or an eigenvalue crossing1.

If a separate argument proves ||H||<1, then I−H is positive and Cauchy–Schwarz applied to its square root and inverse square root gives

 <f,(I−H)^(-1)f> >=1/[1−<f,Hf>], ||f||=1.

Thus the inverse norm must be at least1/(1−r_c), in particular greater than2,800,000 for the n2048 witness, under that explicit contraction premise. Do not use the Rayleigh quotient alone to assert an unconditional inverse lower bound for an indefinite I−H.

The exploratory Schur probes at n512/768 are not certificates: their positive-channel upper bounds remain slightly above1. The exact compression construction above supplies reliable finite data and an explicit precision/gap target for subsequent residual/resolvent work. It does not replace the missing high-space coupling estimate with finite-dimensional positivity, nor assume determinant class, innerness, or RH.

## Higher-resolution validated witness

The n8192,K768 run and independent replay both PASS. The independent enclosure is [.9999999527514800704529231648164,.9999999527514800704529231648678]. Thus any contraction margin at A²=3 is less than4.724852e−8. Under the separately proved contraction premise, the inverse lower bound exceeds21,000,000. This is not a contraction certificate. The floating FFT only proposed a vector; all verification uses its exact integer entries and interval primitives. Exact int64 convolution cannot overflow because sum c_i²=999999999743919939<2^63 bounds every partial absolute product sum by Cauchy–Schwarz. Every activation interval was checked not to strictly straddle zero. Ongoing continuous enrichment probes are excluded from this completed theorem.
