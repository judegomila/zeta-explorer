# Growing-transition edge Carleman scattering obstruction

## 0. Result and fail-closed boundary

Put

\[
 \lambda={p\over2},\quad p\geq5\text{ odd},\qquad
 A=\lambda^2={p^2\over4},\qquad
 \ell=\log\lambda,\qquad L=2\ell,\qquad
 c=2\pi\lambda^2,\qquad h={\pi\over4}.
                                                        \tag{0.1}
\]

In particular `A` is nonintegral, so the one-sided sampled traces below
have the unambiguous inventory `1<=n<A`.

This note proves an obstruction for an **isolated local Weber channel**.  It
does not compute the complete central form.  The exact Poisson formulas show
that the local `m=1` inward profile is `(1+chi)f`, while its outward partner
is `chi f`.  In the flat Weber model their oriented logarithmic Carleman
coefficient is

\[
 R(\alpha,\beta)
 ={2\{e^{h(\alpha-\beta)}-1\}\over\alpha-\beta},
 \qquad R(\alpha,\alpha)={\pi\over2}.              \tag{0.2}
\]

After the exact modal exterior-metric whitening and the two `chi` factors
are retained, every two distinct flat energies have a strictly negative
Hermitian `2 by 2` determinant.  Moreover the flat local Hermitian kernel
has arbitrarily large negative index.  Hence neither the existing endpoint
row nor any fixed finite number of sampler rows can remove this channel by
compression if it survives with its isolated coefficient.

This is not a counterexample to the complete form `Q_X`, to Hypothesis `PA`
of `GROWING_TRANSITION_COMPLETE_CENTRAL_PLEMELJ_CAUCHY_FLOOR_THEOREM.md`, or
to a complete edge floor.  All of those objects contain the unrestricted
divisor sampler, both physical boundaries, reflected branches, and the
pole--Archimedean--minus-prime completion.  Those pieces have not been
assembled here.  The result instead proves a fail-closed gate: before the
flat local channel may be treated as an error, its upper conjugated-Hilbert
coefficient must be canceled by that complete pre-shear assembly, factored
through the rows killed by the shear, or controlled together with another
same-order channel by a direct signed estimate.  Branchwise positivity and
branchwise `o(1)` estimates cannot supply that step.

No assertion below uses a polynomial rank or Hilbert--Schmidt estimate.  In
particular the obstruction remains relevant for every cutoff `B` tending to
infinity, including `B=L^8`.

### 0.1 Frozen repository inputs

No external source is used.  The exact profile, boundary, and Weber inputs
are frozen at the following bytes.

| Dependency | SHA-256 |
|---|---|
| `notes/EXACT_RADICAL_LEAKAGE_IDENTITY.md` | `76dd6586357a2448ef689380a106eea5e9aedb95f68e731f10f1d6626040fddc` |
| `notes/GROWING_TRANSITION_COMPLETE_CENTRAL_FORM_REDUCTION.md` | `6c853ad2ab666bc79b33fafc498f25c6c0059812ed829fbf8ce42486983b1de9` |
| `notes/GROWING_TRANSITION_COMPLETE_CENTRAL_PLEMELJ_CAUCHY_FLOOR_THEOREM.md` | `a3a874470e62daa012dc97d6c908e12ac13378ff7e23219e0fbe3cee56b27a85` |
| `notes/GROWING_TRANSITION_WEBER_EDGE_RECIPROCAL_CHANNEL_THEOREM.md` | `16db62873056fb419bc740154c67a8f27ce6ecea2b85201abab7b89aa20d56d0` |

## 1. Exact four profiles and their Poisson collapse

Let `f` be a real even source supported on `[-lambda,lambda]`, with

\[
 f(0)=0,\qquad \int_{\mathbb R}f=0,
 \qquad H={\cal F}_a f.                               \tag{1.1}
\]

All sampled sums below have the same ordered Abel/Fejer interpretation as
the complete central reduction.  Define

\[
 {\cal E}(f)(u)=\sqrt u\sum_{m\geq1}f(mu),\qquad
 K_f={1+J\over2}{\cal E}(f).                         \tag{1.2}
\]

The two vanishing conditions in (1.1) remove the correction terms in
Poisson summation and give

\[
 {\cal E}(f)(u)={\cal E}(H)(u^{-1}).                 \tag{1.3}
\]

