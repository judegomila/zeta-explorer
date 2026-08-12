# Lower-Ritz ground-ridge forcing-adapted dangerous-response barrier

## 0. Exact outcome and strict scope

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 L=2\log\lambda,\qquad N=2^{9600\lambda^2}.          \tag{0.1}
\]

Write the complete inversion-even source block and its genuine lower
two-vector Ritz shift as

\[
 Q_+=\begin{pmatrix}q&b^*\\b&A\end{pmatrix},\qquad
 u=\lambda_{\min}\left(
 Q_+|_{\operatorname {span}\{\kappa,b\}}\right),
 \qquad t=q-u>0,                                    \tag{0.2}
\]

\[
 B_u=A-uI\succ0.                                    \tag{0.3}
\]

The strict branch (0.3) remains unproved on the actual unbounded schedule.
Let `mu` be the actual even ground value and put

\[
 h=u-\mu\geq0,\qquad D_h=B_u+hI=A-\mu I.            \tag{0.4}
\]

Redo the positive far and captured eliminations at the ridge `h`; one must
not reuse their zero-ridge harmonic lifts.  Let

\[
 \mathsf G_h:\mathcal R\longrightarrow\mathcal K,
 \qquad R_{1,h}=\mathsf G_h^*D_h\mathsf G_h,
 \qquad \rho_{1,h}=\mathsf G_h^*b.                 \tag{0.5}
\]

Using the same physical complete-symbol projector `Pi_q`, define

\[
 \mathcal D_{\rho,h}
 =\operatorname {Ran}(\mathsf G_h^*\Pi_q)
       +\operatorname {span}\{\rho_{1,h}\},\qquad
 \mathcal F_{\rho,h}=\mathcal R\ominus\mathcal D_{\rho,h}.
                                                               \tag{0.6}
\]

The forcing-adapted safe row still vanishes exactly at the actual ridge,
and the rank class is unchanged:

\[
 \boxed{
 \dim\mathcal D_{\rho,h}\leq\operatorname {rank}\Pi_q+1
 \leq\exp(O(\lambda))+1,\qquad f_h=0.}            \tag{0.7}
\]

Relative to
`mathcal R=mathcal D_(rho,h) direct-sum mathcal F_(rho,h)`, write

\[
 R_{1,h}=\begin{pmatrix}K_h&\Gamma_h^*\\
                         \Gamma_h&J_h\end{pmatrix},
 \qquad \rho_{1,h}=\binom{d_h}{0},                 \tag{0.8}
\]

\[
 S_{\rho,h}=K_h-\Gamma_h^*J_h^{-1}\Gamma_h.        \tag{0.9}
\]

If the multiplier safe floor at the upper shift `q` is `delta>0`, then

\[
 \boxed{J_h\succeq(\delta+t+h)I,
 \qquad
 \rho_{1,h}^*R_{1,h}^{-1}\rho_{1,h}
 =d_h^*S_{\rho,h}^{-1}d_h.}                       \tag{0.10}
\]

The actual ground secular equation supplies an exact energy budget.  If
`mathcal E_(F,h)` and `mathcal E_(C,h)` are the far and captured forcing
energies from the ridge-specific eliminations, then

\[
 \boxed{
 t+h=\mathcal E_{F,h}+\mathcal E_{C,h}
                  +\mathcal E_{\rho,h},\qquad
 \mathcal E_{\rho,h}=d_h^*S_{\rho,h}^{-1}d_h.}    \tag{0.11}
\]

In particular,

\[
 \boxed{0\leq\mathcal E_{\rho,h}\leq t+h.}        \tag{0.12}
\]

The retained dangerous energy is not equal to `t+h` unless both earlier
forcing energies vanish.

For an anchor-removed Mellin Riesz vector `g_z`, let
`eta_(z,h)=mathsf G_h^*g_z`.  In the coordinates of (0.8), write

