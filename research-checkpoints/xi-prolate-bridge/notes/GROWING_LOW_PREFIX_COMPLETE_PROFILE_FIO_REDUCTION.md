# Growing low-prefix complete-profile FIO reduction

## 0. Result and exact boundary

Use the locked schedule

\[
 A=\lambda^2,\qquad c=2\pi A,\qquad
 L=\log A=2\log\lambda,\qquad Q\leq C_0L,             \tag{0.1}
\]

and only the low labels

\[
 {\cal T}_Q=\{4,8,\ldots,4Q\}.                       \tag{0.2}
\]

All operators below are formed after the endpoint shear and whitened in
the exact full exterior metric.  They do not act on the old transition
inventory of size comparable with `lambda^2`.

This note proves two operator reductions.

First, the raw one-tail translation correlation on the endpoint-null rest
obeys

\[
 \boxed{
 \sum_{q\geq2}{\Lambda(q)\over\sqrt q}
 \|U^*V_qU\|\leq C\sqrt Q=o(L).}                     \tag{0.3}
\]

This follows directly from the one-tail isometry and the moving-prefix
divided-difference tail estimate.  It needs neither an entrywise modal sum
nor a fixed-pair Jost constant.  It is not the complete same-side prime
fold.  If (U) is the exterior isometry, the physical tail is
`Phi=(2*sqrt(2))^(-1)U` and the complete profile is
`B=sum_m R_m Phi=(2*sqrt(2))^(-1)sum_m R_mU`.  At prime shift
`V_qR_l=sqrt(q)R_(ql)`.  Equality removes only `m=ql`; all remaining
double sampler correlations still require the same uniform Jost/Cotlar
assembly as the unequal-dilation Archimedean block.

Second, the wide reflected leading Jost phase has exactly two stationary
geometries.  The symmetric branch is a Hankel Fourier frame and the
reciprocal branch is a Toeplitz Fourier frame.  The pinned PNT controls the
atomic prime measure at the only resolution seen by (Q) Fourier modes.
For the stationary principal operator this gives

\[
 \boxed{
 \|K_{{\rm refl,principal},Q}\|
 \leq C\sqrt Q\log^2(Q+2)=o(L).}                     \tag{0.4}
\]

The reciprocal part alone costs `O(log^2(Q+2))`.  The square-root loss in
(0.4) comes from the symmetric quartic-caustic and zero-angle densities;
it is still below the quarter-floor scale when `Q=O(L)`.

Equation (0.4) is a theorem about the stationary principal representation,
not yet about the exact complete profile.  Exact global radicality supplies
the preferable outer-only identity `Q_X=W_Z(O,O)`.  In that representation
the equality-conductor form already contains the entire common-sampler
Archimedean channel and every prime pair `m=ql`, including its cross-label
Toeplitz/Plemelj-scale part.  After exact equality removal, the remaining
outer profile is the genuinely non-equality same-side/reflected regular
FIO object.

Section 9 names its cutoff-uniform signed estimate `OO-NEQ`.  The pinned
direct-source theorem supplies an equivalent ordered representation
without an `R,C_R,C_L,B` mask partition; midpoint half-rows belong only to
an optional repartition and must not be added to its direct formula.  A
finite-cutoff proof through that direct-source representation would have to
carry the Carleman/Weber principal and full-source congruence until their
ordered-limit cancellation with equality, so `DS-SC` is recorded only as
an equivalent harder route, not as the primary missing gate.

Assuming `OO-NEQ`, the equality Garding floor and the already closed pole,
origin, and compact-projection pieces give the conditional low-prefix
floor in Section 10.  The exact quartic and hard cores remain in the
outer-only regular remainder because their growing-label Jost symbols are
not a pinned input.  This is not a full
transition theorem, physical high-complement theorem, determinant or zero
theorem, or Riemann-hypothesis proof.  The formal state remains
`P0_INVALIDATED`, and the standard eight are unchanged.

