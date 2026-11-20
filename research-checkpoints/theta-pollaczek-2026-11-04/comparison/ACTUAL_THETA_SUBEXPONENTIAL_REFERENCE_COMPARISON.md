# A two-sided all-degree comparison for the actual theta source norm

Date: 2026-11-04. Analytic derivation with an independent AI-assisted audit; not external peer review or machine formalization. This is a noncircular actual-theta estimate on every finite polynomial space. It gives an explicit family whose monic norm is within a subexponential factor of the selected minimum. It does not give relative near-optimality, selected derivative coherence, or RH.

## 1. Main results

Let F be the actual real even theta transform, c=pi/2,

    T p=F p'+2F'p,       X[p]=integral_R |Tp|²,
    W(t)=|Gamma(4+it/2)|²,      ||p||_W²=integral_R Wp².

There is a fixed C>0, independent of n and p, such that for every real polynomial p of degree at most n,

    exp[-C log²(n+2)] ||p||_W²
          <= X[p] <= C(n+1)||p||_W².                       (1)

Both sides retain the exact theta transform; this is not a replacement of its moment matrix by a scalar model. It requires no old or enlarged Q positivity and no inverse-gap estimate. The lower bound uses no selected polynomial information.

For the explicit monic Meixner–Pollaczek polynomial

    M_n(t)=n! P_n^(4)(t/2;pi/2),
    b_n=||M_n||_W²=(4pi/2^8)n!Gamma(n+8),

and the actual monic selected norm A_n, this gives

    exp[-C log²(n+2)] b_n <= A_n <= C b_n,                 (2)
    1 <= X[M_n]/A_n <= exp[C log²(n+2)].                   (3)

The upper estimate in (2) uses the sharper single-polynomial derivative calculation from POLLACZEK_MONIC_COMPARISON.md, rather than the general upper bound in (1). In particular,

    log A_n = 2n log n-2n+O(log²(n+2)).                    (4)

Thus the family is near-extremal at exponential scale, with a proved error exp[O(log² n)]. This is NOT a claim that X[M_n]/A_n tends to one or stays bounded.

If psi_0,...,psi_n are the W-orthonormal Pollaczek polynomials and G_n is their actual X Gram, then

    exp[-C log²(n+2)] I <= G_n <= C(n+1)I,
    kappa_2(G_n) <= exp[C log²(n+2)].                      (5)

The same subexponential condition-number bound holds after normalizing each polynomial individually in X, with a different constant C. Consequently this alternative hierarchy avoids the exp(const*n) conditioning obstruction proved for the monomial-carrier mesoscopic packets. It does not prove bounded conditioning.

Finally, the exact selected overlap of M_n satisfies

    theta_n(M_n)=A_n/X[M_n] >= exp[-C log²(n+2)],           (6)

and its normalized selected synthesis diagonal is at most exp[C log²(n+2)]. No absolute sum of selected coefficients is used to obtain these statements.

## 2. An elementary minimum-modulus lemma near the critical line

We first prove a uniform lower bound outside a very small exceptional set. Let

    f(s)=(s-1)zeta(s).

This is entire. For T>=0 center a disk at s_T=2+iT and use radii

    R=15/8,     r_2=7/4,     r_1=5/3.

The large disk lies in Re s>=1/8. Euler summation, with an integer cutoff comparable to T+3, gives a fixed polynomial bound

    max_(|s-s_T|<=R) |f(s)| <= C(T+3)^C.                  (7)

For example, the bound on the periodic-Bernoulli integral for Re s>=1/8, the finite sum, and the pole term after multiplying by s-1 give such a bound directly. On bounded T intervals continuity supplies the constant. This only needs Euler summation in a positive real-part strip, not a functional-equation estimate in a left half-plane. The cutoff is held fixed when bounding each disk.

The Euler product on Re s=2 gives

    |f(s_T)|=|1+iT| |zeta(2+iT)| >= 1/zeta(2)>0,          (8)

since |1/zeta(2+iT)|<=zeta(2). By Jensen's formula, the number N_T of zeros of f in |s-s_T|<=r_2, counted with multiplicity, is at most

    N_T <= C log(T+3).                                   (9)

Indeed every such zero contributes at least log(R/r_2)>0 to the Jensen sum, while (7)-(8) bound the total by Clog(T+3).

Write z=s-s_T, list these zeros as a_1,...,a_N, and factor

    h_T(z)=f(s_T+z)/product_(j=1)^N(z-a_j).

Removable singularities are removed. On |z|=R every factor has modulus at least R-r_2=1/8. The maximum principle and (7)-(9) therefore give

    log |h_T(z)| <= C log(T+3)       for |z|<=R.           (10)

Also, using |a_j|<=r_2 and (8),

    log |h_T(0)| >= -C log(T+3).                          (11)

The function h_T has no zeros in |z|<r_2. Apply Harnack to the nonnegative harmonic function Clog(T+3)-log|h_T(z)| on this disk. The factor on |z|<=r_1 is at most

    (r_2+r_1)/(r_2-r_1)=41.