\[
 \eta_{z,h}=\binom{a_{z,h}}{k_{z,h}},\qquad
 \widetilde a_{z,h}
 =a_{z,h}-\Gamma_h^*J_h^{-1}k_{z,h}.                \tag{0.13}
\]

The exact retained response is the single phase-sensitive Feshbach row

\[
 \boxed{
 \mathcal O_{\rho,h}(z)
 =\widetilde a_{z,h}^*S_{\rho,h}^{-1}d_h.}         \tag{0.14}
\]

Define its dangerous observation leverage by

\[
 \Lambda_{\rho,h}(z)
 =\widetilde a_{z,h}^*S_{\rho,h}^{-1}
                     \widetilde a_{z,h}.           \tag{0.15}
\]

Then there is an exact phase factor `theta_(z,h)` with
`|theta_(z,h)|<=1` such that

\[
 \boxed{
 \mathcal O_{\rho,h}(z)
 =\theta_{z,h}
   \sqrt{\mathcal E_{\rho,h}\Lambda_{\rho,h}(z)}.} \tag{0.16}
\]

Thus the sharp remaining determinant target is

\[
 \boxed{
 \alpha_{\lambda,N}
 \sup_{z\in\Omega}
 \left|\widetilde a_{z,h}^*S_{\rho,h}^{-1}d_h\right|
 \longrightarrow0.}                                \tag{0.17}
\]

A convenient stronger leverage target is

\[
 \boxed{
 \alpha_{\lambda,N}^2(t+h)
 \sup_{z\in\Omega}\Lambda_{\rho,h}(z)
 \longrightarrow0.}                                \tag{0.18}
\]

The two eliminated responses are already negligible at the actual ridge.
For every fixed compact `Omega` with
`eta=max_(z in Omega)|Im z|<1/2`, the repaired anchor tail and the
ridge-uniform captured estimate give

\[
 \boxed{
 \alpha_{\lambda,N}
 \sup_{z\in\Omega}
 \left|g_z^*D_h^{-1}b-\mathcal O_{\rho,h}(z)\right|
 \longrightarrow0.}                                \tag{0.19}
\]

Thus (0.17) is not merely the last retained term: after the proved far and
captured estimates it is the sole unresolved determinant response in the
complete ground solve.

Neither self-consistency nor ridge positivity proves (0.17).  An exact
five-node source-Cauchy family below has `q=t -> 0`, both strict lower-Ritz
signs, a rank-one dangerous projector, a fixed safe floor, the favorable
positive-sampling row with `q=U_Z`, bounded source normalization, and the
actual positive ground ridge.  Nevertheless its frequency-two dangerous
response tends to `-sqrt(pi)`.  In that family (0.16) asymptotically
saturates Cauchy--Schwarz.

Therefore the forcing-adapted reduction removes the safe forcing exactly,
but does not turn the ground secular equation into a determinant bound.
The missing arithmetic input is a dangerous returned-row leverage estimate
such as (0.18), or phase cancellation in the exact row (0.17).

This note proves neither (0.17) for the pinned arithmetic matrices, either
strict sector sign on the unbounded schedule, equation (5.2) of
`DIRECT_RH_ATTACK.md`, a determinant limit, a zero statement, RH, nor a
de Bruijn--Newman `Lambda` bound.  The formal state remains
`P0_INVALIDATED`, and the standard eight are unchanged.

## 1. Frozen inputs

Only the following exact repository bytes are imported.

