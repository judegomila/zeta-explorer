# The moment-structure gate for the mismatch-corrected theta pivot

## Scope

This note asks whether Hamburger/Stieltjes moment theory, Hankel total
positivity, or variation diminution can prove the mismatch-corrected
paid-Schur inequality isolated in `MISMATCH_THETA_FORMULA.md`.  It gives an
exact normalization of that question and identifies a genuine
actual-theta obstruction to the most direct pointwise-moment proof.

The conclusions are:

1. the paid-Schur pivot is exactly the next Hankel determinant ratio of the
   endpoint Xi--Laguerre density;
2. all-order Stieltjes or Hankel total nonnegativity of the resulting moment
   sequence is equivalent, in the present analytic class, to the missing
   spectral sign and therefore is not an independent input;
3. Desnanot--Jacobi gives a useful correlated determinant identity, but its
   new shifted determinant contains the same unknown newest moment;
4. the natural pointwise Bell-fiber Stieltjes matrices for the actual
   complete-theta profile are already indefinite at odd H5 near the origin.
   Hence pointwise total positivity followed by integration cannot be the
   all-degree proof.  The successful finite H5 result uses integrated
   covariance repair, which is the kind of coupling an all-degree argument
   must retain.

Nothing here proves a new endpoint sign, all-degree bridge positivity, or
RH.  The certified H5 obstruction below falsifies one proof mechanism, not
the integrated theta target.

## Exact signed moment sequence

Use the Fourier convention of `THETA_TURAN_NEXT.md`:

\[
 \widehat\psi(t)=2\Xi(t),\qquad
 f(t)=\Xi'(t)^2-\Xi(t)\Xi''(t)=\widehat R(t),       \tag{1}
\]

where

\[
 R(u)=\frac1{16}\int_{\mathbb R}v^2
 \psi\!\left(\frac{u+v}{2}\right)
 \psi\!\left(\frac{u-v}{2}\right)\,dv.           \tag{2}
\]

The complete-theta decay justifies Fourier inversion and differentiation of
all orders.  Define

\[
 \boxed{s_k=(-1)^kR^{(2k)}(0)
       =\frac1{2\pi}\int_{\mathbb R}t^{2k}f(t)\,dt.} \tag{3}
\]

These are signed moments until the sign of `f` has been proved.  Put

\[
 H_n^{(r)}=(s_{r+i+j})_{i,j=0}^n,\qquad
 D_n^{(r)}=\det H_n^{(r)},                          \tag{4}
\]

with `D_(-1)^(r)=1`.

For a real even polynomial

\[
 p(D)=\sum_{j=0}^n a_jD^{2j},\qquad b_j=(-1)^ja_j,
\]

the exact target form from `SPECTRAL_DEFECT_CLOSURE.md` is

\[
 \mathfrak q(p)=\frac1\pi\int_{\mathbb R}f(t)|p(it)|^2\,dt
               =2b^*H_n^{(0)}b.                   \tag{5}
\]

For an odd polynomial

\[
 p(D)=\sum_{j=0}^n a_jD^{2j+1},\qquad b_j=(-1)^ja_j,
\]

the corresponding formula is

\[
 \mathfrak q(p)=2b^*H_n^{(1)}b.                   \tag{6}
\]

Thus the alternating powers of `i` are only a diagonal congruence.  They do
not change inertia or any Schur-pivot sign.

Suppose the old parity prefix is positive definite.  For a new polynomial
monic in `D^(2n)` or `D^(2n+1)`, respectively, its actual-target Schur pivot
is

\[
 \boxed{
 S_{n,\mathrm{even}}=2\frac{D_n^{(0)}}{D_{n-1}^{(0)}},
 \qquad
 S_{n,\mathrm{odd}}=2\frac{D_n^{(1)}}{D_{n-1}^{(1)}}.} \tag{7}
\]

Here `S` is in the normalization of `PAID_SCHUR_NEXT.md`; consequently its
identity `2S=A_X-B_Y-C_XY` equals four times the relevant determinant ratio.
For a different leading coefficient, (7) is multiplied by its squared
modulus.

Equation (7) identifies the moment-theoretic content of the combined
mismatch vector.  The old-target regression `q_A` is precisely the monic
signed orthogonal-polynomial regression, and

\[
 2S=2\mathfrak q[p-q_A]                            \tag{8}
\]

is the same next determinant ratio.  Introducing moment coordinates does
not remove the `Q^(-1)` payment; it performs the same Schur elimination in a
Hankel basis.

## The Stieltjes and total-positivity gate is the target sign

If `f>=0`, push the positive measure `(2pi)^(-1)f(t)dt` forward under
`x=t^2`.  Equation (3) then makes `(s_k)` a Stieltjes moment sequence.  In
particular

