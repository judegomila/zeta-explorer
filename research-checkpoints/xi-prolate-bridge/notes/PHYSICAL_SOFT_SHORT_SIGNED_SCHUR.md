# Physical soft-short factorization for the complete signed operator

## 0. Status and claim boundary

This note proves an exact finite-dimensional factorization of the original
signed parity operators.  It specializes the abstract signature-feature
identity to the source multiplier and pole features, eliminates the spectral
positive/negative decomposition of the feature matrix, and retains the
source quotient metric.

It does not prove any common-schedule high ratio, residual negative-feature
bound, source coframe, signed sector floor, equation (5.2) of
`DIRECT_RH_ATTACK.md`, or determinant limit.  The repository state remains
`P0_INVALIDATED`.

## 1. Locked source conventions and the actual parity features

The source functions live on `[-lambda,lambda]` with Lebesgue measure and
zero extension.  The physical logarithmic interval is

\[
 I_\lambda=[-\log\lambda,\log\lambda].
\]

The Fourier convention and Plancherel measure are

\[
 \widehat f(t)=\int_{\mathbb R}f(y)e^{-ity}\,dy,
 \qquad d\nu(t)={dt\over2\pi}.
\]

Inversion is reflection, `Jf(y)=f(-y)`.  Every prime power
`n<=lambda^2` is included, and the source minus sign is retained in

\[
 m_\lambda(t)=2\theta'(t)-2S_\lambda(t),\qquad
 S_\lambda(t)=\sum_{1<n\leq\lambda^2}
 {\Lambda(n)\over\sqrt n}\cos(t\log n).                 \tag{1.1}
\]

Let `U` be a source-reconstructed real shift and let `g>0` be exact.  Put

\[
 w=m_\lambda-U,\qquad a=(w-g)_+,
 \qquad v=(g-w)_+.                                      \tag{1.2}
\]

For a finite parity space, define

\[
 X_af=\sqrt a\,\widehat f,qquad
 Y_vf=\sqrt v\,\widehat f,qquad
 \pi_\epsilon f=\sqrt2\,\widehat f(i/2).                \tag{1.3}
\]

The complete source features are

\[
 {\cal X}_+=(X_a,\pi_+),\qquad {\cal Y}_+=Y_v,           \tag{1.4}
\]

\[
 {\cal X}_-=X_a,\qquad {\cal Y}_-=(Y_v,\pi_-).          \tag{1.5}
\]

Thus the positive pole is in the even positive feature, while the negative
pole is in the odd negative feature.  On either parity space,

\[
 \boxed{B_\epsilon=Q_{\lambda,\epsilon}-UI
 =gI+{\cal X}_\epsilon^*{\cal X}_\epsilon
      -{\cal Y}_\epsilon^*{\cal Y}_\epsilon.}           \tag{1.6}
\]

The actual comparison spaces are

\[
 X_{N,+}=E_N^+\cap\kappa^\perp,
 \qquad X_{N,-}=E_N^-.                                  \tag{1.7}
\]

The projected pole representer is always taken in the actual space in
(1.7).  A Fourier residue class is not identified with inversion parity.
Every prolate source column retains its source zero-Lebesgue-integral
normalization; unit normalization is not substituted.

## 2. Abstract `g`-soft factorization

Let a finite Hilbert space split orthogonally as `K direct-sum H`, and let

\[
 B=gI+X^*X-Y^*Y,qquad g>0.                              \tag{2.1}
\]

Write `X_K,X_H,Y_K,Y_H` for the restrictions to the two summands and put

\[
 A_0=gI_H+X_H^*X_H,\qquad
 Z=Y_HA_0^{-1}Y_H^*,\qquad {\cal W}=I-Z.                 \tag{2.2}
\]

The high block is

\[
 D_B=A_0-Y_H^*Y_H.                                      \tag{2.3}
\]

The positive feature matrix used in the earlier signature identity is

