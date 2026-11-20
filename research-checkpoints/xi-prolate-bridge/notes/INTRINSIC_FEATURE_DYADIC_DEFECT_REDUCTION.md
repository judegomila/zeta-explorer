# Intrinsic feature, dyadic defect, and sharp odd-reserve reduction

## 0. Status and claim boundary

This note combines three exact reductions for the direct
Xi--prolate--Weil bridge.

1. It replaces the norm of an arbitrary source right-inverse tail by an
   intrinsic physical feature angle and identifies the minimum possible
   source tail exactly as a quotient Moore--Penrose lift.
2. It decomposes the complete exterior defect by its exact combined-symbol
   level sets and reduces it to logarithmically many spectral feature
   projectors.  The spectral coefficient is the sharp `1-sigma`, and the
   closed-endpoint converse exposes a rank obstruction.
3. It gives the sharp orientation-free odd-pole reserve, the exact
   directional-deficit identity for the moment hierarchy, and the optimal
   geometric remainder constant.

All statements are operator identities, finite-dimensional spectral
inequalities, explicit consequences of already locked estimates, or exact
rational countermodels.  No new external source is used.  In particular,
this note does **not** prove the actual physical feature angles, the actual
exterior spectral alignments, a strict shifted odd reserve on an unbounded
schedule, either signed sector floor, equation (5.2) of
`DIRECT_RH_ATTACK.md`, locally uniform determinant convergence, or the
Riemann hypothesis.  The repository state remains `P0_INVALIDATED`.

## 1. Imported locks and conventions

The conventions in this note are inherited without alteration from

- `P0_SOURCE_LOCK.json` and `P0_NORMALIZATION_AUDIT.md`;
- `LOG_FEATURE_CAPTURE_ALIGNMENT_SOURCE_LOCK.json` and
  `notes/LOG_FEATURE_CAPTURE_ALIGNMENT_REDUCTION.md`;
- `PHYSICAL_DEFECT_ADJOINT_TAIL_SOURCE_LOCK.json` and
  `notes/PHYSICAL_DEFECT_ADJOINT_TAIL_REDUCTION.md`;
- `FULL_SOURCE_COFRAME_RANK_SOURCE_LOCK.json` and
  `notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md`; and
- `LEVERAGE_TRIMMED_MEAN_FEATURE_SCHUR_SOURCE_LOCK.json` and
  `notes/LEVERAGE_TRIMMED_MEAN_FEATURE_SCHUR.md`.

Put

\[
 \ell=\log\lambda,\qquad L=2\ell,\qquad
 I_\lambda=[-L/2,L/2].                                  \tag{1.1}
\]

The physical interval carries Lebesgue measure in logarithmic coordinates.
The Fourier convention and its dual evaluation vector are

\[
 \widehat f(t)=\int_{I_\lambda}f(x)e^{-itx}\,dx,
 \qquad d\nu(t)={dt\over2\pi},
 \qquad e_t(x)=e^{itx}.                                  \tag{1.2}
\]

Inversion is reflection in the logarithmic coordinate.  The complete
arithmetic multiplier is

\[
 m_\lambda(t)=2\theta'(t)-2
 \sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
                         \cos(t\log n).                 \tag{1.3}
\]

The minus sign and the inclusive endpoint `n<=lambda^2` are mandatory.
No zero table or global Weil-positivity assumption is admitted.

The source interval is the distinct Lebesgue interval
`[-lambda,lambda]`, with zero extension.  Source functions are even and
have zero Lebesgue integral.  If `C` synthesizes the corrected finite
prolate source space `F`, then

\[
 P_F=C(C^*C)^\dagger C^*.                                 \tag{1.4}
\]

The actual source Gram may not be replaced by the identity.  The source
normalization may not be replaced by unit normalization.

Let `X` be a declared finite physical parity space and

\[
 T:\mathcal H_0^{\rm ev}\longrightarrow X                \tag{1.5}
\]

the full arithmetic/parity/projection map.  The locked full-source bounds
are

\[
 {1\over2\lambda^2M_\mu(\lambda)^2}I_X
 \preceq TT^*\preceq {\lambda^2\over2}I_X,
 \qquad M_\mu(\lambda)\leq2\lambda.                    \tag{1.6}
\]

In particular, `T` is onto.  A locked explicit right inverse satisfies

\[
 TB_X=I_X,
 \qquad \|B_X\|\leq\sqrt2\lambda M_\mu(\lambda).       \tag{1.7}
\]

## 2. The intrinsic feature angle and the right-inverse gauge

Let

\[
 K=\operatorname {ran}(TP_F),\qquad
 H=K^\perp,\qquad P_H=I-P_K,                              \tag{2.1}
\]

and let `V` be any declared physical feature space with projector `P_V`.
Define

\[
 \alpha_V=\|P_HP_V\|.                                    \tag{2.2}
\]

This is intrinsic to `T`, `F`, and `V`.  It does not depend on a choice of
full-source right inverse.

### Theorem 2.1 (exact transformed-tail identity)

For every right inverse `B` of `T`,

\[
 \boxed{
 P_HP_V=P_HT(I-P_F)BP_V.}                                \tag{2.3}
\]

Consequently,

\[
 \boxed{
 \alpha_V=\|P_HT(I-P_F)BP_V\|.}                         \tag{2.4}
\]

**Proof.**  The range of `TP_F` is `K`, so `P_HTP_F=0`.  Hence

\[
 P_HP_V=P_HTBP_V
 =P_HT\{P_F+(I-P_F)\}BP_V
 =P_HT(I-P_F)BP_V.
\]

This proves both identities.  `square`

Equation (2.4), not the untransformed source norm, is the exact physical
quantity.

### Theorem 2.2 (minimum source-tail quotient)

Define

\[
 A=P_HT|_{F^\perp}:F^\perp\longrightarrow H,
 \qquad Y=P_HP_V.                                         \tag{2.5}
\]

