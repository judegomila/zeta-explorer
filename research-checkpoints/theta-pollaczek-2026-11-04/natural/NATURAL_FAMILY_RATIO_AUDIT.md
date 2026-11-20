# Independent audit of actual natural-Pollaczek derivative/source decay

2026-11-04. Reviewed NATURAL_FAMILY_RATIO_DRAFT.md, including its revised section 5 using the direct elementary bound on Z'. Verdict: the argument supports the stated favorable-family result H[M_n]/X[M_n]=O(1/log n). This is an internal mathematical audit, not external peer review or machine formalization. It inherits the supplied unconditional Hardy mean-square and finite-band theorem, whose precise hypotheses were checked against their use here.

The exact Fourier representation and inner bound were separately audited in INNER_ENVELOPE_AUDIT.md. The remaining delicate checks are recorded below.

## 1. Interior and turning-point envelope

For t in [n/4,2n], tau=t/(2n) lies in [1/8,1]. Put delta=1-tau. The phase derivative is n(tau-sech u), with stationary points +/-U and U=arcosh(1/tau). Uniformly over this interval U is bounded above; near tau=1 it is comparable to sqrt(delta).

When delta>=n^(-2/3), saddle neighborhoods of width c min(U,1), with small fixed c, have second derivative comparable to n sqrt(delta) and fixed sign. Their amplitude supremum plus variation is uniformly bounded, including cutoff variation, so van der Corput gives C n^(-1/2)delta^(-1/4).

On the complement, the lower bound |phi'|>=c n delta is sufficient for C/(n delta) by integration by parts. A detail worth retaining in a fully expanded proof is that phi' is monotone separately on each positive/negative half-axis, so the total variation of 1/phi' on each nonstationary component is O(1/(n delta)). Cutoff derivatives have size O(delta^(-1/2)) but support of length O(sqrt(delta)), hence bounded L1 norm. There is no extra delta^(-1/2) loss after integration. The inequality

    (n delta)^(-1) <= n^(-1/2)delta^(-1/4)

is exactly n delta^(3/2)>=1, the stipulated regime.

In the remaining delta<=n^(-2/3) range, the third phase derivative is n sech u(1-2tanh^2u), uniformly comparable to n on a fixed small neighborhood of zero. Third-derivative van der Corput gives O(n^(-1/3)); its complement is nonstationary. The same arguments apply to u times the amplitude, which is bounded on the fixed stationary region and decays at infinity.

The normalized Fourier prefactor is comparable to one on [n/4,2n], because

    C_n/[t^(lambda-1/2)sqrt(h_n)]
       is comparable to (n/t)^(lambda-1/2).

Thus squaring gives exactly the middle envelope [n(2n-t+n^(1/3))]^(-1/2). Differentiation includes only the u-amplitude term and bounded logarithmic derivatives, so the same envelope covers a Q_n'.

## 2. Deeper-contour exterior bound

The positive contour shift y=pi/2+epsilon is correct for the inverse kernel exp(+itu/2). With epsilon=n^(-1/3), the strip remains below the first cosh zero at pi. The exact modulus formulas in the draft hold.

The logarithm of |tanh((u+iy)/2)| has its maximum log tan(y/2) at u=0. Relative to that maximum it decreases by at least c epsilon u^2 for |u|<=1, and by at least c epsilon for |u|>=1. These statements follow directly by differentiating the explicit cosh-u ratio and hold uniformly for small epsilon. A Gaussian integral near zero therefore supplies (n epsilon)^(-1/2)=n^(-1/3); the outside part is exponentially smaller in n epsilon and has integrable amplitude. The same estimate holds with an additional 1+|u| factor.

The exponent after removing sqrt(W)'s gamma exponential is

    -t epsilon/2+n logtan(pi/4+epsilon/2)
       =-(t-2n)epsilon/2+O(n epsilon^3).

