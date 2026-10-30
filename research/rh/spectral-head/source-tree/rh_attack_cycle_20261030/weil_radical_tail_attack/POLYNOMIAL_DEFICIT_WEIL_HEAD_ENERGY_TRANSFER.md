# Polynomial-deficit transfer to actual Weil head energy

> Curated mathematical source or internal audit. All mathematical sections are retained. Historical producer headers may predate acceptance; current claim scope follows the paired audit and module, not those old workflow labels. Original and published SHA-256 identities are recorded in the dependency inventory. Internal review is not external peer review.

30 October 2026. **Producer theorem, independent review pending, conditional only on acceptance of the separately submitted exact radical-domain note.** All other inputs are independently accepted. This concerns the compression of the ACTUAL supported Weil quadratic form. It does NOT prove the full Weil-action residual on the head or its coupling to the complement. No numerical run.

## 1. Claimed limited gain

Fix A>3. In the actual positive-even prolate head, retain modes with concentration deficit delta_n=1-chi_n^2<=lambda^(-A), and impose mean zero and the two source traces g(0)=g(lambda)=0. Let

    F_g=P_ell S E(g), ell=log lambda, S=(I+reflection)/2.

Then, for sufficiently large lambda with an unspecified onset,

    |q_lambda(F_g,F_g)|
       <=C_A lambda^(3-A)(1+log lambda)^3 ||F_g||^2.       (1)

Here q_lambda is precisely the actual 5/4-normalized supported Weil form. In particular A=4 gives a vanishing head ENERGY norm O(lambda^-1 log^3 lambda). This is not an assertion that ||H_lambda F_g|| has that bound.

An explicit guaranteed-prefix input may be chosen with dimension

    lambda^2-(A/pi^2)(log lambda)^2+O_A(log lambda),       (2)

up to the at-most-three source conditions. Thus, for head-energy purposes only, a cutoff exponent A>3 is sufficient in this argument; the prior exponent8 is not required for this narrower conclusion. The separate action/bridge residual theorem remains unchanged.

## 2. Restricted endpoint spectral row retains the deficit factor

Set c=2pi lambda^2, k=2pi lambda, b_n=e_n(lambda), and let r be the admitted subcritical reference. Put a=lambda^(-A). We first prove

    sum_(delta_n<=a)|b_n|^2(nu_n-nu_r)^2
        <=C_A lambda c^2 a[log(10/a)]^3.                 (3)

The uniform KRD transition bound implies, for 0<t<1/4,

    #{n in the threshold head: delta_n>=t}
        <=C(1+beta)log(10/t), beta=O(log c),              (4)

with harmless endpoint allowances. For F(t)=t log^2(10/t), F is increasing on this range. Layer cake, overcounting modes with delta_n>a if necessary, gives

    sum_(delta_n<=a) delta_n log^2(10/delta_n)
      <=integral_0^a F'(t)#{delta_n>=t}dt
      <=C(1+beta)a log^3(10/a).                         (5)

Choose the fixed auxiliary exponent B=A+6. On lambda^(-B)<=delta_n<=a, the accepted uniform polynomial-deficit action strip and logarithmic endpoint/leakage bound give

    |nu_n-nu_r|<=40c log(10/delta_n),
    |b_n|^2<=C_B lambda delta_n/log c.                   (6)

Combining (5),(6) cancels beta/log c and proves (3) on this shallow part. On delta_n<lambda^(-B), use the admitted global estimates |b_n|^2<=C lambda delta_n and |nu_n-nu_r|<=2c^2, together with the uniform first moment

    sum_(delta_n<=b)delta_n<=C(1+beta)b log(10/b).

This deep contribution is at most C_B lambda c^4 lambda^(-B)log^2 lambda. Since B-A=6 and c^2=O(lambda^4), it is smaller than the right side of (3). This estimates the entire deep tail by its mass, not its cardinality.

## 3. A weighted value bound for the actual exterior tail

Normalize ||g||add=1 temporarily and write

    N_A=lambda^(-A)[log(10lambda^A)]^3.

The complete divided-difference identity and g(lambda)=0, now with (3), give

    |H(t)|^2<=C_A N_A lambda^3/t^4, t>=2lambda,
    |Ug(s)|^2<=C_A N_A exp(-3s), s>=log2,                 (7)

where H=F(g zero-extended) and Ug(s)=sqrt(2lambda)exp(s/2)H(lambda exp s). On the near exterior interval the exact deficit isometry gives ||Ug||^2=D(g)<=lambda^(-A).

The fixed weight exp(s) is legitimate for VALUES: the far integral has denominator 3-2=1. For m>=2 the usual substitution in R_m Ug=m^(-1/2)Ug(s+log m) gives

    ||exp(s)R_m Ug||^2<=C_A N_A m^-4.                    (8)

For m=1 the interval[0,log2] costs at most4D(g), and the rest follows from (7), so (8) holds also at m=1. This extension to weight1 is a direct value calculation; it does not extend the accepted translation theorem beyond its stated weight margin.

The exact two-tail profile from the radical note is

    a_tail=(1/(2sqrt2))sum_(m>=1)R_m Ug.

Minkowski and sum m^-2<infinity show

    ||exp(s)a_tail(s)||_(L^2(0,infinity))^2<=C_A N_A.      (9)

No source repair is hidden: g already has mean zero and both required traces.

## 4. Gamma energy from a small value norm and a polynomial fractional graph

