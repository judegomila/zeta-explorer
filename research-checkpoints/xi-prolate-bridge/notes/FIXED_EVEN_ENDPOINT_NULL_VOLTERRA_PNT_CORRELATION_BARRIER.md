# Fixed-even endpoint-null Volterra and PNT-correlation barrier

## 0. Exact outcome and claim boundary

Fix an integer `m>=3` and the finite prefix of inversion-even labels

\[
 8,12,\ldots,4m
\]

on the locked schedule

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},\qquad
 c=2\pi\lambda^2,\qquad L=2\log\lambda,\qquad
 N=2^{2400p^2}.                                          \tag{0.1}
\]

Every limit below is `p->infinity` through odd integers, equivalently
`lambda->infinity` along (0.1), with `m` and all displayed labels fixed.
Nothing in this note is uniform in growing `m`.

This note proves four endpoint facts and one fail-closed reduction.

1. After whitening by the fixed-label exterior defects, every leading
   physical sawtooth tail has the same asymptotic profile.  Its two-tail
   real-line Gram on every fixed prefix is

   \[
   {\pi\over12}{\bf1}{\bf1}^*+o(1).                     \tag{0.2}
   \]

   Thus the leading endpoint model is rank one, including on the
   label-`8/12` block.

2. The complete additive-frequency Volterra remainder after that leading
   model is **not** `o(sqrt(D))`.  For a fixed unbumped prolate column the
   positive leakage energy is exactly `D/2`, whereas the leading sine model
   has energy asymptotic to `D/pi`.  The globally corrected column changes
   the first value only by `o(D)`.  Reverse triangle gives a strictly
   positive relative remainder.

3. In the exact defect-whitened `8/12` endpoint-null direction, the first
   post-sawtooth sampled endpoint term is

   \[
   \kappa_\lambda e^{-3s/2}B_2(\lambda^2e^s),\qquad
   \kappa_\lambda\longrightarrow-2\pi^{3/2},             \tag{0.3}
   \]

   where `B_2(x)={x}^2-{x}+1/6`.  Its isolated two-tail
   `L2` norm squared tends to

   \[
   \boxed{{2\pi^3\over135}}.                              \tag{0.4}
   \]

   The corresponding additive second endpoint model has positive leakage
   energy `8/(3*pi)`, while the unbumped endpoint-null prolate combination
   has exact energy `1/2`; the corrected source has `1/2+o(1)`.  Hence
   subtracting the first two endpoint terms also leaves a nonvanishing
   additive remainder.

4. The reflected `B_2--B_2` signed term is governed by one exact Bernoulli
   correlation `M_(11,A)`.  Its prefactor in the normalized endpoint-null
   direction is asymptotic to `8*pi^3*lambda`.  The admitted PNT envelope
   bounds `M_(11,A)` only by

   \[
   O\!\left(\lambda^2L^2e^{-\alpha\sqrt L}\right),        \tag{0.5}
   \]

   so after the mandatory prefactor the bound grows like
   `lambda^3 exp(-alpha sqrt(2 log lambda))` up to logarithms.  It gives
   neither the required `O(1/lambda)` scalar cancellation nor a sign.

5. These facts do **not** prove an actual absolute-tail or signed-tail
   failure.  The additive leakage and isolated endpoint pieces occur before
   the complete arithmetic divisor sum.  Complete Volterra and near-range
   terms may cancel them there, and there is no admitted lower sampling
   theorem transferring additive leakage to the paired-zero norm.
   Conversely, positive absolute sampling does not choose the paired-slot
   orientation of the signed form.

In particular, this note proves no singleton signed floor, growing-rest
floor, failure of either floor, residual action estimate, odd-sector floor,
physical high-complement comparison, low/high reduction, equation (5.2) of
`DIRECT_RH_ATTACK.md`.  It proves no determinant limit, no RH conclusion,
and no Lambda bound.
The formal project state remains `P0_INVALIDATED`.  No status, replay,
source-lock, artifact, or integration file is changed.

## 1. Frozen dependencies and conventions

