# Prolate-anchor strip-root no-go

## 0. Scope and claim boundary

This note records an exact limitation of a direct attack on the zeros of the
projected prolate anchor.  It has two purposes.

1. It translates the roots of the raw-mode polynomial into the physical
   open strip `|Im z|<1/2` without losing the Fourier scale.
2. It proves that no strip-exclusion theorem can hold for all finite
   projections: already at fixed `N=2`, the source-normalized projected
   anchors eventually have nonreal zeros inside that strip.

The fixed-rank sequence is not a projection-convergent sequence.  The result
therefore does not decide the strip-root question on a schedule for which the
projected transforms converge locally uniformly to `Xi`.  On such a schedule,
compact-eventual off-axis zero exclusion is equivalent to the desired
zero-free conclusion for `Xi`; proving it would contain the central missing
analytic difficulty.  A global finite-approximant exclusion is stronger still.

The project state remains `P0_INVALIDATED`.  No zeta-zero table, global Weil
positivity, or de Bruijn--Newman input is used.

The binding conventions remain `P0_SOURCE_LOCK.json` and
`P0_NORMALIZATION_AUDIT.md`.  In particular,

\[
 \widehat f(z)=\int f(t)e^{-izt}\,dt,
 \qquad L=2\log\lambda,                              \tag{0.1}
\]

the source combination is

\[
 h_\lambda=a_4h_{4,\lambda}-a_0(\lambda)h_{0,\lambda},
 \qquad a_4={\sqrt3\over2^{11/4}},                  \tag{0.2}
\]

with `a_0(lambda)` fixed by zero integral and the source limit, not by unit
normalization.  The arithmetic state is explicitly evenized before
projection.  Nothing here changes the finite Weil matrix: its prime block
retains the minus sign of source equation (3.19), and every prime power
`1<n<=lambda^2` remains included.

The only asymptotic input below is the admitted source-normalized comparison
proved in `notes/PROJECTION_RATE_THEOREM.md` and used in
`notes/PROJECTED_STATE_NORM_LOWER_BOUND.md`.  The raw polynomial and transform
formula are those of `notes/EVEN_SECTOR_CROSS_ROOT_LIMIT_BRIDGE.md`.

## 1. Exact raw polynomial and the physical parabola

Use the source-centered modes

\[
 V_n(t)={(-1)^n\over\sqrt L}e^{2\pi int/L},
 \qquad -N\le n\le N,                              \tag{1.1}
\]

and let `x_(-n)=x_n` be real.  Define

\[
 p_x(y)=x_0\prod_{m=1}^N(y-m^2)
 +2y\sum_{n=1}^Nx_n
       \prod_{\substack{1\le m\le N\\m\ne n}}(y-m^2). \tag{1.2}
\]

For `s=zL/(2*pi)`, direct integration gives

\[
 \widehat x(z)
 = {\sqrt L\over\pi}{\sin(\pi s)\over s}
   {p_x(s^2)\over\prod_{m=1}^N(s^2-m^2)}.          \tag{1.3}
\]

Thus a nonreal root `y` of `p_x` cannot be a lattice cancellation and gives
zeros with `s^2=y` and `z=(2*pi/L)s`.

For `y=A+iB`, put

\[
 v(y)=\left({|y|-A\over2}\right)^{1/2}.            \tag{1.4}
\]

Both square roots of `y` have imaginary part of absolute value `v(y)`.
Consequently the associated physical zeros satisfy

\[
 |\operatorname {Im}z|={2\pi\over L}v(y).          \tag{1.5}
\]

Set `delta=L/(4*pi)`.  The exact finite strip condition is therefore

\[
 \boxed{
  y\in[0,\infty)
  \quad\hbox{or}\quad
  v(y)\ge\delta
 }
 \qquad\text{for every root of }p_x.               \tag{1.6}
\]

This includes negative real roots: a root in `(-delta^2,0)` produces a
purely imaginary physical zero inside the open strip and does not satisfy
(1.6).

The forbidden region has an equivalent polynomial description.  One has

\[
 v(A+iB)<\delta
 \quad\Longleftrightarrow\quad
 A>-\delta^2
 \quad\hbox{and}\quad
 B^2<4\delta^2(A+\delta^2).                       \tag{1.7}
\]

