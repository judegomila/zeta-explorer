# Growing-transition global-radical sector-mixing feature-geometry barrier

## 0. Exact result and fail-closed boundary

Use the locked schedule

\[
 \lambda={p\over2},\qquad c=2\pi\lambda^2,\qquad
 L=2\log\lambda,\qquad h={\pi\over4}.                 \tag{0.1}
\]

For every corrected physical source in the admitted synthesis, let

\[
 K=X+O                                                     \tag{0.2}
\]

be its global two-sided radical, split into its central and exterior
parts.  The radical statement is pointwise at both paired zero
evaluations:

\[
 \boxed{ZK=0,\qquad ZX=-ZO.}                             \tag{0.3}
\]

It is therefore stronger than the source-domain identity
`mathcal W_Z(X,K)=0`.  Put `mathcal Z=ZO=-ZX` and define

\[
 A=\mathcal Z^*\mathcal Z,
 \qquad Q=\mathcal Z^*\Sigma\mathcal Z,                 \tag{0.4}
\]

where `Sigma=Sigma^*=Sigma^(-1)` is the paired-slot orientation
involution.  Then the complete positive and signed `X/O` Gram blocks are

\[
 \boxed{
 \begin{pmatrix}
 Z_X^*Z_X&Z_X^*Z_O\\
 Z_O^*Z_X&Z_O^*Z_O
 \end{pmatrix}
 =\begin{pmatrix}A&-A\\-A&A\end{pmatrix},
 \qquad
 \begin{pmatrix}
 \mathcal W_Z(X,X)&\mathcal W_Z(X,O)\\
 \mathcal W_Z(O,X)&\mathcal W_Z(O,O)
 \end{pmatrix}
 =\begin{pmatrix}Q&-Q\\-Q&Q\end{pmatrix}.}             \tag{0.5}
\]

Thus the physical `X` and `O` features are exactly antipodal.  This
global relation does not split either feature into continuous and prime
components.

At finite Fejer cutoff `M` and an additional finite prime cutoff `R`, the
completed odd-Laplace rows and truncated ordered prime atoms admit a
different exact representation.  If `T_(M,R)` is the finite source
feature map and `J_(M,R)` its cross-slot involution, Sections 4--5 prove

\[
 \boxed{
 \begin{aligned}
 \operatorname {Herm}Q_{M,R}^\uparrow
 &=T_{M,R}^*J_{M,R}T_{M,R},\\
 \operatorname {Herm}Q_M^\uparrow
 &=\lim_{R\to\infty}^{\rm source/Abel}
        T_{M,R}^*J_{M,R}T_{M,R},\\
 \mathcal Z^*\Sigma\mathcal Z
 &=\lim_{M\to\infty}^{\rm ordered}
        \operatorname {Herm}Q_M^\uparrow .
 \end{aligned}}                                         \tag{0.6}
\]

The first equality is a genuine finite artificial Krein factorization.
The two limits are only signed cross-form limits on coefficient space.
They do not assert a positive feature limit.  In fact, for a generic
nonzero repeated inward row,

\[
 \boxed{\sup_R\|T_{p,M,R}x\|^2=\infty.}                \tag{0.7}
\]

Thus there is no infinite-prime Hilbert map `T_(p,M)` supplied by the raw
ordered rows, still less an identity with `mathcal Z^*mathcal Z`.  In
particular, `K_M=X_M+O_M` is not a radical at finite cutoff.

There is no orthogonal pole--Archimedean--prime decomposition of the
physical zero feature which represents the current local block.  On a
realized `D`-white packet with local negative scale `tau_L`, such a
decomposition would imply

\[
 \tau_L\leq\|ZO_x\|_{\mathfrak Z}^2
 \leq B_{{\rm out},q},                                 \tag{0.8}
\]

for every local negative unit vector.  This contradicts
`B_(out,q)=o(tau_L)` when `hC>1/2`.  The required completion geometry must
therefore mix sectors in the positive Hilbert metric; it cannot be a
block-orthogonal direct integral.

