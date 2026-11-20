# What drift renormalization can and cannot do

## Scope

This note asks whether the high-frequency residue-drift obstruction in
`M0_FIXED_TAU_NO_GO.md` can be removed without changing the frozen-residue
form.  There is an exact graph completion which leaves one negative square,
but it is conditional on the endpoint target sign and is not a graph inside
the original target Hilbert space.  A finite constant-coefficient collection
of residue boundary jets also cannot cancel the obstruction.  These are
route diagnostics, not an endpoint sign theorem or an RH result.

Throughout, on one fixed parity ladder,

\[
 A[p]=\frac1\pi\int_{\mathbb R}
 f(\nu)|p(i\nu)|^2\,d\nu,
 \qquad f=\Xi'^2-\Xi\Xi'',                         \tag{1}
\]

and

\[
 M_0=A+vd^*+dv^*.                                  \tag{2}
\]

The Hilbert-space statements below are made on the conditional branch
`f>=0`; the complementary branch is handled by the established unbounded
negative-inertia argument.

## Exact minimal one-negative-square completion

For every `lambda>0`, define the positive and negative boundary combinations

\[
 a_\lambda(p)=\frac{\sqrt\lambda\,d(p)
                   +\lambda^{-1/2}v(p)}{\sqrt2},
 \qquad
 b_\lambda(p)=\frac{\sqrt\lambda\,d(p)
                   -\lambda^{-1/2}v(p)}{\sqrt2},     \tag{3}
\]

and put

\[
 \mathcal P_\lambda[p]=A[p]+|a_\lambda(p)|^2.        \tag{4}
\]

The signature decomposition of the scalar cross term gives the exact identity

\[
 \boxed{M_0[p]=\mathcal P_\lambda[p]-|b_\lambda(p)|^2.} \tag{5}
\]

The `2x2` coefficient form underlying `vd^*+dv^*` has signature `(1,1)`, so
(5) is its canonical one-positive/one-negative signature decomposition; it
is rank-minimal whenever `v` and `d` are independent.  One positive boundary
square is moved into a graph metric and one negative boundary square remains.
On every finite prefix with `A_N>=0`, it immediately gives
`n_-(M_(0,N))<=1`.  This is the familiar endpoint-conditional inertia bound
in an explicit boundary-graph form; it does not prove `A_N>=0`.

The all-prefix positivity of the first term in (5) is not a weaker target.
If `f` is negative on an open interval, parity-polynomial density gives
`n_-(A_N)` tending to infinity.  Since the positive boundary term has rank
one,

\[
 n_-(\mathcal P_{\lambda,N})
 \geq n_-(A_N)-1,                                    \tag{6}
\]

for every choice of `lambda`, even if `lambda` is allowed to depend on `N`.
Hence some `\mathcal P_(lambda,N)` prefix is indefinite.  Conversely, if
`f>=0`, then every `P_lambda` is nonnegative.  Thus

\[
 \boxed{
 \mathcal P_{\lambda,N}\succeq0\text{ on all prefixes}
 \quad\Longleftrightarrow\quad f\geq0,
 }                                                     \tag{7}
\]

for every fixed `lambda>0`.  More strongly, if an arbitrary positive sequence
`lambda_N` made `P_(lambda_N,N)` nonnegative for every prefix, then (6) would
still force `f>=0`; conversely, `f>=0` permits every such sequence.  The graph
completion repackages the endpoint sign; it cannot establish it for free.

Moreover, demanding the negative square in (5) be contractive,

\[
 |b_\lambda(p)|^2\leq\mathcal P_\lambda[p],          \tag{8}
\]

is exactly `M_0[p]>=0`.  The fixed-tau obstruction already proves that (8)
cannot hold on every prefix.  Formula (5) therefore preserves the viable
one-negative-direction formulation while cleanly separating it from the
refuted all-prefix positivity formulation.

## The graph completion is not a graph in the target Hilbert space

The exact residue EGF is

\[
 E(t)=3(1-e^{2t})
 \exp\!\left(\frac{5t}{2}-\frac32(e^{2t}-1)\right),
 \qquad D(t)=tE(t),                                   \tag{9}
\]

and

\[
 d(p)=\frac1{2\pi}\int_{\mathbb R}
 p(i\nu)\widehat D(\nu)\,d\nu.                     \tag{10}
\]

On the branch `f>=0`, the proof in `M0_FIXED_TAU_NO_GO.md` gives

\[
 \int_{\mathbb R}
 \frac{|\widehat D^{(j)}(\nu)|^2}{f(\nu)}
 \,d\nu=\infty                                      \tag{11}
\]

for `j in {0,1}`, where the superscript denotes the even or odd projection.
The half-line kernel representing `v` is lower order, so the
same divergence holds for both `a_lambda` and `b_lambda` for every fixed
finite `lambda`.  Polynomial density and analytic moment uniqueness then show
that these boundary functionals are unbounded on the target completion
`H_A`.

For a densely defined scalar functional `T:D(T) subset H -> C`, closability
already implies boundedness: if `T` is closable, the domain of `T^*` is dense
in the one-dimensional codomain, hence equals `C`; the vector `T^*1`
represents `T` on its dense domain.  Therefore `a_lambda`, and likewise
`b_lambda`, is not closable on `H_A`.

