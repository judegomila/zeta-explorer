# Growing-transition ordered-prime edge-union moving-divisor reduction theorem

## 0. Result and exact scope

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 A=\lambda^2,\qquad c=2\pi A,\qquad L=\log A,
 \qquad \sigma:=hC,\quad {1\over2}<\sigma<1,
 \qquad T_L={A^{hC}\over L^{2m}}={A^\sigma\over L^{2m}}.
                                                               \tag{0.1}
\]

Use the fixed realized two-cluster packet, its exact exterior-defect
whitening, and the seven-row space `E` of the frozen forced-prime theorem.
Every map below is restricted to this white packet.  Put

\[
 I=[\lambda^{-1},\lambda],\qquad
 \mathsf S(U,V)=U^*V+V^*U.                         \tag{0.2}
\]

At finite Fejer cutoff `M` and auxiliary prime cutoff `R`, define maps
from the packet to `L^2(I,du)` by

\[
\begin{aligned}
 (C_Mx)(u)&=\sum_{r\geq1}\omega_M(r)
                    \{f_x+H_x\}(ru),\\
 (P_{M,R}x)(u)&=\sum_{l\geq1}\omega_M(l)
   \sum_{\substack{2\leq n\leq R\\ n\geq\lambda/u}}
                    \Lambda(n)H_x(lnu),\\
 (S_{>,M}x)(u)&=\sum_{r>A}\omega_M(r)H_x(ru),\\
 (P_{A,M,R}x)(u)&=\sum_{l\geq1}\omega_M(l)
   \sum_{A<n\leq R}\Lambda(n)H_x(lnu).
\end{aligned}                                                   \tag{0.3}
\]

The inequality `n>=lambda/u` in (0.3) includes equality.  Its value at
the finitely many resulting integration endpoints is immaterial.  The
exact direct upper form restricted to the disjoint edge union

\[
 \mathcal E_A=\{(m,n):m\leq A\text{ or }n\leq A\}               \tag{0.4}
\]

is

\[
\boxed{
 Q^\uparrow_{{\rm edge},M,R}
 ={1\over2}C_M^*P_{M,R}-{1\over2}S_{>,M}^*P_{A,M,R}.}           \tag{0.5}
\]

Consequently its correctly normalized Hermitian form is

\[
\boxed{
 Q^{\rm raw}_{{\rm edge},M,R}
 ={1\over4}\mathsf S(C_M,P_{M,R})
 -{1\over4}\mathsf S(S_{>,M},P_{A,M,R}).}                     \tag{0.6}
\]

There is no double count in (0.5): the subtracted term is exactly the
complement `m>A,n>A`, with every `l>=1`.  The factor `1/4` in (0.6) is
Hermitian averaging of the direct coefficient `1/2`, not an
unnormalized adjoint.

Take `R to infinity` first and then the ordered Fejer limit
`M to infinity`, both at fixed `lambda`.  Write the limiting maps as
`C,P,S_>,P_A`, and put

\[
 Q_{\rm mov}:={1\over4}\mathsf S(C,P),\qquad
 Q_{>>}^{\rm raw}:={1\over4}\mathsf S(S_>,P_A).                 \tag{0.7}
\]

The local `(m,l)=(1,1)` shell belongs entirely to the edge union.  A
resonance `ln=m` belongs to the edge union exactly when `n<=A`; if
`n>A`, then `m=ln>A` and the resonance belongs to the hard complement.
Thus, with the literal coordinate restrictions indicated by the
subscripts,

\[
\boxed{
 Q_{{\rm off},{\rm edge}}
 =Q_{\rm mov}-Q_{>>}^{\rm raw}-Q_{p,11}-Q_{{\rm res},\leq A}.}  \tag{0.8}
\]

The frozen all-outward theorem gives `||P_EQ_(>>)^(raw)P_E||=o(T_L)`;
the forced-prime theorem gives

