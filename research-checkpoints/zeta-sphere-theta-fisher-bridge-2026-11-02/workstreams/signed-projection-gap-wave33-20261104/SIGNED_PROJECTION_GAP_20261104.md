# Signed projection transfer and the endpoint-resolvent obstruction

## Result and scope

Wave 31 converts the finite direct-head target into a collective Hardy ratio.
The audited Pollaczek model supplies favorable monic trial polynomials, but a
trial is not the actual residual selected by the signed theta form.  This note
gives the exact transfer coordinates between them.

The result isolates one necessary theta-specific quantity,

\[
 \|(I-K)^{-1}b\|^2,
\tag{1}
\]

and proves with a sharp `2 x 2` model that favorable trial ratios, full pivot
positivity, relative monic near-minimality, and good conditioning do not
control (1) at the required scale.  This is a generic quadratic-form
obstruction, not an actual-theta counterexample and not an RH conclusion.

## 1. Exact residual coordinates

Let `X` be the positive Hardy/source form, `H` its derivative-cost form, and

\[
 Q=X-H.
\tag{2}
\]

Let `E` be the old polynomial prefix.  Write `P` for the `X`-selected monic
polynomial in the enlarged affine slice and put `A=X[P]`.  In an
`X`-orthonormal basis of `E`, followed by `u=P/sqrt(A)`, the forms have blocks

\[
 X=I,\qquad
 H=\begin{pmatrix}K&b\\b^T&h\end{pmatrix},\qquad
 Q=I-H.
\tag{3}
\]

Assume the old `Q` prefix is positive and define its generalized gap

\[
 \rho=1-\|K\|=\inf_{0\ne e\in E}{Q[e]\over X[e]}>0.
\tag{4}
\]

The actual `Q`-Galerkin monic residual is characterized by
`Q(q,E)=0`.  Since the lower block of `Q` is `I-K`, this gives the exact
formula

\[
 \boxed{{q\over\sqrt A}=u+(I-K)^{-1}b.}
\tag{5}
\]

Put

\[
 R=(I-K)^{-1},\qquad s_1=b^TRb,\qquad s_2=b^TR^2b.
\tag{6}
\]

Direct substitution in (3) gives

\[
 \boxed{
 {X[q]\over A}=1+s_2,\qquad
 {H[q]\over A}=h+s_1+s_2,\qquad
 {Q[q]\over A}=1-h-s_1.}
\tag{7}
\]

Thus pivot positivity controls `h+s_1`; the missing amplification is

\[
 s_2=\|(I-K)^{-1}b\|^2.
\tag{8}
\]

In particular,

\[
 {H[q]\over X[q]}\longrightarrow0
 \quad\Longleftrightarrow\quad h\longrightarrow0
 \ \hbox{and}\ s_2\longrightarrow0.
\tag{9}
\]

## 2. Sharp gap-relative upper bound

Because `H` is positive semidefinite, `b` lies in the range of `K` and

\[
 b^TK^\dagger b\le h.
\tag{10}
\]

Diagonalize `K`.  Its eigenvalues satisfy `0<=lambda<=1-rho`.  If
`w_lambda=b_lambda^2/lambda`, then `w_lambda>=0`,
`sum w_lambda<=h`, and

\[
 s_1=\sum w_\lambda{\lambda\over1-\lambda},\qquad
 s_2=\sum w_\lambda{\lambda\over(1-\lambda)^2}.
\tag{11}
\]

Consequently

\[
 s_1\le{1-\rho\over\rho}h,qquad
 s_2\le{1-\rho\over\rho^2}h,qquad
 {Q[q]\over A}\ge1-{h\over\rho}.
\tag{12}
\]

The linear-fractional ratio in (7) is maximized at an extreme point of the
simplex in `(w_lambda)`.  If `h<rho`, the maximizing eigenvalue is
`lambda=1-rho`, and

\[
 \boxed{
 {H[q]\over X[q]}
 \le {h\over\rho^2+(1-\rho)h}.}
\tag{13}
\]

Equality is attained by the rank-one model in Section 4.

There is an equivalent selected-column path formulation.  Interpolate

\[
 Q_\lambda=X-\lambda H\qquad(0\le\lambda\le1)
\tag{14}
\]

and let `p(lambda)` be its normalized monic Schur pivot.  Exact block
elimination gives

\[
 p(\lambda)=1-\lambda h-
 \lambda^2b^T(I-\lambda K)^{-1}b.
\tag{15}
\]

Using `RKR=R^2-R` at `lambda=1`,

