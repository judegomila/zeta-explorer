# Lower-Ritz post-far captured response and anchor-row barrier

## 0. Exact outcome and fail-closed boundary

Use the locked schedule

\[
 \lambda={p\over2},\qquad L=2\log\lambda,\qquad
 N=2^{9600\lambda^2},\qquad Q\leq C_0L.             \tag{0.1}
\]

Write the complete inversion-even source block and its genuine lower
two-vector Ritz shift as

\[
 Q_+=\begin{pmatrix}q&b^*\\b&A\end{pmatrix},\qquad
 u=\lambda_{\min}\left(
 Q_+|_{\operatorname {span}\{\kappa,b\}}\right),
 \qquad B=A-uI.                                      \tag{0.2}
\]

Every inverse below is conditional on the unproved strict branch

\[
 B\succ0.                                             \tag{0.3}
\]

Let `V_Q` be the exact full-exterior-white, endpoint-null physical prefix
synthesis, and let `F` be the frozen half-power far space.  In the notation
of the post-far theorem put

\[
 \widetilde V_Q=E_u i_QV_Q,\qquad
 \widehat P_Q=\widetilde V_Q^*B\widetilde V_Q,
 \qquad c_Q=\widetilde V_Q^*b.                       \tag{0.4}
\]

Thus `widehat P_Q` and `c_Q` are source-white coordinates for the exact
post-far captured block and its returned row.  They are not obtained by
dropping the far return.

The repaired anchor-to-far theorem and the prefix-to-far theorem now close
every far term in this captured row.  If

\[
 D_Q=V_Q^*BV_Q,\qquad
 G_Q=P_FB V_Q=P_FAV_Q,\qquad
 a_Q=V_Q^*b,                                         \tag{0.5}
\]

then

\[
 \boxed{
 \widehat P_Q=D_Q-G_Q^*H_u^{-1}G_Q,\qquad
 c_Q=a_Q-z_Q,\qquad
 z_Q=G_Q^*H_u^{-1}b_F.}                              \tag{0.6}
\]

Moreover,

\[
 \boxed{
 \|z_Q\|^2\leq\ell_Q\,b_F^*H_u^{-1}b_F
       =o(d_4L^2),}                                  \tag{0.7}
\]

and, with `alpha_Q~L/8`,

\[
 \boxed{
 D_Q\succeq\alpha_QI,\qquad
 (1-\delta_Q)D_Q\preceq\widehat P_Q\preceq D_Q,
 \qquad \delta_Q={\ell_Q\over\alpha_Q}=o(1).}      \tag{0.8}
\]

Consequently the desired captured inverse energy has the exact big-`O`
equivalence

\[
 \boxed{
 c_Q^*\widehat P_Q^{-1}c_Q=O(d_4L)
 \quad\Longleftrightarrow\quad
 a_Q^*D_Q^{-1}a_Q=O(d_4L).}                          \tag{0.9}
\]

Thus the far-return correction is no longer a captured-row blocker.  The
sole remaining captured inverse-energy input is the raw growing anchor row
in the actual prefix energy.  The convenient stronger estimate

\[
 \boxed{\|V_Q^*b\|^2=O(d_4L^2)}                     \tag{0.10}
\]

would prove (0.9), but is not frozen.

There is nevertheless a determinant-only conclusion, uniform at the actual
ground ridge.  For `s>=0`, put

\[
 H_{u+s}=H_u+sI_F,\qquad
 E_{u+s}y=(y,-H_{u+s}^{-1}\Gamma y),\qquad
 \widetilde V_{Q,s}=E_{u+s}i_QV_Q,                   \tag{0.11}
\]

and, for an uncentered Mellin Riesz row `h_z`, put

\[
 \widehat P_{Q,s}=\widetilde V_{Q,s}^*(B+sI)
                    \widetilde V_{Q,s},\qquad
 c_{Q,s}=\widetilde V_{Q,s}^*b,\qquad
 m_{Q,s,z}=\widetilde V_{Q,s}^*h_z,                  \tag{0.12}
\]

\[
 {\cal O}_{Q,s}(z)=m_{Q,s,z}^*\widehat P_{Q,s}^{-1}c_{Q,s}.
                                                               \tag{0.13}
\]

