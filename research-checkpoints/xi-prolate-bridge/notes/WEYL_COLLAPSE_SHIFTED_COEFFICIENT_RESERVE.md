# Weyl collapse and a shifted coefficient reserve

## 0. Claim boundary and outcome

This note records two exact finite-dimensional consequences of the locked
source commutator.

First, the odd-resolvent Weyl reconstruction of
`notes/ODD_RESOLVENT_WEYL_RECONSTRUCTION.md` collapses to a normalized even
resolvent.  Its scalar determinant is exactly a relative characteristic
polynomial:

\[
 \mathfrak D_s
 =-\frac{\det(A-sI)}{\det(Q_- -sI)}.                 \tag{0.1}
\]

The two factors that appear separate in the odd reconstruction therefore
contain an exact cancellation.  A lower bound for `mathfrak D_s` and upper
bounds for the individual odd responses are sufficient for the transverse
middle estimate, but they are not logically necessary and can be much
stronger than the cancellation-preserving estimate.

Second, if the all-imaginary-axis criterion of
`notes/EVEN_GROUND_IMAGINARY_AXIS_ODD_INERTIA.md` has already proved the odd
sign at the actual even ground, the boundary-normalized Fourier
coefficients give the explicit pencil bound

\[
 \lambda_{\max}(X)\leq N^2+M_2,
 \qquad
 M_2=2\sum_{n=1}^N n^2|\xi_n|.                     \tag{0.2}
\]

Combining this with an exact Schur surplus at a Ritz upper value `U` gives
a scale-invariant sufficient condition for the required shifted odd sign.
That condition is a reduction to new arithmetic estimates, not an
arithmetic estimate itself.

Every identity below is finite and exact.  The arithmetic matrix `Q` is the
source-pinned pole--archimedean--minus-prime matrix; the minus sign on the
prime block, the Fourier sign, the interval, inversion, and the inclusive
prime-power endpoint are unchanged from `P0_SOURCE_LOCK.json`.  No source
block is separated before taking an absolute value in the new middle
target.  The `N=1` family in Section 5 is an exact-Cauchy structural model,
not the arithmetic Weil matrix and not the source-normalized prolate state.

This note proves no source-specific asymptotic bound, no odd sign on an
unbounded arithmetic schedule, no transverse estimate (5.5) of
`notes/THREE_SCALE_TRANSVERSE_RESOLVENT_REDUCTION.md`, no determinant
convergence, no new de Bruijn--Newman bound, and no Riemann-hypothesis
conclusion.  Numerical evidence cannot supply any missing implication.  The
formal project state remains `P0_INVALIDATED`.

The binding finite source is Connes--Consani--Moscovici, *Zeta Spectral
Triples*, arXiv:2511.22755v1, vendored as
`vendor/CCM-ZST-2511.22755v1.pdf`, SHA-256
`c98d89f7fc999d038e15e80a9aaaee2af797c17711c4329ca7ce48ad49cb336b`.
The exact source formulas and conventions are reproduced in
`notes/SOURCE_BOUNDARY_COMMUTATOR_PROOF.md`.

## 1. Exact finite setup

Fix `lambda>1` and modes `-N<=n<=N`.  Let

\[
 D V_n=nV_n,
 \qquad
 J V_n=V_{-n},
 \qquad
 \eta=\sum_{|n|\leq N}V_n,
 \qquad
 \beta=\sum_{|n|\leq N}b_nV_n.                    \tag{1.1}
\]

The source Cauchy formula and displacement identity are

\[
 Q_{nm}=\frac{b_n-b_m}{n-m}\quad(n\ne m),
 \qquad b_{-n}=-b_n,                               \tag{1.2}
\]

\[
 [D,Q]=|\beta\rangle\langle\eta|
       -|\eta\rangle\langle\beta|.               \tag{1.3}
\]

Here `Q` is real Hermitian and commutes with `J`.  The inner product is
antilinear in its first argument.  Let `H_+` and `H_-` be the inversion-even
and inversion-odd sectors and write `Q_+` and `Q_-` for the corresponding
blocks.  With

