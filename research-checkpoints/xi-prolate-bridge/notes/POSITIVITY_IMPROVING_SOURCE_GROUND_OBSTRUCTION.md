# Positivity-improving source-ground route: exact obstruction

## 0. Scope and outcome

This note tests whether the simple inversion-even ground required by the
direct bridge can be obtained from a Perron--Frobenius, Beurling--Deny, or
ground-state-gauge argument applied to the exact physical Weil operator.
The answer is sharp for the standard pointwise cone.

After the pole, archimedean, and prime terms are combined, the operator is a
scalar plus a signed jump form.  Its continuous jump density changes sign at

\[
 h_* = \log \varrho,
 \qquad \varrho^3-\varrho-1=0,
 \qquad \varrho>1.                                      \tag{0.1}
\]

Thus the full source semigroup is positivity preserving precisely in the
small-interval regime `L<=h_*`; it is not positivity preserving for
`L>h_*`.  No nonvanishing multiplication gauge, including a positive Doob
or Perron transform, removes the obstruction.  Since the project requires
an unbounded `lambda` schedule and `L=2 log(lambda)`, this route cannot prove
the scheduled simple-even ground.

The natural pole quotient does not repair the argument: its pointwise
positive cone is trivial and the pole range is not invariant.  Parity
folding also fails asymptotically.  In the odd half-interval cone, every
included prime power produces a reflected positive atom, so positivity is
already obstructed once `lambda>sqrt(2)`.

These are route obstructions, not a proof that the finite arithmetic ground
is odd or multiple.  They do not prove either sector sign, equation (5.2) of
`DIRECT_RH_ATTACK.md`, determinant convergence, or the Riemann hypothesis.
No zero table or global Weil positivity is used.  The formal project state
remains `P0_INVALIDATED`.

The formulas are those already source-pinned in
`notes/WEIGHTED_PNT_DISCREPANCY_NORMAL_FORM.md`,
`notes/CHEBYSHEV_ERROR_REWRITE.md`,
`notes/BOUNDARY_DISCREPANCY_CONVOLUTION_REDUCTION.md`, and
`notes/POLE_DELETED_SCALAR_RESERVE_GATE.md`.

## 1. Exact signed jump measure

Fix

\[
 I=[-a,a],\qquad a=\log\lambda,\qquad L=2a,
\]

with Lebesgue measure and mandatory zero extension.  Put

\[
 \tau(h)=\frac{e^{-5h/2}}{1-e^{-2h}},\qquad h>0,          \tag{1.1}
\]

and retain the right-continuous weighted-PNT discrepancy

\[
 dD(h)=\sum_{1<n\leq\lambda^2}
       \frac{\Lambda(n)}{\sqrt n}\delta_{\log n}(dh)
       -e^{h/2}\,dh,qquad 0<h\leq L.                    \tag{1.2}
\]

Let `nu_tail(dh)=tau(|h|)dh` on the punctured real line and let
`widetilde(dD)` be the symmetric measure whose restrictions to the positive
and negative half-lines are the reflection pair of (1.2).  Define

\[
 \boxed{\mu_\lambda=\nu_{\rm tail}+\widetilde{dD}.}       \tag{1.3}
\]

The exact normal form

\[
 Q_\lambda=c_*I+A_{\rm tail}-T_D
\]

and `A_(widetilde(dD))=2D(L)I-T_D` give the quadratic-form
identity

\[
 \boxed{
 Q_\lambda=(c_*-2D(L))I+A_{\mu_\lambda}.}                \tag{1.4}
\]

Here `A_mu` denotes the zero-extension jump form, interpreted as a signed
form when `mu` is signed.  Formula (1.4) combines all blocks before any
absolute value.  In particular, on `0<|h|<L`, its absolutely continuous
density is

\[
 \boxed{
 \sigma(h)=\tau(|h|)-e^{|h|/2},}                         \tag{1.5}
\]

and its singular part is

\[
 \sum_{1<n\leq\lambda^2}\frac{\Lambda(n)}{\sqrt n}
 (\delta_{\log n}+\delta_{-\log n}),                    \tag{1.6}
\]