Section 7 states the exact missing object: a sector-resolving Krein
intertwiner from the ordered source features to the paired zero features,
together with its non-block-diagonal positive cross-sector Gram.  No such
intertwiner is currently constructed.  The twin model in Section 8 has
the same physical `Z`, `Sigma`, radical, local block, complete form, and
primitive absolute row magnitudes, but places the forced compensation in
the continuous remainder in one member and in the nonresonant ordered
prime frame in the other.  Thus the frozen Gram identities do not select
a sector sign.

This theorem proves no continuous one-sided bound, no nonresonant prime
frame sign, no complete central sign, no equation (5.2), no determinant
limit, and no RH statement.  The project state remains `P0_INVALIDATED`.

## 1. Frozen inputs

The following repository bytes are binding inputs.

| Dependency | SHA-256 |
|---|---|
| `notes/GROWING_TRANSITION_CONTINUOUS_ODD_LAPLACE_COMMON_REPRESENTATIVE_BARRIER.md` | `7e65dd6a5cf9035054f01bf52126e25e00635c0414f1a0dc69e70fc2e6ba6a74` |
| `tests/test_growing_transition_continuous_odd_laplace_common_representative_barrier.py` | `d3369b104aa2ebdfa685c2ae5d1529c55b1702d442b6dd81d5569294f42f1140` |
| `notes/GROWING_TRANSITION_ABSOLUTE_SAMPLING_FORCED_CANCELLATION_BARRIER.md` | `eb04692b7ce8e06efe254053ba93e4c5f2051ceffe47e68015c9e12886d77584` |
| `tests/test_growing_transition_absolute_sampling_forced_cancellation_barrier.py` | `3bb7d6c45bd0d4d1564624f7ab9f22532229d51dd51d71a474674081fd266a7b` |
| `notes/COMMON_RADICAL_LEAKAGE_GRAM_ORIENTATION_OBSTRUCTION.md` | `e589c3bce1174a94666364dea523f23e0828a2906338f36e81f05c8d25378816` |
| `tests/test_common_radical_leakage_gram_orientation.py` | `d897e662d05665930d3b651d0460dd14f84f8e143ed010c9e248c948a5ace417` |
| `notes/GROWING_TRANSITION_ORDERED_PRIME_RESONANCE_AND_NONRESONANT_FRAME_GATE_THEOREM.md` | `511abdb8dd5e9bfe765e518812f19ab8df351803438c0a731387f3dd8d413460` |
| `tests/test_growing_transition_ordered_prime_resonance_and_nonresonant_frame_gate_theorem.py` | `634ec6af8e27db305c22d305d12bdd650b834d947c8afa9a3d6dbf27120482b8` |

No zero list, prime-number theorem, new prolate datum, or external source
is used.

## 2. Pointwise radicality and the exact physical Gram blocks

For a corrected source `f`, the global arithmetic state has Mellin
transform

\[
 \widehat{\mathcal E(f)}(z)
 =\zeta\!\left({1\over2}-iz\right)m_f(z).             \tag{2.1}
\]

At a nontrivial-zero parameter and its paired conjugate parameter, the
zeta factor vanishes.  Inversion preserves the paired zero orbit, so the
same statement holds after the physical inversion symmetrization.  This
proves (0.3) pointwise, without assuming that any zero lies on the
critical line.

The distinction between the feature and source domains remains binding.
The pointwise map `Z` is defined by the paired Mellin evaluations.  The
source distribution

\[
 \mathcal W_Z=W_{0,2}-W_{\mathbb R}-W_p               \tag{2.2}
\]

is applied only on its admitted compact--exterior crosses.  Two-sided
source radicality gives

\[
 \mathcal W_Z(X,K)=\mathcal W_Z(K,X)=0,               \tag{2.3}
\]

but it does not license separate applications of the three terms in
(2.2) to arbitrary noncompact pairs.  In particular, (0.3) does not say
that the pole, Archimedean, and prime blocks are separately radical.

For a coefficient synthesis, linearity gives `Z_X=-mathcal Z` and
`Z_O=mathcal Z`.  Taking ordinary and `Sigma`-signed Grams proves (0.5).
Equivalently, with

