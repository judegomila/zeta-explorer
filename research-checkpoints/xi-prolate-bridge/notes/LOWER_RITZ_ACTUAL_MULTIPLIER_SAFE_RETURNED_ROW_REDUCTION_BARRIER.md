# Lower-Ritz actual-multiplier safe returned-row reduction/barrier

## 0. Exact outcome and claim boundary

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 L=2\log\lambda,\qquad N=2^{9600\lambda^2}.          \tag{0.1}
\]

Write the complete inversion-even block and its genuine lower two-vector
Ritz shift as

\[
 Q_+=\begin{pmatrix}q&b^*\\b&A\end{pmatrix},\qquad
 u=\lambda_{\min}\left(
 Q_+|_{\operatorname {span}\{\kappa,b\}}\right),     \tag{0.2}
\]

\[
 t=q-u\geq0,\qquad B_u=A-uI,\qquad B_q=A-qI.
                                                               \tag{0.3}
\]

Every inverse statement below is conditional on the unproved strict
lower-Ritz branch

\[
 B_u\succ0.                                             \tag{0.4}
\]

Apply the exact far elimination and then the captured elimination from the
post-far inverse-row theorem.  Their combined harmonic lift `mathsf G_u`
onto the retained coordinate space `mathcal R` satisfies

\[
 R_1=\mathsf G_u^*B_u\mathsf G_u,
 \qquad \rho_1=\mathsf G_u^*b.                       \tag{0.5}
\]

Define the genuine complete-symbol multiplier-dangerous projector at the
eventually nonnegative upper shift `U=q`.  If `Pi_q` is that physical
projector, put

\[
 \mathcal D_R=\operatorname {Ran}(\mathsf G_u^*\Pi_q),
 \qquad \mathcal F_R=\mathcal R\ominus\mathcal D_R. \tag{0.6}
\]

Then

\[
 \boxed{\dim\mathcal D_R\leq\dim\operatorname {Ran}\Pi_q
             =\exp(O(\lambda)).}                    \tag{0.7}
\]

On `mathcal D_R direct-sum mathcal F_R`, write

\[
 R_1=\begin{pmatrix}D&\Gamma^*\\\Gamma&H\end{pmatrix},
 \qquad \rho_1=\binom d f.                          \tag{0.8}
\]

The actual multiplier floor at `q`, followed by the lower shift to `u`,
gives

\[
 H\succeq(\delta+t)I.                               \tag{0.9}
\]

Exact Gaussian elimination gives the returned-row split

\[
 \boxed{
 \rho_1^*R_1^{-1}\rho_1
 =f^*H^{-1}f+
 \widetilde d^*S_D^{-1}\widetilde d,}              \tag{0.10}
\]

\[
 S_D=D-\Gamma^*H^{-1}\Gamma,
 \qquad \widetilde d=d-\Gamma^*H^{-1}f.             \tag{0.11}
\]

Thus the row left on the dangerous space is `widetilde d`, not the raw
dangerous projection `d`.  Both the far/captured returns inside `rho_1` and
the safe return in (0.11) remain exact.

The positive zero-sampling Gram and compact-BV theorem do control the safe
term, but only at the scale

\[
 \boxed{
 f^*H^{-1}f
 \leq {U_ZB_{\rm abs}(\lambda,N)\over\delta+t}.}     \tag{0.12}
\]

Using the multiplier projector at `U=q` does not replace `U_Z` by `q` in
(0.12).  The projector shift and the positive-sampling Cauchy--Schwarz
constant are different quantities: `q` is a signed anchor quadratic, while
`U_Z` is the positive sample-square energy.  The frozen implication is only
`q<=U_Z`.

On the locked schedule the frozen estimates give

\[
 U_Z=o(d_6),\qquad {d_6\over d_4}=\Theta(\lambda^4),
 \qquad B_{\rm abs}=O(\lambda^3L^2).                \tag{0.13}
\]

For fixed `delta`, (0.12) is only

\[
 f^*H^{-1}f=o(d_4\lambda^7L^2),                     \tag{0.14}
\]

