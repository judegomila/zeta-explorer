# Locked rotated-high graph--Schur reduction

## 0. Claim boundary and outcome

This note replaces the half-power far split by the honest high-coercivity
cutoff itself.  The normalized projected comparison state has an explicit
Fourier tail, so its orthogonal complement is a small rank-one rotation of
the raw high Fourier space.  Rotating that raw high space into the even
complement gives

1. a retained block of dimension `exp(O(lambda*log(lambda)))`, rather than
   `sqrt(N)`;
2. a high floor `2*c_lambda+1-o(1)` and Schur shear at most `1/2+o(1)`;
3. a far sampling inverse of size `O(sqrt(lambda))`; and
4. one cancellation-preserving all-shift inverse inequality which would
   prove both the retained sign and the graph estimate.

The last inequality is not proved.  The exact weighted-PNT normal form also
shows that no argument using the arithmetic discrepancy only through an
absolute envelope can prove it: the zero-discrepancy comparison has
unbounded negative index.

No zero table or global Weil positivity is used.  This note proves neither
shifted sector sign, equation (5.2) of `DIRECT_RH_ATTACK.md`, locally uniform
determinant convergence, nor the Riemann hypothesis.  The formal project
state remains `P0_INVALIDATED`.

## 1. Locked state and honest cutoff

Put

\[
 \lambda={p\over2},\qquad p\geq5\text{ odd},
 \qquad N=2^{2400p^2}=2^{9600\lambda^2},              \tag{1.1}
\]

and let `p_lambda,N=P_N k_lambda^+` be the exact projected,
source-normalized even comparison state.  For all sufficiently large locked
parameters, write

\[
 a_{\lambda,N}=\|p_{\lambda,N}\|>0,
 \qquad \kappa={p_{\lambda,N}\over a_{\lambda,N}},
 \qquad K=E_N^+\cap\kappa^\perp.                       \tag{1.2}
\]

Let `U=U_Z=o(d_6)` be the admitted nonnegative live upper shift and put

\[
 B=\left.P_K(Q_+-UI)P_K\right|_K.                     \tag{1.3}
\]

Use the exact cutoff of `notes/HIGH_FOURIER_COERCIVITY.md` with the larger
declared high floor

\[
 \boxed{
 M=M_*\bigl(\lambda,U,2c_\lambda+1\bigr).}            \tag{1.4}
\]

The displayed source constants give

\[
 \log M=C_a(\lambda)+3c_\lambda+O(1)
        =O(\lambda\log\lambda),
 \qquad M<N                                             \tag{1.5}
\]

eventually.  If `L_M=ran(P_<=M^+)` and
`H_M=ran(P_>M^+)`, the raw high theorem gives

\[
 P_{H_M}(Q_+-UI)P_{H_M}\succeq(2c_\lambda+1)P_{H_M}, \tag{1.6}
\]

while the raw low--high cross norm is at most `c_lambda`.

## 2. The comparison state makes only a small rotation

Write

\[
 \kappa_L=P_{L_M}\kappa,
 \qquad \kappa_H=P_{H_M}\kappa,
 \qquad \alpha=\|\kappa_L\|,
 \qquad \delta=\|\kappa_H\|.                         \tag{2.1}
\]

The exact combined-state circular variation in
`notes/OUTER_PROJECTION_RADICAL_REDUCTION.md` is

\[
 V_\lambda=S_\lambda\overline V_\lambda=O(\lambda^4).
                                                               \tag{2.2}
\]

Equation (3.2) of `notes/DEFECT_RELATIVE_PROJECTION_THEOREM.md`, applied
before the outer projection at `N`, gives

\[
 \boxed{
 \delta
 \leq {\sqrt L\,V_\lambda
        \over\pi\sqrt{2M}\,a_{\lambda,N}}.}           \tag{2.3}
\]

The projected-state norm theorem gives
`a_(lambda,N)->a_infinity>0`.  The positive term
`c_lambda>=4L(lambda-1)` in (1.4) then proves

\[
 \boxed{
 \delta=\exp[-\Omega(\lambda\log\lambda)].}           \tag{2.4}
\]

For all sufficiently large locked parameters, `alpha>0`.  Put

\[
 \mathcal L_0=L_M\cap\kappa_L^\perp.                  \tag{2.5}
\]