At `s=0`, these are the objects in (0.4) and the unshifted captured
response.  For general `s`, (0.13) is the exact captured summand after far
elimination at `B+sI`; it includes both the returned forcing row and the
returned Mellin row.  In particular it applies to the actual determinant
ridge `s=h=u-mu>=0`.

Let

\[
 \alpha_{\lambda,N}=\|P_Nk_\lambda^+\|.
\]

For every fixed compact `Omega` with

\[
 \eta=\max_{z\in\Omega}|\operatorname {Im}z|< {1\over2},            \tag{0.14}
\]

the frozen positive-sampling and Mellin metrics give

\[
 \boxed{
 \alpha_{\lambda,N}\sup_{s\geq0}\sup_{z\in\Omega}
       |{\cal O}_{Q,s}(z)|
 \leq {C_\Omega\alpha_{\lambda,N}K_{\Delta,Q}
           \over\alpha_Q-\ell_Q}
 \left\{ {U_ZC_{\rm pos}(\lambda)M_\Omega(L)\over d_8}
 \right\}^{1/2}=o(1),}                              \tag{0.15}
\]

where

\[
 C_{\rm pos}=O(\lambda^3P(\lambda)),\qquad
 U_Z=o(d_6),\qquad {d_6\over d_8}=\Theta(\lambda^{-4}).             \tag{0.16}
\]

`P` is one fixed polylogarithmic factor,
`K_(Delta,Q)=O(1)`, `alpha_Q-ell_Q` is asymptotic to `L/8`, and

\[
 \alpha_{\lambda,N}=\mathfrak a_4\|p_4\|
 \longrightarrow\mathfrak a_4A_4\in(0,\infty),
 \qquad \mathfrak a_4={\sqrt3\over2^{11/4}}.          \tag{0.17}
\]

Thus the source-normalized captured determinant summand is already small
on every fixed strict Mellin strip, uniformly for every nonnegative ridge.
This is strictly weaker than the captured inverse-energy target.  It does
not control the far or retained summands of the full determinant response.

The fixed complete Toeplitz coefficients predict (0.10), but they do not
prove it for `Q=O(L)`.  The growing outer theorem is compressed on both
sides by the endpoint-null map `J_Q`; it supplies no one-sided physical
anchor row.  The structured full/block bridge preserves the exact metric
and range, but cannot adjoin the missing anchor.  Section 6 records the
minimal augmented theorem and the endpoint-row obstruction precisely.

This note proves (0.6)--(0.9) and (0.15).  It does not prove (0.10), the
full inverse row, the retained response, either strict sector sign on the
actual unbounded schedule, equation (5.2) of `DIRECT_RH_ATTACK.md`, a
determinant limit, a zero statement, or RH.  The formal state remains
`P0_INVALIDATED`, and the standard eight are unchanged.

## 1. Frozen inputs

Only the following exact repository bytes are used.

