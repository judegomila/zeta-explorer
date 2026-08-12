# Structured full/block exterior-metric quotient bridge theorem

## 0. Outcome and claim boundary

For the actual anchor-deflated low plus columns, the off-diagonal block of
the full exterior metric is not arbitrary.  It is

\[
 K=d_4\alpha _8\alpha _R^*+d_0b_8b_R^*.                 \tag{0.1}
\]

The two rank-one summands already occur positively in the rest metric.
Their leverage therefore proves the uniform relative estimate

\[
 \boxed{
 \varepsilon_L:=\|D_8^{-1/2}KD_R^{-1/2}\|
 \leq |\alpha _8|\sqrt{d_4/D_8}
       +|b_8|\sqrt{d_0/D_8}
 =O(\lambda^{-4}).}                                     \tag{0.2}
\]

This estimate is uniform in the growing rest inventory.  In particular, it
does not require bounds for `||alpha_R||` or `||b_R||`.  It gives an exact
`1+O(lambda^(-4))` Loewner bridge between the full and block exterior
metrics, their inverse physical quotients, and the induced minimum-energy
quotient metrics.  The exact inverse block formula also preserves the
current sharp positive-sampling action

\[
 \boxed{\Gamma_{\rm full}
 =O\!\left({\lambda P(\lambda)\over d_8}\right),}       \tag{0.3}
\]

where `P` is one fixed enlarged positive polylogarithmic factor.

This repairs the full-metric obstruction only for the structured low source
columns in (0.1).  The abstract counterexamples with uncontrolled
off-diagonal blocks remain valid.

The endpoint-null triangular shear is also audited exactly.  If the whole
synthesis and the whole metric are sheared together, the physical quotient,
quotient metric, and sampling action are invariant.  The shear does not
reduce the endpoint Riesz norm.  Relative to the unsheared block metric its
off-diagonal norm is only bounded by `O(sqrt(q_R))=O(lambda)`, and discarding
the pulled-back cross or rank-one term can therefore pay a full factor
`q_R`.  Endpoint nulling makes the rest endpoint row vanish; it does not
annihilate the common sampler trace or prove a signed floor.

No physical high-complement estimate, low/high reducing property, signed
comparison, equation (5.2) of `DIRECT_RH_ATTACK.md`, determinant
convergence, RH conclusion, or Lambda bound follows.  The project status
remains `P0_INVALIDATED`.

## 1. Frozen inputs and exact low metric

