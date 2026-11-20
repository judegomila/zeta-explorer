# Complex Mellin action and phase-weighted Stokes interface reduction

## 0. Exact outcome and claim boundary

Put

\[
 L=2\log\lambda,\qquad
 N=\lceil\lambda L^3\rceil,\qquad
 h={2\pi\over L},\qquad
 m=N+1,\qquad
 T=mh,\qquad
 c=2\pi\lambda^2.                                      \tag{0.1}
\]

This note isolates the exact central complex action which a finite-`lambda`
prolate Mellin theorem would have to retain.  If `sigma` denotes a raw
Mellin phase parameter, the central Liouville--Green saddle has the exact
relative action

\[
 \boxed{
 D_c(\sigma)=c\left\{
 \sqrt{1+\left({\sigma\over2c}\right)^2}-1
 -{\sigma\over2c}\operatorname {arsinh}
       \left({\sigma\over2c}\right)\right\}.}          \tag{0.2}
\]

At the locked edge `t=T+O(log L)`, this action is large but slow:

\[
 \operatorname {Re}D_c(7/2-it)={\pi\over4}L^4+o(1),
 \qquad
 \operatorname {Im}D_c(7/2-it)=O(L^2/\lambda),
 \qquad
 \partial_tD_c(7/2-it)=O(L^2/\lambda).                 \tag{0.3}
\]

Thus the `L^4` term is not a breakdown of the saddle method.  It is a
positive, nonperturbative multiplier which must be retained rather than
expanded.  The exact locked label-`0/4` Mellin algebra also shows that the
label-4 component carries `1-O(t^(-2))` of the high-frequency source.
There is no leading label-0/4 cancellation at this saddle.

The second result is an exact carrier-safe projection identity.  If `F` is
the full even arithmetic source, `X` its restriction to the logarithmic
window, and `O=F-X` its exterior, then on an actual critical zero

\[
 \boxed{
 {\sin(\gamma L/2)\over\gamma}
 H_N\!\left({\gamma L\over2\pi}\right)
 =q_L{\sin(\gamma L/2)\over\gamma}C_\gamma
 -q_L{\sin(\gamma L/2)\over\gamma}C_{\gamma,O}
 -{\sqrt L\over2}\widehat O(\gamma),}                 \tag{0.4}
\]

where `q_L=-2(-1)^m/sqrt(L)`.  Formula (0.4) remains finite at exact
carriers.  The corresponding unweighted formula contains a division by
`sin(gamma*L/2)` and cannot be the uniform interface without an additional
phase-separation theorem.

Finally, a Hilbert-space transfer lemma is exact.  If the main weighted
tail has joint constant `kappa`, while the endpoint and weighted row
remainders have relative norm at most `1/4`, then the actual joint constant
is at least `9*kappa/25`.  This is the correct level at which a future
complex-saddle theorem must transfer the ideal alternating-Cauchy filter.
Pointwise relative errors are not enough when the alternating endpoint tail
can cancel.

The complex-sector prolate estimate needed to turn (0.2) into an actual
finite-`lambda` factorization is **not proved here**.  The real-interval
PSWF theorem cited in Section 10 does not state it.  Nor are the required
operator-relative endpoint and row estimates proved.  This is an unbound
post-checkpoint-1.43 theorem-only note/test pair.  It changes no standard
eight file and adds no serialized artifact.  It proves no decay of
`eta_N^pr`, no actual arithmetic sign, no new zeta-zero theorem, no RH
implication or converse, and no de Bruijn--Newman `Lambda` bound.  The
formal state remains `P0_INVALIDATED`.

## 1. Minimal frozen inputs

Exactly two frozen note/test pairs are direct dependencies.

| Dependency | SHA-256 |
|---|---|
| notes/IDEAL_STOKES_ALTERNATING_CAUCHY_FILTER_REDUCTION.md | fb68a7b26abdbc938536c88c9e9780314c0d8b4fc794f24d69a0d4cd8b5a30d2 |
| tests/test_ideal_stokes_alternating_cauchy_filter_reduction.py | 696b74f6743aa7fbd6d1d784381386efc9b588cbd3e9d5eecbe57d822374d6b0 |
| notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md | ecb1b165776fa259dfe01a758d137b5b0267dcbd762b05a6cc1adb9aa2dc6171 |
| tests/test_all_order_prolate_flatness.py | f6a7925a8dd892183953e75ee24acc8bad9fd64226d7f578600736dda1c3fa03 |

