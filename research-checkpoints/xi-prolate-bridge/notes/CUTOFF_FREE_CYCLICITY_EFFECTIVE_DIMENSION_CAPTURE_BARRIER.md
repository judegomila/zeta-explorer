# Cutoff-free cyclicity, effective dimension, and capture barrier

## 0. Exact outcome and claim boundary

Let `Q_lambda` be the cutoff-free semilocal Weil operator and let
`mu_lambda` be its full bottom value.  The explicit high-Fourier theorem
gives more than compact resolvent: if a Rayleigh value `q_lambda` satisfies
`mu_lambda<=q_lambda`, then a unit bottom vector has a fixed positive amount
of mass in

\[
 D_\lambda=\exp\{O(\lambda\log\lambda)\}
            =\exp\{o(\lambda^2)\}                 \tag{0.1}
\]

physical Fourier modes.  The exact estimate is

\[
 \boxed{
 \|P_{\rm hi}g\|\leq{c_\lambda\over G}\|P_{\rm lo}g\|,
 \qquad
 \|P_{\rm lo}g\|^2\geq{G^2\over G^2+c_\lambda^2}.} \tag{0.2}
\]

Taking `G=c_lambda` gives low-band mass at least `1/2`.

This useful localization does **not** give the required capture by the
`O(lambda^2)` leading prolate source.  On any finite physical parity space
`X`, the literal full-source row floor normalizes the adjoint to an isometry

\[
 J_X=T_X^*(T_XT_X^*)^{-1/2},\qquad J_X^*J_X=I_X.     \tag{0.3}
\]

If `F` is a prolate source prefix of dimension `m<dim X`, then

\[
 \boxed{
 \dim\ker(P_FJ_X)\geq\dim X-m,
 \qquad
 \lambda_{\min}(J_X^*P_FJ_X)=0.}                   \tag{0.4}
\]

Thus the full-source floor preserves every physical direction before the
prefix projection, while the prefix necessarily deletes many directions.
Even the largest capture has no positive lower bound from the row floor and
the two dimensions alone: an isometric range may lie in `F^perp`.

Source-Cauchy cyclicity does not repair the rate.  It changes zero spectral
weights into strictly positive weights, but the exact cofactor formula shows
that those weights can be arbitrarily small.  Real analyticity between
prime-power thresholds has the same limitation.  A two-dimensional analytic
source-Cauchy family can be simple and cyclic while its ground weight is
`exp(-2 lambda^3+o(1))`.  An exact three-mode source-Cauchy model with one
anchor in each parity also saturates

\[
 {\sum_jr_{\lambda,j}^2\over\sum_j\rho_{\lambda,j}}
 \longrightarrow1                                  \tag{0.5}
\]

at an overlap `exp(-6 pi lambda^2)`.

Equations (0.4)--(0.5) are structural nonimplication results.  They do not
say that the actual Weil ground lies in the kernel in (0.4), and they do not
disprove an `exp(-o(lambda^2))` actual-source overlap.  They prove that
high-Fourier localization, the full-source floor, qualitative cyclicity,
cofactor nonvanishing, and analytic-cell genericity do not imply that rate.
A new actual arithmetic orientation estimate is indispensable.

No actual ground capture, parity order, cyclicity theorem on an unbounded
schedule, determinant convergence, zero theorem, Riemann-hypothesis
conclusion, converse, or de Bruijn--Newman bound is proved.  The standard
eight are unchanged and the formal state remains `P0_INVALIDATED`.

## 1. Frozen dependencies

No external source is added.  The exact repository inputs are:

