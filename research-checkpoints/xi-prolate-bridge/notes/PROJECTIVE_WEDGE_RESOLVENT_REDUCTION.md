# Projective wedge and transverse-resolvent reduction

## 0. Claim boundary

This note makes the projective freedom in the finite ground **line** exact.
The preceding low-mode and Mellin-graph bounds estimate the complete
coefficient-normalized correction

\[
 z_\mu=(A-\mu I)^{-1}b.
\]

That is still stronger than necessary: a component which only rescales the
comparison transform does not change its zeros.  Two exact refinements remove
that component.

1. At a Fourier cutoff, the low projective error depends only on the part of
   `P_M z_mu` perpendicular to `P_M kappa`.
2. On a compact complex set, normalization at one fixed nonreal anchor turns
   the error into the wedge

   \[
    \widehat\kappa(z_0)\widehat z_\mu(z)
    -\widehat\kappa(z)\widehat z_\mu(z_0).
   \]

Both quantities have one-inverse graph-leverage bounds.  The compact wedge
route needs no complete Euclidean resolvent norm.  These are conditional
reductions: the strict shifted even and odd signs, the source-specific graph
products, and an unbounded schedule are not proved.  Consequently this note
does not prove equation (5.2), locally uniform convergence for the Weil
matrices, or the Riemann hypothesis.  No zero table or global Weil positivity
is used, and the formal project state remains `P0_INVALIDATED`.

The notation and conventions are those of
`notes/PROJECTIVE_LOW_MODE_DETERMINANT_BRIDGE.md` and
`notes/VECTOR_SPECIFIC_EQUATION_52_ATTACK.md`.

## 1. Finite Feshbach line

Fix one finite pair `(lambda,N)`.  In the inversion-even sector write

\[
 Q_+=\begin{bmatrix}q&b^*\\ b&A\end{bmatrix}
 \quad\hbox{on}\quad
 \mathbb C\kappa\oplus\mathcal K,
 \qquad \|\kappa\|=1.                                \tag{1.1}
\]

Let `U` be a rigorous variational upper bound and assume

\[
 B:=A-U I\succ0,
 \qquad Q_- -U I\succ0.                              \tag{1.2}
\]

Then the global ground value `mu<=U` is simple and inversion even.  Give its
unit vector `xi` the phase for which

\[
 c=\langle\kappa,\xi\rangle>0.
\]

The exact coefficient-normalized ground line is

\[
 w:={\xi\over c}=\kappa-z_\mu,
 \qquad z_\mu=(A-\mu I)^{-1}b\in\mathcal K.          \tag{1.3}
\]

In particular,

\[
 \langle\kappa,z_\mu\rangle=0,
 \qquad c=(1+\|z_\mu\|^2)^{-1/2}.                  \tag{1.4}
\]

Put

\[
 \mathcal E_U=\langle b,B^{-1}b\rangle.             \tag{1.5}
\]

For every Riesz vector `g` representing a linear observation on
`mathcal K`, the same one-inverse factorization as in the preceding note
gives

\[
 \boxed{
 |\langle g,z_\mu\rangle|^2
 \leq \mathcal E_U\,\langle g,B^{-1}g\rangle.}      \tag{1.6}
\]

Indeed, `A-mu I=B+(U-mu)I`, and in a spectral basis of `B`,

\[
 \|B^{1/2}(A-\mu I)^{-1}b\|^2
 \leq\langle b,B^{-1}b\rangle.                     \tag{1.7}
\]

## 2. Exact low-mode projective geometry

Let `P=P_M` be a centered Fourier projection and put

\[
 x=P\kappa,
 \qquad u=Pz_\mu,
 \qquad y=Pw=x-u.                                    \tag{2.1}
\]

Assume first that `x` and `y` are nonzero.  Let `Pi_x` be the orthogonal
projection onto `C*x` inside `E_M` and set

\[
 S_M=(I-\Pi_x)P|_{\mathcal K}.                       \tag{2.2}
\]

### Theorem 2.1 (exact projective low distance)

One has

\[
 \boxed{
 \inf_{t\in\mathbb C}\|P(tw-\kappa)\|
 ={\|x\|\,\|S_Mz_\mu\|\over\|y\|}.}              \tag{2.3}
\]

The minimizing scalar is the ordinary least-squares coefficient

\[
 t_M={\langle y,x\rangle\over\|y\|^2}               \tag{2.4}
\]

for the convention in which the inner product is linear in its second
argument.  Formula (2.3) is independent of that convention.

**Proof.**  Least squares gives

\[
 \inf_t\|ty-x\|^2
 =\|x\|^2-{|\langle y,x\rangle|^2\over\|y\|^2}.
\]

The Gram determinant of `(x,y)=(x,x-u)` equals the Gram determinant of
`(x,u)`.  Hence its numerator is

\[
 \|x\|^2\|u\|^2-|\langle x,u\rangle|^2
 =\|x\|^2\|(I-\Pi_x)u\|^2,
\]

which proves (2.3).  \(\square\)