Then `A` is onto and

\[
 \boxed{AA^*=P_HTT^*P_H.}                                \tag{2.6}
\]

Let

\[
 \varepsilon_{\min}(F,V)
 =\inf_{TBP_V=P_V}\|(I-P_F)BP_V\|,                       \tag{2.7}
\]

where the infimum ranges over linear lifts on `V`; each such lift may be
extended to a right inverse on `X`.  Then

\[
 \boxed{
 \varepsilon_{\min}(F,V)=\|A^\dagger P_HP_V\|.}          \tag{2.8}
\]

Moreover,

\[
 \boxed{
 {\sqrt2\over\lambda}\alpha_V
 \leq\varepsilon_{\min}(F,V)
 \leq\sqrt2\lambda M_\mu(\lambda)\alpha_V
 \leq2\sqrt2\lambda^2\alpha_V.}                       \tag{2.9}
\]

**Proof.**  If `y in H`, choose `z` with `Tz=y`.  Since `P_HTP_F=0`,
`A(I-P_F)z=y`, so `A` is onto.  Also `P_FT^*P_H=0`; this gives (2.6).

Every complementary lift

\[
 E=(I-P_F)BP_V
\]

satisfies `AE=Y`.  The Moore--Penrose decomposition is

\[
 E=A^\dagger Y+N,\qquad AN=0.                            \tag{2.10}
\]

The range of `A^dagger` is orthogonal to `ker A`, so

\[
 E^*E=(A^\dagger Y)^*(A^\dagger Y)+N^*N.                \tag{2.11}
\]

Thus `A^dagger Y` minimizes the operator norm.  Conversely, after taking
this minimum complementary lift, `v-TEv` belongs to `K` and therefore has
an `F`-valued preimage.  This completes the lift and proves (2.8).

Equation (1.6) and (2.6) imply

\[
 {1\over2\lambda^2M_\mu(\lambda)^2}I_H
 \preceq AA^*\preceq{\lambda^2\over2}I_H.              \tag{2.12}
\]

Now `alpha_V=||AA^dagger Y||<=||A|| epsilon_min` gives the lower
bound in (2.9), while
`epsilon_min<=||A^dagger|| alpha_V` gives the upper bounds.  `square`

### 2.1 Gauge dependence

For a fixed right inverse put

\[
 E_B=(I-P_F)BP_V,qquad E_0=A^\dagger Y.                  \tag{2.13}
\]

Then `E_B=E_0+N_B`, where `AN_B=0`, and

\[
 \boxed{E_B^*E_B=E_0^*E_0+N_B^*N_B.}                    \tag{2.14}
\]

In the actual problem the source is infinite-dimensional while `X` and
`F` are finite-dimensional.  Hence `ker T intersect F^perp` is
infinite-dimensional.  Adding a map from `V` into this intersection changes
the untransformed source tail without changing `TB=I` or any physical
output.  Therefore

\[
 \|(I-P_F)B_XP_V\|^2=o(L/\lambda^3)                     \tag{2.15}
\]

is a gauge-dependent sufficient condition, not the intrinsic theorem
target.  Its implication

\[
 \alpha_V^2=o(L/\lambda)                                 \tag{2.16}
\]

is valid, but (2.16) should preferably be attacked directly through (2.2)
or (2.4).

### Corollary 2.3 (dimension/rank obstruction)

If

\[
 \dim V>\dim K,                                          \tag{2.17}
\]

then `V intersect H` is nonzero, `alpha_V=1`, and every lift satisfies

\[
 \boxed{
 \|(I-P_F)BP_V\|^2\geq{2\over\lambda^2}.}              \tag{2.18}
\]

Since

\[
 {2/\lambda^2\over L/\lambda^3}={2\lambda\over L}
 \longrightarrow\infty,                                 \tag{2.19}
\]

the scale (2.15) is then impossible.

For the actual matched inventory, `dim V=O(log lambda)` while the displayed
source inventory has `O(lambda^2)` columns.  Thus count alone does not
trigger (2.17).  This is not a rank or orientation theorem: `dim K` remains
an image-space quantity.

## 3. Exact corrected sparse-prolate source tail

Let `{h_n}` be the unit-orthonormal even prolate basis on
`[-lambda,lambda]`, and put

\[
 I_n=\langle\mathbf1,h_n\rangle.                          \tag{3.1}
\]

For a finite selected label set `S`, define

\[
 E=\operatorname {span}\{h_n:n\in S\},\qquad
 F=E\cap\mathbf1^\perp,                                  \tag{3.2}
\]

and

\[
 u=P_E\mathbf1,\qquad e=(I-P_E)\mathbf1,qquad
 s=\|u\|^2=\sum_{n\in S}|I_n|^2>0.                      \tag{3.3}
\]

### Theorem 3.1 (coefficient-level corrected-tail identity)

For `z perpendicular to 1`, write `z_n=<h_n,z>`.  Then

\[
 \boxed{
 \|(I-P_F)z\|^2
 =\sum_{n\notin S}|z_n|^2
 +{\left|\sum_{n\notin S}\overline{I_n}z_n\right|^2
       \over\sum_{n\in S}|I_n|^2}.}                    \tag{3.4}
\]

Consequently,

\[
 \boxed{
 \|(I-P_E)z\|^2
 \leq\|(I-P_F)z\|^2
 \leq{2\lambda\over s}\|(I-P_E)z\|^2.}               \tag{3.5}
\]

**Proof.**  The orthogonal decomposition of `E` is

\[
 E=F\mathbin\oplus\operatorname {span}(u).
\]

Because `<1,z>=0`, one has `<u,z>=-<e,z>`.  The two terms in

\[
 (I-P_F)z=(I-P_E)z+{\langle u,z\rangle\over s}u          \tag{3.6}
\]

are orthogonal.  This proves (3.4).  Cauchy--Schwarz and
`||e||^2=2lambda-s` give (3.5).  `square`

