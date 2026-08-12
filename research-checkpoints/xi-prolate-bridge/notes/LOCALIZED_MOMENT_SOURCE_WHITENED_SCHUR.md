# Localized moments and source-whitened signed Schur complements

## 0. Status and claim boundary

This note proves finite measure-theoretic and finite-dimensional reductions.
It does not prove a positive prolate--Weil sector, equation (5.2) of
DIRECT_RH_ATTACK.md, locally uniform determinant convergence, or the Riemann
hypothesis.  The repository terminal state remains P0_INVALIDATED.

The new conclusions are:

1. the total prime second moment can be replaced by an exact upper-one
   localized energy;
2. a lower-one mean has a sharp mean--variance floor with an explicit
   stop-loss witness;
3. a Hermitian compression has the analogous trace--variance spectral floor;
4. the quotient source metric can be retained exactly in the signed Schur
   test;
5. a complete signature-feature identity retains positive/negative
   low--high cancellation in the original signed operator.

The note deliberately does not promote Fourier residue classes to inversion
parity at finite lambda.  In particular, it proves no separate growing
0 modulo 4 even or 2 modulo 4 odd prolate coframe.

## 1. Locked analytic conventions

The source prolate functions live on

\[
 [-\lambda,\lambda]
\]

with Lebesgue measure and zero extension.  The physical additive logarithmic
interval is

\[
 [-\log\lambda,\log\lambda].
\]

The Fourier convention is

\[
 \widehat f(t)=\int_{\mathbb R}f(y)e^{-ity}\,dy,
 \qquad d\nu(t)=\frac{dt}{2\pi}.
\]

Multiplicative inversion is \(Jf(u)=f(u^{-1})\), and in the additive
coordinate it is reflection \(Jf(y)=f(-y)\).  Reflection is never dropped.
Every prime power \(n\leq\lambda^2\) is retained, including the endpoint,
and the source minus sign is

\[
 m_\lambda(t)=2\theta'(t)-2S_\lambda(t),\qquad
 S_\lambda(t)=
 \sum_{n\leq\lambda^2}\frac{\Lambda(n)}{\sqrt n}
                 \cos(t\log n).                         \tag{1.1}
\]

All prolate combinations retain the source zero-Lebesgue-integral
normalization.  Unit normalization is not substituted.  Equality in a
strict reserve is a rejection.

## 2. Lower-one and upper-one selectors

Let \((\Omega,\mu)\) be a finite positive measure space with

\[
 d=\mu(\Omega)\geq1
\]

and define the capacity-one selector set

\[
 {\cal A}_1=
 \left\{\alpha:0\leq\alpha\leq1,\quad
                  \int\alpha\,d\mu=1\right\}.            \tag{2.1}
\]

For a real integrable \(w\), its lower-one trimmed mean is

\[
 \ell_\mu(w)=\inf_{\alpha\in{\cal A}_1}
                  \int\alpha w\,d\mu.                    \tag{2.2}
\]

Its stop-loss dual is

\[
 \ell_\mu(w)=
 \sup_{g\in\mathbb R}
 \left\{g-\int(g-w)_+\,d\mu\right\}.                     \tag{2.3}
\]

For a nonnegative integrable \(x\), define the upper-one trimmed mean

\[
 {\cal U}_\mu(x)=\sup_{\alpha\in{\cal A}_1}
                         \int\alpha x\,d\mu.              \tag{2.4}
\]

The exact stop-gain dual is

\[
 \boxed{
 {\cal U}_\mu(x)=
 \inf_{a\in\mathbb R}
 \left\{a+\int(x-a)_+\,d\mu\right\}.}                    \tag{2.5}
\]

Indeed, pointwise

\[
 \alpha x\leq a\alpha+(x-a)_+.
\]

After integration this proves one inequality.  A top-unit quantile selector,
with fractional selection on a level set when necessary, proves equality.
This also handles atoms.  If \(d=1\), every feasible selector equals one
almost everywhere.

