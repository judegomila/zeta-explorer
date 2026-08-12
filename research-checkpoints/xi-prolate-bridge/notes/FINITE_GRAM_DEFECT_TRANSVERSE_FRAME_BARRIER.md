# Finite Gram defect: transverse-frame criterion and small-residual barrier

## 0. Claim boundary

This note isolates the exact finite-dimensional inequality left by the
RH-conditional centered-zero Gram decomposition

\[
 L_w=G-\operatorname {diag}(G\mathbf 1),\qquad G=VV^T\succeq0. \tag{0.1}
\]

There are three outcomes.

1.  The feature row sum is exactly the ordinary paired zero-sampling vector
    of the finite projected anchor.  Thus the admitted approximate-divisor
    and Gevrey estimates control one scalar
    `eta=||V^T*1||`, with no meromorphic continuation inserted.
2.  Positivity of (0.1) is exactly a **transverse second-frame** inequality.
    It depends not only on `eta`, but also on the restriction of `G` to
    `1^perp` and on the orientation of `G*1` inside the coordinate diagonal.
    An exact divisor, `eta=0`, would close the Gram defect.  An approximate
    divisor does not.
3.  A three-vertex positive-definite Gram family has arbitrarily small
    `eta`, strictly positive vertex degrees, and a connected positive-edge
    graph, while (0.1) is indefinite.  Scaling the family makes the residual
    smaller than any prescribed absolute rate without changing the sign.

The counterfamily is an abstract Gram family, not the pinned zeta-zero
Cauchy matrix and not the pole--archimedean--minus-prime source.  It proves
that Gram positivity, absolute finite-anchor sampling decay, vertex
positivity, and positive connectivity alone cannot establish the actual
arithmetic theorem.  A separate carrier-lattice argument below shows that
the locked zero count also supplies no transverse lower frame.

No RH, actual-source graph positivity, routing contraction, finite
hyperbolicity, equation (5.2), or Lambda bound is proved.  The formal state
remains `P0_INVALIDATED`.  The binding finite conventions remain those of
`P0_SOURCE_LOCK.json` and `P0_NORMALIZATION_AUDIT.md`.

## 1. The row-sum residual is exactly anchor zero sampling

Assume RH only in this section.  Retain the notation of
`CENTERED_ZERO_GRAM_SIMULTANEOUS_VERTEX_SUBSEQUENCE.md`:

\[
 a_n={2\pi n\over L},\qquad
 f_N(t)={1\over\sqrt L}\sum_{n=0}^Np_n\cos(a_nt),       \tag{1.1}
\]

\[
 H_N(s)=p_0+s^2\sum_{n=1}^N{p_n\over s^2-n^2},
 \qquad s={\gamma L\over2\pi},                         \tag{1.2}
\]

and

\[
 v_{n\gamma}={2\over\sqrt L}
 {\sqrt{1-\cos(\gamma L)}\,\gamma p_n
  \over a_n^2-\gamma^2}.                               \tag{1.3}
\]

Positive ordinates are repeated with algebraic multiplicity.  Put

\[
 V=(v_{n\gamma}),\qquad G=VV^T,qquad
 h=V^T\mathbf1,qquad \eta=\|h\|_2.                   \tag{1.4}
\]

### Proposition 1.1 (exact residual identities)

One has

\[
 \boxed{
 h_\gamma=-{2\over\sqrt L}
 {\sqrt{1-\cos(\gamma L)}\over\gamma}
 H_N\!\left({\gamma L\over2\pi}\right),}             \tag{1.5}
\]

\[
 \boxed{
 \eta^2={4\over L}\sum_{\gamma>0}
 {\{1-\cos(\gamma L)\}\over\gamma^2}
 \left|H_N\!\left({\gamma L\over2\pi}\right)\right|^2,} \tag{1.6}
\]

and

\[
 \boxed{
 (G\mathbf1)_i=-{4p_i\over L}\sum_{\gamma>0}
 {\{1-\cos(\gamma L)\}
  H_N(\gamma L/(2\pi))\over a_i^2-\gamma^2}.}         \tag{1.7}
\]

All resonant values are removable limits.

If

\[
 \widehat f_N(\gamma)=\int_0^Lf_N(t)e^{-i\gamma t}\,dt,
\]

then

\[
 \boxed{
 \widehat f_N(\gamma)=
 {1-e^{-i\gamma L}\over i\gamma\sqrt L}
 H_N\!\left({\gamma L\over2\pi}\right),}             \tag{1.8}
\]