## 1. Frozen inputs

The following repository bytes fix the conventions used here.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_LOW_PREFIX_ENDPOINT_NULL_WEIGHTED_TAIL_FRAME_THEOREM.md` | `173127618d340b2ad8feb127baba0c36502b41b791b51fc136ae4a1a5e5d2dcc` |
| `tests/test_growing_low_prefix_endpoint_null_weighted_tail_frame_theorem.py` | `5d66eb7efcadd80b39303ae41633c7df2f1fc88621f58ad26fb11e4ade47290b` |
| `notes/MOVING_LABEL_CARRIER_COFRAME_DEFECT_RIGHT_INVERSE_THEOREM.md` | `caaa4df57d43f74ef56fed6df907da6db0daa7b0f89da23cce30bc2ac9369acd` |
| `tests/test_moving_label_carrier_coframe_defect_right_inverse_theorem.py` | `31f8ffad0dc5a1f2b6a00a47b55238d64d9bc6550813d5b77b15c00da1757913` |
| `notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md` | `6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9` |
| `tests/test_growing_transition_complete_central_form_reduction.py` | `a842fdd24e095cde5af373060f9017e03bb13df1db5ecf6f6374c4fbcf6743de` |
| `notes/GROWING_TRANSITION_DIRECT_SOURCE_UPPER_FORM_THEOREM.md` | `2e4ceb69d8f79c471d1d294d64d39fcf25b735149919d5d6bfe798035f5eeb97` |
| `tests/test_growing_transition_direct_source_upper_form_theorem.py` | `96894ee5618903f4644b472784366507e596fae6407bb070a31cfc2af43cdcc2` |
| `notes/GROWING_TRANSITION_EQUALITY_CONDUCTOR_GARDING_THEOREM.md` | `f746d5e8e9efdcd585ace947789597954d9a8f7b57319f4398612bf3986b0079` |
| `tests/test_growing_transition_equality_conductor_garding_theorem.py` | `61713e1f3007042eecfea5be0f1178b02311e5b9d4387af8c0123be293fc73ba` |
| `notes/FIXED_4_12_COMPLETE_NONARCHIMEDEAN_CROSS_THEOREM.md` | `efde844cb3aa14a97277d3a7f62af4bf51f02578e4c2a06f1dc4354934713dca` |
| `tests/test_fixed_4_12_complete_nonarchimedean_cross_theorem.py` | `12a8624458a1da4cdc361e71b36356acfe0097284cb9ddb8c3bd4e15a238bca1` |
| `P3_SOURCE_LOCK.json` | `42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3` |

## 2. Hermitian convention and the exact profile boundary

Let (U) be the exact one-tail exterior isometry on the endpoint-null
rest.  Thus

\[
 \|Uf\|_2^2=D^\#(f).                                  \tag{2.1}
\]

For complex source coefficients the reflected quadratic form is polarized
with

\[
 C_f(y)=\int_0^y\overline{g_f(s)}g_f(y-s)\,ds.        \tag{2.2}
\]

The two ordered real orientations give the Hermitian realification of
(2.2).  In particular,

\[
 \int_0^\infty C_f(y)\,dy
 =\left|\int_0^\infty g_f(s)\,ds\right|^2.            \tag{2.3}
\]

This is the reason the reflected continuous main has negative cost zero.
It is not the false identity
`integral (g_f*g_f)=|integral g_f|^2` for an arbitrary complex profile.

The complete `B_2`/Volterra remainder survives endpoint nullity.  The later
direct-source theorem removes the need for a scalar both-miss mask: its
ordered source/target formula retains the whole prime integral before any
such repartition.  Consequently an expansion may use masks, endpoint rows,
or aliases internally, but it must recombine to that formula and may not
declare them standalone exact blocks.  The exact object attacked below is
always the complete physical profile after the equality subsystem has been
removed.

## 3. A raw-shift lemma, and why it is not `UJ_same`

For an integer (q\geq2), define the one-sided shift

\[
 (V_qh)(s)=h(s+\log q),\qquad s\geq0.                 \tag{3.1}
\]

Changing variables and using the tail theorem at (y=0) gives

\[
 \|V_qU\|^2
 =\|{\bf1}_{[\log q,\infty)}U\|^2
 \leq\min\{1,CQ^3q^{-3}\}.                           \tag{3.2}
\]

Hence the exact correlation operator

\[
 T_q=U^*V_qU                                           \tag{3.3}
\]

satisfies

\[
 \boxed{
 \|T_q\|\leq\min\{1,CQ^{3/2}q^{-3/2}\}.}            \tag{3.4}
\]

Weighting this raw correlation by the prime coefficient gives

\[
 \sum_{q\geq2}{\Lambda(q)\over\sqrt q}\|T_q\|
 \leq C\sum_{q\geq2}{\Lambda(q)\over\sqrt q}
       \min\{1,Q^{3/2}q^{-3/2}\}.                    \tag{3.5}
\]

The pinned PNT implies the elementary Chebyshev envelope

\[
 \psi_C(X)=\sum_{q\leq X}\Lambda(q)\leq C_\psi X.    \tag{3.6}
\]

Stieltjes partial summation consequently gives

\[
 \sum_{q\leq Q}{\Lambda(q)\over\sqrt q}\leq C\sqrt Q,
 \qquad
 \sum_{q>Q}{\Lambda(q)\over q^2}\leq {C\over Q}.     \tag{3.7}
\]

Splitting (3.5) at (q=Q) proves (0.3).  The argument is an operator
estimate before source coordinates are chosen; it never sums modal
entries.  The state-invisible origin bump has a Schwartz sampled transform
and the locked dual estimate
`|f(0)|^2<=C*L*D^#(f)/lambda`; its prime self and cross terms are `o(1)`
by the same Hilbert-space Cauchy--Schwarz argument used in the bump
transfer theorem.

