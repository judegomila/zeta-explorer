# Growing-transition endpoint-null collective dilation-frame reduction

## 0. Result and fail-closed boundary

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 A=\lambda^2,\qquad c=2\pi\lambda^2,
 \qquad L=2\log\lambda .                              \tag{0.1}
\]

This note audits a proposed removal of the growing modal-count loss in the
positive outer-sampling theorem.  It proves four exact reductions and
records one missing operator-valued lemma.

1.  On the un-sheared same-phase family, the common source-endpoint row is
    a coherent rank-one row.  The equality-conductor endpoint shear kills
    that row on the transformed rest, but only after every source metric
    and every numerator form are sent through the same congruence.

2.  Endpoint nullity kills only the leading sawtooth.  The derivative row
    and its `B_2` Bernoulli profile survive.  In particular, endpoint
    nullity is not a complete outer-tail cancellation.

3.  The right arithmetic tail in logarithmic coordinates is a compressed
    half-line translation sum.  Its one-sided Laplace transform contains a
    truncated power sum.  Euler summation splits that power sum into an
    Euler main, a critical-line zeta term, and a periodic-Bernoulli
    remainder.  Therefore the bare shortcut

    \[
      T=\zeta\!\left({1\over2}+iD\right)              \tag{0.2}
    \]

    on full-line `L^2` is false for the actual half-line tail.

4.  The admitted near- and far-dilation large sieves are fixed-packet
    theorems.  Their last modal step is an `ell^1--ell^2` estimate and
    therefore reintroduces the packet dimension if used on the growing
    rest.  Exact exterior orthogonality does not remove unequal-dilation
    entries.

The precise missing input is an operator-valued unequal-dilation Gram
estimate on the endpoint-null, exact-exterior-white growing span.  A
centered two-branch weighted version and its translation-modulus companion
are stated in Section 6.  They retain the factors `lambda^(+/-2y)` forced
by the two physical tails and would remove the explicit `q=O(lambda^2)`
Hilbert-space Cauchy--Schwarz loss.  They are not proved here.

This note does not prove or refute the desired `O(lambda polylog(lambda))`
positive paired-zero sampling bound.  It proves no signed comparison,
Krein-angle reserve, graph comparison, equation (5.2) of
`DIRECT_RH_ATTACK.md`, determinant limit, RH conclusion, or Lambda bound.
The project state remains `P0_INVALIDATED`.

## 1. Frozen inputs

