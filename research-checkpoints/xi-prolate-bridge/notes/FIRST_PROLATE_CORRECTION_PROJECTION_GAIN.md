# First prolate correction and the arithmetic projection gain

## 1. Claim boundary

This note refines only the comparison of the source-normalized prolate state
with its Hermite limit.  It derives the first correction from the pinned
differential operator instead of fitting numerical prolate data.  The result
removes the artificial `lambda^(3/2)` loss in the earlier supremum estimate.

It does **not** prove a signed Weil-sector floor, an odd-gap lower bound, a
shifted-resolvent estimate, equation (5.2) of `DIRECT_RH_ATTACK.md`, locally
uniform determinant convergence, or the Riemann hypothesis.  The constants
and starting threshold in the asymptotic remainder below are not effective,
so this note cannot certify a particular finite pilot pair.  The formal
project state remains `P0_INVALIDATED`.

The Fourier convention is the locked source convention

\[
 ({\cal F}f)(y)=\int_{\mathbb R}f(x)e^{2\pi ixy}\,dx .       \tag{1.1}
\]

All finite prolate functions use Lebesgue measure on `[-lambda,lambda]`, are
zero extended, have unit norm, and have the source phase positive at zero.
The coefficient of the fourth mode remains

\[
 a_4={\sqrt3\over2^{11/4}}.                                \tag{1.2}
\]

## 2. The scaled operator and exact Hermite couplings

Divide the source operator

\[
 PW_\lambda=-\partial_x(\lambda^2-x^2)\partial_x
                   +(2\pi\lambda x)^2
\]

by `lambda^2` and put `epsilon=lambda^(-2)`.  On
`(-lambda,lambda)` its differential expression is exactly

\[
 A_\epsilon=H+\epsilon V,
 \qquad H=-\partial_x^2+4\pi^2x^2,
 \qquad Vf=\partial_x(x^2\partial_xf).                    \tag{2.1}
\]

Let `h_n` be the unit Hermite function with

\[
 Hh_n=E_nh_n,qquad E_n=2\pi(2n+1).
\]

The creation-annihilation relations, with
`y=sqrt(2*pi)x`, give the exact identity

\[
 \begin{split}
 Vh_n={}&{1\over4}
 \sqrt{n(n-1)(n-2)(n-3)}\,h_{n-4}\\
 &-{2n^2+2n+3\over4}h_n\\
 &+{1\over4}
 \sqrt{(n+1)(n+2)(n+3)(n+4)}\,h_{n+4},                  \tag{2.2}
 \end{split}
\]

where a term with a negative index is absent.  In particular

\[
 \begin{array}{lll}
 \mu_0=-3/4,&
 u_0=-{\sqrt6\over32\pi}h_4,\\[3pt]
 \mu_4=-43/4,&
 u_4={\sqrt6\over32\pi}h_0
             -{\sqrt{105}\over16\pi}h_8 .               \tag{2.3}
 \end{array}
\]

These choices solve

\[
 (H-E_n)u_n+(V-\mu_n)h_n=0,
 \qquad \langle h_n,u_n\rangle=0.                         \tag{2.4}
\]

Consequently the restrictions of

\[
 \phi_{n,\lambda}=h_n+\lambda^{-2}u_n,
 \qquad
 \nu_{n,\lambda}=E_n+\lambda^{-2}\mu_n                  \tag{2.5}
\]

to `[-lambda,lambda]` are exact quasimodes with

\[
 (A_{\lambda^{-2}}-\nu_{n,\lambda})\phi_{n,\lambda}
 =\lambda^{-4}(V-\mu_n)u_n.                               \tag{2.6}
\]

The right side is a fixed polynomial times `exp(-pi*x^2)`, so its full-line
`L2` norm is a finite source-independent constant times `lambda^(-4)`.

## 3. Quasimode remainder in the locked normalization

Let `f_{n,lambda}=h_(n,lambda)` denote the source prolate eigenfunction.  In
this section `A_(lambda^(-2))` means the Friedrichs/natural self-adjoint
realization of (2.1).  Its endpoint condition is
`(1-x^2/lambda^2)f'(x)->0`; its resolvent is compact.
For completeness, the isolation step needed to use (2.6) does not assume a
numerical prolate gap.  The quadratic forms

