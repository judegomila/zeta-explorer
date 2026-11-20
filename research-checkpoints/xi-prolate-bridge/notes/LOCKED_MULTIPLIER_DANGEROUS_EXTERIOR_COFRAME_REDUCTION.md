# Locked multiplier-dangerous exterior-coframe reduction

## 0. Claim boundary and outcome

This note combines two already source-locked constructions without replacing
the signed arithmetic by a magnitude model:

1. the complete real-axis multiplier separates a positive high block by an
   exact weighted-concentration projector; and
2. the arbitrary-vector Mobius radical lift represents the resulting Schur
   complement by one canonical exterior-tail operator.

The resulting retained dimension is `exp(O(lambda))` on the locked schedule,
instead of the `exp(O(lambda*log(lambda)))` raw-Fourier window in
`notes/LOCKED_ROTATED_HIGH_GRAPH_SCHUR_REDUCTION.md`.  The finite rank bound
uses the pinned Fiori--Kadiri--Swidinsky estimate only as an upper bound for
the size of the exact dangerous space.  It is not used to orient the Schur
complement.  The remaining lower bound is still a signed exterior coframe for
the actual complete source operator.

No zero table, zero reality, global Weil positivity, or stored matrix
eigenvector is used.  This note proves neither the retained signed lower
bound, either full shifted sector sign, equation (5.2) of
`DIRECT_RH_ATTACK.md`, locally uniform determinant convergence, nor the
Riemann hypothesis.  The formal project state remains `P0_INVALIDATED`.

## 1. Exact complete-symbol dangerous space

Put

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},
 \qquad N=2^{2400p^2},\qquad L=2\log\lambda,          \tag{1.1}
\]

and let

\[
 V=E_N^+,
 \qquad \kappa={P_Nk_\lambda^+\over\|P_Nk_\lambda^+\|},
 \qquad K=V\cap\kappa^\perp.                         \tag{1.2}
\]

The denominator in (1.2) is nonzero for all sufficiently large locked
parameters by the projected-state norm theorem.  Let `U>=0` be the admitted
live upper shift and define

\[
 B=\left.P_K(Q_\lambda-U I)P_K\right|_K.             \tag{1.3}
\]

Retain the source-exact multiplier

\[
 m_\lambda(t)=
 \operatorname {Re}\psi\!\left({1\over4}+{it\over2}\right)-\log\pi
 -2\sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n}
                       \cos(t\log n).                \tag{1.4}
\]

The endpoint in (1.4) is inclusive and the prime block has the source minus
sign.  For any finite parameters

\[
 g>\delta>0,                                          \tag{1.5}
\]

put

\[
 v_{\lambda,U,g}(t)=[g+U-m_\lambda(t)]_+              \tag{1.6}
\]

and let `T_v` be its zero-extension Fourier concentration operator on
`L^2([-log(lambda),log(lambda)])`.  Thus

\[
 T_v=C_\lambda^*\mathcal F^*M_v\mathcal F C_\lambda\succeq0.
                                                               \tag{1.7}
\]

The exact complete-symbol decomposition in
`notes/PARITY_MULTIPLIER_SCHUR_REDUCTION.md` gives, on the even sector,

\[
 Q_\lambda-U I
 =gI+T_a-T_v+2|p_+\rangle\langle p_+|,              \tag{1.8}
\]

where `T_a>=0`.  In particular, with

\[
 R=P_KT_vP_K|_K,\qquad
 \Pi=1_{[g-\delta,\infty)}(R),                       \tag{1.9}
\]

define

\[
 \mathcal Y=\operatorname {Ran}\Pi,
 \qquad \mathcal F=K\ominus\mathcal Y.              \tag{1.10}
\]

The letter `mathcal F` in (1.10) denotes a subspace, not the Fourier
transform in (1.7).

### Theorem 1.1 (exact high floor and retained-rank bound)

Relative to `K=mathcal Y direct-sum mathcal F`, write

