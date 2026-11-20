# Growing-transition continuous odd-Laplace common-representative barrier

## 0. Exact result and fail-closed boundary

Use the locked schedule

\[
 \lambda={p\over2},\qquad c=2\pi\lambda^2,\qquad
 A=\lambda^2,\qquad L=2\log\lambda .                 \tag{0.1}
\]

At a finite Fejer cutoff, the complete pole--Archimedean part of the
ordered direct-source form has the exact kernel

\[
 \boxed{
 k_{\rm cont}(r)={1\over\sinh r}-2(1+e^{-r})
 =-2+2\sum_{\nu\geq1}e^{-(2\nu+1)r}.}               \tag{0.2}
\]

Thus the apparent Laplace row at `z=1` cancels exactly.  If
`mathcal A_(M,z),mathcal B_(M,z)` are the full inward and outward
Laplace rows defined in Section 2, then

\[
 \boxed{
 \operatorname {Herm}Q^\uparrow_{{\rm cont},M}
 =-\mathsf S(\mathcal A_{M,0},\mathcal B_{M,0})
 +\sum_{\nu\geq1}
 \mathsf S(\mathcal A_{M,2\nu+1},
            \mathcal B_{M,2\nu+1}),}                \tag{0.3}
\]

where

\[
 \mathsf S(U,V)=U^*V+V^*U.                           \tag{0.4}
\]

The series in (0.3) is norm-absolutely convergent at fixed finite `M` on
the admitted finite packet.  The `z=0` outward row retains the inherited
improper or Abel source convention.  Formula (0.3) neither enlarges that
source domain nor licenses an unordered exchange of the odd-row sum, the
Fejer limit, and the growing-`lambda` limit.

Let superscript `1` mean that only sampler `m=1` or `l=1` is retained and
put `mathcal A^+=mathcal A-mathcal A^1` and
`mathcal B^+=mathcal B-mathcal B^1`.  The exact continuous
`(m,l)!=(1,1)` remainder is

\[
 \boxed{
 R_{{\rm cont},M}
 =\sum_{r\in\{0,3,5,\ldots\}}\epsilon_r
 \left\{
 (\mathcal A^1_{M,r})^*\mathcal B^+_{M,r}
 +(\mathcal A^+_{M,r})^*\mathcal B^1_{M,r}
 +(\mathcal A^+_{M,r})^*\mathcal B^+_{M,r}
 +\operatorname {adjoint}\right\},}                 \tag{0.5}
\]

with `epsilon_0=-1` and `epsilon_r=1` for `r>=3`.  This is a common direct
representative.  No equality-conductor form is inserted as a summand.

There is no hidden positivity in (0.3).  Every cross row is a difference
of two positive Grams:

\[
 \boxed{
 \mathsf S(U,V)={1\over2}
 \{(U+V)^*(U+V)-(U-V)^*(U-V)\}.}                     \tag{0.6}
\]

Both signs are sharp already in one dimension, by taking `V=U` or
`V=-U`.

On the exact double-null subspace

\[
 \eta(f)=f(\lambda)=0,\qquad
 \Gamma_{\rm out}(f)=0,                              \tag{0.7}
\]

the complete inward and outward corner traces vanish.  If the complete
profiles have bounded one-sided first jets at the corner, their conormal
numerator is `O(st)`.  The mixed/full sampler axes therefore cancel the
constant corner trace of the local `(1,1)` conormal exactly.  This lowers
the formal corner order, but supplies no uniform estimate when the first
jets grow with `lambda`.

The earliest one-sided statement which would identify the continuous
axes as the forced same-scale canceller on a realized local negative
packet `E` is

\[
 \boxed{
 P_E\widehat Q_{\rm cont}P_E
 \succeq-o(\tau_L)P_E,\qquad
 \tau_L={c^{hC+o(1)}\over L^{2m}}.}                  \tag{0.8}
\]

Here hats denote exact exterior-Gram whitening.  Equation (0.8) is not
proved.  An abstract extended-profile countermodel in Section 7 proves
that endpoint and seam jets, the continuation-tail identity, and absolute
BV bounds alone cannot force its sign.  The countermodel is not in the
physical Fourier-sampler image and asserts no inversion parity.

