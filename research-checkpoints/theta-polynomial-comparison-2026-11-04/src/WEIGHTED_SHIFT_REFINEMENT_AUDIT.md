# Independent audit: weighted theta shift gives polynomial lower comparison

2026-11-04. This is an analytic audit, not external peer review or a formal proof verification. No RH, selected coherence, zero-spacing, or positivity conclusion is asserted.

## Strongest audited result

The weighted refinement proved in the final section gives

    ||p||_W² <= C(n+2)^(9/2) [log(n+2)]^(3/2) X[p],

and in particular ||p||_W² <= C(n+2)^6 X[p]. Both hold for all real polynomials of degree at most n with a constant independent of n and p. The proof below first establishes the simpler n^11 comparison, then retains the polynomial weight and optimizes the cutoff.

## Basic comparison

The proposed bootstrap is valid under the two inputs already proved in the supplied notes. For every real polynomial p of degree at most n, with

    F(t) = constant * Xi(t), T p = F p' + 2F' p,
    X[p] = integral_R |Tp(t)|² dt,
    W(t) = |Gamma(4+it/2)|²,

one obtains a fixed constant C such that

    ||p||_W² <= C (n+2)^11 X[p].

Together with the established upper estimate X[p] <= C(n+1)||p||_W², this yields a condition number at most C(n+2)^12 in W-orthonormal coordinates. The argument is genuinely for the actual theta transform. Real coefficients are used in the final strip maximum argument.

## Exact inputs

1. The previously established lower comparison

    ||p||_W <= exp[C log²(n+2)] sqrt(X[p]).

   The original squared-norm formulation changes only C. See ../theta_pollaczek_trial_20261104/ACTUAL_THETA_SUBEXPONENTIAL_REFERENCE_COMPARISON.md.

2. With Fourier convention F(t)=integral psi(u) exp(-itu) du, psi is analytic in |Im u|<pi/4, and for every smaller closed strip

    |psi(x+iy)| <= C exp[B|x| - d exp(2|x|)].

   See ../theta_selected_relative_locality_20261104/FIXED_ROW_STRETCHED_EXPONENTIAL.md, Section 2. Only the zeroth-derivative bound in a fixed strip is needed.

3. The elementary xi factorization, Euler product on Re s=2, Stirling bounds, and the already proved polynomial inequality

    ||p||_W² <= C(n+1)^8 [sup_t exp(-pi|t|/4)|p(t)|]².

## 1. Uniform derivative bounds and polynomial coefficients

Fix a small radius r>0 with the closed r-neighborhood of the real line inside a smaller theta strip. On |z-u|<=r, the strip bound and |Re z|>=|u|-r imply, after absorbing the linear prefactor into a smaller double exponential,

    |psi(z)| <= C exp[-d_0 exp(2|u|)].

Cauchy's estimate therefore gives, simultaneously for every integer k>=0,

    |psi^(k)(u)| <= C k! r^(-k) exp[-d_0 exp(2|u|)].       (1)

All constants are independent of k and u. This is the essential uniform-in-degree step; merely citing fixed-order derivative bounds would not suffice.

Write p(t)=sum_(j=0)^n b_j t^j. There is an elementary coefficient estimate

    sum |b_j| <= exp[C(n+1)] ||p||_W.                     (2)

For completeness, W has a positive minimum on [-1,1], so the unweighted L² norm there is bounded by C||p||_W. Expand in Legendre polynomials P_j normalized by ||P_j||²=2/(2j+1). Each expansion coefficient is at most sqrt((2j+1)/2)||p||_(L²[-1,1]). The Rodrigues coefficient formula bounds the sum of absolute monomial coefficients of P_j by (j+1)4^j. Summing proves (2), with polynomial factors absorbed into the exponential.

Input 1 and (2) consequently bound the coefficient sum by

    exp[C(n+1)+C log²(n+2)] sqrt(X[p]).                   (3)

No reference-basis asymptotic is needed for this step.

## 2. Exact source Fourier formula and weighted tails