| Dependency | SHA-256 |
|---|---|
| `notes/HIGH_FOURIER_COERCIVITY.md` | `5d928d68bd317d637a3631c91c1da4d2043c79986e3c5767b886b354b525a821` |
| `tests/test_high_fourier_coercivity.py` | `64eea186ca9ec09dde5510b9b6a99fa56a50c073865d5fe822367202806a5bae` |
| `notes/FULL_SOURCE_COFRAME_RANK_THEOREM.md` | `3f8b381d9e51e0fa0cf89928851e89dd163ec9982249af8050a90520c0389f81` |
| `tests/test_full_source_coframe_rank.py` | `dc322485178710618f9ace19cd2019200bf0dafeabcbe17cce4e47d41377d66a` |
| `notes/EVEN_ODD_MULTIPLICITY_KRYLOV_SIMPLICITY.md` | `a027a83a79078f6b6fb61a12dcb3bad28c7f73d429c4fae9587ed398a4d079a8` |
| `tests/test_even_odd_multiplicity_krylov_simplicity.py` | `fcceb2cdfad61c0eb23cd51350f0c021f72288edc0f1cab781f3c6bf4f793408` |
| `notes/CUTOFF_FREE_MULTI_ANCHOR_GROUND_FRAME_BARRIER.md` | `2e07843d54f00bce9e53afadc0b434efbaf8f97da95dadda54225de6cfecb34d` |
| `tests/test_cutoff_free_multi_anchor_ground_frame_barrier.py` | `0fdc307a051d50ff4ece21ae8b01f89b745a14788f093ec4127f5da6026bde9f` |

The first pair supplies the explicit high compression, low/high coupling,
and cutoff.  The second supplies the literal full-source row floor.  The
third supplies the source-Cauchy commutator, cyclicity identities, cofactor
weights, and analytic-cell boundary.  The fourth supplies the exact
residual-weighted full-bottom target.

## 2. Ground localization from high-Fourier coercivity

Fix one finite Fourier compression large enough to contain the declared
low band, or work directly with the cutoff-free block decomposition on the
operator domain.  Write

\[
 Q_\lambda=
 \begin{pmatrix}A&C^*\\C&B\end{pmatrix}
 \quad\hbox{on}\quad
 H_{\rm lo}\mathbin\oplus H_{\rm hi}.               \tag{2.1}
\]

The explicit high-Fourier theorem gives, for a chosen real shift `q`,

\[
 B-qI\succeq GI,
 \qquad \|C\|\leq c_\lambda,                        \tag{2.2}
\]

once the split index is at least `M_*(lambda,q,G)`.  Let `g=(x,y)` be a
unit bottom eigenvector,

\[
 Q_\lambda g=\mu g,
 \qquad \mu\leq q.                                  \tag{2.3}
\]

The high block of the eigenvalue equation is

\[
 (B-\mu I)y=-Cx.                                     \tag{2.4}
\]

Equations (2.2)--(2.3) imply `B-mu I succeq G I`, so it is invertible on
the high block and

\[
 \|y\|\leq\|(B-\mu I)^{-1}\|\,\|C\|\,\|x\|
 \leq{c_\lambda\over G}\|x\|.                     \tag{2.5}
\]

Since `||x||^2+||y||^2=1`, (2.5) proves (0.2).  This argument uses the
ground equation rather than a scalar Schur bound, so it loses no extra
factor of the low dimension.

The hypothesis `mu<=q` is automatic when `q` is the Rayleigh value of any
admitted unit trial vector in the full Hilbert space.  It does not require
that trial vector to overlap the ground.

## 3. The effective dimension is subquadratic-exponential

The explicit cutoff in the high-Fourier theorem is

\[
 M_*(\lambda,q,G)=
 \max\left\{0,
 \left\lceil2\exp\left(
 C_a(\lambda)+c_\lambda+q+G+{1\over2\pi}
 \right)\right\rceil-1\right\}.                    \tag{3.1}
\]

The displayed source constants obey

\[
 C_a(\lambda)+c_\lambda=O(\lambda\log\lambda).     \tag{3.2}
\]

For the cutoff-free prolate trial, `q=o(1)`.  Taking `G=c_lambda` in
(3.1) therefore gives

\[
 M_*(\lambda,q,c_\lambda)
 =\exp\{O(\lambda\log\lambda)\}.                    \tag{3.3}
\]

In either parity the corresponding physical low space has dimension at
most `M_*+1`; the complete two-parity band has dimension at most
`2M_*+1`.  Equations (0.2), (3.2), and (3.3) prove the positive statement
(0.1).

This is much smaller than `exp(c lambda^2)`, but it is still much larger
than the additive prolate Shannon inventory

\[
 m_\lambda=O(\lambda^2).                             \tag{3.4}
\]

The difference between (3.3) and (3.4) is not merely a poor pigeonhole
constant.  Section 4 gives an exact kernel.

