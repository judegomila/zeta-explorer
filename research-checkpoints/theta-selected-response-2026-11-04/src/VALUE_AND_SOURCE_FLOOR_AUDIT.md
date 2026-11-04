# Independent audit of the actual-theta value and source floors

2026-11-04. Analytical audit of the two working proofs:

- `VALUE_FORM_FLOOR_AND_SELECTED_RESPONSE_LOWER_BOUND.md`
- `IMPROVED_SOURCE_FLOOR_BY_SHIFTED_L2_HARDY.md`

## Verdict

Both revised proofs pass. With N=n+2 and L=log N, their uniform exponents are:

    W[p] >= c N^(-1/2)L^(-5/2)||p||_(W_*)^2,
    h_n >= c N^(-1/2)L^(-11/2),                      n>=1,
    X[p] >= c N^(-1/2)L^(-13/2)||p||_(W_*)^2.

For every fixed a>1/2 the stronger-in-logarithm fixed-parameter floors W[p], X[p]>=c_a(NL)^(-a)||p||_(W_*)^2 also hold. All constants in these fixed-parameter assertions may depend on a.

The source floor and the natural derivative trace bound give kappa_(n,M)<=C_a(NL)^(1+a). At the requested scale s_n=N^(-2)L^(-7/4), the choice a=3/4 yields

    {[a_(n,M)(s_n)-1]/s_n}/h_(n,M)=1+O(N^(-1/4)).

The finite selected response has the actual lower bound

    [a_(n,M)(s_n)-1]/s_n >= c N^(-1/2)L^(-11/2).

These statements retain complete selection and the exact source and derivative forms. They establish neither h_n->0 nor its negation. In particular they do not settle the desired upper response a_(n,M)(s_n)=1+o(s_n), selected coherence, a signed-form theorem, or RH.

## 1. Fourier shifts and absence of circularity

For the value norm W[p]=||Fp||_2^2, choose one fixed compact interval on which F is bounded away from zero. This only uses that F is a nonzero entire function. Fixed-interval Legendre coefficient estimates give

    sum |b_k|<=exp(CN)sqrt(W[p]).

Together with the exact theta Cauchy derivative bound, this gives a value-relative inverse-transform estimate

    |f_p(u)|<=sqrt(W[p])exp(CNlogN)exp[-d exp(2|u|)].

The source-relative analogue is already proved independently in Section 2 of `GENERAL_REFERENCE_AND_NATURAL_COROLLARIES.md`, using its preliminary W_4 source comparison rather than the new source floor. Its inverse transform is the exact source expression, not the value transform.

For either estimate, choose R_n=(1/2)log(NlogN)+K. On the central interval the weighted L2 cost is C(NL)^a. On the tails the double exponential dominates exp(CNlogN) once K is a sufficiently large fixed constant. The same K works for a in [1/2,3/4] by taking the largest weight exponent on the tails. Plancherel therefore gives, with a degree-independent constant uniform in that parameter interval,

    ||F(.-ia)p(.-ia)||_2^2 <= C(NL)^a W[p],
    ||(Tp)(.-ia)||_2^2 <= C(NL)^a X[p].

Double-exponential tails justify the shifted Fourier identities. No improved floor is used in proving its own shift estimate.

## 2. Uniform Euler envelope with pole cancellation

Let a=1/2+delta, sigma=1+delta, 0<delta<=1/4, and s=sigma+it. Euler products give

    |zeta(s)|>=1/zeta(sigma)>=c delta,
    |zeta(s)|<=zeta(sigma)<=C/delta.

The lower envelope must retain the cancellation in g(s)=(s-1)zeta(s). This function is analytic near 1 with g(1)=1, so a fixed disk |s-1|<=r has |g(s)|>=1/2. Outside that disk,

    |s-1|>=c_r(1+|t|),

