# Imaginary-shift Gram positivity versus the correlated theta target

## Scope and outcome

This note audits a tempting way to turn the complete-theta imaginary-shift
norm into the missing all-degree Hankel sign.  It keeps the two-variable
polarization exact instead of differentiating or estimating its terms
separately.

There are four conclusions.

1. The exponential generating function of the integrated Bell moments is an
   unconditionally positive imaginary-shift norm.
2. The automatically positive Hilbert Gram obtained by polarizing that norm
   is not the Hankel/exponentially-convex kernel required by the target.  The
   two kernels differ by one explicit, indefinite polynomial-transport
   kernel.
3. Positivity of the target kernel on any real neighborhood of the origin is
   equivalent to the full first Xi--Laguerre sign.  Thus an unspecified
   positive-kernel completion is circular; a useful result must control the
   explicit transport correction on the actual degree-dependent residual.
4. A scaled positive even Gaussian mixture preserves formal Bell calculus,
   arbitrary strong log concavity, reflection symmetry, and a nontrivial heat
   interval while its spectral Turan density is negative.  Those structural
   properties alone cannot prove the correlated inequality.  The model is not
   the complete theta source and does not preserve its orbit arithmetic or
   super-Gaussian real-space tail.

No first-Laguerre sign, all-degree positivity theorem, or RH result is
claimed.

## 1. The exact imaginary-shift norm

Use the campaign Fourier convention

\[
 \widehat\psi(t)=F(t)=2\Xi(t)
\]

and the Bell fibers

\[
 c_k(h)={(-1)^k\over4^k}
 \left.\partial_a^{2k}\{\psi(h-a)\psi(h+a)\}\right|_{a=0}.
                                                        \tag{1}
\]

The integrated moments used by the two parity Hankel ladders are

\[
 m_k=2\int_0^\infty h^2c_k(h)\,dh
    =\int_{\mathbb R}h^2c_k(h)\,dh.                    \tag{2}
\]

For real `z` with `abs(z)<pi/2`, Taylor expansion at the imaginary shift is
absolutely integrable and gives

\[
 \sum_{k\geq0}c_k(h){z^{2k}\over(2k)!}
 =\psi(h-iz/2)\psi(h+iz/2).
\]

Consequently

\[
 \boxed{
 M(z):=\sum_{k\geq0}m_k{z^{2k}\over(2k)!}
 =\int_{\mathbb R}h^2\lvert\psi(h+iz/2)\rvert^2dh>0.} \tag{3}
\]

The open strip is the natural one here: `F` and its derivatives have an
`exp(-pi abs(t)/4)` factor, so the squared Fourier integrands converge for
`abs(Re z)<pi/2`.  Every identity below may equivalently be read on an
arbitrary closed substrip.

The Fourier transform of `psi(h+iz/2)` is `exp(-zt/2)F(t)`.  Parseval and one
integration by parts therefore give

