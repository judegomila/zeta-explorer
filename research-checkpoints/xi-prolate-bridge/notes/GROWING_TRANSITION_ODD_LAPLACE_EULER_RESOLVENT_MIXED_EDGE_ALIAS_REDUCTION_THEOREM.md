# Growing-transition odd-Laplace Euler-resolvent mixed-edge alias reduction theorem

## 0. Exact reduction and fail-closed verdict

Use the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 A=\lambda^2,\qquad c=2\pi A,\qquad L=2\log\lambda . \tag{0.1}
\]

Let `V` be one fixed finite coefficient packet and let `x mapsto f_x` be
its physical source synthesis.  Every source is even, supported on
`[-lambda,lambda]`, globally `W^(2,1)`, and obeys

\[
 f_x(0)=0,\qquad \int_{\mathbb R}f_x(u)\,du=0,
 \qquad f_x(\lambda)=f_x(-\lambda)=0.                 \tag{0.2}
\]

For every odd integer `z>=3`, the complete generalized-harmonic/Hurwitz
row has the exact Euler-resolvent form

\[
 \boxed{
 \mathcal B_z=\mathcal R_z,\qquad
 \mathcal A_z=C_z-\mathcal L_z-\lambda^{1-2z}\mathcal R_z.} \tag{0.3}
\]

Here `C_z` is the compact moment row and `mathcal L_z,mathcal R_z` are the
left and right periodic-Bernoulli dilation resolvents defined in Section
3.  Consequently

\[
 \boxed{
 \mathsf S(\mathcal A_z,\mathcal B_z)
 =\mathsf S(C_z,\mathcal R_z)
  -\mathsf S(\mathcal L_z,\mathcal R_z)
  -2\lambda^{1-2z}\mathcal R_z^*\mathcal R_z,}       \tag{0.4}
\]

where `mathsf S(U,V)=U^*V+V^*U`.  Only the last summand in (0.4) has a
fixed sign.  It is also suppressed by `lambda^(1-2z)`.  The two leading
crosses are not squares and have no sign from Euler summation alone.

After, and only after, the ordered unweighted Poisson limit at fixed
`lambda`, the exact middle-band alias remainder is

\[
 \boxed{
 \widehat R_{\rm alias}^{I_L}
 =\sum_{z\in I_L}\left\{
  \mathsf S(\widehat{\mathcal A}_z^1,
            \widehat{\mathcal B}_z^+)
 +\mathsf S(\widehat{\mathcal A}_z^+,
            \widehat{\mathcal B}_z^1)
 +\mathsf S(\widehat{\mathcal A}_z^+,
            \widehat{\mathcal B}_z^+)\right\}.}     \tag{0.5}
\]

The complete exterior sampled-series theorem does control one mixed
orientation on both frozen cluster schedules:

\[
 \boxed{
 \left\|P_E\sum_{z\in I_L}
 \mathsf S(\widehat{\mathcal A}_z^{1,{\rm high}},
           \widehat{\mathcal B}_z^{+,{\rm low}})P_E
 \right\|=o(\tau_L).}                                \tag{0.6}
\]

The first presently uncontrolled mixed packet-scale estimate is the
reverse orientation

\[
 \boxed{
 \left\|P_E\sum_{z\in I_L}
 \mathsf S(\widehat{\mathcal A}_z^{+,{\rm high}},
           \widehat{\mathcal B}_z^{1,{\rm low}})P_E
 \right\|=o(\tau_L).}                                \tag{0.6a}
\]

in norm, or a signed leading asymptotic replacing (0.6a).  This is a
finite-dimensional physical packet question.  It is not itself a global
Pick statement or an RH-equivalent assertion.  Whole-half-plane Pick
positivity would be an unavailable RH-level route to a much stronger
claim, not a license to assume (0.6a).

The completed alias sign therefore remains open: the exact formulas in
this note prove neither cancellation nor reinforcement of the local
Cauchy block.  They construct no physical compact-prolate counterpacket.
No complete continuous sign, prime sign, complete central sign,
determinant conclusion, RH statement, or Lambda bound follows.  The
project state remains `P0_INVALIDATED`.

## 1. Frozen inputs

