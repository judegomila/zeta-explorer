# Degree-locked actual-theta packets and the remaining Hardy-Z observability problem

Date: 2026-11-04. Status: analytic construction and necessary-condition reduction; it does not prove selected coherence, a uniform bulk coercivity inequality, or a counterexample to either. All real Xi zeros remain in every integral. No RH, positivity of V or Q, enlarged-block positivity, or inverse generalized gap is used.

## 1. Main result

Write c=pi/2 and use the exact theta form

    T p = F p' + 2 F' p,
    X[p] = integral |Tp|^2,
    H[p] = integral F^2 p'^2,
    V = 2(F'^2 - F F'').

Fix a parity epsilon, numbers 0<theta<alpha<Theta, and assume

    alpha < 2/c = 4/pi.

There are explicit real polynomials p_n of that parity, of degree at most n, centered at T_n~alpha n, with the following properties.

1. Their full nonnegative energy density

       E[p] = |Tp|^2 + F^2 p'^2 + (F^2+|V|)p^2

   has exponentially small relative mass outside the linear bulk:

       integral_{|t| not in [theta n,Theta n]} E[p_n]
           <= C exp(-eta n) X[p_n].                       (1.1)

2. More strongly, for every fixed delta>0 and A>0, the construction can be chosen so that

       integral_{||t|-T_n| > n^delta} E[p_n]
           <= C n^(-A) X[p_n].                            (1.2)

   Constants and the polynomial family may depend on delta and A. In particular, one can take delta<5/12 or arbitrarily small positive delta. This does not assert concentration in a fixed bounded-width interval.

3. For t>0 write F(t)=sigma a(t) Z(t), where sigma is a constant sign, a(t)>0, and Z is Hardy's real Z-function. Normalize p_n(T_n)=1, and put

       phi_n(u) = a(T_n+u) p_n(T_n+u) / a(T_n),  u>-T_n.

   For fixed s>=1 and omega>0 determined by the construction,

       phi_n(u) -> phi(u) = sinc(omega u)^(2s)

   in C^1 on every fixed compact u-interval. Here sinc(v)=sin(v)/v, with value 1 at zero. The carrier after removing the gamma envelope consequently has a fixed, degree-independent local bandwidth.

4. A proposed degree-uniform bulk inequality with epsilon_n->0 and errors controlled by exterior/boundary energy would force the exact short-packet Hardy-Z inequality (6.2). Applying it to a same-parity polynomial carrier pair further forces the cancellation-free derivative/mass divergence (6A.5). These are genuinely local arithmetic dependencies, not consequences of the cited cumulative scalar moments. The present note does not prove them.

The construction supplies actual polynomials with a proved degree/height relation. It is not the old graph-density construction with an unspecified approximation degree. It also does not produce a family with H/X bounded below, and therefore is not an actual-theta counterexample.

## 2. An elementary polynomial lower bound for the source norm

The already verified theta envelope, uniformly on each fixed complex neighborhood of a large positive real T, gives finite constants C,M such that

    |F(T+z)| <= C exp(-c T/2) T^M,  |z|<=4.                (2.1)

At z_0=-3i/2, the argument of xi is 2+iT. The absolutely convergent reciprocal Euler product gives

    |zeta(2+iT)| >= 1/zeta(2).

Fixed-strip Stirling therefore gives, after adjusting the normalization of F,

    |F(T-3i/2)| >= C_0 exp(-c T/2) T^(5/2).              (2.2)

Fix d in (0,1]. Apply the two-constants principle to log|F(T+z)| in the disk |z|<4 slit along [-d,d], at z_0. The harmonic measure omega_d of the slit is a fixed number in (0,1). For completeness, the principle here is just the maximum principle for the subharmonic function log|F| minus the harmonic function with constant boundary values log sup_slit|F| and log sup_circle|F|. Zeros are allowed by subharmonicity. Equations (2.1)-(2.2) imply a finite C_d with

    sup_{|u|<=d}|F(T+u)| >= exp(-c T/2) T^(-C_d)          (2.3)

for all sufficiently large T, up to an unimportant fixed positive multiplier.

Suppose a real polynomial p satisfies |p(T+u)|>=b>0 for |u|<=d. At a point t_* in that interval attaining the supremum in (2.3), use the exact identity

    F(t_*)^2 p(t_*) = -integral_{t_*}^infinity F(t) Tp(t) dt.

Cauchy-Schwarz and the upper theta envelope imply

    X[p] >= |F(t_*)|^4 |p(t_*)|^2 / integral_{t_*}^infinity F^2
         >= C_b exp(-c T) T^(-C_*).                     (2.4)

The exponent C_* can be fixed independently of p and b; the multiplier depends on b. This estimate only excludes super-polynomial smallness of the local source after removing exp(-cT). It is not a short-interval mean-value theorem and has no log-scale coercive content. It remains valid when the interval contains any number or multiplicity of real Xi zeros.

## 3. Explicit fixed-parity Fejer-Chebyshev packets

Choose k_n with parity epsilon such that

    k_n/n -> kappa = c alpha/2 in (0,1),
    T_n = 2 k_n/c.

Fix an integer s>=1, and choose beta>0 with

    kappa+s beta < 1.

For example, beta=(1-kappa)/(2s) works. Let m_n=floor(beta n). The finitely many small n with m_n<2 can be omitted. Take a fixed L>max(Theta,4/c), sufficiently large for the tail estimate in Section 4, and set

    x_n = T_n/(L n),
    theta_n = arccos x_n.

For |x|<=1 and y=cos vartheta, define the algebraic Fejer kernel

    K_m(x,y) = 1 + 2 sum_{j=1}^{m-1}(1-j/m) T_j(x) T_j(y),

where T_j is the Chebyshev polynomial. If x=cos theta, then exactly

    K_m(x,y) = [F_m(theta-vartheta)+F_m(theta+vartheta)]/2,
    F_m(v) = (1/m) [sin(mv/2)/sin(v/2)]^2.

In particular K_m>=0 on [-1,1], and K_m<=m. Define the even polynomial

    E_n(x) = [K_m(x,x_n)+K_m(x,-x_n)]/m,  m=m_n.

It has degree at most m-1, only even powers, and

    0<=E_n(x)<=2 on [-1,1],
    E_n(x_n)=1/2+O(m^(-2)).                              (3.1)

The last estimate holds because x_n tends to the fixed interior point alpha/L in (0,1), distinct from its negative. The other three Fejer peaks stay a fixed angular distance from theta_n.

Set

    p_n(t) = (t/T_n)^(k_n) [E_n(t/(Ln))/E_n(x_n)]^s.      (3.2)

Then p_n(T_n)=1, p_n has parity epsilon, and

    degree p_n <= k_n+s(m_n-1) <= n

for all sufficiently large n. This is the promised explicit degree/height relation.

For bounded u, the angular displacement is

    arccos((T_n+u)/(Ln))-theta_n
       = -u/[Ln sin theta_n] + O(u^2/n^2).

It follows directly from the displayed Fejer formula, including its first derivative, that

    E_n((T_n+u)/(Ln))/E_n(x_n)
       -> sinc(omega u)^2,
    omega = beta/[2 L sqrt(1-(alpha/L)^2)].               (3.3)

Also (1+u/T_n)^k_n -> exp(cu/2). Thus p_n(T_n+u) tends locally in C^1 to exp(cu/2)sinc(omega u)^(2s). The gamma envelope cancels exp(cu/2), proving property 3 in Section 1.

The choice of L makes omega small. In particular, the limiting p-profile is bounded below by a positive constant on [-1,1]. Hence the same is true of p_n(T_n+u) for all sufficiently large n, and (2.4) applies with d=1. Consequently

    X[p_n] >= C exp(-cT_n) n^(-C_*).                    (3.4)

For different fixed s, its multiplier can change, but C_* can stay the same.

## 4. Exponential localization in a linear-height bulk

The theta envelope gives a fixed M with

    E[p](t) <= C(1+|t|)^M exp(-c|t|) (p(t)^2+p'(t)^2).  (4.1)

On |t|<=Ln, (3.1) and the polynomial Markov inequality for E_n show that p_n and p_n' are bounded by fixed polynomial factors in n times, respectively,

    (|t|/T_n)^k_n,
    (|t|/T_n)^k_n + (|t|/T_n)^(k_n-1).

All constants may depend on the fixed s. The relevant exponential is therefore

    2k_n log(|t|/T_n) - c(|t|-T_n).                     (4.2)

Its unique maximum is zero at |t|=T_n. On the compact scaled set 0<=|t|/n<=L outside [theta,Theta], it is at most -eta_0 n, after treating the factor with exponent k_n-1 identically. The point t=0 causes no problem: k_n grows linearly, and that factor also vanishes there. Integration adds only fixed powers of n.

For |t|>=Ln, the elementary Chebyshev bound gives

    |E_n(t/(Ln))| <= C(2|t|/(Ln))^m,
    |d/dt E_n(t/(Ln))| <= C n(2|t|/(Ln))^m.

Thus the exterior exponent, relative to exp(-cT_n), is bounded by

    2k_n log(|t|/T_n)
       + 2s m_n log(2|t|/(Ln)) - c(|t|-T_n).             (4.3)

At |t|=Ln its quotient by n tends to

    2kappa log(L/alpha) + 2s beta log 2 - c(L-alpha),

which is negative when L is sufficiently large. Its derivative for |t|>=Ln is at most

    2(k_n+s m_n)/|t| - c <= 2/L-c < -c/2.

Consequently the full exterior integral also has an exponentially small bound relative to exp(-cT_n), with polynomial prefactors. Dividing by (3.4) proves (1.1). The same proof works for any fixed linear-height neighborhood of alpha, even one strictly inside [theta,Theta]. In particular errors on fixed-width boundary strips of that bulk are negligible too.

## 5. Subpower-width localization with a fixed kernel power

Choose a small fixed eta_1>0 so that |u|<=eta_1 n remains near T_n and away from zero, the scaled endpoints, and the negative mirror peak. The explicit Fejer formulas give

    |E_n((T_n+u)/(Ln))|
      + |d/du E_n((T_n+u)/(Ln))|
        <= C(1+|u|)^(-2).                               (5.1)

For |u|>=1 this follows by bounding the sine denominators below by a constant times |u|/n; differentiating the numerator contributes at most the same u^(-2) order. The three remote angular peaks contribute O(n^(-2)), which is bounded by the right side throughout this range. For |u|<=1 the estimate follows from the explicit kernel and bounded local derivative. The denominator E_n(x_n) is uniformly bounded below.

The gamma factor satisfies

    a(t)^2 = C t^(7/2) exp(-ct)(1+O(t^(-2))),
    b(t):=a'(t)/a(t) = -c/2+7/(4t)+O(t^(-3)).

For

    R_n(u) = a(T_n+u)/a(T_n) (1+u/T_n)^k_n,

the identity k_n=cT_n/2 and log(1+v)-v<=-c_1 v^2 on a fixed neighborhood of zero yield

    |R_n(u)| <= C exp(-c_2 u^2/n),
    |R_n'(u)| <= C exp(-c_2 u^2/n)                       (5.2)

after decreasing c_2 if necessary. Indeed its logarithmic derivative is b(T_n+u)+k_n/(T_n+u)=O((1+|u|)/n), which stays bounded here. Combining (5.1)-(5.2), including the derivative of the fixed s-th power, gives

    |phi_n(u)|+|phi_n'(u)|
       <= C (1+|u|)^(-2s) exp(-c_2 u^2/n).              (5.3)

For t~n, polynomial vertical-strip estimates give |Z(t)|+|Z'(t)|+|Z''(t)|<=C n^M for a fixed M. The V term is controlled by these same bounds. Thus the integral of E[p_n]/a(T_n)^2 over n^delta<|u|<eta_1 n is at most

    C n^(M-(4s-1)delta).                                (5.4)

Here M has absorbed squaring and harmless polynomial factors, and is independent of s. The region outside the two eta_1 n neighborhoods of +/-T_n is exponentially negligible by Section 4. Finally (3.4) and a(T_n)^2~C n^(7/2)exp(-cT_n) give

    X[p_n]/a(T_n)^2 >= C n^(-C_1)

with C_1 independent of s. Choose fixed s large enough that

    (4s-1)delta > M+C_1+A.

Equations (5.4) and the exponential exterior estimate prove (1.2). For delta>=1 the conclusion is already implied by a suitable weaker positive delta. The statement allows an independent choice of s for each desired delta,A; it does not allow s to grow with n within this proof.

This argument proves concentration of actual theta energy in a subpower window, not merely of a smooth-reference norm. It uses only very crude polynomial upper and lower bounds for the arithmetic factor. It still does not imply that most of that energy lies in any fixed bounded-width interval.

## 6. Exact Hardy-Z observability forced by bulk coercivity

Since p_n has fixed parity and F is even, the full energies are twice their positive-half-line versions. Let b=a'/a. Direct differentiation, without dividing by Z or F, gives

    F p_n' = sigma a(T_n) Z(T_n+u) [phi_n'(u)-b(T_n+u)phi_n(u)],

    T p_n = sigma a(T_n) {
        2 phi_n(u) Z'(T_n+u)
        + [phi_n'(u)+b(T_n+u)phi_n(u)] Z(T_n+u)}.

Therefore the following is an exact identity:

    H[p_n]/X[p_n]
      = integral_{-T_n}^infinity
          Z(T_n+u)^2 |phi_n'-b phi_n|^2 du
        / integral_{-T_n}^infinity
          |2 phi_n Z'(T_n+u)+(phi_n'+b phi_n)Z(T_n+u)|^2 du. (6.1)

It retains zeros automatically. No singular log derivative of Z occurs.

Suppose a proposed estimate applies to every degree<=n polynomial whose X energy lies asymptotically in [theta n,Theta n], with

    H_bulk[p] <= epsilon_n X[p] + boundary/leakage error,
    epsilon_n -> 0,

and its error on the present packets is o(X[p_n]). For example, this holds if the error is bounded by a subexponential-in-n coefficient times the E energy outside that bulk or on boundary strips separated linearly from alpha n. Then (1.1) forces

    integral Z(T_n+u)^2 |phi_n'-b phi_n|^2 du
       = o( integral |2 phi_n Z'(T_n+u)
                         +(phi_n'+b phi_n) Z(T_n+u)|^2 du ). (6.2)

The integrals can both be restricted to |u|<=n^delta at an additive o(X[p_n]/a(T_n)^2) cost, by taking s sufficiently large in (1.2). This is a precise actual-theta local observability requirement for a completely explicit degree-locked family.

On each fixed compact u interval, its coefficient profiles tend to

    numerator coefficient:   phi'+(c/2)phi,
    denominator:             2 phi Z'+[phi'-(c/2)phi]Z,
    phi = sinc(omega u)^(2s).

Do not replace (6.2) by an integral with the limiting phi without an additional uniform arithmetic domination argument: Z(T_n+u) itself changes with n, and compact C^1 convergence of the coefficient profiles alone does not justify such a substitution in a relative asymptotic. Keeping phi_n gives an exact statement and avoids that gap.

## 6A. A carrier-pair test forces genuine derivative-mass observability

The operator ratio in (6.2) can be sharpened to a familiar derivative/mass ratio, rather than allowing cancellation in its numerator coefficient. Reserve an additional fraction gamma>0 of the degree budget:

    kappa+s beta+gamma < 1.

Take even integers ell_n with ell_n/n->gamma and put x=t/(Ln), d_n=sin theta_n. Define the two even carrier polynomials

    C_n(t) = T_(ell_n)(x),
    S_n(t) = (x/x_n) d_n U_(ell_n-1)(x),

where U_j is the Chebyshev polynomial of the second kind. Both have degree ell_n and even parity. Therefore

    q_(n,1)=p_n C_n,  q_(n,2)=p_n S_n

have the same fixed parity as p_n and degree at most n. This construction is distinct from replacing a real polynomial by a nonpolynomial complex exponential.

In a small fixed linear-height neighborhood J_n of +T_n, write theta=arccos x. There

    C_n=cos(ell_n theta),
    S_n=A_n(t) sin(ell_n theta),
    A_n(t)=(x/x_n)d_n/sin theta.

The amplitude A_n is bounded above and below by positive constants, A_n'=O(1/n), and theta'=-1/(Ln sin theta). Consequently

    C_n S_n' - C_n' S_n
       = A_n ell_n theta' + A_n' cos(ell_n theta)sin(ell_n theta)

is bounded away from zero in absolute value. The four entries C_n,S_n,C_n',S_n' are uniformly bounded there. Thus their value/derivative matrix and its inverse have uniformly bounded operator norms. The same statements hold near -T_n by parity. Pointwise on these two neighborhoods this gives fixed constants c_0,C_0>0 with

    F^2 (q_(n,1)'^2+q_(n,2)'^2)
        >= c_0 F^2(p_n'^2+p_n^2),                       (6A.1)

    |Tq_(n,1)|^2+|Tq_(n,2)|^2
        <= C_0 [F^2(p_n'^2+p_n^2)+F'^2 p_n^2].          (6A.2)

Here the first inequality is just the smallest-singular-value bound applied to the vector (p_n',p_n), and the second follows by expanding

    T(p_n C_n)=C_n Tp_n+F p_n C_n',

and similarly for S_n.

The localization proofs also apply to each q_(n,i). On the main scaled interval their extra size and derivatives cost at most fixed powers of n; outside it they cost the extra Chebyshev exponent ell_n, already included in the reserved degree budget. Near T_n their values and derivatives are uniformly bounded, so the local kernel tail power is unchanged.

For clarity about their source lower bounds, decrease beta if necessary so that the base sinc profile stays nonzero on a fixed interval [-D,D] containing several full carrier periods. The limiting carrier speed gamma/[L sqrt(1-(alpha/L)^2)] is a nonzero constant. Each of |C_n| and |S_n| is bounded below on some subinterval of [-D,D] whose length is bounded below independently of n. The location of that subinterval may vary with n. The two-constants proof of (2.3) is uniform over such translated subintervals: use a larger fixed disk, and the minimum of their strictly positive harmonic measures on the compact set of allowed positions. Equation (2.4) therefore supplies

    X[q_(n,i)] >= C_i exp(-cT_n)n^(-C_2).

The exponent C_2 can be fixed independently of the subsequently chosen fixed kernel power s; only the base-profile lower multiplier depends on s. One may fix gamma,L,D first and take beta<=min((1-kappa-gamma)/(2s), beta_0) with beta_0 small enough for this purpose. As before, increasing the fixed s then gives any prescribed polynomial leakage rate outside the n^delta windows.

Now suppose the proposed uniform bulk theorem holds for these two real polynomial families. By their localization it implies

    H[q_(n,1)]+H[q_(n,2)]
       = o(X[q_(n,1)]+X[q_(n,2)]).                       (6A.3)

Let Omega_n be the two windows ||t|-T_n|<=n^delta, with 0<delta<1, and put

    N_n = integral_Omega F^2(p_n'^2+p_n^2),
    D_n = integral_Omega F'^2 p_n^2.

Their carrier energy outside Omega_n is o of their summed source norm. Equations (6A.1)-(6A.3) therefore imply

    N_n = o(D_n).                                        (6A.4)

Indeed the summed H is at least c_0 N_n, while the summed X is at most C_0(N_n+D_n) plus a negligible fraction of itself. Absorb that fraction, then absorb the o(N_n) term.

On the positive window, substitute F=aZ and a p_n=a(T_n)phi_n. Since b is uniformly bounded there,

    integral F'^2 p_n^2
      = a(T_n)^2 integral phi_n^2 (Z'+bZ)^2
      <= 2a(T_n)^2 integral phi_n^2 Z'^2
           + C a(T_n)^2 integral phi_n^2 Z^2.

Using the mass part of (6A.4) and parity now yields the necessary arithmetic condition

    integral_{|u|<=n^delta} phi_n(u)^2 Z'(T_n+u)^2 du
      / integral_{|u|<=n^delta} phi_n(u)^2 Z(T_n+u)^2 du
        -> infinity.                                    (6A.5)

The denominator is positive. This is a concrete, cancellation-free Hardy-Z derivative observability consequence of uniform degree-locked bulk coercivity. The expected arithmetic scale would be proportional to log^2 n, but no such rate, nor even the divergence in (6A.5), is proved here. No limiting-profile substitution has been made.

## 7. What this identifies, and what it does not

- The available cumulative derivative-moment remainder O(T^(5/12)log^3 T) cannot by itself give a relative main term on every width-T^delta window when delta<5/12. Subtracting two cumulative formulas only gives that same O(T^(5/12)log^3 T) absolute error, larger than the expected width-T^delta main term. The explicit packets show why tying degree to height does not restore the old scalar-moment transfer argument.
- A positive proof of uniform bulk coercivity needs genuine real-axis arithmetic information at the scale sampled in (6.2), or a different mechanism that directly controls these packet tests. A proof restricted to the single completely X-selected endpoint might bypass this uniform condition; these packets have not been shown to be selected or orthogonal to the old prefix.
- The smooth-reference local Bernstein phenomenon at |t|~n is compatible with the construction: the packets have O(1) local bandwidth after removal of the gamma envelope. A reference supremum-norm Bernstein theorem is not an actual-Xi-weight L2 transfer theorem.
- Counting all complex Xi zeros in a fixed-width strip is not by itself a real-axis observability mechanism. As a structural counterexample to that inference, cosh(2lambda a)-cos(2lambda t) has a density proportional to lambda of zeros at t=k pi/lambda +/- i a, while its relative real-axis derivative is O(lambda exp(-2lambda a)) for fixed a>0. This example is not the theta function, has no theta decay, and is not an actual-theta counterexample. It only explains why a proof must add more than zero count and zero-strip location.
- No conclusion about the sign of Delta_n, the selected mismatch U_n, or U_n/Delta_n follows from this note.

## Inputs and provenance

The exact theta identities, fixed-complex-neighborhood exponential envelope, and gamma-factor asymptotics are the previously established inputs recorded in:

- /workspace/shared/theta_coupling_bounds_20261103/AMPLITUDE_SOBOLEV_REDUCTION.md
- /workspace/shared/theta_excess_independent_20261104/SELECTED_COMPACT_LOCALIZATION_AND_MONOMIAL_TEST.md
- /workspace/shared/theta_selected_escape_20261104/UNIFORM_LOGARITHMIC_RANGE_BOUND.md

The Fejer identities, Chebyshev extrapolation, and two-constants argument have been explicitly supplied above; no growing-dimensional moment approximation is used. No frozen package or live 4CT file was changed. This is AI-assisted analytical work, not a machine-formalized or externally peer-reviewed proof.
