# The theta source, causal correlations, and a convergent arithmetic ladder

The filter energy has an exact expression in the complete theta kernel. Its gamma weight prevents an absolutely convergent rearrangement over the entire height line. A causal representation resolves this integration issue and identifies the Cayley modes with Laguerre modes. It also gives a precise connection to the integer-log delay ladder, including a pole term required for convergence in the energy norm.

## What the full theta substitution gives

Use the [complete even theta density](CENTROID_SHEAR.md), with
$$
 X(z)=\xi(1/2+z)=\int_{\mathbb R}\Phi(u)e^{zu}\,du,\quad
 U(z)=\frac{s-1}{s}\zeta(s)=J(z)X(z),\quad
 J(z)=\frac{2\pi^{s/2}}{s^2\Gamma(s/2)},\quad s=1/2+z.
$$
Fix $z_0=d+ic$, $a=d-ic$, and $w(z)=(z-z_0)/(z+a)$. Define $K_d(v)=16d^5/[\pi(d^2+v^2)^3]$. On a finite height window the exact matrix is
$$
 C^{(V)}_{jk}=\iint_{\mathbb R^2}\Phi(u)\Phi(v)\,
 Q^{(V)}_{jk}(u-v)\,du\,dv,
$$
$$
 Q^{(V)}_{jk}(x)=\int_{c-V}^{c+V}
 K_d(t-c)|J(it)|^2\,\overline{w(it)^j}w(it)^k e^{itx}\,dt.
 \tag{1}
$$
All integrals in (1) are absolutely convergent at finite $V$. The numerator is
$|J(z_0)|^2|\int\Phi(u)e^{z_0u}\,du|^2$. Thus (1) expresses the starting energy and every mixed correlation through the complete theta source.

The full matrix is $\lim_{V\to\infty}C^{(V)}$. Entrywise convergence follows from $|w(it)|=1$ and the previous zeta tail bound. However, Stirling gives
$$
 |J(it)|^2\asymp e^{\pi|t|/2}|t|^{-7/2},\qquad
 K_d(t-c)|J(it)|^2\asymp e^{\pi|t|/2}|t|^{-19/2}.