For an operator `B` whose range is in `1^perp`, (3.5) gives

\[
 \|(I-P_E)BP_V\|^2
 \leq\|(I-P_F)BP_V\|^2
 \leq{2\lambda\over s}\|(I-P_E)BP_V\|^2.              \tag{3.7}
\]

For the plus family and the locked range `lambda>=2`, the ground-integral
estimate gives

\[
 s_+\geq I_0^2\geq{1\over4\lambda},qquad
 {2\lambda\over s_+}\leq8\lambda^2.                   \tag{3.8}
\]

The prescribed sets are sparse:

\[
 S_+=\{0,4,8,\ldots\},\qquad
 S_-=\{2,6,10,\ldots\},                                \tag{3.9}
\]

with their declared finite strict endpoints.  Thus (3.4) is not merely a
high-index prolate tail.  It contains every omitted opposite residue class.
In particular, (2.15) would require

\[
 \|P_VB_X^*h_n\|^2=o(L/\lambda^3)                       \tag{3.10}
\]

for `n=2,6,...` in the plus family and for `n=0,4,...` in the minus
family.  No locked concentration estimate proves these source moments.
Multiplicative inversion parity may not be identified with the sign of a
finite additive Fourier eigenvalue.

### 3.1 The explicit Mobius lift has real jumps

On the visible positive source interval, the locked right inverse begins
with

\[
 (R_\lambda g)(x)=
 \sum_{n\leq\lambda/x}\mu(n){g(nx)\over\sqrt{nx}},
 \qquad \lambda^{-1}\leq x\leq\lambda.                 \tag{3.11}
\]

It is extended evenly and its integral is removed by a constant on the
central hole.  For every `n` with `mu(n) != 0`, the one-sided jump at
`x_n=lambda/n` is exactly

\[
 \boxed{
 R_\lambda g(x_n^-)-R_\lambda g(x_n^+)
 =\mu(n){g(\lambda)\over\sqrt\lambda}.}                 \tag{3.12}
\]

For the normalized constant plus feature `g_0=L^(-1/2)`, the jump at
`x=lambda/2` has magnitude

\[
 {1\over\sqrt{\lambda L}}.                               \tag{3.13}
\]

Every finite prolate span is analytic on the open source interval, so this
explicit lifted source is not in any finite `E`; its finite-`lambda` source
tail is strictly positive.  This observation supplies no uniform lower
rate.  The present unconditional upper bound is only

\[
 \|(I-P_F)B_XP_V\|^2
 \leq\|B_X\|^2
 \leq2\lambda^2M_\mu(\lambda)^2
 \leq8\lambda^4.                                      \tag{3.14}
\]

## 4. Central polynomial feature capture

Fix `0<delta<pi/2` and put

\[
 B_\delta=[-\delta/L,\delta/L],\qquad
 T_{B_\delta}=\int_{B_\delta}
 |P_Xe_t\rangle\langle P_Xe_t|\,{dt\over2\pi}.          \tag{4.1}
\]

Let

\[
 V_r=\operatorname {ran}
       (P_X|_{\text{polynomials of degree }<r}),
 \qquad \alpha_r=\|P_HP_{V_r}\|.                       \tag{4.2}
\]

There is an exact gauge-free way to reconstruct this angle from physical
cross Grams.  The statement applies to `V_r` and, without change, to every
spectral feature space in Section 6.

### Theorem 4.1 (physical cross-Gram angle and least squares)

Let `U:C^d->X` be injective with `ran U=V`, and let
`W:C^m->X` have `ran W=K`.  Define

\[
 G=U^*U\succ0,\qquad A=W^*W,                             \tag{4.3}
\]

\[
 P_K=WA^\dagger W^*,\qquad
 S=G-U^*WA^\dagger W^*U=U^*(I-P_K)U.                    \tag{4.4}
\]

Then

\[
 \boxed{
 \alpha_V^2
 =\lambda_{\max}(G^{-1/2}SG^{-1/2}).}                   \tag{4.5}
\]

For every compatible coefficient map `Y`,

\[
 \boxed{
 S\preceq(U-WY)^*(U-WY),}                               \tag{4.6}
\]

and equality holds for

\[
 \boxed{Y_0=A^\dagger W^*U.}                            \tag{4.7}
\]

**Proof.**  The map `Q=UG^(-1/2)` is an isometry onto `V`.  Hence

\[
 \alpha_V^2
 =\|P_HQ\|^2
 =\lambda_{\max}(Q^*P_HQ),
\]

which is (4.5).  Orthogonally split

\[
 U-WY=P_HU+(P_KU-WY).                                   \tag{4.8}
\]

The two summands have ranges in `H` and `K`, respectively, so their Gram
cross terms vanish.  This proves (4.6).  Since
`WY_0=WA^dagger W^*U=P_KU`, equality holds at (4.7).  `square`

Thus a producer may certify `alpha_V` using only independently assembled
physical Grams and cross Grams.  No right-inverse boolean or source-gauge
choice is involved.

### Corollary 4.2 (graph certificate)

In the setting of Theorem 4.1, suppose `d=m` and the square cross Gram

\[
 M=U^*W                                                     \tag{4.9}
\]

is invertible.  Put

\[
 Z=WM^{-1}G,
 \qquad
 \beta=\|(I-P_V)ZG^{-1/2}\|.                            \tag{4.10}
\]

Then `ran Z` is contained in `K`, `P_VZ=U`, and

\[
 \boxed{
 \alpha_V\leq{\beta\over\sqrt{1+\beta^2}}.}            \tag{4.11}
\]

**Proof.**  Since `U^*Z=G`, the projector
`P_V=UG^(-1)U^*` gives `P_VZ=U`.  Therefore

\[
 ZG^{-1/2}=UG^{-1/2}+(I-P_V)ZG^{-1/2}                   \tag{4.12}
\]

