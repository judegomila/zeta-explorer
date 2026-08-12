# Cutoff-free weighted radical coframe reduction and orientation barrier

## 0. Exact outcome and claim boundary

Let `p` tend to infinity through the odd positive integers and put

\[
 \lambda={p\over2},\qquad L=2\log\lambda,\qquad
 S=4\lambda^2=p^2.                                      \tag{0.1}
\]

Write `Q_lambda` for the full cutoff-free semilocal Weil operator,
`mu_lambda` for its bottom eigenvalue, and `P_lambda` for its complete
bottom projector, including multiplicity and both inversion parities.

This note gives a basis-invariant version of the full-source radical-frame
route.  On a finite phase-separated leading prolate source space `F`, let
`Delta_F` be the exact exterior-defect operator, let `mathcal K_F` be the
compact physical radical map, and put

\[
 T_F=P_\lambda\mathcal K_F:F\longrightarrow
 X_\lambda:=\operatorname {Ran}P_\lambda.                \tag{0.2}
\]

The sharp weighted coframe statistic is

\[
 \boxed{
 \Lambda_F=\lambda_{\min}^{+}
 \left(T_F\Delta_F^\dagger T_F^*\right)
 =s_{\min}^{+}
 \left(T_F(\Delta_F^\dagger)^{1/2}\right)^2.}           \tag{0.3}
\]

The superscript `+` means that the operator is first restricted to the
support of `Delta_F`; if its range is not all of `X_lambda`, set
`Lambda_F=0`.  Define the exact cutoff-free residual-map constant

\[
 \boxed{
 \mathcal C_F=
 \left\|Q_\lambda\mathcal K_F
       (\Delta_F^\dagger)^{1/2}\right\|.}               \tag{0.4}
\]

The minimum-defect right inverse proves the exact implication

\[
 \boxed{
 \Lambda_F>0\quad\Longrightarrow\quad
 |\mu_\lambda|\leq{\mathcal C_F\over\sqrt{\Lambda_F}}.} \tag{0.5}
\]

There is no Hilbert--Schmidt or source-dimension loss in (0.5).  The
operator synthesis maps an orthonormal basis of the complete bottom space
back to sources simultaneously, and its projected physical frame is the
identity on that bottom space.

For a hard leading prefix `F_m`, let `d_m` be its largest prolate defect.
Normalize the full-source map by

\[
 R_\lambda=T_\infty T_\infty^*,\qquad
 U_\lambda=R_\lambda^{-1/2}T_\infty,
 \qquad U_\lambda U_\lambda^*=I_{X_\lambda}.            \tag{0.6}
\]

The exact principal-angle capture is

\[
 \boxed{
 \gamma_m=1-\|(I-P_{F_m})U_\lambda^*\|^2
 =\lambda_{\min}\!\left(
 R_\lambda^{-1/2}T_{F_m}T_{F_m}^*
 R_\lambda^{-1/2}\right).}                             \tag{0.7}
\]

The full-source floor and `Delta_(F_m)<=d_m I` give

\[
 \boxed{
 \Lambda_{F_m}\geq{\gamma_m\over8\lambda^4d_m}.}       \tag{0.8}
\]

Consequently the exact hard-prefix stopping condition is

\[
 \boxed{
 {8\mathcal C_{F_m}^2\lambda^4d_m\over\gamma_m}
 \longrightarrow0.}                                    \tag{0.9}
\]

Condition (0.9) forces `mu_lambda->0` on the halfgrid; domain monotonicity
then forces the full limit, and the pinned CCM implication yields RH.  This
is a conditional implication, not a proof of (0.9).

The KRD leading-defect bound makes the missing rate explicit.  If
`m<=S-1`,

\[
 d_m\leq10\exp\left\{-{S-m-7\over\beta_\lambda}\right\},
 \qquad
 \beta_\lambda={2\over\pi^2}\log(200\lambda^2+25).     \tag{0.10}
\]

Thus a polynomial residual constant and a polynomial normalized capture
would need only a prefix ending `O((log lambda)^2)` below the Shannon index.
Neither estimate is proved here for the actual bottom projector.

The explicit full-source Mobius right inverse gives a sufficient
approximation-number version of the same target, but its visible source has
real arithmetic jumps.  The currently frozen `BV` approximation theorem
does not put its first successful prefix below the Shannon edge.  Finally,
an exact rational orientation family has the same full row floor and the
same defect spectrum while its leading-prefix `gamma_m` tends to zero.
Therefore `T_infty*T_infty^*>=(8 lambda^4)^(-1)I` and the prolate singular
values alone cannot prove (0.9).

