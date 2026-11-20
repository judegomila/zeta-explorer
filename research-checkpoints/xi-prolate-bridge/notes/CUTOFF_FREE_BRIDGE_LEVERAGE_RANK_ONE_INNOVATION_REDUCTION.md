# Cutoff-free bridge leverage and rank-one innovation reduction

## 0. Exact outcome and fail-closed boundary

Let

\[
 X=X_\lambda=\operatorname {ran}P_\lambda                 \tag{0.1}
\]

be the finite-dimensional bottom space.  Let `F` be one declared finite
phase-separated bulk source, let

\[
 T_F:F\longrightarrow X                                  \tag{0.2}
\]

be its actual bottom-projected compact synthesis, and let

\[
 b=h_2-{I_2\over I_0}h_0,
 \qquad t_b=P_\lambda x_b\in X                            \tag{0.3}
\]

be the omitted zero-integral bridge and its corrected compact state.  The
state-invisible origin correction does not change `t_b`.  An endpoint shear
of `b` by a member of `F` changes coordinates but not the innovation below.

Write the positive finite source-defect Gram and the augmented synthesis as

\[
 \Delta_M=
 \begin{bmatrix}\Delta_F&c\\c^*&d\end{bmatrix}>0,
 \qquad T_M=\begin{bmatrix}T_F&t_b\end{bmatrix}.          \tag{0.4}
\]

On the support of a redundant coordinate synthesis the same formulas hold
after replacing inverses by Moore--Penrose inverses.  In the independent
coordinates used here, `Delta_F>0`.  Define

\[
 \begin{aligned}
 s_b&=d-c^*\Delta_F^{-1}c,\\
 w_b&=t_b-T_F\Delta_F^{-1}c,\\
 v_b&=s_b^{-1/2}w_b,\\
 S_F&=T_F\Delta_F^{-1}T_F^*,
 \qquad S_M=T_M\Delta_M^{-1}T_M^*.
 \end{aligned}                                           \tag{0.5}
\]

The exact Schur/Feshbach identity is

\[
 \boxed{S_M=S_F+|v_b\rangle\langle v_b|.}                \tag{0.6}
\]

Thus one bridge is exactly one positive innovation on the bottom space.  It
can repair at most one missing bottom direction.

If `S_M>0`, let

\[
 B_M=\Delta_M^{-1}T_M^*S_M^{-1},
 \qquad r_b=\ell_bB_M,                                  \tag{0.7}
\]

where `ell_b` extracts the bridge coefficient.  In innovation coordinates,

\[
 \boxed{
 r_b=s_b^{-1}w_b^*S_M^{-1},\qquad
 \theta_b=1-r_b(w_b)={\det S_F\over\det S_M}.}           \tag{0.8}
\]

Because `S_F` is positive semidefinite, `0<=theta_b<=1`.  Hence

\[
 \boxed{\theta_b>0\quad\Longleftrightarrow\quad S_F>0.}  \tag{0.9}
\]

This is the sharp scalar bridge-elimination criterion.  The directly
normable sufficient statistic is

\[
 \kappa_b=\|w_b\|\,\|\ell_bB_M\|<1.                    \tag{0.10}
\]

It gives an explicit phase-bulk right inverse and a quantitative lower
frame bound in Section 5.

There is also a sharp codimension-one alternative.  If
`ker S_F=span{e_0}`, `||e_0||=1`, and

\[
 S_F\succeq\alpha(I-|e_0\rangle\langle e_0|),
 \qquad a_b=|\langle e_0,v_b\rangle|,                  \tag{0.11}
\]

then `a_b` is the sole bridge-orientation scalar.  If `a_b>0`,

\[
 \boxed{
 S_M\succeq
 {\alpha a_b^2\over\alpha+\|v_b\|^2}I_X.}             \tag{0.12}
\]

If `dim ker S_F>=2`, then `S_M` is singular for every one-dimensional
bridge.  On the missed line the bulk correction in (0.5) vanishes, and the
full-source adjoint identifies the arithmetic scalar exactly:

