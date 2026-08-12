# Fixed label-eight arithmetic synthesis gain

## 0. Outcome and claim boundary

This note proves a fixed-index improvement for the singleton label-8 block in
the split plus quotient.  The individual label-8 prolate mode has the explicit
first quasimode correction

\[
 \mu_8=-{147\over4},\qquad
 u_8={\sqrt{105}\over16\pi}h_4
       -{3\sqrt{330}\over32\pi}h_{12}.                  \tag{0.1}
\]

After the exact zero-integral ground correction, the resulting arithmetic
vector converges on the locked odd-half-integer, exponential-projection
schedule.  Its limit is not collinear with the label-4 anchor.  Consequently
the anchor-deflated physical column has a nonzero limit, while its exact
source metric satisfies `D_8/d_8 -> 1`.  In particular,

\[
 \boxed{M_8=\Theta(d_8^{-1})}                             \tag{0.2}
\]

instead of the previous coarse `O(lambda^2/d_8)` bound.

This sharpens the positive low-block action constant and forcing factor.  It
does not prove a signed lower floor.  The signed action conclusions below are
conditional on the hypotheses stated there.  No reducing property, physical
high-complement estimate, odd-sector comparison, equation (5.2) of
`DIRECT_RH_ATTACK.md`, determinant convergence, RH conclusion, or Lambda
bound is proved.  No status, replay, source-lock, artifact, or integration
file is changed.

## 1. Frozen dependencies and conventions

The proof uses the following exact bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/FIRST_PROLATE_CORRECTION_PROJECTION_GAIN.md` | `d5984831496b714400d8b70df739abe66e6571abd1a2f3dbda96d8b38f473edd` |
| `notes/PROLATE_DEFECT_SOURCE_AUDIT.md` | `b8256ce059d2632d55cb1b0477b5af7f5ebb09d0fc81a7d8b8e696885b49772d` |
| `notes/GROWING_TRANSITION_SAMPLING_THEOREM.md` | `551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72` |
| `notes/BLOCK_QUOTIENT_ACTION_THEOREM.md` | `31c4239b2dec0114be7b8e9b42e52ebc6361130461d1225e05c81ff5b26369d4` |
| `notes/LOW_BLOCK_FORCING_RATE_FULL_METRIC_BARRIER.md` | `93457a821e2fcf3771201af6cc4673ac5a4cd2410be722ad94f2d9f881f3e329` |
| `notes/ONE_SIDED_LOEWNER_ACTION_TRANSFER_BARRIER.md` | `643c54707b9dee31493a628f6fd8d1368a3a5eb4eb27d17d7e2acaa5a0448a9f` |

The Fourier convention is

\[
 ({\cal F}f)(y)=\int_{\mathbb R}f(x)e^{2\pi ixy}\,dx.     \tag{1.1}
\]

All prolate functions use Lebesgue measure on `[-lambda,lambda]`, are zero
extended, have unit norm, and use the source phase positive at zero.  Write

\[
 f_{n,\lambda}=h_{n,\lambda},\qquad
 d_n=1-\chi_{n,\lambda}^2,
 \qquad I_n=\int_{-\lambda}^{\lambda}f_{n,\lambda}.       \tag{1.2}
\]

The locked schedule used by the split plus theorem is

\[
 \lambda={p\over2},\quad p\ge5\text{ odd},\qquad
 L=2\log\lambda,\qquad N=2^{2400p^2}.                    \tag{1.3}
\]

## 2. The label-8 quasimode and point value

Divide the prolate differential operator by `lambda^2` and put
`epsilon=lambda^(-2)`.  Its exact expression on the moving interval is

\[
 A_\epsilon=H+\epsilon V,qquad
 H=-\partial_x^2+4\pi^2x^2,qquad
 Vf=\partial_x(x^2\partial_xf).                          \tag{2.1}
\]

For the unit Hermite functions,

\[
 Hh_n=E_nh_n,\qquad E_n=2\pi(2n+1),                      \tag{2.2}
\]

and the creation-annihilation calculation gives

\[
\begin{aligned}
 Vh_n={}&{1\over4}\sqrt{n(n-1)(n-2)(n-3)}\,h_{n-4}\\
 &-{2n^2+2n+3\over4}h_n\\
 &+{1\over4}\sqrt{(n+1)(n+2)(n+3)(n+4)}\,h_{n+4}.
\end{aligned}                                            \tag{2.3}
\]

At `n=8`, this is the explicit identity

\[
 Vh_8=\sqrt{105}\,h_4-{147\over4}h_8
              +{3\sqrt{330}\over2}h_{12}.              \tag{2.4}
\]

The gaps are `E_4-E_8=-16*pi` and `E_12-E_8=16*pi`.
Therefore (0.1) satisfies, term by term,

\[
 (H-E_8)u_8+(V-\mu_8)h_8=0,qquad
 \langle h_8,u_8\rangle=0.                              \tag{2.5}
\]

It follows directly, without an appeal to an unproved fixed-domain
perturbation expansion, that

\[
 \phi_{8,\lambda}=h_8+\epsilon u_8,\qquad
 \nu_{8,\lambda}=E_8+\epsilon\mu_8                      \tag{2.6}
\]

has exact residual

\[
 (A_\epsilon-\nu_{8,\lambda})\phi_{8,\lambda}
   =\epsilon^2(V-\mu_8)u_8.                              \tag{2.7}
\]

The right side is a fixed polynomial times `exp(-pi*x^2)`, so its full-line
norm is `O(epsilon^2)`.  Restriction creates no endpoint term: the natural
boundary expression `(1-x^2/lambda^2)phi'` vanishes at both moving
endpoints.