\[
 \mathfrak a_\lambda[f]=\int_{-\lambda}^{\lambda}
 \left((1-x^2/\lambda^2)|f'(x)|^2+4\pi^2x^2|f(x)|^2\right)dx             \tag{3.1}
\]

converge at every fixed spectral index to the harmonic-oscillator form.
Indeed, Hermite trial spaces give the upper bounds.  For a bounded-energy
sequence, the potential gives

\[
 \int_{|x|>R}|f(x)|^2dx
 \leq {\mathfrak a_\lambda[f]\over4\pi^2R^2},             \tag{3.2}
\]

while on `[-R,R]` the derivative coefficient tends uniformly to one.
Rellich compactness on each fixed interval, followed by `R->infinity`,
excludes spectral pollution and preserves multiplicity.  Thus the fixed
prolate eigenvalues converge to the simple values `E_n`, and the adjacent
spectral gaps are bounded below by a positive constant for all sufficiently
large `lambda`.

Take the inner product of (2.6) with the exact normalized eigenfunction.
The leading source asymptotic gives
`<f_(n,lambda),phi_(n,lambda)> -> 1`; hence

\[
 |E_{n,\lambda}^{\rm pro}-\nu_{n,\lambda}|=O(\lambda^{-4}).             \tag{3.3}
\]

Expanding the normalized quasimode in the exact prolate eigenbasis and using
the preceding fixed-index gap makes the norm of every off-target component
`O(lambda^(-4))`.  Since
`||phi_(n,lambda)||=1+O(lambda^(-4))` and its target coefficient is positive,
normalization then makes that coefficient `1+O(lambda^(-4))`.  Thus, with
the source phase positive at zero,

\[
 \|f_{n,\lambda}-h_n-\lambda^{-2}u_n\|_{L^2(-\lambda,\lambda)}
 =O(\lambda^{-4}),\qquad n=0,4.                           \tag{3.4}
\]

There is no endpoint-domain defect in this argument: the restrictions of
the Gaussian quasimodes are in the natural prolate operator domain and
`(1-x^2/lambda^2)phi'` vanishes at both endpoints.  On a fixed neighborhood
of zero, the coefficient in (2.1) is uniformly elliptic.  Applying the
interior `H2` estimate to the difference in (3.4), using (2.6) and (3.3),
also gives

\[
 f_{n,\lambda}(0)=h_n(0)+\lambda^{-2}u_n(0)+O(\lambda^{-4}).             \tag{3.5}
\]

The fixed-index Slepian asymptotic pinned in
`notes/PROLATE_DEFECT_SOURCE_AUDIT.md` gives
`1-chi_(n,lambda)^2` equal to a polynomial times
`exp(-4*pi*lambda^2)`.  With the exact compression identity

\[
 \int f_{n,\lambda}=\chi_{n,\lambda}f_{n,\lambda}(0)
 \qquad(n=0,4),                                           \tag{3.6}
\]

equation (3.5) may therefore be used in the source coefficient ratio without
creating an algebraic-order error.

## 4. The source combination and its first correction

Put

\[
 v_0=h_0(0)=2^{1/4},\quad
 v_4=h_4(0)={\sqrt3\over2^{5/4}},\quad
 v_8/v_0={\sqrt{70}\over16},\quad
 r=v_4/v_0={\sqrt6\over4}.                                \tag{4.1}
\]

Equations (2.3), (3.5), and (3.6) give

\[
 {\int f_{4,\lambda}\over\int f_{0,\lambda}}
 =r+\lambda^{-2}r_1+O(\lambda^{-4}),
 \qquad r_1=-{3\sqrt6\over32\pi}.                        \tag{4.2}
\]

For the locked finite state

\[
 h_\lambda=a_4f_{4,\lambda}
 -a_4{\int f_{4,\lambda}\over\int f_{0,\lambda}}
       f_{0,\lambda},                                    \tag{4.3}
\]

the exact expansion is therefore

\[
 h_\lambda=h+\lambda^{-2}g_1+R_\lambda,qquad
 \|R_\lambda\|_2=O(\lambda^{-4}),                        \tag{4.4}
\]

after zero extension, since the omitted Gaussian tails are exponentially
small.  In Hermite coordinates,

\[
 g_1=a_4\left(
 {\sqrt6\over8\pi}h_0+{3\over64\pi}h_4
              -{\sqrt{105}\over16\pi}h_8\right).         \tag{4.5}
\]

Direct substitution gives the particularly simple source-coordinate form

\[
 \boxed{
 g_1(x)={x^2\left(201-414\pi x^2+224\pi^2x^4-32\pi^3x^6\right)
                    e^{-\pi x^2}\over128}.}               \tag{4.6}
\]

This term is nonzero; thus the individual prolate convergence does not
mysteriously improve from order `lambda^(-2)` to `lambda^(-4)`.  The useful
cancellation is instead arithmetic:

\[
 {\cal F}g_1=g_1,qquad g_1(0)=0,qquad
 \int_{\mathbb R}g_1(x)dx=0.                              \tag{4.7}
\]

For an independent normalization check,

\[
 \|g_1\|_2^2
 =a_4^2{2073\over4096\pi^2}.                              \tag{4.8}
\]

## 5. Exact Mellin check

For `0<Re(s)` the positive Mellin transform of (4.6) is

\[
 \begin{split}
 G_1(s)
 &=\int_0^\infty g_1(x)x^{s-1}dx\\
 &=-{s(s-1)(4s^2-4s+43)\over512\pi}
       \pi^{-s/2}\Gamma(s/2).                             \tag{5.1}
 \end{split}
\]

The locked Hermite limit has

\[
 H(s)=\int_0^\infty h(x)x^{s-1}dx
 ={s(s-1)\over8}\pi^{-s/2}\Gamma(s/2),                   \tag{5.2}
\]

so

\[
 \boxed{G_1(s)=-{4s^2-4s+43\over64\pi}H(s).}             \tag{5.3}
\]

In the locked spectral variable `s=1/2-iz`, multiplication by `zeta(s)`
and the already-audited factor four give

\[
 \widehat{E(g_1)}(z)={2z^2-21\over128\pi}\,\Xi(z).       \tag{5.4}
\]

Equation (5.4) is a normalization identity, not a zero-location input.
It uses no zero table and no Weil positivity.  It also proves directly that
`G(t)=E(g_1)(e^t)` lies in logarithmic `L2(R)`.  Alternatively, (4.7) and
Poisson summation show `G(t)=G(-t)`, while the Gaussian sum decays rapidly
as `t->+infinity`.

## 6. Arithmetic `L2` transfer

The elementary transfer estimate needed for the remainder has no hidden
spectral input.  If `f` is supported in `[0,lambda]`, then Cauchy--Schwarz
in the arithmetic sum and a change of variables give

\[
 \begin{split}
 \|E(f)\|_{L^2([\lambda^{-1},\lambda],du/u)}^2
 &\leq\lambda\int_0^\lambda |f(x)|^2
             {\lfloor\lambda x\rfloor\over x}\,dx\\
 &\leq\lambda^2\|f\|_{L^2(0,\lambda)}^2.                 \tag{6.1}
 \end{split}
\]

Apply (6.1) to the restriction of `R_lambda` in (4.4).  The omitted tail of
`h+lambda^(-2)g_1` beyond `lambda` is a polynomial-Gaussian tail and is
exponentially small after arithmetic summation.  Hence, with
`K(t)=E(h)(e^t)` and `G(t)=E(g_1)(e^t)`, inversion symmetrization being a
contraction,

\[
 \left\|k_\lambda^+(e^{\,\cdot})-K
             -\lambda^{-2}G\right\|_{L^2(-\log\lambda,\log\lambda)}
 =O(\lambda^{-3}).                                        \tag{6.2}
\]

In particular

\[
 \boxed{
 \|k_\lambda^+(e^{\,\cdot})-K\|_{L^2(-\log\lambda,\log\lambda)}
 \leq \lambda^{-2}\|G\|_{L^2(\mathbb R)}+O(\lambda^{-3}).}             \tag{6.3}
\]

This is the source of the gain: applying (6.1) only to the full difference
would lose a factor `lambda`, whereas the leading difference has first been
identified as the global Poisson-compatible state `lambda^(-2)g_1`.

Combining (6.3) with the already-proved periodic Fourier estimate from
`notes/PROJECTION_RATE_THEOREM.md` yields

\[
 e_{\lambda,N}
 \leq \lambda^{-2}\|G\|_2+O(\lambda^{-3})
       +{C_K\log\lambda\over\pi(N+1)}.                   \tag{6.4}
\]

On the deterministic polynomial schedule

\[
 L=2\log\lambda,qquad N=\lceil\lambda L^3\rceil,         \tag{6.5}
\]

this gives

\[
 e_{\lambda,N}=O\!\left({1\over\lambda L^2}\right),
 \qquad
 \lambda L^3e_{\lambda,N}^2=O\!\left({1\over\lambda L}\right)
 \longrightarrow0.                                       \tag{6.6}
\]

Thus the positive projection/sampling admission condition (26.9) in
`notes/ANCHOR_COMPLEMENT_PARITY_PULLBACK_REDUCTION.md` follows
asymptotically on this schedule.  More explicitly, the compact-BV sampler
used there has `log H_N=O(L)` after (6.6), and its projection contribution is

\[
 O(\lambda L^3 e_{\lambda,N}^2)
 =O((\lambda L)^{-1})\longrightarrow0.                   \tag{6.7}
\]

This does not provide an effective finite threshold, and it does not
address the separate shrinking odd-floor and shifted-resolvent
obstructions.
