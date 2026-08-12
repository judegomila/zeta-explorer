# Fixed even-prefix arithmetic synthesis theorem

## 0. Outcome and quantifiers

Fix an integer \(m\geq3\).  On the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\ {\rm odd},\qquad
 L=2\log\lambda,\qquad N=2^{2400p^2},                    \tag{0.1}
\]

consider the inversion-even labels

\[
 {\cal T}_m=\{8,12,\ldots,4m\},\qquad
 {\cal R}_m=\{12,16,\ldots,4m\}.                         \tag{0.2}
\]

All constants and all eventual thresholds in this note may depend on the
fixed \(m\).  Since the transition index tends to infinity, every label in
(0.2) lies below it eventually.  Nothing here is uniform when
\(m=m(\lambda)\) grows.

The theorem has five parts.

1. Every fixed label \(t=4j\) has an explicit first Hermite quasimode,
   including an independent point-value expansion.
2. Its exact zero-integral finite source has a two-term limiting expansion,
   and its projected arithmetic vector converges with error
   \(O_{t}(\lambda^{-3})\).
3. The limiting vectors \(K_4,K_8,\ldots,K_{4m}\) form a triangular
   polynomial--Xi family and are linearly independent.  Anchor deflation
   therefore leaves a positive-definite limiting raw Gram matrix.
4. The fixed-prefix exterior metrics are asymptotic to their diagonal
   defect metrics.  Each column has synthesis scale
   \(\Theta(d_t^{-1})\), while the combined and rest-prefix scales are
   \(\Theta_m(d_8^{-1})\) and \(\Theta_m(d_{12}^{-1})\), respectively.
5. The condition number \(d_{4m}/d_8\) belongs to the whitened Gram, or
   equivalently to the nonzero squared singular spectrum.  The condition
   number of the synthesis itself is its square root.  The known scalar
   shift has the sharp fixed-depth whitened exponents, never raw ones.

This is a fixed-dimensional positive synthesis theorem.  It proves no
uniform-in-\(m\) frame, growing-rest lower frame, signed floor, inverse
action estimate, physical high-complement estimate, low/high reduction,
equation (5.2) of DIRECT_RH_ATTACK.md, determinant convergence, RH
conclusion, or Lambda bound.

## 1. Frozen dependencies and conventions

The proof uses the following exact bytes.

| Dependency | SHA-256 |
|---|---|
| notes/FIRST_PROLATE_CORRECTION_PROJECTION_GAIN.md | d5984831496b714400d8b70df739abe66e6571abd1a2f3dbda96d8b38f473edd |
| notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md | ecb1b165776fa259dfe01a758d137b5b0267dcbd762b05a6cc1adb9aa2dc6171 |
| notes/PROLATE_DEFECT_SOURCE_AUDIT.md | b8256ce059d2632d55cb1b0477b5af7f5ebb09d0fc81a7d8b8e696885b49772d |
| notes/GROWING_TRANSITION_SAMPLING_THEOREM.md | 551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72 |
| notes/BLOCK_QUOTIENT_ACTION_THEOREM.md | 31c4239b2dec0114be7b8e9b42e52ebc6361130461d1225e05c81ff5b26369d4 |
| notes/FIXED_LABEL_EIGHT_ARITHMETIC_SYNTHESIS_GAIN.md | 9e98b870419a721c8797e7577b6edf18649e50f6c9fe6f727dae61a53d6d7f71 |
| notes/FIXED_LABEL_SIX_ODD_ARITHMETIC_SYNTHESIS_GAIN.md | d90633671d5448c2586af1cbec11e02ef884e715b3f01ba3872815f6d17de771 |
| notes/POLYNOMIAL_XI_RADICAL_TOWER_COVARIANCE_FLOOR_OBSTRUCTION.md | 6281a93e4320e6c25fa09fdf942b94147a9b6aa1706b6c34dd079074d2f0ee98 |
| notes/GROWING_REST_SIGNED_RADICAL_TAIL_SCHUR_REDUCTION.md | 000be1947a8cc22e7f96a080b8775ce0343fbeb36f886929c7ea5188191e0932 |

The polynomial--Xi dependency treats the different all-order correction
tower.  It is used only as a proof template; Section 4 below rederives
triangularity for the label family \(q_{4j}\).