At the right central boundary put

\[
 \begin{aligned}
 A_f(s)&=K_f(\lambda e^{-s}),&0\leq s\leq L,\\
 B_f(t)&=K_f(\lambda e^t),&t\geq0,\\
 a_f(s)&=e^{s/2}A_f(s),&
 b_f(t)&=e^{t/2}B_f(t).
 \end{aligned}                                      \tag{1.4}
\]

Writing `u=lambda e^(-s)` and using (1.3) in the inverted half of
`K_f` gives the two exactly equivalent inward formulas

\[
\boxed{
\begin{aligned}
 a_f(s)
 &= {\sqrt\lambda\over2}\sum_{m\geq1}f(m\lambda e^{-s})
   +{e^s\over2\sqrt\lambda}
       \sum_{m\geq1}f(me^s/\lambda)\\
 &= {\sqrt\lambda\over2}\sum_{m\geq1}
       \{f+H\}(m\lambda e^{-s}).
\end{aligned}}                                      \tag{1.5}
\]

For `t>0`, time support makes `f(m lambda e^t)=0`.  Consequently the
outward profile has the exactly equivalent time-sampler and Fourier-sampler
forms

\[
\boxed{
\begin{aligned}
 b_f(t)
 &= {1\over2\sqrt\lambda}
       \sum_{m\geq1}f(me^{-t}/\lambda)\\
 &= {\sqrt\lambda e^t\over2}
       \sum_{m\geq1}H(m\lambda e^t)\\
 &= {\sqrt\lambda e^t\over2}
       \sum_{m\geq1}\{f+H\}(m\lambda e^t).
\end{aligned}}                                      \tag{1.6}
\]

The last equality holds for `t>0` and almost everywhere.  It must not be
used to replace the outward one-sided trace at `t=0` by a midpoint value;
that trace is evaluated from the first two lines of (1.6).  Equations
(1.5)--(1.6) are the full four-profile algebra.  In particular Poisson
recombination adds the local time and local Fourier pieces.  It does not
subtract them.

The one-sided traces follow at once:

\[
\boxed{
\begin{aligned}
 \Gamma_{\rm in}(f)=a_f(0)
 &= {\sqrt\lambda\over2}f(\lambda)
   +{1\over2\sqrt\lambda}
      \sum_{1\leq n<\lambda^2}f(n/\lambda),\\
 \Gamma_{\rm out}(f)=b_f(0)
 &= {1\over2\sqrt\lambda}
      \sum_{1\leq n<\lambda^2}f(n/\lambda).
\end{aligned}}                                      \tag{1.7}
\]

Thus, with `eta(f)=f(lambda)`,

\[
 \Gamma_{\rm in}-\Gamma_{\rm out}
 ={\sqrt\lambda\over2}\eta.                       \tag{1.8}
\]

The endpoint shear `eta=0` equalizes the two traces but does not annihilate
their common sampler row.

## 2. The exact local `m=1` edge pair

Fix the real plus Fourier phase.  For a pure prolate label `j`, write

\[
 H_j=\chi_jf_j\quad\hbox{on }[-\lambda,\lambda],
 \qquad e_j=f_j(\lambda),\qquad d_j=1-\chi_j^2.      \tag{2.1}
\]

The local `m=1` terms in (1.5)--(1.6) are therefore

\[
 a_j^{(1)}(s)={\sqrt\lambda\over2}(1+\chi_j)e_jp_j(U),
 \qquad
 b_j^{(1)}(t)={\sqrt\lambda\over2}\chi_je_j
                    (1+V/c)q_j(V),                  \tag{2.2}
\]

where

\[
 U=c(1-e^{-s}),\qquad V=c(e^t-1),                    \tag{2.3}
\]

and `p_j(0)=q_j(0)=1`.  If
`alpha_j=(c^2-mu_j)/c`, the two exact edge equations are

\[
\begin{aligned}
 A_c^-p_j&=-\alpha_jp_j,&
 A_c^-&=-{d\over dU}\left((2U-U^2/c){d\over dU}\right)
                         -(2U-U^2/c),\\
 A_c^+q_j&= \alpha_jq_j,&
 A_c^+&=-{d\over dV}\left((2V+V^2/c){d\over dV}\right)
                         -(2V+V^2/c),
\end{aligned}                                      \tag{2.4}
\]