The following current repository bytes are binding inputs.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_ODD_LAPLACE_MIDDLE_BAND_ALIAS_FRAME_OBSTRUCTION_THEOREM.md` | `6863fd558c13b52255a5bca67c2bb91aae4cd75b82180835a37e178546f70956` |
| `tests/test_growing_transition_odd_laplace_middle_band_alias_frame_obstruction_theorem.py` | `7c0c1a4abaa5768291ca6e7bfc9ca01915e6e8f78ada3f4071ac490a83c59a5a` |
| `notes/GROWING_TRANSITION_ODD_LAPLACE_ZETA_HURWITZ_FEATURE_ANGLE_REDUCTION_THEOREM.md` | `aaa5b189075b308f3d0ea0c0908ad36d4d871f4ce6626ff74ed9c730a09a0723` |
| `tests/test_growing_transition_odd_laplace_zeta_hurwitz_feature_angle_reduction_theorem.py` | `1bf0cec43d31d1d0f48899be0615faab108b99e86ef446894a8cdec807329a74` |
| `notes/GROWING_TRANSITION_CONTINUOUS_ODD_LAPLACE_COMMON_REPRESENTATIVE_BARRIER.md` | `7e65dd6a5cf9035054f01bf52126e25e00635c0414f1a0dc69e70fc2e6ba6a74` |
| `tests/test_growing_transition_continuous_odd_laplace_common_representative_barrier.py` | `d3369b104aa2ebdfa685c2ae5d1529c55b1702d442b6dd81d5569294f42f1140` |
| `notes/GROWING_TRANSITION_HIGHER_SAMPLER_AFFINE_CARLEMAN_SCALAR_GATE_THEOREM.md` | `fd28ae155cb49e2d2700fec368e3bf4525452bdbf0ad80f4a37d2b09c593c249` |
| `tests/test_growing_transition_higher_sampler_affine_carleman_scalar_gate_theorem.py` | `993be1bf3eefad69c0f1991bbf38fc406abc6427cc61235e1b186ddd4e9dcb0e` |
| `notes/GROWING_TRANSITION_ETA_NULL_RENORMALIZED_SOURCE_KREIN_INTERTWINER_THEOREM.md` | `0c7c20639645d912d0e896bf064f83e3bd26078d716a183fa703d1586673d0d5` |
| `tests/test_growing_transition_eta_null_renormalized_source_krein_intertwiner_theorem.py` | `fac207d0c4847e7f624848aa174fae013f7099382d9ba785651be634849c5505` |
| `notes/GROWING_TRANSITION_TWO_CLUSTER_MODAL_PLACEMENT_LEAKAGE_NORMALIZATION_THEOREM.md` | `7859533dd83b94708ee73658e6b6c94eb78418a333082c875f0629b244efe564` |
| `tests/test_growing_transition_two_cluster_modal_placement_leakage_normalization_theorem.py` | `caef856880cbc01e95b45209a5dc1a41d669c43a9f868552e6b7d33fd2e0cc8c` |
| `notes/TRANSITION_PROLATE_OUTER_THEOREM.md` | `215f27adc0453f601ced419bd39910cb821c31b2e77678b63874987510f4f9c6` |
| `tests/test_transition_prolate_outer.py` | `bc03f010254e0b56c800b1fc4dfb38cd7ea17a0ebc1133064f751d6eab08b433` |
| `notes/GROWING_TRANSITION_ONE_SIDED_ODD_LAPLACE_ROW_AND_FORWARD_ALIAS_THEOREM.md` | `0edbe7253f6164399d468517bc9cbb9c8d9317250ac7dcc526eca9a8e15e7d3b` |
| `tests/test_growing_transition_one_sided_odd_laplace_row_and_forward_alias_theorem.py` | `97215866f7cf3a6969a7ec92d81e722a6e376034e95d58ff1e759b3780fcc79f` |

No external source, zero table, prime estimate, deterministic outer alias,
or numerical prolate data is used.

## 2. Exact Euler representatives, domains, and boundary terms

Let

\[
 B_1(X)=\{X\}-{1\over2},\qquad X>0,                 \tag{2.1}
\]

with its right-continuous value `-1/2` at every positive integer.  Define

\[
 \begin{aligned}
 R_z(X)&=B_1(X)-zX^z\int_X^\infty
              B_1(t)t^{-z-1}\,dt,\\
 L_z(X)&=B_1(X)-(z-1)X^{1-z}\int_0^X
              B_1(t)t^{z-2}\,dt .
 \end{aligned}                                       \tag{2.2}
\]

For real `X>0` and real `z>1`, the first integral is absolutely
convergent.  For `z>1` the second is an ordinary finite integral.  The
identities needed here are, for integer `z>=3`,

\[
 \boxed{
 \sum_{1\leq m\leq X}m^{-z}
 =\zeta(z)-{X^{1-z}\over z-1}-X^{-z}R_z(X),}         \tag{2.3}
\]

and

\[
 \boxed{
 \sum_{1\leq m\leq X}m^{z-1}
 ={X^z\over z}-X^{z-1}L_z(X).}                      \tag{2.4}
\]

The sums include `m=X` when `X` is an integer.  Thus the right-continuous
choice in (2.1), rather than the midpoint Fourier value, is part of the
endpoint term in (2.3)--(2.4).  Both formulas also hold without a case
change on `0<X<1`, where the sums are empty and

\[
 R_z(X)=\zeta(z)X^z-{X\over z-1},\qquad
 L_z(X)={X\over z}.                                  \tag{2.5}
\]

Consequently no artificial boundary mass is introduced when the floor
rows below are extended through `0<u<1/lambda` by their empty sums.

For one source put

\[
 \begin{aligned}
 m_z(f)&=\int_0^\lambda f(u)u^{z-1}\,du,\\
 t_z(f)&=\int_0^\lambda f(u)u^{z-1}
       \sum_{1\leq m\leq\lambda u}m^{-z}\,du,\\
 p_z(f)&=\int_0^\lambda f(u)u^{-z}
       \sum_{1\leq m\leq\lambda u}m^{z-1}\,du .
 \end{aligned}                                       \tag{2.6}
\]

These are the frozen rows with the zero extension made explicit.  Since
the source is even, (0.2) gives

\[
 \int_0^\lambda f(u)\,du=0.                          \tag{2.7}
\]

Substitution of (2.3)--(2.4), including their displayed main terms,
therefore gives the exact cancellations

\[
 \boxed{
 \begin{aligned}
 t_z(f)&=\zeta(z)m_z(f)-\lambda^{-z}I_{R,z}(f),\\
 p_z(f)&=-\lambda^{z-1}I_{L,z}(f),
 \end{aligned}}                                      \tag{2.8}
\]

where the improper endpoint expressions are

\[
 I_{R,z}(f)=\int_0^\lambda {f(u)\over u}R_z(\lambda u)\,du,
 \qquad
 I_{L,z}(f)=\int_0^\lambda {f(u)\over u}L_z(\lambda u)\,du. \tag{2.9}
\]

They converge at zero: (2.5) makes both resolvents `O(lambda*u)`, while
`f(0)=0` and global `W^(2,1)` regularity provide the admitted trace.

## 3. Exact completed-row reduction

The frozen zeta--Hurwitz rows are

\[
 \mathcal A_z={\lambda^{1/2-z}\over2}(t_z+p_z),
 \qquad
 \mathcal B_z={\lambda^{z-1/2}\over2}
                 \{\zeta(z)m_z-t_z\}.               \tag{3.1}
\]

Define row maps on the fixed packet by

\[
 \begin{aligned}
 C_z(f)&={\lambda^{1/2-z}\zeta(z)\over2}m_z(f),\\
 \mathcal L_z(f)&={1\over2\sqrt\lambda}I_{L,z}(f),\\
 \mathcal R_z(f)&={1\over2\sqrt\lambda}I_{R,z}(f).
 \end{aligned}                                       \tag{3.2}
\]

Equations (2.8) and (3.1) give, without an asymptotic expansion,

\[
 \boxed{\mathcal B_z(f)={1\over2\sqrt\lambda}I_{R,z}(f)} \tag{3.3}
\]

and

\[
 \boxed{
 \mathcal A_z(f)
 ={\lambda^{1/2-z}\zeta(z)\over2}m_z(f)
  -{1\over2\sqrt\lambda}I_{L,z}(f)
  -\lambda^{1-2z}\mathcal B_z(f).}                  \tag{3.4}
\]

This proves (0.3)--(0.4).  In particular, positive scalar weights in the
Euler formulas do not create a Loewner sign after integration against an
oscillatory physical packet.

## 4. Fourier/Abel resolvents

The symmetric Abel Fourier representative of (2.1) is

\[
 B_1(X)=-\lim_{q\uparrow1}\sum_{r\ne0}
 {q^{|r|}\over2\pi i r}e^{2\pi i rX}.               \tag{4.1}
\]

At integers, (4.1) converges to the midpoint value zero.  Hence the
formulas in this section are almost-everywhere, Abel, or integrated
identities; they do not replace the right-continuous endpoint convention
used in (2.3)--(2.4).

For nonzero integer `r`, define

\[
 \begin{aligned}
 \ell^-_{z,r}(X)&=X^{1-z}\int_0^X
              e^{2\pi i rt}t^{z-1}\,dt,\\
 \ell^+_{z,r}(X)&=X^z\int_X^\infty
              e^{2\pi i rt}t^{-z}\,dt .
 \end{aligned}                                       \tag{4.2}
\]

Integration by parts in each Abel-regularized harmonic gives

\[
 \boxed{
 L_z(X)=-\operatorname {Abel}\sum_{r\ne0}\ell^-_{z,r}(X),
 \qquad
 R_z(X)= \operatorname {Abel}\sum_{r\ne0}\ell^+_{z,r}(X).} \tag{4.3}
\]

The exact dilation-resolvent equations are

\[
 (X\partial_X+z-1)\ell^-_{z,r}(X)=Xe^{2\pi i rX},
 \qquad
 (-X\partial_X+z)\ell^+_{z,r}(X)=Xe^{2\pi i rX}.     \tag{4.4}
\]

Their endpoint symbols are

\[
 \ell^-_{z,r}(X)\sim {Xe^{2\pi i rX}\over z-1+2\pi i rX},
 \qquad
 \ell^+_{z,r}(X)\sim {Xe^{2\pi i rX}\over z-2\pi i rX}. \tag{4.5}
\]

Equation (4.5) is a bulk symbol, not a uniform physical packet estimate.
In the middle band the `r=+/-1` pair is resonant with the same-phase
prolate packet and can be coupled or amplified by compression.  Its
feature angle cannot be read from either scalar denominator in (4.5).

## 5. Direct-profile slots after ordered Poisson

Let

\[
 H(y)=\mathcal F_a f(y)=\int_{\mathbb R}
       f(u)e^{-2\pi iuy}\,du.                        \tag{5.1}
\]

Evenness and (0.2) give `f(0)=H(0)=0`.  For each fixed positive `a`, the
admitted ordered unweighted Poisson identity is

\[
 \sum_{m\geq1}f(am)=a^{-1}\sum_{r\geq1}H(r/a).       \tag{5.2}
\]

Apply (5.2) only after taking `M to infinity` at fixed `lambda` in the
frozen order.  The complete profiles may then be written

\[
 \begin{aligned}
 a_f(s)&={\sqrt\lambda\over2}\sum_{m\geq1}
                 f(m\lambda e^{-s})
          +{\sqrt\lambda\over2}\sum_{r\geq1}
                 H(r\lambda e^{-s}),\\
 b_f(t)&={\sqrt\lambda e^t\over2}\sum_{r\geq1}
                 H(r\lambda e^t).
 \end{aligned}                                       \tag{5.3}
\]

Thus the individual ordered row slots are

\[
 \begin{aligned}
 \mathcal A_z^{f,m}
  &={\sqrt\lambda\over2}\int_0^L
       f(m\lambda e^{-s})e^{-zs}\,ds,\\
 \mathcal A_z^{H,r}
  &={\sqrt\lambda\over2}\int_0^L
       H(r\lambda e^{-s})e^{-zs}\,ds,\\
 \mathcal B_z^{H,r}
  &={\sqrt\lambda\over2}\int_0^\infty
       H(r\lambda e^t)e^{-(z-1)t}\,dt.
 \end{aligned}                                       \tag{5.4}
\]

The legal local/direct split is

\[
 \begin{aligned}
 \mathcal A_z^1&=\mathcal A_z^{f,1}+\mathcal A_z^{H,1},
 &\mathcal B_z^1&=\mathcal B_z^{H,1},\\
 \mathcal A_z^+&=\sum_{m\geq2}\mathcal A_z^{f,m}
                 +\sum_{r\geq2}\mathcal A_z^{H,r},
 &\mathcal B_z^+&=\sum_{r\geq2}\mathcal B_z^{H,r}.
 \end{aligned}                                       \tag{5.5}
\]

For a real even source, the positive index `r` in (5.2)--(5.5) already
represents the paired `r=+/-r` Fourier harmonics.  Hence the paired first
harmonic together with compact sampler `m=1` is the physical `(1,1)`
slot; `m>=2` and paired `|r|>=2` are its aliases.

At a finite Fejer cutoff the weights do not commute coefficientwise with
Poisson summation.  Therefore (5.5) is not asserted before the ordered
limit, and no odd-row sum, `M` limit, or growing-`lambda` limit may be
rearranged to manufacture it.

The deterministic outer alias `S_h` periodizes a fixed-product outer
kernel `K(N)`.  It is a different representative with a different
operator and cutoff.  Equality of an integer label does not identify
`S_h` with any slot in (5.5).  The only currently legal partial match is
the frozen direct-representative affine corner estimate for `m,l>=2`;
it excludes `m=1`, `l=1`, and the curved/hard completion.

## 6. Exact middle-band compression and the `tau_L` gate

Let

\[
 I_L=\left\{z=3,5,\ldots:
 z\leq{cK\log L\over L}\right\},
 \qquad K>{8m\over C}.                               \tag{6.1}
\]

All limits in (6.1) are taken only after the fixed-`lambda` ordered
profile has been formed.  Let `D` be the exact exterior defect matrix,
put

\[
 \widehat U=UD^{\dagger/2},                          \tag{6.2}
\]

and let `P_E` project onto the surviving local negative subspace after
the selected fixed finite row nulls.  Checkpoint 1.14 supplies

\[
 P_E\widehat Q_{\rm loc}^{I_L}P_E\preceq-\tau_LP_E,
 \qquad
 \tau_L={c^{hC+o(1)}\over L^{2m}},\qquad h={\pi\over4}, \tag{6.3}
\]

where

\[
 \widehat Q_{\rm loc}^{I_L}
 =\sum_{z\in I_L}\mathsf S(
       \widehat{\mathcal A}_z^1,\widehat{\mathcal B}_z^1).
                                                               \tag{6.4}
\]

The complete band is

\[
 \widehat Q_{\rm full}^{I_L}
 =\sum_{z\in I_L}\mathsf S(
       \widehat{\mathcal A}_z,\widehat{\mathcal B}_z)
 =\widehat Q_{\rm loc}^{I_L}+\widehat R_{\rm alias}^{I_L}, \tag{6.5}
\]

and bilinearity proves the exact three-block identity (0.5).  A
packet-scale cancellation sufficient to remove the local negative scale
would require

\[
 P_E\widehat R_{\rm alias}^{I_L}P_E
 \succeq-P_E\widehat Q_{\rm loc}^{I_L}P_E-o(\tau_L)P_E. \tag{6.6}
\]

Conversely, persistence of the local negative block follows from the
strictly stronger norm estimate

\[
 \left\|P_E\widehat R_{\rm alias}^{I_L}P_E\right\|
 =o(\tau_L).                                         \tag{6.7}
\]

In raw, unwhitened local normalization the corresponding comparison scale
is `e^(h*C*L)/L^(2m-1)`; exact `D`-white coordinates contribute the extra
inverse power of `L` in (6.3).  Neither (6.6) nor (6.7) is proved here.

## 7. Controlled blocks and first uncontrolled block

The following inputs are already controlled at the needed logical level.

1.  The local `(1,1)` middle band reaches below the smallest singular
    scale in (6.3), and a fixed number of row nulls leaves the stated
    dimension reserve.
2.  The endpoint trace cancellation is exact only under the stronger
    joint nulls `eta=Gamma_out=0`; `eta=0` alone does not delete any
    ordinary odd row.
3.  In the same direct representative, the complete physical affine
    corner with `m,l>=2` is `O(1)` in `D` coordinates, hence
    `o(tau_L)`.  This controls only that affine subpiece.

The next claim is imported only from the strict-PASS standalone one-sided
row theorem whose note and test hashes are pinned in Section 1.  Its exact
scope is either

* the fixed-linear narrow region `A_1,C>0`, `0<epsilon<2h`, and
  `h*C+(5h+3epsilon/2)A_1<1`; or
* the polylogarithmic base `B_L=(log L)^4`, `0<h*C<1`, and `b_*>0`.

The offsets and packet dimension are fixed, the realized modal parameters
have their frozen `O(L^(-1))` errors, and every selected PSWF label obeys
`n_gamma=0 mod 4`.  The theorem works in exact exterior-defect-white
coordinates after the ordered unweighted Poisson limit at fixed `lambda`.
It includes the invisible-origin correction only in the slots occurring
in the forward block.  It asserts no estimate uniform in a finite Fejer
cutoff.

Within exactly that scope, uniformly for `z in I_L`, the standalone theorem
proves

\[
 \left|\widehat{\mathcal A}^{1}_{z,\alpha_i}\right|
 \leq {C L^{K_1}e^{h\alpha_i}\over\sqrt{cJ_{\alpha_i}}},
 \qquad
 \left|\widehat{\mathcal B}^{+}_{z,\beta_j}\right|
 \leq {C L\over\sqrt{J_{\beta_j}}\,z},
 \qquad J_{\alpha_i},J_{\beta_j}\asymp L.           \tag{7.1}
\]

It also proves the already summed and compressed conclusion

\[
 \left\|P_E\sum_{z\in I_L}
 \mathsf S(\widehat{\mathcal A}_z^{1,{\rm high}},
           \widehat{\mathcal B}_z^{+,{\rm low}})P_E
 \right\|
 \leq {L^{K_2}e^{h\alpha_{\max}}\over\sqrt c}
 =o(\tau_L).                                         \tag{7.2}
\]

The theorem proves the strict conductor gap separately: its fixed-linear
ratio is `c^(-1/2+h*A_1+o(1))`, while its polylogarithmic ratio is
`c^(-1/2+o(1))`.  Equation (7.2) is therefore a dependency-backed
magnitude estimate, not a sign assertion and not an inference from the
two-sided local Cauchy product.

The first uncontrolled mixed summand is instead (0.6a): higher-sampler
inward high mode against local outward low mode.  The standalone theorem
explicitly makes no claim for that reverse block, the inward
higher-Fourier bump tower, or the complete curved/hard `(+,+)` block.
Those blocks remain open, as does uniform propagation of the endpoint
trace cancellation over times of order `L/c`.  A scalar Bernoulli bound or
a norm bound on separate rows does not control these remaining cross
phases.

## 8. Exact abstract countermodel and its scope

The absence of a sign in the completed algebra can be seen in one
dimension.  Let `E=C`, let `tau>0`, and put

\[
 a=\sqrt{\tau/2},\qquad
 \mathcal A^1=a,qquad \mathcal B^1=-a.              \tag{8.1}
\]

Then `mathsf S(A^1,B^1)=-tau`.  Two alias twins have identical separate
row norms:

\[
 \begin{array}{c|cc|c}
 &\mathcal A^+&\mathcal B^+
 &\mathsf S(\mathcal A^1+\mathcal A^+,
             \mathcal B^1+\mathcal B^+)\\ \hline
 \text{cancelling twin}&-a& a&0\\
 \text{reinforcing twin}& a&-a&-4\tau
 \end{array}                                         \tag{8.2}
\]

Thus exact cross algebra plus separate alias magnitudes cannot determine
the sign.  This is an abstract finite-dimensional countermodel only.  It
does not obey the common-source Poisson relation, PSWF modal placement,
endpoint traces, or the ordered profile constraints in Section 5.
Accordingly it is not a physical counterpacket and does not decide the
sign of (0.5).

## 9. Sharp remaining conclusion

Euler summation has reduced the completed odd row to two explicit
periodic-Bernoulli dilation resolvents, and ordered Poisson summation has
located their first and higher harmonic content in the physical direct
slots.  The reduction is exact and finite-packet.  The decisive missing
input is a physical feature-angle estimate for the reverse mixed
edge--alias compression (0.6a), followed by its curved/hard companions.

Until one of those estimates, a signed leading asymptotic, or a physical
source satisfying the opposite sign is supplied, cancellation,
reinforcement, and sign-indefiniteness at the abstract algebraic level
remain distinct statements.  Only the last is proved here.
