# Reading the final Hermite pivot from the sign of zeta

8 November 2026. For a complete zeta cluster whose penultimate Hermite block is positive definite, the sign of the last pivot can be recovered by comparing the completed zeta function at one point selected from the lower moments with its value at the right edge. In the window $12<t<27$ this proves that all three enclosed zeros are distinct and on the critical line. A second construction needs only the count and the first two power sums for this cubic. The all-height sign estimate remains open.

## One node when the lower block is positive

Write $\Xi(t)=\xi(1/2+it)$ and use the ordinate $z=(s-1/2)/i$. Take a rectangle symmetric about the real $z$-axis, with no zeros on its boundary and exactly $m\ge2$ enclosed zero copies. Use a real coordinate $x=(z-t_0)/d$ with $d>0$, and let $[L,R]$ be its horizontal projection in that coordinate. Write $F(x)=\Xi(t_0+dx)$, $P(x)=\prod_{j=1}^m(x-x_j)$ for the monic cluster polynomial, and $p_j=\sum_k x_k^j$. The quotient $F/P$ extends across the enclosed zeros and has constant nonzero sign on $[L,R]$. Since $P(R)>0$, throughout this interval
$$
\operatorname{sgn} P(x)=\operatorname{sgn}\big(F(x)F(R)\big). \tag{1}
$$
This normalization removes the entire unknown zero-free factor exactly.

Let $H_j=(p_{a+b})_{0\le a,b<j}$. Suppose $H_{m-1}$ is positive definite. Put $\mathcal L(f)=\sum_j f(x_j)$. Construct the monic $q_k$ of degree $k$ orthogonal to all lower degrees for the bilinear form $\mathcal L(fg)$, for $0\le k\le m-1$. The highest moment needed for this construction is $p_{2m-3}$. Write $h_k=\mathcal L(q_k^2)$. All $h_k$ through $m-2$ are positive. The remaining $h_{m-1}=\det H_m/\det H_{m-1}$ is the last Schur pivot. Denote the largest zero of $q_{m-1}$ by $\lambda$.

