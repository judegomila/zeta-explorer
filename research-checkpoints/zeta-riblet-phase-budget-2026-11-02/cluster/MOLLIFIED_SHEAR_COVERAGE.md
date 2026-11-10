# Full-strip shear on a positive proportion of whole height cells

Let $G_c(x)=|\xi(1/2+\sqrt{x}+ic)|^2=\sum_{n\ge0}a_n(c)x^n$, with $0\le x\le1/4$. The [theta expansion](TRANSVERSE_THETA.md) identifies the low coefficients as the remaining signed terms. A mollified second moment bounds the set of heights at which any of them can be negative. A separate [direct estimate for the coefficients](LOW_ORDER_MOMENTS.md) uses no zero-location input and works to one mean spacing from the line on an unbounded family of cells.

## Coverage theorem

Set $\lambda=\log T$ and divide $[T,2T]$ into $\lceil32T\lambda\rceil$ equal closed cells with disjoint interiors. For a fixed $k\ge1$, discard cells meeting $[\gamma-kb,\gamma+kb]$ for any right-hand zero $1/2+b+i\gamma$ with $b>0$. The lower limit of the retained fraction, by count or length, is at least
$$
 1-\frac{k\log(11/4)}{2\pi}-\frac1{64\pi}. \tag{1}
$$

- At $k=1$ this exceeds **83.4%**. On every retained cell all $a_n(c)$ are nonnegative simultaneously. The squared modulus is strictly increasing throughout $0<x\le1/4$ for every height in the cell.
- At $k=2$ the fraction exceeds **67.3%**. On these cells there is the uniform quantitative estimate $G'_c(x)/G_c(x)\ge(3/25)\log T-O(1)$ throughout $0<x\le1/4$.
- For individual heights, before rounding to grid cells, omit the last term in (1). At $k=1$ the resulting lower limit is $0.8389987\ldots$.

The grid is specified without consulting zeros. The count of retained cells is an existence bound. Identifying the cells by this particular argument would require information about off-line zeros. An off-line zero's own height always falls in its discarded interval, however small $b$ is. These are fractions of heights, not fractions of zero copies.

## Arithmetic budget for the projected intervals

For fixed $0<\theta<4/7$ use the Dirichlet polynomial
$$ M_T(s)=\sum_{n\le T^\theta}\mu(n)n^{-s}
      \left(1-\frac{\log n}{\theta\log T}\right),\qquad D(s)=\zeta(s)M_T(s). $$
The classical mollified second moment gives $\int_T^{2T}|D(1/2+it)|^2\,dt=(1+1/\theta+o(1))T$. This is the unshifted case $P(u)=u$, $Q=1$ of Conrey's calculation. The length exponent approaches $4/7$ only after taking the height limit. [Conrey, Theorem 2 and the unshifted proposition](https://doi.org/10.1515/crll.1989.399.1). [Radziwiłł, discussion of the classical mollifier](https://www.math.mcgill.ca/radziwill/molliff43.pdf).

Littlewood's rectangle lemma, applied to $D$ between $1/2$ and $4$, counts every right-hand zeta zero with horizontal weight $b$. Extra zeros of $M_T$ have nonnegative weight. Concavity of the logarithm on the left edge therefore gives
$$
 \sum_{T<\gamma\le2T,\ \beta>1/2}(\beta-1/2)
 \le \frac{T}{4\pi}\log(1+1/\theta)+o(T). \tag{2}
$$