with positive weights and the inclusive endpoint.  For `|h|>L`, the
density is the positive tail `tau(|h|)`; those translations contribute only
killing because two copies of `I` no longer overlap.

The same identity follows directly from the pole-deleted Levy form.  The
nonpole multiplier has the positive Levy density

\[
 \frac{e^{-|h|/2}}{1-e^{-2|h|}}
\]

plus the positive prime atoms.  The pole is convolution by
`2 cosh(h/2)` for `|h|<=L`.  Their difference is exactly (1.5), since

\[
 \frac{e^{-h/2}}{1-e^{-2h}}-2\cosh(h/2)
 =\frac{e^{-5h/2}}{1-e^{-2h}}-e^{h/2}.                   \tag{1.7}
\]

Thus the apparent positivity of the pole-deleted Bernstein--Levy operator
does not extend to the complete pole-plus-multiplier operator.

## 2. Sharp Beurling--Deny threshold

Let `rho=varrho` be the plastic constant in (0.1).  With `y=e^h`,

\[
 \sigma(h)
 =\frac{1+y-y^3}{\sqrt y\,(y^2-1)}.                     \tag{2.1}
\]

The denominator is positive and `y^3-y-1` is strictly increasing for
`y>1`.  Consequently

\[
 \boxed{
 \sigma(h)>0\ (0<h<h_*),\quad
 \sigma(h_*)=0,\quad
 \sigma(h)<0\ (h>h_*).}                                \tag{2.2}
\]

Numerically, only to identify the scale,

\[
 \varrho=1.324717957244746\ldots,qquad
 h_*=0.2811995743229618\ldots .                         \tag{2.3}
\]

### Theorem 2.1 (sharp standard-cone criterion)

For the exact continuum source operator on `I`, the semigroup
`exp(-t Q_lambda)` is positivity preserving on the pointwise `L^2` cone if
and only if

\[
 \boxed{L\leq h_*}
 \qquad\Longleftrightarrow\qquad
 \boxed{\lambda\leq\sqrt\varrho}.                     \tag{2.4}
\]

In that small-interval regime the jump density is strictly positive at
every interior separation, so the form is irreducible; the usual
compact-resolvent realization therefore has a positivity-improving
semigroup and a simple strictly positive, hence inversion-even, bottom
state.

**Proof.**  If `L<=h_*`, (2.2), the positive prime atoms, and the positive
exterior tail make `mu_lambda` a nonnegative Levy measure.  Equation (1.4)
is a Dirichlet jump form plus a scalar, so its semigroup preserves
positivity.  Strict positivity of the density for almost every separation
inside `I` makes the form irreducible.

Conversely, suppose `L>h_*`.  Choose
`d in (h_*,L)` away from the finite set of prime-power logarithms and take
nonnegative smooth bumps `f,g` with disjoint small supports whose pairwise
separations lie in a compact neighborhood of `d` containing no such
logarithm.  The atomic terms vanish and (2.2) gives

\[
 \langle f,Q_\lambda g\rangle
 =-\iint f(x)g(y)\sigma(|x-y|)\,dx\,dy>0.               \tag{2.5}
\]

If `exp(-tQ_lambda)` preserved positivity, then
`<f,exp(-tQ_lambda)g>>=0`.  Its value at zero is zero, so its right
derivative would require `-<f,Q_lambda g>>=0`, contradicting (2.5).
This proves necessity and sharpness.  \(\square\)

The smallest sign hypothesis for this physical-cone route is therefore

\[
 \boxed{\nu_{\rm tail}+\widetilde{dD}\geq0}              \tag{2.6}
\]

as a measure, not an absolute PNT bound or an integrated sign of `D` or
`F`.  For the actual source, (2.6) is exactly (2.4).  Positive prime atoms
cannot repair a negative Lebesgue component on `(h_*,L)`.

## 3. No multiplication, Doob, or sign gauge