The proof uses the following exact bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/FIXED_EVEN_PREFIX_ARITHMETIC_SYNTHESIS_THEOREM.md` | `1ef5e05f1a17ecf74e8337d16e799f81e02470ae71dc15d2b7f4fb96d42df0f4` |
| `notes/PROLATE_DEFECT_SOURCE_AUDIT.md` | `b8256ce059d2632d55cb1b0477b5af7f5ebb09d0fc81a7d8b8e696885b49772d` |
| `notes/OUTER_OUTER_WEIGHTED_TRANSLATION_THEOREM.md` | `34bb4e43faf04f34e11126946b1069480375d5ba18baf9c97e9746b246594a0f` |
| `notes/OUTER_OUTER_ENDPOINT_OBSTRUCTION.md` | `b16d33c89dd1517875180a0a5b03f0c0e2b601b0e0e608090016174a464e1e11` |
| `notes/OUTER_OUTER_SPECTRAL_SAMPLING_REDUCTION.md` | `49568daabe36c6507f7b366c53f784f29f9b7807284c738b80f5b016600f354b` |
| `notes/OUTER_NORMALIZATION_CANCELLATION_AUDIT.md` | `6acc76ec10a802197b873741293b56e9832e777cd41de4660e3d9b1d065a9af3` |
| `notes/NEAR_SIGNED_HANKEL_REDUCTION.md` | `fba7078c9695951fa7160e2587ff774dc1d10730bd94dc3efdec4b851ef9408e` |
| `notes/GROWING_TRANSITION_SAMPLING_THEOREM.md` | `551e58d07510d531c8ee5cfe4c81a33ac3443f62760627196599e2bfac231e72` |
| `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md` | `76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc` |
| `notes/FIXED_EVEN_PREFIX_DIAGONAL_COVARIANCE_COLLAPSE_AND_SIGNED_TAIL_DICHOTOMY.md` | `6d8be3d8bef6002d7fa2f1581e09bf27aa0dc12b2a3805fa7cd5e92863cd70d8` |
| `P0_SOURCE_LOCK.json` | `24fd1d3b44f238521ffb157bb808bda3dafbd5883599dc5d49a8bfd5e804a251` |
| `P0_NORMALIZATION_AUDIT.md` | `37d139735c2f760b928845f1815ba3050f8cc8447eaf535de02eef77b46862df` |
| `P3_SOURCE_LOCK.json` | `42976166b046f99b111861d86ac4c85f730ceb0de56b072205735cc84bea65b3` |

All prolate modes have unit Lebesgue norm on `[-lambda,lambda]`, are zero
extended, and use the source phase positive at zero.  Their finite-Fourier
phases are positive for labels divisible by four.  Write

\[
 d_n=1-\chi_n^2,\qquad e_n=h_{n,\lambda}(\lambda).          \tag{1.1}
\]

For a fixed label `t=4j>=8`, retain the actual anchor-deflated source

\[
 f_t=h_{t,\lambda}-\alpha_t h_{4,\lambda}+b_t h_{0,\lambda},
 \qquad
 D_t=d_t+d_4|\alpha_t|^2+d_0|b_t|^2.                      \tag{1.2}
\]

Its endpoint and additive Fourier transform are

\[
 E_t=f_t(\lambda),\qquad H_t=\widehat f_t.                 \tag{1.3}
\]

The invisible origin correction has support strictly inside the source
interval.  It changes no endpoint jet.  The label-`t` correction has
amplitude `O_t(d_t)`; the bounded label-4 anchor contributes only `O_t(d_4)`,
and `d_4=o_t(d_t)`.  Since `d_t^2/(lambda*d_t)=d_t/lambda=o_t(1)`, its
additive leakage after defect whitening is `o(1)`.  It will therefore be
retained conceptually but omitted from endpoint symbols below.

## 2. Defect-whitened endpoint asymptotics

For each fixed label, the pinned Fuchs--Slepian formulas give

\[
 d_n\sim A_n\lambda^{2n+1}e^{-4\pi\lambda^2},\qquad
 A_n=4\sqrt2\,\pi{(16\pi)^n\over n!},                    \tag{2.1}
\]

and the exact endpoint normalization gives

\[
 \boxed{e_n^2\sim2\pi\lambda d_n.}                       \tag{2.2}
\]

The fixed-prefix theorem proves that `alpha_t` and `b_t` are bounded and

\[
 {D_t\over d_t}\longrightarrow1.                          \tag{2.3}
\]

For `t>=8`, equations (2.1)--(2.2) imply

\[
 {e_4\over e_t}=O_t(\lambda^{4-t}),\qquad
 {e_0\over e_t}=O_t(\lambda^{-t}).                        \tag{2.4}
\]

All labels under consideration are divisible by four, so their endpoint
phases agree.  Equations (1.2), (2.3), and (2.4) now give

\[
 E_t=e_t(1+o(1)),\qquad
 \boxed{{E_t^2\over D_t}\sim2\pi\lambda.}                \tag{2.5}
\]

Thus every fixed even column has the same defect-whitened endpoint to
leading order.  This conclusion uses the endpoint asymptotic, not merely
the defect powers.

Let `Theta_(n,lambda)` denote the ordinary spheroidal differential
eigenvalue on `[-1,1]`.  The scaled quasimode residual in the fixed-prefix
theorem also gives the eigenvalue expansion

\[
 \Theta_{n,\lambda}
 =(2n+1)c+\mu_n+O_n(\lambda^{-2}),\qquad
 \mu_n=-{2n^2+2n+3\over4}.                               \tag{2.6}
\]

Indeed the scaled differential eigenvalue differs from the displayed trial
eigenvalue by `O_n(lambda^(-4))`; multiplication by `lambda^2` gives (2.6).
At labels 8 and 12,

\[
 \mu_8=-{147\over4},\qquad \mu_{12}=-{315\over4},
\]

and hence

\[
 \boxed{
 \Theta_{12,\lambda}-\Theta_{8,\lambda}
 =8c-42+O(\lambda^{-2}).}                                \tag{2.7}
\]

## 3. Universal leading sawtooth and rank one

Put

\[
 P(x)={1\over2}-\{x\},\qquad A=\lambda^2.                 \tag{3.1}
\]

The exact harmonic sine series in the physical outer theorem gives, on one
right logarithmic tail,

\[
 B_{0,t}(s)={E_t\over2\sqrt\lambda}
             e^{-s/2}P(Ae^s),\qquad s\geq0.              \tag{3.2}
\]

The left tail is its inversion reflection.  For a bounded, one-periodic
function `F` with mean `m_F`, integration by parts against a bounded
primitive of `F-m_F` gives, for every fixed `a>0`,

\[
 \int_0^\infty e^{-as}F(Ae^s)\,ds
 ={m_F\over a}+O_a(A^{-1}).                               \tag{3.3}
\]

The same proof makes the error `O(A^(-1))` uniformly for `0<a<=1` after
the main term `m_F/a` is retained.  Since

\[
 \int_0^1P(x)^2\,dx={1\over12},                           \tag{3.4}
\]

equations (2.5) and (3.2)--(3.4) prove, for any fixed labels `s,t`,

\[
 2\int_0^\infty
 {B_{0,s}(u)B_{0,t}(u)\over\sqrt{D_sD_t}}\,du
 \longrightarrow {\pi\over12}.                          \tag{3.5}
\]

The factor two is exactly the pair of reflected physical tails.  Therefore
the complete leading-sawtooth Gram on every fixed prefix is

\[
 \boxed{G_{0,m}\longrightarrow{\pi\over12}
        {\bf1}{\bf1}^*.}                                  \tag{3.6}
\]

This is a physical `L2` statement about the isolated leading endpoint
piece.  It is not the positive paired-zero Gram and is not the signed Weil
matrix.

The same calculation records why a strip-uniform norm loses a power of
`lambda`.  For every fixed `0<delta<=1/2`, on the right tail at
`y=1/2-delta`,

\[
 \int_0^\infty e^{-2\delta s}P(Ae^s)^2\,ds
 ={1\over24\delta}+O(A^{-1}),                             \tag{3.7}
\]

so the defect-normalized leading weighted norm is asymptotic to

\[
 {\pi\over48\delta}\lambda^{1-2\delta}.                  \tag{3.8}
\]

This does not lower-bound the actual zero samples, but it shows that the
power in the admitted strip-norm route is not removed by a better estimate
of the fixed-label coefficient.

## 4. The additive Volterra remainder is not small

The prolate concentration identity diagonalizes the exterior additive
leakage.  For the source (1.2), evenness gives the exact identity

\[
 \boxed{
 \int_\lambda^\infty|H_t(u)|^2\,du={D_t\over2}.}           \tag{4.1}
\]

This equality is exact for the unbumped prolate combination (1.2).  The
globally radical corrected source changes its positive leakage by `o(D_t)`
by Section 1, leaving every limit and reverse-triangle conclusion below
unchanged.

The leading Fourier endpoint model is

\[
 L_t(u)={E_t\over\pi u}\sin(2\pi\lambda u).              \tag{4.2}
\]

Riemann--Lebesgue after `u=lambda*v` gives

\[
 \int_\lambda^\infty{\sin^2(2\pi\lambda u)\over u^2}\,du
 ={1+o(1)\over2\lambda}.                                 \tag{4.3}
\]

Combining (2.5), (4.2), and (4.3),

\[
 \boxed{
 {\|L_t\|_{L^2(\lambda,\infty)}^2\over D_t}
 \longrightarrow {1\over\pi}.}                          \tag{4.4}
\]

Reverse triangle between (4.1) and (4.4) proves

\[
 \boxed{
 \liminf_{\lambda\to\infty}
 {\|H_t-L_t\|_{L^2(\lambda,\infty)}\over\sqrt{D_t}}
 \geq\left|{1\over\sqrt2}-{1\over\sqrt\pi}\right|>0.}
                                                               \tag{4.5}
\]

Thus the complete additive Volterra remainder after the first endpoint term
is not `o(sqrt(D_t))`.

There is an equivalent pre-sum physical statement.  The `m=1` arithmetic
channel is

\[
 B_t^{(1)}(s)={\sqrt u\over2}H_t(u),\qquad
 u=\lambda e^s.
\]

Since `ds=du/u`,

\[
 \|B_t^{(1)}\|_2^2={1\over4}
 \int_\lambda^\infty|H_t(u)|^2\,du={D_t\over8}.           \tag{4.6}
\]

Equations (4.5)--(4.6) are before the sum over `m>=1`.  They do not rule out
cancellation among the complete arithmetic samples.

## 5. The exact label-8/12 endpoint-null direction

Set

\[
 a_t={E_t\over\sqrt{D_t}},\qquad
 r_\lambda=(a_8^2+a_{12}^2)^{1/2},                         \tag{5.1}
\]

and define the Euclidean-unit defect-whitened direction

\[
 v_\lambda={1\over r_\lambda}(a_{12},-a_8).              \tag{5.2}
\]

Its endpoint is exactly zero.  The full two-column exterior metric differs
from the scalar block diagonal by `O(lambda^(-12))` after whitening, so
normalizing (5.2) in the full metric changes every limit below by `o(1)`.

The regular endpoint ODE is

\[
 h'_{n,\lambda}(\lambda)
 ={\Theta_{n,\lambda}-c^2\over2\lambda}e_n.              \tag{5.3}
\]

The lower label-4 and label-0 endpoint contributions in (1.2) are `o(1)`
after the label-8 or label-12 endpoint is factored out.  Hence, if `G_v` is
the derivative endpoint in direction (5.2), equations (2.5), (2.7), and
(5.3) give

\[
\begin{aligned}
 G_v
 &= {a_8a_{12}\over2\lambda r_\lambda}
    \left(\Theta_{8,\lambda}-\Theta_{12,\lambda}+o(c)\right),\\
 \boxed{{G_v\over\lambda^{3/2}}\longrightarrow
        -8\pi^{3/2}.}                                    \tag{5.4}
\end{aligned}
\]

Three integrations by parts and the exact harmonic cosine series produce
the first post-sawtooth sampled endpoint term

\[
 B_{1,v}(s)=\kappa_\lambda e^{-3s/2}B_2(Ae^s),\qquad
 \kappa_\lambda={G_v\over4\lambda^{3/2}},                \tag{5.5}
\]

\[
 B_2(x)=\{x\}^2-\{x\}+{1\over6},\qquad
 \boxed{\kappa_\lambda\longrightarrow-2\pi^{3/2}.}     \tag{5.6}
\]

The second Bernoulli polynomial has

\[
 \int_0^1B_2(x)^2\,dx={1\over180}.                       \tag{5.7}
\]

Applying (3.3) with `a=3` and adding the reflected tail yields

\[
\begin{aligned}
 2\|B_{1,v}\|_2^2
 &\longrightarrow
 2(4\pi^3){1\over3}{1\over180}\\
 &=\boxed{{2\pi^3\over135}}.                             \tag{5.8}
\end{aligned}
\]

The corresponding additive endpoint model is

\[
 H_{1,v}(u)={G_v\over2\pi^2u^2}\cos(2\pi\lambda u).
                                                               \tag{5.9}
\]

Since

\[
 \int_\lambda^\infty{\cos^2(2\pi\lambda u)\over u^4}\,du
 ={1+o(1)\over6\lambda^3},                               \tag{5.10}
\]

equation (5.4) gives

\[
 \boxed{\|H_{1,v}\|_{L^2(\lambda,\infty)}^2
        \longrightarrow {8\over3\pi}.}                   \tag{5.11}
\]

On the other hand, after replacing (5.2) by its asymptotically identical
full-metric unit normalization, equation (4.1) gives for the unbumped
prolate combination

\[
 \|H_v\|_{L^2(\lambda,\infty)}^2={1\over2}.              \tag{5.12}
\]

For the globally corrected source, the right side is `1/2+o(1)`, which is
equally sufficient below.

Consequently

\[
 \boxed{
 \liminf\|H_v-H_{1,v}\|_2
 \geq\left|\sqrt{8\over3\pi}-{1\over\sqrt2}\right|>0.}
                                                               \tag{5.13}
\]

Equations (4.5) and (5.13) prove that neither the one-term nor the two-term
endpoint truncation has an `o(sqrt(D))` additive remainder.  No admitted
theorem proves such a remainder for a higher fixed truncation, and no claim
about every possible higher truncation is made.  In particular, there is no
all-finite-`K` conclusion.

## 6. What zero sampling actually supplies

Let `R_m` denote the complete global radical-tail synthesis for a fixed
prefix, put `D_m=diag(D_8,D_12,...,D_(4m))`, and write the positive absolute
and signed paired-zero matrices as

\[
 \mathfrak A_m=(ZR_m)^*(ZR_m),\qquad
 \Sigma_m=(ZR_m)^*J(ZR_m).                               \tag{6.1}
\]

The growing-transition sampling theorem and fixed-prefix metric equivalence
give

\[
 0\preceq D_m^{-1/2}\mathfrak A_mD_m^{-1/2}
 \preceq C_m(\lambda)I,\qquad
 C_m(\lambda)=O_m(\lambda\operatorname {polylog}\lambda),
                                                               \tag{6.2}
\]

and therefore

\[
 \|D_m^{-1/2}\Sigma_mD_m^{-1/2}\|
 \leq C_m(\lambda).                                      \tag{6.3}
\]

Here \(\mathcal W_Z(R_s,R_t)=\langle ZR_s,JZR_t\rangle\) denotes the signed
paired-zero sesquilinear form; replacing `J` by the identity gives the
corresponding entry of `mathfrak A_m`.

The compact log-Fourier projection part is exponentially `o(1)` in these
normalized coordinates.  Thus the limit question reduces to the physical
outer state, but (6.2) is still only an upper bound.  In particular, for
fixed labels `s,t`,

\[
 { |\mathcal W_Z(R_s,R_t)|\over\sqrt{D_sD_t}}
 =O_{s,t}(\lambda\operatorname {polylog}\lambda).          \tag{6.4}
\]

Because `d_(t+4)/d_t` is asymptotic to a positive constant times
`lambda^8`, (6.2) does imply the one-step estimate

\[
 \mathfrak A_{tt},\ |\Sigma_{tt}|=o(d_{t+4}),              \tag{6.5}
\]

and its polarized geometric-mean analogue.  It does not give boundedness
at the own-defect normalization in (6.4).

If one could prove, in the paired-zero norm, that the complete physical
remainder after (3.2) is `o(sqrt(D))` on the `8/12` block, then (5.2) would
cancel the leading profile **pointwise**, not merely in its real-line Gram.
It would give a unit endpoint-null vector with vanishing absolute quadratic
form, a sufficient absolute-tail failure theorem.  Equations
(4.5), (5.13), and the absence of a constant-scale lower or upper transfer
through the arithmetic divisor sum show why no admitted result proves this
hypothesis.

Finally, even an absolute asymptotic would not choose the signed form:

\[
 \Sigma_m=\mathfrak A_m-2(ZR_m)^*\Pi_{\rm anti}(ZR_m).
                                                               \tag{6.6}
\]

The second term is positive but independently oriented.  Thus absolute
sampling and signed paired-slot orientation remain distinct obligations.

## 7. Exact next Bernoulli--PNT correlation

The endpoint-null direction removes the `P--P` reflected convolution.  Its
first isolated reflected endpoint term is the `B_2--B_2` correlation.  Put

\[
 g_A(t)=e^{-t}B_2(Ae^t){\bf1}_{t\geq0},\qquad
 C_{11,A}(y)=(g_A*g_A)(y),                                \tag{7.1}
\]

and retain the already-combined kernel

\[
 \delta_*(x)=1-e^{-x}\psi_C(e^x)
 -{1\over2}e^{-x}\log(1-e^{-2x}).                        \tag{7.2}
\]

Define the absolutely convergent scalar

\[
 \boxed{
 \mathcal M_{11,A}
 =\int_0^\infty\delta_*(L+y)
       \{C_{11,A}'(y)-C_{11,A}(y)\}\,dy.}                 \tag{7.3}
\]

For the locked schedule, `A` has fractional part `1/4` and

\[
 B_2(A)=-{1\over48}.                                      \tag{7.4}
\]

Since `B_2'(x)=-2P(x)` away from integers and `B_2` is continuous across
the integers,