The proof uses the following exact repository bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/BLOCK_QUOTIENT_ACTION_THEOREM.md` | `31c4239b2dec0114be7b8e9b42e52ebc6361130461d1225e05c81ff5b26369d4` |
| `tests/test_block_quotient_action.py` | `64a436a48fafbb481d7691f086ca1b49ed3fd692d90d08489a95d513df129b64` |
| `notes/LOW_BLOCK_FORCING_RATE_FULL_METRIC_BARRIER.md` | `93457a821e2fcf3771201af6cc4673ac5a4cd2410be722ad94f2d9f881f3e329` |
| `tests/test_low_block_forcing_rate_full_metric_barrier.py` | `9b461a01e5025c874ced03d00f56b1915be05e05396759c75d301fe7c6ed4fbb` |
| `notes/FIXED_LABEL_EIGHT_ARITHMETIC_SYNTHESIS_GAIN.md` | `9e98b870419a721c8797e7577b6edf18649e50f6c9fe6f727dae61a53d6d7f71` |
| `tests/test_fixed_label_eight_arithmetic_synthesis_gain.py` | `88c14ee4a2dfa9d2a9de33a615a4fd3601bb23e6393ca2a278ac34ba15cfc1de` |
| `notes/TRANSITION_PROLATE_OUTER_THEOREM.md` | `215f27adc0453f601ced419bd39910cb821c31b2e77678b63874987510f4f9c6` |
| `tests/test_transition_prolate_outer.py` | `bc03f010254e0b56c800b1fc4dfb38cd7ea17a0ebc1133064f751d6eab08b433` |
| `notes/FIXED_EVEN_ENDPOINT_NULL_VOLTERRA_PNT_CORRELATION_BARRIER.md` | `c2c0ab5c4747a38a9fa2743d4b62d01165c1fa0771d25b253b79f28ff921663b` |
| `tests/test_fixed_even_endpoint_null_volterra_pnt_correlation_barrier.py` | `195f71b516553b18bccd0ed9b873191abf463b6f72c79f2c4418f041f3f1bd73` |
| `notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md` | `6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9` |
| `tests/test_growing_transition_complete_central_form_reduction.py` | `a842fdd24e095cde5af373060f9017e03bb13df1db5ecf6f6374c4fbcf6743de` |

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 c=2\pi\lambda^2.                                       \tag{1.1}
\]

For the label-8 singleton and the growing rest set

\[
 \mathcal T_R=\{12,16,20,\ldots\}\cap[0,n_*),\qquad
 q_R=|\mathcal T_R|\leq {3\over2}\lambda^2,             \tag{1.2}
\]

retain the exact anchor-deflated source columns

\[
 f_8=e_8-\alpha _8e_4+b_8e_0,
 \qquad
 f_t=e_t-\alpha _te_4+b_te_0\quad(t\in\mathcal T_R).    \tag{1.3}
\]

Write `alpha_R` and `b_R` for the corresponding column vectors and put

\[
 D_8=d_8+d_4|\alpha _8|^2+d_0|b_8|^2,                  \tag{1.4}
\]

\[
 D_R=D_T+d_4\alpha _R\alpha _R^*+d_0b_Rb_R^*,
 \qquad D_T=\operatorname {diag}_{t\in\mathcal T_R}(d_t). \tag{1.5}
\]

Every `d_n` is positive and `D_T>0`, so `D_8>0` and `D_R>0`.  In the raw
split `(8,R)`, the full and block exterior metrics are

\[
 D_{\rm full}=
 \begin{pmatrix}D_8&K\\K^*&D_R\end{pmatrix},
 \qquad
 D_{\rm block}=D_8\oplus D_R,                           \tag{1.6}
\]

with `K` given by (0.1).  These are the actual source quantities before the
later endpoint shear.

## 2. Uniform leverage bridge

The following elementary rank-one leverage lemma is the whole reason the
growing vectors in (0.1) cause no loss.

### Lemma 2.1 (positive rank-one leverage)

If `A>0` and `A>=u u^*`, then

\[
 \boxed{u^*A^{-1}u\leq1.}                               \tag{2.1}
\]

Indeed, conjugating the order by `A^(-1/2)` gives
`(A^(-1/2)u)(A^(-1/2)u)^*<=I`, whose only nonzero eigenvalue is
`u^*A^(-1)u`.

Apply the lemma separately to the two positive summands of (1.5).  It gives

\[
 d_4\alpha _R^*D_R^{-1}\alpha _R\leq1,
 \qquad
 d_0b_R^*D_R^{-1}b_R\leq1.                              \tag{2.2}
\]

The operator in (0.2) is a row, so the triangle inequality and (2.2) give

\[
\begin{aligned}
 \varepsilon_L
 &\leq {d_4|\alpha _8|\over\sqrt {D_8}}
       \|\alpha _R^*D_R^{-1/2}\|
     +{d_0|b_8|\over\sqrt {D_8}}
       \|b_R^*D_R^{-1/2}\|\\
 &\leq |\alpha _8|\sqrt{d_4/D_8}
       +|b_8|\sqrt{d_0/D_8}.
\end{aligned}                                           \tag{2.3}
\]

This proof is dimension free.  It uses neither an entrywise estimate nor a
norm bound for the growing vectors.

The frozen fixed-label limits are

\[
 {D_8\over d_8}\longrightarrow1,
 \qquad \alpha _8=O(1),\qquad b_8=O(1),                 \tag{2.4}
\]

\[
 {d_4\over d_8}\sim{105\over4096\pi^4}\lambda^{-8},
 \qquad
 {d_0\over d_8}\sim{315\over2^{25}\pi^8}\lambda^{-16}. \tag{2.5}
\]

Consequently

\[
 \sqrt{d_4/D_8}
 ={\sqrt {105}\over64\pi^2}\lambda^{-4}(1+o(1)),
 \qquad
 \sqrt{d_0/D_8}
 ={\sqrt {315}\over4096\sqrt2\,\pi^4}
     \lambda^{-8}(1+o(1)),                              \tag{2.6}
\]

which proves (0.2).  In particular, `epsilon_L<1` for all sufficiently
large locked `lambda`.

## 3. Exact full/block Loewner equivalence

Define the normalized off-diagonal row

\[
 E=D_8^{-1/2}KD_R^{-1/2},\qquad \|E\|=\varepsilon_L,    \tag{3.1}
\]

and the Hermitian normalized metric

\[
 M=\begin{pmatrix}1&E\\E^*&I_R\end{pmatrix}.
                                                                    \tag{3.2}
\]

Then the factorization is exact:

\[
 \boxed{D_{\rm full}=D_{\rm block}^{1/2}
 M D_{\rm block}^{1/2}.}                                \tag{3.3}
\]

The self-adjoint off-diagonal part `M-I` has norm `||E||`.  Therefore

\[
 (1-\varepsilon_L)I\preceq M
 \preceq(1+\varepsilon_L)I,                              \tag{3.4}
\]

and congruence gives the exact relative metric bounds

\[
 \boxed{
 (1-\varepsilon_L)D_{\rm block}
 \preceq D_{\rm full}
 \preceq(1+\varepsilon_L)D_{\rm block}.}                \tag{3.5}
\]

Inverting the positive operators reverses the order:

\[
 \boxed{
 {1\over1+\varepsilon_L}D_{\rm block}^{-1}
 \preceq D_{\rm full}^{-1}
 \preceq {1\over1-\varepsilon_L}D_{\rm block}^{-1}.}   \tag{3.6}
\]

For later sampling, retain the exact inverse rather than only (3.6):

\[
 M^{-1}=
 \begin{pmatrix}
 (1-EE^*)^{-1}&-E(I_R-E^*E)^{-1}\\
 -(I_R-E^*E)^{-1}E^*&(I_R-E^*E)^{-1}
 \end{pmatrix}.                                         \tag{3.7}
\]

Its two diagonal blocks have norm at most
`(1-epsilon_L^2)^(-1)`, and each off-diagonal block has norm at most
`epsilon_L(1-epsilon_L^2)^(-1)`.

## 4. Physical quotients and minimum-energy metrics

Let

\[
 W=[\,W_8\;W_R\,],\qquad
 A=WD_{\rm block}^{-1/2}=[\,A_8\;A_R\,].               \tag{4.1}
\]

Define the two inverse quotient metrics

\[
 R_{\rm block}=WD_{\rm block}^{-1}W^*=AA^*,
 \qquad
 R_{\rm full}=WD_{\rm full}^{-1}W^*=AM^{-1}A^*.        \tag{4.2}
\]

Both have the same physical range

\[
 \mathcal K_L=\operatorname {ran}W
 =\operatorname {ran}R_{\rm block}
 =\operatorname {ran}R_{\rm full}.                      \tag{4.3}
\]

Congruencing (3.6) by `W` proves

\[
 \boxed{
 {1\over1+\varepsilon_L}R_{\rm block}
 \preceq R_{\rm full}
 \preceq {1\over1-\varepsilon_L}R_{\rm block}.}        \tag{4.4}
\]

On `K_L`, put

\[
 \Delta_{\rm block}=R_{\rm block}^\dagger|_{\mathcal K_L},
 \qquad
 \Delta_{\rm full}=R_{\rm full}^\dagger|_{\mathcal K_L}. \tag{4.5}
\]

Thus `Delta_block^(-1)=R_block` and
`Delta_full^(-1)=R_full` on the common range.  Inverting (4.4) on that
range gives the sharper-looking quotient-metric order

\[
 \boxed{
 (1-\varepsilon_L)\Delta_{\rm block}
 \preceq\Delta_{\rm full}
 \preceq(1+\varepsilon_L)\Delta_{\rm block}.}           \tag{4.6}
\]

Equations (4.2), (4.4), and (4.6) are the exact inverse-action bridge.  A
Loewner comparison by itself does not imply a multiplicative comparison of
`||S R_full||` and `||S R_block||` for an arbitrary left sampling operator
`S`; the factors need not commute.  The next section uses (3.7) and the
actual block estimates instead.

## 5. The sharp full-metric positive-sampling action

Let `mathcal S` be the complete paired-zero sampling analysis.  Retain the
frozen estimates

\[
 \|\mathcal SA_8\|^2\leq C_8,
 \qquad \|\mathcal SA_R\|^2\leq C_R,                    \tag{5.1}
\]

\[
 M_8=\|A_8\|^2,\qquad M_R=\|A_R\|^2.                   \tag{5.2}
\]

Expanding `A M^(-1) A^*` by the four blocks in (3.7) and applying the
operator triangle inequality gives

\[
\boxed{
 \|\mathcal S R_{\rm full}\|
 \leq {1\over1-\varepsilon_L^2}
 \left\{
 \sqrt{C_8M_8}+\sqrt{C_RM_R}
 +\varepsilon_L\bigl(\sqrt{C_8M_R}+\sqrt{C_RM_8}\bigr)
 \right\}.}                                             \tag{5.3}
\]

No cross orientation has been discarded: the last two terms are precisely
the two normalized off-diagonal orientations.

The current sharp singleton and rest bounds are

\[
 C_8=O(\lambda P),\qquad C_R=O(\lambda^3P),             \tag{5.4}
\]

\[
 M_8=O(d_8^{-1}),\qquad
 M_R=O(\lambda^{-2}d_8^{-1}).                            \tag{5.5}
\]

The first two square roots in (5.3) are each
`O(lambda^(1/2)P^(1/2)d_8^(-1/2))`.  By (0.2), the mixed square roots are

\[
 \varepsilon_L\sqrt{C_8M_R}
 =O(\lambda^{-9/2}P^{1/2}d_8^{-1/2}),
 \qquad
 \varepsilon_L\sqrt{C_RM_8}
 =O(\lambda^{-5/2}P^{1/2}d_8^{-1/2}).                  \tag{5.6}
\]

Therefore, for

\[
 \Gamma_{\rm full}(\Delta_{\rm full})
 :=\|\mathcal S\Delta_{\rm full}^{-1}\|^2
 =\|\mathcal S R_{\rm full}\|^2,                      \tag{5.7}
\]

equations (5.3)--(5.6) prove (0.3).  This is an upper-envelope transfer,
not a claim that the two exact sampling actions have ratio `1+o(1)`.
No cancellation between the two blocks is assumed.

For reference, if the already frozen positive forcing inequality on this
same physical range is used, its consequence is unchanged:

\[
 c_Lc_L^*\preceq\epsilon_\lambda\mathcal S^*\mathcal S,
 \quad \epsilon_\lambda=o(d_6)
 \quad\Longrightarrow\quad
 \|\Delta_{\rm full}^{-1}c_L\|^2
 =o(\lambda^{-3}P(\lambda)).                             \tag{5.8}
\]

This is still only a positive-sampling forcing bound.  It does not supply
the missing signed inverse reserve.

## 6. Exact endpoint-null shear invariance

Let the endpoint row on the raw columns be

\[
 \ell=(\ell_8,\ell_R),\qquad
 \ell_8=\eta(f_8)\neq0,
 \qquad \gamma={\ell_R\over\ell_8}.                    \tag{6.1}
\]

The endpoint-null column shear is

\[
 T_\eta=\begin{pmatrix}1&-\gamma\\0&I_R\end{pmatrix},
 \qquad
 f_t^\#=f_t-\gamma_tf_8.                                \tag{6.2}
\]

It makes the rest row vanish exactly:

\[
 \ell^\#=\ell T_\eta=(\ell_8,0).                       \tag{6.3}
\]

Shear the entire synthesis and both entire metrics,

\[
 W^\#=WT_\eta,
 \qquad
 D_i^\#=T_\eta^*D_iT_\eta
 \quad(i\in\{\operatorname {full},\operatorname {block}\}). \tag{6.4}
\]

Congruence preserves (3.5):

\[
 (1-\varepsilon_L)D_{\rm block}^\#
 \preceq D_{\rm full}^\#
 \preceq(1+\varepsilon_L)D_{\rm block}^\#.             \tag{6.5}
\]

More strongly, invertibility of `T_eta` gives the exact quotient
invariances

\[
 \boxed{
 W^\#(D_i^\#)^{-1}(W^\#)^*=WD_i^{-1}W^*
 \quad(i\in\{\operatorname {full},\operatorname {block}\}).} \tag{6.6}
\]

Thus the physical range, quotient metric, inverse action, and positive
sampling action are unchanged when the complete pulled-back metric is
retained.  The endpoint Riesz norm is likewise invariant:

\[
 \boxed{
 \ell^\#(D_{\rm full}^\#)^{-1}(\ell^\#)^*
 =\ell D_{\rm full}^{-1}\ell^*.}                        \tag{6.7}
\]

The shear buys an endpoint-null representation for the rest columns.  It
does not buy a smaller quotient, a smaller sampling action, or endpoint-row
cancellation.

## 7. Endpoint Riesz norm and the `q_R` amplification

The size hidden by (6.3) can be bounded without estimating any anchor
coefficient.  Let `mathcal C_R` denote the source coefficient synthesis of the
rest columns into the prolate rows

\[
 \mathcal I_R=\{0,4\}\cup\mathcal T_R,
 \qquad
 \mathfrak d_R=\operatorname {diag}_{n\in\mathcal I_R}(d_n). \tag{7.1}
\]

Thus

\[
 D_R=\mathcal C_R^*\mathfrak d_R\mathcal C_R,
 \qquad
 \ell_R=e_R^*\mathcal C_R,
 \qquad
 e_R=(h_{n,\lambda}(\lambda))_{n\in\mathcal I_R}.       \tag{7.2}
\]

The matrix

\[
 U_R=\mathfrak d_R^{1/2}\mathcal C_RD_R^{-1/2}        \tag{7.3}
\]

is an isometry.  Hence the transition endpoint theorem gives

\[
\begin{aligned}
 \|\ell_RD_R^{-1/2}\|^2
 &\leq\|\mathfrak d_R^{-1/2}e_R\|^2\\
 &=\sum_{n\in\mathcal I_R}
       {|h_{n,\lambda}(\lambda)|^2\over d_n}\\
 &\leq2592\pi^2\lambda(q_R+2).
\end{aligned}                                           \tag{7.4}
\]

For the fixed label-8 column, the frozen endpoint asymptotic is

\[
 {|\ell_8|^2\over D_8}\sim2\pi\lambda.                \tag{7.5}
\]

Define the off-diagonal part of the shear whitened by the unsheared block
metric:

\[
 \zeta=\sqrt {D_8}\,\gamma D_R^{-1/2}.
                                                                    \tag{7.6}
\]

Equations (7.4)--(7.5) imply

\[
 \boxed{
 \|\zeta\|^2
 ={D_8\over|\ell_8|^2}\|\ell_RD_R^{-1/2}\|^2
 \leq(1296\pi+o(1))(q_R+2),}                           \tag{7.7}
\]

and therefore `||zeta||=O(sqrt(q_R))=O(lambda)`.  In fact

\[
 D_{\rm block}^{1/2}T_\eta D_{\rm block}^{-1/2}
 =\begin{pmatrix}1&-\zeta\\0&I_R\end{pmatrix},         \tag{7.8}
\]

whose norm, and the norm of its inverse, is exactly

\[
 \Phi(\|\zeta\|)
 ={\sqrt{4+\|\zeta\|^2}+\|\zeta\|\over2}.             \tag{7.9}
\]

Thus the frozen endpoint estimates provide only an `O(sqrt(q_R))`
condition-number bound for this triangular coordinate choice.  Equation
(7.7) is an upper bound; it does not assert that the actual prolate shear is
unbounded.  A uniform bound would require a new endpoint-frame cancellation
not present in the frozen inputs.

The same fact has an exact Schur form.  For the pulled-back block metric,

\[
 D_{\rm block}^\#=
 \begin{pmatrix}
 D_8&-D_8\gamma\\
 -D_8\gamma^*&D_R+D_8\gamma^*\gamma
 \end{pmatrix}.                                         \tag{7.10}
\]

Its anchor Schur complement is

\[
 \boxed{
 D_8-D_8^2\gamma(D_R+D_8\gamma^*\gamma)^{-1}\gamma^*
 ={D_8\over1+\|\zeta\|^2}.}                            \tag{7.11}
\]

Although the sheared endpoint row has only one nonzero coordinate, its
Riesz norm is therefore

\[
 {|\ell_8|^2\over D_8/(1+\|\zeta\|^2)}
 ={|\ell_8|^2\over D_8}+\|\ell_RD_R^{-1/2}\|^2.       \tag{7.12}
\]

The rest contribution has moved into the anchor Schur denominator; it has
not disappeared.  By (3.6), the full-metric endpoint Riesz norm is within
the same `1+O(lambda^(-4))` relative bounds as (7.12).

The possible `q_R` loss is sharp at the level of these structural data.  In
the finite model

\[
 D_8=1,\qquad D_R=I_q,\qquad
 \ell_8=1,\qquad \ell_R=(1,\ldots,1),                    \tag{7.12a}
\]

one has

\[
 \|\zeta\|^2=q,\qquad
 \ell D_{\rm block}^{-1}\ell^*=q+1,\qquad
 \operatorname {Schur}_8(D_{\rm block}^\#)={1\over q+1}. \tag{7.12b}
\]

Hence no uniform shear bound follows from positive definiteness and
endpoint nulling alone.  This model is a sharpness test for the available
argument, not a claim that the actual prolate endpoint row saturates (7.7).

This also identifies the precise sampling pitfall.  If one shears the rest
columns but incorrectly continues to normalize them only by the old `D_R`,
then

\[
 \|\mathcal S(W_R-W_8\gamma)D_R^{-1/2}\|
 \leq\sqrt {C_R}+\sqrt {C_8}\,\|\zeta\|,               \tag{7.13}
\]

\[
 \|(W_R-W_8\gamma)D_R^{-1/2}\|
 \leq\sqrt {M_R}+\sqrt {M_8}\,\|\zeta\|.             \tag{7.14}
\]

The sampling constant stays at most `O(lambda^3 P)`, but the available
separate synthesis estimate is only

\[
 O(q_RM_8)=O(\lambda^2d_8^{-1}),                       \tag{7.15}
\]

and the resulting separate-block action envelope is only
`O(lambda^5 P/d_8)`.  This loses the target scale.

Put `B_R^#=D_R+D_8 gamma^*gamma`, the lower-right block in (7.10).  Keeping
this added rest penalty removes the explicit `q_R` from the two individual
row bounds: weighted Cauchy--Schwarz gives

\[
 \|\mathcal S(W_R-W_8\gamma)(B_R^\#)^{-1/2}\|^2
 \leq C_R+C_8,                                          \tag{7.16}
\]

\[
 \|(W_R-W_8\gamma)(B_R^\#)^{-1/2}\|^2
 \leq M_R+M_8.                                          \tag{7.17}
\]

But this isolated rest metric still omits the cross `-D_8 gamma` in (7.10)
and need not recover the sharp action.  Its separate-block envelope is only
`O(lambda^3 P/d_8)`.  Carrying the complete pulled-back block metric in
(7.10), or equivalently using the unsheared factorization (3.3), preserves
(0.3) exactly through (6.6).

## 8. Final scope

The theorem proves the structured bridge (0.2), the full/block metric and
quotient orders (3.5)--(4.6), the full-metric action (0.3), and the exact
endpoint-shear invariances and `q_R` warning (6.6)--(7.17).

It does not show that the full and block sampling actions have a pointwise
ratio tending to one, because Loewner order does not commute through an
arbitrary left sampling row.  It proves no sampling cancellation.  It also
does not change the missing signed low floor, physical high complement,
low/high coupling, odd sector, or determinant limit.  In particular, none
of the conclusions is an RH-level sign theorem.