\[
 \|P_EQ_{p,11}P_E\|=o(T_L),\qquad
 \|P_EQ_{\rm res}P_E\|=O_m(L^2)=o(T_L),                         \tag{0.9}
\]

and

\[
 \|P_E(Q_{\rm off}+Q_{\rm cont})P_E\|=o(T_L),\qquad
 P_EQ_{\rm cont}P_E\preceq-{c'_m\over4}T_LP_E.                 \tag{0.10}
\]

Since `Q_off=Q_(off,edge)+Q_(off,>>)` and the all-outward theorem also
gives `||P_EQ_(off,>>)P_E||=o(T_L)`, equations (0.8)--(0.10) imply

\[
\boxed{
\begin{aligned}
 \|P_E(Q_{{\rm off},{\rm edge}}+Q_{\rm cont})P_E\|&=o(T_L),\\
 \|P_E(Q_{\rm mov}+Q_{\rm cont})P_E\|&=o(T_L),\\
 P_EQ_{{\rm off},{\rm edge}}P_E&\succeq {c'_m\over8}T_LP_E,\\
 P_EQ_{\rm mov}P_E&\succeq {c'_m\over8}T_LP_E
\end{aligned}}                                                   \tag{0.11}
\]

for all sufficiently large locked `lambda`.  Hence the forced ordered
prime compensation survives in the edge union, and the moving-divisor
cross (0.7) matches the negative continuous form at the same scale.

Although neither `C` nor `P` separately has a sign or a presently proved
growing-`lambda` norm bound, (0.11) and the Krein decomposition below do
give one genuine positive feature.  Namely,

\[
 \mathcal G_{{\rm mov},+}:={C+P\over\sqrt8}
 \quad\Longrightarrow\quad
 \boxed{
 \mathcal G_{{\rm mov},+}^*\mathcal G_{{\rm mov},+}
 \succeq {c'_m\over8}T_LI_E,
 \qquad
 s_{\min}(\mathcal G_{{\rm mov},+}|_E)
 \geq\sqrt{{c'_mT_L\over8}}.}                       \tag{0.12}
\]

There is no corresponding separate lower frame for `C` or `P`: the
available near/far estimate bounds the fixed hard-tail map `P_A`, not the
moving-threshold map `P` in (0.3).

The theorem below identifies `C` and `P` exactly.  It does not prove a
positive-square formula for `Q_mov`; its positivity in (0.11) is a
compressed consequence of the complete central matching.  It proves no
complete central sign, determinant conclusion, or RH statement.  The
project state remains `P0_INVALIDATED`.

## 1. Frozen inputs

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md` | `2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97` |
| `tests/test_growing_transition_direct_source_upper_form_theorem.py` | `96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2` |
| `notes/GROWING_TRANSITION_FORCED_ORDERED_NONRESONANT_PRIME_FRAME_THEOREM.md` | `787e0f6c21272169e9c17f764bc1b1e9d9af1a386a4ba6891fddd0746f1c2e79` |
| `tests/test_growing_transition_forced_ordered_nonresonant_prime_frame_theorem.py` | `73913c60eb3862668631a0f846be2d40c82978c62248c9084c173d76913a44b7` |
| `notes/GROWING_TRANSITION_ORDERED_PRIME_ALL_OUTWARD_HARD_TAIL_DIVISOR_REGROUPING_THEOREM.md` | `0f3de001b13125dcb6efe5cd0d9afa5c7a897f47fc732f06aac9f63fa457f50f` |
| `tests/test_growing_transition_ordered_prime_all_outward_hard_tail_divisor_regrouping_theorem.py` | `958c115bae61ff9a20871bcd4c46f74a4ebae1a63260c98e0a7c40210bda33b3` |
| `notes/GROWING_TRANSITION_ORDERED_PRIME_HARD_TAIL_PNT_GRAM_REDUCTION.md` | `b8439dcfa6f969fd84dae8fafb5474c3e176ba14d84c7d73140fabeac042a4be` |
| `tests/test_growing_transition_ordered_prime_hard_tail_pnt_gram_reduction.py` | `1101aebef550259387eb6220cf8b2740d728c2f52ddf6349b253d6a555248cb6` |

No prime-number theorem, short-interval estimate, external FIO theorem,
zero list, or numerical prolate datum is added.

## 2. Exact finite-cutoff edge subtraction

The direct-source upper prime form is

\[
 Q^\uparrow_{p,M,R}(x,y)
 ={1\over2}\sum_{m,l\geq1}\sum_{2\leq n\leq R}
 \omega_M(m)\Lambda(n)\omega_M(l)
 \int_{u_n}^{\lambda}
 \overline{\{f_x+H_x\}(mu)}H_y(lnu)\,du,             \tag{2.1}
\]

where

\[
 u_n=\max\{\lambda/n,\lambda^{-1}\}.                \tag{2.2}
\]

For `u in I`, the condition `u>=u_n` is exactly `n>=lambda/u`.
Extending every integral in (2.1) to `I` with this indicator and summing
the left and right slots separately gives

\[
 Q^\uparrow_{p,M,R}={1\over2}C_M^*P_{M,R}.           \tag{2.3}
\]

The complement of (0.4) is `m>A,n>A`.  In that range `u_n=lambda^-1`
and `mu>lambda` on `I`, so the compact source is absent.  Its direct form
is exactly

\[
 Q^\uparrow_{>>,M,R}={1\over2}S_{>,M}^*P_{A,M,R}.   \tag{2.4}
\]

Subtracting (2.4) from (2.3) proves (0.5), and Hermitian averaging proves
(0.6).  Notice that no product `mln` has been formed.  The inward slot,
the right product `ln`, the source orientation, and both finite-cutoff
weights remain visible.

The three coordinate sets `(1,1)`, `ln=m`, and the ordered nonresonant
set are disjoint.  The `(1,1)` set cannot be resonant because `n>=2`.
The placement of resonance relative to the edge union, noted before
(0.8), now proves (0.8) exactly at finite cutoffs and hence in the ordered
limit.

## 3. Ordered limits and the moving divisor layer

Put `q=ln` only in the right slot of `P_(M,R)`.  At finite cutoffs,

\[
 (P_{M,R}x)(u)=\sum_{q\geq1}b_{M,R}(q;u)H_x(qu),      \tag{3.1}
\]

where

\[
\boxed{
 b_{M,R}(q;u)=
 \sum_{\substack{n\mid q,\ 2\leq n\leq R\\n\geq\lambda/u}}
       \Lambda(n)\omega_M(q/n).}                    \tag{3.2}
\]

There is no spurious factor `omega_M(q)`.  Positivity of the Fejer
weights and the divisor identity give

\[
 0\leq b_{M,R}(q;u)\leq\sum_{d\mid q}\Lambda(d)=\log q.          \tag{3.3}
\]

Endpoint-null `W^(2,1)` regularity gives `H_x(t)=O_(lambda,E)(t^-2)`
uniformly on the white unit sphere at each fixed `lambda`.  Thus (3.3)
dominates (3.1) in operator norm.  Sending `R to infinity` and then
`M to infinity` gives the ordinary series

\[
\boxed{
 (Px)(u)=\sum_{q\geq1}b(q;u)H_x(qu),\qquad
 b(q;u)=\sum_{\substack{n\mid q\\n\geq\max\{2,\lambda/u\}}}
                 \Lambda(n).}                       \tag{3.4}
\]

Equivalently,

\[
\boxed{
 b(q;u)=\log q-
 \sum_{\substack{n\mid q\\2\leq n<\lambda/u}}\Lambda(n).}   \tag{3.5}
\]

If `b(q;u)` is nonzero, then `q>=n>=lambda/u`; hence

\[
 \boxed{qu\geq\lambda.}                             \tag{3.6}
\]

The right slot in the moving-divisor form is therefore purely exterior,
including its literal endpoint.  The coefficient in (3.4) depends on
`u`; it is not an arbitrary constant coefficient to which the frozen
dilation large sieves may be applied without a new argument.

The same decay proves ordinary operator convergence of

\[
 (Cx)(u)=\sum_{r\geq1}\{f_x+H_x\}(ru).              \tag{3.7}
\]

The compact part of this sum is finite at every `u in I`.

## 4. Poisson inversion of the inward row

The sources are even, endpoint-null, and satisfy

\[
 f_x(0)=H_x(0)=0.                                    \tag{4.1}
\]

The admitted ordered Poisson identity gives, at fixed `lambda`,

\[
 \sum_{r\geq1}f_x(ru)={1\over u}\sum_{r\geq1}H_x(r/u),
 \qquad
 \sum_{r\geq1}H_x(ru)={1\over u}\sum_{r\geq1}f_x(r/u).        \tag{4.2}
\]

Adding the two identities proves the exact self-reciprocity

\[
\boxed{C_x(u)={1\over u}C_x(1/u).}                  \tag{4.3}
\]

This is an identity of the complete ordered row.  It is not a
coefficientwise identity at finite Fejer cutoff.

There is also a useful compact-side form.  Define the finite compact
periodization

\[
 F_x(a)=\sum_{r\geq1}f_x(ra).                        \tag{4.4}
\]

Poisson summation in the outward `l` slot gives

\[
 (Px)(u)={1\over u}
 \sum_{n\geq\max\{2,\lambda/u\}}{\Lambda(n)\over n}
 F_x\!\left({1\over nu}\right).                    \tag{4.5}
\]

Set `v=1/u` in the oriented cross.  Equations (4.3)--(4.5) and
`du=-dv/v^2` cancel both Jacobian powers and yield

\[
\boxed{
 \langle Cx,Py\rangle_{L^2(I)}
 =\int_I\overline{C_x(v)}(\mathcal V_\lambda f_y)(v)\,dv,}     \tag{4.6}
\]

where

\[
\boxed{
 (\mathcal V_\lambda f)(v)=
 \sum_{n\geq\max\{2,\lambda v\}}{\Lambda(n)\over n}
       \sum_{r\geq1}f(rv/n).}                       \tag{4.7}
\]

Thus the same moving-divisor carrier is a triangular compact Poisson row
after inversion.  Formula (4.7) inherits the prescribed ordered meaning
from the ordinary exterior series (3.4).

It is illegal to isolate an apparent same-sample term in (4.7).  For
example, selecting `r=mn` would attach to `f(mv)` the divergent scalar

\[
 \sum_{n\geq\max\{2,\lambda v\}}{\Lambda(n)\over n}.             \tag{4.8}
\]

Cancellation with the other `r` terms, forced by the zero-integral
source and Poisson summation, is essential.  Hence (4.7) supplies no
positive diagonal Gram and cannot be rearranged into one.

Algebraically the only automatic square decomposition is the indefinite
Krein identity

\[
\boxed{
 Q_{\rm mov}={1\over8}
 \{(C+P)^*(C+P)-(C-P)^*(C-P)\}.}                    \tag{4.9}
\]

It has no intrinsic sign.

Nevertheless, write `mathcal G_(mov,+)=(C+P)/sqrt(8)` and
`mathcal G_(mov,-)=(C-P)/sqrt(8)`.  Then (4.9) is

\[
 Q_{\rm mov}=\mathcal G_{{\rm mov},+}^*
                  \mathcal G_{{\rm mov},+}
             -\mathcal G_{{\rm mov},-}^*
                  \mathcal G_{{\rm mov},-}.         \tag{4.10}
\]

The second Gram is nonnegative, so the compressed lower bound in (0.11)
proves (0.12).  This implication uses no upper bound for `P` and must not
be converted into a claimed lower frame for `C` alone.

## 5. Disjoint low-prime geometry

For completeness, the `n<=A` edge can be split without overlap before
Poisson summation.  Put `v=nu`, so `v in [lambda,nlambda]`, and define

\[
\begin{aligned}
 (A_{<n,M}x)(v)&=\sum_{r<n}\omega_M(r)
                   \{f_x+H_x\}(rv/n),\\
 (H_{\geq n,M}x)(v)&=\sum_{r\geq n}\omega_M(r)H_x(rv/n),\\
 (B_Mx)(v)&=\sum_{l\geq1}\omega_M(l)H_x(lv).
\end{aligned}                                                     \tag{5.1}
\]

Then exactly

\[
\boxed{
 Q^\uparrow_{\leq A,M}
 ={1\over2}\sum_{2\leq n\leq A}{\Lambda(n)\over n}
 \{A_{<n,M}^*B_M+H_{\geq n,M}^*B_M\}.}             \tag{5.2}
\]

The first summand is the compact-tail geometry.  The second is tail-tail,
because `rv/n>=lambda` at its lower endpoint.  Every resonance `r=ln`
lies in the second summand; no triple in the first can be resonant.

After the ordered unweighted limit, split the first row into its compact
and Fourier parts and apply Poisson summation in both complete sampler
sums.  Endpoint support makes

\[
\begin{aligned}
 \sum_{r<n}f_x(rv/n)&={n\over v}\sum_{a\geq1}H_x(an/v),\\
 \sum_{r\geq1}H_x(rv/n)&={n\over v}\sum_{a\geq1}f_x(an/v),\\
 \sum_{l\geq1}H_y(lv)&={1\over v}\sum_{b\geq1}f_y(b/v).
\end{aligned}                                                     \tag{5.3}
\]

Therefore the complete low-prime upper edge is the slot-preserving
triangular convolution

\[
\boxed{
 Q^\uparrow_{\leq A}(x,y)
 ={1\over2}\sum_{2\leq n\leq A}\Lambda(n)
 \int_\lambda^{n\lambda}{1\over v^2}
 \overline{\sum_{a\geq1}\{f_x+H_x\}(an/v)}
 \sum_{b\geq1}f_y(b/v)\,dv.}                       \tag{5.4}
\]

Equivalently, with `t=n/v`,

\[
 Q^\uparrow_{\leq A}(x,y)
 ={1\over2}\sum_{2\leq n\leq A}{\Lambda(n)\over n}
 \int_{1/\lambda}^{n/\lambda}
       \overline{C_x(t)}F_y(t/n)\,dt.               \tag{5.5}
\]

Equations (5.2)--(5.5) retain the literal truncated interval and show why
neither the current common-interval dilation large sieves nor the frozen
one-sided odd-Laplace estimate directly bounds this low-prime edge.

## 6. Fail-closed analytic boundary

The all-outward theorem removes `m>A,n>A` only after the exact product
coefficient in its common hard interval has been formed.  It does not
bound (3.4), whose divisor threshold moves with `u`.  Likewise, the
one-sided odd-Laplace theorem is an ordered complete-row statement and
does not provide a finite-Fejer coefficientwise estimate for (5.2).

The local curved FIO theorem controls the literal `(m,l)=(1,1)` shell.
Extending its arbitrary-integer scalar hard-end bound to the aggregated
`m=1,n>A,l>=1` product coefficient is a plausible separate corollary,
but it is not used here.  Such a corollary must preserve the factor
`Lambda(n)`, the outward weight `omega_M(l)`, all four polylogarithmic
modal orientations, and the exact white congruence before it is admitted.

Thus the smallest exact remaining carrier furnished by the present
theorem is (0.7), equivalently (3.4) or (4.6)--(4.7), with the hard block,
local shell, and resonance removed as in (0.8).  A proof based only on
`0<=b(q;u)<=log q` would destroy the oscillatory Gram cancellation, while
an attempted positive diagonal extraction violates (4.8).  A new
two-sided edge FIO/frame estimate must act on the complete ordered cross.