| Dependency | SHA-256 |
|---|---|
| `notes/LOWER_RITZ_POST_FAR_RETAINED_INVERSE_ROW_THEOREM.md` | `9288ac25216781416d0bb1d0ef7d2a11f3dd09bac8e8f04195ac9b3e928229f3` |
| `tests/test_lower_ritz_post_far_retained_inverse_row_theorem.py` | `8f2aa9cb6daca472d75a890520c23dfd1b5dcb487e8454b1c12b598b61a58327` |
| `notes/LOWER_RITZ_RESIDUAL_INVERSE_SPREAD_DETERMINANT_SPLIT_THEOREM.md` | `0e905dbb849d1a7cbf9a8906831d9c192c75bd953c10bf13329ea94dcee788a3` |
| `tests/test_lower_ritz_residual_inverse_spread_determinant_split_theorem.py` | `8cc310388b33f6ee075060f56c3b084867c68f66cae8aee64567ab9cab11e36b` |
| `notes/FIXED_ANCHOR_BV_CAUCHY_FAR_ROW_THEOREM.md` | `59395e5d184c93e3e56c935028c5fba322a0f30476bd9db1c99585c056876c79` |
| `tests/test_fixed_anchor_bv_cauchy_far_row_theorem.py` | `905dae5ca5489665dea4bfa1309d062fbd2769a529674b6c10d380a3f3627e3e` |
| `notes/GROWING_LOW_PREFIX_PHYSICAL_COFRAME_HALF_POWER_SCHUR_BARRIER.md` | `1f37e551fe37a9274961032386aa995d98d45a0c88b8622cb39ad25ff9cfb032` |
| `tests/test_growing_low_prefix_physical_coframe_half_power_schur_barrier.py` | `e31ae1d17c4d0df595b022d74ea6b8894ad45588d9693a1c7a318aa2874212aa` |
| `notes/GROWING_LOW_PREFIX_HALF_POWER_FAR_CROSS_THEOREM.md` | `c0428b5c0ab43719b8e82b24ff21f7c40ebfde978ddb8d4185f92abb633ab55f` |
| `tests/test_growing_low_prefix_half_power_far_cross_theorem.py` | `be358852f5f5749e25aca722a18cfb081b8c36bab7aeed74343b624d49ef0569` |
| `notes/LOWER_RITZ_HALF_POWER_ONE_INVERSE_SOURCE_ANGLE_REDUCTION.md` | `aed972d7f32b599179c0f769a6255401cd0127c7ba9dec4340494e73815b3dce` |
| `tests/test_lower_ritz_half_power_one_inverse_source_angle_reduction.py` | `27b8284faefe471934d40ca0937bdba4cb4a764b7aa1597559fd1cc0c774a9ed` |
| `notes/WEAK_RESIDUAL_SAMPLING_REDUCTION.md` | `b0254889d35ae41a92ee926dd116b473ee427e2762f8853903f4e80e307860ed` |
| `tests/test_weak_residual_duality.py` | `0f1f9847497b63b6b2c9e4b9f267dd8157ab71547f80b127d65cbda16af9d659` |
| `notes/GROWING_ANCHOR_ROW_FULL_METRIC_TOEPLITZ_INVERSE_ENERGY_BARRIER.md` | `b5da4b84a6c67c96220cb0fd25b3fec152e01f7ec4c357aea0bd5de986af0178` |
| `tests/test_growing_anchor_row_full_metric_toeplitz_inverse_energy_barrier.py` | `408d8bf2ccfdd116f5a0df8b17c1f0bcda2d4c227c896192f739ad4bc9255e0b` |
| `notes/FIXED_PREFIX_COMPLETE_SIGNED_TOEPLITZ_SCHUR_THEOREM.md` | `c69d6d1a69f71548aa9291c5d261117ac913f2851df8f8fcc2f186c8bd530314` |
| `tests/test_fixed_prefix_complete_signed_toeplitz_schur_theorem.py` | `4f704f58524b9f4818db8bd1884009be9f4074fd303e2ec1cca5be5c74f70f87` |
| `notes/GROWING_LOW_PREFIX_OUTER_FLOOR_ASSEMBLY_THEOREM.md` | `23346f54002c8a39df46df7f1e7d9b688f2b2eb967ae772c74c6ae378d5b31a0` |
| `tests/test_growing_low_prefix_outer_floor_assembly_theorem.py` | `634d956aa2639466a1137cbbd5d4abed062dd50ecbd7269b63e38a8c65b98311` |
| `notes/STRUCTURED_FULL_BLOCK_EXTERIOR_METRIC_QUOTIENT_BRIDGE_THEOREM.md` | `ad11c56795dd721f09b4bdfce286c69ba8825867ccf03e3a127e27957f93aa86` |
| `tests/test_structured_full_block_exterior_metric_quotient_bridge_theorem.py` | `bd772ad22906038480061226b9271ecfb76b3b5099065e6ae7b958d2d423095d` |
| `notes/FIXED_SOURCE_BLOCK_SHIFT_ASYMPTOTIC_THEOREM.md` | `04bfad2525191ca42d84a38427655c9c2ee1eff5ec0df2d8699ce0ec2b9abf83` |
| `tests/test_fixed_source_block_shift_asymptotic_theorem.py` | `433c695bdb4cdb589cee0212274f0d8b6dda38bb2844421b4367dd702f0545e5` |
| `notes/PHYSICAL_LEVERAGE_SHORTED_SCHUR.md` | `39147b7fcd5c71304c6977272b72a3f07a789b7c4fb34d2e2ebf51e3b60589f3` |
| `tests/test_physical_leverage_shorted_schur.py` | `4bc5d051a3793bcc85b5867180f6ea6ac084d6653229d5825af6185773985305` |

