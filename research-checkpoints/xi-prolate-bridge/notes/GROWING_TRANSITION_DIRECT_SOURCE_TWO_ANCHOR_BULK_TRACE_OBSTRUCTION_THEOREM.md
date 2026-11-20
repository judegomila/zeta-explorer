# Growing-transition direct-source two-anchor bulk-trace obstruction theorem

## 0. Exact result and fail-closed boundary

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 A=\lambda^2={p^2\over4},\qquad c=2\pi A,\qquad
 L=\log A .                                             \tag{0.1}
\]

The direct-source upper-form theorem fixes the physical orientation, but it
does not close the complete Plemelj assembly `PA`.  Its logarithmic
singular principal acts on the **complete** inward and outward sampler
profiles:

\[
 \boxed{
 \mathcal C^\uparrow_{M,L}(j,k)
 =\int_0^L\!\int_0^\infty
 {a_{j,M}(s)b_{k,M}(t)\over s+t}\,dt\,ds.}             \tag{0.2}
\]

If the `m=1` and `m>=2` pieces are separated, the three terms containing a
higher sampler retain the same Carleman conormal order as the `m=l=1`
term.  Their common one-sided trace is not killed by the existing endpoint
shear.  Thus they cannot be put in the post-Plemelj regular remainder
without an additional operator theorem.

A natural repair is to kill both source rows

\[
 \eta(f)=f(\lambda),\qquad
 \Gamma(f)=\Gamma_{\rm out}(f)
 ={1\over2\sqrt\lambda}\sum_{1\leq n<A}f(n/\lambda). \tag{0.3}
\]

For a two-column anchor synthesis `G` with exact pulled-back exterior
metric `D_A=G^*D_full G`, put `R_A=(eta,Gamma)^T G`.  In the exact
`D_A`-white endpoint/null basis `{e,v}`, one has

\[
 R_AD_A^{-1/2}(e,v)
 =\begin{pmatrix}r_\lambda&0\\
                  \gamma_e&\gamma_v\end{pmatrix},
 \qquad
 \boxed{\det(R_AD_A^{-1}R_A^*)
       =r_\lambda^2|\gamma_v|^2.}                     \tag{0.4}
\]

For the fixed anchors `8,12`, the frozen plane theorem proves
`r_lambda>0` and an `L`-scale positive anchor block.  It does **not** prove
`gamma_v=Gamma(f_v) != 0`, or any quantitative lower bound for it.  The
exact Poisson formula leaves an uncontrolled complete endpoint remainder
which can cancel the nonzero first Bernoulli term.

Even if a two-row inverse were supplied, imposing `eta=Gamma=0` on the
rest would cancel the total explicit first Plemelj boundary.  This does not
algebraically erase the completed Carleman energy or an identity term if a
full operator identity were independently known.  But the frozen derivation
can no longer assign or recover the `+I` normalization from the now-vanishing
explicit row, and it contains no compressed derivative--bulk theorem.  It
therefore would not prove

\[
 I+i\,C^L\circ S^x\circ H_\sigma+o(1).                 \tag{0.5}
\]

It would instead move the remaining obligation to the regular
rest block, the atomic sampler-transition channels, and the exact
anchor--rest Schur cross.  If the anchor block is `kappa L`-positive, the
minimal dimension-free cross target is

\[
 \boxed{
 \|D_A^{-1/2}C_{A R}D_R^{-1/2}\|=o(\sqrt L),}          \tag{0.6}
\]

with the exact transformed full metric, not a block-diagonal substitute.
No frozen theorem proves (0.6).  In particular the higher-alias theorem is an
unsheared edge--edge Hilbert--Schmidt estimate and does not control this
bulk or edge--bulk cross.

This note is an exact obstruction theorem, not a negative theorem for the
complete form.  A direct multi-sampler Plemelj assembly may still absorb
the retained trace without a second shear, and an independently proved
stable two-row anchor plus Schur estimate may still work.  Neither theorem
is currently frozen.  No complete central floor, equation (5.2) of
`DIRECT_RH_ATTACK.md`, or RH conclusion is proved.  The project state
remains `P0_INVALIDATED`.

