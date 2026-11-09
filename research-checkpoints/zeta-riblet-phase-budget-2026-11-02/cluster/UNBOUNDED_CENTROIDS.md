# Positive shear at unbounded pair centroids

9 November 2026. We retain the size of the measured shear in the [centroid exclusion test](CENTROID_SHEAR.md). Two packing inequalities bound the total adverse contribution of one off-line zero across disjoint gaps. They give an unbounded family of actual pair centroids with positive shear from Conrey's published two-fifths theorem. A stronger full-strip result uses a recent preprint as an additional input. Both are density deductions, with the location of some line zeros already supplied by those inputs.

## A pointwise test that spends positive shear

In ordinate coordinates $z_\rho=\gamma+i(1/2-\beta)$ put
$$
 C(c)=\frac{\Xi'(c)^2-\Xi(c)\Xi''(c)}{\Xi(c)^2}
      =\sum_\rho\Re(c-z_\rho)^{-2},\qquad
 B(c)=\sum_{\rho\ {\rm exterior}} |c-z_\rho|^{-2}.
$$
Use multiplicities throughout. The Hadamard series for the second logarithmic derivative is absolutely convergent away from zeros. Take an isolated conjugation-symmetric two-copy cluster with centroid $c$, and with $b\le r$ for any hypothetical off-line pair $c\pm ib$. If $\Xi(c)=0$ the cluster is double real provided the point $c$ is inside its isolating region (as it is for the rectangles used here). Otherwise, an off-line pair would force $C(c)\le B(c)-2/b^2$. Hence
$$
 C(c)>B(c)-2/r^2 \quad\Longrightarrow\quad\text{both copies lie on the line}. \tag{1}
$$
Any proved upper bound for $B$ can be used. As a decision procedure $C$ uses the complete theta integral or completed zeta derivatives. $B$ can in principle be enclosed to arbitrary accuracy for a fixed isolated cluster: enclose the other zeros in bounded boxes by contour counts, refining box diameters, and bound the distant tail by summing the unit-interval zero-count bound against inverse squared distance. For fixed $c$ this tail tends to zero. Splitting coincident roots is unnecessary. The crude exterior bound in the previous note can be much larger than $B$.

This change matters for a full-strip radius $r=1/2$. Write $A(c)=\Re(\xi'/\xi)(2+ic)=\tfrac12\log(2+|c|)+O(1)$. If $a=2-\beta$ and $v=c-\gamma$, then $1/(v^2+(1/2-\beta)^2)\ge \frac12 a/(a^2+v^2)$. Each omitted interior copy contributes at most one to $A$. Thus $B(c)\ge(A(c)-2)/2\to\infty$. The older sufficient inequality $(K+B)r^2<2$ with $K\ge0$ eventually fails even with the exact absolute exterior sum and positive shear. Formula (1) retains the measured surplus beyond zero.

## Two estimates for disjoint real gaps

Let $[c_i-d_i,c_i+d_i]$ be closed intervals with disjoint interiors, $d_i>0$. For a fixed off-line zero at $\gamma+ib$ use $b>0$ for the magnitude of the transverse displacement. Assume $\gamma$ is outside the open intervals being charged. This allows endpoint coincidences. Put $v_i=|c_i-\gamma|$, so $d_i\le v_i$. The adverse part of a zero's signed curvature is $(b^2-v_i^2)_+/(b^2+v_i^2)^2$. Its absolute curvature majorant minus its signed curvature is $2b^2/(b^2+v_i^2)^2$. Per zero copy,
$$
 \sum_i d_i^2\frac{(b^2-v_i^2)_+}{(b^2+v_i^2)^2}\le\frac14,\qquad
 \sum_i d_i^2\frac{2b^2}{(b^2+v_i^2)^2}\le\frac{\pi}{\sqrt3}. \tag{2}
$$
These constants are independent of the number of intervals, their lengths, $\gamma$, and $b$. A line zero has zero cost for each estimate wherever it is exterior.

**First estimate.** Translate by $\gamma$, divide lengths by $b$, and handle each half-axis separately. For a midpoint $x=v_i/b$ and half-width $u=d_i/b\le x$, the charge is zero for $x\ge1$. For $0<x<1$ put $f=(1-x^2)/(1+x^2)^2$. We claim $8u^2 f\le |[x-u,x+u]\cap[0,1]|$. When $x+u\le1$, this follows from $4xf\le1$, since $(1+x^2)^2-4x(1-x^2)=(x^2+2x-1)^2$. When $x+u\ge1$, the difference $8u^2 f-(1-x+u)$ is convex in $u$ on $[1-x,x]$. The first endpoint follows from the preceding case. At the second use $8x^2 f\le1$, since $(1+x^2)^2-8x^2(1-x^2)=(1-3x^2)^2$. Disjoint intervals cost at most $1/8$ per side. The constant is sharp for the two adjacent intervals of half-width $b/\sqrt3$ meeting at $\gamma$.

**Second estimate.** On the same half-axis put $\Omega=\int_{x-u}^{x+u}(1+y^2)^{-1}\,dy=\arctan(x+u)-\arctan(x-u)$. Its sine is $2u/\sqrt{(1+(x-u)^2)(1+(x+u)^2)}$. The product under the square root is convex as a function of $u^2$ on $[0,x^2]$. Its maximum is at most $\max\{(1+x^2)^2,1+4x^2\}\le\tfrac43(1+x^2)^2$, by $(2x^2-1)^2\ge0$. Since $u/(1+x^2)\le1/2$, we get
$$
 \frac{2u^2}{(1+x^2)^2}\le\frac{\sin\Omega}{\sqrt3}\le\frac{\Omega}{\sqrt3}.
$$
The disjoint angular integrals sum to at most $\pi/2$ per side. This proves (2) also for countably many intervals by monotone limits.

## An unbounded family using the published simple-zero theorem

Write $N=N(T)$ for the number of zero copies at heights $(0,T]$, $S$ for the number simple and on the line, and $\Delta_T=2\pi/\log T$. Use $N\sim T/\Delta_T$ and $S\ge(2/5-o(1))N$. [Conrey, Theorem 1 (1989)](https://aimath.org/~kaur/publications/24.pdf).

Sort the $S$ simple line ordinates and form their $S-1$ successive gaps. Discard gaps with another projected ordinate strictly inside. Every such gap costs at least two of the remaining $N-S$ copies: an off-line zero has a reflected partner, and another line zero would have to be multiple. There remain at least $S-1-(N-S)/2$ gaps. Each encloses an **isolatable pair** of simple real roots: a sufficiently narrow rectangle about the real segment excludes any nonreal zeros level with an endpoint. Coincidences at the endpoint heights are permitted in this result. There need not be a two-copy rectangle spanning the full critical strip.

At such a midpoint the two endpoints contribute $2/d^2$ to $C$. For $d^2C\le1/4$ the adverse exterior contribution weighted by $d^2$ must therefore reach $7/4$. Only off-line copies with $|c-\gamma|<b<1/2$ can contribute. In $[-1,T+1]$ there are at most $N-S+O(\log(2+T))$ off-line copies by the unit-interval zero-count bound. The first inequality of (2) limits the number of failing gaps to $(N-S)/7+O(\log(2+T))$. Their complement has lower density at least
$$
 \frac25-\frac{3}{10}-\frac{3}{35}=\frac1{70}
$$
relative to $N(T)$. The gap interiors are disjoint and their lengths sum to at most $T$. Discarding those longer than $200\Delta_T$ costs at most $(1/200+o(1))N$. We have proved
$$
 \liminf_{T\to\infty}\frac{\#\{\text{these pairs}:2d\le200\Delta_T,\ d^2 C(c)>1/4\}}{N(T)}
 \ \ge\ \frac1{70}-\frac1{200}=\frac{13}{1400}. \tag{3}
$$
In particular $K=0$ holds at actual isolated pair centroids tending to infinity. This is a sign theorem; it does not bound $B$ there closely enough to invoke (1).

## A full-strip family that passes the stronger inequality

For this result use the simple-line proportion $S\ge(2/3-o(1))N$ from [Alpöge and Furman, arXiv:2608.13637v2, Theorem A(i) and Remark 6.1](https://arxiv.org/html/2608.13637v2). This is an external preprint input. The weaker result (3) is independent of it.

Call an ordinate singleton if it carries exactly one copy in the full strip. Such a copy must be simple and on the line. Let $D$ be the number of other ordinate sites. Each such site contains at least two non-$S$ copies, including a reflected pair if it also contains a simple line zero. Hence $D\le(N-S)/2$. There are at least $S-D$ singleton sites. In the ordered list of all sites there are at least $S-2D-1\ge2S-N-1$ adjacent singleton-singleton gaps: the $D$ other sites split the singleton runs into at most $D+1$ runs. Each resulting pair admits a full-strip isolating rectangle because both endpoint ordinates are singleton and there is no intervening ordinate. Its centroid-to-exterior distance is at least $d$. The clearance beyond the two endpoints need not be a fixed fraction of mean spacing.

At each midpoint the exact surplus is
$$
 d^2(C-B)=2-\sum_{\rho\ {\rm exterior}}
       \frac{2d^2 b_\rho^2}{((c-\gamma)^2+b_\rho^2)^2},
 \qquad b_\rho=|1/2-\beta|. \tag{4}
$$
Real exterior zeros cancel exactly. First retain only gaps $2d\le200\Delta_T$, losing at most $(1/200+o(1))N$. For each retained gap the terms from $\gamma\notin[-1,T+1]$ total $o(1)$ uniformly: their distance in height exceeds one, the summand is $O(d^2/|c-\gamma|^4)$, and summing unit bins with $O(\log(5+|y|))$ copies gives $O(d^2\log(2+T))=O(1/\log T)$. For the remaining exterior copies sum over gaps first and use the second inequality of (2). Total weighted loss is at most $(\pi/\sqrt3)(N-S)+o(N)$. Each gap with surplus $d^2(C-B)\le1/16$ costs at least $31/16$. Consequently the lower density, relative to $N(T)$, of full-strip isolated pairs with
$$
 2d\le200\Delta_T,\qquad C(c)> B(c)+\frac{1}{16d^2}
$$
is at least
$$
 \frac13-\frac1{200}-\frac{16\pi}{93\sqrt3}>0.0162. \tag{5}
$$
In particular (1) holds with $r=1/2$ on a family of unbounded height. This conclusion concerns the actual absolute exterior sum $B$ or a sufficiently accurate upper enclosure. We have not shown it for the earlier coarse bound $(1+2/R^2)A$. The denominator for the density is the total number of zero copies, not the number of disjoint clusters in a simultaneous covering. Adjacent gaps may share an endpoint. If distinct clusters with no shared zero are required, alternating in each run retains at least half of a chosen family.

## What the argument leaves open

The geometric estimates (2) use no RH assumption. In the zeta applications, the endpoint contribution $2/d^2$ uses existing information that the two endpoints are line zeros. Thus (3) and (5) prove that the shear condition occurs at unbounded actual pair centroids. They do not independently place previously unclassified pairs on the line. A reflected pair at one ordinate has zero projected gap, and the gap weights used in this proof assign it no positive scale. This is precisely where a pointwise proof using the complete theta source or another scale chosen before locating the zeros is still needed.

A concrete obstruction to substituting a preassigned window half-width $h$ is already present in $f(t)=(t-c)^2+b^2$. At its centroid the weighted signed curvature is $-2h^2/b^2$. For a fixed $h$ it is unbounded below as $b$ tends to zero. Inequality (2) controls a source *outside* the intervals being charged. An extension to a possible reflected pair *inside* its own window would therefore need an arithmetic lower bound on the signed contribution of the complete theta source there.

To apply the earlier moving-window criterion, one must also control the exceptional clusters and multiplicities. A positive lower density of passing pairs permits exceptions in any specified window. No global covering or proof of RH follows.

Run `python3 cluster/check_centroid_packing.py` from the checkpoint directory for exact rational checks of both local packing inequalities and adversarial finite configurations. The derivations give the continuum bounds.
