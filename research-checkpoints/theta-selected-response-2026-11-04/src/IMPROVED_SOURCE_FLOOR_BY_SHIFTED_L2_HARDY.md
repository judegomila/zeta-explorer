# A stronger actual-source floor from shifted L2 Hardy control

2026-11-04. Supplement to VALUE_FORM_FLOOR_AND_SELECTED_RESPONSE_LOWER_BOUND.md. This is independent of its determinant lower-bound proof. It establishes no selected derivative decay.

## Statement

For every fixed a>1/2, the actual theta source obeys, for all polynomials of degree at most n,

    X[p] >= c_a [(n+2)log(n+2)]^(-a) ||p||_(W_*)^2,
    W_*(t)=|Gamma(9/4+it/2)|^2.                            (1)

Thus one can use a=1/2+epsilon for any fixed epsilon>0. This improves the earlier natural-reference floor c N^(-1)L^(-3/4), though constants depend on epsilon. No endpoint a=1/2 is asserted in (1).

## 1. Source shift

The already proved exact theta-source cutoff gives, for every fixed a>0,

    ||(Tp)(.-ia)||_2^2 <= C_a (N log N)^a X[p].             (2)

Here (Tp)(z)=F(z)p'(z)+2F'(z)p(z). This is Section 2, equation (4), of the earlier GENERAL_REFERENCE_AND_NATURAL_COROLLARIES.md. It was proved independently of its subsequent natural-reference comparison, using the earlier W_4 source comparison to control coefficients and theta's double-exponential derivative tails. There is therefore no circular use of the improved claim (1).

## 2. A bounded inverse on each shifted half-line

Write F_a(t)=F(t-ia), p_a(t)=p(t-ia), and g_a(t)=(Tp)(t-ia). Since a>1/2, F_a never vanishes. The Euler product and Stirling give

    |F_a(t)|^2 comparable_a v(t),
    v(t)=(1+|t|)^q exp(-c|t|), q=a+7/2, c=pi/2.

The exact primitive identity is

    (F_a^2 p_a)'=F_a g_a.

Its endpoint value is zero at both infinities. On t>=0 integrate toward positive infinity:

    |F_a(t)p_a(t)|
       <= C_a v(t)^(-1/2) integral_t^infinity
                                      v(s)^(1/2)|g_a(s)| ds
       <= C_a integral_0^infinity
           (1+u)^(q/2) exp(-cu/2)|g_a(t+u)| du.             (3)

The last kernel belongs to L1(0,infinity). Young's inequality, after extending the positive-half-line function by zero, proves

    ||F_a p_a||_(L2(0,infinity)) <= C_a ||g_a||_(L2(0,infinity)).

Integrating toward negative infinity and reflecting gives the same estimate on the negative half-line. Thus

    ||F_a p_a||_2^2 <= C_a ||g_a||_2^2.                    (4)

This is a weighted Hardy estimate with its kernel and boundedness explicitly verified. It divides by F only on the zero-free shifted line. It does not form singular real-axis primitives at the real theta zeros.

## 3. Transfer the weighted polynomial norm through the strip

For real p, Section 3 of the accompanying value-form note proves, using an analytic nonzero multiplier and even convexity of its horizontal L2 norm, that

    ||p||_(W_*)^2 <= C_a ||F_a p_a||_2^2.                  (5)

This shifted-line inequality is used only for real p; no conjugation symmetry is asserted for a general complex-coefficient polynomial. After proving the final real-axis comparison (1), complex p follows by splitting its real and imaginary coefficient parts.

Combine (5), (4), and (2) to obtain

    ||p||_(W_*)^2 <= C_a (N log N)^a X[p],

which proves (1) for real p and then for complex p by the splitting just described. All arithmetic and all real zeros are retained.

## 4. A sharper relative derivative norm

The supplied natural-family derivative diagonal bound is

    H[Q_j] <= C ||Q_j||_(W_*)^2 log(j+2).

In the W_*-orthonormal natural basis, the finite positive H Gram therefore has trace at most C N log N. Positivity bounds its operator norm by this trace, hence for every degree-at-most-n polynomial,

    H[p] <= C N log N ||p||_(W_*)^2.

