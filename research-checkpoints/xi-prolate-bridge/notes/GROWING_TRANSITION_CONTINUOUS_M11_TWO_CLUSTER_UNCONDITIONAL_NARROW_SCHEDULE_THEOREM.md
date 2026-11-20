# Growing-transition continuous `m=l=1` narrow-schedule theorem

## 0. Result and scope

Use

\[
 \lambda={p\over2},\qquad A=\lambda^2,\qquad
 c=2\pi A,\qquad L=\log A,\qquad h={\pi\over4},       \tag{0.1}
\]

Fix constants in the open region

\[
 \boxed{A_1>0,\quad C>0,\quad0<\epsilon<2h,\qquad
 hC+\left(5h+{3\epsilon\over2}\right)A_1<1.}        \tag{0.2}
\]

The safe numerical choice

\[
 A_1={1\over20},\qquad C={1\over5},\qquad
 \epsilon={1\over10}                                \tag{0.2a}
\]

lies well inside this region.

Let `p_alpha,q_beta` and the physical continuous `m=l=1` kernels be those
of the frozen conditional reduction

`notes/GROWING_TRANSITION_CONTINUOUS_M11_TWO_CLUSTER_NEGATIVE_PACKET_THEOREM.md`

at SHA-256

`0ec602eb10822b3a44d5c1f59b2d252d61fa9d6ba6fcc0d620dbc75f3d2edeb4`.

For fixed distinct offsets `a_i,b_j`, put

\[
 \alpha_i=(A_1+C)L+a_i(L),\qquad
 \beta_j=A_1L+b_j(L),\qquad
 a_i(L)=a_i+O(L^{-1}),\quad b_j(L)=b_j+O(L^{-1}),
 \qquad 1\leq i,j\leq m.                             \tag{0.3}
\]

Then, uniformly on the forward high--low block,

\[
 \mathcal C_c(\alpha_i,\beta_j)
 ={2\{e^{h(\alpha_i-\beta_j)}-1\}
      \over\alpha_i-\beta_j}
 +o\!\left({e^{hCL}\over L^M}\right)               \tag{0.4}
\]

for every fixed `M`.  The continuous pole and Archimedean-regular blocks
are negligible at the same scale.  The Hermitian continuous matrix on the
two clusters has at least `m` eigenvalues at most

\[
 \boxed{-c_m{e^{hCL}\over L^{2m-1}}.}               \tag{0.5}
\]

This theorem is only about the continuous physical `m=l=1` block.  It
proves nothing about a discrete prime shell, any `m>=2` or `l>=2` sampler,
finite-Fejer assembly, source congruences, existence or leakage of actual
prolate rows, a complete central negative packet, a central-floor
counterexample, or RH.  The conditional modal prefactor remains
`Theta(L^-1)` only if the actual leakage factors are bounded below.

The point of this note is to discharge, throughout the open narrow region
(0.2), all three analytic gates isolated in the frozen fallback: the
local Green estimate is weakened from one action factor to two, while the
conormal and smooth signed-tail BV gates are proved directly.

## 1. Strict exponent margins

On a high--low pair take

\[
 R=\exp\{(\pi/2+\epsilon)\beta\},
 \qquad R_H=c^\theta,                                 \tag{1.1}
\]

where

\[
 hA_1<\theta<
 \min\left\{{1\over2},\,1-hC-2hA_1,\,1-2hA_1\right\}.     \tag{1.2}
\]

This interval is nonempty: (0.2) implies
`hC+3hA_1<1` and `hA_1<1/2`.  Up to bounded offsets and powers of
`L`, the high--low margins are

\[
\begin{aligned}
 \theta_R&=(2h+\epsilon)A_1<{1\over2},\\
 \delta_{\rm loc}
 &=1-hC-\left(5h+{3\epsilon\over2}\right)A_1>0,\\
 \delta_{R^{-1}}&=(h+\epsilon)A_1>0,\\
 \delta_{\sqrt{R/c}}
 &={1\over2}-\left(2h+{\epsilon\over2}\right)A_1>0,\\
 \delta_{\rm Volterra}
 &=1-h(A_1+C)-(2h+\epsilon)A_1>0.
\end{aligned}                                        \tag{1.3}
\]

Thus every polynomial in `L` is absorbed by a fixed positive power of
`c` in the estimates below.