The following repository bytes are binding inputs.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_SAMPLING_THEOREM.md` | `551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72` |
| `notes/GROWING_TRANSITION_EQUALITY_CONDUCTOR_GARDING_THEOREM.md` | `f746d5e8e9efdcd585ace947789597954d9a8f7b57319f4398612bf3986b0079` |
| `notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md` | `6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9` |
| `notes/FIXED_EVEN_ENDPOINT_NULL_VOLTERRA_PNT_CORRELATION_BARRIER.md` | `c2c0ab5c4747a38a9fa2743d4b62d01165c1fa0771d25b253b79f28ff921663b` |
| `notes/GROWING_TRANSITION_ORDERED_PRIME_FAR_ANNULUS_DILATION_LARGE_SIEVE_THEOREM.md` | `c09ae35ef96a9d897446221354199e6a945c7e4b6d118a4b934b223452e137cc` |
| `notes/GROWING_TRANSITION_ORDERED_PRIME_NEAR_BAND_FOLD_LARGE_SIEVE_THEOREM.md` | `93a42acf8f33a2706e67ca53a929755d021c291a0dd3907099eb3176524e2675` |
| `notes/GROWING_TRANSITION_ORDERED_DIRECT_PROFILE_CONTINUATION_TWO_JET_SHEAR_REDUCTION_THEOREM.md` | `e3b1228a1fb22270a01f061c198239f3e60cb00b675da55ddd13420f9929dea3` |
| `notes/GROWING_TRANSITION_ETA_NULL_RENORMALIZED_SOURCE_KREIN_INTERTWINER_THEOREM.md` | `0c7c20639645d912d0e896bf064f83e3bd26078d716a183fa703d1586673d0d5` |

No zero table, prime-distribution theorem, numerical prolate datum, or new
external estimate is used.

## 2. Exact logarithmic tail and endpoint hierarchy

Let `f` be an actual even, compactly supported, zero-integral source after
the locked invisible-origin correction, so

\[
 f(0)=0,\qquad \int_{\mathbb R}f=0,
 \qquad H={\cal F}_af .                                \tag{2.1}
\]

For `t>=0`, put

\[
 \phi_f(t)={\sqrt\lambda\over2}e^{t/2}
                 H(\lambda e^t),\qquad
 (R_m\phi)(s)={\bf1}_{\{s\geq0\}}m^{-1/2}
                 \phi(s+\log m).                       \tag{2.2}
\]

The exact exterior isometry is

\[
 8\|\phi_f\|_2^2=D(f),                                \tag{2.3}
\]

where `D(f)` is the full two-tail exterior Fourier defect.  If
`u=lambda e^s`, then direct substitution gives

\[
 \boxed{
 (T\phi_f)(s):=\sum_{m\geq1}(R_m\phi_f)(s)
 ={\sqrt u\over2}\sum_{m\geq1}H(mu).}                 \tag{2.4}
\]

In the prescribed ordered Poisson sense, (2.1) also gives

\[
 (T\phi_f)(s)={1\over2\sqrt u}
                  \sum_{m\geq1}f(m/u).                 \tag{2.5}
\]

Formula (2.5) is the useful compact-side interpretation.  It is an
identity for the complete ordered row, not a coefficientwise identity for
a finite Fejer cutoff.

Write

\[
 \eta(f)=f(\lambda),\qquad \kappa(f)=f'(\lambda),
 \qquad P(x)={1\over2}-\{x\},
 \qquad B_2(x)=\{x\}^2-\{x\}+{1\over6}.              \tag{2.6}
\]

The exact endpoint expansion of the complete physical tail contains

\[
 B_{0,f}(s)={\eta(f)\over2\sqrt\lambda}
             e^{-s/2}P(Ae^s),                         \tag{2.7}
\]

followed by

\[
 B_{1,f}(s)={\kappa(f)\over4\lambda^{3/2}}
             e^{-3s/2}B_2(Ae^s).                      \tag{2.8}
\]

Thus the endpoint shear `eta=0` deletes (2.7) exactly but leaves (2.8).
The fixed label-`8/12` exact exterior-white endpoint-null direction has

\[
 {\kappa(f)\over4\lambda^{3/2}}
      \longrightarrow-2\pi^{3/2},                    \tag{2.9}
\]

and its isolated two-tail Bernoulli norm obeys

\[
 \boxed{2\|B_{1,f}\|_2^2\longrightarrow
                 {2\pi^3\over135}>0.}                \tag{2.10}
\]

Indeed `int_0^1 B_2(x)^2 dx=1/180`, and logarithmic periodic averaging
gives the extra factor `1/3` from `e^{-3s}`.  Equation (2.10) is not a
lower bound for the complete paired-zero norm: the complete Volterra and
arithmetic rows remain.  It does prove that endpoint nullity cannot be
identified with deletion of the whole outer state.

Before the shear, the leading row is coherent.  For every fixed prefix of
same-phase columns, the exterior-white two-tail real-line Gram of (2.7)
tends to

\[
 {\pi\over12}{\bf1}{\bf1}^*.                           \tag{2.11}
\]

At the strip weight `y=1/2-delta`, its normalized diagonal scale is

\[
 {\pi\over48\delta}\lambda^{1-2\delta}.              \tag{2.12}
\]

Hence modewise positive estimates cannot be summed as though the leading
profiles were orthogonal.  The endpoint shear is a structural prerequisite
for a dimension-free rest estimate, not a cosmetic normalization.

## 3. The half-line transform is not a bare zeta multiplier

For a finite cutoff `M`, define

\[
 T_M\phi(s)=\sum_{1\leq m\leq M}m^{-1/2}
                    \phi(s+\log m),\qquad s\geq0.       \tag{3.1}
\]

For every `z` in a half-plane where the following integrals converge,
put `mathcal L g(z)=int_0^infty g(s)e^{-zs}ds`.  The change of variables
`t=s+log m`, followed by a finite interchange, gives the exact identity

\[
 \boxed{
 {\cal L}(T_M\phi)(z)
 =\int_0^\infty\phi(t)e^{-zt}
   \sum_{m\leq\min\{M,e^t\}}m^{z-1/2}\,dt.}           \tag{3.2}
\]

After the ordered limit at fixed `lambda`, the scalar inside (3.2) is

\[
 S_z(X)=\sum_{m\leq X}m^{z-1/2}.                       \tag{3.3}
\]

Set `w=1/2-z`.  Euler summation, initially in its ordinary convergence
region and then in the prescribed Dirichlet/Abel boundary sense, gives

\[
 \boxed{
 \begin{aligned}
 S_z(X)={}&{X^{z+1/2}\over z+1/2}
       +\zeta\!\left({1\over2}-z\right)
       -B_1(X)X^{z-1/2}\\
 &+\left({1\over2}-z\right)
       \int_X^\infty B_1(v)v^{z-3/2}\,dv,
 \qquad B_1(X)=\{X\}-{1\over2}.
 \end{aligned}}                                        \tag{3.4}
\]

Equations (3.2)--(3.4) exhibit all three pieces: the Euler main, the zeta
term, and the periodic-Bernoulli remainder.  The cutoff `m<=e^t` is forced
by half-line compression.  Extending `phi` by zero does not turn (3.1)
into group convolution, because every left translation meets the boundary
at `s=0`.

The full-line formal calculation

\[
 \widehat{T\phi}(\xi)
 \stackrel{\rm formal}{=}
 \left(\sum_{m\geq1}m^{-1/2+i\xi}\right)
       \widehat\phi(\xi)                               \tag{3.5}
\]

both uses a divergent Dirichlet series on the critical line and drops the
truncation in (3.2).  Analytic continuation of the scalar series repairs
neither omission.  Thus (0.2) is not an operator identity for the actual
tail.

In the completed two-branch Poisson profile, the zero-integral and endpoint
relations cancel specific Euler-main and endpoint rows.  Those
cancellations must be performed on the complete profile.  They do not
license deleting the Bernoulli remainder or replacing the half-line map by
(3.5).

## 4. Why classical convexity does not yet close the estimate

Classical convexity on the critical line has the schematic form

\[
 \left|\zeta\!\left({1\over2}+i\xi\right)\right|^2
 \leq C(1+|\xi|)^{1/2}\log^2(2+|\xi|).                \tag{4.1}
\]

Even if the zeta term in (3.4) is isolated correctly, (4.1) requires a
uniform fractional Mellin graph estimate.  A representative sufficient
input would be

\[
 \int_{\mathbb R}(1+|\xi|)^{1/2}\log^2(2+|\xi|)
   |\widehat{\phi_f}(\xi)|^2\,d\xi
 \leq C\lambda P(\lambda)D^\#(f),                    \tag{4.2}
\]

together with matching estimates for the Euler and Bernoulli maps in
(3.4).  Here `P` is polylogarithmic and `D^#` is the exact metric after the
endpoint congruence.