The Fourier convention is

\[
 ({\cal F}f)(y)=\int_{\mathbb R}f(x)e^{2\pi ixy}\,dx.     \tag{1.1}
\]

All prolate modes use Lebesgue measure on
\([-\lambda,\lambda]\), are zero extended, have unit norm, and use the
source phase positive at zero.  Write

\[
 f_{n,\lambda}=h_{n,\lambda},\qquad
 d_n=1-\chi_{n,\lambda}^2,\qquad
 I_n=\int_{-\lambda}^{\lambda}f_{n,\lambda}(x)\,dx.       \tag{1.2}
\]

For \(n\equiv0\pmod4\), the finite Fourier eigenvalue has positive phase:

\[
 I_n=\chi_{n,\lambda}f_{n,\lambda}(0).                   \tag{1.3}
\]

## 2. The generic fixed-label quasimode

Put \(\epsilon=\lambda^{-2}\).  The scaled prolate differential expression
on the moving interval is

\[
 A_\epsilon=H+\epsilon V,\qquad
 H=-\partial_x^2+4\pi^2x^2,\qquad
 Vf=\partial_x(x^2\partial_xf).                          \tag{2.1}
\]

For the unit Hermite functions,

\[
 Hh_n=E_nh_n,\qquad E_n=2\pi(2n+1),                      \tag{2.2}
\]

\[
\begin{aligned}
 Vh_n={}&{1\over4}\sqrt{n(n-1)(n-2)(n-3)}\,h_{n-4}\\
 &-{2n^2+2n+3\over4}h_n\\
 &+{1\over4}\sqrt{(n+1)(n+2)(n+3)(n+4)}\,h_{n+4}.
\end{aligned}                                            \tag{2.3}
\]

For a fixed \(t=4j\), define

\[
 \mu_t=-{2t^2+2t+3\over4},                               \tag{2.4}
\]

\[
\begin{aligned}
 u_t={}&{\sqrt{t(t-1)(t-2)(t-3)}\over64\pi}\,h_{t-4}\\
 &-{\sqrt{(t+1)(t+2)(t+3)(t+4)}\over64\pi}\,h_{t+4}.
\end{aligned}                                            \tag{2.5}
\]

At \(t=0\), the first term is absent.  Since
\(E_{t-4}-E_t=-16\pi\) and \(E_{t+4}-E_t=16\pi\),

\[
 (H-E_t)u_t+(V-\mu_t)h_t=0,\qquad
 \langle h_t,u_t\rangle=0.                              \tag{2.6}
\]

Thus

\[
 \phi_{t,\lambda}=h_t+\epsilon u_t,\qquad
 \nu_{t,\lambda}=E_t+\epsilon\mu_t                       \tag{2.7}
\]

has the exact residual

\[
 (A_\epsilon-\nu_{t,\lambda})\phi_{t,\lambda}
 =\epsilon^2(V-\mu_t)u_t.                                \tag{2.8}
\]

The right side is a fixed polynomial times \(e^{-\pi x^2}\).  The natural
boundary expression vanishes at \(x=\pm\lambda\), so restriction creates no
boundary distribution.  Hermite trial spaces, the form tail bound, and
local Rellich compactness give convergence of every fixed prolate
eigenvalue to the corresponding simple oscillator eigenvalue.  Hence the
target gap is bounded below eventually.  Projection of (2.8) onto the
exact prolate eigenbasis gives

\[
 \boxed{
 \|f_{t,\lambda}-h_t-\lambda^{-2}u_t\|_
 {L^2(-\lambda,\lambda)}=O_t(\lambda^{-4}).}             \tag{2.9}
\]

On a fixed neighborhood of zero, (2.1) is uniformly elliptic.  The
one-dimensional interior \(H^2\) estimate and Sobolev embedding applied to
the same difference prove independently

\[
 \boxed{
 f_{t,\lambda}(0)=h_t(0)+\lambda^{-2}u_t(0)
                         +O_t(\lambda^{-4}).}            \tag{2.10}
\]

For fixed \(m\), the finitely many estimates (2.9)--(2.10) hold
simultaneously after one \(m\)-dependent threshold.

## 3. Exact finite cancellation and the two limiting coefficients

Put \(v_t=h_t(0)\) and

