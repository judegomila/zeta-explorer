# Screened near-null forcing response

## 0. Claim boundary

This note proves finite-dimensional identities and gives an exact structural
countermodel.  It does not prove the missing arithmetic alignment estimate,
equation (5.2) of `DIRECT_RH_ATTACK.md`, a determinant limit, or the Riemann
hypothesis.  The repository state remains `P0_INVALIDATED`.

The outcome is deliberately narrow.

* A generalized near-null forcing coefficient has one automatic
  `sqrt(theta)` factor.  This follows from harmonic Schur algebra and does not
  use the source commutator.
* After that factor is removed, the source-Cauchy commutator gives an exact
  screened-response ratio.  It gives neither a second spectral factor nor the
  required `lambda^(-1/2)` decay.
* A cluster split can isolate the only remaining near-null arithmetic lemma,
  provided an independent full-source forcing-energy bound controls the
  complementary cluster.  This is a conditional reorganization, not a proof.

No zero table, assumed global Weil positivity, cached eigensystem, or matrix
from a diagnostic preprint is used.  Pole, archimedean, and minus-prime terms
remain combined in every occurrence of the source forcing.

Throughout, the inner product is antilinear in the first variable and linear
in the second.  The locked finite matrices and vectors are real, so all the
identities may also be read in their real form; the conjugations below record
the complex convention explicitly.

## 1. Harmonic and generalized-spectral setup

Let `kappa` be a unit inversion-even anchor and put

\[
 A=Q_+-\mu I
   =\begin{pmatrix}a&b^*\\ b&B\end{pmatrix}
 \quad\hbox{on}\quad
 \mathbb C\kappa\oplus\mathcal K,
 \qquad \mathcal K=\kappa^\perp .                 \tag{1.1}
\]

Thus `b=P_K Q_+ kappa`, and for `z in K`,

\[
 Az=\kappa\langle b,z\rangle+Bz.                  \tag{1.2}
\]

Assume

\[
 B\succ0,
 \qquad \mathcal K=\mathcal L\oplus\mathcal H,
 \qquad
 B=\begin{pmatrix}A_L&C^*\\C&D_H\end{pmatrix},
 \qquad D_H\succ0.                                \tag{1.3}
\]

Define the harmonic short, lift, and forcing by

\[
 S=A_L-C^*D_H^{-1}C\succ0,
 \qquad
 U\ell=\binom{\ell}{-D_H^{-1}C\ell},
 \qquad f=U^*b.                                    \tag{1.4}
\]

Writing `iota_L:L -> K` for ordinary inclusion gives

\[
 BU=\iota_LS,
 \qquad U^*B^2U=S^2,
 \qquad
 y:=S^{-1}f=P_{\mathcal L}B^{-1}b.                 \tag{1.5}
\]

Let `T` be any admitted onto full-source analysis map and pull its positive
row metric onto the graph:

\[
 R_0=U^*(TT^*)U\succ0.                             \tag{1.6}
\]

Choose a generalized eigensystem

\[
 S^2v_j=\vartheta_jR_0v_j,
 \qquad v_i^*R_0v_j=\delta_{ij},
 \qquad \vartheta_j>0.                             \tag{1.7}
\]

All inverses and square roots in this note require the displayed strict
positivity.  A singular `B`, `D_H`, `S`, or `R_0` is not a passing branch.

## 2. The exact square-root factor

Define the right generalized singular vectors

\[
 r_j={Sv_j\over\sqrt{\vartheta_j}}.                \tag{2.1}
\]

### Theorem 2.1 (one automatic factor, and only one)

The vectors `(r_j)` form a Euclidean orthonormal basis of `L`, and

\[
 \boxed{
 \langle v_j,f\rangle
   =\sqrt{\vartheta_j}\,\langle r_j,y\rangle .}    \tag{2.2}
\]

Consequently

\[
 \boxed{
 A_M=f^*S^{-2}f
    =\sum_j{|\langle v_j,f\rangle|^2\over\vartheta_j}
    =\sum_j|\langle r_j,y\rangle|^2
    =\|y\|^2.}                                     \tag{2.3}
\]

**Proof.**  From (1.7),