Indeed, (1.4) first gives `|y|<A+2*delta^2`; the right side is positive, so
squaring is reversible and gives (1.7).  Hence (1.6) says precisely that
`p_x` has no root in this open right-facing parabola except on the
nonnegative real axis.

For later independent checks, interpolation at the squared lattice gives

\[
 p_x(0)=(-1)^N(N!)^2x_0,                           \tag{1.8}
\]

and, for `1<=n<=N`,

\[
 p_x(n^2)=(-1)^{N-n}(N-n)!(N+n)!x_n.              \tag{1.9}
\]

These signs can force roots between lattice nodes, but they do not in
general imply real-rootedness or the parabolic exclusion (1.6).

## 2. Fixed-rank coefficient direction

Put `a=log(lambda)` and write the evenized source state on `[0,L]` as

\[
 f_\lambda(t)=k_\lambda^+(e^{t-a}).                \tag{2.1}
\]

Its real projection coefficients are

\[
 c_n(\lambda)={1\over\sqrt L}\int_0^L
 f_\lambda(t)\cos(2\pi nt/L)\,dt.                 \tag{2.2}
\]

Let

\[
 h(x)={\pi\over2}x^2(2\pi x^2-3)e^{-\pi x^2},
 \qquad K(u)=E(h)(e^u).                            \tag{2.3}
\]

The admitted source-normalized theorem supplies

\[
 \|f_\lambda-K(\,\cdot-a)\|_{L^2(0,L)}
 =O(\lambda^{-1/2}).                               \tag{2.4}
\]

It also supplies that `K` is real, even, integrable, and

\[
 \widehat K(z)={\Xi(z)\over4}.                     \tag{2.5}
\]

### Theorem 2.1 (fixed-mode direction)

For every fixed nonnegative integer `n`,

\[
 \boxed{
 \sqrt L\,c_n(\lambda)
 \longrightarrow(-1)^n C,
 \qquad C={\Xi(0)\over4}>0.}                      \tag{2.6}
\]

**Proof.**  The normalized cosine in (2.2) has `L2` norm at most one.
Equation (2.4) therefore changes `c_n` by `O(lambda^(-1/2))`; after
multiplication by `sqrt(L)` this still tends to zero.

For the limiting state, set `u=t-a`.  Since `L=2a`,

\[
\begin{aligned}
 \sqrt L\,c_n^K(\lambda)
 &=\int_{-a}^aK(u)\cos(2\pi n(u+a)/L)\,du\\
 &=(-1)^n\int_{-a}^aK(u)\cos(2\pi nu/L)\,du.
                                                               \tag{2.7}
\end{aligned}
\]

For fixed `n`, dominated convergence and (2.5) make the last integral tend
to `widehat K(0)=Xi(0)/4`.  Positivity of `Xi(0)` is elementary and uses no
zero information.  This proves (2.6).  \(\square\)

The factor `(-1)^n` in (2.6) is forced by the centered source mode (1.1).
Dropping it changes the limiting polynomial.

## 3. Exact fixed-`N=2` strip entry

The polynomial (1.2) is linear in its coefficient vector, and multiplication
of that vector by a nonzero scalar does not change its roots.  Theorem 2.1
therefore says that the fixed-`N=2` polynomial converges projectively to the
polynomial associated with

\[
 (x_0,x_1,x_2)=(1,-1,1).                           \tag{3.1}
\]

Direct substitution in (1.2) gives the exact polynomial

\[
\begin{aligned}
 p_*(y)
 &=(y-1)(y-4)-2y(y-4)+2y(y-1)\\
 &=\boxed{y^2+y+4}.                                \tag{3.2}
\end{aligned}
\]

Its discriminant is `-15`, so its two simple roots are

\[
 y_\pm={-1\pm i\sqrt{15}\over2}.                  \tag{3.3}
\]

Since `|y_pm|=2`, equation (1.4) gives exactly

\[
 v(y_\pm)^2={2-(-1/2)\over2}={5\over4},
 \qquad v(y_\pm)={\sqrt5\over2}.                  \tag{3.4}
\]

### Theorem 3.1 (fixed-rank strip no-go)

For all sufficiently large `lambda`, the source-normalized `N=2` projected
anchor has nonreal transform zeros in `|Im z|<1/2`.  More precisely, a
conjugate pair satisfies

\[
 \boxed{
 |\operatorname {Im}z_\lambda|
 ={\pi\sqrt5\over L}(1+o(1))\longrightarrow0.}    \tag{3.5}
\]