A positive multiplication conjugation multiplies an off-diagonal kernel by
a positive ratio and hence preserves its sign.  More generally let
`Gf=g f`, where `g` is real, nonzero almost everywhere, and both `G` and
`G^(-1)` are bounded.  Write `g=s|g|` with `s in {+1,-1}`.  If the
conjugated semigroup preserved the standard cone, its continuous
off-diagonal kernel would have to satisfy

\[
 s(x)s(y)\{e^{|x-y|/2}-\tau(|x-y|)\}\leq0              \tag{3.1}
\]

for almost every pair away from the prime graphs.

For every separation below `h_*`, the bracket in (3.1) is negative, so
`s(x)=s(y)` for almost every sufficiently close pair.  Connectedness of
`I` forces `s` to be constant almost everywhere.  For a separation above
`h_*`, the bracket is positive, contradicting (3.1).  Therefore, whenever
`L>h_*`, no multiplication gauge can make the complete source generator
Metzler/Dirichlet.  This includes the ground-state or Doob transform by an
unknown positive function: even knowing a positive ground would not change
the off-diagonal sign.

## 4. Parity folding does not rescue the schedule

Write

\[
 k(h)=e^{h/2}-\tau(h)=-\sigma(h).                         \tag{4.1}
\]

The continuous off-diagonal kernels on the positive half-interval, after
even and odd reflection, are respectively

\[
 k_+(x,y)=k(|x-y|)+k(x+y),\qquad
 k_-(x,y)=k(|x-y|)-k(x+y).                               \tag{4.2}
\]

Since `tau` is strictly decreasing, `k` is strictly increasing.

For the even cone, if `a>h_*`, take a nonnegative even bump near zero and a
nonnegative reflected pair near `+/-d`, where `h_*<d<a` avoids all
prime-power logarithms.  Both continuous cross terms are positive, so the
same derivative argument as (2.5) rules out positivity preservation.  Thus

\[
 \boxed{L>2h_*\quad\Longrightarrow\quad
        \text{the even restricted semigroup is not positive}.}       \tag{4.3}
\]

This clean asymptotic obstruction is sufficient here; no claim is made that
`2h_*` is the optimal even-fold threshold.

For the odd half-interval cone, the continuous part is favorable because
`|x-y|<x+y` gives `k_-(x,y)<0`.  The arithmetic atoms have the opposite
behavior.  A source prime atom `-w_n delta_(|x-y|=log n)` folds to

\[
 -w_n\delta_{|x-y|=\log n}
 +w_n\delta_{x+y=\log n}.                               \tag{4.4}
\]

The second atom is positive.  If `log n<L`, choose disjoint narrow bumps on
the positive half-interval with centers summing to `log n` and difference
away from every prime logarithm.  The positive atomic cross term is order
the bump width, whereas the continuous term is order its square, so the
cross form is positive for sufficiently narrow bumps.  The first possible
source atom is `n=2`; hence

\[
 \boxed{\lambda>\sqrt2\quad\Longrightarrow\quad
        \text{the odd half-cone semigroup is not positive}.}          \tag{4.5}
\]

The inclusive equality `lambda=sqrt(2)` puts the atom at `h=L`, where the
zero-extension translation is null up to endpoints, so the strict
inequality in (4.5) is essential.  In the odd folded problem the smallest
arithmetic sign condition is absence of every positive prime atom with
`log n<L` (or cancellation by a negative atom at exactly the same
translation).  The source has neither property on an unbounded schedule.

## 5. The pole kernel and quotient obstruction

The pole range is

\[
 \mathcal R=\operatorname {span}\{e^{x/2},e^{-x/2}\}
            =\operatorname {span}\{p_+,p_-\}.             \tag{5.1}
\]

Its null space is

\[
 \mathcal K=\{f:\langle e^{x/2},f\rangle
                 =\langle e^{-x/2},f\rangle=0\}.          \tag{5.2}
\]

Because both weights in (5.2) are strictly positive,

\[
 \boxed{\mathcal K\cap L^2(I)_+=\{0\}.}                  \tag{5.3}
\]

