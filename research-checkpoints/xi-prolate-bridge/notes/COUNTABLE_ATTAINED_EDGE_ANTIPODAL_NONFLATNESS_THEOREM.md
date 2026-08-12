# Countable attained edge: antipodal nonflatness theorem

## 0. Exact outcome and claim boundary

Assume RH is false and the centered-zero right edge `B>0` is attained by
countably many distinct conjugate orbits

\[
 \alpha_j=B+i\gamma_j,\qquad \overline{\alpha_j}=B-i\gamma_j,
 \qquad j\geq1,                                    \tag{0.1}
\]

where `gamma_j>0` are distinct and orbit `j` has multiplicity `r_j>=1`.
Put

\[
 b_j=\alpha_j^{-2},\qquad
 \sum_{j\geq1}r_j|b_j|<\infty.                    \tag{0.2}
\]

Let

\[
 K=\overline{\{(e^{i\gamma_1t},e^{i\gamma_2t},\ldots):t\in\mathbb R\}}
 \subset\mathbb T^{\mathbb N}.                    \tag{0.3}
\]

The edge functions

\[
 \begin{aligned}
 P(z)&=2\Re\sum_jr_jb_jz_j,\\
 V(z)&=2\Re\sum_jr_jb_j^2z_j,\\
 W(z)&=2\Re\sum_jr_jb_j^3z_j,
 \end{aligned}                                    \tag{0.4}
\]

and the Turan covariance

\[
 \mathcal C(z)=P(z)W(z)-V(z)^2                    \tag{0.5}
\]

are continuous on `K`.  Their exact Haar mean is

\[
 \boxed{
 \int_K\mathcal C\,d\mu_K
 =-4\sum_{j\geq1}r_j^2|b_j|^2\{\Im b_j\}^2<0.}  \tag{0.6}
\]

Negative mean alone does not synchronize the sign of `P`.  The clean
additional hypothesis is the nonflatness condition

\[
 \boxed{\operatorname {int}_K\{z:P(z)=0\}=\varnothing.} \tag{0.7}
\]

If, in addition, the global antipode

\[
 \epsilon=(-1,-1,\ldots)\in K,                    \tag{0.8}
\]

then there is `z_* in K` with

\[
 \boxed{P(z_*)>0,\qquad \mathcal C(z_*)<0.}       \tag{0.9}
\]

The dense positive semiorbit returns to this phase at unbounded times, and
the return transfers to the strict half-integer natural grid.  The frozen
checkpoint-0.84 residual estimate then gives, conditionally for the locked
actual zeta source,

\[
 \boxed{d_0>0,\qquad d_1>0,\qquad w_{01}>0,
 \qquad d_0d_1-w_{01}^2<0}                        \tag{0.10}
\]

eventually on an unbounded strict-grid sequence.

Two checkable sufficient routes to the synchronized phase (0.9) are proved
here.

1. If the countable ordinate family is jointly rationally independent, then
   `K=T^N`; the antipode is automatic and `P` cannot vanish on an open
   cylinder.
2. When the global antipode belongs to `K`, a finite truncation with margins
   larger than explicit uniform coefficient tails lifts to a phase satisfying
   (0.9), without any global nonflatness theorem.

Condition (0.2) alone does **not** prove (0.7).  On a dependent countable
hull, an absolutely convergent Fourier series can in general vanish on a
nonempty open set; the special coefficients `b_j=(B+i*gamma_j)^(-2)` are not
shown here to exclude that phenomenon.  Therefore this note proves no
arbitrary countably infinite attained-edge obstruction.  It also proves no
RH statement, Lambda bound, equation (5.2) of `DIRECT_RH_ATTACK.md`, full
Laplacian positivity, or routing theorem.  The formal project state remains
`P0_INVALIDATED`.

## 1. Frozen dependencies

| Dependency | SHA-256 |
|---|---|
| `P0_SOURCE_LOCK.json` | `24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251` |
| `P0_NORMALIZATION_AUDIT.md` | `37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df` |
| `P3_SOURCE_LOCK.json` | `42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3` |
| `notes/FINITE_ATTAINED_EDGE_ANTIPODAL_TURAN_OBSTRUCTION.md` | `a8a51e9b7d115eed1e48a358fba0dab0556782a09e851d149c952fdd091bc5fc` |
| `notes/UNIQUE_ATTAINED_EDGE_FIRST_MINOR_OBSTRUCTION.md` | `04c55777689638dff3fa7416bd4380cda0efbf02ea94d55431f4ff0c0787a28d` |
| `notes/ACTUAL_ZERO_FOURTH_MOMENT_HISTORY_REDUCTION.md` | `4488516bd33ad71cf8f9efe665c84b328fba4399501143ad26fc24792a9883be` |
| `notes/ALL_ORDER_PROLATE_ARITHMETIC_FLATNESS.md` | `ecb1b165776fa259dfe01a758d137b5b0267dcbd762b05a6cc1adb9aa2dc6171` |

