# The actual Galerkin residual and exterior-mode amplification

## Scope and outcome

`ZERO_QUOTIENT_SAMPLING_NEXT.md` shows that the negative sampling form of one
hypothetical off-line quartet has exponentially large norm relative to a
verified positive core.  That result deliberately leaves open one possible
escape: perhaps the *actual* mismatch-corrected Galerkin residual is
exponentially almost orthogonal to every high-gain exterior direction.

This note tests that escape without replacing the residual by an arbitrary
polynomial.  It gives four exact conclusions.

1. After all canonical zero contributions are split into their positive and
   negative real-axis pieces, the actual residual has a closed resolvent
   formula.  The complete positive background and exterior reserve remain in
   the positive parent; no term is discarded.
2. The signed Galerkin correction is amplified, not damped, along an old
   sampling eigenmode with eigenvalue `lambda`: its factor is
   `(1-lambda)^(-1)`.  Old-prefix positivity only says `lambda<1`.
3. For a rank-one exterior sample the actual monic Galerkin residual and its
   Schur pivot are explicit in the Christoffel kernel.  There is always an
   open parameter interval on which the old prefix is positive but the next
   pivot is negative, and the residual moves *toward* the exterior kernel
   direction.
4. The same phenomenon persists for an exact quartet-shaped interval density
   by finite-dimensional continuity.  Multiplicity and the removable entire
   quotient are retained.

Thus Galerkin orthogonality, old-prefix positivity, support separation, and
the mere presence of positive background/exterior compensation do not imply
the proposed exponential avoidance.  A proof for Xi would need an additional
quantitative identity coupling the complete-theta mismatch vector to the
sampling spectrum.  The countermodels below are not Xi or theta profiles and
do not decide whether that extra arithmetic identity exists.

No off-line zero, negative Xi pivot, all-degree sign, or RH conclusion is
asserted.

## 1. Exact positive--negative splitting of the target form

Keep the normalization

\[
 F=2\Xi,
 \qquad
 \mathfrak q(p,q)
 ={1\over4\pi}\int_{\mathbb R}
 P_p(x)\overline{P_q(x)}\,\mathcal L[F](x)\,dx,
 \qquad
 \mathcal L[F]=F'^2-FF''.                         \tag{1}
\]

On a fixed real parity ladder put `tilde p(x)=p(ix)` in the even ladder and
`tilde p(x)=-i p(ix)` in the odd ladder.  This fixed parity phase makes the
coordinate polynomial real and preserves polarization.

The canonical zero formula used in
`ZERO_INTEGRATED_COMPENSATION_NEXT.md` is locally normal after grouping real
zeros and functional-equation quartets.  It has no quadratic-exponential
remainder.  A real zero contributes a nonnegative real-axis density.  For one
pair `a+ib,a-ib`, with multiplicity included, the exact entire quotient

\[
 H_{a,b}(z)={F(z)\over (z-a)^2+b^2}                \tag{2}
\]

has removable values at the two zeros, and its folded quartet contribution
on either parity ladder is

\[
 {1\over\pi}\int_{\mathbb R}
 \widetilde p(x)\widetilde q(x)|H_{a,b}(x)|^2
 \{(x-a)^2-b^2\}\,dx.                            \tag{3}
\]

The functional-equation mirror is already included in (3).  Splitting (3)
at `|x-a|=b`, and doing the same for every quartet before taking the
canonical limit, gives positive semidefinite forms `mathcal A` and
`mathcal N` such that on every finite polynomial prefix

\[
 \boxed{\mathfrak q=\mathcal A-\mathcal N.}       \tag{4}
\]

Here `mathcal A` contains all real-zero terms and every exterior positive
piece of every quartet; `mathcal N` contains the exact local interval pieces

\[
 \int_{|x-a|<b}\widetilde p(x)\widetilde q(x)
 |H_{a,b}(x)|^2\{b^2-(x-a)^2\}\,dx.              \tag{5}
\]

Multiplicity multiplies (5).  The locally normal convergence and the
removable-zero extension are exactly those of the canonical-series lemma in
`ZERO_INTEGRATED_COMPENSATION_NEXT.md`.  Consequently (4) is a
finite-dimensional form identity, not an unsigned interchange of a first
logarithmic-derivative series.