\[
 r_t={v_t\over v_0}
 ={ \sqrt{t!}\over 2^{t/2}(t/2)!},\qquad t\equiv0\pmod4. \tag{3.1}
\]

The consecutive Hermite origin ratios simplify the two terms in (2.5):

\[
 {\sqrt{t(t-1)(t-2)(t-3)}\,v_{t-4}\over v_t}=t(t-2),
\]

\[
 {\sqrt{(t+1)(t+2)(t+3)(t+4)}\,v_{t+4}\over v_t}
 =(t+1)(t+3).                                           \tag{3.2}
\]

Consequently

\[
 \boxed{{u_t(0)\over v_t}=-{3(2t+1)\over64\pi}.}         \tag{3.3}
\]

In particular \(u_0=-\sqrt6\,h_4/(32\pi)\) and
\(u_0(0)/v_0=-3/(64\pi)\).  The fixed-index concentration defects are
smaller than every algebraic power, so (1.3), (2.10), and (3.3) give

\[
 {I_t\over I_0}
 =r_t\left(1-{3t\over32\pi}\lambda^{-2}\right)
   +O_t(\lambda^{-4}),                                   \tag{3.4}
\]

\[
 \rho_t:=-{I_t\over I_0}
 =-r_t+{3tr_t\over32\pi}\lambda^{-2}
   +O_t(\lambda^{-4}).                                   \tag{3.5}
\]

Define the exact finite source and its two limiting coefficients by

\[
 q_{t,\lambda}=f_{t,\lambda}+\rho_tf_{0,\lambda},        \tag{3.6}
\]

\[
 q_t=h_t-r_th_0,                                         \tag{3.7}
\]

\[
 q_{t,1}=u_t-r_tu_0+{3tr_t\over32\pi}h_0.               \tag{3.8}
\]

Then

\[
 \boxed{
 q_{t,\lambda}=q_t+\lambda^{-2}q_{t,1}
                   +O_{t,L^2}(\lambda^{-4}).}           \tag{3.9}
\]

Every Hermite label in (3.7)--(3.8) is divisible by four.  Equations
(3.1)--(3.3) therefore give the exact limiting identities

\[
 {\cal F}q_t=q_t,\qquad q_t(0)=\int_{\mathbb R}q_t=0,    \tag{3.10}
\]

\[
 {\cal F}q_{t,1}=q_{t,1},\qquad
 q_{t,1}(0)=\int_{\mathbb R}q_{t,1}=0.                  \tag{3.11}
\]

The finite source has exact zero integral by definition:

\[
 \int_{\mathbb R}q_{t,\lambda}=0.                        \tag{3.12}
\]

Its point value, however, is generally not zero.  Equation (1.3) gives the
exact distinction

\[
 q_{t,\lambda}(0)
 =f_{t,\lambda}(0)\left(1-{\chi_{t,\lambda}\over
                                  \chi_{0,\lambda}}\right)
 =O_{t,A}(\lambda^{-A})                                  \tag{3.13}
\]

for every fixed \(A\), but not an exact finite-\(\lambda\) cancellation.
Only \(q_t\) and \(q_{t,1}\) have both exact zero point value and exact zero
integral.

## 4. Arithmetic convergence and polynomial--Xi triangularity

For a zero-extended Schwartz source, put

\[
 ({\cal E}f)(x)=e^{x/2}\sum_{n\geq1}f(ne^x).             \tag{4.1}
\]

Let \(C_\lambda\) restrict to
\([-\log\lambda,\log\lambda]\), let \(S_+=(I+J)/2\) be inversion
symmetrization, and let \(P_{\lambda,N}\) be the locked periodic
log-Fourier projection.  Define

\[
 p_t=P_{\lambda,N}S_+C_\lambda{\cal E}(q_{t,\lambda}),
\quad K_t={\cal E}(q_t),\quad K_{t,1}={\cal E}(q_{t,1}). \tag{4.2}
\]

The elementary arithmetic transfer loses one power of \(\lambda\):

\[
 \|{\cal E}r\|_{L^2(-\log\lambda,\log\lambda)}
 \leq\lambda\|r\|_{L^2(0,\lambda)}.                     \tag{4.3}
\]

