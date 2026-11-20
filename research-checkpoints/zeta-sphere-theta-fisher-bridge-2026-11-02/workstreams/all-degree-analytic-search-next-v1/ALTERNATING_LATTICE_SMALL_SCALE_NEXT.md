# The small-spacing alternating lattice and its high-frequency barrier

## Scope and outcome

Let

\[
 K(r)=\int_{\mathbb R}u^2\Phi(u+r)\Phi(u-r)\,du,
 \qquad
 D_\delta(r)=\sum_{n\in\mathbb Z}(-1)^nK(r+n\delta),             \tag{1}
\]

and put

\[
 F(\nu)=\Xi'(\nu)^2-\Xi(\nu)\Xi''(\nu).
\]

`ALTERNATING_LATTICE_THETA_NEXT.md` proves `D_delta>=0` on the full
half-cell for every sufficiently large spacing.  The compact-lobe theorem in
`ALTERNATING_LATTICE_SCALE_NEXT.md` treats intervals bounded away from zero.
This note analyzes the remaining limit `delta -> 0`.

The result is a rigorous barrier and a quantitative target, not a sign proof:

1. after the exact rescaling, the small-spacing lattice is the odd-harmonic
   series of the unknown first Xi--Laguerre profile;
2. half-cell positivity at one spacing forces `F` to be nonnegative at the
   corresponding fundamental frequency, and a zero there forces zeros at
   every odd multiple;
3. standard completed-zeta bounds give an exponentially accurate additive
   first-harmonic normal form and sharpen the previous `O_N(delta^N)` bound;
4. that normal form is not a relative sign asymptotic because no lower bound
   for its fundamental coefficient is known;
5. a uniform lower bound only at the scale of the third harmonic is sufficient
   to close all sufficiently small spacings, but no such lower bound is
   established here for the actual Xi profile.

Thus small-spacing lattice positivity is not an easier consequence of finite
theta jets or of the published verified band.  It contains the unverified
high-frequency part of the first Laguerre problem and, through the boundary
slope, additional odd-harmonic correlation.

## 1. Exact high-frequency rescaling

The audited Fourier normalization is

\[
 \widehat K(q)=\frac1{256}F(q/4).
\]

Set

\[
 a={\pi\over4\delta},\qquad
 t={\pi r\over\delta},\qquad 0\leq t\leq{\pi\over2},             \tag{2}
\]

and define

\[
 \mathcal D_a(t)=128\delta
 D_\delta\!\left({\delta t\over\pi}\right).
\]

Poisson summation gives the exact uniformly convergent series

\[
 \boxed{
 \mathcal D_a(t)=\sum_{m\geq0}
 F((2m+1)a)\cos((2m+1)t).}                         \tag{3}
\]

All differentiated series in this note converge absolutely.  This follows
already from the Schwartz statement in the earlier lattice note; the
exponential estimates below give a stronger direct bound.

The odd cosines are orthogonal on `[0,pi/2]`.  Hence, for every `k>=0`,

\[
 \boxed{
 F((2k+1)a)={4\over\pi}\int_0^{\pi/2}
 \mathcal D_a(t)\cos((2k+1)t)\,dt.}               \tag{4}
\]

For the fundamental harmonic this is equivalently

\[
 \boxed{
 F(a)=512\int_0^{\delta/2}
 D_\delta(r)\cos\!\left({\pi r\over\delta}\right)dr.} \tag{5}
\]

Equation (5) is the exact reason the pointwise lattice target is stronger
than the scalar Laguerre sign.

## 2. A necessary high-frequency sign and the zero-chain alternative

Suppose

\[
 D_\delta(r)\geq0\qquad(0\leq r\leq\delta/2).       \tag{6}
\]

The cosine in (5) is positive in the open half-cell.  Therefore

\[
 \boxed{F(a)\geq0,\qquad a={\pi\over4\delta}.}      \tag{7}
\]

There is a sharp equality statement.  If `F(a)=0`, then the nonnegative
continuous integrand in (5) has zero integral, so `D_delta` vanishes on the
whole half-cell.  Equation (3) and orthogonality then imply

\[
 \boxed{
 F((2m+1)a)=0\quad\hbox{for every }m\geq0.}         \tag{8}
\]

Consequently, a theorem asserting (6) for every `0<delta<=delta_0` would
imply

