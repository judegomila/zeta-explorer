# Fixed label-six odd arithmetic synthesis gain

## 0. Outcome and claim boundary

This note proves the odd analogue of the fixed label-eight arithmetic
synthesis theorem.  The source phases in the residue class `2 mod 4` are
chosen positive at the origin.  The first two relevant prolate quasimodes
then have the explicit corrections

\[
 \mu _2=-{15\over4},\qquad
 u_2=-{3\sqrt {10}\over32\pi}h_6,                       \tag{0.1}
\]

\[
 \mu _6=-{87\over4},\qquad
 u_6={3\sqrt {10}\over32\pi}h_2
       -{3\sqrt {35}\over16\pi}h_{10}.                 \tag{0.2}
\]

After the exact zero-integral label-2 correction, the actual projected odd
arithmetic column converges on the locked odd-half-integer,
exponential-projection schedule.  Its nonzero limit is exactly a constant
multiple of the logarithmic derivative of the label-4 even limit.  The
source metric of the singleton satisfies `D_6/d_6 -> 1`.  Consequently

\[
 \boxed{d_6M_6\longrightarrow\|K_6\|_2^2
        ={2\over15}\|K_4'\|_2^2>0,\qquad
        M_6=\Theta(d_6^{-1}).}                           \tag{0.3}
\]

For the deliberately block-diagonal odd quotient made from label 6 and the
remaining targets `10,14,...`, this also gives

\[
 \boxed{d_6\|\Delta_-^{-1}\|\longrightarrow\|K_6\|_2^2,
 \qquad
 {\lambda_{\min}(\Delta_-)\over d_6}
       \longrightarrow\|K_6\|_2^{-2}.}                 \tag{0.4}
\]

The positive paired-zero sampling action has the sharpened scale

\[
 \boxed{\Gamma_-(\Delta_-)
 =O\!\left({\lambda P(\lambda)\over d_6}\right)}        \tag{0.5}
\]

for one fixed enlarged positive polylogarithmic factor `P`.  In particular,
the already proved shift `U_0=o(d_6)` erodes any hypothetical uniform
unshifted signed quotient floor by only `o(1)`.

The last statement is conditional: this note proves no signed odd floor.
The actual residual forcing is inversion even, so (0.5) creates no new odd
residual-action conclusion.  The odd negative pole, physical co-frame,
physical high complement, low--high signed cross, reducing property,
equation (5.2) of `DIRECT_RH_ATTACK.md`, determinant convergence, RH, and
every Lambda bound remain open.  Existing generic Schur and high-complement
barriers are cited below and are not repackaged here.  No status, replay,
source-lock, artifact, or integration file is changed.

## 1. Frozen dependencies and conventions

