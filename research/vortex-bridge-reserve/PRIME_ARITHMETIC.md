# Isolating the prime arithmetic

24 October 2026. Continuation of PRIORITY_AUDIT.md. No new zero-free region is proved. The results here simplify the sufficient inequality and strengthen the obstruction to arguments using only generic event geometry. No novelty claim is made for the analytic-number-theory reductions.

## 1. Higher prime powers are polynomially bounded

Keep the existing archimedean response A(t). Write

\[
\Psi(t)=\Phi(t)-P(t),\qquad
\Phi(t)=A(t)-\sum_{p\le e^t}\frac{\log p}{\sqrt p}(t-\log p),
\]
\[
P(t)=\sum_{k\ge2,\ p^k\le e^t}\frac{\log p}{p^{k/2}}(t-k\log p)\ge0.
\]

An explicit, deliberately loose bound valid for every t>=0 is

\[
0\le P(t)\le \frac C4t^2+(C+K)t,
\quad C=4\log2,
\quad K=\frac{4+\log2/2^{3/2}}{1-2^{-1/2}}.
\]

Proof: primes between 2^(j-1) and 2^j divide the central binomial coefficient binom(2^j,2^(j-1)), so their logarithms sum to at most 2^j log2. Summing these dyadic estimates gives theta(y)<=Cy for y>=2. Partial summation then gives

\[
\sum_{p\le e^{v/2}}\frac{\log p}{p}\le C(1+v/2).
\]

Integrating in v from 0 to t bounds the square contribution by Ct+Ct^2/4. For k>=3, the sum of all slope charges is at most

\[
\sum_{p}\frac{\log p\,p^{-3/2}}{1-p^{-1/2}}
\le\frac1{1-2^{-1/2}}\sum_{n\ge2}\frac{\log n}{n^{3/2}}\le K.
\]

The last series is bounded by its first term plus its integral; integral_1^infinity log(x)x^(-3/2) dx=4. Multiplication by t bounds their total response. This proof uses neither RH nor a proposed improved zero-free bound.

Standard unconditional PNT error estimates also give the more informative asymptotic P(t)=t^2/4+O(t): partial summation yields sum_{p<=y}log(p)/p=log(y)+O(1), and the k>=3 contribution is O(t). The explicit elementary inequality above is sufficient for all conclusions below.

## 2. A single prime sum is now the target

For x>=1 define

\[
Q(x)=\sum_{p\le x}\frac{\log p}{\sqrt p}\log(x/p).
\]

Since A(t)=4e^(t/2)+O(1+t), the preceding bound and the negative-part Laplace criterion established in GLOBAL_TAIL.md imply:

**Sufficient strip theorem.** If, for a fixed beta>0,

\[
\boxed{Q(x)\le4\sqrt{x}+C_\beta x^\beta\quad(x\ge x_0),}
\]

then every nontrivial zeta zero satisfies |Re(rho)-1/2|<=beta. Indeed Phi(t)>=-C exp(beta t)-O(t), and subtraction of P(t)=O(t^2) still leaves Psi(t)>=-C' exp(beta t). Apply the earlier Laplace criterion with each exponent beta+epsilon, then let epsilon decrease to zero.

If instead the excess is at most a fixed polynomial in log(x), the same argument with every beta>0 yields RH. Conversely, RH gives Psi>=0, hence Phi>=0 and Q(e^t)<=A(t)<=4e^(t/2)+O(1+t). Thus the polynomial-excess existence criterion is equivalent to RH, not an independently proved shortcut.

To improve the audited 7/8 edge, beta must be strictly below 3/8. The reduction isolates k=1 primes as the only possible source of positive exponential growth in the deficit. It does not show that their signed contribution has the required bound.

## 3. What the tested unconditional error estimate supplies

Johnston and Yang provide an unconditional estimate of the shape

\[
|\psi(x)-x|\le 9.39x(\log x)^{1.515}e^{-0.8274\sqrt{\log x}},\quad x\ge2.
\]

Source: https://arxiv.org/abs/2204.01980 (the stated example was checked against the primary abstract). This is a specific available input, not a claim that it is the strongest current estimate. The previously audited 2026 7/8 result is a separate input and is not reproved here.

Removing higher powers and partial summation translate this type of absolute error bound into a bound for |Q(x)-4sqrt(x)| of exponential order 1/2 in t=log x, with subexponential improvements. To see the limitation directly, its large-t envelope contains exp(t/2-c sqrt(t)) times polynomial factors. For any beta<1/2, its ratio to exp(beta t) tends to infinity. Consequently this envelope does not establish the displayed target for beta<3/8. This is a limitation of that bound, not evidence that the actual signed prime sum grows that quickly.