If `y=0`, the projective distance is `||x||`, so a sequence with
`||x||->1` cannot pass by hiding in this exceptional case.

The removed component is exactly a low--high cancellation.  Put

\[
 h=(I-P)\kappa,
 \qquad z_H=(I-P)z_\mu.
\]

Orthogonality in (1.4) gives

\[
 \boxed{\langle x,u\rangle=-\langle h,z_H\rangle.}  \tag{2.5}
\]

Consequently,

\[
 \boxed{
 \|u\|^2=\|S_Mz_\mu\|^2
 +{|\langle h,z_H\rangle|^2\over\|x\|^2}.}         \tag{2.6}
\]

Thus a complete low-resolvent norm pays for a component which projective
normalization removes exactly.

Define

\[
 \Lambda_{M,\perp}(U)
 =\sup_{s\leq U}\|S_M(A-sI)^{-1}b\|,                \tag{2.7}
\]

\[
 \Theta_{M,\perp}(U)
 =\|S_MB^{-1}S_M^*\|.                               \tag{2.8}
\]

The proof of the one-inverse low-leverage theorem applies verbatim and
gives

\[
 \boxed{
 \Lambda_{M,\perp}(U)^2
 \leq\Theta_{M,\perp}(U)\mathcal E_U.}              \tag{2.9}
\]

Moreover `Theta_(M,perp)<=Theta_M`; equality need not hold.

### Corollary 2.2 (lambda-scale transverse target)

On the locked prolate schedule take `M=ceil(lambda)`.  The proved projection
estimate, divided by the established limit `a->a_infinity>0`, gives

\[
 \|(I-P_M)\kappa\|=O(\lambda^{-1/2})                 \tag{2.10}
\]

up to the smaller displayed logarithmic tail.  Conditional on (1.2), the
following are sufficient for the low/high transform hypotheses of the
projective bridge:

\[
 \boxed{
 \Lambda_{M,\perp}(U)=\lambda^{-1/2+o(1)},
 \qquad
 \|(A-U I)^{-1}b\|=\lambda^{o(1)}.}                 \tag{2.11}
\]

Equivalently, the first condition follows from

\[
 \boxed{
 \mathcal E_U\Theta_{M,\perp}(U)
 =\lambda^{-1+o(1)}.}                               \tag{2.12}
\]

**Proof.**  The complete shifted solve bounds `||z_mu||` and hence
`||z_H||` by `lambda^(o(1))`.  Equations (2.5) and (2.10) show that the
coefficient of `u` parallel to `x` is `o(1)`, while (2.11) makes its
perpendicular part tend to zero.  Therefore `y=x-u` has norm bounded away
from zero, the minimizing scalar in (2.4) is nonzero and tends to one, and
(2.3) is `lambda^(-1/2+o(1))`.  The high part of

\[
 t_Mw-\kappa=(t_M-1)\kappa-t_Mz_\mu                 \tag{2.13}
\]

has norm `lambda^(o(1))`.  At `M=ceil(lambda)`, the exact Cauchy-transform
tail factor

\[
 \lambda^\eta\sqrt{\log\lambda/\lambda}
\]

kills this norm for every fixed `eta<1/2`, while the low factor kills
`lambda^(-1/2+o(1))`.  Equation (2.9) proves (2.12).  \(\square\)

The corollary removes only one observed low direction.  It does not prove
the unsigned middle-block sign which is missing from the current
three-scale coercivity argument.

## 3. Anchor-normalized compact wedge

The complete Euclidean solve in Corollary 2.2 can be avoided by working
directly with the transform.  Fix once and for all

\[
 z_0=i\sigma,
 \qquad 0<\sigma<1/2.                               \tag{3.1}
\]

For a complex point `z`, let `g_z in mathcal K` be the Riesz vector for
`v -> widehat v(z)`.  Write

\[
 \kappa_z=\widehat\kappa(z).
\]

Define `h_(z,z0) in mathcal K` to be the Riesz vector for the projective
wedge functional

\[
 v\longmapsto
 \kappa_{z_0}\widehat v(z)-\kappa_z\widehat v(z_0).
                                                               \tag{3.2}
\]

For a compact set `K` in the open strip put

\[
 \mathcal L_{z_0}(U)=\langle g_{z_0},B^{-1}g_{z_0}\rangle,
                                                               \tag{3.3}
\]

\[
 \mathcal L_{K,\wedge}(U)
 =\sup_{z\in K}\langle h_{z,z_0},B^{-1}h_{z,z_0}\rangle.
                                                               \tag{3.4}
\]

### Theorem 3.1 (projective wedge graph bound)

The exact correction satisfies

\[
 \boxed{
 |\widehat z_\mu(z_0)|^2
 \leq\mathcal E_U\mathcal L_{z_0}(U),}              \tag{3.5}
\]

\[
 \boxed{
 |\kappa_{z_0}\widehat z_\mu(z)
  -\kappa_z\widehat z_\mu(z_0)|^2
 \leq\mathcal E_U\mathcal L_{K,\wedge}(U)
 \quad(z\in K).}                                   \tag{3.6}
\]