\[
 \boxed{
 p(1)={Q[q]\over A},\qquad
 -p'(1)={H[q]\over A},\qquad
 p(1)-p'(1)={X[q]\over A}.}
\tag{16}
\]

Thus the desired residual ratio is the endpoint logarithmic-slope coordinate
`-p'(1)/(p(1)-p'(1))`.  The Schur pivot is concave as an infimum of affine
functions of `lambda`; explicitly,

\[
 p''(\lambda)=-2b^T(I-\lambda K)^{-3}b\le0.
\]

Concavity alone gives `-p'(1)>=1-p(1)`, which bounds the endpoint slope in
the wrong direction.  A useful continuation must add actual-theta information
on this selected column or its endpoint slope.

## 3. What a favorable monic trial would have to prove

Let `M` be any favorable monic trial and put

\[
 \varepsilon={H[M]\over X[M]},\qquad D={X[M]\over A}.
\tag{17}
\]

Since `M-P` lies in `E`, `X[P]` is orthogonal to the lower prefix, and
`H<=(1-rho)X` on `E`, the triangle inequality in the `H` seminorm gives

\[
 \boxed{
 h\le h_*:=
 \left(\sqrt{\varepsilon D}
 +\sqrt{(1-\rho)(D-1)}\right)^2.}
\tag{18}
\]

This is a noncircular transfer criterion:

* `h_*<rho` proves positivity of the enlarged `Q` pivot;
* `h_*=o(rho^2)` proves `H[q]/X[q]=o(1)`;
* if the wave-31 tail ratio satisfies `0<=R_tail<2`, put

\[
 \tau={2-R_{\rm tail}\over2+R_{\rm tail}}.
\tag{19}
\]

  The collective Hardy gate follows from

\[
 \boxed{
 h_*<{\tau^2\rho^2\over1-(1-\rho)\tau^2}.}
\tag{20}
\]

The current Pollaczek estimates `epsilon=O(1/log m)` and a subexponential
bound on `D` do not approach this gap-relative accuracy.

## 4. Sharp `2 x 2` obstruction

Choose

\[
 K=1-\rho,\qquad b=-\sqrt{(1-\rho)h},\qquad
 \rho^2\ll h\ll\rho.
\tag{21}
\]

Then

\[
 H=\begin{pmatrix}1-\rho&b\\b&h\end{pmatrix}
\tag{22}
\]

is rank-one positive semidefinite, while

\[
 \det Q=\rho-h>0.
\tag{23}
\]

Thus the full enlarged `Q` block is positive.  The monic vector in the kernel
of `H` is a perfect favorable trial with

\[
 \varepsilon=0,
 \qquad D=1+{h\over1-\rho}\longrightarrow1.
\tag{24}
\]

Nevertheless, (5)--(7) give

\[
 {Q[q]\over A}=1-{h\over\rho}\longrightarrow1,
\tag{25}
\]

but

\[
 \boxed{
 {H[q]\over X[q]}
 ={h\over\rho^2+(1-\rho)h}\longrightarrow1.}
\tag{26}
\]

For example, `rho=N^-2` and `h=N^-3` have precisely the separation in (21).
The model can be embedded in a monic polynomial affine slice with prescribed
distinct same-parity monic polynomials for the trial and residual.  Therefore
recurrence data or root reality by themselves do not remove the obstruction.
The constructed forms are still generic, not complete theta.

## 5. Consequence for the current Pollaczek transfer

The audited signed-synthesis checkpoint at remote PR #40 commit
`fc148eaa2da1ecf22ac14b148288b6562b424064` constructs actual Pollaczek
combinations with

\[
 {H[R_n]\over X[R_n]}=1+O(\log^{-2}n).
\tag{27}
\]

Conditional on the relevant old `Q` prefix being positive, (4) therefore
obeys

\[
 \rho_{\rm old}\le {Q[R_n]\over X[R_n]}=O(\log^{-2}n).
\tag{28}
\]

So a uniform old-prefix gap cannot rescue the existing transfer argument.
The sufficient scale `h_*=o(rho^2)` may require `o(log^-4 n)` accuracy or
finer, far beyond the current scalar trial estimates.

The subsequent independently audited selected-column checkpoint at PR #40
commit `3263f5a74a4d321107b2184c6ba116502f660c42` proves a complementary
actual-source obstruction: in the normalized natural Pollaczek basis, the
actual `X`-selected inverse-Gram columns admit no degree-uniform
stretched-exponential absolute localization.  The proof retains every source
cross term and uses fixed-row `t^2` multiplication plus resonance at a simple
real zero of `F`.  Consequently (1) cannot be paid by assuming uniformly fast
absolute decay of selected columns.  Algebraic or column-dependent decay and
theta-specific signed cancellation remain possible.

The follow-up relative-column checkpoint at PR #40 commit
`859300d1ff3bb8cf4863961da28d9b6c5d0df498` strengthens this: even relative
inverse-Gram heads, and even fractional-power-size low heads, cannot satisfy a
uniform stretched-exponential upper bound (quasi-polynomial prefactors do not
rescue it).  Its package verifier and checksums pass.  This still does not
exclude the signed kernel angle below, because that target is neither an
absolute coefficient head nor a uniform two-index locality claim.

The remaining theta-specific target is exactly (1), or a direct correlated
Hardy inequality that bypasses separate control of it.

In coordinate-free form, if `Q_E` and `X_E` are the old-prefix forms and

\[
 \ell(e)=H(P,e),
\]

then

\[
 \boxed{
 s_2=A^{-1}\ell^TQ_E^{-1}X_EQ_E^{-1}\ell
 ={X[q-P]\over A}.}
\]

Thus the sharp surviving target is `X[q-P]=o(A)`.  It is invariant under a
change of old-prefix basis and still permits algebraic, column-dependent, and
signed localization; it does not contradict the selected-column obstruction.

## 6. Exact Christoffel-column form of the surviving target

Let `rho_j,lambda_j` be the `m` old-prefix Gaussian nodes and weights for the
positive `Q` prefix, and let

\[
 L_j(t)={q(t)\over q'(\rho_j)(t-\rho_j)}
\]

be the cardinal polynomials.  Gaussian exactness gives

\[
 Q(L_i,L_j)=\lambda_i\delta_{ij}.
\]

Since `w=q-P` lies in the old prefix and `q(rho_j)=0`, interpolation gives

\[
 w=-\sum_{j=1}^mP(\rho_j)L_j.
\]

Moreover `P` is `X`-orthogonal to the old prefix and `q` is `Q`-orthogonal,
so

\[
 Q(P,L_j)=\lambda_jP(\rho_j),\qquad
 H(P,L_j)=-\lambda_jP(\rho_j).
\]

For `H[r]=int F(t)^2 r'(t)^2 dt`, the exact invariant target becomes

\[
 \boxed{
 s_2={X[w]\over A}={1\over A}\left\{
 \sum_{j=1}^m\lambda_jP(\rho_j)^2
 +\int_{\mathbb R}F(t)^2
 \left[\sum_{j=1}^mP(\rho_j)L_j'(t)\right]^2dt
 \right\}.}
\]

This formula retains every derivative cross term and is column-dependent, so
the selected-locality obstruction does not exclude it.  A stronger scalar
sufficient condition follows from `Q>=rho X` on the old prefix:

\[
 \sum_j\lambda_jP(\rho_j)^2=o(A\rho)
 \quad\Longrightarrow\quad s_2=o(1).
\]

Current Pollaczek and selected-column estimates control neither the actual
values `P(rho_j)` nor the full cardinal derivative Gram.  This is the next
theta-specific analytic target.

Equivalently, with the old `Q`-Christoffel kernel

\[
 K_E^Q(t,s)=\sum_{j=1}^m{L_j(t)L_j(s)\over\lambda_j},
\]

the correction is the exact signed kernel angle

\[
 \boxed{
 w(t)=H(P,K_E^Q(t,\cdot))
 =\int F(s)^2P'(s)\partial_sK_E^Q(t,s)\,ds
 =-\int F(s)T(P')(s)K_E^Q(t,s)\,ds.}
\]

Thus a viable source-specific lemma is that the `X` norm of this signed
kernel integral is `o(sqrt(A))`.  It permits slow or nonuniform columns and
uses cancellation only for the actual selected `P` and actual `Q` kernel.

A stronger but scalar sufficient target is

\[
 s_1={Q[P]-Q[q]\over A}
 ={1\over A}\sum_j\lambda_jP(\rho_j)^2,
 \qquad s_2\le{s_1\over\rho}.
\]

Therefore

\[
 \boxed{Q[P]-Q[q]=o(A\rho)\quad\Longrightarrow\quad s_2=o(1).}
\]

This is adjacent signed-pivot closeness, not coefficient locality.  If the
conditional gap scale is only `rho=O(log^-2 m)`, it requires closeness finer
than `A/log^2 m`, and possibly much finer if the actual gap shrinks faster.

## 7. Adjacent trace and ridge-sensitivity coordinates

Let `D_k(lambda)` be the full prefix Gram determinant through degree `k` for
`Q_lambda=X-lambda H`.  The monic Schur pivot satisfies

\[
 A p(\lambda)={D_m(\lambda)\over D_{m-1}(\lambda)}.
\]

At a positive endpoint pivot, logarithmic differentiation gives the exact
signed adjacent-trace identity

\[
 \boxed{
 - (\log p)'(1)
 =\operatorname {Tr}(Q_m^{-1}H_m)
  -\operatorname {Tr}(Q_{m-1}^{-1}H_{m-1})
 ={H[q]\over Q[q]}.}
\]

If this adjacent trace difference is `L`, then

\[
 {H[q]\over X[q]}={L\over1+L}.
\]

This coordinate is signed, cancellation-sensitive, and selected-column
specific; it requires no fast Pollaczek-index locality.  An `o(1)` adjacent
trace estimate is exactly the desired residual-ratio estimate.

There is also a minimal ridge formulation.  If `m(tau)` is the monic pivot of
`Q+tau X`, the envelope theorem gives

\[
 \boxed{{m'(0+)\over A}={X[q]\over A}=1+s_2.}
\]

Thus `s2=o(1)` is equivalent to the first-order ridge sensitivity
`m'(0+)=A(1+o(1))`.  No current checkpoint bounds either the adjacent trace
difference or this ridge sensitivity.