The proof uses the following exact bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/FIXED_LABEL_EIGHT_ARITHMETIC_SYNTHESIS_GAIN.md` | `9e98b870419a721c8797e7577b6edf18649e50f6c9fe6f727dae61a53d6d7f71` |
| `notes/FIRST_PROLATE_CORRECTION_PROJECTION_GAIN.md` | `d5984831496b714400d8b70df739abe66e6571abd1a2f3dbda96d8b38f473edd` |
| `notes/PROLATE_DEFECT_SOURCE_AUDIT.md` | `b8256ce059d2632d55cb1b0477b5af7f5ebb09d0fc81a7d8b8e696885b49772d` |
| `notes/GROWING_TRANSITION_SAMPLING_THEOREM.md` | `551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72` |
| `notes/BLOCK_QUOTIENT_ACTION_THEOREM.md` | `31c4239b2dec0114be7b8e9b42e52ebc6361130461d1225e05c81ff5b26369d4` |
| `notes/SIGNED_QUOTIENT_CAPTURE_REDUCTION.md` | `9700501a367ea7ae2b843ee61b45bec3970fc35db1715613099b08439be0415c` |
| `notes/HYBRID_OUTER_SAMPLING_ODD_SHIFT_THEOREM.md` | `113be74d52f48d66903c1babf1525ec6d130243321acfa31562abd8640868a3a` |
| `notes/PROJECTED_STATE_NORM_LOWER_BOUND.md` | `3847cbcb6e5bfc458af7bf957ff67afb0b943155d62f4239129b40332d270fbf` |
| `notes/PHYSICAL_LEVERAGE_SHORTED_SCHUR.md` | `39147b7fcd5c71304c6977272b72a3f07a789b7c4fb34d2e2ebf51e3b60589f3` |
| `notes/LOW_BLOCK_FORCING_RATE_FULL_METRIC_BARRIER.md` | `93457a821e2fcf3771201af6cc4673ac5a4cd2410be722ad94f2d9f881f3e329` |

The Fourier convention is

\[
 ({\cal F}f)(y)=\int_{\mathbb R}f(x)e^{2\pi ixy}\,dx.   \tag{1.1}
\]

All prolate functions use Lebesgue measure on `[-lambda,lambda]`, are zero
extended, have unit norm, and use the source phase positive at zero.  Put

\[
 f_{n,\lambda}=h_{n,\lambda},\qquad
 d_n=1-\chi_{n,\lambda}^2,\qquad
 I_n=\int_{-\lambda}^{\lambda}f_{n,\lambda}(x)\,dx.      \tag{1.2}
\]

For the Hermite residue class `n=2 mod 4`, use the phase positive at zero.
This multiplies every conventional Hermite function in that residue class
by the same minus sign.  Therefore it does not change any within-class
matrix coefficient of the operator `V` below.  In this convention

\[
 h_n(0)>0,\qquad {\cal F}h_n=-h_n
 \quad(n=2,6,10,\ldots).                                \tag{1.3}
\]

The locked schedule is

\[
 \lambda={p\over2},\quad p\geq5\text{ odd},\qquad
 L=2\log\lambda,\qquad N=2^{2400p^2}.                   \tag{1.4}
\]

All asymptotic starting thresholds below are qualitative.  No fixed-index
source used here supplies an effective first value of `p`.

## 2. The label-2 and label-6 quasimodes

Divide the prolate differential operator by `lambda^2` and put
`epsilon=lambda^(-2)`.  On the moving interval its exact expression is

\[
 A_\epsilon=H+\epsilon V,\qquad
 H=-\partial_x^2+4\pi^2x^2,\qquad
 Vf=\partial_x(x^2\partial_xf).                         \tag{2.1}
\]

The unit Hermite functions obey

\[
 Hh_n=E_nh_n,\qquad E_n=2\pi(2n+1),                     \tag{2.2}
\]

and the exact creation-annihilation calculation gives

\[
\begin{aligned}
 Vh_n={}&{1\over4}\sqrt{n(n-1)(n-2)(n-3)}\,h_{n-4}\\
 &-{2n^2+2n+3\over4}h_n\\
 &+{1\over4}\sqrt{(n+1)(n+2)(n+3)(n+4)}\,h_{n+4}.
\end{aligned}                                           \tag{2.3}
\]

The absent negative-index term is understood.  At the two required labels,

\[
 Vh_2=-{15\over4}h_2+{3\sqrt {10}\over2}h_6,           \tag{2.4}
\]

\[
 Vh_6={3\sqrt {10}\over2}h_2-{87\over4}h_6
                         +3\sqrt {35}\,h_{10}.          \tag{2.5}
\]

The gaps in (2.4)--(2.5) are `E_6-E_2=16*pi`,
`E_2-E_6=-16*pi`, and `E_10-E_6=16*pi`.  Consequently
(0.1)--(0.2) satisfy

\[
 (H-E_n)u_n+(V-\mu_n)h_n=0,
 \qquad \langle h_n,u_n\rangle=0,
 \qquad n=2,6.                                         \tag{2.6}
\]

Thus

\[
 \phi_{n,\lambda}=h_n+\epsilon u_n,\qquad
 \nu_{n,\lambda}=E_n+\epsilon\mu_n                    \tag{2.7}
\]

has exact residual

\[
 (A_\epsilon-\nu_{n,\lambda})\phi_{n,\lambda}
 =\epsilon^2(V-\mu_n)u_n.                              \tag{2.8}
\]

The right side is a fixed polynomial times `exp(-pi*x^2)`, with full-line
norm `O(epsilon^2)`.  The natural endpoint expression
`(1-x^2/lambda^2)phi'` vanishes at both moving endpoints.

