# Critical collar: reciprocal sampling removes all but polylogarithmic labels

> Curated mathematical source or internal audit. All mathematical sections are retained. Historical producer headers may predate acceptance; current claim scope follows the paired audit and module, not those old workflow labels. Original and published SHA-256 identities are recorded in the dependency inventory. Internal review is not external peer review.

30 October 2026. **Producer result, independent review pending.** No numerical run. This uses ordinary unconditional quantitative Mertens cancellation only in the slow, largest-label range. The middle-label estimate is elementary bandlimited sampling and uses no Mobius cancellation. The surviving small-label signed form is NOT asserted positive or small.

## 1. Exact object, bandwidth, and split

Let u,g lie in the actual positive-even head chi>=1/2. Let H be the Fourier transform of g extended by zero. On a physical collar 0<h<lambda the literal first-shell pairing is

    B_h(u,g)=-2 integral_lambda^(lambda+h) H(t) R_t(u)dt,
    R_t(u)=sum_(2<=j<=lambda t) [mu(j)/j]conjugate(u(t/j)). (1)

Endpoint equalities are immaterial. This is the exact full-even normalization, with the j^-1 substitution factor. The original upper cutoff j<=lambda t remains in every estimate below.

The exact inverse-chi profile q_u is supported in[-lambda,lambda], has ||q_u||<=2||u||add, and its Fourier transform f_u equals u on the visible interval. Consequently

    ||f_u||_2<=2||u||add,
    ||f_u'||_2<=2pi lambda ||f_u||_2,
    ||f_u||_infinity<=2sqrt(2lambda)||u||add,
    ||f_u'||_infinity<=4pi sqrt(2)lambda^(3/2)||u||add.   (2)

The last constant is deliberately loose. Samples in (1) are visible, so f_u can be substituted there exactly. No full-line arithmetic inverse is used.

Put w=1+log lambda, h=w^6/lambda, and choose the dyadic integer

    J0=2^ceil(log_2(w^8)),
    X=lambda^2/J0.                                      (3)

Thus w^8<=J0<2w^8. For sufficiently large lambda, J0<X, h<lambda, and all following ranges are nonempty when relevant. Split the actual labels into j<J0, J0<=j<=X, and X<j<=lambda t.

## 2. A self-contained separated-sampling inequality

If real points x_j are delta-separated and f,f' lie in L^2(R), then

    sum_j |f(x_j)|^2
       <=delta^-1||f||_2^2+2||f||_2||f'||_2.             (4)

To prove this, take disjoint intervals of length delta centered at the x_j. On each interval compare |f(x_j)|^2 to |f(x)|^2 using the integral of 2|ff'|, then average x and sum. This proof also applies to every subset of the sample points.

For j in[J,2J), t>=lambda, consecutive reciprocal nodes t/j are separated by at least lambda/(4J^2). Applying (4) and (2) gives

    sum_(j in S) |u(t/j)|^2
       <=16[J^2/lambda+pi lambda]||u||add^2               (5)

for any subset S of the dyadic block whose nodes are visible. Since sum_(J<=j<2J)j^-2<=1/J, Cauchy--Schwarz gives

    |sum_(j in S) [mu(j)/j]conjugate(u(t/j))|
       <=4 sqrt[J/lambda+pi lambda/J]||u||add.            (6)

Only |mu(j)|<=1 was used. The subset may include the moving truncation j<=lambda t, so (6) does not replace that truncation by a fixed interval.

## 3. The middle-label pairing tends to zero without arithmetic cancellation

Use ||H||_(L^2(lambda,lambda+h))<=||g||add, Cauchy--Schwarz in t, and (6). A dyadic block contributes at most

    8sqrt(h) sqrt[J/lambda+pi lambda/J]||u||||g||.        (7)

The square-root powers are geometric when summed over dyadic J. Covering J0<=j<=X by complete dyadic blocks and one truncated final block therefore gives

    |B_h^middle(u,g)|
        <=C sqrt(lambda h/J0)||u||||g||
         =O(w^-1)||u||||g||.                             (8)

For clarity, sum sqrt(J/lambda) is bounded by a constant times sqrt(X/lambda)=sqrt(lambda/J0), while sum sqrt(lambda/J) is bounded by a constant times sqrt(lambda/J0). There is no extra log(lambda) from counting the blocks.

This bound is uniform in the moving positive head, includes both ends of the middle range, and proves no cancellation statement about scalar reciprocal exponential sums.

## 4. Largest labels: ordinary quantitative Mertens is enough

Let M(x)=sum_(j<=x)mu(j). Use the unconditional theorem that there are constants C_M,b>0 and x0 such that

    |M(x)|<=C_M x exp(-b sqrt(log x)), x>=x0.             (9)