\[
 F(a)\geq0\qquad
 \left(a\geq{\pi\over4\delta_0}\right),            \tag{9}
\]

with any equality propagating along its complete odd-multiple chain.  This is
an exact implication, not a heuristic leading-term argument.  In particular,
the small-spacing problem contains the presently unverified high-frequency
part of Csordas' first Xi--Laguerre problem.

The published verified-zero theorem supplies `F>=0` only on a fixed bounded
frequency interval.  Since `a` tends to infinity as `delta` tends to zero,
that theorem does not address (9).

## 3. An exponential small-spacing envelope

The completed-zeta formula

\[
 \Xi(t)=\frac12s(s-1)\pi^{-s/2}\Gamma(s/2)\zeta(s),
 \qquad s=\frac12+it,                              \tag{10}
\]

gives, for every `epsilon>0` and `j=0,1,2`,

\[
 \Xi^{(j)}(t)
 =O_\epsilon\!\left((1+t)^{2+\epsilon}e^{-\pi t/4}\right)
 \qquad(t\geq1).                                  \tag{11}
\]

Indeed, Stirling gives the exponential and `t^(-1/4)` gamma factors.  The
critical-strip convexity bound gives
`zeta^(ell)(1/2+it)=O_epsilon(t^(1/4+epsilon))` for each fixed derivative,
by Cauchy's formula in a `1/log t` neighborhood; all logarithmic derivative
losses are absorbed into `t^epsilon`.  Differentiating the elementary
prefactors in (10) does not change (11).

It follows that

\[
 \boxed{
 |F(t)|\leq C_\epsilon(1+t)^{4+\epsilon}e^{-\pi t/2}
 \qquad(t\geq1).}                                  \tag{12}
\]

For fixed `k>=0`, define the higher-odd-harmonic envelope

\[
 E_k(a)=\sum_{m\geq1}(2m+1)^k|F((2m+1)a)|.        \tag{13}
\]

Using (12), factoring out the `m=1` exponential, and summing the remaining
geometric-polynomial tail gives, for `a>=1`,

\[
 \boxed{
 E_k(a)\leq C_{\epsilon,k}
 a^{4+\epsilon}e^{-3\pi a/2}.}                    \tag{14}
\]

In particular, uniformly for `0<=t<=pi/2`,

\[
 \boxed{
 \mathcal D_a(t)=F(a)\cos t+
 O_\epsilon\!\left(a^{4+\epsilon}e^{-3\pi a/2}\right).} \tag{15}
\]

Returning to `delta`, (12)--(15) imply the unconditional exponential
beyond-all-orders bound

\[
 \boxed{
 \sup_{0\leq r\leq\delta/2}|D_\delta(r)|
 =O_\epsilon\!\left(
 \delta^{-5-\epsilon}e^{-\pi^2/(8\delta)}\right)
 \quad(\delta\downarrow0).}                       \tag{16}
\]

They also give the additive first-harmonic expansion

\[
 D_\delta\!\left({\delta t\over\pi}\right)
 ={F(\pi/(4\delta))\over128\delta}\cos t
 +O_\epsilon\!\left(
 \delta^{-5-\epsilon}e^{-3\pi^2/(8\delta)}\right). \tag{17}
\]

The earlier `O_N(delta^N)` cancellation follows immediately from (16), but
(16) identifies the completed-gamma exponential scale.

## 4. Why the additive normal form does not decide the sign

Formula (17) must not be rewritten as a relative `(1+o(1))` asymptotic.
The available estimates give an upper bound for `F(a)` but no positive lower
bound.  The fundamental value may be smaller than the third-harmonic envelope,
and proving that it never has the wrong sign is already the open assertion in
(9).

This is not a technical issue confined to a zero.  If `F(a)=0` while some
higher odd sample is nonzero, (8) shows directly that the half-cell sign must
fail.  Near a very small fundamental value, the higher harmonics also control
the boundary layer even though they are exponentially smaller than the
natural gamma envelope of the first harmonic.

Thus the high-frequency gamma factor supplies scale separation but not sign
separation.  Any small-spacing proof must add a lower bound or a correlated
identity for the actual `F(a)`; standard absolute completed-zeta estimates
cannot do so.

## 5. A sharp quantitative sufficient target