The first pair supplies the exact tail notation, the ideal
alternating-Cauchy theorem, and the joint micro-window target.  The second
supplies the source-normalized labels `0/4` combination, its Hermite limit,
and the locked schedule.  The exact endpoint quotient and rational rows
are already frozen dependencies of the first pair.  No result below
promotes an ideal tail to the actual finite prolate source.

## 2. Exact PSWF and Mellin equations

For `j=0,4`, let `Y_(j,c)` be the regular even angular prolate mode on
`[0,1]` in repository normalization:

\[
 -{d\over dz}\left((1-z^2)Y_{j,c}'(z)\right)
 +c^2z^2Y_{j,c}(z)=\chi_j(c)Y_{j,c}(z).               \tag{2.1}
\]

Define its dimensionless positive Mellin transform by

\[
 M_j(s)=\int_0^1Y_{j,c}(z)z^{s-1}\,dz.                 \tag{2.2}
\]

For `Re(s)>2`, two integrations by parts, the regular endpoint condition,
and evenness at zero give the exact recurrence

\[
 \boxed{
 c^2M_j(s+2)+\{s(s-1)-\chi_j(c)\}M_j(s)
 -(s-1)(s-2)M_j(s-2)=0.}                              \tag{2.3}
\]

It continues meromorphically with the Mellin transform.  For the locked
repository scaling, distinguish the physical function and transform

\[
 f_{j,\lambda}(x)=\lambda^{-1/2}Y_{j,c}(x/\lambda),
 \qquad
 \mathcal M_{j,\lambda}(s)
 =\int_0^\lambda f_{j,\lambda}(x)x^{s-1}\,dx
 =\lambda^{s-1/2}M_j(s).                              \tag{2.4}
\]

Thus (2.3) is a dimensionless recurrence; its shifts must not be applied
unchanged to `mathcal M_(j,lambda)`.  Put

\[
 \widetilde M_\lambda(s)
 =a_4M_4(s)-a_{0,\lambda}M_0(s),
 \qquad
 \mathcal M_\lambda(s)
 =\lambda^{s-1/2}\widetilde M_\lambda(s)
 =a_4\mathcal M_{4,\lambda}(s)
  -a_{0,\lambda}\mathcal M_{0,\lambda}(s).            \tag{2.5}
\]

For the dimensionless mixture, the common left side of (2.3) without the
eigenvalue is

\[
 a_4\chi_4(c)M_4(s)-a_{0,\lambda}\chi_0(c)M_0(s).     \tag{2.6}
\]

Because both coefficients are nonzero and `chi_4!=chi_0`, (2.6) is not a
scalar multiple of the first expression in (2.5).  Even labelwise, (2.3)
shifts the real part of
`s` by two; it does not control variation in the real ordinate `t` when
`s=1/2-it`, and it supplies no relative nonvanishing theorem.

The map to the standard fixed-label angular notation is exact.  If the
standard differential parameter is `lambda_D`, then

\[
 \lambda_D=\chi_j(c)-c^2,
 \qquad
 a_j(c)={\lambda_D\over c}+c={\chi_j(c)\over c}
 =2j+1+O(c^{-1}).                                      \tag{2.7}
\]

## 3. Central LG coordinate and the complex saddle

The exact fixed-label central coordinate is

\[
 {\rho^2\over2}=1-\sqrt{1-z^2},
 \qquad
 z^2=\rho^2-{\rho^4\over4}.                           \tag{3.1}
\]

The real fixed-label comparison also uses the perturbed coordinate

\[
 \widehat\rho_j=\rho+c^{-1}\Phi_j(\rho),
 \qquad
 \Phi_j(\rho)={a_j(c)\over4\rho}
             \log\left(1-{\rho^2\over4}\right).       \tag{3.2}
\]

Near zero, `Phi_j(rho)=-a_j*rho/16+O(rho^3)`.  Hence at the saddle below,
the exponent change from `rho` to `widehat(rho)` is only `O(t/c)`.  The
large `t^2/c` action is already carried by the exact coordinate (3.1).

For a leading monomial `z^j` in the label-`j` Mellin integral, define the
raw phase parameter

\[
 \sigma_j=s+j-1,
 \qquad
 \sigma_4=s+3,
 \qquad
 \sigma_0=s-1.                                         \tag{3.3}
\]

Absorbing the integration Jacobian or normalizing directly against a gamma
factor changes `sigma_j` by a fixed integer.  Section 5 proves that every
such fixed shift changes the action by only `O(t/c)`.  In this note the
declared geometric convention is exactly (3.3).

Put `q=rho^2/2` and define the two domains

\[
 \mathbb D_{2c}=\{\sigma:|\sigma|<2c\},
 \qquad
 \Omega_c^-=
 \{\sigma:0<|\sigma|<2c,\ \operatorname {Im}\sigma<0\}. \tag{3.4}
\]

On `mathbb D_(2c)`, use the principal square root in

\[
 q(\sigma)=1+{\sigma\over2c}
 -\sqrt{1+\left({\sigma\over2c}\right)^2}.            \tag{3.5}
\]

The quantity under this square root has positive real part.  The only zero
of `q` in `mathbb D_(2c)` is zero, while `q*(2-q)` has the same property.
Consequently there are unique analytic square roots on the simply connected
lower punctured disk `Omega_c^-` such that

\[
 \rho_\sigma=\sqrt{2q(\sigma)},
 \qquad
 z_\sigma=\sqrt{q(\sigma)\{2-q(\sigma)\}},
 \qquad
 \rho_\sigma,z_\sigma\sim\sqrt{\sigma/c}
 \quad(\sigma\longrightarrow0,\ \sigma\in\Omega_c^-). \tag{3.6}
\]

Here `sqrt(sigma/c)` has argument in `(-pi/2,0)`.  Thus both shifted
critical-line saddles lie on one declared branch, and for a bounded real
part and large positive `t` their arguments tend to `-pi/4`.  Direct
algebra gives

\[
 {\sigma\over c}
 ={q(\sigma)\{2-q(\sigma)\}\over1-q(\sigma)}.          \tag{3.7}
\]

Let `mathcal L_c` be the unique analytic logarithm of `q*(2-q)` on
`Omega_c^-` normalized by
`mathcal L_c(sigma)-Log_-(sigma/c)->0` at zero, where
`-pi<arg(sigma)<0`.  The derivative with respect to `q` of
`-c*q+(sigma/2)*Log(q*(2-q))` is independent of the logarithm branch, and
(3.7) says exactly that it vanishes.  The saddle value on the declared
branch is

\[
 \mathcal P_c(\sigma)
 =-cq(\sigma)+{\sigma\over2}
       \mathcal L_c(\sigma).                           \tag{3.8}
\]

At the locked edge,

\[
 z_{\sigma_j}
 =e^{-i\pi/4}{L\over\sqrt\lambda}\{1+o(1)\},
 \qquad
 \left|\lambda(z-z_{\sigma_j})\right|=O(1)             \tag{3.9}
\]

is the natural complex saddle tube.  The second relation records that the
physical variable `x=lambda*z` has an `O(1)` saddle width.

## 4. Exact relative action

On `mathbb D_(2c)`, take the principal square root and principal `arsinh`
in (0.2).  Both are analytic there, and `D_c(0)=D_c'(0)=0`.

The Gaussian comparison phase has saddle action

\[
 \mathcal G_c(\sigma)
 =-{\sigma\over2}+{\sigma\over2}
                   \operatorname {Log}{\sigma\over c}. \tag{4.1}
\]

Here `Log` is the lower-half-plane branch `Log_-` used above.

Use (3.7) to subtract (4.1) from (3.8).  Since

\[
 1-q(\sigma)
 =\sqrt{1+\left({\sigma\over2c}\right)^2}
   -{\sigma\over2c}
 =\exp\left\{-\operatorname {arsinh}
                   \left({\sigma\over2c}\right)\right\}, \tag{4.2}
\]

the difference is exactly (0.2).  Differentiation gives

\[
 \boxed{
 D_c'(\sigma)=-{1\over2}\operatorname {arsinh}
                         \left({\sigma\over2c}\right).} \tag{4.3}
\]

The local expansion is

\[
 D_c(\sigma)
 =-{\sigma^2\over8c}+{\sigma^4\over384c^3}
  -{\sigma^6\over5120c^5}
  +O\left({|\sigma|^8\over c^7}\right).              \tag{4.4}
\]

This expansion is useful only after the leading `sigma^2/c` term has been
kept in the exponent.  Expanding `exp(D_c)` itself would lose the locked
edge.

For `sigma=-it`, set `v=t/(2c)`.  When `0<=v<1`, (0.2) becomes the positive
real identity

\[
 D_c(-it)=c\left\{\sqrt{1-v^2}-1
                         +v\arcsin v\right\}.          \tag{4.5}
\]

If `0<=v<=1/4`, monotonicity of `arcsin` gives the explicit bounds

\[
 \boxed{
 {t^2\over8c}\leq D_c(-it)
 \leq {t^2\over2c\sqrt {15}}.}                        \tag{4.6}
\]

## 5. Slow variation on the locked edge

For `|sigma/(2c)|<=1/4`, the integral definition of `arsinh` gives

\[
 \left|D_c'(\sigma)\right|
 \leq{|\sigma|\over c\sqrt {15}}.                    \tag{5.1}
\]

Consequently every fixed shift `r` whose joining segment remains in that
closed disk obeys

\[
 \left|D_c(\sigma+r)-D_c(\sigma)\right|
 \leq {|r|\{ |\sigma|+|r|\}\over c\sqrt {15}}.       \tag{5.2}
\]

This includes the difference between `sigma_4=s+3` and `sigma_0=s-1`, and
also every alternative fixed convention caused by putting a Jacobian into
the phase.

Write `sigma=b-it` with fixed real `b`.  Since `D_c(-it)` is real,

\[
 \left|\operatorname {Im}D_c(b-it)\right|
 \leq {|b|\{t+|b|\}\over c\sqrt {15}},
 \qquad
 \left|\partial_tD_c(b-it)\right|
 \leq {t+|b|\over c\sqrt {15}}.                       \tag{5.3}
\]

For the schedule (0.1), ceiling arithmetic gives

\[
 {T\over c}={L^2\over\lambda}+O\left({1\over\lambda^2L}\right),
 \qquad
 D_c(-iT)={\pi\over4}L^4
 +O\left({L^8\over\lambda^2}+{L\over\lambda}\right). \tag{5.4}
\]

Equations (5.2)--(5.4) prove (0.3), with `b=7/2` for the declared label-4
phase.  More generally, uniformly for `|u|<=R_L`,

\[
 D_c(b-i(T+u))-D_c(b-iT)
 =O\left({R_LL^2\over\lambda}\right)                 \tag{5.5}
\]

provided `R_L=o(lambda/L^2)`.  Fixed physical windows and
`R_L=O(log L)` are both permitted.

## 6. Exact high-frequency label-0/4 ratio

Let

\[
 G(s)=\pi^{-s/2}\Gamma(s/2),
 \qquad
 H(s)={s(s-1)\over8}G(s)                              \tag{6.1}
\]

be the positive Mellin transform of the locked Hermite source.  Let `H_0`
and `H_4` be the positive Mellin transforms of the normalized Hermite
labels.  The locked constants are

\[
 a_4={\sqrt3\over2^{11/4}},
 \qquad
 a_{0,\infty}={3\over2^{17/4}},
 \qquad
 H_0(s)=2^{-3/4}G(s).                                  \tag{6.2}
\]

The exact source identity `H=a_4*H_4-a_(0,infinity)*H_0` therefore gives

\[
 a_{0,\infty}H_0(s)={3\over32}G(s),
 \qquad
 a_4H_4(s)={4s(s-1)+3\over32}G(s).                    \tag{6.3}
\]

On the critical line `s=1/2-it`, one has
`s(s-1)=-(t^2+1/4)`.  Hence, with

\[
 \delta_t={3\over4(t^2+1/4)},                         \tag{6.4}
\]

the two exact ratios are

\[
 \boxed{
 {a_4H_4(s)\over H(s)}=1-\delta_t,
 \qquad
 {a_{0,\infty}H_0(s)\over H(s)}=-\delta_t.}           \tag{6.5}
\]

Thus the source does not lose its leading saddle through label mixing.
The label-0 part is quadratically smaller at the edge.

## 7. The unproved complex-sector hypothesis

The following is the narrow analytic estimate suggested by Sections 3--6.
It is stated as a hypothesis, not a conclusion of this note.

**UNPROVED COMPLEX-SECTOR HYPOTHESIS.**  For `j=0,4`, uniformly for
`s=1/2-it` and `|t-T|<=R_L`, the physical positive Mellin transforms obey

\[
 \mathcal M_{j,\lambda}(s)
 =e^{D_c(\sigma_j)}H_j(s)\{1+\varepsilon_j(s)\},
 \qquad
 |\varepsilon_j|+|\partial_t\varepsilon_j|
 \leq\eta_\lambda,
 \qquad
 \eta_\lambda=O(L^2/\lambda),                         \tag{7.1}
\]

with `sigma_4=s+3`, `sigma_0=s-1`, and with a compatible exponentially
damped bound beyond the displayed window.  A pointwise PSWF route to (7.1)
would require a relative comparison on the complex tubes (3.9), a contour
deformation through those tubes, and exclusion of a competing endpoint or
Stokes contribution.

Assume (7.1) only for the algebra in the rest of this section.  Write

\[
 {a_{0,\lambda}\over a_{0,\infty}}=1+\alpha_\lambda,
 \qquad
 \Delta D=D_c(\sigma_0)-D_c(\sigma_4).                 \tag{7.2}
\]

Using (6.5), division of the actual mixed Mellin transform by the proposed
label-4 factor gives the exact conditional identity

\[
 \boxed{
 {\mathcal M_\lambda(s)\over e^{D_c(\sigma_4)}H(s)}
 =(1-\delta_t)(1+\varepsilon_4)
 +\delta_t e^{\Delta D}
       (1+\alpha_\lambda)(1+\varepsilon_0).}           \tag{7.3}
\]

The all-order source normalization gives `alpha_lambda=O(c^(-1))`, while
(5.2) gives `Delta D=O(t/c)`.  Therefore (7.3) would imply

\[
 {\mathcal M_\lambda(s)\over e^{D_c(\sigma_4)}H(s)}
 =1+O\left(\eta_\lambda
 +{\eta_\lambda+t/c+c^{-1}\over t^2}\right).          \tag{7.4}
\]

Let `F_lambda` be the full even logarithmic arithmetic transform.  Exact
Mellin summation gives, for real `t`,

\[
 \widehat F_\lambda(t)
 =\operatorname {Re}\{\zeta(s)\mathcal M_\lambda(s)\},
 \qquad
 \zeta(s)H(s)={\Xi(t)\over4}.                         \tag{7.5}
\]

Thus (7.1) would yield the exact real factorization

\[
 \widehat F_\lambda(t)=W_\lambda(t){\Xi(t)\over4},
 \qquad
 W_\lambda(t)=\operatorname {Re}
 \left[e^{D_c(\sigma_4)}\{1+\varepsilon_{\rm src}(t)\}\right]. \tag{7.6}
\]

If `|epsilon_src|<=1/4` and
`|Im(D_c(sigma_4))|<=1/4`, then

\[
 {1\over2}e^{\operatorname {Re}D_c(\sigma_4)}
 \leq W_\lambda(t)
 \leq {5\over4}e^{\operatorname {Re}D_c(\sigma_4)},
 \qquad
 |\partial_t\log W_\lambda(t)|=O(L^2/\lambda).        \tag{7.7}
\]

This is the desired positive slow finite-prolate multiplier.  Equations
(7.6)--(7.7) are conditional on (7.1); they are not an actual Stokes
theorem.

## 8. Exact endpoint and carrier-safe row identities

Return to a fixed `L`, put `a=L/2`, and let

\[
 X=1_{[-a,a]}F_\lambda,
 \qquad
 O=F_\lambda-X,
 \qquad
 f(t)=\widehat F_\lambda(t),
 \qquad
 t_n=nh.                                               \tag{8.1}
\]

The values at the endpoints are understood with the common periodic
continuity convention.  Define the omitted tails

\[
 \begin{aligned}
 E&=\sum_{k\geq0}(-1)^kf(t_{m+k}),
 &E_O&=\sum_{k\geq0}(-1)^k\widehat O(t_{m+k}),\\
 C_\gamma&=\sum_{k\geq0}(-1)^kf(t_{m+k})
 {\gamma^2\over\gamma^2-t_{m+k}^2},
 &C_{\gamma,O}&=\sum_{k\geq0}(-1)^k\widehat O(t_{m+k})
 {\gamma^2\over\gamma^2-t_{m+k}^2}.
 \end{aligned}                                         \tag{8.2}
\]

Abel limits are used in (8.2) if a cut exterior has only conditional
Fourier convergence.  For `gamma<T`, every Cauchy denominator in (8.2) is
regular.

The centered Fourier coefficients of `X` are

\[
 p_0={\widehat X(0)\over\sqrt L},
 \qquad
 p_n={2(-1)^n\over\sqrt L}\widehat X(t_n)
 \quad(n\geq1).                                        \tag{8.3}
\]

Fourier summation at the common endpoint, followed by
`widehat(X)=f-widehat(O)`, proves

\[
 \boxed{
 d_N=q_LE+r_0,
 \qquad
 q_L=-{2(-1)^m\over\sqrt L},
 \qquad
 r_0=\sqrt L F_\lambda(a)-q_LE_O.}                    \tag{8.4}
\]

Let

\[
 H_X(s)=p_0+s^2\sum_{n\geq1}{p_n\over s^2-n^2}.       \tag{8.5}
\]

The exact compact transform gives

\[
 H_X\!\left({\gamma L\over2\pi}\right)
 ={\sqrt L\,\gamma\over2\sin(\gamma L/2)}
   \widehat X(\gamma).                                 \tag{8.6}
\]

On an actual critical zero, `f(gamma)=0` and therefore
`widehat(X)(gamma)=-widehat(O)(gamma)`.  Subtracting the omitted terms in
(8.5) proves the unweighted identity

\[
 H_N\!\left({\gamma L\over2\pi}\right)
 =q_LC_\gamma-q_LC_{\gamma,O}
 -{\sqrt L\,\gamma\over2\sin(\gamma L/2)}
       \widehat O(\gamma).                              \tag{8.7}
\]

Formula (8.7) explains why an unweighted uniform remainder hypothesis is
too strong near included carriers.  Multiplication by the exact phase
weight gives (0.4), which has no division by the phase.

At an exact included carrier `gamma=t_r`, `1<=r<=N`, continuous
interpretation gives

\[
 \lim_{\gamma\to t_r}{\sin(\gamma L/2)\over\gamma}
 H_N\!\left({\gamma L\over2\pi}\right)
 =-{\sqrt L\over2}\widehat O(t_r).                    \tag{8.8}
\]

Thus exact carriers are retained rather than deleted.

## 9. Hilbert-space transfer with exact constants

Let `I` be a common micro-window and `mathcal J_0` a common finite zero
window, with algebraic multiplicities `m_gamma`.  Put

\[
 \begin{aligned}
 B(L)&=q_L E(L),
 &r(L)&=r_0(L),\\
 A_\gamma(L)&=q_L{\sin(\gamma L/2)\over\gamma}C_\gamma(L),
 &R_\gamma(L)&=-q_L{\sin(\gamma L/2)\over\gamma}C_{\gamma,O}(L)
              -{\sqrt L\over2}\widehat O_L(\gamma).
 \end{aligned}                                         \tag{9.1}
\]

Use the norms

\[
 \|B\|_I^2=\int_I|B(L)|^2\,dL,
 \qquad
 \|A\|_{I,\mathcal J_0}^2
 =\int_I\sum_{\gamma\in\mathcal J_0}
       m_\gamma|A_\gamma(L)|^2\,dL.                   \tag{9.2}
\]

With the frozen carrier-continuous convention, the full denominator is

\[
 D_N(L)=\sum_{\gamma>0}m_\gamma
 \left|{\sin(\gamma L/2)\over\gamma}
 H_N\!\left({\gamma L\over2\pi}\right)\right|^2,
 \qquad
 \int_I D_N(L)\,dL\geq\|A+R\|_{I,\mathcal J_0}^2.    \tag{9.3}
\]

Suppose the main tail satisfies the joint one-vector inequality

\[
 \|A\|_{I,\mathcal J_0}^2
 \geq\kappa\log T\,\|B\|_I^2                         \tag{9.4}
\]

and suppose, for `0<=epsilon_row,epsilon_end<1`, that

\[
 \|R\|_{I,\mathcal J_0}
 \leq\varepsilon_{\rm row}\|A\|_{I,\mathcal J_0},
 \qquad
 \|r\|_I\leq\varepsilon_{\rm end}\|B\|_I.           \tag{9.5}
\]

The triangle inequality and (8.4), (0.4) give the exact transfer

\[
 \boxed{
 \int_I D_N(L)\,dL
 \geq\kappa\left({1-\varepsilon_{\rm row}
                    \over1+\varepsilon_{\rm end}}\right)^2
       \log T\int_I d_N(L)^2\,dL.}                    \tag{9.6}
\]

In particular, if both relative errors are at most `1/4`, then

\[
 \boxed{
 \int_I D_N(L)\,dL
 \geq {9\kappa\over25}\log T
       \int_I d_N(L)^2\,dL.}                          \tag{9.7}
\]

This theorem includes exact carriers because `D_N` is the squared norm of
the left side of (0.4), with multiplicity retained.

There is one more necessary transfer.  Let `A_*`, `B_*` be an ideal model
which satisfies (9.4) with constant `kappa_*`.  If the actual main tail
obeys the operator-relative estimates

\[
 \|A-A_*\|_{I,\mathcal J_0}
 \leq\eta\|A_*\|_{I,\mathcal J_0},
 \qquad
 \|B-B_*\|_I\leq\eta\|B_*\|_I,
 \qquad 0\leq\eta<1,                                  \tag{9.8}
\]

then

\[
 \boxed{
 \|A\|_{I,\mathcal J_0}^2
 \geq\kappa_*\left({1-\eta\over1+\eta}\right)^2
       \log T\,\|B\|_I^2.}                           \tag{9.9}
\]

Combining (9.6) and (9.9) yields the direct sufficient interface

\[
 \boxed{
 \int_I D_N(L)\,dL
 \geq\kappa_*
 \left({1-\eta\over1+\eta}\right)^2
 \left({1-\varepsilon_{\rm row}
             \over1+\varepsilon_{\rm end}}\right)^2
 \log T\int_I d_N(L)^2\,dL.}                         \tag{9.10}
\]

Equations (9.5) and (9.8), rather than a pointwise relative error at each
carrier, are the unproved phase-weighted operator consequence required of
a complex-sector theorem.  They contain no division by
`sin(gamma*L/2)` and retain exact carriers through (8.8).  This is the
sufficient formulation for transferring the ideal alternating-Cauchy
theorem.  A pointwise-small perturbation can have a large ratio to an
alternating sum which is itself small.

## 10. Exact limitation of the available PSWF method

The exact coordinate (3.1), perturbed coordinate (3.2), and real
parabolic-cylinder comparison are the fixed-label specialization of
T. M. Dunster, [*Asymptotics of Prolate Spheroidal Wave
Functions*](https://arxiv.org/abs/1601.00699), especially equations
(108), (114)--(124).  This primary source is already known to the project
but is unvendored and nonbinding for this pair.

Dunster's displayed fixed-label conclusion is uniform for real
`0<=x<=1-delta_0`.  It has an additive
`O(c^(-1) log c)` error times a parabolic-cylinder envelope.  It does not
state a relative estimate in the fourth-quadrant tubes (3.9), a uniform
ordinate derivative, or the Mellin contour and tail estimate in (7.1).
Naive analytic continuation does not repair the omission: an ordinary
Gronwall bound across `|z|=Theta(L/sqrt(lambda))` can cost

\[
 \exp\{C c|z|^2\}
 =\exp\{\Theta(\lambda L^2)\},                         \tag{10.1}
\]

which destroys the required relative saddle scale.  A contour-adapted
complex Volterra or Liouville--Green argument is needed.

The favorable exterior scale also cannot be divided blindly.  Even if one
imports a fixed-label concentration-defect bound of scale
`polynomial*e^(-2c)`, Cauchy--Schwarz controls an endpoint or exterior
amplitude only on the square-root scale

\[
 \operatorname {poly}(\lambda)e^{-c}
 =\operatorname {poly}(\lambda)e^{-2\pi\lambda^2}.      \tag{10.2}
\]

An individual edge carrier suggested by (7.6) has exponential part

\[
 \exp\left\{-{\pi T\over4}+D_c(-iT)\right\}
 =\exp\left\{-{\pi^2\over2}\lambda L^2
              +{\pi\over4}L^4+o(1)\right\}.           \tag{10.3}
\]

Thus (10.2) is far smaller than one individual carrier.  It is still not a
relative endpoint theorem, because the alternating sum `E` can cancel;
an `e^(-2c)` amplitude bound does not follow from the defect scale.  Only
an estimate such as (9.5) or (9.8) permits the absolute exterior scale
to enter the joint quotient.

## 11. Stopping point

The exact action, label algebra, carrier-safe projection formula, and
Hilbert constants are now explicit.  The narrowest missing analytic input
is (7.1) together with its operator-relative consequence (9.8) and the
phase-weighted exterior bounds (9.5).  Nothing in this note proves those
three estimates, the actual joint inequality, decay of the endpoint
quotient, or RH.
