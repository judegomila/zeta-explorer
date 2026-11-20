# The sine-tail criterion and its exact lobe obstruction

## Scope

This note tests whether the sine-tail form of Csordas' Open Problem 4.7 is
easier than the complete-theta Fourier sign.  The actual associated kernel
has strong unconditional shape: it is positive, even, log-concave, and
strictly decreasing on the positive half-line; its tail is therefore
positive, decreasing, and convex.  These facts prove the lower sine bound.
They do **not** prove the required upper sine bound.  That upper bound is
exactly the first Xi Laguerre sign, and an explicit positive analytic
Schwartz log-concave countermodel shows that the listed shape properties are
insufficient.

An exact centered-lobe identity isolates a stronger, potentially useful
theta-specific target: positivity of one alternating lattice sum of the full
associated kernel.  Poisson summation shows why finite local curvature data
cannot decide its sign.  No endpoint sign, all-degree extension, or RH
conclusion is proved.

Use Csordas' normalization

\[
 H(x)=\int_0^\infty\Phi(t)\cos(xt)\,dt,
\]

and define

\[
 K(t)=K_1(t)=\int_{\mathbb R}s^2
 \Phi(s+t)\Phi(s-t)\,ds,                           \tag{1}
\]

\[
 \overline G(t)=\int_t^\infty K(u)\,du,
 \qquad A=\overline G(0).                          \tag{2}
\]

The scaling to the workstream profile is

\[
 R(u)=64K(u/4),
\]

as checked in `LITERATURE_ALIGNMENT_NEXT.md`.

## The sine upper bound is exactly the Fourier sign

For `x>0`, integration by parts gives

\[
\begin{aligned}
 C(x)&:=\int_0^\infty K(t)\cos(xt)\,dt\\
 &=A-x\int_0^\infty\overline G(t)\sin(xt)\,dt.
\end{aligned}                                      \tag{3}
\]

The boundary terms are ordinary: `K` and `Gbar` are rapidly decreasing and
`Gbar(0)=A`.  Thus

\[
 \boxed{
 \int_0^\infty\overline G(t)\sin(xt)\,dt\leq {A\over x}
 \quad\Longleftrightarrow\quad C(x)\geq0.}         \tag{4}
\]

Moreover Csordas' associated-kernel identity, with the full-line transform
and half-line cosine transform normalized as above, gives

\[
 H'(x)^2-H(x)H''(x)=2C(2x).                        \tag{5}
\]

Consequently (4) is a useful real-space coordinate for the open sign, but
not a relaxation of it.

## What complete-theta log-concavity proves

Put `ell=log Phi`.  The complete-theta kernel is positive, even, and
strictly log-concave.  On the convex half-plane `s>0`, the logarithm of the
integrand in (1) is

\[
 2\log s+\ell(s+t)+\ell(s-t).                     \tag{6}
\]

Its Hessian is the sum of the negative semidefinite matrices

\[
 -{2\over s^2}
 \begin{pmatrix}1&0\\0&0\end{pmatrix},
\]

\[
 \ell''(s+t)
 \begin{pmatrix}1&1\\1&1\end{pmatrix},
 \qquad
 \ell''(s-t)
 \begin{pmatrix}1&-1\\-1&1\end{pmatrix}.         \tag{7}
\]

The integrand is therefore jointly log-concave in `(s,t)`.  Evenness of
`Phi` gives twice the `s>0` integral in (1), and Prekopa's theorem yields

\[
 \boxed{K\text{ is positive, even, and log-concave}.}             \tag{8}
\]

In particular `K` is decreasing on `(0,infinity)`.  Direct differentiation
also records the strict center curvature

\[
 K''(0)=2\int_{\mathbb R}s^2\Phi(s)^2\ell''(s)\,ds<0.             \tag{9}
\]

Thus the classical sufficient route requiring `K` itself to be decreasing
and convex cannot apply: the actual kernel is concave at the origin.

Equations (2) and (8) do imply

\[
 \overline G>0,\qquad \overline G'<0,
 \qquad \overline G''=-K'>0\quad(t>0).             \tag{10}
\]

Hence `Gbar` is decreasing and convex.  Pairing successive sine half-waves,
with `delta=pi/x`, proves the unconditional lower bound

\[
\begin{aligned}
 \int_0^\infty\overline G(t)\sin(xt)\,dt
 =\sum_{j\geq0}\int_0^\delta
 &[\overline G(s+2j\delta)\\
 &-\overline G(s+(2j+1)\delta)]\sin(xs)\,ds
 \geq0.                                           \tag{11}
\end{aligned}
\]

The desired statement is the opposite, upper estimate in (4).  Convexity
of the tail does not supply it.

## An exact smooth log-concave countermodel

