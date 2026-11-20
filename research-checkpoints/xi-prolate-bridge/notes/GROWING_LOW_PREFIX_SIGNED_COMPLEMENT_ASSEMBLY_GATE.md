# Growing low-prefix signed-complement assembly gate

## 0. Result and fail-closed boundary

Use the locked schedule

\[
 \lambda={p\over2},\qquad c=2\pi\lambda^2,\qquad
 L=2\log\lambda,\qquad M\leq C_0L,                    \tag{0.1}
\]

and only the slowly growing low-label prefix

\[
 \mathcal T_M=\{4,8,\ldots,4M\}.                     \tag{0.2}
\]

This note does not concern the full transition inventory of size
comparable with `lambda^2`.  Let `D_M^#` be the exact full exterior Gram
after the endpoint shear, and work on the quotient by its kernel.  A hat
means whitening by `(D_M^#)^(-1/2)`.  The frozen equality-conductor theorem
gives

\[
 \widehat Q_{{\rm eq},M}^\#\succeq
 \left\{{L\over4}-{1\over4}\log L-C_{\rm eq}\right\}I.
                                                               \tag{0.3}
\]

The main conclusions are as follows.

1.  The literal operator-valued unequal-dilation bounds (6.6)--(6.7) of
    the endpoint-null reduction are positive Gram bounds with unspecified
    right sides.  Even with their intended ledgers (6.8)--(6.9), their
    scale is `O(lambda*polylog(lambda))`, not `o(L)`.  They do not imply a
    signed negative-part bound for the complement of (0.3).

2.  The divided-difference tail theorem gives an `O(sqrt(M))` weighted
    bound for the raw correlation `U^*V_qU`, but this is not the complete
    same-side prime fold.  The physical profile is
    `sum_m R_m Phi=(2*sqrt(2))^(-1)sum_m R_mU`; after equality removes
    `m=ql`, the remaining double sampler sum and the unequal-dilation
    Archimedean centered multiplier are both open.

3.  Independently, compact projection costs `o(L)`, the even
    pole has negative part zero, the origin beta row is killed exactly by
    the locked correction, and the leading endpoint sawtooth is killed on
    the sheared rest.  The expected quartic/hard-core scale
    `O_(C_0)(L^2*c^(-1/4))` uses growing-label uniform Jost symbols which
    are not pinned.  Those exact cores therefore remain inside the
    outer-only complete non-equality gate `OO-NEQ`; they are not
    independently closed in this assembly.

4.  The wide reflected stationary principal model is not itself the final
    obstruction.  Its exact leading geometry is a reciprocal Toeplitz
    frame plus a symmetric Hankel frame.  Pinned-PNT Carleson embedding
    gives `O(sqrt(M)*log^2(M+2))=o(L)` for those model operators.  A uniform
    `regular-FIO` passage to the complete outer-only physical profile after
    equality removal is still missing.

5.  The pinned direct-source theorem already fixes the finite-cutoff
    ordered-slot algebra without a scalar `R,C_R,C_L,B` mask partition.
    Its ordinary prime endpoints and both Archimedean boundaries must not
    be duplicated by midpoint or endpoint bookkeeping rows.  Trace-nullness
    removes the leading endpoint row but not the Carleman cross.

Section 9 gives a precise conditional assembly theorem under the single
named outer-only complete non-equality estimate `OO-NEQ`.  Exact global
radicality gives `Q_X=W_Z(O,O)`, and the equality conductor removes the
whole common-sampler Archimedean/prime subsystem before the regular FIO
estimate.  The direct-source signed compression is an equivalent harder
route, not the sole gate.  No unconditional growing-prefix floor,
full-transition result, physical quotient comparison, equation (5.2) of
`DIRECT_RH_ATTACK.md`, determinant limit, zero statement, or Riemann-
hypothesis conclusion is proved.  The formal state remains
`P0_INVALIDATED`, and the standard eight are unchanged.

## 1. Frozen repository inputs