| Dependency | SHA-256 |
|---|---|
| `notes/LOWER_RITZ_ACTUAL_MULTIPLIER_FORCING_ADAPTED_SAFE_ELIMINATION_THEOREM.md` | `b49285625d876d36ae21fa8e1dcf1ba0ff361d770987bb66cbea2fc415674398` |
| `tests/test_lower_ritz_actual_multiplier_forcing_adapted_safe_elimination_theorem.py` | `0e670415cf39bb3e53a7d200ec3947bd84dbd7c1576e888ed18954ffd6183edc` |
| `notes/LOWER_RITZ_ACTUAL_MULTIPLIER_SAFE_RETURNED_ROW_REDUCTION_BARRIER.md` | `e181b86e3984f4bf4237825e88d1a67703cb03043b386bf8844b49343dbf73cd` |
| `tests/test_lower_ritz_actual_multiplier_safe_returned_row_reduction_barrier.py` | `6ac27b5821e267003ade5b63666b409a1357802b8314f5461c7e62da922579c0` |
| `notes/LOWER_RITZ_POST_FAR_RETAINED_INVERSE_ROW_THEOREM.md` | `9288ac25216781416d0bb1d0ef7d2a11f3dd09bac8e8f04195ac9b3e928229f3` |
| `tests/test_lower_ritz_post_far_retained_inverse_row_theorem.py` | `8f2aa9cb6daca472d75a890520c23dfd1b5dcb487e8454b1c12b598b61a58327` |
| `notes/LOWER_RITZ_RESIDUAL_INVERSE_SPREAD_DETERMINANT_SPLIT_THEOREM.md` | `0e905dbb849d1a7cbf9a8906831d9c192c75bd953c10bf13329ea94dcee788a3` |
| `tests/test_lower_ritz_residual_inverse_spread_determinant_split_theorem.py` | `8cc310388b33f6ee075060f56c3b084867c68f66cae8aee64567ab9cab11e36b` |
| `notes/FIXED_ANCHOR_BV_CAUCHY_FAR_ROW_THEOREM.md` | `59395e5d184c93e3e56c935028c5fba322a0f30476bd9db1c99585c056876c79` |
| `tests/test_fixed_anchor_bv_cauchy_far_row_theorem.py` | `905dae5ca5489665dea4bfa1309d062fbd2769a529674b6c10d380a3f3627e3e` |
| `notes/LOWER_RITZ_POST_FAR_CAPTURED_RESPONSE_ANCHOR_ROW_BARRIER.md` | `3628b3b5f6365e0fdbc441ba08503bfed1969fa64f91deb1fd88e79ce5fe5c3e` |
| `tests/test_lower_ritz_post_far_captured_response_anchor_row_barrier.py` | `8e604475927555203ab0d0389a681648ca2a3bbcd5d61e36447d0005db4953e4` |

The first pair supplies the zero-ridge forcing adaptation.  The second pair
supplies the ridge-specific harmonic eliminations and the exact returned
Mellin solve.  The third pair fixes the two positive eliminations and their
returned forcing rows.  The fourth pair supplies the ground secular equation,
source normalization, and the exact source-Cauchy family used below.  The
final two pairs supply the repaired anchor-to-far row and the captured Mellin
response with its exact pulled-back source metric.

No positive zero-sampling estimate is converted into a signed dangerous
floor.  No fixed-depth source asymptotic is promoted to a growing inverse
bound.

## 2. Ridge-specific forcing adaptation

For every `s>=0`, put

\[
 D_s=B_u+sI=B_q+(t+s)I,
 \qquad B_q=A-qI.                                   \tag{2.1}
\]

Redo both exact positive eliminations for `D_s`.  Denote their combined
harmonic lift by `mathsf G_s`, and put

\[
 R_{1,s}=\mathsf G_s^*D_s\mathsf G_s,
 \qquad \rho_{1,s}=\mathsf G_s^*b.                 \tag{2.2}
\]

Both harmonic lifts retain their input as an orthogonal coordinate, so

\[
 \boxed{\mathsf G_s^*\mathsf G_s\succeq I.}        \tag{2.3}
\]

Define

\[
 \mathcal D_{\rho,s}
 =\operatorname {Ran}(\mathsf G_s^*\Pi_q)
       +\operatorname {span}\{\rho_{1,s}\},
 \qquad
 \mathcal F_{\rho,s}=\mathcal R\ominus\mathcal D_{\rho,s}.
                                                               \tag{2.4}
\]

If `i_(F,s)` includes the adapted safe space and
`W_(F,s)=mathsf G_s i_(F,s)`, orthogonality gives