Equations (10)-(11) yield

    log |h_T(z)| >= -C log(T+3)       for |z|<=r_1.        (12)

Hence, if |z|<=r_1 and |z-a_j|>=delta for every listed zero, where 0<delta<1,

    log |f(s_T+z)|
       >= -C log(T+3)[1+log(1/delta)].                    (13)

All constants are uniform in T and delta. Multiplicities are counted, so multiple zeros require no separate assumption.

## 3. Good real points on a degree-sized interval

Fix A=16/c. For an integer n>=1, put

    delta_n=(n+2)^(-6).

Cover 0<=t<=An+1 by unit intervals, using a center T at each midpoint. For a point s=1/2+it in one of those intervals,

    |s-(2+iT)| <= sqrt((3/2)²+(1/2)²)=sqrt(5/2)<5/3.

For that interval exclude real t lying within complex distance delta_n of a zero listed in section 2. Each zero removes an interval of length at most 2delta_n. Counting the O(n) unit intervals and their O(log(n+2)) zeros gives total excluded length at most

    C n log(n+2)(n+2)^(-6)=O(n^(-5)log(n+2)).             (14)

The same zero may be counted several times, which only increases this upper bound. Reflect the exceptional set to negative t, using conjugation symmetry. We obtain a good set E_n in [-An-1,An+1] whose complement has the same bound (14), and such that

    |zeta(1/2+it)| >= exp[-C log²(n+2)]   for t in E_n.   (15)

Dividing f by s-1 costs at most another O(log(n+2)) in the logarithm. This is absorbed by the displayed bound. The statement is unconditional: all nearby zeta zeros, not merely zeros on the critical line, are included in the exclusion.

## 4. Source evaluation at good points

The exact gamma factorization is F(t)=sigma a(t)Z(t), with |Z(t)|=|zeta(1/2+it)| and

    a(t)² asy (1+|t|)^(7/2) exp(-c|t|),

uniformly on the whole real line after adjusting the positive constants. Therefore (15) gives

    |F(t)|^4 >= C^(-1)(1+|t|)^7 exp(-2c|t|)
                              exp[-C log²(n+2)]
                   for t in E_n.                         (16)

The previously proved majorant F²+F'²<=CW and Stirling give the one-sided tail estimate

    integral_(t)^infinity F(s)²ds <= C(1+t)^7 exp(-ct),   t>=0,

with the reflected left-tail estimate for t<=0.

For every polynomial p, exponential decay and the exact identity

    (F²p)'=F Tp

give

    F(t)²p(t)=-integral_t^infinity F(s)Tp(s)ds      if t>=0,
    F(t)²p(t)= integral_(-infinity)^t F(s)Tp(s)ds   if t<=0.

Cauchy–Schwarz, (16), and the appropriate right or left tail imply

    X[p] >= exp[-C log²(n+2)] exp(-c|t|)|p(t)|²
                       for every t in E_n.              (17)

The polynomial (1+|t|)^7 factors in the tail and in (16) cancel. Constants are absorbed into C. We do not divide through a real zero: every point used in E_n has the explicit nonzero lower bound (15). The original source norm and primitive identity include all zeros normally.

## 5. Capturing a weighted polynomial maximum at a good point

Define

    M_c(p)=sup_(t in R) exp(-c|t|/2)|p(t)|.

For nonzero p this finite maximum is attained. We first show that a maximizing point can be found in [-An,An], uniformly for deg p<=n.

Set B=An/2=8n/c. The elementary Chebyshev exterior inequality gives, for |t|>=B,

    |p(t)| <= (2|t|/B)^n sup_(|s|<=B)|p(s)|.

Since the latter supremum is at most exp(cB/2)M_c(p), for |t|>=2B=An,

    exp(-c|t|/2)|p(t)|/M_c(p)
        <= exp[cB/2+nlog(2|t|/B)-c|t|/2].                (18)

At |t|=2B the exponent is nlog4-4n<0. Its derivative in |t| is n/|t|-c/2<0 beyond 2B. Thus the global maximum cannot occur beyond An.

Let t_* be a maximizing point in [-An,An]. On J=[t_*-1,t_*+1],

    sup_J |p| <= exp[c(|t_*|+1)/2] M_c(p).

The ordinary Markov inequality on this interval, whose length is 2, yields

    sup_J |p'| <= n² exp[c(|t_*|+1)/2] M_c(p).

Consequently for

    |t-t_*| <= d_n:=1/[4 exp(c/2)n²],

we have

    |p(t)| >= (3/4)|p(t_*)|,
    exp(-c|t|)|p(t)|² >= C^(-1)M_c(p)².                 (19)

For sufficiently large n the whole excluded measure in (14) is smaller than d_n. The interval [t_*-d_n,t_*+d_n] therefore contains a good point t in E_n, and it lies inside [-An-1,An+1]. Apply (17)-(19):

    X[p] >= exp[-C log²(n+2)] M_c(p)².                  (20)

The constants are independent of p. This is the essential reason that tiny exceptional neighborhoods of zeta zeros do not defeat the finite-degree lower estimate.

