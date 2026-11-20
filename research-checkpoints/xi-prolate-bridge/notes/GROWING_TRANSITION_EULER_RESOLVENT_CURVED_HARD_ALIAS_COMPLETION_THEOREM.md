# Growing-transition Euler-resolvent curved/hard alias completion theorem

## 0. Result and exact fail-closed scope

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 A=\lambda^2,\qquad c=2\pi A,\qquad L=2\log\lambda,
 \qquad h={\pi\over4}.                              \tag{0.1}
\]

The admitted high and low modal parameters are either

\[
 \alpha_i=(A_1+C)L+a_i+O(L^{-1}),\qquad
 \beta_j=A_1L+b_j+O(L^{-1}),                       \tag{0.2F}
\]

in the fixed-linear narrow region

\[
 A_1,C>0,\qquad0<\epsilon<2h,\qquad
 hC+\left(5h+{3\epsilon\over2}\right)A_1<1,       \tag{0.3F}
\]

or

\[
 B_L=(\log L)^4,\qquad
 \alpha_i=CL+B_L+a_i+O(L^{-1}),\qquad
 \beta_j=B_L+b_j+O(L^{-1}),                        \tag{0.2P}
\]

where

\[
 0<hC<1,\qquad b_*:=\min_jb_j>0.                   \tag{0.3P}
\]

The offsets and packet dimension are fixed, every selected label is
`0 mod 4`, and all rows below are in exact exterior-defect-white
coordinates.  Let

\[
 \mathcal G_L=\{\alpha_1,\ldots,\alpha_m,
                 \beta_1,\ldots,\beta_m\},\qquad
 \gamma_{\max}=\max_{\gamma\in\mathcal G_L}\gamma
 =\alpha_{\max}.                                    \tag{0.4}
\]

Choose the band constant with the strict frozen margin

\[
 I_L=\left\{z=3,5,\ldots:
 z\leq{cK_0\log L\over L}\right\},\qquad
 K_0>{8m\over C},\qquad
 T_L={e^{hCL}\over L^{2m}}.                        \tag{0.5}
\]

Let the right-continuous periodic Bernoulli resolvent be

\[
 R_z(X)=B_1(X)-zX^z\int_X^\infty B_1(t)t^{-z-1}\,dt,
 \qquad B_1(X)=\{X\}-{1\over2},                    \tag{0.6}
\]

and, for every `gamma in G_L`, let `q_gamma` be the endpoint-normalized
outward curved solution