which does not imply `O(d_4L)`.  The later hybrid remainder estimate still
leaves a positive polynomial loss after multiplication by `B_abs`.  Hence
the frozen source-Cauchy, compact-BV, and absolute-sampling inputs do not
remove the safe term at the determinant-compatible scale.

The smallest missing safe-row statement is

\[
 \boxed{ff^*\preceq C d_4L H,}                      \tag{0.15}
\]

or a source-specific sampling-to-signed-energy comparison on the actual
twice-harmonic safe range that implies (0.15).  Conditional on (0.15), the
only remaining part of the retained inverse row is the
`exp(O(lambda))`-dimensional dangerous term in (0.10).

There is nevertheless a determinant-only gain.  For a fixed compact
Mellin rectangle `Omega` in `|Im z|<1/2`, the pure safe part of the returned
Mellin observation obeys

\[
 \boxed{
 \sup_{z\in\Omega}|k_z^*H^{-1}f|
 \leq {\sqrt{U_ZB_{\rm abs}M_\Omega(L)}\over\delta+t}
 \longrightarrow0.}                                \tag{0.16}
\]

Here `k_z` is the twice-returned safe Mellin row and
`M_Omega(L)=O_Omega(L lambda^(2 eta))` for strip height `eta<1/2`.
The safe energy need not have the `d_4L` scale for (0.16) to vanish.  Exact
block solving absorbs every safe/danger cross into returned dangerous
forcing and observation rows.  Thus the retained Mellin observable, though
not the retained inverse energy, reduces to the `exp(O(lambda))`-dimensional
dangerous block.

An exact source-Cauchy family below has `q=U_Z`, both strict lower-Ritz
signs, zero multiplier-dangerous dimension, the generic sampling ceiling,
and a strict safe floor, while its safe inverse energy diverges relative to
`q-u`.  It proves that (0.12) cannot be sharpened from those abstract data
alone.  It is not an arithmetic counterexample and does not replace the
actual von-Mangoldt projector.

This note proves an exact reduction and a sharp scale barrier.  It does not
prove (0.15) for the pinned arithmetic matrices, either strict lower-Ritz
sign on the unbounded schedule, equation (5.2) of `DIRECT_RH_ATTACK.md`, a
determinant limit, a zero statement, the Riemann hypothesis, or a
de Bruijn--Newman `Lambda` bound.  The formal state remains
`P0_INVALIDATED`, and the standard eight are unchanged.

## 1. Frozen inputs

Only the following exact repository bytes are imported.

| Dependency | SHA-256 |
|---|---|
| `notes/LOWER_RITZ_POST_FAR_RETAINED_INVERSE_ROW_THEOREM.md` | `9288ac25216781416d0bb1d0ef7d2a11f3dd09bac8e8f04195ac9b3e928229f3` |
| `tests/test_lower_ritz_post_far_retained_inverse_row_theorem.py` | `8f2aa9cb6daca472d75a890520c23dfd1b5dcb487e8454b1c12b598b61a58327` |
| `notes/GROWING_MIXED_BRIDGE_ACTUAL_MULTIPLIER_DANGEROUS_FESHBACH_REDUCTION.md` | `cc2a62d6be1c62985ab9d5e2893c74c9ae773280f6bff4015f998364ccbd924e` |
| `tests/test_growing_mixed_bridge_actual_multiplier_dangerous_feshbach_reduction.py` | `1bbe3d751efedb86ab412921a5f99d243b1ebffef33afe325e2930a5d5670a0c` |
| `notes/WEAK_RESIDUAL_SAMPLING_REDUCTION.md` | `b0254889d35ae41a92ee926dd116b473ee427e2762f8853903f4e80e307860ed` |
| `tests/test_weak_residual_duality.py` | `0f1f9847497b63b6b2c9e4b9f267dd8157ab71547f80b127d65cbda16af9d659` |
| `notes/COMPACT_ABSOLUTE_SAMPLING_THEOREM.md` | `2feb3d62a71e435706c4b330d13bcb096015e52204af6ec9bd2828308d44383d` |
| `tests/test_compact_absolute_sampling.py` | `883c0e4edd8b6573bcf11740031a6a0ea93340d45e36ac1057e3793b729bc605` |
| `notes/FIXED_SOURCE_BLOCK_SHIFT_ASYMPTOTIC_THEOREM.md` | `04bfad2525191ca42d84a38427655c9c2ee1eff5ec0df2d8699ce0ec2b9abf83` |
| `tests/test_fixed_source_block_shift_asymptotic_theorem.py` | `433c695bdb4cdb589cee0212274f0d8b6dda38bb2844421b4367dd702f0545e5` |
| `notes/LOWER_RITZ_RESIDUAL_INVERSE_SPREAD_DETERMINANT_SPLIT_THEOREM.md` | `0e905dbb849d1a7cbf9a8906831d9c192c75bd953c10bf13329ea94dcee788a3` |
| `tests/test_lower_ritz_residual_inverse_spread_determinant_split_theorem.py` | `8cc310388b33f6ee075060f56c3b084867c68f66cae8aee64567ab9cab11e36b` |