Since n epsilon^3=1, this yields the claimed exponential decay on the n^(1/3) scale. The remaining normalized prefactor is at most C for t>=2n at lambda=9/4. Squaring proves the n^(-2/3) exterior majorant. Derivatives are controlled by the extra u factor, bounded y, and bounded W'/W. There is no missing t- or n-growing derivative term.

Together with the inner audit this proves the global pointwise majorant. Its pieces can be joined by bounded-variation or smooth dominating interpolations. Their integrals and total variation have exactly the orders in (7); the origin contributes O(log^2 n/n) variation, and the turning/tail portions O(n^(-2/3)).

## 3. Hardy mean-square integration

Stieltjes integration by parts uses the nonoscillatory majorant, not Q_n'^2 itself. On [2,Kn], with any sufficiently large fixed K>2, the supplied cumulative remainder contributes

    O(n^theta)[v_n(2)+v_n(Kn)+TV(v_n)] = o(1).

In fact theta<2/3 would already suffice for this particular estimate; the supplied theta<1/3 is more than sufficient. The main density contributes O(log n) by the bounded mass and logarithmic moment of v_n. On [0,2] the cost is O(log^2 n/n). In the tail, the explicit exponential decay and its derivative allow the same Stieltjes argument on [Kn,infinity); its boundary term at infinity vanishes. Evenness supplies the negative axis.

This establishes both integral F^2Q_n^2 and H[Q_n] <= C h_n log n. The constants do not depend on parity.

## 4. Bulk stationary phase and local profiles

On a fixed compact subinterval of (0,2), the two saddles are uniformly separated, nondegenerate, and have nonzero amplitudes. Stationary phase after smooth localization, with repeated integration by parts off the saddles, gives the asserted relative-envelope O(1/n) remainder. Applying the same procedure with amplitude uA proves the first-derivative expansion without differentiating an unproved remainder.

The two saddle terms are conjugate after the overall (-i)^n parity factor. The resulting real oscillation has a nonvanishing smooth amplitude. Gamma normalization and the rational a/sqrt(W) factor contribute smooth uniform leading amplitudes with smaller O(1/n) corrections. The physical phase derivative is U/2+O(1/n)=kappa(T/n)+O(1/n), and its second derivative is O(1/n). Thus (8) and the Taylor estimate (9) on |u|<=n^(1/10) are consistent, including their derivative statement. The errors are absolute relative to the envelope, not relative to a cosine which may vanish.

## 5. Uniform finite-band family and revised direct transfer

The supplied BANDLIMITED_TOP_MODE_LOWER_BOUND.md section 2A was read directly. Its proof depends only on a fixed bandwidth, a lower L2 norm bound, and uniform pointwise decay bounds for the envelope and its derivative relative to that norm. The proposed cosine/sine family has these properties uniformly: kappa ranges over a compact interval bounded away from zero, its two-by-two Gram matrix is strictly positive for each kappa, and its minimum eigenvalue stays positive by compactness. One common finite bandwidth covers the whole family. Thus using a continuously varying two-dimensional space, rather than literally one fixed space, does not exceed the hypotheses actually used in that proof.

The revised transfer using |Z'(t)|<=C(1+|t|) is valid. Locally r_T=O(B_T(1+u^2)/n) and |Z'(T+u)|=O(n); the fixed fourth moment of chi^2 gives error O(B_T), negligible beside B_T log n. No sharp zeta derivative bound or differentiated Riemann–Siegel remainder is needed.

Globally the envelope gives |f_n|<=C sqrt(h_n)n^(-1/3), hence |f_n|/B_T<=C n^(1/6). With |chi|<=C(1+|u|)^(-40), the squared tail error divided by B_T^2 is bounded by

    C n^(1/3) integral_(|u|>n^.1) (1+|u|)^(-80)(n+|u|)^2 du.

The part n^.1<|u|<n is O(n^(7/3-79/10)), and the remaining part is O(n^(1/3-77)); both tend to zero. The model cosine satisfies the same bound. This verifies (12) with considerable room in the exponents.

