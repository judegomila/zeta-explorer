# Strong band-edge limit and the positive-Fourier endpoint measure

> Curated mathematical source or internal audit. All mathematical sections are retained. Historical producer headers may predate acceptance; current claim scope follows the paired audit and module, not those old workflow labels. Original and published SHA-256 identities are recorded in the dependency inventory. Internal review is not external peer review.

30 October 2026. **Constructive spectral theorem; independent audit requested.** This note proves the endpoint-flow measure, including the positive even Fourier-phase quarter factor, without differentiating any counting asymptotic. A simultaneous strong-resolvent limit also identifies the differential coordinate directly. No growing-collar operator transfer, signed arithmetic estimate, or RH conclusion is asserted.

## 1. Operators, domains, and exact endpoint normalization

Work in the complex Hilbert space H=L2((-1,1),dx). Let E:H->L2(R) be zero extension, and use the unitary full-line Fourier transform

    Ff(xi)=(2pi)^(-1/2) integral exp(-i xi x)f(x)dx.

For c>0 define

    K_c(x,y)=sin(c(x-y))/(pi(x-y)),
    B_c(x,y)=sqrt(c/(2pi)) exp(i c x y),
    Rf(x)=f(-x), M_cf(x)=exp(i c x)f(x), v_c=M_c 1.

Thus K_c=E*F*1_[-c,c]FE=B_c*B_c=B_c B_c*, 0<K_c<I,

    B_c^2=R K_c.                                        (1)

Both K_c and B_c are compact; they are injective (an entire finite Fourier transform vanishing on an interval vanishes identically). In particular K_c has no zero eigenvector, although zero is its spectral accumulation point. The polar factor U_c of B_c is a unitary, commutes with K_c, and satisfies

    B_c=U_c sqrt(K_c), U_c^2=R, U_c^4=I.

The notation B_c K_c^(-1/2) means its bounded polar extension, not an everywhere-defined unbounded product. Its +1 phase projector is

    P_+,c=(I+U_c+R+U_c*)/4.                             (2)

More generally the projector onto phase i^ell is

    P_ell,c=(I+i^(-ell)U_c+(-1)^ell R+i^ell U_c*)/4.

