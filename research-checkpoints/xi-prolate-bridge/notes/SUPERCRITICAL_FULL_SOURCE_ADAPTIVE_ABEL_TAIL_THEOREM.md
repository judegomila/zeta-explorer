# Supercritical full-source adaptive Abel-tail theorem

## 0. Exact outcome and claim boundary

Put

\[
 a=\log\lambda,\qquad L=2a,\qquad h={2\pi\over L},
 \qquad c=2\pi\lambda^2,                              \tag{0.1}
\]

and assume only that `lambda>1` tends to infinity.  No integer,
half-integer, rational, or Diophantine condition is imposed on `lambda`.
Let `F_lambda` be the full even logarithmic arithmetic state
from the locked source-normalized prolate labels `0` and `4`, and write

\[
 \widehat F_\lambda(t)=\int_{\mathbb R}F_\lambda(x)e^{-itx}\,dx.
                                                               \tag{0.2}
\]

Define

\[
 K_{.9}=\left\lceil{{9c}\over{10h}}\right\rceil,
 \qquad K_c=\left\lceil{c\over h}\right\rceil,        \tag{0.3}
\]

and, for `K>=1`, the value-only Abel tail

\[
 S_K=\lim_{r\uparrow1}\sum_{q\geq0}
       (-1)^{K+q}r^q\widehat F_\lambda((K+q)h).       \tag{0.4}
\]

The main theorem is

\[
 \boxed{
 \sup_{K\geq K_{.9}}|S_K|
 \leq P(c,L)e^{-2c/5}.}                              \tag{0.5}
\]

Here and below `P` is a fixed polynomial-logarithmic function, allowed to
change from line to line.  At the original start `K_c` the proof has the
stronger margin

\[
 \boxed{
 \sup_{K\geq K_c}|S_K|
 \leq P(c,L)e^{-c/2}.}                               \tag{0.6}
\]

The exponent in (0.5) is strictly larger than the largest critical carrier
exponent used by the interface theorem:

\[
 {2\over5}=0.4>
 \kappa_{\rm car}(1/2)=0.361283181361350\ldots .     \tag{0.7}
\]

The proof has two disjoint ranges.  A lower-quadrant Mellin contour controls
the complete smooth transition

\[
 {9c\over10}\leq t\leq c^2,                          \tag{0.8}
\]

while an exact growing-order Watson decomposition controls `t>=c^2`.
The leading Watson channel is not split into compact and exterior pieces.
It is summed as the exact full zeta channel by an arbitrary-real-`lambda`
periodization lemma.  Thus there is no artificial circular seam and no
unproved comparison between a compact endpoint term and an exterior tail.

For every `gamma>=0`, Abel summation also gives the carrier-safe sampled row

\[
 \left|\sum_{k\geq K_{.9}}(-1)^k\widehat F_\lambda(t_k)
 {\gamma\sin(\gamma a)\over\gamma^2-t_k^2}\right|
 \leq P(c,L)e^{-2c/5},\qquad t_k=kh,                 \tag{0.9}
\]

with the exact-carrier value understood by continuity.  No derivative of
an Abel tail is formed anywhere.

This theorem closes only the supercritical full-source endpoint and sampled
Cauchy-row obligation.  It neither uses nor promotes a separate exterior
endpoint or direct-transform estimate.  This note does not assert the rest
of the critical arithmetic-to-actual transfer, synchronize any finite
gates, prove a signed covariance statement, prove a zeta-zero theorem, or
imply the Riemann hypothesis.  It does not claim exponent one: the complex arc
already has a non-endpoint saddle, and the present absolute contour gives
the limiting rate stated below.  The project state remains
`P0_INVALIDATED`.  This is an unbound post-checkpoint theorem and changes
none of the standard eight files.

## 1. Frozen inputs

The following note/test pairs are used byte for byte.

