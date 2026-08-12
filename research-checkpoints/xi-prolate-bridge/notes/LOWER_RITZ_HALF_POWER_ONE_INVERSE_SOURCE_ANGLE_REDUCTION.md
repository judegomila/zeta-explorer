# Lower-Ritz half-power one-inverse source-angle reduction

## 0. Exact result and fail-closed boundary

Use the genuine lower two-vector Ritz shift

\[
 u={q+c-\sqrt{(c-q)^2+4r^2}\over2}\leq q,              \tag{0.1}
\]

not the absolute-sampling shift `U_Z`.  Assume, without proving, the two
strict finite signs

\[
 B_u=A-uI\succ0,\qquad Q_--uI\succ0.                    \tag{0.2}
\]

At the exact half-power far split, this note proves the harmonic Schur
identities for every sampling or Mellin row.  They isolate one retained
signed hypothesis.  If

\[
 \boxed{\Sigma_u\succeq\theta_\lambda\Delta_Y>0}        \tag{0.3}
\]

for the one-power harmonic pullback `Delta_Y` defined below, then the two
source-graph constants of the cyclic Mellin reduction may be taken as

\[
 \boxed{
 C_R(\lambda)=O\!\left({\lambda^3P(\lambda)
                         \over\theta_\lambda}\right),
 \qquad
 C_E(\lambda)=O(\theta_\lambda^{-1}).}                 \tag{0.4}
\]

Here and throughout, `P` is one fixed enlarged positive polylogarithmic
factor.  The exact graph budget therefore closes on a compact set with
`eta=max |Im z|<1/2` if

\[
 \boxed{
 \theta_\lambda\gg
 \lambda^{-1+\eta}\operatorname {polylog}\lambda.}     \tag{0.5}
\]

For a real compact, take `eta=0`, with the extra factor `L=2 log(lambda)`
absorbed into the polylogarithm.  This is a conditional reduction, not a
proof of (0.3).

The source angle in this note uses the already declared block metric
`Delta`.  It does not switch to the full exterior metric.  A separate
source-specific full/block comparison would be a compatible future
upgrade, but it is not an input here.  Even after such a comparison is
frozen, an endpoint shear cannot by itself make the sampling constant
smaller: generalized sampling leverage is congruence invariant, and the
coherent endpoint carrier reappears in the sheared metric's singleton
Schur complement.

No collective `O(lambda*P)` positive-sampling theorem is proved.  If such
a theorem were proved by a new growing-uniform full-metric argument, then
the conditional threshold would improve to

\[
 \theta_\lambda\gg
 \lambda^{-2+\eta}\operatorname {polylog}\lambda.       \tag{0.6}
\]

The existing unsheared theorem remains `O(lambda^3*P)`.  Neither the
projective wedge, the source-Cauchy displacement, nor the rank-two
Woodbury identity supplies the missing whole-window estimate.  The
earliest direct substitute is a whole-window response-profile determinant
bound, or an estimate for the exact mixed inverse row itself.

The strict signs (0.2), the source-angle floor (0.3), either graph limit,
the collective improvement, equation (5.2) of `DIRECT_RH_ATTACK.md`, a
determinant limit, and RH all remain open.  The formal state is
`P0_INVALIDATED`.  The pole, Archimedean, and minus-prime pieces must remain
assembled in the complete signed operator before any inverse is formed.

## 1. Frozen inputs and conventions

The following repository bytes are binding inputs.