\[
 \boxed{
 a_b={1\over\sqrt{s_b}}
 \left|\beta_2(e_0)-{I_2\over I_0}\beta_0(e_0)\right|.} \tag{0.13}
\]

Formula (0.13) is invariant under the frozen endpoint shear because its
shearing source lies in `F`.  It is substantially narrower than a generic
principal-angle lower bound, but none of the frozen inputs proves it is
bounded below on the actual missed bottom line.

The ground equation gives an upper residual identity, parity only splits
the target, and the coherent-beta diagonal is a positive form scalar rather
than bottom-projector mass.  None forces (0.9), (0.10), or (0.13).  The
exact-arithmetic-map coercivity countermodel remains valid after adjoining
one bridge source, while a two-dimensional exact model has positive bridge
form energy and zero bridge ground overlap.  These are logical
nonimplications, not counterexamples to the actual von-Mangoldt Weil
operator.

No actual lower bound for `theta_b`, `kappa_b`, or `a_b`, no cutoff-free
mixed floor, no new bottom estimate, no zero statement, and no Riemann
hypothesis conclusion is proved.  The standard eight are untouched and the
formal state remains `P0_INVALIDATED`.

## 1. Frozen dependencies

No new external source is used.  The exact repository inputs are:

| Dependency | SHA-256 |
|---|---|
| `notes/CUTOFF_FREE_FULL_SOURCE_ADJOINT_PROLATE_CAPTURE_BARRIER.md` | `157bffc55aeec592c263d5973effe1b9506e02dd97311652ecb2fdee0c3ff0e9` |
| `tests/test_cutoff_free_full_source_adjoint_prolate_capture_barrier.py` | `d7f70dffbd10021ce7d6e8887d10589a482b2dc64c9ebbe8c48cc35568c233ae` |
| `notes/CUTOFF_FREE_WEIGHTED_RADICAL_COFRAME_REDUCTION_BARRIER.md` | `c84bc4ed8632aeedb8208e699350e0895a4437912b8ba735f10315b5cf1b7d8c` |
| `tests/test_cutoff_free_weighted_radical_coframe_reduction_barrier.py` | `d6d83b1a045b96da8ad7a49753a05f5981e9744b04ecb95470fbd5332bb87c11` |
| `notes/CUTOFF_FREE_UNIFORM_RADICAL_GRAPH_TRANSFER_THEOREM.md` | `aa69ac86e6b5d5256ba3b243b9fc07d9c5ad49bed7a70e3d570d0c57325bce18` |
| `tests/test_cutoff_free_uniform_radical_graph_transfer_theorem.py` | `b2708c8f72ce8bad831b2aea44c49ef3a8ec5f9c38551c288a1c982d097ee727` |
| `notes/GROWING_MIXED_BRIDGE_GAUGE_POLE_DOMAIN_BARRIER.md` | `335e8973a51fdc998398620c6d30ba51eaa2ee45fb3444e838aa1e34ef33c1cb` |
| `tests/test_growing_mixed_bridge_gauge_pole_domain_barrier.py` | `0ef8d77b05498533c8c58428a99beb9c1a13cc9699b2b5abb9c05b63de9f80bc` |
| `notes/GROWING_MIXED_BRIDGE_COHERENT_BETA_ROW_FLOOR_THEOREM.md` | `43a7a2a9c32dd01a223926b17c7e344d6c256980ad9b4762dc2dc5808face1e2` |
| `tests/test_growing_mixed_bridge_coherent_beta_row_floor_theorem.py` | `95a3548414eb0d33805cede160312bbc6091c278984fb5ec4144f1127152ab4a` |
| `notes/GROWING_MIXED_BRIDGE_RADICAL_QUOTIENT_GRAPH_CORE_BARRIER.md` | `96c477b3118eefced3ef2f2840ada259c18d1f2ec76daa86d2712ad6a666f768` |
| `tests/test_growing_mixed_bridge_radical_quotient_graph_core_barrier.py` | `9c73374d532f20fdf0f772c1d081dc5c4e2e6bb93b164f6671e19e936afb1b86` |

