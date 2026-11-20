# Lower-Ritz actual-schedule label-12 and Mellin-row barrier

## 0. Exact outcome and claim boundary

Use the checkpoint-1.22 schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 L=2\log\lambda,\qquad N=2^{9600\lambda^2}.          \tag{0.1}
\]

Let the exact inversion-even block, its lower two-vector Ritz shift, and
the determinant rows be

\[
 Q_+=\begin{pmatrix}q&b^*\\ b&A\end{pmatrix},\qquad
 r=\|b\|>0,\qquad w={b\over r},                       \tag{0.2}
\]

\[
 u=\lambda_{\min}\left(Q_+|_{\operatorname {span}\{\kappa,w\}}
                 \right),\qquad
 t=q-u>0,\qquad B=A-uI\succ0,                         \tag{0.3}
\]

\[
 \mathcal G_\Omega(w)=\sup_{z\in\Omega}|\langle g_z,w\rangle|,
 \qquad
 \mathcal L_\Omega(u)=\sup_{z\in\Omega}
                   \langle g_z,B^{-1}g_z\rangle.      \tag{0.4}
\]

The exact complete anchor/label-12 cross gives a new useful lower bound:
if `omega_12` is the unit actual anchor-deflated label-12 column, then

\[
 \boxed{
 {\langle\omega_{12},b\rangle\over d_8L}
 \longrightarrow C_{12}>0,\qquad
 r\geq\{C_{12}+o(1)\}d_8L.}                          \tag{0.5}
\]

The constant is explicit in frozen quantities:

\[
 C_{12}={\mathcal G_8\sqrt{14/99}
          \over A_4\|W_{12,\infty}\|}>0.             \tag{0.6}
\]

Consequently the first determinant scalar has the unconditional estimate

\[
 \boxed{
 \alpha_{\lambda,N}{t\over r}\mathcal G_\Omega(w)
 \leq C_\Omega\,{t\over d_8L}\sqrt{M_\Omega(L)}.}  \tag{0.7}
\]

Here `alpha_(lambda,N)=O(1)`, and the exact raw Mellin-row norm is

\[
 M_\Omega(L)=L\quad(\Omega\subset\mathbb R),\qquad
 M_\Omega(L)=O_\Omega(\lambda^{2\eta})
 \quad\left(\eta=\max_{z\in\Omega}|\operatorname {Im}z|>0\right).
                                                               \tag{0.8}
\]

Thus the single scalar lower-Ritz estimate

\[
 \boxed{q-u=O(d_4L)}                                  \tag{0.9}
\]

would prove the direct limit, at the rates

\[
 O(\lambda^{-8}\sqrt L)\quad(\Omega\subset\mathbb R),
 \qquad
 O_\Omega(\lambda^{-8+\eta})\quad(0<\eta<1/2).       \tag{0.10}
\]

In particular, the scalar condition `u>=0` would suffice.  No paired
`U_Z` sign is used.  But (0.9) is not proved on the actual schedule.
Fixed captured-block positivity controls neither the norm of the complete
residual nor the short obtained after the retained complement is
eliminated.  The endpoint-null tail frame and phase-absorbed Jost theorem
act on declared modal source ranges; no frozen theorem proves that those
ranges capture `w` in the complete signed graph.

The second determinant scalar also remains open:

\[
 \alpha_{\lambda,N}^2\chi_u\mathcal L_\Omega(u),
 \qquad
 \chi_u=t\left\{
 \langle w,Bw\rangle\langle w,B^{-1}w\rangle-1
 \right\}.                                           \tag{0.11}
\]

This stopping point is exact, not just a missing estimate.  An exact
`N=2` source-Cauchy family can be matched simultaneously to

\[
 q\asymp d_4L,\qquad
 |\langle e_1,b\rangle|\asymp d_8L,\qquad
 \langle e_1,Ae_1\rangle\asymp d_{12}L.              \tag{0.12}
\]

