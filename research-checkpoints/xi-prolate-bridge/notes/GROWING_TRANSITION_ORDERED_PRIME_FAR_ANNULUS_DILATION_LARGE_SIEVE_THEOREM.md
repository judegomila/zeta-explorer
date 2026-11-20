# Growing-transition ordered-prime far-annulus dilation large-sieve theorem

## 0. Result and exact scope

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 A=\lambda^2,\qquad c=2\pi A,\qquad L=2\log\lambda=\log A,
 \qquad k=2\pi\lambda.                              \tag{0.1}
\]

Use the realized polylogarithmic two-cluster packet and the exact
exterior-defect whitening of the frozen forced-prime theorem.  Thus the
packet has a fixed number `2m` of modes,

\[
 B_L=(\log L)^4\leq\gamma\leq C_0L,
 \qquad \mu_\gamma=c^2-c\gamma,                     \tag{0.2}
\]

all selected modes have the same even Fourier phase, and a white source
has coordinates

\[
 H_x=\sum_{\gamma\in\mathcal G_L}b_\gamma
          {H_\gamma\over\sqrt{d_\gamma}},
 \qquad \sum_\gamma|b_\gamma|^2=\|x\|_D^2.         \tag{0.3}
\]

The seven-row space `E` of the frozen theorem is a subspace of this white
modal span.  In particular its invisible-origin correction is zero.  The
argument below is valid on the whole span (0.3), so all of its bounds also
hold after compression to `E`.

Put

\[
 I=[\lambda^{-1},\lambda],\qquad
 (T_nx)(u)=H_x(nu).                                  \tag{0.4}
\]

Let `W=(X,Y] cap Z`, where

\[
 \boxed{2A\leq X<Y\leq2X.}                          \tag{0.5}
\]

For arbitrary complex coefficients `a_n`, the exact dilation synthesis
obeys

\[
 \boxed{
 \left\|\sum_{n\in W}a_nT_n\right\|_{D\to L^2(I)}^2
 \leq C_m{A\log(2X)\over LX^2}
             \sum_{n\in W}|a_n|^2.}                 \tag{0.6}
\]

The constant depends only on the fixed packet data and `m`; it is
independent of `lambda`, `X`, `Y`, the seven-row subspace, and any finite
Fejer weights inserted into `a_n`.

Define the unweighted and von-Mangoldt-discrepancy maps

\[
 S_W=\sum_{n\in W}T_n,\qquad
 R_W=\sum_{n\in W}(\Lambda(n)-1)T_n.                 \tag{0.7}
\]

Then elementary Chebyshev estimates, with no prime-number theorem, give

\[
 \boxed{
 \|S_W\|^2\leq C_m{A\log(2X)\over LX},\qquad
 \|R_W\|^2\leq C_m{A\log^2(2X)\over LX}.}           \tag{0.8}
\]

Consequently the norm-convergent far-tail maps

\[
 S_{\geq2A}=\sum_{n>2A}T_n,
 \qquad
 R_{\geq2A}=\sum_{n>2A}(\Lambda(n)-1)T_n             \tag{0.9}
\]

satisfy

\[
 \boxed{\|S_{\geq2A}\|=O_m(1),\qquad
        \|R_{\geq2A}\|=O_m(\sqrt L).}               \tag{0.10}
\]

For the exact ordered `l=1` upper-prime block, put

\[
 P_{\geq2A}=S_{\geq2A}+R_{\geq2A}
            =\sum_{n>2A}\Lambda(n)T_n.               \tag{0.11}
\]

Hermitian averaging gives

\[
 \boxed{
 Q_{1,\geq2A}
 ={1\over4}\{S_{\geq2A}^*P_{\geq2A}
                 +P_{\geq2A}^*S_{\geq2A}\}
 ={1\over2}S_{\geq2A}^*S_{\geq2A}
 +{1\over4}\{S_{\geq2A}^*R_{\geq2A}
                 +R_{\geq2A}^*S_{\geq2A}\}.}       \tag{0.12}
\]

