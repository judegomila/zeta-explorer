# Super-Gaussian decay does not pay the transport correction

## Scope and result

This note tests the one conspicuous feature missing from the Gaussian
countermodel in `CORRELATED_THETA_INEQUALITY_AUDIT_NEXT.md`: the
double-exponential real-space decay of the complete-theta source.  The test
is analytic and all-degree; it is not a finite sweep.

The outcome is a countermodel to any source-free argument based only on
evenness, positivity, uniform strong log concavity, theta-scale
super-Gaussian decay, and the natural imaginary-shift strip.  More precisely,
there are positive even entire sources with

\[
 \log\psi(h)\sim-\pi e^{2|h|},
 \qquad (\log\psi)''\leq-C
\]

for arbitrarily large `C`, for which the spectral Turan density is negative
on an open interval.  Their target exponential kernel is therefore negative
on some finite derivative direction: on that direction the indefinite
transport correction overwhelms the automatic positive Gram term.

This does **not** show that the correction fails on an actual complete-theta
Galerkin residual.  The countermodel has no Jacobi-orbit arithmetic, no
modular/Ewald identity, and not the exact polynomial prefactor of the first
theta orbit.  It shows that the qualitative tail, even with its leading
coefficient and the same maximal open double-exponential shift strip, cannot
by itself control the actual residual.  No first-Laguerre sign, RH result, or
complete-theta positivity theorem is claimed.

## 1. The exact transport identity and its domain

Let `psi` be a real even entire source whose horizontal translates are
square integrable for

\[
             |\operatorname{Im}h|<\frac\pi4,
\]

and use the Fourier convention

\[
             F(t)=\widehat\psi(t)
                 =\int_{\mathbb R}\psi(h)e^{-iht}\,dh.
\]

For real `z` with `|z|<pi/2`, put

\[
 M(z)=\int_{\mathbb R}h^2
       \psi(h+iz/2)\psi(h-iz/2)\,dh.             \tag{1}
\]

For real `x,y` with `|x|,|y|<pi/2`, let

\[
 \begin{aligned}
 G(x,y)&=\int_{\mathbb R}h^2
       \psi(h+ix/2)\psi(h-iy/2)\,dh,\\
 K_{\exp}(x,y)&=M((x+y)/2),
 \qquad s={x+y\over2}.
 \end{aligned}                                    \tag{2}
\]

The matrix of `G` at any finite set of real nodes is a Hilbert Gram.  Contour
translation inside the stated open strip and Parseval give