The first pair supplies (0.5).  The multiplier pair supplies the actual
complete-symbol projector and its safe floor.  The middle pairs supply the
positive sampling Loewner row, the compact-BV operator ceiling, and the
actual shift and defect scales.  The final pair supplies the exact
source-Cauchy family used in Section 5.

## 2. Pulling the actual projector through both harmonic returns

Let `Pi_q` be the even complete-symbol projector constructed from

\[
 v_q(s)=[g+q-m_\lambda(s)]_+,
 \qquad g>\delta>0.                                  \tag{2.1}
\]

On its physical safe space,

\[
 P_{\Pi_q^\perp}B_qP_{\Pi_q^\perp}
 \succeq\delta P_{\Pi_q^\perp}.                    \tag{2.2}
\]

The fixed source asymptotic makes `q>=0` eventually, so this is an admitted
nonnegative upper shift.  Since

\[
 B_u=B_q+tI,                                         \tag{2.3}
\]

the same physical safe space has floor `delta+t` at the lower Ritz shift.
The standard trace/phase-volume estimate gives

\[
 \dim\operatorname {Ran}\Pi_q
 \leq {L\Phi_\lambda(q,g)\over2\pi(g-\delta)}
 =\exp(O(\lambda))                                  \tag{2.4}
\]

for fixed `g,delta`.

Let `i_F:mathcal F_R -> mathcal R` be inclusion and put

\[
 W_F=\mathsf G_ui_F.                                 \tag{2.5}
\]

If `z in mathcal F_R`, then for every physical `x`,

\[
 \langle\Pi_q\mathsf G_uz,x\rangle
 =\langle z,\mathsf G_u^*\Pi_qx\rangle=0.           \tag{2.6}
\]

Thus `Pi_q W_F=0`.  Equations (2.2)--(2.3) give the stronger metric form

\[
 \boxed{
 H=W_F^*B_uW_F
 \succeq(\delta+t)W_F^*W_F
 \succeq(\delta+t)I.}                              \tag{2.7}
\]

The last inequality uses the identity retained coordinate in the captured
harmonic lift; the far lift only adds another orthogonal component.  This
proves (0.7) and (0.9) without discarding either Schur return.

Under (0.4), `R_1>0`.  Therefore `H>0` and

\[
 S_D=D-\Gamma^*H^{-1}\Gamma\succ0.                  \tag{2.8}
\]

Applying the exact inverse-row factorization to (0.8) proves
(0.10)--(0.11).

## 3. What positive zero sampling proves on the safe range

Let `mathsf Z` be the positive paired zero-sampling analysis on the complete
even complement and let

\[
 G_Z=\mathsf Z^*\mathsf Z.                           \tag{3.1}
\]

The exact radical leakage identity and ordinary sequence Cauchy--Schwarz
give

\[
 \boxed{bb^*\preceq U_ZG_Z.}                        \tag{3.2}
\]

The compact-BV theorem gives the finite operator ceiling

\[
 \boxed{G_Z\preceq B_{\rm abs}(\lambda,N)I.}        \tag{3.3}
\]

The safe returned row is exactly

\[
 f=i_F^*\rho_1=W_F^*b.                              \tag{3.4}
\]

Pull (3.2)--(3.3) back by `W_F` and then use (2.7):