and Euler's lower bound implies |g(s)|>=c delta(1+|t|). Inside the disk the same weaker inequality follows from |g|>=1/2. Thus this inequality is global on the shifted line. Combining it with |s|>=c(1+|t|), the exact xi factors, and uniform Stirling yields

    c delta^2 v_a(t) <= |F(t-ia)|^2 <= C delta^(-2)v_a(t),
    v_a(t)=(1+|t|)^(a+7/2)exp(-pi|t|/2).                    (1)

The lower loss is delta^2, not delta^4. All constants are uniform for the specified delta interval. This uses only local removal of the known pole at s=1 and Euler-product nonvanishing in Re(s)>1. It does not assume a zero-free theorem on the remainder of Re(s)=1, and no line at delta=0 is used.

## 3. L2 strip transfer

For q=a+7/2 and b=2, the multiplier

    m_a(z)=(z^2+4)^(q/4)exp[-(pi/4)sqrt(z^2+4)]

is analytic and nonzero in a fixed strip wider than |Im z|<=3/4. The principal branches respect conjugation. Its squared modulus is comparable to v_a(x), uniformly for |y|<=a and a in [1/2,3/4]. At large |x| this is the uniform elementary square-root asymptotic; on bounded x it is compactness with no zero of the multiplier.

For a real polynomial p, let I(y)=integral|p(x+iy)m_a(x+iy)|^2dx. Exponential horizontal decay justifies

    I''(y)=4 integral |(p m_a)'(x+iy)|^2dx>=0.

Also I(-y)=I(y), so I(0)<=I(-a). Since W_*(x)<=C v_a(x),

    ||p||_(W_*)^2 <= C integral v_a(t)|p(t-ia)|^2dt.          (2)

The constants are degree-independent and uniform in the compact parameter range. Evenness is asserted only for real coefficients. The final real-line norm inequalities extend to complex p by splitting its real and imaginary coefficient parts.

Combine (2), the lower envelope in (1), and the value shift to get

    W[p]>=c delta^2(NL)^(-1/2-delta)||p||_(W_*)^2.

Choose delta=1/log(NL) once this is <=1/4. Then (NL)^(-delta)=exp(-1), and log(NL) is comparable to L. This proves the value exponent 5/2. A fixed allowed delta handles the finite initial degree range.

## 4. Shifted Hardy control proves the new source floor

Put F_a(t)=F(t-ia), p_a(t)=p(t-ia), and g_a(t)=(Tp)(t-ia). On this line F_a has no zeros because the corresponding xi variable has real part greater than one. The exact identity

    (F_a^2p_a)'=F_a g_a

has zero endpoint values at both infinities. For t>=0 integrate to positive infinity; for t<=0 integrate to negative infinity. For fixed a>1/2 the two-sided envelope |F_a|^2 comparable_a v_a gives

    |F_a(t)p_a(t)|
       <=C_a integral_0^infinity K_a(u)|g_a(t+u)|du,
    K_a(u)=(1+u)^((a+7/2)/2)exp(-pi u/4),

on the positive half-line, and the reflected version on the negative half-line. The kernel is in L1(0,infinity). Young's inequality after zero extension of each half-line therefore proves

    ||F_a p_a||_2^2<=C_a||g_a||_2^2.

This justifies the asserted Hardy inverse explicitly, including both endpoint choices. There is no division by F on the real axis and no singular integral through a real theta zero. The fixed-a strip transfer and source shift now prove

    X[p]>=c_a(NL)^(-a)||p||_(W_*)^2.

For uniform endpoint bookkeeping it is more direct to estimate sqrt(v_a)|p_a|. The primitive and (1) give, on either half-line,

    sqrt(v_a(t))|p_a(t)|
       <=C delta^(-3) integral_0^infinity K_a(u)|g_a(t+u)|du.   (3)

The loss is delta^(-2) from |F_a(t)|^(-2), times delta^(-1) from |F_a(s)| inside the integral. The L1 kernel norms are uniformly bounded for a in [1/2,3/4]. Squaring the L2 norm estimate in (3) costs delta^(-6). The strip comparison (2) adds no extra Euler factor. Therefore

    ||p||_(W_*)^2<=C delta^(-6)(NL)^(1/2+delta)X[p].