with

\[
 p_j'(0)=\alpha_j/2,\qquad q_j'(0)=-\alpha_j/2.      \tag{2.5}
\]

Let `U_L=c(1-lambda^(-2))`.  Substitution of (2.2)--(2.3) into the
completed logarithmic Carleman integral gives the exact oriented local
entry

\[
\boxed{
 {\lambda e_je_k\over4c}(1+\chi_j)\chi_k
 \int_0^{U_L}\!\int_0^\infty
 {p_j(U)q_k(V)\over
  (c-U)\log\{(c+V)/(c-U)\}}\,dV\,dU.}             \tag{2.6}
\]

No factor `(1+V/c)` is missing: it cancels `dV/(c+V)` exactly.  The
coordinate kernel satisfies, pointwise for fixed `U,V`,

\[
 {1\over(c-U)\log\{(c+V)/(c-U)\}}
 \longrightarrow {1\over U+V}.                       \tag{2.7}
\]

For `L^2`-normalized pure modal coordinates, the raw full two-sided
additive exterior metric is exactly `diag(d_j)`.  The unitarily pulled
positive-tail profile used in the Weber theorem has squared norm `d_j/8`.
That common factor `1/8` changes only the overall normalization and is
irrelevant to inertia: full-metric modal `D`-whitening replaces `e_j` in
(2.6) by

\[
 z_j={e_j\over\sqrt{d_j}}.                            \tag{2.8}
\]

The nonzero diagonal `z_j` is a congruence factor.  It cannot change the
inertia of a finite local matrix.  A later source synthesis or endpoint
shear must instead be applied as a congruence in its full pulled-back
metric; replacing that metric by a diagonal matrix is not licensed by
(2.8).

The exact outward Fourier equation is also worth retaining.  For the
endpoint-normalized solution of `A_c^+q=alpha q`, define first for
`Im N<0` and then by the boundary value

\[
 F_c(N,\alpha)=\int_0^\infty q(V)e^{-iNV}\,dV.          \tag{2.9}
\]

Two integrations by parts in the exact equation (2.4) give

\[
\boxed{
 (N^2-1)F_c''+{2N+2ic(1-N^2)\}F_c'
 +(c\alpha-2icN)F_c=0.}                               \tag{2.10}
\]

This ODE controls the one-edge/one-far Fourier sampler.  It does not by
itself compare the integrated two-edge kernel (2.6) with its flat limit;
that comparison is a separate composition problem.

## 3. Exact flat Laplace transform and conjugated Hilbert matrix

The regular flat solution is

\[
 w_\alpha(U)=e^{iU}
 {}_1F_1\left({1\over2}-{i\alpha\over4};1;-2iU\right),
 \qquad w_\alpha(0)=1,
 \qquad w_\alpha'(0)=-\alpha/2.                      \tag{3.1}
\]

Thus the flat limits of the two solutions in (2.4)--(2.5) are
`p_j=w_(-alpha_j)` and `q_j=w_(alpha_j)`.

For `z>0`, the elementary Kummer Laplace formula gives, with principal
branches,

\[
\boxed{
 W_\alpha(z):=\int_0^\infty e^{-zU}w_\alpha(U)\,dU
 ={1\over\sqrt{1+z^2}}
 \exp\left\{-{\alpha\over2}\arctan{1\over z}\right\}.}
                                                               \tag{3.2}
\]

Using `1/(U+V)=integral_0^infinity e^(-z(U+V)) dz` and then
`z=cot(theta)` proves the Abel-regularized identity

\[
\boxed{
\begin{aligned}
 R(\alpha,\beta)
 &:=\int_0^\infty\!\int_0^\infty
 {w_{-\alpha}(U)w_\beta(V)\over U+V}\,dV\,dU\\
 &=\int_0^{\pi/2}e^{(\alpha-\beta)\theta/2}\,d\theta
 ={2\{e^{h(\alpha-\beta)}-1\}\over\alpha-\beta}.
\end{aligned}}                                               \tag{3.3}
\]

For distinct energies let

\[
 {\mathsf H}_{jk}={1\over\alpha_j-\alpha_k},
 \qquad {\mathsf H}_{jj}=0,
 \qquad E_h=\operatorname {diag}(e^{h\alpha_j}).       \tag{3.4}
\]