The conclusion is deliberately limited.  By the exact normalization
`Phi=(2*sqrt(2))^(-1)U`, the complete one-tail physical profile is

\[
 B=\sum_{m\geq1}R_m\Phi
  ={1\over2\sqrt2}\sum_{m\geq1}R_mU,\qquad
 V_qR_l=\sqrt q\,R_{ql}.                              \tag{3.8}
\]

Hence its prime correlation contains every pair `(m,ql)`.  The equality
subsystem removes the pairs `m=ql`, not both sampler sums.  The operator
`T_q=U^*V_qU` in (3.3) is therefore only a raw subchannel and (0.3) does
not prove a complete same-side prime estimate.  The positive tail theorem
contains no sign or sampler almost-orthogonality for the remaining double
sum.  Both that prime complement and the unequal-dilation Archimedean
centered multiplier remain in the `regular-FIO` subproblem and ultimately
in `OO-NEQ`.

## 4. Uniform low-label phase

The moving-label Hermite quasimode theorem gives, uniformly for
(0\leq n\leq4Q),

\[
 \Theta_n=(2n+1)c-{2n^2+2n+3\over4}
              +O(Q^4/c).                             \tag{4.1}
\]

Therefore

\[
 \nu_n={\Theta_n\over2c}
 =n+{1\over2}+O(Q^2/c),                               \tag{4.2}
\]

and, for (t=4j,u=4k),

\[
 \nu_t-\nu_u=4(j-k)+O(Q^2/c),\qquad
 \nu_t+\nu_u=4(j+k)+1+O(Q^2/c).                      \tag{4.3}
\]

Since (Q=O(L)), every error in (4.3) is smaller than any inverse power
of (L).  This supplies the missing uniform label phase; the earlier crude
moving-label min--max diameter did not.

On the Jost range write