\[
 \begin{aligned}
 G(x,y)&={1\over2\pi}\int_{\mathbb R}e^{-st}
 \left\{F'(t)^2-{x^2+y^2\over8}F(t)^2\right\}dt,\\
 K_{\exp}(x,y)&={1\over2\pi}\int_{\mathbb R}e^{-st}
 \left\{F'(t)^2-{(x+y)^2\over16}F(t)^2\right\}dt.
 \end{aligned}                                    \tag{3}
\]

Thus the unpaid transport term is exactly

\[
 \boxed{
 K_{\exp}(x,y)-G(x,y)
 =(x-y)^2L((x+y)/2),}
 \qquad
 L(s)={1\over32\pi}\int_{\mathbb R}e^{-st}F(t)^2dt>0.       \tag{4}
\]

Although its scalar factor is positive, the correction in (4) is an
indefinite kernel: at two distinct nodes its matrix has zero diagonal and
positive off-diagonal entries.  Tail decay justifies (1)--(4) and supplies
absolute bounds; it does not change this algebraic inertia.

Define

\[
 {\cal T}[F]=F'^2-FF'',
 \qquad f_\psi={1\over4}{\cal T}[F].              \tag{5}
\]

Two integrations by parts, still on `|z|<pi/2`, give

\[
 M(z)={1\over\pi}\int_{\mathbb R}f_\psi(t)e^{-zt}dt,
 \qquad
 K_{\exp}(x,y)={1\over\pi}\int_{\mathbb R}f_\psi(t)
                  e^{-xt/2}e^{-yt/2}dt.           \tag{6}
\]

Consequently a structural tail theorem controlling (4) on every derivative
direction would force `f_psi>=0`.  The construction below violates that
conclusion while retaining the proposed tail hypotheses.

## 2. A negative seed with quantitative log concavity

Start with the positive even Gaussian mixture

\[
 \psi_G(h)={e^{-h^2/4}\over2\sqrt\pi}
       +{e^3e^{-h^2/16}\over4\sqrt\pi},
 \qquad
 F_G(t)=e^{-t^2}+e^3e^{-4t^2}.                    \tag{7}
\]

At `t=1`, direct differentiation gives

\[
 F_G(1)={2\over e},\qquad F_G'(1)=-{10\over e},
 \qquad F_G''(1)={58\over e},
\]

and hence

\[
                  {\cal T}[F_G](1)=-{16\over e^2}<0.       \tag{8}
\]

This source is uniformly strictly log concave.  Indeed, set
`a=1/4`, `b=1/16`, `delta=3/16`, `r=e^3/2`, and

\[
                 p(h)={1\over1+r e^{\delta h^2}}.
\]

Then

\[
 (\log\psi_G)''=-2(b+\delta p)
                   +4\delta^2h^2p(1-p)
 \leq-{1\over8}+{3\over2e^4}=-c_0<0.             \tag{9}
\]

The last inequality uses
`p<=r^(-1)exp(-delta h^2)` and
`h^2 exp(-delta h^2)<=1/(e delta)`.

## 3. Adding the complete-theta-scale tail

Fix any `epsilon>0` and define

\[
 \chi_\epsilon(h)=
       \exp\{-\epsilon(\cosh(2h)-1)\},
 \qquad
 \psi_{\lambda,\epsilon}(h)
       =\psi_G(\lambda h)\chi_\epsilon(h),        \tag{10}
\]

where `lambda>0`.  This source is positive, even, entire, and Schwartz.  Its
log curvature obeys the global estimate

\[
 \begin{aligned}
 (\log\psi_{\lambda,\epsilon})''(h)
 &=\lambda^2(\log\psi_G)''(\lambda h)
       -4\epsilon\cosh(2h)\\
 &\leq-\lambda^2c_0-4\epsilon.                   \tag{11}
 \end{aligned}
\]

Thus the strong log-concavity constant can be made arbitrarily large.
Moreover the broad Gaussian term in (7) is only quadratic in the logarithm,
so

\[
 \boxed{
 \lim_{|h|\to\infty}e^{-2|h|}
       \log\psi_{\lambda,\epsilon}(h)
       =-{\epsilon\over2}.}                      \tag{12}
\]

In particular, choosing

\[
                         \epsilon=2\pi            \tag{13}
\]

gives the same leading real-space exponent
`-pi exp(2|h|)` as the first complete-theta orbit.  It does not reproduce the
orbit's subleading polynomial/exponential prefactor.

The imaginary-shift domain also matches the one used in (1).  For real `u,v`,

\[
 \operatorname{Re}\cosh(2(u+iv))
       =\cosh(2u)\cos(2v).                        \tag{14}
\]

Therefore every horizontal translate with `|v|<pi/4` retains
double-exponential decay; immediately beyond that connected band the cutoff
grows double exponentially along some horizontal lines.  Contour translation
and all integrations in (1)--(6) are justified on the open domains

\[
 |z|<\pi/2,
 \qquad |x|<\pi/2,
 \qquad |y|<\pi/2.                               \tag{15}
\]

No claim at or beyond the boundary is needed.

## 4. The negative Turan value survives the tail

It remains to show that the cutoff in (10) does not repair (8).  This can be
done for every fixed `epsilon>0`, including the theta-matched value (13), by
concentrating the seed.

Let `F_{lambda,epsilon}` be the Fourier transform of
`psi_{lambda,epsilon}` and, after the change of variable `u=lambda h`, put

\[
 H_{\lambda,\epsilon}(\tau)
 =\int_{\mathbb R}\psi_G(u)
   \exp\{-\epsilon(\cosh(2u/\lambda)-1)\}e^{-i\tau u}\,du.
                                                               \tag{16}
\]

Then

\[
 F_{\lambda,\epsilon}(\lambda\tau)
       ={1\over\lambda}H_{\lambda,\epsilon}(\tau),
 \qquad
 F_{\lambda,\epsilon}^{(j)}(\lambda\tau)
       ={1\over\lambda^{j+1}}
          H_{\lambda,\epsilon}^{(j)}(\tau).       \tag{17}
\]

The cutoff in (16) lies in `(0,1]` and tends pointwise to one as
`lambda` tends to infinity.  For `j=0,1,2`, the integrable majorant
`|u|^j psi_G(u)` permits dominated convergence.  In fact the corresponding
weighted `L1` convergence makes the first two Fourier derivatives converge
uniformly in real `tau`:

\[
 H_{\lambda,\epsilon}^{(j)}(\tau)
       \longrightarrow F_G^{(j)}(\tau),
 \qquad j=0,1,2.                                  \tag{18}
\]

Combining (8), (17), and (18) gives

\[
 \lambda^4{\cal T}[F_{\lambda,\epsilon}](\lambda)
 ={\cal T}[H_{\lambda,\epsilon}](1)
 \longrightarrow-{16\over e^2}.                 \tag{19}
\]

Hence, for every fixed positive `epsilon`, all sufficiently large `lambda`
satisfy

\[
             f_{\psi_{\lambda,\epsilon}}(\lambda)<0.       \tag{20}
\]

This is an open-interval failure by continuity, not a floating-point sample.
Equations (11)--(13) and (20) establish simultaneously arbitrary strong log
concavity, complete-theta-scale super-Gaussian decay, and a negative spectral
Turan density.

## 5. A finite transport direction must fail

For the source (10), contour translation to every closed substrip of (15)
gives an exponential moment for `|f_psi(t)|dt`.  Polynomials are therefore
dense in `L2(|f_psi|dt)`.  Since (20) holds on an open interval, there is a
finite polynomial `P` such that

\[
             {1\over\pi}\int_{\mathbb R}
                    f_\psi(t)P(t)^2dt<0.          \tag{21}
\]

Equivalently, coalescing the nodes in (6), a finite derivative/Hankel
direction has negative `K_exp` quadratic form.  On that same direction the
`G` form is nonnegative, so (4) implies the sharp qualitative conclusion

\[
 \boxed{
 \text{the transport correction is negative on that direction and its
 magnitude exceeds the positive Gram contribution.}}          \tag{22}
\]

This existence argument is all-degree and does not identify a numerical
degree.  It is exactly what a tail-only coercive inequality would forbid.

## 6. What remains genuinely theta-specific

The countermodel separates the source-free and arithmetic content cleanly.
It preserves:

1. positivity, evenness, and entire real analyticity of the real-space
   source;
2. arbitrarily strong uniform log concavity;
3. the leading complete-theta tail `-pi exp(2|h|)`;
4. the natural horizontal-shift strip `|Im h|<pi/4` and the induced
   `|z|<pi/2` transport calculus; and
5. the exact Bell/Parseval identities (1)--(6).

It does not preserve:

1. the theta sum over `pi n^2` or any termwise orbit sign;
2. modular reflection and the associated all-index Ewald compensation;
3. the exact first-orbit polynomial prefactor; or
4. the actual degree-dependent Galerkin residual.

Accordingly, super-Gaussian decay can still be useful for making a
theta-specific compensation rigorous, but it cannot be the sign mechanism
by itself.  A surviving noncircular route must insert orbit arithmetic before
estimating (4): for example, pair the correction with the complete modular
orbit sum on the one actual residual direction and use the tail only to close
the exterior remainder.  Replacing that arithmetic step by a generic
tail/log-concavity bound is ruled out by (10)--(22).
