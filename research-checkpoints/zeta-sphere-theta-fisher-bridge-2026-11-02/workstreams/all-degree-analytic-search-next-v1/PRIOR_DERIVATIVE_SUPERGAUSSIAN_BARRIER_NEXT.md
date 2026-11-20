# A log-concave barrier and the large-degree orbit hazard

## Outcome and scope

The recurrence-aware complete-theta candidate

\[
 V_N^{\rm prior}=\operatorname {span}\{q_N',tq_N,q_{N-1}'\}
 \tag{1}
\]

is positive on every currently available theta rung.  This note proves a
strictly stronger source-free obstruction than positivity of one current
target: (1) can be negative even when the source is positive, even, entire,
Schwartz and log concave and when its **whole** target density is
nonnegative.  Hence positive Favard/Christoffel--Darboux geometry and target
positivity cannot prove the observed theta repair.

The countermodel is not the complete Jacobi theta source.  It does not
refute any theta certificate, determine the large-degree theta sign, or
prove or disprove RH.

## 1. A positive target at every degree still does not pay the score

Take

\[
 \boxed{W(t)=e^{-t^4}.}                                      \tag{2}
\]

This is positive, even, entire, Schwartz, and log concave.  Direct
differentiation gives

\[
 \boxed{
 \Lambda(t):=W'(t)^2-W(t)W''(t)
 =12t^2e^{-2t^4}\ge0.}                                     \tag{3}
\]

Thus the signed Galerkin functional is actually a positive measure at every
degree.  Put

\[
 J_k=\int_{\mathbb R}t^{2k}e^{-2t^4}\,dt
 ={1\over2}2^{-(2k+1)/4}\Gamma\!\left({2k+1\over4}\right).
 \tag{4}
\]

Its target moments are exactly `M_k=12J_(k+1)`.  For each parity let `q_N`
be the monic residual orthogonal to all old same-parity monomials in the
positive measure (3), and form (1) with the positive Gram measure
`W^2dt`.

Outward Arb evaluation of the gamma values and all correlated matrix
expressions proves

\[
\begin{array}{c|c|c|c}
 \kappa&\mathcal H_{V_N^{\rm prior}}&
 \mathcal H_{V_N^{\rm prior}}/\|q_N'W\|_2^2&
 \int q_N^2\Lambda\,dt\\ \hline
 7&<-0.0017001720616628005&<-0.0087932485829528729
   &>0.0154658065005875499\\
 8&<-0.0007401743213211818&<-0.0041092067865760788
   &>0.0079395064754054336.
\end{array}                                                 \tag{5}
\]

At both rungs the two-feature and three-feature Gram determinants are
strictly positive.  The inverse-free cleared numerators satisfy

\[
 N_3(7)<-1.2527151977547966\,10^{-10},\qquad
 N_3(8)<-9.3703222012014775\,10^{-12}.                     \tag{6}
\]

The new target moment is absent from each auxiliary construction.  It is
used in (5) only as an independent scope check; pointwise (3) already proves
every target norm positive.  Equations (3)--(6) establish

\[
 \boxed{
 \Lambda\ge0\text{ at all degrees, log concavity, and positive CD data}
 \not\Longrightarrow \mathcal H_{V_N^{\rm prior}}>0.}      \tag{7}
\]

This complements the polynomial-times-Gaussian countermodel in
`PRIOR_DERIVATIVE_SOURCE_FREE_COUNTERMODEL_20261103.md`: there the current
target is positive despite a signed density, whereas here the entire target
density and every target Hankel matrix are nonnegative.

## 2. The Gaussian limit has only a vanishing reserve

The solvable Gaussian shows why a coarse asymptotic comparison is
insufficient.  Let `W=e^(-t^2)`.  Then `Lambda=2W^2`, and the monic residual
`q_kappa` is the corresponding monic Hermite polynomial.  Its Appell and
three-term identities make `q_(kappa-2)'` score-orthogonal to the other two
channels.  Exact orthogonal-basis elimination gives, for every `kappa>=3`,