Then the full flat matrix (3.3) is exactly

\[
 \boxed{R=2(E_h{\mathsf H}E_h^{-1}-{\mathsf H})+2hI.}  \tag{3.5}
\]

The first term in (3.5) is the upper conjugated-Hilbert term.  Adjoint
orientation does not delete it: since `mathsf H^*=-mathsf H`, its
unweighted Hermitian contribution is

\[
 E_h{\mathsf H}E_h^{-1}-E_h^{-1}{\mathsf H}E_h,
                                                               \tag{3.6}
\]

whose off-diagonal kernel is
`2sinh(h(alpha_j-alpha_k))/(alpha_j-alpha_k)`.  This is not a
positive Gram kernel; Section 5 gives explicit negative subspaces.

## 4. Exact `D`-white/`chi` two-point obstruction

The flat scattering weight is

\[
 \chi_0(\alpha)={1\over\sqrt{1+e^{-\pi\alpha/2}}}.     \tag{4.1}
\]

The Hermitian part of the complete local `m=1` profile from (2.2), with
the common positive scalar and the diagonal factors `z_j` temporarily
removed, is

\[
\boxed{
 T(\alpha,\beta)
 ={1\over2}\left\{
 (1+\chi_0(\alpha))\chi_0(\beta)R(\alpha,\beta)
 +(1+\chi_0(\beta))\chi_0(\alpha)R(\beta,\alpha)
 \right\}.}                                             \tag{4.2}
\]

Equivalently, on a finite flat spectral set put

\[
 G=\operatorname {diag}(1+\chi_0(\alpha_j)),\qquad
 X=\operatorname {diag}(\chi_0(\alpha_j)),\qquad
 Z=\operatorname {diag}(z_j).                         \tag{4.2a}
\]

Up to the common positive scalar in (2.6), the oriented matrix and its
upper conjugated-Hilbert piece are exactly

\[
 C_{\rm loc}=ZGRXZ,\qquad
 U_{\rm loc}=2ZGE_h{\mathsf H}E_h^{-1}XZ.             \tag{4.2b}
\]

Therefore

\[
 {U_{\rm loc}+U_{\rm loc}^*\over2}
 =Z\{GE_h{\mathsf H}E_h^{-1}X
      -XE_h^{-1}{\mathsf H}E_hG\}Z.                  \tag{4.2c}
\]

This is the exact normalized coefficient which a complete four-quadrant
assembly has to cancel, factor through retained rows, or estimate without
separation.

Take distinct real `alpha,beta` and put

\[
 x=e^{h\alpha},\quad y=e^{h\beta},\quad
 A=\sqrt{1+x^2},\quad B=\sqrt{1+y^2},\quad
 \mathsf L(x,y)={x-y\over\log x-\log y}.              \tag{4.3}
\]

Direct substitution in (4.2) gives

\[
\boxed{
\begin{aligned}
 T(\alpha,\beta)
 &=h\,\mathsf L(x,y){A+B+x+y\over AB},\\
 T(\alpha,\alpha)
 &=2h\,{x(A+x)\over A^2}.
\end{aligned}}                                          \tag{4.4}
\]

The logarithmic mean satisfies
`mathsf L(x,y)>sqrt(xy)` for `x!=y`, and

\[
 A+B+x+y=(A+x)+(B+y)
 >2\sqrt{(A+x)(B+y)}.                                  \tag{4.5}
\]

Consequently

\[
\boxed{
 T(\alpha,\beta)^2
 >T(\alpha,\alpha)T(\beta,\beta),
 \qquad
 \det\begin{pmatrix}
 T(\alpha,\alpha)&T(\alpha,\beta)\\
 T(\alpha,\beta)&T(\beta,\beta)
 \end{pmatrix}<0.}                                    \tag{4.6}
\]

Restoring exact modal whitening multiplies this determinant by the positive
factor `z_alpha^2 z_beta^2`, and restoring the common scalar from (2.6)
multiplies it by another positive square.  Thus (4.6) is the requested
two-point obstruction after the endpoint amplitudes, `D`-whitening, the
interior factor `(1+chi)`, and the outward factor `chi` are all retained.

Equation (4.6) is an exact statement about the flat scattering model.  Its
promotion to an actual finite-`c` prolate pair requires a uniform
edge-scattering comparison for the integrated kernel (2.6), not a global
operator-norm assertion `A_c approximately A_0`.

