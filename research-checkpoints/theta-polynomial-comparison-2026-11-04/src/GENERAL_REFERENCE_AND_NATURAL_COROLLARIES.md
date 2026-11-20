# General gamma-reference comparison and natural-reference consequences

2026-11-04. Independent analytic audit. The weighted-shift argument is valid, including the optimized Fourier cutoff. This note establishes a new actual-source lower bound, not selected coherence, positivity, or RH.

## 1. General statement

Let F be the actual theta transform (a fixed nonzero real multiple of Xi),

    Tp = Fp' + 2F'p,   X[p] = integral_R |Tp|²,
    W_lambda(t) = |Gamma(lambda+it/2)|²,
    c = pi/2, N=n+2, L=log(n+2).

Fix lambda>0 and a>1/2 such that q=a+7/2<2lambda. There is a constant C_(lambda,a), independent of n and the real polynomial p of degree at most n, such that

    ||p||_(W_lambda)² <= C_(lambda,a) N^(2lambda-7/2) L^a X[p].  (1)

The constants need not be uniform as a approaches 1/2 or q approaches 2lambda. Neither endpoint is asserted.

For the natural reference lambda=9/4, choose a=3/4. Then q=17/4<9/2=2lambda and

    ||p||_(W_*)² <= C N L^(3/4) X[p],
    X[p] >= c_0 N^(-1)L^(-3/4)||p||_(W_*)².              (2)

This holds for all n>=0 after adjusting fixed constants.

## 2. Source shift estimate, independent of the target reference

The established W_4 preliminary comparison is enough:

    ||p||_(W_4) <= exp[C log²N] sqrt(X[p]).

A Legendre expansion on [-1,1] gives the monomial coefficient bound sum|b_j|<=exp[C(n+1)]||p||_(W_4) for p(t)=sum b_jt^j. The exact theta kernel is analytic in |Im u|<pi/4 and has double-exponential decay on smaller closed strips. Fixed-radius Cauchy estimates give

    |psi^(k)(u)| <= C k!r^(-k) exp[-d exp(2|u|)]

simultaneously for all integers k>=0 and real u, with constants independent of k. With F(t)=integral psi(u)e^(-itu)du and D=d/du, the exact source inverse transform is

    g_p = -i{u,p(-iD)}psi = -2iu p(-iD)psi - p'(-iD)psi.

Consequently

    |g_p(u)| <= sqrt(X[p]) exp[C N log N] exp[-d_1 exp(2|u|)]. (3)

Here a factor 1+|u| has been absorbed into the double exponential. Also X[p]=2pi||g_p||². Put

    R_n = (1/2)log(N log N)+K_a.

The weighted tail from (3) satisfies

    integral_(|u|>R_n) exp(2a|u|)|g_p(u)|² du
       <= C_a X[p] exp[2C N log N - d_2 exp(2R_n)].

Choose fixed K_a large enough to make the final exponential at most one, since exp(2R_n)=exp(2K_a)N log N. The central interval costs at most exp(2aR_n)=C_a(N log N)^a. Plancherel therefore gives

    ||Tp(.-ia)||² <= C_a(N log N)^a X[p].               (4)

To justify the shifted identity, double-exponential tails make Fourier(g_p) entire, agreeing with Tp on the real axis and hence everywhere. On t-ia the source transform is the Fourier transform of e^(-au)g_p. No W_lambda preliminary estimate is needed: the W_4 input already proves (4) for every polynomial.

Full supporting derivations for these facts are in WEIGHTED_SHIFT_REFINEMENT_AUDIT.md, Sections 1-2 and its addendum.

## 3. Primitive estimate on any fixed zero-free right-half-plane line

The horizontal line z=t-ia corresponds to s=1/2+a+it. Since a>1/2, sigma=1/2+a>1. The Euler product bounds |zeta(sigma+it)| both above and away from zero, uniformly in t, with constants depending on sigma. The factors in

    xi(s) = (1/2)s(s-1)pi^(-s/2)Gamma(s/2)zeta(s)

and Stirling therefore give

    |F(t-ia)|² comparable to (1+|t|)^q exp(-c|t|),
    q = sigma+3 = a+7/2.                               (5)

Indeed Gamma(s/2) contributes squared power sigma-1 and s(s-1) contributes squared power four. Uniformity on bounded t follows because sigma>1 and none of these factors vanish there.

The exact primitive identity d/dt(F²p)=F Tp holds along the shifted line. Its endpoint value vanishes at both infinities. Integrating toward the nearer infinite end and applying Cauchy-Schwarz gives

    |p(t-ia)|² <= C_a (1+|t|)^(-q) exp(c|t|)||Tp(.-ia)||².

Define

    M_(q,y)(p) = sup_t (1+|t|)^(q/2) exp(-c|t|/2)|p(t+iy)|.

Thus

    M_(q,-a)(p)² <= C_a||Tp(.-ia)||².                   (6)

## 4. Weighted strip maximum

Choose b>a. In |Im z|<=a, Re(z²+b²)>0, so use its analytic logarithm to define

    m(z) = (z²+b²)^(q/4) exp[-(c/2)sqrt(z²+b²)].

Uniformly in this strip,

    |m(x+iy)| comparable to (1+|x|)^(q/2) exp(-c|x|/2).

For each fixed p the analytic function p(z)m(z) tends to zero on the vertical sides of expanding rectangles. The maximum modulus principle bounds its real-axis supremum by the maximum of the two horizontal boundary suprema. Since p has real coefficients, |p(x+ia)|=|p(x-ia)|. It follows that

    M_(q,0)(p)² <= C_(a,q)||Tp(.-ia)||²
                <= C_(a,q)(N log N)^a X[p].             (7)

