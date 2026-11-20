# An arithmetic bound on negative low-order coefficients

In the [transverse expansion](TRANSVERSE_THETA.md), write $a(t)=|\tfrac12s(s-1)\pi^{-s/2}\Gamma(s/2)|$ at $s=1/2+it$ and $A_n(t)=a_n(t)/a(t)^2$. Thus $A_0=Z^2$ for Hardy's real function $Z$ and $\Xi=-aZ$. All estimates below use the actual completed zeta function without prescribing where any zeros lie.

**Whole-box estimate.** Let $\lambda=\log T$. For either row of the table, partition $[T,2T]$ into $\lceil KT\lambda\rceil$ equal cells. At least $\gg T/\lambda$ cells satisfy, at every height $t$ of the closed cell and every $0\le x\le A^2/\lambda^2$,
$$
 \frac{G_t'(x)}{a(t)^2}\ \ge\ \frac{\lambda^2}{256}Z(t)^2+\frac{\lambda^3}{100}.
 \tag{1}
$$

| $K$ | $A$ | Transverse reach on either side |
|---:|---:|---|
| 2 | 4 | $4/\log T$ on the grid of the earlier line-shear bound |
| 32 | $2\pi$ | $2\pi/\log T$, one asymptotic mean spacing between zero ordinates |

In particular, throughout each such box the squared modulus is bounded below by $(1+\lambda^2x/256)\Xi(t)^2+a(t)^2\lambda^3x/100$. The result holds in every sufficiently large dyadic slab. Its guaranteed height measure is $\gg T/\lambda^2$. The [full-strip coverage theorem](MOLLIFIED_SHEAR_COVERAGE.md) gives a stronger height fraction via the zero product. The additive bound in (1) and its direct coefficient proof are separate; we have no lower bound on the intersection of the two selected families.

## Signed means, negative parts, and height variation

Let $(u)_-=\max(0,-u)$. For each fixed $n\ge1$ set
$$
 d_n=\frac{1}{2^{2n}(2n)!}\sum_{j=0}^{2n}
       \frac{\binom{2n}{j}}{\sqrt{(2j+1)(4n-2j+1)}},\qquad
 \mu_n=\frac{1}{(2n+1)!},\qquad e_n=(d_n-\mu_n)/2,
$$
and put
$$
 v_n=\frac{1}{2^m m!}\sum_{j=0}^m\binom mj
 \frac{|m-2j|}{\sqrt{(2j+1)(2m-2j+1)}},\qquad m=2n+1 .
$$
On $[T,2T]$ one has
$$
 \frac{\int A_n}{T\lambda^{2n+1}}=\mu_n+o(1),\quad
 \frac{\int(A_n)_-}{T\lambda^{2n+1}}\le e_n+o(1),\quad
 \frac{\int|A_n'|}{T\lambda^{2n+2}}\le v_n+o(1). \tag{2}
$$
For example $e_1<0.01424$ and $e_2<0.000537$, compared with signed mean constants $1/6$ and $1/120$. The first ratio is an upper bound of 8.55% for the negative mass relative to the signed mass asymptotically. It does not measure the fraction of heights with negative sign.

To see (2), the second moment of $Z^{(j)}$ is asymptotic to $T\lambda^{2j+1}/[4^j(2j+1)]$ for every fixed $j\ge0$. In each $A_n$ replace $\Xi^{(j)}/a$ by $-Z^{(j)}$ at leading order in the height integrals: the difference is a linear combination of lower derivatives with bounded smooth coefficients by differentiated Stirling and the product rule. Cauchy–Schwarz loses at least one power of $\lambda$ in every resulting error. The normalized derivative $A_n'$ adds the lower-order term $-2(a'/a)A_n$. [Hall, Theorem 3](https://doi.org/10.1112/S0025579300007762). [Minamide and Tanigawa, mean squares of Hardy derivatives](https://www.sciencedirect.com/science/article/pii/S0022247X19310406).

In the signed sum for $A_n$ integrate by parts to convert $\int Z^{(j)}Z^{(2n-j)}$ to $(-1)^{n-j}\int (Z^{(n)})^2$ at leading order. For each fixed derivative product $H=Z^{(p)}Z^{(q)}$ at an endpoint, $|H(u)|\le\int_u^{u+1}(|H|+|H'|)\ll_{p,q}\sqrt T\,\lambda^{p+q+3}$ follows from Hölder and the fourth moments on $[T,2T+1]$. This makes every boundary term negligible. The sum of the factorial weights is $4^n/(2n)!$, giving $\mu_n$. Taking absolute values *before* integration gives $d_n$ by Cauchy–Schwarz. The identity $2(A_n)_-=|A_n|-A_n$ gives the second estimate in (2). Differentiating the signed sum joins adjacent binomial terms; their coefficient in absolute value is $|m-2j|/[j!(m-j)!]$. This yields $v_n$. [Bui and Hall, Theorem 3, fourth moments of Hardy derivatives](https://doi.org/10.1112/blms.12859).

## Controlling the infinite series in the grid estimate

The fixed-order asymptotics alone do not justify summing over growing orders. For fixed $A,K$ take the center $t_I$ of each cell and let
$$
 M_I=\sup_{|w-t_I|\le(2A+1)/\lambda} |\Xi(w)|^2/a(t_I)^2,\qquad h=|I|.
$$
Then $h\sum M_I\ll_{A,K}T\lambda$. Indeed, in $|\Im w|\le(2A+2)/\lambda$, Stirling bounds the squared completion modulus relative to $a(\Re w)^2$ by a fixed constant. Reflection allows either sign of displacement. The shifted second moment gives $\int_{T-1}^{2T+1}|\zeta(1/2+u+it)|^2dt\ll_A T\lambda$ uniformly for $|u|\le(2A+2)/\lambda$. This follows also from cancellation of the two polar terms in the shifted formula at zero shift. Apply the disk submean inequality for $|\Xi|^2$ at a maximizing point with disk radius $1/\lambda$. The enlarged disks overlap $O_{A,K}(1)$ times, the vertical band has width $O_A(1/\lambda)$, and $a(\Re w)/a(t_I)=1+O_A(1/\lambda)$ on each disk. These give the asserted grid mean. [Bettin, Theorem 1, shifted second moment](https://arxiv.org/abs/1111.0925).

For $t\in I$, Cauchy's coefficient bound for the entire function $G_t(x)$ on $|x|=(2A/\lambda)^2$ now gives $|A_n(t)|\le (1+o(1))M_I(\lambda/(2A))^{2n}$, uniformly in $n$. Both argument shifts of $\Xi$ are in the prescribed disk. The grid-averaged absolute contribution of $n>N$ to the derivative throughout the transverse range is at most $O_{A,K}(T\lambda^3)\sum_{n>N}n4^{-n}$. We can therefore take $T\to\infty$ at fixed $N$ and then $N\to\infty$. The same argument without grid minima gives the signed mean profile
$$
 \lim_{T\to\infty}\frac1{T\lambda^3}\int_T^{2T}
 \frac{G_t'(u^2/\lambda^2)}{a(t)^2}\,dt
 =\frac{u\cosh u-\sinh u}{2u^3}
$$
for fixed real $u$, with continuous value $1/6$ at zero. It is the derivative with respect to $u^2$ of $\sinh(u)/u$.

## Proof of the whole-box count

Let $F_I$ be the minimum of $G_t'(x)/a(t)^2-\lambda^2 Z(t)^2/256$ on the rectangle in (1). Bound the leading term from below by $\inf_I A_1$, and each higher unsigned cost by $n(A/\lambda)^{2n-2}\sup_I(A_n)_-$. For a differentiable real $H$ one has $h\sup_I H\le\int_I H+h\int_I |H'|$, and the corresponding lower bound for an infimum. This also applies to its Lipschitz negative part. Equations (2) and the tail estimate imply
$$
 \liminf\frac{h\sum_I F_I}{T\lambda^3}\ \ge\
 B(K,A)=\frac16-\frac{v_1}{K}
 -\frac{1+1/(K\sqrt3)}{256}
 -\sum_{n\ge2} n A^{2n-2}\left(e_n+\frac{v_n}{K}\right).
$$
Here $\int |(Z^2)'|\le(1/\sqrt3+o(1))T\lambda^2$. The [rational checker](check_shear_coverage.py) proves $B(2,4)>0.013$ and $B(32,44/7)>0.016$. The larger rational radius in the second check covers $2\pi$. After $n=16$ it uses $d_n,v_n\le1/(2n)!$ and the geometric ratio bound $A^2/[2n(2n+1)]$ for successive majorant terms. Both certified margins exceed $1/100$.

Let $E$ be the union of cells with $F_I\ge\lambda^3/100$. All other cells contribute at most $T\lambda^3/100$ to the lower sum. Since the defining minimum includes $x=0$, $\int_E |A_1|\gg T\lambda^3$. The fourth-moment bound gives $\int A_1^2\ll T\lambda^8$. Cauchy–Schwarz yields $|E|\gg T/\lambda^2$ and hence $\gg T/\lambda$ cells. The guarantee permits a hypothetical reflected pair in the unselected heights. An estimate sampled at the pair centers themselves would be needed to exclude those pairs.