is the graph, inside `K`, of an operator of norm `beta` over the isometric
copy of `V`.  For a unit graph coordinate with transverse norm `b`, its
distance from the graph line is `b/sqrt(1+b^2)`.  Projection onto all of
`K` can only decrease that distance.  Taking the supremum and using
`b<=beta` proves (4.11).  `square`

The already locked factorial estimate is

\[
 \tau_r:=\operatorname {tr}
 ((I-P_{V_r})T_{B_\delta}(I-P_{V_r}))
 \leq{\delta\over\pi}
 { (\delta/2)^{2r}\over(2r+1)^2(r!)^2}.                 \tag{4.13}
\]

Therefore

\[
 \boxed{
 \operatorname {tr}(P_HT_{B_\delta}P_H)
 \leq
 \left(\alpha_r\sqrt{\delta/\pi}+\sqrt{\tau_r}\right)^2.}
                                                                  \tag{4.14}
\]

The cross term in the square is retained.  By Theorem 2.1, `alpha_r` can
be computed or estimated through the transformed source tail without
choosing a gauge for the invisible source component.

## 5. Exact combined-symbol exterior layer cake

Write

\[
 w(t)=m_\lambda(t)-U,
 \qquad d(t)=(\nu L-w(t))_+
            =(U+\nu L-m_\lambda(t))_+,                     \tag{5.1}
\]

and separate the exterior frequency set

\[
 G=\{t:|t|>\delta/L\}.                                  \tag{5.2}
\]

Define the complete prime mass and the pinned archimedean constant

\[
 \Sigma_\lambda=
 \sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n},
 \qquad c_0=\psi(1/4)-\log\pi,                           \tag{5.3}
\]

and put

\[
 A_*=[U+\nu L+2\Sigma_\lambda-c_0]_+.                   \tag{5.4}
\]

The locked digamma lower bound and `|S_lambda(t)|<=Sigma_lambda` give

\[
 \boxed{
 d(t)\leq
 \left[A_*-\frac12\log(1+4t^2)\right]_+
 \leq A_*.}                                             \tag{5.5}
\]

In particular, the support of `d` is contained in

\[
 |t|\leq{1\over2}\sqrt{e^{2A_*}-1}.                     \tag{5.6}
\]

For `s>=0`, define the exact combined-symbol level set

\[
 \Omega_s
 =G\cap\{d>s\}
 =G\cap\{m_\lambda<U+\nu L-s\},                        \tag{5.7}
\]

and its concentration compression

\[
 C_s=T_{\mathbf1_{\Omega_s}}|_X.                         \tag{5.8}
\]

Every archimedean term, the complete minus-prime block, and every prime
power at `n<=lambda^2` remains combined inside (5.7).

### Theorem 5.1 (exact exterior layer cake)

The exterior defect operator

\[
 D_{\rm ext}=T_{d\mathbf1_G}|_X                           \tag{5.9}
\]

obeys

\[
 \boxed{
 D_{\rm ext}=\int_0^{A_*}C_s\,ds.}                      \tag{5.10}
\]

**Proof.**  Pointwise,

\[
 d(t)\mathbf1_G(t)
 =\int_0^{A_*}\mathbf1_{\Omega_s}(t)\,ds
\]

by (5.5).  Compression is linear, and the finite-dimensional weak and
Bochner integrals coincide.  `square`

This identity preserves the cancellation in the combined symbol before any
absolute-value majorant is taken.

## 6. Dyadic exterior features and the sharp spectral coefficient

Fix `tau>0`.  Put

\[
 a_0=\min(A_*,\tau).                                     \tag{6.1}
\]

If `A_*>tau`, define

\[
 J=\left\lceil\log_2(A_*/\tau)\right\rceil,
 \qquad s_j=2^j\tau,                                    \tag{6.2}
\]

\[
 c_j=\min(A_*,2^{j+1}\tau)-s_j,
 \qquad 0\leq j<J.                                      \tag{6.3}
\]

When `A_*<=tau`, the sum below is empty.

### Theorem 6.1 (finite dyadic majorant)

\[
 \boxed{
 D_{\rm ext}\preceq
 a_0I+\sum_{j=0}^{J-1}c_jC_{s_j}.}                      \tag{6.4}
\]

**Proof.**  Since the sets `Omega_s` decrease with `s`, the operators `C_s`
also decrease.  Bound the integral from zero to `a_0` by `a_0 I` and each
dyadic interval `[s_j,min(A_*,2s_j)]` by its left-endpoint operator.  Apply
(5.10).  `square`

For declared thresholds `0<=sigma_j<1`, let

\[
 E_j=\mathbf1_{(\sigma_j,1]}(C_{s_j}).                   \tag{6.5}
\]

### Theorem 6.2 (sharp upper spectral split)

For every `j`,

\[
 \boxed{
 C_{s_j}\preceq
 \sigma_jI+(1-\sigma_j)E_j.}                            \tag{6.6}
\]

The coefficient `1-sigma_j` is optimal among uniform inequalities with the
scalar base `sigma_j I`.

**Proof.**  The spectrum of every concentration compression lies in
`[0,1]`.  On `[0,sigma_j]`, bound the spectral value by `sigma_j`; on
`(sigma_j,1]`, bound it by one.  An eigenvalue equal to one forces the
coefficient beyond the base to be at least `1-sigma_j`.  `square`

Put

\[
 \rho_{\rm ext}=\|P_HD_{\rm ext}P_H\|,
 \qquad h=\dim H,                                        \tag{6.7}
\]

and define the intrinsic operator and Hilbert--Schmidt angles

\[
 \alpha_j=\|P_HE_j\|,
 \qquad
 \mathfrak a_j^2=\|P_HE_j\|_{\rm HS}^2
 =\operatorname {rank}E_j-\operatorname {tr}(E_jP_K).   \tag{6.8}
\]

Equations (6.4)--(6.6) give

