# A value-form floor and an all-degree selected-response lower bound

2026-11-04. New actual-theta analytic estimate. All theta arithmetic and the complete monic selection are retained. This is an obstruction to excessively fast selected response, not a proof or disproof of response `1+o(s)`.

## 1. Result

Let F be the exact real even theta transform, set

    W[p] = integral_R F(t)^2 |p(t)|^2 dt,
    H[p] = integral_R F(t)^2 |p'(t)|^2 dt,
    X[p] = integral_R |F(t)p'(t)+2F'(t)p(t)|^2 dt,
    W_*(t) = |Gamma(9/4+it/2)|^2.

For every fixed a>1/2 there is c_a>0 such that every polynomial of degree at most n satisfies, with N=n+2 and L=log N,

    W[p] >= c_a (N L)^(-a) ||p||_(W_*)^2.                  (1)

A uniform parameter choice additionally gives the explicit bound

    W[p] >= c N^(-1/2) L^(-5/2) ||p||_(W_*)^2.             (1u)

This is a degree-dependent quadratic-form comparison, not a pointwise bound for F^2. The real zeros of F remain present.

Let P_n be the actual fully selected monic polynomial for X, let A_n=X[P_n], and let h_n=H[P_n]/A_n. Using the already audited arithmetic natural-trial upper bound gives, for n>=1,

    h_n >= c_a N^(-a) L^(-a-3),                            (2)
    h_n >= c N^(-1/2) L^(-11/2).                           (2u)

Let X_M,H_M be precisely the piecewise-derivative finite model in the supplied finite-arithmetic reduction, with all m,l cross terms and its boundary corrections. Choose M=ceil(K sqrt(N log N)) with K sufficiently large for the stated superexponential approximation. Put

    s_n=N^(-2)L^(-7/4),
    a_(n,M)(s)=A_n(X_M+sH_M)/A_n(X_M).

Then for all sufficiently large n,

    a_(n,M)(s_n)-1 >= c_a s_n N^(-a)L^(-a-3),              (3)
    a_(n,M)(s_n)-1 >= c s_n N^(-1/2)L^(-11/2).             (3u)

In particular, for every p>1/2 there is no constant C with

    a_(n,M)(s_n)-1 <= C s_n N^(-p)

at every sufficiently large degree, whether all degrees or either fixed parity are considered. Indeed choose a strictly between 1/2 and p. The lower bound in (3) divided by s_n N^(-p) tends to infinity.

The desired estimate `a_(n,M)(s_n)=1+o(s_n)` remains consistent with (3): the new lower bound tends to zero after division by s_n. This note provides no matching upper bound and no selected sign, coherence or RH conclusion.

## 2. Fourier cutoff relative to the value norm itself

Use the exact Fourier convention

    F(t)=integral_R psi(u) exp(-itu) du.

The supplied theta derivative estimate gives, for fixed rho in (0,pi/4),

    |psi^(k)(u)| <= C k! rho^(-k) exp[-d exp(2|u|)]         (4)

for all k>=0 and real u. Constants do not depend on k or u. This is the exact infinite theta kernel, not a reflected finite cutoff.

Choose once and for all a compact nondegenerate real interval I on which F has no zeros. This is possible since F is a nonzero entire function. Since min_I |F|>0,

    ||p||_(L2(I)) <= C sqrt(W[p]).

Expansion in shifted/scaled Legendre polynomials on this fixed interval gives, for p(t)=sum_(k<=n)b_k t^k,

    sum_(k<=n)|b_k| <= exp(CN) sqrt(W[p]).                 (5)

The fixed interval need not contain the origin. Translation and scaling change the exponential coefficient constant only. Explicit Legendre coefficient formulas, followed by Cauchy-Schwarz in the expansion, prove (5).

The inverse Fourier transform of Fp is

    f_p=sum_(k<=n)b_k(-i)^k psi^(k).

Equations (4)-(5) and k!<=n! imply

    |f_p(u)| <= sqrt(W[p]) exp(CN log N)
                             exp[-d exp(2|u|)].           (6)

Also, exactly,

    2pi ||f_p||_2^2=W[p].

Fix a>0 and put

    R_n=(1/2)log(N log N)+K_a.

Choose fixed K_a large enough that the double exponential in the squared bound (6) dominates its coefficient factor for |u|>R_n. The central interval costs at most exp(2aR_n)=C_a(N log N)^a. The remaining weighted tail is bounded by C_a W[p], since substituting v=exp(2|u|) in (6) gives an exponentially small incomplete-gamma tail once exp(2R_n) is a sufficiently large multiple of N log N. Thus

    integral_R exp(2a|u|)|f_p(u)|^2 du
        <= C_a (N log N)^a W[p].                         (7)