In that family the direct scalar tends to zero at the rate in (0.10),
both lower-Ritz signs hold, but
`chi_u*mathcal L_Omega(u)` diverges.  At the exact grid Mellin row
`z_lambda=4*pi/L`, the actual ground response does not tend to zero.
Therefore the fixed-block asymptotics, the label-12 overlap, source-Cauchy
displacement, and the strict lower-Ritz signs do not imply the residual
limit.

This note proves (0.5)--(0.10), identifies the first unsupported actual
capture/short lemmas, and gives the exact scale-matched non-implication
family.  It proves neither (0.9) nor (0.11) for the pinned arithmetic
matrices, neither strict sign on an unbounded actual schedule, equation
(5.2) of `DIRECT_RH_ATTACK.md`, a determinant limit, a zero statement, the
Riemann hypothesis, nor a de Bruijn--Newman `Lambda` bound.  The formal
state remains `P0_INVALIDATED`.

## 1. Frozen inputs

The following repository bytes are binding inputs.

| Dependency | SHA-256 |
|---|---|
| `notes/LOWER_RITZ_RESIDUAL_INVERSE_SPREAD_DETERMINANT_SPLIT_THEOREM.md` | `0e905dbb849d1a7cbf9a8906831d9c192c75bd953c10bf13329ea94dcee788a3` |
| `tests/test_lower_ritz_residual_inverse_spread_determinant_split_theorem.py` | `8cc310388b33f6ee075060f56c3b084867c68f66cae8aee64567ab9cab11e36b` |
| `notes/ANCHOR_LABEL12_COMPLETE_WEIGHTED_CROSS_ASYMPTOTIC_THEOREM.md` | `81282cb12234c8ea14a5acebc300fd64db9d03723f760d9c98ca1954526aafd0` |
| `tests/test_anchor_label12_complete_weighted_cross_asymptotic_theorem.py` | `930faf7b475cface7e9c052f3474dbe948992fc73f6e8a27433382ecf1b49a55` |
| `notes/FIXED_SOURCE_BLOCK_SHIFT_ASYMPTOTIC_THEOREM.md` | `04bfad2525191ca42d84a38427655c9c2ee1eff5ec0df2d8699ce0ec2b9abf83` |
| `tests/test_fixed_source_block_shift_asymptotic_theorem.py` | `433c695bdb4cdb589cee0212274f0d8b6dda38bb2844421b4367dd702f0545e5` |
| `notes/CYCLIC_MELLIN_GRAPH_PRODUCT_TRANSITION_PACKET_NONCAPTURE_BARRIER.md` | `b7e29753bb6ff4f4082a114413bf7f80b460f4c8d0a0b5e48ee73e435e2fc488` |
| `tests/test_cyclic_mellin_graph_product_transition_packet_noncapture_barrier.py` | `26d5d820330cb7971e7bf5e47550d56a9bc3924091db93d8e83afa3025a0d769` |
| `notes/LOWER_RITZ_HALF_POWER_ONE_INVERSE_SOURCE_ANGLE_REDUCTION.md` | `aed972d7f32b599179c0f769a6255401cd0127c7ba9dec4340494e73815b3dce` |
| `tests/test_lower_ritz_half_power_one_inverse_source_angle_reduction.py` | `27b8284faefe471934d40ca0937bdba4cb4a764b7aa1597559fd1cc0c774a9ed` |
| `notes/GROWING_LOW_PREFIX_ENDPOINT_NULL_WEIGHTED_TAIL_FRAME_THEOREM.md` | `173127618d340b2ad8feb127baba0c36502b41b791b51fc136ae4a1a5e5d2dcc` |
| `tests/test_growing_low_prefix_endpoint_null_weighted_tail_frame_theorem.py` | `5d66eb7efcadd80b39303ae41633c7df2f1fc88621f58ad26fb11e4ade47290b` |
| `notes/GROWING_LOW_PREFIX_PHASE_ABSORBED_JOST_BV_THEOREM.md` | `e084327cbdc236b7485e9d37240a5a6cf412605b48c8324d42ec1ab3e7b848fe` |
| `tests/test_growing_low_prefix_phase_absorbed_jost_bv_theorem.py` | `a96573b595c561521f89f879bb77d87cfe6f6812c09a18e29263570202028713` |
| `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md` | `76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc` |