The resonant atoms in this block are exactly `n=m`, and

\[
 0\preceq Q_{{\rm res},1,\geq2A}
 ={1\over2}\sum_{n>2A}\Lambda(n)T_n^*T_n,
 \qquad
 \|Q_{{\rm res},1,\geq2A}\|=O_m(L^{-1}).            \tag{0.13}
\]

It follows that

\[
 \boxed{
 \|Q_{1,\geq2A}\|+
 \|Q_{{\rm off},1,\geq2A}\|=O_m(\sqrt L)=o(T_L),
 \qquad T_L={(c/(2\pi))^\sigma\over L^{2m}},\quad
 {1\over2}<\sigma<1.}                                \tag{0.14}
\]

Thus neither a classical zero-free-region remainder nor an RH-strength
prime discrepancy is needed in the far `l=1` annulus.  The cancellation is
an `L^2` dilation large sieve coming from the exact allowed exterior
carrier.  A pointwise PNT bound followed by crude `J_1` variation does not
recover (0.6).

The threshold in (0.5) is binding.  The certified Pruefer carrier begins at
`t=2lambda`, and at the literal hard endpoint `u=lambda^(-1)` one has
`nu>=2lambda` exactly only for `n>=2A`.  This theorem makes no claim for
the regular transition band `A<n<2A`, for a growing packet dimension, for
`l>1`, or for the complete central form.  It proves no determinant or RH
statement.  The project state remains `P0_INVALIDATED`.

## 1. Frozen inputs

