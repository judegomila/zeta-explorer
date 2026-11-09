# Signed zeta shear on windows fixed in advance

9 November 2026. The grid in this note is specified by height alone. On every sufficiently large dyadic height interval, classical moments of Hardy's function imply a quantitative lower bound for the shear on many **whole grid cells**. A separate endpoint test can force a critical-line zero on a given cell. In a finite computation on a different grid, direct theta bounds and endpoint values classify three two-zero windows. Establishing the corresponding joint estimate for unclassified pairs at arbitrary height is open.

## A bound throughout many cells

Write $f(t)=\Xi(t)=\xi(1/2+it)=-a(t)Z(t)$, where $Z$ is Hardy's real function, $a=|\tfrac12 s(s-1)\pi^{-s/2}\Gamma(s/2)|$ on the critical line, and $g=\log a$. The signed quantity from the [bridge calculation](CENTROID_SHEAR.md) is $L=f'^2-ff''$. Divide by the strictly positive completion weight to obtain

$$
 S=\frac{L}{a^2}=Z'^2-ZZ''-g''Z^2 .
$$

This identity holds through zeros. The differentiated sectorial Stirling expansion gives $g=C-\pi t/4+(7/4)\log t+O(t^{-2})$, $g''=-7/(4t^2)+O(t^{-4})$, and $g'''=O(t^{-3})$. The logarithmic power is the sum of $2$ from $s(s-1)$ and $-1/4$ from the gamma factor. [Stirling expansion and remainders](https://dlmf.nist.gov/5.11).

**Proposition.** Let $\lambda=\log T$ and partition $[T,2T]$ into $m=\lceil 2T\lambda\rceil$ equal closed cells with disjoint interiors. For all sufficiently large $T$, at least $cT/\lambda$ cells, for some absolute $c>0$, satisfy

$$
 S(t)\ \ge\ \frac{\lambda^2}{16}Z(t)^2+\frac{\lambda^3}{32}
 \qquad \text{at every }t\text{ in the cell}.
$$

The union has length $\gg T/\lambda^2$. This count allows a fraction of order $1/\lambda^2$ of the grid to qualify. The grid does not use the positions or types of zeros.

**Proof.** The needed unconditional inputs, written for $[T,2T]$ by difference of cumulative asymptotics, are

$$
 \int_T^{2T}(Z^{(j)})^2=(c_j+o(1))T\lambda^{2j+1},
 \qquad c_j=\frac{1}{4^j(2j+1)}\quad (0\le j\le3),
 \qquad
 \int_T^{2T}(Z^{(j)})^4\ll T\lambda^{4j+4}\quad(0\le j\le2).
$$

For second moments see [Hall, Theorem 3](https://doi.org/10.1112/S0025579300007762) and [Minamide and Tanigawa](https://www.sciencedirect.com/science/article/pii/S0022247X19310406). The fourth-moment bound is the equal-index case of [Bui and Hall, Theorem 3](https://doi.org/10.1112/blms.12859).

Put $F=S-\lambda^2 Z^2/16$, keeping $\lambda$ fixed across the interval. Integration by parts yields

$$
 \int_T^{2T}F=(1/6-1/16+o(1))T\lambda^3.
$$

Indeed the two derivative terms integrate to $2\int Z'^2-[ZZ']_T^{2T}$. Each endpoint value is $O(\sqrt T\,\lambda^4)$: apply $|G(u)|\le\int_u^{u+1}(|G|+|G'|)$ to $G=ZZ'$ and use Hölder on the unit interval with the cumulative fourth-moment bounds up to $2T+1$. The $g''Z^2$ integral costs $O(\lambda/T)$.

Differentiate to get $F'=Z'Z''-ZZ'''-2(g''+\lambda^2/16)ZZ'-g'''Z^2$. Cauchy–Schwarz applied to each product gives

$$
 \int_T^{2T}|F'|\le(D+o(1))T\lambda^4,\qquad
 D=\sqrt{c_1c_2}+\sqrt{c_0c_3}+\tfrac18\sqrt{c_0c_1}
   =\frac1{\sqrt{960}}+\frac1{\sqrt{448}}+\frac1{8\sqrt{12}}.
$$

For a cell $I$ of width $h=T/m$ we have $\int_I F\le h\min_I F+h\int_I|F'|$. Sum over the grid and use $h\le1/(2\lambda)$. The coefficient in the resulting lower bound for $h\sum_I\min_I F$ is at least $1/6-1/16-D/2+o(1)=0.046364\ldots+o(1)$, strictly above $1/32$. Let $E$ be the union of the cells with $\min_I F\ge\lambda^3/32$. The other cells contribute at most $T\lambda^3/32$ to the lower sum, so $\int_E|F|\gg T\lambda^3$. The fourth moments and Cauchy–Schwarz give $\int F^2\ll T\lambda^8$, including the term $\lambda^4\int Z^4$. Thus $|E|\gg T/\lambda^2$, and division by $h$ proves the claim.

## Detecting a zero from endpoint data

Suppose $I=[u,v]$ has $f(u)f(v)\ne0$ and put $d=f'/f$ at its endpoints. If $f$ is zero-free on $I$, then

$$
 d(u)-d(v)=\int_I \frac{L(t)}{f(t)^2}\,dt .
$$

A lower bound for the integral **under the zero-free hypothesis** that strictly exceeds an upper bound for the endpoint drop therefore proves there is a real zero inside. On any cell in the proposition, a sufficient test is

$$
 d(u)-d(v)<
 \frac{\lambda^2}{16}|I|+
 \frac{\lambda^3}{32}\frac{|I|^2}{\int_I Z^2}.
$$