No external source, numerical artifact, or new source lock is introduced.

## 2. Uniform convergence on the countable hull

For `m=1,2,3`, define

\[
 S_m=2\sum_{j\geq1}r_j|b_j|^m.                   \tag{2.1}
\]

Since `|b_j|<=B^(-2)`, (0.2) implies `S_m<infinity` for all three values of
`m`.  The Weierstrass test therefore gives uniform absolute convergence in
(0.4), first on `T^N` and hence on `K`.  In particular,

\[
 \|P\|_\infty\leq S_1,\qquad
 \|V\|_\infty\leq S_2,\qquad
 \|W\|_\infty\leq S_3.                            \tag{2.2}
\]

The products in (0.5) also converge uniformly, so `C` is continuous.  No
differentiability in the flow parameter is used.  This is important because
(0.2) need not imply convergence of even the first frequency-weighted
coefficient moment.

## 3. Exact negative Haar mean

Let `chi_j(z)=z_j`.  On `K`, restriction to the dense one-parameter subgroup
gives

\[
 \chi_j\overline{\chi_k}(z(t))=e^{i(\gamma_j-\gamma_k)t},
 \qquad
 \chi_j\chi_k(z(t))=e^{i(\gamma_j+\gamma_k)t}.     \tag{3.1}
\]

The first character is trivial exactly when `j=k`, because the positive
ordinates are distinct.  The second is never trivial.  Character
orthogonality for normalized Haar measure therefore gives

\[
 \int_Kz_j\overline {z_k}\,d\mu_K=\delta_{jk},
 \qquad
 \int_Kz_jz_k\,d\mu_K=0.                         \tag{3.2}
\]

For a finite truncation, (3.2) yields

\[
 \begin{aligned}
 \int_KPW\,d\mu_K
 &=2\sum_jr_j^2|b_j|^2\Re(b_j^2),\\
 \int_KV^2\,d\mu_K
 &=2\sum_jr_j^2|b_j|^4.
 \end{aligned}                                    \tag{3.3}
\]

The infinite sums converge.  Indeed `x_j=r_j|b_j|` is in `l1`, hence in
`l2`, and

\[
 r_j^2|b_j|^4=x_j^2|b_j|^2
 \leq B^{-4}x_j^2.                                \tag{3.4}
\]

Uniform convergence permits passage from the finite identities to the
limit.  Since

\[
 \Re(b_j^2)-|b_j|^2=-2\{\Im b_j\}^2,             \tag{3.5}
\]

equation (0.6) follows.  It is strict because

\[
 \Im b_j={-2B\gamma_j\over(B^2+\gamma_j^2)^2}\neq0. \tag{3.6}
\]

Consequently the open set

\[
 \mathcal N=\{z\in K:\mathcal C(z)<0\}           \tag{3.7}
\]

is nonempty.

## 4. Nonflatness plus the antipode synchronizes the signs

Assume (0.7).  If every point of `mathcal N` had `P=0`, then the zero set of
`P` would contain the nonempty open set `mathcal N`, contradicting (0.7).
Thus some `z in mathcal N` has `P(z)!=0`.

Uniform convergence in (0.4) makes multiplication by the antipode legitimate
term by term:

\[
 P(\epsilon z)=-P(z),\qquad
 V(\epsilon z)=-V(z),\qquad
 W(\epsilon z)=-W(z),\qquad
 \mathcal C(\epsilon z)=\mathcal C(z).            \tag{4.1}
\]

Use `z` if `P(z)>0` and `epsilon*z` otherwise.  This proves (0.9).
Continuity supplies constants `delta_P,delta_C>0` and a nonempty open
neighborhood `U` of `z_*` such that

\[
 P(z)>2\delta_P,qquad
 \mathcal C(z)<-2\delta_C
 \quad(z\in U).                                   \tag{4.2}
\]