The same delta choice proves the source exponent 6+1/2=13/2. Thus the revised delta^(-6) bookkeeping is correct. A delta^(-10) cost belonged to the weaker pre-pole-cancellation envelope and is no longer needed.

## 5. Selected lower bound and relative secant

Let b_n^*=(4pi/2^(9/2))n!Gamma(n+9/2) be the monic reference minimum. For every monic degree-n polynomial P,

    H[P]=W[P']>=cN^(-1/2)L^(-5/2)n^2 b_(n-1)^*.

The exact ratio n^2 b_(n-1)^*/b_n^*=n/(n+7/2) is bounded below for n>=1. For the actual fully source-selected P_n, complete monic minimality and the supplied natural trial upper give A_n<=Cb_n^*L^3. Division gives

    h_n>=cN^(-1/2)L^(-11/2).

This uses the natural trial only to bound A_n from above, never as a substitute selected polynomial. It also applies in both complete parity spaces.

The natural-family derivative diagonal bound and positivity imply

    H[p]<=CNL||p||_(W_*)^2.

Combining it with the fixed-a source floor gives kappa_n<=C_a(NL)^(1+a). The exact finite-model relative approximation preserves this bound, and its selected-ratio error exp(-cNlogN) is negligible relative to the preceding selected lower bound. At s_n=N^(-2)L^(-7/4), a=3/4 gives s_n kappa_(n,M)=O(N^(-1/4)). The exact selected Stieltjes inequality implies

    h_(n,M)/(1+s_n kappa_(n,M))
       <=[a_(n,M)(s_n)-1]/s_n<=h_(n,M).

Since the selected ratio is positive for sufficiently large n by the transferred lower bound, division proves the claimed relative secant estimate. This is an analytic consequence of the new source floor, not a restatement that supplies selected decay.

The optional uniform source floor also gives the valid sharper asymptotic remainder

    kappa_(n,M)<=CN^(3/2)L^(15/2),
    {[a_(n,M)(s_n)-1]/s_n}/h_(n,M)
         =1+O(N^(-1/2)L^(23/4)).

The fixed-a O(N^(-1/4)) conclusion stated in the main supplement is already sufficient and correct.

## 6. Uniform natural-coordinate corollaries

The appended Section 6 of the source supplement also passes. In W_*-orthonormal coordinates, the uniform source floor is lambda_min(G_n)>=cN^(-1/2)L^(-13/2). The natural source diagonal bound gives lambda_max(G_n)<=trace(G_n)<=CNL^3, so

    cond_2(G_n)<=CN^(3/2)L^(19/2).

The corresponding derivative trace CNL gives kappa_n<=CN^(3/2)L^(15/2), consistently with the relative-secant calculation above. Applying the source floor to every monic polynomial and then taking the source minimum proves

    A_n>=c b_n^*N^(-1/2)L^(-13/2).

Dividing by X[M_n^*]<=Cb_n^*L^3 yields the stated natural-trial overlap lower bound cN^(-1/2)L^(-19/2). This bound tends to zero and supplies no relative near-minimality or selected derivative decay.

Finally, |h_(n,M)-h_n|<=exp(-cNlogN) together with h_n>=cN^(-1/2)L^(-11/2) shows h_(n,M)/h_n=1+exp(-c'NlogN) after decreasing c'>0. Hence the exact h_n may replace h_(n,M) in the relative secant formula without changing its displayed polynomial-logarithmic remainder.

## Limits and verification scope

No numerical computation enters the audit. The real zeros of F remain in every actual form. The only real-axis nonvanishing set used is one fixed interval for coefficient control. All boundary-line divisions occur strictly in Re(s)>1. Small degrees are treated by one fixed shift; n=0 is excluded only from the positive derivative-ratio lower bound.

The finite transfer uses the stipulated exact piecewise-derivative model, with every arithmetic cross term and finite boundary correction retained. The results do not prove a sign for the selected defect, derivative coherence, or the still-open upper determinant response.