Let a_0 be a_tail extended by zero to the negative half-line. The independently accepted unweighted translation estimate at epsilon=1/2 gives

    ||Delta_h R_m Ug||^2<=C lambda h^(1/2)m^(-7/2),
                                      0<h<=1/2.

Minkowski and sum m^(-7/4)<infinity therefore imply

    ||Delta_h a_0||^2<=C lambda h^(1/2).                  (10)

The boundary strip in this estimate is included. Consequently, for a fixed 0<s0<1/4, the difference-quotient characterization gives

    ||a_0||_(H^s0)^2<=C_s0 lambda.                        (11)

Let n0=||a_0||^2<=C_A N_A. Applying Jensen to the probability measure |ahat_0(t)|^2dt/n0, and using (11), gives

    |Gamma[a_0]|
       <=C n0[1+log(2+C lambda/n0)]
       <=C_A N_A[1+log(2+C_A lambda/N_A)].               (12)

The zero vector is treated separately. The function n log(2+B/n) is increasing, so the second inequality is valid even when the actual norm is much smaller than its upper bound. Since A is fixed, the last logarithm is O_A(log lambda).

This avoids differentiating the infinite arithmetic sampler row term by term. The raw derivative norms of individual samplers need not be summable; (10) is the legal substitute.

## 5. Same-tail and cross-tail arithmetic, with the growing bridge retained

Equation(9) gives |R_(a_0,a_0)(r)|<=C_A N_A exp(-|r|). Hence the SAME-tail prime and continuum contributions in the actual form have absolute value at most C_A N_A, since sum Lambda(n)n^(-3/2)<infinity.

For the separated tails write C_tail(s)=(conjugate(a_tail)*a_tail)(s). Again Cauchy--Schwarz gives

    |C_tail(s)|<=C_A N_A exp(-s),
    |L_(a_tail)(-1/2)|^2<=C_A N_A.                        (13)

The exact cross formula, not a one-tail replacement, is

    q(t_-,t_+)=lambda|L_(-1/2)|^2
       -sum_(n>lambda^2)Lambda(n)/sqrt(n)
                                     C_tail(log(n/lambda^2))
       -sum_(m>=0)lambda^(-4m-5)|L_(2m+5/2)|^2.          (14)

The classical unconditional Chebyshev bound sum_(n<=x)Lambda(n)<=C x, or the already admitted PNT, implies by partial summation

    sum_(n>lambda^2)Lambda(n)n^(-3/2)<=C/lambda.

Thus (13),(14) give |q(t_-,t_+)|<=C_A lambda N_A. This step retains the full scale-lambda absolute bridge loss; it does not claim to exploit cancellation in that bridge. Its smallness here comes only from the sufficiently small concentration deficit.

Combining the two same-tail copies, (12), and the full quadratic cross factor2,

    |q(Q_ell S E(g))|
      <=C_A N_A[lambda+log(2+C_A lambda/N_A)]
      <=C_A lambda^(1-A)(1+log lambda)^3.                (15)

The exact radical-domain theorem then gives q(F_g)=q(Q_ell S E(g)). This is the sole use of the separately submitted radical identity.

## 6. Actual output normalization and head-energy conclusion

The accepted iterated-log coordinate theorem gives, on its trace-null deep sector,

    ||P_ell S E(g)||>=kappa/lambda ||g||add,
    kappa=a_*/(8sqrt2)>0.

For fixed A>0, lambda^(-A) is eventually below that theorem's slow deficit cutoff. Therefore its lower Gram applies to the present input sector. Restoring the input norm in (15) and dividing by this actual output norm yields (1).

For an explicit guaranteed prefix, KRD Corollary3 permits all positive-sign labels n divisible by4 satisfying

    n<=floor(4lambda^2)-7-beta log(10lambda^A),
    beta=(2/pi^2)log(200lambda^2+25).

Their count is (2), before the at-most-three source conditions. The coordinate Gram makes the image injective. The quadratic estimate (1), valid for every complex combination in this image, is equivalently a small norm for the Hermitian HEAD COMPRESSION of q_lambda. Adding a fixed M>0 gives a head reserve M-o(1) in the physical output norm.

Neither (1) nor the radical identity bounds the off-head vector H_lambda F_g. The term q(F_g,h) for an arbitrary complementary physical h is a different boundary/tail coupling problem. The formerly accepted lambda^(-8) actual-action residual theorem, its bridge bounds, the full even Fourier tail certificate, and the external gamma-complement question are not replaced or strengthened automatically.

## 7. Dependency and scope ledger

- Separate source `EXACT_RADICAL_WINDOW_IDENTITY_AND_TWO_TAIL_BRIDGE.md`: actual paired-form identity, finite-regularity source domain, and both exterior tails. This is the sole newly submitted prerequisite.
- Accepted `../gamma_complement_attack/ITERATED_LOG_COORDINATE_TRANSITION_REDUCTION.md`: coordinate Gram only, used solely for actual output normalization.
- Accepted action-strip, endpoint/leakage, uniform value, and additive translation notes: the explicit row and fractional-graph inputs above.
- Classical Chebyshev/PNT controls the absolute cross-prime sum, with its factor lambda left visible.

No new support endpoint, complement coercivity, all-support Rayleigh floor, or RH theorem follows. The proposed gain is a less restrictive polynomial cutoff for a near-zero ACTUAL WEIL HEAD ENERGY, not a completed signed bridge estimate.