**Proof.**  Apply (1.6) first with `g_(z0)` and then with the Riesz vector
defined by (3.2).  \(\square\)

Now let `lambda_j->infinity` along a sequence satisfying the finite signs
(1.2), and restore subscripts `j`.  Put

\[
 p_j=P_{N_j}k_{\lambda_j}^+=a_j\kappa_j.
\]

The source projection and normalization theorems give

\[
 a_j\to a_\infty>0,
 \qquad
 a_j\kappa_{j,z_0}=\widehat p_j(z_0)
 \longrightarrow {\Xi(z_0)\over4}\ne0.             \tag{3.7}
\]

The last value is nonzero because `z_0=i*sigma` corresponds to a real point
strictly between zero and one, where zeta has no zero.

Assume, for every compact `K` in the open strip,

\[
 \boxed{
 a_j^2\mathcal E_{U_j}\mathcal L_{z_0}(U_j)
 \longrightarrow0,}                                \tag{3.8}
\]

\[
 \boxed{
 a_j^2\mathcal E_{U_j}\mathcal L_{K,\wedge}(U_j)
 \longrightarrow0.}                                \tag{3.9}
\]

Since the finite ground transform has only real zeros,
`widehat(w_j)(z_0)` is nonzero; (3.7) also makes `kappa_(j,z_0)` nonzero
after discarding finitely many indices.  On that tail, define the
zero-preserving normalization

\[
 F_j(z)=4a_j\kappa_{j,z_0}
 {\widehat w_j(z)\over\widehat w_j(z_0)}.            \tag{3.10}
\]

### Theorem 3.2 (anchor-normalized determinant criterion)

Under (1.2), (3.8), (3.9), and the already-proved projection hypothesis,
the functions `F_j` converge locally uniformly to `Xi` in the open strip.

**Proof.**  By (3.5) and (3.8),

\[
 a_j|\widehat z_{\mu_j}(z_0)|\longrightarrow0.
\]

Together with (3.7), this bounds `widehat(w_j)(z_0)` away from zero.  The
identity `w_j=kappa_j-z_(mu_j)` gives the exact projective cancellation

\[
\begin{aligned}
 F_j(z)-4\widehat p_j(z)
 =-{4a_j\over\widehat w_j(z_0)}
 \{\kappa_{j,z_0}\widehat z_{\mu_j}(z)
   -\kappa_{j,z}\widehat z_{\mu_j}(z_0)\}.          \tag{3.11}
\end{aligned}
\]

Equations (3.6) and (3.9) make the right side tend to zero uniformly on
`K`.  The proved projection estimate makes
`4*widehat(p_j)-4*widehat(k_(lambda_j)^+)` tend to zero locally uniformly,
and the source-normalized limit is
`4*widehat(k_(lambda_j)^+)->Xi`.  This proves the claim.  \(\square\)

This route is strictly projective: it permits a correction whose transform
is asymptotically a scalar multiple of the comparison transform on `K`.
The uncentered graph criterion would charge that component even though the
anchor normalization removes it exactly.

## 4. Exact quotient reconstruction

Let `W:X->mathcal K` be any onto physical source synthesis and put

\[
 \mathfrak B=W^*BW.
\]

The established quotient identity

\[
 W\mathfrak B^\dagger W^*=B^{-1}                    \tag{4.1}
\]

reconstructs every new factor without a source-coordinate condition number.
If `rho_R` represents the weak residual functional, and

\[
 y_0=W^*g_{z_0},
 \qquad y_{z,\wedge}=W^*h_{z,z_0},                   \tag{4.2}
\]

then

\[
 \boxed{
 a^2\mathcal E_U=\rho_R^*\mathfrak B^\dagger\rho_R,}
                                                               \tag{4.3}
\]

\[
 \boxed{
 \mathcal L_{z_0}(U)=y_0^*\mathfrak B^\dagger y_0,
 \qquad
 \mathcal L_{K,\wedge}(U)
 =\sup_{z\in K}y_{z,\wedge}^*\mathfrak B^\dagger
                         y_{z,\wedge}.}             \tag{4.4}
\]

Likewise,

\[
 \Theta_{M,\perp}(U)
 =\|S_MW\mathfrak B^\dagger W^*S_M^*\|.            \tag{4.5}
\]

These identities do not manufacture positivity.  Positivity of the
pullback on the quotient is equivalent to the missing physical shifted
sign.

## 5. Remaining source-specific obligation

The weakest exact route isolated here is:

1. prove the strict shifted even-complement and odd-sector signs on one
   unbounded source schedule;
2. prove the anchor product (3.8) and the compact projective-wedge product
   (3.9), or use the transverse low alternative (2.11)--(2.12);
3. retain every pole, archimedean, minus-prime, shift, and bridge cross term
   in the quotient form; and
4. combine those estimates with the already-proved source-normalized prolate
   projection and limit.

No numerical eigenvector agreement, finite real-axis agreement, or
unoriented coframe bound establishes these graph products.