| Dependency | SHA-256 |
|---|---|
| `notes/CYCLIC_MELLIN_GRAPH_PRODUCT_TRANSITION_PACKET_NONCAPTURE_BARRIER.md` | `b7e29753bb6ff4f4082a114413bf7f80b460f4c8d0a0b5e48ee73e435e2fc488` |
| `tests/test_cyclic_mellin_graph_product_transition_packet_noncapture_barrier.py` | `26d5d820330cb7971e7bf5e47550d56a9bc3924091db93d8e83afa3025a0d769` |
| `notes/LOCKED_HALF_POWER_GRAPH_SCHUR_REDUCTION.md` | `1d900d615aaa21845f8413b9677286901bf41855d43c7df5c6fecea88f06a1b1` |
| `notes/FIXED_LABEL_EIGHT_ARITHMETIC_SYNTHESIS_GAIN.md` | `9e98b870419a721c8797e7577b6edf18649e50f6c9fe6f727dae61a53d6d7f71` |
| `notes/BLOCK_QUOTIENT_ACTION_THEOREM.md` | `31c4239b2dec0114be7b8e9b42e52ebc6361130461d1225e05c81ff5b26369d4` |
| `notes/GROWING_TRANSITION_SAMPLING_THEOREM.md` | `551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72` |
| `notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md` | `1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4` |
| `notes/FIXED_EVEN_ENDPOINT_NULL_VOLTERRA_PNT_CORRELATION_BARRIER.md` | `c2c0ab5c4747a38a9fa2743d4b62d01165c1fa0771d25b253b79f28ff921663b` |
| `notes/GROWING_TRANSITION_EQUALITY_CONDUCTOR_GARDING_THEOREM.md` | `f746d5e8e9efdcd585ace947789597954d9a8f7b57319f4398612bf3986b0079` |
| `notes/PROJECTIVE_WEDGE_RESOLVENT_REDUCTION.md` | `aae9399deac920452a4dc9a3f865503bf987ac2be7fc3c11c515ae2ad02b9b55` |
| `notes/CAUCHY_GROUND_RESPONSE_WINDOW_REDUCTION.md` | `0cbf4c438f1f06ab0d972fed3ba6d1464aef2aa9888e9dc3a6aeee548e66ee4c` |
| `notes/SECANT_SHORTED_RECIPROCAL_FESHBACH.md` | `40060cf7c6c46ed7a36e6febcb6edc2c9a58f296bd8ec324755553920b8dd03e` |
| `notes/GROWING_TRANSITION_FORCED_ORDERED_NONRESONANT_PRIME_FRAME_THEOREM.md` | `787e0f6c21272169e9c17f764bc1b1e9d9af1a386a4ba6891fddd0746f1c2e79` |

The locked schedule is

\[
 \lambda={p\over2},\quad p\geq5\text{ odd},\qquad
 L=2\log\lambda,\qquad
 N=2^{9600\lambda^2},\qquad R=\sqrt N.                \tag{1.1}
\]

The compact Mellin row size is

\[
 M_\Omega(L)=\sup_{z\in\Omega}
 \begin{cases}
 L,&\operatorname {Im}z=0,\\[1mm]
 {\sinh(L\operatorname {Im}z)\over\operatorname {Im}z},
 &\operatorname {Im}z\ne0.
 \end{cases}                                            \tag{1.2}
\]

Thus `M_Omega(L)=O_Omega(lambda^(2 eta))` off the real axis.  The ordinary
paired-zero sampling Gram is positive without assuming RH.  It must not be
confused with the signed Weil form.

## 2. Harmonic coordinates at the lower Ritz shift

Let the exact half-power decomposition be

\[
 \mathcal K=Y\oplus F,
 \qquad
 B_u=
 \begin{bmatrix}D&\Gamma^*\\ \Gamma&H\end{bmatrix},
 \qquad H\succeq G_RI_F>0.                              \tag{2.1}
\]

Put

\[
 \mathscr S=H^{-1}\Gamma,
 \qquad
 \Sigma_u=D-\Gamma^*H^{-1}\Gamma,                     \tag{2.2}
\]

and define the `B_u`-harmonic lift

\[
 E_u:Y\longrightarrow\mathcal K,
 \qquad E_uy=(y,-\mathscr Sy).                          \tag{2.3}
\]

For `v=(y,f)`, introduce the harmonic far coordinate

\[
 r=f+\mathscr Sy.                                      \tag{2.4}
\]

The exact Schur factorization is

\[
 B_u=
 \begin{bmatrix}I&\mathscr S^*\\0&I\end{bmatrix}
 \begin{bmatrix}\Sigma_u&0\\0&H\end{bmatrix}
 \begin{bmatrix}I&0\\\mathscr S&I\end{bmatrix}.      \tag{2.5}
\]

