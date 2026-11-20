# Restricted growing-transition curved two-endpoint FIO shell theorem

## 0. Result and fail-closed boundary

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 A=\lambda^2,\qquad c=2\pi A,\qquad L=\log A,
 \qquad h={\pi\over4}.                                \tag{0.1}
\]

In particular, `A` has fractional part `1/4`.  Put

\[
 a_-(U)=2U-{U^2\over c},\qquad
 a_+(V)=2V+{V^2\over c}.                              \tag{0.2}
\]

Let the two profiles be the endpoint-normalized real regular solutions

\[
\begin{aligned}
 (a_-p_\alpha')'+(a_--\alpha)p_\alpha&=0,&
 p_\alpha(0)&=1,&p_\alpha'(0)&={\alpha\over2},\\
 (a_+q_\beta')'+(a_++\beta)q_\beta&=0,&
 q_\beta(0)&=1,&q_\beta'(0)&=-{\beta\over2}.
\end{aligned}                                         \tag{0.3}
\]

No modal endpoint value, exterior-defect whitening factor, or
`(1+chi_alpha)chi_beta` factor is included in (0.3).  For an integer
`n>=2`, define

\[
 U_n=c\left(1-{1\over n}\right),\qquad
 V_n(U)=c(n-1)-nU,
\]

and the raw full-shell integral

\[
 \boxed{I_n(\alpha,\beta)
 =\int_0^{U_n}p_\alpha(U)q_\beta(V_n(U))\,dU.}         \tag{0.4}
\]

Fix positive constants `A_1,C,epsilon`, put

\[
 r={\pi\over2}+\epsilon,
\]

and take the restricted positive clusters

\[
 \beta=A_1L+O(1),\qquad
 \alpha=(A_1+C)L+O(1).                              \tag{0.5}
\]

The bounded errors in (0.5) are uniform.  Assume the explicit margins

\[
 rA_1<{1\over2},\qquad {r\over2}>h,\qquad
 h(A_1+C)+rA_1<1,                                   \tag{0.6}
\]

and, decisively,

\[
 \boxed{
 h(A_1+C)+\left(h+{3r\over2}\right)A_1<1,}
 \quad\hbox{equivalently}\quad
 {\pi C\over4}+
 \left({5\pi\over4}+{3\epsilon\over2}\right)A_1<1.
                                                               \tag{0.6a}
\]

The region is nonempty: `A_1=1/20`, `C=1/5`, and `epsilon=1/10`
satisfy (0.6)--(0.6a).  The third inequality in (0.6) follows from
(0.6a), but it is displayed separately because it is the smallness
condition in the crude Green argument.

All constants below may depend on `A_1,C,epsilon`, the positive margins
in (0.6)--(0.6a), and a fixed bound for the `O(1)` widths in (0.5), but
not on `c,n,alpha,beta`.  Choose once and for all
`D>A_1+C+1` when applying the local lemmas.

Then, uniformly for every integer `2<=n<=floor(A)` (equivalently
`2<=n<A`, because `A` has fractional part `1/4`),

\[
\boxed{
 |I_n(\alpha,\beta)|
 \leq C_{A_1,C,\epsilon}L^{\kappa}c^{-1/2}
 \left\{
 e^{h(\alpha-\beta)}{n\over n^2-1}
 +{1\over n^2-1}
 \right\}.}                                          \tag{0.7}
\]

Since

\[
 {n\over n^2-1}\leq {2\over\sqrt3}{1\over\sqrt{n^2-1}},
\]

(0.7) implies the requested two-endpoint envelope

\[
 |I_n(\alpha,\beta)|
 \leq C_{A_1,C,\epsilon}L^{\kappa}c^{-1/2}
 \left\{
 {e^{h(\alpha-\beta)}\over\sqrt{n^2-1}}
 +{1\over n^2-1}
 \right\}.                                           \tag{0.8}
\]

The two terms in (0.7) have different origins.  The first is the inward
far carrier paired with the **subunit** outward Abel transform.  The second
is the outward far carrier paired with the **superunit** inward endpoint
transform.  Combining their denominators or omitting either endpoint is
not valid.

The theorem is deliberately restricted to (0.5)--(0.6a).  At the level
of the two principal flat endpoint terms, arbitrary signed
`alpha,beta=O(L)` would require the replacements

\[
 e^{h\alpha_+}e^{-h\beta}
 \quad\hbox{in the first term},\qquad
 E_\beta=e^{h(-\beta)_+}
 \quad\hbox{in the second term}.                      \tag{0.9}
\]

Indeed the exact flat inward carrier has size proportional to
`sqrt(1+e^(2h alpha))`, not `e^(h alpha)` for negative `alpha`.  Thus
the statement with only `e^(h(alpha-beta))` is not uniform over an
unsigned `O(L)` box.  The curved comparison proved below also costs two
one-point action envelopes.  No signed-box theorem is claimed here.

For `n>A`, the physical convolution stops at

\[
 U_L=c(1-A^{-1})<U_n.
\]

Writing

\[
 I_{n,A}(\alpha,\beta)
 =\int_0^{U_L}p_\alpha(U)q_\beta(V_n(U))\,dU,
 \qquad
 b_{n,A}=c\left\{\left({n\over A}\right)^2-1\right\},
\]

one has the uniform truncated-tail bound

\[
\boxed{
 |I_{n,A}(\alpha,\beta)|
 \leq C_{A_1,C,\epsilon}L^{\kappa}c^{-1/2}
 \left\{
 {1\over n^2-1}
 +{e^{h\alpha}\over
 n\sqrt{1+b_{n,A}}}
 \right\},\qquad n>A,}                               \tag{0.10}
\]

Consequently

\[
\boxed{
 \sum_{n>A}\Lambda(n)|I_{n,A}(\alpha,\beta)|
 \leq C_{A_1,C,\epsilon}L^{\kappa+1}{e^{h\alpha}\over c}.} \tag{0.11}
\]

The exact direct-source normalization is recorded in Section 8.  In
particular the profile convolution contributes `omega_M(1)^2 n/c`
outside the raw integral (0.4); the prime coefficient `2 Lambda(n)/n`
cancels that `n`.  There is no hidden `n/c` or Fejer weight in `I_n`.

This theorem treats only the local `m=l=1` curved prime shell.  It does
not treat a higher inward or outward sampler, a mixed sampler axis, the
complete pole--Archimedean--minus-prime distribution, a source congruence,
an exterior-metric operator norm, endpoint shear, the complete central
floor, equation (5.2) of `DIRECT_RH_ATTACK.md`, a determinant conclusion,
or RH.  The project state remains `P0_INVALIDATED`.

## 1. Repository inputs

No external source or zero table is used.  The physical normalization and
the elementary flat Kummer transform are inherited from the following
frozen bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md` | `2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97` |
| `tests/test_growing_transition_direct_source_upper_form_theorem.py` | `96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2` |
| `notes/GROWING_TRANSITION_EDGE_CARLEMAN_SCATTERING_OBSTRUCTION.md` | `1edd9639d69980f2a8662b0d0fab0b8fdfb49f853b4599c9a945092358c6018d` |
| `tests/test_growing_transition_edge_carleman_scattering_obstruction.py` | `b3420f2f94f2082b68efbdb2e1c5144abdbdeb35619354f15a72c6b75131d9fb` |

The finite-`c` matched remainder claimed in
`GROWING_TRANSITION_SUBUNIT_WEBER_ABEL_TRANSFORM_THEOREM.md` is **not** an
input.  Its first strict audit found that the stated overlap estimate loses
one power of the endpoint scale.  Section 5 below uses only the exact flat
Abel boundary, while (3.4) compares the curved solution with the flat one
on the finite endpoint patch.  The omitted flat tail and the actual curved
middle are then bounded separately by nonstationary carrier integration.

## 2. Exact geometry and Liouville normal forms

Along the shell, direct substitution gives

\[
\boxed{
 a_+(V_n(U))=c(n^2-1)-n^2a_-(U).}                    \tag{2.1}
\]

Write

\[
 a=a_-(U),\qquad b=a_+(V_n(U)),\qquad
 K_n=c(n^2-1).
\]

Then

\[
 b=K_n-n^2a.                                         \tag{2.2}
\]

The two endpoint values that determine the normalization are exact:

\[
\boxed{
 b(0)=c(n^2-1),\qquad
 a(U_n)=c{n^2-1\over n^2}.}                           \tag{2.3}
\]

Set

\[
 P(U)=\sqrt{a_-(U)}p_\alpha(U),\qquad
 Q(V)=\sqrt{a_+(V)}q_\beta(V).
\]

A direct differentiation, using

\[
 (a_\pm')^2=4\left(1\pm{a_\pm\over c}\right),
 \qquad a_\pm''=\pm{2\over c},
\]

gives the exact normal forms

\[
\boxed{
 P''+\Omega_-^2P=0,
 \qquad
 \Omega_-^2=1-{\alpha\over a_-}+{1\over a_-^2},}    \tag{2.4}
\]

and

\[
\boxed{
 Q''+\Omega_+^2Q=0,
 \qquad
 \Omega_+^2=1+{\beta\over a_+}+{1\over a_+^2}.}     \tag{2.5}
\]

For `Q(V_n(U))`, the local frequency in the `U` variable is
`n Omega_+(V_n(U))`.  Moreover

\[
 I_n=\int_0^{U_n}{P(U)Q(V_n(U))\over\sqrt{a(U)b(U)}}\,dU. \tag{2.6}
\]

The possible Liouville turning points are explicit.  For the inward
profile they solve

\[
 a^2-\alpha a+1=0,                                   \tag{2.7}
\]

and can occur only for `alpha>=2`; both positive roots are at most
`alpha`.  For the outward profile they solve

\[
 b^2+\beta b+1=0,                                    \tag{2.8}
\]

and can occur only for `beta<=-2`; both positive roots are at most
`|beta|`.  Thus every turning layer lies inside an endpoint region
`a<=R` or `b<=R` as soon as

\[
 R\geq8(1+|\alpha|+|\beta|).                         \tag{2.9}
\]

There is no unaccounted interior turning layer.

On `a,b>=R`, put `B=1+|alpha|+|beta|`.  If `R>=64B`, then

\[
 |\Omega_\pm-1|\leq {1\over32}.
\]

Hence every same-carrier phase has the uniform gap

\[
\boxed{
 n\Omega_+-\Omega_-
 \geq {3\over4}(n-1),\qquad n\geq2,}                 \tag{2.10}
\]

while the opposite-carrier gap is at least `3(n+1)/4`.  Therefore the
interior is genuinely nonstationary.  Identity (2.2), rather than a flat
replacement of either coefficient, is what makes this conclusion uniform
up to both endpoints.

## 3. A crude two-envelope curved-to-flat lemma

For `varepsilon` equal to `+1` or `-1`, set

\[
 a_\varepsilon(x)=2x+\varepsilon{x^2\over c}.
\]

Let `y_(varepsilon,c,gamma)` be the regular solution

\[
 (a_\varepsilon y')'+(a_\varepsilon+\gamma)y=0,
 \qquad y(0)=1,\qquad y'(0)=-{\gamma\over2}.          \tag{3.1}
\]

The flat regular solution is

\[
 w_\gamma(x)=e^{ix}
 {}_1F_1\left({1\over2}-{i\gamma\over4};1;-2ix\right). \tag{3.2}
\]

Put `E_gamma=exp(h(-gamma)_+)`, `m(x)=min(sqrt(x),1)`, and
`ell(x)=1+log_+(1/x)`.  For fixed `D,delta>0`, there are
`C_D,kappa_D` such that, if

\[
 |\gamma|\leq DL,\qquad
 8(1+|\gamma|)\leq R\leq c^{1/2-\delta},\qquad
 C_DL^{\kappa_D}E_\gamma{LR+\log(2+R)\over c}\leq{1\over2}.       \tag{3.3}
\]

then

\[
\begin{aligned}
 |(y-w_\gamma)(x)|
 &\leq C_DL^{\kappa_D}E_\gamma^2
 {x\ell(x)\over c\sqrt{1+x}},\\
 |(y'-w_\gamma')(x)|
 &\leq C_DL^{\kappa_D}E_\gamma^2
 {\ell(x)\sqrt{1+x}\over c},\\
 \int_0^R\{|y-w_\gamma|+|y'-w_\gamma'|\}\,dx
 &\leq C_DL^{\kappa_D}E_\gamma^2{R^{3/2}\over c},\\
 \left|\int_0^R(y-w_\gamma)e^{iNx}\,dx\right|
 &\leq C_DL^{\kappa_D}E_\gamma^2{R^{3/2}\over c|N|},
 \qquad |N|\geq1.
\end{aligned}                                         \tag{3.4}
\]

The first two lines hold for `0<x<=R`, with the endpoint values supplied
by regularity.  For `|N|<=1`, the third line
supplies the required `L1` estimate.  The square on `E_gamma` is
intentional: it avoids an unproved action-envelope-ratio estimate.

Here is the perturbation calculation.  If `Y=sqrt(a_varepsilon)y`, its exact
normal potential differs from the flat one by

\[
\boxed{
 \Omega_\varepsilon^2-\Omega_0^2
 =-{\varepsilon\gamma\over4c(1+\varepsilon x/(2c))}
 -{\varepsilon\over4cx}
 {1+\varepsilon x/(4c)\over(1+\varepsilon x/(2c))^2}.}             \tag{3.5}
\]

For `a_K=1/2-i gamma/4`, a flat fundamental pair is

\[
\begin{aligned}
 F(x)&=\sqrt{2x}e^{ix}M(a_K,1,-2ix),\\
 G(x)&=-{\Gamma(a_K)\over2}\sqrt{2x}e^{ix}U(a_K,1,-2ix),
\end{aligned}                                        \tag{3.6}
\]

with `W_x(F,G)=1`.  Define

\[
 \|(Z,Z')\|_x={|Z|\over m(x)}+m(x)|Z'|.
\]

The individual Kummer state bounds are

\[
\boxed{
 \|(F,F')\|_x\leq C_DL^{\kappa_D}E_\gamma,
 \qquad
 \|(G,G')\|_x\leq C_DL^{\kappa_D}\ell(x),
 \qquad x>0.}                                        \tag{3.6a}
\]

We verify the two features in (3.6a) that a crude product estimate can
easily miss.  Uniformly for `x<=c_D/(1+|gamma|)`, Frobenius expansion gives

\[
\begin{aligned}
 F(x)&=\sqrt{2x}\{1+O_D(Lx)\},\\
 G(x)&={\sqrt{2x}\over2}
 \{\log(-2ix)+\psi(a_K)+2\gamma_E\}
 +O_D\{L^{\kappa_D}x^{3/2}(1+|\log x|)\}.
\end{aligned}                                        \tag{3.6b}
\]

Thus the logarithm in (3.6a) is necessary.  At infinity the Tricomi
solution has one carrier, whose coefficient satisfies

\[
 \left|\Gamma\left({1\over2}-{i\gamma\over4}\right)
 (-i)^{-1/2+i\gamma/4}\right|
 \leq C e^{-h(-\gamma)_+},                           \tag{3.6c}
\]

by `|Gamma(1/2+is)|^2=pi/cosh(pi s)`.  The flat normal frequency has
forbidden action

\[
 \int_0^\infty
 \sqrt{\left[-1-{\gamma\over2x}-{1\over4x^2}\right]_+}\,dx
 =h(-\gamma)-{\pi\over2}\leq h(-\gamma)             \tag{3.6d}
\]

when `gamma<=-2`, and zero action otherwise.  Scalar energy comparison
on the origin, forbidden, turning, and allowed intervals gives, for
`Q_gamma=1+gamma/(2x)+1/(4x^2)`, the explicit transfer estimate

\[
 \|\Phi_\gamma(x,t)\|_{t\to x}
 \leq C_DL^{\kappa_D}\ell(t)
 \exp\left\{\int_t^x\sqrt{[-Q_\gamma(s)]_+}\,ds\right\}.
\]

The factor `ell(t)` is needed only when the initial point approaches the
regular singular endpoint; omitting it would be false.  Here are
quantitative zones proving that the remaining prefactor is only
polynomial.  The only nontrivial case is `gamma=-alpha<-2`; its roots
are

\[
 x_\pm={\alpha\pm\sqrt{\alpha^2-4}\over4}.
\]

The bounded range `2<=alpha<=16` is covered by one compact transfer, so
assume `alpha>=16` in the following zone decomposition.

The Frobenius estimates (3.6b) cover `x<=epsilon_0/alpha`.  With
`x=xi/alpha`, a fixed `xi` interval crosses the lower root with a bounded
Volterra matrix.  On
`[2/alpha,x_+-alpha^(1/3)]`, diagonal energy transfer has logarithmic
variation `O(log alpha)` and exponential exactly
`exp(int sqrt(-Q_(-alpha)))`.  At the upper root, put
`x=x_++alpha^(1/3)s`; on every fixed `s` interval one has
`alpha^(2/3)Q_(-alpha)=O(1)`, so the rescaled Volterra transfer is
`O(alpha^k)`.  On the remaining allowed interval the usual positive
energy has logarithmic variation `O(log alpha)`.  These four estimates
give the displayed transfer bound.

It bounds the regular state by `L^k E_gamma`.  For `G`, initialize at
`X=64(1+alpha)^3`.  The needed large-argument estimate is uniform in the
growing Kummer parameter: writing

\[
 U(a_K,1,z)=z^{-a_K}\{1+\rho(z)\}
\]

in `zU''+(1-z)U'-a_KU=0`, imposing `rho(infinity)=0`, and integrating
the resulting first-order equation for `rho'` gives

\[
 |\rho(z)|+|z\rho'(z)|
 \leq C{|a_K|^2\over|z|},\qquad
 |z|\geq32(1+|a_K|)^3,\quad -{\pi\over2}\leq\arg z<0.              \tag{3.6e}
\]

Indeed the Volterra kernel after this substitution has norm at most
`2|a_K|^2/|z|`; the differentiated equation gives the second term with
the same constant.  Hence the lateral limit at `z=-2iX` is uniform.
Together with (3.6c), (3.6e) gives state size
`O(L^k e^(-h alpha))` at `X`.  Backward transfer through the barrier costs
at most `L^k exp(h alpha-pi/2)`, hence leaves only a polynomial.  For
`gamma>=0` there is no forbidden interval and positive energy has
polynomial variation; the remaining bounded parameter ranges are compact.
Differentiating the
allowed carrier formulas and applying the same rescaled energy at the
two turning points proves the derivative bounds.
Together with (3.6b), this proves (3.6a).  The same polynomial bound for
`G` can also be obtained directly from

\[
 \Gamma(a_K)U(a_K,1,z)
 =\int_0^\infty e^{-zt}t^{a_K-1}(1+t)^{-a_K}\,dt,
 \qquad \Re z>0,
\]

followed by the lateral limit `z downarrow -2ix`: its amplitude is
`1/sqrt(t(1+t))`, and a three-interval van der Corput split is polynomial
in `1+|gamma|`.

Let `mathcal G_gamma(x,t)` be the Green propagator formed from `F,G`.
Since `ell(x)<=ell(t)` for `0<t<=x`, the Wronskian and (3.6a) give

\[
 \|\mathcal G_\gamma(x,t)(0,f)\|_x
 \leq C_DL^{\kappa_D}E_\gamma\ell(t)m(t)|f|.
                                                               \tag{3.6f}
\]

The endpoint factor `m(t)^2=min(t,1)` cancels the apparent `1/t` in
(3.5), even in the presence of `ell(t)`, and

\[
 \int_0^R m(t)^2\ell(t)|\Omega_\varepsilon^2-\Omega_0^2|\,dt
 \leq C_DL^{\kappa_D}{LR+\log(2+R)\over c}.          \tag{3.6g}
\]

The two regular normal solutions have the same leading `sqrt(2x)` term,
so the Green formula has no origin boundary term.  Duhamel's formula,
(3.3), and Gronwall first give

\[
 \|(Y,Y')\|_x\leq C_DL^{\kappa_D}E_\gamma
\]

and then

\[
 \|(Y-F,Y'-F')\|_x
 \leq C_DL^{\kappa_D}E_\gamma^2
 {Lx+x\ell(x)+\log(1+x)\over c}.                    \tag{3.6h}
\]

Dividing by `sqrt(a_varepsilon)`, differentiating the quotient, and using
`a_varepsilon/(2x)=1+O(R/c)` proves the first two lines of (3.4).  Their
integrals give the third line.  Integration by parts for `|N|>=1`, using
`d(0)=0`, gives the last line.  In particular, the pointwise derivative
needed to initialize the carriers at `R` is proved directly.

For the inward profile, `varepsilon=-1` and `gamma=-alpha`.  The convenient
forbidden-action majorant obtained by dropping the positive Langer term
`a_-^(-2)` has the exact representation

\[
 \alpha\int_0^{\pi/2}
 {\cos^2\phi\over
  \sqrt{1-(\alpha/c)\sin^2\phi}}\,d\phi
 =h\alpha+O(\alpha^2/c).                             \tag{3.7}
\]

The actual turning points solve `a_-^2-alpha*a_-+1=0`, so the positive
Langer term shortens the forbidden interval and lowers its action.  Thus
the endpoint-normalized inward carrier costs at most `e^(h alpha)`.  For
the outward profile with `beta>=0`, there is no forbidden interval and
`E_beta=1`.

## 4. Allowed-region carriers and the interior gap estimate

On the allowed inward region choose `phi_-'=Omega_-` and define

\[
\begin{aligned}
 A_+(U)&={1\over2}e^{-i\phi_-(U)}
 \left(P-{iP'\over\Omega_-}\right),\\
 A_-(U)&={1\over2}e^{ i\phi_-(U)}
 \left(P+{iP'\over\Omega_-}\right).
\end{aligned}                                        \tag{4.1}
\]

Then `P=A_+e^(i phi_-)+A_-e^(-i phi_-)`.  Define `B_+,B_-`
analogously for `Q` and `phi_+'=Omega_+`.  The energy identity and
variation of `log Omega` give

\[
\begin{aligned}
 \sup(|A_+|+|A_-|)+\operatorname {Var}A_+
       +\operatorname {Var}A_-
 &\leq C_DL^{\kappa_D}e^{h\alpha},\\
 \sup(|B_+|+|B_-|)+\operatorname {Var}B_+
       +\operatorname {Var}B_-
 &\leq C_DL^{\kappa_D}.
\end{aligned}                                         \tag{4.2}
\]

The first bound is initialized by the pointwise state estimate (3.6h),
not by the integrated estimate in (3.4).  The Green smallness in (3.3)
keeps the carrier size at one action factor `e^(h alpha)`, although the
curved-to-flat *difference* costs its square.  Direct differentiation of
(4.1) bounds each local carrier variation by its supremum times the local
variation of `log Omega`.  After the turning regions have been crossed,

\[
 \operatorname {Var}\log\Omega_\pm
 \leq C\left({B\over R}+{1\over R^2}\right).        \tag{4.3}
\]

We also record two signed carrier consequences used below.  Since
`beta>=0`, one has `Omega_+(V)>=1` on the entire outward half-line.
For `0<=N<=3/5`, carrier integration by parts, uniformly before removal
of the Abel regulator, gives

\[
\boxed{
 \left|\operatorname {Abel}\int_{V_0}^\infty
 q_\beta(V)e^{-i\sigma NV}\,dV\right|
 \leq {C_DL^{\kappa_D}\over
 \sqrt{1+a_+(V_0)}},\qquad
 V_0\geq0,\quad 0\leq N\leq{3\over5}.}             \tag{4.3a}
\]

For `V_0>=1`, write `Q=B_+e^(i phi_+)+B_-e^(-i phi_+)` and integrate
the two phases, whose derivatives have modulus at least `2/5`.  The BV
norms of `B_\pm/sqrt(a_+)` and of the reciprocal phase gaps are bounded
by their value at `V_0`; this proves (4.3a).  For `V_0<=1`, split at one,
use regularity on the compact first piece, and use the preceding estimate
on the tail.  This proof is uniform through `V_0` of size `beta`; there is
no outward turning point.

The same calculation for the flat carriers, once
`R>=L^M` with `M` fixed sufficiently large, gives

\[
\begin{aligned}
 \left|\operatorname {Abel}\int_R^\infty
 w_\beta(V)e^{-i\sigma NV}\,dV\right|
 &\leq C_DL^{\kappa_D}R^{-1/2},&& |N|\leq{3\over5},\\
 \left|\operatorname {Abel}\int_R^\infty
 w_{-\alpha}(U)e^{-i\tau NU}\,dU\right|
 &\leq {C_DL^{\kappa_D}e^{h\alpha}\over
 (N-1)\sqrt R},&& N\geq2.
\end{aligned}                                         \tag{4.3b}
\]

These are signed omitted-tail bounds.  Absolute integrability of either
flat Weber profile is neither true nor used.

For a product carrier the phase derivative is one of

\[
 \pm\Omega_-(U)\mp n\Omega_+(V_n(U)).               \tag{4.4}
\]

Equations (2.10), (4.2), and one integration by parts control every
interior product.  The density is especially simple: by (2.2),

\[
 {1\over\sqrt{ab}}={1\over\sqrt{a(K_n-n^2a)}}.       \tag{4.5}
\]

As a function of the monotone variable `a`, it has one interior minimum.
Its total variation is bounded by its two endpoint values.  At `a=R`
and `b=R`, respectively, these values are

\[
 {1+o(1)\over\sqrt{RK_n}},\qquad
 {n+o(1)\over\sqrt{RK_n}}.                           \tag{4.6}
\]

The differentiated phase costs only (4.3).  Thus the interior and cutoff
matching error has the same two endpoint scales and no factor proportional
to the interval length.

## 5. The subunit endpoint

At the endpoint `U=U_n`, change variables to `V=V_n(U)`.  Since
`dU=-dV/n`, (2.3) gives the exact prefactor

\[
 \boxed{{1\over n\sqrt{a_-(U_n)}}
 ={1\over\sqrt c\sqrt{n^2-1}}.}                      \tag{5.1}
\]

Put `a_n=a_-(U_n)=c(n^2-1)/n^2`.  The affine shell identity gives

\[
 \boxed{
 a_-\left(U_n-{V\over n}\right)
 =a_n-{a_+(V)\over n^2}.}                            \tag{5.1a}
\]

If `a_+(V)<=R`, (4.1), (4.3), and (5.1a) imply

\[
\begin{aligned}
 {a_-(U_n-V/n)^{-1/2}\over a_n^{-1/2}}&=1+O(R/c),\\
 \operatorname {Var}_{a_+(V)\leq R}A_\pm
 &\leq C_DL^{\kappa_D}e^{h\alpha}{LR\over c^2n^2},\\
 \phi_-\left(U_n-{V\over n}\right)
 &=\phi_-(U_n)-{\Omega_-(U_n)\over n}V+\theta_R(V),\\
 |\theta_R(V)|&\leq C_D{LR^2\over c^2},\qquad
 \left|{\Omega_-(U_n)\over n}-{1\over n}\right|
 \leq C_D{L\over cn}.
\end{aligned}                                         \tag{5.1b}
\]

Thus freezing the half-density, carrier, and phase is quantified.  For
the flat regular solution (3.2), its exact lateral Abel transform inside
the two branch points is

\[
 F_{0,\sigma}(N,\beta)
 =\int_0^\infty w_\beta(V)e^{-i\sigma NV}\,dV
 ={e^{-h\beta}\over\sqrt{1-N^2}}
 e^{i\sigma\beta\log\{(1+N)/(1-N)\}/4},
 \qquad |N|<1.                                       \tag{5.2}
\]

In particular,

\[
\boxed{
 F_{0,\sigma}(1/n,\beta)
 ={n e^{-h\beta}\over\sqrt{n^2-1}}
 e^{i\sigma\beta\ell_n/4},
 \quad
 \ell_n=\log{n+1\over n-1}.}                         \tag{5.3}
\]

Moreover

\[
 |\partial_NF_{0,\sigma}(N,\beta)|
 \leq C(1+\beta)e^{-h\beta},\qquad |N|\leq{3\over5}. \tag{5.4}
\]

Since `a_-(U_n)>=3c/4`, eventually
`|Omega_-(U_n)/n|<=3/5`.  Thus it may be replaced by `1/n` uniformly in
`n>=2`; (5.4) and the last line of (5.1b) control this replacement.
On `0<=V<=R`, (3.4), with `E_beta=1`, replaces the curved `q_beta` by
`w_beta` with error `O(L^kR^(3/2)/c)`.  The phase and amplitude freezing
errors in (5.1b), using `int_0^R|w_beta|<=L^k sqrt(R)`, are smaller by
`O(LR/c)`.  Extending the flat patch from `R` to infinity costs
`O(L^kR^(-1/2))` by (4.3b).  The actual curved remainder starts at `R`
and is estimated separately in Section 7.  No global finite-`c`
Abel-transform remainder is used.

Consequently the principal right-end term is

\[
\boxed{
 M_{n,R}={1\over\sqrt c\sqrt{n^2-1}}
 \sum_{\sigma=\pm1}A_\sigma(U_n)e^{i\sigma\phi_-(U_n)}
 F_{0,\sigma}(1/n,\beta).}                            \tag{5.5}
\]

Equations (4.2) and (5.3) give

\[
 |M_{n,R}|
 \leq C_DL^{\kappa_D}e^{h(\alpha-\beta)}c^{-1/2}
 {n\over n^2-1}.                                     \tag{5.6}
\]

The factor `e^(-h beta)` is a lateral Abel boundary value.  It cannot be
obtained by taking absolute values of the real far carriers of `q_beta`.
This is why a two-ended signed nonstationary calculation is necessary.

## 6. The superunit endpoint

At `U=0`, the outward profile is far and (2.3) gives

\[
 \boxed{{1\over\sqrt{a_+(c(n-1))}}
 ={1\over\sqrt c\sqrt{n^2-1}}.}                      \tag{6.1}
\]

Put `V_0=c(n-1)` and `b_0=a_+(V_0)=c(n^2-1)`.  On the left patch the
exact affine identity is

\[
 \boxed{a_+(V_0-nU)=b_0-n^2a_-(U).}                 \tag{6.1a}
\]

For `a_-(U)<=R`, it gives

\[
\begin{aligned}
 {a_+(V_0-nU)^{-1/2}\over b_0^{-1/2}}&=1+O(R/c),\\
 \operatorname {Var}_{a_-(U)\leq R}B_\pm
 &\leq C_DL^{\kappa_D}{LR\over c^2(n^2-1)},\\
 \phi_+(V_0-nU)
 &=\phi_+(V_0)-n\Omega_+(V_0)U+\theta_L(U),\\
 |\theta_L(U)|&\leq C_D{LR^2\over c^2},\qquad
 |n\Omega_+(V_0)-n|\leq C_D{L\over cn}.
\end{aligned}                                         \tag{6.1b}
\]

The flat inward endpoint transform is exact:

\[
\boxed{
 \int_0^\infty w_{-\alpha}(U)e^{-i\tau nU}\,dU
 ={-i\tau\over\sqrt{n^2-1}}
 e^{-i\tau\alpha\ell_n/4},\qquad \tau=\pm1.}       \tag{6.2}
\]

For its continuation to every `N>=2`, direct differentiation gives

\[
 \left|\partial_N\left\{{-i\tau\over\sqrt{N^2-1}}
 e^{-i\tau\alpha\log((N+1)/(N-1))/4}\right\}\right|
 \leq C{N+\alpha\over(N^2-1)^{3/2}}.                \tag{6.2a}
\]

Thus (6.1b) permits replacement of `n Omega_+(V_0)` by `n`.  On the
endpoint patch, (3.4) replaces `p_alpha` by `w_(-alpha)` at cost
`O(L^k e^(2h alpha)R^(3/2)/c)`; (6.1b),
`int_0^R|w_(-alpha)|<=L^k e^(h alpha)sqrt(R)`, and
(4.3b) control, respectively, freezing and the omitted flat tail.

The integral is the appropriate lateral Abel boundary value.  The curved
local comparison (3.4), followed by the carrier matching of Section 4,
shows that the principal left-end term is

\[
\boxed{
 M_{n,L}={1\over\sqrt c(n^2-1)}
 \sum_{\tau=\pm1}(-i\tau)B_\tau(c(n-1))
 e^{i\tau\phi_+(c(n-1))-i\tau\alpha\ell_n/4}.}       \tag{6.3}
\]

Therefore

\[
 |M_{n,L}|
 \leq C_DL^{\kappa_D}c^{-1/2}{1\over n^2-1}.         \tag{6.4}
\]

The quadratic part of `a_+` is essential in (6.1).  Replacing
`a_+(V)` by `2V` at the macroscopic point `V=c(n-1)` would give the false
scale `c^(-1/2)n^(-3/2)` instead of the exact
`c^(-1/2)(n^2-1)^(-1)` after (6.2).

## 7. Endpoint matching and uniform error

Choose

\[
 R=\max\{L^M,e^{r\beta}\},\qquad r={\pi\over2}+\epsilon,            \tag{7.1}
\]

where `M` is a sufficiently large fixed integer.  Conditions
(0.6)--(0.6a) imply that for some fixed `delta,eta>0`, eventually

\[
 64(1+\alpha+\beta)\leq R\leq c^{1/2-\delta},\qquad
 L^{\kappa_D}e^{h\alpha}{LR+\log(2+R)\over c}=o(1). \tag{7.2}
\]

Moreover

\[
\begin{aligned}
 e^{h\alpha}R^{-1/2}
 &\leq e^{h(\alpha-\beta)}c^{-\eta},\\
 L^{\kappa_D}e^{2h\alpha}{R^{3/2}\over c}
 &\leq e^{h(\alpha-\beta)}c^{-\eta},\\
 R^{-1/2}+L^{\kappa_D}{R^{3/2}\over c}&=o(1).
\end{aligned}                                         \tag{7.3}
\]

The first line uses `r/2>h`.  After division by
`e^(h(alpha-beta))`, the exponent in the second line is

\[
 h(A_1+C)+\left(h+{3r\over2}\right)A_1-1,
\]

which is negative precisely by (0.6a).  The last condition in (3.3)
follows from the third inequality in (0.6).

For clarity, every other power used in endpoint freezing and in the
truncated tail follows from the same general margins:

\[
\begin{aligned}
 {R\over c^{1/2}}&=c^{rA_1-1/2+o(1)}=o(1),\\
 {LR\over c}&=c^{rA_1-1+o(1)}=o(1),\\
 {R^{3/2}\over c}&=c^{3rA_1/2-1+o(1)}=o(1),\\
 {e^{h\alpha}R^{3/2}\over c^{3/2}}
 &=c^{h(A_1+C)+3rA_1/2-3/2+o(1)}=o(1).
\end{aligned}                                         \tag{7.3b}
\]

Indeed (0.6a) implies both
`h(A_1+C)+rA_1<1` and
`h(A_1+C)+3rA_1/2<1`; hence it is stronger than every exponent in
(7.3b).  The factors `L^k` are absorbed by the displayed strict margins.

Use smooth cutoffs at `a=R` and `b=R`.  On the two endpoint pieces add and
subtract the full **flat** transforms (5.2) and (6.2).  Bound each omitted
flat tail from `R` separately by its Kummer carrier asymptotics, and bound
the actual curved middle by the four nonstationary carrier integrals.
No comparison of the flat and curved phases beyond `R` is made.  At the
two ends of the middle interval, (4.6) and the gap (2.10) give

\[
 {1\over\sqrt{RK_n}(n-1)}
 \ll {c^{-1/2}\over\sqrt R}{1\over n^2-1},\qquad
 {n\over\sqrt{RK_n}(n-1)}
 \ll {c^{-1/2}\over\sqrt R}{n\over n^2-1}.         \tag{7.3a}
\]

The local carrier variations, half-density changes, and nonlinear phase
remainders are exactly those in (5.1b) and (6.1b); their extra factor is
`O(LR/c)`.  Equations (3.4), (4.2)--(4.6), (4.3b), and (2.10) therefore
give

\[
\begin{aligned}
 I_n&=M_{n,R}+M_{n,L}+\mathcal E_n,\\
 |\mathcal E_n|
 &\leq C_DL^{\kappa_D}c^{-1/2}
 \left[
 \left\{e^{h\alpha}R^{-1/2}
       +L^{\kappa_D}e^{2h\alpha}{R^{3/2}\over c}\right\}
       {n\over n^2-1}
 +\left\{R^{-1/2}+L^{\kappa_D}{R^{3/2}\over c}\right\}
       {1\over n^2-1}
 \right]
\end{aligned}                                         \tag{7.4}
\]

The `e^(2h alpha)` term is the inward curved-to-flat patch error; it is
not hidden inside a one-envelope symbol.  By (7.3), the first brace in
(7.4) is absorbed by (5.6), and the second by (6.4).  This proves (0.7).

This argument also identifies exactly why the endpoint turning layers are
harmless.  They are not crossed by an interior WKB integration.  They are
contained in the regular Weber parametrices of Section 3.  Only the region
where (2.10) holds is integrated by parts.

## 8. Exact direct-source normalization

For one local `m=l=1` modal pair at a finite Fejer cutoff, the
direct-source profiles have the form

\[
\begin{aligned}
 a_\alpha^{(1)}(s)
 &= {\sqrt\lambda\over2}\omega_M(1)
    (1+\chi_\alpha)e_\alpha p_\alpha(U),\\
 b_\beta^{(1)}(t)
 &= {\sqrt\lambda\over2}\omega_M(1)\chi_\beta e_\beta
 \left(1+{V\over c}\right)q_\beta(V).
\end{aligned}                                         \tag{8.1}
\]

At `s+t=log n`,

\[
 U=c(1-e^{-s}),\qquad
 V=V_n(U),\qquad
 ds={dU\over c-U},\qquad
 1+{V\over c}=n{c-U\over c}.                         \tag{8.2}
\]

Therefore the exact raw convolution coefficient is

\[
\boxed{
 C_{\alpha\beta}^{(1,1)}(\log n)
 ={\lambda\omega_M(1)^2\over4}(1+\chi_\alpha)\chi_\beta
 e_\alpha e_\beta\,{n\over c}\,I_{n,*},}           \tag{8.3}
\]

where `I_(n,*)=I_n` for `n<A` and `I_(n,*)=I_(n,A)` for `n>A`.
Thus the upper prime coefficient gives

\[
\boxed{
 {2\Lambda(n)\over n}C_{\alpha\beta}^{(1,1)}(\log n)
 ={\lambda\omega_M(1)^2\Lambda(n)\over2c}
 (1+\chi_\alpha)\chi_\beta e_\alpha e_\beta I_{n,*}.} \tag{8.4}
\]

This is the promised cancellation of the outside `n`.  The bound is
uniform for `0<=omega_M(1)<=1`, and the ordered limit has
`omega_M(1)->1`.  Any subsequent modal whitening is a further congruence
and is not part of (0.4).

For the completed shells, Chebyshev partial summation gives

\[
 \sum_{2\leq n<A}{\Lambda(n)n\over n^2-1}\leq CL,
 \qquad
 \sum_{2\leq n<A}{\Lambda(n)\over n^2-1}\leq C.
\]

Therefore (0.7) implies the raw prime-shell sum

\[
 \sum_{2\leq n<A}\Lambda(n)|I_n(\alpha,\beta)|
 \leq C_{A_1,C,\epsilon}L^{\kappa}c^{-1/2}
 \{Le^{h(\alpha-\beta)}+1\}.                         \tag{8.5}
\]

After the exact factor in (8.4), the corresponding absolute physical
prime contribution, before the displayed modal endpoint and `chi`
factors, is

\[
 {\lambda\omega_M(1)^2\over2c}
 \sum_{2\leq n<A}\Lambda(n)|I_n|
 \leq C_{A_1,C,\epsilon}L^{\kappa+1}c^{-1}
 \{e^{h(\alpha-\beta)}+1\}.                          \tag{8.6}
\]

## 9. The physical `n>A` tail

For `n>A`, the lower outward coordinate at the hard inward endpoint is

\[
 V_{n,A}=c\left({n\over A}-1\right),\qquad
 a_+(V_{n,A})=b_{n,A}.                                \tag{9.1}
\]

There is no subunit endpoint completion.  The left endpoint still gives
the superunit term in (0.10).  At `U=U_L`, change to `V` and use the
nonresonant incomplete outward transform.  If
`a_L=a_-(U_L)=c(1-A^(-2))`, the exact hard-end freezing identity is

\[
 a_-\left(U_L-{V-V_{n,A}\over n}\right)
 =a_L-{a_+(V)-b_{n,A}\over n^2}.                    \tag{9.1a}
\]

On a patch where the last numerator changes by at most `R`, (9.1a) gives
relative half-density error `O(R/c)`, inward-carrier variation
`O(L^k e^(h alpha)LR/c^2)`, and nonlinear phase error
`O(LR^2/c^2)`, exactly as in (5.1b).  The remainder after that patch is
one of the middle carrier integrals controlled by (2.10) and (4.3).

The frozen inward phase has
frequency `N_L=Omega_-(U_L)/n`, which is at most `3/5` eventually and differs
from `1/n` by `O(L/(cn))`.  Formula (4.3a), applied at this exact shifted
frequency, gives directly and uniformly in the Abel regulator

\[
 \left|\int_{V_{n,A}}^\infty
 q_\beta(V)e^{-i\sigma N_LV}\,dV\right|
 \leq {C_DL^{\kappa_D}\over
 \sqrt{1+a_+(V_{n,A})}}.                             \tag{9.2}
\]

This includes the cases `a_+(V_(n,A))` below, inside, and above the scale
`beta`; no unproved incomplete finite-`c` Abel theorem is being invoked.
Since `a_-(U_L)=c(1-A^(-2))`, the hard-boundary prefactor is
`O(e^(h alpha)/(n sqrt(c)))`.

It remains to check that the two-envelope error from the left endpoint
does not spoil this bound.  Equations (3.4) and (6.1) bound that error by

\[
 C_DL^{\kappa_D}{e^{2h\alpha}R^{3/2}
  \over c^{3/2}n\sqrt{n^2-1}}.                       \tag{9.2a}
\]

Uniformly for integers `n>A`, the fractional part `A-floor(A)=1/4`
and a split at `2A` give

\[
 {\sqrt{1+b_{n,A}}\over\sqrt{n^2-1}}\leq {C\over\sqrt c}.           \tag{9.2b}
\]

Indeed, for `A<n<=2A` the numerator is `O(sqrt(c))` and the denominator
is `Theta(A)`, while for `n>=2A` their ratio is
`O(sqrt(c)/A)`.  Dividing (9.2a) by the hard-boundary term in (0.10)
therefore leaves

\[
 C_DL^{\kappa_D}{e^{h\alpha}R^{3/2}\over c^{3/2}}=o(1),             \tag{9.2c}
\]

by (0.6a).  The middle-carrier boundary at `a=R` is smaller by
`O((cR)^(-1/2))` after the same comparison.  Thus (6.4), (9.2), and
(9.2a)--(9.2c) prove (0.10).

To sum it, first use Chebyshev partial summation:

\[
 \sum_{n>A}{\Lambda(n)\over n^2-1}\leq {C\over A}.  \tag{9.3}
\]

Because `A` has fractional part `1/4`, every integer `n>A` satisfies
`n-A>=3/4`.  The elementary bound `Lambda(n)<=log n`, split at `2A`, gives

\[
\boxed{
 \sum_{n>A}{\Lambda(n)\over
 n\sqrt{1+c\{(n/A)^2-1\}}}
 \leq {CL\over\sqrt A}.}                             \tag{9.4}
\]

Indeed, for `A<n<=2A` the denominator after the factor `n` is at least
`C A sqrt(n-A)`, while for `n>=2A` it is at least
`C n^2/sqrt(A)`.  Equations (0.10), (9.3)--(9.4), and `c=2 pi A` prove
(0.11).

Finally, (8.4) shows that the absolute physical prime tail, before the
displayed modal endpoint and `chi` factors, is bounded by

\[
\boxed{
 {\lambda\omega_M(1)^2\over2c}
 \sum_{n>A}\Lambda(n)|I_{n,A}|
 \leq C_{A_1,C,\epsilon}L^{\kappa+1}e^{h\alpha}c^{-3/2}.} \tag{9.5}
\]

## 10. Exact conclusion

The curved shell has two genuine endpoint terms.  Their exact geometric
normalizations are

\[
 {1\over n\sqrt{a_-(U_n)}}
 ={1\over\sqrt{a_+(c(n-1))}}
 ={1\over\sqrt c\sqrt{n^2-1}}.                       \tag{10.1}
\]

The subunit transform supplies an additional
`n e^(-h beta)/sqrt(n^2-1)`; the superunit transform supplies an additional
`1/sqrt(n^2-1)`.  These are exactly the two terms in (0.7).  Every possible
Liouville turning point is inside an endpoint Weber layer, and the central
four-carrier phases have a uniform `(n-1)` gap.  Thus no interior turning
layer spoils the estimate.

The price of making this statement unconditional is the restricted
cluster margin (0.6a): the local curved-to-flat error uses the proved
two-envelope bound `e^(2h alpha)`, not an unproved one-envelope Green
ratio.  This restriction is substantive and is not to be removed by
changing a polynomial constant.

The theorem remains a scalar, local, `m=l=1` FIO shell result.  It does not
promote the shell bound to the full signed sampler matrix or to the
complete central form.
