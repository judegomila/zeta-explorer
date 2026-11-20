# Actual-theta derivative/source decay for the natural Pollaczek family

2026-11-04. Analytic result with an independent AI-assisted audit; not external peer review or machine formalization. This is a theorem for an explicit unselected family, not a selected-polynomial theorem. The proof uses the Fourier representation established in UNIFORM_INNER_ENVELOPE.md and the supplied unconditional scalar Hardy mean and finite-band top-mode theorem. It does not invoke an unavailable global asymptotic theorem.

## Statement

Let lambda=9/4, Q_n(t)=P_n^(lambda)(t/2;pi/2), M_n=n!Q_n, W=|Gamma(lambda+it/2)|², and h_n=integral WQ_n². For the actual theta F=aZ and T p=Fp'+2F'p, there are constants c,C>0 such that, for all sufficiently large n of either parity,

    integral F² Q_n² + H[Q_n] <= C h_n log n,             (1)
    integral a² Q_n² Z'² >= c h_n log² n,                 (2)
    X[Q_n] >= c h_n log² n.                              (3)

Consequently

    H[M_n]/X[M_n] <= C/log n -> 0.                        (4)

No assertion that X[M_n]/A_n tends to one is made. Thus (4) does not transfer to the selected P_n merely from exponential-scale near-extremality.

## 1. Exact Fourier input and notation

Write g=a'/a, a bounded smooth function. Up to the fixed normalization of theta,

    a²/W=16(t²+1/4)/(t²+25/4),

which is bounded above and below by positive constants. Put f_n=aQ_n. The exact shifted inverse transform in UNIFORM_INNER_ENVELOPE.md is

    WQ_n = C_n(-i)^n exp(-pi t/4) I_(n,t),
    C_n=Gamma(n+2lambda)/(2^(2lambda)n!),
    I_(n,t)=integral exp(i[tu/2+n theta(u)]) A_lambda(u)du,
    theta'(u)=-sech u,
    |A_lambda^(j)(u)|<=C_j exp(-lambda|u|).

Differentiation in t replaces A by iuA/2 and adds the bounded extracted-exponential derivative. W'/W is bounded. Also h_n=(4pi/2^(2lambda))Gamma(n+2lambda)/n! is comparable to n^(2lambda-1).

## 2. A global nonoscillatory majorant

There is a nonnegative piecewise smooth function v_n on [0,infinity), smoothly joinable after multiplication by a fixed constant, such that

    f_n(t)² + a(t)²Q_n'(t)² <= C h_n v_n(t),              (5)

and with the following envelopes:

    v_n(t) = n^(-1)[1+log²(n/(1+t))],       0<=t<=n/4;
    v_n(t) = [n(2n-t+n^(1/3))]^(-1/2),     n/4<=t<=2n;
    v_n(t) = n^(-2/3)exp[-c(t-2n)/n^(1/3)], t>=2n.       (6)

The constant c>0 is fixed. The pieces at n/4 are comparable and those at 2n agree. The harmless replacement of n by n+2 near small degrees is understood. These envelopes have

    integral v_n=O(1),
    TV(v_n)=O(n^(-2/3)+n^(-1)log²n),
    integral v_n log(2+t)=O(log n).                       (7)

Here is a proof of (5), including the transition and tail.

### Origin

For t<=n/4, (5) follows from the uniform inner envelope and its differentiated version, proved by contour shift and stationary/nonstationary partitions in UNIFORM_INNER_ENVELOPE.md. Its proof covers t bounded, so it does not silently use Stirling at t=0.

### Interior and transition

For t in [n/4,2n], set tau=t/(2n), delta=1-tau. The shifted phase derivative is n(tau-sech u).

If delta>=n^(-2/3), the two stationary points ±U, U=arcosh(1/tau), satisfy U comparable to sqrt(delta) when delta is small. In neighborhoods of ±U of width a fixed sufficiently small multiple of min(U,1), the second derivative has magnitude comparable to n sqrt(delta) and fixed sign. The amplitude supremum plus variation on each neighborhood is bounded. Second-derivative van der Corput therefore gives

    |I_(n,t)| <= C n^(-1/2)delta^(-1/4)

for these pieces. On their complement in a fixed bounded interval, the first derivative has magnitude at least c n delta. One integration by parts, including the cutoff derivatives of size O(delta^(-1/2)), bounds these complementary pieces by C/(n delta). This is at most the preceding bound because n delta^(3/2)>=1. Outside that bounded interval the derivative is comparable to n and exponential amplitude decay gives O(n^(-1)).