No actual weighted coframe lower bound, bottom capture, cutoff-free family
residual rate, parity order, new zero statement, converse, or RH is proved.
The standard eight are untouched and the formal state remains
`P0_INVALIDATED`.

## 1. Frozen dependencies

No new external source is used.  The exact repository inputs are:

| Dependency | SHA-256 |
|---|---|
| `notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md` | `3f8b381d9e51e0fa0cf89928851e89dd163ec9982249af8050a90520c0389f81` |
| `tests/test_full_source_coframe_rank.py` | `dc322485178710618f9ace19cd2019200bf0dafeabcbe17cce4e47d41377d66a` |
| `notes/GROWING_TRANSITION_SAMPLING_THEOREM.md` | `551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72` |
| `tests/test_growing_transition_sampling.py` | `ba9ee58e36bc79a602d70a791010a93eb75a5613b0509a0cdc7b11b810a403ac` |
| `notes/COMPACT_ABSOLUTE_SAMPLING_THEOREM.md` | `2feb3d62a71e435706c4b330d13bcb096015e52204af6ec9bd2828308d44383d` |
| `tests/test_compact_absolute_sampling.py` | `883c0e4edd8b6573bcf11740031a6a0ea93340d45e36ac1057e3793b729bc605` |
| `notes/CUTOFF_FREE_PROLATE_GROUND_ALIGNMENT_RH_DICHOTOMY.md` | `37f381b6ed75017633f4c845f90ff7d2660699bc0ae7a4340ec789b0e8dccea7` |
| `tests/test_cutoff_free_prolate_ground_alignment_rh_dichotomy.py` | `b17c3c603d459547c09fd0abb92b595986356e29e1d53f7e8c6f3ace4a8baf80` |
| `notes/GROWING_WINDOW_THEOREM.md` | `dad6b0a878b7eba21cbc7aa8049cf3bf89a38df766cc157a87c416e79a721ac7` |
| `notes/EFFECTIVE_MIXED_PREFIX_SCHEDULE_ATTACK.md` | `a33e7a072057f1444afb9d00911465f599fec508d0a6488e655638947cc515ba` |

The full-source pair supplies the two parity row floors and the explicit
Mobius right inverse.  The transition pair supplies defect-relative
absolute sampling on each same-phase leading source space.  The compact
sampling pair supplies the finite physical Bessel constant.  The
cutoff-free pair supplies the operator domain, diagonal-plus-Cauchy graph
calculus, domain monotonicity, and the implication from `mu_lambda->0` to
RH.  The growing-window note supplies (0.10) and the Shannon edge.  The
effective-prefix note supplies the exact Mobius-tail approximation test,
its `BV` majorant, and the jump audit used in Section 7.

## 2. Phase-separated radical source space

Let `h_(n,lambda)` be the unit-orthonormal even additive prolate modes and
write

\[
 \widehat h_{n,\lambda}\big|_{[-\lambda,\lambda]}
 =\sigma_n\chi_nh_{n,\lambda},\qquad
 \sigma_n=(-1)^{n/2},\qquad d_n=1-\chi_n^2.             \tag{2.1}
\]

For `m<=S-1`, define

\[
 \begin{aligned}
 F_{+,m}&=\left\{
  \sum_{\substack{0\leq n\leq m\\n\equiv0\ (4)}}a_nh_{n,\lambda}:
  \int f=0\right\},\\
 F_{-,m}&=\left\{
  \sum_{\substack{0\leq n\leq m\\n\equiv2\ (4)}}a_nh_{n,\lambda}:
  \int f=0\right\},\\
 F_m&=F_{+,m}\mathbin\oplus F_{-,m}.
 \end{aligned}                                           \tag{2.2}
\]

The direct sum in (2.2) is a source direct sum: its two components will be
sent to the two orthogonal physical inversion sectors.  This avoids
identifying additive Fourier phase with physical inversion parity.
No density of the increasing phase-separated spaces `F_m` in the full
two-copy source is asserted or used; capture of the bottom space is exactly
the missing quantitative issue measured in Section 5.

For `f=(f_+,f_-)`, put

\[
 D_m(f)=
 \sum_{\sigma\in\{+,-\}}
 \sum_{n\in I_{\sigma,m}}d_n|a_{\sigma,n}|^2
 =\langle f,\Delta_m f\rangle.                          \tag{2.3}
\]