\[
 \boxed{
 \rho_{\rm ext}
 \leq a_0+\sum_{j=0}^{J-1}c_j
 \{\sigma_j+(1-\sigma_j)\alpha_j^2\}.}                 \tag{6.9}
\]

The exterior trace defect satisfies

\[
 \boxed{
 \mathcal E_{\rm ext}:=
 \operatorname {tr}(P_HD_{\rm ext}P_H)
 \leq a_0h+\sum_{j=0}^{J-1}c_j
 \{\sigma_jh+(1-\sigma_j)\mathfrak a_j^2\}.}           \tag{6.10}
\]

### 6.1 Exact transformed and sufficient source tails

Theorem 2.1 applies separately to every spectral feature projector:

\[
 \boxed{
 P_HE_j=P_HT(I-P_F)B_XE_j.}                             \tag{6.11}
\]

Hence

\[
 \alpha_j
 \leq{\lambda\over\sqrt2}
       \|(I-P_F)B_XE_j\|,                               \tag{6.12}
\]

\[
 \mathfrak a_j
 \leq{\lambda\over\sqrt2}
       \|(I-P_F)B_XE_j\|_{\rm HS}.                     \tag{6.13}
\]

The equalities in (6.11) are intrinsic; the untransformed norms in
(6.12)--(6.13) are gauge-dependent sufficient majorants.

If `tau=beta_0 L` for a fixed `beta_0>0` and `U=O(L)`, the elementary
estimates

\[
 \Lambda(n)\leq\log(\lambda^2),
 \qquad
 \sum_{1<n\leq\lambda^2}{1\over\sqrt n}
 \leq2(\lambda-1)                                       \tag{6.14}
\]

give

\[
 \boxed{
 \Sigma_\lambda\leq4(\lambda-1)\log\lambda.}           \tag{6.15}
\]

Indeed, the first inequality holds termwise at the inclusive endpoint, and
the second follows by comparison with the integral of `x^(-1/2)` from one
to `lambda^2`.  Equations (5.4), (6.2), and (6.15) then give

\[
 J=O(\log\lambda).                                      \tag{6.16}
\]

This means logarithmically many feature **projectors**.  Their ranks need
not be logarithmic or small.

## 7. Closed-endpoint converse and rank obstruction

For `0<sigma_j<=1`, define the closed spectral projector

\[
 F_j=\mathbf1_{[\sigma_j,1]}(C_{s_j}),
 \qquad r_j=\operatorname {rank}F_j,
 \qquad k=\dim K.                                        \tag{7.1}
\]

The closed endpoint is mandatory in the converse.

### Theorem 7.1 (exterior lower bounds)

For every dyadic level,

\[
 \boxed{D_{\rm ext}\succeq s_jC_{s_j}.}                \tag{7.2}
\]

Consequently,

\[
 \boxed{
 \rho_{\rm ext}
 \geq s_j\sigma_j\|P_HF_j\|^2,}                       \tag{7.3}
\]

and

\[
 \boxed{
 \mathcal E_{\rm ext}
 \geq s_j\sigma_j(r_j-k)_+.}                           \tag{7.4}
\]

If `r_j>k`, then

\[
 \boxed{\|P_HF_j\|=1}                                 \tag{7.5}
\]

and the right side of (7.3) is `s_j sigma_j`.

**Proof.**  For `0<=s<=s_j`, monotonicity gives
`C_s>=C_(s_j)`.  Integrating this part of (5.10) proves (7.2).  Spectral
calculus gives `C_(s_j)>=sigma_j F_j`, proving (7.3) and the corresponding
trace inequality.  Since

\[
 \operatorname {tr}(P_HF_jP_H)
 =r_j-\operatorname {tr}(P_KF_j)
 \geq(r_j-k)_+,
\]

one obtains (7.4).  If `r_j>k`, dimension forces a nonzero vector in
`ran(F_j) intersect H`; on its normalization the angle is one.  `square`

The upper theorem uses `(sigma_j,1]`, while the lower theorem uses
`[sigma_j,1]`.  An eigenvector at the threshold belongs to the low scalar
part of the upper estimate but must be retained in the converse.

### Proposition 7.2 (positive-measure levels have full algebraic rank)

If `Omega_s` has positive Lebesgue measure, then `C_s` is positive definite
on `X`.

**Proof.**  If `<f,C_sf>=0`, the Fourier transform of the compactly
supported physical function `f` vanishes almost everywhere on `Omega_s`.
It is entire.  A positive-measure real zero set has an accumulation point,
so the transform, and hence `f`, vanishes identically.  `square`

Thus the level operators are not literally low rank when their level sets
have positive measure.  What remains necessary is an effective-rank and
physical-alignment theorem at declared positive thresholds.

## 8. Combined even-sector sufficient conditions

Let

\[
 D_c=T_{d\mathbf1_{B_\delta}}|_X,qquad
 \rho_c=\|P_HD_cP_H\|,qquad
 \mathcal E_c=\operatorname {tr}(P_HD_cP_H).             \tag{8.1}
\]

Since `0<=d<=A_*`, equation (4.14) gives

\[
 \boxed{
 \rho_c\leq\mathcal E_c
 \leq A_*
 \left(\alpha_r\sqrt{\delta/\pi}+\sqrt{\tau_r}\right)^2.}
                                                                  \tag{8.2}
\]

The exact defect splits as `D_nu=D_c+D_ext`.  Therefore either of the
following declared strict estimates supplies the corresponding scalar
defect budget:

\[
 \boxed{
 \rho_c+\rho_{\rm ext}< (\nu-\mu)L}                    \tag{8.3}
\]

for the operator-norm comparison, or

\[
 \boxed{
 \mathcal E_c+\mathcal E_{\rm ext}< (\nu-\mu)L}         \tag{8.4}
\]

for the leverage-trace comparison.  The right sides of (8.2), (6.9), and
(6.10) make these finite collections of explicit feature-angle targets.
Neither (8.3) nor (8.4) is proved for the actual prolate range.