Let D=d/du. Fourier multiplication by t corresponds to -iD. Direct differentiation, or the commutator [p(-iD),u]=-i p'(-iD), gives the exact identity

    Tp = Fourier(g_p),
    g_p = -i {u,p(-iD)} psi
        = -2iu p(-iD)psi - p'(-iD)psi.                  (4)

Here braces denote the anticommutator, not a scalar product. Combining (1), (3), and j!r^(-j)<=exp[C(n+1)log(n+2)] for j<=n yields

    |g_p(u)| <= sqrt(X[p]) exp[C(n+1)log(n+2)]
                   (1+|u|) exp[-d_0 exp(2|u|)].        (5)

Absorb (1+|u|) by decreasing d_0. Plancherel gives X[p]=2pi integral |g_p|².

Fix any a>=0 and put R_n=log(n+2)+K_a. The double-exponential estimate implies

    integral_(|u|>R_n) exp(2a|u|)|g_p(u)|² du
        <= C_a X[p]
             exp[2C(n+1)log(n+2) - d_1 exp(2R_n)].      (6)

One obtains (6), for example, by using half the negative exponent to dominate exp(2a|u|), and integrating the remaining double exponential. Since exp(2R_n)=exp(2K_a)(n+2)² and (n+1)log(n+2)/(n+2)² is bounded, choose a fixed K_a sufficiently large that the last exponential is at most one for all n>=0.

On |u|<=R_n the multiplier exp(2a|u|) is at most exp(2aK_a)(n+2)^(2a). Thus

    integral exp(2a|u|)|g_p(u)|² du
       <= C_a(n+2)^(2a) X[p].                           (7)

The harmless fixed Plancherel factor is incorporated in C_a. The double-exponential tails make the Fourier transform of g_p entire. Its analytic continuation is the entire function Tp, by equality on the real axis. On the line t-ia its Fourier integrand is exp(-au)g_p(u). Hence Plancherel on that line gives

    integral_R |Tp(t-ia)|² dt <= C_a(n+2)^(2a) X[p].     (8)

Both signs of a obey the same estimate. This step is not a generic analytic continuation bound: it depends on the actual theta kernel tail and the initial norm comparison.

## 3. Primitive estimate on the zero-free shifted line

Set a=3/2 and c=pi/2. The line z=t-ia corresponds to s=2+it in xi(s). Euler product bounds and Stirling imply uniformly in real t

    C^(-1)(1+|t|)^(5/2) exp(-pi|t|/4)
        <= |F(t-ia)|
        <= C(1+|t|)^(5/2) exp(-pi|t|/4).               (9)

For bounded t, the lower constant is positive since zeta has no zeros on Re s=2 and neither s nor s-1 vanishes there. All fixed normalization constants are harmless.

Along this horizontal line,

    d/dt [F(t-ia)² p(t-ia)] = F(t-ia)Tp(t-ia).

The bracket vanishes at both real ends, by (9). Integrate from t to +infinity for t>=0 and from -infinity to t for t<=0. Cauchy-Schwarz and (9) give

    |p(t-ia)|²
       <= C (1+|t|)^(-5) exp(c|t|)
                    integral_R |Tp(s-ia)|² ds.        (10)

Indeed the one-sided integral of |F|² is bounded by C(1+|t|)^5 exp(-c|t|), while |F|^4 is bounded below by C^(-1)(1+|t|)^10 exp(-2c|t|). Therefore

    [sup_t exp(-c|t|/2)|p(t-ia)|]²
        <= C integral_R |Tp(t-ia)|² dt
        <= C(n+2)^3 X[p].                             (11)

## 4. Bringing the weighted supremum back to the real line

For any fixed b>a, choose the analytic square root q(z)=sqrt(z²+b²) on |Im z|<=a with q(x)>0 on the real line. Such a branch exists because z²+b² has positive real part whenever |Im z|<b. Uniformly for |y|<=a,

    |Re q(x+iy)-|x|| <= C_(a,b).                       (12)