\[
 \langle r_i,r_j\rangle
 ={\langle v_i,S^2v_j\rangle
       \over\sqrt{\vartheta_i\vartheta_j}}
 ={\vartheta_j\langle v_i,R_0v_j\rangle
       \over\sqrt{\vartheta_i\vartheta_j}}
 =\delta_{ij}.
\]

Since `f=Sy` and `S` is self-adjoint,

\[
 \langle v_j,f\rangle
 =\langle Sv_j,y\rangle
 =\sqrt{\vartheta_j}\langle r_j,y\rangle.
\]

Parseval proves (2.3).  \(\square\)

Thus the generalized spectral weight already has one exact
`sqrt(vartheta_j)` factor.  A second factor would require the new estimate

\[
 |\langle r_j,y\rangle|=O(\sqrt{\vartheta_j}),       \tag{2.4}
\]

or an aggregate version of it.  Neither (1.1)--(1.7) nor source whitening
implies (2.4).

## 3. Exact source-commutator screening

Retain the source parity map and boundary functional

\[
 DQ_+-Q_-D=|\beta\rangle\delta,
 \qquad
 \delta(z)=\langle\eta,z\rangle,                  \tag{3.1}
\]

where `D:H_+ -> H_-`, `ker(D)=C e_0`, `eta` is inversion even, and `beta`
is inversion odd.  Put

\[
 O=Q_--\mu I.                                      \tag{3.2}
\]

The screened formula requires all of the following hypotheses.

1. `O` is invertible.  Strict positivity is sufficient but not needed for
   the algebra.
2. The even ground line has a boundary-normalized vector `Phi` satisfying

   \[
   A\Phi=0,
   \qquad \delta(\Phi)=1.                           \tag{3.3}
   \]

3. The anchor overlap

   \[
   p_\kappa=\langle\kappa,\Phi\rangle              \tag{3.4}
   \]

   is nonzero.
4. On `H_0=ker(delta)`, the restriction

   \[
   D_0=D|_{\mathcal H_0}:\mathcal H_0\longrightarrow H_- \tag{3.5}
   \]

   is the source isomorphism.  This is the finite boundary-zero primitive,
   not an unbounded inverse on the full even space.

Define the oblique projection onto `K` along the ground line and the screened
odd primitive by

\[
 P_{\kappa,\Phi}z
 =z-\Phi{\langle\kappa,z\rangle\over
                \langle\kappa,\Phi\rangle},
 \qquad
 \mathcal R=P_{\kappa,\Phi}D_0^{-1}O^{-1}:H_-\to\mathcal K.
                                                               \tag{3.6}
\]

### Theorem 3.1 (screened transport)

For every `z in K`,

\[
 \boxed{
 z=\mathcal R\bigl(DBz+\langle b,z\rangle D\kappa\bigr).}
                                                               \tag{3.7}
\]

Equivalently, with `u=mathcal R D kappa` and
`phi_b(z)=<b,z>` (a complex-linear functional),

\[
 \boxed{I_{\mathcal K}=\mathcal RDB+u\,\phi_b.}     \tag{3.8}
\]

**Proof.**  Equation (1.2), the shifted version of (3.1), and (3.3) give

\[
 ODz=DBz+\langle b,z\rangle D\kappa-\beta\delta(z),
 \qquad OD\Phi=-\beta.                              \tag{3.9}
\]

Therefore `z-delta(z)Phi` belongs to `H_0` and

\[
 D\bigl(z-\delta(z)\Phi\bigr)
 =O^{-1}\bigl(DBz+\langle b,z\rangle D\kappa\bigr).
                                                               \tag{3.10}
\]

Apply `D_0^(-1)` and use `z perpendicular kappa` to solve the coefficient
of `Phi`.  This is exactly (3.6)--(3.7).  \(\square\)

For `V_j=Uv_j`, put

\[
 a_j={\langle v_j,f\rangle\over\sqrt{\vartheta_j}}
     =\langle r_j,y\rangle.                         \tag{3.11}
\]

Because

\[
 \langle b,V_j\rangle
 =\overline{\langle V_j,b\rangle}
 =\overline{\langle v_j,f\rangle},                \tag{3.12}
\]

equations (1.5), (2.1), and (3.7) give the conjugation-correct transport