If 0<=delta<=n^(-2/3), use a fixed neighborhood of u=0 where the third derivative of the phase has magnitude at least c n. Third-derivative van der Corput gives C n^(-1/3). The remaining region is nonstationary and contributes O(n^(-1)).

The identical arguments hold with amplitude uA, since this amplitude and its derivatives are bounded on the stationary neighborhoods and decay exponentially at infinity. The prefactor C_n exp(-pi t/4)/sqrt(W h_n) is bounded above and below by positive constants for t in [n/4,2n]. This proves both terms in (5) with the middle majorant in (6).

### Exterior, using a slightly deeper contour

For t>=2n shift (3) of UNIFORM_INNER_ENVELOPE.md to Im u=y=pi/2+epsilon with epsilon=n^(-1/3), for n sufficiently large that y<pi. Cosh remains nonzero in this strip. On this line,

    |tanh((u+iy)/2)|²=(cosh u+sin epsilon)/(cosh u-sin epsilon),
    |sech((u+iy)/2)|^(2lambda)=[2/(cosh u-sin epsilon)]^lambda.

The first ratio is maximal at u=0. Its logarithm has quadratic decrease at least c epsilon u² for |u|<=1, and decrease at least c epsilon for |u|>=1, relative to its maximum. The amplitude is uniformly bounded near zero and exponentially decaying at infinity. Consequently the absolute integral, also with an extra factor 1+|u|, is bounded by

    C(n epsilon)^(-1/2) exp[n log tan(y/2)]
       <= C n^(-1/3) exp[n epsilon+C n epsilon³].

The last inequality uses logtan(pi/4+epsilon/2)=epsilon+O(epsilon³). After dividing by sqrt(W), the contour exponential contributes exp(-t epsilon/2). Since n epsilon³=1, the combined exponential is bounded by

    C exp[-(t-2n)/(2n^(1/3))].

The remaining normalized prefactor is bounded by C(n/t)^(lambda-1/2)<=C for t>=2n. This proves the exterior part of (5), also after differentiation, with some fixed c>0. The shift sign is positive because the inverse Fourier kernel here is exp(+itu/2).

## 3. Ordinary Hardy moments prove the global upper bounds

Use the supplied unconditional cumulative formula

    A_0(x)=integral_0^x Z²
          =x(log(x/(2pi))+2gamma-1)+O(x^theta),
    theta=1515/4816+epsilon_0<1/3,

for x>=2. Fix any K>2. On [2,Kn], Stieltjes integration by parts against v_n bounds the remainder by

    C n^theta [v_n(2)+v_n(Kn)+TV(v_n)] = o(1).

The main density contributes O(log n) by (7). On [0,2], smoothness gives a bound O(log²n/n). The exponentially decreasing tail beyond Kn has the same estimate by applying integration by parts with |R_0(t)|<=Ct^theta directly; alternatively split into unit intervals. Thus

    integral_0^infinity v_n Z² <= C log n.

Evenness extends this to R. Equation (5) proves (1). In particular no bounded-variation estimate is applied directly to the highly oscillatory Q_n² or Q_n'².

## 4. Uniform bulk cosines from the same integral

Fix 0<a<b<2, for example a=1/2,b=1. On T/n in [a,b], the two stationary points of I_(n,T) are separated and nondegenerate uniformly. Ordinary stationary phase with its differentiated expansion gives

    f_n(T)=sqrt(h_n/n) A(T/n) cos Phi_n(T)
                          +O(sqrt(h_n/n)/n),             (8)

where A is smooth, bounded above and below by positive constants on a slightly larger compact interval. The two stationary contributions are conjugate after the overall parity phase, since Q_n is real. Their saddle amplitudes are nonzero, so A does not vanish. The phase satisfies

    Phi_n'(T)=kappa(T/n)+O(1/n),
    kappa(x)=(1/2)arcosh(2/x),
    Phi_n''(T)=O(1/n).

The corresponding first derivative expansion has the same O(1/n) relative-envelope remainder; this follows by applying stationary phase to the amplitude uA in the differentiated transform, not by differentiating an unproved remainder.

