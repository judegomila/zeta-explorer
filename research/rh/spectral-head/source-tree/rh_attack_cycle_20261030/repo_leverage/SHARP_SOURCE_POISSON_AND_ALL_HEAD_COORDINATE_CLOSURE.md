# Sharp-source Poisson identity and all-head coordinate closure

> Curated mathematical source or internal audit. All mathematical sections are retained. Historical producer headers may predate acceptance; current claim scope follows the paired audit and module, not those old workflow labels. Original and published SHA-256 identities are recorded in the dependency inventory. Internal review is not external peer review.

30 October 2026. **New producer proof; independent audit requested.** This removes the two source-trace restrictions from the coordinate estimate, subject to verification of the arguments below. It does not prove an actual Weil-energy inequality, a gamma-complement bound, or RH. All previously frozen trace-null results remain unchanged.

## 1. Literal map and canonical-candidate normalization

The map here is exactly

    E_raw g(x)=exp(x/2)sum_(1<=n<lambda exp(-x))g(n exp x),
    E_even=S E_raw, S=(I+J)/2, Jf(x)=f(-x),

on the logarithmic window |x|<loglambda. It is the same T=S E_lambda used in `scratch/actual_candidate_scale_bound_20261026/ACTUAL_CANDIDATE_ENERGY_BOUND.md` and in `rh_attack_cycle_20261028/growing_prolate_frame/complement_map/EXACT_RANGE_AND_INTERTWINING_OBSTRUCTION.md`, Sections1--2. In particular the canonical candidate is E_even applied to A[e4-(integral e4/integral e0)e0]. The older h_n normalization only multiplies this combination by a4(lambda); it does not change the map or turn it into an isometry. The canonical source generally has neither trace exactly zero.

Use the exact finite arithmetic inverse and visible isometry

    T_ar^(-1)=sum_(d<lambda²)mu(d)d^(-1/2)S_(log d),
    (Uf)(x)=exp(x/2)f(exp x),
    L_even g=even extension of U^(-1)T_ar^(-1)E_even g.

Thus ||L_even g||<=2sqrt2 lambda||E_even g||. Visible pairings are full-even, i.e. twice the positive dy integral.

Let B_lambda be the signed positive-even head chi_n>=1/2 and E_lambda=B_lambda intersect 1-perp. Sources and tests below are finite actual prolate combinations. No g(0)=0 or g(lambda)=0 assumption is imposed unless explicitly stated.

## 2. Sharp-endpoint Poisson in its legitimate paired sense

Extend g sharply by zero outside[-lambda,lambda], and put H=Fg with Fourier kernel exp(2pi ist). This even function has bounded variation, including its two endpoint jumps, and is smooth on the interior. For each y>0 periodize g with period1/y:

    p_y(s)=sum_(m in Z) g(s+m/y).

The sum is locally finite. Its variation over one period is at most TV_R(g), and its mean is y integral g=0. Its Fourier coefficients are y H(ny). The Dirichlet--Jordan theorem gives at s=0, except when a translated source endpoint coincides with0,

    y sum_(n in Z) H(ny)=g(0)+2sum_(m>=1)g(m/y).

The exceptional y values form a countable set and are irrelevant to the visible L2 pairing. At them the usual endpoint-average convention can be used.

For completeness, the Fourier partial sums of a periodic BV function with zero mean are uniformly bounded by a universal constant times its variation. Integrate the finite Dirichlet kernel by parts against its zero-mean primitive sum_(n=1)^N sin(2pi n t)/(pi n), whose supremum is bounded independently of N and t by elementary summation by parts. This also proves an integrable dominating bound for the present sums: for y in[lambda^-1,lambda], the symmetric partial sums of H(ny) are bounded by C lambda TV_R(g). The finite interior sums cause no difficulty. Thus all ensuing visible pairings and the finite Mobius inverse pass to the ordinary symmetric-sum limit by dominated convergence at each fixed lambda.

Since H(0)=integral g=0, the exact physical identity is

    J E_raw g = E_raw C_lambda g + Tail(H)
                                      -g(0)exp(-x/2)/2, (1)

where Tail(H)=exp(x/2)sum_(n exp x>lambda)H(n exp x), in the just-defined ordinary Poisson sense. The sharp endpoint creates no extra term almost everywhere. This does NOT assert absolute convergence of the unpaired Fourier lattice sum.

After the actual finite inverse, define M1(R)=sum_(d<=R)mu(d)/d. Equation (1) becomes

    2 L_even g=P_v(I+C_lambda)g+T_even g-g(0)r_even,
    r(y)=M1(lambda/y)/(2y), lambda^-1<y<lambda,          (2)
    T g(y)=sum_(d<=lambda/y)mu(d)
                        sum_(n>lambda/(dy)) H(dny).   (3)