## 9. Sharp odd-pole reserve

In the odd sector let

\[
 p=P_HP_Xp_-,\qquad p_-(x)=\sinh(x/2),qquad
 \mu_p=\|p\|^2,                                         \tag{9.1}
\]

and

\[
 S_L=\|p_-\|^2=\sinh(L/2)-L/2<\lambda/2.                \tag{9.2}
\]

For the polynomial feature space `V_r`, the locked Taylor theorem gives

\[
 \mu_p\leq B_r,qquad
 B_r=(\alpha_r\sqrt{S_L}+\epsilon_{p,r})^2,             \tag{9.3}
\]

\[
 \epsilon_{p,r}^2
 \leq{L\lambda\over2r+1}
       {(L/4)^{2r}\over(r!)^2}.                          \tag{9.4}
\]

Fix

\[
 c>a>\beta\geq0,qquad
 0\preceq R\preceq(c-a)LI,                              \tag{9.5}
\]

and define

\[
 M_0=cLI-R,qquad
 q=(c-\beta)L,qquad h=(a-\beta)L,qquad
 b=q-h=(c-a)L,                                          \tag{9.6}
\]

\[
 M_\beta=qI-R\succeq hI.                               \tag{9.7}
\]

Let `A_+>=0` be any retained positive excess.

### Theorem 9.1 (sharp orientation-free reserve)

\[
 \boxed{
 M_0+A_+-2|p\rangle\langle p|
 \succeq(aL-2B_r)I.}                                   \tag{9.8}
\]

Equivalently, after shifting by `beta L`,

\[
 \boxed{
 M_\beta+A_+-2|p\rangle\langle p|
 \succeq(h-2B_r)I.}                                    \tag{9.9}
\]

Thus the strict inequality

\[
 \boxed{B_r<h/2}                                       \tag{9.10}
\]

proves a strict `beta L` floor.  The shifted rank-one load satisfies

\[
 \boxed{
 \mathcal L_+=2\langle p,(M_\beta+A_+)^{-1}p\rangle
 \leq{2\mu_p\over h}\leq{2B_r\over h}.}              \tag{9.11}
\]

More quantitatively, if

\[
 B_r\leq{1-\eta\over2}h,qquad 0<\eta\leq1,            \tag{9.12}
\]

then

\[
 \boxed{
 M_\beta+A_+-2|p\rangle\langle p|
 \succeq\eta(M_\beta+A_+)\succeq\eta hI.}             \tag{9.13}
\]

**Proof.**  Equations (9.8)--(9.9) follow from
`M_0>=aLI`, `M_beta>=hI`, `A_+>=0`, and
`|p><p|<=mu_p I<=B_rI`.  Equation (9.11) follows by inversion.
For (9.13), conjugate by `(M_beta+A_+)^(1/2)`.  The normalized rank-one
load is at most `1-eta`, so its complement is at least `eta I`.  `square`

The constant is sharp.  In dimension one take `A_+=0`, `R=bI`, and
`|p|^2=B_r`.  Then every inequality above is equality, and `B_r=h/2` is the
singular boundary.

### 9.1 Exact source-tail and angle constants

Put

\[
 \varepsilon_{F,V}=\|(I-P_F)B_XP_{V_r}\|.              \tag{9.14}
\]

Equations (2.3), (9.2), and (9.3) give

\[
 \boxed{
 B_r\leq
 \left({\lambda^{3/2}\over2}\varepsilon_{F,V}
       +\epsilon_{p,r}\right)^2.}                      \tag{9.15}
\]

Hence the exact sufficient source condition is

\[
 \boxed{
 \left({\lambda^{3/2}\over2}\varepsilon_{F,V}
       +\epsilon_{p,r}\right)^2
 <{(a-\beta)L\over2}.}                                 \tag{9.16}
\]

For `r=ceil(3L/2)`, one has
`epsilon_(p,r)^2=o(L/lambda)`.  If

\[
 C_*=limsup_{\lambda\to\infty}
 {\lambda^3\varepsilon_{F,V}^2\over L}<\infty,          \tag{9.17}
\]

then

\[
 \limsup {B_r\over L}\leq{C_*\over4},
 \qquad
 \limsup\mathcal L_+\leq{C_*\over2(a-\beta)},          \tag{9.18}
\]

\[
 \liminf {\lambda_{\min}
 (M_0+A_+-2|p\rangle\langle p|)\over L}
 \geq a-{C_*\over2}.                                   \tag{9.19}
\]

Thus `C_*<2(a-beta)` is the sharp constant threshold supplied by this
source-norm route.

The intrinsic angle formulation is cleaner.  If

\[
 A_{\rm ang}=\limsup_{\lambda\to\infty}
 {\lambda\alpha_r^2\over L},                            \tag{9.20}
\]

then

\[
 \limsup {B_r\over L}\leq{A_{\rm ang}\over2},          \tag{9.21}
\]

and

\[
 \boxed{A_{\rm ang}<a-\beta}                           \tag{9.22}
\]

is sufficient for a strict eventual odd reserve, conditional on the capped
base (9.5).

## 10. Directional deficits and the optimal moment remainder

Retain the notation (9.6)--(9.7), and put

\[
 \rho_j=\langle p,R^jp\rangle,
 \qquad
 d_j=b^j\mu_p-\rho_j
 =\langle p,(b^jI-R^j)p\rangle\geq0.                   \tag{10.1}
\]

In particular, `d_0=0`.  The locked moment upper bound is

\[
 U_k=2\left(
 \sum_{j=0}^{k-1}{\rho_j\over q^{j+1}}
 +{\rho_k\over hq^k}\right),\qquad k\geq0.             \tag{10.2}
\]

### Theorem 10.1 (exact directional-deficit identity)

For every `k>=0`,

\[
 \boxed{
 U_k={2\mu_p\over h}
 -2\left(
 \sum_{j=0}^{k-1}{d_j\over q^{j+1}}
 +{d_k\over hq^k}\right).}                            \tag{10.3}
\]

