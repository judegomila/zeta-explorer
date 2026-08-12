# Growing-transition ordered-prime near-band fold large-sieve theorem

## 0. Result and exact scope

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 A=\lambda^2,\qquad c=2\pi A,\qquad L=\log A,
 \qquad k=2\pi\lambda .                               \tag{0.1}
\]

Use the realized polylogarithmic two-cluster packet, its exact exterior
defect whitening, and the seven-row subspace `E` of the frozen
forced-prime theorem.  Thus the packet has a fixed number `2m` of modes,

\[
 B_L=(\log L)^4,
 \qquad {1\over2}B_L\leq\gamma\leq C_0L,\qquad
 \mu_\gamma=c^2-c\gamma,                              \tag{0.2}
\]

for all sufficiently large locked `lambda`.  A white source has
coordinates

\[
 H_x=\sum_{\gamma\in\mathcal G_L}b_\gamma
        {H_\gamma\over\sqrt{d_\gamma}},
 \qquad \sum_\gamma|b_\gamma|^2=\|x\|_D^2.          \tag{0.3}
\]

Put

\[
 I=[\lambda^{-1},\lambda],\qquad
 (T_nx)(u)=H_x(nu),\qquad
 \mathcal W=(A,2A)\cap\mathbb Z.                     \tag{0.4}
\]

There is a fixed exponent `K_0`, depending at most on the fixed packet
data, such that arbitrary complex coefficients obey the near-band
dilation large sieve

\[
 \boxed{
 \left\|\sum_{n\in\mathcal W}a_nT_n\right\|_{D\to L^2(I)}^2
 \leq {C_mL^{K_0}\over\sqrt A}
             \sum_{n\in\mathcal W}|a_n|^2.}           \tag{0.5}
\]

The bound is proved on the whole white modal span (0.3), and therefore
also holds after compression to `E`.  It is uniform under arbitrary
bounded finite-Fejer weights.

Define

\[
 S_{\rm tr}=\sum_{n\in\mathcal W}T_n,
 \qquad
 R_{\rm tr}=\sum_{n\in\mathcal W}(\Lambda(n)-1)T_n.   \tag{0.6}
\]

Elementary Chebyshev estimates then give

\[
 \boxed{
 \|S_{\rm tr}\|^2\leq C_mL^{K_0}\sqrt A,
 \qquad
 \|R_{\rm tr}\|^2\leq C_mL^{K_0+1}\sqrt A.}         \tag{0.7}
\]

For the exact ordered `l=1` block restricted to this finite transition
window, the hard-tail PNT--Gram identity is

\[
 Q_{1,{\rm tr}}
 ={1\over2}S_{\rm tr}^*S_{\rm tr}
 +{1\over4}\{S_{\rm tr}^*R_{\rm tr}
                    +R_{\rm tr}^*S_{\rm tr}\}.       \tag{0.8}
\]

Its resonant diagonal is

\[
 0\preceq Q_{{\rm res},1,{\rm tr}}
 ={1\over2}\sum_{n\in\mathcal W}\Lambda(n)T_n^*T_n,
 \qquad \|Q_{{\rm res},1,{\rm tr}}\|=O_m(1).        \tag{0.9}
\]

Consequently, with `Q_off=Q_1-Q_res` on this window,

\[
 \boxed{
 \|Q_{1,{\rm tr}}\|+\|Q_{{\rm off},1,{\rm tr}}\|
 \leq C_mL^{K_0+1}\sqrt A
 =o\left({A^\sigma\over L^{2m}}\right),
 \qquad {1\over2}<\sigma<1.}                         \tag{0.10}
\]

No prime-number theorem is used.  The gain is a fold large sieve for the
exact regular Bessel action.  The fold is real and is not replaced by a
false nonstationarity assertion.

There are two different additive scales.  For equal modal energy, rows
whose lower edge can meet the stationary branch extend through

\[
 d\asymp\sqrt{A\gamma},                               \tag{0.11}
\]

whereas the fully coherent stationary-phase width is only

\[
 d\asymp\sqrt{A/\gamma}.                              \tag{0.12}
\]

The first number counts possible fold rows; the second is an Airy-style
coherence width.  Confusing them produces a spurious `A^(-1/4)` Gram
loss.  The exact discriminant below gives instead the sufficient
`A^(-1/2)` Schur scale, up to powers of `L`.

This theorem treats only `l=1` and `A<n<2A`.  It makes no claim for
`n\geq2A` except through its frozen far-annulus input, no claim for
`l\geq2`, no complete hard-tail theorem, no determinant conclusion, and
no RH statement.  The project state remains `P0_INVALIDATED`.

