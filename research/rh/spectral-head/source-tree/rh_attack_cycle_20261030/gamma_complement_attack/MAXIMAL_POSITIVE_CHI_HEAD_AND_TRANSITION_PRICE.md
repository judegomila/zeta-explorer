# The maximal chi >= 1/2 head: raw stability and the exact transition price

> Curated mathematical source or internal audit. All mathematical sections are retained. Historical producer headers may predate acceptance; current claim scope follows the paired audit and module, not those old workflow labels. Original and published SHA-256 identities are recorded in the dependency inventory. Internal review is not external peer review.

30 October 2026. Separate post-V7 analytic cycle; submitted for independent review. No numerical run or whole-complement positivity claim.

## Results first

The head containing every **signed** positive prolate eigenmode chi >= 1/2 is well defined without knowing the Weil spectrum. Its actual evenized E image is injective, has rank lambda²+O(log lambda), and contains all of the previously accepted vanishing-residual accuracy heads. It therefore removes the particular omitted-nested-frame construction that rules out a constant complement gap for those smaller heads. This does not prove any gap for the new complement.

A new quantitative fact survives without a small concentration deficit: the **raw** finite E map has lower Gram 1/(1152 lambda²) on this entire threshold band, for lambda>=8. Only evenization remains unquantified in the Gram problem.

Compared with the accepted lambda^(-8)-accuracy frame, the enlarged head adds only O(log² lambda) physical directions. Its shifted actual head positivity reduces exactly to a Schur test on those directions; the physical coupling to the old frame is at most its vanishing residual eta_8. This isolates the price rather than pretending that every new mode remains near-null.

## 1. Actual head and its rank

Let C_lambda=P_lambda F P_lambda on additive-even L²[-lambda,lambda], with

    F u(t)=integral exp(2pi i ts)u(s)ds,
    C_lambda e_n=chi_n e_n, chi_(4j)>0.

Define

    B_* = span{e_(4j): chi_(4j)>=1/2},
    U_* = B_* intersect 1^perp,
    A u = S E_raw u, S=(I+J)/2,
    F_* = A U_*.                                             (1)

This is a spectral cutoff of the known compact Fourier operator, not of the unknown actual Weil operator. It is the signed threshold chi>=1/2, equivalent on n divisible by four to the concentration threshold |chi|²>=1/4. Negative Fourier-sign modes are not included.

In the standard PSWF normalization c=2pi lambda², set

    L=(2/pi²)log(200lambda²+25), M0=floor(4lambda²).

The primary KRD Corollary 3 bounds the concentration eigenvalues mu_n=|chi_n|² by

    mu_n>=1-10 exp[-(M0-n-7)/L], n<=M0-1,
    mu_n<=10 exp[-(n-ceil(4lambda²)-6)/L], n>=ceil(4lambda²).

Consequently every nonnegative n<=M0-7-L log(40/3) qualifies for mu_n>=1/4, whereas any qualifying n satisfies n<=ceil(4lambda²)+6+L log40. Selecting n divisible by four and removing the one nonzero mean functional gives

    dim U_* = lambda²+O(log lambda).                         (2)