The inverse shift gives precisely the factor1/d in r, but there is NO1/d in the double tail (3). Each n sum is the Poisson limit and d is finite. The paired rearrangements below are justified more strongly by absolute convergence of the resulting finite-interval bilinear operators.

This also reconciles the older repaired identity. For v=g-bp-c eta_lambda, with b=g(lambda), c=g(0), the endpoint profile p is even, mean zero and p(0)=0. Applying the same legitimate paired Poisson identity to p cancels its displayed repair J E_raw p-E_raw C p against Tail(Fp). For eta_lambda, E_raw eta_lambda=0, mean zero and eta_lambda(0)=1 give E_raw C eta_lambda+Tail(F eta_lambda)=exp(-x/2)/2. Thus the two-repair formula reduces exactly to (2): endpoint repair is a convergence device, while the intrinsic origin correction is the displayed rank-one profile. Neither is silently discarded.

## 3. A channel estimate valid for arbitrary head sources

The independently accepted `UNIFORM_COLLAR_TAIL_AND_SINGLE_CHANNEL_TRANSFER.md` proves, for the actual channels

    K_(j,W)g(xi)=lambda^(-1/2)integral_0^W
                 H_g(lambda+tau/lambda)exp(-2pi i xi tau/j)d_tau,

that for V>W>0 and j>=2,

    ||K_(j,V)-K_(j,W)||_HS<=C_tail/sqrt(W),
    C_tail²=128/(9pi^4).                               (4)

The proof uses P_head<=4K_c and negative-frequency leakage of a compact source. It has NO source-trace hypothesis. For any source g and test u in B_lambda, the exact inverse-chi extension of u has norm at most2||u||. Therefore, whenever the samples t/j stay visible,

    |(2/j)integral_(lambda+W/lambda)^(lambda+V/lambda)
                      H_g(t)conjugate(u(t/j))dt|
       <=4C_tail/(j sqrt(W))||u||||g||.                 (5)

Every finite endpoint in (5) is retained.

## 4. Entire first shell outside the collar, with no endpoint nullity

The exact coefficient on lambda<jy<2lambda is -mu(j), because A_(lambda/y)(j)=-mu(j) there. Its positive y interval, after t=jy, is

    max(lambda,j/lambda)<t<2lambda,
    2<=j<2lambda².

For j>=2 the upper input bound t/j<=lambda is automatic. Set Lambda=lambda² and choose0<W<Lambda. Removing the physical collar lambda<t<lambda+W/lambda leaves

    max(W,j-Lambda)<tau<Lambda.

Apply (5), replace |mu(j)| by1 and sum. The complete first-shell contribution outside the collar obeys

    |B_first,out(u,g)|
       <=4C_tail[1+log(2Lambda)]/sqrt(W)||u||||g||.     (6)

For W=(1+loglambda)^6 this tends to zero. This is a bound for the actual moving intervals, not for an artificially fixed first-shell cutoff.

## 5. Farther shells: absolutely summable paired divisor intervals

The remaining tail has t=dny>=2lambda. Divisor-first expansion gives the exact intervals

    max(2lambda,dn/lambda)<t<n lambda,
    d<=Lambda, n>=2, j=dn,

with empty intervals omitted. In scaled tau coordinates their endpoints are

    W_(dn)=max(Lambda,dn-Lambda),
    V_n=(n-1)Lambda.

They ensure both1/lambda<=t/(dn)<=lambda/d<=lambda. Equation (5) bounds each full-even term by

    4C_tail |mu(d)|/[dn sqrt(max(Lambda,dn-Lambda))]||u||||g||.

For dn<=2Lambda use the bound1/sqrt(...)=1/lambda. The resulting sum is at most

    [1+logLambda][1+log(2Lambda)]/lambda.

For dn>2Lambda, sqrt(dn-Lambda)>=sqrt(dn/2). With X=2Lambda/d>=2, the elementary estimate sum_(n>X)n^(-3/2)<=3/sqrt(X) gives an upper bound

    [3/lambda]sum_(d<=Lambda)1/d
       <=3[1+logLambda]/lambda.

Consequently

    |B_far(u,g)|
      <=(4C_tail/lambda)[1+logLambda]
                            [4+log(2Lambda)]||u||||g||=o(1)||u||||g||. (7)

In particular the sum of norms of these paired interval operators is finite for each support. This both proves the estimate and justifies the divisor reindexing/limiting pairing. No endpoint expansion, source trace, Sonin estimate, or arithmetic sign cancellation was used.

## 6. The actual critical collar on the whole head

