# Growing-transition ordered-prime resonance and nonresonant frame-gate theorem

## 0. Exact result and fail-closed boundary

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 A=\lambda^2,\qquad c=2\pi A,\qquad L=\log A .       \tag{0.1}
\]

At a finite Fejer cutoff, retain the ordered prime indices

\[
 m\quad\hbox{in the inward slot},\qquad
 q=ln\quad\hbox{in the outward slot},\qquad n\geq2. \tag{0.2}
\]

No scalar fixed-product regrouping is made in the direct form.  If
`mathcal A_(m,n)` and `mathcal B_(q,n)` are the exact restricted sampling
maps defined in Section 2, then the prime remainder after removing only
`(m,l)=(1,1)` is

\[
 \boxed{
 Q_{p,\ne11,M}={1\over4}
 \sum_{\substack{m,n,l\\(m,l)\ne(1,1)}}
 \omega_M(m)\Lambda(n)\omega_M(l)
 \mathsf S(\mathcal A_{m,n},\mathcal B_{ln,n}),}
 \qquad
 \mathsf S(U,V)=U^*V+V^*U .                            \tag{0.3}
\]

The ordered resonance `ln=m` is exceptional.  Its inward sample is
already exterior on the entire integration interval, so the two maps in
(0.3) agree.  Consequently

\[
 \boxed{
 Q_{{\rm res},M}={1\over2}
 \sum_{ln=m}\omega_M(m)\Lambda(n)\omega_M(l)
 \mathcal B_{m,n}^*\mathcal B_{m,n}\succeq0.}         \tag{0.4}
\]

In the exact positive-tail coordinate `x=v/lambda`, its multiplier is

\[
 \boxed{
 w_{{\rm res},M}(x)={1\over2}
 \sum_{l\leq x}{\omega_M(l)\over l}
 \sum_{\substack{x/l\leq n\leq Ax/l\\n\geq2}}
 {\Lambda(n)\over n}\omega_M(ln),\qquad x\geq1.}    \tag{0.5}
\]

Let the realized packet use a fixed number `q_0` of even prolate modes in
one Fourier phase and suppose `d_nu<1/2` for every retained modal label
`nu`.  This is eventually true for the pinned low-leakage same-phase
packet.  The frozen transition-tail theorem and the elementary inequality
`Lambda(n)<=log n` imply, uniformly at every finite cutoff,

\[
 \boxed{
 0\preceq Q_{{\rm res},M}
 \preceq Cq_0(1+L^2)D.}                               \tag{0.6}
\]

Thus, in exact exterior-Gram-white coordinates,

\[
 \boxed{
 \sup_M\|\widehat Q_{{\rm res},M}\|
 =O_{q_0}(L^2)=o(\tau_L),\qquad
 \tau_L={c^{hC+o(1)}\over L^{2r}},}                  \tag{0.7}
\]

for every fixed `hC>0` and fixed local conormal order `r`.  In particular,
the ordered resonance cannot supply the forced exponential-scale
compensation on the realized fixed-`q_0` packet.

The nonresonant remainder has the exact difference-of-positive-Grams
factorization

\[
 \boxed{
 Q_{{\rm off},M}:=Q_{p,\ne11,M}-Q_{{\rm res},M}
 =\mathcal G_{+,M}^*\mathcal G_{+,M}
  -\mathcal G_{-,M}^*\mathcal G_{-,M}.}              \tag{0.8}
\]

Neither sign follows from (0.8).  The smallest intrinsic one-sided target
is the ordered nonresonant frame inequality in Section 7.

There is a binding representative obstruction before the fixed-product
POST machinery can be used.  At finite cutoff put `K_M=X_M+O_M`.  Then

\[
 \boxed{
 -\mathcal W_Z(X_M,O_M)
 =\mathcal W_Z(O_M,O_M)-\mathcal W_Z(K_M,O_M).}       \tag{0.9}
\]

The second term is the finite-Fejer radical defect.  The finite-cutoff
`K_M` is not a global radical.  The divisor masks, midpoint rows, sharp
atoms, and hard patch frozen by the POST and BOTH_MISS packages belong to
the first, outer--outer term in (0.9).  They cannot be pasted into the direct
form (0.3) while the radical defect is dropped.  Only the complete
pole--Archimedean--prime defect can cancel in the ordered limit; no such
claim is available blockwise.