\[
 \begin{aligned}
 M(z)
 &= {1\over2\pi}\int_{\mathbb R}e^{-zt}
       \{F'(t)-zF(t)/2\}^2dt\\
 &= {1\over2\pi}\int_{\mathbb R}e^{-zt}
       \{F'(t)^2-z^2F(t)^2/4\}dt.                 \tag{4}
 \end{aligned}
\]

With

\[
 f(t)=\Xi'(t)^2-\Xi(t)\Xi''(t)
     ={F'(t)^2-F(t)F''(t)\over4},                 \tag{5}
\]

a second integration by parts yields the exact signed Laplace representation

\[
 \boxed{M(z)={1\over\pi}\int_{\mathbb R}f(t)e^{-zt}dt
             ={1\over\pi}\int_{\mathbb R}f(t)\cosh(zt)dt.} \tag{6}
\]

Thus (3) proves positivity of the bilateral Laplace transform of `f`, not
positivity of `f` and not positivity of its derivative Hankel matrices.

## 2. Exact polarization and the transport defect

For real `x,y` with `abs(x),abs(y)<pi/2`, define the automatic Hilbert Gram

\[
 G(x,y)=\int_{\mathbb R}h^2
   \psi(h+ix/2)\psi(h-iy/2)\,dh.                  \tag{7}
\]

Every finite matrix `(G(x_i,x_j))` is positive semidefinite.  Put
`s=(x+y)/2`.  Applying Parseval to the two distinct shifts gives

\[
 G(x,y)={1\over2\pi}\int_{\mathbb R}e^{-st}
 \{F'-xF/2\}\{F'-yF/2\}\,dt
\]

and hence, after integrating the cross term,

\[
 G(x,y)={1\over2\pi}\int_{\mathbb R}e^{-st}
 \left\{F'^2-{x^2+y^2\over8}F^2\right\}dt.       \tag{8}
\]

The target exponential-Hankel kernel is instead

\[
 K(x,y)=M((x+y)/2)
 ={1\over2\pi}\int_{\mathbb R}e^{-st}
 \left\{F'^2-{(x+y)^2\over16}F^2\right\}dt.      \tag{9}
\]

Subtracting (8) from (9) gives the exact correlated identity

\[
 \boxed{
 K(x,y)=G(x,y)+(x-y)^2L((x+y)/2),}
 \qquad
 L(s)={1\over32\pi}\int_{\mathbb R}e^{-st}F(t)^2dt>0. \tag{10}
\]

The correction in (10) is not a positive kernel.  For two distinct nodes
its matrix has zero diagonal and a strictly positive off-diagonal entry, so
it has one positive and one negative eigenvalue.  Pointwise positivity of the
correction therefore cannot be added to Gram positivity.  Already at two
nodes the required statement is the genuinely correlated bound

\[
 \{G(x,y)+(x-y)^2L(s)\}^2\leq M(x)M(y),           \tag{11}
\]

not separate upper bounds for `G` and `L`.

Equation (10) is the finite-shift form of the polynomial-transport curvature
left unpaid by complex-shift subharmonicity.  Coalescing nodes and applying
the derivative functional belonging to one actual Galerkin residual recovers
the corresponding finite Hankel pivot.  It therefore identifies a legitimate
degree-dependent target: prove (10) is nonnegative only on that actual
residual direction using complete-theta orbit arithmetic.  Asking for all
directions at once is the original endpoint problem.

## 3. Full kernel positivity is target-equivalent

From (6),

\[
 K(x,y)={1\over\pi}\int_{\mathbb R}f(t)
                e^{-xt/2}e^{-yt/2}dt.             \tag{12}
\]

Hence `f>=0` implies that `K` is positive semidefinite.  Conversely, suppose
`K` is positive semidefinite for every finite set of real nodes in some open
interval containing zero.  Coalescing the nodes shows that every derivative
Gram at the origin is positive semidefinite.  After the harmless diagonal
sign and power-of-two congruences, its even and odd blocks are precisely

\[
 (m_{i+j})_{i,j=0}^n,
 \qquad (m_{i+j+1})_{i,j=0}^n.                    \tag{13}
\]

The exponential moment in the strip makes polynomials dense in
`L2(abs(f(t))dt)`.  Positivity of either complete parity ladder then excludes
an open set on which the continuous density `f` is negative.  Therefore

\[
 \boxed{
 K\text{ is positive semidefinite on a real neighborhood}
 \quad\Longleftrightarrow\quad f(t)\geq0
 \text{ for every real }t.}                       \tag{14}
\]

Thus a Hilbert-space factorization of the whole `K`, an exponentially convex
proof for `M`, or an all-direction domination of the correction in (10) is
not an upstream lemma.  It is equivalent to the missing first Xi--Laguerre
sign.  A noncircular continuation must be residual/degree dependent or must
derive a new arithmetic sign for the assembled transport term.

## 4. A strong source-free countermodel

The gap between (3) and (14) survives considerably more structure than
positivity and evenness.  Let

\[
 \psi_G(h)={e^{-h^2/4}\over2\sqrt\pi}
       +{e^3e^{-h^2/16}\over4\sqrt\pi},
 \qquad
 F_G(t)=e^{-t^2}+e^3e^{-4t^2}.                    \tag{15}
\]

This is a positive even analytic Schwartz profile with the same formal Bell
calculus as (1).  Write
`mathcal T[F]=F'^2-FF''`. At `t=1`,

\[
 F_G(1)={2\over e},\qquad F_G'(1)=-{10\over e},
 \qquad F_G''(1)={58\over e},
\]

and hence

\[
 F_G'(1)^2-F_G(1)F_G''(1)=-{16\over e^2}<0.       \tag{16}
\]

The model is also uniformly strictly log concave.  Write
`a=1/4`, `b=1/16`, `delta=a-b=3/16`,
`r=e^3/2`, and

\[
 p(h)={1\over1+r e^{\delta h^2}}.
\]

Direct differentiation gives

\[
 (\log\psi_G)''
 =-2\{b+\delta p\}+4\delta^2h^2p(1-p).            \tag{17}
\]

Since `p<=r^(-1)exp(-delta h^2)` and
`h^2exp(-delta h^2)<=1/(e delta)`, one obtains

\[
 (\log\psi_G)''
 \leq-{1\over8}+{3\over2e^4}=-c_0<0.             \tag{18}
\]

For `lambda>0` and `psi_lambda(h)=psi_G(lambda h)`, the log-curvature upper bound becomes
`-lambda^2 c_0`, while

\[
 \widehat\psi_\lambda(t)=\lambda^{-1}F_G(t/\lambda),
 \qquad
 \mathcal T[\widehat\psi_\lambda](\lambda)
 =-{16\over e^2\lambda^4}<0.                     \tag{19}
\]

Choosing `lambda^2 c_0>17` therefore matches even the campaign's strong
source-free log-concavity bound while retaining a negative spectral Turan
value.

The obstruction is stable under a genuine heat interval.  Put

\[
 F_{\lambda,\tau}(t)=e^{-\tau t^2}
                      \widehat\psi_\lambda(t).
\]

For any differentiable `F`,

\[
 \mathcal T[e^{-\tau t^2}F]
 =e^{-2\tau t^2}\{\mathcal T[F]+2\tau F^2\}.     \tag{20}
\]

Using (19) and `widehat psi_lambda(lambda)=2/(e lambda)` shows

\[
 \mathcal T[F_{\lambda,\tau}](\lambda)
 ={8e^{-2\tau\lambda^2}\over e^2\lambda^4}
   (\tau\lambda^2-2)<0
 \quad(0\leq\tau<2/\lambda^2).                   \tag{21}
\]

On the source side this heat multiplier is convolution with a positive
Gaussian.  Positivity, evenness, and log concavity persist.  Thus reflection
symmetry, strong log concavity, formal Bell recurrences, and heat-semigroup
structure do not control the correction in (10).

The model is deliberately source-free.  Its real-space tail is Gaussian,
not the super-Gaussian complete-theta tail, and it has no Jacobi-orbit or
Euler/Ewald arithmetic.  It cannot refute a theorem that uses those missing
features, and it is not a Xi counterexample.

## 5. Surviving analytic obligation

The automatic imaginary-shift Gram can still be useful, but only in the
assembled identity (10).  A genuinely new theta lemma must do one of the
following without assuming (14):

1. dominate the indefinite transport correction on the one actual
   degree-`N` residual direction;
2. pair that correction with an all-index modular/Ewald compensation before
   taking derivatives; or
3. produce a complete-theta orbit identity for the newest Bell coefficient
   that supplies exactly the missing coalesced-node margin.

Ordinary Cauchy--Schwarz applied to `G`, pointwise positivity of `M`, or a
source-free heat/log-concavity argument cannot provide this margin.  Finite
node checks would be falsifiers for a proposed identity, not a proof of the
all-degree sign.