Every finite prolate concentration eigenvalue lies strictly between zero
and one, so `Delta_m>0` on a nonzero `F_m`.  The Moore--Penrose notation in
Section 0 also covers redundant coordinate syntheses without treating an
ambient coordinate kernel as a defect floor.  Monotonicity gives

\[
 0\prec\Delta_m\preceq d_mI_{F_m}.                       \tag{2.4}
\]

For each sign separately, the zero-integral same-phase identity controls
the origin value by `D_m`.  Apply the fixed invisible correction

\[
 \widetilde f_\sigma(x)
 =f_\sigma(x)-f_\sigma(0)\psi(2\lambda x).              \tag{2.5}
\]

It has zero value and zero integral, is supported in the radical source
class, and does not change the compact arithmetic state.  Define

\[
 \mathcal K_m(f_+,f_-)
 =C_\lambda\left\{
 S_+\mathcal E(\widetilde f_+)
 +S_-\mathcal E(\widetilde f_-)\right\},
 \qquad S_\sigma={I+\sigma J\over2}.                    \tag{2.6}
\]

The two terms in (2.6) are orthogonal.  Each global term before
`C_lambda` is a two-sided Weil radical.  Replacing `S_+` by `S_-` changes
only unit signs between reflected tails, so every absolute triangle and
square-sum estimate in the growing sampling theorem remains valid.

The periodic arithmetic states in (2.6) are of bounded variation.  Their
Fourier coefficients are `O(1/|k|)`, and the diagonal-plus-Cauchy graph
argument puts every vector in `mathcal K_m(F_m)` in the operator domain of
`Q_lambda`.  Hence

\[
 \mathcal R_m:=Q_\lambda\mathcal K_m:F_m\longrightarrow H_\lambda
                                                               \tag{2.7}
\]

is a legal finite-rank operator, and (0.4) is finite at every fixed stage.
No asymptotic bound for (0.4) is asserted by this observation.

## 3. What the frozen residual estimates give

This section separates a proved finite-section estimate from the new
cutoff-free family rate that would be needed in (0.9).

Use the locked exponential projection

\[
 N=2^{2400p^2}=2^{9600\lambda^2}.                       \tag{3.1}
\]

For each parity let `q_sigma` be the number of raw modal rows in (2.2), and
let `C_(q_sigma)` be the exact constant in equation (4.1) of the growing
transition sampling theorem.  With

\[
 C_{\rm rad}=C_{q_+}+C_{q_-},                            \tag{3.2}
\]

the triangle inequality followed by scalar Cauchy--Schwarz gives for the
complete radical remainder `Y_f`

\[
 \|ZY_f\|^2\leq C_{\rm rad}D_m(f).                      \tag{3.3}
\]

All cross terms stay inside the norm on the left.  Since the two physical
parities are orthogonal, one may alternatively apply (3.3) blockwise.

Let `p_f=P_N\mathcal K_mf` and let `Q_(lambda,N)` be the compressed complete
Weil operator.  Exact two-sided radicality gives

\[
 Q_{\lambda,N}p_f=-\ell_{Y_f}.                          \tag{3.4}
\]

The compact absolute sampling theorem gives

\[
 \|Zv\|^2\leq B_{\rm abs}(\lambda,N)\|v\|^2
 \qquad(v\in E_N).                                      \tag{3.5}
\]

Equations (3.3)--(3.5) therefore prove the finite-section residual bound

\[
 \boxed{
 \|Q_{\lambda,N}p_f\|
 \leq\mathcal C^{\rm fin}_{\lambda,m}D_m(f)^{1/2},
 \qquad
 \mathcal C^{\rm fin}_{\lambda,m}
 =\sqrt{B_{\rm abs}(\lambda,N)C_{\rm rad}}.}           \tag{3.6}
\]

For the ranges in (2.2), `q_++q_-=O(lambda^2)`.  The frozen formulas give

\[
 \mathcal C^{\rm fin}_{\lambda,m}
 =\operatorname {poly}(\lambda,L).                     \tag{3.7}
\]

Equation (3.7) is a theorem for the projected finite section.  It is not
silently promoted to the cutoff-free constant (0.4).  Such a promotion
requires the uniform graph-tail estimate

\[
 \boxed{
 \sup_{0\ne f\in F_m}
 {\|Q_\lambda\mathcal K_mf
       -Q_{\lambda,N}P_N\mathcal K_mf\|
  \over D_m(f)^{1/2}}
 =o(1).}                                                \tag{3.8}
\]

