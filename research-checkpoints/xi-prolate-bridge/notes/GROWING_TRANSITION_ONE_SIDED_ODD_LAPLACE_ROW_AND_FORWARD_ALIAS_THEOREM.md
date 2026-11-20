# Growing-transition one-sided odd-Laplace row and forward-alias theorem

## 0. Exact result and scope

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 c=2\pi\lambda^2,\qquad L=2\log\lambda,\qquad
 h={\pi\over4}.                                      \tag{0.1}
\]

The first admitted family is the fixed-linear narrow region

\[
 A_1>0,\qquad C>0,\qquad0<\epsilon<2h,\qquad
 hC+\left(5h+{3\epsilon\over2}\right)A_1<1.        \tag{0.2}
\]

with realized same-plus-phase modal parameters

\[
 \alpha_i=(A_1+C)L+a_i+O(L^{-1}),\qquad
 \beta_j=A_1L+b_j+O(L^{-1}).                        \tag{0.3F}
\]

The second admitted family is the polylogarithmic-base schedule

\[
 B_L=(\log L)^4,\qquad0<hC<1,\qquad
 \alpha_i=CL+B_L+a_i+O(L^{-1}),\qquad
 \beta_j=B_L+b_j+O(L^{-1}),\qquad
 b_*:=\min_jb_j>0.                                  \tag{0.3P}
\]

In both displays the offsets are fixed.  Let `d_gamma=1-chi_gamma^2`, let
`z_gamma=e_gamma/sqrt(d_gamma)`, and put

\[
 J_\gamma=K\!\left(\sqrt{1-\gamma/c}\right).
                                                               \tag{0.4}
\]

The realized modal theorem gives, uniformly on both fixed node sets,

\[
 (\chi_\gamma z_\gamma)^2
 ={\pi c\over2\lambda J_\gamma}\{1+o(1)\},\qquad
 J_\gamma\asymp L,\qquad \chi_\gamma=1+o(1).       \tag{0.5}
\]

For

\[
 I_L=\left\{z=3,5,\ldots:
 z\leq{cK_0\log L\over L}\right\},                 \tag{0.6}
\]

the physical one-sided local rows obey

\[
 \boxed{
 |\widehat{\mathcal A}^{1}_{z,\alpha_i}|
 \leq {C L^{K_1}e^{h\alpha_i}\over\sqrt{cJ_{\alpha_i}}},
 \qquad
 |\widehat{\mathcal B}^{1}_{z,\beta_j}|
 \leq {C L^{K_1}\over\sqrt{cJ_{\beta_j}}}.}        \tag{0.7}
\]

The hat in (0.7) means exact exterior-defect whitening.  The constants
are uniform in `z in I_L` and on the fixed node sets.  These are
one-sided row estimates, not consequences inferred from the already
proved two-sided Cauchy product.

The exact ordered higher-outward-sampler row additionally satisfies

\[
 \boxed{
 |\widehat{\mathcal B}^{\,+}_{z,\beta_j}|
 \leq {C L\over \sqrt{J_{\beta_j}}\,z}.}             \tag{0.8}
\]

Consequently, for every fixed-dimensional realized packet subspace `E`,

\[
 \boxed{
 \left\|P_E\sum_{z\in I_L}
 \mathsf S(\widehat{\mathcal A}^{1,{\rm high}}_z,
            \widehat{\mathcal B}^{\,+,{\rm low}}_z)P_E
 \right\|
 \leq {L^{K_2}e^{h\alpha_{\max}}\over\sqrt c}
 =o(\tau_L),}                                        \tag{0.9}
\]

where

\[
 \mathsf S(U,V)=U^*V+V^*U,\qquad
 \tau_L={c^{hC+o(1)}\over L^{2m}}.                  \tag{0.10}
\]

Define the exact fixed-node diagonal radial factors

