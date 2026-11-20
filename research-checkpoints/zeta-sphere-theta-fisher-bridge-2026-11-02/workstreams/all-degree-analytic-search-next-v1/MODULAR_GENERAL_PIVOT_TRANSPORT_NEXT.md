# General modular pivot transport: exact coefficient cancellation and its first local obstruction

## Result and scope

The finite-`a` argument used for the raw `N=1` payment has an exact
arbitrary-finite-degree component.  Along the actual monic same-parity
residual path, all motion of the polynomial coefficients cancels from the
derivative of its raw signed pivot.  What remains is precisely the familiar
root-deletion energy of the polynomial at the current exponential tilt.

This gives a quantitative next-rung corollary (with the actual degree-three
residual defined by the already proved positive `H3` prefix):

\[
 \boxed{s_3(a)>{17^3\over4}s_0(a)
              >{14739\over200}a\qquad(a>0).}             \tag{1}
\]

It also isolates a sharp limitation.  The audited pointwise odd-`H5`
failure contains an explicit real-rooted quintic direction, so the
root-deletion source is not pointwise nonnegative for every real-rooted
polynomial.  Thus the degree-two curvature transport cannot become an
all-degree proof merely by repeating the same pointwise argument.  The
integrated derivative in the actual degree-five direction may still be
positive; no contrary claim is made.

## 1. Exact cancellation of coefficient motion

Fix `a>0`.  Let

\[
 g_a(u)=e^{au}\psi(u)
\]

and let `T_n(x,a)` be the actual monic degree-`n` same-parity Schur residual.
Assume its old same-parity signed block is invertible, as it is under the
positive-prefix hypothesis.  The entries of that block are analytic in `a`,
so its inverse and the coefficients of `T_n` are differentiable at every
such point.  Put

\[
 F=T_n(D,a)g_a,qquad K=T_n'(D,a)g_a,qquad
 L=T_n''(D,a)g_a,qquad
 s_n(a)=\int_{\mathbb R}uF^2\,du.                       \tag{2}
\]

A dot below differentiates only the coefficients of `T_n`.  Commuting the
polynomial operator past multiplication by `u` gives

\[
 \partial_aF=uF+K+\dot T_n(D,a)g_a.                     \tag{3}
\]

Because `T_n` is monic, `dot T_n` has degree at most `n-2` and the same
parity as `T_n`.  It therefore lies in the old same-parity span.  Actual
Schur stationarity gives

\[
 \int_{\mathbb R}uF\,\dot T_n(D,a)g_a\,du=0.           \tag{4}
\]

No derivative of an inverse or regression coefficient remains.  From
(2)--(4),

\[
 s_n'(a)=2\int_{\mathbb R}u^2F^2\,du
          +2\int_{\mathbb R}uFK\,du.                  \tag{5}
\]

The audited opposite-parity cross-Gram identity, applied to the polynomials
`T_n` and `T_n'`, gives

\[
 2\int_{\mathbb R}uFK\,du
 =-\int_{\mathbb R}K^2\,du-\int_{\mathbb R}FL\,du.   \tag{6}
\]

Hence the coefficient-free transport law is