The post-far and determinant-split theorems supply the exact two
eliminations, actual nonnegative ground ridge, and mandatory source
normalization.  The repaired
anchor theorem closes the separate far forcing energy.  The physical
coframe and far-cross pairs supply the prefix floor, exact quotient metric,
and `o(L)` far loss.  The one-inverse reduction supplies the complete
positive-sampling and Mellin metric rows.  The weak residual note supplies
the normalized rank-one sampling domination and `U_Z=o(d_6)`.  The final
four geometric pairs fix the exact range/congruence boundary, fixed Toeplitz
coefficients, growing compressed floor, and full/block metric bridge.
The final two normalization pairs identify the determinant source factor
with `mathfrak a_4||p_4||` and prove its finite nonzero limit on the locked
exponential schedule.

## 2. Exact source-white post-far coordinates

Write the half-power decomposition as `K=Y direct-sum F` and let

\[
 B=\begin{pmatrix}D&\Gamma^*\\\Gamma&H_u\end{pmatrix},\qquad
 E_uy=(y,-H_u^{-1}\Gamma y).                         \tag{2.1}
\]

Then

\[
 \Sigma_u=E_u^*BE_u=D-\Gamma^*H_u^{-1}\Gamma,
 \qquad \beta=E_u^*b=b_Y-\Gamma^*H_u^{-1}b_F.       \tag{2.2}
\]

Let `i_Q` include the physical prefix `K_Q` into `Y`.  Since `V_Q` is a
bijection from its source support onto `K_Q`, define

\[
 \widetilde V_Q=E_ui_QV_Q.                            \tag{2.3}
\]

Congruencing (2.2) gives

\[
 \widehat P_Q=V_Q^*i_Q^*\Sigma_ui_QV_Q
              =\widetilde V_Q^*B\widetilde V_Q,      \tag{2.4}
\]

\[
 c_Q=V_Q^*i_Q^*\beta=\widetilde V_Q^*b.             \tag{2.5}
\]

Put `G_Q=Gamma i_Q V_Q`.  The scalar shift has no cross block, so the
far-cross theorem gives

\[
 G_Q=P_FB V_Q=P_FAV_Q.                               \tag{2.6}
\]

Equations (2.2)--(2.6) prove (0.6).  Notice that `c_Q` is not `V_Q^*b`
and is not obtained by projecting the raw forcing before the far solve.

## 3. The far return is negligible at the captured scale

The quotient polar identity in the frozen far-cross theorem gives

\[
 \ell_Q=\|H_u^{-1/2}G_Q\|^2=o(L).                   \tag{3.1}
\]

The repaired fixed-anchor theorem gives

\[
 b_F^*H_u^{-1}b_F=o(d_4L).                           \tag{3.2}
\]

Therefore

\[
 \begin{aligned}
 \|z_Q\|^2
 &=\|G_Q^*H_u^{-1}b_F\|^2\\
 &\leq\|H_u^{-1/2}G_Q\|^2
        \|H_u^{-1/2}b_F\|^2\\
 &=\ell_Q\,b_F^*H_u^{-1}b_F=o(d_4L^2),
 \end{aligned}                                       \tag{3.3}
\]

which proves (0.7).  Both little-`o` factors are used: after division by
`d_4L^2`, the right side is the product of `ell_Q/L` and the normalized
far energy.

The frozen shifted prefix floor is

\[
 D_Q=V_Q^*BV_Q\succeq\alpha_QI,
 \qquad \alpha_Q={L\over8}-o(\lambda^{-4})\asymp L. \tag{3.4}
\]

Since

\[
 0\preceq G_Q^*H_u^{-1}G_Q\preceq\ell_QI
 \preceq{\ell_Q\over\alpha_Q}D_Q,                  \tag{3.5}
\]

equation (0.8) follows.  In particular,

\[
 D_Q^{-1}\preceq\widehat P_Q^{-1}
 \preceq(1-\delta_Q)^{-1}D_Q^{-1}.                  \tag{3.6}
\]

Also, by (3.3)--(3.4),

\[
 z_Q^*D_Q^{-1}z_Q
 \leq{\|z_Q\|^2\over\alpha_Q}=o(d_4L).            \tag{3.7}
\]

If `a_Q^*D_Q^(-1)a_Q=O(d_4L)`, use `c_Q=a_Q-z_Q`,
(3.6), and the triangle inequality in the `D_Q^(-1)` norm to obtain the
left side of (0.9).  Conversely, if the left side of (0.9) holds, then