**Proof.**  Equations (2.6) and (3.2) give coefficientwise projective
convergence to `p_*`.  Its roots are simple.  Root continuity, equivalently
Rouche's theorem on disjoint small circles around (3.3), gives roots
`y_lambda,+/-` tending to `y_+/-`.  They remain nonreal and cannot meet a
lattice cancellation.  Equations (1.5) and (3.4) give (3.5), which is less
than `1/2` eventually.  \(\square\)

The theorem is qualitative.  The pinned source asymptotic behind (2.4) has
no explicit constant or threshold, so (3.5) does not certify a particular
finite decimal value of `lambda`.

### Why this does not settle a convergent schedule

For fixed `N`, (2.6) gives

\[
 \|P_Nf_\lambda\|_2^2
 =c_0(\lambda)^2+2\sum_{n=1}^Nc_n(\lambda)^2
 \sim{(2N+1)C^2\over L}\longrightarrow0.          \tag{3.6}
\]

In contrast, the admitted normalization theorem gives
`||f_lambda||_2 -> ||K||_2>0`.  Thus the fixed-rank projection error does not
tend to zero.  Equivalently, fixed `N` violates the standard sufficient
schedule condition

\[
 {L\over N(\lambda)+1}\longrightarrow0.           \tag{3.7}
\]

Theorem 3.1 rules out a universal finite-anchor strip theorem; it is not a
counterexample to a strip theorem restricted to a projection-convergent
diagonal schedule.

## 4. The exact logical boundary on a convergent schedule

Let `lambda_j -> infinity`, let `N_j` be a projection-convergent schedule,
and suppose the correctly source-normalized and explicitly rescaled entire
transforms `F_j` satisfy

\[
 F_j\longrightarrow\Xi
 \quad\hbox{locally uniformly on}\quad
 S=\{z:|\operatorname {Im}z|<1/2\}.                \tag{4.1}
\]

The fixed factor four required by the source audit is nonzero and does not
change any zero set.

Define compact-eventual off-axis exclusion to mean:

> For every closed disk `D` contained in `S` and disjoint from the real
> axis, `F_j` has no zero in `D` for all sufficiently large `j`.

### Theorem 4.1 (compact equivalence)

Under (4.1), compact-eventual off-axis exclusion holds if and only if

\[
 Z(\Xi)\cap(S\setminus\mathbb R)=\varnothing.      \tag{4.2}
\]

**Proof.**  If (4.2) holds, `|Xi|` has a positive minimum on each such compact
disk.  Local uniform convergence then makes `F_j` nonzero there eventually.

Conversely, suppose `rho` is a zero of `Xi` in `S` off the real axis.  Choose
a small closed disk around `rho`, still contained in `S` and disjoint from
the real axis, whose boundary contains no zero of `Xi`.  Rouche's theorem
and (4.1) give the same positive number of zeros of `F_j` in that disk for
all sufficiently large `j`, contradicting compact-eventual exclusion.
\(\square\)

Consequently, proving (1.6) on a locally uniformly convergent diagonal
schedule would prove (4.2).  It cannot be treated as a routine consequence
of the finite interpolation signs.

### Global exclusion is strictly stronger

Even if (4.2) holds, local uniform convergence alone does not imply that
every sufficiently late `F_j` is zero-free throughout all of
`S\setminus\mathbb R`.  Zeros can escape to infinity in the real direction.  For
example, with `alpha=1/4`, the real even polynomials

\[
 G_j(z)=
 \left(1-{z^2\over(j+i\alpha)^2}\right)
 \left(1-{z^2\over(j-i\alpha)^2}\right)            \tag{4.3}
\]

converge locally uniformly to `1`, but have the four zeros
`+/-j +/- i*alpha` in the open strip for every `j`.  Thus a uniform global
parabolic root bound for every finite anchor is stronger than the compact
statement needed in the limit.

## 5. Resulting proof obligation

For a useful diagonal schedule, the honest finite target is the parabolic
root exclusion (1.6), or a compact-height version sufficient to establish
compact-eventual exclusion after the locally uniform error is included.
The admitted source convergence proves neither target.  The fixed-`N` theorem
shows that no argument may discard the projection schedule, the factor
`2*pi/L`, or roots that enter through the parabolic region.

This is a no-go and an exact reduction, not the missing asymptotic proof.