and consequently

\[
 \boxed{
 \eta^2=2\sum_{\gamma>0}|\widehat f_N(\gamma)|^2.}    \tag{1.9}
\]

The right side of (1.9) is the complete two-sided ordinary value-sampling
energy, because the values at `+gamma` and `-gamma` have equal modulus.

**Proof.**  Equation (1.5) is the finite-anchor row-sum identity.  Squaring
and summing gives (1.6), while multiplying (1.3) by (1.5) and summing gives
(1.7).  Direct integration, using `a_n*L=2*pi*n`, gives

\[
 \int_0^L\cos(a_nt)e^{-i\gamma t}\,dt
 ={\gamma(1-e^{-i\gamma L})\over i(\gamma^2-a_n^2)}.
\]

Together with

\[
 \sum_{n=0}^N{p_n\over a_n^2-\gamma^2}
 =-{H_N(s)\over\gamma^2},
\]

this proves (1.8).  Since
`|1-e^(-i*gamma*L)|^2=2*(1-cos(gamma*L))`, equations
(1.6) and (1.8) prove (1.9).  \(\square\)

Thus the existing approximate-divisor estimates really do control `eta`.
They do not yet control the diagonal orientation in (1.7).

## 2. Exact transverse criterion

The next theorem is finite-dimensional and does not assume RH.  Let `G` be
any real positive-semidefinite `d` by `d` matrix, where `d>=2`, and put

\[
 u={\mathbf1\over\sqrt d},\qquad P=I-uu^T,
 \qquad L_G=G-\operatorname {diag}(G\mathbf1).          \tag{2.1}
\]

Write the orthogonal block decomposition of `G` as

\[
 \alpha=u^TGu,\qquad b=PGu\in u^\perp,\qquad
 C=PGP\big|_{u^\perp}.                                 \tag{2.2}
\]

### Theorem 2.1 (transverse second-frame criterion)

If `G=V*V^T` and `eta=||V^T*1||`, then

\[
 \boxed{\alpha={\eta^2\over d},\qquad
 G\mathbf1=\alpha\mathbf1+\sqrt d\,b.}               \tag{2.3}
\]

Moreover `L_G*1=0`, and

\[
 \boxed{
 L_G\succeq0
 \quad\Longleftrightarrow\quad
 C-\alpha I_{u^\perp}
   -\sqrt d\,P\operatorname {diag}(b)P\big|_{u^\perp}
 \succeq0.}                                           \tag{2.4}
\]

Equivalently, for every `x perpendicular to 1`,

\[
 \boxed{
 \|V^Tx\|_2^2
 \geq \left\langle V^T\mathbf1,
                         V^T(x\circ x)\right\rangle.} \tag{2.5}
\]

Here `x circle x` denotes coordinatewise squaring.  Equation (2.4), or the
one-sided oriented inequality (2.5), is the weakest exact remaining Gram-
defect target.

**Proof.**  Since `sqrt(d)*u=1`,

\[
 G\mathbf1=\sqrt d\,Gu
 =\sqrt d(\alpha u+b)=\alpha\mathbf1+\sqrt d\,b.
\]

Also `alpha=||V^T*u||^2=eta^2/d`.  For `x in u^perp`,

\[
 x^TL_Gx=x^TCx-\alpha\|x\|^2
 -\sqrt d\,x^T\operatorname {diag}(b)x,
\]

which proves (2.4).  Finally,

\[
 x^T\operatorname {diag}(G\mathbf1)x
 =\sum_i x_i^2\langle V^Te_i,V^T\mathbf1\rangle
 =\langle V^T(x\circ x),V^T\mathbf1\rangle,
\]

proving (2.5).  \(\square\)

### Corollary 2.2 (exact divisor and sufficient relative gates)

If `eta=0`, then `G*1=0` and

\[
 \boxed{L_G=G\succeq0.}                               \tag{2.6}
\]

For an approximate divisor, either of the following is sufficient:

\[
 \lambda_{\min}(C)\geq
 \alpha+\sqrt d\,
 \lambda_{\max}\!\left(
 P\operatorname {diag}(b)P\big|_{u^\perp}\right),    \tag{2.7}
\]

or the simpler condition

\[
 \boxed{
 \lambda_{\min}(C)\geq {\eta^2\over d}
                         +\eta\sqrt{\|C\|_{\rm op}}.} \tag{2.8}
\]

There is also a cancellation-free sampling sufficient condition