\[
 x_m(s)=\sqrt{m^2e^{2s}-1},\qquad
 \beta(x)=\arctan(1/x),                               \tag{4.4}
\]

\[
 \Phi_{t,m}(s)=cx_m(s)+\nu_t\beta(x_m(s)).            \tag{4.5}
\]

The leading complete-profile amplitude is

\[
 a_m(s)={\{1+x_m(s)^2\}^{1/4}
             \over\sqrt{2\pi}\,m\sqrt{x_m(s)}}.     \tag{4.6}
\]

Volterra and exact hard-edge corrections are not deleted; they belong to
the `regular-FIO` remainder until a uniform reduction is proved and remain
inside `OO-NEQ` throughout.

### 4.1 Exact same-side equality removal

For the complete physical profile in (3.8),

\[
 B(s+\log q)=\sqrt q\sum_{l\geq1}R_{ql}\Phi(s)
 ={\sqrt q\over2\sqrt2}
       \sum_{l\geq1}R_{ql}U(s).                       \tag{4.7}
\]

The common-sampler pairs are exactly (m=ql).  After multiplication by
the two ordered prime coefficients `-2*Lambda(q)/sqrt(q)`, their sum is,
in the two equivalent coordinate conventions,

\[
 \begin{aligned}
 -4\sum_{q,l\geq1}\Lambda(q)\|R_{ql}\Phi\|^2
 &=-{1\over2}\sum_{q,l\geq1}\Lambda(q)\|R_{ql}U\|^2\\
 &=-{1\over2}\sum_{m\geq1}\log m\,\|R_mU\|^2.
 \end{aligned}                                       \tag{4.8}
\]

Here `||R_m Phi||^2=(1/8)||R_mU||^2` and the last equality is
`sum_(q|m) Lambda(q)=log(m)`.  Thus the coefficient is `-4` in physical
`Phi` coordinates and `-1/2` in isometric (U) coordinates, precisely the
prime divisor row in the equality-conductor form.  Equality removes the
full (m=ql) channel with this factor; it does not remove any (m\ne ql)
correlation.

The remaining same-side geometry is favorable.  On a unit radial shell,
for (m,l\geq2), (m\ne ql), the uniform phase (4.2) gives

\[
 |(\Phi_{t,m}-\Phi_{u,ql})'|
 \geq\kappa ce^r|m-ql|-CQ.                            \tag{4.9}
\]

For large (c) this is nonstationary.  If exactly one sampler is one,
there is only the isolated reciprocal stationary point; its curvature is
comparable with (c(ql)^3).  Hence the fixed-pair proof has suppressed
power gains which become decisive on (Q=O(L)): regular pairs gain
`c^(-1)` and the reciprocal/hard pair gains `c^(-1/2)`.

A precise sufficient sublemma is the following polynomial-symbol bound:
for some fixed (B), uniformly at finite Fejer cutoff and in the exact
white metric,

\[
 \|\chi_rb_{t,m}\|_\infty+
       {\rm Var}(\chi_rb_{t,m})
 \leq C Q^B{e^{-r/2}\over m},                         \tag{4.10}
\]

with the same finite derivative class for the complete Volterra symbols
and an `O(Q^B)` exact Bessel graph for (m=1).  The standard fractional-BV
sum over (m,l\geq2), stationary phase for the reciprocal pair, and then
Hilbert--Schmidt only across the (Q\) labels give

\[
 \|E_{{\rm same,neq},Q}\|
 \leq C Q^{B+2}L c^{-1/2}=o(L).                       \tag{4.11}
\]

The prime factor is summable because the separated correlations retain the
`q^(-3/2)` envelope, while the Archimedean centered multiplier costs at
most the displayed logarithm.  Equation (4.11) does not use modal
`ell^1`.  The existing phase theorem and hard-edge graph strongly support
(4.10), but no frozen theorem states the complete finite-Fejer
polynomial-(Q) symbol bound.  It is the same-side sublemma of
`regular-FIO`, not an unconditional conclusion of this note and not a sign
estimate for the complete direct-source compression.

