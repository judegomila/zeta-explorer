# Actual zero feature: deflated Cauchy frames and the relative barrier

## 0. Claim boundary

This note attacks the transverse frame left by the RH-conditional identity

\[
 L_w=G-\operatorname {diag}(G\mathbf 1),\qquad G=VV^T\succeq0. \tag{0.1}
\]

The conclusions are finite and fail-closed.

1. Every `N`-row deflated minor has an exact Cauchy formula.  Besides the
   ordinary phase and Vandermonde factors, it contains one explicit
   actual-anchor orientation divided difference `Theta_Gamma`.  Exact
   Cauchy--Binet expresses the complete transverse determinant as a sum of
   the squares of these minors.
2. Using `N+1` rows removes that orientation cancellation.  A column-volume
   identity factors out the near-null all-ones direction and gives a genuine
   lower bound for the deflated second singular value in terms of a square
   Cauchy determinant and the selected anchor residual.
3. At a nonresonant length, infinitely many distinct zero rows give a sharp
   qualitative kernel classification.  The transverse Gram is positive
   definite exactly when at most one displayed anchor coordinate vanishes.
   This proves existence of some finite deflated frame, but gives no useful
   quantitative floor.
4. An exact carrier is not automatically destructive.  An in-band carrier
   has a removable one-coordinate row, whereas an out-of-band carrier row
   vanishes.  The pinned count and anti-carrier averaging control neither
   carrier coverage nor the anchor factors at the relative scale required
   by (0.1).

The actual zero-feature representation itself is used only under RH.  The
linear-algebra and Cauchy identities apply to any finite real ordinate set.
No statement below proves RH, an actual-source transverse lower frame, the
diagonal orientation, positive routing, finite hyperbolicity, equation
(5.2) of `DIRECT_RH_ATTACK.md`, or a Lambda bound.  The formal state remains
`P0_INVALIDATED`.  No zero table, new external source, or meromorphic
`Xi'/Xi` continuation is used.

## 1. The exact finite analysis map

Put

\[
 d=N+1,\qquad a_n={2\pi n\over L},\qquad
 \xi_n=a_n^2\quad(0\leq n\leq N).                    \tag{1.1}
\]

Assume RH when the ordinates below are the actual zeta ordinates.  For each
distinct positive ordinate `gamma`, let `m_gamma` be its algebraic
multiplicity and set

\[
 z_\gamma=\gamma^2,\qquad
 \theta_\gamma=1-\cos(\gamma L),\qquad
 r_\gamma=\sqrt {m_\gamma}\,{2\over\sqrt L}
              \sqrt{\theta_\gamma}\,\gamma.          \tag{1.2}
\]

Collapsing the repeated identical rows by `sqrt(m_gamma)`, define

\[
 T_{\gamma n}={r_\gamma p_n\over\xi_n-z_\gamma}.
                                                               \tag{1.3}
\]

Every carrier value is interpreted by the removable convention in Section
5.  With one separate row per algebraic occurrence, (1.3) is the transpose
of the feature matrix in
`CENTERED_ZERO_GRAM_SIMULTANEOUS_VERTEX_SUBSEQUENCE.md`.  Thus

\[
 G=T^*T.                                               \tag{1.4}
\]

Let

\[
 u={\mathbf1\over\sqrt d},\qquad
 P=I-uu^T,                                             \tag{1.5}
\]

and let `Q` be any `d` by `N` real matrix with

\[
 Q^TQ=I_N,\qquad QQ^T=P.                              \tag{1.6}
\]

The transverse Gram and the complete row-sum residual are

\[
 C=Q^TGQ,\qquad h=T\mathbf1,\qquad \eta=\|h\|_2.     \tag{1.7}
\]

We identify the coordinate matrix \(Q^TGQ\) with the corresponding
restriction of \(G\) to \(\mathbf1^\perp\); vectors in that restriction may
therefore still be written in their original \(d\) coordinates.

The exact finite-anchor identity gives

\[
 h_\gamma=-{2\sqrt {m_\gamma}\over\sqrt L}
 {\sqrt{1-\cos(\gamma L)}\over\gamma}
 H_N\!\left({\gamma L\over2\pi}\right).             \tag{1.8}
\]

Consequently the Gevrey and approximate-divisor inputs control `eta`.  They
do not by themselves control the restriction `TQ`.

## 2. Exact deflated Cauchy--Binet formula

Choose `N` distinct positive ordinates

\[
 \Gamma=\{\gamma_1,\ldots,\gamma_N\},\qquad
 z_j=\gamma_j^2,                                      \tag{2.1}
\]