No degree-dependent constant enters this strip argument.

## 5. Weighted restricted-range integral

Stirling gives W_lambda(t) comparable to (1+|t|)^(2lambda-1)exp(-c|t|). Fix the same sufficiently large A used in the elementary Chebyshev exterior estimate. Inside [-An,An], (7)'s weighted maximum gives

    integral_(|t|<=An) W_lambda|p|²
       <= C M_(q,0)(p)² integral_0^(An)(1+t)^(2lambda-1-q)dt
       <= C N^(2lambda-q) M_(q,0)(p)²,                 (8)

where the last step uses the strict inequality q<2lambda.

Outside [-An,An], the elementary exterior estimate supplies

    exp(-c|t|/2)|p(t)|
       <= M_(0,0)(p) exp[-k n-eta(|t|-An)]

for fixed positive k,eta. Because q>0, M_(0,0)<=M_(q,0). Integrating against the polynomial factor (1+|t|)^(2lambda-1) makes the exterior contribution at most a fixed power of N times exp(-2kn)M_(q,0)². It is therefore also bounded by the right side of (8). Degree zero is absorbed separately. Hence

    ||p||_(W_lambda)² <= C N^(2lambda-q) M_(q,0)(p)².

Insert (7) and q=a+7/2:

    N^(2lambda-q)(N log N)^a = N^(2lambda-7/2)(log N)^a.

This proves (1) and (2). For lambda=9/4 and a=3/4, the integrand exponent in (8) is -3/4, giving N^(1/4), exactly as proposed.

## 6. Natural-reference Gram and monic-trial corollaries

The independently established upper estimate in

    ../theta_pollaczek_trial_20261104/NATURAL_GAMMA_REFERENCE.md

is X[p]<=C(n+1)^3||p||_(W_*)². Combined with (2), the actual source Gram G_n in W_*-orthonormal coordinates satisfies

    c_0/(N L^(3/4)) I <= G_n <= C N³ I,
    kappa_2(G_n) <= C N⁴ L^(3/4).                       (9)

This assertion concerns W_*-orthonormal coordinates. A further diagonal rescaling to individual X normalization is not silently included.

Let M_n^*(t)=n!P_n^(9/4)(t/2;pi/2), with monic reference minimum

    b_n^* = ||M_n^*||_(W_*)²
          = (4pi/2^(9/2)) n!Gamma(n+9/2).

If A_n is the actual monic selected minimum, ordinary reference orthogonality and (2) imply

    A_n >= c_0 b_n^*/(N L^(3/4)).                        (10)

The previously audited arithmetic upper estimate

    X[M_n^*] <= C b_n^* L³

appears in ../theta_pollaczek_natural_20261104/ARITHMETIC_SCALE_COROLLARY.md, with its audit in NATURAL_FAMILY_RATIO_AUDIT.md in that directory. It uses the global natural-family envelope and the cited cumulative Hardy-Z derivative moment theorem. Assuming that already-established input, the exact selected-overlap identity yields

    theta_n(M_n^*) = A_n/X[M_n^*]
                  >= c_1/[N L^(15/4)].                 (11)

The logarithmic exponent is 3+3/4=15/4. The lower comparison (2) and Gram consequence (9) do not require this arithmetic trial upper input; only (11) does.

These statements do not give theta_n tending to one, selected H/A decay, a positive defect, or selected coherence. No change is made to any prior frozen proof or live 4CT file.

## 7. Sharper arithmetic-dependent condition bound in both normalizations

The same established arithmetic trial upper used in (11) improves the condition bound substantially. This corollary, unlike the lower comparison (2), uses that additional input.

Let psi_j=M_j^*/sqrt(b_j^*) be the W_*-orthonormal natural basis and set

    d_j = X[psi_j] = X[M_j^*]/b_j^*.

The arithmetic trial upper yields d_j<=C[log(j+2)]³<=CL³ for j<=n. Since G_n is positive definite,

    lambda_max(G_n) <= trace(G_n)
                    = sum_(j=0)^n d_j <= C N L³.        (12)

Combining (12) with lambda_min(G_n)>=c_0/(N L^(3/4)) from (9) gives

    kappa_2(G_n) <= C N² L^(15/4).                      (13)

This is a quadratic Gram argument: the trace bound sums squared source norms, not absolute synthesis coefficients.

For individual X normalization put D=diag(d_0^(-1/2),...,d_n^(-1/2)) and H_n=D G_n D. Every d_j is strictly positive because X is positive definite on polynomials. Explicitly, Tp=0 implies (F²p)'=0, its endpoint limit makes the constant zero, and analyticity forces p=0. Thus D is well defined, including small degrees.

For any coordinate vector v,

    v*H_n v >= lambda_min(G_n)||Dv||²
             >= [lambda_min(G_n)/max_j d_j]||v||².

Therefore

    lambda_min(H_n) >= c/[N L^(15/4)].                  (14)

Every diagonal entry of H_n is one, so positivity gives lambda_max(H_n)<=trace(H_n)=n+1<=N. Hence

    kappa_2(H_n) <= C N² L^(15/4).                      (15)

No lower estimate for each individual d_j beyond positivity is needed: (14) uses only their common upper bound. Fixed constants absorb the finitely many small degrees. Equations (13) and (15) improve the elementary-source-upper consequence (9), but their additional dependence on the audited arithmetic trial upper must be retained. They imply neither bounded conditioning nor selected coherence.
