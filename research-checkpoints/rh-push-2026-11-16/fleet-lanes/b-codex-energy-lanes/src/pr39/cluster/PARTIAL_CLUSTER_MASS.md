# How much critical-line mass a cluster certifies

8 November 2026. The [moving-window criterion](../energy/MOVING_WINDOW.md) compares the arithmetic total $A(u)$ with a lower bound on critical-line mass. Its exclusion threshold on the half-unit grid is $q=2\operatorname{sech}(\pi/8)$. This note derives a lower bound from partial cluster moments, calculates the precise pivot missed by a nearly real conjugate pair, and applies the full two-root test to the actual completed zeta function.

## Partial credit from a positive subspace

Use the ordinate coordinate $z=(s-1/2)/i$. Take a conjugation-symmetric contour with no zeros on the boundary and a certified integer count $m$ inside. Write $H=(p_{i+j})_{0\le i,j<m}$, where $p_j$ is the sum of the $j$th powers of the enclosed roots with multiplicity. Any real affine recentering and nonzero real scaling of the ordinate works. Suppose the quadratic form is certified positive definite on a real subspace of dimension $k$. A strictly positive $k$ by $k$ leading block is one way to obtain this.

At least $\max(0,2k-m)$ **distinct** enclosed roots lie on the real axis. To see this, let $r$ be the number of distinct real roots and $c$ the number of distinct nonreal conjugate pairs. Real polynomial evaluation decomposes the form into $r$ positive real squares and $c$ real blocks of signature $(1,1)$. Each complex value $a+ib$ contributes $2\mu(a^2-b^2)$ for multiplicity $\mu$. Interpolation at all distinct roots gives every such evaluation vector, with the remaining directions in the nullspace. Thus $k\le r+c$, while $r+2c\le m$. Eliminating $c$ proves the claim. If the full form is positive semidefinite, then $c=0$ and **all $m$ copies** are credited, including repetitions.

For a cluster with height projection $I$, partial credit is at least $\max(0,2k-m)\min_{v\in I}\operatorname{sech}(\pi(v-u)/2)$. For a fully certified real cluster one can instead use its exact weighted contour sum, integrating $\operatorname{sech}(\pi(z-u)/2)\Xi'(z)/\Xi(z)$ and dividing by $2\pi i$. For this identity keep the contour and its interior inside $|\Im z|<1$, the first poles of the weight. This removes the loss from replacing the weight by its minimum on a wide interval.