\[
 \Pi_\parallel={I+\Sigma\over2},\qquad
 \Pi_{\rm anti}={I-\Sigma\over2},                    \tag{2.4}
\]

the total aligned and anti-aligned Grams are

\[
 A^\parallel={A+Q\over2},\qquad
 A^{\rm anti}={A-Q\over2}.                            \tag{2.5}
\]

Absolute sampling controls their sum `A`; the signed complete form is
their difference `Q`.  Equations (2.4)--(2.5) carry no continuous or prime
label.

## 3. The only canonical orthogonal decomposition of `Z`

Group the zero multiset into its functional-equation and conjugation
orbits.  The paired feature space has the canonical orthogonal sum

\[
 \mathfrak Z=\bigoplus_{\mathfrak o}
 \mathfrak Z_{\mathfrak o},\qquad
 Z=\bigoplus_{\mathfrak o}Z_{\mathfrak o},\qquad
 \Sigma=\bigoplus_{\mathfrak o}\Sigma_{\mathfrak o}, \tag{3.1}
\]

where each realified two-slot involution exchanges the paired slots, or
is `diag(I,-I)` after the fixed aligned/anti-aligned rotation.  This is a
decomposition by zero orbits.  It contains no canonical projection onto a
pole feature, an Archimedean feature, or a prime feature.

The explicit formula instead decomposes the signed scalar distribution
applied to a correlation.  Equality of that distribution with the zero
sum equates one indefinite pullback; it does not identify its summands
with mutually orthogonal subspaces of (3.1).

## 4. Exact finite-cutoff odd-Laplace Krein features

Put

\[
 J_\times=\begin{pmatrix}0&1\\1&0\end{pmatrix},
 \qquad J_\times^*=J_\times=J_\times^{-1}.             \tag{4.1}
\]

For row maps `U,V`, define `T_(U,V)x=(Ux,Vx)`.  Then

\[
 T_{U,V}^*J_\times T_{U,V}
 =U^*V+V^*U=\mathsf S(U,V).                            \tag{4.2}
\]

At fixed finite cutoff `M`, let

\[
 \mathcal R=\{0,3,5,\ldots\},\qquad
 \epsilon_0=-1,\qquad\epsilon_r=1\quad(r\geq3),       \tag{4.3}
\]

and define

\[
 \begin{aligned}
 \mathfrak H_{{\rm c},M}
 &=\bigoplus_{r\in\mathcal R}(\mathbb C\oplus\mathbb C),\\
 T_{{\rm c},M}x
 &=\bigoplus_{r\in\mathcal R}
   (\mathcal A_{M,r}x,\mathcal B_{M,r}x),\\
 J_{{\rm c},M}
 &=\bigoplus_{r\in\mathcal R}\epsilon_rJ_\times.
 \end{aligned}                                         \tag{4.4}
\]

The fixed-cutoff odd tower is square summable on every admitted finite
packet.  The `r=0` outward row retains its inherited improper or Abel
convention.  The exact common-representative identity is

\[
 \boxed{Q_{{\rm cont},M}
 =T_{{\rm c},M}^*J_{{\rm c},M}T_{{\rm c},M}.}          \tag{4.5}
\]

Writing `mathcal A=mathcal A^1+mathcal A^+` and
`mathcal B=mathcal B^1+mathcal B^+` gives, row by row,

\[
 \begin{aligned}
 R_{{\rm cont},M}
 =\sum_{r\in\mathcal R}\epsilon_r\{&
  (\mathcal A^1_{M,r})^*\mathcal B^+_{M,r}
 +(\mathcal A^+_{M,r})^*\mathcal B^1_{M,r}\\
 &+(\mathcal A^+_{M,r})^*\mathcal B^+_{M,r}
 +\operatorname {adjoint}\}.
 \end{aligned}                                         \tag{4.6}
\]

Thus even the continuous local/remainder split is not an orthogonal
restriction of (4.4): the remainder contains the two mixed source-slot
terms in (4.6).