## 5. Exact reflected stationary geometry

For a sampler pair ((m,l)) and a reflected separation (y\geq0), put

\[
 x_1=x_m(s),\qquad x_2=x_l(y-s),\qquad
 r=ml e^y.                                            \tag{5.1}
\]

The leading sum phase is (c(x_1+x_2)).  Since

\[
 {dx\over ds}=h(x),\qquad h(x)=x+x^{-1},              \tag{5.2}
\]

its stationary equation is (h(x_1)=h(x_2)).  There are exactly two
geometric branches.

### 5.1 Symmetric branch

Here

\[
 x_1=x_2=\sqrt{r-1},\qquad
 \beta_1=\beta_2=\beta,qquad
 r=\csc^2\beta.                                      \tag{5.3}
\]

The phase at the critical point is

\[
 2c\sqrt{r-1}+(\nu_t+\nu_u)\beta.                    \tag{5.4}
\]

By (4.3), its label kernel is, up to a uniform `o(1)` symbol,

\[
 e^{i(4(j+k)+1)\beta};                                \tag{5.5}
\]

this is Hankel in (j+k).

### 5.2 Reciprocal branch

Here

\[
 x_1x_2=1,\qquad
 x_1+x_1^{-1}=r={2\over\sin2\beta},\qquad
 \beta_2={\pi\over2}-\beta_1.                        \tag{5.6}
\]

The phase at the critical point is

\[
 cr+\nu_u{\pi\over2}+(\nu_t-\nu_u)\beta.            \tag{5.7}
\]

At a prime atom (y=\log(n/A)),

\[
 cr=cml{n\over A}=2\pi mln,                           \tag{5.8}
\]

so the geometric carrier is exactly one.  Also

\[
 e^{i\nu_u\pi/2}=e^{i\pi/4}\{1+o(1)\}.              \tag{5.9}
\]

The label kernel is therefore (e^{i4(j-k)\beta}), a Toeplitz kernel.

The leading second derivatives are

\[
 \phi''_{\rm sym}=2c(x-x^{-3}),\qquad
 \phi''_{\rm rec}=-c(x+x^{-1})(x-x^{-1})^2.          \tag{5.10}
\]

Both vanish only at (x=1).  In the sample domain this gives the interior
quartic point ((m,l,y)=(1,1,\log2)) and the boundary points
((1,2,0),(2,1,0)).  The hard point ((1,1,0)) is also kept in the exact
Bessel core.  On the complement of `O(c^(-1/2))` neighborhoods, the label
perturbation moves a stationary point by at most `O(Q*c^(-1/2))` and
changes its critical value by `O(Q^2*c^(-1/2))=o(1)` at the worst edge of
the wide region.

## 6. Stationary amplitudes and pushed densities

At either critical point, (4.6) gives

\[
 a_m(s)a_l(y-s)
 ={r^{1/2}\over2\pi ml\sqrt{x_1x_2}}.                \tag{6.1}
\]

Stationary phase and (5.10) therefore have the following absolute
principal amplitudes, with harmless universal constants suppressed:

\[
 A_{m,l}^{\rm sym}(r)
 =c^{-1/2}{(r-1)^{1/4}\over ml\sqrt{|r-2|}},          \tag{6.2}
\]

\[
 A_{m,l}^{\rm rec}(r)
 =c^{-1/2}{1\over ml\sqrt{r^2-4}}.                   \tag{6.3}
\]

The physical prefactor (2\lambda) cancels `c^(-1/2)` up to an absolute
constant.  These are sample amplitudes, not modal-entry estimates.

For the symmetric change of variables (r=\csc^2\beta),

\[
 \left|{dy\over d\beta}\right|=2\cot\beta.           \tag{6.4}
\]

Thus a single sample-pair continuous pushforward is bounded by

