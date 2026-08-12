# Growing-transition ordered-prime hard-tail PNT--Gram reduction

## 0. Exact result and claim boundary

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 A=\lambda^2,\qquad c=2\pi A,\qquad L=2\log\lambda .       \tag{0.1}
\]

Let `E` be any fixed finite-dimensional realized source space on which the
corrected source has no invisible-origin bump, belongs to
`W^(2,1)([-lambda,lambda])`, is even, is extended by zero continuously,
and satisfies

\[
 f_x(0)=0,\qquad H_x(0)=\int_{\mathbb R}f_x=0,
 \qquad f_x(\lambda)=0,qquad H_x=\mathcal F_a f_x .       \tag{0.2}
\]

Use the exact exterior-defect norm

\[
 \|x\|_D^2=2\int_\lambda^\infty|H_x(v)|^2\,dv.           \tag{0.2a}
\]

The stated regularity, continuous zero extension, and endpoint null give
`H_x(t)=O_x(t^(-2))`; all sampler sums below are
therefore ordinary convergent sums after the prescribed ordered Fejer limit
at fixed `lambda`.  Put

\[
 I=[\lambda^{-1},\lambda],\qquad
 (\mathcal T_r x)(u)=H_x(ru),\quad u\in I.                \tag{0.3}
\]

For a finite integer window

\[
 W=(X,Y]\cap\mathbb Z,\qquad A<X<Y,                      \tag{0.4}
\]

define maps into `L^2(I,du)` by

\[
 \mathcal S_W=\sum_{r\in W}\mathcal T_r,
 \qquad
 \mathcal R_W=\sum_{n\in W}\{\Lambda(n)-1\}\mathcal T_n.
                                                                    \tag{0.5}
\]

Then the exact `l=1`, `m,n in W` Hermitian prime block is

\[
\boxed{
 Q_{1,W}={1\over2}\mathcal S_W^*\mathcal S_W
 +{1\over4}\{\mathcal S_W^*\mathcal R_W
                 +\mathcal R_W^*\mathcal S_W\}.}         \tag{0.6}
\]

The first term is the exact lattice-density, or PNT-main, Gram.  The
arithmetic remainder is a single slot-preserving PNT-discrepancy cross.
No product `mln`, outer mask, equality representative, or midpoint row is
used.

Inside this window the ordered resonance is precisely `m=n` and equals

\[
 Q_{{\rm res},1,W}
 ={1\over2}\sum_{n\in W}\Lambda(n)\mathcal T_n^*\mathcal T_n
 \succeq0.                                                \tag{0.7}
\]

Consequently the exact nonresonant part is

\[
\boxed{
 Q_{{\rm off},1,W}
 ={1\over2}\mathcal S_W^*\mathcal S_W
 +{1\over4}\{\mathcal S_W^*\mathcal R_W
                 +\mathcal R_W^*\mathcal S_W\}
 -{1\over2}\sum_{n\in W}\Lambda(n)\mathcal T_n^*\mathcal T_n .}
                                                               \tag{0.8}
\]

The diagonal term in (0.8) is a positive subblock of the already bounded
ordered resonance.  Thus the lattice main can have a large positive part,
but after resonance removal it creates no negative part beyond the
diagonal cost.  The only new indefinite term is the cross containing
`mathcal R_W`.

Let

\[
 \psi_C(t)=\sum_{2\leq n\leq t}\Lambda(n),\qquad
 N(t)=\lfloor t\rfloor,\qquad D(t)=\psi_C(t)-N(t).       \tag{0.9}
\]

With ordinary right-continuous endpoint conventions, (0.5) has the exact
operator-valued Stieltjes forms

