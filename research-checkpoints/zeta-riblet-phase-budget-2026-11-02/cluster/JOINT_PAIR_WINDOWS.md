# Two-zero windows with positive shear and reversed endpoint slopes

9 November 2026. A zero-free real function with positive signed shear has a decreasing logarithmic derivative. We prove that the opposite endpoint ordering and positive shear occur together on many full-strip two-zero windows drawn from a prescribed grid. This uses two recent number-theory preprints. They enter the proof of frequency. An individual window can be checked using only the completed function and a contour count.

## A grid and three observable inequalities

Write $f(t)=\xi(1/2+it)$, $L=f'^2-ff''$, and $d=f'/f$ wherever $f\ne0$. Let $N(T)$ count nontrivial zeros up to positive height $T$, with multiplicity. Choose

$$
 \Delta=\frac{2\pi}{\log T},\qquad r=\frac{\Delta}{1024},
 \qquad \kappa=\frac{1}{8192\Delta^2}.
$$

Use all intervals $I=[u,v]\subset[0,T]$ with $u,v\in r\mathbb Z$ and $0<v-u\le64\Delta+2r$. This family is fixed by $T$ alone. Write $N(I)$ for the winding count in the full critical strip over $I$, requiring a zero-free boundary. Call the following conditions a pass:

$$
 N(I)=2,\qquad
 \min_{I}\{L-\kappa f^2\}>0,\qquad d(v)-d(u)>1/r. \tag{1}
$$

**Joint estimate.** Using the two external estimates below, the maximum number $P(T)$ of pairwise disjoint passing windows satisfies

$$
 \liminf_{T\to\infty}\frac{P(T)}{N(T)}
 \ \ge\ \frac12\left(\frac{18}{100}-\frac1{64}-\frac2{21}\right)-\frac1{127}
 \ >\ \frac1{40}.
$$

The denominator is the total number of zero copies. The grid contains many overlapping candidates of different widths. The bound counts disjoint successful windows. As a further consequence, at least one fixed integer width in grid steps works at unbounded heights: there are at most 65,538 widths, so some width has $\limsup P_k(T)/N(T)\ge1/(40\cdot65538)$ by the finite pigeonhole principle. Here $P_k$ is the disjoint passing count restricted to that width. The proof does not select which width.

**How a pass classifies a pair.** If $f$ had no real zero on $I$, then $d'=-L/f^2<-\kappa$ throughout and $d(v)<d(u)$. The reversed slopes in (1) contradict this. Complex conjugation in ordinate coordinates forces the second of the two copies to be real as well. At a multiple real zero $L=0$, contradicting (1). Thus both copies are distinct and lie on the critical line. This test avoids integrating a pole at an unknown zero. Its classification argument has no gap-distribution hypothesis. To check a candidate, enclose the winding on its rectangle, the two endpoint ratios, and the minimum inequality by subdivision with complete theta jets. Strict inequalities and a zero-free contour permit finite refinement on each passing window. The proof gives no uniform bound on the precision needed as height grows.

## External inputs and their role