\[
 {C\over ml}
 {\cos^{3/2}\beta\over
  \sin^{1/2}\beta\sqrt{|\cos2\beta|}}\,d\beta.       \tag{6.5}
\]

For the reciprocal change of variables in (5.6),

\[
 \left|{dy\over d\beta}\right|=2|\cot2\beta|,
 \qquad \sqrt{r^2-4}=2|\cot2\beta|,                 \tag{6.6}
\]

so the caustic singularity cancels exactly and a single pushed density is
at most

\[
 {C\over ml}\,d\beta.                                \tag{6.7}
\]

For fixed `beta`, the support condition (y\geq0) permits only
(ml\leq r(\beta)).  The divisor estimate

\[
 \sum_{ml\leq X}{1\over ml}\leq C\log^2(eX)          \tag{6.8}
\]

then gives the total continuous model densities

\[
 w_{\rm rec}(\beta)
 \leq C\log^2{e\over d(\beta)},                      \tag{6.9}
\]

\[
 w_{\rm sym}(\beta)
 \leq C\log^2{e\over\beta}
 \left(1+\beta^{-1/2}
       +|\beta-\pi/4|^{-1/2}\right),                 \tag{6.10}
\]

where (d(\beta)=\min(\beta,\pi/2-\beta)), and the finitely many
caustic sample pairs are understood with fixed core neighborhoods removed
from these principal model measures.  Returning the exact cores to the
complete regular remainder, and hence to `OO-NEQ`, is not a consequence of
the model-density estimate.
Consequently every interval (I) of length (h\leq1/4) obeys

\[
 \int_Iw_{\rm rec}\leq Ch\log^2(e/h),                \tag{6.11}
\]

\[
 \int_Iw_{\rm sym}\leq C\sqrt h\log^2(e/h).         \tag{6.12}
\]

## 7. Atomic primes at Fourier resolution

Define the logarithmic prime measure

\[
 \mu_A=\sum_{n>A}{\Lambda(n)\over n}
              \delta_{\log(n/A)}.                    \tag{7.1}
\]

The pinned FKS estimate is

\[
 |\psi_C(X)-X|
 \leq9.22022X(\log X)^{3/2}
             e^{-0.8476836\sqrt{\log X}},\qquad X>2. \tag{7.2}
\]

Put

\[
 \epsilon_A=10L^{3/2}e^{-0.8476836\sqrt L}.           \tag{7.3}
\]

For all sufficiently large (A), differencing (7.2) gives, uniformly for
(u\geq0) and (0<h\leq1),

\[
 \mu_A([u,u+h])\leq C(h+\epsilon_A).                 \tag{7.4}
\]

In particular (7.4) is (O(h)) whenever (h\geq\epsilon_A).  Near
either fixed caustic (u_0\in\{0,\log2\}), lattice counting and
`Lambda(n)<=log(n)` give on shorter intervals

\[
 \mu_A([u_0-h,u_0+h])\leq CL(h+A^{-1}).               \tag{7.5}
\]

Dyadically combine (7.4) above (epsilon_A) with (7.5) below it.  Outside
the core radius (c^{-1/2}), this proves

\[
 \int_{0<|u-u_0|\leq h}|u-u_0|^{-1/2}\,d\mu_A(u)
 \leq C\sqrt h+\rho_A,                                \tag{7.6}
\]

where

\[
 \rho_A=CL\sqrt{\epsilon_A}+CLA^{-3/4}
       =o(L^{-N})\quad\hbox{for every fixed }N.       \tag{7.7}
\]

No short-interval PNT is used.  The modes resolve only intervals of length
(1/Q\), while (epsilon_A=o(Q^{-N})).  Applying (7.4)--(7.7) through
the two changes of variables in Section 6 yields total-variation measures
(\sigma_{A,\rm rec}) and (\sigma_{A,\rm sym}) for the prime stationary
models such that, for (h=1/Q),

