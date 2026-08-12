# Secant graph signed-leakage gate

## 0. Scope and exact outcome

This note isolates the actual-source estimate which is exactly equivalent to
preventing collapse of the regularized prolate-secant short in
`SECANT_SHORTED_RECIPROCAL_FESHBACH.md`.  It proves finite identities and a
growing-dimensional structural non-implication.  It does not prove the new
estimate for the pinned arithmetic Weil matrices.

There are four conclusions.

1. For every certified real shift `U<=q`, the `U`-shifted short ratio is
   exactly one minus a signed weak-residual quotient:

   \[
   {\delta_{r,U}\over\varepsilon_U+r}
   =1-{\langle\ell,D_{r,U}^{-1}\ell\rangle
          \over\beta^2(\varepsilon_U+r)},
   \qquad D_{r,U}=C_U+rI.                              \tag{0.1}
   \]

2. For the two global radicals used by the project, the numerator vector is
   represented weakly by the **combined** leakage mismatch

   \[
   -{\cal W}_Z(v,R_0)+{\alpha\over a}{\cal W}_Z(v,R_\lambda).
                                                               \tag{0.2}
   \]

   The signs in (0.2) follow from `Qp=-ell_R`; they are not a convention that
   may be changed after taking absolute values.

3. A uniform lower reserve is necessary and sufficient for one homogeneous
   inverse-energy inequality, equation (3.3) below.  It retains the exact
   finite secant norm `beta` and therefore makes no effective lower-bound
   assumption on that norm.

4. There is a growing-dimensional exact source-Cauchy family with nonzero
   displacement, both strict shifted parity signs, a unique even ground,
   boundary nonvanishing, beyond-all-polynomial absolute energy, and
   `r/epsilon_U=o(L^(-3/2))`, for which the two scalar secant tests also have
   the
   requested relative decay but
   `delta_(r,U)/(epsilon_U+r)->0` and the graph part of the soft trace stays
   bounded below at the actual two-vector Ritz shift `U=u`.  Its entries are
   synthetic and are not
   the pinned pole--archimedean--prime entries, and its declared secant is not
   the source-normalized prolate secant.  It proves a non-implication, not a
   failure of the arithmetic sequence.

Every actual-source specialization uses the centered interval
`[-L/2,L/2]`, Lebesgue measure, zero extension, reflection as inversion, and

\[
 \widehat f(t)=\int_{-L/2}^{L/2}f(x)e^{-itx}\,dx.       \tag{0.3}
\]

The complete finite Weil matrix is assembled before an absolute value, every
prime power `1<n<=lambda^2` is retained, and the prime block has the minus
sign from source equation (3.19).  The state normalization is the locked
source normalization.  No zero list and no global Weil positivity are used.
This note proves neither the shifted signs on an unbounded arithmetic
schedule, equation (5.2) of `DIRECT_RH_ATTACK.md`, locally uniform determinant
convergence, nor the Riemann hypothesis.  The formal state remains
`P0_INVALIDATED`.

## 1. The exact graph-load vector

Let `kappa` be a real unit vector in the inversion-even finite space and put

\[
 q=\langle\kappa,Q\kappa\rangle,\qquad
 b=(Q-qI)\kappa,\qquad r=\|b\|>0.                    \tag{1.1}
\]

Fix a real, certified shift

\[
 U\le q,
 \qquad t_U=q-U\ge0.                                \tag{1.2}
\]

On

\[
 {\cal K}=\kappa^\perp\cap H_+
\]

assume the declared finite sign

\[
 B_U=P_{\cal K}(Q_+-UI)P_{\cal K}\big|_{\cal K}>0. \tag{1.3}
\]

The anchor-complement cross vector remains `b`, since a scalar shift has no
cross term.  The specialization `U=q` is algebraically valid, but it is not a
harmless preliminary route for the pinned source.  As proved in
`Q_SHIFT_SECTOR_WEIL_CORE_GATE.md`, on the admitted widening Weil core the
two complete `q`-shifted sector signs, together with the admitted decay of
`|q|+r`, already imply the global Weil criterion.  Those signs therefore
contain RH-level signed arithmetic information.  The operative direct bridge
must allow a genuinely lower certified shift, such as its Ritz value, unless
that stronger theorem has independently been established.

There is a second, independent scope boundary.  When `U<q`, put