\[
 \boxed{
 \eta\sup_{\substack{x\perp\mathbf1\\x\ne0}}
 {\sqrt{(x\circ x)^TG(x\circ x)}\over x^TGx}\leq1,}  \tag{2.9}
\]

where a zero denominator with nonzero numerator makes the supremum infinite.
The indeterminate `0/0` case is assigned the value zero.

**Proof.**  If `alpha=0`, positivity of the block matrix
`[[alpha,b^T],[b,C]]` forces `b=0`, proving (2.6).  Equation (2.7) follows
from (2.4).  If `alpha>0`, the Schur complement gives

\[
 bb^T\preceq\alpha C,
 \qquad \|b\|_2^2\leq\alpha\|C\|_{\rm op}.            \tag{2.10}
\]

Since the largest Rayleigh quotient of `P*diag(b)*P` is at most
`max_i b_i<=||b||_2`, (2.8) follows from (2.7) and (2.3).  Finally apply
Cauchy--Schwarz to the right side of (2.5) to obtain (2.9).  \(\square\)

The key word in (2.7)--(2.9) is **relative**.  Making `eta` small in an
absolute norm is not enough when the transverse frame collapses faster.

## 3. Why the admitted inputs do not supply the transverse floor

### 3.1 Full sampling determinants see the wrong singular value

Let `T=V^T`.  The all-ones test gives

\[
 \boxed{\sigma_{\min}(T)\leq\|Tu\|={\eta\over\sqrt d}.} \tag{3.1}
\]

Thus an ordinary square Cauchy-minor lower bound for the **full** sampling
map is necessarily capped by the very near-null anchor direction.  The
quantity needed in (2.4) is instead

\[
 \boxed{
 \sigma_{\min}(T|_{\mathbf1^\perp})^2
 =\lambda_{\min}(C),}                                 \tag{3.2}
\]

a deflated second singular value.  This is the same distinction recorded in
`CENTERED_ZERO_PALEY_WIENER_INTERPOLATION_OBSTRUCTION.md`: the projected
anchor collapses the first full-space sampling constant, while no admitted
theorem controls the restricted next singular value.

The coarse anti-carrier Cauchy determinant supplied by the locked zero count
therefore cannot simply be inserted into (2.8).  On the polynomial Gevrey
diagonal its generic determinant floor has logarithm of order at best
`-N^2*log(NL)`, whereas the available anchor sampling upper bound has an
exponent only of order `-lambda*L^2`.  More importantly, the full determinant
does not remove the direction in (3.1).  A source-specific deflated minor or
second-frame theorem would be new input.

### 3.2 The locked zero count permits transverse carrier nulls

The count-compatible all-critical multiset constructed in
`ODD_ZERO_GRAM_LOWER_FRAME_AUDIT.md` is supported on

\[
 \gamma_m={2\pi m\over L_0}
\]

with finite algebraic multiplicities and satisfies the same locked
`T*log(T)+O(log T)` count.  At the lengths `L=k*L_0`, `k>=2`, every ordinate
is a Fourier carrier.  In (1.3) its feature row vanishes away from the one
resonant coordinate `i=k*m`; at resonance it is supported only on that
coordinate.

Consequently, once `N>=3`, choose two distinct indices not divisible by
`k`.  Their coordinate difference lies in `1^perp` and is annihilated by
every feature row.  Hence

\[
 \boxed{\lambda_{\min}(C)=0}                           \tag{3.3}
\]

for this count-compatible critical-line model.  This is not the zeta zero
set.  It proves that RH location plus the pinned multiplicity count cannot
provide (3.2); carrier-scale phase information is indispensable.

### 3.3 Endpoint and Xi-divisible estimates control different data

The endpoint trace is only

\[
 P_N=\lim_{|s|\to\infty}H_N(s).
\]

It does not control the full family `H_N(gamma*L/(2*pi))` in (1.5), much
less the transverse frame (3.2).  The all-order Xi-divisible scalar
convolution controls `J_L`.  After the resonant Green transform, the exact
quotient is

\[
 {\widehat H(z)-\widehat H(\omega)\over z^2-\omega^2},
\]

which is entire but generally no longer divisible by `Xi`.  Therefore the
scalar endpoint flatness cannot be promoted to (2.4).

Finally, the Christoffel--Darboux identity obtained from the Xi zeros has no
finite phases `1-cos(gamma*L)`.  It is the phase average of the sharp Gram
kernel.  Replacing the finite-source kernel by that average, or inserting
`-Xi'/Xi` for the finite truncated transform, is precisely the forbidden
meromorphic critical-line substitution.  De Branges uniqueness is not a
quantitative lower frame, and the compact Paley--Wiener zero density in fact
precludes the required global cardinal interpolation.

