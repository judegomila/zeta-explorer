# Critical-line mass in moving windows

8 November 2026. We test the missing lower bound from [the all-height shear estimate](GLOBAL_BOUND.md) using the classical Guinand–Weil explicit formula with a different positive kernel. The calculation localizes the needed lower bound to windows of radius $O(\log\log |u|)$ and gives an unconditional lower bound averaged over centers. A lower bound with the required additive error at every grid point remains open.

## An arithmetic total with a positive contribution from every reflected pair

Take $a=\pi/2$, $k(v)=\operatorname{sech}(av)$, and $z_\rho=(\rho-1/2)/i$. Write $A(u)=\sum_\rho k(z_\rho-u)$ with zeros counted with multiplicity, including negative ordinates. Centering at $u$ translates the test in the explicit formula. With $\psi=\Gamma'/\Gamma$ we obtain

$$
A(u)=2\Re k(u+i/2)+\frac1{2\pi}\int_{\mathbb R}k(t-u)
\left(\Re\psi(1/4+it/2)-\log\pi\right)dt
-\frac4\pi\sum_{n\ge2}\frac{\Lambda(n)\sqrt n}{1+n^2}\cos(u\log n). \tag{1}
$$

In angular frequency the transform is $\widehat k(y)=2\operatorname{sech}y$, so $\widehat k(\log n)=4n/(n^2+1)$. Translation supplies conjugate phases in the two prime terms. The poles of the test are at imaginary distance one, outside the required half-width. The prime series converges absolutely by comparison to $\sum \log n/n^{3/2}$. The integral of $k$ is two. The digamma asymptotic on $|t-u|\le |u|/2$, exponential decay on its complement, and bounded prime sum give $A(u)=\pi^{-1}\log(|u|/(2\pi))+O(1)$ for large $|u|$. These estimates include the full completion.