\[
 \Pi_qW_{F,s}=0,
 \qquad W_{F,s}^*b=i_{F,s}^*\rho_{1,s}=0.          \tag{2.5}
\]

The physical multiplier theorem gives

\[
 P_{\Pi_q^\perp}B_qP_{\Pi_q^\perp}
 \succeq\delta P_{\Pi_q^\perp}.                  \tag{2.6}
\]

Equations (2.1), (2.3), (2.5), and (2.6) imply

\[
 \begin{aligned}
 W_{F,s}^*D_sW_{F,s}
 &\succeq(\delta+t+s)W_{F,s}^*W_{F,s}\\
 &\succeq(\delta+t+s)I.
 \end{aligned}                                      \tag{2.7}
\]

The dimension estimate is unchanged:

\[
 \dim\mathcal D_{\rho,s}
 \leq\operatorname {rank}(\mathsf G_s^*\Pi_q)+1
 \leq\operatorname {rank}\Pi_q+1.                \tag{2.8}
\]

Taking `s=h` proves (0.7) and the floor in (0.10).  Exact block inversion
of (0.8) gives

\[
 R_{1,h}^{-1}\binom{d_h}{0}
 =\binom{S_{\rho,h}^{-1}d_h}
 {-J_h^{-1}\Gamma_hS_{\rho,h}^{-1}d_h}.           \tag{2.9}
\]

Pairing (2.9) with the forcing row and with the observation row proves
(0.10) and (0.14).  The safe component of the dangerous solve is retained
in `widetilde a_(z,h)`; it has not been discarded.

## 3. The actual ground energy ledger

Write the ridge operator first on
`mathcal K=mathcal Y direct-sum mathcal F` as

\[
 D_h=\begin{pmatrix}D_{Y,h}&\Upsilon_h^*\\
                     \Upsilon_h&H_{F,h}\end{pmatrix},
 \qquad b=\binom{b_Y}{b_F}.                         \tag{3.1}
\]

Its far harmonic lift and returned forcing are

\[
 E_{F,h}y=\binom{y}{-H_{F,h}^{-1}\Upsilon_hy},
 \qquad
 \beta_h=E_{F,h}^*b.                               \tag{3.2}
\]

On `mathcal Y=mathcal C direct-sum mathcal R`, write the far short and row
as

\[
 \Sigma_h=\begin{pmatrix}P_h&X_h^*\\X_h&R_h\end{pmatrix},
 \qquad \beta_h=\binom{c_h}{r_h}.                 \tag{3.3}
\]

The captured lift gives

\[
 R_{1,h}=R_h-X_hP_h^{-1}X_h^*,
 \qquad
 \rho_{1,h}=r_h-X_hP_h^{-1}c_h.                   \tag{3.4}
\]

The two exact Gaussian factorizations and the adapted factorization give

\[
 \begin{aligned}
 b^*D_h^{-1}b
 &=b_F^*H_{F,h}^{-1}b_F
   +c_h^*P_h^{-1}c_h
   +\rho_{1,h}^*R_{1,h}^{-1}\rho_{1,h}\\
 &=\mathcal E_{F,h}+\mathcal E_{C,h}
   +d_h^*S_{\rho,h}^{-1}d_h.
 \end{aligned}                                      \tag{3.5}
\]

The ground eigenvector with anchor coefficient one is

\[
 \binom{1}{-D_h^{-1}b}.                             \tag{3.6}
\]

Its anchor equation is exactly

\[
 q-\mu=b^*D_h^{-1}b,
 \qquad q-\mu=t+h.                                 \tag{3.7}
\]

Equations (3.5)--(3.7) prove (0.11)--(0.12).  Every term in (3.5) is
nonnegative.  The ground equation controls their sum, not any observation
leverage.

## 4. Exact Mellin response and the leverage/phase dichotomy

Let the far-returned observation be

\[
 \gamma_{z,h}=E_{F,h}^*g_z
 =\binom{a_{C,z,h}}{a_{R,z,h}}.                    \tag{4.1}
\]

