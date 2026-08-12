# Growing-transition polylog-base continuous and prime-shell corollary

## 0. Result and exact scope

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 A=\lambda^2,\qquad c=2\pi A,\qquad L=\log A,
 \qquad h={\pi\over4}.                               \tag{0.1}
\]

Fix `C,epsilon,theta` with

\[
 \boxed{0<hC<1,\qquad \epsilon>0,\qquad
 0<\theta<\min\left\{{1\over2},1-hC\right\}.}       \tag{0.2}
\]

Put

\[
 B_L=(\log L)^4.                                     \tag{0.3}
\]

Let `a_1,...,a_m` and `b_1,...,b_m` be two fixed sets of distinct real
numbers.  Impose the positive lower-offset margin

\[
 \boxed{b_*:=\min_j b_j>0.}                          \tag{0.4}
\]

For arbitrary fixed perturbations

\[
 a_i(L)=a_i+O(L^{-1}),\qquad b_j(L)=b_j+O(L^{-1}),  \tag{0.5}
\]

define the analytic parameter nodes

\[
 \alpha_i=CL+B_L+a_i(L),\qquad
 \beta_j=B_L+b_j(L).                                \tag{0.6}
\]

The constants in the two `O(L^-1)` terms are fixed and uniform in the
finite node sets.  Hence, for all sufficiently large `L`,

\[
 \beta_j\geq B_L+{b_*\over2}\geq B_L.               \tag{0.7}
\]

This last inequality is needed to use the frozen subcritical radial-mass
theorem.  It is not replaced by a merely formal statement that an
`O(L^-1)` placement error is small.

Let `mathcal C_c` be the conormal continuous `m=l=1` kernel of the frozen
continuous theorem.  Uniformly on the high--low block, for every fixed
`M`,

\[
 \boxed{
 \mathcal C_c(\alpha_i,\beta_j)
 ={2\{e^{h(\alpha_i-\beta_j)}-1\}
       \over\alpha_i-\beta_j}
 +o\left({e^{hCL}\over L^M}\right).}                \tag{0.8}
\]

The pole and Archimedean-regular continuous pieces are negligible on the
same scale.  The Hermitian continuous matrix on the two analytic clusters
therefore has at least `m` eigenvalues at most

\[
 \boxed{-c_m{e^{hCL}\over L^{2m-1}}}                 \tag{0.9}
\]

in endpoint-normalized raw coordinates.  In those same coordinates the
complete curved `m=l=1` prime shell, including the `n>A` tail, obeys

\[
 \boxed{
 \|\mathsf P^{11}_{\rm raw}\|_{
      \{\alpha_i\}\cup\{\beta_j\}}
 =o\left({e^{hCL}\over L^{2m-1}}\right).}           \tag{0.10}
\]

The exact radial theorem unconditionally gives a `Theta(L^-1)` pair
scalar for the analytically normalized Fourier tail.  If a node is later
realized by a modal row, this scalar is its defect-whitened
**Fourier-tail endpoint** `chi_gamma e_gamma/sqrt(d_gamma)`.  It is not the
bare endpoint quotient `e_gamma/sqrt(d_gamma)` without leakage
information.  Accordingly, if a separate modal realization satisfies the
explicit gate

\[
 \boxed{
 \mathsf G_\chi:\quad
 \min_{\gamma\in\{\alpha_i\}\cup\{\beta_j\}}\chi_\gamma
 \geq\chi_*>0,}                                    \tag{0.11}
\]

then, and only then in this note, the exact physical exterior-defect-white
prefactors are uniformly `Theta(L^-1)`.  Under this conditional gate the
continuous negative scale and the prime bound become

\[
 \boxed{-c'_m{e^{hCL}\over L^{2m}},\qquad
 \|\mathsf P^{11}_{\rm white}\|
 =o\left({e^{hCL}\over L^{2m}}\right).}             \tag{0.12}
\]

The statement is deliberately analytic and fail-closed.  It does **not**
prove modal placement, a lower bound for actual leakage factors, any
`m>=2` or `l>=2` sampler, a source congruence, finite-Fejer assembly, the
full central matrix, a central-floor counterexample, a determinant
conclusion, or RH.  In particular, neither (0.11) nor a modal realization
is proved here.  The unconditional conclusions are exactly (0.8)--(0.10),
not the conditional statement (0.12).
The project state remains `P0_INVALIDATED`.