This follows from $f^2=a^2Z^2$ and $(\int_I Z^2)(\int_I Z^{-2})\ge|I|^2$ under that hypothesis. For computation, use subcells $J$ with $0<\ell_J\le L$ and $|f|\le M_J$. Then $B=\sum_J |J|\ell_J/M_J^2$ gives an alternative conditional lower bound. This calculation only divides by strictly positive upper bounds $M_J$. The real-zero-free hypothesis is used solely for the contradiction. The integral of $L/f^2$ can diverge on a cell where the test succeeds.

If the full-strip rectangle over $I$ has exactly two zero copies counted with multiplicity and the endpoint test succeeds, conjugation of the zeros of $f$ forces both copies to have real ordinates. If $L>0$ on $I$, these two zeros are also distinct since a multiple real zero has $f=f'=0$. Here a real ordinate of $f$ means a zeta zero on $\Re s=1/2$. The test uses neither a centroid nor an exterior zero sum.

## Why the endpoint test matters

Fix $0<b<1/2$. For positive integers $n$ consider the even real entire function

$$
 f_n(t)=\operatorname{sinc}^2(t/4)\cos^{2n}(t)(\cosh b+\cos t),
 \qquad \operatorname{sinc}(z)=\sin(z)/z .
$$

It has a nonnegative Fourier density: squared sinc transforms a triangular density, and the other two factors transform finite nonnegative even measures. Products correspond to convolution. The full rectangle above $[\pi-1/2,\pi+1/2]$ with $|\Im t|<1/2$ contains exactly $\pi\pm ib$, and the real segment is zero-free. There the normalized shear $-(\log|f_n|)''$ is at least $2n-1/(\cosh b-1)$. In detail, the squared sinc contributes $2(\csc^2(t/4)/16-1/t^2)\ge0$, the cosine power contributes $2n\sec^2 t$, and the last factor contributes a square plus $\cos t/(\cosh b+\cos t)$. Thus the normalized shear can be arbitrarily large on the entire segment while the reflected pair persists. For actual zeta, the endpoint drop supplies arithmetic data omitted by a pure shear threshold.

## A fixed eight-window check

Use every consecutive width-four window from 32 to 64. Their endpoints were specified by this rule, independently of any zero table. These finite windows are wider than the grid in the asymptotic proposition. The checker computes the local bound $B$ directly from the complete theta source and obtains an independent winding count on each rectangle $[0,1]+i[u,v]$ using zeta.

| Height window | Strip count | Lower bound for $B$ | Upper bound for endpoint drop | Strict test |
|---|---:|---:|---:|---|
| [32, 36] | 1 | 96.41 | -0.09 | passes |
| [36, 40] | 1 | 108.28 | 0.54 | passes |
| [40, 44] | 2 | 169.09 | -2.43 | passes |
| [44, 48] | 0 | 4.63 | 196.16 | inconclusive |
| [48, 52] | 2 | 166.75 | -194.01 | passes |
| [52, 56] | 1 | 97.17 | 1.64 | passes |
| [56, 60] | 2 | 117.44 | -2.67 | passes |
| [60, 64] | 1 | 105.62 | 1.28 | passes |

The columns for $B$ and for the drop round outward. Each of the seven strict comparisons forces a line zero. In the three two-copy rectangles it forces two distinct line zeros. In the four single-copy rectangles the contour count and symmetry already suffice. In the empty rectangle the comparison correctly stays inconclusive. These are previously known low zeros, used to test the inference rule.

**Reproduction.** Run `python3 cluster/check_fixed_windows.py` from the checkpoint directory with NumPy and compare the output with [the full enclosures](fixed-window-shear.json). For each window we compute the first 99 derivatives (orders 0–98) of the finite theta mesh at its midpoint. They yield three degree-96 Taylor polynomials on $|\Delta t|\le2$. For each of the three jets, the sum of absolute weights is bounded by 10, the mesh has $|u|\le3$, and Taylor's real-segment remainder is at most $10\cdot6^{97}/97!<3.15\cdot10^{-76}$. The Poisson, spatial, and theta-series tails are bounded by (1) in the [centroid note](CENTROID_SHEAR.md), with $h=1/128$, $U=3$, $N=16$ and $T=64$. All four errors together are below the $10^{-55}$ widening on each jet. Order-98 derivatives are used only for the finite Taylor sum. Only the three original jets require the Poisson bound.

Each window starts with 128 theta subcells, bisecting a subcell when its interval proof of positive $L$ is unresolved. The contour check doubles its dyadic mesh if needed. In both refinements the original endpoints are fixed. The winding evaluator's analytic remainder on quarter-radius disks continues to apply since $\Re s\ge-1$ and $|s|<116$ there. The code uses outward Decimal arithmetic for theta and the earlier binary64 enclosures for the contour, assuming IEEE arithmetic with gradual underflow.

## The remaining estimate

The [joint-window continuation](JOINT_PAIR_WINDOWS.md) proves simultaneous pair occupancy, positive shear and endpoint reversal on a prescribed family of lattice intervals using two recent gap and zero-proportion estimates. Its shear bound is proportional to the squared completed amplitude. The additive Hardy-normalized bound above remains unproved on those same intervals.

The proposition controls the signed theta shear on an unbounded collection of prescribed cells. It does not identify their zero counts. To classify pairs at unbounded heights by this route, prove simultaneous occurrence of a strip count of two and a strict endpoint deficit on cells with the shear bound, or prove the same joint condition for unions of such cells with controlled intervening shear. The endpoint test can also use directly integrated subcell bounds. A positive frequency of successful pairs would still leave the complementary windows and larger clusters to handle for RH.