\[
 \begin{aligned}
 ff^*
 &=W_F^*bb^*W_F\\
 &\preceq U_ZW_F^*G_ZW_F\\
 &\preceq U_ZB_{\rm abs}W_F^*W_F\\
 &\preceq {U_ZB_{\rm abs}\over\delta+t}H.
 \end{aligned}                                      \tag{3.5}
\]

The sharp rank-one Loewner criterion now proves (0.12).  Notice what did
not enter this proof: no norm of either harmonic lift, no replacement of
`rho_1` by raw `b`, and no assumption that the multiplier projector
commutes with a far or captured split.

The exact source-specific quantity behind (3.5) is

\[
 \mathcal C_{\rm safe}
 :=\sup_{0\ne z\in\mathcal F_R}
 {U_Z\|\mathsf ZW_Fz\|^2
  \over d_4L\,\langle W_Fz,B_uW_Fz\rangle}.          \tag{3.6}
\]

A uniform bound for (3.6) would prove (0.15).  Compact BV replaces its
numerator by `U_Z B_abs ||W_Fz||^2`; it gives no defect-relative alignment
between positive zero sampling and the actual signed safe energy.

### 3.1 Determinant-only safe-observable elimination

Let `s>=0` be a ridge parameter and redo the two exact harmonic eliminations
for

\[
 B_{u,s}=B_u+sI.                                     \tag{3.7}
\]

Denote the combined lift by `mathsf G_(u,s)`, and pull the same physical
`q`-shifted projector through this lift.  On the corresponding returned
retained space write

\[
 R_{1,s}=\begin{pmatrix}D_s&\Gamma_s^*\\
                         \Gamma_s&H_s\end{pmatrix},
 \qquad
 \rho_{1,s}=\binom{d_s}{f_s}.                       \tag{3.8}
\]

For the physical anchor-removed Mellin Riesz vector `g_z`, its twice-returned
row is

\[
 \eta_{z,s}=\mathsf G_{u,s}^*g_z
            =\binom{a_{z,s}}{k_{z,s}}.              \tag{3.9}
\]

Put

\[
 \begin{aligned}
 S_{D,s}&=D_s-\Gamma_s^*H_s^{-1}\Gamma_s,\\
 \widetilde d_s&=d_s-\Gamma_s^*H_s^{-1}f_s,\\
 \widetilde a_{z,s}&=a_{z,s}
                  -\Gamma_s^*H_s^{-1}k_{z,s}.
 \end{aligned}                                      \tag{3.10}
\]

The exact retained solve is

\[
 \boxed{
 \begin{aligned}
 x_{D,s}&=S_{D,s}^{-1}\widetilde d_s,\\
 x_{F,s}&=H_s^{-1}f_s
       -H_s^{-1}\Gamma_sS_{D,s}^{-1}\widetilde d_s.
 \end{aligned}}                                     \tag{3.11}
\]

Consequently

\[
 \boxed{
 \eta_{z,s}^*R_{1,s}^{-1}\rho_{1,s}
 =k_{z,s}^*H_s^{-1}f_s
  +\widetilde a_{z,s}^*S_{D,s}^{-1}\widetilde d_s.} \tag{3.12}
\]

In particular, the term
`H_s^(-1) Gamma_s S_(D,s)^(-1) widetilde d_s` is not
discarded.  It is exactly the safe component of the dangerous solve, and
its Mellin pairing is absorbed into `widetilde a_(z,s)`.

The same argument as (3.5), now with safe floor `delta+t+s`, gives

\[
 f_s^*H_s^{-1}f_s
 \leq{U_ZB_{\rm abs}\over\delta+t+s}.                \tag{3.13}
\]

On `I_lambda=[-L/2,L/2]`, direct integration of the evaluation Riesz vector
gives

\[
 \|g_z\|^2\leq M_\Omega(L),\qquad
 M_\Omega(L)=O_\Omega(L\lambda^{2\eta})
 \quad(z\in\Omega,\ |\operatorname {Im}z|\leq\eta). \tag{3.14}
\]

The safe-floor pullback therefore also gives

\[
 k_{z,s}^*H_s^{-1}k_{z,s}
 \leq{M_\Omega(L)\over\delta+t+s}.                  \tag{3.15}
\]