The adjoint pair fixes the factors `1/2` and `c_g`, the rank-one
zero-integral penalty, the ground-residual direction, and the exact-A
Bessel/coercive-well countermodel.  The weighted pair fixes the
minimum-defect inverse and principal-angle boundary.  The uniform graph
pair supplies a polynomial residual constant on its declared phase bulk;
it supplies no bridge leverage.  The gauge pair fixes the full raw bridge
metric and endpoint shear.  The coherent pair fixes the finite
captured-plus-bridge positive form, and the quotient pair fixes the
corrected compact state `x_b`.  No dependency identifies a positive form
diagonal with bottom-projector overlap.

## 2. Innovation form of the augmented source metric

For `(f,z) in F direct-sum C`, the source defect is

\[
 \langle(f,z),\Delta_M(f,z)\rangle
 =\langle f,\Delta_Ff\rangle
 +2\operatorname {Re}\{\overline z\langle f,c\rangle\}
 +d|z|^2.                                               \tag{2.1}
\]

Put

\[
 f'=f+z\Delta_F^{-1}c.                                 \tag{2.2}
\]

Then direct completion of the square gives

\[
 \langle(f,z),\Delta_M(f,z)\rangle
 =\langle f',\Delta_Ff'\rangle+s_b|z|^2,              \tag{2.3}
\]

while the bottom synthesis becomes

\[
 T_Ff+zt_b=T_Ff'+zw_b.                                 \tag{2.4}
\]

Thus the bridge after defect-orthogonalization is exactly the innovation
`w_b` with defect `s_b`.  Equivalently,

\[
 \Delta_M^{-1}=
 \begin{bmatrix}
 \Delta_F^{-1}+\Delta_F^{-1}cs_b^{-1}c^*\Delta_F^{-1}
 &-\Delta_F^{-1}cs_b^{-1}\\
 -s_b^{-1}c^*\Delta_F^{-1}&s_b^{-1}
 \end{bmatrix}.                                        \tag{2.5}
\]

Multiplying (2.5) on both sides by `T_M` proves

\[
 T_M\Delta_M^{-1}T_M^*
 =T_F\Delta_F^{-1}T_F^*+s_b^{-1}w_bw_b^*,             \tag{2.6}
\]

which is (0.6).

The innovation is invariant under every triangular bridge shear by a bulk
vector.  If

\[
 b'=b-C_Fq,\qquad t_b'=t_b-T_Fq,                      \tag{2.7}
\]

then

\[
 c'=c-\Delta_Fq,\qquad
 d'=d-q^*c-c^*q+q^*\Delta_Fq.                         \tag{2.8}
\]

Substitution gives

\[
 s_b'=s_b,\qquad w_b'=w_b.                            \tag{2.9}
\]

In particular the endpoint-null bridge `b^#=b-gamma m_1` has exactly the
same innovation as the raw bridge whenever `m_1 in F`.

## 3. Explicit bridge Schur scalar in the frozen raw metric

Reorder the exact raw exterior metric from the gauge barrier as bulk plus
bridge.  With

\[
 \begin{aligned}
 \Delta_F&=\operatorname {diag}
   (D_4+d_0uu^*,D_T+d_2aa^*),\\
 c&=(d_0\beta u,d_2a),
 \qquad d=d_2+d_0\beta^2,\\
 U&=u^*D_4^{-1}u,
 \qquad A=a^*D_T^{-1}a,
 \qquad \beta={I_2\over I_0},
 \end{aligned}                                         \tag{3.1}
\]

the two Woodbury identities are

\[
 u^*(D_4+d_0uu^*)^{-1}u={U\over1+d_0U},
 \qquad
 a^*(D_T+d_2aa^*)^{-1}a={A\over1+d_2A}.               \tag{3.2}
\]

Therefore no bridge cross entry is lost, and