| Dependency | SHA-256 |
|---|---|
| `notes/PROLATE_TAIL_ENVELOPE.md` | `309337a98721d0e0cffb40391a227ad29fbc0de315c6f532109c9376370ed59d` |
| `tests/test_prolate_tail_envelope.py` | `bb5b5ec58f6357a8defcf36b19d3a1674091518903c5438f56c17ae6eef0581e` |
| `notes/PROLATE_DEFECT_SOURCE_AUDIT.md` | `b8256ce059d2632d55cb1b0477b5af7f5ebb09d0fc81a7d8b8e696885b49772d` |
| `tests/test_prolate_defect_source_lock.py` | `7caa8d088522d68dc4dedfad8d00d8e5c7e15070065c743d9e2a41f9e7faa519` |
| `notes/CRITICAL_DENSITY_PROLATE_MELLIN_TRANSPORT_CONNECTION_THEOREM.md` | `4d20e37cb8b6cfe3d92da7e1344da0f1b12ca9d20185fd7b6d8ac406ef7846c6` |
| `tests/test_critical_density_prolate_mellin_transport_connection_theorem.py` | `0a6128433698ecdc83252747971c61fb0859bf12a2afe582cd78808b8c5b8cf3` |
| `notes/COMPLEX_MELLIN_ACTION_PHASE_WEIGHTED_STOKES_INTERFACE_REDUCTION.md` | `aaebb3565089bde5d2a62b3883762e72c2b7544613c9b7e3436d348b0eb6b2b6` |
| `tests/test_complex_mellin_action_phase_weighted_stokes_interface_reduction.py` | `6b81fd05e26837adad8c9c9ccf36b534d6aa9c0c8fb71b0b2e931ba820c8bdc6` |
| `notes/FIXED_ENDPOINT_BERNOULLI_MATRIX_QUADRATURE_AND_JET_GROWTH_THEOREM.md` | `287b0fe3cfad40b6d8b7bd4719a6ddcb8fc4073eb463188f6e1100a2dc6908b0` |
| `tests/test_fixed_endpoint_bernoulli_matrix_quadrature_and_jet_growth_theorem.py` | `36d9ca8f522f10b3bf8fd98bffa7b0a0e26a67eaee94ebaba18ff4912b9d651a` |

The first two pairs supply the hard-endpoint estimate and the fixed-label
defect asymptotic.  The third supplies the exact fixed-label critical
normalization and the carrier exponent in (0.7).  The fourth supplies the
physical Mellin normalization and the exact full arithmetic identity.  The
fifth records the endpoint-jet recurrence, which is rederived with the
uniform growing-order bound needed here.

## 2. Exact Mellin normalization and endpoint scale

For `j=0,4`, let `Y_(j,c)` be the real unit angular prolate mode