\[
 {\cal M}_H=
 \begin{pmatrix}I&0\\0&-I\end{pmatrix}
 +g^{-1}\begin{pmatrix}X_H\\Y_H\end{pmatrix}
          \begin{pmatrix}X_H^*&Y_H^*\end{pmatrix}.       \tag{2.4}
\]

Define

\[
 {\cal P}=I+g^{-1}X_HX_H^*,
 \qquad E=Y_HA_0^{-1}X_H^*.                             \tag{2.5}
\]

Direct multiplication gives the non-spectral factorization

\[
 \boxed{
 {\cal M}_H=
 \begin{pmatrix}I&0\\E&I\end{pmatrix}
 \begin{pmatrix}{\cal P}&0\\0&-{\cal W}\end{pmatrix}
 \begin{pmatrix}I&E^*\\0&I\end{pmatrix}.}              \tag{2.6}
\]

The ordinary positive block criterion applied to

\[
 \begin{pmatrix}A_0&Y_H^*\\Y_H&I\end{pmatrix}
\]

shows

\[
 \boxed{D_B\succ0\quad\Longleftrightarrow\quad
        {\cal W}\succ0.}                                \tag{2.7}
\]

Under (2.7), (2.6) is invertible and

\[
 {\cal M}_H^{-1}=
 \begin{pmatrix}
 {\cal P}^{-1}-E^*{\cal W}^{-1}E&E^*{\cal W}^{-1}\\
 {\cal W}^{-1}E&-{\cal W}^{-1}
 \end{pmatrix}.                                         \tag{2.8}
\]

Define the `g`-soft positive short and the residual negative feature by

\[
 C_{/K}^{[g]}=X_K^*X_K-
 X_K^*X_HA_0^{-1}X_H^*X_K,                              \tag{2.9}
\]

\[
 P_K^{[g]}=gI_K+C_{/K}^{[g]},                            \tag{2.10}
\]

\[
 \widetilde Y_K=Y_K-Y_HA_0^{-1}X_H^*X_K.                \tag{2.11}
\]

The Schur complement of the original high block (2.3) is exactly

\[
 \boxed{
 S_B=P_K^{[g]}-
 \widetilde Y_K^*{\cal W}^{-1}\widetilde Y_K.}           \tag{2.12}
\]

One proof first eliminates the high block of `gI+X*X`, which produces
(2.10) and transforms `Y_K` into (2.11), and then applies Woodbury to the
remaining negative feature.  Equations (2.6)--(2.8) give the same identity
from the complete signature-feature formula.

The soft short is positive and

\[
 P_K^{[g]}=gI_K+
 gX_K^*(gI+X_HX_H^*)^{-1}X_K\succeq gI_K.                \tag{2.13}
\]

If `C=X*X` and `C_/K` is its hard Krein short, then

\[
 C_{/K}^{[g]}\succeq C_{/K}.                             \tag{2.14}
\]

Unlike the earlier fully positive-shorted lower comparison, (2.12) is an
identity for the original signed operator.  Positive low--high coupling is
not discarded: it regularizes the high negative load and residualizes the
low negative feature.

## 3. Exact physical high ratios

Apply Section 2 with `X={cal X}_epsilon` and `Y={cal Y}_epsilon` from
(1.4)--(1.5).  The high criterion (2.7) is

\[
 \zeta_\epsilon:=\lVert Z_\epsilon\rVert<1.              \tag{3.1}
\]

Equivalently,

\[
 \zeta_\epsilon=
 \left\lVert
 (gI+C_{\epsilon,HH})^{-1/2}
 R_{\epsilon,HH}
 (gI+C_{\epsilon,HH})^{-1/2}
 \right\rVert.                                          \tag{3.2}
\]

In source integrals these are the exact Rayleigh quotients

\[
 \zeta_+=\sup_{0\ne h\in H_+}
 {\displaystyle\int v|\widehat h|^2d\nu
  \over
  \displaystyle g\lVert h\rVert^2+
  \int a|\widehat h|^2d\nu+2|\widehat h(i/2)|^2},       \tag{3.3}
\]