\[
 d=q-U>0,
 \qquad B_U=B_q+dI.                                  \tag{1.3a}
\]

The graph and bulk expressions formed from `r(B_U+rI)^(-1)` are a
`U`-shifted, `r`-ridged trace.  The identities below analyze that trace
exactly.  Operator monotonicity only gives

\[
 (B_U+rI)^{-1}\preceq(B_q+rI)^{-1},                 \tag{1.3b}
\]

which is the wrong direction for obtaining an upper bound for the `q`-shifted
trace from the lower-shifted one.  The needed comparison is instead supplied
by `RITZ_MOMENT_SELF_REGULARIZED_TRANSFER.md` when `U` is the mandatory Ritz
value, or more generally `u<=U<=q`:

\[
 zz^*\preceq A_{\rm R}((q-U)/r)\,r(B_U+rI)^{-1}.    \tag{1.3c}
\]

Thus the trace controls the true localized ground observable after the
factor `A_R` is retained.  For an arbitrary lower shift not known to satisfy
`U>=u`, no such ratio-only theorem holds.  Even in the Ritz case, (1.3c)
does not by itself prove the full `L2` equation (5.2).

Let the projected limiting radical have the exact secant decomposition

\[
 z_0=\alpha\kappa+\beta\omega,
 \qquad \beta=\|P_{\cal K}z_0\|>0,
 \qquad \|\omega\|=1.                               \tag{1.4}
\]

For the locked real vectors, `alpha` and `beta` are real and `beta` is
positive.  The complex version replaces the evident scalar products by
their conjugate-linear versions.

Put

\[
 {\cal F}={\cal K}\cap\omega^\perp,
 \qquad W:{\cal F}\longrightarrow{\cal K},          \tag{1.5}
\]

where `W` is the inclusion isometry.  Relative to
`C*omega direct-sum W F`, write

\[
 B_U=\begin{pmatrix}\varepsilon_U&g^*\\g&C_U\end{pmatrix},
 \qquad D_{r,U}=C_U+rI.                              \tag{1.6}
\]

If `B_q` denotes the same compression at `U=q`, then

\[
 B_U=B_q+t_UI,\qquad
 \varepsilon_U=\varepsilon_q+t_U,\qquad
 C_U=C_q+t_UI.                                      \tag{1.7}
\]

The cross vector `g` is shift-invariant.  Define the physical finite-space
graph-load vector by either shifted expression

\[
 \ell
 :=W^*P_{\cal F}(Q-UI)z_0-\alpha W^*b
 =W^*P_{\cal F}(Q-qI)z_0-\alpha W^*b.              \tag{1.8}
\]

The equality holds because `P_F z_0=0`.  Thus the leakage numerator does not
change when the common scalar shift changes.

Direct expansion of (1.4) gives

\[
 \boxed{\ell=\beta g.}                               \tag{1.9}
\]

This is an identity between vectors in the **physical Hilbert complement**
`F`.  It is not an identity between raw prolate source coordinates, exterior
defect coefficients, or remainders outside the finite interval.

The Schur short is

\[
 \delta_{r,U}=\varepsilon_U+r-g^*D_{r,U}^{-1}g>0.  \tag{1.10}
\]

Substitution of (1.9) proves (0.1):

\[
 \boxed{
 {\delta_{r,U}\over\varepsilon_U+r}
 =1-{\langle\ell,D_{r,U}^{-1}\ell\rangle
          \over\beta^2(\varepsilon_U+r)}.}          \tag{1.11}
\]

No estimate and no asymptotic replacement of `beta` occurs in (1.11).

## 2. Exact weak-residual sign for the two radicals

Let `K_0` and `K_lambda` be the corrected, inversion-even global radicals
whose finite pieces are respectively `z_0` and `p=a*kappa`:

\[
 K_0=z_0+R_0,\qquad K_\lambda=p+R_\lambda,
 \qquad a=\|p\|>0.                                  \tag{2.1}
\]

For `j in {0,lambda}`, let `rho_j` be the Riesz vector in the finite Hilbert
space of the weak leakage functional

\[
 \langle v,\rho_j\rangle={\cal W}_Z(v,R_j).          \tag{2.2}
\]

The notation in (2.2) matters.  The vector `rho_j` is not the physical
remainder `R_j`, and it is not a source-coordinate vector.  It exists here
because the finite space is a Hilbert space and the polarized zero pairing is
absolutely convergent in the admitted radical-leakage theorem.