The verified-core form of the previous note is only one positive subform of
`mathcal A`.  In this note the *entire* positive parent is retained.

## 2. The signed residual resolvent

Let

\[
 V=\mathcal P_{N-2}^{\epsilon},
 \qquad
 W=V\oplus\operatorname {span}\{p_N\},            \tag{6}
\]

where `p_N` is any monic degree-`N` polynomial of parity `epsilon`.  Assume
`mathcal A` is positive definite on `W` and that the old signed form

\[
 \mathfrak q_V=\mathcal A_V-\mathcal N_V          \tag{7}
\]

is positive definite.  Let `phi_N` be the monic `mathcal A`-orthogonal
residual,

\[
 \phi_N=p_N-P_V^{\mathcal A}p_N,
 \qquad
 \mathcal A(q,\phi_N)=0\quad(q\in V).             \tag{8}
\]

Define the old sampling cross vector

\[
 s(q)=\mathcal N(q,\phi_N),\qquad q\in V,         \tag{9}
\]

and let `u_N in V` be its Riesz representative in the *signed* old metric,

\[
 \mathfrak q_V(q,u_N)=s(q)\qquad(q\in V).        \tag{10}
\]

Then the actual monic signed Galerkin residual is

\[
 \boxed{\pi_N=\phi_N+u_N.}                       \tag{11}
\]

Indeed, for every old `q`,

\[
 \mathfrak q(q,\phi_N+u_N)
 =-\mathcal N(q,\phi_N)+\mathfrak q_V(q,u_N)=0.  \tag{12}
\]

This is the exact Galerkin condition, not a whole-space polynomial bound.
Using (12) once more with `q=u_N` gives the exact pivot identity

\[
 \boxed{
 \mathfrak q[\pi_N]
 =\mathcal A[\phi_N]-\mathcal N[\phi_N]
  -s^*\mathfrak q_V^{-1}s.}                       \tag{13}
\]

Every positive background and exterior contribution remains inside
`mathcal A[phi_N]`, inside the parent projection (8), and inside the old
metric in the last term.  Formula (13) shows why retaining the positive
parent does not by itself prove compensation: the Galerkin correction costs
the additional nonnegative feedback `s^* q_V^(-1) s`.

There is a precise spectral interpretation.  In an `mathcal A_V`-orthonormal
coordinate system put

\[
 T=\mathcal A_V^{-1/2}\mathcal N_V\mathcal A_V^{-1/2},
 \qquad h=\mathcal A_V^{-1/2}s.                   \tag{14}
\]

Old positivity is exactly `I-T>0`.  Equations (10) and (13) become

\[
 \mathcal A_V^{1/2}u_N=(I-T)^{-1}h,               \tag{15}
\]

\[
 s^*\mathfrak q_V^{-1}s
 =h^*(I-T)^{-1}h.                                 \tag{16}
\]

If `T e_j=lambda_j e_j`, then the component of the actual correction along
`e_j` is `h_j/(1-lambda_j)`.  The only consequence of old positivity is
`lambda_j<1`; it supplies no upper bound away from one and no smallness of
`h_j`.  Thus the signed Galerkin resolvent generically amplifies the
near-critical sampling direction.

### Relation to the complete-theta regression mismatch

The same feedback is visible in the theta channel coordinates.  Let `R_X` be
the positive `X`-regression residual of `MISMATCH_THETA_FORMULA.md`, let
`q_X,q_A` be the positive-`X` and actual-target old regressions, and put

\[
 c_N=q_X-q_A,
 \qquad \pi_N=R_X+c_N.                            \tag{17}
\]

With `Q=G_X-G_Y` (twice the old target Gram) and mismatch covector `r`, the
audited identities are

\[
 \boxed{Qc_N=r,
 \qquad r(q)=-2\mathfrak q(q,R_X).}               \tag{18}
\]

Consequently

\[
 \mathfrak q[\pi_N]
 =\mathfrak q[R_X]-\mathfrak q_V[c_N].            \tag{19}
\]