The limitation is not merely formal.  Let

\[
 K_0(t)=(1-t^2)_+
\]

and let `g_sigma` be the centered normalized Gaussian of variance
`sigma^2>0`.  Set

\[
 K_\sigma=K_0*g_\sigma.                            \tag{12}
\]

The compactly supported `K_0` is even and log-concave on its support, and
the Gaussian is strictly log-concave.  Prekopa convolution therefore makes
`K_sigma` positive, even, log-concave (strict by the equality case), real
analytic, and Schwartz.  It is decreasing for `t>0`; its tail has all the
properties in (10).

Nevertheless, in the Fourier convention
`widehat K(x)=integral K(t)e^(-ixt)dt`,

\[
 \widehat K_0(x)={4(\sin x-x\cos x)\over x^3},
\]

so

\[
 \boxed{
 \widehat K_\sigma(2\pi)
 =-{e^{-2\pi^2\sigma^2}\over\pi^2}<0.}             \tag{13}
\]

For the tail of `K_sigma`, equation (3) therefore gives a strict violation
of the upper sine bound at `x=2pi`.  Positivity, evenness, analyticity,
Schwartz decay, log-concavity of `K`, and decreasing convexity of `Gbar` do
not imply (4).  This is a generic countermodel, not a complete-theta or RH
counterexample.

## Exact centered-lobe criterion

There is a cancellation-aware form that does not estimate positive and
negative cosine lobes separately.  For `delta=pi/x` and
`0<=s<=delta/2`, define the absolutely convergent alternating periodization

\[
 \boxed{
 D_\delta(s)=\sum_{n\in\mathbb Z}(-1)^nK(s+n\delta).}             \tag{14}
\]

Partitioning the cosine transform into intervals of length `delta`, then
reflecting the second half of the first interval, gives exactly

\[
 \boxed{
 C(x)=\int_0^{\delta/2}\cos(xs)D_\delta(s)\,ds,
 \qquad \delta={\pi\over x}.}                     \tag{15}
\]

Since the cosine is nonnegative on this half interval, the theta-specific
inequality

\[
 D_\delta(s)\geq0
 \quad(\delta>0,\ 0\leq s\leq\delta/2)            \tag{16}
\]

would be a sufficient all-frequency proof.  It is stronger than (4), not an
equivalent restatement, and it is not proved here.

Poisson summation exposes the difficulty.  For the even Schwartz kernel
`K`,

\[
 \boxed{
 D_\delta(s)={2\over\delta}\sum_{m\geq0}
 \widehat K\!\left({(2m+1)\pi\over\delta}\right)
 \cos\!\left({(2m+1)\pi s\over\delta}\right).}    \tag{17}
\]

The target value in (15) is the fundamental odd harmonic; orthogonality on
`[0,delta/2]` removes every higher term after integration against
`cos(pi s/delta)`.  Formula (17) also shows that proving (16) from its
Fourier series would already require correlated information about the same
unknown sign at odd multiples.  Any useful proof of (16) must instead come
from independent modular structure in the real-space lattice sum (14).

There is a further guardrail.  Because both `K` and `widehat K` are
Schwartz, (17) gives, for every `N`,

\[
 \sup_{0\leq s\leq\delta/2}|D_\delta(s)|=O_N(\delta^N)
 \qquad(\delta\downarrow0).                        \tag{18}
\]

Thus every algebraic term in a local Euler/Taylor expansion cancels in the
high-frequency regime.  Finite center jets, log-curvature bounds, or a fixed
number of integrations by parts cannot determine the sign.  The sign is an
infinite, nonlocal correlation—exactly the information that raw finite orbit
packets lose at their modular seam.

## Resulting target

The sine-tail route contributes two honest facts and one sharpened target:

1. complete-theta log-concavity proves `0<=integral Gbar sin`, but not the
   upper bound `A/x`;
2. all corresponding generic shape properties admit the exact analytic
   countermodel (12)--(13);
3. a noncircular continuation may try to prove the alternating-lattice sign
   (16) directly from a modularly complete/Ewald grouping of `K_1`.

Such a grouping must cancel every seam and retain the full infinite theta
sum.  Proving only monotonicity, convexity, finitely many derivative signs,
or positive individual orbit packets cannot close (4).  No finite check can
promote (16) to the all-scale theorem.

## Nonclaims

- This note does not prove (4) or (16) for the complete-theta kernel.
- The countermodel is not generated by the Riemann theta source and is not
  evidence against the first Xi Laguerre inequality or RH.
- The 2026 second-level concavity theorem concerns a theta-kernel expression,
  not the Fourier transform sign in (4).
- The first Xi Laguerre inequality, even if proved, is not by itself
  equivalent to RH.