\[
 \sup_{|I|=h}|\sigma_{A,\rm rec}|(I)
 \leq Ch\log^2(e/h),                                  \tag{7.8}
\]

\[
 \sup_{|I|=h}|\sigma_{A,\rm sym}|(I)
 \leq C\sqrt h\log^2(e/h).                           \tag{7.9}
\]

At the reciprocal caustic, a beta interval of length (h) corresponds to
a (y)-interval of length comparable with (h^2); equation (7.6) then
costs (O(h)), exactly as (7.8) requires.  At the symmetric caustic the
Jacobian is nonzero, so (7.6) costs (O(\sqrt h)).  This distinction is
why the reciprocal branch is bounded but the symmetric branch has the
harmless square-root loss.

## 8. Fourier-frame lemma and principal RF bound

Let (sigma) be a finite positive measure on the beta interval, and let
(P(\beta)=\sum_{j=1}^Qz_je^{i4j\beta}).  A localized de la Vallee Poussin
reproducing kernel gives the finite-resolution Carleson embedding

\[
 \boxed{
 \int|P(\beta)|^2\,d\sigma(\beta)
 \leq CQ\sup_{|I|=1/Q}\sigma(I)\sum_{j=1}^Q|z_j|^2.} \tag{8.1}
\]

Indeed, convolve (P) with a reproducing kernel bounded by
`C_N*Q*(1+Q*distance)^(-N)`, use Cauchy--Schwarz, partition into
`1/Q` intervals, and sum the resulting geometric tails.  The same proof
applies to total variation and to the negative-frequency polynomial.

The reciprocal matrix factors between two such Fourier analysis maps:

\[
 (K_{\rm rec})_{jk}
 =\int e^{i4(j-k)\beta}\,d\sigma_{A,\rm rec}(\beta)
 \quad\hbox{up to Hermitian pairing}.                 \tag{8.2}
\]

Equations (7.8) and (8.1) give

\[
 \|K_{\rm rec}\|\leq C\log^2(Q+2).                  \tag{8.3}
\]

For the symmetric matrix,

\[
 (K_{\rm sym})_{jk}
 =\int e^{i4(j+k)\beta}\,d\sigma_{A,\rm sym}(\beta)
 \quad\hbox{up to the unit carrier and Hermitian pairing}.          \tag{8.4}
\]

Its quadratic form is the pairing of the positive- and negative-frequency
analysis maps.  Cauchy--Schwarz, (7.9), and (8.1) give

\[
 \|K_{\rm sym}\|\leq C\sqrt Q\log^2(Q+2).           \tag{8.5}
\]

This proves (0.4).  It is a frame/Cotlar estimate, not a Schur sum over
label entries.  The exact reciprocal carrier (5.8) is helpful but not
needed for the absolute frame estimate; the oscillatory symmetric carrier
also has modulus one.

## 9. Exact outer-only non-equality gate

For the exact global radical, the complete-central theorem gives

\[
 Q_X=\mathcal W_Z(O,O).                                \tag{9.1}
\]

Let (O_F) be its finite-Fejer outer approximation and let
(\mathcal C_Q) be the exact map from full-metric-white low-prefix
coordinates to the corrected, endpoint-sheared physical outer columns.
Finite-cutoff radicality is not assumed.  Form the complete
pole--Archimedean--prime distribution first, take its ordered limit, and
only then remove equality:

\[
 \widehat E_{\rm oo,neq,Q}^\#
 =\underset{F\to\infty}{\operatorname {ord\!\!-\!lim}}
   \mathcal C_Q^*\mathcal W_Z(O_F,O_F)\mathcal C_Q
   -\widehat Q_{{\rm eq},Q}^\#.                       \tag{9.2}
\]