The captured-returned observation is

\[
 \eta_{z,h}=a_{R,z,h}-X_hP_h^{-1}a_{C,z,h}
 =\mathsf G_h^*g_z.                                \tag{4.2}
\]

The same two Gaussian solves used in (3.5) give the exact full response

\[
 \boxed{
 \begin{aligned}
 g_z^*D_h^{-1}b
 &=g_{F,z}^*H_{F,h}^{-1}b_F
   +a_{C,z,h}^*P_h^{-1}c_h\\
 &\quad+\widetilde a_{z,h}^*S_{\rho,h}^{-1}d_h.
 \end{aligned}}                                     \tag{4.3}
\]

Thus after the far and captured responses are handled, (0.14) is the exact
remaining scalar.  For the source-normalized ground correction the scalar
is multiplied by `-alpha_(lambda,N)`.

Metric Cauchy--Schwarz gives

\[
 |\mathcal O_{\rho,h}(z)|^2
 \leq\mathcal E_{\rho,h}\Lambda_{\rho,h}(z)
 \leq(t+h)\Lambda_{\rho,h}(z).                    \tag{4.4}
\]

When both quadratic factors are nonzero, define

\[
 \theta_{z,h}
 ={\widetilde a_{z,h}^*S_{\rho,h}^{-1}d_h
   \over
   \sqrt{\mathcal E_{\rho,h}\Lambda_{\rho,h}(z)}};
                                                               \tag{4.5}
\]

set it to zero otherwise.  Equation (0.16) and
`|theta_(z,h)|<=1` follow.  This separates the only two possible closing
mechanisms: dangerous leverage or phase cancellation.

Ridge positivity alone cannot supply the first mechanism.  When `h>0`,

\[
 D_h\succeq hI.                                     \tag{4.6}
\]

The observation version of the three positive factorizations shows

\[
 \Lambda_{\rho,h}(z)
 \leq g_z^*D_h^{-1}g_z
 \leq{\|g_z\|^2\over h}.                           \tag{4.7}
\]

Combining (4.4) and (4.7) gives only

\[
 |\mathcal O_{\rho,h}(z)|
 \leq\|g_z\|\sqrt{{t+h\over h}}.                  \tag{4.8}
\]

The ratio in (4.8) is at least one.  Hence the ground ridge cannot by
itself make even a bounded observation vanish.  The next section shows
that (4.8) is asymptotically sharp in the exact source-Cauchy class.

### 4.1 Ridge-uniform far and captured response closure

The far observation enjoys the same high-Fourier tail gain as the repaired
anchor row.  Indeed, for

\[
 e_n(x)=L^{-1/2}e^{2\pi i n x/L},\qquad |n|>R,       \tag{4.9}
\]

direct integration of the compact-strip Riesz vector gives

\[
 |\langle e_n,\ell_z^*\rangle|
 \leq {C_\Omega\sqrt L\,\lambda^\eta\over1+|n|}.
                                                               \tag{4.10}
\]

Here `g_z=P_(mathcal K)ell_z^*` is anchor removed.  Since
`F subset mathcal K` and `P_F kappa=0`, its far projection is exactly the
raw Riesz tail:

\[
 P_Fg_z=P_FP_{\mathcal K}\ell_z^*=P_F\ell_z^*.    \tag{4.10a}
\]

Because `F` is contained in the raw even Fourier tail `|n|>R`, summation
of (4.10) gives

\[
 \boxed{
 \sup_{z\in\Omega}\|g_{F,z}\|
 \leq {C_\Omega\sqrt L\,\lambda^\eta\over\sqrt R}.}
                                                               \tag{4.11}
\]

The ridge far pivot and the repaired anchor row satisfy

\[
 H_{F,h}=H_{F,0}+hI\succeq G_RI,
 \qquad
 \|b_F\|\leq{P_*(\lambda,L)\over\sqrt R},          \tag{4.12}
\]