\[
 B=\begin{bmatrix}D&\Gamma^*\\ \Gamma&H\end{bmatrix}.
                                                               \tag{1.11}
\]

Then

\[
 \boxed{H\succeq\delta I_{\mathcal F}}               \tag{1.12}
\]

and

\[
 \boxed{
 \dim\mathcal Y\leq
 {L\,\Phi_\lambda(U,g)\over2\pi(g-\delta)},
 \qquad
 \Phi_\lambda(U,g)=
 \int_{\mathbb R}[g+U-m_\lambda(t)]_+\,dt.}          \tag{1.13}
\]

Both statements are uniform in the much larger outer cutoff `N`.

**Proof.**  Compression of (1.8) gives

\[
 B\succeq gI_K-R.                                     \tag{1.14}
\]

The spectrum of `R` on `mathcal F` is contained in
`[0,g-delta)`, so (1.12) follows.  Since `R>=0`, the min--max principle,
compression monotonicity of the trace, and the exact concentration trace
give

\[
 (g-\delta)\dim\mathcal Y
 \leq\operatorname {tr}R
 \leq\operatorname {tr}T_v
 ={L\over2\pi}\Phi_\lambda(U,g),                    \tag{1.15}
\]

which is (1.13).  The positive pole and `T_a` were retained in (1.8); they
were not estimated by separate block norms.  \(\square\)

Because `H>0`, define

\[
 \mathscr S=H^{-1}\Gamma,
 \qquad
 \Sigma=D-\Gamma^*H^{-1}\Gamma.                    \tag{1.16}
\]

The exact shear congruence gives

\[
 \boxed{B\succ0\quad\Longleftrightarrow\quad\Sigma\succ0.}
                                                               \tag{1.17}
\]

Unlike the raw-Fourier construction, no tail estimate for `kappa` and no
rank-one rotation are needed to obtain (1.12).

## 2. Fully explicit `exp(O(lambda))` cost

Let

\[
 \Sigma_\lambda=
 \sum_{1<n\leq\lambda^2}{\Lambda(n)\over\sqrt n},
 \qquad
 A_\lambda(U,g)=g+U+2\Sigma_\lambda
                       -\psi(1/4)+\log\pi.             \tag{2.1}
\]

The exact digamma comparison gives the finite bound

\[
 \Phi_\lambda(U,g)\leq
 \begin{cases}
 0,&A_\lambda(U,g)\leq0,\\[2mm]
 \sqrt{e^{2A_\lambda(U,g)}-1}
  -\arctan\sqrt{e^{2A_\lambda(U,g)}-1},&A_\lambda(U,g)>0.
 \end{cases}                                             \tag{2.2}
\]

There is no unspecified finite constant in (2.2).  With the exact decimals
pinned to the vendored Fiori--Kadiri--Swidinsky v3 source in
`P3_SOURCE_LOCK.json`, set

\[
 C_\psi=1+9.22022
       \left({3\over0.8476836}\right)^3e^{-3}.          \tag{2.3}
\]

The all-range Chebyshev estimate and Stieltjes partial summation give

\[
 \boxed{\Sigma_\lambda\leq C_\psi(2\lambda-1).}        \tag{2.4}
\]

Choose, for example,

\[
 g=1,\qquad\delta={1\over2}.                            \tag{2.5}
\]

For every finite locked parameter, (1.13) and (2.2) are the binding rank
bound.  On any tail of the admitted schedule on which `0<=U<=1`, equations
(2.1)--(2.5) also give the simple displayed majorant

\[
 \boxed{
 \dim\mathcal Y
 \leq {L\over\pi}
 \exp\!\left(
  4C_\psi\lambda+2-2C_\psi-\psi(1/4)+\log\pi
       \right).}                                      \tag{2.6}
\]

Indeed the second line of (2.2) is at most `exp(A_lambda(U,1))`.
Consequently

\[
 \boxed{\dim\mathcal Y=\exp(O(\lambda))}              \tag{2.7}
\]