Equations (3.8) and (4.8) show that the equality subtraction contains the
entire (m=l) Archimedean channel and every prime common-sampler pair
(m=ql), with coefficient `-4` in physical (Phi) coordinates and `-1/2` in
isometric (U) coordinates.  This includes the common-sampler cross-label
Toeplitz/Plemelj-scale part.  Thus no separate compressed singular-principal
sign remains after exact equality removal in the outer-only representation.

**Hypothesis `OO-NEQ` (outer-only complete non-equality estimate).**
Uniformly for (Q\leq C_0L), the ordered limit in (9.2) exists in the exact
sheared full metric and

\[
 \boxed{\|(\widehat E_{\rm oo,neq,Q}^\#)_-\|=o(L).}   \tag{9.3}
\]

Equivalently, it is enough to prove
`E_oo,neq,Q^# >= -epsilon_L*L*I` with `epsilon_L->0`; a positive floor is
stronger.  A concrete `regular-FIO` route to (9.3) is the cutoff-uniform
exact decomposition

\[
 \widehat E_{\rm oo,neq,Q}^\#
 =K_{\rm rec,Q}+K_{\rm sym,Q}+P_{\rm cont,Q}
  +E_{\rm log,Q}+R_{\rm reg,Q},                       \tag{9.4}
\]

with

\[
 P_{\rm cont,Q}\succeq0,\qquad
 \|E_{\rm log,Q}\|=o(1),\qquad
 \|(R_{\rm reg,Q})_-\|=o(L).                         \tag{9.5}
\]

A sufficient serialization of its last assertion is the polynomial symbol
estimate (4.10) and fixed (B,\eta>0) such that

\[
 \|R_{\rm reg,Q}\|\leq C Q^B c^{-\eta}.              \tag{9.6}
\]

The exact quartic and hard cores stay inside (R_{\rm reg,Q}); their expected
power-small bounds require growing-label uniform Jost symbols which no
pinned input presently supplies.  Equations (6.2)--(6.3), (7.8)--(7.9),
and (8.3)--(8.5) prove the displayed principal-model bounds, but the
uniform passage from (9.2) to (9.4), including complete unequal-sampler
same-side prime and Archimedean terms plus Volterra terms, is not pinned.

The direct-source identity

\[
 Q_F^\uparrow=-\mathcal W_Z(X_F,O_F),\qquad
 \operatorname {Herm}Q_F^\uparrow
 ={Q_F^\uparrow+(Q_F^\uparrow)^*\over2}               \tag{9.7}
\]

is an equivalent ordered-limit route.  The factor `1/2` is mandatory, and
the direct formulas already contain their ordinary prime endpoints and both
finite-length Archimedean boundaries.  A `DS-SC` estimate on that
representation would imply the same exact-limit target, but is a harder
proof route because it must carry the Carleman/Weber principal and
full-source congruence until equality cancellation.  It is not the sole
missing gate, and midpoint or extra endpoint rows must not be added.

## 10. Conditional low-prefix assembly

Assume `OO-NEQ`.  By (9.3),

\[
 \|(\widehat E_{\rm oo,neq,Q}^\#)_-\|=o(L).           \tag{10.1}
\]

The frame estimate (0.4) is one proved component of the `regular-FIO`
route; it is not subtracted again from the complete outer-only complement.

The equality Garding theorem gives

\[
 \widehat Q_{{\rm eq},Q}^\#
 \succeq\left({L\over4}-{1\over4}\log L-C\right)I.  \tag{10.2}
\]

Therefore the complete-central projection comparison yields, for all
sufficiently large locked stages,

\[
 \boxed{
 \widehat\Sigma_{N,Q}^\#\succeq {L\over8}I,
 \qquad Q\leq C_0L.}                                 \tag{10.3}
\]

The conclusion is conditional only on the named low-prefix `OO-NEQ`
operator theorem.  The unresolved `regular-FIO` passage is its principal
analytic proof route.  The conclusion is
not promoted to (Q\asymp\lambda^2), to a source
quotient not already licensed by the complete-central reduction, or to any
Riemann-hypothesis conclusion.
