# A two-generator theta Sobolev auxiliary

## Scope and outcome

This note continues the exact Sobolev square in
`ALL_DEGREE_SOBOLEV_SQUARE_NEXT.md`.  It looks for a source-specific rule for
the auxiliary rather than enlarging an unrestricted polynomial space.

There are three conclusions.

1. The physical-space commutator and the Gaussian heat drift select the
   two-dimensional, residual-dependent family

   \[
    g_{\alpha,\beta}(t)=\alpha q'(t)+\beta t q(t).
   \]

   Although it has only two free parameters, its allowed polynomial degree is
   the natural linear scale `N+epsilon`.  Optimizing the two parameters gives
   one explicit `2 by 2` inequality involving only the old residual and
   positive `W^2` moments.  It is a noncircular sufficient condition for the
   next pivot.
2. The derivative-only commutator can be optimized exactly.  Its strongest
   scalar criterion is `(B^2-A^2)/(4A)`.  The degree-only coefficient which
   matches the leading tail realizes the previously found Hardy deficit, and
   its entire remainder is strictly negative whenever the residual is
   real-rooted.  Thus real-rootedness cannot rescue that natural recurrence.
3. The logarithmic theta heat recurrence does not collapse to a fixed
   real-polynomial drift.  Orbit multiplication by `e^(2h)` becomes an
   imaginary spectral shift, and there is no nontrivial finite
   constant-coefficient differential recurrence for the complete profile.
   A fixed-order Gaussian-style annihilator is therefore not supplied by the
   theta heat equation.

A rounded H5 diagnostic finds the restricted two-generator criterion
positive and within about one percent of the unrestricted cubic diagnostic.
This is route-selection evidence only.  The all-degree two-generator
inequality remains unproved, and no Xi--Laguerre sign or RH conclusion is
claimed.

## 1. Exact pivot and old-data domain

Use the normalization

\[
 W(t)=\widehat\psi(t)=2\Xi(t).
\]

For `epsilon in {0,1}` and `N>=0`, let

\[
 q(t)=t^\epsilon P_N(t^2),\qquad
 \kappa=2N+\epsilon.                              \tag{1}
\]

Assume the stipulated old signed block is invertible.  The monic polynomial
`P_N` is then the actual signed Galerkin residual, and its coefficients are
determined by

\[
 \sum_{j=0}^Np_jM_{\epsilon+j+\ell}=0
 \qquad(0\leq\ell<N).                            \tag{2}
\]

In particular, `q` uses target moments only through `M_(kappa-1)`.  The new
pivot also uses `M_kappa`.  This separation will make the criterion below
noncircular.

For every nontrivial rung

\[
 \kappa=2N+\epsilon\geq1,                         \tag{3}
\]

the exact Sobolev identity is

\[
 \boxed{
  2\pi\mathcal S_{N,\epsilon}
  =\int_{\mathbb R}
   \left\{q^2W'^2-{q'^2+qq''\over2}W^2\right\}dt.} \tag{4}
\]

This is the same normalization as the earlier auxiliary-square notes.  The
exceptional even base is already positive:

\[
 \mathcal S_{0,0}={1\over2\pi}\int W'^2dt>0.      \tag{5}
\]

All expressions below are finite because `W` is Schwartz and `q` is a fixed
polynomial.

## 2. The derivative commutator and its exact optimum

The derivative `q'` has the parity required of an auxiliary.  In the notation
`g(t)=t^(1-epsilon)G(t^2)`, it corresponds to

