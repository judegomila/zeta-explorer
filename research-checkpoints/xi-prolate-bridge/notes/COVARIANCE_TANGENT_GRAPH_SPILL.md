# Covariance tangent graph spill and the central Fourier tail

## 0. Status and claim boundary

Claim class: `COVARIANCE_TANGENT_GRAPH_SPILL_REDUCTION`.

This note sharpens the covariance-weighted central reduction in
`notes/MELLIN_PROJECTION_SOFT_SYMBOL_REDUCTION.md` in four finite-dimensional
ways.

1. It identifies the least possible high-mode spill among all exact low-mode
   graph lifts.  The answer is an exact covariance-weighted tangent of the
   principal angles between the captured physical range and the low Fourier
   space.
2. It gives a source-metric sufficient condition which controls graph
   solvability and right-inverse growth in one relative ratio.
3. It replaces the generic Legendre operator-tail estimate in the
   covariance-weighted term by a direct central-band Fourier calculation.
   This reduces the sufficient low cutoff from quadratic scale in `lambda`
   to any scale `M` with `M/lambda -> infinity`.
4. It gives an exact countermodel showing that low row rank, or even a raw
   low coframe with unit floor, does not control graph spill.

The source-normalized prolate state, the factor `Xi/4`, the Fourier sign,
the inversion reflection, the inclusive prime-power endpoint, and the minus
sign on the prime block are unchanged.  No zeta-zero table and no form of
global Weil positivity is used.

This note does **not** prove the tangent estimate or the source-metric ratio
for the prescribed residue-separated arithmetic--prolate family on an
unbounded schedule.  It proves no exterior alignment, odd reserve, signed
sector floor, shifted-resolvent bound, equation (5.2) of
`DIRECT_RH_ATTACK.md`, locally uniform determinant convergence, or Riemann-
hypothesis conclusion.  The repository state remains `P0_INVALIDATED`.

## 1. Locked physical and covariance conventions

Put

\[
 L=2\log\lambda,
 \qquad I_\lambda=[-L/2,L/2],
 \qquad \lambda>1.                                      \tag{1.1}
\]

The physical interval carries Lebesgue measure.  Functions are extended by
zero, and

\[
 \widehat f(t)=\int_{I_\lambda}f(s)e^{-its}\,ds,
 \qquad d\nu(t)={dt\over2\pi}.                         \tag{1.2}
\]

The centered orthonormal Fourier basis is

\[
 \phi_n(s)=(-1)^nL^{-1/2}e^{i\omega_ns},
 \qquad \omega_n={2\pi n\over L}.                      \tag{1.3}
\]

Let `P_j` be the orthogonal projection onto the modes `|n|<=j`, and assume

\[
 1\leq M\leq N,
 \qquad S_{M,N}=P_N-P_M.                                \tag{1.4}
\]

Fix `0<delta<pi/2`, set

\[
 B_\delta=[-\delta/L,\delta/L],
 \qquad e_t(s)=e^{its},                                 \tag{1.5}
\]

and define on `X_N=ran(P_N)`

\[
 T_B=\int_{B_\delta}|P_Ne_t\rangle\langle P_Ne_t|
                         {dt\over2\pi}.                \tag{1.6}
\]

Thus `0<=T_B<=I` and

\[
 \operatorname {tr}T_B\leq{\delta\over\pi}.           \tag{1.7}
\]

Let `Q:C^r -> L^2(I_lambda)` be the isometry synthesizing the first `r`
orthonormal Legendre functions, and put

\[
 U=P_NQ,
 \qquad G=U^*U,
 \qquad C=U^*T_BU.                                     \tag{1.8}
\]

The locked projection-conditioning estimate gives

\[
 G\succeq(1-B_{r,N})I,
 \qquad
 B_{r,N}={2r^2\over\pi^2N}
       \exp\!\left({r(r-1)\over\pi N}\right).         \tag{1.9}
\]

Assume `B_(r,N)<1`, so `G` is invertible, and define

\[
 D=G^{-1}CG^{-1},
 \qquad V=\operatorname {ran}U,
 \qquad P_V=UG^{-1}U^*.                                \tag{1.10}
\]

Finally, let `W` be any physical synthesis into `X_N`, with

