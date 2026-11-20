# Positive-chi core geometry: stronger raw Gram and visible main reserve

> Curated mathematical source or internal audit. All mathematical sections are retained. Historical producer headers may predate acceptance; current claim scope follows the paired audit and module, not those old workflow labels. Original and published SHA-256 identities are recorded in the dependency inventory. Internal review is not external peer review.

30 October 2026. Separate post-V7 analytic addendum. No numerical experiment or signed arithmetic-edge bound is proved here. Earlier frozen notes remain unchanged.

## Results

For the actual signed prolate band chi>=1/2 and lambda>=8, the visible additive mass is at least 1/6 of the full input norm squared. Hence the actual raw finite-E Gram is at least

    ||E_raw u||² >= ||u||²/(48lambda²).                     (1)

This improves the earlier 1/(1152lambda²) raw bound, but still does not transfer automatically through evenization.

The visible main cross form in the exact Poisson--Mobius identity also has the stronger uniform reserve

    Re <P_vu,(I+C_lambda)u>
      >= [1/4-(sqrt(2)-sqrt(3/2))²/4] ||u||²
      >0.2410 ||u||², lambda>=8.                           (2)

The complete signed edge/repair form has not been bounded against this reserve. In particular, comparison with a floating matrix minimum is not an analytic absorption proof.

## 1. Spectral projection controls the invisible core

Work first on the full additive-even Hilbert space X=L²_even[-lambda,lambda], with the actual selfadjoint contraction C=C_lambda=P_lambda F P_lambda. Let P_tau=1_[tau,1](C), where 0<tau<1. The threshold space is the range of this known Fourier spectral projection, not a Weil spectral projection.

Let P_c cut out |t|<lambda^(-1), P_v=I-P_c, and epsilon=2/lambda. The actual Fourier kernel has modulus one, so

    ||P_c C P_c||<=epsilon.

Since -I<=C<=I, the spectral theorem gives

    C+I >= (1+tau)P_tau.

Compressing to the core yields

    (1+tau)P_c P_tau P_c <= P_c(C+I)P_c
                               <=(1+epsilon)P_c.

Taking operator norms and using ||P_c P_tau||²=||P_c P_tau P_c|| gives, for u in Ran(P_tau),

    ||P_cu||² <= [(1+epsilon)/(1+tau)]||u||²,
    ||P_vu||² >= v0||u||²,
    v0=(tau-epsilon)/(1+tau), provided epsilon<tau.          (3)

At tau=1/2 and lambda>=8, v0>=1/6. This argument uses the entire positive spectral projection and the negative spectral lower bound C>=-I; it is stronger than estimating the two core/visible cross terms separately.

On the positive visible interval the norm is ||P_vu||/sqrt(2). Applying the actual finite Mobius inverse, whose norm is at most 2lambda, gives

    ||E_raw u||² >= v0||u||²/(8lambda²).                    (4)

Equation (1) follows. Mean zero is not needed for (3),(4).

## 2. Retaining the main form's Jordan-product geometry

Restrict operators in this paragraph to Ran(P_tau). Write

    V=P_tau P_v P_tau, D=I+C|_(Ran P_tau), S=D^(1/2).

Then

    v0 I<=V<=I, (1+tau)I<=D<=2I.

The actual visible main cross form equals the quadratic form of

    A=(VD+DV)/2.

Although V and D need not commute, the following identity is exact:

    A=S V S + (1/2)[S,[S,V]].                              (5)

Put d_S=sqrt(2)-sqrt(1+tau). Center S at the midpoint of its spectral interval and V at I/2. The centered norms are at most d_S/2 and 1/2. Constants commute, so two applications of ||[X,Y]||<=2||X||||Y|| give

    ||(1/2)[S,[S,V]]|| <= d_S²/4.                         (6)

Also S V S>=v0 D>=v0(1+tau)I=(tau-epsilon)I. Therefore

    A >= gamma_(lambda,tau) I,
    gamma_(lambda,tau)
       =tau-2/lambda-[sqrt(2)-sqrt(1+tau)]²/4.              (7)

For tau=1/2 and lambda>=8, (7) implies (2). As lambda grows, this explicit sufficient main reserve tends to

    1/2-[sqrt(2)-sqrt(3/2)]²/4 >0.4910.

No arithmetic edge estimate enters (5)-(7).

## 3. Mean-zero restriction and precise conditional consequence

The actual input is U_*=Ran(P_(1/2)) intersect 1^perp. The preceding inequalities were proved first on the full signed threshold band and then restricted to U_*. Mean removal need not commute with C, S or V; no such commutation is used.

Let Rcal_even[u] denote the complete evenly extended visible defect from `EXACT_POISSON_MOBIUS_EDGE_AND_SIGNED_GRAM_TARGET.md`, including the repaired exterior tail, endpoint collar and invisible-origin Fourier contribution. That note proves

    2 L_even u=P_v(I+C)u+Rcal_even[u],
    ||L_even u||<=2sqrt(2)lambda||S_even E_raw u||.           (8)

Here S_even is output reflection averaging; it is distinct from the square root S in section 2.

If a new argument proved

    Re <P_vu,Rcal_even[u]> >= -kappa||u||²

uniformly on U_* with kappa smaller than the positive right side in (2), then (8) would yield

    ||S_even E_raw u||
      >=(gamma_(lambda,1/2)-kappa)||u||/(4sqrt(2)lambda).     (9)

No such bound is proved here. A less wasteful target is the directional relative estimate D_edge>=-theta A, theta<1, with A the exact compressed main matrix rather than its scalar lower bound. Even that target remains an arithmetic assertion, not a consequence of (7).

## 4. Sources and verification scope

The actual Fourier/core compression, signed threshold, finite Mobius inverse, and full-even normalization are those in the independently accepted `MAXIMAL_POSITIVE_CHI_HEAD_AND_TRANSITION_PRICE.md`. The exact edge identity is the separately audited Poisson--Mobius note named above.

This addendum consists of elementary spectral order, an exact double-commutator identity, and the existing finite arithmetic inverse. The independent internal review checked the algebra before freezing; formal acceptance should pin these final bytes. No uniform evenized Gram, actual Weil reserve, external complement gap, or RH conclusion follows without the still-missing signed edge estimate.