Combining with (1) gives the independent all-vector bound

    H[p] <= C_a (N log N)^(1+a) X[p].                     (6)

The exact finite-model source-relative approximation preserves (6), up to the superexponentially small errors already audited.

At the requested scale s_n=N^(-2)L^(-7/4), choose any fixed a in (1/2,1), for example a=3/4. Then

    s_n kappa_(n,M) <= C_a N^(a-1)L^(a-3/4) ->0.

For a=3/4 this is O(N^(-1/4)). The exact selected Stieltjes inequalities consequently sharpen to

    h_(n,M)/(1+O(N^(-1/4)))
       <= [a_(n,M)(s_n)-1]/s_n <= h_(n,M).

For n>=1 and sufficiently large n the companion lower bound makes h_(n,M)>0, so this is the relative estimate

    {[a_(n,M)(s_n)-1]/s_n}/h_(n,M)=1+O(N^(-1/4)).

This sharper secant comparison is a consequence of a new all-vector source floor, not a proof that either selected quantity tends to zero. The independent selected determinant lower bound is proved in the companion note.

## 5. Optional uniform endpoint bookkeeping

If one wants a uniform polynomial-logarithmic version rather than fixed-a bounds, let a=1/2+delta, 0<delta<=1/4. The pole-cancelled Euler envelope proved in Section 3A of the companion value-form note, together with the elementary Euler-product upper bound, gives

    c delta^2 v(t) <= |F_a(t)|^2 <= C delta^(-2)v(t).

For the direct bound on v(t)^(1/2)|p_a(t)|, the primitive has cost delta^(-2) from |F_a(t)|^(-2) and delta^(-1) from |F_a(s)|. Thus its norm bound costs delta^(-3), and its squared bound delta^(-6). The L2 strip comparison can be made directly to v(t)|p_a(t)|^2 without additional Euler-product cost. Uniform cutoff and kernel constants then give

    ||p||_(W_*)^2 <= C delta^(-6)(N log N)^(1/2+delta) X[p].

Choosing delta=1/log(N log N), with small degrees absorbed separately, yields

    X[p] >= c N^(-1/2)L^(-13/2)||p||_(W_*)^2.

This last estimate has a worse logarithmic factor than the fixed-a alternatives at moderate degree. It is recorded only to keep the uniform constants explicit. It is not needed for the selected response lower bound, which uses the stronger value-form floor with delta^(-2). The pole-cancellation argument uses only analyticity of (s-1)zeta(s) and its value 1 at s=1, not a zero-free-boundary theorem or RH.

## 6. Uniform natural-coordinate consequences

The uniform source floor also gives, in the W_*-orthonormal natural basis,

    lambda_min(G_n) >= c N^(-1/2)L^(-13/2).

The independently audited natural trial diagonal bound gives
lambda_max(G_n)<=trace(G_n)<=C N L^3. Therefore

    cond_2(G_n) <= C N^(3/2)L^(19/2),
    H[p]/X[p] <= C N^(3/2)L^(15/2).

The second bound uses the derivative trace C N L from Section 4. Complete monic minimality in the reference norm implies

    A_n >= c b_n^* N^(-1/2)L^(-13/2).

Together with X[M_n^*]<=C b_n^* L^3, the exact selected overlap of the natural trial obeys

    A_n/X[M_n^*] >= c N^(-1/2)L^(-19/2).

These are additional consequences of the proved source floor, not upper bounds tending to zero for the selected derivative ratio. The overlap lower bound still tends to zero and is not relative near-minimality. No earlier frozen estimate is invalidated: the new bounds improve its degree dependence asymptotically, with different logarithmic factors.

At the same prescribed s_n, the uniform endpoint operator bound sharpens the relative secant error further to

    [a_(n,M)(s_n)-1]/[s_n h_(n,M)]
        = 1+O(N^(-1/2)L^(23/4)).

Indeed s_n kappa_(n,M)<=C N^(-1/2)L^(15/2-7/4). This tends to zero and is asymptotically stronger than the simpler fixed-a bound. The selected lower bound in the companion note makes the finite-to-exact ratio error superexponentially small even after division by h_n, so h_(n,M) can also be replaced by the exact h_n in this last formula. This remains a relative comparison, not a proof of h_n->0.