Consequently

\[
 \boxed{
 \langle v,B_uv\rangle
 =\langle y,\Sigma_uy\rangle+\langle r,Hr\rangle.}    \tag{2.6}
\]

Let `Z=[Z_Y,Z_F]` be any analysis map and put

\[
 Z_{\rm eff}=ZE_u=Z_Y-Z_F\mathscr S.                   \tag{2.7}
\]

Then the same coordinate change gives

\[
 \boxed{Zv=Z_{\rm eff}y+Z_Fr.}                         \tag{2.8}
\]

In particular, if `Sigma_u>0`, the sharp Loewner comparison is exactly

\[
 \boxed{
 Z^*Z\preceq C B_u
 \quad\Longleftrightarrow\quad
 \left\|[\,Z_{\rm eff}\Sigma_u^{-1/2},
             Z_FH^{-1/2}\,]\right\|^2\leq C.}          \tag{2.9}
\]

This is a one-inverse graph identity.  It is different from estimating
`Z B_u^(-1)`, which contains two inverse half-powers in its squared norm.

There is an equally exact row identity.  For a Riesz vector
`h=(h_Y,h_F)`,

\[
 E_u^*h=h_Y-\mathscr S^*h_F,                            \tag{2.10}
\]

and inversion of (2.5) gives

\[
 \boxed{
 h^*B_u^{-1}h
 =\|\Sigma_u^{-1/2}E_u^*h\|^2
  +\|H^{-1/2}h_F\|^2.}                                 \tag{2.11}
\]

Equations (2.9) and (2.11) preserve the direct/far cancellation.  Separate
norms of `Z_Y` and `Z_F \mathscr S`, or of `h_Y` and
`\mathscr S^*h_F`, are
strictly stronger and are not used.

## 3. The one-power source angle

Retain the admitted low physical quotient metric and extend it by the
identity:

\[
 \Delta=\Delta_L\oplus I_{K_H}>0.                       \tag{3.1}
\]

The fixed label-8 synthesis gain gives

\[
 \|\Delta_L^{-1}\|=O(d_8^{-1}),                        \tag{3.2}
\]

and the symmetric positive-sampling theorem, together with the compact
high estimate, gives

\[
 \boxed{
 Z^*Z\preceq C_{\rm pos}(\lambda)\Delta,
 \qquad C_{\rm pos}=O(\lambda^3P(\lambda)).}            \tag{3.3}
\]

All low/high sampling cross terms are retained because (3.3) is a single
row-operator inequality.

Define the one-power harmonic pullback

\[
 \boxed{\Delta_Y=E_u^*\Delta E_u>0.}                    \tag{3.4}
\]

This is not the earlier two-sided action metric
`(E_u^* Delta^2 E_u)^(1/2)`.  The one-power form in (3.4) is the exact
metric for the Loewner comparison (2.9).  Pulling (3.3) back by `E_u`
gives

\[
 Z_{\rm eff}^*Z_{\rm eff}
 \preceq C_{\rm pos}\Delta_Y.                          \tag{3.5}
\]

Assume the source angle (0.3), with `0<theta_lambda<=1`.  Then

\[
 \boxed{
 Z_{\rm eff}^*Z_{\rm eff}
 \preceq {C_{\rm pos}\over\theta_\lambda}\Sigma_u.}  \tag{3.6}
\]

The half-power theorem supplies

\[
 G_R=\Theta(\lambda^2),\qquad
 Z_F^*Z_F\preceq B_{\rm abs}I_F,\qquad
 B_{\rm abs}=O(\lambda^3P).                             \tag{3.7}
\]

Hence

\[
 Z_F^*Z_F\preceq {B_{\rm abs}\over G_R}H
 =O(\lambda P)H.                                       \tag{3.8}
\]

Using the row norm in (2.9), (3.6)--(3.8) prove

\[
 \boxed{
 C_R(\lambda)
 \leq {C_{\rm pos}\over\theta_\lambda}
       +{B_{\rm abs}\over G_R}
 =O\!\left({\lambda^3P\over\theta_\lambda}\right).} \tag{3.9}
\]

