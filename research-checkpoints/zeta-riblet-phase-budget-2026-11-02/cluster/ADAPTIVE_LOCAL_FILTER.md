# What a finite local filter can detect

On a band around $1967.40625$ the unfiltered zeta ratio falls below the [reflected-pair threshold](MOLLIFIED_SHEAR_COVERAGE.md). A degree-one filter lifts the ratio above threshold there. Two unconditional obstructions explain why the same procedure cannot use a uniformly bounded filter family at all heights. The strongest applies even when its coefficients are chosen after seeing the height.

## The ratio, the filter, and the exact limit

Write $z=s-1/2$, $U(z)=(s-1)\zeta(s)/s$, $z_0=d+ic$, and use the disk coordinate
$$
 w=\frac{z-z_0}{z+\overline{z_0}},\qquad
 z=ic+d\frac{1+w}{1-w},\qquad F(w)=(1-w)^2U(z(w)).
$$
For an analytic polynomial $p$ normalized by $p(0)=1$, put
$$
 R[p]=\frac{|F(0)|^2}{\|Fp\|_{H^2}^2},\qquad
 \mathcal R_N(d,c)=\max_{\deg p\le N,\ p(0)=1} R[p].
$$
The norm uses $d\theta/(2\pi)$ on the unit circle. In the original height variable it is exactly the previous energy $E_d(c)$ with the additional weight $|p((iv-d)/(iv+d))|^2$. In particular $R[1]$ is the previous raw ratio. Each multiplier preserves the same pair test. If $U(b+ic)=0$, division by its disk Blaschke factor and the Hardy evaluation inequality give
$$
 R[p]\le\left(\frac{d-b}{d+b}\right)^2.
$$
At a nearest dyadic scale $d=2^{-j}$, $j\ge1$, this upper bound is at most $q=17-12\sqrt2=0.02943725\ldots$. Different scales can use different filters.

There is an exact interpretation of optimization over **all** degrees. Set $dm=d\theta/(2\pi)$ and $C_{jk}=\int\overline{w^j}w^k|F|^2\,dm$ for $0\le j,k\le N$. This positive definite Toeplitz matrix gives
$$
 \mathcal R_N=|F(0)|^2(C^{-1})_{00},\qquad
 \lim_{N\to\infty}\mathcal R_N
 =|B(z_0)|^2
 =\prod_{\rho=1/2+b+i\gamma,\ b>0}
 \frac{(d-b)^2+(c-\gamma)^2}{(d+b)^2+(c-\gamma)^2}. \tag{1}
$$
The limit increases monotonically, and the product counts multiplicities. Indeed the classical zeta factorization writes the pole-removed $U$ as its outer factor times this Blaschke product, without a singular inner factor. Multiplication by $(1-w)^2$ adds only an outer factor. Szegő's prediction theorem gives $\inf_{p(0)=1}\|Fp\|^2=\exp\int\log|F|^2\,dm$, the squared central value of the outer factor. Equivalently, polynomial multiples of the outer factor are dense in $H^2$ and evaluation at zero is continuous. These are established factorization and prediction theorems. Equation (1) applies to Cayley polynomials. No density assertion for a fixed set of Dirichlet rungs is needed. [Kunik, equations (1.2)–(1.4), following Burnol](https://arxiv.org/pdf/0804.4829). [Szegő theory, DLMF §18.33(vi)](https://dlmf.nist.gov/18.33#vi).

## The raw ratio necessarily gets small

For fixed $0<d\le1/2$, the energy-weighted mean of $R[1]$ on $[T,2T]$ is
$$
 \frac{\int_T^{2T}|U(d+ic)|^2\,dc}{\int_T^{2T}E_d(c)\,dc}
 \sim \frac{\zeta(1+2d)}{6\log T}. \tag{2}