\[
 -\{(1-z^2)Y'\}'+c^2z^2Y=\Theta_j(c)Y,
 \qquad -1<z<1.                                      \tag{2.1}
\]

The Sturm eigenvalue `Theta_j(c)` is not the finite-Fourier amplitude.
For these fixed labels the frozen inputs give

\[
 \Theta_j(c)=O_j(c),\qquad 0\leq\Theta_j(c)<c^2.      \tag{2.2}
\]

Put

\[
 f_{j,\lambda}(x)=\lambda^{-1/2}Y_{j,c}(x/\lambda),
 \qquad
 M_j(s)=\int_0^1Y_{j,c}(z)z^{s-1}\,dz,               \tag{2.3}
\]

\[
 P_j(s)=\int_0^\lambda f_{j,\lambda}(x)x^{s-1}\,dx
       =\lambda^{s-1/2}M_j(s).                       \tag{2.4}
\]

Let `rho_j` denote the positive finite-Fourier amplitude, so that

\[
 1_{[-\lambda,\lambda]}\widehat f_j=\rho_j f_j,
 \qquad d_j=1-\rho_j^2.                              \tag{2.5}
\]

The fixed-label defect asymptotic and hard-endpoint estimate imply

\[
 d_j\leq P_j^{\rm alg}(c)e^{-2c},\qquad
 |Y_{j,c}(1)|\leq16\pi\lambda\sqrt{d_j}
                 \leq P(c)e^{-c}.                   \tag{2.6}
\]

Here `P_j^(alg)` is a fixed algebraic power, not the Mellin transform in
(2.4).  Also `d_j<1/2` eventually, and therefore

\[
 \rho_j^{-1}\leq\sqrt2.                              \tag{2.7}
\]

For the locked source coefficients put

\[
 P_\lambda(s)=a_4P_4(s)-a_{0,\lambda}P_0(s),         \tag{2.8}
\]

where `a_4` is fixed and `a_(0,lambda)` is polynomially bounded.  Exact
Mellin summation and inversion evenization give, for
`s=1/2-it`,

\[
 \boxed{
 \widehat F_\lambda(t)=
 \operatorname {Re}\{\zeta(s)P_\lambda(s)\}.}       \tag{2.9}
\]

Equation (2.9) is the full-source identity.  No compact restriction or
exterior subtraction is present in it.

## 3. A lower-quadrant prolate bound

The next lemma is the only complex prolate estimate used in the smooth
transition.

### Lemma 3.1 (endpoint-normalized arc and central radial bounds)

Uniformly for fixed `j=0,4` and `0<=u<=pi/2`,

\[
 |Y_{j,c}(e^{-iu})|
 \leq P(c)|Y_{j,c}(1)|e^{cA(u)},
 \qquad
 A(u)=\operatorname {Re}\sqrt{1-e^{-2iu}}
     =\sqrt{\sin u(1+\sin u)}.                       \tag{3.1}
\]

If `g_j(r)=Y_(j,c)(-ir)`, `0<=r<=1`, then

\[
 |g_j(r)|\leq P(c)\cosh(cr).                         \tag{3.2}
\]

**Proof.**  On the arc put

\[
 w=\sqrt{1-z^2},\qquad V(w)=Y_{j,c}(z).
\]

Continuation is from `w=0` into the lower quadrant.  The exact equation is

\[
 V''+\left({1\over w}-{w\over1-w^2}\right)V'
 -\left(c^2-{\Theta_j(c)\over1-w^2}\right)V=0.       \tag{3.3}
\]

Write

\[
 p(w)={1\over w}-{w\over1-w^2},\qquad
 U=w^{1/2}(1-w^2)^{1/4}V.
\]

Direct differentiation gives

\[
 U''-\{c^2+R_j(w)\}U=0,
 \qquad
 R_j=-{\Theta_j(c)\over1-w^2}+{p'\over2}+{p^2\over4}.
                                                               \tag{3.4}
\]

On the unit `z` arc, `|1-w^2|=1`; hence

\[
 |R_j(w)|\leq C_j\{c+|w|^{-2}\}.                    \tag{3.5}
\]

Both `|w|` and `Re(w)` are nondecreasing along this arc.  Start at
`|w|=c^(-1)`.  The regular Frobenius series on the omitted initial piece
gives a polynomial multiple of `|Y(1)|` for
`|U|+c^(-1)|U'|`.  Diagonalizing the constant equation with
`U_+/-=(U+/-U'/c)/2`, the Volterra cost is

\[
 \int_{|w|\geq c^{-1}}{|R_j(w)|\over c}|dw|=O_j(1).  \tag{3.6}
\]

Monotonicity of `Re(w)` bounds every forward kernel by
`exp(c(Re(w)-Re(v)))`.  Gronwall and division by the algebraic gauge prove
(3.1).

For the radial part, direct substitution in (2.1) gives

\[
 ((1+r^2)g_j')'=(\Theta_j(c)+c^2r^2)g_j.             \tag{3.7}
\]

Orient the real mode so that `g_j(0)>0`.  The integral form of (3.7) gives
`g_j>0` and `g_j'>0`.  By (2.2),

\[
 g_j''\leq c^2g_j,
\]

so comparison with the solution having the same initial data yields
`g_j(r)<=g_j(0)cosh(cr)`.  The finite-Fourier identity at zero and unit
normalization give `|g_j(0)|<=P(c)`.  This proves (3.2).  `square`

## 4. The complete smooth transition

Let `s=1/2-it`.  Deform the interval in (2.3) through the lower quarter
disk.  The branch of `z^(s-1)` has `-pi/2<=arg z<=0`; the vanishing small
circle at zero is justified by `Re(s)=1/2`.  The new path consists of

\[
 z=e^{-iu},\quad0\leq u\leq\pi/2,
 \qquad\hbox{and}\qquad
 z=-ir,\quad0\leq r\leq1.                            \tag{4.1}
\]

On the arc,

\[
 |z^{s-1}dz|=e^{-tu}\,du.
\]

Equations (2.6) and (3.1) give

\[
 |M_j(s)|_{\rm arc}
 \leq P(c)e^{-c}\int_0^{\pi/2}e^{cA(u)-tu}\,du.     \tag{4.2}
\]

The exact calculus identity

\[
 \max_{0\leq u\leq\pi/2}\{A(u)-u\}
 ={\sqrt3\over2}-{\pi\over6}                        \tag{4.3}
\]

has its maximum at `u=pi/6`.  If `t>=9c/10`, then

\[
 A(u)-{9u\over10}
 \leq {\sqrt3\over2}-{\pi\over6}+{\pi\over20}.
\]

Consequently

\[
 |M_j(s)|_{\rm arc}
 \leq P(c)e^{-\beta_{\rm arc,.9}c},
 \qquad
 \beta_{\rm arc,.9}
 =1-{\sqrt3\over2}+{7\pi\over60}
 =0.50049\ldots .                                    \tag{4.4}
\]

On the radial piece,

\[
 |z^{s-1}dz|=r^{-1/2}e^{-\pi t/2}\,dr.
\]

Equation (3.2) therefore gives

\[
 |M_j(s)|_{\rm rad}
 \leq P(c)e^{c-\pi t/2}.                             \tag{4.5}
\]

At `t>=9c/10` its exponent is

\[
 \beta_{\rm rad,.9}={9\pi\over20}-1
 =0.413716694115406\ldots>{2\over5}.                 \tag{4.6}
\]

Thus, uniformly for `t>=9c/10`,

\[
 |M_j(1/2-it)|
 \leq P(c)\left(e^{-\beta_{\rm arc,.9}c}
              +e^{c-\pi t/2}\right).                \tag{4.7}
\]

The physical scaling in (2.4) has modulus one on the critical line.
Classical zeta convexity costs only a polynomial on
`9c/10<=t<=c^2`.  Hence (2.8)--(2.9) imply

\[
 \boxed{
 |\widehat F_\lambda(t)|
 \leq P(c)e^{-\beta_{.9}c},
 \qquad {9c\over10}\leq t\leq c^2,}                 \tag{4.8}
\]

for every fixed `beta_(.9)<9pi/20-1`.  In particular `beta_(.9)=2/5`
is valid after polynomial losses.  If `t>=c`, (4.3) and (4.5) instead give

\[
 \beta_{\rm arc}=1+{\pi\over6}-{\sqrt3\over2},
 \qquad
 \beta_{\rm rad}={\pi\over2}-1,                    \tag{4.9}
\]

so any fixed exponent below `pi/2-1`, including `1/2`, is valid there.

There are only `O(c^2L)` lattice points in either finite transition block.
Therefore

\[
 \sum_{K_{.9}\leq k<K_2}|\widehat F_\lambda(t_k)|
 \leq P(c,L)e^{-2c/5},
 \qquad K_2=\left\lceil{c^2\over h}\right\rceil,    \tag{4.10}
\]

and the same sum starting at `K_c` is `P(c,L)e^(-c/2)`.

## 5. Exact growing-order Watson decomposition

Repeated integration by parts in the physical Mellin integral (2.4) gives,
for every integer `R>=1`,

\[
\begin{aligned}
 P_j(s)={}&\sum_{r=0}^{R-1}{(-1)^r
 f_{j,\lambda}^{(r)}(\lambda)\lambda^{s+r}
 \over(s)_{r+1}}+\mathcal R_{j,R}(s),\\
 \mathcal R_{j,R}(s)
 ={}&{(-1)^R\over(s)_R}
 \int_0^\lambda f_{j,\lambda}^{(R)}(x)x^{s+R-1}\,dx,
\end{aligned}                                         \tag{5.1}
\]

where `(s)_r=s(s+1)...(s+r-1)`.  Every lower endpoint vanishes because
`Re(s+r)>0`.  Since

\[
 f_{j,\lambda}^{(r)}(\lambda)\lambda^{s+r}
 =Y_{j,c}^{(r)}(1)\lambda^{s-1/2},                   \tag{5.2}
\]

the lattice phase in every endpoint channel is exactly

\[
 \lambda^{s_k-1/2}=\lambda^{-it_k}=(-1)^k.           \tag{5.3}
\]

The remainder is controlled in `L2`, not by an unstated pointwise
derivative estimate.  Differentiate the full additive Fourier transform.
From (2.5), Plancherel, and (2.7),

\[
 \rho_j\|f_{j,\lambda}^{(R)}\|_{L^2(-\lambda,\lambda)}
 \leq\|\widehat f_j^{(R)}\|_{L^2(\mathbb R)}
 \leq(2\pi\lambda)^R.                               \tag{5.4}
\]

Cauchy--Schwarz against `x^(R-1/2)` gives

\[
 \left|\int_0^\lambda f_{j,\lambda}^{(R)}(x)
 x^{s+R-1}\,dx\right|
 \leq {C(2\pi\lambda)^R\lambda^R\over\sqrt{2R}}
 ={C c^R\over\sqrt{2R}}.                            \tag{5.5}
\]

For real `t`, every factor in `(s)_R` has modulus at least `t`.  Thus

\[
 |\mathcal R_{j,R}(1/2-it)|
 \leq {C\over\sqrt R}\left({c\over t}\right)^R.    \tag{5.6}
\]

Take

\[
 R=\lfloor c/4\rfloor.                               \tag{5.7}
\]

Zeta convexity and comparison with an integral now give

\[
\begin{aligned}
 \sum_{k\geq K_2}
 |\zeta(s_k)\mathcal R_{j,R}(s_k)|
 &\leq P(c,L)c^R(c^2)^{5/4-R}\\
 &\leq P(c,L)c^{5/2-R}
 \leq P(c,L)e^{-c}.
\end{aligned}                                         \tag{5.8}
\]

The last inequality is deliberately weak; the preceding quantity is
`exp(-Theta(c log c))`.

## 6. Uniform endpoint jets and all terms of order at least one

Put

\[
 {Y_{j,c}^{(r)}(1)\over Y_{j,c}(1)}
 =\mathcal P_r(\Theta_j,c^2).                        \tag{6.1}
\]

Differentiating (2.1) `r` times at the regular endpoint gives exactly

\[
\begin{aligned}
 2(r+1)\mathcal P_{r+1}
 ={}&\{\Theta_j-c^2-r(r+1)\}\mathcal P_r
 -2rc^2\mathcal P_{r-1}\\
 &-r(r-1)c^2\mathcal P_{r-2},\\
 &\mathcal P_0=1,\qquad
 \mathcal P_{-1}=\mathcal P_{-2}=0.
\end{aligned}                                         \tag{6.2}
\]

For `0<=r<=c/4`, (2.2) and induction in (6.2) prove

\[
 \boxed{
 |\mathcal P_r(\Theta_j,c^2)|\leq{c^{2r}\over r!}.} \tag{6.3}
\]

Indeed, relative to the proposed majorant at order `r+1`, the three terms
on the right of (6.2) cost at most

\[
 {9\over16},\qquad {1\over16},\qquad {1\over512},    \tag{6.4}
\]

respectively, for all sufficiently large `c`; their sum is less than one.
The cases `r=0,1` follow directly.

Combining (2.6) and (6.3),

\[
 |Y_{j,c}^{(r)}(1)|
 \leq P(c)e^{-c}{c^{2r}\over r!},
 \qquad0\leq r<R.                                   \tag{6.5}
\]

For every `r>=1`, convexity makes the corresponding sampled Watson term
absolutely summable.  At `t_0=c^2`,

\[
 \sum_{k\geq K_2}{|\zeta(s_k)|\over|(s_k)_{r+1}|}
 \leq P(L)(c^2)^{1/4-r}.                             \tag{6.6}
\]

Therefore (6.5)--(6.6), summed over `1<=r<R`, give

\[
 \sum_{r=1}^{R-1}|Y_{j,c}^{(r)}(1)|
 \sum_{k\geq K_2}{|\zeta(s_k)|\over|(s_k)_{r+1}|}
 \leq P(c,L)e^{-c}\sum_{r\geq1}{1\over r!}
 \leq P(c,L)e^{-c}.                                  \tag{6.7}
\]

Thus only the exact `r=0` full zeta channel requires conditional Abel
summation.

## 7. The full leading zeta channel for arbitrary real lambda

Put

\[
 b(t)=\operatorname {Re}{\zeta(1/2-it)\over1/2-it}.  \tag{7.1}
\]

For `Re(s)>1`, Euler summation gives

\[
 {\zeta(s)\over s}=\int_1^\infty\lfloor x\rfloor
 x^{-s-1}\,dx
 ={1\over s-1}-\int_1^\infty\{x\}x^{-s-1}\,dx.     \tag{7.2}
\]

The last integral continues absolutely to `Re(s)>0`.  At
`s=1/2-it`, changing variables `x=e^y` yields

\[
 \boxed{
 b(t)=-\int_0^\infty(1+\{e^y\})e^{-y/2}\cos(ty)\,dy.}
                                                               \tag{7.3}
\]

Define the even integrable function

\[
 q_e(y)={1\over2}(1+\{e^{|y|}\})e^{-|y|/2}.          \tag{7.4}
\]

Then `b(t)=-qhat_e(t)`.  Periodize it with period `L`:

\[
 Q(x)=\sum_{n\in\mathbb Z}q_e(x+nL),
 \qquad -{L\over2}\leq x\leq {L\over2}.            \tag{7.5}
\]

The series converges uniformly in the symmetric trace representative.  If
`lambda^(2n)` is an integer, the two opposite jumps colliding at zero are
assigned their common Fourier midpoint trace, rather than the punctate
fractional-part value.  This convention changes neither (7.3) nor any
Fourier coefficient.  The coefficients of (7.5) are exactly

\[
 \widehat Q(k)={1\over L}\widehat q_e(t_k)
              =-{b(t_k)\over L}.                    \tag{7.6}
\]

We now prove a tail bound uniform in every real `lambda>1`.  On
`0<=x<=L/2`, write

\[
 Q_0(x)=q_e(x),\qquad
 Q_n(x)=q_e(nL+x)+q_e(nL-x),\quad n\geq1.            \tag{7.7}
\]

Each `Q_n` is even in the trace sense.  The exponential envelope and the
explicit derivative and jumps of the fractional part give

\[
 \|Q_n\|_\infty\leq A_n,
 \qquad A_n=C\lambda^{-n+1/2},                        \tag{7.8}
\]

and, on every interval `I` of length `u` in `[0,L/2]`,

\[
 \operatorname {Var}_I(Q_n)
 \leq C\{B_nu+A_n\},
 \qquad B_n=C\lambda^{n+1/2}.                        \tag{7.9}
\]

To see (7.9), between jumps the derivative is `O(e^(y/2))`; the sum of
the jump sizes `m^(-1/2)` over an exponential interval of logarithmic
length `u` is bounded by the same `O(e^(y/2)u)` plus one endpoint jump.
This proof includes exact and arbitrarily near resonances and uses no
distance-to-integers estimate.

For an even BV function, integration by parts in its cosine coefficients
uses

\[
 H_K(\theta)=\lim_{r\uparrow1}
 \sum_{k\geq K}{r^{k-K}\sin(k\theta)\over k},
 \qquad
 |H_K(\theta)|\leq C\min\left\{1,
 {1\over K|\sin(\theta/2)|}\right\}.                \tag{7.10}
\]

Since `sin(pi*x/L)>=2x/L` on `[0,L/2]`, dyadic localization about zero,
(7.9), and Stieltjes integration by parts give

\[
 \left|\sum_{k\geq K}^{\rm Abel}\widehat Q_n(k)\right|
 \leq C\left\{A_n+{B_nL(1+\log(2K))\over K}\right\}.
                                                               \tag{7.11}
\]

For completeness, the innermost interval has length `L/K` and costs
`A_n+B_nL/K`.  On each following dyadic shell the `A_n` costs form a
geometric series, while `B_nL/K` is repeated only `O(log(2K))` times.

Let

\[
 n_0=\left\lfloor{\log K\over2\log\lambda}\right\rfloor.
                                                               \tag{7.12}
\]

Sum (7.11) for `1<=n<=n_0`.  For `n>n_0`, use instead the Dirichlet
Lebesgue bound

\[
 |S_{K-1}Q_n(0)|\leq C A_n\log(2K)                   \tag{7.13}
\]

and the Fourier midpoint value of `Q_n(0)`.  Since

\[
 \sum_{n\leq n_0}A_n\leq P(\lambda),\qquad
 \sum_{n\leq n_0}B_n\leq P(\lambda)\sqrt K,
 \qquad
 \sum_{n>n_0}A_n\leq{P(\lambda)\over\sqrt K},       \tag{7.14}
\]

equations (7.11)--(7.14), together with the term `Q_0` whose BV norm is
polynomially bounded in `lambda`, prove

\[
 \left|\sum_{k\geq K}^{\rm Abel}\widehat Q(k)\right|
 \leq P(\lambda,L)
 \left\{1+{(L+1)\log(2K)\over\sqrt K}\right\}.      \tag{7.15}
\]

At `r<1`, interchange of the image and Abel sums is absolute.  The bounds
above are uniform as `r` increases to one; Poisson convergence of the
uniformly convergent trace-representative periodization supplies the stated
limit.  By (7.6), and because `log(2K)/sqrt(K)` decreases eventually,

\[
 \boxed{
 \sup_{K\geq K_{.9}}
 \left|\sum_{k\geq K}^{\rm Abel}b(t_k)\right|
 \leq P(\lambda,L).}                                 \tag{7.16}
\]

This is the required arbitrary-real-`lambda` leading-channel lemma.

## 8. Exact recombination and the uniform Abel tail

For each label, equations (5.1)--(5.3) give the exact identity

\[
\begin{aligned}
 \zeta(s_k)P_j(s_k)
 ={}&Y_{j,c}(1)(-1)^k{\zeta(s_k)\over s_k}\\
 &+(-1)^k\sum_{r=1}^{R-1}(-1)^rY_{j,c}^{(r)}(1)
        {\zeta(s_k)\over(s_k)_{r+1}}
 +\zeta(s_k)\mathcal R_{j,R}(s_k).
\end{aligned}                                         \tag{8.1}
\]

Take the real locked source combination from (2.8).  Equation (8.1) is
exactly (2.9); no endpoint channel has been removed or counted twice.
After multiplication by the external `(-1)^k`, the first line is the
scalar in (7.1), multiplied by

\[
 \left|a_4Y_{4,c}(1)-a_{0,\lambda}Y_{0,c}(1)\right|
 \leq P(c)e^{-c}.                                    \tag{8.2}
\]

It is bounded uniformly by (7.16).  The second and third lines are
absolutely summable by (6.7) and (5.8).  Therefore

\[
 \boxed{
 \sup_{K\geq K_2}|S_K|\leq P(c,L)e^{-c}.}            \tag{8.3}
\]

If `K_(.9)<=K<K_2`, split the tail at `K_2` and use the absolute transition
block (4.10).  This proves (0.5).  Starting at `K_c` and using (4.9) proves
(0.6).  All differentiations above apply only to finite source integrals
or finite Watson expansions.

## 9. Carrier-safe row

Let

\[
 W_\gamma(t)={\gamma\sin(\gamma a)\over\gamma^2-t^2},
 \qquad\gamma\geq0.                                  \tag{9.1}
\]

Since `t_k a=k*pi`,

\[
 |\sin(\gamma a)|
 =|\sin((\gamma-t_k)a)|\leq a|\gamma-t_k|,
 \qquad |W_\gamma(t_k)|\leq {a\gamma\over\gamma+t_k}\leq a. \tag{9.2}
\]

For fixed `gamma` away from the lattice, the sequence has at most two
monotone branches, one on either side of the carrier.  The jump between
the branches costs at most `2a`, so

\[
 |W_\gamma(t_{K_{.9}})|
 +\sum_{k>K_{.9}}|W_\gamma(t_k)-W_\gamma(t_{k-1})|
 \leq 6a.                                            \tag{9.3}
\]

At an exact carrier `gamma=t_r`, continuity gives
`W_gamma(t_r)=a(-1)^r/2` and `W_gamma(t_k)=0` for `k!=r`, so (9.3)
continues to hold.  Abel summation of (0.5) against (9.3) proves (0.9),
with no derivative of `S_K`.  This full-source argument contains no
unproved comparison between a compact endpoint term and an exterior tail.

## 10. What the exponent says and does not say

At the original start `t=c`, the absolute contour rates are

\[
 \beta_{\rm arc}=1+{\pi\over6}-{\sqrt3\over2}
 =0.657573371813860\ldots,
 \qquad
 \beta_{\rm rad}={\pi\over2}-1
 =0.570796326794896\ldots .                           \tag{10.1}
\]

At the retuned start `t=0.9c`, the radial rate drops to (4.6), which is why
the safe theorem exponent is `2/5`, not `1/2`.  The late endpoint series has
rate one and the central remainder is superexponential, so neither is the
bottleneck.

The non-endpoint complex arc saddle shows why endpoint jets alone do not
justify exponent one throughout the transition.  This note proves no lower
bound showing that the saddle coefficient is nonzero, so it does not claim
that exponent one is impossible.  It proves only the absolute bounds
(0.5)--(0.6), which are already strictly beyond the carrier requirement.