For a raw low vector, orthogonality to `kappa_L` is the same as
orthogonality to `kappa`, so

\[
 \boxed{\mathcal L_0\subset K,\qquad
        \dim\mathcal L_0=M.}                           \tag{2.6}
\]

Let `mathcal G=K\ominus mathcal L_0`.  If `delta>0`, define

\[
 \ell={\kappa_L\over\alpha},
 \qquad h={\kappa_H\over\delta}.
\]

Then

\[
 \mathcal G=(H_M\cap h^\perp)
        \oplus\mathbb C(\alpha h-\delta\ell).         \tag{2.7}
\]

The isometry

\[
 R:H_M\longrightarrow\mathcal G,
 \qquad R|_{h^\perp}=I,
 \qquad Rh=\alpha h-\delta\ell                       \tag{2.8}
\]

satisfies

\[
 \boxed{
 \|R-I_{H_M}\|=\sqrt{2(1-\alpha)}\leq\sqrt2\,\delta.}
                                                               \tag{2.9}
\]

When `delta=0`, take `mathcal G=H_M` and `R=I`.  Thus `mathcal G` is only
a rank-one rotation of the entire raw high space; no dimension is lost.

## 3. Rotated high floor and constant shear

Let `widetilde B=Q_+-UI` on the full even space and set

\[
 K_B=\|\widetilde B\|.                                \tag{3.1}
\]

The exact Cauchy form gives

\[
 K_B\leq
 \max\left\{|a_0-U|,
        \log(N+2)+C_{|a|}(\lambda)+U\right\}
 +c_\lambda.                                          \tag{3.2}
\]

There is no hidden zero-mode constant here.  Directly from the locked source
entry,

\[
\begin{aligned}
 |a_0|\leq{}&4(\lambda-\lambda^{-1})
 +|\gamma+\log(4\pi)|+\lambda+\log\coth(L/2)\\
 &+4L(\lambda-1),                                    \tag{3.3}
\end{aligned}
\]

where the last term includes every prime power through `lambda^2` and keeps
the source minus-prime convention before the absolute bound.  Hence

\[
 \boxed{K_B=O(\lambda^2),\qquad K_B\delta=o(1).}       \tag{3.4}
\]

Relative to the exact decomposition

\[
 K=\mathcal L_0\oplus\mathcal G,
 \qquad
 B=\begin{bmatrix}D&\Gamma^*\\ \Gamma&H\end{bmatrix}, \tag{3.5}
\]

unitary identification by `R` and (1.6), (2.9) give

\[
 \boxed{
 H\succeq g_\lambda I_{\mathcal G},
 \qquad
 g_\lambda=2c_\lambda+1-2\sqrt2K_B\delta.}           \tag{3.6}
\]

Indeed

\[
 \|R^*\widetilde BR-I_{H_M}^*\widetilde BI_{H_M}\|
 \leq2K_B\|R-I_{H_M}\|.                              \tag{3.7}
\]

The same rotation estimate and the raw cross theorem give

\[
 \boxed{
 \|\Gamma\|\leq c_\lambda+\sqrt2K_B\delta.}          \tag{3.8}
\]

Thus `H>0` eventually and, with

\[
 \mathscr S=H^{-1}\Gamma,
 \qquad
 \Sigma=D-\Gamma^*H^{-1}\Gamma,                      \tag{3.9}
\]

one has

\[
 \boxed{
 \|\mathscr S\|\leq{c_\lambda+o(1)
                         \over2c_\lambda+1-o(1)}
 \leq\frac12+o(1).}                                   \tag{3.10}
\]

The exact shear congruence gives

\[
 \boxed{B\succ0\quad\Longleftrightarrow\quad\Sigma\succ0.}
                                                               \tag{3.11}
\]

The remaining signed matrix now has only the dimension in (2.6), namely
`M=exp(O(lambda*log(lambda)))`.

## 4. Far sampling and the retained harmonic metric

Let `mathsf Z` be the paired zero-sampling analysis on `K` and write its
blocks as `[mathsf Z_0,mathsf Z_G]`.  The compact-window theorem gives

\[
 \|\mathsf Z_G\|^2\leq B_{\rm abs}(\lambda,N)
 =O\!\left(\lambda^3(1+\log\lambda)^2\right).          \tag{4.1}
\]

Since `c_lambda>=4L(lambda-1)`, equations (3.6) and (4.1) prove