This follows from the uniform expansion q(x+iy)=|x|+O(1) at both ends and compactness on bounded x. Define

    h(z)=p(z) exp[-(c/2)q(z)].

For each fixed polynomial, h tends uniformly to zero on the two vertical edges as Re z tends to +/-infinity within the strip. Apply the maximum modulus principle on expanding rectangles. The result and (12) show

    sup_x exp(-c|x|/2)|p(x)|
       <= C_(a,b,c) max_(epsilon=+/-1)
                     sup_x exp(-c|x|/2)|p(x+i epsilon a)|. (13)

The constants do not depend on p or its degree. For real p, conjugation symmetry makes the two boundary suprema equal. Thus (11) and (13) give

    [sup_x exp(-c|x|/2)|p(x)|]² <= C(n+2)^3 X[p].       (14)

Combining (14) with input 3 proves

    ||p||_W² <= C(n+2)^11 X[p].

## Audit conclusion

No obstruction was found. The uniform derivative estimate (1), the whole-plane Fourier continuation behind (8), and the real-coefficient symmetry in (13) are essential details to include. The degree exponent 11 is a valid non-optimized exponent: it is 8 from the established weighted polynomial maximum estimate plus 3 from a=3/2. This argument does not establish bounded conditioning, selected derivative coherence, adjacent determinant asymptotics, or a conclusion about zeros.

## Addendum: retaining the polynomial weight improves the loss to degree six

The parent proposed retaining the factor (1+|t|)^(-5) in (10). This sharpening also passes audit. Define

    M5_y(p) = sup_t (1+|t|)^(5/2) exp(-c|t|/2)|p(t+iy)|.

Equation (10) directly gives M5_(-a)(p)² <= C||Tp(.-ia)||² for a=3/2. Replace the multiplier h in Section 4 by

    h5(z) = p(z)(z²+b²)^(5/4) exp[-(c/2)sqrt(z²+b²)],

using analytic branches on the strip, possible since Re(z²+b²)>0 for |Im z|<=a<b. Uniformly on the closed strip,

    |(z²+b²)^(5/4) exp[-(c/2)sqrt(z²+b²)]|
       is comparable to (1+|Re z|)^(5/2) exp(-c|Re z|/2).

The same maximum principle and real-coefficient symmetry therefore imply

    M5_0(p)² <= C M5_(-a)(p)² <= C(n+2)^3 X[p].         (15)

The weighted reference norm now obeys

    ||p||_W² <= C(n+2)^3 M5_0(p)².                     (16)

To verify (16), on |t|<=An use W(t)<=C(1+|t|)^7 exp(-c|t|) and the definition of M5_0, then integrate C(1+|t|)^2. Outside this interval, the existing Chebyshev exterior proof gives

    exp(-c|t|/2)|p(t)|
       <= M0(p) exp[-k n - eta(|t|-An)]

with fixed k,eta>0. Since M0<=M5_0, integration of (1+|t|)^7 times the square of this bound contributes at most C(n+1)^7 exp(-2kn)M5_0², which is bounded by C(n+2)^3 M5_0². Degree zero is covered by increasing C. This proves (16).

Combining (15)-(16) proves the stronger estimate

    ||p||_W² <= C(n+2)^6 X[p].                          (17)

The corresponding W-orthonormal Gram condition number is at most C(n+2)^7 using the previously established general upper estimate. No further analytic or arithmetic input is required.

A further optional cutoff optimization is valid: R_n=(1/2)log[(n+2)log(n+2)]+K suffices in (6), since its negative exponent is a large fixed multiple of (n+2)log(n+2). It gives

    ||Tp(.-ia)||² <= C_a[(n+2)log(n+2)]^a X[p].

At a=3/2, combining with (16) yields

    ||p||_W² <= C(n+2)^(9/2) [log(n+2)]^(3/2) X[p].     (18)

Equations (17) and (18) are improvements of, not prerequisites for, the requested n^-11 comparison. All constants remain independent of n and p.