One primary source is Lee--Leong, *New explicit bounds for Mertens function and the reciprocal of the Riemann zeta function*, arXiv:2208.06141v5 (9 September 2026), Theorem 1.1, the displayed classical Mertens bound (PDF and HTML equation numbers differ):

<https://arxiv.org/pdf/2208.06141v5>.

Their displayed bound includes an additional log(x), which is absorbed into a weaker positive exponential constant in (9). We need only eventual decay, not their numerical constants or an RH-strength bound. The source was checked directly; no unpublished reciprocal-phase theorem is imported.

Write eta_X=C_M exp(-b sqrt(log X)) and assume X>=x0. For a fixed t in[lambda,lambda+h], set a=X, b_t=lambda t, and

    F_t(x)=conjugate(u(t/x))/x.

All samples t/x for a<x<=b_t lie in the visible interval. Abel summation retains BOTH cutoffs:

    sum_(a<j<=b_t)mu(j)F_t(j)
       =M(b_t)F_t(b_t)-M(a)F_t(a)
                            -integral_a^(b_t) M(x)F_t'(x)dx.

Since |M(x)|<=eta_X x for x>=X,

    |R_t^high(u)|
      <=eta_X {||u||_infinity[2+log(b_t/a)]
                         +t||u'||_infinity/a}
      <=C eta_X sqrt(lambda)J0||u||add.                 (10)

Here b_t/a<=2J0, t<=2lambda, and (2) supplies the two pointwise bounds on the actual bandlimited extension. No derivative of a discontinuous cutoff is dropped; its endpoint contributions are the first two terms of Abel summation.

Integrating against H by Cauchy--Schwarz yields

    |B_h^high(u,g)|<=C eta_X J0 sqrt(lambda h)||u||||g||
                   <=C eta_X w^11||u||||g||=o(1)||u||||g||. (11)

Indeed log X=2log lambda-O(loglog lambda), so (9) dominates every displayed fixed power of w. This is a substantially weaker use of Mertens cancellation than RH would provide.

The exact Fourier version of the same row is

    R_t(u)=integral_(-lambda)^lambda conjugate(q_u(s))
           sum_(2<=j<=lambda t) [mu(j)/j]
                                  exp(-2pi i s t/j)ds.   (12)

Thus the phase really is reciprocal, not a separable logarithmic phase. In the high range |st|/j<=2J0, explaining why ordinary partial summation suffices. Formula (12) is not used to assert cancellation in the low-label range.

## 5. The precise surviving arithmetic form

Combining (8) and (11),

    B_h(u,g)=B_h^low(u,g)+o(1)||u||||g||,
    B_h^low(u,g)
       =-2 sum_(2<=j<J0) [mu(j)/j]
                       integral_lambda^(lambda+h)
                              H(t)conjugate(u(t/j))dt.    (13)

For these labels the original moving visibility boundaries are eventually inactive: j<lambda^2 and lambda+h<j lambda for j>=2. In y coordinates the remaining intervals are exactly

    (lambda/j,(lambda+h)/j), 2<=j<J0.

They are eventually pairwise disjoint, because hJ0<lambda. Their disjointness does NOT make the signed compression small or positive.

The Fourier-jet construction from the preceding collar theorem can now use only

    W_r^low(y)=-sum_(2<=j<J0)mu(j)
                  1_{lambda<jy<lambda+h}(jy-lambda)^r/r!.

There are O(w^8) arithmetic labels, instead of O(lambda^2), but the common source-jet map is unchanged. The output rank is still at most m=O(w^6), and the Hermitian correction rank is at most 2m, not m times the number of labels. The Taylor error, the outside-collar error, and (8),(11) are all vanishing additive bilinear errors on the stated trace-null positive-head sector.

Small labels, including their Mobius signs, remain a complete signed exceptional port matrix. No scalar worst-case charge is substituted for its actual positive-main Schur geometry. The original two source traces/repairs, the exceptional matrix sign, the external gamma complement, and an all-support Weil floor remain unresolved.

## Dependencies

- `CRITICAL_COLLAR_AND_EXPLICIT_FOURIER_JET_PORTS.md`: exact collar and uniform outside error.
- `FOURIER_ENDPOINT_JET_RECURRENCE_AND_ARITHMETIC_PORT_MATRIX.md`: exact jet recurrence and finite signed matrix (algebraic addendum reviewed separately).
- `../repo_leverage/ACTUAL_VISIBLE_FAR_PAIRING_BY_FREQUENCY_RESOLVENT.md`: exact inverse-chi bandwidth normalization.
- Lee--Leong primary theorem linked above: only the classical unconditional Mertens decay (9).
