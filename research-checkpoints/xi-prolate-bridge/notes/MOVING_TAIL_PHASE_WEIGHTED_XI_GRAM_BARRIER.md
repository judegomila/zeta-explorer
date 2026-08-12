# Moving tail: phase-weighted Xi Gram barrier

## 0. Claim boundary

This note studies the anchored weighted-Loewner graph when the Fourier
index grows on the physical frequency scale `n=O(L)`.  It has three exact
outcomes.

1. On every fixed frequency compact, the actual projected prolate anchor
   has the uniformly sampled leading profile

   \[
   p_n\sim {(-1)^n\over2\sqrt L}\Xi(2\pi n/L)
   \quad(n\geq1),
   \qquad p_0\sim {\Xi(0)\over4\sqrt L}.
   \]

2. Under RH, the rescaled and parity-staggered off-diagonal graph has an
   exact phase-weighted positive Gram kernel.  The phases are
   `1-cos(gamma*L)`.  They do not converge as `L` tends to infinity, so
   there is no single sharp continuum limit.  Further subsequences have
   phase-parametrized limits.

3. The familiar Xi Christoffel--Darboux kernel is only the Cesaro phase
   average of those sharp kernels.  Substituting it for the finite-source
   kernel is the same forbidden critical-line continuation already exposed
   by the vertex obstruction.  Positivity of the averaged kernel has
   RH/Laguerre--Polya strength.

The full finite Laplacian is not the Gram matrix: it is the Gram matrix
minus its row-sum diagonal.  That diagonal is exactly a collective
finite-anchor evaluation residual at the Xi zeros.  Its projective-infinity
value is the endpoint trace `P=sum p_n`.  No admitted theorem controls the
whole moving family of these residuals.  Consequently this note proves no
full actual-source operator limit, positive connectivity, routing
contraction, finite hyperbolicity, RH conclusion, or Lambda bound.  The
formal state remains `P0_INVALIDATED`.

All RH-labelled statements below are conditional.  The binding source,
Fourier, normalization, endpoint, and inclusive prime-power conventions
remain those of `P0_SOURCE_LOCK.json` and `P0_NORMALIZATION_AUDIT.md`.

## 1. Compact-frequency sampling and the endpoint trace

Put

\[
 h={2\pi\over L},\qquad a_n=nh,\qquad
 \epsilon_n=(-1)^n,
 \qquad \rho_0={1\over2},\quad \rho_n=1\ (n\geq1).       \tag{1.1}
\]

On the untranslated interval, write

\[
 \sqrt L f_N(t)=\sum_{n=0}^Np_n\cos(a_nt),
 \qquad p_0=x_0,\quad p_n=2x_n\ (n\geq1).               \tag{1.2}
\]

### Proposition 1.1 (actual compact-frequency anchor profile)

For every fixed `C>0`, on the admitted natural cutoff, and equally for any
outer cutoff containing all indices `a_n<=C`,

\[
 \boxed{
 \sum_{0\leq n\leq C/h}
 \left|\sqrt L\,p_n-
 {\rho_n\epsilon_n\over2}\Xi(a_n)\right|\longrightarrow0.} \tag{1.3}
\]

More precisely, the proof gives a bound of the form

\[
 O_C(L\lambda^{-2})+O_C(\operatorname {poly}(L)e^{-cL^2})=o(1)          \tag{1.3a}
\]

for the displayed sum.

**Proof.**  The growing-order Gevrey approximation used in the natural-
cutoff theorem writes the source state as a formal correction sum plus an
`L2` error `O(exp(-cL^2))`.  Taking one normalized Fourier coefficient and
multiplying by `sqrt(L)` preserves that error up to a polynomial factor.
The full-line transform of the leading correction is `Xi(z)/4`; after the
translation from the centered interval it acquires `epsilon_n`.  The
nonzero normalized-even coordinate has the extra factor two in (1.2).

On `|z|<=C`, the sum of all positive-order formal corrections is
`O(lambda^(-2))`, uniformly in `z`.  The full-line tail and the projected
remainder contribute `O_C(poly(L)*exp(-cL^2))` after summation.  There are
only `O_C(L)` displayed correction modes, giving (1.3a) and hence (1.3).
\(\square\)

Define the endpoint trace and the rational anchor factor

\[
 P_N=\sum_{n=0}^Np_n=\sqrt L f_N(0),                    \tag{1.4}
\]

\[
 H_N(s)=p_0+s^2\sum_{n=1}^N{p_n\over s^2-n^2}.
                                                               \tag{1.5}
\]

They are the same datum at projective infinity:

\[
 \boxed{\lim_{|s|\to\infty}H_N(s)=P_N.}                 \tag{1.6}
\]