Two-sided radicality gives, with the locked weak-residual sign,

\[
 Qz_0=-\rho_0,\qquad Qp=-\rho_\lambda.               \tag{2.3}
\]

Indeed, `0=QW(v,K_j)=<v,Q(P_NK_j)>+W_Z(v,R_j)` for every
finite test vector `v`.  The minus sign in (2.3) is therefore forced.

If `v in F`, then `v` is orthogonal to `kappa`, `omega`, and hence `z_0`.
Equations (1.1), (1.8), and (2.3) give

\[
\boxed{
 \langle v,W\ell\rangle
 =-{\cal W}_Z(v,R_0)
   +{\alpha\over a}{\cal W}_Z(v,R_\lambda).}        \tag{2.4}
\]

Thus the graph load is a **difference** of two weak residuals.  Separate
absolute estimates for the two terms in (2.4) do not prove a relative bound
for their difference.

Equation (2.4) must also not be rewritten as an `L2` inner product of
`R_0-(alpha/a)R_lambda` with `v`.  The form `W_Z` is a signed spectral
pairing, not the ambient Hilbert inner product.  Likewise, a source-coordinate
quotient metric such as `D_ext` may replace the denominator below only after
a proved Loewner comparison with the same physical shifted compression; a
coordinate synthesis identity alone does not permit that substitution.

More explicitly, if `Y:S->F` is a physical synthesis and `D_s>0` is a
source-coordinate metric, then

\[
 \Delta_s=(Y D_s^{-1}Y^*)^\dagger\big|_{\operatorname {ran}Y}
                                                               \tag{2.5}
\]

has the exact minimum-energy **quotient** interpretation

\[
 \langle v,\Delta_s v\rangle
 =\min_{Yx=v}\langle x,D_sx\rangle.                 \tag{2.6}
\]

Equation (2.6) is neither `||v||^2` nor
`<v,(Q-UI+rI)v>`.  To use it in (3.1), one must separately prove on the
same physical subspace a comparison such as

\[
 P_{\cal F}(Q-UI+rI)P_{\cal F}\succeq
 \mu\,P_{\cal F}\Delta_sP_{\cal F},\qquad\mu>0.     \tag{2.7}
\]

No current source-coordinate sampling estimate supplies (2.7).

## 3. Necessary and sufficient signed-leakage gate

For every positive operator `D_(r,U)` on `F`, finite-dimensional duality
gives

\[
 \langle\ell,D_{r,U}^{-1}\ell\rangle
 =\sup_{0\ne v\in{\cal F}}
   {|\langle v,W\ell\rangle|^2
    \over\langle v,(Q-UI+rI)v\rangle}.              \tag{3.1}
\]

The denominator is the physical shifted Weil form compressed to `F`; it is
not an unproved positive norm on the global remainder.

Fix `0<rho<=1`.  Combining (1.9), (2.4), and (3.1) proves the exact
equivalence

\[
\boxed{
 {\delta_{r,U}\over\varepsilon_U+r}\ge\rho
 \quad\Longleftrightarrow\quad
 \sup_{0\ne v\in{\cal F}}
 {\left| -{\cal W}_Z(v,R_0)
       +{\alpha\over a}{\cal W}_Z(v,R_\lambda)\right|^2
  \over\langle v,(Q-UI+rI)v\rangle}
 \le(1-\rho)\beta^2(\varepsilon_U+r).}             \tag{3.2}
\]

Equivalently, without a supremum, the required inequality is

\[
\boxed{
 \left| -{\cal W}_Z(v,R_0)
       +{\alpha\over a}{\cal W}_Z(v,R_\lambda)\right|^2
 \le(1-\rho)\beta^2(\varepsilon_U+r)
       \langle v,(Q-UI+rI)v\rangle
 \quad(v\in{\cal F}).}                              \tag{3.3}
\]

Equation (3.3) is the minimal new arithmetic estimate for a noncollapsing
graph short.  It is necessary and sufficient, not merely sufficient.  It
preserves the pole--archimedean--minus-prime cancellation inside each weak
pairing and the cancellation between the two remainders.

### No hidden effectiveness from `beta`

The prolate secant theorem proves qualitatively

