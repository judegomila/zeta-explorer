# Lower-Ritz actual label-16 residual-capture and action barrier

## 0. Exact outcome and claim boundary

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 L=2\log\lambda,\qquad N=2^{9600\lambda^2}.          \tag{0.1}
\]

Write the complete inversion-even block and its lower two-vector Ritz
shift as

\[
 Q_+=\begin{pmatrix}q&b^*\\b&A\end{pmatrix},\qquad
 r=\|b\|>0,\qquad w={b\over r},                       \tag{0.2}
\]

\[
 u=\lambda_{\min}\left(Q_+|_{\operatorname {span}\{\kappa,w\}}
                 \right),\qquad
 t=q-u>0,\qquad B=A-uI.                               \tag{0.3}
\]

The two-vector Ritz equation itself gives
`<w,Bw>=r^2/t>0`.  This scalar positivity needs no sign on `B` away from
`w`.  The operator inequality `B>0` is the unproved strict even
lower-Ritz branch.  Every inverse or Loewner statement below is explicitly
conditional on that branch; the forward-action identities are not.

The proposed ordinary residual capture

\[
 r=O(d_8L)                                             \tag{0.4}
\]

is false for the pinned arithmetic matrices.  Let `W_16` be the actual
anchor-deflated label-16 physical column and put

\[
 \omega_{16}={W_{16}\over\|W_{16}\|}.                \tag{0.5}
\]

Then the fixed complete Toeplitz theorem gives the actual coordinate

\[
 \boxed{
 {\langle\omega_{16},b\rangle
    \over\sqrt{d_4d_{16}}L}
 \longrightarrow C_{16}:={\Gamma_3
    \over A_4\|W_{16,\infty}\|}>0.}                  \tag{0.6}
\]

Here

\[
 \Gamma_3={1\over24\pi}\sum_{n\geq1}
 {\sin(12\arcsin(1/n))\over n}>0.                    \tag{0.7}
\]

The defect hierarchy gives

\[
 {\sqrt{d_4d_{16}}\over d_8}
 \sim (16\pi)^2{8!\over\sqrt{4!16!}}\lambda^4.       \tag{0.8}
\]

Consequently

\[
 \boxed{{r\over d_8L}\longrightarrow\infty.}        \tag{0.9}
\]

The exact label-12 coordinate remains valid, but it occupies a vanishing
fraction of the complete residual direction:

\[
 \boxed{|\langle\omega_{12},w\rangle|=O(\lambda^{-4}).}
                                                               \tag{0.10}
\]

Thus neither label-12 coordinate capture nor capture by any fixed low
modal list can prove the desired Ritz lowering.  A label-12 shorted floor
may still be true, but without capture its scalar Schur inequality does
not control the full residual direction.

The correct scale-invariant replacement is an action statement.  The
two-vector Ritz identity gives

\[
 \boxed{
 t={r^4\over\langle b,Bb\rangle}.}                   \tag{0.11}
\]

Hence `t=O(d_4L)` is equivalent to the single forward-action lower bound

\[
 \boxed{
 \langle b,Bb\rangle\geq c\,{\|b\|^4\over d_4L}}   \tag{0.12}
\]

for some schedule-uniform `c>0`.  Equation (0.12), not (0.4), is the
smallest exact one-vector action lemma for the direct lower-Ritz scalar.

Conditional on the unproved strict even lower-Ritz branch `B>0`, there is
a stronger full-metric sufficient package.  If a positive metric `Delta`
on an actual residual-containing reducing range satisfies

\[
 B\succeq cL\Delta,
 \qquad
 \langle b,\Delta^{-1}b\rangle\leq C d_4L^2,          \tag{0.13}
\]

then

\[
 \boxed{
 t\leq\langle b,B^{-1}b\rangle
 \leq {C\over c}d_4L.}                               \tag{0.14}
\]

