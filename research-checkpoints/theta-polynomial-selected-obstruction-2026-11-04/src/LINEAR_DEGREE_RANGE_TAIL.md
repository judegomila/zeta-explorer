# An actual-theta tail beyond a linear degree range

2026-11-04. Independent analytic audit. The proposed estimate is valid. It gives exponentially small source, derivative, mass, and signed-excess tails beyond an explicit linear range, uniformly over the entire polynomial space of degree at most n. It does not establish selected coherence or uniform escaping-cell capacity bounds. No frozen proof or live 4CT file is changed.

## 1. Statement and inputs

Let F be the actual real theta transform, with its fixed normalization, and put

    Tp = Fp' + 2F'p,       X[p] = integral_R |Tp|²,
    V = 2(F'² − FF''),
    W_*(t) = |Gamma(9/4 + it/2)|²,
    W_4(t) = |Gamma(4 + it/2)|²,
    c = pi/2,   A = 6/c = 12/pi,
    kappa = 2 − log 6 > 0,   N = n+2,   L = log(n+2).

For every integer n>=1 and every real polynomial p of degree at most n,

    integral_(|t|>=An) [ |Tp|² + F²|p'|² + |V||p|² + F²|p|² ] dt
       <= C N^11 L^(3/4) exp(−2 kappa n) X[p].          (1)

Consequently, for each fixed 0<eta<4−2log 6,

    integral_(|t|>=An) [ |Tp|² + F²|p'|² + |V||p|² + F²|p|² ] dt
       <= C_eta exp(−eta n) X[p].                      (2)

All constants are independent of n and p. The endpoint eta=4−2log 6 is not asserted without the polynomial prefactor. Numerically A is approximately 3.81972 and the allowed exponential rate endpoint is approximately 0.416481.

The inputs are:

(a) The actual-source floor proved in
../theta_polynomial_comparison_20261104/GENERAL_REFERENCE_AND_NATURAL_COROLLARIES.md:

    ||p||_(W_*)² <= C N L^(3/4) X[p].                  (3)

(b) The elementary actual-theta derivative envelope, justified in section 4 of
../theta_actual_capacity_20261104/ZERO_SURGERY_PRESERVES_SHARP_REFERENCE_BOUNDS.md:

    F² + F'² + F''² <= C W_4.                          (4)

This use is of the actual baseline F, not the surgically altered model. In particular |FF''|<= (F²+F''²)/2 and |V|<=C W_4.

(c) The natural-reference derivative inequality, also proved directly below:

    ||p'||_(W_*)² <= [(n+1)pi²/8] ||p||_(W_*)².       (5)

No arithmetic trial-family source upper or derivative moment theorem is needed here.

## 2. Explicit elementary exterior estimate

For any polynomial q of degree at most n define

    M_c(q) = sup_(t in R) exp(−c|t|/2)|q(t)|.

Take B=2n/c. On [−B,B],

    sup |q| <= exp(cB/2) M_c(q).

The Chebyshev exterior inequality and |T_n(x)|<=(2x)^n for x>=1 give, with r=|t|>=B,

    exp(−cr/2)|q(t)|
       <= M_c(q) exp[ n log(2r/B) + cB/2 − cr/2 ].    (6)

This is valid for degree at most n, not just exact degree n. The standard real-polynomial Chebyshev bound also applies to a complex q by rotating its value at the evaluation point to the positive real axis and applying the real bound to the real part. Only real polynomials are required for the stated application.

Write E(r) for the exponent in (6). At r=An=6n/c,

    E(An)=n(log 6−2)=−kappa n.

For r>=An,

    E'(r)=n/r−c/2 <= c/6−c/2=−c/3.

Therefore

    exp(−c|t|/2)|q(t)|
       <= M_c(q) exp[−kappa n−(c/3)(|t|−An)],
                                                    |t|>=An. (7)

The same n is used for q=p and q=p', even when p' has smaller degree or is constant. There is no n−1 versus n threshold shift.

## 3. Integrating the exterior and capturing the weighted maximum

Stirling, together with compact-interval positivity, gives global comparisons

    W_4(t) comparable to (1+|t|)^7 exp(−c|t|),
    W_*(t) comparable to (1+|t|)^(7/2) exp(−c|t|).

Squaring (7), putting u=|t|−An, and integrating gives

    integral_(|t|>=An) W_4(t)|q(t)|² dt
       <= C (n+1)^7 exp(−2kappa n) M_c(q)².            (8)

Indeed 1+An+u <= (1+An)(1+u), and the integral of
(1+u)^7 exp(−2cu/3) over u>=0 is a finite constant.

Here is a direct proof of the required weighted maximum capture:

    M_c(q)² <= C(n+1)² ||q||_(W_*)².                  (9)

For q nonzero the weighted maximum is attained at some t_0, since the weighted polynomial tends to zero at both infinities. On J=[t_0−1,t_0+1],

    sup_J |q| <= exp(c(|t_0|+1)/2) M_c(q).

Markov's inequality on this interval gives

    sup_J |q'| <= n² exp(c(|t_0|+1)/2) M_c(q).

Choose an absolute d>0 small enough that d exp(c/2)<=1/2. For
|t−t_0|<=d/(n+1)², the reverse triangle inequality gives

    |q(t)| >= (1/2) exp(c|t_0|/2) M_c(q).

On that interval exp(−c|t|)>=exp(−c|t_0|−cd), while
W_*(t)>=C^(-1)exp(−c|t|). Integration over its length proves (9).
The proof does not require a prior location bound on t_0. It also covers constant q (or they can be checked separately). The zero polynomial is trivial.

Combining (8) and (9), with n>=1, gives

    integral_(|t|>=An) W_4|q|²
       <= C N^9 exp(−2kappa n) ||q||_(W_*)².          (10)

## 4. The derivative reference bound and the actual envelope

For completeness, put Q_j(t)=P_j^(lambda)(t/2;pi/2). Differentiating its generating function

    sum Q_j(t) z^j = (1−iz)^(−lambda+it/2)
                    (1+iz)^(−lambda−it/2)

in t multiplies the right side by arctan z. Thus

    Q_j' = sum_(1<=k<=j, k odd) (−1)^((k−1)/2) Q_(j−k)/k.

Their squared reference norms are

    h_j = (4pi/2^(2lambda)) Gamma(j+2lambda)/j!.

For lambda=9/4, h_j is nondecreasing. Orthogonality therefore gives

    ||(Q_j/sqrt(h_j))'||² <= sum_(k odd>=1) 1/k² = pi²/8.

The Hilbert–Schmidt norm squared of differentiation on the (n+1)-dimensional reference polynomial space is consequently at most (n+1)pi²/8. Its operator norm squared is no larger, proving (5).

For (4), the exact xi expression on |Im t|<=1/4 corresponds to 1/4<=Re s<=3/4. Euler summation bounds zeta(s) by C(1+|Im s|)^(1−Re s) there. The squared-modulus gamma asymptotic, quadratic xi factor, and this zeta estimate yield

    |F(t+iy)| <= C(1+|t|)^(19/8) exp(−pi|t|/4),
                                                     |y|<=1/4.

Cauchy estimates on a fixed smaller-radius disk give the same envelope for each fixed derivative on the real axis. Since 19/8<7/2 and sqrt(W_4) is comparable to
(1+|t|)^(7/2)exp(−pi|t|/4), (4) follows for F,F',F''. Bounded t is absorbed by a constant. This argument is unconditional.

## 5. Combining the estimates

Pointwise, (4), |V|<=C W_4, and |a+b|²<=2|a|²+2|b|² imply

    |Tp|² + F²|p'|² + |V||p|² + F²|p|²
       <= C W_4 (|p'|²+|p|²).

Apply (10) to p and p', then (5), then (3):

    tail <= C N^9 exp(−2kappa n)
                 [ ||p'||_(W_*)² + ||p||_(W_*)² ]
         <= C N^10 exp(−2kappa n) ||p||_(W_*)²
         <= C N^11 L^(3/4) exp(−2kappa n) X[p].

This is (1). For each eta<2kappa the function
N^11 L^(3/4) exp[−(2kappa−eta)n] is bounded over integers n>=1. This proves (2). The polynomial exponent 11 is an explicit sufficient estimate, not a claim of optimality.

## 6. Selected-polynomial and cell consequences, with the precise limitation

Let P_n be the monic X-minimizer and A_n=X[P_n]>0. Substituting p=P_n in (2), or p=P_n/sqrt(A_n), yields exponentially small normalized tails for all four displayed forms. More generally the assertion holds for every X-normalized polynomial of degree at most n, so no selected coefficient localization is being assumed.

For the cell notation w=F², v=(log w)', and g=F²p, away from real zeros one has

    v' w = 2(FF''−F'²)=−V,
    ((v')_+/w)|g|² = (−V)_+ |p|²,
    ((v')_−/w)|g|² = V_+ |p|²,

where x_−=max(−x,0). Thus both positive and negative excess integrals on |t|>=An are bounded by the |V||p|² term. The polynomial expression extends through every real zero; the discrete zero set does not affect these integrals.

Consequently the sum of either normalized excess over any family of whole real-zero cells entirely contained in {|t|>=An} is exponentially small for P_n. The same is true for the clipped exterior portions of any cells crossing the boundary. A cell merely intersecting the exterior need not have its whole integral controlled by this argument: its interior portion lies outside the proved tail set.

This removes arbitrarily distant, superlinear-scale polynomial source and excess mass from the obstruction. It does NOT control all escaping cells: a sequence of cells at heights tending to infinity while remaining inside |t|<=An is not addressed. It also does not control the full operator norm/capacity of an exterior cell on arbitrary cell test functions. The estimate is for a degree-bounded global polynomial subspace with the actual-source normalization.

In particular it supplies neither a small positive excess on the remaining linear range, nor the required negative-excess lower bound, nor H[P_n]/A_n tending to zero. No defect positivity, coherence, or RH conclusion follows from (1)–(2) alone.