The Hadamard rotation sends `J_times` to `diag(1,-1)` and rewrites each row
as a difference of the two positive Grams of

\[
 {U+V\over\sqrt2},\qquad {U-V\over\sqrt2}.             \tag{4.7}
\]

This aligned/anti-aligned source orientation is algebraically analogous
to (2.4), but no frozen identity equates the positive Grams in (4.7) with
those in (2.5).

## 5. Exact finite-cutoff ordered-prime direct integral

For `n>=2`, put

\[
 u_n=\max\{\lambda/n,\lambda^{-1}\},\qquad
 \mathcal H_n=L^2([u_n,\lambda],du).                  \tag{5.1}
\]

The exact inward and outward ordered maps are

\[
 \begin{aligned}
 (\mathcal A_{m,n}x)(u)&=\{f_x+H_x\}(mu),\\
 (\mathcal B_{ln,n}x)(u)&=H_x(lnu).
 \end{aligned}                                         \tag{5.2}
\]

Introduce a second, finite cutoff `R>=2` on the prime index and let
`Omega_(p,M,R)` be the disjoint union of these intervals over
`m,l` in the sampler support and `2<=n<=R`.  Absorb the complete
Hermitian coefficient into the finite measure

\[
 d\mu_{M,R}(m,n,l,u)
 ={1\over4}\omega_M(m)\Lambda(n)\omega_M(l)\,du.      \tag{5.3}
\]

Define the genuine finite Hilbert/Krein feature

\[
 \begin{aligned}
 \mathfrak H_{p,M,R}
 &=L^2(\Omega_{p,M,R},d\mu_{M,R};\mathbb C^2),\\
 (T_{p,M,R}x)(m,n,l,u)
 &=\bigl((\mathcal A_{m,n}x)(u),
         (\mathcal B_{ln,n}x)(u)\bigr),\\
 (J_{p,M,R}F)(\omega)&=J_\times F(\omega).
 \end{aligned}                                         \tag{5.4}
\]

Because the upper ordered prime form has coefficient `1/2` and
Hermitian averaging contributes another factor `1/2`, one obtains

\[
 \boxed{
 Q_{p,M,R}=T_{p,M,R}^*J_{p,M,R}T_{p,M,R}
 ={1\over4}\sum_{\substack{m,l\\2\leq n\leq R}}
 \omega_M(m)\Lambda(n)\omega_M(l)
 \mathsf S(\mathcal A_{m,n},\mathcal B_{ln,n}).}       \tag{5.5}
\]

The untruncated prime form is only the inherited signed source limit

\[
 \boxed{
 Q_{p,M}
 =\lim_{R\to\infty}^{\rm source/Abel}Q_{p,M,R}.}       \tag{5.6}
\]

This notation retains whatever source or Abel convention is required by
the admitted physical cross.  It does not assert convergence in a
positive feature norm.

Indeed, for `n>lambda^2` the lower endpoint has stabilized at
`u_n=lambda^(-1)`.  Hence, on the common interval,

\[
 \mathcal A_{m,n}x
 =\mathcal A_{m,\infty}x
 :=\{f_x+H_x\}(m\,\cdot),
 \qquad n>\lambda^2.                                   \tag{5.7}
\]

Fix sampler indices `m,l` with positive Fejer weights and a coefficient
vector for which this repeated inward row is nonzero.  The positive norm
of the finite feature satisfies

\[
 \begin{aligned}
 \|T_{p,M,R}x\|^2
 &\geq {1\over4}\omega_M(m)\omega_M(l)
 \|\mathcal A_{m,\infty}x\|_{L^2([\lambda^{-1},\lambda])}^2
 \sum_{\lambda^2<n\leq R}\Lambda(n)\\
 &\longrightarrow\infty .
 \end{aligned}                                         \tag{5.8}
\]

The last divergence needs no prime-number theorem: there are infinitely
many primes and every prime contributes its positive logarithm.  Thus the
raw ordered rows do not define an infinite-prime Hilbert map
`T_(p,M)` in general.  The signed cross form can converge while the sum
of the two positive row-square norms diverges.

