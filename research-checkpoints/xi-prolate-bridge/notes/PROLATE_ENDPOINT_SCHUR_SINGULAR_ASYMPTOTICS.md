# Singular prolate asymptotics of the endpoint Schur data

## 0. Scope and outcome

This note extracts what the source-normalized prolate expansion actually
implies for the endpoint Schur data on

\[
 L=2\log\lambda,\qquad N=\lceil\lambda L^3\rceil .       \tag{0.1}
\]

There are two conclusions.

1.  The normalized derivative direction has an explicit first correction.
    Both its leading term and every formal correction are global Weil-radical
    states.  Consequently the scalar endpoint datum and cross action have no
    nonzero algebraic term that can be obtained from the prolate series;
    their finite-window action is smaller than every fixed inverse power of
    `lambda`.  The ordinary even residual separately retains the admitted
    Gevrey-scale exponential upper bound.  The first Ritz lowering is not
    determined by these facts: it is exponentially small on its favorable
    branch but can be much larger when its normalized residual direction
    reveals a hidden lower even direction.
2.  The same corrections give arbitrarily many transverse radical
    directions.  The transverse block is therefore a singular perturbation:
    whenever it is positive, any fixed number of its lowest eigenvalues is
    smaller than every fixed inverse power of `lambda`.  Its inverse cannot
    be expanded by inverting a fixed positive leading operator.

The exact Ritz shift `t=q-u` is important.  It replaces the stronger
`q<mu_-` gate by the actual gate `u<mu_-`; in endpoint coordinates it adds
`tI` to the transverse block and `t` to the scalar while leaving the cross
vector unchanged.  This is the only scalar regularization visible in the
finite Schur chart.  Its size is controlled by a normalized residual
direction obtained by dividing a beyond-all-orders residual by its norm, so
the finite prolate corrections do not determine it.

The result is a stopping theorem for a proposed finite-moment route.  The
exact matrix still samples oscillatory transforms of the cumulative
weighted-PNT discrepancy through frequency

\[
 {2\pi N\over L}\asymp 2\pi\lambda L^2,              \tag{0.2}
\]

and the inverse Schur load takes a supremum over the whole growing odd
space.  Prolate localization does not reduce that object to finitely many
moments of the discrepancy.  Present explicit PNT input bounds its absolute
size in several regimes but does not sign the shifted transverse block or
the inverse-weighted short.

No zero is assumed to lie on the critical line, no zero table or global Weil
positivity is used, and no determinant limit or Riemann-hypothesis conclusion
is proved.  The formal project state remains `P0_INVALIDATED`.

The binding conventions are those of `P0_SOURCE_LOCK.json`.  In particular,
the Fourier sign, zero extension, inversion reflection, inclusive prime-power
endpoint, and the minus sign in source equation (3.19) are unchanged.

## 1. Endpoint coordinates and the actual Ritz shift

Let

\[
 p=P_N k_\lambda^+,qquad \kappa={p\over\|p\|},qquad
 q=\langle\kappa,Q_+\kappa\rangle,
\]

\[
 D={L\over2\pi i}\partial_t,qquad
 x=D\kappa,\qquad y={x\over\|x\|},                    \tag{1.1}
\]

and retain the combined source vector

\[
 s=D(Q_+-qI)\kappa-(\delta\kappa)\beta
   =(Q_--qI)x.                                         \tag{1.2}
\]

No estimate below separates the two terms on the first line of (1.2).
With `G=y^perp`, put

\[
 B_q=P_G(Q_--qI)P_G|_G,qquad
 a_q={\langle x,s\rangle\over\|x\|^2},\qquad
 c={P_Gs\over\|x\|}.                                 \tag{1.3}
\]

Let `r=||(Q_+-qI)kappa||`.  If `r>0`, put

\[
 w={(Q_+-qI)\kappa\over r},\qquad
 c_R=\langle w,Q_+w\rangle,
\]

and let `u` be the lower Ritz value of
`Q_+|span{kappa,w}`.  Set

\[
 t=q-u\geq0.                                           \tag{1.4}
\]

If `r=0`, take `t=0`.  Direct block addition gives the exact shifted
endpoint gate