Endpoint-null `W^(2,1)` regularity proves only

\[
 |H_f(v)|\leq C_H(f,\lambda)(1+|v|)^{-2},             \tag{4.3}
\]

where the available constant depends on

\[
 \|f\|_1+|f'(\lambda-)|+|f'(-\lambda+)|+\|f''\|_1.   \tag{4.4}
\]

No admitted theorem bounds (4.4), or the left side of (4.2), by the exact
growing-rest exterior metric with the scale in (4.2).  The nonzero row in
(2.9) also shows why `eta=0` alone cannot set that constant to zero.
Therefore convexity is a possible route only after a new defect-relative
graph theorem; it is not by itself the missing collective estimate.

## 5. Exact fixed-dimension loss in the admitted dilation sieves

The far-annulus theorem proves, for a fixed `2m`-mode packet and arbitrary
arithmetic coefficients,

\[
 \left\|\sum_{n\in W}a_nT_n\right\|^2
 \leq C_m{A\log(2X)\over LX^2}
               \sum_{n\in W}|a_n|^2.                  \tag{5.1}
\]

Its scalar modal Gram estimate is uniform for each pair of modal labels.
The final source synthesis uses

\[
 \left(\sum_\gamma|b_\gamma|\right)^2
 \leq2m\sum_\gamma|b_\gamma|^2.                     \tag{5.2}
\]

