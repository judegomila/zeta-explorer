# Transverse Xi radical obstruction to the moment-angle route

## 0. Scope and outcome

This note gives an actual-source obstruction inequality for the remaining
regularized moment target in
`REGULARIZED_MOMENT_SCHUR_ANGLE_PROFILE.md`.  It does not prove or disprove
that target.

The limiting source-normalized arithmetic state (K_\infty) has

\[
 \widehat K_\infty(t)={\Xi(t)\over4}.
\]

Its centered second logarithmic derivative

\[
 W_\infty=K_\infty''+m_2K_\infty,
 \qquad
 m_2={\|K_\infty'\|_2^2\over\|K_\infty\|_2^2}>0,       \tag{0.1}
\]

is a nonzero, inversion-even, exact global zero-evaluation radical and is
orthogonal to (K_\infty).  Its transform is

\[
 \boxed{\widehat W_\infty(t)
 ={(m_2-t^2)\Xi(t)\over4}.}                             \tag{0.2}
\]

Project (W_\infty) into the same finite source space and then off the
actual projected prolate anchor.  After normalization this gives an explicit
vector (\omega_{\lambda,N}) in the inversion-even anchor complement.
Let

\[
 \varepsilon_{\lambda,N}
 =\langle\omega_{\lambda,N},B_{\lambda,N}
                         \omega_{\lambda,N}\rangle,     \tag{0.3}
\]

where
`B=P_K(Q-qI)P_K|_K>0` is the complete Rayleigh-shifted source compression
defined in Section 1.  For (m=\lceil LT\rceil), every threshold (u>0)
satisfies

\[
 \boxed{
 \sqrt{\eta_m(u)}\ \geq\
 \left(
  \|{\cal A}_T\omega_{\lambda,N}\|
  -\sqrt{\tau_m(L,T)}
  -\sqrt{\varepsilon_{\lambda,N}/u}
 \right)_+.}                                           \tag{0.4}
\]

Here (\tau_m) is the exact even-moment tail from the fixed-window note and
(\eta_m(u)=\|{\bf1}_{(0,u]}(B)P_m\|^2).  On the admitted Gevrey schedule,

\[
 \|{\cal A}_T\omega_{\lambda,N}\|\longrightarrow
 c_T:={\|{\bf1}_{[-T,T]}\widehat W_\infty\|_
                {L^2(dt/(2\pi))}\over\|W_\infty\|_2}>0. \tag{0.5}
\]

Consequently, existence of thresholds satisfying

\[
 \eta_m(u_L)+{r\over u_L}=o(L^{-5/2})                  \tag{0.6}
\]

necessarily implies the new relative radical-separation condition

\[
 \boxed{{r\over\varepsilon_{\lambda,N}}
              =o(L^{-5/2}).}                          \tag{0.7}
\]

The explicit transverse energy in (0.3) is itself smaller than every fixed
power of (\lambda^{-1}) by the same fixed-function projection and
compact-BV sampling argument used for the formal prolate corrections.  Thus
ordinary flatness of both quantities does not prove (0.7): a proof must
compare two signed global-radical leakage scales.  This genuinely narrows the
moment-angle route and rules out a proof based only on an absolute upper
bound for (r), an absolute upper bound for (\varepsilon), or a polynomial
complementary gap.

All finite forms below are reconstructed after combining the pole,
archimedean, and prime blocks.  The Fourier sign is (e^{-itx}), the
logarithmic interval is ([-L/2,L/2]) with Lebesgue measure and zero
extension, inversion is reflection, every prime power
(1<n\leq\lambda^2) is retained, and the prime block keeps the minus sign
from source equation (3.19).  No list of real zeta zeros and no global Weil
positivity assumption is used.  The formal project state remains
`P0_INVALIDATED`.

## 1. Locked finite operator

Put

\[
 L=2\log\lambda,\qquad I_\lambda=[-L/2,L/2],\qquad
 \widehat f(t)=\int_{I_\lambda}f(x)e^{-itx}\,dx.       \tag{1.1}
\]

The complete source multiplier is

\[
 m_\lambda(t)=
 \operatorname {Re}\psi\!\left({1\over4}+{it\over2}\right)-\log\pi
 -2\sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
                          \cos(t\log n),                \tag{1.2}
\]

and the pole form is added before compression.  Equivalently, the exact
cancellation-preserving normal form is

\[
 Q_{\lambda,N}=c_*I+(A_{\rm tail})_N-(T_D)_N.          \tag{1.3}
\]

Let (K_\lambda) be the corrected global source radical whose finite
restriction is exactly the producer state, and set

\[
 p=P_NC_\lambda K_\lambda,qquad
 a=\|p\|>0,\qquad \kappa=p/a.                          \tag{1.4}
\]

On the even sector let

\[
 {\cal K}=E_N^+\cap\kappa^\perp,qquad
 q=\langle\kappa,Q\kappa\rangle,qquad
 B=P_{\cal K}(Q-qI)P_{\cal K}\big|_{\cal K},          \tag{1.5}
\]

\[
 r=\|(Q-qI)\kappa\|.                                  \tag{1.6}
\]

The angle profile is used only under the declared strict finite hypothesis
(B>0).  No positivity of an uncompressed or limiting Weil form is inferred.

For fixed (T>0), define

\[
 ({\cal A}_Tf)(t)=\widehat f(t),\qquad
 {\cal A}_T:{\cal K}\longrightarrow
 L^2([-T,T],dt/(2\pi)),                                \tag{1.7}
\]

and (K_T={\cal A}_T^*{\cal A}_T\).  Let (P_m) project onto the first
(m) projected even physical moments and (H_m=I-P_m).  The exact theorem
already proved in the fixed-window note is

\[
 \operatorname {tr}(H_mK_TH_m)\leq
 \tau_m(L,T):={LT\over\pi}
 { (LT/2)^{4m}\over(4m+1)^2\{(2m)!\}^2}.              \tag{1.8}
\]

## 2. The explicit transverse global radical

The leading all-order source function has the form

\[
 K_\infty(x)={\cal E}(g_0)(e^x),                       \tag{2.1}
\]

where (g_0\in{\cal S}_0^{\rm ev}): it is even Schwartz, vanishes at the
origin, and has zero Lebesgue integral.  It is source-normalized; it is not
unit-normalized.  The locked transform theorem gives

\[
 \widehat K_\infty(t)=\Xi(t)/4.                        \tag{2.2}
\]

Let

\[
 {\cal L}={1\over2}+y{d\over dy}.                      \tag{2.3}
\]

Termwise differentiation of the absolutely convergent arithmetic transform
gives

\[
 {d\over dx}{\cal E}(g)(e^x)={\cal E}({\cal L}g)(e^x).
                                                               \tag{2.4}
\]

Moreover

\[
 \int_{\mathbb R}{\cal L}g(y)\,dy
 =-{1\over2}\int_{\mathbb R}g(y)\,dy.                 \tag{2.5}
\]

Thus

\[
 f_*:=({\cal L}^2+m_2)g_0\in{\cal S}_0^{\rm ev},      \tag{2.6}
\]

and

\[
 W_\infty={\cal E}(f_*)(e^x)
           =K_\infty''+m_2K_\infty.                   \tag{2.7}
\]

The source Mellin factorization therefore proves directly, without assuming
that the zero parameters are real, that both zero evaluations of
(W_\infty) vanish.  It is an exact two-sided global radical.

Integration by parts and the definition of (m_2) give

\[
 \langle K_\infty,W_\infty\rangle
 =-\|K_\infty'\|_2^2+m_2\|K_\infty\|_2^2=0.           \tag{2.8}
\]

Fourier differentiation proves (0.2).  In particular (W_\infty\ne0), and

\[
 \int_{\mathbb R}W_\infty(x)\,dx
 ={m_2\Xi(0)\over4}\ne0.                              \tag{2.9}
\]

The latter identity is useful as a simple zeroth-moment check, although the
proof below obtains a stronger fixed-window capture.

## 3. Finite anchor deflation and signed leakage energy

Put

\[
 z=P_NC_\lambda W_\infty,\qquad
 d={\langle p,z\rangle\over\|p\|^2},\qquad
 w=z-dp=P_{\cal K}z.                                   \tag{3.1}
\]

On the Gevrey schedule

\[
 N=\lceil\lambda L^3\rceil,                            \tag{3.2}
\]

the all-order state theorem gives (p\to K_\infty) in (L^2(\mathbb R)).
The fixed polynomial-Gaussian function (f_*) has the same endpoint-flat
projection estimate, so (z\to W_\infty).  Equation (2.8) then gives

\[
 d\longrightarrow0,\qquad w\longrightarrow W_\infty. \tag{3.3}
\]

In particular (w\ne0) eventually.  Define

\[
 \omega={w\over\|w\|}\in{\cal K},\qquad
 \varepsilon=\langle\omega,B\omega\rangle>0.          \tag{3.4}
\]

This energy has an exact cancellation-preserving source decomposition.  The
global function

\[
 G=W_\infty-dK_\lambda                              \tag{3.5}
\]

is a linear combination of two exact global radicals and its finite
projection is (w).  With the complete remainder (R_G=G-w), the polarized
radical-leakage identity gives

\[
 \boxed{
 \varepsilon={\mathcal W_Z(R_G,R_G)\over\|w\|^2}-q.}  \tag{3.6}
\]

Equation (3.6) is symbolic bookkeeping, not permission to estimate from an
assumed real-zero table.  Independently, both terms are reconstructed from
the pole, archimedean, and inclusive minus-prime source formulas.  The
combined value must be formed before absolute values.

To make the relative bookkeeping explicit, put

\[
 R_W=W_\infty-P_NC_\lambda W_\infty,
 \qquad R_K=K_\lambda-p.                              \tag{3.6a}
\]

Then

\[
 R_G=R_W-dR_K.                                        \tag{3.6b}
\]

Because (f_*) is one fixed polynomial-Gaussian source function, its outer
tail, periodic projection error, and compact-BV paired-zero sampling norm
are smaller than every fixed power on (3.2).  The same is already proved for
the actual anchor: for every fixed (A), both absolute sampling norms in
(3.6a) are (O_A(\lambda^{-A})) after increasing the internal requested
power.  Moreover (d\to0), (\|w\|) is bounded below, and the anchor identity
with its own remainder gives (|q|=O_A(\lambda^{-A})).  The triangle
inequality in the positive absolute sampling norm and (3.6)--(3.6b), not
Weil positivity, therefore yield

\[
 \boxed{|\varepsilon|=O_A(\lambda^{-A})
        \quad\hbox{for every fixed }A>0}               \tag{3.7}
\]

The strict finite sign (B>0) then supplies (\varepsilon>0).  This is only an
absolute upper bound; it gives no positive lower bound and no comparison
with (r).

## 4. Exact transverse-radical angle inequality

Let

\[
 E_u={\bf1}_{(0,u]}(B),\qquad
 \eta_m(u)=\|E_uP_m\|^2.                               \tag{4.1}
\]

### Theorem 4.1

For every finite stage satisfying (B>0), every (u>0), and every
(m\geq1),

\[
 \boxed{
 \sqrt{\eta_m(u)}\geq
 \left(
   \|{\cal A}_T\omega\|
   -\sqrt{\operatorname {tr}(H_mK_TH_m)}
   -\sqrt{\varepsilon/u}
 \right)_+.}                                           \tag{4.2}
\]

Consequently (1.8) proves (0.4).

**Proof.**  Put (\alpha=\|P_m\omega\|).  Since
(0\preceq H_mK_TH_m), its norm is no greater than its trace, and hence

\[
 \|{\cal A}_TH_m\omega\|
 \leq\sqrt{\operatorname {tr}(H_mK_TH_m)}.             \tag{4.3}
\]

The map (\mathcal A_T) is a contraction, so

\[
 \alpha\geq\|{\cal A}_TP_m\omega\|
 \geq\|{\cal A}_T\omega\|
       -\sqrt{\operatorname {tr}(H_mK_TH_m)}.          \tag{4.4}
\]

If (\alpha=0), (4.2) follows because (4.4) makes its right side zero.
Otherwise set (s=P_m\omega/\alpha\).  Then (s\in V_m),
(\|s\|=1), and (\langle\omega,s\rangle=\alpha).  Spectral calculus
and (3.4) give

\[
 \|(I-E_u)\omega\|^2\leq{\varepsilon\over u}.          \tag{4.5}
\]

Therefore

\[
 \begin{aligned}
 \sqrt{\eta_m(u)}
 &\geq\|E_us\|\\
 &\geq|\langle E_u\omega,s\rangle|\\
 &\geq\alpha-\|(I-E_u)\omega\|\\
 &\geq\alpha-\sqrt{\varepsilon/u}.
 \end{aligned}                                         \tag{4.6}
\]

Combining (4.4)--(4.6) and taking the positive part proves the theorem.
\(\square\)

The estimate is source-specific only through the explicit vector
(\omega).  The finite spectral step itself is an exact positive-operator
inequality and does not invoke a zero representation of (Q).

## 5. Asymptotic obstruction and necessary relative scale

For (m=\lceil LT\rceil), the factorial estimate gives

\[
 \tau_m(L,T)=o(L^{-A})\quad\hbox{for every fixed }A.    \tag{5.1}
\]

Equations (3.3) and Plancherel give

\[
 \|{\cal A}_T\omega\|\longrightarrow c_T,             \tag{5.2}
\]

with (c_T) as in (0.5).  Since the continuous function in (0.2) is
nonzero at (t=0), (c_T>0) for every fixed (T>0).  Thus eventually

\[
 \boxed{
 \sqrt{\eta_m(u)}\geq
 \left({c_T\over2}-\sqrt{\varepsilon/u}\right)_+.}    \tag{5.3}
\]

### Corollary 5.1 (necessary transverse separation)

Suppose a common unbounded source schedule satisfies the strict sign
(B>0) and admits thresholds (u_L>0) for which (0.6) holds.  Then (0.7)
holds.

**Proof.**  The nonnegative summands in (0.6) separately satisfy

\[
 \eta_m(u_L)=o(L^{-5/2}),\qquad
 {r\over u_L}=o(L^{-5/2}).                              \tag{5.4}
\]

Hence (\sqrt{\eta_m(u_L)}=o(L^{-5/4})).  Equation (5.3) forces, for all
sufficiently large stages,

\[
 \sqrt{\varepsilon/u_L}\geq {c_T\over4},
 \qquad
 u_L\leq {16\over c_T^2}\varepsilon.                  \tag{5.5}
\]

Consequently

\[
 {c_T^2\over16}{r\over\varepsilon}
 \leq {r\over u_L}=o(L^{-5/2}),                        \tag{5.6}
\]

which is (0.7).  \(\square\)

The contrapositive is useful: if the explicit source ratio
(r/\varepsilon) fails to be (o(L^{-5/2})), no choice of threshold can
prove the moment-angle target.  Separate beyond-all-orders upper bounds for
the numerator and denominator do not determine this ratio.

## 6. The exact covariance-weighted layer profile

The scalar floor and the operator angle (\eta_m) are stronger than the
actual low term in the Hilbert--Schmidt splice.  This can be recorded without
discarding the covariance with (K_T).

Let

\[
 U_m:\mathbb C^{d_m}\longrightarrow V_m
\]

be any isometric synthesis, so (U_m^*U_m=I) and
(U_mU_m^*=P_m).  Define

\[
 K_m=U_m^*K_TU_m,\qquad
 R_m=U_m^*(B+rI)^{-1}U_m.                              \tag{6.1}
\]

The square of the exact low Hilbert--Schmidt term is

\[
 \boxed{\mathcal L_m
 =r\operatorname {tr}(K_mR_m).}                         \tag{6.2}
\]

Indeed,

\[
 \begin{aligned}
 \|\{r(B+rI)^{-1}\}^{1/2}P_mK_T^{1/2}\|_{\rm HS}^2
 &=\operatorname {tr}\{P_mr(B+rI)^{-1}P_mK_T\}\\
 &=r\operatorname {tr}(R_mK_m).
 \end{aligned}                                         \tag{6.3}
\]

For (E_u={\bf1}_{(0,u]}(B)), put

\[
 F_m(u)=U_m^*E_uU_m,\qquad
 \boxed{\Theta_m(u)=\operatorname {tr}\{K_mF_m(u)\}.} \tag{6.4}
\]

This is a positive, nondecreasing layer profile.  More precisely it is the
distribution function of a finite positive measure of total mass
(\operatorname {tr}K_m), and

\[
 \boxed{
 \mathcal L_m=\int_{(0,\infty)}{r\over\beta+r}
                         \,d\Theta_m(\beta).}          \tag{6.5}
\]

With (t=r/(u+r)), scalar spectral calculus gives

\[
 tE_u\preceq r(B+rI)^{-1}
 \preceq tI+(1-t)E_u.
\]

Compression and the positive trace functional (X\mapsto
\operatorname {tr}(K_mX)) therefore prove the exact two-layer bounds

\[
 \boxed{
 t\Theta_m(u)\leq\mathcal L_m
 \leq t\operatorname {tr}K_m+(1-t)\Theta_m(u).}        \tag{6.6}
\]

This is strictly sharper than applying a common scalar floor.  Since

\[
 0\preceq F_m(u)\preceq\eta_m(u)I,
\]

one has

\[
 \Theta_m(u)\leq\eta_m(u)\operatorname {tr}K_m,        \tag{6.7}
\]

so the previous angle condition is recovered only after losing the
covariance.  The intrinsic identity

\[
 \boxed{
 \Theta_m(u)=
 \|E_uP_m{\cal A}_T^*\|_{\rm HS}^2
 =\|{\cal A}_TP_mE_u\|_{\rm HS}^2}                    \tag{6.8}
\]

shows exactly what replaces it: aggregate overlap between the soft source
layer and the bounded-frequency observation family after moment projection.

There is an exact direct profile on the whole anchor complement,

\[
 \Phi(u)=\operatorname {tr}(E_uK_TE_u)
        =\|{\cal A}_TE_u\|_{\rm HS}^2.                \tag{6.8a}
\]

The moment theorem makes the covariance profile and the direct profile
asymptotically identical at the square-root scale:

\[
 \boxed{
 \left|\sqrt{\Phi(u)}-\sqrt{\Theta_m(u)}\right|
 \leq\|{\cal A}_TH_mE_u\|_{\rm HS}
 \leq\sqrt{\operatorname {tr}(H_mK_TH_m)}.}           \tag{6.8b}
\]

Indeed, the two Hilbert--Schmidt operators are
${\cal A}_TE_u$ and ${\cal A}_TP_mE_u$, and their difference is
${\cal A}_TH_mE_u$.  No source sign is used in this comparison.

In fact the complete soft trace, before any physical splice, has the exact
spectral representation

\[
 \mathcal S_r:=\operatorname {tr}\{r(B+rI)^{-1}K_T\}
 =\int_{(0,\infty)}{r\over\beta+r}\,d\Phi(\beta),     \tag{6.8c}
\]

and hence

\[
 t\Phi(u)\leq\mathcal S_r
 \leq t\operatorname {tr}K_T+(1-t)\Phi(u).           \tag{6.8d}
\]

Since compression cannot increase the trace of the interval time--band
operator,

\[
 \operatorname {tr}K_T\leq {LT\over\pi}.             \tag{6.8e}
\]

Thus the covariance refinement is not a hidden new source estimate: modulo
the already closed moment tail, it is the direct low-spectral/time-band
overlap in the original soft trace.  Its advantage is logical sharpness—it
removes the worst-angle and common-floor losses.  Its arithmetic content is
still precisely the missing source orientation.

Because (\operatorname {tr}K_m\leq d_m\leq m=O(L)), a sufficient
covariance-weighted replacement for the scalar-floor target is

\[
 \boxed{
 \Theta_m(u_L)=o(L^{-3/2}),\qquad
 {r\over u_L}=o(L^{-5/2}).}                            \tag{6.9}
\]

More sharply, it suffices to retain the weaker single condition

\[
 {r\over u_L+r}\operatorname {tr}K_m
 +{u_L\over u_L+r}\Theta_m(u_L)=o(L^{-3/2}).           \tag{6.10}
\]

Together with the superpolynomial high trace, either (6.9) or (6.10)
proves the required residual-ridged soft-trace decay.  These are sufficient
conditions, not estimates currently known for the source.

By (6.8b), one may replace $\Theta_m(u_L)=o(L^{-3/2})$ in
(6.9) by the equivalent direct condition
$\Phi(u_L)=o(L^{-3/2})$.  Equations (6.8c)--(6.8e) then prove the result
without invoking the physical splice at all.

The transverse Xi radical is not hidden by this refinement.  From (6.8),
applying (\mathcal A_TP_mE_u) to the unit vector (\omega), and using
(4.3) and (4.5), gives

\[
 \boxed{
 \sqrt{\Theta_m(u)}\geq
 \left(
  \|{\cal A}_T\omega\|
  -\sqrt{\operatorname {tr}(H_mK_TH_m)}
  -\sqrt{\varepsilon/u}
 \right)_+.}                                           \tag{6.11}
\]

Thus (\Theta_m(u_L)=o(L^{-3/2})) also forces
(u_L\leq16\varepsilon/c_T^2) eventually.  In particular the simpler
covariance target (6.9) still requires (0.7).  The weighted formulation is
mathematically more faithful and may admit an aggregate source estimate
which the worst-angle formulation misses, but it does not remove the need
to separate the actual anchor residual from the explicit transverse-radical
energy.

The direct profile has the slightly sharper obstruction

\[
 \boxed{
 \sqrt{\Phi(u)}\geq
 \left(\|{\cal A}_T\omega\|-\sqrt{\varepsilon/u}\right)_+.}
                                                               \tag{6.12}
\]

This follows by applying ${\cal A}_TE_u$ to $\omega$ and using (4.5).
It reaches the same relative-scale conclusion without the moment tail.

## 7. What this advances and what remains

The actual-source angle problem is no longer merely “show that physical
moments miss an unspecified soft spectral layer.”  The moment range
necessarily captures a fixed amount of one explicit transverse Xi-radical
quasimode.  Any successful threshold must be of order at most its Rayleigh
energy, with the explicit fixed-window constant in (5.5), and the
prolate-anchor residual must then be smaller than that energy by the factor
in (0.7).

The remaining possible routes are therefore narrower:

1. prove the signed relative leakage estimate (0.7) from the complete
   pole--archimedean--minus-prime formula;
2. prove the covariance-weighted profile estimate (6.9) or (6.10), while
   accounting for the same transverse tower; or
3. replace the one-anchor state by a finite radical block and prove a block
   Feshbach estimate after deflating the captured transverse radicals.

This note proves none of those estimates.  It also proves neither strict
shifted-sector sign, equation (5.2) of `DIRECT_RH_ATTACK.md`, nor locally
uniform determinant convergence.  Numerical agreement cannot replace the
relative signed leakage theorem.

The imported exact inputs are
`EXACT_RADICAL_LEAKAGE_IDENTITY.md`,
`ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md`,
`DERIVATIVE_RADICAL_ODD_SPLIT.md`,
`FIXED_WINDOW_EVEN_MOMENT_SOFT_TRACE_REDUCTION.md`, and
`REGULARIZED_MOMENT_SCHUR_ANGLE_PROFILE.md`.