For the safe choice (0.2a), one may take `theta=1/3`; numerically
`theta_R=0.08354...`, `delta_loc=0.63907...`, and all the displayed
margins are positive.

## 2. Crude two-action-factor Green lemma

For `varepsilon in {+1,-1}`, put

\[
 a_\varepsilon(x)=2x+\varepsilon{x^2\over c},
 \qquad
 (a_\varepsilon y')'+(a_\varepsilon+\gamma)y=0,
 \quad y(0)=1,\quad y'(0)=-\gamma/2.                \tag{2.1}
\]

Let

\[
 w_\gamma(x)=e^{ix}
 {}_1F_1\!\left({1\over2}-{i\gamma\over4};1;-2ix\right),
 \qquad E_\gamma=e^{h(-\gamma)_+}.                  \tag{2.2}
\]

### Lemma 2.1

Fix `D,delta>0`.  If

\[
 |\gamma|\leq DL,\qquad
 8(1+|\gamma|)\leq R\leq c^{1/2-\delta},\qquad
 E_\gamma L^K{LR+\log(2+R)\over c}\leq{1\over2},   \tag{2.3}
\]

then, for a fixed `K=K(D,delta)`, with
`d=y_(varepsilon,c,gamma)-w_gamma`,

\[
\begin{aligned}
 |d(x)|&\leq L^KE_\gamma^2{x\over c\sqrt{1+x}},\\
 \int_0^R(|d|+|d'|)\,dx
 &\leq L^KE_\gamma^2{R^{3/2}\over c},\\
 |d(R)|&\leq L^KE_\gamma^2{\sqrt R\over c}.
\end{aligned}                                        \tag{2.4}
\]

All implied constants are independent of `c,R,gamma` in (2.3).

### 2.1 Exact normal form

With `Y=sqrt(a_varepsilon)y`,

\[
 Y''+\left(1+{\gamma\over a_\varepsilon}
                 +{1\over a_\varepsilon^2}\right)Y=0.          \tag{2.5}
\]

The perturbation from

\[
 Q_\gamma(x)=1+{\gamma\over2x}+{1\over4x^2}          \tag{2.6}
\]

is exactly

\[
 \mathcal E_{\varepsilon,\gamma}(x)
 =-{\varepsilon\gamma\over4c(1+\varepsilon x/(2c))}
  -{\varepsilon\over4cx}
   {1+\varepsilon x/(4c)
    \over(1+\varepsilon x/(2c))^2}.                  \tag{2.7}
\]

The exact flat pair

\[
\begin{aligned}
 F_\gamma(x)&=\sqrt{2x}\,e^{ix}M(a_K,1,-2ix),\\
 G_\gamma(x)&=-{\Gamma(a_K)\over2}
       \sqrt{2x}\,e^{ix}U(a_K,1,-2ix),
 \qquad a_K={1\over2}-{i\gamma\over4},
\end{aligned}                                        \tag{2.8}
\]

has `W_x(F_gamma,G_gamma)=1` on the lateral branch
`arg(-2ix)=-pi/2`.

### 2.2 Scalar transfer bound

Use

\[
 \|(Y,Y')\|_x={|Y|\over m(x)}+m(x)|Y'|,\qquad
 m(x)=\min(\sqrt x,1),\qquad
 \ell_0(x)=1+\log_+(1/x).                            \tag{2.9}
\]

The following explicit bounds hold:

\[
 \|F_\gamma\|_x\leq L^KE_\gamma,\qquad
 \|G_\gamma\|_x\leq L^K\ell_0(x).                 \tag{2.10}
\]

Here is a proof retaining the sharp barrier action.  If `gamma>=0`, then
`Q_gamma>0` and `Q_gamma'<0`.  At
`x_0=epsilon_0/(1+gamma)`, the Frobenius series for `M` and `Gamma(a_K)U`
converge with `|a_K x_0|=O(epsilon_0)` and give respectively `O(L^K)` and
`O(L^K ell_0(x_0))` states.  The exact energy

\[
 |Y'|^2+Q_\gamma|Y|^2                               \tag{2.11}
\]

is nonincreasing outward.  This proves (2.10).  The bounded range
`-2<=gamma<0` is identical after a fixed compact transfer.

Now write `gamma=-alpha`, `alpha>=2`.  The turning points and barrier
action are

\[
 x_\pm={\alpha\pm\sqrt{\alpha^2-4}\over4},\qquad
 S_\alpha=\int_{x_-}^{x_+}\sqrt{-Q_{-\alpha}(x)}\,dx
 =h\alpha-\frac\pi2.                                 \tag{2.12}
\]

The bounded range `2<=alpha<=16` is covered by one compact transfer, so
assume `alpha>=16` in the zone decomposition that follows.

The origin zone `0<x<=epsilon_0/alpha` is controlled by the same
Frobenius series.  In the complete left-turn zone set `x=xi/alpha`; the
equation becomes

\[
 Y_{\xi\xi}+\left({1-2\xi\over4\xi^2}+\alpha^{-2}\right)Y=0, \tag{2.13}
\]

so its transfer is polynomial in `alpha`.  On

\[
 [2/\alpha,x_+-\alpha^{1/3}],
 \qquad \kappa=\sqrt{-Q_{-\alpha}},                  \tag{2.14}
\]

diagonalizing the state
`(sqrt(kappa)Y,Y'/sqrt(kappa))` gives

\[
 \|T(x,t)\|
 \leq\exp\!\left\{\int_t^x\kappa(s)\,ds
             +{1\over2}\operatorname {Var}_{[t,x]}\log\kappa
        \right\}
 \leq L^Ke^{S_\alpha}.                              \tag{2.15}
\]

Indeed the endpoint sizes of `kappa` are `asymp alpha` and
`asymp alpha^(-1/3)`.  On
`|x-x_+|<=alpha^(1/3)`, the length is `O(alpha^(1/3))` and
`sup|Q|=O(alpha^(-2/3))`.  The integral equation relative to
`Y''=0`, rather than naive first-order Gronwall, gives transfer
`O(1+alpha^(1/3))`.  On the outer allowed zone, the normalized energy
cost is

\[
 \exp\{\tfrac12\operatorname {Var}\log\sqrt{Q}\}=L^K.          \tag{2.16}
\]

These zones prove the first estimate in (2.10).

For the second estimate choose `X=64(1+alpha)^3`.  The Tricomi equation,
after writing `U(a,1,z)=z^(-a)(1+rho(z))`, gives by one Volterra iteration
on the lateral ray

\[
 |\rho(z)|+|z\rho'(z)|
 \leq C{|a|^2\over|z|},\qquad
 |z|\geq32(1+|a|)^3,\quad -\pi/2\leq\arg z<0.      \tag{2.17}
\]

To see the constant uniformly, substitute `z^(-a)(1+rho)` in
`zU''+(1-z)U'-aU=0`, impose `rho(infinity)=0`, and integrate the resulting
first-order equation for `rho'`; the Volterra kernel has norm at most
`2|a|^2/|z|`.  The same estimate holds after one derivative.  Taking the
lateral limit is therefore uniform.  Since

\[
 |\Gamma(1/2+i\alpha/4)|^2
 ={\pi\over\cosh(\pi\alpha/4)},\qquad
 |(-2iX)^{-1/2-i\alpha/4}|
 =(2X)^{-1/2}e^{-\pi\alpha/8},                       \tag{2.18}
\]

the state of `G_(-alpha)` at `X` is `L^K e^(-h alpha)`.  Propagating it
backward through (2.16), the right turn, and (2.15) costs at most
`L^K e^(S_alpha)`, which cancels the exponential in (2.18).  The left and
origin zones then give only `ell_0(x)`.  This proves the second estimate
in (2.10), not merely a connection-formula assertion.

Consequently the regular Green operator satisfies

\[
 \|\mathcal G_\gamma(x,t)(0,f)\|_x
 \leq L^KE_\gamma\ell_0(t)m(t)|f|,\qquad 0<t\leq x. \tag{2.19}
\]

### 2.3 Duhamel estimate

From (2.7), uniformly for `x<=R`,

\[
 \int_0^x\ell_0(t)m(t)^2
       |\mathcal E_{\varepsilon,\gamma}(t)|\,dt
 \leq L^K{Lx+\log(2+x)\over c}.                     \tag{2.20}
\]

Equations (2.19)--(2.20) and the last condition in (2.3) give, by
Volterra absorption,

\[
 \|Y\|_x\leq L^KE_\gamma,\qquad
 \|Y-F_\gamma\|_x
 \leq L^KE_\gamma^2{Lx+\log(2+x)\over c}.           \tag{2.21}
\]

At the origin, inserting the critical kernel
`sqrt(xt) log(x/t)` in Duhamel sharpens (2.21) to
`d=O(L^K E_gamma^2 x/c)` and
`d'=O(L^K E_gamma^2/c)`.  For `x>=1`, division by
`sqrt(a_varepsilon(x))`, followed by integration, gives (2.4).  This
proves Lemma 2.1.

On (0.2)--(1.1), the Volterra smallness exponent is

\[
 h(A_1+C)+(\pi/2+\epsilon)A_1-1<0,                  \tag{2.22}
\]

so Lemma 2.1 applies to every cluster entry.

## 3. Direct signed BV theorem for the conormal

Put

\[
 x=c-U,\qquad y=c+V,\qquad
 A(x)={c^2-x^2\over c},\qquad
 B(y)={y^2-c^2\over c},\qquad r=\log(y/x).           \tag{3.1}
\]

Thus `A=a_-(U)`, `B=a_+(V)`, and the conormal kernel is

\[
 K_c(U,V)={1\over xr}.                               \tag{3.2}
\]

On `V>=R`, the outward normal solution has

\[
 \sqrt B\,q_\beta=B_+e^{i\phi}+B_-e^{-i\phi},\qquad
 \phi'=\Omega_+,\qquad
 \sup|B_\pm|+\operatorname {Var}B_\pm\leq L^K,      \tag{3.3}
\]

where Lemma 2.1 supplies the initial state and ordinary allowed-energy
variation propagates it.  Since

\[
 \sqrt B\,\Omega_+
 =b(y):=\sqrt{B(y)+\beta+B(y)^{-1}},                 \tag{3.4}
\]

one outward Stieltjes integration by parts uses the amplitude

\[
 F(x,y)={K_c(U,V)\over\sqrt{A(x)}b(y)}
 ={f(x)g(y)\over r},\qquad
 f(x)={\sqrt c\over x\sqrt{c^2-x^2}},\qquad
 g(y)={1\over b(y)}.                                 \tag{3.5}
\]

For `y>=y_0=c+R`, `g` is decreasing and `g(y_0)<=C R^(-1/2)`.
Direct differentiation gives

\[
 F_{xy}=f'\left({g'\over r}-{g\over yr^2}\right)
       +f\left({g'\over xr^2}-{2g\over xyr^3}\right).          \tag{3.6}
\]

Writing `r_0(x)=log(y_0/x)` and integrating the four terms in `y`, using
`g'<=0`, yields the exact majorant

\[
 \int_{y_0}^\infty|F_{xy}(x,y)|\,dy
 \leq Cg(y_0)\left({|f'(x)|\over r_0(x)}
                   +{f(x)\over x r_0(x)^2}\right).  \tag{3.7}
\]

Indeed

\[
 \int {|g'|\over r}\leq {g(y_0)\over r_0},\quad
 \int {g\over yr^2}\leq {g(y_0)\over r_0},\quad
 \int {|g'|\over r^2}\leq {g(y_0)\over r_0^2},\quad
 \int {2g\over yr^3}\leq {g(y_0)\over r_0^2}.       \tag{3.8}
\]

Split the `x` integral at `c/2`.  On `x>=c/2`, put `u=c-x`; then

\[
 f\ll(c\sqrt u)^{-1},\quad
 |f'|\ll(cu^{3/2})^{-1},\quad
 r_0\asymp(R+u)/c.                                   \tag{3.9}
\]

On `2pi<=x<=c/2`,

\[
 f\ll(\sqrt c\,x)^{-1},\quad
 |f'|\ll(\sqrt c\,x^2)^{-1},\quad
 r_0\gg\log(c/x).                                   \tag{3.10}
\]

Elementary integration of (3.9)--(3.10) gives

\[
\begin{aligned}
 \int_{2\pi}^{c-R}{|f'|\over r_0}\,dx
 &\leq C\left(R^{-3/2}+{1\over\sqrt c\,L}\right),\\
 \int_{2\pi}^{c-R}{f\over x r_0^2}\,dx
 &\leq C\left(R^{-3/2}+{1\over\sqrt c\,L^2}\right).
\end{aligned}                                        \tag{3.11}
\]

The one-dimensional edge variations have the same bound.  One clean way
to see this is to put `t=x/c`, `z=y/c`.  For `k=1,2`,

\[
 {d\over dt}\log{1\over t\sqrt{1-t^2}\log(z/t)^k}
 ={q_k(t)\over t(1-t^2)\log(z/t)},
\]

where

\[
 q_k(t)=k(1-t^2)-\log(z/t)(1-2t^2).                  \tag{3.12}
\]

Every zero has `t<1/sqrt(2)` and, at such a zero,

\[
 q_k'(t)={1-2t^2\over t}+{2kt\over1-2t^2}>0.        \tag{3.13}
\]

Thus each edge has one minimum and its variation is bounded by its two
endpoint values.  Equations (3.7)--(3.13) prove the Hardy--Krause bound

\[
 \boxed{
 \|F\|_{HK([R,U_L]\times[R,\infty))}
 \leq C\left(R^{-2}+{1\over L\sqrt{cR}}\right).}    \tag{3.14}
\]

The Stieltjes form of (3.3) now gives, uniformly in the lateral Abel
regulator,

\[
 \left\|{1\over\sqrt{a_-}}
  \operatorname {Abel}\int_R^\infty q_\beta(V)K_c(\,\cdot\,,V)\,dV
 \right\|_{BV([R,U_L])}
 \leq L^K\left(R^{-2}+{1\over L\sqrt{cR}}\right).   \tag{3.15}
\]

For `0<=V<=R`, no signed tail is needed.  The same one-minimum calculation
and `|q_beta(V)|<=L^K(1+V)^(-1/2)` give

\[
\begin{aligned}
 &\int_0^R {|q_\beta(V)|\over
       \sqrt{a_-(R)}(R+V)}\,dV\leq {L^K\over R},\\
 &\int_0^R {|q_\beta(V)|\over
       \sqrt{a_-(U_L)}\,2\pi\log((c+V)/(2\pi))}\,dV
 \leq {L^K\sqrt R\over L\sqrt c}.
\end{aligned}                                        \tag{3.16}
\]

Combining (3.15)--(3.16), with endpoint values included in the BV norm,
proves

\[
 \boxed{
 \left\|{H_{\beta,c}\over\sqrt{a_-}}\right\|_{BV([R,U_L])}
 \leq L^K\left({1\over R}+{1\over L}\sqrt{R\over c}\right),
 \quad
 H_{\beta,c}(U)=\operatorname {Abel}\int_0^\infty q_\beta K_c.} \tag{3.17}
\]

For the other physical tail, one outward integration by parts gives

\[
 \left|\operatorname {Abel}\int_R^\infty
 q_\beta(V)K_c(U,V)\,dV\right|
 \leq {L^K\over\sqrt R(U+R)},\qquad 0\leq U\leq R. \tag{3.18}
\]

The action bound `|p_alpha(U)|<=L^K e^(h alpha)/sqrt(1+U)` then gives

\[
 \boxed{
 \left|\int_0^Rp_\alpha(U)\operatorname {Abel}\int_R^\infty
 q_\beta(V)K_c(U,V)\,dVdU\right|
 \leq {L^Ke^{h\alpha}\over R}.}                     \tag{3.19}
\]

Multiplication by `e^(-tau V)` only replaces `g` by another decreasing
amplitude, so (3.7)--(3.19) are uniform before the Abel limit.  The
finite `U` regulator tends uniformly to one after that limit.  This proves
both signed-tail estimates, including the transposed parameter choice.

## 4. Pole and Archimedean-regular tails

The pole kernel separates exactly:

\[
 K_P(U,V)=-{2\over x}-{2\over y}.                    \tag{4.1}
\]

The flat full `N=0` transform, Lemma 2.1 on the local interval, and the
flat/curved carrier tails give the first estimate below.  Absolute
integration only up to `R`, followed by one outward carrier integration
by parts, gives the second:

\[
 \operatorname {Abel}\int_0^\infty q_\beta(V)\,dV=L^KO(1),
 \qquad
 \operatorname {Abel}\int_0^\infty {q_\beta(V)\over c+V}\,dV
 ={L^K\sqrt R\over c}O(1).                           \tag{4.2}
\]

The `U` factors `1/(x sqrt(A))` and `1/sqrt(A)` have endpoint-controlled
variation.  Therefore

\[
 \left\|{1\over\sqrt{a_-}}
       \operatorname {Abel}\int_0^\infty q_\beta K_P\,dV
 \right\|_{BV([R,U_L])}\leq {L^K\over\sqrt c},
 \qquad |\mathcal P_c^{D_2}|\leq {L^Ke^{h\alpha}\over c}.       \tag{4.3}
\]

For the Archimedean-regular kernel put

\[
 \varphi(r)={1\over\sinh r}-{1\over r},\qquad
 K_A(U,V)={\varphi(r)\over x}.                       \tag{4.4}
\]

On `0<r<=1`,

\[
 |\varphi(r)|\leq Cr,\qquad
 |\varphi'(r)|\leq C,\qquad
 |\varphi''(r)|\leq Cr.                             \tag{4.5}
\]

Writing `u=c-x`, `v=y-c`, the carrier-IBP amplitude and its first mixed
derivative are dominated, on this region, by derivatives of

\[
 {1\over c^2}\left(\sqrt{u\over v}+\sqrt{v\over u}\right).     \tag{4.6}
\]

For example its mixed derivative is bounded by

\[
 {C\over c^2}\left(u^{-3/2}v^{-1/2}
                  +u^{-1/2}v^{-3/2}\right).         \tag{4.6a}
\]

On `r<=1`, one has `u+v<=C c`; splitting at `u=v` and integrating
(4.6a), together with its edge values, gives
`O(c^(-3/2)R^(-1/2))=O(c^-1)`.  Use a fixed smooth partition in `r`
around `r=1`; its interface derivatives are also `O(c^-1)`.  On `r>=1`,
for `j<=2`,

\[
 |\varphi^{(j)}(r)|\leq C_jr^{-1-j}.                 \tag{4.7}
\]

Termwise differentiation is therefore dominated by the conormal
calculation (3.6)--(3.14); the interface `r=1` contributes `O(c^-1)`.
The hard endpoint is `O(1/(L sqrt(cR)))`.  Hence

\[
 \|F_A\|_{HK([R,U_L]\times[R,\infty))}
 \leq L^K\left({1\over c}+{1\over L\sqrt{cR}}\right).          \tag{4.8}
\]

For `V<=R`, (4.5) near `U=R` and (4.7) at `U=U_L` give

\[
 L^K\left({1\over c}+{1\over L}\sqrt{R\over c}\right),       \tag{4.9}
\]

while the `D_2` outward amplitude is at most `L^K/(c sqrt R)` and hence

\[
 |\mathcal A_{\rm reg,c}^{D_2}|\leq {L^Ke^{h\alpha}\over c}. \tag{4.10}
\]

Equations (4.3), (4.8)--(4.10) prove the two smooth signed-tail bounds
without a hypothesis.

## 5. Curved-to-flat comparison in the narrow region

On the near rectangle, Lemma 2.1 and the exact kernel expansion give the
safe bound

\[
 |\mathcal C_c^{[0,R]^2}-\mathcal C_0^{[0,R]^2}|
 \leq L^KE_{-\alpha}^2{R^{3/2}\over c}
 =L^Ke^{2h\alpha}{R^{3/2}\over c}.                  \tag{5.1}
\]

The flat signed tails are `L^K e^(h alpha)R^(-3/2)`.  Equations
(3.17)--(3.19) therefore yield

\[
 \boxed{
 |\mathcal C_c(\alpha,\beta)-\mathcal C_0(\alpha,\beta)|
 \leq L^K\left[
 e^{2h\alpha}{R^{3/2}\over c}
 +e^{h\alpha}\left({1\over R}+\sqrt{R\over c}\right)
 \right].}                                          \tag{5.2}
\]

After division by the forward main
`e^(h(alpha-beta))/(alpha-beta)`, the first term in (5.2) has conductor
exponent

\[
 -1+{\pi C\over4}
 +\left({5\pi\over4}+{3\epsilon\over2}\right)A_1
 =-\delta_{\rm loc}<0,                               \tag{5.3}
\]

and the remaining two terms have the positive margins in (1.3).  This
proves (0.4) to every inverse power of `L`.

For a same-cluster block use `R=R_H`.  Here the pointwise first line of
(2.4), rather than the safe `W^(1,1)` bound used in (5.1), sharpens the
near-rectangle error to

\[
 L^Ke^{2h\alpha}{R_H\over c}.                        \tag{5.4}
\]

Relative to the cross singular scale, its exponent is
`2hA_1+hC+theta-1<0`.  The `R_H^(-1)` tail has exponent
`hA_1-theta<0`, and the square-root tail has exponent
`hA_1+(theta-1)/2<0`.  These are exactly the three inequalities in
(1.2).  For the reverse low--high orientation choose explicitly

\[
 R_{\rm rev}=\exp\{(2h+\epsilon)A_1L\}.              \tag{5.5}
\]

Its local error, after division by the forward cross scale, has exponent

\[
 -1-hC+\left(5h+{3\epsilon\over2}\right)A_1<0,      \tag{5.6}
\]

and its two signed-tail exponents are smaller.  Thus the reverse entry is
`O(1)+o(e^(hCL)/L^M)` for every fixed `M`.  Equations
(4.3)--(4.10) are smaller still.

## 6. Cauchy block and negative spectrum

Put
`X=CL` and `Delta_(ij)(L)=X+a_i(L)-b_j(L)`.  The Hermitian flat cross
block is

\[
 C^{H,0}_{ij}
 ={1\over2}\{\mathcal C_0(\alpha_i,\beta_j)
              +\mathcal C_0(\beta_j,\alpha_i)\}
 ={2\sinh(h\Delta_{ij}(L))\over\Delta_{ij}(L)}
 =e^{hX}D_aM_XD_b+O(e^{-hX}/X),                     \tag{6.1}
\]

where

\[
 D_a=\operatorname {diag}(e^{ha_i(L)}),\qquad
 D_b=\operatorname {diag}(e^{-hb_j(L)}),\qquad
 (M_X)_{ij}={1\over X+a_i(L)-b_j(L)}.
\]

The limiting node sets are distinct, so their Vandermonde separations
stay uniformly positive.  Applying the exact Cauchy inverse to these
actual `L`-dependent nodes, without an entrywise perturbation argument,
gives

\[
 s_{\min}(C^{H,0})\geq c_m{e^{hX}\over X^{2m-1}}.   \tag{6.2}
\]

The forward orientation is controlled by (5.2)--(5.3), and the reverse
orientation by (5.5)--(5.6); hence their Hermitian average in (6.1) is
controlled with the displayed factor.  Equations (5.2)--(5.6) and the
smooth bounds perturb (6.2) by `o(1)` in relative norm.  The two
same-cluster blocks are also `o(s_min)`.  The
zero-diagonal comparison has eigenvalues `+-s_j`, so Weyl's inequality
proves (0.5).  Any fixed `r<m` rows that vanish on their common kernel
leave at least `m-r` negative directions by dimension count.

The radial-mass theorem controls the **physical endpoint row**
`chi_gamma z_gamma`, not the bare endpoint quotient `z_gamma`.  Its exact
consequence is

\[
 (\chi_\gamma z_\gamma)^2
 ={\pi c\over2\lambda J_\gamma}\{1+o(1)\}.          \tag{6.3}
\]

Thus the bare defect-white scalar and the full forward physical factor are,
respectively,

\[
 {\lambda\over4c}z_\alpha z_\beta
 ={\pi\over8\chi_\alpha\chi_\beta
       \sqrt{J_\alpha J_\beta}}\{1+o(1)\},          \tag{6.4}
\]

\[
 {\lambda\over4c}(1+\chi_\alpha)\chi_\beta
 z_\alpha z_\beta
 ={\pi(1+\chi_\alpha)\over
  8\chi_\alpha\sqrt{J_\alpha J_\beta}}\{1+o(1)\}. \tag{6.5}
\]

These factors are `Theta(L^-1)` only under an independent uniform lower
bound for the relevant leakage eigenvalues.  If actual modal placement
later proves `chi_alpha,chi_beta -> 1`, (6.5) becomes
`pi/(4 sqrt(J_alpha J_beta)){1+o(1)}`.  No such placement or leakage input
is proved here, exactly as stated in Section 0.

## 7. Conclusion

The region (0.2) absorbs the extra action factor in the only
local estimate where it occurs.  The conormal tail is controlled by one
outward carrier integration by parts and an explicit Hardy--Krause norm,
not by endpoint values alone.  The pole separates, and the
Archimedean-regular symbol is handled by its small-`r` cancellation and
large-`r` conormal domination.  This closes the continuous physical
`m=l=1` two-cluster negative block, but none of the discrete or modal
scope walls in Section 0.