where `G_R=Theta(lambda^2)`, `R=sqrt(N)`, and `P_*` is polynomial.  Since
`alpha_(lambda,N)=O(1)`, equations (4.11)--(4.12) prove

\[
 \boxed{
 \alpha_{\lambda,N}
 \sup_{z\in\Omega}
 |g_{F,z}^*H_{F,h}^{-1}b_F|
 \leq {C_\Omega\alpha_{\lambda,N}P_*(\lambda,L)
             \sqrt L\,\lambda^\eta\over G_RR}
 \longrightarrow0.}                                \tag{4.13}
\]

This is uniform for every `h>=0` and decays faster than every fixed
polynomial in `lambda`.

The captured response is also uniform under a nonnegative ridge.  For
`s>=0`, let

\[
 H_{F,s}=H_{F,0}+sI,
 \qquad
 \Sigma_s=D_{Y,0}+sI
       -\Upsilon_0^*(H_{F,0}+sI)^{-1}\Upsilon_0.    \tag{4.14}
\]

Then

\[
 \Sigma_s-\Sigma_0
 =sI+\Upsilon_0^*
 \{H_{F,0}^{-1}-(H_{F,0}+sI)^{-1}\}\Upsilon_0
 \succeq0.                                         \tag{4.15}
\]

Define the ridged far lift and its captured restriction by

\[
 E_{F,s}y=\binom{y}{-(H_{F,0}+sI)^{-1}\Upsilon_0y},
 \qquad
 \widetilde V_{Q,s}=E_{F,s}i_QV_Q,                 \tag{4.15a}
\]

where `V_Q` is the frozen source-white captured synthesis.  The captured
theorem at `s=0` and (4.15) give

\[
 \widehat P_{Q,s}
 =\widetilde V_{Q,s}^*D_s\widetilde V_{Q,s}
 \succeq\widehat P_{Q,0}\succeq cLI.              \tag{4.16}
\]

Put

\[
 \Gamma_Q=\Upsilon_0i_QV_Q,
 \qquad K_{\Delta,Q}=O(1).                          \tag{4.16a}
\]

The frozen global one-power metric is
`Delta=Delta_L direct-sum I_(mathcal K_H)`.  Since
`F subset mathcal K_H`, its restriction to
`mathcal K_L direct-sum F` is exactly `Delta_L direct-sum I_F`.
Functional calculus gives

\[
 \begin{aligned}
 \widetilde V_{Q,s}^*\Delta\widetilde V_{Q,s}
 &=V_Q^*i_Q^*\Delta_Li_QV_Q
   +\Gamma_Q^*(H_{F,0}+sI)^{-2}\Gamma_Q\\
 &\preceq\widetilde V_{Q,0}^*\Delta
                  \widetilde V_{Q,0}
 \preceq K_{\Delta,Q}I.
\end{aligned}                                      \tag{4.17}
\]

Thus the positive-sampling forcing row and Mellin row estimates used at
zero ridge hold with the same constants for every `s>=0`.  Moreover,
`widetilde V_(Q,s)` takes values in `mathcal K=kappa^perp`, so pulling back
the uncentered Riesz vector `ell_z^*` is identical to pulling back
`g_z=P_(mathcal K)ell_z^*`.  At `s=h`, the exact frozen estimate is

\[
 \boxed{
 \alpha_{\lambda,N}
 \sup_{z\in\Omega}|a_{C,z,h}^*P_h^{-1}c_h|
 \leq {C_\Omega\alpha_{\lambda,N}K_{\Delta,Q}
             \over\alpha_Q-\ell_Q}
 \left\{{U_ZC_{\rm pos}(\lambda)M_\Omega(L)\over d_8}
 \right\}^{1/2}
 \longrightarrow0}                                 \tag{4.18}
\]

for `eta<1/2`, where `alpha_Q-ell_Q` is asymptotic to `L/8`.
Equations (4.3), (4.13), and (4.18) prove (0.19).

## 5. Exact source-Cauchy ridge countermodel

Fix `0<varepsilon<1/2`, take centered raw nodes `-2,-1,0,1,2`, and put