\[
 \lambda^2\beta\longrightarrow
 {\|W_\infty\|\over16\pi}>0.                         \tag{3.4}
\]

Its starting threshold is not effective.  Equations (1.11) and (3.3) do not
use a threshold and do not divide an estimate by an asymptotic surrogate for
`beta`: the exact finite `beta^2` remains on both statements.  Therefore the
gate itself introduces no hidden effectiveness assumption.

If one instead normalizes the weak mismatch by `beta`, or replaces `beta`
by a declared constant times `lambda^(-2)`, then one has invoked the eventual
nonvanishing and two-sided comparison implicit in (3.4).  That step is
qualitatively valid after some index but has no source-effective threshold.
It must be stated separately and cannot be used in a finite certificate.

## 4. Harmonic capture and odd-response forms

The graph vector from the one-step Feshbach inverse is

\[
 v_{r,U}=\omega-WD_{r,U}^{-1}g
     =\omega-{1\over\beta}WD_{r,U}^{-1}\ell.        \tag{4.1}
\]

Let `A_T` be the fixed-window observation map,
`K_T=A_T^*A_T`, and

\[
 c^2=\langle\omega,K_T\omega\rangle>0.              \tag{4.2}
\]

Then the complete harmonic graph reserve is exactly

\[
 \boxed{
 {\mathfrak R}_{{\rm graph},U}
 ={1\over \delta_{r,U}/(\varepsilon_U+r)}
  {\left\|{\cal A}_T
   \left(\omega-\beta^{-1}WD_{r,U}^{-1}\ell\right)\right\|^2
   \over c^2}.}                                      \tag{4.3}
\]

A cancellation-preserving sufficient pair for bounded graph reserve is

\[
 {\delta_{r,U}\over\varepsilon_U+r}\ge\rho>0,     \tag{4.4}
\]

\[
 \langle\ell,D_{r,U}^{-1}K_FD_{r,U}^{-1}\ell\rangle
 \le M^2\beta^2c^2,
 \qquad K_F=W^*K_TW,                                 \tag{4.5}
\]

because (4.1), the triangle inequality in observation space, and (4.5)
give

\[
 {\mathfrak R}_{{\rm graph},U}\le{(1+M)^2\over\rho}. \tag{4.6}
\]

Condition (4.5) is again homogeneous in the exact finite `beta`.  It is not
implied by (3.3): inverse energy controls one power of `D_(r,U)^(-1)`, whereas
the captured harmonic correction contains two and the time-band covariance.

There is an equivalent odd-response formulation which does not mention
`beta`.  Let

\[
 w_{r,U}=(B_U+rI)^{-1}\omega.                        \tag{4.7}
\]

The rank-two source displacement reconstructs `w_(r,U)` from the three odd
resolvent responses and the `2 by 2` scalar system in equations (5.2)--(5.6)
of `SECANT_SHORTED_RECIPROCAL_FESHBACH.md`, with both the even and odd scalar
shifts changed from `q` to the same `U`.  The scalar shift cancels from the
displacement identity.  Exactly,

\[
 \boxed{
 {\delta_{r,U}\over\varepsilon_U+r}
 ={1\over(\varepsilon_U+r)\langle\omega,w_{r,U}\rangle},}
                                                               \tag{4.8}
\]

\[
 \boxed{
 {\mathfrak R}_{{\rm graph},U}
 ={\varepsilon_U+r\over c^2}
  {\langle w_{r,U},K_Tw_{r,U}\rangle
   \over\langle\omega,w_{r,U}\rangle}.}            \tag{4.9}
\]

Thus the exact odd-response alternative to (3.3)--(4.5) is a **combined**
upper bound for `(epsilon_U+r)<omega,w_(r,U)>` and the quotient in (4.9).  Bounds
for the three odd response vectors separately can lose the determinant
cancellation in their `2 by 2` reconstruction.

## 5. Growing source-Cauchy non-implication

The present admitted structural identities do not imply (3.3).  The
following exact family retains growing dimension and a genuine centered
time-band observation.

Let `j>=3` be an integer and set

\[
 L_j=j,\qquad N_j=2j^2,\qquad
 E_j=2^{-j^2},\qquad
 \tau_j={E_j\over2j^4},\qquad
 H_j=E_jj^6.                                         \tag{5.1}
\]

On the source modes `V_n`, `|n|<=N_j`, define the odd displacement
coefficients and diagonal entries by