The far block is therefore harmless at the one-inverse level.

## 4. Mellin, wedge, and mixed-row leverage

For any compact family of uncentered Mellin rows `h_z`, the raw interval
Riesz estimate and (3.2) give

\[
 \boxed{
 h_zh_z^*\preceq
 C_\Omega{M_\Omega(L)\over d_8}\Delta.}                \tag{4.1}
\]

Indeed, the low contribution costs at most
`M_Omega*||Delta_L^(-1)||`, while the high contribution costs at most
`M_Omega`; the latter is absorbed because `0<d_8<1`.  The same estimate,
with a changed compact constant, holds for the projective wedge rows

\[
 h_{z,z_0}=\kappa(z_0)h_z-\kappa(z)h_{z_0},             \tag{4.2}
\]

because the frozen compact anchor transforms are bounded.

Pull (4.1) back by `E_u` and use (0.3):

\[
 \boxed{
 (E_u^*h_z)(E_u^*h_z)^*
 \preceq {C_\Omega\over\theta_\lambda}
 {M_\Omega(L)\over d_8}\Sigma_u.}                     \tag{4.3}
\]

Equation (2.11), together with `H>=G_R I`, now yields

\[
 h_z^*B_u^{-1}h_z
 \leq {C_\Omega\over\theta_\lambda}
       {M_\Omega(L)\over d_8}
       +{M_\Omega(L)\over G_R}.                        \tag{4.4}
\]

Thus the cyclic normalization may use

\[
 \boxed{
 C_E(\lambda)=O(\theta_\lambda^{-1}+d_8/G_R)
 =O(\theta_\lambda^{-1}).}                             \tag{4.5}
\]

This conclusion applies equally to the wedge row (4.2).

Let `mu<=u` be the actual even ground and put

\[
 C=A-\mu I=B_u+(u-\mu)I\succeq B_u.                    \tag{4.6}
\]

The strictly weaker determinant observable is the exact mixed row

\[
 \langle h_z,C^{-1}b\rangle.                            \tag{4.7}
\]

Positive-metric Cauchy--Schwarz and inverse monotonicity give

\[
 \boxed{
 |\langle h_z,C^{-1}b\rangle|^2
 \leq\langle b,B_u^{-1}b\rangle
       \langle h_z,B_u^{-1}h_z\rangle.}                \tag{4.8}
\]

Thus (3.9) and (4.5) are sufficient for the mixed row, but remain stronger
than estimating (4.7) directly.

## 5. Exact graph budget

The frozen radical and defect estimates give

\[
 {\epsilon_\lambda\over d_8}
 =O\!\left(\lambda^{-5}P(\lambda)\right)+o(\lambda^{-8}).
                                                               \tag{5.1}
\]

Equations (3.9) and (4.5) therefore give

\[
 {\epsilon_\lambda\over d_8}
 C_R C_E M_\Omega(L)
 =O_\Omega\!\left(
 {\lambda^{-2+2\eta}P(\lambda)
  \over\theta_\lambda^2}\right)+o(1).                 \tag{5.2}
\]

This proves the threshold (0.5).  On a real compact, replace
`lambda^(2 eta)` by `L` and enlarge `P`.

If a new theorem improved (3.3) to

\[
 C_{\rm pos}=O(\lambda P),                              \tag{5.3}
\]

then the same argument would instead give

\[
 C_RC_E=O\!\left({\lambda P\over\theta_\lambda^2}\right),
 \qquad
 {\epsilon_\lambda\over d_8}C_RC_EM_\Omega
 =O_\Omega\!\left(
 {\lambda^{-4+2\eta}P\over\theta_\lambda^2}\right), \tag{5.4}
\]

which proves the conditional threshold (0.6).  Section 6 explains why the
endpoint shear does not prove (5.3).

## 6. Declared metric scope and endpoint shear

The source metric used throughout Sections 2--5 is the declared split
metric

\[
 D_{\rm bd}=D_8\oplus D_R.                              \tag{6.1}
\]

The actual full source Gram has an additional singleton/rest cross block.
This note proves no comparison with that full metric and does not replace
`D_bd` by it.  A future frozen structured comparison could transfer the
result with its proved distortion, but it would not change the following
congruence identity.