The fixed polynomial-Gaussian tails are smaller than every inverse power,
and repeated periodic integration by parts makes the projection error
smaller than every inverse power on (0.1).  Therefore, simultaneously for
the fixed labels through \(4m\),

\[
 \boxed{
 \|p_t-K_t-\lambda^{-2}K_{t,1}\|_2
 =O_{t}(\lambda^{-3}).}                                  \tag{4.4}
\]

We now prove independence for this label family.  Let

\[
 Q_t(s)=\int_0^\infty q_t(x)x^{s-1}\,dx.                \tag{4.5}
\]

For \(t=4j\), direct integration of the normalized Hermite polynomial gives

\[
 \int_0^\infty h_t(x)x^{s-1}\,dx
 ={v_t\over2}\pi^{-s/2}\Gamma(s/2)R_t(s),               \tag{4.6}
\]

\[
 R_t(s)=\sum_{a=0}^{2j}
 {(-1)^a(2j)!\,4^a\over(2j-a)!(2a)!}
 \prod_{\ell=0}^{a-1}(s+2\ell).                         \tag{4.7}
\]

Since \(q_t=h_t-r_th_0\), its polynomial factor is
\(R_t(s)-1\).  This has degree \(2j\) and nonzero leading coefficient.
The exact zero integral and point value give the factors \(s(s-1)\).
Fourier invariance makes the remaining quotient invariant under
\(s\mapsto1-s\).  If

\[
 z=s(s-1),                                               \tag{4.8}
\]

there is consequently a polynomial \(P_{j-1}\) of degree exactly
\(j-1\), with nonzero leading coefficient, such that

\[
 \boxed{Q_{4j}(s)=Q_4(s)P_{j-1}(z).}                    \tag{4.9}
\]

This uses \(z\) only for the Mellin invariant (4.8), not for Fourier
frequency.  The unique top Hermite term \(h_{t+4}\) in \(q_{t,1}\) likewise
shows that its polynomial--Xi multiplier has degree exactly \(j\).

For real Fourier frequency \(\xi\), put \(s=1/2-i\xi\).  The
Fourier--Mellin identity gives

\[
 \widehat K_t(\xi)=\zeta(s)Q_t(s).                       \tag{4.10}
\]

Equivalently, constants being absorbed into the multipliers,

\[
 \widehat K_{4j}(\xi)=\widetilde P_{j-1}(\xi^2)\Xi(\xi),
\qquad \deg\widetilde P_{j-1}=j-1.                      \tag{4.11}
\]

On an open set where the common analytic factor in (4.10) is nonzero, a
linear relation among \(K_4,K_8,\ldots,K_{4m}\) becomes a relation among
polynomials of distinct degrees.  Hence

\[
 \boxed{K_4,K_8,\ldots,K_{4m}\ {\rm are\ linearly\ independent}.}
                                                               \tag{4.12}
\]

## 5. Anchor deflation and the raw fixed-prefix Gram

For \(t\in{\cal T}_m\), define

\[
 \alpha_t={\langle p_4,p_t\rangle\over\|p_4\|^2},
\qquad W_t=p_t-\alpha_tp_4,\qquad
 b_t=\rho_t-\rho_4\alpha_t.                              \tag{5.1}
\]

Since \(K_4\neq0\), equation (4.4) gives

\[
 \alpha_t\longrightarrow
 \alpha_{t,\infty}
 ={\langle K_4,K_t\rangle\over\|K_4\|^2},               \tag{5.2}
\]

\[
 W_t\longrightarrow
 W_{t,\infty}=K_t-\alpha_{t,\infty}K_4.                 \tag{5.3}
\]

Deflated independence follows from (4.12):

\[
 \{W_{8,\infty},W_{12,\infty},\ldots,W_{4m,\infty}\}
 \quad{\rm is\ linearly\ independent}.                 \tag{5.4}
\]

Let \(W_m:\mathbb C^{m-1}\to{\cal H}\) be the synthesis with these
columns and put

\[
 G_m=W_m^*W_m,\qquad
 (G_{m,\infty})_{st}=\langle W_{s,\infty},W_{t,\infty}\rangle.
                                                               \tag{5.5}
\]

Then

\[
 G_m\longrightarrow G_{m,\infty}\succ0.                 \tag{5.6}
\]