\[
 \boxed{
 \|\mathsf Z_GH^{-1}\|
 \leq{\sqrt{B_{\rm abs}(\lambda,N)}\over g_\lambda}
 =O(\sqrt\lambda).}                                    \tag{4.2}
\]

This is negligible at the graph target scale.

The exact far-return sampling map is

\[
 \mathsf Z_{\rm eff}=\mathsf Z_0-\mathsf Z_G\mathscr S.
                                                               \tag{4.3}
\]

Let `K_L` be the admitted low physical range of
`notes/BLOCK_QUOTIENT_ACTION_THEOREM.md`, let `Delta_L>0` be its positive
block-quotient metric, and put

\[
 \Delta=\Delta_L\oplus I_{K\ominus K_L}.              \tag{4.4}
\]

The low quotient theorem, together with the same compact-window estimate
reapplied on `K\ominus K_L`, gives

\[
 \boxed{
 \|\mathsf Z\Delta^{-1}\|^2
 =O\!\left({\lambda^3\operatorname {polylog}(\lambda)
             \over d_8}\right).}                      \tag{4.5}
\]

Define the `B`-harmonic lift and its pulled-back squared metric by

\[
 \mathsf E y=(y,-\mathscr S y),
 \qquad
 \mathcal D_0=(\mathsf E^*\Delta^2\mathsf E)^{1/2}>0.
                                                               \tag{4.6}
\]

Because `mathsf Z_eff=mathsf Z mathsf E` and
`Delta mathsf E mathcal D_0^(-1)` is an isometry,

\[
 \boxed{
 \|\mathsf Z_{\rm eff}\mathcal D_0^{-1}\|^2
 \leq\|\mathsf Z\Delta^{-1}\|^2.}                    \tag{4.7}
\]

Consequently the complete even graph target follows from

\[
 \boxed{
 \Sigma\succ0,
 \qquad
 \|\mathcal D_0\Sigma^{-1}\|
 =O\!\left(\lambda^{1/2}
             \operatorname {polylog}(\lambda)\right).} \tag{4.8}
\]

All far-return cancellation is retained in (4.6)--(4.8).

## 5. One all-shift inequality implies both missing statements

For `h>=0`, put

\[
 H_h=H+hI,
 \qquad \mathscr S_h=H_h^{-1}\Gamma,
 \qquad
 \Sigma_h=D+hI-\Gamma^*H_h^{-1}\Gamma,              \tag{5.1}
\]

\[
 \mathsf E_hy=(y,-\mathscr S_hy),
 \qquad
 \mathcal D_h=(\mathsf E_h^*\Delta^2\mathsf E_h)^{1/2}.
                                                               \tag{5.2}
\]

### Theorem 5.1 (single retained sufficient theorem)

Suppose that, on one unbounded locked schedule, a bound

\[
 \boxed{
 \|\mathcal D_hy\|
 \leq L_\lambda\|\Sigma_hy\|
 \quad(y\in\mathcal L_0,\ h\geq0),
 \qquad
 L_\lambda=O\!\left(\lambda^{1/2}
        \operatorname {polylog}(\lambda)\right)}       \tag{5.3}
\]

holds.  Then `Sigma=Sigma_0` is positive definite and (4.8) holds.

**Proof.**  Every `mathcal D_h` is positive definite because `Delta>0` and
`mathsf E_h` is injective.  Thus (5.3) makes `Sigma_h` injective for every
`h>=0`.  For sufficiently large `h`, the complete finite matrix `B+hI` is
positive; since `H_h>0`, its Schur complement `Sigma_h` is positive.  The
eigenvalues of the finite Hermitian family `Sigma_h` vary continuously and
cannot cross zero.  Hence `Sigma_0>0`.  At `h=0`, (5.3) says exactly
`||mathcal D_0 Sigma^(-1)||<=L_lambda`, proving (4.8).  \(\square\)

This all-shift form is stronger than an endpoint estimate, but it merges the
two remaining even obligations without assuming the sign before inversion.
It is the same shift geometry which appears in the exact transverse
resolvent supremum.

## 6. Magnitude-only discrepancy control cannot prove (5.3)

Set the signed weighted-PNT discrepancy to zero while retaining the exact
continuous main density and archimedean tail.  The normal form becomes