For a fixed physical cutoff `a_N->C`, the alternating trapezoid identity
and (1.3) give, along either fixed parity of `N`,

\[
 \boxed{\sqrt L\,P_N\longrightarrow
 {(-1)^N\over4}\Xi(C).}                                \tag{1.7}
\]

Indeed, for every `C^1` function `F`,

\[
 F(0)+2\sum_{n=1}^N(-1)^nF(nh)
   =(-1)^NF(Nh)+o(1)                                   \tag{1.8}
\]

when `h->0` and `Nh->C`.  Formula (1.7) records the endpoint term for an
`O(L)` cutoff.  It does not assert a relative endpoint estimate at the much
larger natural cutoff, where the highest physical frequency also tends to
infinity.

## 2. Exact sharp kernel under RH

Assume RH in this section, and let `gamma>0` run through the critical-line
ordinates with multiplicity.  Put

\[
 \theta_\gamma(L)=1-\cos(\gamma L),
 \qquad
 \phi_\gamma(x)={\Xi(x)\over x^2-\gamma^2},             \tag{2.1}
\]

where the quotient has its removable value at a zero of Xi.  The exact
finite-source moment formula is

\[
 A_L(x)=2\sum_{\gamma>0}{\theta_\gamma(L)\over x^2-\gamma^2}.
                                                               \tag{2.2}
\]

For distinct `x,y`, let

\[
 D_L(x,y)={x^2A_L(x)-y^2A_L(y)\over x^2-y^2}.           \tag{2.3}
\]

The diagonal value is its removable divided-difference limit.

### Theorem 2.1 (phase-weighted Xi Gram kernel)

Under RH,

\[
 \boxed{
 D_L(x,y)=-2\sum_{\gamma>0}
 {\theta_\gamma(L)\gamma^2
  \over(x^2-\gamma^2)(y^2-\gamma^2)}.}                 \tag{2.4}
\]

Consequently the parity-staggered continuum kernel of the Gram part of the
rescaled graph is

\[
 \boxed{
 \mathcal K_L(x,y):=-{\Xi(x)\Xi(y)D_L(x,y)\over4\pi}
 ={1\over2\pi}\sum_{\gamma>0}
 \theta_\gamma(L)\gamma^2
 \phi_\gamma(x)\phi_\gamma(y).}                       \tag{2.5}
\]

The series is locally uniformly convergent and every finite matrix sampled
from `mathcal K_L` is positive semidefinite.

**Proof.**  The divided difference of `z/(z-gamma^2)` is
`-gamma^2/((z-gamma^2)(w-gamma^2))`, proving (2.4).
Multiplication by the two Xi factors cancels every apparent pole and gives
(2.5).  On a fixed compact, all sufficiently large ordinates contribute
`O(gamma^(-2))`; the locked zero count makes that tail summable.  Positivity
is the displayed Gram sum.  \(\square\)

To see the scaling, let `S_L=diag(epsilon_n)`.  Off the diagonal, the exact
graph has

\[
 (L_w)_{ij}=-{2\over L}p_ip_jD_L(a_i,a_j).             \tag{2.6}
\]

Since a Nyström matrix for a kernel has entries `h*K(a_i,a_j)`, (1.3)
and `Lh=2*pi` give, for positive indices,

\[
 {1\over h}\{L S_LL_wS_L\}_{ij}
   -\mathcal K_L(a_i,a_j)\longrightarrow0.              \tag{2.7}
\]

This holds on fixed frequency compacts before the row-sum diagonal is
inserted.  The zero index carries the standard endpoint half-weight
`rho_0=1/2` from (1.1), which does not change the continuum form.

For completeness, the convergence is uniform through grid points close to
a zero.  On a fixed compact, the finitely many potentially resonant terms
in (2.4) satisfy

\[
 \theta_\gamma(L)\leq
 \min\{2,\tfrac12L^2|a_n-\gamma|^2\},                  \tag{2.7a}
\]

and two distinct grid points are separated by `h=2*pi/L`.  The removable
divided differences therefore obey

\[
 \sup_{a_i,a_j\leq C}|D_L(a_i,a_j)|=O_C(L^2).          \tag{2.7b}
\]

The large-zero tail is uniformly bounded by `sum gamma^(-2)`.  Combining
(2.7b) with the quantitative error (1.3a) proves (2.7), including the
near-resonant grid cells.

### Theorem 2.2 (there is no sharp continuum limit)

Even under RH, `mathcal K_L` has no locally uniform limit as `L->infinity`.
Indeed,

\[
 \boxed{\mathcal K_L(0,0)
 ={\Xi(0)^2\over4\pi}\Psi(L),}                        \tag{2.8}
\]