If a stronger counting-error envelope O(x^alpha) is supplied with alpha>1/2, the same integration gives O(x^(alpha-1/2)) for the weighted response. Using alpha=7/8 in this way reproduces the 3/8 threshold. Improving it needs additional cancellation or a stronger input; rearranging the sum alone does not yield a saving.

## 4. Sparse integer events with the exact weight still defeat generic arguments

The previous adversarial construction used unusually dense clusters. Here is a stronger analytic control that removes that objection. It is **not the primes**, and is not a counterexample to any assertion about the actual zeta function.

Choose 1/2<alpha<1 and define, for x>=16,

\[
f(x)=\frac{1+x^{\alpha-1}}{\log x},\qquad F(x)=\int_{16}^x f(u)\,du.
\]

The function f is positive and below 1. Select the integers n>=17 for which floor(F(n))-floor(F(n-1))=1; call their set S. Each integer can be selected at most once. Its counting function satisfies

\[
N_S(x)=F(x)+O(1),
\]

because N_S(x)=floor(F(floor(x))) and the integral over the last fractional unit is bounded by 1. It follows that N_S(x)~x/log x. Weighted partial summation gives

\[
\Theta_S(x):=\sum_{n\le x,n\in S}\log n
=x+x^\alpha/\alpha+O(\log x).
\]

The constants arising from the lower endpoint are absorbed by the error. Thus the counting error is O(x^alpha). For each fixed c>0, x^alpha=o(x exp(-c sqrt(log x))); this sequence therefore obeys an asymptotic PNT error envelope of that form. This does not assert any specified finite-range numerical constants from a theorem about primes.

Put events at log(n), with exactly q_n=log(n)/sqrt(n), using the same A(t) as the zeta response:

\[
\Psi_S(t)=A(t)-\sum_{n\in S,n\le e^t}\frac{\log n}{\sqrt n}(t-\log n).
\]

Let delta=alpha-1/2>0. Stieltjes integration of the formula for Theta_S gives

\[
\boxed{\Psi_S(t)=-\frac{e^{\delta t}}{\delta^2}+O(t).}
\]

For completeness, the density 1 contributes 4e^(t/2)+O(t), canceled by A. The excess density u^(alpha-1) contributes

\[
\int_{16}^{e^t}u^{\alpha-3/2}(t-\log u)du
=e^{\delta t}/\delta^2+O(t).
\]

The O(log x) error in Theta_S contributes only O(t): integrate by parts against x^(-1/2)(t-log x), whose derivative is -x^(-3/2)[1+(t-log x)/2]. The integral of log(x)x^(-3/2) converges. This proves the claimed asymptotic, including its negative sign.

For these event times the actual curvature a(t)=e^(t/2)-e^(-t/2)/(e^(2t)-1) is positive and increasing. The diagonal losses are summable because

\[
\sum_{n\in S}\frac{q_n^2}{2a(\log n)}
\le\frac35\sum_{n\ge17}\frac{\log^2 n}{n^{3/2}}<\infty.
\]

This control has sparse integer support, the prescribed logarithmic weight, PNT-scale density accuracy, the exact smooth recovery function, and finite diagonal loss. Nevertheless its response has negative exponential order alpha-1/2. Taking alpha=7/8 shows that these properties together with a counting-error envelope O(x^(7/8)) cannot imply an exponent strictly below 3/8. It does not transfer the zeta benchmark itself to the artificial sequence: no Euler product or functional equation is claimed for this surrogate.

The missing distinguishing property could involve multiplicative structure or correlations specific to prime locations. This calculation does not establish which such property is sufficient. It does show that density, weight bounds, sparse support, and summable diagonal losses alone are insufficient.

## 5. Finite checks and their interpretation

`prime_only_audit.py` reconstructs the prime, square, and higher-power contributions using outward-rounded intervals. It checks the decomposition at five cutoffs against the existing event list and the explicit polynomial upper bound. At x=1,000,000:

- P(log x) is approximately 52.2348269264.
- Phi(log x) is approximately 52.2718218474.
- Their difference Psi(log x) is approximately 0.0369949210.

The large prime-only response is mainly the removed higher-power correction. It is not a new safety margin for the full response and cannot be extrapolated. The infinite polynomial bound and the surrogate asymptotic are analytic arguments, not extrapolations from these finite checks.

## 6. Next mathematical target

The next attempt should address the one-sided excess Q(x)-4sqrt(x) directly, preserving its sign. A successful arithmetic input must discriminate actual primes from S above and yield an exponent beta<3/8 uniformly as x tends to infinity. Replacing the signed quantity by a tested absolute PNT envelope loses the desired saving. A finite fit or an RH-dependent prime-correlation assumption would not complete the argument.