The frozen ingredients make (3.8) a sharply isolated task.  The transition
variation bound gives a raw source-norm numerator of size

\[
 {\operatorname {poly}(\lambda,L)\log(N+2)\over\sqrt N}
 \|f\|.                                                 \tag{3.9}
\]

The all-index Logvinenko--Sereda floor converts
`||f||<=d_(LS)^(-1/2)D_m(f)^(1/2)`, and the locked exponent margin is

\[
 M_{2400}=4800\log2
 -{160\pi\log96\over\log2}>0.                           \tag{3.10}
\]

Thus the direct BV/Cauchy argument strongly suggests, and reduces (3.8) to,
checking one uniform family version of the graph-tail constants.  That
family statement has not been frozen in the dependencies and is not claimed
as a theorem here.  Accordingly all cutoff-free criteria below retain the
exact constant `mathcal C_(F_m)`.  Proving (3.8) would give
`mathcal C_(F_m)<=mathcal C^(fin)_(lambda,m)+o(1)` and hence a polynomial
residual constant.

## 4. Minimum-defect right inverse

Fix `lambda,m` and abbreviate

\[
 X=X_\lambda,\qquad T=T_{F_m}=P_\lambda\mathcal K_m,
 \qquad\Delta=\Delta_m.                                \tag{4.1}
\]

On the support of `Delta`, put

\[
 G=T\Delta^\dagger T^*.                                \tag{4.2}
\]

Assume `G>0` on `X`, equivalently `Lambda_(F_m)>0`, and define

\[
 B_\Delta=\Delta^\dagger T^*G^{-1}:X\longrightarrow F_m.
                                                               \tag{4.3}
\]

The dimensions in (4.3) are

\[
 X\xrightarrow{G^{-1}}X
 \xrightarrow{T^*}F_m
 \xrightarrow{\Delta^\dagger}F_m.                     \tag{4.4}
\]

Direct multiplication, with no choice of source coordinates, gives

\[
 TB_\Delta=I_X,                                        \tag{4.5}
\]

and

\[
 \boxed{
 (\Delta^{1/2}B_\Delta)^*
       (\Delta^{1/2}B_\Delta)=G^{-1}.}                 \tag{4.6}
\]

Thus `B_Delta` is the minimum-`Delta` right inverse and

\[
 \|\Delta^{1/2}B_\Delta\|={1\over\sqrt{\Lambda_{F_m}}}.
                                                               \tag{4.7}
\]

Indeed, if `B` is any other right inverse and `N=B-B_Delta`, then `TN=0`
and the `Delta`-orthogonal cross term vanishes:

\[
 B^*\Delta B=G^{-1}+N^*\Delta N\succeq G^{-1}.          \tag{4.8}
\]

Let

\[
 K=\mathcal K_mB_\Delta:X\longrightarrow H_\lambda,
 \qquad E=Q_\lambda K.                                 \tag{4.9}
\]

Equations (4.5) and (0.2) give

\[
 P_\lambda K=I_X,
 \qquad P_\lambda KK^*P_\lambda=I_X.                  \tag{4.10}
\]

This is the operator-synthesis advantage.  A columnwise Hilbert--Schmidt
estimate would sum one residual for every source column.  Equation (4.9)
instead gives a unit frame on the complete bottom space, while (0.4) and
(4.7) give

\[
 \|E\|\leq{\mathcal C_{F_m}\over\sqrt{\Lambda_{F_m}}}.
                                                               \tag{4.11}
\]

Since `P_lambda Q_lambda=mu_lambda P_lambda`,

\[
 P_\lambda E
 =P_\lambda Q_\lambda K
 =\mu_\lambda P_\lambda K
 =\mu_\lambda I_X.                                    \tag{4.12}
\]

Taking operator norms proves (0.5).  The proof is safe at a multiple bottom
and needs no parity order, spectral gap, normalization of individual
columns, or ground eigenbasis in the statement.

## 5. Exact hard-prefix principal angle

Let `mathcal H_(0,+)^ev` and `mathcal H_(0,-)^ev` be two copies of the full
even zero-integral source space.  On their direct sum define

\[
 T_\infty(f_+,f_-)
 =P_{X_+}S_+A_\lambda f_+
  +P_{X_-}S_-A_\lambda f_-,                            \tag{5.1}
\]

where `X_sigma=X_lambda` intersected with the physical inversion sector.
The full-source theorem applied to each orthogonal block gives