## 1. Frozen inputs

The proof uses the following repository bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md` | `2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97` |
| `tests/test_growing_transition_direct_source_upper_form_theorem.py` | `96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2` |
| `notes/GROWING_TRANSITION_COMPLETE_CENTRAL_PLEMELJ_CAUCHY_FLOOR_THEOREM.md` | `a3a874470e62daa012dc97d6c908e12ac13378ff7e23219e0fbe3cee56b27a85` |
| `tests/test_growing_transition_complete_central_plemelj_cauchy_floor_theorem.py` | `b9f9cf3d76554b988d7c6d9408130a9ab2b45d37a1862279e139ed7e62edbe61` |
| `notes/GROWING_TRANSITION_SUBCRITICAL_LG_ACTION_BV_THEOREM.md` | `1cae15a8c72f0505384daea94760fcb05c466f897224ab83c54e7c41f045e99c` |
| `tests/test_growing_transition_subcritical_lg_action_bv_theorem.py` | `a34689e3741cc7e09020a009bf4b120c11ace44489fbcdd1c0cc3a3b7d5cfc92` |
| `notes/GROWING_TRANSITION_POST_PLEMELJ_REGULAR_ACTION_REDUCTION_THEOREM.md` | `c7793bec967d219d06eecee76f5606b871b77b75f068648fcf2607977791afd8` |
| `tests/test_growing_transition_post_plemelj_regular_action_reduction_theorem.py` | `00d3fe6c8eb1c1e145abf4d5d1dbee5e38cd33259b1e33d6316246dc61c6eeb1` |
| `notes/GROWING_TRANSITION_EDGE_EDGE_HIGHER_ALIAS_THEOREM.md` | `3bd3bf977178be94e91b7c6603db9df7f861f1cfe498bef303c210e9b87b9ec5` |
| `tests/test_growing_transition_edge_edge_higher_alias_theorem.py` | `c7f6920d5253d31d3acc73c00412567294791c51d62c18291f8407a0ea53be2f` |
| `notes/GROWING_TRANSITION_FINITE_FEJER_POST_CORE_QUANTIFIER_THEOREM.md` | `c366a3a379a7b6f147b6cfcef07f9bd2b373e21a392c02b58aaa1e28c038f4a9` |
| `tests/test_growing_transition_finite_fejer_post_core_quantifier_theorem.py` | `409b119b42d8202511d0253a638d08c9e6585e4866337de4a7a14cbae76e9f1a` |
| `notes/FIXED_EVEN_8_12_PLANE_ARCHIMEDEAN_ARITHMETIC_FLOOR_THEOREM.md` | `e23e5c832db2ae4c0d499a0a692252205197db0cd91b9ae4144416455f2a4f17` |
| `tests/test_fixed_even_8_12_plane_archimedean_arithmetic_floor_theorem.py` | `545fe85867f427cf778aabbb2b4a57dcc268d99ff13e5ca096d84d52d1cdf09f` |
| `notes/FIXED_ENDPOINT_BERNOULLI_MATRIX_QUADRATURE_AND_JET_GROWTH_THEOREM.md` | `287b0fe3cfad40b6d8b7bd4719a6ddcb8fc4073eb463188f6e1100a2dc6908b0` |
| `tests/test_fixed_endpoint_bernoulli_matrix_quadrature_and_jet_growth_theorem.py` | `36d9ca8f522f10b3bf8fd98bffa7b0a0e26a67eaee94ebaba18ff4912b9d651a` |
| `notes/GROWING_TRANSITION_EDGE_CARLEMAN_SCATTERING_OBSTRUCTION.md` | `1edd9639d69980f2a8662b0d0fab0b8fdfb49f853b4599c9a945092358c6018d` |
| `tests/test_growing_transition_edge_carleman_scattering_obstruction.py` | `b3420f2f94f2082b68efbdb2e1c5144abdbdeb35619354f15a72c6b75131d9fb` |

No external source, numerical prolate data, prime estimate, or unvendored
Hilbert-matrix theorem is used.

## 2. Exact full-sampler Carleman split

At a finite Fejer cutoff let

\[
\begin{aligned}
 a_{j,M}^{(m)}(s)
 &= {\sqrt\lambda\over2}\omega_M(m)
    \overline{\{f_j+H_j\}(m\lambda e^{-s})},\\
 b_{k,M}^{(l)}(t)
 &= {\sqrt\lambda e^t\over2}\omega_M(l)
    H_k(l\lambda e^t),
\end{aligned}
\tag{2.1}
\]

and set

\[
 a_1=a^{(1)},\quad a_+=\sum_{m\geq2}a^{(m)},\qquad
 b_1=b^{(1)},\quad b_+=\sum_{l\geq2}b^{(l)}.           \tag{2.2}
\]

Equation (0.2) is the exact singular part obtained from the direct source
after the first boundary and derivative bulk are completed.  Therefore

\[
\boxed{
 \mathcal C^\uparrow(a,b)
 =\mathcal C^\uparrow(a_1,b_1)
  +\mathcal C^\uparrow(a_1,b_+)
  +\mathcal C^\uparrow(a_+,b_1)
  +\mathcal C^\uparrow(a_+,b_+).}                     \tag{2.3}
\]

This is a split of amplitudes, not of singular orders.  Every term in
(2.3) has the same kernel `1/(s+t)`.

For `delta_0(r)=-log(r)/2`, define

\[
 \mathcal B(u,v)=
 2u(0)\langle\delta_0,v\rangle
 +2\int_0^Lu'(s)(H_{\delta_0}v)(s)\,ds
 -2u(L)\langle\delta_0(L+\cdot),v\rangle.             \tag{2.4}
\]

The exact boundary--bulk identity gives

\[
 \mathcal B(u,v)=\mathcal C^\uparrow(u,v).             \tag{2.5}
\]

Consequently, after subtracting only the `m=l=1` term, the retained first
boundary is

\[
 \boxed{
 2a_1(0)\langle\delta_0,b_+\rangle
 +2a_+(0)\langle\delta_0,b_1+b_+\rangle.}              \tag{2.6}
\]

It is a Plemelj boundary, not a regular endpoint error.

In the ordered physical limit, support of `f` gives

\[
\begin{aligned}
 a_1(0)&={\sqrt\lambda\over2}
   \overline{f(\lambda)+H(\lambda)},&
 b_1(0)&={\sqrt\lambda\over2}H(\lambda),\\
 a_+(0)&=\overline{\Gamma_{\rm in}}
  -{\sqrt\lambda\over2}\overline{f(\lambda)+H(\lambda)},&
 b_+(0)&=\Gamma_{\rm out}
  -{\sqrt\lambda\over2}H(\lambda).
\end{aligned}
\tag{2.7}
\]

On the existing endpoint-null rest, `eta=0` and
`Gamma_in=Gamma_out=Gamma`, so

\[
 \boxed{
 a_+(0)=\overline{\Gamma-{\sqrt\lambda\over2}H(\lambda)},
 \qquad
 b_+(0)=\Gamma-{\sqrt\lambda\over2}H(\lambda).}       \tag{2.8}
\]

No frozen input bounds this row by `o(1)` in the bulk exterior metric.
If it remains outside `PA`, the honest post-Plemelj estimate contains

\[
 \left({1\over2}+{\pi\over18}\right)B_0^M,            \tag{2.9}
\]

not just the square-gap term `4B_2^M/27`.

Repartitioning (2.3) into fixed-product mask cells creates ordinary jump
measures `nu`.  After one Stieltjes integration by parts, their exact
off-diagonal contribution is

\[
 \boxed{
 J^M_{jk}=-{\widehat\nu^M_{jk}(-\Delta_{jk})
                 \over i\Delta_{jk}}\mathbf1_{j\ne k},
 \qquad \Delta_{jk}=\sigma_j-\sigma_k.}                \tag{2.10}
\]

A sufficient dimension-free target is the frozen estimate

\[
 |\widehat\nu^M_{\mathfrak c,jk}(-\Delta_{jk})|
 \leq\epsilon_{\mathfrak c}(L)
 (1+|n_j-n_k|)^{-\theta},\qquad
 \sum_{\mathfrak c}\epsilon_{\mathfrak c}(L)=o(1)     \tag{2.11}
\]

for some `theta>0`.  It would give

\[
 \|J^M\|\leq {4\zeta(1+\theta)\over3\pi}
       \sum_{\mathfrak c}\epsilon_{\mathfrak c}(L).  \tag{2.12}
\]

No frozen input proves (2.11).

## 3. Exact two-row anchor determinant

Let `G:C^2 -> H_src` synthesize two proposed anchors and let

\[
 D_A=G^*D_{\rm full}G\succ0,\qquad
 R_A=\binom{\eta G}{\Gamma G}.                         \tag{3.1}
\]

Put

\[
 a=D_A^{-1/2}(\eta G)^*,\qquad r_\lambda=\|a\|,
 \qquad e={a\over r_\lambda},                         \tag{3.2}
\]

and choose the `D_A`-white unit vector `v` orthogonal to `e`.  Then

\[
 (\eta G)D_A^{-1/2}(e,v)=(r_\lambda,0),                \tag{3.3}
\]

and, with

\[
 (\Gamma G)D_A^{-1/2}(e,v)=(\gamma_e,\gamma_v),       \tag{3.4}
\]

the determinant identity (0.4) follows.  Equivalently, in the raw anchor
basis,

\[
 \boxed{
 |\eta(g_1)\Gamma(g_2)-\eta(g_2)\Gamma(g_1)|^2
 =\det(D_A)\,r_\lambda^2|\gamma_v|^2.}                \tag{3.5}
\]

Thus the exact two-row congruence exists if and only if
`gamma_v != 0`.  A stable estimate needs a quantitative smallest-singular-
value bound for `R_A D_A^(-1/2)`, not merely nonvanishing at isolated
values of `lambda`.

If `R_A` is invertible and `R_R` denotes the same two rows on the rest,
put

\[
 T=R_A^{-1}R_R,\qquad
 S=\begin{pmatrix}I_2&-T\\0&I_R\end{pmatrix}.          \tag{3.6}
\]

Then

\[
 R S=(R_A,0),\qquad
 D^\#=S^*D_{\rm full}S,\qquad Q^\#=S^*QS.            \tag{3.7}
\]

Equation (3.7) is the only valid metric bookkeeping.  Replacing `D#` by
its diagonal blocks is not licensed.