The complete signed form is assembled before any inverse or absolute
value is taken.  The endpoint/Jost inputs are used only with their stated
modal-source and positive-frame scope.

## 2. The exact label-12 residual coordinate

Let `p_4=a_lambda*kappa` be the actual unscaled physical anchor.  Let
`W_12` be the actual physical anchor-deflated label-12 column and put

\[
 \omega_{12}={W_{12}\over\|W_{12}\|}.                 \tag{2.1}
\]

The fixed-prefix physical Gram theorem gives

\[
 a_\lambda\longrightarrow A_4>0,\qquad
 W_{12}\longrightarrow W_{12,\infty},\qquad
 \|W_{12,\infty}\|>0.                                \tag{2.2}
\]

Polarized two-sided radicality gives the exact complete forcing row

\[
 \boxed{
 \langle\omega_{12},b\rangle
 ={\mathcal W_Z(R_{12},R_4)
    \over a_\lambda\|W_{12}\|}.}                     \tag{2.3}
\]

Only its modulus matters if the inner-product convention reverses the
displayed arguments.  The complete cross theorem, including both compact
projection orientations and the inclusive minus-prime block, proves

\[
 {\mathcal W_Z(R_{12},R_4)\over d_8L}
 \longrightarrow\mathcal G_8\sqrt{14\over99}>0.      \tag{2.4}
\]

Substitution of (2.2) into (2.3)--(2.4) proves (0.5)--(0.6).  Notice the
direction of the information: (0.5) is a lower bound for `r`.  It is not
an upper bound and does not say that label 12 captures a fixed fraction of
the complete residual.

The exact critical hierarchy is

\[
 {d_4\over d_8}\sim {105\over4096\pi^4}\lambda^{-8},
 \qquad
 {\sqrt{d_4d_{12}}\over d_8}\longrightarrow
 \sqrt{14\over99}.                                   \tag{2.5}
\]

Thus the nonzero label-12 forcing coordinate has precisely the geometric-
mean scale between the anchor and label-12 diagonal.  It is not a smaller
error term.

## 3. Direct Mellin-row scaling

The Riesz vector for

\[
 v\longmapsto\widehat v(z)
 =\int_{-L/2}^{L/2}v(x)e^{-izx}\,dx                  \tag{3.1}
\]

has squared norm

\[
 \|\ell_z\|^2=
 \begin{cases}
 L,&\operatorname {Im}z=0,\\[1mm]
 {\sinh(L\operatorname {Im}z)\over\operatorname {Im}z},
       &\operatorname {Im}z\ne0.
 \end{cases}                                         \tag{3.2}
\]

Projection off the anchor cannot increase this norm.  Hence

\[
 \mathcal G_\Omega(w)\leq\sqrt{M_\Omega(L)}.          \tag{3.3}
\]

The projected source-normalized anchor norm
`alpha_(lambda,N)` converges to a finite nonzero constant.  Equations
(0.5) and (3.3) therefore prove (0.7).  If (0.9) holds, then (2.5) gives

\[
 {t\over d_8L}=O\left({d_4\over d_8}\right)
 =O(\lambda^{-8}).                                    \tag{3.4}
\]

Equations (0.8), (0.7), and (3.4) prove (0.10).  This is stronger than
needed on every compact subset of the open Mellin strip.

There is no hidden use of a sector sign here.  Since the fixed anchor
asymptotic gives `q=Theta(d_4 L)`, any scalar lower bound

\[
 u\geq-Cd_4L                                          \tag{3.5}
\]

implies (0.9).  In particular `u>=0` is sufficient, but neither statement
is currently proved on the full actual schedule.

## 4. Where the endpoint/Jost route first stops

Let `Y_lambda` be any declared fixed or `O(L)` endpoint-null modal source
range containing the actual label-12 column.  The exact tail theorem
controls positive exterior radial frames on this declared range.  The
phase-absorbed Jost theorem controls its outgoing regular symbols and
normalization.  Neither theorem states

\[
 \|b\|\leq C\|P_{Y_\lambda}b\|,
 \qquad
 \|P_{Y_\lambda}b\|
 \leq C|\langle\omega_{12},b\rangle|.               \tag{4.1}
\]