## 3. Localized prime energy

For the high physical space \(H\), let

\[
 d\mu_H(t)=\kappa_H(t)\frac{dt}{2\pi},
 \qquad \mu_H(\mathbb R)=\dim H,
\]

where \(\kappa_H\) is the diagonal of the Fourier-side projection kernel.
Define

\[
 \mathfrak M_H=
 \sup_{\alpha\in{\cal A}_1}
 \int\alpha(t)S_\lambda(t)^2\,d\mu_H(t).                 \tag{3.1}
\]

By (2.5),

\[
 \boxed{
 \mathfrak M_H=
 \inf_{a\in\mathbb R}
 \left\{a+\int(S_\lambda(t)^2-a)_+\,d\mu_H(t)\right\}.}  \tag{3.2}
\]

This is no larger than the total second moment

\[
 M_H=\int S_\lambda(t)^2\,d\mu_H(t),                    \tag{3.3}
\]

and it can be much smaller when harmless high directions are appended.

Put

\[
 b(t)=2\theta'(t)-U,\qquad
 w(t)=b(t)-2S_\lambda(t).                               \tag{3.4}
\]

For every feasible selector, Cauchy--Schwarz gives

\[
 \left|\int\alpha(w-b)\,d\mu_H\right|
 \leq2\left(\int\alpha S_\lambda^2\,d\mu_H\right)^{1/2}
 \leq2\sqrt{\mathfrak M_H}.
\]

Taking infima on both sides proves the exact sharpening

\[
 \boxed{
 |\ell_{\mu_H}(w)-\ell_{\mu_H}(b)|
 \leq2\sqrt{\mathfrak M_H}.}                            \tag{3.5}
\]

Consequently,

\[
 \ell_{\mu_H}(b)-2\sqrt{\mathfrak M_H}>c_-
                                                                  \tag{3.6}
\]

is a sufficient strict high-space margin after an unabsorbed odd-pole
surcharge \(c_-\).  Equality in (3.6) is not a pass.

Unlike the total moment (3.3), the localized quantity (3.1) is nonlinear in
the leverage distribution.  The unrestricted prime-pair sum alone does not
reconstruct it.  A proof must control \(\kappa_H\) together with either the
selector problem (3.1) or the stop-gain problem (3.2).

## 4. A sharp lower-one mean--variance floor

Assume \(w\in L^2(\mu)\), and set

\[
 m=\frac1d\int w\,d\mu,\qquad
 \sigma^2=\frac1d\int(w-m)^2\,d\mu.                     \tag{4.1}
\]

For every \(\alpha\in{\cal A}_1\),

\[
 \int\alpha(w-m)\,d\mu
 =\int(\alpha-d^{-1})(w-m)\,d\mu.
\]

Since \(0\leq\alpha\leq1\),

\[
 \int(\alpha-d^{-1})^2\,d\mu
 =\int\alpha^2\,d\mu-\frac1d
 \leq1-\frac1d.
\]

Cauchy--Schwarz therefore gives

\[
 \boxed{
 \ell_\mu(w)\geq
 L:=m-\sigma\sqrt{d-1}.}                                \tag{4.2}
\]

For \(d>1\), the constant is sharp: put mass one at

\[
 m-\sigma\sqrt{d-1}
\]

and mass \(d-1\) at

\[
 m+\frac{\sigma}{\sqrt{d-1}}.
\]

### 4.1 Explicit stop-loss witness

Suppose \(d>1\) and \(\sigma>0\).  Define

\[
 \eta_*=\frac{d\sigma}{2\sqrt{d-1}},\qquad
 g_*=L+\eta_*
 =m+\frac{(2-d)\sigma}{2\sqrt{d-1}}.                    \tag{4.3}
\]

For every real \(x\) and every \(\eta>0\),

\[
 x_+\leq\frac{(x+\eta)^2}{4\eta}.                       \tag{4.4}
\]

Applying (4.4) with \(x=g_*-w\) and \(\eta=\eta_*\), then using
the first two moments, gives

