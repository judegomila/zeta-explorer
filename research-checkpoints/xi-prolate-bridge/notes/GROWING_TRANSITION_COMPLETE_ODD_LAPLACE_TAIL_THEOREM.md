# Growing-transition complete odd-Laplace tail theorem

## 0. Result and exact scope

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 A=\lambda^2,\qquad c=2\pi A,\qquad L=2\log\lambda,
 \qquad h={\pi\over4}.                              \tag{0.1}
\]

The admitted realized same-plus-phase packets are either the fixed-linear
narrow family

\[
 \alpha_i=(A_1+C)L+a_i+O(L^{-1}),\qquad
 \beta_j=A_1L+b_j+O(L^{-1}),                       \tag{0.2F}
\]

where

\[
 A_1,C>0,\quad0<\epsilon<2h,\quad
 hC+\left(5h+{3\epsilon\over2}\right)A_1<1,       \tag{0.3F}
\]

or the polylogarithmic-base family

\[
 B_L=(\log L)^4,\qquad
 \alpha_i=CL+B_L+a_i+O(L^{-1}),\qquad
 \beta_j=B_L+b_j+O(L^{-1}),                        \tag{0.2P}
\]

with

\[
 0<hC<1,\qquad b_*:=\min_jb_j>0.                   \tag{0.3P}
\]

The node sets and packet dimension are fixed.  Every selected label is
`0 mod 4`, and hats denote exact exterior-defect whitening after the
ordered unweighted Poisson limit at fixed `lambda`.  Throughout, `K`
denotes a fixed harmless exponent which may increase from line to line.
Put

\[
 Z_L={cK_0\log L\over L},\qquad
 I_L=\{z=3,5,\ldots:z\leq Z_L\},\qquad
 T_L={e^{hCL}\over L^{2m}}={c^{hC+o(1)}\over L^{2m}},
                                                               \tag{0.4}
\]

where the frozen middle-band choice satisfies `K_0>8m/C`.

Let

\[
 \widehat Q_{\rm odd}^{>I_L}
 =\sum_{\substack{z>Z_L\\z\geq3\ \mathrm{odd}}}
 \mathsf S(\widehat{\mathcal A}_z,
            \widehat{\mathcal B}_z),\qquad
 \mathsf S(U,V)=U^*V+V^*U.                         \tag{0.5}
\]

The sum is first formed in the prescribed ordered physical
representative at fixed `lambda`.  It is not obtained by exchanging the
odd-row sum with a finite Fejer or growing-`lambda` limit.

Form also the uncorrected modal local inward pole row in the same white
coordinates, before restricting coefficient space, and require

\[
 E\subseteq\ker\widehat{\mathcal A}^{1,\rm mod}_0. \tag{0.5a}
\]

For every fixed-dimensional surviving packet subspace `E` satisfying
(0.5a),

\[
 \boxed{\|P_E\widehat Q_{\rm odd}^{>I_L}P_E\|
       =o(T_L).}                                    \tag{0.6}
\]

Consequently the frozen completed-middle-band inequality gives