The minimal condition for this step is merely
`mathcal N` not contained in `{P=0}`.  Condition (0.7) is a clean structural
sufficient hypothesis; Haar-nullity of `{P=0}` would be stronger than
needed.

## 5. Joint rational independence proves nonflatness

Call the countable ordinate family jointly rationally independent when every
finitely supported integer relation

\[
 \sum_jn_j\gamma_j=0                              \tag{5.1}
\]

has all `n_j=0`.  Kronecker's theorem applied to every finite coordinate
projection shows that (5.1) is equivalent to

\[
 K=\mathbb T^{\mathbb N}.                         \tag{5.2}
\]

In particular, the global antipode belongs to `K`.

To prove (0.7), suppose that `P` vanishes on a nonempty open set.  That set
contains a basic open cylinder whose restrictions involve only a finite
coordinate set `F`.  Choose `k` outside `F`, fix all other coordinates, and
vary only `z_k` around the full unit circle.  The resulting function is

\[
 c+2\Re(r_kb_kz_k),                               \tag{5.3}
\]

which is nonconstant because `r_kb_k!=0`.  Every such variation remains in
the cylinder, contradicting its inclusion in `{P=0}`.  Hence (0.7) holds.

This argument uses the full product structure, not merely the existence of
the antipode.  It does not apply to an arbitrary dependent countable hull.

## 6. Quantitative finite-truncation criterion

Let `P_N,V_N,W_N,C_N` denote the first-`N` truncations, let
`K_N=pi_N(K)`, and put

\[
 \tau_m(N)=2\sum_{j>N}r_j|b_j|^m.                 \tag{6.1}
\]

For every lift `z in K` of `y in K_N`,

\[
 |P(z)-P_N(y)|\leq\tau_1,
 \quad |V(z)-V_N(y)|\leq\tau_2,
 \quad |W(z)-W_N(y)|\leq\tau_3.                 \tag{6.2}
\]

Using (2.2),

\[
 \boxed{
 |\mathcal C(z)-\mathcal C_N(y)|\leq E_N,
 \qquad
 E_N=\tau_1S_3+S_1\tau_3+2S_2\tau_2.}           \tag{6.3}
\]

Indeed,

\[
 |PW-P_NW_N|
 \leq|P-P_N|\,|W|+|P_N|\,|W-W_N|,
\]

and

\[
 |V^2-V_N^2|\leq|V-V_N|(|V|+|V_N|).
\]

Therefore the explicit finite condition

\[
 \boxed{
 |P_N(y)|>\tau_1(N),
 \qquad
 \mathcal C_N(y)<-E_N}                            \tag{6.4}
\]

implies that every lift has `P!=0` and `C<0`.  The global antipode then
synchronizes `P>0`.  Since `pi_N:K->K_N` is onto by definition, no extension
of the finite phase is missing.

The tails in (6.1)--(6.3) tend to zero.  What is not automatic is a finite
negative-covariance and nonzero-`P` margin that dominates them.  The finite
analytic nonflatness argument produces a positive margin for each fixed
truncation, but (0.2) supplies no comparison between that margin and the
subsequent infinite tail.  Thus (6.4) is a checkable sufficient criterion,
not a theorem that every countable edge satisfies it.

## 7. Unbounded recurrence and strict natural-grid transfer

Let `phi(t)=z(t)`.  The closure of `phi([0,infinity))` is a compact
subsemigroup of the compact group `K`, hence a subgroup.  It contains every
`phi(t)` with `t>=0`, so it also contains their inverses and equals the
two-sided closure `K`.  The same argument after any time translation shows

\[
 \overline{\{\phi(t):t\geq T\}}=K
 \qquad(T>0).                                      \tag{7.1}
\]

Choose nested neighborhoods of `z_*` inside `U`.  Equation (7.1) gives
times `t_n->infinity` such that

\[
 z(t_n)\longrightarrow z_*.                       \tag{7.2}
\]

For each `t_n`, choose the nearest strict half integer

\[
 \lambda_n={s_n\over2},\qquad s_n\geq5\text{ odd},
 \qquad L_n=2\log\lambda_n.                       \tag{7.3}
\]

The grid spacing gives

\[
 |L_n-t_n|=O(e^{-t_n/2}).                          \tag{7.4}
\]

Unbounded ordinates do not invalidate the phase transfer.  Fix `m=1,2,3`.
For any finite head, (7.4) gives