\[
 (a_+q_\gamma')'+(a_++\gamma)q_\gamma=0,\qquad
 a_+(V)=2V+{V^2\over c},\qquad q_\gamma(0)=1.      \tag{0.7}
\]

The new scalar estimate is uniform over all `2m` selected nodes and
every `z in I_L`,

\[
\boxed{
 \sup_{\gamma\in\mathcal G_L}
 \left|\int_0^\infty q_\gamma(V)\left\{
 {R_z(1+V/c)\over1+V/c}
 -{A^{-z}R_z(A(1+V/c))\over1+V/c}\right\}\,dV\right|
 \leq L^{K_1}.}                                    \tag{0.8}
\]

The proof retains the jump measure of both resolvents.  In particular,
the second term has jumps at `V=2*pi*(n-A)` and is the reciprocal hard
endpoint term; it is not discarded as pointwise small before the
oscillatory integral is formed.

After the ordered unweighted Poisson limit at fixed `lambda`, (0.8)
closes the previously open complete higher-inward row:

\[
\boxed{
 \sup_{\gamma\in\mathcal G_L}
 |\widehat{\mathcal A}^{+}_{z,\gamma}|
 \leq {L^{K_2}\over\sqrt{cL}}
       \{1+e^{h\gamma_{\max}}2^{-z}\}+{C_\psi\over z}.} \tag{0.9}
\]

The last summand in (0.9) is the fixed invisible-origin correction.  It
is written separately rather than hidden in the modal normalization.
Together with the all-node local and higher-outward row bounds proved in
Section 5, (0.9) proves the following estimates for the full `2m`-coordinate
row maps, including both cross orientations and both same-cluster blocks:

\[
\boxed{
 \left\|\sum_{z\in I_L}
 \mathsf S(\widehat{\boldsymbol{\mathcal A}}^{+}_z,
            \widehat{\boldsymbol{\mathcal B}}^{1}_z)
 \right\|=o(T_L),}                                 \tag{0.10}
\]

and

\[
\boxed{
 \left\|\sum_{z\in I_L}
 \mathsf S(\widehat{\boldsymbol{\mathcal A}}^{+}_z,
            \widehat{\boldsymbol{\mathcal B}}^{+}_z)
 \right\|=o(T_L).}                                 \tag{0.11}
\]

Section 5 extends the local-inward and higher-outward row lemmas to the
same full node set and therefore proves

\[
 \left\|\sum_{z\in I_L}
 \mathsf S(\widehat{\boldsymbol{\mathcal A}}^{1}_z,
            \widehat{\boldsymbol{\mathcal B}}^{+}_z)
 \right\|=o(T_L).                                  \tag{0.12}
\]

Hence the exact three-block alias remainder satisfies, before any
compression,

\[
 \|\widehat R_{\rm alias}^{I_L}\|=o(T_L).          \tag{0.13}
\]

The imported local middle-band theorem supplies a fixed constant
`c'_m>0`, after the selected fixed row nulls, such that

\[
 P_E\widehat Q_{\rm loc}^{I_L}P_E
 \preceq-c'_mT_LP_E.                               \tag{0.14}
\]

Compression cannot increase (0.13), so eventually

\[
\boxed{
 P_E\widehat Q_{\rm full}^{I_L}P_E
 \preceq-{c'_m\over2}T_LP_E.}                      \tag{0.15}
\]

Equation (0.15) is only the completed physical odd-Laplace middle band
on the surviving finite-dimensional subspace `P_E`.  This theorem does
not control odd rows outside `I_L`, the pole or Archimedean completion,
the ordered prime form, the complete central sign, equation (5.2) of
`DIRECT_RH_ATTACK.md`, determinant convergence, RH, or a Lambda bound.
The project state remains `P0_INVALIDATED`.

## 1. Frozen inputs

The following repository bytes are binding inputs.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_ODD_LAPLACE_EULER_RESOLVENT_MIXED_EDGE_ALIAS_REDUCTION_THEOREM.md` | `289cc268263df97c0b778dc81cc982023a2793675dcb10c1b225ef42e965a467` |
| `tests/test_growing_transition_odd_laplace_euler_resolvent_mixed_edge_alias_reduction_theorem.py` | `395f53fcd03dc26b8951cd8b1b208b811ae1479c90ad4b15d841c825bad93f05` |
| `notes/GROWING_TRANSITION_ONE_SIDED_ODD_LAPLACE_ROW_AND_FORWARD_ALIAS_THEOREM.md` | `0edbe7253f6164399d468517bc9cbb9c8d9317250ac7dcc526eca9a8e15e7d3b` |
| `tests/test_growing_transition_one_sided_odd_laplace_row_and_forward_alias_theorem.py` | `97215866f7cf3a6969a7ec92d81e722a6e376034e95d58ff1e759b3780fcc79f` |
| `notes/GROWING_TRANSITION_CURVED_TWO_ENDPOINT_FIO_SHELL_THEOREM.md` | `ddb1769d6e6f2b3214cb8191d631a161a1312f18c5bfbba4ca2ad11bb9f93341` |
| `tests/test_growing_transition_curved_two_endpoint_fio_shell_theorem.py` | `8d6bf688ffc938691789a558900ac95467a6631203f5fd262a5f4356431422cb` |
| `notes/GROWING_TRANSITION_TWO_CLUSTER_MODAL_PLACEMENT_LEAKAGE_NORMALIZATION_THEOREM.md` | `7859533dd83b94708ee73658e6b6c94eb78418a333082c875f0629b244efe564` |
| `tests/test_growing_transition_two_cluster_modal_placement_leakage_normalization_theorem.py` | `caef856880cbc01e95b45209a5dc1a41d669c43a9f868552e6b7d33fd2e0cc8c` |
| `notes/GROWING_TRANSITION_POLYLOG_BASE_CONTINUOUS_PRIME_SHELL_COROLLARY.md` | `326d4d19a4c7bf93e920f2af1438fb0aba7dc797091bf0957abf9149bca018e1` |
| `tests/test_growing_transition_polylog_base_continuous_prime_shell_corollary.py` | `de07ecbac9c7404edc2508b54d3aa25a15f2d8f102b86199119af65ef9e6a2a7` |
| `notes/GROWING_TRANSITION_ODD_LAPLACE_MIDDLE_BAND_ALIAS_FRAME_OBSTRUCTION_THEOREM.md` | `6863fd558c13b52255a5bca67c2bb91aae4cd75b82180835a37e178546f70956` |
| `tests/test_growing_transition_odd_laplace_middle_band_alias_frame_obstruction_theorem.py` | `7c0c1a4abaa5768291ca6e7bfc9ca01915e6e8f78ada3f4071ac490a83c59a5a` |
| `notes/GROWING_TRANSITION_SAMPLING_THEOREM.md` | `551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72` |
| `tests/test_growing_transition_sampling.py` | `ba9ee58e36bc79a602d70a791010a93eb75a5613b0509a0cdc7b11b810a403ac` |

The mixed-edge reduction supplies the exact Euler and ordered-Poisson
representatives.  The one-sided theorem supplies the forward block and
the `B^1,B^+` row estimates.  The curved theorem supplies the uniform
regular-state and allowed-carrier bounds used below.  Modal placement
supplies the exact defect normalization on both schedules; the polylog
corollary records uniformity as the common base becomes sublinear.  The
middle-band theorem supplies `T_L`, the explicit constant `c'_m`, `P_E`,
and the local negative inequality.  No external source, zero table, prime
estimate, or numerical
prolate data is used here.

## 2. Exact compact/exterior split of the higher inward row

Fix an arbitrary `gamma in G_L`.  To avoid overloaded subscripts, write
`alpha=gamma` throughout Sections 2--5.  The proof constants are uniform
because every selected node is positive and
`gamma<=gamma_max<=D*L` for one fixed `D`.  Let `h_alpha` be the
endpoint-normalized selected mode and let `H_alpha` be its additive
Fourier transform.  On the compact interval,

\[
 H_\alpha(u)=\chi_\alpha h_\alpha(u),\qquad |u|\leq\lambda,
                                                               \tag{2.1}
\]

and use the edge coordinates

\[
 h_\alpha(\lambda(1-U/c))=e_\alpha p_\alpha(U),\qquad
 H_\alpha(\lambda(1+V/c))=\chi_\alpha e_\alpha q_\alpha(V).
                                                               \tag{2.2}
\]

For `2<=r<=A`, the compact part of the `r`-th ordered slot is

\[
 F_{r,z,\alpha}=r^{-z}{\sqrt\lambda z_\alpha\over2c}
 \int_0^{c-2\pi r}p_\alpha(U)(1-U/c)^{z-1}\,dU.     \tag{2.3}
\]

Indeed `U=c(1-r e^{-s})`; the exact Jacobian changes the power `z` to
`z-1`.  The compact source and its finite Fourier transform coincide up
to `chi_alpha`, so their paired contribution is

\[
 (1+\chi_\alpha)\sum_{2\leq r\leq A}F_{r,z,\alpha}. \tag{2.4}
\]

For the exterior part put `x=1+V/c`.  The change
`r e^{-s}=x` gives, after the prescribed ordered limit,

\[
 E_{z,\alpha}={\sqrt\lambda\chi_\alpha z_\alpha\over2c}
 \int_0^\infty q_\alpha(V)G_{A,z}(1+V/c)\,dV,       \tag{2.5}
\]

where, almost everywhere,

\[
 G_{A,z}(x)=x^{z-1}
 \sum_{\substack{x\leq r\leq Ax\\r\geq2}}r^{-z}.
                                                               \tag{2.6}
\]

At an integral lower endpoint, including or excluding `r=x` changes
only a measure-zero value in (2.5).  We use the right-continuous Euler
representative below because it records the corresponding Stieltjes atom
unambiguously.

The exact higher-inward row is therefore

\[
\boxed{
 \widehat{\mathcal A}^{+}_{z,\alpha}
 =(1+\chi_\alpha)\sum_{2\leq r\leq A}F_{r,z,\alpha}
  +E_{z,\alpha}.}                                   \tag{2.7}
\]

Euler summation gives the exact almost-everywhere identity

\[
\boxed{
 G_{A,z}(x)={1-A^{1-z}\over z-1}
 +{R_z(x)\over x}-{A^{-z}R_z(Ax)\over x}.}          \tag{2.8}
\]

Thus (0.8) is precisely the remaining curved/hard part of the physical
row, not a different deterministic alias representative.

## 3. Unit-interval structure and all jump atoms

Put

\[
 r_z(X)={R_z(X)\over X}.                             \tag{3.1}
\]

For `n<=X<n+1`, the right-continuous Euler formula gives

\[
\boxed{
 r_z(X)=C_{n,z}X^{z-1}-{1\over z-1},\qquad
 C_{n,z}=\sum_{m\geq n+1}m^{-z}>0.}                 \tag{3.2}
\]

Consequently `r_z` is increasing on every open unit interval.  Directly
from (0.6),

\[
 |R_z(X)|\leq {1\over2}
 +zX^z\int_X^\infty {1\over2}t^{-z-1}\,dt\leq1,   \tag{3.3}
\]

so

\[
 |r_z(X)|\leq X^{-1},\qquad
 \operatorname {Var}_{[n,n+1)}r_z\leq{2\over n}.   \tag{3.4}
\]

At every integer `n>=2`, the right-continuous `B_1` has jump `-1` and
the integral in (0.6) is continuous.  Hence

\[
 \Delta R_z(n)=-1,\qquad \Delta r_z(n)=-{1\over n}. \tag{3.5}
\]

These atoms, rather than a fictitious smooth derivative bound containing
a factor `z`, are the useful exact variation inventory.

Choose a fixed `0<delta<1/2` and a fixed power

\[
 R=L^P,\qquad 64(1+\gamma_{\max})\leq R\leq c^{1/2-\delta}.
                                                               \tag{3.6}
\]

with `P` sufficiently large.  This is possible on both schedules.  Put

\[
 x_R=1+R/c,\qquad
 W(x)={1\over\sqrt c\sqrt{x^2-1}}
 ={1\over\sqrt{a_+(c(x-1))}}.                       \tag{3.7}
\]

On the partial first interval `[x_R,2)`, product variation and (3.4)
give

\[
 \operatorname {Var}_{[x_R,2)}(r_zW)
 +|r_z(x_R)W(x_R)|\leq {C\over\sqrt R}.             \tag{3.8}
\]

For every later interval, including its right-continuous atom,

\[
 \operatorname {Var}_{[n,n+1)}(r_zW)
 +|\Delta(r_zW)(n)|
 \leq {CW(n)\over n}
 \leq {C\over\sqrt c\,n\sqrt{n^2-1}}.             \tag{3.9}
\]

Summation proves

\[
 |r_z(x_R)W(x_R)|+
 \operatorname {Var}_{[R,\infty)}
 \{r_z(1+V/c)a_+(V)^{-1/2}\}
 \leq C\{R^{-1/2}+c^{-1/2}\}.                     \tag{3.10}
\]

For the scaled hard term set `y=Ax`.  Its weight is

\[
 W_A(y)=W(y/A)
 ={\sqrt A\over\sqrt{2\pi}\sqrt{y^2-A^2}}.        \tag{3.11}
\]

For `A<n<=2A`, `W_A(n)<=C(n-A)^(-1/2)`, while for
`n>=2A`, `W_A(n)<=C sqrt(A)/n`.  Therefore

\[
 \sum_{n>A}{W_A(n)\over n}\leq {C\over\sqrt A}.   \tag{3.12}
\]

Applying (3.4)--(3.5) on every `y`-interval gives

\[
\boxed{
 \left|A^{1-z}r_z(Ax_R)W(x_R)\right|+
 \operatorname {Var}_{[R,\infty)}
 \{A^{1-z}r_z(A(1+V/c))a_+(V)^{-1/2}\}
 \leq CA^{1/2-z}.}                                 \tag{3.13}
\]

In (3.13) the atoms are exactly at `V=2*pi*(n-A)` and have signed size
`-A^(1-z)/n` before multiplication by the half-density.  This is the
explicit hard-endpoint audit.

## 4. Curved carrier integration and the scalar bound

On `V>=R`, put

\[
 Q_\alpha(V)=\sqrt{a_+(V)}q_\alpha(V),\qquad
 \Omega_+^2(V)=1+{\alpha\over a_+(V)}+{1\over a_+(V)^2}.
                                                               \tag{4.1}
\]

The frozen allowed-carrier theorem gives

\[
 Q_\alpha=B_+e^{i\phi}+B_-e^{-i\phi},\qquad
 \phi'=\Omega_+\geq1,                               \tag{4.2}
\]

and

\[
 \sup(|B_+|+|B_-|)+\operatorname {Var}B_+
 +\operatorname {Var}B_-\leq L^{K_3}.              \tag{4.3}
\]

Also `1/Omega_+` has bounded variation.  If `H` is any right-continuous
BV function tending to zero, Stieltjes integration by parts gives

\[
 \begin{aligned}
 \int_R^T B_\pm H e^{\pm i\phi}\,dV
 &=\left[{B_\pm H\over\pm i\Omega_+}e^{\pm i\phi}\right]_R^T
   -\int_R^T e^{\pm i\phi}\,
       d\left({B_\pm H\over\pm i\Omega_+}\right),\\
 \left|\int_R^\infty B_\pm H e^{\pm i\phi}\,dV\right|
 &\leq L^{K_3}\{|H(R)|+\operatorname {Var}H\}.
 \end{aligned}                                      \tag{4.4}
\]

The Stieltjes differential in (4.4) includes every atom of `H`.
Apply it with

\[
 H(V)={r_z(1+V/c)-A^{1-z}r_z(A(1+V/c))
             \over\sqrt{a_+(V)}}.                  \tag{4.5}
\]

Equations (3.10) and (3.13) yield

\[
 \left|\int_R^\infty q_\alpha(V)
 \{r_z(1+V/c)-A^{1-z}r_z(A(1+V/c))\}\,dV\right|
 \leq L^{K_3}\{R^{-1/2}+c^{-1/2}+A^{1/2-z}\}.     \tag{4.6}
\]

On `[0,R]`, the regular normal-state estimate gives

\[
 |q_\alpha(V)|\leq
 \begin{cases}
 L^{K_4},&0\leq V\leq1,\\
 L^{K_4}V^{-1/2},&1\leq V\leq R.
 \end{cases}                                       \tag{4.7}
\]

Since `|r_z(x)|<=1/x`, the first resolvent costs at most
`L^(K_4)*sqrt(R)`.  The scaled hard term is bounded separately by

\[
 L^{K_4}\{A^{-z}\sqrt R+A^{1/2-z}\}.               \tag{4.8}
\]

The power `R=L^P` is fixed, so (4.6)--(4.8) prove (0.8).  The constant
Euler term in (2.8) is also harmless:

\[
 \left|{1-A^{1-z}\over z-1}
       \int_0^\infty q_\alpha(V)\,dV\right|
 \leq {L^{K_5}\over z}.                            \tag{4.9}
\]

For (4.9), use (4.7) on `[0,R]` and (4.4) with
`H=a_+^(-1/2)` on the tail.  Thus no absolute-integrability assertion
for the full outward Weber carrier is being made.

## 5. Exact white normalization and the compact row

The exact modal mass formula is

\[
 (\chi_\alpha z_\alpha)^2
 ={\pi c\over2\lambda J_\alpha}\{1+o(1)\},
 \qquad J_\alpha\asymp L.                           \tag{5.1}
\]

The realized modal theorem also gives

\[
 \inf_{\gamma\in\mathcal G_L}\chi_\gamma\geq\chi_*>0.       \tag{5.1a}
\]

Thus (5.1) controls both
`chi_gamma*z_gamma` and the bare endpoint quotient `z_gamma`, uniformly
over both clusters.

Therefore the exterior coefficient in (2.5) is

\[
 {\sqrt\lambda\chi_\alpha z_\alpha\over2c}
 ={\sqrt\pi\over2\sqrt{2cJ_\alpha}}\{1+o(1)\}.  \tag{5.2}
\]

Equations (2.8), (0.8), and (4.9) prove

\[
 |E_{z,\alpha}|\leq {L^{K_6}\over\sqrt{cL}}.       \tag{5.3}
\]

For (2.3), let `Y=c-2*pi*r` and split at the same `R`.  If `Y<=R`, the
regular normal-state bound gives

\[
 \int_0^Y|p_\alpha(U)|\,dU
 \leq L^{K_7}e^{h\alpha}\sqrt R.                  \tag{5.4a}
\]

Suppose instead that `Y>R`.  On `[R,Y]`, write
`P_alpha=sqrt(a_-)*p_alpha` as the sum of its two allowed carriers.  Their
sup norms and total variations are at most `L^(K_7)*e^(h*alpha)`, while
their phase derivatives are bounded away from zero.  The remaining
amplitude is

\[
 w_{z,c}(U)={(1-U/c)^{z-1}\over\sqrt{a_-(U)}}.     \tag{5.4b}
\]

Both factors in (5.4b) are positive and nonincreasing on
`[R,Y] subset [R,c)`, because `a_-(U)=2U-U^2/c` is increasing there.
Thus `w_(z,c)` is monotone and

\[
 \begin{aligned}
 w_{z,c}(R)+\operatorname {Var}_{[R,Y]}w_{z,c}
 &\leq {C\over\sqrt R},\\
 \left|\int_R^Y C_\pm(U)w_{z,c}(U)e^{\pm i\phi_-(U)}\,dU\right|
 &\leq L^{K_7}e^{h\alpha}
 \{w_{z,c}(R)+\operatorname {Var}_{[R,Y]}w_{z,c}\}
 \leq {L^{K_7}e^{h\alpha}\over\sqrt R}.
 \end{aligned}                                      \tag{5.4c}
\]

Here `P_alpha=C_+e^(i*phi_-)+C_-e^(-i*phi_-)`, and the second line is
Stieltjes integration by parts with `1/Omega_-`; both endpoint terms,
including the arbitrary upper endpoint `Y`, are retained.  The estimate
is uniform in the
arbitrary endpoint `Y`.  Combining (5.4c) with (5.4a) gives

\[
 \left|\int_0^{c-2\pi r}p_\alpha(U)(1-U/c)^{z-1}\,dU\right|
 \leq L^{K_8}e^{h\alpha}.                           \tag{5.4}
\]

This proves (5.4) for every truncation `2<=r<=A`; no endpoint term is
discarded.  Since

\[
 \sum_{r\geq2}r^{-z}\leq C2^{-z},                  \tag{5.5}
\]

the compact contribution obeys

\[
 \left|(1+\chi_\alpha)
 \sum_{2\leq r\leq A}F_{r,z,\alpha}\right|
 \leq {L^{K_9}e^{h\alpha}2^{-z}\over\sqrt{cL}}.   \tag{5.6}
\]

Equations (5.3) and (5.6), applied to the arbitrary selected node fixed
at the start of Section 2, prove

\[
 \sup_{\gamma\in\mathcal G_L}
 |\widehat{\mathcal A}^{+,{\rm modal}}_{z,\gamma}|
 \leq {L^{K_{10}}\over\sqrt{cL}}
       \{1+e^{h\gamma_{\max}}2^{-z}\}.             \tag{5.7}
\]

### 5.1 All-node local and higher-outward rows

The same arbitrary-node argument also extends the one-sided rows needed
for the full packet.  Their exact profiles are

\[
 \begin{aligned}
 \widehat{\mathcal A}^{1}_{z,\gamma}
 &= {\sqrt\lambda(1+\chi_\gamma)z_\gamma\over2c}
    \int_0^{c-2\pi}p_\gamma(U)(1-U/c)^{z-1}\,dU,\\
 \widehat{\mathcal B}^{1}_{z,\gamma}
 &= {\sqrt\lambda\chi_\gamma z_\gamma\over2c}
    \int_0^\infty q_\gamma(V)(1+V/c)^{-z}\,dV.
 \end{aligned}                                      \tag{5.8}
\]

Although the compact alias above needed only `2<=r<=A`, the proof of
(5.4) used only `1<=r<=A`; hence its arbitrary-endpoint estimate applies
to the first line with `r=1`.  For the second,
every selected `gamma` is positive, so the outward equation has no forbidden
action.  On `[0,R]`, (4.7) gives
`int_0^R |q_gamma(V)|(1+V/c)^(-z)dV<=L^K*sqrt(R)`.
On `[R,infinity)`, apply (4.4) with
`H=(1+V/c)^(-z)/sqrt(a_+(V))`; this positive decreasing weight has
`H(R)+Var(H)<=C/sqrt(R)`.  Hence the unnormalized outward integral is
polynomial uniformly in `gamma` and `z`.  The radial formula (5.1) is
uniform on both node clusters.  Therefore

\[
 \sup_{\gamma\in\mathcal G_L}
 |\widehat{\mathcal A}^{1}_{z,\gamma}|
 \leq {L^{K_{11}}e^{h\gamma_{\max}}\over\sqrt{cL}},
 \qquad
 \sup_{\gamma\in\mathcal G_L}
 |\widehat{\mathcal B}^{1}_{z,\gamma}|
 \leq {L^{K_{11}}\over\sqrt{cL}}.                 \tag{5.9}
\]

Finally, for every selected node the exact ordered higher-outward row is

\[
 \widehat{\mathcal B}^{+}_{z,\gamma}
 ={\sqrt\lambda\over2\sqrt{d_\gamma}}
 \int_0^\infty\sum_{l\geq2}H_\gamma(l\lambda e^t)
                    e^{-(z-1)t}\,dt.                \tag{5.10a}
\]

Every selected mode has label `0 mod 4`, so the frozen sampled-exterior
estimate applies modewise with no low-cluster hypothesis.  It gives, for
every `gamma in G_L` and `u>=lambda`,

\[
 \left|\sum_{l\geq2}H_\gamma(lu)\right|
 \leq {28|e_\gamma|\over\pi u}
       \left\{1+\log\left(2+{2\pi\lambda^3\over u}\right)\right\}.
                                                               \tag{5.10b}
\]

Set `u=lambda*e^t` in (5.10a).  Integration of (5.10b) costs
`C*log(c+2)/z`, and (5.1), together with the displayed lower bound for
`chi_gamma`, converts
`|z_gamma|/(pi*sqrt(lambda))` to `O(J_gamma^(-1/2))` uniformly over
both clusters.  Hence

\[
 \sup_{\gamma\in\mathcal G_L}
 |\widehat{\mathcal B}^{+}_{z,\gamma}|
 \leq {CL\over\sqrt L\,z}.                         \tag{5.10}
\]

Thus (5.7), (5.9), and (5.10) are componentwise bounds on the entire
selected node set.  If

\[
 \widehat{\boldsymbol{\mathcal A}}^{\bullet}_z
 =\left(\widehat{\mathcal A}^{\bullet}_{z,\gamma}
   \right)_{\gamma\in\mathcal G_L},\qquad
 \widehat{\boldsymbol{\mathcal B}}^{\bullet}_z
 =\left(\widehat{\mathcal B}^{\bullet}_{z,\gamma}
   \right)_{\gamma\in\mathcal G_L},                \tag{5.11}
\]

then fixed dimension promotes them to the same row-norm bounds.
No coordinate property of `P_E` is used.

## 6. Invisible-origin correction in the reverse slots

For a `D`-unit fixed-packet combination let

\[
 f=g-a_0\psi(2\lambda\,\cdot),\qquad a_0=g(0).
                                                               \tag{6.1}
\]

The frozen corrected-sampling estimate gives `|a_0|<=C sqrt(lambda)`.
The compact bump is supported in `|u|<1/(2lambda)`, whereas every inward
compact sampled argument is at least `1/lambda`.  Hence it contributes
to no compact `m>=2` slot.  Its Fourier transform is

\[
 H_{\rm bump}(y)={a_0\over2\lambda}
 \widehat\psi\left({y\over2\lambda}\right).        \tag{6.2}
\]

Schwartz decay gives the uniform lattice estimate

\[
 \sum_{r\geq2}
 \left|\widehat\psi(re^{-s}/2)\right|\leq C_\psi e^s,
 \qquad s\geq0.                                    \tag{6.3}
\]

The `D`-white physical prefactor in the higher inward Fourier slot is
`O(1)`.  Therefore

\[
\boxed{
 |\widehat{\mathcal A}^{H,+}_{z,{\rm bump}}|
 \leq C_\psi\int_0^Le^{-(z-1)s}\,ds
 \leq {C_\psi\over z}.}                            \tag{6.4}
\]

The one-sided theorem already gives `O(1/z)` for the correction in the
`A^1`, `B^1`, and `B^+` slots.  Thus a correction--correction band sum is
`O(sum z^(-2))=O(1)`, and a mixed modal--correction sum is at most a
fixed power of `L` plus
`L^K*e^(h*gamma_max)/sqrt(c)`.  Section 7 proves that this complete
bound, rather than each summand separately, is `o(T_L)`.

## 7. Band summation and strict conductor margins

For the full node set,

\[
 |I_L|=O\left({c\log L\over L}\right),\qquad
 \sum_{z\in I_L}{1\over z}=O(L),\qquad
 \sum_{z\in I_L}{2^{-z}}=O(1),\qquad
 \sum_{z\in I_L}{2^{-z}\over z}=O(1).             \tag{7.1}
\]

Use `||S(U,V)||<=2||U||||V||`, fixed dimension, and the all-node bounds
(5.7), (5.9), and (5.10).  Before the separately treated bump, they give
the three full-packet estimates

\[
 \begin{aligned}
 \left\|\sum_{z\in I_L}
 \mathsf S(\widehat{\boldsymbol{\mathcal A}}^{1}_z,
            \widehat{\boldsymbol{\mathcal B}}^{+}_z)\right\|
 &\leq {L^{K_{12}}e^{h\gamma_{\max}}\over\sqrt c},\\
 \left\|\sum_{z\in I_L}
 \mathsf S(\widehat{\boldsymbol{\mathcal A}}^{+}_z,
            \widehat{\boldsymbol{\mathcal B}}^{1}_z)\right\|
 &\leq L^{K_{12}}\left\{1+{e^{h\gamma_{\max}}\over c}\right\},\\
 \left\|\sum_{z\in I_L}
 \mathsf S(\widehat{\boldsymbol{\mathcal A}}^{+}_z,
            \widehat{\boldsymbol{\mathcal B}}^{+}_z)\right\|
 &\leq L^{K_{12}}\left\{1+{e^{h\gamma_{\max}}\over\sqrt c}\right\}.
 \end{aligned}                                      \tag{7.2}
\]

Every row in (7.2) runs over `G_L`; its matrix therefore includes the
high--low and low--high blocks and both high--high and low--low blocks.
Section 6 changes the safe common right side only to

\[
 L^{K_{13}}\left\{1+{e^{h\gamma_{\max}}\over\sqrt c}\right\}.
                                                               \tag{7.3}
\]

On either schedule `gamma_max=alpha_max=CL+beta_max+O(1)`.  Dividing
the conductor term in (7.3) by `T_L` leaves, up to fixed powers of `L`,

\[
 {e^{h\beta_{\max}}\over\sqrt c}.                  \tag{7.4}
\]

In the fixed-linear region, (0.3F) implies

\[
 hA_1<{1\over5}<{1\over2}.                          \tag{7.4F}
\]

Thus (7.4) tends to zero.  In the polylogarithmic region,
`beta_max=o(L)`, so it is `c^(-1/2+o(1))`.  A fixed power of `L` is also
`o(T_L)` because `hC>0`.  This proves (0.10)--(0.12) for the full packet,
without any coordinate assumption on `P_E`.

The exact alias identity is

\[
 \widehat R_{\rm alias}^{I_L}
 =\sum_{z\in I_L}\left\{
 \mathsf S(\widehat{\boldsymbol{\mathcal A}}^1_z,
            \widehat{\boldsymbol{\mathcal B}}^+_z)
 +\mathsf S(\widehat{\boldsymbol{\mathcal A}}^+_z,
            \widehat{\boldsymbol{\mathcal B}}^1_z)
 +\mathsf S(\widehat{\boldsymbol{\mathcal A}}^+_z,
            \widehat{\boldsymbol{\mathcal B}}^+_z)\right\}.    \tag{7.5}
\]

Thus (0.13) follows before compression.  Finally the frozen local theorem
gives one fixed `c'_m>0` such that

\[
 \widehat Q_{\rm full}^{I_L}
 =\widehat Q_{\rm loc}^{I_L}+\widehat R_{\rm alias}^{I_L},
 \qquad
 P_E\widehat Q_{\rm loc}^{I_L}P_E\preceq-c'_mT_LP_E. \tag{7.6}
\]

Since `||P_E R P_E||<=||R||=o(T_L)`, (0.15) follows for all sufficiently
large locked `lambda`.

## 8. Sharp remaining boundary

This theorem resolves the magnitude of the reverse mixed and complete
`(+,+)` alias blocks only for the ordered physical odd-Laplace band
`I_L` and the two admitted fixed-dimensional schedules.  It does not
exchange a growing-`lambda` limit with the ordered Poisson limit, and it
makes no estimate uniform in a finite Fejer cutoff.

Most importantly, a negative completed middle band is not by itself the
complete central form.  Rows outside `I_L` and the other central-form
components can still contribute at the same or larger scale until they
are separately assembled and bounded.  No claim beyond (0.15) is made.