\[
 {1\over8\lambda^4}I_X
 \preceq R_\lambda:=T_\infty T_\infty^*
 \preceq{\lambda^2\over2}I_X.                         \tag{5.2}
\]

The correction (2.5) is invisible to `A_lambda` on the compact window, so

\[
 T_{F_m}=T_\infty P_{F_m}.                              \tag{5.3}
\]

Equation (5.3) identifies only the physical map restricted to the declared
finite phase-separated source `F_m`.  It neither asserts density of the
union of these spaces nor identifies their source closure with the full
two-copy domain.

Put `U=R^(-1/2)T_infinity`.  Then `UU*=I_X`, and

\[
 \begin{aligned}
 R^{-1/2}T_{F_m}T_{F_m}^*R^{-1/2}
 &=UP_{F_m}U^*\\
 &=I_X-U(I-P_{F_m})U^*.
 \end{aligned}                                         \tag{5.4}
\]

The last term is positive semidefinite and

\[
 \|U(I-P_{F_m})U^*\|
 =\|(I-P_{F_m})U^*\|^2.                               \tag{5.5}
\]

Equations (5.4)--(5.5) prove the exact identity (0.7).  In particular,
the full floor (5.2) does not imply that `gamma_m` is positive: that would
discard the principal angle in (5.5).

If `gamma_m>0`, equations (5.2)--(5.4) give

\[
 T_{F_m}T_{F_m}^*
 \succeq\gamma_mR
 \succeq{\gamma_m\over8\lambda^4}I_X.                 \tag{5.6}
\]

By (2.4), `Delta_m^dagger>=d_m^(-1)I` on its support, so

\[
 T_{F_m}\Delta_m^\dagger T_{F_m}^*
 \succeq {1\over d_m}T_{F_m}T_{F_m}^*.                \tag{5.7}
\]

Equations (5.6)--(5.7) prove (0.8), and (0.5) proves (0.9).

There is a sharper weighted possibility: `Lambda_(F_m)` may be large even
when the crude pair `(gamma_m,d_m)` is weak, because (0.3) retains each
individual reciprocal defect.  Thus (0.3), rather than (0.8), is the
minimal source statistic.

## 6. KRD stopping line

For the halfgrid, `S=p^2` is an integer.  The pinned leading-side KRD bound
is exactly (0.10).  Combining it with (0.9) shows that it is sufficient to
have

\[
 {S-m-7\over\beta_\lambda}
 -\log{1\over\gamma_m}
 -2\log\mathcal C_{F_m}-4\log\lambda
 \longrightarrow+\infty.                              \tag{6.1}
\]

The harmless fixed factor `80` is absorbed in the diverging margin.  If

\[
 \mathcal C_{F_m}\leq\lambda^A L^B,
 \qquad\gamma_m\geq\lambda^{-D}L^{-E}                 \tag{6.2}
\]

for fixed constants, then choosing

\[
 m=S-K(\log\lambda)^2                                  \tag{6.3}
\]

with a sufficiently large fixed `K` makes (6.1) hold.  The integer cutoff
is rounded downward and kept at most `S-1`.  This quantifies the target:
one needs a well-conditioned radical coframe before, not after, the
Shannon transition.

More generally (6.1) permits subpolynomial or subexponential losses so long
as the KRD margin dominates their logarithms.  It supplies no such capture
estimate for the actual bottom.

## 7. Explicit right-inverse approximation criterion

Let `B:X->mathcal H_0` be any full-source right inverse,

\[
 T_\infty B=I_X,\qquad
 \|B\|\leq\sqrt2\lambda M_\mu(\lambda)
 \leq2\sqrt2\lambda^2.                                \tag{7.1}
\]

For a declared finite source range `F`, define the approximation number

\[
 \eta_F(B)=\|(I-P_F)B\|,
 \qquad\delta_F=\|T_\infty\|\eta_F(B).                 \tag{7.2}
\]

If `delta_F<1`, then

\[
 A_F=T_\infty P_FB,
 \qquad\|I_X-A_F\|\leq\delta_F                         \tag{7.3}
\]

is invertible, and

\[
 B_F=P_FBA_F^{-1}                                      \tag{7.4}
\]

is an `F`-valued right inverse.  Therefore

\[
 T_\infty P_FT_\infty^*\succeq
 {(1-\delta_F)^2\over\|B\|^2}I_X.                     \tag{7.5}
\]