The exact outer-only mask arithmetic is recorded in Section 6 so that the
missing bridge is unambiguous.  It proves no direct-form Loewner sign.  An
abstract finite-dimensional countermodel in Section 8 shows that ordered
row algebra plus absolute jump data cannot prove the missing sign.  The
countermodel is not asserted to lie in the physical Fourier-sampler image.

This theorem proves the resonance sign, density, and bound (0.4)--(0.7).
It proves no nonresonant sign, no mask-resolved finite-cutoff radical-defect
identity, no completed Plemelj assembly, no complete central sign, and no
RH statement.  The project state remains `P0_INVALIDATED`.

## 1. Frozen inputs

The following repository bytes are binding inputs.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_CONTINUOUS_ODD_LAPLACE_COMMON_REPRESENTATIVE_BARRIER.md` | `7e65dd6a5cf9035054f01bf52126e25e00635c0414f1a0dc69e70fc2e6ba6a74` |
| `tests/test_growing_transition_continuous_odd_laplace_common_representative_barrier.py` | `d3369b104aa2ebdfa685c2ae5d1529c55b1702d442b6dd81d5569294f42f1140` |
| `notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md` | `2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97` |
| `tests/test_growing_transition_direct_source_upper_form_theorem.py` | `96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2` |
| `notes/TRANSITION_PROLATE_OUTER_THEOREM.md` | `215f27adc0453f601ced419bd39910cb821c31b2e77678b63874987510f4f9c6` |
| `tests/test_transition_prolate_outer.py` | `bc03f010254e0b56c800b1fc4dfb38cd7ea17a0ebc1133064f751d6eab08b433` |
| `notes/GROWING_TRANSITION_FINITE_FEJER_POST_CORE_QUANTIFIER_THEOREM.md` | `c366a3a379a7b6f147b6cfcef07f9bd2b373e21a392c02b58aaa1e28c038f4a9` |
| `tests/test_growing_transition_finite_fejer_post_core_quantifier_theorem.py` | `409b119b42d8202511d0253a638d08c9e6585e4866337de4a7a14cbae76e9f1a` |
| `notes/GROWING_TRANSITION_POST_PLEMELJ_REGULAR_ACTION_REDUCTION_THEOREM.md` | `c7793bec967d219d06eecee76f5606b871b77b75f068648fcf2607977791afd8` |
| `tests/test_growing_transition_post_plemelj_regular_action_reduction_theorem.py` | `00d3fe6c8eb1c1e145abf4d5d1dbee5e38cd33259b1e33d6316246dc61c6eeb1` |
| `notes/GROWING_TRANSITION_BOTH_MISS_RECIPROCAL_CORE_THEOREM.md` | `0211d021fa37b423f41b2839aeda96630aaac931de0ea3d7d028f95705de29a8` |
| `tests/test_growing_transition_both_miss_reciprocal_core_theorem.py` | `0ec59c581c1109e07d57306dc3eb6752f3ba3a4080cbf4b2683c1ddfe3b41d4c` |
| `notes/GROWING_TRANSITION_ABSOLUTE_SAMPLING_FORCED_CANCELLATION_BARRIER.md` | `eb04692b7ce8e06efe254053ba93e4c5f2051ceffe47e68015c9e12886d77584` |
| `tests/test_growing_transition_absolute_sampling_forced_cancellation_barrier.py` | `3bb7d6c45bd0d4d1564624f7ab9f22532229d51dd51d71a474674081fd266a7b` |

No prime-number theorem, short-interval estimate, zero list, or numerical
prolate datum is added.

## 2. Exact finite-cutoff ordered prime rows

Let `f_x` be the source synthesized by a coefficient vector `x` and put
`H_x=mathcal F_a f_x`.  For `n>=2`, define

\[
 u_n=\max\{\lambda/n,\lambda^{-1}\},\qquad
 \mathcal H_n=L^2([u_n,\lambda],du).                  \tag{2.1}
\]

The two ordered sampling maps into `mathcal H_n` are

\[
 \begin{aligned}
 (\mathcal A_{m,n}x)(u)
  &=\{f_x+H_x\}(mu),\\
 (\mathcal B_{q,n}x)(u)
  &=H_x(qu).
 \end{aligned}                                       \tag{2.2}
\]

The direct-source formula gives

\[
 Q^\uparrow_{p,M}
 ={1\over2}\sum_{m,n,l}
 \omega_M(m)\Lambda(n)\omega_M(l)
 \mathcal A_{m,n}^*\mathcal B_{ln,n}.                \tag{2.3}
\]

Here and below `n>=2`; the sampler weights make the `m,l` sums finite.
Hermitian averaging, rather than an unnormalized sum with the adjoint,
gives

\[
 Q_{p,M}=\operatorname {Herm}Q^\uparrow_{p,M}
 ={1\over4}\sum_{m,n,l}
 \omega_M(m)\Lambda(n)\omega_M(l)
 \mathsf S(\mathcal A_{m,n},\mathcal B_{ln,n}).       \tag{2.4}
\]

Deleting precisely the triples with `m=l=1` proves (0.3).  No condition
is imposed on the product `ln`; in particular, the outward ordered sample
is not replaced by the scalar total product `N=mln`.

Every cross row is a difference of positive Grams:

\[
 \mathsf S(U,V)={1\over2}
 \{(U+V)^*(U+V)-(U-V)^*(U-V)\}.                       \tag{2.5}
\]

Equation (2.5) is exact but has no preferred sign.

## 3. Resonance is an exact positive Gram

Suppose `ln=m`.  If `n<A`, then for `u>=u_n`,

\[
 mu\geq {m\lambda\over n}=l\lambda\geq\lambda.      \tag{3.1}
\]

If `n>A`, then

\[
 mu\geq {m\over\lambda}={ln\over\lambda}
 >l\lambda\geq\lambda.                               \tag{3.2}
\]

Thus the zero-extended compact source satisfies `f_x(mu)=0` except at a
null endpoint.  Hence

\[
 \mathcal A_{m,n}=\mathcal B_{m,n}\quad\hbox{a.e. on }
 [u_n,\lambda].                                       \tag{3.3}
\]

Substitution in (2.4) proves (0.4).  For a quadratic source, changing
variables `v=mu` gives the more explicit formula

\[
 Q_{{\rm res},M}(f)
 ={1\over2}\sum_{l,n}
 {\omega_M(ln)\Lambda(n)\omega_M(l)\over ln}
 \int_{\max\{l\lambda,ln/\lambda\}}^{ln\lambda}
 |H_f(v)|^2\,dv.                                      \tag{3.4}
\]

Put `x=v/lambda`.  The interval condition in (3.4) is equivalent to

\[
 l\leq x,\qquad {x\over l}\leq n\leq {Ax\over l}.   \tag{3.5}
\]

Since `(ln)^(-1)=l^(-1)n^(-1)`, Tonelli proves (0.5) and

\[
 Q_{{\rm res},M}(f)
 =\int_\lambda^\infty
 w_{{\rm res},M}(v/\lambda)|H_f(v)|^2\,dv.           \tag{3.6}
\]

Endpoint inclusions in (3.5) do not affect the integral.  Formula (3.6)
also proves positivity without stationary phase or a mask decomposition.

This direct resonance must not be identified with the prime term in the
outer equality-conductor representative.  In the ordered unweighted
limit, that outer prime term has positive-tail density

\[
 -L_{\lfloor x\rfloor},\qquad
 L_M=\sum_{l\leq M}{\log l\over l},                  \tag{3.7}
\]

whereas (0.5) is a positive multiplicative-window `Lambda` density.  The
weights and signs are different.  Only the fully combined representatives
can agree.

## 4. Uniform exterior-metric bound for the resonance

First bound the scalar density without any prime theorem.  For `Y>=2`,

\[
 \sum_{2\leq n\leq Y}{\Lambda(n)\over n}
 \leq\sum_{2\leq n\leq Y}{\log n\over n}
 \leq C(1+\log Y)^2.                                  \tag{4.1}
\]

Because `0<=omega_M<=1`, (0.5), (4.1), and the harmonic-sum bound give,
with `r(x)=1+log x`,

\[
\begin{aligned}
 w_{{\rm res},M}(x)
 &\leq C r(x)\{L+r(x)\}^2\\
 &\leq C\{L^2r(x)+r(x)^3\},\qquad x\geq1
 \end{aligned}                                      \tag{4.2}
\]

uniformly in `M`.

Now let `H_nu` be a retained even prolate Fourier mode and
`d_nu=1-chi_nu^2`.  The hypothesis `d_nu<1/2` places the mode in the
strict range of the frozen transition-tail theorem.  If

\[
 A_\nu={|h_{\nu,\lambda}(\lambda)|\over\pi},          \tag{4.3}
\]

that theorem gives

\[
 A_\nu^2\leq2592\lambda d_\nu,
 \qquad
 |H_\nu(v)|\leq{6A_\nu\over v},\quad v\geq2\lambda. \tag{4.4}
\]

For every fixed integer `k>=0`, exact leakage on `[lambda,2lambda]` and
(4.4) prove

\[
 \begin{aligned}
 \int_\lambda^\infty
 \{1+\log(v/\lambda)\}^k|H_\nu(v)|^2\,dv
 &\leq C_kd_\nu,\\
 C_k&<\infty,
 \end{aligned}                                       \tag{4.5}
\]

because

\[
 \int_2^\infty{(1+\log x)^k\over x^2}\,dx<\infty.  \tag{4.6}
\]

Let `I` contain `q_0` such modes in one Fourier phase and set

\[
 H_x=\sum_{\nu\in I}a_\nu H_\nu,
 \qquad
 D(x)=\sum_{\nu\in I}d_\nu|a_\nu|^2.                 \tag{4.7}
\]

The equality in (4.7) is the exact exterior Gram on this modal synthesis.
Pointwise Cauchy and (4.5) give, for `k=1,3`,

\[
 \int_\lambda^\infty
 \{1+\log(v/\lambda)\}^k|H_x(v)|^2\,dv
 \leq q_0C_kD(x).                                    \tag{4.8}
\]

Combining (3.6), (4.2), and (4.8) proves (0.6).  Passing to the exact
quotient by `ker D` proves the white estimate in (0.7).  This argument is
uniform in `M`; it does not use the invalid bound obtained by summing
`sum_m log(m)/m` before the resonance intervals are retained.

## 5. The finite-cutoff radical defect

The finite-cutoff profiles are honest functions, so with

\[
 K_M=X_M+O_M                                             \tag{5.1}
\]

sesquilinearity gives

\[
 \mathcal W_Z(K_M,O_M)
 =\mathcal W_Z(X_M,O_M)+\mathcal W_Z(O_M,O_M).         \tag{5.2}
\]

Rearranging proves (0.9).  At the level of the positive source prime
functional `W_p`, the prime signs in
`mathcal W_Z=W_(0,2)-W_R-W_p` give

\[
 \boxed{
 +W_p(X_M,O_M)
 =-W_p(O_M,O_M)+W_p(K_M,O_M).}                        \tag{5.3}
\]

The left side of (5.3) is the direct prime sign in (2.3).  The first term
on the right is the outer--outer prime sign to which the masks apply.  The
last term is not known to be small as a prime block.

In the ordered limit, the physical global radical satisfies the complete
two-sided radical identity.  This does not say that the pole,
Archimedean, and prime pieces of (5.2) vanish separately, and it gives no
finite-`M` radicality.  Therefore a mask proof of the nonresonant direct
form must first resolve `mathcal W_Z(K_M,O_M)` at the same cutoff and in
the same ordered slots.

## 6. Exact outer-only mask arithmetic

This section records arithmetic inside `W_p(O_M,O_M)` only.  It is not a
decomposition of (0.3).

Fix an integer total product `N>A` and put

\[
 y_N=\log(N/A),\qquad0\leq\rho\leq y_N,
 \qquad z=e^\rho,\qquad w=e^{y_N-\rho}.               \tag{6.1}
\]

For an ordered triple `mnl=N` with `n<A`, define

\[
 a_\tau=\log(mn/A)=y_N-\log l,qquad
 b_\tau=\log m.                                       \tag{6.2}
\]

Then the finite-cutoff both-miss coefficient is exactly

\[
 B_{N,M}(\rho)
 =\sum_{\substack{mnl=N\\n<A}}
 \Lambda(n)\omega_M(m)\omega_M(l)
 \mathbf1_{(a_\tau,b_\tau)}(\rho),                  \tag{6.3}
\]

with value `1/2` at either equality.  Since `A` is nonintegral, the two
endpoints never coincide.  In the Stieltjes sense,

\[
 dB_{N,M}=\sum_{\substack{mnl=N\\n<A}}
 \Lambda(n)\omega_M(m)\omega_M(l)
 \{\delta_{a_\tau}-\delta_{b_\tau}\}.               \tag{6.4}
\]

Thus `d(G-B)=-dB`.  The atoms at `m=z` and `l=w` have opposite
orientations.  Their absolute masses do not determine a Loewner sign.

Let

\[
 \ell_M(N)=\sum_{n\mid N}\Lambda(n)\omega_M(N/n).    \tag{6.5}
\]

On the open center mask `N<4A`, `z<2`, `w<2`, inclusion--exclusion gives

\[
 C_M(N):=G_{N,M}-B_{N,M}
 =2\omega_M(1)\ell_M(N)-\omega_M(1)^2\Lambda(N).     \tag{6.6}
\]

Removing the unique `(m,l)=(1,1)` intersection leaves

\[
 \boxed{
 C_{M,\ne11}(N)
 =2\omega_M(1)
 \{\ell_M(N)-\omega_M(1)\Lambda(N)\}.}              \tag{6.7}
\]

For `A<N<2A`, put

\[
 E_{N,M}=\omega_M(1)
 \{\ell_M(N)-\omega_M(1)\Lambda(N)\}.               \tag{6.8}
\]

The equality layer at either endpoint has mass `E_(N,M)`.  Hence the
non-`(1,1)` midpoint coefficient is

\[
 \boxed{
 C^{\rm midpoint}_{M,\ne11}(N)={3\over2}E_{N,M}.}     \tag{6.9}
\]

Every both-miss atom in (6.4) already belongs to the non-`(1,1)` sector:
if `m=l=1`, then `n=N>A`, contrary to the defining condition `n<A`.

The physical outer fold multiplies `G-B` by `-2`.  Neither the positivity
of the scalar coefficient in (6.6) nor the reciprocal constant alias after
the unweighted ordered limit promotes (6.7) to a direct-form operator
sign.  The midpoint rows travel with the Plemelj boundary assembly, the
atoms require the POST jump seminorm, and the exact `x<1` multiplier
remains in the hard Stieltjes factorization.  All three statements are
outer-representative statements until (5.2) is resolved.

## 7. Nonresonant frame gate and ordered quantifiers

Let `mathcal T_off` be the triples in (0.3) satisfying `ln ne m`.  Define
maps into the Hilbert direct sum of their `mathcal H_n` spaces by

\[
 \boxed{
 \mathcal G_{\pm,M}x
 =\bigoplus_{\tau\in\mathcal T_{\rm off}}
 \sqrt{{\omega_M(m)\Lambda(n)\omega_M(l)\over8}}
 \{\mathcal A_{m,n}\pm\mathcal B_{ln,n}\}x.}        \tag{7.1}
\]

Equations (2.5) and (7.1) prove (0.8).  Work now on the exact quotient by
`ker D`, use hats for exterior-Gram whitening, and let a realized packet
subspace `E` carry the local scale `tau_L` from (0.7).  The minimal
intrinsic no-large-negative assertion for the ordered nonresonant prime
assembly is

\[
 \boxed{
 \liminf_{M\to\infty}^{\rm form}
 P_E\{\widehat{\mathcal G}_{+,M}^*
          \widehat{\mathcal G}_{+,M}
       -\widehat{\mathcal G}_{-,M}^*
          \widehat{\mathcal G}_{-,M}\}P_E
 \succeq-\varepsilon_L\tau_LP_E,
 \qquad\varepsilon_L\longrightarrow0.}              \tag{7.2}
\]

Equation (7.2) is not proved.  A two-sided `o(tau_L)` norm estimate is
sufficient but stronger.  A route through the fixed-product POST theorem
must first prove a mask-resolved identity for the finite-cutoff defect in
(5.2), indexed by the ordered pair `(m,ln)` and the prime index `n`.  It
must retain the two midpoint rows, the finite-length tail, every sharp
atom, and the exact hard multiplier.  The scalar coefficient `C_M(N)`
alone cannot distinguish `m` from `ln` and cannot isolate the resonance.

The quantifier order is binding:

1. fix `lambda`, the packet, and a finite cutoff `M`;
2. form (2.3), retain the ordered slots, and Hermitianize at that cutoff;
3. if outer masks are used, retain the same-cutoff radical defect, the
   exact `C_M`, midpoint rows, jump atoms, hard patch, and tail;
4. take the ordered limit `M to infinity` at fixed `lambda`; and
5. only then let `lambda to infinity` on the locked schedule.

A supremum over finite `M` after subtracting an unweighted limiting core
is not licensed.

On the realized polylogarithmic packet, the frozen odd-Laplace theorem and
absolute sampling give

\[
 P_E(\widehat R_{\rm cont}
       +\widehat Q_{p,\ne11})P_E
 \succeq(1-o(1))\tau_LP_E                              \tag{7.3}
\]

when `hC>1/2` and the small `(1,1)` prime shell hypotheses hold.  By (0.7),

\[
 \boxed{
 P_E(\widehat R_{\rm cont}
       +\widehat Q_{\rm off})P_E
 \succeq(1-o(1))\tau_LP_E.}                           \tag{7.4}
\]

Thus the exact remaining alternatives are the completed continuous axes
and the ordered nonresonant prime frame.  Equation (7.4) selects neither.

## 8. Sharp finite-cutoff algebraic countermodel

Take the first locked value `p=5`, so

\[
 \lambda={5\over2},\qquad A={25\over4},               \tag{8.1}
\]

and use the standard cutoff `M=2`.  Then `omega_2(2)=1/3`.  Select the
single nonresonant triple

\[
 (m,n,l)=(2,5,2),\qquad ln=10\ne2,qquad N=mnl=20.    \tag{8.2}
\]

On coefficient space `C^2`, take a unit vector `phi` in the target row
space and define

\[
 Ux=sx_1\phi,\qquad Vx=sx_2\phi.                       \tag{8.3}
\]

The contribution of this triple to (0.3) is

\[
 {\log5\over36}\mathsf S(U,V)
 ={s^2\log5\over36}
 \begin{pmatrix}0&1\\1&0\end{pmatrix}.              \tag{8.4}
\]

Its eigenvalues are

\[
 \pm{s^2\log5\over36}.                               \tag{8.5}
\]

For the corresponding outer mask,

\[
 y_N=\log{16\over5},\qquad
 a_\tau=\log{8\over5},\qquad b_\tau=\log2,          \tag{8.6}
\]

and both mask endpoints lie strictly inside `(0,y_N)`.  Its jump measure
is a positive scalar multiple of

\[
 \delta_{\log(8/5)}-\delta_{\log2}.                   \tag{8.7}
\]

Replacing `V` by `-V` preserves every row norm and every absolute jump
mass but reverses (8.4).  Taking `s^2=36tau_L/log5` realizes eigenvalues
`+tau_L` and `-tau_L`.

This is an abstract ordered-row countermodel.  It is not asserted to be a
physical Fourier pair, a Poisson-completed source, or a prolate packet.
Its conclusion is exact and limited: difference-of-Grams algebra,
positive arithmetic coefficients, midpoint conventions, and absolute
atom data do not prove (7.2).  A physical proof must use the missing
source-coupled, slot-preserving radical-defect identity.

## 9. Conclusion

The ordered prime resonance is completely resolved on every realized
fixed-`q_0` low-leakage packet:

\[
 Q_{{\rm res},M}\succeq0,\qquad
 \sup_M\|\widehat Q_{{\rm res},M}\|=O_{q_0}(L^2)
 =o(\tau_L).                                           \tag{9.1}
\]

The remaining prime problem is genuinely nonresonant.  Its exact direct
form is (0.8), while the available fixed-product masks live in the
outer--outer term of (0.9).  The first missing input is therefore the
finite-cutoff, mask-resolved, ordered-slot radical-defect bridge.  After
that bridge, the signed frame inequality (7.2), or a stronger two-sided
bound, remains to be proved.  No current formula supplies that sign, and
no RH conclusion follows.