Graph Cauchy--Schwarz, (3.13), and (3.15) prove, uniformly for `s>=0`,

\[
 \boxed{
 \sup_{z\in\Omega}|k_{z,s}^*H_s^{-1}f_s|
 \leq {\sqrt{U_ZB_{\rm abs}M_\Omega(L)}
          \over\delta+t+s}.}                        \tag{3.16}
\]

The pinned defect asymptotic makes the right side exponentially small for
every fixed `eta<1/2`; the polynomial factors in `U_Z`, `B_abs`, and
`M_Omega` cannot overcome `sqrt(d_4)`.  Since the source normalization
`alpha_(lambda,N)` tends to a finite positive constant, it does not alter
this limit.

Equation (3.12) therefore reduces the returned retained Mellin observable
to the dangerous term

\[
 \widetilde a_{z,s}^*S_{D,s}^{-1}\widetilde d_s     \tag{3.17}
\]

on a space of dimension `exp(O(lambda))`, uniformly in the ridge.  This is
not a bound for (3.17).  It also does not silently identify the original
half-power anchor-to-far row `b_F` with `f_s`: `f_s` is the post-far,
post-captured, multiplier-safe forcing.  If the captured cap is adjoined to
the dangerous coordinates instead of first being eliminated, the same
calculation gives the equivalent `O(L)+exp(O(lambda))` small-space
reduction for the whole post-far short.

## 4. Exact scale ledger

The frozen locked-schedule estimates are

\[
 B_{\rm abs}=O(\lambda^3L^2),\qquad
 U_Z=o(d_6),\qquad
 d_6=\Theta(\lambda^4d_4).                           \tag{4.1}
\]

For fixed `g,delta`, equations (0.12) and (4.1) give only (0.14).  Dividing
that bound by the target `d_4L` leaves `o(lambda^7L)`, not `o(1)` or
`O(1)`.  Little-oh against a growing polynomial is not a closing estimate.

The sharper complete-remainder statement recorded in the weak-residual
note has the form

\[
 U_Z=O(\lambda^3\operatorname {polylog}(\lambda)d_4)+o(d_4),
                                                               \tag{4.2}
\]

because the normalized anchor norm tends to a positive constant.  Combining
(4.2) with `B_abs=O(lambda^3L^2)` still leaves a positive power of
`lambda` relative to `d_4L`.

Even if one incorrectly granted the stronger replacement `U_Z -> q`, the
fixed asymptotic `q=Theta(d_4L)` and compact-BV ceiling would give only

\[
 {qB_{\rm abs}\over\delta+t}
 =O(d_4\lambda^3L^3)                                \tag{4.3}
\]

for fixed `delta`, a factor `lambda^3L^2` above `d_4L`.  The actual frozen
row inequality does not grant this replacement in the first place.

One can increase `g` and `delta`.  However, the displayed phase-volume
majorant remains `exp(O(lambda))` only while `g=O(lambda)`.  Taking
`delta=Theta(lambda)` therefore removes at most one power of `lambda` from
the frozen majorant, which still does not prove (0.15).  Taking a much
larger threshold abandons the claimed `exp(O(lambda))` dangerous-dimension
bound.

Thus (0.12) is a genuine estimate, but it is not the requested
determinant-scale safe-row theorem.

## 5. Exact all-safe source-Cauchy non-implication family

Let

\[
 0<t<{1\over4},\qquad M>1,
 \qquad r^2={t(16M+1)\over17},
 \qquad w={1\over\sqrt {17}}(-4,-1).                \tag{5.1}
\]

On the centered nodes `-2,-1,0,1,2`, impose

\[
 \beta_0=0,\qquad
 \beta_1=-{4r\over\sqrt {34}},\qquad
 \beta_2=-{2r\over\sqrt {34}},\qquad
 \beta_{-j}=-\beta_j,                               \tag{5.2}
\]

and symmetric diagonal coefficients

\[
 a_0=t,\qquad
 a_1=M+{4r\over\sqrt {34}},\qquad
 a_2=1+{r\over\sqrt {34}}.                          \tag{5.3}
\]

The exact source-Cauchy rule gives the parity blocks

