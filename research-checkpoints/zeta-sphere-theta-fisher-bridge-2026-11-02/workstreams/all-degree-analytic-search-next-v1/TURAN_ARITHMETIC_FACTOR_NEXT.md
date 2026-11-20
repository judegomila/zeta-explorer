# Translation-covariant theta factors are saturated by the Turan sign

## Scope and outcome

This note asks whether the complete-theta Turan profile admits a positive or
contractive factorization that survives the known pointwise-graph,
orbit-packet, `PF_5`, and generic-covariance obstructions.  It gives one broad
route classification and one exact complex-shift identity.

1. The signed autocorrelation of the complete theta source can be assembled
   into one positive two-channel feature and one negative channel.  A
   contraction between their full derivative-cyclic spaces exists if and only
   if the first Xi Laguerre density is nonnegative on the real line.  The same
   equivalence already follows from either complete parity ladder.  Thus a
   degree-independent translation-intertwining factor has no hidden reserve.
2. The tilted complete-theta autocorrelations are positive definite for every
   tilt, but their Loewner curvature at zero is exactly the missing Turan
   profile.  Membership of every tilt in the positive cone, pointwise
   convexity, and absolute-convergence arithmetic away from the critical line
   do not sign that curvature.
3. A Hilbert-valued complex-shift calculation shows precisely why ordinary
   Hardy/three-lines convexity does not repair polynomial multipliers.  The
   real shift curvature is the desired quadratic form, while the orthogonal
   imaginary curvature is the polynomial-transport cost.  Subharmonicity
   controls only their sum.

Consequently a viable factorization must break at least one of the saturated
features: it must be degree/residual dependent, non-translation-invariant, or
retain an arithmetic regional/Ewald compensation not expressible as a
universal channel contraction.  No first Laguerre sign, all-degree pivot, or
RH result is proved.

## 1. The exact complete-theta channel pair

Use

\[
 W(t)=\widehat\psi(t)=\int_{\mathbb R}\psi(h)e^{-ith}\,dh
 =2\Xi(t).                                                   \tag{1}
\]

The complete-theta profile and all polynomial multiples and derivatives used
below are Schwartz.  Put

\[
 \mathcal A_1(h)=2h\psi(h),\qquad
 \mathcal A_2(h)=(1+h^2)\psi(h),\qquad
 \mathcal B(h)=(1-h^2)\psi(h).                               \tag{2}
\]

For a real fixed-parity polynomial `p`, let

\[
 \mathbf A p=
 \binom{p(D)\mathcal A_1}{p(D)\mathcal A_2},
 \qquad Bp=p(D)\mathcal B,\qquad D={d\over dh}.              \tag{3}
\]

The Fourier transforms of the three source channels are

\[
 \widehat{\mathcal A_1}=2iW',\qquad
 \widehat{\mathcal A_2}=W-W'',\qquad
 \widehat{\mathcal B}=W+W''.                                \tag{4}
\]

Therefore