The local actual derivative floor follows by the reverse triangle inequality, and integrating over a center interval of length comparable to n gives the stated global lower bound via Fubini. No local bound for the actual Z^2 mass is assumed.

## 6. Source combination and limitations

The exact decomposition

    TQ_n=2f_n Z'+aZQ_n'+2g f_n Z

has the correct coefficient of g=a'/a. The two remainder terms have norm O(sqrt(h_n log n)), while the established first term has norm bounded below by a positive constant times sqrt(h_n)log n. Their relative size tends to zero, so cancellation cannot destroy the source floor. This proves X[Q_n]>=c h_n log^2 n and hence H[M_n]/X[M_n]=O(1/log n).

This is a valid explicit unselected-family conclusion. The manuscript correctly disclaims relative X-near-minimality, selected inverse-column control, Delta positivity, and selected U/Delta decay. None follows merely by combining this ratio with subexponential near-extremality.

No substantive mathematical correction was identified. Cosmetic: the revised local transfer jumps from equation (12) to (14). Clarifying K>2 when splitting the tail would also improve exposition. Neither affects the result.

## Final filename and arithmetic-scale corollary

The main final filename is NATURAL_FAMILY_RATIO.md. The parent reports only the audited cosmetic changes from NATURAL_FAMILY_RATIO_DRAFT.md: specifying fixed K>2 in the tail split and renumbering the skipped equation. The proof audited above is unchanged.

The algebraic extension NATURAL_GAMMA_REFERENCE.md was also checked, as documented in INNER_ENVELOPE_AUDIT.md: its exact rational envelope ratio, normalized recurrence coefficients, multiplication and derivative operator bounds, two-sided subexponential comparison, and monic/Gram consequences are valid.

The following separate arithmetic corollary, intended for ARITHMETIC_SCALE_COROLLARY.md, passes under the supplied cumulative derivative-moment input

    integral_0^T Z'(t)^2 dt
       =(T/12)P_3(log T)+O(T^(5/12)log^3 T).

The same nonoscillatory majorant v_n has bounded mass, logarithmic moments of order O(log^3 n), and variation O(n^(-2/3)+log^2 n/n). Stieltjes integration by parts on [2,Kn], with K>2 fixed, bounds the derivative-moment remainder by

    O(n^(5/12)log^3 n [n^(-2/3)+log^2 n/n])
       =O(n^(-1/4)log^3 n+n^(-7/12)log^5 n)=o(1).

Its boundary terms are covered by the same envelope bounds. The bounded interval and exponential tail are controlled as in the main proof. Thus

    integral v_n Z'^2 <= C log^3 n,
    integral f_n^2 Z'^2 <= C h_n log^3 n.

Combining this upper bound with the exact source decomposition and the already established mass and H bounds gives

    X[M_n] <= C b_n log^3 n,
    A_n <= C b_n log^3 n,

where b_n=(4pi/2^(9/2))n!Gamma(n+9/2). Together with the audited source lower bound for the explicit competitor, this yields c b_n log^2 n <= X[M_n] <= C b_n log^3 n.

Let pi_(n-1) be the ordinary monic minimizer for w=F^2 in the relevant derivative parity. Testing it with M_(n-1) and using the proven mass bound gives

    B_n=n^2||pi_(n-1)||_w^2
       <= C n^2 b_(n-1)log n
       <= C b_n log n,

because exactly

    b_n/b_(n-1)=n(n+7/2),
    n^2 b_(n-1)/b_n=n/(n+7/2)<=1.

Use log(n+2) and absorb finitely many small degrees for all-degree statements. This remains an upper bound on B_n, not a comparison establishing its separation from the selected A_n. The known selected lower bound exp(-C log^2(n+2))b_n does not dominate Cb_nlog(n+2). Therefore selected Delta positivity, a selected H/X ratio, and selected coherence do not follow from this corollary.