## 4. Normalized full-source isometry and the rank kernel

Fix a finite-dimensional physical subspace `X` in one inversion parity.
Let

\[
 T_X=P_XS_\sigma A_\lambda:
 \mathcal H_0^{\rm ev}\longrightarrow X             \tag{4.1}
\]

be the literal full arithmetic source map.  The full-source theorem gives

\[
 {1\over8\lambda^4}I_X
 \preceq R_X:=T_XT_X^*
 \preceq{\lambda^2\over2}I_X.                       \tag{4.2}
\]

Hence `R_X` is invertible and

\[
 J_X=T_X^*R_X^{-1/2}:X\longrightarrow
 \mathcal H_0^{\rm ev}                              \tag{4.3}
\]

satisfies

\[
 J_X^*J_X=R_X^{-1/2}T_XT_X^*R_X^{-1/2}=I_X.         \tag{4.4}
\]

Let `F` be any finite source space of dimension `m`, and let `P_F` be its
orthogonal projector.  Define the normalized capture Gram

\[
 \Gamma_{F,X}=J_X^*P_FJ_X.                           \tag{4.5}
\]

It obeys

\[
 0\preceq\Gamma_{F,X}\preceq I_X,
 \qquad
 \operatorname {rank}\Gamma_{F,X}
 \leq\operatorname {rank}P_F=m.                     \tag{4.6}
\]

If `D=dim X>m`, rank-nullity proves

\[
 \boxed{
 \dim\ker\Gamma_{F,X}
 =\dim\ker(P_FJ_X)\geq D-m.}                       \tag{4.7}
\]

For every unit `z_0` in this kernel and every unit `z_1`, the unnormalized
vector `z_epsilon=z_0+epsilon z_1` gives

\[
 {\|P_FJ_Xz_\epsilon\|^2\over\|z_\epsilon\|^2}
 \leq{\epsilon^2\over(1-\epsilon)^2},
 \qquad0<\epsilon<1.                                \tag{4.8}
\]

Thus deleting exact zero by a qualitative condition supplies no rate.

There is also no lower bound for

\[
 \lambda_{\max}(\Gamma_{F,X})                       \tag{4.9}
\]

from (4.2), `D`, and `m` alone.  In an infinite source Hilbert space choose any
isometry `J:X->F^perp`; then `J^*P_FJ=0` while `J^*J=I_X`.  The actual
arithmetic `J_X` is fixed and is not asserted to have this orientation.
The example proves only that the row floor contains no hidden prefix-angle
information.

For a parity-complete prefix, apply (4.7) to the two orthogonal parity
blocks.  Adding the opposite parity removes a parity blind spot only when
the corresponding prefix captures that parity.  It does not change the
rank inequality inside either block.

## 5. Why physical localization does not choose a captured direction

Let `X` be the low physical band from Section 3, and decompose a unit bottom
as `g=x+y`.  Equation (0.2) proves a fixed lower bound for `||x||`.  It says
nothing about the direction of `x` inside `X`.  In the full-source metric,
the normalized adjoint of a low vector is

\[
 {T_X^*x\over\|T_X^*x\|}
 ={J_XR_X^{1/2}x\over\|R_X^{1/2}x\|}.               \tag{5.1}
\]

Consequently its exact prefix capture is

\[
 {\|P_FJ_XR_X^{1/2}x\|^2
  \over\|R_X^{1/2}x\|^2}.                           \tag{5.2}
\]

The row floor bounds the denominator above and below, but (4.7) leaves the
numerator zero on a large subspace.  A successful argument must therefore
prove that the **actual** whitened ground direction avoids this kernel and
must also bound the smallest positive singular value on its component.

The high tail does not automatically help.  In the complete adjoint,
low- and high-band coefficient vectors can cancel after projection to `F`.
The localization estimate controls their physical norms, not their signed
prefix orientation.  Replacing (5.2) by a lower bound for one summand would
discard this cancellation.

## 6. Exact cyclic-vector and cofactor boundary

Let `B=B^*` act on a `D`-dimensional space, let `v` be unit, and suppose
`B` has simple eigenvalues

\[
 \mu_1<\mu_2<\cdots<\mu_D.                           \tag{6.1}
\]

