# All-order prolate expansion and arithmetic flatness

## 1. Scope

This note upgrades the first correction in
`notes/FIRST_PROLATE_CORRECTION_PROJECTION_GAIN.md` to an asymptotic
expansion of arbitrary fixed order.  The result is qualitative: for every
chosen order it gives a finite Hermite quasimode and an eventual remainder
bound, but it gives neither an effective constant nor an effective starting
value of `lambda`.

The conclusion is that, on

\[
 L=2\log\lambda,\qquad N=\lceil\lambda L^3\rceil,
\]

the log-Fourier projection error of the source-normalized labels `0/4`
state, and then its admitted compact-BV paired-zero sampling bound, are
smaller than every fixed inverse power of `lambda`.  This does **not** compare
that sampling bound with the shrinking odd-sector floor.  In particular it
does not prove the relative inequality needed by the shifted bridge, a
signed sector gap, determinant convergence, or the Riemann hypothesis.

We retain the locked Fourier convention

\[
 ({\cal F}f)(y)=\int_{\mathbb R}f(x)e^{2\pi ixy}\,dx.       \tag{1.1}
\]

All constants below may depend on the fixed expansion or differentiability
order, but not on `lambda`.

## 2. A finite Hermite recursion at every order

Put

\[
 \epsilon=\lambda^{-2},\qquad
 A_\epsilon=H+\epsilon V,
\]

\[
 H=-\partial_x^2+4\pi^2x^2,\qquad
 Vf=\partial_x(x^2\partial_xf).                         \tag{2.1}
\]

The normalized Hermite functions satisfy

\[
 Hh_m=E_mh_m,\qquad E_m=2\pi(2m+1),
\]

and the exact three-diagonal-in-steps-of-four formula

\[
\begin{split}
 Vh_m={}&{1\over4}\sqrt{m(m-1)(m-2)(m-3)}\,h_{m-4}\\
 &-{2m^2+2m+3\over4}h_m\\
 &+{1\over4}\sqrt{(m+1)(m+2)(m+3)(m+4)}\,h_{m+4}.       \tag{2.2}
\end{split}
\]

Fix `n=0` or `n=4`.  Let `Pi_n` be projection onto `h_n`, and let

\[
 R_n=(H-E_n)^{-1}(1-\Pi_n)                               \tag{2.3}
\]

on the finite Hermite spans occurring below.  Starting with
`w_(n,0)=h_n`, define recursively, for `j>=1`,

\[
 \mu_{n,j}=\langle h_n,Vw_{n,j-1}\rangle,                \tag{2.4}
\]

\[
 w_{n,j}=R_n\left(
       -Vw_{n,j-1}+\sum_{k=1}^j\mu_{n,k}w_{n,j-k}
                         \right),
 \qquad \langle h_n,w_{n,j}\rangle=0.                   \tag{2.5}
\]

The component along `h_n` in the parenthesis in (2.5) is zero by (2.4), so
the recurrence is well defined.  Formula (2.2) proves inductively that

\[
 w_{n,j}\in\operatorname {span}
 \{h_m:0\leq m\leq n+4j,\ m\equiv n\pmod4\}.             \tag{2.6}
\]

In particular every coefficient is obtained by finitely many rational
operations and square roots of integers, together with powers of `pi` from
the gaps `E_m-E_n=4*pi*(m-n)`.

For fixed `M`, set

\[
 W_{n,M}(\epsilon)=\sum_{j=0}^M\epsilon^jw_{n,j},\qquad
 \nu_{n,M}(\epsilon)=E_n+
       \sum_{j=1}^M\epsilon^j\mu_{n,j}.                  \tag{2.7}
\]

Expanding by powers of `epsilon` and using (2.4)--(2.5) cancels every
coefficient through order `M`.  Hence

\[
 (A_\epsilon-\nu_{n,M})W_{n,M}
 =\epsilon^{M+1}r_{n,M}(\epsilon),                       \tag{2.8}
\]

where `r_(n,M)(epsilon)` is a finite Hermite combination whose norm is
bounded for `0<=epsilon<=1`.  Thus the residual is
`O(epsilon^(M+1))`.

The gauge in (2.5) is convenient for the recursion but is not normalized
beyond first order.  Expand the formal scalar

\[
 \langle W_{n,M},W_{n,M}\rangle^{-1/2}
   =\sum_{j=0}^M d_{n,j}\epsilon^j+O(\epsilon^{M+1})
\]

and multiply (2.7), truncating again after order `M`.  This gives finite
Hermite combinations `v_(n,j)` for which