The fixed-index form-convergence argument is the same one displayed in the
label-eight theorem.  Hermite trial spaces give the upper eigenvalue bounds;
the potential tail estimate and local Rellich compactness give the lower
bounds and exclude spectral pollution.  The oscillator eigenvalues are
simple, so the two target eigenvalues have fixed positive gaps for all
sufficiently large `lambda`.  Projection of (2.8) onto the exact prolate
eigenbasis, with the positive-at-zero phase, proves

\[
 \boxed{
 \|f_{n,\lambda}-h_n-\lambda^{-2}u_n\|_{L^2(-\lambda,\lambda)}
 =O(\lambda^{-4}),\qquad n=2,6.}                        \tag{2.9}
\]

On a fixed neighborhood of zero, (2.1) is uniformly elliptic.  The local
one-dimensional `H2` estimate and Sobolev embedding also give

\[
 \boxed{
 f_{n,\lambda}(0)=h_n(0)+\lambda^{-2}u_n(0)
                         +O(\lambda^{-4}),\qquad n=2,6.} \tag{2.10}
\]

This proves both extensions needed below; no unproved fixed-domain
perturbation expansion is being invoked.

## 3. The exact zero-integral odd source

Put `v_n=h_n(0)`.  In the positive-at-zero phase,

\[
 v_2=2^{-1/4},\qquad
 {v_6\over v_2}={\sqrt {10}\over4},\qquad
 {v_{10}\over v_2}={3\sqrt {14}\over16}.               \tag{3.1}
\]

Equations (0.1)--(0.2) and (3.1) give

\[
 {u_2(0)\over v_2}=-{15\over64\pi},\qquad
 {u_6(0)\over v_2}=-{39\sqrt {10}\over256\pi}.         \tag{3.2}
\]

For labels congruent to two modulo four, the finite Fourier relation has
the mandatory minus sign

\[
 I_n=-\chi_{n,\lambda}f_{n,\lambda}(0).                 \tag{3.3}
\]

The fixed-index concentration defects are exponentially small and hence
smaller than every algebraic order.  Combining (2.10)--(3.3) yields

\[
 \boxed{
 a_6:={I_6\over I_2}
 ={\sqrt {10}\over4}
  -{3\sqrt {10}\over32\pi}\lambda^{-2}
  +O(\lambda^{-4}).}                                    \tag{3.4}
\]

Define the exact zero-integral source function

\[
 q_{6,\lambda}=-f_{6,\lambda}+a_6f_{2,\lambda}.         \tag{3.5}
\]

After zero extension,

\[
 q_{6,\lambda}=q_6+\lambda^{-2}q_{6,1}
                         +O_{L^2}(\lambda^{-4}),         \tag{3.6}
\]

where

\[
 q_6=-h_6+{\sqrt {10}\over4}h_2,                       \tag{3.7}
\]

\[
 q_{6,1}=-{3\sqrt {10}\over16\pi}h_2
          -{15\over64\pi}h_6
          +{3\sqrt {35}\over16\pi}h_{10}.             \tag{3.8}
\]

The same expansion holds at zero.  Direct substitution of (3.1) gives

\[
 q_6(0)=q_{6,1}(0)=0.                                   \tag{3.9}
\]

Every Hermite label in (3.7)--(3.8) is congruent to two modulo four, so

\[
 {\cal F}q_6=-q_6,\qquad {\cal F}q_{6,1}=-q_{6,1}.      \tag{3.10}
\]

Evaluating (3.10) at zero proves that both displayed limiting terms have
zero integral.  Equation (3.5) has zero integral exactly at every finite
`lambda`.

## 4. Odd arithmetic-vector convergence and the derivative identity

For a Schwartz source define its logarithmic arithmetic image by

\[
 ({\cal E}f)(t)=e^{t/2}\sum_{m\geq1}f(me^t).             \tag{4.1}
\]

Let `C_lambda` restrict to `[-log(lambda),log(lambda)]`, let
`S_-=(I-J)/2` with `(JF)(t)=F(-t)`, and let `P_(lambda,N)` be the locked
orthogonal periodic log-Fourier projection.  The actual odd singleton is

\[
 p_6=P_{\lambda,N}S_-C_\lambda{\cal E}(q_{6,\lambda}).  \tag{4.2}
\]

Put

\[
 K_6={\cal E}(q_6),\qquad K_{6,1}={\cal E}(q_{6,1}).     \tag{4.3}
\]

Poisson summation and (3.9)--(3.10) give