The fixed Toeplitz row has the correct scalar-coframe scale, and its limiting
coefficients are square summable.  Passing from that scalar coframe to an
exact full-exterior dual row additionally needs a uniform full-metric
equivalence gate.  Neither that gate nor the growing complete row and signed
floor after the retained nonmodal complement is eliminated is frozen.  The
prefix-to-far theorem controls erosion of a captured-prefix floor by its far
cross.  It does not control the separate anchor-to-far residual row or the
retained block.

An exact source-Cauchy family below matches the anchor, label-12 row and
diagonal, and label-16 row scales while a soft retained direction makes
`t/(d_4L)` diverge despite both strict lower-Ritz signs.  Thus source-Cauchy
displacement and the current visible modal data do not imply (0.12).

This note proves an obstruction and a sharp reduction.  It does not prove
or disprove `t=O(d_4L)` for the actual arithmetic matrices, a label-12
shorted floor, the full-metric hypotheses (0.13), either strict sign on the
actual unbounded schedule, equation (5.2) of `DIRECT_RH_ATTACK.md`, a
determinant limit, a zero statement, or RH.  The formal state remains
`P0_INVALIDATED`, and the standard eight are unchanged.

## 1. Frozen inputs

Only the following repository bytes are used.

| Dependency | SHA-256 |
|---|---|
| `notes/LOWER_RITZ_ACTUAL_SCHEDULE_LABEL12_MELLIN_ROW_BARRIER.md` | `9737ce38ba458c98200a35c97a2f9bd8fe942e2e4e77a56d2ab9d7c072dfc021` |
| `tests/test_lower_ritz_actual_schedule_label12_mellin_row_barrier.py` | `76f8c67bcd40767bc7c34f51d50dbdd06d0d5caed27434ecfbd57b483d526595` |
| `notes/FIXED_PREFIX_COMPLETE_SIGNED_TOEPLITZ_SCHUR_THEOREM.md` | `c69d6d1a69f71548aa9291c5d261117ac913f2851df8f8fcc2f186c8bd530314` |
| `tests/test_fixed_prefix_complete_signed_toeplitz_schur_theorem.py` | `4f704f58524b9f4818db8bd1884009be9f4074fd303e2ec1cca5be5c74f70f87` |
| `notes/FIXED_TO_GROWING_TOEPLITZ_OPERATOR_NORM_GATE.md` | `57f4a8014e280e4594221b4466212b0104d2d7c25e9e6ff81808a4eb7f14ce25` |
| `tests/test_fixed_to_growing_toeplitz_operator_norm_gate.py` | `4b2d982c5de1b28fe3bac56e412f43a6a333bf47e643cf6bd435e589271bbf31` |
| `notes/GROWING_LOW_PREFIX_HALF_POWER_FAR_CROSS_THEOREM.md` | `c0428b5c0ab43719b8e82b24ff21f7c40ebfde978ddb8d4185f92abb633ab55f` |
| `tests/test_growing_low_prefix_half_power_far_cross_theorem.py` | `be358852f5f5749e25aca722a18cfb081b8c36bab7aeed74343b624d49ef0569` |
| `notes/LOWER_RITZ_RESIDUAL_INVERSE_SPREAD_DETERMINANT_SPLIT_THEOREM.md` | `0e905dbb849d1a7cbf9a8906831d9c192c75bd953c10bf13329ea94dcee788a3` |
| `tests/test_lower_ritz_residual_inverse_spread_determinant_split_theorem.py` | `8cc310388b33f6ee075060f56c3b084867c68f66cae8aee64567ab9cab11e36b` |

The first pair fixes the label-12 coordinate, lower-Ritz notation, and
retained-direction countermodels.  The second pair supplies the complete
fixed-pair Toeplitz cross, including label 16.  The third identifies the
moving operator-norm gate.  The fourth closes only prefix-to-far erosion,
and the last supplies the exact Ritz and inverse-spread identities.

## 2. The actual label-16 coordinate

Let `p_4=a_lambda*kappa` be the actual unscaled compact anchor.  The
anchor-deflated column is orthogonal to it:

\[
 \langle W_{16},\kappa\rangle=0,
 \qquad a_\lambda\longrightarrow A_4>0,              \tag{2.1}
\]

and

\[
 W_{16}\longrightarrow W_{16,\infty},
 \qquad\|W_{16,\infty}\|>0.                          \tag{2.2}
\]

Polarized two-sided radicality gives

\[
 \boxed{
 \langle\omega_{16},b\rangle
 ={\mathcal W_Z(R_{16},R_4)
    \over a_\lambda\|W_{16}\|}.}                    \tag{2.3}
\]

For the fixed inventory through label 16, the complete signed Toeplitz
theorem states

\[
 {\mathcal W_Z(R_{16},R_4)
  \over\sqrt{D_4D_{16}}L}\longrightarrow\Gamma_3.   \tag{2.4}
\]

Every pole, Archimedean, inclusive minus-prime, reflected, and compact
projection contribution is already assembled in (2.4).  Since
`D_j/d_j -> 1`, equations (2.1)--(2.4) prove (0.6) once `Gamma_3>0` is
established.

### Lemma 2.1 (strict positivity of `Gamma_3`)

Put

\[
 a_n={\sin(12\arcsin(1/n))\over n}.                   \tag{2.5}
\]

For `x=1/n`, elementary multiple-angle algebra gives

\[
 a_n=4x^2\sqrt{1-x^2}(3-4x^2)(1-4x^2)
       (1-18x^2+48x^4-32x^6).                        \tag{2.6}
\]

The terms `a_1` and `a_2` vanish.  For `n>=4`, every factor in (2.6) is
positive.  Indeed, with `y=x^2<=1/16`,

\[
 1-18y+48y^2-32y^3\geq {7\over128}>0,                \tag{2.7}
\]

because the polynomial decreases on `[0,1/16]`.  The only negative term
is `a_3`.  Direct substitution gives

\[
\begin{aligned}
 a_3&=-{151340\over531441}{\sqrt8\over3},\\
 a_5&={33058452\over244140625}{\sqrt{24}\over5},\\
 a_6&={81328\over531441}{\sqrt{35}\over6}.
\end{aligned}                                        \tag{2.8}
\]

The rational square-root comparisons

\[
 {\sqrt8\over3}<{943\over1000},\qquad
 {\sqrt{24}\over5}>{979\over1000},\qquad
 {\sqrt{35}\over6}>{197\over200}                   \tag{2.9}
\]

imply

\[
 a_3>-{269\over1000},\qquad
 a_5>{132\over1000},\qquad
 a_6>{150\over1000}.                                \tag{2.10}
\]

All omitted terms are nonnegative, so

\[
 \Gamma_3>{13\over24000\pi}>0.                      \tag{2.11}
\]

This proves the lemma and (0.6).

The fixed defect formula

\[
 d_j\sim4\sqrt2\,\pi{(16\pi)^j\over j!}
             \lambda^{2j+1}e^{-4\pi\lambda^2}       \tag{2.12}
\]

gives (0.8).  Since `r>=|<omega_16,b>|`, equations (0.6) and (0.8) prove
(0.9).

The label-12 theorem gives

\[
 |\langle\omega_{12},b\rangle|=O(d_8L).             \tag{2.13}
\]

Dividing (2.13) by the label-16 lower bound proves (0.10).  Thus the
label-12 line becomes asymptotically orthogonal to the normalized complete
residual, even though its unnormalized coordinate is nonzero and has a
strict positive limit.

## 3. Why a fixed coordinate short cannot replace capture

On the conditional strict even lower-Ritz branch, `B>0`; the short of `B`
to the line `C*omega_12` is

\[
 \sigma_{12}(u)
 ={1\over\langle\omega_{12},B^{-1}\omega_{12}\rangle}.
                                                               \tag{3.1}
\]

It gives the exact lower estimate