For completeness, the spectral isolation needed here is as follows.  The
quadratic forms

\[
 \mathfrak a_\lambda[f]=\int_{-\lambda}^{\lambda}
 \left((1-x^2/\lambda^2)|f'|^2+4\pi^2x^2|f|^2\right)dx   \tag{2.8}
\]

converge at every fixed index to the harmonic-oscillator form.  Hermite trial
spaces give the upper bounds.  Bounded form energy gives the uniform tail
estimate

\[
 \int_{|x|>R}|f(x)|^2dx
 \le {\mathfrak a_\lambda[f]\over4\pi^2R^2},             \tag{2.9}
\]

and on each fixed interval the derivative coefficient tends uniformly to
one.  Local Rellich compactness, followed by `R->infinity`, gives the lower
bounds and excludes spectral pollution.  Thus the eigenvalue near the simple
oscillator value `E_8` has a fixed positive gap from its neighbors for all
sufficiently large `lambda`.

Projecting (2.7) onto the exact prolate eigenbasis, using that fixed gap, and
normalizing the positive target coefficient gives

\[
 \boxed{
 \|f_{8,\lambda}-h_8-\lambda^{-2}u_8\|_{L^2(-\lambda,\lambda)}
       =O(\lambda^{-4}).}                                \tag{2.10}
\]

On a fixed neighborhood of zero, (2.1) is uniformly elliptic.  Apply the
one-dimensional interior `H2` estimate to the difference in (2.10), using
(2.7) and the corresponding eigenvalue error `O(lambda^(-4))`.  Sobolev
embedding gives the independent point-value conclusion

\[
 \boxed{
 f_{8,\lambda}(0)=h_8(0)+\lambda^{-2}u_8(0)
                         +O(\lambda^{-4}).}              \tag{2.11}
\]

Thus the `L2` extension and the point-value extension for label 8 have both
been proved explicitly.

## 3. The exact zero-integral label-8 source expansion

Put `v_n=h_n(0)`.  The needed Hermite origin ratios are

\[
 {v_4\over v_0}={\sqrt6\over4},\qquad
 {v_8\over v_0}={\sqrt{70}\over16},\qquad
 {v_{12}\over v_0}={\sqrt{231}\over32}.                 \tag{3.1}
\]

The already explicit ground correction is

\[
 \mu_0=-{3\over4},\qquad
 u_0=-{\sqrt6\over32\pi}h_4,qquad
 {u_0(0)\over v_0}=-{3\over64\pi}.                      \tag{3.2}
\]

Equation (0.1) and (3.1) give

\[
 {u_8(0)\over v_0}
 ={3\sqrt{70}\over64\pi}
   -{99\sqrt{70}\over1024\pi}
 =-{51\sqrt{70}\over1024\pi}.                         \tag{3.3}
\]

For labels divisible by four, the finite Fourier relation is

\[
 I_n=\chi_{n,\lambda}f_{n,\lambda}(0).                  \tag{3.4}
\]

The fixed-index concentration defect is exponentially small and hence
smaller than every algebraic order.  Combining (2.11), (3.2), and (3.3)
therefore yields

\[
 {I_8\over I_0}
 ={\sqrt{70}\over16}
  -{3\sqrt{70}\over64\pi}\lambda^{-2}
  +O(\lambda^{-4}).                                      \tag{3.5}
\]

In the exact split-block notation,

\[
 \boxed{
 \rho_8=-{I_8\over I_0}
 =-{\sqrt{70}\over16}
  +{3\sqrt{70}\over64\pi}\lambda^{-2}
  +O(\lambda^{-4}).}                                    \tag{3.6}
\]

Define the exact zero-integral source function

\[
 q_{8,\lambda}=f_{8,\lambda}+\rho_8f_{0,\lambda}.       \tag{3.7}
\]

Then, after zero extension,

\[
 q_{8,\lambda}=q_8+\lambda^{-2}q_{8,1}+O_{L^2}(\lambda^{-4}), \tag{3.8}
\]

where

\[
 q_8=h_8-{\sqrt{70}\over16}h_0,                         \tag{3.9}
\]

\[
 q_{8,1}={3\sqrt{70}\over64\pi}h_0
          +{17\sqrt{105}\over256\pi}h_4
          -{3\sqrt{330}\over32\pi}h_{12}.             \tag{3.10}
\]

The same expansion holds at zero.  Direct substitution of (3.1) in (3.10)
gives `q_(8,1)(0)=0`; also `q_8(0)=0`.  Every Hermite index in (3.9)--(3.10)
is divisible by four, so

\[
 {\cal F}q_8=q_8,qquad {\cal F}q_{8,1}=q_{8,1}.         \tag{3.11}
\]

Evaluation of (3.11) at zero gives zero integral for both limiting terms,
while (3.7) has zero integral exactly at every finite `lambda`.

For later comparison, the corresponding anchor expansion, obtained from the
same displayed `n=0,4` algebra, is

\[
 q_{4,\lambda}=q_4+\lambda^{-2}q_{4,1}+O_{L^2}(\lambda^{-4}), \tag{3.12}
\]

\[
 q_4=h_4-{\sqrt6\over4}h_0,qquad
 q_{4,1}={\sqrt6\over8\pi}h_0+{3\over64\pi}h_4
             -{\sqrt{105}\over16\pi}h_8.               \tag{3.13}
\]

Again the expansion holds at zero, and both displayed terms are Fourier
invariant with zero value and zero integral.

## 4. Arithmetic-vector convergence and exact noncollinearity

For a Schwartz source with zero extension, define its logarithmic arithmetic
image by

\[
 ({\cal E}f)(t)=e^{t/2}\sum_{m\ge1}f(me^t).              \tag{4.1}
\]

Let `C_lambda` restrict to `[-log(lambda),log(lambda)]`, let
`S_+=(I+J)/2` with `(JF)(t)=F(-t)`, and let `P_(lambda,N)` be the locked
orthogonal periodic log-Fourier projection.  Under the natural identification
of its coefficient vector with its projected function, the actual finite
columns are

\[
 p_j=P_{\lambda,N}S_+C_\lambda{\cal E}(q_{j,\lambda}),
 \qquad j=4,8.                                           \tag{4.2}
\]

Put

\[
 K_j={\cal E}(q_j),\qquad K_{j,1}={\cal E}(q_{j,1}).     \tag{4.3}
\]

Poisson summation and (3.11), or its label-4 counterpart, give
`K_j(-t)=K_j(t)` and the same identity for `K_(j,1)`.  All four functions are
smooth and decay faster than every exponential at both ends.

The elementary arithmetic transfer estimate is

\[
 \|{\cal E}r\|_{L^2(-\log\lambda,\log\lambda)}
 \le\lambda\|r\|_{L^2(0,\lambda)}.                     \tag{4.4}
\]

Apply (4.4) to the `O(lambda^(-4))` remainders in (3.8) and
(3.12).  Their arithmetic images are `O(lambda^(-3))`.  The omitted fixed
Gaussian tails are smaller than every inverse power.  Finally, repeated
periodic integration by parts bounds the Fourier tail of each fixed `K` by
`O_r(L^(r-1/2)N^(-r+1/2))`, plus superpolynomial endpoint terms.  On (1.3)
this is smaller than every inverse power.  Hence

\[
 \boxed{
 \|p_j-K_j-\lambda^{-2}K_{j,1}\|_2=O(\lambda^{-3}),
 \qquad j=4,8.}                                         \tag{4.5}
\]

In particular, both actual projected arithmetic vectors converge in `L2` on
the precise schedule used by the split-block theorem.

It remains to prove that their limits are genuinely independent.  Let

\[
 Q_j(s)=\int_0^\infty q_j(x)x^{s-1}\,dx.                \tag{4.6}
\]

Direct integration of the Hermite polynomials gives

\[
 Q_4(s)={2^{1/4}\sqrt6\over6}s(s-1)
          \pi^{-s/2}\Gamma(s/2),                        \tag{4.7}
\]

\[
 Q_8(s)={2^{1/4}\sqrt{70}\over420}s(s-1)
          (2s^2-2s+23)\pi^{-s/2}\Gamma(s/2).            \tag{4.8}
\]

Thus the exact Mellin relation is

\[
 \boxed{
 Q_8(s)={\sqrt{105}\over210}(2s^2-2s+23)Q_4(s).}       \tag{4.9}
\]

Initially for `Re(s)>1`, and then by continuation, the logarithmic Fourier--
Mellin identity reads

\[
 \widehat K_j(z)=\zeta(s)Q_j(s),\qquad s={1\over2}-iz.  \tag{4.10}
\]

If `K_8` were a scalar multiple of `K_4`, equations (4.9)--(4.10) on any
open set avoiding the isolated zeros of `zeta(s)Q_4(s)` would force the
nonconstant polynomial `2s^2-2s+23` to be constant.  Therefore

\[
 \boxed{K_4\ne0,\qquad K_8\notin\operatorname {span}\{K_4\}.} \tag{4.11}
\]

This is an exact source-specific noncollinearity theorem, not a numerical
rank observation.

## 5. The sharp singleton synthesis scale

Retain the exact split-block definitions

\[
 \alpha_8={\langle p_4,p_8\rangle\over\|p_4\|^2},
 \qquad W_8=P_{p_4^\perp}p_8=p_8-\alpha_8p_4,            \tag{5.1}
\]

\[
 b_8=\rho_8-\rho_4\alpha_8,qquad
 D_8=d_8+d_4|\alpha_8|^2+d_0|b_8|^2.                    \tag{5.2}
\]

Equation (4.5) and `K_4!=0` imply

\[
 \alpha_8\longrightarrow
 \alpha_\infty={\langle K_4,K_8\rangle\over\|K_4\|^2}. \tag{5.3}
\]

Together with the bounded coefficient limits in Section 3, this also makes
`b_8` bounded.  Moreover,

\[
 W_8\longrightarrow W_\infty
 :=K_8-\alpha_\infty K_4,                                \tag{5.4}
\]

and (4.11) gives `||W_infinity||>0`.

The pinned fixed-index defects satisfy

\[
 {d_4\over d_8}\sim{105\over4096\pi^4}\lambda^{-8},
 \qquad
 {d_0\over d_8}\sim{315\over2^{25}\pi^8}\lambda^{-16}. \tag{5.5}
\]

Boundedness of `alpha_8,b_8` in (5.2) now proves

\[
 \boxed{{D_8\over d_8}\longrightarrow1.}               \tag{5.6}
\]

Since the singleton normalized synthesis is
`A_8=W_8D_8^(-1/2)`, one has exactly

\[
 M_8=\|A_8\|^2={\|W_8\|^2\over D_8}.                   \tag{5.7}
\]

Equations (5.4)--(5.7) give the sharp limit

\[
 \boxed{
 d_8M_8\longrightarrow\|W_\infty\|^2>0,
 \qquad M_8=\Theta(d_8^{-1}).}                           \tag{5.8}
\]

The conclusion concerns the actual anchor-deflated arithmetic column on the
locked schedule.  It is stronger than a raw arithmetic-map norm bound and
does not require a smallest singular value for the full physical family.

## 6. Improved forcing and conditional action scales

Let `P(lambda)` denote one fixed enlarged positive polylogarithmic factor.
The frozen sampling theorem and the unchanged rest-block estimate give

\[
 C_8=O(\lambda P),\qquad C_R=O(\lambda^3P),              \tag{6.1}
\]

\[
 M_8=O(d_8^{-1}),\qquad
 M_R=O(\lambda^{-2}d_8^{-1}).                            \tag{6.2}
\]

The cross-aware row-operator inequality therefore improves to

\[
\begin{aligned}
 \Gamma_L(\Delta_L)
 &\le\left(\sqrt{C_8M_8}+\sqrt{C_RM_R}\right)^2\\
 &=\boxed{O\!\left({\lambda P(\lambda)\over d_8}\right)}.
\end{aligned}                                            \tag{6.3}
\]

Let `epsilon_lambda=o(d_6)` be the already proved complete radical
sample-square remainder.  Since

\[
 {d_6\over d_8}\sim{7\over32\pi^2}\lambda^{-4},        \tag{6.4}
\]

the positive forcing inequality gives

\[
 \|\Delta_L^{-1}c_L\|^2
 \le\epsilon_\lambda\Gamma_L
 =o(\lambda^{-3}P(\lambda)),                             \tag{6.5}
\]

and hence the unconditional sharpened forcing factor

\[
 \boxed{
 \|\Delta_L^{-1}c_L\|
 =o\!\left(\lambda^{-3/2}P(\lambda)^{1/2}\right).}      \tag{6.6}
\]

If the still-unproved uniform left-preconditioned reserve

\[
 \|\Delta_L^{-1}(B_L-\Delta_L)\|\le\rho_0<1            \tag{6.7}
\]

holds on the same range, then the left-close theorem conditionally transfers
(6.6), with the factor `(1-rho_0)^(-1)`, to `||B_L^(-1)c_L||`.

There is a distinct conditional consequence for a one-sided floor.  The new
synthesis bound gives

\[
 \|\Delta_L^{-1}\|\le M_8+M_R=O(d_8^{-1}),              \tag{6.8}
\]

while the symmetrically scaled sampling constant still obeys

\[
 C_{\Delta_L}(G_L)=\|SA\|^2\le C_8+C_R=O(\lambda^3P).   \tag{6.9}
\]

If the unproved comparison

\[
 B_L\succeq\mu_\lambda\Delta_L>0                       \tag{6.10}
\]

holds, the one-sided dominating-action theorem now yields

\[
 \|B_L^{-1}c_L\|^2
 =o\!\left(\mu_\lambda^{-2}\lambda^{-1}P(\lambda)\right), \tag{6.11}
\]

\[
 \boxed{
 \|B_L^{-1}c_L\|
 =o\!\left(\mu_\lambda^{-1}\lambda^{-1/2}
                    P(\lambda)^{1/2}\right).}           \tag{6.12}
\]

Thus a uniform positive one-sided floor would recover the earlier bridge
rate, but it remains one full factor `lambda` weaker than the newly sharpened
forcing factor (6.6).  Neither (6.7) nor (6.10) is proved here.

## 7. Final scope

The unconditional result is the actual fixed-label arithmetic synthesis gain
(5.8), together with the positive forcing improvement (6.6).  Equations
(6.7) and (6.10) are hypotheses, not conclusions.  Even either resulting
low-range action estimate would still need a reducing theorem or a complete
low/high Schur comparison before controlling the full signed inverse.

The physical high complement, all low/high signed couplings, the odd sector,
both uniform signed floors, equation (5.2), locally uniform determinant
convergence, RH, and every Lambda bound remain open.