\[
 K_6(-t)=-K_6(t),\qquad K_{6,1}(-t)=-K_{6,1}(t).        \tag{4.4}
\]

Both functions are smooth and decay faster than every exponential at both
ends.  The elementary transfer estimate is

\[
 \|{\cal E}r\|_{L^2(-\log\lambda,\log\lambda)}
 \leq\lambda\|r\|_{L^2(0,\lambda)}.                    \tag{4.5}
\]

Apply (4.5) to the remainder in (3.6).  It becomes `O(lambda^(-3))`.
The omitted fixed Gaussian tails are smaller than every inverse power.
Repeated periodic integration by parts makes the locked Fourier-projection
tail superpolynomially small on (1.4).  Since `S_-` fixes the two limits in
(4.4),

\[
 \boxed{
 \|p_6-K_6-\lambda^{-2}K_{6,1}\|_2=O(\lambda^{-3}).}    \tag{4.6}
\]

There is also an exact source-specific nonvanishing check.  Direct expansion
of the positive-at-zero Hermites gives

\[
 q_6(x)={2^{1/4}\over96\sqrt5}
 \left(960\pi x^2-1920\pi^2x^4+512\pi^3x^6\right)
 e^{-\pi x^2}.                                          \tag{4.7}
\]

For

\[
 Q_6(s)=\int_0^\infty q_6(x)x^{s-1}\,dx,               \tag{4.8}
\]

termwise Gaussian integration gives

\[
 \boxed{
 Q_6(s)={2^{1/4}\over6\sqrt5}s(s-1)(2s-1)
              \pi^{-s/2}\Gamma(s/2).}                  \tag{4.9}
\]

The label-4 transform from the fixed label-eight theorem therefore obeys

\[
 \boxed{Q_6(s)={2s-1\over\sqrt {30}}Q_4(s).}            \tag{4.10}
\]

With the locked logarithmic Fourier sign

\[
 \widehat K(z)=\int_{\mathbb R}K(t)e^{-izt}\,dt,
 \qquad s={1\over2}-iz,                                \tag{4.11}
\]

the Fourier--Mellin identity is

\[
 \widehat K_j(z)=\zeta(s)Q_j(s).                        \tag{4.12}
\]

Equations (4.10)--(4.12) prove