\[
 \langle w,Bw\rangle
 \geq\sigma_{12}(u)|\langle\omega_{12},w\rangle|^2. \tag{3.2}
\]

A floor `sigma_12(u)>=c*d_12*L` controls the Ritz identity only if the
last overlap is also bounded below.  Equation (0.10) proves the opposite
for the actual normalized residual.  This does not refute the shorted
floor; it refutes its use together with label-12 capture.

The obstruction is not special to label 16.  The coefficients `Gamma_r`
are square summable but not finitely supported.  Indeed

\[
 w(\beta)\leq C\{1+\log_+(1/\beta)\},                \tag{3.3}
\]

so `w` is in `L2(0,pi/2)`.  Its part symmetric under
`beta -> pi/2-beta`, which is the part observed by `cos(4r beta)`, has
logarithmic endpoint growth and cannot be a trigonometric polynomial.
Hence infinitely many `Gamma_r` are nonzero.  The increasing defect
hierarchy then prevents any fixed modal coordinate list from furnishing
an ordinary-norm capture of the complete residual.  Indeed, orthogonalize
a later fixed column against the proposed finite capture.  Fixed-prefix
raw-Gram convergence keeps its orthogonalized norm bounded below, while
its nonzero later cross has a strictly higher defect power than every
subtracted captured cross.

This phenomenon is compatible with a small Ritz lowering.  Higher-label
coordinates also come with much larger diagonal action scales.  Discarding
that covariance by estimating `||b||` alone is exactly the wrong geometry.

## 4. The minimal forward action and a full-metric sufficient package

The lower two-vector characteristic equation is

\[
 t\langle w,Bw\rangle=r^2.                            \tag{4.1}
\]

Since `b=rw`,

\[
 \langle b,Bb\rangle=r^2\langle w,Bw\rangle
 ={r^4\over t},                                      \tag{4.2}
\]

which proves (0.11)--(0.12).  This formulation permits `r` to grow with
the defect hierarchy as long as the same direction has the corresponding
large `B`-action.

For a structured sufficient condition, now work conditionally on the
unproved strict even lower-Ritz branch `B>0`.  Let `Delta>0` on a
`B`-reducing range containing `b`.  If (0.13) holds, Loewner inversion gives

\[
 B^{-1}\preceq{1\over cL}\Delta^{-1}.               \tag{4.3}
\]

The exact inverse-spread identity gives

\[
 \langle b,B^{-1}b\rangle=t+\chi_u\geq t.            \tag{4.4}
\]

Equations (4.3)--(4.4) prove (0.14).  This package is stronger than the
minimal forward action because it also controls inverse spread.

The fixed Toeplitz theorem predicts the exact scale of a scalar-defect
coframe row.  For a fixed prefix through label `4M`, let `mathcal S_M` be
the actual physical synthesis with columns `W_8,...,W_(4M)` and put

\[
 \begin{aligned}
 h_M&=\mathcal S_M^*b
   =(\langle W_8,b\rangle,\ldots,
                      \langle W_{4M},b\rangle)^T,\\
 \Delta_{R,M}&=\operatorname {diag}(D_8,\ldots,D_{4M}),
 \qquad g_M=\Delta_{R,M}^{-1/2}h_M.
 \end{aligned}                                      \tag{4.5}
\]

Then

\[
 \|g_M\|^2
 =\sum_{j=2}^M{|\langle W_{4j},b\rangle|^2\over D_{4j}},
                                                               \tag{4.6}
\]

and the fixed complete cross asymptotics give

\[
 \boxed{
 {\|g_M\|^2\over d_4L^2}
 \longrightarrow {1\over A_4^2}
       \sum_{r=1}^{M-1}\Gamma_r^2.}                 \tag{4.7}
\]

Bessel's inequality and (3.3) give

\[
 \sum_{r\geq1}\Gamma_r^2
 \leq{\pi\over4}\int_0^{\pi/2}|w(\beta)|^2d\beta<\infty.
                                                               \tag{4.8}
\]