The audit starts from the following exact bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/FIXED_TO_GROWING_TOEPLITZ_OPERATOR_NORM_GATE.md` | `57f4a8014e280e4594221b4466212b0104d2d7c25e9e6ff81808a4eb7f14ce25` |
| `tests/test_fixed_to_growing_toeplitz_operator_norm_gate.py` | `4b2d982c5de1b28fe3bac56e412f43a6a333bf47e643cf6bd435e589271bbf31` |
| `notes/GROWING_TRANSITION_ENDPOINT_NULL_COLLECTIVE_DILATION_FRAME_REDUCTION.md` | `bbffec21c91b1e1150e36c9b2120b9255f1d0aa1bd4a1c7ec226e02db8d6abe6` |
| `tests/test_growing_transition_endpoint_null_collective_dilation_frame_reduction.py` | `eb25ab43e4f5fdeea96d89aa425ac2a9ab4f7cbdd0feaad3294e494387840f66` |
| `notes/GROWING_TRANSITION_EQUALITY_CONDUCTOR_GARDING_THEOREM.md` | `f746d5e8e9efdcd585ace947789597954d9a8f7b57319f4398612bf3986b0079` |
| `tests/test_growing_transition_equality_conductor_garding_theorem.py` | `61713e1f3007042eecfea5be0f1178b02311e5b9d4387af8c0123be293fc73ba` |
| `notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md` | `6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9` |
| `tests/test_growing_transition_complete_central_form_reduction.py` | `a842fdd24e095cde5af373060f9017e03bb13df1db5ecf6f6374c4fbcf6743de` |
| `notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md` | `2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97` |
| `tests/test_growing_transition_direct_source_upper_form_theorem.py` | `96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2` |
| `notes/GENERIC_FIXED_INVERSION_EVEN_COMPLETE_WEIGHTED_PAIR_THEOREM.md` | `c53a709dd1d7603ef1d2361c324a3f91f471705989ee06cd0f715fe4da4ec213` |
| `tests/test_generic_fixed_inversion_even_complete_weighted_pair_theorem.py` | `3dea227c95a0a514578229b2e07b13e4d42ab57f7c5459245c9796ce3344cbe1` |
| `notes/GROWING_LOW_PREFIX_ENDPOINT_NULL_WEIGHTED_TAIL_FRAME_THEOREM.md` | `173127618d340b2ad8feb127baba0c36502b41b791b51fc136ae4a1a5e5d2dcc` |
| `tests/test_growing_low_prefix_endpoint_null_weighted_tail_frame_theorem.py` | `5d66eb7efcadd80b39303ae41633c7df2f1fc88621f58ad26fb11e4ade47290b` |
| `notes/MOVING_LABEL_CARRIER_COFRAME_DEFECT_RIGHT_INVERSE_THEOREM.md` | `caaa4df57d43f74ef56fed6df907da6db0daa7b0f89da23cce30bc2ac9369acd` |
| `tests/test_moving_label_carrier_coframe_defect_right_inverse_theorem.py` | `31f8ffad0dc5a1f2b6a00a47b55238d64d9bc6550813d5b77b15c00da1757913` |
| `notes/GROWING_LOW_PREFIX_COMPLETE_PROFILE_FIO_REDUCTION.md` | `1385a095441c06870487a87afd24a6a42cddb9ebc7a8c9b7d227e27e10af8cce` |
| `tests/test_growing_low_prefix_complete_profile_fio_reduction.py` | `ec61460ba6dc7ba2f7655b3e175e269c7c154d9013d85ff5f5429a70a93b527d` |
| `P3_SOURCE_LOCK.json` | `42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3` |

The concurrent fixed-prefix Toeplitz theorem motivates the prefix (0.2),
but no moving-prefix conclusion from that theorem is imported.  Its fixed
pair constants are precisely what must not be treated as uniform here.

## 2. Exact ledger in the sheared full metric

Let `Q_(X,M)^#` be the complete unprojected central form and let
`Sigma_(N,M)^#` be the actual projected signed form.  The complete-central
reduction gives