Let `Q_(M,R)^up` denote the finite-`M` direct form with its complete
continuous line unchanged and only its prime index restricted to
`n<=R`.  At finite `M,R` one may combine (4.4) and (5.4):

\[
 \begin{aligned}
 \mathfrak H_{M,R}
 &=\mathfrak H_{{\rm c},M}\oplus\mathfrak H_{p,M,R},\\
 T_{M,R}&=T_{{\rm c},M}\oplus T_{p,M,R},\\
 J_{M,R}&=J_{{\rm c},M}\oplus J_{p,M,R},
 \end{aligned}
 \qquad
 \operatorname {Herm}Q_{M,R}^{\uparrow}
 =T_{M,R}^*J_{M,R}T_{M,R}.                            \tag{5.9}
\]

Restricting the finite prime atoms to `(m,l)!=(1,1)` gives the
truncated `Q_(p,ne11,M,R)`.  The resonance `ln=m` is a positive
Gram and remains `O(L^2)=o(tau_L)` after its signed source limit on the
realized fixed-row packet.  Restricting further to `ln ne m` gives the
unresolved ordered nonresonant cross form.

Equations (4.5), (5.5), and (5.9) prove the first line of (0.6).  The
binding order is now

1. fix `lambda` and finite cutoffs `M,R`;
2. form all rows and Hermitianize at those same cutoffs;
3. take `R to infinity` only in the inherited signed source/Abel form;
4. take the ordered limit `M to infinity` at fixed `lambda`; and
5. only then let `lambda to infinity`.

There is no finite-`M` pointwise relation to `Z`, because `K_M` is not
radical.  Equation (5.8) also rules out a positive direct-sum limit before
one even asks for an isometry to the physical zero feature.  Formula (0.6)
is exactly a nested signed cross-form identity and nothing stronger.

## 6. Orthogonal sector geometry is impossible above the threshold

Suppose, contrary to the claim, that the physical zero feature admitted a
`Sigma`-reducing orthogonal decomposition by explicit-form sectors,

\[
 \mathfrak Z=\mathfrak Z_0\oplus\mathfrak Z_{\mathbb R}
 \oplus\mathfrak Z_p,
 \qquad Z=Z_0\oplus Z_{\mathbb R}\oplus Z_p,           \tag{6.1}
\]

and that the sector signed Grams represented the pole, Archimedean, and
prime source blocks.  Since `ZK=0`, positivity of the orthogonal norm
would give

\[
 0=\|ZK\|^2=\|Z_0K\|^2+
 \|Z_{\mathbb R}K\|^2+\|Z_pK\|^2.                    \tag{6.2}
\]

Every term would vanish.  Thus all three explicit-form blocks would be
separately radical.  The frozen direct-source theorem supplies only the
combined pole--Archimedean--prime radical identity, so (6.1) is not a
consequence of the source formula.

There is a stronger contradiction for any orthogonal refinement which
represents the realized local block.  Work on the exact quotient by
`ker D`, let `x` be a `D`-white unit vector in the local negative packet,
and suppose an orthogonal component `Z_loc` satisfies

\[
 x^*Q_{\rm loc}x
 =\langle Z_{\rm loc}O_x,
       \Sigma_{\rm loc}Z_{\rm loc}O_x\rangle,
 \qquad x^*Q_{\rm loc}x\leq-\tau_L.                  \tag{6.3}
\]

Since `Sigma_loc` is an involution and `Z_loc` is an orthogonal component,

\[
 \tau_L\leq |x^*Q_{\rm loc}x|
 \leq\|Z_{\rm loc}O_x\|^2
 \leq\|ZO_x\|^2
 \leq B_{{\rm out},q}.                               \tag{6.4}
\]

For fixed `q` and local order `r`,

\[
 {B_{{\rm out},q}\over\tau_L}
 =c^{1/2-hC+o(1)}L^{2r}\longrightarrow0
 \qquad(hC>1/2).                                      \tag{6.5}
\]