and let `T_Gamma` be the corresponding `N` by `d` submatrix.  Define

\[
 D(y)=\prod_{n=0}^N(y-\xi_n),\qquad
 Q_\Gamma(y)=\prod_{j=1}^N(y-z_j),                    \tag{2.2}
\]

and the homogeneous degree-`N` anchor expression

\[
 \boxed{
 \Theta_\Gamma(p)=
 \sum_{n=0}^N
 {Q_\Gamma(\xi_n)\over D'(\xi_n)}
 \prod_{\substack{0\leq m\leq N\\m\ne n}}p_m.}    \tag{2.3}
\]

Write

\[
 \Delta(\xi)=\prod_{0\leq n<k\leq N}(\xi_k-\xi_n),
 \qquad
 \Delta(z)=\prod_{1\leq j<k\leq N}(z_k-z_j).         \tag{2.4}
\]

### Theorem 2.1 (deflated minor)

Away from carriers,

\[
 \boxed{
 |\det(T_\Gamma Q)|={1\over\sqrt d}
 \left|\prod_{\gamma\in\Gamma}r_\gamma\right|
 { |\Delta(\xi)\Delta(z)|
  \over\displaystyle\prod_{\gamma\in\Gamma}
                     \prod_{n=0}^N|\xi_n-\gamma^2|}
 |\Theta_\Gamma(p)|.}                                \tag{2.5}
\]

The formula extends continuously through every in-band carrier.  It is a
polynomial identity in the coordinates `p_n`, so no division by a possibly
zero anchor coordinate is hidden in (2.5).

**Proof.**  Let `S` be the `d` by `N` difference matrix with columns
`e_i-e_0`, `1<=i<=N`.  Subtracting the zeroth column from every other column
in the bordered matrix gives

\[
 \left|\det\begin{pmatrix}\mathbf1^T\\T_\Gamma\end{pmatrix}\right|
 =|\det(T_\Gamma S)|.                                 \tag{2.6}
\]

Since `S^T*S=I+11^T`, one has `det(S^T*S)=d`.  Comparing `S` with an
orthonormal basis `Q` of the same range yields

\[
 |\det(T_\Gamma Q)|={|\det(T_\Gamma S)|\over\sqrt d}.
                                                               \tag{2.7}
\]

Initially suppose every `p_n` is nonzero.  Factor `p_n` from column `n`
and `r_gamma` from each lower row of the bordered determinant.  The lower
block is the rectangular Cauchy array

\[
 {1\over\xi_n-z_j}.                                   \tag{2.8}
\]

Its one-dimensional right nullspace is generated by

\[
 q_n={Q_\Gamma(\xi_n)\over D'(\xi_n)}.                \tag{2.9}
\]

Indeed, Lagrange interpolation of the degree-`N` polynomial `Q_Gamma` at
the `N+1` nodes `xi_n`, followed by evaluation at `z_j`, gives

\[
 \sum_{n=0}^N{q_n\over\xi_n-z_j}=0.                  \tag{2.10}
\]

The Cauchy cofactor formula therefore gives the product in (2.5) times

\[
 \left(\prod_{n=0}^Np_n\right)
 \sum_{n=0}^N{q_n\over p_n}=\Theta_\Gamma(p).         \tag{2.11}
\]

Equations (2.6)--(2.11) prove (2.5).  Polynomial continuity removes the
temporary nonvanishing assumption on `p`.  The carrier extension follows
from Section 5.  \(\square\)

### Corollary 2.2 (complete transverse determinant)

For fixed \(N\) and \(L\), the large-ordinate row norm in (1.3) is
\(O_N(\sqrt{m_\gamma}/\gamma)\).  The pinned zero count, equivalently the
convergence of \(\sum_\gamma m_\gamma/\gamma^2\), therefore makes \(T\)
Hilbert--Schmidt.  Finite row truncations converge in Hilbert--Schmidt norm,
so finite Cauchy--Binet passes to the following nonnegative limit.

With distinct ordinates collapsed as in (1.2), infinite-dimensional
Cauchy--Binet gives

\[
 \boxed{
 \det C=\sum_{\substack{\Gamma\subset\mathcal Z_+^\sharp\\
                         |\Gamma|=N}}
             |\det(T_\Gamma Q)|^2.}                  \tag{2.12}
\]

Equivalently, if the rows are not collapsed, only selections with distinct
ordinates survive and each summand occurs `prod_(gamma in Gamma) m_gamma`
times.  Formula (1.2) incorporates exactly that factor.

For every one finite subset with `det(T_Gamma*Q)!=0`,

\[
 \boxed{
 \lambda_{\min}(C)\geq
 { |\det(T_\Gamma Q)|^2
  \over \|T_\Gamma Q\|_{\rm op}^{\,2(N-1)}}.}       \tag{2.13}
\]

The operator norm in the denominator may be replaced by the larger
Frobenius norm.  This is an exact finite-subset deflated frame certificate.
It is not useful until every factor in (2.5), especially `Theta_Gamma`, is
controlled at the required relative scale.

## 3. What `Theta_Gamma` measures

Define the finite anchor numerator

\[
 A_p(y)=\sum_{n=0}^Np_n{D(y)\over y-\xi_n},
 \qquad P_\infty=\sum_{n=0}^Np_n.                    \tag{3.1}
\]

Thus

\[
 A_p(\xi_n)=p_nD'(\xi_n),\qquad
 [y^N]A_p=P_\infty.                                  \tag{3.2}
\]

### Proposition 3.1 (exact root-placement identity)

Suppose `P_infinity!=0` and the `N` roots of `A_p`, with multiplicity, are
the numbers `z_1,...,z_N`.  Then

\[
 Q_\Gamma(y)={A_p(y)\over P_\infty}                  \tag{3.3}
\]

and

\[
 \boxed{
 \Theta_\Gamma(p)={d\over P_\infty}
                       \prod_{n=0}^Np_n.}            \tag{3.4}
\]

**Proof.**  Both sides of (3.3) are monic degree-`N` polynomials with the
same roots.  Equations (3.2)--(3.3) give

\[
 {Q_\Gamma(\xi_n)\over D'(\xi_n)}={p_n\over P_\infty}.
\]

Insert this into (2.3); all `d` summands equal
`prod_m p_m/P_infinity`.  \(\square\)

This identity explains the orientation factor.  If the selected ordinates
were the exact finite-anchor roots, `Theta_Gamma` would not have an
additional signed cancellation.  The actual Xi zeros merely make the
finite transform small in a weighted value norm.  Turning those small
values into stable matching of all `N` roots requires separation, endpoint
control when `P_infinity` is small, and exclusion of roots escaping through
projective infinity.  Those are the unresolved finite hyperbolicity and
no-escape inputs.  The Gevrey value residual alone does not prove (3.3) or a
lower perturbative version of (3.4).

## 4. A square Cauchy determinant that factors out the anchor residual

Choose `d=N+1` distinct positive ordinates

\[
 \Lambda=\{\gamma_0,\ldots,\gamma_N\}.               \tag{4.1}
\]

For the square matrix `T_Lambda`, the ordinary Cauchy determinant is

\[
 \boxed{
 |\det T_\Lambda|=
 \left|\prod_{\gamma\in\Lambda}r_\gamma\right|
 \left|\prod_{n=0}^Np_n\right|
 { |\Delta(\xi)\Delta(z_\Lambda)|
  \over\displaystyle\prod_{\gamma\in\Lambda}
                    \prod_{n=0}^N|\xi_n-\gamma^2|}.} \tag{4.2}
\]

Again, (4.2) has the continuous carrier convention.  Put

\[
 \eta_\Lambda=\|T_\Lambda\mathbf1\|_2,
 \qquad B_\Lambda=T_\Lambda Q.                       \tag{4.3}
\]

### Theorem 4.1 (residual-deflated column volume)

If `det(T_Lambda)!=0`, then `eta_Lambda>0` and

\[
 \boxed{
 \det(B_\Lambda^TB_\Lambda)
 \geq {d|\det T_\Lambda|^2\over\eta_\Lambda^2}.}    \tag{4.4}
\]

Consequently

\[
 \boxed{
 \lambda_{\min}(C)\geq
 {d|\det T_\Lambda|^2
  \over
  \eta_\Lambda^2\|B_\Lambda\|_{\rm op}^{\,2(N-1)}}
 \geq
 {d|\det T_\Lambda|^2
  \over
  \eta^2\|B_\Lambda\|_{\rm F}^{\,2(N-1)}}.}        \tag{4.5}
\]

**Proof.**  In the orthonormal domain basis `(u,Q)`, the columns of
`T_Lambda` are

\[
 T_\Lambda u={T_\Lambda\mathbf1\over\sqrt d},
 \qquad B_\Lambda.                                   \tag{4.6}
\]

The absolute determinant is the `N`-dimensional volume of the columns of
`B_Lambda` times the distance of `T_Lambda*u` from their range.  This
distance is at most `eta_Lambda/sqrt(d)`, proving (4.4).  Bound the other
`N-1` singular values by the operator norm to obtain the first inequality
in (4.5).  Finally `C` contains `B_Lambda^T*B_Lambda` in Loewner order,
`eta_Lambda<=eta`, and the Frobenius norm dominates the operator norm.
\(\square\)

This is the correct determinant operation for a near divisor: it removes
the collapsing first full-space singular direction before estimating the
next singular value.  It still needs a lower bound for every anchor factor
in (4.2).  The admitted source results prove no simultaneous lower bound for
`prod_n |p_n|` up to a growing cutoff.

Combining (4.5) with the sufficient gate of
`FINITE_GRAM_DEFECT_TRANSVERSE_FRAME_BARRIER.md` would prove positivity if

\[
 {d|\det T_\Lambda|^2
  \over\eta_\Lambda^2
           \|B_\Lambda\|_{\rm op}^{2(N-1)}}
 \geq {\eta^2\over d}+\eta\sqrt{\|C\|_{\rm op}}.     \tag{4.7}
\]

Equation (4.7) is a new exact scalar certificate, not an established
actual-source inequality.  It also uses only the norm bound on the
diagonal orientation `b=PGu`; proving the oriented matrix inequality
directly could be sharper.

## 5. Qualitative rank and exact carrier branches

### 5.1 Nonresonant kernel classification

Let `Z_p={n:p_n=0}`.  Call a length fully nonresonant if

\[
 {\gamma L\over2\pi}\notin\mathbb Z
 \quad\hbox{for every distinct positive ordinate }\gamma. \tag{5.1}
\]

The exceptional set of lengths is countable.  The multiplicity-aware zero
count tends to infinity, and every zero of an entire function has finite
algebraic multiplicity, so there are infinitely many distinct ordinates.

### Theorem 5.1 (sharp qualitative kernel)

Assume RH and let `L` be fully nonresonant.  Then

\[
 \boxed{
 \ker C=\{x:\operatorname {supp}x\subseteq Z_p,
                    \ \mathbf1^Tx=0\}.}              \tag{5.2}
\]

In particular,

\[
 \boxed{C\succ0\quad\Longleftrightarrow\quad |Z_p|\leq1.} \tag{5.3}
\]

**Proof.**  If `x` is in the kernel, positivity and (1.3) give, at every
distinct ordinate,

\[
 \sum_{n=0}^N{p_nx_n\over\xi_n-\gamma^2}=0.          \tag{5.4}
\]

The left side is a rational function of `y=gamma^2` whose numerator has
degree at most `N`.  It vanishes at infinitely many distinct values, hence
is identically zero.  Uniqueness of partial fractions gives `p_n*x_n=0`
for every `n`.  Intersecting the resulting coordinate subspace with
`1^perp` proves (5.2).  Its dimension is `max(|Z_p|-1,0)`, proving (5.3).
\(\square\)

If `C` is positive definite, finite partial Gram sums converge to it in
finite dimension.  Therefore some finite collection of zero rows already
has a positive deflated frame, and some summand in (2.12) is nonzero.  This
is qualitative existence only: it neither identifies the subset from the
pinned count nor bounds its smallest singular value.

One zero anchor coordinate is tolerated by `C`, but not by the strict graph
gate.  If `p_k=0`, every feature incident to vertex `k` vanishes, the full
row-sum-corrected Laplacian has an isolated vertex, and its transverse
kernel is nontrivial.  Thus strict actual routing requires `Z_p` to be
empty.  Simultaneous nonvanishing of all actual coordinates up to a growing
cutoff is itself an open obligation.

### 5.2 Removable and destructive carriers

Suppose `gamma=a_k` for an integer `k>=1`.  As `gamma` tends to `a_k`,

\[
 \sqrt{1-\cos(\gamma L)}
 ={L\over\sqrt2}|\gamma-a_k|+o(|\gamma-a_k|),         \tag{5.5}
\]

and

\[
 a_k^2-\gamma^2=-2a_k(\gamma-a_k)\{1+o(1)\}.         \tag{5.6}
\]

Thus, up to the irrelevant sign of a Gram row,

\[
 \boxed{
 T_{\gamma,\cdot}\longrightarrow
 \begin{cases}
  \sqrt{m_\gamma L/2}\,p_k e_k^T,&1\leq k\leq N,\\
  0,&k>N.
 \end{cases}}                                        \tag{5.7}
\]

An in-band carrier is therefore a coordinate selector, not a zero row.  An
out-of-band carrier is genuinely lost.  A lattice-supported zero model can
sample only a proper congruence class of coordinates and make `C` singular,
as in the earlier count-compatible carrier audit.  On the other hand, a
continuously chosen length can avoid any prescribed finite set of carrier
equalities.  Neither statement supplies anti-carrier control on the locked
strict-half-integer grid for a number of rows growing with `N`.

## 6. Density and conditioning on the logarithmic schedules

Let `L=2*log(lambda)` and suppose

\[
 N=\lambda^\kappa L^{O(1)}.                           \tag{6.1}
\]

The highest carrier is `a_N=2*pi*N/L`.  The main term of the positive zero
count below that carrier is

\[
 M(a_N)={N\over L}\log {N\over eL},                  \tag{6.2}
\]

so

\[
 {M(a_N)\over N}={\kappa\over2}
                  +O\!\left({\log L\over L}\right). \tag{6.3}
\]

For the natural cutoff and the polynomial Gevrey cutoff, `kappa=1`; only
about half as many zero occurrences as coordinates lie below the carrier
band.  This count retains algebraic multiplicity, so it is not a lower
bound for the number of distinct sampling rows.

The pinned count does give a constant-density one-separated distinct
subset.  To obtain `N` distinct rows from that theorem one must reach
height `T=O(N)`, whereas `a_N=O(N/L)`.  The selected rows can therefore be a
factor of order `L` above the sampled band.  Inserting those rows into the
Cauchy formula gives only the far-Cauchy determinant certificate already
seen in the anti-carrier audit, schematically

\[
 \exp\{-O(N^2\log(NL))\}.                             \tag{6.4}
\]

On `N=ceil(lambda*L^3)`, the available Gevrey exponent is of order
`lambda*L^2=N/L`.  Dividing the determinant by the selected residual in
(4.5) cannot bridge the `N^2` conditioning loss.  The missing lower bounds
for `prod|p_n|` or `Theta_Gamma` only worsen (6.4).

The density-matched exponent is `kappa=2`, but (6.2) still counts
multiplicity.  It does not put one distinct ordinate into every carrier
cell of width `2*pi/L`, and its endpoint error is much larger than the
expected count of one cell.  A useful near-diagonal Cauchy frame would need
both a carrier-scale distinct-zero theorem and an actual-anchor
nonlacunarity theorem.

Logarithmic phase-product averaging can choose a continuous length at which
the selected finite phase product is nonzero.  The full determinant is then
nonzero only if its anchor coordinates and the remaining Cauchy factors are
also nonzero.  The exponential phase-product loss, the dependence of the
chosen set on N, and the absence of coordinate lower bounds prevent a
relative estimate.  That continuous maximizer also does not automatically
lie on the preassigned half-integer source grid.

## 7. Why Paley--Wiener and de Branges uniqueness do not close the floor

The complete centered zero multiset is a uniqueness set for compact
Paley--Wiener transforms when algebraic multiplicities are represented by
derivative jets.  The present Gram repeats ordinary value rows instead.
Uniqueness gives no lower sampling constant, and repeated values do not
become Hermite data.

Under additional simplicity hypotheses, a de Branges construction would
use its own derivative-weighted sampling norm, involving the local kernel
norms at the Xi zeros.  The locked inputs allow multiple zeros and supply no
uniform lower control of zero derivatives, no comparison of that de Branges
norm with the Euclidean coefficient norm in (1.7), and no control of the
sharp factors `1-cos(gamma*L)`.  Deleting those phases gives only the
RH-strength Cesaro Christoffel--Darboux kernel.

Accordingly, neither uniqueness nor the phase-averaged kernel proves
(2.13), (4.5), or the diagonal orientation.  Inserting `-Xi'/Xi` would
replace the finite endpoint phases by a forbidden meromorphic critical-line
continuation and is not used here.

## 8. Surviving actual-source target

An actual RH-branch proof must still establish, on one projection-convergent
unbounded source schedule, all of the following relative data:

1. no vanishing or lacunary pair among the growing actual coordinates;
2. a carrier-scale distinct-zero subset for which either
   `Theta_Gamma` or the square determinant (4.2) has a quantitative lower
   bound;
3. comparison of that floor with `eta` and the oriented diagonal term
   `b=PGu`, strong enough for (4.7) or for the exact matrix criterion; and
4. strict connectivity after the row-sum diagonal is restored.

The exact formulas above identify these inputs but prove none of them.  An
absolute Gevrey residual, a positive zero count, qualitative finite rank,
or a phase-averaged Xi kernel cannot replace the required relative theorem.