If `Delta_F<=d_FI`, then

\[
 \boxed{
 \Lambda_F\geq{(1-\delta_F)^2\over\|B\|^2d_F}.}       \tag{7.6}
\]

Thus the explicit sufficient pair is

\[
 \delta_F\leq1-\vartheta,
 \qquad
 {\mathcal C_F\|B\|\sqrt{d_F}\over\vartheta}
 \longrightarrow0                                    \tag{7.7}
\]

for some positive `vartheta`, or, using (7.1),

\[
 {2\sqrt2\mathcal C_F\lambda^2\sqrt{d_F}
  \over\vartheta}\longrightarrow0.                   \tag{7.8}
\]

The approximation number in (7.2) is sufficient but right-inverse-gauge
dependent.  The principal angle (0.7) and the weighted singular value
(0.3) are intrinsic.

For the explicit Mobius lift, the visible positive source interval is

\[
 (R_\lambda g)(x)=
 \sum_{n\leq\lambda/x}\mu(n){g(nx)\over\sqrt{nx}}.     \tag{7.9}
\]

At `x=lambda/n` its jump is exactly

\[
 R_\lambda g((\lambda/n)^-)
 -R_\lambda g((\lambda/n)^+)
 =\mu(n){g(\lambda)\over\sqrt\lambda}.                \tag{7.10}
\]

Hence this lift is not a smooth low-prolate source.  The effective-prefix
theorem gives a total trace schedule and a coarse `BV` majorant for the
ordinary mixed all-even prefix, but it gives no useful comparison with `S`
and does not replace that prefix by the phase-separated space (2.2).  Its
coarse majorant can lie far beyond `S`.  No frozen estimate proves
`delta_(F_m)<1` at a leading cutoff satisfying (6.1).

## 8. Exact orientation countermodel

The logical obstruction already occurs in four source dimensions.  Let

\[
 X=\mathbb R^2,\qquad H=\mathbb R^4,\qquad
 F=\operatorname {span}\{e_1,e_2\},                    \tag{8.1}
\]

and fix any increasing positive defect diagonal

\[
 \Delta=\operatorname {diag}(d_1,d_2,d_3,d_4).         \tag{8.2}
\]

For an integer `r>=2`, put

\[
 a_r={2r\over r^2+1},\qquad
 b_r={r^2-1\over r^2+1},\qquad a_r^2+b_r^2=1,          \tag{8.3}
\]

and, for a fixed positive rational `alpha`, define

\[
 T_r=\alpha
 \begin{pmatrix}
 a_r&0&b_r&0\\
 0&a_r&0&b_r
 \end{pmatrix}.                                       \tag{8.4}
\]

Every entry is rational and

\[
 T_rT_r^*=\alpha^2I_2                                  \tag{8.5}
\]

for every `r`.  Thus the full row floor, upper norm, target dimension, and
defect spectrum are all fixed.  Both leading source columns are nonzero.
Nevertheless

\[
 \gamma_F=a_r^2\longrightarrow0,                       \tag{8.6}
\]

and

\[
 \lambda_{\min}\left(
 T_rP_F(\Delta|_F)^{-1}P_FT_r^*\right)
 ={\alpha^2a_r^2\over d_2}\longrightarrow0.           \tag{8.7}
\]

Taking instead `a=1,b=0` gives perfect leading capture with the same full
floor.  Hence neither the full coframe floor, qualitative nonorthogonality,
the number of leading columns, nor the prolate defect list controls the
weighted statistic.  The model is not the arithmetic map and proves no
actual-source failure.  It proves only that a new normalized
source-to-bottom orientation estimate is indispensable.

## 9. Stopping line

The full-source radical route has one exact optimal statistic and one
analytic companion:

\[
 \boxed{
 {\Lambda_{F_m}\over\mathcal C_{F_m}^2}
 \longrightarrow\infty.}                              \tag{9.1}
\]

The weighted statistic `Lambda` simultaneously measures how much of every
bottom direction is generated and how cheaply it is generated in exterior
defect.  The residual constant measures how efficiently that positive
defect controls the complete signed cutoff-free action.  Equation (9.1)
implies RH through (0.5), but neither factor has the required actual
asymptotic theorem.

The cruder but more concrete route is (0.9), with the exact KRD stopping
line (6.1).  Proving a polynomial `gamma_m` at
`m=S-O((log lambda)^2)` together with the uniform cutoff-free graph transfer
(3.8) would close it.  The full-source floor alone proves neither statement.