where

\[
 \Psi(L)=2\sum_{\gamma>0}{1-\cos(\gamma L)\over\gamma^2}.
                                                               \tag{2.9}
\]

The function `Psi` is a nonconstant uniformly almost-periodic function.
A uniformly almost-periodic function having a limit at positive infinity
is constant.  The locked zero count supplies at least one positive
ordinate, so (2.9) is not constant.  This proves the assertion.  The
strict-half-integer logarithmic grid is asymptotically dense, so passing to
that full grid does not create a limit.

Every sequence `L_j->infinity` has a further subsequence on which every
phase converges,

\[
 \theta_\gamma(L_j)\longrightarrow\theta_\gamma\in[0,2].
                                                               \tag{2.10}
\]

On that subsequence, locally uniformly,

\[
 \boxed{
 \mathcal K_{L_j}\longrightarrow
 \mathcal K_\theta={1\over2\pi}\sum_{\gamma>0}
 \theta_\gamma\gamma^2\phi_\gamma\otimes\phi_\gamma.} \tag{2.11}
\]

If the subsequence also has the checkpoint-0.80 screw margin, then

\[
 \Psi_\theta:=2\sum_{\gamma>0}{\theta_\gamma\over\gamma^2}
 \geq c_{\rm screw}.                                    \tag{2.12}
\]

This scalar lower bound does not make the Gram family complete or provide
a routing gap.

## 3. The moment-difference kernel and the scalar cancellation

Recall `Delta_n=A_n-g`, `Psi=-g`.  The exact split is

\[
 L_w={2\Psi\over L}\{pp^T-P_N\operatorname {diag}(p)\}
       +L_\Delta.                                      \tag{3.1}
\]

For a fixed `O(L)` physical cutoff, multiply (3.1) by `L`, which is the
Nyström **operator** scaling in (2.7).  Equation (1.7) and the compact
anchor profile give

\[
 \left\|2\Psi P_N\operatorname {diag}(p)\right\|_{\rm op}
 =O(L^{-1})=O(h),                                      \tag{3.2a}
\]

so this diagonal makes no continuum-operator contribution.  If individual
entries are additionally divided by `h` to display a pointwise kernel as
in (2.7), the endpoint diagonal generally has `O(1)` entries.  Those entries
live only on the Nyström diagonal; their matrix contribution is still
`O(h)`.  Thus they must not be described as pointwise-kernel convergence.

The rank-one part has the off-diagonal/integral-operator kernel

\[
 {\Psi_\theta\over4\pi}\Xi(x)\Xi(y).                  \tag{3.2}
\]

Hence the phase-subsequential off-diagonal, equivalently Nyström integral-
operator, kernel of the moment-difference part is

\[
 \boxed{
 \mathcal K_{\Delta,\theta}(x,y)=
 \mathcal K_\theta(x,y)
 -{\Psi_\theta\over4\pi}\Xi(x)\Xi(y).}               \tag{3.3}
\]

In particular, on the codimension-one continuum subspace

\[
 \int\Xi(x)v(x)\,dx=0,                                \tag{3.4}
\]

the quadratic forms of `mathcal K_(Delta,theta)` and the positive Gram
kernel `mathcal K_theta` agree.  Formula (3.3) is the continuum expression
of the scalar-rank-one cancellation.  It is not a positivity theorem for
the full finite matrix.

## 4. The exact row-sum defect and why routing does not follow

For the actual finite graph, define

\[
 v_{n\gamma}={2\over\sqrt L}
 {\sqrt{\theta_\gamma(L)}\,\gamma p_n
  \over a_n^2-\gamma^2},
 \qquad G=VV^T.                                        \tag{4.1}
\]

The exact finite identity is

\[
 \boxed{L_w=G-\operatorname {diag}(G\mathbf1).}         \tag{4.2}
\]

Moreover,

\[
 \sum_{n=0}^N{p_n\over a_n^2-\gamma^2}
 =-{H_N(\gamma L/(2\pi))\over\gamma^2},                \tag{4.3}
\]

and therefore

\[
 \boxed{
 \sum_{n=0}^Nv_{n\gamma}
 =-{2\over\sqrt L}{\sqrt{\theta_\gamma(L)}\over\gamma}
 H_N\left({\gamma L\over2\pi}\right).}               \tag{4.4}
\]

Equivalently, the diagonal defect is exactly

\[
 \boxed{
 L(G\mathbf1)_i=-4p_i\sum_{\gamma>0}
 {\theta_\gamma(L)
 H_N(\gamma L/(2\pi))\over a_i^2-\gamma^2}.}           \tag{4.5}
\]