\[
 \boxed{
 s_b={d_0\beta^2\over1+d_0U}
     +{d_2\over1+d_2A}>0.}                            \tag{3.3}
\]

Formula (3.3) concerns the modal exterior defect used in the weighted
coframe.  The coherent-beta form is a different physical quadratic form;
its positive diagonal may not be substituted for `s_b`.  The abstract
rank-one identity (0.6) applies to any declared positive source metric, but
its `s_b` must always be computed from that same metric.

## 4. Full-source adjoint and the one arithmetic coefficient

For `g in X`, the frozen exact adjoint is

\[
 z_g(x):=(A_{\lambda,0}^*g)(x)
 ={1\over2}{\bf1}_{\{|x|\geq\lambda^{-1}\}}r_g(|x|)-c_g, \tag{4.1}
\]

where

\[
 r_g(x)=x^{-1/2}\sum_{n\leq\lambda x}n^{-1/2}g(x/n),
 \qquad
 c_g={1\over2\lambda}
       \int_{\lambda^{-1}}^\lambda r_g(x)\,dx.        \tag{4.2}
\]

Let

\[
 \beta_n(g)=\langle z_g,h_{n,\lambda}\rangle.         \tag{4.3}
\]

For every phase prefix the zero-integral projection retains the exact
rank-one penalty

\[
 \|P_{F_{\sigma,m}}z_g\|^2
 =\sum_{n\in I_{\sigma,m}}|\beta_n(g)|^2
 -{\left|\sum_{n\in I_{\sigma,m}}
       \overline {I_n}\beta_n(g)\right|^2
   \over\sum_{n\in I_{\sigma,m}}|I_n|^2}.             \tag{4.4}
\]

Let `C_F` synthesize the actual bulk sources and put

\[
 b_{\rm in}=b-C_F\Delta_F^{-1}c.                       \tag{4.5}
\]

Compact restriction and bottom projection give

\[
 \boxed{
 \langle g,w_b\rangle
 =\langle z_g,b_{\rm in}\rangle
 =\beta_2(g)-{I_2\over I_0}\beta_0(g)
  -\langle z_g,C_F\Delta_F^{-1}c\rangle.}             \tag{4.6}
\]

The constant `c_g` cancels from the first two terms because `b` has zero
integral.  It has not been omitted from the individual coefficients.

If `e_0 in ker S_F`, positivity of `Delta_F` implies

\[
 T_F^*e_0=0.                                           \tag{4.7}
\]

Consequently the final term in (4.6) vanishes at `e_0`, proving (0.13).
Thus, once a codimension-one bulk gap is known, the needed bridge input is
one corrected arithmetic adjoint coefficient, not a whole new generic
capture Gram.  With a multiple bottom and no proved codimension-one gap,
the smallest eigenvalue of the full coefficient Gram remains necessary.

## 5. Minimum-defect right inverse and exact bridge elimination

Assume `S_M>0`.  The minimum-defect augmented right inverse in (0.7)
satisfies

\[
 T_MB_M=I_X,
 \qquad
 B_M^*\Delta_MB_M=S_M^{-1}.                            \tag{5.1}
\]

Let

\[
 \widetilde\Pi_F(f,z)=f+z\Delta_F^{-1}c               \tag{5.2}
\]

be the bulk coordinate after the innovation shear.  The last row of
(2.5) gives

\[
 r_b=\ell_bB_M=s_b^{-1}w_b^*S_M^{-1}.                 \tag{5.3}
\]

Equations (2.4) and (5.1) give the exact rank-one defect from deleting the
bridge coordinate:

\[
 T_F\widetilde\Pi_FB_M=I_X-w_br_b.                    \tag{5.4}
\]

The matrix determinant lemma applied to
`S_F=S_M-s_b^(-1)w_bw_b^*` proves

\[
 \det S_F=\det S_M
 \left(1-s_b^{-1}w_b^*S_M^{-1}w_b\right)
 =\det S_M\,\theta_b.                                 \tag{5.5}
\]