On the realized polylogarithmic packet supplied by the pinned modal
placement theorem, the pinned polylog corollary makes the physically
whitened `(m,l)=(1,1)` prime shell `o(tau_L)`.  After that shell is
removed, absolute sampling still forces the sum of (0.5) and all remaining
ordered prime channels to have a positive compression of size
`(1-o(1))*tau_L` when `hC>1/2`.  Without that realization and leakage
input, only the raw shell estimate is available and the white conclusion
is not asserted.  This theorem does not select between the two completed
assemblies, prove (0.8), prove a complete central sign, or prove RH.  The
project state remains `P0_INVALIDATED`.

## 1. Frozen inputs

The following repository bytes are binding inputs.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md` | `2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97` |
| `tests/test_growing_transition_direct_source_upper_form_theorem.py` | `96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2` |
| `notes/GROWING_TRANSITION_ORDERED_DIRECT_PROFILE_CONTINUATION_TWO_JET_SHEAR_REDUCTION_THEOREM.md` | `e3b1228a1fb22270a01f061c198239f3e60cb00b675da55ddd13420f9929dea3` |
| `tests/test_growing_transition_ordered_direct_profile_continuation_two_jet_shear_reduction_theorem.py` | `7d6e46c302276563cfc88e4826903a344c0937eb29f3645daf473d5ba1917341` |
| `notes/GROWING_TRANSITION_DIRECT_SOURCE_TWO_ANCHOR_BULK_TRACE_OBSTRUCTION_THEOREM.md` | `cb2afb9b28cbcaf4dbd55802b72e59a3f71cad0fa84e69ee18252c5f7dbef591` |
| `tests/test_growing_transition_direct_source_two_anchor_bulk_trace_obstruction_theorem.py` | `bd888e61906c5c696f8a7338dbf4d1b6861c888ee863d2ba6ba9ab14d05d8892` |
| `notes/GROWING_TRANSITION_ABSOLUTE_SAMPLING_FORCED_CANCELLATION_BARRIER.md` | `eb04692b7ce8e06efe254053ba93e4c5f2051ceffe47e68015c9e12886d77584` |
| `tests/test_growing_transition_absolute_sampling_forced_cancellation_barrier.py` | `3bb7d6c45bd0d4d1564624f7ab9f22532229d51dd51d71a474674081fd266a7b` |
| `notes/GROWING_TRANSITION_CONTINUOUS_M11_TWO_CLUSTER_UNCONDITIONAL_NARROW_SCHEDULE_THEOREM.md` | `6e0678b8d0d762b79402ad0f6947ddcfa8b830c251b333f58c9fe5ea7ebe7a5c` |
| `tests/test_growing_transition_continuous_m11_unconditional_narrow_schedule.py` | `626dc9f12cf7a4b58246e12f1b008d72bf9bb0e60713a0a10f6b5dda2e66eb34` |
| `notes/GROWING_TRANSITION_CURVED_TWO_ENDPOINT_FIO_SHELL_THEOREM.md` | `ddb1769d6e6f2b3214cb8191d631a161a1312f18c5bfbba4ca2ad11bb9f93341` |
| `tests/test_growing_transition_curved_two_endpoint_fio_shell_theorem.py` | `8d6bf688ffc938691789a558900ac95467a6631203f5fd262a5f4356431422cb` |
| `notes/GROWING_TRANSITION_POLYLOG_BASE_CONTINUOUS_PRIME_SHELL_COROLLARY.md` | `326d4d19a4c7bf93e920f2af1438fb0aba7dc797091bf0957abf9149bca018e1` |
| `tests/test_growing_transition_polylog_base_continuous_prime_shell_corollary.py` | `de07ecbac9c7404edc2508b54d3aa25a15f2d8f102b86199119af65ef9e6a2a7` |
| `notes/GROWING_TRANSITION_TWO_CLUSTER_MODAL_PLACEMENT_LEAKAGE_NORMALIZATION_THEOREM.md` | `7859533dd83b94708ee73658e6b6c94eb78418a333082c875f0629b244efe564` |
| `tests/test_growing_transition_two_cluster_modal_placement_leakage_normalization_theorem.py` | `caef856880cbc01e95b45209a5dc1a41d669c43a9f868552e6b7d33fd2e0cc8c` |

No external source, prime estimate, zero list, or numerical prolate data is
used.

## 2. Finite-Fejer direct profiles and Laplace rows

Let `H=mathcal F_a f`.  At finite cutoff put

\[
 \begin{aligned}
 \mathfrak a_{f,M}(s)
 &= {\sqrt\lambda\over2}\sum_{m\geq1}\omega_M(m)
       \{f+H\}(m\lambda e^{-s}),&&0\leq s\leq L,\\
 b_{f,M}(t)
 &= {\sqrt\lambda e^t\over2}\sum_{l\geq1}\omega_M(l)
       H(l\lambda e^t),&&t\geq0.
 \end{aligned}                                        \tag{2.1}
\]

For a fixed `q`-column synthesis `f_x`, define row maps on coefficient
space by

\[
 \begin{aligned}
 \mathcal A_{M,z}x
 &=\int_0^L\mathfrak a_{f_x,M}(s)e^{-zs}\,ds,\\
 \mathcal B_{M,z}x
 &=\int_0^\infty b_{f_x,M}(t)e^{-zt}\,dt.
 \end{aligned}                                        \tag{2.2}
\]

The first slot in the direct-source formula is conjugated, so the
factorized matrix is `mathcal A_(M,z)^* mathcal B_(M,z)`.

For `z>0`, the rows in (2.2) are ordinary absolutely convergent rows.  For
`z=0`, the inward row is finite and the outward row is the inherited pole
row.  Atomwise,

\[
 \mathcal B^{(l)}_{M,0}(f)
 ={\omega_M(l)\over2l\sqrt\lambda}
       \int_{l\lambda}^{\infty}H(y)\,dy,              \tag{2.3}
\]

with the same improper or Abel convention as the admitted source form.
It need not be absolutely convergent.  Equation (2.3) is not a new
regularization.

Let `mathcal A^1,mathcal B^1` retain only the displayed terms `m=1,l=1`
in (2.1).  The complementary rows are exactly

\[
 \mathcal A^+_{M,z}=\sum_{m\geq2}\mathcal A^{(m)}_{M,z},
 \qquad
 \mathcal B^+_{M,z}=\sum_{l\geq2}\mathcal B^{(l)}_{M,z}. \tag{2.4}
\]

No mask, equality row, or reflected outer representative has been added.

## 3. Exact odd-Laplace factorization

The continuous line in the direct source formula is

\[
 Q^\uparrow_{{\rm cont},M}(j,k)
 =\int_0^L\int_0^\infty
 \overline{\mathfrak a_{f_j,M}(s)}b_{f_k,M}(t)
 k_{\rm cont}(s+t)\,dt\,ds.                           \tag{3.1}
\]

For `r>0`, geometric summation gives

\[
 {1\over\sinh r}
 =2e^{-r}\sum_{n\geq0}e^{-2nr}.
\]

The first term `2e^(-r)` cancels the `-2e^(-r)` pole term, proving (0.2).
For bounded finite-cutoff profiles,

\[
 \sum_{\nu\geq1}\int_0^L\int_0^\infty
 |\mathfrak a(s)b(t)|e^{-(2\nu+1)(s+t)}\,dt\,ds<\infty. \tag{3.2}
\]

Near the corner, the summed positive kernel is `O((s+t)^(-1))`, which is
locally integrable in two dimensions.  Away from the corner it decays
exponentially.  Thus Fubini gives

\[
 Q^\uparrow_{{\rm cont},M}
 =-2\mathcal A_{M,0}^*\mathcal B_{M,0}
 +2\sum_{\nu\geq1}
 \mathcal A_{M,2\nu+1}^*\mathcal B_{M,2\nu+1}.       \tag{3.3}
\]

Hermitian averaging proves (0.3).  Expanding
`mathcal A=mathcal A^1+mathcal A^+` and
`mathcal B=mathcal B^1+mathcal B^+`, and then subtracting the exact
continuous `(1,1)` block, proves (0.5).

The quantifier order is binding:

1. form the admitted profiles and (3.3) at finite `M`;
2. Hermitianize the finite-cutoff ordered form;
3. take the ordered limit `M to infinity` at fixed `lambda`; and
4. only then let `lambda to infinity` on the locked schedule.

In particular, (3.3) proves no supremum over finite `M` after subtracting
an unweighted limiting core.

## 4. Ordered Poisson/Mellin completion

After the ordered unweighted Poisson limit, the complete time profiles are

\[
 \begin{aligned}
 a_f(s)&= {\sqrt\lambda\over2}\sum_{m\geq1}f(m\lambda e^{-s})
 +{e^s\over2\sqrt\lambda}\sum_{m\geq1}f(me^s/\lambda),\\
 b_f(t)&= {1\over2\sqrt\lambda}\sum_{m\geq1}f(me^{-t}/\lambda).
 \end{aligned}                                        \tag{4.1}
\]

For

\[
 T_A(f;z)=\int_0^L\sum_{m\geq1}
 f(m\lambda e^{-s})e^{-zs}\,ds,                      \tag{4.2}
\]

the exact two-branch inward row is

\[
 \boxed{
 \mathcal A_z(f)={\sqrt\lambda\over2}T_A(f;z)
 +{A^{1-z}\over2\sqrt\lambda}T_A(f;1-z).}           \tag{4.3}
\]

Put

\[
 M_f(z)=\int_0^\lambda f(u)u^{z-1}\,du.
\]

For `Re z>1`, Mellin swapping on the complete first branch gives

\[
 \boxed{
 \mathcal B_z(f)={1\over2\sqrt\lambda}
 \{\lambda^z\zeta(z)M_f(z)-A^zT_A(f;z)\}.}          \tag{4.4}
\]

Therefore (4.3)--(4.4) apply directly to every ordinary row
`z=3,5,...` in (0.3).  They retain both truncated-Mellin branches, the
zeta multiplier, and the finite boundary subtraction.  Splitting Euler
or Bernoulli pieces before this recombination does not prove a signed
estimate for (0.3).

On `eta(f)=0`, the continuation-tail identity is

\[
 a_f(L+t)=\lambda b_f(t),\qquad t\geq0.               \tag{4.5}
\]

Thus the complete continuous form can also be written as the separated
cross

\[
 Q^\uparrow_{\rm cont}(j,k)
 ={1\over\lambda}\int_{0\leq x\leq L<u}
 \overline{a_{f_j}(L-x)}a_{f_k}(u)
 k_{\rm cont}(u-x)\,du\,dx.                          \tag{4.6}
\]

It is an off-diagonal cross, not a positive square.

For pure exponential carriers only, the infinite-half-line diagnostic is

\[
 K_{{\rm cont},M}(s,t)
 ={2Z_M(s)Z_M(t)\over s-t}
 \left\{{g'\over g}(s)-{g'\over g}(t)\right\}.      \tag{4.7}
\]

Subtracting the `(1,1)` carrier replaces `Z_M(s)Z_M(t)` by
`Z_M(s)Z_M(t)-omega_M(1)^2`.  Formula (4.7) does not replace the exact
finite-length row identity (0.3), and it does not authorize critical-line
continuation of the retained tails.

## 5. Prime channels remain ordered and separate

At finite `M`, the exact prime form in the same direct representative is

\[
 \boxed{
 Q^\uparrow_{p,M}(j,k)
 ={1\over2}\sum_{m,n,l}
 \omega_M(m)\Lambda(n)\omega_M(l)
 \int_{u_n}^{\lambda}
 \overline{\{f_j+H_j\}(mu)}H_k(lnu)\,du,}           \tag{5.1}
\]

where `n>=2` and `u_n=max{lambda/n,lambda^(-1)}`.  Define

\[
 Q_{p,M}=\operatorname {Herm}Q^\uparrow_{p,M},
 \qquad
 Q_{p,M}=Q_{p,11,M}+Q_{p,\ne11,M}.                   \tag{5.2}
\]

The second term contains every triple with `(m,l)!=(1,1)`.  Regrouping
(5.1) by a scalar fixed product erases which sampler belongs to the
inward and outward ordered slots, so such a regrouping cannot replace
(5.1) in a sign argument.

If `Q_loc` denotes the exact continuous `(1,1)` block, the complete
remainder has the exact common-representative formula

\[
 \boxed{
 R_{\rm comp}=Q_X-Q_{\rm loc}
 =\lim_{M\to\infty}^{\rm ordered}
 \{R_{{\rm cont},M}+Q_{p,M}\}.}                     \tag{5.3}
\]

If instead `Q_loc` denotes only the leading conormal model, the known
continuous `(1,1)` smooth error must be added to the right side of (5.3);
it is lower order on the frozen local packet.  No equality representative
is a term in either formula.

## 6. Exact double-null trace cancellation

This section applies to the frozen compactly supported transition-source
class, for which `f(m lambda)=0` at the relevant corner when `m>=2`.  It
begins only after the ordered unweighted full-profile limit and asserts no
finite-`M` trace cancellation.  It is not a statement for a generic
Schwartz Fourier pair.

The ordered traces satisfy

\[
 \Gamma_{\rm in}-\Gamma_{\rm out}
 ={\sqrt\lambda\over2}\eta.                          \tag{6.1}
\]

Restrict now to a coefficient subspace on which both rows in (0.7) vanish.
Then

\[
 a_f(0)=b_f(0)=0,\qquad
 a_f(L)=\lambda\Gamma_{\rm in}(f)=0.                \tag{6.2}
\]

For the local sampler put

\[
 h(f)={\sqrt\lambda\over2}H(\lambda).
\]

Because `eta=0`, its two corner traces are

\[
 a_f^1(0)=b_f^1(0)=h(f),
 \qquad
 a_f^+(0)=b_f^+(0)=-h(f).                            \tag{6.3}
\]

For two sources `f_j,f_k`, the constant numerator of the three terms in
(0.5) is therefore

\[
 \begin{aligned}
 &\overline{a^1_{f_j}(0)}b^+_{f_k}(0)
 +\overline{a^+_{f_j}(0)}b^1_{f_k}(0)
 +\overline{a^+_{f_j}(0)}b^+_{f_k}(0)\\
 &\hspace{35mm}=-\overline{h(f_j)}h(f_k).
 \end{aligned}                                       \tag{6.4}
\]

This is exactly the negative of the local constant conormal numerator.
If, in addition, the complete one-sided first jets are bounded at the
corner, then

\[
 {\overline{a_{f_j}(s)}b_{f_k}(t)\over s+t}
 =O\!\left({st\over s+t}\right).                    \tag{6.5}
\]

The bound in (6.5) is local at each fixed `lambda`.  Its implicit constant
contains the first-jet rows and may grow with `lambda`.  Hence (6.4)--(6.5)
do not prove that the complete continuous form is `o(tau_L)`, or even
that it has a fixed sign, in exact `D`-white coordinates.  The double-null
conditions cancel only the seam/corner and far endpoint traces: they do
not annihilate any Laplace row `mathcal A_z` or `mathcal B_z`, the odd
tower, or the remainder away from `t=0`.

## 7. No-sign abstract profile countermodel

This section tests only the logical strength of endpoint/seam data and
absolute estimates.  It does not construct a physical source.

Choose `epsilon>0` so small that

\[
 k_{\rm cont}(r)>0,\qquad0<r<2\epsilon.               \tag{7.1}
\]

Take nonzero nonnegative functions

\[
 \phi,\psi\in C_c^\infty((\epsilon/4,\epsilon/2)).
\]

For `N>0`, define an abstract inner profile and two outward profiles by

\[
 a_N(s)=N\phi(s),\qquad b_{N,\pm}(t)=\pm N\psi(t).   \tag{7.2}
\]

Extend only the right continuation tail by

\[
 a_{N,\pm}(L+t)=\lambda b_{N,\pm}(t).                \tag{7.3}
\]

All endpoint and seam jets in (7.2)--(7.3) vanish.  The two choices have
identical absolute BV, Sobolev, and Laplace-row magnitude data.  But

\[
 \int_0^L\int_0^\infty
 a_N(s)b_{N,\pm}(t)k_{\rm cont}(s+t)\,dt\,ds
 =\pm N^2c_{\phi,\psi},                              \tag{7.4}
\]

where `c_(phi,psi)>0` by (7.1).  Thus both signs occur at any desired
scale while all of those absolute data agree.

The profiles (7.2)--(7.3) are not asserted to lie in the physical
Fourier-sampler image, to satisfy the global Poisson identity, or to have
an inversion parity.  Their sole conclusion is that endpoint/seam jets,
the continuation-tail identity, and absolute termwise or BV envelopes do
not imply a one-sided sign.  A proof for physical profiles must use their
source-coupled ordered Poisson/Mellin structure.

## 8. Minimal signed lemma and forced-cancellation consequence

Work on the exact quotient by `ker D` and use hats for `D`-white forms.
For a row map, a hat means right multiplication by the Moore--Penrose
factor `D^(dagger/2)` on `overline{ran D}`.
Let a realized packet subspace `E` satisfy

\[
 P_E\widehat Q_{\rm loc}P_E\preceq-\tau_LP_E,
 \qquad
 \tau_L={c^{hC+o(1)}\over L^{2m}}.                   \tag{8.1}
\]

The exact continuous identity gives

\[
 \widehat R_{\rm cont}
 =\widehat Q_{\rm cont}-\widehat Q_{\rm loc}.       \tag{8.2}
\]

Therefore the one-sided completed odd-row lemma

\[
 P_E\left[-\mathsf S(\widehat{\mathcal A}_0,
                       \widehat{\mathcal B}_0)
 +\sum_{\nu\geq1}
 \mathsf S(\widehat{\mathcal A}_{2\nu+1},
            \widehat{\mathcal B}_{2\nu+1})\right]P_E
 \succeq-\varepsilon_L\tau_LP_E,
 \quad\varepsilon_L\longrightarrow0,               \tag{8.3}
\]

would imply

\[
 \boxed{
 P_E\widehat R_{\rm cont}P_E
 \succeq(1-\varepsilon_L)\tau_LP_E.}                \tag{8.4}
\]

This is the minimal intrinsic continuous-sector route.  A two-sided norm
bound for (8.3) is sufficient but stronger.

Independently, complete absolute sampling gives

\[
 P_E\widehat R_{\rm comp}P_E
 \succeq(\tau_L-B_{{\rm out},q})P_E.                 \tag{8.5}
\]

For fixed `q,m` and `hC>1/2`,

\[
 B_{{\rm out},q}=o(\tau_L).                          \tag{8.6}
\]

Now specialize to the polylogarithmic family of the frozen corollary:
`0<hC<1`, `B_L=(log L)^4`, the positive low-offset margin holds, and the
actual same-phase modes are those supplied by the pinned modal-placement
theorem.  The latter gives `chi_gamma to 1`, hence the gate
`mathsf G_chi`, while the polylog corollary then gives

\[
 \|\widehat Q_{p,11}\|=o(\tau_L).                    \tag{8.7}
\]

Only under these realized-packet hypotheses may (5.3), (8.5), (8.6), and
(8.7) be combined to give

\[
 \boxed{
 P_E(\widehat R_{\rm cont}
       +\widehat Q_{p,\ne11})P_E
 \succeq(1-o(1))\tau_LP_E.}                         \tag{8.8}
\]

Equation (8.8) localizes the forced compensation to two exact completed
assemblies.  It does not imply a Loewner lower bound for either summand
separately.  At most it gives the norm dichotomy

\[
 \max\left\{
 \lambda_{\max}(P_E\widehat R_{\rm cont}P_E),
 \lambda_{\max}(P_E\widehat Q_{p,\ne11}P_E)
 \right\}\geq(1-o(1)){\tau_L\over2}.                \tag{8.9}
\]

The maximizing sector in (8.9) may depend on the direction in `E`.
Neither the difference-of-Grams algebra, the trace cancellation, nor the
countermodel proves (8.3).  The completed odd-row correlation and the
ordered nonlocal prime assembly remain the exact alternatives.