\[
 V(g_*):=\int(g_*-w)_+\,d\mu
 \leq\eta_*=g_*-L.                                      \tag{4.5}
\]

Thus, if \(c\geq0\) and \(L>c\), then \(g_*>0\) and

\[
 V(g_*)+c<g_*.                                          \tag{4.6}
\]

If \(L=c\), the witness has zero reserve and must be rejected.

If \(\sigma=0\), then \(w=m\) almost everywhere and \(g=m\) is an exact
witness whenever the desired strict margin is below \(m\).

If \(d=1\), every feasible selector is one almost everywhere, so

\[
 \ell_\mu(w)=m                                           \tag{4.7}
\]

even when \(\sigma>0\).  In the remaining case \(\sigma>0\), for \(c<m\),
an explicit finite witness follows by choosing

\[
 y\geq\frac{\sigma^2}{4(m-c)},\qquad
 g=m+y,\qquad \eta=\sqrt{y^2+\sigma^2}.
\]

Then the same quadratic majorant gives

\[
 V(g)\leq\frac{y+\eta}{2}<g-c.                          \tag{4.8}
\]

The condition \(c\geq0\) in the simple \(d>1\) positive-\(g\) implication
is part of the theorem.

## 5. Hermitian trace--variance floor

Let \(A=A^*\) act on an \(n\)-dimensional space.  Put

\[
 m_A=\frac{\operatorname{tr}A}{n},\qquad
 \sigma_A^2=
 \frac{\operatorname{tr}(A-m_AI)^2}{n}.                 \tag{5.1}
\]

If \(x_i\) are the eigenvalue deviations and \(x_1\) is the smallest, then
\(\sum_i x_i=0\).  Cauchy--Schwarz on the other \(n-1\) deviations yields

\[
 \boxed{
 \lambda_{\min}(A)\geq
 m_A-\sigma_A\sqrt{n-1}.}                               \tag{5.2}
\]

This is sharp when one eigenvalue equals the lower endpoint and the other
\(n-1\) eigenvalues are equal.  It is exact for \(n\leq2\).

For a multiplier compression \(A_H=P_HT_wP_H\),

\[
 \operatorname{tr}A_H=\int w(t)\,d\mu_H(t),             \tag{5.3}
\]

and, with \(K_H(s,t)\) the Fourier-side projection kernel relative to
\(d\nu(t)=dt/(2\pi)\),

\[
 \operatorname{tr}A_H^2
 =
 \iint w(s)w(t)|K_H(s,t)|^2
       \frac{ds\,dt}{(2\pi)^2}.                         \tag{5.4}
\]

Thus (5.2) can be reconstructed from the kernel without trusting stored
eigenvectors.  Formula (5.4) retains archimedean--prime covariance before
absolute values.  If a separate negative pole \(R_p\) remains, subtract
\(\lVert R_p\rVert\) from the resulting multiplier floor.  Do not subtract
it again if it is already included in \(A_H\).

## 6. Quotient source coordinates

Let the physical finite space split as

\[
 E=K\oplus H.
\]

Let a source synthesis map have range \(K\).  After restricting its domain
to

\[
 X_0=(\ker A)^\perp,
\]

write the resulting bijection as

\[
 A:X_0\longrightarrow K.
\]

The quotient metric is

\[
 \Delta=(AA^*)^\dagger\big|_K=(AA^*)^{-1}\big|_K,       \tag{6.1}
\]

and

\[
 \langle Ax,\Delta Ax\rangle=\lVert x\rVert^2.          \tag{6.2}
\]

Every minimum eigenvalue below is taken on \(X_0\).  In particular, source
whitening never replaces \(gA^*A\) by \(gI\) unless \(A\) is an isometry.

## 7. The positive-shorted signed comparison

Let

\[
 C={\cal X}^*{\cal X}\succeq0,\qquad
 R={\cal Y}^*{\cal Y}\succeq0,\qquad g>0.
\]