Double-exponential decay makes the Fourier integral of f_p entire and equal to Fp there by analytic uniqueness. Shifted Plancherel therefore gives

    integral_R |F(t-ia)p(t-ia)|^2 dt
        <= C_a (N log N)^a W[p].                         (8)

The argument also works for complex polynomial coefficients. It does not import a source-relative coefficient estimate or substitute X[p] for W[p]. This separation is essential to the derivative-minimum application below.

## 3. An L2 strip comparison, with no degree loss

Now fix a>1/2. On z=t-ia, the xi variable is s=1/2+a+it, whose real part exceeds one. The Euler product and Stirling give

    |F(t-ia)|^2 comparable_a
       (1+|t|)^(a+7/2) exp(-pi|t|/2).                    (9)

On bounded t this follows from continuity and nonvanishing; on large t it is the direct gamma asymptotic and uniform upper/lower Euler-product bounds. Constants can depend on a. No uniform assertion as a decreases to 1/2 is made.

Put q=a+7/2, c=pi/2 and choose b>a. On the closed strip |Im z|<=a define

    m(z)=(z^2+b^2)^(q/4) exp[-(c/2)sqrt(z^2+b^2)],

using the analytic principal logarithm and square root. They exist on a slightly larger strip because Re(z^2+b^2)>0 there. Uniformly on |y|<=a,

    |m(x+iy)|^2 comparable_(a,b,q)
        (1+|x|)^q exp(-c|x|).                            (10)

For a real polynomial p let h(z)=p(z)m(z) and I(y)=integral_R |h(x+iy)|^2 dx. The function h and its fixed derivatives decay exponentially in |x|, up to polynomial factors. Differentiation and integration by parts are legitimate and give

    I''(y)=4 integral_R |h'(x+iy)|^2 dx >=0.              (11)

The chosen branches respect conjugation. Therefore I(-y)=I(y), and convexity gives

    I(0)<=I(a)=I(-a).                                    (12)

This is the L2 replacement for a weighted supremum estimate followed by a degree-sized restricted-range integral. In particular, no extra power of N is lost.

Since W_*(t) is comparable to (1+|t|)^(7/2)exp(-c|t|), while q=7/2+a>7/2, equations (9)-(12) imply

    ||p||_(W_*)^2
       <= C_a integral_R |F(t-ia)p(t-ia)|^2 dt.           (13)

Combining (13) with (8) proves (1) for real p. For complex p split into real and imaginary coefficient parts; both W and the reference norm are sums of the corresponding real quadratic forms. The resulting bound is unchanged.

## 3A. Uniform approach to the zero-free boundary

The constants in the cutoff estimate (8) can be chosen uniformly for a in [1/2,3/4]. Indeed the coefficient estimate is independent of a, the central cost remains exactly (N log N)^a times a bounded factor, and the tail is bounded using the largest a=3/4 with one fixed K. Choose b=2 for the multiplier. Its q=a+7/2 ranges over [4,17/4], so all multiplier comparisons are uniform as well.

Put a=1/2+delta, 0<delta<=1/4, and sigma=1+delta. Elementary Euler-product bounds give

    |zeta(sigma+it)| >= 1/zeta(sigma) >= c delta.

The apparent small factor s-1 must be paired with the zeta pole. Define

    g(s)=(s-1)zeta(s), with g(1)=1.

This function is analytic near 1. Choose a fixed r>0 so small that |g(s)|>=1/2 for |s-1|<=r. Inside this disk, delta<=1/4 and |t|<=r imply

    |g(s)| >= c_r delta(1+|t|).

Outside the disk, |s-1|>=r and |s-1|>=|t| imply

    |s-1| >= c_r(1+|t|).

The Euler-product lower bound then gives the same inequality

    |g(1+delta+it)| >= c_r delta(1+|t|)

throughout the line. Also |1+delta+it|>=c(1+|t|). Uniform Stirling estimates on 1<=sigma<=5/4, including bounded t by compactness of the nonzero gamma function, therefore yield

    |F(t-ia)|^2 >= c delta^2
       (1+|t|)^(a+7/2) exp(-pi|t|/2).                    (9u)

The only local nonvanishing input is g(1)=1 and continuity in a fixed disk. This does not assume a zero-free theorem on the rest of Re s=1, and every line actually used has Re s>1.

Only this lower bound, not an upper Euler-product comparison, is required in (13). Consequently (1) has the uniform refinement

    W[p] >= c delta^2 (N log N)^(-1/2-delta)
                                  ||p||_(W_*)^2.          (1v)