\[
 \|c_Q\|_{D_Q^{-1}}^2
 \leq\|c_Q\|_{\widehat P_Q^{-1}}^2=O(d_4L),         \tag{3.8}
\]

and `a_Q=c_Q+z_Q` with (3.7) gives the right side.  This proves the exact
big-`O` equivalence (0.9).

Finally, (3.4) shows that (0.10) implies the right side of (0.9).  The
inverse-weighted row in (0.9), not the ordinary norm row in (0.10), is the
minimal remaining statement for the captured inverse energy.

## 4. The source-normalized captured Mellin response is uniformly small

The determinant uses `B+hI`, not merely `B`.  We therefore retain an
arbitrary ridge `s>=0`.  Relative to the same `Y direct-sum F` splitting,

\[
 B+sI=
 \begin{pmatrix}D+sI_Y&\Gamma^*\\
                 \Gamma&H_{u+s}\end{pmatrix},
 \qquad H_{u+s}=H_u+sI_F.                            \tag{4.1}
\]

The cross block `Gamma` is independent of `s`.  The harmonic graph in
(0.11) gives the exact identities

\[
 \begin{aligned}
 \widehat P_{Q,s}
  &=D_Q+sV_Q^*V_Q-G_Q^*H_{u+s}^{-1}G_Q,\\
 c_{Q,s}
  &=a_Q-z_{Q,s},
 \qquad z_{Q,s}=G_Q^*H_{u+s}^{-1}b_F.
 \end{aligned}                                      \tag{4.2}
\]

Functional calculus gives, uniformly for `s>=0`,

\[
 H_{u+s}^{-1}\preceq H_u^{-1},\qquad
 H_{u+s}^{-2}\preceq H_u^{-2}.                      \tag{4.3}
\]

Consequently

\[
 \|H_{u+s}^{-1/2}G_Q\|^2\leq\ell_Q,
 \qquad b_F^*H_{u+s}^{-1}b_F
              \leq b_F^*H_u^{-1}b_F,                \tag{4.4}
\]

and the exact far-return estimate is

\[
 \boxed{
 \|z_{Q,s}\|^2
 \leq\ell_Q b_F^*H_u^{-1}b_F=o(d_4L^2)
 \quad(s\geq0).}                                    \tag{4.5}
\]

The positive ridge term in (4.2), (3.4), and (4.4) imply

\[
 \boxed{
 \widehat P_{Q,s}\succeq(\alpha_Q-\ell_Q)I,
 \qquad
 \sup_{s\geq0}\|\widehat P_{Q,s}^{-1}\|
 \leq{1\over\alpha_Q-\ell_Q}=O(L^{-1}).}          \tag{4.6}
\]

Thus no monotonicity of the returned row is assumed: its exact resolvent is
retained in (4.2), while (4.4)--(4.6) give the uniform bounds needed below.

Let

\[
 \Delta=\Delta_L\oplus I_{{\cal K}_H}
\]

be the frozen global one-power physical metric.  Since
`F subset K_H`, its restriction to `K_L direct-sum F` is exactly
`Delta_L direct-sum I_F`.  The ridged harmonic pullback is

\[
 \Delta_{Y,s}=E_{u+s}^*\Delta E_{u+s}.               \tag{4.7}
\]

On the prefix, the orthogonality of the low and far metric pieces gives

\[
 i_Q^*\Delta_{Y,s}i_Q
 =i_Q^*\Delta_Li_Q
  +(H_{u+s}^{-1}\Gamma_Q)^*(H_{u+s}^{-1}\Gamma_Q)
 \preceq i_Q^*\Delta_{Y,0}i_Q.                      \tag{4.8}
\]

The physical-coframe theorem and the closed far loss therefore give

\[
 i_Q^*\Delta_{Y,s}i_Q
 \preceq K_{\Delta,Q}\Delta_Q,
 \qquad
 K_{\Delta,Q}=(1-\varepsilon_L)^{-1}
                 +{\ell_Q\over G_R}=O(1).           \tag{4.9}
\]

Because `V_Q` is source-white in the quotient metric,

\[
 V_Q^*\Delta_QV_Q=I.                                \tag{4.10}
\]

Equations (0.11), (4.9), and (4.10) imply the uniform lift bound