\[
 \mathcal D=P_-D|_{H_+}:H_+\longrightarrow H_-,    \tag{1.4}
\]

the plus-to-minus block of (1.3) is

\[
 \boxed{
 \mathcal DQ_+-Q_-\mathcal D
 =|\beta\rangle\langle\eta|.}                    \tag{1.5}
\]

The kernel of `mathcal D` is `C*V_0`, and
`<eta,V_0>=1`.

Fix a real unit even comparison state `kappa` and define

\[
 q=\langle\kappa,Q\kappa\rangle,
 \qquad
 \mathcal K=H_+\cap\kappa^\perp,
 \qquad
 A=P_{\mathcal K}Q|_{\mathcal K},                 \tag{1.6}
\]

\[
 b=(Q-qI)\kappa\in\mathcal K.                    \tag{1.7}
\]

For a real `s` for which `A-sI` is invertible, put

\[
 z_s=(A-sI)^{-1}b,
 \qquad
 w_s=\kappa-z_s,                                  \tag{1.8}
\]

\[
 d_s=q-s-\langle b,(A-sI)^{-1}b\rangle.           \tag{1.9}
\]

Then

\[
 \langle\kappa,w_s\rangle=1,
 \qquad
 (Q_+-sI)w_s=d_s\kappa.                           \tag{1.10}
\]

Assume also that `Q_- -sI` is invertible.  The odd-resolvent construction
defines

\[
 \Phi_s=
 \left(1+\langle\eta,D^\dagger
       (Q_- -sI)^{-1}\beta\rangle\right)V_0
 -D^\dagger(Q_- -sI)^{-1}\beta,                  \tag{1.11}
\]

\[
 \Psi_s=D^\dagger(Q_- -sI)^{-1}D\kappa
 -\langle\eta,D^\dagger(Q_- -sI)^{-1}D\kappa\rangle
  V_0.                                             \tag{1.12}
\]

They obey

\[
 \langle\eta,\Phi_s\rangle=1,
 \qquad
 \langle\eta,\Psi_s\rangle=0,                    \tag{1.13}
\]

and there are scalars `alpha_s,gamma_s` such that

\[
 (Q_+-sI)\Phi_s=\alpha_sV_0,
 \qquad
 (Q_+-sI)\Psi_s-\kappa=\gamma_sV_0.              \tag{1.14}
\]

Finally set

\[
 p_s=\langle\kappa,\Phi_s\rangle,
 \qquad
 r_s=\langle\kappa,\Psi_s\rangle,
 \qquad
 \mathfrak D_s=p_s\gamma_s-r_s\alpha_s.          \tag{1.15}
\]

These definitions retain the source signs in (1.3).  In particular, no
assumed list of zeta zeros or global Weil positivity is used.

## 2. Exact scalar collapse of the Weyl reconstruction

Suppose temporarily that `Q_+-sI` is also invertible and write

\[
 R_s^+=(Q_+-sI)^{-1}.                              \tag{2.1}
\]

Introduce four scalar resolvent entries

\[
 m_s=\langle\kappa,R_s^+\kappa\rangle,
 \qquad
 h_s=\langle\eta,R_s^+V_0\rangle,                 \tag{2.2}
\]

\[
 \rho_s=\langle\eta,R_s^+\kappa\rangle,
 \qquad
 \tau_s=\langle\kappa,R_s^+V_0\rangle.           \tag{2.3}
\]

### Theorem 2.1 (resolvent scalar collapse)

Under the three invertibility hypotheses above,

\[
 \boxed{
 \Phi_s=\frac{R_s^+V_0}{h_s},
 \qquad
 \alpha_s=\frac1{h_s},}                           \tag{2.4}
\]

\[
 \boxed{
 \Psi_s=R_s^+\kappa-\frac{\rho_s}{h_s}R_s^+V_0,
 \qquad
 \gamma_s=-\frac{\rho_s}{h_s},}                  \tag{2.5}
\]

and

\[
 \boxed{
 p_s=\frac{\tau_s}{h_s},
 \qquad
 r_s=m_s-\frac{\rho_s\tau_s}{h_s}.}              \tag{2.6}
\]