Write \({\cal X}_K={\cal X}P_K\) and similarly for the other blocks.  Let

\[
 Q_{\cal X}=I-P_{\operatorname{ran}({\cal X}_H)}.
\]

The positive short to \(K\) is

\[
 C_{/K}={\cal X}_K^*Q_{\cal X}{\cal X}_K.               \tag{7.1}
\]

The exact positive source matrix is

\[
 \boxed{
 G_+=
 gA^*A+
 (Q_{\cal X}{\cal X}_KA)^*
 (Q_{\cal X}{\cal X}_KA).}                              \tag{7.2}
\]

For the direct low block, put \(N_0={\cal Y}_KA\).  Then

\[
 A^*(gI+C_{/K}-R_{KK})A=G_+-N_0^*N_0.                  \tag{7.3}
\]

If

\[
 \alpha=\lambda_{\min}(G_+)>0,\qquad
 \theta_0=
 \lVert N_0G_+^{-1/2}\rVert^2,                          \tag{7.4}
\]

then positivity of (7.3) is equivalent to \(\theta_0<1\), and

\[
 gI+C_{/K}-R_{KK}
 \succeq(1-\theta_0)\alpha\Delta.                       \tag{7.5}
\]

### 7.1 Complete negative high round trip

Assume

\[
 \rho=\lVert R_{HH}\rVert<g,\qquad
 Z={\cal Y}_H{\cal Y}_H^*.
\]

Define

\[
 N=(I-Z/g)^{-1/2}{\cal Y}_KA.                           \tag{7.6}
\]

The Schur complement \(S_{\rm sh}\) of the fully positive-shorted
comparison

\[
 B_{\rm sh}=
 gI+\operatorname{diag}(C_{/K},0)-R                    \tag{7.7}
\]

satisfies

\[
 \boxed{
 A^*S_{\rm sh}A=G_+-N^*N.}                              \tag{7.8}
\]

Therefore

\[
 \boxed{
 \theta=\lVert NG_+^{-1/2}\rVert^2<1}                  \tag{7.9}
\]

is necessary and sufficient for positivity of this Schur complement, and

\[
 S_{\rm sh}\succeq(1-\theta)\alpha\Delta.               \tag{7.10}
\]

For every \(\mu<\alpha\),

\[
 S_{\rm sh}\succeq\mu\Delta
 \quad\Longleftrightarrow\quad
 \lVert N(G_+-\mu I)^{-1/2}\rVert^2\leq1.               \tag{7.11}
\]

This is a complete criterion for (7.7), not for the original
\(gI+C-R\).  Since

\[
 gI+C-R\succeq B_{\rm sh},                              \tag{7.12}
\]

it is sufficient for the original operator.  It is not necessary: positive
low--high coupling can rescue the original block after (7.7) fails.

The effective negative load in (7.8) is

\[
 R_{KK}+R_{KH}(gI-R_{HH})^{-1}R_{HK}
 =
 {\cal Y}_K^*(I-Z/g)^{-1}{\cal Y}_K.                    \tag{7.13}
\]

This retains orientation.  Replacing it by separate norms recovers the
older, generally much weaker scalar reserve.

## 8. Complete signature-feature identity for the original operator

Put

\[
 {\cal F}=
 \begin{pmatrix}{\cal X}\\{\cal Y}\end{pmatrix},
 \qquad
 {\cal J}=\operatorname{diag}(I,-I),
 \qquad
 B=gI+{\cal F}^*{\cal J}{\cal F}.                       \tag{8.1}
\]

Assume the original high block

\[
 D_B=gI_H+{\cal F}_H^*{\cal J}{\cal F}_H               \tag{8.2}
\]

is positive definite.  Define the feature-space matrix

\[
 {\cal M}_H=
 {\cal J}+g^{-1}{\cal F}_H{\cal F}_H^*.                 \tag{8.3}
\]

It is invertible, and Woodbury's identity gives the exact original Schur
complement