\[
 \zeta_-=\sup_{0\ne h\in H_-}
 {\displaystyle\int v|\widehat h|^2d\nu
       +2|\widehat h(i/2)|^2
  \over
  \displaystyle g\lVert h\rVert^2+
  \int a|\widehat h|^2d\nu}.                            \tag{3.4}
\]

The odd pole is therefore an inseparable part of the numerator in (3.4).
If its representer is included in the physical low space, its high row
vanishes, but its residual low row remains in (2.11).  It may not be
dropped.  In the even sector the positive pole remains in the denominator
of (3.3).

## 4. Source-whitened exact contraction

Let `A:X_0->K` be the declared physical synthesis restricted to
`X_0=(ker A)^perp`, so it is a bijection onto `K`.  For the present plus
construction this is the block-diagonally source-scaled
`W_L D_L^(-1/2)`; it is not silently replaced by a full exterior Gram.
Put

\[
 \Delta=(AA^*)^\dagger\big|_K,
 \qquad \langle Ax,\Delta Ax\rangle=\lVert x\rVert^2.    \tag{4.1}
\]

Define

\[
 G=A^*P_K^{[g]}A,
 \qquad N={\cal W}^{-1/2}\widetilde Y_KA.                \tag{4.2}
\]

Then (2.12) pulls back exactly as

\[
 \boxed{A^*S_BA=G-N^*N.}                                \tag{4.3}
\]

The base term is `g*A*A`, not `g*I`, unless `A` is an isometry.  Since
`P_K^[g]>=gI`, the matrix `G` is positive definite.  Therefore

\[
 \boxed{
 \vartheta_{\rm soft}=
 \lVert NG^{-1/2}\rVert^2<1}                            \tag{4.4}
\]

is necessary and sufficient for positivity of the original Schur
complement, once (3.1) holds.  It has the same pass/fail meaning as the
spectral signature-feature criterion, but does not require the spectral
positive/negative decomposition of `{cal M}_H^(-1)`.

For `0<tau<=1`, the stronger quantitative condition

\[
 \lVert NG^{-1/2}\rVert^2\leq1-\tau                    \tag{4.5}
\]

gives

\[
 S_B\succeq\tau P_K^{[g]}\succeq\tau gI_K.              \tag{4.6}
\]

If also

\[
 G\succeq\alpha I_{X_0},\qquad\alpha>0,                 \tag{4.7}
\]

then

\[
 \boxed{S_B\succeq\tau\alpha\Delta.}                  \tag{4.8}
\]

## 5. A scalarized sufficient schedule target

Let

\[
 \delta=1-\lVert Z\rVert,
 \qquad
 \gamma=\lVert\widetilde Y_K(P_K^{[g]})^{-1/2}\rVert^2. \tag{5.1}
\]

The source-coordinate expression has the same norm:

\[
 \gamma=
 \lVert\widetilde Y_KA\,G^{-1/2}\rVert^2.              \tag{5.2}
\]

If, for some `delta,tau>0`,

\[
 \lVert Z\rVert\leq1-\delta,
 \qquad \gamma\leq(1-\tau)\delta,                      \tag{5.3}
\]

then

\[
 D_B\succeq\delta gI_H,
 \qquad S_B\succeq\tau P_K^{[g]}.                       \tag{5.4}
\]

Indeed, `{cal W}^(-1)<=delta^(-1)I`, so the negative term in
(2.12) is at most `(gamma/delta)P_K^[g]`.  The first inequality follows
from `D_B=A_0^(1/2)(I-A_0^(-1/2)Y_H^*Y_HA_0^(-1/2))A_0^(1/2)` and
`A_0>=gI`.

For a full-sector floor define

\[
 \chi=\lVert
 D_B^{-1/2}B_{HK}\Delta^{-1/2}\rVert
 =\lVert D_B^{-1/2}B_{HK}A\rVert.                        \tag{5.5}
\]