\[
 \left\|\widehat\Sigma_{N,M}^\#-
              \widehat Q_{X,M}^\#\right\|
 \leq\delta_M,\qquad \delta_M=o(L),                  \tag{2.1}
\]

uniformly for `M<=C_0*L`.  Indeed its exponential estimate permits any
polynomial or logarithmic inventory.  The congruence is performed before
whitening, so (2.1) uses the exact `D_M^#`, not a diagonal substitute.

Exact global radicality and the later direct-source theorem give two
representatives of the same complete form:

\[
 Q_X=\mathcal W_Z(O,O)
 ={Q_X^\uparrow+(Q_X^\uparrow)^*\over2},\qquad
 Q_X^\uparrow=-\mathcal W_Z(X,O).                     \tag{2.2}
\]

After the origin correction, endpoint shear, low-column restriction, and
full-metric whitening, the preferred object audited here is the outer-only
complement

\[
 \widehat E_{{\rm oo,neq},M}^\#
 =\widehat Q_{X,M}^\#-\widehat Q_{{\rm eq},M}^\#.     \tag{2.3}
\]

In the outer-only representative, equality removes the full common-sampler
Archimedean and prime subsystem, leaving unequal-sampler and reflected
regular profiles, every higher sampler, and all hard and Volterra pieces.
If one instead uses the direct-source representative, its ordinary prime
endpoints are already in formula (5.7), while both Archimedean boundaries
and the tail are already in (4.4) and (6.6).  Midpoint half-rows from an
optional mask repartition must not be added.

The even pole remains the exact positive summand

\[
 \widehat P_{+,M}=2|p_{+,M}\rangle\langle p_{+,M}|\succeq0. \tag{2.4}
\]

Equations (2.2)--(2.3) do not apply radicality to an isolated prime,
Archimedean, alias, or reflected summand.  The locked origin bump remains
inside the physical profiles; only the beta row proportional to the
corrected value at zero vanishes.  Later stationary pieces are analytic
models for the regular part of (2.3), not a new exact source decomposition.

## 3. Blocks which are already harmless

### 3.1 Compact projection

Equation (2.1) is a two-sided operator estimate, so its negative cost is at
most `delta_M=o(L)`.  It includes both mixed projection orientations and
the projection--projection term.  No entrywise summation is involved.

### 3.2 Even pole

Congruence and whitening preserve positivity in (2.4).  Hence

\[
 \|(-\widehat P_{+,M})_+\|=0.                          \tag{3.1}
\]

No magnitude estimate for the pole row is needed for a lower bound.

### 3.3 Rows killed exactly

For every corrected source, `f(0)=0`; therefore the coherent Poisson beta
row is identically zero.  On the transformed rest, the endpoint shear gives
`eta(f)=f(lambda)=0`, so the leading sawtooth profile proportional to
`eta` is also identically zero.  Neither statement deletes the complete
origin-bump profile, the derivative/Bernoulli row, the Volterra remainder,
or a boundary row created by Stieltjes integration.

The unsheared retained edge has fixed dimension.  Its pure self block is
not a growing modal obstruction, but its edge--rest profile must still be
controlled inside the complete-profile estimate.

### 3.4 Operator-status ledger

The exact low-prefix audit is summarized here.  Every norm is taken only
after the full-metric congruence and whitening.