Let `B_v` be the compression to `v^perp`, with eigenvalues
`nu_1,...,nu_(D-1)`.  The Schur determinant identity is

\[
 \langle v,(zI-B)^{-1}v\rangle
 ={\det(zI-B_v)\over\det(zI-B)}.                    \tag{6.2}
\]

Taking the residue at `mu_j` gives the spectral weight

\[
 \boxed{
 w_j=|\langle v,u_j\rangle|^2
 ={\det(\mu_jI-B_v)\over
   \left.\partial_z\det(zI-B)\right|_{z=\mu_j}}.}   \tag{6.3}
\]

At the ground this is

\[
 \boxed{
 w_1={\displaystyle\prod_{k=1}^{D-1}(\nu_k-\mu_1)
       \over
       \displaystyle\prod_{k=2}^{D}(\mu_k-\mu_1)}.} \tag{6.4}
\]

Cyclicity of `v` is equivalent to strict interlacing and hence to
`w_j>0` for every `j`.  It gives no lower bound for the first numerator
gap in (6.4).  Equivalently,

\[
 \det\mathcal K_B(v)
 =\pm\left(\prod_{j=1}^D\langle u_j,v\rangle\right)
       \prod_{1\leq j<k\leq D}(\mu_k-\mu_j),        \tag{6.5}
\]

so nonzero Krylov determinant is qualitative.  A rate requires a lower
bound for this determinant and the relevant spectral separations.

The limitation is already analytic in dimension two.  For `0<t<1`, put

\[
 u_0(t)=\left({2t\over1+t^2},{1-t^2\over1+t^2}\right)^T,
 \qquad
 u_1(t)=\left({1-t^2\over1+t^2},{-2t\over1+t^2}\right)^T,
 \qquad
 B_t=|u_1(t)\rangle\langle u_1(t)|.                 \tag{6.6}
\]

The two vectors are orthonormal.  For `v=e_0`, the spectrum is simple,
`v` is cyclic, and

\[
 |\langle v,u_0(t)\rangle|^2
 ={4t^2\over(1+t^2)^2}.                              \tag{6.7}
\]

Taking

\[
 t(\lambda)={\exp(-\lambda^3)\over2}                \tag{6.7a}
\]

makes (6.7) exactly

\[
 {\exp(-2\lambda^3)\over
  \left(1+\exp(-2\lambda^3)/4\right)^2}
 =\exp\{-2\lambda^3+o(1)\}.                        \tag{6.7b}
\]

Every entry remains real analytic.

Every real symmetric two-by-two even block is an `N=1` source-Cauchy
block.  Indeed, for

\[
 B_t=\begin{pmatrix}A_{00}&A_{01}\\A_{01}&A_{11}\end{pmatrix},
 \qquad
 \tau={A_{01}\over\sqrt2},                           \tag{6.8}
\]

choose

\[
 b_1=\tau,\quad b_{-1}=-\tau,\quad b_0=0,
 \qquad a_0=A_{00},\quad a_1=A_{11}-\tau.           \tag{6.9}
\]

The odd block is one dimensional and its source vector `beta` is nonzero;
the even central vector is cyclic because `A_(01)!=0`.  Thus source-Cauchy
displacement, simplicity, cyclicity, and real analyticity still permit the
superquadratically small weight (6.7).

## 7. Parity-complete residual saturation model

There is an exact rational source-Cauchy low-block model which also shows
why cyclicity does not improve the residual-weighted estimate.  In raw
modes `(V_(-1),V_0,V_1)`, set

\[
 a_{-1}=a_0=a_1=-{1\over3},
 \qquad
 b_{-1}={1\over3},\quad b_0=0,\quad b_1=-{1\over3}. \tag{7.1}
\]

Then every matrix entry is `-1/3`, so

\[
 Q=-{1\over3}|\eta\rangle\langle\eta|.             \tag{7.2}
\]

In the normalized parity bases put

\[
 g={e_0+\sqrt2e_1^+\over\sqrt3},
 \qquad
 h={\sqrt2e_0-e_1^+\over\sqrt3},
 \qquad o=e_1^-.                                    \tag{7.3}
\]

They obey

\[
 Qg=-g,\qquad Qh=0,\qquad Qo=0.                     \tag{7.4}
\]

