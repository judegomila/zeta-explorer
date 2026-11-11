# Moving arithmetic certificates and the missing gain estimate

Continuation, 11 November 2026. The residual certificate has an exact comparison law between arbitrary height/scale anchors. This gives a quantitative cost for moving a certificate and an explicit sufficient gain budget for repairing it with more arithmetic terms. It also transfers the existing interval calculation to a height band 32 times wider. The all-height gain estimate remains unproved.

Two necessary restrictions on a future estimate are made explicit below: no height-independent finite cutoff can stop on the whole grid, and coefficients cannot stay bounded as the scale approaches a critical-line zero. Neither restriction is an obstruction to an appropriately adaptive construction.

## Exact comparison between anchors

Retain the pole-neutral finite Dirichlet polynomial $D(1)=0$ and write
$$
 e_D(d,c)=\int_{\mathbb R}K_d(t-c)M_D(t)\,dt,
 \quad K_d(v)=\frac{16d^5}{\pi(d^2+v^2)^3},
 \quad M_D(t)=|\zeta(1/2+it)D(1/2+it)-1|^2.
$$
The kernel has total mass six. The residual $M_D$ is unchanged when the anchor moves: only its weight changes.

For anchors $a=(d,c)$ and $a'=(d',c+h)$, set
$$
 r=\frac{d'}d,\qquad
 X=\frac{d^2+d'^2+h^2}{2dd'}\ge1,\qquad
 L=X+\sqrt{X^2-1}.
$$
Then
$$
 \boxed{\quad
 \sup_t\frac{K_{d'}(t-c-h)}{K_d(t-c)}=A(a,a'):=r^2L^3,
 \qquad e_D(a')\le A(a,a')e_D(a).
 \quad}                                                     \tag{1}
$$
This constant is sharp for comparison against arbitrary nonnegative residuals. That statement does not assert sharpness within the arithmetic family $M_D$.

**Proof.** For the Poisson kernel $P_d(v)=d/[\pi(d^2+v^2)]$, put $v=t-c$. Its ratio is the generalized Rayleigh quotient
$$
 \frac{P_{d'}(v-h)}{P_d(v)}
 =\frac{d'}d\frac{v^2+d^2}{(v-h)^2+d'^2}
 =\frac{(v,1)A_0(v,1)^T}{(v,1)B_0(v,1)^T},
$$
$$
 A_0=\frac{d'}d\begin{pmatrix}1&0\\0&d^2\end{pmatrix},
 \qquad B_0=\begin{pmatrix}1&-h\\-h&h^2+d'^2\end{pmatrix}.
$$
Both matrices are positive definite. The eigenvalues of $B_0^{-1}A_0$ have product one and sum $2X$, so their larger value is $L$. Real $v$, together with the limit $v=\infty$, covers all real projective directions. Finally $K_d=16\pi^2d^2P_d^3$, proving (1). The inverse comparison gives $e_D(a')\ge r^2L^{-3}e_D(a)$.

In geometric terms $\log L$ is the hyperbolic distance between the two points $c+id$ and $c+h+id'$ in the upper half-plane. This is a geometry of the certificate weights, not a physical fluid or a mechanism that moves zeta zeros.

For pure height and scale changes, (1) reduces to
$$
 A((d,c),(d,c+h))
 =\left(\frac{\sqrt{h^2+4d^2}+|h|}{2d}\right)^6,
 \qquad
 A((d,c),(d',c))=\max(r^5,r^{-1}).              \tag{2}
$$
An adjacent height move on the covering grid has $h=d/2$, hence
$$
 A_{\rm step}=\left(\frac{\sqrt{17}+1}{4}\right)^6
 <4.414078.
$$
With $q=15/16$, energy below $q/A_{\rm step}>0.2123886$ transports one such step without adding terms. Halving the scale at fixed height costs a factor of at most two. Repeated multiplication of these worst-case bounds supplies no uniform certificate along an infinite path.

Taking the infimum over the same finite coefficient space gives
$$
 e_N(a')\le A(a,a')e_N(a),                        \tag{3}
$$
where $e_N$ is the optimal pole-neutral residual using integers at most $N$. A strict fixed-filter certificate persists in a neighborhood by (1). Consequently, if every anchor in a compact set with $d>0$ has a strict certificate, a finite subcover supplies finitely many witnesses and a uniform finite cutoff on that compact set. This is conditional on the existence of the witnesses; it is not an all-height existence theorem.

## The arithmetic gain needed after a move

Use the orthogonalized arithmetic modes from [the growing-filter note](GROWING_ARITHMETIC_FILTER.md). At the destination anchor $a'$ let
$$
 S_{N,M}(a')=\sum_{n=N+1}^M\frac{|g_n(a')|^2}{\delta_n(a')},
 \qquad e_M(a')=e_N(a')-S_{N,M}(a').              \tag{4}
$$
The Gram matrix, projections, and gains are all evaluated at the destination. Reusing their values from the starting anchor would not justify (4).

If a known witness gives $e_N(a)\le E$, then
$$
 e_M(a')\le A(a,a')E-S_{N,M}(a').                \tag{5}
$$
Thus $S_{N,M}(a')>A(a,a')E-q$ is sufficient for a strict passing certificate. No added gain is needed when the transported bound is already below $q$.

For an induction with a reserve $E_*<q$, the exact repair target, when $e_N(a')>E_*$, is
$$
 \boxed{\quad
 \text{find a finite }M\ge N\text{ such that }
 S_{N,M}(a')\ge e_N(a')-E_*.
 \quad}                                                     \tag{6}
$$
If $e_N(a')\le E_*$, take $M=N$. Replacing $e_N(a')$ by $A(a,a')E$ gives a conservative sufficient budget. That larger budget may be unnecessarily large, even larger than the available gain; it should not be imposed as a necessary condition. A sharper destination energy enclosure reduces it.

This splits a proposed propagation proof into a known movement cost and an unknown arithmetic repair estimate. The missing theorem must produce enough gain at the destination using the actual zeta correlations, with a cutoff allowed to depend on height and scale. Equations (4)–(6) identify that task but do not prove it. Horizontal induction from seed certificates at every dyadic scale would cover the grid only if the repair theorem worked in both height directions at every step.

## Why a uniform contraction is not an available shortcut

The previous [discrete-universality corollary](ARITHMETIC_GAIN_BRIDGE.md#the-fixed-degree-obstruction-holds-on-the-exact-grid) shows that for each fixed arithmetic cutoff $N$, the optimized ratio
$$
 \sup_{D}\frac{|\zeta(s_0)D(s_0)|^2}{\|\kappa\zeta D\|_{H^2}^2},
 \qquad s_0=1/2+d+ic,\quad\kappa(w)=(1-w)^2,
$$
is arbitrarily small on a positive lower density of grid indices at $d=1/4$. The supremum here is over nonzero pole-neutral polynomials with that cutoff. The cited input is the unconditional discrete-universality statement in [Sourmelidis, equation (1.3)](https://arxiv.org/pdf/2308.07031), not the RH-conditional Theorem 1.2 later in that paper.

To translate this into the present residual test, if $e_D\le q_0<1$, Hardy evaluation and the triangle inequality give
$$
 |\zeta(s_0)D(s_0)|\ge1-\sqrt{q_0},\qquad
 \|\kappa\zeta D\|_{H^2}\le\sqrt6+\sqrt{q_0}.
$$
Its ratio is therefore at least
$$
 \left(\frac{1-\sqrt{q_0}}{\sqrt6+\sqrt{q_0}}\right)^2>0.       \tag{7}
$$
For every fixed $N$ and $q_0<1$, it follows that a positive lower density of those grid indices has $e_N>q_0$. The finite-dimensional minimum is attained, since its Gram matrix is positive definite. This conclusion applies in particular to $q_0=15/16$; it does not assert that $e_N$ approaches six on those indices.

A height-independent law $e_{N+1}\le(1-\eta)e_N$, with fixed $\eta>0$ whenever the threshold has not been passed, would start from $e_1=6$ and force passing after a fixed number of terms. That contradicts (7) and universality. The same applies to a deterministic cutoff-only block rule that would imply a finite cutoff uniform in height. This rules out those specific progress claims, not height-dependent finite stopping or estimates restricted to a bounded height interval.

## Boundary zeros force coefficient growth at small scales

There is a separate necessary condition even at known critical-line zeros. Fix a nontrivial zero $s_\gamma=1/2+i\gamma$ of multiplicity $m\ge1$. For any one fixed finite $D$, continuity gives $M_D(\gamma)=1$. The normalized kernels $K_d/6$ form an approximate identity, so
$$
 \lim_{d\downarrow0} e_D(d,\gamma)=6.             \tag{8}
$$
For completeness, split the integral at a fixed small radius. Continuity controls the inner deviation from one. On the outer region $K_d\to0$, and for sufficiently small $d$ it is bounded by a fixed integrable weight times $M_D$; the existing full-boundary bound supplies integrability. The kernel mass outside that radius tends to zero. This proves (8) without any assertion about other zeros.

More quantitatively, set $B_D=\sum_{n\le N}|a_n|/\sqrt n$. Since $|D(1/2+d+i\gamma)|\le B_D$, a certificate $e_D(d,\gamma)\le q_0<1$ requires
$$
 \boxed{\quad
 B_D\ge\frac{1-\sqrt{q_0}}{|\zeta(1/2+d+i\gamma)|}.
 \quad}                                                     \tag{9}
$$
If the denominator vanishes, no such certificate exists at that anchor; the displayed quotient is used only when it is nonzero. The local Taylor expansion at $s_\gamma$ gives
$$
 |\zeta(s_\gamma+d)|
 =\frac{|\zeta^{(m)}(s_\gamma)|}{m!}d^m(1+O(d)),
$$
so every family of passing filters there has $B_D\ge C_\gamma d^{-m}$ for all sufficiently small positive $d$, for a constant $C_\gamma>0$. This does not require simplicity of the zero. A fixed finite collection of fixed-coefficient filters therefore cannot cover arbitrarily small scales at that height. Growing coefficients, changing the cutoff, or both must be permitted.

The coefficient-dependent tail bound in the previous note already accommodates growth in $B_D$ by enlarging the integration window when needed. Inequality (9) is a necessary filter cost; it gives no lower bound on actual energy in the omitted tail and no convergence theorem.

## Certified transport to a wider finite band

The old center is $C=1967+13/32$. The preceding certificate covered $|c-C|\le1/4096$. Apply (2) to its fixed polynomial at each of the eight computed scales, with $|h|\le H=1/128$. Each transported upper bound remains strictly below $15/16$:

| Scale $d$ | Arithmetic cutoff | Energy upper bound, rounded upward |
|---|---:|---:|
| $1/2$ | 3 | 0.900444 |
| $1/4$ | 3 | 0.202294 |
| $1/8$ | 2 | 0.751921 |
| $1/16$ | 2 | 0.259873 |
| $1/32$ | 2 | 0.108377 |
| $1/64$ | 2 | 0.072194 |
| $1/128$ | 2 | 0.115974 |
| $1/256$ | 2 | 0.708039 |
| Every $0<d\le1/256$ | Same fixed cutoff-2 filter | 0.201113 |

The last row needs a separate argument: a fixed nonzero height shift has unbounded comparison cost as $d\to0$, so it cannot be obtained by transporting the old continuum bound.

Use the smallest-scale polynomial from the preceding certificate, $d_0=1/256$, and $a=1/32$. Write $v=t-C$. On the central region $|v|\le a+H=5/128$, use
$$
 \int_{|v|\le a+H}K_d(v-h)M_D(C+v)\,dv
 \le6\sup_{|v|\le a+H}M_D(C+v).
$$
Outside it, $|v-h|\ge|v|-H\ge a>d_0/\sqrt5$. Since $\partial_dK_d(u)$ has the sign of $5u^2-d^2$, every $0<d\le d_0$ satisfies
$$
 K_d(v-h)\le
 \frac{16d_0^5}{\pi\{d_0^2+(|v|-H)^2\}^3}.                  \tag{10}
$$
Integrate this envelope against the fully enclosed residual on the remaining finite bins. For $|v|>64$, one has $|t-c|>64-H$. Apply the previously proved global tail formula with cutoff $64-H$, scale $d_0$, and a height upper bound at least $C+H$. This gives an inner bound below $0.201109$, an outer finite-window bound below $0.000003576$, and an omitted-boundary bound below $4.743\times10^{-17}$.

The earlier direct evaluation inequality now excludes right-hand zeros throughout this band at every transverse displacement $0<b\le1/2$; functional symmetry handles the left half. For a proposed zero in the band, use an anchor at its own height and a dyadic scale covering $b$. This is a finite-band certificate already within known zero-verification ranges, not a new height record.

## Reproduction and remaining task

From this checkpoint run:
```sh
OPENBLAS_NUM_THREADS=1 python3 cluster/check_filter_propagation.py
```
The [checker](check_filter_propagation.py) requires NumPy and IEEE binary64 with gradual underflow. It pins the SHA-256 of [the preceding certificate](growing-arithmetic.json), uses exact rational square-root ceilings for finite-scale transport, and recomputes the complete Euler–Maclaurin interval source for the small-scale continuum. It also performs 216 rational kernel comparisons and exact determinant/trace checks. These checks support the displayed computations; the general comparison theorem is proved above, not inferred from samples. [Recorded output](filter-propagation.json) includes all upper endpoints and component bounds.

The next analytic task is to derive a height- and scale-dependent lower bound for the gain in (4), sufficient to meet the actual deficit in (6), with explicit control of the growing coefficients and complete boundary tail. Neither the transport theorem nor the finite-band widening supplies that lower bound. No global stopping theorem, positivity theorem for the main signed bridge, or proof of RH is claimed.