| Block | Best present negative cost | Status |
|---|---:|---|
| equality conductor | none; supplies (0.3) | proved floor |
| compact projection | `delta_M=o(L)` | closed |
| even pole | `0` | closed by PSD |
| corrected origin beta | `0` | killed exactly |
| leading endpoint row on sheared rest | `0` | killed exactly |
| ordered direct-source slot algebra | exact (3.4),(4.4),(5.7),(6.6) | closed; no mask bridge needed |
| raw one-tail prime shift | `O(sqrt(M))=o(L)` | useful subchannel only |
| complete non-equality same-side fold | no sampler almost-orthogonality | open `regular-FIO` subproblem |
| reflected prime quartic/hard cores | expected `O(L^2*c^(-1/4))` | retained in `OO-NEQ`; uniform Jost symbols unpinned |
| reflected continuous main | negative cost `0` | closed by PSD factorization |
| reflected logarithmic tail | `o(1)` | closed by the positive frame bound |
| reflected stationary principal model | `O(sqrt(M)*log^2(M+2))=o(L)` | closed by Fourier frames |
| complete outer-only regular profile | no uniform stationary reduction | open `OO-NEQ` / `regular-FIO` |
| direct-source Carleman/Weber route | equivalent exact limit, harder finite-cutoff proof | optional `DS-SC` route |
| endpoint/alias expansions | not autonomous exact blocks | direct formula must not be duplicated |

Thus no block is declared small merely because its scalar entries are
bounded or because it has finite rank.

## 4. Why (6.6)--(6.7) do not give a signed estimate

Let `T` be any centered physical synthesis controlled by an
unequal-dilation Gram theorem.  Such a theorem has the form

\[
 T^*T\preceq F_\lambda I.                              \tag{4.1}
\]

A signed channel has the form `T^*JT`, where `J` is self-adjoint.  From
(4.1) one obtains only

\[
 \|(T^*JT)_-\|\leq\|J\|F_\lambda.                    \tag{4.2}
\]

On a prefix of size `Q=O(L)`, the strongest currently targeted positive
tail specialization has schematic bounds

\[
 \|R_mU\|^2\leq C Q^3m^{-4},\qquad
 \mathcal A_{\rm ctr}\leq C\lambda Q^3\epsilon^{-1}
 =O(\lambda L^3\epsilon^{-1}).                       \tag{4.2a}
\]

This removes the modal `ell^1` loss and is valuable for positive sampling,
but its scale is still much larger than `L`.  It supplies no sign for the
same-side, reflected, or alias kernels.

This is sharp.  Take a one-dimensional source, `T=sqrt(L)`, and `J=-1`.
Then (4.1) holds with the dimension-free constant `F_lambda=L`, the
translation companion may be zero, and

\[
 T^*JT=-L.                                             \tag{4.3}
\]

The intended ledger `F_lambda=O(lambda*polylog(lambda))` permits (4.3),
because `L=o(lambda)`.  Thus even on a one-label prefix, and therefore also
on (0.2), the positive Gram hypothesis does not imply `o(L)` signed loss.

The same positive tail theorem nevertheless gives a useful raw-shift
bound once its trivial isometry estimate is retained.  Let `V_q` be
translation by `log(q)` toward the tail.  Then

\[
 \|V_qU\|^2\leq\min\{1,CM^3q^{-3}\},\qquad
 \|U^*V_qU\|\leq\min\{1,CM^{3/2}q^{-3/2}\}.           \tag{4.4}
\]

The exact prime coefficient is `Lambda(q)/sqrt(q)` on each ordered
orientation.  Chebyshev partial summation gives

\[
 \sum_{q\leq M}{\Lambda(q)\over\sqrt q}\leq C\sqrt M,
 \qquad
 \sum_{q>M}{\Lambda(q)\over q^2}\leq {C\over M}.     \tag{4.5}
\]

Splitting the operator sum at `q=M` therefore proves only

\[
 \boxed{
 \sum_{q\geq2}{\Lambda(q)\over\sqrt q}
 \|U^*V_qU\|\leq C\sqrt M=o(L).}                    \tag{4.6}
\]

This is an operator estimate before source coordinates are chosen and
does not sum modal entries.  The exact physical normalization is
`Phi=(2*sqrt(2))^(-1)U`, so the complete profile is

\[
 B=\sum_{m\geq1}R_m\Phi
 ={1\over2\sqrt2}\sum_{m\geq1}R_mU,\qquad
 V_qR_l=\sqrt q\,R_{ql}.                              \tag{4.7}
\]

For the common pairs, the two ordered prime orientations give