[Carneiro and Milinovich, Lemma 4, Guinand–Weil formula](https://arxiv.org/abs/2403.17803).

A critical-line zero contributes $k(\gamma-u)>0$. A reflected pair at $1/2\pm b+i\gamma$ contributes twice
$$
\Re k(v+ib)=\frac{\cosh(av)\cos(ab)}{\sinh^2(av)+\cos^2(ab)}>0,
\qquad v=\gamma-u,\quad |b|<1/2.\tag{2}
$$
Its value at $v=0$ is $2\sec(ab)$ for the pair. Let $B(u)$ be any certified lower bound on the critical-line mass $L(u)=\sum_{\beta=1/2} k(\gamma-u)$, counting copies. A deficit $A(u)-B(u)<2$ at every real center excludes every off-line zero by testing its ordinate.

## Half-unit grid with an explicit margin

Only test $u\in\tfrac12\mathbb Z$. Every candidate ordinate is within $1/4$ of a grid point. In this range put $S=\sinh^2(av)$ and $C=\cos(ab)\ge 1/\sqrt2$. We have $S\le\sinh^2(\pi/8)<1/\sqrt2$. For instance $\pi/8<0.4$ and the Taylor series gives $\sinh(0.4)\le0.4/(1-0.4^2)<1/2$. Subtracting $k(v)$ from (2) has the sign of $(1-C)(C-S)$, which is nonnegative. The pair therefore contributes at least
$$
q=2\operatorname{sech}(\pi/8)=1.85511154\ldots.\tag{3}
$$
Consequently $A(u)-B(u)<q$ at every half-unit grid point suffices. Each point may use different certified intervals. This grid samples an explicit smoothing of the complete zero measure. Narrow raw backward-phase spikes in the earlier scan counterexamples satisfy a different sampling problem.

## The tail costs a bounded amount at double-logarithmic radius

For any unit interval $[y,y+1]$, the total number of zero copies in it is at most $30\log(5+|y|)$. Here are sufficient details for this loose constant. At a positive left endpoint $y\ge4$, use $N(y+1)-N(y-1)$ to include both endpoints. For $t\ge e$ the Bellotti–Wong count error about $t\log(t/(2\pi e))/(2\pi)$ is at most $0.10076\log t+0.24460\log\log t+8.08292$. The derivative of the main term is $\log(t/(2\pi))/(2\pi)$, so the count is at most $(1/\pi+0.70)\log(y+1)+16.2$. Reflection handles negative intervals to the left of $-5$. Intervals meeting the remaining range lie in $[-6,6]$ and the same count formula at $t=6$ bounds their count by $2N(6)<20$. These estimates imply the displayed unit-interval bound.

For all such $b$, (2) is bounded above by $\sqrt2\operatorname{sech}(av)\le2\sqrt2 e^{-a|v|}$, since its denominator is at least $C^2\cosh^2(av)$. This bound counts each copy once using the real part, and also covers line zeros. Sum unit bins on both sides of $u$ beginning at distance $H\ge1$. The resulting tail satisfies
$$
0\le A_{|v|\ge H}(u)\le 300\,e^{-aH}\big(\log(6+|u|+H)+1\big).\tag{4}
$$
In detail, sum $120\sqrt2 e^{-aH}\sum_{j\ge0}e^{-aj}\log(6+|u|+H+j)$. Use $e^{-a}<1/4$, $\log(X+j)\le\log X+j$, and the two geometric sums. Including shared bin endpoints in this upper estimate is harmless. Thus at large heights a radius $H=(\log\log(6+|u|)+c)/a$ gives a tail of size $O(e^{-c})$ for fixed $c$. The growing population of nearby zeros is retained in the central sum.

As an explicit lower bound, for every $10^{11}\le |u|\le10^{12}$ all zeros in $|\gamma-u|<9$ are rigorously known to lie on the line by Platt and Trudgian. Equations (1) and (4) therefore give
$$
\sum_{\substack{\beta=1/2\\|\gamma-u|<9}} k(\gamma-u)
\ \ge A(u)-0.0063.\tag{5}
$$
The numerical constant comes from $300e^{-9\pi/2}(\log(15+10^{12})+1)<0.0063$. This derives a moving-window inequality throughout a previously verified range. Beyond that range (4) still pays the tail cost and the unknown mass lies inside the moving window.

[Bellotti and Wong, explicit zero-count estimate](https://arxiv.org/abs/2412.15470). [Platt and Trudgian, finite-height verification](https://doi.org/10.1112/blms.12460).

## Lower bounds from Hardy Z and the estimate they need

Let $Z(t)$ be the real Hardy function on the real axis. Disjoint intervals with opposite endpoint signs each certify a critical-line zero. Summing the minimum of $k(\cdot-u)$ on each interval gives a lower bound $B(u)$ without requiring precise roots or simplicity. A continuous version with step $d>0$ and any measurable set of allowed starts $J$ is
$$
B_d(u;J)=\frac1d\int_J
\min\{k(t-u),k(t+d-u)\}\,\mathbf1_{Z(t)Z(t+d)<0}\,dt
\ \le L(u).\tag{6}
$$
For every detected crossing charge the integrand to the sum of the weights of line zeros between its endpoints. Each zero is charged on a set of starts of length at most $d$. The endpoint minimum bounds the minimum along the whole interval by unimodality. The strict sign rule can miss even multiplicities and multiple crossings.

The cap $B_d(u;J)\le 2/d$ follows by dropping the indicator and using $\int k=2$. By (1), a sign test with $A(u)-B_d(u;J)<q$ at large heights therefore requires $d\le(2\pi+o(1))/\log|u|$. The centers may be spaced by one half, but a sign-change estimator inside each window must resolve at least the mean zero-spacing scale. An upper bound on $d$ alone gives no lower bound on the sign integral.

## A sign-only proof would also require simplicity

The charging proof of (6) can use just the **distinct odd-multiplicity** zeros. Every sign mismatch crosses at least one such ordinate. An even-multiplicity zero earns zero credit and an odd zero earns at most one copy. Hence any line zero of multiplicity greater than one leaves at least two uncredited copies. At its nearest half-unit grid point their contribution is at least $2k(1/4)=q$. This prevents the strict inequality in (3) for any estimator based only on disjoint sign changes or (6), even with arbitrarily fine steps. Such a proof would imply simplicity as well as RH. This extra requirement belongs to that choice of estimator.

There is a multiplicity-sensitive alternative using the [cluster contour moments](../cluster/CLUSTER_RESIDUAL.md). In the ordinate coordinate $z=(s-1/2)/i$, take a conjugation-symmetric bounded contour enclosing a cluster of total multiplicity $m>0$, with no zeros on the contour. Let $p_j$ be the sum of the $j$th powers of its roots with multiplicities, given by the argument-principle contour integrals of $z^j\Xi'/\Xi$. The real symmetric matrix $H=(p_{i+j})_{0\le i,j<m}$ is positive semidefinite exactly when all the enclosed roots are real. Indeed its quadratic form at the real coefficient vector of a polynomial $P$ is $\sum_z m_zP(z)^2$. Real roots give nonnegativity. If a conjugate pair is nonreal, interpolate values $i,-i$ there and zero on all other distinct roots. The unique interpolant of degree below the number of distinct roots has real coefficients by conjugation. Its quadratic form is strictly negative.

A certified semidefinite matrix thus credits all $m$ copies in an enclosing height interval $I$ with at least $m\min_{v\in I} k(v-u)$. Add these lower bounds for disjoint clusters. Repeated roots can make $H$ singular, so a numerical eigenvalue near zero requires a proof of the null directions or another exact semidefiniteness certificate. For example, the clusters with roots $(c,c)$ and $(c+ib,c-ib)$ have the same first two moments $p_0=2,p_1=2c$, while their two-by-two Hermite determinants are respectively zero and $-4b^2$. This is a way to use certified cluster data without assuming simplicity. Its success on all the required moving windows remains unproved.

## What current arithmetic proves on average

Let $N_0(T)$ count positive critical-line zero copies up to $T$. Direct integration of the translates yields
$$
\int_0^T L(u)\,du=2N_0(T)+O(\log(2+T)).
$$
For an ordinate inside $[0,T]$, the missing kernel integral beyond the endpoints is bounded by a constant times $e^{-a|\gamma|}+e^{-a|T-\gamma|}$. Ordinates outside the interval have an integral bounded by the corresponding exponential in their distance to it. The unit count bound and geometric summation give the stated error. The unconditional proportion theorem of Pratt, Robles, Zaharescu and Zeindler, with Riemann–von Mangoldt, thus implies
$$
\liminf_{T\to\infty}\frac{\pi}{T\log T}\int_0^T L(u)\,du\ \ge\frac5{12}.\tag{7}
$$
The same normalization of the integral of $A$ tends to one. This application uses a cumulative average, with no inference of a lower bound at an individual grid point. The proof still needs a critical-line mass lower bound within the fixed additive margin (3) at every grid point. Both the relative accuracy $1-O(1/\log |u|)$ and coverage of exceptional centers matter. A proof at every center would imply RH through (2)–(3).

[Pratt, Robles, Zaharescu and Zeindler, critical-line proportion theorem](https://doi.org/10.1007/s40687-019-0199-8).

## Numerical check of the arithmetic normalization

As a floating-point check of (1), sum prime powers up to one million, integrate the gamma term on $|t-u|<40$, and compare with the first 25 positive critical ordinates from mpmath and their negatives. The respective arithmetic and zero sums are 0.9781403 and 0.9780501 at $u=14$, 1.0030605 and 1.0031150 at $u=21$, and 0.1140456 and 0.1140356 at $u=35$. The rigorous bound for the omitted prime series after $N$ is $(8/\pi)(\log N+2)/\sqrt N$ for $N\ge 3$, by integral comparison with $\log t/t^{3/2}$. This is 0.04028 rounded upward for this check. The quadrature and numerical ordinates are diagnostic. Inequality (5) instead follows from the published zero count and analytic kernel estimates. Its numerical tail constant also follows with rational arithmetic using $\pi>3.14$, $\log(10^{12}+15)<27.64$, and the degree-100 positive Taylor lower sum for each exponential.
