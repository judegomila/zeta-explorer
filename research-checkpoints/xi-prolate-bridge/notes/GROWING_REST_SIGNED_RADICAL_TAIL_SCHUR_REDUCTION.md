# Growing-rest signed radical-tail Schur reduction

## 0. Exact outcome and claim boundary

This note isolates the exact lower-frame statement still missing on the
combined label-8/rest physical low range.  It has four conclusions.

1. The physical comparison

   \[
   B_L\succeq\mu\Delta_L
   \]

   is equivalent, without assuming injectivity of the physical synthesis,
   to one source-coordinate inequality with
   `P_0=1_(ker A)^perp` retained.

2. Every actual anchor-deflated label-8/rest column has a linear
   origin-corrected global radical lift which leaves its physical image
   unchanged.  Polarization of the exterior remainders gives the complete
   signed matrix

   \[
   \Sigma=W_L^*QW_L
   \]

   before the scalar shift is subtracted.

3. After a raw source congruence, the full comparison is equivalent to one
   singleton-shorted matrix inequality on the growing rest space.  It keeps
   the source projection and the label-8/rest quotient-relative cross.  This
   is the minimal actual lower-frame target identified here.

4. The existing positive absolute sampling, endpoint, moment, and
   fixed-window covariance inputs do not imply that target.  A paired-slot
   family with identical positive data has a fixed favorable singleton and
   zero cross while its rest floor tends to zero.  This is a nonactual
   implication countermodel, not a prolate--Weil counterexample.

Nothing below proves the new rest inequality on an unbounded schedule.  In
particular, no uniform signed low floor, reducing property, high-complement
floor, odd-sector floor, residual action, equation (5.2) of
`DIRECT_RH_ATTACK.md`, determinant limit, RH conclusion, or Lambda bound is
proved.  No status, replay, source-lock, artifact, or integration file is
changed.

## 1. Frozen dependencies

