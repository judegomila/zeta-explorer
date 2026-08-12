# Growing anchor-row / full-metric Toeplitz inverse-energy barrier

## 0. Exact outcome and fail-closed boundary

Use the locked schedule and the genuine lower two-vector Ritz notation

\[
 \lambda={p\over2},\qquad L=2\log\lambda,\qquad
 Q_+=\begin{pmatrix}q&b^*\\ b&A\end{pmatrix},       \tag{0.1}
\]

\[
 u=\lambda_{\min}\left(
 Q_+|_{\operatorname {span}\{\kappa,b/\|b\|\}}
 \right),\qquad B=A-uI.                              \tag{0.2}
\]

Conditionally on the unproved strict even lower-Ritz branch, assume

\[
 B\succ0.                                             \tag{0.2a}
\]

Every inverse and Schur-complement statement below is conditional on
(0.2a).  No part of this note promotes that branch to a theorem.

The growing low-prefix outer theorem is written over the pure modal index
set

\[
 {\cal I}_Q=\{0,4,\ldots,4Q\}.                      \tag{0.3}
\]

This does **not** mean that its physical range contains the determinant
anchor `p_4`.  The labels `0` and `4` occur in the pure-modal coefficient
support of the exact zero-integral, physically anchor-deflated columns.
After physical anchor deflation and endpoint shear, the actual compact
synthesis `W_Q^#` has range