Let the endpoint row of the original columns be

\[
 e=[e_8,e_R],\qquad e_8\ne0,
 \qquad s=e_R/e_8.                                      \tag{6.2}
\]

The lower-triangular column shear is represented by

\[
 S=\begin{bmatrix}1&-s\\0&I\end{bmatrix},
 \qquad eS=[e_8,0].                                     \tag{6.3}
\]

It makes every rest column endpoint-null.  For either source metric and
sampling synthesis,

\[
 D'=S^*DS,\qquad Z'=ZS,
 \qquad
 \boxed{Z'(D')^{-1}Z'^*=ZD^{-1}Z^*.}                   \tag{6.4}
\]

Thus generalized sampling leverage is exactly invariant when the synthesis
and metric are transformed together.  Silently shearing the columns while
retaining a block-diagonal metric would not be this congruence.

For the split metric one has explicitly

\[
 S^*D_{\rm bd}S=
 \begin{bmatrix}
 D_8&-D_8s\\
 -D_8s^*&D_R+D_8s^*s
 \end{bmatrix}.                                        \tag{6.5}
\]

Its singleton Schur complement is

\[
 \boxed{
 D_8-D_8^2s(D_R+D_8s^*s)^{-1}s^*
 ={D_8\over1+D_8sD_R^{-1}s^*}.}                         \tag{6.6}
\]

Consequently the apparently singleton endpoint row has the unchanged
inverse energy

\[
 \boxed{
 {|e_8|^2\over\operatorname {Schur}_8(S^*D_{\rm bd}S)}
 ={|e_8|^2\over D_8}+e_RD_R^{-1}e_R^*.}                 \tag{6.7}
\]

The rest coherence has moved into the metric cross block; it has not
vanished.

The fixed-even endpoint theorem makes this geometry concrete.  On every
fixed plus prefix, the defect-whitened leading sawtooth Gram tends to

\[
 {\pi\over12}{\bf1}{\bf1}^*.                            \tag{6.8}
\]

Its coherent eigenvalue grows with the prefix length.  The same theorem is
not uniform for `q=Theta(lambda^2)` and does not lower-bound the complete
paired-zero sampling Gram, so (6.8) is not a proof that the admitted
`lambda^3` upper bound is sharp.  It is, however, an exact obstruction to
deducing (5.3) merely by isolating the endpoint row with a congruence.
A new growing-uniform, full-metric endpoint-null sampling theorem would be
needed.  A future full/block metric comparison would legalize a change of
coordinates only with both metrics transformed; it would not invalidate
(6.4)--(6.7).

## 7. What projective and source-Cauchy algebra actually gives

Let a real even anchor `kappa` have boundary sum `c_kappa` and response
profile `mathcal A_kappa`; let `s_0` be an independent real source-Cauchy
root and let its boundary-normalized ground have response
`mathcal A_{s_0}`.  This `s_0` is not the lower Ritz shift `u` from
(0.1).  With

\[
 r={tL\over2\pi},\qquad r_0={t_0L\over2\pi},             \tag{7.1}
\]

the exact source-Cauchy transform formulas give

\[
 \widehat\kappa(t)=c_\kappa K_L(t)\mathcal A_\kappa(r),
 \qquad
 \widehat\Phi_{s_0}(t)=K_L(t)\mathcal A_{s_0}(r).      \tag{7.2}
\]

For `z_{s_0}=kappa-Phi_{s_0}/<kappa,Phi_{s_0}>`, its projective wedge is
exactly

\[
\boxed{
 \widehat\kappa(t_0)\widehat z_{s_0}(t)
 -\widehat\kappa(t)\widehat z_{s_0}(t_0)
 ={c_\kappa K_L(t)K_L(t_0)\over
     \langle\kappa,\Phi_{s_0}\rangle}
 \left|
 \begin{matrix}
 \mathcal A_\kappa(r)&\mathcal A_{s_0}(r)\\
 \mathcal A_\kappa(r_0)&\mathcal A_{s_0}(r_0)
 \end{matrix}
 \right|.}                                             \tag{7.3}
\]

