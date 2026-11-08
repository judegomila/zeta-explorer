# An all-height bound for backward shear

7 November 2026. Let $F(z)=\xi(1/2+z)$, $z=x+it$, $S=\{0<x<1/2\}$, and $Q=(-\Re(F'\overline F))_+$. For a real center $u$ and amplitude $r>0$ put
$$
G_r(u)=\frac1{r^4}\int_{S\cap\{|F|\le r\}}
\frac{Q^2}{1+(t-u)^2}\,dx\,dt.
$$
The height integral covers the whole real axis. The weight is a choice for this calculation. It is positive at every height and equals one at the chosen center.

We obtain a global limit, a finite-scale bound at center zero, and an arithmetic upper bound at every center. The estimate sufficient to exclude an individual off-line zero at arbitrary height remains open.

## Global limit and the exclusion threshold

Write $\rho=\beta+i\gamma$ for a distinct nontrivial zero of zeta, with multiplicity $m_\rho$. Then for each fixed real $u$,
$$
G(u):=\lim_{r\downarrow0}G_r(u)=\frac\pi8
\sum_{\beta>1/2}\frac{m_\rho}{1+(\gamma-u)^2}. \tag{1}
$$
The limit applies to the integral over the entire strip. The uniform tail estimate below justifies passing from compact windows to (1).

In particular $G(0)=0$ is equivalent to RH by reflection and positivity of all the weights. A fixed positive upper bound on $G(0)$ can accommodate a zero at sufficiently large height. Another sufficient condition is $G(u)<\pi/8$ for every real $u$. At $u=\gamma$ the summand for one right-hand zero is at least $\pi/8$. This argument takes the small-amplitude limit separately at each center and requires no interchange with a supremum over centers.

## Uniform control of the discarded heights

Set $n_w(R)$ equal to the number of solutions of $F(z)=w$ in $|z|\le R$, with multiplicity. For $|w|\le1/64$ and integer $h\ge100$,
$$
n_w(3h)\le \frac{4h\log(8h)}{\log 2}. \tag{2}
$$
Here are details of the constants. The alternating eta series at $1/2$ gives $|\zeta(1/2)|\ge(1-1/\sqrt2)/(\sqrt2-1)=1/\sqrt2$. The integral for $\Gamma(1/4)$ on $(0,1)$ gives $\Gamma(1/4)\ge4/e>1$. The completion therefore gives $F(0)>1/32$. On $|z|\le6h$ the positive theta representation $F(z)=\int_0^\infty\psi(v)\cosh(zv)\,dv$ gives $|F(z)|\le F(6h)$. At $s=6h+1/2$, $\zeta(s)<2$. Splitting the gamma integral at one gives $\Gamma(s/2)\le 1+\Gamma(3h+1)\le 2(4h)^{3h}$. Thus $F(6h)\le2(7h)^2(4h)^{3h}$. Since $192(7h)^2\le(8h)^3$ for $h\ge100$, we have $64(F(6h)+1)\le(8h)^{4h}$. Jensen's formula at radii $3h,6h$ now gives (2), using $|F(0)-w|>1/64$. Boundary zeros on the larger circle can be handled by a limiting radius.

For the strip portion $D_h$ with $h\le |t|<2h$, which lies in $|z|<3h$, the holomorphic area formula and $Q^2\le |F'|^2|F|^2$ give
$$
\frac1{r^4}\int_{D_h\cap\{|F|\le r\}} Q^2\,dA
\le \frac1{r^4}\int_{|w|\le r}|w|^2 n_w(3h)\,dA(w)
\le \frac\pi2\frac{4h\log(8h)}{\log2},
\qquad 0<r\le1/64.
$$
The Jacobian of a holomorphic map is $|F'|^2$. Counting inverse branches away from critical values proves the area formula used here. Both signs of height are included in the single disk count.

At center zero the weight on this band is at most $h^{-2}$. Summing over $h=2^kH$, $k\ge0$, proves
$$
\sup_{0<r\le1/64}
\frac1{r^4}\int_{S\cap\{|F|\le r,\ |t|\ge H\}}
\frac{Q^2}{1+t^2}\,dA
\le \frac{4\pi\log(16H)}{H\log2} \qquad (H\ge100\text{ an integer}). \tag{3}
$$
For a fixed $u$ and $H\ge2|u|$ the same proof gives four times this bound. On bounded windows the [local small-value law](SMALL_VALUE_ENERGY.md) applies with the smooth weight. The right edge is zero-free, critical-line zeros contribute zero to the limit from the right, and horizontal edges may be chosen away from zero ordinates. Exhaust the strip along such edges and use (3) on the tails (round the tail cutoff down to an integer). The positive weighted zero series converges by (2) at $w=0$ and the same dyadic summation. This proves (1).

## A bound at every amplitude up to 1/64

Platt and Trudgian verified all zeros through $T=3\cdot10^{12}$ on the line. At real $0<s<1$ the alternating eta series is positive and $1-2^{1-s}<0$, so zeta has no real zero there. In the paired real-part logarithmic derivative each reflected pair at horizontal offsets $\pm b$ has the sign of $x^2+(t-\gamma)^2-b^2$ for $x>0$. Line zeros have positive contributions and all $|b|<1/2$. Consequently $Q=0$ throughout $|t|\le H=T-1$. The whole numerator then satisfies
$$
0\le r^4G_r(0)< 2\cdot10^{-10}\,r^4,\qquad 0<r\le1/64. \tag{4}
$$
The bound follows directly from (3). For the rounded constant, $\pi<22/7$, $\log2>0.69$ (the first two positive terms of $2\operatorname{arctanh}(1/3)$ suffice), and $\log(16H)<32$ since $(27/10)^{32}>16H$ and $e>27/10$. The exact expression in (3) is approximately $1.904\cdot10^{-10}$. One simple zero just above the verified height would contribute approximately $4.36\cdot10^{-26}$ at this center. Equation (4) gives big-O control at all heights. The desired little-o would require $G(0)=0$.

[Platt and Trudgian, Bulletin of the London Mathematical Society](https://doi.org/10.1112/blms.12460). [Paired zero sum and finite-height sign](../README.md).

## Testing the bound at the height of a possible zero

Let $\mathcal L$ be any certified submultiset of critical-line zeros and write
$$
R_{\mathcal L}(u)=\Re\frac{\xi'}{\xi}(2+iu)
-\sum_{\gamma\in\mathcal L}\frac{3/2}{(3/2)^2+(u-\gamma)^2}.
$$
The absolutely convergent real-part zero sum at $2+iu$ contains only positive terms. A right-hand zero $\beta+i\gamma$ is accompanied by $1-\beta+i\gamma$ with the same multiplicity. Put $d=2-\beta$, $d'=1+\beta$ and $v=u-\gamma$. Since $d,d'\ge1$ and $d+d'=3$,
$$
(1+v^2)\left(\frac d{d^2+v^2}+\frac{d'}{d'^2+v^2}\right)
\ge\frac1d+\frac1{d'}\ge\frac43.
$$
Each line zero is counted once and each reflected pair once. After subtracting the certified line contribution this proves the all-center upper bound
$$
0\le G(u)\le\frac{3\pi}{32}R_{\mathcal L}(u). \tag{5}
$$
The first term of $R$ is accessible from arithmetic throughout this line. With $s=2+iu$ and $\psi_0=\Gamma'/\Gamma$,
$$
\Re\frac{\xi'}{\xi}(s)=
\Re\left(\frac1s+\frac1{s-1}+\frac12\psi_0(s/2)-\frac12\log\pi\right)
-\sum_{n\ge2}\frac{\Lambda(n)}{n^2}\cos(u\log n).
$$
The prime series converges absolutely and is bounded uniformly in $u$. The digamma asymptotic gives $\Re(\xi'/\xi)(2+iu)=\tfrac12\log(|u|/(2\pi))+O(1)$ as $|u|\to\infty$. Every fixed finite subtraction in $R$ tends to zero there. This proves that a fixed finite zero list cannot yield the sufficient condition $R_{\mathcal L}(u)<4/3$ for every center.

There is a version using intervals. Given disjoint intervals $[a_j,b_j]$ each certified to contain a line zero, subtract the lower bound
$$
\sum_j\frac{3/2}{9/4+\max(|u-a_j|,|u-b_j|)^2}.
$$
Hardy Z sign changes with nonzero endpoints are one way to certify such intervals. The intervals may depend on the center. If this subtraction leaves a residual strictly below $4/3$ at every $u$, equation (5) excludes every right-hand zero. An arithmetic theorem giving this much critical-line mass in *every* moving window is missing. Finite-height verification can anchor the low windows. Positive proportions or density-one window estimates can leave exceptional windows. The updated complete modular bridge manuscript establishes the nine-channel block $H_8$ and directional repair identities, and identifies the arbitrary-degree spectral-mass and residual inequalities as open. It supplies no such moving-window lower bound.

[Complete modular bridge manuscript, revision 8, abstract](https://chatgpt.com/library?file_id=libfile_fde3_f-d5bc14afd8dc819185c40fe70653829e_652e2da823588191aa000eb39d9cddbb&account_id=personal). [NIST DLMF, digamma asymptotic](https://dlmf.nist.gov/5.11#E2).