The undivided complete-theta Galerkin operator `mathcal L=B^*B` constructs
`R_X` as a positive normal-equation residual.  It does not relate the spectral
coordinates of `r` in (18) to the exterior sampling eigenvectors in (14).
Equation (18), like (15), contains an inverse old metric and therefore permits
amplification near a small old eigenvalue.  Estimating `r` and that inverse
separately would lose the required correlated compensation.

## 3. Exact rank-one exterior calculation

The amplification is already sharp for one exterior evaluation.  Let `mu`
be any finite positive measure with enough support, let `mathcal A` be its
polynomial `L2` form on one parity ladder, and keep the prefix `V` from (6).
Write

\[
 K_{N-2}^{\epsilon}(x,y)
\]

for the reproducing kernel of `V`, and let `phi_N` and
`h_N=mathcal A[phi_N]` be the monic parent residual and its positive norm.
Fix a real exterior point `a` with `phi_N(a) != 0`, and define

\[
 \mathfrak q_\tau(p,q)
 =\mathcal A(p,q)-\tau p(a)q(a),
 \qquad \tau>0.                                   \tag{20}
\]

For a fixed parity this is the folded form of equal samples at `a` and
`-a`; the harmless factor two is absorbed into `tau`.  Put

\[
 K_-=K_{N-2}^{\epsilon}(a,a),
 \qquad
 K_N=K_-+{\phi_N(a)^2\over h_N}.                  \tag{21}
\]

The old block is positive if and only if

\[
 \tau K_-<1.                                      \tag{22}
\]

Under (22), direct use of the reproducing property in (12) gives the *actual*
signed Galerkin residual

\[
 \boxed{
 \pi_{N,\tau}(x)
 =\phi_N(x)+{\tau\phi_N(a)\over1-\tau K_-}
 K_{N-2}^{\epsilon}(x,a),}                        \tag{23}
\]

and hence

\[
 \boxed{
 \pi_{N,\tau}(a)={\phi_N(a)\over1-\tau K_-}.}    \tag{24}
\]

The residual is not chosen after the fact: (23) is the unique monic
polynomial satisfying
`q_tau(q,pi_(N,tau))=0` for every `q in V`.  Its pivot is

\[
 \boxed{
 \mathfrak q_\tau[\pi_{N,\tau}]
 =h_N-{\tau\phi_N(a)^2\over1-\tau K_-}
 =h_N{1-\tau K_N\over1-\tau K_-}.}               \tag{25}
\]

Because `phi_N(a) != 0`, one has `K_N>K_-`.  Therefore the interval

\[
 \boxed{{1\over K_N}<\tau<{1\over K_-}}           \tag{26}
\]

is nonempty (with `1/K_-=infinity` when `V={0}`).  On (26) the entire old
prefix is strictly positive while the next actual Galerkin pivot is strictly
negative.  Even below the first threshold `1/K_N`, where the new pivot is
still positive, (24) shows enhancement rather than exponential avoidance.

The old sampling operator in this model has top direction
`K_(N-2)^epsilon(.,a)` and eigenvalue `tau K_-`.  Formula (23) says that the
actual Galerkin correction lies exactly in that top direction, with the
resolvent factor `(1-tau K_-)^(-1)` predicted by (15).

### An exact rational instance

Take normalized Lebesgue measure `dmu=dx/2` on `[-1,1]`, the even extension
from `V=span{1}` to degree two, `a=2`, and `tau=1/2`.  Then

\[
 \phi_2(x)=x^2-{1\over3},
 \qquad h_2={4\over45},
 \qquad K_-=1,
 \qquad K_2={609\over4}.                          \tag{27}
\]

The old block is

\[
 \mathfrak q_\tau[1]=1-\tau={1\over2}>0,         \tag{28}
\]

but the unique actual Galerkin residual is

\[
 \boxed{\pi_{2,\tau}(x)=x^2+{10\over3}},          \tag{29}
\]

since `q_tau(1,pi_(2,tau))=0`.  Its exterior value is doubled,

\[
 \pi_{2,\tau}(2)={22\over3}
 =2\phi_2(2),                                     \tag{30}
\]

and its exact pivot is

\[
 \boxed{\mathfrak q_\tau[\pi_{2,\tau}]
 =-{601\over45}<0.}                               \tag{31}
\]