\[
 \boxed{
 {\mathcal H_{V_N^{\rm prior}}\over\|q_\kappa'W\|_2^2}
 ={1\over4\kappa}.}                                       \tag{8}
\]

For completeness, if `h_k=||q_kW||_2^2`, the Gaussian recurrence coefficient
is `a_k=k/4`.  In the ordered pair `(q_k',tq_k)`,

\[
 A=4kh_k,\quad E=kh_k,\quad
 D={2k+1\over4}h_k,\quad y=(0,(k+1)h_k)^T.
\]

Hence `y^T K^(-1)y-A=4h_k`, proving (8).  The predecessor derivative is an
orthogonal Hermite mode and adds zero gain.  The positive normalized margin
therefore decays like `1/kappa`; changing the smooth log-concave potential
from `t^2` to `t^4` already changes its sign in (5).  A theta asymptotic with
only `O(1)` relative control cannot transfer the Gaussian sign.

## 3. First-orbit dominance is not uniform in derivative order

There is a separate hazard in using the fixed-order complete-theta tail
estimates for `kappa` tending to infinity.  On the positive half-line write

\[
 \phi_n(h)=4z_n(2z_n-3)e^{h/2-z_n},\qquad
 z_n=\pi n^2e^{2h},\qquad \psi=\sum_{n\ge1}\phi_n.          \tag{9}
\]

The orbit scaling is an exact logarithmic translation:

\[
 \boxed{
 \phi_n(h)=n^{-1/2}\phi_1(h+\log n),\qquad
 \phi_n^{(j)}(h)=n^{-1/2}\phi_1^{(j)}(h+\log n).}          \tag{10}
\]

Consequently the sum of the diagonal orbit energies has the exact form

\[
 \boxed{
 \sum_{n\ge1}\int_0^\infty|\phi_n^{(j)}(h)|^2dh
 =\int_0^\infty|\phi_1^{(j)}(u)|^2
   H_{\lfloor e^u\rfloor}\,du,}                           \tag{11}
\]

where `H_m=sum_(n<=m)1/n`.  The complete norm also contains every cross-orbit
pair, so (11) is not a positivity estimate for it.  It does prove a useful
methodological point: the fixed-`j` first-orbit tail bounds are not a
uniform large-degree reduction.  As the derivative order grows, an
increasing set of translated arithmetic orbits enters before the square is
assembled.  Dropping their cross terms loses the same signed compensation
that the all-degree argument needs.

Fourier transforming (10) is the familiar source of the zeta factor.  Thus
a genuine large-degree analysis of (1) must retain the full Dirichlet/orbit
aggregate, not only the gamma envelope or the `n=1` saddle.

## 4. The narrowed analytic obligation

The countermodels and (8)--(11) leave one source-specific route.  A uniform
theta proof must control the correlated angle between the residual score and
the predecessor innovation using exact Jacobi orbit arithmetic.  In the
notation of `PRIOR_DERIVATIVE_SOURCE_FREE_COUNTERMODEL_20261103.md`, this is
the lower bound on

\[
 |\langle Z_\perp,J_\perp\rangle|^2
 -\|J_\perp\|^2
  \left({\|X\|^2\over4}-\|P_UZ\|^2\right),                \tag{12}
\]

with the full complete-theta orbit sum formed before estimating either
term.  An asymptotic version must be sharper than the shrinking reference
reserve in (8) and must include cross-orbit correlations exposed by (11).
Favard positivity, target positivity, log concavity, a gamma-envelope
approximation, or separate Cauchy bounds cannot supply (12).

This is a route reduction, not a proof of (12).  The actual all-degree sign
`N_prior(N,epsilon)>0` remains open.

## Reproduction

From the workstream directory run

```text
<arb-python> src/verify_prior_derivative_supergaussian_barrier.py \
  --output /tmp/prior_derivative_supergaussian_barrier.json \
  --precision-bits 384
```

Frozen SHA-256 values:

```text
verifier source
  aa7c35bb5f2a32087c98a9421d8493b0cef2d8f6efd80e5654dfb3fefa6d2f39
384-bit receipt
  b6465f43eb03fc3abfde15ebb680ffdc6837ed2f5fe12dc0ea40ae49adcbabfa
```

An independent 640-bit replay preserves every displayed digit and strict
sign.  The verifier evaluates two fixed gamma-moment matrices; it performs no
quadrature, degree sweep, theta-orbit truncation, or network access.