\[
 \begin{aligned}
 -4\sum_{q,l\geq1}\Lambda(q)\|R_{ql}\Phi\|^2
 &=-{1\over2}\sum_{q,l\geq1}\Lambda(q)\|R_{ql}U\|^2\\
 &=-{1\over2}\sum_{m\geq1}\log m\,\|R_mU\|^2.
 \end{aligned}                                       \tag{4.8}
\]

Thus the physical-to-isometric Gram conversion is exactly `1/8`: the
equality-prime coefficient is `-4` in (Phi) coordinates and `-1/2` in
(U) coordinates.  The equality subsystem removes only `m=ql`, leaving a
double non-equality sampler sum.  Hence (4.6) is not a complete prime-fold
bound.  That sum and the unequal-dilation Archimedean centered multiplier
both require uniform carrier integration or Cotlar almost orthogonality
and are retained in the `regular-FIO` subproblem and in `OO-NEQ` below.

## 5. Conditional quartic/hard-core diagnostic

For labels `s=4j`, `t=4k`, the generic reflected convolution has its only
quartic point at

\[
 (m,l,y,u)=(1,1,\log2,{1\over2}\log2).                \tag{5.1}
\]

The fixed-pair center coefficient is

\[
 C_{ts}(\log2)=(-1)^{j+k}
 {\Gamma(1/4)\cos(\pi/8)\over8\pi}c^{-1/4}
 +o_{s,t}(c^{-1/4}).                                  \tag{5.2}
\]

On the low prefix, the phase-index perturbation on the quartic scale is
`O(L*c^(-1/4))=o(1)`.  If a growing-label uniform Jost-symbol theorem is
assumed, (5.2) is uniform on `j,k<=M` in the core

\[
 I_c=\{y:|y-\log2|\leq Kc^{-1/2}\}.                  \tag{5.3}
\]

The continuous core has mass `O(c^(-3/4))`, but it belongs to the global
positive factorization in Section 6 and is not split off in the operator
ledger.  If `y=log(n/A)` lies in (5.3), with `A=lambda^2`, then the number of possible
integers is `O(c^(1/2))`, while

\[
 {\Lambda(n)\over n}\leq {C L\over c}.               \tag{5.4}
\]

Hence the prime core has mass `O(L*c^(-3/4))`.  After the physical factor
`2*lambda=O(c^(1/2))`, every prime-core
entry is `O(L*c^(-1/4))`.

More structurally, its leading matrix is

\[
 \rho_c vv^*,\qquad v_j=(-1)^j,\qquad
 |\rho_c|\leq C Lc^{-1/4}.                            \tag{5.5}
\]

No sign of `rho_c` is used.  A pointwise caustic sign by itself would not
determine the sign of the full reflected Stieltjes quadrature.  Since
`||vv^*||=M`, the same assumed uniform quartic expansion would bound the
remaining core by the power-small Hilbert--Schmidt scale

\[
 \boxed{
\|\widehat E_{{\rm refl,prime\ core},M}\|
 \leq C_{C_0}L^2c^{-1/4}=o(1).}                       \tag{5.6}
\]

The same conditional calculation covers the hard core at `y=0` and the
boundary reciprocal points `(m,l)=(1,2),(2,1)`; only finitely many sampler
pairs meet those degeneracies.  It shows that the alternating rank-one
center phase is not a model-level `O(L)` obstruction once uniform symbols
are supplied.  It does **not** prove (5.6) for the exact growing-prefix
profile: the required growing-label Jost symbols are not among the pinned
inputs.  Consequently all exact quartic and hard cores remain in the
complete `OO-NEQ` object and in any proposed regular remainder.  No core
term is subtracted separately in Section 9.

## 6. The wide reflected Stieltjes/FIO gate

Outside (5.3), the scalar quartic envelope becomes schematically

\[
 |C_{ts}(\log2+\eta)|
 \lesssim c^{-1/2}|\eta|^{-1/2}.                     \tag{6.1}
\]