The following repository bytes are binding inputs.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_FORCED_ORDERED_NONRESONANT_PRIME_FRAME_THEOREM.md` | `787e0f6c21272169e9c17f764bc1b1e9d9af1a386a4ba6891fddd0746f1c2e79` |
| `tests/test_growing_transition_forced_ordered_nonresonant_prime_frame_theorem.py` | `73913c60eb3862668631a0f846be2d40c82978c62248c9084c173d76913a44b7` |
| `notes/TRANSITION_PROLATE_OUTER_THEOREM.md` | `215f27adc0453f601ced419bd39910cb821c31b2e77678b63874987510f4f9c6` |
| `tests/test_transition_prolate_outer.py` | `bc03f010254e0b56c800b1fc4dfb38cd7ea17a0ebc1133064f751d6eab08b433` |
| `notes/GROWING_TRANSITION_TWO_CLUSTER_MODAL_PLACEMENT_LEAKAGE_NORMALIZATION_THEOREM.md` | `7859533dd83b94708ee73658e6b6c94eb78418a333082c875f0629b244efe564` |
| `tests/test_growing_transition_two_cluster_modal_placement_leakage_normalization_theorem.py` | `caef856880cbc01e95b45209a5dc1a41d669c43a9f868552e6b7d33fd2e0cc8c` |
| `notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md` | `2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97` |
| `tests/test_growing_transition_direct_source_upper_form_theorem.py` | `96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2` |

No external prime-distribution theorem or numerical prolate datum is added.

## 2. Exact physical normalization and Pruefer variables

For one selected mode write

\[
 d_\gamma=1-\chi_\gamma^2,\qquad
 e_\gamma=h_\gamma(\lambda),\qquad
 z_\gamma={e_\gamma\over\sqrt{d_\gamma}}.            \tag{2.1}
\]

The frozen radial normalization gives, uniformly on both clusters,

\[
 z_\gamma^2\leq C{c\over\lambda L}\leq C{\lambda\over L}.
                                                               \tag{2.2}
\]

The second inequality only absorbs the fixed factor `2*pi`.  On
`t>=2lambda` put

\[
 p(t)=t^2-\lambda^2,
 \qquad w_\gamma(t)=\sqrt{p(t)}H_\gamma(t).           \tag{2.3}
\]

The exact exterior equation is

\[
 w_\gamma''+\Omega_\gamma^2w_\gamma=0,
 \qquad
 \Omega_\gamma^2
 =k^2+{c\gamma\over p}+{\lambda^2\over p^2}.         \tag{2.4}
\]

Use the exact Pruefer variables

\[
 w_\gamma=r_\gamma\sin\theta_\gamma,
 \qquad
 w_\gamma'=r_\gamma\Omega_\gamma\cos\theta_\gamma.
                                                               \tag{2.5}
\]

They satisfy

\[
 {r_\gamma'\over r_\gamma}
 =-{\Omega_\gamma'\over\Omega_\gamma}\cos^2\theta_\gamma,
 \qquad
 \theta_\gamma'
 =\Omega_\gamma+{\Omega_\gamma'\over\Omega_\gamma}
       \sin\theta_\gamma\cos\theta_\gamma.          \tag{2.6}
\]

The far Volterra normalization in the frozen outer theorem gives

\[
 r_\gamma(t)\leq {9\over2}{|e_\gamma|\over\pi}.
                                                               \tag{2.7}
\]

Combining (2.2), (2.3), and (2.7), the exact white modal row has the
amplitude-phase representation

\[
 {H_\gamma(t)\over\sqrt{d_\gamma}}
 =a_\gamma(t)\sin\theta_\gamma(t),
 \qquad
 |a_\gamma(t)|\leq C{\sqrt{\lambda/L}\over t},
 \quad t\geq2\lambda.                                \tag{2.8}
\]

This is the first important gain over the generic remainder bound
`C_(infinity,L)^2 <= C lambda^7`: it retains the allowed carrier and its
physical half-density instead of estimating the complete oscillatory mode
by a `t^(-2)` envelope.

## 3. Scaled phase and amplitude bounds

Fix one dyadic window as in (0.5), set

\[
 Q={X\over A}\geq2,\qquad y=\lambda u,\qquad 1\leq y\leq A.
                                                               \tag{3.1}
\]

For every `n in W`, `q_n=n/A` lies in `(Q,2Q]`, and

\[
 t={ny\over\lambda}=q_n\lambda y\geq2\lambda.        \tag{3.2}
\]

Thus (2.4)--(2.8) are valid at every point of the integration interval,
including `y=1`.  Put

\[
 \delta_{\gamma,n}(y)
 =\theta_\gamma(ny/\lambda)-2\pi ny.                 \tag{3.3}
\]

We now retain the Pruefer correction in (2.6).  From `p>=3t^2/4`,
`gamma<=C_0L`, and (2.4), direct differentiation gives

\[
 \begin{aligned}
 0\leq\Omega_\gamma-k
   &\leq {C L\over Q^2\lambda y^2},\\
 \left|{\Omega_\gamma'\over\Omega_\gamma}\right|
   &\leq {C L\over Q^3\lambda^3y^3},\\
 |\theta_\gamma''(t)|
   &\leq {C L\over Q^3\lambda^2y^3}.
 \end{aligned}                                        \tag{3.4}
\]

For the last line, differentiate the second identity in (2.6).  The three
terms are `Omega'`, the derivative of `Omega'/Omega`, and
`(Omega'/Omega)theta' cos(2theta)`; each has the displayed size.  Since
`dt/dy=n/lambda` lies in `(Qlambda,2Qlambda]`, (3.4) proves

\[
 \boxed{
 |\delta_{\gamma,n}'(y)|\leq {CL\over Qy^2},
 \qquad
 |\delta_{\gamma,n}''(y)|\leq {CL\over Qy^3}.}       \tag{3.5}
\]

There is no discarded `Omega'/Omega` term in (3.5).

Define the slow white amplitude

\[
 a_{\gamma,n}(y)=a_\gamma(ny/\lambda).               \tag{3.6}
\]

Equations (2.6)--(2.8) and the first identity in (2.6) give

\[
 |a_{\gamma,n}(y)|\leq {C\over Q\sqrt{\lambda L}\,y},
 \qquad
 |a_{\gamma,n}'(y)|\leq {C\over Q\sqrt{\lambda L}\,y^2}.
                                                               \tag{3.7}
\]

Indeed the logarithmic derivative of `p^(-1/2)` is `O(y^(-1))`, while
the scaled logarithmic variation of `r_gamma` is
`O(L/(Q^2 lambda^2 y^3))`.  For `n,m in W`, include the Jacobian
`du=dy/lambda` and put

\[
 g_{\gamma\zeta;n,m}(y)
 ={1\over\lambda}a_{\gamma,n}(y)a_{\zeta,m}(y).
                                                               \tag{3.8}
\]

Then

\[
 \boxed{
 |g_{\gamma\zeta;n,m}(y)|
 \leq {CA\over LX^2y^2},\qquad
 |g_{\gamma\zeta;n,m}'(y)|
 \leq {CA\over LX^2y^3}.}                            \tag{3.9}
\]

## 4. Modal Gram bound

Expand the product of the two sines in (2.8).  The same-sign phases have
derivative

\[
 2\pi(n+m)+O(L/(Qy^2)),                               \tag{4.1}
\]

so one integration by parts and (3.9) bounds their contribution by
`CA/(LX^2(n+m))`.

For an opposite-sign phase put `d=n-m`.  Equations (3.3) and (3.5) give

\[
 \Phi'(y)=2\pi d+O(L/(Qy^2)),
 \qquad |\Phi''(y)|\leq {CL\over Qy^3}.              \tag{4.2}
\]

If `|d|<=C_1(1+L/Q)`, use (3.9) directly.  Otherwise choose `C_1`
large enough that `|Phi'|>=pi|d|`.  Integration by parts, retaining both
endpoints, gives

\[
\begin{aligned}
 \left|\int_1^A g(y)e^{i\Phi(y)}\,dy\right|
 &\leq \left|{g\over\Phi'}\right|_1^A
 +\int_1^A{|g'|\over|\Phi'|}\,dy
 +\int_1^A{|g||\Phi''|\over|\Phi'|^2}\,dy\\
 &\leq {CA\over LX^2|d|}.
\end{aligned}                                        \tag{4.3}
\]

The last integral is admissible because `|d|>=C_1(1+L/Q)`; no unrecorded
factor of the interval length occurs.  Thus every cross-modal Gram entry
satisfies

\[
\boxed{
 \left|\left\langle
 {H_\gamma(n\,\cdot)\over\sqrt{d_\gamma}},
 {H_\zeta(m\,\cdot)\over\sqrt{d_\zeta}}
 \right\rangle_{L^2(I)}\right|
 \leq {C A\over LX^2}
 \left\{
 \mathbf1_{|n-m|\leq C_1(1+L/Q)}
 +{\mathbf1_{|n-m|>C_1(1+L/Q)}\over|n-m|}
 +{1\over n+m}
 \right\}.}                                         \tag{4.4}
\]

For a fixed row `n`, the near part of (4.4) has at most
`C(1+L/Q)` entries.  The far part costs at most `C log(2X)`.  Since
`Q>=2` and `log(2X)>=L`, Schur's test gives

\[
 \boxed{
 \|G^{\gamma\zeta}_W\|_{\ell^2(W)\to\ell^2(W)}
 \leq C{A\log(2X)\over LX^2}.}                       \tag{4.5}
\]

This proves the scalar modal large sieve.  For a source (0.3), expand in
the fixed `2m` modal coordinates and apply (4.5) to each pair
`(gamma,zeta)`.  The inequality

\[
 \left(\sum_\gamma|b_\gamma|\right)^2
 \leq2m\sum_\gamma|b_\gamma|^2                       \tag{4.6}
\]

costs only `C_m` and proves (0.6).  This also verifies all cross-cluster
and cross-gamma terms; no diagonal-modal replacement has been made.

## 5. Arithmetic coefficients and separate windows

The elementary estimates

\[
 \psi(2X)=\sum_{n\leq2X}\Lambda(n)\leq C X,
 \qquad
 \sum_{n\in W}\Lambda(n)^2
 \leq\log(2X)\psi(2X)\leq CX\log(2X)                \tag{5.1}
\]

imply

\[
 \sum_{n\in W}(\Lambda(n)-1)^2\leq CX\log(2X).      \tag{5.2}
\]

Insert `a_n=1` and `a_n=Lambda(n)-1` into (0.6) to obtain (0.8).
This uses only Chebyshev's bound and `Lambda(n)<=log n`; it uses neither a
zero-free region nor RH.

The estimates are also valid for separate inward and prime windows.  If
`U=(X,2X]` and `V=(Y,2Y]`, with `X,Y>=2A`, then

\[
\boxed{
 \|S_U^*R_V+R_V^*S_U\|
 \leq2\|S_U\|\|R_V\|
 \leq C_m{A\sqrt{\log(2X)}\log(2Y)
                 \over L\sqrt{XY}}.}                \tag{5.3}
\]

The analogous bounds with `S--S` or `R--R` follow by the same product.
Thus the theorem does not rely on taking identical dyadic windows before
Hermitian averaging.

For the resonant diagonal, (2.8) gives directly

\[
 \|T_n\|^2\leq C_m{A\over Ln^2}.                     \tag{5.4}
\]

Combining (5.4) with the first estimate in (5.1) yields

\[
 \left\|\sum_{n\in W}\Lambda(n)T_n^*T_n\right\|
 \leq C_m{A\over LX}.                               \tag{5.5}
\]

## 6. Infinite far tail and exact `l=1` block

Take the dyadic windows

\[
 W_j=(2^{j+1}A,2^{j+2}A]\cap\mathbb Z,
 \qquad j=0,1,2,\ldots.                              \tag{6.1}
\]

Equations (0.8) give

\[
 \|S_{W_j}\|
 \leq C_m2^{-j/2}\sqrt{1+j/L},
 \qquad
 \|R_{W_j}\|
 \leq C_m2^{-j/2}{L+j\over\sqrt L}.                 \tag{6.2}
\]

Both series of operator norms converge, and their sums are respectively
`O_m(1)` and `O_m(sqrt L)`.  This proves (0.9)--(0.10) and justifies the
unweighted ordered maps without an auxiliary prime cutoff.  All bounded Fejer
weights are already covered by the arbitrary coefficients in (0.6), and
pointwise convergence of those weights recovers the ordered limit.

The exact direct upper form has coefficient `1/2`; Hermitian averaging
therefore gives (0.12), with no missing factor two.  Equations
(0.10), (0.12), and (5.5) imply

\[
 \|Q_{1,\geq2A}\|\leq C_m(1+\sqrt L),
 \qquad
 \|Q_{{\rm res},1,\geq2A}\|\leq C_mL^{-1}.          \tag{6.3}
\]

Subtracting the resonant diagonal proves (0.14).  Since every fixed power
of `L` is `o(c^sigma/L^(2m))` for `sigma>0`, this is much smaller than the
forced scale in the frozen seven-row packet.

There is also a useful completion-of-squares lower bound,

\[
 Q_{1,\geq2A}
 ={1\over4}S^*S+{1\over4}(S+R)^*(S+R)-{1\over4}R^*R
 \succeq-{1\over4}R^*R\succeq-C_mL I_E,             \tag{6.4}
\]

but the direct cross estimate in (6.3) is sharper in operator norm.

## 7. What remains at the hard transition band

At `A<n<2A` and `u=lambda^(-1)`, the argument `nu` lies in
`(lambda,2lambda)`.  The Pruefer theorem used in Section 2 does not cover
that interval.  Replacing it by the generic exterior energy or by the
pointwise PNT discrepancy loses the oscillatory Gram structure and gives
no analogue of (0.6) at the required scale.

The appropriate remaining object is the endpoint-normalized regular
Liouville--Green/Bessel carrier in the exact variable

\[
 V=c\left({nu\over\lambda}-1\right),                 \tag{7.1}
\]

with the first sampled point retained at the literal boundary
`u=lambda^(-1)`.  A future near-band theorem must prove the corresponding
translation/dilation Bessel bound before combining it with (0.14).  The
present theorem deliberately does not infer that missing estimate from
the far carrier.
