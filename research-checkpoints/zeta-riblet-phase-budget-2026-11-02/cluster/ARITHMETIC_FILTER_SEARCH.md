# An adaptive arithmetic rule and a fixed covering grid

The [local filter construction](ADAPTIVE_LOCAL_FILTER.md) now has an arithmetic selection rule with a separate interval check for every proposed polynomial. On the existing band around height $1967.40625$, degree two is necessary and sufficient at $d=1/2$ for the stronger threshold $1/16$. The rule also succeeds at every smaller dyadic scale on that band. A covering theorem specifies what an all-height termination argument would have to prove.

## Choosing the next coefficient from arithmetic

Use $U(z)=(s-1)\zeta(s)/s$, $s=1/2+z$, $z_0=d+ic$, and
$$
 w=\frac{z-z_0}{z+\bar z_0},\qquad F(w)=(1-w)^2U\left(ic+d\frac{1+w}{1-w}\right).
$$
For $p(0)=1$, its ratio is $R[p]=|F(0)|^2/\|Fp\|_{H^2}^2$. Every entry of the positive definite matrix
$$
 C_{jk}=\int_{\mathbb R}\frac{16d^5|\zeta(1/2+i(c+v))|^2}
 {\pi(d^2+v^2)^3}\,\overline{w(v)^j}w(v)^k\,dv,\qquad
 w(v)=\frac{iv-d}{iv+d},
$$
is an arithmetic integral on the critical line. For degrees at most $N$, the minimizing coefficient vector and energy are
$$
 a_N=\frac{C_N^{-1}e_0}{e_0^*C_N^{-1}e_0},\qquad
 e_N=\frac1{e_0^*C_N^{-1}e_0}.
 \tag{1}
$$
This follows directly from constrained quadratic minimization. The matrix is invertible because a nonzero polynomial has positive squared norm against this almost-everywhere positive weight.

An incremental version shows the exact benefit of another mode. In the weighted inner product $\langle f,g\rangle=\int\bar f g|F|^2\,dm$, let $V_N=\operatorname{span}(w,\ldots,w^N)$ and let $r=w^{N+1}-\operatorname{proj}_{V_N}w^{N+1}$. Put $\delta=\|r\|^2>0$ and $g=\langle r,p_N\rangle$. Then
$$
 p_{N+1}=p_N-\frac{g}{\delta}r,\qquad
 e_{N+1}=e_N-\frac{|g|^2}{\delta}. \tag{2}
$$
Both $r$ and every vector in $V_N$ vanish at zero, so normalization is preserved. Orthogonality proves the norm identity. Thus exact optimization improves monotonically, although a numerically rounded proposal can give a weaker certified bound.

The implementation obtains approximate entries from interval-enclosed zeta data, solves (1), and rounds the real and imaginary coefficients to multiples of $1/1024$. It then integrates the squared modulus of that exact dyadic polynomial with outward arithmetic. The floating-point solve only proposes a polynomial. The certificate needs no accuracy guarantee for the solve. On the omitted boundary, $|p(w)|\le L=\sum_k(|\Re a_k|+|\Im a_k|)$ since $|w|=1$. Multiplying the earlier analytic tail bound by $L^2$ covers that entire tail.

These modes are powers of the rational Cayley coordinate. The finite Dirichlet dictionary in the preceding universality theorem is a different family. Connecting these filters to the prime-rung twin-ladder operator requires an additional representation or comparison.

## A grid that covers every possible reflected pair

Fix any dyadic height offset $c_*$. Set
$$
 d_j=2^{-j},\quad c_{j,k}=c_*+k d_j/2,\quad j\ge1,\ k\in\mathbb Z,
 \qquad q_*=\frac1{16}.
$$
A certificate $R[p]>q_*$ at $(d,c)$ excludes every zero in
$$
 \left|\frac{z-(d+ic)}{z+d-ic}\right|^2\le\frac1{16}.
$$
Indeed, a zero at $a$ supplies a Blaschke factor and forces
$R[p]\le |(a-z_0)/(a+\bar z_0)|^2$. In Euclidean coordinates the excluded disk is
$$
 \left|z-\left(\frac{17d}{15}+ic\right)\right|\le\frac{8d}{15}.
 \tag{3}
$$
This conclusion uses the strict lower ratio bound, so the closed disk is allowed.

These predetermined disks cover the whole region $0<\Re z\le1/2$. For any hypothetical zero $b+i\gamma$, select a dyadic $d\le1/2$ with $r=b/d\in[3/4,3/2]$. Such a $d$ always exists. Choose the nearest grid center $c=c_*+k d/2$, so $|u|=|\gamma-c|/d\le1/4$. The desired strict inequality is
$$
 \frac{(1-r)^2+u^2}{(1+r)^2+u^2}<\frac1{16}.
$$
After multiplying positive denominators it becomes
$15r^2-34r+15+15u^2<0$. The left side is convex in $r$ and increasing in $u^2$. Its maximum on the rectangle occurs at $u^2=1/16$ and an endpoint of the $r$ interval. The two endpoint values are $-9/8$ and $-21/16$, both negative. This is also checked with rational arithmetic in the script. Reflection handles zeros to the left of the critical line.

Thus it suffices to construct one passing finite polynomial at every grid point. The grid removes the need to know hypothetical zero heights in advance. Critical-line zeros of any multiplicity lie on the boundary of the half-plane and require no separate multiplicity assumption.

## What termination means

At a fixed anchor the established factorization and prediction theorems give
$$
 \mathcal R_N=\frac{|F(0)|^2}{e_N}\uparrow |B(d+ic)|^2,
 \tag{4}
