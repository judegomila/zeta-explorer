# Growing-transition continuous `m=l=1` two-cluster conditional reduction

## 0. Exact conditional result and fail-closed boundary

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 A=\lambda^2,\qquad c=2\pi A,\qquad L=\log A,
 \qquad h={\pi\over4}.                                  \tag{0.1}
\]

Put

\[
 a_-(U)=2U-{U^2\over c},\qquad
 a_+(V)=2V+{V^2\over c},\qquad
 U_L=c(1-A^{-1}),                                      \tag{0.2}
\]

and let the endpoint-normalized real profiles solve

\[
\begin{aligned}
 (a_-p_\alpha')'+(a_--\alpha)p_\alpha&=0,
 &p_\alpha(0)&=1,&p_\alpha'(0)&={\alpha\over2},\\
 (a_+q_\beta')'+(a_++\beta)q_\beta&=0,
 &q_\beta(0)&=1,&q_\beta'(0)&=-{\beta\over2}.
\end{aligned}                                          \tag{0.3}
\]

All conditionally convergent integrals below use the common lateral Abel
limit obtained by inserting `exp{-tau(U+V)}` and then taking
`tau downarrow 0`.  Define the physical logarithmic conormal

\[
 \boxed{
 \mathcal C_c(\alpha,\beta)
 =\operatorname {Abel}\!\int_0^{U_L}\!\int_0^\infty
 {p_\alpha(U)q_\beta(V)\over
  (c-U)\log\{(c+V)/(c-U)\}}\,dV\,dU.}                 \tag{0.4}
\]

Fix constants `C>0` and

\[
 0<A_1<{1\over\pi}.                                    \tag{0.5}
\]

For fixed, pairwise distinct real offsets
`a_1,...,a_m` and `b_1,...,b_m`, take the continuous energy clusters

\[
 \alpha_i=(A_1+C)L+a_i+O(L^{-1}),\qquad
 \beta_j=A_1L+b_j+O(L^{-1}).                           \tag{0.6}
\]

Assume the two explicit analytic gates stated in Sections 3 and 5:

- the critical-Kummer Green-ratio gate **G** in (3.13), including its
  unavoidable origin logarithm; and
- the signed physical-kernel BV gate **T** in (5.10a), together with its
  two smooth-symbol analogues in (6.3a).

Then the main conclusions are:

1. uniformly on the high--low block,

   \[
   \boxed{
   \mathcal C_c(\alpha_i,\beta_j)
   ={2\{e^{h(\alpha_i-\beta_j)}-1\}
        \over\alpha_i-\beta_j}
   +o\!\left({e^{hCL}\over L^M}\right)}              \tag{0.7}
   \]

   for every fixed `M`;

2. the physical pole and Archimedean-regular `m=l=1` kernels are
   `o(e^(hCL)/L^M)` on that block for every fixed `M`;

3. on each same-cluster block, the physical conormal differs from its flat
   fixed-offset block by

   \[
   O_{m,C,A_1}\{L^K e^{h(A_1+C)L}c^{-1/3}\}           \tag{0.8}
   \]

   for the high cluster, and the analogous bound with `C=0` for the low
   cluster; and

4. the Hermitian part of the continuous `m=l=1` matrix on the two clusters
   has at
   least `m` eigenvalues bounded above by

   \[
   \boxed{
    -c_m{e^{hCL}\over(CL)^{2m-1}}}                    \tag{0.9}
   \]

   before the common physical modal prefactor.  After exact exterior-
   defect whitening, the prefactor is `Theta(1/L)` provided the actual
   leakage factors on the selected modal rows are bounded below.

The finite-dimensional Cauchy and inertia implication from
(0.7)--(0.8) to (0.9) is unconditional.  The curved profile estimates
(0.7)--(0.8), however, are conditional on **G** and **T**.  Neither gate
is supplied by the frozen repository inputs.  Consequently this note is
a sharp reduction, not the missing curved two-profile theorem.

The scope wall is strict.  This reduction proves no unconditional curved
continuous block, no estimate for a discrete
prime shell, no `m>=2` or `l>=2` sampler, no reflected or mixed sampler
axis, no finite-Fejer complete assembly, no source congruence, no complete
central negative packet, no counterexample to a central floor, and no RH
conclusion.  Promotion from the continuous energies (0.6) to actual
prolate labels is recorded separately in Section 8.  In particular, a
uniform lower bound for the actual leakage factors is **not** proved here.
The project state remains `P0_INVALIDATED`.

## 1. Frozen repository inputs

The following repository inputs are byte-frozen for this package.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_EDGE_CARLEMAN_SCATTERING_OBSTRUCTION.md` | `1edd9639d69980f2a8662b0d0fab0b8fdfb49f853b4599c9a945092358c6018d` |
| `notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md` | `2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97` |
| `notes/GROWING_TRANSITION_SUBCRITICAL_LG_ACTION_BV_THEOREM.md` | `1cae15a8c72f0505384daea94760fcb05c466f897224ab83c54e7c41f045e99c` |
| `notes/GROWING_TRANSITION_WEBER_EDGE_RECIPROCAL_CHANNEL_THEOREM.md` | `16db62873056fb419bc740154c67a8f27ce6ecea2b85201abab7b89aa20d56d0` |
| `notes/GROWING_TRANSITION_COMPLETE_FLAT_WEBER_ZERO_RESIDUE_OBSTRUCTION_THEOREM.md` | `9476d9bb9cb56bb8d0eddfd8a5056637c48fd8974bc77c33b5cdeccb5c57fed0` |

Only the displayed equations from those files are inherited.  The exact
Liouville perturbation, Wronskian, parameter margins, flat formulas,
Cauchy singular-value bound, and conditional implications are proved
below.  The Green-ratio and signed physical-tail BV estimates are isolated
as gates rather than silently inferred from endpoint bounds.  No external
asymptotic theorem or numerical prolate table is used.

## 2. Parameter margins

Choose `epsilon>0` so that

\[
 \eta_0:=1-(\pi+2\epsilon)A_1>0,\qquad
 \eta_1:=1-(\pi+3\epsilon/2)A_1>0,                    \tag{2.1}
\]

and put, on a high--low pair,

\[
 R=\exp\{(\pi/2+\epsilon)\beta\}.                    \tag{2.2}
\]

For every fixed `K`, all sufficiently large `L` satisfy

\[
\begin{aligned}
 64(1+\alpha+\beta)&\leq R
       \leq c^{1/2-\eta_0/4},\\
 R^{-1/2}&=e^{-h\beta}e^{-\epsilon\beta/2},\\
 L^K{R^{3/2}\over c}
   &\leq e^{-h\beta}c^{-\eta_1/2}.                  \tag{2.3}
\end{aligned}
\]

The harmless fractions in the exponents absorb `log(2*pi)`, the bounded
offsets, and `L^K`.  The stronger first inequality in (2.1) implies the
second, but both margins are displayed because they control different
steps.

For a same-cluster comparison, where exponentially accurate extraction is
not required, use instead

\[
 R_H=c^{1/3}.                                         \tag{2.4}
\]

Both choices lie strictly below `c^(1/2)`.

## 3. Exact local reduction and Green gate **G**

For `varepsilon in {+1,-1}`, set

\[
 a_\varepsilon(x)=2x+\varepsilon{x^2\over c}.         \tag{3.1}
\]

Let `y_(varepsilon,c,gamma)` be the regular solution

\[
 (a_\varepsilon y')'+(a_\varepsilon+\gamma)y=0,
 \qquad y(0)=1,\qquad y'(0)=-\gamma/2.                \tag{3.2}
\]

The flat regular solution is

\[
 w_\gamma(x)=e^{ix}
 {}_1F_1\!\left({1\over2}-{i\gamma\over4};1;-2ix\right). \tag{3.3}
\]

Put

\[
 E_\gamma=\exp\{h(-\gamma)_+\}.                       \tag{3.4}
\]

### Conditional consequence 3.1

Fix `D,delta>0`.  If

\[
 |\gamma|\leq D L,\qquad
 8(1+|\gamma|)\leq R\leq c^{1/2-\delta},              \tag{3.5}
\]

assume gate **G** below.  Then there are constants `C_D,kappa_D`,
independent of `c,R,gamma`, such that, with
`d=y_(varepsilon,c,gamma)-w_gamma`,

\[
\begin{aligned}
 |d(x)|&\leq C_DL^{\kappa_D}E_\gamma
       {x\over c\sqrt{1+x}},\qquad 0\leq x\leq R,\\
 \int_0^R\{|d|+|d'|\}\,dx
   &\leq C_DL^{\kappa_D}E_\gamma{R^{3/2}\over c},\\
 |d(R)|&\leq C_DL^{\kappa_D}E_\gamma{\sqrt R\over c},\\
 \left|\int_0^Rd(x)e^{iNx}\,dx\right|
   &\leq C_DL^{\kappa_D}E_\gamma
      {R^{3/2}\over c|N|},\qquad |N|\geq1.           \tag{3.6}
\end{aligned}
\]

For `|N|<=1`, the second line gives the required `L1` estimate.

### Exact identities and the missing gate

Put `Y=sqrt(a_varepsilon)y`.  Direct differentiation gives

\[
 Y''+\left(1+{\gamma\over a_\varepsilon}
                 +{1\over a_\varepsilon^2}\right)Y=0. \tag{3.7}
\]

The exact perturbation from the flat normal potential is

\[
\boxed{
 \mathcal E_{\varepsilon,\gamma}(x)
 =-{\varepsilon\gamma\over
       4c(1+\varepsilon x/(2c))}
  -{\varepsilon\over4cx}
   {1+\varepsilon x/(4c)
    \over(1+\varepsilon x/(2c))^2}.}                  \tag{3.8}
\]

For

\[
 a_K={1\over2}-{i\gamma\over4},
\]

an exact flat fundamental pair is

\[
\begin{aligned}
 F_\gamma(x)&=\sqrt{2x}\,e^{ix}M(a_K,1,-2ix),\\
 G_\gamma(x)&=-{\Gamma(a_K)\over2}
       \sqrt{2x}\,e^{ix}U(a_K,1,-2ix).
\end{aligned}                                         \tag{3.9}
\]

The Tricomi branch is inherited from `arg(-2ix)=-pi/2`.  Since

\[
 W_z\{M(a_K,1,z),U(a_K,1,z)\}
 =-{e^z\over\Gamma(a_K)z},                            \tag{3.10}
\]

one gets the exact normalization

\[
 \boxed{W_x(F_\gamma,G_\gamma)=1.}                   \tag{3.11}
\]

Use the state norm

\[
 \|(Y,Y')\|_x={|Y|\over m(x)}+m(x)|Y'|,
 \qquad m(x)=\min\{\sqrt x,1\}.                       \tag{3.12}
\]

Define the flat normal frequency and its monotone action envelope by

\[
 Q_\gamma(x)=1+{\gamma\over2x}+{1\over4x^2},\qquad
 \mathfrak E_\gamma(x)
 =\exp\!\left\{\int_0^x\sqrt{[-Q_\gamma(s)]_+}\,ds\right\}. \tag{3.12a}
\]

For `gamma=-alpha<-2`, the two roots of `Q_gamma` give

\[
 \int_0^\infty\sqrt{[-Q_{-\alpha}(s)]_+}\,ds
 =h\alpha-\frac\pi2;
 \qquad
 \sup_x\mathfrak E_\gamma(x)\leq E_\gamma.          \tag{3.12b}
\]

The exact analytic input still required is the following regular Green
estimate, uniformly through both turning points:

\[
 \boxed{\text{Gate **G**:}\quad
 \|\mathcal G_\gamma(x,t)(0,f)\|_x
 \leq C_DL^{\kappa_D}
 \{1+|\log(x/t)|\}
 {\mathfrak E_\gamma(x)\over\mathfrak E_\gamma(t)}
 m(t)|f|}                                             \tag{3.13}
\]

for `0<t<=x<=8(1+|gamma|)`.  The logarithm cannot be omitted: at the
critical regular singular endpoint the model Green kernel has leading
form

\[
 \mathcal G_0(x,t)\asymp\sqrt{xt}\log(x/t).          \tag{3.14}
\]

The Wronskian identity (3.11) and

\[
 |\Gamma(1/2+is)|^2={\pi\over\cosh(\pi s)}.           \tag{3.15}
\]

do not by themselves prove (3.13); one still needs uniform inequalities
for both Kummer solutions and their derivatives in the origin,
two-turning-point, and allowed zones.  This is the first and weakest
missing lemma in this package.

Conditional on **G**, Duhamel's formula has
`f=-mathcal E_(varepsilon,gamma)Y`, and therefore

\[
 m(t)|f|
 \leq m(t)^2|\mathcal E_{\varepsilon,\gamma}(t)|
       \mathfrak E_\gamma(t)
       \sup_{s\leq t}{\|Y(s)\|_s\over
                         \mathfrak E_\gamma(s)}.      \tag{3.16}
\]

The factor `m(t)^2=min(t,1)` cancels the apparent `1/t` in (3.8), and the
origin logarithm is integrable.  Uniformly for
`x<=8(1+|gamma|)`,

\[
 \int_0^x\{1+|\log(x/t)|\}
 m(t)^2|\mathcal E_{\varepsilon,\gamma}(t)|\,dt
 \leq {C_DL^2\over c}.                               \tag{3.17}
\]

Thus **G** implies the near-zone comparison with **one** factor
`E_gamma`, not `E_gamma^2`.  There is no origin boundary term: both
regular solutions have the same leading `sqrt(2x)` Liouville coefficient,
so `Y-F_gamma=o(sqrt x)`.

Beyond `8(1+|gamma|)`, the flat and curved squared frequencies are bounded
away from zero.  Diagonalizing the two first-order systems gives a bounded
propagator because `Var log Omega=O(1)`, while

\[
 \int_{8(1+|\gamma|)}^x
 |\mathcal E_{\varepsilon,\gamma}(t)|\,dt
 \leq C_D{Lx+\log(2+x)\over c}.                       \tag{3.18}
\]

Consequently

\[
 |Y-F_\gamma|+|Y'-F_\gamma'|
 \leq C_DL^{\kappa_D}E_\gamma{x\over c}.             \tag{3.19}
\]

Division by `sqrt(a_varepsilon)` and the denominator correction give the
first three lines of (3.6), conditional on **G**.  The final line follows
by one ordinary integration by parts, using `d(0)=0` and the `W^(1,1)`
bound.  No unconditional claim of (3.6) is made here.

For later reference, when `varepsilon=-1` and `gamma=-alpha`, the exact
majorant forbidden action is

\[
\begin{aligned}
 \int_0^{U_t}\sqrt{{\alpha\over a_-(U)}-1}\,dU
 &=\alpha\int_0^{\pi/2}
 {\cos^2\phi\over
  \sqrt{1-(\alpha/c)\sin^2\phi}}\,d\phi\\
 &=h\alpha+O(\alpha^2/c),                              \tag{3.20}
\end{aligned}
\]

where `a_-(U_t)=alpha`.  The Langer term `+a_-^(-2)` only shortens the
actual forbidden interval and lowers its action.

## 4. Allowed-region carrier BV, conditional only at its initial point

For the inward solution put

\[
 P=\sqrt{a_-}\,p_\alpha,\qquad
 \Omega_-^2=1-{\alpha\over a_-}+{1\over a_-^2}.       \tag{4.1}
\]

On `[R,U_L]`, with `R>=8(1+alpha)`, choose `phi_-'=Omega_-` and define

\[
\begin{aligned}
 A_+(U)&={1\over2}e^{-i\phi_-(U)}
       \left(P-{iP'\over\Omega_-}\right),\\
 A_-(U)&={1\over2}e^{ i\phi_-(U)}
       \left(P+{iP'\over\Omega_-}\right).
\end{aligned}                                         \tag{4.2}
\]

Then `P=A_+e^(i phi_-)+A_-e^(-i phi_-)`.  Since `a_-` is monotone on
`[R,U_L]`, exact differentiation gives

\[
 \operatorname {Var}_{[R,U_L]}\log\Omega_-
 \leq C\left({\alpha\over R}+{1\over R^2}\right),    \tag{4.3}
\]

and conditional consequence 3.1 supplies the initial carrier size at
`R`.  Hence **G** implies

\[
\boxed{
 \sup_{[R,U_L]}(|A_+|+|A_-|)
 +\operatorname {Var}A_+
 +\operatorname {Var}A_-
 \leq C_DL^{\kappa_D}e^{h\alpha}.}                   \tag{4.4}
\]

The outward normal form, again conditional on **G** for its initial size,

\[
 Q=\sqrt{a_+}\,q_\beta,
 \qquad\Omega_+^2=1+{\beta\over a_+}+{1\over a_+^2} \tag{4.5}
\]

has the analogous two-carrier representation on `[R,infinity)` with

\[
 \sup(|B_+|+|B_-|)+\operatorname {Var}B_+
 +\operatorname {Var}B_-
 \leq C_DL^{\kappa_D}                                 \tag{4.6}
\]

for `beta>=0`.  Equations (4.4)--(4.6) retain the signed carriers; replacing
them by absolute tail localization would lose the conditional reduction.

## 5. The physical conormal comparison

The flat conormal is exactly

\[
\boxed{
 \mathcal C_0(\alpha,\beta)
 =\operatorname {Abel}\!\int_0^\infty\!\int_0^\infty
 {w_{-\alpha}(U)w_\beta(V)\over U+V}\,dV\,dU
 ={2\{e^{h(\alpha-\beta)}-1\}\over\alpha-\beta}.}   \tag{5.1}
\]

At equality the right side is interpreted by continuity.

### 5.1 The near rectangle

There is an exact identity

\[
 z={U+V\over c-U},\qquad
 K_c(U,V):={1\over(c-U)\log\{(c+V)/(c-U)\}}
 ={1\over U+V}{z\over\log(1+z)}.                     \tag{5.2}
\]

Thus, uniformly on `0<=U,V<=R=o(c)`,

\[
 K_c(U,V)={1\over U+V}+{1\over2(c-U)}
 +O\!\left({U+V\over(c-U)^2}\right),                \tag{5.3}
\]

and in particular `|K_c-(U+V)^(-1)|<=C/c`.

Conditional consequence 3.1 also gives

\[
\begin{aligned}
 |p_\alpha-w_{-\alpha}|&\leq
 C_DL^{\kappa_D}e^{h\alpha}{U\over c\sqrt{1+U}},\\
 |q_\beta-w_\beta|&\leq
 C_DL^{\kappa_D}{V\over c\sqrt{1+V}},               \tag{5.4}
\end{aligned}
\]

while each undisplaced profile has the corresponding
`(1+x)^(-1/2)` envelope.  Since `U/(U+V)<=1` and `V/(U+V)<=1`, (5.3)--(5.4)
give

\[
 \left|\mathcal C_c^{[0,R]^2}
      -\mathcal C_0^{[0,R]^2}\right|
 \leq C_DL^{\kappa_D}e^{h\alpha}{R\over c}.          \tag{5.5}
\]

### 5.2 Signed flat tails

For `z>=0`, one carrier integration by parts gives

\[
 \left|\int_R^\infty e^{-zx}w_\gamma(x)\,dx\right|
 \leq C_DL^{\kappa_D}E_\gamma
 {e^{-zR}\over(1+z)\sqrt R}.                          \tag{5.6}
\]

Using `1/(U+V)=integral_0^infinity exp{-z(U+V)} dz` and the exact full
Kummer Laplace transforms therefore yields

\[
 \left|\mathcal C_0-\mathcal C_0^{[0,R]^2}\right|
 \leq C_DL^{\kappa_D}e^{h\alpha}R^{-3/2}.            \tag{5.7}
\]

This is a signed Abel estimate, not an absolute `L1` tail bound.

### 5.3 Signed physical tails

Split the physical complement into

\[
 D_1=\{R\leq U\leq U_L,\ V\geq0\},\qquad
 D_2=\{0\leq U\leq R,\ V\geq R\}.                  \tag{5.8}
\]

Put

\[
 H_{\beta,c}(U)=\operatorname {Abel}\int_0^\infty
 q_\beta(V)K_c(U,V)\,dV,
 \qquad h_{\beta,c}(U)={H_{\beta,c}(U)\over\sqrt{a_-(U)}}. \tag{5.8a}
\]

The carrier bounds give the individual endpoint scales

\[
 \left|\operatorname {Abel}\int_0^\infty
 q_\beta(V)K_c(R,V)\,dV\right|
 \leq C_DL^{\kappa_D}R^{-1/2}.                       \tag{5.9}
\]

Indeed `V<=R` is bounded by the profile envelope and
`K_c(R,V)<=C/(R+V)`, while `V>=R` is integrated by the outward carriers.
At `U=U_L`, one has `c-U_L=c/A=2*pi` and

\[
 K_c(U_L,V)
 ={1\over2\pi\log\{(c+V)/(2\pi)\}},
\]

so the same split gives

\[
 \left|\operatorname {Abel}\int_0^\infty
 q_\beta(V)K_c(U_L,V)\,dV\right|
 \leq C_DL^{\kappa_D}{\sqrt R\over L}.              \tag{5.10}
\]

but those two endpoint estimates do **not** control the variation needed
for inward integration by parts.  The second missing analytic input is
the following uniform-in-Abel-regulator statement:

\[
\boxed{
\begin{aligned}
\text{Gate **T**:}\qquad
 |h_{\beta,c}(R)|+|h_{\beta,c}(U_L)|
 +\operatorname {Var}_{[R,U_L]}h_{\beta,c}
 &\leq C_DL^{\kappa_D}
 \left(R^{-1}+{1\over L}\sqrt{R\over c}\right),\\
 \left|\operatorname {Abel}\int_0^R p_\alpha(U)
       \int_R^\infty q_\beta(V)K_c(U,V)\,dV\,dU\right|
 &\leq C_DL^{\kappa_D}e^{h\alpha}R^{-1}.
\end{aligned}}                                       \tag{5.10a}
\]

The first line is a joint signed `U`--`V` BV estimate.  A pointwise
variation bound for `K_c(U,V)` followed by absolute integration in `V`
is insufficient, because `q_beta(V)` is not absolutely integrable.
Endpoint formulas (5.9)--(5.10) therefore do not prove **T**.

Conditional on **G** and **T**, inward-carrier integration by parts gives

\[
 |\mathcal C_c^{D_1}|
 \leq C_DL^{\kappa_D}e^{h\alpha}
 \left(R^{-1}+{1\over L}\sqrt{R\over c}\right).    \tag{5.11}
\]

and the second line of **T** gives

\[
 |\mathcal C_c^{D_2}|
 \leq C_DL^{\kappa_D}e^{h\alpha}R^{-1}.              \tag{5.12}
\]

Combining (5.5), (5.7), and (5.11)--(5.12), conditional on **G** and
**T**, gives

\[
\boxed{
 |\mathcal C_c(\alpha,\beta)-\mathcal C_0(\alpha,\beta)|
 \leq C_DL^{\kappa_D}e^{h\alpha}
 \left({R\over c}+{1\over R}+\sqrt{R\over c}\right).} \tag{5.13}
\]

For the exponential choice (2.2), division by
`e^(h(alpha-beta))/(alpha-beta)` leaves a polynomial in `L` times

\[
 e^{h\beta}{R\over c},\qquad
 {e^{h\beta}\over R},\qquad
 e^{h\beta}\sqrt{R\over c}.                          \tag{5.14}
\]

Their positive decay margins are respectively

\[
 1-(3\pi/4+\epsilon)A_1,\qquad
 (\pi/4+\epsilon)A_1,\qquad
 {1\over2}-(\pi/2+\epsilon/2)A_1.                    \tag{5.15}
\]

Thus **G** and **T** imply (0.7), with room to beat every fixed power of
`L`.

## 6. Smooth pole and Archimedean-regular kernels

In the exact direct-source normalization the two smooth continuous
symbols after the conormal is removed are

\[
 g_P(r)=-2(1+e^{-r}),\qquad
 g_{A,\mathrm {reg}}(r)={1\over\sinh r}-{1\over r},
 \qquad r=\log{c+V\over c-U}.                         \tag{6.1}
\]

Their physical kernels are `g(r)/(c-U)`.  The pole kernel is exactly

\[
 {g_P(r)\over c-U}=-{2\over c-U}-{2\over c+V}.       \tag{6.2}
\]

Thus, with the same Abel convention as (0.4),

\[
 \mathcal P_c=\operatorname {Abel}\!\int_0^{U_L}\!\int_0^\infty
 p_\alpha(U)q_\beta(V){g_P(r)\over c-U}\,dV\,dU,
 \tag{6.2a}
\]

and `mathcal A_(reg,c)` is defined by the identical formula with
`g_P` replaced by `g_(A,reg)`.

Moreover

\[
 g_{A,\mathrm {reg}}(r)=-{r\over6}+O(r^3)\qquad(r\to0),
 \qquad g_{A,\mathrm {reg}}(r)=O(r^{-1})\quad(r\to\infty). \tag{6.3}
\]

For `g in {g_P,g_(A,reg)}`, put

\[
 K_g(U,V)={g(r)\over c-U},\qquad
 h_{g,\beta,c}(U)={1\over\sqrt{a_-(U)}}
 \operatorname {Abel}\int_0^\infty q_\beta(V)K_g(U,V)\,dV,
\]

and write

\[
 \mathscr B_R(f):=|f(R)|+|f(U_L)|
 +\operatorname {Var}_{[R,U_L]}f.
\]

The smooth
analogue of **T** required here is

\[
\boxed{
\begin{aligned}
 \text{Gate **T**$_{\rm sm}$:}\qquad
 \mathscr B_R(h_{g_P,\beta,c})
 +e^{-h\alpha}|\mathcal P_c^{D_2}|
 &\leq C_DL^{\kappa_D}\sqrt{R/c},\\
 \mathscr B_R(h_{g_{A,\rm reg},\beta,c})
 +e^{-h\alpha}|\mathcal A_{\rm reg,c}^{D_2}|
 &\leq C_DL^{\kappa_D}
 \left(L^{-1}\sqrt{R/c}+c^{-1}\right).
\end{aligned}}                                      \tag{6.3a}
\]

Here the `D_2` superscript means the domain in (5.8).  Just as for the
conormal, the endpoint values alone do not prove these joint signed BV
statements.  Conditional on **G**, **T**$_{\rm sm}$, and the elementary
near-rectangle expansion, the split gives

\[
\boxed{
 |\mathcal P_c(\alpha,\beta)|
 \leq C_DL^{\kappa_D}e^{h\alpha}
 \left({R\over c}+\sqrt{R\over c}\right),}          \tag{6.4}
\]

and

\[
\boxed{
 |\mathcal A_{\mathrm {reg},c}(\alpha,\beta)|
 \leq C_DL^{\kappa_D}e^{h\alpha}
 \left({R^2\over c^2}+{1\over L}\sqrt{R\over c}
                  +{1\over c}\right).}             \tag{6.5}
\]

The square-root boundary term in (6.4) is the hard inward endpoint
`U=U_L`; it is not discarded.  Equations (2.2)--(2.3) and
(6.4)--(6.5), conditional on the displayed gates, show that both smooth blocks are
`o(e^(hCL)/L^M)` on the high--low cluster for every fixed `M`.

For a same-cluster block, take `R=R_H=c^(1/3)` in (5.13), (6.4), and
(6.5).  The flat conormal depends only on fixed offset differences and is
`O_m(1)`, while all curved and smooth errors are bounded by

\[
 C_{m,D}L^{\kappa_D}e^{h\alpha_{\rm ctr}}c^{-1/3}.    \tag{6.6}
\]

Thus the gates imply (0.8).  Notice that (6.6), rather than an unsupported
global `O(1)` finite-`c` assertion, is what is used below.

## 7. Cauchy conditioning and the negative spectrum

Let

\[
 \mathcal T_c(\gamma,\delta)
 =\mathcal C_c(\gamma,\delta)
  +\mathcal P_c(\gamma,\delta)
  +\mathcal A_{\mathrm {reg},c}(\gamma,\delta),
\]

and form the real Hermitian part

\[
 \mathsf H_c(\gamma,\delta)
 ={\mathcal T_c(\gamma,\delta)
    +\mathcal T_c(\delta,\gamma)\over2}.              \tag{7.0}
\]

The same definition is used for the flat conormal.  Smooth terms have no
flat main at the scale considered here.

Put `X=CL` and absorb the `O(L^(-1))` placement errors into nodes
`a_i(L),b_j(L)` converging to the fixed distinct offsets.  The high--low
block of the flat Hermitian part is

\[
\begin{aligned}
 C^{H,0}_{ij}
 &= {2\sinh\{h(X+a_i(L)-b_j(L))\}
       \over X+a_i(L)-b_j(L)}\\
 &=e^{hX}D_aM_XD_b+O(e^{-hX}X^{-1}),                 \tag{7.1}
\end{aligned}
\]

where

\[
 (M_X)_{ij}={1\over X+a_i(L)-b_j(L)},\qquad
 D_a=\operatorname {diag}(e^{ha_i(L)}),\qquad
 D_b=\operatorname {diag}(e^{-hb_j(L)}).             \tag{7.2}
\]

The exact inverse formula for a Cauchy matrix gives

\[
 \|M_X^{-1}\|\leq C_mX^{2m-1},                       \tag{7.3}
\]

uniformly for all large `L`, because the limiting Vandermonde gaps are
nonzero.  Therefore

\[
\boxed{
 s_{\min}(C^{H,0})\geq c_m{e^{hX}\over X^{2m-1}}.}   \tag{7.4}
\]

Equivalently, the Cauchy singular exponents are
`X^(-1),X^(-3),...,X^(-(2m-1))`.  It is essential to apply the exact
Cauchy inverse to the actual perturbed nodes.  A crude entrywise
`O(L^(-1))` perturbation of a nearly rank-one matrix would not prove
(7.4).

For the forward high--low orientation, (0.7) with `M=2m` supplies the
exponential entry.  For the reverse low--high orientation, (5.13) and
(6.4)--(6.5) with `R=R_H` give, under the same gates,

\[
 \mathcal T_c(\beta_j,\alpha_i)
 =O_m(1)+O\!\left(L^{\kappa_D}c^{hA_1-1/3}\right)
 =o\!\left({e^{hCL}\over L^{2m-1}}\right).          \tag{7.4a}
\]

Thus the conditional physical Hermitian cross block preserves (7.4).
For the high same-cluster error, (6.6) divided by the right side of (7.4)
is

\[
 L^{O_m(1)}c^{hA_1-1/3}=o(1),                        \tag{7.5}
\]

because `A_1<1/pi` implies `hA_1<1/4`.  The low block is smaller.  Hence
the Hermitian continuous matrix has the form

\[
 H_c=\begin{pmatrix}A_L&C_c^*\\ C_c&A_H\end{pmatrix},
 \qquad
 \|A_L\|+\|A_H\|=o\{s_{\min}(C_c)\}.               \tag{7.6}
\]

The comparison matrix with zero diagonal blocks has eigenvalues
`+/-s_j(C_c)`.  Conditional on **G**, **T**, and **T**$_{\rm sm}$,
Weyl's inequality gives (0.9).

If `r` fixed linear source or endpoint rows are the only additional terms
and those terms vanish on their common kernel, take `m>r`.  The common
kernel intersects the `m`-dimensional negative spectral subspace in
dimension at least `m-r`; every nonzero vector in that intersection
retains the negative bound.  This is a finite-dimensional row-null
statement only.  It does not estimate any omitted infinite-rank sampler
or prime block.

## 8. Exact physical prefactor and discrete-label boundary

For one oriented local `m=l=1` modal entry, the exact prefactor from the
physical profiles is

\[
 {\lambda e_\alpha e_\beta\over4c}
 (1+\chi_\alpha)\chi_\beta.                           \tag{8.1}
\]

Full two-sided exterior-defect whitening replaces `e_gamma` by
`z_gamma=e_gamma/sqrt(d_gamma)`.  The proved radial mass formula gives

\[
 J_\gamma:=J\!\left(\sqrt{\gamma/c}\right),\qquad
 z_\gamma^2
 ={\pi c\over2\lambda J_\gamma}\{1+o(1)\},          \tag{8.2}
\]

uniformly for `gamma=Theta(L)`.  Consequently

\[
 \boxed{
 {\lambda\over4c}z_\alpha z_\beta
 ={\pi\over8\sqrt{J_\alpha J_\beta}}\{1+o(1)\}
 =\Theta(L^{-1}).}                                    \tag{8.3}
\]

The positive diagonal factors in (8.1)--(8.3) preserve inertia if
`chi_gamma` is bounded below on the selected rows.  No such physical
leakage lower bound is proved in this package.  Thus (8.3) supplies the
exact conditional rescaling of (0.9), not an unconditional discrete modal
corollary.

For completeness, the exact action satisfies

\[
 {d\sigma\over d\alpha}=-{1\over2}J_\alpha,
 \qquad J_\alpha=\Theta(L)                            \tag{8.4}
\]

on every fixed `alpha/L` window.  Therefore a same-phase Bohr--Kramers
bracket with `O(1)` action error places any fixed target energy in that
window to `O(L^(-1))`.  If the frozen same-phase bracket is admitted on the
required labels, it produces nodes of the form (0.6), and the exact Cauchy
argument remains uniformly conditioned.  This note does not independently
reprove existence of the required modal rows or a leakage estimate; both
must be checked before (0.9) is called a statement about an actual modal
subspace.

## 9. Exact conclusion

Unconditionally, the package proves the exact finite-`c` Liouville
perturbation and Kummer Wronskian, the parameter margins, the flat
conormal formula, the Cauchy lower singular-value bound, the conditional
inertia implication, and the exact `D`-white scalar.  It does **not** prove
the curved conormal comparison.

The weakest unresolved inputs are precisely:

1. gate **G**, the origin-logarithmic, two-turning-point Kummer propagator
   ratio (3.13), from which the one-`E_gamma` local comparison follows;
2. gate **T**, the joint signed physical-kernel BV estimate (5.10a); and
3. its two smooth-symbol analogues **T**$_{\rm sm}$ in (6.3a).

If these gates hold, the continuous `m=l=1` two-cluster matrix has the
negative spectrum (0.9).  Even then, the discrete prime and all other
sampler channels remain outside the reduction, and the leakage lower
bound remains missing, so no full central counterexample follows.