Thus there are constants \(0<c_m<C_m<\infty\) such that, eventually,

\[
 \boxed{c_mI\preceq G_m\preceq C_mI.}                   \tag{5.7}
\]

In particular the actual fixed-prefix synthesis is eventually injective
and its raw source Gram has bounded condition number.  This is a
fixed-\(m\) statement and says nothing about the least raw Gram eigenvalue
when the prefix depth grows.

## 6. Exterior metric hierarchy

The fixed-index defect formula is

\[
 d_n\sim A_n\lambda^{2n+1}e^{-4\pi\lambda^2},\qquad
 A_n=4\sqrt2\,\pi{(16\pi)^n\over n!}.                   \tag{6.1}
\]

Hence, for fixed \(s<t\),

\[
 \boxed{
 {d_s\over d_t}\sim {t!\over s!}(16\pi)^{s-t}
                 \lambda^{-2(t-s)}.}                    \tag{6.2}
\]

The anchor-deflated source vector is

\[
 e_t-\alpha_te_4+b_te_0.                                \tag{6.3}
\]

Its scalar exterior metric is

\[
 \boxed{D_t=d_t+d_4|\alpha_t|^2+d_0|b_t|^2.}            \tag{6.4}
\]

The coefficients in (5.1) are bounded, so for each fixed
\(t\in{\cal T}_m\),

\[
 \boxed{{D_t\over d_t}\longrightarrow1.}                \tag{6.5}
\]

For the full fixed prefix, write

\[
 D_{T,m}=\operatorname {diag}_{t\in{\cal T}_m}(d_t),
\qquad
 D_{{\rm pre},m}
 =D_{T,m}+d_4\alpha\alpha^*+d_0bb^*.                    \tag{6.6}
\]

For the fixed rest, restrict the same formula to
\({\cal R}_m\) and call the result \(D_{R,m}\).  Weighted
Cauchy--Schwarz and (6.2) give

\[
 \boxed{
 \|D_{T,m}^{-1/2}D_{{\rm pre},m}D_{T,m}^{-1/2}-I\|
 =O_m(\lambda^{-8}),}                                    \tag{6.7}
\]

\[
 \boxed{
 \|D_{T,R}^{-1/2}D_{R,m}D_{T,R}^{-1/2}-I\|
 =O_m(\lambda^{-16}).}                                   \tag{6.8}
\]

The established singleton/rest quotient uses

\[
 D_{{\rm split},m}=D_8\oplus D_{R,m}.                   \tag{6.9}
\]

It is also \(I+O_m(\lambda^{-8})\) relative to
\(D_{T,m}\).  The omitted full exterior singleton/rest cross, when
whitened by the diagonal defects, is \(O_m(\lambda^{-12})\).  These are
finite-prefix comparisons only; they do not identify the growing split
metric with a growing full exterior source Gram.

For later distinction also define the scalar block diagonal

\[
 D_{{\rm bd},m}=\operatorname {diag}_{t\in{\cal T}_m}(D_t).
                                                               \tag{6.10}
\]

It is \(I+O_m(\lambda^{-8})\) relative to \(D_{T,m}\).  All three fixed
metrics in (6.6), (6.9), and (6.10) are therefore asymptotically equivalent,
but they are not literally the same matrix.

## 7. Per-column, joint, and spectral synthesis scales

For one column put

\[
 A_t=W_tD_t^{-1/2},\qquad M_t=\|A_t\|^2.                \tag{7.1}
\]

Equations (5.3) and (6.5) give

\[
 \boxed{
 d_tM_t\longrightarrow\|W_{t,\infty}\|^2>0,\qquad
 M_t=\Theta_m(d_t^{-1}).}                               \tag{7.2}
\]

For the combined scalar-block whitening define

\[
 A_m=W_mD_{{\rm bd},m}^{-1/2},\qquad
 {\cal G}_m=A_m^*A_m
 =D_{{\rm bd},m}^{-1/2}G_mD_{{\rm bd},m}^{-1/2}.        \tag{7.3}
\]

The raw Gram bounds (5.7), the metric equivalence, and defect ordering
imply

\[
 \lambda_{\max}({\cal G}_m)=\Theta_m(d_8^{-1}),\qquad
 \lambda_{\min}({\cal G}_m)=\Theta_m(d_{4m}^{-1}).       \tag{7.4}
\]