## 5. Fixed finite-codimension rows do not cure the flat channel

The two-point determinant is not the whole obstruction.  The flat local
kernel has unbounded negative index.

Fix an integer `m`, distinct positive offsets
`delta_1,...,delta_m`, and the reflection-symmetric spectral packet

\[
 \alpha_{\pm r}=A_0\pm\delta_r\qquad(1\leq r\leq m).  \tag{5.1}
\]

As `A_0` tends to positive infinity, `chi_0(alpha_(plus/minus r))`
tends uniformly to one.  The kernel (4.2) therefore tends, on this fixed
packet, to

\[
 T_\infty(\alpha,\beta)
 =R(\alpha,\beta)+R(\beta,\alpha)
 =2\int_{-h}^h e^{t(\alpha-\beta)}\,dt.             \tag{5.2}
\]

Let `V_m` be the `m`-dimensional coefficient space

\[
 c_{+r}=u_r,\qquad c_{-r}=-u_r.                       \tag{5.3}
\]

If

\[
 S_u(t)=2\sum_{r=1}^m u_r\sinh(t\delta_r),           \tag{5.4}
\]

then (5.2) gives, for every nonzero `u`,

\[
 \sum_{j,k}\overline{c_j}T_\infty(\alpha_j,\alpha_k)c_k
 =-2\int_{-h}^h|S_u(t)|^2\,dt<0.                    \tag{5.5}
\]

The functions `sinh(t delta_r)` are linearly independent, so the last
inequality is strict.  Negative definiteness is open in finite dimension.
Hence, for every `m`, all sufficiently large fixed centers `A_0` make
the actual flat weighted kernel (4.2) negative definite on an
`m`-dimensional subspace.  The nonzero diagonal `D`-white factors `z_j`
only congruence this subspace.

For the existing endpoint row this conclusion is even more direct.  In
modal `D`-white coordinates the row is `(z_j)`.  After the same diagonal
change `y_j=z_jx_j` which removes the congruence factors from the kernel,
endpoint nullity is `sum_j y_j=0`.  Every antisymmetric vector (5.3)
already satisfies that equality.  Thus the endpoint shear does not remove
any of the negative directions constructed in (5.5) in the flat model.

Now impose any `r` linear rows, with `r` independent of the edge cutoff.
Choose `m>r`.  Their common nullspace intersects the negative subspace in
dimension at least `m-r`, and therefore contains a negative vector.  This
proves:

\[
\boxed{
 \text{No fixed finite-codimension endpoint/sampler shear can make the
 surviving flat local channel nonnegative.}}             \tag{5.6}
\]

For each fixed `r`, the packet center and offsets used above are fixed
numbers.  They therefore lie in every band `|alpha|<=B` once `B` is large
enough.  No rank loss polynomial in `B` occurs in this argument.

Statement (5.6) concerns the flat spectral channel.  To transfer the packet
to the discrete prolate labels one still needs the appropriate
Bohr--Kramers label-placement estimate and the integrated finite-`c`
scattering comparison.  Neither transfer is asserted here, and (5.6) is
not a negative packet for the complete `Q_X`.

## 6. The retained boundary row is independent data

For the complete normalized Chebyshev-error distribution, define

\[
 \beta_h(f)=\langle\delta_*(h+\cdot),b_f\rangle,
 \qquad \rho=\beta_0-\lambda\beta_L.                 \tag{6.1}
\]

The exact two-boundary oriented formula is