on the locked schedule.  The exact projector (1.9), not the envelope in
(2.6), defines the retained space.  Thus the magnitude estimate in this
section supplies only a rigorous finite cost bound; it proves no sign.

## 3. Sampling return through the exact harmonic lift

Let `mathsf Z` be the paired zero-sampling analysis on `K`, with blocks
`[mathsf Z_Y,mathsf Z_F]`.  The compact-window absolute-sampling theorem and
(1.12) imply

\[
 \boxed{
 \|\mathsf Z_FH^{-1}\|
 \leq{\sqrt{B_{\rm abs}(\lambda,N)}\over\delta}.}      \tag{3.1}
\]

For the choice (2.5), the locked-schedule reading is

\[
 \|\mathsf Z_FH^{-1}\|
 =O\!\left(\lambda^{3/2}(1+\log\lambda)\right),       \tag{3.2}
\]

which is negligible relative to the required graph scale
`lambda^2*polylog(lambda)^(1/2)/sqrt(d_8)`.

Let `K_L` and `Delta_L>0` be the admitted low physical range and quotient
metric, and put

\[
 \Delta=\Delta_L\oplus I_{K\ominus K_L}.              \tag{3.3}
\]

For `sigma>=0`, define

\[
 \mathscr S_\sigma=(H+\sigma I)^{-1}\Gamma,
 \qquad
 \mathsf E_\sigma y=(y,-\mathscr S_\sigma y),          \tag{3.4}
\]

\[
 \Sigma_\sigma
 =D+\sigma I-\Gamma^*(H+\sigma I)^{-1}\Gamma,
 \qquad
 \mathcal D_\sigma
 =(\mathsf E_\sigma^*\Delta^2\mathsf E_\sigma)^{1/2}.
                                                               \tag{3.5}
\]

As before, the far-return row is

\[
 \mathsf Z_{\rm eff,\sigma}
 =\mathsf Z_Y-\mathsf Z_F\mathscr S_\sigma
 =\mathsf Z\mathsf E_\sigma.                         \tag{3.6}
\]

The positive quotient estimate therefore retains all cross cancellation:

\[
 \boxed{
 \|\mathsf Z_{\rm eff,\sigma}\mathcal D_\sigma^{-1}\|
 \leq\|\mathsf Z\Delta^{-1}\|.}                    \tag{3.7}
\]

No norm of `mathscr S_sigma` enters (3.7).

## 4. Canonical exterior operator on the smaller space

For every `v in V`, use the finite Mobius lift, invisible central-hole
correction, global arithmetic transform, and inversion projection of
Theorem 8.1 in
`notes/LOCKED_ROTATED_HIGH_GRAPH_SCHUR_REDUCTION.md`.  Denote the resulting
global radical by `K_v` and its purely exterior remainder by

\[
 R_v=K_v-v.                                             \tag{4.1}
\]

At both Mellin evaluations belonging to every nontrivial zero, one has
`R_v=-v`.  The compact-BV transforms give an absolutely convergent polarized
zero sum.  Hence the operator

\[
 T_{\rm ext}^{\mathcal Y}:V\longrightarrow\mathcal Y,
 \qquad
 \langle u,T_{\rm ext}^{\mathcal Y}v\rangle
 =\mathcal W_Z(u,R_v)\quad(u\in\mathcal Y)            \tag{4.2}
\]

is independent of the chosen radical representative and satisfies

\[
 \boxed{T_{\rm ext}^{\mathcal Y}=-P_{\mathcal Y}Q_\lambda|_V.}
                                                               \tag{4.3}
\]

Thus this construction does not replace the source matrix by zero data; it
re-expresses its complete signed action through a canonical exterior tail.

Block multiplication and (4.3) give the exact identity

\[
 \boxed{
 \Sigma_\sigma
 = (\sigma-U)I_{\mathcal Y}
   -T_{\rm ext}^{\mathcal Y}\mathsf E_\sigma.}         \tag{4.4}
\]

Every pole, archimedean, and prime contribution remains combined inside
`T_ext^mathcal Y`.

## 5. The reduced sharp coframe constant