The determinant in (7.3) is genuine projective cancellation.  The frozen
positive `N=3` source-Cauchy family shows that boundary data, Euclidean
norm, and any prescribed finite response jet do not bound it on another
window point.  A whole-window profile determinant estimate is still
missing.

There is also an exact all-shift Woodbury identity.  The source displacement
at any real shift `s` is

\[
 T(A-sI)-(Q_--sI)T
 =|\boldsymbol\beta\rangle\langle\eta_{\mathcal K}|
  -|d\rangle\langle b|.                                \tag{7.4}
\]

Put

\[
 U_0=[\boldsymbol\beta,-d],\qquad
 V_0=[\eta_{\mathcal K},b],                             \tag{7.5}
\]

\[
 X_s=T^{-1}(Q_--sI)^{-1}T,
 \qquad
 Y_s=T^{-1}(Q_--sI)^{-1}U_0.                            \tag{7.6}
\]

Whenever the displayed inverses exist,

\[
 \boxed{
 (A-sI)^{-1}
 =X_s-Y_s(I_2+V_0^*Y_s)^{-1}V_0^*X_s.}                 \tag{7.7}
\]

Hence every exact mixed row is

\[
\boxed{
 h^*(A-sI)^{-1}b
 =h^*X_sb-(h^*Y_s)(I_2+V_0^*Y_s)^{-1}V_0^*X_sb.}        \tag{7.8}
\]

The two terms in (7.7) are not separately positive.  Existing inputs do
not bound the odd-response rows or the `2 by 2` denominator at the required
scale.  Taking separate norms destroys the cancellation.  Equations
(7.3) and (7.8) therefore locate, but do not prove, the missing mixed-row
lemma.

## 8. A conditional forced-cancellation diagnostic

The realized nonresonant packet binds the frozen product `hC` from its
source theorem and has scale

\[
 \sigma:=hC,\qquad {1\over2}<hC<1,
 \qquad
 T_L={e^{hCL}\over L^{2m}}
     ={A^{hC}\over L^{2m}},
 \qquad A=\lambda^2,\quad c=2\pi A.                  \tag{8.1}
\]

Its complete source-white form has norm

\[
 \|\widehat Q_X\|=O(\lambda P)=A^{1/2+o(1)},            \tag{8.2}
\]

while the positive off-prime feature has a lower frame of order `T_L` on
its packet space `E`.  If one additionally identified that feature with a
subfeature of ordinary zero sampling, embedded `E` injectively into the
retained physical space, proved its source-white norm comparable to
`Delta_Y`, and controlled the lower-Ritz shift term, then (0.3) would force

\[
 \theta_\lambda
 \lesssim A^{1/2-hC+o(1)}.                              \tag{8.3}
\]

Choosing the frozen admissible product `hC` close to one would conflict off
the real axis with (0.5).  None of the required identifications is frozen.
In particular, the off-prime Hilbert map is
not a proved contraction of ordinary paired-zero sampling,
`E` is not captured by `Y`, the minimum-energy metric can shrink the source
metric, and the pulled lower-Ritz form is
`Q_X-u G_phys`, not `Q_X`.  Since `u` has no proved nonnegative sign, the
shift cannot be discarded.  Equation (8.3) is only a scale diagnostic, not
a no-go theorem.

## 9. Final open lemma

The narrow retained route is now exact:

\[
 \boxed{
 \Sigma_u\succeq\theta_\lambda\Delta_Y,
 \qquad
 \theta_\lambda\gg
 \lambda^{-1+\eta}\operatorname {polylog}\lambda}      \tag{9.1}
\]

is sufficient for the existing one-inverse graph product on a compact
strip of height `eta`.  The alternative direct route is a whole-window
bound for (7.3) or (7.8).  No current source-Cauchy, prolate, equality,
endpoint, or transition theorem proves either route.

In particular, this note proves no strict sign, no source-angle floor, no
complete signed determinant convergence, no equation (5.2), and no RH
conclusion.  The project remains fail closed at `P0_INVALIDATED`.