\[
 g_A'(t)=-g_A(t)-2A P(Ae^t)                               \tag{7.5}
\]

almost everywhere.  There are no atoms at the internal integer crossings;
the zero extension at `t=0` does retain the boundary atom
`B_2(A)*delta_0`.  Differentiating the half-line convolution therefore gives
the exact identity

\[
\boxed{
\begin{aligned}
 C_{11,A}'(y)-C_{11,A}(y)
 ={}&B_2(A)g_A(y)-2C_{11,A}(y)\\
 &-2A\int_0^y e^{-t}B_2(Ae^t)P(Ae^{y-t})\,dt .
\end{aligned}}                                             \tag{7.6}
\]

The elementary bounds `|B_2|<=1/6` and `|P|<=1/2` imply

\[
 \boxed{
 |C_{11,A}'(y)-C_{11,A}(y)|
 \leq {A\over6}+{e^{-y}\over288}+{ye^{-y}\over18}.}     \tag{7.7}
\]

Let

\[
 J_\delta(L)=\int_L^\infty|\delta_*(x)|\,dx.             \tag{7.8}
\]

With the pinned PNT constants `A_P=9.22022` and `alpha=0.8476836`, the
admitted envelope gives, for `L>=log 2`,

\[
 J_\delta(L)
 \leq {2A_P\over\alpha^5}\Gamma(5,\alpha\sqrt L)
       +{2\over9}e^{-3L}.                                 \tag{7.9}
\]