\[
 \boxed{
 \widetilde V_{Q,s}^*\Delta\widetilde V_{Q,s}
 \preceq K_{\Delta,Q}I\quad(s\geq0).}              \tag{4.11}
\]

Let `Z` be the complete positive paired-zero sampling analysis and put
`G_Z=Z^*Z`.  The frozen one-power theorem gives

\[
 G_Z\preceq C_{\rm pos}\Delta,
 \qquad C_{\rm pos}=O(\lambda^3P(\lambda)).        \tag{4.12}
\]

The weak residual identity is written there in normalization-free
variables as `cc^*<=epsilon_lambda G_Z`, with `c=ab` and
`U_Z=epsilon_lambda/a^2`.  Dividing by the nonzero anchor normalization
gives the exact normalized inequality

\[
 \boxed{bb^*\preceq U_ZG_Z.}                       \tag{4.13}
\]

Pull (4.12)--(4.13) back by `widetilde V_(Q,s)` and use (4.11):

\[
 c_{Q,s}c_{Q,s}^*
 \preceq U_Z\widetilde V_{Q,s}^*G_Z\widetilde V_{Q,s}
 \preceq U_ZC_{\rm pos}K_{\Delta,Q}I.             \tag{4.14}
\]

Since the left side has only one nonzero eigenvalue,

\[
 \boxed{
 \sup_{s\geq0}\|c_{Q,s}\|^2
 \leq U_ZC_{\rm pos}K_{\Delta,Q}.}                \tag{4.15}
\]

This estimate is too weak for (0.10): relative to `d_4L^2`, its current
upper scale retains positive powers of `lambda`.  It is nevertheless
sufficient for a compact Mellin response.

The frozen Mellin row inequality is

\[
 h_zh_z^*\preceq
 C_\Omega{M_\Omega(L)\over d_8}\Delta.             \tag{4.16}
\]

Pulling (4.16) back by `widetilde V_(Q,s)` and using (4.11) gives

\[
 \boxed{
 \sup_{s\geq0}\|m_{Q,s,z}\|^2\leq
 C_\Omega K_{\Delta,Q}{M_\Omega(L)\over d_8}.}     \tag{4.17}
\]

Equations (4.6), (4.15), and (4.17) prove the exact-factor bound

\[
 \boxed{
 \sup_{s\geq0}|{\cal O}_{Q,s}(z)|
 \leq {C_\Omega K_{\Delta,Q}\over\alpha_Q-\ell_Q}
 \left\{{U_ZC_{\rm pos}M_\Omega(L)\over d_8}\right\}^{1/2}.}
                                                               \tag{4.18}
\]

For a compact strip with height `eta`,

\[
 M_\Omega(L)\leq C_\Omega L\lambda^{2\eta}.        \tag{4.19}
\]

Since `alpha_Q-ell_Q` is asymptotic to `L/8`, the square of the right
side of (4.18) is

\[
 o\!\left(
 {\lambda^{-1+2\eta}P(\lambda)\over L}
 \right)=o(1)                                       \tag{4.20}
\]

because `eta<1/2` and `P` is polylogarithmic.  This includes the real
compact case, where `M_Omega(L)=L`.

It remains to restore the mandatory source normalization.  The exact
source/physical anchor identity and the locked fixed-source convergence
give

\[
 \alpha_{\lambda,N}
 =\mathfrak a_4\|p_4\|\longrightarrow
  \mathfrak a_4A_4\in(0,\infty),
 \qquad \mathfrak a_4={\sqrt3\over2^{11/4}}.         \tag{4.21}
\]

Thus `alpha_(lambda,N)=O(1)`, and multiplying (4.18) by this exact factor
proves (0.15).  In particular, setting `s=h=u-mu` proves that the captured
summand in the coefficient-normalized ground correction is `o(1)` locally
uniformly on every strict Mellin strip.

No norm of a harmonic lift was inserted.  Both the sampling row and the
Mellin row were pulled through the same exact ridged lift before the prefix
inverse was taken.  The conclusion concerns this captured summand only;
the far and retained response terms remain separate.

## 5. Why the raw inverse row remains open

The fixed complete Toeplitz theorem gives, for each fixed modal depth, an
anchor/rest Toeplitz matrix with quarter floor.  Its anchor coefficient
row is square summable, and its fixed-depth Schur cost is `O(d_4L)`.
However, every error and threshold in that theorem depends on the fixed
depth.  It gives no bound when `Q=O(L)`.