\[
 t=q=\varepsilon^2,\qquad
 a=1,\qquad e=\varepsilon^4,
 \qquad
 r=\varepsilon\sqrt{{16+\varepsilon^4\over17}}.    \tag{5.1}
\]

Impose `beta_(-n)=-beta_n`, `a_(-n)=a_n`, and choose

\[
 \begin{aligned}
 &\beta_0=0,
 &&\beta_1=-{4r\over\sqrt {34}},
 &&\beta_2=-{2r\over\sqrt {34}},\\
 &a_0=t,
 &&a_1=1+{4r\over\sqrt {34}},
 &&a_2=e+{r\over\sqrt {34}}.
 \end{aligned}                                      \tag{5.2}
\]

Define the exact real source-Cauchy matrix by

\[
 Q_{nn}=a_n,
 \qquad Q_{nm}={\beta_n-\beta_m\over n-m}
 \quad(n\ne m).                                    \tag{5.3}
\]

In the normalized parity bases its blocks are

\[
 Q_+=\begin{pmatrix}
 \varepsilon^2&-4r/\sqrt {17}&-r/\sqrt {17}\\
 -4r/\sqrt {17}&1&0\\
 -r/\sqrt {17}&0&\varepsilon^4
 \end{pmatrix},                                    \tag{5.4}
\]

\[
 Q_-=\begin{pmatrix}
 1+8r/\sqrt {34}&4r/\sqrt {34}\\
 4r/\sqrt {34}&\varepsilon^4+2r/\sqrt {34}
 \end{pmatrix}\succ0.                              \tag{5.5}
\]

Indeed, its leading entry is positive and

\[
 \det Q_-=\varepsilon^4
       +{2r+8\varepsilon^4r\over\sqrt {34}}>0.     \tag{5.5a}
\]

Let

\[
 w={1\over\sqrt {17}}(-4,-1),\qquad
 b=rw,qquad B_u=\operatorname {diag}(1,\varepsilon^4).
                                                               \tag{5.6}
\]

The exact relation

\[
 t\langle w,B_uw\rangle=r^2                       \tag{5.7}
\]

shows that the genuine lower two-vector Ritz value is `u=0`.  Thus both
strict lower-Ritz signs hold.

The actual even ground is `mu=-h_varepsilon`, where `h_varepsilon>0` is
the unique root of

\[
 \varepsilon^2+h_\varepsilon
 ={\varepsilon^2(16+\varepsilon^4)\over289}
 \left\{{16\over1+h_\varepsilon}
       +{1\over\varepsilon^4+h_\varepsilon}\right\}.
                                                               \tag{5.8}
\]

Monotonicity of the two sides and the substitution
`h_varepsilon=varepsilon*y_varepsilon` give

\[
 \boxed{{h_\varepsilon\over\varepsilon}
 \longrightarrow{4\over17}.}                      \tag{5.9}
\]

At the upper shift `q`, take the structural dangerous projector

\[
 \Pi_q=\begin{pmatrix}0&0\\0&1\end{pmatrix}.      \tag{5.10}
\]

Then its safe line has the fixed floor

\[
 P_{\Pi_q^\perp}B_qP_{\Pi_q^\perp}
 =(1-\varepsilon^2)P_{\Pi_q^\perp}
 \succeq{3\over4}P_{\Pi_q^\perp},                 \tag{5.11}
\]

and `rank Pi_q=1`.  Because the first coordinate of `b` is nonzero,

\[
 \operatorname {Ran}\Pi_q+\operatorname {span}\{b\}
 =\mathbb C^2.                                     \tag{5.12}
\]

Thus the forcing-adapted dangerous space has dimension two and its safe
forcing is exactly zero.  There are no preliminary far or captured
coordinates, so

\[
 S_{\rho,h_\varepsilon}
 =\operatorname {diag}(1+h_\varepsilon,
                        \varepsilon^4+h_\varepsilon),
 \qquad
 \mathcal E_{\rho,h_\varepsilon}=t+h_\varepsilon.
                                                               \tag{5.13}
\]