Consequently,

\[
 \boxed{\mathfrak D_s=-\frac{m_s}{h_s}.}          \tag{2.7}
\]

The coefficient-normalized constrained solution is

\[
 \boxed{
 d_s=\frac1{m_s},
 \qquad
 \langle\eta,w_s\rangle=\frac{\rho_s}{m_s},
 \qquad
 w_s=\frac{R_s^+\kappa}{m_s}.}                    \tag{2.8}
\]

**Proof.**  Apply `R_s^+` to the first equation in (1.14).  This gives
`Phi_s=alpha_s R_s^+V_0`.  Pairing with `eta` and using (1.13) gives
`alpha_s h_s=1`, proving (2.4).

The second equation in (1.14) gives

\[
 \Psi_s=R_s^+\kappa+\gamma_sR_s^+V_0.             \tag{2.9}
\]

Pairing with `eta` and using (1.13) yields
`rho_s+gamma_s h_s=0`, which is (2.5).  Pairing (2.4)--(2.5) with `kappa`
proves (2.6).  Direct substitution in (1.15) now cancels the two cross
terms:

\[
 \begin{aligned}
 \mathfrak D_s
 &=\frac{\tau_s}{h_s}\left(-\frac{\rho_s}{h_s}\right)
   -\left(m_s-\frac{\rho_s\tau_s}{h_s}\right)
    \frac1{h_s}\\
 &=-\frac{m_s}{h_s}.
 \end{aligned}                                      \tag{2.10}
\]

The block Schur complement in the decomposition
`H_+=C*kappa direct-sum mathcal K` gives

\[
 m_s^{-1}=q-s-\langle b,(A-sI)^{-1}b\rangle=d_s.   \tag{2.11}
\]

Thus `R_s^+kappa/m_s` has inner product one with `kappa` and satisfies
the same equation (1.10) as `w_s`.  Invertibility of `A-sI` gives
uniqueness, proving the last identity in (2.8).  Pairing it with `eta`
proves the remaining coefficient formula.  \(\square\)

Let `P_L` denote the transverse low observation from the three-scale
reduction.  Since `P_Lkappa=0`, (1.8) and (2.8) give the exact identity

\[
 \boxed{
 P_L(A-sI)^{-1}b
 =-\frac{P_LR_s^+\kappa}
         {\langle\kappa,R_s^+\kappa\rangle}.}      \tag{2.12}
\]

For `s=U-h`, this is precisely `Omega_h^(-1)eta_h`.  Formula (2.12) is the
complete cancellation hidden when the two odd responses and
`1/|mathfrak D_s|` are bounded separately.

At a simple even eigenvalue `epsilon` below the spectrum of `A`, `R_s^+`
has a pole and the individual entries in (2.2)--(2.3) are not defined at
`s=epsilon`.  Equations (2.7), (2.8), and (2.12) have the corresponding
projective limits.  The determinant formula in the next section is regular
there and supplies the exact extension of `mathfrak D_s`.

## 3. Relative determinant and the finite spectral-shift integral

Define the coordinate map

\[
 \mathcal T:H_+\longrightarrow\mathbb C\oplus H_-,
 \qquad
 \mathcal T f=(\langle\eta,f\rangle,\mathcal Df).  \tag{3.1}
\]

This map is an isomorphism.  Indeed, if `mathcal T f=0`, then
`mathcal Df=0`, so `f` is a multiple of `V_0`; the first coordinate and
`<eta,V_0>=1` then force that multiple to vanish.  The dimensions on the
two sides are both `N+1`.

### Theorem 3.1 (relative characteristic polynomial)

Whenever `Q_- -sI` is invertible,

\[
 \boxed{
 \alpha_s=\frac{\det(Q_+-sI)}{\det(Q_- -sI)}.}     \tag{3.2}
\]

Whenever `Q_+-sI` is also invertible,

\[
 \boxed{
 h_s=\frac{\det(Q_- -sI)}{\det(Q_+-sI)},
 \qquad
 m_s=\frac{\det(A-sI)}{\det(Q_+-sI)}.}            \tag{3.3}
\]