\[
 e^{i\gamma_jL_n}-e^{i\gamma_jt_n}\longrightarrow0
 \quad(1\leq j\leq N).                           \tag{7.5}
\]

The remaining tail is uniformly at most
`4*sum_(j>N) r_j|b_j|^m`.  First choose `N` to make that tail small, then
use (7.5) on the head.  Hence

\[
 P(z(L_n))\to P(z_*),\quad
 V(z(L_n))\to V(z_*),\quad
 W(z(L_n))\to W(z_*),\quad
 \mathcal C(z(L_n))\to\mathcal C(z_*).           \tag{7.6}
\]

This finite-head/tail proof needs no frequency moment beyond (0.2).

## 8. Transfer to the locked actual first minor

Let `Psi`, `T_q`, `U`, `Y`, `rho_0`, and `rho_1` have the meanings fixed in
the checkpoint-0.84 and finite-edge notes, with

\[
 q=(2\pi/L)^2,qquad
 U=(I-qT_q)\Psi,qquad
 Y=(I-qT_q)^2\Psi.                                \tag{8.1}
\]

Inverse-square zero summability and the qualitative positive lower ordinate
bound permit dominated convergence over the complete countable edge and all
lower lines.  Along (7.3),

\[
 \begin{aligned}
 e^{-BL_n}\Psi&\longrightarrow P(z_*),\\
 e^{-BL_n}T_q\Psi&\longrightarrow V(z_*),\\
 e^{-BL_n}T_q^2\Psi&\longrightarrow W(z_*),\\
 e^{-BL_n}U&\longrightarrow P(z_*),\\
 e^{-BL_n}Y&\longrightarrow P(z_*).
 \end{aligned}                                    \tag{8.2}
\]

Therefore

\[
 \boxed{
 {\Psi T_q^2\Psi-(T_q\Psi)^2\over\Psi^2}
 \longrightarrow{\mathcal C(z_*)\over P(z_*)^2}<0.} \tag{8.3}
\]

No gap below `B` is needed: after multiplication by `e^(-BL)`, every fixed
lower-line term tends to zero and the complete sum has the pinned
inverse-square majorant.

Fix `0<b_0<B`.  The frozen high/low finite-anchor decomposition is uniform
over all zeros with `b_0<=Re(zeta)<=B`; countability of the edge does not
alter its summable high-zero remainder.  It gives

\[
 \rho_0=O_A(Le^{-AL/2}),                           \tag{8.4}
\]

and

\[
 \rho_1=O_{b_0}(L^{-1}e^{b_0L})
 +O_{b_0}(\sqrt L e^{-dL^2})+O_A(Le^{-AL/2}).      \tag{8.5}
\]

Because `P(z_*)>0`, equations (8.2), (8.4)--(8.5), and
`q^2=(2*pi)^4*L^(-4)` yield

\[
 {\Psi\rho_1+Y\rho_0+\rho_0\rho_1\over q^2\Psi^2}
 \longrightarrow0.                               \tag{8.6}
\]

The exact locked identities are

\[
 d_0={2p_0^2\over L}(\Psi+\rho_0),\qquad
 d_1={2p_1^2\over L}(Y+\rho_1),\qquad
 w_{01}=-{2p_0p_1\over L}U,                       \tag{8.7}
\]

and

\[
 {L^2\over4p_0^2p_1^2}(d_0d_1-w_{01}^2)
 =q^2\{\Psi T_q^2\Psi-(T_q\Psi)^2\}
  +\Psi\rho_1+Y\rho_0+\rho_0\rho_1.             \tag{8.8}
\]

Equations (8.2)--(8.8), together with `p_0>0>p_1` eventually, prove (0.10).

## 9. Surviving countable-edge problem

The only new infinite-dimensional obstruction exposed here is local
flatness of the real edge series on a dependent hull.  The implications are

\[
 \begin{array}{c}
 \text{joint rational independence}\\
 \text{or the finite-tail margin (6.4)}
 \end{array}
 \Longrightarrow
 \mathcal C<0,\ P>0\text{ at a recurrent phase}
 \Longrightarrow (0.10).                          \tag{9.1}
\]

Bare `l1` summability gives the continuous functions and negative Haar mean,
but not the nonflatness arrow.  No quasi-analytic coefficient moment,
independent-coordinate structure, or finite-tail margin is known here for
the actual countable attained zeta edge.  In particular, this package does
not claim that such an edge exists or that every such edge forces a negative
minor.  The formal state remains `P0_INVALIDATED`.