Consequently the completion of polynomials in the norm `P_lambda` is a
genuine boundary enlargement: its continuous map to `H_A` has a nonzero
vertical kernel.  It is not the graph of a closed boundary operator inside
the original target Hilbert space.  Concretely, unboundedness supplies
polynomials `p_n` with `a_lambda(p_n)=1` and `||p_n||_A -> 0`.  They are
Cauchy in the `P_lambda` norm, converge there to a vector of norm one, and
map to zero in `H_A`.

This distinction prevents a circular move.  One may use (5) as an exact
finite-prefix Pontryagin decomposition, but one may not invoke an abstract
closed-graph or contractive-extension theorem on `H_A`; the necessary
boundary operator is not closable there.

## No finite residue-jet cancellation

The obstruction is stable under finite constant-coefficient boundary-jet
renormalization.  For `k>=0`, put

\[
 r_k(p)=e(p^{(k)}),
 \qquad
 H_k(\nu)=\widehat{t^kE(t)}(\nu)
          =(i\partial_\nu)^k\widehat E(\nu).          \tag{12}
\]

Thus `r_0=e` and `r_1=d`.  These are actual shifted first-orbit traces, not
formal auxiliary jets.  With
`delta=log(2 pi/3)/2`, `kappa_0=exp(3/2+delta/2)/6`, and the first theta
orbit `psi_1` from `M0_REAL_LINE_TRACE_KERNEL.md`,

\[
 r_k(p)=-\kappa_0[p^{(k)}(D)\psi_1](-\delta).
\]

From the exact gamma formula for `Ehat`, for positive `nu`,

\[
 L(\nu):=i\partial_\nu\log\widehat E(\nu)
 =\frac12\log\frac{\nu}{3}-\frac{i\pi}{4}
  +O(\nu^{-1}).                                      \tag{13}
\]

The recurrence

\[
 \frac{H_{k+1}}{\widehat E}
 =L\frac{H_k}{\widehat E}
  +i\partial_\nu\!\left(\frac{H_k}{\widehat E}\right)
\]

gives, for every fixed `k`,

\[
 \frac{H_k(\nu)}{\widehat E(\nu)}
 =L(\nu)^k+o((\log\nu)^k).                           \tag{14}
\]

Let `c_0,...,c_m` be real constants with `c_m!=0`.  Equations (13)--(14)
imply

\[
 \sum_{k=0}^m c_kH_k(\nu)
 =c_m\widehat E(\nu)L(\nu)^m(1+o(1)).               \tag{15}
\]

Since

\[
 |\widehat E(\nu)|\asymp
 \nu^{7/4}e^{-\pi\nu/4},                            \tag{16}
\]

no nonzero finite jet combination cancels its highest logarithmic order.
In particular, adding `r_0` to `d=r_1` cannot cancel the logarithm in (14),
while adding any `r_k` with `k>=2` introduces a still higher power of the
logarithm.

The gamma phase has derivative
`-log(nu/3)/2+O(1/nu)`.  The extra phase of `L^m` has negligible derivative,
so the same positive-density dyadic phase sectors used for the drift apply
separately to the real and imaginary parity projections of (15).  Together
with

\[
 0\leq f(\nu)\ll_\eta
 e^{-\pi\nu/2}\nu^{4+\eta},                         \tag{17}
\]

where `eta>0` may be chosen below `1/2`, they give, for every nonzero finite
jet combination and `j in {0,1}`,

\[
 \int_{\mathbb R}
 \frac{\left|\left(\sum c_kH_k\right)^{(j)}
       (\nu)\right|^2}{f(\nu)}\,d\nu=\infty         \tag{18}
\]

in both parity sectors.  Hence no finite constant-coefficient collection of
residue jets produces a bounded target trace.  The conclusion includes the
naive scalar boundary-jet cancellation already obstructed at grades two and
four in `M0_THETA_ORBIT_REFLECTION.md`, but (18) is an all-frequency
obstruction rather than a two-grade calculation.

## Consequence for proof design

There are only three honest uses of the drift channel exposed here.

1. Retain it as the single negative square in (5), while proving the actual
   endpoint target sign by independent theta-specific information.
2. Keep the full corrected-feature/residue/drift graph in the directional
   paid-Schur inequality, where the actual graded theta vector is restricted
   and no universal trace bound is asserted.
3. Introduce a genuinely nonlocal or infinite-order cancellation with the
   same gamma-logarithmic asymptotic.  Such a channel would need an exact
   source identity; adding it as a penalty would change the theorem.

A finite boundary penalty can move the drift obstruction between positive
and negative squares, but cannot remove it from the exact form.  A successful
continuation must therefore retain one controlled negative direction or
return to the actual directional Schur payment rather than seek another
all-prefix positive graph metric.

## Nonclaims

- This note does not prove `f>=0`, `n_-(M_(0,N))<=1`, or RH.
- It does not show that every conceivable infinite-order theta identity is
  impossible.
- It does not locate the first prefix where `M_0` loses positivity.
- The graph identity (5) is exact algebra; its positivity interpretation is
  conditional on the endpoint target sign.