Thus the limiting Toeplitz row has a dimension-free scalar-coframe norm
even though its ordinary physical norm has the label-16 growth in (0.9).
This scalar diagonal normalization is not being identified with the exact
full exterior metric.

To expose the distinction exactly, let `mathfrak D_(R,M)` be the full
exterior Gram of the same actual nonanchor source inventory, pulled back
through its exact endpoint shear, and set

\[
 E_M=\Delta_{R,M}^{-1/2}\mathfrak D_{R,M}
                  \Delta_{R,M}^{-1/2}.               \tag{4.9}
\]

The exact full-exterior-white dual row cost on that inventory is

\[
 \boxed{
 \mathcal R_M(b)
 :=h_M^*\mathfrak D_{R,M}^{-1}h_M
 =g_M^*E_M^{-1}g_M.}                                \tag{4.10}
\]

For every fixed `M`, the full-Gram statement in the fixed Toeplitz theorem
gives `E_M=I+o_M(1)`.  It gives no moving-prefix bound.  A rigorous growing
passage therefore splits into the independent gates

\[
 \boxed{
 \sup_{M\leq C_0L}\|g_M\|^2=O(d_4L^2),
 \qquad cI\preceq E_M\preceq CI
 \quad(M\leq C_0L).}                                \tag{4.11}
\]

The first is the scalar-coframe row; the second is the uniform full-metric
equivalence gate.  Together they imply
`sup_(M<=C_0L) mathcal R_M(b)=O(d_4L^2)`.  Fixed-pair convergence has the
wrong quantifier order for both parts of (4.11).  Even their conjunction
does not contain `b_R=P_(R_M)b`, the component of `b` in the retained
nonmodal complement.  Nor does it control the separate anchor-to-far row
`b_F=P_Fb`.  Completing (0.13) requires either an extension of the exact
dual row to an actual residual-containing metric or separate retained- and
anchor-to-far action bounds.

The signed half of (0.13) is likewise a growing full-metric floor after
all retained directions are shorted.  The fixed Toeplitz symbol has a
quarter-floor, and the moving Toeplitz gate reduces its modal complement
to a one-sided `o(L)` negative-operator estimate.  The half-power far-cross
theorem controls the captured-prefix-to-far cross needed to protect such a
floor.  If `F` is its half-power far subspace, the theorem does not control
the anchor residual `b_F=P_Fb`.  It also does not control the retained row
`b_R=P_(R_M)b`, where
`R_M=Y\ominus\operatorname {ran}\mathcal S_M`.  Hence it proves neither
inverse-row estimates for `b_F` or `b_R`, the two gates (4.11), nor the
complete signed floor in (0.13).

Still conditional on `B>0`, one may bypass the split package by proving the
single determinant-compatible inverse row

\[
 \langle b,B^{-1}b\rangle=O(d_4L).                   \tag{4.12}
\]

Equation (4.12) implies the direct target, but it is stronger than the
minimal action (0.12).

## 5. A scale-matched retained source-Cauchy counterfamily

The retained-direction obstruction persists inside exact source-Cauchy
algebra.  Let `0<delta<1`, `s>0`, put

\[
 \rho=\sqrt\delta,\qquad q=s\delta^2,                \tag{5.1}
\]

and fix constants `c>0`, `K>0`.  On centered nodes `-2,-1,0,1,2`, set

\[
 \beta_{-n}=-\beta_n,\qquad a_{-n}=a_n,              \tag{5.2}
\]

\[
\begin{aligned}
 \beta_0&=0,&
 \beta_1&=-{cs\delta\over\sqrt2},&
 \beta_2&=-\sqrt2s\rho,\\
 a_0&=q,&
 a_1&=s+{cs\delta\over\sqrt2},&
 a_2&=Ks\rho+{s\rho\over\sqrt2}.
\end{aligned}                                        \tag{5.3}
\]

Define the exact source-Cauchy matrix by