\[
\begin{aligned}
 I_{jk}
 &=2a_j(0)\langle\delta_*,b_k\rangle\\
 &\quad+2\int_0^L(a_j'-a_j)(s)
       \int_0^\infty\delta_*(s+t)b_k(t)\,dt\,ds\\
 &\quad-2a_j(L)\langle\delta_*(L+\cdot),b_k\rangle,
                                                               \tag{6.2}
\end{aligned}
\]

with

\[
 a_j(0)=\overline{\Gamma_{{\rm in},j}},\qquad
 a_j(L)=\lambda\overline{\Gamma_{{\rm in},j}}.       \tag{6.3}
\]

Thus the Hermitian endpoint row is exactly

\[
 \Gamma_{\rm in}^*\rho+\rho^*\Gamma_{\rm in}.        \tag{6.4}
\]

Equations (1.7)--(1.8) show that `Gamma_in`, `Gamma_out`, and `eta` must
not be identified.  Nor is any proportionality of `rho` to one of those
rows known.  The singular boundary term in (6.2) combines with the
derivative bulk to produce the Carleman kernel; deleting it loses the
Plemelj diagonal.  The last boundary has no `s+t=0` singularity but remains
part of the regular completed form.

The finite-rank expression (6.4) and the infinite-rank local kernel of
Sections 3--5 are logically different.  A second anchor can handle (6.4)
only after all rows which occur in it have been identified.  It cannot by
itself eliminate a surviving conjugated-Hilbert channel.

## 7. Exact pre-shear assembly gate

Let `U_complete` denote the sum of every upper conjugated-Hilbert
coefficient after the unrestricted divisor sampler, the two physical
boundaries, the reflected orientations, and the pole--Archimedean--minus-
prime terms have been assembled, but **before** endpoint shear and metric
whitening.  This symbol is a target for a future calculation; no formula
for it is assumed in this note.

Let `mathcal R` be the row map which a proposed shear kills.  For the
existing shear it contains only `eta`.  A proposed two-row repair might use
`(eta,Gamma_out)`, but (6.4) shows that this choice has to be justified from
the completed algebra rather than guessed.  The exact finite-row
factorization test is

\[
\boxed{
 P_{\ker\mathcal R}\,
 {U_{\rm complete}+U_{\rm complete}^*\over2}\,
 P_{\ker\mathcal R}=0.}                              \tag{7.1}
\]

In finite dimension, (7.1) is equivalent to a factorization

\[
 {U_{\rm complete}+U_{\rm complete}^*\over2}
 =\mathcal R^*Y+Y^*\mathcal R                         \tag{7.2}
\]

for some `Y` (a term `mathcal R^* C mathcal R` is absorbed into `Y`).
Indeed a splitting into `ker mathcal R` and any complement makes the
upper-left block zero, which is exactly (7.2).  In particular its rank is
at most twice the row rank.

There are therefore three fail-closed ways forward:

1. prove exact cancellation, `U_complete+U_complete^*=0`;
2. prove the finite-row factorization (7.1)--(7.2) and retain the resulting
   anchor block exactly; or
3. do not separate the upper term, and prove a direct signed lower bound for
   its complete same-order assembly.

If the isolated coefficient from (3.5) survives in the compression in
(7.1), Sections 4--5 prohibit treating it as an `o(1)` or finite-row error.
This does not say that the complete form is negative: another same-order
physical branch may cancel or dominate it.  It says precisely that such a
branch must be displayed in the complete algebra.

For completeness, suppose a future calculation proves that all retained
upper and boundary terms factor through exactly two independent rows
`r_1,r_2`.  Choose two anchor columns `g_1,g_2` such that

\[
 M=\begin{pmatrix}r_1(g_1)&r_1(g_2)\\
                   r_2(g_1)&r_2(g_2)\end{pmatrix}
\quad\hbox{is invertible}.                              \tag{7.3}
\]

For every rest column `f`, set

\[
 f^\#=f-(g_1,g_2)M^{-1}
       \binom{r_1(f)}{r_2(f)}.                          \tag{7.4}
\]

Then `r_1(f#)=r_2(f#)=0` exactly.  Equation (7.4) is an ordinary source
congruence and must be applied simultaneously to the complete form and to
`D_full`.  It is a valid two-anchor repair only **after** (7.2) has reduced
the dangerous term to those two rows.  Section 5 proves that it is not a
repair for a surviving infinite-rank local Weber kernel.

## 8. Consequence for the edge-floor program

The exact local calculation settles one point and leaves one point open.
Poisson recombination and the existing endpoint shear do not provide a
branchwise cancellation of the Weber exponential in (0.2).  Therefore a
proof of a completed edge floor must first establish the pre-shear
four-quadrant identity represented by (7.1), or must estimate the entire
same-order assembly without separating this channel.  Once that step is
proved, the lower Carleman/Plemelj part, the regular `B_2`/Volterra branch,
the edge--bulk and label-`8` crosses, and the full-metric anchor Schur block
still require their own estimates.

This note proves none of those later estimates and makes no claim of a
complete central floor.