\[
 b_n^{\rm C}=\tau_j n,\qquad a_0=0,                 \tag{5.2}
\]

\[
 a_{\pm1}=2\tau_j,\qquad
 a_{\pm2}=E_j-\tau_j,\qquad
 a_{\pm n}=H_j+\tau_j\quad(3\le n\le N_j),          \tag{5.3}
\]

and reconstruct

\[
 Q_{nn}=a_n,\qquad
 Q_{nm}={b_n^{\rm C}-b_m^{\rm C}\over n-m}
       =\tau_j\quad(n\ne m).                        \tag{5.4}
\]

This is an exact real source-Cauchy matrix with inversion symmetry and
nonzero displacement

\[
 [M,Q]=|\boldsymbol\beta_{\rm C}\rangle\langle\eta|
       -|\eta\rangle\langle\boldsymbol\beta_{\rm C}|,
 \qquad \boldsymbol\beta_{\rm C}=\tau_jM\eta\ne0.  \tag{5.5}
\]

Take `kappa=V_0`, so `q=0`.  In normalized parity coordinates the residual
has `N_j` equal components `sqrt(2)*tau_j`, and hence

\[
 r_j=\sqrt{2N_j}\,\tau_j=2j\tau_j={E_j\over j^3}.    \tag{5.6}
\]

At the Rayleigh shift, the even anchor complement is

\[
 B_{q,j}=\operatorname {diag}
 (\tau_j,E_j-2\tau_j,H_j,\ldots,H_j)
 +2\tau_j|\mathbf 1\rangle\langle\mathbf 1|>0.     \tag{5.7}
\]

Let `w_j=b/r_j` be the normalized residual direction and put

\[
 \chi_j=\langle w_j,B_{q,j}w_j\rangle>0,\qquad
 t_j=q-u_j={\sqrt{\chi_j^2+4r_j^2}-\chi_j\over2}
 ={2r_j^2\over\sqrt{\chi_j^2+4r_j^2}+\chi_j}.       \tag{5.8}
\]

The compression of `Q_+` to `span{kappa,w_j}` is
`[[q,r_j],[r_j,q+chi_j]]`.  Hence its lower Ritz value is exactly

\[
 U_j=u_j=q-t_j,\qquad
 t_j(\chi_j+t_j)=r_j^2,\qquad 0<t_j<r_j.          \tag{5.8a}
\]

Thus `U_j` is the mandatory two-vector Ritz variational upper bound, not an
artificial shift chosen below it.

Consequently the declared `U_j`-shifted blocks are

\[
 B_{U,j}=B_{q,j}+t_jI>0,                             \tag{5.9}
\]

and

\[
 Q_- -U_jI=\operatorname {diag}
 (\tau_j+t_j,E_j-2\tau_j+t_j,
  H_j+t_j,\ldots,H_j+t_j)>0.                        \tag{5.10}
\]

The full even matrix relative to `C*kappa direct-sum kappa^perp` is
`[[0,b*],[b,B_(q,j)]]` with `b!=0` and `B_(q,j)>0`.  Its Schur complement at
zero is negative, so it has exactly one negative eigenvalue.  Together with
the positive `q`-shifted odd diagonal, which is (5.10) with `t_j` removed,
the global ground is unique and inversion even.  Its boundary pairing is
nonzero by the exact source commutator theorem.

Choose the declared secant

\[
 \omega={e_1^++e_2^+\over\sqrt2},\qquad
 z_0=\kappa+\beta_j\omega,
 \qquad\beta_j=2^{-j}.                               \tag{5.11}
\]

Its Rayleigh-shift energy, `U_j`-shift energy, and residual coordinate are

\[
 \varepsilon_{q,j}={E_j+7\tau_j\over2},\qquad
 \varepsilon_{U,j}=\varepsilon_{q,j}+t_j,
 \qquad d_j=\langle\omega,b\rangle=2\tau_j.         \tag{5.12}
\]

Therefore

\[
 {r_j\over\varepsilon_{U,j}}=O(j^{-3}),\qquad
 {\|b_\perp\|\over\varepsilon_{q,j}}=O(j^{-3}),    \tag{5.13}
\]

and, with
`D_0=<z_0,(Q-qI)z_0>
=2*beta_j*d_j+beta_j^2*epsilon_(q,j)`,