\[
 \boxed{
 S_B=gI_K+
 {\cal F}_K^*{\cal M}_H^{-1}{\cal F}_K.}                \tag{8.4}
\]

No positive block has been shorted away in (8.4).

Take the spectral positive/negative decomposition

\[
 {\cal M}_H^{-1}=L_+-L_-,
 \qquad L_\pm\succeq0,\qquad L_+L_-=0.                  \tag{8.5}
\]

Let

\[
 T={\cal F}_KA,\qquad
 G=gA^*A+T^*L_+T,\qquad
 N=L_-^{1/2}T.                                          \tag{8.6}
\]

Then

\[
 A^*S_BA=G-N^*N.                                        \tag{8.7}
\]

Because \(A\) is injective on \(X_0\), \(G\) is positive definite.  The
original signed operator therefore obeys the complete criterion

\[
 \boxed{
 B\succ0
 \quad\Longleftrightarrow\quad
 D_B\succ0\ \hbox{and}\
 \lVert NG^{-1/2}\rVert^2<1.}                           \tag{8.8}
\]

If \(\alpha_{\rm full}=\lambda_{\min}(G)\) and the squared norm in (8.8)
is \(\theta_{\rm full}<1\), then

\[
 S_B\succeq
 (1-\theta_{\rm full})\alpha_{\rm full}\Delta.          \tag{8.9}
\]

This is the cancellation-preserving low-space target.  An asymptotic proof
still has to control \({\cal M}_H^{-1}\), the physical feature orientation,
and the source Gram on one common schedule.

## 9. Quantitative coframe necessity

Suppose for the positive-shorted direct low block that

\[
 gI-R_{KK}+C_{/K}\succeq\mu\Delta,\qquad \mu>0.         \tag{9.1}
\]

Pulling back by \(A\), dropping the negative term, and using
\(C_{/K}\preceq\lVert C_{/K}\rVert I\) gives

\[
 \boxed{
 A^*A\succeq
 \frac{\mu}{g+\lVert C_{/K}\rVert}I.}                   \tag{9.2}
\]

Thus qualitative injectivity or eventual span cannot prove a quotient
floor of fixed scale.  A quantitative physical coframe estimate is
unavoidable.

For a source subspace \(F\) and the corresponding normalized adjoint
sampling operator \(T\), the concrete missing estimate has the form

\[
 \lVert P_FT^*x\rVert^2
 \geq\gamma_{\lambda,N}\lVert x\rVert^2.                \tag{9.3}
\]

The dependence of \(\gamma_{\lambda,N}\) on the growing labels is part of
the theorem still required.

## 10. Exact regression models

### 10.1 Localized energy and covariance

Take two atoms of mass one and

\[
 b=(10,10),\qquad S=(4,-4),\qquad w=b-2S=(2,18).
\]

Then

\[
 \ell(b)=10,\quad
 \ell(w)=2,\quad
 \mathfrak M=16,\quad
 M=32.
\]

The localized inequality (3.5) is exact:

\[
 |\ell(w)-\ell(b)|=8=2\sqrt{\mathfrak M}.
\]

The combined mean and standard deviation are \(m=10\), \(\sigma=8\), so
(4.2) also gives the exact floor 2.  With \(c=1\), the localized and
combined tests pass strictly.  With \(c=2\), equality is rejected.  The
separated total-moment test fails already at \(c=1\), since

\[
 (10-1)^2=81<128=4M.
\]

### 10.2 Hermitian trace--variance model

Let

\[
 A=
 \frac1{25}
 \begin{pmatrix}
 306&-192\\
 -192&194
 \end{pmatrix}.
\]

Then

\[
 \operatorname{tr}A=20,\qquad
 \operatorname{tr}(A-10I)^2=128,\qquad
 \det A=36.
\]

Formula (5.2) gives the exact smallest eigenvalue 2 without importing an
eigenvector.

### 10.3 Source-whitened anisotropic separation