\[
 H_n^{(0)}\succeq0,\qquad H_n^{(1)}\succeq0
 \quad(n\geq0).                                    \tag{9}
\]

Conversely, (9) for every `n` is the classical Stieltjes moment criterion.
For the present *specified* signed density there is a more direct closure
argument.  The complete-theta strip decay gives an absolute exponential
moment for `|f(t)|dt`.  Polynomials are therefore dense in
`L^2(|f|dt)`, and parity symmetrization gives density separately in the even
and odd sectors.  If every matrix in either complete parity ladder were
positive semidefinite, polynomial squares could approximate the indicator
of any symmetric open set on which `f<0`.  That would be a contradiction.
Continuity of `f` removes the almost-everywhere qualification.  Hence

\[
 \boxed{
 \begin{aligned}
 f(t)\geq0\quad(t\in\mathbb R)
 &\Longleftrightarrow H_n^{(0)}\succeq0\quad(n\geq0)\\
 &\Longleftrightarrow H_n^{(1)}\succeq0\quad(n\geq0).
 \end{aligned}}                                    \tag{10}
\]

The forced zero of an odd polynomial at `t=0` is harmless: continuity would
turn negativity at the origin into negativity at nonzero points.

There is a corresponding total-nonnegativity statement.  For a positive
measure on `[0,infinity)`, Andreief's identity writes every minor

\[
 \det(s_{i_a+j_b})_{a,b=1}^m
\]

as an integral of two generalized Vandermonde determinants.  On ordered
nonnegative nodes both determinants have the same nonnegative Vandermonde
orientation.  Thus a Stieltjes moment sequence has a totally nonnegative
infinite Hankel matrix (strict positivity requires the usual support
conditions).  Conversely, all principal minors of that total-nonnegative
matrix and its one-step shift include (9).

Therefore, in this problem, assuming all-order Hankel total
nonnegativity—or its full variation-diminishing consequence—is at least as
strong as assuming the desired endpoint sign.  It can be a proof *target*
if derived from independent theta arithmetic, but it is not a free
consequence of ordinary positivity or log-concavity of `psi`.

## A correlated determinant identity, and where it stops

Desnanot--Jacobi applied to the Hankel matrix in (4) gives, for `n>=1`,

\[
 \boxed{
 D_n^{(r)}D_{n-2}^{(r+2)}
 =D_{n-1}^{(r)}D_{n-1}^{(r+2)}
  -\bigl(D_{n-1}^{(r+1)}\bigr)^2.}                 \tag{11}
\]

Under positivity of the old `r`-shifted prefix,
`D_(n-2)^(r+2)>0` because it is a trailing principal minor.  Hence the next
pivot has the exact paid form (with `D_(-1)^(r+2)=1` when `n=1`)

\[
 \boxed{
 \frac{D_n^{(r)}}{D_{n-1}^{(r)}}
 =\frac{D_{n-1}^{(r+2)}}{D_{n-2}^{(r+2)}}
  -\frac{\bigl(D_{n-1}^{(r+1)}\bigr)^2}
  {D_{n-1}^{(r)}D_{n-2}^{(r+2)}}.}                 \tag{12}
\]

This is a genuine correlated identity: it retains the cross minor as one
square rather than estimating its entries separately.  It is the Hankel
analogue of a positive innovation minus a mismatch payment.

It does not close the induction.  The shifted determinant
`D_(n-1)^(r+2)` in the first term contains the same newest moment
`s_(r+2n)` as `D_n^(r)`; it is not part of the old `r`-prefix data.  Applying
Cauchy to (11) is valid if the moments already come from a positive measure,
which is the sign in (10).  Thus (12) moves the directional blocker into the
sharp correlated minor inequality

\[
 D_{n-1}^{(r)}D_{n-1}^{(r+2)}
 \geq\bigl(D_{n-1}^{(r+1)}\bigr)^2,                \tag{13}
\]

without proving it.

This also explains why variation diminution of an *old* finite block cannot
determine the extension.  With all earlier moments fixed, `D_n^(r)` is
affine in the newest moment and its coefficient is the positive old
determinant.  That last moment can cross the Schur threshold while the old
block is unchanged.  A source-specific relation involving the newest theta
moment is indispensable.

## Exact complete-theta fiber decomposition

The moment sequence has a useful real-space representation.  From (2),
evenness, and the change `u=2a`,

\[
 R(2a)=\int_0^\infty h^2\psi(h-a)\psi(h+a)\,dh.   \tag{14}
\]

Define the local Bell-fiber jets

