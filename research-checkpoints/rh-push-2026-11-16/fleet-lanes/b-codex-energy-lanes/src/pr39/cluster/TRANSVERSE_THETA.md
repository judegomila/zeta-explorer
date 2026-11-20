# A finite theta test for zeros at one projected height

The [four-point slope statistic](JOINT_PAIR_WINDOWS.md) has an exact local interpretation. If $f(t)=\Xi(t)=\xi(1/2+it)$, write $f(c+z)=z^m g(z)$ with $g(0)\ne0$ and $\ell=g'/g$. Then $H_h=m+h^2\ell'(0)+h^4\ell'''(0)/6+O(h^6)$ and

$$ Q_h=m-\frac{h^4}{24}\ell'''(0)+O(h^6). $$

This holds for every real $c$, including regular points ($m=0$). At an isolated height carrying exactly two zero copies, a strictly positive limit requires precisely the missing arithmetic conclusion $f(c)=0$. The following approach tests the entire transverse segment directly. It gives an all-height truncation bound and an independently checkable positive bridge shear on $32\le c\le64$.

## A polynomial with an arithmetic error bound

Let $x=b^2$, where $b$ is displacement from the critical line. The function

$$
 G_c(x)=f(c+i\sqrt{x}) f(c-i\sqrt{x})=\sum_{n\ge0}a_n(c)x^n
$$

is entire in $x$ because the product is even in $\sqrt{x}$. On $x\ge0$ it is a squared modulus. The generalized Laguerre coefficients satisfy $a_0=f(c)^2$, $a_1=f'(c)^2-f(c)f''(c)$ and
$$
 a_n(c)=\sum_{j=0}^{2n}(-1)^{n+j}
        \frac{f^{(j)}(c)f^{(2n-j)}(c)}{j!(2n-j)!}.
$$