\[
 K=\operatorname {ran}W,
 \qquad P_K=W(W^*W)^\dagger W^*,
 \qquad P_H=I-P_K.                                     \tag{1.11}
\]

Redundant columns are allowed.  All conclusions below depend only on `K`,
unless a source-coordinate metric is introduced explicitly.

## 2. The exact covariance operator and its Fourier tail

### Lemma 2.1 (covariance operator identity)

With the definitions above,

\[
 \boxed{UDU^*=P_VT_BP_V.}                               \tag{2.1}
\]

Moreover, the total covariance mass satisfies the exact identity and bound

\[
 \boxed{
 \operatorname {tr}(DG)
 =\operatorname {tr}(T_BP_V)
 \leq\operatorname {tr}T_B
 \leq{\delta\over\pi}.}                               \tag{2.2}
\]

**Proof.**  Substitute `C=U^*T_BU` in (1.10):

\[
 UDU^*=UG^{-1}(U^*T_BU)G^{-1}U^*=P_VT_BP_V.
\]

Cyclicity of the finite trace gives

\[
 \operatorname {tr}(DG)
 =\operatorname {tr}(G^{-1}C)
 =\operatorname {tr}(T_BUG^{-1}U^*)
 =\operatorname {tr}(T_BP_V).
\]

Both `T_B` and `P_V` are positive contractions, which proves (2.2).
`square`

If `U` is represented with redundant columns, every inverse in this lemma
may be replaced by the Moore--Penrose inverse on `ran(G)`.  Equation (2.1)
is unchanged.  The present Legendre construction is injective by (1.9), so
ordinary inverses suffice here.

Define the covariance-weighted target shell

\[
 \eta_{M,N}=\|S_{M,N}UD^{1/2}\|_{\rm HS}.              \tag{2.3}
\]

Also retain the polynomial-feature tail

\[
 \tau_r=\|(I-P_V)T_B^{1/2}\|_{\rm HS}^2
 \leq{\delta\over\pi}
 { (\delta/2)^{2r}\over(2r+1)^2(r!)^2}.               \tag{2.4}
\]

### Lemma 2.2 (explicit full central Fourier tail)

Put

\[
 a_\delta={\delta\over2\pi}.
\]

For every `M>=1` and every `N>=M`,

\[
 H_{M,N}:=\|S_{M,N}T_B^{1/2}\|_{\rm HS}^2
 \leq \boxed{{\delta^3\over
              6\pi^3(M-a_\delta)}}.                   \tag{2.5}
\]

**Proof.**  Write `x=tL/2`.  Direct integration in the locked basis gives

\[
 |\langle\phi_n,e_t\rangle|^2
 ={L\sin^2x\over(x-\pi n)^2}.                          \tag{2.6}
\]

No Fourier-sign change is made in (2.6); the harmless phases `(-1)^n`
cancel in the modulus.  By (1.6), Tonelli's theorem, and positivity,

\[
\begin{aligned}
 H_{M,N}
 &=\int_{B_\delta}\|S_{M,N}e_t\|^2{dt\over2\pi}\\
 &\leq {1\over\pi}\int_{-\delta/2}^{\delta/2}
 \sin^2x\sum_{|n|>M}{dx\over(x-\pi n)^2}.             \tag{2.7}
\end{aligned}
\]

Since `|x|<=delta/2`, pairing `n` and `-n` gives

\[
 \sum_{|n|>M}{1\over(x-\pi n)^2}
 \leq{2\over\pi^2}
       \sum_{n=M+1}^\infty{1\over(n-a_\delta)^2}.      \tag{2.8}
\]

For `M>=1`, monotonicity and one elementary endpoint term give

\[
\begin{aligned}
 \sum_{n=M+1}^\infty{1\over(n-a_\delta)^2}
 &\leq {1\over(M+1-a_\delta)^2}
       +{1\over M+1-a_\delta}\\
 &\leq {1\over M-a_\delta}.                           \tag{2.9}
\end{aligned}
\]

Finally, `sin^2(x)<=x^2` and

\[
 \int_{-\delta/2}^{\delta/2}x^2\,dx={\delta^3\over12}
\]

turn (2.7)--(2.9) into (2.5).  `square`