\[
 (D_H)_{ii}=\sqrt{\lambda\over4c}(1+\chi_{\alpha_i})z_{\alpha_i},
 \qquad
 (D_L)_{jj}=\sqrt{\lambda\over4c}\chi_{\beta_j}z_{\beta_j}.
                                                               \tag{0.10a}
\]

For the forward mixed high--low block `R_phys`, define its raw block by
the exact diagonal dewhitening

\[
 R_{\rm raw}:=D_H^{-1}R_{\rm phys}D_L^{-1}.          \tag{0.10b}
\]

Both diagonal systems have norm and smallest singular value comparable
to `L^(-1/2)`, with bounded fixed-node condition number.  Hence (0.9)
implies

\[
 o\!\left({e^{hCL}\over L^{2m-1}}\right)            \tag{0.11}
\]

for the raw fixed-node block.  Thus the forward mixed edge--alias block is
not the same-scale canceller of the local Cauchy matrix.

The proof uses the actual positive finite-Fourier phase, the exact direct
profile, and the ordered unweighted Poisson limit.  It does not identify a
finite-Fejer coefficientwise split.  The invisible-origin correction is
included for the slots occurring in (0.9); its contribution is lower
order.  No estimate is asserted here for the reverse mixed block
`A^(+,high)` against `B^(1,low)`, for the inward higher-Fourier bump tower,
or for the complete `(+,+)` curved/hard block.  Hence no completed
continuous sign, complete central sign, determinant conclusion, RH
statement, or Lambda bound follows.  The project state remains
`P0_INVALIDATED`.

## 1. Frozen inputs