Let B_T=sqrt(h_n/n)A(T/n), phi_T=Phi_n(T), and kappa_T=kappa(T/n). On |u|<=n^(1/10), (8), its derivative expansion, and Taylor's theorem give

    f_n(T+u)=B_T cos(phi_T+kappa_T u)+r_T(u),
    |r_T(u)|+|r_T'(u)|
         <= C B_T(1+u²)/n.                              (9)

All constants are uniform in the center T and phase phi_T. The exact value of the phase offset is irrelevant to the lower bound.

## 5. Transfer the fixed-band derivative floor, retaining the actual Hardy function

Choose once and for all chi(u)=sinc(omega u)^(2m), with fixed omega>0 and sufficiently large integer m, e.g. m=20. It is band-limited, and chi and its derivative have uniform polynomial decay of arbitrarily high fixed order. The functions

    g_T(u)=chi(u) cos(phi_T+kappa_T u)

belong to a compact family of two-dimensional band-limited spaces, since kappa_T ranges over a compact interval strictly inside (0,infinity). Their L² norms are uniformly bounded above and below, for all phases; this follows from positivity and continuous dependence of the two-by-two Gram matrix of chi cos(kappa u), chi sin(kappa u). Their decay and coefficient constants are uniform. Thus all constants in the supplied finite-band nilpotent-inversion theorem and scalar-error transfer are uniform over this family.

The supplied actual-Hardy-Z finite-band theorem (Section 2A of BANDLIMITED_TOP_MODE_LOWER_BOUND.md), whose proof uses scalar Riemann–Siegel errors rather than differentiated remainders, therefore gives

    ||g_T Z'(T+.)|| >= c log T                           (10)

uniformly over this compact frequency/phase family.

We must replace the model cosine by the actual f_n. The elementary Euler-summation derivative bound is

    |Z'(t)| <= C(1+|t|).

On |u|<=n^(1/10), (9) and the fixed finite fourth moment of chi² give

    ||chi r_T Z'(T+.)||_(local)
       <= C B_T [integral chi²(1+u²)²]^(1/2)=O(B_T).     (11)

This is o(B_T log n), which is sufficient. There is no need for relative approximation at zeros of Z'.

Outside this window, the global envelope (5) gives

    |f_n(t)| <= C sqrt(h_n)n^(-1/3)

uniformly on R after increasing C. Dividing by B_T gives at most C n^(1/6). For |u|>n^.1, the elementary bound |Z'(T+u)|<=C(n+|u|), together with |chi(u)|<=C(1+|u|)^(-40) for m=20, makes

    integral_(|u|>n^.1) chi² n^(1/3)(n+|u|)²du=o(1).

The model cosine is bounded and has the same cutoff tail estimate. Hence

    ||chi(f_n(T+.)-B_T cos(phi_T+kappa_T .))Z'(T+.)||
         =O(B_T)+o(B_T)=o(B_T log n).                    (12)

Combining (10)-(12) with the reverse triangle inequality, for all sufficiently large n uniformly in T in [an,bn],

    integral chi(t-T)² f_n(t)² Z'(t)² dt
         >= c B_T² log²n >= c(h_n/n)log²n.              (13)

This is an absolute floor, not a pointwise claim at zeros of Z, and uses no differentiated Riemann–Siegel error.

Integrate (13) over T in [an,bn]. Fubini and

    integral_(an)^(bn) chi(t-T)²dT <= ||chi||²

give (2).

## 6. Source lower bound and ratio

The exact source decomposition is

    TQ_n=2f_nZ'+aZQ_n'+2g f_nZ.

By (1) and boundedness of g, the norm of the last two terms is O(sqrt(h_n log n)). By (2), ||2f_nZ'||>=c sqrt(h_n)log n. The reverse triangle inequality proves (3). Dividing (1) by (3) proves (4). Multiplying by n! changes neither ratio nor any conclusion.

## Scope and audit targets

The delicate steps for independent review are the global oscillatory-integral partition in Section 2, the deeper-contour exterior bound, and the uniform local-profile/weighted-error transfer in Sections 4-5. Each is specified with its scale and normalization. The argument uses only standard one-dimensional stationary-phase/van der Corput estimates and the exact Fourier integral, not a claim that fixed-t Darboux asymptotics are globally uniform.

Even after verification, this is a favorable family result. It gives no relative X-near-minimality, no selected inverse-column estimate, and no proof of Delta positivity or U/Delta decay for the selected polynomials.
