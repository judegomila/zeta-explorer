# Growing-transition deterministic edge--edge higher-alias theorem

## 0. Exact result and claim boundary

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 c=2\pi\lambda^2,\qquad L=2\log\lambda,
 \qquad B=(\log L)^4.                                  \tag{0.1}
\]

Let `E_B` be the **unsheared**, one-fixed-Fourier-phase prolate space

\[
 \nu\equiv0\pmod4,\qquad
 \nu<n_*,\qquad
 |\alpha_\nu|\leq B,\qquad
 \alpha_\nu={c^2-\mu_\nu\over c},                     \tag{0.2}
\]

in exact exterior-defect (`D`) coordinates, and let `P_B` denote its
orthogonal projector.  The result in this note concerns only the
deterministic lattice aliases with `|h|>=2`.  If

\[
 K(X)={1\over4\sqrt X}\,
 T^*P_{[c,2\pi X]}J_{2\pi cX}T,                         \tag{0.3}
\]

then its nonzero Fourier coefficients satisfy, for `h>0`,

\[
 \widehat K(h)={1\over4\sqrt h}\,T^*D_h\mathcal F_+T,
 \qquad \widehat K(-h)=\widehat K(h)^*.                 \tag{0.4}
\]

Here `D_hf(v)=sqrt(h)f(hv)` is the normalized truncated dilation on the
positive exterior half-line (a contraction after exterior compression),
and `mathcal F_+` (the sign-`+` block also denoted
`mathcal F_1`) is the **unilateral positive-quadrant** Fourier block with kernel
`(2*pi*c)^(-1/2)exp(-ivw/c)`.  Thus (0.4) has ambient kernel

\[
 \gamma e^{-ihvw/c},\qquad
 \gamma={1\over4\sqrt{2\pi c}}.                         \tag{0.5}
\]

For every `D`-unit edge basis vector `e_beta`, there are absolute constants
`C,c_0` such that, when `c>=c_0(1+B)^3`,

\[
 \boxed{
 \sum_{h\geq2}\|P_B\{\widehat K(h)+\widehat K(-h)\}e_\beta\|
 \leq C\left\{1+(1+B)^3+{(1+B)^6\over c}\right\}.}     \tag{0.6}
\]

Only the symmetric pair `widehat K(h)+widehat K(-h)` is asserted in (0.6).
The exterior cutoff is retained when the adjoint is moved, and only then is
the full even Fourier eigenrelation applied.  No individual unilateral
alias is replaced by an eigenvalue.  The `h=2` pair is retained by
contraction; for `h>=3` the paired column is `O((1+B)^3h^(-2))`, with
exact-channel correction `O((1+B)^6/(ch^4))` and Liouville--Green
remainder `O((1+B)/(ch^3))`.

The edge rank obeys

\[
 \boxed{Q_B:=\dim E_B=O\{L(1+B)\}.}                     \tag{0.7}
\]

Consequently, uniformly in the finite Fejer cutoff `H`,

\[
 \boxed{
 \left\|\sum_{2\leq |h|\leq H}
  \left(1-{|h|\over H+1}\right)P_B\widehat K(h)P_B
 \right\|_{\rm HS}
 \leq C\sqrt{L(1+B)}
 \left\{1+(1+B)^3+{(1+B)^6\over c}\right\}=o(L).}      \tag{0.8}
\]

The Fejer means therefore converge in Hilbert--Schmidt norm on `E_B`, and
their deterministic `|h|>=2` edge--edge limit is `o(L)`.

This theorem is deliberately narrow.  It proves no statement for the
remaining retained supercritical buffer

\[
 -C_0L\leq\alpha<-B,                                    \tag{0.9}
\]

no endpoint-sheared edge block, no edge--bulk or bulk--edge block, and no
raw prime discrepancy

\[
 R_D=\int K(X)\,d\{\psi(X)-\lfloor X\rfloor\}.           \tag{0.10}
\]