Consequently,

\[
 \boxed{
 U_k<1
 \quad\Longleftrightarrow\quad
 \sum_{j=0}^{k-1}{d_j\over q^{j+1}}
 +{d_k\over hq^k}
 >{\mu_p\over h}-{1\over2}.}                          \tag{10.4}
\]

At `k=1`, this is exactly

\[
 \boxed{d_1>q(\mu_p-h/2).}                             \tag{10.5}
\]

**Proof.**  Since `b=q-h`,

\[
 \sum_{j=0}^{k-1}{b^j\over q^{j+1}}
 +{b^k\over hq^k}={1\over h}.                          \tag{10.6}
\]

Substitute `rho_j=b^j mu_p-d_j` into (10.2).  This proves (10.3), and
(10.4)--(10.5) follow algebraically.  `square`

The supremum of `U_k` over all `0<=R<=bI`, at fixed pole norm, is

\[
 \boxed{\sup_R U_k={2\mu_p\over h}}                    \tag{10.7}
\]

for every `k`; it is attained when `R=bI` on the pole direction.  The exact
uncompensated load obeys the sharp interval

\[
 \boxed{
 {2\mu_p\over q}
 \leq2\langle p,(qI-R)^{-1}p\rangle
 \leq{2\mu_p\over h}.}                                \tag{10.8}
\]

Thus `mu_p<h/2` is the sharp orientation-free sufficient condition, while
`mu_p<q/2` is necessary for any uncompensated pass.  In the intermediate
range `h/2<=mu_p<q/2`, directional placement is decisive.

### Theorem 10.2 (optimal geometric remainder constant)

Put

\[
 \gamma={b\over q}\in[0,1).                            \tag{10.9}
\]

Let `sigma_p` be the spectral measure of `R/q` in the vector `p`, with
total mass `mu_p`.  If

\[
 \mathcal L_0=2\langle p,(qI-R)^{-1}p\rangle,           \tag{10.10}
\]

then

\[
 \boxed{
 U_k-\mathcal L_0
 ={2\over h}\int_{[0,\gamma]}
 x^k{\gamma-x\over1-x}\,d\sigma_p(x).}                \tag{10.11}
\]

Therefore the best uniform constant is

\[
 \boxed{
 0\leq U_k-\mathcal L_0
 \leq{2\mu_p\over h}C_k(\gamma),
 \qquad
 C_k(\gamma)=\max_{0\leq x\leq\gamma}
 x^k{\gamma-x\over1-x}.}                              \tag{10.12}
\]

One has

\[
 C_0(\gamma)=\gamma.                                   \tag{10.13}
\]

If `gamma=0`, then `C_k(0)=0` for every `k`.  For `k>=1` and
`0<gamma<1`, define

\[
 A_k=(k+1)+(k-1)\gamma,                                 \tag{10.14}
\]

\[
 x_k={A_k-\sqrt{A_k^2-4k^2\gamma}\over2k}.             \tag{10.15}
\]

Then `x_k` is the unique maximizer in `(0,gamma)` and

\[
 \boxed{
 C_k(\gamma)=x_k^k{\gamma-x_k\over1-x_k}.}             \tag{10.16}
\]

For `k>=1` and `0<gamma<1`, this is strictly smaller than the preceding
coarse constant `gamma^(k+1)`.  At fixed `0<gamma<1`,

\[
 C_k(\gamma)\sim
 {\gamma^{k+1}\over e k(1-\gamma)}.                    \tag{10.17}
\]

**Proof.**  Spectral calculus applied to the exact remainder gives
(10.11).  The best measure-independent bound is its maximum integrand,
which proves (10.12).  For `k>=1` and `0<gamma<1`, logarithmic
differentiation gives

\[
 {k\over x}-{1\over\gamma-x}+{1\over1-x}=0,            \tag{10.18}
\]

or

\[
 kx^2-A_kx+k\gamma=0.                                   \tag{10.19}
\]

The smaller root is (10.15); it is the unique interior maximum because the
integrand vanishes at both endpoints.  A one-dimensional spectral measure
at `x_k` attains equality, proving optimality.  Expansion of (10.15) gives
(10.17).  `square`

## 11. Exact countermodels and sharpness regressions

All models below use exact rational matrices.  They are logical regressions,
not physical Xi--prolate matrices.

### 11.1 Right-inverse gauge

Let `p>=5` be odd, `lambda=p/2`, and take

\[
 X=V=\mathbb R,qquad \mathcal S=\mathbb R^2,qquad
 T=\begin{pmatrix}p/4&0\end{pmatrix},qquad M_\mu=1.    \tag{11.1}
\]

Let `F=span(e_1)`.  Then `K=X`, `alpha_V=0`, and

\[
 B_0=\binom{4/p}{0},\qquad B_1=\binom{4/p}{1}           \tag{11.2}
\]

are both right inverses satisfying the declared coarse norm bound.  Their
source tails are respectively zero and one.  Thus exact physical capture
does not control an arbitrary right-inverse gauge.

### 11.2 Minimum-tail rank obstruction

Keep (11.1), but let `F=span(e_2)`.  Then `K=0`, `H=X`, and
`alpha_V=1`.  Every right inverse has first source coordinate `4/p`, so

\[
 \|(I-P_F)B\|^2\geq{16\over p^2}={4\over\lambda^2}.     \tag{11.3}
\]

This is asymptotically larger than `L/lambda^3`.

### 11.3 Corrected sparse tail

In `R^4`, take the orthonormal prolate-coordinate surrogate

\[
 \mathbf1=(1,2,3,4),\qquad
 E=\operatorname {span}(e_1,e_3),
 \qquad z=(2,-1,0,0).                                   \tag{11.4}
\]

Then `<1,z>=0`,