The endpoint identity is
$$
h_{m-1}=-\frac{h_{m-2}}{q_{m-2}(\lambda)}P(\lambda),
\qquad q_{m-2}(\lambda)>0. \tag{2}
$$
To prove it, expand $xq_{m-1}-P$ in the monic orthogonal basis. Every coefficient below degree $m-2$ vanishes because $\mathcal L(Pf)=0$ and $q_{m-1}$ is orthogonal to degrees through $m-2$. Its $q_{m-2}$ coefficient is $h_{m-1}/h_{m-2}$, since $xq_{m-2}$ has leading term $q_{m-1}$. Evaluation at $\lambda$ gives (2), including when $h_{m-1}=0$. For each lower degree the same orthogonality calculation gives the monic three-term recurrence with preceding coefficient $h_j/h_{j-1}>0$ wherever it is needed to construct $q_{m-1}$. Starting with $q_0=1$, the signs at consecutive roots in this recurrence give simple real, strictly interlacing roots. Thus the monic $q_{m-2}$ is positive at the largest root of $q_{m-1}$. This argument uses positivity only in the stipulated block. [Standard recurrence and separation of zeros, NIST DLMF §18.2](https://dlmf.nist.gov/18.2).

For $m\ge3$, the moments through $p_{2m-3}$ also include $p_m$, so in exact arithmetic Newton's identities already determine $P$. The one-node formula gives a different quantity on which to seek an arithmetic sign bound. For $m=2$ the available lower moments leave the constant term undetermined.

If $\lambda\in[L,R]$, equations (1) and (2) give the exact arithmetic test. Hardy's real $Z$ has the same sign products as $\Xi$ because $\Xi(t)=-a(t)Z(t)$ with $a(t)>0$.

| Product $F(\lambda)F(R)$ | Last pivot | Enclosed cluster |
|---|---|---|
| Negative | Positive | $m$ distinct real ordinates |
| Zero | Zero | $m-1$ distinct real ordinates, one double |
| Positive | Negative | One nonreal conjugate pair and $m-2$ distinct real ordinates |

These conclusions use congruence with $H_{m-1}\oplus[h_{m-1}]$ and the [Hermite inertia formula](PARTIAL_CLUSTER_MASS.md). An interval containing zero cannot certify the equality row. If the node lies outside the rectangle, (1) cannot be applied there. In fact an all-real cluster forces the node inside. For distinct real roots the recurrence for $P$ has positive last coefficient and interlaces. In the singular all-real case $q_{m-1}$ is the monic polynomial on the $m-1$ distinct support points, by orthogonality and uniqueness.

## At most two interior signs using moments only through degree m−1

Newton's identities determine all coefficients of $P$ except its constant from $p_1,\dots,p_{m-1}$. Thus $Q(x)=P(x)-P(0)$ and $P'=Q'$ are known. For all roots of $P$ to be real, the $m-1$ roots $c_1\le\cdots\le c_{m-1}$ of $P'$ must be real and in $[L,R]$. These requirements must be certified. Given them, the remaining necessary and sufficient conditions are
$$
(-1)^{m-j}P(c_j)\ge0\quad (1\le j<m). \tag{3}
$$
Necessity follows by Rolle's theorem with multiplicities. For sufficiency, adjoining the two infinite endpoints gives $m$ successive closed gaps, each of which must contain a zero by the endpoint signs and the monic leading term. A shared endpoint appearing $k$ times among the critical nodes can be counted in at most $k+1$ such gaps. If it is a zero, its multiplicity is exactly $k+1$ because it has multiplicity $k$ in $P'$. This accounts for $m$ real zeros with multiplicity, including collapsed gaps. Strict inequalities give $m$ distinct real zeros.

Only two tests from (3) can be binding. Among nodes requiring $P\ge0$, choose the smallest $Q(c_j)$. Among nodes requiring $P\le0$, choose the largest $Q(c_j)$. Drop an empty group. Every other inequality follows, since $P-Q$ is the same constant at every node. Test the chosen signs by (1). The ordering comparisons concern $Q$, which was determined from the lower moments. If an interval comparison cannot resolve which value is extremal, all tied or unresolved candidates need checking. This variant also covers singular lower Hermite blocks, provided the derivative-root hypotheses and any required equalities are proved.

## Three zeros of the actual zeta function

On $0\le\Re s\le1$, $12\le\Im s\le27$, use $x=((s-1/2)/i-20)/8$. The argument-principle integral of $x^j\zeta'/\zeta$ divided by $2\pi i$ encloses $p_j$. The completion is nonvanishing and regular relative to zeta on this rectangle. The zero-free boundary is checked on every cell. Here and below displayed decimal intervals are rounded outward.

| Quantity | Certified interval |
|---|---|
| Count integral $p_0$ | $[2.8814,3.1203]$ |
| $p_1$ | $[-0.0474,0.0888]$ |
| $p_2$ | $[0.8979,0.9951]$ |
| $p_3$ | $[-0.1837,-0.1092]$ |
| $h_1=p_2-p_1^2/3$ | $[0.8953,0.9951]$ |

The unique possible integer count is three and $H_2$ is positive definite. In scaled coordinates put $\mu=p_1/3$ and $S=(p_3-\mu p_2)/h_1$. Orthogonality of $q_2$ gives the coefficient $-S$ of $x$. The two-by-two Jacobi recurrence gives its larger root as
$$
\lambda=S/2+\sqrt{(\mu-S/2)^2+h_1/3}.
$$
The two derivative nodes for (3) are $(p_1\pm\sqrt{(3p_2-p_1^2)/2})/3$. The following node intervals are in physical height $t=20+8x$. The Hardy signs are certified over the entire displayed intervals.

| Evaluation | Height interval | $\Re\zeta(1/2+it)$ | $\theta(t)/\pi$ | Sign of $Z$ |
|---|---|---|---|---|
| Largest root of $q_2$ | $[23.421875,24.390625]$ | $[0.508,1.413]$ | $[1.043,1.267]$ | $-$ |
| Right edge | $[27,27]$ | $[2.25425,2.25427]$ | $[1.834,1.852]$ | $+$ |
| Cubic local maximum | $[16.609375,17.15625]$ | $[1.563,2.085]$ | $[-0.213,-0.101]$ | $+$ |
| Cubic local minimum | $[22.953125,23.5]$ | $[1.344,1.474]$ | $[0.946,1.078]$ | $-$ |

The first two signs fix the last pivot without computing $p_4$ or subtracting two nearly equal determinants. The maximum, minimum and right edge also certify the same three distinct critical-line zeros by (3), without using $p_3$. Both calculations share the count and the zeta evaluation routine. These zeros were already known. The certificate tests the proposed method.

For $16.5\le u\le22.5$ the entire central band of radius $4.5$ lies in the certified height interval up to its zero-free edges. Credit the exact weighted sum of the three zeros there. The [moving-window tail bound (4)](../energy/MOVING_WINDOW.md) leaves a deficit at most $300e^{-4.5\pi/2}(\log 33+1)<1.149$, below $2\operatorname{sech}(\pi/8)$. At $u=19.5$ the radius reaches $7.5$, giving a deficit below $0.0104$.

## Reproducing the enclosures

Run `python3 cluster/certify_pivot_sign.py` in the checkpoint directory with NumPy installed. The [full output](three-zero-pivot.json) records 65,536 cells per contour side. A 1,024-cell run raises an unresolved-count error. The prior two-zero checker retains its parameters and reproduces its prior recorded intervals.

The optional command `python3 cluster/check_pivot_identities.py` (SymPy) checks (2) by exact polynomial division for degrees 2 through 8, with a real split, an exact double root, and an imaginary split at each degree. It also checks the two extremal inequalities against rational real-root isolation in 39 cases, including repeated critical nodes.

The common [Euler–Maclaurin interval code](certify_pair_moments.py) uses $|s|<28$, $|s+j|\ge12$ on this new rectangle. The previous [remainder calculation](PARTIAL_CLUSTER_MASS.md) therefore applies with $\prod_{j=0}^{15}(28+j)$ in place of $\prod_{j=0}^{15}(24+j)$. The Taylor argument for $n^{-s}$ has modulus below $28\log(16)/128<1$. The derivative remainder is less than five times the value majorant. Signs on the line use the same value enclosures on dyadic cells of length at most $1/1024$, after rounding the node brackets outward. The implementation assumes ordinary IEEE binary64 with gradual underflow and correctly rounded Decimal logarithms and square roots.

Write $y=t/2$ and $w=1/4+iy$. With $\theta(t)=\Im\log\Gamma(w)-y\log\pi$ and $Z=e^{i\theta}\zeta$, one has $\Re\zeta=Z\cos\theta$. Complex Stirling with the first correction omitted bounds the remainder by $\sec^2(\arg(w)/2)/(12|w|)\le1/(6y)$. Expanding $\log|w|$ and $\arg w$ in the leading term gives two further errors bounded by $1/(32y)$ and $1/(16y)$, using $\log(1+u)\le u$ and $\arctan u\le u$ for $u\ge0$. Thus
$$
\left|\theta(t)-y(\log(y/\pi)-1)+\pi/8\right|\le 25/(96y).
$$
Every phase interval stays within a single cosine sign band. The product of this cosine sign and the certified real-zeta sign yields the Hardy sign. [Complex Stirling remainder, NIST DLMF §5.11(ii)](https://dlmf.nist.gov/5.11#ii).

## An all-height error bound for the arithmetic sign test

The arithmetic approximation at the selected node can be made explicitly uniform in height. For $s=1/2+it$, integer $r\ge1$, and integer $N\ge1$, set
$$
D_{N,r}(s)=\sum_{n<N,\,n\ge1} n^{-s}
+\frac{N^{1-s}}{s-1}+\tfrac12 N^{-s}
+\sum_{k=1}^r\frac{B_{2k}}{(2k)!}(s)_{2k-1}N^{1-s-2k},
\qquad
Z_{N,r}(t)=\Re(e^{i\theta(t)}D_{N,r}(s)),
$$
where $(s)_j$ is the rising factorial. The periodic Bernoulli remainder in Euler–Maclaurin has absolute value at most
$$
\frac{2\zeta(2r)}{(2\pi)^{2r}} |(s)_{2r}|
\int_N^\infty x^{-1/2-2r}\,dx
\le \frac{4\sqrt N}{2r-1/2}\left(\frac{|t|+2r}{2\pi N}\right)^{2r}.
$$
The first factor follows from the absolutely convergent Fourier series of the even periodic Bernoulli polynomial. Multiplying by the unit complex number $e^{i\theta}$ preserves this error bound. For any $T\ge0$, choose $N=\lceil T\rceil+2r$. Uniformly on $|t|\le T$ this gives
$$
|Z(t)-Z_{N,r}(t)|\le E_{T,r}=8\sqrt{T+1}\,36^{-r}. \tag{4}
$$
Indeed $N\le(T+1)(2r+1)$, $\sqrt{2r+1}/(2r-1/2)\le2$, and $2\pi>6$. This is a truncation bound with the exact gamma phase. A numerical implementation must also enclose the phase, the finite sum, and any uncertainty in the node. [Euler–Maclaurin for zeta, NIST DLMF §25.11(iii)](https://dlmf.nist.gov/25.11#iii). [Periodic Bernoulli Fourier series, NIST DLMF §24.8(i)](https://dlmf.nist.gov/24.8#i).

Let $e_R=\operatorname{sgn}Z(t_R)$ be the certified edge sign. For any eligible cluster the one-sided finite-sum inequality
$$
e_R Z_{N,r}(t_*)+E_{T,r}\le0 \tag{5}
$$
proves a nonnegative last pivot. There is also a formulation that permits exact multiple roots without requiring a finite strict margin. At fixed $T$ it suffices to prove $e_R Z_{N,r}(t_*)\le E_{T,r}$ along an unbounded sequence of $r$, since (4) then gives $e_R Z(t_*)\le0$ in the limit. Conversely that weak sign implies this latter inequality for every $r$. The error in (4) can therefore be paid at any height by increasing $r$. The unsolved estimate is the sign of the *finite arithmetic main term at the moment-selected node*. No ordinary bound on its absolute value enforces the required direction.

## The remaining arithmetic inequality

In physical height $t_*=t_0+d\lambda$, $t_R=t_0+dR$, the one-node condition is $\Xi(t_*)\Xi(t_R)\le0$. With the complete theta density $\Phi$ and $\Xi(t)=2\int_0^\infty\Phi(v)\cos(tv)\,dv$, this is a signed comparison of two explicitly specified cosine transforms. The grid criterion still requires enough certified cluster mass at every center, including close or multiple zeros. It would suffice to construct a covering by eligible clusters and prove the corresponding weak signs, allowing multiplicities. This local Hermite pivot is for the zero-cluster moment matrix. A transfer to the modular bridge operator's Schur complement requires a further identity or estimate. [Lagarias and Montague, eqs. (1.1)–(1.2)](https://rikkyo.repo.nii.ac.jp/record/8642/files/AA00610867_60-01%2C02_14.pdf).

Evenness, positivity of a Fourier density, and entire order one still permit either pivot sign. For $0<b<1/2$ let
$$
G_a(t)=\left(\frac{\sin(t/4)}{t/4}\right)^2(a+\cos t),\qquad
a\in\{\cos b,1,\cosh b\}.
$$
The squared sinc is the transform of the convolution of two uniform probability densities on $[-1/4,1/4]$. Multiplication by $a+\cos t$ makes a nonnegative even density by adding its two unit translates with weight $1/2$ to $a$ times the original. In the rectangle $|\Re t-\pi|<1/2$, $|\Im t|<1/2$ there are two zero copies. They are $\pi\pm b$, the double zero $\pi$, or $\pi\pm ib$, respectively. All three choices have the same count, centroid, and node $\lambda=\pi$ in the unscaled height coordinate. The right-edge value at $\pi+1/2$ is positive in all three. The node value is proportional to $a-1$, taking opposite signs of size $O(b^2)$ on either side of the double root. Thus a proof using the actual theta density must control its oscillatory integral closely enough to preserve the sign through near-collisions. An estimate of the absolute mass of a positive kernel alone supplies no such sign.
