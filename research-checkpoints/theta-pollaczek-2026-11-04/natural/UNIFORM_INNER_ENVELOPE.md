# A direct uniform inner Pollaczek envelope from Fourier inversion

2026-11-04. Analytic proof with an independent AI-assisted audit; not external peer review or machine formalization. No finite scan or selected-theta assertion.

## Proposition

Fix lambda>0, let W_lambda(t)=|Gamma(lambda+it/2)|² and Q_n(t)=P_n^(lambda)(t/2;pi/2). There is C_lambda such that, for n>=4 and |t|<=n/4,

    W_lambda(t)|Q_n(t)|² <= C_lambda n^(2lambda-2).       (1)

There is also a differentiated version

    W_lambda(t)|Q_n'(t)|²
      <= C_lambda n^(2lambda-2)
              [1+log²(n/(1+|t|))].                     (2)

Only the interior range is claimed; no turning-point bound is inferred from (1).

## Exact inverse Fourier representation

The gamma Fourier integral and the Pollaczek generating function give

    integral_R W_lambda(t) Q_n(t) exp(-itu/2) dt
      = [4pi Gamma(n+2lambda)/(2^(2lambda)n!)]
             (-i tanh(u/2))^n sech(u/2)^(2lambda).

This can be checked by multiplying by z^n and summing: the gamma transform evaluates the generating function integral as a constant times

    [cosh(u/2)+iz sinh(u/2)]^(-2lambda).

Coefficient extraction gives the displayed formula. Therefore

    W_lambda(t) Q_n(t)
      = [Gamma(n+2lambda)/(2^(2lambda)n!)] (-i)^n
            integral_R exp(itu/2)tanh(u/2)^n
                                      sech(u/2)^(2lambda)du.       (3)

For t>=0 shift the integration line from Im u=0 to Im u=pi/2. Cosh has no zeros in the closed strip, so its analytic power is well defined, including noninteger lambda. Vertical end contributions vanish by exponential amplitude decay, at each fixed n and t. On the shifted line,

    tanh((u+i pi/2)/2) = (sinh u+i)/cosh u,
    |tanh((u+i pi/2)/2)|=1,
    |sech((u+i pi/2)/2)^(2lambda)|=(2/cosh u)^lambda.

Choose a smooth argument theta(u) of (sinh u+i)/cosh u; theta'(u)=-sech u. The remaining oscillatory integral is

    I_(n,t)=integral_R exp(i phi_(n,t)(u)) A_lambda(u)du,
    phi_(n,t)(u)=tu/2+n theta(u),
    phi' = t/2-n sech u,
    |A_lambda^(j)(u)| <= C_(lambda,j) exp(-lambda|u|).

Equation (3) has gained the real factor exp(-pi t/4). We claim

    |I_(n,t)| <= C_lambda n^(-lambda)(1+t)^(lambda-1/2),
                      0<=t<=n/4.                       (4)

## Uniform stationary/nonstationary partition proving (4)

First take 1<=t<=n/4. Set U=arcosh(2n/t)>=arcosh(8). The two stationary points are ±U.

Use smooth partitions with uniformly bounded derivatives, supported in a central region |u|<=1, fixed-width neighborhoods of ±U, and the intervening/outer regions. Enlarge the central region slightly as needed for overlapping cutoffs, keeping it separated from ±U.

On |u-U|<=1, the second derivative n sech u tanh u has fixed sign and magnitude comparable to t, uniformly in n,t. The amplitude supremum plus its total variation there is O((t/n)^lambda). The second-derivative van der Corput lemma gives

    O((t/n)^lambda t^(-1/2)).

The negative saddle is identical. This estimate also holds when t is bounded, using the absolute integral instead.

On u>=U+1, |phi'|>=c t; all higher phase derivatives are O(t exp(-(u-U))). One integration by parts with the smooth cutoff gives an integral bounded by

    C t^(-1) exp(-lambda U)
       <= C n^(-lambda)t^(lambda-1).

On 1<=u<=U-1, |phi'|>=c n exp(-u). Its derivatives have size O(n exp(-u)), and all derivatives of 1/phi' have size O(n^(-1)exp(u)) of the corresponding order. Repeated integration by parts K times, for an integer K>lambda, gives an integrand bounded by

    C_K n^(-K) exp((K-lambda)u).

Integrating to U bounds this contribution by

    C_K n^(-lambda)t^(lambda-K),

plus O(n^(-K)) from the fixed left endpoint. Smooth partitions mean boundary terms are included in the same bounds; there are no artificial uncancelled endpoints. The same argument holds on the negative half-axis. The central region has |phi'|>=c n and contributes O(n^(-K)). Every term is at most the right side of (4).

For 0<=t<=1, split at |u|=log n, with smooth bounded-width transitions. The absolute outer integral is O(n^(-lambda)). On 1<=|u|<=log n-1, |phi'|>=c n exp(-|u|), and the preceding K-fold integration gives O(n^(-lambda)). The central part is O(n^(-K)). This proves (4) also at t=0.

Stirling on the real axis, uniformly including bounded t after changing constants, gives

    sqrt(W_lambda(t)) asymp (1+t)^(lambda-1/2) exp(-pi t/4).

Using Gamma(n+2lambda)/n!=O(n^(2lambda-1)), (3)-(4) prove (1). Negative t follows by parity.

## Differentiation

Differentiate (3) after shifting the contour. The differentiated oscillatory integral has the extra factor iu/2; the extracted exponential contributes -pi/4. Repeating the same partitions gives

    |integral u exp(i phi) A_lambda du|
       <= C n^(-lambda)(1+t)^(lambda-1/2)
                         [1+log(n/(1+t))].

Indeed the saddle factor is O(1+U), the outer exponentially decaying amplitude has first moment O((1+U)exp(-lambda U)), and the inner repeated-integration bound acquires at most 1+U. For t<=1 replace U by log n in the same argument. Finally W_lambda'/W_lambda is bounded on the real line, by smoothness and Stirling, so solving (WQ)'=WQ'+W'Q proves (2).

## Application to the natural theta envelope

For lambda=9/4, a²/W_lambda is the bounded positive rational function in (1) of NATURAL_PARAMETER_WKB_ROUTE.md. Therefore (2) proves, rather than assumes, the origin portion of the proposed natural derivative majorant, for 0<=t<=n/4. The turning-point regime and the full source lower bound are separate tasks.

For lambda=4, (1) supplies the uniform inner estimate sought in the parent analysis: W_4 Q_n²<=C n^6 for every |t|<=n/4, in particular up to n^.4 or n^.45. This permits comparison of the actual signed potential energy against compact derivative energy; a complete resulting ratio proof should separately state its fixed-t derivative asymptotic and theta-potential bounds.