Thus the Gram kernel (2.5) becomes a full-operator limit only after a
collective bound making (4.5) negligible in the required topology.
Compact transform convergence controls neither the moving high zeros nor
small-denominator resonances.  The endpoint trace `P_N=H_N(infinity)` is
only one boundary value of the same residual and cannot replace the whole
family (4.4).

Positive semidefiniteness of the Gram part is also not contractive routing.
Routing needs the row-sum-corrected Laplacian (4.2), positive connectivity,
and strict positivity on `1^perp`.  None follows from (2.5), (2.12), or the
single endpoint estimate (1.7).

## 5. The Christoffel--Darboux kernel is only the phase average

Under RH, Cesaro averaging in the endpoint length sends every
`1-cos(gamma*L)` to one.  Locally uniformly,

\[
 \boxed{
 {1\over T}\int_0^T\mathcal K_L(x,y)\,dL
 \longrightarrow\mathcal K_{\rm CD}(x,y),}            \tag{5.1}
\]

where

\[
 \boxed{
 \mathcal K_{\rm CD}(x,y)=
 -{x\Xi'(x)\Xi(y)-y\Xi'(y)\Xi(x)
   \over4\pi(x^2-y^2)}
 ={1\over2\pi}\sum_{\gamma>0}
 \gamma^2\phi_\gamma(x)\phi_\gamma(y).}             \tag{5.2}
\]

The same expression results from formally replacing the finite moment by

\[
 A(x)={\Xi'(x)\over x\Xi(x)}.                          \tag{5.3}
\]

But (5.3) is the meromorphic critical-line continuation of a transform
proved by its defining integral only in a right half-plane.  Equations
(2.2) and (5.1) show exactly what it deletes: all finite endpoint phases.
It is not the sharp finite-source limit.

There is also a precise converse.  Put

\[
 \Phi(z)=\Xi(\sqrt z),\qquad
 F(z)=-2z{\Phi'(z)\over\Phi(z)}.                       \tag{5.4}
\]

Near `z=0`, congruence by the positive factor `Phi` identifies sampled
matrices of `mathcal K_CD` with the Loewner matrices

\[
 {F(z)-F(w)\over z-w}.                                 \tag{5.5}
\]

Hence positivity of `mathcal K_CD` in every matrix size makes `F` operator
monotone on a real interval.  The classical Loewner theorem extends `F` to
a Pick function.  Its meromorphic continuation can then have no nonreal
poles.  Those poles are precisely the nonzero zeros of `Phi`.  Since the
completed function has no real-`s` zeros, `Phi` has no negative real zeros.
Thus all its zeros are positive real, which is RH.  Conversely RH gives the
Gram expansion in (5.2).  Therefore

\[
 \boxed{\mathcal K_{\rm CD}\succeq0
 \text{ in all matrix sizes}\quad\Longleftrightarrow\quad RH.} \tag{5.6}
\]

The known positivity of the Fourier kernel of Xi is weaker.  For example,
for `0<epsilon<1` and `b>0`,

\[
 k(t)=e^{-t^2}\{1+\epsilon\cos(bt)\}>0                \tag{5.7}
\]

has Fourier transform

\[
 \widehat k(z)=\sqrt\pi e^{-z^2/4}
 \{1+\epsilon e^{-b^2/4}\cosh(bz/2)\}.                \tag{5.8}
\]

It is positive definite on the real axis but has nonreal zeros.  Fourier-
kernel positivity therefore does not imply the CD/Loewner positivity in
(5.6).

## 6. Reconciliation with the finite diagnostics

The induced graph on the fixed vertices `{0,1,2}` has the limiting matrix

\[
 \begin{pmatrix}0&-2&2\\-2&6&-4\\2&-4&2\end{pmatrix}
\]

and is indefinite.  This induced graph omits all edges from the prefix to
the moving tail.  Under RH on the favorable subsequence, the **full**
principal block includes those diagonal tail loads and instead has the
rank-one leading limit `q*q^T`, `q=(1,-2,2)`.  The two statements are
consistent: the moving tail is essential at leading order, while the sign
of every transverse lower-order minor remains open.

The repository's `lambda=2.75,N=24` diagnostic concerns shifted even/odd
Schur-sector margins and a residual-weighted ground comparison.  It is not
an evaluation of `L_w`, `H_N` at the Xi zeros, or the routing norm, and it
is not an interval enclosure or an asymptotic schedule.  Its positive point
margins give no evidence for the missing condition (4.5).

The surviving actual-source theorem must control the complete moving family
of rational residuals (4.4), including its endpoint and resonant regimes,
and then prove strict finite routing.  Neither the phase-averaged CD kernel
nor the existing finite diagnostics provide that theorem.