The structured full/block bridge does solve a different problem.  It
preserves the exact growing full exterior metric under endpoint shear and
compares it to the declared block metric without a growing condition-number
loss.  It does not add `kappa` to the anchor-deflated physical range and it
does not estimate the form row `V_Q^*b`.

Likewise, the growing outer floor has the exact form

\[
 \widehat\Sigma_{N,Q}^\#\succeq {L\over8}I          \tag{5.1}
\]

only after compression on both sides by the endpoint-null, full-metric-white
map `J_Q`.  Its underlying Toeplitz theorem explicitly supplies no
uncompressed pure-label remainder estimate.  Hence it proves `D_Q>=cLI`
but not the one-sided anchor row (0.10).

The repaired fixed-anchor theorem closes `b_F`, which lives in the
super-exponential Fourier tail.  The captured row lives in the low physical
prefix, so the `R^(-1/2)` tail gain used there is absent.

## 6. Audit of the augmented anchor/endpoint-null route

There are two exact obstructions to treating an augmented anchor row as an
already proved congruence.

First, the physical prefix has range in `kappa^perp`.  Adjoining `kappa`,
or the unscaled `p_4`, is a genuine range enlargement.  Neither endpoint
shear nor full-metric whitening can perform that enlargement.

Second, endpoint compression is two-sided in the frozen theorem.  Before
compression a typical boundary remainder has the factorized form

\[
 E_{\rm end}=\boldsymbol\epsilon u^*
             +u\boldsymbol\epsilon^*,
 \qquad \boldsymbol\epsilon^*J_Q=0.                 \tag{6.1}
\]

It follows that

\[
 J_Q^*E_{\rm end}J_Q=0,                              \tag{6.2}
\]

but for an anchor coordinate `x` one has

\[
 x^*E_{\rm end}J_Q
 =(x^*\boldsymbol\epsilon)u^*J_Q,                   \tag{6.3}
\]

which need not vanish.  Endpoint nullity of the right-hand rest therefore
does not prove the one-sided anchor/rest remainder estimate.

The exact endpoint-nullization from the repaired anchor theorem,

\[
 g_4=c_4-\theta s_8,\qquad
 p_4=Tg_4+\theta W_8,\qquad \theta=O(\lambda^{-4}), \tag{6.4}
\]

does not evade either issue.  The physical image `Tg_4` has a nonzero
anchor component and is not in the anchor-deflated prefix range, while
`W_8` is the retained non-endpoint-null singleton.  Applying the growing
outer theorem to `[g_4,C_Q^#]` would therefore be a new augmented-range
theorem, not an application of the frozen `J_Q` compression.

The minimal missing theorem can be stated without coordinates as the
one-row inverse estimate in (0.9).  In source-white coordinates it is

\[
 \boxed{
 (V_Q^*b)^*(V_Q^*BV_Q)^{-1}(V_Q^*b)=O(d_4L).}       \tag{6.5}
\]

A stronger but convenient augmented Toeplitz theorem would prove (0.10).
An augmented Schur theorem could instead establish (6.5) directly.  Any
such theorem must carry the actual physical anchor, the endpoint row in
(6.3), the full pulled-back exterior metric, and the complete signed form
uniformly for `Q=O(L)`.

## 7. Strict stopping line

The captured part now has two different statuses.

1.  Its source-normalized determinant-only Mellin response tends to zero
    uniformly on every fixed compact strict strip and every ridge `s>=0`
    by (0.15), hence in particular at the actual ridge `s=h`.
2.  Its inverse energy is equivalent to the raw growing anchor row (6.5),
    which is not implied by fixed Toeplitz coefficients, endpoint-null
    compression, the structured metric bridge, or the repaired far row.

The twice-harmonic retained inverse row and retained Mellin response remain
separate and open.  No conclusion here removes either strict lower-Ritz
sign required by the determinant route.

## 8. Reproduction

Run

    python3 -B -m unittest \
      tests.test_lower_ritz_post_far_captured_response_anchor_row_barrier -v

The regression checks every frozen hash, the exact far-return identities,
the multiplicative post-far floor, the inverse-energy equivalence, the
uniform ridged positive-sampling/Mellin response estimate, the exact source
normalization, the strict-strip exponent, the one-sided endpoint-row
obstruction, displayed TeX, and ASCII hygiene.