Using the even, positive complete density $f(t)=\int_{\mathbb R}\Phi(u)e^{itu}\,du$, the coefficient is the integral of $\cos(c(u+v))(u-v)^{2n}\Phi(u)\Phi(v)/(2n)!$ on $\mathbb R^2$. The double-exponential decay justifies termwise integration. Thus $|a_n(c)|\le a_n(0)$ at every height. This Fourier representation and its connection with Laguerre inequalities are classical. [Csordas, Theorem 3.7](https://arxiv.org/pdf/1309.0055) and [the kernel normalization used here](CENTROID_SHEAR.md).

Choose any integer $k\ge1$, and set $R=(2k-1/2)^2$, $B=\xi(2k)^2$. Summing the positive majorants and using reflection gives

$$
 \sum_{n\ge0}|a_n(c)|R^n\le G_0(R)=B .
$$

Here $B=\pi^2/36$ at $k=1$. For all $k$, the completed zeta formula, $\pi>3$ and $\zeta(2k)<2$ give $B\le[2k(2k-1)(k-1)!/3^k]^2$. Raising $k$ makes the geometric ratio smaller at the cost of increasing $B$. [NIST DLMF, zeta reflection and completion](https://dlmf.nist.gov/25.4).

Write $P_m(x)=\sum_{n=0}^m a_n(c)x^n$. For every $0\le x\le1/4$,
$$
 |G_c-P_m|\le B(x/R)^{m+1},\qquad
 |G_c'-P_m'|\le\frac{(m+1)B}{R}(x/R)^m. \tag{1}
$$
For the derivative estimate, $n(x/R)^{n-m-1}\le m+1$ when $n\ge m+1$ since $x/R\le1/9$. Primes on $G$ and $P$ denote differentiation in $x$.

**Fixed-height equivalence.** There is no off-line zero at height $c$ if and only if some finite $m$ satisfies
$$
 P_m(x)-B(x/R)^{m+1}>0 \qquad (0<x\le1/4). \tag{2}
$$

Sufficiency follows from (1). For necessity let $j$ be the order of $f$ at $c$, allowing $j=0$. Then $x^{-j}G_c(x)$ has a positive continuous extension to the closed segment, with value $|f^{(j)}(c)/j!|^2$ at zero. Under the zero-exclusion hypothesis its minimum is positive. For $m\ge j$ the error from replacing this function by $x^{-j}(P_m-B(x/R)^{m+1})$ is at most $2B(1/4)^{m+1-j}/R^{m+1}$, which tends to zero. This proves (2), including a double line zero where $G_c$ starts with a positive $x^2$ term. At a height with exactly two copies, (2) therefore implies $\lim Q_h=2$. The equivalence supplies no height-uniform order or sign theorem. Near an exact multiple zero, proving zero low-order coefficients can require analytic input beyond interval arithmetic.

A reflected pair at $c\pm ib$, $b>0$, yields a further check. The squared modulus touches zero, so $G_c(s)=G_c'(s)=0$ at $s=b^2$. Isolating the first three coefficients as in (1) gives the simultaneous necessary inequalities
$$
 |a_1+2s a_2|\le 3B s^2/R^3,\qquad |a_0-s^2a_2|\le 2B s^3/R^3. \tag{3}
$$
The second uses $G_c-sG_c'$, with $(n-1)(s/R)^{n-3}\le2$ for $n\ge3$. Both inequalities must hold at the same $s$. They expose the cancellation required from the low derivatives as a pair approaches the line.

## A direct positive tail from the actual theta density

For completeness, the signs of all sufficiently high $a_n(c)$ follow from concentration in the double integral. The following elementary bound is intentionally loose and independent of any zero counts. Put
$$
 Y=\log(6\max(1,|c|)),\qquad
 n_0(c)=\left\lceil\frac{\pi e^{2(Y+2)}}{\log(1+1/Y)}\right\rceil .
$$
Then $a_n(c)>0$ for every $n\ge n_0(c)$. In particular an off-line zero at height $c$ requires at least one negative coefficient among $1\le n<n_0(c)$. If the finite prefix through $n_0(c)-1$ is nonnegative as a *polynomial* on $(0,1/4]$, the positive tail alone suffices, even with some negative individual coefficients.

**Proof.** For $t\ge0$ the explicit Jacobi series in the [centroid note](CENTROID_SHEAR.md) gives
$$
 20e^{9t/2-\pi e^{2t}}\le\Phi(t)\le80e^{9t/2-\pi e^{2t}}.
$$
Every summand is positive. The first one gives the lower bound since $4\pi^2-6\pi>20$. For the upper bound discard the negative term in each summand and use $\sum_{j\ge1}j^4e^{-\pi(j^2-1)}<2$. For $j\ge2$ use $j^4\le e^{2(j^2-1)}$ and sum the geometric bound $e^{-j}$. Evenness supplies the same estimate at negative arguments. Since $e^{2t}\ge1+2t$, $\int_{\mathbb R}\Phi(t)\,dt<8$.

Change variables to $y=(u-v)/2$, $z=(u+v)/2$. Up to a positive constant, $a_n(c)$ is
$$
 \int_0^\infty y^{2n}\int_\mathbb R P_y(z)\cos(2cz)\,dz\,dy,\qquad
 P_y(z)=\Phi(y+z)\Phi(y-z).
$$
For $y\ge1$ write $D_y=e^{9y-2\pi e^{2y}}$. The preceding envelope gives
$$
 P_y(z)\le6400D_y e^{-2\pi e^{2y}z^2},\qquad
 \int P_y(z)\,dz\ge 200e^{-\pi/2}D_y e^{-y}.
$$
For the upper bound use $\cosh(2z)-1\ge2z^2$. When $|z|>y$ the extra linear exponent $9(|z|-y)$ is at most $9z^2$, absorbed by $2\pi e^{2y}z^2$. For the lower bound restrict to $|z|\le e^{-y}/4$, where $|z|\le y$ and $\cosh(2z)-1\le4z^2$. The Gaussian second moment now gives $\int z^2 P_y/\int P_y\le[16e^{\pi/2}/(2^{3/2}\pi)]e^{-2y}<9e^{-2y}$. Hence the mean of $\cos(2cz)$ under this density is at least $1-18c^2e^{-2y}\ge1/2$ for $y\ge Y$.

The absolute contribution from $0\le y\le Y$ is at most $16Y^{2n}$ since $\int_{y\ge0}\int P_y=(\int\Phi)^2/4<16$. The part on $[Y+1,Y+2]$ alone contributes at least $100e^{-\pi/2}(Y+1)^{2n}e^{-2\pi e^{2(Y+2)}}$. The rest above $Y$ is nonnegative. For the stated $n$ the lower bound exceeds $16Y^{2n}$, proving the claim.

This gives a direct $O((1+c^2)\log(2+|c|))$ cutoff. A recent online manuscript reports a stronger logarithmic cutoff for sufficiently large heights by a different method. A separate preprint deduces positivity at every order inside a region already verified for RH, with a half-unit height margin. Neither assertion is used here. [Generalized Laguerre positivity at growing orders, Theorem 1a](https://rstation.ai/problems/riemann_hypothesis/papers/41) and [On some positivity properties of the Riemann $\Xi$ function, Theorem 1.3](https://arxiv.org/abs/2611.02944).

## One adverse low coefficient can suffice

For $0<b<1/2$, take $F_b(t)=e^{-t^2/2}(\cosh b+\cos t)$. This has a smooth strictly positive even Fourier density (a positive combination of shifted Gaussians) and an isolated conjugate pair at $\pi\pm ib$. At $c=\pi$ its transverse squared modulus is $e^{-\pi^2}e^x(\cosh b-\cosh\sqrt{x})^2$. Put $D=\cosh b-1$. Before multiplication by $e^x$, the coefficients are $D^2$, $-D$, and $(2^{2n-1}-2\cosh b)/(2n)!$ for $n\ge2$. The quadratic coefficient $(8-2\cosh b)/24$ exceeds $D$ throughout this range. After multiplication by $e^x$ the order-one coefficient is $D^2-D<0$, while every order $n\ge2$ is strictly positive: the quadratic term divided by $(n-2)!$ already exceeds $D/(n-1)!$. Nevertheless the squared modulus vanishes at $x=b^2$. This model shows why even positivity of *all* orders above one, together with positivity and smoothness of a Fourier density, cannot settle the low-order question for the arithmetic theta kernel.

## Direct verification across the full strip at heights 32 to 64

The [checker](check_transverse_theta.py) evaluates (1) with $m=14$, $k=11$, and complete theta derivatives through order 28. Its scalar bound at the worst displacement is
$$
 G_c'(x)\ \ge\
 a_1(c)+\sum_{n=2}^{14}\min(0,n a_n(c))\,4^{1-n}
 -\frac{4\cdot15}{43^{30}}\left(\frac{2\cdot11\cdot21\cdot10!}{3^{11}}\right)^2 .
$$
The subtracted derivative-tail bound is less than $5.33\cdot10^{-40}$. Each coefficient has a separate outward enclosure across its entire height subcell. By the chain rule, $\tfrac12\partial_b|\xi(1/2+b+ic)|^2=bG_c'(b^2)$, so a positive derivative gives the sign of $b$ for $0<|b|\le1/2$. It also gives $G_c(x)\ge G_c(0)+x\inf G_c'$. This verifies transverse bridge shear throughout a continuum and uses neither a list of zeros nor a contour count.

| Height interval | Lower bound for $G_c'(x)$ on $[0,1/4]$ |
|---|---:|
| [32, 36] | $4.26 \times 10^{-19}$ |
| [36, 40] | $6.25 \times 10^{-22}$ |
| [40, 44] | $3.20 \times 10^{-24}$ |
| [44, 48] | $3.71 \times 10^{-27}$ |
| [48, 52] | $1.92 \times 10^{-29}$ |
| [52, 56] | $5.85 \times 10^{-32}$ |
| [56, 60] | $2.98 \times 10^{-35}$ |
| [60, 64] | $5.48 \times 10^{-37}$ |

The completed function decays rapidly with height, so these absolute margins shrink. The heights were taken from the preceding experiment. This does not extend the known RH verification height. The result applies to both signs of the displacement by reflection.

**Reproduction and jet error.** Run `python3 cluster/check_transverse_theta.py` from the checkpoint directory with NumPy and default 70-digit Decimal arithmetic. The binary64 operations assume IEEE arithmetic with gradual underflow. Repeating the midpoint computations at 90 decimal digits reproduced the binary64 bounds for [40,44] and [60,64]. Independent high-precision zeta evaluations at 72 points exceeded the corresponding lower bounds. [Machine-readable lower bounds](transverse-theta.json).

Each width-four interval starts from one midpoint and uses 1,024 dyadic height subcells. On the theta mesh $h=1/128$, $U=3$, $N=16$, compute at the midpoint the derivatives of the finite sum through order $28+96$. Evaluate the normalized derivative $f^{(j)}/j!$ using a degree-96 horizontal Taylor polynomial with coefficients given by midpoint moments divided by $j!k!$ at term $k$. For $|\Delta c|\le2$, the truncation error per normalized derivative is at most $10e^3\,6^{97}/97!$, using the absolute mesh weight bound of 10 and $|u|^j/j!\le e^3$ on the retained mesh.

The [Poisson, spatial and theta-series error estimates](CENTROID_SHEAR.md) extend uniformly to all these normalized derivatives. On the shifted Fourier contours $u=t\pm i/4$ use $|u|^j/j!\le e^{|t|+1/4}$ against $1920e^2e^{-7|t|/2}$, giving total norm below $10^5$. The resulting alias bound is $2\cdot10^5 e^{64/4}/(e^{64\pi}-1)$. On the omitted real mesh tail the same $e^{|t|}$ factor leaves an integrable decreasing majorant and the bound $10^5e^{-e^6/2}$. On the retained mesh replace the $(1+U)^2$ multiplier in the series error by $e^U$, giving $120(2U+h)e^{U+9U/2-2(N+1)^2}$. Their sum and the Taylor error are below $10^{-65}$, which is added outward to every normalized derivative. Decimal midpoint coefficients are converted outward for the interval polynomial arithmetic.

## Remaining proof obligation

At a coincident two-copy site, (2) supplies a sufficient and pointwise necessary finite sign certificate that forces both zeros onto the line. Existence of these certificates at every such height remains open. The direct positive-tail theorem confines any failure to the signed low-order part. The stronger bridge inequality $G_c'(x)>0$ succeeded throughout the tested band. An arithmetic bound for that polynomial or its adverse coefficients at arbitrary candidate heights is still needed. In particular an actual double zero has $G_c'(0)=0$, so a uniform strictly positive derivative margin extending to $x=0$ cannot be required in that case.

The [mollified coverage and local energy test](MOLLIFIED_SHEAR_COVERAGE.md) establishes simultaneous low-order signs on a positive fraction of full-strip cells. The [direct moment estimate](LOW_ORDER_MOMENTS.md) bounds the average negative mass of each fixed coefficient. The unresolved case is a pointwise estimate at an arbitrary candidate pair center.