Because `S_F` is positive semidefinite, (5.5) proves (0.8)--(0.9).  If
`theta_b>0`, Sherman--Morrison gives

\[
 (I_X-w_br_b)^{-1}=I_X+{w_br_b\over\theta_b},          \tag{5.6}
\]

and hence

\[
 \boxed{
 B_F=\widetilde\Pi_FB_M(I_X-w_br_b)^{-1},
 \qquad T_FB_F=I_X.}                                  \tag{5.7}
\]

This is exact bridge elimination into the original phase bulk `F`; no
closure or density argument is used.

For a quantitative version set

\[
 K_F=\|\Delta_F^{1/2}\widetilde\Pi_FB_M\|,
 \qquad \kappa_b=\|w_b\|\,\|r_b\|.                   \tag{5.8}
\]

Equations (5.6)--(5.8) imply

\[
 S_F\succeq
 {1\over K_F^2(1+\kappa_b/\theta_b)^2}I_X.            \tag{5.9}
\]

The simpler sufficient condition `kappa_b<1` gives

\[
 \theta_b\geq1-\kappa_b,
 \qquad
 \boxed{
 S_F\succeq{(1-\kappa_b)^2\over K_F^2}I_X.}           \tag{5.10}
\]

Thus a polynomial bound for `K_F` and a polynomial margin in either
`theta_b` or `1-kappa_b` would replace the generic capture demand by one
bridge-leverage row.  Neither bound is presently frozen for the actual
bottom projector.

## 6. Codimension-one floor and higher-nullity obstruction

Let

\[
 N_F=\ker S_F.                                         \tag{6.1}
\]

If `dim N_F>=2`, then there is a nonzero

\[
 k\in N_F\cap v_b^\perp.                              \tag{6.2}
\]

Equation (0.6) gives `S_Mk=0`.  Hence a rank-one bridge can never repair a
bulk nullity of two or more.

Suppose instead `N_F=span{e_0}` and (0.11) holds.  Decompose

\[
 v_b=a e_0+v_\perp,
 \qquad |a|=a_b,
 \qquad b_b=\|v_\perp\|.                              \tag{6.3}
\]

On `span{e_0,v_perp}` the lower comparison matrix is

\[
 \begin{bmatrix}
 a_b^2&a_bb_b\\
 a_bb_b&\alpha+b_b^2
 \end{bmatrix}.                                        \tag{6.4}
\]

Its exact smaller eigenvalue is

\[
 m_b={\alpha+\|v_b\|^2
 -\sqrt{(\alpha+\|v_b\|^2)^2-4\alpha a_b^2}\over2}.  \tag{6.5}
\]

Since the determinant is `alpha a_b^2` and the larger eigenvalue is at
most `alpha+||v_b||^2`,

\[
 m_b\geq{\alpha a_b^2\over\alpha+\|v_b\|^2}.         \tag{6.6}
\]

The orthogonal complement already has lower bound `alpha`, so (6.6)
proves (0.12).  If `a_b=0`, the missed vector remains in `ker S_M`.

Conversely, if `S_M>0`, (6.2) shows immediately that

\[
 \dim\ker S_F\leq1.                                    \tag{6.7}
\]

Thus a genuine augmented mixed capture theorem would reduce the only
possible exact rank failure of the phase bulk to one dimension.  It would
not by itself provide a quantitative lower bound for the remaining small
positive eigenvalues.

## 7. Why the frozen equations do not control the scalar

Let `g` be a unit bottom vector with

\[
 Q_\lambda g=\mu_\lambda g.                           \tag{7.1}
\]

Whenever the chosen bridge representative is in the declared graph
domain, self-adjointness gives only

\[
 \mu_\lambda\langle z_g,b_{\rm in}\rangle
 =\langle g,Q_\lambda{\cal K}(b_{\rm in})\rangle.     \tag{7.2}
\]

Residual control bounds the right side from above.  It does not give a
lower bound for (4.6), and when `mu_lambda=0` it gives none at all.  The
uniform graph-transfer theorem supplies a polynomial residual constant on
the phase-separated bulk, not a reverse estimate for the bridge row.

