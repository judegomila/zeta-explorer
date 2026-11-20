# Actual-theta parity conditioning and exact Laguerre error amplification

Date: 2026-11-04. Status: analytic derivation, not peer review or machine formalization. This is a targeted obstruction to **transfer by scalar moment error bars**, not an actual-theta counterexample to selected coherence. The finite inequalities below hold for the actual theta transform. No RH, pointwise sign of V, Q positivity (old or new), or inverse-gap bound is assumed.

## Results

Let F be the actual theta transform, c = pi/2, and

    X[p] = integral_R (F p' + 2 F' p)^2.

In parity epsilon in {0,1}, let C_n be the X Gram matrix of the individually X-normalized monomials

    t^epsilon, t^(epsilon+2), ..., t^(epsilon+2n).

Thus diag(C_n)=1. The following are proved below.

1. **Actual-theta exponential conditioning in each parity.**

       liminf_(n->infinity) log(kappa_2(C_n))/n >= eta_* ,
       eta_* = 0.228769704192781... .                         (A)

   This is not an inference from a numerical scan or a reference weight. A finite-n bound with an explicit true-theta exponential-moment constant is given in (8). For example, fixing beta=0.999c gives kappa_2(C_n) >= const_beta n^(2epsilon+4) log^3(n) exp(0.224767702858446... n) for all sufficiently large n.

2. **A positive matrix perturbation realizes exponential amplification.** If only relative errors |delta d_k| <= delta d_k in the scalar moments d_k=integral t^k F'^2 are controlled, there is an explicit admissible error pattern whose induced X Gram perturbation is positive semidefinite and satisfies

       ||G_n^(-1/2) delta G_n G_n^(-1/2)||
          >= delta exp((eta_* - o(1)) n).                    (B)

   A precise liminf version and finite bound appear below. Thus retaining positivity of the approximate X matrix does not repair the scalar-error transfer. In particular, algebraic error bounds such as n^(-1/12) do not certify a small relative X-form error by themselves.

3. **Exact gamma-envelope reference calculation.** For generalized Laguerre polynomials and alpha=7/2 (indeed every fixed alpha>-1), the relative error amplification is exactly

       R_n(alpha) = sum_(j=0)^n binom(n,j) binom(n+alpha,j) 4^j
                  ~ 3^(alpha+1) 9^n / (2 sqrt(2 pi n)).     (C)

   In the individually normalized monomial basis, the gamma moment correlation matrix has condition number at least R_n(alpha). Expanding in the natural gamma-reference orthogonal basis therefore makes the scalar-error amplification explicit rather than removing it.

The perturbations in (B) and (C) are error models, **not** assertions about the true arithmetic remainders. They preserve the stated finite matrix positivity and Hankel structure, but are not claimed to arise from another real theta transform or from a positive measure with the same half-line support. The cumulative zeta remainders may have additional structure. A theorem exploiting that structure could still work. These results do not prove or refute U_n=o(Delta_n), and no selected-polynomial estimate is supplied here.

## 1. Actual-theta inputs

The two existing notes used are:

- `/workspace/shared/theta_coupling_bounds_20261103/AMPLITUDE_SOBOLEV_REDUCTION.md`, Section 1: for every fixed beta<c, the actual F and F' have finite beta exponential moments (Stirling, polynomial vertical-strip bounds, and Cauchy estimates).
- `/workspace/shared/theta_excess_independent_20261104/SELECTED_COMPACT_LOCALIZATION_AND_MONOMIAL_TEST.md`, Sections 4-5: the unconditional scalar asymptotics below, with the stated published arithmetic inputs.

Write a(t)^2 ~ C t^(7/2) exp(-ct), C>0. For N->infinity,

    X[t^N] ~ 4 d_(2N)
           ~ (2C/3) Gamma(2N+9/2)c^(-2N-9/2) log^3 N.      (1)