Choose delta=1/log(N log N) once this is at most 1/4. Then (N log N)^(-delta)=exp(-1), and log(N log N) is comparable to log N. This proves (1u). Finitely many smaller degrees are absorbed using one fixed allowed delta. The proof stays strictly in Re s>1 at every degree, so it requires no separate zero-free-boundary assertion or uniform positive lower bound for zeta on Re s=1.

## 4. Full monic selection gives a quantitative lower bound

Let

    b_n^* = min_(p monic,deg p=n) ||p||_(W_*)^2
          = (4pi/2^(9/2)) n! Gamma(n+9/2).

For n>=1, P_n'/n is monic of degree n-1. Apply (1) at degree n-1 and then ordinary W_*-orthogonality:

    H[P_n] = W[P_n']
       >= c_a n^2 [(n+1)log(n+1)]^(-a) b_(n-1)^*.

No replacement of P_n by the derivative-minimizing polynomial has occurred: this inequality holds for the derivative of every monic degree-n polynomial. Since

    n^2 b_(n-1)^*/b_n^* = n/(n+7/2),

it follows that

    H[P_n] >= c_a (N L)^(-a) b_n^*.                      (14)

The independently audited natural Pollaczek monic trial M_n^* satisfies

    X[M_n^*] <= C b_n^* L^3.

Complete monic minimality gives A_n<=X[M_n^*], not equality and not relative near-minimality. Divide (14) by this upper bound for A_n to obtain (2). Applying (1u) to P_n' gives (2u) by the identical argument, with logarithmic exponent 5/2+3=11/2. Every source and derivative cross term remains in the exact forms throughout.

Because F and W_* are even, the monic W_* minimizers have the matching parity. Thus the same argument applies without alteration to complete parity selection. It does not use a shortened prefix.

## 5. Transfer to the actual finite selected determinant

Use the supplied finite-reduction theorem with sufficiently large fixed K. Its absolute selected-ratio estimate is

    |h_(n,M)-h_n| <= exp[-c N log N],
    h_(n,M)=H_M[P_n^M]/A_n^M.

Polynomial factors have been absorbed by choosing the advertised exponent/cutoff constant appropriately. This superexponential error is smaller than half of (2) for large n, so

    h_(n,M) >= c_a N^(-a)L^(-a-3).                       (15)

The same audited theorem gives the all-vector relative derivative norm

    kappa_(n,M) <= C N^2 L^(7/4).

For the full selected minimum, the exact positive perturbation identity yields, with q_(n,M)(s)=[a_(n,M)(s)-1]/s,

    h_(n,M) <= (1+s kappa_(n,M)) q_(n,M)(s).

This is the multiplicative selected Stieltjes inequality from the supplied slope criterion; it uses H_M>=0 and the actual complete selected column. At s=s_n the parenthetical factor is bounded independently of n. Inserting (15) proves (3). The same superexponential transfer applied to (2u) proves (3u).

Only the final transfer uses the prior selected-slope identity. The new analytic input is the value-form comparison (1), and the independent monic lower bound (14). Thus (3) is not an equivalence restatement.

## 6. What this rules out and what remains open

The argument rules out, for the actual full selected finite-theta determinants, every degree-uniform upper response estimate of order s_n N^(-p) with p>1/2. The explicit bound (3u) also rules out `o(s_n N^(-1/2)L^(-11/2))`, in addition to stretched-exponential or superpolynomial selected response decay. It does not rule out a logarithmic rate, or any other o(s_n) rate compatible with (3).

The upper bound a_(n,M)(s_n)=1+o(s_n) still requires new control of the actual selected arithmetic correlations. No finite-summand example, frozen 4CT edit, Q positivity, zero-free critical line, or unsupported coherence/RH premise enters this note.

## Read-only sources

- ../theta_finite_arithmetic_reduction_20261104/UNIFORM_FINITE_ARITHMETIC_AUDIT.md: exact finite model, growing cutoff, source-relative and selected-ratio transfer.
- ../theta_finite_arithmetic_sign_20261104/SELECTED_DETERMINANT_SLOPE_CRITERION.md: the exact selected Stieltjes multiplicative inequality.
- ../theta_polynomial_comparison_20261104/GENERAL_REFERENCE_AND_NATURAL_COROLLARIES.md: theta derivative/Fourier-cutoff method and shifted-line gamma exponent. This note replaces its source norm by the value norm using (5), and replaces its weighted-supremum step by the independent L2 strip calculation (11)-(12).
- ../theta_pollaczek_natural_20261104/ARITHMETIC_SCALE_COROLLARY.md and NATURAL_FAMILY_RATIO_AUDIT.md: the natural monic source upper C b_n^* log^3(n+2).