\[
 \boxed{
 V_j=\sqrt{\vartheta_j}\,
       \mathcal R\bigl(D\iota_Lr_j
                      +\overline{a_j}D\kappa\bigr).} \tag{3.13}
\]

## 4. Complete source amplitude and feedback ratio

Use the locked interval and complete ordinary-Chebyshev discrepancy

\[
 L=2\log\lambda,
 \qquad
 G_\lambda(t)=e^t-\psi_C(e^t)
              -{1\over2}\log(1-e^{-2t}),
 \qquad 0<t\le L,                                  \tag{4.1}
\]

where `psi_C(X)=sum_(n<=X) Lambda(n)` is right-continuous and includes every
prime power through `n<=lambda^2`.  For `z in K`, let

\[
 q_z(t)=\langle z,K_t\kappa\rangle,
 \qquad w_z(t)=e^{-t/2}q_z(t).                      \tag{4.2}
\]

The complete combined pole--archimedean--minus-prime forcing is the
conjugate-linear functional

\[
 \boxed{
 \mathfrak F_\lambda(z)=\langle z,b\rangle
 =-\int_0^L G_\lambda(t)w_z'(t)\,dt.}              \tag{4.3}
\]

The endpoint atom is retained before the boundary cancellation.  No source
block is absolutized separately in (4.3).

Define

\[
 \gamma=\mathfrak F_\lambda(\mathcal R D\kappa)
       =\langle\mathcal R D\kappa,b\rangle,
 \qquad
 c_j=\mathfrak F_\lambda(\mathcal R D\iota_Lr_j)
       =\langle\mathcal R D\iota_Lr_j,b\rangle.     \tag{4.4}
\]

Applying the conjugate-linear functional (4.3) to (3.13) gives

\[
 \boxed{(1-\gamma)a_j=c_j.}                         \tag{4.5}
\]

The conjugate on `a_j` in (3.13) is essential: conjugate-linearity turns it
back into `a_j gamma` in (4.5).

If `D|_K:K -> H_-` is invertible, equivalently
`<e_0,kappa> != 0`, then (3.8), the matrix determinant lemma, and the other
displayed invertibility assumptions imply

\[
 1-\overline\gamma
 =\det(\mathcal R(D|_{\mathcal K})B)\ne0.           \tag{4.6}
\]

This proves finite nonvanishing only.  It gives no schedule-uniform lower
bound for `|1-gamma|`.  If the denominator in (4.5) vanishes, the screened
ratio is undefined and the branch must fail closed.

Since `(r_j)` is orthonormal, (4.5) gives the full-spectrum identity

\[
 \boxed{
 A_M={\|P_{\mathcal L}D^*\mathcal R^*b\|^2
             \over|1-\gamma|^2}.}                  \tag{4.7}
\]

Formula (4.7) is exactly equivalent to (2.3) and to the all-direction source
inequality of checkpoint 0.73.  It is a source-adapted normal form, not a
weaker theorem.

## 5. Sharp near-null cluster split

The full-source forcing energy is

\[
 \beta_0=\langle f,R_0^{-1}f\rangle
        =\sum_j|\langle v_j,f\rangle|^2
        =\sum_j\vartheta_j|a_j|^2.                 \tag{5.1}
\]

For a threshold `tau>0`, let `P_<=tau^r` be the Euclidean projector onto
the span of those `r_j` with `vartheta_j<=tau`.  Then

\[
\boxed{
 A_M\le
 {\|P_{\le\tau}^rP_{\mathcal L}D^*\mathcal R^*b\|^2
       \over|1-\gamma|^2}
 +{\beta_0\over\tau}.}                             \tag{5.2}
\]

The first term is the exact low-cluster contribution.  The second estimate
is sharp given only the total energy `beta_0` and the threshold: forcing mass
may lie arbitrarily close above `tau`.

Thus, conditional on an independently proved complementary energy bound,
the weakest aggregate near-null lemma of this form is

\[
 \sum_{\vartheta_j\le\tau}|c_j|^2
 \le {C_{\rm low}^2\over\lambda}|1-\gamma|^2,
 \qquad
 {\beta_0\over\tau}\le {C_{\rm high}^2\over\lambda}. \tag{5.3}
\]

It would imply

\[
 A_M\le {C_{\rm low}^2+C_{\rm high}^2\over\lambda}. \tag{5.4}
\]

No estimate in (5.3) is proved here.  The first is still an actual-source
signed-cancellation statement, now tested only against screened near-null
profiles.  The second must not be inferred from the scalar worst-direction
bound without a proved choice of `tau`.

## 6. Exact nonzero-displacement source-Cauchy countermodel

The following `N=1` family shows that the exact source-Cauchy displacement,
simple even ground, strict odd shifted sign, boundary nonvanishing, and a
positive full-source metric do not force a second spectral factor.

Fix `epsilon>0` and set

\[
 a_0={\varepsilon\over5},
 \qquad
 a_1={\varepsilon(4-\sqrt2)\over5},
 \qquad
 b_1^{\rm C}={\sqrt2\,\varepsilon\over5},
 \qquad b_{-1}^{\rm C}=-b_1^{\rm C}.               \tag{6.1}
\]

Use the exact source-Cauchy entries

\[
 Q_{nn}=a_{|n|},
 \qquad
 Q_{nm}={b_n^{\rm C}-b_m^{\rm C}\over n-m}
 \quad(n\ne m).                                    \tag{6.2}
\]

In the normalized parity bases this gives

\[
 Q_+={\varepsilon\over5}
       \begin{pmatrix}1&2\\2&4\end{pmatrix},
 \qquad
 Q_-={\varepsilon(4-2\sqrt2)\over5}>0,
 \qquad
 \beta={2\varepsilon\over5}e_1^-\ne0.             \tag{6.3}
\]

The parity commutator is exact:

\[
 DQ_+-Q_-D=|\beta\rangle\langle\eta|,
 \qquad
 D=(0,1),
 \qquad
 \eta=(1,\sqrt2).                                  \tag{6.4}
\]

Take

\[
 \kappa={1\over5}(3,4),
 \qquad
 w={1\over5}(-4,3),
 \qquad \mathcal K=\mathcal L=\mathbb Cw.         \tag{6.5}
\]

The simple global ground is the inversion-even vector `(-2,1)/sqrt(5)` at
`mu=0`.  Its boundary and anchor overlaps are

\[
 { -2+\sqrt2\over\sqrt5}\ne0,
 \qquad
 {-2\over5\sqrt5}\ne0.                            \tag{6.6}
\]

There is no high block, and direct exact calculation gives

\[
 q={121\varepsilon\over125},
 \qquad
 S=B={4\varepsilon\over125},
 \qquad
 f={22\varepsilon\over125},
 \qquad
 \boxed{A_M={f^2\over S^2}={121\over4}.}           \tag{6.7}
\]

For any scalar positive source metric `R_0=rho`,

\[
 \vartheta={S^2\over\rho},
 \qquad
 {f/\sqrt\rho\over\sqrt\vartheta}={11\over2}.    \tag{6.8}
\]

Thus the generalized eigenvalue may tend to zero while its normalized
alignment contribution stays equal to `121/4`.  Taking `epsilon->0` keeps
the odd sign strict at every finite point; alternatively, increasing `rho`
at fixed `epsilon` makes the generalized eigenvalue small while the odd gap
is fixed.  The latter observation concerns arbitrary positive row metrics,
not the pinned arithmetic source metric.

For the screened map in (3.6), one obtains exactly

\[
 \mathcal R(e_1^-)={25\over4\varepsilon}w,
 \qquad
 \gamma={22\over25},
 \qquad
 c={33\over50},
 \qquad
 {c\over1-\gamma}={11\over2}.                      \tag{6.9}
\]

The odd resolvent contributes the reciprocal `epsilon` which cancels the
small source forcing.  This is precisely why the source commutator does not
create another spectral factor.

This family is a logical source-Cauchy/displacement model.  It is not the
pinned arithmetic Weil matrix and `kappa` is not asserted to be the
source-normalized prolate state.  It proves only non-implication from the
currently isolated abstract structure.

## 7. Remaining arithmetic obligation

The only possible gain is source-specific.  One must prove either the
original complete-source inequality or a conditional cluster certificate
such as (5.3), using the actual `G_lambda`, actual source-normalized prolate
anchor, actual screened odd resolvent, and actual right generalized singular
cluster.  The exact `sqrt(vartheta)` factor, the commutator, and whitening do
not supply the missing decay.