## 4. What the fixed label-8/12 theorem does and does not prove

For the frozen anchor plane, the exact endpoint/null basis satisfies

\[
 r_\lambda=2\sqrt{\pi\lambda}\{1+o(1)\}.              \tag{4.1}
\]

The fixed-plane theorem also gives, in raw coordinates,

\[
 \boxed{
 \mathsf H_A(\lambda)
 \succeq\left\{{E\over2}\log c-C\right\}D_A,
 \qquad E=0.282628070905254\ldots .}                  \tag{4.2}
\]

This supplies the needed `L`-scale two-dimensional anchor positivity, but
no anchor--rest estimate.

The missing determinant is exact.  Let `f_v` be the raw `D_A`-unit
endpoint-null source and let

\[
 f_v^{\rm corr}=f_v+\mathfrak b_v                       \tag{4.3a}
\]

be its associated corrected zero-integral source, including the invisible
origin bump.  The bump is supported strictly inside the first physical
sample, so `eta`, `Gamma`, and every endpoint jet are unchanged.  Since the
sawtooth coefficient is zero, the frozen Poisson row at `s=0` gives

\[
\boxed{
 \gamma_v=\Gamma(f_v)=\Gamma(f_v^{\rm corr})=B_v(0)
 ={f_v'(\lambda)\over4\lambda^{3/2}}\widetilde B_2(A)
 -{1\over8\lambda^{3/2}}
   \int_{-\lambda}^{\lambda}
       (f_v^{\rm corr})''(x)
       \widetilde B_2(\lambda x)\,dx.}                 \tag{4.3}
\]

Because `p` is odd,

\[
 \{A\}={1\over4},\qquad
 \widetilde B_2(A)=B_2(1/4)=-{1\over48}.              \tag{4.4}
\]

The fixed jet asymptotic is

\[
 {f_v'(\lambda)\over\lambda^{3/2}}
 \longrightarrow-8\pi^{3/2}.                          \tag{4.5}
\]

Therefore the first term in (4.3) tends to

\[
 \boxed{{\pi^{3/2}\over24}.}                          \tag{4.6}
\]

But the second term in (4.3) has no frozen `o(1)` pointwise estimate.  The
available structural bound contains `||(f_v^corr)''||_1` with a constant
depending on `lambda`, and the fixed-plane proof deliberately controls complete
profile products without asserting pointwise summation of this endpoint
row.  Hence (4.6) does not imply `gamma_v != 0`.  Equations (4.1)--(4.6)
prove anchor positivity but not two-row invertibility.

A moving second anchor would require, at minimum, a quantitative wedge
bound

\[
 |\eta(g_1)\Gamma(g_2)-\eta(g_2)\Gamma(g_1)|^2
 \geq\kappa^2\det D_A                                \tag{4.7}
\]

on a plane which also has an `L`-scale positive complete-form block.  No
frozen theorem proves either property for a moving label.

## 5. The exact effect of imposing `eta=Gamma=0`

Suppose, conditionally, that (3.6) has been made and consider two rest
columns.  Then

\[
 \Gamma_{\rm in}=\Gamma_{\rm out}=0,
 \qquad a(0)=b(0)=0,
 \qquad a(L)=\lambda\overline{\Gamma_{\rm in}}=0.      \tag{5.1}
\]

Both total endpoint rows in the direct-source identity vanish on the
rest--rest block.  Samplewise, however,

\[
\begin{aligned}
 a_1(0)&={\sqrt\lambda\over2}\overline{H(\lambda)},&
 b_1(0)&={\sqrt\lambda\over2}H(\lambda),\\
 a_+(0)&=-{\sqrt\lambda\over2}\overline{H(\lambda)},&
 b_+(0)&=-{\sqrt\lambda\over2}H(\lambda).
\end{aligned}
\tag{5.2}
\]

Thus the `m=l=1` and higher-sampler Plemelj boundaries cancel only in the
completed full profile.  Bounding either side before this cancellation
reintroduces a constant `B_0` term.

If the profiles are differentiable at the corner, (5.1) gives

\[
 {a(s)b(t)\over s+t}=O\!\left({st\over s+t}\right).   \tag{5.3}
\]

The corner is softened, but this does not make the completed Carleman
operator zero.  Zero-trace profiles can still have positive Carleman energy;
likewise, if a full `I+iM` operator identity had already been proved, its
compression to the double-null rest would retain the compressed identity.
That full identity is precisely the missing theorem.  The frozen derivation
can no longer assign or recover `+I` from the now-vanishing explicit row and
does not identify the derivative--bulk remainder with the compressed
`I+iM` fiber.  Thus (0.5) is not proved on the double-null rest.  It requires
a new compressed derivative--bulk theorem, including the jump operator
(2.10).

For the complete endpoint row put

\[
 \rho=\beta_0-\lambda\beta_L,
 \qquad E_{\rm end}=\Gamma_{\rm in}^*\rho
                    +\rho^*\Gamma_{\rm in}.           \tag{5.4}
\]

The selected second row is `Gamma=Gamma_out`, and the exact trace relation
is

\[
 \Gamma_{\rm in}=\Gamma_{\rm out}
              +{\sqrt\lambda\over2}\eta.              \tag{5.5}
\]

After `eta_R=Gamma_out,R=0`, the endpoint form's rest--rest block vanishes,
but its anchor--rest block is

\[
 \boxed{
 (E_{\rm end})_{A R}
 =\left\{\Gamma_{{\rm out},A}
         +{\sqrt\lambda\over2}\eta_A\right\}^*\rho_R.} \tag{5.6}
\]

No frozen theorem bounds `rho_R` in the complete bulk metric.

## 6. Exact anchor--rest Schur gate

Work after any exact congruence (3.7), and fix a proposed generalized floor
`mu`.  Put

\[
 \mathcal A=Q^\#_{AA}-\mu D^\#_{AA},\qquad
 \mathcal C=Q^\#_{AR}-\mu D^\#_{AR},\qquad
 \mathcal R=Q^\#_{RR}-\mu D^\#_{RR}.                  \tag{6.1}
\]

If `mathcal A` is positive definite, the exact Schur condition is

\[
 \boxed{
 Q^\#-\mu D^\#\succeq0
 \quad\Longleftrightarrow\quad
 \mathcal R-\mathcal C^*\mathcal A^{-1}\mathcal C
 \succeq0.}                                           \tag{6.2}
\]

Suppose (4.2) yields

\[
 \mathcal A\succeq\kappa L D_A                       \tag{6.3}
\]

for some fixed `kappa>0`.  Then

\[
 \left\|D_R^{-1/2}\mathcal C^*\mathcal A^{-1}
                  \mathcal C D_R^{-1/2}\right\|
 \leq {1\over\kappa L}
 \|D_A^{-1/2}\mathcal C D_R^{-1/2}\|^2.              \tag{6.4}
\]

This proves (0.6) as the exact sufficient target for an `o(1)` Schur
penalty.  The notation `D_R` in (6.3)--(6.4) means the corresponding exact
rest metric after the full congruence or its exact quotient; it is not an
ad hoc diagonal modal metric.

The fixed `8/12` theorem explicitly proves no cross estimate with label
`16` or a growing rest.  The fixed labels `8,12` are bulk anchor rows.  A
two-anchor correction of every Weber-edge column therefore creates
precisely the edge--bulk cross omitted by the higher-alias theorem and by
the frozen Weber theorem.

## 7. Consequence for the direct bulk attack

The new direct-source orientation closes one old gate: both physical
boundaries use the same ordered `X -> O` slot and the lower orientation is
the adjoint.  It does not supply any of the following estimates:

1. the complete multi-sampler Plemelj synthesis of (2.3);
2. the trace-row or transition-jump estimates (2.8)--(2.12);
3. the fixed `8/12` determinant lower bound (4.7);
4. a compressed derivative--bulk identity theorem after the explicit
   double-null row cancellation (5.1)--(5.3); or
5. the edge--bulk/full-metric Schur estimate (0.6).

The radial LG theorem contributes only the carrier-preserving scalar
Volterra variation

\[
 O\!\left({\log(2+\alpha_0)\over\alpha_0}\right),     \tag{7.1}
\]

conditional on the missing sampler assembly.  The higher-alias theorem
controls unsheared edge labels and deterministic `|h|>=2` Fourier aliases
only in Hilbert--Schmidt norm at the `o(L)` scale.  It neither proves
(2.11) nor (0.6).

Finally, finite Fejer cross forms are not finite-cutoff global radicals.
At `M=1`, `omega_1(1)^2=1/4` and there are no higher samplers.  Therefore
an honest proof must either retain an exact cutoff-dependent `PA_M` and
its endpoint rows or take the ordered sampler limit first.  A fixed
all-cutoff identity fiber cannot be inferred from the limiting physical
form.

The first precise obstruction to `PA` is therefore not physical slot
orientation.  It is the missing complete-sampler boundary/jump assembly;
the proposed two-anchor repair adds the independent determinant and Schur
gates (4.7) and (0.6).