\[
 \begin{aligned}
 |2iW'|^2+|W-W''|^2-|W+W''|^2
 &=4\{W'^2-WW''\}\\
 &=16\{\Xi'^2-\Xi\Xi''\}.
 \end{aligned}                                               \tag{5}
\]

With the campaign normalization

\[
 \mathfrak q[p]={1\over\pi}\int_{\mathbb R}
 |p(it)|^2\{\Xi'^2-\Xi\Xi''\}\,dt,                         \tag{6}
\]

Plancherel gives the exact combined-channel identity

\[
 \boxed{
 \|\mathbf A p\|_{L^2\oplus L^2}^2-\|Bp\|_{L^2}^2
 =8\mathfrak q[p].}                                           \tag{7}
\]

This is the same complete-theta signed autocorrelation as in
`TURAN_PD_ROUTE_NEXT.md`, but (7) is arranged as one proposed contraction.
No raw orbit, positive/negative regional split, or regression term has been
estimated separately.

## 2. Universal contractive factorization is target-equivalent

Fix either complete parity ladder `P^epsilon`.  On the algebraic cyclic range
of `mathbf A`, define

\[
 T_0(\mathbf A p)=Bp,
 \qquad p\in\mathcal P^\epsilon.                            \tag{8}
\]

This rule is well defined.  Indeed, if `mathbf A p=0`, then on every real
interval avoiding the finitely many zeros of `p(it)` one has both `W'=0` and
`W-W''=0`.  Analytic continuation would make `W` constant and simultaneously
equal to its second derivative, hence zero, contradicting `W=2Xi`.

Equation (7) immediately gives

\[
 \boxed{
 T_0\text{ is contractive on the full parity cyclic range}
 \quad\Longleftrightarrow\quad
 \mathfrak q[p]\geq0\text{ for every }p\in\mathcal P^\epsilon.} \tag{9}
\]

The right side of (9) is already the pointwise first-Laguerre sign.  Here is
the domain argument, included to rule out a hidden moment gap.  The even
function

\[
 G(t)=\Xi'(t)^2-\Xi(t)\Xi''(t)                              \tag{10}
\]

is continuous and has an exponential real-axis envelope, as do its
derivatives.  The even measure `abs(G(t))dt` therefore has a finite
exponential moment in `abs(t)`.  Its Hamburger moment problem is determinate,
so ordinary polynomials are dense in `L^2(abs(G(t))dt)`; symmetrizing the
approximants gives density of polynomials in `t^2` in the even subspace.
If `G` were negative on an open interval, an even continuous function
supported in that interval and its reflection could be approximated in this
weighted space by a polynomial in `t^2`.  Passing to squared norms would
contradict the even-ladder inequality in (9).  The odd ladder gives the same
conclusion after multiplying by `t`; a negative interval can always be chosen
away from the single point `t=0`.  Thus

\[
 \boxed{
 \mathfrak q[p]\geq0\text{ on either full parity ladder}
 \quad\Longleftrightarrow\quad G(t)\geq0
 \text{ for every real }t.}                                  \tag{11}
\]

If (9) holds, `T_0` extends uniquely to a contraction on the closure of the
cyclic range.  It also intertwines the derivative action on its polynomial
core:

\[
 T_0\{\mathbf A(zp)\}=B(zp).
\]

Conversely, any proposed degree-independent contractive intertwiner with
this action restricts to (8) and therefore proves (11).  Calling the target a
theta channel contraction, a translation-covariant dilation, or a cyclic
Hilbert factor does not weaken it.

This theorem does not rule out a contraction on one actual residual direction
at each degree.  Such a contraction is necessarily degree dependent and must
use the regression/mismatch arithmetic that the universal cyclic rule omits.

## 3. Tilted autocorrelations and the exact Loewner curvature

For real `a`, put

\[
 g_a(h)=e^{ah}\psi(h),\qquad
 C_a(v)=\int_{\mathbb R}e^{2ah}
 \psi(h-v)\psi(h+v)\,dh.                                    \tag{12}
\]

Every `C_a` is a positive-definite autocorrelation.  Direct scaling of the
Fourier transform gives

\[
 \widehat C_a(2t)=2|\Xi(t+ia)|^2.                           \tag{13}
\]

The integrand in (12) is even in `h`, so `C_a=C_(-a)` and
`C_a(v)>=C_0(v)` pointwise.  Differentiation under the integral is harmless,
and the conditional-variance profile satisfies

\[
 R(2v)={1\over8}\left.\partial_a^2C_a(v)\right|_{a=0},
 \qquad \widehat R=\Xi'^2-\Xi\Xi''.                        \tag{14}
\]

Consequently

\[
 \boxed{
 R\text{ is positive definite}
 \quad\Longleftrightarrow\quad
 \left.\partial_a^2C_a\right|_{a=0}\succeq_{\rm PD}0.}     \tag{15}
\]

Equation (15) is a cone-curvature statement, not a consequence of
`C_a` belonging to the positive cone for every `a`.  Likewise the pointwise
finite difference

\[
 {C_a(v)+C_{-a}(v)-2C_0(v)\over a^2}\geq0                  \tag{16}
\]

need not be positive definite.  Its Fourier transform is nonnegative exactly
when

\[
 |\Xi(t+ia)|^2\geq\Xi(t)^2\qquad(t\in\mathbb R),            \tag{17}
\]

whose zero-tilt curvature is (11).  Thus positive tilted parents do not give
a noncircular positive mixture merely by differentiation.

For `a>1/2`, the functional equation identifies

\[
 |\Xi(t+ia)|
 =\left|\xi\left({1\over2}+a+it\right)\right|,              \tag{18}
\]

where the zeta Dirichlet series and Euler product are absolutely convergent.
This supplies arithmetic formulas for the remote tilted parents.  It does not
give the Loewner-convex continuation from `a>1/2` to `a=0`; that continuation
would have to establish (15), not just positivity of the endpoints.

## 4. Complex-shift curvature and the polynomial transport cost

The obstruction to an ordinary Hardy-convexity proof can be made exact.  For
`z=x+iy` in a fixed compact set, define the Hilbert-valued holomorphic map

\[
 f_p(z)(t)=\sqrt{2\over\pi}\,p(it)\Xi(t+iz),
 \qquad \mathcal N_p(z)=\|f_p(z)\|_2^2.                    \tag{19}
\]

Uniform fixed-strip decay makes (19) holomorphic as an `L2`-valued map.  On
the real parameter axis,

\[
 \mathcal N_p(a)=J_p(a)
 ={2\over\pi}\int|p(it)|^2|\Xi(t+ia)|^2dt,
 \qquad J_p''(0)=4\mathfrak q[p].                         \tag{20}
\]

Let `epsilon` be the parity of `p` and set

\[
 P(t)=i^{-\epsilon}p(it)\in\mathbb R[t].                   \tag{21}
\]

Along the imaginary parameter axis, changing variables gives

\[
 \mathcal N_p(iy)
 ={2\over\pi}\int_{\mathbb R}P(u+y)^2\Xi(u)^2\,du.        \tag{22}
\]

The norm square of a Hilbert-valued holomorphic function is subharmonic, and
direct differentiation yields the exact curvature identities

\[
 \begin{aligned}
 \partial_x^2\mathcal N_p(0)&=4\mathfrak q[p],\\
 \partial_y^2\mathcal N_p(0)&={2\over\pi}
   \int (P(t)^2)''\Xi(t)^2\,dt,\\
 (\partial_x^2+\partial_y^2)\mathcal N_p(0)
 &= {8\over\pi}\int P(t)^2\Xi'(t)^2\,dt\geq0.
 \end{aligned}                                               \tag{23}
\]

Equivalently,

\[
 \boxed{
 \mathfrak q[p]
 ={2\over\pi}\int P^2\Xi'^2dt
 -{1\over2\pi}\int(P^2)''\Xi^2dt.}                         \tag{24}
\]

For `p=1`, the transport curvature in (23)--(24) vanishes and ordinary
Hilbert-norm convexity gives the known positive base moment.  At higher degree
the orthogonal curvature is not a harmless error: it is exactly the
polynomial-transport/commutator cost.  Subharmonicity signs only the sum in
(23), not the desired real curvature.  Weighted three-lines language cannot
discard this term, because the polynomial weight is not invariant under the
vertical translation used in the Hardy norm.

Equation (24) is another combined-vector identity, not a separate Cauchy
estimate.  Bounding its two terms independently recreates the losses already
seen in the spatial and paid-Schur factorizations.

## 5. What a surviving arithmetic factor must do

The results above exclude a broad but precise route class.

- A positive autocorrelation factor for `R`, a universal contraction between
  (2), or a degree-independent translation-intertwining dilation proves the
  full first-Laguerre sign by (9)--(11).  It is not a weaker induction lemma.
- Positive definiteness of every tilted parent `C_a`, pointwise tilt
  convexity, and the absolutely convergent Euler-product region do not order
  the parents in the positive-definite cone at `a=0`.
- Hilbert-valued subharmonicity leaves the exact transport curvature in
  (23).  Removing it requires a degree-dependent identity involving the
  actual polynomial, not a source-free analytic-norm theorem.

A viable continuation may still prove the directional inequality

\[
 \|B\pi_N\|^2\leq\|\mathbf A\pi_N\|^2                         \tag{25}
\]

for the actual mismatch-corrected residual at each rung, while keeping its
regression coefficients inside the comparison.  Alternatively it may use a
non-translation-invariant modular/Ewald grouping whose signed cells cancel
only after the complete theta sum is assembled.  Those mechanisms are not
covered by the universal contraction theorem because their operators depend
on the rung, the residual, or the arithmetic scale.

## Nonclaims

- Equations (7), (14), and (23) are exact identities, not positivity proofs.
- The density argument in (11) proves equivalence with the first Laguerre
  sign, not equivalence of that single sign with RH.
- The Euler-product formula in the remote tilted region is not continued
  through the critical strip with a sign.
- No finite verified band or finite family of residuals is promoted to an
  all-frequency or all-degree statement.
- The note does not rule out a theta-specific degree-dependent contraction,
  a Jacobi phase-space identity, or an assembled modular/Ewald payment.