\[
 \widehat K_6(z)=-{2iz\over\sqrt {30}}\widehat K_4(z),
 \qquad
 \boxed{K_6=-{2\over\sqrt {30}}K_4'.}                 \tag{4.13}
\]

The even function `K_4` is a nonzero logarithmic `L2` function, so its
derivative cannot vanish identically.  Hence

\[
 \boxed{K_6\ne0,\qquad
 \|K_6\|_2^2={2\over15}\|K_4'\|_2^2>0.}               \tag{4.14}
\]

This continuum derivative identity does not assert finite `H1` convergence
of the projected anchor and does not prove the endpoint-residual odd Schur
condition.

## 5. The sharp singleton metric

The exact source exterior metric of (3.5) is

\[
 \boxed{D_6=d_6+a_6^2d_2.}                              \tag{5.1}
\]

The pinned fixed-index defects satisfy

\[
 {d_2\over d_6}
 \sim {45\over8192\pi^4}\lambda^{-8}.                  \tag{5.2}
\]

Boundedness of `a_6` in (3.4) gives

\[
 \boxed{{D_6\over d_6}\longrightarrow1.}              \tag{5.3}
\]

There is no anchor deflation in the odd singleton.  Put

\[
 W_6z=zp_6,\qquad A_6=W_6D_6^{-1/2},\qquad
 M_6=\|A_6\|^2={\|p_6\|^2\over D_6}.                   \tag{5.4}
\]

Equations (4.6), (4.14), and (5.3) prove

\[
 \boxed{
 d_6M_6\longrightarrow\|K_6\|_2^2
 ={2\over15}\|K_4'\|_2^2>0.}                          \tag{5.5}
\]

In particular, `M_6=Theta(d_6^(-1))` on the exact schedule (1.4).

## 6. The remaining odd block and the sharp quotient norm

Let

\[
 {\cal T}_R^-={10,14,18,\ldots\}\cap[0,n_*),
 \qquad q_R=|{\cal T}_R^-|.                             \tag{6.1}
\]

For `t` in this set put

\[
 a_t={I_t\over I_2},\qquad c_t^-=-e_t+a_te_2,
 \qquad \boldsymbol a=(a_t)_t.                          \tag{6.2}
\]

Let `T_-` denote the arithmetic transform followed by inversion-odd
projection and the locked log-Fourier projection.  Define

\[
 W_R^-\xi=T_-\sum_{t\in{\cal T}_R^-}\xi_tc_t^-,        \tag{6.3}
\]

\[
 \boxed{
 D_R^-=\operatorname {diag}_{t\in{\cal T}_R^-}(d_t)
                 +d_2\boldsymbol a\boldsymbol a^*.}    \tag{6.4}
\]

For an empty rest block set `M_R=0`.  Otherwise concentration ordering gives

\[
 D_R^-\succeq d_{10}I.                                  \tag{6.5}
\]

The fixed-index limit gives `|I_2| -> 2^(-1/4)`.  Thus, after a
non-effective threshold, `|I_2|>=2^(-5/4)`.  The transition point estimate
from the growing theorem gives

\[
 |I_t|^2\leq V_0(\lambda)={1\over\lambda}+8\pi\lambda.
                                                               \tag{6.6}
\]

Since `q_R=O(lambda^2)`, equations (6.2) and (6.6) imply

\[
 \|\boldsymbol a\|^2=O(\lambda^3).                      \tag{6.7}
\]

This is a statement about the coefficient column.  More precisely, the raw
source synthesis `C_R^-` has the exact Gram

\[
 (C_R^-)^*C_R^-=I+\boldsymbol a\boldsymbol a^*,
 \qquad
 \boxed{\|C_R^-\|^2=1+\|\boldsymbol a\|^2
                  =O(\lambda^3).}                       \tag{6.8}
\]

The arithmetic-map squared norm is at most `lambda^2/2`, while parity and
Fourier projection are contractions.  Therefore the physical synthesis has
the distinct squared-norm estimate

\[
 \boxed{\|W_R^-\|^2=O(\lambda^5).}                      \tag{6.9}
\]

Put

\[
 A_R=W_R^-(D_R^-)^{-1/2},\qquad M_R=\|A_R\|^2.          \tag{6.10}
\]

The second pinned defect ratio is

\[
 {d_{10}\over d_6}
 \sim {4096\pi^4\over315}\lambda^8.                    \tag{6.11}
\]

Equations (6.5), (6.9), and (6.11) give the qualitative rest estimate

\[
 \boxed{M_R=O\!\left({\lambda^{-3}\over d_6}\right).}  \tag{6.12}
\]

Now define, deliberately, the block-diagonal source metric and synthesis

\[
 D_-^{\rm bd}=D_6\oplus D_R^-,\qquad
 W_-=[\,W_6\;W_R^-\,],                                  \tag{6.13}
\]

\[
 {\cal R}_-=W_-(D_-^{\rm bd})^{-1}W_-^*
            =A_6A_6^*+A_RA_R^*,
 \qquad K_-={\rm ran}(W_-),                             \tag{6.14}
\]

\[
 \boxed{\Delta_-={\cal R}_-^\dagger\big|_{K_-},
 \qquad \Delta_-^{-1}={\cal R}_-.}                     \tag{6.15}
\]

This is not the quotient made from the full exterior Gram: the shared
label-2 cross entries between the singleton and rest blocks are deliberately
absent.  The block metric is used consistently below.

Since `A_6A_6^*` and `A_RA_R^*` are positive,

\[
 M_6\leq\|\Delta_-^{-1}\|\leq M_6+M_R.                 \tag{6.16}
\]

Equations (5.5) and (6.12) show `M_R/M_6=O(lambda^(-3))`.
The squeeze in (6.16) proves the two sharp quotient limits

\[
 \boxed{d_6\|\Delta_-^{-1}\|\longrightarrow\|K_6\|_2^2,}
                                                               \tag{6.17}
\]

\[
 \boxed{{\lambda_{\min}(\Delta_-)\over d_6}
          \longrightarrow\|K_6\|_2^{-2}.}              \tag{6.18}
\]

Source or physical kernels are harmless: the Moore--Penrose inverse in
(6.15) acts only on the physical range.

## 7. Positive odd sampling and conditional shift survival

Let `S` be the complete positive paired-zero sampling analysis.  The
analytic statement in equations (1.1)--(4.3) of
`notes/GROWING_TRANSITION_SAMPLING_THEOREM.md` applies to any eligible set
of even prolate labels in one residue class modulo four.  We use that
analytic theorem here.  Its split-plus executable artifact does not certify
the odd family and is not being cited as if it did.

The singleton (3.5) uses two modal rows, so its source Loewner constant is

\[
 C_6=O(\lambda P(\lambda)).                              \tag{7.1}
\]

The rest block uses `q_R+1=O(lambda^2)` modal rows, including the common
label 2, so

\[
 C_R=O(\lambda^3P(\lambda)).                             \tag{7.2}
\]

All within-block sampling cross terms are present.  Put

\[
 \Gamma_-(\Delta_-)
 =\|\Delta_-^{-1}S^*S\Delta_-^{-1}\|
 =\|S\Delta_-^{-1}\|^2.                                \tag{7.3}
\]

The complete row-operator triangle inequality, before squaring, retains the
singleton/rest sampling cross orientation:

\[
\begin{aligned}
 \Gamma_-(\Delta_-)
 &\leq\left(\sqrt{C_6M_6}+\sqrt{C_RM_R}\right)^2\\
 &=O\!\left({\lambda P(\lambda)\over d_6}\right).
\end{aligned}                                           \tag{7.4}
\]

The same synthesis estimates give

\[
 \boxed{\|W_-(D_-^{\rm bd})^{-1/2}\|^2
       =\|\Delta_-^{-1}\|=O(d_6^{-1}).}                 \tag{7.5}
\]

The hybrid complete-series theorem and the projected-state norm lower bound
prove, on the same locked schedule,

\[
 U_0=o(d_6).                                             \tag{7.6}
\]

Suppose, additionally and explicitly, that the still-unproved unshifted
odd source quotient floor holds:

\[
 P_0A_-^*Q_-A_-P_0\succeq\mu_{0,-}P_0,
 \qquad \inf_\lambda\mu_{0,-}>0,                        \tag{7.7}
\]

where `A_-=W_-(D_-^bd)^(-1/2)` and `P_0` projects onto
`(ker A_-)^perp`.  The exact quotient-shift identity from
`notes/SIGNED_QUOTIENT_CAPTURE_REDUCTION.md` gives

\[
 P_0A_-^*(Q_--U_0I)A_-P_0
 \succeq
 \left\{\mu_{0,-}-(U_0)_+\|A_-\|^2\right\}P_0.         \tag{7.8}
\]

Equations (7.5)--(7.6) prove the unconditional erosion estimate

\[
 \boxed{(U_0)_+\|A_-\|^2=o(1).}                         \tag{7.9}
\]

Thus the hypothetical uniform floor in (7.7) would survive the known shift.
Equation (7.7) itself is not proved.  Moreover, the normalization-free
residual forcing lies in the inversion-even sector, so there is no odd
forcing vector to which (7.4) supplies a new action theorem.

## 8. Final scope

The unconditional conclusions are the odd arithmetic-vector convergence
(4.6), the derivative identity (4.13), the sharp singleton and quotient
limits (5.5), (6.17)--(6.18), the rest estimate (6.12), the positive
sampling action (7.4), and the shift-erosion estimate (7.9).

They do not choose the sign of the signed Weil compression.  In particular,
this note does not prove (7.7), a shifted odd floor, capture of the odd
negative pole, a physical co-frame, a physical-high floor, a strict
quotient-relative low--high cross reserve, or a reducing property.  The
generic reasons those implications fail are already recorded in
`notes/SIGNED_QUOTIENT_CAPTURE_REDUCTION.md`,
`notes/PHYSICAL_LEVERAGE_SHORTED_SCHUR.md`, and
`notes/LOW_BLOCK_FORCING_RATE_FULL_METRIC_BARRIER.md`; no new generic
countermodel is claimed here.

The result is confined to the exponential projection schedule (1.4).  It
does not transfer the positive theorem to a polynomial cutoff.  It does not
identify the block-diagonal metric (6.13) with the full exterior source
Gram.  It proves no actual odd inverse action, no full signed inverse, no
equation (5.2), no locally uniform determinant convergence, no RH statement,
and no Lambda bound.