All constants from the theta normalization cancel in the exponential rates. In particular, with N=2n+epsilon and B=4 log 4 - 4,

    X[t^(2n+epsilon)]
       ~ A_epsilon n^(2epsilon+4) log^3 n
          (n/c)^(4n) exp(Bn),                              (2)

where

    A_epsilon=(2C/3)sqrt(2pi)4^(2epsilon+4)c^(-2epsilon-9/2)>0.

The polynomial X norm is positive without Q positivity.

## 2. A finite actual-theta parity test

Fix beta in (0,c) and a>0. Define the finite true-theta constant

    K_beta = integral_R (1+t^2)exp(beta|t|)(F^2+F'^2) dt.

For n>=2 set

    s = an/beta,
    p_n(t) = (t^2-s^2)^n,
    p_(n,epsilon)(t) = t^epsilon p_n(t).

These are actual monic polynomials in the specified parity. Define

    u(a)=2+sqrt(4+a^2),
    Phi(a)=max{4 log a, 2 log(4u(a))-u(a)},
    M_n=(n/beta)^(4n)exp(n Phi(a)).

An elementary maximum calculation gives the **exact** identity

    S_0 := sup_(t>=0) exp(-beta t)|p_n(t)|^2 = M_n.          (3)

Indeed, after x=beta t/n, the exponent is 2log|x^2-a^2|-x. On 0<=x<a it decreases, with maximum 4log a at x=0. On x>a its unique maximum is at x=u(a), using u(a)^2-a^2=4u(a).

There is also the explicit derivative bound

    S_1 := sup_(t>=0) exp(-beta t)|p_n'(t)|^2
          <= L_(beta,a) M_n,
    L_(beta,a) = 16 beta^2 exp(-2-Phi(a)).                  (4)

To verify it, write beta'=beta(1-1/n). Then

    exp(-beta t)|p_n'|^2
      = 4n^2 [t^2 exp(-beta t/n)]
               [|t^2-s^2|^(2n-2)exp(-beta' t)].

The first bracket has maximum (2n/(e beta))^2. The second is exactly (n/beta)^(4n-4)exp((n-1)Phi(a)), because (n-1)/beta'=n/beta and s beta'/(n-1)=a. Multiplication proves (4).

From |Fp'+2F'p|^2 <= 2F^2p'^2+8F'^2p^2,

    X[p_(n,0)] <= K_beta [8+2 L_(beta,a)] M_n.              (5)

For the odd polynomial, T(tp)=Fp+tFp'+2tF'p and the three-term square bound gives

    X[p_(n,1)] <= K_beta [15+3 L_(beta,a)] M_n.             (6)

Thus, with J_0=8+2L and J_1=15+3L, both parities satisfy the same exponential bound. These estimates retain the exact F and F', including every real zero, and do not divide by F.

## 3. Condition-number theorem

Let b be the coefficient vector of p_(n,epsilon) in the individually X-normalized monomial basis. Since the polynomial is monic,

    ||b||_2^2 >= X[t^(2n+epsilon)].

Its Rayleigh quotient and diag(C_n)=1 yield

    lambda_min(C_n) <= X[p_(n,epsilon)]/X[t^(2n+epsilon)],
    kappa_2(C_n) >= X[t^(2n+epsilon)]/X[p_(n,epsilon)].      (7)

In particular the following is a finite-n inequality, without unspecified asymptotic errors:

    kappa_2(C_n)
      >= X[t^(2n+epsilon)] /
          {K_beta J_epsilon (n/beta)^(4n)exp(n Phi(a))}.    (8)

Combine (2) and (8), keeping beta<c fixed. Then

    kappa_2(C_n)
      >= (A_epsilon/(K_beta J_epsilon))(1+o(1))
           n^(2epsilon+4)log^3 n exp(r_(a,beta)n),
    r_(a,beta)=B-Phi(a)-4log(c/beta).                       (9)

The best a for this elementary family equalizes the two branches of Phi. Put

    y = W(2e^(-2)),
    u_* = 4+2y,
    a_* = sqrt(u_*(u_*-4)) = 1.389719509525575... .

The equality follows from u_*-4=4e^(-u_*/2). Since 4log a is increasing and the outer maximum is decreasing as a increases, this is the minimizing a. Numerically, solely to display the analytic constant,

    Phi(a_*) = 1.316407740286781...,
    eta_* = B-Phi(a_*) = 0.228769704192781... .              (10)

The positivity is not based on the displayed decimals. For the explicit competitor u=22/5 and a=sqrt(44/25), the two candidate values of B-Phi are

    2log(100/11)-4,
    2/5-2log(11/10).

Both exceed 1/5, using log(11/10)<1/10 and log(10)>11/5. The latter follows, for example, from e<11/4 and e^(1/5)<5/4, which give e^(11/5)<605/64<10. Hence eta_*>1/5 rigorously. At beta=0.999c the exponent is greater than 1/5-4/999>19/100, without using decimal approximations.

For every fixed beta<c, (9) gives liminf log(kappa)/n >= eta_*-4log(c/beta). Taking beta upward to c **after** this liminf proves (A). No uniform bound on K_beta as beta approaches c is asserted or needed. One must not replace beta by c in (8).

## 4. Explicit positive perturbations of the actual derivative moments

Let r_j=epsilon+2j, j=0,...,n. In the raw monomial basis, the exact actual-theta X Gram matrix is

    G_n(i,j)=4d_(r_i+r_j)
      -[(r_i+r_j)(r_i+r_j-1)-r_i r_j] mu_(r_i+r_j-2),       (11)

with vanishing coefficients handling negative indices. Let D_n(i,j)=d_(r_i+r_j) and S=diag(1,-1,1,-1,...). The matrix D_n is positive definite: it is the Gram matrix for the positive measure F'^2 dt on these polynomials.

For a chosen scalar tolerance delta>0, change only the derivative-moment entries by

    delta d_(2epsilon+2ell) = delta (-1)^ell d_(2epsilon+2ell).

Every affected scalar moment has exactly relative error delta. The corresponding matrix error is

    delta G_n = 4 delta S D_n S >= 0.                      (12)

Thus G_n+delta G_n is positive definite. This is a **fixed-parity** assertion: the moment sign is (-1)^((k-2epsilon)/2). The chosen signs flip if the same moment sequence is viewed in the other parity. Simultaneous positive-semidefinite perturbations on both parity blocks are not asserted or needed. The perturbation is Hankel at the derivative-moment level, not a freely chosen inconsistent entry-by-entry matrix.

The coefficients of p_(n,epsilon) alternate, so applying S to its coefficient vector replaces t^2-s^2 with t^2+s^2, up to an immaterial overall sign. Hence

    delta X[p_(n,epsilon)]
       = 4delta integral_R t^(2epsilon)(t^2+s^2)^(2n)F'^2
       >= 4delta d_(4n+2epsilon).                          (13)

Consequently the relative form error satisfies the finite bound

    ||G_n^(-1/2)delta G_n G_n^(-1/2)||
      >= 4delta d_(4n+2epsilon) /
           {K_beta J_epsilon (n/beta)^(4n)exp(n Phi(a))}.   (14)

By (1), this has the same exponential rate as (9). More precisely, for any positive sequence delta_n,

    liminf_(n->infinity) (1/n) log(
       ||G_n^(-1/2)delta G_n G_n^(-1/2)|| / delta_n)
          >= eta_*.                                      (15)

For beta=0.999c the finite-beta exponent is 0.224767702858446... . Thus if the only information retained from the scalar arithmetic smoothing is an algebraic relative tolerance, the permitted worst-case relative form uncertainty grows exponentially. Computing those same scalar approximations in a different basis does not remove this uncertainty.

Important boundary: (12) is a consistent finite Hankel-block and positive-X-matrix perturbation, but its derivative moments need not be the even moments of any measure on the real t-axis, much less F'^2 for an entire theta transform. It proves the failure of a particular error-control route. It does not construct another theta function, refute coherence, or show that the actual errors in the known zeta moment formulas are large after orthogonalization.

## 5. Exact gamma-reference calculation

For alpha>-1, put

    M(i,j)=Gamma(i+j+alpha+1),
    h_n=Gamma(n+alpha+1)/n!,
    L_n^alpha(x)=sum_(j=0)^n (-1)^j binom(n+alpha,n-j)x^j/j!.

The orthogonality norm is integral_0^infinity (L_n^alpha(x))^2 x^alpha e^(-x)dx=h_n. These standard polynomial identities can also be verified from the finite coefficient formula and gamma integrals.

The exact scaling connection at -x is

    L_n^alpha(-x)
       = sum_(k=0)^n (-1)^k 2^(n-k)
                         binom(n+alpha,n-k)L_k^alpha(x).   (16)

It follows either by finite coefficient comparison or by inserting the generating function (1-z)^(-alpha-1)exp(-xz/(1-z)). Orthogonality in (16) gives

    integral_0^infinity (L_n^alpha(-x))^2 x^alpha e^(-x)dx
       / h_n
      = sum_(j=0)^n binom(n,j)binom(n+alpha,j)4^j
      = R_n(alpha).                                       (17)

For scalar moment errors delta M(i,j)=delta(-1)^(i+j)M(i,j), the matrix error is delta S M S>=0. On the reference-selected polynomial L_n^alpha, the relative squared-norm error is exactly delta R_n(alpha). This is an actual reference-selected calculation, not a bound obtained by treating the polynomial coefficients as arbitrary.

To obtain the asymptotic, the summands concentrate at j/n=2/3. Uniform Stirling estimates around that interior point give

    binom(n+alpha,j)/binom(n,j) = (1-j/n)^(-alpha)(1+O(1/n))
                               = 3^alpha(1+o(1))

on the concentrating window. The alpha=0 sum has the elementary identity

    R_n(0)=3^n P_n(5/3).

Equivalently, direct one-dimensional Laplace summation of the binomial terms gives

    R_n(alpha) ~ 3^(alpha+1)9^n/(2sqrt(2pi n)).              (18)

For alpha=7/2, the constant is 3^(9/2)/(2sqrt(2pi)). Rescaling x=ct does not change this factor.

Let C_n^gamma be M normalized to have diagonal entries one. Because S commutes with this diagonal normalization, the generalized Rayleigh quotient in (17) is at most

    lambda_max(C_n^gamma)/lambda_min(C_n^gamma).

Therefore

    kappa_2(C_n^gamma) >= R_n(alpha).                       (19)

This unrestricted half-line Laguerre result must not be presented as the same-parity actual-theta result. Sections 2-4 supply the separate parity-valid true-theta argument.

The extra positive logarithmic factors used to average zeta moments do not make this mechanism disappear. For example, replacing the gamma norm by x^alpha e^(-x)log^3(2+x) changes the denominator norm of L_n^alpha by at most O(log^3(n+2)): use log^3(2+x) <= C log^3(n+2)+C(x/n)^2 and the Laguerre recurrence to obtain integral x^2(L_n^alpha)^2/h_n=O(n^2). The reflected-polynomial numerator remains at least log^3(2) times (17). Thus even that simple modified reference has amplification at least a constant times 9^n/[sqrt(n)log^3(n+2)] on these test polynomials. This last statement does not claim these polynomials are orthogonal for the logarithmically modified measure.

## 6. What remains needed for a positive selected-bulk theorem

These calculations exclude the following incomplete proof strategy: insert independent scalar asymptotic moments with algebraic errors into a growing Gram matrix, diagonalize or expand in gamma-reference polynomials, retain positivity of the approximate matrix, and conclude a small relative selected-polynomial error.

A valid transfer needs additional control of the actual correlated arithmetic error on the moving polynomial kernel, or another structure that avoids this cancellation. Examples include a relative form inequality proved directly on the relevant escaping subspace, a remainder estimate integrated against the true selected kernel with its oscillations retained, or an exact special-function identity for the actual X-selected polynomials. None is established here. In particular, the actual compact trace bounds and the actual monomial ratio H[t^N]/X[t^N] tending to zero do not by themselves overcome (14).

No claim of literature novelty is made for the elementary maximum calculation, Laguerre identities, or matrix perturbation algebra.


## 7. An escaping actual-w cancellation test

The following complementary construction, supplied by the parent research thread and verified here, rules out the idea that scalar-error amplification occurs only on compactly confined test polynomials. It concerns the actual positive weight w=F^2; it is not an estimate for X-selected polynomials.

Let n tend to infinity through even integers, m=floor(n^(1/3)), k=4m+2epsilon, and a_n=3n/(2c). Put

    f_n(t)=t^(2m+epsilon)(1-t^2/a_n^2)^n,
    g_n(t)=t^(2m+epsilon)(1+t^2/a_n^2)^n,
    D_n=integral_R w f_n^2,
    N_n=integral_R w g_n^2.

Then

    D_n ~ mu_k,                                             (20)
    log(N_n/D_n) >= [gamma-o(1)]n,
    gamma=7log2-(3/2)log3-3=0.2041... >0.                     (21)

Moreover the normalized w-mass f_n^2 w/D_n escapes every fixed compact set.

### Denominator and escape

On |t|<=a_n, the inequality 0<=1-(1-u)^(2n)<=2nu for u=t^2/a_n^2 gives an integrated loss at most

    (2n/a_n^2)mu_(k+2) = O(m^2/n)mu_k=o(mu_k).

The omitted plain monomial tail is at most mu_(k+2)/a_n^2=o(mu_k). Here the established true-theta scalar moment asymptotics give mu_(k+2)/mu_k=O(m^2).

For the remaining tail of f_n, the actual-theta envelope F(t)^2<=C(1+|t|)^M exp(-c|t|), for some fixed finite M, suffices. Set x=c|t|/n. On x>3/2 the exponential phase is

    phi(x)=2log(x^2/(9/4)-1)-x.

Its unique maximum is at x=9/2, with value

    6log2-9/2 <0.

The strict inequality follows already from log2<3/4. The factor t^k contributes only exp(O(m log n)) on the relevant scale. An elementary Laplace bound, splitting a fixed bounded x interval from the exponentially decreasing far tail, therefore bounds this tail by exp(-b n+O(m log n)) for some b>0. Since log mu_k=O(m log m)=o(n), it is negligible relative to mu_k. This proves (20).

For every fixed R,

    integral_(|t|<=R) w f_n^2 / D_n
      <= R^k integral_(|t|<=R)w / D_n ->0,

using (20) and gamma-factor growth of mu_k. Thus this is a genuine escaping test, not a fixed-compact example. Escape is on a scale much smaller than the polynomial degree; no degree-proportional bulk localization is asserted.

### Numerator

All coefficients in g_n^2 are nonnegative, and the term j=3n/2 in its binomial expansion gives

    N_n >= binom(2n,3n/2) a_n^(-3n) mu_(k+3n).

Stirling's formula, k=O(n^(1/3)), and the same actual-theta scalar moment asymptotics give

    log binom(2n,3n/2)=(4log2-(3/2)log3)n+o(n),
    log[a_n^(-3n)mu_(k+3n)]=(3log2-3)n+o(n),
    log D_n=o(n).

These prove (21). Positivity of gamma is rigorous without decimal evaluation: log2>2/3, while the series log3=2 sum_(j>=0) (1/2)^(2j+1)/(2j+1) gives log3<10/9. Inserting these strict bounds yields gamma>0.

Finally, in the fixed-parity w moment Gram, the perturbation delta mu_(2epsilon+2ell)=delta(-1)^ell mu_(2epsilon+2ell) is positive semidefinite after conjugation by S. On f_n its error is exactly delta N_n, while its original norm is D_n. Thus the relative scalar-moment amplification is at least delta exp((gamma-o(1))n) on polynomials whose actual-w mass escapes. This strengthens the scope of the obstruction, but still does not apply it to the particular moving X-selected endpoint.