The underlying signature theorem is classical. See [Basu, Pollack and Roy, Algorithms in Real Algebraic Geometry, Hermite forms](https://perso.univ-rennes1.fr/marie-francoise.roy/bpr-ed2-posted3.pdf). The formulas here apply it to the height-dependent credit required by the checkpoint.

## Why every smaller block can pass beside an off-line pair

Take $m-2$ distinct real numbers $a_j$, each different from a real center $c$, and the two roots $c\pm ib$. At $b=0$ the cluster has $m-1$ distinct real support points. The leading block of size $m-1$ is strictly positive because a polynomial of degree at most $m-2$ that vanishes at all these points is zero. That block stays positive for sufficiently small nonzero $b$. Nevertheless exactly $m-2$ copies remain on the line. This attains the partial-credit bound for $k=m-1$.

Let $V(a)=\prod_{i<j}(a_j-a_i)$. For $b\ne0$ the full determinant is the square of the complex Vandermonde determinant,
$$
\det H_m=-4b^2 V(a)^2\prod_j\big((c-a_j)^2+b^2\big)^2.
$$
At $b=0$, $\det H_{m-1}=2V(a)^2\prod_j(c-a_j)^2$, since the center has multiplicity two. The last Schur pivot therefore satisfies
$$
\frac{\det H_m}{\det H_{m-1}}
=-2b^2\prod_j(c-a_j)^2+O(b^4)
$$
for fixed $a_j,c$ as $b\to0$. A smaller block can retain a positive margin even while the last pivot is negative and tends to zero quadratically. A uniform absolute-error allowance on that last pivot cannot settle its sign for this family. These are freely chosen polynomial clusters. Transferring a sign estimate to the actual theta moments requires additional arithmetic information. Exact rational checks at $c=0$, $a_j=j$, $b=1/1000$, for $2\le m\le8$ confirm the determinant identity and the signs of all leading blocks.

## A two-root certificate for the actual function

Take $0<\Re s<1$, $12<\Im s<23$, and the scaled ordinate $w=((s-1/2)/i-18)/4$. The [checker](certify_pair_moments.py) encloses
$$
p_j=\frac1{2\pi i}\oint w(s)^j\frac{\zeta'(s)}{\zeta(s)}\,ds,\qquad j=0,1,2.
$$
The completion factor has no zeros or poles here. These are the moments of the completed-function zeros. Their reality follows from symmetry. For two roots, $2p_2-p_1^2=(w_1-w_2)^2$. A positive value forces two distinct real roots, a negative value gives a nonreal conjugate pair, and exact equality gives a repeated real root.

The outward enclosures, rounded further outward here, are

| Quantity | Lower | Upper |
|---|---:|---:|
| Count integral $p_0$ | 1.738 | 2.274 |
| First moment $p_1$ | -0.469 | 0.041 |
| Second moment $p_2$ | 1.243 | 1.777 |
| Discriminant $2p_2-p_1^2$ | 2.267 | 3.553 |

The first interval forces the integer count two. The positive discriminant certifies both copies on the critical line without importing any zero ordinates or presuming their simplicity. For every $16.5\le u\le18.5$, the central band $|t-u|<4.5$ lies in this certified rectangle. Crediting the full weighted sum of its two real zeros leaves only positive contributions from outside the rectangle. By equation (4) of the moving-window note, the deficit is at most
$$
300e^{-4.5\pi/2}(\log 29+1)<1.116<q.
$$
At $u=17.5$ the distance to both edges is $5.5$, giving a bound below $0.232$. These are deductions from the contour certificate and the unconditional tail bound. They cover a low-height interval whose zeros were previously known.

## Arithmetic and reproduction

Run `python3 cluster/certify_pair_moments.py` from the checkpoint directory with NumPy installed. The [recorded intervals](pair-moments.json) use 16,384 cells on each of four sides. A trial with 4,096 per side failed to isolate the count and raised an error.

The source expression uses the order-16 Euler–Maclaurin formula from the [earlier contour certificate](CLUSTER_RESIDUAL.md) with cutoff 16. On this larger rectangle $|s|<24$ and $|s+j|\ge12$ for $j\ge0$. The periodic Bernoulli majorant gives
$$
R_0=\frac{4\prod_{j=0}^{15}(24+j)}{6^{16}\,15\,16^{15}},\qquad
R_1\le R_0(16/12+\log 16+1/15)<5R_0.
$$
Both real and imaginary components are widened by the respective value and derivative errors. At each segment midpoint the exponential of $-s\log(n)/128$ is enclosed by a degree-20 Taylor polynomial with component error at most $e/21!<10^{-18}$ because the argument has modulus below one. Seven interval squarings recover $n^{-s}$. For the entire segment each component gets an additional allowance of half the segment length times $\log n$, since $\Re s\ge0$. All subsequent operations enclose the full segment, including the normalized powers and the quotient. A positive lower bound on the denominator is required on every cell.

Endpoints and midpoints of the dyadic subdivisions are exact binary numbers. The checker uses elementary binary64 array operations with each result widened using the adjacent representable number, including every step in the pairwise integration sums. It assumes ordinary IEEE arithmetic with gradual underflow. Logarithms of the small integers are enclosed using correctly rounded Decimal logarithms and outward conversion. The final real moments use the imaginary parts of the contour integrals and the elementary enclosure $3.140625<\pi<3.142578125$. Local reruns reproduced the stored result. The computation has not been independently audited.

The global missing estimate is the lower bound on credited mass at every grid center. The finite certificate demonstrates the moment test on a real cluster. The explicit last-pivot family shows which sign still needs an arithmetic proof when a cluster can contain a nearly coincident reflected pair.