\[
 G_D(z)=z^{\epsilon-1}
 \{\epsilon P_N(z)+2zP_N'(z)\},                  \tag{6}
\]

where the `epsilon=0` expression is the polynomial `2P_N'(z)`.  It has degree
`N+epsilon-1`, exactly the pointwise leading-tail matching degree.

Define positive-weight scalars

\[
 A=\int q'^2W^2dt>0,\qquad
 B=\int qq''W^2dt.                               \tag{7}
\]

For the one-parameter auxiliary `g_alpha=alpha q'`, integration of the cross
term gives

\[
 \int qq'WW'dt=-{A+B\over2}.                     \tag{8}
\]

Writing `x=alpha-1/2`, equation (4) becomes

\[
 \boxed{
 \begin{aligned}
 2\pi\mathcal S_{N,\epsilon}
 &=\int(qW'+\alpha q'W)^2dt+\mathcal D_\alpha,\\
 \mathcal D_\alpha
 &=xB-(x^2+1/4)A.
 \end{aligned}}                                  \tag{9}
\]

Thus the exact best derivative-only criterion is

\[
 \boxed{
  \sup_\alpha\mathcal D_\alpha
  ={B^2-A^2\over4A},\qquad
  \alpha_*=\frac12+{B\over2A}.}                 \tag{10}
\]

It is sufficient only when `abs(B)>=A`.  It is not an estimate obtained by
separating the two signed channels; it is the exact optimum in the canonical
commutator direction.

There is also a sharp degree-only choice.  Since `q(t)=t^kappa+...`, matching
the leading tail in (9) forces

\[
 x_{\rm tail}={\kappa-1\over2\kappa},\qquad
 \alpha_{\rm tail}=1-{1\over2\kappa}.            \tag{11}
\]

The leading coefficient of the remainder density is then

\[
 -{2\kappa-1\over4}t^{2\kappa-2},                \tag{12}
\]

which recovers exactly the Hardy deficit.  More is true if `q` is
real-rooted.  Away from its roots,

\[
 qq''-q'^2
 =-q^2\sum_j{m_j\over(t-r_j)^2}\leq0.            \tag{13}
\]

For `x=x_tail>=0`, the full remainder density in (9) can be written

\[
 x(qq''-q'^2)-(x-1/2)^2q'^2.                    \tag{14}
\]

It is strictly negative on a set of positive measure for every nonconstant
real-rooted `q`.  Hence the tail-matched commutator has

\[
 \boxed{\mathcal D_{\alpha_{\rm tail}}<0}         \tag{15}
\]

for such a residual.  Proving real-rootedness would therefore obstruct, not
complete, this particular auxiliary route.  The actual signed theta residual
is not assumed real-rooted here.

The coefficient `alpha=1` has the direct commutator meaning

\[
 qW'+q'W=(qW)'.                                  \tag{16}
\]

Thus (9)--(15) also retire the most literal attempt to turn the physical
`h`-weight into a positive derivative square without an additional drift.

## 3. Adding the heat drift gives a two-by-two criterion

The Gaussian annihilator suggests adding `tq`.  It also has the required
opposite parity.  In polynomial notation it is

\[
 G_H(z)=z^\epsilon P_N(z),                       \tag{17}
\]

of degree `N+epsilon`.  Consider

\[
 \boxed{g_{\alpha,\beta}=\alpha q'+\beta tq.}    \tag{18}
\]

Besides `A,B` in (7), put

\[
 \begin{aligned}
 C&=\int q^2W^2dt,&
 D&=\int t^2q^2W^2dt,\\
 E&=\int tqq'W^2dt.
 \end{aligned}                                   \tag{19}
\]

The Gram matrix of the two auxiliary directions is

\[
 K=\begin{pmatrix}A&E\\E&D\end{pmatrix}.         \tag{20}
\]

It is positive definite.  Indeed, `q'` and `tq` cannot be proportional as
polynomials when `kappa>=1`, and `W^2` is positive almost everywhere away
from its discrete real zeros.

The two cross terms with `qW'` are exact derivatives:

\[
 \begin{aligned}
 u&=\int qq'WW'dt=-{A+B\over2},\\
 v&=\int tq^2WW'dt=-{C+2E\over2}.
 \end{aligned}                                   \tag{21}
\]

Let `r=(u,v)^T`.  Completing the finite-dimensional square gives

\[
 \boxed{
 \begin{aligned}
 (\alpha_*,\beta_*)^T&=-K^{-1}r,\\
 2\pi\mathcal S_{N,\epsilon}
 &=\min_{\alpha,\beta}
   \int\{qW'+(\alpha q'+\beta tq)W\}^2dt
   +\mathcal H_{N,\epsilon},\\
 \mathcal H_{N,\epsilon}
 &=r^TK^{-1}r-{A+B\over2}.
 \end{aligned}}                                  \tag{22}
\]

Consequently

\[
 \boxed{\mathcal H_{N,\epsilon}\geq0
 \quad\Longrightarrow\quad
 \mathcal S_{N,\epsilon}\geq0.}                \tag{23}
\]

This criterion uses `W^2`, the residual `q`, and its first two derivatives.
By (2), it does not contain the newest target moment `M_kappa` whose sign it
would prove.  It is therefore a genuine sufficient lemma, not the target
rewritten using its unknown last diagonal.

For a denominator-free statement, `AD-E^2>0` and (23) asks for

\[
 \boxed{
 Du^2-2Euv+Av^2
 \geq {AD-E^2\over2}(A+B),}                      \tag{24}
\]

with `u,v` fixed by (21).  If `A+B<=0`, (23) is automatic.  The unresolved
case is one correlated five-scalar inequality under the positive measure
`W^2dt`.

The family (18) is deliberately much smaller than the full auxiliary space.
Its parameter count is two for every rung, while its degree grows as
`N+epsilon`.  Hence an all-degree proof of (24) would have the natural linear
degree scale without invoking the target-equivalent limit of an unrestricted
polynomial projection.  In the notation of the preceding note, subspace
inclusion gives

\[
 \mathcal H_{N,\epsilon}
 \leq\mathcal C_{N,\epsilon,N+\epsilon}
 \leq2\pi\mathcal S_{N,\epsilon}.
\]

The first inequality need not be an equality; this is precisely why (24) is
a stronger, theorem-shaped sufficient condition rather than another form of
the target.

## 4. Fixed-H5 route-selection diagnostic

For H5, `(N,epsilon)=(2,1)` and

\[
 q(t)=t\{t^4+ut^2+v_0\}.
\]

Using only the rounded `F^2` moments and residual coefficients already listed
in `H5_ASSEMBLED_SCHUR_NEXT.md`, where `F=Xi=W/2`, gives

\[
 \begin{array}{c|r}
 A&1.0454563\,10^7\\
 B&-5.3659864\,10^6\\
 C&2.1574130\,10^7\\
 D&1.1778125\,10^9\\
 E&4.6086823\,10^7
 \end{array}                                     \tag{25}
\]

and therefore

\[
 \alpha_*\simeq0.0368573,\qquad
 \beta_*\simeq0.0468455,\qquad
 \boxed{\mathcal H_{2,1}\simeq2.13775\,10^5>0} \tag{26}
\]

in the `F^2` normalization.  The corresponding cubic is

\[
 G(z)\simeq
 73.9823+81.3008z-5.20924z^2+0.0468455z^3.       \tag{27}
\]

For comparison, optimizing over the entire cubic space gave the earlier
rounded value `C_3 about 2.16431 10^5`.  Thus the two theta-shaped directions
capture almost all of that diagnostic gain.  Replacing `F` by `W=2F`
multiplies (25)'s five scalars and `H` by four, without changing
`alpha_*,beta_*`.

The data behind (25)--(27) are rounded quadratures, not interval enclosures.
They do not prove H5.  They show only that (24) is not immediately falsified
at the rung where an independent H5 certificate already exists.

## 5. What the theta heat recurrence does and does not supply

On the positive half-line, the complete profile has the exact
orbit-derivative representation

\[
 \psi^{(j)}(h)=4e^{h/2}
 \sum_{n\geq1}P_j(z_n)e^{-z_n},\qquad
 z_n=\pi n^2e^{2h},\qquad h\geq0,                \tag{28}
\]

with

\[
 P_{j+1}(z)={1\over2}P_j(z)+2z\{P_j'(z)-P_j(z)\}. \tag{29}
\]

This is valuable orbit arithmetic, but it is not a finite recurrence among
real-frequency polynomial multiples of `W`.  The obstruction is structural:
the factor `z_n` includes multiplication by `e^(2h)`.  For every full-line
orbit or seam-free completion to which Fourier transformation may be applied,
the present convention gives

\[
 \widehat{e^{2h}f(h)}(t)=\widehat f(t+2i)         \tag{30}
\]

whenever the shifted transform is defined.  The complete theta profile and
the seam-free Ewald cells have more than enough decay for this shift.  The
positive-half formula (28) must additionally be modularly completed before a
whole-line transform; that completion does not convert the `z` operation into
a fixed real polynomial multiplier.  Eliminating it introduces
imaginary-frequency translates, orbit weights, and the corresponding
reflection/cell compensation.

There is no hidden finite constant-coefficient closure.  If

\[
 \sum_{j=0}^ma_j\psi^{(j)}=0,                    \tag{31}
\]

Fourier transformation gives

\[
 \left\{\sum_{j=0}^ma_j(it)^j\right\}W(t)=0
 \quad(t\in\mathbb R).                           \tag{32}
\]

Since `W=2Xi` is not identically zero, it is nonzero on an open interval;
the polynomial in braces must vanish identically.  Hence every `a_j=0`.

Likewise, no polynomial drift `b(t)` gives a Gaussian-style exact
annihilator

\[
 W'+bW=0.                                        \tag{33}
\]

A nonzero solution of this first-order equation is an exponential of an
antiderivative of `-b` and has no real zero, whereas `Xi` has real zeros.
Thus the theta heat structure alone cannot turn (18) into exact cancellation
or reduce it to fixed auxiliary degree.  A successful proof must instead
establish the integrated inequality (24), or enlarge the ansatz while
retaining the imaginary-shift/Ewald compensation exposed by (30).

## 6. Complexity regimes and the next exact lemma

The present calculation separates three logically different mechanisms.

1. A fixed auxiliary degree independent of `N` remains logically possible
   only as a Xi-specific miracle.  The Gaussian countermodel in the preceding
   note rules it out as a consequence of positivity and Schwartz decay, and
   (28)--(33) show that ordinary theta heat closure does not provide it.
2. The two-generator rule (18) has only two fitted scalars but degree
   `N+epsilon`.  It is a concrete `O(N)` construction, and its sign is exactly
   the five-scalar inequality (24).
3. Letting an unrestricted auxiliary degree tend to infinity recovers
   `2pi S_(N,epsilon)` itself.  That saturation is target-equivalent.  The
   two-generator criterion is not: its auxiliary subspace stays
   two-dimensional at every rung.

The next theorem-shaped statement is therefore precise:

\[
 \boxed{
 \text{prove (24) for the actual complete-theta residual }q_{N,\epsilon}
 \text{ for every }2N+\epsilon\geq1.}            \tag{34}
\]

Possible source-specific inputs include applying the Ewald decomposition to
the five quantities `A,B,C,D,E` before forming (24), or proving a joint
imaginary-shift inequality suggested by (30).  Bounding these five quantities
separately would discard the correlation that makes (22) useful.

## Self-audit and nonclaims

- Expanding the square in (9), using (8), reproduces (4) with no omitted
  boundary term.
- Expanding the `2 by 2` minimum in (22) gives (24); the determinant is
  positive by polynomial independence.
- The leading coefficient obtained from (9) and (11) is exactly
  `-(2*kappa-1)/4`, agreeing with the independent Hardy-deficit calculation.
- The H5 arithmetic in (25)--(27) was replayed independently from the rounded
  moments in the preceding note; it is explicitly noncertifying.
- Equations (23)--(24) are sufficient, not necessary, for a pivot sign.  Their
  failure would retire this two-generator auxiliary, not refute the pivot.
- No finite computation is promoted to an all-degree theorem.  No first
  Xi--Laguerre inequality, higher-rung positivity, or RH conclusion is made.