The accepted `COLLAR_RECIPROCAL_SAMPLING_AND_SMALL_LABEL_REDUCTION.md` starts with arbitrary u,g in the positive head. Its middle/high-label bounds use only the inverse-chi test estimates and ||H_g||_(L2 collar)<=||g||, not either source trace. Hence, with

    W=(1+loglambda)^6, h=W/lambda,
    J0=2^ceil(log_2((1+loglambda)^8)),

those bounds remain valid without modification, retaining j<=lambda t. The low-label actual channel estimate likewise never used source traces. The independently accepted Hardy/squarefree synthesis therefore gives

    |B_collar(u,g)|<=[B0+o(1)]||u||||g||,
    B0=4sqrt[H²(15/pi²-1)],
    H²=(log4-3/4)log3/(4pi²), B0<.386.                (8)

Combining (6)--(8), the entire Poisson tail in (2) satisfies the proposed all-head estimate

    |<P_vu,T_even g>|<=[B0+o(1)]||u||||g||.            (9)

Mean zero is required for the simple identity (2), but no source trace restriction is needed in the estimates (4)--(9).

## 7. The intrinsic origin repair is small in operator norm

Here is a direct proof independent of moving-mode endpoint asymptotics. In unit-interval coordinates let h(x)=sqrt(lambda)g(lambda x). The physical finite Fourier operator is B_c, with positive eigenvalues chi_n on the selected head. Evaluating B_c at0 and using the source mean zero gives

    g(0)=sqrt(lambda)<1,(B_c^(-1)-I)h>.

The inverse is used only on the selected finite head. For1/2<=chi<=1,

    (chi^(-1)-1)² <=(4/3)(1-chi²).

Since the constant1 on[-1,1] has angular Fourier transform sqrt(2/pi)sin(t)/t,

    <1,(I-K_c)1>=(4/pi)integral_c^infinity sin²(t)/t²dt
                      <=4/(pi c).

Cauchy--Schwarz in the common eigenbasis, c=2pi lambda², now proves

    |g(0)|²<=8/(3pi²lambda)||g||².                     (10)

The full-even visible norm of the exact profile r in (2) is

    ||r_even||²=(1/(2lambda))integral_1^Lambda |M1(R)|²dR. (11)

Ordinary unconditional Mertens/PNT gives M1(R)->0. This also follows from the already used bound M(R)=O(R exp(-b sqrt(logR))) by partial summation, with the total sum at1 equal to lim_(s down1)1/zeta(s)=0. Therefore Cesaro averaging in (11) gives ||r_even||²=o(lambda). Equations (10)--(11) imply the support-uniform rank-one estimate

    ||g(0)r_even||=o(1)||g||.                          (12)

The origin trace and all of its bulk couplings are controlled together by this operator-norm bound. Treating only the scalar trace-block diagonal would be insufficient; (12) does not make that mistake.

## 8. Proposed full mean-zero-head coordinate consequence

The previously admitted visible-main estimate is

    Re<P_vg,(I+C_lambda)g>
       >=[(4sqrt3-3)/8-2/lambda]||g||².

Its limiting sufficient constant exceeds.491, whereas (8) gives B0<.386. Combining (2),(9),(12) leaves a strict limiting gap greater than.105. Thus the proposed theorem is: for all sufficiently large lambda and every g in the ENTIRE mean-zero signed positive head E_lambda,

    2Re<P_vg,L_even g> >=(1/10)||g||²,
    ||E_even g||>=||g||/(40sqrt2 lambda),
    ||E_even g||²>=||g||²/(3200lambda²).               (13)

The onset is unspecified. The source endpoint was removed through a justified conditional Poisson identity and paired tail control; the origin trace was retained and absorbed in norm. Thus, if all steps pass independent review, no residual two-dimensional coordinate Schur obstruction remains for this particular maximal head/map.

For comparison with earlier trace reductions, in an additive-orthonormal head basis the mean vector is m_n=chi_n e_n(0). Let R remove m, r0_n=e_n(0), rlambda_n=e_n(lambda), and let A be the positive visible-main matrix on the mean-zero space. Its trace representers are A^(-1)Rr_i, and the exact trace Gram is r_i*R A^(-1)Rr_j. The old Schur decomposition and all its cross terms are still algebraically correct. The present route does not estimate that2x2 block by fixed low modes: it controls the COMPLETE form directly, so its Schur complement is positive as a consequence of (13), if (13) is admitted. The Hermitian trace correction remains rank at most4, not automatically2.

This does not identify the canonical candidate with the actual ground, does not promote the maximal head's coordinate Gram to a small actual energy residual, and does not control the correct gamma-orthogonal complement. The original global signed Weil floor remains open.