The primary source is [Karnik--Romberg--Davenport, Corollary 3](https://arxiv.org/html/2006.00427); its concentration-to-signed normalization is already checked in the accepted near-full-frame note. Floors and threshold ties change (2) only by O(1).

The accepted epsilon=lambda^(-8) frame U_8 is contained in U_* eventually. Its rank and normalized action are

    m_8=lambda²-(8/pi²)(log lambda)²+O(log lambda),
    ||H_W|_(F_8)||<=eta_8,
    eta_8=C lambda^(-1)(log lambda)^(5/2)->0.                 (3)

Every other accepted cutoff whose residual parameter tends to zero also eventually lies inside U_*. Thus the *specific* nested-accuracy crowding proof no longer manufactures missing vectors outside F_* by selecting a larger such cutoff. It neither excludes other near-critical vectors outside F_* nor supplies a complete description of that complement.

## 2. Polynomial raw Gram on the entire threshold band

This proof does not use a differential-eigenvalue cutoff, small deficit, or a Poisson exterior estimate.

Let P_c cut out the invisible additive core |t|<lambda^(-1), and write u=c+v with c=P_cu and v=(I-P_c)u. On B_* one has

    <u,C_lambda u> >= (1/2)||u||²,
    ||C_lambda||<=1,
    ||P_c C_lambda P_c||<=2/lambda.                          (4)

The last bound is the Hilbert--Schmidt bound for a modulus-one Fourier kernel on a square of side 2/lambda. It is a bound for the core-to-core compression, not for C_lambda restricted to all core-supported inputs.

Put s=||v||/||u|| in [0,1]. By the two cross terms and (4),

    1/2 <= 2/lambda+2s+s² <= 2/lambda+3s.

For lambda>=8 this implies

    ||v|| >= ||u||/12.                                      (5)

On the positive visible interval [lambda^(-1),lambda], Uu(x)=exp(x/2)u(exp x) is an isometry into the physical logarithmic window. Full additive evenness contributes the factor sqrt(2): ||Uu||=||v||/sqrt(2).

The exact truncated shift factorization and finite Mobius inverse are

    E_raw=T_ar U,
    T_ar=sum_(n<lambda²)n^(-1/2)S_(log n),
    T_ar^(-1)=sum_(n<lambda²)mobius(n)n^(-1/2)S_(log n),
    ||T_ar||, ||T_ar^(-1)||<=2lambda.

Therefore, for every u in B_* (mean zero is not needed in this paragraph),

    ||E_raw u|| >= ||u||/(24sqrt(2)lambda),
    ||E_raw u||² >= ||u||²/(1152lambda²).                    (6)

Raw inversion is thus not the remaining source of unknown conditioning.

## 3. Evenization: injectivity, but no uniform lower Gram yet

Every finite combination u in B_* has an even entire continuation. The accepted analytic parity lemma shows that a nonzero such u cannot have E_raw u inversion-odd. Indeed, near the upper endpoint y=lambda, inversion-oddness would give an analytic identity of the form

    y u(y) = -sum_(n=1)^N u(n/y).

Continuation to nonzero complex y makes the left side odd and the right side even, forcing u=0. This also works for complex coefficients. Hence A is injective on U_* and dim F_*=dim U_*.

For an additive-orthonormal coordinate map V_* onto U_*, define the actual physical Gram

    G_*=V_*^* A* A V_*, g_*=lambda_min(G_*)>0.               (7)

Positivity of g_* is fixed-support qualitative injectivity. It does not give a lower bound uniform as lambda grows. The raw lower bound (6) cannot be substituted for g_*: the odd raw component is discarded by A.

The small-deficit proof controlled that component by C lambda sqrt(r)(log lambda)^(3/2)sqrt(D(u)). At the present threshold only D(u)<=3||u||²/4 follows. This is not a small error compared with the raw lower norm of order lambda^(-1).

There is a second independent scope issue: the threshold may include O(log lambda) indices above 4lambda². The accepted uniform exterior Sonin proof assumes differential eigenvalue nu_n<c², guaranteed there by n<=2c/pi-1. The concentration threshold alone supplies no such inequality for these extra transition modes. One cannot transfer those Sonin residual estimates to the entire maximal head without an additional proof.

## 4. Gamma cost in terms of the missing evenized Gram

The already audited derivative/jump proof uses only chi>=1/2 until its last Gram-normalization step. Thus for every u in U_* the actual zero-extended output y=Au satisfies

    TV(y)<=C0 lambda³ sqrt(W)||u||,
    C0=sqrt(2)(17/2+4pi), W=2log lambda.                     (8)

Both physical endpoint jumps and all interior cutoff jumps are included. Every such y is BV, piecewise smooth and compactly supported; therefore its Fourier transform is O(1/|t|). The multiplier a(t)=Re digamma(5/4+it/2)-log pi grows logarithmically, so a(t)yhat(t) is L². In particular F_* lies in the domain of the actual supported gamma operator and of H_W=Gamma_W-V_W.

Combining (7),(8) gives TV(y)²/||y||²<=C0²lambda^6 W/g_*. The same elementary BV Fourier split, also with log² for the operator norm, yields

    Gamma_W[y] <= C[1+log(2+C0²lambda^6 W/g_*)]||y||²,
    ||Gamma_W y|| <= C[1+log(2+C0²lambda^6 W/g_*)]||y||.     (9)

For the operator inequality, restriction of the full-line multiplier bounds the supported operator norm. Consequently a polynomial lower bound for g_* would recover O(log lambda) gamma energy and gamma action on this head. Without it, (9) records the exact logarithmic conditioning cost, not an O(log lambda) theorem.

For clarity, even a polynomial g_* would not make the full actual head residual small. A direct bound only gives

    ||H_W|_(F_*)|| <= C[1+log(2+C0²lambda^6 W/g_*)]
                    +2 S_W+2log lambda+lambda-lambda^(-1)+4,
    S_W=sum_(n<lambda²) Lambda(n)/sqrt(n).                   (10)

Here ||P_W||<=2S_W and the exact even continuum is 2|cosh(x/2)><cosh(x/2)|-E_dec with ||E_dec||<=4 and ||cosh(x/2)||²=log lambda+(lambda-lambda^(-1))/2. Formula (10) is merely a finite norm bound; it supplies no fixed shifted head reserve.

## 5. Exact transition Schur test, with a vanishing bridge

Use ordinary *physical* orthogonality for this internal finite-head decomposition only:

    F_*=F_8 orthogonal-sum R_*,
    r_*=dim R_*=(8/pi²)(log lambda)²+O(log lambda).           (11)

This is legitimate because the same injective map A sends nested input spaces to nested output spaces. It is not an assertion identifying the external gamma complement with a physical complement.

Fix M>0 with T=Gamma_W+M>=mu I>0. On F_* write the actual shifted head block

    (H_W+M)|_(F_*) = [ A_8  B* ; B  C_* ],
    A_8=P_8(H_W+M)P_8,
    B=R_* H_W P_8,
    C_*=R_*(H_W+M)R_*.

The identity term has no off-diagonal block in this physical decomposition. By (3), eventually

    A_8 >= (M-eta_8)I>0, ||B||<=eta_8.                    (12)

Therefore positivity of this enlarged finite head is **equivalent** to the r_*-dimensional test

    C_* - B A_8^(-1)B* >= 0.                               (13)

The exact self-energy is positive and obeys

    0<=B A_8^(-1)B* <= eta_8²/(M-eta_8) I.                  (14)

A sufficient check is C_*>=eta_8²/(M-eta_8)I. No such lower bound for C_* is presently proved. Even without it, the shifted finite head has negative index at most r_*; this is not a whole-space lower-edge bound.

For a quantified reserve, if a new signed calculation gave C_*>=c0 I with fixed c0>0, then the elementary cross estimate implies

    (H_W+M)|_(F_*) >= min(M-2eta_8,c0-eta_8) I              (15)

eventually. If also g_*>=lambda^(-A) for a fixed A, (9) and (15) would give an order 1/log(lambda) reserve on the transformed enlarged head T^(1/2)F_*. These are two separately stated, currently missing hypotheses; neither follows from chi>=1/2.

## 6. Remaining target and source map

The maximal threshold head removes an avoidable source of complement crowding at the cost of (a) the quantitative evenization Gram and (b) an actual signed transition-head test of dimension O(log² lambda). Its correct exterior gamma complement is still Q_*=(T^(1/2)F_*)^perp. The desired one-sided lower bound for I_(Q_*)-Q_*KQ_*, with a gap delta_lambda satisfying delta_lambda log(lambda)->infinity, remains unproved.

Read alongside:

- `EXACT_COMPLEMENT_AND_NESTED_FRAME_CROWDING.md`, for why a fixed gap fails for every vanishing-residual accuracy cutoff but a shrinking gap remains possible;
- `rh_attack_cycle_20261028/growing_prolate_frame/complement_map/EXACT_RANGE_AND_INTERTWINING_OBSTRUCTION.md`, for the exact finite inverse and analytic parity lemma;
- the independently accepted `near_full_band/TUNABLE_ACCURACY_ADDENDUM.md`, for (3);
- `../gamma_bulk_attack/FRAME_GAMMA_UPPER_AND_SIGNED_HEAD_GAP.md`, for the audited all-jumps BV estimate and gamma-preconditioned head identity.

No smooth bulk model, positive arithmetic proxy, assumed Fourier/Weil intertwiner, or unknown Weil spectral projector is used. A separate note develops the exact Poisson/Mobius expression for the missing evenization error, retaining its signed edge arithmetic and both endpoint/origin repairs.