\[
 \boxed{
 u<\lambda_{\min}(Q_-)
 \Longleftrightarrow
 B_q+tI_G>0\quad\hbox{and}\quad
 a_q+t-\langle c,(B_q+tI_G)^{-1}c\rangle>0.}          \tag{1.5}
\]

Thus `q<mu_-` is a strictly stronger target than the bridge requires.  The
cross vector in (1.5) is unchanged by the Ritz shift.

On every interval on which `B_q+tI_G>0`, define

\[
 \mathcal S(t)=a_q+t-
       \langle c,(B_q+tI_G)^{-1}c\rangle .             \tag{1.6}
\]

Differentiation by the resolvent identity gives

\[
 \boxed{\mathcal S'(t)=1+
   \|(B_q+tI_G)^{-1}c\|^2>0.}                          \tag{1.7}
\]

The Ritz shift is therefore a genuine monotone regularizer.  It is not an
independent free parameter.  The two-by-two characteristic equation gives

\[
 \boxed{t(c_R-q+t)=r^2.}                               \tag{1.8}
\]

In particular, if `c_R>=q`, then `0<=t<=r`; if
`c_R-q>=g>0`, then `t<=r^2/g`.  If `c_R<q`, a much larger lowering is
possible, but it is then produced by a hidden lower even direction.  The
normalized direction `w` is obtained by dividing a beyond-all-orders
residual by its norm, so no fixed prolate asymptotic truncation identifies
`c_R` or chooses between these alternatives.

## 2. Explicit first correction to the derivative direction

Write, in centered logarithmic coordinates,

\[
 K(t)=E(h)(e^t),\qquad G_1(t)=E(g_1)(e^t),              \tag{2.1}
\]

where `h` and `g_1` have the locked source normalization.  Their transforms
from the admitted first-correction theorem are

\[
 \widehat K(z)={\Xi(z)\over4},\qquad
 \widehat G_1(z)={2z^2-21\over128\pi}\Xi(z).           \tag{2.2}
\]

The leading state is globally inversion even.  Indeed, `h` is Fourier
invariant and satisfies `h(0)=integral(h)=0`, so Poisson summation gives
`K(-t)=K(t)` exactly.  This is the fixed-order case of equations (5.1)--(5.2)
of `notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md`; it is not an assumed
finite-`lambda` symmetry of the uncorrected prolate state.

Since the logarithmic transform is `integral F(t)e^(-izt)dt`, (2.2) is
equivalent to the exact physical-space identity

\[
 \boxed{G_1=-{2K''+21K\over32\pi}.}                    \tag{2.3}
\]

Put

\[
 B_0=\|K'\|^2,qquad B_2=\|K''\|^2,qquad
 m_4={B_2\over B_0}.                                   \tag{2.4}
\]

The derivative convergence theorem, used with two fixed quasimode orders
before taking the limit, gives a first-order expansion for the phase-free
direction `iy=kappa'/||kappa'||`:

\[
 \boxed{
 iy=y_0+\lambda^{-2}y_1+o(\lambda^{-2}),qquad
 y_0={K'\over\sqrt{B_0}},qquad
 y_1=-{K'''+m_4K'\over16\pi\sqrt{B_0}}.}              \tag{2.5}
\]

Indeed, if

\[
 b_1={\langle K',G_1'\rangle\over B_0}
     ={2B_2/B_0-21\over32\pi},                         \tag{2.6}
\]

normalization replaces `G_1'` by `G_1'-b_1K'`, which is exactly the last
formula in (2.5).  Integration by parts gives

\[
 \langle y_0,y_1\rangle=0.                             \tag{2.7}
\]

Moreover `y_1` is nonzero.  Relative to `K'`, its transform multiplier is

\[
 {z^2-m_4\over16\pi};                                  \tag{2.8}
\]

the nonzero entire function `Xi` is not supported on the two points
`z^2=m_4`.

The derivative norm itself has the admitted leading asymptotic

\[
 \boxed{
 \|x\|={L\over2\pi}
 \left({\|K'\|^2\over\|K\|^2}\right)^{1/2}
 (1+O(\lambda^{-2})),}                                 \tag{2.9}
\]

where the first correction can be read from the two scalar inner products
`<K,G_1>` and `<K',G_1'>`.  The leading ratio is equivalently

\[
 {\|K'\|^2\over\|K\|^2}
 ={int_{\mathbb R}z^2|\Xi(z)|^2dz
    \over\int_{\mathbb R}|\Xi(z)|^2dz}.               \tag{2.10}
\]

No numerical value of (2.10) is used.

## 3. Every formal derivative correction is radical

For a source function `g`, set

\[
 \mathscr Lg=xg'(x)+{1\over2}g(x).                     \tag{3.1}
\]

Termwise differentiation of the absolutely convergent arithmetic sum gives

\[
 {d\over dt}E(g)(e^t)=E(\mathscr Lg)(e^t).             \tag{3.2}
\]

If `g` is even and Schwartz with `g(0)=integral(g)=0`, then
`mathscr Lg` has the same three properties, because

\[
 \int_{\mathbb R}\mathscr Lg=-{1\over2}\int_{\mathbb R}g=0. \tag{3.3}
\]

The all-order prolate recursion gives exactly those conditions for every
source correction `g_j`.  Hence

\[
 Y_j(t)={d\over dt}E(g_j)(e^t)                         \tag{3.4}
\]

is a two-sided global Weil-radical state for every fixed `j`.  Its oddness
uses one further all-order fact: `g_j` itself is Fourier invariant, so
Poisson summation and the two codimension conditions give
`E(g_j)(e^(-t))=E(g_j)(e^t)`; differentiating makes `Y_j` odd.  No Fourier
invariance of `mathscr L g_j` is being asserted.
In particular both `y_0` and `y_1` in (2.5) are radical.

The family `Y_0,Y_1,...` is linearly independent.  The unique highest
Hermite path in order `j` gives a nonzero `h_(4j+4)` coefficient which does
not occur at lower orders.  If a finite linear combination of the `Y_j`
vanished, integration in `t` and decay at both ends would make the same
combination of the `E(g_j)` vanish.  The Mellin identity on an open
zero-free half-plane then makes the corresponding source combination zero,
contradicting the highest-label triangularity.

It follows that, for every fixed `M`, Gram--Schmidt produces an
`M`-dimensional odd radical space

\[
 \mathcal R_M\subset y_0^\perp.                        \tag{3.5}
\]

This is the singular feature missed by a regular first-correction
calculation: the first correction does not merely perturb the scalar along
`y_0`; it supplies a new transverse null direction.

## 4. Beyond-all-orders finite-window action bounds

This section records an absolute action estimate.  It is not a relative gap
estimate.

Let `||.||_Z` be the positive, multiplicity-aware two-evaluation sampling
seminorm used in the compact-BV theorem.  For a unit vector `z` in the
finite Fourier space, Bernstein and endpoint evaluation give

\[
 \operatorname {TV}_{\mathbb R}(z)
 \le {2\pi N\over\sqrt L}+2\sqrt{{2N+1\over L}}.        \tag{4.1}
\]

Substitution in the explicit compact-BV sampling theorem therefore yields

\[
 \|z\|_Z^2\le \mathcal B_{\lambda,N},qquad
 \log\mathcal B_{\lambda,N}=O(L)                      \tag{4.2}
\]

on (0.1).  More crudely, its displayed formula gives a fixed source
constant times `lambda*(1+L)^3` for all sufficiently large `lambda`.

Fix a desired power `A`.  Choose a sufficiently large but fixed order
`M=M(A)` in the admitted all-order expansion, and put

\[
 H_{\lambda,M}=\sum_{j=0}^M\lambda^{-2j}g_j.           \tag{4.3}
\]

The finite sum is source-normalized, Fourier invariant, and satisfies both
codimension-two conditions.  Consequently

\[
 Y_{\lambda,M}={d\over dt}E(H_{\lambda,M})(e^t)        \tag{4.4}
\]

is an exact odd global radical.

The differentiated fixed-order estimates needed here are already explicit
in equations (4.3)--(4.7) of
`notes/DERIVATIVE_RADICAL_ODD_SPLIT.md`.  Bernstein applied after projection
costs `2*pi*N/L=O(lambda*L^2)`; the fixed smooth corrections have
arbitrarily high periodic Fourier-tail decay; and their global outer tails
are smaller than every power by equation (5.3) of
`notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md`.  Choosing `M` and the
integration-by-parts order after the desired sampling power `A` therefore
gives an auxiliary power `B=B(A)` as large as needed and, with `y^0`
denoting zero extension,

\[
 R_{\lambda,A}:=Y_{\lambda,M(A)}^{\rm norm}-iy^0,
 \qquad
 \sup_{|v|\le3/4}\|e^{vt}R_{\lambda,A}\|_2
 =O_A(\lambda^{-B(A)})                                 \tag{4.4a}
\]

after increasing `M(A)` if necessary.  On the compact interval the
exponential weight costs at most
`lambda^(3/4)` and is absorbed by choosing a stronger fixed-order estimate;
outside it, (5.3) absorbs the weight and every requested power.

The corresponding weighted total variation is at most `lambda^C` for a
fixed `C=C(A)`.  Indeed, `iy` is a unit trigonometric polynomial of
bandlimit `2*pi*N/L`, so Bernstein gives a polynomial bound, while the
fixed-order comparator and all its derivatives satisfy (5.3).  The proof of
the compact-BV theorem now applies verbatim to the **combined global**
remainder `R_(lambda,A)`: equations (2.9), (2.13), and (2.16) of
`notes/COMPACT_ABSOLUTE_SAMPLING_THEOREM.md` use only the weighted `L2` norm,
weighted variation, and decay at infinity.  Compact support was used there
only to derive its displayed weighted bounds (2.10)--(2.11), which (4.4a)
and the preceding variation estimate replace here.

No lower bound on the actual weighted `L2` error is inserted.  Uniformly in
`|v|<=3/4`, put `x_v=||e^(vt)R_(lambda,A)||_2^2` and
`W_v=TV_R(e^(vt)R_(lambda,A))`.  Take the directed upper bounds
`x_v<=X_A=C_A^2*lambda^(-2B(A))` and `W_v<=W_A=lambda^C`, and use the
monotonicity in equations (3.14)--(3.15) of the compact-BV theorem:

\[
 x_v\log\!\left(2+\max\{1,W_v^2/x_v\}\right)
 \leq X_A\log\!\left(2+\max\{1,W_A^2/X_A\}\right).     \tag{4.4b}
\]

The logarithm on the right is `O_A(L)`.  Choosing the auxiliary power
`B(A)` large enough shows that zero-count/submean sampling loses only a
fixed power.  After normalizing by the positive limit in (2.9), this gives

\[
 \boxed{
 \left\|Y_{\lambda,M(A)}^{\rm norm}-iy\right\|_Z^2
 =O_A(\lambda^{-A})\quad\hbox{for every fixed }A.}     \tag{4.5}
\]

Here `Y_(lambda,M)^norm=Y_(lambda,M)/||Y_(lambda,M)||`.  The factor `i` is
mandatory: by (1.1), the real normalized logarithmic derivative is `iy`.
Here `y` is zero extended, and the left side is kept as one combined
global-minus-compact remainder.  In particular no separate sampling norm is
assigned to the endpoint term
`D(Q_+-q)kappa` or to `(delta kappa)beta`.

The order `M(A)` is fixed while `lambda` tends to infinity.  Equation (4.5)
does **not** claim the unproved growing-order differentiated outer-sampling
estimate that would be required to replace its right side by a specified
Gevrey exponential.

For any finite odd unit vector `z`, two-sided radicality and sequence
Cauchy--Schwarz now give

\[
 |\langle z,Q_-(iy)\rangle|
 \le \|z\|_Z\,
       \|Y_{\lambda,M(A)}^{\rm norm}-iy\|_Z.           \tag{4.6}
\]

Equations (4.2), (4.5), and a relabeling of the arbitrary power imply

\[
 \boxed{\|Q_-y\|=O_A(\lambda^{-A})
        \quad\hbox{for every fixed }A.}                 \tag{4.7}
\]

The identical undifferentiated argument, using the already admitted
`U_Z=O(exp(-c lambda L^2))`, gives (after the same finite-space Bessel
factor, whose logarithm is only `O(L)`)

\[
 |q|\ll U_Z,\qquad
 \|Q_+\kappa\|\ll
       \sqrt{\mathcal B_{\lambda,N}U_Z},\qquad
 r\leq\|Q_+\kappa\|+|q|.                               \tag{4.7a}
\]

Consequently, after decreasing the non-effective exponential constant,

\[
 \boxed{
 |q|+r=O(e^{-c_1\lambda L^2}).}                        \tag{4.8}
\]

This is an upper bound, not an asymptotic formula for `r`; the normalized
residual direction may have no algebraic limit.

Combining (1.2)--(1.3), (2.9), and (4.7)--(4.8) finally gives the strongest
absolute endpoint conclusion:

\[
 \boxed{
 |a_q|+\|c\|+{\|s\|\over\|x\|}
 =O_A(\lambda^{-A}),
 \qquad
 \|s\|=O_A(\lambda^{-A})
 \quad\hbox{for every fixed }A.}                       \tag{4.9}
\]

Thus all algebraic coefficients of the scalar and cross data vanish.  This
does not control the inverse in (1.5).

## 5. The transverse near-null tower

Fix `M`.  Project the radical space `R_M` from (3.5) into the finite odd
space, and orthogonalize it against the actual `y`.  Equations (2.5),
(4.2), and the fixed-order version of (4.5) show that the resulting space
`R_(M,lambda)` has dimension `M` for all sufficiently large `lambda` and

\[
 \sup_{\substack{z\in\mathcal R_{M,\lambda}\\\|z\|=1}}
 \|(Q_--qI)z\|=O_A(\lambda^{-A})
 \quad\hbox{for every fixed }A.                        \tag{5.1}
\]

The subtraction of the `y` component causes no loss.  The fixed radical
basis is orthogonal to `y_0`, the projected basis converges to it, and
`y->-i*y_0`; hence the relevant Gram matrix stays nonsingular.  Equation
(4.7) controls the action of the actual `y` term.  The fixed-order Gaussian
tails and the periodic projection tail are smaller than every power.

Consequently, if `B_q>0` and its eigenvalues are ordered increasingly,
the singular-value min--max principle gives

\[
 \boxed{\lambda_j(B_q)=O_A(\lambda^{-A})
 \quad(1\le j\le M)}                                  \tag{5.2}
\]

for every fixed `A` and `M`.  If `B_q` is not positive, (5.1) still gives
an `M`-dimensional near-zero singular subspace; it gives no sign.

After the actual Ritz lowering, those directions move to

\[
 t+O_A(\lambda^{-A}).                                  \tag{5.3}
\]

Thus there are two genuinely different regimes.

- If `t` dominates the absolute action scale and the rest of `B_q` has no
  hidden negative direction, it can regularize the radical tower.  A
  conditional floor `B_q+tI>=g_tI` gives only
  `\langle c,(B_q+tI)^(-1)c\rangle<=||c||^2/g_t`.
- If `t` is of the same or a smaller scale, the inverse load is a quotient
  of beyond-all-orders quantities.  Equations (4.9) and (5.2) do not choose
  its sign or size.

The favorable branch `c_R>=q` in (1.8) has `t<=r`, so (4.8) gives an
exponential ceiling for `t`.  The transverse information in (5.2) is only
beyond all algebraic orders and supplies no relative comparison with that
ceiling.  The alternative `c_R<q` can produce a larger `t`, but then the low
even direction and the weighted ground solve must be controlled separately.
The prolate series does not supply either conclusion.

The same limitation persists if the two-vector Ritz value is replaced by a
fixed-order even Krylov Ritz value.  Its only appearance in the odd Schur
chart is still the scalar shift `t=q-u`, but constructing its normalized
Krylov directions divides by beyond-all-orders residual scales.  The formal
prolate coefficients therefore do not determine that shift.  Allowing the
Krylov dimension to grow to the full even dimension can recover the exact
lower eigenvalue; that is a reconstruction of the original spectral
problem, not a finite asymptotic reduction.

## 6. Why the discrepancy does not reduce to finitely many moments

Let `phi_n` be the locked centered Fourier modes and put
`nu_n=2*pi*n/L`.  Their zero-extension correlation is

\[
 \omega_{nm}(h)=
 \begin{cases}
 {\sin(\nu_mh)-\sin(\nu_nh)\over\pi(n-m)},&n\ne m,\\
 2(1-h/L)\cos(\nu_nh),&n=m.
 \end{cases}                                           \tag{6.1}
\]

The tail-discrepancy identity uses its derivative:

\[
 \boxed{
 \omega'_{nm}(h)=
 \begin{cases}
 {\nu_m\cos(\nu_mh)-\nu_n\cos(\nu_nh)
       \over\pi(n-m)},&n\ne m,\\
 -{2\over L}\cos(\nu_nh)
 -2\nu_n(1-h/L)\sin(\nu_nh),&n=m.
 \end{cases}}                                         \tag{6.2}
\]

Hence every entry of

\[
 c_*I+\int_0^L\mathcal F_\lambda(h)\omega'(h)\,dh    \tag{6.3}
\]

uses sine/cosine transforms of the actual cumulative discrepancy at the
carrier set `nu_n`, not merely derivatives of that transform at zero.
The largest carrier is (0.2).

Any fixed list of ordinary moments of `mathcal F_lambda` determines only a
fixed Taylor jet of its transform at zero.  It cannot determine (6.2) on a
carrier set whose size and diameter both grow.  This is not repaired by the
localization of `y`.  When `B_q+tI>0`, the exact shifted Schur load is

\[
 \boxed{
 \langle c,(B_q+tI)^{-1}c\rangle=
 \sup_{0\ne z\perp y}
 {\left|\int_0^L\mathcal F_\lambda C'_{z,y}\right|^2
  \over(c_*-q+t)\|z\|^2+
         \int_0^L\mathcal F_\lambda C'_{z,z}}.}        \tag{6.4}
\]

Its supremum allows `z` to range over all `N-1` transverse directions.
Section 5 shows
that even the first prolate corrections place new near-null directions in
that range.  Setting `t=0` recovers the unshifted load in source equation
(3.8), under its hypothesis `B_q>0`.  A regular finite-moment expansion
would attempt to invert a leading block which already has an arbitrarily
large radical kernel.

There is also a direct moment-data obstruction.  Given any fixed order `R`,
choose a nonzero smooth compactly supported `phi` in `(0,L)` and perturb the
cumulative discrepancy by `phi^(R+1)`.  Integration by parts makes its first
`R` polynomial moments vanish, while its cosine transform is nonzero at a
generic carrier.  Formula (6.2) therefore changes a matrix entry without
changing the declared moments.  This is a logical functional obstruction,
not a replacement for the arithmetic discrepancy.

## 7. Exact remaining source theorem

The current explicit PNT inputs provide magnitude bounds, centered mean
squares on controlled ranges, and a finite-compression suppression of a
very high symbol tail.  They do not provide either of the two inequalities

\[
 B_q+tI>0,
 \qquad
 a_q+t>\langle c,(B_q+tI)^{-1}c\rangle                \tag{7.1}
\]

for the actual discrepancy on an unbounded schedule.  In particular:

- the source-normalized prolate corrections cancel every algebraic-order
  global Weil coefficient instead of leaving a finite signed main term;
- the transverse inverse is governed by the first nonzero finite-window
  and arithmetic remainder on a growing near-null space;
- the Ritz shift is helpful but is itself determined by the normalized
  beyond-all-orders even residual direction; and
- absolute PNT envelopes discard the carrier orientation in (6.2).

Thus the prolate expansion yields the absolute scales (2.9), (4.8), and
(4.9), plus the singular tower (5.1).  It does not reduce the shifted Schur
gate to a finite moment inequality and present source-pinned PNT estimates
do not sign that gate.  The remaining theorem must be a relative,
carrier-sensitive estimate for the complete cumulative discrepancy, with
the combined vector (1.2) retained through the inverse.