### Theorem 2.3 (covariance tail sharpening)

One has

\[
 \boxed{
 \eta_{M,N}
 \leq
 \left({\delta^3\over6\pi^3(M-a_\delta)}\right)^{1/2}
 +\sqrt{\tau_r}.}                                      \tag{2.10}
\]

**Proof.**  Lemma 2.1 gives

\[
 \eta_{M,N}^2
 =\operatorname {tr}(S_{M,N}P_VT_BP_VS_{M,N})
 =\|S_{M,N}P_VT_B^{1/2}\|_{\rm HS}^2.                \tag{2.11}
\]

Use the exact decomposition

\[
 S_{M,N}P_VT_B^{1/2}
 =S_{M,N}T_B^{1/2}
  -S_{M,N}(I-P_V)T_B^{1/2}.                            \tag{2.12}
\]

The Hilbert--Schmidt triangle inequality, the contraction property of
`S_(M,N)`, (2.4), and Lemma 2.2 prove (2.10).  Neither `S_(M,N)` nor `P_V`
is assumed to commute with `T_B`.  `square`

## 3. The exact minimum graph spill

Let

\[
 \mathcal L_M=\operatorname {ran}P_M,
 \qquad A=P_M|_K:K\longrightarrow\mathcal L_M,
 \qquad R_M=AA^*=P_MP_KP_M|_{\mathcal L_M},            \tag{3.1}
\]

and put

\[
 U_M=P_MU.                                              \tag{3.2}
\]

The operator `R_M` is a positive contraction.  Let `P_R` denote the
orthogonal projector onto `ran(R_M)`.

### Theorem 3.1 (minimum covariance-tangent spill)

The low graph equation

\[
 P_MWY=U_M                                               \tag{3.3}
\]

is solvable if and only if

\[
 \operatorname {ran}U_M\subseteq\operatorname {ran}R_M.
                                                                  \tag{3.4}
\]

When (3.4) holds, the least possible covariance-weighted spill among every
solution of (3.3) is

\[
\boxed{
 \begin{aligned}
 \Gamma_{\min}^2
 &:=\inf_{Y:\,P_MWY=U_M}
   \|S_{M,N}WYD^{1/2}\|_{\rm HS}^2\\
 &=\operatorname {tr}\!\left(
 D U_M^*(R_M^\dagger-P_R)U_M\right).
 \end{aligned}}                                        \tag{3.5}
\]

Because `P_RU_M=U_M` under (3.4), the last factor may equivalently be
written `R_M^dagger-I` inside this quadratic form.  On an eigenvector of
`R_M` with eigenvalue `rho in (0,1]`, its multiplier is

\[
 {1\over\rho}-1={1-\rho\over\rho},                    \tag{3.6}
\]

the squared tangent of the corresponding principal angle.

**Proof.**  The ranges of `A` and `AA^*` agree, proving the equivalence of
(3.3)--(3.4).  For a physical target `z in ran(A)`, its unique minimum-norm
lift in `K` is `A^dagger z`.  Every other lift differs from it by a vector in
`ker(A)`, orthogonal to `ran(A^*)`.  Since `P_MA^dagger z=z`, orthogonality
of the low and shell Fourier spaces gives

\[
\begin{aligned}
 \|S_{M,N}A^\dagger z\|^2
 &=\|A^\dagger z\|^2-\|z\|^2\\
 &=\langle z,(R_M^\dagger-P_R)z\rangle.               \tag{3.7}
\end{aligned}
\]

The same orthogonal decomposition shows that adding any element of
`ker(A)` cannot decrease the shell norm.  Apply (3.7) to the columns of
`U_MD^(1/2)` and sum.  Every physical lift in `K` has coefficient
representatives through `W`, including when `W` has redundant columns.
This proves (3.5).  `square`

There is also a strictly weaker direct sine quantity which does not require
graph feasibility.  Namely,

\[
 \boxed{
 \Sigma_M:=\|P_HU_MD^{1/2}\|_{\rm HS}^2
 =\operatorname {tr}\!\left(
 D U_M^*(I-R_M)U_M\right).}                            \tag{3.7a}
\]