The near-band fold theorem has the same final step.  If the packet
dimension is changed from fixed `2m` to the growing rest dimension `q`,
(5.2) becomes

\[
 \left(\sum_\gamma|b_\gamma|\right)^2
 \leq q\sum_\gamma|b_\gamma|^2,                      \tag{5.3}
\]

which is precisely a modal-count loss.  The constants `C_m` in the frozen
theorems are not uniform in `m`, so those theorems cannot be invoked with
`m=q(lambda)`.

The exact same-phase exterior orthogonality is

\[
 \int_\lambda^\infty H_j(v)\overline{H_k(v)}\,dv
 ={d_j\over2}\delta_{jk}.                             \tag{5.4}
\]

For unequal dilations the relevant entry is instead

\[
 \int_I H_j(mu)\overline{H_k(lu)}\,du,
 \qquad m\ne l,                                      \tag{5.5}
\]

and (5.4) supplies no Kronecker delta.  This is the exact reason that
exterior orthogonality cannot simply be inserted after the scalar
near/far estimates.

## 6. The missing operator-valued unequal-dilation lemma

Let `V_lambda^#` be the endpoint-null transformed rest, let `C_lambda^#`
be its source synthesis, and let

\[
 D_\lambda^\#=(C_\lambda^\#)^*D_{\rm ext}C_\lambda^\#
                                                                  \tag{6.1}
\]

be its exact exterior Gram on the quotient by its kernel.  Define