$$
The numerator is asymptotic to $T\zeta(1+2d)$ by the off-line second moment. Pole removal contributes a relative $1+O(T^{-2})$. The denominator kernel $16d^5/[\pi(d^2+v^2)^3]$ has mass six. For $|v|\le\sqrt T$ the shifted critical-line second moment is $(1+o(1))T\log T$ uniformly, by squeezing between slightly shorter and longer intervals. For $|v|>\sqrt T$ the elementary bound $|\zeta(1/2+it)|\le2+2|t|$ gives a contribution $O_d(T^{1/2})$. These estimates give (2). [Titchmarsh, Chapter VII](https://sites.math.rutgers.edu/~zeilberg/EM18/TitchmarshZeta.pdf). [Critical-line second and fourth moments, §4](https://ems.press/content/book-chapter-files/33156?nt=1).

More precisely, for every $A>\zeta(1+2d)/6$, the set $R[1]\le A/\log T$ has measure $\gg_{d,A}T/\log^2 T$ in each sufficiently large slab. Its complement carries at most $(\log T/A)\int |U|^2$ of the energy. The set therefore carries $\gg T\log T$. Cauchy–Schwarz gives the claimed measure since $\int_T^{2T} E_d(c)^2\,dc\ll_d T\log^4 T$: apply the kernel-weighted Cauchy–Schwarz inequality and integrate the standard fourth-moment bound up to $2T+|v|+2$. Thus a height-independent positive floor for the raw statistic is impossible.

## A barrier for every fixed finite dictionary

**Proposition.** Fix $d=1/4$, a nonnegative degree $N$, and any $\epsilon>0$. On a set of positive lower density in height, $\mathcal R_N(d,c)<\epsilon$ while $\zeta$ is zero-free on the entire translated closed disk $|w|\le1/4$. That disk contains every $b+ic$ in the matching range $d/\sqrt2\le b\le\sqrt2d$. The conclusion also holds for any fixed finite set of Dirichlet monomials with arbitrary height-dependent coefficients, with the maximum taken over that span.

**Proof.** Set $r=1/4$, $L=N+1$, and $w_j=r e^{2\pi ij/L}$ for $0\le j<L$. Discrete Fourier averaging gives $\sum_j p(w_j)/L=p(0)=1$, so some $|p(w_j)|\ge1$, regardless of its coefficients. The Hardy evaluation inequality at the nodes implies
$$
 \|Fp\|^2\ge(1-r^2)\min_j |F(w_j)|^2. \tag{3}
$$
At height zero the image of $|w|\le r$ in the $s$-plane is a closed disk $K$ with connected complement. Its range in $\Re s$ is $[13/20,11/12]\subset(1/2,1)$. The real radial range in $z$ is $[3d/5,5d/3]$. On $K$ prescribe the nowhere-vanishing analytic function
$$
 g(s)=\exp\{-A[1-(w(s)/r)^L]\}.
$$
It equals $e^{-A}$ at the center, equals one at every node, and has modulus at least $e^{-2A}$ on $K$. Voronin universality gives positive lower density of translations $c$ that approximate this target uniformly within $e^{-2A}/2$. The translated disk is zero-free. At large such $c$, $(s-1)/s$ has modulus between $1/2$ and $2$ on the disk. Consequently $|F(0)|\le 3e^{-A}$ while $\min_j|F(w_j)|\ge(1-r)^2/4$. Taking $A$ large in (3) proves the assertion. Positive lower density here refers to Lebesgue measure in $[0,T]$ divided by $T$. Its constant may depend on $N,\epsilon$. [Herichi and Lapidus, Theorem 2.2, positive-density universality](https://www.numdam.org/item/AFST_2014_6_23_3_621_0.pdf).

For a fixed finite Dirichlet span, translation multiplies each basis vector $n^{-s}$ by the scalar $n^{-ic}$, so its span in the disk coordinate is independent of $c$. Choose finitely many nodes on $|w|=r$ for which evaluation on this space is injective. They exist because an analytic function vanishing on that entire circle vanishes identically, and the dimension is finite. Norm equivalence gives $|p(0)|\le C\max_j|p(w_j)|$. Use $g(s)=\exp[-A\prod_j(1-w(s)/w_j)]$ instead, choosing the uniform tolerance below half its positive minimum and below $e^{-A}/2$. The same proof absorbs $C$ into the constant. This also covers a finite dictionary of prime or prime-power rungs. The proposition concerns universal guarantees across all heights. A restriction to sites identified independently by a zero count imposes an extra condition that universality here does not control.

## A simultaneous estimate on small scales

Let $\mathcal R_\infty=|B|^2$, fix $0<d_0\le1/2$, and sample $d_j=2^{-j}d_0$ for $j\ge0$. The fraction of heights in $[T,2T]$ where at least one of these scales has $\mathcal R_\infty\le q$ is at most
$$
 \frac{2d_0\log T+O(d_0)}{\log(1/q)}. \tag{4}
$$
For a single right-hand zero, the integral over $c\in\mathbb R$ of its contribution to $-\log|B|^2$ is $4\pi\min(b,d)$. This follows by integrating the difference of the two logarithms in (1), including the integrable singularity at $b=d$. Zeros in $[T-1,2T+1]$ contribute at most $4\pi d$ each. By reflection and the Riemann–von Mangoldt formula there are at most $T\log T/(4\pi)+O(T)$ right-hand copies there. For the remaining zeros use $\log(1+u)\le u$ to bound each term by $4db/(c-\gamma)^2$. At distance $k\ge1$ from the slab, its integral costs $O(d\min(1/k,T/k^2))$. Summing in unit intervals with $O(\log(2+T+k))$ copies gives $O(d\log^2 T)$. Sum the nonnegative integrals over $j$, using $\sum d_j=2d_0$, and apply Markov's inequality. All errors are uniform in $d_0$.

For example, take the largest dyadic $d_0\le1/(100\log T)$. More than 99.4% of heights eventually pass simultaneously at every such fine scale. At each passing height and scale, some finite degree is sufficient by (1). The estimate gives neither that degree nor a conclusion about a candidate in the exceptional set. Splits larger than the tested scales require separate tests.

## A certified failure and repair on actual zeta

For every $|c-(1967+13/32)|\le1/4096$ the [interval checker](certify_filtered_ratio.py) proves the following bounds. The band was selected by a floating-point scan and independently checked by outward interval arithmetic.

| Scale | Filter | Certified conclusion |
|---|---|---|
| $d=1/2$ | $1$ | $R[1]<0.0247<q$ |
| $d=1/2$ | $1+3w/4$ | $R[p]>0.0440>q$ |
| $d=1/4,\ldots,1/128$ dyadic | $1$ | $R[1]>0.0455$ |
| $0<d\le1/128$ | $1$ | $R[1]>0.0523$ |

Thus the combination excludes a reflected pair anywhere in the band at every possible displacement. This is a controlled example in the established low-height verification range. It also exhibits an actual false low reading on an entire band.

Run `python3 cluster/certify_filtered_ratio.py` from the checkpoint directory with NumPy and IEEE binary64 with gradual underflow. The Euler–Maclaurin bound for $\zeta(s)-\sum_{n\le1024}n^{-s}$ is below $1/25$ throughout the sampled $1950<t<1985$, $1/2\le\sigma\le1$. The code adds the bounds for the pole term, half endpoint, eight Bernoulli terms and the periodic Bernoulli remainder. For the last it uses $4\sqrt{1024}(2016/(6\cdot1024))^{16}/15$. All powers start with a degree-20 exponential at $-s\log n/2^{14}$, of modulus below one, followed by 14 interval squarings. On $|v|\le16$ it integrates over height bins of width $1/512$ with degree-16 local Taylor jets. Since $\sum_{n\le1024}n^{-1/2}\le64$ and $(1/4+1/4096)\log1024<2$, their component remainder is at most $64\cdot2^{17}/17!$. The exterior uses the [previous absolute tail bound](MOLLIFIED_SHEAR_COVERAGE.md) multiplied by $(1+|3/4|)^2$ for the linear filter. For $d\le1/128$ the kernel has total mass six and $|v/d|\le32$ is covered by $|v|\le1/4$. The complement receives the same analytic tail bound.

## The arithmetic target for the main attack

For $F(0)\ne0$, Parseval makes a finite witness explicit. A normalized filter passes precisely when
$$
 \sum_{k\ge1}|[w^k]\,(Fp)|^2 < (16+12\sqrt2)|F(0)|^2. \tag{5}
$$
This follows by separating the constant term in $\|Fp\|^2$ and using $q^{-1}-1=16+12\sqrt2$. For the exceptional centers one needs a construction from zeta's arithmetic that establishes (5) at the matching scales, or an independent geometric condition narrowing the sites. Optimizing after replacing (5) by the unknown zero product would be circular for that purpose. At the safe anchor $(d,c)=(1/2,0)$, $U(1/2)=1$ by removal of the zeta pole. Equation (1) shows that $\mathcal R_N\to1$ at this single anchor exactly when RH holds. That classical factorization criterion supplies no rate driving this residual to zero and no sign for the separate twin-ladder operator.
