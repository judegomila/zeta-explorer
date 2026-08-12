# Growing-transition post-Plemelj regular action reduction theorem

## 0. Result and fail-closed boundary

Work on the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 A=\lambda^2,\qquad c=2\pi A,\qquad L=\log A.          \tag{0.1}
\]

This note proves a dimension-free **operator reduction** for the regular
complete-central remainder after the logarithmic Plemelj block.  It does
not prove the scalar arithmetic estimate needed to make that remainder
small.

Let `I` be any finite set of retained plus-phase subcritical labels and
write

\[
 \sigma_j=2\pi n_j+\epsilon_j,\qquad
 n_j\in\mathbb Z,\quad n_j\ne n_k\ (j\ne k),\qquad
 |\epsilon_j|<{\pi\over4}.                              \tag{0.2}
\]

Suppose a finite-Fejer post-Plemelj bulk channel has, after the pairwise
action change of variables, entries

\[
 R^{M}_{jk}=\int_0^1 A^M_{jk}(y)
       e^{i(\sigma_j-\sigma_k)y}\,dy.                    \tag{0.3}
\]

For the diagonal put

\[
 E_{\rm d}^M=\sup_j\left|\int_0^1A^M_{jj}(y)\,dy\right|. \tag{0.4}
\]

For `j\ne k`, assume `A^M_{jk}` is continuously differentiable and its
first derivative has bounded variation.  Define