\[
 Q_\lambda^{\rm cont}=c_*I+A_{\rm tail},
 \qquad
 c_*=4-\gamma_E-\frac\pi2-3\log2-\log\pi<-1.         \tag{6.1}
\]

Here `gamma_E` is Euler's constant.  The last strict bound follows from the
elementary inequalities
`gamma_E>1/2`, `pi/2>3/2`, `log(2)>2/3`, and `log(pi)>1`.

Fix an integer `m>=1` and use the exact finite Fourier test space

\[
 W_m=\operatorname {span}\{e_0^+,\ldots,e_{m-1}^+\}
 \subset E_N^+ \qquad(N\geq m-1).                     \tag{6.2}
\]

For every unit vector `f in W_m`, the normalized trigonometric basis on
`[-a,a]`, where `a=log(lambda)`, gives

\[
 \|f\|_\infty^2\leq {m\over a},
 \qquad
 \|f'\|_2^2\leq {\pi^2(m-1)^2\over a^2}.             \tag{6.3}
\]

After zero extension, for `0<h<2a`,

\[
 \|\tau_h\widetilde f-\widetilde f\|_2^2
 \leq h^2\|f'\|_2^2+2h\|f\|_\infty^2.              \tag{6.4}
\]

For `h>=2a`, the left side is `2`, which is bounded by `2hm/a`.  If
`rho_tail` is the positive half-line Levy density, put

\[
 \mu_1=\int_0^\infty h\rho_{\rm tail}(h)\,dh<\infty,
 \qquad
 \sigma^2=2\int_0^\infty h^2\rho_{\rm tail}(h)\,dh<\infty.
                                                               \tag{6.5}
\]

Equations (6.3)--(6.5) give the uniform exact-space bound

\[
 \mathfrak a_{\rm tail}(f,f)
 \leq {\pi^2(m-1)^2\sigma^2\over2a^2}
       +{2m\mu_1\over a}=o(1).                       \tag{6.6}
\]

Since `c_*<-1` and `U>=0`, the finite continuous-model compression
`Q_cont-U*I` is negative definite on `W_m` for all sufficiently
large locked parameters.  Its negative even index is therefore at least
`m`; compression to `kappa^perp` removes at most one negative direction.
This is an exact finite-mode obstruction and needs no diagonal form-core
limit.

The zero discrepancy satisfies every absolute envelope imposed on the
actual discrepancy.  Therefore neither positivity of `B` nor (5.3) can
follow from a magnitude-only PNT estimate.  Whenever the continuous-model
rotated high block is positive, Haynsworth inertia transfers this failure
to its retained Schur complement.  The actual signed discrepancy must lift
and orient an unbounded family of retained low directions; localizing only
one candidate ground line is not enough.

## 7. Exact remaining arithmetic theorem

After the rotation, high elimination, positive sampling transfer, and shift
continuation, the even side is reduced to (5.3) on a retained space of
dimension `exp(O(lambda*log(lambda)))`.  The inequality must be proved for
the actual complete source operator

\[
 (c_*-U)I+A_{\rm tail}-T_D,
\]

with the signed `T_D` kept intact.  No current source estimate establishes
that inverse orientation.  The shifted odd sector remains an independent
obligation.

## 8. Exact exterior-tail coframe form of the retained theorem

The global radical construction can be extended from the distinguished
source anchor to every vector in the finite even Fourier window.  This gives
an exact exterior-tail representation of `Sigma_h`; it does not prove a
coframe floor.

Let `V=E_N^+` in log coordinates and, for `v in V`, put

\[
 v^\times(u)=v(\log u),
 \qquad u\in I_\lambda=[\lambda^{-1},\lambda].        \tag{8.1}
\]

On the visible positive source interval define the finite Mobius lift

\[
 r_v(x)=\sum_{n\leq\lambda/x}\mu(n)
       {v^\times(nx)\over\sqrt{nx}},
 \qquad \lambda^{-1}\leq x\leq\lambda,               \tag{8.2}
\]

and extend it by

\[
 r_v^{\rm ev}(x)=
 1_{\{\lambda^{-1}\leq|x|\leq\lambda\}}r_v(|x|).     \tag{8.3}
\]

Choose once and for all an even
`chi in C_c^infinity({1/4<|x|<3/4})` with full-line integral one, and put