\[
 Q_+=\begin{pmatrix}
 t&-4r/\sqrt {17}&-r/\sqrt {17}\\
 -4r/\sqrt {17}&M&0\\
 -r/\sqrt {17}&0&1
 \end{pmatrix},                                     \tag{5.4}
\]

\[
 Q_-=\begin{pmatrix}
 M+8r/\sqrt {34}&4r/\sqrt {34}\\
 4r/\sqrt {34}&1+2r/\sqrt {34}
 \end{pmatrix}\succ0.                              \tag{5.5}
\]

The coupling is `b=rw`, and

\[
 t\langle w,\operatorname {diag}(M,1)w\rangle=r^2.
                                                               \tag{5.6}
\]

Hence the genuine lower Ritz value is `u=0`, while

\[
 B_u=\operatorname {diag}(M,1)\succ0.               \tag{5.7}
\]

At the upper shift `q=t`, put

\[
 B_q=\operatorname {diag}(M-t,1-t).                 \tag{5.8}
\]

Take `g=1/2`, `delta=1/4`, `T_v=0`, and

\[
 T_a=B_q-{1\over2}I\succ0.                          \tag{5.9}
\]

The multiplier-dangerous projector is zero and the whole complement is
safe.  This is a positive/negative-part structural model, not the actual
von-Mangoldt symbol.

Define the positive sampling Gram by

\[
 U_Z=t,\qquad G_Z={1\over t}bb^*.                   \tag{5.10}
\]

Then

\[
 bb^*=U_ZG_Z,qquad
 \|G_Z\|={16M+1\over17}\leq M=:B_{\rm abs},
 \qquad q=U_Z.                                      \tag{5.11}
\]

There are no preliminary far or captured coordinates, so `R_1=B_u` and
`rho_1=b`.  The entire retained inverse row is the safe term, and

\[
 \boxed{
 {b^*B_u^{-1}b\over t}
 ={(16M+1)(16/M+1)\over289}
 \sim{16M\over289}.}                               \tag{5.12}
\]

Taking `M=lambda` and formally `t=d_4L` respects the generic locked bounds
`B_abs=O(lambda^3L^2)` and `U_Z=o(d_6)`, but (5.12) diverges.  Thus even
source-Cauchy displacement, both lower-Ritz signs, positive sampling,
`q=U_Z`, a strict safe floor, and zero dangerous dimension do not imply the
safe-row target (0.15).  A proof for the pinned arithmetic matrices must use
additional actual-symbol alignment such as (3.6).

## 6. Strict stopping point

The actual multiplier projector gives the exact retained decomposition

\[
 \rho_1^*R_1^{-1}\rho_1
 \leq {U_ZB_{\rm abs}\over\delta+t}
       +\widetilde d^*S_D^{-1}\widetilde d,          \tag{6.1}
\]

where the second term lives on a space of dimension `exp(O(lambda))`.
The first term is not known to be `O(d_4L)`.  Therefore the present frozen
inputs do not yet reduce the determinant-compatible inverse row to the
dangerous Feshbach space alone.

For the determinant-only Mellin observable, the conclusion is sharper:
the pure safe term tends to zero by (3.16), and (3.12) moves all remaining
safe/danger feedback into the returned dangerous observation.  Thus its
retained part is reduced to (3.17), despite the inverse-energy scale gap.

The exact next alternatives are:

1. prove the safe returned-row Loewner estimate (0.15), or equivalently a
   uniform bound in (3.6); and
2. prove the returned dangerous-row estimate

   \[
    \widetilde d\widetilde d^*
       \preceq C d_4L S_D.                           \tag{6.2}
   \]

Both statements retain every harmonic return and use the lower shift `u`.
Neither is supplied by a raw projection bound for `b`.

No standard-eight file, source lock, replay output, or formal-status file is
changed.

## 7. Reproduction

Run

    python3 -B -m unittest \
      tests.test_lower_ritz_actual_multiplier_safe_returned_row_reduction_barrier -v

The regression checks every frozen hash, the twice-harmonic projector
pullback, exact safe/danger inverse split, positive-sampling safe-row
Loewner estimate, scale loss, exact source-Cauchy parity blocks, lower-Ritz
normalization, zero-danger countermodel, displayed TeX, and static hygiene.