Equations (6.4)--(6.5) are incompatible.  Therefore no Hilbert-orthogonal
or contractive sector embedding of the local packet into the physical
zero feature can exist in the forced-cancellation range.  The large
source sectors must cancel through nonorthogonal cross-sector geometry
before the small physical sampling feature is obtained.

## 7. Exact missing sector-mixing intertwiner

At finite `M,R`, (0.6) gives a source Krein realization.  After
`R to infinity`, (5.8) leaves only a signed cross form; it does not
produce an infinite-prime source Hilbert or Krein feature space.  Thus the
nested signed limit defines at most a formal isometric relation after an
additional completion or quotient has been constructed.  Such a relation
is the graph of a map only after a kernel compatibility theorem, and it
becomes useful for sector geometry only after its action on the individual
source generators is fixed.

The missing completion theorem can be stated precisely.  It would first
have to renormalize or quotient the divergent raw prime-square directions,
then construct a completed ordered source feature space
`(mathfrak H_src,J_src)`, a completed source map `T`, and a sector-mixing
operator

\[
 U_\lambda:\mathfrak H_{\rm src}\longrightarrow
 \mathfrak Z                                               \tag{7.1}
\]

such that, on the realized packet,

\[
 \boxed{
 U_\lambda T=\mathcal Z,
 \qquad
 T^*U_\lambda^*\Sigma U_\lambda T=T^*J_{\rm src}T.} \tag{7.2}
\]

A generator-level theorem would strengthen the second equality to
`U_lambda^* Sigma U_lambda=J_src` on the span of the continuous and
ordered-prime row generators.  It must also identify the positive Gram

\[
 \boxed{
 G_\lambda:=U_\lambda^*U_\lambda,
 \qquad
 T^*G_\lambda T=\mathcal Z^*\mathcal Z.}             \tag{7.3}
\]

Writing source sectors as `s,t`, the blocks

\[
 G_{\lambda;st}=U_{\lambda,s}^*U_{\lambda,t}          \tag{7.4}
\]

cannot vanish off the diagonal.  If they did, (7.3) would be an
orthogonal sector decomposition and Section 6 would apply.  Thus an
ordinary Hilbert isometry, a direct-sum partial isometry, or a theorem
which controls only the diagonal blocks of (7.4) cannot close the gate.
The divergent raw map `T_(p,M)` cannot itself serve as `T` in
(7.2)--(7.3).

To see the required geometry, suppose a valid theorem split the image as
`mathcal Z x=z_(loc)+z_(rest)` and represented the local signed block by
`z_(loc)`.  Equations (6.3) and absolute sampling would give

\[
 \|z_{\rm loc}\|^2\geq\tau_L,
 \qquad
 \|z_{\rm loc}+z_{\rm rest}\|^2\leq B_{{\rm out},q}. \tag{7.5}
\]

Consequently

\[
 {\|z_{\rm loc}+z_{\rm rest}\|
  \over\|z_{\rm loc}\|}
 \leq\sqrt{B_{{\rm out},q}/\tau_L}=o(1),             \tag{7.6}
\]

which is the desired near-antipodal Hilbert angle.  But (7.5) is not a
consequence of signed pullback equality: it presupposes the missing
sector-resolving map and its positive Gram.  Current absolute sampling
controls only the already-combined vector `mathcal Zx`.

## 8. Twin finite-dimensional countermodel

The following pair preserves the complete algebra frozen above while
changing which unresolved sector carries the compensation.  It is a
logical Gram model, not a physical Fourier-sampler construction.

Let the coefficient space be `mathbb R`, put

\[
 a={1\over\sqrt2},\qquad
 \mathsf S(u,v)=2uv,                                   \tag{8.1}
\]

and retain only one positive odd row, say `r=3`.  In both members take

\[
 A^1=a,\qquad B^1=-a,\qquad B^+=0.                  \tag{8.2}
\]

The local block is

\[
 Q_{\rm loc}=\mathsf S(A^1,B^1)=-1.                  \tag{8.3}
\]

In the continuous-canceller member `C`, choose `A^+=-a`.  The exact
remainder expansion (4.6) gives