The equality uses that `A` is a source-coordinate isometry from the
identity metric to `Delta`.  Block elimination and
`||[[I,0],[-C,I]]||<=1+||C||` give

\[
 \boxed{
 B\succeq\nu(\Delta\mathbin\oplus D_B),\qquad
 \nu={\min\{\tau\alpha,1\}\over(1+\chi)^2}.}            \tag{5.6}
\]

Consequently,

\[
 \lambda_{\min}(B)\geq
 \nu\min\{\lVert A\rVert^{-2},\delta g\}.              \tag{5.7}
\]

If a certified source value satisfies `U>=q`, the same lower bound applies
to `Q-qI`, because `Q-qI=B+(U-q)I`.

Equations (5.3), (4.7), and (5.5) must be established for both parity
spaces on one common growing schedule.  No such estimates are proved here.
Equality in (3.1) or (4.4), `delta=0`, `tau=0`, or `alpha=0` is a rejection.

## 6. Exact finite regression models

### 6.1 Soft elimination succeeds when hard over-shorting fails

Take `K=span(e_1)`, `H=span(e_2)`, `g=1`,

\[
 X=(1,1),\qquad Y=(1,1),\qquad A=2.                     \tag{6.1}
\]

Then `B=I`.  The hard short of `X*X` to `K` is zero, so the fully
positive-shorted comparison is `I-Y*Y`, which is indefinite.  In contrast,

\[
 A_0=2,\quad Z={1\over2},\quad {\cal W}={1\over2},
 \quad P_K^{[g]}={3\over2},\quad
 \widetilde Y_K={1\over2}.                              \tag{6.2}
\]

Thus

\[
 S_B={3\over2}-{(1/2)^2\over1/2}=1,
 \qquad\vartheta_{\rm soft}={1\over3}.                  \tag{6.3}
\]

The non-isometric source map gives

\[
 \Delta={1\over4},\qquad G=6,
 \qquad N^*N=2.                                         \tag{6.4}
\]

Replacing the required base term `g*A*A=4` by `g*I=1` corrupts (6.4).

### 6.2 Equality is rejected

With `g=1`, `X=0`, `Y=(1,0)`, and the same `K,H`, one has

\[
 Z=0,\qquad P_K^{[g]}=1,
 \qquad\widetilde Y_K=1,
 \qquad\vartheta_{\rm soft}=1,
 \qquad S_B=0.                                          \tag{6.5}
\]

The boundary is not positive and must not be reported as a pass.

### 6.3 The odd negative pole cannot be omitted

Let `g=1`, `X=0`, and use two negative feature rows

\[
 Y=\begin{pmatrix}0&1/2\\1&0\end{pmatrix},             \tag{6.6}
\]

where the second row models the odd pole.  The high block is positive, but
the pole makes `vartheta_soft=1` and `S_B=0`.  Omitting its row would give a
strictly positive low Schur complement.  A verifier must therefore reject
an artifact that drops this row.

## 7. Relation to the earlier exact criterion

The abstract Woodbury identity and the existence of a complete
signature-feature contraction were already proved in
`notes/LOCALIZED_MOMENT_SOURCE_WHITENED_SCHUR.md`.  The new content here is
the actual parity/pole feature assignment, the explicit non-spectral
factorization (2.6), the `g`-soft short (2.9), and the residual feature
(2.11).

Although `a(t)v(t)=0` pointwise, compression generally gives
`X_HY_H^*!=0`.  These compressed feature products cannot be replaced by
orthogonal support projectors.  Also, `T_a` need not be bounded on the full
infinite physical space; every statement here is on the declared finite
spaces.

The exact next analytic obligation is to prove, for both parities on one
common unbounded schedule, strict bounds of the form (5.3), a quantitative
source floor (4.7), and the cross control (5.5).  Current pinned estimates do
not establish any of them.