Indeed, `U_M` lies in the low Fourier space, so
`U_M^*P_KU_M=U_M^*P_MP_KP_MU_M`.  On the feasible range of Theorem 3.1,
scalar spectral calculus gives

\[
 P_R-R_M\preceq R_M^\dagger-P_R,                      \tag{3.7b}
\]

and hence `Sigma_M<=Gamma_min^2`.  Thus exact graph interpolation is a
sufficient route to central capture, not a necessary reformulation of it.

The exact weighted central loss from the preceding checkpoint is

\[
 \rho_B=\|P_HUD^{1/2}\|_{\rm HS}^2.                    \tag{3.8}
\]

For any graph lift with spill `Gamma`, equations (3.3) and `P_HWY=0` give

\[
 \sqrt{\rho_B}\leq\eta_{M,N}+\Gamma.                  \tag{3.9}
\]

Combining (2.10), (3.5), and (3.9) gives the optimized graph bound

\[
\boxed{
 \sqrt{\rho_B}\leq
 \left({\delta^3\over6\pi^3(M-a_\delta)}\right)^{1/2}
 +\sqrt{\tau_r}+\Gamma_{\min}.}                       \tag{3.10}
\]

The complete central complementary trace from the preceding covariance-tail
theorem therefore obeys

\[
\boxed{
 \sqrt{\operatorname {tr}(P_HT_BP_H)}\leq
 \left({\delta^3\over6\pi^3(M-a_\delta)}\right)^{1/2}
 +2\sqrt{\tau_r}+\Gamma_{\min}.}                      \tag{3.11}
\]

### Corollary 3.2 (near-isometry criterion)

Suppose (3.4) holds and, on the nonzero spectral range of `R_M`,

\[
 R_M\succeq(1-\varepsilon)P_R,
 \qquad 0\leq\varepsilon<1.                            \tag{3.12}
\]

Then

\[
 \boxed{
 \Gamma_{\min}^2
 \leq{\varepsilon\over1-\varepsilon}
       \operatorname {tr}(DU_M^*U_M)
 \leq{\varepsilon\over1-\varepsilon}{\delta\over\pi}.}
                                                                  \tag{3.13}
\]

**Proof.**  On the relevant range,
`R_M^dagger-I <= epsilon/(1-epsilon) I`.  Also
`U_M^*U_M<=U^*U=G`, so Lemma 2.1 gives

\[
 \operatorname {tr}(DU_M^*U_M)
 \leq\operatorname {tr}(DG)\leq\delta/\pi.
\]

Substitution in (3.5) proves (3.13).  `square`

A merely positive lower bound for `R_M` does not imply (3.13) at the
required scale.  The relevant low projection must be asymptotically
near-isometric in the covariance directions, or an equivalent relative
shell estimate must be supplied.

## 4. A source-metric sufficient condition

Let `mathcal C` be a finite source-coordinate space, let
`mathsf H=mathsf H^*>0` be any declared source metric, and regard

\[
 B=P_MW:\mathcal C\longrightarrow\mathcal L_M,
 \qquad E=S_{M,N}W:\mathcal C\longrightarrow X_N       \tag{4.1}
\]

as the low and shell synthesis maps.  Put

\[
 R_{\mathsf H}=B\mathsf H^{-1}B^*,
 \qquad
 P_{\mathsf H}=\mathbf 1_{(0,\infty)}(R_{\mathsf H}).  \tag{4.2}
\]

Assume, on the declared low target space, that

\[
 \operatorname {ran}U_M\subseteq\operatorname {ran}R_{\mathsf H},
 \qquad
 R_{\mathsf H}\succeq\gamma P_{\mathsf H},
 \qquad \gamma>0.                                      \tag{4.2a}
\]

and assume the relative shell bound

\[
 E^*E\preceq\epsilon\mathsf H,
 \qquad \epsilon\geq0.                                 \tag{4.3}
\]

### Theorem 4.1 (relative coframe-to-spill bound)

Under (4.2a)--(4.3), the explicit minimum-`mathsf H` graph lift

\[
 Y=\mathsf H^{-1}B^*
   R_{\mathsf H}^\dagger U_M                           \tag{4.4}
\]

satisfies (3.3) and