Thus

\[
 \boxed{\|A_m\|^2=\Theta_m(d_8^{-1}),}                  \tag{7.5}
\]

\[
 \boxed{
 \kappa({\cal G}_m)
 =\Theta_m\!\left({d_{4m}\over d_8}\right)
 =\Theta_m(\lambda^{8m-16}).}                            \tag{7.6}
\]

The same conclusions hold if \(D_{{\rm bd},m}\) is replaced by either
fixed metric in (6.6) or (6.9), because the relative perturbations tend to
zero.

The nonzero spectrum of the ambient physical operator \(A_mA_m^*\)
equals the spectrum of \({\cal G}_m\).  Ambient zero eigenvalues are not
part of (7.6).  Moreover the singular-value condition number of the
synthesis is

\[
 \boxed{
 \operatorname {cond}_2(A_m)
 =\sqrt{\kappa({\cal G}_m)}
 =\Theta_m\!\left(\sqrt{d_{4m}/d_8}\right)
 =\Theta_m(\lambda^{4m-8}).}                             \tag{7.7}
\]

It is not \(d_{4m}/d_8\).

For the fixed rest synthesis
\(A_{R,m}=W_{R,m}D_{R,m}^{-1/2}\), the corresponding statements are

\[
 \boxed{
 \|A_{R,m}\|^2=\Theta_m(d_{12}^{-1})
 =\Theta_m(\lambda^{-8}d_8^{-1}),}                       \tag{7.8}
\]

\[
 \kappa_+(A_{R,m}A_{R,m}^*)
 =\Theta_m(d_{4m}/d_{12})
 =\Theta_m(\lambda^{8m-24}),                             \tag{7.9}
\]

\[
 \operatorname {cond}_2(A_{R,m})
 =\Theta_m(\lambda^{4m-12}).                             \tag{7.10}
\]

Here \(\kappa_+\) explicitly means the condition number on the nonzero
spectrum.  The raw fixed-prefix Gram remains uniformly conditioned for
fixed \(m\); the powers in (7.6)--(7.10) arise solely from whitening by
the strongly anisotropic defect metric.

## 8. Fixed-depth whitened scalar-shift ledger

The admitted projected-state theorem gives, on the same locked schedule,

\[
 |U|=o(d_6).                                             \tag{8.1}
\]

For fixed \(s,t\in{\cal T}_m\), equations (6.1) and (7.2) yield

\[
 |U|\,\|A_s\|\,\|A_t\|
 =o\!\left({d_6\over\sqrt{d_sd_t}}\right)
 =\boxed{o(\lambda^{12-s-t})}.                           \tag{8.2}
\]

Because the prefix dimensions are fixed, entrywise estimates give the
operator bounds

\[
 \boxed{\|U A_m^*A_m\|=o(\lambda^{-4}),}                \tag{8.3}
\]

\[
 \boxed{\|U A_{R,m}^*A_{R,m}\|=o(\lambda^{-12}),}       \tag{8.4}
\]

\[
 \boxed{\|U A_{R,m}^*A_8\|=o(\lambda^{-8}).}            \tag{8.5}
\]

Equations (8.2)--(8.5) concern whitened blocks only.  They do not give
these powers for the raw matrices \(UG_m\), \(UG_{R,m}\), or their raw
cross blocks.  They also do not prove a signed floor whose erosion could be
estimated.

## 9. Exact boundary

For every fixed \(m\geq3\), the theorem proves the quasimode and point
expansions, exact finite zero-integral correction, two-term arithmetic
convergence, polynomial--Xi triangularity, deflated independence, eventual
raw-Gram injectivity, metric hierarchy, sharp per-column and joint
synthesis scales, the nonzero-spectrum condition numbers, and the
fixed-depth whitened shift ledger.

The theorem is not uniform in \(m\).  In particular, it supplies no lower
bound for the growing polynomial--Xi Gram, no growing-rest covariance
floor, no signed singleton-short inequality, no residual action, no odd
floor, no physical high-complement or low/high cross theorem, no reducing
property, no full natural-cutoff positivity, no equation (5.2), no locally
uniform determinant convergence, no RH conclusion, and no Lambda bound.
