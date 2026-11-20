# Excluding an isolated reflected pair by its centroid shear

8 November 2026. The [last-pivot test](ARITHMETIC_PIVOT.md) detects a two-copy cluster from a signed value at its centroid. Here the first transverse derivative of the bridge shear gives a different exclusion test. We bound the entire exterior zero contribution using a convergent prime series, derive an explicit complete-theta test with all-height truncation bounds, and verify the test directly on two known zeros near height 111. The arbitrary-height theorem has arithmetic and isolation hypotheses. Their general validity remains open.

## The exclusion theorem

Put $\Xi(z)=\xi(1/2+iz)$, $W(x,t)=\frac12\partial_x|\Xi(t-ix)|^2$ and $L(t)=\Xi'(t)^2-\Xi(t)\Xi''(t)$. Since $\Xi$ is real on the real axis, Taylor expansion gives $\partial_x W(0,t)=L(t)$. Take a bounded conjugation-invariant contour enclosing exactly two zero copies, counted with multiplicity. The centroid $c=p_1/2$ is real. An interval $I$ known to contain both height projections also contains $c$. For each possible off-real pair in the cluster write $c\pm ib$, $0<b\le r$. One can always take $r=1/2$ from the critical strip.

**Theorem.** Suppose every exterior zero in ordinate coordinates is at distance at least $R>0$ from $c$. Let $A(c)=\Re(\xi'/\xi)(2+ic)$ and
$$
 M=(1+2/R^2)A(c).
$$
An upper bound on $A$ throughout $I$ suffices. If $K\ge0$ satisfies $L(c)+K\Xi(c)^2\ge0$ and $(K+M)r^2<2$, both enclosed zeros are real ordinates. If $L(c)>0$, they are distinct. The hypotheses allow $c$ to be specified by contour data before either zero has been located. A method to compute $K$ from the complete theta source appears below.

**Proof.** Divide $\Xi$ by the monic cluster quadratic to obtain $G$, nonvanishing in the cluster domain. A hypothetical nonreal pair has quadratic $(z-c)^2+b^2$, giving
$$
 \frac{L(c)}{\Xi(c)^2}=-\frac{2}{b^2}-(\log|G|)''(c).
$$
The twice-differentiated genus-one Hadamard product gives
$(\log|G|)''(c)=-\Re\sum_{\rm ext}(c-z_\rho)^{-2}$. The second-derivative series converges absolutely. Exponential factors of degree at most one disappear. For $z_\rho=\gamma+i(1/2-\beta)$ put $v=c-\gamma$, $a=2-\beta\in(1,2)$, $d=|c-z_\rho|$. Then
$$
 \frac{1/d^2}{a/(a^2+v^2)}
 = \frac{a}{d^2}+\frac{v^2}{ad^2}
 \le 2/R^2+1.
$$
The [centered Hadamard formula](../README.md) gives $A(c)=\sum_\rho a/(a^2+v^2)$, including multiplicities. Every summand is positive, so $|(\log|G|)''(c)|\le M$. The hypothetical pair would imply $2/b^2\le K+M$, a contradiction. Conjugation leaves only two real roots or a double real root. At a double real root both $\Xi$ and $\Xi'$ vanish, forcing $L(c)=0$.

The exterior bound is valid at every height without RH. With $H(s)=s(s-1)\pi^{-s/2}\Gamma(s/2)/2$,
$$
 A(c)=\Re(H'/H)(2+ic)-\sum_{n\ge2}\Lambda(n)n^{-2}\cos(c\log n).
$$
In particular $A(c)=\frac12\log(2+|c|)+O(1)$ as $|c|$ grows by Stirling and absolute convergence. For densely spaced exterior zeros the multiplier $1+2/R^2$ can be expensive. Counts on finitely many concentric annuli sharpen it: charge a shell $D\le|c-z_\rho|<2D$ containing at most $n$ exterior copies by $n/D^2$, then use the displayed $M$ just for the remaining tail with its larger cutoff $R$. Overcounting the shell contribution inside $A$ preserves an upper bound.

## Obtaining K from the complete theta source

Use the even theta density
$$
 \Phi(u)=\sum_{n\ge1}(4\pi^2n^4e^{9u/2}-6\pi n^2e^{5u/2})
                 \exp(-\pi n^2e^{2u}),\quad u\ge0,
 \qquad \Xi(t)=\int_{\mathbb R}\Phi(u)e^{itu}\,du.
$$
The even extension continues holomorphically to $|\Im u|<\pi/4$. [Lagarias and Montague, equations (1.1)–(1.2) and Lemma 3.1](https://rikkyo.repo.nii.ac.jp/record/8642/files/AA00610867_60-01%2C02_14.pdf).

Compute real enclosures $J_j$ for $\Xi^{(j)}$, $j=0,1,2$, over an interval containing $c$. Then $S=\inf J_1^2-\sup(J_0J_2)$ bounds $L$ below, with $J_1^2$ the range of the square. Take $K=0$ if $S\ge0$. Otherwise, if $m_0=\inf_{z\in J_0}|z|>0$, take $K=-S/m_0^2$. If neither test resolves the interval, subdivide it or record failure. For subdivisions take the largest required $K$. No division by a possibly vanishing completed function is required for the $K=0$ test.

There is also a single signed integral for the remaining analytical task. With $q=u+v$ and $y=(u-v)/2$, symmetrizing the product transforms gives
$$
 L(c)+K\Xi(c)^2=\int_{\mathbb R}\cos(cq)\left[\int_{\mathbb R}
 (2y^2+K)\Phi(q/2+y)\Phi(q/2-y)\,dy\right]dq.
$$
The factor $2y^2$ is half the square of the frequency difference. The inner kernel is nonnegative, while the cosine changes sign. An all-height argument could target this integral only at eligible centroids and with the positive allowance $K<2/r^2-M$. A sign estimate for these cluster moments still requires a separate transfer to prove positivity of the main bridge operator's full Schur complement.

Here is one all-height error bound for computing those three enclosures. Let $0<h\le1$, $U=Jh\ge3$ with integer $J$, $N\ge1$, and $|t|\le T$. Approximate the Fourier integrals of $(iu)^j\Phi(u)$ on the mesh $u=kh$, $|k|\le J$, using the first $N$ terms of the positive-half density and even reflection. For each $j\le2$ the absolute error is at most
$$
 E=\frac{2\cdot10^5 e^{T/4}}{e^{\pi/(2h)}-1}
   +10^5e^{-e^{2U}/2}
   +120(2U+h)(1+U)^2 e^{9U/2-2(N+1)^2}. \tag{1}
$$

* Mesh error. On $u=x\pm i/4$, $x\ge0$, we have $\pi\cos(1/2)>2$, and the polynomial prefactors are bounded by $60 n^4e^{9x/2}$. Use $2n^2e^{2x}\ge n^2+e^{2x}$, $e^{2x}\ge8x-2$ and $\sum n^4e^{-n^2}<32$ (bound $n^4e^{-n^2/2}<16$ and sum $e^{-n/2}$). Evenness bounds the negative half. Integration of $1920e^2(1+x)^2e^{-7x/2}$ on each half gives total norm below $10^5$, also after multiplying the density by $u^j$. Shifting the Fourier contour therefore bounds each transform by $10^5 e^{-|v|/4}$. Poisson summation and the geometric sum over the nonzero aliases $v=t+2\pi k/h$ give the first term.
* Spatial tail. For $x\ge U\ge3$, $e^{2x}\ge e^{2U}/2+8x$. The real-axis bound on $|x^j\Phi(x)|$ is then $1920(1+x)^2e^{-7x/2}e^{-e^{2U}/2}$. The decreasing majorant permits integral comparison of the two omitted mesh tails, giving the second term.
* Theta series tail. For $0\le x\le U$, use $n^4\le e^{n^2}$, $\pi>3$ and $\sum_{n>N}e^{-2n^2}\le2e^{-2(N+1)^2}$. The retained mesh has total weight $2U+h$, giving the third term.

At any bounded height all three errors can be made arbitrarily small. Their signs carry no information about the retained oscillatory sum. A uniform bound with the required sign on that sum is the open arithmetic question. The unrestricted first Laguerre inequality for the Riemann function is discussed in [Csordas, Open Problem 4.7](https://arxiv.org/abs/1309.0055).

## An actual two-zero certificate

The test window was selected using a numerical search for neighboring low zeros with spacing below 1.05. Neither verifier receives their positions or uses a zero table. Two windings of $\zeta$ on full critical-strip rectangles give count two in each of $108<t<114$ and $111<t<112$. Thus the pair has height separation below one and all other zeros have $|\gamma-c|\ge2$. Both derivative estimates were verified on the wider interval $[110.75,112.125]$ containing every possible centroid.

| Quantity | Certified result |
|---|---|
| Direct theta integral for $L(t)$ | $>1.54\cdot10^{-69}$ |
| Independent zeta derivative expression for $L(t)/|H(1/2+it)|^2$ | $>0.378$ |
| $A(t)$ on the exterior line | $<3$ |
| Admissible $K$ and exterior allowance | $K=0$, $M\le9/2$ |
| $(K+M)r^2$ at $r=1/2$ | $\le9/8<2$ |

The theorem thus certifies two distinct critical-line zeros. This uses no sign changes of Hardy's function, individual root ordinates or pair discriminant. These low zeros were previously known. The two shear computations use different representations and share the same mathematical normalization and centroid cover.

**Direct Fourier computation.** Set $h=1/128$, $U=3$, $N=16$ and $T=114$ in (1). For interval evaluation in $t$, the checker first computes the derivatives through order 66 of the *finite mesh sum* at $t_0=111.4375$. For each of the original three mesh sums it uses the Taylor polynomial of degree 64 over $|t-t_0|\le11/16$. The remainder for each exponential on this real segment is at most $3^{65}/65!$. The sum of absolute weights, including the factors $|u|^j$, is checked below 10. Consequently (1) plus the Taylor error is below $10^{-55}$ for each of the three jets. Only jets through order two need the alias estimate. The code evaluates the interval polynomials on 128 subintervals. Directed Decimal arithmetic encloses the exponentials and Taylor arithmetic. Machin's arctangent formula encloses $\pi$ and the reduced trig functions use the repository's outward Taylor routine.

**Arithmetic cross-check and windings.** On $s=1/2+it$, put $d_1=\Re(H'/H)(s)$ and $d_2=\Re(H'/H)'(s)$. Reality of $\Xi$ implies $\Re(\zeta'/\zeta)=-d_1$ away from zeros. Since $L/\Xi^2=\Re(\xi'/\xi)'(s)$ there, clearing factors gives the continuous identity, including at the zeros,
$$
 \frac{L}{|H|^2}=|\zeta'|^2+\Re(\zeta''\overline\zeta)
                       +(d_2-2d_1^2)|\zeta|^2.
$$
For $110.75\le t\le112.125$ we have $|d_1|<1.5$, $|d_2|<1$. For detail, put $w=s/2$. The polar terms in $d_1$ cancel on the critical line. With $55<|w|<57$ the complex digamma remainder gives $|\psi(w)-\log w|\le1/(2|w|)+\sec^3(\arg w/2)/(12|w|^2)<0.01$. Thus $|\Re(\psi(w)-\log\pi)|<3$. With $y=t/2>55$, the trigamma series is bounded by $1/y^2+\pi/(2y)$ by integral comparison. The rational terms of $d_2$ cost at most $2/t^2$. For $A(t)$ the same digamma estimate applies at $w=1+it/2$ and the polar terms cost at most $2/t$. The prime-series modulus costs at most $\sum_{n\ge2}\log(n)/n^2\le\log(2)/4+(1+\log2)/2<1.1$. These give $A(t)<3$. [DLMF digamma error](https://dlmf.nist.gov/5.11#ii) and [polygamma series](https://dlmf.nist.gov/5.15).

The zeta evaluator uses the order-16 Euler–Maclaurin sum with cutoff 64 and its first two derivatives. On complex disks of radius $1/4$ about the contour cells or the critical-line segments, $\Re s\ge-1$ and $|s|<116$. The periodic Bernoulli bound gives a uniform analytic remainder $E_0=4\prod_{j=0}^{15}(116+j)/(6^{16}\,14\,64^{14})$. Cauchy's estimates then give derivative errors $4E_0$ and $32E_0$. For the finite Dirichlet terms the value change from cell midpoint to endpoint costs at most the half-length times $\log n$, since $\Re s\ge0$ on the paths. Each of the 4,096 cells per side is enclosed in a complex rectangle avoiding zero. Consecutive boxes overlap at the exact image of their common endpoint. Choosing a polygon vertex in each overlap gives a closed polygon homotopic to the zeta boundary image by straight-line interpolation within the corresponding boxes. The positive-real-axis crossing count gives its winding, with half-open endpoint convention. The arithmetic jet check uses 4,096 line cells and the coefficient lower bound $d_2-2d_1^2>-5.5$. Binary operations are widened as in the preceding certificate, assuming IEEE binary64 with gradual underflow.

**Reproduction.** From the checkpoint directory run `python3 cluster/certify_centroid_shear.py` with NumPy and `python3 cluster/check_theta_centroid.py` with standard Python at the default 70 decimal digits. [Winding and jet results](centroid-shear.json) and [theta results](theta-centroid.json) record both outputs. A 90-decimal-digit repeat gives the same displayed direct-theta lower bound. A 32-cell boundary test refuses an unresolved contour. The enclosures have been checked locally and remain open to external review.

## Scope of the isolation hypothesis

A reflected-pair model can have an arbitrarily wide collar relative to $b$ and still have centroid curvature $-2/b^2+O(1)$ after division by the squared amplitude. For example use the previous note's positive Fourier-density family $\operatorname{sinc}^2(t/4)(\cosh b+\cos t)$ at $c=\pi$, where $\operatorname{sinc}(u)=\sin(u)/u$. The cosine factor contributes $-1/(\cosh b-1)$ to normalized shear and the squared sinc contributes a bounded term. The next zeros stay a fixed distance from $c$ as $b\to0$. Isolation controls the exterior factor. The actual-theta inequality still has to be proved on a family of centroids beyond finite verification, and higher-multiplicity crowded clusters require a different argument.