Here are the boundary details. The coefficients of $D-1$ are bounded in modulus by the divisor function. On $\Re s=4$ their absolute Dirichlet sum is bounded by $\zeta(4)^2-1<1$. Thus $\log D$ has an absolutely convergent Dirichlet series there with zero constant term and uniformly bounded coefficient norm. Its vertical integral is $O(1)$ by integrating each nonconstant frequency. On either horizontal side, $\Re D(\sigma+it)$ has $O(\log T)$ zeros on $[1/2,4]$: apply Jensen's disk bound at 4 to $(D(z+it)+\overline{D(\bar z+it)})/2$, using fixed radii $4$ and $5$. Its central value is bounded below, and $D$ grows at most polynomially in $T$ in this disk. The argument on the horizontal segment then costs $O(\log T)$ on a zero-free boundary. One-sided limits handle zeros on an edge, with zero weight for left-edge zeros. End ordinates contribute at most $O(\log T)$ to the zeta sum by the standard unit-interval count. The zeta pole lies outside the rectangle. [Gonek, Theorem 2.2, Littlewood's rectangle identity](https://people.math.rochester.edu/faculty/gonek/papers/26-Applics%20MVTs.pdf).

The total length of the excluded intervals is at most $2k$ times (2), counting each right-hand copy once. Intervals meeting the slab from outside it add $O_k(\log T)$ since $b<1/2$. Rounding each interval to the cells it meets adds at most two cell widths. By reflection the number of right-hand copies is at most half the full-strip count, hence at most $(1+o(1))T\lambda/(4\pi)$ in the extended slab. This explains the last term of (1). Letting $\theta$ increase to $4/7$ proves the claim.

## Why the low coefficients have the required sign there

Use the real entire ordinate function $f(z)=\xi(1/2+iz)$. At a real height $c$ with $m$ the order of vanishing of $f$ ($m=0$ at a regular point), the shifted genus-one product gives
$$
 G_c(x)=|f^{(m)}(c)/m!|^2 x^m\prod_{w\ne0}(1+x/w^2),
 \qquad w=z_\rho-c .
$$
The linear exponentials cancel in the two opposite shifts and the remaining product converges absolutely on compact sets. Each real $w$ gives a positive linear coefficient. A nonreal pair $w=d\pm ib$ gives the real factor
$$
 1+\frac{2(d^2-b^2)}{(d^2+b^2)^2}x+\frac{x^2}{(d^2+b^2)^2}.
$$
Outside its projected interval $|d|>b$ all these coefficients are positive. Products and locally uniform limits preserve nonnegativity of every coefficient. There are infinitely many nonconstant factors, so $G_c'(x)>0$ for $x>0$. This product argument is also used in [Sra, local zero-exclusion and generalized Laguerre inequalities](https://arxiv.org/abs/2611.02944). Equation (2) bounds the measure lost when applying it simultaneously to a predetermined grid.

For $k>1$ define $\eta_k=(1-k^{-2})/(1+k^{-2})^2$. With $q=x+d^2$ the logarithmic derivative of the pair factor is $2(q-b^2)/[(q+b^2)^2-4xb^2]$. On the retained cells it is at least $2\eta_k/q$. Each real zero contributes exactly $1/(x+d^2)$, including $1/x$ for a central copy. Thus
$$
 \frac{G'_c(x)}{G_c(x)}
 \ge\eta_k\sum_\rho\frac1{x+(c-\gamma)^2}
 \ge\frac{\eta_k}{2}\Re(\xi'/\xi)(2+ic).
$$
The second inequality follows termwise from $1<2-\beta<2$ and $x\le1/4$. The last expression is $\eta_k(\lambda/4+O(1))$ by Stirling and the absolutely convergent prime series at 2. At $k=2$, $\eta_k=12/25$. [Earlier paired field and tail estimates](../README.md).

## A local arithmetic obstruction at the excluded center

The coverage estimate integrates over heights. To test a specified center, put $z=s-1/2$, $d>0$, $z_0=d+ic$, and $U(z)=((s-1)/s)\zeta(s)M(s)$ with any fixed nonzero Dirichlet polynomial $M$, including $M=1$. The rational factor removes the pole. Define a localized boundary energy and its ratio by
$$
 E_d(c)=\frac{16d^5}{\pi}\int_{\mathbb R}
       \frac{|U(i(c+v))|^2}{(d^2+v^2)^3}\,dv,\qquad
 R_d(c)=\frac{|U(d+ic)|^2}{E_d(c)}.
$$
If a right-hand zero sits at $b+ic$, then for **every** $d>0$,
$$
 R_d(c)\le\left(\frac{d-b}{d+b}\right)^2. \tag{3}
$$
Indeed divide $U$ by the right-half-plane Blaschke factor $(z-b-ic)/(z+b-ic)$ after cancelling its zero, and multiply by $(2d/(z+d-ic))^2$. The result is bounded analytic in the right half-plane by the standard polynomial growth bound for zeta there after pole removal (the critical-line convexity bound suffices). The squared modulus at $z_0$ is bounded by its Poisson boundary mean. The Blaschke factor has unit boundary modulus and the multiplier equals one at $z_0$. This gives (3), including $d=b$ by cancellation. Omitting the Blaschke factor also gives $0\le R_d\le1$.

For any $0<b\le1/2$ there is a dyadic $d=2^{-j}$, $j\ge1$, with $b/d\in[1/\sqrt2,\sqrt2]$. A true pair forces $R_d\le17-12\sqrt2<0.03$ at such a scale. In particular, a lower bound exceeding this threshold at every dyadic scale at one candidate height excludes a reflected pair there. The reverse implication is not claimed; a small ratio can have another cause.

The taper in the energy handles boundary multiplicity. If $U$ has order $m\le2$ at $ic$, substitute $v=dy$. The moments of $16/[\pi(1+y^2)^3]$ in degrees $0,2,4$ are $6,2,6$. The contribution outside a fixed neighborhood is $O(d^5)$, and the Taylor expansion inside, with dominated convergence after scaling, gives
$$
 \lim_{d\downarrow0}R_d(c)=
 \begin{cases}1/6,&m=0,2,\\1/2,&m=1.\end{cases}
$$
For $M=1$ at a coincident two-copy site these limits allow a double line zero. A fixed nonzero transverse split is detected at a scale comparable with its displacement. Its small-scale limit alone agrees with the regular-center case.

One can optimize the local test without moving the center. For Dirichlet basis functions $\phi_n(z)$ (for example $n^{-s}$), let $C$ be their Gram matrix under the integral defining $E_d$ with $M=1$, and $v_n=\overline{\phi_n(z_0)}$. With independent basis functions, $C$ is positive definite. Maximizing the ratio over their linear span gives $|U_0(z_0)|^2v^*C^{-1}v$, where $U_0$ denotes the pole-removed zeta function with $M=1$. Inequality (3) still applies to this maximum. This is a local Schur-complement test. A transfer to the separate global twin-ladder operator would require an operator identity or comparison. A uniform lower bound on the optimized ratio at the candidate scales is open.

Run `python3 cluster/check_shear_coverage.py` from the checkpoint directory for rational checks of the coverage constants, pair factors, and local obstruction, including a model with a reflected pair. No zero table enters these checks.

## Actual zeta certificate at all dyadic scales near 18

With $M=1$, for every $|c-18|\le1/128$ the following lower bounds hold simultaneously. The final row covers a continuum of small scales.

| $d$ | Lower bound for $R_d(c)$ |
|---|---:|
| $1/2$ | 0.0486 |
| $1/4$ | 0.0693 |
| $1/8$ | 0.0838 |
| $1/16$ | 0.0924 |
| $1/32$ | 0.0971 |
| $0<d\le1/32$ | 0.0469 |

Thus (3) independently excludes a reflected pair throughout this height band. The band is centered inside the [earlier two-zero rectangle](PARTIAL_CLUSTER_MASS.md). It tests the local arithmetic criterion in a previously verified height range.

Run `python3 cluster/certify_local_ratio.py` with NumPy. Set $v=dy$, so the boundary integral has density $16/[\pi(1+y^2)^3]$ and $|U(iu)|=|\zeta(1/2+iu)|$. For $|y|\le32$ the checker encloses each of 2,048 equal subintervals, including all allowed $c,d$ in the row. The numerator and integrand use the [interval Euler–Maclaurin evaluation](certify_pair_moments.py) with $|s|<35$, $0.5\le\Re s\le1$. In this range $|s|\log(16)/128<1$ as required by the exponential Taylor remainder. The arithmetic assumes IEEE binary64 with gradual underflow.

For the tail, partial summation gives $\zeta(s)=s/(s-1)-s\int_1^\infty\{w\}w^{-s-1}\,dw$ for $\Re s>0$ away from the pole. On the critical line it gives $|U(iu)|\le 1+2|s-1|\le 2+2|u|$. For $Y=32$ and $H=2+2\sup|c|$, the omitted contribution to $E_d(c)$ is at most
$$
 \frac{32}{\pi}\left(\frac{H^2}{5Y^5}+\frac{Hd}{Y^4}
                     +\frac{4d^2}{3Y^3}\right).
$$
The last row uses $0\le d\le1/32$ inside the scaled integral for uniform enclosures and asserts the ratio bound for $d>0$ only.

The [adaptive filter continuation](ADAPTIVE_LOCAL_FILTER.md) proves that the raw ratio has arbitrarily small values at every fixed scale. It certifies a finite repair on an actual zeta band and proves a universality obstruction for every fixed finite set of Dirichlet rungs.