If in addition `A-sI` is invertible, then

\[
 \boxed{
 \mathfrak D_s
 =-\frac{\det(A-sI)}{\det(Q_- -sI)}.}              \tag{3.4}
\]

Identity (3.4) extends through an even eigenvalue at which `A-sI` and
`Q_- -sI` remain invertible.

**Proof.**  By (1.5), the lower row of the conjugated matrix

\[
 \mathcal T(Q_+-sI)\mathcal T^{-1}
 =\begin{bmatrix}
   \ell_s&L_s\\
   \beta&Q_- -sI
  \end{bmatrix}                                     \tag{3.5}
\]

has exactly the displayed form.  The coordinate vector of `Phi_s` is

\[
 \mathcal T\Phi_s
 =\begin{bmatrix}1\\-(Q_- -sI)^{-1}\beta\end{bmatrix},
                                                           \tag{3.6}
\]

while (1.14) and `mathcal T V_0=(1,0)` give

\[
 \mathcal T(Q_+-sI)\Phi_s
 =\begin{bmatrix}\alpha_s\\0\end{bmatrix}.         \tag{3.7}
\]

Hence the scalar Schur complement of the lower-right block in (3.5) is
`alpha_s`.  Taking determinants and using similarity proves (3.2).
Equation (2.4) gives the first identity in (3.3).

Relative to `C*kappa direct-sum mathcal K`, the even block is

\[
 Q_+-sI=
 \begin{bmatrix}
  q-s&b^*\\
  b&A-sI
 \end{bmatrix}.                                    \tag{3.8}
\]

The adjugate formula for the `kappa,kappa` resolvent entry gives directly

\[
 m_s=\frac{\det(A-sI)}{\det(Q_+-sI)}.              \tag{3.9}
\]

This proves the second identity in (3.3) whenever `Q_+-sI` is invertible,
including when `A-sI` is singular.  When `A-sI` is invertible, its scalar
Schur complement is `d_s`, and the same identity can also be written as

\[
 \det(Q_+-sI)=\det(A-sI)d_s,
 \qquad m_s=d_s^{-1}.                              \tag{3.9a}
\]

Combining (2.7) and (3.3) proves (3.4) away from the even spectrum.  Both
sides of (3.4) are
continuous at any even eigenvalue where the two matrices in its quotient
remain invertible, proving the extension.  \(\square\)

Suppose now that

\[
 A-U I\succ0,
 \qquad Q_- -U I\succ0.                            \tag{3.10}
\]

For every `s<=U`, (3.4) has a fixed negative sign and

\[
 |\mathfrak D_s|
 =\frac{\det(A-sI)}{\det(Q_- -sI)}>0.              \tag{3.11}
\]

Differentiating the two finite log determinants gives

\[
 \boxed{
 \frac d{ds}\log|\mathfrak D_s|
 =\operatorname {Tr}(Q_- -sI)^{-1}
  -\operatorname {Tr}(A-sI)^{-1}.}                 \tag{3.12}
\]

Both determinants in (3.11) have degree `N`, so their ratio tends to one
as `s` tends to minus infinity.  Therefore

\[
 \boxed{
 \log|\mathfrak D_s|
 =\int_{-\infty}^{s}
  \left\{\operatorname {Tr}(Q_- -tI)^{-1}
        -\operatorname {Tr}(A-tI)^{-1}\right\}dt.} \tag{3.13}
\]

There is no sign for the integrand in (3.13) under the current source
hypotheses.  For example, a sufficient relative determinant floor would
follow from a new estimate of the form

\[
 \int_{-\infty}^{U}
 \left[
  \operatorname {Tr}(A-tI)^{-1}
  -\operatorname {Tr}(Q_- -tI)^{-1}
 \right]_+dt\leq C,                                \tag{3.14}
\]

but no such schedule-uniform arithmetic estimate is proved here or in the
current source lock.  The scalar `m_s` is a diagonal resolvent entry and has
the usual Nevanlinna property off the real axis.  The cross entry `h_s` is
not a diagonal resolvent entry and need not be Herglotz.  Abstract
Herglotz theory therefore supplies no lower bound for `|m_s/h_s|`.