\[
 \boxed{
 \Gamma^2
 \leq{\epsilon\over\gamma}
       \operatorname {tr}(DU_M^*U_M)
 \leq{\epsilon\over\gamma}{\delta\over\pi}.}        \tag{4.5}
\]

The strict positive floor in (4.2a) is mandatory.

**Proof.**  Equation (4.2a) makes (4.4) well-defined and gives
`BY=R_(mathsf H)R_(mathsf H)^dagger U_M=U_M`.
Moreover,

\[
 Y^*\mathsf H Y
 =U_M^*R_{\mathsf H}^\dagger U_M
 \preceq\gamma^{-1}U_M^*U_M.                           \tag{4.6}
\]

Use (4.3), multiply by `D^(1/2)`, take the trace, and apply (2.2).  This
proves (4.5).  `square`

The useful asymptotic hypothesis isolated by this theorem is

\[
 \boxed{{\epsilon_\lambda\over\gamma_\lambda}
        =o(\lambda^{-1}).}                              \tag{4.7}
\]

It simultaneously controls low graph solvability and the norm of the chosen
right inverse.  Neither factor may be omitted.

### Corollary 4.2 (periodic-BV source criterion)

Suppose `W=P_N widetilde W` and the declared metric satisfies, for every
source coefficient vector `y`,

\[
 \operatorname {TV}_{\rm per}(\widetilde Wy)^2
 \leq V_\lambda\,\langle y,\mathsf H y\rangle.         \tag{4.8}
\]

Then the periodic Fourier-tail inequality gives

\[
 E^*E\preceq{LV_\lambda\over2\pi^2M}\mathsf H.       \tag{4.9}
\]

Consequently

\[
 \boxed{
 \Gamma^2\leq
 {\delta L V_\lambda\over
  2\pi^3M\gamma_\lambda}.}                            \tag{4.10}
\]

In this formulation the single sufficient source estimate is

\[
 \boxed{
 {V_\lambda\over\gamma_\lambda}
 =o\!\left({M\over\lambda L}\right).}                \tag{4.11}
\]

This is the conditioned version of the columnwise BV target.  A variation
bound without the low source-metric coframe floor does not control the graph
solution selected by interpolation.

### 4.1 What the existing uniform variation fallback would require

For a one-residue transition block, the already locked uniform estimate has
the explicit form

\[
 V_\lambda^{\rm old}={qV_*(\lambda)^2\over d_{\rm LS}},
 \qquad
 V_*(\lambda)=368\pi^3\lambda^7+108\pi\lambda^2,      \tag{4.12}
\]

\[
 d_{\rm LS}=6\,96^{-5-(320\pi/\log2)\lambda^2}.       \tag{4.13}
\]

Here `q` is the modal-row count and the source metric is the corresponding
positive prolate-defect form.  Substitution in (4.10) gives the fully
explicit fallback

\[
 \Gamma^2\leq
 {\delta LqV_*(\lambda)^2\over
  2\pi^3M d_{\rm LS}\gamma_\lambda}.                  \tag{4.14}
\]

Thus this fallback would close the graph spill only if the matching
defect-weighted low coframe satisfied

\[
 \boxed{
 {qV_*(\lambda)^2\over d_{\rm LS}\gamma_\lambda}
 =o\!\left({M\over\lambda L}\right).}                \tag{4.15}
\]

No current theorem supplies such a `gamma_lambda` for the prescribed low
map.  In particular, the exponentially costly all-index variation constant
cannot be combined with row rank alone.  Equation (4.15) is an audit of the
available fallback, not evidence that the actual optimized tangent has that
size.

## 5. A smaller sufficient cutoff

Take

\[
 r=\left\lceil{cL\over\log L}\right\rceil,
 \qquad c>{1\over4}.                                    \tag{5.1}
\]

The locked factorial estimate gives

\[
 \tau_r=\lambda^{-4c+o(1)},
 \qquad \sqrt{\tau_r}=o(\lambda^{-1/2}).               \tag{5.2}
\]

Now choose

\[
 \boxed{M(\lambda)=\lceil\lambda L\rceil}             \tag{5.3}
\]

and any `N(lambda)>=M(lambda)`.  Lemma 2.2 gives

\[
 H_{M,N}=O((\lambda L)^{-1})=o(\lambda^{-1}),          \tag{5.4}
\]