## 1. Frozen inputs

The following repository bytes are binding inputs.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_ORDERED_PRIME_HARD_TAIL_PNT_GRAM_REDUCTION.md` | `b8439dcfa6f969fd84dae8fafb5474c3e176ba14d84c7d73140fabeac042a4be` |
| `tests/test_growing_transition_ordered_prime_hard_tail_pnt_gram_reduction.py` | `1101aebef550259387eb6220cf8b2740d728c2f52ddf6349b253d6a555248cb6` |
| `notes/GROWING_TRANSITION_ORDERED_PRIME_FAR_ANNULUS_DILATION_LARGE_SIEVE_THEOREM.md` | `c09ae35ef96a9d897446221354199e6a945c7e4b6d118a4b934b223452e137cc` |
| `tests/test_growing_transition_ordered_prime_far_annulus_dilation_large_sieve_theorem.py` | `1b09dd1eac6356e5a9faecbee8b400911d28577e473ee3583cfb1df349587f1b` |
| `notes/GROWING_TRANSITION_SUBCRITICAL_LG_ACTION_BV_THEOREM.md` | `1cae15a8c72f0505384daea94760fcb05c466f897224ab83c54e7c41f045e99c` |
| `tests/test_growing_transition_subcritical_lg_action_bv_theorem.py` | `a34689e3741cc7e09020a009bf4b120c11ace44489fbcdd1c0cc3a3b7d5cfc92` |
| `notes/GROWING_TRANSITION_TWO_CLUSTER_MODAL_PLACEMENT_LEAKAGE_NORMALIZATION_THEOREM.md` | `7859533dd83b94708ee73658e6b6c94eb78418a333082c875f0629b244efe564` |
| `tests/test_growing_transition_two_cluster_modal_placement_leakage_normalization_theorem.py` | `caef856880cbc01e95b45209a5dc1a41d669c43a9f868552e6b7d33fd2e0cc8c` |
| `notes/GROWING_TRANSITION_FORCED_ORDERED_NONRESONANT_PRIME_FRAME_THEOREM.md` | `787e0f6c21272169e9c17f764bc1b1e9d9af1a386a4ba6891fddd0746f1c2e79` |
| `tests/test_growing_transition_forced_ordered_nonresonant_prime_frame_theorem.py` | `73913c60eb3862668631a0f846be2d40c82978c62248c9084c173d76913a44b7` |
| `notes/TRANSITION_PROLATE_OUTER_THEOREM.md` | `215f27adc0453f601ced419bd39910cb821c31b2e77678b63874987510f4f9c6` |
| `tests/test_transition_prolate_outer.py` | `bc03f010254e0b56c800b1fc4dfb38cd7ea17a0ebc1133064f751d6eab08b433` |

No external FIO theorem, prime-distribution estimate, or numerical
prolate datum is added.

## 2. Exact edge coordinate and regular Bessel carriers

For one actual selected modal parameter `gamma`, put

\[
 r_\gamma^2={\gamma\over c},\qquad
 J_\gamma=K(\sqrt{1-r_\gamma^2})\asymp L.             \tag{2.1}
\]

For `z>1`, set

\[
 x=(z^2-1)^{1/2},\qquad
 T_\gamma(x)=\int_0^x
       \sqrt{{v^2+r_\gamma^2\over1+v^2}}\,dv,
 \qquad S_\gamma=cT_\gamma(x).                       \tag{2.2}
\]

The frozen subcritical LG theorem gives the endpoint-normalized regular
solution

\[
 Y_\gamma(z)=
 \left\{{T_\gamma(x)^2\over
              x^2(x^2+r_\gamma^2)}\right\}^{1/4}
 W_\gamma(S_\gamma),                                  \tag{2.3}
\]

where `W_gamma` is a `J_0/Y_0` carrier with a Volterra transfer matrix
equal to the identity plus `O(gamma^(-1))`.  Its carrier-removed total
variation is `O(gamma^(-1))`.  The exact positive-tail whitening is

\[
 {H_\gamma(t)\over\sqrt{d_\gamma}}
 ={Y_\gamma(t/\lambda)\over
       \sqrt{2\lambda\mathcal N_\gamma}},
 \qquad
 \mathcal N_\gamma={J_\gamma\over\pi c}
 \left\{1+O\left({\log(2+\gamma)\over\gamma}\right)\right\}.
                                                               \tag{2.4}
\]

Use the exact edge coordinate

\[
 U=c(z-1),\qquad
 a_c(U)=2U+{U^2\over c}=cx^2=:P.                      \tag{2.5}
\]

Direct differentiation of (2.2), with no asymptotic expansion, gives

\[
 \boxed{{dS_\gamma\over dU}
 =\omega_\gamma(P):=\sqrt{1+{\gamma\over P}}.}       \tag{2.6}
\]

For a sample `n in \mathcal W`, put `y=\lambda u` and

\[
 U_n(y)=c\left({ny\over A}-1\right)=2\pi(ny-A),
 \qquad 1\leq y\leq A.                               \tag{2.7}
\]

Because `p` is odd, `A=p^2/4` is an integer plus `1/4`.  Hence

\[
 n-A\geq{3\over4},\qquad U_n(1)\geq{3\pi\over2}.     \tag{2.8}
\]

The apparent Bessel origin is therefore never sampled.  In fact (2.2)
and (2.8) give

\[
 S_\gamma(U_n(y))\geq c_1\sqrt\gamma
 \geq c_1(\log L)^2.                                  \tag{2.9}
\]

Thus the exact Hankel decomposition of `J_0,Y_0` is uniform on the whole
sampled interval.  Combining it with (2.3)--(2.4) gives two exact sign
carriers

\[
 {H_\gamma(nu)\over\sqrt{d_\gamma}}
 =\sum_{\epsilon=\pm1}
 A_{\gamma,n}^{\epsilon}(U_n)
       e^{i\epsilon S_\gamma(U_n)},                   \tag{2.10}
\]

where harmless constant Maslov phases are included in `A`, and

\[
 |A_{\gamma,n}^{\epsilon}(U)|
 \leq {C L^{K_1}\sqrt c\over\sqrt{\lambda J_\gamma}}
       \{P(P+\gamma)\}^{-1/4}.                        \tag{2.11}
\]

After multiplication by `{P(P+gamma)}^(1/4)`, the normalized amplitude
in (2.11) has bounded total variation, with a bound `CL^(K_1)`.  This
follows from the standard exact Hankel symbols for
`S\geq c_1\sqrt\gamma`,
the `L^1(dS)` Volterra coefficient bound, and the monotonicity of `P`.
The fixed exponent `K_1` only records deliberately harmless polynomial
losses from `gamma<=C_0L`; its value is independent of `A,n`, and the
modal label.

## 3. Diagonal control and the four sign branches

The exact defect normalization immediately gives

\[
 \begin{aligned}
 \left\|{H_\gamma(n\,\cdot)\over\sqrt{d_\gamma}}\right\|_{L^2(I)}^2
 &= {1\over n}\int_{n/\lambda}^{n\lambda}
      {|H_\gamma(t)|^2\over d_\gamma}\,dt\\
 &\leq {1\over2n}\leq {C\over A}.
 \end{aligned}                                        \tag{3.1}
\]

Consequently every diagonal and cross-modal Gram entry with the same
sample index is `O(A^(-1))` by Cauchy--Schwarz.

Now take `n<m` in `\mathcal W`, and put

\[
 h={m\over n},\qquad d=m-n,\qquad
 U=U_n(y),\qquad V=U_m(y)=hU+c(h-1).                  \tag{3.2}
\]

If

\[
 P=a_c(U),\qquad Q=a_c(V),\qquad K=c(h^2-1),          \tag{3.3}
\]

then exact affine covariance gives

\[
 \boxed{Q=h^2P+K.}                                    \tag{3.4}
\]

The product of (2.11), including the exact change of variables
`du=lambda dU/(cn)`, satisfies

\[
 |A_{\alpha,n}^{\epsilon}(U)
   A_{\beta,m}^{\eta}(V)|\,du
 \leq {CL^{K_1}\over A}
 \{P(P+\alpha)Q(Q+\beta)\}^{-1/4}\,dU.              \tag{3.5}
\]

There are four sign pairs.  The two same-sign phases have derivative

\[
 \omega_\alpha(P)+h\omega_\beta(Q)\geq1+h.           \tag{3.6}
\]

Carrier integration by parts, including both endpoints and the bounded
variation in Section 2, gives

\[
 |G^{\alpha\beta,+}_{nm}|
 \leq {CL^{K_2}\over A}
 \{r_n(r_n+\alpha)r_m(r_m+\beta)\}^{-1/4},
 \qquad r_j=j-A.                                      \tag{3.7}
\]

The reversed same-sign phase has the same bound.  The upper endpoint is
smaller than the displayed lower-endpoint term.

The two opposite-sign phases are adjoints.  Their real difficulty is the
fold treated next.

## 4. Exact opposite-sign discriminant

For

\[
 \Phi(U)=S_\alpha(U)-S_\beta(V(U)),                   \tag{4.1}
\]

one has

\[
 \Phi'=\omega_\alpha(P)-h\omega_\beta(Q).             \tag{4.2}
\]

Squaring is legitimate at a stationary point because both frequencies
are positive.  Define

\[
 G(P)=\omega_\alpha(P)^2-h^2\omega_\beta(Q)^2,
 \qquad N(P)=PQG(P).                                  \tag{4.3}
\]

Equations (2.6) and (3.4) give the exact quadratic

\[
 \boxed{
 N(P)=-{Kh^2\over c}P^2
 +\left\{h^2(\alpha-\beta)-{K^2\over c}\right\}P
 +\alpha K.}                                         \tag{4.4}
\]

Its discriminant is

\[
 \boxed{
 \Delta=h^4(\alpha-\beta)^2
 +{2h^2(\alpha+\beta)K^2\over c}
 +{K^4\over c^2}.}                                   \tag{4.5}
\]

Since the leading coefficient in (4.4) is negative and `N(0)=alpha K`
is positive, there is exactly one positive root `P_*`.  At that root,

\[
 |N'(P_*)|=\sqrt\Delta,                               \tag{4.6}
\]

and differentiation of (4.2) gives

\[
 \boxed{
 |\Phi''(U_*)|
 ={\sqrt\Delta\,P'(U_*)\over
       P_*Q_*\{\omega_\alpha(P_*)+h\omega_\beta(Q_*)\}}.}       \tag{4.7}
\]

Thus no simultaneous stationary point and cusp is possible.  Formula
(4.7), rather than a nonstationarity claim, is the fold mechanism.

At a stationary point,

\[
 P+\alpha=P\omega_\alpha(P)^2,
 \qquad Q+\beta=Q\omega_\beta(Q)^2.                  \tag{4.8}
\]

Hence the half-density in (3.5), followed by second-derivative van der
Corput, cancels the `P_*Q_*` in (4.7).  The exact conclusion is the
weighted fold estimate

\[
 \boxed{
 |G^{\alpha\beta,-}_{nm}|
 \leq {CL^{K_3}\over A\Delta^{1/4}},\qquad n\ne m.}   \tag{4.9}
\]

For clarity, here is the endpoint-uniform proof of the one-dimensional
step in (4.9).  Factor the quadratic as

\[
 N(P)=-{Kh^2\over c}(P-P_*)(P+\rho),\qquad \rho=-P_->0. \tag{4.10}
\]

The root product and root gap are exactly

\[
 P_*\rho={\alpha c\over h^2},\qquad
 P_*+\rho={c\sqrt\Delta\over Kh^2}.                  \tag{4.11}
\]

Consequently there is no false uniform lower bound obtained by discarding
the negative root.  The exact first-derivative identity is

\[
 |\Phi'|
 ={\sqrt\Delta\,|P-P_*|\over
       PQ\{\omega_\alpha(P)+h\omega_\beta(Q)\}}
       {P+\rho\over P_*+\rho}.                        \tag{4.12}
\]

Partition the positive `P` axis dyadically at the three scales
`P_*`, `rho`, and the stationary length determined by (4.7).  On the
interval meeting `P_*`, monotonicity of `P,Q`, (4.7), and
`1\leq\omega\leq C\sqrt L` give second-derivative van der Corput.  The
factor `(PQ)^(-1/2)` in (3.5) cancels the resulting
`(P_*Q_*)^(1/2)`.  On every other dyadic interval, use (4.12) once by
parts.  The factor `(P+rho)/(P_*+rho)` is retained; (4.11) makes the
intervals below `rho`, between `rho` and `P_*`, and above `P_*`
geometric after multiplication by the half density.  Optimizing the
central interval between its absolute bound and its two boundary
integrations gives `Delta^(-1/4)`.  The carrier-removed BV bound in
Section 2 controls all differentiated amplitudes.  If `P_*` lies outside
the integration interval, start the same partition at the nearest
endpoint.  Thus the identical estimate holds at an interior fold, a
boundary fold, and in the no-stationary case.  This proves (4.9) without
discarding either quadratic root.

Unequal modal energies require no separate cusp argument: the term
`h^4(alpha-beta)^2` in (4.5) improves the bound.  In particular (4.9)
handles both the fixed-offset pairs within a cluster and the widely
separated low/high cluster pairs.

## 5. Schur summation and fixed-modal synthesis

For `A<n<m<2A`, one has uniformly

\[
 1<h<2,\qquad c_1d\leq K=c(h^2-1)\leq c_2d.           \tag{5.1}
\]

Therefore (4.5) implies

\[
 \Delta\geq c_3\left\{
 { (\alpha+\beta)d^2\over A}+{d^4\over A^2}\right\}. \tag{5.2}
\]

Writing `D=\sqrt{A(\alpha+\beta)}`, (4.9) gives

\[
 \begin{aligned}
 \sum_{1\leq d\leq D}{L^{K_3}\over A\Delta^{1/4}}
 &\leq {CL^{K_3}\over A^{3/4}(\alpha+\beta)^{1/4}}
       \sum_{d\leq D}d^{-1/2}
 \leq {CL^{K_3}\over\sqrt A},\\
 \sum_{D<d\leq A}{L^{K_3}\over A\Delta^{1/4}}
 &\leq {CL^{K_3}\over\sqrt A}\sum_{D<d\leq A}{1\over d}
 \leq {CL^{K_3+1}\over\sqrt A}.
 \end{aligned}                                        \tag{5.3}
\]

This is the precise fold/coherence distinction.  In the equal-energy
case, a stationary point with two comparable lower coordinates occurs
near `q_*^2=\alpha A/(8\pi)`, so possible fold rows extend to
`d=O(\sqrt{\alpha A})`.  The quadratic stationary neighborhood reaches
the endpoint only for `d=O(\sqrt{A/\alpha})`.  Both pieces of (5.3) have
the same `A^(-1/2)` Schur scale.

For the same-sign terms, set

\[
 w_\gamma(r)=\{r(r+\gamma)\}^{-1/4}.                  \tag{5.4}
\]

Since

\[
 \sum_{3/4\leq r\leq A}w_\gamma(r)
 \leq C(\sqrt\gamma+\sqrt A)\leq C\sqrt A,           \tag{5.5}
\]

(3.7) has Schur norm `O(L^(K_2)A^(-1/2))`.  The diagonal
costs only `O(A^(-1))` by (3.1).  Combining all four sign pairs proves,
for every modal pair,

\[
 \|G^{\alpha\beta}_{\mathcal W}\|_{\ell^2\to\ell^2}
 \leq {CL^{K_0}\over\sqrt A}.                        \tag{5.6}
\]

Finally expand a source in the fixed `2m` modal coordinates and use

\[
 \left(\sum_\gamma|b_\gamma|\right)^2
 \leq2m\sum_\gamma|b_\gamma|^2.                      \tag{5.7}
\]

This proves (0.5), including all cross-cluster and unequal-energy terms.
The seven source-null rows are not used to manufacture cancellation; the
estimate holds before compression to `E`.

## 6. Arithmetic coefficients and the finite `l=1` form

The elementary estimates

\[
 \#\mathcal W\leq A,
 \qquad
 \sum_{n\in\mathcal W}(\Lambda(n)-1)^2\leq CA L      \tag{6.1}
\]

inserted into (0.5) prove (0.7).  Bounded finite-Fejer weights are already
included in the arbitrary coefficients in (0.5), and their ordered limit
is automatic here because `\mathcal W` is finite at each locked
`lambda`.

The exact coefficient `1/2` in the direct upper form and Hermitian
averaging give (0.8), with the cross coefficient `1/4`.  Moreover (3.1)
and Chebyshev's bound imply

\[
 \left\|{1\over2}\sum_{n\in\mathcal W}
       \Lambda(n)T_n^*T_n\right\|
 \leq {C_m\over A}\sum_{n\leq2A}\Lambda(n)
 \leq C_m,                                             \tag{6.2}
\]

which proves (0.9).  Equations (0.7)--(0.9) give

\[
 \|Q_{1,{\rm tr}}\|
 \leq C_mL^{K_0+1}\sqrt A.                            \tag{6.3}
\]

For every fixed `sigma>1/2` and fixed `m`,

\[
 L^{K_0+1}\sqrt A=o(A^\sigma/L^{2m}).                 \tag{6.4}
\]

Subtracting the positive resonant diagonal proves (0.10).  This closes
the coefficient-frame estimate for the literal hard transition window
only; it does not silently promote the conclusion to any higher-sampler
or complete central block.