\[
 R_{\rm cont}^{C}
 =\mathsf S(A^+,B^1)=+1,
 \qquad Q_{\rm cont}^{C}=0.                           \tag{8.4}
\]

In the prime-canceller member `P`, choose `A^+=+a`.  Then

\[
 R_{\rm cont}^{P}
 =\mathsf S(A^+,B^1)=-1,
 \qquad Q_{\rm cont}^{P}=-2.                          \tag{8.5}
\]

The primitive continuous row magnitudes are identical in the two members.

Now use two abstract nonresonant ordered-prime atoms, with the coefficient
`1/4` and their positive arithmetic weights absorbed into the displayed
row values.  In member `C`, take

\[
 (u_1,v_1)=(a,a),\qquad (u_2,v_2)=(a,-a),             \tag{8.6}
\]

so

\[
 Q_{p,{\rm off}}^{C}
 =\mathsf S(u_1,v_1)+\mathsf S(u_2,v_2)=0.            \tag{8.7}
\]

In member `P`, take

\[
 (u_1,v_1)=(a,a),\qquad (u_2,v_2)=(a,a),             \tag{8.8}
\]

so

\[
 Q_{p,{\rm off}}^{P}=2.                               \tag{8.9}
\]

Again every primitive prime row has the same absolute magnitude in the
two members.  Combining (8.3)--(8.9) gives

\[
 \boxed{
 Q_X^{C}=Q_X^{P}=0,\qquad
 Q_{\rm loc}^{C}=Q_{\rm loc}^{P}=-1,
 \qquad R_{\rm comp}^{C}=R_{\rm comp}^{P}=+1.}        \tag{8.10}
\]

The allocation differs:

\[
 (R_{\rm cont}^{C},Q_{p,{\rm off}}^{C})=(1,0),
 \qquad
 (R_{\rm cont}^{P},Q_{p,{\rm off}}^{P})=(-1,2).      \tag{8.11}
\]

Both members have the same physical paired feature.  For arbitrary
`epsilon>0`, let

\[
 \mathfrak Z=\mathbb R^2,\qquad
 \Sigma=\operatorname {diag}(1,-1),\qquad
 z=\sqrt{\epsilon/2}\,(1,1),                          \tag{8.12}
\]

and define on the physical span of `X,O`

\[
 ZO=z,\qquad ZX=-z,\qquad K=X+O.                    \tag{8.13}
\]

Then

\[
 ZK=0,\qquad \|ZO\|^2=\epsilon,\qquad
 \langle ZO,\Sigma ZO\rangle=0.                      \tag{8.14}
\]

Taking `epsilon` arbitrarily small reproduces the separation between the
absolute complete feature and the unit local scale.  The two members have
the same `Z`, `Sigma`, radical identity, complete signed form, local block,
and primitive absolute row data, but opposite conclusions about the
continuous remainder.  Therefore those data cannot prove a continuous or
prime sector sign.

The model is not asserted to satisfy the ordered Poisson/Mellin source
image, prolate modal placement, or the physical prime locations.  Those
are precisely the kinds of additional source-coupled information that a
theorem of the form (7.1)--(7.4) would have to use.

## 9. Exact surviving consequence

On the realized polylogarithmic packet, the small `(1,1)` prime shell and
the `O(L^2)` resonance estimate leave the strict combined conclusion

\[
 \boxed{
 P_E(\widehat R_{\rm cont}
       +\widehat Q_{p,{\rm off}})P_E
 \succeq(1-o(1))\tau_LP_E\qquad(hC>1/2).}            \tag{9.1}
\]

Equation (9.1) is already the maximal sector information supplied by the
global radical and absolute sampling.  It neither implies

\[
 P_E\widehat R_{\rm cont}P_E\succeq-o(\tau_L)P_E     \tag{9.2}
\]

nor the analogous one-sided assertion for the nonresonant prime frame.
The exact alternatives remain the completed continuous odd-Laplace
assembly and the ordered nonresonant prime assembly.  A new physical
sector-mixing intertwiner or a direct signed estimate for one of those
assemblies is still required.  No complete central sign or RH conclusion
follows.