Define

\[
 \boxed{
 \beta_\lambda^{\rm mv}
 =\inf_{\substack{\sigma\geq0\\y\in\mathcal Y\setminus\{0\}}}
 {\|(\sigma-U)y-
       T_{\rm ext}^{\mathcal Y}\mathsf E_\sigma y\|
  \over
  \|\Delta\mathsf E_\sigma y\|}.}                   \tag{5.1}
\]

The superscript `mv` means multiplier-dangerous; it is not a new
normalization.  If `mathcal Y={0}`, the infimum in (5.1) is assigned the
value `+infinity`.

### Theorem 5.1 (sharp reduced criterion)

For every sufficiently large fixed locked parameter,

\[
 \boxed{
 \beta_\lambda^{\rm mv}>0
 \quad\Longleftrightarrow\quad B\succ0,}              \tag{5.2}
\]

and

\[
 \boxed{
 (\beta_\lambda^{\rm mv})^{-1}
 =\sup_{\sigma\geq0}
   \|\Delta(B+\sigma I)^{-1}i_{\mathcal Y}\|,}       \tag{5.3}
\]

where `i_mathcalY:mathcal Y->K` is inclusion and a singular inverse is
assigned the extended value `+infinity`.

**Proof.**  If `mathcal Y={0}`, then `B=H>=delta I`, while the right side of
(5.3) is zero, so both assertions follow.  Assume henceforth that
`mathcal Y` is nonzero.  Equations (3.4)--(3.5) give

\[
 (B+\sigma I)\mathsf E_\sigma=i_{\mathcal Y}\Sigma_\sigma,
 \qquad
 (B+\sigma I)^{-1}i_{\mathcal Y}
 =\mathsf E_\sigma\Sigma_\sigma^{-1}                 \tag{5.4}
\]

whenever the inverses exist.  Together with (4.4), this proves (5.3) and
identifies the optimal coframe constant.

If `B>0`, every `Sigma_sigma` is positive.  The quotient in (5.1) has a
positive minimum on each compact `sigma` interval.  Write
`gamma=||Gamma||` and `d=||D||`.  The high floor (1.12) gives, for every
`sigma>=0`,

\[
 \|\mathscr S_\sigma\|\leq{\gamma\over\sigma+\delta},
 \qquad
 \lambda_{\min}(\Sigma_\sigma)
 \geq\sigma-d-{\gamma^2\over\sigma+\delta}.          \tag{5.4a}
\]

Therefore, whenever the numerator on the right is positive, the generalized
minimum in (5.1) is at least

\[
 {\sigma-d-\gamma^2/(\sigma+\delta)
  \over
  \|\Delta\|\sqrt{1+\gamma^2/(\sigma+\delta)^2}},     \tag{5.4b}
\]

which tends to infinity with `sigma`.
Hence `beta_lambda^mv>0`.  If `B` is not positive, set
`sigma_0=max(0,-lambda_min(B))`.  Then `B+sigma_0 I` is singular, whereas
`H+sigma_0 I>0`; Schur elimination makes `Sigma_(sigma_0)` singular and
forces `beta_lambda^mv=0`.  \(\square\)

At `sigma=0`, equations (5.3)--(5.4) give the exact endpoint bound

\[
 \|\mathcal D_0\Sigma_0^{-1}\|
 =\|\Delta\mathsf E_0\Sigma_0^{-1}\|
 \leq (\beta_\lambda^{\rm mv})^{-1}.                 \tag{5.4c}
\]

Consequently the cancellation-preserving factorization

\[
 \mathsf Z_{\rm eff,0}\Sigma_0^{-1}
 = (\mathsf Z_{\rm eff,0}\mathcal D_0^{-1})
   (\mathcal D_0\Sigma_0^{-1})                       \tag{5.4d}
\]

together with (3.1), (3.7), and the same positive-sampling estimate used in
the raw-Fourier reduction shows that the complete even graph target follows
from