while

\[
 B_{r,N}\leq B_{r,M}
 =O\!\left({L\over\lambda(\log L)^2}\right)=o(1).    \tag{5.5}
\]

Thus `U` is injective for all sufficiently large `lambda`, and every term
in (3.11) other than `Gamma_min` is `o(lambda^(-1/2))`.  Therefore

\[
 \boxed{
 \Gamma_{\min}=o(\lambda^{-1/2})
 \quad\Longrightarrow\quad
 \operatorname {tr}(P_HT_BP_H)=o(\lambda^{-1}).}      \tag{5.6}
\]

The same conclusion follows from (4.7).  More generally, any integer
schedule with

\[
 {M(\lambda)\over\lambda}\longrightarrow\infty,
 \qquad N(\lambda)\geq M(\lambda),                    \tag{5.7}
\]

works in the covariance Fourier-tail estimate.  In particular, the graph
argument is compatible with a larger polynomial or exponential `N`; it does
not require `N=3ceil(lambda^2)`.

The cutoff (5.3) also dominates the distinguished-state Mellin projection
cutoff `N_star=O(L^2)` eventually.  Orthogonal monotonicity therefore retains
the already proved weighted projection limit.  Since `lambda*L=o(lambda^2)`,
an `O(lambda^2)` source inventory has no column-count obstruction at this
smaller physical cutoff.  A count surplus is not a rank, near-isometry, or
spill theorem.

## 6. Exact obstruction and an existential separation

### 6.1 Low interpolation can have arbitrarily large spill

Let `X=R^2`,

\[
 P_M=|e_0\rangle\langle e_0|,
 \qquad U=e_0,
 \qquad D=1,                                            \tag{6.1}
\]

and, for any positive rational `A`, let

\[
 W=e_0+A e_1,
 \qquad K=\operatorname {span}(W).                     \tag{6.2}
\]

The low synthesis is exactly `P_MW=e_0`, so its raw one-dimensional coframe
floor is one and the graph equation has the unique solution `Y=1`.  Yet

\[
 \boxed{\Gamma^2=A^2.}                                 \tag{6.3}
\]

The physical low compression is

\[
 R_M={1\over1+A^2},                                    \tag{6.4}
\]

and Theorem 3.1 gives

\[
 R_M^{-1}-1=A^2                                        \tag{6.5}
\]

exactly.  Thus graph solvability, column count, and an unweighted raw low
coframe do not control spill.  The relative shell-to-metric quantity in
(4.7), or the covariance tangent in (3.5), is indispensable.

### 6.2 Arbitrary mixed prefixes have no abstract central obstruction

The already proved full-source theorem says that, at each fixed `lambda`,
fixed finite `N`, and fixed inversion parity, some finite mixed all-even
zero-integral prolate prefix spans the entire declared physical space
`X_N`.  For that non-effective prefix,

\[
 K=X_N,
 \qquad R_M=I_{\mathcal L_M},
 \qquad \Gamma_{\min}=0.                               \tag{6.6}
\]

This proves that there is no abstract finite-dimensional central obstruction
when an arbitrary mixed prefix is allowed.  It does not solve the project
obligation: the prefix has no effective terminal label, mixes the two source
residue classes, and turns the declared low range into the whole finite
sector.  It supplies neither the prescribed source-whitened signed comparison
nor an asymptotic reserve.

## 7. Smallest remaining central hypothesis

For the actual prescribed arithmetic--prolate range on one common unbounded
schedule, the exact graph target is

\[
 \boxed{
 \operatorname {tr}\!\left(
 D U_M^*(R_M^\dagger-P_R)U_M\right)=o(\lambda^{-1}),} \tag{7.1}
\]

together with the feasibility condition (3.4).  A source-reconstructible
sufficient replacement is the single ratio (4.7), or the BV/coframe ratio
(4.11).

These targets are strictly stronger than low row rank and strictly weaker
than demanding a uniform near-isometry in directions carrying negligible
central covariance.  No existing source lock proves any of them for the
prescribed family.  Even if (7.1) is proved, the exterior, odd, signed-floor,
and shifted-resolvent obligations in equation (5.2) remain separate.