Thus deleting the pole by restricting its quadratic form leaves no
generating pointwise positive cone.  It is not a sublattice, since a
nonzero `f in K` has `|f| notin K`.

Nor does `Q_lambda` descend to a canonical operator on `L^2(I)/R`.  For
`lambda>sqrt(2)`, the prime translation of `e^{x/2}` changes formula at
`x=a-log 2`; it has a nonzero interior jump.  The archimedean convolution
has no atom at that location, and the other distinct prime translations do
not cancel it.  Hence the pole-deleted Levy operator does not map `R` into
`R`, whose elements are analytic exponentials.  By self-adjointness, `K`
is not invariant either.  A form restriction is possible, but it is not an
invariant Perron problem for the complete source operator.

The pole-deleted operator itself is a positive irreducible Levy generator
before the spectral shift.  The actual even inverse in the bridge is instead
evaluated in its first spectral gap,

\[
 \lambda_1(\mathscr A_+)<z<\lambda_2(\mathscr A_+),       \tag{5.4}
\]

as proved in `notes/POLE_DELETED_SCALAR_RESERVE_GATE.md`.  Its resolvent has
a negative first-spectral-projection term and positive higher terms, so the
below-spectrum maximum principle does not apply.

## 6. Finite compressions and the exact remaining condition

Orthogonal Fourier projection is not positivity preserving, so continuum
semigroup positivity would not automatically pass to `P_N Q P_N` with the
pointwise cone.  In coefficient space, a real symmetric matrix `H` admits a
diagonal sign gauge `S H S` with all nonzero off-diagonal entries
nonpositive if and only if its signed graph is **antibalanced**:

\[
 \boxed{
 \prod_{j=1}^r\operatorname {sgn}H_{i_j i_{j+1}}=(-1)^r
 \quad\text{on every nonzero cycle},\qquad i_{r+1}=i_1.} \tag{6.1}
\]

Necessity follows because the vertex signs cancel around a cycle;
sufficiency follows by fixing one vertex sign and propagating along a
spanning tree.  This is the smallest finite off-diagonal sign condition for
a diagonal-gauge Perron proof.

The independently ball-assembled source pilot `lambda=2,N=4` used in
`verifier/even_total_positivity_ball_audit.py` has strictly positive raw
entries on both assembly paths.  Hence its natural even block has a positive
off-diagonal triangle, whose product is positive rather than the negative
product required by (6.1).  A scalar shift cannot alter this.  This is a
certified finite failure of the coefficient-gauge route, not an asymptotic
claim.

Finally, write the positive nonpole Levy compression as `mathscr A_+` and
`mathscr A_-`, and retain the exact pole vectors.  Then

\[
 Q_+=m_0I+\mathscr A_++2|p_+\rangle\langle p_+|,
 \qquad
 Q_-=m_0I+\mathscr A_--2|p_-\rangle\langle p_-|.          \tag{6.2}
\]

The pole raises the even sector and lowers the odd sector, exactly the wrong
sign for a formal transfer of the nonpole positive ground.  If `epsilon_+`
is the lowest even eigenvalue, the necessary-and-sufficient arithmetic
comparison is

\[
 \boxed{
 \mathscr A_--zI>0,qquad
 2\langle p_-,(\mathscr A_--zI)^{-1}p_-\rangle<1,
 \qquad z=\epsilon_+-m_0.}                              \tag{6.3}
\]

This is just the exact rank-one Birman--Schwinger form of
`Q_- - epsilon_+ I>0`; it assumes no zeros and is not proved here on an
unbounded schedule.  The coefficient-cone theorem in
`notes/EVEN_GROUND_COEFFICIENT_CONE_AUDIT.md` is an equivalent finite source
criterion once the simple even eigenpair and nonvanishing hypotheses are
known.

Therefore the positivity-improving route stops for a structural reason, not
for lack of a sharper absolute PNT estimate.  A successful direct proof must
establish the source-specific signed comparison (6.3), or its exact
coefficient/ground-transform equivalent, while retaining the pole--prime--
archimedean cancellation.