$$
Consequently the absolute integral obtained by substituting the theta representation and interchanging all three integrals at $V=\infty$ diverges. Decompletion by $J$ is an unbounded multiplier on the unweighted boundary $L^2$ space. Any attempt to infer a global gain estimate from a pointwise positive theta convolution has to preserve these cancellations or retain the cutoff and its error. [Gamma asymptotics, DLMF §5.11](https://dlmf.nist.gov/5.11).

## A causal representation of the same source

Euler summation gives, for $\Re s>0$ with analytic continuation at the removed pole,
$$
 U(z)=1-(z-1/2)\mathcal L h(z),\qquad
 h(x)=e^{-x/2}\{e^x\}\quad(x\ge0).
 \tag{2}
$$
Here $\mathcal L h(z)=\int_0^\infty h(x)e^{-zx}\,dx$ and $0\le h(x)\le e^{-x/2}$. This is the actual arithmetic fractional-part function. [DLMF equation 25.2.8](https://dlmf.nist.gov/25.2.E8).

Set $A_d=(2d)^{5/2}$ and $k_a(x)=x^2e^{-ax}/2$ for $x\ge0$. The causal function
$$
 f_{d,c}=A_d\left[k_a-h*k_a'+\frac12h*k_a\right]
$$
has Laplace transform
$$
 \mathcal L f_{d,c}(z)=\frac{A_d}{(z+a)^3}U(z). \tag{3}
$$
Convolution is on $[0,\infty)$. There is no derivative of the discontinuous source in this formula. The exponential bound on $h$ makes $f_{d,c}\in L^2(0,\infty)$ for every $d>0$ and real $c$.

The normalization in (3) matters. The disk-to-half-plane isometry sends
$F(w)=(1-w)^2U(z(w))$ to $\sqrt{2d}F(w(z))/(z+a)$. Plancherel then gives
$$
 \|f_{d,c}\|_2^2=C_{00},\qquad
 \langle \ell_0,f_{d,c}\rangle=U(z_0)=F(0),
$$
where $\ell_0(x)=\sqrt{2d}e^{-ax}$ has norm one. Inner products are conjugate-linear in the first argument.

The theta and fractional-part descriptions are explicitly related. For $t>0$, let $\psi(t)=\sum_{n\ge1}e^{-\pi n^2t}$. Integration against the counting function $\lfloor r\rfloor$ gives
$$
 \psi(t)=\frac1{2\sqrt t}-2\pi t\left[
 \int_0^1r^2e^{-\pi tr^2}\,dr+
 \int_0^\infty e^{5x/2}h(x)e^{-\pi t e^{2x}}\,dx\right].
$$
For $t=e^{2u}$, $\Phi(u)=4t^{9/4}\psi''(t)+6t^{5/4}\psi'(t)$ on $u\ge0$. These identities derive the same completed source from the arithmetic counting function. They do not provide a lower bound for its oscillatory correlations.

## Cayley modes become Laguerre modes

Multiplication by $w(z)$ corresponds under the Laplace transform to
$$
 (Wf)(x)=f(x)-2d\int_0^x e^{-a(x-y)}f(y)\,dy.
$$
The operator $W$ is an isometry because $|w(it)|=1$. Its orthonormal Laguerre basis is
$$
 \ell_n(x)=\sqrt{2d}e^{-ax}L_n(2dx),\qquad
 \mathcal L\ell_n(z)=\frac{\sqrt{2d}}{z+a}w(z)^n.
$$
The Laplace identity follows by integrating the finite polynomial defining $L_n$. Standard Laguerre completeness gives the full $L^2(0,\infty)$ basis. [DLMF §18.17(vi)](https://dlmf.nist.gov/18.17#vi).

In particular, the entire energy matrix and its finite Schur complement have the exact causal forms
$$
 C_{jk}=\langle W^j f,W^k f\rangle,\qquad
 e_m=\inf_{p(0)=1,\ \deg p\le m}\|p(W)f\|_2^2.
 \tag{4}
$$
Every mixed entry and every incremental gain from the [adaptive rule](ARITHMETIC_FILTER_SEARCH.md) can therefore be computed from (2)–(4). The isometry preserves the local filter problem. Establishing $e_m<16|F(0)|^2$ still requires a lower bound on the accumulated correlation gain.

## Integer delays and the missing pole term

The Euler product expanded in $\Re s>1$ gives integer delays $\log n$, with amplitudes $n^{-1/2}$. Write
$$
 q_a=k_a-e^{-x/2}*k_a.
$$
Uniqueness of the Laplace transform gives the locally finite formula
$$
 f_{d,c}(x)=A_d\sum_{n\le e^x} n^{-1/2}q_a(x-\log n).
 \tag{5}
$$
Thus the multiplicative cascade of prime delays and the local Cayley filter have a precise causal representation. The contributions of all factorizations assemble into the integer delays in (5).

A finite Euler product by itself gives a failed approximation in the required norm. Let
$$
 \zeta_P(s)=\prod_{p\le P}(1-p^{-s})^{-1},\qquad
 U_P(z)=\frac{s-1}{s}\zeta_P(s).
$$
At $z=1/2$ one has $U_P(1/2)=0$ for every finite $P$, while $U(1/2)=1$. At the anchor $(d,c)=(1/2,0)$, form $f_P$ by replacing $U$ with $U_P$ in (3). The unit evaluation vector $\ell_0$ gives
$$
 \|f_P-f\|_2\ge|\langle\ell_0,f_P-f\rangle|=1. \tag{6}
$$
Each $f_P$ belongs to $L^2$, since the finite Euler product is bounded on $\Re s\ge1/2$. Formula (5) shows that $f_P=f$ before the first omitted prime delay. Agreement on every fixed initial time interval therefore coexists with the norm obstruction (6). This directly blocks an inference from local causal convergence of the finite products to convergence of the full energy.

There is a convergent arithmetic replacement. For integer $N\ge1$, define
$$
 U_N(z)=\frac{s-1}{s}\sum_{n\le N}n^{-s}+\frac{N^{1-s}}s
       =1-(z-1/2)\mathcal L\!\left(h\,1_{[0,\log N]}\right)(z).
 \tag{7}
$$
The pole contribution $N^{1-s}/s$ makes $U_N(1/2)=1$ exactly. The corresponding causal source is a finite ladder plus one elementary delayed response,
$$
 f_N(x)=A_d\left[
 \sum_{n\le N}n^{-1/2}q_a(x-\log n)
 +\sqrt N\, (e^{-x/2}*k_a)(x-\log N)\right],
 \tag{8}
$$
with each term zero before its delay.

## A global source-error bound and transfer inequality

There is an explicit estimate valid at every anchor,
$$
 \|f-f_N\|_2\le\Delta_N(d,c)
 =\frac{(2d)^{5/2}}{\sqrt N}
 \left(\frac1{d^2}+\frac{|1/2-a|}{d^3}\right).
 \tag{9}
$$
To prove it, the omitted source satisfies
$\|h\,1_{(\log N,\infty)}\|_2\le N^{-1/2}$. Factor the error multiplier as
$$
 \frac{z-1/2}{(z+a)^3}
 =\frac{z-1/2}{z+1/2}
 \left[\frac1{(z+a)^2}+\frac{1/2-a}{(z+a)^3}\right].
$$
The first factor is inner, hence isometric on the half-plane Hardy space. The two remaining convolution kernels have $L^1$ norms bounded by $d^{-2}$ and $|1/2-a|d^{-3}$. Young's inequality proves (9). This estimate controls the whole boundary, including every omitted delay, and its constant is explicit in height and scale.

For $p(w)=\sum b_jw^j$ with $p(0)=1$, put $L_p=\sum|b_j|$. Isometry of $W$ and the normalized evaluation vector give
$$
 \|p(W)(f-f_N)\|_2\le L_p\Delta_N,\qquad
 |U(z_0)-U_N(z_0)|\le\Delta_N.
$$
Consequently the finite arithmetic inequality
$$
 \boxed{\quad
 \|p(W)f_N\|_2+L_p\Delta_N
 <4\bigl(|U_N(z_0)|-\Delta_N\bigr)
 \quad} \tag{10}
$$
is sufficient for the $1/16$ exclusion certificate. The right side must be positive. If the true numerator is independently enclosed, its lower bound can replace $|U_N(z_0)|-\Delta_N$. The norm of (8) is a finite sum of exponential-polynomial integrals. Hence (10) contains finitely many arithmetic delays and a proved global remainder.

Every strict true-source filter certificate is captured by (10) for sufficiently large $N$, with its coefficients fixed. The quantities on the left converge and $\Delta_N\to0$. The bound can require a large arithmetic cutoff as $|c|$ grows or $d$ shrinks. A global theorem forcing the signed gain past threshold remains open.

## An arithmetic certificate and a counterexample control

At $(d,c)=(1/2,0)$, $A_d=1$ and $\Delta_N=4/\sqrt N$. With $N=64$, interval arithmetic proves
$$
 \|f_{64}\|_2^2<10.495<\frac{169}{16},\qquad
 \|f-f_{64}\|_2\le\frac12.
$$
The true numerator is exactly $U(1/2)=1$. Thus $\|f\|_2<15/4$ and
$$
 R[1]>\frac{16}{225}>\frac1{16}.
$$
This certificate uses the logarithms of integers through 64 and a tail estimate. It verifies the new source conversion in a low-height region.

For detail, $f_N(x)=e^{-x/2}P_N(x)$, where
$$
 P_N(x)=\sum_{n\le N}\left[
 \frac{(x-\log n)_+^2}{2}-\frac{(x-\log n)_+^3}{6}\right]
 +\frac{N(x-\log N)_+^3}{6}.
$$
On each interval between consecutive logarithms this is a cubic polynomial. Its squared norm is computed exactly in terms of logarithms using
$\int_{\log n}^\infty e^{-x}x^j\,dx=(j!/n)\sum_{r=0}^j(\log n)^r/r!$.
Outward 70-digit Decimal intervals certify the reported inequalities.

Causality and the source envelope alone are insufficient to establish the gain estimate. An exact control is
$$
 \widetilde h(x)=\frac12 e^{-x/2}(1-e^{-x})
 [1+\alpha\cos(8x)+\beta\sin(8x)],
$$
$$
 \alpha=\frac{8069435283}{471943926065},\qquad
 \beta=\frac{38676793156323}{60408822536320}.
$$
Since $\alpha^2+\beta^2<1$, this smooth source has
$0\le\widetilde h(x)\le e^{-x/2}$ and $\widetilde h(0)=0$.
Nevertheless $\widetilde U(z)=1-(z-1/2)\mathcal L\widetilde h(z)$ has the exact zero $z=1/4+8i$, with $\widetilde U(z)\to1$ along the positive real axis. Its Laplace transform is an elementary rational function. The checker verifies the zero symbolically. It satisfies the same causal construction and tail estimate, so any further positivity argument must use additional information about the actual arithmetic source.

Run `python3 cluster/check_theta_ladder.py` with SymPy and mpmath. The [recorded output](theta-ladder.json) contains the interval certificate, nine exact Laguerre transform checks, the exact counterexample, and independent quadrature comparisons of the complete-theta and causal-delay formulas. The quadrature comparisons are diagnostics with explicit status in the output.

## Relation to the repository's main operator

The local matrix (4) is a positive Gram matrix for every source to which this construction applies. Its desired claim is the upper bound on the minimized energy in (10). The repository's main shifted bridge instead uses
$E_\eta(z)=X(\eta-iz)$ and a difference of two completed-function products in its de Branges kernel. The current source records the remaining mixed theta terms and the need for a factorization specific to that kernel. The existing Schur audit also records a failure of an earlier kernel-uniform identification with a generic contraction norm. [Shift-bridge formulation](https://github.com/[user]/mathexplorer/blob/942ba1760c4ef54a519750ab91c37a661c31e0ce/src/data/shift-bridge-positivity-section.js). [Hidden-square route](https://github.com/[user]/mathexplorer/blob/942ba1760c4ef54a519750ab91c37a661c31e0ce/src/data/closure-routes-section.js). [Existing Schur audit](https://github.com/[user]/mathexplorer/blob/942ba1760c4ef54a519750ab91c37a661c31e0ce/src/data/imp-linkA-schur-verification.js).

Equations (3)–(10) establish the source and energy correspondence for the local filter and a convergent arithmetic ladder. The [arithmetic-gain continuation](ARITHMETIC_GAIN_BRIDGE.md) now gives a signed source-evaluation identity for the main de Branges kernel on the domain where both shifted arguments lie in the right half-plane. It does not provide its nonnegative factorization. The next concrete estimate is (10) for a filter at every covering-grid point, using the special integer-jump structure of $h$ or the equivalent complete modular theta identity. The counterexample shows that the envelope and causal isometry cannot supply that estimate by themselves.

The continuation also turns exact integer jumps into a smoothed Nyman–Beurling residual, certifies a two-delay filter, and proves the fixed-degree obstruction on the covering grid.