## 1. Frozen inputs

The result uses exactly the following frozen bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_CONTINUOUS_M11_TWO_CLUSTER_UNCONDITIONAL_NARROW_SCHEDULE_THEOREM.md` | `6e0678b8d0d762b79402ad0f6947ddcfa8b830c251b333f58c9fe5ea7ebe7a5c` |
| `tests/test_growing_transition_continuous_m11_unconditional_narrow_schedule.py` | `626dc9f12cf7a4b58246e12f1b008d72bf9bb0e60713a0a10f6b5dda2e66eb34` |
| `notes/GROWING_TRANSITION_CURVED_TWO_ENDPOINT_FIO_SHELL_THEOREM.md` | `ddb1769d6e6f2b3214cb8191d631a161a1312f18c5bfbba4ca2ad11bb9f93341` |
| `tests/test_growing_transition_curved_two_endpoint_fio_shell_theorem.py` | `8d6bf688ffc938691789a558900ac95467a6631203f5fd262a5f4356431422cb` |
| `notes/GROWING_TRANSITION_SUBCRITICAL_LG_ACTION_BV_THEOREM.md` | `1cae15a8c72f0505384daea94760fcb05c466f897224ab83c54e7c41f045e99c` |
| `tests/test_growing_transition_subcritical_lg_action_bv_theorem.py` | `a34689e3741cc7e09020a009bf4b120c11ace44489fbcdd1c0cc3a3b7d5cfc92` |
| `notes/GROWING_TRANSITION_EDGE_CARLEMAN_SCATTERING_OBSTRUCTION.md` | `1edd9639d69980f2a8662b0d0fab0b8fdfb49f853b4599c9a945092358c6018d` |
| `tests/test_growing_transition_edge_carleman_scattering_obstruction.py` | `b3420f2f94f2082b68efbdb2e1c5144abdbdeb35619354f15a72c6b75131d9fb` |

The first frozen theorem proves the unconditional continuous estimate on
a fixed linear-base region.  The second proves the curved two-endpoint
prime shell on the same kind of region.  Their theorem statements allow
constants to depend on that fixed base.  Consequently this corollary is
not obtained by simply inserting `A_1=B_L/L`.  Section 2 audits the proof
constants before making that rescaling.  The third frozen theorem is
needed because the radial-mass sentence in the first theorem was stated
only for parameters `Theta(L)`, whereas the low nodes here are `o(L)`.
The last frozen pair supplies the exact identities
`H_gamma(lambda)=chi_gamma e_gamma` and `d_gamma=1-chi_gamma^2`.

The repaired frozen continuous theorem records that the radial mass
controls `chi_gamma z_gamma`, not bare
`z_gamma=e_gamma/sqrt(d_gamma)`.  Section 5 extends that corrected formula
to the polylogarithmic low edge.  Dropping `chi_gamma` would silently
assume precisely the leakage gate that this corollary does not prove.

## 2. Uniformity as the linear base tends to zero

Formally set

\[
 A_1(L)={B_L\over L}\longrightarrow0.               \tag{2.1}
\]

Every proof constant in the two analytic packages remains uniform along
this path for the following concrete reasons.

1.  Both local curved-to-flat lemmas are stated for
    `|gamma|<=D L`, with constants depending only on fixed `D,delta`.
    Choose once and for all

    \[
     D>C+2,
    \]

    and choose the fixed positive cutoff margin

    \[
     \delta_*={1-2\theta\over4}>0.
    \]

    Both cutoffs below are at most `c^(1/2-delta_*)` eventually.  All
    parameters in (0.6) then lie in that one fixed box.  Neither local
    lemma contains `A_1^-1`.

2.  The Kummer transfer, origin logarithm, two turning zones, Tricomi
    initialization, allowed-carrier variation, conormal Hardy--Krause
    estimate, pole separation, and Archimedean small- and large-`r`
    estimates have constants depending only on `D,delta` or absolute
    constants.  Parameter growth enters only through a fixed power of
    `L`.  Since `B_L<=L` eventually, every polynomial in `B_L` is already
    covered by such a power.

3.  The shell geometry, the two exact endpoint half-densities, the
    four-carrier gap, the fractional-part bound for `A`, and both prime
    tail sums are independent of `A_1`.  The outward profile has positive
    parameter on all nodes here, so it has no turning point and its carrier
    constants are uniform.

4.  The only uses of a positive fixed `A_1` in the two proofs are the
    choices of cutoff and the absorption of displayed conductor powers.
    Sections 3--5 replace those absorptions explicitly.  Their strict
    margin is now `1-hC>0`, together with the two strict inequalities for
    `theta` in (0.2).

5.  The Cauchy inverse uses only the fixed limiting gaps among the `a_i`
    and among the `b_j`.  These gaps stay uniformly positive under (0.5).
    It has no dependence on the common base `B_L`.

Thus no constant from either frozen proof diverges as `A_1(L)` tends to
zero.  This uniformity audit is the reason the rescope is valid.

## 3. The two cutoffs

Put

\[
 r=2h+\epsilon={\pi\over2}+\epsilon.                \tag{3.1}
\]

For a low node `gamma=B_L+O(1)`, use

\[
 \boxed{R_\gamma=e^{r\gamma}
 =\exp\{(2h+\epsilon)B_L+O(1)\}=c^{o(1)}.}           \tag{3.2}
\]

For same-cluster comparisons use

\[
 \boxed{R_H=c^\theta.}                               \tag{3.3}
\]

Uniformly over the finite node sets, for every fixed `M`,

\[
 L^M=o(R_\gamma),\qquad
 64(1+\alpha_i+\beta_j)=o(R_\gamma),\qquad
 R_\gamma<c^{1/4}.                                  \tag{3.4}
\]

Also

\[
 64(1+\alpha_i+\alpha_j+\beta_i+\beta_j)=o(R_H),
 \qquad R_H\leq c^{1/2-\delta_*}.                   \tag{3.5}
\]

The two Green absorption factors in the worst, high-parameter case are

\[
\begin{aligned}
 L^K e^{h\alpha_i}{LR_\gamma+\log(2+R_\gamma)\over c}
  &=c^{-(1-hC)+o(1)},\\
 L^K e^{h\alpha_i}{LR_H+\log(2+R_H)\over c}
  &=c^{-(1-hC-\theta)+o(1)}.
\end{aligned}                                       \tag{3.6}
\]

Both tend to zero by (0.2).  Hence the local Green lemmas apply with the
fixed constants chosen in Section 2.

## 4. Complete continuous error ledger

For a forward high--low pair put

\[
 P_{ij}={e^{h(\alpha_i-\beta_j)}\over\alpha_i-\beta_j}
 \asymp {e^{hCL}\over L}.                            \tag{4.1}
\]

Use `R=R_(beta_j)` in the forward comparison.  The frozen continuous
proof gives the three conormal errors

\[
\begin{aligned}
 E_{\rm loc}&=L^K e^{2h\alpha_i}{R^{3/2}\over c},\\
 E_{R^{-1}}&=L^K {e^{h\alpha_i}\over R},\\
 E_{\sqrt R}&=L^K e^{h\alpha_i}\sqrt{R\over c}.
\end{aligned}                                       \tag{4.2}
\]

Their exact normalized rates are

\[
\begin{aligned}
 {E_{\rm loc}\over P_{ij}}
 &=L^{K+1}c^{-(1-hC)}
   \exp\left\{\left(5h+{3\epsilon\over2}\right)B_L+O(1)\right\}
   =c^{-(1-hC)+o(1)},\\
 {E_{R^{-1}}\over P_{ij}}
 &=L^{K+1}\exp\{-(h+\epsilon)B_L+O(1)\}
   =o(L^{-M})\quad\hbox{for every fixed }M,\\
 {E_{\sqrt R}\over P_{ij}}
 &=L^{K+1}c^{-1/2}
   \exp\left\{\left(2h+{\epsilon\over2}\right)B_L+O(1)\right\}
   =c^{-1/2+o(1)}.
\end{aligned}                                       \tag{4.3}
\]

The pole and Archimedean-regular proof supplies, before the final inward
carrier pairing, only the component scales

\[
 c^{-1/2},\quad c^{-1},\quad {1\over L\sqrt{cR}},
 \quad {1\over L}\sqrt{R\over c},
 \quad {e^{h\alpha_i}\over c}.                     \tag{4.4}
\]

Pairing with the inward carrier costs at most `L^K e^(h alpha_i)`.
After division by (4.1), every resulting term is either
`c^(-1/2+o(1))`, `c^(-1+hC+o(1))`, or smaller.  Thus all the smooth
pieces are `o(P_ij L^-M)` for every fixed `M`.

For the reverse cross entry, use the low inward parameter in (3.2).
The flat reverse kernel is `O(L^-1)`.  Its local two-envelope error,
after division by (4.1), is

\[
 L^{K+1}{e^{2hB_L}R^{3/2}\over c}
 {1\over e^{hCL}}
 =c^{-(1+hC)+o(1)},                                  \tag{4.5}
\]

and the two signed tails are `c^(-hC+o(1))` or smaller.  Hence the reverse
entry is negligible on the forward cross scale.

It remains to control both diagonal cluster blocks.  Let

\[
 S_L={e^{hCL}\over L^{2m-1}}.                        \tag{4.6}
\]

With `R_H=c^theta`, the worst high--high conormal error ratios are

\[
\begin{aligned}
 {L^Ke^{2h\alpha_i}R_H/c\over S_L}
   &=c^{hC+\theta-1+o(1)},\\
 {L^Ke^{h\alpha_i}/R_H\over S_L}
   &=c^{-\theta+o(1)},\\
 {L^Ke^{h\alpha_i}\sqrt{R_H/c}\over S_L}
   &=c^{(\theta-1)/2+o(1)}.
\end{aligned}                                       \tag{4.7}
\]

They tend to zero by (0.2).  The low--low rates are smaller.  The flat
same-cluster blocks are `O(1)`, and the smooth curved pieces obey the same
or stronger powers.  Therefore both diagonal blocks are `o(S_L)`.

Finally, with

\[
 \Delta_{ij}=CL+a_i(L)-b_j(L),                       \tag{4.8}
\]

the flat Hermitian cross block is

\[
 {2\sinh(h\Delta_{ij})\over\Delta_{ij}}
 =e^{hCL}\operatorname {diag}(e^{ha_i(L)})
 \left({1\over CL+a_i(L)-b_j(L)}\right)_{ij}
 \operatorname {diag}(e^{-hb_j(L)})
 +O(e^{-hCL}/L).                                    \tag{4.9}
\]

The exact Cauchy inverse on the actual nodes in (0.5) gives smallest
singular value at least `c_m e^(hCL)/L^(2m-1)`.  Equations
(4.3)--(4.7) are `o(1)` relative errors at that scale.  Weyl's inequality
then proves (0.9).

## 5. Radial exterior-defect whitening

For every parameter `gamma` in (0.6), set

\[
 r_\gamma^2={\gamma\over c},\qquad J_\gamma=J(r_\gamma). \tag{5.1}
\]

The positive margin (0.7) places every node in the uniform range
`gamma>=alpha_0=B_L` of the frozen subcritical radial theorem.  Let
`mathcal N_(r_gamma)` be its endpoint-normalized one-tail mass and define
the analytic radial scalar

\[
 \widehat z_\gamma^{\rm rad}
 ={1\over\sqrt{2\lambda\mathcal N_{r_\gamma}}}.    \tag{5.2}
\]

The radial theorem gives

\[
 (\widehat z_\gamma^{\rm rad})^2
 ={\pi c\over2\lambda J_\gamma}
 \left\{1+O\left({\log(2+\gamma)\over\gamma}\right)\right\},
 \qquad
 J_\gamma\asymp1+\log{1\over r_\gamma}\asymp L.   \tag{5.3}
\]

The error in (5.3) is `o(1)` even at the low edge because
`log(2+B_L)/B_L=o(1)`.  Consequently, uniformly for every pair of nodes,

\[
 \boxed{
 {\lambda\over4c}\widehat z_\gamma^{\rm rad}
       \widehat z_{\gamma'}^{\rm rad}
 ={\pi\over8\sqrt{J_\gamma J_{\gamma'}}}\{1+o(1)\}
 =\Theta(L^{-1}).}                                  \tag{5.4}
\]

If an actual modal row realizes `gamma`, attach that row's endpoint sign
to `widehat z_gamma^(rad)`.  Then

\[
 H_\gamma(\lambda)=\chi_\gamma e_\gamma,qquad
 d_\gamma=1-\chi_\gamma^2,qquad
 z_\gamma={e_\gamma\over\sqrt{d_\gamma}},qquad
 {H_\gamma(\lambda)\over\sqrt{d_\gamma}}
 =\chi_\gamma z_\gamma
 =\widehat z_\gamma^{\rm rad},                     \tag{5.5}
\]

exactly; the collection of endpoint signs is only a diagonal congruence.
Therefore the exact oriented physical continuous prefactor is

\[
\begin{aligned}
 {\lambda\over4c}z_\alpha z_\beta
 (1+\chi_\alpha)\chi_\beta
 &={\lambda\over4c}
 \widehat z_\alpha^{\rm rad}\widehat z_\beta^{\rm rad}
 {1+\chi_\alpha\over\chi_\alpha}.
\end{aligned}                                       \tag{5.6}
\]

The surviving factor `(1+chi_alpha)/chi_alpha` is not bounded above by
the radial theorem.  Thus (5.4) alone does not rescale (0.9), and it does
not prove a physical white negative packet.  Under the separate gate
`mathsf G_chi` in (0.11), that factor and its reverse-orientation analogue
are bounded above and below, while the diagonal factors in (5.4) have
bounded condition number.  Only under that gate does the usual fixed
dimensional cross-block argument divide (0.9) by `Theta(L)` and give the
conditional continuous scale in (0.12).

## 6. Pre-absorption shell estimate

The shell proof before its fixed-linear-base absorption gives the
following uniform estimate for positive `alpha,beta=O(L)`.  Let `T`
satisfy

\[
 64(1+\alpha+\beta)\leq T<c^{1/2},\qquad
 L^Ke^{h\alpha}{LT+\log(2+T)\over c}=o(1).          \tag{6.1}
\]

Then, for `2<=n<A`,

\[
\begin{aligned}
 |I_n(\alpha,\beta)|
 \leq L^Kc^{-1/2}\Bigg[&
 \left\{e^{h(\alpha-\beta)}
       +e^{h\alpha}T^{-1/2}
       +L^Ke^{2h\alpha}{T^{3/2}\over c}\right\}
       {n\over n^2-1}\\
 &+\left\{1+T^{-1/2}+L^K{T^{3/2}\over c}\right\}
       {1\over n^2-1}\Bigg].
\end{aligned}                                       \tag{6.2}
\]

This is exactly the sum of the two flat endpoint principals and the four
terms in the frozen shell error formula.  The endpoint-freezing factor
`LT/c` is included in (6.2), because
`LT/c<=T^(-1/2)` under the cutoffs used below.  No finite-`c` complete
subunit transform is being assumed.

For cross-cluster entries choose `T=R_gamma`, where `gamma` is the low
parameter in that entry.  For same-cluster entries choose `T=R_H`.
Equations (3.4)--(3.6) verify (6.1) in every case.

For a high--low entry, the two nonprincipal terms in the first brace,
relative to `e^(h(alpha-beta))`, are

\[
 \exp\{-\epsilon B_L/2+O(1)\},\qquad
 c^{-(1-hC)+o(1)},                                  \tag{6.3}
\]

respectively.  For the reverse low--high entry the first brace is
`o(1)`, because its flat exponential and both errors tend to zero.  On a
high--high entry with `T=R_H`, the three possible sizes in
the first brace are

\[
 1,\qquad c^{hC-\theta/2+o(1)},\qquad
 c^{2hC+3\theta/2-1+o(1)}.                          \tag{6.4}
\]

On a low--low entry they are

\[
 1,\qquad c^{-\theta/2+o(1)},\qquad
 c^{3\theta/2-1+o(1)}.                              \tag{6.5}
\]

## 7. Complete `m=l=1` prime suppression

Chebyshev partial summation gives

\[
 \sum_{2\leq n<A}{\Lambda(n)n\over n^2-1}=O(L),
 \qquad
 \sum_{2\leq n<A}{\Lambda(n)\over n^2-1}=O(1).     \tag{7.1}
\]

Apply (6.2) entrywise and compare with the unwhitened continuous negative
scale `S_L` in (4.6).  Powers of `L` below absorb the fixed dimension and
all carrier exponents.

For high--low entries,

\[
 {\sum_{n<A}\Lambda(n)|I_n|\over S_L}
 \leq L^Kc^{-1/2}.                                  \tag{7.2}
\]

For reverse low--high entries the right side improves by
`c^(-hC+o(1))`.  For high--high entries, the only new ratios are

\[
 L^Kc^{-1/2-\theta/2+o(1)},\qquad
 L^Kc^{hC+3\theta/2-3/2+o(1)}.                     \tag{7.3}
\]

Both tend to zero.  Indeed

\[
 hC+{3\theta\over2}-{3\over2}
 <-{hC\over2}<0                                    \tag{7.4}
\]

by `theta<1-hC`.  The low--low ratios are smaller, using additionally
`theta<1/2`.  Hence the completed `n<A` shell is `o(S_L)` on every one of
the four cluster orientations.

For `n>A`, the hard-end argument in the shell proof requires the error
ratio

\[
 L^Ke^{h\alpha}{T^{3/2}\over c^{3/2}}=o(1).         \tag{7.5}
\]

In the worst high--high case this is
`c^(hC+3theta/2-3/2+o(1))`, already negative by (7.4).  Thus the frozen
incomplete-transform and arithmetic-tail calculation remains uniform and
gives

\[
 \sum_{n>A}\Lambda(n)|I_{n,A}(\alpha,\beta)|
 \leq L^K{e^{h\alpha}\over c}.                     \tag{7.6}
\]

After division by `S_L`, (7.6) is `c^(-1+o(1))` when `alpha` is high and
is smaller when `alpha` is low.

Since the two-cluster dimension is fixed, (7.2)--(7.6) first prove the
unconditional endpoint-normalized statement

\[
 \boxed{
 \|\mathsf P^{11}_{\rm raw}\|_{
     \{\alpha_i\}\cup\{\beta_j\}}
 =o\left({e^{hCL}\over L^{2m-1}}\right).}           \tag{7.7}
\]

The direct-source factors are exact.  After cancellation of the outside
`n` by `2 Lambda(n)/n`, the continuous and prime entries carry,
respectively,

\[
 {\lambda\over4c}\widehat z_\alpha^{\rm rad}
       \widehat z_\beta^{\rm rad}
 {1+\chi_\alpha\over\chi_\alpha},
 \qquad
 {\lambda\over2c}\widehat z_\alpha^{\rm rad}
       \widehat z_\beta^{\rm rad}
 {1+\chi_\alpha\over\chi_\alpha}.                  \tag{7.8}
\]

Thus the same unbounded inverse-leakage factor identified in (5.6)
survives in both.  Under `mathsf G_chi`, (5.4), (7.7), and the fixed
dimension give

\[
 \boxed{
 \|\mathsf P^{11}_{\rm white}\|_{
     \{\alpha_i\}\cup\{\beta_j\}}
 =o\left({e^{hCL}\over L^{2m}}\right),}             \tag{7.9}
\]

which is the prime half of the conditional statement (0.12).  Without
`mathsf G_chi`, neither (7.9) nor the white continuous scale is claimed.
The unconditional prime conclusion is (7.7).  This is only the `m=l=1`
prime shell and gives no estimate for the other samplers excluded in
Section 0.

## 8. Conclusion

The stronger low base `B_L=(log L)^4` removes every linear-base loss from
the two-envelope errors while remaining inside the uniform subcritical
radial theorem.  The decisive conductor margin is exactly `1-hC>0`.
The same-cluster cutoff needs exactly
`theta<min(1/2,1-hC)`.  Under these strict margins, the continuous
two-cluster Cauchy block has the unconditional raw negative scale (0.9),
and the complete curved `m=l=1` prime shell obeys the unconditional raw
bound (0.10).  The physical white scale (0.12) remains conditional on
`mathsf G_chi`; neither that leakage gate nor modal placement is proved.
No claim beyond the analytic and sampler scope stated in Section 0 is
made.