Let \(K=\operatorname{span}(e_1,e_2)\),
\(H=\operatorname{span}(e_3)\), \(A=I_2\), \(g=1\), and

\[
 C=\operatorname{diag}(4,0,0),\qquad
 R=
 \begin{pmatrix}
 1&0&1/2\\
 0&0&0\\
 1/2&0&3/4
 \end{pmatrix}.                                        \tag{10.1}
\]

A rational Gram factor for \(R\) has columns

\[
 y_1=(1,0,0)^T,\qquad y_2=0,\qquad
 y_3=(1/2,1/2,1/2)^T.
\]

Here

\[
 G_+=\operatorname{diag}(5,1),\qquad
 N^*N=\operatorname{diag}(2,0),\qquad
 \theta=\frac25.
\]

The exact Schur complement is

\[
 S_{\rm sh}=\operatorname{diag}(3,1)\succ0,
\]

and (7.10) certifies the conservative floor \(3I/5\).

The older scalar reserve has

\[
 \rho=\frac34,\quad \beta=1,\quad
 \eta=g-\rho=\frac14,\quad \mu=1,
\]

so

\[
 \rho\beta=\frac34>\frac14=\eta\mu.
\]

Thus that scalar sufficient test fails while the orientation-preserving
criterion passes.

### 10.4 Complete signed-feature identity

Let \(K\) and \(H\) both be one-dimensional, \(g=1\),
\({\cal J}=\operatorname{diag}(1,-1)\), and

\[
 {\cal F}=
 \begin{pmatrix}
 2&1\\
 1&0
 \end{pmatrix},
 \qquad A=2.
\]

Then

\[
 B=I+{\cal F}^*{\cal J}{\cal F}
 =
 \begin{pmatrix}4&2\\2&2\end{pmatrix},
\quad D_B=2,
\quad S_B=2.
\]

Moreover,

\[
 {\cal M}_H=\operatorname{diag}(2,-1),\qquad
 {\cal M}_H^{-1}=\operatorname{diag}(1/2,-1).
\]

In source coordinates,

\[
 gA^*A=4,\quad G=12,\quad N^*N=4,\quad
 \theta_{\rm full}=\frac13,
\]

and (8.9) recovers the exact physical Schur floor 2 after multiplication by
\(\Delta=1/4\).  Replacing \(gA^*A\) by \(gI\) would corrupt these identities.

### 10.5 Coframe scale

Take \(A=\operatorname{diag}(1/3,1)\), \(g=1\), and \(C=R=0\).  Then

\[
 \Delta=\operatorname{diag}(9,1),\qquad
 I\succeq\frac19\Delta,
\]

and (9.2) is an equality in the weak direction:

\[
 A^*A=\operatorname{diag}(1/9,1)\succeq\frac19I.
\]

The family \(A_\varepsilon=\operatorname{diag}(\varepsilon,1)\) remains
injective for every \(\varepsilon>0\), while its best quotient-relative
floor tends to zero.  Rank alone is therefore insufficient.

## 11. What remains open

The reductions isolate two possible high-space targets:

\[
 \ell_{\mu_H}(b)-2\sqrt{\mathfrak M_H}>c_-              \tag{11.1}
\]

or

\[
 m_{A_H}-\sigma_{A_H}\sqrt{\dim H-1}>c_-.               \tag{11.2}
\]

Neither estimate is proved on the required unbounded schedule.  The first
requires a localized leverage/prime large-deviation theorem.  The second
requires a trace-square covariance estimate much smaller than the generic
dimension-times-variance scale.

On the low space, the corresponding exact target is

\[
 \theta_{\rm full}(\lambda,N)\leq1-\delta_{\lambda,N}
\]

together with a useful lower bound for \(\alpha_{\rm full}\) and the
quantitative coframe bound (9.3).  Fixed-index prolate convergence does not
supply these growing-label constants.

No zeta-zero list, global Weil positivity, cached matrix, real-axis
eigenvalue agreement, or determinant extrapolation is an input to this
note.