## 4. Endpoint monotonicity and the cancellation-preserving target

The separate odd response suprema do have an exact endpoint reduction, but
this is not a size bound.

### Lemma 4.1 (endpoint reduction)

If `Q_- -U I` is positive and `f in H_-`, then

\[
 \sup_{s\leq U}\|(Q_- -sI)^{-1}f\|
 =\|(Q_- -U I)^{-1}f\|.                            \tag{4.1}
\]

In particular, (4.1) applies to both `f=beta` and `f=Dkappa`.

**Proof.**  Put `R_s^-=(Q_- -sI)^{-1}`.  Spectral calculus gives

\[
 \frac d{ds}\|R_s^-f\|^2
 =2\langle f,(R_s^-)^3f\rangle\geq0               \tag{4.2}
\]

for `s<=U`.  \(\square\)

The same argument shows that `||(A-sI)^(-1)b||` is nondecreasing on
`s<=U` when `A-U I` is positive.  The projected quantity
`||P_L(A-sI)^(-1)b||` need not be monotone, because the projection need not
commute with `A`.

There is also an exact scalar monotonicity.  Differentiating (1.9) gives

\[
 \boxed{
 d_s'=-1-\|(A-sI)^{-1}b\|^2=-\|w_s\|^2<0.}         \tag{4.3}
\]

The last equality uses the orthogonal decomposition
`w_s=kappa-(A-sI)^(-1)b`.  Thus `d_s` is strictly decreasing on every real
interval where `A-sI` is invertible.  In the comparison range used here,
`A-U I` is positive, so this includes every `s<=U`.

The cancellation-preserving arithmetic target exposed by Section 2 is

\[
 \boxed{
 \sup_{s\leq U}
 \frac{\|P_L(Q_+-sI)^{-1}\kappa\|}
 {|\langle\kappa,(Q_+-sI)^{-1}\kappa\rangle|}
 =\lambda^{-1/2+o(1)}.}                            \tag{4.4}
\]

At an even pole, the quotient in (4.4) means its projective limit.  By
(2.12), (4.4) is exactly

\[
 \sup_{s\leq U}\|P_L(A-sI)^{-1}b\|
 =\lambda^{-1/2+o(1)},                             \tag{4.5}
\]

which is the middle target (5.5) of the three-scale reduction.  Equations
(3.14) and (4.1) would give a sufficient route based on separate factors,
but (4.4) preserves the exact cancellation and is the weaker theorem that
the RH bridge actually needs.  Neither (4.4) nor (4.5) is proved here.

## 5. An `N=1` exact-Cauchy obstruction to a Weyl floor

The relative determinant can collapse even with exact Cauchy displacement,
simple even ground, strict finite signs, and small residual.  This does not
model the arithmetic comparison state; it isolates the missing alignment or
even-margin information.

Take `N=1`, `beta=0`, and raw diagonal entries

\[
 a_0=0,
 \qquad a_{-1}=a_1=1.                              \tag{5.1}
\]

All off-diagonal entries in (1.2) vanish.  In the parity bases,

\[
 Q_+=\operatorname {diag}(0,1),
 \qquad Q_-=[1].                                   \tag{5.2}
\]

For `0<t<1`, let

\[
 \kappa_t=tV_0+\sqrt{1-t^2}\,e_1^+,
 \qquad U=\epsilon=0.                              \tag{5.3}
\]

The even ground is simple, `Q_- -U I=[1]`, and the comparison complement is
one-dimensional.  The unit vector

\[
 y_t=-\sqrt{1-t^2}\,V_0+t e_1^+                  \tag{5.4}
\]

spans it, and direct calculation gives

\[
 A-U I=[t^2],
 \qquad
 q=1-t^2,
 \qquad
 \|(Q-qI)\kappa_t\|=t\sqrt{1-t^2}.               \tag{5.5}
\]

Nevertheless, (3.4) gives

\[
 \boxed{\mathfrak D_0=-t^2\longrightarrow0}
 \qquad(t\longrightarrow0),                      \tag{5.6}
\]

and, for every `s<0`,

\[
 |\mathfrak D_s|=\frac{t^2-s}{1-s}.               \tag{5.7}
\]

Thus strict positivity and a residual tending to zero do not imply a
uniform Weyl determinant floor.  Here the comparison state becomes
orthogonal to the true ground and the even complementary margin collapses;
the example identifies exactly why one of those quantitative inputs is
necessary.  It does not refute a source-specific estimate for the actual
prolate state.

There is also a Ritz-compatible two-parameter version.  Replace the two
ones in (5.1) by `delta>0`, take `U=q=delta(1-t^2)`, and assume
`t^2>1/2`.  Then

\[
 A-U I=[\delta(2t^2-1)]\succ0,
 \qquad
 Q_- -U I=[\delta t^2]\succ0,                     \tag{5.8}
\]

while

\[
 \mathfrak D_U=-\frac{2t^2-1}{t^2}.               \tag{5.9}
\]

Taking `t^2` down to `1/2` and `delta` down to zero makes the Weyl
determinant, residual, and Ritz lowering all tend to zero while both shifted
signs remain strict at every finite step.  Their quantitative margins also
collapse, so this version again shows that strict signs without a reserve
cannot prove a uniform floor.

## 6. The shifted squared-mode coefficient reserve

Let `epsilon` now be the simple lowest eigenvalue of `Q_+`, with real unit
eigenvector `x`, and assume

\[
 Q_+x=\epsilon x,
 \qquad
 c=\langle\eta,x\rangle\ne0,
 \qquad
 x_0=\langle V_0,x\rangle\ne0.                    \tag{6.1}
\]

Use the parity bases

\[
 e_0^+=V_0,
 \qquad
 e_n^+=\frac{V_n+V_{-n}}{\sqrt2},
 \qquad
 e_n^-=\frac{V_n-V_{-n}}{\sqrt2}.                 \tag{6.2}
\]

Put

\[
 T_+=Q_+-\epsilon I,
 \qquad
 T_-=Q_- -\epsilon I,
 \qquad
 K=\mathcal DT_+\mathcal D^*,                    \tag{6.3}
\]

\[
 d=\mathcal D\eta,
 \qquad
 u=\frac{\mathcal Dx}{c},
 \qquad
 X=D_-^2-|u\rangle\langle d|,                    \tag{6.4}
\]

where

\[
 D_-^2=\mathcal D\mathcal D^*
 =\operatorname {diag}(1^2,2^2,\ldots,N^2).       \tag{6.5}
\]

The locked commutator gives the exact factorization

\[
 K=T_-X.                                           \tag{6.6}
\]

Write the boundary-normalized even vector as

\[
 \frac{x}{c}=\sum_{n=-N}^N\xi_nV_n,
 \qquad \xi_{-n}=\xi_n,                           \tag{6.7}
\]

and define

\[
 M_2=2\sum_{n=1}^N n^2|\xi_n|.                    \tag{6.8}
\]

Assume in this section that the all-axis condition

\[
 A_x(\alpha)
 =1-2\sum_{n=1}^N\frac{n^2\xi_n}{n^2+\alpha^2}>0
 \qquad(\alpha\geq0)                              \tag{6.9}
\]

has already been proved.  By the exact inertia theorem, (6.9) implies
`T_->0` and that `X` is similar to a positive Hermitian matrix.  In
particular all eigenvalues of `X` are positive and real.

### Theorem 6.1 (coefficient bound for the pencil radius)

Under (6.1)--(6.9),

\[
 \boxed{\lambda_{\max}(X)\leq N^2+M_2.}            \tag{6.10}
\]

More sharply, if a real `R>N^2` satisfies

\[
 \boxed{
 2\sum_{n=1}^N\frac{n^2|\xi_n|}{R-n^2}<1,}        \tag{6.11}
\]

then

\[
 \boxed{\lambda_{\max}(X)<R.}                     \tag{6.12}
\]

**Proof.**  Let `rho` be an eigenvalue of `X` with `rho>N^2`.  The matrix
determinant lemma applied to `X-rho I` gives

\[
 1=\langle d,(D_-^2-\rho I)^{-1}u\rangle
  =2\sum_{n=1}^N\frac{n^2\xi_n}{n^2-\rho}.         \tag{6.13}
\]

Taking absolute values yields

\[
 1\leq2\sum_{n=1}^N\frac{n^2|\xi_n|}{\rho-n^2}
 \leq\frac{M_2}{\rho-N^2}.                        \tag{6.14}
\]

Thus `rho<=N^2+M_2`.  If the largest eigenvalue is at most `N^2`, the same
bound is immediate, proving (6.10).  If `rho>=R`, the right side of the
first inequality in (6.14) is no larger than the left side of (6.11), a
contradiction.  This proves (6.12).  \(\square\)

Let `g_e` be the gap from `epsilon` to the second even eigenvalue.  The
nonzero zero-mode coefficient makes `K` positive definite.  Define

\[
 H=K^{-1/2}T_-K^{-1/2}.                             \tag{6.15}
\]

From `K=T_-X`,

\[
 K^{1/2}XK^{-1/2}=H^{-1},
 \qquad
 T_-=K^{1/2}HK^{1/2}.                              \tag{6.16}
\]

The first identity makes `lambda_max(X)=lambda_max(H^(-1))`, and the
second gives

\[
 \lambda_{\min}(T_-)
 \geq\frac{\lambda_{\min}(K)}{\lambda_{\max}(X)}. \tag{6.17}
\]

For a unit odd vector `y`, the vector `z=mathcal D^*y` has zero `V_0`
coordinate.  Hence

\[
 \|P_{x^\perp}z\|^2\geq |x_0|^2\|z\|^2,
 \qquad \|z\|\geq\|y\|.                           \tag{6.18}
\]

The even gap therefore gives

\[
 \lambda_{\min}(K)\geq g_e|x_0|^2.                \tag{6.19}
\]

Combining (6.10), (6.17), and (6.19) yields the explicit reserve

\[
 \boxed{
 \lambda_{\min}(Q_- -\epsilon I)
 \geq\frac{g_e|x_0|^2}{N^2+M_2}.}                 \tag{6.20}
\]

The denominator `N^2+M_2` may be replaced by any `R` certified by (6.11).
No schedule-uniform arithmetic upper bound for `M_2`, and no compensating
lower bound for `|x_0|`, is proved here.

## 7. Schur surplus and a scale-invariant shifted criterion

Return to the comparison decomposition (1.6)--(1.9).  Assume

\[
 \epsilon\leq U<\alpha,
 \qquad
 \alpha=\lambda_{\min}(A),
 \qquad
 g_+=\alpha-U>0.                                  \tag{7.1}
\]

Since `A-epsilon I` is positive, the even ground eigenvector is not
orthogonal to `kappa`.  The scalar Schur complement consequently vanishes
at the ground:

\[
 d_\epsilon=0.                                    \tag{7.2}
\]

Define the exact Schur surplus at `U` by

\[
 \boxed{
 \chi_U=-d_U
 =\langle b,(A-U I)^{-1}b\rangle-(q-U).}           \tag{7.3}
\]

### Lemma 7.1 (Ritz lowering from the Schur surplus)

Under (7.1),

\[
 \boxed{0\leq U-\epsilon\leq\chi_U.}              \tag{7.4}
\]

**Proof.**  Equation (4.3) and (7.2) give

\[
 \chi_U=d_\epsilon-d_U
 =\int_\epsilon^U
  \left(1+\|(A-sI)^{-1}b\|^2\right)ds
 \geq U-\epsilon.                                 \tag{7.5}
\]

This also proves nonnegativity.  \(\square\)

Interlacing between `Q_+` and its codimension-one compression `A` gives

\[
 g_e\geq\alpha-\epsilon\geq\alpha-U=g_+.          \tag{7.6}
\]

### Theorem 7.2 (shifted odd sign from coefficient conditioning)

Assume the complete setup of Section 6, the all-axis sign (6.9), and
(7.1).  If

\[
 \boxed{
 \chi_U<\frac{g_+|x_0|^2}{N^2+M_2},}              \tag{7.7}
\]

then

\[
 \boxed{Q_- -U I\succ0.}                          \tag{7.8}
\]

**Proof.**  Equations (6.20) and (7.6) imply

\[
 \lambda_{\min}(Q_- -\epsilon I)
 \geq\frac{g_+|x_0|^2}{N^2+M_2}.                  \tag{7.9}
\]

Equations (7.4) and (7.7) therefore give

\[
 U-\epsilon
 <\lambda_{\min}(Q_- -\epsilon I).               \tag{7.10}
\]

Subtracting `(U-epsilon)I` proves (7.8).  \(\square\)

Condition (7.7) has a scale-invariant boundary-normalized form.  Put

\[
 \|\xi\|^2=\sum_{n=-N}^N|\xi_n|^2,
 \qquad
 \mathcal C_x=(N^2+M_2)
 \frac{\|\xi\|^2}{|\xi_0|^2}.                    \tag{7.11}
\]

Because `x=c*xi` is a unit vector,

\[
 |x_0|^2=\frac{|\xi_0|^2}{\|\xi\|^2}.            \tag{7.12}
\]

Thus (7.7) is exactly

\[
 \boxed{
 \frac{\chi_U}{g_+}\,\mathcal C_x<1.}             \tag{7.13}
\]

This isolates a single dimensionless coefficient-conditioning reserve.
Pointwise nonnegativity of the boundary-normalized even trigonometric
polynomial would prove the all-axis sign, but it does not by itself bound
`mathcal C_x`: a nonnegative trigonometric polynomial may concentrate while
its boundary normalization becomes poorly conditioned.

Still under the all-axis hypothesis (6.9), so that `T_->0`, the source
equation `T_-u=-beta` also gives

\[
 (Q_- -sI)^{-1}\beta
 =-\left(I+(s-\epsilon)(Q_- -sI)^{-1}\right)u.     \tag{7.14}
\]

For `s<=epsilon`, its norm is at most `||u||`.  For
`epsilon<=s<=U`, if `m_-=lambda_min(T_-)` and `U-epsilon<m_-`, then

\[
 \|(Q_- -sI)^{-1}\beta\|
 \leq\frac{m_-}{m_--(U-\epsilon)}\|u\|.           \tag{7.15}
\]

This still requires the shifted reserve and quantitative control of the
boundary-normalized vector.  There is no analogous automatic estimate for
`(Q_- -sI)^(-1)Dkappa`; its endpoint inverse energy is a genuinely new
arithmetic quantity.

## 8. Exact missing arithmetic inputs

The exact algebra leaves two distinct theorem gates.

For the transverse middle solve, the minimum cancellation-preserving input
is (4.4), equivalently (4.5), for the actual source-normalized prolate state
and an explicit arithmetic schedule.  If one instead insists on bounding
the odd reconstruction factor by factor, one must prove both endpoint odd
response estimates from (4.1) and a relative determinant floor such as
(3.14).  The `N=1` family shows that the current structural hypotheses do
not provide that floor.  Factor-by-factor control is therefore a stronger
route and should not replace (4.4) without an arithmetic reason.

For the shifted odd sign, Theorem 7.2 requires all of the following on the
actual arithmetic sequence:

1. the independent shifted even-complement comparison `A-U I>0`, yielding
   the simple even ground and `g_+>0`;
2. the source boundary nonvanishing `c=<eta,x>!=0` and the zero-mode
   nonvanishing `x_0!=0`;
3. the all-axis sign `A_x(alpha)>0` for every `alpha>=0`, or an equally
   strong source-specific replacement;
4. a quantitative coefficient-conditioning estimate strong enough to
   prove `(chi_U/g_+)*mathcal C_x<1`.

The current source lock proves none of the required schedule-uniform bounds
for `M_2`, `|xi_0|^(-1)`, `chi_U/g_+`, the endpoint odd inverse energy, or
the normalized middle resolvent.  The determinant identities, endpoint
reductions, and coefficient reserve above are exact reductions only.  They
must not be promoted to an arithmetic sign theorem, an asymptotic bridge,
or an RH claim.  The formal status is `P0_INVALIDATED`.