$$
where $B$ is the product over right-hand zeta zeros from the preceding note. A sound search for a strict certificate terminates exactly when this limit is greater than $q_*$. Equality supplies no strict witness. [Zeta factorization, Kunik equations (1.2)–(1.4)](https://arxiv.org/pdf/0804.4829). [Szegő prediction theory, DLMF §18.33](https://dlmf.nist.gov/18.33).

A complete search must refine coefficient rounding, the finite integration mesh, the zeta enclosure, and the omitted-tail cutoff as well as increase degree. One provably exhaustive schedule enumerates dyadic coefficient vectors with constant coefficient one and increasing degree, denominator and coefficient bound, while refining each proposed certificate in a dovetailed schedule. Finite strict inequalities are open in coefficient space, and the boundary energy of each polynomial is finite. Consequently a strict complex-coefficient witness has a nearby dyadic witness that will eventually be certified. Zeta evaluation by Euler–Maclaurin and the explicit tail make each stage computable. The removed pole at $(d,c)=(1/2,0)$ is evaluated by its analytic limit.

Equation (1) provides much faster proposals for this search, and it can be used alongside the exhaustive schedule. A schedule that simultaneously revisits each fixed degree with improving integration and coefficient precision also converges to its strict optimum. Merely increasing degree with a fixed mesh or fixed coefficient denominator does not establish completeness.

The following equivalence locates the remaining proof obligation exactly.

- If every point of the predetermined grid eventually receives a strict certificate, (3) excludes every off-line zero, giving RH.
- If RH holds, $B=1$. At each grid point, (4) tends to one, so a strict finite certificate exists and the complete search eventually finds it.

This equivalence derives from the classical factorization theorem and the covering geometry. It supplies no unconditional termination proof. The existing universality obstruction rules out a fixed degree bound over continuously varying heights at $d=1/4$. A corresponding obstruction on this exact grid requires a separate argument.

The incremental rule gives another exact target entirely in the boundary correlations. Write $e_0=C_{00}$. For a fixed grid point a sufficient and necessary finite stopping inequality is
$$
 \sum_{n=0}^{N-1}\frac{|g_n|^2}{\delta_n}
 > C_{00}-16|F(0)|^2.
$$
Equivalently, partition $C_N$ into its constant entry, the mixed column $h$, and the block $D$ indexed by $w,\ldots,w^N$. Then $e_N=C_{00}-h^*D^{-1}h$ and the target is $h^*D^{-1}h>C_{00}-16|F(0)|^2$. These are exact local Schur-complement identities. A global proof would have to guarantee enough accumulated reduction at each grid point from the zeta correlations.

The arithmetic sufficient condition at a grid point is particularly simple. If $F(0)\ne0$, Parseval gives
$$
 \sum_{\ell\ge1}\left|[w^\ell]\,Fp\right|^2
 <15|F(0)|^2.
 \tag{5}
$$
This is exactly $R[p]>1/16$. The unresolved global estimate must produce such a filter from the actual zeta data at every grid point. Inferring (5) from $B=1$ would assume the desired conclusion.

## A certified arithmetic selection on actual zeta

Run `python3 cluster/certify_adaptive_filter.py` with NumPy from the checkpoint directory. The source evaluations retain the verified domain of the [preceding interval calculation](certify_filtered_ratio.py). At every height in
$$
 |c-(1967+13/32)|\le1/4096,
$$
the algorithm chooses filters and proves the following strict bounds. Taking $c_*=1967+13/32$ makes their common center the $k=0$ point at every grid scale.

| Scale | Selected degree | Lower ratio bound |
|---|---:|---:|
| $1/2$ | 2 | 0.0721 |
| $1/4$ | 1 | 0.0874 |
| $1/8$ | 0 | 0.0795 |
| $1/16$ | 0 | 0.1083 |
| $1/32$ | 0 | 0.1254 |
| $1/64$ | 0 | 0.1304 |
| $1/128$ | 0 | 0.1245 |
| $1/256$ | 0 | 0.1083 |
| All $0<d\le1/256$ | 0 | 0.0933 |

At $d=1/2$ its automatically chosen witness is
$$
 p(w)=1+\left(\frac{1269}{1024}-\frac5{32}i\right)w
       +\left(\frac{639}{1024}-\frac{161}{1024}i\right)w^2.
$$
The optimum over **all** normalized degree-one polynomials is below $0.0591$ across the same band. To certify this upper bound, choose any trial $p=1+aw$. Let $E=\|Fp\|^2$, $m_0=\|F\|^2$, and $g=\langle w,p\rangle=\int(\bar w+a)|F|^2\,dm$. Completing the square gives the exact minimum $e_1=E-|g|^2/m_0$. Interval integration encloses $E,g,m_0$, with a tail for $g$ bounded by $(1+|\Re a|+|\Im a|)$ times the unfiltered tail. A lower bound on $e_1$ and upper bound on $|F(0)|^2$ give the stated ceiling. Therefore degree two is necessary and sufficient on this band at this scale for the new threshold.

The checker certifies all finite scales as whole height bands. For the continuous small-scale row it uses the already-enclosed boundary mass on $|v|\le1/8$, the kernel's total mass six, and the analytic tail outside $|v/d|\le32$. The numerator enclosure includes every $0\le d\le1/256$. The ratio assertion applies to $d>0$.

Controls in the checker also compare a polynomial with a zero inside the disk and an outer polynomial with the same boundary weight. Their different central values must keep the inside-zero example below threshold.

The [recorded certificate](adaptive-filter.json) includes every trial, the chosen exact coefficients, the degree-one upper bound, and the interval lower bounds. The default maximum degree is six and coefficient rounding is fixed for this experiment. An unresolved budget causes an error. This implementation demonstrates finite arithmetic selection on the stated band. The unbounded search and its global termination proof remain separate tasks.