\[
 Q_{nn}=a_n,\qquad
 Q_{nm}={\beta_n-\beta_m\over n-m}\quad(n\ne m).    \tag{5.4}
\]

In the normalized even parity basis its block is exactly

\[
 Q_+=
 s\begin{pmatrix}
 \delta^2&-c\delta&-\rho\\
 -c\delta&1&{\sqrt2\over3}(-4\rho+c\delta)\\
 -\rho&{\sqrt2\over3}(-4\rho+c\delta)&K\rho
 \end{pmatrix}.                                      \tag{5.5}
\]

The visible first coordinate has

\[
 q=s\delta^2,qquad |b_1|=cs\delta,qquad A_{11}=s. \tag{5.6}
\]

With `s=d_12*L` and `delta=sqrt(d_4/d_12)`, these are exactly the
`d_4L`, `d_8L`, and `d_12L` scales up to fixed constants.  The hidden
coupling `s*rho=s*sqrt(delta)` has the actual label-16 row scale
`sqrt(d_4*d_16)*L`, again up to a fixed constant, but its retained
diagonal is soft rather than the modal `d_16L` diagonal.

The even complement in (5.5) is positive for all sufficiently small
`delta`, because its determinant divided by `s^2` is

\[
 K\rho-{2\over9}(4\rho-c\delta)^2>0.                 \tag{5.7}
\]

The odd block is

\[
 Q_-=s\begin{pmatrix}
 1+\sqrt2c\delta&{2\sqrt2\over3}(-\rho+c\delta)\\
 {2\sqrt2\over3}(-\rho+c\delta)&(K+\sqrt2)\rho
 \end{pmatrix},                                      \tag{5.8}
\]

which is also positive for all sufficiently small `delta`.

Let `u_delta` be the lower Ritz value on the anchor and normalized residual
direction.  Since

\[
 {r\over s\rho}\longrightarrow1,qquad
 {\langle w,Aw\rangle\over s\rho}\longrightarrow K,
                                                               \tag{5.9}
\]

the exact two-by-two formula gives

\[
 {u_\delta\over s\rho}
 \longrightarrow {K-\sqrt{K^2+4}\over2}<0,           \tag{5.10}
\]

and therefore

\[
 \boxed{
 {q-u_\delta\over d_4L}
 \asymp{\rho\over\delta^2}=\delta^{-3/2}
 \longrightarrow\infty.}                            \tag{5.11}
\]

Because `u_delta<0`, both `A-u_delta*I` and `Q_--u_delta*I` are strictly
positive.  Thus the exact source-Cauchy displacement, the visible actual
scales, a label-16-sized hidden row, and both lower-Ritz signs still do not
imply (0.12).  The missing fact is precisely a signed action or full-metric
floor on the retained direction.

This family is not the pinned arithmetic matrix.  Its soft hidden diagonal
is a non-implication model for the retained complement, not a claim that
the actual label-16 modal diagonal is soft.

## 6. Strict stopping point

The actual label-16 cross ends the ordinary capture strategy.  The direct
lower-Ritz target has the exact replacement (0.12).  A structured proof may
instead establish the full-metric row and floor (0.13), or the stronger
combined inverse row (4.12).

The first new actual input is therefore not another fixed modal cross or
fixed scalar short.  It is a growing retained-direction action theorem:
either (0.12) directly, or the two scalar-row/full-metric gates (4.11)
assembled with the complete signed full-metric floor and a separate
anchor-to-far row bound.  Current Toeplitz, Jost, and far-cross theorems
identify the correct modal scales but stop before that retained action.

## 7. Reproduction

Run

    python3 -B -m unittest \
      tests.test_lower_ritz_actual_label16_residual_capture_action_barrier -v

The regression checks all ten listed dependency hashes, strict positivity of `Gamma_3`,
the label-16 defect ratio, exact action identities, fixed-row square
summability, the retained source-Cauchy parity blocks and signs, the
divergent Ritz scale, displayed TeX, ASCII hygiene, and the fail-closed
scope.