\[
 s=1^2+3^2=10,
 \qquad
 F=E\cap\mathbf1^\perp
 =\operatorname {span}\{(3,0,-1,0)\}.                  \tag{11.4a}
\]

The raw omitted norm squared is one, while the rank-one mean correction is
`4/10=2/5`.  Therefore

\[
 \boxed{
 \|(I-P_F)z\|^2=1+{2\over5}={7\over5}.}                \tag{11.4b}
\]

Dropping the mean correction loses the exact contribution `2/5` and changes
the tail from `7/5` to `1`.

### 11.4 Noncommuting dyadic layer cake

Let

\[
 A_1=\begin{pmatrix}1/4&0\\0&0\end{pmatrix},\qquad
 A_2={1\over8}\begin{pmatrix}1&1\\1&1\end{pmatrix},
 \qquad A_3=I-A_1-A_2.                                  \tag{11.6}
\]

These are positive semidefinite POVM atoms and do not all commute.  Give
them respective heights `1,3,8`, and take `tau=1`.  The exact operator is

\[
 D=A_1+3A_2+8A_3.                                      \tag{11.7}
\]

The dyadic majorant (6.4) is

\[
 I+3(A_2+A_3)+4A_3=A_1+4A_2+8A_3,                     \tag{11.8}
\]

so majorant minus exact operator is exactly

\[
 \boxed{A_2\succeq0.}                                  \tag{11.9}
\]

This checks the layer decomposition without commuting the level operators.

### 11.5 Odd orientation at the spectral edge

Take

\[
 q=3,qquad h=1,qquad R=\operatorname {diag}(0,2),
 \qquad A_+=0.                                          \tag{11.10}
\]

For `p=e_1`, the load is `2/3`, the compensated matrix is the identity,
and `U_k=2/3` for `k>=1` while `U_0=2`.  For `p=e_2`, the load and every
`U_k` equal two, and the compensated matrix is `diag(3,-1)`.  Both cases
have the same `R` spectrum and pole norm.  Direction, not spectral data
alone, decides the floor.

### 11.6 Sharp feature threshold

Let

\[
 X=\mathbb R^2,qquad V=\operatorname {span}(e_1),
 \qquad p_X=e_1,qquad M_\beta=I.                       \tag{11.11}
\]

With exact Taylor tail zero:

- `K=span((4/5,3/5))` gives `alpha^2=mu_p=9/25` and load `18/25`;
- `K=span((1,1))` gives `alpha^2=mu_p=1/2` and load one, the singular
  boundary;
- `K=span((3/5,4/5))` gives `alpha^2=mu_p=16/25` and load `32/25`.

Equal ranks do not determine the angle or the odd reserve.

### 11.7 Positive excess must align

Let `M_beta=I`, `p=e_1`, and

\[
 A_{\rm aligned}=2e_1e_1^*.                              \tag{11.12}
\]

Its load is `2/3`, and the compensated matrix is exactly `I`, hence positive
definite.
Now put `u=(4/5,3/5)` and

\[
 A_{\rm oblique}=2uu^*
 ={1\over25}\begin{pmatrix}32&24\\24&18\end{pmatrix}. \tag{11.13}
\]

The two excess matrices have the same spectrum.  Moreover,

\[
 \langle p,A_{\rm oblique}p\rangle={32\over25}>1
 =2\|p\|^4-\langle p,M_\beta p\rangle,                 \tag{11.14}
\]

so the strict pole-axis necessary inequality holds.  Nevertheless the load
is `86/75`, and

\[
 M_\beta+A_{\rm oblique}-2pp^*
 ={1\over25}\begin{pmatrix}7&24\\24&43\end{pmatrix}   \tag{11.15}
\]

has determinant `-11/25`.  The excess spectrum and even its strict
pole-axis expectation do not replace an alignment theorem.

### 11.8 Perfect pole capture does not prove the base

Take `p=0` and

\[
 M_\beta=\operatorname {diag}(1,0).                     \tag{11.16}
\]

The pole load vanishes, but there is no strict positive base.  Pole capture
and the capped-base theorem are separate obligations.

## 12. Actual open estimates

The reductions above leave the following estimates open on one common
unbounded schedule.

1. **Central intrinsic angle.**  Prove the strict constant version of
   `alpha_r^2=o(L/lambda)` for the actual corrected prolate physical range,
   with `r` large enough for both the central Fourier band and the odd pole.
   A source right-inverse norm is only a sufficient route.
2. **Exterior dyadic alignments.**  For declared `tau`, `sigma_j`, and every
   exact combined-symbol level, prove operator or Hilbert--Schmidt bounds on
   `P_HE_j` strong enough to close (6.9) or (6.10).  The open/closed spectral
   endpoints and the rank obstruction in Section 7 must be retained.
3. **Exterior effective ranks.**  Control the positive-threshold ranks and
   orientations of the full-rank concentration operators.  The fact that
   there are only `O(log lambda)` levels is not a low-dimensional theorem.
4. **Combined-symbol arithmetic.**  Establish the required bounds without
   separating the archimedean and prime blocks by a triangle inequality.
   The minus prime sign and every prime power `n<=lambda^2` must remain in
   the level sets.
5. **Odd capped base.**  Prove (9.5) for the actual shifted odd block, then
   prove either the sharp norm reserve (9.10), a directional-deficit budget
   (10.4), or an aligned-positive-excess load strictly below one.  Equality
   is singular.
6. **Signed sector floors.**  Combine the central and exterior even budgets
   and the shifted odd reserve into strict actual sector floors, with all
   source Grams and normalizations retained.
7. **Bridge limits.**  Prove the residual--gap and projection limits in
   equation (5.2) of `DIRECT_RH_ATTACK.md` and separately prove locally
   uniform convergence of the correctly normalized characteristic
   functions.

None of these items is discharged by finite fixtures, numerical
eigenvalue agreement, a rank count, a big-O label without constants, or a
nonpositive reserve.  The only terminal status of this reduction is
`P0_INVALIDATED`.