\[
 c_k(h)=\frac{(-1)^k}{4^k}
 \left.\partial_a^{2k}
 \{\psi(h-a)\psi(h+a)\}\right|_{a=0}.             \tag{15}
\]

Differentiation under the integral gives the exact mixture

\[
 \boxed{s_k=\int_0^\infty h^2c_k(h)\,dh.}          \tag{16}
\]

Consequently, pointwise positivity of all local Hankel matrices

\[
 (c_{i+j}(h))_{i,j=0}^n,\qquad
 (c_{i+j+1}(h))_{i,j=0}^n                          \tag{17}
\]

would be a sufficient all-order proof after integration.  This is the
cleanest place where local total positivity or a local Stieltjes
representation could have entered.

The actual theta profile supplies the first part of this picture.  The
audited global bound `(log psi)''<-17` implies strict TP2 for the translation
kernel `psi(x-y)`.  At the Bell-fiber level, writing `ell=log psi`,

\[
 c_0(h)=\psi(h)^2,
 \qquad
 c_1(h)=-\frac12\psi(h)^2\ell''(h)
        >\frac{17}{2}\psi(h)^2.                   \tag{18}
\]

So the first shifted scalar moment is not the obstruction.

## The actual pointwise H5 obstruction

The all-order pointwise mechanism (17) is false for the actual complete
theta profile.  The independently reviewed certificate

`evidence/v18-curated/post_v7_audit/POINTWISE_H5_AUDIT.md`

uses the normalized jets

\[
 \mu_k(h)=(-1)^k\left.\partial_a^{2k}
 \frac{\psi(h-a)\psi(h+a)}{\psi(h)^2}\right|_{a=0}.
 \tag{19}
\]

It rigorously encloses at `h=0` the determinant

\[
 \det(\mu_{i+j+1}(0))_{i,j=0}^2<0                 \tag{20}
\]

(numerically about `-1.1946774304288649e16`), with the lower minors checked
in the audited construction.  Continuity makes the same local odd-H5 block
indefinite on a neighborhood of the origin.

This is exactly the local matrix in (17), not merely a similar diagnostic.
Indeed

\[
 c_k(h)=\psi(h)^2,4^{-k}\mu_k(h),                 \tag{21}
\]

so

\[
 (c_{i+j+1}(h))_{i,j=0}^2
 =\frac{\psi(h)^2}{4}
 \operatorname{diag}(4^{-i})
 (\mu_{i+j+1}(h))_{i,j=0}^2
 \operatorname{diag}(4^{-j}).                     \tag{22}
\]

The two matrices have the same inertia.  Thus there is no pointwise
positive measure whose first six moments are these actual Bell-fiber jets
near `h=0`, and no proof of every global Hankel block can proceed by simply
integrating pointwise Stieltjes matrices.

The factor `h^2` in (16) vanishes at the center, and positive contributions
away from the center can repair the local negative direction.  In fact the
campaign's independently audited integrated H5 result does exactly that.
Therefore (20) is not a negative global pivot, not an actual-theta spectral
counterexample, and not evidence against RH.  It is a rigorous obstruction
to a local total-positivity proof and a demonstration that integration and
cross-region covariance must remain coupled.

## Consequence for the mismatch-corrected route

The moment route sharpens, but does not bypass, the remaining theorem:

* (11)--(12) are an alternative Hankel Schur elimination of the same final
  pivot controlled by the combined `G_Y^dagger+Q^(-1)` mismatch formula; no
  termwise identification of the cross minor with `C_XY` is asserted;
* full Stieltjes/Hankel total positivity is equivalent to the missing
  endpoint sign in the actual exponential-moment class;
* TP2 and strong log-concavity control only the first local curvature and do
  not propagate to the required Bell-fiber hierarchy;
* the most direct local hierarchy is rigorously false at actual odd H5.

A noncircular continuation must therefore establish an **integrated**
theta-specific version of (13), or equivalently a degree-uniform covariance
repair for (16), while retaining the negative near-center fiber together
with its compensating positive regions.  Replacing those regions by absolute
budgets, assuming a pointwise Stieltjes measure, or invoking variation
diminution of the full Hankel matrix would discard or assume the needed
correlation.

## Nonclaims

- No new sign of `f`, `D_n^(r)`, or a paid-Schur pivot is proved.
- The pointwise H5 obstruction does not contradict the established
  integrated H5 positivity.
- Total positivity of some other theta kernel is not ruled out.  The
  obstruction concerns the specific Bell-fiber moment mixture (15)--(17)
  that would imply the target by pointwise integration.
- Finite certificates here are used only to reject that proof mechanism;
  they do not establish or refute an all-degree theorem or RH.