\[
\boxed{
 \begin{aligned}
 \mathcal R_W
 &=\int_{(X,Y]}\mathcal T_t\,dD(t)\\
 &=\{D(Y)-D(X)\}\mathcal T_Y
   -\int_X^Y\{D(t)-D(X)\}\mathcal T'_t\,dt,\\
 (\mathcal T'_t x)(u)&=uH'_x(tu).
 \end{aligned}}                                         \tag{0.10}
\]

For the complete hard tail, write

\[
 \mathcal S_A=\sum_{r>A}\mathcal T_r,\qquad
 \mathcal R_A=\sum_{n>A}\{\Lambda(n)-1\}\mathcal T_n . \tag{0.11}
\]

Since `A=p^2/4` is not an integer, no midpoint convention occurs at `A`,
`mathcal T_A` means the continuous dilation-row evaluation at the real
number `A`, not a prime or lattice atom, and integration by parts gives

\[
\boxed{
 \mathcal R_A=-D(A)\mathcal T_A
              -\int_A^\infty D(t)\mathcal T'_t\,dt.}    \tag{0.12}
\]

For every fixed outward sampler `l>=2`, define

\[
 \mathcal U_{l,A}=\sum_{n>A}\mathcal T_{ln},\qquad
 \mathcal R_{l,A}=\sum_{n>A}\{\Lambda(n)-1\}\mathcal T_{ln}.
                                                               \tag{0.13}
\]

The `m>A,n>A` Hermitian block is exactly

\[
\boxed{
 Q_{l,>>}={1\over4}\{\mathcal S_A^*\mathcal U_{l,A}
                         +\mathcal U_{l,A}^*\mathcal S_A\}
 +{1\over4}\{\mathcal S_A^*\mathcal R_{l,A}
                         +\mathcal R_{l,A}^*\mathcal S_A\}.}
                                                               \tag{0.14}
\]

Unlike (0.6), the deterministic term in (0.14) is only a cross Gram and
has no asserted sign.  Exact Poisson summation retains its hard endpoint:

\[
\boxed{
 (\mathcal U_{l,A}x)(u)
 ={1\over lu}\sum_{r\geq1}f_x\!\left({r\over lu}\right)
 -\sum_{1\leq n\leq A}H_x(lnu).}                    \tag{0.15}
\]

In particular,

\[
\boxed{
 (\mathcal U_{l,A}x)(\lambda^{-1})
 ={\lambda\over l}\sum_{r=1}^{l-1}f_x(r\lambda/l)
 -\sum_{1\leq n\leq A}H_x(ln/\lambda).}             \tag{0.16}
\]

The first sum in (0.16) is empty for `l=1`.  For `l>=2` it is a genuine
incomplete-endpoint row; the omitted `r=l` term is exactly
`f_x(lambda)=0`, and `r>l` is outside the compact support.  It may not be
discarded or replaced by an outer fixed-product mask.

Equations (0.6)--(0.16) are exact reductions.  They prove neither that the
PNT-discrepancy cross is small nor that the higher-sampler deterministic
cross has a sign.  The minimal new `l=1` operator gate on a conductor
window is

\[
\boxed{
 \left\|P_E\{\mathcal S_W^*\mathcal R_W
                 +\mathcal R_W^*\mathcal S_W\}P_E\right\|
 =o(T_L),\qquad
 T_L={c^{hC+o(1)}\over L^{2m}}.}                    \tag{0.17}
\]

No theorem frozen in the repository proves (0.17).

## 1. Frozen inputs

The following bytes are the only frozen inputs.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md` | `2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97` |
| `tests/test_growing_transition_direct_source_upper_form_theorem.py` | `96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2` |
| `notes/GROWING_TRANSITION_ORDERED_PRIME_RESONANCE_AND_NONRESONANT_FRAME_GATE_THEOREM.md` | `511abdb8dd5e9bfe765e518812f19ab8df351803438c0a731387f3dd8d413460` |
| `tests/test_growing_transition_ordered_prime_resonance_and_nonresonant_frame_gate_theorem.py` | `634ec6af8e27db305c22d305d12bdd650b834d947c8afa9a3d6dbf27120482b8` |
| `notes/GROWING_TRANSITION_ODD_LAPLACE_EULER_RESOLVENT_MIXED_EDGE_ALIAS_REDUCTION_THEOREM.md` | `289cc268263df97c0b778dc81cc982023a2793675dcb10c1b225ef42e965a467` |
| `tests/test_growing_transition_odd_laplace_euler_resolvent_mixed_edge_alias_reduction_theorem.py` | `395f53fcd03dc26b8951cd8b1b208b811ae1479c90ad4b15d841c825bad93f05` |
| `notes/GROWING_TRANSITION_ETA_NULL_RENORMALIZED_SOURCE_KREIN_INTERTWINER_THEOREM.md` | `0c7c20639645d912d0e896bf064f83e3bd26078d716a183fa703d1586673d0d5` |
| `tests/test_growing_transition_eta_null_renormalized_source_krein_intertwiner_theorem.py` | `fac207d0c4847e7f624848aa174fae013f7099382d9ba785651be634849c5505` |
| `notes/GROWING_TRANSITION_TWO_CLUSTER_MODAL_PLACEMENT_LEAKAGE_NORMALIZATION_THEOREM.md` | `7859533dd83b94708ee73658e6b6c94eb78418a333082c875f0629b244efe564` |
| `tests/test_growing_transition_two_cluster_modal_placement_leakage_normalization_theorem.py` | `caef856880cbc01e95b45209a5dc1a41d669c43a9f868552e6b7d33fd2e0cc8c` |
| `notes/WEIGHTED_PNT_DISCREPANCY_NORMAL_FORM.md` | `eda566d5a2867d28f5218a89a48cc95c30fe74491fb11bb74b86c7fb6ed68ac6` |
| `tests/test_weighted_pnt_discrepancy_normal_form_source_lock.py` | `a28319345a0c81628b6d6a767fdc430b2734565d805b7b300f5818c8253212f7` |

No prime-number theorem, short-interval estimate, zero list, or numerical
prolate datum is used in the exact identities.

## 2. Ordered hard-tail rows after `v=mu`

At finite Fejer cutoff the direct-source upper prime form is

\[
 Q^\uparrow_{p,M}(x,y)
 ={1\over2}\sum_{m,n,l}\omega_M(m)\Lambda(n)\omega_M(l)
 \int_{u_n}^{\lambda}
 \overline{\{f_x+H_x\}(mu)}H_y(lnu)\,du,              \tag{2.1}
\]

where

\[
 u_n=\max\{\lambda/n,\lambda^{-1}\}.                  \tag{2.2}
\]

For `n>A`, (2.2) is exactly `lambda^(-1)`.  For `m>A` and
`u>=lambda^(-1)`, one has `mu>lambda`; hence the compact source vanishes
and the left row is `mathcal T_m`.  Changing variables `v=mu` gives the
exact slot-preserving correlation

\[
\boxed{
 \langle\mathcal T_mx,\mathcal T_{ln}y\rangle
 ={1\over m}\int_{m/\lambda}^{m\lambda}
 \overline{H_x(v)}H_y\!\left({ln\over m}v\right)\,dv.} \tag{2.3}
\]

Both hard endpoints are retained.  In particular, with `m=ln+d`,

\[
 {1\over ln+d}\int_{(ln+d)/\lambda}^{(ln+d)\lambda}
 \overline{H_x(v)}
 H_y\!\left({ln\over ln+d}v\right)\,dv,               \tag{2.4}
\]

whose two arguments at the lower endpoint are `(ln+d)/lambda` and
`ln/lambda`.  The case `d=0` is the positive resonance; (2.4) records why
an off-resonant hard endpoint cannot be replaced by a common outer mask.

Take the ordered limit `M to infinity` at fixed `lambda` only after
(2.1) is formed.  On the finite window (0.4), the `m,n` sums may then be
collected without changing either slot:

\[
 Q^\uparrow_{1,W}
 ={1\over2}\mathcal S_W^*
       \left\{\mathcal S_W+\mathcal R_W\right\}.       \tag{2.5}
\]

Hermitian averaging of (2.5), rather than adding an unnormalized adjoint,
proves (0.6).  The condition `m=n` is exactly `ln=m` when `l=1`, so
subtracting (0.7) proves (0.8).  Since every index in `W` exceeds `A`,
the local `(m,l)=(1,1)` shell is disjoint from this block.

For the complete hard tail the same calculation gives

\[
 Q_{1,>>}={1\over2}\mathcal S_A^*\mathcal S_A
 +{1\over4}\{\mathcal S_A^*\mathcal R_A
                 +\mathcal R_A^*\mathcal S_A\}.        \tag{2.6}
\]

For fixed `l>=2`, the prime-weighted right map is
`mathcal U_(l,A)+mathcal R_(l,A)`, which proves (0.14).  There is no
algebraic conversion of its first line into a square when `l>=2`.

## 3. Additive near-diagonal main and its scale ledger

The lattice Gram has the exact additive convolution

\[
 \mathcal S_W^*\mathcal S_W
 =\sum_d\ \sum_{\substack{n\in W\\n+d\in W}}
       \mathcal T_{n+d}^*\mathcal T_n.               \tag{3.1}
\]

The full sum in (3.1), not an individual `d` slice, is positive.  Its
`d=0` slice is the unweighted diagonal Gram.  The corresponding physical
weighted diagonal is (0.7) and is a positive subblock of the frozen
ordered resonance, so on every fixed-dimensional white packet

\[
 \|P_EQ_{{\rm res},1,W}P_E\|=O_E(L^2)=o(T_L).         \tag{3.2}
\]

Thus (0.8) identifies the only possible conductor-scale alternatives:
a large positive eigenvalue of the lattice Gram, or a large signed
PNT-discrepancy cross.  No negative lattice-main conclusion follows from
deleting selected `d` slices.

The exact exterior metric gives, for `D`-unit `x`,

\[
 \begin{aligned}
 \sum_{n\in W}\|\mathcal T_nx\|^2
 &=\sum_{n\in W}{1\over n}
   \int_{n/\lambda}^{n\lambda}|H_x(v)|^2\,dv\\
 &\leq\left(\sum_{n\in W}{1\over n}\right)
       \int_\lambda^\infty|H_x(v)|^2\,dv.
 \end{aligned}                                          \tag{3.3}
\]

For a conductor window `X asymp Y asymp c`, (3.3) is `O_E(1)`.
Cauchy--Schwarz over the `O(c)` rows then gives only

\[
 \|\mathcal S_WP_E\|^2=O_E(c).                        \tag{3.4}
\]

This is compatible with a Gram eigenvalue on every intermediate scale
`T_L=c^(hC+o(1))/L^(2m)`, `1/2<hC<1`; (3.4) neither proves nor excludes
such an eigenvalue.  It is the sharp boundary of the present algebraic
reduction.

## 4. Exact PNT discrepancy and the insufficient pointwise route

Both `psi_C` and `N` in (0.9) are right-continuous step functions, and
`dD` has mass `Lambda(n)-1` at every positive integer `n`.  Therefore the
first line of (0.10) is exactly (0.5).  For a continuous differentiable
operator row, Stieltjes integration by parts on `(X,Y]` gives

\[
 \mathcal R_W=D(Y)\mathcal T_Y-D(X)\mathcal T_X
              -\int_X^YD(t)\mathcal T'_t\,dt.          \tag{4.1}
\]

Subtracting the constant `D(X)` inside the integral converts (4.1) to the
second line of (0.10).  Hence there is no unrecorded lower-endpoint atom.

For the infinite tail, the fixed-dimensional `W^(2,1)` bound is uniform on
the `D`-unit sphere at each fixed `lambda`.  Two endpoint-null integrations
by parts give

\[
 \|\mathcal T_BP_E\|=O_{\lambda,E}(B^{-2}).             \tag{4.1a}
\]

The elementary inequalities

\[
 \Lambda(n)\leq\log n,\qquad
 |D(B)|\leq\psi_C(B)+\lfloor B\rfloor
          \leq B\log B+B                              \tag{4.1b}
\]

therefore give
`\|D(B)\mathcal T_BP_E\|=O_(lambda,E)(log(B)/B) to 0`.
No prime-number theorem is used.  Letting `B to infinity` in the finite
identity (4.1) with `X=A` proves (0.12); its integral is the resulting
improper operator limit.  The term `-D(A)mathcal T_A` is mandatory even
though `A` is not an integer, and `mathcal T_A` is the continuous row
specified above.

To display why a pointwise PNT insertion does not close the packet scale,
put

\[
 \Delta_W=\sup_{X\leq t\leq Y}|D(t)-D(X)|,
 \qquad
 J_{1,E}=\sup_{\substack{x\in E\\\|x\|_D=1}}
 \left(\int_\lambda^\infty v^2|H'_x(v)|^2\,dv\right)^{1/2}. \tag{4.2}
\]

At each fixed `lambda`, `J_(1,E)` is finite.  No frozen theorem gives it a
subpolynomial growing-`lambda` bound.  Direct changes of variables give

\[
 \|\mathcal T_tP_E\|\ll_Et^{-1/2},\qquad
 \|\mathcal T'_tP_E\|\leq t^{-3/2}J_{1,E}.            \tag{4.3}
\]

For `X asymp Y asymp c`, (0.10), (3.4), and (4.3) yield only

\[
 \begin{aligned}
 \|\mathcal R_WP_E\|
 &\ll_E\Delta_Wc^{-1/2}(1+J_{1,E}),\\
 \|P_E(\mathcal S_W^*\mathcal R_W
       +\mathcal R_W^*\mathcal S_W)P_E\|
 &\ll_E\Delta_W(1+J_{1,E}).
 \end{aligned}                                        \tag{4.4}
\]

For comparison only, the classical zero-free-region PNT bound has the
standard qualitative size
`Delta_W <= c exp(-a sqrt(log c))`, which is `c^(1-o(1))`, not
`o(T_L)` when `hC<1`.  Thus it does not close (0.17).  Even the RH-scale
pointwise estimate `Delta_W=O(c^(1/2)log^2 c)` does not by itself close
(0.17), because `J_(1,E)` is presently uncontrolled.  Claiming otherwise
would hide the missing oscillatory derivative estimate.

The pointwise family

\[
 \psi_C(x)-x=O_\epsilon(x^{1/2+\epsilon})
 \quad\hbox{for every }\epsilon>0                    \tag{4.5}
\]

is the standard von Koch criterion equivalent to RH.  These two pointwise
comparisons are diagnostic conditions, not inputs to the exact theorem;
the frozen weighted-PNT normal form records why inserting only an absolute
PNT envelope does not control a source-coupled discrepancy operator.
Importing (4.5) as a universal discrepancy bound
would therefore be circular in an RH attack.  The packet gate (0.17)
itself is not shown to be RH-equivalent: it tests only finitely many
source-dependent, bilinear, operator-valued moments of `D`.  A direct
large-sieve or source-coupled oscillatory proof of (0.17) could be strictly
weaker than (4.5).  No reverse implication from (0.17) to (4.5) is
asserted.

## 5. Higher samplers and the incomplete hard endpoint

Apply the admitted ordered Poisson identity

\[
 \sum_{n\geq1}H_x(an)={1\over a}\sum_{r\geq1}f_x(r/a) \tag{5.1}
\]

with `a=lu`.  Subtracting precisely the integers `1<=n<=A` proves
(0.15).  At `u=lambda^(-1)`, compact support leaves only `r<=l`.
The `r=l` value vanishes by `f_x(lambda)=0`, proving (0.16) with no
half-endpoint convention.

The higher-sampler discrepancy has the parallel exact form

\[
\boxed{
 \begin{aligned}
 \mathcal R_{l,W}
 &:=\sum_{n\in W}\{\Lambda(n)-1\}\mathcal T_{ln}\\
 &=\{D(Y)-D(X)\}\mathcal T_{lY}
   -\int_X^Y\{D(t)-D(X)\}\,{d\over dt}\mathcal T_{lt}\,dt,\\
 \left({d\over dt}\mathcal T_{lt}x\right)(u)
 &=luH'_x(ltu).
 \end{aligned}}                                        \tag{5.2}
\]

For `m=ln+d`, formula (2.4) shows that the two hard arguments remain
separated by `d/lambda`.  Exact resonance is only `d=0`.  A proof that
ratio-separated `d` are lower order must control (2.4) or (5.2) in these
ordered slots.  Scalar regrouping by `mln`, deletion of (0.16), or a
pointwise PNT envelope does not do so.

The deterministic first line of (0.14), the discrepancy second line, and
the incomplete row (0.16) are three distinct objects.  This note supplies
their exact decomposition and no sign or asymptotic for their sum.

## 6. Conclusion

The `l=1`, `m,n>A` prime tail has an exact PNT--Gram normal form.  On a
conductor window its lattice-density main is positive, its exact resonance
is already lower order, and all remaining arithmetic uncertainty is the
bilinear discrepancy gate (0.17).  For `l>=2`, the lattice-density main is
an indefinite cross Gram and Poisson summation produces the mandatory
finite hard-end row (0.16).

These statements identify the missing slot-preserving estimate but do not
prove it.  In particular they prove no complete prime sign, no complete
central sign, no equation (5.2) of `DIRECT_RH_ATTACK.md`, no determinant
convergence, and no RH statement.  The project state remains
`P0_INVALIDATED`.