The full bottom is the simple even line `C g`.  The odd source vector is
nonzero and cyclic because the odd block is one dimensional.  The central
even vector has nonzero components on both even eigenlines and is cyclic.

For any `0<delta<1`, take the parity-complete anchor pair

\[
 \kappa_+=\delta g+\sqrt{1-\delta^2}\,h,
 \qquad \kappa_-=o.                                  \tag{7.5}
\]

Their Rayleigh values, centered residuals, and full-bottom weights are

\[
 q_+=-\delta^2,
 \quad r_+^2=\delta^2(1-\delta^2),
 \quad\rho_+=\delta^2,                               \tag{7.6}
\]

\[
 q_-=0,\quad r_-=0,\quad\rho_-=0.                   \tag{7.7}
\]

Therefore

\[
 {r_+^2+r_-^2\over\rho_++\rho_-}
 =1-\delta^2.                                       \tag{7.8}
\]

With

\[
 \delta_\lambda=e^{-3\pi\lambda^2},                \tag{7.9}
\]

the residual is smaller than the frozen
`poly(lambda,L) exp(-2 pi lambda^2)` envelope, while

\[
 \rho_++\rho_-=e^{-6\pi\lambda^2}                  \tag{7.10}
\]

and (7.8) tends to one.  The model is parity complete, analytic in its
anchor parameter, simple at the full bottom, and cyclic in the exact finite
source sense.  It is not the actual Weil matrix, and it has no nontrivial
high block.  Its role is narrower: after high coercivity localizes the
actual problem, none of the stated low-block structural properties rules
out saturation of the projection inequality.

## 8. Analytic cells and the honest stopping line

On a fixed prime-inventory cell and at fixed Fourier dimension, actual
matrix entries and all simple-branch cofactors are real analytic.  A proved
nonidentity makes their zeros discrete.  It supplies neither a lower bound
at the halfgrid sample nor a uniform transversality constant as the cell
and dimension change.  Formula (6.7) is an explicit analytic warning.

The prime-threshold derivative jump is rank one in the boundary vector.
It is blind on its orthogonal complement and therefore does not give a
uniform lower bound for (6.3), (5.2), or a multi-anchor ground weight.

The desired weak exponent is still viable for the actual source.  A theorem
of either following form would be new and sufficient input:

\[
 {\|P_{F_\lambda}J_{X_\lambda}z_\lambda\|^2
  \over\|z_\lambda\|^2}
 \geq\exp\{-o(\lambda^2)\},                         \tag{8.1}
\]

for the actual whitened bottom direction `z_lambda`, with the high-tail
cross controlled, or directly

\[
 \sum_j\langle\kappa_{\lambda,j},P_\lambda
                    \kappa_{\lambda,j}\rangle
 \geq\exp\{-o(\lambda^2)\}.                         \tag{8.2}
\]

For a cyclic-vector route, (8.1)--(8.2) must be replaced by a quantitative
actual cofactor, Christoffel weight, or Krylov-determinant inequality at the
ground.  Qualitative nonvanishing is not enough.  Because the effective
dimension in (3.3) is itself exponential in `lambda log lambda`, a generic
determinant estimate whose logarithmic loss is proportional to that
dimension is also far too weak; the desired exponent must be controlled
directly at `o(lambda^2)` scale.

## 9. Reproduction and claim discipline

Run

    python3 -B -m unittest \
      tests.test_cutoff_free_cyclicity_effective_dimension_capture_barrier -v

The regression checks the frozen hashes, the exact localization inequality,
the normalized-isometry kernel, the cyclic cofactor weight, the analytic
no-rate family, and the parity-complete residual saturation.  It reads no
zero table, cached eigensystem, network resource, API key, or environment
secret.

Any downstream use must reject a claimed pass if it:

1. turns low-band mass into prolate-prefix capture without an angle theorem;
2. replaces the rank kernel (4.7) by a dimension-average lower bound;
3. turns cyclicity, strict interlacing, or analytic nonidentity into a rate;
4. ignores the high/low cancellation after prefix projection;
5. identifies either structural model with the actual Weil source; or
6. claims an actual overlap, zero theorem, RH, a converse, or a
   de Bruijn--Newman bound.