This is a signed-measure model of the Galerkin geometry, not a Xi or theta
counterexample.

## 4. Exact quartet-shaped interval stability

The rank-one calculation is not an artifact of using a point mass.  Fix
`a>T` and let `0<b<a-T`.  For an entire function `H_b` with no zero on the
closed interval, define the normalized positive measure

\[
 d\nu_b(x)
 ={\mathbf1_{|x-a|<b}
 |H_b(x)|^2\{b^2-(x-a)^2\}\,dx\over
 \int_{|y-a|<b}|H_b(y)|^2\{b^2-(y-a)^2\}\,dy}.   \tag{32}
\]

Add its functional-equation mirror and fold to one fixed parity.  Equation
(32) has exactly the local quartet density (5), including the removable
entire quotient.  If, after the rescaling `x=a+bu`, the functions
`H_b(a+bu)` converge uniformly to a nonzero constant, then

\[
 \int p(x)q(x)d\nu_b(x)\longrightarrow p(a)q(a)  \tag{33}
\]

for every pair of polynomials in the fixed finite space `W`.  This is simply
weak convergence after the exact `b^3` change of variables; no unproved
simultaneous `b -> 0`, `N -> infinity` limit is used.

Choose `tau` strictly inside (26) and replace the point sample in (20) by
`tau nu_b`.  All old Gram entries, the old inverse, the actual residual
coefficients, and the Schur pivot depend continuously on these finitely many
moments.  Hence for every sufficiently small *positive* `b`:

- the old signed prefix remains positive;
- the unique monic residual obeys the exact interval Galerkin equations; and
- its next pivot remains negative.

The conclusion is unchanged by a quartet multiplicity `m>=1`; it only
rescales `tau` by `m`.  It is also stable under adding arbitrary sufficiently
small positive background or exterior measures to `mathcal A`.  More
generally, formulas (20)--(26) hold with any already assembled positive parent,
so positive background need not be absent.

This continuity statement is a method countermodel.  It does not assert that
the actual Xi quotients `H_(a,b)` form the uniform family assumed in (33), nor
that an off-line Xi quartet exists.

## 5. What a theta-specific alignment theorem must add

The full-compensation pivot (13) is nonnegative exactly when

\[
 \boxed{
 \mathcal A[\phi_N]-\mathcal N[\phi_N]
 \geq s^*\mathfrak q_V^{-1}s.}                   \tag{34}
\]

This is the positive-parent analogue of the paid-Schur inequality.  It is an
exact combined-vector target, not a new proof: the rank-one model saturates
its Christoffel geometry and shows that no source-free estimate can establish
it from old positivity.

In the eigenbasis (14), a useful source-specific theorem would have to control
the *correlated* vector and gap together, for example through an identity that
forces

\[
 \sum_j{|h_j|^2\over1-\lambda_j}
 \leq \mathcal A[\phi_N]-\mathcal N[\phi_N].      \tag{35}
\]

Equivalently, in the theta-channel coordinates it must control the mismatch
`r` together with the old target inverse in (18).  Separate bounds for `r`,
the Christoffel kernel, the old minimum eigenvalue, or the negative sampling
mass reproduce the losses already exposed by (15)--(16).

There are therefore two genuinely live possibilities:

1. derive a complete-theta modular/orbit identity aligning `r` away from the
   near-unit sampling spectrum; or
2. prove (34) directly while retaining the entire positive exterior and
   background parent, rather than replacing it by the verified core alone.

The signed Galerkin equations, the positive normal equation for `R_X`, and
finite zero verification do not supply either statement on their own.

## Nonclaims

- No off-line quartet is asserted to exist.
- The rank-one and interval models are not generated by the complete theta
  profile and are not counterexamples to any certified Xi rung.
- Formula (4) is used only in finite-dimensional polarized form, with
  canonical grouping, multiplicities, and removable real-axis values
  retained.
- The interval argument fixes the degree before taking `b -> 0`; it makes no
  degree-uniform equicontinuity claim.
- Equations (13), (34), and (35) are exact reductions or theorem-shaped
  targets.  They do not prove a new Xi pivot, the first Laguerre sign, an
  all-degree theorem, or RH.