\[
 \chi_\lambda(x)=\lambda\chi(\lambda x),
 \qquad
 j_v=\int_{\mathbb R}r_v^{\rm ev}(x)\,dx,
 \qquad
 f_v=r_v^{\rm ev}-j_v\chi_\lambda.                   \tag{8.4}
\]

The full-line integral in `j_v` is essential; using only the positive half
would miss a factor two.

### Theorem 8.1 (radical-admissible right inverse)

The function `f_v` is even, compactly supported, piecewise `C^1`, and of
bounded variation.  It is identically zero near the origin and satisfies

\[
 f_v(0)=0,
 \qquad f_v(x)=O(x^2),
 \qquad \int_{\mathbb R}f_v(x)\,dx=0.                 \tag{8.5}
\]

Moreover, if `mathcal A_lambda` denotes the source arithmetic map, then

\[
 \boxed{\mathcal A_\lambda f_v=v^\times.}             \tag{8.6}
\]

**Proof.**  Every sample in the arithmetic map obeys
`nu>=lambda^(-1)>3/(4lambda)`, while `chi_lambda` is supported in the
annular central hole

\[
 {1\over4\lambda}<|x|<{3\over4\lambda}.
\]

The correction in (8.4) is therefore exactly invisible.  Finite divisor
convolution gives, for `u in I_lambda`,

\[
\begin{aligned}
 \mathcal A_\lambda(r_v^{\rm ev})(u)
 &=\sum_{k\leq\lambda/u}{v^\times(ku)\over\sqrt k}
       \sum_{n\mid k}\mu(n)\\
 &=v^\times(u).                                      \tag{8.7}
\end{aligned}
\]

The definition of `j_v` proves the zero-integral assertion.  The finite
breakpoints `x=lambda/n` give only finitely many jumps, and the annular
correction makes `f_v` identically zero near zero.  This proves all the
domain statements and (8.6).  \(\square\)

Let `S_+=(I+J)/2` act by multiplicative inversion, return to log
coordinates, and define

\[
 K_v=S_+\mathcal E(f_v),
 \qquad R_v=K_v-v.                                    \tag{8.8}
\]

The BV radical lemma applies to `f_v`.  Since `v` is inversion even and the
restriction commutes with `J`,

\[
 C_\lambda K_v=v,
 \qquad
 \boxed{R_v=(1-C_\lambda)K_v}                         \tag{8.9}
\]

is purely exterior.  Both Mellin evaluations of `K_v` vanish at every
nontrivial-zero parameter, without assuming zero reality.

### Theorem 8.2 (canonical exterior-tail operator)

For compact finite-Fourier vectors `u,v in V`, the polarized zero-sampling
series below converges absolutely and

\[
 \boxed{
 \mathcal W_Z(u,v)=-\mathcal W_Z(u,R_v).}             \tag{8.10}
\]

Among global radical lifts with the same compact restriction `v`, the right
side is independent of the lift.  Hence there is a canonical finite operator

\[
 T_{\rm ext}:V\longrightarrow\mathcal L_0,
 \qquad
 \langle u,T_{\rm ext}v\rangle
 =\mathcal W_Z(u,R_v)\quad(u\in\mathcal L_0).         \tag{8.11}
\]

**Proof.**  At every zero evaluation, (8.8) and radicality give
`R_v=-v`.  Compact BV transforms are uniformly `O((1+|gamma|)^(-1))` in
the critical strip, so each polarized summand is `O((1+|gamma|)^(-2))`.
The classical zero count gives absolute convergence and permits termwise
radical cancellation, proving (8.10).

Two lifts with the same compact restriction differ by a global radical with
zero restriction.  Its pairing with `u` vanishes, proving independence.
The noncompact right side of (8.10) is defined by this absolutely convergent
zero sampling; no pole--archimedean--prime distribution is applied directly
to `R_v`.  \(\square\)

In particular,

\[
 T_{\rm ext}=-P_{\mathcal L_0}Q_+|_V.                 \tag{8.12}
\]

Thus (8.11) is an exact representation of the original source matrix, not a
new estimate for it.

### Theorem 8.3 (sharp signed exterior coframe target)

Return to the blocks in (3.5).  For `sigma>=0`, put

\[
 \mathsf E_\sigma y
 =\left(y,-(H+\sigma I)^{-1}\Gamma y\right),
\]

\[
 \Sigma_\sigma
 =D+\sigma I-\Gamma^*(H+\sigma I)^{-1}\Gamma.        \tag{8.13}
\]