## 6. Comparing the reference norm to the weighted maximum

Stirling and positivity of Gamma imply

    W(t) asy (1+|t|)^7 exp(-c|t|).

On [-An,An], the integral Wp² is therefore at most C(n+1)^8 M_c(p)². Beyond An, use (18). Its exponent at An is -(4-log4)n, and its derivative is at most -7c/16. Thus the squared weighted polynomial tail decreases exponentially in |t|-An, with an additional exponential factor in n. Integrating the polynomial weight gives

    ||p||_W² <= C(n+1)^8 M_c(p)².                       (21)

Together (20)-(21) prove the lower half of (1), after absorbing the power of n into exp[C log²(n+2)]. No arithmetic averaging or unproved selected localization is used.

## 7. General upper estimate without absolute synthesis sums

Let psi_j=Q_j/sqrt(h_j), with Q_j=P_j^(4)(t/2;pi/2) and h_j=||Q_j||_W². The exact orthogonal derivative calculation in the companion note gives

    ||psi_j'||_W² <= pi²/8.

The derivative map on degree-at-most-n polynomials has Hilbert–Schmidt norm squared

    sum_(j=0)^n ||psi_j'||_W² <= (n+1)pi²/8.

Its operator norm is at most its Hilbert–Schmidt norm. Hence for arbitrary p of degree at most n,

    ||p'||_W² <= [(n+1)pi²/8]||p||_W².

Use the actual pointwise majorant and the positive-source square inequality:

    X[p] <= C_0[2||p'||_W²+8||p||_W²]
          <= C(n+1)||p||_W².

This proves the upper half of (1). This step uses an orthogonal quadratic norm and the finite-dimensional Hilbert–Schmidt estimate, not a sum of absolute selected synthesis coefficients.

For the finitely many small degrees not already covered by the good-point argument, enlarge C. Such an enlargement exists because X and the W norm are positive definite on each finite polynomial space. Positivity of X follows directly: Tp=0 implies (F²p)'=0, exponential decay makes the constant zero, and analyticity forces p=0. No old-prefix Q condition is being supplied here.

## 8. Selected minimum, actual conditioning, and exact limitations

For any monic p of degree n, ordinary W orthogonality gives ||p||_W²>=b_n. The lower half of (1) therefore gives A_n>=exp[-Clog²(n+2)]b_n. The companion note's explicit competitor gives A_n<=X[M_n]<=Cb_n, proving (2)-(4).

Equation (1) in the W-orthonormal coordinates is exactly the matrix inequality (5). To individually X-normalize these coordinates, write d_j=X[psi_j]. The companion single-polynomial bound gives d_j<=C uniformly in j, while (1) gives d_j>=exp[-Clog²(n+2)] for j<=n. Diagonal congruence consequently preserves a condition-number bound of the form exp[Clog²(n+2)], after adjusting C.

The exact selected-overlap identity gives (6). In the triangular X-normalized Pollaczek hierarchy, the selected diagonal synthesis coefficient is theta_n(M_n)^(-1/2), so it grows at most exp[Clog²(n+2)]. More generally, if q_n=P_n/sqrt(A_n) is expanded in the W-orthonormal basis, the sum of squared coefficients is exactly ||q_n||_W² and is at most exp[Clog²(n+2)] by (1). These are genuine quadratic, cancellation-sensitive estimates.

The loss remains far too large to infer H[P_n]/A_n->0 or U_n/Delta_n->0. In particular, (4) is not a strong adjacent-determinant asymptotic, (3) is not relative near-optimality, and (5) is not uniform conditioning. Ordinary algebraic scalar moment errors cannot simply be declared harmless under an exp[Clog² n] inverse bound. A favorable H/X estimate for the Pollaczek family itself is also not proved here.

Nevertheless the estimate does identify a concrete actual-theta hierarchy with a rigorously better conditioning scale than the exponentially singular mesoscopic packet hierarchy. It supplies a noncircular near-extremal starting family at exponential scale and a precise quantitative bound on its actual Gram geometry, rather than merely assuming the missing synthesis property.

## Inputs, source scope, and preservation

The classical tools used are Euler summation for zeta (NIST DLMF 25.2.8), the Euler product in Re s>1, Jensen's formula, Harnack's inequality, Markov's polynomial inequality, the Chebyshev exterior inequality, and the Pollaczek formulas already verified in the companion audit. The minimum-modulus and finite-degree comparison arguments above are supplied in full; no unquoted specialized minimum-modulus theorem is required.

- https://dlmf.nist.gov/25.2
- https://dlmf.nist.gov/18.19
- https://dlmf.nist.gov/18.23

The exact theta factorization and exponential tails are inherited from the frozen supplied checkpoints. No RH, real-zero simplicity, zero-spacing bound, enlarged positivity, or inverse-gap input is used. No numerical degree scan is used, and no literature-novelty claim is made.

This is AI-assisted analysis, not a machine-formalized proof or external peer review. No prior frozen file or live 4CT script was edited.