Here the last term follows from
`-log(1-z)<=z/(1-z)` with `z=e^(-2x)<=1/4`.  Equations
(7.7)--(7.9) prove

\[
 \boxed{
 |\mathcal M_{11,A}|
 \leq\left({A\over6}+{1\over16}\right)J_\delta(L)
 =O\!\left(A L^2e^{-\alpha\sqrt L}\right).}             \tag{7.10}
\]

For the endpoint-null state (5.5), equation (4.3) of the endpoint
correlation reduction fixes the magnitude of the isolated reflected
coefficient multiplying (7.3):

\[
 \boxed{
 |\text{coefficient of }\mathcal M_{11,A}|
 =2\lambda\kappa_\lambda^2
 =8\pi^3\lambda+o(\lambda).}                             \tag{7.11}
\]

A bounded own-defect limit from this term would require, at minimum,

\[
 \mathcal M_{11,A}=O(\lambda^{-1}),                       \tag{7.12}
\]

with sign information for a signed floor.  Instead (7.10), with
`A=lambda^2` and `L=2log(lambda)`, gives after the prefactor only

\[
 O\!\left(
 \lambda^3(\log\lambda)^2
 e^{-\alpha\sqrt{2\log\lambda}}
 \right),                                                \tag{7.13}
\]

which grows.  It neither proves (7.12) nor selects a sign.

For comparison, the leading `P--P` reflected scalar is the exact mixed
PNT--divisor discrepancy from the spectral-sampling reduction.  Taking
absolute values in its PNT and divisor factors produces a nonintegrable
majorant.  The `B_2--B_2` scalar (7.3) is absolutely integrable, but its
available bound misses the required scale by an exponential-in-`log(lambda)`
factor.  Both cases require cancellation in the combined actual
correlation, not a stronger separate envelope.

## 8. Exact frontier

The universal endpoint rank-one model is now completely explicit, as are
the first endpoint-null correction and its far reflected PNT correlation.
They do not decide the actual paired-zero matrix.

A source proof of absolute-tail failure would have to establish an
`o(sqrt(D))` theorem for the **complete post-sum** endpoint-null outer state
in the paired-zero norm.  A source proof of a positive absolute base would
instead need a lower sampling theorem for that same complete state.  A
signed proof additionally needs the aligned/anti-aligned orientation from
(6.6), or equivalently the contraction criterion in the fixed-prefix
dichotomy.

The additive leakage identities, finite endpoint expansions, strip norms,
zero counts, and separate PNT/divisor envelopes prove none of those three
statements.  The actual fixed-even absolute and signed tail limits therefore
remain open.