The following repository bytes are binding inputs.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_CONTINUOUS_M11_TWO_CLUSTER_UNCONDITIONAL_NARROW_SCHEDULE_THEOREM.md` | `6e0678b8d0d762b79402ad0f6947ddcfa8b830c251b333f58c9fe5ea7ebe7a5c` |
| `tests/test_growing_transition_continuous_m11_unconditional_narrow_schedule.py` | `626dc9f12cf7a4b58246e12f1b008d72bf9bb0e60713a0a10f6b5dda2e66eb34` |
| `notes/GROWING_TRANSITION_TWO_CLUSTER_MODAL_PLACEMENT_LEAKAGE_NORMALIZATION_THEOREM.md` | `7859533dd83b94708ee73658e6b6c94eb78418a333082c875f0629b244efe564` |
| `tests/test_growing_transition_two_cluster_modal_placement_leakage_normalization_theorem.py` | `caef856880cbc01e95b45209a5dc1a41d669c43a9f868552e6b7d33fd2e0cc8c` |
| `notes/TRANSITION_PROLATE_OUTER_THEOREM.md` | `215f27adc0453f601ced419bd39910cb821c31b2e77678b63874987510f4f9c6` |
| `tests/test_transition_prolate_outer.py` | `bc03f010254e0b56c800b1fc4dfb38cd7ea17a0ebc1133064f751d6eab08b433` |
| `notes/GROWING_TRANSITION_SAMPLING_THEOREM.md` | `551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72` |
| `tests/test_growing_transition_sampling.py` | `ba9ee58e36bc79a602d70a791010a93eb75a5613b0509a0cdc7b11b810a403ac` |
| `notes/GROWING_TRANSITION_CONTINUOUS_ODD_LAPLACE_COMMON_REPRESENTATIVE_BARRIER.md` | `7e65dd6a5cf9035054f01bf52126e25e00635c0414f1a0dc69e70fc2e6ba6a74` |
| `tests/test_growing_transition_continuous_odd_laplace_common_representative_barrier.py` | `d3369b104aa2ebdfa685c2ae5d1529c55b1702d442b6dd81d5569294f42f1140` |

No new external source, zero table, prime estimate, or numerical prolate
data is used.

## 2. Exact one-sided physical coordinates

Let `h_gamma` be a selected unit compact prolate mode, let `H_gamma` be
its additive Fourier transform, and set

\[
 e_\gamma=h_\gamma(\lambda),\qquad
 z_\gamma={e_\gamma\over\sqrt{d_\gamma}}.           \tag{2.1}
\]

All selected labels are divisible by four.  Their finite-Fourier phase is
therefore positive, and on the band

\[
 H_\gamma(u)=\chi_\gamma h_\gamma(u),qquad |u|\leq\lambda.
                                                               \tag{2.2}
\]

Use the normalized inward and outward edge solutions

\[
 \begin{aligned}
 h_\alpha(\lambda(1-U/c))&=e_\alpha p_\alpha(U),
       &&0\leq U\leq U_L:=c-2\pi,\\
 H_\beta(\lambda(1+V/c))&=\chi_\beta e_\beta q_\beta(V),
       &&V\geq0.
 \end{aligned}                                       \tag{2.3}
\]

Thus `p_alpha(0)=q_beta(0)=1`.  The equations are the frozen curved edge
equations with signs `(-,-alpha)` and `(+,beta)`, respectively.

The exact local direct-profile rows are

\[
 \begin{aligned}
 \widehat{\mathcal A}^{1}_{z,\alpha}
 &= {\sqrt\lambda(1+\chi_\alpha)z_\alpha\over2c}
    \int_0^{U_L}p_\alpha(U)(1-U/c)^{z-1}\,dU,\\
 \widehat{\mathcal B}^{1}_{z,\beta}
 &= {\sqrt\lambda\chi_\beta z_\beta\over2c}
    \int_0^\infty q_\beta(V)(1+V/c)^{-z}\,dV.
 \end{aligned}                                       \tag{2.4}
\]

For the first line set `U=c(1-e^(-s))`; for the second set
`V=c(e^t-1)`.  The powers `z-1` and `-z` in (2.4) include the exact
Jacobians.  Replacing either by an informal `e^(-zU/c)` before this change
of variables would lose one power at the hard endpoint.

## 3. Uniform inward row lemma

The flat regular solution and its Laplace row are

\[
 w_\gamma(x)=e^{ix}
 {}_1F_1\!\left({1\over2}-{i\gamma\over4};1;-2ix\right),
                                                               \tag{3.1}
\]

\[
 W_\gamma(\rho)=\int_0^\infty e^{-\rho x}w_\gamma(x)\,dx
 ={1\over\sqrt{1+\rho^2}}
 \exp\!\left\{-{\gamma\over2}\arctan{1\over\rho}\right\}.
                                                               \tag{3.2}
\]

In particular,

\[
 |W_{-\alpha}(\rho)|\leq e^{h\alpha},\qquad
 |W_\beta(\rho)|\leq1.                              \tag{3.3}
\]

Let `K_*` be large enough for all polynomial losses in the frozen Lemma
2.1 and the allowed-carrier variation estimates.  Given a fixed desired
inverse-logarithmic accuracy `N`, choose

\[
 R=L^P,\qquad P>2(N+K_*+4).                          \tag{3.4}
\]

For large `L`, this satisfies

\[
 8(1+\alpha)\leq R\leq c^{1/2-\delta},qquad
 e^{h\alpha}L^{K_*}{LR+\log(2+R)\over c}\leq{1\over2}
                                                               \tag{3.5}
\]

for some fixed `delta>0`.  In the fixed-linear family, (0.2) implies

\[
 \delta_0:=1-h(A_1+C)>0.                             \tag{3.6}
\]

In the polylogarithmic family the corresponding margin is
`1-h*C+o(1)>0`.  These are exactly the two conditions which absorb the
second action factor in (3.7).

On `[0,R]`, frozen Lemma 2.1 gives

\[
 \int_0^R|p_\alpha-w_{-\alpha}|\,dU
 \leq L^{K_*}e^{2h\alpha}{R^{3/2}\over c}.          \tag{3.7}
\]

For `U<=R=o(c)`, with `rho_-=(z-1)/c`, Taylor's theorem gives

\[
 \left|(1-U/c)^{z-1}-e^{-\rho_-U}\right|
 \leq C{zU^2\over c^2}.                             \tag{3.8}
\]

The flat envelope and (3.8) cost at most

\[
 C L^{K_*}e^{h\alpha}{zR^{5/2}\over c^2}.           \tag{3.9}
\]

The frozen flat carrier estimate gives

\[
 \left|\int_R^\infty e^{-\rho_-U}w_{-\alpha}(U)\,dU\right|
 \leq C L^{K_*}{e^{h\alpha}\over\sqrt R}.          \tag{3.10}
\]

On `[R,U_L]`, put `P_alpha=sqrt(a_-)p_alpha`, where
`a_-(U)=2U-U^2/c`.  Lemma 2.1 supplies the initial state at `R`.
Diagonalizing the allowed equation gives two carriers whose sup norms and
total variations are at most `L^(K_*)e^(h*alpha)`.  One Stieltjes
integration by parts against

\[
 {(1-U/c)^{z-1}\over\sqrt{a_-(U)}}                 \tag{3.11}
\]

therefore gives

\[
 \left|\int_R^{U_L}p_\alpha(U)(1-U/c)^{z-1}\,dU\right|
 \leq C L^{K_*}{e^{h\alpha}\over\sqrt R}
      +C L^{K_*}e^{h\alpha}{A^{1-z}\over\sqrt c}. \tag{3.12}
\]

The last term is the retained hard-endpoint boundary:

\[
 1-{U_L\over c}={2\pi\over c}={1\over A}.           \tag{3.13}
\]

It is not silently discarded.  Combining (3.2) and (3.7)--(3.13) yields

\[
\begin{aligned}
 &\left|\int_0^{U_L}p_\alpha(U)(1-U/c)^{z-1}\,dU
       -W_{-\alpha}\!\left({z-1\over c}\right)\right|\\
 &\quad\leq C L^{K_*}\left\{
 {e^{h\alpha}\over\sqrt R}
 +{e^{2h\alpha}R^{3/2}\over c}
 +{e^{h\alpha}zR^{5/2}\over c^2}
 +{e^{h\alpha}A^{1-z}\over\sqrt c}\right\}.
\end{aligned}                                               \tag{3.14}
\]

Uniformly for `z in I_L`, (3.4), (3.6), and
`z<=c*K_0*log(L)/L` make the right side
`O_N(e^(h*alpha)*L^(-N))`.  This proves the inward half of (0.7).

## 4. Uniform outward row lemma

Put `rho_+=z/c`.  On `[0,R]`, Lemma 2.1 with `gamma=beta>=0` has no
forbidden-action factor:

\[
 \int_0^R|q_\beta-w_\beta|\,dV
 \leq L^{K_*}{R^{3/2}\over c}.                       \tag{4.1}
\]

Likewise,

\[
 \left|(1+V/c)^{-z}-e^{-\rho_+V}\right|
 \leq C{zV^2\over c^2},\qquad V\leq R.             \tag{4.2}
\]

The flat and curved allowed-carrier integrations by parts give

\[
 \left|\int_R^\infty e^{-\rho_+V}w_\beta(V)\,dV\right|
 +\left|\int_R^\infty q_\beta(V)(1+V/c)^{-z}\,dV\right|
 \leq {C L^{K_*}\over\sqrt R}.                     \tag{4.3}
\]

There is no boundary at infinity: `z>=3`, the algebraic weight tends to
zero, and the carrier amplitude has bounded variation.  Thus

\[
\begin{aligned}
 &\left|\int_0^\infty q_\beta(V)(1+V/c)^{-z}\,dV
       -W_\beta\!\left({z\over c}\right)\right|\\
 &\quad\leq C L^{K_*}\left\{
 {1\over\sqrt R}+{R^{3/2}\over c}
                  +{zR^{5/2}\over c^2}\right\}
 =O_N(L^{-N})
\end{aligned}                                               \tag{4.4}
\]

uniformly for `z in I_L`.  Equations (0.5), (2.4), (3.3), (3.14), and
(4.4) now give (0.7), with the more precise principal rows

\[
 \begin{aligned}
 \widehat{\mathcal A}^{1}_{z,\alpha}
 &= {1+\chi_\alpha\over2\chi_\alpha}
    \sqrt{\pi\over2cJ_\alpha}\,
    W_{-\alpha}\!\left({z-1\over c}\right)\{1+o(1)\}
    +O_N\!\left({e^{h\alpha}L^{-N}\over\sqrt{cJ_\alpha}}\right),\\
 \widehat{\mathcal B}^{1}_{z,\beta}
 &=\sqrt{\pi\over8cJ_\beta}\,
    W_\beta\!\left({z\over c}\right)\{1+o(1)\}
    +O_N\!\left({L^{-N}\over\sqrt{cJ_\beta}}\right).
 \end{aligned}                                       \tag{4.5}
\]

The radial-mass errors in (4.5) remain explicit `1+o(1)` factors; they are
not promoted to arbitrary inverse powers of `L`.  Formula (4.5) is used
only as a uniform row estimate; it does not exchange the odd-row sum with
a growing limit.  More precisely, the frozen radial formula contributes
`O(log(L)/L)` on every fixed-linear node and on the polylogarithmic high
nodes.  On the polylogarithmic low nodes it contributes
`O(log(log(L))/(log(L))^4)`.

## 5. Exact higher-outward-sampler estimate

After the ordered unweighted Poisson limit at fixed `lambda`, the exact
direct-profile alias row is

\[
 \widehat{\mathcal B}^{\,+}_{z,\beta}
 ={\sqrt\lambda\over2\sqrt{d_\beta}}
 \int_0^\infty
 \sum_{l\geq2}H_\beta(l\lambda e^t)e^{-(z-1)t}\,dt.
                                                               \tag{5.1}
\]

This is precisely the complete sampled exterior series in the frozen
transition-prolate outer theorem, not the different deterministic
fixed-product alias operator.  With

\[
 A_\beta={|e_\beta|\over\pi},\qquad
 K=2\pi\lambda^3,                                    \tag{5.2}
\]

that theorem gives, for `u>=lambda`,

\[
 \left|\sum_{l\geq2}H_\beta(lu)\right|
 \leq {28A_\beta\over u}
 \left\{1+\log\left(2+{K\over u}\right)\right\}.
                                                               \tag{5.3}
\]

Put `u=lambda*e^t`.  Since `K/lambda=c`, (5.1)--(5.3) imply

\[
 \begin{aligned}
 |\widehat{\mathcal B}^{\,+}_{z,\beta}|
 &\leq {14|z_\beta|\over\pi\sqrt\lambda}
 \int_0^\infty e^{-zt}
 \{1+\log(2+ce^{-t})\}\,dt\\
 &\leq {14|z_\beta|\over\pi\sqrt\lambda}
 {1+\log(c+2)\over z}.
 \end{aligned}                                       \tag{5.4}
\]

The exact modal normalization gives

\[
 {|z_\beta|\over\pi\sqrt\lambda}
 ={1+o(1)\over\chi_\beta\sqrt{J_\beta}},           \tag{5.5}
\]

so (5.4) proves (0.8).  No estimate uniform in a finite Fejer cutoff is
claimed: the direct split (5.1) is formed only after the prescribed
ordered limit.

## 6. Invisible-origin correction in the forward slots

Let a fixed `q`-mode source-null combination be

\[
 g=\sum_na_nh_n,\qquad D(a)=\sum_nd_n|a_n|^2,
 \qquad \int_{\mathbb R}g=0.                        \tag{6.1}
\]

The admitted source is

\[
 f(x)=g(x)-a_0\psi(2\lambda x),\qquad a_0=g(0).      \tag{6.2}
\]

The frozen corrected-sampling theorem gives

\[
 |a_0|^2\leq qV_0(\lambda)D(a),\qquad
 V_0(\lambda)={1\over\lambda}+8\pi\lambda.         \tag{6.3}
\]

The compact bump in (6.2) is supported in
`|x|<1/(2*lambda)`.  Hence it vanishes at every argument
`lambda*e^(-s)>=1/lambda` in the local inward compact slot.  Its Fourier
transform is

\[
 H_{\rm bump}(y)={a_0\over2\lambda}
 \widehat\psi\!\left({y\over2\lambda}\right).       \tag{6.4}
\]

For `D(a)=1` and fixed `q`, (6.3)--(6.4) give

\[
 |\widehat{\mathcal A}^{H,1}_{z,{\rm bump}}|
 +|\widehat{\mathcal B}^{H,1}_{z,{\rm bump}}|
 \leq {C_{\psi,q}\over z}.                         \tag{6.5}
\]

Schwartz decay also gives, for any fixed `M>=3`,

\[
 \sum_{l\geq2}
 \left|\widehat\psi(le^t/2)\right|
 \leq C_{\psi,M}e^{-Mt},                            \tag{6.6}
\]

and therefore

\[
 |\widehat{\mathcal B}^{\,+}_{z,{\rm bump}}|
 \leq {C_{\psi,q}\over z}.                         \tag{6.7}
\]

Equations (6.5)--(6.7) cover exactly the correction slots used in the
forward block (0.9).  They make no claim for the inward higher-Fourier
sum inside `A^+`; that sum belongs to the reverse/`(+,+)` frontier.

## 7. Summation and the strict conductor gap

For fixed-dimensional row maps, compression cannot increase the norm and

\[
 \|\mathsf S(U,V)\|\leq2\|U\|\,\|V\|.              \tag{7.1}
\]

Moreover,

\[
 \sum_{z\in I_L}{1\over z}
 \leq {1\over2}\log\!\left({cK_0\log L\over L}\right)+C
 =O(L).                                               \tag{7.2}
\]

Since `J_alpha` and `J_beta` are both comparable to `L`, (0.7), (0.8),
and (7.2) give

\[
 \left\|P_E\sum_{z\in I_L}
 \mathsf S(\widehat{\mathcal A}^{1,{\rm high}}_z,
            \widehat{\mathcal B}^{\,+,{\rm low}}_z)P_E
 \right\|
 \leq {L^{K_2}e^{h\alpha_{\max}}\over\sqrt c}.     \tag{7.3}
\]

The terms containing (6.5)--(6.7) are either bounded by the same right
side or by a fixed power of `L`; the latter is `o(tau_L)` because `C>0`.

Finally, (0.2) implies the stronger elementary margin

\[
 hA_1<{1\over5}<{1\over2}.                            \tag{7.4}
\]

Therefore

\[
 {L^{K_2}e^{h\alpha_{\max}}/\sqrt c
  \over e^{hCL}/L^{2m}}
 \leq L^{K_3}{e^{hA_1L}\over\sqrt c}
 =c^{-1/2+hA_1+o(1)}\longrightarrow0.               \tag{7.5}
\]

For the polylogarithmic-base family, `beta=o(L)` and the last exponent is
`-1/2+o(1)`.  Equations (7.3)--(7.5) prove (0.9).  The exact diagonal
factors (0.10a) have product scale `Theta(L^(-1))`; applying (0.10b)
therefore restores one power of `L` and proves the raw statement (0.11).

## 8. Remaining frontier

The forward mixed edge--alias block closes because its local inward row
carries `c^(-1/2)` after exact physical normalization, while the complete
higher outward sampler has only a logarithmic harmonic cost.  This is a
magnitude theorem; it does not assign a favorable sign.

The next direct-profile term has the opposite orientation.  Its inward
`A^+` row contains both shifted compact pieces and a curved/hard exterior
Fourier tail reaching the reciprocal endpoint.  Neither (5.3) nor the
bump estimates above control that complete row.  The reverse mixed block
and the full `(+,+)` block therefore remain the exact alias-sign frontier.