\[
 \boxed{
 \beta_\lambda^{\rm mv}
 \gg {1\over\sqrt\lambda\operatorname {polylog}(\lambda)}.}
                                                               \tag{5.5}
\]

Equation (5.5) is not proved.  Its advantage over the earlier exterior
coframe target is solely that the exact signed inf--sup now lives on a space
with the finite rank bound (1.13) and the locked-schedule cost (2.7).

## 6. Exact remaining arithmetic statement

Using (4.3), the numerator in (5.1) can equivalently be assembled from the
source-normalized finite matrix.  Using the weighted-PNT normal form, it can
also be written without separating the cancellation as

\[
 (c_*+\sigma-U)y
 +P_{\mathcal Y}A_{\rm tail}\mathsf E_\sigma y
 -P_{\mathcal Y}T_D\mathsf E_\sigma y.                \tag{6.1}
\]

The last two terms in (6.1) must remain combined.  A magnitude envelope for
`D_lambda` proves neither the sign in (5.2) nor the quantitative floor in
(5.5).  Conversely, the exact multiplier projector used to define
`mathcal Y` is allowed to exploit the source trigonometric phases before the
exterior-coframe problem is posed.

More explicitly, put

\[
 C_{u,w}(t)=\langle u,K_tw\rangle.
\]

Since `D_lambda(0)=0` and `C_(u,w)(L)=0`, exact Stieltjes integration by
parts in (6.1) gives the source-specific remaining inf--sup

\[
\boxed{
\begin{aligned}
 \beta_\lambda^{\rm mv}
 =\inf_{\substack{\sigma\geq0\\y\in\mathcal Y\setminus\{0\}}}
  \sup_{\substack{u\in\mathcal Y\\\|u\|=1}}
 {1\over\|\Delta\mathsf E_\sigma y\|}
 \Bigg|{}&(c_*+\sigma-U)\langle u,y\rangle
 +\mathfrak a_{\rm tail}(u,\mathsf E_\sigma y)\\
 &+\int_0^L D_\lambda(t)
       {d\over dt}C_{u,\mathsf E_\sigma y}(t)\,dt
 \Bigg|.
\end{aligned}}                                           \tag{6.2}
\]

The integral has a plus sign.  The inclusive prime-power inventory through
`lambda^2` remains mandatory even though the endpoint translation vanishes.
Proving that (6.2) is bounded below as in (5.5), for the actual discrepancy
and actual dangerous projector, is the strongest reduced source-specific
inequality left by this argument.

This limitation has an exact countermodel.  Set the signed weighted-PNT
discrepancy to zero while retaining the continuous main density and the
archimedean tail.  Then

\[
 Q_\lambda^{\rm cont}=c_*I+A_{\rm tail},
 \qquad c_*=4-\gamma_E-\frac\pi2-3\log2-\log\pi<-1.   \tag{6.3}
\]

Equations (6.2)--(6.6) of
`notes/LOCKED_ROTATED_HIGH_GRAPH_SCHUR_REDUCTION.md` prove that, for every
fixed `m`, this comparison form is negative definite on the first `m` even
Fourier modes for all sufficiently large locked parameters.  Intersecting
with `kappa^perp` removes at most one of those directions.  If the
complete-symbol projector construction of Section 1 is repeated for this
comparison form, its far block is positive by Theorem 1.1, so all remaining
negative inertia is transferred to its dangerous Schur complement by the
exact shear congruence (1.17).  Theorem 5.1 then gives

\[
 \beta_{\lambda,\rm cont}^{\rm mv}=0.                \tag{6.4}
\]

The zero discrepancy satisfies every upper bound involving only its
magnitude.  Thus no such phase-blind hypothesis can imply `B>0`
(equivalently `beta_lambda^mv>0`) or (5.5); the actual signed arithmetic
orientation in (6.1) is indispensable.

Thus the reduced unresolved theorem is: prove (5.5) for the actual operator
in (6.1), on the exact source-defined dangerous space (1.9), along one
unbounded locked schedule.  The reduction changes the honest finite cost,
not the mathematical claim.