or a reducing relation between `Y_lambda` and `B`.  Equation (0.5) gives
only one nonzero coordinate of `P_(Y_lambda)b`; it proves neither capture
inequality in (4.1).  Together, the two inequalities in (4.1) would imply
the direct capture

\[
 r\leq C|\langle\omega_{12},b\rangle|=O(d_8L),        \tag{4.1a}
\]

which is the first estimate stated again in (4.4).

The exact scalar short which would be needed even after capture is

\[
 \begin{aligned}
 \sigma_{12}(u)={}&\langle\omega_{12},B\omega_{12}\rangle\\
 &-\left\langle P_{12}B\omega_{12},
 (P_{12}BP_{12})^{-1}P_{12}B\omega_{12}\right\rangle,
 \end{aligned}                                        \tag{4.2}
\]

where `P_12` projects onto `omega_12^perp` in the even complement.
Equivalently,

\[
 \sigma_{12}(u)={1\over
      \langle\omega_{12},B^{-1}\omega_{12}\rangle}. \tag{4.3}
\]

If the two actual estimates

\[
 r\leq C|\langle\omega_{12},b\rangle|,
 \qquad
 \sigma_{12}(u)\geq c\,d_{12}L                      \tag{4.4}
\]

were known, then the shorted-form inequality would give

\[
 \langle w,Bw\rangle
 \geq\sigma_{12}(u)|\langle\omega_{12},w\rangle|^2
 =\sigma_{12}(u){|\langle\omega_{12},b\rangle|^2\over r^2}.
                                                               \tag{4.5}
\]

Using the exact Ritz identity

\[
 t\langle w,Bw\rangle=r^2,                            \tag{4.6}
\]

equations (4.4)--(4.5) would imply

\[
 {t\over r}=O\left({d_8\over d_{12}}\right)
 =O(\lambda^{-8}),\qquad t=O(d_4L).                  \tag{4.7}
\]

Neither estimate in (4.4) is frozen.  A fixed compression floor bounds
`<omega_12,B omega_12>`, not its short (4.2).  Positive endpoint/Jost
frame estimates do not become a complete signed short after an
uncontrolled retained complement is eliminated.

The capture failure alone permits the direct ratio to stay large.  To see
the scale exactly, put

\[
 \delta_\lambda=\sqrt{d_4/d_{12}}\asymp\lambda^{-8},
 \qquad s_\lambda=d_{12}L,                            \tag{4.8}
\]

fix `rho>0`, `K>0`, and `c_*>0`, and consider the Hermitian separation
model

\[
 Q_+^{\rm sep}=s_\lambda
 \begin{pmatrix}
 \delta_\lambda^2&c_*\delta_\lambda&\rho\\
 c_*\delta_\lambda&1&0\\
 \rho&0&K\rho
 \end{pmatrix}.                                      \tag{4.9}
\]

Its visible anchor quotient, visible cross, and visible diagonal have the
three actual scales in (0.12).  The hidden residual coordinate is not
controlled by the visible block.  If `u_sep` is its lower two-vector Ritz
value, then

\[
 {r_{\rm sep}\over s_\lambda}\longrightarrow\rho,
 \qquad
 {\langle w,A w\rangle\over s_\lambda}
       \longrightarrow K\rho,                       \tag{4.10}
\]

and hence

\[
 {u_{\rm sep}\over s_\lambda}
 \longrightarrow{\rho\over2}\left(K-\sqrt{K^2+4}\right),
 \qquad
 {q-u_{\rm sep}\over r_{\rm sep}}
 \longrightarrow{\sqrt{K^2+4}-K\over2}>0.           \tag{4.11}
\]

Because `u_sep<0`, its shifted complement is positive; an independent
positive odd scalar also gives the second strict lower-Ritz sign.  This is
a separation model, not the pinned arithmetic matrix and not a claim that
the actual direct row fails.  It proves that the fixed visible scales and
strict signs alone cannot supply (0.9).  The first additional actual input
on this route is residual capture, followed by the short in (4.4).

## 5. The residual inverse row and the existing conditional scale