\[
 {D_0\over\beta_j\varepsilon_{q,j}}
 ={4\tau_j\over\varepsilon_{q,j}}+\beta_j
 =O(j^{-4})+2^{-j}=o(j^{-3/2}).                      \tag{5.14}
\]

Thus the complete scalar secant identity and the orthogonal-residual ratio
have the intrinsic requested decay.

The graph short nevertheless collapses.  Its variational characterization is

\[
 \delta_{r_j,U_j}
 =\min_{\langle\omega,x\rangle=1}
       \langle x,(B_{U,j}+r_jI)x\rangle.            \tag{5.15}
\]

The admissible vector `sqrt(2)*e_1^+` gives

\[
 \delta_{r_j,U_j}
 \le2(3\tau_j+t_j+r_j)
 \le2(3\tau_j+2r_j),                               \tag{5.16}
\]

and hence

\[
 \boxed{
 {\delta_{r_j,U_j}\over\varepsilon_{U,j}+r_j}=O(j^{-3})
 \longrightarrow0.}                                 \tag{5.17}
\]

Let `v_j` be the minimizing graph vector.  It obeys
`<omega,v_j>=1`.  The positive diagonal part in (5.7), (5.9) and the trial
bound (5.16) give

\[
 \|P_{\{e_1^+,e_2^+\}^\perp}v_j\|^2
 \le {\delta_{r_j,U_j}\over H_j}=O(j^{-9}).         \tag{5.18}
\]

For fixed `T>0`, the centered zero-extension time-band operator satisfies on
the two fixed even modes

\[
 P_{12}K_TP_{12}\ge
 \left(1-{32\over\pi L_jT}\right)P_{12}             \tag{5.19}
\]

for all sufficiently large `j` with `|4*pi/L_j|<=T/2`.  This follows by
summing the elementary outside-band losses of the two normalized even modes.
Because `A_T` is a contraction, (5.18)--(5.19) and
`<omega,P_12v_j>=1` imply

\[
 \langle v_j,K_Tv_j\rangle\ge {1\over4}             \tag{5.20}
\]

eventually.  Equations (5.6), (5.16), and (5.20) now give the fixed lower
bound

\[
 \boxed{
 {r_j\langle v_j,K_Tv_j\rangle\over\delta_{r_j,U_j}}
 \ge {r_j\over8(3\tau_j+t_j+r_j)}
 \ge {1\over16+12/j}
 \ge {1\over20}.}                                   \tag{5.21}
\]

for every sufficiently large `j`.  The numerical constant is deliberately
loose.  Thus the graph soft term does not tend to zero even though (5.13)--
(5.14) pass and all matrix entries are beyond-all-polynomial in absolute
scale through the factor `E_j`.

The same family also shows nondecay of the actual ground correction, not
only failure of the graph upper bound.  Let `mu_j<0` be its even ground and
put

\[
 H_j^{\rm g}=-\mu_j,
 \qquad y_j={H_j^{\rm g}\over\tau_j}.               \tag{5.22}
\]

For the diagonal part `D_j` in (5.7), the ground Feshbach equation and the
Sherman--Morrison formula give

\[
 {y_j\over2(1-y_j)}
 =\tau_j\sum_{n=1}^{N_j}{1\over(D_j)_{nn}+H_j^{\rm g}}
 ={1\over1+y_j}+R_j,                                \tag{5.23}
\]

where

\[
 0\leq R_j
 \leq{1\over2(j^4-1)}+{1\over j^8}\longrightarrow0. \tag{5.24}
\]

Hence

\[
 y_j\longrightarrow y_0={\sqrt {17}-3\over2}.       \tag{5.25}
\]

The coefficient-normalized ground correction
`z_j=(B_(q,j)+H_j^g I)^(-1)b_j` has coordinates

\[
 (z_j)_n={\sqrt2\tau_j(1-y_j)
                 \over(D_j)_{nn}+\tau_jy_j}.         \tag{5.26}
\]

Therefore

\[
 (z_j)_1\longrightarrow
 {\sqrt2(1-y_0)\over1+y_0}=0.3970778019\ldots,
 \qquad (z_j)_2=O(j^{-4}),
 \qquad\|P_{\{1,2\}^\perp}z_j\|=O(j^{-9}).          \tag{5.27}
\]