The reduction uses the following exact bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/SIGNED_QUOTIENT_CAPTURE_REDUCTION.md` | `9700501a367ea7ae2b843ee61b45bec3970fc35db1715613099b08439be0415c` |
| `notes/BLOCK_QUOTIENT_ACTION_THEOREM.md` | `31c4239b2dec0114be7b8e9b42e52ebc6361130461d1225e05c81ff5b26369d4` |
| `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md` | `76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc` |
| `notes/COMMON_RADICAL_LEAKAGE_GRAM_ORIENTATION_OBSTRUCTION.md` | `e589c3bce1174a94666364dea523f23e0828a2906338f36e81f05c8d25378816` |
| `notes/WEIGHTED_PNT_DISCREPANCY_NORMAL_FORM.md` | `eda566d5a2867d28f5218a89a48cc95c30fe74491fb11bb74b86c7fb6ed68ac6` |
| `notes/POLYNOMIAL_XI_RADICAL_TOWER_COVARIANCE_FLOOR_OBSTRUCTION.md` | `6281a93e4320e6c25fa09fdf942b94147a9b6aa1706b6c34dd079074d2f0ee98` |
| `notes/TRANSVERSE_XI_RADICAL_MOMENT_ANGLE_OBSTRUCTION.md` | `e5a0888f54ae4ae97d00462b7cfd00cbc9d98638ff9d36aea0fdb7a1c861e77f` |
| `notes/FIXED_LABEL_EIGHT_ARITHMETIC_SYNTHESIS_GAIN.md` | `9e98b870419a721c8797e7577b6edf18649e50f6c9fe6f727dae61a53d6d7f71` |
| `notes/TRANSPORTED_SIGNED_KERNEL_LEFT_RESERVE_BARRIER.md` | `6e45d1ba6667f480223f0e742fd57c14c8708bc8cd8f77c0001edb9c234b23d2` |

All spaces below are finite dimensional.  Every Moore--Penrose inverse,
support projection, and Schur complement is therefore unambiguous.

## 2. Physical/source equivalence with a noninjective synthesis

Use the actual split-block metric and synthesis

\[
 X_L=X_8\oplus X_R,\qquad
 D=D_8\oplus D_R>0,\qquad
 W=[\,W_8\;W_R\,],                                    \tag{2.1}
\]

and put

\[
 A=WD^{-1/2}=[\,A_8\;A_R\,],\qquad
 K=\operatorname {ran}A,\qquad
 P_0=A^\dagger A=1_{(\ker A)^\perp}.                   \tag{2.2}
\]

On `K`, define

\[
 \Delta=(AA^*)^\dagger\big|_K,\qquad
 B=P_K(Q-UI)P_K\big|_K.                                \tag{2.3}
\]

Every `v in K` has the unique minimum-norm representation `v=Ax` with
`x in ran P_0`, and the quotient identity gives

\[
 \langle Ax,\Delta Ax\rangle=\|x\|^2.                 \tag{2.4}
\]

Define the source pullback

\[
 H=A^*BA.                                               \tag{2.5}
\]

Because `AP_0=A` and `P_0A^*=A^*`, one has `H=P_0HP_0`.
Equation (2.4) now proves, for every real `mu`,

\[
 \boxed{
 B\succeq\mu\Delta
 \quad\Longleftrightarrow\quad
 H-\mu P_0\succeq0.}                                  \tag{2.6}
\]

The right side is an inequality on all of `X_L`; both terms vanish on
`ker A`.  Thus (2.6) neither assumes a smallest physical singular value nor
silently replaces `P_0` by the identity.

The projection itself is source reconstructible.  If `G=W^*W`, then

\[
 A^*A=D^{-1/2}GD^{-1/2},\qquad
 \boxed{P_0=1_{(0,\infty)}(D^{-1/2}GD^{-1/2}).}        \tag{2.7}
\]

## 3. Linear actual radical lift and polarized exterior matrix

For `t=8` and every rest label `t` in the locked set
`T_R={12,16,20,...} intersect [0,n_*)`, retain the exact source columns

\[
 c_t=e_t+\rho_te_0,qquad
 f_t=c_t-\alpha_tc_4
     =e_t-\alpha_te_4+b_te_0.                          \tag{3.1}
\]

The definition of `rho_t` gives `integral f_t=0`.  Moreover the arithmetic,
parity, anchor-deflation, and finite log-Fourier maps send `f_t` to the
actual column `W_t`.  Hence

\[
 f_x=x_8f_8+\sum_{t\in T_R}x_tf_t                    \tag{3.2}
\]

depends linearly on `x=(x_8,x_R)` and maps to `Wx`.

Let `psi_lambda` be the fixed invisible bump from the exact radical-leakage
theorem: it is even, supported in
`|u|<1/(2lambda)`, has `psi_lambda(0)=1`, and has zero integral.  Set

\[
 \widetilde f_x=f_x-f_x(0)\psi_\lambda.                \tag{3.3}
\]

Then `widetilde f_x(0)=integral widetilde f_x=0`, and the construction is
linear in `x`; evenness also gives the required quadratic origin zero.  On
the physical multiplicative window, `n u>=lambda^(-1)>1/(2lambda)` for
every integer `n>=1`.  Thus the bump is
invisible to every arithmetic sample, and (3.3) leaves `Wx` exactly
unchanged.

Let `S_+=(I+J)/2` be inversion symmetrization and set

\[
 {\cal K}x=S_+{\cal E}(\widetilde f_x),\qquad
 {\cal R}x={\cal K}x-Wx.                               \tag{3.4}
\]

Here the physical vector `Wx` is identified with its zero extension after
the locked finite projection.  The codimension-two Mellin identity makes
`cal K x` a global two-sided zero-evaluation radical.  Therefore, at both
paired zero slots,

\[
 Z{\cal R}x=-ZWx.                                      \tag{3.5}
\]

Polarization of the absolutely convergent compact-factor pairing gives the
Hermitian exterior matrix

\[
 \boxed{
 \Sigma={\cal W}_Z({\cal R},{\cal R})=W^*QW.}          \tag{3.6}
\]

Equation (3.6) includes the label-8 diagonal, the complete rest Gram, and
every label-8/rest cross entry.  It is independent of the chosen linear
radical representative because all such representatives have the same
paired zero evaluations.

There is also the exact paired-slot split

\[
 \boxed{
 \Sigma={\mathfrak A}-{\mathfrak E},\qquad
 {\mathfrak E}=2{\mathfrak A}^{\rm anti}\succeq0,}     \tag{3.7}
\]

where `mathfrak A` is the positive absolute exterior Gram.  The positive
sampling theorems control `mathfrak A` from above.  They do not control the
relative anti-aligned orientation in (3.7).

## 4. Raw congruence and exact label-8/rest blocks

Equations (2.5) and (3.6) give

\[
 H=D^{-1/2}(\Sigma-UG)D^{-1/2}.                        \tag{4.1}
\]

Consequently (2.6) is equivalent by congruence to

\[
 \boxed{
 \Sigma-UG\succeq
 \mu D^{1/2}P_0D^{1/2}.}                              \tag{4.2}
\]

This is the raw source/radical-tail form.  It is not obtained by replacing
the block-diagonal `D` with the unproved full exterior source Gram.

Write the normalized blocks as

\[
 H=\begin{pmatrix}\gamma_8&z^*\\z&H_R\end{pmatrix},
 \qquad
 P_0=\begin{pmatrix}\pi&\eta^*\\\eta&\Pi\end{pmatrix}.
                                                               \tag{4.3}
\]

Explicitly,

\[
 \gamma_8={\Sigma_{88}-UG_{88}\over D_8},             \tag{4.4}
\]

\[
 z=D_R^{-1/2}(\Sigma_{R8}-UG_{R8})D_8^{-1/2},          \tag{4.5}
\]

\[
 H_R=D_R^{-1/2}(\Sigma_{RR}-UG_{RR})D_R^{-1/2}.        \tag{4.6}
\]

Thus `gamma_8` is exactly the actual shifted signed Rayleigh quotient of
the singleton.  Neither convergence of `W_8` nor `D_8/d_8 -> 1` chooses the
sign of its radical-tail numerator.

For later use define the raw blocks of (4.2):

\[
 s_\mu=\Sigma_{88}-UG_{88}-\mu D_8\pi,                 \tag{4.7}
\]

\[
 c_\mu=\Sigma_{R8}-UG_{R8}
       -\mu D_R^{1/2}\eta D_8^{1/2},                   \tag{4.8}
\]

\[
 K_\mu=\Sigma_{RR}-UG_{RR}
       -\mu D_R^{1/2}\Pi D_R^{1/2}.                   \tag{4.9}
\]

The corresponding normalized quantities are

\[
 a_\mu=\gamma_8-\mu\pi,qquad
 r_\mu=z-\mu\eta,qquad
 C_\mu=H_R-\mu\Pi.                                   \tag{4.10}
\]

They satisfy

\[
 s_\mu=D_8a_\mu,\qquad
 c_\mu=D_R^{1/2}r_\mu D_8^{1/2},\qquad
 K_\mu=D_R^{1/2}C_\mu D_R^{1/2}.                      \tag{4.11}
\]

## 5. Exact singleton and rest Schur branches

### Theorem 5.1 (singleton-shorted growing-rest criterion)

For a declared real `mu`, the physical lower comparison
`B>=mu Delta` has the following exact branches.

1. If `s_mu>0`, then

   \[
   \boxed{
   B\succeq\mu\Delta
   \quad\Longleftrightarrow\quad
   K_\mu-{c_\mu c_\mu^*\over s_\mu}\succeq0.}        \tag{5.1}
   \]

   Equivalently,

   \[
   \boxed{
   H_R-\mu\Pi
   -{(z-\mu\eta)(z-\mu\eta)^*
      \over\gamma_8-\mu\pi}\succeq0.}                \tag{5.2}
   \]

2. If `s_mu=0`, then

   \[
   \boxed{
   B\succeq\mu\Delta
   \quad\Longleftrightarrow\quad
   c_\mu=0\ \hbox{ and }\ K_\mu\succeq0.}            \tag{5.3}
   \]

3. If `s_mu<0`, then `B>=mu Delta` is impossible.

**Proof.**  By (4.2), the relevant raw matrix is

\[
 F_\mu=\begin{pmatrix}s_\mu&c_\mu^*\\c_\mu&K_\mu\end{pmatrix}.
                                                               \tag{5.4}
\]

When `s_mu>0`, completing the square gives, for a singleton scalar `u` and
rest vector `y`,

\[
 \langle(u,y),F_\mu(u,y)\rangle
 =s_\mu\left|u+s_\mu^{-1}c_\mu^*y\right|^2
  +\left\langle y,
   \left(K_\mu-{c_\mu c_\mu^*\over s_\mu}\right)y
   \right\rangle.                                      \tag{5.5}
\]

This proves (5.1), and (4.11) gives (5.2).  If `s_mu=0`, positivity of every
two-dimensional principal compression forces `c_mu=0`, after which only
`K_mu>=0` remains.  A negative singleton diagonal is incompatible with
positivity, proving the last branch.  \(\square\)

There is an equivalent rest-pivot formulation which also covers a singular
rest block.  One has `F_mu>=0` if and only if

\[
 \boxed{
 C_\mu\succeq0,\qquad
 r_\mu\in\operatorname {ran}C_\mu,\qquad
 a_\mu\geq r_\mu^*C_\mu^\dagger r_\mu.}              \tag{5.6}
\]

When `a_mu>0`, define the quotient-relative internal cross load

\[
 \tau_\mu^2={r_\mu^*C_\mu^\dagger r_\mu\over a_\mu}. \tag{5.7}
\]

Subject to the range condition, (5.6) is `tau_mu<=1`.  If `P_0=I`, then
`pi=1`, `eta=0`, `Pi=I`, and (5.2) reduces to

\[
 H_R-\mu I-{zz^*\over\gamma_8-\mu}\succeq0.           \tag{5.8}
\]

### Minimal actual lower-frame target

The exact new analytic target is the existence of one `mu_0>0` and one
unbounded locked schedule on which the appropriate branch of Theorem 5.1
holds.  In the expected favorable singleton branch it is precisely

\[
 \boxed{
 \inf_{0\ne y\in X_R}
 {\langle y,K_{\mu_0}y\rangle
       -|c_{\mu_0}^*y|^2/s_{\mu_0}
  \over\|y\|^2}\geq0,
 \qquad s_{\mu_0}>0.}                                  \tag{5.9}
\]

The dimension of `X_R` grows with the transition inventory.  A favorable
singleton scalar and a small finite cross do not establish (5.9); the full
growing-rest lower frame is indispensable.

## 6. Weighted-PNT translation form of the missing covariance

The exact source normal form is

\[
 Q=c_*I+A_{\rm tail}-T_D,                               \tag{6.1}
\]

where

\[
 A_{\rm tail}=\int_0^\infty(2I-K_h)\rho_{\rm tail}(h)\,dh,
 \qquad
 T_D=\int_{[0,L]}K_h\,dD_\lambda(h),                   \tag{6.2}
\]

\[
 \rho_{\rm tail}(h)={e^{-5h/2}\over1-e^{-2h}}.        \tag{6.3}
\]

Thus

\[
 \boxed{
 \Sigma-UG=(c_*-U)G+W^*A_{\rm tail}W-W^*T_DW.}        \tag{6.4}
\]

For `v=A_Ry`, the normalized bare rest quadratic in (4.6) is exactly

\[
\begin{aligned}
 \langle y,H_Ry\rangle
={}&(c_*-U)\|v\|^2\\
 &+\int_0^\infty
   \{2\|v\|^2-\langle v,K_hv\rangle\}
     \rho_{\rm tail}(h)\,dh\\
 &-\int_{[0,L]}\langle v,K_hv\rangle\,dD_\lambda(h).
\end{aligned}                                           \tag{6.5}
\]

The polarized form of (6.5) supplies the label-8/rest cross in (4.8).  The
smallest uncontrolled arithmetic object is therefore the
`D_R`/`P_0`-relative signed Stieltjes translation covariance after the
singleton short.  Bounds for the absolute total variation of `D_lambda`,
or separate bounds for the three terms in (6.5), do not prove (5.9).

The cancellation-preserving Chebyshev-error identity gives an equivalent
correlation-profile expression.  The admitted P3 moments and endpoint
conditions alone allow arbitrary formal Hermitian entries, as proved in the
transported-kernel barrier.  They therefore do not choose the sign of
(6.5).

## 7. The known scalar shift is small only after whitening

On the checkpoint-0.93 schedule, the proved estimates are

\[
 |U|=o(d_6),\qquad
 M_8=\|A_8\|^2=O(d_8^{-1}),\qquad
 M_R=\|A_R\|^2=O(\lambda^{-2}d_8^{-1}),                \tag{7.1}
\]

and `d_6/d_8` is asymptotic to a positive constant times `lambda^(-4)`.
Consequently the three **whitened** scalar-shift blocks obey

\[
 \boxed{
 \|UA_8^*A_8\|=o(\lambda^{-4}),\qquad
 \|UA_R^*A_R\|=o(\lambda^{-6}),}                      \tag{7.2}
\]

\[
 \boxed{
 \|UA_R^*A_8\|=o(\lambda^{-5}).}                      \tag{7.3}
\]

The cross estimate is Cauchy--Schwarz.  Equations (7.2)--(7.3) say that the
known shift does not obstruct a fixed positive floor in normalized source
coordinates.  They make no assertion that the raw blocks `UG_88`, `UG_RR`,
or `UG_R8` have those sizes.  Raw and whitened shift estimates must not be
interchanged.

## 8. Sharp paired-slot nonimplication family

Fix a rest dimension `q>=1`, a rational `g>0`, and a rational
`-1<=epsilon<=1`.  Take

\[
 D=G=P_0=I_{q+1},\qquad U=0,                            \tag{8.1}
\]

and keep the positive absolute exterior Gram fixed as

\[
 {\mathfrak A}=\operatorname {diag}(g,I_q).             \tag{8.2}
\]

Define

\[
 \Sigma_\epsilon=\operatorname {diag}(g,\epsilon I_q),
 \qquad
 {\mathfrak E}_\epsilon
 ={\mathfrak A}-\Sigma_\epsilon
 =\operatorname {diag}(0,(1-\epsilon)I_q).             \tag{8.3}
\]

This is compatible with the exact paired-slot structure because

\[
 {\mathfrak A}^{\parallel}_\epsilon
 ={1\over2}({\mathfrak A}+\Sigma_\epsilon)\succeq0,
 \qquad
 {\mathfrak A}^{\rm anti}_\epsilon
 ={1\over2}({\mathfrak A}-\Sigma_\epsilon)\succeq0,  \tag{8.4}
\]

and `mathfrak E_epsilon=2 mathfrak A_epsilon^anti`.
Cholesky factors of the two positive matrices give an explicit paired-slot
feature realization.

All members have the same `D,G,P_0,mathfrak A`, the same singleton

\[
 \gamma_8=g,                                            \tag{8.5}
\]

and the same zero label-8/rest cross.  Nevertheless,

\[
 H_R=\epsilon I_q.                                      \tag{8.6}
\]

For positive `epsilon` tending rationally to zero, every member is positive
but no uniform rest floor exists.  A negative `epsilon` gives an indefinite
signed comparison while preserving all the positive data.  Thus absolute
sampling, a favorable singleton, and cross control do not imply the actual
growing-rest target.

This family is an abstract paired-slot implication countermodel.  It is not
asserted to arise from the actual prime locations, prolate transition
columns, or weighted-PNT discrepancy.

## 9. Relation to the radical-tower covariance results

The polynomial--Xi tower theorem studies the positive fixed-window
covariance

\[
 C=U_{\rm tower}^*K_TU_{\rm tower},                    \tag{9.1}
\]

not the signed exterior matrix `Sigma` in (3.6).  It proves that the
fixed-window covariance floor of the complete natural prefix collapses
faster than every fixed exponential in the prefix depth.  Therefore a
uniform fixed-window covariance lower frame cannot be used as a surrogate
for (5.9) on the complete prefix.

That result does not prove that the actual growing prolate rest floor fails.
Only fixed-depth tower statements transfer to the finite prolate schedule;
no admitted theorem transfers a whitened prefix whose depth grows with
`lambda` at its smallest Gram scale.  The two limiting operations do not
commute.

Likewise, the explicit transverse Xi radical has positive capture on every
fixed frequency window while its signed finite leakage is flat to every
algebraic order.  This shows that ordinary covariance capture does not
control signed leakage.  It does not compare that leakage with `d_8` or the
growing rest metric, and therefore proves neither success nor failure of
(5.9).

The common radical-leakage theorem applies directly at each finite stage and
gives (3.7).  Its exact lesson is that a new source-specific orientation
inequality is required.  In the present coordinates that inequality is
exactly the singleton-shorted signed rest frame (5.9), or equivalently the
rest-pivot conditions (5.6), on one unbounded schedule.

## 10. Final scope

The unconditional content is the exact source/radical-tail construction,
the noninjective quotient equivalence, the complete Schur branch theorem,
the weighted-PNT reformulation, the whitened shift ledger, and the abstract
nonimplication family.  The actual arithmetic inequality (5.9) remains
open.  No finite pilot value is used as a premise, and no actual signed
floor or downstream theorem is promoted.