For every odd integer `n>=1` and `0<=t<=pi/2`,

\[
 |\cos(nt)|\leq n\cos t.                           \tag{18}
\]

Apply (18) term by term in (3).  The exact harmonic-dominance condition

\[
 \boxed{F(a)\geq E_1(a)}                           \tag{19}
\]

implies

\[
 \mathcal D_a(t)\geq\cos t\{F(a)-E_1(a)\}\geq0
 \qquad(0\leq t\leq\pi/2).                       \tag{20}
\]

Combining (14) with (19) produces a concrete small-spacing lemma:

> If, for some `epsilon>0`, there are `A>=1` and a sufficiently large
> effective constant `C_epsilon` such that
> \[
> F(a)\geq C_\epsilon a^{4+\epsilon}e^{-3\pi a/2}
> \qquad(a\geq A),                                \tag{21}
> \]
> then
> \[
> D_\delta(r)\geq0
> \quad\left(0<\delta\leq{\pi\over4A},\quad
> 0\leq r\leq\delta/2\right).                     \tag{22}
> \]

The constant in (21) can be made explicit from any explicit version of the
standard zeta convexity and Stirling bounds.  Its important feature is the
exponential scale: the required lower bound is only at the third-harmonic
scale `exp(-3 pi a/2)`, whereas the natural upper envelope of the fundamental
is `exp(-pi a/2)`.

Condition (21) is still substantially stronger than mere positivity of `F`.
It is the precise quantitative input missing from a first-harmonic proof of
the small-spacing lattice sign.  This note does not prove (21) for the actual
Xi--Laguerre density.

## 6. Boundary-moment constraints

The half-cell boundary is always zero.  Put `x=pi/2-t`.  From (3),

\[
 \mathcal D_a(\pi/2-x)
 =\sum_{m\geq0}(-1)^mF((2m+1)a)
 \sin((2m+1)x).                                   \tag{23}
\]

For `j>=0`, define the absolutely convergent boundary moments

\[
 B_{2j+1}(a)=\sum_{m\geq0}(-1)^m(2m+1)^{2j+1}
 F((2m+1)a).                                      \tag{24}
\]

Then

\[
 \boxed{
 \mathcal D_a(\pi/2-x)
 =\sum_{j\geq0}{(-1)^jB_{2j+1}(a)\over(2j+1)!}
 x^{2j+1}.}                                       \tag{25}
\]

Half-cell positivity requires

\[
 \boxed{B_1(a)\geq0.}                             \tag{26}
\]

More generally, if `B_1,...,B_(2j-1)` vanish and `B_(2j+1)` is the first
nonzero boundary moment, then

\[
 (-1)^jB_{2j+1}(a)>0.                             \tag{27}
\]

These are genuine correlated odd-harmonic conditions.  The leading one is
the exact boundary-slope test already visible in direct space.  They explain
why even a proof of the scalar values `F(a)>=0` would not automatically prove
the stronger pointwise lattice statement.

## 7. Resulting route status

The small-spacing regime now has an exact classification of what is missing:

- it implies the high-frequency first Laguerre sign by (5)--(9);
- its full pointwise content also imposes the boundary correlations
  (24)--(27);
- completed-zeta decay makes every higher harmonic exponentially smaller in
  absolute terms, with the explicit scales (14)--(17);
- turning that scale separation into a sign requires the lower bound (21), or
  a source-specific correlated substitute that proves (19) directly.

No finite Taylor expansion, fixed-frequency truncation, or finite verified
band reaches this requirement.  A proof of (21) for the actual Xi profile
would close every sufficiently small half-cell.  Failure of (21), however,
would rule out only this coarse completed-zeta-envelope domination: the actual
`E_1(a)` may be smaller, and the exact condition (19) may still hold.  Such a
failure would not by itself refute `D_delta` or the first Laguerre sign.

## Nonclaims

- The note does not prove `F>=0` outside the published verified band.
- The additive estimate (17) is not a relative asymptotic and supplies no
  numerical sign at a spacing where `F(a)` is not independently bounded below.
- The boundary hierarchy is necessary, not asserted sufficient.
- The stronger pointwise lattice inequality is not claimed equivalent to the
  first Laguerre inequality for the actual theta kernel.
- Nothing here proves RH or turns a finite-frequency computation into an
  all-scale theorem.