## 4. Arbitrarily small residual can remain indefinite

### Theorem 4.1 (full-rank three-vertex barrier)

Let `0<epsilon<=1/2`, put

\[
 v_\epsilon=(1,-1,\epsilon)^T,\qquad
 P_3=I-{1\over3}\mathbf1\mathbf1^T,
 \qquad \delta=\epsilon^4,                             \tag{4.1}
\]

and define

\[
 \boxed{G_\epsilon=v_\epsilon v_\epsilon^T+\delta P_3.} \tag{4.2}
\]

Then:

1. `G_epsilon` is positive definite;
2. `eta^2=1^T*G_epsilon*1=epsilon^2`;
3. every diagonal degree of
   `L_epsilon=G_epsilon-diag(G_epsilon*1)` is positive;
4. the positive-edge graph is connected; but
5. `L_epsilon` has one negative eigenvalue.

More precisely, on `1^perp` its two eigenvalues are

\[
 \boxed{
 \delta+1\pm\sqrt{1+3\epsilon^2},}                    \tag{4.3}
\]

so the smaller one is negative.  For every `tau>0`, replacing `G_epsilon`
by `tau^2*G_epsilon` replaces `eta` by `tau*epsilon` and scales the complete
Laplacian by `tau^2`; its sign is unchanged.  Hence any prescribed absolute
decay rate for the sampling residual is compatible with this failure.

**Proof.**  The quadratic form is

\[
 x^TG_\epsilon x=(v_\epsilon^Tx)^2+\delta\|P_3x\|^2.
\]

If it vanishes, then `x=c*1` and
`v_epsilon^T*x=c*epsilon`; hence `x=0`.  This proves positive definiteness.
Since `P_3*1=0` and `v_epsilon^T*1=epsilon`,

\[
 G_\epsilon\mathbf1=\epsilon v_\epsilon,
 \qquad \mathbf1^TG_\epsilon\mathbf1=\epsilon^2.      \tag{4.4}
\]

In the transverse notation of Theorem 2.1 this also gives

\[
 \alpha={\epsilon^2\over3},\qquad
 b={\epsilon\over\sqrt3}P_3v_\epsilon,
 \qquad \lambda_{\min}(C)=\delta=\epsilon^4.          \tag{4.4a}
\]

Thus the residual tends to zero while the transverse floor collapses still
faster and the oriented diagonal term remains decisive.

The three degrees are

\[
 1-\epsilon+{2\delta\over3},\qquad
 1+\epsilon+{2\delta\over3},\qquad
 {2\delta\over3},                                    \tag{4.5}
\]

and are positive.  The edge weights between vertices `1--2` and `2--3`
are

\[
 1+{\delta\over3},\qquad
 \epsilon+{\delta\over3},                             \tag{4.6}
\]

so the positive graph is connected.  The third edge has weight
`-epsilon+delta/3<0`.

For `delta=0`, the two nonzero eigenvalues of the row-sum-corrected
rank-one matrix have sum `2` and product `-3*epsilon^2`; they are therefore
`1+/-sqrt(1+3*epsilon^2)`.  On `1^perp`, `P_3` is the identity, proving
(4.3).  Finally,

\[
 \sqrt{1+3\epsilon^2}-1
 ={3\epsilon^2\over\sqrt{1+3\epsilon^2}+1}
 >\epsilon^2>\epsilon^4,
\]

for `0<epsilon<=1/2`, so the smaller eigenvalue remains negative.  Scaling
is immediate.  \(\square\)

This family is sharp for the logical issue.  It has the exact Gram-row-sum
form, full rank, all positive one-by-one minors of the Laplacian, and
positive connectivity.  What fails is exactly the transverse inequality
(2.4).

## 5. Surviving actual-source target

The next valid RH-branch advance must prove one of the following for the
actual finite zero-feature matrix on a projection-convergent unbounded
schedule:

1. the oriented matrix inequality (2.4);
2. the nonlinear relative sampling inequality (2.5), or the sufficient
   form (2.9); or
3. a source-specific deflated second-frame theorem controlling (3.2)
   together with the diagonal orientation `b`.

An absolute Gevrey bound for `eta`, the endpoint trace, fixed-vertex degree
positivity, a full-space Cauchy determinant, zero-count rank, the averaged
Christoffel--Darboux kernel, or forbidden critical-line continuation supplies
none of these relative statements.