Then

\[
 \boxed{
 \Sigma_\sigma
 = (\sigma-U)I-T_{\rm ext}\mathsf E_\sigma.}          \tag{8.14}
\]

Define

\[
 \boxed{
 \beta_\lambda=
 \inf_{\substack{\sigma\geq0\\y\ne0}}
 {\|(\sigma-U)y-T_{\rm ext}\mathsf E_\sigma y\|
  \over\|\Delta\mathsf E_\sigma y\|}.}              \tag{8.15}
\]

For each sufficiently large fixed locked parameter, so that `H>0` and
`Delta>0`, one has

\[
 \boxed{
 \beta_\lambda>0\quad\Longleftrightarrow\quad B\succ0.}
                                                               \tag{8.16}
\]

The optimal constant in (5.3) is exactly `beta_lambda^(-1)`.  Equivalently,

\[
 \beta_\lambda^{-1}
 =\sup_{\sigma\geq0}
   \|\Delta(B+\sigma I)^{-1}i_0\|,                   \tag{8.17}
\]

where `i_0:mathcal L_0 -> K` is the inclusion.  The remaining even theorem
is precisely

\[
 \boxed{
 \beta_\lambda\gg
 {1\over\sqrt\lambda\operatorname {polylog}(\lambda)}.}
                                                               \tag{8.18}
\]

In (8.17), a singular shifted matrix is assigned the extended value
`+infinity`; when `B>0`, every displayed inverse is ordinary.

**Proof.**  Block multiplication gives

\[
 (B+\sigma I)\mathsf E_\sigma=i_0\Sigma_\sigma,
 \qquad
 (B+\sigma I)^{-1}i_0
 =\mathsf E_\sigma\Sigma_\sigma^{-1}                 \tag{8.19}
\]

whenever the inverses exist.  Equations (8.10)--(8.12), together with the
scalar shift, give (8.14).  Also

\[
 \|\mathcal D_\sigma y\|
 =\|\Delta\mathsf E_\sigma y\|,
\]

so (8.15), (8.17), and the optimal-constant assertion are the same
inequality.

If `B` is positive, every `Sigma_sigma` is positive.  The generalized
minimum in (8.15) is continuous on compact `sigma` intervals and tends to
infinity because

\[
 \Sigma_\sigma=\sigma I+D+O(\sigma^{-1}),
 \qquad
 \mathsf E_\sigma=(I,O(\sigma^{-1})).
\]

Hence `beta_lambda>0`.  Conversely, if `B` is not positive, choose
`sigma_0=max(0,-lambda_min(B))`.  Then `B+sigma_0 I` is singular, while
`H+sigma_0 I>0`; Schur elimination makes `Sigma_(sigma_0)` singular and
forces `beta_lambda=0`.  This proves (8.16).  \(\square\)

Finally, the exact weighted-PNT normal form gives a prime-side version which
preserves the required cancellation.  For

\[
 C_{u,w}(t)=\langle u,K_t w\rangle,
 \qquad
 D_\lambda(t)=W(e^t)-2(e^{t/2}-1),                    \tag{8.20}
\]

Stieltjes integration by parts, including `D_lambda(0)=0` and `C_(u,w)(L)=0`,
gives

\[
\begin{aligned}
 \beta_\lambda
 =\inf_{\substack{\sigma\geq0\\y\ne0}}
 \sup_{\substack{u\in\mathcal L_0\\\|u\|=1}}
 {1\over\|\Delta\mathsf E_\sigma y\|}
 \Bigg|{}&(c_*+\sigma-U)\langle u,y\rangle
 +\mathfrak a_{\rm tail}(u,\mathsf E_\sigma y)\\
 &+\int_0^L D_\lambda(t)
       {d\over dt}C_{u,\mathsf E_\sigma y}(t)\,dt
 \Bigg|.                                             \tag{8.21}
\end{aligned}
\]

The integral has a plus sign: `T_D=int C dD=-int D C'`, while
`Q=c_*I+A_tail-T_D`.  The endpoint prime inventory remains mandatory even
though `C_(u,w)(L)=0` removes its matrix action.  Equation (8.21) is the
sharp cancellation-preserving signed discrepancy inf--sup theorem still to
be proved.  Replacing it by a magnitude envelope gives neither its sign nor
its coframe floor.
