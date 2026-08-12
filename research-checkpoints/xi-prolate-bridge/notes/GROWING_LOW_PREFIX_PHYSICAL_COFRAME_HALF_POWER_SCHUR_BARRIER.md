# Growing low-prefix physical coframe and half-power Schur barrier

## 0. Exact consequence and fail-closed boundary

Use the locked schedule

\[
 \lambda={p\over2},\qquad L=2\log\lambda,\qquad
 N=2^{9600\lambda^2},\qquad R=\sqrt N,\qquad
 Q\leq C_0L.                                           \tag{0.1}
\]

Let \(W_Q^\#\) be the exact compact, anchor-deflated physical synthesis
underlying the strict-PASS low-prefix matrix
\(\widehat\Sigma_{N,Q}^\#\).  Its columns use the exact endpoint shear and
the exact full exterior metric \(D_Q^\#\).  On the support of that metric put

\[
 V_Q=W_Q^\#(D_Q^\#)^{-1/2},\qquad
 {\cal K}_Q=\operatorname {ran}V_Q.                    \tag{0.2}
\]

Relative to the normalized physical anchor \(\kappa\), write

\[
 Q_+=\begin{pmatrix}q&b^*\\ b&A\end{pmatrix}
 \quad\hbox{on}\quad {\mathbb C}\kappa\oplus{\cal K},
 \qquad {\cal K}=H_+\cap\kappa^\perp,                 \tag{0.3}
\]

and let \(u\) be the genuine lower two-vector Ritz value.  Thus

\[
 B_u=A-uI,\qquad u\leq q\leq U_Z.                      \tag{0.4}
\]

The low-prefix floor has the following exact physical consequences.

1.  The map \(V_Q\) is injective.  Thus its source support projection is
    the identity, and the low-prefix physical range has the same dimension
    as the admitted source quotient.

2.  If

    \[
     \Delta_Q=(V_QV_Q^*)^\dagger\big|_{{\cal K}_Q},     \tag{0.5}
    \]

    then

    \[
     \boxed{
     P_{{\cal K}_Q}B_uP_{{\cal K}_Q}
      \succeq a_{u,Q}\Delta_Q,
     \qquad a_{u,Q}={L\over8}-o(\lambda^{-4})>0.}       \tag{0.6}
    \]

3.  The same signed floor forces the quantitative physical coframe

    \[
     \boxed{V_Q^*V_Q\succeq c{L\over\lambda^2}I.}       \tag{0.7}
    \]

    Together with the frozen synthesis upper bound, this gives

    \[
     \boxed{
     c d_8 I_{{\cal K}_Q}\preceq\Delta_Q
       \preceq C{\lambda^2\over L}I_{{\cal K}_Q}.}      \tag{0.8}
    \]

These are genuine new consequences of the signed prefix theorem.  They do
not identify \({\cal K}_Q\) with the retained half-power space \(Y\), and
they do not make \({\cal K}_Q\) reducing for \(B_u\).

At the half-power split, the exact normalized far-return loss on the prefix
is

\[
 \boxed{
 \ell_Q=\left\|H_u^{-1/2}\Gamma_Q
                    \Delta_Q^{-1/2}\right\|^2,}        \tag{0.9}
\]

with the notation fixed below.  Prefix positivity after far elimination
requires \(\ell_Q<a_{u,Q}\); retaining the conductor-size reserve asks for
\(\ell_Q=o(L)\).  Equivalently, the natural sufficient source-white cross
target is

\[
 \boxed{\|P_FB_uV_Q\|=o(\sqrt{G_RL})
                    =o(\lambda\sqrt L).}              \tag{0.10}
\]

The frozen absolute cross bound does not prove (0.10).  An exact two by two
family below has the low-prefix floor, the frozen-scale high floor, an
absolute cross much smaller than the frozen allowance, and even a vanishing
far shear, while its Schur short is negative.

Even if (0.10) is later proved, the retained complement
\(R_Q=Y\ominus{\cal K}_Q\) remains uncontrolled.  Section 7 gives the exact
generalized Schur criterion on that complement.  No present theorem supplies
its signed floor.  Consequently neither \(B_u\succ0\),
\(Q_--uI\succ0\), nor the genuine source angle

\[
 \Sigma_u\succeq\theta_\lambda\Delta_Y>0              \tag{0.11}
\]

follows.  Equation (5.2) of `DIRECT_RH_ATTACK.md`, a determinant limit, a
zero statement, and the Riemann hypothesis remain open.  The formal state is
`P0_INVALIDATED`, and the standard eight are unchanged.

## 1. Frozen inputs

The proof uses the following exact repository bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_LOW_PREFIX_OUTER_FLOOR_ASSEMBLY_THEOREM.md` | `23346f54002c8a39df46df7f1e7d9b688f2b2eb967ae772c74c6ae378d5b31a0` |
| `tests/test_growing_low_prefix_outer_floor_assembly_theorem.py` | `634d956aa2639466a1137cbbd5d4abed062dd50ecbd7269b63e38a8c65b98311` |
| `notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md` | `6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9` |
| `tests/test_growing_transition_complete_central_form_reduction.py` | `a842fdd24e095cde5af373060f9017e03bb13df1db5ecf6f6374c4fbcf6743de` |
| `notes/STRUCTURED_FULL_BLOCK_EXTERIOR_METRIC_QUOTIENT_BRIDGE_THEOREM.md` | `ad11c56795dd721f09b4bdfce286c69ba8825867ccf03e3a127e27957f93aa86` |
| `tests/test_structured_full_block_exterior_metric_quotient_bridge_theorem.py` | `bd772ad22906038480061226b9271ecfb76b3b5099065e6ae7b958d2d423095d` |
| `notes/LOWER_RITZ_HALF_POWER_ONE_INVERSE_SOURCE_ANGLE_REDUCTION.md` | `aed972d7f32b599179c0f769a6255401cd0127c7ba9dec4340494e73815b3dce` |
| `tests/test_lower_ritz_half_power_one_inverse_source_angle_reduction.py` | `27b8284faefe471934d40ca0937bdba4cb4a764b7aa1597559fd1cc0c774a9ed` |
| `notes/LOCKED_HALF_POWER_GRAPH_SCHUR_REDUCTION.md` | `1d900d615aaa21845f8413b9677286901bf41855d43c7df5c6fecea88f06a1b1` |
| `notes/SIGNED_QUOTIENT_CAPTURE_REDUCTION.md` | `9700501a367ea7ae2b843ee61b45bec3970fc35db1715613099b08439be0415c` |
| `tests/test_signed_quotient_capture.py` | `1beba57f1ec9ef16d582dab4198da61cf90476249fd897ab68c909ece340f428` |
| `notes/FIXED_LABEL_EIGHT_ARITHMETIC_SYNTHESIS_GAIN.md` | `9e98b870419a721c8797e7577b6edf18649e50f6c9fe6f727dae61a53d6d7f71` |
| `tests/test_fixed_label_eight_arithmetic_synthesis_gain.py` | `88c14ee4a2dfa9d2a9de33a615a4fd3601bb23e6393ca2a278ac34ba15cfc1de` |
| `notes/GROWING_REST_SIGNED_RADICAL_TAIL_SCHUR_REDUCTION.md` | `000be1947a8cc22e7f96a080b8775ce0343fbeb36f886929c7ea5188191e0932` |
| `tests/test_growing_rest_signed_radical_tail_schur_reduction.py` | `3a28e4ae33896fa14ad2f68bf8fa5de71abf49d1b62bcc8a95d6751cbd306970` |
| `notes/BLOCK_QUOTIENT_ACTION_THEOREM.md` | `31c4239b2dec0114be7b8e9b42e52ebc6361130461d1225e05c81ff5b26369d4` |
| `tests/test_block_quotient_action.py` | `64a436a48fafbb481d7691f086ca1b49ed3fd692d90d08489a95d513df129b64` |

Only finite-dimensional linear algebra is added below.  No new external
source is used.

## 2. Exact source-to-physical map

Let \({\cal X}_Q\) be the support of \(D_Q^\#\).  The complete-central
construction and the low-prefix restriction give

\[
 \boxed{
 \widehat\Sigma_{N,Q}^\#=V_Q^*AV_Q.}                  \tag{2.1}
\]

This is the actual compact-projected signed matrix, not the unprojected
outer model.  The strict-PASS floor is

\[
 V_Q^*AV_Q\succeq {L\over8}I_{{\cal X}_Q}.            \tag{2.2}
\]

If \(V_Qx=0\), equations (2.1)--(2.2) give
\(0\geq(L/8)\|x\|^2\).  Thus \(x=0\), proving injectivity.

For \(v=V_Qx\), the minimum-energy quotient identity is now

\[
 \boxed{\langle v,\Delta_Qv\rangle=\|x\|^2.}          \tag{2.3}
\]

Congruencing (2.2) through the bijection
\(V_Q:{\cal X}_Q\longrightarrow{\cal K}_Q\) proves

\[
 P_{{\cal K}_Q}AP_{{\cal K}_Q}
 \succeq {L\over8}\Delta_Q.                           \tag{2.4}
\]

The endpoint shear causes no mismatch here.  Let \(I_Q\) insert the
low-prefix raw coefficients into the complete anchor-deflated transition
source.  Before or after applying the same full shear one has

\[
 W_Q^\#=W_L^\#I_Q,\qquad
 D_Q^\#=I_Q^*D_{L,{\rm full}}^\#I_Q.                  \tag{2.5}
\]

Thus the prefix norm is the restriction of the exact full source norm; no
diagonal or block metric has been substituted in (2.1).

## 3. The genuine lower-Ritz shift and the forced coframe

Only the positive part of \(u\) can erode (2.2).  Since
\(u\leq q\leq U_Z\),

\[
 u_+:=\max(u,0)\leq U_Z.                               \tag{3.1}
\]

The full-metric bridge, the endpoint-shear quotient invariance, and the
sharp physical synthesis estimates give

\[
 \|V_Q\|^2\leq {M_8+M_R\over1-\varepsilon_L}
 =O(d_8^{-1}),\qquad \varepsilon_L=O(\lambda^{-4}).   \tag{3.2}
\]

The admitted shift and fixed-index defect ratio are

\[
 U_Z=o(d_6),\qquad
 {d_6\over d_8}\sim {7\over32\pi^2}\lambda^{-4}.    \tag{3.3}
\]

Therefore

\[
 u_+\|V_Q\|^2=o(\lambda^{-4}).                        \tag{3.4}
\]

Subtracting the exact scalar Gram from (2.2) gives

\[
 \begin{aligned}
 V_Q^*B_uV_Q
 &=V_Q^*AV_Q-uV_Q^*V_Q\\
 &\succeq
 \left\{{L\over8}-u_+\|V_Q\|^2\right\}I
 =a_{u,Q}I,
 \end{aligned}                                       \tag{3.5}
\]

which proves (0.6).

The finite source-Cauchy bounds at the locked outer cutoff give

\[
 \|B_u\|=O(\lambda^2).                                 \tag{3.6}
\]

Indeed \(\|Q_+\|=O(\log N)=O(\lambda^2)\), while a Ritz value obeys
\(|u|\leq\|Q_+\|\).  For every \(x\in{\cal X}_Q\), equations
(3.5)--(3.6) imply

\[
 a_{u,Q}\|x\|^2
 \leq\langle V_Qx,B_uV_Qx\rangle
 \leq\|B_u\|\,\|V_Qx\|^2.                            \tag{3.7}
\]

This proves (0.7).  The nonzero eigenvalues of \(V_QV_Q^*\) and
\(V_Q^*V_Q\) coincide.  Combining their lower bound from (0.7) with the
upper bound (3.2) and inverting proves (0.8).

## 4. Nested quotient comparison

Let \(\Delta_{L,{\rm full}}\) be the minimum-energy physical quotient for
all admitted anchor-deflated transition columns in the exact full exterior
metric.  If \(v\in{\cal K}_Q\), the full source has every prefix
representation available and may have more.  Hence

\[
 \langle v,\Delta_{L,{\rm full}}v\rangle
 \leq\langle v,\Delta_Qv\rangle.                     \tag{4.1}
\]

The structured full/block bridge gives

\[
 (1-\varepsilon_L)\Delta_L
 \preceq\Delta_{L,{\rm full}}
 \preceq(1+\varepsilon_L)\Delta_L.                   \tag{4.2}
\]

Consequently, as quadratic forms restricted to \({\cal K}_Q\),

\[
 \boxed{
 \Delta_Q\succeq\Delta_{L,{\rm full}}
 \succeq(1-\varepsilon_L)\Delta_L.}                  \tag{4.3}
\]

Thus (0.6) is already much stronger than a constant source-angle floor on
the unshorted prefix.  The remaining issue is not the prefix quotient; it is
the return through the far solve and the untouched retained directions.

## 5. Exact half-power return on the prefix

Use the allowed half-power construction with

\[
 F\subset{\cal K}_L^\perp,\qquad
 {\cal K}=Y\oplus F,qquad {\cal K}_Q\subset{\cal K}_L\subset Y.
                                                               \tag{5.1}
\]

Relative to this split write

\[
 B_u=\begin{pmatrix}D_u&\Gamma_u^*\\
                     \Gamma_u&H_u\end{pmatrix},
 \qquad
 \Sigma_u=D_u-\Gamma_u^*H_u^{-1}\Gamma_u.           \tag{5.2}
\]

The high theorem was frozen at \(U_Z\).  Since a scalar shift has no cross
block and \(u\leq U_Z\),

\[
 H_u=H_{U_Z}+(U_Z-u)I\succeq G_RI,
 \qquad \Gamma_u=\Gamma_{U_Z},                        \tag{5.3}
\]

where

\[
 G_R=4800(\log2)\lambda^2+o(\lambda^2).              \tag{5.4}
\]

Let \(i_Q:{\cal K}_Q\longrightarrow Y\) be inclusion and put

\[
 \Gamma_Q=\Gamma_ui_Q,\qquad
 {\cal L}_{F,Q}=\Gamma_Q^*H_u^{-1}\Gamma_Q.          \tag{5.5}
\]

By definition of (0.9),

\[
 {\cal L}_{F,Q}\preceq\ell_Q\Delta_Q.               \tag{5.6}
\]

Equations (0.6) and (5.2) therefore give

\[
 \boxed{
 i_Q^*\Sigma_ui_Q\succeq(a_{u,Q}-\ell_Q)\Delta_Q.}  \tag{5.7}
\]

The harmonic lift is

\[
 E_uy=(y,-H_u^{-1}\Gamma_uy),\qquad
 \Delta_Y=E_u^*\Delta E_u,
 \qquad \Delta=\Delta_L\oplus I_{{\cal K}_L^\perp}. \tag{5.8}
\]

Because \(i_Q{\cal K}_Q\subset{\cal K}_L\) and
\(H_u^{-1}\Gamma_Q{\cal K}_Q\subset F\subset{\cal K}_L^\perp\),

\[
 i_Q^*\Delta_Yi_Q
 =i_Q^*\Delta_Li_Q
  +(H_u^{-1}\Gamma_Q)^*(H_u^{-1}\Gamma_Q).           \tag{5.9}
\]

Functional calculus and (5.3) give

\[
 H_u^{-2}\preceq G_R^{-1}H_u^{-1}.                   \tag{5.10}
\]

Combining (4.3), (5.6), and (5.9)--(5.10) yields

\[
 \boxed{
 i_Q^*\Delta_Yi_Q\preceq
 \left\{(1-\varepsilon_L)^{-1}+{\ell_Q\over G_R}\right\}
 \Delta_Q.}                                           \tag{5.11}
\]

If \(\ell_Q<a_{u,Q}\), equations (5.7) and (5.11) prove the restricted
harmonic angle

\[
 \boxed{
 i_Q^*\Sigma_ui_Q\succeq\theta_{Q,u}i_Q^*\Delta_Yi_Q,
 \quad
 \theta_{Q,u}={a_{u,Q}-\ell_Q\over
 (1-\varepsilon_L)^{-1}+\ell_Q/G_R}.}                \tag{5.12}
\]

If \(\ell_Q=o(L)\), then \(\theta_{Q,u}\sim L/8\); in the convention
\(0<\theta_\lambda\leq1\), the prefix alone would permit
\(\theta_\lambda=1\).

For the following norm identity, the domains are

\[
 \Gamma_Q=\Gamma_ui_Q:{\cal K}_Q\longrightarrow F,
 \qquad V_Q:{\cal X}_Q\longrightarrow{\cal K}_Q.     \tag{5.13a}
\]

A singular-value decomposition of \(V_Q\) gives the exact quotient-cross
norm identity

\[
 \boxed{
 \|\Gamma_Q\Delta_Q^{-1/2}\|
 =\|P_FB_uV_Q\|=\|P_FAV_Q\|.}                        \tag{5.13}
\]

The last equality holds because the scalar shift has no cross block.  Thus
the sharp weighted target is

\[
 \|H_u^{-1/2}P_FAV_Q\|=o(\sqrt L),                   \tag{5.14}
\]

and (0.10) is its natural sufficient consequence from \(H_u\succeq G_RI\).

## 6. The cross bounds frozen here do not close the short

The inputs frozen in this note do not prove (5.14).  In detail, their
Cauchy-form cross estimate is only

\[
 \|\Gamma_u\|\leq K_{\lambda,N}=O(\lambda^2).        \tag{6.1}
\]

Since

\[
 \|\Delta_Q^{-1/2}\|^2=\|V_Q\|^2=O(d_8^{-1}),       \tag{6.2}
\]

equations (5.3), (6.1), and (6.2) give only

\[
 \ell_Q\leq {K_{\lambda,N}^2\over G_R}
                 \|\Delta_Q^{-1/2}\|^2
 =O(\lambda^2d_8^{-1}),                               \tag{6.3}
\]

which is far larger than \(L\).

The gap is logically sharp.  Let \(a,G,\tau>0\) and put

\[
 B(a,G,\tau)=
 \begin{pmatrix}a&\gamma\\ \gamma&G\end{pmatrix},
 \qquad \gamma^2=(a+\tau)G.                           \tag{6.4}
\]

The low compression is \(a>0\), the high compression has floor \(G\), and

\[
 {\gamma\over G}=\sqrt{{a+\tau\over G}}.             \tag{6.5}
\]

Thus the far shear tends to zero whenever \(a=o(G)\).  Nevertheless,

\[
 \boxed{
 a-{\gamma^2\over G}=-\tau<0,
 \qquad \det B(a,G,\tau)=-\tau G<0.}                 \tag{6.6}
\]

Taking \(a=L/8\) and \(G\asymp\lambda^2\) gives
\(\gamma\asymp\lambda\sqrt L=o(\lambda^2)\).  Hence this family satisfies
an absolute cross estimate stronger than the frozen \(O(\lambda^2)\)
allowance while its exact Schur short is negative.  It is a finite logical
countermodel to the proposed implication, not an assertion about the actual
prolate--Weil matrix.

## 7. The untouched retained complement

The low prefix cannot exhaust \(Y\).  Let

\[
 R_Q=Y\ominus{\cal K}_Q.                               \tag{7.1}
\]

Indeed the raw even Fourier space below the half-power boundary has
dimension \(R+1\).  Its intersection with \(\kappa^\perp\) has dimension at
least \(R\), is orthogonal to \(F\), and hence lies in \(Y\).  Therefore

\[
 \dim Y\geq R=\sqrt N,
 \qquad \dim{\cal K}_Q\leq Q+1=O(L).                 \tag{7.2}
\]

No onto coframe from the low prefix to \(Y\) is possible on this schedule.

Fix a candidate \(\theta>0\) and form

\[
 T_\theta=\Sigma_u-\theta\Delta_Y.                    \tag{7.3}
\]

Relative to \(Y={\cal K}_Q\oplus R_Q\), write

\[
 T_\theta=
 \begin{pmatrix}P_\theta&C_\theta^*\\
                 C_\theta&R_\theta\end{pmatrix}.     \tag{7.4}
\]

The generalized Schur theorem gives the exact criterion

\[
 \boxed{
 \begin{aligned}
 T_\theta\succeq0\quad\Longleftrightarrow\quad
 &R_\theta\succeq0,\\
 &\operatorname {ran}C_\theta
      \subseteq\operatorname {ran}R_\theta,\\
 &P_\theta-C_\theta^*R_\theta^\dagger C_\theta
      \succeq0.
 \end{aligned}}                                       \tag{7.5}
\]

Suppose a future prefix--far theorem gives

\[
 P_\theta\succeq\rho L\Delta_Q                     \tag{7.6}
\]

for a fixed \(\rho>0\).  Subject to the first two conditions in (7.5), a
sufficient cross condition is

\[
 C_\theta^*R_\theta^\dagger C_\theta
 \preceq\rho L\Delta_Q.                               \tag{7.7}
\]

The cancellation-preserving scale for an \(o(L)\) erosion is

\[
 \boxed{
 \|R_\theta^{\dagger/2}C_\theta
       \Delta_Q^{-1/2}\|=o(\sqrt L).}                 \tag{7.8}
\]

No frozen theorem proves \(R_\theta\succeq0\), its range condition, or
(7.8).  This failure persists even with perfect prefix--far decoupling.  On
\({\mathbb R}e_Q\oplus{\mathbb R}e_R\oplus{\mathbb R}e_F\), take

\[
 B=\operatorname {diag}(a,-\tau,G),
 \qquad a,\tau,G>0.                                    \tag{7.9}
\]

The prefix has floor \(a\), the far block has floor \(G\), and every cross
vanishes, but the retained direction \(e_R\) is negative.  Thus neither a
prefix coframe nor the frozen far theorem can replace the missing signed
theorem on \(R_Q\).

## 8. Consequence for the two strict signs

Since \(H_u>0\), half-power congruence gives

\[
 B_u\succ0\quad\Longleftrightarrow\quad\Sigma_u\succ0. \tag{8.1}
\]

The low-prefix theorem proves only a positive compression of \(B_u\).  The
inputs frozen in this note do not prove (5.14), and Section 7 leaves the
retained complement open even if (5.14) is later discharged.  Hence they do
not promote the compression through (8.1).  The odd operator \(Q_--uI\)
acts in the other inversion phase; none of the maps in Sections 2--7 has odd
range.  Its strict sign is therefore an independent open obligation.

The earliest exact next analytic inputs are:

1. the prefix--far cross theorem (5.14), or its exact weighted form
   \(\ell_Q=o(L)\);
2. a signed retained-complement floor \(R_\theta\succeq0\) at the desired
   \(\theta_\lambda\), including the range condition in (7.5); and
3. the cancellation-preserving retained cross estimate (7.8).

Only after these three statements could the even source-angle theorem be
assembled.  A separate odd-phase theorem would still be required for the
second strict sign.

## 9. Reproduction

Run

    python3 -B -m unittest \
      tests.test_growing_low_prefix_physical_coframe_half_power_schur_barrier -v

The regression checks every frozen hash, the source/physical quotient
identities, genuine-shift exponent, forced singular-value scale, exact
half-power loss, both countermodels, generalized Schur criterion, displayed
TeX, ASCII hygiene, and the fail-closed scope.