\[
 \Phi_\lambda x=\phi_{C_\lambda^\#x}.                \tag{6.2}
\]

For real `|y|<1/2`, let `M_y` multiply by `e^(ys)`.  For a finite
arithmetic window `W`, define the direct-sum synthesis

\[
 \mathcal L_{W,y}(x_m)_{m\in W}
 =\sum_{m\in W}M_yR_m\Phi_\lambda x_m.               \tag{6.3}
\]

Its exact operator-valued Gram blocks are

\[
 \mathfrak K_{m,l}^{(y)}
 =(D_\lambda^\#)^{-1/2}\Phi_\lambda^*R_m^*M_y^2
 R_l\Phi_\lambda(D_\lambda^\#)^{-1/2}.              \tag{6.4}
\]

Thus

\[
 \|\mathcal L_{W,y}\|^2
 =\left\|[\mathfrak K_{m,l}^{(y)}]_{m,l\in W}\right\|
 _{\ell^2(W)\otimes V_\lambda^\#}.                   \tag{6.5}
\]

This is only the locally recentered right-tail norm.  Put
`ell=log(lambda)`.  If
`F_x(s)=sum_(m in W)R_m Phi_lambda x_m` denotes the unweighted right
profile underlying (6.3), inversion reflection gives the two physical
branches

\[
 O_x(\ell+s)=O_x(-\ell-s)=F_x(s),\qquad s\geq0.
                                                               \tag{6.5a}
\]

Consequently the exact centered two-branch direct-sum synthesis is

\[
 \mathcal L_{W,y}^{\rm ctr}(x_m)_{m\in W}
 =\left(\lambda^y\mathcal L_{W,y}(x_m),
        \lambda^{-y}\mathcal L_{W,-y}(x_m)\right),     \tag{6.5b}
\]

with Gram blocks

\[
 \mathfrak K_{m,l}^{({\rm ctr},y)}
 =\lambda^{2y}\mathfrak K_{m,l}^{(y)}
  +\lambda^{-2y}\mathfrak K_{m,l}^{(-y)},
 \qquad
 \|\mathcal L_{W,y}^{\rm ctr}\|^2
 =\left\|[\mathfrak K_{m,l}^{({\rm ctr},y)}]_{m,l\in W}
   \right\|.                                          \tag{6.5c}
\]

In particular, for one unweighted reflected profile \(F\),

\[
 \|e^{y\,\cdot}O\|_2^2
 =\lambda^{2y}\|M_yF\|_2^2
  +\lambda^{-2y}\|M_{-y}F\|_2^2.                    \tag{6.5d}
\]

The needed advance over (5.1) is therefore the centered bound

\[
 \boxed{
 \left\|[\mathfrak K_{m,l}^{({\rm ctr},y)}]_{m,l\in W}
 \right\|
 \leq F_{W,y}^{\rm ctr}(\lambda)}                    \tag{6.6}
\]

whose constant is independent of `dim V_lambda^#`.  It must be proved
after the endpoint-null projection and in the exact full exterior metric;
pairwise scalar modal estimates followed by (5.3) do not prove (6.6).

For the inherited sampling range `0<h<=1/2`, let `Delta_h=tau_h-I` on
zero-extended half-line profiles and define the local translation blocks

\[
 \mathfrak K_{m,l}^{(\Delta,y)}
 =(D_\lambda^\#)^{-1/2}\Phi_\lambda^*R_m^*
 M_y\Delta_h^*\Delta_hM_yR_l\Phi_\lambda
 (D_\lambda^\#)^{-1/2}.                              \tag{6.7a}
\]

The left physical branch uses `Delta_(-h)` in its local coordinate, but
`Delta_(-h)=-tau_(-h)Delta_h`; unitarity of translation gives the same
Gram.  Hence the exact centered translation blocks and the needed bound are

\[
 \mathfrak K_{m,l}^{(\Delta,{\rm ctr},y)}
 =\lambda^{2y}\mathfrak K_{m,l}^{(\Delta,y)}
  +\lambda^{-2y}\mathfrak K_{m,l}^{(\Delta,-y)},
 \qquad
 \boxed{
 \left\|[\mathfrak K_{m,l}^{(\Delta,{\rm ctr},y)}]_{m,l\in W}
 \right\|
 \leq F_{W,y}^{\Delta,{\rm ctr}}(\lambda,h).}         \tag{6.7}
\]

The corresponding exact translation identity is

\[
 \|\tau_h(e^{y\,\cdot}O)-e^{y\,\cdot}O\|_2^2
 =\lambda^{2y}\|\Delta_hM_yF\|_2^2
  +\lambda^{-2y}\|\Delta_hM_{-y}F\|_2^2,             \tag{6.7b}
\]

where the equality of the left-branch \(\Delta_{-h}\) norm with the last
term was used.  Indeed `lambda>=5/2`, so
`h<=1/2<2log(5/2)<=2ell`; the translated left and right supports remain
disjoint.  All occurrences of `h` in (6.7)--(6.11) are restricted to
`0<h<=1/2`.  No centered full-line translation identity is asserted here
for `h>=2ell`, where cross-branch overlaps can occur.

For a dyadic partition `{W_j}` of the sampler indices, one sufficient
summability ledger is

\[
 \left(\sum_j\sqrt{|W_j|F_{W_j,y}^{\rm ctr}(\lambda)}\right)^2
 \leq C\lambda P(\lambda)\epsilon^{-1},
 \qquad \epsilon={1\over2}-|y|,                       \tag{6.8}
\]

and

\[
 \left(\sum_j\sqrt{|W_j|F_{W_j,y}^{\Delta,{\rm ctr}}
                          (\lambda,h)}\right)^2
 \leq C\lambda P(\lambda)\epsilon^{-1}h^\epsilon.   \tag{6.9}
\]

Indeed, apply (6.6) or (6.7) to the diagonal direct-sum vector
`x_m=x`, use `sum_(m in W)x_m^*D^#x_m=|W|x^*D^#x`, and then use
Hilbert-space Minkowski across the windows.  Equations (6.8)--(6.9) would
feed directly into the existing dyadic paired-zero sampling theorem and
give the desired collective scale, up to the separately controlled
singleton, origin bump, and compact projection remainder.

For comparison with one-branch estimates, define their exact local ledgers

\[
 \begin{aligned}
 {\cal A}_y&=\left(\sum_j\sqrt{|W_j|
       \|[\mathfrak K_{m,l}^{(y)}]_{m,l\in W_j}\|}\right)^2,\\
 {\cal A}_y^\Delta(h)&=\left(\sum_j\sqrt{|W_j|
       \|[\mathfrak K_{m,l}^{(\Delta,y)}]_{m,l\in W_j}\|}\right)^2.
 \end{aligned}                                        \tag{6.10}
\]

When the centered constants in (6.8)--(6.9) are taken to be the exact
block norms, those ledgers are, up to absolute constants, equivalent to
the branchwise scale requirements

\[
 \begin{array}{ll}
 {\cal A}_y\leq C\lambda^{1-2y}P(\lambda)\epsilon^{-1},
 &{\cal A}_{-y}\leq C\lambda^{1+2y}P(\lambda)\epsilon^{-1},\\
 {\cal A}_y^\Delta(h)\leq
   C\lambda^{1-2y}P(\lambda)\epsilon^{-1}h^\epsilon,
 &{\cal A}_{-y}^\Delta(h)\leq
   C\lambda^{1+2y}P(\lambda)\epsilon^{-1}h^\epsilon.
 \end{array}                                          \tag{6.11}
\]

Indeed the factors in (6.5c) and (6.7) turn both right sides into the
centered scale `lambda P/epsilon`; conversely the two centered block Grams
are sums of positive operators and dominate their weighted summands.  A
symmetric, stronger sufficient condition is that both signed local ledgers
are `O(lambda^(1-2|y|)P/epsilon)`, with the extra `h^epsilon` for the
translation ledger.  The uniform local scale `O(P/epsilon)` is also
sufficient.  A merely local `O(lambda P/epsilon)` bound for both signs
acquires the missing factor `lambda^(2|y|)` and gives almost `lambda^2 P`
near the strip boundary.  It is not the desired theorem.

The fixed-packet near/far theorems establish scalar analogues of pieces of
(6.6).  They do not establish (6.6), (6.7), or the summability ledger for
the growing endpoint-null rest.

## 7. Metric scope of the endpoint shear

Let `S_eta` be the lower-triangular column shear that retains the singleton
and sends every rest column to `ker eta`.  The licensed transformed objects
are

\[
 C^\#=CS_\eta,\qquad
 D_{\rm full}^\#=S_\eta^*D_{\rm full}S_\eta,
 \qquad Q^\#=S_\eta^*QS_\eta.                         \tag{7.1}
\]

Applying the shear only to the physical numerator while retaining the old
block metric is not a congruence and is rejected.

A sibling structured-metric attack proposes to compare the exact full
exterior Gram with the declared singleton/rest block metric by exploiting
the rank-two anchor cross.  If that comparison is independently proved,
congruence transports it through `S_eta`.  It is not a dependency of this
note, and no such comparison is used in (6.1)--(6.11).  The frame lemma is
therefore stated in the exact transformed exterior metric.

## 8. Exact frontier

The endpoint shear removes the unique common leading sawtooth direction.
It does not remove the derivative/Bernoulli row, the complete Volterra
profile, unequal dilations, or the half-line Euler and Bernoulli terms.
Classical zeta convexity is useful only after a defect-relative fractional
Mellin graph estimate, while the current near/far large sieves are useful
only after their fixed-dimensional modal synthesis is replaced by the
operator-valued estimate (6.6).

Accordingly, the earliest clean new theorem is (6.6)--(6.9), or an
equivalent completed zeta/Bernoulli graph theorem proving the same weighted
norm and translation ledger.  Until one of those statements is proved,
the `q=O(lambda^2)` loss in the current positive sampling theorem remains
unremoved.  No signed conclusion follows even if the positive frame lemma
is later established.