The exact inverse-spread theorem gives

\[
 \chi_u=e_u^*S_u^{-1}e_u
 =\langle b,B^{-1}b\rangle-t,                         \tag{5.1}
\]

where `e_u` is the two-vector Ritz residual and `S_u` is the retained
Schur short.  Therefore

\[
 \alpha_{\lambda,N}^2\chi_u\mathcal L_\Omega(u)
 \leq
 \alpha_{\lambda,N}^2\langle b,B^{-1}b\rangle
       \mathcal L_\Omega(u).                         \tag{5.2}
\]

The cyclic source-quotient theorem bounds the right side conditionally by

\[
 {\epsilon_\lambda\over d_8}
 C_R(\lambda)C_E(\lambda)M_\Omega(L),                 \tag{5.3}
\]

with

\[
 {\epsilon_\lambda\over d_8}
 =O\left(\lambda^{-5}\operatorname {polylog}\lambda\right)
  +o(\lambda^{-8}).                                   \tag{5.4}
\]

The one-inverse half-power theorem shows that the single harmonic source
angle

\[
 \Sigma_u\succeq\theta_\lambda\Delta_Y              \tag{5.5}
\]

would permit

\[
 C_R=O\left({\lambda^3\operatorname {polylog}\lambda
                    \over\theta_\lambda}\right),
 \qquad C_E=O(\theta_\lambda^{-1}).                  \tag{5.6}
\]

Thus (5.2) would tend to zero on a compact strip of height `eta` if

\[
 \boxed{
 \theta_\lambda\gg
 \lambda^{-1+\eta}\operatorname {polylog}\lambda.}  \tag{5.7}
\]

For a real compact, the additional `L` is absorbed into the polylogarithm.
This is a sufficient capture scale, not a proved estimate.  The
endpoint/Jost frames control the exterior positive metric on declared
modal ranges; they do not prove (5.5) for the complete signed lower-Ritz
short.

The strictly smaller determinant-specific missing statement is the
oriented Galerkin-error row.  If `mu` is the actual ground value,
`h=u-mu`, and

\[
 z_\mu={r\over\langle w,Bw\rangle+h}w+\delta_h,       \tag{5.8}
\]

then after the direct term is closed it is enough to prove

\[
 \boxed{
 \alpha_{\lambda,N}\sup_{z\in\Omega}
          |\langle g_z,\delta_h\rangle|\longrightarrow0.}    \tag{5.9}
\]

Equation (5.9) is weaker than the product in (0.11), because it retains
the mixed orientation.  No current endpoint, Jost, fixed-block, or
source-Cauchy theorem proves it.

## 6. Exact scale-matched source-Cauchy inverse-spread family

The residual obstruction can be matched to every scale in (0.12).  Let

\[
 \delta=\sqrt{d_4/d_{12}},\qquad s=d_{12}L,           \tag{6.1}
\]

and define

\[
 a=s,\qquad t=s\delta^2=d_4L,\qquad
 \varepsilon=s\delta^4,\qquad
 r=s\delta\sqrt{{16+\delta^4\over17}}.               \tag{6.2}
\]

On centered source nodes `-2,-1,0,1,2`, impose

\[
 \beta_{-n}=-\beta_n,\qquad a_{-n}=a_n,              \tag{6.3}
\]

\[
 \beta_0=0,\qquad
 \beta_1=-{4r\over\sqrt{34}},\qquad
 \beta_2=-{2r\over\sqrt{34}},                       \tag{6.4}
\]

\[
 a_0=t,\qquad
 a_1=a+{4r\over\sqrt{34}},\qquad
 a_2=\varepsilon+{r\over\sqrt{34}},                 \tag{6.5}
\]

and take the exact source-Cauchy matrix

\[
 Q_{nn}=a_n,\qquad Q_{nm}={\beta_n-\beta_m\over n-m}
 \quad(n\ne m).                                      \tag{6.6}
\]

In the normalized even parity basis this gives exactly

\[
 Q_+=\begin{pmatrix}
 t&-4r/\sqrt{17}&-r/\sqrt{17}\\
 -4r/\sqrt{17}&s&0\\
 -r/\sqrt{17}&0&s\delta^4
 \end{pmatrix}.                                      \tag{6.7}
\]