The outer factor `lambda` removes the `c^(-1/2)` gain.  The label phases
vary with both `j+k` and `j-k`, so the correct moving-prefix object is a
Hankel/FIO compression, not a collection of scalar entries.

Two of the three Stieltjes pieces can nevertheless be disposed of before
the missing estimate is stated.  If

\[
 g_x=\sum_jx_jg_{4j},
\]

then the Hermitian polarization of the reflected convolution is

\[
 C_x(y)=\int_0^y\overline{g_x(s)}g_x(y-s)\,ds.        \tag{6.2}
\]

For real coefficient vectors this is the original real symmetric
convolution; for complex vectors it is the exact paired realification of
the two ordered orientations.  Fubini for the already regularized profiles
gives

\[
 \int_0^\infty C_x(y)\,dy
 =\left|\int_0^\infty g_x(u)\,du\right|^2.            \tag{6.3}
\]

The continuous contribution to `Q_refl=-2*lambda*M` is therefore a
positive rank-one Gram and has negative cost zero.  The logarithmic tail
has the expansion

\[
 A^{-3}{e^{-3y}\over1-A^{-2}e^{-2y}}
 =\sum_{r\geq0}A^{-3-2r}e^{-(3+2r)y}.                 \tag{6.4}
\]

Indeed, the quadratic form of its `r`-th term is the squared modulus of
the Laplace row

\[
 x\longmapsto\int_0^\infty e^{-(3+2r)s}g_x(s)\,ds.
                                                               \tag{6.5}
\]

Its sign in `Q_refl` is negative, but Cauchy--Schwarz and the positive
profile frame give

\[
 \|E_{{\rm refl,log},M}\|
 \leq C\lambda A^{-3}F_\lambda
 \leq C\lambda^{-4}L^3=o(1),                          \tag{6.6}
\]

when the low-prefix positive ledger
`F_lambda=O(lambda*L^3)` is used.  A stronger sufficient prime-only target
is the wide part of

\[
 -2\lambda\sum_{n>A}{\Lambda(n)\over n}
 \mathcal C_M\!\left(\log{n\over A}\right),          \tag{6.7}
\]

where `mathcal C_M(y)` is the full-metric-white causal-convolution matrix.
The fixed-pair theorem proves only `O_{s,t}(1)` after this prime term is
combined with its continuous partners; it supplies no moving operator
norm for (6.7).  In particular, (6.7) is not called equivalent to the
combined Stieltjes block.

The moving-label phase theorem now identifies the principal operator.  If
`r=ml*exp(y)` and `beta=arctan(1/x)`, the two stationary branches are

\[
 \begin{array}{ll}
 x_1=x_2=\sqrt{r-1}:&
 2c\sqrt{r-1}+(\nu_t+\nu_u)\beta,\\
 x_1x_2=1:&
 cr+\nu_u\pi/2+(\nu_t-\nu_u)\beta .
 \end{array}                                          \tag{6.8}
\]

For `t=4j,u=4k`, the first label kernel is Hankel in `j+k` and the second
is Toeplitz in `j-k`.  At a prime atom, `cr=2*pi*m*l*n`, so the reciprocal
geometric carrier is exactly one.  Stationary phase followed by the beta
change of variables gives prime total-variation measures satisfying, for
`h=1/M`,

\[
 \sup_{|I|=h}|\sigma_{\rm rec}|(I)
 \leq Ch\log^2(e/h),\qquad
 \sup_{|I|=h}|\sigma_{\rm sym}|(I)
 \leq C\sqrt h\log^2(e/h).                            \tag{6.9}
\]

The pinned PNT is enough because its relative error is
`L^(3/2)*exp(-alpha*sqrt(L))=o(M^(-N))`; below that scale lattice counting
handles the caustic.  Finite-resolution Fourier embedding then proves for
the stationary principal matrices

\[
 \boxed{
 \|K_{\rm rec}\|\leq C\log^2(M+2),\qquad
 \|K_{\rm sym}\|\leq C\sqrt M\log^2(M+2)=o(L).}      \tag{6.10}
\]