It also proves no complete same-side operator, complete reflected operator,
full `Sigma`, `P_0` comparison, signed floor, equation (5.2) of
`DIRECT_RH_ATTACK.md`, determinant conclusion, or RH.  The actual endpoint shear mixes edge columns with the label-`8` bulk row, so (0.8) cannot be
conjugated into a sheared or full edge assertion while the edge--bulk terms
remain open.  The project state remains `P0_INVALIDATED`.

## 1. Frozen inputs and the unvendored action source

The repository inputs used below are frozen at the following bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_WEBER_EDGE_RECIPROCAL_CHANNEL_THEOREM.md` | `16db62873056fb419bc740154c67a8f27ce6ecea2b85201abab7b89aa20d56d0` |
| `notes/TRANSITION_PROLATE_OUTER_THEOREM.md` | `215f27adc0453f601ced419bd39910cb821c31b2e77678b63874987510f4f9c6` |
| `P2_SOURCE_LOCK.json` | `8b731d499903041ef68e7722ebd085d22673c022655431dcca27c9cac6f4730a` |

The rank proof in Section 6 additionally uses Theorem 1 of A. Bonami and
A. Karoui, *Uniform approximation and explicit estimates for the prolate
spheroidal wave functions*, arXiv:1405.3676v2, published in Constructive
Approximation, DOI `10.1007/s00365-015-9295-1`.  That primary source is
explicitly **not vendored or source-locked** in this checkpoint.  Thus the
rank argument is mathematically sourced, but the module is not a fully
source-locked formal checkpoint until those bytes are admitted.  No fake
hash is assigned to the paper.

## 2. Finite Fejer identity and arithmetic separation

First insert a continuous compact cutoff `eta_R` in `X`, equal to one on
the required finite interval, and write `K_R=eta_RK`.  Its periodization

\[
 \mathcal P_R(t)=\sum_{n\in\mathbb Z}K_R(n+t)            \tag{2.1}
\]

is a continuous finite operator-valued sum.  Its exact finite Fejer mean at
zero is

\[
 \boxed{
 \sigma_H\mathcal P_R(0)=
 \sum_{|h|\leq H}\left(1-{|h|\over H+1}\right)
 \widehat K_R(h),\qquad
 \widehat K_R(h)=\int_{\mathbb R}K_R(X)e^{-2\pi ihX}\,dX.} \tag{2.2}
\]

Fejer convergence gives

\[
 \lim_{H\to\infty}\sigma_H\mathcal P_R(0)
 =\sum_{n\in\mathbb Z}K_R(n).                            \tag{2.3}
\]

After the compact identity is established, `R` tends to infinity for each
fixed `h` through the same Abel/cutoff boundary value used to define (0.4).
At the lower endpoint `X=c/(2*pi)` the interval projector in (0.3) has zero
length, so there is no omitted endpoint atom.  Section 5 then supplies an
absolutely summable Hilbert--Schmidt majorant for the resulting compressed
`|h|>=2` coefficients; hence their finite Fejer means are uniform in `H`.
The ordered cutoff limit `R` first and Fejer limit `H` second is the only
cutoff passage claimed here; no joint uniformity in arbitrary cutoffs is
being asserted.

It is important not to replace the arithmetic measure by Lebesgue measure.
With `N(X)=floor(X)` and `D=psi-N`, Stieltjes summation gives exactly

\[
 \sum_n\Lambda(n)K(n)=\sum_nK(n)+\int K\,dD.             \tag{2.4}
\]

The deterministic lattice part has the carrier decomposition

\[
 \sum_nK(n)-\int K(X)\,dX
 =\mathop{\rm Fej\!\!-lim}_{H\to\infty}
 \sum_{1\leq|h|\leq H}
 \left(1-{|h|\over H+1}\right)\widehat K(h).            \tag{2.5}
\]

Thus `h=0`, `h=+/-1`, `|h|>=2`, and `R_D` are four distinct pieces.  The
factor-two first carrier and the raw prime discrepancy are not hidden in
the operator of (0.8).  This note treats only the deterministic last group
`|h|>=2`.  Because the Fejer weights at `h` and `-h` are equal, that last
group is always organized as the self-adjoint pair `S_h`; no estimate for
an unpaired unilateral coefficient is claimed.

## 3. Exact alias normalization and the factor one quarter

The fixed-phase `D`-isometry is

\[
 (Tx)(v)=\sqrt{{2\lambda\over c}}\,
 H_x\!\left({\lambda v\over c}\right),\qquad v\geq c.   \tag{3.1}
\]

For an individual `D`-white basis vector set

\[
 \bar q_j(u)=(Te_j)(c+u)=\sqrt{{8\over d_j}}q_j(u),
 \qquad \|\bar q_j\|_{L^2(0,\infty)}=1.                 \tag{3.2}
\]

The unilateral block in (0.4) does **not** satisfy a scalar eigenrelation
on a positive exterior tail.  It must first be paired with its adjoint.
On `L^2([c,infty))`, the truncated dilation and its adjoint are

\[
 (D_hf)(v)=\sqrt h f(hv),\qquad
 (D_h^*g)(w)=h^{-1/2}{\bf1}_{[hc,\infty)}(w)g(w/h).
                                                                    \tag{3.3}
\]

Writing the unilateral kernel as
`k_+(v,w)=(2*pi*c)^(-1/2)exp(-ivw/c)`, substitution `w=hz` gives the
exact cutoff-preserving identity

\[
 \mathcal F_+^*D_h^*=D_h\mathcal F_+^*,
 \qquad
 (D_h\mathcal F_+^*)(v,z)
 ={\sqrt h\over\sqrt{2\pi c}}e^{+ihvz/c}.              \tag{3.4}
\]

Consequently, if

\[
 S_h:=\widehat K(h)+\widehat K(-h),
\]

then

\[
 \boxed{
 S_h={1\over4\sqrt h}\,
 T^*D_h(\mathcal F_++\mathcal F_+^*)T.}                \tag{3.5}
\]

For an even plus prolate label, the sum of the two positive-quadrant
kernels in (3.5) is exactly the full even exterior finite-Fourier
compression.  Thus

\[
 (\mathcal F_++\mathcal F_+^*)Te_b=-\chi_bTe_b,
 \qquad 0<\chi_b<1.                                     \tag{3.6}
\]

Now, and only now, the eigenrelation may be inserted.  Since
`h(c+u)=c+tau_h(u)` with `tau_h(u)=hu+c(h-1)`, the `sqrt(h)` in `D_h`
cancels `(4sqrt(h))^(-1)`.  The exact **paired** matrix element is

\[
 \boxed{
 \langle e_a,S_h e_b\rangle
 =- {\chi_b\over4}\int_0^\infty
 \overline{\bar q_a(u)}\,
 \bar q_b\{\tau_h(u)\}\,du,\qquad h>0.}               \tag{3.7}
\]

This is the factor `1/4` for the symmetric pair.  At `h=1`, (3.7) is
`-chi_b/4` on the diagonal, so the Hermitian part of the single unilateral
coefficient is `-chi_b/8`, as required.  Formula (3.7) is never asserted
for `widehat K(h)` alone.

The endpoint estimate in
`TRANSITION_PROLATE_OUTER_THEOREM.md`, equation (2.11), is

\[
 |h_{j,\lambda}(\lambda)|^2
 \leq2592\pi^2\lambda d_j.                              \tag{3.8}
\]

Since

\[
 \bar q_j(0)=\sqrt{{2\lambda\over c}}
 {h_{j,\lambda}(\lambda)\over\sqrt{d_j}},
 \qquad c=2\pi\lambda^2,                                \tag{3.9}
\]

we obtain the uniform `D`-white endpoint bound

\[
 \boxed{|\bar q_j(0)|^2\leq2592\pi.}                   \tag{3.10}
\]

No unproved edge leakage asymptotic is used in (3.10).

## 4. The actual far edge row for the symmetric pair

Write

\[
 A_c=-{d\over du}\left(a_c(u){d\over du}\right)-a_c(u),
 \qquad a_c(u)=2u+{u^2\over c}.                          \tag{4.1}
\]

Each `bar q_beta` in (0.2) obeys

\[
 A_c\bar q_\beta=\beta\bar q_\beta,
 \qquad \bar q_\beta'(0)=-{\beta\over2}\bar q_\beta(0).
                                                                    \tag{4.2}
\]

Fix `h>=3`, put

\[
 U_0=c(h-1),\qquad U=U_0+hu,\qquad s={u\over c},
 \qquad R_h(s)=h^2(1+s)^2-1.                            \tag{4.3}
\]

Then

\[
 a_c(U)=cR_h(s),
 \qquad R_h(s)\geq(h^2-1)(1+s)^2.                       \tag{4.4}
\]

For `v=sqrt(a_c)bar q_beta`, direct differentiation of (4.2) gives

\[
 v''+\Omega_\beta(U)^2v=0,
 \qquad
 \Omega_\beta^2=1+{\beta\over a_c(U)}+{1\over a_c(U)^2}. \tag{4.5}
\]

The function `a_c` is increasing, `a_c(c)=3c`, and

\[
 |d\log\Omega_\beta|
 \leq C\left\{{1+B\over a_c^2}+{1\over a_c^3}\right\}
 \,d a_c.
\]

Consequently, uniformly for `|beta|<=B`,

\[
 \begin{aligned}
 {1\over2}&\leq\Omega_\beta^2\leq{3\over2}
       &&(U\geq c),\\
 \operatorname {Var}_{[c,\infty)}\log\Omega_\beta
   &\leq {C(1+B)\over c},\\
 \operatorname {Var}_{[U_0,\infty)}\log\Omega_\beta
   &\leq {C(1+B)\over c(h^2-1)}=:\epsilon_h.
 \end{aligned}                                         \tag{4.6}
\]

The oscillator energy

\[
 E(U)=|v'(U)|^2+\Omega_\beta(U)^2|v(U)|^2               \tag{4.7}
\]

obeys `|d log E|<=2|d log Omega_beta|`.  On `[c,2c]`, one has
`a_c<=8c`; uniform oscillator observability on fixed-length subintervals,
summed across this interval, gives

\[
 \int_c^{2c}|v(U)|^2\,dU\geq c_0cE(c).
\]

Together with `||bar q_beta||_2=1`, this yields `E(c)<=C`.  The global
variation in (4.6), not merely its far-tail line, now gives

\[
 E(U_0)\leq
 \exp\{C(1+B)/c\}E(c)\leq C.
\]

The outgoing amplitudes at `U_0` are therefore bounded uniformly.  Beyond
`U_0`, their variation is controlled by `exp(C epsilon_h)`.

For completeness, diagonalize the first-order system associated with
(4.5) by the exact carriers

\[
 \Omega_\beta^{-1/2}\exp\left(\pm i
 \int_{U_0}^U\Omega_\beta(V)\,dV\right).
\]

The derivative of the carrier coefficient matrix has norm at most
`C|d log(Omega_beta)|`.  Integrating from infinity and applying Gronwall
therefore gives constants `C_beta,h^+`, `C_beta,h^-`, bounded absolutely,
and a remainder `rho` satisfying `|rho(U)|<=C epsilon_h`, such that

\[
 v(U)=\Omega_\beta(U)^{-1/2}
 \sum_{\varepsilon=\pm}C_{\beta,h}^{\varepsilon}
 e^{i\varepsilon\theta_\beta(U)}+\rho(U),
 \quad
 \theta_\beta(U)=\int_{U_0}^U\Omega_\beta(V)\,dV.       \tag{4.8}
\]

Define

\[
 \delta_{h,\beta}(s)=
 \int_{U_0}^{U_0+chs}\{\Omega_\beta(V)-1\}\,dV.        \tag{4.9}
\]

Set

\[
 m_h(s)={\sqrt{h^2-1}\over\sqrt{R_h(s)}},\qquad
 g_{h,\beta}^{\varepsilon}(s)=
 m_h(s)\Omega_\beta(U_0+chs)^{-1/2}
 e^{i\varepsilon\delta_{h,\beta}(s)}.                  \tag{4.10}
\]

Equations (4.4)--(4.6) imply, for `1<=k<=3`,

\[
 |\partial_s^k\delta_{h,\beta}(s)|
 \leq {C_k(1+B)\over h(1+s)^{k+1}},                    \tag{4.11}
\]

and direct product differentiation gives

\[
\boxed{
 \|g_{h,\beta}^{\varepsilon}\|_{H^3(0,\infty)}
 \leq C(1+B)^3.}                                       \tag{4.12}
\]

A bounded half-line Sobolev extension is understood below.  Finally,
(4.8)--(4.10) give the actual normalized row

\[
 \boxed{
 \bar q_\beta\{\tau_h(u)\}
 ={1\over\sqrt{c(h^2-1)}}
 \sum_{\varepsilon=\pm}C_{\beta,h}^{\varepsilon}
 g_{h,\beta}^{\varepsilon}(u/c)e^{i\varepsilon hu}
 +r_{h,\beta}(u),}                                     \tag{4.13}
\]

with

\[
\boxed{
 \|r_{h,\beta}\|_2
 \leq {C(1+B)\over ch^3}.}                              \tag{4.14}
\]

Indeed,

\[
 \int_0^\infty{du\over a_c\{\tau_h(u)\}}
 ={1\over h}\int_{c(h-1)}^\infty{dU\over a_c(U)}
 ={\ell_h\over2h}\leq {C\over h^2},
 \quad \ell_h=\log{h+1\over h-1},                      \tag{4.15}
\]

and (4.14) follows from `|rho|<=C epsilon_h`.

## 5. Wiener synthesis through the exact `A_c` transform

Write an output edge row as

\[
 \bar q_a(u)=\kappa_aw_{c,\alpha_a}(u),\qquad
 w_{c,\alpha_a}(0)=1.                                   \tag{5.1}
\]

Equation (3.10) gives `|kappa_a|<=sqrt(2592*pi)`.  For `N>=2`, the exact
Abel transform from the scalar edge theorem is

\[
 F_c(N,\alpha)=\int_0^\infty
 w_{c,\alpha}(u)e^{-iNu}\,du
 ={-i\over\sqrt{N^2-1}}e^{i\alpha\ell_N/4}
 \{1+\mathcal G_c(N,\alpha)\},                          \tag{5.2}
\]

where

\[
 |\mathcal G_c(N,\alpha)|
 \leq {C(1+B)^3\over cN^2},\qquad |\alpha|\leq B.      \tag{5.3}
\]

Extend each function in (4.12) to the real line with the same Sobolev
bound and Fourier-split it at

\[
 |\xi|={ch\over4}.                                      \tag{5.4}
\]

On the low part, every shifted frequency `N=h+xi/c` has
`|N|>=3h/4>=2`.  Fubini is first applied with the Abel regulator and then
the regulator is removed using (5.2)--(5.3); a negative shifted frequency
uses the conjugate identity for the real endpoint-normalized solution.
Since

\[
 \|\widehat g\|_1\leq C\|g\|_{H^1}\leq C(1+B)^3,    \tag{5.5}
\]

the low-frequency part of one paired matrix entry in (3.7), before the harmless
factor `chi_beta/4`, is bounded by

\[
 {C(1+B)^3\over\sqrt c\,h^2}
 +{C(1+B)^6\over c\sqrt c\,h^4}.                       \tag{5.6}
\]

This is where the exact `F_c` channel is used.  A pointwise estimate has
not yet been promoted to an operator estimate.

For that promotion, a crude target count is enough.  Since

\[
 \mu_a=c^2-c\alpha_a\leq c^2+cB\leq2c^2,
 \qquad \mu_n(c)\geq n(n+1),                            \tag{5.7}
\]

the total number of possible output labels is at most `2c`.  Taking the
`ell^2` norm of (5.6) therefore cancels its `c^(-1/2)` and yields

\[
 \|P_B({\rm principal\ low\ row})\|_2
 \leq {C(1+B)^3\over h^2}
 +{C(1+B)^6\over ch^4}.                                 \tag{5.8}
\]

On the high Fourier part, (4.12) gives

\[
 \|g_{\rm hi}\|_2
 \leq \left({4\over ch}\right)^3\|g^{(3)}\|_2
 \leq {C(1+B)^3\over c^3h^3}.                          \tag{5.9}
\]

Now Bessel is used in its exact form: orthogonal projection cannot increase
the physical `L^2` norm.  After the half density in (4.13),

\[
 \|P_B({\rm principal\ high\ row})\|_2
 \leq {C(1+B)^3\over c^3h^4}.                          \tag{5.10}
\]

The same contraction applied to (4.14) gives

\[
 \|P_Br_{h,\beta}\|_2
 \leq {C(1+B)\over ch^3}.                               \tag{5.11}
\]

Combining (3.7) and (5.8)--(5.11), for `h>=3`,

\[
 \boxed{
 \|P_BS_h e_\beta\|
 \leq {C(1+B)^3\over h^2}
 +{C(1+B)^6\over ch^4}
 +{C(1+B)\over ch^3}
 +{C(1+B)^3\over c^3h^4}.}                              \tag{5.12}
\]

For `h=2`, no WKB freezing is required:

\[
 \|\bar q_\beta\circ\tau_2\|_2^2
 ={1\over2}\int_c^\infty|\bar q_\beta(U)|^2\,dU
 \leq{1\over2},                                       \tag{5.13}
\]

so (3.7) gives

\[
 \|P_BS_2 e_\beta\|\leq{1\over4\sqrt2}.               \tag{5.14}
\]

Summing (5.12) and retaining (5.14) proves (0.6).  Notice that the scalar
channel was inserted before the finite-dimensional synthesis, while the
variable-coefficient Fourier tail and the LG error were bounded by physical
Bessel contraction.  No per-entry estimate was silently declared to be an
operator estimate.

## 6. The sharp edge-rank count

For `mu>0`, define the Bonami--Karoui action

\[
 \mathcal A(\mu)=\sqrt\mu\,
 \mathbf E\!\left({c\over\sqrt\mu}\right),             \tag{6.1}
\]

where

\[
 \mathbf E(k)=\int_0^{\min(1,1/k)}
 \sqrt{{1-k^2t^2\over1-t^2}}\,dt.                       \tag{6.2}
\]

Theorem 1 of the unvendored source named in Section 1 states, equivalently,

\[
 \boxed{{\pi n\over2}<\mathcal A(\mu_n)
 <{\pi(n+1)\over2}.}                                   \tag{6.3}
\]

For two consecutive plus labels `n,n+4`,

\[
 \mathcal A(\mu_{n+4})-\mathcal A(\mu_n)>{3\pi\over2}. \tag{6.4}
\]

On the subcritical side put `mu=c^2-c alpha` and
`epsilon=alpha/c`.  Changing variables `x=ct/sqrt(mu)` in (6.1) gives

\[
 \mathcal A(c^2-c\alpha)
 =c(1-\epsilon)\int_0^1
 {\sqrt{1-x^2}\over\sqrt{1-(1-\epsilon)x^2}}\,dx.      \tag{6.5}
\]

Thus the action deficit

\[
 \Delta(\alpha)=\mathcal A(c^2)-
 \mathcal A(c^2-c\alpha)                                \tag{6.6}
\]

obeys, uniformly for `0<alpha<=B=o(c)`,

\[
 0\leq\Delta(\alpha)
 \leq C\alpha\{1+\log(c/\alpha)\},                     \tag{6.7}
\]

and the endpoint split also gives the sharper expansion

\[
 \Delta(\alpha)={\alpha\over4}\log{c\over\alpha}
 +O(\alpha).                                             \tag{6.8}
\]

For (6.7), use

\[
 1-(1+y)^{-1/2}\leq\min(1,y/2),\qquad
 y={\epsilon x^2\over1-x^2},                            \tag{6.9}
\]

split at `1-x^2=epsilon`, and integrate
`x^2/(1-x^2)=d(atanh(x)-x)/dx`.

Equations (6.4)--(6.7) imply

\[
 Q_{B,+}\leq1+{2\Delta(B)\over3\pi}=O(BL).             \tag{6.10}
\]

The negative half of the edge band can be counted without saying anything
about the larger supercritical buffer.  Put `alpha=-a`, `0<a<=B`, and
`epsilon=a/c`.  Directly from (6.1)--(6.2),

\[
 \mathcal A(c^2+ca)-c
 =c\int_0^1\left\{
 \sqrt{1+{\epsilon\over1-t^2}}-1\right\}\,dt.          \tag{6.11}
\]

Use `sqrt(1+y)-1<=min(y/2,sqrt(y))` and split at
`1-t^2=epsilon`.  The endpoint piece is `O(a)`, while the other piece is
`O\{a\log(c/a)\}`.  Hence (6.4) also gives

\[
 Q_{B,-}\leq
 1+C B\{1+\log(c/B)\}=O(BL).                           \tag{6.12}
\]

Combining (6.10) and (6.12) proves (0.7).  This count concerns only
`-B<=alpha<=B`; it neither counts nor includes the excluded interval
(0.9).

## 7. Hilbert--Schmidt Fejer closure

For `H>=2`, define only the deterministic higher-alias compression

\[
 \mathcal A_{B,H}^{\geq2}=
 \sum_{h=2}^H
 \left(1-{h\over H+1}\right)P_BS_hP_B.                \tag{7.1}
\]

The weights lie in `[0,1]`.  From (5.12)--(5.14),

\[
 \sum_{h\geq2}\|P_BS_hP_B\|_{\rm HS}
 \leq C\sqrt{Q_B}
 \left\{1+(1+B)^3+{(1+B)^6\over c}\right\}.            \tag{7.2}
\]

Because the Fejer weights are symmetric, (7.1) is exactly the `|h|>=2`
sum in (0.8), paired before any eigenrelation is used.  Therefore (7.2),
the triangle inequality, and (0.7) prove the uniform estimate (0.8) and
Hilbert--Schmidt convergence as `H` tends to infinity.  Finally,

\[
 \sqrt{L(1+B)}(1+B)^3
 =O\!\left(\sqrt L(\log L)^{14}\right)=o(L),            \tag{7.3}
\]

and the `c^(-1)` correction is smaller on the exponential schedule.

## 8. Why the theorem stops here

For a bulk far parameter `beta=cr^2` with `r` bounded away from zero, the
carrier removed at (4.9) is not slow in the scaled variable `s`.  Indeed,

\[
 \partial_s\delta_{h,\beta}(0)
 =ch\left\{\sqrt{1+{r^2\over h^2-1}+O(c^{-2})}-1\right\}
 \asymp {c\over h}.                                     \tag{8.1}
\]

Hence the mixed edge--bulk coefficient has `H^1` norm growing like `c/h`;
the Wiener proof in Section 5 cannot be reused.  The repaired subcritical
LG theorem controls the Volterra coefficient only after retaining this
action-moving carrier and explicitly does not prove the reflected FIO
composition.  This is the precise edge--bulk gap.

Moreover, endpoint shear inserts the fixed label-`8` bulk row into edge
columns.  Therefore even the pure edge result (0.8) supplies no estimate
for the sheared edge block.  Finally, (2.4) shows why deterministic Fejer
control says nothing about `R_D`: at integer atoms `cos(2*pi*n)=1`, so the
prime discrepancy is resonant and requires its own arithmetic cancellation.

The complete aliases may carry principal `O(L)` mass through the omitted
bulk and mixed blocks.  The `o(L)` edge--edge compression asserted here is
fully compatible with that fact and must not be promoted to a complete-form
estimate.