Take `L=2*pi`.  The anchor-removed real frequency-two Riesz row is

\[
 g_2=\sqrt\pi\,e_2^+.                               \tag{5.14}
\]

Its exact dangerous response is

\[
 \boxed{
 \mathcal O_{\rho,h_\varepsilon}(2)
 =-\sqrt\pi\,
 {\varepsilon\sqrt{16+\varepsilon^4}/17
  \over\varepsilon^4+h_\varepsilon}
 \longrightarrow-\sqrt\pi.}                       \tag{5.15}
\]

At the same time,

\[
 \mathcal E_{\rho,h_\varepsilon}\longrightarrow0,
 \qquad
 \Lambda_{\rho,h_\varepsilon}(2)
 ={\pi\over\varepsilon^4+h_\varepsilon}
 \longrightarrow\infty,                           \tag{5.16}
\]

\[
 \boxed{
 \mathcal E_{\rho,h_\varepsilon}
 \Lambda_{\rho,h_\varepsilon}(2)\longrightarrow\pi,
 \qquad |\theta_{2,h_\varepsilon}|\longrightarrow1.}
                                                               \tag{5.17}
\]

The generic positive-sampling row is favorable as well.  Put

\[
 U_Z=q=\varepsilon^2,
 \qquad G_Z={1\over q}bb^*.                         \tag{5.18}
\]

Then

\[
 bb^*=U_ZG_Z,
 \qquad \|G_Z\|={16+\varepsilon^4\over17}<1,       \tag{5.19}
\]

while `||g_2||^2=pi`.  Thus a bounded sampling ceiling, a bounded Mellin
row, `q=U_Z`, a fixed safe floor, constant dangerous rank, the exact ground
secular equation, and even `t=q -> 0` do not imply a vanishing dangerous
response.  Taking a bounded positive source normalization, for example
`alpha=1`, does not change (5.15).

This is a structural source-Cauchy countermodel, not the pinned arithmetic
matrix and not a realization of the actual von-Mangoldt multiplier symbol.
It proves that the frozen rank, floor, sampling, and self-consistency data
alone cannot prove (0.17).  An arithmetic proof must use additional
dangerous-row alignment.

## 6. Strict stopping point

At the actual ground ridge the retained multiplier-safe forcing has been
removed exactly.  The retained forcing energy is controlled by the secular
budget (0.11), but its Mellin response is controlled by that energy times
the dangerous observation leverage and phase.

The smallest exact remaining statement is (0.17).  A non-phase-sensitive
sufficient statement is (0.18).  Equivalently, one may prove the sharper
energy-aware condition

\[
 \alpha_{\lambda,N}^2\mathcal E_{\rho,h}
 \sup_{z\in\Omega}\Lambda_{\rho,h}(z)
 \longrightarrow0.                                \tag{6.1}
\]

If neither leverage estimate holds, the only remaining route inside this
decomposition is uniform cancellation of `theta_(z,h)` at the rate demanded
by (0.16).  Dimension `exp(O(lambda))+1` is not such an estimate.

The direct Ritz action `t=O(d_4L)`, both strict finite signs, and the far
and captured inverse-energy targets remain separate obligations.  Their
determinant-only responses are closed by (4.13) and (4.18).  No
standard-eight file, source lock, replay output, or formal-status file is
changed.

## 7. Reproduction

Run

    python3 -B -m unittest \
      tests.test_lower_ritz_ground_ridge_forcing_adapted_dangerous_response_barrier -v

The regression checks all twelve frozen hashes, ridge-specific harmonic
factorization, exact safe forcing annihilation, the three-term secular
energy ledger, full Mellin response splitting, dangerous leverage and phase,
the exact source-Cauchy parity blocks, both strict signs, positive ground
ridge, fixed safe floor, favorable sampling row, nonvanishing response,
displayed TeX, ASCII hygiene, and the fail-closed scope.