Equation (5.19) and the contraction bound on `K_T` now imply, for every
fixed `T>0`,

\[
 \langle z_j,K_Tz_j\rangle
 \longrightarrow
 {2(1-y_0)^2\over(1+y_0)^2}
 =0.1576707808\ldots.                                \tag{5.28}
\]

Meanwhile (5.7) gives

\[
 \chi_j\geq E_j(j^6-j^4),
 \qquad {t_j\over r_j}
 \leq{r_j\over\chi_j}
 \leq{1\over j^9-j^7}\longrightarrow0.             \tag{5.29}
\]

Thus the Ritz multiplier satisfies `A_R(t_j/r_j)->1`, and
`B_(U,j)=B_(q,j)+t_jI>t_jI`; even the favorable no-low-band regime does not
force the arithmetic response to decay.  This is the sharp role of the
remaining source estimate in (6.3).

The family (5.1)--(5.29) is not the matrix assembled from the pinned source
formulas and (5.11) is not the actual prolate state.  It proves precisely that
source-Cauchy displacement, strict parity signs, boundary nonvanishing,
absolute flatness, and the scalar secant identities do not imply the
inverse-energy orientation in (3.3).
Although this synthetic family also happens to have the stronger `q`-shifted
signs, its freely varying diagonal coefficients are not the widening
compressions of the pinned global Weil form.  It therefore does not meet the
core hypothesis of `Q_SHIFT_SECTOR_WEIL_CORE_GATE.md` and creates no
contradiction with that theorem.

## 6. Exact next arithmetic theorem

On one common unbounded arithmetic schedule, choose a declared certified
Ritz shift `u<=U<=q`.  After both strict `U`-shifted signs are proved, the
`U`-shifted graph-short part can be closed without any asymptotic division
by `beta` by proving constants
`rho>0` and `M<infinity` for which

\[
 \left| -{\cal W}_Z(v,R_0)
       +{\alpha\over a}{\cal W}_Z(v,R_\lambda)\right|^2
 \le(1-\rho)\beta^2(\varepsilon_U+r)
       \langle v,(Q-UI+rI)v\rangle                 \tag{6.1}
\]

for every `v in F`, and

\[
 \langle\ell,D_{r,U}^{-1}K_FD_{r,U}^{-1}\ell\rangle
 \le M^2\beta^2c^2.                                 \tag{6.2}
\]

Equation (6.1) is necessary and sufficient for the noncollapsing short;
(6.2) is a direct sufficient harmonic-capture estimate.  The deflated bulk
term from `SECANT_SHORTED_RECIPROCAL_FESHBACH.md` remains a separate positive
obligation.

For `d=q-U>0`, (6.1), (6.2), and the corresponding deflated-bulk decay
control the true localized ground observable through (1.3c), provided the
resulting rate retains `A_R(d/r)`.  For the tent route, the sufficient full
response target is

\[
 A_{\rm R}(d/r)^{3/2}L^{3/2}{\cal F}_\theta
 \longrightarrow0.                                 \tag{6.3}
\]

This does not by itself prove the weighted chordal bound or discharge the
full `L2` equation (5.2) of `DIRECT_RH_ATTACK.md`.  It supplies the formerly
missing Ritz displacement transfer; the arithmetic signed-response estimate
is still an additional source obligation.

The existing scalar leakage-energy theorem, source commutator, qualitative
secant asymptotic, and source-coordinate exterior-defect estimates do not
prove (6.1).  A route through a source quotient must establish, for the same
physical synthesis and the same shifted form, both a Loewner lower comparison
for `D_(r,U)` and the signed dual estimate for the combined functional (0.2).
Using a block-diagonal source metric without controlling its cross blocks is
not such a comparison.

Equivalently, the odd-response route must bound the two combined quotients
(4.8)--(4.9) after the exact `2 by 2` response solve.  Either formulation is
source-reconstructible and preserves all relevant cancellation.  Neither is
currently an admitted unbounded arithmetic estimate, so the project status
does not change.

The `U=q` specialization remains a correct finite identity, but
`Q_SHIFT_SECTOR_WEIL_CORE_GATE.md` forbids presenting its two complete sector
signs as an easier preliminary input: on the admitted widening source core
those signs are already an RH-level theorem.  The lower-shift formulation is
therefore mathematically essential, not a cosmetic relabeling.