Physical inversion parity does not remove the issue.  The exact raw metric
has both bridge crosses

\[
 d_0\beta u\qquad\hbox{and}\qquad d_2a.                \tag{7.3}
\]

Parity separates physical target sectors; it does not set `w_b`, `r_b`, or
the coefficient in (0.13) to zero or bound them below.

The coherent-beta theorem proves, on its finite physical form,

\[
 q_{bb}={A_\lambda^2C_\xi\over4\lambda}+o(\lambda^{-1})>0. \tag{7.4}
\]

This is not `||P_lambda x_b||^2`.  The exact two-dimensional model

\[
 Q=\operatorname {diag}(0,2),
 \qquad g=e_1,
 \qquad x_b=e_2                                      \tag{7.5}
\]

has positive bridge form energy

\[
 \langle x_b,Qx_b\rangle=2,                           \tag{7.6}
\]

but `P_(span{g})x_b=0`, and its ground equation is the identity `0=0`.
Thus a positive coherent diagonal alone cannot imply bottom overlap.

The weighted-coframe orientation family also persists after a bridge.  For
`0<epsilon<1`, take

\[
 S_F=\varepsilon^2I_2,
 \qquad v_b=e_1.                                      \tag{7.7}
\]

Then

\[
 S_M=\operatorname {diag}(1+\varepsilon^2,\varepsilon^2), \tag{7.8}
\]

so the rank-one bridge leaves the orthogonal small direction unchanged.
With `S_F=0` the same example is exactly the nullity-two obstruction.

Finally, the exact-A countermodel in the adjoint barrier chooses a remote
coercive-well ground by Bessel averaging over the literal adjoint kernels.
Adjoining the one vector `b` only raises the finite source rank by one.
The same trace argument therefore still permits superpolynomially small
capture of `F direct-sum span{b}` while keeping the actual arithmetic map,
either parity, the full-source floor, compact resolvent, and every frozen
remote high-Fourier coercivity envelope.  This artificial diagonal-well
operator is not the actual Weil operator and is not asserted to satisfy the
separate coherent-beta theorem.  The examples establish only that the
currently separate inputs do not imply the needed cross-orientation
statistic.

## 8. Exact remaining alternatives

There are two narrow sufficient routes.

First, an actual augmented mixed right inverse could be combined with

\[
 K_F\leq\lambda^AL^B,
 \qquad \kappa_b\leq1-\lambda^{-D}L^{-E}              \tag{8.1}
\]

for fixed exponents.  Equation (5.10) would then give a polynomial phase
bulk floor and the existing KRD schedule could be applied without the
bridge.

Second, one could prove a codimension-one phase-bulk gap `alpha` and the
single arithmetic lower bound

\[
 \left|\beta_2(e_0)-{I_2\over I_0}\beta_0(e_0)\right|
 \geq\sqrt{s_b}\,\vartheta_\lambda.                   \tag{8.2}
\]

Equations (0.12)--(0.13) would then quantify exactly how the bridge repairs
that one missed line.  This would be an augmented mixed floor, not an
elimination of the bridge.

Absent (8.1) or (8.2), the gamma-only stopping boundary of the weighted
coframe note remains unchanged.  Neither scalar estimate follows from the
ground equation, parity, the coherent beta diagonal, the uniform bulk
residual theorem, or remote high-frequency coercivity.

## 9. Reproduction

Run the exact regression with bytecode disabled:

```bash
python3 -B -m unittest \
  tests.test_cutoff_free_bridge_leverage_rank_one_innovation_reduction -v
```

The regression checks the frozen dependencies, block inverse, explicit
Schur scalar, shear invariance, exact determinant ratio, minimum-defect
elimination, codimension-one floor, nullity-two obstruction, coherent
scalar nonimplication, note contract, TeX, static hygiene, and absence of
binary floating-point fixtures.  It reads no zero table, numerical ground,
cached prolate artifact, or network resource.