Use the natural self-adjoint prolate operator

    L_c f= -[(1-x^2)f']'+c^2 x^2 f.

It is the Friedrichs realization of its nonnegative quadratic form, equivalently the regular realization with endpoint flux (1-x^2)f' tending to zero. It does NOT impose zero endpoint values. In particular C_c^infinity(-1,1) is contained in its operator domain. Its real normalized prolate eigenfunctions psi_n form a common orthonormal eigenbasis of L_c,K_c,B_c; denote their eigenvalues by nu_n,kappa_n,chi_n. With the usual increasing differential labels, the phase of chi_n is i^n; for the theorem it suffices to define the positive class intrinsically by chi_n>0. This is exactly the even positive class, and conventionally n=0 mod4.

The finite-Fourier and concentration normalizations are fixed explicitly in Bonami--Karoui, C. R. Math.352 (2014), printed p230, equation (2):
<https://comptes-rendus.academie-sciences.fr/mathematique/item/10.1016/j.crma.2014.01.004.pdf>.
Their differential operator and regular eigenfunctions are given on pp229--230. The independent primary treatment <https://arxiv.org/html/1405.3676v2> also gives the differential operator and common basis; its introductory displayed shorthand for F*F should not replace the explicit c/(2pi) normalization above. No asymptotic statement from either source is used below.

In physical coordinates set

    c=2pi lambda^2, e_n(t)=lambda^(-1/2)psi_n(t/lambda),
    kappa_n=|chi_n|^2, delta_n=(nu_n-c^2)/lambda^2.

The physical finite Fourier operator with kernel exp(2pi i s t), on the full additive interval [-lambda,lambda], is unitarily equivalent to B_c. Evaluating its rescaled eigenrelation at x=1 gives the EXACT identity

    |<psi_n,v_c>|^2=(2pi/c) kappa_n |psi_n(1)|^2
                   =kappa_n |e_n(lambda)|^2/lambda.    (3)

Consequently all endpoint measures below are ordinary bounded-vector spectral measures. No distributional endpoint evaluation is taken after a limiting operation.

For reference, the rank-two derivative is

    K_c'=(|v_c><v_c|+|conjugate(v_c)><conjugate(v_c)|)/(2pi).

Parity of each real psi_n yields the exact Hellmann--Feynman formulas

    d_c kappa_n=|<psi_n,v_c>|^2/pi,
    d_c log kappa_n=2|psi_n(1)|^2/c,
    d_lambda log kappa_n=4|e_n(lambda)|^2.             (4)

They may interpret the theorem as an endpoint-flow theorem, but their derivatives are not used to obtain an asymptotic measure.

## 2. Strong band-edge limit and its exactly uniform vector measure

On H,

    T_c:=M_c* K_c M_c=E*F*1_[-2c,0]FE -> A:=E*F*1_(-infinity,0)FE
                                                            (5)

strongly as c tends to infinity. This follows by dominated convergence of the full-line Fourier multipliers. Since T_c and A are self-adjoint contractions,

    f(T_c)->f(A) strongly for every f in C([0,1]).       (6)

Polynomial approximation proves (6), so it does not require norm convergence.

Let H_fin be the bounded finite Hilbert transform, initially on compactly supported smooth functions,

    H_fin f(x)=(1/pi) PV integral_-1^1 f(y)/(x-y)dy.

With the full-line Hilbert multiplier -i sign(xi),

    A=(I-i H_fin)/2.

The change x=tanh u defines a unitary V:H->L2(R,du),

    (Vf)(u)=sech(u) f(tanh u).

A direct kernel calculation gives

    V H_fin V*= convolution by PV[1/(pi sinh u)].

Its Fourier multiplier is -i tanh(pi xi/2). For example, expand 1/sinh u=2 sum_(j>=0)exp(-(2j+1)u) for u>0, pair the two half-lines, and use the partial-fraction expansion of tanh; equivalently integrate around a strip of height pi. Also the beta integral with t=exp(2u) gives

    F(sech)(xi)=sqrt(pi/2) sech(pi xi/2).

Thus VAV* is the multiplier

    a(xi)=(1-tanh(pi xi/2))/2=(1+exp(pi xi))^(-1),

and the vector V1=sech u has Fourier density (pi/2)sech^2(pi xi/2)d_xi. Since

    |a'(xi)|=(pi/4)sech^2(pi xi/2),

its pushforward to a in (0,1) is exactly 2 da. Hence

    <v_c,f(K_c)v_c> -> 2 integral_0^1 f(a)da.           (7)

This proves all full endpoint-weighted kappa moments, directly from a strong operator limit.

## 3. Positive Fourier phase has exactly one quarter of this measure

The three nonidentity terms in (2) vanish in the relevant bounded-vector spectral measures. This is not inferred from alternation of neighboring eigenvalues.

First, for g in C([0,1]),

    M_c* g(K_c)v_c=g(T_c)1 -> g(A)1 strongly.            (8)

For reflection,

    M_c* R v_c=exp(-2icx) -> 0 weakly in H,

by the Riemann--Lebesgue lemma (H embeds in L1 on this finite interval). Therefore <v_c,R g(K_c)v_c> tends to zero.

For the other two phases, the exact vectors are

    B_c* v_c(x)=sqrt(2/(pi c)) sin(c(1-x))/(1-x),
    B_c  v_c(x)=sqrt(2/(pi c)) sin(c(1+x))/(1+x).        (9)

Their L2 norms are at most sqrt(2), since ||B_c||<=1. For every fixed epsilon>0 the squared L2 mass of the first vector on x<=1-epsilon is at most 2/(pi c epsilon), and analogously the second is concentrated at x=-1. Multiplication by M_c* preserves these estimates. A uniformly bounded L2 family whose mass concentrates at a single endpoint tends weakly to zero: split against a fixed L2 test function into a sufficiently short endpoint interval and its complement. Thus

    M_c* B_c* v_c ->0 weakly, M_c* B_c v_c ->0 weakly.   (10)

Pairing (10) with (8) proves

    <v_c,B_c g(K_c)v_c> ->0,
    <v_c,B_c* g(K_c)v_c> ->0.                           (11)

If f vanishes on a neighborhood of 0, put g(a)=f(a)/sqrt(a), extending g by zero at 0. Then U_c f(K_c)=B_c g(K_c), and similarly for U_c*. Equations (2),(7),(11) give

    <v_c,P_ell,c f(K_c)v_c> -> (1/2) integral_0^1 f(a)da
                                                            (12)

for EVERY phase ell. To remove the cutoff, bound the omitted positive spectral mass by the full measure in (7) on a shrinking neighborhood of a=0, using continuous majorants. Its limiting mass tends to zero. This proves (12) for all f in C([0,1]), including f=1. No unbounded inverse of K_c was applied to v_c.

By (3), in particular,

    (1/lambda) sum_(chi_n>0) kappa_n |e_n(lambda)|^2 f(kappa_n)
        -> (1/2) integral_0^1 f(a)da.                  (13)

The four phase measures each have limiting total mass 1/2; the full measure has total mass exactly ||v_c||^2=2. For integer m>=0 the positive-class moment in (13), with f(a)=a^m, is 1/[2(m+1)]. In endpoint-flow notation this is

    (1/lambda) sum_(chi_n>0) (d_lambda kappa_n) f(kappa_n)
        -> 2 integral_0^1 f(a)da.

Thus the positive-sign splitting is proved without odd-power trace asymptotics or differentiated remainder estimates.

## 4. A simultaneous strong-resolvent limit identifies delta, without counting

Define the self-adjoint operator

    D_c=(2pi/c) M_c*(L_c-c^2)M_c.

On C_c^infinity(-1,1), with p(x)=1-x^2, its exact expression is

    D_c=-2pi i(2p d/dx+p') -(2pi/c) d/dx p d/dx.       (14)

The first-order part D_0=-2pi i(2p d/dx+p') satisfies

    V D_0 V*=-4pi i d/du                              (15)

on C_c^infinity(R). Hence D_0 is essentially self-adjoint on C_c^infinity(-1,1); denote its closure by D. Each fixed core vector obeys D_c f->D f in H. This implies D_c->D in strong resolvent sense. Here is the short proof, to fix domains: for f in that core and z=i,

    (D_c-i)^(-1)(D-i)f-f=(D_c-i)^(-1)(D-D_c)f ->0.

The vectors (D-i)f with f in the core are dense and all resolvents have norm at most 1, so convergence extends to all H. The same argument works at -i. Consequently h(D_c)->h(D) strongly for h in C0(R).

Because K_c and L_c share the prolate basis, T_c commutes spectrally with D_c. Products f(T_c)h(D_c) converge strongly to f(A)h(D). In the Fourier representation after V, D is multiplication by 4pi xi, while A is multiplication by

    kappa(4pi xi), kappa(delta)=(1+exp(delta/4))^(-1).   (16)

Thus their limiting joint spectral measure is supported on the exact logistic graph. This is a direct operator limit, not an assertion about differentiated prolate counts.

The same quarter-splitting proof applies to f(K_c)h((2pi/c)(L_c-c^2)): its demodulated action on v_c converges strongly, so it can be paired with the weak vectors above. Initially take f vanishing near zero, then remove the cutoff by the full kappa measure. The full delta spectral measure of v_c is tight: strong resolvent convergence gives C0 convergence, and the limiting measure has total mass ||V1||^2=2, equal to every finite-c measure. Each phase measure is dominated by this full positive measure. Product approximation on compact sets and this tightness establish the following joint weak convergence for every bounded continuous G on R x [0,1]:

    (1/lambda) sum_(phase chi_n=i^ell) kappa_n |e_n(lambda)|^2
                    G(delta_n,kappa_n)
      -> (1/8) integral_R kappa(delta)[1-kappa(delta)]
                    G(delta,kappa(delta))d_delta.      (17)

Indeed the full Fourier density is (pi/2)sech^2(pi xi/2)d_xi; substituting delta=4pi xi and multiplying by 1/4 gives

    (1/32)sech^2(delta/8)d_delta
      =kappa(delta)[1-kappa(delta)]d_delta/8.

All four phases have the same limiting joint measure. Equation (17) requires no Landau--Widom or action-count asymptotics at all.

## 5. The actual positive head and exact scope of the transfer

Let the physical positive head be chi_n>=1/2, equivalently phase +1 and kappa_n>=1/4. The limiting joint measure assigns zero mass to kappa=1/4. Therefore (17) also holds after inserting that sharp head cutoff, with delta restricted to

    delta<=delta_max=4log3.                             (18)

In particular, for bounded continuous b(delta),

    (1/lambda) sum_(chi_n>=1/2) chi_n^2 |e_n(lambda)|^2 b(delta_n)
      -> integral_(-infinity)^(4log3)
                   [kappa(1-kappa)/8] b(delta)d_delta. (19)

This proves exactly the weak endpoint measure previously left conditional in Section2 of ../repo_leverage/HARD_EDGE_LIMIT_MODEL_AND_CHANNEL_BESSEL.md. That historical source remains unchanged.

Two useful checks are

    (1/lambda) sum_(chi_n>=1/2) chi_n^2 |e_n(lambda)|^2 ->3/8,
    (1/lambda) sum_(chi_n>=1/2) |e_n(lambda)|^2 ->log2.   (20)

The second uses the bounded function 1/a on the selected interval [1/4,1]. Fixed negative-delta tails are controlled as positive measures; for example their limiting weighted mass for delta<=-D is 1/[2(1+exp(D/4))]. This is a sequential tightness statement, not a rate for D growing with lambda.

What is NOT obtained: any quantitative convergence rate, growing-delta moments, growing tau-collar control, growing-label operator-norm matching, replacement of a finite collar by an Abel half-line transform, source-trace repairs, the signed exceptional Schur estimate, or a global Weil floor. Weak scalar spectral-measure convergence plus fixed-compact modal shapes is not automatically a uniform operator estimate on the existing log^6(lambda) collar and log^8(lambda) label window.

The useful completed gate is narrower and exact: the normalization, positive-Fourier quarter weight, and differential/concentration logistic coupling in the endpoint measure no longer need to be hypotheses of that ideal model.