\[
 {\cal K}_Q=\operatorname {ran}
 \{W_Q^\#(D_Q^\#)^{-1/2}\}\subset\kappa^\perp.      \tag{0.4}
\]

The endpoint-white map `J_Q` is an isometry into exterior pure-label
coordinates and satisfies the different constraint

\[
 J_Q^*J_Q=I,\qquad {\boldsymbol\epsilon}^*J_Q=0.     \tag{0.5}
\]

It is not a physical synthesis containing `p_4`.  Any invertible
re-coordination, including the exact endpoint shear with its pulled-back
full metric, preserves (0.4).  It cannot add the missing anchor direction.
Adjoining `p_4` would be a genuine range enlargement, not a congruence to
which the frozen endpoint-null theorem applies.

There is a second, independent obstruction.  Let `V_Q` denote the
full-metric-white synthesis in (0.4), and assume even the two estimates one
would want from an ideal growing Toeplitz anchor-row theorem:

\[
 V_Q^*BV_Q\succeq cL I,
 \qquad \|V_Q^*b\|^2\leq C d_4L^2.                  \tag{0.6}
\]

They imply only the compressed inverse-energy bound

\[
 \boxed{
 (V_Q^*b)^*(V_Q^*BV_Q)^{-1}(V_Q^*b)=O(d_4L).}       \tag{0.7}
\]

If `R_Q=\kappa^\perp\ominus{\cal K}_Q`, the exact full inverse energy is

\[
 \boxed{
 \langle b,B^{-1}b\rangle
 =c_Q^*D_Q^{-1}c_Q+e_Q^*S_Q^{-1}e_Q,}               \tag{0.8}
\]

where

\[
 \begin{aligned}
 D_Q&=V_Q^*BV_Q,& c_Q&=V_Q^*b,\\
 S_Q&=R_Q^{\rm form}-C_QD_Q^{-1}C_Q^*,&
 e_Q&=b_Q^{\rm ret}-C_QD_Q^{-1}c_Q.
 \end{aligned}                                      \tag{0.9}
\]

Here `C_Q` is the prefix-to-retained block in any bijective synthesis of
`R_Q`, `R_Q^(form)` is the retained compression of `B`, and
`b_Q^(ret)` is the retained coordinate of `b`.  The second term in (0.8)
is nonnegative and is invariant under every invertible prefix or retained
coordinate congruence.  The outer floor controls the first term only.

An exact two-dimensional complement family has a conductor-size prefix
floor, the desired dual prefix row, `q-u=Theta(d_4L)`, and both strict
lower-Ritz signs, while

\[
 {\langle b,B^{-1}b\rangle\over d_4L}\longrightarrow\infty.       \tag{0.10}
\]

Thus even an augmented growing anchor-row estimate would not by itself
prove the requested full inverse row.  The exact missing statement is

\[
 \boxed{e_Q^*S_Q^{-1}e_Q=O(d_4L),}                  \tag{0.11}
\]

or a stronger full-metric floor and dual-row theorem on an actual
residual-containing range.  Neither is frozen.

This note proves a range/congruence distinction and an exact retained
inverse-energy barrier.  It does not prove or disprove (0.11) for the
actual arithmetic matrices, either strict sign on the actual unbounded
schedule, equation (5.2) of `DIRECT_RH_ATTACK.md`, a determinant limit, a
zero statement, or RH.  The formal state remains `P0_INVALIDATED`, and the
standard eight are unchanged.

## 1. Frozen inputs

Only the following repository bytes are used.

| Dependency | SHA-256 |
|---|---|
| `notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md` | `1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4` |
| `tests/test_fixed_even_prefix_arithmetic_synthesis_theorem.py` | `6e89f2f1af22260e5796eb67221fccd86d2668556e9cb23dd903ea283d5f069f` |
| `notes/GROWING_LOW_PREFIX_ENDPOINT_FACTORED_FRACTIONAL_FRAME_THEOREM.md` | `6f0385a37476079991c45497e88664d49c0e13a5661026966f9d3bb22ee4f404` |
| `tests/test_growing_low_prefix_endpoint_factored_fractional_frame_theorem.py` | `cf03e6e7a4254403bc4fb75469a90b926e4525455693cd5a1c5decc78b12640e` |
| `notes/GROWING_LOW_PREFIX_OUTER_FLOOR_ASSEMBLY_THEOREM.md` | `23346f54002c8a39df46df7f1e7d9b688f2b2eb967ae772c74c6ae378d5b31a0` |
| `tests/test_growing_low_prefix_outer_floor_assembly_theorem.py` | `634d956aa2639466a1137cbbd5d4abed062dd50ecbd7269b63e38a8c65b98311` |
| `notes/GROWING_LOW_PREFIX_PHYSICAL_COFRAME_HALF_POWER_SCHUR_BARRIER.md` | `1f37e551fe37a9274961032386aa995d98d45a0c88b8622cb39ad25ff9cfb032` |
| `tests/test_growing_low_prefix_physical_coframe_half_power_schur_barrier.py` | `e31ae1d17c4d0df595b022d74ea6b8894ad45588d9693a1c7a318aa2874212aa` |
| `notes/LOWER_RITZ_RESIDUAL_INVERSE_SPREAD_DETERMINANT_SPLIT_THEOREM.md` | `0e905dbb849d1a7cbf9a8906831d9c192c75bd953c10bf13329ea94dcee788a3` |
| `tests/test_lower_ritz_residual_inverse_spread_determinant_split_theorem.py` | `8cc310388b33f6ee075060f56c3b084867c68f66cae8aee64567ab9cab11e36b` |

The first pair fixes the zero-integral and physical anchor-deflation label
ledger.  The second fixes `J_Q`, endpoint nullity, and full exterior-metric
whitening.  The outer theorem supplies the signed prefix floor.  The
physical coframe theorem identifies its actual range as an anchor-deflated
subspace and records the untouched retained complement.  The final pair
fixes the lower-Ritz and inverse-spread identities.

## 2. Source labels are not physical range vectors

Let `f_t` be the pure prolate source of label `t`.  The exact zero-integral
source has the form

\[
 q_t=f_t+\rho_tf_0.                                  \tag{2.1}
\]

Let `p_t` be its compact arithmetic image, let

\[
 \kappa={p_4\over\|p_4\|},\qquad
 \alpha_t={\langle p_4,p_t\rangle\over\|p_4\|^2},
 \qquad W_t=p_t-\alpha_tp_4.                         \tag{2.2}
\]

The underlying source column for `W_t` is

\[
 s_t=q_t-\alpha_tq_4
 =f_t-\alpha_tf_4+(\rho_t-\alpha_t\rho_4)f_0.       \tag{2.3}
\]

Thus the pure labels `0` and `4` occur in every anchor-deflated column
ledger even though

\[
 \langle W_t,\kappa\rangle=0.                       \tag{2.4}
\]

The endpoint shear, with a declared reference column such as `W_8`, has

\[
 W_t^\#=W_t-\gamma_tW_8.                            \tag{2.5}
\]

It may introduce the pure label `8` into more coefficient columns, but
linearity and (2.4) give

\[
 \operatorname {span}\{W_t^\#\}
 =\operatorname {span}\{W_t\}\subset\kappa^\perp.  \tag{2.6}
\]

This explains the apparently paradoxical index set (0.3).  It is the
union of pure source supports after the zero-integral correction, physical
anchor deflation, and endpoint shear.  It is not a list of physical basis
vectors retained by the final synthesis.

The distinction is also visible as a matrix factorization.  If

\[
 P=[\,p_4,p_8,p_{12},\ldots\,],
\]

physical anchor deflation is an invertible triangular change only while
the anchor is retained:

\[
 PS_\alpha=[\,p_4,W_8,W_{12},\ldots\,].             \tag{2.7}
\]

The outer complement synthesis is instead

\[
 W=PS_\alpha i_R,                                   \tag{2.8}
\]

where `i_R` deletes the anchor coordinate.  Endpoint shear replaces `W`
by `WS_eta` with `S_eta` invertible.  No invertible matrix on the smaller
domain can undo `i_R` or make `p_4` belong to `ran(W)`.

## 3. What full-metric congruence preserves

Let `H=H^*>0` be a coordinate form and let `c` be a coordinate row.  For
every invertible `T`, put

\[
 H^\#=T^*HT,\qquad c^\#=T^*c.                       \tag{3.1}
\]

Then

\[
 \boxed{(c^\#)^*(H^\#)^{-1}c^\#=c^*H^{-1}c.}       \tag{3.2}
\]

The same calculation shows that generalized floors are invariant when
the metric is transformed by the same congruence.  Consequently the exact
endpoint shear

\[
 D_{\rm full}^\#=S_\eta^*D_{\rm full}S_\eta,
 \qquad H^\#=S_\eta^*HS_\eta                       \tag{3.3}
\]

causes neither a condition-number loss nor an inverse-energy gain.  It
also preserves the physical range.  Coordinate whitening changes the
basis of that range, not the range itself.

This is why `J_Q^*J_Q=I` cannot be read as a physical coframe containing
the anchor.  The map `J_Q` lands in defect-white pure-modal exterior
coordinates and obeys the endpoint constraint (0.5).  The physical map is
`V_Q`; its range is (0.4).

Adjoining the anchor would replace `V_Q` by `[kappa,V_Q]`.  That is not of
the form `V_QT` with `T` invertible.  Moreover, the frozen outer estimates
are asserted only after endpoint-null compression by `J_Q`; the underlying
Toeplitz theorem explicitly supplies no uncompressed pure-label remainder
estimate.  An augmented anchor/rest theorem would therefore have to control
the common endpoint row and all anchor/rest signed cross terms anew.

## 4. Exact prefix/retained inverse-energy split

Let `U_Q` be any isometric synthesis onto

\[
 R_Q=\kappa^\perp\ominus{\cal K}_Q.
\]

Since `V_Q` is a bijection from its source support to `K_Q`, the combined
synthesis `[V_Q,U_Q]` is bijective onto `kappa^perp`.  In these coordinates
write

\[
 [V_Q,U_Q]^*B[V_Q,U_Q]
 =\begin{pmatrix}D_Q&C_Q^*\\C_Q&R_Q^{\rm form}\end{pmatrix},
 \qquad
 [V_Q,U_Q]^*b=\binom{c_Q}{b_Q^{\rm ret}}.            \tag{4.1}
\]

Because `B>0`,

\[
 D_Q\succ0,\qquad
 S_Q=R_Q^{\rm form}-C_QD_Q^{-1}C_Q^*\succ0.         \tag{4.2}
\]

Block Gaussian elimination gives (0.8) with

\[
 e_Q=b_Q^{\rm ret}-C_QD_Q^{-1}c_Q.                  \tag{4.3}
\]

Equivalently, the first term is the variational energy visible on the
prefix:

\[
 c_Q^*D_Q^{-1}c_Q
 =\sup_{0\ne v\in{\cal K}_Q}
 { |\langle b,v\rangle|^2\over\langle v,Bv\rangle}
 \leq\langle b,B^{-1}b\rangle.                     \tag{4.4}
\]

An upper bound for the visible term is therefore not an upper bound for
the complete inverse energy.  It is only an upper bound for one
nonnegative summand.

The unshifted outer theorem alone gives a floor for `V_Q^*AV_Q`; it does
not license replacing `A` by `B=A-uI`.  The separately frozen physical
coframe consequence supplies exactly the missing comparison:

\[
 u_+\|V_Q\|^2=o(\lambda^{-4}),\qquad u_+=\max(u,0).   \tag{4.5}
\]

Consequently, still conditionally on (0.2a),

\[
 D_Q=V_Q^*BV_Q\succeq\{L/8-o(\lambda^{-4})\}I.     \tag{4.6}
\]

If the predicted growing dual row

\[
 \|c_Q\|^2=\|V_Q^*b\|^2=O(d_4L^2)                  \tag{4.7}
\]

were proved, (4.6) would give (0.7).  The fixed Toeplitz coefficients are
square summable, but the required growing quantifier in (4.7) is not
frozen.  More importantly, even granting (4.7) leaves (0.11) unchanged.

Under a prefix re-coordination `V_Q -> V_QT`, equations (3.1)--(3.2)
show that the first term in (0.8) is invariant.  A retained
re-coordination similarly preserves the second term.  Endpoint shear and
full-metric whitening therefore cannot transfer the retained energy into
the controlled prefix term.

## 5. A sharp retained inverse-spread family

Let `L>1` and `d>0`, and on a two-dimensional complement put

\[
 B_L=\begin{pmatrix}L&0\\0&L^{-8}\end{pmatrix},
 \qquad
 b_L=\sqrt d\binom{L}{L^{-2}}.                       \tag{5.1}
\]

Take the first coordinate as the visible prefix.  It has exactly

\[
 B_L|_{{\cal K}_Q}=L,
 \qquad |(b_L)_{{\cal K}_Q}|^2=dL^2,
 \qquad {(b_L)_{{\cal K}_Q}^2\over L}=dL.           \tag{5.2}
\]

But the full inverse energy is

\[
 \boxed{\langle b_L,B_L^{-1}b_L\rangle
 =d(L+L^4).}                                        \tag{5.3}
\]

The retained summand is `dL^4`.

Let

\[
 r_L^2=\|b_L\|^2=d(L^2+L^{-4}),
 \qquad
 m_L={\langle b_L,B_Lb_L\rangle\over r_L^2},        \tag{5.4}
\]

and set

\[
 u_L=0,\qquad q_L=t_L={r_L^2\over m_L}
 =dL{(1+L^{-6})^2\over1+L^{-15}}.                   \tag{5.5}
\]

Then the compression of

\[
 Q_{+,L}=\begin{pmatrix}q_L&b_L^*\\b_L&B_L\end{pmatrix}          \tag{5.6}
\]

to `span{kappa,b_L/r_L}` has determinant zero and positive trace.  Hence
its genuine lower two-vector Ritz value is `u_L=0`, while

\[
 q_L-u_L\sim dL.                                    \tag{5.7}
\]

The complement sign `B_L>0` is strict, and an independent odd block equal
to one gives `Q_--u_LI>0`.  Nevertheless, by (5.3),

\[
 {\langle b_L,B_L^{-1}b_L\rangle\over dL}=1+L^3
 \longrightarrow\infty.                            \tag{5.8}
\]

This family shows exactly what re-coordination cannot repair.  The direct
Ritz lowering may already have the desired scale while a soft retained
direction makes the inverse spread arbitrarily large.  It is a structural
linear-algebra family, not the pinned source-Cauchy or arithmetic matrix.

## 6. Strict stopping line

There are two distinct missing theorems.

1.  To control even the visible prefix contribution by the Toeplitz row,
    one needs the growing full-metric row estimate (4.7).  It cannot be
    extracted merely from the occurrence of labels `0` and `4` in
    `I_Q`, because those are pure coefficient labels and the frozen error
    theorem is already compressed to the anchor-deflated endpoint-null
    range.
2.  To control the full inverse row one additionally needs (0.11), or an
    equivalent signed floor and dual-row bound on a residual-containing
    range.  The low prefix has dimension `O(L)` while its retained physical
    complement has much larger dimension, so no range equality or reducing
    property is available.

Therefore the outer-floor theorem cannot be re-coordinated into the desired
bound

\[
 \langle b,(A-uI)^{-1}b\rangle=O(d_4L).             \tag{6.1}
\]

An augmented theorem could add the anchor row and prove (4.7), but it would
still leave the exact retained term (0.11).  No coordinate choice changes
that conclusion.

## 7. Reproduction

Run

    python3 -B -m unittest \
      tests.test_growing_anchor_row_full_metric_toeplitz_inverse_energy_barrier -v

The regression checks every frozen hash, the source-label ledger, physical
range preservation, full-metric inverse-energy congruence, the exact block
inverse split, the retained counterfamily and lower-Ritz normalization,
displayed TeX, ASCII hygiene, and the fail-closed scope.