\[
 \boxed{
 s_n'(a)=2\|uF\|_2^2-\|K\|_2^2-\langle F,L\rangle_2.} \tag{7}
\]

This is an exact identity at every regular positive-prefix point.  It does
not assume the sign of `s_n'` or of the next pivot.

## 2. Root-deletion form

Let `p_n(t,a)` be the corresponding real monic orthogonal polynomial, so

\[
 T_n(x,a)=i^n p_n(-ix,a).
\]

Positivity of the relevant full prefix (the two parity blocks, with zero
spectral cross-parity block) makes the roots
`rho_1,...,rho_n` of `p_n` real and simple.  If

\[
 q_j(t)={p_n(t)\over t-\rho_j},
\]

then the logarithmic derivative of `p_n` gives the polynomial identity

\[
 p_np_n''-(p_n')^2=-\sum_{j=1}^nq_j^2.                 \tag{8}
\]

Indeed,

\[
 \left({p_n'\over p_n}\right)'=-\sum_j(t-\rho_j)^{-2},
\]

and multiplication by `p_n^2` proves (8), including every quotient.  With
the Fourier normalization of `THETA_CURVATURE_PAYMENT.md`, equations
(7)--(8) and Parseval give

\[
 \boxed{
 s_n'(a)={h_{g_a}[p_n]\over2\pi}
 =2\|uT_n(D)g_a\|_2^2
  -\sum_{j=1}^n\|q_j(-iD)g_a\|_2^2.}                  \tag{9}
\]

Unit phases in the quotient features do not change their norms.  Formula
(9) explains both sides of the method:

- coefficient motion is harmless because it is killed by actual signed
  stationarity;
- the genuine difficulty is domination of the complete root-deletion sum,
  not control of coefficient derivatives.

For `n=1`, (9) is exactly

\[
 s_1'(a)=-\int u^2g_a^2(\log g_a)''\,du
         =\int u^2g_a^2v'\,du,                         \tag{10}
\]

which supplies the analytic `s_1>(17/2)s_0` bound used in the hardened
`N=1` payment.  For `n=2`, (9) is the quadratic curvature square used there.

## 3. Quantitative cubic transport

The next odd polynomial has the form

\[
 p(t)=t^3-\alpha t.
\]

Write

\[
 X=-\ell'',\qquad Y=\ell^{(4)},\qquad Z=-\ell^{(6)},
 \qquad \ell=\log\psi,
\]

and

\[
 B=Y+6X^2,qquad D=Z+30XY+60X^3,qquad P=XD-B^2.       \tag{11}
\]

The local moments in the audited quadratic-family normalization are

\[
 g_1={X\over2},\qquad g_2={B\over8},\qquad
 g_3={D\over32}.                                       \tag{12}
\]

For every real `alpha`, exact completion of the local cubic source gives

\[
\begin{aligned}
 g_3-2\alpha g_2+\alpha^2g_1
 &=g_1\left(\alpha-{g_2\over g_1}\right)^2
   +\left(g_3-{g_2^2\over g_1}\right),\\
 g_3-{g_2^2\over g_1}&={P\over32X}.                    \tag{13}
\end{aligned}
\]

The independently audited complete-theta `H3` theorem proves pointwise

\[
 X>17,qquad P>8X^4.                                    \tag{14}
\]

The tilt changes only the positive spatial weight:

\[
 (\log g_a)^{(j)}=\ell^{(j)}\qquad(j\geq2).             \tag{15}
\]

In this normalization the local quadratic form in (13) is the integrand of
`h[p_3]/(4 pi)` after the positive factor `u^2g_a^2` is removed.
Therefore (13)--(15), for the actual inverse-selected `alpha(a)`, imply

\[
 {h_{g_a}[p_3]\over4\pi}
 >\int_{\mathbb R}u^2g_a^2{X^3\over4}\,du.            \tag{16}
\]

Using (9), (16), and

\[
 s_0'(a)=2\int_{\mathbb R}u^2g_a^2\,du,
\]

gives

\[
 s_3'(a)>{17^3\over4}s_0'(a).                          \tag{17}
\]

Each raw bridge moment is an analytic odd function of `a`; after division by
`a`, the degree-three old block and target column extend analytically to
`a=0`.  The audited positive `H3` limit keeps that old block invertible, so
the inverse-selected coefficient `alpha(a)` and `T_3` also extend
analytically.  The raw pivots `s_0,s_3` vanish at zero by parity.  Thus (17)
can be integrated from zero and proves the first inequality in (1).  The
independently frozen integrated-square receipt gives

\[
 {s_0(a)\over a}\geq
 4\int_0^\infty u^2\psi(u)^2\,du
 =2\int_{\mathbb R}u^2\psi(u)^2\,du>{3\over50},
\]

which proves the second inequality.  This is a raw-pivot reserve, not yet a
payment of the full `N=2` modular defect.

## 4. A real-rooted pointwise obstruction at degree five

The pointwise Bell-fiber moments at `u=0` are denoted `mu_0,...,mu_5` in the
audited `H5` obstruction.  Its odd matrix is

\[
 M_5=(\mu_{i+j+1})_{i,j=0}^2.                           \tag{18}
\]

The frozen full-theta interval enclosure gives, for the integer vector

\[
 w=(10847,-263,1)^T,
\]

the rigorous upper bound

\[
 \boxed{w^TM_5w<-1,493,000,000.}                        \tag{19}
\]

This negative direction is not an arbitrary non-real-rooted polynomial.
For an odd polynomial `p(t)=z_0t+z_1t^3+z_2t^5`, the local source in
`h[p]/(4 pi)` has moments `g_j=mu_j/4^j`.  Its matrix, including the positive
factor `psi(0)^2`, is the positive diagonal congruence

\[
 (c_{i+j+1})={\psi(0)^2\over4}
 \operatorname {diag}(1,4^{-1},4^{-2})
 M_5
 \operatorname {diag}(1,4^{-1},4^{-2}).                \tag{20}
\]

Thus (19) corresponds to

\[
 p_*(t)=16t^5-1052t^3+10847t.                          \tag{21}
\]

Putting `y=t^2`, the nonzero roots satisfy

\[
 16y^2-1052y+10847=0.
\]

Its discriminant is

\[
 1052^2-64\cdot10847=412496=16\cdot25781>0,            \tag{22}
\]

while its root sum and product are positive.  Hence both `y` roots are
distinct and positive, and `p_*` has five distinct real roots.

Dividing (21) by `16` makes it monic without changing the sign of its
quadratic source.  Equations (19)--(22) therefore prove that the pointwise
root-deletion source can be negative even inside the monic real-rooted
quintic family.  Continuity makes it negative on a punctured neighborhood of
the center after multiplication by `u^2`.  Exponential tilt does not change
the logarithmic-derivative matrix, only its positive spatial weight.

This is a route obstruction, not an integrated counterexample.  The spatial
factor `u^2` vanishes at the center, positive regions may compensate the
negative neighborhood, and the actual inverse-selected `p_5(a)` need not be
the particular polynomial (21).  Thus neither `s_5'(a)<0`, pivot failure,
nor any RH consequence follows.

## 5. Consequence

The coefficient-motion question has a clean answer: it cancels exactly at
every regular rung.  The remaining general theorem is an integrated
root-deletion inequality for the one actual inverse-selected direction.
Pointwise PSD of every local source matrix cannot supply it, even after
restricting to all real-rooted polynomials.  Any degree-uniform continuation
must use integrated/regional compensation or additional arithmetic
structure.

No finite sweep, higher-degree modular payment, all-degree Xi--Laguerre
inequality, or RH statement is claimed.