1. Among the positive zero ordinates in $(0,T]$ **listed with multiplicity**, a lower proportion exceeding $0.18$ of indices start three consecutive gaps each at least $\ell=\Delta/4$. The preprint gives $0.1812517\ldots$. [Angón, Ross, Tang and Zhao, Theorem 1, October 2026](https://arxiv.org/abs/2610.22927).
2. The number of simple critical-line zeros is at least $(2/3-o(1))N(T)$. In particular at most $(1/3+o(1))N(T)$ copies are off the line. [Alpöge and Furman, Theorem A(i) and Remark 6.1, August 2026](https://arxiv.org/html/2608.13637v2).

Both stated inputs are unconditional in their papers. We use their results as preprint inputs without an independent verification of their proofs. The first input already implies that the middle two ordinates of each counted run are simple line zeros: each has positive gaps on both sides, whereas any off-line zero has another copy at the same ordinate by reflection. The additional conclusion here is a lower bound for the joint, directly measurable conditions (1) on a zero-independent grid. It does not improve the known proportion of zeros on the line.

## Controlling shear across the middle gap

For a run in the first input let $x<y$ be the two middle ordinates. There is exactly one copy at each, no ordinate between them, and a clearance of at least $\ell$ on either outer side. The open middle gaps of different runs are disjoint. Discard gaps longer than $64\Delta$. Their total length is at most $T$, so this costs at most $(1/64+o(1))N(T)$ gaps by Riemann–von Mangoldt.

Put $z_\rho=\gamma+i(1/2-\beta)$, $b_\rho=|1/2-\beta|$ and $C=L/f^2$. The twice differentiated Hadamard product gives $C(t)=\sum_\rho\Re(t-z_\rho)^{-2}$ away from the real zeros. A copy's negative part is

$$
 q_\rho(t)=\frac{(b_\rho^2-(t-\gamma)^2)_+}{((t-\gamma)^2+b_\rho^2)^2}
$$

for $b_\rho>0$. Real copies have zero adverse contribution. On a middle gap set $m(t)=\min(t-x,y-t)$. The nearer real root supplies $1/m^2$. Discard any gap with $\max_{[x,y]}m^2\sum_{\rho:\,b_\rho>0}q_\rho\ge7/8$. Each discarded gap therefore spends at least $7/8$ of weighted negative curvature.

Here the maximum may occur away from the midpoint. Choose a maximizing witness $t$ in each discarded gap. The symmetric interval $[t-m,t+m]$ lies inside its parent gap. The witness intervals have disjoint interiors and every off-line projection is outside their interiors. The first [per-copy packing inequality (2)](UNBOUNDED_CENTROIDS.md) gives $\sum_{\rm witnesses}m(t)^2q_\rho(t)\le1/4$ for each off-line copy. Only ordinates within $1/2$ of $[0,T]$ can contribute. The standard unit-interval zero count adds $O(\log(2+T))$ copies beyond $(0,T]$. The second external input therefore bounds the discarded proportion by $(1/3)(1/4)/(7/8)=2/21$, up to $o(1)$. At every interior point of a surviving gap,

$$
 C(t)>\frac{1}{8m(t)^2}\ge\frac1{8192\Delta^2}=\kappa. \tag{2}
$$

At each root $L=f'^2>0$. The variation of the witness radius with $t$ is essential for the whole-gap conclusion.

## Extending to grid endpoints and forcing the slope reversal

Keep the larger parity class of surviving middle gaps, indexed by the rank of $x$ in the original zero list. This keeps at least half. Two retained gaps cannot share an endpoint. Between them there is a gap of length at least $\ell$ because the gap immediately beyond either retained pair is moderate. The intervals $J=[x-2r,y+2r]$ are therefore disjoint and lie in $[0,T]$.

For each retained pair let $u$ be the lattice point strictly before $x$ nearest to $x$, and $v$ the lattice point strictly after $y$ nearest to $y$. An exact lattice hit moves out by one full step. Then $0<x-u,v-y\le r$, $I=[u,v]\subset J$, and $N(I)=2$. This choice proves existence inside the previously specified finite family. The test (1) can be run on that family without a list of ordinates.

For the proof only, charge each window an exterior integral

$$
 E_I=\int_J\sum_{\rho\ \mathrm{exterior\ to\ the\ pair}}
                \frac{ds}{(s-\gamma)^2}.
$$

Every exterior projection is at least $\ell-2r$ from $J$. For a fixed exterior copy at height $\gamma$, disjointness bounds its total charge by $\int_{|s-\gamma|\ge\ell-2r}(s-\gamma)^{-2}\,ds=2/(\ell-2r)$. A copy belonging to a retained pair is omitted from its own window and still obeys this bound on the others. Apply this to $\gamma\in[-1,T+1]$, containing $N(T)+O(\log(2+T))$ copies. For $\gamma$ outside this range the pointwise sum on $[0,T]$ is $O(\log(2+T))$, by summing the unit-interval count against inverse squares at distances at least one. Their total integral is $O(T\log(2+T))$. Thus discarding $E_I\ge1/r$ costs at most

$$
 \frac{2r}{\ell-2r}N(T)+o(N(T))=\frac1{127}N(T)+o(N(T)).
$$

The *same* retained budget proves both inequalities on the enlarged window.

- **Slopes.** Subtract the two simple poles $1/(t-x)+1/(t-y)$ from $d(t)$. The remainder is regular across the real segment. Its left endpoint value minus its right endpoint value is the integral over $I$ of the exterior signed curvature, bounded above by $E_I$. This follows by differentiating the Hadamard product after removing the two factors and involves no integral through either pole. The pair's own contribution to $d(u)-d(v)$ is at most $-1/(x-u)-1/(v-y)\le-2/r$, the other two terms being negative. Hence $d(u)-d(v)\le-2/r+E_I<-1/r$.
- **Shear in the two outer strips.** For $t\in[u,x)\cup(y,v]$, the symmetric interval $[t-r,t+r]$ lies in $J$. For each exterior projection, convexity gives $\int_{t-r}^{t+r}(s-\gamma)^{-2}\,ds\ge2r/(t-\gamma)^2$. The pointwise exterior negative curvature is therefore at most $E_I/(2r)<1/(2r^2)$. The nearest root contributes at least $1/r^2$, giving $C(t)>1/(2r^2)>\kappa$.

Together with (2) and the values at the two roots, continuity gives the strict minimum on the compact interval in (1). Subtracting the costs in their stated order gives the joint estimate. The count is cumulative to $T$ and yields arbitrarily high passing windows. No frequency for every short height interval follows from this proof.

## Checks and the obstruction for RH

The previous [outward-interval computation](fixed-window-shear.json) already certifies the qualitative slope reversal in all three of its two-copy windows. Its upper bounds for $d(u)-d(v)$ are $-2.43$ on $[40,44]$, $-194.01$ on $[48,52]$, and $-2.67$ on $[56,60]$, rounded upward. Whole-window positive $L$ was verified in each. In the empty window $[44,48]$, strict positivity of $L$ and absence of a zero force the usual decreasing slopes. These finite windows use the earlier width-four design. They test the sign implication independently of the asymptotic constants. Run `python3 cluster/check_joint_pair_windows.py` from the checkpoint directory for exact rational checks of the packing, collar estimate, endpoint subtraction, four-point kernel, density arithmetic, and the saved finite certificates.

## A four-point test for a coincident projection

A reflected pair projects twice onto the same height. An isolated double critical-line zero does too. The following extrapolation gives a separate observable for this case. Let a full-strip count isolate two copies at that single projected height $c$. Equivalently, a sequence of nested full-strip rectangles shrinks to that height with count two. Conjugation makes $c$ the real first contour moment divided by two. Write $R>0$ for a lower bound on the complex distance of every exterior zero from $c$. For $0<h\le R/2$ evaluate

$$
 H_h=\frac h2\{d(c+h)-d(c-h)\},\qquad
 Q_h=\frac{4H_{h/2}-H_h}{3}.
$$

All four evaluation points avoid zeros in this setting. For a single zero at $c+w$, the terms in $H_h$ and $Q_h$ are, respectively,

$$
 \frac{h^2}{h^2-w^2},\qquad
 K_h(w)=\frac{h^4}{(h^2-4w^2)(h^2-w^2)}.
$$

This follows by subtracting the logarithmic derivatives in the genus-one product; constants cancel and the differences converge absolutely. The extrapolation cancels the inverse-square exterior term. For $|w|\ge R$ the triangle inequality gives $|K_h(w)|\le(16/45)h^4/|w|^4$. Thus, with $e_h=(16/45)h^4\sum_{\rm ext}|w|^{-4}$,

$$
 \begin{array}{ll}
 |Q_h-2|\le e_h & \text{for a double line zero},\\[2mm]
 \displaystyle\left|Q_h-\frac{2}{(1+4b^2/h^2)(1+b^2/h^2)}\right|\le e_h
       & \text{for a pair at }c\pm ib,\quad b>0 .
 \end{array} \tag{3}
$$

The exterior sum can be bounded independently by $R^{-2}(1+2/R^2)\Re(\xi'/\xi)(2+ic)$ from the [previous exterior estimate](CENTROID_SHEAR.md). For fixed $c,R$ the error is $O(h^4)$. A single observation $Q_h>4/5+e_h$ excludes all reflected splits with $b\ge h/2$; equality of the model response at $b=h/2$ explains the strict threshold. Such a bound on a sequence $h\downarrow0$ would force a double line zero. Even $\limsup_{h\downarrow0}Q_h>0$ suffices at a fixed coincident two-copy site, since (3) forces limits $2$ and $0$ in the two cases. Uniformity in $b$ at a fixed sampling scale fails as $b/h\to0$. For a general two-copy cluster whose two ordinates differ, one must use the real split $w=\pm a$ in the kernel instead of the double-root row.

This identifies a specific outstanding arithmetic estimate: bound $Q_h$ from below for the complete theta source on arbitrarily small scales at each such site, independently of its zero type. No such lower bound is obtained here. Other multiplicities and the main operator's Schur-complement estimate also remain open. The [earlier Hardy moment bound](FIXED_WINDOW_SHEAR.md) includes a uniform additive shear term on a different set of cells. This joint estimate does not transfer that term to the passing windows.