Thus the former `RF` warning has been reduced to a precise analytic
remainder: prove uniformly that the exact finite-Fejer reflected profile
equals these principal frames plus an `o(L)` one-sided remainder.  The
constant-entry Hankel countermodel still shows why fixed-pair `O(1)` alone
could not have supplied (6.10), but it is no longer the sharp description
of the actual principal phase.

## 7. Endpoint rows are an internal proof warning

A Hermitian pair of whitened rows has the form

\[
 E_{u,v}=|u\rangle\langle v|+|v\rangle\langle u|,
 \qquad
 E_{u,v}\succeq-2\|u\|\|v\|I.                        \tag{7.1}
\]

If a future exact finite-cutoff expansion isolates derivative, Bernoulli,
Volterra-boundary, and retained-edge rows, a sufficient sublemma would be

\[
 \sum_r 2\|u_{r,M}\|\|v_{r,M}\|
 +\sum_s (a_{s,M})_-\|w_{s,M}\|^2=o(L),              \tag{7.2}
\]

uniformly for `M<=C_0*L`.  Here `a_-:=max(0,-a)`, and all row norms are
dual norms in the exact `D_M^#` metric.

Rank alone cannot replace (7.2): with
`u=-v=sqrt(L/2)e_1`, equation (7.1) is the rank-one matrix
`-L|e_1><e_1|`.  This counterexample also explains why an `L2` profile
frame does not control a boundary trace.  Boundary evaluation is
unbounded on `L2`; for example,

\[
 b_N(s)=\sqrt{2N}e^{-Ns},\qquad
 \|b_N\|_{L^2(0,\infty)}=1,\qquad b_N(0)=\sqrt{2N}.   \tag{7.3}
\]

The exact endpoint shear removes the leading `eta` row on the rest, but it
does not prove (7.2) for a termwise derivative hierarchy.  More
importantly, no current exact source theorem makes that hierarchy an
autonomous matrix: the complete `B_2`/Volterra profile survives.  Hence
(7.2) is a warning for one possible proof of `regular-FIO`, not a separate
assembly hypothesis and not a bound for the singular direct-source block.

## 8. Aliases are also internal unless exactly split

The maps in (6.6)--(6.7) of the endpoint-null reduction are built from the
physical half-line dilations `R_m Phi_lambda`.  A deterministic Fourier
alias is instead a paired coefficient such as

\[
 S_h=\widehat K(h)+\widehat K(-h).                    \tag{8.1}
\]

Prime weights, divisor masks, and finite cutoffs do not preserve a formal
identification between these two objects.  If an exact weighted
Poisson/orientation identity later isolates an alias residual, a sufficient
sublemma would be

\[
 \sup_{M\leq C_0L}
 \|(\widehat E_{{\rm alias},M})_-\|=o(L).             \tag{8.2}
\]

This would be independent of a physical Gram theorem.  In an abstract model one
may set every physical dilation map to zero, so (6.6)--(6.7) hold with
zero right side, while taking `E_alias=-L I`.  Thus no logical implication
from the former to (8.2) exists.  The direct-source theorem keeps the
ordered prime integral intact without requiring a both-miss mask.  Thus
(8.2) is another possible sublemma of `regular-FIO`, not an autonomous exact
block in the intrinsic outer-only object (2.3).

## 9. Conditional low-prefix assembly theorem

Exact global radicality gives the preferred outer-only representative

\[
 Q_X=\mathcal W_Z(O,O).                                \tag{9.1}
\]

Let (\mathcal C_M) be the exact map from full-metric-white low-prefix
coordinates to the corrected, endpoint-sheared physical outer columns.
For the finite-Fejer approximation (O_F), form the complete distribution,
take the ordered limit, and only then subtract equality:

\[
 \widehat E_{{\rm oo,neq},M}^\#
 =\underset{F\to\infty}{\operatorname {ord\!\!-\!lim}}
   \mathcal C_M^*\mathcal W_Z(O_F,O_F)\mathcal C_M
   -\widehat Q_{{\rm eq},M}^\#.                      \tag{9.2}
\]