With

\[
 w={1\over\sqrt{17}}(-4,-1),\qquad
 B=\operatorname {diag}(s,s\delta^4),                \tag{6.8}
\]

the identity

\[
 t\langle w,Bw\rangle=r^2                           \tag{6.9}
\]

makes the lower two-vector Ritz value exactly `u=0`.  The odd block is

\[
 Q_-=\begin{pmatrix}
 s+8r/\sqrt{34}&4r/\sqrt{34}\\
 4r/\sqrt{34}&s\delta^4+2r/\sqrt{34}
 \end{pmatrix},                                      \tag{6.10}
\]

and

\[
 \det Q_-=s^2\delta^4
 +{2sr+8s\delta^4r\over\sqrt{34}}>0.                \tag{6.11}
\]

Thus both strict lower-Ritz signs hold.  Moreover,

\[
 {t\over s}=\delta^2={d_4\over d_{12}},\qquad
 {4r\over\sqrt{17}\,s}\asymp\delta,
 \qquad
 \delta\asymp\lambda^{-8}.                          \tag{6.12}
\]

Since `sqrt(d_4*d_12)/d_8` tends to a positive constant, the first
forcing coordinate in (6.7) has the actual `d_8 L` scale.  The first
complement diagonal has the actual `d_12 L` scale.  At the same time,

\[
 {t\over r}=\delta\sqrt{{17\over16+\delta^4}},        \tag{6.13}
\]

so the raw direct Mellin bound tends to zero with exactly the rates in
(0.10).

The inverse spread is instead

\[
 K_w={\langle b,B^{-1}b\rangle\over t}
 ={(16+\delta^4)(16+\delta^{-4})\over289},            \tag{6.14}
\]

and hence

\[
 \chi_u=t(K_w-1)\sim {16s\over289}\delta^{-2}.       \tag{6.15}
\]

Now use the exact Fourier grid frequency

\[
 z_\lambda={4\pi\over L}\longrightarrow0.           \tag{6.16}
\]

On the centered source interval, its anchor-removed even Riesz vector is

\[
 g_{z_\lambda}=\sqrt{L/2}\,e_2^+.                    \tag{6.17}
\]

Therefore every nondegenerate fixed real interval containing a
neighborhood of zero satisfies, eventually,

\[
 \mathcal L_\Omega(0)\geq{L\over2s\delta^4},         \tag{6.18}
\]

and

\[
 \boxed{
 \chi_u\mathcal L_\Omega(0)
 \geq\left({8\over289}+o(1)\right)L\delta^{-6}
 \longrightarrow\infty.}                            \tag{6.19}
\]

For completeness, if the actual even ground is `mu=-sH_delta`, its scalar
equation gives

\[
 {H_\delta\over\delta}\longrightarrow{4\over17}.    \tag{6.20}
\]

The exact response at (6.16) is

\[
 \langle g_{z_\lambda},z_\mu\rangle
 =-\sqrt{L/2}\,
 {\delta\sqrt{16+\delta^4}/17
       \over\delta^4+H_\delta}
 =-\{1+o(1)\}\sqrt{L/2}.                             \tag{6.21}
\]

Thus the direct term closes while a Mellin-visible soft retained channel
prevents determinant-observable decay.  This family is exact
source-Cauchy algebra on the actual growing interval, but it is not the
pinned pole--Archimedean--minus-prime matrix.  It proves non-implication,
not failure of the desired limit for the actual arithmetic matrices.

## 7. Strict stopping point

The actual schedule now has a sharp division.

1. The direct scalar will close once the one-number estimate
   `q-u=O(d_4 L)` is proved.  Attempting to derive it from the current
   source blocks stops first at residual capture, and then at the
   label-12 short (4.4).
2. Even the anchor-scale estimate and exact label-12 capture do not control
   the residual inverse spread.  The next determinant-specific target is
   the mixed row (5.9), or the stronger source-angle condition (5.7).

No numerical or literature report is admitted here.  No standard-eight
file, source lock, replay output, or formal status file is changed.