\[
 \Phi_{n,M}=\sum_{j=0}^M\epsilon^jv_{n,j},\qquad
 \|\Phi_{n,M}\|_2=1+O(\epsilon^{M+1}),                  \tag{2.9}
\]

and (2.8) remains valid with `Phi_(n,M)` in place of `W_(n,M)`.
Normalization only multiplies by scalar formal series, so (2.6) also holds
for every `v_(n,j)`.

## 3. Why the moving endpoints do not create an algebraic defect

On `[-lambda,lambda]`, the exact scaled prolate expression is

\[
 -\partial_x((1-\epsilon x^2)\partial_x)
       +4\pi^2x^2=A_\epsilon.                             \tag{3.1}
\]

Every finite Hermite combination is smooth and satisfies

\[
 (1-\epsilon x^2)\Phi_{n,M}'(x)=0
 \quad\hbox{at }x=\mathord\pm\lambda.                   \tag{3.2}
\]

It is therefore in the natural/Friedrichs prolate operator domain.  There
is no boundary distribution in (2.8), and restriction from the full line
removes only polynomial-Gaussian tails.

For clarity, the spectral isolation used here is also independent of a
numerical prolate gap.  The forms

\[
 \mathfrak a_\lambda[f]=\int_{-\lambda}^{\lambda}
 \{(1-x^2/\lambda^2)|f'(x)|^2+4\pi^2x^2|f(x)|^2\}\,dx    \tag{3.3}
\]

converge at every fixed index to the harmonic-oscillator form.  Hermite
trial spaces give the upper bounds.  A bounded-energy sequence is tight
because

\[
 \int_{|x|>R}|f(x)|^2\,dx
 \leq {\mathfrak a_\lambda[f]\over4\pi^2R^2},            \tag{3.4}
\]

and on every fixed `[-R,R]` the derivative coefficient converges uniformly
to one.  Local Rellich compactness followed by `R->infinity` gives the lower
bounds and excludes spectral pollution.  The fixed eigenvalues therefore
converge, with multiplicity, to the simple numbers `E_n`.  In particular
the gap around a fixed target is bounded below for all sufficiently large
`lambda`.

Let `f_(n,lambda)` be the unit source prolate eigenfunction, with its phase
positive at zero.  The pinned leading asymptotic identifies it with the
target `h_n`.  Taking the inner product of (2.8) with `f_(n,lambda)` first
places the exact prolate eigenvalue within `O(epsilon^(M+1))` of
`nu_(n,M)`.  Expanding the quasimode in the exact prolate eigenbasis and
using the fixed gap then gives

\[
 \left\|f_{n,\lambda}-
       \sum_{j=0}^M\epsilon^jv_{n,j}\right\|_
       {L^2(-\lambda,\lambda)}
 =O(\epsilon^{M+1}).                                      \tag{3.5}
\]

The same expansion holds at the origin.  Indeed, on a fixed neighborhood
of zero (3.1) is uniformly elliptic.  The difference in (3.5) solves an
inhomogeneous equation whose `L2` right side is
`O(epsilon^(M+1))`; the one-dimensional interior `H2` estimate and Sobolev
embedding give

\[
 f_{n,\lambda}(0)=
       \sum_{j=0}^M\epsilon^jv_{n,j}(0)
       +O(\epsilon^{M+1}).                                \tag{3.6}
\]

This argument is deliberately a quasimode argument rather than an analytic
perturbation assertion about a fixed operator domain; the physical interval
depends on `epsilon`.

## 4. Propagating the locked source ratio

For labels `0` and `4`, the finite Fourier eigenvalue has positive phase:

\[
 \int_{-\lambda}^{\lambda}f_{n,\lambda}(x)\,dx
 =\chi_{n,\lambda}f_{n,\lambda}(0),\qquad n=0,4.          \tag{4.1}
\]

The pinned fixed-index concentration asymptotic implies, for every fixed
`B`,

\[
 1-\chi_{n,\lambda}=O_B(\epsilon^B).                     \tag{4.2}
\]

Thus the algebraic asymptotic series of the source integral ratio is the
same as the point-value quotient.  Define its coefficients `b_j` by

\[
 \frac{\sum_{j\geq0}\epsilon^jv_{4,j}(0)}
      {\sum_{j\geq0}\epsilon^jv_{0,j}(0)}
 \sim\sum_{j\geq0}b_j\epsilon^j.                         \tag{4.3}
\]

Equivalently, since `v_(0,0)(0)=h_0(0)` is nonzero,

\[
 b_j={v_{4,j}(0)-
       \sum_{\ell=0}^{j-1}b_\ell v_{0,j-\ell}(0)
      \over h_0(0)}.                                      \tag{4.4}
\]

With the fixed source coefficient

\[
 a_4={\sqrt3\over2^{11/4}},
\]

put

\[
 g_j=a_4\left(v_{4,j}-
       \sum_{\ell=0}^jb_\ell v_{0,j-\ell}\right).       \tag{4.5}
\]

Equations (3.5)--(4.4) give, after zero extension and inclusion of the
Gaussian tails,

\[
 h_\lambda=\sum_{j=0}^M\epsilon^jg_j+R_{\lambda,M},
 \qquad \|R_{\lambda,M}\|_2=O(\epsilon^{M+1}).          \tag{4.6}
\]

This retains the locked source normalization; no unit normalization of the
combination has been substituted.

There are two exact cancellations at every order.  By (2.6), each `g_j` is
a finite combination only of `h_(4q)`.  Under (1.1),

\[
 {\cal F}h_{4q}=h_{4q},
 \qquad\hbox{so}\qquad {\cal F}g_j=g_j.                  \tag{4.7}
\]

The quotient recursion gives

\[
 g_j(0)=0.                                                \tag{4.8}
\]

Evaluating (4.7) at zero then gives

\[
 \boxed{g_j(0)=\int_{\mathbb R}g_j(x)\,dx=0}             \tag{4.9}
\]

for every `j`.  At `j=0` this is the locked Hermite limit.  At `j=1`, the
recurrence reproduces

\[
 {g_1\over a_4}={\sqrt6\over8\pi}h_0
       +{3\over64\pi}h_4-{\sqrt{105}\over16\pi}h_8,     \tag{4.10}
\]

which independently checks the first-order calculation.

## 5. Arithmetic transfer to arbitrary order

For each `j`, put

\[
 G_j(t)=E(g_j)(e^t),\qquad
 E(g)(u)=u^{1/2}\sum_{m\geq1}g(mu).                       \tag{5.1}
\]

Because `g_j` is a polynomial-Gaussian, (4.7)--(4.9) and Poisson summation
give

\[
 G_j(-t)=G_j(t).                                          \tag{5.2}
\]

Moreover `G_j` is smooth and, for every `r,B>=0`,

\[
 |G_j^{(r)}(t)|=O_{j,r,B}(e^{-B|t|}).                     \tag{5.3}
\]

In fact its decay is double exponential; the weaker statement (5.3) is all
that is used below.

The elementary arithmetic transfer estimate says that, for `f` supported
in `[0,lambda]`,

\[
 \|E(f)\|_{L^2([\lambda^{-1},\lambda],du/u)}
 \leq\lambda\|f\|_{L^2(0,\lambda)}.                     \tag{5.4}
\]

Apply (5.4) to the inside part of (4.6).  The omitted part of every fixed
`g_j` beyond `lambda` is polynomial-Gaussian and hence smaller than every
power after arithmetic summation.  Inversion symmetrization is an
orthogonal contraction, while each `G_j` is already inversion even.  Thus,
in centered logarithmic coordinates,

\[
 \left\|k_\lambda^+(e^{\,\cdot})-
       \sum_{j=0}^M\lambda^{-2j}G_j\right\|_
       {L^2(-\log\lambda,\log\lambda)}
 =O(\lambda^{-2M-1}).                                    \tag{5.5}
\]

The factor `lambda` in (5.4) is real, but it is paid only on the
order-`M+1` remainder.  Applying it to the complete difference at first
order would conceal the all-order flatness.

## 6. High-order periodic projection lemma

The first-order periodic `H1` bound is not sufficient for the conclusion of
this note.  The needed upgrade is the following elementary lemma.

**Lemma 6.1.**  Let `G` be even and smooth on the real line, with all
derivatives integrable and satisfying (5.3).  Put `a=log(lambda)`, `L=2a`,
and let `P_N` be projection onto the normalized modes
`L^(-1/2) exp(2*pi*i*n*t/L)`, `|n|<=N`, on `[-a,a]`.  For every fixed
integer `r>=2`,

\[
 \|(I-P_N)G\|_2
 \leq C_rL^{r-1/2}N^{-r+1/2}
       +O_{r,B}(\lambda^{-B})                              \tag{6.1}
\]

for every fixed `B`.

**Proof.**  Write

\[
 c_n=L^{-1/2}\int_{-a}^aG(t)e^{-2\pi int/L}\,dt.
\]

Integrate by parts `r` times.  The first boundary term vanishes exactly
because `G(a)=G(-a)`.  Every later boundary term is a power of `L/n` times
a difference of endpoint derivatives.  By (5.3) those differences are
`O_B(lambda^(-B))` for arbitrary `B`.  The final integral is at most
`||G^(r)||_1` times `L^(r-1/2)/(2*pi*|n|)^r`.  Squaring and summing over
`|n|>N` proves (6.1).  \(\square\)

For the deterministic schedule `N=ceil(lambda*L^3)`, (6.1) becomes

\[
 \|(I-P_N)G\|_2
 =O_r\!\left(\lambda^{-r+1/2}L^{-2r+1}\right)
   +O_{r,B}(\lambda^{-B}).                                \tag{6.2}
\]

Combine (5.5) with (6.2) for the finitely many `G_0,...,G_M`.  Given any
fixed `A>0`, first choose `M` so that `2M+1>A`, and then choose `r>A+1`.
This proves

\[
 \boxed{e_{\lambda,N}=O_A(\lambda^{-A})
        \quad\hbox{for every fixed }A>0.}                 \tag{6.3}
\]

This is an asymptotic family of statements.  It does not mean that one
fixed finite truncation works simultaneously for all `A`.

## 7. Compact-BV paired-zero consequence

The existing source variation theorem is deliberately retained rather than
replaced by an unproved high-derivative bound.  On the schedule above it
gives for the actual zero-extended projection remainder

\[
 V_N=O(\lambda^{9/2}L^{3/2}).                             \tag{7.1}
\]

Fix a desired power and choose a directed asymptotic upper bound
`bar E_N=C_B lambda^(-B)` supplied by (6.3).  In the notation of the
compact-BV theorem,

\[
 X_N=\bar E_N^2,\qquad
 W_N=\bar V_N+{3\over4}\sqrt L\,\bar E_N,
\]

\[
 H_N=\max\{1,W_N^2/X_N\}.                                \tag{7.2}
\]

Equations (7.1)--(7.2) give `log H_N=O_B(L)`.  The monotone form of the
compact-BV sampler therefore gives

\[
 \|R_N^{\rm proj}\|_{\mathfrak Z}^2
 =O_B(\lambda L^3\bar E_N^2).                            \tag{7.3}
\]

Since `B` may be taken arbitrarily large, (7.3) implies

\[
 \boxed{\|R_N^{\rm proj}\|_{\mathfrak Z}^2
       =O_A(\lambda^{-A})
       \quad\hbox{for every fixed }A>0.}                 \tag{7.4}
\]

There is no illicit replacement of the unknown ratio `V_N/E_N` by a ratio
of upper bounds here: the admitted compact-BV theorem uses the separately
monotone expression
`X log(2+max(1,W^2/X))`.

For the complete radical remainder, the hybrid outer estimate is

\[
 \|R_N^{\rm out}\|_{\mathfrak Z}^2
 \leq B_{\rm hyb}(\lambda)d_4,
 \qquad
 B_{\rm hyb}(\lambda)
 =O(\lambda^3\operatorname {polylog}\lambda).            \tag{7.5}
\]

The pinned fixed-index formula makes `d_4` exponentially small, so (7.5)
is also `O_A(lambda^(-A))` for every fixed `A`.  Hilbert-space triangle
inequality, followed by the already-proved eventual lower bound on
`a_N=||p_N||`, consequently gives

\[
 \epsilon_N=\|R_N\|_{\mathfrak Z}^2=O_A(\lambda^{-A}),
 \qquad
 U_Z={\epsilon_N\over a_N^2}=O_A(\lambda^{-A})           \tag{7.6}
\]

for every fixed `A`.

## 8. Exact limitations

1. The spectral convergence, fixed-index concentration asymptotic, and
   order-by-order remainder constants used above have no effective common
   threshold.  Equations (6.3)--(7.6) cannot certify any particular finite
   pilot pair or replace interval prolate evaluation in the producer and
   verifier.

2. Faster-than-polynomial decay is necessary for admission against the
   collapsing odd floor, but is not a relative estimate.  Fixed-degree odd
   annihilators also show that the odd floor has upper bounds smaller than
   every prescribed inverse power of `L`.  Thus (7.6) does not prove
   `U_Z<mu_(-,N)`, `q_N<mu_(-,N)`, or any shifted odd-sector positivity.

3. The fixed-order statement in this note depends on choosing a new finite
   quasimode order for each requested power.  The subsequent
   `notes/GEVREY_PROLATE_EXPONENTIAL_REMAINDER_AUDIT.md` proves a uniform
   Gevrey-1 majorant and exponentially small arithmetic projection bounds;
   it still does not prove a convergent perturbation series or a relative
   odd-floor comparison.

4. The compact-BV conclusion uses only the already-proved polynomial first
   variation bound.  It does not assert uniform bounded variation of the
   individual formal corrections at orders growing with `lambda`.

These limitations leave the relative shrinking-floor/resolvent problem as
the live obstruction.