By (4.8), equality removes the entire common-sampler Archimedean channel
and every prime pair (m=ql), with coefficient `-4` in physical (Phi)
coordinates and `-1/2` in isometric (U) coordinates.  This includes the
cross-label Toeplitz/Plemelj-scale common-sampler part.  The remainder in
(9.2) is therefore the genuinely non-equality same-side/reflected regular
outer profile; no separate compressed singular-principal sign is left.

**Hypothesis `OO-NEQ` (outer-only complete non-equality estimate).**
Uniformly for
`M<=C_0*L`, the ordered limit in (9.2) exists in the exact sheared full
metric and

\[
 \boxed{\|(\widehat E_{{\rm oo,neq},M}^\#)_-\|=o(L).} \tag{9.3}
\]

Equivalently, it is enough to prove
`E_oo,neq,M^# >= -epsilon_L*L*I` with `epsilon_L->0`; a positive floor is
stronger.  A concrete **`regular-FIO`** route asks for the cutoff-uniform
exact decomposition

\[
 \widehat E_{{\rm oo,neq},M}^\#
 =K_{{\rm rec},M}+K_{{\rm sym},M}+P_{{\rm cont},M}
  +E_{{\rm log},M}+R_{{\rm reg},M},                  \tag{9.4}
\]

where

\[
 P_{{\rm cont},M}\succeq0,qquad
 \|E_{{\rm log},M}\|=o(1),\qquad
 \|(R_{{\rm reg},M})_-\|=o(L).                      \tag{9.5}
\]

The exact quartic/hard cores, complete non-equality same-side terms, higher
samplers, and regular Volterra pieces remain in (R_{{\rm reg},M}).  The
principal-frame theorem controls the displayed (K)'s, but the uniform exact
passage from (9.2) to (9.4) is not pinned.

The direct-source formula

\[
 Q_F^\uparrow=-\mathcal W_Z(X_F,O_F),\qquad
 \operatorname {Herm}Q_F^\uparrow
 ={Q_F^\uparrow+(Q_F^\uparrow)^*\over2}               \tag{9.6}
\]

is an equivalent ordered-limit route.  Its factor `1/2` is mandatory, and
its prime and Archimedean endpoints are already allocated.  A direct-source
`DS-SC` proof is harder at finite cutoff because it must carry the
Carleman/Weber principal and full-source congruence until equality
cancellation.  It is not the sole missing gate; adding midpoint or extra
endpoint rows would double-count the direct formula.

Under `OO-NEQ`, equations (2.1), (0.3), and (9.3) give

\[
 \begin{aligned}
 \widehat\Sigma_{N,M}^\#\succeq
 \bigg\{&{L\over4}-{1\over4}\log L-C_{\rm eq}
 -o(L)-\delta_M\bigg\}I.
 \end{aligned}                                       \tag{9.7}
\]

Therefore, uniformly for `M<=C_0*L`,

\[
 \boxed{\widehat\Sigma_{N,M}^\#\succeq {L\over8}I}  \tag{9.8}
\]

for all sufficiently large locked `lambda`.

The raw shift and reflected stationary frames already bound genuine model
subchannels, but they do not prove (9.3).  The earliest missing lemma is the
cutoff-uniform `OO-NEQ` estimate; `regular-FIO` is its intended analytic
route.  Endpoint rows and aliases become separate estimates only if a proof
derives a split which recombines exactly to (9.1) or (9.6), without
duplicating direct-source endpoints.

## 10. Scope audit

The dimension bound in (0.1) is used essentially in the model estimates
(5.6) and (6.10), and nowhere is it replaced by the full transition count.
The conditional theorem is only about the complete signed matrix on the
low prefix in the exact sheared full exterior metric.  It does not compare
that metric with a declared block quotient, perform the singleton short
required by the physical project, or control the high complement.  In
particular, (9.8), even if its hypotheses are later proved, is not by
itself an RH theorem.