\[
 \begin{aligned}
 B_0^M={}&\|A^M(0)\|_\pi+\|A^M(1)\|_\pi,\\
 B_2^M={}&\sup_{j\ne k}\bigl{
 |(A^M_{jk})'(0)|+|(A^M_{jk})'(1)|
       +\operatorname {Var}(A^M_{jk})'\bigr}.
 \end{aligned}                                           \tag{0.5}
\]

Here `|| ||_pi` is the projective Schur-multiplier norm.  A sum of
channels is measured by the sum of the three quantities in (0.4)--(0.5).
Then the Hermitian part satisfies

\[
 \boxed{
 \|\operatorname {Herm}R^M\|
 \leq E_{\rm d}^M+\left({1\over2}+{\pi\over18}\right)B_0^M
                       +{4\over27}B_2^M.}               \tag{0.6}
\]

If the first action-boundary term is already part of the exact physical
Plemelj assembly `PA`, it is subtracted before `R^M` is named.  The
post-boundary remainder then has `B_0^M=0` and

\[
 \boxed{
 \|\operatorname {Herm}R^M_{\rm post}\|
 \leq E_{\rm d}^M+{4\over27}B_2^M.}                    \tag{0.7}
\]

The estimate is independent of `|I|` and of the Fejer cutoff `M`, but the
object called `PA` must use the same cutoff as the remainder.  If
`PA_M` contains the exact `M`-dependent reciprocal center core in (2.5)
below, a uniform scalar estimate

\[
 \boxed{
 \mathfrak B^\sharp(L):=
 \sup_M\{E_{\rm d}^M+B_0^M+B_2^M\}_{\rm post\text{-}PA_M}=o(1)} \tag{0.8}
\]

would prove a cutoff-uniform `D`-white bulk regular norm `o(1)`.  If one
instead subtracts only the limiting unweighted core, the honest statement
is the ordered limit

\[
 \boxed{
 \mathfrak B^\to(L):=
 \limsup_{M\to\infty}
 \{E_{\rm d}^M+B_0^M+B_2^M+E_{\rm core}(M,L)\}=o(1),}  \tag{0.9}
\]

followed by `L->infinity`.  If `\mathcal C_{M,L}` and
`\mathcal C_{\infty,L}` denote the paired center operators formed from
(2.5) and (2.7), respectively, put

\[
 \boxed{
 E_{\rm core}(M,L)=
 \|D^{-1/2}(\mathcal C_{M,L}-\mathcal C_{\infty,L})D^{-1/2}\|.} \tag{0.10}
\]

For fixed `L`, this tends to zero because the center contains finitely many
products and `omega_M(m)->1` termwise.

A supremum over all `M>=1` after subtracting only the limiting core is
false: at the first standard Fejer cutoff the center coefficient is only
`Lambda(N)/4`, while the limiting coefficient is
`2 log N-Lambda(N)`.  Section 6 shows that the normalized Loewner and
half-density factors introduce no dimension loss away from the hard end.
Section 7 gives a pure Hankel--Christoffel--Darboux reference projector at
the hard end and isolates the exact additional LG multiplier whose ordered
endpoint/BV control remains part of `SB`.

The finite sampler orientation, the exact constant-primitive boundary,
and the `PA` placement are recorded below.  They make (0.8)--(0.9) precise
remaining scalar arithmetic/mask conditions, not termwise total-variation
claims.  This note proves neither (0.8), (0.9), nor the weighted Weber composition
needed for `alpha<alpha_0`.  It therefore proves no entire-span regular
`o(1)`, no complete central floor, no equation (5.2) of
`DIRECT_RH_ATTACK.md`, and no RH conclusion.  The project state remains
`P0_INVALIDATED`.

## 1. Frozen inputs

The proof uses the following repository bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md` | `6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9` |
| `tests/test_growing_transition_complete_central_form_reduction.py` | `a842fdd24e095cde5af373060f9017e03bb13df1db5ecf6f6374c4fbcf6743de` |
| `notes/GROWING_TRANSITION_COMPLETE_CENTRAL_PLEMELJ_CAUCHY_FLOOR_THEOREM.md` | `a3a874470e62daa012dc97d6c908e12ac13378ff7e23219e0fbe3cee56b27a85` |
| `tests/test_growing_transition_complete_central_plemelj_cauchy_floor_theorem.py` | `b9f9cf3d76554b988d7c6d9408130a9ab2b45d37a1862279e139ed7e62edbe61` |
| `notes/GROWING_TRANSITION_SUBCRITICAL_LG_ACTION_BV_THEOREM.md` | `1cae15a8c72f0505384daea94760fcb05c466f897224ab83c54e7c41f045e99c` |
| `tests/test_growing_transition_subcritical_lg_action_bv_theorem.py` | `a34689e3741cc7e09020a009bf4b120c11ace44489fbcdd1c0cc3a3b7d5cfc92` |
| `notes/GROWING_TRANSITION_WEBER_EDGE_RECIPROCAL_CHANNEL_THEOREM.md` | `16db62873056fb419bc740154c67a8f27ce6ecea2b85201abab7b89aa20d56d0` |
| `tests/test_growing_transition_weber_edge_reciprocal_channel_theorem.py` | `5be3b86c8538f1234db40373a6562ac226604ed925dad9d13ef7e37516a82df6` |
| `notes/GROWING_TRANSITION_BOTH_MISS_RECIPROCAL_CORE_THEOREM.md` | `0211d021fa37b423f41b2839aeda96630aaac931de0ea3d7d028f95705de29a8` |
| `tests/test_growing_transition_both_miss_reciprocal_core_theorem.py` | `0ec59c581c1109e07d57306dc3eb6752f3ba3a4080cbf4b2683c1ddfe3b41d4c` |
| `P2_SOURCE_LOCK.json` | `8b731d499903041ef68e7722ebd085d22673c022655431dcca27c9cac6f4730a` |

No external prime theorem, weighted Hilbert theorem, Kadec theorem, or
numerical prolate data is used in the sequence lemma (0.6).  Any later use
of a short-interval prime estimate or a nontrivial action-sampling theorem
must be declared separately.

## 2. Exact finite sampler product

Let `omega_M` be a finitely supported Fejer weight with
`0<=omega_M(m)<=1`.  The ordered sampler factors are

\[
 W_{0,M}=\sum_{m\geq1}\omega_M(m)S_m,
 \qquad
 \ell_M(N)=\sum_{\substack{n\mid N\\n\geq2}}
       \Lambda(n)\omega_M(N/n),
 \qquad
 W_{1,M}=\sum_{N\geq1}\ell_M(N)S_N.                    \tag{2.1}
\]

Thus the coefficient of `S_Q` in the ordered product is exactly

\[
\boxed{
 \sum_{mN=Q}\omega_M(m)\ell_M(N)
 =\sum_{mnl=Q}\omega_M(m)\Lambda(n)\omega_M(l).}       \tag{2.2}
\]

The second sampler weight in (2.2) is the weight inside `ell_M`; the
adjoint supplies the opposite orientation.  One must not replace
`ell_M(N)` by `log N` at finite `M`, and one must not symmetrize `ell_M`
before forming the ordered product.

For the both-miss part, let `u` denote the original inward logarithmic
integration variable and put

\[
 y_N=\log(N/A),\qquad \rho=\log m-u,\qquad l={N\over mn}.
\]

The exact fixed-product coefficient is

\[
\boxed{
 B_{N,M}(\rho)=
 \sum_{\substack{n\mid N\\n<A}}\Lambda(n)
 \sum_{m\mid N/n}\omega_M(m)\omega_M(l)
 \mathbf1_{\log(mn/A)<\rho<\log m},
 \quad0<\rho<y_N.}                                     \tag{2.3}
\]

Endpoint equalities use the same half-density convention as the ordered
Fejer product.  Equation (2.3) sums all coherent divisors at a fixed total
product before any norm is taken.

Define the unrestricted fixed-product coefficient by

\[
 G_{N,M}=\sum_{mnl=N}\omega_M(m)\Lambda(n)\omega_M(l).
                                                               \tag{2.4}
\]

On the exact center mask

\[
 N<4A,\qquad z=e^\rho<2,\qquad
 w=e^{y_N-\rho}<2,                                    \tag{2.5a}
\]

both-miss means `m,l>=2`.  Inclusion--exclusion of the two missing axes
therefore gives the finite-cutoff identity

\[
\boxed{
 G_{N,M}-B_{N,M}
 =2\omega_M(1)\ell_M(N)-\omega_M(1)^2\Lambda(N).}      \tag{2.5}
\]

The last term restores the doubly counted intersection `m=l=1`.  At the
first standard Fejer cutoff, `omega_1(1)=1/2` and all other sampler weights
vanish, so

\[
 G_{N,1}-B_{N,1}={1\over4}\Lambda(N).                  \tag{2.6}
\]

Only after `M->infinity` does (2.5) become the frozen unweighted identity

\[
 B_N=G_N-2\log N+\Lambda(N),\qquad
 -2G_N+2B_N=-4\log N+2\Lambda(N).                       \tag{2.7}
\]

The cancellation in (2.5), not just its limit (2.7), is mandatory.
Norming `G` and `B` separately
creates a false divisor-conductor loss.  Away from the exact center,
(2.3), rather than a raw prime-index family, is the scalar object whose
uniform or ordered projective endpoint/variation seminorm occurs in
(0.8)--(0.9).

## 3. Exact boundary identity and the constant primitive

Use the inward and outward profiles of the frozen Plemelj theorem,

\[
 a_j(s)=e^{s/2}\overline{X_j(\ell-s)},\qquad
 b_k(t)=e^{t/2}O_k(\ell+t).
\]

For the complete Chebyshev-error kernel `delta`, the oriented central--outer
entry is exactly

\[
\boxed{
 \begin{aligned}
 I_{jk}={}&2\overline{\Gamma_j}\,\beta_{0,k}
 +2\int_0^L\{a'_j(s)-a_j(s)\}
          (H_\delta b_k)(s)\,ds
 -2\lambda\overline{\Gamma_j}\,\beta_{L,k},
 \end{aligned}}                                        \tag{3.1}
\]

where `Gamma_j=X_j(ell-)` is the one-sided sampler trace and

\[
 \beta_{h,k}=\int_0^\infty\delta(h+t)b_k(t)\,dt.         \tag{3.2}
\]

Both rows in (3.1) are part of the identity.  The logarithmic singular
piece

\[
 \delta_0(r)=-{1\over2}\log r                           \tag{3.3}
\]

combines its first boundary row with the derivative bulk to produce the
positive Plemelj/Cauchy kernel.  Its far row remains a regular endpoint
term with the minus sign in (3.1).

The corresponding prime-minus-main Stieltjes measure can be written

\[
 d\mu(r)=e^{-r}d\psi_C(e^r)-dr.                         \tag{3.4}
\]

If `M(R)=mu([0,R])` and `M(R)->-gamma`, put
`widetilde M=M+gamma`.  For a compactly supported `C^1` test function,
Stieltjes integration by parts gives

\[
\boxed{
 \int_0^\infty f\,d\mu
 =-\gamma f(0)-\int_0^\infty\widetilde M(r)f'(r)\,dr.} \tag{3.5}
\]

Thus the constant part of the primitive is exactly a boundary functional.
It must be combined with the retained rows of (3.1); it is not a regular
bulk error to be bounded by total variation.

Boundedness of `M` alone supplies no Fourier decay.  For example, the
truncations of

\[
 \sum_{q\geq1}(\delta_q-\delta_{q+1/2})                 \tag{3.6}
\]

have uniformly bounded primitives but Fourier mass proportional to the
number of atoms at every frequency `2\pi k` with odd integer `k`.  Therefore
(3.5) cannot prove (0.8)--(0.9); the exact fixed-product reindexing
(2.2)--(2.3) and joint
prime/main cancellation are essential.

## 4. The sequence lemma

For `j\ne k`, put `\Delta_{jk}=\sigma_j-\sigma_k` and

\[
 H^{(1)}_{jk}={1\over i\Delta_{jk}},\qquad
 H^{(1)}_{jj}=0.                                       \tag{4.1}
\]

From (0.2), with `q=|n_j-n_k|`,

\[
 |\Delta_{jk}|\geq2\pi q-{\pi\over2}
                 \geq{3\pi\over2}q.                   \tag{4.2}
\]

The unperturbed matrix `1/(2\pi i(n_j-n_k))` is a compression of
the discrete Hilbert transform and has norm at most `1/2`.  Moreover

\[
 \left|{1\over\Delta_{jk}}-{1\over2\pi(n_j-n_k)}\right|
 \leq{1\over6\pi|n_j-n_k|^2}.                          \tag{4.3}
\]

The Schur row sum of the right side is `\pi/18`.  Hence

\[
\boxed{\|H^{(1)}\|\leq{1\over2}+{\pi\over18}.}         \tag{4.4}
\]

Two integrations by parts in (0.3) give, entrywise,

\[
\begin{aligned}
 R^M_{jk}={}&
 \left[{A^M_{jk}(y)e^{i\Delta_{jk}y}\over i\Delta_{jk}}
       \right]_0^1
 -\left[{(A^M_{jk})'(y)e^{i\Delta_{jk}y}
       \over(i\Delta_{jk})^2}\right]_0^1\\
 &+{1\over(i\Delta_{jk})^2}
       \int_0^1e^{i\Delta_{jk}y}\,d(A^M_{jk})'(y).
                                                               \tag{4.5}
\end{aligned}
\]

The first line's first bracket is a sum of unitary conjugates of
`A^M(e)\circ H^(1)`, `e=0,1`.  The projective Schur norm and (4.4)
bound it by

\[
 \left({1\over2}+{\pi\over18}\right)B_0^M.             \tag{4.6}
\]

The rest of (4.5) has absolute value at most

\[
 {B_2^M\over|\Delta_{jk}|^2}.                           \tag{4.7}
\]

Using (4.2), its Schur row sum is

\[
 2B_2^M\sum_{q\geq1}{4\over9\pi^2q^2}
 ={4\over27}B_2^M.                                    \tag{4.8}
\]

The diagonal is (0.4), and taking the Hermitian part cannot increase the
norm.  This proves (0.6).

The first boundary in (4.5) is not small merely because the span grows:
(4.4) is a constant bound.  In the physical central form it is the
weighted-Hilbert/Plemelj boundary and belongs in `PA`.  If the outgoing
shear gives `A^M(0)=(A^M)'(0)=0` and `PA` removes the remaining first
boundary at `y=1`, only (4.7)--(4.8) remain.  This proves (0.7).

## 5. Pairwise nonlinear action coordinate

For `0<a_j,a_k<=1`, let `phi_j(x)` be the completed outgoing carrier phase
and put

\[
 y_{jk}(x)={\phi_j(x)-\phi_k(x)\over\sigma_j-\sigma_k}.
                                                               \tag{5.1}
\]

With

\[
 b_j=(x^2+a_j)^{1/2},\qquad
 p_a(x)={1\over J(a)\sqrt{(1+x^2)(x^2+a)}},             \tag{5.2}
\]

the exact action derivative is `\partial_x\partial_\sigma\phi=-p_a`.
Therefore

\[
\boxed{
 \overline p_{jk}(x):=-\partial_xy_{jk}(x)
 =-{c(a_j-a_k)\over
 (\sigma_j-\sigma_k)\sqrt{1+x^2}(b_j+b_k)}.}           \tag{5.3}
\]

The continuous diagonal is obtained by taking `a_k\to a_j`.  On an oriented
channel, the sign is fixed once and `|\overline p_{jk}|\,dx` is the pairwise
action measure.  Formula (5.3), rather than a linearization at one action,
is what converts the exact phase difference into (0.3).

The scalar arithmetic/mask factor left after this change of variables is
denoted `q^M_jk(y)`.  The **scalar seminorm hypothesis `SB`** has two
legitimate versions.  For cutoff-uniform `SB^sharp`, subtract the exact
`PA_M` boundaries, including (2.5), and take `sup_M`.  For ordered
`SB^to`, subtract the limiting boundary, retain `E_core(M,L)`, take
`limsup_(M->infinity)` for each fixed `L`, and only then let `L` grow.
After summing fixed-product divisors before norms, the resulting family
`q^M` must have in the selected sense:

1. diagonal `L^1` size `o(1)`;
2. projective endpoint size `o(1)`;
3. uniformly summable `L^infty`, first-variation, endpoint-derivative, and
   derivative-variation seminorms `o(1)` after the pullback (5.1);
4. the same bounds for each ordinary mask-transition channel, with the
   channel bounds summable before applying the selected cutoff operation;
5. on the hard patch, the ordered endpoint/BV bound for the exact
   `m_a`-weighted Hankel amplitude specified in (7.8), not merely the pure
   `m_a=1` reference projector.

These four quantities are exactly the scalar contributions to
`E_d^M+B_0^M+B_2^M` in (0.8)--(0.9).  The hypothesis is intentionally stated
after fixed-product summation.  A raw prime-index estimate is false because
different prime/sampler factorizations can have the same total-product
phase.

No frozen input proves either version of `SB`.  In particular, the bounded
primitive in (3.5), the radial `O(log L)` action variation, and a raw large-sieve bound
do not imply it.  Equation (2.6) proves that `SB^sharp` is false if one
subtracts the unweighted core instead of the exact `M`-dependent core.

## 6. Loewner and half-density factors are dimension-free

Let

\[
 F'(a)=J(a),\qquad
 C^L_{jk}={F(a_j)-F(a_k)\over
 (a_j-a_k)\sqrt{J(a_j)J(a_k)}},\qquad C^L_{jj}=1.       \tag{6.1}
\]

The frozen Plemelj theorem proves that `F` is operator monotone.  Hence
`C^L` is positive semidefinite with diagonal one, and

\[
 X\longmapsto C^L\circ X                              \tag{6.2}
\]

is a unital completely positive Schur contraction.

Put

\[
 u_j=b_j^{1/2}=(x^2+a_j)^{1/4},\qquad
 C^b_{jk}={1\over2}\left({u_j\over u_k}+{u_k\over u_j}\right).
                                                               \tag{6.3}
\]

For `x>=1`, `C^b` is the sum of two rank-one Schur multipliers and

\[
 \|C^b(x)\|_\pi\leq2^{1/4}.                             \tag{6.4}
\]

Differentiating with respect to the exact coordinate (5.1) gives

\[
\boxed{
 \partial_yC^b_{jk}
 =-{\sigma_j-\sigma_k\over c}
 {x\sqrt{1+x^2}(a_j-a_k)\over4(b_jb_k)^{5/2}}.}        \tag{6.5}
\]

The product `(sigma_j-sigma_k)(a_j-a_k)` expands into four diagonal
rank-one factors.  Since the action diameter divided by `c` is bounded,
(6.5) has projective norm `O(x^(-3))`; its `x` derivative has projective
norm `O(x^(-4))`.  Therefore

\[
 \sup_{x\geq1}\|\partial_yC^b(x)\|_\pi
 +\operatorname {Var}_{x\geq1,\pi}(\partial_yC^b)<C.   \tag{6.6}
\]

The Loewner factor is independent of `x`, so (6.2) preserves every bound
in (6.4)--(6.6).  The product rule now shows that if the scalar factor
`q^M` obeys the selected version of `SB`, then

\[
 A^M=C^L\circ C^b\circ q^M                            \tag{6.7}
\]

obeys (0.8) or (0.9), with only an absolute multiplicative constant.  The exact LG
Volterra coefficient contributes its frozen

\[
 O\left({\log(2+\alpha_0)\over\alpha_0}\right)         \tag{6.8}
\]

to the same slow-coefficient variation, provided the carrier-preserving
fixed-product representation required by `SB` has first been made.  This
last qualification is essential: the radial LG theorem alone does not
prove the sample assembly.

## 7. Hard-end Hankel--Christoffel--Darboux patch

The projective estimate (6.4) is not uniform as `x->0` and `a->0`.
The exact LG coordinate identifies a useful reference projector there, but
it also produces a multiplier which must not be dropped.  Put

\[
 a=r^2,\qquad \alpha=ca,\qquad t=cr=\sqrt{c\alpha},
 \qquad
 T_r(x)=\int_0^x\sqrt{{v^2+r^2\over1+v^2}}\,dv.        \tag{7.1}
\]

Use the hard coordinate and its inverse

\[
 \xi={T_r(x)\over r},\qquad x=x_r(\xi),\qquad
 q_r(\xi)={x_r(\xi)^2\over r^2}.                       \tag{7.2}
\]

The exact half-density multiplying the leading regular LG carrier is

\[
\boxed{
 S^\xi_\alpha(\xi)=
 \sqrt{{\pi c\xi\over J(a)}}\,m_a(\xi)J_0(t\xi),
 \qquad
 m_a(\xi)={r\over\sqrt{x_r(\xi)^2+r^2}}
          ={1\over\sqrt{1+q_r(\xi)}}.}                 \tag{7.3}
\]

Thus `m_a(0)=1` and `0<m_a<=1`, but `m_a` depends on the spectral
parameter `t` through `a=(t/c)^2`.  Pointwise boundedness of `m_a` is not
an operator estimate.

Because `F'(a)=J(a)` and
`sigma(a)=c{1-F(a)/2}-pi/4`, the action orientation is

\[
\boxed{
 { |d\sigma|\over2\pi}
 ={J(a)t\,dt\over2\pi c}
 =-{d\sigma\over2\pi}.}                                \tag{7.4}
\]

If one sets `m_a=1`, the leading rows and (7.4) give the **reference**
kernel

\[
 P_T^{(0)}(\xi,\zeta)
 =\sqrt{\xi\zeta}\int_0^T
       J_0(t\xi)J_0(t\zeta)t\,dt,                      \tag{7.5}
\]

with an additional factor `1/2` in the fixed positive-phase synthesis.
The exact Hankel Christoffel--Darboux identity is

\[
\boxed{
 \int_0^TtJ_0(t\xi)J_0(t\zeta)\,dt
 =T{\xi J_1(T\xi)J_0(T\zeta)
       -\zeta J_0(T\xi)J_1(T\zeta)\over \xi^2-\zeta^2},} \tag{7.6}
\]

with its continuous diagonal value.  The order-zero Hankel transform is
unitary, so (7.5) is an orthogonal projection.  The positive-phase
reference kernel `P_T^(0)/2` is therefore a positive contraction of norm at
most `1/2`, independent of the action cutoff.  Its `sqrt(xi zeta)` factor
also makes the `xi=0` boundary vanish.

The actual leading kernel is instead

\[
 \boxed{
 {1\over2}\sqrt{\xi\zeta}\int_0^T
 m_{(t/c)^2}(\xi)m_{(t/c)^2}(\zeta)
 J_0(t\xi)J_0(t\zeta)t\,dt.}                         \tag{7.7}
\]

It is not a conjugation of (7.5) by one fixed multiplier.  Consequently
(7.6) does not by itself bound (7.7).

For precision, the hard part of `SB` requires the complete post-`PA_M`
amplitude, including both factors in (7.7), the fixed-product arithmetic
mask, cutoff, and exact Volterra coefficient, to admit an ordered
factorization

\[
 \sum_\nu\int_{[0,T]}L^M_\nu(t)\,dP_t^{(0)}\,R^M_\nu(t) \tag{7.8}
\]

with the prescribed endpoint ordering and with the sum of

\[
 \|L^M_\nu(T)\|\|R^M_\nu(T)\|
 +\int_0^T\|dL^M_\nu(t)\|\|R^M_\nu(t)\|
 +\int_0^T\|L^M_\nu(t)\|\|dR^M_\nu(t)\|               \tag{7.9}
\]

bounded by the hard contribution to (0.8), or to (0.9) in the ordered
version.  Simultaneous jump terms, if present, are included in this
seminorm.  Ordinary ordered Stieltjes integration by parts against the
contractions `P_t^(0)` then gives the corresponding operator bound.

No current frozen input proves the factorization (7.8) or the endpoint/BV
bound (7.9) for the exact multiplier `m_a`, and this note does not infer it
from `0<m_a<=1`.  The pure kernel (7.5)--(7.6) is only the reference
projector.  Thus the hard patch remains an explicit part of `SB`, rather
than a proved dimension-free promotion of the radial LG estimate.

## 8. Exact PA placement

Three boundary-scale objects must be allocated before (0.7) is applied.

1. The logarithmic kernel (3.3), its inward trace, and its derivative bulk
   form the `I+iM` Plemelj fiber.  The first bracket in (4.5) is its action
   weighted-Hilbert boundary.  It is not a regular norm error.
2. The constant primitive `-gamma` is the boundary functional in (3.5).
   It is combined with the same exact trace rows, not split from the prime
   atoms.
3. In the reciprocal both-miss center, the finite-cutoff identity (2.5)
   must be used before the first alias is extracted.  Denote its exact
   coefficient by

   \[
    C_{N,M}=2\omega_M(1)\ell_M(N)
              -\omega_M(1)^2\Lambda(N).                \tag{8.1}
   \]

   The cutoff-matched assembly `PA_M` contains the paired first-alias core
   with coefficient `C_{N,M}`, not its unweighted limit.  If instead one
   works with a limiting `PA`, the difference is retained as
   `E_core(M,L)` and the ordered limit (0.9) is mandatory.

   In the unweighted limit, the normalization of the frozen reciprocal-core
   theorem is `S_1=-mathsf X/4`; the constant `2L` part of
   `2log N-Lambda(N)` contributes the favorable internal component

   \[
    (-2L)S_1={L\over2}\mathsf X\succeq0.               \tag{8.2}
   \]

   It is part of the proof of `PA` and may not be added again after a
   completed Plemelj floor.  Equation (8.2) is not a finite-`M` identity;
   replacing (8.1) by `2log N-Lambda(N)` before the sampler limit produces
   the obstruction (2.6).

After these cutoff-matched or ordered allocations, (0.7) applies only to
the post-boundary regular channels.  If a proposed decomposition leaves a nonzero first bracket in
(4.5), the honest conclusion is (0.6), not `o(1)`.

## 9. Edge and edge--bulk gate

For `alpha<alpha_0`, the frozen Weber theorem proves the scalar flat
multiplier

\[
 F_0(N,\alpha)={-i\over\sqrt{N^2-1}}
 \exp\left\{{i\alpha\over4}\log{N+1\over N-1}\right\} \tag{9.1}
\]

and a scalar relative error.  It explicitly does not prove the required
operator factorization of the variable Jost coefficient and cutoff.  A
complete regular theorem still needs, uniformly in the number of edge
labels and in `M`, a weighted-composition decomposition

\[
 \mathcal F^\epsilon_{c,N}
 ={r^\epsilon_{c,N}(A_c)\over\sqrt c}\,F_c(N,A_c)
       +\mathcal E^\epsilon_{c,N},                      \tag{9.2}
\]

with dyadic projective variation for `r` and

\[
 \|\mathcal E^\epsilon_{c,2X}\|
 +\int_X^{2X}\|\partial_N\mathcal E^\epsilon_{c,N}\|\,dN
 \leq {C(1+B)^K\over\sqrt c\,X^2}.                    \tag{9.3}
\]

The same estimate must hold for the edge--bulk cross after exact
fixed-product summation.  Neither (9.2)--(9.3) nor that cross estimate is
proved here.

Thus the complete implication is only the following fail-closed statement:

\[
 \boxed{
 \text{cutoff-matched `PA_M' + `SB^sharp' + Weber composition}
 \Longrightarrow
 \sup_M\|D^{-1/2}R^M_{\rm regular}D^{-1/2}\|=o(1),}   \tag{9.4}
\]

or, with the limiting core,

\[
 \boxed{
 \text{limiting `PA' + `SB^to' + Weber composition}
 \Longrightarrow
 \limsup_{L\to\infty}\limsup_{M\to\infty}
 \|D^{-1/2}R^M_{\rm regular}D^{-1/2}\|=0.}            \tag{9.5}
\]

The present note proves the dimension-free operator arrow from either
properly ordered version of `SB` to the
bulk estimate (0.6)--(0.7), and no more.  In particular, it does not prove any
of the hypotheses displayed on the left sides of (9.4)--(9.5).