\[
 \boxed{
 P_E\sum_{z=3,5,\ldots}
 \mathsf S(\widehat{\mathcal A}_z,
            \widehat{\mathcal B}_z)P_E
 \preceq-{c'_m\over4}T_LP_E}                       \tag{0.7}
\]

for all sufficiently large locked `lambda`.

There is a separate fixed-row corollary.  After the zero-integral source
condition and invisible-origin correction have been formed, the admitted
sources have `f(0)=0` and `int f=0`.  Impose
`eta(f)=f(lambda)=0`, take the ordered Poisson rows, and only then
restrict coefficient space by both (0.5a) and the single complete
corrected row `mathcal A_1=0`.
With the one-sided regularity of the frozen zeta--Hurwitz theorem, its
exact ordinary continuation identity gives

\[
 \mathcal A_0=\lambda\mathcal A_1=0.               \tag{0.8}
\]

No `Gamma_out` null is used in this continuation identity.

Thus the `z=0` cross in the complete continuous direct form vanishes, and

\[
 \boxed{P_E\widehat Q_{\rm cont}P_E
       \preceq-{c'_m\over4}T_LP_E.}                \tag{0.9}
\]

If `E_-` is the `m`-dimensional local negative spectral space and `r`
fixed scalar rows are imposed, including any desired inventory among
`eta`, `Gamma_in`, `rho_out`, `Gamma_out`,
`mathcal A_0^(1,mod)`, and `mathcal A_1`, then

\[
 \dim\left(E_-\cap\bigcap_{j=1}^r\ker\ell_j\right)\geq m-r.
                                                               \tag{0.10}
\]

Hence (0.9) is nonvacuous whenever the complete imposed inventory has
`r<m`.  In the standard endpoint/source-null inventory, count explicitly:
the zero-integral source row, `Gamma_in`, `rho_out`, `eta`, and the
uncorrected modal local `mathcal A_0^1` row and complete corrected
`mathcal A_1` row give `r=6`, so one takes `m>6`.  The exact trace identity

\[
 \Gamma_{\rm in}-\Gamma_{\rm out}
 ={\sqrt\lambda\over2}\eta
\]

then shows that `eta=Gamma_in=0` also gives `Gamma_out=0`; it is not a
seventh row.  The value `f(0)=0` is supplied by the fixed invisible-origin
correction and is likewise not counted a second time.

The modal local pole row may depend on `L` and need not have bounded norm:
at each locked `L` it is one scalar row, so its kernel costs at most one
dimension.  It is formed before the coefficient-space restriction, just
as required by the ordered quantifiers.

This theorem controls only the completed continuous odd tower, and (0.9)
only its pole-completed continuous direct form after the stated row nulls.
It does not control the ordered prime form, the remaining central-form
components, equation (5.2) of `DIRECT_RH_ATTACK.md`, determinant
convergence, RH, or a Lambda bound.  The project state remains
`P0_INVALIDATED`.

## 1. Frozen inputs

The following repository bytes are binding inputs.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_EULER_RESOLVENT_CURVED_HARD_ALIAS_COMPLETION_THEOREM.md` | `429488fd14d246a6bcbe0495e4a6290569535536e118ff05ac9ad581845ac0dd` |
| `tests/test_growing_transition_euler_resolvent_curved_hard_alias_completion_theorem.py` | `6f8b65303cd8611c0d0f54ad8996808d541de91ca03150531e57488758aeeb16` |
| `notes/GROWING_TRANSITION_CONTINUOUS_M11_TWO_CLUSTER_UNCONDITIONAL_NARROW_SCHEDULE_THEOREM.md` | `6e0678b8d0d762b79402ad0f6947ddcfa8b830c251b333f58c9fe5ea7ebe7a5c` |
| `tests/test_growing_transition_continuous_m11_unconditional_narrow_schedule.py` | `626dc9f12cf7a4b58246e12f1b008d72bf9bb0e60713a0a10f6b5dda2e66eb34` |
| `notes/GROWING_TRANSITION_POLYLOG_BASE_CONTINUOUS_PRIME_SHELL_COROLLARY.md` | `326d4d19a4c7bf93e920f2af1438fb0aba7dc797091bf0957abf9149bca018e1` |
| `tests/test_growing_transition_polylog_base_continuous_prime_shell_corollary.py` | `de07ecbac9c7404edc2508b54d3aa25a15f2d8f102b86199119af65ef9e6a2a7` |
| `notes/GROWING_TRANSITION_ODD_LAPLACE_MIDDLE_BAND_ALIAS_FRAME_OBSTRUCTION_THEOREM.md` | `6863fd558c13b52255a5bca67c2bb91aae4cd75b82180835a37e178546f70956` |
| `tests/test_growing_transition_odd_laplace_middle_band_alias_frame_obstruction_theorem.py` | `7c0c1a4abaa5768291ca6e7bfc9ca01915e6e8f78ada3f4071ac490a83c59a5a` |
| `notes/GROWING_TRANSITION_ONE_SIDED_ODD_LAPLACE_ROW_AND_FORWARD_ALIAS_THEOREM.md` | `0edbe7253f6164399d468517bc9cbb9c8d9317250ac7dcc526eca9a8e15e7d3b` |
| `tests/test_growing_transition_one_sided_odd_laplace_row_and_forward_alias_theorem.py` | `97215866f7cf3a6969a7ec92d81e722a6e376034e95d58ff1e759b3780fcc79f` |
| `notes/TRANSITION_PROLATE_OUTER_THEOREM.md` | `215f27adc0453f601ced419bd39910cb821c31b2e77678b63874987510f4f9c6` |
| `tests/test_transition_prolate_outer.py` | `bc03f010254e0b56c800b1fc4dfb38cd7ea17a0ebc1133064f751d6eab08b433` |
| `notes/GROWING_TRANSITION_CONTINUOUS_ODD_LAPLACE_COMMON_REPRESENTATIVE_BARRIER.md` | `7e65dd6a5cf9035054f01bf52126e25e00635c0414f1a0dc69e70fc2e6ba6a74` |
| `tests/test_growing_transition_continuous_odd_laplace_common_representative_barrier.py` | `d3369b104aa2ebdfa685c2ae5d1529c55b1702d442b6dd81d5569294f42f1140` |
| `notes/GROWING_TRANSITION_ODD_LAPLACE_ZETA_HURWITZ_FEATURE_ANGLE_REDUCTION_THEOREM.md` | `aaa5b189075b308f3d0ea0c0908ad36d4d871f4ce6626ff74ed9c730a09a0723` |
| `tests/test_growing_transition_odd_laplace_zeta_hurwitz_feature_angle_reduction_theorem.py` | `1bf0cec43d31d1d0f48899be0615faab108b99e86ef446894a8cdec807329a74` |

The common-representative theorem supplies the exact odd factorization
and ordered quantifiers.  The full local theorem and its polylogarithmic
corollary control the entire modal physical `(1,1)` continuous kernel.  The
middle-band theorem identifies the same flat Cauchy principal.  The
completed-middle theorem controls all three alias blocks on `I_L`.  The
one-sided and outer theorems supply the exact higher-outward row and the
sampled exterior carrier used below.  No external source, zero table,
prime estimate, or numerical prolate data is used.

## 2. Exact local-tail subtraction

First write `Q_cont,11^mod` for the uncorrected modal physical continuous
`(m,l)=(1,1)` block, including its separated pole and
Archimedean-regular pieces, and write `Q_mid,11^mod` for its exact odd
rows in `I_L`.  For readability, abbreviate these two modal blocks by
`Q_cont,11` and `Q_mid,11` through (2.5).  On both admitted schedules, the
frozen full-local theorem and the polylogarithmic uniformity corollary
give, in raw endpoint coordinates,

\[
 Q_{\rm cont,11}=Q_{\rm flat}+o\left(
 {e^{hCL}\over L^{2m-1}}\right).                  \tag{2.1}
\]

The frozen middle-band Riemann-sum theorem gives the same principal:

\[
 Q_{\rm mid,11}=Q_{\rm flat}+o\left(
 {e^{hCL}\over L^{2m-1}}\right).                  \tag{2.2}
\]

The exact modal odd representation is

\[
 Q_{\rm cont,11}
 =-\mathsf S(\mathcal A^{1,\rm mod}_0,
             \mathcal B^{1,\rm mod}_0)
  +\sum_{z=3,5,\ldots}
       \mathsf S(\mathcal A^{1,\rm mod}_z,
                 \mathcal B^{1,\rm mod}_z),        \tag{2.3}
\]

so subtraction of (2.2) from (2.1) uses the exact sign

\[
 \sum_{\substack{z>Z_L\\z\geq3\ \mathrm{odd}}}
 \mathsf S(\mathcal A^{1,\rm mod}_z,
            \mathcal B^{1,\rm mod}_z)
 =Q_{\rm cont,11}-Q_{\rm mid,11}
  +\mathsf S(\mathcal A^{1,\rm mod}_0,
             \mathcal B^{1,\rm mod}_0).            \tag{2.4}
\]

The modal pole cross is not small termwise: the hard endpoint can make
`A_0^(1,mod)` as large as `e^(h alpha)/sqrt(L)`.  This is exactly why
(0.5a) is imposed.  After exact defect whitening,

\[
 P_E\mathsf S(\widehat{\mathcal A}^{1,\rm mod}_0,
               \widehat{\mathcal B}^{1,\rm mod}_0)P_E=0.
\]

The exact radial diagonal factors have product `Theta(L^(-1))` with
bounded fixed-node condition number.  Therefore (2.1), (2.2), and (2.4)
give the compressed modal statement

\[
 \boxed{
 \left\|P_E\sum_{\substack{z>Z_L\\z\geq3\ \mathrm{odd}}}
 \mathsf S(\widehat{\mathcal A}^{1,\rm mod}_z,
            \widehat{\mathcal B}^{1,\rm mod}_z)P_E\right\|
 =o(T_L).}                                           \tag{2.5}
\]

No estimate of the modal local pole row is used.  This exact finite-row
subtraction is the reason no nonuniform high-row jet expansion is needed
for the local tail.

It remains to pass from this modal statement to the corrected physical
block.  Write the invisible-origin coefficient as `a_0`; on a
white unit vector, `|a_0|<=C sqrt(lambda)`, and

\[
 H_{\rm bump}(y)={a_0\over2\lambda}
 \widehat\psi\left({y\over2\lambda}\right).         \tag{2.6}
\]

The compact local bump is identically absent because its support ends
below `1/(2lambda)`.  Its two local Fourier rows are exactly

\[
\begin{aligned}
 \widehat{\mathcal A}^{1,\rm bump}_z
 &= {a_0\over4\sqrt\lambda}\int_0^L
 \widehat\psi(e^{-s}/2)e^{-zs}\,ds,\\
 \widehat{\mathcal B}^{1,\rm bump}_z
 &= {a_0\over4\sqrt\lambda}\int_0^\infty
 e^t\widehat\psi(e^t/2)e^{-zt}\,dt.
\end{aligned}
                                                               \tag{2.7}
\]

Consequently both rows are `O(1/z)` for `z>=3`, while
no `z=0` bump estimate is needed.  For every positive odd row put

\[
 \Delta_z^{\rm bump}
 =\mathsf S(\widehat{\mathcal A}^{1,\rm mod}_z,
             \widehat{\mathcal B}^{1,\rm bump}_z)
  +\mathsf S(\widehat{\mathcal A}^{1,\rm bump}_z,
             \widehat{\mathcal B}^{1,\rm mod}_z)
  +\mathsf S(\widehat{\mathcal A}^{1,\rm bump}_z,
             \widehat{\mathcal B}^{1,\rm bump}_z). \tag{2.8}
\]

Split the sum at `z=c`.  On `Z_L<z<=c`, combine the `O(1/z)` bump
rows with the first two modal bounds in (3.1) and
`sum z^(-1)=O(log L)`.  On `z>c`, combine them with the first two
modal bounds in (4.7) and `sum z^(-2)=O(c^(-1))`.  The bump--bump sum
uses square summation on both ranges.  Hence

\[
 \left\|\sum_{\substack{z>Z_L\\z\geq3\ \mathrm{odd}}}
 \Delta_z^{\rm bump}\right\|
 \leq L^K\left\{1+{e^{h\alpha_{\max}}\over\sqrt c}\right\}
 =o(T_L).                                            \tag{2.9}
\]

This bound is `o(T_L)` on both schedules by the same conductor comparison
as (3.4).  Equations (2.5) and (2.9) prove the corrected physical local
tail estimate.  Neither step estimates or cancels a bump `z=0` row.

## 3. Mesoscopic alias tail `Z_L<z<=c`

For `3<=z<=c`, the proofs of the frozen one-sided and completed-alias
row bounds give the uniform envelopes

\[
\begin{aligned}
 |\widehat{\mathcal A}^{1,\rm high}_z|
 &\leq {L^Ke^{h\alpha_{\max}}\over\sqrt{cL}},&
 |\widehat{\mathcal B}^{1,\rm low}_z|
 &\leq {L^K\over\sqrt{cL}},\\
 |\widehat{\mathcal A}^{+,\rm high}_z|
 &\leq {L^K\over\sqrt{cL}}
       \{1+e^{h\alpha_{\max}}2^{-z}\}+{C_\psi\over z},&
 |\widehat{\mathcal B}^{+,\rm low}_z|
 &\leq {L^K\sqrt L\over z}.
\end{aligned}
                                                               \tag{3.1}
\]

The upper endpoint `c` is legitimate in (3.1).  In the one-sided proof,
the only growing-`z` curvature error is
`e^(h alpha) z R^(5/2)/c^2`, which is still conductor-small for `z<=c`
under the strict schedule margins.  In the Euler-resolvent proof, the
unit-interval variation and every jump atom are uniform for all `z>=3`;
its restriction to `I_L` was imposed only by the theorem being assembled.

Since

\[
 \#\{z:Z_L<z\leq c\}=O(c),\quad
 \sum_{Z_L<z\leq c}{1\over z}=O(\log L),\quad
 \sum_{z>Z_L}{1\over z^2}=O(Z_L^{-1}),             \tag{3.2}
\]

the three exact alias orientations satisfy

\[
\begin{aligned}
 \left\|\sum_{Z_L<z\leq c}
 \mathsf S(\widehat{\mathcal A}^1_z,
            \widehat{\mathcal B}^+_z)\right\|
 &\leq L^K{e^{h\alpha_{\max}}\over\sqrt c},\\
 \left\|\sum_{Z_L<z\leq c}
 \mathsf S(\widehat{\mathcal A}^+_z,
            \widehat{\mathcal B}^1_z)\right\|
 &\leq L^K,\\
 \left\|\sum_{Z_L<z\leq c}
 \mathsf S(\widehat{\mathcal A}^+_z,
            \widehat{\mathcal B}^+_z)\right\|
 &\leq {L^K\over\sqrt c}+L^K.
\end{aligned}
                                                               \tag{3.3}
\]

Terms containing a correction row are no larger than the displayed
right sides or `L^K/Z_L`.  On the fixed-linear schedule, division of the
only conductor term in (3.3) by `T_L` leaves

\[
 L^K{e^{hA_1L}\over\sqrt c}
 =c^{-1/2+hA_1+o(1)}\longrightarrow0,              \tag{3.4}
\]

because (0.3F) implies `hA_1<1/5`.  On the polylogarithmic schedule it is
`c^(-1/2+o(1))`.  Every fixed power of `L` is `o(T_L)` because `hC>0`.
Thus the complete mesoscopic alias tail is `o(T_L)`.

## 4. Short-time higher-inward row and the range `z>c`

The new input is a direct-slot estimate rather than a whole-profile jet
estimate.  Fix

\[
 s_0=\log(4/3),\qquad u=\lambda e^{-s}.
\]

For `0<=s<=s_0`, one has `u>=3lambda/4`.  Every compact `m>=2`
source sample vanishes, and the higher inward profile is

\[
 a^{H,+}_\gamma(s)
 ={\sqrt\lambda\over2\sqrt{d_\gamma}}
   \sum_{r\geq2}H_\gamma(ru).                      \tag{4.1}
\]

The frozen complete sampled-series proof extends on this shorter base
range as follows.  Isolate `r=2`.  Its argument obeys
`2u>=3lambda/2`; the outward allowed-carrier bound, with
`V=c(2u/lambda-1)>=c/2`, gives

\[
 |H_\gamma(2u)|\leq {L^K|e_\gamma|\over\lambda}.   \tag{4.2}
\]

For `r>=3`, `ru>=9lambda/4>2lambda`, so the far Volterra expansion from
the frozen outer theorem applies without alteration.  Split at
`M(u)=max(3,ceil(mathcal K/u))`, where
`mathcal K=2pi lambda^3`.  Below `M`, the
`1/(ru)` carrier costs one harmonic logarithm.  Above `M`, the leading
sine series is bounded by Dirichlet summation and the `r^(-2)` Volterra
remainder costs `mathcal K/(u^2M)=O(1/u)`.  Hence

\[
 \boxed{
 \left|\sum_{r\geq2}H_\gamma(ru)\right|
 \leq {L^K|e_\gamma|\over\lambda},
 \qquad {3\lambda\over4}\leq u\leq\lambda.}       \tag{4.3}
\]

After division by `sqrt(d_gamma)`, (4.3) and the exact endpoint mass
formula give

\[
 {|e_\gamma|\over\sqrt{d_\gamma}}=|z_\gamma|,
 \qquad {1\over\sqrt{d_\gamma}}
 \left|\sum_{r\geq2}H_\gamma(ru)\right|
 \leq {L^K\over\sqrt{\lambda J_\gamma}}.          \tag{4.4}
\]

Thus (4.1)--(4.4) make the white short-time profile
`O(L^K/sqrt(J_gamma))`.  On `s>=s_0`, compact support, the
endpoint-normalized curved carrier bounds, and the ordered exterior
sampled series give the crude but sufficient delayed-profile estimate

\[
 \int_{s_0}^L|a^{H,+}_\gamma(s)|\,ds
 \leq c^K e^{h\gamma}.                              \tag{4.5}
\]

Multiplication by `e^(-zs_0)=(3/4)^z` makes (4.5) smaller than every
conductor power when `z>c`.  Therefore

\[
 \boxed{|\widehat{\mathcal A}^{+,\rm high}_{z}|
       \leq {L^K\over\sqrt L\,z}
             +c^Ke^{h\alpha_{\max}}(3/4)^z,
       \qquad z>c.}                                 \tag{4.6}
\]

For the invisible-origin bump,
`H_bump(y)=a_0(2lambda)^(-1) widehat psi(y/(2lambda))` and
`|a_0|<=C sqrt(lambda)` on a white unit vector.  Schwartz summation in
(4.1) gives `O(1/z)`.  Thus (4.6), with an inessential enlargement to
`L^K/z` when a correction is present, is a combined physical row
estimate, not merely an uncorrected modal statement.

The local profiles and the frozen higher-outward estimate give, for
`z>c`,

\[
\begin{aligned}
 |\widehat{\mathcal A}^{1,\rm high}_z|
 &\leq {L^Ke^{h\alpha_{\max}}\sqrt{c/L}\over z},&
 |\widehat{\mathcal B}^{1,\rm low}_z|
 &\leq {L^K\sqrt{c/L}\over z},\\
 |\widehat{\mathcal A}^{+,\rm high}_z|
 &\leq {L^K\over z},&
 |\widehat{\mathcal B}^{+,\rm low}_z|
 &\leq {L^K\sqrt L\over z}.
\end{aligned}
                                                               \tag{4.7}
\]

For the first two bounds, use the exact time profiles.  The inward regular
state is at most `L^K e^(h gamma)` after endpoint normalization: on the
initial polynomial interval this is the frozen regular-state estimate,
and afterward it is the allowed-carrier action bound for
`sqrt(a_-)p_gamma`; here `a_-(U_L)asymp c`.  Likewise the
outward regular interval and the allowed-carrier bound for
`sqrt(a_+)q_gamma` give
`sup_(t>=0) e^t|q_gamma(c(e^t-1))|<=L^K`.  Their white corner factor is
`sqrt(lambda)|z_gamma|<=L^K sqrt(c/L)`.  Integration against `e^(-zt)`
proves (4.7); no fixed-`lambda` asymptotic expansion is used.

Since `sum_(z>c, z odd) z^(-2)=O(c^(-1))`, (4.7) yields

\[
\begin{aligned}
 \left\|\sum_{z>c}
 \mathsf S(\widehat{\mathcal A}^1_z,
            \widehat{\mathcal B}^+_z)\right\|
 &\leq L^K{e^{h\alpha_{\max}}\over\sqrt c},\\
 \left\|\sum_{z>c}
 \mathsf S(\widehat{\mathcal A}^+_z,
            \widehat{\mathcal B}^1_z)\right\|
 &\leq {L^K\over\sqrt{cL}},\\
 \left\|\sum_{z>c}
 \mathsf S(\widehat{\mathcal A}^+_z,
            \widehat{\mathcal B}^+_z)\right\|
 &\leq {L^K\sqrt L\over c}.
\end{aligned}
                                                               \tag{4.8}
\]

The same conductor comparison as (3.4) proves that all three are
`o(T_L)` on both schedules.

## 5. Assembly and the high-row jet warning

At fixed `lambda`, expand every odd row exactly as

\[
\begin{aligned}
 \mathsf S(\mathcal A_z,\mathcal B_z)
 ={}&\mathsf S(\mathcal A^1_z,\mathcal B^1_z)
 +\mathsf S(\mathcal A^1_z,\mathcal B^+_z)\\
 &+\mathsf S(\mathcal A^+_z,\mathcal B^1_z)
 +\mathsf S(\mathcal A^+_z,\mathcal B^+_z).
\end{aligned}
                                                               \tag{5.1}
\]

Equations (2.5) and (2.9) control the corrected first term outside `I_L`;
(3.3) controls the next three terms for `Z_L<z<=c`; and (4.8) controls
them for `z>c`.
This proves (0.6).  Combining (0.6) with the frozen inequality

\[
 P_E\widehat Q_{\rm full}^{I_L}P_E
 \preceq-{c'_m\over2}T_LP_E                       \tag{5.2}
\]

proves (0.7).  Equations (0.8), the exact common representative, and
(0.10) prove the fixed-row corollary (0.9).

There is an important proof-boundary point.  On the exact double-null
space `eta=Gamma_out=0`, direct repeated Laplace integration gives at
fixed `lambda`

\[
 \mathcal A_z={a_f'(0)\over z^2}+O_\lambda(z^{-3}),
 \qquad
 \mathcal B_z={J_L(f)\over z^2}+O_\lambda(z^{-3}), \tag{5.3}
\]

where

\[
 J_L(f)=-{1\over2\sqrt\lambda}
 \sum_{1\leq n<A}{n\over\lambda}f'(n/\lambda),
 \qquad
 a_f'(0)=-{\lambda^{3/2}\over2}\kappa(f)-J_L(f). \tag{5.4}
\]

No frozen theorem gives a growing-`lambda`, white uniform bound for this
lattice derivative row or for the remainder in (5.3).  Hence a direct
whole-profile Lipschitz proof of (0.6) would still be invalid.  The proof
above avoids that obstruction: it subtracts the already controlled full
local block and estimates only the ordered alias slots, for which the
outer carrier supplies (4.3).  It does not claim a new bound for `J_L` or
exchange the limits hidden in (5.3).
